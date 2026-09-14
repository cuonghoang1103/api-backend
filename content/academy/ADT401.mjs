/**
 * ADT401 — Mobility Applications Design 2 (Thiết kế ứng dụng di động 2 — nâng cao).
 * Ngành Thiết kế mỹ thuật số, FPTU, Kỳ 8. NỐI TIẾP ADH301 (Design 1) — tập
 * trung nâng cao, KHÔNG lặp cơ bản. Giáo trình: Apple HIG & Google Material
 * (advanced), Refactoring UI, About Face (Cooper), Laws of UX (Yablonski),
 * Figma nâng cao. Song ngữ VI+EN. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${ lồng; & trong HTML → &amp; ; "<" → &lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('adt401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nâng cao (Refactoring UI, About Face, Laws of UX), Apple HIG & Material Design, tài liệu Figma, YouTube, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">ADT401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to level up in <strong>advanced mobile product design</strong> — design systems, motion, advanced Figma, data-heavy UI, accessibility and design ops — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, canonical references.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ADT401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.refactoringui.com/" target="_blank" rel="noopener"><em>Refactoring UI</em> — Wathan &amp; Schoger</a></li>
<li><a href="https://www.wiley.com/en-us/About+Face%3A+The+Essentials+of+Interaction+Design%2C+4th+Edition-p-9781118766576" target="_blank" rel="noopener"><em>About Face</em> — Alan Cooper (Interaction Design)</a></li>
<li><a href="https://lawsofux.com/" target="_blank" rel="noopener"><em>Laws of UX</em> — Jon Yablonski</a></li>
</ul>
<h3>🌐 Official platform guidelines</h3>
<ul>
<li><a href="https://developer.apple.com/design/human-interface-guidelines/" target="_blank" rel="noopener">Apple Human Interface Guidelines (HIG)</a></li>
<li><a href="https://m3.material.io/" target="_blank" rel="noopener">Material Design 3 (Google)</a></li>
<li><a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener">WCAG 2.2 Quick Reference (W3C)</a></li>
</ul>
<h3>🎨 Figma documentation</h3>
<ul>
<li><a href="https://help.figma.com/hc/en-us/articles/360056440594-Create-and-manage-variables" target="_blank" rel="noopener">Figma variables (tokens)</a></li>
<li><a href="https://help.figma.com/hc/en-us/articles/5731482952599-Add-motion-to-prototypes" target="_blank" rel="noopener">Figma prototyping &amp; motion (Smart Animate)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@figma" target="_blank" rel="noopener">Figma</a> — official Config talks &amp; tutorials</li>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — design craft &amp; career</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — design, variables, auto-layout, prototyping</li>
<li><a href="https://tokens.studio/" target="_blank" rel="noopener">Tokens Studio</a> — design tokens for Figma</li>
<li><a href="https://www.figma.com/community/plugin/732603254453395948/able" target="_blank" rel="noopener">Able / Stark</a> — contrast &amp; accessibility checkers</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation recap</strong> — assume Design 1 (layout, nav, basic components); start from a working design system.</li>
<li><strong>Systematize</strong> — tokens, theming, motion language, advanced Figma prototypes.</li>
<li><strong>Go deep</strong> — data-heavy dashboards, onboarding &amp; growth, WCAG accessibility.</li>
<li><strong>Ship with a team</strong> — design ops, dev handoff, A/B testing, metrics, AI-driven UX.</li>
</ol></div>`,
    `<span class="eyebrow">ADT401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để nâng trình <strong>thiết kế sản phẩm di động nâng cao</strong> — design system, motion, Figma nâng cao, UI nhiều dữ liệu, accessibility và design ops — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chuẩn mực.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ADT401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.refactoringui.com/" target="_blank" rel="noopener"><em>Refactoring UI</em> — Wathan &amp; Schoger</a></li>
<li><a href="https://www.wiley.com/en-us/About+Face%3A+The+Essentials+of+Interaction+Design%2C+4th+Edition-p-9781118766576" target="_blank" rel="noopener"><em>About Face</em> — Alan Cooper (Thiết kế tương tác)</a></li>
<li><a href="https://lawsofux.com/" target="_blank" rel="noopener"><em>Laws of UX</em> — Jon Yablonski</a></li>
</ul>
<h3>🌐 Hướng dẫn nền tảng chính thức</h3>
<ul>
<li><a href="https://developer.apple.com/design/human-interface-guidelines/" target="_blank" rel="noopener">Apple Human Interface Guidelines (HIG)</a></li>
<li><a href="https://m3.material.io/" target="_blank" rel="noopener">Material Design 3 (Google)</a></li>
<li><a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener">WCAG 2.2 Quick Reference (W3C)</a></li>
</ul>
<h3>🎨 Tài liệu Figma</h3>
<ul>
<li><a href="https://help.figma.com/hc/en-us/articles/360056440594-Create-and-manage-variables" target="_blank" rel="noopener">Figma variables (token)</a></li>
<li><a href="https://help.figma.com/hc/en-us/articles/5731482952599-Add-motion-to-prototypes" target="_blank" rel="noopener">Figma prototyping &amp; motion (Smart Animate)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@figma" target="_blank" rel="noopener">Figma</a> — talk Config &amp; hướng dẫn chính thức</li>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — tay nghề thiết kế &amp; nghề nghiệp</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — thiết kế, variables, auto-layout, prototyping</li>
<li><a href="https://tokens.studio/" target="_blank" rel="noopener">Tokens Studio</a> — design token cho Figma</li>
<li><a href="https://www.figma.com/community/plugin/732603254453395948/able" target="_blank" rel="noopener">Able / Stark</a> — kiểm tra tương phản &amp; accessibility</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ôn nền</strong> — coi như đã có Design 1 (layout, điều hướng, component cơ bản); bắt đầu từ một design system chạy được.</li>
<li><strong>Hệ thống hoá</strong> — token, theming, ngôn ngữ motion, prototype Figma nâng cao.</li>
<li><strong>Đào sâu</strong> — dashboard nhiều dữ liệu, onboarding &amp; growth, accessibility WCAG.</li>
<li><strong>Ship cùng team</strong> — design ops, bàn giao dev, A/B testing, metrics, AI-driven UX.</li>
</ol></div>`,
  ]]);

const intro = doc('adt401-0-1-overview', 'Course overview: Advanced mobile design|||Tổng quan: Thiết kế di động nâng cao',
  'ADT401 nối tiếp Design 1: từ "vẽ được màn hình" lên "vận hành một hệ thống thiết kế": token & theming, motion, Figma nâng cao, dữ liệu, growth, accessibility, design ops, A/B testing & AI-driven UX.',
  [[
    `<span class="eyebrow">ADT401 · Lesson 0.1 · Overview</span>
<h2>Advanced Mobility Applications Design</h2>
<p class="lead">This is <strong>Design 2</strong> — the sequel to Mobility Applications Design 1. Design 1 got you drawing correct screens (layout, navigation, basic components). Design 2 is about <strong>running a design system at scale</strong>: making design consistent, motion meaningful, data legible, products accessible, and handoff to engineers frictionless.</p>
<h3>What changes at this level</h3>
<ul>
<li><strong>From screens to systems</strong> — you stop drawing pixels and start defining <em>tokens</em>, <em>rules</em>, and <em>components</em> that scale across a whole app.</li>
<li><strong>From static to motion</strong> — transitions and micro-interactions become part of the design, not decoration.</li>
<li><strong>From solo to team</strong> — design ops, dev handoff, and metrics/A-B testing turn design into a measurable, collaborative discipline.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<pre><code>1. Design systems, tokens &amp; theming (dark mode, cross-platform)
2. Micro-interactions &amp; motion design
3. Advanced Figma prototyping (variables, auto-layout, variants)
4. Data-heavy &amp; dashboard design on mobile
5. Personalization, onboarding &amp; growth design
6. Advanced accessibility (WCAG, inclusive design)
7. Design ops, handoff &amp; design-to-code
8. Advanced research, A/B testing, metrics &amp; AI-driven UX
</code></pre>
<div class="callout"><span class="badge">Grounded in the classics</span> We lean on Apple HIG &amp; Material Design (advanced), <em>Refactoring UI</em>, Cooper's <em>About Face</em> and Yablonski's <em>Laws of UX</em> — principles, not just tool clicks.</div>`,
    `<span class="eyebrow">ADT401 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế ứng dụng di động nâng cao</h2>
<p class="lead">Đây là <strong>Design 2</strong> — phần nối tiếp Thiết kế ứng dụng di động 1. Design 1 giúp bạn vẽ được màn hình đúng (layout, điều hướng, component cơ bản). Design 2 nói về <strong>vận hành một hệ thống thiết kế ở quy mô lớn</strong>: làm thiết kế nhất quán, motion có nghĩa, dữ liệu dễ đọc, sản phẩm dễ tiếp cận, và bàn giao cho kỹ sư trơn tru.</p>
<h3>Ở mức này, điều gì thay đổi</h3>
<ul>
<li><strong>Từ màn hình sang hệ thống</strong> — bạn thôi vẽ từng pixel và bắt đầu định nghĩa <em>token</em>, <em>quy tắc</em>, <em>component</em> để mở rộng cho cả app.</li>
<li><strong>Từ tĩnh sang động</strong> — chuyển cảnh và micro-interaction trở thành một phần của thiết kế, không phải trang trí.</li>
<li><strong>Từ một mình sang team</strong> — design ops, bàn giao dev, và metrics/A-B testing biến thiết kế thành một môn có đo đạc, có phối hợp.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<pre><code>1. Design system, token &amp; theming (dark mode, đa nền tảng)
2. Micro-interaction &amp; motion design
3. Prototyping Figma nâng cao (variables, auto-layout, variants)
4. Thiết kế nhiều dữ liệu &amp; dashboard trên mobile
5. Cá nhân hoá, onboarding &amp; growth design
6. Accessibility nâng cao (WCAG, inclusive design)
7. Design ops, handoff &amp; design-to-code
8. Nghiên cứu nâng cao, A/B testing, metrics &amp; AI-driven UX
</code></pre>
<div class="callout"><span class="badge">Bám các tác phẩm kinh điển</span> Chúng ta dựa vào Apple HIG &amp; Material Design (nâng cao), <em>Refactoring UI</em>, <em>About Face</em> của Cooper và <em>Laws of UX</em> của Yablonski — nguyên lý, không chỉ thao tác công cụ.</div>`,
  ]]);

const c1 = doc('adt401-1-1-design-system-tokens', '1.1 — Advanced design systems, tokens & theming|||1.1 — Design system nâng cao, token & theming',
  'Kiến trúc token 3 lớp (primitive → semantic → component), theming (dark mode, đa nền tảng iOS/Android), một nguồn sự thật; đồng bộ token Figma ↔ code.',
  [[
    `<span class="eyebrow">ADT401 · Chapter 1 · Lesson 1.1</span>
<h2>Advanced design systems, tokens &amp; theming</h2>
<p>A mature design system is not a sticker sheet — it is a <strong>single source of truth</strong> expressed as <strong>design tokens</strong>: named, reusable decisions (color, spacing, radius, type) that every screen references instead of hard-coding.</p>
<h3>Three-layer token architecture</h3>
<pre><code>Primitive  -> raw values          e.g. blue-500 = #2F6BFF, space-4 = 16px
Semantic   -> intent, theme-aware  e.g. color.action = blue-500 (light) / blue-300 (dark)
Component  -> per-component        e.g. button.bg = color.action, button.radius = radius.md
</code></pre>
<p>The rule: <strong>UI references semantic/component tokens, never primitives.</strong> Change one semantic mapping and dark mode, rebrands, and platform variants all follow — no screen edited by hand.</p>
<h3>Theming: dark mode &amp; cross-platform</h3>
<ul>
<li><strong>Dark mode</strong> is a re-mapping of semantic tokens, not a new file: <code>color.surface</code> flips light→dark; contrast is re-checked (see Chapter 6).</li>
<li><strong>Cross-platform</strong> — the same tokens feed iOS (HIG) and Android (Material): shared intent, platform-specific components (e.g. tab bar vs. navigation drawer).</li>
</ul>
<div class="callout"><span class="badge">Refactoring UI</span> "Define your palette and spacing scale up front, then only choose from it." Constraints are what make a system feel coherent — tokens encode those constraints.</div>`,
    `<span class="eyebrow">ADT401 · Chương 1 · Bài 1.1</span>
<h2>Design system nâng cao, token &amp; theming</h2>
<p>Một design system trưởng thành không phải một bảng dán nhãn — nó là <strong>một nguồn sự thật duy nhất</strong> biểu diễn bằng <strong>design token</strong>: những quyết định có tên, tái dùng được (màu, khoảng cách, bo góc, chữ) mà mọi màn hình tham chiếu tới thay vì gán cứng.</p>
<h3>Kiến trúc token 3 lớp</h3>
<pre><code>Primitive  -> giá trị thô          vd blue-500 = #2F6BFF, space-4 = 16px
Semantic   -> theo ý nghĩa, có theme vd color.action = blue-500 (sáng) / blue-300 (tối)
Component  -> theo từng component   vd button.bg = color.action, button.radius = radius.md
</code></pre>
<p>Quy tắc: <strong>UI tham chiếu token semantic/component, KHÔNG tham chiếu primitive.</strong> Đổi một ánh xạ semantic là dark mode, đổi thương hiệu, và biến thể nền tảng đều đi theo — không sửa tay màn hình nào.</p>
<h3>Theming: dark mode &amp; đa nền tảng</h3>
<ul>
<li><strong>Dark mode</strong> là việc ánh xạ lại token semantic, không phải một file mới: <code>color.surface</code> lật sáng→tối; tương phản được kiểm lại (xem Chương 6).</li>
<li><strong>Đa nền tảng</strong> — cùng bộ token nuôi cả iOS (HIG) và Android (Material): ý nghĩa dùng chung, component riêng theo nền tảng (vd tab bar so với navigation drawer).</li>
</ul>
<div class="callout"><span class="badge">Refactoring UI</span> "Định nghĩa bảng màu và thang khoảng cách trước, rồi chỉ chọn TỪ đó." Ràng buộc mới làm hệ thống nhất quán — token mã hoá những ràng buộc ấy.</div>`,
  ]]);

const c1q = quiz('adt401-quiz-1', 'Quiz 1 — Tokens & theming|||Quiz 1 — Token & theming', [
  { id: 'q1', question: 'Trong kiến trúc token 3 lớp, UI nên tham chiếu tới lớp nào?', options: ['Primitive (giá trị thô như #2F6BFF)', 'Semantic/Component (theo ý nghĩa)', 'Trực tiếp mã hex trên từng màn', 'Không dùng token, gán cứng'], correctIndex: 1, explanation: 'UI tham chiếu token semantic/component; primitive chỉ là giá trị thô nằm dưới. Nhờ vậy đổi một ánh xạ semantic là dark mode/rebrand tự theo.' },
  { id: 'q2', question: 'Cách đúng để làm dark mode trong hệ token là gì?', options: ['Tạo một bộ file thiết kế hoàn toàn mới', 'Ánh xạ lại các token semantic (vd color.surface) theo theme', 'Đổi từng màu hex trên mỗi màn hình bằng tay', 'Chỉ giảm độ sáng màn hình'], correctIndex: 1, explanation: 'Dark mode là việc re-map token semantic theo theme, không phải nhân bản file hay sửa tay từng màn.' },
  { id: 'q3', question: 'Cùng bộ token dùng cho cả iOS và Android nói lên điều gì?', options: ['Hai nền tảng phải giống hệt nhau về component', 'Ý nghĩa (semantic) dùng chung, còn component có thể khác theo nền tảng', 'Chỉ Android mới dùng được token', 'Token không áp dụng cho đa nền tảng'], correctIndex: 1, explanation: 'Token mã hoá ý nghĩa dùng chung; component vẫn theo chuẩn riêng (HIG vs Material) như tab bar vs navigation drawer.' },
]);

const c2 = doc('adt401-2-1-motion-microinteraction', '2.1 — Micro-interactions & motion design|||2.1 — Micro-interaction & motion design',
  'Giải phẫu micro-interaction (trigger → rules → feedback → loops), vai trò của motion (định hướng, phản hồi, liên tục), easing & duration, prototyping animation; motion phục vụ nghĩa chứ không trang trí.',
  [[
    `<span class="eyebrow">ADT401 · Chapter 2 · Lesson 2.1</span>
<h2>Micro-interactions &amp; motion design</h2>
<p>A <strong>micro-interaction</strong> is a single, contained moment: a toggle flip, a pull-to-refresh, a like animation. Motion is <em>not decoration</em> — it communicates. Well-designed motion tells the user what happened, what is loading, and where a new screen came from.</p>
<h3>Anatomy of a micro-interaction</h3>
<pre><code>Trigger   -> what starts it (user tap, or a system event)
Rules     -> what happens (what changes, in what order)
Feedback  -> what the user sees/feels (the animation, haptic, sound)
Loops/Modes -> what happens over time / on repeat
</code></pre>
<h3>What motion is FOR</h3>
<ul>
<li><strong>Orientation</strong> — a screen sliding in from the right says "you went forward"; sliding back says "you returned".</li>
<li><strong>Feedback</strong> — a button that depresses confirms the tap registered.</li>
<li><strong>Continuity</strong> — a thumbnail expanding into a full image keeps the user's mental thread (shared-element transition).</li>
</ul>
<h3>Easing &amp; duration</h3>
<p>Real objects accelerate and decelerate — use <strong>ease-in-out</strong>, not linear. Keep mobile transitions short (<strong>~200–300ms</strong>); too slow feels sluggish, too fast feels jarring. Material calls this "responsive, natural" motion.</p>
<div class="callout"><span class="badge">Doherty threshold (Laws of UX)</span> Keep system response under ~400ms and the user stays engaged. Motion can <em>mask</em> latency (a skeleton loader) but must never <em>add</em> needless delay.</div>`,
    `<span class="eyebrow">ADT401 · Chương 2 · Bài 2.1</span>
<h2>Micro-interaction &amp; motion design</h2>
<p>Một <strong>micro-interaction</strong> là một khoảnh khắc đơn lẻ, gọn: cú lật toggle, kéo-để-làm-mới, animation nút thích. Motion <em>không phải trang trí</em> — nó truyền đạt. Motion tốt cho người dùng biết vừa xảy ra chuyện gì, đang tải gì, và màn hình mới đến từ đâu.</p>
<h3>Giải phẫu một micro-interaction</h3>
<pre><code>Trigger   -> cái khởi động (người dùng chạm, hoặc sự kiện hệ thống)
Rules     -> chuyện gì xảy ra (đổi cái gì, theo thứ tự nào)
Feedback  -> người dùng thấy/cảm gì (animation, rung haptic, âm)
Loops/Modes -> chuyện gì diễn ra theo thời gian / khi lặp lại
</code></pre>
<h3>Motion DÙNG để làm gì</h3>
<ul>
<li><strong>Định hướng</strong> — màn trượt vào từ phải nói "bạn đã đi tới"; trượt ngược nói "bạn quay lại".</li>
<li><strong>Phản hồi</strong> — nút lún xuống xác nhận cú chạm đã được ghi nhận.</li>
<li><strong>Liên tục</strong> — ảnh thu nhỏ nở ra thành ảnh đầy đủ giữ mạch tư duy của người dùng (chuyển cảnh phần tử chung).</li>
</ul>
<h3>Easing &amp; thời lượng</h3>
<p>Vật thật có tăng tốc và giảm tốc — dùng <strong>ease-in-out</strong>, không dùng linear. Giữ chuyển cảnh mobile ngắn (<strong>~200–300ms</strong>); quá chậm thấy ì, quá nhanh thấy giật. Material gọi đây là motion "phản hồi nhanh, tự nhiên".</p>
<div class="callout"><span class="badge">Ngưỡng Doherty (Laws of UX)</span> Giữ phản hồi hệ thống dưới ~400ms thì người dùng vẫn cuốn theo. Motion có thể <em>che</em> độ trễ (skeleton loader) nhưng không được <em>thêm</em> trễ vô ích.</div>`,
  ]]);

const c2q = quiz('adt401-quiz-2', 'Quiz 2 — Motion & micro-interaction|||Quiz 2 — Motion & micro-interaction', [
  { id: 'q1', question: 'Bốn phần trong giải phẫu một micro-interaction (Dan Saffer) là?', options: ['Trigger, Rules, Feedback, Loops/Modes', 'Màu, Chữ, Icon, Layout', 'Header, Body, Footer, Nav', 'Ý tưởng, Sketch, Mockup, Deploy'], correctIndex: 0, explanation: 'Micro-interaction gồm Trigger (khởi động) → Rules (quy tắc) → Feedback (phản hồi) → Loops/Modes (vòng lặp/chế độ).' },
  { id: 'q2', question: 'Vì sao nên dùng ease-in-out thay vì chuyển động linear trên mobile?', options: ['Vì linear tốn pin hơn', 'Vì vật thật tăng/giảm tốc dần, ease-in-out thấy tự nhiên hơn', 'Vì linear không chạy được trên iOS', 'Không có khác biệt gì'], correctIndex: 1, explanation: 'Vật thể thật gia tốc rồi giảm tốc; ease-in-out mô phỏng điều đó nên chuyển cảnh thấy tự nhiên, còn linear thấy máy móc.' },
  { id: 'q3', question: 'Theo ngưỡng Doherty, motion nên làm gì với độ trễ hệ thống?', options: ['Thêm trễ để trông "mượt"', 'Kéo dài animation càng lâu càng đẹp', 'Che độ trễ (vd skeleton loader) nhưng không thêm trễ vô ích', 'Bỏ hết animation để nhanh nhất'], correctIndex: 2, explanation: 'Giữ phản hồi dưới ~400ms; motion có thể che độ trễ chờ dữ liệu (skeleton) nhưng không được cộng thêm trễ không cần thiết.' },
]);

const c3 = doc('adt401-3-1-advanced-figma', '3.1 — Advanced prototyping in Figma|||3.1 — Prototyping nâng cao trong Figma',
  'Auto-layout (responsive không cần vẽ lại), component variants & properties (một component nhiều trạng thái), variables (token, chế độ theme, prototype có logic), Smart Animate; dựng prototype gần như sản phẩm thật.',
  [[
    `<span class="eyebrow">ADT401 · Chapter 3 · Lesson 3.1</span>
<h2>Advanced prototyping in Figma</h2>
<p>Design 1 used frames and static screens. At this level Figma becomes a <strong>systems tool</strong> — you build once and reuse everywhere, and prototypes behave almost like the real app.</p>
<h3>The four power features</h3>
<ul>
<li><strong>Auto-layout</strong> — frames that resize and reflow like real CSS flexbox: content grows, padding stays, no manual re-nudging.</li>
<li><strong>Component variants</strong> — one component with properties (state=default/hover/disabled, size=sm/md/lg) instead of 12 separate copies.</li>
<li><strong>Variables</strong> — Figma's design tokens: color/number/string/boolean, with <strong>modes</strong> (light/dark, EN/VI) that swap an entire design in one click. They also drive prototype logic.</li>
<li><strong>Smart Animate</strong> — matches layers between frames by name and tweens them, so a prototype shows real motion (Chapter 2).</li>
</ul>
<h3>A component-properties spec</h3>
<pre><code>Component: Button
  Property  Type      Values
  --------  --------  ---------------------------
  variant   variant   primary | secondary | ghost
  size      variant   sm | md | lg
  icon?     boolean   true | false
  label     text      "Continue"
  state     variant   default | pressed | disabled
</code></pre>
<div class="callout"><span class="badge">Build once</span> Variables + variants + auto-layout mean a design change (new brand color, bigger touch target) propagates through the whole file — the digital twin of the token system in Chapter 1.</div>`,
    `<span class="eyebrow">ADT401 · Chương 3 · Bài 3.1</span>
<h2>Prototyping nâng cao trong Figma</h2>
<p>Design 1 dùng frame và màn hình tĩnh. Ở mức này Figma trở thành <strong>công cụ hệ thống</strong> — bạn dựng một lần rồi tái dùng khắp nơi, và prototype hành xử gần như app thật.</p>
<h3>Bốn tính năng mạnh</h3>
<ul>
<li><strong>Auto-layout</strong> — frame co giãn và sắp lại như flexbox CSS thật: nội dung nở ra, padding giữ nguyên, không phải nắn tay.</li>
<li><strong>Component variants</strong> — một component với các thuộc tính (state=default/hover/disabled, size=sm/md/lg) thay vì 12 bản sao rời.</li>
<li><strong>Variables</strong> — design token của Figma: color/number/string/boolean, có <strong>mode</strong> (sáng/tối, EN/VI) đổi cả thiết kế trong một cú bấm. Nó cũng điều khiển logic prototype.</li>
<li><strong>Smart Animate</strong> — khớp layer giữa các frame theo TÊN rồi tween, để prototype thể hiện motion thật (Chương 2).</li>
</ul>
<h3>Một bảng đặc tả component-properties</h3>
<pre><code>Component: Button
  Thuộc tính  Kiểu      Giá trị
  ----------  --------  ---------------------------
  variant     variant   primary | secondary | ghost
  size        variant   sm | md | lg
  icon?       boolean   true | false
  label       text      "Tiếp tục"
  state       variant   default | pressed | disabled
</code></pre>
<div class="callout"><span class="badge">Dựng một lần</span> Variables + variants + auto-layout khiến một thay đổi thiết kế (màu thương hiệu mới, vùng chạm to hơn) lan khắp file — bản sinh đôi số của hệ token ở Chương 1.</div>`,
  ]]);

const c3q = quiz('adt401-quiz-3', 'Quiz 3 — Advanced Figma|||Quiz 3 — Figma nâng cao', [
  { id: 'q1', question: 'Auto-layout trong Figma gần nhất với khái niệm nào của web?', options: ['File CSS tĩnh', 'Flexbox (co giãn, reflow, giữ padding)', 'Ảnh PNG', 'Thẻ <table> cố định'], correctIndex: 1, explanation: 'Auto-layout hành xử như flexbox: nội dung co giãn và sắp lại, padding giữ nguyên, không phải nắn tay từng phần tử.' },
  { id: 'q2', question: 'Dùng component variants (thuộc tính) thay cho nhiều bản sao rời mang lại lợi ích gì?', options: ['Một component gói nhiều trạng thái/kích cỡ, dễ bảo trì', 'File nặng hơn nhưng đẹp hơn', 'Không thể prototype được nữa', 'Bắt buộc phải vẽ lại mỗi trạng thái'], correctIndex: 0, explanation: 'Variants gom các trạng thái (default/hover/disabled) và kích cỡ vào một component có thuộc tính, thay vì 12 bản sao phải sửa từng cái.' },
  { id: 'q3', question: 'Smart Animate khớp các layer giữa hai frame dựa trên gì?', options: ['Màu sắc của layer', 'Vị trí ngẫu nhiên', 'TÊN của layer (rồi tween giữa hai trạng thái)', 'Kích thước file'], correctIndex: 2, explanation: 'Smart Animate ghép layer trùng TÊN giữa hai frame rồi nội suy (tween) vị trí/kích cỡ/opacity để tạo chuyển động thật.' },
]);

const c4 = doc('adt401-4-1-data-dashboard', '4.1 — Data-heavy & dashboard design on mobile|||4.1 — Thiết kế nhiều dữ liệu & dashboard trên mobile',
  'Phân cấp thông tin trên màn nhỏ, chọn đúng biểu đồ, progressive disclosure, bảng dữ liệu trên mobile, empty/loading/error states; ưu tiên "một câu trả lời trên màn hình".',
  [[
    `<span class="eyebrow">ADT401 · Chapter 4 · Lesson 4.1</span>
<h2>Data-heavy &amp; dashboard design on mobile</h2>
<p>Dashboards fail on mobile when they cram a desktop grid onto a 6-inch screen. The advanced skill is <strong>ruthless prioritization</strong>: a mobile dashboard should answer <em>one primary question</em> above the fold, with detail one tap away.</p>
<h3>Principles</h3>
<ul>
<li><strong>Hierarchy first</strong> — the single most important number is biggest; supporting metrics are smaller; raw tables are deepest.</li>
<li><strong>Progressive disclosure</strong> — show a summary, let the user drill down (card → detail → filter). Don't show everything at once.</li>
<li><strong>Right chart for the job</strong> — trend over time = line; parts of a whole = bar/stacked (avoid tiny pie slices); comparison = bar. Label directly; avoid legends that force eyes to bounce.</li>
<li><strong>Tables on mobile</strong> — a wide table becomes a list of cards, or a horizontally scrollable region with a frozen first column — never a shrunken desktop grid.</li>
</ul>
<h3>Every data view needs its states</h3>
<pre><code>Loading  -> skeleton / shimmer (not a blank screen)
Empty    -> explain why + a clear next action ("Add your first account")
Error    -> what failed + how to retry
Partial  -> stale data badge while refreshing
Ideal    -> the populated, happy path
</code></pre>
<div class="callout"><span class="badge">Data-ink</span> Cut chrome, gridlines and decoration until only the data speaks. On a small screen every non-data pixel is competing with the answer.</div>`,
    `<span class="eyebrow">ADT401 · Chương 4 · Bài 4.1</span>
<h2>Thiết kế nhiều dữ liệu &amp; dashboard trên mobile</h2>
<p>Dashboard hỏng trên mobile khi nhồi cả lưới desktop vào màn 6 inch. Kỹ năng nâng cao là <strong>ưu tiên tàn nhẫn</strong>: một dashboard mobile nên trả lời <em>một câu hỏi chính</em> ngay trên màn đầu, chi tiết chỉ cách một cú chạm.</p>
<h3>Nguyên tắc</h3>
<ul>
<li><strong>Phân cấp trước</strong> — con số quan trọng nhất to nhất; metric phụ nhỏ hơn; bảng thô nằm sâu nhất.</li>
<li><strong>Progressive disclosure</strong> — hiện tóm tắt, cho người dùng đào sâu (thẻ → chi tiết → lọc). Đừng phơi hết một lúc.</li>
<li><strong>Chọn đúng biểu đồ</strong> — xu hướng theo thời gian = đường; phần của tổng = cột/xếp chồng (tránh lát tròn tí hon); so sánh = cột. Dán nhãn trực tiếp; tránh legend bắt mắt nhảy qua lại.</li>
<li><strong>Bảng trên mobile</strong> — bảng rộng biến thành danh sách thẻ, hoặc vùng cuộn ngang có cột đầu ghim — đừng thu nhỏ lưới desktop.</li>
</ul>
<h3>Mỗi view dữ liệu cần đủ các trạng thái</h3>
<pre><code>Loading  -> skeleton / shimmer (không phải màn trắng)
Empty    -> nói vì sao + hành động kế rõ ràng ("Thêm tài khoản đầu tiên")
Error    -> hỏng gì + cách thử lại
Partial  -> nhãn dữ liệu cũ trong lúc làm mới
Ideal    -> đường "hạnh phúc", dữ liệu đầy đủ
</code></pre>
<div class="callout"><span class="badge">Data-ink</span> Cắt viền, đường kẻ lưới và trang trí đến khi chỉ còn dữ liệu lên tiếng. Trên màn nhỏ, mỗi pixel không phải dữ liệu đều đang tranh chỗ với câu trả lời.</div>`,
  ]]);

const c4q = quiz('adt401-quiz-4', 'Quiz 4 — Data & dashboards|||Quiz 4 — Dữ liệu & dashboard', [
  { id: 'q1', question: 'Nguyên tắc cốt lõi khi đưa dashboard lên màn hình mobile là gì?', options: ['Nhồi nguyên lưới desktop vào cho đủ dữ liệu', 'Ưu tiên tàn nhẫn: trả lời một câu hỏi chính trước, chi tiết cách một cú chạm', 'Dùng chữ nhỏ nhất có thể để vừa hết', 'Bỏ hết biểu đồ, chỉ để bảng số'], correctIndex: 1, explanation: 'Màn nhỏ buộc phải ưu tiên: một câu hỏi chính trên màn đầu, còn lại dùng progressive disclosure để đào sâu.' },
  { id: 'q2', question: 'Để thể hiện xu hướng của một chỉ số theo thời gian, loại biểu đồ phù hợp nhất là?', options: ['Biểu đồ tròn (pie)', 'Biểu đồ đường (line)', 'Bảng số thô', 'Biểu đồ radar'], correctIndex: 1, explanation: 'Xu hướng theo thời gian hợp với biểu đồ đường; pie hợp cho phần của tổng nhưng lát nhỏ khó đọc trên mobile.' },
  { id: 'q3', question: 'Một view dữ liệu tốt cần thiết kế các trạng thái nào ngoài trạng thái đầy đủ?', options: ['Chỉ cần trạng thái đầy đủ là đủ', 'Loading, Empty, Error (và partial/stale) — không để màn trắng', 'Chỉ cần trạng thái loading', 'Chỉ cần màu nền đẹp'], correctIndex: 1, explanation: 'Phải thiết kế loading (skeleton), empty (giải thích + hành động kế), error (cách thử lại), partial — thay vì bỏ mặc màn trắng.' },
]);

const c5 = doc('adt401-5-1-onboarding-growth', '5.1 — Personalization, onboarding & growth design|||5.1 — Cá nhân hoá, onboarding & growth design',
  'Onboarding hướng giá trị (aha moment, progressive onboarding), cá nhân hoá, vòng lặp growth (hook: trigger → action → reward → investment), thiết kế đạo đức tránh dark pattern.',
  [[
    `<span class="eyebrow">ADT401 · Chapter 5 · Lesson 5.1</span>
<h2>Personalization, onboarding &amp; growth design</h2>
<p>The first session decides retention. <strong>Onboarding</strong> is not a slideshow of features — it is the shortest path to the user's first win (the <em>aha moment</em>).</p>
<h3>Onboarding that works</h3>
<ul>
<li><strong>Value first, signup later</strong> — let people experience the product before asking for an account or permissions.</li>
<li><strong>Progressive onboarding</strong> — teach in context, when a feature is first needed, not all upfront.</li>
<li><strong>Reduce to the aha moment</strong> — cut every step that does not move the user toward their first success.</li>
</ul>
<h3>Personalization</h3>
<p>Adapt to the user (goals, history, segment) — but keep control visible and reversible. Personalize the <em>content</em>, not the <em>navigation</em> (moving controls around breaks Jakob's Law — users expect consistency).</p>
<h3>Growth loops (the Hook model)</h3>
<pre><code>Trigger    -> external (push) or internal (boredom, FOMO)
Action     -> the simplest behavior in anticipation of reward
Reward     -> variable &amp; satisfying (the pull to come back)
Investment -> user puts something in (data, content) -> loads the next trigger
</code></pre>
<div class="callout"><span class="badge">Design ethically</span> Growth mechanics can slide into <strong>dark patterns</strong> (forced continuity, confirm-shaming). An advanced designer optimizes retention <em>and</em> respects the user — dark patterns win a metric and lose trust.</div>`,
    `<span class="eyebrow">ADT401 · Chương 5 · Bài 5.1</span>
<h2>Cá nhân hoá, onboarding &amp; growth design</h2>
<p>Phiên đầu tiên quyết định giữ chân. <strong>Onboarding</strong> không phải màn trình chiếu tính năng — nó là con đường ngắn nhất tới chiến thắng đầu tiên của người dùng (khoảnh khắc <em>aha</em>).</p>
<h3>Onboarding hiệu quả</h3>
<ul>
<li><strong>Giá trị trước, đăng ký sau</strong> — cho người dùng trải nghiệm sản phẩm trước khi đòi tài khoản hay quyền truy cập.</li>
<li><strong>Progressive onboarding</strong> — dạy theo ngữ cảnh, ngay khi cần tới tính năng, không dồn hết lúc đầu.</li>
<li><strong>Rút về khoảnh khắc aha</strong> — cắt mọi bước không đẩy người dùng tiến tới thành công đầu tiên.</li>
</ul>
<h3>Cá nhân hoá</h3>
<p>Thích ứng theo người dùng (mục tiêu, lịch sử, phân khúc) — nhưng để quyền điều khiển luôn hiện và đảo ngược được. Cá nhân hoá <em>nội dung</em>, đừng cá nhân hoá <em>điều hướng</em> (xê dịch điều khiển phá Định luật Jakob — người dùng mong sự nhất quán).</p>
<h3>Vòng lặp growth (mô hình Hook)</h3>
<pre><code>Trigger    -> ngoài (push) hoặc trong (buồn chán, sợ bỏ lỡ)
Action     -> hành vi đơn giản nhất để mong phần thưởng
Reward     -> đa dạng &amp; thoả mãn (lực kéo quay lại)
Investment -> người dùng bỏ vào (dữ liệu, nội dung) -> nạp trigger kế
</code></pre>
<div class="callout"><span class="badge">Thiết kế có đạo đức</span> Cơ chế growth dễ trượt sang <strong>dark pattern</strong> (khó huỷ, dùng cảm giác tội lỗi để ép). Nhà thiết kế giỏi tối ưu giữ chân <em>và</em> tôn trọng người dùng — dark pattern thắng một metric nhưng mất niềm tin.</div>`,
  ]]);

const c5q = quiz('adt401-quiz-5', 'Quiz 5 — Onboarding & growth|||Quiz 5 — Onboarding & growth', [
  { id: 'q1', question: 'Mục tiêu chính của onboarding tốt là gì?', options: ['Trình chiếu hết mọi tính năng ngay đầu', 'Đưa người dùng tới chiến thắng đầu tiên (aha moment) nhanh nhất', 'Bắt đăng ký tài khoản trước khi làm bất cứ gì', 'Thu thập càng nhiều quyền càng tốt'], correctIndex: 1, explanation: 'Onboarding tốt rút ngắn đường tới aha moment; dạy theo ngữ cảnh và ưu tiên giá trị trước, đăng ký sau.' },
  { id: 'q2', question: 'Bốn giai đoạn của mô hình Hook (Nir Eyal) theo đúng thứ tự là?', options: ['Trigger → Action → Reward → Investment', 'Action → Trigger → Investment → Reward', 'Reward → Action → Trigger → Investment', 'Investment → Reward → Action → Trigger'], correctIndex: 0, explanation: 'Hook: Trigger (kích hoạt) → Action (hành động) → Reward (phần thưởng biến thiên) → Investment (đầu tư), rồi vòng lặp nạp lại trigger.' },
  { id: 'q3', question: 'Theo Định luật Jakob, nên cá nhân hoá cái gì và tránh cá nhân hoá cái gì?', options: ['Cá nhân hoá điều hướng, giữ nguyên nội dung', 'Cá nhân hoá nội dung, giữ điều hướng nhất quán', 'Cá nhân hoá cả hai càng nhiều càng tốt', 'Không cá nhân hoá gì cả'], correctIndex: 1, explanation: 'Người dùng mong điều hướng nhất quán (Jakob); nên cá nhân hoá nội dung chứ không xê dịch vị trí các điều khiển.' },
]);

const c6 = doc('adt401-6-1-accessibility', '6.1 — Advanced accessibility & inclusive design|||6.1 — Accessibility nâng cao & inclusive design',
  'WCAG 2.2 (POUR), tương phản màu (AA/AAA), touch target, hỗ trợ screen reader (labels, order, roles), dynamic type & reduce motion; inclusive design là mặc định chứ không phải thêm sau.',
  [[
    `<span class="eyebrow">ADT401 · Chapter 6 · Lesson 6.1</span>
<h2>Advanced accessibility &amp; inclusive design</h2>
<p>Accessibility is not a checklist bolted on at the end — it is a design constraint from the start. <strong>WCAG</strong> is organized around four principles (<strong>POUR</strong>):</p>
<pre><code>Perceivable   -> can users sense it? (contrast, text alternatives, captions)
Operable      -> can they use it? (touch targets, no motion-only, keyboard/switch)
Understandable-> is it clear &amp; predictable? (labels, error help, consistency)
Robust        -> works with assistive tech? (correct roles/names/states)
</code></pre>
<h3>The mobile essentials</h3>
<ul>
<li><strong>Color contrast</strong> — body text needs <strong>4.5:1</strong> (WCAG AA); large text 3:1. Never encode meaning by color alone (add icon/label) — for color-blind users.</li>
<li><strong>Touch targets</strong> — at least <strong>44×44pt (iOS)</strong> / <strong>48×48dp (Android)</strong>, with spacing so fingers don't mis-tap.</li>
<li><strong>Screen readers</strong> (VoiceOver/TalkBack) — every control has a clear <em>label</em>, a <em>role</em>, and a sensible reading <em>order</em>; images have alt text; decorative elements are hidden.</li>
<li><strong>Dynamic Type &amp; Reduce Motion</strong> — respect the OS setting: layouts reflow when text scales; heavy animation is cut when the user asks.</li>
</ul>
<div class="callout"><span class="badge">Curb-cut effect</span> Designing for the edge helps everyone: captions help in loud trains, big touch targets help tired thumbs, high contrast helps in sunlight.</div>`,
    `<span class="eyebrow">ADT401 · Chương 6 · Bài 6.1</span>
<h2>Accessibility nâng cao &amp; inclusive design</h2>
<p>Accessibility không phải danh mục kiểm gắn thêm ở cuối — nó là ràng buộc thiết kế từ đầu. <strong>WCAG</strong> tổ chức quanh bốn nguyên lý (<strong>POUR</strong>):</p>
<pre><code>Perceivable   -> cảm nhận được không? (tương phản, chữ thay thế, phụ đề)
Operable      -> dùng được không? (vùng chạm, không chỉ dựa motion, bàn phím/switch)
Understandable-> rõ &amp; đoán trước được? (nhãn, trợ giúp lỗi, nhất quán)
Robust        -> hợp trợ năng không? (role/name/state đúng)
</code></pre>
<h3>Những điểm cốt yếu trên mobile</h3>
<ul>
<li><strong>Tương phản màu</strong> — chữ thường cần <strong>4.5:1</strong> (WCAG AA); chữ lớn 3:1. Đừng mã hoá ý nghĩa chỉ bằng màu (thêm icon/nhãn) — vì người mù màu.</li>
<li><strong>Vùng chạm</strong> — tối thiểu <strong>44×44pt (iOS)</strong> / <strong>48×48dp (Android)</strong>, có khoảng cách để ngón không chạm nhầm.</li>
<li><strong>Screen reader</strong> (VoiceOver/TalkBack) — mỗi điều khiển có <em>nhãn</em> rõ, có <em>role</em>, và <em>thứ tự</em> đọc hợp lý; ảnh có alt; phần tử trang trí bị ẩn.</li>
<li><strong>Dynamic Type &amp; Reduce Motion</strong> — tôn trọng cài đặt của hệ điều hành: layout sắp lại khi chữ phóng to; cắt animation nặng khi người dùng yêu cầu.</li>
</ul>
<div class="callout"><span class="badge">Hiệu ứng lề đường (curb-cut)</span> Thiết kế cho trường hợp biên giúp tất cả: phụ đề giúp khi ở tàu ồn, vùng chạm to giúp ngón tay mỏi, tương phản cao giúp ngoài nắng.</div>`,
  ]]);

const c6q = quiz('adt401-quiz-6', 'Quiz 6 — Accessibility|||Quiz 6 — Accessibility', [
  { id: 'q1', question: 'Bốn nguyên lý POUR của WCAG là?', options: ['Perceivable, Operable, Understandable, Robust', 'Popular, Optimized, Unique, Responsive', 'Primary, Optional, Universal, Reliable', 'Perceivable, Ordered, Usable, Rapid'], correctIndex: 0, explanation: 'WCAG dựa trên POUR: Perceivable (cảm nhận được), Operable (dùng được), Understandable (hiểu được), Robust (bền với trợ năng).' },
  { id: 'q2', question: 'Tỉ lệ tương phản tối thiểu cho chữ thường theo WCAG AA là?', options: ['1:1', '2:1', '4.5:1', '10:1'], correctIndex: 2, explanation: 'WCAG AA yêu cầu tương phản 4.5:1 cho chữ thường (chữ lớn 3:1); và không mã hoá ý nghĩa chỉ bằng màu.' },
  { id: 'q3', question: 'Kích thước vùng chạm tối thiểu khuyến nghị trên iOS (Apple HIG) là?', options: ['24×24pt', '44×44pt', '80×80pt', 'Không có khuyến nghị'], correctIndex: 1, explanation: 'Apple HIG khuyến nghị vùng chạm tối thiểu 44×44pt (Android Material ~48×48dp) để ngón tay không chạm nhầm.' },
]);

const c7 = doc('adt401-7-1-design-ops-handoff', '7.1 — Design ops, handoff & design-to-code|||7.1 — Design ops, handoff & design-to-code',
  'Design ops (nguồn sự thật, versioning, quy ước đặt tên), bàn giao dev (spec, redlines, Dev Mode), design-to-code (token → biến CSS/theme), specs không mơ hồ; giảm ma sát giữa design và dev.',
  [[
    `<span class="eyebrow">ADT401 · Chapter 7 · Lesson 7.1</span>
<h2>Design ops, handoff &amp; design-to-code</h2>
<p><strong>Design ops</strong> is the discipline of running design like engineering: one source of truth, versioned libraries, clear naming, and a repeatable handoff. It is what lets a design system survive more than one designer.</p>
<h3>A clean handoff</h3>
<ul>
<li><strong>Dev Mode &amp; specs</strong> — engineers read spacing, color tokens, and measurements straight from the file; you annotate intent (behavior, edge cases, states) that pixels cannot show.</li>
<li><strong>Name things once</strong> — the token, the Figma variable, and the code variable should share a name (<code>color.action</code> → <code>--color-action</code>). Divergent names are where bugs breed.</li>
<li><strong>Spec the un-drawable</strong> — loading, empty, error, long text, offline, RTL. A handoff that only shows the happy path is half a handoff.</li>
</ul>
<h3>Design-to-code</h3>
<pre><code>Design tokens (JSON)   -> transform (Style Dictionary / Tokens Studio)
                       -> CSS variables / iOS &amp; Android theme files
                       -> components consume the tokens
Result: one change in the token file re-themes design AND code.
</code></pre>
<div class="callout"><span class="badge">Handoff is a conversation</span> The best spec still needs a walkthrough. Sit with the dev on the first build of a new pattern — a five-minute call prevents a week of pixel-off rework.</div>`,
    `<span class="eyebrow">ADT401 · Chương 7 · Bài 7.1</span>
<h2>Design ops, handoff &amp; design-to-code</h2>
<p><strong>Design ops</strong> là môn vận hành thiết kế như kỹ thuật: một nguồn sự thật, thư viện có versioning, đặt tên rõ, và một quy trình bàn giao lặp lại được. Đó là thứ giúp một design system sống sót qua hơn một nhà thiết kế.</p>
<h3>Một cuộc bàn giao gọn gàng</h3>
<ul>
<li><strong>Dev Mode &amp; spec</strong> — kỹ sư đọc khoảng cách, token màu, số đo thẳng từ file; bạn chú thích ý định (hành vi, ca biên, trạng thái) mà pixel không nói được.</li>
<li><strong>Đặt tên một lần</strong> — token, biến Figma và biến trong code nên chung tên (<code>color.action</code> → <code>--color-action</code>). Tên lệch nhau chính là nơi sinh bug.</li>
<li><strong>Đặc tả cái không vẽ được</strong> — loading, empty, error, chữ dài, offline, RTL. Bàn giao chỉ cho thấy đường "hạnh phúc" là bàn giao một nửa.</li>
</ul>
<h3>Design-to-code</h3>
<pre><code>Design token (JSON)    -> biến đổi (Style Dictionary / Tokens Studio)
                       -> biến CSS / file theme iOS &amp; Android
                       -> component tiêu thụ các token
Kết quả: một thay đổi trong file token đổi theme cả DESIGN LẪN CODE.
</code></pre>
<div class="callout"><span class="badge">Bàn giao là một cuộc trò chuyện</span> Spec tốt nhất vẫn cần đi cùng nhau một lượt. Ngồi với dev ở lần dựng đầu của một pattern mới — một cú gọi năm phút chặn được một tuần sửa lệch pixel.</div>`,
  ]]);

const c7q = quiz('adt401-quiz-7', 'Quiz 7 — Design ops & handoff|||Quiz 7 — Design ops & handoff', [
  { id: 'q1', question: 'Mục đích cốt lõi của design ops là gì?', options: ['Vẽ nhiều màn hình đẹp hơn', 'Vận hành thiết kế có hệ thống: một nguồn sự thật, versioning, đặt tên rõ, bàn giao lặp lại được', 'Thay thế hoàn toàn kỹ sư', 'Chỉ để xuất file PNG'], correctIndex: 1, explanation: 'Design ops giúp design system sống sót và mở rộng: một nguồn sự thật, thư viện có version, quy ước đặt tên, quy trình bàn giao chuẩn.' },
  { id: 'q2', question: 'Vì sao token, biến Figma và biến code nên dùng chung tên (vd color.action → --color-action)?', options: ['Để file nhẹ hơn', 'Để tên lệch nhau không sinh bug và một thay đổi lan cả design lẫn code', 'Vì Figma bắt buộc', 'Không quan trọng, đặt tên gì cũng được'], correctIndex: 1, explanation: 'Tên chung giữ design và code đồng bộ; tên lệch nhau chính là nơi sinh bug khi bàn giao design-to-code.' },
  { id: 'q3', question: 'Một bản handoff đầy đủ cần đặc tả thêm những gì ngoài màn hình "hạnh phúc"?', options: ['Chỉ cần màn hình đẹp nhất', 'Các trạng thái loading, empty, error, chữ dài, offline, RTL', 'Chỉ cần bảng màu', 'Chỉ cần font chữ'], correctIndex: 1, explanation: 'Handoff tốt đặc tả cả các ca biên không vẽ được sẵn: loading, empty, error, chữ dài, offline, RTL — nếu không sẽ đẩy quyết định sang dev.' },
]);

const c8 = doc('adt401-8-1-research-abtest-ai', '8.1 — Advanced research, A/B testing, metrics & AI-driven UX|||8.1 — Nghiên cứu nâng cao, A/B testing, metrics & AI-driven UX',
  'Kết hợp nghiên cứu định tính & định lượng, giả thuyết & A/B testing (control/variant, ý nghĩa thống kê), khung metric (HEART, Bắc Đẩu), và xu hướng AI-driven UX (cá nhân hoá, generative, thiết kế cho sự bất định).',
  [[
    `<span class="eyebrow">ADT401 · Chapter 8 · Lesson 8.1</span>
<h2>Advanced research, A/B testing, metrics &amp; AI-driven UX</h2>
<p>At this level design is <strong>evidence-based</strong>. You form hypotheses, ship experiments, and read metrics — instead of arguing opinions.</p>
<h3>Research: qualitative + quantitative</h3>
<p>They answer different questions. <strong>Qualitative</strong> (interviews, usability tests) tells you <em>why</em>; <strong>quantitative</strong> (analytics, surveys, A/B tests) tells you <em>how many / how much</em>. Strong decisions triangulate both.</p>
<h3>A/B testing</h3>
<pre><code>1. Hypothesis  -> "Bigger CTA -> more sign-ups"
2. Variants    -> A (control) vs B (change ONE thing)
3. Split       -> randomly assign users, run long enough
4. Measure     -> the ONE primary metric + guardrails
5. Decide      -> ship B only if the lift is statistically significant
</code></pre>
<h3>Metrics that mean something</h3>
<ul>
<li><strong>North Star</strong> — the one metric that captures real value delivered.</li>
<li><strong>HEART</strong> (Google) — Happiness, Engagement, Adoption, Retention, Task success.</li>
<li>Beware <strong>vanity metrics</strong> (raw downloads) — pair every metric with a guardrail so you don't win one number by wrecking another.</li>
</ul>
<h3>AI-driven UX (the frontier)</h3>
<p>AI shifts UX from static flows to <strong>adaptive, generative</strong> experiences: personalized content, natural-language input, and outputs that are probabilistic. That means designing for <strong>uncertainty</strong> — show confidence, make it correctable, keep a human in the loop, and be transparent that AI produced it.</p>
<div class="callout"><span class="badge">Design with humility</span> AI outputs can be wrong. Great AI UX makes errors cheap to catch and undo — never hides them behind a confident-looking answer.</div>`,
    `<span class="eyebrow">ADT401 · Chương 8 · Bài 8.1</span>
<h2>Nghiên cứu nâng cao, A/B testing, metrics &amp; AI-driven UX</h2>
<p>Ở mức này thiết kế <strong>dựa trên bằng chứng</strong>. Bạn đặt giả thuyết, tung thử nghiệm, đọc metric — thay vì cãi nhau bằng quan điểm.</p>
<h3>Nghiên cứu: định tính + định lượng</h3>
<p>Hai loại trả lời câu hỏi khác nhau. <strong>Định tính</strong> (phỏng vấn, usability test) cho biết <em>vì sao</em>; <strong>định lượng</strong> (analytics, khảo sát, A/B test) cho biết <em>bao nhiêu</em>. Quyết định tốt tam giác hoá cả hai.</p>
<h3>A/B testing</h3>
<pre><code>1. Giả thuyết  -> "CTA to hơn -> nhiều đăng ký hơn"
2. Biến thể    -> A (control) vs B (đổi ĐÚNG một thứ)
3. Chia nhóm   -> gán người dùng ngẫu nhiên, chạy đủ lâu
4. Đo          -> MỘT metric chính + các chỉ số bảo vệ (guardrail)
5. Quyết định  -> chỉ ship B nếu mức tăng có ý nghĩa thống kê
</code></pre>
<h3>Metric có ý nghĩa</h3>
<ul>
<li><strong>Bắc Đẩu (North Star)</strong> — một metric duy nhất nắm được giá trị thật đã trao.</li>
<li><strong>HEART</strong> (Google) — Happiness, Engagement, Adoption, Retention, Task success.</li>
<li>Cảnh giác <strong>vanity metric</strong> (lượt tải thô) — ghép mỗi metric với một guardrail để không thắng con số này mà phá con số kia.</li>
</ul>
<h3>AI-driven UX (biên giới mới)</h3>
<p>AI dời UX từ luồng tĩnh sang trải nghiệm <strong>thích ứng, sinh nội dung</strong>: nội dung cá nhân hoá, nhập bằng ngôn ngữ tự nhiên, và đầu ra mang tính xác suất. Nghĩa là phải thiết kế cho <strong>sự bất định</strong> — thể hiện độ tin cậy, cho phép sửa, giữ con người trong vòng lặp, và minh bạch rằng AI tạo ra nó.</p>
<div class="callout"><span class="badge">Thiết kế với sự khiêm tốn</span> Đầu ra của AI có thể sai. AI UX giỏi làm cho lỗi dễ phát hiện và hoàn tác — không giấu lỗi sau một câu trả lời trông tự tin.</div>`,
  ]]);

const c8q = quiz('adt401-quiz-8', 'Quiz 8 — Research, A/B testing & AI UX|||Quiz 8 — Nghiên cứu, A/B testing & AI UX', [
  { id: 'q1', question: 'Nghiên cứu định tính (phỏng vấn, usability test) chủ yếu trả lời câu hỏi nào?', options: ['Bao nhiêu / bao nhiêu phần trăm', 'VÌ SAO người dùng hành xử như vậy', 'Doanh thu tháng này', 'Số dòng code cần viết'], correctIndex: 1, explanation: 'Định tính cho biết VÌ SAO (động cơ, rào cản); định lượng (A/B, analytics) cho biết BAO NHIÊU. Quyết định tốt kết hợp cả hai.' },
  { id: 'q2', question: 'Nguyên tắc quan trọng khi thiết kế một thử nghiệm A/B là gì?', options: ['Đổi càng nhiều thứ cùng lúc càng tốt', 'Mỗi biến thể chỉ đổi MỘT thứ, đo một metric chính, và cần ý nghĩa thống kê', 'Chọn nhóm nào cũng được, không cần ngẫu nhiên', 'Ship ngay biến thể trông đẹp hơn'], correctIndex: 1, explanation: 'A/B test đổi đúng một biến giữa A và B, gán ngẫu nhiên, chạy đủ lâu, đo một metric chính + guardrail và chỉ ship khi mức tăng có ý nghĩa thống kê.' },
  { id: 'q3', question: 'Khi thiết kế trải nghiệm có AI (đầu ra mang tính xác suất), nguyên tắc cốt lõi là?', options: ['Giấu lỗi để trông tự tin', 'Thiết kế cho sự bất định: thể hiện độ tin cậy, cho sửa/hoàn tác, giữ con người trong vòng lặp', 'Luôn tin tuyệt đối đầu ra của AI', 'Không cho người dùng biết có AI'], correctIndex: 1, explanation: 'AI có thể sai; AI UX tốt thiết kế cho sự bất định — minh bạch, thể hiện độ tin cậy, làm lỗi dễ phát hiện và hoàn tác, giữ human-in-the-loop.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'ADT401',
    slug: 'adt401-mobility-applications-design-2',
    title: 'Mobility Applications Design 2',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ADT401.webp',
    shortDescription: 'Advanced mobile UX/UI (sequel to Design 1) — design tokens & theming, motion, advanced Figma, data dashboards, onboarding & growth, accessibility (WCAG), design ops & handoff, A/B testing & AI-driven UX. Bilingual + quizzes.|||UX/UI di động nâng cao (nối tiếp Design 1) — token & theming, motion, Figma nâng cao, dashboard dữ liệu, onboarding & growth, accessibility (WCAG), design ops & handoff, A/B testing & AI-driven UX. Song ngữ + quiz.',
    description: 'Môn <strong>ADT401 — Mobility Applications Design 2</strong> (kỳ 8, ngành Thiết kế mỹ thuật số) là phần <strong>nâng cao nối tiếp Design 1</strong>: chuyển từ "vẽ được màn hình" sang "vận hành một hệ thống thiết kế". Nội dung gồm <strong>design system &amp; token, theming (dark mode, đa nền tảng)</strong> → <strong>motion &amp; micro-interaction</strong> → <strong>prototyping Figma nâng cao</strong> (variables, auto-layout, variants) → <strong>UI nhiều dữ liệu &amp; dashboard</strong> → <strong>onboarding &amp; growth</strong> → <strong>accessibility (WCAG)</strong> → <strong>design ops &amp; handoff</strong> → <strong>A/B testing, metrics &amp; AI-driven UX</strong>. Bám Apple HIG &amp; Material Design (nâng cao), Refactoring UI, About Face, Laws of UX; song ngữ, mỗi chương có quiz.',
    whatYouLearn: 'Kiến trúc token 3 lớp &amp; theming (dark mode, iOS/Android); giải phẫu micro-interaction, easing/duration, motion có nghĩa; Figma auto-layout, component variants, variables &amp; Smart Animate; thiết kế dashboard nhiều dữ liệu &amp; các trạng thái (loading/empty/error); onboarding hướng aha, mô hình Hook, thiết kế có đạo đức; WCAG POUR, tương phản, touch target, screen reader; design ops, dev handoff &amp; design-to-code; nghiên cứu định tính/định lượng, A/B testing, HEART/North Star, AI-driven UX.',
    requirements: 'Đã học Mobility Applications Design 1 (ADH301) hoặc nắm nền UI/UX di động cơ bản (layout, điều hướng, component). Nên có Figma và tài khoản FPTU để xem giáo trình trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách nâng cao, Apple HIG & Material, tài liệu Figma, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ Design 1 lên Design 2: màn hình → hệ thống.', lessons: [intro] },
    { title: 'Chương 1 — Token & theming|||Chapter 1 — Tokens & theming', description: 'Token 3 lớp, dark mode, đa nền tảng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Motion & micro-interaction|||Chapter 2 — Motion & micro-interaction', description: 'Giải phẫu, easing, motion có nghĩa.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Figma nâng cao|||Chapter 3 — Advanced Figma', description: 'Auto-layout, variants, variables, Smart Animate.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dữ liệu & dashboard|||Chapter 4 — Data & dashboards', description: 'Phân cấp, đúng biểu đồ, trạng thái dữ liệu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Onboarding & growth|||Chapter 5 — Onboarding & growth', description: 'Aha moment, mô hình Hook, đạo đức.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Accessibility|||Chapter 6 — Accessibility', description: 'WCAG POUR, tương phản, touch target, screen reader.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Design ops & handoff|||Chapter 7 — Design ops & handoff', description: 'Nguồn sự thật, bàn giao dev, design-to-code.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Research, A/B testing & AI UX|||Chapter 8 — Research, A/B testing & AI UX', description: 'Định tính/định lượng, A/B, metrics, AI-driven UX.', lessons: [c8, c8q] },
  ],
};
