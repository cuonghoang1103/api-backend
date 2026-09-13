/**
 * ANC302 — Character Design (Thiết kế nhân vật). Ngành Thiết kế mỹ thuật số
 * FPTU, Kỳ 4. Giáo trình chuẩn quốc tế: Stephen Silver "The Silver Way",
 * Michael Mattesi "Force: Character Design", Andrew Loomis "Figure Drawing
 * for All It's Worth", Disney/Pixar character design, ArtStation/Schoolism.
 * Lộ trình 4 bước: khái niệm → kỹ năng dựng hình → nhân vật có hồn → production.
 * Song ngữ VI+EN, ví dụ nhân vật nổi tiếng (Mickey, Pixar, game), quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong HTML; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('anc302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Silver, Mattesi, Loomis), khoá học online, YouTube, công cụ vẽ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ANC302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Character Design</strong> — shape language, anatomy, expression, personality, costume and production model sheets — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are trusted, mostly-free industry resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANC302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Essential books</h3>
<ul>
<li><em>The Silver Way</em> — Stephen Silver (character design thinking &amp; workflow)</li>
<li><em>Force: Character Design from Life Drawing</em> — Michael Mattesi (rhythm, gesture, shape)</li>
<li><em>Figure Drawing for All It's Worth</em> — Andrew Loomis (anatomy &amp; proportion)</li>
<li><em>The Animator's Survival Kit</em> — Richard Williams (pose &amp; appeal in motion)</li>
</ul>
<h3>🌐 Online learning</h3>
<ul>
<li><a href="https://www.schoolism.com/" target="_blank" rel="noopener">Schoolism</a> — character design courses by industry pros</li>
<li><a href="https://www.artstation.com/learning" target="_blank" rel="noopener">ArtStation Learning</a> — tutorials &amp; industry portfolios</li>
<li><a href="https://www.proko.com/" target="_blank" rel="noopener">Proko</a> — free anatomy &amp; figure drawing</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@stephensilverart" target="_blank" rel="noopener">Stephen Silver</a> — character design lessons</li>
<li><a href="https://www.youtube.com/@Proko" target="_blank" rel="noopener">Proko</a> — anatomy, gesture, construction</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — free digital painting</li>
<li><a href="https://www.clipstudio.net/" target="_blank" rel="noopener">Clip Studio Paint</a> — industry standard for character art</li>
<li><a href="https://www.pinterest.com/" target="_blank" rel="noopener">Pinterest / PureRef</a> — building reference &amp; mood boards</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — shape language, silhouette and what a shape says about personality.</li>
<li><strong>Construction</strong> — anatomy, proportion and stylization; gesture and line of action.</li>
<li><strong>Give it a soul</strong> — expression, personality, backstory and appeal.</li>
<li><strong>Production-ready</strong> — costume, color, turnarounds and a portfolio-quality model sheet.</li>
</ol></div>`,
    `<span class="eyebrow">ANC302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Thiết kế nhân vật</strong> — ngôn ngữ hình, giải phẫu, biểu cảm, tính cách, trang phục và model sheet cho production — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn uy tín, phần lớn miễn phí, của giới làm nghề.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANC302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><em>The Silver Way</em> — Stephen Silver (tư duy &amp; quy trình thiết kế nhân vật)</li>
<li><em>Force: Character Design from Life Drawing</em> — Michael Mattesi (nhịp điệu, gesture, hình khối)</li>
<li><em>Figure Drawing for All It's Worth</em> — Andrew Loomis (giải phẫu &amp; tỉ lệ)</li>
<li><em>The Animator's Survival Kit</em> — Richard Williams (tư thế &amp; sức hút trong chuyển động)</li>
</ul>
<h3>🌐 Học trực tuyến</h3>
<ul>
<li><a href="https://www.schoolism.com/" target="_blank" rel="noopener">Schoolism</a> — khoá thiết kế nhân vật do người trong nghề dạy</li>
<li><a href="https://www.artstation.com/learning" target="_blank" rel="noopener">ArtStation Learning</a> — hướng dẫn &amp; portfolio ngành</li>
<li><a href="https://www.proko.com/" target="_blank" rel="noopener">Proko</a> — giải phẫu &amp; vẽ dáng miễn phí</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@stephensilverart" target="_blank" rel="noopener">Stephen Silver</a> — bài học thiết kế nhân vật</li>
<li><a href="https://www.youtube.com/@Proko" target="_blank" rel="noopener">Proko</a> — giải phẫu, gesture, dựng hình</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — vẽ số miễn phí</li>
<li><a href="https://www.clipstudio.net/" target="_blank" rel="noopener">Clip Studio Paint</a> — chuẩn ngành cho vẽ nhân vật</li>
<li><a href="https://www.pinterest.com/" target="_blank" rel="noopener">Pinterest / PureRef</a> — dựng bảng tham khảo &amp; mood board</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ngôn ngữ hình, silhouette và hình nói gì về tính cách.</li>
<li><strong>Dựng hình</strong> — giải phẫu, tỉ lệ và phong cách hoá; gesture và line of action.</li>
<li><strong>Thổi hồn</strong> — biểu cảm, tính cách, câu chuyện và sức hút (appeal).</li>
<li><strong>Sẵn cho production</strong> — trang phục, màu sắc, turnaround và model sheet chuẩn portfolio.</li>
</ol></div>`,
  ]]);

const intro = doc('anc302-0-1-overview', 'Course overview: Character Design|||Tổng quan: Thiết kế nhân vật',
  'Thiết kế nhân vật là gì, tại sao quan trọng trong phim/game/hoạt hình; bốn trụ cột (hình khối, giải phẫu, biểu cảm, tính cách); lộ trình từ khái niệm đến model sheet.',
  [[
    `<span class="eyebrow">ANC302 · Lesson 0.1 · Overview</span>
<h2>Character Design</h2>
<p class="lead">A character is the <strong>face of a story</strong>. Before a single line of dialogue is written, a good design already tells us who this person is — brave or timid, kind or cruel, hero or villain. This course teaches you to <strong>design characters on purpose</strong>, not by accident, for film, games and animation.</p>
<h3>The four pillars</h3>
<ul>
<li><strong>Shape &amp; silhouette</strong> — what the outline says about personality.</li>
<li><strong>Anatomy &amp; proportion</strong> — construction, then stylization.</li>
<li><strong>Expression &amp; pose</strong> — bringing a static drawing to life.</li>
<li><strong>Personality &amp; appeal</strong> — the story, the archetype, the reason we care.</li>
</ul>
<h3>Roadmap</h3>
<p>What character design is &amp; the brief → shape language → anatomy &amp; proportion → expression &amp; pose → personality &amp; story → costume, props &amp; color → turnaround &amp; model sheet → a complete character project. Bilingual, with famous examples from Mickey Mouse to Pixar and game heroes, plus a quiz each chapter.</p>
<div class="callout"><span class="badge">Design says it first</span> Mickey Mouse is nearly all circles — instantly friendly. That is no accident: shape, proportion and pose do the storytelling before the plot ever starts.</div>`,
    `<span class="eyebrow">ANC302 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế nhân vật</h2>
<p class="lead">Nhân vật là <strong>gương mặt của câu chuyện</strong>. Trước cả một câu thoại, một thiết kế tốt đã cho ta biết đây là ai — dũng cảm hay nhút nhát, hiền hay ác, chính diện hay phản diện. Môn này dạy bạn <strong>thiết kế nhân vật một cách có chủ đích</strong>, không phải ngẫu nhiên, cho phim, game và hoạt hình.</p>
<h3>Bốn trụ cột</h3>
<ul>
<li><strong>Hình khối &amp; silhouette</strong> — đường viền nói gì về tính cách.</li>
<li><strong>Giải phẫu &amp; tỉ lệ</strong> — dựng hình trước, phong cách hoá sau.</li>
<li><strong>Biểu cảm &amp; tư thế</strong> — làm một bản vẽ tĩnh sống dậy.</li>
<li><strong>Tính cách &amp; sức hút</strong> — câu chuyện, archetype, lý do ta quan tâm.</li>
</ul>
<h3>Lộ trình</h3>
<p>Thiết kế nhân vật là gì &amp; brief → ngôn ngữ hình → giải phẫu &amp; tỉ lệ → biểu cảm &amp; tư thế → tính cách &amp; câu chuyện → trang phục, phụ kiện &amp; màu → turnaround &amp; model sheet → một dự án nhân vật hoàn chỉnh. Song ngữ, ví dụ nổi tiếng từ Mickey đến Pixar và nhân vật game, kèm quiz mỗi chương.</p>
<div class="callout"><span class="badge">Thiết kế nói trước</span> Mickey Mouse gần như toàn hình tròn — thân thiện ngay lập tức. Không hề tình cờ: hình, tỉ lệ và tư thế kể chuyện trước cả khi cốt truyện bắt đầu.</div>`,
  ]]);

const c1 = doc('anc302-1-1-what-is-character-design', '1.1 — What is character design|||1.1 — Thiết kế nhân vật là gì',
  'Vai trò nhân vật trong phim/game/hoạt hình; quy trình concept art; đọc và làm việc với brief; điều gì tạo nên một thiết kế "đúng việc".',
  [[
    `<span class="eyebrow">ANC302 · Chapter 1 · Lesson 1.1</span>
<h2>What is character design</h2>
<h3>Why characters matter</h3>
<p>We remember stories through the people in them. In <strong>film &amp; animation</strong> a character must read clearly at any size and pose; in <strong>games</strong> it must also work in motion, from many angles, and often at small on-screen sizes. Design is <em>problem-solving with drawing</em>: making a memorable, functional, on-brief character.</p>
<h3>The pipeline</h3>
<pre><code>Brief        -> who is this, for what, in what world &amp; style
Research     -> reference, mood board, silhouette thumbnails
Exploration  -> many rough options (shape &amp; proportion)
Refinement   -> pick the strongest, tighten the drawing
Final &amp; sheet -> color, turnaround, expressions (production-ready)
</code></pre>
<h3>Reading the brief</h3>
<p>A brief answers <strong>who, where, why and how</strong>: age and role, the world and its rules, the tone (comedy? horror?), and the target style. Every later decision — shape, proportion, costume, color — should trace back to the brief. A design that ignores the brief can be beautiful and still <em>wrong</em>.</p>
<div class="callout"><span class="badge">Famous example</span> Pixar's <strong>WALL·E</strong> had to be lovable with no face and almost no dialogue — the brief forced the design to carry emotion through <em>shape and eyes</em> alone. That constraint is what made it iconic.</div>`,
    `<span class="eyebrow">ANC302 · Chương 1 · Bài 1.1</span>
<h2>Thiết kế nhân vật là gì</h2>
<h3>Vì sao nhân vật quan trọng</h3>
<p>Ta nhớ câu chuyện qua những con người trong đó. Trong <strong>phim &amp; hoạt hình</strong>, nhân vật phải đọc rõ ở mọi kích cỡ và tư thế; trong <strong>game</strong> còn phải hoạt động khi chuyển động, từ nhiều góc, và thường ở kích thước nhỏ trên màn hình. Thiết kế là <em>giải quyết vấn đề bằng nét vẽ</em>: tạo một nhân vật đáng nhớ, hoạt động được, đúng brief.</p>
<h3>Quy trình</h3>
<pre><code>Brief        -> là ai, cho việc gì, thế giới &amp; phong cách nào
Nghiên cứu   -> reference, mood board, thumbnail silhouette
Khám phá     -> nhiều phương án thô (hình &amp; tỉ lệ)
Tinh chỉnh   -> chọn cái mạnh nhất, siết chặt nét vẽ
Final &amp; sheet -> màu, turnaround, biểu cảm (sẵn cho production)
</code></pre>
<h3>Đọc brief</h3>
<p>Brief trả lời <strong>ai, ở đâu, vì sao và như thế nào</strong>: tuổi và vai trò, thế giới và luật của nó, tông (hài? kinh dị?), và phong cách mục tiêu. Mọi quyết định sau — hình, tỉ lệ, trang phục, màu — đều nên truy về brief. Một thiết kế phớt lờ brief có thể đẹp mà vẫn <em>sai</em>.</p>
<div class="callout"><span class="badge">Ví dụ nổi tiếng</span> <strong>WALL·E</strong> của Pixar phải đáng yêu dù không có gương mặt và gần như không thoại — brief buộc thiết kế truyền cảm xúc chỉ bằng <em>hình khối và đôi mắt</em>. Chính giới hạn đó làm nên biểu tượng.</div>`,
  ]]);

const c1q = quiz('anc302-quiz-1', 'Quiz 1 — What is character design|||Quiz 1 — Thiết kế nhân vật là gì', [
  { id: 'q1', question: 'Bước ĐẦU TIÊN trong quy trình thiết kế nhân vật là?', options: ['Tô màu final', 'Đọc brief (là ai, cho việc gì, thế giới nào)', 'Vẽ turnaround', 'Dựng model sheet'], correctIndex: 1, explanation: 'Mọi quyết định sau đều truy về brief; nên bắt đầu từ brief.' },
  { id: 'q2', question: 'So với phim, thiết kế nhân vật GAME còn phải đảm bảo thêm điều gì?', options: ['Chỉ cần một góc nhìn', 'Hoạt động khi chuyển động, từ nhiều góc, ở kích thước nhỏ', 'Không cần biểu cảm', 'Chỉ đen trắng'], correctIndex: 1, explanation: 'Nhân vật game phải đọc được từ mọi góc, khi động, và ở size nhỏ.' },
  { id: 'q3', question: 'Bài học từ WALL·E của Pixar là?', options: ['Càng nhiều chi tiết càng tốt', 'Giới hạn của brief có thể dẫn tới thiết kế biểu tượng', 'Cần thật nhiều lời thoại', 'Màu sắc không quan trọng'], correctIndex: 1, explanation: 'Brief buộc truyền cảm xúc qua hình và mắt — chính giới hạn tạo nên biểu tượng.' },
]);

const c2 = doc('anc302-2-1-shape-language', '2.1 — Shape language & silhouette|||2.1 — Ngôn ngữ hình & silhouette',
  'Ba hình cơ bản (tròn/vuông/tam giác) và tính cách chúng gợi; đọc nhân vật qua silhouette; dùng hình chủ đạo để dẫn dắt thiết kế.',
  [[
    `<span class="eyebrow">ANC302 · Chapter 2 · Lesson 2.1</span>
<h2>Shape language &amp; silhouette</h2>
<h3>The three primary shapes</h3>
<ul>
<li><strong>Circle</strong> — friendly, cute, safe, innocent. Round designs feel harmless and lovable.</li>
<li><strong>Square</strong> — stable, strong, reliable, stubborn. Blocky designs feel dependable and heavy.</li>
<li><strong>Triangle</strong> — dynamic, dangerous, sharp. Pointed designs feel aggressive or villainous.</li>
</ul>
<p>A design usually has a <strong>dominant shape</strong> that sets the personality, with secondary shapes for variety and contrast.</p>
<h3>Silhouette test</h3>
<p>Fill the whole design solid black. If you can still tell <em>who it is</em> and read the pose, the silhouette is strong. Great characters are recognizable by outline alone — that is what makes them read at small sizes and in crowds.</p>
<pre><code>Round   -> Mickey, Baymax, Winnie the Pooh   (friendly)
Square  -> Mr. Incredible, Superman's jaw     (strong/reliable)
Triangle-> Maleficent, Ursula, most villains  (danger)
</code></pre>
<div class="callout"><span class="badge">Read the outline</span> Villains are often built from triangles — sharp shoulders, pointed collars, spiky silhouettes — so we feel the threat before they even speak.</div>`,
    `<span class="eyebrow">ANC302 · Chương 2 · Bài 2.1</span>
<h2>Ngôn ngữ hình &amp; silhouette</h2>
<h3>Ba hình cơ bản</h3>
<ul>
<li><strong>Tròn</strong> — thân thiện, dễ thương, an toàn, ngây thơ. Thiết kế tròn thấy vô hại và đáng yêu.</li>
<li><strong>Vuông</strong> — vững chãi, mạnh mẽ, đáng tin, lì lợm. Thiết kế khối vuông thấy chắc chắn và nặng.</li>
<li><strong>Tam giác</strong> — năng động, nguy hiểm, sắc. Thiết kế nhọn thấy hung hăng hoặc gian ác.</li>
</ul>
<p>Một thiết kế thường có <strong>hình chủ đạo</strong> định ra tính cách, cộng các hình phụ để tạo biến thể và tương phản.</p>
<h3>Phép thử silhouette</h3>
<p>Tô toàn bộ thiết kế thành khối đen đặc. Nếu vẫn nhận ra <em>đây là ai</em> và đọc được tư thế, silhouette đủ mạnh. Nhân vật hay thường nhận ra được chỉ qua đường viền — đó là điều giúp họ đọc được ở size nhỏ và giữa đám đông.</p>
<pre><code>Tròn    -> Mickey, Baymax, gấu Pooh          (thân thiện)
Vuông   -> Mr. Incredible, hàm Superman      (mạnh/đáng tin)
Tam giác-> Maleficent, Ursula, phần lớn ác   (nguy hiểm)
</code></pre>
<div class="callout"><span class="badge">Đọc đường viền</span> Nhân vật phản diện hay được dựng từ tam giác — vai nhọn, cổ áo nhọn, silhouette gai góc — để ta cảm thấy mối đe doạ trước cả khi chúng lên tiếng.</div>`,
  ]]);

const c2q = quiz('anc302-quiz-2', 'Quiz 2 — Shape language|||Quiz 2 — Ngôn ngữ hình', [
  { id: 'q1', question: 'Hình nào thường gợi cảm giác thân thiện, dễ thương, an toàn?', options: ['Tam giác', 'Hình vuông', 'Hình tròn', 'Hình thoi'], correctIndex: 2, explanation: 'Hình tròn gợi thân thiện, vô hại — như Mickey, Baymax.' },
  { id: 'q2', question: 'Vì sao nhân vật phản diện hay dùng nhiều tam giác/hình nhọn?', options: ['Vì dễ vẽ hơn', 'Vì hình nhọn gợi nguy hiểm, hung hăng', 'Vì tiết kiệm màu', 'Vì luật hoạt hình bắt buộc'], correctIndex: 1, explanation: 'Tam giác/hình nhọn gợi đe doạ — ta cảm nhận trước khi nhân vật nói.' },
  { id: 'q3', question: 'Phép thử silhouette là?', options: ['Tô thiết kế thành khối đen, xem còn nhận ra được không', 'Đếm số màu dùng', 'Vẽ nhân vật ở 8 góc', 'Đo tỉ lệ đầu-thân'], correctIndex: 0, explanation: 'Silhouette mạnh nếu nhận ra nhân vật và đọc được tư thế chỉ qua khối đen.' },
]);

const c3 = doc('anc302-3-1-anatomy-proportion', '3.1 — Anatomy & proportion|||3.1 — Giải phẫu & tỉ lệ',
  'Dựng hình theo Loomis; tỉ lệ đo bằng số đầu (head count); phong cách hoá (stylization) từ tả thực đến chibi; giữ giải phẫu đúng khi cường điệu.',
  [[
    `<span class="eyebrow">ANC302 · Chapter 3 · Lesson 3.1</span>
<h2>Anatomy &amp; proportion</h2>
<h3>Measuring in heads</h3>
<p>Artists measure the body in <strong>head units</strong> — how many head-heights tall a figure is. This keeps proportion consistent across poses and angles.</p>
<pre><code>Realistic adult   -> about 7.5 to 8 heads tall
Heroic / idealized-> about 8 to 8.5 heads (comic superheroes)
Stylized / cartoon-> about 2 to 5 heads
Chibi / cute      -> about 2 heads (huge head, tiny body)
</code></pre>
<h3>Construction first (Loomis)</h3>
<p>Before detail, build the figure from simple 3D volumes — spheres, cylinders, boxes. Loomis's method starts with a <strong>ball-and-plane head</strong> and a gestural skeleton, so the body turns believably in space. Detail sits on top of solid construction, never instead of it.</p>
<h3>Stylization = purposeful exaggeration</h3>
<p>Stylizing is not "getting anatomy wrong" — it is <em>exaggerating the truth</em>. A big head reads as young or cute; long limbs read as elegant; a heavy lower body reads as grounded and strong. You must know real anatomy to bend it convincingly.</p>
<div class="callout"><span class="badge">Famous example</span> Pixar's characters keep <strong>believable underlying anatomy</strong> even when heavily stylized — Mr. Incredible is a giant square torso on small legs, exaggerated but structurally sound, so he still moves like a real body.</div>`,
    `<span class="eyebrow">ANC302 · Chương 3 · Bài 3.1</span>
<h2>Giải phẫu &amp; tỉ lệ</h2>
<h3>Đo bằng số đầu</h3>
<p>Hoạ sĩ đo cơ thể bằng <strong>đơn vị đầu</strong> — nhân vật cao bằng mấy chiều cao đầu. Cách này giữ tỉ lệ nhất quán qua mọi tư thế và góc nhìn.</p>
<pre><code>Người lớn tả thực -> khoảng 7,5 đến 8 đầu
Anh hùng lý tưởng -> khoảng 8 đến 8,5 đầu (siêu anh hùng)
Phong cách/hoạt hình-> khoảng 2 đến 5 đầu
Chibi / dễ thương -> khoảng 2 đầu (đầu to, thân nhỏ)
</code></pre>
<h3>Dựng hình trước (Loomis)</h3>
<p>Trước khi thêm chi tiết, dựng cơ thể từ khối 3D đơn giản — cầu, trụ, hộp. Phương pháp Loomis bắt đầu bằng <strong>đầu dạng cầu-mặt phẳng</strong> và bộ khung gesture, để cơ thể xoay hợp lý trong không gian. Chi tiết đặt lên trên khối dựng vững, không thay cho nó.</p>
<h3>Phong cách hoá = cường điệu có chủ đích</h3>
<p>Phong cách hoá không phải "vẽ sai giải phẫu" — mà là <em>cường điệu sự thật</em>. Đầu to đọc là trẻ hoặc dễ thương; tay chân dài đọc là thanh thoát; phần thân dưới nặng đọc là vững và mạnh. Phải biết giải phẫu thật mới bẻ cong nó thuyết phục được.</p>
<div class="callout"><span class="badge">Ví dụ nổi tiếng</span> Nhân vật Pixar vẫn giữ <strong>giải phẫu nền hợp lý</strong> dù phong cách hoá mạnh — Mr. Incredible là thân vuông khổng lồ trên đôi chân nhỏ, cường điệu nhưng vững cấu trúc, nên vẫn chuyển động như cơ thể thật.</div>`,
  ]]);

const c3q = quiz('anc302-quiz-3', 'Quiz 3 — Anatomy & proportion|||Quiz 3 — Giải phẫu & tỉ lệ', [
  { id: 'q1', question: 'Người lớn tả thực thường cao khoảng bao nhiêu "đầu"?', options: ['2 đầu', '4 đầu', '7,5 đến 8 đầu', '12 đầu'], correctIndex: 2, explanation: 'Tỉ lệ tả thực chuẩn khoảng 7,5–8 đầu; chibi ~2 đầu.' },
  { id: 'q2', question: 'Theo phương pháp Loomis, nên làm gì TRƯỚC khi thêm chi tiết?', options: ['Tô màu ngay', 'Dựng hình từ khối 3D đơn giản (cầu, trụ, hộp)', 'Vẽ trang phục', 'Viết backstory'], correctIndex: 1, explanation: 'Dựng khối vững trước; chi tiết đặt lên trên, không thay cho nó.' },
  { id: 'q3', question: 'Phong cách hoá (stylization) đúng nghĩa là?', options: ['Vẽ sai giải phẫu cho vui', 'Cường điệu sự thật một cách có chủ đích', 'Chỉ dùng ở chibi', 'Bỏ hẳn giải phẫu'], correctIndex: 1, explanation: 'Phải biết giải phẫu thật mới cường điệu (đầu to, chân dài...) thuyết phục.' },
]);

const c4 = doc('anc302-4-1-expression-pose', '4.1 — Expression, gesture & pose|||4.1 — Biểu cảm, gesture & tư thế',
  'Line of action; gesture drawing bắt chuyển động và năng lượng; biểu cảm khuôn mặt; tư thế kể tính cách; "Force" của Mattesi.',
  [[
    `<span class="eyebrow">ANC302 · Chapter 4 · Lesson 4.1</span>
<h2>Expression, gesture &amp; pose</h2>
<h3>Line of action</h3>
<p>Every strong pose has one <strong>line of action</strong> — a single sweeping curve (often a C or S) that carries the energy of the whole body. Build the pose on that line first; a clear line of action reads instantly and never looks stiff.</p>
<h3>Gesture over stiffness</h3>
<p>Gesture drawing captures <em>movement and intent</em> in seconds, not anatomy detail. Michael Mattesi's <strong>Force</strong> idea: draw the <em>direction of energy</em> flowing through the figure. A pose that only stands there is dead; a pose with force feels alive and about to move.</p>
<h3>Expression</h3>
<p>The face shows emotion through eyebrows, eyes and mouth working together. Push expressions further than reality — animation lives on <strong>clear, exaggerated</strong> emotion that reads across a room.</p>
<pre><code>Weak pose  -> standing straight, symmetrical, no line
Strong pose-> one line of action, weight on one leg,
              silhouette open, clear emotion on the face
</code></pre>
<div class="callout"><span class="badge">Show, don't stand</span> A hero doesn't just "stand" — chest up, chin forward, a strong S-curve says confident. Slump the same body over a C-curve and the exact character now reads as defeated.</div>`,
    `<span class="eyebrow">ANC302 · Chương 4 · Bài 4.1</span>
<h2>Biểu cảm, gesture &amp; tư thế</h2>
<h3>Line of action</h3>
<p>Mọi tư thế mạnh đều có một <strong>line of action</strong> — một đường cong quét (thường là chữ C hoặc S) mang năng lượng của toàn thân. Dựng tư thế trên đường đó trước; line of action rõ thì đọc được ngay và không bao giờ bị cứng.</p>
<h3>Gesture thắng cứng đờ</h3>
<p>Gesture drawing bắt <em>chuyển động và ý đồ</em> trong vài giây, không phải chi tiết giải phẫu. Ý tưởng <strong>Force</strong> của Michael Mattesi: vẽ <em>hướng năng lượng</em> chảy qua nhân vật. Tư thế chỉ đứng đó là chết; tư thế có force thì như đang sống và sắp chuyển động.</p>
<h3>Biểu cảm</h3>
<p>Gương mặt thể hiện cảm xúc qua lông mày, mắt và miệng phối hợp. Đẩy biểu cảm xa hơn thực tế — hoạt hình sống nhờ cảm xúc <strong>rõ, cường điệu</strong>, đọc được từ cuối phòng.</p>
<pre><code>Tư thế yếu  -> đứng thẳng, đối xứng, không có đường
Tư thế mạnh -> một line of action, dồn trọng lượng một chân,
               silhouette mở, cảm xúc rõ trên mặt
</code></pre>
<div class="callout"><span class="badge">Diễn, đừng đứng</span> Anh hùng không chỉ "đứng" — ưỡn ngực, đưa cằm tới, một đường cong S mạnh nói lên sự tự tin. Gập chính thân đó theo đường C thì đúng nhân vật ấy lại đọc thành bại trận.</div>`,
  ]]);

const c4q = quiz('anc302-quiz-4', 'Quiz 4 — Expression & pose|||Quiz 4 — Biểu cảm & tư thế', [
  { id: 'q1', question: '"Line of action" là gì?', options: ['Đường viền ngoài của nhân vật', 'Một đường cong chủ đạo mang năng lượng của cả tư thế', 'Đường phân chia sáng-tối', 'Trục đo tỉ lệ đầu'], correctIndex: 1, explanation: 'Line of action là đường cong (C/S) mang năng lượng toàn thân — dựng tư thế trên nó.' },
  { id: 'q2', question: 'Ý tưởng "Force" của Michael Mattesi nhấn mạnh điều gì?', options: ['Chi tiết giải phẫu tối đa', 'Vẽ hướng năng lượng chảy qua nhân vật', 'Chỉ vẽ khuôn mặt', 'Đối xứng hoàn hảo'], correctIndex: 1, explanation: 'Force = vẽ hướng năng lượng, làm tư thế sống động thay vì cứng đờ.' },
  { id: 'q3', question: 'Để biểu cảm đọc được trong hoạt hình, nên?', options: ['Giữ đúng như đời thật', 'Đẩy cường điệu để rõ ràng, đọc được từ xa', 'Chỉ dùng đôi mắt', 'Giữ mặt trung tính'], correctIndex: 1, explanation: 'Hoạt hình sống nhờ biểu cảm rõ, cường điệu — lông mày, mắt, miệng phối hợp.' },
]);

const c5 = doc('anc302-5-1-personality-story', '5.1 — Personality, story & appeal|||5.1 — Tính cách, câu chuyện & sức hút',
  'Tính cách và backstory định hình thiết kế; appeal là gì; archetype (anh hùng, cố vấn, kẻ lừa, phản diện); mọi chi tiết nên kể một điều.',
  [[
    `<span class="eyebrow">ANC302 · Chapter 5 · Lesson 5.1</span>
<h2>Personality, story &amp; appeal</h2>
<h3>Design from personality</h3>
<p>Great characters are designed from the <strong>inside out</strong>. Decide who they are — their history, wants, fears — and let that drive every visual choice. A nervous character might hunch and clutch; a proud one takes up space. The <em>backstory</em> shows up in worn boots, a scar, a lucky charm.</p>
<h3>Appeal</h3>
<p><strong>Appeal</strong> is not "prettiness" — it is the quality that makes a character interesting to look at: clear shapes, good contrast, a bit of asymmetry, and a design you enjoy returning to. Even a hideous monster or a villain can have strong appeal.</p>
<h3>Archetypes</h3>
<pre><code>Hero    -> upright, open, warm colors, strong line of action
Mentor  -> older proportions, calm, robes/beard, cool tones
Trickster-> asymmetry, sharp accents, restless pose
Villain -> triangles, height or looming mass, dark palette
</code></pre>
<p>Archetypes are a <em>starting point</em>, not a cage — the best designs play against expectation (a cute-looking villain, a scruffy hero).</p>
<div class="callout"><span class="badge">Famous example</span> <strong>Woody vs. Buzz</strong> in Toy Story: Woody is soft, floppy, vertical lines (old-fashioned, insecure); Buzz is chunky, rounded, hard shapes (confident, modern). The design states their personalities before they act.</div>`,
    `<span class="eyebrow">ANC302 · Chương 5 · Bài 5.1</span>
<h2>Tính cách, câu chuyện &amp; sức hút</h2>
<h3>Thiết kế từ tính cách</h3>
<p>Nhân vật hay được thiết kế từ <strong>trong ra ngoài</strong>. Quyết định họ là ai — quá khứ, mong muốn, nỗi sợ — rồi để điều đó dẫn dắt mọi lựa chọn hình ảnh. Người hồi hộp có thể co ro và nắm chặt tay; người kiêu hãnh chiếm không gian. <em>Backstory</em> hiện ra ở đôi giày mòn, vết sẹo, lá bùa may mắn.</p>
<h3>Sức hút (appeal)</h3>
<p><strong>Appeal</strong> không phải "xinh đẹp" — mà là phẩm chất khiến nhân vật thú vị để nhìn: hình rõ, tương phản tốt, một chút bất đối xứng, và một thiết kế ta thích ngắm lại. Ngay cả quái vật xấu xí hay kẻ phản diện cũng có thể có appeal mạnh.</p>
<h3>Archetype (nguyên mẫu)</h3>
<pre><code>Anh hùng -> đứng thẳng, mở, màu ấm, line of action mạnh
Cố vấn   -> tỉ lệ già hơn, điềm tĩnh, áo choàng/râu, tông lạnh
Kẻ lừa   -> bất đối xứng, điểm nhấn sắc, tư thế không yên
Phản diện-> tam giác, cao hoặc khối đè, bảng màu tối
</code></pre>
<p>Archetype là <em>điểm khởi đầu</em>, không phải cái lồng — thiết kế hay thường chơi ngược kỳ vọng (phản diện trông dễ thương, anh hùng lôi thôi).</p>
<div class="callout"><span class="badge">Ví dụ nổi tiếng</span> <strong>Woody và Buzz</strong> trong Toy Story: Woody mềm, lỏng, nhiều nét dọc (cổ điển, bất an); Buzz chắc, tròn, hình cứng (tự tin, hiện đại). Thiết kế nói lên tính cách trước cả khi họ hành động.</div>`,
  ]]);

const c5q = quiz('anc302-quiz-5', 'Quiz 5 — Personality & appeal|||Quiz 5 — Tính cách & sức hút', [
  { id: 'q1', question: 'Thiết kế nhân vật "từ trong ra ngoài" nghĩa là?', options: ['Vẽ nội tạng trước', 'Bắt đầu từ tính cách/backstory rồi để nó dẫn dắt hình ảnh', 'Vẽ từ tâm ra ngoài', 'Tô màu trước, vẽ sau'], correctIndex: 1, explanation: 'Tính cách, quá khứ, mong muốn, nỗi sợ dẫn dắt mọi lựa chọn hình ảnh.' },
  { id: 'q2', question: '"Appeal" trong thiết kế nhân vật là?', options: ['Chỉ là sự xinh đẹp', 'Phẩm chất khiến nhân vật thú vị để nhìn (hình rõ, tương phản, hơi bất đối xứng)', 'Số lượng chi tiết', 'Độ chính xác giải phẫu'], correctIndex: 1, explanation: 'Appeal khác đẹp; cả quái vật/phản diện cũng có thể có appeal mạnh.' },
  { id: 'q3', question: 'Về Woody và Buzz (Toy Story), điều gì ĐÚNG?', options: ['Cả hai dùng cùng ngôn ngữ hình', 'Woody mềm/nét dọc (bất an), Buzz chắc/tròn/cứng (tự tin)', 'Buzz mềm và lỏng hơn Woody', 'Thiết kế không liên quan tính cách'], correctIndex: 1, explanation: 'Hình khối tương phản nói lên tính cách trước khi họ hành động.' },
]);

const c6 = doc('anc302-6-1-costume-props-color', '6.1 — Costume, props & color|||6.1 — Trang phục, phụ kiện & màu',
  'Trang phục kể nghề nghiệp/thời đại/địa vị; props và chi tiết nhận diện; lý thuyết màu và bảng màu nhân vật; giữ silhouette sạch.',
  [[
    `<span class="eyebrow">ANC302 · Chapter 6 · Lesson 6.1</span>
<h2>Costume, props &amp; color</h2>
<h3>Costume tells the story</h3>
<p>Clothing communicates <strong>job, era, class, culture and personality</strong> at a glance. A patched coat says poor and resourceful; polished armor says wealth and discipline. Design the costume to support the silhouette, not fight it — clothes should follow the body's shape language.</p>
<h3>Props &amp; signature details</h3>
<p>A single memorable <strong>prop</strong> or detail becomes shorthand for the character: a hat, a weapon, a pet, a color. These <em>signature details</em> make a character instantly identifiable in merchandise, thumbnails and silhouettes.</p>
<h3>Color</h3>
<ul>
<li><strong>Value first</strong> — get the light/dark reading right before color; a design must work in grayscale.</li>
<li><strong>Limited palette</strong> — a few colors with one dominant, one secondary, and a small accent (often complementary) for the eye to land on.</li>
<li><strong>Color = meaning</strong> — warm reds/oranges feel energetic or dangerous; cool blues feel calm or cold; green can read as nature or as sickness/villainy.</li>
</ul>
<pre><code>Mickey  -> red shorts, yellow shoes, white gloves (3-color signature)
Mario   -> red cap &amp; blue overalls + M logo (instant read)
</code></pre>
<div class="callout"><span class="badge">Accent on purpose</span> Keep most of the character in a calm palette, then place ONE saturated accent where you want the eye to go — a red scarf, a glowing weapon. Too many accents and nothing stands out.</div>`,
    `<span class="eyebrow">ANC302 · Chương 6 · Bài 6.1</span>
<h2>Trang phục, phụ kiện &amp; màu</h2>
<h3>Trang phục kể chuyện</h3>
<p>Quần áo truyền đạt <strong>nghề nghiệp, thời đại, tầng lớp, văn hoá và tính cách</strong> trong một cái nhìn. Áo vá nói nghèo và tháo vát; giáp bóng loáng nói giàu có và kỷ luật. Thiết kế trang phục để nâng đỡ silhouette, không chống lại nó — quần áo nên theo ngôn ngữ hình của cơ thể.</p>
<h3>Phụ kiện &amp; chi tiết nhận diện</h3>
<p>Một <strong>props</strong> hoặc chi tiết đáng nhớ trở thành ký hiệu tắt cho nhân vật: chiếc mũ, vũ khí, thú cưng, một màu. Những <em>chi tiết nhận diện</em> này giúp nhân vật nhận ra ngay trên hàng hoá, thumbnail và silhouette.</p>
<h3>Màu sắc</h3>
<ul>
<li><strong>Value trước</strong> — chỉnh đúng sáng/tối trước khi tô màu; thiết kế phải hoạt động ở thang xám.</li>
<li><strong>Bảng màu hạn chế</strong> — vài màu với một màu chủ đạo, một màu phụ, và một điểm nhấn nhỏ (thường bổ túc) để mắt dừng lại.</li>
<li><strong>Màu = ý nghĩa</strong> — đỏ/cam ấm gợi năng lượng hoặc nguy hiểm; xanh dương lạnh gợi bình tĩnh hoặc lạnh lẽo; xanh lá có thể là thiên nhiên hoặc bệnh tật/gian ác.</li>
</ul>
<pre><code>Mickey  -> quần đỏ, giày vàng, găng trắng (3 màu nhận diện)
Mario   -> mũ đỏ &amp; yếm xanh + logo M (đọc ra ngay)
</code></pre>
<div class="callout"><span class="badge">Điểm nhấn có chủ đích</span> Giữ phần lớn nhân vật ở bảng màu êm, rồi đặt MỘT điểm nhấn bão hoà ở nơi bạn muốn mắt tới — khăn đỏ, vũ khí phát sáng. Quá nhiều điểm nhấn thì chẳng gì nổi bật.</div>`,
  ]]);

const c6q = quiz('anc302-quiz-6', 'Quiz 6 — Costume, props & color|||Quiz 6 — Trang phục, phụ kiện & màu', [
  { id: 'q1', question: 'Trước khi tô màu, nên chỉnh đúng điều gì trước?', options: ['Số lượng phụ kiện', 'Value (sáng/tối) — thiết kế phải hoạt động ở thang xám', 'Tên nhân vật', 'Độ phân giải file'], correctIndex: 1, explanation: 'Value trước: nếu ở grayscale không đọc được thì màu cũng không cứu được.' },
  { id: 'q2', question: 'Vai trò của "chi tiết nhận diện" (signature detail) là?', options: ['Làm rối silhouette', 'Trở thành ký hiệu tắt giúp nhận ra nhân vật ngay', 'Chỉ để trang trí, vô nghĩa', 'Tăng số màu bắt buộc'], correctIndex: 1, explanation: 'Mũ, vũ khí, một màu... giúp nhận diện trên thumbnail, hàng hoá, silhouette.' },
  { id: 'q3', question: 'Cách dùng điểm nhấn màu (accent) hiệu quả là?', options: ['Rải màu bão hoà khắp nơi', 'Giữ bảng màu êm và đặt MỘT điểm nhấn nơi muốn mắt tới', 'Không dùng màu bổ túc', 'Dùng càng nhiều màu càng tốt'], correctIndex: 1, explanation: 'Nhiều điểm nhấn thì chẳng gì nổi bật; một accent dẫn hướng mắt.' },
]);

const c7 = doc('anc302-7-1-turnaround-model-sheet', '7.1 — Turnaround & model sheet|||7.1 — Turnaround & bảng mẫu nhân vật (model sheet)',
  'Character turnaround (trước/nghiêng/lưng/3-4); expression sheet; pose sheet; call-outs chi tiết; chuẩn giao cho production.',
  [[
    `<span class="eyebrow">ANC302 · Chapter 7 · Lesson 7.1</span>
<h2>Turnaround &amp; model sheet</h2>
<h3>What a model sheet is</h3>
<p>A <strong>model sheet</strong> is the official reference that lets a whole team draw or model the <em>same</em> character consistently. It removes guesswork so animators, modelers and other artists stay on-model.</p>
<h3>The turnaround</h3>
<p>A <strong>turnaround</strong> shows the character from key angles — usually <strong>front, side (profile), back, and 3/4</strong> — aligned to shared horizontal guide lines so every feature lines up at the same height across views.</p>
<pre><code>Model sheet typically contains:
  - Turnaround (front / 3-4 / side / back)
  - Height/proportion guide lines (eyes, chin, waist, knees)
  - Expression sheet (happy, angry, sad, surprised...)
  - A few key poses / action
  - Color callouts + hex/paint values
  - Detail close-ups (hands, props, patterns)
</code></pre>
<h3>Consistency is the goal</h3>
<p>The design must hold up from every angle. Common errors: proportions that drift between views, details that appear on the front but vanish on the back, or shapes that only work from one angle. Keep guide lines and volumes consistent.</p>
<div class="callout"><span class="badge">Production standard</span> An <strong>expression sheet</strong> proves the face can act across a range of emotions while staying recognizably the same character — this is what a studio actually reviews before approving a design.</div>`,
    `<span class="eyebrow">ANC302 · Chương 7 · Bài 7.1</span>
<h2>Turnaround &amp; model sheet</h2>
<h3>Model sheet là gì</h3>
<p>Một <strong>model sheet</strong> là bản tham chiếu chính thức để cả nhóm vẽ hoặc dựng <em>cùng</em> một nhân vật nhất quán. Nó loại bỏ việc đoán mò, giúp animator, modeler và các hoạ sĩ khác giữ đúng "on-model".</p>
<h3>Turnaround</h3>
<p>Một <strong>turnaround</strong> thể hiện nhân vật từ các góc chính — thường là <strong>trước, nghiêng (profile), lưng, và 3/4</strong> — canh theo các đường dẫn ngang chung để mọi bộ phận thẳng hàng cùng chiều cao qua các góc.</p>
<pre><code>Model sheet thường gồm:
  - Turnaround (trước / 3-4 / nghiêng / lưng)
  - Đường dẫn tỉ lệ/chiều cao (mắt, cằm, eo, gối)
  - Expression sheet (vui, giận, buồn, ngạc nhiên...)
  - Vài tư thế/hành động chính
  - Chú thích màu + mã hex/màu vẽ
  - Cận cảnh chi tiết (bàn tay, props, hoạ tiết)
</code></pre>
<h3>Nhất quán là mục tiêu</h3>
<p>Thiết kế phải đứng vững từ mọi góc. Lỗi thường gặp: tỉ lệ trôi giữa các góc, chi tiết có ở mặt trước mà biến mất ở lưng, hoặc hình chỉ hoạt động từ một góc. Giữ đường dẫn và khối nhất quán.</p>
<div class="callout"><span class="badge">Chuẩn production</span> Một <strong>expression sheet</strong> chứng minh gương mặt diễn được nhiều cảm xúc mà vẫn nhận ra là cùng một nhân vật — đây chính là thứ studio duyệt trước khi chốt thiết kế.</div>`,
  ]]);

const c7q = quiz('anc302-quiz-7', 'Quiz 7 — Turnaround & model sheet|||Quiz 7 — Turnaround & bảng mẫu', [
  { id: 'q1', question: 'Mục đích chính của model sheet là?', options: ['Khoe kỹ năng vẽ', 'Để cả nhóm vẽ/dựng cùng một nhân vật nhất quán (on-model)', 'Thay cho brief', 'Chỉ để in poster'], correctIndex: 1, explanation: 'Model sheet là tham chiếu chính thức giúp cả team giữ đúng on-model.' },
  { id: 'q2', question: 'Một turnaround tiêu chuẩn thường gồm các góc nào?', options: ['Chỉ mặt trước', 'Trước, nghiêng, lưng, và 3/4', 'Chỉ 3/4 và lưng', 'Trước và... hết'], correctIndex: 1, explanation: 'Trước / nghiêng / lưng / 3-4, canh theo đường dẫn ngang chung.' },
  { id: 'q3', question: 'Expression sheet dùng để chứng minh điều gì?', options: ['Nhân vật có nhiều bộ trang phục', 'Gương mặt diễn được nhiều cảm xúc mà vẫn là cùng một nhân vật', 'Bảng màu đủ 12 màu', 'Nhân vật cao đúng 8 đầu'], correctIndex: 1, explanation: 'Studio duyệt expression sheet để chắc mặt diễn được mà vẫn nhận ra nhân vật.' },
]);

const c8 = doc('anc302-8-1-complete-character-project', '8.1 — Complete character project|||8.1 — Dự án nhân vật hoàn chỉnh',
  'Đi trọn quy trình: concept → sketch → refine → final → model sheet; tự phê bình; dựng portfolio và trình bày nhân vật.',
  [[
    `<span class="eyebrow">ANC302 · Chapter 8 · Lesson 8.1</span>
<h2>Complete character project</h2>
<h3>The full pipeline, end to end</h3>
<pre><code>1. Brief      -> write who/where/why/style (1 short paragraph)
2. Research   -> mood board + reference (PureRef/Pinterest)
3. Thumbnails -> 10+ silhouettes, pick the strongest shape
4. Sketch     -> construct chosen design (Loomis volumes)
5. Refine     -> proportion, costume, props, signature detail
6. Value      -> check the grayscale reading
7. Color      -> limited palette + one accent
8. Model sheet-> turnaround + expressions + callouts
9. Present    -> a clean portfolio page with a short blurb
</code></pre>
<h3>Self-critique checklist</h3>
<ul>
<li>Does the <strong>silhouette</strong> read who this is?</li>
<li>Is there a clear <strong>dominant shape</strong> and personality?</li>
<li>Does it hold up in <strong>grayscale</strong> and from every angle?</li>
<li>Is the <strong>appeal</strong> there — would you want to see more of this character?</li>
</ul>
<h3>Portfolio &amp; presentation</h3>
<p>Recruiters look for <strong>range and clarity</strong>: show your thinking (thumbnails, exploration), not just the final render. Present each character with a one-line concept, the turnaround, and a couple of expressions. A tight, curated set beats a large messy one.</p>
<div class="callout"><span class="badge">Ship it</span> A finished, on-model character with a clean sheet and a clear story beats a hundred beautiful-but-unfinished sketches. The industry hires people who can take a design all the way to production.</div>`,
    `<span class="eyebrow">ANC302 · Chương 8 · Bài 8.1</span>
<h2>Dự án nhân vật hoàn chỉnh</h2>
<h3>Trọn quy trình, từ đầu đến cuối</h3>
<pre><code>1. Brief      -> viết là ai/ở đâu/vì sao/phong cách (1 đoạn ngắn)
2. Nghiên cứu -> mood board + reference (PureRef/Pinterest)
3. Thumbnail  -> 10+ silhouette, chọn hình mạnh nhất
4. Sketch     -> dựng thiết kế đã chọn (khối Loomis)
5. Tinh chỉnh -> tỉ lệ, trang phục, props, chi tiết nhận diện
6. Value      -> kiểm cách đọc ở thang xám
7. Màu        -> bảng màu hạn chế + một điểm nhấn
8. Model sheet-> turnaround + biểu cảm + chú thích
9. Trình bày  -> một trang portfolio sạch kèm mô tả ngắn
</code></pre>
<h3>Danh sách tự phê bình</h3>
<ul>
<li><strong>Silhouette</strong> có đọc ra đây là ai không?</li>
<li>Có <strong>hình chủ đạo</strong> và tính cách rõ ràng không?</li>
<li>Có đứng vững ở <strong>thang xám</strong> và từ mọi góc không?</li>
<li>Có <strong>appeal</strong> không — bạn có muốn xem thêm về nhân vật này?</li>
</ul>
<h3>Portfolio &amp; trình bày</h3>
<p>Nhà tuyển dụng tìm <strong>độ đa dạng và sự rõ ràng</strong>: cho thấy tư duy của bạn (thumbnail, khám phá), không chỉ bản render cuối. Trình bày mỗi nhân vật với một dòng concept, turnaround, và vài biểu cảm. Một bộ gọn, chọn lọc thắng một bộ lớn lộn xộn.</p>
<div class="callout"><span class="badge">Hoàn thành đi</span> Một nhân vật xong, đúng on-model, có sheet sạch và câu chuyện rõ thắng cả trăm sketch đẹp nhưng dang dở. Ngành nghề tuyển người đưa được thiết kế đi trọn tới production.</div>`,
  ]]);

const c8q = quiz('anc302-quiz-8', 'Quiz 8 — Complete character project|||Quiz 8 — Dự án nhân vật hoàn chỉnh', [
  { id: 'q1', question: 'Trong quy trình đầy đủ, bước "thumbnails" nhằm mục đích gì?', options: ['Tô màu final nhanh', 'Vẽ 10+ silhouette để chọn hình mạnh nhất', 'Viết brief', 'Dựng model sheet'], correctIndex: 1, explanation: 'Thumbnail khám phá nhiều silhouette/hình khối trước khi chọn cái mạnh nhất.' },
  { id: 'q2', question: 'Câu hỏi tự phê bình nào KHÔNG thuộc checklist ở bài?', options: ['Silhouette có đọc ra đây là ai không?', 'Có đứng vững ở grayscale và mọi góc không?', 'File có nặng hơn 1GB không?', 'Có appeal không — muốn xem thêm không?'], correctIndex: 2, explanation: 'Checklist xoay quanh silhouette, hình chủ đạo, grayscale/góc, và appeal.' },
  { id: 'q3', question: 'Về portfolio, lời khuyên đúng là?', options: ['Chỉ khoe bản render cuối, giấu quá trình', 'Cho thấy tư duy (thumbnail, khám phá) và giữ bộ gọn, chọn lọc', 'Càng nhiều hình càng tốt, không cần chọn lọc', 'Không cần model sheet'], correctIndex: 1, explanation: 'Nhà tuyển dụng tìm độ đa dạng và rõ ràng; bộ gọn chọn lọc thắng bộ lộn xộn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'ANC302',
    slug: 'anc302-character-design',
    title: 'Character Design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANC302.webp',
    shortDescription: 'Design characters for film, games & animation — brief to model sheet: shape language, anatomy & stylized proportion, expression & pose, personality & appeal, costume & color, turnarounds. Bilingual, famous examples (Mickey, Pixar) & quizzes.|||Thiết kế nhân vật cho phim, game & hoạt hình — brief tới model sheet: ngôn ngữ hình, giải phẫu & tỉ lệ, biểu cảm & tư thế, tính cách & sức hút, trang phục & màu, turnaround. Song ngữ, ví dụ nổi tiếng (Mickey, Pixar) & quiz.',
    description: 'Môn <strong>ANC302 — Character Design (Thiết kế nhân vật)</strong> thuộc ngành Thiết kế mỹ thuật số (kỳ 4), dạy bạn <strong>thiết kế nhân vật có chủ đích</strong> cho phim, game và hoạt hình. Từ <strong>khái niệm &amp; brief</strong> → <strong>ngôn ngữ hình &amp; silhouette</strong> → <strong>giải phẫu &amp; tỉ lệ</strong> (Loomis) → <strong>biểu cảm, gesture &amp; tư thế</strong> (Force của Mattesi) → <strong>tính cách, câu chuyện &amp; appeal</strong> → <strong>trang phục, phụ kiện &amp; màu</strong> → <strong>turnaround &amp; model sheet</strong> → một <strong>dự án nhân vật hoàn chỉnh</strong>. Bám giáo trình chuẩn quốc tế (Silver, Mattesi, Loomis, Disney/Pixar), song ngữ, ví dụ nhân vật nổi tiếng và quiz mỗi chương.',
    whatYouLearn: 'Vai trò nhân vật &amp; quy trình concept; ngôn ngữ hình (tròn/vuông/tam giác) &amp; phép thử silhouette; giải phẫu &amp; tỉ lệ theo số đầu, dựng khối Loomis, phong cách hoá; line of action, gesture &amp; biểu cảm (Force); tính cách, backstory, appeal &amp; archetype; trang phục, props, chi tiết nhận diện &amp; lý thuyết màu (value, bảng màu hạn chế, accent); turnaround, expression sheet &amp; model sheet chuẩn production; đi trọn dự án từ concept đến portfolio.',
    requirements: 'Biết vẽ cơ bản (nét, hình khối) và một phần mềm vẽ số bất kỳ (Krita/Clip Studio/Photoshop). Không cần kinh nghiệm thiết kế nhân vật trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Silver/Mattesi/Loomis), khoá online, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thiết kế nhân vật là gì, bốn trụ cột, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Thiết kế nhân vật là gì|||Chapter 1 — What is character design', description: 'Vai trò, quy trình, brief.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngôn ngữ hình & silhouette|||Chapter 2 — Shape language', description: 'Tròn/vuông/tam giác, silhouette.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giải phẫu & tỉ lệ|||Chapter 3 — Anatomy & proportion', description: 'Số đầu, Loomis, phong cách hoá.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Biểu cảm & tư thế|||Chapter 4 — Expression & pose', description: 'Line of action, gesture, Force.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tính cách & câu chuyện|||Chapter 5 — Personality & story', description: 'Backstory, appeal, archetype.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Trang phục, phụ kiện & màu|||Chapter 6 — Costume, props & color', description: 'Trang phục, props, màu, nhận diện.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Turnaround & model sheet|||Chapter 7 — Turnaround & model sheet', description: 'Turnaround, expression sheet, production.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dự án nhân vật hoàn chỉnh|||Chapter 8 — Complete character project', description: 'Concept→final→model sheet, portfolio.', lessons: [c8, c8q] },
  ],
};
