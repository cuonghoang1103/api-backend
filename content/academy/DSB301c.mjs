/**
 * DSB301c — Digital Storytelling for Brands (Kể chuyện số cho thương hiệu).
 * Khối Công nghệ Truyền thông, FPTU, Kỳ 4. Môn KHÔNG có FLM syllabus →
 * dựng theo giáo trình chuẩn quốc tế: "Building a StoryBrand" (Donald Miller),
 * "Contagious: Why Things Catch On" (Jonah Berger), Content Marketing Institute,
 * HubSpot Academy; công cụ Canva/CapCut/Adobe. 8 chương, song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dsb301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền (StoryBrand, Contagious), tài liệu miễn phí (Content Marketing Institute, HubSpot), công cụ (Canva, CapCut, Adobe), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DSB301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to tell brand stories on digital channels — from the craft of narrative to shipping real video, social and blog content. This course has no FPTU FLM syllabus, so it is built on <strong>international best-practice sources</strong>.</p>
<h3>📘 Core books</h3>
<ul>
<li><a href="https://storybrand.com/" target="_blank" rel="noopener"><em>Building a StoryBrand</em> — Donald Miller</a> (the SB7 framework: brand as guide, customer as hero)</li>
<li><a href="https://jonahberger.com/books/contagious/" target="_blank" rel="noopener"><em>Contagious: Why Things Catch On</em> — Jonah Berger</a> (the STEPPS model of shareable content)</li>
</ul>
<h3>🌐 Free learning</h3>
<ul>
<li><a href="https://contentmarketinginstitute.com/" target="_blank" rel="noopener">Content Marketing Institute</a> — strategy, examples, research</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — free courses on content, social &amp; storytelling</li>
<li><a href="https://blog.google/products/ads-commerce/" target="_blank" rel="noopener">Think with Google</a> — platform insights &amp; campaign case studies</li>
</ul>
<h3>🛠️ Production tools</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — graphics, social posts, simple video</li>
<li><a href="https://www.capcut.com/" target="_blank" rel="noopener">CapCut</a> — mobile-first video &amp; reels editing</li>
<li><a href="https://www.adobe.com/creativecloud.html" target="_blank" rel="noopener">Adobe Creative Cloud</a> — Premiere, Photoshop, Express</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>Understand story</strong> — why stories beat facts; hero's journey &amp; StoryBrand SB7.</li>
<li><strong>Find the voice</strong> — brand persona, archetype, one message across every format.</li>
<li><strong>Make &amp; spread</strong> — produce for video/social/blog/podcast; apply STEPPS; publish across owned/earned/paid.</li>
<li><strong>Measure &amp; improve</strong> — read engagement/reach, run A/B tests, tie storytelling to ROI.</li>
</ol></div>`,
    `<span class="eyebrow">DSB301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để kể chuyện thương hiệu trên kênh số — từ nghệ thuật kể chuyện đến việc xuất bản video, bài social và blog thật. Môn này KHÔNG có syllabus FLM, nên được dựng theo <strong>nguồn chuẩn quốc tế</strong>.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><a href="https://storybrand.com/" target="_blank" rel="noopener"><em>Building a StoryBrand</em> — Donald Miller</a> (khung SB7: thương hiệu là người dẫn, khách hàng là anh hùng)</li>
<li><a href="https://jonahberger.com/books/contagious/" target="_blank" rel="noopener"><em>Contagious: Why Things Catch On</em> — Jonah Berger</a> (mô hình STEPPS của nội dung dễ lan truyền)</li>
</ul>
<h3>🌐 Học miễn phí</h3>
<ul>
<li><a href="https://contentmarketinginstitute.com/" target="_blank" rel="noopener">Content Marketing Institute</a> — chiến lược, ví dụ, nghiên cứu</li>
<li><a href="https://academy.hubspot.com/" target="_blank" rel="noopener">HubSpot Academy</a> — khoá miễn phí về content, social &amp; kể chuyện</li>
<li><a href="https://blog.google/products/ads-commerce/" target="_blank" rel="noopener">Think with Google</a> — hiểu nền tảng &amp; case study chiến dịch</li>
</ul>
<h3>🛠️ Công cụ sản xuất</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — đồ hoạ, bài social, video đơn giản</li>
<li><a href="https://www.capcut.com/" target="_blank" rel="noopener">CapCut</a> — dựng video &amp; reels ưu tiên điện thoại</li>
<li><a href="https://www.adobe.com/creativecloud.html" target="_blank" rel="noopener">Adobe Creative Cloud</a> — Premiere, Photoshop, Express</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Hiểu câu chuyện</strong> — vì sao chuyện thắng dữ kiện; hero's journey &amp; StoryBrand SB7.</li>
<li><strong>Tìm giọng nói</strong> — brand persona, archetype, một thông điệp xuyên mọi định dạng.</li>
<li><strong>Làm &amp; lan toả</strong> — sản xuất cho video/social/blog/podcast; áp dụng STEPPS; xuất bản qua owned/earned/paid.</li>
<li><strong>Đo &amp; tối ưu</strong> — đọc engagement/reach, chạy A/B, nối kể chuyện với ROI.</li>
</ol></div>`,
  ]]);

const intro = doc('dsb301c-0-1-overview', 'Course overview: Digital Storytelling for Brands|||Tổng quan: Kể chuyện số cho thương hiệu',
  'Kể chuyện số là gì; vì sao thương hiệu cần chuyện chứ không chỉ thông tin; lộ trình 8 chương: story → cấu trúc → nhân vật → định dạng → lan truyền → kênh → sản xuất → đo lường.',
  [[
    `<span class="eyebrow">DSB301c · Lesson 0.1 · Overview</span>
<h2>Digital Storytelling for Brands</h2>
<p class="lead">A brand is not a logo or a product spec — it is the <strong>story people tell themselves</strong> about you. This course teaches you to shape that story and carry it across digital channels: video, social, blog, podcast and reels.</p>
<h3>What is digital storytelling?</h3>
<p>It is using narrative — characters, conflict, transformation — to make a brand <em>understood, felt and remembered</em> on digital platforms. Not "here are our features", but "here is a person like you, this is what they wanted, and here is how they got it".</p>
<h3>Why brands need story</h3>
<ul>
<li><strong>Attention</strong> — story survives the scroll where a spec sheet dies.</li>
<li><strong>Memory</strong> — people forget statistics but retell stories.</li>
<li><strong>Trust &amp; meaning</strong> — a clear story tells customers you understand their problem.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Story &amp; brand → story structure (hero's journey, StoryBrand SB7) → character &amp; message → digital formats → viral content (STEPPS) → channels &amp; distribution → production → measurement &amp; optimisation. Bilingual, framework-driven, with real campaigns and a quiz each chapter.</p>`,
    `<span class="eyebrow">DSB301c · Bài 0.1 · Tổng quan</span>
<h2>Kể chuyện số cho thương hiệu</h2>
<p class="lead">Thương hiệu không phải logo hay bảng thông số — nó là <strong>câu chuyện người ta tự kể</strong> về bạn. Môn này dạy bạn định hình câu chuyện đó và mang nó qua các kênh số: video, social, blog, podcast và reels.</p>
<h3>Kể chuyện số là gì?</h3>
<p>Là dùng tự sự — nhân vật, xung đột, sự thay đổi — để thương hiệu được <em>hiểu, cảm và nhớ</em> trên nền tảng số. Không phải "đây là tính năng của chúng tôi", mà "đây là một người giống bạn, họ muốn gì, và họ đã đạt được ra sao".</p>
<h3>Vì sao thương hiệu cần chuyện</h3>
<ul>
<li><strong>Chú ý</strong> — câu chuyện sống sót qua cú lướt, còn bảng thông số thì chết.</li>
<li><strong>Ghi nhớ</strong> — người ta quên số liệu nhưng kể lại câu chuyện.</li>
<li><strong>Niềm tin &amp; ý nghĩa</strong> — một câu chuyện rõ ràng cho khách biết bạn hiểu vấn đề của họ.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Chuyện &amp; thương hiệu → cấu trúc chuyện (hero's journey, StoryBrand SB7) → nhân vật &amp; thông điệp → định dạng số → nội dung lan truyền (STEPPS) → kênh &amp; phân phối → sản xuất → đo lường &amp; tối ưu. Song ngữ, bám framework, có chiến dịch thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dsb301c-1-1-story-and-brand', '1.1 — Storytelling & the brand: why story beats fact|||1.1 — Kể chuyện & thương hiệu: vì sao chuyện thắng dữ kiện',
  'Câu chuyện là gì; "facts tell, stories sell"; narrative transportation; chuyện làm não tiết oxytocin & ghi nhớ gấp nhiều lần dữ kiện. Ví dụ: Dove Real Beauty, Nike.',
  [[
    `<span class="eyebrow">DSB301c · Chapter 1 · Lesson 1.1</span>
<h2>Storytelling &amp; the brand</h2>
<h3>Facts tell, stories sell</h3>
<p>A fact is processed in the language centres of the brain. A <strong>story</strong> lights up sensory and emotional regions too — the listener half-lives the events. This is called <strong>narrative transportation</strong>: when we are absorbed in a story, our guard drops and we are moved.</p>
<h3>Why story wins</h3>
<ul>
<li><strong>Emotion drives action</strong> — decisions are felt first, justified later. Story delivers the feeling.</li>
<li><strong>Meaning sticks</strong> — a message wrapped in a story is remembered far longer than a bullet point.</li>
<li><strong>Identity</strong> — people share stories that say something about <em>who they are</em>.</li>
</ul>
<h3>The shift: from what to why</h3>
<p>Weak marketing lists <em>what</em> a product does. Strong marketing tells <em>why it matters</em> to a real person. "0.5kg lighter" is a fact; "so you forget the backpack is even there on the last hour of the trail" is a story.</p>
<div class="callout"><span class="badge">Real campaign — Dove</span> Dove's <em>Real Beauty Sketches</em> did not list soap ingredients. It told a story — women describing themselves to a sketch artist, then hearing a stranger describe them more kindly — and became one of the most-watched ads ever, because it made viewers <em>feel</em> the brand's belief.</div>`,
    `<span class="eyebrow">DSB301c · Chương 1 · Bài 1.1</span>
<h2>Kể chuyện &amp; thương hiệu</h2>
<h3>Dữ kiện để thông báo, câu chuyện để thuyết phục</h3>
<p>Một dữ kiện được xử lý ở vùng ngôn ngữ của não. Một <strong>câu chuyện</strong> còn kích hoạt cả vùng cảm giác và cảm xúc — người nghe như sống một nửa trong sự việc. Hiện tượng này gọi là <strong>narrative transportation</strong> (được câu chuyện cuốn đi): khi đắm vào chuyện, hàng phòng thủ hạ xuống và ta bị lay động.</p>
<h3>Vì sao chuyện thắng</h3>
<ul>
<li><strong>Cảm xúc dẫn hành động</strong> — quyết định được cảm trước, biện minh sau. Câu chuyện mang lại cảm xúc đó.</li>
<li><strong>Ý nghĩa bám lại</strong> — thông điệp gói trong chuyện được nhớ lâu hơn nhiều so với gạch đầu dòng.</li>
<li><strong>Bản sắc</strong> — người ta chia sẻ những câu chuyện nói lên <em>họ là ai</em>.</li>
</ul>
<h3>Chuyển dịch: từ "cái gì" sang "vì sao"</h3>
<p>Marketing yếu liệt kê sản phẩm làm <em>gì</em>. Marketing mạnh kể <em>vì sao nó quan trọng</em> với một người thật. "Nhẹ hơn 0,5kg" là dữ kiện; "để đến giờ cuối trên đường mòn bạn quên mất là mình đang đeo balô" là câu chuyện.</p>
<div class="callout"><span class="badge">Chiến dịch thật — Dove</span> <em>Real Beauty Sketches</em> của Dove không liệt kê thành phần xà phòng. Nó kể một câu chuyện — phụ nữ tự tả mình cho hoạ sĩ ký hoạ, rồi nghe một người lạ tả họ đẹp hơn — và thành một trong những quảng cáo được xem nhiều nhất, vì khiến người xem <em>cảm</em> được niềm tin của thương hiệu.</div>`,
  ]]);

const c1q = quiz('dsb301c-quiz-1', 'Quiz 1 — Story & brand|||Quiz 1 — Chuyện & thương hiệu', [
  { id: 'q1', question: 'Vì sao câu chuyện thường thuyết phục hơn dữ kiện thuần?|||Why does a story usually persuade more than a bare fact?', options: ['Nó dài hơn nên có nhiều thông tin hơn|||It is longer so has more info', 'Nó kích hoạt cả vùng cảm xúc/cảm giác của não (narrative transportation)|||It also engages emotional/sensory brain regions (narrative transportation)', 'Nó luôn có số liệu chính xác hơn|||It always has more precise numbers', 'Nó không cần bằng chứng|||It needs no evidence'], correctIndex: 1, explanation: 'Câu chuyện cuốn người nghe vào (transportation), làm họ cảm và nhớ.' },
  { id: 'q2', question: 'Câu nào là "câu chuyện" chứ không phải "dữ kiện"?|||Which is a "story", not a "fact"?', options: ['Balô nặng 0,5kg|||The backpack weighs 0.5kg', 'Chống nước IPX7|||Waterproof IPX7 rated', 'Đến giờ cuối trên đường mòn, bạn quên mất mình đang đeo balô|||By the last hour of the trail you forget it is even there', 'Có 3 ngăn|||Has 3 compartments'], correctIndex: 2, explanation: 'Câu chuyện gắn lợi ích với trải nghiệm của một người thật, không chỉ nêu thông số.' },
  { id: 'q3', question: 'Chiến dịch Dove Real Beauty Sketches thắng nhờ điều gì?|||What made Dove Real Beauty Sketches work?', options: ['Liệt kê thành phần sản phẩm|||Listing product ingredients', 'Giá rẻ nhất thị trường|||Being the cheapest', 'Khiến người xem CẢM được niềm tin của thương hiệu qua câu chuyện|||Making viewers FEEL the brand belief through a story', 'Quảng cáo trên nhiều kênh truyền hình|||Buying lots of TV airtime'], correctIndex: 2, explanation: 'Không bán tính năng; nó kể chuyện để người xem cảm được giá trị thương hiệu.' },
]);

const c2 = doc('dsb301c-2-1-story-structure', '2.1 — Story structure: hero\'s journey & StoryBrand SB7|||2.1 — Cấu trúc chuyện: hero\'s journey & StoryBrand SB7',
  'Hero\'s journey rút gọn; khung StoryBrand SB7 (Miller): khách là ANH HÙNG, thương hiệu là NGƯỜI DẪN (guide) — 7 phần: nhân vật, vấn đề, guide, kế hoạch, kêu gọi, thành công, thất bại. Ví dụ: Apple.',
  [[
    `<span class="eyebrow">DSB301c · Chapter 2 · Lesson 2.1</span>
<h2>Story structure</h2>
<h3>The hero's journey (condensed)</h3>
<p>Most enduring stories share a shape: a <strong>hero</strong> in an ordinary world faces a <strong>problem</strong>, meets a <strong>guide</strong>, gets a <strong>plan</strong>, takes <strong>action</strong>, and reaches <strong>transformation</strong>. Brands borrow this spine to structure their message.</p>
<h3>The StoryBrand SB7 framework</h3>
<p>Donald Miller's core insight: <strong>the customer is the hero, not the brand — the brand is the guide.</strong> (Luke is the hero; Yoda is the guide.) SB7 has seven parts:</p>
<pre><code>1. A CHARACTER      - the customer wants something
2. has a PROBLEM    - external, internal, and philosophical
3. meets a GUIDE    - the brand: empathy + authority
4. who gives a PLAN - clear steps to buy / act
5. calls to ACTION  - direct ("Buy now") + transitional ("Free guide")
6. avoiding FAILURE - what's at stake if they do nothing
7. ending in SUCCESS- the happy transformation
</code></pre>
<h3>Why "guide", not "hero"</h3>
<p>Brands that cast themselves as the hero make the customer a bystander. Position the brand as the guide who <em>understands the customer's problem</em> and hands them a plan — the customer stays the star.</p>
<div class="callout"><span class="badge">Real campaign — Apple</span> Apple rarely makes itself the hero. Its ads show <em>creative people</em> (the heroes) doing remarkable things; Apple is the tool/guide that empowers them. The 1984 ad cast the customer as the rebel breaking free — Apple was merely the means.</div>`,
    `<span class="eyebrow">DSB301c · Chương 2 · Bài 2.1</span>
<h2>Cấu trúc chuyện</h2>
<h3>Hành trình anh hùng (rút gọn)</h3>
<p>Hầu hết câu chuyện sống lâu có chung một dáng: một <strong>anh hùng</strong> ở thế giới bình thường gặp <strong>vấn đề</strong>, gặp một <strong>người dẫn (guide)</strong>, nhận một <strong>kế hoạch</strong>, ra <strong>hành động</strong>, và đạt <strong>sự thay đổi</strong>. Thương hiệu mượn xương sống này để cấu trúc thông điệp.</p>
<h3>Khung StoryBrand SB7</h3>
<p>Cốt lõi của Donald Miller: <strong>khách hàng là anh hùng, không phải thương hiệu — thương hiệu là người dẫn.</strong> (Luke là anh hùng; Yoda là người dẫn.) SB7 gồm bảy phần:</p>
<pre><code>1. NHÂN VẬT        - khách hàng muốn một điều gì
2. có VẤN ĐỀ       - bên ngoài, bên trong, và triết lý
3. gặp NGƯỜI DẪN   - thương hiệu: đồng cảm + uy tín
4. đưa KẾ HOẠCH    - các bước rõ ràng để mua / hành động
5. KÊU GỌI hành động - trực tiếp ("Mua ngay") + chuyển tiếp ("Tải cẩm nang")
6. tránh THẤT BẠI  - mất gì nếu không làm gì
7. đến THÀNH CÔNG  - sự thay đổi tốt đẹp
</code></pre>
<h3>Vì sao là "người dẫn", không phải "anh hùng"</h3>
<p>Thương hiệu tự nhận là anh hùng biến khách thành người đứng ngoài. Hãy đặt thương hiệu làm người dẫn <em>hiểu vấn đề của khách</em> và trao họ một kế hoạch — khách vẫn là ngôi sao.</p>
<div class="callout"><span class="badge">Chiến dịch thật — Apple</span> Apple hiếm khi tự làm anh hùng. Quảng cáo của họ cho thấy <em>những người sáng tạo</em> (anh hùng) làm điều phi thường; Apple là công cụ/người dẫn tiếp sức. Quảng cáo 1984 đặt khách hàng làm kẻ nổi loạn phá xiềng — Apple chỉ là phương tiện.</div>`,
  ]]);

const c2q = quiz('dsb301c-quiz-2', 'Quiz 2 — Structure & SB7|||Quiz 2 — Cấu trúc & SB7', [
  { id: 'q1', question: 'Trong khung StoryBrand SB7, ai là anh hùng?|||In StoryBrand SB7, who is the hero?', options: ['Thương hiệu|||The brand', 'Khách hàng|||The customer', 'CEO|||The CEO', 'Đối thủ|||The competitor'], correctIndex: 1, explanation: 'Khách là anh hùng; thương hiệu là người dẫn (guide) như Yoda với Luke.' },
  { id: 'q2', question: 'Vai trò đúng của thương hiệu trong SB7 là?|||The brand\'s correct role in SB7 is?', options: ['Anh hùng cứu thế giới|||The hero who saves the world', 'Người dẫn có đồng cảm + uy tín, trao kế hoạch|||The guide with empathy + authority who gives a plan', 'Kẻ phản diện|||The villain', 'Người quan sát|||A bystander'], correctIndex: 1, explanation: 'Guide thể hiện đồng cảm và uy tín, rồi đưa khách một kế hoạch rõ ràng.' },
  { id: 'q3', question: 'Thành phần nào của SB7 nêu "mất gì nếu không hành động"?|||Which SB7 element states "what\'s at stake if they do nothing"?', options: ['Kế hoạch (Plan)|||Plan', 'Thành công (Success)|||Success', 'Thất bại cần tránh (Failure)|||Failure to avoid', 'Nhân vật (Character)|||Character'], correctIndex: 2, explanation: 'Phần Failure nêu rủi ro/hậu quả nếu khách không hành động — tạo động lực.' },
]);

const c3 = doc('dsb301c-3-1-persona-and-message', '3.1 — Brand persona & message|||3.1 — Nhân vật & thông điệp thương hiệu',
  'Brand persona & giọng thương hiệu; 12 archetype (Jung); one-liner/tagline; nhất quán thông điệp. Ví dụ: Old Spice (Hề/Người tình), Innocent Drinks (giọng bạn bè hài hước).',
  [[
    `<span class="eyebrow">DSB301c · Chapter 3 · Lesson 3.1</span>
<h2>Brand persona &amp; message</h2>
<h3>Brand persona &amp; voice</h3>
<p>A <strong>brand persona</strong> is the consistent personality a brand shows — as if it were a person. It sets the <strong>voice</strong> (word choice, tone, attitude) so every post, caption and video sounds like the <em>same</em> character.</p>
<h3>Brand archetypes</h3>
<p>Jung's <strong>12 archetypes</strong> give a shortcut to persona: the Hero (Nike), the Outlaw (Harley-Davidson), the Sage (Google), the Jester (Old Spice), the Innocent, the Lover, the Everyman, the Caregiver, the Creator, the Ruler, the Magician, the Explorer. Pick one core archetype and stay true to it.</p>
<h3>The one-liner</h3>
<p>A <strong>one-liner</strong> compresses the story into a single sentence: <em>problem → solution → result</em>. "Most teams drown in scattered notes; [Brand] keeps everything in one searchable place, so you never lose an idea again." Repeatable, memorable, everywhere.</p>
<div class="callout"><span class="badge">Real campaign — Old Spice</span> "The Man Your Man Could Smell Like" locked a single persona — the confident, absurd Jester/Lover — across TV, YouTube and hundreds of rapid-fire response videos. One consistent voice turned an old brand young again.</div>`,
    `<span class="eyebrow">DSB301c · Chương 3 · Bài 3.1</span>
<h2>Nhân vật &amp; thông điệp thương hiệu</h2>
<h3>Brand persona &amp; giọng nói</h3>
<p><strong>Brand persona</strong> là tính cách nhất quán mà thương hiệu thể hiện — như thể nó là một con người. Nó quy định <strong>giọng nói</strong> (chọn từ, tông, thái độ) để mọi bài đăng, caption, video nghe như <em>cùng một</em> nhân vật.</p>
<h3>Archetype (nguyên mẫu) thương hiệu</h3>
<p><strong>12 archetype</strong> của Jung là lối tắt để định persona: Anh hùng (Nike), Kẻ nổi loạn (Harley-Davidson), Nhà hiền triết (Google), Chàng hề (Old Spice), Ngây thơ, Người tình, Người thường, Người chăm sóc, Nhà sáng tạo, Người cai trị, Pháp sư, Người khám phá. Chọn một archetype cốt lõi và trung thành với nó.</p>
<h3>One-liner (câu tuyên ngôn)</h3>
<p><strong>One-liner</strong> nén câu chuyện vào một câu: <em>vấn đề → giải pháp → kết quả</em>. "Đa số nhóm chìm trong ghi chú rải rác; [Thương hiệu] gom tất cả vào một chỗ tìm được, để bạn không bao giờ mất ý tưởng." Lặp lại được, dễ nhớ, dùng khắp nơi.</p>
<div class="callout"><span class="badge">Chiến dịch thật — Old Spice</span> "The Man Your Man Could Smell Like" khoá một persona duy nhất — Chàng hề/Người tình tự tin, phi lý — xuyên TV, YouTube và hàng trăm video phản hồi chớp nhoáng. Một giọng nhất quán làm thương hiệu già trẻ lại.</div>`,
  ]]);

const c3q = quiz('dsb301c-quiz-3', 'Quiz 3 — Persona & message|||Quiz 3 — Nhân vật & thông điệp', [
  { id: 'q1', question: 'Brand persona là gì?|||What is a brand persona?', options: ['Logo và bảng màu|||The logo and colour palette', 'Tính cách/giọng nói nhất quán của thương hiệu như một con người|||The consistent personality/voice of the brand as if it were a person', 'Danh sách tính năng sản phẩm|||A list of product features', 'Ngân sách quảng cáo|||The ad budget'], correctIndex: 1, explanation: 'Persona là tính cách nhất quán quy định giọng nói của thương hiệu.' },
  { id: 'q2', question: 'Bộ "12 archetype" (Jung) dùng để làm gì?|||What are Jung\'s "12 archetypes" used for?', options: ['Tính giá sản phẩm|||Pricing products', 'Cho một lối tắt định hình persona/nhân vật thương hiệu|||A shortcut to shape brand persona/character', 'Đo lượng truy cập|||Measuring traffic', 'Thiết kế logo tự động|||Auto-generating logos'], correctIndex: 1, explanation: 'Archetype (Hero, Jester, Sage...) giúp chọn nhanh một tính cách cốt lõi.' },
  { id: 'q3', question: 'Cấu trúc gọn của một one-liner thương hiệu là?|||The compact structure of a brand one-liner is?', options: ['Tên → giá → khuyến mãi|||Name → price → promo', 'Vấn đề → giải pháp → kết quả|||Problem → solution → result', 'Lịch sử → tầm nhìn → sứ mệnh|||History → vision → mission', 'Tính năng → thông số → bảo hành|||Features → specs → warranty'], correctIndex: 1, explanation: 'One-liner nén câu chuyện: nêu vấn đề, giải pháp của brand, và kết quả cho khách.' },
]);

const c4 = doc('dsb301c-4-1-digital-formats', '4.1 — Story across digital formats|||4.1 — Chuyện qua các định dạng số',
  'Cùng một câu chuyện, khác định dạng: video dài, social post, blog, podcast, reels/shorts. Nguyên tắc "hook nhanh - hợp nền tảng". Ví dụ: Spotify Wrapped, GoPro UGC.',
  [[
    `<span class="eyebrow">DSB301c · Chapter 4 · Lesson 4.1</span>
<h2>Story across digital formats</h2>
<p class="lead">One story, many shapes. Each format has its own rhythm — the craft is fitting the story to the format without losing its spine.</p>
<h3>Format by format</h3>
<ul>
<li><strong>Long-form video</strong> — full emotional arc; best for brand films &amp; documentary storytelling (1–3 min+).</li>
<li><strong>Reels / Shorts / TikTok</strong> — a <strong>hook in the first 1–2 seconds</strong>, one idea, vertical, sound-on; built for reach.</li>
<li><strong>Social post</strong> — a single moment or micro-story + a strong visual; caption carries the voice.</li>
<li><strong>Blog / article</strong> — depth, SEO, how-to and case-study storytelling; owned real estate.</li>
<li><strong>Podcast</strong> — intimate, long attention; conversation and narrative audio.</li>
</ul>
<h3>The rule: repurpose, don't repeat</h3>
<p>Shoot once, reshape many times: a long interview becomes a blog, five reels, ten quote cards and a podcast clip — each <em>native</em> to its platform, not a copy-paste.</p>
<div class="callout"><span class="badge">Real campaign — Spotify Wrapped</span> Wrapped tells each user their own year-in-music as bite-size, share-ready cards. Same story engine, personalised, format-perfect for Instagram Stories — which is why millions post it for free every December.</div>`,
    `<span class="eyebrow">DSB301c · Chương 4 · Bài 4.1</span>
<h2>Chuyện qua các định dạng số</h2>
<p class="lead">Một câu chuyện, nhiều hình hài. Mỗi định dạng có nhịp riêng — nghề nằm ở việc gọt câu chuyện cho hợp định dạng mà không mất xương sống.</p>
<h3>Từng định dạng</h3>
<ul>
<li><strong>Video dài</strong> — trọn cung cảm xúc; hợp phim thương hiệu &amp; kể chuyện kiểu tài liệu (1–3 phút+).</li>
<li><strong>Reels / Shorts / TikTok</strong> — <strong>hook trong 1–2 giây đầu</strong>, một ý, dọc, bật tiếng; sinh ra để có reach.</li>
<li><strong>Bài social</strong> — một khoảnh khắc hay câu chuyện nhỏ + hình ảnh mạnh; caption mang giọng nói.</li>
<li><strong>Blog / bài viết</strong> — chiều sâu, SEO, kể chuyện dạng how-to và case study; đất của riêng mình.</li>
<li><strong>Podcast</strong> — gần gũi, giữ chú ý lâu; trò chuyện và tự sự bằng âm thanh.</li>
</ul>
<h3>Nguyên tắc: tái định dạng, đừng lặp lại</h3>
<p>Quay một lần, gọt nhiều lần: một buổi phỏng vấn dài thành một blog, năm reels, mười thẻ trích dẫn và một đoạn podcast — mỗi cái <em>hợp bản địa</em> với nền tảng của nó, không copy-paste.</p>
<div class="callout"><span class="badge">Chiến dịch thật — Spotify Wrapped</span> Wrapped kể cho từng người một năm âm nhạc của họ bằng những thẻ nhỏ, sẵn để chia sẻ. Cùng một cỗ máy kể chuyện, cá nhân hoá, đúng định dạng cho Instagram Stories — nên hàng triệu người tự đăng miễn phí mỗi tháng 12.</div>`,
  ]]);

const c4q = quiz('dsb301c-quiz-4', 'Quiz 4 — Digital formats|||Quiz 4 — Định dạng số', [
  { id: 'q1', question: 'Với reels/shorts, yếu tố quan trọng nhất ở đầu clip là?|||For reels/shorts, the most important thing at the start is?', options: ['Logo lớn|||A big logo', 'Một hook trong 1–2 giây đầu|||A hook in the first 1–2 seconds', 'Nhạc nền dài|||A long intro track', 'Thông tin liên hệ|||Contact details'], correctIndex: 1, explanation: 'Reels/Shorts cần hook chớp nhoáng để giữ người xem khỏi lướt qua.' },
  { id: 'q2', question: '"Repurpose, don\'t repeat" nghĩa là?|||"Repurpose, don\'t repeat" means?', options: ['Đăng y hệt lên mọi kênh|||Post the identical thing everywhere', 'Gọt lại một nội dung gốc thành nhiều dạng hợp từng nền tảng|||Reshape one source into many platform-native forms', 'Chỉ dùng một kênh duy nhất|||Use only one channel', 'Xoá nội dung cũ|||Delete old content'], correctIndex: 1, explanation: 'Quay/viết một lần rồi tái định dạng bản địa cho từng nền tảng, không copy-paste.' },
  { id: 'q3', question: 'Vì sao Spotify Wrapped được hàng triệu người tự đăng?|||Why do millions self-post Spotify Wrapped?', options: ['Vì bị bắt buộc|||Because it is mandatory', 'Vì cá nhân hoá và đúng định dạng chia sẻ (Stories)|||Because it is personalised and format-perfect for sharing (Stories)', 'Vì có tiền thưởng|||Because of cash rewards', 'Vì nội dung dài|||Because it is long-form'], correctIndex: 1, explanation: 'Câu chuyện cá nhân hoá, đóng gói đúng định dạng chia sẻ → lan truyền miễn phí.' },
]);

const c5 = doc('dsb301c-5-1-contagious-stepps', '5.1 — Contagious content: the STEPPS model|||5.1 — Nội dung lan truyền: mô hình STEPPS',
  'Jonah Berger — 6 yếu tố khiến nội dung được chia sẻ: Social currency, Triggers, Emotion, Public, Practical value, Stories. Ví dụ: Blendtec "Will It Blend?", Dollar Shave Club.',
  [[
    `<span class="eyebrow">DSB301c · Chapter 5 · Lesson 5.1</span>
<h2>Contagious content — STEPPS</h2>
<p class="lead">Jonah Berger studied why things catch on and found six ingredients. Sharing is not luck — it is engineered. Remember <strong>STEPPS</strong>.</p>
<h3>The six levers</h3>
<ul>
<li><strong>S — Social currency</strong>: people share what makes them look good / in-the-know.</li>
<li><strong>T — Triggers</strong>: link the idea to an everyday cue that keeps it top-of-mind ("Kit Kat + coffee break").</li>
<li><strong>E — Emotion</strong>: high-arousal feelings (awe, excitement, anger, humour) drive sharing; low-arousal (contentment, sadness) does not.</li>
<li><strong>P — Public</strong>: things built to show spread (visible logos, "I voted" stickers).</li>
<li><strong>P — Practical value</strong>: useful, helpful content gets passed to people we care about.</li>
<li><strong>S — Stories</strong>: people carry your message inside a story they want to retell.</li>
</ul>
<h3>Design for sharing</h3>
<p>Before publishing, ask: does this give the sharer <em>social currency</em>? Is there a <em>trigger</em>? Does it spark <em>high-arousal emotion</em>? Is it <em>useful</em>? Is it wrapped in a <em>story</em>?</p>
<div class="callout"><span class="badge">Real campaign — Blendtec</span> "Will It Blend?" blended iPhones and marbles — pure awe and humour (Emotion), it made viewers look fun for sharing (Social currency), and it was a story worth retelling. A dull blender brand became a viral sensation on a tiny budget.</div>`,
    `<span class="eyebrow">DSB301c · Chương 5 · Bài 5.1</span>
<h2>Nội dung lan truyền — STEPPS</h2>
<p class="lead">Jonah Berger nghiên cứu vì sao thứ này lan còn thứ kia không, và tìm ra sáu thành phần. Chia sẻ không phải may rủi — nó được thiết kế. Nhớ <strong>STEPPS</strong>.</p>
<h3>Sáu đòn bẩy</h3>
<ul>
<li><strong>S — Social currency (vốn xã hội)</strong>: người ta chia sẻ thứ khiến họ trông ngầu / thạo tin.</li>
<li><strong>T — Triggers (chất kích gợi)</strong>: gắn ý tưởng với một tín hiệu thường ngày để luôn hiện lên trong đầu ("Kit Kat + giờ nghỉ cà phê").</li>
<li><strong>E — Emotion (cảm xúc)</strong>: cảm xúc cường độ cao (kinh ngạc, phấn khích, giận, hài) thúc đẩy chia sẻ; cảm xúc trầm (mãn nguyện, buồn) thì không.</li>
<li><strong>P — Public (công khai)</strong>: thứ được làm để phô ra sẽ lan (logo dễ thấy, sticker "Tôi đã bầu").</li>
<li><strong>P — Practical value (giá trị thực dụng)</strong>: nội dung hữu ích được chuyền cho người ta quan tâm.</li>
<li><strong>S — Stories (câu chuyện)</strong>: người ta mang thông điệp của bạn bên trong một câu chuyện họ muốn kể lại.</li>
</ul>
<h3>Thiết kế để được chia sẻ</h3>
<p>Trước khi đăng, hãy hỏi: nội dung này có cho người chia sẻ <em>vốn xã hội</em> không? Có <em>trigger</em> không? Có khơi <em>cảm xúc cường độ cao</em> không? Có <em>hữu ích</em> không? Có được gói trong một <em>câu chuyện</em> không?</p>
<div class="callout"><span class="badge">Chiến dịch thật — Blendtec</span> "Will It Blend?" xay iPhone và bi ve — thuần kinh ngạc và hài (Emotion), khiến người xem trông vui khi chia sẻ (Social currency), và là câu chuyện đáng kể lại. Một thương hiệu máy xay nhàm chán thành hiện tượng lan truyền với ngân sách nhỏ xíu.</div>`,
  ]]);

const c5q = quiz('dsb301c-quiz-5', 'Quiz 5 — STEPPS|||Quiz 5 — STEPPS', [
  { id: 'q1', question: '"STEPPS" của Jonah Berger mô tả điều gì?|||What does Jonah Berger\'s "STEPPS" describe?', options: ['Các bước SEO|||SEO steps', 'Sáu yếu tố khiến nội dung được chia sẻ|||Six ingredients that make content shareable', 'Sáu nền tảng social|||Six social platforms', 'Quy trình quay video|||A video shooting workflow'], correctIndex: 1, explanation: 'STEPPS = Social currency, Triggers, Emotion, Public, Practical value, Stories.' },
  { id: 'q2', question: 'Theo Berger, loại cảm xúc nào thúc đẩy chia sẻ mạnh nhất?|||Which kind of emotion drives sharing most, per Berger?', options: ['Cảm xúc trầm, cường độ thấp (mãn nguyện, buồn)|||Low-arousal (contentment, sadness)', 'Cảm xúc cường độ cao (kinh ngạc, phấn khích, giận, hài)|||High-arousal (awe, excitement, anger, humour)', 'Không cảm xúc, chỉ dữ kiện|||No emotion, just facts', 'Chỉ nỗi sợ|||Fear only'], correctIndex: 1, explanation: 'Cảm xúc "arousal" cao khơi hành động chia sẻ; cảm xúc trầm thì ít lan.' },
  { id: 'q3', question: 'Yếu tố "Triggers" trong STEPPS nghĩa là?|||What does "Triggers" mean in STEPPS?', options: ['Nút bấm kêu gọi hành động|||A call-to-action button', 'Gắn ý tưởng với một tín hiệu thường ngày để luôn được nhớ tới|||Linking the idea to an everyday cue so it stays top-of-mind', 'Cảnh báo nội dung nhạy cảm|||A content warning', 'Bộ đếm ngược khuyến mãi|||A promo countdown'], correctIndex: 1, explanation: 'Trigger là tín hiệu môi trường (giờ nghỉ, mùa...) làm người ta nhớ tới thương hiệu.' },
]);

const c6 = doc('dsb301c-6-1-channels-distribution', '6.1 — Channels & distribution: owned, earned, paid|||6.1 — Kênh & phân phối: owned, earned, paid',
  'Mô hình PESO/owned-earned-paid; chiến lược đa nền tảng; mô hình Hero–Hub–Hygiene. Ví dụ: Red Bull Media House (thương hiệu vận hành như hãng truyền thông).',
  [[
    `<span class="eyebrow">DSB301c · Chapter 6 · Lesson 6.1</span>
<h2>Channels &amp; distribution</h2>
<p class="lead">A great story with no distribution is a diary entry. Where and how you publish decides who sees it.</p>
<h3>Owned, Earned, Paid</h3>
<ul>
<li><strong>Owned</strong> — channels you control: website, blog, email list, your social accounts. Free, durable, but you must build the audience.</li>
<li><strong>Earned</strong> — coverage &amp; shares you did not pay for: press, reviews, user posts, word of mouth. Most credible, least controllable.</li>
<li><strong>Paid</strong> — ads &amp; sponsored/boosted posts. Fast, targetable reach — but stops when the budget stops.</li>
</ul>
<p>The three work together: paid sparks reach, earned adds credibility, owned captures and keeps the audience. (Add "shared" and you get the <strong>PESO</strong> model.)</p>
<h3>Hero – Hub – Hygiene</h3>
<pre><code>HERO    - big tentpole moments (a few/year) -> mass awareness
HUB     - regular episodic content          -> retain a subscribed audience
HYGIENE - always-on "help" / search content -> found when people look
</code></pre>
<div class="callout"><span class="badge">Real campaign — Red Bull</span> Red Bull runs like a media company, not a drinks brand: films, magazines, the Stratos space jump (HERO), regular sports series (HUB) and how-to clips (HYGIENE). It owns its audience across every channel — the drink is almost a footnote.</div>`,
    `<span class="eyebrow">DSB301c · Chương 6 · Bài 6.1</span>
<h2>Kênh &amp; phân phối</h2>
<p class="lead">Một câu chuyện hay mà không phân phối chỉ là trang nhật ký. Đăng ở đâu và cách nào quyết định ai được thấy.</p>
<h3>Owned, Earned, Paid</h3>
<ul>
<li><strong>Owned (sở hữu)</strong> — kênh bạn kiểm soát: website, blog, danh sách email, tài khoản social của bạn. Miễn phí, bền, nhưng phải tự xây khán giả.</li>
<li><strong>Earned (kiếm được)</strong> — đưa tin &amp; chia sẻ mà bạn không trả tiền: báo chí, đánh giá, bài của người dùng, truyền miệng. Đáng tin nhất, khó kiểm soát nhất.</li>
<li><strong>Paid (trả phí)</strong> — quảng cáo &amp; bài tài trợ/boost. Reach nhanh, nhắm được — nhưng dừng khi hết ngân sách.</li>
</ul>
<p>Ba cái phối hợp: paid châm reach, earned thêm uy tín, owned giữ và nuôi khán giả. (Thêm "shared" thành mô hình <strong>PESO</strong>.)</p>
<h3>Hero – Hub – Hygiene</h3>
<pre><code>HERO    - khoảnh khắc lớn (vài lần/năm) -> nhận biết diện rộng
HUB     - nội dung định kỳ theo tập     -> giữ khán giả đã theo dõi
HYGIENE - nội dung "trợ giúp"/tìm kiếm  -> được thấy khi người ta chủ động tìm
</code></pre>
<div class="callout"><span class="badge">Chiến dịch thật — Red Bull</span> Red Bull vận hành như một hãng truyền thông, không như hãng nước: phim, tạp chí, cú nhảy vũ trụ Stratos (HERO), các series thể thao định kỳ (HUB) và clip how-to (HYGIENE). Nó sở hữu khán giả trên mọi kênh — lon nước gần như chỉ là chú thích.</div>`,
  ]]);

const c6q = quiz('dsb301c-quiz-6', 'Quiz 6 — Channels|||Quiz 6 — Kênh phân phối', [
  { id: 'q1', question: 'Kênh nào là "owned" (sở hữu)?|||Which is an "owned" channel?', options: ['Bài báo viết về bạn|||A press article about you', 'Website &amp; danh sách email của bạn|||Your website &amp; email list', 'Quảng cáo trả phí trên Facebook|||A paid Facebook ad', 'Review của khách trên diễn đàn|||A customer review on a forum'], correctIndex: 1, explanation: 'Owned = kênh bạn kiểm soát: website, blog, email, tài khoản của bạn.' },
  { id: 'q2', question: 'Ưu điểm nổi bật nhất của kênh "earned" (kiếm được) là?|||The standout strength of "earned" media is?', options: ['Kiểm soát hoàn toàn nội dung|||Total control of the message', 'Độ tin cậy cao nhất (truyền miệng/báo chí)|||Highest credibility (word of mouth/press)', 'Reach tức thì khi bơm tiền|||Instant reach when you spend', 'Miễn phí và luôn đoán trước được|||Free and fully predictable'], correctIndex: 1, explanation: 'Earned là uy tín nhất vì do bên thứ ba nói, nhưng khó kiểm soát nhất.' },
  { id: 'q3', question: 'Trong mô hình Hero–Hub–Hygiene, "Hygiene" là?|||In Hero–Hub–Hygiene, "Hygiene" content is?', options: ['Sự kiện lớn vài lần mỗi năm|||Big tentpole moments a few times a year', 'Nội dung "trợ giúp"/tìm kiếm luôn hiện diện|||Always-on "help"/search content', 'Video quảng cáo trả phí|||Paid ad videos', 'Nội dung nội bộ nhân viên|||Internal staff content'], correctIndex: 1, explanation: 'Hygiene là nội dung always-on trả lời nhu cầu tìm kiếm, để được thấy khi người ta chủ động tìm.' },
]);

const c7 = doc('dsb301c-7-1-production', '7.1 — Producing digital content: script, shoot, edit, design|||7.1 — Sản xuất nội dung số: kịch bản, quay, dựng, thiết kế',
  'Viết script (3 hồi, hook–giữ–thưởng); quay dựng cơ bản (ánh sáng, âm thanh, khung hình, b-roll); thiết kế nhất quán (Canva/CapCut/Adobe, brand kit). Quy trình pre → production → post.',
  [[
    `<span class="eyebrow">DSB301c · Chapter 7 · Lesson 7.1</span>
<h2>Producing digital content</h2>
<h3>1. Script</h3>
<p>Every piece starts on paper. Use a <strong>three-act shape</strong> (setup → tension → resolution) and the <strong>Hook – Hold – Reward</strong> rule: grab attention in seconds, keep tension so people stay, pay them off with insight or emotion. Write for the ear; read it aloud.</p>
<h3>2. Shoot (the basics)</h3>
<ul>
<li><strong>Light</strong> — soft, from the front; never shoot into a bright window.</li>
<li><strong>Sound</strong> — clean audio matters more than 4K; use a mic, record quiet rooms.</li>
<li><strong>Framing</strong> — rule of thirds; shoot vertical for reels, horizontal for YouTube.</li>
<li><strong>B-roll</strong> — cutaway shots make editing and pacing possible.</li>
</ul>
<h3>3. Edit &amp; design</h3>
<p>Cut for pace, add captions (most social plays muted), keep a consistent look with a <strong>brand kit</strong> (fonts, colours, logo). <strong>CapCut</strong> for fast vertical video, <strong>Canva</strong> for graphics &amp; templates, <strong>Adobe Premiere/Photoshop</strong> for pro work.</p>
<pre><code>Workflow:
 PRE      -> idea, script, storyboard, shot list
 PRODUCTION -> shoot / record / capture assets
 POST     -> edit, captions, design, brand kit, export per platform
</code></pre>
<div class="callout"><span class="badge">Craft tip</span> Consistency beats production budget. A simple, on-brand, well-captioned clip posted regularly outperforms a rare, expensive film that never fits the platform.</div>`,
    `<span class="eyebrow">DSB301c · Chương 7 · Bài 7.1</span>
<h2>Sản xuất nội dung số</h2>
<h3>1. Kịch bản (script)</h3>
<p>Mọi sản phẩm bắt đầu trên giấy. Dùng <strong>cấu trúc ba hồi</strong> (mở → căng → giải quyết) và quy tắc <strong>Hook – Hold – Reward</strong> (móc – giữ – thưởng): giành chú ý trong vài giây, giữ căng để người ta ở lại, đền đáp bằng insight hoặc cảm xúc. Viết cho tai nghe; đọc to lên.</p>
<h3>2. Quay (căn bản)</h3>
<ul>
<li><strong>Ánh sáng</strong> — mềm, chiếu từ phía trước; đừng quay ngược cửa sổ sáng.</li>
<li><strong>Âm thanh</strong> — tiếng sạch quan trọng hơn 4K; dùng mic, thu ở phòng yên.</li>
<li><strong>Khung hình</strong> — quy tắc một phần ba; quay dọc cho reels, ngang cho YouTube.</li>
<li><strong>B-roll</strong> — cảnh chèn giúp dựng và điều nhịp mượt hơn.</li>
</ul>
<h3>3. Dựng &amp; thiết kế</h3>
<p>Cắt để giữ nhịp, thêm phụ đề (đa số social phát tắt tiếng), giữ diện mạo nhất quán bằng <strong>brand kit</strong> (font, màu, logo). <strong>CapCut</strong> cho video dọc nhanh, <strong>Canva</strong> cho đồ hoạ &amp; template, <strong>Adobe Premiere/Photoshop</strong> cho việc chuyên nghiệp.</p>
<pre><code>Quy trình:
 PRE       -> ý tưởng, kịch bản, storyboard, shot list
 SẢN XUẤT  -> quay / thu / thu thập tư liệu
 POST      -> dựng, phụ đề, thiết kế, brand kit, xuất theo nền tảng
</code></pre>
<div class="callout"><span class="badge">Mẹo nghề</span> Nhất quán thắng ngân sách sản xuất. Một clip đơn giản, đúng nhận diện, có phụ đề tốt, đăng đều đặn sẽ vượt một phim đắt tiền hiếm hoi mà không hợp nền tảng nào.</div>`,
  ]]);

const c7q = quiz('dsb301c-quiz-7', 'Quiz 7 — Production|||Quiz 7 — Sản xuất', [
  { id: 'q1', question: 'Quy tắc "Hook – Hold – Reward" trong viết kịch bản nghĩa là?|||What does "Hook – Hold – Reward" mean in scripting?', options: ['Giá – khuyến mãi – bảo hành|||Price – promo – warranty', 'Giành chú ý → giữ căng → đền đáp bằng insight/cảm xúc|||Grab attention → keep tension → pay off with insight/emotion', 'Quay – dựng – đăng|||Shoot – edit – post', 'Ba nền tảng phải dùng|||Three platforms to use'], correctIndex: 1, explanation: 'Hook móc chú ý, Hold giữ người xem, Reward đền đáp — giữ họ đến hết.' },
  { id: 'q2', question: 'Vì sao gần như luôn cần thêm phụ đề cho video social?|||Why almost always add captions to social video?', options: ['Để tăng dung lượng file|||To increase file size', 'Vì đa số người xem phát video ở chế độ TẮT TIẾNG|||Because most social video is played MUTED', 'Để né bản quyền|||To dodge copyright', 'Vì thuật toán cấm video không phụ đề|||Because the algorithm bans caption-less video'], correctIndex: 1, explanation: 'Phần lớn video social phát tắt tiếng; phụ đề giữ được thông điệp.' },
  { id: 'q3', question: 'Điều nào quan trọng hơn trong sản xuất căn bản?|||Which matters more in basic production?', options: ['Độ phân giải 4K hơn âm thanh sạch|||4K resolution over clean audio', 'Âm thanh sạch thường quan trọng hơn độ phân giải cực cao|||Clean audio usually matters more than ultra-high resolution', 'Càng nhiều hiệu ứng càng tốt|||The more effects the better', 'Quay ngược sáng cửa sổ|||Shooting into a bright window'], correctIndex: 1, explanation: 'Người xem tha thứ hình chưa hoàn hảo hơn là tiếng tệ; ưu tiên âm thanh và ánh sáng.' },
]);

const c8 = doc('dsb301c-8-1-measure-optimise', '8.1 — Measure & optimise: engagement, reach, A/B, ROI|||8.1 — Đo lường & tối ưu: engagement, reach, A/B, ROI',
  'Chỉ số theo phễu (awareness → consideration → conversion); reach vs engagement vs vanity metrics; A/B testing; nối kể chuyện với ROI (storytelling ROI). Vòng lặp đo → học → cải tiến.',
  [[
    `<span class="eyebrow">DSB301c · Chapter 8 · Lesson 8.1</span>
<h2>Measure &amp; optimise</h2>
<h3>Metrics that matter (by funnel stage)</h3>
<ul>
<li><strong>Awareness</strong> — <em>reach</em> &amp; <em>impressions</em>: how many saw it.</li>
<li><strong>Engagement</strong> — likes, comments, shares, saves, watch-time: did the story land?</li>
<li><strong>Consideration</strong> — clicks, profile visits, sign-ups, time on page.</li>
<li><strong>Conversion</strong> — leads, sales, sign-ups: did it drive the business result?</li>
</ul>
<p><strong>Vanity vs actionable:</strong> a huge view count feels good, but shares, saves and conversions tell you the story actually moved someone. Watch the metric tied to a <em>decision</em>.</p>
<h3>A/B testing</h3>
<p>Change <strong>one variable</strong> (hook, thumbnail, caption, CTA), show each version to a comparable audience, and keep the winner. Test relentlessly — small hook changes can double reach.</p>
<h3>Storytelling ROI</h3>
<p>Tie content back to value: cost per view/lead, engagement rate, assisted conversions, and brand lift (surveyed recall/sentiment). Story is not "unmeasurable fluff" — it is measured across the funnel, just not by conversions alone.</p>
<pre><code>Loop:  publish -> measure -> learn -> improve -> publish ...
</code></pre>
<div class="callout"><span class="badge">Real practice — Dollar Shave Club</span> Its launch video was funny (Emotion) AND relentlessly measured: views turned into sign-ups, cost-per-acquisition was tracked, and the winning hooks were doubled down on. Story and analytics together built a brand later sold for ~1 billion USD.</div>`,
    `<span class="eyebrow">DSB301c · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; tối ưu</h2>
<h3>Chỉ số quan trọng (theo tầng phễu)</h3>
<ul>
<li><strong>Awareness (nhận biết)</strong> — <em>reach</em> &amp; <em>impressions</em>: bao nhiêu người thấy.</li>
<li><strong>Engagement (tương tác)</strong> — like, bình luận, share, save, thời lượng xem: câu chuyện có "trúng" không?</li>
<li><strong>Consideration (cân nhắc)</strong> — click, ghé profile, đăng ký, thời gian trên trang.</li>
<li><strong>Conversion (chuyển đổi)</strong> — lead, doanh số, đăng ký: có tạo ra kết quả kinh doanh không?</li>
</ul>
<p><strong>Vanity vs actionable:</strong> lượt xem khổng lồ nghe sướng, nhưng share, save và conversion mới cho biết câu chuyện thật sự lay động ai đó. Hãy nhìn chỉ số gắn với một <em>quyết định</em>.</p>
<h3>A/B testing</h3>
<p>Đổi <strong>một biến duy nhất</strong> (hook, thumbnail, caption, CTA), cho mỗi phiên bản chạy với nhóm khán giả tương đương, và giữ bản thắng. Thử không ngừng — đổi hook nhỏ có thể nhân đôi reach.</p>
<h3>Storytelling ROI</h3>
<p>Nối nội dung về giá trị: chi phí mỗi lượt xem/lead, tỉ lệ tương tác, chuyển đổi hỗ trợ, và brand lift (khảo sát mức nhớ/thiện cảm). Câu chuyện không phải "thứ mơ hồ không đo được" — nó được đo xuyên phễu, chỉ là không đo bằng riêng conversion.</p>
<pre><code>Vòng lặp:  đăng -> đo -> học -> cải tiến -> đăng ...
</code></pre>
<div class="callout"><span class="badge">Thực tế — Dollar Shave Club</span> Video ra mắt vừa hài (Emotion) VỪA được đo sát: lượt xem biến thành đăng ký, chi phí mỗi khách được theo dõi, và các hook thắng được nhân đôi đầu tư. Câu chuyện cộng phân tích đã dựng nên một thương hiệu về sau bán với giá ~1 tỉ USD.</div>`,
  ]]);

const c8q = quiz('dsb301c-quiz-8', 'Quiz 8 — Measurement|||Quiz 8 — Đo lường', [
  { id: 'q1', question: 'Đâu là "vanity metric" dễ gây ngộ nhận nhất?|||Which is the most misleading "vanity metric"?', options: ['Số lượt chuyển đổi (conversion)|||Conversions', 'Lượt xem/impressions khổng lồ nhưng không dẫn tới hành động|||Huge views/impressions with no action', 'Tỉ lệ chia sẻ (share rate)|||Share rate', 'Số lead thu được|||Leads captured'], correctIndex: 1, explanation: 'Lượt xem lớn nghe hay nhưng nếu không dẫn tới hành động thì là vanity metric.' },
  { id: 'q2', question: 'Nguyên tắc cốt lõi của A/B testing là?|||The core rule of A/B testing is?', options: ['Đổi càng nhiều thứ càng tốt trong một lần|||Change as many things as possible at once', 'Chỉ đổi MỘT biến rồi so hai phiên bản trên nhóm tương đương|||Change ONE variable, compare two versions on comparable audiences', 'Luôn chọn phiên bản dài hơn|||Always pick the longer version', 'Chạy trên hai nền tảng khác nhau|||Run each on a different platform'], correctIndex: 1, explanation: 'Đổi một biến để biết chính xác điều gì tạo khác biệt, rồi giữ bản thắng.' },
  { id: 'q3', question: 'Chỉ số nào phù hợp nhất cho tầng "Awareness" của phễu?|||Which metric best fits the "Awareness" funnel stage?', options: ['Doanh số|||Sales revenue', 'Reach &amp; impressions|||Reach &amp; impressions', 'Chi phí mỗi lead|||Cost per lead', 'Tỉ lệ giữ chân khách|||Customer retention rate'], correctIndex: 1, explanation: 'Awareness đo bằng có bao nhiêu người thấy nội dung: reach và impressions.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DSB301c',
    slug: 'dsb301c-digital-storytelling-for-brands',
    title: 'Digital Storytelling for Brands',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DSB301c.webp',
    shortDescription: 'How brands become stories people share — storytelling craft, StoryBrand SB7 (brand=guide, customer=hero), brand voice, digital formats, Contagious STEPPS, owned/earned/paid channels, production & measurement.|||Cách thương hiệu thành chuyện đáng chia sẻ — nghệ thuật kể chuyện, StoryBrand SB7 (brand=người dẫn, khách=anh hùng), giọng thương hiệu, định dạng số, STEPPS lan truyền, kênh owned/earned/paid, sản xuất & đo lường.',
    description: 'Môn <strong>DSB301c — Digital Storytelling for Brands</strong> (khối Công nghệ Truyền thông, kỳ 4) dạy bạn biến thương hiệu thành <strong>câu chuyện người ta muốn chia sẻ</strong>. Từ <strong>vì sao chuyện thắng dữ kiện</strong> → <strong>cấu trúc chuyện</strong> (hero\'s journey, StoryBrand SB7: khách là anh hùng, thương hiệu là người dẫn) → <strong>nhân vật &amp; thông điệp</strong> (persona, archetype, one-liner) → <strong>định dạng số</strong> (video, reels, blog, podcast) → <strong>nội dung lan truyền</strong> (Contagious STEPPS) → <strong>kênh &amp; phân phối</strong> (owned/earned/paid) → <strong>sản xuất</strong> (kịch bản, quay dựng, thiết kế) → <strong>đo lường &amp; tối ưu</strong>. Dựng theo nguồn chuẩn quốc tế, song ngữ, có chiến dịch thật và quiz mỗi chương.',
    whatYouLearn: 'Vì sao câu chuyện thuyết phục hơn dữ kiện (narrative transportation); hero\'s journey & khung StoryBrand SB7 (brand là guide, khách là hero); brand persona, 12 archetype & one-liner; kể chuyện qua video/social/blog/podcast/reels; mô hình STEPPS của nội dung lan truyền; owned/earned/paid & Hero-Hub-Hygiene; viết script, quay dựng & thiết kế cơ bản (Canva/CapCut/Adobe); đo engagement/reach, A/B testing & storytelling ROI.',
    requirements: 'Không cần nền kỹ thuật. Nên có điện thoại quay được video và tài khoản Canva/CapCut miễn phí để thực hành. Tiếng Anh đọc hiểu cơ bản giúp theo tài liệu nguồn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền (StoryBrand, Contagious), tài liệu miễn phí, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kể chuyện số là gì; vì sao thương hiệu cần chuyện; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Kể chuyện & thương hiệu|||Chapter 1 — Storytelling & the brand', description: 'Vì sao chuyện thắng dữ kiện; narrative transportation.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấu trúc chuyện|||Chapter 2 — Story structure', description: 'Hero\'s journey & StoryBrand SB7 (brand=guide, khách=hero).', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nhân vật & thông điệp|||Chapter 3 — Character & message', description: 'Brand persona, 12 archetype, one-liner.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chuyện qua định dạng số|||Chapter 4 — Story across formats', description: 'Video, reels, social, blog, podcast; repurpose không repeat.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Nội dung lan truyền|||Chapter 5 — Contagious content', description: 'Mô hình STEPPS của Jonah Berger.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kênh & phân phối|||Chapter 6 — Channels & distribution', description: 'Owned/earned/paid & Hero-Hub-Hygiene.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sản xuất nội dung số|||Chapter 7 — Content production', description: 'Kịch bản, quay dựng, thiết kế (Canva/CapCut/Adobe).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & tối ưu|||Chapter 8 — Measure & optimise', description: 'Engagement, reach, A/B testing, storytelling ROI.', lessons: [c8, c8q] },
  ],
};
