/**
 * WDU202c — UI/UX Design (Thiết kế giao diện & trải nghiệm người dùng).
 * Ngành Thiết kế mỹ thuật số FPTU, Kỳ 4. Khung chất lượng: 8 chương, song ngữ
 * VI+EN, mỗi chương 1 DOCUMENT (khái niệm + nguyên tắc + ví dụ sản phẩm thật +
 * thực hành Figma) và 1 QUIZ 3 câu.
 * Sách chuẩn: Norman "The Design of Everyday Things"; Krug "Don't Make Me
 * Think"; 10 heuristic Nielsen (NN/g); Google Material Design; Apple HIG; Figma.
 * Giữ NGUYÊN slug/semester/courseCode 'WDU202c'/thumbnailUrl.
 * ⚠️ KHÔNG backtick lồng / ${} trong HTML nội dung; "&"→"&amp;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('wdu202c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Norman, Krug), Nielsen Norman Group, Material Design, Apple HIG, Figma Learn, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">WDU202c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to learn <strong>UI/UX Design</strong> — from human-centered thinking and user research to wireframes, design systems, usability heuristics and testing — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, world-class resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for WDU202c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.nngroup.com/books/design-everyday-things-revised/" target="_blank" rel="noopener">Don Norman — <em>The Design of Everyday Things</em></a> (affordance, signifiers, feedback, mapping)</li>
<li><a href="https://sensible.com/dont-make-me-think/" target="_blank" rel="noopener">Steve Krug — <em>Don't Make Me Think</em></a> (web usability, self-evident design)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener">Nielsen Norman Group — 10 Usability Heuristics</a></li>
<li><a href="https://m3.material.io/" target="_blank" rel="noopener">Google Material Design 3</a></li>
<li><a href="https://developer.apple.com/design/human-interface-guidelines/" target="_blank" rel="noopener">Apple Human Interface Guidelines (HIG)</a></li>
<li><a href="https://www.figma.com/resource-library/" target="_blank" rel="noopener">Figma Learn / Resource Library</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@figma" target="_blank" rel="noopener">Figma</a> — official tutorials &amp; Config talks</li>
<li><a href="https://www.youtube.com/@aiuxdesign" target="_blank" rel="noopener">AJ&amp;Smart</a> — UX process, design sprints</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — the industry-standard UI design &amp; prototyping tool (free for students)</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — color palette generator</li>
<li><a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener">WebAIM Contrast Checker</a> — accessibility contrast (WCAG)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — understand UI vs UX, human-centered design and the design-thinking process.</li>
<li><strong>Research &amp; structure</strong> — do user research, build personas &amp; journeys, then define information architecture and user flows.</li>
<li><strong>Design</strong> — sketch wireframes, build hi-fi prototypes in Figma, and apply UI principles &amp; a design system.</li>
<li><strong>Validate</strong> — run usability tests, A/B test, gather feedback, and iterate.</li>
</ol></div>`,
    `<span class="eyebrow">WDU202c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Thiết kế UI/UX</strong> — từ tư duy lấy người dùng làm trung tâm và nghiên cứu người dùng đến wireframe, design system, nguyên tắc khả dụng và kiểm thử — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí đẳng cấp thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của WDU202c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.nngroup.com/books/design-everyday-things-revised/" target="_blank" rel="noopener">Don Norman — <em>The Design of Everyday Things</em></a> (affordance, signifier, phản hồi, ánh xạ)</li>
<li><a href="https://sensible.com/dont-make-me-think/" target="_blank" rel="noopener">Steve Krug — <em>Don't Make Me Think</em></a> (khả dụng web, thiết kế tự hiển nhiên)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.nngroup.com/articles/ten-usability-heuristics/" target="_blank" rel="noopener">Nielsen Norman Group — 10 heuristic khả dụng</a></li>
<li><a href="https://m3.material.io/" target="_blank" rel="noopener">Google Material Design 3</a></li>
<li><a href="https://developer.apple.com/design/human-interface-guidelines/" target="_blank" rel="noopener">Apple Human Interface Guidelines (HIG)</a></li>
<li><a href="https://www.figma.com/resource-library/" target="_blank" rel="noopener">Figma Learn / Thư viện tài nguyên</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@figma" target="_blank" rel="noopener">Figma</a> — hướng dẫn chính thức &amp; talk Config</li>
<li><a href="https://www.youtube.com/@aiuxdesign" target="_blank" rel="noopener">AJ&amp;Smart</a> — quy trình UX, design sprint</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — công cụ thiết kế &amp; prototype UI chuẩn ngành (miễn phí cho sinh viên)</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — trình tạo bảng màu</li>
<li><a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener">WebAIM Contrast Checker</a> — kiểm tương phản (WCAG)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — hiểu UI vs UX, thiết kế lấy người dùng làm trung tâm và quy trình design thinking.</li>
<li><strong>Nghiên cứu &amp; cấu trúc</strong> — nghiên cứu người dùng, dựng persona &amp; journey, rồi định kiến trúc thông tin và user flow.</li>
<li><strong>Thiết kế</strong> — phác wireframe, dựng prototype hi-fi trong Figma, áp nguyên tắc UI &amp; design system.</li>
<li><strong>Kiểm chứng</strong> — chạy usability test, A/B test, thu phản hồi và cải tiến lặp.</li>
</ol></div>`,
  ]]);

const intro = doc('wdu202c-0-1-overview', 'Course overview: UI/UX Design|||Tổng quan: Thiết kế UI/UX',
  'UI/UX làm gì; vì sao thiết kế tốt là vô hình; lộ trình 8 chương: UI vs UX → nghiên cứu → kiến trúc thông tin → wireframe/prototype → nguyên lý UI → nguyên tắc UX → tương tác/mobile → kiểm thử & lặp.',
  [[
    `<span class="eyebrow">WDU202c · Lesson 0.1 · Overview</span>
<h2>UI/UX Design</h2>
<p class="lead">This course teaches you to design <strong>digital products people can actually use</strong> — apps and websites that are clear, efficient and pleasant. You will move from <strong>understanding users</strong> to <strong>structuring, designing, prototyping and testing</strong> real interfaces, using <strong>Figma</strong> as your main tool.</p>
<h3>UX vs UI in one line</h3>
<ul>
<li><strong>UX (experience)</strong> — how it <em>works</em> and <em>feels</em>: research, flows, information architecture, usability.</li>
<li><strong>UI (interface)</strong> — how it <em>looks</em>: layout, color, typography, components, the visual surface people touch.</li>
</ul>
<p>Great design is <strong>invisible</strong>: when a product just works, nobody notices the design — they only notice when it fights them.</p>
<h3>Roadmap</h3>
<p>UI vs UX &amp; design thinking → user research &amp; personas → information architecture &amp; flows → wireframes &amp; prototypes → UI principles &amp; design systems → usability heuristics &amp; accessibility → interaction &amp; mobile design → testing &amp; iteration. Bilingual, with real-product examples and Figma practice every chapter.</p>`,
    `<span class="eyebrow">WDU202c · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế UI/UX</h2>
<p class="lead">Môn này dạy bạn thiết kế <strong>sản phẩm số mà người ta thực sự dùng được</strong> — app và website rõ ràng, hiệu quả và dễ chịu. Bạn đi từ <strong>hiểu người dùng</strong> đến <strong>cấu trúc, thiết kế, prototype và kiểm thử</strong> giao diện thật, dùng <strong>Figma</strong> làm công cụ chính.</p>
<h3>UX vs UI trong một dòng</h3>
<ul>
<li><strong>UX (trải nghiệm)</strong> — nó <em>hoạt động</em> và <em>cảm giác</em> ra sao: nghiên cứu, luồng, kiến trúc thông tin, khả dụng.</li>
<li><strong>UI (giao diện)</strong> — nó <em>trông</em> thế nào: bố cục, màu, kiểu chữ, component, bề mặt trực quan mà người dùng chạm vào.</li>
</ul>
<p>Thiết kế giỏi là <strong>vô hình</strong>: khi sản phẩm chạy trơn tru, không ai để ý tới thiết kế — người ta chỉ để ý khi nó chống lại họ.</p>
<h3>Lộ trình</h3>
<p>UI vs UX &amp; design thinking → nghiên cứu &amp; persona → kiến trúc thông tin &amp; luồng → wireframe &amp; prototype → nguyên lý UI &amp; design system → heuristic khả dụng &amp; accessibility → thiết kế tương tác &amp; mobile → kiểm thử &amp; lặp. Song ngữ, có ví dụ sản phẩm thật và thực hành Figma mỗi chương.</p>`,
  ]]);

const c1 = doc('wdu202c-1-1-ui-vs-ux', '1.1 — What is UI vs UX|||1.1 — UI vs UX là gì',
  'Phân biệt UI/UX, vai trò của nhà thiết kế, human-centered design (HCD), và 5 bước design thinking (empathize → define → ideate → prototype → test).',
  [[
    `<span class="eyebrow">WDU202c · Chapter 1 · Lesson 1.1</span>
<h2>What is UI vs UX</h2>
<h3>Two words, two jobs</h3>
<p><strong>User Experience (UX)</strong> is the whole journey a person has with a product; <strong>User Interface (UI)</strong> is the specific screens and controls they interact with. A famous analogy: UX is the whole restaurant experience (menu, service, mood); UI is the plate the food arrives on.</p>
<h3>Human-Centered Design (HCD)</h3>
<p><strong>HCD</strong> means you design <em>for</em> real people by involving them throughout — you solve <em>their</em> problem, not the one you imagined. Don Norman, who coined "user experience", built HCD on four ideas you will meet again: <strong>affordance, signifier, feedback and mapping</strong>.</p>
<h3>The design-thinking process</h3>
<pre><code>1. Empathize -> understand users (interviews, observation)
2. Define    -> frame the real problem (a clear problem statement)
3. Ideate    -> generate many possible solutions
4. Prototype -> build a cheap, testable version
5. Test      -> put it in front of users, learn, repeat
</code></pre>
<p>It is <em>iterative</em>, not linear: findings from Test send you back to Define or Ideate.</p>
<h3>Real-product example</h3>
<p>Spotify does not just look nice (UI); its "Discover Weekly" playlist solves a real user need — finding new music without effort — that is UX. Good UI on a product that solves nothing still fails.</p>
<h3>Figma practice</h3>
<p>Create a free Figma account, open a blank file, and write two sticky notes: one describing a UX problem you personally have with an app, and one describing a UI detail you like. This frames the rest of the course.</p>
<div class="callout"><span class="badge">Remember</span> UI is what you see; UX is how it works. You need both — but UX decisions come first.</div>`,
    `<span class="eyebrow">WDU202c · Chương 1 · Bài 1.1</span>
<h2>UI vs UX là gì</h2>
<h3>Hai từ, hai công việc</h3>
<p><strong>Trải nghiệm người dùng (UX)</strong> là toàn bộ hành trình của một người với sản phẩm; <strong>giao diện người dùng (UI)</strong> là những màn hình và điều khiển cụ thể họ tương tác. Một ví von nổi tiếng: UX là cả trải nghiệm nhà hàng (thực đơn, phục vụ, không khí); UI là cái đĩa món ăn được dọn ra.</p>
<h3>Thiết kế lấy con người làm trung tâm (HCD)</h3>
<p><strong>HCD</strong> nghĩa là bạn thiết kế <em>cho</em> người thật bằng cách để họ tham gia suốt quá trình — bạn giải quyết vấn đề <em>của họ</em>, không phải vấn đề bạn tưởng tượng. Don Norman, người đặt ra thuật ngữ "user experience", xây HCD trên bốn ý bạn sẽ gặp lại: <strong>affordance, signifier, phản hồi và ánh xạ (mapping)</strong>.</p>
<h3>Quy trình design thinking</h3>
<pre><code>1. Empathize -> hiểu người dùng (phỏng vấn, quan sát)
2. Define    -> khung đúng vấn đề (phát biểu vấn đề rõ)
3. Ideate    -> nghĩ ra nhiều giải pháp
4. Prototype -> dựng bản rẻ, thử được
5. Test      -> đưa cho người dùng, học, lặp lại
</code></pre>
<p>Nó có <em>tính lặp</em>, không tuyến tính: kết quả từ Test đưa bạn quay lại Define hoặc Ideate.</p>
<h3>Ví dụ sản phẩm thật</h3>
<p>Spotify không chỉ đẹp (UI); playlist "Discover Weekly" giải một nhu cầu thật — tìm nhạc mới mà không tốn công — đó là UX. UI đẹp trên sản phẩm không giải quyết gì thì vẫn thất bại.</p>
<h3>Thực hành Figma</h3>
<p>Tạo tài khoản Figma miễn phí, mở một file trống, viết hai sticky note: một mô tả vấn đề UX bạn tự gặp với một app, một mô tả chi tiết UI bạn thích. Điều này khung lại cả phần còn lại của môn.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> UI là thứ bạn thấy; UX là cách nó hoạt động. Cần cả hai — nhưng quyết định UX phải đến trước.</div>`,
  ]]);

const c1q = quiz('wdu202c-quiz-1', 'Quiz 1 — UI vs UX|||Quiz 1 — UI vs UX', [
  { id: 'q1', question: 'Sự khác nhau cốt lõi giữa UI và UX là?|||The core difference between UI and UX is?', options: ['UI là cách hoạt động, UX là cách trông|||UI is how it works, UX is how it looks', 'UI là bề mặt trực quan, UX là toàn bộ trải nghiệm/hành trình|||UI is the visual surface, UX is the whole experience/journey', 'Chúng hoàn toàn giống nhau|||They are exactly the same', 'UX chỉ dành cho web, UI cho mobile|||UX is only for web, UI for mobile'], correctIndex: 1, explanation: 'UI = giao diện trực quan cụ thể; UX = toàn bộ trải nghiệm và hành trình người dùng.' },
  { id: 'q2', question: 'Thứ tự đúng của quy trình design thinking là?|||The correct order of the design-thinking process is?', options: ['Define → Empathize → Test → Ideate → Prototype', 'Empathize → Define → Ideate → Prototype → Test', 'Prototype → Test → Empathize → Define → Ideate', 'Ideate → Prototype → Empathize → Test → Define'], correctIndex: 1, explanation: 'Empathize → Define → Ideate → Prototype → Test, và lặp lại.' },
  { id: 'q3', question: 'Human-centered design (HCD) nghĩa là?|||Human-centered design (HCD) means?', options: ['Thiết kế theo ý thích của nhà thiết kế|||Design by the designer preference', 'Thiết kế cho người dùng thật bằng cách để họ tham gia và giải đúng vấn đề của họ|||Design for real users by involving them and solving their real problem', 'Chỉ tập trung vào màu và font|||Focus only on color and font', 'Sao chép đối thủ cạnh tranh|||Copy competitors'], correctIndex: 1, explanation: 'HCD đặt người dùng thật vào trung tâm suốt quá trình, giải đúng vấn đề của họ.' },
]);

const c2 = doc('wdu202c-2-1-user-research', '2.1 — User research|||2.1 — Nghiên cứu người dùng',
  'User research (định tính vs định lượng, phỏng vấn, khảo sát, quan sát), empathy, persona và user journey map để biến insight thành quyết định thiết kế.',
  [[
    `<span class="eyebrow">WDU202c · Chapter 2 · Lesson 2.1</span>
<h2>User research</h2>
<h3>Why research first</h3>
<p>You are <strong>not</strong> your user. Research replaces guessing with evidence about who your users are, what they need and where they struggle. Skipping it is the most expensive mistake in design.</p>
<h3>Methods</h3>
<ul>
<li><strong>Qualitative</strong> — interviews, contextual observation, usability sessions. Answer <em>why</em> (few people, deep insight).</li>
<li><strong>Quantitative</strong> — surveys, analytics, funnels. Answer <em>how many / how often</em> (many people, patterns).</li>
</ul>
<h3>Turning research into artifacts</h3>
<ul>
<li><strong>Empathy map</strong> — what a user Says, Thinks, Does and Feels.</li>
<li><strong>Persona</strong> — a believable archetype (name, goals, frustrations, context) that keeps the team aligned on <em>who</em> you build for.</li>
<li><strong>User journey map</strong> — the stages a user goes through over time, with their actions, emotions and <strong>pain points</strong> at each step.</li>
</ul>
<pre><code>Journey (buying a train ticket):
 Stage:   Search -> Choose seat -> Pay -> Get ticket
 Emotion: hopeful -> confused  -> anxious -> relieved
 Pain:    unclear times  no seat map  fear of fail  where is QR?
</code></pre>
<h3>Real-product example</h3>
<p>Airbnb famously flew designers to visit hosts in person. That empathy work revealed that better listing photos, not more features, was the real problem — and it changed the business.</p>
<h3>Figma practice</h3>
<p>Use FigJam to build one empathy map and a single persona card for an app you use daily. Mark at least three pain points you can design against later.</p>
<div class="callout"><span class="badge">Rule</span> Design decisions should trace back to a research insight, not to opinion.</div>`,
    `<span class="eyebrow">WDU202c · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu người dùng</h2>
<h3>Vì sao nghiên cứu trước</h3>
<p>Bạn <strong>không phải</strong> là người dùng của mình. Nghiên cứu thay việc đoán bằng bằng chứng: người dùng là ai, cần gì và vướng ở đâu. Bỏ qua nó là sai lầm đắt nhất trong thiết kế.</p>
<h3>Phương pháp</h3>
<ul>
<li><strong>Định tính</strong> — phỏng vấn, quan sát bối cảnh, phiên usability. Trả lời <em>vì sao</em> (ít người, insight sâu).</li>
<li><strong>Định lượng</strong> — khảo sát, analytics, phễu. Trả lời <em>bao nhiêu / bao lâu một lần</em> (nhiều người, thấy mẫu hình).</li>
</ul>
<h3>Biến nghiên cứu thành sản phẩm</h3>
<ul>
<li><strong>Empathy map</strong> — người dùng Nói, Nghĩ, Làm và Cảm gì.</li>
<li><strong>Persona</strong> — một hình mẫu đáng tin (tên, mục tiêu, bực bội, bối cảnh) giữ cả nhóm thống nhất về <em>ai</em> mình làm cho.</li>
<li><strong>User journey map</strong> — các giai đoạn người dùng trải qua theo thời gian, kèm hành động, cảm xúc và <strong>điểm đau</strong> ở mỗi bước.</li>
</ul>
<pre><code>Journey (mua vé tàu):
 Giai đoạn: Tìm -> Chọn ghế -> Thanh toán -> Nhận vé
 Cảm xúc:   hy vọng -> bối rối -> lo lắng -> nhẹ nhõm
 Điểm đau:  giờ mơ hồ  không sơ đồ ghế  sợ lỗi  QR ở đâu?
</code></pre>
<h3>Ví dụ sản phẩm thật</h3>
<p>Airbnb nổi tiếng vì cho nhà thiết kế bay đến gặp chủ nhà trực tiếp. Công việc thấu cảm đó phát hiện rằng ảnh listing đẹp hơn, chứ không phải thêm tính năng, mới là vấn đề thật — và nó thay đổi cả công ty.</p>
<h3>Thực hành Figma</h3>
<p>Dùng FigJam dựng một empathy map và một thẻ persona cho app bạn dùng hằng ngày. Đánh dấu ít nhất ba điểm đau để sau này thiết kế nhắm vào.</p>
<div class="callout"><span class="badge">Quy tắc</span> Quyết định thiết kế phải truy ngược về một insight nghiên cứu, không phải ý kiến cá nhân.</div>`,
  ]]);

const c2q = quiz('wdu202c-quiz-2', 'Quiz 2 — User research|||Quiz 2 — Nghiên cứu người dùng', [
  { id: 'q1', question: 'Một persona trong UX là gì?|||What is a persona in UX?', options: ['Một người dùng thật được thuê|||A real hired user', 'Một hình mẫu người dùng đáng tin (mục tiêu, bực bội, bối cảnh) đại diện nhóm mục tiêu|||A believable user archetype (goals, frustrations, context) representing a target group', 'Tên của nhà thiết kế|||The designer name', 'Một loại nút bấm|||A type of button'], correctIndex: 1, explanation: 'Persona là hình mẫu tổng hợp từ nghiên cứu, giúp nhóm thống nhất mình làm cho ai.' },
  { id: 'q2', question: 'Phỏng vấn sâu 1-1 với ít người thuộc loại nghiên cứu nào?|||In-depth one-on-one interviews with few people are which type of research?', options: ['Định lượng|||Quantitative', 'Định tính|||Qualitative', 'A/B testing', 'Analytics'], correctIndex: 1, explanation: 'Phỏng vấn sâu là định tính, trả lời câu hỏi "vì sao" với ít người nhưng insight sâu.' },
  { id: 'q3', question: 'User journey map chủ yếu giúp nhóm nhìn thấy điều gì?|||A user journey map mainly helps the team see what?', options: ['Bảng màu của thương hiệu|||The brand color palette', 'Các giai đoạn, cảm xúc và điểm đau của người dùng theo thời gian|||The stages, emotions and pain points of the user over time', 'Mã nguồn của ứng dụng|||The application source code', 'Doanh thu hằng năm|||Annual revenue'], correctIndex: 1, explanation: 'Journey map bày ra từng giai đoạn cùng cảm xúc và điểm đau để biết chỗ cần cải thiện.' },
]);

const c3 = doc('wdu202c-3-1-information-architecture', '3.1 — Information architecture & flows|||3.1 — Kiến trúc thông tin & luồng',
  'Kiến trúc thông tin (IA), sitemap, điều hướng, user flow, và card sorting để tổ chức nội dung theo mô hình tư duy (mental model) của người dùng.',
  [[
    `<span class="eyebrow">WDU202c · Chapter 3 · Lesson 3.1</span>
<h2>Information architecture &amp; flows</h2>
<h3>What IA is</h3>
<p><strong>Information architecture (IA)</strong> is how you organize, label and connect content so people can <em>find things and understand where they are</em>. Good IA matches the user mental model, not the company org chart.</p>
<h3>Building blocks</h3>
<ul>
<li><strong>Sitemap</strong> — a tree of all screens/pages and how they nest (the skeleton of a product).</li>
<li><strong>Navigation</strong> — the menus, tabs and breadcrumbs that let people move and stay oriented.</li>
<li><strong>User flow</strong> — the step-by-step path to complete one task (e.g. "check out"), drawn as a flow diagram with decision points.</li>
</ul>
<h3>Card sorting</h3>
<p><strong>Card sorting</strong> is a research method to shape IA: users group labeled cards into categories that make sense <em>to them</em>. <em>Open</em> sort = users name the groups; <em>closed</em> sort = you provide the categories. It reveals the words and groupings real users expect.</p>
<pre><code>User flow (sign up):
 Landing -> [Sign up] -> Enter email
        -> Verify code -> Set password
        -> {valid?} --no--> show error --> retry
                     --yes--> Home
</code></pre>
<h3>Real-product example</h3>
<p>An e-commerce site that buries "Order tracking" three menus deep fails IA — users cannot map their goal to a location. Amazon keeps "Returns &amp; Orders" one tap from the top bar because that is a top user task.</p>
<h3>Figma practice</h3>
<p>In FigJam, draw a sitemap for a small app (5-8 screens) and one user flow for its most important task, using rectangles for screens and diamonds for decisions.</p>
<div class="callout"><span class="badge">Test yourself</span> If a user cannot answer "Where am I? Where can I go?" your navigation and IA need work.</div>`,
    `<span class="eyebrow">WDU202c · Chương 3 · Bài 3.1</span>
<h2>Kiến trúc thông tin &amp; luồng</h2>
<h3>IA là gì</h3>
<p><strong>Kiến trúc thông tin (IA)</strong> là cách bạn tổ chức, gán nhãn và nối nội dung để người ta <em>tìm được thứ cần và biết mình đang ở đâu</em>. IA tốt khớp mô hình tư duy của người dùng, không phải sơ đồ phòng ban của công ty.</p>
<h3>Các khối cấu thành</h3>
<ul>
<li><strong>Sitemap</strong> — cây gồm mọi màn hình/trang và cách chúng lồng nhau (bộ khung của sản phẩm).</li>
<li><strong>Điều hướng</strong> — menu, tab và breadcrumb giúp người ta di chuyển và giữ định hướng.</li>
<li><strong>User flow</strong> — đường đi từng bước để hoàn thành một tác vụ (vd "thanh toán"), vẽ dạng sơ đồ luồng có điểm rẽ nhánh.</li>
</ul>
<h3>Card sorting</h3>
<p><strong>Card sorting</strong> là phương pháp nghiên cứu để định hình IA: người dùng nhóm các thẻ có nhãn vào những nhóm hợp lý <em>với họ</em>. Sort <em>mở</em> = người dùng tự đặt tên nhóm; sort <em>đóng</em> = bạn cho sẵn nhóm. Nó lộ ra từ ngữ và cách nhóm mà người dùng thật mong đợi.</p>
<pre><code>User flow (đăng ký):
 Trang chủ -> [Đăng ký] -> Nhập email
          -> Xác minh mã -> Đặt mật khẩu
          -> {hợp lệ?} --không--> báo lỗi --> thử lại
                        --có--> Trang chính
</code></pre>
<h3>Ví dụ sản phẩm thật</h3>
<p>Một trang TMĐT chôn "Theo dõi đơn" sâu ba lớp menu là hỏng IA — người dùng không ánh xạ được mục tiêu tới vị trí. Amazon để "Returns &amp; Orders" cách thanh trên đúng một chạm vì đó là tác vụ hàng đầu.</p>
<h3>Thực hành Figma</h3>
<p>Trong FigJam, vẽ một sitemap cho app nhỏ (5-8 màn hình) và một user flow cho tác vụ quan trọng nhất, dùng hình chữ nhật cho màn hình và hình thoi cho điểm rẽ.</p>
<div class="callout"><span class="badge">Tự kiểm</span> Nếu người dùng không trả lời được "Tôi đang ở đâu? Tôi đi đâu được?" thì điều hướng và IA còn phải sửa.</div>`,
  ]]);

const c3q = quiz('wdu202c-quiz-3', 'Quiz 3 — IA & flows|||Quiz 3 — IA & luồng', [
  { id: 'q1', question: 'Kiến trúc thông tin (IA) chủ yếu lo về việc gì?|||Information architecture (IA) is mainly about what?', options: ['Chọn font và màu|||Choosing fonts and colors', 'Tổ chức, gán nhãn và nối nội dung để người dùng tìm được và biết mình ở đâu|||Organizing, labeling and connecting content so users can find things and know where they are', 'Viết mã backend|||Writing backend code', 'Chạy quảng cáo|||Running ads'], correctIndex: 1, explanation: 'IA là tổ chức và gán nhãn nội dung theo mô hình tư duy người dùng để dễ tìm và định hướng.' },
  { id: 'q2', question: 'Card sorting được dùng để làm gì?|||What is card sorting used for?', options: ['Chọn bảng màu|||Pick a color palette', 'Để người dùng nhóm nội dung, giúp định hình cấu trúc và nhãn danh mục|||Let users group content to shape structure and category labels', 'Đo tốc độ tải trang|||Measure page load speed', 'Tạo animation|||Create animations'], correctIndex: 1, explanation: 'Card sorting cho người dùng nhóm thẻ để lộ cách phân loại và đặt tên họ mong đợi.' },
  { id: 'q3', question: 'Một user flow mô tả điều gì?|||What does a user flow describe?', options: ['Bảng giá sản phẩm|||The product price list', 'Đường đi từng bước để hoàn thành một tác vụ, kèm điểm rẽ nhánh|||The step-by-step path to complete a task, with decision points', 'Danh sách nhân viên|||The staff list', 'Mã màu thương hiệu|||The brand color code'], correctIndex: 1, explanation: 'User flow là chuỗi bước và điểm rẽ để hoàn thành một tác vụ cụ thể.' },
]);

const c4 = doc('wdu202c-4-1-wireframe-prototype', '4.1 — Wireframes & prototypes|||4.1 — Wireframe & prototype',
  'Low-fidelity vs high-fidelity, wireframe, mockup, prototype tương tác; dựng và liên kết màn hình trong Figma để mô phỏng luồng thật trước khi code.',
  [[
    `<span class="eyebrow">WDU202c · Chapter 4 · Lesson 4.1</span>
<h2>Wireframes &amp; prototypes</h2>
<h3>Fidelity: how finished it looks</h3>
<ul>
<li><strong>Low-fidelity (lo-fi)</strong> — quick sketches or gray boxes. Cheap, fast, great for exploring layout and flow without arguing about color.</li>
<li><strong>High-fidelity (hi-fi)</strong> — realistic visuals with real type, color and content, close to the final UI.</li>
</ul>
<h3>Three artifacts, in order</h3>
<pre><code>Wireframe  -> structure &amp; hierarchy (no color, placeholder text)
Mockup     -> static hi-fi visual design
Prototype  -> clickable: screens linked so it behaves like the real app
</code></pre>
<h3>Why prototype before code</h3>
<p>A <strong>prototype</strong> links screens with interactions so users can <em>try</em> the product before a single line of code exists. Fixing a flow in Figma costs minutes; fixing it after launch costs weeks. Prototypes let you test ideas cheaply and pitch them convincingly.</p>
<h3>Figma essentials</h3>
<ul>
<li><strong>Frames</strong> = screens. <strong>Auto layout</strong> = responsive stacking of elements.</li>
<li><strong>Components</strong> = reusable elements; <strong>variants</strong> = states of one component (default/hover/disabled).</li>
<li><strong>Prototype tab</strong> = drag connections between frames, choose triggers (on click) and animations (smart animate).</li>
</ul>
<h3>Real-product example</h3>
<p>Most teams demo a clickable Figma prototype to stakeholders and run usability tests on it — Duolingo, for instance, tests new lesson flows as prototypes before building them.</p>
<h3>Figma practice</h3>
<p>Turn the sitemap from Chapter 3 into 3 lo-fi wireframes, then link them in the Prototype tab so a click moves between screens.</p>
<div class="callout"><span class="badge">Tip</span> Start lo-fi. Jumping straight to pixels makes you defend colors instead of fixing the flow.</div>`,
    `<span class="eyebrow">WDU202c · Chương 4 · Bài 4.1</span>
<h2>Wireframe &amp; prototype</h2>
<h3>Độ hoàn thiện (fidelity): trông xong tới đâu</h3>
<ul>
<li><strong>Độ thấp (lo-fi)</strong> — phác nhanh hoặc khối xám. Rẻ, nhanh, hợp để khám phá bố cục và luồng mà không tranh cãi về màu.</li>
<li><strong>Độ cao (hi-fi)</strong> — hình trực quan thật với kiểu chữ, màu và nội dung thật, gần với UI cuối.</li>
</ul>
<h3>Ba sản phẩm, theo thứ tự</h3>
<pre><code>Wireframe  -> cấu trúc &amp; phân cấp (không màu, chữ giữ chỗ)
Mockup     -> thiết kế trực quan hi-fi tĩnh
Prototype  -> bấm được: màn hình nối nhau, hành xử như app thật
</code></pre>
<h3>Vì sao prototype trước khi code</h3>
<p>Một <strong>prototype</strong> nối các màn hình bằng tương tác để người dùng <em>thử</em> sản phẩm trước khi có một dòng code nào. Sửa một luồng trong Figma tốn vài phút; sửa sau khi ra mắt tốn hàng tuần. Prototype cho phép thử ý tưởng rẻ và thuyết phục người khác.</p>
<h3>Cốt lõi Figma</h3>
<ul>
<li><strong>Frame</strong> = màn hình. <strong>Auto layout</strong> = xếp phần tử co giãn theo nội dung.</li>
<li><strong>Component</strong> = phần tử tái sử dụng; <strong>variant</strong> = các trạng thái của một component (mặc định/hover/disabled).</li>
<li><strong>Tab Prototype</strong> = kéo nối giữa các frame, chọn trigger (khi bấm) và animation (smart animate).</li>
</ul>
<h3>Ví dụ sản phẩm thật</h3>
<p>Phần lớn nhóm demo prototype Figma bấm được cho stakeholder và chạy usability test trên đó — ví dụ Duolingo thử các luồng bài học dạng prototype trước khi dựng thật.</p>
<h3>Thực hành Figma</h3>
<p>Biến sitemap ở Chương 3 thành 3 wireframe lo-fi, rồi nối chúng trong tab Prototype để một cú bấm chuyển giữa các màn hình.</p>
<div class="callout"><span class="badge">Mẹo</span> Bắt đầu ở lo-fi. Nhảy thẳng vào pixel khiến bạn đi bảo vệ màu thay vì sửa luồng.</div>`,
  ]]);

const c4q = quiz('wdu202c-quiz-4', 'Quiz 4 — Wireframe & prototype|||Quiz 4 — Wireframe & prototype', [
  { id: 'q1', question: 'Wireframe lo-fi khác mockup hi-fi chủ yếu ở điểm nào?|||How does a lo-fi wireframe mainly differ from a hi-fi mockup?', options: ['Lo-fi tốn nhiều thời gian hơn|||Lo-fi takes more time', 'Lo-fi tập trung cấu trúc/phân cấp, ít màu và chi tiết; hi-fi gần UI cuối|||Lo-fi focuses on structure/hierarchy with little color and detail; hi-fi is close to the final UI', 'Lo-fi luôn có animation|||Lo-fi always has animations', 'Không có khác biệt|||There is no difference'], correctIndex: 1, explanation: 'Lo-fi nhắm cấu trúc và phân cấp nhanh, rẻ; hi-fi mới đầy đủ màu, chữ và chi tiết.' },
  { id: 'q2', question: 'Điểm khác biệt của prototype so với mockup tĩnh là?|||What makes a prototype different from a static mockup?', options: ['Nó nhiều màu hơn|||It has more colors', 'Nó bấm được: các màn hình được nối để hành xử như app thật|||It is clickable: screens are linked to behave like a real app', 'Nó chỉ là ảnh chụp|||It is just a screenshot', 'Nó là mã nguồn cuối cùng|||It is the final source code'], correctIndex: 1, explanation: 'Prototype nối màn hình bằng tương tác để thử luồng thật trước khi code.' },
  { id: 'q3', question: 'Trong Figma, "component" và "variant" dùng để?|||In Figma, components and variants are used to?', options: ['Chạy khảo sát người dùng|||Run user surveys', 'Tái sử dụng phần tử và quản lý các trạng thái của cùng một phần tử (default/hover/disabled)|||Reuse elements and manage states of the same element (default/hover/disabled)', 'Xuất file PDF|||Export PDF files', 'Đo tương phản màu|||Measure color contrast'], correctIndex: 1, explanation: 'Component cho tái sử dụng; variant gom các trạng thái của một component lại quản lý.' },
]);

const c5 = doc('wdu202c-5-1-ui-principles', '5.1 — UI design principles|||5.1 — Nguyên lý thiết kế UI',
  'Bố cục & lưới (grid), phân cấp thị giác, typography, màu sắc & tương phản, khoảng trắng, component và design system để giao diện nhất quán, đẹp và dễ mở rộng.',
  [[
    `<span class="eyebrow">WDU202c · Chapter 5 · Lesson 5.1</span>
<h2>UI design principles</h2>
<h3>Layout &amp; grid</h3>
<p>A <strong>grid</strong> (e.g. 12 columns on web, an 8-point spacing system) gives structure and alignment. Consistent spacing and alignment are what separate a professional screen from an amateur one.</p>
<h3>Visual hierarchy</h3>
<p><strong>Hierarchy</strong> guides the eye to what matters first, using size, weight, color and position. The four Gestalt-based basics: <strong>contrast, repetition, alignment, proximity</strong> (C.R.A.P.). Whitespace is not empty — it groups, separates and creates focus.</p>
<h3>Typography</h3>
<ul>
<li>Limit to 1-2 typefaces; build a <strong>type scale</strong> (e.g. 12/14/16/24/32) for clear hierarchy.</li>
<li>Body text ~16px, line-height ~1.5, comfortable line length (~45-75 characters).</li>
</ul>
<h3>Color</h3>
<p>Use a small palette: a primary, a secondary/accent, plus neutrals and semantic colors (success/warning/error). A common ratio is <strong>60-30-10</strong>. Never rely on color alone to carry meaning (accessibility).</p>
<h3>Components &amp; design systems</h3>
<p>A <strong>design system</strong> is a single source of truth: reusable components (buttons, inputs, cards) plus <strong>design tokens</strong> (color, spacing, type) and usage rules. It keeps a product consistent and lets teams ship fast.</p>
<pre><code>Token examples:
 color.primary = #2563EB
 space.md      = 16px
 radius.card   = 12px
 font.body     = 16px / 1.5
</code></pre>
<h3>Real-product example</h3>
<p>Material Design (Google) and Apple HIG are large design systems; companies like Airbnb (DLS), Shopify (Polaris) and Atlassian publish their own so hundreds of screens stay consistent.</p>
<h3>Figma practice</h3>
<p>Build a mini design system: a color style set, a type scale, and one button component with 3 variants. Reuse them to redesign one wireframe as hi-fi.</p>
<div class="callout"><span class="badge">Consistency</span> Reusing the same components and tokens is what makes a product feel like one product.</div>`,
    `<span class="eyebrow">WDU202c · Chương 5 · Bài 5.1</span>
<h2>Nguyên lý thiết kế UI</h2>
<h3>Bố cục &amp; lưới (grid)</h3>
<p>Một <strong>lưới</strong> (vd 12 cột trên web, hệ khoảng cách 8 điểm) tạo cấu trúc và canh chỉnh. Khoảng cách và canh lề nhất quán chính là thứ tách một màn hình chuyên nghiệp khỏi một màn hình nghiệp dư.</p>
<h3>Phân cấp thị giác</h3>
<p><strong>Phân cấp</strong> dẫn mắt tới thứ quan trọng trước, bằng kích thước, độ đậm, màu và vị trí. Bốn nền tảng dựa trên Gestalt: <strong>tương phản, lặp lại, canh lề, cận kề</strong> (C.R.A.P.). Khoảng trắng không phải chỗ trống — nó nhóm, tách và tạo tiêu điểm.</p>
<h3>Typography</h3>
<ul>
<li>Giới hạn 1-2 bộ chữ; dựng <strong>type scale</strong> (vd 12/14/16/24/32) cho phân cấp rõ.</li>
<li>Chữ thân ~16px, line-height ~1.5, độ dài dòng dễ đọc (~45-75 ký tự).</li>
</ul>
<h3>Màu sắc</h3>
<p>Dùng bảng màu nhỏ: một màu chính, một màu phụ/nhấn, cộng màu trung tính và màu ngữ nghĩa (success/warning/error). Tỉ lệ hay dùng là <strong>60-30-10</strong>. Đừng bao giờ chỉ dựa vào màu để truyền nghĩa (vì accessibility).</p>
<h3>Component &amp; design system</h3>
<p>Một <strong>design system</strong> là nguồn sự thật duy nhất: component tái sử dụng (nút, input, card) cộng <strong>design token</strong> (màu, khoảng cách, chữ) và quy tắc dùng. Nó giữ sản phẩm nhất quán và giúp nhóm làm nhanh.</p>
<pre><code>Ví dụ token:
 color.primary = #2563EB
 space.md      = 16px
 radius.card   = 12px
 font.body     = 16px / 1.5
</code></pre>
<h3>Ví dụ sản phẩm thật</h3>
<p>Material Design (Google) và Apple HIG là các design system lớn; các công ty như Airbnb (DLS), Shopify (Polaris) và Atlassian công bố hệ riêng để hàng trăm màn hình vẫn nhất quán.</p>
<h3>Thực hành Figma</h3>
<p>Dựng một design system mini: một bộ color style, một type scale và một component nút với 3 variant. Tái dùng chúng để làm lại một wireframe thành hi-fi.</p>
<div class="callout"><span class="badge">Nhất quán</span> Tái dùng cùng bộ component và token chính là thứ khiến sản phẩm cảm giác như một sản phẩm.</div>`,
  ]]);

const c5q = quiz('wdu202c-quiz-5', 'Quiz 5 — UI principles|||Quiz 5 — Nguyên lý UI', [
  { id: 'q1', question: 'Phân cấp thị giác (visual hierarchy) đạt được chủ yếu nhờ?|||Visual hierarchy is achieved mainly through?', options: ['Dùng thật nhiều màu|||Using as many colors as possible', 'Kích thước, độ đậm, màu, vị trí và khoảng trắng để dẫn mắt|||Size, weight, color, position and whitespace to guide the eye', 'Chỉ dùng animation|||Only using animations', 'Viết chữ in hoa toàn bộ|||Writing everything in uppercase'], correctIndex: 1, explanation: 'Phân cấp dùng kích thước/độ đậm/màu/vị trí và khoảng trắng để dẫn mắt tới thứ quan trọng trước.' },
  { id: 'q2', question: 'Design token là gì?|||What is a design token?', options: ['Một loại mật khẩu|||A kind of password', 'Giá trị thiết kế tái dùng (màu, khoảng cách, kiểu chữ) làm nguồn sự thật chung|||Reusable design values (color, spacing, typography) as a shared source of truth', 'Một khách hàng trả tiền|||A paying customer', 'Một plugin của trình duyệt|||A browser plugin'], correctIndex: 1, explanation: 'Token là các giá trị thiết kế (màu, spacing, type) tái dùng để giữ nhất quán toàn hệ.' },
  { id: 'q3', question: 'Lợi ích chính của một design system là?|||The main benefit of a design system is?', options: ['Làm sản phẩm chậm hơn|||It makes the product slower', 'Nhất quán và tốc độ: tái dùng component và token trên nhiều màn hình|||Consistency and speed: reusing components and tokens across many screens', 'Loại bỏ hoàn toàn nhu cầu nghiên cứu người dùng|||It removes any need for user research', 'Chỉ dùng cho in ấn|||It is only for print'], correctIndex: 1, explanation: 'Design system cho tái dùng component/token, giữ nhất quán và giúp nhóm ship nhanh.' },
]);

const c6 = doc('wdu202c-6-1-ux-usability', '6.1 — UX principles & usability|||6.1 — Nguyên tắc UX & khả dụng',
  '10 heuristic khả dụng của Nielsen, affordance & signifier, phản hồi & mapping (Norman), cùng accessibility (WCAG) để giao diện dễ dùng cho mọi người.',
  [[
    `<span class="eyebrow">WDU202c · Chapter 6 · Lesson 6.1</span>
<h2>UX principles &amp; usability</h2>
<h3>Nielsen 10 usability heuristics</h3>
<p>Jakob Nielsen 10 rules of thumb are the field standard for evaluating any interface:</p>
<ol>
<li>Visibility of system status</li>
<li>Match between system and the real world</li>
<li>User control &amp; freedom (undo/redo, exits)</li>
<li>Consistency &amp; standards</li>
<li>Error prevention</li>
<li>Recognition rather than recall</li>
<li>Flexibility &amp; efficiency of use</li>
<li>Aesthetic &amp; minimalist design</li>
<li>Help users recognize, diagnose &amp; recover from errors</li>
<li>Help &amp; documentation</li>
</ol>
<h3>Norman: affordance, signifier, feedback, mapping</h3>
<ul>
<li><strong>Affordance</strong> — what an object lets you do (a button affords pressing).</li>
<li><strong>Signifier</strong> — the visible cue that says how (a button that <em>looks</em> pressable).</li>
<li><strong>Feedback</strong> — a visible/audible response confirming your action registered.</li>
<li><strong>Mapping</strong> — controls arranged to match what they affect (stove knobs matching burners).</li>
</ul>
<h3>Accessibility (a11y)</h3>
<p>Design for everyone: sufficient color contrast (WCAG AA = 4.5:1 for body text), never color alone, keyboard operability, alt text, and clear labels. Accessible design is better design for all users.</p>
<h3>Real-product example</h3>
<p>A "Save" button that shows a spinner then a "Saved" checkmark satisfies <em>visibility of system status</em> and <em>feedback</em>; Gmail undo-send satisfies <em>user control &amp; freedom</em> and <em>error recovery</em>.</p>
<h3>Figma practice</h3>
<p>Take one of your hi-fi screens and audit it against all 10 heuristics; list every violation and one fix each. Check text contrast with a plugin.</p>
<div class="callout"><span class="badge">Heuristic evaluation</span> You do not always need users to find problems — experts scanning against these 10 rules catch many issues fast and cheaply.</div>`,
    `<span class="eyebrow">WDU202c · Chương 6 · Bài 6.1</span>
<h2>Nguyên tắc UX &amp; khả dụng</h2>
<h3>10 heuristic khả dụng của Nielsen</h3>
<p>10 quy tắc kinh nghiệm của Jakob Nielsen là chuẩn của ngành để đánh giá bất kỳ giao diện nào:</p>
<ol>
<li>Hiển thị trạng thái hệ thống</li>
<li>Khớp giữa hệ thống và thế giới thực</li>
<li>Người dùng kiểm soát &amp; tự do (undo/redo, lối thoát)</li>
<li>Nhất quán &amp; theo chuẩn</li>
<li>Ngăn lỗi từ đầu</li>
<li>Nhận ra thay vì phải nhớ</li>
<li>Linh hoạt &amp; hiệu quả khi dùng</li>
<li>Thẩm mỹ &amp; tối giản</li>
<li>Giúp nhận ra, chẩn đoán &amp; phục hồi lỗi</li>
<li>Trợ giúp &amp; tài liệu</li>
</ol>
<h3>Norman: affordance, signifier, phản hồi, mapping</h3>
<ul>
<li><strong>Affordance</strong> — thứ mà một đối tượng cho phép làm (nút cho phép bấm).</li>
<li><strong>Signifier</strong> — tín hiệu nhìn thấy cho biết làm thế nào (một nút <em>trông</em> bấm được).</li>
<li><strong>Phản hồi (feedback)</strong> — phản ứng nhìn/nghe được xác nhận hành động đã ghi nhận.</li>
<li><strong>Mapping (ánh xạ)</strong> — điều khiển bố trí khớp với thứ chúng tác động (núm bếp khớp mắt bếp).</li>
</ul>
<h3>Khả dụng cho mọi người (a11y)</h3>
<p>Thiết kế cho tất cả: tương phản màu đủ (WCAG AA = 4.5:1 cho chữ thân), không chỉ dựa vào màu, thao tác được bằng bàn phím, alt text và nhãn rõ. Thiết kế accessible là thiết kế tốt hơn cho mọi người dùng.</p>
<h3>Ví dụ sản phẩm thật</h3>
<p>Nút "Lưu" hiện spinner rồi dấu tích "Đã lưu" thoả <em>hiển thị trạng thái</em> và <em>phản hồi</em>; tính năng hoàn tác gửi của Gmail thoả <em>kiểm soát &amp; tự do</em> và <em>phục hồi lỗi</em>.</p>
<h3>Thực hành Figma</h3>
<p>Lấy một màn hình hi-fi của bạn và soi nó theo cả 10 heuristic; liệt kê mọi vi phạm và một cách sửa cho mỗi cái. Kiểm tương phản chữ bằng plugin.</p>
<div class="callout"><span class="badge">Heuristic evaluation</span> Không phải lúc nào cũng cần người dùng để tìm lỗi — chuyên gia rà theo 10 quy tắc này bắt được nhiều vấn đề nhanh và rẻ.</div>`,
  ]]);

const c6q = quiz('wdu202c-quiz-6', 'Quiz 6 — UX & usability|||Quiz 6 — UX & khả dụng', [
  { id: 'q1', question: 'Có bao nhiêu heuristic khả dụng nổi tiếng của Nielsen?|||How many famous usability heuristics did Nielsen define?', options: ['5', '10', '20', '3'], correctIndex: 1, explanation: 'Nielsen đưa ra 10 heuristic khả dụng, chuẩn để đánh giá giao diện.' },
  { id: 'q2', question: 'Theo Norman, khác biệt giữa affordance và signifier là?|||Per Norman, the difference between affordance and signifier is?', options: ['Chúng là một|||They are the same', 'Affordance là hành động một vật cho phép; signifier là tín hiệu nhìn thấy cho biết cách làm|||Affordance is what an object lets you do; a signifier is the visible cue showing how', 'Affordance chỉ có ở mobile|||Affordance exists only on mobile', 'Signifier là một loại font|||A signifier is a type of font'], correctIndex: 1, explanation: 'Affordance = khả năng hành động của vật; signifier = tín hiệu trực quan gợi ý cách thực hiện.' },
  { id: 'q3', question: 'Yêu cầu tương phản WCAG AA cho chữ thân thông thường là?|||The WCAG AA contrast ratio for normal body text is?', options: ['1:1', '4.5:1', '10:1', '0.5:1'], correctIndex: 1, explanation: 'WCAG AA yêu cầu tương phản tối thiểu 4.5:1 cho chữ thân để dễ đọc.' },
]);

const c7 = doc('wdu202c-7-1-interaction-mobile', '7.1 — Interaction & mobile design|||7.1 — Thiết kế tương tác & mobile',
  'Interaction design (IxD), microinteraction, responsive & mobile-first, gesture và cảm ứng; khác biệt giữa Google Material và Apple HIG cho Android vs iOS.',
  [[
    `<span class="eyebrow">WDU202c · Chapter 7 · Lesson 7.1</span>
<h2>Interaction &amp; mobile design</h2>
<h3>Interaction design (IxD)</h3>
<p><strong>IxD</strong> designs the dialogue between a person and a product: what happens on tap, drag, scroll or type, and how the system responds. Every interaction has a trigger, rules, feedback and a result.</p>
<h3>Microinteractions</h3>
<p>A <strong>microinteraction</strong> is a small, single-purpose moment — a like button animating, a toggle sliding, a pull-to-refresh spinner. They give feedback, communicate status and add delight without getting in the way.</p>
<h3>Responsive &amp; mobile-first</h3>
<ul>
<li><strong>Responsive design</strong> — layouts adapt to screen size via fluid grids and breakpoints.</li>
<li><strong>Mobile-first</strong> — design the small screen first, then progressively enhance for larger ones. It forces you to prioritize.</li>
<li><strong>Touch</strong> — minimum target ~44-48px, thumb-friendly placement, and gesture support (swipe, long-press).</li>
</ul>
<h3>Platform guidelines: Material vs HIG</h3>
<pre><code>Android (Material Design)   iOS (Human Interface Guidelines)
 - bottom nav, FAB           - tab bar, no FAB
 - elevation &amp; shadows       - blur, translucency, depth
 - back button in system     - back via top-left / swipe
</code></pre>
<p>Respect the platform: users already know its patterns, so following them lowers the learning curve.</p>
<h3>Real-product example</h3>
<p>Instagram double-tap-to-like is a signature microinteraction; its layout is mobile-first and its iOS/Android builds follow each platform navigation so it feels native on both.</p>
<h3>Figma practice</h3>
<p>Design one screen at mobile and desktop widths, and prototype a microinteraction (e.g. a button hover/press state with smart animate).</p>
<div class="callout"><span class="badge">Native feel</span> Following Material on Android and HIG on iOS makes an app feel at home rather than ported.</div>`,
    `<span class="eyebrow">WDU202c · Chương 7 · Bài 7.1</span>
<h2>Thiết kế tương tác &amp; mobile</h2>
<h3>Thiết kế tương tác (IxD)</h3>
<p><strong>IxD</strong> thiết kế cuộc đối thoại giữa con người và sản phẩm: chuyện gì xảy ra khi chạm, kéo, cuộn hay gõ, và hệ thống phản hồi ra sao. Mỗi tương tác có trigger, quy tắc, phản hồi và kết quả.</p>
<h3>Microinteraction</h3>
<p>Một <strong>microinteraction</strong> là khoảnh khắc nhỏ, một mục đích — nút like nhảy hiệu ứng, toggle trượt, spinner kéo-để-làm-mới. Chúng phản hồi, truyền trạng thái và thêm sự thú vị mà không cản đường.</p>
<h3>Responsive &amp; mobile-first</h3>
<ul>
<li><strong>Responsive</strong> — bố cục thích ứng theo kích thước màn hình nhờ lưới linh hoạt và breakpoint.</li>
<li><strong>Mobile-first</strong> — thiết kế màn hình nhỏ trước, rồi mở rộng dần cho màn lớn. Nó buộc bạn ưu tiên.</li>
<li><strong>Cảm ứng</strong> — vùng chạm tối thiểu ~44-48px, đặt vừa ngón cái, và hỗ trợ cử chỉ (vuốt, giữ lâu).</li>
</ul>
<h3>Hướng dẫn nền tảng: Material vs HIG</h3>
<pre><code>Android (Material Design)   iOS (Human Interface Guidelines)
 - bottom nav, FAB           - tab bar, không FAB
 - elevation &amp; đổ bóng       - blur, mờ trong, chiều sâu
 - nút back trong hệ thống   - back ở trên-trái / vuốt
</code></pre>
<p>Tôn trọng nền tảng: người dùng đã quen mẫu hình của nó, nên theo đúng sẽ giảm đường cong học.</p>
<h3>Ví dụ sản phẩm thật</h3>
<p>Chạm hai lần để like của Instagram là microinteraction đặc trưng; bố cục mobile-first và bản iOS/Android theo điều hướng của từng nền tảng nên thấy tự nhiên trên cả hai.</p>
<h3>Thực hành Figma</h3>
<p>Thiết kế một màn hình ở khổ mobile và desktop, và prototype một microinteraction (vd trạng thái hover/press của nút bằng smart animate).</p>
<div class="callout"><span class="badge">Cảm giác native</span> Theo Material trên Android và HIG trên iOS khiến app thấy như thuộc về máy, không phải bị port sang.</div>`,
  ]]);

const c7q = quiz('wdu202c-quiz-7', 'Quiz 7 — Interaction & mobile|||Quiz 7 — Tương tác & mobile', [
  { id: 'q1', question: 'Một microinteraction là gì?|||What is a microinteraction?', options: ['Toàn bộ luồng đăng ký|||The entire sign-up flow', 'Một khoảnh khắc nhỏ, một mục đích (vd nút like nhảy hiệu ứng) để phản hồi và truyền trạng thái|||A small, single-purpose moment (e.g. a like button animating) that gives feedback and status', 'Một tài liệu nghiên cứu|||A research document', 'Một bảng màu|||A color palette'], correctIndex: 1, explanation: 'Microinteraction là khoảnh khắc nhỏ một mục đích, cung cấp phản hồi và trạng thái.' },
  { id: 'q2', question: 'Cách tiếp cận "mobile-first" nghĩa là?|||The mobile-first approach means?', options: ['Chỉ làm app cho điện thoại|||Only build phone apps', 'Thiết kế màn hình nhỏ trước rồi mở rộng dần cho màn lớn, buộc ưu tiên nội dung|||Design the small screen first then progressively enhance for larger ones, forcing prioritization', 'Bỏ qua người dùng desktop mãi mãi|||Ignore desktop users forever', 'Thiết kế desktop trước|||Design desktop first'], correctIndex: 1, explanation: 'Mobile-first bắt đầu từ màn nhỏ rồi nâng cấp dần cho màn lớn, giúp ưu tiên nội dung cốt lõi.' },
  { id: 'q3', question: 'Vì sao nên theo Material Design (Android) và HIG (iOS)?|||Why follow Material Design (Android) and HIG (iOS)?', options: ['Vì bắt buộc về pháp lý|||Because it is legally required', 'Vì người dùng đã quen mẫu hình của nền tảng, theo đúng giúp giảm đường cong học|||Because users already know each platform patterns, so following them lowers the learning curve', 'Vì chúng cấm dùng màu|||Because they forbid color', 'Vì chúng làm app chậm hơn|||Because they make apps slower'], correctIndex: 1, explanation: 'Theo hướng dẫn nền tảng giúp app quen thuộc, native và dễ dùng hơn với người dùng.' },
]);

const c8 = doc('wdu202c-8-1-testing-iteration', '8.1 — Usability testing & iteration|||8.1 — Kiểm thử & lặp',
  'Usability testing (nhiệm vụ, quan sát, think-aloud), A/B testing, thu thập & phân tích phản hồi, và vòng lặp cải tiến để sản phẩm tốt dần theo dữ liệu.',
  [[
    `<span class="eyebrow">WDU202c · Chapter 8 · Lesson 8.1</span>
<h2>Usability testing &amp; iteration</h2>
<h3>Usability testing</h3>
<p><strong>Usability testing</strong> watches real users attempt real tasks on your design and records where they succeed, hesitate or fail. Ask them to <strong>think aloud</strong>; you observe, you do not lead. Nielsen showed that <strong>~5 users</strong> per round surface most usability problems, so test early and often.</p>
<pre><code>A usability test session:
 1. Give a task ("Find and buy a red T-shirt, size M")
 2. Stay quiet; user thinks aloud
 3. Note: task success? time? errors? confusion?
 4. Summarize findings -> prioritize fixes
</code></pre>
<h3>A/B testing</h3>
<p><strong>A/B testing</strong> shows version A to half your users and version B to the other half, then compares a metric (e.g. sign-up rate). Change <em>one</em> thing at a time so you know what caused the difference; decide by data, not opinion.</p>
<h3>Gathering feedback</h3>
<ul>
<li>Qualitative: interviews, open comments, support tickets.</li>
<li>Quantitative: surveys (SUS score), analytics, funnels, heatmaps.</li>
</ul>
<h3>Iterate: close the loop</h3>
<p>Design is never "done". Findings feed back into research or design, you redesign, retest, and improve — the same iterative loop as design thinking, run forever on a live product.</p>
<h3>Real-product example</h3>
<p>Booking.com runs thousands of A/B tests a year; Google famously tested many shades of a link color to pick the highest-performing one. Small, data-driven changes compound.</p>
<h3>Figma practice</h3>
<p>Run a 15-minute usability test of your prototype with one classmate: give 2 tasks, note where they struggle, then make 3 concrete design changes based on what you saw.</p>
<div class="callout"><span class="badge">Close the loop</span> Measure, learn, redesign, repeat. A product improves by iterating on evidence, not by guessing once.</div>`,
    `<span class="eyebrow">WDU202c · Chương 8 · Bài 8.1</span>
<h2>Kiểm thử &amp; lặp</h2>
<h3>Usability testing</h3>
<p><strong>Usability testing</strong> quan sát người dùng thật làm nhiệm vụ thật trên thiết kế của bạn và ghi lại chỗ họ thành công, ngập ngừng hay thất bại. Bảo họ <strong>nói ra suy nghĩ (think aloud)</strong>; bạn quan sát, không dẫn dắt. Nielsen chỉ ra rằng <strong>~5 người dùng</strong> mỗi vòng đã lộ phần lớn vấn đề khả dụng, nên hãy thử sớm và thường xuyên.</p>
<pre><code>Một phiên usability test:
 1. Giao nhiệm vụ ("Tìm và mua áo thun đỏ, size M")
 2. Giữ im lặng; người dùng nói ra suy nghĩ
 3. Ghi: xong việc? thời gian? lỗi? bối rối?
 4. Tổng hợp phát hiện -> ưu tiên sửa
</code></pre>
<h3>A/B testing</h3>
<p><strong>A/B testing</strong> cho một nửa người dùng thấy bản A, nửa kia bản B, rồi so một chỉ số (vd tỉ lệ đăng ký). Đổi <em>một</em> thứ mỗi lần để biết cái gì gây khác biệt; quyết định bằng dữ liệu, không phải ý kiến.</p>
<h3>Thu thập phản hồi</h3>
<ul>
<li>Định tính: phỏng vấn, bình luận mở, ticket hỗ trợ.</li>
<li>Định lượng: khảo sát (điểm SUS), analytics, phễu, heatmap.</li>
</ul>
<h3>Lặp: khép vòng</h3>
<p>Thiết kế không bao giờ "xong". Phát hiện quay lại nghiên cứu hoặc thiết kế, bạn làm lại, thử lại, cải thiện — đúng vòng lặp của design thinking, chạy mãi trên sản phẩm sống.</p>
<h3>Ví dụ sản phẩm thật</h3>
<p>Booking.com chạy hàng ngàn A/B test mỗi năm; Google nổi tiếng đã thử nhiều sắc xanh cho màu link để chọn cái hiệu quả nhất. Những thay đổi nhỏ, dựa dữ liệu, cộng dồn lại.</p>
<h3>Thực hành Figma</h3>
<p>Chạy usability test 15 phút cho prototype của bạn với một bạn học: giao 2 nhiệm vụ, ghi chỗ họ vướng, rồi thực hiện 3 thay đổi thiết kế cụ thể dựa trên điều quan sát.</p>
<div class="callout"><span class="badge">Khép vòng</span> Đo, học, làm lại, lặp. Sản phẩm tốt lên nhờ lặp theo bằng chứng, không phải đoán một lần.</div>`,
  ]]);

const c8q = quiz('wdu202c-quiz-8', 'Quiz 8 — Testing & iteration|||Quiz 8 — Kiểm thử & lặp', [
  { id: 'q1', question: 'Theo Nielsen, cần khoảng bao nhiêu người dùng mỗi vòng để lộ phần lớn vấn đề khả dụng?|||Per Nielsen, about how many users per round reveal most usability problems?', options: ['1', '5', '50', '500'], correctIndex: 1, explanation: 'Khoảng 5 người dùng mỗi vòng đã phát hiện phần lớn vấn đề, nên nên test sớm và lặp nhiều vòng.' },
  { id: 'q2', question: 'Nguyên tắc cốt lõi khi làm A/B testing là?|||A core principle of A/B testing is?', options: ['Đổi nhiều thứ cùng lúc cho nhanh|||Change many things at once to go faster', 'Chỉ thay một biến mỗi lần và quyết định bằng dữ liệu|||Change one variable at a time and decide by data', 'Luôn chọn bản đẹp hơn|||Always pick the prettier version', 'Không cần đo lường|||No measurement needed'], correctIndex: 1, explanation: 'Chỉ đổi một biến mỗi lần thì mới biết yếu tố nào gây khác biệt; quyết định bằng dữ liệu.' },
  { id: 'q3', question: 'Trong usability test, vai trò đúng của người điều phối là?|||In a usability test, the facilitator role should be to?', options: ['Chỉ cho người dùng cách bấm|||Tell the user exactly where to click', 'Giao nhiệm vụ, giữ im lặng và quan sát người dùng nói ra suy nghĩ|||Give tasks, stay quiet and observe the user thinking aloud', 'Tranh luận với người dùng|||Argue with the user', 'Tự làm giúp nhiệm vụ|||Do the task for them'], correctIndex: 1, explanation: 'Người điều phối giao nhiệm vụ rồi quan sát, để người dùng think-aloud, không dẫn dắt.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'WDU202c',
    slug: 'wdu202c-ui-ux-design',
    title: 'UI/UX Design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/WDU202c.webp',
    shortDescription: 'UI/UX end to end — UI vs UX & design thinking, user research, information architecture & flows, wireframes & Figma prototypes, UI principles & design systems, Nielsen heuristics & accessibility, mobile, usability & A/B testing.|||Thiết kế UI/UX trọn vẹn — UI vs UX, nghiên cứu người dùng, kiến trúc thông tin & luồng, wireframe & prototype Figma, nguyên lý UI & design system, heuristic Nielsen & accessibility, mobile, usability & A/B testing.',
    description: 'Môn <strong>WDU202c — UI/UX Design</strong> (Thiết kế giao diện &amp; trải nghiệm người dùng, ngành Thiết kế mỹ thuật số) dạy cách <strong>thiết kế sản phẩm số mà người ta thực sự dùng được</strong>. Từ <strong>UI vs UX &amp; design thinking</strong> → <strong>nghiên cứu người dùng</strong> (persona, journey) → <strong>kiến trúc thông tin &amp; luồng</strong> → <strong>wireframe &amp; prototype</strong> (Figma) → <strong>nguyên lý UI &amp; design system</strong> → <strong>nguyên tắc UX, 10 heuristic Nielsen &amp; accessibility</strong> → <strong>thiết kế tương tác &amp; mobile</strong> (Material/HIG) → <strong>kiểm thử &amp; lặp</strong> (usability, A/B testing). Bám sách chuẩn quốc tế (Norman, Krug, Nielsen Norman Group), song ngữ, ví dụ sản phẩm thật, thực hành Figma và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt UI/UX &amp; human-centered design; quy trình design thinking; user research định tính/định lượng, empathy map, persona, user journey; kiến trúc thông tin, sitemap, user flow, card sorting; wireframe lo-fi/hi-fi, mockup, prototype tương tác trong Figma; bố cục &amp; lưới, phân cấp thị giác, typography, màu &amp; tương phản, component, design token &amp; design system; 10 heuristic Nielsen, affordance/signifier/feedback/mapping (Norman), accessibility (WCAG); interaction design, microinteraction, responsive &amp; mobile-first, Material vs HIG; usability testing (think-aloud), A/B testing, thu &amp; phân tích phản hồi, cải tiến lặp.',
    requirements: 'Không cần nền lập trình. Cần một máy tính và tài khoản Figma miễn phí (Figma for Education) để làm phần thực hành mỗi chương.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển (Norman, Krug), NN/g, Material, HIG, Figma, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'UI vs UX, thiết kế vô hình, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — UI vs UX là gì|||Chapter 1 — What is UI vs UX', description: 'Phân biệt UI/UX, HCD, quy trình design thinking.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu người dùng|||Chapter 2 — User research', description: 'User research, empathy, persona, user journey.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kiến trúc thông tin & luồng|||Chapter 3 — IA & flows', description: 'IA, sitemap, user flow, card sorting.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Wireframe & prototype|||Chapter 4 — Wireframe & prototype', description: 'Lo-fi/hi-fi, wireframe, prototype, Figma.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nguyên lý thiết kế UI|||Chapter 5 — UI principles', description: 'Bố cục, grid, typography, màu, component, design system.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nguyên tắc UX & khả dụng|||Chapter 6 — UX & usability', description: '10 heuristic Nielsen, affordance, feedback, accessibility.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết kế tương tác & mobile|||Chapter 7 — Interaction & mobile', description: 'IxD, microinteraction, responsive, mobile-first, Material/HIG.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kiểm thử & lặp|||Chapter 8 — Testing & iteration', description: 'Usability testing, A/B testing, phản hồi, cải tiến lặp.', lessons: [c8, c8q] },
  ],
};
