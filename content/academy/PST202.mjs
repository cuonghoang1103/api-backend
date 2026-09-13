/**
 * PST202 — Perspective (Luật xa gần / Phối cảnh). Ngành Thiết kế mỹ thuật số
 * FPTU, Kỳ 2. Song ngữ VI+EN: nguyên lý phối cảnh, 1/2/3 điểm tụ, chia & nhân
 * ô, hình tròn & ellipse, bóng đổ & phản chiếu, ứng dụng dựng cảnh & nhân vật.
 * Sách chuẩn: Ernest Norling "Perspective Made Easy", Scott Robertson "How to
 * Draw", Andrew Loomis, Marshall Vandruff. Mỗi chương: 1 DOCUMENT + 1 QUIZ.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ lồng; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pst202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách vẽ chuẩn (Norling, Robertson, Loomis, Vandruff), tài liệu miễn phí, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">PST202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>perspective drawing</strong> for digital art — horizon &amp; vanishing points, one/two/three-point perspective, circles &amp; ellipses, shadows and reflections — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PST202 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (the drawing canon)</h3>
<ul>
<li><em>Perspective Made Easy</em> — Ernest R. Norling (the gentlest first read)</li>
<li><em>How to Draw</em> — Scott Robertson &amp; Thomas Bertling (constructive, industrial-design perspective)</li>
<li><em>Successful Drawing / Creative Illustration</em> — Andrew Loomis (perspective for figures &amp; scenes)</li>
</ul>
<h3>▶️ Video / free lessons</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=marshall+vandruff+perspective" target="_blank" rel="noopener">Marshall Vandruff — Linear Perspective</a> (a classic full lecture series)</li>
<li><a href="https://www.ctrlpaint.com/" target="_blank" rel="noopener">Ctrl+Paint</a> — free digital-painting &amp; perspective fundamentals</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Any drawing app with a <strong>perspective ruler</strong> — Krita (free), Clip Studio Paint, Procreate.</li>
<li>Pencil, ruler and paper — perspective is learned fastest by hand first.</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>Foundation</strong> — horizon line, eye level, vanishing points; draw a single box in one-point.</li>
<li><strong>Practice</strong> — fill a page with boxes in two-point at different positions above/below the horizon.</li>
<li><strong>Go deeper</strong> — dividing &amp; multiplying, ellipses on the box faces, cast shadows.</li>
<li><strong>Job-ready</strong> — build full scenes and place figures correctly with the horizon as your eye level.</li>
</ol></div>`,
    `<span class="eyebrow">PST202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>luật xa gần (phối cảnh)</strong> cho mỹ thuật số — đường chân trời &amp; điểm tụ, phối cảnh 1/2/3 điểm tụ, hình tròn &amp; ellipse, bóng đổ và phản chiếu — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PST202 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (bộ kinh điển)</h3>
<ul>
<li><em>Perspective Made Easy</em> — Ernest R. Norling (cuốn vỡ lòng dễ đọc nhất)</li>
<li><em>How to Draw</em> — Scott Robertson &amp; Thomas Bertling (phối cảnh dựng hình, kiểu thiết kế công nghiệp)</li>
<li><em>Successful Drawing / Creative Illustration</em> — Andrew Loomis (phối cảnh cho nhân vật &amp; cảnh)</li>
</ul>
<h3>▶️ Video / bài học miễn phí</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=marshall+vandruff+perspective" target="_blank" rel="noopener">Marshall Vandruff — Linear Perspective</a> (loạt bài giảng kinh điển)</li>
<li><a href="https://www.ctrlpaint.com/" target="_blank" rel="noopener">Ctrl+Paint</a> — nền tảng vẽ số &amp; phối cảnh miễn phí</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Phần mềm vẽ có <strong>thước phối cảnh</strong> — Krita (miễn phí), Clip Studio Paint, Procreate.</li>
<li>Bút chì, thước và giấy — phối cảnh học nhanh nhất khi vẽ tay trước.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Nền tảng</strong> — đường chân trời, tầm mắt, điểm tụ; vẽ một khối hộp ở phối cảnh 1 điểm.</li>
<li><strong>Luyện tập</strong> — kín trang giấy các khối hộp ở phối cảnh 2 điểm, đặt trên/dưới đường chân trời.</li>
<li><strong>Đào sâu</strong> — chia &amp; nhân ô, ellipse trên các mặt hộp, bóng đổ.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng cảnh hoàn chỉnh và đặt nhân vật đúng, lấy đường chân trời làm tầm mắt.</li>
</ol></div>`,
  ]]);

const intro = doc('pst202-0-1-overview', 'Course overview: Perspective|||Tổng quan: Luật xa gần / Phối cảnh',
  'Phối cảnh là gì, vì sao mắt thấy xa nhỏ gần to; ba từ khoá cốt lõi (đường chân trời, tầm mắt, điểm tụ); lộ trình 8 chương từ 1 điểm tụ đến dựng cảnh có bóng đổ.',
  [[
    `<span class="eyebrow">PST202 · Lesson 0.1 · Overview</span>
<h2>Perspective — drawing depth on a flat surface</h2>
<p class="lead"><strong>Perspective</strong> (luật xa gần) is the set of rules that let a flat drawing read as <strong>3D space</strong>. It answers one question your eyes already know the answer to: <em>why do things look smaller as they get farther away?</em></p>
<h3>The three words you must own</h3>
<ul>
<li><strong>Horizon line (đường chân trời)</strong> — a horizontal line that always sits at the viewer&#39;s <strong>eye level</strong>.</li>
<li><strong>Eye level (tầm mắt)</strong> — how high the viewer is looking from; it decides whether we look up at, down on, or straight at an object.</li>
<li><strong>Vanishing point (điểm tụ)</strong> — a point on (or off) the horizon where parallel lines going away from us appear to meet.</li>
</ul>
<h3>The core idea</h3>
<p>Lines that are <strong>parallel in real life</strong> and travel <em>away</em> from the viewer converge to a vanishing point. Equal sizes shrink as they recede. Master those two facts and every scene becomes constructible.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Principles → one-point → two-point → three-point → dividing &amp; multiplying → circles &amp; ellipses → shadows &amp; reflections → putting it together (scenes, figures, common mistakes). Bilingual, with step-by-step construction and a quiz each chapter.</p>`,
    `<span class="eyebrow">PST202 · Bài 0.1 · Tổng quan</span>
<h2>Phối cảnh — vẽ chiều sâu trên mặt phẳng</h2>
<p class="lead"><strong>Phối cảnh</strong> (luật xa gần) là bộ quy tắc giúp một bức vẽ phẳng đọc ra <strong>không gian 3D</strong>. Nó trả lời câu hỏi mà mắt bạn vốn đã biết đáp án: <em>vì sao vật càng ra xa càng trông nhỏ lại?</em></p>
<h3>Ba từ khoá phải nắm</h3>
<ul>
<li><strong>Đường chân trời (horizon line)</strong> — một đường ngang luôn nằm ngay <strong>tầm mắt</strong> của người xem.</li>
<li><strong>Tầm mắt (eye level)</strong> — người xem nhìn từ độ cao nào; nó quyết định ta nhìn lên, nhìn xuống hay nhìn ngang vật.</li>
<li><strong>Điểm tụ (vanishing point)</strong> — điểm trên (hoặc ngoài) đường chân trời nơi các đường song song chạy ra xa trông như gặp nhau.</li>
</ul>
<h3>Ý tưởng cốt lõi</h3>
<p>Những đường <strong>song song trong thực tế</strong> và chạy <em>ra xa</em> người xem sẽ hội tụ về một điểm tụ. Các kích thước bằng nhau nhỏ dần khi lùi xa. Nắm hai sự thật đó là dựng được mọi cảnh.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Nguyên lý → 1 điểm tụ → 2 điểm tụ → 3 điểm tụ → chia &amp; nhân ô → hình tròn &amp; ellipse → bóng đổ &amp; phản chiếu → ghép lại (dựng cảnh, nhân vật, lỗi thường gặp). Song ngữ, có các bước dựng hình và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('pst202-1-1-principles', '1.1 — Principles of perspective|||1.1 — Nguyên lý phối cảnh',
  'Đường chân trời = tầm mắt, điểm tụ, nón thị giác (cone of vision), rút ngắn (foreshortening); vì sao đường chân trời luôn ở ngang mắt.',
  [[
    `<span class="eyebrow">PST202 · Chapter 1 · Lesson 1.1</span>
<h2>Principles of perspective</h2>
<h3>Key concepts</h3>
<ul>
<li><strong>Horizon line = eye level.</strong> The horizon is not the ground&#39;s edge — it is an imaginary line at your eye height. Lie down and it drops; stand on a ladder and it rises.</li>
<li><strong>Vanishing point (VP).</strong> Receding parallel lines converge to a VP. Lines parallel to the ground and running away from you land <em>on the horizon</em>.</li>
<li><strong>Cone of vision.</strong> We see clearly only within a ~60° cone. Push VPs far apart / outside this cone or the drawing distorts (stretched corners).</li>
<li><strong>Foreshortening.</strong> A surface tilted away from us compresses — the classic reason a receding road looks like a narrowing wedge.</li>
</ul>
<h3>How to build it — step by step</h3>
<pre><code>1. Draw the HORIZON as a horizontal line — decide the eye level.
2. Mark a VANISHING POINT on the horizon.
3. From that VP, draw a few light guide lines fanning outward.
4. Anything sitting along those guides recedes correctly toward the VP.
5. Keep the object inside a comfortable cone of vision (avoid the far edges).
</code></pre>
<h3>Exercise</h3>
<p>Draw one horizon line. Place a VP. Draw a simple road and two telegraph poles so the road narrows to the VP and the far pole is shorter than the near one.</p>
<div class="callout"><span class="badge">Remember</span> Change your eye level and the whole picture changes — high horizon = looking down; low horizon = looking up.</div>`,
    `<span class="eyebrow">PST202 · Chương 1 · Bài 1.1</span>
<h2>Nguyên lý phối cảnh</h2>
<h3>Khái niệm cốt lõi</h3>
<ul>
<li><strong>Đường chân trời = tầm mắt.</strong> Đường chân trời không phải mép đất — nó là đường tưởng tượng ngang tầm mắt bạn. Nằm xuống nó hạ thấp; đứng trên thang nó dâng cao.</li>
<li><strong>Điểm tụ (VP).</strong> Các đường song song chạy ra xa hội tụ về một điểm tụ. Đường song song với mặt đất và chạy ra xa sẽ nằm <em>trên đường chân trời</em>.</li>
<li><strong>Nón thị giác.</strong> Ta chỉ thấy rõ trong nón khoảng 60°. Đặt điểm tụ quá gần / ngoài nón này thì hình méo (góc bị kéo giãn).</li>
<li><strong>Rút ngắn (foreshortening).</strong> Mặt nghiêng ra xa bị nén lại — chính là lý do con đường lùi xa trông như cái nêm hẹp dần.</li>
</ul>
<h3>Các bước dựng hình</h3>
<pre><code>1. Kẻ ĐƯỜNG CHÂN TRỜI nằm ngang — chọn tầm mắt.
2. Đánh dấu một ĐIỂM TỤ trên đường chân trời.
3. Từ điểm tụ, vẽ vài đường dẫn nhạt toả ra.
4. Vật nằm dọc các đường dẫn đó sẽ lùi xa đúng về điểm tụ.
5. Giữ vật trong nón thị giác thoải mái (tránh mép ngoài cùng).
</code></pre>
<h3>Bài tập</h3>
<p>Vẽ một đường chân trời. Đặt một điểm tụ. Vẽ một con đường và hai cột điện sao cho đường thu hẹp về điểm tụ và cột xa thấp hơn cột gần.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Đổi tầm mắt là cả bức đổi — chân trời cao = nhìn xuống; chân trời thấp = nhìn lên.</div>`,
  ]]);

const c1q = quiz('pst202-quiz-1', 'Quiz 1 — Principles|||Quiz 1 — Nguyên lý', [
  { id: 'q1', question: 'Đường chân trời (horizon line) luôn trùng với?', options: ['Mép đất xa nhất', 'Tầm mắt của người xem', 'Đáy bức tranh', 'Điểm sáng nhất'], correctIndex: 1, explanation: 'Đường chân trời luôn nằm ngay tầm mắt (eye level) của người xem.' },
  { id: 'q2', question: 'Điểm tụ (vanishing point) là nơi?', options: ['Các đường song song chạy ra xa gặp nhau', 'Ánh sáng mạnh nhất', 'Hai đường chân trời cắt nhau', 'Vật to nhất'], correctIndex: 0, explanation: 'Đường song song lùi xa hội tụ về điểm tụ.' },
  { id: 'q3', question: 'Nếu đặt đường chân trời rất cao trong khung hình, người xem đang?', options: ['Nhìn lên (worm eye)', 'Nhìn xuống cảnh (nhìn từ trên)', 'Nhìn ngang', 'Không thấy gì'], correctIndex: 1, explanation: 'Chân trời cao = tầm mắt cao = nhìn xuống cảnh.' },
]);

const c2 = doc('pst202-2-1-one-point', '2.1 — One-point perspective|||2.1 — Phối cảnh 1 điểm tụ',
  'Một điểm tụ trên đường chân trời; mặt trước song song mặt tranh giữ đúng hình; ứng dụng nội thất, hành lang, đường ray; các bước dựng hộp 1 điểm.',
  [[
    `<span class="eyebrow">PST202 · Chapter 2 · Lesson 2.1</span>
<h2>One-point perspective</h2>
<h3>When to use it</h3>
<p>Use <strong>one-point</strong> when you look <em>straight down</em> a scene: a corridor, a road, a room seen from the doorway, railway tracks. The front face of everything stays parallel to the picture plane, so it keeps its true shape; only the lines going <em>away</em> from you converge — all to a <strong>single VP</strong>.</p>
<h3>The three families of lines</h3>
<ul>
<li><strong>Verticals</strong> stay vertical.</li>
<li><strong>Horizontals</strong> (left-right) stay horizontal.</li>
<li><strong>Depth lines</strong> (going away) all aim at the one VP.</li>
</ul>
<h3>How to build a one-point box — step by step</h3>
<pre><code>1. Draw the horizon + one VP on it.
2. Draw a square/rectangle — the true front face.
3. From each of its 4 corners, draw a line back to the VP.
4. Decide the depth: draw a horizontal line to cut all four.
5. Ink the visible edges — you have a box in one-point.
</code></pre>
<h3>Exercise</h3>
<p>Draw a simple room in one-point: put the VP near the centre, run the floor, ceiling and both walls to it, then add a door on one wall and a window on the other so their tops and bottoms aim at the VP.</p>
<div class="callout"><span class="badge">Tip</span> Off-centre the VP a little — a dead-centre VP looks stiff and symmetrical.</div>`,
    `<span class="eyebrow">PST202 · Chương 2 · Bài 2.1</span>
<h2>Phối cảnh 1 điểm tụ</h2>
<h3>Khi nào dùng</h3>
<p>Dùng <strong>1 điểm tụ</strong> khi bạn nhìn <em>thẳng vào</em> cảnh: hành lang, con đường, căn phòng nhìn từ cửa, đường ray. Mặt trước của mọi vật song song với mặt tranh nên giữ đúng hình; chỉ các đường chạy <em>ra xa</em> mới hội tụ — tất cả về <strong>một điểm tụ</strong>.</p>
<h3>Ba họ đường</h3>
<ul>
<li><strong>Đường đứng</strong> vẫn đứng.</li>
<li><strong>Đường ngang</strong> (trái-phải) vẫn ngang.</li>
<li><strong>Đường chiều sâu</strong> (chạy ra xa) đều hướng về một điểm tụ.</li>
</ul>
<h3>Các bước dựng khối hộp 1 điểm</h3>
<pre><code>1. Kẻ đường chân trời + một điểm tụ trên đó.
2. Vẽ một hình vuông/chữ nhật — mặt trước thật.
3. Từ 4 góc của nó, kẻ đường lùi về điểm tụ.
4. Chọn chiều sâu: kẻ một đường ngang cắt cả bốn.
5. Đồ lại các cạnh thấy được — ta có khối hộp 1 điểm.
</code></pre>
<h3>Bài tập</h3>
<p>Vẽ một căn phòng 1 điểm: đặt điểm tụ gần giữa, cho sàn, trần và hai tường chạy về đó, rồi thêm một cửa trên tường này và một cửa sổ trên tường kia sao cho cạnh trên - dưới của chúng hướng về điểm tụ.</p>
<div class="callout"><span class="badge">Mẹo</span> Đặt điểm tụ lệch giữa một chút — điểm tụ ngay chính giữa trông cứng và đối xứng.</div>`,
  ]]);

const c2q = quiz('pst202-quiz-2', 'Quiz 2 — One-point|||Quiz 2 — 1 điểm tụ', [
  { id: 'q1', question: 'Trong phối cảnh 1 điểm tụ, mặt trước của khối hộp?', options: ['Bị méo về điểm tụ', 'Song song mặt tranh, giữ đúng hình', 'Luôn là hình thang', 'Biến mất'], correctIndex: 1, explanation: 'Mặt trước song song mặt tranh nên giữ hình thật; chỉ đường chiều sâu tụ lại.' },
  { id: 'q2', question: 'Cảnh nào hợp nhất với phối cảnh 1 điểm tụ?', options: ['Góc toà nhà nhìn chéo', 'Hành lang nhìn thẳng vào', 'Nhìn từ trên cao xuống', 'Vật xoay 45°'], correctIndex: 1, explanation: 'Nhìn thẳng dọc theo hành lang/đường là điển hình của 1 điểm tụ.' },
  { id: 'q3', question: 'Trong 1 điểm tụ, các đường đứng (dọc) sẽ?', options: ['Hội tụ về điểm tụ', 'Vẫn thẳng đứng', 'Nghiêng theo chân trời', 'Cong lại'], correctIndex: 1, explanation: 'Chỉ đường chiều sâu tụ về VP; đường đứng vẫn đứng, đường ngang vẫn ngang.' },
]);

const c3 = doc('pst202-3-1-two-point', '3.1 — Two-point perspective|||3.1 — Phối cảnh 2 điểm tụ',
  'Hai điểm tụ trên đường chân trời; vẽ khối hộp nhìn từ góc, công trình; đường đứng vẫn đứng, hai mặt bên chạy về hai điểm tụ; các bước dựng.',
  [[
    `<span class="eyebrow">PST202 · Chapter 3 · Lesson 3.1</span>
<h2>Two-point perspective</h2>
<h3>When to use it</h3>
<p>Use <strong>two-point</strong> when you see an object by its <em>corner</em> — a building on a street corner, a box turned 45°. Now <strong>two sets</strong> of horizontal lines recede, each to its own VP, both sitting on the horizon. Verticals still stay perfectly vertical.</p>
<h3>The rule</h3>
<ul>
<li><strong>VP-left</strong> and <strong>VP-right</strong> both live on the horizon, usually spread wide apart.</li>
<li>The near <strong>vertical corner</strong> is the tallest edge; it stays straight up-down.</li>
<li>Top and bottom edges of each side run to their matching VP.</li>
</ul>
<h3>How to build a two-point box — step by step</h3>
<pre><code>1. Draw the horizon; place VP-L far left and VP-R far right.
2. Draw the nearest vertical edge (a straight vertical line).
3. From its top and bottom, draw lines to BOTH VPs.
4. Add two more verticals to close the left face and the right face.
5. Send the back edges to the opposite VPs; ink the box.
</code></pre>
<h3>Exercise</h3>
<p>Draw a simple house seen from its corner in two-point: build the box, then add a pitched roof (the ridge line also aims at a VP) and a door on the front-left face.</p>
<div class="callout"><span class="badge">Tip</span> Keep the two VPs far apart. Too close together and the box looks crushed and unnatural.</div>`,
    `<span class="eyebrow">PST202 · Chương 3 · Bài 3.1</span>
<h2>Phối cảnh 2 điểm tụ</h2>
<h3>Khi nào dùng</h3>
<p>Dùng <strong>2 điểm tụ</strong> khi bạn thấy vật qua <em>góc</em> của nó — một toà nhà ở góc phố, một khối hộp xoay 45°. Lúc này <strong>hai bộ</strong> đường ngang cùng lùi xa, mỗi bộ về một điểm tụ riêng, cả hai nằm trên đường chân trời. Đường đứng vẫn thẳng đứng hoàn toàn.</p>
<h3>Quy tắc</h3>
<ul>
<li><strong>Điểm tụ trái</strong> và <strong>điểm tụ phải</strong> đều nằm trên đường chân trời, thường cách nhau khá xa.</li>
<li><strong>Cạnh đứng ở góc gần</strong> là cạnh cao nhất; nó vẫn thẳng đứng.</li>
<li>Cạnh trên và dưới của mỗi mặt bên chạy về điểm tụ tương ứng của mặt đó.</li>
</ul>
<h3>Các bước dựng khối hộp 2 điểm</h3>
<pre><code>1. Kẻ đường chân trời; đặt VP-trái xa bên trái, VP-phải xa bên phải.
2. Vẽ cạnh đứng gần nhất (một đường thẳng đứng).
3. Từ đỉnh và đáy của nó, kẻ đường về CẢ HAI điểm tụ.
4. Thêm hai đường đứng nữa để khép mặt trái và mặt phải.
5. Cho các cạnh sau chạy về điểm tụ đối diện; đồ lại khối hộp.
</code></pre>
<h3>Bài tập</h3>
<p>Vẽ một ngôi nhà nhìn từ góc ở phối cảnh 2 điểm: dựng khối hộp, rồi thêm mái dốc (đường nóc mái cũng hướng về một điểm tụ) và một cửa trên mặt trước-trái.</p>
<div class="callout"><span class="badge">Mẹo</span> Để hai điểm tụ cách xa nhau. Quá gần thì khối hộp trông bị bóp méo, thiếu tự nhiên.</div>`,
  ]]);

const c3q = quiz('pst202-quiz-3', 'Quiz 3 — Two-point|||Quiz 3 — 2 điểm tụ', [
  { id: 'q1', question: 'Trong phối cảnh 2 điểm tụ, các đường đứng (dọc)?', options: ['Chạy về điểm tụ thứ ba', 'Vẫn thẳng đứng', 'Chia đôi về hai VP', 'Nằm trên chân trời'], correctIndex: 1, explanation: '2 điểm tụ: hai bộ đường ngang tụ về hai VP trên chân trời, đường đứng vẫn đứng.' },
  { id: 'q2', question: 'Hai điểm tụ trong phối cảnh 2 điểm nằm ở đâu?', options: ['Một trên, một dưới khung', 'Cả hai trên đường chân trời', 'Ở tâm bức tranh', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'Cả VP-trái và VP-phải đều nằm trên đường chân trời.' },
  { id: 'q3', question: 'Vì sao nên đặt hai điểm tụ cách xa nhau?', options: ['Cho đẹp màu', 'Tránh khối hộp bị bóp méo, thiếu tự nhiên', 'Để tiết kiệm giấy', 'Không có lý do'], correctIndex: 1, explanation: 'Hai VP quá gần khiến vật méo/bị nén; đặt xa cho hình tự nhiên.' },
]);

const c4 = doc('pst202-4-1-three-point', '4.1 — Three-point perspective|||4.1 — Phối cảnh 3 điểm tụ',
  'Thêm điểm tụ thứ ba (trên hoặc dưới) khiến đường đứng cũng tụ; góc nhìn cao (bird eye) và thấp (worm eye); các bước dựng khối 3 điểm.',
  [[
    `<span class="eyebrow">PST202 · Chapter 4 · Lesson 4.1</span>
<h2>Three-point perspective</h2>
<h3>The idea</h3>
<p>Add a <strong>third VP above or below</strong> the scene and even the <em>vertical</em> lines converge. This is how you draw dramatic height: looking <strong>up</strong> a skyscraper (worm&#39;s-eye, third VP high above) or <strong>down</strong> from a tower (bird&#39;s-eye, third VP far below).</p>
<h3>The three VPs</h3>
<ul>
<li><strong>VP-left</strong> and <strong>VP-right</strong> on the horizon (as in two-point).</li>
<li><strong>VP-vertical</strong> far above (worm&#39;s-eye) or far below (bird&#39;s-eye) — the higher/lower it sits, the gentler the vertical taper.</li>
</ul>
<h3>How to build it — step by step</h3>
<pre><code>1. Set the horizon + VP-L and VP-R (two-point base).
2. Add VP-vertical high above (looking up) or low below (looking down).
3. Draw the near corner as a line aiming at VP-vertical (NOT straight up).
4. Run its top/bottom to VP-L and VP-R.
5. Close the far edges to the opposite VPs — a box that also tapers in height.
</code></pre>
<h3>Exercise</h3>
<p>Draw a tall building as worm&#39;s-eye view: horizon low, third VP high above the top, so the vertical walls narrow as they rise.</p>
<div class="callout"><span class="badge">Watch out</span> Pull the third VP far away. Too close and the tower looks like it is toppling (over-distortion).</div>`,
    `<span class="eyebrow">PST202 · Chương 4 · Bài 4.1</span>
<h2>Phối cảnh 3 điểm tụ</h2>
<h3>Ý tưởng</h3>
<p>Thêm một <strong>điểm tụ thứ ba ở trên hoặc dưới</strong> cảnh thì cả các đường <em>đứng</em> cũng tụ lại. Đây là cách vẽ độ cao ấn tượng: nhìn <strong>lên</strong> một toà nhà chọc trời (worm eye, VP thứ ba ở rất cao) hoặc nhìn <strong>xuống</strong> từ một toà tháp (bird eye, VP thứ ba ở rất thấp).</p>
<h3>Ba điểm tụ</h3>
<ul>
<li><strong>Điểm tụ trái</strong> và <strong>điểm tụ phải</strong> trên đường chân trời (như 2 điểm tụ).</li>
<li><strong>Điểm tụ đứng</strong> ở rất cao (worm eye) hoặc rất thấp (bird eye) — càng cao/thấp thì độ thóp theo chiều đứng càng nhẹ.</li>
</ul>
<h3>Các bước dựng</h3>
<pre><code>1. Đặt đường chân trời + VP-trái và VP-phải (nền 2 điểm tụ).
2. Thêm VP-đứng ở rất cao (nhìn lên) hoặc rất thấp (nhìn xuống).
3. Vẽ cạnh góc gần là đường hướng về VP-đứng (KHÔNG thẳng đứng).
4. Cho đỉnh/đáy của nó chạy về VP-trái và VP-phải.
5. Khép các cạnh xa về điểm tụ đối diện — khối hộp cũng thóp theo chiều cao.
</code></pre>
<h3>Bài tập</h3>
<p>Vẽ một toà nhà cao theo góc worm eye: đường chân trời thấp, điểm tụ thứ ba ở rất cao phía trên đỉnh, để các tường đứng thu hẹp khi vươn lên.</p>
<div class="callout"><span class="badge">Cảnh báo</span> Kéo điểm tụ thứ ba ra thật xa. Quá gần thì toà tháp trông như đang đổ (méo quá mức).</div>`,
  ]]);

const c4q = quiz('pst202-quiz-4', 'Quiz 4 — Three-point|||Quiz 4 — 3 điểm tụ', [
  { id: 'q1', question: 'Điểm tụ thứ ba trong phối cảnh 3 điểm khiến đường nào cũng tụ?', options: ['Đường ngang', 'Đường đứng (dọc)', 'Đường chân trời', 'Không đường nào'], correctIndex: 1, explanation: 'VP thứ ba (trên/dưới) làm cả các đường đứng hội tụ.' },
  { id: 'q2', question: 'Nhìn LÊN một toà nhà chọc trời là góc?', options: ['Bird eye (mắt chim)', 'Worm eye (mắt sâu) — VP thứ ba ở rất cao', 'Nhìn ngang', 'Phối cảnh 1 điểm'], correctIndex: 1, explanation: 'Nhìn lên = worm eye, điểm tụ thứ ba nằm cao phía trên.' },
  { id: 'q3', question: 'Nếu đặt điểm tụ thứ ba quá gần cảnh, kết quả là?', options: ['Hình tự nhiên hơn', 'Vật bị méo quá mức, trông như đổ', 'Không đổi gì', 'Mất đường chân trời'], correctIndex: 1, explanation: 'VP thứ ba quá gần gây méo mạnh; nên đặt xa.' },
]);

const c5 = doc('pst202-5-1-divide-multiply', '5.1 — Dividing & multiplying in perspective|||5.1 — Chia & nhân trong phối cảnh',
  'Chia đôi một mặt bằng đường chéo (giao điểm là tâm phối cảnh), chia đều n phần, và nhân ô đều nhau (hàng cột, hàng rào, cửa sổ) bằng phương pháp đường chéo.',
  [[
    `<span class="eyebrow">PST202 · Chapter 5 · Lesson 5.1</span>
<h2>Dividing &amp; multiplying in perspective</h2>
<h3>Why it matters</h3>
<p>You cannot measure a receding surface with a ruler — near is big, far is small. Instead you use <strong>diagonals</strong> to divide and repeat spaces so that fence posts, windows and floor tiles space out <em>correctly</em> as they recede.</p>
<h3>Find the centre — the diagonal trick</h3>
<p>Draw both diagonals of a face (a rectangle in perspective). Where they <strong>cross is the true perspective centre</strong> — not the geometric middle. A vertical/horizontal through that crossing splits the face in half.</p>
<h3>Multiply equal spaces — step by step</h3>
<pre><code>1. Draw the first panel (e.g. a fence section) in perspective.
2. Find its mid-point using the two diagonals.
3. From the FAR top corner, draw a line through the mid of the near edge...
4. ...until it meets the ground/receding line — that marks the NEXT post.
5. Repeat: each new diagonal steps off one more equal (but shrinking) panel.
</code></pre>
<h3>Exercise</h3>
<p>Draw a row of 5 equally spaced fence posts receding to a VP. Use the diagonal method so each gap looks correctly smaller than the one before.</p>
<div class="callout"><span class="badge">Key insight</span> Equal real-world spacing is NOT equal on paper — the diagonal method finds the shrinking spacing for you.</div>`,
    `<span class="eyebrow">PST202 · Chương 5 · Bài 5.1</span>
<h2>Chia &amp; nhân trong phối cảnh</h2>
<h3>Vì sao quan trọng</h3>
<p>Bạn không thể dùng thước đo một mặt đang lùi xa — gần thì to, xa thì nhỏ. Thay vào đó ta dùng <strong>đường chéo</strong> để chia và lặp lại khoảng cách sao cho cột hàng rào, cửa sổ, gạch sàn giãn ra <em>đúng</em> khi lùi xa.</p>
<h3>Tìm tâm — mẹo đường chéo</h3>
<p>Vẽ cả hai đường chéo của một mặt (hình chữ nhật trong phối cảnh). Chỗ chúng <strong>cắt nhau là tâm phối cảnh thật</strong> — không phải điểm giữa hình học. Một đường đứng/ngang qua giao điểm đó chia mặt làm đôi.</p>
<h3>Nhân các khoảng bằng nhau — từng bước</h3>
<pre><code>1. Vẽ ô đầu tiên (vd một đoạn hàng rào) trong phối cảnh.
2. Tìm điểm giữa của nó bằng hai đường chéo.
3. Từ góc trên XA, kẻ đường qua điểm giữa cạnh gần...
4. ...tới khi gặp đường nền/đường lùi — đó là vị trí CỘT KẾ TIẾP.
5. Lặp lại: mỗi đường chéo mới bước thêm một ô bằng nhau (nhưng nhỏ dần).
</code></pre>
<h3>Bài tập</h3>
<p>Vẽ một hàng 5 cột hàng rào cách đều lùi về một điểm tụ. Dùng phương pháp đường chéo để mỗi khoảng nhỏ dần đúng cách so với khoảng trước.</p>
<div class="callout"><span class="badge">Cốt lõi</span> Khoảng cách bằng nhau ngoài đời KHÔNG bằng nhau trên giấy — phương pháp đường chéo tìm hộ bạn khoảng nhỏ dần.</div>`,
  ]]);

const c5q = quiz('pst202-quiz-5', 'Quiz 5 — Divide & multiply|||Quiz 5 — Chia & nhân', [
  { id: 'q1', question: 'Giao điểm hai đường chéo của một mặt trong phối cảnh cho ta?', options: ['Điểm tụ mới', 'Tâm phối cảnh thật của mặt đó', 'Đường chân trời', 'Nguồn sáng'], correctIndex: 1, explanation: 'Hai đường chéo cắt nhau tại tâm phối cảnh (khác điểm giữa hình học).' },
  { id: 'q2', question: 'Các cột hàng rào cách đều thực tế, khi lùi xa trên giấy sẽ?', options: ['Cách đều y hệt', 'Khoảng cách nhỏ dần', 'Khoảng cách to dần', 'Biến mất ngay'], correctIndex: 1, explanation: 'Cách đều ngoài đời hoá ra nhỏ dần trên giấy khi lùi xa.' },
  { id: 'q3', question: 'Công cụ chính để nhân đều các ô trong phối cảnh là?', options: ['Thước đo thẳng', 'Phương pháp đường chéo', 'Compa', 'Bảng màu'], correctIndex: 1, explanation: 'Dùng đường chéo qua điểm giữa để bước ra các ô kế tiếp.' },
]);

const c6 = doc('pst202-6-1-circles-ellipses', '6.1 — Circles & ellipses in perspective|||6.1 — Hình tròn & ellipse trong phối cảnh',
  'Hình tròn trong phối cảnh thành ellipse; trục lớn/trục nhỏ (major/minor axis), độ mở ellipse; trục nhỏ vuông góc mặt tròn; dựng bánh xe, trụ, cốc.',
  [[
    `<span class="eyebrow">PST202 · Chapter 6 · Lesson 6.1</span>
<h2>Circles &amp; ellipses in perspective</h2>
<h3>A circle becomes an ellipse</h3>
<p>Any circle tilted away from you reads as an <strong>ellipse</strong>. The flatter the angle, the <em>narrower</em> the ellipse; the more you face it, the rounder it gets.</p>
<h3>Major axis, minor axis</h3>
<ul>
<li><strong>Major axis</strong> — the ellipse&#39;s longest width.</li>
<li><strong>Minor axis</strong> — its short width, at 90° to the major axis.</li>
<li><strong>Golden rule:</strong> the <strong>minor axis points straight down the centre of the cylinder / wheel</strong> (the axle direction). Get this and wheels stop looking wonky.</li>
</ul>
<h3>How to draw a circle in perspective — step by step</h3>
<pre><code>1. Draw the square that contains the circle — in perspective.
2. Draw its two diagonals to find the perspective centre.
3. Add a cross through the centre to mark the 4 mid-edge touch points.
4. Draw a smooth ellipse touching those 4 points (never pointed at the ends).
5. Keep the ends rounded; check the minor axis lines up with the axle.
</code></pre>
<h3>Exercise</h3>
<p>Draw a cylinder (a tin can) standing and lying down: bottom ellipse a little rounder than the top; for the lying can, keep the minor axis along the can&#39;s length.</p>
<div class="callout"><span class="badge">Common error</span> Never draw pointed, lemon-shaped ends. Ellipses are always smoothly rounded at both tips.</div>`,
    `<span class="eyebrow">PST202 · Chương 6 · Bài 6.1</span>
<h2>Hình tròn &amp; ellipse trong phối cảnh</h2>
<h3>Hình tròn hoá ellipse</h3>
<p>Mọi hình tròn nghiêng ra xa bạn sẽ đọc thành <strong>ellipse</strong>. Góc càng phẳng, ellipse càng <em>hẹp</em>; càng đối diện thẳng, nó càng tròn.</p>
<h3>Trục lớn, trục nhỏ</h3>
<ul>
<li><strong>Trục lớn (major axis)</strong> — bề rộng dài nhất của ellipse.</li>
<li><strong>Trục nhỏ (minor axis)</strong> — bề rộng ngắn, vuông góc 90° với trục lớn.</li>
<li><strong>Quy tắc vàng:</strong> <strong>trục nhỏ trỏ thẳng theo tâm của trụ / bánh xe</strong> (hướng của trục quay). Nắm điều này thì bánh xe hết trông xiêu vẹo.</li>
</ul>
<h3>Các bước vẽ hình tròn trong phối cảnh</h3>
<pre><code>1. Vẽ hình vuông chứa hình tròn — trong phối cảnh.
2. Kẻ hai đường chéo để tìm tâm phối cảnh.
3. Thêm dấu chữ thập qua tâm để đánh 4 điểm chạm giữa cạnh.
4. Vẽ ellipse mượt chạm 4 điểm đó (đầu ellipse không được nhọn).
5. Giữ hai đầu tròn; kiểm trục nhỏ khớp với hướng trục quay.
</code></pre>
<h3>Bài tập</h3>
<p>Vẽ một trụ (lon nước) đứng và nằm: ellipse đáy tròn hơn ellipse nắp một chút; với lon nằm, giữ trục nhỏ dọc theo chiều dài lon.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Đừng vẽ đầu ellipse nhọn như quả chanh. Ellipse luôn tròn mượt ở cả hai đầu.</div>`,
  ]]);

const c6q = quiz('pst202-quiz-6', 'Quiz 6 — Circles & ellipses|||Quiz 6 — Hình tròn & ellipse', [
  { id: 'q1', question: 'Một hình tròn nghiêng ra xa người xem trông thành?', options: ['Hình vuông', 'Ellipse', 'Tam giác', 'Vẫn tròn đều'], correctIndex: 1, explanation: 'Hình tròn trong phối cảnh luôn thành ellipse.' },
  { id: 'q2', question: 'Trục nhỏ (minor axis) của ellipse bánh xe nên trùng với?', options: ['Đường chân trời', 'Hướng trục quay / tâm của trụ', 'Trục lớn', 'Nguồn sáng'], correctIndex: 1, explanation: 'Quy tắc vàng: trục nhỏ trỏ theo trục quay (tâm trụ/bánh xe).' },
  { id: 'q3', question: 'Hai đầu của một ellipse vẽ đúng phải?', options: ['Nhọn như quả chanh', 'Tròn mượt', 'Vuông góc', 'Cắt cụt'], correctIndex: 1, explanation: 'Đầu ellipse luôn tròn mượt; đầu nhọn là lỗi kinh điển.' },
]);

const c7 = doc('pst202-7-1-shadows-reflections', '7.1 — Cast shadows & reflections|||7.1 — Bóng đổ & phản chiếu',
  'Dựng bóng đổ trong phối cảnh từ nguồn sáng (mặt trời song song vs đèn có điểm tụ sáng); phản chiếu mặt nước/gương là ảnh lật xuống bằng khoảng cách.',
  [[
    `<span class="eyebrow">PST202 · Chapter 7 · Lesson 7.1</span>
<h2>Cast shadows &amp; reflections</h2>
<h3>Cast shadows need two points</h3>
<p>A shadow is built from the <strong>light source</strong> and its point on the ground:</p>
<ul>
<li><strong>Sun (far light):</strong> the sun&#39;s rays are effectively <em>parallel</em>. Its direction has a vanishing point on the horizon that governs where the shadow falls.</li>
<li><strong>Lamp (local light):</strong> a bulb is a real point in space; rays fan out from it, and the shadow spreads from the point <em>directly below</em> the lamp.</li>
</ul>
<h3>How to cast a shadow — step by step</h3>
<pre><code>1. Mark the light source (sun in sky / bulb) and the point on the ground below it.
2. From the ground point, draw a line through the base of the object.
3. From the light, draw a line through the TOP of the object.
4. Where those two lines cross is the tip of the shadow.
5. Join base to tip along the ground — that is the cast shadow shape.
</code></pre>
<h3>Reflections — flip and match distance</h3>
<p>A reflection in water or a mirror is a <strong>mirror image straight down</strong>: an object standing <em>h</em> above the water reflects <em>h</em> below the waterline, along the same vertical, still obeying the same VPs.</p>
<h3>Exercise</h3>
<p>Draw a post standing by a lake. Cast its shadow from a low sun, then draw its reflection in the water directly below, equal in length to the post above the waterline.</p>
<div class="callout"><span class="badge">Tip</span> Shadow falls AWAY from the light; reflection drops STRAIGHT down. Do not mix the two up.</div>`,
    `<span class="eyebrow">PST202 · Chương 7 · Bài 7.1</span>
<h2>Bóng đổ &amp; phản chiếu</h2>
<h3>Bóng đổ cần hai điểm</h3>
<p>Bóng đổ được dựng từ <strong>nguồn sáng</strong> và điểm của nó trên mặt đất:</p>
<ul>
<li><strong>Mặt trời (sáng ở xa):</strong> tia nắng gần như <em>song song</em>. Hướng của nó có một điểm tụ trên đường chân trời chi phối bóng đổ về đâu.</li>
<li><strong>Đèn (sáng cục bộ):</strong> bóng đèn là một điểm thật trong không gian; tia toả ra từ nó, và bóng loang ra từ điểm <em>ngay bên dưới</em> đèn.</li>
</ul>
<h3>Các bước dựng bóng đổ</h3>
<pre><code>1. Đánh dấu nguồn sáng (mặt trời / bóng đèn) và điểm trên đất ngay dưới nó.
2. Từ điểm dưới đất, kẻ đường qua chân vật.
3. Từ nguồn sáng, kẻ đường qua ĐỈNH vật.
4. Chỗ hai đường cắt nhau là đầu mút của bóng.
5. Nối chân vật tới đầu mút dọc mặt đất — đó là hình bóng đổ.
</code></pre>
<h3>Phản chiếu — lật xuống, bằng khoảng cách</h3>
<p>Phản chiếu trên nước hay gương là <strong>ảnh lật thẳng xuống</strong>: vật đứng cao <em>h</em> trên mặt nước sẽ phản chiếu <em>h</em> phía dưới mặt nước, cùng một đường đứng, vẫn theo đúng các điểm tụ.</p>
<h3>Bài tập</h3>
<p>Vẽ một cây cọc đứng bên hồ. Đổ bóng của nó từ mặt trời thấp, rồi vẽ phản chiếu dưới nước ngay bên dưới, dài bằng phần cọc trên mặt nước.</p>
<div class="callout"><span class="badge">Mẹo</span> Bóng đổ hướng RA XA nguồn sáng; phản chiếu rơi THẲNG xuống. Đừng lẫn hai thứ.</div>`,
  ]]);

const c7q = quiz('pst202-quiz-7', 'Quiz 7 — Shadows & reflections|||Quiz 7 — Bóng đổ & phản chiếu', [
  { id: 'q1', question: 'Với ánh nắng mặt trời (ở rất xa), các tia sáng coi như?', options: ['Toả ra từ một điểm gần', 'Song song với nhau', 'Cong theo chân trời', 'Không có hướng'], correctIndex: 1, explanation: 'Mặt trời ở xa nên tia nắng gần như song song (có VP hướng sáng trên chân trời).' },
  { id: 'q2', question: 'Phản chiếu của một vật trên mặt nước là?', options: ['Bóng đổ về phía nguồn sáng', 'Ảnh lật thẳng xuống, dài bằng vật trên mặt nước', 'To gấp đôi vật', 'Luôn mờ và ngắn'], correctIndex: 1, explanation: 'Phản chiếu là ảnh gương lật xuống, bằng khoảng cách so với mặt nước.' },
  { id: 'q3', question: 'Đầu mút của bóng đổ nằm ở đâu?', options: ['Ngay dưới chân vật', 'Nơi tia qua đỉnh vật gặp tia từ điểm dưới nguồn sáng qua chân vật', 'Trên đường chân trời', 'Tại điểm tụ trái'], correctIndex: 1, explanation: 'Giao của tia sáng qua đỉnh vật và tia mặt đất từ điểm dưới nguồn sáng qua chân vật.' },
]);

const c8 = doc('pst202-8-1-applications', '8.1 — Applications: scenes, figures & common mistakes|||8.1 — Ứng dụng: dựng cảnh, nhân vật & lỗi thường gặp',
  'Ghép mọi thứ: dựng cảnh môi trường, đặt nhiều nhân vật đúng tỉ lệ bằng đường chân trời, và checklist các lỗi phối cảnh thường gặp cần tránh.',
  [[
    `<span class="eyebrow">PST202 · Chapter 8 · Lesson 8.1</span>
<h2>Putting it together — scenes, figures &amp; common mistakes</h2>
<h3>Staging a scene</h3>
<p>Start every environment the same way: <strong>set the horizon and VPs first</strong>, block big boxes for buildings/furniture, then divide &amp; multiply for windows, tiles and posts, add ellipses for round objects, and finish with cast shadows for weight.</p>
<h3>Placing figures — the horizon trick</h3>
<p>The horizon is your eye level, so it cuts <em>every</em> standing figure of your own height at the <strong>same body part</strong> (e.g. the eyes). To place a new figure: find where the horizon crosses one figure, then keep it crossing the next figure at that same spot — near or far, big or small.</p>
<pre><code>Scene build order:
  1. Horizon + VPs
  2. Big boxes (architecture / masses)
  3. Divide &amp; multiply (windows, tiles, fences)
  4. Ellipses (wheels, pots, arches)
  5. Figures placed by the horizon line
  6. Cast shadows + reflections
</code></pre>
<h3>Common mistakes to avoid</h3>
<ul>
<li>Different objects sneaking off to <em>different</em> horizons — there is only ONE horizon per picture.</li>
<li>VPs too close together → crushed, distorted boxes.</li>
<li>Pointed (lemon) ellipse ends.</li>
<li>Figures the same size regardless of distance (ignoring the horizon rule).</li>
<li>Shadows that ignore the light direction.</li>
</ul>
<div class="callout"><span class="badge">Final habit</span> Rough the perspective lightly FIRST, check it against the horizon and VPs, THEN render detail. Fixing perspective after rendering is painful.</div>`,
    `<span class="eyebrow">PST202 · Chương 8 · Bài 8.1</span>
<h2>Ghép lại — dựng cảnh, nhân vật &amp; lỗi thường gặp</h2>
<h3>Dàn dựng một cảnh</h3>
<p>Bắt đầu mọi môi trường theo cùng cách: <strong>đặt đường chân trời và điểm tụ trước</strong>, chặn các khối hộp lớn cho nhà cửa/đồ đạc, rồi chia &amp; nhân ô cho cửa sổ, gạch, cột, thêm ellipse cho vật tròn, và hoàn thiện bằng bóng đổ để tạo trọng lượng.</p>
<h3>Đặt nhân vật — mẹo đường chân trời</h3>
<p>Đường chân trời là tầm mắt của bạn, nên nó cắt <em>mọi</em> nhân vật đứng cùng chiều cao với bạn tại <strong>cùng một bộ phận cơ thể</strong> (vd ngang mắt). Để đặt nhân vật mới: tìm chỗ đường chân trời cắt một nhân vật, rồi giữ nó cắt nhân vật kế tiếp đúng chỗ đó — gần hay xa, to hay nhỏ.</p>
<pre><code>Thứ tự dựng cảnh:
  1. Đường chân trời + điểm tụ
  2. Khối hộp lớn (kiến trúc / khối chính)
  3. Chia &amp; nhân ô (cửa sổ, gạch, hàng rào)
  4. Ellipse (bánh xe, chum, vòm)
  5. Nhân vật đặt theo đường chân trời
  6. Bóng đổ + phản chiếu
</code></pre>
<h3>Lỗi thường gặp cần tránh</h3>
<ul>
<li>Các vật lẻn về những đường chân trời <em>khác nhau</em> — mỗi bức chỉ có MỘT đường chân trời.</li>
<li>Điểm tụ quá gần nhau → khối hộp bị bóp, méo.</li>
<li>Đầu ellipse nhọn (như quả chanh).</li>
<li>Nhân vật to bằng nhau bất kể xa gần (bỏ qua quy tắc đường chân trời).</li>
<li>Bóng đổ không theo hướng ánh sáng.</li>
</ul>
<div class="callout"><span class="badge">Thói quen cuối</span> Phác phối cảnh nhạt TRƯỚC, đối chiếu với đường chân trời và điểm tụ, RỒI mới đi chi tiết. Sửa phối cảnh sau khi đã tô là rất cực.</div>`,
  ]]);

const c8q = quiz('pst202-quiz-8', 'Quiz 8 — Applications|||Quiz 8 — Ứng dụng', [
  { id: 'q1', question: 'Mỗi bức tranh phối cảnh nên có bao nhiêu đường chân trời?', options: ['Một cho mỗi vật', 'Đúng MỘT đường chân trời chung', 'Hai đường song song', 'Tuỳ số điểm tụ'], correctIndex: 1, explanation: 'Chỉ có một tầm mắt nên chỉ một đường chân trời cho cả cảnh.' },
  { id: 'q2', question: 'Để đặt nhiều nhân vật cùng chiều cao đúng tỉ lệ, ta dựa vào?', options: ['Cho tất cả cùng kích thước', 'Đường chân trời cắt mỗi nhân vật tại cùng một bộ phận cơ thể', 'Nguồn sáng', 'Điểm tụ đứng'], correctIndex: 1, explanation: 'Horizon = tầm mắt, cắt mọi nhân vật cùng chiều cao tại cùng vị trí (vd ngang mắt).' },
  { id: 'q3', question: 'Trình tự làm việc tốt khi dựng cảnh là?', options: ['Tô chi tiết trước, sửa phối cảnh sau', 'Phác phối cảnh nhạt trước, kiểm rồi mới đi chi tiết', 'Vẽ bóng đổ đầu tiên', 'Đặt nhân vật trước đường chân trời'], correctIndex: 1, explanation: 'Dựng khung phối cảnh trước, đối chiếu horizon/VP, rồi mới render chi tiết.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'PST202',
    slug: 'pst202-perspective',
    title: 'Perspective',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PST202.webp',
    shortDescription: 'Perspective drawing for digital art — horizon, vanishing points, one/two/three-point perspective, dividing & multiplying, circles & ellipses, cast shadows & reflections, staging scenes & figures. Bilingual, step-by-step & quizzes.|||Luật xa gần cho thiết kế mỹ thuật số — đường chân trời, điểm tụ, phối cảnh 1/2/3 điểm, chia & nhân ô, hình tròn & ellipse, bóng đổ & phản chiếu, dựng cảnh & nhân vật. Song ngữ, có các bước dựng & quiz.',
    description: 'Môn <strong>PST202 — Perspective (Luật xa gần / Phối cảnh)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 2, giúp bạn <strong>vẽ chiều sâu 3D trên mặt phẳng</strong>. Từ <strong>nguyên lý</strong> (đường chân trời, tầm mắt, điểm tụ) → <strong>phối cảnh 1, 2, 3 điểm tụ</strong> → <strong>chia &amp; nhân ô</strong> (đo, đường chéo) → <strong>hình tròn &amp; ellipse</strong> → <strong>bóng đổ &amp; phản chiếu</strong> → <strong>ứng dụng dựng cảnh &amp; nhân vật</strong>. Bám các sách vẽ chuẩn (Ernest Norling, Scott Robertson, Andrew Loomis, Marshall Vandruff), song ngữ, có các bước dựng hình và quiz mỗi chương.',
    whatYouLearn: 'Đường chân trời &amp; tầm mắt, điểm tụ, nón thị giác; phối cảnh 1 điểm (nội thất, hành lang); 2 điểm (khối hộp, công trình); 3 điểm (bird eye / worm eye); chia &amp; nhân ô bằng đường chéo; hình tròn &amp; ellipse (trục lớn/nhỏ, trụ, bánh xe); bóng đổ trong phối cảnh; phản chiếu mặt nước/gương; dựng cảnh, đặt nhân vật theo đường chân trời và tránh lỗi thường gặp.',
    requirements: 'Biết vẽ tay cơ bản là đủ; cần bút chì, thước, giấy. Nên có phần mềm vẽ số có thước phối cảnh (Krita miễn phí, Clip Studio, Procreate).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách vẽ chuẩn, video, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phối cảnh là gì; đường chân trời, tầm mắt, điểm tụ.', lessons: [intro] },
    { title: 'Chương 1 — Nguyên lý phối cảnh|||Chapter 1 — Principles', description: 'Đường chân trời, điểm tụ, nón thị giác, rút ngắn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phối cảnh 1 điểm tụ|||Chapter 2 — One-point', description: 'Nội thất, hành lang, đường ray; dựng hộp 1 điểm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phối cảnh 2 điểm tụ|||Chapter 3 — Two-point', description: 'Khối hộp góc, công trình; hai điểm tụ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phối cảnh 3 điểm tụ|||Chapter 4 — Three-point', description: 'Góc nhìn cao/thấp, bird eye & worm eye.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chia & nhân trong phối cảnh|||Chapter 5 — Divide & multiply', description: 'Đo, chia đều, nhân ô, đường chéo.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hình tròn & ellipse|||Chapter 6 — Circles & ellipses', description: 'Trục lớn/nhỏ, độ mở, trụ, bánh xe.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bóng đổ & phản chiếu|||Chapter 7 — Shadows & reflections', description: 'Cast shadow, ánh sáng, phản chiếu nước/gương.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng|||Chapter 8 — Applications', description: 'Dựng cảnh, nhân vật trong không gian, lỗi thường gặp.', lessons: [c8, c8q] },
  ],
};
