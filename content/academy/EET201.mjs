/**
 * EET201 — Entertainment and Event Technology. Khối Quản trị Kinh doanh (BBA),
 * FPTU, Kỳ 3. Trích dẫn giáo trình: "Technical Production for Events",
 * "Sound and Lighting for Events", tài liệu AV/staging, whitepapers event tech.
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${ lồng trong nội dung; "\n" → \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('eet201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EET201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Entertainment and Event Technology — sound, lighting, video/LED, staging &amp; rigging, livestream and event-management software — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EET201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Technical Production for Events</em> — the standard reference for AV, lighting and staging planning for live events.</li>
<li><em>Sound and Lighting for Events</em> — sound reinforcement and stage lighting fundamentals for events specifically (not concert touring).</li>
<li>AV/staging vendor documentation and event-tech whitepapers (rigging load charts, LED pixel-pitch guides, livestream bitrate tables) — used throughout as real-world reference, cited inline where relevant.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog</a> — event technology &amp; production trends</li>
<li><a href="https://www.prosoundweb.com/" target="_blank" rel="noopener">ProSoundWeb</a> — pro audio for live events, free technical articles</li>
<li><a href="https://www.plsn.com/" target="_blank" rel="noopener">PLSN (Projection, Lights &amp; Staging News)</a> — lighting &amp; staging trade press</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ShowmakerMag" target="_blank" rel="noopener">Live Sound / production walkthroughs</a> — PA systems, mixing consoles on real shows</li>
<li>Search "projection mapping tutorial" and "concert rigging safety" for practical demonstrations from production companies.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.qlab.app/" target="_blank" rel="noopener">QLab</a> — show-control software for cues (audio/video/lighting) used in live events</li>
<li><a href="https://obsproject.com/" target="_blank" rel="noopener">OBS Studio</a> — free livestream/hybrid-event production software</li>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> / <a href="https://www.cvent.com/" target="_blank" rel="noopener">Cvent</a> — reference ticketing &amp; registration platforms</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — AV signal chain vocabulary, sound (PA/mixing/mic), lighting fixtures &amp; control (DMX).</li>
<li><strong>Practice</strong> — trace a signal chain diagram end to end; identify fixture types and rigging hardware from photos.</li>
<li><strong>Go deeper</strong> — video/LED walls, staging &amp; rigging safety, livestream/hybrid production, event-management software.</li>
<li><strong>Job-ready</strong> — read a technical rider, build a simple run-of-show, and know when to call a licensed rigger.</li>
</ol></div>`,
    `<span class="eyebrow">EET201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Công nghệ trong Giải trí &amp; Sự kiện — âm thanh, ánh sáng, video/LED, sân khấu &amp; rigging, livestream và phần mềm quản lý sự kiện — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EET201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Technical Production for Events</em> — tài liệu chuẩn về lập kế hoạch AV, ánh sáng và sân khấu cho sự kiện trực tiếp.</li>
<li><em>Sound and Lighting for Events</em> — nền tảng tăng âm và ánh sáng sân khấu dành riêng cho sự kiện (khác lưu diễn hoà nhạc).</li>
<li>Tài liệu hãng AV/staging và whitepaper công nghệ sự kiện (bảng tải rigging, hướng dẫn pixel-pitch LED, bảng bitrate livestream) — dùng làm tham chiếu thực tế xuyên suốt, trích dẫn tại chỗ khi liên quan.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.eventmanagerblog.com/" target="_blank" rel="noopener">Event Manager Blog</a> — xu hướng công nghệ &amp; sản xuất sự kiện</li>
<li><a href="https://www.prosoundweb.com/" target="_blank" rel="noopener">ProSoundWeb</a> — âm thanh chuyên nghiệp cho sự kiện trực tiếp, bài viết kỹ thuật miễn phí</li>
<li><a href="https://www.plsn.com/" target="_blank" rel="noopener">PLSN (Projection, Lights &amp; Staging News)</a> — tin ngành ánh sáng &amp; sân khấu</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li>Các video "live sound / production walkthrough" — hệ thống PA, bàn mixing trên show thật</li>
<li>Tìm "projection mapping tutorial" và "concert rigging safety" để xem minh hoạ thực tế từ các công ty sản xuất.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.qlab.app/" target="_blank" rel="noopener">QLab</a> — phần mềm điều khiển cue (âm thanh/video/ánh sáng) dùng trong sự kiện trực tiếp</li>
<li><a href="https://obsproject.com/" target="_blank" rel="noopener">OBS Studio</a> — phần mềm sản xuất livestream/hybrid miễn phí</li>
<li><a href="https://www.eventbrite.com/" target="_blank" rel="noopener">Eventbrite</a> / <a href="https://www.cvent.com/" target="_blank" rel="noopener">Cvent</a> — nền tảng bán vé &amp; đăng ký tham chiếu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — từ vựng chuỗi tín hiệu AV, âm thanh (PA/mixing/mic), thiết bị &amp; điều khiển ánh sáng (DMX).</li>
<li><strong>Luyện tập</strong> — dò một sơ đồ chuỗi tín hiệu từ đầu đến cuối; nhận diện loại đèn và phụ kiện rigging qua ảnh.</li>
<li><strong>Đào sâu thực tế</strong> — màn hình/LED, an toàn sân khấu &amp; rigging, sản xuất livestream/hybrid, phần mềm quản lý sự kiện.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc technical rider, dựng run-of-show đơn giản, và biết khi nào phải gọi rigger có chứng chỉ.</li>
</ol></div>`,
  ]]);

const intro = doc('eet201-0-1-overview', 'Course overview: Entertainment and Event Technology|||Tổng quan môn học: Công nghệ Giải trí & Sự kiện',
  'Vai trò công nghệ trong sự kiện hiện đại; các mảng kỹ thuật (âm thanh, ánh sáng, video, sân khấu, livestream, phần mềm); vai trò của "technical producer".',
  [[
    `<span class="eyebrow">EET201 · Lesson 0.1 · Overview</span>
<h2>Entertainment and Event Technology</h2>
<p class="lead">Every concert, conference, wedding or product launch runs on an invisible layer of <strong>technology</strong>: sound reinforcement, lighting, video/LED, staging structures, livestream feeds and the software that sells tickets and checks people in. This course teaches you the vocabulary, the equipment, and the safety rules a <strong>technical producer</strong> or event coordinator needs to plan, brief vendors, and troubleshoot on show day — without needing to be an electrical engineer.</p>
<h3>Why "technology" and not just "equipment"</h3>
<p>Event technology is a <strong>system</strong>, not a pile of gear: a microphone is useless without a mixer, a mixer is useless without speakers, and none of it works without power, cabling and a plan for what happens if something fails. Learning to read a <strong>signal chain</strong> — where does the signal originate, what processes it, where does it end up — is the single most useful skill in this course.</p>
<h3>Roadmap</h3>
<p>Overview &amp; AV fundamentals → sound systems (PA, mixing, microphones) → stage lighting &amp; effects → screens, video &amp; projection (LED walls, projection mapping) → staging, rigging &amp; technical safety → livestream, hybrid &amp; virtual events → event-management software (ticketing, check-in, registration) → emerging technology (AR/VR, RFID, AI) &amp; future trends.</p>
<div class="callout"><span class="badge">Role in the room</span> On a real production, the person who understands this material is the bridge between the <strong>creative brief</strong> ("we want it to feel epic") and the <strong>technical crew</strong> (sound, lighting, video, rigging engineers) who make it happen safely and on budget.</div>`,
    `<span class="eyebrow">EET201 · Bài 0.1 · Tổng quan</span>
<h2>Công nghệ trong Giải trí &amp; Sự kiện</h2>
<p class="lead">Mọi buổi hoà nhạc, hội nghị, tiệc cưới hay lễ ra mắt sản phẩm đều chạy trên một lớp <strong>công nghệ</strong> vô hình: tăng âm, ánh sáng, video/LED, kết cấu sân khấu, tín hiệu livestream và phần mềm bán vé, check-in. Môn này dạy bạn từ vựng, thiết bị và quy tắc an toàn mà một <strong>technical producer</strong> hoặc điều phối sự kiện cần để lập kế hoạch, brief nhà cung cấp, và xử lý sự cố trong ngày diễn ra show — mà không cần là kỹ sư điện.</p>
<h3>Vì sao gọi là "công nghệ" chứ không chỉ "thiết bị"</h3>
<p>Công nghệ sự kiện là một <strong>hệ thống</strong>, không phải một chồng máy: một micro vô dụng nếu không có mixer, mixer vô dụng nếu không có loa, và tất cả vô dụng nếu không có điện, dây cáp và kế hoạch dự phòng khi có gì hỏng. Học cách đọc một <strong>chuỗi tín hiệu (signal chain)</strong> — tín hiệu bắt đầu từ đâu, thứ gì xử lý nó, nó kết thúc ở đâu — là kỹ năng hữu dụng nhất trong môn này.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; nền tảng AV → hệ thống âm thanh (PA, mixing, microphone) → ánh sáng sân khấu &amp; hiệu ứng → màn hình, video &amp; trình chiếu (LED wall, projection mapping) → sân khấu, rigging &amp; an toàn kỹ thuật → livestream, hybrid &amp; virtual events → phần mềm quản lý sự kiện (ticketing, check-in, đăng ký) → công nghệ mới (AR/VR, RFID, AI) &amp; xu hướng tương lai.</p>
<div class="callout"><span class="badge">Vai trò trong phòng</span> Trên một sản xuất thật, người hiểu nội dung này là cầu nối giữa <strong>ý tưởng sáng tạo</strong> ("muốn nó thật hoành tráng") và <strong>đội kỹ thuật</strong> (kỹ sư âm thanh, ánh sáng, video, rigging) — những người biến ý tưởng đó thành hiện thực an toàn và đúng ngân sách.</div>`,
  ]]);

const c1 = doc('eet201-1-1-av-overview', '1.1 — Event technology & AV fundamentals|||1.1 — Tổng quan công nghệ sự kiện & AV',
  'Các mảng kỹ thuật sự kiện; chuỗi tín hiệu AV (nguồn→xử lý→khuếch đại→đầu ra); technical rider & site survey.',
  [[
    `<span class="eyebrow">EET201 · Chapter 1 · Lesson 1.1</span>
<h2>Event technology &amp; AV fundamentals</h2>
<h3>The six technical departments</h3>
<ul>
<li><strong>Audio</strong> — microphones, mixing, loudspeakers.</li>
<li><strong>Lighting</strong> — visibility, mood, effects, control (DMX).</li>
<li><strong>Video/LED</strong> — screens, LED walls, projection, camera feeds.</li>
<li><strong>Staging &amp; rigging</strong> — the physical structure everything hangs from or stands on.</li>
<li><strong>Broadcast/streaming</strong> — livestream, hybrid, virtual attendance.</li>
<li><strong>Event software</strong> — ticketing, registration, check-in, attendee apps.</li>
</ul>
<h3>The AV signal chain</h3>
<p>Almost every audio or video problem can be diagnosed by walking the <strong>signal chain</strong> — the path a signal takes from source to destination:</p>
<pre><code>Source (mic, laptop, camera)
  -> Processing (mixer, switcher, DSP)
    -> Amplification (power amp, video scaler)
      -> Output (speaker, screen, projector)
</code></pre>
<p>If sound or picture is missing, check each link in order: is the source live? Is it reaching the processor? Is the processor's output patched to the amplifier? Is the output device powered and receiving signal? This single habit resolves the majority of "nothing is working" moments on show day.</p>
<h3>Technical rider &amp; site survey</h3>
<p>A <strong>technical rider</strong> is the document a performer/speaker (or the production company) sends specifying exact equipment needs (channel count, power, rigging points, internet bandwidth). A <strong>site survey</strong> is the venue visit that checks what the space can actually provide (power capacity, ceiling rigging points, load-in access) against that rider — mismatches found here, not on show day, are cheap to fix.</p>
<div class="callout"><span class="badge">Golden rule</span> Technology exists to serve the <strong>audience experience</strong> and the <strong>content</strong> — never the reverse. A perfect signal chain that nobody can hear or see because of poor planning has failed at its job.</div>`,
    `<span class="eyebrow">EET201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan công nghệ sự kiện &amp; AV</h2>
<h3>Sáu mảng kỹ thuật</h3>
<ul>
<li><strong>Âm thanh</strong> — microphone, mixing, loa.</li>
<li><strong>Ánh sáng</strong> — tầm nhìn, không khí, hiệu ứng, điều khiển (DMX).</li>
<li><strong>Video/LED</strong> — màn hình, LED wall, trình chiếu, tín hiệu camera.</li>
<li><strong>Sân khấu &amp; rigging</strong> — kết cấu vật lý mà mọi thứ treo lên hoặc đứng trên.</li>
<li><strong>Truyền hình/streaming</strong> — livestream, hybrid, tham dự ảo.</li>
<li><strong>Phần mềm sự kiện</strong> — bán vé, đăng ký, check-in, app khách tham dự.</li>
</ul>
<h3>Chuỗi tín hiệu AV</h3>
<p>Hầu hết mọi sự cố âm thanh hay hình ảnh có thể chẩn đoán bằng cách dò theo <strong>chuỗi tín hiệu (signal chain)</strong> — đường đi của tín hiệu từ nguồn đến đích:</p>
<pre><code>Nguồn (mic, laptop, camera)
  -> Xử lý (mixer, switcher, DSP)
    -> Khuếch đại (power amp, video scaler)
      -> Đầu ra (loa, màn hình, máy chiếu)
</code></pre>
<p>Nếu mất tiếng hoặc mất hình, kiểm từng mắt xích theo thứ tự: nguồn có đang sống không? Nguồn có đến được bộ xử lý không? Đầu ra bộ xử lý có đấu vào bộ khuếch đại không? Thiết bị đầu ra có nguồn và đang nhận tín hiệu không? Chỉ một thói quen này đã giải quyết phần lớn các khoảnh khắc "không thứ gì chạy" trong ngày diễn.</p>
<h3>Technical rider &amp; site survey</h3>
<p><strong>Technical rider</strong> là tài liệu người biểu diễn/diễn giả (hoặc công ty sản xuất) gửi, ghi rõ nhu cầu thiết bị (số kênh, công suất điện, điểm treo rigging, băng thông internet). <strong>Site survey</strong> là buổi khảo sát địa điểm để kiểm không gian thực sự cung cấp được gì (công suất điện, điểm treo trên trần, đường vào load-in) so với rider đó — lệch pha phát hiện ở đây, không phải ngày diễn, thì rẻ để sửa.</p>
<div class="callout"><span class="badge">Luật vàng</span> Công nghệ tồn tại để phục vụ <strong>trải nghiệm khán giả</strong> và <strong>nội dung</strong> — không bao giờ ngược lại. Một chuỗi tín hiệu hoàn hảo mà không ai nghe/thấy được vì lập kế hoạch tồi thì đã thất bại nhiệm vụ.</div>`,
  ]]);

const c1q = quiz('eet201-quiz-1', 'Quiz 1 — Overview & AV fundamentals|||Quiz 1 — Tổng quan & nền tảng AV', [
  { id: 'q1', question: 'Chuỗi tín hiệu AV cơ bản đi theo thứ tự nào?', options: ['Đầu ra → Xử lý → Khuếch đại → Nguồn', 'Nguồn → Xử lý → Khuếch đại → Đầu ra', 'Khuếch đại → Nguồn → Đầu ra → Xử lý', 'Xử lý → Đầu ra → Nguồn → Khuếch đại'], correctIndex: 1, explanation: 'Signal chain: nguồn (mic/laptop) → xử lý (mixer/DSP) → khuếch đại → đầu ra (loa/màn hình).' },
  { id: 'q2', question: '"Technical rider" là gì?', options: ['Danh sách khách VIP', 'Tài liệu ghi nhu cầu thiết bị kỹ thuật của người biểu diễn/sản xuất', 'Hợp đồng thuê địa điểm', 'Kịch bản MC'], correctIndex: 1, explanation: 'Rider ghi rõ số kênh, công suất, điểm rigging, băng thông cần thiết.' },
  { id: 'q3', question: '"Site survey" dùng để làm gì?', options: ['Bán vé sự kiện', 'Kiểm địa điểm thực tế cung cấp được gì so với technical rider', 'Thiết kế ánh sáng', 'Dựng LED wall'], correctIndex: 1, explanation: 'Site survey đối chiếu khả năng thật của venue (điện, rigging, load-in) với rider để phát hiện lệch pha sớm.' },
]);

const c2 = doc('eet201-2-1-sound-systems', '2.1 — Sound systems: PA, mixing & microphones|||2.1 — Hệ thống âm thanh: PA, mixing & microphone',
  'Hệ thống PA (loa chính, loa monitor, sub); bàn mixing (kênh, gain, EQ, fader, aux); loại microphone (dynamic/condenser, có dây/không dây) & polar pattern.',
  [[
    `<span class="eyebrow">EET201 · Chapter 2 · Lesson 2.1</span>
<h2>Sound systems: PA, mixing &amp; microphones</h2>
<h3>The PA (public address) system</h3>
<ul>
<li><strong>Main (FOH) speakers</strong> — face the audience; carry the mixed programme sound.</li>
<li><strong>Monitor speakers</strong> — face performers/speakers so they can hear themselves; a separate mix from the mains.</li>
<li><strong>Subwoofers</strong> — handle low frequencies (bass, kick drum) that main speakers can't reproduce efficiently.</li>
</ul>
<p>Speaker placement and coverage matter as much as raw power: a speaker aimed at a wall produces echo, not sound reinforcement.</p>
<h3>The mixing console</h3>
<p>A mixer combines multiple inputs (mics, playback) into one or more outputs. Key controls on every channel:</p>
<pre><code>Channel strip (top to bottom):
  Gain     -> sets the input level from the source (avoid clipping)
  EQ       -> shapes tone (cut boomy lows, boost clarity in highs)
  Aux send -> sends a copy to monitors/effects (separate from main mix)
  Fader    -> sets that channel's level in the MAIN mix
</code></pre>
<h3>Microphones</h3>
<ul>
<li><strong>Dynamic mic</strong> — rugged, handles loud sound sources well (e.g. vocals, drums); no external power needed. Common: handheld vocal mics.</li>
<li><strong>Condenser mic</strong> — more sensitive and detailed, needs power (<strong>phantom power</strong>, +48V from the mixer); common for speech/lavalier and studio use, more fragile with loud/close sources.</li>
<li><strong>Wireless mic</strong> — frees the speaker from a cable but adds an RF (radio frequency) link that can suffer interference; always needs a frequency check before the event.</li>
</ul>
<p><strong>Polar pattern</strong> describes the directions a mic picks up sound from: <em>cardioid</em> (front-focused, rejects rear — most common for live events, reduces feedback) vs <em>omnidirectional</em> (picks up all around — natural for ambient/roundtable pickup, but far more prone to feedback near speakers).</p>
<div class="callout"><span class="badge">Feedback loop</span> That painful screech is a <strong>feedback loop</strong>: a mic picks up sound from a speaker, the mixer re-amplifies it, the speaker plays it louder, the mic picks it up again. Fix by lowering gain, aiming the mic's dead zone at the speaker, or cutting the resonant EQ frequency.</div>`,
    `<span class="eyebrow">EET201 · Chương 2 · Bài 2.1</span>
<h2>Hệ thống âm thanh: PA, mixing &amp; microphone</h2>
<h3>Hệ thống PA (public address)</h3>
<ul>
<li><strong>Loa chính (FOH)</strong> — hướng về khán giả; phát ra âm thanh chương trình đã mix.</li>
<li><strong>Loa monitor</strong> — hướng về người biểu diễn/diễn giả để họ tự nghe được mình; một mix riêng, khác mix chính.</li>
<li><strong>Subwoofer</strong> — xử lý tần số thấp (bass, trống kick) mà loa chính khó tái tạo hiệu quả.</li>
</ul>
<p>Vị trí và vùng phủ của loa quan trọng không kém công suất thô: một loa hướng vào tường tạo ra tiếng vang, không phải âm thanh hỗ trợ.</p>
<h3>Bàn mixing</h3>
<p>Mixer kết hợp nhiều đầu vào (mic, phát nhạc) thành một hoặc nhiều đầu ra. Các nút chính trên mỗi kênh:</p>
<pre><code>Channel strip (từ trên xuống):
  Gain     -> đặt mức tín hiệu vào từ nguồn (tránh clip)
  EQ       -> tạo hình âm sắc (cắt trầm ù, tăng rõ ở cao)
  Aux send -> gửi một bản sao tới monitor/effect (tách khỏi mix chính)
  Fader    -> đặt mức của kênh đó trong MIX CHÍNH
</code></pre>
<h3>Microphone</h3>
<ul>
<li><strong>Mic dynamic</strong> — bền, chịu tốt nguồn âm lớn (vd hát, trống); không cần cấp nguồn ngoài. Phổ biến: mic cầm tay cho vocal.</li>
<li><strong>Mic condenser</strong> — nhạy và chi tiết hơn, cần cấp nguồn (<strong>phantom power</strong>, +48V từ mixer); phổ biến cho giọng nói/lavalier và dùng trong studio, dễ vỡ tiếng hơn với nguồn âm to/gần.</li>
<li><strong>Mic không dây</strong> — giải phóng người nói khỏi dây cáp nhưng thêm một đường truyền RF (radio frequency) có thể bị nhiễu; luôn phải kiểm tần số trước sự kiện.</li>
</ul>
<p><strong>Polar pattern (hướng thu)</strong> mô tả các hướng mic bắt âm: <em>cardioid</em> (tập trung phía trước, loại phía sau — phổ biến nhất cho sự kiện trực tiếp, giảm hú) so với <em>omnidirectional</em> (bắt âm mọi hướng — tự nhiên cho thu âm xung quanh/bàn tròn, nhưng dễ hú hơn nhiều khi gần loa).</p>
<div class="callout"><span class="badge">Vòng lặp hú (feedback)</span> Tiếng rít khó chịu đó là một <strong>vòng lặp feedback</strong>: mic bắt âm từ loa, mixer khuếch đại lại, loa phát to hơn, mic lại bắt tiếp. Sửa bằng cách giảm gain, hướng "vùng chết" của mic vào loa, hoặc cắt tần số EQ cộng hưởng.</div>`,
  ]]);

const c2q = quiz('eet201-quiz-2', 'Quiz 2 — Sound systems|||Quiz 2 — Hệ thống âm thanh', [
  { id: 'q1', question: 'Loa monitor trong hệ thống PA dùng để làm gì?', options: ['Phát nhạc cho khán giả', 'Giúp người biểu diễn/diễn giả tự nghe mình', 'Xử lý tần số thấp', 'Thay thế mixer'], correctIndex: 1, explanation: 'Monitor hướng về performer, dùng mix riêng để họ nghe được chính mình trên sân khấu.' },
  { id: 'q2', question: 'Mic condenser cần gì mà mic dynamic không cần?', options: ['Dây XLR', 'Phantom power (+48V)', 'Chân đế mic', 'Bộ EQ riêng'], correctIndex: 1, explanation: 'Condenser cần phantom power để hoạt động; dynamic không cần cấp nguồn ngoài.' },
  { id: 'q3', question: 'Polar pattern cardioid phổ biến cho sự kiện trực tiếp vì?', options: ['Bắt âm mọi hướng như nhau', 'Tập trung phía trước, loại phía sau nên giảm hú (feedback)', 'Không cần phantom power', 'Chỉ dùng cho mic không dây'], correctIndex: 1, explanation: 'Cardioid tập trung thu âm phía trước, loại bỏ phía sau — nơi loa thường đặt — nên giảm nguy cơ feedback.' },
]);

const c3 = doc('eet201-3-1-stage-lighting', '3.1 — Stage lighting & effects|||3.1 — Ánh sáng sân khấu & hiệu ứng',
  'Ba vai trò ánh sáng (visibility, mood, effect); loại đèn (PAR, moving head, wash/spot); điều khiển DMX; hiệu ứng (haze, gobo, strobe).',
  [[
    `<span class="eyebrow">EET201 · Chapter 3 · Lesson 3.1</span>
<h2>Stage lighting &amp; effects</h2>
<h3>Three jobs of lighting</h3>
<ul>
<li><strong>Visibility</strong> — the audience (and cameras) must be able to see performers/speakers clearly.</li>
<li><strong>Mood</strong> — colour, intensity and movement set an emotional tone (warm for a gala, cold/blue for a tech keynote).</li>
<li><strong>Effect</strong> — beams, strobes, gobos and haze create spectacle and punctuate key moments (a product reveal, a chorus drop).</li>
</ul>
<h3>Fixture types</h3>
<ul>
<li><strong>PAR / Fresnel</strong> — fixed-beam wash lights; simple, reliable, used for even area coverage.</li>
<li><strong>Moving head</strong> — motorised fixture that pans/tilts, changes colour and gobo automatically; the workhorse of modern concert and corporate lighting.</li>
<li><strong>Wash vs spot</strong> — a <em>wash</em> spreads soft light over a wide area (mood, background); a <em>spot</em> is a tight, sharp beam that isolates one subject (a soloist, a speaker).</li>
</ul>
<h3>DMX control</h3>
<p><strong>DMX512</strong> is the standard digital protocol that carries lighting control data from a console to fixtures over a single cable, in a daisy-chain called a <strong>universe</strong> (512 channels). Each fixture is assigned a starting address so the console knows which channels control which lamp's colour/position/intensity.</p>
<pre><code>Lighting console --DMX cable--> Fixture 1 (address 1)
                              -> Fixture 2 (address 25)
                              -> Fixture 3 (address 49) ...
</code></pre>
<h3>Effects</h3>
<ul>
<li><strong>Haze/fog</strong> — makes light beams visible in the air (essential for moving-head beam effects to "read").</li>
<li><strong>Gobo</strong> — a metal/glass stencil placed in front of a fixture to project a pattern or logo.</li>
<li><strong>Strobe</strong> — rapid on/off flashing for high-energy moments; must be flagged in advance (photosensitive-epilepsy warning) for audience safety.</li>
</ul>
<div class="callout"><span class="badge">Design first, gear second</span> A lighting plot always starts from the moment you want the audience to feel — the fixtures and DMX programming are the tools, not the goal.</div>`,
    `<span class="eyebrow">EET201 · Chương 3 · Bài 3.1</span>
<h2>Ánh sáng sân khấu &amp; hiệu ứng</h2>
<h3>Ba vai trò của ánh sáng</h3>
<ul>
<li><strong>Tầm nhìn (visibility)</strong> — khán giả (và camera) phải thấy rõ người biểu diễn/diễn giả.</li>
<li><strong>Không khí (mood)</strong> — màu sắc, độ sáng và chuyển động tạo cảm xúc (ấm cho gala, lạnh/xanh cho keynote công nghệ).</li>
<li><strong>Hiệu ứng (effect)</strong> — chùm sáng, strobe, gobo và khói tạo cảnh tượng và nhấn nhá khoảnh khắc quan trọng (mở sản phẩm, điệp khúc cao trào).</li>
</ul>
<h3>Loại đèn</h3>
<ul>
<li><strong>PAR / Fresnel</strong> — đèn wash chùm cố định; đơn giản, bền, dùng phủ đều một vùng.</li>
<li><strong>Moving head</strong> — đèn có động cơ tự xoay pan/tilt, đổi màu và gobo tự động; là "lao động chính" của ánh sáng hoà nhạc và doanh nghiệp hiện đại.</li>
<li><strong>Wash vs spot</strong> — <em>wash</em> trải ánh sáng mềm lên vùng rộng (tạo không khí, hậu cảnh); <em>spot</em> là chùm sáng gọn, sắc nét cô lập một chủ thể (một ca sĩ solo, một diễn giả).</li>
</ul>
<h3>Điều khiển DMX</h3>
<p><strong>DMX512</strong> là giao thức số chuẩn mang dữ liệu điều khiển ánh sáng từ bàn điều khiển tới các đèn qua một dây, nối chuỗi (daisy-chain) gọi là <strong>universe</strong> (512 kênh). Mỗi đèn được gán một địa chỉ bắt đầu để bàn điều khiển biết kênh nào điều khiển màu/vị trí/độ sáng của đèn nào.</p>
<pre><code>Bàn điều khiển ánh sáng --dây DMX--> Đèn 1 (địa chỉ 1)
                                   -> Đèn 2 (địa chỉ 25)
                                   -> Đèn 3 (địa chỉ 49) ...
</code></pre>
<h3>Hiệu ứng</h3>
<ul>
<li><strong>Haze/khói</strong> — làm chùm sáng hiện rõ trong không khí (thiết yếu để hiệu ứng chùm của moving head "hiện" ra).</li>
<li><strong>Gobo</strong> — một khuôn kim loại/kính đặt trước đèn để chiếu hình hoặc logo.</li>
<li><strong>Strobe</strong> — nhấp nháy tắt/mở nhanh cho khoảnh khắc cao trào; phải cảnh báo trước (nguy cơ động kinh do nhạy ánh sáng) để đảm bảo an toàn khán giả.</li>
</ul>
<div class="callout"><span class="badge">Thiết kế trước, thiết bị sau</span> Một sơ đồ ánh sáng luôn bắt đầu từ cảm xúc bạn muốn khán giả trải nghiệm — đèn và lập trình DMX chỉ là công cụ, không phải mục tiêu.</div>`,
  ]]);

const c3q = quiz('eet201-quiz-3', 'Quiz 3 — Stage lighting & effects|||Quiz 3 — Ánh sáng sân khấu & hiệu ứng', [
  { id: 'q1', question: 'Ba vai trò cơ bản của ánh sáng sự kiện là gì?', options: ['Visibility, mood, effect', 'Âm thanh, ánh sáng, video', 'Wash, spot, gobo', 'DMX, RF, LED'], correctIndex: 0, explanation: 'Ánh sáng phục vụ tầm nhìn, tạo không khí, và tạo hiệu ứng/spectacle.' },
  { id: 'q2', question: 'DMX512 dùng để làm gì?', options: ['Truyền âm thanh không dây', 'Truyền dữ liệu điều khiển ánh sáng từ bàn tới đèn', 'Bán vé sự kiện', 'Nén video livestream'], correctIndex: 1, explanation: 'DMX là giao thức số chuẩn mang lệnh điều khiển (màu, vị trí, độ sáng) tới các đèn theo địa chỉ kênh.' },
  { id: 'q3', question: 'Vì sao cần haze/khói khi dùng moving head tạo hiệu ứng chùm sáng?', options: ['Để làm mát đèn', 'Để chùm sáng hiện rõ và "đọc" được trong không khí', 'Để tắt strobe', 'Để cấp phantom power'], correctIndex: 1, explanation: 'Haze làm các hạt trong không khí phản chiếu ánh sáng, giúp chùm sáng của moving head hiện rõ thay vì vô hình.' },
]);

const c4 = doc('eet201-4-1-video-led', '4.1 — Screens, video & projection|||4.1 — Màn hình, video & trình chiếu',
  'LED wall (pixel pitch, viewing distance); máy chiếu (lumen, throw ratio); video switcher/scaler; projection mapping.',
  [[
    `<span class="eyebrow">EET201 · Chapter 4 · Lesson 4.1</span>
<h2>Screens, video &amp; projection</h2>
<h3>LED walls</h3>
<p>An <strong>LED wall</strong> is built from modular panels, each packed with tiny RGB LED clusters ("pixels"). Two numbers define what it can do:</p>
<ul>
<li><strong>Pixel pitch</strong> — the distance (in mm) between pixel centres. Smaller pitch = higher resolution but higher cost; a small pitch is wasted if the audience never gets close enough to see the detail.</li>
<li><strong>Minimum viewing distance</strong> — roughly pixel pitch (mm) × 1 to 3 metres. A large outdoor screen viewed from 50m can use a large (cheaper) pitch; an indoor stage backdrop viewed from 5m needs a fine pitch.</li>
</ul>
<h3>Projectors</h3>
<ul>
<li><strong>Brightness (lumens)</strong> — must be matched to ambient light in the room; a dim projector is unreadable under house lights or daylight.</li>
<li><strong>Throw ratio</strong> — the relationship between projector distance and image width; determines where the projector must physically sit relative to the screen.</li>
</ul>
<h3>Video switcher &amp; scaler</h3>
<p>A <strong>video switcher</strong> selects/cuts between multiple video sources (slides, camera feeds, video playback) live, the way an audio mixer handles multiple mics. A <strong>scaler</strong> converts a source's native resolution/aspect ratio to match the display, so a 4:3 laptop slide doesn't stretch or squash on a 16:9 LED wall.</p>
<h3>Projection mapping</h3>
<p><strong>Projection mapping</strong> uses software to warp and align video content onto irregular physical surfaces (a building façade, a 3D sculpture, an entire stage set) so the image appears to fit — or interact with — the object's real shape. It requires precise measurement of the surface and careful projector placement, since any movement of the projector or surface throws the alignment off.</p>
<div class="callout"><span class="badge">Match the tool to the room</span> LED walls tolerate ambient light and outdoor use better; projectors are cheaper for large, temporary or curved surfaces but need control over ambient light. Choosing between them starts with the venue, not the budget.</div>`,
    `<span class="eyebrow">EET201 · Chương 4 · Bài 4.1</span>
<h2>Màn hình, video &amp; trình chiếu</h2>
<h3>LED wall</h3>
<p><strong>LED wall</strong> được dựng từ các panel module, mỗi panel chứa dày đặc các cụm LED RGB nhỏ ("pixel"). Hai số quyết định khả năng của nó:</p>
<ul>
<li><strong>Pixel pitch</strong> — khoảng cách (mm) giữa tâm các pixel. Pitch nhỏ hơn = độ phân giải cao hơn nhưng chi phí cao hơn; pitch nhỏ là lãng phí nếu khán giả không bao giờ đứng gần đủ để thấy chi tiết đó.</li>
<li><strong>Khoảng cách xem tối thiểu</strong> — xấp xỉ pixel pitch (mm) × 1 đến 3 mét. Một màn hình ngoài trời lớn xem từ 50m có thể dùng pitch lớn (rẻ hơn); một backdrop sân khấu trong nhà xem từ 5m cần pitch mịn.</li>
</ul>
<h3>Máy chiếu</h3>
<ul>
<li><strong>Độ sáng (lumen)</strong> — phải khớp với ánh sáng môi trường trong phòng; máy chiếu mờ sẽ không đọc được dưới ánh đèn hội trường hoặc ánh sáng ban ngày.</li>
<li><strong>Throw ratio</strong> — quan hệ giữa khoảng cách máy chiếu và chiều rộng hình ảnh; quyết định máy chiếu phải đặt ở đâu so với màn chiếu.</li>
</ul>
<h3>Video switcher &amp; scaler</h3>
<p><strong>Video switcher</strong> chọn/chuyển giữa nhiều nguồn video (slide, tín hiệu camera, phát video) trực tiếp, tương tự cách mixer âm thanh xử lý nhiều mic. <strong>Scaler</strong> chuyển đổi độ phân giải/tỉ lệ khung hình gốc của nguồn để khớp với màn hình hiển thị, để một slide laptop 4:3 không bị kéo giãn hoặc bóp méo trên LED wall 16:9.</p>
<h3>Projection mapping</h3>
<p><strong>Projection mapping</strong> dùng phần mềm để bẻ cong và căn chỉnh nội dung video lên các bề mặt vật lý không đều (mặt tiền toà nhà, một tác phẩm điêu khắc 3D, cả bối cảnh sân khấu) để hình ảnh trông như vừa khớp — hoặc tương tác — với hình dạng thật của vật thể. Nó cần đo đạc chính xác bề mặt và đặt máy chiếu cẩn thận, vì bất kỳ dịch chuyển nào của máy chiếu hoặc bề mặt cũng làm lệch căn chỉnh.</p>
<div class="callout"><span class="badge">Chọn công cụ theo phòng</span> LED wall chịu ánh sáng môi trường và dùng ngoài trời tốt hơn; máy chiếu rẻ hơn cho bề mặt lớn, tạm thời hoặc cong nhưng cần kiểm soát ánh sáng môi trường. Chọn giữa hai loại bắt đầu từ địa điểm, không phải từ ngân sách.</div>`,
  ]]);

const c4q = quiz('eet201-quiz-4', 'Quiz 4 — Screens, video & projection|||Quiz 4 — Màn hình, video & trình chiếu', [
  { id: 'q1', question: '"Pixel pitch" nhỏ hơn trên LED wall có nghĩa là?', options: ['Độ phân giải thấp hơn, rẻ hơn', 'Độ phân giải cao hơn, thường đắt hơn', 'Chỉ dùng ngoài trời', 'Không cần khoảng cách xem tối thiểu'], correctIndex: 1, explanation: 'Pitch nhỏ = khoảng cách giữa các pixel nhỏ = mật độ pixel cao hơn = độ phân giải cao hơn, chi phí thường cao hơn.' },
  { id: 'q2', question: 'Vai trò của "scaler" trong hệ thống video sự kiện là gì?', options: ['Khuếch đại âm thanh', 'Chuyển đổi độ phân giải/tỉ lệ khung hình nguồn để khớp màn hình', 'Điều khiển đèn DMX', 'Bán vé online'], correctIndex: 1, explanation: 'Scaler khớp độ phân giải/tỉ lệ khung hình của nguồn với màn hình đích, tránh hình bị méo hoặc kéo giãn.' },
  { id: 'q3', question: 'Projection mapping đặc biệt nhạy với điều gì?', options: ['Nhiệt độ phòng', 'Sự dịch chuyển của máy chiếu hoặc bề mặt chiếu', 'Số lượng khán giả', 'Loại microphone dùng'], correctIndex: 1, explanation: 'Vì nội dung được căn chỉnh chính xác theo hình dạng bề mặt, mọi dịch chuyển của máy chiếu hoặc vật thể đều làm lệch alignment.' },
]);

const c5 = doc('eet201-5-1-staging-rigging', '5.1 — Staging, rigging & technical safety|||5.1 — Sân khấu, rigging & an toàn kỹ thuật',
  'Kết cấu sân khấu (deck, truss); rigging (điểm treo, working load limit); vai trò rigger có chứng chỉ; checklist an toàn cơ bản.',
  [[
    `<span class="eyebrow">EET201 · Chapter 5 · Lesson 5.1</span>
<h2>Staging, rigging &amp; technical safety</h2>
<h3>Staging</h3>
<p>The <strong>stage deck</strong> is the platform performers/speakers stand on, usually built from modular sections on adjustable legs so it can be leveled and sized to the room. <strong>Truss</strong> is the lightweight metal lattice structure (often triangular or square cross-section) used to span distances and support lighting/video/audio fixtures above or around the stage.</p>
<h3>Rigging basics</h3>
<p><strong>Rigging</strong> is the practice of safely suspending equipment (lighting trusses, speaker clusters, LED walls, banners) overhead, above people. Every rigging point and every piece of hardware (chain motor, shackle, sling) has a <strong>Working Load Limit (WLL)</strong> — the maximum weight it is rated to carry, always with a safety margin below its breaking point.</p>
<pre><code>Rigging safety chain:
  Structural point (roof/truss) -- rated for X kg
    -> Rigging hardware (motor/shackle) -- WLL below X
      -> Load (speaker/LED/lighting) -- weight below WLL
</code></pre>
<p>A rigging plan is only as strong as its weakest link — the calculation must check every point in that chain, not just the total weight of the gear.</p>
<h3>Who does the rigging</h3>
<p>Overhead rigging in professional productions is performed or supervised by a <strong>certified/licensed rigger</strong> — this is not a task for general crew, regardless of how simple it looks. A technical producer's job is to know <em>when</em> to bring one in (any overhead load above people) and to verify their certification, not to do the rigging calculations personally.</p>
<h3>Basic safety checklist</h3>
<ul>
<li>Cable management — no trip hazards across walkways; cables taped or ramped.</li>
<li>Fire exits and aisles kept clear of cases, cables and staging at all times.</li>
<li>Weight/load documentation available for every suspended element, signed off before doors open.</li>
<li>A clear emergency stop procedure known to the whole technical crew.</li>
</ul>
<div class="callout"><span class="badge">Non-negotiable</span> Safety decisions on rigging and structural load are never made on "it looks fine" — they are made on rated numbers, documentation, and a certified person's sign-off.</div>`,
    `<span class="eyebrow">EET201 · Chương 5 · Bài 5.1</span>
<h2>Sân khấu, rigging &amp; an toàn kỹ thuật</h2>
<h3>Sân khấu (staging)</h3>
<p><strong>Deck sân khấu</strong> là bệ mà người biểu diễn/diễn giả đứng lên, thường dựng từ các module trên chân điều chỉnh được để căn phẳng và đúng kích thước phòng. <strong>Truss</strong> là kết cấu khung kim loại nhẹ (thường tiết diện tam giác hoặc vuông) dùng để bắc qua khoảng cách và đỡ đèn/video/âm thanh phía trên hoặc quanh sân khấu.</p>
<h3>Kiến thức cơ bản về rigging</h3>
<p><strong>Rigging</strong> là kỹ thuật treo an toàn thiết bị (truss đèn, cụm loa, LED wall, băng-rôn) trên cao, phía trên đầu người. Mọi điểm rigging và mọi phụ kiện (motor xích, shackle, sling) đều có <strong>Working Load Limit (WLL)</strong> — trọng lượng tối đa được định mức, luôn có biên an toàn dưới điểm gãy thực tế.</p>
<pre><code>Chuỗi an toàn rigging:
  Điểm kết cấu (mái/truss) -- định mức X kg
    -> Phụ kiện rigging (motor/shackle) -- WLL thấp hơn X
      -> Tải (loa/LED/đèn) -- trọng lượng thấp hơn WLL
</code></pre>
<p>Một kế hoạch rigging chỉ chắc bằng mắt xích yếu nhất — phép tính phải kiểm từng điểm trong chuỗi đó, không chỉ tổng trọng lượng thiết bị.</p>
<h3>Ai làm rigging</h3>
<p>Rigging trên cao trong sản xuất chuyên nghiệp được thực hiện hoặc giám sát bởi <strong>rigger có chứng chỉ/cấp phép</strong> — đây không phải việc cho crew phổ thông, bất kể trông đơn giản đến đâu. Việc của technical producer là biết <em>khi nào</em> cần gọi rigger (bất kỳ tải trên cao phía trên đầu người) và xác minh chứng chỉ của họ, không phải tự tính toán rigging.</p>
<h3>Checklist an toàn cơ bản</h3>
<ul>
<li>Quản lý dây cáp — không có vật cản vấp ngã trên đường đi lại; dây được băng hoặc làm dốc che.</li>
<li>Lối thoát hiểm và hành lang luôn thông thoáng, không có case, dây hay kết cấu sân khấu chắn.</li>
<li>Tài liệu trọng lượng/tải sẵn có cho mọi vật treo, được ký duyệt trước khi mở cửa cho khách vào.</li>
<li>Quy trình dừng khẩn cấp rõ ràng, toàn bộ crew kỹ thuật đều biết.</li>
</ul>
<div class="callout"><span class="badge">Không thể thoả hiệp</span> Quyết định an toàn về rigging và tải kết cấu không bao giờ dựa trên "nhìn có vẻ ổn" — mà dựa trên số liệu định mức, tài liệu, và ký duyệt của người có chứng chỉ.</div>`,
  ]]);

const c5q = quiz('eet201-quiz-5', 'Quiz 5 — Staging, rigging & safety|||Quiz 5 — Sân khấu, rigging & an toàn', [
  { id: 'q1', question: '"Working Load Limit (WLL)" của phụ kiện rigging là gì?', options: ['Trọng lượng thực tế đo được', 'Trọng lượng tối đa được định mức để chịu tải, có biên an toàn', 'Chi phí thuê thiết bị', 'Thời gian lắp đặt tối đa'], correctIndex: 1, explanation: 'WLL là mức tải tối đa được cho phép, luôn thấp hơn điểm gãy thực tế để có biên an toàn.' },
  { id: 'q2', question: 'Vì sao rigging trên cao cần rigger có chứng chỉ, không phải crew phổ thông?', options: ['Vì luật bắt buộc phải trả lương cao hơn', 'Vì tải treo trên cao phía trên đầu người, sai sót gây nguy hiểm nghiêm trọng', 'Vì rigger là người duy nhất biết vận hành mixer', 'Vì đó là quy định của DMX'], correctIndex: 1, explanation: 'Rigging liên quan an toàn kết cấu và tính mạng người phía dưới, cần chuyên môn và chứng chỉ.' },
  { id: 'q3', question: '"Chuỗi an toàn rigging" trong bài học kiểm điều gì?', options: ['Chỉ tổng trọng lượng thiết bị', 'Từng điểm trong chuỗi: điểm kết cấu, phụ kiện, tải — mỗi điểm phải đủ định mức', 'Chỉ giá thuê truss', 'Chỉ số kênh DMX dùng cho đèn'], correctIndex: 1, explanation: 'Chuỗi chỉ chắc bằng mắt xích yếu nhất, nên phải kiểm cả điểm kết cấu, phụ kiện và tải, không chỉ tổng trọng lượng.' },
]);

const c6 = doc('eet201-6-1-livestream-hybrid', '6.1 — Livestream, hybrid & virtual events|||6.1 — Livestream, hybrid & virtual events',
  'Sự khác biệt livestream/hybrid/virtual; encoder & bitrate; độ trễ (latency); tương tác cho khán giả online.',
  [[
    `<span class="eyebrow">EET201 · Chapter 6 · Lesson 6.1</span>
<h2>Livestream, hybrid &amp; virtual events</h2>
<h3>Three formats</h3>
<ul>
<li><strong>In-person</strong> — everyone physically attends; no broadcast component.</li>
<li><strong>Hybrid</strong> — a physical event with a simultaneous live broadcast, designed for two audiences at once (in-room and online) with content, camera work and interaction planned for both.</li>
<li><strong>Virtual</strong> — the entire event happens online, no physical venue; typically run through a webinar/streaming platform with its own registration and interaction tools.</li>
</ul>
<h3>Encoding &amp; bitrate</h3>
<p>A <strong>video encoder</strong> compresses a camera/programme feed into a format small enough to send over the internet, then sends it to a streaming platform (YouTube Live, a webinar tool, a custom RTMP server). <strong>Bitrate</strong> (measured in Mbps) trades file size against picture quality and required upload bandwidth — too low and the stream looks blocky; too high and it can exceed the venue's upload capacity, causing buffering or drop-outs.</p>
<h3>Latency</h3>
<p><strong>Latency</strong> is the delay between something happening in the room and the online audience seeing it — commonly several seconds even on "live" platforms. This matters directly for hybrid events: a live Q&amp;A that reads online chat questions must account for that delay, or the online audience feels a beat behind and disconnected from the room.</p>
<h3>Online audience interaction</h3>
<p>A virtual/hybrid event's online audience needs its own tools to feel included, not just a one-way video feed: live chat, polls/Q&amp;A, and (for larger productions) a dedicated online moderator who reads chat and feeds relevant questions to the stage — mirroring the role a floor microphone plays for an in-room audience.</p>
<div class="callout"><span class="badge">Design for two rooms</span> A hybrid event that only thinks about the physical room and bolts a camera on as an afterthought reliably produces a poor online experience — camera angles, sound mix and pacing all need a version made specifically for the stream.</div>`,
    `<span class="eyebrow">EET201 · Chương 6 · Bài 6.1</span>
<h2>Livestream, hybrid &amp; virtual events</h2>
<h3>Ba hình thức</h3>
<ul>
<li><strong>Trực tiếp tại chỗ (in-person)</strong> — mọi người tham dự vật lý; không có phần phát trực tuyến.</li>
<li><strong>Hybrid</strong> — sự kiện vật lý kèm phát trực tiếp đồng thời, thiết kế cho hai khán giả cùng lúc (trong phòng và online) với nội dung, quay phim và tương tác được lên kế hoạch cho cả hai.</li>
<li><strong>Virtual</strong> — toàn bộ sự kiện diễn ra online, không có địa điểm vật lý; thường chạy qua nền tảng webinar/streaming với công cụ đăng ký và tương tác riêng.</li>
</ul>
<h3>Encoder &amp; bitrate</h3>
<p><strong>Video encoder</strong> nén tín hiệu camera/chương trình thành định dạng đủ nhỏ để gửi qua internet, sau đó đẩy tới nền tảng streaming (YouTube Live, công cụ webinar, server RTMP riêng). <strong>Bitrate</strong> (đo bằng Mbps) đánh đổi kích thước file với chất lượng hình ảnh và băng thông tải lên cần thiết — quá thấp thì hình vỡ khối; quá cao có thể vượt khả năng tải lên của địa điểm, gây giật hình hoặc rớt sóng.</p>
<h3>Độ trễ (latency)</h3>
<p><strong>Latency</strong> là khoảng chậm giữa việc xảy ra trong phòng và khán giả online nhìn thấy nó — thường vài giây dù trên nền tảng "trực tiếp". Điều này ảnh hưởng trực tiếp đến sự kiện hybrid: một phần Q&amp;A trực tiếp đọc câu hỏi từ chat online phải tính đến độ trễ này, nếu không khán giả online sẽ cảm thấy chậm một nhịp và tách biệt khỏi phòng.</p>
<h3>Tương tác cho khán giả online</h3>
<p>Khán giả online của một sự kiện virtual/hybrid cần công cụ riêng để cảm thấy được tham gia, không chỉ nhận một luồng video một chiều: live chat, poll/Q&amp;A, và (với sản xuất lớn hơn) một moderator online chuyên đọc chat và chuyển câu hỏi liên quan lên sân khấu — phản chiếu vai trò của mic sàn cho khán giả trong phòng.</p>
<div class="callout"><span class="badge">Thiết kế cho hai căn phòng</span> Một sự kiện hybrid chỉ nghĩ cho phòng vật lý và gắn thêm camera như một ý nghĩ sau cùng thì chắc chắn tạo trải nghiệm online kém — góc camera, mix âm thanh và tiết tấu đều cần một phiên bản làm riêng cho stream.</div>`,
  ]]);

const c6q = quiz('eet201-quiz-6', 'Quiz 6 — Livestream & hybrid|||Quiz 6 — Livestream & hybrid', [
  { id: 'q1', question: 'Sự kiện "hybrid" khác "virtual" ở điểm nào?', options: ['Hybrid không có internet', 'Hybrid có địa điểm vật lý kèm phát trực tiếp; virtual toàn bộ online', 'Virtual luôn rẻ hơn hybrid', 'Không có sự khác biệt'], correctIndex: 1, explanation: 'Hybrid = vật lý + online đồng thời; virtual = hoàn toàn online, không địa điểm vật lý.' },
  { id: 'q2', question: '"Latency" trong livestream ảnh hưởng trực tiếp đến điều gì trong bài học?', options: ['Giá vé sự kiện', 'Q&A trực tiếp đọc câu hỏi từ chat online phải tính đến độ trễ', 'Số lượng đèn DMX dùng', 'Pixel pitch của LED wall'], correctIndex: 1, explanation: 'Độ trễ vài giây khiến khán giả online chậm một nhịp; MC/host cần tính đến khi tương tác trực tiếp.' },
  { id: 'q3', question: 'Bitrate quá thấp trong stream gây ra hiện tượng gì?', options: ['Hình ảnh vỡ khối, mất chi tiết', 'Tăng độ trễ về 0', 'Loa bị hú feedback', 'LED wall bị lệch pixel pitch'], correctIndex: 0, explanation: 'Bitrate thấp nén hình quá mạnh, gây hiện tượng vỡ khối (blocky) và giảm chất lượng hình.' },
]);

const c7 = doc('eet201-7-1-event-software', '7.1 — Event-management software|||7.1 — Phần mềm quản lý sự kiện',
  'Ticketing (loại vé, kiểm soát số lượng); check-in (QR code, quét vé); đăng ký (registration) & dữ liệu khách tham dự; tích hợp CRM/email.',
  [[
    `<span class="eyebrow">EET201 · Chapter 7 · Lesson 7.1</span>
<h2>Event-management software</h2>
<h3>Ticketing</h3>
<p>A ticketing platform (e.g. Eventbrite, Cvent) manages <strong>ticket types</strong> (general admission, VIP, early-bird), <strong>inventory</strong> (capping how many of each type can be sold, tied to venue capacity), and <strong>payment processing</strong>. Each sold ticket generates a unique code (often a QR code) that becomes the attendee's entry credential.</p>
<h3>Check-in</h3>
<p>On the day, a <strong>check-in app</strong> scans each ticket's QR code against the ticketing database in real time — this instantly flags duplicates (a ticket already scanned, catching resale fraud or accidental double-entry) and gives organisers a live count of who has actually arrived versus who registered.</p>
<pre><code>Ticket sold -> QR code generated -> attendee arrives
  -> check-in app scans QR -> validated against database
    -> valid & unused -> ADMIT, mark as used
    -> already scanned -> FLAG for staff review
</code></pre>
<h3>Registration &amp; attendee data</h3>
<p>For conferences and B2B events, <strong>registration</strong> collects more than a ticket sale — job title, company, session preferences, dietary needs — feeding both the on-site experience (badge printing, session capacity planning) and post-event follow-up.</p>
<h3>Integration with CRM/email</h3>
<p>Event software rarely stands alone: it typically integrates with a <strong>CRM</strong> (to log which prospects/clients attended) and an <strong>email platform</strong> (for confirmations, reminders, and post-event surveys), so the event becomes one step in a longer relationship rather than an isolated transaction.</p>
<div class="callout"><span class="badge">Data is part of the deliverable</span> For sponsors and organisers, attendee data (who came, what they engaged with) is often as valuable as the event experience itself — this is why registration and check-in accuracy matters as much as any technical production element.</div>`,
    `<span class="eyebrow">EET201 · Chương 7 · Bài 7.1</span>
<h2>Phần mềm quản lý sự kiện</h2>
<h3>Ticketing (bán vé)</h3>
<p>Nền tảng ticketing (vd Eventbrite, Cvent) quản lý <strong>loại vé</strong> (vé thường, VIP, early-bird), <strong>số lượng tồn</strong> (giới hạn mỗi loại bán được bao nhiêu, gắn với sức chứa địa điểm), và <strong>xử lý thanh toán</strong>. Mỗi vé bán ra sinh một mã riêng (thường là QR code) trở thành thẻ vào cửa của khách.</p>
<h3>Check-in</h3>
<p>Trong ngày diễn ra, <strong>app check-in</strong> quét mã QR của mỗi vé đối chiếu với cơ sở dữ liệu ticketing theo thời gian thực — điều này ngay lập tức phát hiện vé trùng (vé đã quét rồi, bắt được gian lận bán lại hoặc vào cửa nhầm hai lần) và cho ban tổ chức số lượng thực tế đã đến so với số đã đăng ký.</p>
<pre><code>Vé được bán -> Sinh mã QR -> khách đến
  -> app check-in quét QR -> đối chiếu với cơ sở dữ liệu
    -> hợp lệ & chưa dùng -> CHO VÀO, đánh dấu đã dùng
    -> đã quét rồi -> BÁO cho nhân viên kiểm tra
</code></pre>
<h3>Đăng ký (registration) & dữ liệu khách tham dự</h3>
<p>Với hội nghị và sự kiện B2B, <strong>đăng ký</strong> thu thập nhiều hơn một giao dịch bán vé — chức vụ, công ty, phiên quan tâm, nhu cầu ăn uống — phục vụ cả trải nghiệm tại chỗ (in thẻ đeo, lập kế hoạch sức chứa từng phiên) và chăm sóc sau sự kiện.</p>
<h3>Tích hợp CRM/email</h3>
<p>Phần mềm sự kiện hiếm khi hoạt động độc lập: nó thường tích hợp với <strong>CRM</strong> (ghi nhận khách hàng/đối tác nào đã tham dự) và <strong>nền tảng email</strong> (xác nhận, nhắc lịch, khảo sát sau sự kiện), để sự kiện trở thành một bước trong quan hệ dài hạn, không phải một giao dịch cô lập.</p>
<div class="callout"><span class="badge">Dữ liệu là một phần của sản phẩm</span> Với nhà tài trợ và ban tổ chức, dữ liệu khách tham dự (ai đến, họ tương tác với gì) thường có giá trị không kém trải nghiệm sự kiện tự thân — đây là lý do độ chính xác của đăng ký và check-in quan trọng không kém bất kỳ yếu tố sản xuất kỹ thuật nào.</div>`,
  ]]);

const c7q = quiz('eet201-quiz-7', 'Quiz 7 — Event-management software|||Quiz 7 — Phần mềm quản lý sự kiện', [
  { id: 'q1', question: 'App check-in phát hiện điều gì ngay lập tức khi quét một vé đã dùng trước đó?', options: ['Loại vé VIP', 'Vé trùng — cảnh báo gian lận hoặc vào cửa nhầm hai lần', 'Số kênh DMX', 'Bitrate livestream'], correctIndex: 1, explanation: 'Đối chiếu real-time với database giúp phát hiện vé đã quét rồi (duplicate), bắt gian lận bán lại hoặc double check-in.' },
  { id: 'q2', question: 'Vì sao registration cho hội nghị B2B thu thập nhiều hơn thông tin bán vé?', options: ['Để tăng giá vé', 'Để phục vụ trải nghiệm tại chỗ và chăm sóc sau sự kiện (chức vụ, công ty, phiên quan tâm)', 'Để thay thế app check-in', 'Để tính pixel pitch LED wall'], correctIndex: 1, explanation: 'Thông tin như chức vụ, công ty, phiên quan tâm phục vụ in thẻ, lập kế hoạch sức chứa và follow-up sau sự kiện.' },
  { id: 'q3', question: 'Phần mềm sự kiện tích hợp với CRM/email để làm gì?', options: ['Điều khiển ánh sáng sân khấu', 'Ghi nhận khách tham dự và chăm sóc quan hệ dài hạn (xác nhận, nhắc lịch, khảo sát)', 'Nén video livestream', 'Tính working load limit'], correctIndex: 1, explanation: 'Tích hợp CRM/email biến sự kiện thành một bước trong quan hệ dài hạn, không phải giao dịch cô lập.' },
]);

const c8 = doc('eet201-8-1-emerging-tech', '8.1 — Emerging technology & future trends|||8.1 — Công nghệ mới & xu hướng tương lai',
  'AR/VR trong sự kiện; RFID (kiểm soát vào cửa, thanh toán không tiếp xúc); AI (chatbot hỗ trợ, cá nhân hoá, dữ liệu real-time); xu hướng bền vững.',
  [[
    `<span class="eyebrow">EET201 · Chapter 8 · Lesson 8.1</span>
<h2>Emerging technology &amp; future trends</h2>
<h3>AR/VR</h3>
<p><strong>Augmented Reality (AR)</strong> overlays digital content onto the real world (through a phone camera or headset) — used for interactive booth experiences or letting an audience "see" a product feature that isn't physically present. <strong>Virtual Reality (VR)</strong> replaces the real environment entirely with a simulated one — used for remote venue tours, training simulations, or fully virtual event spaces where avatars interact.</p>
<h3>RFID</h3>
<p><strong>RFID (Radio-Frequency Identification)</strong> wristbands or badges let attendees tap for entry, cashless payment at bars/vendors, or automatic session check-in — faster than scanning a QR code, and it can capture rich engagement data (which sessions/booths an attendee actually visited) without any manual scanning step by staff.</p>
<h3>AI in event technology</h3>
<ul>
<li><strong>Attendee-facing chatbots</strong> — answer schedule/logistics questions instantly, reducing load on the human help desk.</li>
<li><strong>Personalisation</strong> — session or networking recommendations based on a registrant's stated interests/job title.</li>
<li><strong>Real-time production data</strong> — AI-assisted camera switching, live captioning/translation for hybrid audiences, and automated highlight-reel generation from a livestream recording.</li>
</ul>
<h3>Sustainability trends</h3>
<p>Event technology is also shifting toward <strong>sustainability</strong>: LED fixtures over older incandescent lighting (far lower power draw and heat), digital signage/apps replacing printed programmes and badges, and equipment rental/sharing models reducing single-use hardware — all now standard evaluation criteria for corporate and government event tenders, not just marketing talking points.</p>
<div class="callout"><span class="badge">Tech serves the goal, still</span> Every trend in this chapter is judged by the same rule from Chapter 1: does it improve the audience experience or the organiser's outcome, or is it a gimmick bolted on because it's new? A technical producer's job is to ask that question before adding any new technology to an event.</div>`,
    `<span class="eyebrow">EET201 · Chương 8 · Bài 8.1</span>
<h2>Công nghệ mới &amp; xu hướng tương lai</h2>
<h3>AR/VR</h3>
<p><strong>Augmented Reality (AR)</strong> phủ nội dung số lên thế giới thật (qua camera điện thoại hoặc kính đeo) — dùng cho trải nghiệm booth tương tác hoặc cho khán giả "thấy" một tính năng sản phẩm không có mặt vật lý. <strong>Virtual Reality (VR)</strong> thay thế hoàn toàn môi trường thật bằng môi trường mô phỏng — dùng cho tham quan địa điểm từ xa, mô phỏng đào tạo, hoặc không gian sự kiện hoàn toàn ảo nơi avatar tương tác với nhau.</p>
<h3>RFID</h3>
<p>Vòng tay hoặc thẻ <strong>RFID (Radio-Frequency Identification)</strong> cho khách chạm để vào cửa, thanh toán không tiếp xúc tại bar/gian hàng, hoặc tự động check-in phiên — nhanh hơn quét QR code, và có thể thu thập dữ liệu tương tác phong phú (khách thực sự tham gia phiên/gian hàng nào) mà không cần bước quét thủ công của nhân viên.</p>
<h3>AI trong công nghệ sự kiện</h3>
<ul>
<li><strong>Chatbot hỗ trợ khách</strong> — trả lời câu hỏi lịch trình/hậu cần ngay lập tức, giảm tải cho bàn hỗ trợ trực tiếp.</li>
<li><strong>Cá nhân hoá</strong> — gợi ý phiên hoặc kết nối networking dựa trên sở thích/chức vụ khách đã khai báo.</li>
<li><strong>Dữ liệu sản xuất thời gian thực</strong> — chuyển camera có AI hỗ trợ, phụ đề trực tiếp/dịch cho khán giả hybrid, và tự động tạo video highlight từ bản ghi livestream.</li>
</ul>
<h3>Xu hướng bền vững</h3>
<p>Công nghệ sự kiện cũng đang chuyển dịch theo hướng <strong>bền vững</strong>: đèn LED thay cho đèn sợi đốt cũ (tiêu thụ điện và sinh nhiệt thấp hơn nhiều), màn hình số/app thay thế chương trình in và thẻ đeo giấy, và mô hình thuê/chia sẻ thiết bị giảm phần cứng dùng một lần — tất cả nay là tiêu chí đánh giá chuẩn cho đấu thầu sự kiện doanh nghiệp và nhà nước, không còn chỉ là câu chuyện marketing.</p>
<div class="callout"><span class="badge">Công nghệ vẫn phục vụ mục tiêu</span> Mọi xu hướng trong chương này được đánh giá bằng đúng nguyên tắc ở Chương 1: nó có cải thiện trải nghiệm khán giả hoặc kết quả của ban tổ chức không, hay chỉ là chiêu trò gắn thêm vì nó mới? Việc của technical producer là đặt câu hỏi đó trước khi thêm bất kỳ công nghệ mới nào vào một sự kiện.</div>`,
  ]]);

const c8q = quiz('eet201-quiz-8', 'Quiz 8 — Emerging technology & trends|||Quiz 8 — Công nghệ mới & xu hướng', [
  { id: 'q1', question: 'Điểm khác nhau chính giữa AR và VR trong sự kiện là gì?', options: ['AR và VR giống nhau hoàn toàn', 'AR phủ nội dung số lên thế giới thật; VR thay thế hoàn toàn môi trường thật', 'AR chỉ dùng cho thanh toán; VR chỉ dùng cho check-in', 'AR cần RFID, VR không cần'], correctIndex: 1, explanation: 'AR = lớp phủ số lên thực tế thật; VR = mô phỏng thay thế hoàn toàn môi trường thật.' },
  { id: 'q2', question: 'Lợi thế của RFID so với quét QR code truyền thống là gì?', options: ['RFID không cần điện', 'Nhanh hơn (chạm) và thu được dữ liệu tương tác phong phú mà không cần quét thủ công', 'RFID rẻ hơn tất cả công nghệ khác', 'RFID thay thế được rigging'], correctIndex: 1, explanation: 'RFID cho phép chạm nhanh vào cửa/thanh toán và tự động ghi nhận tương tác (phiên, gian hàng) không cần nhân viên quét.' },
  { id: 'q3', question: 'Nguyên tắc đánh giá công nghệ mới trong bài học nhắc lại từ Chương 1 là gì?', options: ['Công nghệ mới luôn phải dùng vì nó hiện đại', 'Công nghệ phải cải thiện trải nghiệm khán giả hoặc kết quả tổ chức, không phải chiêu trò', 'Chỉ dùng công nghệ nếu rẻ nhất', 'Chỉ dùng AI, bỏ hết công nghệ cũ'], correctIndex: 1, explanation: 'Nguyên tắc xuyên suốt: công nghệ phục vụ trải nghiệm khán giả/nội dung, không tồn tại chỉ vì nó mới hay hào nhoáng.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'EET201',
    slug: 'eet201-entertainment-and-event-technology',
    title: 'Entertainment and Event Technology',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EET201.webp',
    shortDescription: 'Technology behind live events: sound (PA, mixing, mics), stage lighting & DMX, LED/projection, staging & rigging safety, livestream & hybrid, event software (ticketing, check-in), emerging tech (AR/VR, RFID, AI). Bilingual, with quizzes.|||Công nghệ sau sự kiện trực tiếp: âm thanh (PA, mixing, mic), ánh sáng & DMX, LED/trình chiếu, an toàn sân khấu & rigging, livestream & hybrid, phần mềm sự kiện (ticketing, check-in), công nghệ mới (AR/VR, RFID, AI). Song ngữ, có quiz.',
    description: 'Môn <strong>EET201 — Entertainment and Event Technology</strong> (khối Quản trị Kinh doanh, kỳ 3) trang bị hiểu biết về <strong>công nghệ đứng sau mọi sự kiện trực tiếp</strong>. Từ <strong>tổng quan &amp; chuỗi tín hiệu AV</strong> → <strong>hệ thống âm thanh</strong> (PA, mixing, microphone) → <strong>ánh sáng sân khấu</strong> (fixture, DMX, hiệu ứng) → <strong>màn hình, video &amp; trình chiếu</strong> (LED wall, projection mapping) → <strong>sân khấu, rigging &amp; an toàn kỹ thuật</strong> → <strong>livestream, hybrid &amp; virtual events</strong> → <strong>phần mềm quản lý sự kiện</strong> (ticketing, check-in, đăng ký) → <strong>công nghệ mới</strong> (AR/VR, RFID, AI) &amp; xu hướng tương lai. Trích dẫn "Technical Production for Events", "Sound and Lighting for Events" và tài liệu AV/staging ngành, song ngữ, có ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'Chuỗi tín hiệu AV & technical rider/site survey; hệ thống PA, bàn mixing (gain/EQ/aux/fader), loại microphone & polar pattern, feedback; fixture ánh sáng (PAR/moving head/wash/spot), DMX512, hiệu ứng (haze/gobo/strobe); LED wall (pixel pitch), máy chiếu (lumen/throw ratio), video switcher/scaler, projection mapping; staging & truss, rigging & Working Load Limit, vai trò rigger có chứng chỉ, checklist an toàn; livestream/hybrid/virtual, encoder/bitrate, latency, tương tác khán giả online; ticketing, check-in QR/RFID, registration, tích hợp CRM/email; AR/VR, RFID, AI trong sự kiện, xu hướng bền vững.',
    requirements: 'Không yêu cầu kiến thức kỹ thuật trước đó. Quan tâm đến tổ chức sự kiện, sân khấu, hoặc sản xuất truyền thông là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vai trò công nghệ trong sự kiện, chuỗi tín hiệu, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan công nghệ sự kiện & AV|||Chapter 1 — Event tech & AV overview', description: 'Sáu mảng kỹ thuật, chuỗi tín hiệu AV, technical rider & site survey.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hệ thống âm thanh|||Chapter 2 — Sound systems', description: 'PA, mixing console, microphone & polar pattern, feedback.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ánh sáng sân khấu & hiệu ứng|||Chapter 3 — Stage lighting & effects', description: 'Fixture, DMX512, haze/gobo/strobe.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Màn hình, video & trình chiếu|||Chapter 4 — Screens, video & projection', description: 'LED wall, máy chiếu, video switcher/scaler, projection mapping.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sân khấu, rigging & an toàn kỹ thuật|||Chapter 5 — Staging, rigging & safety', description: 'Deck, truss, WLL, rigger có chứng chỉ, checklist an toàn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Livestream, hybrid & virtual events|||Chapter 6 — Livestream, hybrid & virtual', description: 'Encoder/bitrate, latency, tương tác khán giả online.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phần mềm quản lý sự kiện|||Chapter 7 — Event-management software', description: 'Ticketing, check-in QR, registration, CRM/email.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công nghệ mới & xu hướng tương lai|||Chapter 8 — Emerging technology & trends', description: 'AR/VR, RFID, AI, bền vững.', lessons: [c8, c8q] },
  ],
};
