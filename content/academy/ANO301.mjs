/**
 * ANO301 — Visual Development for Digital Design (concept art). Ngành Thiết kế
 * mỹ thuật số FPTU, kỳ 7. Khung 8 chương: từ "visdev là gì" → nghiên cứu &
 * moodboard → bối cảnh → đạo cụ/phương tiện → màu & ánh sáng → phối cảnh →
 * quy trình digital & matte painting → xây thế giới & portfolio. Song ngữ +
 * ví dụ phim/game thật (Pixar, Disney, AAA). Nguồn chuẩn: Gurney "Color and
 * Light", Mateu-Mestre "Framed Perspective", "The Skillful Huntsman",
 * ArtStation Learning / Schoolism.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ano301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn ngành concept art, học liệu miễn phí, ArtStation/Schoolism, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ANO301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>visual development</strong> for film, TV and games — research, environment &amp; prop design, color scripts, perspective and digital matte painting — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the canonical books and free, legal resources every visdev artist uses.</p>
<h3>📘 Core books</h3>
<ul>
<li><a href="https://jamesgurney.com/products/color-and-light-a-guide-for-the-realist-painter" target="_blank" rel="noopener">James Gurney — <em>Color and Light</em></a>: the reference on how light behaves and how to paint mood.</li>
<li><a href="https://www.mmmestre.com/" target="_blank" rel="noopener">Marcos Mateu-Mestre — <em>Framed Perspective</em> (vol. 1 &amp; 2)</a>: perspective and staging for storytelling images.</li>
<li><a href="https://www.designstudiopress.com/" target="_blank" rel="noopener"><em>The Skillful Huntsman</em> (Design Studio Press)</a>: a full visual-development pipeline from one short story brief.</li>
</ul>
<h3>🌐 Learning platforms</h3>
<ul>
<li><a href="https://www.artstation.com/learning" target="_blank" rel="noopener">ArtStation Learning</a> — courses by working film/game artists, plus the industry portfolio standard.</li>
<li><a href="https://www.schoolism.com/" target="_blank" rel="noopener">Schoolism</a> — color, light and visual development classes.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@trentkaniuga2955" target="_blank" rel="noopener">Trent Kaniuga</a> — environment &amp; concept workflow.</li>
<li><a href="https://www.youtube.com/@FZDSCHOOL" target="_blank" rel="noopener">FZD School (Feng Zhu)</a> — industrial design &amp; entertainment design lectures.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><strong>Adobe Photoshop</strong> / <strong>Procreate</strong> — painting &amp; photobashing.</li>
<li><strong>Blender</strong> — 3D blockout &amp; kitbashing for concept.</li>
<li><a href="https://www.pureref.com/" target="_blank" rel="noopener">PureRef</a> — reference boards &amp; moodboards.</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>Foundation</strong> — drawing, values, perspective and color/light fundamentals (Gurney, Mateu-Mestre).</li>
<li><strong>Study &amp; copy</strong> — analyse film/game art, build moodboards, master-study your favourite frames.</li>
<li><strong>Design</strong> — take a brief and design environments, props and characters with thumbnails and variations.</li>
<li><strong>Portfolio</strong> — assemble a coherent visual-development package and publish it on ArtStation.</li>
</ol></div>`,
    `<span class="eyebrow">ANO301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>phát triển thị giác (visual development)</strong> cho phim, truyền hình và game — nghiên cứu, thiết kế bối cảnh &amp; đạo cụ, color script, phối cảnh và matte painting số — gom về một chỗ. Slide &amp; giáo trình chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn ngành và nguồn miễn phí, hợp pháp mà mọi visdev artist đều dùng.</p>
<h3>📘 Sách cốt lõi</h3>
<ul>
<li><a href="https://jamesgurney.com/products/color-and-light-a-guide-for-the-realist-painter" target="_blank" rel="noopener">James Gurney — <em>Color and Light</em></a>: sách gối đầu về cách ánh sáng ứng xử và cách vẽ mood.</li>
<li><a href="https://www.mmmestre.com/" target="_blank" rel="noopener">Marcos Mateu-Mestre — <em>Framed Perspective</em> (tập 1 &amp; 2)</a>: phối cảnh và dàn cảnh để kể chuyện bằng hình.</li>
<li><a href="https://www.designstudiopress.com/" target="_blank" rel="noopener"><em>The Skillful Huntsman</em> (Design Studio Press)</a>: một quy trình visdev trọn vẹn từ một mẩu truyện ngắn.</li>
</ul>
<h3>🌐 Nền tảng học</h3>
<ul>
<li><a href="https://www.artstation.com/learning" target="_blank" rel="noopener">ArtStation Learning</a> — khoá học từ nghệ sĩ phim/game đang làm nghề, kèm chuẩn portfolio của ngành.</li>
<li><a href="https://www.schoolism.com/" target="_blank" rel="noopener">Schoolism</a> — các lớp về màu, ánh sáng và phát triển thị giác.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@trentkaniuga2955" target="_blank" rel="noopener">Trent Kaniuga</a> — quy trình vẽ bối cảnh &amp; concept.</li>
<li><a href="https://www.youtube.com/@FZDSCHOOL" target="_blank" rel="noopener">FZD School (Feng Zhu)</a> — bài giảng thiết kế công nghiệp &amp; giải trí.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><strong>Adobe Photoshop</strong> / <strong>Procreate</strong> — vẽ &amp; photobashing.</li>
<li><strong>Blender</strong> — dựng khối 3D &amp; kitbashing cho concept.</li>
<li><a href="https://www.pureref.com/" target="_blank" rel="noopener">PureRef</a> — bảng tham chiếu &amp; moodboard.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Nền tảng</strong> — vẽ, sắc độ, phối cảnh và nền tảng màu/ánh sáng (Gurney, Mateu-Mestre).</li>
<li><strong>Nghiên cứu &amp; chép mẫu</strong> — phân tích art phim/game, dựng moodboard, master-study các khung hình yêu thích.</li>
<li><strong>Thiết kế</strong> — nhận một đề bài và thiết kế bối cảnh, đạo cụ, nhân vật bằng thumbnail và biến thể.</li>
<li><strong>Portfolio</strong> — gom một gói visual development mạch lạc và đăng lên ArtStation.</li>
</ol></div>`,
  ]]);

const intro = doc('ano301-0-1-overview', 'Course overview: Visual development|||Tổng quan: Phát triển thị giác',
  'Visual development làm gì; visdev vs illustration; lộ trình 8 chương: khái niệm → nghiên cứu → bối cảnh → đạo cụ → màu & ánh sáng → phối cảnh → digital/matte → thế giới & portfolio.',
  [[
    `<span class="eyebrow">ANO301 · Lesson 0.1 · Overview</span>
<h2>Visual Development for Digital Design</h2>
<p class="lead">This course teaches <strong>visual development (visdev)</strong> — the design phase that decides <em>how a film, series or game looks</em> before a single frame is animated or rendered. You will learn to turn a written brief into worlds, environments, props and a color language, working the way concept-art teams do at Pixar, Disney and AAA game studios.</p>
<h3>What visual development is</h3>
<p>Visdev is <strong>design, not illustration</strong>. An illustration is a finished picture; visdev is a <strong>package of designs</strong> — shapes, materials, colors and moods — that other departments (modeling, lighting, animation, level art) build from. Its job is to answer questions: what does this place feel like, what is this object made of, what colors carry the story.</p>
<h3>Roadmap (8 chapters)</h3>
<pre><code>1. What visual development is (role, pipeline)
2. Research &amp; moodboards (reference, visual language)
3. Environment &amp; world design (thumbnails, composition)
4. Prop &amp; vehicle design (form, function, detail)
5. Color &amp; light for concept (color script, mood)
6. Perspective &amp; space (depth, atmosphere)
7. Digital workflow &amp; matte painting (photobash, kitbash)
8. World-building &amp; portfolio (art bible, style guide)
</code></pre>
<div class="callout"><span class="badge">Design serves story</span> Every choice — a silhouette, a palette, a camera angle — should say something about the world or the moment. Pretty is not the goal; <strong>meaningful</strong> is.</div>`,
    `<span class="eyebrow">ANO301 · Bài 0.1 · Tổng quan</span>
<h2>Phát triển thị giác cho thiết kế số</h2>
<p class="lead">Môn này dạy <strong>phát triển thị giác (visual development, visdev)</strong> — giai đoạn thiết kế quyết định <em>một bộ phim, series hay game trông thế nào</em> trước khi có bất kỳ khung hình nào được làm hoạt hình hay render. Bạn học cách biến một đề bài chữ thành thế giới, bối cảnh, đạo cụ và một ngôn ngữ màu, làm việc như các nhóm concept art ở Pixar, Disney và các studio game AAA.</p>
<h3>Visual development là gì</h3>
<p>Visdev là <strong>thiết kế, không phải minh hoạ</strong>. Minh hoạ là một bức tranh hoàn thiện; visdev là <strong>một gói thiết kế</strong> — hình khối, vật liệu, màu sắc và tâm trạng — để các bộ phận khác (dựng mô hình, ánh sáng, hoạt hình, level art) dựa vào mà làm. Việc của nó là trả lời câu hỏi: nơi này cho cảm giác gì, vật này làm bằng gì, màu nào mang câu chuyện.</p>
<h3>Lộ trình (8 chương)</h3>
<pre><code>1. Visdev là gì (vai trò, quy trình)
2. Nghiên cứu &amp; moodboard (reference, ngôn ngữ thị giác)
3. Thiết kế bối cảnh &amp; thế giới (thumbnail, bố cục)
4. Thiết kế đạo cụ &amp; phương tiện (form, chức năng, chi tiết)
5. Màu &amp; ánh sáng cho concept (color script, mood)
6. Phối cảnh &amp; không gian (chiều sâu, khí quyển)
7. Quy trình digital &amp; matte painting (photobash, kitbash)
8. Xây thế giới &amp; portfolio (art bible, style guide)
</code></pre>
<div class="callout"><span class="badge">Thiết kế phục vụ câu chuyện</span> Mỗi lựa chọn — một bóng dáng, một bảng màu, một góc máy — đều nên nói lên điều gì đó về thế giới hoặc khoảnh khắc. Đẹp không phải là đích; <strong>có nghĩa</strong> mới là.</div>`,
  ]]);

const c1 = doc('ano301-1-1-visdev-la-gi', '1.1 — What visual development is|||1.1 — Visual development là gì',
  'Vai trò của visdev trong phim/game/hoạt hình; concept art vs illustration; quy trình từ brief tới final design; ví dụ Pixar & AAA.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 1 · Lesson 1.1</span>
<h2>What visual development is</h2>
<h3>Where it sits in production</h3>
<p>In an animated film or game, visdev runs early — after the story/script and before modeling, lighting and animation. Concept artists explore the look; once designs are approved they become the blueprint the whole pipeline builds against. At <strong>Pixar</strong> the <em>art department</em> produces color scripts and character/environment designs before layout; on a <strong>AAA game</strong>, concept feeds the environment and character art teams that build the shipped assets.</p>
<h3>Concept art vs illustration</h3>
<ul>
<li><strong>Illustration</strong> — one finished, self-contained image. Success = the picture works.</li>
<li><strong>Concept art / visdev</strong> — exploratory design meant to be <em>built from</em>. Success = another artist can construct the world from it. Often rough, always clear about shape, material and function.</li>
</ul>
<h3>A typical brief-to-design flow</h3>
<pre><code>Brief / script  -> what &amp; why (the story need)
Research        -> gather real-world &amp; art reference
Thumbnails      -> many tiny rough options
Iteration       -> refine the strongest, add variations
Presentation    -> clean designs + callouts + orthographic views
Handoff         -> package for modeling / level art
</code></pre>
<div class="callout"><span class="badge">Example</span> Pixar's <em>WALL·E</em> and <em>Coco</em> shipped huge visdev packages — hundreds of environment and prop designs plus color scripts — long before final rendering. The look was <em>designed</em>, not discovered on set.</div>`,
    `<span class="eyebrow">ANO301 · Chương 1 · Bài 1.1</span>
<h2>Visual development là gì</h2>
<h3>Nó nằm ở đâu trong sản xuất</h3>
<p>Trong phim hoạt hình hay game, visdev chạy sớm — sau câu chuyện/kịch bản và trước dựng mô hình, ánh sáng, hoạt hình. Concept artist khai phá diện mạo; khi thiết kế được duyệt, chúng thành bản thiết kế để cả dây chuyền dựa vào. Ở <strong>Pixar</strong>, <em>art department</em> làm color script và thiết kế nhân vật/bối cảnh trước khâu layout; ở một <strong>game AAA</strong>, concept cấp cho các nhóm environment và character art dựng ra tài nguyên xuất xưởng.</p>
<h3>Concept art với illustration</h3>
<ul>
<li><strong>Minh hoạ (illustration)</strong> — một hình hoàn thiện, tự đứng một mình. Thành công = bức tranh hiệu quả.</li>
<li><strong>Concept art / visdev</strong> — thiết kế khai phá để người khác <em>dựng theo</em>. Thành công = một nghệ sĩ khác dựng được thế giới từ nó. Thường thô, nhưng luôn rõ về hình khối, vật liệu và chức năng.</li>
</ul>
<h3>Dòng chảy điển hình từ brief tới thiết kế</h3>
<pre><code>Brief / kịch bản -> cái gì &amp; vì sao (nhu cầu câu chuyện)
Nghiên cứu       -> thu reference thực tế &amp; art
Thumbnail        -> nhiều phương án nhỏ, thô
Lặp lại          -> tinh chỉnh cái mạnh nhất, thêm biến thể
Trình bày        -> thiết kế sạch + chú thích + hình chiếu
Bàn giao         -> đóng gói cho modeling / level art
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> <em>WALL·E</em> và <em>Coco</em> của Pixar xuất xưởng gói visdev khổng lồ — hàng trăm thiết kế bối cảnh và đạo cụ cùng color script — từ rất lâu trước khi render cuối. Diện mạo được <em>thiết kế</em>, không phải tình cờ tìm thấy.</div>`,
  ]]);

const c1q = quiz('ano301-quiz-1', 'Quiz 1 — What visdev is|||Quiz 1 — Visdev là gì', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa concept art (visdev) và illustration?|||Core difference between concept art (visdev) and illustration?', options: ['Concept art luôn màu, illustration luôn đen trắng|||Concept art is always color, illustration always B&W', 'Visdev là thiết kế để người khác DỰNG THEO; illustration là hình hoàn thiện tự đứng một mình|||Visdev is design meant to be BUILT FROM; illustration is a finished standalone image', 'Không có khác biệt|||There is no difference', 'Illustration chỉ dùng trong game|||Illustration is only for games'], correctIndex: 1, explanation: 'Visdev phục vụ dây chuyền dựng; illustration là bức tranh hoàn thiện.' },
  { id: 'q2', question: 'Trong quy trình phim/game, visdev nằm ở đâu?|||Where does visdev sit in the pipeline?', options: ['Sau khi render cuối cùng|||After final rendering', 'Sớm — sau kịch bản, trước dựng mô hình/ánh sáng/hoạt hình|||Early — after script, before modeling/lighting/animation', 'Chỉ khi phim đã chiếu|||Only after release', 'Song song với marketing|||Alongside marketing'], correctIndex: 1, explanation: 'Visdev là giai đoạn thiết kế sớm, tạo blueprint cho cả dây chuyền.' },
  { id: 'q3', question: 'Bước hợp lý ngay sau khi đọc brief để bắt đầu thiết kế là?|||The sensible step right after reading a brief is?', options: ['Vẽ luôn bản final chi tiết|||Jump straight to a detailed final', 'Nghiên cứu & thu reference, rồi phác nhiều thumbnail thô|||Research & gather reference, then sketch many rough thumbnails', 'Bàn giao cho modeling ngay|||Hand off to modeling immediately', 'Chọn bảng màu cuối cùng trước tiên|||Lock the final palette first'], correctIndex: 1, explanation: 'Research trước, rồi thumbnail nhiều phương án — chưa vội chi tiết.' },
]);

const c2 = doc('ano301-2-1-research-moodboard', '2.1 — Research & moodboards|||2.1 — Nghiên cứu & moodboard',
  'Research, reference, moodboard, ngôn ngữ thị giác (shape/màu/vật liệu), xác lập phong cách; công cụ PureRef; ví dụ Disney.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 2 · Lesson 2.1</span>
<h2>Research &amp; moodboards</h2>
<h3>Research first, invent second</h3>
<p>Believable design is built on real reference. Before designing a market, a spacesuit or a jungle, gather photos, architecture, textures, historical and cultural references. Research prevents generic, clichéd design and gives your world specificity — the small true details that make it feel real.</p>
<h3>Moodboards &amp; visual language</h3>
<p>A <strong>moodboard</strong> collects reference into one board to define the target look: palette, lighting, materials, level of stylization, silhouette language. It aligns the team on a <strong>visual language</strong> — a consistent vocabulary of shapes, colors and materials so everything in the world reads as one place.</p>
<ul>
<li><strong>Shape language</strong> — round vs angular; friendly vs threatening.</li>
<li><strong>Palette</strong> — the dominant colors and their meaning.</li>
<li><strong>Material &amp; texture</strong> — worn, clean, organic, industrial.</li>
<li><strong>Level of stylization</strong> — realistic, semi-stylized, cartoon.</li>
</ul>
<div class="callout"><span class="badge">Example</span> Disney sent artists on research trips: <em>Moana</em>'s team travelled the South Pacific, and <em>Encanto</em>'s went to Colombia. That reference drove authentic architecture, textiles and color — the specificity you feel on screen.</div>`,
    `<span class="eyebrow">ANO301 · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu &amp; moodboard</h2>
<h3>Nghiên cứu trước, sáng tạo sau</h3>
<p>Thiết kế đáng tin được dựng trên reference thật. Trước khi thiết kế một khu chợ, một bộ đồ phi hành gia hay một khu rừng, hãy thu ảnh, kiến trúc, chất liệu, tham chiếu lịch sử và văn hoá. Nghiên cứu ngăn thiết kế chung chung, sáo mòn, và cho thế giới của bạn sự đặc thù — những chi tiết nhỏ mà đúng khiến nó thật.</p>
<h3>Moodboard &amp; ngôn ngữ thị giác</h3>
<p>Một <strong>moodboard</strong> gom reference vào một bảng để định diện mạo đích: bảng màu, ánh sáng, vật liệu, mức cách điệu, ngôn ngữ bóng dáng. Nó đồng bộ cả nhóm về một <strong>ngôn ngữ thị giác</strong> — bộ từ vựng nhất quán về hình khối, màu và vật liệu để mọi thứ trong thế giới đọc ra như cùng một nơi.</p>
<ul>
<li><strong>Ngôn ngữ hình khối</strong> — tròn với góc cạnh; thân thiện với đe doạ.</li>
<li><strong>Bảng màu</strong> — các màu chủ đạo và ý nghĩa của chúng.</li>
<li><strong>Vật liệu &amp; chất liệu bề mặt</strong> — cũ mòn, sạch sẽ, hữu cơ, công nghiệp.</li>
<li><strong>Mức cách điệu</strong> — tả thực, bán cách điệu, hoạt hình.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Disney cho nghệ sĩ đi thực địa: nhóm <em>Moana</em> đi Nam Thái Bình Dương, nhóm <em>Encanto</em> sang Colombia. Reference đó dẫn tới kiến trúc, vải vóc và màu sắc chân thực — sự đặc thù mà bạn cảm được trên màn ảnh.</div>`,
  ]]);

const c2q = quiz('ano301-quiz-2', 'Quiz 2 — Research & moodboard|||Quiz 2 — Nghiên cứu & moodboard', [
  { id: 'q1', question: 'Mục đích chính của moodboard là?|||Main purpose of a moodboard?', options: ['Thay thế bản thiết kế cuối|||Replace the final design', 'Gom reference để định diện mạo đích & đồng bộ ngôn ngữ thị giác cho cả nhóm|||Collect reference to set the target look & align the team on a visual language', 'Chỉ để trang trí studio|||Just to decorate the studio', 'Tính chi phí sản xuất|||Compute production cost'], correctIndex: 1, explanation: 'Moodboard định palette/ánh sáng/vật liệu và thống nhất ngôn ngữ thị giác.' },
  { id: 'q2', question: 'Vì sao research quan trọng trước khi thiết kế?|||Why research before designing?', options: ['Để chép nguyên xi ảnh gốc|||To copy reference exactly', 'Để tránh thiết kế sáo mòn và cho thế giới sự đặc thù, chi tiết đáng tin|||To avoid clichéd design and give the world believable specificity', 'Vì bắt buộc phải nộp thư mục ảnh|||Because a photo folder is mandatory', 'Để render nhanh hơn|||To render faster'], correctIndex: 1, explanation: 'Reference thật tạo chi tiết đặc thù, tránh chung chung, sáo mòn.' },
  { id: 'q3', question: '"Ngôn ngữ hình khối" (shape language) nói về điều gì?|||"Shape language" refers to?', options: ['Ngôn ngữ lập trình vẽ hình|||A drawing programming language', 'Dùng hình tròn/góc cạnh nhất quán để truyền cảm giác (thân thiện/đe doạ)|||Consistent round/angular shapes conveying feeling (friendly/threatening)', 'Kích thước file ảnh|||Image file size', 'Số lớp trong Photoshop|||Number of Photoshop layers'], correctIndex: 1, explanation: 'Shape language dùng hình khối nhất quán để mang ý nghĩa cảm xúc.' },
]);

const c3 = doc('ano301-3-1-environment-design', '3.1 — Environment & world design|||3.1 — Thiết kế bối cảnh & thế giới',
  'Environment design, world-building qua bối cảnh, thumbnail nhanh, bố cục (rule of thirds, leading lines, focal point); ví dụ AAA.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 3 · Lesson 3.1</span>
<h2>Environment &amp; world design</h2>
<h3>Environments tell the world's story</h3>
<p>An environment is not just a backdrop — it is <strong>world-building through place</strong>. Architecture, wear, signage and clutter reveal who lives here, their technology, climate and history. Good environment design answers: who built this, how do they live, what happened here.</p>
<h3>Thumbnails &amp; composition</h3>
<p>Start with many small, fast <strong>thumbnails</strong> — value-only sketches that test big shapes and composition before any detail. Then design the composition deliberately:</p>
<ul>
<li><strong>Focal point</strong> — one clear place the eye goes first (via contrast, detail or convergence).</li>
<li><strong>Leading lines</strong> — roads, rivers, architecture guiding the eye to the focal point.</li>
<li><strong>Rule of thirds / big-medium-small</strong> — vary shape sizes and place key elements off-center.</li>
<li><strong>Silhouette &amp; value grouping</strong> — read the scene as 3-4 value shapes; if it works small and gray, it works.</li>
</ul>
<pre><code>Thumbnail loop:
  10-20 tiny value sketches (composition only)
  -> pick 2-3 strongest
  -> refine value + basic color
  -> add detail LAST, only where it serves focus
</code></pre>
<div class="callout"><span class="badge">Example</span> The environment teams on games like <em>Horizon</em> and <em>The Last of Us</em> use concept to establish a place's mood and story first; overgrown ruins and worn interiors say "civilization fell here" before any dialogue does.</div>`,
    `<span class="eyebrow">ANO301 · Chương 3 · Bài 3.1</span>
<h2>Thiết kế bối cảnh &amp; thế giới</h2>
<h3>Bối cảnh kể câu chuyện của thế giới</h3>
<p>Bối cảnh không chỉ là phông nền — nó là <strong>xây thế giới qua nơi chốn</strong>. Kiến trúc, dấu mòn, biển hiệu và đồ đạc lộn xộn tiết lộ ai sống ở đây, công nghệ, khí hậu và lịch sử của họ. Thiết kế bối cảnh tốt trả lời: ai dựng nơi này, họ sống ra sao, chuyện gì đã xảy ra ở đây.</p>
<h3>Thumbnail &amp; bố cục</h3>
<p>Bắt đầu bằng nhiều <strong>thumbnail</strong> nhỏ và nhanh — phác chỉ có sắc độ, thử hình khối lớn và bố cục trước khi có chi tiết. Rồi thiết kế bố cục có chủ đích:</p>
<ul>
<li><strong>Điểm nhấn (focal point)</strong> — một chỗ rõ để mắt nhìn tới đầu tiên (nhờ tương phản, chi tiết hoặc điểm hội tụ).</li>
<li><strong>Đường dẫn (leading lines)</strong> — đường, sông, kiến trúc dẫn mắt tới điểm nhấn.</li>
<li><strong>Quy tắc một phần ba / lớn-vừa-nhỏ</strong> — thay đổi kích cỡ hình khối, đặt phần tử chính lệch tâm.</li>
<li><strong>Bóng dáng &amp; gộp sắc độ</strong> — đọc cảnh thành 3-4 mảng sắc độ; nhỏ và xám mà vẫn rõ thì là được.</li>
</ul>
<pre><code>Vòng lặp thumbnail:
  10-20 phác nhỏ chỉ sắc độ (chỉ lo bố cục)
  -> chọn 2-3 cái mạnh nhất
  -> tinh sắc độ + màu cơ bản
  -> thêm chi tiết SAU CÙNG, chỉ ở nơi phục vụ điểm nhấn
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> Nhóm environment ở các game như <em>Horizon</em> và <em>The Last of Us</em> dùng concept để định mood và câu chuyện của nơi chốn trước; phế tích phủ cây và nội thất mòn cũ nói "văn minh đã sụp ở đây" trước cả lời thoại.</div>`,
  ]]);

const c3q = quiz('ano301-quiz-3', 'Quiz 3 — Environment design|||Quiz 3 — Thiết kế bối cảnh', [
  { id: 'q1', question: 'Vì sao nên bắt đầu bối cảnh bằng nhiều thumbnail sắc độ nhỏ?|||Why start an environment with many small value thumbnails?', options: ['Để tiết kiệm mực in|||To save printer ink', 'Để thử bố cục & hình khối lớn nhanh trước khi tốn công vào chi tiết|||To test composition & big shapes fast before spending time on detail', 'Vì client yêu cầu 20 bản|||Because the client demands 20 versions', 'Để tránh dùng màu|||To avoid using color'], correctIndex: 1, explanation: 'Thumbnail thử bố cục/hình khối nhanh; chi tiết để sau cùng.' },
  { id: 'q2', question: '"Điểm nhấn" (focal point) trong bố cục là?|||A "focal point" in composition is?', options: ['Điểm giữa chính xác của khung|||The exact center of the frame', 'Chỗ mắt người xem nhìn tới đầu tiên, tạo bởi tương phản/chi tiết/hội tụ|||Where the eye goes first, created by contrast/detail/convergence', 'Lớp nền dưới cùng|||The bottom background layer', 'Vùng tối nhất bắt buộc|||The mandatory darkest area'], correctIndex: 1, explanation: 'Focal point là nơi mắt đến đầu tiên, dẫn bởi tương phản, chi tiết, đường hội tụ.' },
  { id: 'q3', question: 'Bối cảnh tốt trong visdev chủ yếu để làm gì?|||A good visdev environment mainly does what?', options: ['Chỉ làm nền đẹp cho nhân vật|||Just be a pretty backdrop for characters', 'Kể câu chuyện của thế giới: ai sống ở đây, công nghệ, lịch sử|||Tell the world story: who lives here, tech, history', 'Khoe số lượng chi tiết|||Show off detail count', 'Chứng minh phần mềm mạnh|||Prove the software is powerful'], correctIndex: 1, explanation: 'Bối cảnh là world-building qua nơi chốn, không chỉ là phông nền.' },
]);

const c4 = doc('ano301-4-1-prop-vehicle-design', '4.1 — Prop & vehicle design|||4.1 — Thiết kế đạo cụ & phương tiện',
  'Prop/vehicle design: form theo chức năng, ngôn ngữ hình khối, silhouette, chi tiết & story, hình chiếu orthographic; ví dụ Star Wars/AAA.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 4 · Lesson 4.1</span>
<h2>Prop &amp; vehicle design</h2>
<h3>Form follows function follows story</h3>
<p>A prop or vehicle should look like it works. Ask what it does, who uses it and where — then let <strong>function drive form</strong>. A rugged mining truck reads differently from a sleek racing pod because their jobs differ. Grounding design in function makes even fantastical objects believable.</p>
<h3>Design principles</h3>
<ul>
<li><strong>Silhouette test</strong> — a strong design reads as a black shape. If two vehicles look identical in silhouette, redesign.</li>
<li><strong>Shape language</strong> — repeat a consistent motif (angular military, curved organic) so the object belongs to its world.</li>
<li><strong>Big-medium-small detail</strong> — big primary forms, medium secondary breaks, small tertiary detail. Avoid uniform "noise".</li>
<li><strong>Storytelling detail</strong> — scratches, patches, brands and wear that hint at history and use.</li>
</ul>
<pre><code>Prop design pass:
  Silhouette thumbnails (10+) -> pick strongest
  Big forms -> medium breaks -> small detail
  Callouts: materials, moving parts, scale figure
  Orthographic views (front/side/top) for modeling
</code></pre>
<div class="callout"><span class="badge">Example</span> <em>Star Wars</em>' "used future" — ships and droids that look worn, welded and repaired — is the classic lesson: storytelling detail and function make a design feel real. AAA studios ship the same way: concepts include orthographic views and material callouts so modelers can build exactly.</div>`,
    `<span class="eyebrow">ANO301 · Chương 4 · Bài 4.1</span>
<h2>Thiết kế đạo cụ &amp; phương tiện</h2>
<h3>Form theo chức năng, chức năng theo câu chuyện</h3>
<p>Một đạo cụ hay phương tiện nên trông như dùng được. Hỏi nó làm gì, ai dùng và ở đâu — rồi để <strong>chức năng dẫn dắt hình dáng</strong>. Một xe tải mỏ hầm hố đọc ra khác với một pod đua thanh thoát vì công việc của chúng khác nhau. Neo thiết kế vào chức năng khiến cả vật kỳ ảo cũng trở nên đáng tin.</p>
<h3>Nguyên tắc thiết kế</h3>
<ul>
<li><strong>Kiểm tra silhouette</strong> — thiết kế mạnh đọc được khi chỉ là mảng đen. Hai phương tiện mà bóng dáng giống hệt thì phải thiết kế lại.</li>
<li><strong>Ngôn ngữ hình khối</strong> — lặp một motif nhất quán (góc cạnh kiểu quân sự, cong hữu cơ) để vật thuộc về thế giới của nó.</li>
<li><strong>Chi tiết lớn-vừa-nhỏ</strong> — khối chính lớn, ngắt phụ vừa, chi tiết nhỏ cấp ba. Tránh "nhiễu" đều tăm tắp.</li>
<li><strong>Chi tiết kể chuyện</strong> — vết xước, miếng vá, nhãn hiệu và dấu mòn gợi lịch sử và cách dùng.</li>
</ul>
<pre><code>Lượt thiết kế đạo cụ:
  Thumbnail silhouette (10+) -> chọn cái mạnh nhất
  Khối lớn -> ngắt vừa -> chi tiết nhỏ
  Chú thích: vật liệu, bộ phận chuyển động, hình người tỉ lệ
  Hình chiếu (trước/bên/trên) cho modeling
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> "Tương lai đã cũ" của <em>Star Wars</em> — phi thuyền và droid trông mòn, hàn vá, sửa chữa — là bài học kinh điển: chi tiết kể chuyện và chức năng làm thiết kế thật. Studio AAA làm y vậy: concept kèm hình chiếu và chú thích vật liệu để modeler dựng đúng.</div>`,
  ]]);

const c4q = quiz('ano301-quiz-4', 'Quiz 4 — Prop & vehicle|||Quiz 4 — Đạo cụ & phương tiện', [
  { id: 'q1', question: 'Nguyên tắc "form follows function" nghĩa là?|||"Form follows function" means?', options: ['Vẽ càng nhiều chi tiết càng tốt|||Add as much detail as possible', 'Để chức năng (nó làm gì, ai dùng) dẫn dắt hình dáng, làm thiết kế đáng tin|||Let function drive form so the design is believable', 'Luôn dùng hình tròn|||Always use circles', 'Sao chép vật thật 100%|||Copy real objects 100%'], correctIndex: 1, explanation: 'Chức năng dẫn hình dáng khiến cả vật kỳ ảo cũng trông dùng được.' },
  { id: 'q2', question: 'Vì sao "silhouette test" quan trọng khi thiết kế phương tiện?|||Why is the silhouette test important?', options: ['Để tiết kiệm màu|||To save color', 'Thiết kế mạnh phải đọc được dưới dạng mảng đen; bóng dáng phân biệt được thiết kế|||A strong design reads as a black shape; silhouette distinguishes designs', 'Vì luật bản quyền|||Because of copyright law', 'Để ẩn chi tiết xấu|||To hide bad detail'], correctIndex: 1, explanation: 'Silhouette rõ và độc đáo là dấu hiệu thiết kế mạnh.' },
  { id: 'q3', question: 'Chi tiết như vết xước, miếng vá, dấu mòn trên phương tiện gọi là?|||Scratches, patches and wear on a vehicle are examples of?', options: ['Chi tiết kể chuyện (storytelling detail) gợi lịch sử & cách dùng|||Storytelling detail hinting at history & use', 'Lỗi kỹ thuật cần xoá|||Technical errors to remove', 'Chi tiết cấp một bắt buộc|||Mandatory primary detail', 'Hiệu ứng render|||A render effect'], correctIndex: 0, explanation: 'Dấu mòn kể lịch sử/cách dùng — làm thiết kế đáng tin (vd "used future").' },
]);

const c5 = doc('ano301-5-1-color-light', '5.1 — Color & light for concept|||5.1 — Màu & ánh sáng cho concept',
  'Color script, mood theo màu, ánh sáng kể chuyện, nhiệt độ màu, ánh sáng trực tiếp/gián tiếp/phản xạ; nguyên lý Gurney; ví dụ Pixar.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 5 · Lesson 5.1</span>
<h2>Color &amp; light for concept</h2>
<h3>Color carries emotion</h3>
<p>Color is one of the strongest storytelling tools. Warm palettes read as comfort, energy or danger; cool palettes as calm, isolation or night. A limited, deliberate palette unifies a design; a color <strong>accent</strong> against a muted field guides the eye to what matters.</p>
<h3>The color script</h3>
<p>A <strong>color script</strong> is a sequence of small paintings, one per beat of the story, mapping how color and value change over time. Pixar popularised it: the color script for a film plots the emotional arc — the warm glow of a happy scene, the desaturated cold of a low point.</p>
<h3>Light tells the story (Gurney)</h3>
<ul>
<li><strong>Light source &amp; direction</strong> — one clear key light defines form; direction sets time of day and mood.</li>
<li><strong>Color temperature</strong> — warm light usually pairs with cool shadows, and vice versa; the contrast makes images vibrate.</li>
<li><strong>Direct / indirect / reflected light</strong> — bounce and fill light color the shadows and tie objects to their surroundings.</li>
<li><strong>Value first</strong> — a strong value structure (grouped lights and darks) matters more than local color.</li>
</ul>
<div class="callout"><span class="badge">Reference</span> James Gurney's <em>Color and Light</em> is the standard text: study how warm light gives cool shadows, how atmosphere shifts distant color, and how one dominant light keeps a scene readable.</div>`,
    `<span class="eyebrow">ANO301 · Chương 5 · Bài 5.1</span>
<h2>Màu &amp; ánh sáng cho concept</h2>
<h3>Màu mang cảm xúc</h3>
<p>Màu là một trong những công cụ kể chuyện mạnh nhất. Bảng màu ấm đọc ra ấm cúng, năng lượng hoặc nguy hiểm; bảng màu lạnh là bình yên, cô độc hoặc đêm tối. Một bảng màu hạn chế, có chủ đích làm thiết kế đồng nhất; một <strong>điểm nhấn màu</strong> nổi trên nền trầm dẫn mắt tới thứ quan trọng.</p>
<h3>Color script</h3>
<p>Một <strong>color script</strong> là chuỗi tranh nhỏ, mỗi nhịp truyện một tranh, vẽ ra màu và sắc độ thay đổi thế nào theo thời gian. Pixar phổ biến nó: color script của một phim vẽ cung cảm xúc — ánh ấm rực của cảnh vui, cái lạnh nhạt màu của điểm trầm.</p>
<h3>Ánh sáng kể chuyện (Gurney)</h3>
<ul>
<li><strong>Nguồn sáng &amp; hướng</strong> — một key light rõ định hình khối; hướng đặt thời điểm trong ngày và mood.</li>
<li><strong>Nhiệt độ màu</strong> — ánh sáng ấm thường đi với bóng lạnh, và ngược lại; tương phản đó khiến hình "rung".</li>
<li><strong>Ánh trực tiếp / gián tiếp / phản xạ</strong> — ánh dội và fill nhuộm màu vào bóng, gắn vật với môi trường quanh nó.</li>
<li><strong>Sắc độ trước tiên</strong> — cấu trúc sắc độ mạnh (gộp sáng và tối) quan trọng hơn màu cục bộ.</li>
</ul>
<div class="callout"><span class="badge">Tài liệu</span> <em>Color and Light</em> của James Gurney là sách chuẩn: học cách ánh sáng ấm cho bóng lạnh, khí quyển làm dịch màu vật ở xa, và một nguồn sáng chủ đạo giữ cảnh dễ đọc.</div>`,
  ]]);

const c5q = quiz('ano301-quiz-5', 'Quiz 5 — Color & light|||Quiz 5 — Màu & ánh sáng', [
  { id: 'q1', question: 'Color script (do Pixar phổ biến) là gì?|||What is a color script (popularised by Pixar)?', options: ['Đoạn mã tô màu tự động|||An auto-coloring script', 'Chuỗi tranh nhỏ theo từng nhịp truyện, vẽ màu & sắc độ đổi thế nào theo cung cảm xúc|||A sequence of small paintings per story beat mapping color & value over the emotional arc', 'Danh sách mã hex bắt buộc|||A required list of hex codes', 'Bảng phân vai màu cho diễn viên|||A color assignment for actors'], correctIndex: 1, explanation: 'Color script vẽ màu/sắc độ thay đổi theo nhịp và cung cảm xúc của phim.' },
  { id: 'q2', question: 'Theo nguyên lý ánh sáng (Gurney), ánh sáng ấm thường đi kèm bóng đổ màu gì?|||Warm light usually pairs with shadows of which temperature?', options: ['Bóng ấm hơn nữa|||Even warmer shadows', 'Bóng lạnh (tương phản nhiệt độ làm hình rung)|||Cool shadows (temperature contrast makes it vibrate)', 'Bóng đen tuyền không màu|||Pure colorless black', 'Không có bóng|||No shadows'], correctIndex: 1, explanation: 'Ánh ấm ↔ bóng lạnh (và ngược lại); tương phản nhiệt độ tạo sức sống.' },
  { id: 'q3', question: 'Trong concept, ưu tiên nào giúp hình dễ đọc nhất?|||What priority keeps a concept most readable?', options: ['Nhiều màu rực nhất có thể|||As many vivid colors as possible', 'Cấu trúc sắc độ mạnh (gộp sáng/tối) trước màu cục bộ|||A strong value structure (grouped light/dark) before local color', 'Chi tiết đều khắp khung|||Uniform detail everywhere', 'Dùng đủ 3 nguồn sáng|||Always use three light sources'], correctIndex: 1, explanation: 'Value trước, màu sau — sắc độ mạnh giữ hình đọc được.' },
]);

const c6 = doc('ano301-6-1-perspective', '6.1 — Perspective & space|||6.1 — Phối cảnh & không gian',
  'Phối cảnh cho concept (1/2/3 điểm tụ), đường chân trời, chiều sâu, atmospheric perspective, dàn cảnh; nguyên lý Mateu-Mestre.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 6 · Lesson 6.1</span>
<h2>Perspective &amp; space</h2>
<h3>Perspective as a storytelling tool</h3>
<p>Perspective is not just technical accuracy — it is how you place the viewer <em>inside</em> a space and steer their feeling. A low horizon and worm's-eye view make a structure monumental; a high bird's-eye view makes a character small and vulnerable. Marcos Mateu-Mestre's <em>Framed Perspective</em> teaches perspective in service of <strong>staging and story</strong>.</p>
<h3>The essentials</h3>
<ul>
<li><strong>Horizon line = eye level</strong> — everything is constructed relative to it; move it to change the camera's feeling.</li>
<li><strong>Vanishing points</strong> — 1-point (straight-on corridors), 2-point (corners of buildings), 3-point (dramatic looking up/down).</li>
<li><strong>Camera choice</strong> — angle and lens (wide vs long) change mood and drama, exactly like a film camera.</li>
</ul>
<h3>Depth &amp; atmospheric perspective</h3>
<p>To make a flat image feel deep, layer it and let the air do its work:</p>
<pre><code>Foreground -> darkest values, warmest, most detail, highest contrast
Midground  -> medium value &amp; contrast
Background -> lighter, cooler, lower contrast, less detail
</code></pre>
<p>This <strong>atmospheric (aerial) perspective</strong> — distant things get lighter, bluer and lower-contrast because of air and haze — is one of the most reliable ways to create depth.</p>
<div class="callout"><span class="badge">Reference</span> Study <em>Framed Perspective</em> (vol. 1 &amp; 2) for constructing space and for staging characters and cameras to tell the story clearly.</div>`,
    `<span class="eyebrow">ANO301 · Chương 6 · Bài 6.1</span>
<h2>Phối cảnh &amp; không gian</h2>
<h3>Phối cảnh như công cụ kể chuyện</h3>
<p>Phối cảnh không chỉ là độ chính xác kỹ thuật — nó là cách bạn đặt người xem <em>vào bên trong</em> một không gian và lái cảm xúc của họ. Đường chân trời thấp và góc nhìn từ dưới lên làm công trình hùng vĩ; góc nhìn từ trên cao làm nhân vật nhỏ bé, mong manh. <em>Framed Perspective</em> của Marcos Mateu-Mestre dạy phối cảnh phục vụ <strong>dàn cảnh và câu chuyện</strong>.</p>
<h3>Những điều cốt lõi</h3>
<ul>
<li><strong>Đường chân trời = tầm mắt</strong> — mọi thứ dựng theo nó; dời nó để đổi cảm giác của máy quay.</li>
<li><strong>Điểm tụ</strong> — 1 điểm (hành lang nhìn thẳng), 2 điểm (góc nhà), 3 điểm (kịch tính nhìn lên/xuống).</li>
<li><strong>Chọn máy quay</strong> — góc và tiêu cự (rộng với tele) đổi mood và kịch tính, y như máy quay phim.</li>
</ul>
<h3>Chiều sâu &amp; atmospheric perspective</h3>
<p>Để một hình phẳng có chiều sâu, hãy phân lớp và để không khí làm việc của nó:</p>
<pre><code>Tiền cảnh -> sắc độ đậm nhất, ấm nhất, chi tiết &amp; tương phản cao nhất
Trung cảnh -> sắc độ &amp; tương phản trung bình
Hậu cảnh  -> nhạt hơn, lạnh hơn, tương phản thấp, ít chi tiết
</code></pre>
<p><strong>Phối cảnh khí quyển (atmospheric/aerial perspective)</strong> — vật ở xa nhạt hơn, ngả xanh và tương phản thấp do không khí và mù — là một trong những cách tạo chiều sâu đáng tin nhất.</p>
<div class="callout"><span class="badge">Tài liệu</span> Học <em>Framed Perspective</em> (tập 1 &amp; 2) để dựng không gian và để dàn nhân vật, máy quay kể câu chuyện rõ ràng.</div>`,
  ]]);

const c6q = quiz('ano301-quiz-6', 'Quiz 6 — Perspective|||Quiz 6 — Phối cảnh', [
  { id: 'q1', question: 'Đường chân trời (horizon line) trong phối cảnh tương ứng với?|||The horizon line corresponds to?', options: ['Đáy của khung hình|||The bottom of the frame', 'Tầm mắt của người xem/máy quay|||The viewer/camera eye level', 'Nguồn sáng chính|||The main light source', 'Điểm nhấn của bố cục|||The composition focal point'], correctIndex: 1, explanation: 'Horizon line = eye level; mọi thứ dựng theo nó và nó định cảm giác máy quay.' },
  { id: 'q2', question: 'Atmospheric (aerial) perspective tạo chiều sâu bằng cách?|||Atmospheric perspective creates depth by?', options: ['Làm vật ở xa đậm & tương phản cao hơn|||Making distant objects darker & higher-contrast', 'Làm vật ở xa nhạt hơn, ngả xanh, tương phản & chi tiết thấp hơn|||Making distant objects lighter, bluer, lower-contrast & less detailed', 'Phóng to tiền cảnh|||Enlarging the foreground', 'Dùng 3 điểm tụ|||Using three vanishing points'], correctIndex: 1, explanation: 'Không khí/mù làm vật xa nhạt, ngả xanh, giảm tương phản → cảm giác sâu.' },
  { id: 'q3', question: 'Góc nhìn từ dưới lên (low horizon, worm-eye) thường khiến chủ thể trông?|||A low, worm-eye view usually makes a subject look?', options: ['Nhỏ bé & mong manh|||Small & vulnerable', 'Hùng vĩ, áp đảo|||Monumental & imposing', 'Xa hơn thực tế|||Farther away', 'Phẳng, không chiều sâu|||Flat, without depth'], correctIndex: 1, explanation: 'Đường chân trời thấp, nhìn lên → chủ thể hùng vĩ, áp đảo.' },
]);

const c7 = doc('ano301-7-1-digital-matte', '7.1 — Digital workflow & matte painting|||7.1 — Quy trình digital & matte painting',
  'Quy trình digital, photobashing, matte painting, kitbashing, dùng 3D blockout làm nền, chỉnh sửa không phá huỷ; ví dụ phim/AAA.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 7 · Lesson 7.1</span>
<h2>Digital workflow &amp; matte painting</h2>
<h3>Modern concept is a hybrid workflow</h3>
<p>Working concept artists rarely paint every pixel by hand. They combine painting with photos, 3D and libraries to hit quality and speed. The skills below are industry standard for film and AAA games.</p>
<ul>
<li><strong>Photobashing</strong> — compositing and painting over photo elements to build realistic textures and detail fast. Adjust color, value and perspective so pieces read as one world, then paint to unify.</li>
<li><strong>Kitbashing</strong> — assembling a scene or object from a library of reusable 3D parts (or photo pieces), then painting over the render.</li>
<li><strong>3D blockout</strong> — building a rough scene in Blender to lock perspective, lighting and composition, then painting on top. This solves hard perspective and lets you re-angle the camera cheaply.</li>
<li><strong>Matte painting</strong> — creating expansive backgrounds (vistas, cities, skies) that read as real environments, often projected onto simple geometry for camera moves.</li>
</ul>
<h3>Non-destructive habits</h3>
<pre><code>Work on layers &amp; groups (don't flatten early)
Use adjustment layers &amp; masks for color/value
Keep value + color on separable passes
Overpaint photo/3D last to unify style
</code></pre>
<div class="callout"><span class="badge">Example</span> Modern film matte painting and AAA key art routinely combine 3D blockouts, photobashing and overpaint. The 3D base fixes perspective and lighting; the paint pass gives it art direction and mood a raw render lacks.</div>`,
    `<span class="eyebrow">ANO301 · Chương 7 · Bài 7.1</span>
<h2>Quy trình digital &amp; matte painting</h2>
<h3>Concept hiện đại là quy trình lai</h3>
<p>Concept artist đang làm nghề hiếm khi vẽ tay từng điểm ảnh. Họ kết hợp vẽ với ảnh, 3D và thư viện để đạt chất lượng và tốc độ. Các kỹ năng dưới đây là chuẩn ngành cho phim và game AAA.</p>
<ul>
<li><strong>Photobashing</strong> — ghép và vẽ đè lên mảnh ảnh để dựng chất liệu và chi tiết tả thực nhanh. Chỉnh màu, sắc độ và phối cảnh để các mảnh đọc ra như một thế giới, rồi vẽ để làm đồng nhất.</li>
<li><strong>Kitbashing</strong> — lắp một cảnh hay vật từ thư viện linh kiện 3D dùng lại (hoặc mảnh ảnh), rồi vẽ đè lên bản render.</li>
<li><strong>Dựng khối 3D (blockout)</strong> — dựng một cảnh thô trong Blender để khoá phối cảnh, ánh sáng và bố cục, rồi vẽ lên trên. Cách này giải quyết phối cảnh khó và cho đổi góc máy rẻ.</li>
<li><strong>Matte painting</strong> — tạo hậu cảnh rộng lớn (toàn cảnh, thành phố, bầu trời) đọc ra như môi trường thật, thường chiếu lên khối hình đơn giản để máy quay di chuyển.</li>
</ul>
<h3>Thói quen chỉnh sửa không phá huỷ</h3>
<pre><code>Làm trên lớp &amp; nhóm (đừng gộp phẳng sớm)
Dùng adjustment layer &amp; mask cho màu/sắc độ
Tách sắc độ + màu thành các lượt riêng
Vẽ đè ảnh/3D sau cùng để đồng nhất phong cách
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> Matte painting phim hiện đại và key art game AAA thường xuyên kết hợp dựng khối 3D, photobashing và vẽ đè. Nền 3D chỉnh phối cảnh và ánh sáng; lượt vẽ mang lại art direction và mood mà một bản render thô còn thiếu.</div>`,
  ]]);

const c7q = quiz('ano301-quiz-7', 'Quiz 7 — Digital & matte|||Quiz 7 — Digital & matte', [
  { id: 'q1', question: 'Photobashing là gì?|||What is photobashing?', options: ['Xoá toàn bộ ảnh khỏi file|||Deleting all photos from a file', 'Ghép & vẽ đè lên mảnh ảnh để dựng chất liệu/chi tiết tả thực nhanh, rồi vẽ cho đồng nhất|||Compositing & painting over photo pieces to build realistic detail fast, then unifying', 'Vẽ tay 100% không dùng ảnh|||100% hand painting with no photos', 'Chụp ảnh màn hình game|||Screenshotting a game'], correctIndex: 1, explanation: 'Photobashing ghép mảnh ảnh + vẽ đè để đạt chi tiết thật nhanh.' },
  { id: 'q2', question: 'Dựng khối 3D (blockout) trong Blender trước khi vẽ giúp gì?|||A 3D blockout before painting helps by?', options: ['Xuất file game cuối cùng|||Exporting the final game build', 'Khoá phối cảnh, ánh sáng & bố cục, cho đổi góc máy rẻ trước khi vẽ đè|||Locking perspective, lighting & composition, cheap camera re-angling before overpaint', 'Thay hoàn toàn khâu vẽ|||Fully replacing the painting stage', 'Chỉ để đếm đa giác|||Just to count polygons'], correctIndex: 1, explanation: '3D base khoá phối cảnh/ánh sáng/bố cục; vẽ đè để có art direction.' },
  { id: 'q3', question: 'Vì sao nên làm việc "không phá huỷ" (layers, mask, adjustment)?|||Why work non-destructively (layers, masks, adjustments)?', options: ['Để file nhẹ hơn|||To make files smaller', 'Để chỉnh sửa/đảo lại được màu, sắc độ, bố cục mà không mất bản gốc|||To revise color, value and composition without losing the original', 'Vì render nhanh hơn|||Because it renders faster', 'Vì bắt buộc trong mọi phần mềm|||Because every app requires it'], correctIndex: 1, explanation: 'Layer/mask/adjustment cho phép đảo lại và tinh chỉnh linh hoạt.' },
]);

const c8 = doc('ano301-8-1-worldbuilding-portfolio', '8.1 — World-building & portfolio|||8.1 — Xây thế giới & portfolio',
  'Visual dev package, style guide, art bible, giữ nhất quán toàn thế giới, dựng portfolio chuẩn ngành trên ArtStation; ví dụ studio.',
  [[
    `<span class="eyebrow">ANO301 · Chapter 8 · Lesson 8.1</span>
<h2>World-building &amp; portfolio</h2>
<h3>The visual development package</h3>
<p>A finished visdev project is not one hero image — it is a <strong>package</strong> that lets a whole team build a consistent world. It typically includes: key concepts, environment and prop designs, a color script, character/creature designs, and callouts. Everything must feel like one place.</p>
<h3>Style guide &amp; art bible</h3>
<ul>
<li><strong>Style guide</strong> — the rules of the look: palette, shape language, level of stylization, materials, line and lighting conventions. It keeps many artists on-model.</li>
<li><strong>Art bible</strong> — the larger document holding the world's visual rules, references, do's/don'ts and approved designs, so the world stays coherent across a long production.</li>
</ul>
<h3>Building an industry portfolio</h3>
<p>Studios hire from <strong>ArtStation</strong>. A strong portfolio:</p>
<pre><code>- Shows DESIGN thinking, not just rendering (thumbnails, variations, callouts)
- Is focused: pick a lane (environments, props, or characters) and go deep
- Presents a coherent visual-development project, not random one-offs
- Includes orthographic/turnaround &amp; process to prove you can be built from
- Quality over quantity: a few strong, finished pieces beat many weak ones
</code></pre>
<div class="callout"><span class="badge">Example</span> Studio recruiters look for artists who can design a believable world and communicate it clearly. A single well-presented visdev package — moodboard, thumbnails, final designs, color script and callouts — demonstrates exactly the skills a production needs.</div>`,
    `<span class="eyebrow">ANO301 · Chương 8 · Bài 8.1</span>
<h2>Xây thế giới &amp; portfolio</h2>
<h3>Gói visual development</h3>
<p>Một dự án visdev hoàn chỉnh không phải một tấm hero duy nhất — nó là một <strong>gói</strong> cho phép cả nhóm dựng một thế giới nhất quán. Thường gồm: các concept chủ đạo, thiết kế bối cảnh và đạo cụ, một color script, thiết kế nhân vật/sinh vật, và chú thích. Mọi thứ phải cho cảm giác cùng một nơi.</p>
<h3>Style guide &amp; art bible</h3>
<ul>
<li><strong>Style guide</strong> — luật của diện mạo: bảng màu, ngôn ngữ hình khối, mức cách điệu, vật liệu, quy ước nét và ánh sáng. Nó giữ nhiều nghệ sĩ đúng "chuẩn thế giới".</li>
<li><strong>Art bible</strong> — tài liệu lớn hơn chứa luật thị giác của thế giới, reference, nên/không nên và các thiết kế đã duyệt, để thế giới nhất quán suốt một quá trình sản xuất dài.</li>
</ul>
<h3>Dựng portfolio chuẩn ngành</h3>
<p>Studio tuyển từ <strong>ArtStation</strong>. Một portfolio mạnh:</p>
<pre><code>- Cho thấy tư duy THIẾT KẾ, không chỉ render (thumbnail, biến thể, chú thích)
- Tập trung: chọn một hướng (bối cảnh, đạo cụ, hoặc nhân vật) và đào sâu
- Trình bày một dự án visual development mạch lạc, không phải các bài rời rạc
- Kèm hình chiếu/turnaround &amp; quy trình để chứng minh có thể dựng theo
- Chất hơn lượng: vài bài mạnh, hoàn thiện hơn nhiều bài yếu
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> Nhà tuyển dụng studio tìm nghệ sĩ thiết kế được một thế giới đáng tin và truyền đạt rõ ràng. Một gói visdev trình bày tốt — moodboard, thumbnail, thiết kế cuối, color script và chú thích — chứng minh đúng những kỹ năng một dự án cần.</div>`,
  ]]);

const c8q = quiz('ano301-quiz-8', 'Quiz 8 — World-building & portfolio|||Quiz 8 — Xây thế giới & portfolio', [
  { id: 'q1', question: 'Mục đích của "style guide / art bible" trong một dự án là?|||Purpose of a style guide / art bible?', options: ['Liệt kê nhân sự dự án|||List the project staff', 'Chứa luật thị giác (màu, hình khối, vật liệu) giữ nhiều nghệ sĩ nhất quán suốt sản xuất|||Hold the visual rules (color, shape, materials) keeping many artists consistent across production', 'Tính ngân sách render|||Budget the render farm', 'Thay thế kịch bản|||Replace the script'], correctIndex: 1, explanation: 'Style guide/art bible giữ ngôn ngữ thị giác nhất quán cho cả đội.' },
  { id: 'q2', question: 'Một "visual development package" hoàn chỉnh là?|||A complete visual-development package is?', options: ['Một tấm hero image duy nhất|||A single hero image', 'Một gói: concept chủ đạo, bối cảnh, đạo cụ, color script, chú thích — cùng một thế giới|||A package: key concepts, environments, props, color script, callouts — one coherent world', 'Chỉ là bảng màu|||Just a palette', 'File .blend của cảnh|||The scene .blend file'], correctIndex: 1, explanation: 'Visdev package là bộ thiết kế để cả đội dựng một thế giới nhất quán.' },
  { id: 'q3', question: 'Portfolio visdev mạnh trên ArtStation nên ưu tiên?|||A strong ArtStation visdev portfolio should prioritise?', options: ['Càng nhiều bài rời rạc càng tốt|||As many random one-offs as possible', 'Tư duy thiết kế (thumbnail, biến thể, chú thích) & vài bài mạnh, tập trung một hướng|||Design thinking (thumbnails, variations, callouts) & a few strong, focused pieces', 'Chỉ hình render đẹp nhất, giấu quy trình|||Only the prettiest renders, hiding process', 'Số lượng thắng chất lượng|||Quantity over quality'], correctIndex: 1, explanation: 'Cho thấy tư duy thiết kế + quy trình, chất hơn lượng, tập trung một hướng.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ANO301',
    slug: 'ano301-visual-development-for-digital-design',
    title: 'Visual development for digital design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANO301.webp',
    shortDescription: 'Design the look of films & games — visdev from research & moodboards to environments, props, color & light, perspective & matte painting, up to a portfolio package. Bilingual, real examples & quizzes.|||Thiết kế diện mạo phim & game — visdev từ nghiên cứu & moodboard tới bối cảnh, đạo cụ, màu & ánh sáng, phối cảnh & matte painting, tới gói portfolio. Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>ANO301 — Visual Development for Digital Design (concept art)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 7. Môn dạy <strong>phát triển thị giác</strong> — giai đoạn thiết kế quyết định phim/series/game trông thế nào trước khi làm hoạt hình hay render. Lộ trình 8 chương: <strong>visdev là gì</strong> (vai trò, concept art vs illustration) → <strong>nghiên cứu &amp; moodboard</strong> → <strong>thiết kế bối cảnh</strong> (thumbnail, bố cục) → <strong>đạo cụ &amp; phương tiện</strong> → <strong>màu &amp; ánh sáng</strong> (color script, Gurney) → <strong>phối cảnh &amp; không gian</strong> (Mateu-Mestre) → <strong>quy trình digital &amp; matte painting</strong> → <strong>xây thế giới &amp; portfolio</strong>. Song ngữ, ví dụ phim/game thật (Pixar, Disney, AAA), quiz mỗi chương.',
    whatYouLearn: 'Visdev vs illustration & quy trình brief→design; research, moodboard, ngôn ngữ thị giác; thiết kế bối cảnh (thumbnail, bố cục, điểm nhấn); đạo cụ/phương tiện (silhouette, form theo chức năng, chi tiết kể chuyện); màu & ánh sáng (color script, nhiệt độ màu, value); phối cảnh (điểm tụ, atmospheric perspective, dàn cảnh); photobashing/kitbashing/matte painting & 3D blockout; visual dev package, style guide/art bible, portfolio ArtStation.',
    requirements: 'Nền vẽ cơ bản (hình khối, sắc độ). Nên có Photoshop hoặc Procreate; Blender cho blockout. Xem điều kiện tiên quyết trong khung ngành Thiết kế mỹ thuật số trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Gurney, Mateu-Mestre), ArtStation/Schoolism, YouTube, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Visdev là gì, visdev vs illustration, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Visdev là gì|||Chapter 1 — What visdev is', description: 'Vai trò trong phim/game, concept art vs illustration, quy trình.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu & moodboard|||Chapter 2 — Research & moodboards', description: 'Reference, moodboard, ngôn ngữ thị giác, phong cách.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiết kế bối cảnh|||Chapter 3 — Environment design', description: 'World-building, thumbnail, bố cục, điểm nhấn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đạo cụ & phương tiện|||Chapter 4 — Prop & vehicle design', description: 'Form theo chức năng, silhouette, chi tiết kể chuyện.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Màu & ánh sáng|||Chapter 5 — Color & light', description: 'Color script, mood, ánh sáng kể chuyện, Gurney.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phối cảnh & không gian|||Chapter 6 — Perspective & space', description: 'Điểm tụ, chiều sâu, atmospheric perspective, Mateu-Mestre.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Digital & matte painting|||Chapter 7 — Digital & matte painting', description: 'Photobashing, kitbashing, matte painting, 3D blockout.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xây thế giới & portfolio|||Chapter 8 — World-building & portfolio', description: 'Visual dev package, style guide, art bible, portfolio.', lessons: [c8, c8q] },
  ],
};
