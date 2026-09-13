/**
 * WDA201 — Writing in the Digital Age (Viết trong thời đại số). Khối Công nghệ
 * Truyền thông FPTU. Giáo trình chuẩn: Handley "Everybody Writes", Redish
 * "Letting Go of the Words", Nielsen Norman Group "Writing for the Web",
 * Strunk & White "The Elements of Style", Purdue OWL. Song ngữ + ví dụ
 * sửa trước/sau + mẫu thật + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "&"→"&amp;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('wda201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Handley, Redish, Strunk & White), NN/g, Purdue OWL, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">WDA201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to write well for the web — clarity, structure, UX writing, social, email, SEO and ethics — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, world-class resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for WDA201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><a href="https://annhandley.com/everybodywrites/" target="_blank" rel="noopener">Ann Handley — <em>Everybody Writes</em></a> — the modern guide to writing ridiculously good content.</li>
<li><a href="https://www.uxwritingcourse.com/letting-go-of-the-words" target="_blank" rel="noopener">Janice (Ginny) Redish — <em>Letting Go of the Words</em></a> — writing web content that works.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Elements_of_Style" target="_blank" rel="noopener">Strunk &amp; White — <em>The Elements of Style</em></a> — the timeless rules of clear English.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.nngroup.com/topic/writing-web/" target="_blank" rel="noopener">Nielsen Norman Group — Writing for the Web</a> — research-based UX writing articles.</li>
<li><a href="https://owl.purdue.edu/" target="_blank" rel="noopener">Purdue OWL</a> — grammar, style, citation &amp; professional writing.</li>
<li><a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener">Google SEO Starter Guide</a> — how search finds &amp; ranks your writing.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — flags long, dense &amp; passive sentences.</li>
<li><a href="https://readable.com/" target="_blank" rel="noopener">Readable</a> — measures reading grade &amp; readability scores.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — how people read on screens (scanning, F-pattern) and the rules of clear, plain language.</li>
<li><strong>Structure</strong> — inverted pyramid, headings, bullets and chunking so content is scannable.</li>
<li><strong>Apply by channel</strong> — web &amp; UX microcopy, social posts, email/newsletter, and SEO.</li>
<li><strong>Job-ready</strong> — a consistent brand voice, inclusive &amp; truthful writing, and responsible AI-assisted drafting.</li>
</ol></div>`,
    `<span class="eyebrow">WDA201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để viết tốt cho môi trường số — rõ ràng, cấu trúc, UX writing, mạng xã hội, email, SEO và đạo đức — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, đẳng cấp thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của WDA201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://annhandley.com/everybodywrites/" target="_blank" rel="noopener">Ann Handley — <em>Everybody Writes</em></a> — cẩm nang viết nội dung số hiện đại.</li>
<li><a href="https://www.uxwritingcourse.com/letting-go-of-the-words" target="_blank" rel="noopener">Janice (Ginny) Redish — <em>Letting Go of the Words</em></a> — viết nội dung web thực sự dùng được.</li>
<li><a href="https://en.wikipedia.org/wiki/The_Elements_of_Style" target="_blank" rel="noopener">Strunk &amp; White — <em>The Elements of Style</em></a> — những quy tắc viết tiếng Anh trong sáng.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.nngroup.com/topic/writing-web/" target="_blank" rel="noopener">Nielsen Norman Group — Writing for the Web</a> — bài viết UX writing dựa trên nghiên cứu.</li>
<li><a href="https://owl.purdue.edu/" target="_blank" rel="noopener">Purdue OWL</a> — ngữ pháp, văn phong, trích dẫn &amp; viết chuyên nghiệp.</li>
<li><a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener">Google SEO Starter Guide</a> — cách công cụ tìm kiếm tìm &amp; xếp hạng bài viết.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://hemingwayapp.com/" target="_blank" rel="noopener">Hemingway Editor</a> — bắt câu dài, rối &amp; bị động.</li>
<li><a href="https://readable.com/" target="_blank" rel="noopener">Readable</a> — đo cấp độ đọc &amp; điểm dễ đọc.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — cách người ta đọc trên màn hình (quét, F-pattern) và quy tắc ngôn ngữ rõ ràng.</li>
<li><strong>Cấu trúc</strong> — kim tự tháp ngược, heading, bullet và chunking để nội dung dễ quét.</li>
<li><strong>Áp dụng theo kênh</strong> — web &amp; UX microcopy, bài mạng xã hội, email/newsletter, và SEO.</li>
<li><strong>Sẵn sàng đi làm</strong> — giọng thương hiệu nhất quán, viết toàn diện &amp; trung thực, dùng AI hỗ trợ có trách nhiệm.</li>
</ol></div>`,
  ]]);

const intro = doc('wda201-0-1-overview', 'Course overview: Writing in the Digital Age|||Tổng quan: Viết trong thời đại số',
  'Vì sao viết số khác viết giấy; người đọc quét chứ không đọc; lộ trình: nền tảng rõ ràng → cấu trúc → web/UX, mạng xã hội, email, SEO → giọng điệu & đạo đức + AI.',
  [[
    `<span class="eyebrow">WDA201 · Lesson 0.1 · Overview</span>
<h2>Writing in the Digital Age</h2>
<p class="lead">On a screen, <strong>nobody reads — everybody scans</strong>. This course teaches you to write content people actually finish and act on: clear, structured, and tuned for the channel it lives in — a web page, an app button, a tweet, an email, a search result.</p>
<h3>Why digital writing is different</h3>
<ul>
<li><strong>Readers are impatient</strong> — they skim in an F-shaped pattern, reading the top and left, sampling the rest.</li>
<li><strong>The medium is interactive</strong> — words are buttons, links, error messages and calls to action, not just prose.</li>
<li><strong>Search is a reader too</strong> — if Google can't understand your page, humans never see it.</li>
</ul>
<h3>Roadmap</h3>
<p>Digital vs. print reading → clear &amp; plain language → structuring content (inverted pyramid) → web &amp; UX writing → social media → email &amp; newsletters → SEO → voice, ethics &amp; responsible AI. Bilingual, with before/after rewrites, real templates and a quiz each chapter.</p>
<div class="callout"><span class="badge">One rule to remember</span> Write less, but make every word earn its place — <em>&quot;Make the reader's job easy&quot;</em> is the whole discipline in one line.</div>`,
    `<span class="eyebrow">WDA201 · Bài 0.1 · Tổng quan</span>
<h2>Viết trong thời đại số</h2>
<p class="lead">Trên màn hình, <strong>không ai đọc — ai cũng quét</strong>. Môn này dạy bạn viết nội dung người ta thực sự đọc hết và hành động theo: rõ ràng, có cấu trúc, và tinh chỉnh cho đúng kênh nó xuất hiện — trang web, nút app, một dòng tweet, email, hay kết quả tìm kiếm.</p>
<h3>Vì sao viết số khác biệt</h3>
<ul>
<li><strong>Người đọc thiếu kiên nhẫn</strong> — họ lướt theo hình chữ F, đọc phần trên và bên trái, chỉ nhặt phần còn lại.</li>
<li><strong>Phương tiện có tương tác</strong> — chữ là nút bấm, liên kết, thông báo lỗi và lời kêu gọi hành động, không chỉ là văn xuôi.</li>
<li><strong>Công cụ tìm kiếm cũng là người đọc</strong> — nếu Google không hiểu trang, con người sẽ không bao giờ thấy nó.</li>
</ul>
<h3>Lộ trình</h3>
<p>Đọc số vs giấy → ngôn ngữ rõ &amp; plain → cấu trúc nội dung (kim tự tháp ngược) → viết web &amp; UX → mạng xã hội → email &amp; newsletter → SEO → giọng điệu, đạo đức &amp; AI có trách nhiệm. Song ngữ, có ví dụ sửa trước/sau, mẫu thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Một quy tắc cần nhớ</span> Viết ít lại, nhưng mỗi từ phải xứng đáng chỗ đứng — <em>&quot;Làm cho việc của người đọc trở nên dễ dàng&quot;</em> gói gọn cả môn học trong một câu.</div>`,
  ]]);

const c1 = doc('wda201-1-1-digital-vs-print', '1.1 — Digital writing vs. print|||1.1 — Viết số khác viết truyền thống',
  'Đọc trên màn hình mệt hơn giấy; người đọc quét theo F-pattern; scannability; viết cho người thiếu kiên nhẫn.',
  [[
    `<span class="eyebrow">WDA201 · Chapter 1 · Lesson 1.1</span>
<h2>Digital writing vs. print</h2>
<h3>People scan, they don't read</h3>
<p>Nielsen Norman Group's eye-tracking shows readers scan pages in an <strong>F-pattern</strong>: two horizontal sweeps near the top, then a vertical scan down the left. Reading on a screen is slower and more tiring than on paper, so readers <em>ration</em> their attention. Your job is to reward the scan — put meaning where the eyes go.</p>
<h3>Write for scannability</h3>
<ul>
<li><strong>Front-load</strong> the key point in the first sentence and the first two words of each line.</li>
<li>Use <strong>descriptive headings</strong>, short paragraphs, and bulleted lists.</li>
<li>Cut throat-clearing intros — start where the value starts.</li>
</ul>
<h3>Before &amp; after</h3>
<pre><code>BEFORE (print habit):
 In today's fast-paced and ever-changing digital world, it is
 important to note that users may wish to reset their password.

AFTER (scannable):
 Forgot your password?
 Reset it in two steps.</code></pre>
<div class="callout"><span class="badge">The scan test</span> Read only your headings, first sentences and bold words. If that alone tells the story, you've written for the screen.</div>`,
    `<span class="eyebrow">WDA201 · Chương 1 · Bài 1.1</span>
<h2>Viết số khác viết truyền thống</h2>
<h3>Người ta quét, không đọc</h3>
<p>Nghiên cứu eye-tracking của Nielsen Norman Group cho thấy người đọc quét trang theo <strong>hình chữ F</strong>: hai lượt ngang gần đầu trang, rồi một lượt dọc xuống bên trái. Đọc màn hình chậm và mỏi hơn đọc giấy, nên người đọc <em>dè sẻn</em> sự chú ý. Việc của bạn là thưởng cho cái quét đó — đặt ý nghĩa vào nơi mắt lướt tới.</p>
<h3>Viết để dễ quét</h3>
<ul>
<li><strong>Đưa ý chính lên trước</strong> ở câu đầu và hai từ đầu của mỗi dòng.</li>
<li>Dùng <strong>heading mô tả</strong>, đoạn ngắn, và danh sách bullet.</li>
<li>Bỏ đoạn mở đầu vòng vo — bắt đầu ngay chỗ có giá trị.</li>
</ul>
<h3>Trước &amp; sau</h3>
<pre><code>TRƯỚC (thói quen viết giấy):
 Trong thế giới số hối hả và không ngừng đổi thay ngày nay, cần
 lưu ý rằng người dùng có thể muốn đặt lại mật khẩu của mình.

SAU (dễ quét):
 Quên mật khẩu?
 Đặt lại chỉ trong hai bước.</code></pre>
<div class="callout"><span class="badge">Phép thử quét</span> Chỉ đọc heading, câu đầu và từ in đậm. Nếu chừng đó đã kể trọn câu chuyện, bạn đã viết cho màn hình.</div>`,
  ]]);

const c1q = quiz('wda201-quiz-1', 'Quiz 1 — Digital vs. print|||Quiz 1 — Viết số vs truyền thống', [
  { id: 'q1', question: 'Người đọc web thường quét trang theo hình gì (theo NN/g)?', options: ['Hình chữ Z', 'Hình chữ F', 'Hình tròn', 'Từ dưới lên'], correctIndex: 1, explanation: 'Eye-tracking cho thấy F-pattern: hai lượt ngang trên + một lượt dọc trái.' },
  { id: 'q2', question: 'Nguyên tắc "front-loading" nghĩa là?', options: ['Để ý chính ở cuối bài', 'Đưa ý quan trọng nhất lên đầu câu/đầu dòng', 'Viết chữ to hơn', 'Thêm nhiều hình'], correctIndex: 1, explanation: 'Đặt thông tin quan trọng nơi mắt lướt tới trước tiên.' },
  { id: 'q3', question: 'Vì sao viết số phải "dễ quét" (scannable)?', options: ['Vì màn hình nhỏ hơn giấy', 'Vì người đọc quét chứ không đọc từng chữ, và mỏi mắt hơn khi đọc màn hình', 'Vì SEO cấm đoạn dài', 'Vì máy in đắt'], correctIndex: 1, explanation: 'Đọc màn hình chậm/mỏi hơn nên người đọc dè sẻn chú ý — phải thưởng cho cái quét.' },
]);

const c2 = doc('wda201-2-1-clear-writing', '2.1 — Principles of clear writing|||2.1 — Nguyên tắc viết rõ ràng',
  'Rõ - ngắn - đúng; câu chủ động; plain language; cắt từ thừa (Strunk & White: "omit needless words").',
  [[
    `<span class="eyebrow">WDA201 · Chapter 2 · Lesson 2.1</span>
<h2>Principles of clear writing</h2>
<h3>Clear, short, correct</h3>
<p>Strunk &amp; White's most famous rule is <strong>&quot;Omit needless words.&quot;</strong> Clear writing is not dumbed-down writing — it respects the reader's time. Three habits do most of the work: prefer the <strong>active voice</strong>, use <strong>plain words</strong>, and <strong>cut the filler</strong>.</p>
<h3>Active voice &amp; plain language</h3>
<ul>
<li><strong>Active:</strong> &quot;We shipped your order&quot; beats &quot;Your order has been shipped by us.&quot;</li>
<li><strong>Plain:</strong> choose <em>use</em> over <em>utilize</em>, <em>help</em> over <em>facilitate</em>, <em>about</em> over <em>in regard to</em>.</li>
<li><strong>Concrete:</strong> replace vague nouns with real things and numbers.</li>
</ul>
<h3>Before &amp; after — cut the fat</h3>
<pre><code>BEFORE (34 words):
 Due to the fact that the system is currently in the process of
 being updated, it is not possible for users to log in at this
 point in time.

AFTER (7 words):
 You can't log in — we're updating the system.</code></pre>
<div class="callout"><span class="badge">Plain-language swaps</span> in order to → to · at this point in time → now · a large number of → many · has the ability to → can.</div>`,
    `<span class="eyebrow">WDA201 · Chương 2 · Bài 2.1</span>
<h2>Nguyên tắc viết rõ ràng</h2>
<h3>Rõ - ngắn - đúng</h3>
<p>Quy tắc nổi tiếng nhất của Strunk &amp; White là <strong>&quot;Cắt bỏ từ thừa.&quot;</strong> Viết rõ không phải viết hạ thấp — nó tôn trọng thời gian người đọc. Ba thói quen làm phần lớn công việc: ưu tiên <strong>câu chủ động</strong>, dùng <strong>từ đơn giản (plain)</strong>, và <strong>cắt từ đệm</strong>.</p>
<h3>Câu chủ động &amp; plain language</h3>
<ul>
<li><strong>Chủ động:</strong> &quot;Chúng tôi đã gửi đơn của bạn&quot; hơn hẳn &quot;Đơn của bạn đã được gửi bởi chúng tôi.&quot;</li>
<li><strong>Plain:</strong> chọn <em>dùng</em> thay <em>sử dụng</em>, <em>giúp</em> thay <em>hỗ trợ tạo điều kiện</em>, <em>về</em> thay <em>liên quan đến vấn đề</em>.</li>
<li><strong>Cụ thể:</strong> thay danh từ mơ hồ bằng sự vật thật và con số.</li>
</ul>
<h3>Trước &amp; sau — cắt mỡ thừa</h3>
<pre><code>TRƯỚC (30+ chữ):
 Do bởi thực tế là hệ thống hiện đang trong quá trình được cập
 nhật, nên tại thời điểm hiện tại người dùng không thể đăng nhập.

SAU (8 chữ):
 Bạn chưa đăng nhập được — hệ thống đang cập nhật.</code></pre>
<div class="callout"><span class="badge">Cặp thay plain</span> nhằm mục đích → để · tại thời điểm hiện tại → bây giờ · một số lượng lớn → nhiều · có khả năng → có thể.</div>`,
  ]]);

const c2q = quiz('wda201-quiz-2', 'Quiz 2 — Clear writing|||Quiz 2 — Viết rõ ràng', [
  { id: 'q1', question: 'Quy tắc trứ danh của Strunk & White là?', options: ['Thêm càng nhiều từ càng hay', 'Cắt bỏ từ thừa (omit needless words)', 'Luôn dùng câu bị động', 'Viết dài cho trang trọng'], correctIndex: 1, explanation: '"Omit needless words" — tôn trọng thời gian người đọc.' },
  { id: 'q2', question: 'Câu nào là chủ động (active voice)?', options: ['Đơn của bạn đã được gửi bởi chúng tôi', 'Chúng tôi đã gửi đơn của bạn', 'Việc gửi đơn đã được thực hiện', 'Đơn đang trong quá trình được xử lý'], correctIndex: 1, explanation: 'Chủ ngữ thực hiện hành động → ngắn, rõ, mạnh hơn.' },
  { id: 'q3', question: '"Plain language" khuyên chọn từ nào?', options: ['"utilize" thay "use"', '"use" thay "utilize"', '"facilitate" thay "help"', '"at this point in time" thay "now"'], correctIndex: 1, explanation: 'Chọn từ đơn giản, quen thuộc: use > utilize, now > at this point in time.' },
]);

const c3 = doc('wda201-3-1-structure', '3.1 — Structuring digital content|||3.1 — Cấu trúc nội dung số',
  'Kim tự tháp ngược (bottom line up front); heading mô tả; bullet; chunking; đoạn ngắn.',
  [[
    `<span class="eyebrow">WDA201 · Chapter 3 · Lesson 3.1</span>
<h2>Structuring digital content</h2>
<h3>The inverted pyramid</h3>
<p>Journalists put the <strong>most important information first</strong>, then supporting detail, then background. On the web this is essential: a reader who quits after one paragraph should still get the point. Lead with the answer — the &quot;bottom line up front.&quot;</p>
<h3>Headings, bullets &amp; chunking</h3>
<ul>
<li><strong>Descriptive headings</strong> — a reader scanning only headings should understand the page.</li>
<li><strong>Chunking</strong> — break content into labelled blocks; one idea per paragraph.</li>
<li><strong>Bullets</strong> — for lists, steps and options; parallel grammar, short items.</li>
<li><strong>Short paragraphs</strong> — 2–3 sentences; white space is a feature, not waste.</li>
</ul>
<h3>Before &amp; after — structure a help answer</h3>
<pre><code>BEFORE: one dense paragraph explaining history, then the fix.
AFTER:
 To refund an order:
 1. Open Orders and pick the order.
 2. Tap Refund.
 3. Choose a reason and confirm.
 Refunds arrive in 3–5 business days.</code></pre>
<div class="callout"><span class="badge">Bottom line up front</span> Ask: &quot;If the reader stops after line one, did they get what they came for?&quot;</div>`,
    `<span class="eyebrow">WDA201 · Chương 3 · Bài 3.1</span>
<h2>Cấu trúc nội dung số</h2>
<h3>Kim tự tháp ngược</h3>
<p>Nhà báo đặt <strong>thông tin quan trọng nhất lên đầu</strong>, rồi chi tiết bổ trợ, rồi bối cảnh. Trên web điều này bắt buộc: người đọc bỏ đi sau một đoạn vẫn phải nắm được ý chính. Dẫn bằng câu trả lời — &quot;kết luận đặt trước.&quot;</p>
<h3>Heading, bullet &amp; chunking</h3>
<ul>
<li><strong>Heading mô tả</strong> — người chỉ quét heading vẫn hiểu được trang.</li>
<li><strong>Chunking</strong> — chia nội dung thành khối có nhãn; mỗi đoạn một ý.</li>
<li><strong>Bullet</strong> — cho danh sách, bước, lựa chọn; ngữ pháp song song, mục ngắn.</li>
<li><strong>Đoạn ngắn</strong> — 2–3 câu; khoảng trắng là tính năng, không phải lãng phí.</li>
</ul>
<h3>Trước &amp; sau — cấu trúc một câu trả lời trợ giúp</h3>
<pre><code>TRƯỚC: một đoạn dày kể lịch sử, rồi mới tới cách làm.
SAU:
 Để hoàn tiền một đơn:
 1. Mở Đơn hàng và chọn đơn.
 2. Nhấn Hoàn tiền.
 3. Chọn lý do và xác nhận.
 Tiền về sau 3–5 ngày làm việc.</code></pre>
<div class="callout"><span class="badge">Kết luận đặt trước</span> Hãy hỏi: &quot;Nếu người đọc dừng sau dòng đầu, họ đã có thứ cần tìm chưa?&quot;</div>`,
  ]]);

const c3q = quiz('wda201-quiz-3', 'Quiz 3 — Structure|||Quiz 3 — Cấu trúc nội dung', [
  { id: 'q1', question: '"Kim tự tháp ngược" (inverted pyramid) nghĩa là?', options: ['Kết luận để cuối bài', 'Thông tin quan trọng nhất đặt lên đầu', 'Viết từ dưới lên', 'Chỉ dùng cho thơ'], correctIndex: 1, explanation: 'Ý chính trước, chi tiết sau, bối cảnh cuối — người bỏ giữa chừng vẫn nắm ý.' },
  { id: 'q2', question: '"Chunking" là kỹ thuật gì?', options: ['Viết một đoạn thật dài', 'Chia nội dung thành khối nhỏ có nhãn, mỗi đoạn một ý', 'Xoá hết heading', 'Dùng phông chữ lớn'], correctIndex: 1, explanation: 'Chia nhỏ + gắn nhãn giúp người đọc quét và định vị nhanh.' },
  { id: 'q3', question: 'Heading tốt trên web nên?', options: ['Chung chung như "Giới thiệu"', 'Mô tả rõ nội dung để người quét heading vẫn hiểu trang', 'Càng dài càng tốt', 'Giống hệt nhau'], correctIndex: 1, explanation: 'Heading mô tả cho phép đọc lướt chỉ qua các heading vẫn nắm được bài.' },
]);

const c4 = doc('wda201-4-1-web-ux-writing', '4.1 — Writing for the web & UX|||4.1 — Viết cho web & UX writing',
  'Web copy; microcopy; CTA; nhãn nút; thông báo lỗi hữu ích (nói rõ chuyện gì + cách sửa).',
  [[
    `<span class="eyebrow">WDA201 · Chapter 4 · Lesson 4.1</span>
<h2>Writing for the web &amp; UX</h2>
<h3>Microcopy: the tiny words that guide</h3>
<p><strong>UX writing</strong> is the words inside a product — buttons, labels, hints, empty states and error messages. Small strings, huge impact: good microcopy removes doubt and keeps people moving.</p>
<h3>CTAs &amp; button labels</h3>
<ul>
<li><strong>Say what happens</strong> — &quot;Create account&quot; beats &quot;Submit&quot;; &quot;Start free trial&quot; beats &quot;Click here.&quot;</li>
<li><strong>Start with a verb</strong> and match the user's goal, not the system's.</li>
</ul>
<h3>Error messages that help</h3>
<p>A good error says <strong>what happened</strong>, <strong>why</strong>, and <strong>how to fix it</strong> — with no blame and no jargon.</p>
<pre><code>BEFORE: "Error 403: invalid input."
AFTER:  "That password is too short.
         Use at least 8 characters."</code></pre>
<div class="callout"><span class="badge">Button test</span> Read the label alone, out of context. If it doesn't say what tapping it does, rewrite it.</div>`,
    `<span class="eyebrow">WDA201 · Chương 4 · Bài 4.1</span>
<h2>Viết cho web &amp; UX writing</h2>
<h3>Microcopy: chữ nhỏ dẫn đường</h3>
<p><strong>UX writing</strong> là chữ nằm trong sản phẩm — nút, nhãn, gợi ý, trạng thái rỗng và thông báo lỗi. Chuỗi nhỏ, tác động lớn: microcopy tốt gỡ nghi ngờ và giữ người dùng tiếp tục.</p>
<h3>CTA &amp; nhãn nút</h3>
<ul>
<li><strong>Nói rõ điều sẽ xảy ra</strong> — &quot;Tạo tài khoản&quot; hơn &quot;Gửi&quot;; &quot;Dùng thử miễn phí&quot; hơn &quot;Bấm vào đây.&quot;</li>
<li><strong>Bắt đầu bằng động từ</strong> và bám mục tiêu người dùng, không phải của hệ thống.</li>
</ul>
<h3>Thông báo lỗi biết giúp</h3>
<p>Một lỗi tốt nói rõ <strong>chuyện gì xảy ra</strong>, <strong>vì sao</strong>, và <strong>cách sửa</strong> — không đổ lỗi, không thuật ngữ.</p>
<pre><code>TRƯỚC: "Lỗi 403: dữ liệu không hợp lệ."
SAU:   "Mật khẩu quá ngắn.
        Hãy dùng ít nhất 8 ký tự."</code></pre>
<div class="callout"><span class="badge">Phép thử nút</span> Đọc riêng nhãn nút, tách khỏi ngữ cảnh. Nếu nó không nói rõ bấm vào sẽ làm gì, hãy viết lại.</div>`,
  ]]);

const c4q = quiz('wda201-quiz-4', 'Quiz 4 — Web & UX writing|||Quiz 4 — Web & UX writing', [
  { id: 'q1', question: 'Nhãn nút nào là UX writing tốt?', options: ['Submit', 'Click here', 'Tạo tài khoản', 'OK'], correctIndex: 2, explanation: 'Nhãn nên bắt đầu bằng động từ và nói rõ điều sẽ xảy ra.' },
  { id: 'q2', question: 'Một thông báo lỗi tốt cần có gì?', options: ['Mã lỗi và thuật ngữ kỹ thuật', 'Chuyện gì xảy ra + vì sao + cách sửa, không đổ lỗi', 'Chỉ ghi "Error"', 'Đổ lỗi cho người dùng'], correctIndex: 1, explanation: 'Nói rõ vấn đề và hướng dẫn cách khắc phục, giọng không trách móc.' },
  { id: 'q3', question: '"Microcopy" là gì?', options: ['Bài blog dài', 'Những chuỗi chữ nhỏ trong sản phẩm: nút, nhãn, gợi ý, lỗi', 'Cỡ chữ nhỏ', 'Tên miền'], correctIndex: 1, explanation: 'Microcopy = chữ trong giao diện, nhỏ nhưng ảnh hưởng lớn tới trải nghiệm.' },
]);

const c5 = doc('wda201-5-1-social-media', '5.1 — Writing for social media|||5.1 — Viết cho mạng xã hội',
  'Đặc thù từng nền tảng; hook 1 giây; hashtag; caption; thread (chuỗi bài).',
  [[
    `<span class="eyebrow">WDA201 · Chapter 5 · Lesson 5.1</span>
<h2>Writing for social media</h2>
<h3>Every platform is its own language</h3>
<p>The same idea is written differently on LinkedIn, X/Twitter, Instagram and TikTok. Match the platform's length, tone and format — but everywhere the first line is the <strong>hook</strong> that decides whether anyone reads on.</p>
<h3>Hooks, captions &amp; hashtags</h3>
<ul>
<li><strong>Hook</strong> — the first line must earn the second; ask a question, state a bold result, or open a loop.</li>
<li><strong>Caption</strong> — one clear idea, a human voice, and a single call to action.</li>
<li><strong>Hashtags</strong> — a few relevant ones for discovery; not a wall of tags.</li>
<li><strong>Thread</strong> — one point per post, each line pulling to the next.</li>
</ul>
<h3>Before &amp; after — a launch post</h3>
<pre><code>BEFORE: "We are excited to announce the release of our new
         feature which we have been working on for months."
AFTER:  "You asked for dark mode. It's live today. 🌙
         Here's how to turn it on (3 taps) —"</code></pre>
<div class="callout"><span class="badge">One-second rule</span> If the first line doesn't stop the scroll, nothing after it matters.</div>`,
    `<span class="eyebrow">WDA201 · Chương 5 · Bài 5.1</span>
<h2>Viết cho mạng xã hội</h2>
<h3>Mỗi nền tảng là một ngôn ngữ riêng</h3>
<p>Cùng một ý được viết khác nhau trên LinkedIn, X/Twitter, Instagram và TikTok. Bám độ dài, giọng và định dạng của nền tảng — nhưng ở đâu thì dòng đầu tiên cũng là <strong>hook</strong> quyết định người ta có đọc tiếp không.</p>
<h3>Hook, caption &amp; hashtag</h3>
<ul>
<li><strong>Hook</strong> — dòng đầu phải &quot;câu&quot; được dòng hai; đặt câu hỏi, nêu kết quả gây sốc, hoặc mở một vòng tò mò.</li>
<li><strong>Caption</strong> — một ý rõ, giọng người thật, và một lời kêu gọi hành động duy nhất.</li>
<li><strong>Hashtag</strong> — vài thẻ liên quan để dễ tìm; đừng dán một bức tường thẻ.</li>
<li><strong>Thread (chuỗi bài)</strong> — mỗi bài một ý, mỗi dòng kéo sang dòng sau.</li>
</ul>
<h3>Trước &amp; sau — bài ra mắt</h3>
<pre><code>TRƯỚC: "Chúng tôi vô cùng hào hứng thông báo ra mắt tính năng
        mới mà chúng tôi đã làm việc suốt nhiều tháng qua."
SAU:   "Bạn đã xin chế độ tối. Hôm nay có rồi. 🌙
        Bật lên thế nào (3 chạm) —"</code></pre>
<div class="callout"><span class="badge">Quy tắc một giây</span> Nếu dòng đầu không chặn được ngón tay đang lướt, mọi thứ phía sau đều vô nghĩa.</div>`,
  ]]);

const c5q = quiz('wda201-quiz-5', 'Quiz 5 — Social media|||Quiz 5 — Mạng xã hội', [
  { id: 'q1', question: 'Vai trò của "hook" (dòng đầu) trong bài mạng xã hội?', options: ['Trang trí cho đẹp', 'Chặn cú lướt và khiến người ta đọc tiếp', 'Chèn hashtag', 'Không quan trọng'], correctIndex: 1, explanation: 'Dòng đầu quyết định người ta dừng lại hay lướt qua.' },
  { id: 'q2', question: 'Cách dùng hashtag hợp lý là?', options: ['Càng nhiều thẻ càng tốt', 'Vài thẻ liên quan để dễ được tìm thấy', 'Không bao giờ dùng', 'Chỉ dùng thẻ tiếng Anh'], correctIndex: 1, explanation: 'Một vài hashtag đúng chủ đề giúp khám phá; tường thẻ gây rối.' },
  { id: 'q3', question: 'Nguyên tắc viết một "thread" (chuỗi bài) tốt?', options: ['Nhồi mọi ý vào một bài', 'Mỗi bài một ý, mỗi dòng kéo sang dòng sau', 'Viết ngẫu nhiên', 'Chỉ đăng ảnh'], correctIndex: 1, explanation: 'Mỗi post một điểm rõ, tạo mạch kéo người đọc đi tiếp.' },
]);

const c6 = doc('wda201-6-1-email-newsletter', '6.1 — Email & newsletters|||6.1 — Viết email & newsletter',
  'Subject line; preheader; thân email; CTA duy nhất; cá nhân hoá.',
  [[
    `<span class="eyebrow">WDA201 · Chapter 6 · Lesson 6.1</span>
<h2>Email &amp; newsletters</h2>
<h3>The subject line does 80% of the work</h3>
<p>An email is only opened if the <strong>subject line</strong> earns the click, and the <strong>preheader</strong> (the preview snippet) backs it up. Keep the subject short, specific and honest — clickbait that under-delivers kills trust and open rates.</p>
<h3>Body &amp; a single CTA</h3>
<ul>
<li><strong>One goal per email</strong> — decide the single action you want, then cut everything that doesn't serve it.</li>
<li><strong>Front-load the value</strong> — the reason to care goes above the fold.</li>
<li><strong>One primary CTA</strong> — a clear button; secondary links stay quiet.</li>
<li><strong>Personalize with meaning</strong> — relevance beats a first-name token.</li>
</ul>
<h3>Before &amp; after — subject + preheader</h3>
<pre><code>BEFORE subject: "Newsletter #42"
AFTER  subject: "3 writing tips you can use today"
       preheader: "Plus the before/after that made a page 2× clearer."</code></pre>
<div class="callout"><span class="badge">One-thing rule</span> If you can't name the single action you want the reader to take, the email isn't ready to send.</div>`,
    `<span class="eyebrow">WDA201 · Chương 6 · Bài 6.1</span>
<h2>Viết email &amp; newsletter</h2>
<h3>Dòng chủ đề làm 80% việc</h3>
<p>Email chỉ được mở nếu <strong>subject line (dòng chủ đề)</strong> đáng để bấm, và <strong>preheader</strong> (đoạn xem trước) tiếp sức cho nó. Giữ subject ngắn, cụ thể và trung thực — giật tít mà nội dung không xứng sẽ giết niềm tin và tỉ lệ mở.</p>
<h3>Thân email &amp; một CTA duy nhất</h3>
<ul>
<li><strong>Mỗi email một mục tiêu</strong> — chọn một hành động duy nhất, rồi cắt mọi thứ không phục vụ nó.</li>
<li><strong>Đưa giá trị lên đầu</strong> — lý do để quan tâm nằm trên &quot;nếp gấp&quot; (above the fold).</li>
<li><strong>Một CTA chính</strong> — một nút rõ ràng; các liên kết phụ đứng im lặng.</li>
<li><strong>Cá nhân hoá có ý nghĩa</strong> — sự liên quan quan trọng hơn việc chèn tên.</li>
</ul>
<h3>Trước &amp; sau — subject + preheader</h3>
<pre><code>TRƯỚC subject: "Bản tin số 42"
SAU   subject: "3 mẹo viết bạn dùng được ngay hôm nay"
      preheader: "Kèm ví dụ sửa trước/sau giúp một trang rõ gấp đôi."</code></pre>
<div class="callout"><span class="badge">Quy tắc một-việc</span> Nếu bạn không gọi tên được hành động duy nhất muốn người đọc làm, email chưa sẵn sàng gửi.</div>`,
  ]]);

const c6q = quiz('wda201-quiz-6', 'Quiz 6 — Email & newsletter|||Quiz 6 — Email & newsletter', [
  { id: 'q1', question: 'Yếu tố nào quyết định email có được MỞ hay không?', options: ['Màu nút', 'Dòng chủ đề (subject line) + preheader', 'Số hình ảnh', 'Độ dài chân trang'], correctIndex: 1, explanation: 'Subject + preheader là thứ người nhận thấy trước khi mở.' },
  { id: 'q2', question: 'Mỗi email nên có bao nhiêu CTA chính?', options: ['Càng nhiều càng tốt', 'Một CTA chính rõ ràng', 'Không cần CTA', 'Ít nhất năm'], correctIndex: 1, explanation: 'Một mục tiêu, một hành động chính; liên kết phụ giữ yên.' },
  { id: 'q3', question: 'Cá nhân hoá email hiệu quả nhất là?', options: ['Chèn tên người nhận là đủ', 'Nội dung liên quan tới nhu cầu người nhận', 'Viết dài hơn', 'Dùng nhiều emoji'], correctIndex: 1, explanation: 'Sự liên quan (relevance) mạnh hơn một "token" tên gọi.' },
]);

const c7 = doc('wda201-7-1-seo-writing', '7.1 — SEO & writing to be found|||7.1 — SEO & viết được tìm thấy',
  'Từ khoá tự nhiên; title & meta description; readability; cấu trúc theo chủ đề (topic).',
  [[
    `<span class="eyebrow">WDA201 · Chapter 7 · Lesson 7.1</span>
<h2>SEO &amp; writing to be found</h2>
<h3>Write for humans, structured for search</h3>
<p>SEO is not tricking Google — it's making a genuinely useful page that search engines can understand. Start from the <strong>question a reader types</strong>, answer it clearly, and use keywords <strong>naturally</strong>. Keyword-stuffing reads badly and now hurts rankings.</p>
<h3>Title, meta &amp; structure</h3>
<ul>
<li><strong>Title tag</strong> — the clickable headline in results; put the main keyword near the front, keep it honest.</li>
<li><strong>Meta description</strong> — a 1–2 sentence pitch for the click (~150 chars); it's your ad copy in the results.</li>
<li><strong>Headings (H1–H3)</strong> — structure the page around one topic and its subtopics.</li>
<li><strong>Readability</strong> — short sentences and scannable structure help both people and search.</li>
</ul>
<h3>Before &amp; after — a page title</h3>
<pre><code>BEFORE: "Home | Welcome to our blog"
AFTER:  "How to write a meta description (with examples)"</code></pre>
<div class="callout"><span class="badge">Search intent first</span> Match what the searcher actually wants — how-to, definition, or comparison — and give it in the first screen.</div>`,
    `<span class="eyebrow">WDA201 · Chương 7 · Bài 7.1</span>
<h2>SEO &amp; viết được tìm thấy</h2>
<h3>Viết cho người, cấu trúc cho máy tìm</h3>
<p>SEO không phải &quot;lừa&quot; Google — mà là làm ra một trang thực sự hữu ích để công cụ tìm kiếm hiểu được. Bắt đầu từ <strong>câu hỏi người đọc gõ</strong>, trả lời rõ ràng, và dùng từ khoá <strong>tự nhiên</strong>. Nhồi từ khoá đọc dở và nay còn bị hạ hạng.</p>
<h3>Title, meta &amp; cấu trúc</h3>
<ul>
<li><strong>Thẻ title</strong> — tiêu đề bấm được trong kết quả; đặt từ khoá chính gần đầu, giữ trung thực.</li>
<li><strong>Meta description</strong> — 1–2 câu chào mời cú bấm (~150 ký tự); đây là &quot;lời quảng cáo&quot; trong kết quả.</li>
<li><strong>Heading (H1–H3)</strong> — cấu trúc trang quanh một chủ đề và các chủ đề con.</li>
<li><strong>Readability</strong> — câu ngắn và bố cục dễ quét giúp cả người lẫn máy tìm.</li>
</ul>
<h3>Trước &amp; sau — tiêu đề trang</h3>
<pre><code>TRƯỚC: "Trang chủ | Chào mừng đến blog của chúng tôi"
SAU:   "Cách viết meta description (có ví dụ)"</code></pre>
<div class="callout"><span class="badge">Ý định tìm kiếm trước</span> Bám đúng thứ người tìm thực sự muốn — hướng dẫn, định nghĩa, hay so sánh — và đưa ngay ở màn hình đầu.</div>`,
  ]]);

const c7q = quiz('wda201-quiz-7', 'Quiz 7 — SEO writing|||Quiz 7 — SEO & viết được tìm thấy', [
  { id: 'q1', question: 'Cách dùng từ khoá đúng cho SEO là?', options: ['Nhồi càng nhiều lần càng tốt', 'Dùng tự nhiên, bám câu hỏi người đọc gõ', 'Giấu chữ trắng trên nền trắng', 'Không bao giờ dùng từ khoá'], correctIndex: 1, explanation: 'Từ khoá tự nhiên + nội dung hữu ích; nhồi từ khoá bị hạ hạng.' },
  { id: 'q2', question: '"Meta description" dùng để làm gì?', options: ['Là mật khẩu trang', 'Đoạn 1–2 câu chào mời cú bấm hiển thị trong kết quả tìm kiếm', 'Đếm số từ', 'Đặt màu nền'], correctIndex: 1, explanation: 'Meta description như "lời quảng cáo" thuyết phục người ta bấm vào.' },
  { id: 'q3', question: '"Search intent" (ý định tìm kiếm) nghĩa là?', options: ['Tốc độ tải trang', 'Thứ người tìm thực sự muốn: hướng dẫn, định nghĩa hay so sánh', 'Số backlink', 'Kích thước ảnh'], correctIndex: 1, explanation: 'Khớp đúng nhu cầu người tìm và trả lời ngay ở màn hình đầu.' },
]);

const c8 = doc('wda201-8-1-voice-ethics-ai', '8.1 — Voice, ethics & AI|||8.1 — Giọng điệu, đạo đức & AI',
  'Brand voice vs tone; viết toàn diện (inclusive); trung thực/sự thật; dùng AI hỗ trợ viết có trách nhiệm.',
  [[
    `<span class="eyebrow">WDA201 · Chapter 8 · Lesson 8.1</span>
<h2>Voice, ethics &amp; AI</h2>
<h3>Voice vs. tone</h3>
<p><strong>Voice</strong> is your consistent personality — it doesn't change. <strong>Tone</strong> shifts with the situation: playful in a welcome, calm in an error, serious in a security notice. A short voice chart (&quot;we are: friendly, clear, honest; we are not: hype-y, stiff&quot;) keeps a team consistent.</p>
<h3>Inclusive &amp; truthful writing</h3>
<ul>
<li><strong>Inclusive</strong> — plain, respectful language; avoid jargon, idioms and assumptions that exclude readers.</li>
<li><strong>Truthful</strong> — never invent facts, numbers or reviews; back claims and cite sources.</li>
<li><strong>Accessible</strong> — descriptive links and alt text so everyone can read.</li>
</ul>
<h3>Using AI responsibly</h3>
<p>AI is a drafting assistant, not an author of record. Use it to brainstorm, restructure and tighten — then <strong>you verify every fact</strong>, keep the brand voice, and take responsibility. AI confidently invents details (&quot;hallucinates&quot;); an unchecked number can be flatly wrong.</p>
<div class="callout"><span class="badge">The human check</span> Ship nothing you haven't read, verified and could defend. AI drafts; you decide.</div>`,
    `<span class="eyebrow">WDA201 · Chương 8 · Bài 8.1</span>
<h2>Giọng điệu, đạo đức &amp; AI</h2>
<h3>Voice vs tone</h3>
<p><strong>Voice (giọng thương hiệu)</strong> là cá tính nhất quán — nó không đổi. <strong>Tone (sắc thái)</strong> thay đổi theo tình huống: vui vẻ khi chào mừng, điềm tĩnh khi báo lỗi, nghiêm túc khi cảnh báo bảo mật. Một bảng voice ngắn (&quot;chúng tôi: thân thiện, rõ ràng, trung thực; không: khoa trương, cứng nhắc&quot;) giữ cả nhóm nhất quán.</p>
<h3>Viết toàn diện &amp; trung thực</h3>
<ul>
<li><strong>Toàn diện (inclusive)</strong> — ngôn ngữ giản dị, tôn trọng; tránh thuật ngữ, thành ngữ và giả định loại trừ người đọc.</li>
<li><strong>Trung thực</strong> — không bịa sự thật, con số hay đánh giá; dẫn chứng và trích nguồn cho mọi khẳng định.</li>
<li><strong>Dễ tiếp cận</strong> — liên kết mô tả rõ và văn bản thay thế (alt text) để ai cũng đọc được.</li>
</ul>
<h3>Dùng AI có trách nhiệm</h3>
<p>AI là trợ lý soạn nháp, không phải tác giả chịu trách nhiệm. Dùng nó để nảy ý, sắp lại và cô đọng — rồi <strong>bạn kiểm chứng từng sự thật</strong>, giữ giọng thương hiệu, và chịu trách nhiệm. AI tự tin bịa chi tiết (&quot;ảo giác&quot;); một con số không kiểm có thể sai hoàn toàn.</p>
<div class="callout"><span class="badge">Chốt của con người</span> Đừng đăng thứ bạn chưa đọc, chưa kiểm và không thể bảo vệ. AI soạn nháp; bạn quyết định.</div>`,
  ]]);

const c8q = quiz('wda201-quiz-8', 'Quiz 8 — Voice, ethics & AI|||Quiz 8 — Giọng điệu, đạo đức & AI', [
  { id: 'q1', question: 'Khác biệt giữa "voice" và "tone"?', options: ['Giống hệt nhau', 'Voice là cá tính nhất quán, tone thay đổi theo tình huống', 'Tone không bao giờ đổi', 'Voice chỉ dùng cho quảng cáo'], correctIndex: 1, explanation: 'Voice cố định; tone điều chỉnh theo bối cảnh (chào mừng, báo lỗi...).' },
  { id: 'q2', question: 'Nguyên tắc đạo đức cốt lõi khi viết số là?', options: ['Bịa con số cho hấp dẫn', 'Trung thực: không bịa sự thật/số liệu, có dẫn nguồn', 'Giấu nguồn', 'Sao chép không ghi công'], correctIndex: 1, explanation: 'Trung thực và trích nguồn giữ được niềm tin của người đọc.' },
  { id: 'q3', question: 'Dùng AI hỗ trợ viết có trách nhiệm nghĩa là?', options: ['Đăng thẳng bản AI viết không đọc lại', 'Dùng AI để soạn nháp nhưng người phải kiểm chứng mọi sự thật', 'Để AI chịu trách nhiệm', 'Không bao giờ dùng AI'], correctIndex: 1, explanation: 'AI có thể "ảo giác" bịa chi tiết — con người kiểm chứng và chịu trách nhiệm cuối.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'WDA201',
    slug: 'wda201-writing-in-the-digital-age',
    title: 'Writing in the Digital age',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/WDA201.webp',
    shortDescription: 'Write for screens, not paper — scannable structure (inverted pyramid, F-pattern), plain clear language, UX microcopy, social, email, SEO & responsible AI. Bilingual, with before/after rewrites & quizzes.|||Viết cho màn hình, không phải giấy — cấu trúc dễ quét (kim tự tháp ngược, F-pattern), ngôn ngữ rõ ràng, microcopy UX, mạng xã hội, email, SEO & AI có trách nhiệm. Song ngữ, có ví dụ sửa trước/sau & quiz.',
    description: 'Môn <strong>WDA201 — Writing in the Digital Age (Viết trong thời đại số)</strong> thuộc khối Công nghệ Truyền thông. Bạn học viết nội dung số mà người đọc thực sự đọc hết và hành động theo: từ <strong>hiểu cách người ta đọc trên màn hình</strong> (quét, F-pattern) → <strong>ngôn ngữ rõ ràng, plain</strong> → <strong>cấu trúc nội dung</strong> (kim tự tháp ngược, heading, bullet, chunking) → áp dụng theo kênh: <strong>web &amp; UX writing</strong>, <strong>mạng xã hội</strong>, <strong>email &amp; newsletter</strong>, <strong>SEO</strong> → và <strong>giọng điệu, đạo đức &amp; dùng AI có trách nhiệm</strong>. Bám sách chuẩn quốc tế (Handley, Redish, Nielsen Norman Group, Strunk &amp; White, Purdue OWL), song ngữ, có ví dụ sửa trước/sau và quiz mỗi chương.',
    whatYouLearn: 'Cách người ta đọc trên màn hình (F-pattern, scannability); viết rõ - ngắn - đúng, câu chủ động, plain language, cắt từ thừa; kim tự tháp ngược, heading, bullet, chunking; web copy & UX microcopy (CTA, nút, thông báo lỗi); viết mạng xã hội (hook, hashtag, caption, thread); email & newsletter (subject, preheader, CTA, cá nhân hoá); SEO (từ khoá tự nhiên, title/meta, readability, cấu trúc chủ đề); brand voice & tone, viết toàn diện, trung thực, và dùng AI hỗ trợ viết có trách nhiệm.',
    requirements: 'Trình độ tiếng Anh & tiếng Việt cơ bản để viết. Không cần nền kỹ thuật. Xem điều kiện tiên quyết trong khung chương trình khối Công nghệ Truyền thông trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, NN/g, Purdue OWL, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao viết số khác viết giấy; người đọc quét chứ không đọc; lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Viết số vs truyền thống|||Chapter 1 — Digital vs. print', description: 'Đọc trên màn hình, F-pattern, scannability, người đọc thiếu kiên nhẫn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Viết rõ ràng|||Chapter 2 — Clear writing', description: 'Rõ-ngắn-đúng, câu chủ động, plain language, cắt từ thừa.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cấu trúc nội dung số|||Chapter 3 — Structuring content', description: 'Kim tự tháp ngược, heading, bullet, chunking, đoạn ngắn.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Web & UX writing|||Chapter 4 — Web & UX', description: 'Web copy, microcopy, CTA, nút, thông báo lỗi.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mạng xã hội|||Chapter 5 — Social media', description: 'Đặc thù nền tảng, hook, hashtag, caption, thread.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Email & newsletter|||Chapter 6 — Email & newsletter', description: 'Subject line, preheader, thân, CTA, cá nhân hoá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — SEO & viết được tìm thấy|||Chapter 7 — SEO', description: 'Từ khoá tự nhiên, title/meta, readability, cấu trúc chủ đề.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Giọng điệu, đạo đức & AI|||Chapter 8 — Voice, ethics & AI', description: 'Brand voice/tone, toàn diện, sự thật, AI có trách nhiệm.', lessons: [c8, c8q] },
  ],
};
