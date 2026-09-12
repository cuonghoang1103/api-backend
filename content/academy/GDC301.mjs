/**
 * GDC301 — Game Design Fundamentals: From Concept to Creation. Giáo trình FLM
 * (syl): khung MDA/core loop/design pillar, GDD, progression/economy/balance,
 * level design, character & combat design, narrative. Môn THIẾT KẾ (ít code).
 * Song ngữ + bài tập. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('gdc301-0-1-overview', 'Course overview: Game Design|||Tổng quan: Thiết kế game',
  'Thiết kế game khác lập trình game thế nào; các khung nền tảng (MDA, core loop, design pillar); lộ trình: khung → hệ thống/kinh tế → level → nhân vật/combat → narrative.',
  [[
    `<span class="eyebrow">GDC301 · Lesson 0.1 · Overview</span>
<h2>Game Design — from concept to creation</h2>
<p class="lead">Before diving into coding, great games start with <strong>design</strong>: the mechanics, rules, systems and stories that make players want to keep playing. This course teaches you to <em>think</em> like a designer and document your ideas the way the industry does — no heavy coding required.</p>
<h3>Design vs programming</h3>
<p>A programmer answers "how do we build it?"; a <strong>designer</strong> answers "<em>what</em> should we build, and <em>why</em> is it fun?" You'll analyze existing games, then design and document your own mechanics.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Core frameworks</strong> — MDA, core loops, design pillars</li>
<li><strong>Systems design</strong> — progression, economy, balance, the GDD</li>
<li><strong>Level design</strong> — guiding, challenging and teaching players through space</li>
<li><strong>Character &amp; combat design</strong> — roles, readability, balance</li>
<li><strong>Narrative</strong> — story, world, characters</li>
</ul>
<div class="callout"><span class="badge">Note</span> This is a design course — the deliverables are documents and prototypes, not code. Bilingual, with worked examples and design exercises.</div>`,
    `<span class="eyebrow">GDC301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế game — từ ý tưởng tới sản phẩm</h2>
<p class="lead">Trước khi lao vào code, game hay bắt đầu từ <strong>thiết kế</strong>: cơ chế, luật, hệ thống và câu chuyện khiến người chơi muốn chơi tiếp. Môn này dạy bạn <em>tư duy</em> như một nhà thiết kế và ghi lại ý tưởng theo cách ngành làm — không cần code nặng.</p>
<h3>Thiết kế vs lập trình</h3>
<p>Lập trình viên trả lời "xây thế nào?"; <strong>nhà thiết kế</strong> trả lời "<em>nên</em> xây gì, và vì sao nó vui?" Bạn sẽ phân tích game có sẵn, rồi thiết kế và ghi tài liệu cho cơ chế của mình.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Khung nền tảng</strong> — MDA, core loop, design pillar</li>
<li><strong>Thiết kế hệ thống</strong> — tiến trình, kinh tế, cân bằng, GDD</li>
<li><strong>Thiết kế màn chơi</strong> — dẫn dắt, thử thách, dạy người chơi qua không gian</li>
<li><strong>Thiết kế nhân vật &amp; combat</strong> — vai trò, dễ đọc, cân bằng</li>
<li><strong>Narrative</strong> — câu chuyện, thế giới, nhân vật</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Đây là môn thiết kế — sản phẩm là tài liệu và prototype, không phải code. Song ngữ, có ví dụ mẫu và bài tập thiết kế.</div>`,
  ]]);

const c1 = doc('gdc301-1-1-mda-loops-pillars', '1.1 — MDA, core loops & design pillars|||1.1 — MDA, core loop & design pillar',
  'Khung MDA (Mechanics–Dynamics–Aesthetics), core loop (vòng lặp cốt lõi), design pillar (trụ thiết kế) — công cụ phân tích & định hướng game.',
  [[
    `<span class="eyebrow">GDC301 · Chapter 1 · Lesson 1.1</span>
<h2>Core frameworks: MDA, loops &amp; pillars</h2>
<h3>MDA — Mechanics, Dynamics, Aesthetics</h3>
<ul>
<li><strong>Mechanics</strong> — the rules &amp; systems you build (jump, shoot, collect).</li>
<li><strong>Dynamics</strong> — the behaviour that emerges when players use the mechanics (rushing, hoarding, cooperating).</li>
<li><strong>Aesthetics</strong> — the emotions the player feels (tension, discovery, triumph).</li>
</ul>
<p>Designers build <em>Mechanics</em>; players experience <em>Aesthetics</em>. The trick: work <strong>backwards</strong> — decide the feeling you want, then pick mechanics likely to produce it.</p>
<h3>The core loop</h3>
<p>The <strong>core loop</strong> is the short, repeated cycle a player does over and over — the heartbeat of the game. In a shooter: <em>see enemy → aim → shoot → get reward → repeat</em>. If the core loop isn't fun in 10 seconds, no amount of content saves the game.</p>
<h3>Design pillars</h3>
<p><strong>Design pillars</strong> are 3-4 short statements that define what your game <em>is</em> (e.g. "Tense stealth", "Every death teaches", "Readable at a glance"). Every feature decision is checked against them — if it doesn't serve a pillar, cut it. Pillars keep a team aligned.</p>`,
    `<span class="eyebrow">GDC301 · Chương 1 · Bài 1.1</span>
<h2>Khung nền tảng: MDA, loop &amp; pillar</h2>
<h3>MDA — Mechanics, Dynamics, Aesthetics</h3>
<ul>
<li><strong>Mechanics</strong> — luật &amp; hệ thống bạn xây (nhảy, bắn, thu thập).</li>
<li><strong>Dynamics</strong> — hành vi nảy sinh khi người chơi dùng cơ chế (lao tới, tích trữ, hợp tác).</li>
<li><strong>Aesthetics</strong> — cảm xúc người chơi cảm nhận (căng thẳng, khám phá, chiến thắng).</li>
</ul>
<p>Nhà thiết kế xây <em>Mechanics</em>; người chơi trải <em>Aesthetics</em>. Mẹo: làm <strong>ngược</strong> — chọn cảm giác muốn có, rồi chọn cơ chế dễ tạo ra nó.</p>
<h3>Core loop</h3>
<p><strong>Core loop</strong> là chu trình ngắn, lặp đi lặp lại người chơi làm hoài — nhịp tim của game. Trong game bắn súng: <em>thấy địch → ngắm → bắn → nhận thưởng → lặp</em>. Nếu core loop không vui trong 10 giây, bao nhiêu nội dung cũng không cứu được game.</p>
<h3>Design pillar</h3>
<p><strong>Design pillar</strong> là 3-4 câu ngắn định nghĩa game của bạn <em>là gì</em> (vd "Lén lút căng thẳng", "Mỗi lần chết là một bài học", "Nhìn phát hiểu ngay"). Mọi quyết định tính năng đều đối chiếu với chúng — không phục vụ trụ nào thì cắt. Pillar giữ cả nhóm cùng hướng.</p>`,
  ]]);

const c1q = quiz('gdc301-quiz-1', 'Quiz 1 — MDA, loops & pillars|||Quiz 1 — MDA, loop & pillar', [
  { id: 'q1', question: 'Trong MDA, cảm xúc người chơi cảm nhận là?', options: ['Mechanics', 'Dynamics', 'Aesthetics', 'Assets'], correctIndex: 2, explanation: 'Aesthetics = cảm xúc; nhà thiết kế xây Mechanics để tạo ra nó.' },
  { id: 'q2', question: '"Core loop" của game là?', options: ['Vòng lặp for trong code', 'Chu trình ngắn người chơi lặp đi lặp lại (nhịp tim game)', 'Menu chính', 'Danh sách level'], correctIndex: 1, explanation: 'Core loop là hoạt động lặp cốt lõi; phải vui trong vài giây.' },
  { id: 'q3', question: 'Design pillar dùng để?', options: ['Vẽ nhân vật', 'Định nghĩa game LÀ GÌ, làm chuẩn để quyết định/cắt tính năng', 'Tối ưu FPS', 'Lưu game'], correctIndex: 1, explanation: '3-4 trụ ngắn giữ nhóm cùng hướng, lọc tính năng.' },
]);

const c2 = doc('gdc301-2-1-systems-economy-gdd', '2.1 — Systems, economy, balance & the GDD|||2.1 — Hệ thống, kinh tế, cân bằng & GDD',
  'Progression (đường tiến của người chơi), economy (nguồn/bể tài nguyên), balance (cân bằng độ khó/sức mạnh), và tài liệu GDD chuẩn ngành.',
  [[
    `<span class="eyebrow">GDC301 · Chapter 2 · Lesson 2.1</span>
<h2>Systems design: progression, economy, balance</h2>
<h3>Progression</h3>
<p><strong>Progression</strong> is how a player grows — levels, skills, unlocks, story. Good progression paces new content so the player always has a next goal that feels reachable but not trivial (the <em>flow channel</em>: challenge rising with skill).</p>
<h3>Economy — sources &amp; sinks</h3>
<p>A game <strong>economy</strong> is resources flowing through <strong>sources</strong> (where currency/items come from — kills, quests) and <strong>sinks</strong> (where they drain — shops, upgrades, repairs). If sources outpace sinks, the currency becomes worthless (inflation); if sinks dominate, players feel starved. Designers tune the ratio.</p>
<h3>Balance</h3>
<p><strong>Balance</strong> keeps choices meaningful: no single weapon/strategy should dominate all others (avoid a "no-brainer" best pick). Techniques: rock-paper-scissors counters, cost vs power trade-offs, and lots of playtesting with data.</p>
<h3>The GDD</h3>
<p>A <strong>Game Design Document</strong> records the vision, pillars, core loop, mechanics, systems, and content so a team builds the <em>same</em> game. It's a living document, not a one-time essay — updated as the design evolves.</p>`,
    `<span class="eyebrow">GDC301 · Chương 2 · Bài 2.1</span>
<h2>Thiết kế hệ thống: tiến trình, kinh tế, cân bằng</h2>
<h3>Progression (tiến trình)</h3>
<p><strong>Progression</strong> là cách người chơi lớn lên — level, kỹ năng, mở khoá, cốt truyện. Tiến trình tốt điều nhịp nội dung mới sao cho người chơi luôn có mục tiêu kế tiếp cảm thấy với tới được mà không tầm thường (<em>kênh flow</em>: thử thách tăng cùng kỹ năng).</p>
<h3>Kinh tế — nguồn &amp; bể</h3>
<p><strong>Kinh tế</strong> game là tài nguyên chảy qua <strong>nguồn (source)</strong> (nơi tiền/vật phẩm sinh ra — giết địch, nhiệm vụ) và <strong>bể (sink)</strong> (nơi tiêu hao — cửa hàng, nâng cấp, sửa chữa). Nguồn vượt bể thì tiền mất giá (lạm phát); bể lấn át thì người chơi thấy đói. Nhà thiết kế chỉnh tỉ lệ.</p>
<h3>Cân bằng (balance)</h3>
<p><strong>Cân bằng</strong> giữ cho lựa chọn có ý nghĩa: không vũ khí/chiến thuật nào áp đảo tất cả (tránh lựa chọn "hiển nhiên nhất"). Kỹ thuật: khắc chế kiểu kéo-búa-bao, đánh đổi giá vs sức mạnh, và playtest nhiều với dữ liệu.</p>
<h3>GDD</h3>
<p><strong>Game Design Document</strong> ghi lại tầm nhìn, pillar, core loop, cơ chế, hệ thống, nội dung để cả nhóm dựng <em>cùng một</em> game. Nó là tài liệu sống, không phải bài luận một lần — cập nhật khi thiết kế tiến hoá.</p>`,
  ]]);

const c2e = doc('gdc301-2-2-exercise', 'Exercise 1 — a one-page GDD|||Bài tập 1 — GDD một trang',
  'Bài tập: viết GDD một trang cho một game nhỏ (pillar + core loop + kinh tế), kèm mẫu gợi ý.',
  [[
    `<span class="eyebrow">GDC301 · Chapter 2 · Exercise</span>
<h2>Exercise 1 — write a one-page GDD</h2>
<div class="callout"><span class="badge">Đề</span> Pick a simple game idea and write a one-page GDD: title, 3 design pillars, the core loop, and one economy (a source + a sink).</div>
<h3>Worked example (template)</h3>
<pre><code>TITLE: Coin Diver
PILLARS:
  1. Tense one-more-run (short, risky dives)
  2. Every death teaches (telegraphed hazards)
  3. Readable at a glance (color = danger)
CORE LOOP:
  dive -&gt; grab coins -&gt; dodge hazards -&gt; surface to bank coins -&gt; upgrade -&gt; dive deeper
ECONOMY:
  Source: coins collected on a dive
  Sink:   upgrades (bigger lungs, faster swim) bought at the surface
BALANCE NOTE:
  Deeper = more coins BUT less air; the risk/reward must tempt, not force.
</code></pre>
<p><strong>Why one page:</strong> a tight GDD forces you to name the <em>essence</em> — if you can't state the pillars and loop on one page, the design isn't clear yet. The economy line (a source paired with a sink) is what keeps the loop from becoming pointless: coins matter only because the surface upgrades drain them.</p>`,
    `<span class="eyebrow">GDC301 · Chương 2 · Bài tập</span>
<h2>Bài tập 1 — viết GDD một trang</h2>
<div class="callout"><span class="badge">Đề</span> Chọn một ý tưởng game đơn giản và viết GDD một trang: tên, 3 design pillar, core loop, và một vòng kinh tế (một source + một sink).</div>
<h3>Ví dụ mẫu (khuôn)</h3>
<pre><code>TÊN: Coin Diver
PILLAR:
  1. Căng thẳng "chơi thêm lần nữa" (lặn ngắn, mạo hiểm)
  2. Mỗi lần chết là bài học (hiểm hoạ báo trước)
  3. Nhìn phát hiểu (màu = nguy hiểm)
CORE LOOP:
  lặn -&gt; nhặt coin -&gt; né hiểm hoạ -&gt; ngoi lên gửi coin -&gt; nâng cấp -&gt; lặn sâu hơn
KINH TẾ:
  Source: coin nhặt được mỗi lần lặn
  Sink:   nâng cấp (phổi lớn hơn, bơi nhanh hơn) mua ở mặt nước
GHI CHÚ CÂN BẰNG:
  Càng sâu = càng nhiều coin NHƯNG ít khí; rủi ro/phần thưởng phải CÁM DỖ, không ép.
</code></pre>
<p><strong>Vì sao một trang:</strong> GDD gọn ép bạn gọi tên <em>cốt lõi</em> — nếu không nêu được pillar và loop trong một trang, thiết kế chưa rõ. Dòng kinh tế (một source ghép một sink) là thứ giữ cho loop không vô nghĩa: coin chỉ có giá trị vì nâng cấp ở mặt nước tiêu hao nó.</p>`,
  ]]);

const c2q = quiz('gdc301-quiz-2', 'Quiz 2 — Systems & economy|||Quiz 2 — Hệ thống & kinh tế', [
  { id: 'q1', question: 'Trong kinh tế game, "sink" là?', options: ['Nơi tài nguyên sinh ra', 'Nơi tài nguyên tiêu hao (shop/nâng cấp)', 'Bảng điểm', 'Nhân vật'], correctIndex: 1, explanation: 'Source sinh ra, sink tiêu hao; tỉ lệ hai bên quyết định lạm phát/đói.' },
  { id: 'q2', question: 'Mục tiêu của "balance" trong thiết kế?', options: ['Đồ hoạ đẹp hơn', 'Giữ lựa chọn có ý nghĩa, không chiến thuật nào áp đảo tất cả', 'Tăng FPS', 'Rút ngắn game'], correctIndex: 1, explanation: 'Cân bằng tránh lựa chọn "hiển nhiên nhất", giữ đa dạng.' },
  { id: 'q3', question: 'GDD (Game Design Document) là?', options: ['Mã nguồn game', 'Tài liệu sống ghi tầm nhìn/pillar/loop/hệ thống để cả nhóm dựng cùng một game', 'File save', 'Bảng xếp hạng'], correctIndex: 1, explanation: 'GDD đồng bộ nhóm, cập nhật khi thiết kế tiến hoá.' },
]);

const c3 = doc('gdc301-3-1-level-character-narrative', '3.1 — Level, character & narrative design|||3.1 — Thiết kế màn chơi, nhân vật & narrative',
  'Level design (dẫn dắt/dạy/thử thách qua không gian & pacing), character & combat design (vai trò rõ, dễ đọc, tham số cân bằng), narrative (câu chuyện & thế giới).',
  [[
    `<span class="eyebrow">GDC301 · Chapter 3 · Lesson 3.1</span>
<h2>Level, character &amp; narrative design</h2>
<h3>Level design</h3>
<p>A good level <strong>guides, challenges and teaches</strong> without a text tutorial. Techniques: <strong>lead the eye</strong> (light, color, lines point to the goal), <strong>safe-to-learn spaces</strong> (introduce a hazard where it can't kill, then combine it later), and <strong>pacing</strong> (alternate tension and relief). The first minutes should teach the core mechanic through play.</p>
<h3>Character &amp; combat design</h3>
<ul>
<li><strong>Clear role</strong> — each character/enemy has one job the player can name ("the fast flanker", "the shielded tank").</li>
<li><strong>Readability</strong> — silhouette, color and animation telegraph what's about to happen, so the player can react fairly.</li>
<li><strong>Balanced parameters</strong> — health, damage, speed, cooldown are tuned so counters exist.</li>
</ul>
<h3>Narrative</h3>
<p><strong>Narrative</strong> is more than cutscenes — story lives in the world, characters, and even the mechanics (a mechanic that <em>means</em> something lands harder). Tools: a compelling goal, memorable characters, and <strong>environmental storytelling</strong> (the world shows its history without a word).</p>
<div class="callout"><span class="badge">Through-line</span> Level, character and story all serve the pillars and the feeling (Aesthetics) you chose in Chapter 1. Design is the craft of making every part pull in the same direction.</div>`,
    `<span class="eyebrow">GDC301 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế màn chơi, nhân vật &amp; narrative</h2>
<h3>Level design</h3>
<p>Một màn tốt <strong>dẫn dắt, thử thách và dạy</strong> mà không cần hướng dẫn bằng chữ. Kỹ thuật: <strong>dẫn mắt</strong> (ánh sáng, màu, đường nét chỉ về đích), <strong>không gian an toàn để học</strong> (giới thiệu hiểm hoạ ở nơi không giết được, rồi kết hợp về sau), và <strong>pacing</strong> (xen kẽ căng thẳng và nghỉ). Vài phút đầu nên dạy cơ chế cốt lõi qua việc chơi.</p>
<h3>Thiết kế nhân vật &amp; combat</h3>
<ul>
<li><strong>Vai trò rõ</strong> — mỗi nhân vật/kẻ địch có một việc người chơi gọi tên được ("kẻ đánh sườn nhanh", "tank có khiên").</li>
<li><strong>Dễ đọc (readability)</strong> — bóng dáng, màu và hoạt ảnh báo trước điều sắp xảy ra, để người chơi phản ứng công bằng.</li>
<li><strong>Tham số cân bằng</strong> — máu, sát thương, tốc độ, hồi chiêu được chỉnh để có khắc chế.</li>
</ul>
<h3>Narrative</h3>
<p><strong>Narrative</strong> hơn cả cutscene — câu chuyện nằm trong thế giới, nhân vật, và cả cơ chế (một cơ chế <em>mang ý nghĩa</em> chạm mạnh hơn). Công cụ: mục tiêu cuốn hút, nhân vật đáng nhớ, và <strong>kể chuyện bằng môi trường</strong> (thế giới phô lịch sử mà không cần một từ).</p>
<div class="callout"><span class="badge">Xuyên suốt</span> Màn chơi, nhân vật và câu chuyện đều phục vụ pillar và cảm giác (Aesthetics) bạn chọn ở Chương 1. Thiết kế là nghề làm cho mọi phần kéo về cùng một hướng.</div>`,
  ]]);

const c3q = quiz('gdc301-quiz-3', 'Quiz 3 — Level/character/narrative|||Quiz 3 — Màn/nhân vật/narrative', [
  { id: 'q1', question: 'Giới thiệu hiểm hoạ mới ở nơi KHÔNG thể giết người chơi rồi mới kết hợp sau là kỹ thuật?', options: ['Lạm phát kinh tế', 'Không gian an toàn để học (level design)', 'Singleton', 'Balance vũ khí'], correctIndex: 1, explanation: 'Dạy cơ chế trong vùng an toàn trước khi tăng độ khó.' },
  { id: 'q2', question: '"Readability" của nhân vật/kẻ địch nghĩa là?', options: ['Chữ trong game dễ đọc', 'Bóng dáng/màu/hoạt ảnh báo trước hành động để phản ứng công bằng', 'Nhiều máu', 'Chạy nhanh'], correctIndex: 1, explanation: 'Telegraph giúp người chơi đọc và phản ứng công bằng.' },
  { id: 'q3', question: '"Environmental storytelling" là?', options: ['Cutscene dài', 'Thế giới tự phô lịch sử/câu chuyện mà không cần lời thoại', 'Bảng điểm', 'Menu'], correctIndex: 1, explanation: 'Kể chuyện qua môi trường, không cần chữ.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'GDC301',
    slug: 'gdc301-game-design-fundamentals-from-concept-to-creation',
    title: 'Game Design Fundamentals - From Concept to Creation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GDC301.webp',
    shortDescription: 'Think like a game designer — MDA, core loops & design pillars; systems, economy, balance & the GDD; level, character, combat & narrative design. A design course (little code), bilingual, with exercises.|||Tư duy như nhà thiết kế game — MDA, core loop & design pillar; hệ thống, kinh tế, cân bằng & GDD; thiết kế màn chơi, nhân vật, combat & narrative. Môn thiết kế (ít code), song ngữ, có bài tập.',
    description: 'Môn <strong>GDC301 — Game Design Fundamentals: From Concept to Creation</strong> (kỳ 7) dạy <strong>tư duy thiết kế game</strong> trước khi code. Từ các <strong>khung nền tảng</strong> (MDA, core loop, design pillar) → <strong>thiết kế hệ thống</strong> (progression, economy nguồn/bể, balance, GDD) → <strong>thiết kế màn chơi, nhân vật, combat &amp; narrative</strong>. Bám giáo trình FLM, song ngữ, có ví dụ mẫu và bài tập thiết kế (viết GDD một trang). Đây là môn thiết kế — sản phẩm là tài liệu &amp; prototype, không phải code.',
    whatYouLearn: 'Phân tích game bằng MDA (Mechanics–Dynamics–Aesthetics); xác định core loop & viết design pillar; thiết kế progression (kênh flow), economy (source/sink, lạm phát/đói), balance (tránh lựa chọn hiển nhiên); viết GDD; level design (dẫn mắt, không gian an toàn để học, pacing); character/combat (vai trò rõ, readability/telegraph, tham số cân bằng); narrative & environmental storytelling.',
    requirements: 'Không cần lập trình. Thích chơi &amp; phân tích game là đủ.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thiết kế vs lập trình game.', lessons: [intro] },
    { title: 'Chương 1 — MDA, loop & pillar|||Chapter 1 — MDA, loops & pillars', description: 'Khung phân tích & định hướng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hệ thống, kinh tế & GDD|||Chapter 2 — Systems, economy & GDD', description: 'Progression, source/sink, balance, GDD.', lessons: [c2, c2e, c2q] },
    { title: 'Chương 3 — Màn chơi, nhân vật & narrative|||Chapter 3 — Level, character & narrative', description: 'Dẫn dắt qua không gian, readability, kể chuyện.', lessons: [c3, c3q] },
  ],
};
