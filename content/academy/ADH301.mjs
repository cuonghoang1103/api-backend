/**
 * ADH301 — Mobility Applications Design 1 (Thiết kế ứng dụng di động 1 — nền tảng).
 * Ngành Thiết kế mỹ thuật số, Kỳ 7, FPTU. Môn THIẾT KẾ (UX/UI di động), thiên
 * về design không phải code nặng. Giáo trình (trích dẫn): Apple Human Interface
 * Guidelines; Google Material Design; "Don't Make Me Think" (Krug); "The Design
 * of Everyday Things" (Norman); "Refactoring UI" (Wathan/Schoger); tài liệu Figma.
 * Song ngữ VI+EN. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; "\n"→\\n; & trong HTML → &amp; ; < hiển thị → &lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('adh301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: hướng dẫn nền tảng (Apple HIG, Material Design), sách kinh điển (Krug, Norman, Refactoring UI), tài liệu Figma, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ADH301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>mobile app design</strong> — UX research, information architecture, Figma prototyping, visual design, design systems, interaction and accessibility — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, industry-standard resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ADH301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Platform guidelines (read these first)</h3>
<ul>
<li><a href="https://developer.apple.com/design/human-interface-guidelines" target="_blank" rel="noopener">Apple Human Interface Guidelines (HIG)</a> — how iOS apps should look &amp; behave.</li>
<li><a href="https://m3.material.io/" target="_blank" rel="noopener">Google Material Design 3</a> — Android's design system, tokens &amp; components.</li>
</ul>
<h3>📙 Reference books</h3>
<ul>
<li><a href="https://sensible.com/dont-make-me-think/" target="_blank" rel="noopener"><em>Don't Make Me Think</em> — Steve Krug</a> (usability).</li>
<li><a href="https://en.wikipedia.org/wiki/The_Design_of_Everyday_Things" target="_blank" rel="noopener"><em>The Design of Everyday Things</em> — Don Norman</a> (affordances &amp; mental models).</li>
<li><a href="https://www.refactoringui.com/" target="_blank" rel="noopener"><em>Refactoring UI</em> — Wathan &amp; Schoger</a> (practical visual polish).</li>
</ul>
<h3>🎨 Tools &amp; docs</h3>
<ul>
<li><a href="https://help.figma.com/" target="_blank" rel="noopener">Figma Help Center</a> — official docs for wireframing, components, prototyping.</li>
<li><a href="https://www.figma.com/community" target="_blank" rel="noopener">Figma Community</a> — free UI kits (iOS, Material) to learn from.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@figma" target="_blank" rel="noopener">Figma</a> — official tutorials.</li>
<li><a href="https://www.youtube.com/@thefutur" target="_blank" rel="noopener">The Futur</a> — design thinking &amp; process.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — read the HIG &amp; Material intros; learn why mobile differs from web (touch, small screen, context).</li>
<li><strong>UX</strong> — user research, personas, journeys; internalise Krug's "don't make me think".</li>
<li><strong>Build</strong> — wireframe then prototype a small app in Figma; apply layout, type, colour and a component system.</li>
<li><strong>Ship-ready</strong> — add gestures &amp; microinteractions, check accessibility, run a usability test, and hand off to developers.</li>
</ol></div>`,
    `<span class="eyebrow">ADH301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>thiết kế ứng dụng di động</strong> — nghiên cứu UX, kiến trúc thông tin, prototype Figma, thiết kế thị giác, design system, tương tác và accessibility — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, chuẩn ngành.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ADH301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Hướng dẫn nền tảng (đọc trước tiên)</h3>
<ul>
<li><a href="https://developer.apple.com/design/human-interface-guidelines" target="_blank" rel="noopener">Apple Human Interface Guidelines (HIG)</a> — ứng dụng iOS nên trông &amp; hành xử thế nào.</li>
<li><a href="https://m3.material.io/" target="_blank" rel="noopener">Google Material Design 3</a> — design system của Android, token &amp; component.</li>
</ul>
<h3>📙 Sách tham khảo</h3>
<ul>
<li><a href="https://sensible.com/dont-make-me-think/" target="_blank" rel="noopener"><em>Don't Make Me Think</em> — Steve Krug</a> (khả dụng — usability).</li>
<li><a href="https://en.wikipedia.org/wiki/The_Design_of_Everyday_Things" target="_blank" rel="noopener"><em>The Design of Everyday Things</em> — Don Norman</a> (affordance &amp; mô hình tư duy).</li>
<li><a href="https://www.refactoringui.com/" target="_blank" rel="noopener"><em>Refactoring UI</em> — Wathan &amp; Schoger</a> (mẹo làm đẹp thực dụng).</li>
</ul>
<h3>🎨 Công cụ &amp; tài liệu</h3>
<ul>
<li><a href="https://help.figma.com/" target="_blank" rel="noopener">Figma Help Center</a> — tài liệu chính thức cho wireframe, component, prototype.</li>
<li><a href="https://www.figma.com/community" target="_blank" rel="noopener">Figma Community</a> — UI kit miễn phí (iOS, Material) để học theo.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@figma" target="_blank" rel="noopener">Figma</a> — hướng dẫn chính thức.</li>
<li><a href="https://www.youtube.com/@thefutur" target="_blank" rel="noopener">The Futur</a> — tư duy &amp; quy trình thiết kế.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — đọc phần mở đầu HIG &amp; Material; hiểu vì sao mobile khác web (cảm ứng, màn nhỏ, bối cảnh).</li>
<li><strong>UX</strong> — nghiên cứu người dùng, persona, hành trình; thấm câu "đừng bắt tôi phải nghĩ" của Krug.</li>
<li><strong>Dựng</strong> — wireframe rồi prototype một app nhỏ trong Figma; áp layout, typography, màu và một hệ component.</li>
<li><strong>Sẵn sàng bàn giao</strong> — thêm cử chỉ &amp; microinteraction, kiểm accessibility, chạy một buổi usability test, và handoff cho lập trình.</li>
</ol></div>`,
  ]]);

const intro = doc('adh301-0-1-overview', 'Course overview: Designing mobile apps|||Tổng quan: Thiết kế ứng dụng di động',
  'Môn học làm gì; tư duy thiết kế lấy người dùng làm trung tâm; quy trình double diamond; lộ trình 8 chương: nền tảng → UX → IA → prototype → thị giác → design system → tương tác → accessibility & handoff.',
  [[
    `<span class="eyebrow">ADH301 · Lesson 0.1 · Overview</span>
<h2>Designing mobile applications</h2>
<p class="lead">This course teaches you to <strong>design mobile apps that people can actually use</strong> — not to write the code, but to decide what goes on each screen, how a user moves through it, and why it feels right. It is a <strong>design</strong> subject: UX and UI for phones.</p>
<h3>The core mindset</h3>
<p>Great mobile design is <strong>user-centred</strong>. Norman's <em>The Design of Everyday Things</em> and Krug's <em>Don't Make Me Think</em> share one idea: the design, not the user, must carry the effort. If a person has to stop and puzzle out your screen, the design failed.</p>
<h3>The design process (double diamond)</h3>
<pre><code>DISCOVER  ->  DEFINE   ->  DEVELOP   ->  DELIVER
research     the real     ideate &      test &
users        problem      prototype     hand off
(diverge)    (converge)   (diverge)     (converge)
</code></pre>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Mobile design foundations (mobile vs web)</li>
<li>UX basics: research, personas, journeys</li>
<li>Information architecture &amp; navigation</li>
<li>Wireframes &amp; prototypes in Figma</li>
<li>Visual principles: layout, grid, type, colour</li>
<li>Design systems &amp; components (Material/HIG)</li>
<li>Interaction, gestures, animation &amp; microinteractions</li>
<li>Accessibility, usability testing &amp; handoff</li>
</ol>
<div class="callout"><span class="badge">Bilingual &amp; hands-on</span> Every chapter is a bilingual reading plus a short quiz. You'll design a small app end-to-end in Figma as you go.</div>`,
    `<span class="eyebrow">ADH301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế ứng dụng di động</h2>
<p class="lead">Môn này dạy bạn <strong>thiết kế ứng dụng di động mà người ta dùng được thật</strong> — không phải viết code, mà quyết định mỗi màn hình có gì, người dùng đi qua nó ra sao, và vì sao nó "thuận tay". Đây là môn <strong>thiết kế</strong>: UX và UI cho điện thoại.</p>
<h3>Tư duy cốt lõi</h3>
<p>Thiết kế di động tốt phải <strong>lấy người dùng làm trung tâm</strong>. <em>The Design of Everyday Things</em> (Norman) và <em>Don't Make Me Think</em> (Krug) cùng chung một ý: thiết kế phải gánh phần khó, không phải người dùng. Nếu ai đó phải dừng lại để "giải đố" màn hình của bạn, thiết kế đã thất bại.</p>
<h3>Quy trình thiết kế (double diamond)</h3>
<pre><code>KHÁM PHÁ  ->  ĐỊNH NGHĨA -> PHÁT TRIỂN -> BÀN GIAO
nghiên cứu    vấn đề       lên ý &        test &
người dùng    thật sự      prototype      handoff
(mở rộng)     (thu hẹp)    (mở rộng)      (thu hẹp)
</code></pre>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Nền tảng thiết kế di động (mobile vs web)</li>
<li>UX cơ bản: nghiên cứu, persona, hành trình</li>
<li>Kiến trúc thông tin &amp; điều hướng</li>
<li>Wireframe &amp; prototype với Figma</li>
<li>Nguyên tắc thị giác: layout, lưới, chữ, màu</li>
<li>Design system &amp; component (Material/HIG)</li>
<li>Tương tác, cử chỉ, animation &amp; microinteraction</li>
<li>Accessibility, usability testing &amp; handoff</li>
</ol>
<div class="callout"><span class="badge">Song ngữ &amp; thực hành</span> Mỗi chương là một bài đọc song ngữ kèm quiz ngắn. Xuyên suốt, bạn sẽ thiết kế một app nhỏ trọn vẹn trong Figma.</div>`,
  ]]);

const c1 = doc('adh301-1-1-foundations', '1.1 — Mobile design foundations|||1.1 — Nền tảng thiết kế di động',
  'Vì sao mobile khác web: cảm ứng vs con trỏ, màn hình nhỏ & dọc, bối cảnh dùng (di chuyển, một tay), tài nguyên hạn chế; vùng chạm ngón cái; kích thước chạm tối thiểu.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 1 · Lesson 1.1</span>
<h2>Mobile design foundations</h2>
<p>A phone is not a small desktop. Designing for it well starts with respecting four differences.</p>
<h3>Mobile vs web — four key differences</h3>
<pre><code>              WEB / DESKTOP        MOBILE
Input         mouse (precise)      finger (imprecise, fat)
Screen        large, wide          small, tall, one-handed
Context       sitting, focused     moving, interrupted, glancing
Resources     stable power/net     battery, patchy network
</code></pre>
<h3>Consequences for your design</h3>
<ul>
<li><strong>Touch, not hover.</strong> There is no hover state to reveal things — controls must be visible. Make tap targets big: Apple recommends <strong>44&times;44 pt</strong>, Material <strong>48&times;48 dp</strong>.</li>
<li><strong>Thumb zone.</strong> One-handed users reach the bottom of the screen easily and the top corners hardly at all — put primary actions low.</li>
<li><strong>One task per screen.</strong> Small screens punish clutter; show the one thing that matters now.</li>
<li><strong>Design for interruption.</strong> People use phones in seconds-long bursts — save state, avoid long forms.</li>
</ul>
<pre><code>Thumb reach map (right hand):
+---------------------+
|  hard   ok    HARD  |   top corners = hardest
|  ok    easy    ok   |
|  EASY  EASY   easy  |   bottom = natural reach
+---------------------+
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Primary, frequent actions go in the bottom half; destructive or rare ones stay out of the easy zone.</div>`,
    `<span class="eyebrow">ADH301 · Chương 1 · Bài 1.1</span>
<h2>Nền tảng thiết kế di động</h2>
<p>Điện thoại không phải máy tính thu nhỏ. Thiết kế tốt cho nó bắt đầu bằng việc tôn trọng bốn khác biệt.</p>
<h3>Mobile vs web — bốn khác biệt chính</h3>
<pre><code>              WEB / DESKTOP        MOBILE
Nhập liệu     chuột (chính xác)    ngón tay (to, kém chính xác)
Màn hình      lớn, rộng            nhỏ, cao, dùng một tay
Bối cảnh      ngồi, tập trung      di chuyển, bị ngắt, liếc nhanh
Tài nguyên    điện/mạng ổn định    pin, mạng chập chờn
</code></pre>
<h3>Hệ quả cho thiết kế</h3>
<ul>
<li><strong>Chạm, không rê chuột.</strong> Không có trạng thái hover để lộ thứ ẩn — điều khiển phải hiện rõ. Vùng chạm phải lớn: Apple khuyến nghị <strong>44&times;44 pt</strong>, Material <strong>48&times;48 dp</strong>.</li>
<li><strong>Vùng ngón cái.</strong> Người dùng một tay với tới đáy màn hình dễ dàng, còn hai góc trên thì rất khó — đặt hành động chính ở phía dưới.</li>
<li><strong>Một việc mỗi màn hình.</strong> Màn nhỏ trừng phạt sự lộn xộn; chỉ hiện đúng thứ đang cần.</li>
<li><strong>Thiết kế cho sự gián đoạn.</strong> Người ta dùng điện thoại từng đợt vài giây — lưu trạng thái, tránh form dài.</li>
</ul>
<pre><code>Bản đồ tầm với ngón cái (tay phải):
+---------------------+
|  khó   ổn    KHÓ    |   góc trên = khó nhất
|  ổn    dễ    ổn     |
|  DỄ    DỄ    dễ     |   đáy = tầm với tự nhiên
+---------------------+
</code></pre>
<div class="callout"><span class="badge">Quy tắc ngón cái</span> Hành động chính, hay dùng đặt ở nửa dưới; hành động nguy hiểm hoặc hiếm để ngoài vùng dễ với.</div>`,
  ]]);

const c1q = quiz('adh301-quiz-1', 'Quiz 1 — Foundations|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'Khác biệt lớn nhất khi thiết kế cho mobile so với web là gì?', options: ['Màn hình luôn to hơn', 'Dùng ngón tay (cảm ứng) thay vì chuột, không có hover', 'Không có màu sắc', 'Chỉ chạy được văn bản'], correctIndex: 1, explanation: 'Mobile nhập bằng ngón tay kém chính xác và không có trạng thái hover, nên điều khiển phải hiện rõ và vùng chạm phải lớn.' },
  { id: 'q2', question: 'Kích thước vùng chạm tối thiểu Apple HIG khuyến nghị là?', options: ['10×10 pt', '24×24 pt', '44×44 pt', '100×100 pt'], correctIndex: 2, explanation: 'Apple khuyến nghị tối thiểu 44×44 pt (Material là 48×48 dp) để ngón tay chạm chính xác.' },
  { id: 'q3', question: 'Nên đặt hành động chính, hay dùng ở đâu trên màn hình điện thoại?', options: ['Góc trên bên trái', 'Nửa dưới màn hình (vùng ngón cái dễ với)', 'Chính giữa và ẩn đi', 'Chỗ nào cũng được'], correctIndex: 1, explanation: 'Người dùng một tay với tới nửa dưới dễ nhất, nên hành động chính đặt ở đó; góc trên khó với nhất.' },
]);

const c2 = doc('adh301-2-1-ux-research', '2.1 — UX basics: research, personas, journeys|||2.1 — UX cơ bản: nghiên cứu, persona, hành trình',
  'Nghiên cứu người dùng (phỏng vấn, khảo sát, quan sát); tổng hợp thành persona; user journey map để lộ điểm đau; phân biệt điều người dùng NÓI và điều họ LÀM.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 2 · Lesson 2.1</span>
<h2>UX basics: research, personas, journeys</h2>
<p>You are not the user. Good UX starts by learning who the user really is and what they are trying to do.</p>
<h3>User research methods</h3>
<ul>
<li><strong>Interviews</strong> — talk to a handful of real users; ask about behaviour, not opinions ("tell me about the last time you..." beats "would you like...").</li>
<li><strong>Surveys</strong> — reach many people for patterns at scale.</li>
<li><strong>Observation</strong> — watch what people actually do; Norman warns that what users <em>say</em> and what they <em>do</em> often differ.</li>
</ul>
<h3>Persona — a research summary</h3>
<pre><code>PERSONA: "Busy Mai", 28, sales rep
Goals    : log expenses in under 30s between meetings
Frustration: current app needs 6 taps + a login every time
Context  : one hand, on the move, weak signal
Devices  : mid-range Android, small screen
</code></pre>
<h3>User journey map</h3>
<p>A journey map lays out the steps a persona takes to reach a goal, and the emotion at each step — exposing the <strong>pain points</strong> your design must fix.</p>
<pre><code>Step:    Open -> Find "add" -> Fill form -> Attach photo -> Save
Feeling:  :)      :|            :(           :(             :)
Pain:            button hidden  too long     unclear how
</code></pre>
<div class="callout"><span class="badge">Design for goals, not features</span> Persona goals and journey pain points tell you WHAT to design before you draw a single screen.</div>`,
    `<span class="eyebrow">ADH301 · Chương 2 · Bài 2.1</span>
<h2>UX cơ bản: nghiên cứu, persona, hành trình</h2>
<p>Bạn không phải là người dùng. UX tốt bắt đầu bằng việc tìm hiểu người dùng thật sự là ai và họ đang cố làm gì.</p>
<h3>Phương pháp nghiên cứu người dùng</h3>
<ul>
<li><strong>Phỏng vấn</strong> — nói chuyện với vài người dùng thật; hỏi về hành vi, không phải ý kiến ("kể tôi nghe lần gần nhất bạn..." tốt hơn "bạn có muốn...").</li>
<li><strong>Khảo sát</strong> — chạm tới nhiều người để thấy quy luật ở quy mô lớn.</li>
<li><strong>Quan sát</strong> — xem người ta thực sự làm gì; Norman cảnh báo điều người dùng <em>nói</em> và điều họ <em>làm</em> thường khác nhau.</li>
</ul>
<h3>Persona — bản tóm tắt nghiên cứu</h3>
<pre><code>PERSONA: "Mai bận rộn", 28, nhân viên kinh doanh
Mục tiêu   : ghi chi phí dưới 30 giây giữa các cuộc họp
Bức bối    : app hiện tại cần 6 lần chạm + đăng nhập mỗi lần
Bối cảnh   : một tay, đang di chuyển, sóng yếu
Thiết bị   : Android tầm trung, màn hình nhỏ
</code></pre>
<h3>Bản đồ hành trình (journey map)</h3>
<p>Journey map bày ra các bước một persona đi để đạt mục tiêu, và cảm xúc ở mỗi bước — làm lộ <strong>điểm đau</strong> mà thiết kế phải sửa.</p>
<pre><code>Bước:    Mở -> Tìm "thêm" -> Điền form -> Đính ảnh -> Lưu
Cảm xúc:  :)      :|            :(           :(          :)
Đau:            nút bị ẩn      quá dài      không rõ cách
</code></pre>
<div class="callout"><span class="badge">Thiết kế theo mục tiêu, không theo tính năng</span> Mục tiêu của persona và điểm đau trong hành trình cho biết CẦN thiết kế gì trước khi bạn vẽ một màn hình nào.</div>`,
  ]]);

const c2q = quiz('adh301-quiz-2', 'Quiz 2 — UX research|||Quiz 2 — Nghiên cứu UX', [
  { id: 'q1', question: 'Một persona trong UX là gì?', options: ['Một nhân vật hư cấu để quảng cáo', 'Bản tóm tắt dựa trên nghiên cứu về một nhóm người dùng điển hình (mục tiêu, bức bối, bối cảnh)', 'Tên của nhà thiết kế', 'Một màu chủ đạo'], correctIndex: 1, explanation: 'Persona đúc kết từ nghiên cứu thật, mô tả mục tiêu, bức bối và bối cảnh của một nhóm người dùng để cả nhóm cùng thiết kế cho họ.' },
  { id: 'q2', question: 'Vì sao nên QUAN SÁT hành vi thay vì chỉ hỏi ý kiến người dùng?', options: ['Vì quan sát nhanh hơn', 'Vì điều người dùng NÓI và điều họ LÀM thường khác nhau', 'Vì hỏi ý kiến là bất hợp pháp', 'Vì người dùng không biết nói'], correctIndex: 1, explanation: 'Norman chỉ ra rằng lời nói của người dùng thường lệch với hành vi thực; quan sát cho dữ liệu đáng tin hơn.' },
  { id: 'q3', question: 'Bản đồ hành trình (user journey map) giúp lộ ra điều gì?', options: ['Bảng màu của app', 'Các điểm đau (pain points) và cảm xúc ở từng bước người dùng đi', 'Mã nguồn của app', 'Giá bán của app'], correctIndex: 1, explanation: 'Journey map bày các bước và cảm xúc tương ứng, làm lộ điểm đau mà thiết kế cần sửa.' },
]);

const c3 = doc('adh301-3-1-ia-navigation', '3.1 — Information architecture & navigation|||3.1 — Kiến trúc thông tin & điều hướng',
  'Sắp xếp nội dung (card sorting, cây phân cấp); mẫu điều hướng di động: tab bar, stack (push/back), drawer, modal; khi nào dùng cái nào; quy tắc 3 tap.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 3 · Lesson 3.1</span>
<h2>Information architecture &amp; navigation</h2>
<p><strong>Information architecture (IA)</strong> is how you organise content so people can find things. Krug's rule: users should never have to think about <em>where</em> they are or <em>how</em> to get back.</p>
<h3>Building the structure</h3>
<p><strong>Card sorting</strong> — write each piece of content on a card and ask users to group them; their groups become your menu structure. The result is a <strong>hierarchy</strong> (tree) of screens.</p>
<h3>The four core mobile navigation patterns</h3>
<pre><code>TAB BAR   bottom bar, 3-5 top-level areas, always visible
          -> use for peer sections you switch between often
STACK     push a screen, back to return (list -> detail)
          -> use for drilling into content
DRAWER    hidden side menu behind a hamburger
          -> use for many, rarely-used destinations
MODAL     covers the screen for one focused task
          -> use for create/edit; must be dismissible
</code></pre>
<h3>Choosing a pattern</h3>
<ul>
<li>3-5 main areas people hop between &rarr; <strong>tab bar</strong> (most discoverable).</li>
<li>Browsing into detail &rarr; <strong>stack</strong> with a clear back affordance.</li>
<li>Lots of secondary links &rarr; <strong>drawer</strong> (but hidden = less discovered).</li>
</ul>
<div class="callout"><span class="badge">Don't make me think</span> Aim for any key screen within about 3 taps, always show where the user is, and always give a way back.</div>`,
    `<span class="eyebrow">ADH301 · Chương 3 · Bài 3.1</span>
<h2>Kiến trúc thông tin &amp; điều hướng</h2>
<p><strong>Kiến trúc thông tin (IA)</strong> là cách bạn tổ chức nội dung để người ta tìm được thứ cần. Quy tắc của Krug: người dùng không bao giờ phải nghĩ mình <em>đang ở đâu</em> hay <em>quay lại thế nào</em>.</p>
<h3>Dựng cấu trúc</h3>
<p><strong>Card sorting</strong> — ghi mỗi mẩu nội dung lên một thẻ và nhờ người dùng gom nhóm; nhóm của họ trở thành cấu trúc menu. Kết quả là một <strong>cây phân cấp</strong> các màn hình.</p>
<h3>Bốn mẫu điều hướng di động cốt lõi</h3>
<pre><code>TAB BAR   thanh dưới, 3-5 khu vực cấp cao, luôn hiện
          -> dùng cho các mục ngang hàng hay chuyển qua lại
STACK     đẩy màn hình mới, back để quay lại (danh sách -> chi tiết)
          -> dùng khi đào sâu vào nội dung
DRAWER    menu bên ẩn sau nút hamburger
          -> dùng cho nhiều đích ít khi dùng
MODAL     phủ kín màn hình cho một việc tập trung
          -> dùng để tạo/sửa; phải đóng được
</code></pre>
<h3>Chọn mẫu nào</h3>
<ul>
<li>3-5 khu vực chính hay nhảy qua lại &rarr; <strong>tab bar</strong> (dễ thấy nhất).</li>
<li>Duyệt vào chi tiết &rarr; <strong>stack</strong> với nút back rõ ràng.</li>
<li>Nhiều liên kết phụ &rarr; <strong>drawer</strong> (nhưng ẩn = ít được phát hiện).</li>
</ul>
<div class="callout"><span class="badge">Đừng bắt tôi phải nghĩ</span> Hướng tới mọi màn hình quan trọng trong khoảng 3 lần chạm, luôn cho biết người dùng đang ở đâu, và luôn có đường quay lại.</div>`,
  ]]);

const c3q = quiz('adh301-quiz-3', 'Quiz 3 — IA & navigation|||Quiz 3 — IA & điều hướng', [
  { id: 'q1', question: 'Mẫu điều hướng nào phù hợp nhất cho 3-5 khu vực chính mà người dùng thường xuyên chuyển qua lại?', options: ['Drawer (menu ẩn)', 'Tab bar (thanh tab dưới)', 'Modal', 'Không cần điều hướng'], correctIndex: 1, explanation: 'Tab bar luôn hiện và dễ phát hiện nhất, hợp cho 3-5 mục ngang hàng người dùng hay chuyển qua lại.' },
  { id: 'q2', question: 'Kỹ thuật card sorting dùng để làm gì?', options: ['Chọn bảng màu', 'Nhờ người dùng gom nhóm nội dung để tạo cấu trúc menu (IA)', 'Đo tốc độ tải app', 'Vẽ animation'], correctIndex: 1, explanation: 'Card sorting để người dùng gom nhóm nội dung; các nhóm đó trở thành cấu trúc điều hướng của app.' },
  { id: 'q3', question: 'Mẫu điều hướng "stack" thường dùng khi nào?', options: ['Chuyển giữa các mục ngang hàng', 'Đào sâu từ danh sách vào chi tiết (push màn hình, back để quay lại)', 'Hiện một việc tập trung rồi đóng', 'Ẩn nhiều liên kết ít dùng'], correctIndex: 1, explanation: 'Stack đẩy màn hình mới lên khi đi từ danh sách vào chi tiết, và nút back đưa người dùng trở lại.' },
]);

const c4 = doc('adh301-4-1-wireframe-prototype', '4.1 — Wireframes & prototypes in Figma|||4.1 — Wireframe & prototype với Figma',
  'Độ trung thực (lo-fi → hi-fi); wireframe khung xám tập trung bố cục; Figma: frame, auto layout, component, prototype nối màn hình bằng interaction; vì sao prototype trước khi tô màu.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 4 · Lesson 4.1</span>
<h2>Wireframes &amp; prototypes in Figma</h2>
<h3>Fidelity: start low, go high</h3>
<pre><code>SKETCH   pen &amp; paper, seconds per screen, throwaway
LO-FI    grey boxes, no colour/type, focus on LAYOUT + flow
HI-FI    real colour, type, images - looks like the app
</code></pre>
<p>Design in that order. A <strong>wireframe</strong> is deliberately grey and plain so you argue about <em>structure</em>, not about the shade of blue.</p>
<h3>Figma essentials</h3>
<ul>
<li><strong>Frame</strong> — a screen (start from a device preset, e.g. iPhone).</li>
<li><strong>Auto layout</strong> — elements flow and space themselves; the layout survives content changes.</li>
<li><strong>Components</strong> — a master element reused everywhere; edit the master, all copies update.</li>
<li><strong>Prototype</strong> — draw links between frames and pick an interaction (on tap &rarr; navigate to) to make it clickable.</li>
</ul>
<pre><code>Lo-fi wireframe of a list screen:
+-----------------------------+
|  [=]   My Expenses     [+]  |  <- header: menu, title, add
+-----------------------------+
|  [img]  Lunch        45,000 |
|  [img]  Taxi         80,000 |
|  [img]  Coffee       30,000 |
+-----------------------------+
|  [Home] [Stats] [Profile]   |  <- tab bar
+-----------------------------+
</code></pre>
<div class="callout"><span class="badge">Prototype before you polish</span> A clickable lo-fi prototype lets you test the flow with users in a day — fixing a grey box is cheap, fixing a coded screen is not.</div>`,
    `<span class="eyebrow">ADH301 · Chương 4 · Bài 4.1</span>
<h2>Wireframe &amp; prototype với Figma</h2>
<h3>Độ trung thực: bắt đầu thấp, tiến lên cao</h3>
<pre><code>PHÁC TAY   bút &amp; giấy, vài giây mỗi màn, bỏ đi được
LO-FI      khối xám, không màu/chữ, tập trung BỐ CỤC + luồng
HI-FI      màu, chữ, ảnh thật - trông như app thật
</code></pre>
<p>Thiết kế theo thứ tự đó. <strong>Wireframe</strong> cố tình để xám và trơn để bạn tranh luận về <em>cấu trúc</em>, chứ không phải về sắc xanh nào đẹp.</p>
<h3>Figma cốt lõi</h3>
<ul>
<li><strong>Frame</strong> — một màn hình (bắt đầu từ preset thiết bị, vd iPhone).</li>
<li><strong>Auto layout</strong> — phần tử tự dàn và tự giãn cách; bố cục sống sót khi nội dung đổi.</li>
<li><strong>Component</strong> — một phần tử gốc dùng lại khắp nơi; sửa gốc, mọi bản sao cập nhật theo.</li>
<li><strong>Prototype</strong> — nối các frame bằng liên kết và chọn tương tác (khi chạm &rarr; đi tới) để bấm chạy được.</li>
</ul>
<pre><code>Wireframe lo-fi màn danh sách:
+-----------------------------+
|  [=]   Chi tiêu       [+]   |  <- header: menu, tiêu đề, thêm
+-----------------------------+
|  [img]  Ăn trưa      45.000 |
|  [img]  Taxi         80.000 |
|  [img]  Cà phê       30.000 |
+-----------------------------+
|  [Trang chủ] [TK] [Hồ sơ]   |  <- tab bar
+-----------------------------+
</code></pre>
<div class="callout"><span class="badge">Prototype trước khi làm đẹp</span> Prototype lo-fi bấm được cho bạn test luồng với người dùng trong một ngày — sửa một khối xám thì rẻ, sửa một màn đã code thì không.</div>`,
  ]]);

const c4q = quiz('adh301-quiz-4', 'Quiz 4 — Wireframe & Figma|||Quiz 4 — Wireframe & Figma', [
  { id: 'q1', question: 'Vì sao wireframe (lo-fi) thường để màu xám, trơn, không màu sắc?', options: ['Vì thiếu thời gian', 'Để tập trung tranh luận về bố cục và luồng, không sa đà vào màu sắc', 'Vì Figma không có màu', 'Vì màu làm chậm app'], correctIndex: 1, explanation: 'Lo-fi cố tình để trơn để mọi người bàn về cấu trúc/luồng thay vì tranh cãi màu sắc — thay đổi khi đó còn rất rẻ.' },
  { id: 'q2', question: 'Tính năng "Component" trong Figma cho lợi ích gì?', options: ['Tự viết code', 'Một phần tử gốc dùng lại khắp nơi — sửa gốc thì mọi bản sao cập nhật theo', 'Tăng độ phân giải ảnh', 'Xoá màn hình thừa'], correctIndex: 1, explanation: 'Component là phần tử gốc; chỉnh master một lần, tất cả instance cập nhật — nhất quán và nhanh.' },
  { id: 'q3', question: 'Trình tự độ trung thực hợp lý khi thiết kế là?', options: ['Hi-fi → lo-fi → phác tay', 'Phác tay → lo-fi → hi-fi', 'Chỉ làm hi-fi ngay', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'Bắt đầu từ phác tay/lo-fi để chốt cấu trúc rẻ, rồi mới nâng lên hi-fi với màu, chữ, ảnh thật.' },
]);

const c5 = doc('adh301-5-1-visual-principles', '5.1 — Visual principles: layout, grid, type, colour|||5.1 — Nguyên tắc thị giác: layout, lưới, chữ, màu',
  'Hệ khoảng cách 8pt & lưới; hệ thống phân cấp thị giác; typography cho mobile (cỡ tối thiểu ~16sp, thang cỡ); màu: 60-30-10, contrast, đừng chỉ dựa vào màu; mẹo từ Refactoring UI.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 5 · Lesson 5.1</span>
<h2>Visual principles: layout, grid, type, colour</h2>
<h3>Spacing &amp; grid</h3>
<p>Use a consistent <strong>spacing scale</strong> — most systems use multiples of <strong>8</strong> (4, 8, 16, 24, 32). Consistent spacing is the single fastest way to make a screen look designed rather than thrown together (a core <em>Refactoring UI</em> lesson).</p>
<h3>Visual hierarchy</h3>
<p>Guide the eye: the most important thing should be the most prominent. Control hierarchy with <strong>size, weight, colour and spacing</strong> — not just size. A muted label above a bold value reads instantly.</p>
<h3>Typography for mobile</h3>
<pre><code>Type scale (example):
  Display  32 / bold      screen titles
  Title    20 / semibold  section headers
  Body     16 / regular   main text  (do NOT go below ~16)
  Caption  13 / regular   metadata, hints
Line length: keep comfortable; line-height ~1.4 for body.
</code></pre>
<h3>Colour</h3>
<ul>
<li><strong>60-30-10</strong> — ~60% dominant/neutral, 30% secondary, 10% accent for actions.</li>
<li><strong>Contrast</strong> — body text should meet WCAG AA (about 4.5:1) so it is readable in sunlight.</li>
<li><strong>Never rely on colour alone</strong> — pair it with an icon or label (colour-blind users, glare).</li>
</ul>
<div class="callout"><span class="badge">Refactoring UI tip</span> Start in greyscale. If the hierarchy works without colour, colour only makes it better; if it doesn't, colour won't save it.</div>`,
    `<span class="eyebrow">ADH301 · Chương 5 · Bài 5.1</span>
<h2>Nguyên tắc thị giác: layout, lưới, chữ, màu</h2>
<h3>Khoảng cách &amp; lưới</h3>
<p>Dùng một <strong>thang khoảng cách</strong> nhất quán — phần lớn hệ thống dùng bội của <strong>8</strong> (4, 8, 16, 24, 32). Khoảng cách nhất quán là cách nhanh nhất khiến màn hình trông "có thiết kế" thay vì chắp vá (một bài học cốt lõi của <em>Refactoring UI</em>).</p>
<h3>Phân cấp thị giác</h3>
<p>Dẫn dắt ánh mắt: thứ quan trọng nhất phải nổi bật nhất. Điều khiển phân cấp bằng <strong>cỡ, độ đậm, màu và khoảng cách</strong> — không chỉ bằng cỡ chữ. Một nhãn mờ nhạt phía trên một con số đậm đọc được ngay.</p>
<h3>Typography cho mobile</h3>
<pre><code>Thang cỡ chữ (ví dụ):
  Display  32 / bold      tiêu đề màn hình
  Title    20 / semibold  tiêu đề mục
  Body     16 / regular   chữ chính  (ĐỪNG nhỏ hơn ~16)
  Caption  13 / regular   dữ liệu phụ, gợi ý
Độ dài dòng: giữ dễ chịu; line-height ~1.4 cho body.
</code></pre>
<h3>Màu sắc</h3>
<ul>
<li><strong>60-30-10</strong> — ~60% màu nền/trung tính, 30% màu phụ, 10% màu nhấn cho hành động.</li>
<li><strong>Tương phản</strong> — chữ body nên đạt WCAG AA (khoảng 4.5:1) để đọc được cả dưới nắng.</li>
<li><strong>Đừng chỉ dựa vào màu</strong> — ghép thêm icon hoặc nhãn (người mù màu, chói nắng).</li>
</ul>
<div class="callout"><span class="badge">Mẹo Refactoring UI</span> Bắt đầu bằng thang xám. Nếu phân cấp đã ổn khi không màu thì màu chỉ làm tốt hơn; nếu chưa ổn thì màu cũng không cứu được.</div>`,
  ]]);

const c5q = quiz('adh301-quiz-5', 'Quiz 5 — Visual principles|||Quiz 5 — Nguyên tắc thị giác', [
  { id: 'q1', question: 'Vì sao nên dùng thang khoảng cách theo bội của 8 (8pt grid)?', options: ['Vì số 8 may mắn', 'Để khoảng cách nhất quán, màn hình trông có thiết kế thay vì chắp vá', 'Vì màn hình chỉ hiểu số 8', 'Để app chạy nhanh hơn'], correctIndex: 1, explanation: 'Hệ khoảng cách nhất quán (bội của 8) tạo nhịp điệu đều, khiến giao diện gọn gàng, chuyên nghiệp.' },
  { id: 'q2', question: 'Cỡ chữ body tối thiểu nên dùng cho mobile là khoảng?', options: ['8sp', '16sp', '40sp', 'Càng nhỏ càng tốt'], correctIndex: 1, explanation: 'Chữ nội dung chính nên khoảng 16sp trở lên để đọc thoải mái trên màn hình nhỏ.' },
  { id: 'q3', question: 'Vì sao KHÔNG nên truyền đạt thông tin chỉ bằng màu sắc?', options: ['Vì màu tốn pin', 'Vì người mù màu hoặc điều kiện chói nắng sẽ không phân biệt được — cần thêm icon/nhãn', 'Vì màu là bất hợp pháp', 'Vì màu làm chậm app'], correctIndex: 1, explanation: 'Chỉ dựa vào màu loại trừ người mù màu và khó thấy khi chói; luôn ghép màu với icon hoặc nhãn.' },
]);

const c6 = doc('adh301-6-1-design-systems', '6.1 — Design systems & components|||6.1 — Design system & component',
  'Design system là gì (token + component + hướng dẫn); design token (màu/khoảng cách/chữ); component tái sử dụng & trạng thái; Material Design vs Apple HIG — theo nền tảng.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 6 · Lesson 6.1</span>
<h2>Design systems &amp; components</h2>
<p>A <strong>design system</strong> is the single source of truth for a product's UI: reusable components, the rules for using them, and the <strong>design tokens</strong> underneath.</p>
<h3>The three layers</h3>
<pre><code>TOKENS      named values: color/primary = #2563EB, space/md = 16
COMPONENTS  reusable UI built from tokens: Button, Card, Input
GUIDELINES  when &amp; how to use each; do's and don'ts
</code></pre>
<p>Change a token (say the brand colour) and every component using it updates at once — consistency for free.</p>
<h3>Components have states</h3>
<p>A real component is not one picture. A button needs: <strong>default, pressed, disabled, loading</strong>. Design them all, or developers will guess.</p>
<h3>Two platforms, two systems</h3>
<ul>
<li><strong>Material Design</strong> (Android/Google) — elevation, FAB, ripple, bottom nav.</li>
<li><strong>Apple HIG</strong> (iOS) — clarity, tab bar, native controls, SF font.</li>
</ul>
<p>Respect the platform: an app that feels iOS-native on iPhone and Material on Android feels "right" to each user. Don't force one look onto both blindly.</p>
<div class="callout"><span class="badge">Consistency scales</span> Reusing components (not reinventing each screen) makes design faster, handoff cleaner, and the product feel like one app.</div>`,
    `<span class="eyebrow">ADH301 · Chương 6 · Bài 6.1</span>
<h2>Design system &amp; component</h2>
<p>Một <strong>design system</strong> là nguồn sự thật duy nhất cho giao diện của sản phẩm: các component tái sử dụng, quy tắc dùng chúng, và các <strong>design token</strong> bên dưới.</p>
<h3>Ba lớp</h3>
<pre><code>TOKEN       giá trị đặt tên: color/primary = #2563EB, space/md = 16
COMPONENT   UI tái dùng dựng từ token: Button, Card, Input
HƯỚNG DẪN   khi nào &amp; dùng ra sao; nên và không nên
</code></pre>
<p>Đổi một token (vd màu thương hiệu) là mọi component dùng nó cập nhật cùng lúc — nhất quán mà không tốn công.</p>
<h3>Component có trạng thái</h3>
<p>Một component thật không phải một tấm hình. Nút cần: <strong>mặc định, đang nhấn, vô hiệu, đang tải</strong>. Thiết kế đủ hết, nếu không lập trình viên sẽ phải đoán.</p>
<h3>Hai nền tảng, hai hệ thống</h3>
<ul>
<li><strong>Material Design</strong> (Android/Google) — đổ bóng (elevation), nút FAB, hiệu ứng ripple, thanh điều hướng dưới.</li>
<li><strong>Apple HIG</strong> (iOS) — sự rõ ràng, tab bar, điều khiển gốc, font SF.</li>
</ul>
<p>Tôn trọng nền tảng: một app cảm giác iOS trên iPhone và Material trên Android sẽ thấy "đúng" với từng người dùng. Đừng ép một kiểu lên cả hai một cách mù quáng.</p>
<div class="callout"><span class="badge">Nhất quán mở rộng được</span> Tái dùng component (thay vì vẽ lại mỗi màn) giúp thiết kế nhanh hơn, handoff sạch hơn, và sản phẩm cảm giác là một app thống nhất.</div>`,
  ]]);

const c6q = quiz('adh301-quiz-6', 'Quiz 6 — Design systems|||Quiz 6 — Design system', [
  { id: 'q1', question: 'Design token trong một design system là gì?', options: ['Một loại tiền điện tử', 'Giá trị được đặt tên (màu, khoảng cách, cỡ chữ) dùng lại khắp nơi', 'Một màn hình đăng nhập', 'Tên của designer'], correctIndex: 1, explanation: 'Token là giá trị đặt tên (vd color/primary, space/md); đổi token là mọi component dùng nó tự cập nhật.' },
  { id: 'q2', question: 'Vì sao phải thiết kế đủ các trạng thái của một component (mặc định, nhấn, vô hiệu, tải)?', options: ['Để tốn thời gian hơn', 'Vì component thật có nhiều trạng thái; thiếu thì lập trình viên phải đoán', 'Vì Figma bắt buộc', 'Vì trạng thái làm app đẹp hơn'], correctIndex: 1, explanation: 'Một nút không chỉ là một hình; đủ trạng thái giúp handoff rõ ràng và trải nghiệm nhất quán.' },
  { id: 'q3', question: 'Material Design và Apple HIG khác nhau ở điểm nào?', options: ['Không khác gì', 'Là hai hệ thiết kế của Android/Google và iOS/Apple — nên tôn trọng nền tảng tương ứng', 'HIG dành cho web', 'Material chỉ có màu đen'], correctIndex: 1, explanation: 'Material là chuẩn của Android, HIG là chuẩn của iOS; thiết kế nên bám theo nền tảng để người dùng thấy "đúng".' },
]);

const c7 = doc('adh301-7-1-interaction-motion', '7.1 — Interaction, gestures, animation & microinteractions|||7.1 — Tương tác, cử chỉ, animation & microinteraction',
  'Cử chỉ cảm ứng (tap, swipe, long-press, pinch); phản hồi tức thời & affordance; animation có mục đích (chuyển tiếp, định hướng); microinteraction (trigger→rules→feedback); đừng lạm dụng.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 7 · Lesson 7.1</span>
<h2>Interaction, gestures, animation &amp; microinteractions</h2>
<h3>Touch gestures</h3>
<pre><code>Tap          select / activate (the click of mobile)
Double tap   zoom / like
Long press   context menu / secondary actions
Swipe        scroll, delete, dismiss, navigate pages
Pinch        zoom in/out
</code></pre>
<p>Use standard gestures for their standard meaning. Hidden gestures with no visible hint break Norman's <strong>discoverability</strong> — always give an <strong>affordance</strong> (a visual cue that an action is possible).</p>
<h3>Feedback</h3>
<p>Every action needs an immediate response — a press state, a ripple, a spinner. Silence makes users tap again and doubt the app.</p>
<h3>Animation with purpose</h3>
<ul>
<li><strong>Transitions</strong> — a screen sliding in shows where it came from and how to get back.</li>
<li><strong>Orientation</strong> — motion tells the eye what changed.</li>
<li>Keep it fast (roughly 200-300 ms). Slow animation is friction, not delight.</li>
</ul>
<h3>Microinteractions</h3>
<pre><code>A microinteraction has 4 parts:
  TRIGGER   user pulls the list down
  RULES     what happens (start a refresh)
  FEEDBACK  spinner + subtle bounce
  LOOP/END  stop when data arrives
</code></pre>
<div class="callout"><span class="badge">Restraint</span> Motion should clarify, not show off. If an animation slows the user down or repeats until annoying, cut it.</div>`,
    `<span class="eyebrow">ADH301 · Chương 7 · Bài 7.1</span>
<h2>Tương tác, cử chỉ, animation &amp; microinteraction</h2>
<h3>Cử chỉ cảm ứng</h3>
<pre><code>Chạm (tap)   chọn / kích hoạt (cú "click" của mobile)
Chạm đúp     phóng to / thích
Nhấn giữ     menu ngữ cảnh / hành động phụ
Vuốt         cuộn, xoá, bỏ qua, chuyển trang
Chụm         phóng to/thu nhỏ
</code></pre>
<p>Dùng cử chỉ chuẩn với ý nghĩa chuẩn của nó. Cử chỉ ẩn không có gợi ý phá vỡ <strong>khả năng phát hiện</strong> của Norman — luôn tạo <strong>affordance</strong> (dấu hiệu thị giác cho biết có thể tác động).</p>
<h3>Phản hồi</h3>
<p>Mọi hành động cần phản hồi tức thì — trạng thái nhấn, hiệu ứng ripple, vòng xoay. Im lặng khiến người dùng chạm lại và nghi ngờ app hỏng.</p>
<h3>Animation có mục đích</h3>
<ul>
<li><strong>Chuyển tiếp</strong> — màn hình trượt vào cho thấy nó từ đâu tới và cách quay lại.</li>
<li><strong>Định hướng</strong> — chuyển động nói cho mắt biết cái gì vừa thay đổi.</li>
<li>Giữ nhanh (khoảng 200-300 ms). Animation chậm là ma sát, không phải điểm cộng.</li>
</ul>
<h3>Microinteraction</h3>
<pre><code>Một microinteraction có 4 phần:
  TRIGGER   người dùng kéo danh sách xuống
  RULES     điều gì xảy ra (bắt đầu làm mới)
  FEEDBACK  vòng xoay + nảy nhẹ
  LOOP/END  dừng khi dữ liệu về
</code></pre>
<div class="callout"><span class="badge">Tiết chế</span> Chuyển động để làm rõ, không phải để khoe. Nếu một animation làm người dùng chậm lại hoặc lặp đến mức khó chịu, hãy bỏ.</div>`,
  ]]);

const c7q = quiz('adh301-quiz-7', 'Quiz 7 — Interaction & motion|||Quiz 7 — Tương tác & chuyển động', [
  { id: 'q1', question: 'Affordance trong thiết kế tương tác nghĩa là gì?', options: ['Giá của app', 'Dấu hiệu thị giác cho biết một hành động là có thể (vd nút trông bấm được)', 'Một loại animation', 'Kích thước màn hình'], correctIndex: 1, explanation: 'Affordance là gợi ý thị giác cho thấy có thể tác động; cử chỉ ẩn không affordance thì người dùng khó phát hiện (Norman).' },
  { id: 'q2', question: 'Bốn phần của một microinteraction là?', options: ['Màu, chữ, ảnh, icon', 'Trigger → Rules → Feedback → Loop/End', 'Tap, swipe, pinch, drag', 'iOS, Android, web, desktop'], correctIndex: 1, explanation: 'Microinteraction gồm trigger (kích hoạt), rules (quy tắc), feedback (phản hồi) và loop/end (lặp/kết thúc).' },
  { id: 'q3', question: 'Nguyên tắc dùng animation trong app di động là?', options: ['Càng dài, càng nhiều càng tốt', 'Có mục đích, nhanh (~200-300ms) và làm rõ điều gì thay đổi; đừng lạm dụng', 'Không bao giờ dùng animation', 'Chỉ dùng animation ở màn đăng nhập'], correctIndex: 1, explanation: 'Animation nên có mục đích (chuyển tiếp, định hướng), nhanh gọn; animation chậm/thừa là ma sát chứ không phải điểm cộng.' },
]);

const c8 = doc('adh301-8-1-accessibility-handoff', '8.1 — Accessibility, usability testing & handoff|||8.1 — Accessibility, usability testing & bàn giao',
  'Accessibility (contrast, cỡ chạm, nhãn cho screen reader, không chỉ dựa màu); usability testing (5 người, quan sát, nghĩ thành lời); handoff cho lập trình (specs, token, redline, Figma Dev Mode); checklist bàn giao.',
  [[
    `<span class="eyebrow">ADH301 · Chapter 8 · Lesson 8.1</span>
<h2>Accessibility, usability testing &amp; handoff</h2>
<h3>Accessibility (a11y) — design for everyone</h3>
<ul>
<li><strong>Contrast</strong> — meet WCAG AA (about 4.5:1 for body text).</li>
<li><strong>Touch size</strong> — respect 44&times;44 / 48&times;48 minimums.</li>
<li><strong>Labels</strong> — every icon-only button needs a text label for screen readers (VoiceOver / TalkBack).</li>
<li><strong>Not colour alone</strong> — support colour-blind users with icons/text.</li>
<li><strong>Respect system text size</strong> — layouts must survive larger fonts.</li>
</ul>
<h3>Usability testing</h3>
<p>Give real users a task on your prototype and <em>watch</em>. Ask them to <strong>think aloud</strong>. Krug's finding: testing with just <strong>~5 users</strong> uncovers most serious problems, and doing it early &amp; often beats one big study at the end.</p>
<h3>Handoff to developers</h3>
<pre><code>HANDOFF CHECKLIST
[ ] All screens + states (empty, loading, error, success)
[ ] Design tokens: colours, spacing, type documented
[ ] Components named &amp; consistent
[ ] Redlines / specs: sizes, spacing, fonts (Figma Dev Mode)
[ ] Assets exported (icons @1x/2x/3x, or SVG)
[ ] Interactions &amp; transitions described
[ ] Accessibility notes (labels, contrast)
</code></pre>
<div class="callout"><span class="badge">Design isn't done at "pretty"</span> A design is finished when it is accessible, tested with users, and handed off clearly enough for developers to build it without guessing.</div>`,
    `<span class="eyebrow">ADH301 · Chương 8 · Bài 8.1</span>
<h2>Accessibility, usability testing &amp; bàn giao</h2>
<h3>Accessibility (a11y) — thiết kế cho mọi người</h3>
<ul>
<li><strong>Tương phản</strong> — đạt WCAG AA (khoảng 4.5:1 cho chữ body).</li>
<li><strong>Cỡ chạm</strong> — tôn trọng tối thiểu 44&times;44 / 48&times;48.</li>
<li><strong>Nhãn</strong> — mọi nút chỉ có icon cần nhãn chữ cho screen reader (VoiceOver / TalkBack).</li>
<li><strong>Không chỉ dựa màu</strong> — hỗ trợ người mù màu bằng icon/chữ.</li>
<li><strong>Tôn trọng cỡ chữ hệ thống</strong> — bố cục phải sống sót khi chữ phóng to.</li>
</ul>
<h3>Usability testing</h3>
<p>Giao cho người dùng thật một nhiệm vụ trên prototype và <em>quan sát</em>. Nhờ họ <strong>nghĩ thành lời</strong>. Phát hiện của Krug: test với chỉ <strong>~5 người</strong> đã lộ hầu hết vấn đề nghiêm trọng, và test sớm &amp; thường xuyên tốt hơn một cuộc lớn ở cuối.</p>
<h3>Bàn giao cho lập trình (handoff)</h3>
<pre><code>CHECKLIST BÀN GIAO
[ ] Đủ màn hình + trạng thái (rỗng, đang tải, lỗi, thành công)
[ ] Design token: màu, khoảng cách, chữ đã ghi rõ
[ ] Component đặt tên &amp; nhất quán
[ ] Redline / specs: kích thước, khoảng cách, font (Figma Dev Mode)
[ ] Xuất tài nguyên (icon @1x/2x/3x, hoặc SVG)
[ ] Mô tả tương tác &amp; chuyển tiếp
[ ] Ghi chú accessibility (nhãn, tương phản)
</code></pre>
<div class="callout"><span class="badge">Thiết kế không kết thúc ở "đẹp"</span> Một thiết kế hoàn thành khi nó tiếp cận được cho mọi người, đã test với người dùng, và bàn giao đủ rõ để lập trình viên dựng mà không phải đoán.</div>`,
  ]]);

const c8q = quiz('adh301-quiz-8', 'Quiz 8 — Accessibility & handoff|||Quiz 8 — Accessibility & bàn giao', [
  { id: 'q1', question: 'Theo Krug, cần test khả dụng (usability test) với khoảng bao nhiêu người để lộ hầu hết vấn đề nghiêm trọng?', options: ['1 người', 'Khoảng 5 người', '50 người', '500 người'], correctIndex: 1, explanation: 'Krug cho thấy test với ~5 người đã phát hiện phần lớn vấn đề lớn; nên test sớm và thường xuyên thay vì một cuộc lớn ở cuối.' },
  { id: 'q2', question: 'Vì sao nút chỉ có icon cần thêm nhãn chữ (accessibility label)?', options: ['Để trông đẹp hơn', 'Để screen reader (VoiceOver/TalkBack) đọc được cho người khiếm thị', 'Để tốn ít pin', 'Vì Figma bắt buộc'], correctIndex: 1, explanation: 'Screen reader không hiểu icon; nhãn chữ giúp người khiếm thị biết nút làm gì.' },
  { id: 'q3', question: 'Khi bàn giao (handoff) cho lập trình, thiết kế nên bao gồm gì?', options: ['Chỉ một ảnh chụp màn hình đẹp', 'Đủ màn hình + các trạng thái (rỗng, tải, lỗi), design token, specs/redline và tài nguyên xuất', 'Chỉ bảng màu', 'Chỉ file PDF mô tả ý tưởng'], correctIndex: 1, explanation: 'Handoff tốt gồm đủ trạng thái, token, specs (Figma Dev Mode) và asset để lập trình viên dựng mà không phải đoán.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ADH301',
    slug: 'adh301-mobility-applications-design-1',
    title: 'Mobility Applications Design 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ADH301.webp',
    shortDescription: 'Design mobile apps from scratch — mobile vs web, UX research & personas, IA & navigation, Figma wireframes & prototypes, layout/type/color, design systems (Material/HIG), gestures, accessibility & dev handoff. Bilingual, with quizzes.|||Thiết kế ứng dụng di động từ nền tảng — mobile vs web, nghiên cứu UX & persona, IA & điều hướng, wireframe & prototype Figma, layout/chữ/màu, design system (Material/HIG), cử chỉ, accessibility & bàn giao lập trình. Song ngữ, có quiz.',
    description: 'Môn <strong>ADH301 — Mobility Applications Design 1</strong> (Thiết kế ứng dụng di động 1 — nền tảng, kỳ 7, ngành Thiết kế mỹ thuật số) dạy <strong>thiết kế UX/UI cho ứng dụng di động</strong>. Lộ trình: <strong>nền tảng mobile</strong> (mobile vs web, cảm ứng, vùng ngón cái) → <strong>UX</strong> (nghiên cứu người dùng, persona, journey) → <strong>kiến trúc thông tin &amp; điều hướng</strong> (tab, stack, drawer, modal) → <strong>wireframe &amp; prototype Figma</strong> → <strong>nguyên tắc thị giác</strong> (lưới 8pt, typography, màu) → <strong>design system &amp; component</strong> (Material/HIG) → <strong>tương tác, cử chỉ &amp; microinteraction</strong> → <strong>accessibility, usability testing &amp; handoff</strong>. Bám giáo trình FLM &amp; chuẩn ngành (Apple HIG, Material Design, Krug, Norman, Refactoring UI, Figma), song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Khác biệt mobile vs web (cảm ứng, vùng ngón cái, cỡ chạm 44/48); nghiên cứu người dùng, persona, user journey; kiến trúc thông tin &amp; 4 mẫu điều hướng (tab/stack/drawer/modal); wireframe &amp; prototype trong Figma (frame, auto layout, component); lưới 8pt, phân cấp thị giác, typography &amp; màu (60-30-10, contrast); design system &amp; design token; cử chỉ, animation có mục đích &amp; microinteraction; accessibility (WCAG AA, screen reader); usability testing 5 người; bàn giao cho lập trình (Dev Mode, specs, token).',
    requirements: 'Không cần lập trình. Nên có tài khoản Figma (miễn phí) và đã dùng smartphone quen thuộc. Đọc trước phần mở đầu Apple HIG &amp; Material Design là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'HIG, Material, Krug, Norman, Refactoring UI, Figma, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tư duy lấy người dùng làm trung tâm, double diamond, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng thiết kế di động|||Chapter 1 — Mobile design foundations', description: 'Mobile vs web, cảm ứng, vùng ngón cái, cỡ chạm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — UX cơ bản|||Chapter 2 — UX basics', description: 'Nghiên cứu người dùng, persona, user journey.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kiến trúc thông tin & điều hướng|||Chapter 3 — IA & navigation', description: 'Card sorting, tab/stack/drawer/modal.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Wireframe & prototype Figma|||Chapter 4 — Wireframes & Figma', description: 'Lo-fi → hi-fi, frame, auto layout, component, prototype.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nguyên tắc thị giác|||Chapter 5 — Visual principles', description: 'Lưới 8pt, phân cấp, typography, màu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Design system & component|||Chapter 6 — Design systems', description: 'Token, component, trạng thái, Material vs HIG.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tương tác, cử chỉ & animation|||Chapter 7 — Interaction & motion', description: 'Cử chỉ, affordance, animation, microinteraction.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Accessibility, testing & handoff|||Chapter 8 — Accessibility & handoff', description: 'A11y, usability testing 5 người, bàn giao lập trình.', lessons: [c8, c8q] },
  ],
};
