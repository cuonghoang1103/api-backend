/**
 * MEP301 — Multimedia Production Project. Khối Quản trị Kinh doanh (BBA),
 * FPTU, Kỳ 8. ĐỒ ÁN: khung theo 8 GIAI ĐOẠN sản xuất đa phương tiện thực tế
 * (không phải 8 chương lý thuyết). Giáo trình trích dẫn (không upload PDF):
 * "Multimedia: Making It Work" (Vaughan), "Digital Multimedia" (Chapman),
 * Adobe Creative Cloud docs. Song ngữ + brief/timeline/checklist + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mep301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình (Vaughan, Chapman), tài liệu Adobe Creative Cloud, kênh học sản xuất video/thiết kế, công cụ, lộ trình làm đồ án.',
  [[
    `<span class="eyebrow">MEP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to plan and produce your <strong>Multimedia Production Project</strong> — from brief to final defense — in one place. The official FPTU syllabus &amp; slides live on <strong>FLM</strong>; below are the reference books and free tool docs behind this course.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/multimedia-making-it-work/P200000003210" target="_blank" rel="noopener"><em>Multimedia: Making It Work</em> — Tay Vaughan</a> — the production process end to end: planning, design, asset creation, delivery.</li>
<li><a href="https://www.google.com/search?q=%22Digital+Multimedia%22+Nigel+Chapman" target="_blank" rel="noopener"><em>Digital Multimedia</em> — Nigel &amp; Jenny Chapman</a> — media types (text, image, audio, video, animation) and how they combine.</li>
</ul>
<h3>🌐 Official tool documentation (free)</h3>
<ul>
<li><a href="https://helpx.adobe.com/creative-cloud/user-guide.html" target="_blank" rel="noopener">Adobe Creative Cloud — user guide</a> — Premiere Pro (video edit), After Effects (motion), Photoshop/Illustrator (graphics), Audition (audio).</li>
<li><a href="https://helpx.adobe.com/premiere-pro/tutorials.html" target="_blank" rel="noopener">Premiere Pro tutorials</a> · <a href="https://helpx.adobe.com/audition/tutorials.html" target="_blank" rel="noopener">Audition tutorials</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@PremiereGal" target="_blank" rel="noopener">Premiere Gal</a> — practical video-editing workflows</li>
<li><a href="https://www.youtube.com/@Wistia" target="_blank" rel="noopener">Wistia</a> — video production &amp; storytelling for real briefs</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> / <a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — moodboard, storyboard, graphic assets</li>
<li><a href="https://www.frame.io/" target="_blank" rel="noopener">Frame.io</a> / <a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — review &amp; feedback rounds, production tracking</li>
<li><a href="https://www.audacityteam.org/" target="_blank" rel="noopener">Audacity</a> — free audio recording &amp; editing</li>
</ul>
<div class="callout"><span class="badge">Project path</span>
<ol>
<li><strong>Define</strong> — brief, objective, audience (Giai đoạn 1).</li>
<li><strong>Plan</strong> — research, storyboard, production schedule (Giai đoạn 2–3).</li>
<li><strong>Build</strong> — shoot/design/record, edit, integrate (Giai đoạn 4–6).</li>
<li><strong>Ship</strong> — test, refine, publish, defend (Giai đoạn 7–8).</li>
</ol></div>`,
    `<span class="eyebrow">MEP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để lập kế hoạch và sản xuất <strong>Đồ án Sản xuất đa phương tiện</strong> — từ brief tới bảo vệ cuối kỳ — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo và tài liệu công cụ miễn phí đứng sau môn này.</p>
<h3>📘 Sách tham khảo</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/multimedia-making-it-work/P200000003210" target="_blank" rel="noopener"><em>Multimedia: Making It Work</em> — Tay Vaughan</a> — toàn bộ quy trình sản xuất: lập kế hoạch, thiết kế, tạo tài nguyên, phát hành.</li>
<li><a href="https://www.google.com/search?q=%22Digital+Multimedia%22+Nigel+Chapman" target="_blank" rel="noopener"><em>Digital Multimedia</em> — Nigel &amp; Jenny Chapman</a> — các loại media (chữ, ảnh, âm thanh, video, hoạt hình) và cách kết hợp.</li>
</ul>
<h3>🌐 Tài liệu chính thức công cụ (miễn phí)</h3>
<ul>
<li><a href="https://helpx.adobe.com/creative-cloud/user-guide.html" target="_blank" rel="noopener">Hướng dẫn Adobe Creative Cloud</a> — Premiere Pro (dựng video), After Effects (motion), Photoshop/Illustrator (đồ hoạ), Audition (âm thanh).</li>
<li><a href="https://helpx.adobe.com/premiere-pro/tutorials.html" target="_blank" rel="noopener">Hướng dẫn Premiere Pro</a> · <a href="https://helpx.adobe.com/audition/tutorials.html" target="_blank" rel="noopener">Hướng dẫn Audition</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PremiereGal" target="_blank" rel="noopener">Premiere Gal</a> — quy trình dựng video thực tế</li>
<li><a href="https://www.youtube.com/@Wistia" target="_blank" rel="noopener">Wistia</a> — sản xuất video &amp; kể chuyện theo brief thật</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> / <a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — moodboard, storyboard, tài nguyên đồ hoạ</li>
<li><a href="https://www.frame.io/" target="_blank" rel="noopener">Frame.io</a> / <a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — vòng phản hồi, theo dõi sản xuất</li>
<li><a href="https://www.audacityteam.org/" target="_blank" rel="noopener">Audacity</a> — ghi &amp; biên tập âm thanh miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình đồ án</span>
<ol>
<li><strong>Xác định</strong> — brief, mục tiêu, đối tượng (Giai đoạn 1).</li>
<li><strong>Lập kế hoạch</strong> — nghiên cứu, storyboard, lịch sản xuất (Giai đoạn 2–3).</li>
<li><strong>Dựng sản phẩm</strong> — quay/thiết kế/ghi âm, biên tập, tích hợp (Giai đoạn 4–6).</li>
<li><strong>Hoàn thiện &amp; nộp</strong> — kiểm thử, tinh chỉnh, xuất bản, bảo vệ (Giai đoạn 7–8).</li>
</ol></div>`,
  ]]);

const intro = doc('mep301-0-1-overview', 'Course overview: a real capstone, not a lecture course|||Tổng quan: một đồ án thật, không phải môn lý thuyết',
  'MEP301 là đồ án cuối: nhóm tự chọn đề tài, sản xuất một sản phẩm đa phương tiện thật (video/tương tác/web) qua 8 giai đoạn, nộp deliverable + bảo vệ trước hội đồng.',
  [[
    `<span class="eyebrow">MEP301 · Lesson 0.1 · Overview</span>
<h2>Multimedia Production Project</h2>
<p class="lead">MEP301 is NOT eight theory chapters — it is a <strong>capstone project</strong>. Your team picks a real brief (client, campus, or self-defined), then produces an actual multimedia product — a promo video, an interactive microsite, a mixed-media campaign — by moving through the <strong>same 8 stages a real production studio uses</strong>.</p>
<h3>What you deliver</h3>
<ul>
<li><strong>The product itself</strong> — the finished video/interactive/web deliverable, exported and playable.</li>
<li><strong>Production documentation</strong> — brief, moodboard, storyboard, production plan/timeline, and a testing/feedback log.</li>
<li><strong>Final defense</strong> — a presentation to a review panel, walking through decisions and answering questions.</li>
</ul>
<h3>How you'll be graded (rubric, typical weighting)</h3>
<pre><code>Concept &amp; brief fit      20%  - clear objective, audience, message
Production quality       30%  - visuals/audio craft, editing, consistency
Technical integration     25%  - media types combine cleanly; interactivity works
Process &amp; documentation 15%  - brief, storyboard, plan, feedback log all present
Presentation &amp; defense  10%  - clear walkthrough, answers questions well
</code></pre>
<h3>The 8 stages (this course's chapters)</h3>
<p>1) Idea &amp; brief → 2) Research &amp; pre-production → 3) Design &amp; production planning → 4) Asset production → 5) Post-production &amp; editing → 6) Multimedia integration &amp; interactivity → 7) Testing, feedback &amp; refinement → 8) Publishing, presentation &amp; defense.</p>
<div class="callout"><span class="badge">Key idea</span> Each stage below ends with a deliverable you actually produce for your own project — not just a concept to memorize. Skipping a stage (e.g. jumping straight to editing without a storyboard) is the #1 cause of a messy final cut.</div>`,
    `<span class="eyebrow">MEP301 · Bài 0.1 · Tổng quan</span>
<h2>Đồ án Sản xuất đa phương tiện</h2>
<p class="lead">MEP301 KHÔNG phải 8 chương lý thuyết — đây là một <strong>đồ án (capstone)</strong>. Nhóm bạn tự chọn một brief thật (khách hàng, trong trường, hoặc tự đề xuất), rồi sản xuất một sản phẩm đa phương tiện thật — video quảng bá, microsite tương tác, chiến dịch mixed-media — bằng cách đi qua <strong>đúng 8 giai đoạn mà một studio sản xuất thật dùng</strong>.</p>
<h3>Bạn nộp gì</h3>
<ul>
<li><strong>Sản phẩm thật</strong> — deliverable video/tương tác/web hoàn chỉnh, đã xuất và chạy được.</li>
<li><strong>Tài liệu sản xuất</strong> — brief, moodboard, storyboard, kế hoạch/timeline sản xuất, và log kiểm thử/phản hồi.</li>
<li><strong>Bảo vệ đồ án</strong> — thuyết trình trước hội đồng, trình bày quyết định và trả lời câu hỏi.</li>
</ul>
<h3>Cách chấm (rubric, tỉ lệ tham khảo)</h3>
<pre><code>Ý tưởng &amp; khớp brief      20%  - mục tiêu, đối tượng, thông điệp rõ
Chất lượng sản xuất       30%  - hình/âm chất lượng, dựng phim, đồng bộ
Tích hợp kỹ thuật          25%  - media kết hợp trơn tru; tương tác chạy đúng
Quy trình &amp; tài liệu     15%  - brief, storyboard, kế hoạch, log phản hồi đủ
Trình bày &amp; bảo vệ       10%  - trình bày rõ, trả lời câu hỏi tốt
</code></pre>
<h3>8 giai đoạn (= 8 chương của môn)</h3>
<p>1) Ý tưởng &amp; brief → 2) Nghiên cứu &amp; tiền sản xuất → 3) Thiết kế &amp; lập kế hoạch sản xuất → 4) Sản xuất tài nguyên → 5) Hậu kỳ &amp; biên tập → 6) Tích hợp đa phương tiện &amp; tương tác → 7) Kiểm thử, phản hồi &amp; hoàn thiện → 8) Xuất bản, trình bày &amp; bảo vệ đồ án.</p>
<div class="callout"><span class="badge">Ý chính</span> Mỗi giai đoạn dưới đây kết thúc bằng một deliverable bạn THỰC SỰ làm cho đồ án của mình — không chỉ là khái niệm để học thuộc. Bỏ qua một giai đoạn (vd nhảy thẳng vào dựng phim mà không có storyboard) là nguyên nhân số 1 khiến bản final lộn xộn.</div>`,
  ]]);

const c1 = doc('mep301-1-1-idea-brief', '1.1 — Idea & creative brief|||1.1 — Ý tưởng & brief sáng tạo',
  'Chọn đề tài, viết creative brief: mục tiêu, đối tượng, thông điệp, định dạng sản phẩm, ràng buộc (thời gian/ngân sách/công nghệ).',
  [[
    `<span class="eyebrow">MEP301 · Stage 1 · Lesson 1.1</span>
<h2>Idea &amp; creative brief</h2>
<h3>Where every production starts</h3>
<p>Before touching a camera or a design tool, a real studio writes a <strong>creative brief</strong> — a one-page contract between "what the client/audience needs" and "what we will make." Skipping this step is why teams produce something polished that answers the wrong question.</p>
<h3>What a brief must answer</h3>
<ul>
<li><strong>Objective</strong> — what should change after someone sees this? (inform, persuade, teach, entertain)</li>
<li><strong>Audience</strong> — who exactly — age, context, where they'll encounter it (phone feed, kiosk, classroom).</li>
<li><strong>Message</strong> — the ONE idea they must remember, in one sentence.</li>
<li><strong>Format &amp; length</strong> — video / interactive microsite / mixed campaign; target duration or scope.</li>
<li><strong>Constraints</strong> — deadline, team size, budget (even zero-cost), available tools/skills.</li>
</ul>
<pre><code>Brief template:
 Project title:
 Client / audience:
 Objective (1 sentence):
 Key message (1 sentence):
 Format &amp; target length:
 Tone (3 adjectives):
 Deadline &amp; team roles:
 Success criteria (how will we know it worked?):
</code></pre>
<div class="callout"><span class="badge">Deliverable — Stage 1</span> A completed one-page brief for your own project, agreed by the whole team before Stage 2 starts.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 1 · Bài 1.1</span>
<h2>Ý tưởng &amp; brief sáng tạo</h2>
<h3>Nơi mọi sản xuất bắt đầu</h3>
<p>Trước khi cầm máy quay hay mở công cụ thiết kế, một studio thật viết ra <strong>creative brief</strong> — bản hợp đồng một trang giữa "khách hàng/khán giả cần gì" và "chúng ta sẽ làm gì". Bỏ qua bước này là lý do nhóm làm ra sản phẩm đẹp nhưng trả lời sai câu hỏi.</p>
<h3>Brief phải trả lời được</h3>
<ul>
<li><strong>Mục tiêu</strong> — người xem cần THAY ĐỔI gì sau khi xem? (biết thêm, bị thuyết phục, học được, giải trí)</li>
<li><strong>Đối tượng</strong> — chính xác là ai — tuổi, bối cảnh, gặp sản phẩm ở đâu (feed điện thoại, màn kiosk, lớp học).</li>
<li><strong>Thông điệp</strong> — MỘT ý duy nhất họ phải nhớ, viết trong một câu.</li>
<li><strong>Định dạng &amp; độ dài</strong> — video / microsite tương tác / chiến dịch phối hợp; thời lượng hoặc phạm vi mục tiêu.</li>
<li><strong>Ràng buộc</strong> — hạn nộp, số người, ngân sách (kể cả bằng 0), công cụ/kỹ năng có sẵn.</li>
</ul>
<pre><code>Mẫu brief:
 Tên dự án:
 Khách hàng / đối tượng:
 Mục tiêu (1 câu):
 Thông điệp chính (1 câu):
 Định dạng &amp; độ dài mục tiêu:
 Tông giọng (3 tính từ):
 Hạn nộp &amp; vai trò trong nhóm:
 Tiêu chí thành công (làm sao biết nó hiệu quả?):
</code></pre>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 1</span> Một bản brief một trang hoàn chỉnh cho đồ án của nhóm, cả nhóm đồng thuận trước khi vào Giai đoạn 2.</div>`,
  ]]);

const c1q = quiz('mep301-quiz-1', 'Quiz 1 — Idea & brief|||Quiz 1 — Ý tưởng & brief', [
  { id: 'q1', question: 'Vì sao phải viết creative brief TRƯỚC khi sản xuất?', options: ['Để có việc làm cho đủ giấy tờ', 'Để cả nhóm và người xem thống nhất mục tiêu/đối tượng/thông điệp trước khi tốn công sản xuất', 'Vì phần mềm yêu cầu', 'Chỉ để nộp giáo viên'], correctIndex: 1, explanation: 'Brief là hợp đồng ngắn gọn giữa nhu cầu và sản phẩm sẽ làm — tránh sản xuất đẹp nhưng lạc đề.' },
  { id: 'q2', question: 'Thông điệp chính (key message) trong brief nên là?', options: ['Một danh sách 10 ý', 'Toàn bộ kịch bản chi tiết', 'MỘT ý duy nhất người xem phải nhớ, viết trong một câu', 'Bảng ngân sách'], correctIndex: 2, explanation: 'Brief chuẩn chỉ giữ MỘT thông điệp cốt lõi để không loãng sản phẩm.' },
  { id: 'q3', question: 'Yếu tố nào KHÔNG bắt buộc phải có trong brief?', options: ['Đối tượng khán giả', 'Mục tiêu', 'Mã màu logo công ty đối thủ', 'Ràng buộc (hạn nộp, ngân sách, công cụ)'], correctIndex: 2, explanation: 'Brief tập trung mục tiêu/đối tượng/thông điệp/định dạng/ràng buộc của CHÍNH dự án, không cần thông tin đối thủ.' },
]);

const c2 = doc('mep301-2-1-research-preprod', '2.1 — Research & pre-production|||2.1 — Nghiên cứu & tiền sản xuất',
  'Nghiên cứu tham khảo & moodboard (định hướng hình ảnh/tông giọng), viết kịch bản (script), dựng storyboard cho từng cảnh/màn hình.',
  [[
    `<span class="eyebrow">MEP301 · Stage 2 · Lesson 2.1</span>
<h2>Research &amp; pre-production</h2>
<h3>Moodboard — visual direction before a single frame</h3>
<p>A <strong>moodboard</strong> collects reference images, colors, typography and clips that capture the tone the brief calls for. It answers "what should this LOOK/FEEL like" before anyone shoots or designs anything — cheap to change now, expensive to change after filming.</p>
<h3>Script — the words and structure</h3>
<p>A <strong>script</strong> lays out narration/dialogue, on-screen text, and scene order. For interactive pieces, the equivalent is a <strong>content map</strong> — every screen and what triggers moving between them.</p>
<h3>Storyboard — one frame per shot/screen</h3>
<p>A <strong>storyboard</strong> turns the script into a sequence of sketches (rough is fine) — one box per shot or screen, with a note on camera angle/action/on-screen text. This is where structural problems (a scene that doesn't fit, a message that arrives too late) get caught cheaply.</p>
<pre><code>Storyboard box template:
 [Shot #] [rough sketch]
 Camera / layout: (wide / close-up / screen 2 of 5)
 Action / content: what happens or is shown
 Audio / VO line: what is heard
 Duration: seconds (video) or "user taps X" (interactive)
</code></pre>
<div class="callout"><span class="badge">Deliverable — Stage 2</span> A moodboard (image board), a script or content map, and a full storyboard covering every shot/screen of your project.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 2 · Bài 2.1</span>
<h2>Nghiên cứu &amp; tiền sản xuất</h2>
<h3>Moodboard — định hướng hình ảnh trước khi quay/dựng</h3>
<p>Một <strong>moodboard</strong> gom ảnh tham khảo, màu sắc, font chữ và đoạn clip thể hiện đúng tông mà brief yêu cầu. Nó trả lời "sản phẩm này NHÌN/CẢM GIÁC như thế nào" trước khi ai quay hay thiết kế bất cứ thứ gì — sửa lúc này rẻ, sửa sau khi quay xong thì đắt.</p>
<h3>Script — lời và cấu trúc</h3>
<p>Một <strong>script (kịch bản)</strong> trình bày lời thuyết minh/hội thoại, chữ trên màn hình, và thứ tự cảnh. Với sản phẩm tương tác, tương đương là <strong>content map</strong> — mọi màn hình và thứ gì kích hoạt chuyển giữa chúng.</p>
<h3>Storyboard — mỗi khung là một shot/màn hình</h3>
<p>Một <strong>storyboard</strong> biến script thành chuỗi phác thảo (vẽ tay đơn giản là được) — mỗi ô là một shot hoặc màn hình, kèm chú thích góc máy/hành động/chữ trên màn hình. Đây là chỗ bắt được lỗi cấu trúc (một cảnh không hợp, thông điệp đến quá muộn) với chi phí rẻ nhất.</p>
<pre><code>Mẫu ô storyboard:
 [Shot số] [phác thảo thô]
 Góc máy / bố cục: (toàn cảnh / cận / màn 2 trên 5)
 Hành động / nội dung: chuyện gì diễn ra hoặc hiện gì
 Âm thanh / lời đọc: nghe được gì
 Thời lượng: giây (video) hoặc "người dùng chạm X" (tương tác)
</code></pre>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 2</span> Một moodboard (bảng ảnh), một script hoặc content map, và một storyboard đầy đủ cho toàn bộ shot/màn hình của đồ án.</div>`,
  ]]);

const c2q = quiz('mep301-quiz-2', 'Quiz 2 — Research & pre-production|||Quiz 2 — Nghiên cứu & tiền sản xuất', [
  { id: 'q1', question: 'Moodboard dùng để làm gì?', options: ['Tính ngân sách sản xuất', 'Định hướng hình ảnh/tông giọng trước khi quay hoặc thiết kế', 'Viết mã cho phần tương tác', 'Xuất file cuối cùng'], correctIndex: 1, explanation: 'Moodboard gom ảnh/màu/font tham khảo để chốt cảm giác thị giác trước khi tốn công sản xuất thật.' },
  { id: 'q2', question: 'Với sản phẩm TƯƠNG TÁC (không phải video), thứ tương đương với "script" là gì?', options: ['Danh sách nhạc nền', 'Bảng ngân sách', 'Content map — mọi màn hình và thứ kích hoạt chuyển màn', 'Hoá đơn thuê thiết bị'], correctIndex: 2, explanation: 'Content map đóng vai trò kịch bản cho sản phẩm tương tác: liệt kê màn hình và luồng chuyển.' },
  { id: 'q3', question: 'Vì sao nên bắt lỗi cấu trúc (cảnh thừa, thông điệp đến muộn) ở bước STORYBOARD?', options: ['Vì storyboard không ai xem lại', 'Vì sửa phác thảo rẻ hơn nhiều so với sửa sau khi đã quay/dựng xong', 'Vì storyboard là bước cuối cùng', 'Vì storyboard thay luôn cho bản final'], correctIndex: 1, explanation: 'Storyboard chi phí sửa thấp; phát hiện lỗi cấu trúc ở đây tránh phải quay/dựng lại.' },
]);

const c3 = doc('mep301-3-1-design-production-plan', '3.1 — Design & production planning|||3.1 — Thiết kế & lập kế hoạch sản xuất',
  'Style guide (màu/font/logo/quy tắc dùng đồ hoạ), kế hoạch sản xuất: timeline, phân vai trong nhóm, danh sách thiết bị/tài nguyên cần.',
  [[
    `<span class="eyebrow">MEP301 · Stage 3 · Lesson 3.1</span>
<h2>Design &amp; production planning</h2>
<h3>Style guide — consistency across every asset</h3>
<p>A short <strong>style guide</strong> locks the colors, fonts, logo usage and graphic rules so that assets made by different team members (or on different days) still look like one product — the #1 giveaway of an unplanned project is inconsistent fonts/colors between scenes.</p>
<h3>Production plan — turning the storyboard into a schedule</h3>
<p>The storyboard says WHAT to make; the production plan says WHEN and WHO. List every shot/asset, who owns it, what equipment/software it needs, and a realistic deadline — working backward from the final submission date.</p>
<pre><code>Production plan row:
 Shot/asset ID | Owner | Equipment/software | Depends on | Due date | Status
 -------------------------------------------------------------------------
 S03 - intro clip | Lan | phone camera, Premiere | storyboard approved | Wk3 | Not started
</code></pre>
<h3>Resource &amp; risk check</h3>
<p>List what you don't yet have (a location, an actor, a license-free music track) and a backup plan for each — this is where a team catches "we need a quiet room" three weeks early instead of the night before.</p>
<div class="callout"><span class="badge">Deliverable — Stage 3</span> A one-page style guide + a production plan/timeline listing every shot or asset, its owner, and its due date.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 3 · Bài 3.1</span>
<h2>Thiết kế &amp; lập kế hoạch sản xuất</h2>
<h3>Style guide — nhất quán trên mọi tài nguyên</h3>
<p>Một <strong>style guide</strong> ngắn chốt màu sắc, font, cách dùng logo và quy tắc đồ hoạ để tài nguyên do các thành viên khác nhau làm (hoặc làm ở ngày khác nhau) vẫn trông như một sản phẩm — dấu hiệu số 1 của một đồ án không có kế hoạch là font/màu lệch nhau giữa các cảnh.</p>
<h3>Kế hoạch sản xuất — biến storyboard thành lịch làm việc</h3>
<p>Storyboard nói LÀM GÌ; kế hoạch sản xuất nói KHI NÀO và AI làm. Liệt kê mọi shot/tài nguyên, ai phụ trách, cần thiết bị/phần mềm gì, và hạn hoàn thành thực tế — tính ngược từ ngày nộp cuối.</p>
<pre><code>Dòng kế hoạch sản xuất:
 Mã shot/tài nguyên | Phụ trách | Thiết bị/phần mềm | Phụ thuộc | Hạn | Trạng thái
 -------------------------------------------------------------------------
 S03 - clip mở đầu | Lan | máy điện thoại, Premiere | storyboard đã duyệt | Tuần 3 | Chưa bắt đầu
</code></pre>
<h3>Kiểm tra tài nguyên &amp; rủi ro</h3>
<p>Liệt kê thứ chưa có (một địa điểm, một diễn viên, một bản nhạc không dính bản quyền) và kế hoạch dự phòng cho mỗi thứ — đây là chỗ nhóm phát hiện "cần một phòng yên tĩnh" trước ba tuần thay vì đêm trước khi nộp.</p>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 3</span> Một style guide một trang + kế hoạch sản xuất/timeline liệt kê mọi shot hoặc tài nguyên, người phụ trách và hạn hoàn thành.</div>`,
  ]]);

const c3q = quiz('mep301-quiz-3', 'Quiz 3 — Design & production planning|||Quiz 3 — Thiết kế & lập kế hoạch', [
  { id: 'q1', question: 'Style guide giúp giải quyết vấn đề gì khi nhiều người cùng làm tài nguyên?', options: ['Tăng tốc render', 'Giữ màu sắc/font/logo nhất quán giữa các tài nguyên do nhiều người làm', 'Thay cho storyboard', 'Tự động xuất file'], correctIndex: 1, explanation: 'Style guide chốt quy tắc hình ảnh chung, tránh sản phẩm cuối bị lệch font/màu giữa các cảnh.' },
  { id: 'q2', question: 'Kế hoạch sản xuất khác storyboard ở điểm nào?', options: ['Kế hoạch sản xuất thay hẳn storyboard', 'Storyboard nói LÀM GÌ, kế hoạch sản xuất nói KHI NÀO/AI làm', 'Không khác nhau', 'Kế hoạch sản xuất chỉ dùng cho phần âm thanh'], correctIndex: 1, explanation: 'Storyboard = nội dung từng shot; kế hoạch sản xuất = lịch, người phụ trách, thiết bị cho từng shot đó.' },
  { id: 'q3', question: 'Vì sao nên liệt kê rủi ro/tài nguyên còn thiếu NGAY ở Giai đoạn 3?', options: ['Để có thêm giấy tờ nộp', 'Để phát hiện sớm (vd thiếu địa điểm/diễn viên) và có kế hoạch dự phòng trước khi hết thời gian', 'Vì giáo viên yêu cầu đúng mẫu', 'Không cần thiết nếu nhóm tự tin'], correctIndex: 1, explanation: 'Phát hiện rủi ro sớm giúp còn thời gian xử lý; phát hiện đêm trước khi nộp là quá muộn.' },
]);

const c4 = doc('mep301-4-1-asset-production', '4.1 — Asset production|||4.1 — Sản xuất tài nguyên',
  'Quay/chụp hình, thiết kế đồ hoạ (banner, icon, UI cho phần tương tác), ghi âm (lời đọc, hiệu ứng, nhạc); theo đúng shot list & style guide.',
  [[
    `<span class="eyebrow">MEP301 · Stage 4 · Lesson 4.1</span>
<h2>Asset production</h2>
<h3>Following the plan, not improvising on set</h3>
<p>This is where the team actually shoots footage/photos, builds graphics (banners, icons, UI screens for interactive pieces), and records audio (voice-over, sound effects, music) — each item checked off against the shot list and style guide from Stage 3, not improvised on the day.</p>
<h3>Video/photo capture basics</h3>
<ul>
<li><strong>Framing &amp; light</strong> — shoot in good, consistent light; keep the horizon level; leave headroom.</li>
<li><strong>Coverage</strong> — capture a few extra takes/angles per shot; editing needs options.</li>
<li><strong>File organization</strong> — name files by shot ID from the plan (e.g. S03_take2.mp4) — this alone saves hours in editing.</li>
</ul>
<h3>Graphic &amp; audio assets</h3>
<p>Export graphics at the resolution the final delivery needs (not smaller — upscaling later looks blurry). Record voice-over in a quiet room, close to the mic, and always keep a "room tone" (a few seconds of silence) for editing.</p>
<pre><code>Asset checklist (per item):
 [ ] Matches storyboard/shot list
 [ ] Matches style guide (color/font/logo rule)
 [ ] Named with shot/asset ID
 [ ] Exported/recorded at final-delivery quality
</code></pre>
<div class="callout"><span class="badge">Deliverable — Stage 4</span> All raw footage/photos, graphic assets, and audio recordings needed for editing, organized and named by shot/asset ID.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 4 · Bài 4.1</span>
<h2>Sản xuất tài nguyên</h2>
<h3>Theo đúng kế hoạch, không tuỳ biến tại hiện trường</h3>
<p>Đây là lúc nhóm thực sự quay/chụp hình, dựng đồ hoạ (banner, icon, màn hình UI cho phần tương tác), và ghi âm (lời đọc, hiệu ứng, nhạc) — mỗi mục đối chiếu với shot list và style guide từ Giai đoạn 3, không tuỳ biến ngay tại buổi quay.</p>
<h3>Cơ bản khi quay video/chụp ảnh</h3>
<ul>
<li><strong>Bố cục &amp; ánh sáng</strong> — quay dưới ánh sáng tốt, nhất quán; giữ đường ngang thẳng; để chừa khoảng trên đầu.</li>
<li><strong>Đủ phương án</strong> — quay thêm vài take/góc cho mỗi shot; dựng phim cần có lựa chọn.</li>
<li><strong>Tổ chức file</strong> — đặt tên file theo mã shot trong kế hoạch (vd S03_take2.mp4) — chỉ riêng việc này tiết kiệm hàng giờ lúc dựng.</li>
</ul>
<h3>Tài nguyên đồ hoạ &amp; âm thanh</h3>
<p>Xuất đồ hoạ ở độ phân giải mà bản giao cuối cần (không nhỏ hơn — phóng to sau sẽ mờ). Ghi lời đọc trong phòng yên tĩnh, gần mic, và luôn giữ lại "room tone" (vài giây im lặng) để dùng khi biên tập.</p>
<pre><code>Checklist tài nguyên (mỗi mục):
 [ ] Khớp storyboard/shot list
 [ ] Khớp style guide (quy tắc màu/font/logo)
 [ ] Đặt tên theo mã shot/tài nguyên
 [ ] Xuất/ghi ở chất lượng bản giao cuối
</code></pre>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 4</span> Toàn bộ footage/ảnh gốc, tài nguyên đồ hoạ, và bản ghi âm cần cho biên tập, đã tổ chức và đặt tên theo mã shot/tài nguyên.</div>`,
  ]]);

const c4q = quiz('mep301-quiz-4', 'Quiz 4 — Asset production|||Quiz 4 — Sản xuất tài nguyên', [
  { id: 'q1', question: 'Vì sao nên quay thêm vài take/góc cho mỗi shot?', options: ['Để tốn thêm thời gian', 'Để lúc biên tập có nhiều lựa chọn thay vì bị kẹt với một bản duy nhất', 'Vì máy quay yêu cầu', 'Không cần thiết'], correctIndex: 1, explanation: 'Có nhiều take/góc giúp giai đoạn hậu kỳ chọn được bản tốt nhất.' },
  { id: 'q2', question: 'Đặt tên file theo mã shot (vd S03_take2.mp4) giúp gì?', options: ['Làm file nhẹ hơn', 'Giúp tổ chức và tìm đúng file khi biên tập, tiết kiệm thời gian', 'Tự động chỉnh màu', 'Không có tác dụng'], correctIndex: 1, explanation: 'Đặt tên theo mã shot giúp đối chiếu ngược lại storyboard/kế hoạch, tránh lộn file lúc dựng.' },
  { id: 'q3', question: '"Room tone" khi ghi âm là gì và để làm gì?', options: ['Một bản nhạc nền có sẵn', 'Vài giây im lặng của phòng ghi, dùng để lấp khoảng trống/làm mượt khi biên tập âm thanh', 'Hiệu ứng âm thanh của phòng họp', 'Tên phần mềm ghi âm'], correctIndex: 1, explanation: 'Room tone là nền âm của không gian ghi, hữu ích để ghép nối liền mạch khi edit audio.' },
]);

const c5 = doc('mep301-5-1-post-production', '5.1 — Post-production & editing|||5.1 — Hậu kỳ & biên tập',
  'Dựng video (cắt/ghép theo storyboard), color grading, biên tập & mix âm thanh (lời đọc/nhạc/hiệu ứng), chèn chữ/graphic.',
  [[
    `<span class="eyebrow">MEP301 · Stage 5 · Lesson 5.1</span>
<h2>Post-production &amp; editing</h2>
<h3>Assembling the raw material into the actual product</h3>
<p>Editing turns raw footage, graphics and audio into the finished flow the storyboard promised. Work in passes rather than trying to perfect everything at once:</p>
<ol>
<li><strong>Rough cut</strong> — assemble shots in order, correct length, no polish yet. Confirms the story/flow works.</li>
<li><strong>Fine cut</strong> — trim timing, add transitions, insert graphics/text overlays.</li>
<li><strong>Color &amp; audio pass</strong> — <strong>color grading</strong> for a consistent look across shots; <strong>audio mix</strong> balances voice-over, music and sound effects (voice should always be the clearest layer).</li>
</ol>
<h3>Common post-production mistakes</h3>
<ul>
<li>Music louder than the voice-over — the message gets lost.</li>
<li>Inconsistent color between shots taken at different times/lights.</li>
<li>Skipping the rough cut and fine-tuning a scene that gets cut later anyway.</li>
</ul>
<pre><code>Edit pass checklist:
 [ ] Rough cut matches storyboard order &amp; length
 [ ] Fine cut: transitions, text/graphics in place
 [ ] Color consistent shot to shot
 [ ] Audio: voice clearest, music/SFX balanced under it
</code></pre>
<div class="callout"><span class="badge">Deliverable — Stage 5</span> An edited draft (rough cut → fine cut with color and audio mix) ready for the integration stage.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 5 · Bài 5.1</span>
<h2>Hậu kỳ &amp; biên tập</h2>
<h3>Ghép tài nguyên thô thành sản phẩm thật</h3>
<p>Biên tập biến footage, đồ hoạ và âm thanh thô thành luồng hoàn chỉnh mà storyboard đã hứa. Làm theo từng lượt (pass) thay vì cố hoàn hảo mọi thứ một lúc:</p>
<ol>
<li><strong>Rough cut (dựng thô)</strong> — ghép các shot theo đúng thứ tự, đúng độ dài, chưa cần đẹp. Xác nhận câu chuyện/luồng có ổn không.</li>
<li><strong>Fine cut (dựng tinh)</strong> — chỉnh timing, thêm chuyển cảnh, chèn graphic/chữ overlay.</li>
<li><strong>Lượt màu &amp; âm thanh</strong> — <strong>color grading</strong> để hình ảnh nhất quán giữa các shot; <strong>mix âm thanh</strong> cân bằng lời đọc, nhạc và hiệu ứng (lời đọc luôn phải là lớp rõ nhất).</li>
</ol>
<h3>Lỗi hậu kỳ thường gặp</h3>
<ul>
<li>Nhạc to hơn lời đọc — thông điệp bị chìm.</li>
<li>Màu không đồng nhất giữa các shot quay ở thời điểm/ánh sáng khác nhau.</li>
<li>Bỏ qua rough cut, đi chỉnh tỉ mỉ một cảnh mà cuối cùng vẫn bị cắt bỏ.</li>
</ul>
<pre><code>Checklist từng lượt dựng:
 [ ] Rough cut đúng thứ tự &amp; độ dài theo storyboard
 [ ] Fine cut: chuyển cảnh, chữ/graphic đã có
 [ ] Màu nhất quán giữa các shot
 [ ] Âm thanh: lời đọc rõ nhất, nhạc/hiệu ứng cân bằng dưới nó
</code></pre>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 5</span> Một bản dựng (rough cut → fine cut đã có màu và mix âm thanh) sẵn sàng cho giai đoạn tích hợp.</div>`,
  ]]);

const c5q = quiz('mep301-quiz-5', 'Quiz 5 — Post-production & editing|||Quiz 5 — Hậu kỳ & biên tập', [
  { id: 'q1', question: 'Thứ tự đúng của các lượt dựng phim?', options: ['Fine cut → rough cut → màu/âm thanh', 'Rough cut → fine cut → màu &amp; âm thanh', 'Màu/âm thanh → rough cut → fine cut', 'Không có thứ tự, làm tuỳ ý'], correctIndex: 1, explanation: 'Chuẩn: ghép thô theo thứ tự trước (rough cut), rồi tinh chỉnh (fine cut), rồi màu/âm thanh.' },
  { id: 'q2', question: 'Trong mix âm thanh, lớp nào LUÔN phải rõ nhất?', options: ['Nhạc nền', 'Hiệu ứng âm thanh', 'Lời đọc (voice-over)', 'Tiếng ồn phòng'], correctIndex: 2, explanation: 'Nếu nhạc/hiệu ứng lấn lời đọc, thông điệp chính bị chìm — lời đọc phải là lớp rõ nhất.' },
  { id: 'q3', question: 'Color grading dùng để làm gì?', options: ['Tăng âm lượng', 'Giữ hình ảnh nhất quán giữa các shot quay khác thời điểm/ánh sáng', 'Thay thế storyboard', 'Xuất file cuối cùng'], correctIndex: 1, explanation: 'Grading chỉnh màu để các shot rời rạc trông như thuộc cùng một sản phẩm.' },
]);

const c6 = doc('mep301-6-1-integration-interactivity', '6.1 — Multimedia integration & interactivity|||6.1 — Tích hợp đa phương tiện & tương tác',
  'Kết hợp video/đồ hoạ/âm thanh/chữ vào một sản phẩm thống nhất; với sản phẩm tương tác: điều hướng, nút bấm, phản hồi cho người dùng.',
  [[
    `<span class="eyebrow">MEP301 · Stage 6 · Lesson 6.1</span>
<h2>Multimedia integration &amp; interactivity</h2>
<h3>From separate media to one product</h3>
<p>Integration is where video, graphics, audio and text stop being separate files and become <strong>one coherent product</strong> — captions synced to speech, a logo animation timed to a beat, a web page where video, images and text share one layout and load reliably.</p>
<h3>If your product is interactive</h3>
<p>Interactive pieces add a layer video doesn't need: <strong>navigation</strong> (how someone moves between screens/states) and <strong>feedback</strong> (does the interface confirm every tap/click?). Map every user path — including "what if they go the wrong way" — not just the ideal one.</p>
<pre><code>Interactivity checklist:
 [ ] Every button/link goes somewhere real (no dead ends)
 [ ] Every action gives visible feedback (highlight, sound, state change)
 [ ] Media loads without breaking layout on a slow connection
 [ ] Text/captions stay synced with audio/video timing
</code></pre>
<h3>Technical fit</h3>
<p>Match file formats and resolutions to where the product will actually run (mobile screen vs. projector vs. web page) — this stage is where a beautiful asset that doesn't load, or text too small on a phone, gets caught before the final deadline.</p>
<div class="callout"><span class="badge">Deliverable — Stage 6</span> A working integrated build (or a locked final cut, for pure video) with all media combined and, if interactive, every navigation path checked.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 6 · Bài 6.1</span>
<h2>Tích hợp đa phương tiện &amp; tương tác</h2>
<h3>Từ các media riêng lẻ thành một sản phẩm</h3>
<p>Tích hợp là lúc video, đồ hoạ, âm thanh và chữ không còn là các file riêng mà trở thành <strong>một sản phẩm liền mạch</strong> — phụ đề đồng bộ với lời nói, hoạt hình logo khớp nhịp nhạc, một trang web mà video/ảnh/chữ chia sẻ cùng bố cục và tải ổn định.</p>
<h3>Nếu sản phẩm của bạn có tương tác</h3>
<p>Sản phẩm tương tác thêm một lớp mà video không cần: <strong>điều hướng</strong> (người dùng di chuyển giữa các màn hình/trạng thái ra sao) và <strong>phản hồi</strong> (giao diện có xác nhận mỗi lần chạm/click không?). Vẽ ra mọi đường đi của người dùng — kể cả "nếu họ đi sai đường" — không chỉ đường lý tưởng.</p>
<pre><code>Checklist tương tác:
 [ ] Mọi nút/link dẫn tới nơi có thật (không dead-end)
 [ ] Mọi hành động có phản hồi rõ (highlight, âm thanh, đổi trạng thái)
 [ ] Media tải được mà không vỡ bố cục trên mạng chậm
 [ ] Chữ/phụ đề đồng bộ đúng thời điểm với âm thanh/video
</code></pre>
<h3>Khớp kỹ thuật</h3>
<p>Chọn định dạng file và độ phân giải khớp với nơi sản phẩm sẽ chạy thật (màn điện thoại vs máy chiếu vs trang web) — đây là chỗ bắt được lỗi "tài nguyên đẹp nhưng không tải được" hoặc "chữ quá nhỏ trên điện thoại" trước hạn nộp cuối.</p>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 6</span> Một bản tích hợp chạy được (hoặc bản dựng cuối đã chốt, với sản phẩm chỉ là video) với mọi media đã ghép, và nếu có tương tác thì mọi đường điều hướng đã kiểm.</div>`,
  ]]);

const c6q = quiz('mep301-quiz-6', 'Quiz 6 — Integration & interactivity|||Quiz 6 — Tích hợp & tương tác', [
  { id: 'q1', question: 'Giai đoạn tích hợp khác giai đoạn hậu kỳ ở điểm nào?', options: ['Không khác gì, chỉ đổi tên', 'Tích hợp gộp video/đồ hoạ/âm thanh/chữ (và điều hướng nếu có) thành MỘT sản phẩm thống nhất, sau khi từng phần đã được biên tập', 'Tích hợp là bước quay lại từ đầu', 'Tích hợp chỉ áp dụng cho video, không áp dụng cho web'], correctIndex: 1, explanation: 'Hậu kỳ hoàn thiện từng thành phần; tích hợp ghép chúng lại thành sản phẩm liền mạch.' },
  { id: 'q2', question: 'Vì sao cần kiểm TẤT CẢ đường điều hướng, kể cả "đi sai đường"?', options: ['Không cần thiết, chỉ kiểm đường lý tưởng là đủ', 'Vì người dùng thật có thể chạm nhầm hoặc đi khác kỳ vọng, và giao diện phải xử lý được', 'Vì giáo viên yêu cầu đúng số lượng nút', 'Vì storyboard đã quy định sẵn'], correctIndex: 1, explanation: 'Người dùng thật không luôn theo đường lý tưởng — mọi nhánh phải được kiểm để không gặp dead-end.' },
  { id: 'q3', question: 'Một lỗi kỹ thuật thường bị bỏ sót ở giai đoạn tích hợp là gì?', options: ['Chọn sai font trong style guide', 'Định dạng/độ phân giải không khớp nơi sản phẩm sẽ chạy thật (điện thoại, máy chiếu, web)', 'Ghi âm ở phòng ồn', 'Thiếu brief'], correctIndex: 1, explanation: 'Tài nguyên phải khớp thiết bị hiển thị thật — sai định dạng/độ phân giải gây lỗi tải hoặc hiển thị.' },
]);

const c7 = doc('mep301-7-1-testing-feedback-refinement', '7.1 — Testing, feedback & refinement|||7.1 — Kiểm thử, phản hồi & hoàn thiện',
  'Kiểm thử với người xem/người dùng thật, thu thập phản hồi có cấu trúc, phân biệt phản hồi ĐÁNG sửa với phản hồi lệch brief, log & sửa theo vòng lặp.',
  [[
    `<span class="eyebrow">MEP301 · Stage 7 · Lesson 7.1</span>
<h2>Testing, feedback &amp; refinement</h2>
<h3>Test with real viewers, not just the team</h3>
<p>The team is the worst judge of its own work — everyone already knows the story. Show the integrated build to 3-5 people <em>outside</em> the team who match your target audience, and watch/listen without explaining anything first.</p>
<h3>Ask structured questions, not "do you like it?"</h3>
<pre><code>Feedback questions:
 - In one sentence, what is this trying to tell you? (tests the message landed)
 - Where did you get confused or lose interest?
 - (Interactive) Where did you expect something to happen that didn't?
 - What's the ONE thing you'd change first?
</code></pre>
<h3>Filter feedback against the brief</h3>
<p>Not every comment should become a change. Sort feedback into: <strong>fix now</strong> (breaks the objective/message from Stage 1's brief), <strong>fix if time allows</strong> (polish), and <strong>note only</strong> (personal taste that conflicts with the agreed brief). Log every round — what was tested, what changed, what didn't.</p>
<div class="callout"><span class="badge">Deliverable — Stage 7</span> A feedback log (who/what was tested, what changed) and a refined build that addresses the "fix now" items.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 7 · Bài 7.1</span>
<h2>Kiểm thử, phản hồi &amp; hoàn thiện</h2>
<h3>Kiểm thử với người xem thật, không chỉ trong nhóm</h3>
<p>Chính nhóm là người đánh giá tệ nhất cho sản phẩm của mình — ai cũng đã biết trước câu chuyện. Cho 3-5 người <em>ngoài nhóm</em>, giống đối tượng mục tiêu, xem bản tích hợp, và quan sát/nghe mà không giải thích gì trước.</p>
<h3>Hỏi câu hỏi có cấu trúc, không chỉ "có thích không?"</h3>
<pre><code>Câu hỏi thu thập phản hồi:
 - Trong một câu, bạn hiểu sản phẩm này đang nói gì? (kiểm tra thông điệp có tới không)
 - Bạn bối rối hoặc mất hứng thú ở đoạn nào?
 - (Tương tác) Bạn mong có gì xảy ra ở đâu mà không xảy ra?
 - Nếu chỉ đổi MỘT thứ, bạn sẽ đổi gì trước?
</code></pre>
<h3>Lọc phản hồi theo brief</h3>
<p>Không phải mọi bình luận đều nên trở thành thay đổi. Chia phản hồi thành: <strong>sửa ngay</strong> (phá vỡ mục tiêu/thông điệp trong brief ở Giai đoạn 1), <strong>sửa nếu còn thời gian</strong> (tinh chỉnh), và <strong>chỉ ghi nhận</strong> (sở thích cá nhân đi ngược brief đã thống nhất). Ghi log mỗi vòng — đã kiểm gì, đã đổi gì, đã giữ nguyên gì.</p>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 7</span> Một log phản hồi (kiểm với ai/kiểm gì, đã đổi gì) và một bản đã hoàn thiện xử lý các mục "sửa ngay".</div>`,
  ]]);

const c7q = quiz('mep301-quiz-7', 'Quiz 7 — Testing & refinement|||Quiz 7 — Kiểm thử & hoàn thiện', [
  { id: 'q1', question: 'Vì sao nên kiểm thử với người NGOÀI nhóm sản xuất?', options: ['Vì nhóm không được phép tự xem lại sản phẩm', 'Vì nhóm đã biết trước câu chuyện nên không đánh giá khách quan được như người xem lần đầu', 'Vì giáo viên yêu cầu số lượng người kiểm', 'Không có lý do đặc biệt'], correctIndex: 1, explanation: 'Người trong nhóm đã biết nội dung nên dễ bỏ sót đoạn gây khó hiểu với người xem lần đầu.' },
  { id: 'q2', question: 'Khi nhận phản hồi trái brief đã thống nhất (sở thích cá nhân), nên xử lý thế nào?', options: ['Luôn sửa theo mọi phản hồi', 'Ghi nhận nhưng không nhất thiết sửa, vì nó lệch mục tiêu/thông điệp đã chốt ở brief', 'Bỏ hẳn không ghi lại', 'Đổi luôn brief theo phản hồi đó'], correctIndex: 1, explanation: 'Phản hồi được lọc theo brief: cái phá mục tiêu thì sửa ngay, cái chỉ là sở thích cá nhân thì ghi nhận, không nhất thiết đổi.' },
  { id: 'q3', question: 'Câu hỏi "trong một câu, bạn hiểu sản phẩm này đang nói gì?" dùng để kiểm tra điều gì?', options: ['Tốc độ render', 'Thông điệp chính từ brief có thực sự đến được với người xem không', 'Độ phân giải video', 'Tên file có đúng chuẩn không'], correctIndex: 1, explanation: 'Câu hỏi này kiểm tra trực tiếp việc thông điệp cốt lõi (đặt ra từ Giai đoạn 1) có truyền tải được không.' },
]);

const c8 = doc('mep301-8-1-publishing-presentation-defense', '8.1 — Publishing, presentation & defense|||8.1 — Xuất bản, trình bày & bảo vệ đồ án',
  'Xuất file đúng định dạng/nền tảng đích, chuẩn bị bộ nộp đầy đủ (sản phẩm + tài liệu), thuyết trình & bảo vệ trước hội đồng.',
  [[
    `<span class="eyebrow">MEP301 · Stage 8 · Lesson 8.1</span>
<h2>Publishing, presentation &amp; defense</h2>
<h3>Exporting for where it will actually be seen</h3>
<p>Export settings depend on the destination: a social feed video needs different resolution/aspect ratio than a projector screen; a web build needs to be hosted somewhere reachable, not just a local file. Always test the FINAL exported file — not the editing-software preview — on the actual target device/platform.</p>
<h3>The submission package</h3>
<pre><code>Final submission checklist:
 [ ] Finished product, exported at final quality/format
 [ ] Brief (Stage 1)
 [ ] Moodboard, script/content map, storyboard (Stage 2)
 [ ] Style guide + production plan (Stage 3)
 [ ] Feedback log + what changed (Stage 7)
 [ ] Presentation slides/talking points for the defense
</code></pre>
<h3>Presenting &amp; defending</h3>
<p>The defense is not a re-screening — it's you explaining <strong>decisions</strong>: why this brief, why this format, what feedback changed, what you'd do differently with more time. Panels probe weak spots, so prepare honest answers for the parts you know are imperfect rather than only rehearsing the highlights.</p>
<div class="callout"><span class="badge">Deliverable — Stage 8</span> The final exported product + complete documentation package, submitted and presented/defended to the review panel.</div>`,
    `<span class="eyebrow">MEP301 · Giai đoạn 8 · Bài 8.1</span>
<h2>Xuất bản, trình bày &amp; bảo vệ đồ án</h2>
<h3>Xuất file đúng nơi sẽ được xem thật</h3>
<p>Thiết lập xuất phụ thuộc vào nơi phát hành: video cho feed mạng xã hội cần độ phân giải/tỉ lệ khung hình khác với chiếu trên máy chiếu; bản web cần được host ở nơi truy cập được, không chỉ là file trên máy. Luôn kiểm bản xuất CUỐI CÙNG — không phải bản xem trước trong phần mềm dựng — trên đúng thiết bị/nền tảng đích.</p>
<h3>Bộ hồ sơ nộp</h3>
<pre><code>Checklist nộp cuối:
 [ ] Sản phẩm hoàn chỉnh, đã xuất ở chất lượng/định dạng cuối
 [ ] Brief (Giai đoạn 1)
 [ ] Moodboard, script/content map, storyboard (Giai đoạn 2)
 [ ] Style guide + kế hoạch sản xuất (Giai đoạn 3)
 [ ] Log phản hồi + những gì đã thay đổi (Giai đoạn 7)
 [ ] Slide/dàn ý thuyết trình cho buổi bảo vệ
</code></pre>
<h3>Trình bày &amp; bảo vệ</h3>
<p>Buổi bảo vệ không phải chiếu lại sản phẩm — đó là lúc bạn giải thích <strong>quyết định</strong>: vì sao chọn brief này, vì sao chọn định dạng này, phản hồi nào đã làm thay đổi sản phẩm, nếu có thêm thời gian sẽ làm khác gì. Hội đồng thường hỏi đúng vào điểm yếu, nên chuẩn bị câu trả lời thật cho phần bạn biết chưa hoàn hảo, không chỉ luyện phần nổi bật.</p>
<div class="callout"><span class="badge">Deliverable — Giai đoạn 8</span> Sản phẩm đã xuất bản cuối cùng + bộ tài liệu đầy đủ, nộp và thuyết trình/bảo vệ trước hội đồng.</div>`,
  ]]);

const c8q = quiz('mep301-quiz-8', 'Quiz 8 — Publishing & defense|||Quiz 8 — Xuất bản & bảo vệ', [
  { id: 'q1', question: 'Vì sao nên test bản EXPORT cuối cùng trên đúng thiết bị/nền tảng đích, không chỉ xem preview trong phần mềm dựng?', options: ['Vì preview luôn sai màu', 'Vì bản xuất thật có thể khác preview (định dạng, tỉ lệ, cách phát) trên đúng nơi người xem sẽ xem', 'Không cần thiết, preview đủ chính xác', 'Vì phần mềm dựng không cho export'], correctIndex: 1, explanation: 'Preview trong phần mềm không đảm bảo giống hệt file/nền tảng thật mà người xem sẽ trải nghiệm.' },
  { id: 'q2', question: 'Bộ hồ sơ nộp cuối của đồ án MEP301 gồm những gì?', options: ['Chỉ cần sản phẩm cuối cùng', 'Sản phẩm cuối + toàn bộ tài liệu sản xuất (brief, storyboard, kế hoạch, log phản hồi) + phần trình bày', 'Chỉ cần slide thuyết trình', 'Chỉ cần storyboard'], correctIndex: 1, explanation: 'Rubric chấm cả sản phẩm, quy trình/tài liệu, và phần trình bày/bảo vệ.' },
  { id: 'q3', question: 'Buổi bảo vệ đồ án chủ yếu nhằm mục đích gì?', options: ['Chiếu lại sản phẩm cho hội đồng xem lần đầu', 'Giải thích các QUYẾT ĐỊNH sản xuất và trả lời câu hỏi của hội đồng', 'Nộp thêm file mới chưa từng làm', 'Thay thế toàn bộ tài liệu đã nộp'], correctIndex: 1, explanation: 'Bảo vệ là lúc trình bày lý do các quyết định (brief, định dạng, thay đổi theo phản hồi) và trả lời câu hỏi.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'MEP301',
    slug: 'mep301-multimedia-production-project',
    title: 'Multimedia Production Project',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MEP301.webp',
    shortDescription: 'Capstone: plan and ship a real multimedia product through 8 production stages — brief, research & pre-production, design & planning, asset production, post, integration, testing, publishing & defense. Bilingual, with templates & quizzes.|||Đồ án: lập kế hoạch và hoàn thiện một sản phẩm đa phương tiện thật qua 8 giai đoạn — brief, nghiên cứu & tiền sản xuất, thiết kế & kế hoạch, sản xuất tài nguyên, hậu kỳ, tích hợp, kiểm thử, xuất bản & bảo vệ. Song ngữ, có mẫu & quiz.',
    description: 'Môn <strong>MEP301 — Multimedia Production Project</strong> (kỳ 8, khối Quản trị Kinh doanh) là một <strong>đồ án</strong>, không phải môn lý thuyết: nhóm tự chọn brief và sản xuất một sản phẩm đa phương tiện thật (video/tương tác/web) qua <strong>8 giai đoạn sản xuất</strong> — ý tưởng &amp; brief → nghiên cứu &amp; tiền sản xuất (moodboard, kịch bản, storyboard) → thiết kế &amp; lập kế hoạch sản xuất → sản xuất tài nguyên (quay/thiết kế/ghi âm) → hậu kỳ &amp; biên tập → tích hợp đa phương tiện &amp; tương tác → kiểm thử, phản hồi &amp; hoàn thiện → xuất bản, trình bày &amp; bảo vệ đồ án. Trích dẫn "Multimedia: Making It Work" (Vaughan), "Digital Multimedia" (Chapman) và tài liệu Adobe Creative Cloud; song ngữ, có mẫu brief/timeline/checklist thực tế và quiz mỗi giai đoạn.',
    whatYouLearn: 'Viết creative brief (mục tiêu/đối tượng/thông điệp); moodboard, script/content map, storyboard; style guide & kế hoạch sản xuất (timeline, phân vai, rủi ro); sản xuất tài nguyên (quay/chụp, đồ hoạ, ghi âm) đúng shot list; biên tập video/audio (rough cut → fine cut → màu & mix); tích hợp đa phương tiện & điều hướng tương tác; kiểm thử với người xem thật & lọc phản hồi theo brief; xuất bản đúng nền tảng đích & bảo vệ đồ án trước hội đồng.',
    requirements: 'Đã hoàn tất các môn nền đa phương tiện/thiết kế của khối BBA. Cần máy tính có phần mềm dựng video/đồ hoạ cơ bản (vd Adobe Creative Cloud, hoặc công cụ miễn phí tương đương) và làm việc theo nhóm.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách (Vaughan, Chapman), tài liệu Adobe Creative Cloud, kênh học, công cụ, lộ trình đồ án.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đồ án capstone, deliverable, rubric, 8 giai đoạn.', lessons: [intro] },
    { title: 'Giai đoạn 1 — Ý tưởng & brief|||Stage 1 — Idea & brief', description: 'Chọn đề tài, viết creative brief.', lessons: [c1, c1q] },
    { title: 'Giai đoạn 2 — Nghiên cứu & tiền sản xuất|||Stage 2 — Research & pre-production', description: 'Moodboard, script, storyboard.', lessons: [c2, c2q] },
    { title: 'Giai đoạn 3 — Thiết kế & lập kế hoạch sản xuất|||Stage 3 — Design & production planning', description: 'Style guide, timeline, phân vai, rủi ro.', lessons: [c3, c3q] },
    { title: 'Giai đoạn 4 — Sản xuất tài nguyên|||Stage 4 — Asset production', description: 'Quay/chụp, đồ hoạ, ghi âm theo shot list.', lessons: [c4, c4q] },
    { title: 'Giai đoạn 5 — Hậu kỳ & biên tập|||Stage 5 — Post-production & editing', description: 'Rough cut, fine cut, màu & mix âm thanh.', lessons: [c5, c5q] },
    { title: 'Giai đoạn 6 — Tích hợp đa phương tiện & tương tác|||Stage 6 — Multimedia integration & interactivity', description: 'Ghép media, điều hướng, phản hồi.', lessons: [c6, c6q] },
    { title: 'Giai đoạn 7 — Kiểm thử, phản hồi & hoàn thiện|||Stage 7 — Testing, feedback & refinement', description: 'Test người xem thật, lọc phản hồi theo brief.', lessons: [c7, c7q] },
    { title: 'Giai đoạn 8 — Xuất bản, trình bày & bảo vệ đồ án|||Stage 8 — Publishing, presentation & defense', description: 'Xuất bản đúng nền tảng, bộ hồ sơ nộp, bảo vệ.', lessons: [c8, c8q] },
  ],
};
