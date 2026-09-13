/**
 * DRP101 — Drawing - Plaster Statue, Portrait. Ngành Thiết kế mỹ thuật số, Kỳ 1.
 * Môn thực hành vẽ tay: dụng cụ & nét, khối hình học, sáng-tối & sắc độ, phối
 * cảnh, tượng thạch cao, giải phẫu đầu & tỉ lệ mặt, chân dung, đánh bóng & bố cục.
 * Bám giáo trình: Loomis, Bridgman, Betty Edwards, Nicolaides. Song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('drp101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Loomis, Bridgman, Betty Edwards, Nicolaides), tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">DRP101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to learn <strong>observational drawing</strong> — from holding the pencil to finished plaster casts and portraits — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources and the classic textbooks this course follows.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DRP101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Classic textbooks</h3>
<ul>
<li><strong>Andrew Loomis</strong> — <em>Drawing the Head and Hands</em> &amp; <em>Figure Drawing for All It Is Worth</em> (the Loomis head method).</li>
<li><strong>George Bridgman</strong> — <em>Constructive Anatomy</em> (form &amp; anatomy).</li>
<li><strong>Betty Edwards</strong> — <em>Drawing on the Right Side of the Brain</em> (seeing edges, spaces, relationships).</li>
<li><strong>Kimon Nicolaides</strong> — <em>The Natural Way to Draw</em> (contour &amp; gesture exercises).</li>
</ul>
<h3>🌐 Free resources</h3>
<ul>
<li><a href="https://drawabox.com/" target="_blank" rel="noopener">Drawabox</a> — free course on lines, forms &amp; construction.</li>
<li><a href="https://www.ctrlpaint.com/" target="_blank" rel="noopener">Ctrl+Paint</a> — free drawing &amp; digital painting library.</li>
<li><a href="https://line-of-action.com/" target="_blank" rel="noopener">Line of Action</a> — timed figure, face &amp; hands references for practice.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ProkoTV" target="_blank" rel="noopener">Proko</a> — figure, portrait &amp; anatomy fundamentals.</li>
<li><a href="https://www.youtube.com/@drawabox9198" target="_blank" rel="noopener">Drawabox</a> — construction &amp; form.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Graphite pencils (a range from <strong>2H</strong> to <strong>6B</strong>), a kneaded eraser, a blending stump, and smooth cartridge paper.</li>
<li>A drawing board and, for casts, a single strong light source to create clear shadows.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — grip, line control, the four basic forms (sphere, cube, cylinder, cone).</li>
<li><strong>See values</strong> — build a value scale and read light, halftone, core shadow, reflected light and cast shadow.</li>
<li><strong>Construct</strong> — perspective, block-in and proportion measuring; then plaster casts.</li>
<li><strong>Portrait</strong> — the Loomis head, face proportion, features, then shading &amp; composition.</li>
</ol></div>`,
    `<span class="eyebrow">DRP101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>vẽ quan sát</strong> — từ cách cầm bút đến bài tượng thạch cao và chân dung hoàn thiện — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp và các sách kinh điển mà môn này bám theo.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DRP101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách kinh điển</h3>
<ul>
<li><strong>Andrew Loomis</strong> — <em>Drawing the Head and Hands</em> &amp; <em>Figure Drawing for All It Is Worth</em> (phương pháp dựng đầu Loomis).</li>
<li><strong>George Bridgman</strong> — <em>Constructive Anatomy</em> (khối &amp; giải phẫu).</li>
<li><strong>Betty Edwards</strong> — <em>Drawing on the Right Side of the Brain</em> (nhìn cạnh, khoảng âm, tương quan).</li>
<li><strong>Kimon Nicolaides</strong> — <em>The Natural Way to Draw</em> (bài tập nét viền &amp; nét dáng).</li>
</ul>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://drawabox.com/" target="_blank" rel="noopener">Drawabox</a> — khoá miễn phí về nét, khối &amp; dựng hình.</li>
<li><a href="https://www.ctrlpaint.com/" target="_blank" rel="noopener">Ctrl+Paint</a> — thư viện vẽ &amp; digital painting miễn phí.</li>
<li><a href="https://line-of-action.com/" target="_blank" rel="noopener">Line of Action</a> — ảnh mẫu dáng người, khuôn mặt &amp; bàn tay bấm giờ để luyện.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ProkoTV" target="_blank" rel="noopener">Proko</a> — nền tảng dáng, chân dung &amp; giải phẫu.</li>
<li><a href="https://www.youtube.com/@drawabox9198" target="_blank" rel="noopener">Drawabox</a> — dựng hình &amp; khối.</li>
</ul>
<h3>🛠️ Dụng cụ</h3>
<ul>
<li>Bút chì graphite (dải từ <strong>2H</strong> đến <strong>6B</strong>), tẩy dẻo, cây di chì (blending stump), và giấy vẽ mịn.</li>
<li>Một bảng vẽ và, khi vẽ tượng, một nguồn sáng mạnh duy nhất để tạo bóng rõ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — cầm bút, làm chủ nét, bốn khối cơ bản (cầu, lập phương, trụ, nón).</li>
<li><strong>Thấy sắc độ</strong> — dựng thang sắc độ và đọc vùng sáng, chuyển tiếp, bóng khối, phản quang và bóng đổ.</li>
<li><strong>Dựng hình</strong> — phối cảnh, block-in và đo tỉ lệ; rồi đến tượng thạch cao.</li>
<li><strong>Chân dung</strong> — đầu Loomis, tỉ lệ mặt, ngũ quan, rồi đánh bóng &amp; bố cục.</li>
</ol></div>`,
  ]]);

const intro = doc('drp101-0-1-overview', 'Course overview: learning to see &amp; draw|||Tổng quan: học nhìn &amp; vẽ',
  'Vẽ hình hoạ là gì; vẽ là kỹ năng NHÌN chứ không phải năng khiếu bẩm sinh; lộ trình 8 chương: nét → khối → sắc độ → phối cảnh → tượng thạch cao → giải phẫu đầu → chân dung → hoàn thiện.',
  [[
    `<span class="eyebrow">DRP101 · Lesson 0.1 · Overview</span>
<h2>Drawing — Plaster Statue &amp; Portrait</h2>
<p class="lead">This course teaches <strong>observational drawing</strong>: rendering what you actually see, in graphite, from three-dimensional forms — from simple solids up to <strong>plaster casts</strong> and the <strong>human portrait</strong>. It is the foundation subject of the Digital Art &amp; Design programme.</p>
<h3>Drawing is a skill of seeing</h3>
<p>The single most important idea in this course, and the thesis of Betty Edwards, is that <strong>drawing is learned, not inborn</strong>. Most beginners draw the <em>symbol</em> they hold in their head (a stick eye, a lollipop tree) instead of the shapes on the model. Training your eye to see <strong>edges, negative spaces, proportion, relationships and value</strong> is what this course builds.</p>
<h3>What you will be able to do</h3>
<ul>
<li>Control the pencil: clean lines, even tone, a full range of values.</li>
<li>Construct any subject from the four basic forms and place it correctly in perspective.</li>
<li>Render a plaster cast with accurate proportion and convincing light.</li>
<li>Draw a human head and portrait using the Loomis method and correct face proportion.</li>
</ul>
<h3>Roadmap</h3>
<p>Tools &amp; strokes → line &amp; geometric forms → light, shadow &amp; value → perspective &amp; construction → plaster casts → head anatomy &amp; proportion → portrait features → shading, materials &amp; composition. Bilingual, with step-by-step process and a quiz each chapter.</p>`,
    `<span class="eyebrow">DRP101 · Bài 0.1 · Tổng quan</span>
<h2>Hình hoạ — Tượng thạch cao &amp; Chân dung</h2>
<p class="lead">Môn này dạy <strong>vẽ quan sát</strong>: thể hiện đúng thứ bạn nhìn thấy, bằng chì, từ những khối ba chiều — từ khối đơn giản đến <strong>tượng thạch cao</strong> và <strong>chân dung người</strong>. Đây là môn nền tảng của ngành Thiết kế mỹ thuật số.</p>
<h3>Vẽ là kỹ năng của việc nhìn</h3>
<p>Ý quan trọng nhất của môn này, cũng là luận điểm của Betty Edwards, là <strong>vẽ được học chứ không phải bẩm sinh</strong>. Đa số người mới vẽ cái <em>ký hiệu</em> trong đầu (con mắt hình que, cái cây hình kẹo mút) thay vì các hình khối trên mẫu. Việc luyện mắt thấy <strong>cạnh, khoảng âm, tỉ lệ, tương quan và sắc độ</strong> chính là thứ môn này xây dựng.</p>
<h3>Bạn sẽ làm được gì</h3>
<ul>
<li>Làm chủ bút chì: nét sạch, tô đều, dải sắc độ đầy đủ.</li>
<li>Dựng mọi vật thể từ bốn khối cơ bản và đặt đúng trong phối cảnh.</li>
<li>Vẽ một tượng thạch cao đúng tỉ lệ và ánh sáng thuyết phục.</li>
<li>Vẽ đầu người và chân dung theo phương pháp Loomis và tỉ lệ mặt chuẩn.</li>
</ul>
<h3>Lộ trình</h3>
<p>Dụng cụ &amp; nét → đường nét &amp; khối hình học → sáng, bóng &amp; sắc độ → phối cảnh &amp; dựng hình → tượng thạch cao → giải phẫu đầu &amp; tỉ lệ → ngũ quan chân dung → đánh bóng, chất liệu &amp; bố cục. Song ngữ, có quy trình từng bước và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('drp101-1-1-tools-grip-strokes', '1.1 — Tools, posture, grip &amp; basic strokes|||1.1 — Dụng cụ, tư thế, cầm bút &amp; nét cơ bản',
  'Bút chì và độ cứng/mềm (thang H-B), giấy, tẩy; tư thế ngồi và khoảng cách; hai cách cầm bút (viết vs overhand); luyện nét thẳng, nét cong, tô đều.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 1 · Lesson 1.1</span>
<h2>Tools, posture, grip &amp; basic strokes</h2>
<h3>The graphite scale</h3>
<p>Pencils are graded on an <strong>H–B scale</strong>. <strong>H</strong> = Hard (light, thin, for construction and fine detail); <strong>B</strong> = Black/soft (dark, rich, for shadows). The higher the number, the stronger the effect.</p>
<pre><code>Hard  2H --- H --- HB --- B --- 2B --- 4B --- 6B  Soft
      light, thin lines        dark, soft, smudgy
Use:  2H/H  construction &amp; light guidelines
      HB/B  general drawing, mid tones
      3B-6B dark accents, deepest shadows</code></pre>
<h3>Posture &amp; distance</h3>
<p>Sit upright, board tilted toward you, and keep the whole drawing in view — do not hunch over one corner. Draw from the <strong>shoulder and elbow</strong> for long lines, not just the fingers. Sitting back so you can see the model and the paper together is what lets you compare proportion.</p>
<h3>Two grips</h3>
<ul>
<li><strong>Writing grip</strong> — pencil held like a pen, close to the tip: control, detail, small marks.</li>
<li><strong>Overhand grip</strong> — pencil laid under the palm, held far back: loose sweeping strokes, broad shading with the side of the lead.</li>
</ul>
<h3>Practice strokes</h3>
<pre><code>Warm-up drills (fill a page of each):
 1. Straight lines  -- edge to edge, from the shoulder
 2. Ghosting        -- hover the path first, then commit
 3. Ellipses        -- confident loops, keep them even
 4. Value gradient  -- dark to light in one smooth band
 5. Even tone       -- flat grey, no visible strokes</code></pre>
<div class="callout"><span class="badge">Confidence over caution</span> A fast, committed line drawn from the shoulder beats a slow, scratchy one. Ghost the movement a few times, then draw it in one stroke.</div>`,
    `<span class="eyebrow">DRP101 · Chương 1 · Bài 1.1</span>
<h2>Dụng cụ, tư thế, cầm bút &amp; nét cơ bản</h2>
<h3>Thang độ chì graphite</h3>
<p>Bút chì chia theo <strong>thang H–B</strong>. <strong>H</strong> = Hard (cứng: nhạt, mảnh, để dựng hình và chi tiết tinh); <strong>B</strong> = Black/mềm (đậm, giàu sắc, để đánh bóng tối). Số càng lớn thì hiệu ứng càng mạnh.</p>
<pre><code>Cứng 2H --- H --- HB --- B --- 2B --- 4B --- 6B  Mềm
     net nhat, manh          dam, mem, de nhoe
Dung: 2H/H  dung hinh &amp; net mo
      HB/B  ve chung, trung do
      3B-6B nhan tối, bong sau nhat</code></pre>
<h3>Tư thế &amp; khoảng cách</h3>
<p>Ngồi thẳng, bảng vẽ nghiêng về phía mình, và luôn thấy toàn bộ bài — đừng cúi gằm vào một góc. Vẽ nét dài bằng <strong>vai và khuỷu tay</strong>, không chỉ bằng ngón. Ngồi lùi đủ để thấy cả mẫu lẫn giấy là điều giúp bạn so sánh tỉ lệ.</p>
<h3>Hai cách cầm bút</h3>
<ul>
<li><strong>Cầm như viết</strong> — cầm sát đầu bút như cầm bút mực: kiểm soát, chi tiết, nét nhỏ.</li>
<li><strong>Cầm ngửa (overhand)</strong> — đặt bút dưới lòng bàn tay, cầm xa đầu: nét quét thoải mái, đánh bóng rộng bằng cạnh ruột chì.</li>
</ul>
<h3>Luyện nét</h3>
<pre><code>Bai khoi dong (moi loai kin mot trang):
 1. Net thang    -- keo het canh, phat luc tu vai
 2. Ghosting     -- ru tay theo duong truoc, roi ha but
 3. Elip         -- vong tron tu tin, deu nhau
 4. Chuyen do    -- tối sang nhat trong mot dai muot
 5. To deu       -- xam phang, khong lo net</code></pre>
<div class="callout"><span class="badge">Tự tin hơn dè dặt</span> Một nét dứt khoát phát từ vai luôn đẹp hơn nét chậm run rẩy. Ru tay theo chuyển động vài lần, rồi hạ bút một nét.</div>`,
  ]]);

const c1q = quiz('drp101-quiz-1', 'Quiz 1 — Tools &amp; strokes|||Quiz 1 — Dụng cụ &amp; nét', [
  { id: 'q1', question: 'Bút chì loại nào cho nét ĐẬM, mềm, hợp đánh bóng vùng tối?', options: ['2H', '4B', 'H', 'HB'], correctIndex: 1, explanation: '4B thuộc nhóm B (Black/mềm) — đậm, giàu sắc, hợp bóng tối; H/2H cứng và nhạt.' },
  { id: 'q2', question: 'Để kéo một nét dài và thẳng, nên phát lực chủ yếu từ đâu?', options: ['Chỉ các ngón tay', 'Cổ tay bẻ nhanh', 'Vai và khuỷu tay', 'Nghiêng cả người'], correctIndex: 2, explanation: 'Nét dài vẽ từ vai và khuỷu tay mới thẳng và đều; ngón tay chỉ hợp chi tiết nhỏ.' },
  { id: 'q3', question: 'Cách cầm bút "overhand" (cầm ngửa, xa đầu) hợp nhất cho việc gì?', options: ['Chi tiết nhỏ tinh', 'Ký tên', 'Nét quét rộng và đánh bóng mảng lớn', 'Chấm điểm nhỏ'], correctIndex: 2, explanation: 'Cầm ngửa cho nét quét thoải mái và đánh bóng rộng bằng cạnh ruột chì; chi tiết nhỏ thì dùng cầm như viết.' },
]);

const c2 = doc('drp101-2-1-line-geometric-forms', '2.1 — Line &amp; basic geometric forms|||2.1 — Đường nét &amp; khối hình học cơ bản',
  'Nét viền (contour) vs nét dáng (gesture); bốn khối nền tảng: cầu, lập phương, trụ, nón; mọi vật thể quy về tổ hợp khối; khoảng âm (negative space).',
  [[
    `<span class="eyebrow">DRP101 · Chapter 2 · Lesson 2.1</span>
<h2>Line &amp; basic geometric forms</h2>
<h3>Two kinds of line</h3>
<ul>
<li><strong>Gesture line</strong> — a fast, flowing line that captures the <em>movement</em> and overall pose in seconds. Draw it first, loosely.</li>
<li><strong>Contour line</strong> — a slow, careful line that follows an actual edge of the subject. Nicolaides has you draw contours <em>without looking at the paper</em> to bind eye and hand.</li>
</ul>
<h3>The four basic forms</h3>
<p>Almost anything you draw can be built from four solids. Learn to draw and shade these and you can construct any subject:</p>
<pre><code>  SPHERE     CUBE      CYLINDER    CONE
   ( )       [ ]        | |         /\\
 an apple   a box     a can/arm   a nose/hat</code></pre>
<p>A plaster bust is a sphere (cranium) plus a modified box (the face block); an arm is a cylinder; a nose sits on a wedge. This is <strong>constructive drawing</strong> — see the simple solid underneath the complex surface.</p>
<h3>Negative space</h3>
<p>Instead of drawing the object, sometimes draw the <strong>shape of the gap around it</strong> — the triangle of light between an arm and the torso, for example. Betty Edwards uses negative space to defeat the symbol habit: the empty shapes have no name, so you are forced to see them truthfully.</p>
<div class="callout"><span class="badge">Construct, do not trace</span> Beginners outline the silhouette. Instead, block the solid forms first — sphere, box, cylinder — then carve detail into that structure. The drawing will feel three-dimensional, not flat.</div>`,
    `<span class="eyebrow">DRP101 · Chương 2 · Bài 2.1</span>
<h2>Đường nét &amp; khối hình học cơ bản</h2>
<h3>Hai loại nét</h3>
<ul>
<li><strong>Nét dáng (gesture)</strong> — nét nhanh, chảy, bắt lấy <em>chuyển động</em> và dáng tổng thể trong vài giây. Vẽ nó trước, thật lỏng tay.</li>
<li><strong>Nét viền (contour)</strong> — nét chậm, cẩn thận, bám theo một cạnh thật của mẫu. Nicolaides bảo bạn vẽ nét viền <em>không nhìn xuống giấy</em> để buộc mắt và tay ăn khớp.</li>
</ul>
<h3>Bốn khối nền tảng</h3>
<p>Gần như mọi thứ bạn vẽ đều dựng được từ bốn khối. Vẽ và đánh bóng thành thạo bốn khối này thì dựng được mọi vật thể:</p>
<pre><code>  CAU       LAP PHUONG   TRU        NON
  ( )         [ ]        | |        /\\
 qua tao    cai hop    lon/canh tay  mui/non</code></pre>
<p>Một tượng bán thân là hình cầu (hộp sọ) cộng một khối hộp biến đổi (khối mặt); cánh tay là hình trụ; cái mũi ngồi trên một khối nêm. Đây là <strong>vẽ dựng hình</strong> — thấy khối đơn giản nằm dưới bề mặt phức tạp.</p>
<h3>Khoảng âm (negative space)</h3>
<p>Thay vì vẽ vật thể, đôi khi hãy vẽ <strong>hình của khoảng trống quanh nó</strong> — ví dụ mảng sáng hình tam giác giữa cánh tay và thân. Betty Edwards dùng khoảng âm để phá thói vẽ ký hiệu: các mảng trống không có tên, nên bạn buộc phải nhìn chúng đúng thật.</p>
<div class="callout"><span class="badge">Dựng khối, đừng đồ nét</span> Người mới hay đồ theo bóng ngoài (silhouette). Thay vào đó hãy khối hoá trước — cầu, hộp, trụ — rồi khắc chi tiết vào cấu trúc đó. Bài vẽ sẽ có chiều sâu ba chiều, không bị dẹt.</div>`,
  ]]);

const c2q = quiz('drp101-quiz-2', 'Quiz 2 — Line &amp; forms|||Quiz 2 — Nét &amp; khối', [
  { id: 'q1', question: 'Nét dáng (gesture) khác nét viền (contour) chủ yếu ở chỗ?', options: ['Gesture nhanh, bắt chuyển động; contour chậm, bám cạnh thật', 'Gesture đậm hơn', 'Contour luôn cong', 'Không khác gì'], correctIndex: 0, explanation: 'Gesture là nét nhanh bắt dáng/chuyển động; contour là nét chậm theo đúng cạnh của mẫu.' },
  { id: 'q2', question: 'Trong vẽ dựng hình, một tượng bán thân KHỞI ĐẦU nên quy về khối nào?', options: ['Chỉ các đường viền', 'Hình cầu (sọ) + khối hộp (mặt)', 'Nhiều tam giác nhỏ', 'Một hình tròn phẳng'], correctIndex: 1, explanation: 'Dựng hình bắt đầu từ khối đơn giản: hình cầu cho hộp sọ và khối hộp biến đổi cho khối mặt.' },
  { id: 'q3', question: 'Vẽ "khoảng âm" (negative space) giúp ích gì?', options: ['Tô nhanh hơn', 'Buộc mắt thấy hình thật vì mảng trống không có tên/ký hiệu', 'Tiết kiệm chì', 'Làm nét đậm hơn'], correctIndex: 1, explanation: 'Các mảng trống không có tên nên không kích hoạt thói vẽ ký hiệu — bạn buộc phải quan sát đúng hình.' },
]);

const c3 = doc('drp101-3-1-light-shadow-value', '3.1 — Light, shadow &amp; value|||3.1 — Ánh sáng, bóng đổ &amp; sắc độ',
  'Sắc độ (value) là độ sáng-tối; thang sắc độ; năm vùng của khối được chiếu sáng: sáng nhất, chuyển tiếp, bóng khối, phản quang, bóng đổ; ranh giới sáng-tối (terminator).',
  [[
    `<span class="eyebrow">DRP101 · Chapter 3 · Lesson 3.1</span>
<h2>Light, shadow &amp; value</h2>
<h3>Value is everything</h3>
<p><strong>Value</strong> is how light or dark a tone is, independent of colour. In graphite, value <em>is</em> the whole language — it is what makes a flat circle read as a round sphere. Train it with a <strong>value scale</strong>: a strip from white to black in even steps.</p>
<pre><code>Value scale (9 steps):
[  0 ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ]
white  light      mid grey       dark   black
Squint at your subject to collapse detail into these bands.</code></pre>
<h3>The five zones on a lit sphere</h3>
<p>Light one simple form and you always see the same anatomy of light:</p>
<ol>
<li><strong>Highlight</strong> — the brightest spot, where light hits most directly.</li>
<li><strong>Halftone</strong> — the mid values turning away from the light.</li>
<li><strong>Core shadow (terminator)</strong> — the darkest band, the edge where light stops.</li>
<li><strong>Reflected light</strong> — a faint glow inside the shadow, bounced from the surroundings. Keep it darker than any halftone.</li>
<li><strong>Cast shadow</strong> — the shadow the object throws onto the surface; darkest and crispest right at its base.</li>
</ol>
<h3>The golden rule of reflected light</h3>
<p>Beginners make reflected light too bright and the form goes flat. <strong>Everything in shadow stays in shadow</strong> — reflected light is a lighter shadow, never as light as the lit side.</p>
<div class="callout"><span class="badge">Squint</span> Narrowing your eyes drops out detail and colour and shows you the big value shapes. If two areas look the same value when squinting, draw them the same value.</div>`,
    `<span class="eyebrow">DRP101 · Chương 3 · Bài 3.1</span>
<h2>Ánh sáng, bóng đổ &amp; sắc độ</h2>
<h3>Sắc độ là tất cả</h3>
<p><strong>Sắc độ (value)</strong> là độ sáng hay tối của một tông, không phụ thuộc màu. Với chì, sắc độ <em>chính là</em> cả ngôn ngữ — nó biến một vòng tròn dẹt thành khối cầu tròn. Luyện bằng <strong>thang sắc độ</strong>: một dải từ trắng đến đen theo các bước đều.</p>
<pre><code>Thang sac do (9 buoc):
[  0 ][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ]
trang  nhat      xam giua       tối   den
Nheo mat vao mau de gom chi tiet ve cac dai nay.</code></pre>
<h3>Năm vùng trên khối cầu được chiếu sáng</h3>
<p>Chiếu sáng một khối đơn giản, bạn luôn thấy cùng một cấu trúc ánh sáng:</p>
<ol>
<li><strong>Sáng nhất (highlight)</strong> — điểm sáng nhất, nơi ánh sáng đập trực diện.</li>
<li><strong>Chuyển tiếp (halftone)</strong> — vùng trung độ đang xoay khỏi ánh sáng.</li>
<li><strong>Bóng khối (ranh giới, terminator)</strong> — dải tối nhất, nơi ánh sáng dừng lại.</li>
<li><strong>Phản quang</strong> — chút sáng mờ trong vùng tối, dội lại từ xung quanh. Phải giữ tối hơn mọi vùng chuyển tiếp.</li>
<li><strong>Bóng đổ</strong> — bóng vật hắt lên mặt nền; tối nhất và sắc nhất ngay chân vật.</li>
</ol>
<h3>Quy tắc vàng của phản quang</h3>
<p>Người mới hay để phản quang quá sáng khiến khối bị bẹt. <strong>Cái gì trong tối thì vẫn thuộc vùng tối</strong> — phản quang chỉ là bóng nhạt hơn, không bao giờ sáng bằng mặt được chiếu.</p>
<div class="callout"><span class="badge">Nheo mắt</span> Nheo mắt làm rụng chi tiết và màu, để lộ các mảng sắc độ lớn. Nếu hai vùng nhìn cùng sắc độ khi nheo mắt thì vẽ chúng cùng một sắc độ.</div>`,
  ]]);

const c3q = quiz('drp101-quiz-3', 'Quiz 3 — Value &amp; light|||Quiz 3 — Sắc độ &amp; ánh sáng', [
  { id: 'q1', question: '"Sắc độ" (value) trong vẽ chì nghĩa là gì?', options: ['Màu sắc của vật', 'Độ sáng-tối của một tông, không phụ thuộc màu', 'Độ nhám của giấy', 'Kích thước nét'], correctIndex: 1, explanation: 'Value là độ sáng hay tối của tông, tách khỏi màu — với chì đây là cả ngôn ngữ thể hiện khối.' },
  { id: 'q2', question: 'Trên khối cầu được chiếu sáng, vùng TỐI NHẤT của bản thân khối là?', options: ['Phản quang', 'Highlight', 'Bóng khối / ranh giới sáng-tối (terminator)', 'Halftone'], correctIndex: 2, explanation: 'Bóng khối (terminator) là dải tối nhất trên khối, nơi ánh sáng dừng; phản quang trong tối phải nhạt hơn nó.' },
  { id: 'q3', question: 'Vì sao phản quang KHÔNG được vẽ quá sáng?', options: ['Vì tốn chì', 'Vì nó luôn nằm trong vùng tối nên phải tối hơn mọi vùng chuyển tiếp', 'Vì giấy không chịu được', 'Vì nó nằm ở bóng đổ'], correctIndex: 1, explanation: 'Nguyên tắc: cái gì trong tối thì vẫn thuộc vùng tối — phản quang chỉ là bóng nhạt hơn, không sáng bằng mặt được chiếu, nếu không khối sẽ bẹt.' },
]);

const c4 = doc('drp101-4-1-perspective-construction', '4.1 — Perspective &amp; constructing forms|||4.1 — Phối cảnh &amp; dựng hình khối',
  'Đường chân trời (horizon) và điểm tụ (vanishing point); phối cảnh 1, 2, 3 điểm tụ; foreshortening (rút gọn theo chiều sâu); dựng khối trong không gian.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 4 · Lesson 4.1</span>
<h2>Perspective &amp; constructing forms</h2>
<h3>Why perspective matters</h3>
<p>Perspective is the system that makes a flat page read as deep space. Two ideas do most of the work: the <strong>horizon line</strong> (your eye level) and <strong>vanishing points</strong> (where parallel edges appear to meet).</p>
<pre><code>1-point:  edges recede to ONE point on the horizon
          (looking straight down a corridor)
2-point:  a box seen at an angle -> TWO vanishing points
3-point:  add a point above/below for tall or worm/bird views</code></pre>
<h3>Horizon = eye level</h3>
<p>The horizon line is always at your eye level. Objects <em>above</em> it you see from below; objects <em>below</em> it you see from above. Move your viewpoint and every vanishing relationship changes — which is why you fix your position before drawing a cast.</p>
<h3>Foreshortening</h3>
<p><strong>Foreshortening</strong> is perspective applied to a single form pointing toward you: a cylinder aimed at the viewer looks short and its far end reads as an ellipse, not a circle. Trust the shortened shape you actually see over the length you know is there.</p>
<h3>Construct in space</h3>
<p>Build the basic solids <em>on</em> the perspective grid: a cube in two-point perspective, a cylinder as two ellipses joined by verticals. Getting the box right first means the cast that sits inside it will also sit correctly in space.</p>
<div class="callout"><span class="badge">Ellipses, not circles</span> A circle seen at any angle other than face-on is an ellipse. The rounder the ellipse, the more you are looking down onto the surface; a thin ellipse means you are near its edge.</div>`,
    `<span class="eyebrow">DRP101 · Chương 4 · Bài 4.1</span>
<h2>Phối cảnh &amp; dựng hình khối</h2>
<h3>Vì sao cần phối cảnh</h3>
<p>Phối cảnh là hệ thống khiến trang giấy phẳng đọc thành không gian sâu. Hai ý làm phần lớn công việc: <strong>đường chân trời</strong> (tầm mắt của bạn) và <strong>điểm tụ</strong> (nơi các cạnh song song có vẻ gặp nhau).</p>
<pre><code>1 diem tu: cac canh lui ve MOT diem tren chan troi
           (nhin thang doc hanh lang)
2 diem tu: cai hop nhin cheo -> HAI diem tu
3 diem tu: them 1 diem tren/duoi cho vat cao hoac goc nhin tu duoi/tren</code></pre>
<h3>Chân trời = tầm mắt</h3>
<p>Đường chân trời luôn nằm ở tầm mắt bạn. Vật <em>trên</em> chân trời thì bạn nhìn từ dưới lên; vật <em>dưới</em> chân trời thì nhìn từ trên xuống. Đổi chỗ ngồi là mọi quan hệ điểm tụ đổi theo — vì thế phải cố định vị trí trước khi vẽ tượng.</p>
<h3>Rút gọn theo chiều sâu (foreshortening)</h3>
<p><strong>Foreshortening</strong> là phối cảnh áp lên một khối đơn chĩa về phía bạn: một hình trụ hướng vào người xem trông ngắn lại và đầu xa hiện thành hình elip chứ không phải hình tròn. Hãy tin cái hình bị rút ngắn bạn thật sự thấy hơn là chiều dài bạn biết là có.</p>
<h3>Dựng khối trong không gian</h3>
<p>Dựng các khối cơ bản <em>trên</em> lưới phối cảnh: một khối lập phương trong phối cảnh hai điểm tụ, một hình trụ là hai elip nối bằng đường thẳng đứng. Dựng đúng cái hộp trước nghĩa là tượng nằm trong hộp đó cũng sẽ đặt đúng trong không gian.</p>
<div class="callout"><span class="badge">Elip, không phải tròn</span> Một hình tròn nhìn ở góc bất kỳ khác chính diện đều là elip. Elip càng tròn nghĩa bạn càng nhìn từ trên xuống mặt phẳng đó; elip càng dẹt nghĩa bạn đang ở gần cạnh của nó.</div>`,
  ]]);

const c4q = quiz('drp101-quiz-4', 'Quiz 4 — Perspective|||Quiz 4 — Phối cảnh', [
  { id: 'q1', question: 'Đường chân trời (horizon line) trong phối cảnh trùng với?', options: ['Đỉnh vật thể', 'Tầm mắt của người vẽ', 'Đáy trang giấy', 'Nguồn sáng'], correctIndex: 1, explanation: 'Đường chân trời luôn nằm ngang tầm mắt; vật trên nó nhìn từ dưới, vật dưới nó nhìn từ trên.' },
  { id: 'q2', question: 'Một cái hộp nhìn chéo góc thường cần bao nhiêu điểm tụ?', options: ['1 điểm tụ', '2 điểm tụ', '0 điểm tụ', '5 điểm tụ'], correctIndex: 1, explanation: 'Hộp nhìn chéo dùng phối cảnh 2 điểm tụ; 1 điểm tụ dành cho khi nhìn thẳng diện, 3 điểm tụ khi có cả chiều cao.' },
  { id: 'q3', question: 'Một hình tròn (như miệng lon) nhìn ở góc nghiêng sẽ hiện thành?', options: ['Hình vuông', 'Hình elip', 'Hình tam giác', 'Vẫn tròn hoàn hảo'], correctIndex: 1, explanation: 'Hình tròn nhìn ở góc khác chính diện luôn thành elip; elip càng dẹt khi ta càng nhìn gần cạnh của nó.' },
]);

const c5 = doc('drp101-5-1-plaster-cast-blockin', '5.1 — Drawing plaster casts: block-in &amp; proportion|||5.1 — Vẽ tượng thạch cao: block-in &amp; dựng tỉ lệ',
  'Vì sao vẽ tượng trắng (chỉ có sắc độ, không màu); quy trình block-in; đo tỉ lệ bằng bút chì (sight-size); dựng trục và các mốc trước khi đánh bóng.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 5 · Lesson 5.1</span>
<h2>Drawing plaster casts: block-in &amp; proportion</h2>
<h3>Why a white cast</h3>
<p>A plaster cast is white and matte, so there is <strong>no colour to distract you</strong> — only form and value under a single light. It is the ideal bridge between simple solids and the living head: complex anatomy, but held perfectly still.</p>
<h3>The block-in process</h3>
<pre><code>Block-in, step by step:
 1. Envelope   -- the big overall shape as straight lines
 2. Plumb/axis -- a vertical &amp; the main tilt/axis
 3. Landmarks  -- top of head, brow, nose base, chin
 4. Big planes -- break the mass into flat facets
 5. Check      -- compare angles &amp; proportions, correct
 6. THEN value -- only now start shading
Work big to small. Do not finish one eye while the skull is still wrong.</code></pre>
<h3>Measuring: the pencil method</h3>
<p>Hold the pencil at arm length, lock your elbow, and use the tip-to-thumb length as a <strong>unit</strong> — often the length of the head or the nose. Then ask: how many units wide is the base? Where does the chin fall relative to the ear? This is <strong>sight-size</strong> comparison, the core discipline of cast drawing.</p>
<h3>Angles &amp; plumb lines</h3>
<p>Check every edge against true vertical and horizontal: tilt the pencil to match the slope you see, then transfer that same angle to paper. A dropped <strong>plumb line</strong> tells you what sits directly above what.</p>
<div class="callout"><span class="badge">Proportion before polish</span> A cast drawing lives or dies on the block-in. Spend most of your time getting the big shapes and measurements right — rendering a wrong drawing beautifully still leaves it wrong.</div>`,
    `<span class="eyebrow">DRP101 · Chương 5 · Bài 5.1</span>
<h2>Vẽ tượng thạch cao: block-in &amp; dựng tỉ lệ</h2>
<h3>Vì sao vẽ tượng trắng</h3>
<p>Tượng thạch cao trắng và mờ (không bóng), nên <strong>không có màu làm phân tâm</strong> — chỉ còn khối và sắc độ dưới một nguồn sáng. Đây là cầu nối lý tưởng giữa khối đơn giản và đầu người thật: giải phẫu phức tạp nhưng đứng im tuyệt đối.</p>
<h3>Quy trình block-in</h3>
<pre><code>Block-in, tung buoc:
 1. Bao khoi  -- hinh tong the lon bang cac net thang
 2. Truc/doi  -- mot duong thang dung &amp; do nghieng chinh
 3. Cac moc   -- dinh dau, chan may, chan mui, cam
 4. Mang lon  -- chia khoi thanh cac mat phang
 5. Kiem tra  -- so goc &amp; ti le, sua lai
 6. ROI moi len bong -- gio moi bat dau danh bong
Lam tu lon toi nho. Dung ve xong mot con mat khi hop so con sai.</code></pre>
<h3>Đo tỉ lệ: phương pháp bút chì</h3>
<p>Giơ bút chì thẳng tay, khoá khuỷu, lấy đoạn từ đầu bút đến ngón cái làm <strong>đơn vị</strong> — thường là chiều dài đầu hoặc mũi. Rồi hỏi: đáy rộng bằng mấy đơn vị? Cằm rơi vào đâu so với tai? Đây là so sánh <strong>sight-size</strong>, kỷ luật cốt lõi của vẽ tượng.</p>
<h3>Góc &amp; đường dọi</h3>
<p>Kiểm mọi cạnh so với phương thẳng đứng và ngang thật: nghiêng bút chì cho khớp độ dốc bạn thấy, rồi chuyển đúng góc đó lên giấy. Một <strong>đường dọi (plumb)</strong> thả thẳng cho biết cái gì nằm ngay trên cái gì.</p>
<div class="callout"><span class="badge">Tỉ lệ trước, chau chuốt sau</span> Bài tượng sống hay chết là ở khâu block-in. Dành phần lớn thời gian dựng đúng hình lớn và số đo — đánh bóng đẹp một bài sai tỉ lệ thì nó vẫn sai.</div>`,
  ]]);

const c5q = quiz('drp101-quiz-5', 'Quiz 5 — Plaster cast|||Quiz 5 — Tượng thạch cao', [
  { id: 'q1', question: 'Vì sao tượng thạch cao TRẮNG là mẫu lý tưởng để luyện?', options: ['Vì rẻ tiền', 'Vì không có màu làm phân tâm, chỉ còn khối và sắc độ', 'Vì nhỏ gọn', 'Vì tự phát sáng'], correctIndex: 1, explanation: 'Bề mặt trắng mờ loại bỏ màu, để người vẽ tập trung hoàn toàn vào khối và sắc độ dưới một nguồn sáng.' },
  { id: 'q2', question: 'Trong quy trình block-in, việc đánh bóng (lên sắc độ) nên làm khi nào?', options: ['Ngay từ nét đầu tiên', 'Sau khi đã dựng đúng bao khối, trục, mốc và tỉ lệ', 'Song song lúc vẽ contour', 'Không bao giờ'], correctIndex: 1, explanation: 'Quy trình đi từ lớn tới nhỏ: bao khối → trục → mốc → mảng lớn → kiểm tra tỉ lệ, RỒI mới đánh bóng.' },
  { id: 'q3', question: 'Phương pháp "đo bằng bút chì" (sight-size) hoạt động thế nào?', options: ['Đặt bút lên tượng để đo trực tiếp', 'Giơ bút thẳng tay, khoá khuỷu, lấy đoạn đầu bút–ngón cái làm đơn vị để so tỉ lệ', 'Đếm số nét đã vẽ', 'Dùng thước kẻ áp lên giấy'], correctIndex: 1, explanation: 'Giơ bút thẳng tay và khoá khuỷu để đơn vị đo ổn định, rồi so các kích thước của mẫu theo đơn vị đó (thường là chiều dài đầu hoặc mũi).' },
]);

const c6 = doc('drp101-6-1-head-anatomy-proportion', '6.1 — Head anatomy &amp; face proportion|||6.1 — Giải phẫu đầu người &amp; tỉ lệ khuôn mặt',
  'Phương pháp Loomis (khối cầu + mặt phẳng); tỉ lệ khuôn mặt: mắt ở giữa đầu, luật chia ba, khoảng cách mắt bằng một mắt; đường trục dọc & ngang.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 6 · Lesson 6.1</span>
<h2>Head anatomy &amp; face proportion</h2>
<h3>The Loomis method</h3>
<p>Andrew Loomis builds the head as a <strong>ball with the sides sliced flat</strong>. The ball is the cranium; a slice on each side lets you attach the jaw and place the ear. Onto that ball you draw the centre line and the brow line, which carry the tilt and turn of the whole head. Get this construction right and every feature has a home.</p>
<h3>Proportions of the front-view face</h3>
<pre><code>Vertical thirds (hairline to chin):
  hairline ----- brow      (forehead)
  brow ----- base of nose  (1/3)
  nose ----- chin          (1/3)
Key rules:
  * eyes sit at the HALFWAY line of the whole head
  * the face is about FIVE eyes wide
  * the gap between the eyes = ONE eye
  * base of nose to chin: the mouth sits about 1/3 down</code></pre>
<h3>Centre &amp; brow lines</h3>
<p>The <strong>centre line</strong> runs down the middle of the face and curves with the turn of the head; features are placed symmetrically across it. The <strong>brow line</strong> crosses it and tilts with the head. These two lines are the scaffold that keeps the eyes level and the nose centred when the head turns.</p>
<div class="callout"><span class="badge">These are starting points</span> Proportion rules describe an average adult. Real people vary — measure your actual model and adjust. The rules tell you when something looks off; your eyes tell you the truth of this face.</div>`,
    `<span class="eyebrow">DRP101 · Chương 6 · Bài 6.1</span>
<h2>Giải phẫu đầu người &amp; tỉ lệ khuôn mặt</h2>
<h3>Phương pháp Loomis</h3>
<p>Andrew Loomis dựng đầu như một <strong>quả cầu bị cắt phẳng hai bên</strong>. Quả cầu là hộp sọ; mỗi bên cắt một lát để gắn hàm và đặt tai. Trên quả cầu đó bạn vẽ đường trục dọc và đường chân mày, hai đường mang độ nghiêng và độ xoay của cả đầu. Dựng đúng cấu trúc này thì mọi ngũ quan đều có chỗ đứng.</p>
<h3>Tỉ lệ mặt nhìn chính diện</h3>
<pre><code>Chia ba theo chieu doc (chan toc den cam):
  chan toc ----- chan may   (tran)
  chan may ----- chan mui   (1/3)
  chan mui ----- cam        (1/3)
Quy tac chinh:
  * mat nam o duong GIUA cua toan bo dau
  * mat rong khoang NAM con mat
  * khoang cach giua hai mat = MOT con mat
  * chan mui den cam: mieng nam khoang 1/3 tinh tu tren</code></pre>
<h3>Đường trục &amp; đường chân mày</h3>
<p><strong>Đường trục dọc</strong> chạy giữa mặt và cong theo độ xoay của đầu; ngũ quan đặt đối xứng qua nó. <strong>Đường chân mày</strong> cắt ngang nó và nghiêng theo đầu. Hai đường này là bộ khung giữ cho mắt ngang bằng và mũi nằm giữa khi đầu xoay.</p>
<div class="callout"><span class="badge">Đây chỉ là điểm khởi đầu</span> Quy tắc tỉ lệ mô tả một người lớn trung bình. Người thật thì khác nhau — hãy đo chính mẫu của bạn và điều chỉnh. Quy tắc cho biết khi nào có gì đó sai; đôi mắt bạn mới nói lên sự thật của khuôn mặt này.</div>`,
  ]]);

const c6q = quiz('drp101-quiz-6', 'Quiz 6 — Head &amp; proportion|||Quiz 6 — Đầu &amp; tỉ lệ', [
  { id: 'q1', question: 'Theo tỉ lệ khuôn mặt chuẩn, đôi mắt nằm ở đâu trên toàn bộ đầu?', options: ['Ở 1/3 trên', 'Ở đường giữa (một nửa) của đầu', 'Sát chân tóc', 'Ngay trên cằm'], correctIndex: 1, explanation: 'Người mới hay đặt mắt quá cao; thực tế mắt nằm ở khoảng giữa chiều cao đầu (từ đỉnh đầu tới cằm).' },
  { id: 'q2', question: 'Phương pháp Loomis dựng hộp sọ khởi đầu bằng khối gì?', options: ['Khối lập phương', 'Quả cầu bị cắt phẳng hai bên', 'Hình nón', 'Hình trụ dài'], correctIndex: 1, explanation: 'Loomis dùng một quả cầu cắt phẳng hai bên làm hộp sọ, rồi gắn khối hàm và đặt tai.' },
  { id: 'q3', question: 'Khoảng cách giữa hai mắt (nhìn chính diện) xấp xỉ bằng?', options: ['Nửa con mắt', 'Một con mắt', 'Hai con mắt', 'Bằng chiều rộng cả khuôn mặt'], correctIndex: 1, explanation: 'Quy tắc trung bình: khoảng giữa hai mắt bằng đúng một con mắt, và khuôn mặt rộng khoảng năm con mắt.' },
]);

const c7 = doc('drp101-7-1-portrait-features', '7.1 — Portrait: eyes, nose, mouth &amp; ears|||7.1 — Chân dung: mắt, mũi, miệng &amp; tai',
  'Vẽ từng ngũ quan như khối 3D chứ không phải ký hiệu: mắt là quả cầu dưới mí, mũi là khối nêm, miệng bám trụ răng, tai theo tỉ lệ và vị trí; ánh mắt & chất da.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 7 · Lesson 7.1</span>
<h2>Portrait: eyes, nose, mouth &amp; ears</h2>
<p>Each feature is a <strong>three-dimensional form</strong>, not a flat symbol. Draw the structure, then the surface.</p>
<h3>Eyes</h3>
<p>The eye is a <strong>sphere</strong> sitting in a socket; the lids are curved bands wrapping over that ball, so they have thickness. The upper lid casts a small shadow on the eyeball, and the iris is partly hidden under it. Both eyes share one curved axis — they turn together.</p>
<h3>Nose</h3>
<p>Think of the nose as a <strong>wedge or box</strong>: a top plane, two sides and an under-plane holding the ball of the tip and two wings (nostrils). Most of a nose is drawn with value on those planes, with very little outline.</p>
<h3>Mouth</h3>
<p>The lips wrap around the <strong>cylinder of the teeth/jaw</strong>, so they curve in space, not flat across. The line between the lips is the darkest and most defined; the lip edges themselves are soft. The upper lip usually reads a little darker (it faces away from the light).</p>
<h3>Ears</h3>
<p>The ear sits between the <strong>brow line and the base of the nose</strong> in a front-neutral view, tilted back roughly along the jaw angle. Its shape is a rough letter shape with an inner bowl; build the big shape before the cartilage folds.</p>
<div class="callout"><span class="badge">Form, then detail</span> Eyelashes and nostril outlines come last and lightly. If you draw features as line-symbols first, no amount of detail will make them sit in the head. Block the form, shade the planes, then add the few sharp accents.</div>`,
    `<span class="eyebrow">DRP101 · Chương 7 · Bài 7.1</span>
<h2>Chân dung: mắt, mũi, miệng &amp; tai</h2>
<p>Mỗi ngũ quan là một <strong>khối ba chiều</strong>, không phải ký hiệu phẳng. Vẽ cấu trúc trước, rồi mới đến bề mặt.</p>
<h3>Mắt</h3>
<p>Mắt là một <strong>quả cầu</strong> nằm trong hốc; mí là những dải cong bao lên quả cầu đó nên có bề dày. Mí trên hắt một bóng nhỏ xuống nhãn cầu, và mống mắt bị mí che một phần. Hai mắt cùng chung một trục cong — chúng xoay cùng nhau.</p>
<h3>Mũi</h3>
<p>Hình dung mũi như một <strong>khối nêm hoặc khối hộp</strong>: một mặt trên, hai mặt bên và một mặt dưới giữ đầu mũi và hai cánh mũi. Phần lớn cái mũi được vẽ bằng sắc độ trên các mặt đó, rất ít đường viền.</p>
<h3>Miệng</h3>
<p>Đôi môi bao quanh <strong>khối trụ của hàm răng</strong> nên cong trong không gian chứ không phẳng ngang. Đường khép giữa hai môi là chỗ tối và rõ nhất; còn mép môi thì mềm. Môi trên thường hơi tối hơn (vì xoay khỏi ánh sáng).</p>
<h3>Tai</h3>
<p>Tai nằm giữa <strong>đường chân mày và chân mũi</strong> ở góc nhìn trung tính, hơi ngả về sau theo góc hàm. Hình tai đại thể như một chữ cái có cái vành lõm bên trong; dựng hình lớn trước rồi mới đến các nếp sụn.</p>
<div class="callout"><span class="badge">Khối trước, chi tiết sau</span> Lông mi và viền lỗ mũi làm cuối cùng và thật nhẹ. Nếu vẽ ngũ quan thành ký hiệu-nét trước thì thêm bao nhiêu chi tiết cũng không đặt được vào đầu. Khối hoá, đánh bóng các mặt, rồi mới thêm vài nhấn sắc.</div>`,
  ]]);

const c7q = quiz('drp101-quiz-7', 'Quiz 7 — Portrait features|||Quiz 7 — Ngũ quan chân dung', [
  { id: 'q1', question: 'Nên hình dung con mắt như khối gì để vẽ đúng?', options: ['Một hình bầu dục phẳng', 'Một quả cầu nằm trong hốc, có mí bao lên', 'Hai đường cong', 'Một hình tam giác'], correctIndex: 1, explanation: 'Mắt là quả cầu trong hốc; mí là dải cong bao lên quả cầu và có bề dày, mí trên hắt bóng nhỏ lên nhãn cầu.' },
  { id: 'q2', question: 'Cái mũi chủ yếu nên được thể hiện bằng?', options: ['Đường viền đậm', 'Sắc độ trên các mặt của khối nêm/hộp', 'Một vòng tròn', 'Chỉ hai lỗ mũi'], correctIndex: 1, explanation: 'Mũi là khối nêm/hộp với mặt trên, hai mặt bên và mặt dưới; phần lớn vẽ bằng sắc độ trên các mặt, rất ít viền.' },
  { id: 'q3', question: 'Vì sao đôi môi phải vẽ CONG chứ không phẳng ngang?', options: ['Vì môi luôn cười', 'Vì môi bao quanh khối trụ của hàm răng', 'Vì giấy cong', 'Vì ánh sáng từ trên'], correctIndex: 1, explanation: 'Môi bám quanh khối trụ của cung răng/hàm nên cong trong không gian; đường khép giữa hai môi là chỗ tối và rõ nhất.' },
]);

const c8 = doc('drp101-8-1-shading-materials-composition', '8.1 — Shading, materials &amp; composition|||8.1 — Đánh bóng, chất liệu &amp; bố cục',
  'Kỹ thuật đánh bóng: hatching, cross-hatching, di chì, blending; tạo chất (thạch cao mờ vs da); cạnh cứng-mềm; bố cục & khung hình; kiểm tra hoàn thiện.',
  [[
    `<span class="eyebrow">DRP101 · Chapter 8 · Lesson 8.1</span>
<h2>Shading, materials &amp; composition</h2>
<h3>Shading techniques</h3>
<ul>
<li><strong>Hatching</strong> — parallel lines; closer together = darker.</li>
<li><strong>Cross-hatching</strong> — a second layer crossing the first, for deeper, richer darks.</li>
<li><strong>Blending</strong> — a stump or tissue smooths tone into gradients (good for plaster and skin, but overusing it kills form).</li>
<li><strong>Contour shading</strong> — strokes that follow the surface, describing its curve as they tone it.</li>
</ul>
<h3>Edges tell the material</h3>
<p>Vary your edges: a <strong>hard edge</strong> reads as a sharp corner or a form turning quickly; a <strong>soft edge</strong> reads as a gentle round turn. Uniform hard edges make everything look cut from tin. Matte plaster has softer core shadows than a shiny surface; skin is softer still.</p>
<h3>Composition &amp; framing</h3>
<pre><code>Finishing checklist:
 [ ] subject placed with breathing room, not cramped or dead-centre
 [ ] full value range present -- a true black AND a clean white
 [ ] one clear focus (usually sharpest edges + strongest contrast)
 [ ] cast shadow anchors the object to the ground
 [ ] step back / mirror-check -- proportions still read?</code></pre>
<h3>Materials</h3>
<p>Reserve your softest, darkest pencils (3B–6B) for the final accents, keep highlights as untouched paper, and lift small lights with a kneaded eraser. Spray or cover finished graphite so it does not smudge.</p>
<div class="callout"><span class="badge">Step back often</span> Errors hide up close. Every few minutes stand back, or look at the drawing in a mirror — the flipped image exposes proportion mistakes your eye had learned to forgive.</div>`,
    `<span class="eyebrow">DRP101 · Chương 8 · Bài 8.1</span>
<h2>Đánh bóng, chất liệu &amp; bố cục</h2>
<h3>Kỹ thuật đánh bóng</h3>
<ul>
<li><strong>Hatching (nét song song)</strong> — các nét song song; càng khít càng tối.</li>
<li><strong>Cross-hatching (nét đan chéo)</strong> — lớp thứ hai cắt chéo lớp đầu, cho vùng tối sâu và giàu hơn.</li>
<li><strong>Di chì (blending)</strong> — dùng cây di hoặc giấy làm mượt tông thành chuyển sắc (hợp với thạch cao và da, nhưng lạm dụng sẽ làm mất khối).</li>
<li><strong>Đánh bóng theo khối (contour)</strong> — nét chạy theo bề mặt, vừa tô vừa mô tả độ cong của mặt.</li>
</ul>
<h3>Cạnh nói lên chất liệu</h3>
<p>Hãy biến hoá cạnh: <strong>cạnh cứng</strong> đọc thành góc sắc hoặc khối xoay nhanh; <strong>cạnh mềm</strong> đọc thành mặt cong dịu. Cạnh cứng đều đều làm mọi thứ trông như cắt từ tôn. Thạch cao mờ có bóng khối mềm hơn bề mặt bóng; da thì còn mềm hơn nữa.</p>
<h3>Bố cục &amp; khung hình</h3>
<pre><code>Bang kiem hoan thien:
 [ ] vat dat co khoang tho, khong chat cung khong dinh chinh giua
 [ ] du dai sac do -- co mot vung den that VA mot vung trang sach
 [ ] mot trong tam ro (thuong la canh sac nhat + tuong phan manh nhat)
 [ ] bong do neo vat vao mat nen
 [ ] lui lai / soi guong -- ti le con dung khong?</code></pre>
<h3>Chất liệu</h3>
<p>Dành các bút mềm và tối nhất (3B–6B) cho những nhấn cuối, giữ vùng sáng nhất là giấy chưa đụng tới, và nhấc các đốm sáng nhỏ bằng tẩy dẻo. Xịt keo hoặc phủ bài chì đã xong để không bị nhoè.</p>
<div class="callout"><span class="badge">Lùi lại thường xuyên</span> Lỗi ẩn mình khi nhìn gần. Cứ vài phút hãy đứng lùi, hoặc soi bài qua gương — ảnh lật ngược phơi bày những lỗi tỉ lệ mà mắt bạn đã quen tha thứ.</div>`,
  ]]);

const c8q = quiz('drp101-quiz-8', 'Quiz 8 — Shading &amp; composition|||Quiz 8 — Đánh bóng &amp; bố cục', [
  { id: 'q1', question: 'Kỹ thuật "cross-hatching" là gì?', options: ['Di chì cho mượt', 'Đan chéo lớp nét thứ hai lên lớp đầu để vùng tối sâu hơn', 'Tẩy tạo sáng', 'Vẽ nét cong theo khối'], correctIndex: 1, explanation: 'Cross-hatching là chồng một lớp nét cắt chéo lên lớp hatching đầu, làm vùng tối đậm và giàu hơn.' },
  { id: 'q2', question: 'Vì sao KHÔNG nên để mọi cạnh trong bài đều cứng như nhau?', options: ['Vì tốn thời gian', 'Vì cạnh cứng đều làm vật trông như cắt từ tôn, mất cảm giác chất liệu và khối cong', 'Vì hết chì', 'Vì cạnh cứng luôn sai'], correctIndex: 1, explanation: 'Biến hoá cạnh cứng-mềm mới tả được chất liệu và độ cong; cạnh cứng đồng loạt khiến mọi thứ trông kim loại, dẹt.' },
  { id: 'q3', question: 'Mẹo nào giúp phát hiện lỗi tỉ lệ mà mắt đã quen bỏ qua?', options: ['Vẽ nhanh hơn', 'Đứng lùi lại hoặc soi bài qua gương (ảnh lật)', 'Tô đậm hơn', 'Dùng bút cứng hơn'], correctIndex: 1, explanation: 'Đứng lùi hoặc soi gương cho ảnh lật ngược, phơi bày những lệch tỉ lệ mà mắt đã quen nhìn và tha thứ.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'DRP101',
    slug: 'drp101-drawing-plaster-statue-portrait',
    title: 'Drawing - Plaster Statue, Portrait',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DRP101.webp',
    shortDescription: 'Learn to draw by hand — tools & grip, line & geometric forms, light/shadow & value, perspective, plaster-cast drawing, head anatomy & face proportion, portrait features, shading & composition. Bilingual, with step-by-step process & quizzes.|||Học vẽ tay — dụng cụ & cầm bút, đường nét & khối hình học, sáng/tối & sắc độ, phối cảnh, vẽ tượng thạch cao, giải phẫu đầu & tỉ lệ mặt, chân dung, đánh bóng & bố cục. Song ngữ, có quy trình từng bước & quiz.',
    description: 'Môn <strong>DRP101 — Drawing - Plaster Statue, Portrait</strong> (Hình hoạ - Tượng thạch cao, Chân dung, ngành Thiết kế mỹ thuật số, kỳ 1) dạy <strong>vẽ quan sát bằng chì</strong>. Từ <strong>dụng cụ &amp; nét cơ bản</strong> → <strong>đường nét &amp; khối hình học</strong> (cầu, hộp, trụ, nón) → <strong>ánh sáng, bóng đổ &amp; sắc độ</strong> → <strong>phối cảnh &amp; dựng hình</strong> → <strong>vẽ tượng thạch cao</strong> (block-in, đo tỉ lệ) → <strong>giải phẫu đầu &amp; tỉ lệ mặt</strong> (phương pháp Loomis) → <strong>ngũ quan chân dung</strong> → <strong>đánh bóng, chất liệu &amp; bố cục</strong>. Bám các sách kinh điển (Loomis, Bridgman, Betty Edwards, Nicolaides), song ngữ, có quy trình từng bước và quiz mỗi chương.',
    whatYouLearn: 'Cầm bút &amp; làm chủ nét; bốn khối cơ bản và vẽ dựng hình; nét viền &amp; nét dáng, khoảng âm; thang sắc độ và năm vùng ánh sáng (sáng, chuyển tiếp, bóng khối, phản quang, bóng đổ); phối cảnh 1/2/3 điểm tụ &amp; foreshortening; block-in và đo tỉ lệ tượng thạch cao (sight-size); phương pháp đầu Loomis &amp; tỉ lệ khuôn mặt; vẽ mắt, mũi, miệng, tai như khối 3D; kỹ thuật đánh bóng (hatching, cross-hatching, di chì), cạnh cứng-mềm và bố cục.',
    requirements: 'Không cần kinh nghiệm vẽ. Chuẩn bị bút chì graphite dải 2H–6B, tẩy dẻo, cây di chì, giấy vẽ mịn; nếu có, một tượng thạch cao (hoặc khối trắng) và một nguồn sáng mạnh duy nhất để tạo bóng rõ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vẽ là kỹ năng nhìn; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Dụng cụ & nét|||Chapter 1 — Tools & strokes', description: 'Thang chì, tư thế, cầm bút, luyện nét.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nét & khối hình học|||Chapter 2 — Line & forms', description: 'Gesture/contour, bốn khối, khoảng âm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ánh sáng & sắc độ|||Chapter 3 — Light & value', description: 'Thang sắc độ, năm vùng ánh sáng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phối cảnh & dựng hình|||Chapter 4 — Perspective', description: 'Chân trời, điểm tụ, foreshortening.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tượng thạch cao|||Chapter 5 — Plaster cast', description: 'Block-in, đo tỉ lệ, sight-size.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giải phẫu đầu & tỉ lệ|||Chapter 6 — Head & proportion', description: 'Loomis, tỉ lệ khuôn mặt, trục.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ngũ quan chân dung|||Chapter 7 — Portrait features', description: 'Mắt, mũi, miệng, tai như khối 3D.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh bóng & bố cục|||Chapter 8 — Shading & composition', description: 'Hatching, cạnh cứng-mềm, bố cục.', lessons: [c8, c8q] },
  ],
};
