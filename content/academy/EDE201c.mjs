/**
 * EDE201c — UI/UX Design for E-Commerce. Giáo trình (trích dẫn, KHÔNG upload
 * PDF): "Don't Make Me Think" (Krug); "The Design of Everyday Things"
 * (Norman); Baymard Institute e-commerce UX research; "Refactoring UI"; tài
 * liệu Figma. 8 chương: nền tảng UI/UX & tâm lý mua online → nghiên cứu
 * người dùng & persona → information architecture & điều hướng → trang sản
 * phẩm & danh mục → giỏ hàng & checkout → wireframe/prototype Figma →
 * responsive & mobile commerce → CRO/A-B testing/accessibility. Song ngữ +
 * ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ede201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển (Krug, Norman), nghiên cứu Baymard Institute, Refactoring UI, tài liệu Figma, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EDE201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn UI/UX design for e-commerce &mdash; usability foundations, user research, information architecture, product/checkout UX, Figma prototyping, mobile commerce, and conversion optimization &mdash; in one place. These are the cited references for this course (no PDFs are uploaded; follow the links to the official/legal sources).</p>
<h3>📗 Foundational books</h3>
<ul>
<li><a href="https://sensible.com/dont-make-me-think/" target="_blank" rel="noopener"><em>Don't Make Me Think</em> &mdash; Steve Krug</a> &mdash; the classic short book on web usability: users don't read, they scan; every extra decision costs attention.</li>
<li><a href="https://jnd.org/books/" target="_blank" rel="noopener"><em>The Design of Everyday Things</em> &mdash; Don Norman</a> &mdash; affordances, signifiers, feedback, mental models &mdash; the vocabulary behind why some interfaces feel obvious and others don't.</li>
<li><a href="https://www.refactoringui.com/" target="_blank" rel="noopener"><em>Refactoring UI</em> &mdash; Wathan &amp; Schoger</a> &mdash; practical visual-design tactics (spacing, hierarchy, contrast) for turning a wireframe into a polished screen.</li>
</ul>
<h3>🌐 Research &amp; official documentation</h3>
<ul>
<li><a href="https://baymard.com/" target="_blank" rel="noopener">Baymard Institute</a> &mdash; large-sample e-commerce UX research (product pages, checkout, cart abandonment, filters) &mdash; the most-cited source in this course.</li>
<li><a href="https://help.figma.com/" target="_blank" rel="noopener">Figma Help Center</a> &mdash; official docs for frames, components, auto layout, and prototyping.</li>
<li><a href="https://www.nngroup.com/articles/" target="_blank" rel="noopener">Nielsen Norman Group articles</a> &mdash; free usability-heuristics research.</li>
<li><a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener">WCAG 2.2 Quick Reference (W3C)</a> &mdash; the accessibility standard referenced in Chapter 8.</li>
</ul>
<h3>▶️ YouTube &amp; talks</h3>
<ul>
<li><a href="https://www.youtube.com/@nngroup" target="_blank" rel="noopener">Nielsen Norman Group</a> &mdash; usability research explained on video.</li>
<li><a href="https://www.youtube.com/@Figma" target="_blank" rel="noopener">Figma (official channel)</a> &mdash; product tutorials, prototyping walkthroughs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> &mdash; wireframing, UI design and prototyping (free tier available).</li>
<li><a href="https://baymard.com/ux-benchmark" target="_blank" rel="noopener">Baymard UX Benchmark</a> &mdash; score real e-commerce sites against 650+ UX guidelines.</li>
<li><a href="https://www.figma.com/community" target="_blank" rel="noopener">Figma Community</a> &mdash; free wireframe kits and e-commerce UI templates to study.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> &mdash; UI vs UX, usability heuristics, affordances/signifiers, the online-buyer decision process.</li>
<li><strong>Practice</strong> &mdash; run a small usability test on a real store, then sketch a wireframe of one screen in Figma.</li>
<li><strong>Go deeper</strong> &mdash; study Baymard's product-page and checkout research; rebuild a checkout flow with fewer fields.</li>
<li><strong>Job-ready</strong> &mdash; build a clickable hi-fi prototype in Figma, test it on mobile widths, and measure one funnel with real or mock analytics.</li>
</ol></div>`,
    `<span class="eyebrow">EDE201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học thiết kế UI/UX cho thương mại điện tử &mdash; nền tảng khả dụng, nghiên cứu người dùng, information architecture, UX trang sản phẩm/thanh toán, prototype Figma, mobile commerce và tối ưu chuyển đổi &mdash; gom về một chỗ. Đây là các nguồn được trích dẫn trong môn (không upload PDF; theo link tới nguồn chính thức/hợp pháp).</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://sensible.com/dont-make-me-think/" target="_blank" rel="noopener"><em>Don't Make Me Think</em> &mdash; Steve Krug</a> &mdash; cuốn sách kinh điển ngắn về khả dụng web: người dùng không đọc, họ lướt qua; mỗi quyết định thêm đều tốn sự chú ý.</li>
<li><a href="https://jnd.org/books/" target="_blank" rel="noopener"><em>The Design of Everyday Things</em> &mdash; Don Norman</a> &mdash; affordance (khả năng dùng), signifier (dấu hiệu chỉ báo), feedback (phản hồi), mô hình tư duy &mdash; bộ từ vựng giải thích vì sao một giao diện thấy hiển nhiên còn giao diện khác thì không.</li>
<li><a href="https://www.refactoringui.com/" target="_blank" rel="noopener"><em>Refactoring UI</em> &mdash; Wathan &amp; Schoger</a> &mdash; chiến thuật thiết kế trực quan thực tế (khoảng cách, thứ bậc, độ tương phản) để biến wireframe thành màn hình hoàn chỉnh.</li>
</ul>
<h3>🌐 Nghiên cứu &amp; tài liệu chính thức</h3>
<ul>
<li><a href="https://baymard.com/" target="_blank" rel="noopener">Baymard Institute</a> &mdash; nghiên cứu UX thương mại điện tử mẫu lớn (trang sản phẩm, checkout, bỏ giỏ hàng, bộ lọc) &mdash; nguồn được trích dẫn nhiều nhất trong môn.</li>
<li><a href="https://help.figma.com/" target="_blank" rel="noopener">Trung tâm trợ giúp Figma</a> &mdash; tài liệu chính thức về frame, component, auto layout và prototyping.</li>
<li><a href="https://www.nngroup.com/articles/" target="_blank" rel="noopener">Bài viết Nielsen Norman Group</a> &mdash; nghiên cứu heuristics khả dụng miễn phí.</li>
<li><a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener">WCAG 2.2 Quick Reference (W3C)</a> &mdash; chuẩn khả năng tiếp cận được trích dẫn ở Chương 8.</li>
</ul>
<h3>▶️ YouTube &amp; talk</h3>
<ul>
<li><a href="https://www.youtube.com/@nngroup" target="_blank" rel="noopener">Nielsen Norman Group</a> &mdash; nghiên cứu khả dụng giảng qua video.</li>
<li><a href="https://www.youtube.com/@Figma" target="_blank" rel="noopener">Figma (kênh chính thức)</a> &mdash; hướng dẫn sản phẩm, quy trình prototyping.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> &mdash; wireframe, thiết kế UI và prototype (có bản miễn phí).</li>
<li><a href="https://baymard.com/ux-benchmark" target="_blank" rel="noopener">Baymard UX Benchmark</a> &mdash; chấm điểm website TMĐT thật theo 650+ chuẩn UX.</li>
<li><a href="https://www.figma.com/community" target="_blank" rel="noopener">Figma Community</a> &mdash; bộ wireframe kit và mẫu UI TMĐT miễn phí để tham khảo.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> &mdash; UI vs UX, heuristics khả dụng, affordance/signifier, quy trình quyết định của người mua online.</li>
<li><strong>Luyện tập</strong> &mdash; chạy một phép thử khả dụng nhỏ trên website thật, rồi vẽ wireframe một màn hình trong Figma.</li>
<li><strong>Đào sâu</strong> &mdash; đọc nghiên cứu Baymard về trang sản phẩm và checkout; dựng lại một luồng thanh toán với ít trường hơn.</li>
<li><strong>Sẵn sàng đi làm</strong> &mdash; dựng prototype hi-fi bấm được trong Figma, test ở khổ mobile, và đo một funnel bằng dữ liệu thật hoặc giả lập.</li>
</ol></div>`,
  ]]);

const intro = doc('ede201c-0-1-overview', 'Course overview: UI/UX Design for E-Commerce|||Tổng quan: Thiết kế UI/UX cho Thương mại điện tử',
  'UI/UX làm gì trong TMĐT; vì sao khả dụng quyết định doanh thu trực tiếp; lộ trình 8 chương từ nền tảng đến CRO.',
  [[
    `<span class="eyebrow">EDE201c · Lesson 0.1 · Overview</span>
<h2>UI/UX Design for E-Commerce</h2>
<p class="lead">In e-commerce, design is not decoration &mdash; it is <strong>revenue</strong>. Every confusing filter, every hidden shipping cost, every extra form field is a customer who closes the tab. This course teaches you to design storefronts people can actually use, from research to a clickable Figma prototype to measuring whether it worked.</p>
<h3>UI vs UX &mdash; two different jobs</h3>
<ul>
<li><strong>UI (User Interface)</strong> &mdash; what the customer sees and touches: buttons, colors, typography, layout.</li>
<li><strong>UX (User Experience)</strong> &mdash; the whole journey: can they find the product, understand the price, trust the checkout, and get their order?</li>
</ul>
<p>A store can have a beautiful UI and terrible UX (gorgeous product photos, but checkout demands account creation and eight form fields). This course covers both, in the order a real project needs them.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Usability foundations &amp; buyer psychology &rarr; user research &amp; personas &rarr; information architecture &amp; navigation &rarr; product &amp; category pages &rarr; cart &amp; checkout UX &rarr; wireframing &amp; Figma prototyping &rarr; responsive &amp; mobile commerce &rarr; conversion optimization, A/B testing &amp; accessibility. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">EDE201c · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế UI/UX cho Thương mại điện tử</h2>
<p class="lead">Trong TMĐT, thiết kế không phải trang trí &mdash; nó là <strong>doanh thu</strong>. Mỗi bộ lọc gây rối, mỗi phí ship ẩn, mỗi trường nhập thừa là một khách hàng đóng tab. Môn này dạy bạn thiết kế cửa hàng mà người dùng thật sự dùng được, từ nghiên cứu đến prototype bấm được trong Figma và đo xem nó có hiệu quả không.</p>
<h3>UI vs UX &mdash; hai việc khác nhau</h3>
<ul>
<li><strong>UI (giao diện người dùng)</strong> &mdash; cái khách nhìn thấy và chạm vào: nút, màu, chữ, bố cục.</li>
<li><strong>UX (trải nghiệm người dùng)</strong> &mdash; toàn bộ hành trình: họ có tìm được sản phẩm, hiểu giá, tin tưởng thanh toán, và nhận được đơn hàng không?</li>
</ul>
<p>Một cửa hàng có thể UI đẹp mà UX tồi (ảnh sản phẩm lộng lẫy, nhưng checkout bắt tạo tài khoản và điền tám trường). Môn này bao quát cả hai, theo đúng thứ tự một dự án thật cần.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Nền tảng khả dụng &amp; tâm lý người mua &rarr; nghiên cứu người dùng &amp; persona &rarr; information architecture &amp; điều hướng &rarr; trang sản phẩm &amp; danh mục &rarr; UX giỏ hàng &amp; thanh toán &rarr; wireframe &amp; prototype Figma &rarr; responsive &amp; mobile commerce &rarr; tối ưu chuyển đổi, A/B testing &amp; khả năng tiếp cận. Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('ede201c-1-1-foundations', '1.1 — UI/UX foundations & online buyer psychology|||1.1 — Nền tảng UI/UX & tâm lý người mua online',
  'UI vs UX; affordance/signifier/feedback (Norman); "Don\'t Make Me Think" (Krug); trust signals, cognitive load, decision fatigue của người mua online.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 1 · Lesson 1.1</span>
<h2>UI/UX foundations &amp; online buyer psychology</h2>
<h3>Norman: affordances, signifiers, feedback</h3>
<ul>
<li><strong>Affordance</strong> &mdash; what an object <em>lets you do</em> (a button is affords clicking; a slider affords dragging).</li>
<li><strong>Signifier</strong> &mdash; the visual clue that TELLS you the affordance exists (a shadow under a button signals "clickable"; underlined blue text signals "link").</li>
<li><strong>Feedback</strong> &mdash; the system confirming an action happened (a spinner after "Add to cart", a toast message, a cart-icon badge incrementing).</li>
<li><strong>Mapping &amp; mental model</strong> &mdash; controls should match users' existing expectations (a trash-can icon means delete; a cart icon means "my selected items").</li>
</ul>
<h3>Krug: "Don't make me think"</h3>
<p>Steve Krug's core rule: a web page should be <strong>self-evident</strong>. Users don't read pages, they <em>scan</em> them for the next click. Every unclear label, unlabeled icon, or ambiguous button costs mental effort &mdash; and on an e-commerce site, mental effort is the enemy of a completed purchase.</p>
<h3>Online buyer psychology</h3>
<ul>
<li><strong>Trust signals</strong> &mdash; reviews, security badges, clear return policy, real photos; online buyers can't touch the product, so they substitute proof.</li>
<li><strong>Cognitive load</strong> &mdash; the mental effort to process a screen; too many choices/fields raise it and drop conversion.</li>
<li><strong>Decision fatigue</strong> &mdash; too many options (50 nearly-identical filters, endless variants) exhausts the buyer before they decide to buy at all.</li>
<li><strong>Social proof &amp; scarcity</strong> &mdash; "1,204 reviews", "only 3 left" &mdash; powerful, but must be truthful; fake urgency destroys trust once noticed.</li>
</ul>
<pre><code>Usability heuristic checklist (apply to any screen):
[ ] Can a first-time visitor tell what this page is for in 5 seconds?
[ ] Is every clickable thing visibly clickable (signifier present)?
[ ] Does every action give feedback (loading, success, error)?
[ ] Is the primary action (e.g. "Add to cart") the most visually dominant element?
[ ] Could this screen have fewer choices/fields and still work?
</code></pre>
<div class="callout"><span class="badge">Why this matters in e-commerce</span> A confusing app can survive on habit. A confusing store loses the sale to a competitor one tab away &mdash; there is no loyalty cost to switching.</div>`,
    `<span class="eyebrow">EDE201c · Chương 1 · Bài 1.1</span>
<h2>Nền tảng UI/UX &amp; tâm lý người mua online</h2>
<h3>Norman: affordance, signifier, feedback</h3>
<ul>
<li><strong>Affordance (khả năng dùng)</strong> &mdash; thứ mà một vật <em>cho phép bạn làm</em> (nút cho phép bấm; thanh trượt cho phép kéo).</li>
<li><strong>Signifier (dấu hiệu chỉ báo)</strong> &mdash; gợi ý thị giác BÁO cho bạn biết affordance đó tồn tại (bóng đổ dưới nút báo "bấm được"; chữ xanh gạch chân báo "là link").</li>
<li><strong>Feedback (phản hồi)</strong> &mdash; hệ thống xác nhận hành động đã xảy ra (vòng xoay sau khi bấm "Thêm vào giỏ", thông báo toast, số trên icon giỏ hàng tăng lên).</li>
<li><strong>Mapping &amp; mô hình tư duy</strong> &mdash; điều khiển nên khớp với kỳ vọng sẵn có của người dùng (icon thùng rác nghĩa là xoá; icon giỏ hàng nghĩa là "món tôi đã chọn").</li>
</ul>
<h3>Krug: "Đừng bắt tôi phải nghĩ"</h3>
<p>Quy tắc gốc của Steve Krug: một trang web nên <strong>hiển nhiên</strong>. Người dùng không đọc trang, họ <em>lướt</em> để tìm cú bấm tiếp theo. Mỗi nhãn không rõ, icon không có chữ giải thích, hay nút mập mờ đều tốn công sức tư duy &mdash; và trên một trang TMĐT, công sức tư duy là kẻ thù của việc hoàn tất đơn hàng.</p>
<h3>Tâm lý người mua online</h3>
<ul>
<li><strong>Tín hiệu tin cậy</strong> &mdash; đánh giá, huy hiệu an toàn, chính sách đổi trả rõ ràng, ảnh thật; người mua online không sờ được sản phẩm nên họ dựa vào bằng chứng thay thế.</li>
<li><strong>Tải nhận thức (cognitive load)</strong> &mdash; công sức tư duy để xử lý một màn hình; quá nhiều lựa chọn/trường nhập làm tăng tải và giảm tỉ lệ chuyển đổi.</li>
<li><strong>Kiệt sức ra quyết định</strong> &mdash; quá nhiều lựa chọn (50 bộ lọc gần giống nhau, biến thể vô tận) khiến người mua mệt trước khi quyết định mua.</li>
<li><strong>Bằng chứng xã hội &amp; cảm giác khan hiếm</strong> &mdash; "1.204 đánh giá", "chỉ còn 3 sản phẩm" &mdash; mạnh, nhưng phải trung thực; cảm giác cấp bách giả mạo phá vỡ niềm tin khi bị phát hiện.</li>
</ul>
<pre><code>Checklist heuristics khả dụng (áp cho bất kỳ màn hình):
[ ] Khách lần đầu hiểu trang này để làm gì trong 5 giây không?
[ ] Mọi thứ bấm được có nhìn RÕ là bấm được không (có signifier)?
[ ] Mọi hành động có phản hồi không (đang tải, thành công, lỗi)?
[ ] Hành động chính (vd "Thêm vào giỏ") có nổi bật nhất trên màn hình?
[ ] Màn hình này có thể ít lựa chọn/trường hơn mà vẫn hoạt động không?
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng trong TMĐT</span> Một app gây rối vẫn sống được nhờ thói quen. Một cửa hàng gây rối mất đơn hàng cho đối thủ chỉ cách một tab &mdash; không có chi phí trung thành nào ngăn khách chuyển đi.</div>`,
  ]]);

const c1q = quiz('ede201c-quiz-1', 'Quiz 1 — UI/UX foundations|||Quiz 1 — Nền tảng UI/UX', [
  { id: 'q1', question: 'Theo Don Norman, "signifier" là gì?', options: ['Việc một vật cho phép làm gì', 'Gợi ý thị giác báo affordance tồn tại', 'Phản hồi sau khi bấm', 'Mô hình tư duy của người dùng'], correctIndex: 1, explanation: 'Signifier là dấu hiệu (vd bóng đổ, gạch chân) báo cho người dùng biết một affordance tồn tại — khác với affordance (khả năng làm) và feedback (phản hồi sau hành động).' },
  { id: 'q2', question: 'Quy tắc gốc trong "Don\'t Make Me Think" của Steve Krug là gì?', options: ['Trang web nên có nhiều lựa chọn để linh hoạt', 'Trang web nên hiển nhiên, không bắt người dùng phải suy nghĩ', 'Người dùng luôn đọc kỹ toàn bộ trang', 'Thiết kế đẹp quan trọng hơn khả dụng'], correctIndex: 1, explanation: 'Krug: người dùng lướt (scan) chứ không đọc; mỗi điều mập mờ tốn công sức tư duy — kẻ thù của việc hoàn tất mua hàng.' },
  { id: 'q3', question: '"Kiệt sức ra quyết định" (decision fatigue) trong TMĐT xảy ra khi nào?', options: ['Khi trang tải chậm', 'Khi có quá nhiều lựa chọn/biến thể khiến người mua mệt trước khi quyết định', 'Khi giá sản phẩm quá cao', 'Khi ảnh sản phẩm chất lượng thấp'], correctIndex: 1, explanation: 'Quá nhiều lựa chọn gần giống nhau (bộ lọc, biến thể) làm tăng tải nhận thức và khiến người mua kiệt sức, dễ rời trang mà không mua.' },
]);

const c2 = doc('ede201c-2-1-user-research-persona', '2.1 — User research & e-commerce personas|||2.1 — Nghiên cứu người dùng & persona TMĐT',
  'Phương pháp nghiên cứu định tính/định lượng, usability testing; nghiên cứu quy mô lớn của Baymard Institute; persona, customer journey map, Jobs-to-be-Done.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 2 · Lesson 2.1</span>
<h2>User research &amp; e-commerce personas</h2>
<h3>Qualitative vs quantitative research</h3>
<ul>
<li><strong>Qualitative</strong> (the "why") &mdash; user interviews, moderated usability testing (watch 5&ndash;8 people try to complete a purchase, note where they hesitate or fail).</li>
<li><strong>Quantitative</strong> (the "how many") &mdash; analytics (funnel drop-off, heatmaps), surveys, A/B test results at scale.</li>
</ul>
<p>Good decisions use both: quantitative data tells you <em>where</em> the problem is (e.g. 40% drop at shipping step); qualitative research tells you <em>why</em> (users don't trust the shipping fee is final).</p>
<h3>Baymard Institute &mdash; e-commerce UX at scale</h3>
<p><strong>Baymard Institute</strong> runs large-sample usability studies specifically on e-commerce sites (product pages, checkout, mobile, search) and publishes evidence-based guidelines used industry-wide. Citing Baymard research ("checkout abandonment is commonly caused by X") is stronger than opinion &mdash; it's this course's most-used reference.</p>
<h3>Personas &amp; Jobs-to-be-Done</h3>
<p>A <strong>persona</strong> for an e-commerce store should capture <em>shopping behavior</em>, not just demographics: device used, price sensitivity, how they decide (reviews-driven? brand-loyal? deal-hunter?), and their biggest friction point.</p>
<p><strong>Jobs-to-be-Done (JTBD)</strong> reframes the persona around a goal: not "Lan, 28, marketing exec" but "someone who needs a gift that arrives before Saturday and looks good unwrapped." Designing for the job, not the demographic, avoids designing for a stereotype.</p>
<h3>Customer journey map</h3>
<pre><code>Awareness -> Consideration -> Purchase -> Post-purchase / Retention
  (ad/search)  (compare, read     (cart,       (order tracking,
               reviews, PDP)      checkout)     support, re-order)
</code></pre>
<p>Map pain points and emotions at each stage &mdash; UX work almost always targets the stage with the sharpest drop in the funnel.</p>
<div class="callout"><span class="badge">Rule of thumb</span> 5&ndash;8 usability-test sessions on one flow usually surface most major problems &mdash; you rarely need dozens of participants to find the big issues.</div>`,
    `<span class="eyebrow">EDE201c · Chương 2 · Bài 2.1</span>
<h2>Nghiên cứu người dùng &amp; persona TMĐT</h2>
<h3>Nghiên cứu định tính vs định lượng</h3>
<ul>
<li><strong>Định tính</strong> (trả lời "vì sao") &mdash; phỏng vấn người dùng, usability testing có điều phối (quan sát 5&ndash;8 người thử hoàn tất một đơn hàng, ghi lại chỗ họ khựng lại hoặc thất bại).</li>
<li><strong>Định lượng</strong> (trả lời "bao nhiêu") &mdash; số liệu phân tích (drop-off theo funnel, heatmap), khảo sát, kết quả A/B test trên quy mô lớn.</li>
</ul>
<p>Quyết định tốt dùng cả hai: dữ liệu định lượng cho biết vấn đề nằm ở <em>đâu</em> (vd 40% rời bỏ ở bước phí ship); nghiên cứu định tính cho biết <em>vì sao</em> (người dùng không tin phí ship hiện đã là số cuối cùng).</p>
<h3>Baymard Institute &mdash; UX TMĐT quy mô lớn</h3>
<p><strong>Baymard Institute</strong> chạy các nghiên cứu khả dụng mẫu lớn chuyên về website TMĐT (trang sản phẩm, checkout, mobile, tìm kiếm) và công bố các khuyến nghị dựa trên bằng chứng, được dùng rộng khắp ngành. Trích dẫn nghiên cứu Baymard ("bỏ giỏ hàng thường do X") vững hơn ý kiến cá nhân &mdash; đây là nguồn được dùng nhiều nhất trong môn này.</p>
<h3>Persona &amp; Jobs-to-be-Done</h3>
<p>Một <strong>persona</strong> cho cửa hàng TMĐT nên nắm bắt <em>hành vi mua sắm</em>, không chỉ nhân khẩu học: thiết bị dùng, độ nhạy giá, cách họ quyết định (theo đánh giá? trung thành thương hiệu? săn khuyến mãi?), và điểm khó chịu lớn nhất.</p>
<p><strong>Jobs-to-be-Done (JTBD)</strong> tái định hình persona quanh một mục tiêu: không phải "Lan, 28 tuổi, quản lý marketing" mà là "người cần một món quà đến trước thứ Bảy và đẹp khi mở ra." Thiết kế cho mục tiêu, không phải nhân khẩu học, tránh việc thiết kế theo định kiến rập khuôn.</p>
<h3>Bản đồ hành trình khách hàng</h3>
<pre><code>Nhận biết -> Xem xét -> Mua hàng -> Sau mua / Giữ chân
 (quảng cáo/  (so sánh,   (giỏ hàng,   (theo dõi đơn,
  tìm kiếm)   đọc review,  thanh toán)  hỗ trợ, mua lại)
              trang SP)
</code></pre>
<p>Ghi lại điểm khó chịu và cảm xúc ở mỗi giai đoạn &mdash; công việc UX hầu như luôn nhằm vào giai đoạn có mức rời bỏ trong funnel cao nhất.</p>
<div class="callout"><span class="badge">Quy tắc thực dụng</span> 5&ndash;8 phiên usability-test trên một luồng thường đủ để lộ ra hầu hết vấn đề lớn &mdash; hiếm khi cần hàng chục người tham gia để tìm ra vấn đề chính.</div>`,
  ]]);

const c2q = quiz('ede201c-quiz-2', 'Quiz 2 — User research & persona|||Quiz 2 — Nghiên cứu & persona', [
  { id: 'q1', question: 'Nghiên cứu định lượng (quantitative) trong UX trả lời câu hỏi gì?', options: ['Vì sao người dùng hành xử như vậy', 'Bao nhiêu / ở đâu vấn đề xảy ra (funnel, heatmap, số liệu)', 'Cảm xúc của người dùng', 'Tên gọi của persona'], correctIndex: 1, explanation: 'Định lượng cho biết QUY MÔ và VỊ TRÍ vấn đề (vd % rời bỏ ở một bước); định tính (phỏng vấn, usability test) giải thích VÌ SAO.' },
  { id: 'q2', question: 'Baymard Institute nổi tiếng với loại nghiên cứu nào?', options: ['Thiết kế logo thương hiệu', 'Nghiên cứu khả dụng mẫu lớn chuyên về UX thương mại điện tử', 'Đào tạo lập trình viên', 'Nghiên cứu thị trường tài chính'], correctIndex: 1, explanation: 'Baymard chạy usability study mẫu lớn trên các trang TMĐT (checkout, trang sản phẩm, mobile, tìm kiếm) và công bố khuyến nghị dựa trên bằng chứng.' },
  { id: 'q3', question: 'Jobs-to-be-Done (JTBD) khác persona nhân khẩu học ở điểm nào?', options: ['JTBD tập trung vào tuổi và giới tính', 'JTBD tập trung vào MỤC TIÊU/nhu cầu cụ thể của người dùng, không phải đặc điểm nhân khẩu', 'JTBD chỉ dùng cho B2B', 'JTBD thay thế hoàn toàn customer journey map'], correctIndex: 1, explanation: 'JTBD đặt câu hỏi "người dùng đang cố hoàn thành việc gì" (vd tìm quà đến kịp thứ Bảy) thay vì mô tả họ là ai theo nhân khẩu học.' },
]);

const c3 = doc('ede201c-3-1-ia-navigation', '3.1 — Information architecture & store navigation|||3.1 — Information architecture & điều hướng cửa hàng',
  'IA & phân loại danh mục, card sorting; mega menu, faceted search/bộ lọc, breadcrumb, tìm kiếm gợi ý; nghiên cứu Baymard về bộ lọc.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 3 · Lesson 3.1</span>
<h2>Information architecture &amp; store navigation</h2>
<h3>What is information architecture (IA)?</h3>
<p><strong>IA</strong> is how content and products are organized and labeled so people can find things &mdash; the invisible skeleton behind menus, categories, and search. Bad IA means the product exists but nobody can find it, which is functionally the same as it not existing.</p>
<h3>Building the category taxonomy</h3>
<ul>
<li><strong>Card sorting</strong> &mdash; give users cards with product/category names and ask them to group them their own way; reveals how customers (not merchandisers) mentally organize the catalog.</li>
<li>Categories should match how people <em>search</em>, not how the warehouse is organized internally.</li>
</ul>
<h3>Navigation patterns</h3>
<ul>
<li><strong>Mega menu</strong> &mdash; exposes the full category tree on hover/tap; good for large catalogs, but must group logically (not just list everything).</li>
<li><strong>Faceted search / filters</strong> &mdash; narrow a category by attributes (size, color, price, brand). Baymard's filter research: show result counts per option, let users select multiple values per facet, and keep filters visible while scrolling.</li>
<li><strong>Breadcrumbs</strong> &mdash; show the path (Home &gt; Category &gt; Subcategory) so users always know where they are and can jump back up a level.</li>
<li><strong>Site search with autocomplete</strong> &mdash; suggest products/categories as the user types; forgive typos; for many stores, search-driven visitors convert far higher than browse-driven visitors.</li>
</ul>
<pre><code>Example category tree (fashion store):
Home
 |- Women
 |   |- Dresses
 |   |- Shoes -> [filters: size, color, heel height, price]
 |- Men
 |   |- Shirts
 |   |- Shoes
 |- Sale
Breadcrumb on a PLP: Home > Women > Shoes > Sneakers
</code></pre>
<div class="callout"><span class="badge">Baymard finding</span> Users abandon filtering when result counts aren't shown before they click &mdash; they won't risk a filter combination that might return zero results.</div>`,
    `<span class="eyebrow">EDE201c · Chương 3 · Bài 3.1</span>
<h2>Information architecture &amp; điều hướng cửa hàng</h2>
<h3>Information architecture (IA) là gì?</h3>
<p><strong>IA</strong> là cách nội dung và sản phẩm được tổ chức và gắn nhãn để người dùng tìm được thứ họ cần &mdash; bộ khung vô hình đằng sau menu, danh mục và tìm kiếm. IA kém nghĩa là sản phẩm có thật nhưng không ai tìm được, về mặt chức năng cũng như không tồn tại.</p>
<h3>Dựng cây phân loại danh mục</h3>
<ul>
<li><strong>Card sorting</strong> &mdash; đưa người dùng các thẻ ghi tên sản phẩm/danh mục và để họ tự nhóm theo cách của mình; hé lộ cách khách hàng (không phải người bán) tổ chức catalog trong đầu.</li>
<li>Danh mục nên khớp với cách người dùng <em>tìm kiếm</em>, không phải cách kho hàng tổ chức nội bộ.</li>
</ul>
<h3>Mẫu điều hướng</h3>
<ul>
<li><strong>Mega menu</strong> &mdash; hiện toàn bộ cây danh mục khi hover/tap; tốt cho catalog lớn, nhưng phải nhóm hợp lý (không chỉ liệt kê hết).</li>
<li><strong>Faceted search / bộ lọc</strong> &mdash; thu hẹp danh mục theo thuộc tính (size, màu, giá, thương hiệu). Nghiên cứu bộ lọc của Baymard: hiện số kết quả cho mỗi tuỳ chọn, cho chọn nhiều giá trị mỗi facet, và giữ bộ lọc hiện khi cuộn.</li>
<li><strong>Breadcrumb</strong> &mdash; hiện đường dẫn (Trang chủ &gt; Danh mục &gt; Danh mục con) để người dùng luôn biết đang ở đâu và nhảy lên cấp trên.</li>
<li><strong>Tìm kiếm có gợi ý (autocomplete)</strong> &mdash; gợi ý sản phẩm/danh mục khi đang gõ; tha lỗi gõ sai; với nhiều cửa hàng, khách vào từ tìm kiếm chuyển đổi cao hơn nhiều so với khách lướt danh mục.</li>
</ul>
<pre><code>Ví dụ cây danh mục (cửa hàng thời trang):
Trang chủ
 |- Nữ
 |   |- Váy đầm
 |   |- Giày -> [lọc: size, màu, chiều cao gót, giá]
 |- Nam
 |   |- Áo sơ mi
 |   |- Giày
 |- Sale
Breadcrumb trên trang danh mục: Trang chủ > Nữ > Giày > Sneaker
</code></pre>
<div class="callout"><span class="badge">Phát hiện của Baymard</span> Người dùng bỏ lọc khi không thấy số kết quả trước khi bấm &mdash; họ không muốn rủi ro chọn tổ hợp bộ lọc có thể trả về 0 kết quả.</div>`,
  ]]);

const c3q = quiz('ede201c-quiz-3', 'Quiz 3 — Information architecture & navigation|||Quiz 3 — IA & điều hướng', [
  { id: 'q1', question: 'Card sorting trong xây dựng danh mục dùng để làm gì?', options: ['Đo tốc độ tải trang', 'Hé lộ cách người dùng tự nhóm sản phẩm/danh mục trong đầu', 'Kiểm tra bảo mật giao dịch', 'Thay thế hoàn toàn bộ lọc'], correctIndex: 1, explanation: 'Card sorting để người dùng tự nhóm thẻ tên sản phẩm/danh mục theo cách hiểu của họ, giúp danh mục khớp với tư duy khách hàng thay vì cách kho hàng tổ chức nội bộ.' },
  { id: 'q2', question: 'Breadcrumb (Trang chủ > Danh mục > Danh mục con) có công dụng chính là gì?', options: ['Tăng tốc độ tải ảnh', 'Cho người dùng biết đang ở đâu và nhảy lên cấp trên dễ dàng', 'Hiển thị số lượng hàng trong kho', 'Thay cho ô tìm kiếm'], correctIndex: 1, explanation: 'Breadcrumb hiện đường dẫn vị trí hiện tại trong cây danh mục, giúp người dùng định hướng và quay lại cấp trên nhanh.' },
  { id: 'q3', question: 'Theo nghiên cứu Baymard, vì sao người dùng bỏ lọc (filter) giữa chừng?', options: ['Vì bộ lọc có màu sắc không đẹp', 'Vì không thấy số kết quả trước khi bấm, sợ chọn ra 0 kết quả', 'Vì bộ lọc load quá nhanh', 'Vì bộ lọc nằm ở đầu trang'], correctIndex: 1, explanation: 'Baymard: không hiện số kết quả cho mỗi tuỳ chọn lọc khiến người dùng ngại bấm vì sợ tổ hợp lọc trả về rỗng.' },
]);

const c4 = doc('ede201c-4-1-product-category-pages', '4.1 — Product detail & category page design|||4.1 — Thiết kế trang sản phẩm & danh mục',
  'PLP (grid, sắp xếp, phân trang/infinite scroll); PDP (ảnh, biến thể, giá, đánh giá, CTA, sản phẩm liên quan); các yếu tố PDP thiết yếu theo Baymard.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 4 · Lesson 4.1</span>
<h2>Product detail &amp; category page design</h2>
<h3>Product Listing Page (PLP / category page)</h3>
<ul>
<li><strong>Grid layout</strong> &mdash; image-first cards; show price, name, and (if available) rating at a glance &mdash; don't force a click just to see the price.</li>
<li><strong>Sort</strong> &mdash; relevance (default), price low&ndash;high/high&ndash;low, newest, best-selling.</li>
<li><strong>Pagination vs infinite scroll</strong> &mdash; pagination lets users return to a spot and shows scope ("page 3 of 12"); infinite scroll feels seamless but can bury the footer and make "going back" hard. Baymard leans toward pagination or a "load more" click for this reason.</li>
</ul>
<h3>Product Detail Page (PDP) &mdash; the essentials</h3>
<p>Baymard's PDP research consistently finds these elements decide whether a visitor buys:</p>
<ul>
<li><strong>Images</strong> &mdash; multiple angles, zoom, and (for apparel) a photo on a model; one photo is not enough for a considered purchase.</li>
<li><strong>Price &amp; availability</strong> &mdash; unambiguous, with any discount clearly shown against the original price; stock status ("only 2 left", "ships in 3 days") reduces uncertainty.</li>
<li><strong>Variants</strong> (size/color) &mdash; shown as visible swatches/buttons, not a buried dropdown; disable/gray out unavailable combinations rather than hiding them.</li>
<li><strong>Reviews &amp; ratings</strong> &mdash; the single strongest trust signal on a PDP; show the count, not just the average.</li>
<li><strong>The "Add to cart" CTA</strong> &mdash; must be the most visually dominant element on the page, above the fold, and stay reachable while scrolling (sticky) on long pages.</li>
<li><strong>Related / complementary products</strong> &mdash; "customers also bought" &mdash; recovers visitors who decide this exact item isn't right.</li>
</ul>
<pre><code>PDP essentials checklist:
[ ] 4+ product images incl. zoom, shown before scrolling
[ ] Price + any discount unambiguous; stock status visible
[ ] Variant selection visible (swatches), unavailable combos disabled not hidden
[ ] Review count + average rating near the top
[ ] "Add to cart" is the most dominant element, stays reachable
[ ] Related products shown below
</code></pre>
<div class="callout"><span class="badge">Baymard finding</span> Sites that hide variant options inside a generic dropdown ("Select an option") see more back-and-forth and abandonment than sites showing swatches directly.</div>`,
    `<span class="eyebrow">EDE201c · Chương 4 · Bài 4.1</span>
<h2>Thiết kế trang sản phẩm &amp; danh mục</h2>
<h3>Trang danh mục (PLP)</h3>
<ul>
<li><strong>Bố cục lưới (grid)</strong> &mdash; thẻ ưu tiên ảnh; hiện giá, tên, và (nếu có) đánh giá ngay trên thẻ &mdash; không bắt bấm vào mới thấy giá.</li>
<li><strong>Sắp xếp</strong> &mdash; liên quan nhất (mặc định), giá thấp&ndash;cao/cao&ndash;thấp, mới nhất, bán chạy nhất.</li>
<li><strong>Phân trang vs infinite scroll</strong> &mdash; phân trang cho phép quay lại đúng vị trí và cho biết quy mô ("trang 3/12"); infinite scroll trơn hơn nhưng có thể chôn footer và làm "quay lại" khó. Baymard nghiêng về phân trang hoặc nút "xem thêm" vì lý do này.</li>
</ul>
<h3>Trang sản phẩm (PDP) &mdash; các yếu tố thiết yếu</h3>
<p>Nghiên cứu PDP của Baymard liên tục cho thấy các yếu tố sau quyết định khách có mua hay không:</p>
<ul>
<li><strong>Ảnh sản phẩm</strong> &mdash; nhiều góc, zoom được, và (với thời trang) ảnh mặc trên người mẫu; một ảnh không đủ cho một quyết định mua có cân nhắc.</li>
<li><strong>Giá &amp; tình trạng hàng</strong> &mdash; rõ ràng không mập mờ, giảm giá thể hiện rõ so với giá gốc; tình trạng kho ("chỉ còn 2", "giao trong 3 ngày") giảm sự bất định.</li>
<li><strong>Biến thể</strong> (size/màu) &mdash; hiện dưới dạng nút/mẫu màu nhìn thấy được, không chôn trong dropdown; tổ hợp không có hàng thì làm mờ/khoá, không ẩn hẳn.</li>
<li><strong>Đánh giá &amp; xếp hạng</strong> &mdash; tín hiệu tin cậy mạnh nhất trên PDP; hiện cả số lượng đánh giá, không chỉ điểm trung bình.</li>
<li><strong>Nút "Thêm vào giỏ"</strong> &mdash; phải là thành phần nổi bật nhất trên trang, nằm trên phần cuộn đầu tiên, và giữ được (sticky) khi cuộn trên trang dài.</li>
<li><strong>Sản phẩm liên quan/bổ trợ</strong> &mdash; "khách hàng cũng mua" &mdash; cứu lại khách vừa quyết định sản phẩm này không phù hợp.</li>
</ul>
<pre><code>Checklist PDP thiết yếu:
[ ] 4+ ảnh sản phẩm kèm zoom, hiện trước khi cuộn
[ ] Giá + giảm giá (nếu có) rõ ràng; tình trạng kho hiển thị
[ ] Chọn biến thể hiển thị (mẫu màu), tổ hợp hết hàng khoá không ẩn
[ ] Số lượng đánh giá + điểm trung bình gần đầu trang
[ ] "Thêm vào giỏ" nổi bật nhất, giữ được khi cuộn
[ ] Sản phẩm liên quan hiện phía dưới
</code></pre>
<div class="callout"><span class="badge">Phát hiện của Baymard</span> Website chôn lựa chọn biến thể trong dropdown chung ("Chọn một tuỳ chọn") gặp nhiều lần qua lại và bỏ giữa chừng hơn website hiện mẫu màu trực tiếp.</div>`,
  ]]);

const c4q = quiz('ede201c-quiz-4', 'Quiz 4 — Product & category pages|||Quiz 4 — Trang sản phẩm & danh mục', [
  { id: 'q1', question: 'Vì sao Baymard nghiêng về phân trang (pagination) hơn infinite scroll cho trang danh mục?', options: ['Phân trang tải nhanh hơn tuyệt đối', 'Infinite scroll có thể chôn footer và làm việc quay lại vị trí khó khăn', 'Infinite scroll không hỗ trợ ảnh', 'Phân trang bắt buộc theo luật'], correctIndex: 1, explanation: 'Phân trang cho biết quy mô kết quả và cho phép quay lại đúng vị trí; infinite scroll trơn hơn nhưng gây khó khi cần quay lại hoặc chôn footer.' },
  { id: 'q2', question: 'Theo nghiên cứu PDP của Baymard, cách hiển thị biến thể (size/màu) tốt nhất là?', options: ['Chôn trong dropdown "Chọn một tuỳ chọn"', 'Hiện dưới dạng nút/mẫu màu nhìn thấy được, khoá (không ẩn) tổ hợp hết hàng', 'Không hiển thị biến thể nào, chỉ ghi trong mô tả', 'Chỉ hiển thị biến thể qua chatbot'], correctIndex: 1, explanation: 'Baymard: hiện biến thể trực tiếp dưới dạng swatch/nút và làm mờ (không ẩn) tổ hợp hết hàng giảm bỏ giữa chừng so với chôn trong dropdown.' },
  { id: 'q3', question: 'Trên PDP, yếu tố nào được xem là tín hiệu tin cậy mạnh nhất?', options: ['Số lượng ảnh sản phẩm', 'Đánh giá & xếp hạng (kèm số lượng đánh giá)', 'Màu nền trang', 'Tốc độ load trang'], correctIndex: 1, explanation: 'Đánh giá và xếp hạng, đặc biệt kèm số lượng đánh giá (không chỉ điểm trung bình), là tín hiệu tin cậy mạnh nhất giúp người mua online quyết định.' },
]);

const c5 = doc('ede201c-5-1-cart-checkout', '5.1 — Cart & checkout UX|||5.1 — Giỏ hàng & quy trình thanh toán',
  'Thiết kế giỏ hàng; nguyên nhân bỏ giỏ hàng (Baymard); checkout khách vãng lai, chỉ báo tiến trình, xác thực form, đa phương thức thanh toán.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 5 · Lesson 5.1</span>
<h2>Cart &amp; checkout UX</h2>
<h3>Designing the cart</h3>
<ul>
<li>Let users edit quantity, remove items, and "save for later" without leaving the cart.</li>
<li>Show shipping cost estimate (or a clear message that it's calculated at checkout) &mdash; surprise costs are the #1 abandonment cause (below).</li>
<li>Show a running subtotal and, if relevant, progress toward free shipping ("Add $12 more for free shipping").</li>
</ul>
<h3>Why carts get abandoned (Baymard's categories)</h3>
<ol>
<li><strong>Extra costs too high / shown too late</strong> (shipping, tax, fees appearing only at the final step) &mdash; the single most-cited reason.</li>
<li><strong>Forced account creation</strong> &mdash; always offer guest checkout.</li>
<li><strong>Checkout process too long or complicated</strong> &mdash; too many steps or fields.</li>
<li><strong>Can't see/calculate total cost up front.</strong></li>
<li><strong>Security concerns</strong> about entering card details.</li>
<li><strong>Not enough payment methods.</strong></li>
</ol>
<h3>Checkout best practices</h3>
<ul>
<li><strong>Guest checkout</strong> as the default path; account creation offered <em>after</em> the order completes, not before.</li>
<li><strong>Progress indicator</strong> (e.g. "Shipping &rarr; Payment &rarr; Review") on multi-step checkout, so users know how much is left.</li>
<li><strong>Address autofill / validation</strong> &mdash; postal-code lookup, inline validation as they type (not only on submit).</li>
<li><strong>Clear, specific error messages</strong> &mdash; next to the field, in plain language ("Card number looks incomplete"), never a generic "Error" banner at the top.</li>
<li><strong>Multiple payment methods &amp; visible trust badges</strong> near the payment form (SSL, accepted card logos) to address the security-concern category above.</li>
</ul>
<pre><code>Checkout flow (short, trust-preserving):
Cart -> [Guest or Login] -> Shipping address (autofill)
     -> Shipping method (cost shown) -> Payment (methods + trust badges)
     -> Review (all costs itemized) -> Confirm -> Order confirmation + tracking
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Show the full cost breakdown (item + shipping + tax) as early as the cart page, not only at the final review step &mdash; late surprises are the top abandonment cause.</div>`,
    `<span class="eyebrow">EDE201c · Chương 5 · Bài 5.1</span>
<h2>Giỏ hàng &amp; quy trình thanh toán</h2>
<h3>Thiết kế giỏ hàng</h3>
<ul>
<li>Cho phép sửa số lượng, xoá sản phẩm, và "lưu để sau" mà không cần rời khỏi giỏ hàng.</li>
<li>Hiện ước tính phí ship (hoặc thông báo rõ là tính ở bước thanh toán) &mdash; chi phí bất ngờ là nguyên nhân bỏ giỏ hàng số 1 (xem dưới).</li>
<li>Hiện tổng tạm tính và, nếu có, tiến trình tới miễn phí ship ("Mua thêm 300k để được miễn phí ship").</li>
</ul>
<h3>Vì sao khách bỏ giỏ hàng (theo phân loại của Baymard)</h3>
<ol>
<li><strong>Chi phí phụ quá cao / hiện quá muộn</strong> (phí ship, thuế, phụ phí chỉ xuất hiện ở bước cuối) &mdash; nguyên nhân được nhắc nhiều nhất.</li>
<li><strong>Bắt buộc tạo tài khoản</strong> &mdash; luôn cho phép checkout khách vãng lai (guest checkout).</li>
<li><strong>Quy trình thanh toán quá dài hoặc phức tạp</strong> &mdash; quá nhiều bước hoặc trường nhập.</li>
<li><strong>Không thấy/tính được tổng chi phí từ đầu.</strong></li>
<li><strong>Lo ngại an toàn</strong> khi nhập thông tin thẻ.</li>
<li><strong>Không đủ phương thức thanh toán.</strong></li>
</ol>
<h3>Thực hành tốt cho checkout</h3>
<ul>
<li><strong>Checkout khách vãng lai</strong> là đường mặc định; mời tạo tài khoản <em>sau</em> khi đơn hàng hoàn tất, không phải trước.</li>
<li><strong>Chỉ báo tiến trình</strong> (vd "Giao hàng &rarr; Thanh toán &rarr; Xác nhận") trên checkout nhiều bước, để người dùng biết còn bao nhiêu.</li>
<li><strong>Tự điền/xác thực địa chỉ</strong> &mdash; tra mã bưu chính, xác thực ngay khi đang gõ (không chỉ khi bấm gửi).</li>
<li><strong>Thông báo lỗi rõ ràng, cụ thể</strong> &mdash; ngay bên cạnh trường lỗi, bằng ngôn ngữ đơn giản ("Số thẻ có vẻ chưa đủ số"), không bao giờ chỉ một banner "Lỗi" chung ở đầu trang.</li>
<li><strong>Đa phương thức thanh toán &amp; huy hiệu tin cậy hiển thị</strong> gần form thanh toán (SSL, logo thẻ được nhận) để giải quyết nhóm lo ngại an toàn ở trên.</li>
</ul>
<pre><code>Luồng checkout (ngắn, giữ niềm tin):
Giỏ hàng -> [Khách vãng lai hoặc Đăng nhập] -> Địa chỉ giao (tự điền)
         -> Phương thức giao (hiện phí) -> Thanh toán (đa phương thức + huy hiệu)
         -> Xác nhận (mọi chi phí liệt kê rõ) -> Xác nhận đơn -> Trang xác nhận + theo dõi
</code></pre>
<div class="callout"><span class="badge">Quy tắc thực dụng</span> Hiện đầy đủ chi phí (sản phẩm + ship + thuế) sớm nhất từ trang giỏ hàng, không chỉ ở bước xác nhận cuối &mdash; bất ngờ muộn là nguyên nhân bỏ giỏ hàng hàng đầu.</div>`,
  ]]);

const c5q = quiz('ede201c-quiz-5', 'Quiz 5 — Cart & checkout UX|||Quiz 5 — Giỏ hàng & thanh toán', [
  { id: 'q1', question: 'Theo Baymard, nguyên nhân được nhắc nhiều nhất khiến khách bỏ giỏ hàng là gì?', options: ['Giao diện giỏ hàng xấu', 'Chi phí phụ (ship, thuế, phí) quá cao hoặc chỉ hiện ra quá muộn', 'Không có ảnh sản phẩm trong giỏ', 'Giỏ hàng không có nút xoá'], correctIndex: 1, explanation: 'Baymard: chi phí phụ xuất hiện bất ngờ ở bước cuối (ship, thuế, phí) là nguyên nhân bỏ giỏ hàng được nhắc nhiều nhất — nên hiện chi phí sớm.' },
  { id: 'q2', question: 'Vì sao nên cho phép "checkout khách vãng lai" (guest checkout)?', options: ['Vì luật yêu cầu', 'Vì bắt buộc tạo tài khoản trước khi mua là một nguyên nhân bỏ giỏ hàng phổ biến', 'Vì tài khoản không lưu được lịch sử mua hàng', 'Vì nó tăng phí giao dịch'], correctIndex: 1, explanation: 'Bắt buộc tạo tài khoản trước khi mua nằm trong nhóm nguyên nhân bỏ giỏ hàng phổ biến theo Baymard; nên để guest checkout là đường mặc định.' },
  { id: 'q3', question: 'Khi hiển thị lỗi nhập liệu ở form checkout, cách nào ĐÚNG?', options: ['Hiện một banner "Lỗi" chung ở đầu trang', 'Hiện thông báo cụ thể ngay bên cạnh trường bị lỗi, bằng ngôn ngữ đơn giản', 'Không cần hiện lỗi, để người dùng tự đoán', 'Chỉ hiện lỗi bằng mã lỗi kỹ thuật'], correctIndex: 1, explanation: 'Thông báo lỗi nên cụ thể, đặt ngay cạnh trường nhập bị lỗi, dùng ngôn ngữ dễ hiểu — không phải một banner chung mơ hồ ở đầu trang.' },
]);

const c6 = doc('ede201c-6-1-wireframe-prototype-figma', '6.1 — Wireframing & prototyping in Figma|||6.1 — Wireframe & prototype với Figma',
  'Cấp độ fidelity (low/mid/hi-fi); Figma: frame, component & variant, auto layout, prototyping; nguyên tắc "Refactoring UI" khi lên hi-fi.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 6 · Lesson 6.1</span>
<h2>Wireframing &amp; prototyping in Figma</h2>
<h3>Fidelity levels</h3>
<ul>
<li><strong>Low-fi wireframe</strong> &mdash; boxes and labels, no color/real content; fast to change, good for arguing about layout and flow before anyone gets attached to visuals.</li>
<li><strong>Mid-fi</strong> &mdash; real hierarchy and spacing, still mostly grayscale; good for usability testing structure without visual bias.</li>
<li><strong>Hi-fi</strong> &mdash; final colors, typography, real imagery &mdash; what stakeholders and developers actually sign off on.</li>
<li><strong>Prototype</strong> &mdash; hi-fi screens wired together so a user can click through and experience the flow, not just look at static images.</li>
</ul>
<h3>Figma essentials</h3>
<ul>
<li><strong>Frames</strong> &mdash; the "page/screen" container, sized to a device (e.g. 375&times;812 for mobile).</li>
<li><strong>Components &amp; variants</strong> &mdash; a button/card defined once, reused everywhere; a variant set (e.g. Button: default/hover/disabled) keeps every instance consistent when you update the master.</li>
<li><strong>Auto layout</strong> &mdash; makes a frame resize automatically as its content changes (e.g. a cart-item list that grows) &mdash; essential for responsive design work in Chapter 7.</li>
<li><strong>Prototyping</strong> &mdash; connect frames with click/tap interactions (navigate, overlay, smart animate) so reviewers and testers can click through like a real app.</li>
<li><strong>Dev handoff (Inspect panel)</strong> &mdash; developers read exact spacing, colors, and font sizes directly from the file &mdash; no separate spec document needed.</li>
</ul>
<h3>From wireframe to polished screen (Refactoring UI principles)</h3>
<ul>
<li>Use fewer font sizes/weights than you think you need; consistency reads as more "designed" than variety.</li>
<li>Build hierarchy with spacing and size, not just color &mdash; the most important element on the screen should be visually obvious in grayscale alone.</li>
<li>Increase whitespace before adding borders/dividers to separate sections.</li>
</ul>
<pre><code>Low-fi wireframe of a PDP (ASCII sketch):
+--------------------------------+
| [ IMG ]   Product name         |
| [thumb]   $$$ price            |
| [thumb]   [ ] size  [ ] color  |
|           [   ADD TO CART   ]  |
+--------------------------------+
| Description...                 |
| Reviews (128) *****             |
+--------------------------------+
</code></pre>
<div class="callout"><span class="badge">Practice tip</span> Prototype the full click-path a real customer would take (browse &rarr; PDP &rarr; cart &rarr; checkout), not just one isolated screen &mdash; most UX problems live in the transitions between screens, not inside a single one.</div>`,
    `<span class="eyebrow">EDE201c · Chương 6 · Bài 6.1</span>
<h2>Wireframe &amp; prototype với Figma</h2>
<h3>Các cấp độ fidelity</h3>
<ul>
<li><strong>Wireframe low-fi</strong> &mdash; khung và nhãn, không màu/không nội dung thật; đổi nhanh, tốt để tranh luận về bố cục và luồng trước khi ai đó gắn bó với hình ảnh.</li>
<li><strong>Mid-fi</strong> &mdash; thứ bậc và khoảng cách thật, vẫn chủ yếu xám; tốt để usability test cấu trúc mà không bị thiên vị bởi hình ảnh.</li>
<li><strong>Hi-fi</strong> &mdash; màu, chữ, ảnh thật cuối cùng &mdash; thứ mà stakeholder và developer thực sự chốt duyệt.</li>
<li><strong>Prototype</strong> &mdash; các màn hình hi-fi được nối lại để người dùng bấm qua và trải nghiệm luồng, không chỉ nhìn ảnh tĩnh.</li>
</ul>
<h3>Kiến thức nền Figma</h3>
<ul>
<li><strong>Frame</strong> &mdash; khung chứa "trang/màn hình", có kích thước theo thiết bị (vd 375&times;812 cho mobile).</li>
<li><strong>Component &amp; variant</strong> &mdash; một nút/thẻ định nghĩa một lần, dùng lại mọi nơi; một bộ variant (vd Button: default/hover/disabled) giữ mọi bản sao đồng nhất khi cập nhật bản gốc.</li>
<li><strong>Auto layout</strong> &mdash; giúp một frame tự đổi kích thước khi nội dung thay đổi (vd danh sách sản phẩm trong giỏ dài ra) &mdash; thiết yếu cho công việc responsive ở Chương 7.</li>
<li><strong>Prototyping</strong> &mdash; nối các frame bằng tương tác bấm/chạm (chuyển màn hình, overlay, smart animate) để người xem và người test bấm qua như một app thật.</li>
<li><strong>Dev handoff (panel Inspect)</strong> &mdash; developer đọc chính xác khoảng cách, màu, cỡ chữ trực tiếp từ file &mdash; không cần tài liệu spec riêng.</li>
</ul>
<h3>Từ wireframe lên màn hình hoàn chỉnh (nguyên tắc Refactoring UI)</h3>
<ul>
<li>Dùng ít cỡ chữ/độ đậm hơn bạn nghĩ là cần; sự đồng nhất trông "được thiết kế" hơn sự đa dạng.</li>
<li>Dựng thứ bậc bằng khoảng cách và kích thước, không chỉ bằng màu &mdash; thành phần quan trọng nhất trên màn hình phải rõ ràng ngay cả khi chỉ nhìn bản xám.</li>
<li>Tăng khoảng trắng trước khi thêm đường viền/đường kẻ để tách các phần.</li>
</ul>
<pre><code>Wireframe low-fi của trang sản phẩm (phác thảo ASCII):
+--------------------------------+
| [ ẢNH ]   Tên sản phẩm          |
| [thumb]   $$$ giá               |
| [thumb]   [ ] size  [ ] màu     |
|           [   THÊM VÀO GIỎ  ]  |
+--------------------------------+
| Mô tả...                        |
| Đánh giá (128) *****             |
+--------------------------------+
</code></pre>
<div class="callout"><span class="badge">Gợi ý luyện tập</span> Dựng prototype cho toàn bộ đường bấm mà khách thật sẽ đi (lướt &rarr; trang sản phẩm &rarr; giỏ hàng &rarr; thanh toán), không chỉ một màn hình riêng lẻ &mdash; hầu hết vấn đề UX nằm ở CHUYỂN TIẾP giữa các màn hình, không nằm trong một màn hình đơn lẻ.</div>`,
  ]]);

const c6q = quiz('ede201c-quiz-6', 'Quiz 6 — Wireframe & prototype in Figma|||Quiz 6 — Wireframe & prototype Figma', [
  { id: 'q1', question: 'Wireframe low-fi thường dùng vào mục đích gì?', options: ['Chốt màu sắc và font cuối cùng', 'Tranh luận nhanh về bố cục và luồng trước khi gắn bó với hình ảnh cụ thể', 'Bàn giao cho developer code', 'Thay thế hoàn toàn usability testing'], correctIndex: 1, explanation: 'Low-fi (khung, nhãn, không màu) đổi nhanh và rẻ, phù hợp để tranh luận bố cục/luồng trước khi đầu tư vào chi tiết hình ảnh.' },
  { id: 'q2', question: 'Trong Figma, "component & variant" giúp gì?', options: ['Tăng tốc độ render ảnh', 'Định nghĩa một thành phần (vd nút) một lần, dùng lại đồng nhất mọi nơi và cập nhật hàng loạt', 'Tự động dịch song ngữ', 'Chỉ dùng để đặt tên layer'], correctIndex: 1, explanation: 'Component/variant cho phép định nghĩa một thành phần UI một lần và tái sử dụng nhất quán; sửa bản gốc thì mọi bản sao (instance) cập nhật theo.' },
  { id: 'q3', question: 'Nguyên tắc "Refactoring UI" nào giúp tạo thứ bậc rõ ràng trên màn hình?', options: ['Dùng càng nhiều màu và cỡ chữ càng tốt', 'Dựng thứ bậc bằng khoảng cách và kích thước, không chỉ dựa vào màu', 'Luôn thêm đường viền quanh mọi phần tử', 'Tránh dùng khoảng trắng để tiết kiệm diện tích'], correctIndex: 1, explanation: 'Refactoring UI khuyến nghị dùng khoảng cách/kích thước để tạo thứ bậc — thành phần quan trọng nhất phải rõ ràng ngay cả ở bản xám (grayscale).' },
]);

const c7 = doc('ede201c-7-1-responsive-mobile-commerce', '7.1 — Responsive design & mobile commerce|||7.1 — Thiết kế responsive & mobile commerce',
  'Mobile-first, breakpoint; vùng ngón tay cái, kích thước chạm; mẫu m-commerce (sticky add-to-cart, bottom sheet); hiệu năng cảm nhận.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 7 · Lesson 7.1</span>
<h2>Responsive design &amp; mobile commerce</h2>
<h3>Mobile-first &amp; breakpoints</h3>
<p>Design the smallest screen first, then progressively add layout for more space &mdash; this forces you to prioritize content, since a small screen can't hide bad prioritization behind extra whitespace. Most e-commerce traffic today is mobile, so mobile is the primary experience, not an afterthought.</p>
<pre><code>Common breakpoints (adapt per project):
&lt; 480px   mobile (single column)
480-768px  large mobile / small tablet
768-1024px tablet (2 columns for PLP)
&gt; 1024px  desktop (3-4 columns, persistent filters sidebar)
</code></pre>
<h3>Touch targets &amp; the thumb zone</h3>
<ul>
<li><strong>Minimum touch target</strong> &mdash; roughly 44&times;44px (iOS) / 48&times;48dp (Android); smaller targets cause mis-taps, especially on a small product-grid card.</li>
<li><strong>Thumb zone</strong> &mdash; on a one-handed phone grip, the bottom of the screen is easiest to reach; put primary actions (add to cart, checkout) low, and put rarely-used or destructive actions (delete account) further from that zone.</li>
</ul>
<h3>Mobile-commerce (m-commerce) specific patterns</h3>
<ul>
<li><strong>Sticky "Add to cart"</strong> bar at the bottom of the PDP as the user scrolls past the fold.</li>
<li><strong>Bottom sheet for filters</strong> instead of a full-page filter screen &mdash; keeps context (result count) visible behind it.</li>
<li><strong>Bottom tab navigation</strong> for the 3&ndash;5 top-level destinations (Home, Search, Cart, Account) &mdash; reachable with a thumb, always visible.</li>
<li><strong>Simplified forms</strong> &mdash; the right keyboard type per field (numeric for phone/card, email keyboard for email), fewer required fields than desktop if possible.</li>
</ul>
<h3>Performance &amp; perceived speed</h3>
<ul>
<li><strong>Skeleton screens</strong> (gray placeholder shapes) instead of a blank white screen or spinner &mdash; they make load feel faster because the layout is already visible.</li>
<li><strong>Lazy-load images</strong> below the fold so the first screen paints fast, especially on slower mobile networks.</li>
</ul>
<div class="callout"><span class="badge">Reality check</span> A desktop-designed checkout with 8 tiny form fields is painful on desktop and often unusable on mobile &mdash; always test the exact same flow at phone width, not just look at a mobile mockup.</div>`,
    `<span class="eyebrow">EDE201c · Chương 7 · Bài 7.1</span>
<h2>Thiết kế responsive &amp; mobile commerce</h2>
<h3>Mobile-first &amp; breakpoint</h3>
<p>Thiết kế màn hình nhỏ nhất trước, rồi thêm dần bố cục cho không gian lớn hơn &mdash; điều này buộc bạn ưu tiên nội dung, vì màn hình nhỏ không thể giấu việc ưu tiên sai sau khoảng trắng thừa. Hầu hết lưu lượng TMĐT hiện nay là mobile, nên mobile là trải nghiệm chính, không phải thứ nghĩ thêm sau cùng.</p>
<pre><code>Breakpoint phổ biến (tuỳ chỉnh theo dự án):
&lt; 480px   mobile (một cột)
480-768px  mobile lớn / tablet nhỏ
768-1024px tablet (2 cột cho trang danh mục)
&gt; 1024px  desktop (3-4 cột, sidebar bộ lọc cố định)
</code></pre>
<h3>Kích thước chạm &amp; vùng ngón tay cái</h3>
<ul>
<li><strong>Kích thước chạm tối thiểu</strong> &mdash; khoảng 44&times;44px (iOS) / 48&times;48dp (Android); vùng chạm nhỏ hơn gây bấm nhầm, đặc biệt trên thẻ sản phẩm nhỏ trong lưới.</li>
<li><strong>Vùng ngón tay cái</strong> &mdash; khi cầm điện thoại một tay, đáy màn hình dễ chạm tới nhất; đặt hành động chính (thêm vào giỏ, thanh toán) ở dưới, và đặt hành động hiếm dùng hoặc phá hủy (xoá tài khoản) xa vùng đó.</li>
</ul>
<h3>Mẫu riêng của mobile commerce (m-commerce)</h3>
<ul>
<li><strong>Thanh "Thêm vào giỏ" dính (sticky)</strong> ở đáy trang sản phẩm khi người dùng cuộn qua phần đầu.</li>
<li><strong>Bottom sheet cho bộ lọc</strong> thay vì màn hình lọc toàn trang &mdash; giữ được ngữ cảnh (số kết quả) hiện phía sau.</li>
<li><strong>Thanh điều hướng dưới (bottom tab)</strong> cho 3&ndash;5 điểm đến cấp cao nhất (Trang chủ, Tìm kiếm, Giỏ hàng, Tài khoản) &mdash; ngón tay cái chạm tới được, luôn hiện.</li>
<li><strong>Form đơn giản hơn</strong> &mdash; đúng loại bàn phím cho từng trường (số cho điện thoại/thẻ, bàn phím email cho email), ít trường bắt buộc hơn desktop nếu có thể.</li>
</ul>
<h3>Hiệu năng &amp; tốc độ cảm nhận</h3>
<ul>
<li><strong>Skeleton screen</strong> (hình khối xám giữ chỗ) thay vì màn hình trắng trống hoặc chỉ vòng xoay &mdash; khiến việc tải cảm giác nhanh hơn vì bố cục đã hiện sẵn.</li>
<li><strong>Lazy-load ảnh</strong> ở phần chưa cuộn tới để màn hình đầu tiên vẽ nhanh, đặc biệt trên mạng mobile chậm.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra thực tế</span> Một checkout thiết kế cho desktop với 8 trường nhập nhỏ đã khó chịu trên desktop và thường không dùng được trên mobile &mdash; luôn test đúng luồng đó ở khổ điện thoại thật, không chỉ nhìn mockup mobile.</div>`,
  ]]);

const c7q = quiz('ede201c-quiz-7', 'Quiz 7 — Responsive & mobile commerce|||Quiz 7 — Responsive & mobile commerce', [
  { id: 'q1', question: 'Vì sao nên thiết kế theo hướng "mobile-first"?', options: ['Vì desktop không còn ai dùng', 'Vì màn hình nhỏ buộc ưu tiên nội dung, không thể giấu ưu tiên sai sau khoảng trắng thừa', 'Vì mobile không cần responsive', 'Vì luật yêu cầu'], correctIndex: 1, explanation: 'Thiết kế từ màn hình nhỏ nhất buộc phải ưu tiên đúng nội dung quan trọng, vì không có không gian dư để giấu việc ưu tiên sai — và hầu hết lưu lượng TMĐT là mobile.' },
  { id: 'q2', question: '"Vùng ngón tay cái" (thumb zone) trên điện thoại nghĩa là gì?', options: ['Vùng màn hình chỉ hiển thị ảnh', 'Vùng đáy màn hình dễ chạm tới nhất khi cầm một tay, nên đặt hành động chính ở đó', 'Vùng chỉ dùng cho quảng cáo', 'Vùng bắt buộc phải để trống'], correctIndex: 1, explanation: 'Khi cầm điện thoại một tay, đáy màn hình dễ chạm nhất — nên đặt hành động chính (thêm vào giỏ, thanh toán) ở vùng này và đặt hành động phá hủy xa vùng đó.' },
  { id: 'q3', question: 'Skeleton screen (hình khối xám giữ chỗ khi tải) có tác dụng gì?', options: ['Giảm dung lượng ảnh thật', 'Khiến việc tải cảm giác nhanh hơn vì bố cục đã hiện sẵn thay vì màn hình trắng trống', 'Thay thế hoàn toàn lazy-load ảnh', 'Chỉ dùng được trên desktop'], correctIndex: 1, explanation: 'Skeleton screen cải thiện TỐC ĐỘ CẢM NHẬN bằng cách hiện bố cục ngay, dù nội dung thật chưa tải xong, thay vì để màn hình trắng hoặc chỉ vòng xoay.' },
]);

const c8 = doc('ede201c-8-1-cro-ab-accessibility', '8.1 — Conversion optimization, A/B testing, accessibility & measurement|||8.1 — Tối ưu chuyển đổi (CRO), A/B testing, accessibility & đo lường',
  'Funnel chuyển đổi & KPI; phương pháp A/B testing; accessibility WCAG cho TMĐT; heatmap & phân tích đo lường.',
  [[
    `<span class="eyebrow">EDE201c · Chapter 8 · Lesson 8.1</span>
<h2>Conversion optimization, A/B testing, accessibility &amp; measurement</h2>
<h3>The conversion funnel &amp; key KPIs</h3>
<pre><code>Visit -> View product -> Add to cart -> Start checkout -> Purchase

Conversion rate      = Purchases / Visits
Cart abandonment rate = 1 - (Purchases / Carts started)
Average Order Value (AOV) = Total revenue / Number of orders
Bounce rate           = Visits with no interaction / Total visits
</code></pre>
<p>UX work should target the step with the sharpest drop &mdash; fixing a beautifully-designed homepage does nothing if 70% of add-to-cart users abandon at checkout.</p>
<h3>A/B testing methodology</h3>
<ul>
<li><strong>One hypothesis, one variable</strong> at a time (e.g. "a sticky add-to-cart bar increases mobile add-to-cart rate") &mdash; changing five things at once tells you nothing about which change worked.</li>
<li><strong>Split traffic randomly</strong> between control (A) and variant (B); run until you reach <strong>statistical significance</strong> (commonly p &lt; 0.05) with an adequate sample size &mdash; stopping early on a lucky streak is a classic mistake.</li>
<li>Test on a metric that matters (revenue/conversion), not just a vanity metric (clicks) that might not translate to sales.</li>
</ul>
<h3>Accessibility (WCAG) in e-commerce</h3>
<ul>
<li><strong>Alt text</strong> on every product image (screen-reader users still need to know what they're buying).</li>
<li><strong>Keyboard navigation</strong> &mdash; every interactive element (filters, quantity selector, checkout form) reachable and operable via keyboard alone.</li>
<li><strong>Color contrast</strong> &mdash; text/background contrast ratio meeting WCAG AA (4.5:1 for normal text) so low-vision users can read prices and buttons.</li>
<li><strong>Form labels &amp; focus states</strong> &mdash; every input has a real associated label (not just a placeholder that disappears), and a visible focus outline.</li>
</ul>
<p>Accessibility is not charity work: it is a legal requirement in many markets, and low-contrast text or unlabeled forms hurt <em>every</em> user under bad lighting or a cracked screen, not only users with disabilities.</p>
<h3>Analytics &amp; measurement</h3>
<ul>
<li><strong>Heatmaps</strong> &mdash; visualize where users click, move, and how far they scroll; reveal, e.g., that nobody scrolls past the fold to see a discount banner.</li>
<li><strong>Funnel analytics</strong> &mdash; the quantitative half of Chapter 2's research toolkit, now used to <em>verify</em> whether a redesign actually improved the metric it targeted.</li>
</ul>
<div class="callout"><span class="badge">Closing the loop</span> Design &rarr; research &rarr; wireframe/prototype &rarr; ship &rarr; measure (this chapter) &rarr; back to research. UI/UX for e-commerce is never "done" &mdash; it's a cycle driven by real user behavior, not opinion.</div>`,
    `<span class="eyebrow">EDE201c · Chương 8 · Bài 8.1</span>
<h2>Tối ưu chuyển đổi (CRO), A/B testing, accessibility &amp; đo lường</h2>
<h3>Funnel chuyển đổi &amp; KPI chính</h3>
<pre><code>Truy cập -> Xem sản phẩm -> Thêm vào giỏ -> Bắt đầu thanh toán -> Mua hàng

Tỉ lệ chuyển đổi       = Số đơn mua / Số lượt truy cập
Tỉ lệ bỏ giỏ hàng       = 1 - (Số đơn mua / Số giỏ hàng đã tạo)
Giá trị đơn trung bình (AOV) = Tổng doanh thu / Số đơn hàng
Tỉ lệ thoát trang (bounce) = Lượt truy cập không tương tác / Tổng lượt truy cập
</code></pre>
<p>Công việc UX nên nhằm vào bước có mức rời bỏ mạnh nhất &mdash; sửa một trang chủ đẹp lộng lẫy vô ích nếu 70% người đã thêm vào giỏ lại bỏ ngang ở thanh toán.</p>
<h3>Phương pháp A/B testing</h3>
<ul>
<li><strong>Một giả thuyết, một biến số</strong> mỗi lần (vd "thanh thêm-vào-giỏ dính tăng tỉ lệ thêm giỏ trên mobile") &mdash; đổi năm thứ cùng lúc thì không biết thứ nào tạo ra hiệu quả.</li>
<li><strong>Chia lưu lượng ngẫu nhiên</strong> giữa bản đối chứng (A) và biến thể (B); chạy đến khi đạt <strong>ý nghĩa thống kê</strong> (thường p &lt; 0,05) với kích thước mẫu đủ lớn &mdash; dừng sớm vì một chuỗi may mắn là lỗi kinh điển.</li>
<li>Đo trên chỉ số thực sự quan trọng (doanh thu/chuyển đổi), không chỉ chỉ số phô diễn (lượt bấm) có thể không chuyển thành doanh số.</li>
</ul>
<h3>Khả năng tiếp cận (accessibility/WCAG) trong TMĐT</h3>
<ul>
<li><strong>Alt text</strong> cho mọi ảnh sản phẩm (người dùng trình đọc màn hình vẫn cần biết họ đang mua gì).</li>
<li><strong>Điều hướng bằng bàn phím</strong> &mdash; mọi thành phần tương tác (bộ lọc, chọn số lượng, form checkout) chạm tới và dùng được chỉ bằng bàn phím.</li>
<li><strong>Độ tương phản màu</strong> &mdash; tỉ lệ tương phản chữ/nền đạt WCAG AA (4,5:1 với chữ thường) để người khiếm thị đọc được giá và nút.</li>
<li><strong>Nhãn form &amp; trạng thái focus</strong> &mdash; mỗi ô nhập có nhãn thật gắn kèm (không chỉ placeholder biến mất khi gõ), và viền focus nhìn thấy được.</li>
</ul>
<p>Khả năng tiếp cận không phải việc từ thiện: nó là yêu cầu pháp lý ở nhiều thị trường, và chữ tương phản thấp hay form không nhãn gây hại cho <em>MỌI</em> người dùng khi ánh sáng xấu hoặc màn hình nứt, không chỉ người khuyết tật.</p>
<h3>Phân tích &amp; đo lường</h3>
<ul>
<li><strong>Heatmap</strong> &mdash; hiện trực quan chỗ người dùng bấm, di chuột, và cuộn xa tới đâu; hé lộ, ví dụ, không ai cuộn qua phần đầu để thấy banner giảm giá.</li>
<li><strong>Phân tích funnel</strong> &mdash; nửa định lượng của bộ công cụ nghiên cứu ở Chương 2, giờ dùng để <em>xác minh</em> một bản thiết kế lại có thực sự cải thiện chỉ số nó nhằm tới hay không.</li>
</ul>
<div class="callout"><span class="badge">Khép vòng lặp</span> Thiết kế &rarr; nghiên cứu &rarr; wireframe/prototype &rarr; triển khai &rarr; đo lường (chương này) &rarr; quay lại nghiên cứu. UI/UX cho TMĐT không bao giờ "xong" &mdash; đó là một vòng lặp dẫn dắt bởi hành vi người dùng thật, không phải ý kiến cá nhân.</div>`,
  ]]);

const c8q = quiz('ede201c-quiz-8', 'Quiz 8 — CRO, A/B testing & accessibility|||Quiz 8 — CRO, A/B testing & accessibility', [
  { id: 'q1', question: 'Trong A/B testing, vì sao chỉ nên đổi MỘT biến số mỗi lần?', options: ['Vì công cụ không cho đổi nhiều biến', 'Vì đổi nhiều thứ cùng lúc thì không biết thay đổi nào tạo ra kết quả', 'Vì đổi một biến chạy nhanh hơn', 'Vì luật yêu cầu'], correctIndex: 1, explanation: 'Nếu đổi nhiều biến cùng lúc, không thể xác định biến nào thực sự gây ra sự khác biệt về kết quả — nguyên tắc cốt lõi của thử nghiệm có kiểm soát.' },
  { id: 'q2', question: 'Tỉ lệ tương phản màu chữ/nền theo WCAG AA cho chữ thường là bao nhiêu?', options: ['1:1', '2:1', '4.5:1', '10:1'], correctIndex: 2, explanation: 'WCAG AA yêu cầu tỉ lệ tương phản tối thiểu 4,5:1 cho chữ thường, để người khiếm thị vẫn đọc được nội dung như giá và nhãn nút.' },
  { id: 'q3', question: 'Công việc UX nên ưu tiên nhằm vào đâu trong funnel chuyển đổi?', options: ['Bước có lượng truy cập cao nhất', 'Bước có mức rời bỏ (drop-off) mạnh nhất', 'Trang có nhiều ảnh nhất', 'Bước cuối cùng luôn luôn'], correctIndex: 1, explanation: 'Cải thiện bước có mức rời bỏ mạnh nhất mang lại tác động lớn nhất — sửa một bước đã tốt sẵn (vd trang chủ) ít giá trị hơn nếu bước khác (vd checkout) mất phần lớn khách.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'EDE201c',
    slug: 'ede201c-uiux-design-for-e-commerce',
    title: 'UI/UX Design for E-Commerce',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EDE201c.webp',
    shortDescription: 'Design UI/UX for online stores: usability foundations, user research & personas, IA & navigation, product/category pages, cart & checkout UX, Figma prototypes, mobile commerce, CRO & A/B testing. Bilingual, with examples & quizzes.|||Thiết kế UI/UX cho cửa hàng trực tuyến: nền tảng khả dụng, nghiên cứu người dùng & persona, IA & điều hướng, trang sản phẩm/danh mục, UX giỏ hàng & thanh toán, prototype Figma, mobile commerce, CRO & A/B testing. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>EDE201c — UI/UX Design for E-Commerce</strong> (khối Quản trị Kinh doanh, kỳ 5) dạy thiết kế trải nghiệm mua sắm trực tuyến hiệu quả. Từ <strong>nền tảng khả dụng &amp; tâm lý người mua</strong> (Krug, Norman) → <strong>nghiên cứu người dùng &amp; persona</strong> (nghiên cứu Baymard Institute) → <strong>information architecture &amp; điều hướng</strong> → <strong>trang sản phẩm &amp; danh mục</strong> → <strong>UX giỏ hàng &amp; thanh toán</strong> → <strong>wireframe &amp; prototype trong Figma</strong> → <strong>responsive &amp; mobile commerce</strong> → <strong>tối ưu chuyển đổi (CRO), A/B testing, accessibility &amp; đo lường</strong>. Song ngữ, có ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'UI vs UX, heuristics khả dụng (Krug), affordance/signifier/feedback (Norman), tâm lý người mua online; phương pháp nghiên cứu người dùng, persona & Jobs-to-be-Done, customer journey map (Baymard); information architecture, mega menu, faceted search, breadcrumb; thiết kế PLP & PDP theo nghiên cứu Baymard; UX giỏ hàng & checkout, nguyên nhân bỏ giỏ hàng; wireframe/prototype trong Figma (component, auto layout); responsive & mobile commerce (thumb zone, sticky CTA); funnel chuyển đổi, A/B testing, accessibility WCAG, heatmap & KPI.',
    requirements: 'Không yêu cầu kiến thức thiết kế trước. Nên có tài khoản Figma miễn phí để thực hành wireframe/prototype ở Chương 6.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách kinh điển, nghiên cứu Baymard, Refactoring UI, tài liệu Figma, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'UI vs UX, vì sao khả dụng quyết định doanh thu, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng UI/UX & tâm lý mua online|||Chapter 1 — UI/UX foundations & buyer psychology', description: 'Affordance/signifier/feedback, "Đừng bắt tôi nghĩ", trust signals, cognitive load.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nghiên cứu người dùng & persona|||Chapter 2 — User research & personas', description: 'Định tính/định lượng, Baymard, persona, JTBD, customer journey.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Information architecture & điều hướng|||Chapter 3 — IA & navigation', description: 'Card sorting, mega menu, faceted search, breadcrumb, tìm kiếm gợi ý.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Trang sản phẩm & danh mục|||Chapter 4 — Product & category pages', description: 'PLP, PDP, ảnh, biến thể, đánh giá, CTA — theo nghiên cứu Baymard.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Giỏ hàng & thanh toán|||Chapter 5 — Cart & checkout UX', description: 'Nguyên nhân bỏ giỏ hàng, guest checkout, progress indicator, trust badges.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Wireframe & prototype Figma|||Chapter 6 — Wireframing & Figma prototyping', description: 'Fidelity levels, component/auto layout, Refactoring UI, prototyping.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Responsive & mobile commerce|||Chapter 7 — Responsive design & mobile commerce', description: 'Breakpoint, thumb zone, sticky CTA, bottom sheet, hiệu năng cảm nhận.', lessons: [c7, c7q] },
    { title: 'Chương 8 — CRO, A/B testing, accessibility & đo lường|||Chapter 8 — CRO, A/B testing, accessibility & measurement', description: 'Funnel & KPI, phương pháp A/B test, WCAG, heatmap.', lessons: [c8, c8q] },
  ],
};
