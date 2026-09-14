/**
 * CMC201c — Creative Writing (Viết sáng tạo cho truyền thông/marketing).
 * Giáo trình tham khảo (trích dẫn, KHÔNG upload PDF): "On Writing" (Stephen
 * King), "Bird by Bird" (Anne Lamott), "The Elements of Style" (Strunk &
 * White), "Story" (Robert McKee). 8 chương: giọng văn → kể chuyện & cấu trúc →
 * nhân vật & bối cảnh → mô tả/đối thoại/cảm xúc → thể loại → viết cho thương
 * hiệu/nội dung số → biên tập & workshop → xuất bản & portfolio. Song ngữ.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('cmc201c-0-1-overview', 'Course overview: Creative Writing|||Tổng quan: Viết sáng tạo',
  'Viết sáng tạo là gì; vì sao ngành truyền thông/marketing cần nó; lộ trình 8 chương từ giọng văn đến portfolio.',
  [[
    `<span class="eyebrow">CMC201c · Lesson 0.1 · Overview</span>
<h2>Creative Writing</h2>
<p class="lead">This course treats writing as a <strong>craft</strong>, not a talent you either have or don't. You'll practice the same core skills novelists, poets and brand copywriters share — voice, storytelling, character, vivid description — and then aim them at communication &amp; marketing: content, campaigns, brand stories.</p>
<h3>Why communication &amp; marketing majors need this</h3>
<ul>
<li>Every ad, product page and social post is a tiny <strong>story</strong> competing for attention — the same craft that makes a novel gripping makes a caption stop the scroll.</li>
<li><strong>Voice</strong> is what makes a brand recognizable across a hundred posts written by different people.</li>
<li>Editing skill is what separates a first draft anyone can write from a piece worth publishing.</li>
</ul>
<h3>Roadmap</h3>
<p>Foundations &amp; voice → storytelling &amp; story structure → character &amp; setting → description, dialogue &amp; emotion → genres (short story, poetry, creative nonfiction) → writing for brands &amp; digital content → editing &amp; workshop feedback → publishing &amp; portfolio. Bilingual, with examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">CMC201c · Bài 0.1 · Tổng quan</span>
<h2>Viết sáng tạo</h2>
<p class="lead">Môn này coi viết là một <strong>nghề thủ công (craft)</strong>, không phải năng khiếu trời cho. Bạn luyện những kỹ năng nền mà nhà văn, nhà thơ và copywriter thương hiệu đều dùng — giọng văn, kể chuyện, nhân vật, mô tả sống động — rồi hướng chúng vào truyền thông/marketing: nội dung, chiến dịch, câu chuyện thương hiệu.</p>
<h3>Vì sao sinh viên truyền thông/marketing cần môn này</h3>
<ul>
<li>Mỗi mẫu quảng cáo, trang sản phẩm, bài đăng mạng xã hội đều là một <strong>câu chuyện</strong> nhỏ tranh giành sự chú ý — cùng thứ nghề khiến một cuốn tiểu thuyết cuốn hút cũng khiến một caption dừng ngón tay lướt.</li>
<li><strong>Giọng văn</strong> là thứ giúp một thương hiệu nhận ra được xuyên suốt hàng trăm bài do nhiều người viết.</li>
<li>Kỹ năng biên tập là thứ phân biệt một bản thảo đầu tay ai cũng viết được với một bài đáng công bố.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng &amp; giọng văn → kể chuyện &amp; cấu trúc câu chuyện → nhân vật &amp; bối cảnh → mô tả, đối thoại &amp; cảm xúc → thể loại (truyện ngắn, thơ, phi hư cấu sáng tạo) → viết cho thương hiệu &amp; nội dung số → biên tập &amp; phản hồi workshop → xuất bản &amp; portfolio. Song ngữ, có ví dụ và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('cmc201c-1-1-foundations-voice', '1.1 — Foundations & finding your voice|||1.1 — Nền tảng & tìm giọng văn',
  'Viết như một thói quen hằng ngày (King); giọng văn là gì, khác style thế nào; hai thói quen khởi động.',
  [[
    `<span class="eyebrow">CMC201c · Chapter 1 · Lesson 1.1</span>
<h2>Foundations of creative writing &amp; finding your voice</h2>
<h3>Writing as a daily habit</h3>
<p>In <em>On Writing</em>, Stephen King treats writing as a trade built through steady practice, not a gift: <strong>read a lot, write a lot</strong>, and protect a fixed time and place to work — he calls it "the room." Talent matters less than showing up.</p>
<h3>What "voice" actually is</h3>
<ul>
<li><strong>Voice</strong> — the personality on the page: word choice, rhythm and attitude that stay recognizable no matter the topic.</li>
<li><strong>Style vs. voice</strong> — style is technique you can learn (grammar, structure, punctuation); voice is what remains after the technique becomes automatic.</li>
<li><strong>Finding it</strong> — voice emerges from volume of writing, not from searching for it directly. Write badly and often first.</li>
</ul>
<pre><code>Daily practice loop:
 1) Read 20-30 minutes (any genre)
 2) Free-write 10-15 minutes, no editing, no stopping
 3) Keep exactly one honest sentence from today
</code></pre>
<div class="callout"><span class="badge">Key idea</span> "First drafts are for getting the story down, not getting it right" — the habit that unlocks every other skill in this course.</div>`,
    `<span class="eyebrow">CMC201c · Chương 1 · Bài 1.1</span>
<h2>Nền tảng viết sáng tạo &amp; tìm giọng văn</h2>
<h3>Viết như một thói quen hằng ngày</h3>
<p>Trong <em>On Writing</em>, Stephen King coi viết là một nghề được luyện qua thực hành đều đặn, không phải năng khiếu: <strong>đọc nhiều, viết nhiều</strong>, và giữ một khoảng thời gian/không gian cố định để làm việc — ông gọi đó là "căn phòng". Năng khiếu quan trọng ít hơn việc chịu ngồi vào bàn.</p>
<h3>"Giọng văn" thực chất là gì</h3>
<ul>
<li><strong>Giọng văn (voice)</strong> — cá tính hiện trên trang viết: cách chọn từ, nhịp câu, thái độ vẫn nhận ra được dù đổi đề tài.</li>
<li><strong>Style vs. voice</strong> — style là kỹ thuật học được (ngữ pháp, cấu trúc, dấu câu); voice là phần còn lại sau khi kỹ thuật đã thành phản xạ.</li>
<li><strong>Cách tìm ra nó</strong> — giọng văn hiện ra từ lượng chữ đã viết, không phải từ việc đi tìm nó trực tiếp. Viết dở và viết nhiều trước đã.</li>
</ul>
<pre><code>Vòng luyện hằng ngày:
 1) Đọc 20-30 phút (thể loại tuỳ ý)
 2) Viết tự do 10-15 phút, không sửa, không dừng
 3) Giữ lại đúng một câu thật lòng của hôm nay
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> "Bản thảo đầu tay là để có câu chuyện trên giấy, không phải để đúng ngay" — thói quen mở khoá mọi kỹ năng khác của môn này.</div>`,
  ]]);

const c1q = quiz('cmc201c-quiz-1', 'Quiz 1 — Foundations & voice|||Quiz 1 — Nền tảng & giọng văn', [
  { id: 'q1', question: 'Theo Stephen King trong "On Writing", điều quan trọng nhất để trở thành người viết là?', options: ['Có năng khiếu trời cho', 'Đọc nhiều và viết nhiều đều đặn', 'Chỉ viết khi có cảm hứng', 'Học thuộc ngữ pháp trước'], correctIndex: 1, explanation: 'King nhấn mạnh thói quen: đọc nhiều, viết nhiều, giữ giờ viết cố định.' },
  { id: 'q2', question: '"Giọng văn" (voice) khác "style" ở điểm nào?', options: ['Voice là kỹ thuật học được, style là bản năng', 'Style là kỹ thuật học được, voice là cá tính còn lại sau kỹ thuật', 'Hai từ này là một, không khác nhau', 'Voice chỉ áp dụng cho thơ'], correctIndex: 1, explanation: 'Style là kỹ thuật (ngữ pháp, cấu trúc); voice là cá tính riêng còn lại.' },
  { id: 'q3', question: 'Vai trò của bản thảo đầu tay (first draft) là gì?', options: ['Phải hoàn hảo ngay lần viết đầu', 'Đưa câu chuyện xuống giấy, chưa cần đúng', 'Chỉ dùng để tập gõ máy', 'Không cần viết, chỉ cần nghĩ trong đầu'], correctIndex: 1, explanation: 'Bản thảo đầu là để có nội dung; việc "đúng" thuộc về các lượt sửa sau.' },
]);

const c2 = doc('cmc201c-2-1-storytelling-structure', '2.1 — Storytelling & story structure|||2.1 — Kể chuyện & cấu trúc câu chuyện',
  'Câu chuyện = nhân vật theo đuổi mong muốn trước trở ngại (McKee); cấu trúc 3 hồi; biến cố khởi đầu, cao trào, thay đổi giá trị.',
  [[
    `<span class="eyebrow">CMC201c · Chapter 2 · Lesson 2.1</span>
<h2>Storytelling &amp; story structure</h2>
<h3>What a story is</h3>
<p>In <em>Story</em>, Robert McKee defines a story as a character pursuing a <strong>desire</strong> against <strong>obstacles</strong>, causing a change in that character's life from positive to negative or negative to positive — a "value change." No obstacle, no story.</p>
<h3>Three-act structure</h3>
<ul>
<li><strong>Act 1 — Setup:</strong> introduce the character and their ordinary world, then an <strong>inciting incident</strong> disrupts it.</li>
<li><strong>Act 2 — Confrontation:</strong> the character pursues the goal through rising conflict; obstacles escalate.</li>
<li><strong>Act 3 — Resolution:</strong> a <strong>climax</strong> forces the final confrontation, followed by the outcome.</li>
</ul>
<pre><code>Story skeleton:
 ORDINARY WORLD -> INCITING INCIDENT
   -> rising obstacles (2nd act) -> CLIMAX
     -> RESOLUTION (value has changed)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Conflict is not decoration — it is the engine. Remove the obstacle and the story collapses, no matter how nice the sentences are.</div>`,
    `<span class="eyebrow">CMC201c · Chương 2 · Bài 2.1</span>
<h2>Kể chuyện &amp; cấu trúc câu chuyện</h2>
<h3>Câu chuyện là gì</h3>
<p>Trong <em>Story</em>, Robert McKee định nghĩa câu chuyện là một nhân vật theo đuổi một <strong>mong muốn (desire)</strong> trước <strong>trở ngại (obstacles)</strong>, khiến cuộc sống nhân vật đổi từ tích cực sang tiêu cực hoặc ngược lại — một "thay đổi giá trị". Không trở ngại thì không có chuyện.</p>
<h3>Cấu trúc 3 hồi</h3>
<ul>
<li><strong>Hồi 1 — Mở đầu:</strong> giới thiệu nhân vật và thế giới bình thường của họ, rồi một <strong>biến cố khởi đầu (inciting incident)</strong> phá vỡ nó.</li>
<li><strong>Hồi 2 — Đối đầu:</strong> nhân vật theo đuổi mục tiêu qua xung đột leo thang; trở ngại tăng dần.</li>
<li><strong>Hồi 3 — Kết thúc:</strong> một <strong>cao trào (climax)</strong> buộc cuộc đối đầu cuối cùng, sau đó là kết quả.</li>
</ul>
<pre><code>Khung câu chuyện:
 THẾ GIỚI BÌNH THƯỜNG -> BIẾN CỐ KHỞI ĐẦU
   -> trở ngại tăng dần (hồi 2) -> CAO TRÀO
     -> KẾT THÚC (giá trị đã đổi)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Xung đột không phải trang trí — nó là động cơ. Bỏ trở ngại đi thì câu chuyện sụp, câu văn hay cỡ nào cũng vô ích.</div>`,
  ]]);

const c2q = quiz('cmc201c-quiz-2', 'Quiz 2 — Storytelling & structure|||Quiz 2 — Kể chuyện & cấu trúc', [
  { id: 'q1', question: 'Theo Robert McKee, một câu chuyện luôn cần điều gì để tồn tại?', options: ['Một kết thúc có hậu', 'Trở ngại (obstacle) trước mong muốn của nhân vật', 'Nhiều nhân vật phụ', 'Bối cảnh lịch sử có thật'], correctIndex: 1, explanation: 'Không trở ngại thì không có xung đột, và không xung đột thì không có chuyện.' },
  { id: 'q2', question: 'Biến cố khởi đầu (inciting incident) nằm ở đâu trong cấu trúc 3 hồi?', options: ['Cuối hồi 3', 'Cuối hồi 1, phá vỡ thế giới bình thường', 'Giữa hồi 2', 'Không thuộc hồi nào'], correctIndex: 1, explanation: 'Nó kết thúc phần mở đầu và đẩy nhân vật vào hành động.' },
  { id: 'q3', question: '"Thay đổi giá trị" (value change) trong định nghĩa của McKee nghĩa là?', options: ['Nhân vật giàu lên về tiền bạc', 'Cuộc sống nhân vật đổi từ tích cực sang tiêu cực hoặc ngược lại', 'Câu chuyện đổi thể loại giữa truyện', 'Người đọc đổi cảm xúc khi đọc xong'], correctIndex: 1, explanation: 'Đó là định nghĩa cốt lõi: trạng thái sống của nhân vật đảo chiều qua câu chuyện.' },
]);

const c3 = doc('cmc201c-3-1-character-setting', '3.1 — Character & setting|||3.1 — Xây dựng nhân vật & bối cảnh',
  'Want vs need; cung đường thay đổi của nhân vật (arc); bối cảnh là lực tác động, không phải phông nền tĩnh.',
  [[
    `<span class="eyebrow">CMC201c · Chapter 3 · Lesson 3.1</span>
<h2>Building character &amp; setting</h2>
<h3>Want vs. need</h3>
<ul>
<li><strong>Want</strong> — the conscious goal the character chases (a job, a person, a prize).</li>
<li><strong>Need</strong> — the deeper truth the character must learn, often at odds with the want.</li>
<li>The gap between the two drives a believable <strong>character arc</strong> — the character ends the story changed, not just rewarded.</li>
</ul>
<h3>Setting as an active force</h3>
<p>A weak setting is furniture; a strong one applies pressure — weather, deadline, culture, or place shape what the character can and cannot do. Ask: "What would be different if this scene happened somewhere else?" If nothing changes, the setting is decoration.</p>
<pre><code>Character one-liner template:
 [Name] wants [want] because [wound/backstory],
 but really needs [need] to change.
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Give a character a specific, concrete detail (an object, a habit, a phrase) before a long description — one sharp detail beats three vague adjectives.</div>`,
    `<span class="eyebrow">CMC201c · Chương 3 · Bài 3.1</span>
<h2>Xây dựng nhân vật &amp; bối cảnh</h2>
<h3>Want vs. need (mong muốn vs. điều cần)</h3>
<ul>
<li><strong>Want</strong> — mục tiêu có ý thức nhân vật theo đuổi (công việc, một người, một giải thưởng).</li>
<li><strong>Need</strong> — sự thật sâu hơn nhân vật phải học ra, thường trái với want.</li>
<li>Khoảng cách giữa hai thứ này tạo nên <strong>cung đường thay đổi (character arc)</strong> đáng tin — nhân vật kết thúc câu chuyện đã thay đổi, không chỉ được thưởng.</li>
</ul>
<h3>Bối cảnh là lực tác động</h3>
<p>Bối cảnh yếu chỉ là đồ đạc trang trí; bối cảnh mạnh tạo áp lực — thời tiết, hạn chót, văn hoá, địa điểm định hình việc nhân vật có thể/không thể làm. Hỏi: "Nếu cảnh này xảy ra ở nơi khác thì có gì khác không?" Nếu không có gì đổi, bối cảnh chỉ là trang trí.</p>
<pre><code>Mẫu câu giới thiệu nhân vật:
 [Tên] muốn [want] vì [tổn thương/quá khứ],
 nhưng thực ra cần [need] để thay đổi.
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Cho nhân vật một chi tiết cụ thể, sắc nét (một vật, một tật, một câu nói) trước khi mô tả dài dòng — một chi tiết sắc hơn ba tính từ mơ hồ.</div>`,
  ]]);

const c3q = quiz('cmc201c-quiz-3', 'Quiz 3 — Character & setting|||Quiz 3 — Nhân vật & bối cảnh', [
  { id: 'q1', question: 'Khác biệt giữa "want" và "need" của nhân vật là gì?', options: ['Không khác nhau, chỉ là hai tên gọi', 'Want là mục tiêu có ý thức; need là sự thật sâu hơn nhân vật phải học ra', 'Want luôn xấu, need luôn tốt', 'Chỉ nhân vật phụ mới có need'], correctIndex: 1, explanation: 'Khoảng cách want–need tạo ra cung đường thay đổi (arc) đáng tin.' },
  { id: 'q2', question: 'Một bối cảnh được coi là "lực tác động" (không phải trang trí) khi nào?', options: ['Khi được mô tả rất dài', 'Khi nó thay đổi việc nhân vật có thể/không thể làm', 'Khi có tên địa danh thật', 'Khi xuất hiện ở đầu truyện'], correctIndex: 1, explanation: 'Nếu đổi bối cảnh mà không gì thay đổi, nó chỉ là phông nền tĩnh.' },
  { id: 'q3', question: 'Vì sao nên chọn một chi tiết cụ thể, sắc nét thay vì nhiều tính từ mô tả?', options: ['Vì viết ngắn hơn tốn ít giấy', 'Vì một chi tiết cụ thể tạo hình ảnh rõ và đáng nhớ hơn tính từ mơ hồ', 'Vì tính từ luôn sai ngữ pháp', 'Vì độc giả không đọc tính từ'], correctIndex: 1, explanation: 'Chi tiết cụ thể (một vật, một tật) khắc hoạ nhân vật hiệu quả hơn tính từ chung.' },
]);

const c4 = doc('cmc201c-4-1-description-dialogue-emotion', '4.1 — Description, dialogue & emotion|||4.1 — Mô tả, đối thoại & thể hiện cảm xúc',
  '"Show, don\'t tell"; nguyên tắc súc tích của Strunk & White; đối thoại mang subtext, không chỉ thông tin.',
  [[
    `<span class="eyebrow">CMC201c · Chapter 4 · Lesson 4.1</span>
<h2>Description, dialogue &amp; showing emotion</h2>
<h3>Show, don't tell</h3>
<p>Naming an emotion ("she was angry") tells the reader what to feel; showing it through action, physical detail or dialogue lets the reader feel it. <em>The Elements of Style</em> (Strunk &amp; White) backs this with two rules that apply directly: <strong>omit needless words</strong>, and <strong>use concrete, specific language</strong> over vague abstractions.</p>
<pre><code>Telling:  She was angry.
Showing:  She set the cup down hard enough to crack the saucer.
</code></pre>
<h3>Dialogue carries subtext</h3>
<ul>
<li>Real dialogue is rarely direct — people talk around what they mean. What a character <em>doesn't</em> say can matter more than what they do.</li>
<li>Cut small talk that doesn't reveal character or move the scene; every line should do one of those two jobs.</li>
<li>Vary dialogue tags sparingly — "said" is nearly invisible; action beats ("she folded her arms") can replace an adverb-heavy tag.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Strunk &amp; White's core rule for all creative prose: "Omit needless words." Cut the sentence until nothing more can be removed without losing meaning.</div>`,
    `<span class="eyebrow">CMC201c · Chương 4 · Bài 4.1</span>
<h2>Mô tả, đối thoại &amp; thể hiện cảm xúc</h2>
<h3>"Show, don't tell" (Diễn tả, đừng gọi tên)</h3>
<p>Gọi tên một cảm xúc ("cô ấy giận") là nói cho người đọc biết phải cảm gì; diễn tả nó qua hành động, chi tiết vật lý hay đối thoại lại giúp người đọc tự cảm thấy. <em>The Elements of Style</em> (Strunk &amp; White) ủng hộ điều này bằng hai nguyên tắc áp dụng trực tiếp: <strong>bỏ chữ thừa</strong>, và <strong>dùng ngôn ngữ cụ thể</strong> thay cho khái niệm mơ hồ.</p>
<pre><code>Gọi tên: Cô ấy giận.
Diễn tả: Cô đặt cốc xuống mạnh đến nứt cả đĩa lót.
</code></pre>
<h3>Đối thoại mang subtext (ẩn ý)</h3>
<ul>
<li>Đối thoại thật hiếm khi nói thẳng — người ta thường nói lượn quanh điều họ nghĩ. Điều nhân vật <em>không</em> nói có thể quan trọng hơn điều họ nói.</li>
<li>Cắt bỏ những câu xã giao không hé lộ nhân vật hay đẩy cảnh đi tới; mỗi câu nên làm một trong hai việc đó.</li>
<li>Dùng dẫn thoại ("nói") một cách tiết chế — nó gần như vô hình; các cử chỉ ("cô khoanh tay") có thể thay cho một dẫn thoại đầy trạng từ.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Nguyên tắc cốt lõi của Strunk &amp; White cho mọi văn xuôi sáng tạo: "Bỏ chữ thừa." Cắt câu tới khi không thể bỏ thêm gì mà vẫn giữ được nghĩa.</div>`,
  ]]);

const c4q = quiz('cmc201c-quiz-4', 'Quiz 4 — Description & dialogue|||Quiz 4 — Mô tả & đối thoại', [
  { id: 'q1', question: '"Show, don\'t tell" khuyên người viết làm gì?', options: ['Gọi thẳng tên cảm xúc để rõ nghĩa', 'Diễn tả cảm xúc qua hành động/chi tiết cụ thể thay vì gọi tên trực tiếp', 'Bỏ hết mô tả, chỉ dùng đối thoại', 'Dùng càng nhiều tính từ càng tốt'], correctIndex: 1, explanation: 'Diễn tả qua hành động/chi tiết giúp người đọc tự cảm nhận, không bị "bảo" phải cảm gì.' },
  { id: 'q2', question: 'Nguyên tắc cốt lõi của Strunk & White ("The Elements of Style") là gì?', options: ['Câu càng dài càng trang trọng', 'Bỏ chữ thừa (omit needless words)', 'Luôn dùng câu bị động', 'Tránh dùng động từ cụ thể'], correctIndex: 1, explanation: '"Omit needless words" là nguyên tắc súc tích nổi tiếng nhất của sách này.' },
  { id: 'q3', question: 'Subtext trong đối thoại nghĩa là gì?', options: ['Phụ đề dịch của đoạn đối thoại', 'Ý nghĩa ẩn sau lời nói — điều nhân vật thật sự nghĩ nhưng không nói thẳng', 'Đối thoại viết bằng chữ nhỏ hơn', 'Câu thoại dài hơn 1 dòng'], correctIndex: 1, explanation: 'Subtext là lớp nghĩa ẩn dưới câu chữ nói ra, thường quan trọng hơn nghĩa mặt chữ.' },
]);

const c5 = doc('cmc201c-5-1-genres', '5.1 — Genres: short story, poetry & creative nonfiction|||5.1 — Các thể loại: truyện ngắn, thơ & phi hư cấu sáng tạo',
  'Quy ước riêng của truyện ngắn (một biến cố, súc tích), thơ (hình ảnh, nhịp/vần), phi hư cấu sáng tạo (chuyện thật kể bằng kỹ thuật tường thuật).',
  [[
    `<span class="eyebrow">CMC201c · Chapter 5 · Lesson 5.1</span>
<h2>Genres: short story, poetry &amp; creative nonfiction</h2>
<h3>Short story</h3>
<p>Built around <strong>one</strong> incident and a small cast — there is no room for subplots. Every scene must justify its place; the form rewards compression, so the same "omit needless words" rule from Chapter 4 matters even more here.</p>
<h3>Poetry</h3>
<ul>
<li><strong>Imagery</strong> — concrete sensory pictures carry the meaning instead of stating it.</li>
<li><strong>Sound &amp; rhythm</strong> — meter (fixed pattern) or free verse (no fixed pattern), plus devices like alliteration and rhyme, used deliberately, not by accident.</li>
<li><strong>Compression</strong> — poetry is the most word-economical genre; every line earns its place.</li>
</ul>
<h3>Creative nonfiction</h3>
<p>A <strong>true</strong> story told with fiction's narrative techniques — scene, character, dialogue, structure — instead of a flat report of facts. Personal essays and long-form journalism both live here; the contract with the reader is that the facts are real even though the craft is borrowed from fiction.</p>
<div class="callout"><span class="badge">Key idea</span> Genre is a set of reader expectations, not a cage — knowing the convention is what lets you break it on purpose, for effect.</div>`,
    `<span class="eyebrow">CMC201c · Chương 5 · Bài 5.1</span>
<h2>Các thể loại: truyện ngắn, thơ &amp; phi hư cấu sáng tạo</h2>
<h3>Truyện ngắn</h3>
<p>Xây quanh <strong>một</strong> biến cố và dàn nhân vật nhỏ — không có chỗ cho tuyến truyện phụ. Mỗi cảnh phải có lý do tồn tại; thể loại này thưởng cho sự súc tích, nên nguyên tắc "bỏ chữ thừa" ở Chương 4 càng quan trọng hơn ở đây.</p>
<h3>Thơ</h3>
<ul>
<li><strong>Hình ảnh (imagery)</strong> — hình ảnh giác quan cụ thể mang nghĩa thay vì nói thẳng nghĩa.</li>
<li><strong>Âm &amp; nhịp</strong> — thể luật (khuôn cố định) hoặc thơ tự do (không khuôn cố định), cộng thủ pháp như điệp âm, vần — dùng có chủ đích, không tình cờ.</li>
<li><strong>Súc tích</strong> — thơ là thể loại tiết kiệm chữ nhất; mỗi dòng phải xứng đáng có mặt.</li>
</ul>
<h3>Phi hư cấu sáng tạo</h3>
<p>Một câu chuyện <strong>thật</strong> được kể bằng kỹ thuật tường thuật của hư cấu — cảnh, nhân vật, đối thoại, cấu trúc — thay vì tường trình sự kiện khô khan. Tản văn cá nhân và báo chí tường thuật dài đều thuộc đây; giao kèo với người đọc là dữ kiện có thật dù kỹ thuật viết mượn từ hư cấu.</p>
<div class="callout"><span class="badge">Ý chính</span> Thể loại là một tập kỳ vọng của người đọc, không phải cái lồng — biết quy ước là điều cho phép bạn phá nó có chủ đích, để tạo hiệu ứng.</div>`,
  ]]);

const c5q = quiz('cmc201c-quiz-5', 'Quiz 5 — Genres|||Quiz 5 — Thể loại', [
  { id: 'q1', question: 'Truyện ngắn thường được xây quanh điều gì?', options: ['Nhiều tuyến truyện phụ song song', 'Một biến cố duy nhất và dàn nhân vật nhỏ', 'Một khoảng thời gian nhiều năm', 'Không cần nhân vật chính'], correctIndex: 1, explanation: 'Sự súc tích của truyện ngắn buộc mọi thứ xoay quanh một biến cố trung tâm.' },
  { id: 'q2', question: 'Trong thơ, "imagery" (hình ảnh) có vai trò gì?', options: ['Trang trí cho đẹp câu chữ', 'Mang nghĩa qua hình ảnh giác quan cụ thể, thay vì nói thẳng', 'Thay thế hoàn toàn vần điệu', 'Chỉ dùng trong thơ tự do'], correctIndex: 1, explanation: 'Imagery truyền nghĩa gián tiếp qua hình ảnh cụ thể, đặc trưng của thơ.' },
  { id: 'q3', question: 'Phi hư cấu sáng tạo (creative nonfiction) khác báo cáo sự kiện thông thường ở đâu?', options: ['Dữ kiện trong đó không cần có thật', 'Kể chuyện thật bằng kỹ thuật tường thuật của hư cấu (cảnh, nhân vật, cấu trúc)', 'Không có tác giả cụ thể', 'Luôn viết bằng thơ'], correctIndex: 1, explanation: 'Nó giữ dữ kiện thật nhưng mượn kỹ thuật kể chuyện từ hư cấu.' },
]);

const c6 = doc('cmc201c-6-1-brand-digital-writing', '6.1 — Creative writing for brands & digital content|||6.1 — Viết sáng tạo cho thương hiệu & nội dung số',
  'Copywriting: công thức AIDA/PAS; kể chuyện thương hiệu; giọng & tông (voice & tone) nhất quán trên nội dung số.',
  [[
    `<span class="eyebrow">CMC201c · Chapter 6 · Lesson 6.1</span>
<h2>Creative writing for brands &amp; digital content</h2>
<h3>Copywriting formulas</h3>
<p>Storytelling skills translate directly into short-form marketing copy. Two workhorse structures:</p>
<pre><code>AIDA:  Attention -> Interest -> Desire -> Action
PAS:   Problem  -> Agitate  -> Solve  -> Action
</code></pre>
<p>Both are just compressed story structure (Chapter 2): a problem/incident, rising stakes, then a resolution the reader can act on.</p>
<h3>Brand storytelling</h3>
<p>The strongest brand stories cast the <strong>customer</strong> as the protagonist with a want and an obstacle, and the brand as the guide who helps them get there — not the hero of its own ad.</p>
<h3>Voice &amp; tone across content</h3>
<ul>
<li><strong>Voice</strong> stays constant (the brand's personality); <strong>tone</strong> shifts with context (a product recall vs. a product launch use the same voice, different tone).</li>
<li>Write a one-paragraph voice guide (3 adjectives + 3 "we never say this") before producing content at volume — it keeps many writers sounding like one brand.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Good brand copy is still storytelling with a word-count limit — cut everything that isn't the problem, the promise, or the action.</div>`,
    `<span class="eyebrow">CMC201c · Chương 6 · Bài 6.1</span>
<h2>Viết sáng tạo cho thương hiệu &amp; nội dung số</h2>
<h3>Công thức copywriting</h3>
<p>Kỹ năng kể chuyện chuyển thẳng sang nội dung marketing ngắn. Hai khung dùng nhiều nhất:</p>
<pre><code>AIDA: Chú ý -> Thích thú -> Khao khát -> Hành động
PAS:  Vấn đề -> Khoét sâu -> Giải quyết -> Hành động
</code></pre>
<p>Cả hai chỉ là cấu trúc câu chuyện được nén lại (Chương 2): một vấn đề/biến cố, mức độ khẩn cấp tăng dần, rồi một giải pháp người đọc có thể hành động ngay.</p>
<h3>Kể chuyện thương hiệu</h3>
<p>Những câu chuyện thương hiệu mạnh nhất đặt <strong>khách hàng</strong> làm nhân vật chính có mong muốn và trở ngại, còn thương hiệu là người dẫn đường giúp họ đạt được — không phải chính thương hiệu làm người hùng trong quảng cáo của mình.</p>
<h3>Giọng & tông trên nội dung số</h3>
<ul>
<li><strong>Voice (giọng)</strong> giữ nguyên (cá tính thương hiệu); <strong>tone (tông)</strong> thay đổi theo tình huống (thu hồi sản phẩm vs. ra mắt sản phẩm dùng cùng voice, khác tone).</li>
<li>Viết một đoạn hướng dẫn giọng văn (3 tính từ + 3 điều "không bao giờ nói") trước khi sản xuất nội dung số lượng lớn — giúp nhiều người viết vẫn nghe như một thương hiệu.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Copy thương hiệu tốt vẫn là kể chuyện, chỉ có giới hạn số chữ — cắt hết những gì không phải vấn đề, lời hứa, hoặc hành động.</div>`,
  ]]);

const c6q = quiz('cmc201c-quiz-6', 'Quiz 6 — Brand & digital writing|||Quiz 6 — Viết cho thương hiệu & nội dung số', [
  { id: 'q1', question: 'Công thức PAS trong copywriting theo thứ tự nào?', options: ['Problem -> Agitate -> Solve', 'Attention -> Interest -> Desire', 'Solve -> Problem -> Agitate', 'Agitate -> Solve -> Problem'], correctIndex: 0, explanation: 'PAS: Nêu vấn đề, khoét sâu nó, rồi đưa giải pháp/hành động.' },
  { id: 'q2', question: 'Trong kể chuyện thương hiệu hiệu quả, ai nên là "nhân vật chính"?', options: ['Bản thân thương hiệu', 'Khách hàng, với thương hiệu là người dẫn đường', 'Đối thủ cạnh tranh', 'Người sáng lập công ty'], correctIndex: 1, explanation: 'Thương hiệu mạnh đặt khách hàng làm nhân vật chính, mình chỉ là người giúp đỡ.' },
  { id: 'q3', question: 'Khác biệt giữa "voice" và "tone" của thương hiệu là gì?', options: ['Không khác nhau', 'Voice là cá tính cố định; tone thay đổi theo tình huống/ngữ cảnh', 'Tone cố định; voice thay đổi theo kênh', 'Cả hai chỉ áp dụng cho quảng cáo in'], correctIndex: 1, explanation: 'Voice giữ nguyên xuyên suốt; tone linh hoạt theo bối cảnh giao tiếp.' },
]);

const c7 = doc('cmc201c-7-1-editing-revision-workshop', '7.1 — Editing, revision & feedback (workshop)|||7.1 — Biên tập, sửa bản thảo & phản hồi (workshop)',
  '"Bản thảo tệp đầu tiên đáng lẽ phải tệp" (Lamott); các lượt sửa: cấu trúc → câu chữ → soát lỗi; cho/nhận phản hồi workshop.',
  [[
    `<span class="eyebrow">CMC201c · Chapter 7 · Lesson 7.1</span>
<h2>Editing, revision &amp; workshop feedback</h2>
<h3>"Shitty first drafts"</h3>
<p>In <em>Bird by Bird</em>, Anne Lamott argues every good piece starts as a bad first draft, and the fix is never to skip that stage — it's to accept it and revise "bird by bird," one small, manageable piece at a time instead of trying to fix everything at once.</p>
<h3>Revision passes, in order</h3>
<pre><code>Pass 1 - Structure:  does the story/argument work at all? Cut/reorder scenes.
Pass 2 - Line edit:  sentence-level clarity, voice, "omit needless words."
Pass 3 - Proofread:  spelling, grammar, formatting — last, never first.
</code></pre>
<p>Doing these out of order wastes effort — polishing sentences that get cut in the structure pass is lost work.</p>
<h3>Giving &amp; receiving workshop feedback</h3>
<ul>
<li>Feedback should describe the <strong>effect</strong> on the reader ("I got confused about who was speaking here"), not just a verdict ("this is bad").</li>
<li>As the writer receiving feedback: listen and take notes without arguing in the moment; you decide what to use later.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Revision is not punishment for writing badly — it's the actual craft. The first draft is just raw material for it.</div>`,
    `<span class="eyebrow">CMC201c · Chương 7 · Bài 7.1</span>
<h2>Biên tập, sửa bản thảo &amp; phản hồi workshop</h2>
<h3>"Bản thảo đầu tay tệp" (shitty first drafts)</h3>
<p>Trong <em>Bird by Bird</em>, Anne Lamott cho rằng mọi tác phẩm hay đều bắt đầu từ một bản thảo đầu tệp, và cách sửa không phải là bỏ qua giai đoạn đó — mà là chấp nhận nó và sửa "từng con chim một" (bird by bird), từng phần nhỏ vừa sức, thay vì cố sửa hết mọi thứ cùng lúc.</p>
<h3>Các lượt sửa, theo thứ tự</h3>
<pre><code>Lượt 1 - Cấu trúc:  câu chuyện/luận điểm có ổn không? Cắt/xếp lại cảnh.
Lượt 2 - Câu chữ:   rõ nghĩa ở cấp câu, giọng văn, "bỏ chữ thừa."
Lượt 3 - Soát lỗi:  chính tả, ngữ pháp, định dạng — làm cuối, không làm trước.
</code></pre>
<p>Làm sai thứ tự này tốn công vô ích — mài câu chữ cho một đoạn sẽ bị cắt ở lượt cấu trúc là công sức bỏ đi.</p>
<h3>Cho &amp; nhận phản hồi workshop</h3>
<ul>
<li>Phản hồi nên mô tả <strong>hiệu ứng</strong> lên người đọc ("mình bị rối không biết ai đang nói ở đoạn này"), không chỉ phán xét ("đoạn này dở").</li>
<li>Khi là người viết nhận phản hồi: lắng nghe và ghi chú, không tranh luận ngay lúc đó; bạn quyết định dùng gì sau.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Sửa bản thảo không phải hình phạt vì viết dở — đó mới là nghề thật. Bản thảo đầu chỉ là nguyên liệu thô cho nó.</div>`,
  ]]);

const c7q = quiz('cmc201c-quiz-7', 'Quiz 7 — Editing & workshop|||Quiz 7 — Biên tập & workshop', [
  { id: 'q1', question: 'Theo Anne Lamott ("Bird by Bird"), nên làm gì với bản thảo đầu tay tệ?', options: ['Bỏ viết, chờ cảm hứng tốt hơn', 'Chấp nhận nó và sửa từng phần nhỏ vừa sức', 'Xoá và viết lại từ đầu bằng văn phong khác', 'Gửi đăng ngay, biên tập viên sẽ sửa'], correctIndex: 1, explanation: 'Lamott khuyên sửa "bird by bird" — từng phần nhỏ, không cố sửa hết cùng lúc.' },
  { id: 'q2', question: 'Thứ tự đúng của các lượt sửa bản thảo là gì?', options: ['Soát lỗi → câu chữ → cấu trúc', 'Cấu trúc → câu chữ → soát lỗi', 'Câu chữ → cấu trúc → soát lỗi', 'Không có thứ tự, làm cùng lúc'], correctIndex: 1, explanation: 'Sửa cấu trúc trước tránh mài câu chữ cho đoạn sẽ bị cắt.' },
  { id: 'q3', question: 'Phản hồi workshop hiệu quả nên tập trung vào điều gì?', options: ['Phán xét bản thảo hay hay dở', 'Mô tả hiệu ứng cụ thể lên người đọc khi đọc đoạn đó', 'Chỉ khen, không góp ý', 'So sánh với tác giả nổi tiếng'], correctIndex: 1, explanation: 'Mô tả hiệu ứng ("tôi rối ở đoạn này") giúp tác giả sửa đúng chỗ, hơn là chỉ phán xét.' },
]);

const c8 = doc('cmc201c-8-1-publishing-portfolio', '8.1 — Publishing, portfolio & professional writing|||8.1 — Xuất bản, xây dựng portfolio & viết chuyên nghiệp',
  'Gửi bài cho tạp chí văn học/nền tảng số; xây portfolio; các hướng nghề viết chuyên nghiệp (copywriter, content writer, freelance).',
  [[
    `<span class="eyebrow">CMC201c · Chapter 8 · Lesson 8.1</span>
<h2>Publishing, portfolio &amp; professional writing</h2>
<h3>Getting published, at small scale</h3>
<ul>
<li><strong>Literary magazines</strong> (print or online) accept short story, poetry and creative-nonfiction submissions — read a magazine's back issues before submitting to match its taste.</li>
<li><strong>Self-publishing platforms</strong> (a blog, Medium, Substack) remove the gatekeeper and let you build an audience directly, at the cost of no external editor catching your mistakes.</li>
<li>A short, professional <strong>query/pitch</strong> — one line hooking the piece, why it fits this outlet, and a brief bio — is the standard way to approach an editor.</li>
</ul>
<h3>Building a portfolio</h3>
<p>Curate, don't dump — 4-6 pieces that show range (a story, a piece of brand copy, an edited-down sample) beat twenty mediocre ones. For content/copywriting roles, show the <strong>brief</strong> next to the piece: what the client asked for, and what you wrote to answer it.</p>
<h3>Professional paths</h3>
<p>Creative writing skills feed directly into <strong>copywriter</strong>, <strong>content writer</strong>, and <strong>social media/brand storyteller</strong> roles, plus freelance essay and fiction writing on the side. The craft (voice, structure, editing) is identical — only the word count and the client change.</p>
<div class="callout"><span class="badge">Key idea</span> A portfolio is itself a piece of writing about you — apply the same "omit needless words" and "show, don't tell" rules to how you present your own work.</div>`,
    `<span class="eyebrow">CMC201c · Chương 8 · Bài 8.1</span>
<h2>Xuất bản, xây dựng portfolio &amp; viết chuyên nghiệp</h2>
<h3>Được đăng bài, ở quy mô nhỏ</h3>
<ul>
<li><strong>Tạp chí văn học</strong> (giấy hoặc online) nhận bài truyện ngắn, thơ, phi hư cấu sáng tạo — đọc vài số cũ của tạp chí trước khi gửi để hợp gu.</li>
<li><strong>Nền tảng tự xuất bản</strong> (blog cá nhân, Medium, Substack) bỏ qua bước duyệt và cho bạn xây độc giả trực tiếp, đổi lại không có biên tập viên ngoài bắt lỗi giúp.</li>
<li>Một <strong>thư giới thiệu/pitch</strong> ngắn, chuyên nghiệp — một câu hấp dẫn về bài viết, vì sao hợp với nơi này, và một tiểu sử ngắn — là cách chuẩn để tiếp cận biên tập viên.</li>
</ul>
<h3>Xây dựng portfolio</h3>
<p>Chọn lọc, không đổ hết vào — 4-6 bài cho thấy sự đa dạng (một truyện, một đoạn copy thương hiệu, một mẫu đã biên tập gọn) tốt hơn hai mươi bài xoàng. Với vai trò nội dung/copywriting, đặt <strong>brief</strong> cạnh bài viết: khách hàng yêu cầu gì, và bạn viết gì để đáp ứng.</p>
<h3>Các hướng nghề chuyên nghiệp</h3>
<p>Kỹ năng viết sáng tạo chuyển thẳng sang vai trò <strong>copywriter</strong>, <strong>content writer</strong>, và <strong>người kể chuyện thương hiệu/mạng xã hội</strong>, cộng thêm viết tản văn/truyện tự do (freelance) làm thêm. Nghề (giọng văn, cấu trúc, biên tập) giống nhau — chỉ số chữ và khách hàng thay đổi.</p>
<div class="callout"><span class="badge">Ý chính</span> Portfolio chính nó cũng là một bài viết về bạn — áp cùng nguyên tắc "bỏ chữ thừa" và "show, don't tell" vào cách bạn trình bày tác phẩm của mình.</div>`,
  ]]);

const c8q = quiz('cmc201c-quiz-8', 'Quiz 8 — Publishing & portfolio|||Quiz 8 — Xuất bản & portfolio', [
  { id: 'q1', question: 'Trước khi gửi bài cho một tạp chí văn học, nên làm gì?', options: ['Gửi ngay không cần tìm hiểu', 'Đọc vài số cũ của tạp chí để hợp gu', 'Chỉ gửi bài dài nhất mình có', 'Không cần viết thư giới thiệu'], correctIndex: 1, explanation: 'Đọc số cũ giúp biết tạp chí thích thể loại/văn phong nào, tăng khả năng được nhận.' },
  { id: 'q2', question: 'Một portfolio viết tốt nên có đặc điểm gì?', options: ['Đưa vào càng nhiều bài càng tốt', 'Chọn lọc 4-6 bài cho thấy sự đa dạng, thay vì đổ hết vào', 'Chỉ gồm bài dài nhất', 'Không cần kèm brief/yêu cầu ban đầu'], correctIndex: 1, explanation: 'Chất lượng và sự đa dạng quan trọng hơn số lượng; brief giúp người xem hiểu bối cảnh bài viết.' },
  { id: 'q3', question: 'Điều gì KHÔNG đổi khi chuyển từ viết sáng tạo cá nhân sang viết chuyên nghiệp (copywriter, content writer)?', options: ['Số lượng chữ luôn giữ nguyên', 'Nghề cốt lõi: giọng văn, cấu trúc, biên tập', 'Khách hàng luôn giống nhau', 'Không cần biên tập nữa'], correctIndex: 1, explanation: 'Chỉ số chữ và khách hàng thay đổi; kỹ năng nền (voice, cấu trúc, sửa bản thảo) vẫn vậy.' },
]);

const taiLieu = doc('cmc201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: 4 sách giáo trình tham khảo (King, Lamott, Strunk & White, McKee), tài liệu miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">CMC201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Creative Writing for communication &amp; marketing — voice, storytelling, character, genres, brand copy, editing — in one place. The full official FLM slides live on FLM; below are the reference books this course draws on plus free, legal resources.</p>
<h3>📗 Reference books (cited in this course)</h3>
<ul>
<li><a href="https://www.goodreads.com/book/show/10569.On_Writing" target="_blank" rel="noopener"><em>On Writing</em> — Stephen King</a> — writing as daily craft, voice (Chapter 1)</li>
<li><a href="https://www.goodreads.com/book/show/6398.Bird_by_Bird" target="_blank" rel="noopener"><em>Bird by Bird</em> — Anne Lamott</a> — first drafts, revision, workshop (Chapter 7)</li>
<li><a href="https://www.goodreads.com/book/show/33514.The_Elements_of_Style" target="_blank" rel="noopener"><em>The Elements of Style</em> — Strunk &amp; White</a> — concise, concrete prose (Chapter 4)</li>
<li><a href="https://www.goodreads.com/book/show/68848.Story" target="_blank" rel="noopener"><em>Story</em> — Robert McKee</a> — story structure, character (Chapters 2-3)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://owl.purdue.edu/owl/subject_specific_writing/creative_writing/index.html" target="_blank" rel="noopener">Purdue OWL — Creative Writing</a> — free academic writing-lab guides</li>
<li><a href="https://blog.reedsy.com/" target="_blank" rel="noopener">Reedsy Blog</a> — craft articles on fiction, editing &amp; publishing</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@shaelinwrites" target="_blank" rel="noopener">Shaelin Writes</a> — craft breakdowns (voice, structure, revision)</li>
<li><a href="https://www.youtube.com/@JennaMoreci" target="_blank" rel="noopener">Jenna Moreci</a> — practical fiction-writing advice</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — daily writing habit, voice (King), concise/concrete prose (Strunk &amp; White).</li>
<li><strong>Practice</strong> — write short scenes applying story structure &amp; character want/need (McKee).</li>
<li><strong>Go deeper</strong> — try one piece per genre (short story, poem, personal essay), then a piece of brand copy.</li>
<li><strong>Job-ready</strong> — revise with the 3-pass method (Lamott), workshop with peers, build a 4-6 piece portfolio.</li>
</ol></div>`,
    `<span class="eyebrow">CMC201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Viết sáng tạo cho truyền thông &amp; marketing — giọng văn, kể chuyện, nhân vật, thể loại, copy thương hiệu, biên tập — gom về một chỗ. Slide chính thức đầy đủ nằm trên FLM; bên dưới là các sách giáo trình môn này dùng cùng nguồn miễn phí, hợp pháp.</p>
<h3>📗 Sách tham khảo (được trích dẫn trong môn)</h3>
<ul>
<li><a href="https://www.goodreads.com/book/show/10569.On_Writing" target="_blank" rel="noopener"><em>On Writing</em> — Stephen King</a> — viết như nghề hằng ngày, giọng văn (Chương 1)</li>
<li><a href="https://www.goodreads.com/book/show/6398.Bird_by_Bird" target="_blank" rel="noopener"><em>Bird by Bird</em> — Anne Lamott</a> — bản thảo đầu, sửa bài, workshop (Chương 7)</li>
<li><a href="https://www.goodreads.com/book/show/33514.The_Elements_of_Style" target="_blank" rel="noopener"><em>The Elements of Style</em> — Strunk &amp; White</a> — văn xuôi súc tích, cụ thể (Chương 4)</li>
<li><a href="https://www.goodreads.com/book/show/68848.Story" target="_blank" rel="noopener"><em>Story</em> — Robert McKee</a> — cấu trúc câu chuyện, nhân vật (Chương 2-3)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://owl.purdue.edu/owl/subject_specific_writing/creative_writing/index.html" target="_blank" rel="noopener">Purdue OWL — Creative Writing</a> — hướng dẫn học thuật miễn phí</li>
<li><a href="https://blog.reedsy.com/" target="_blank" rel="noopener">Reedsy Blog</a> — bài viết về nghề: hư cấu, biên tập &amp; xuất bản</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@shaelinwrites" target="_blank" rel="noopener">Shaelin Writes</a> — phân tích nghề viết (giọng văn, cấu trúc, sửa bài)</li>
<li><a href="https://www.youtube.com/@JennaMoreci" target="_blank" rel="noopener">Jenna Moreci</a> — lời khuyên thực tế cho viết hư cấu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — thói quen viết hằng ngày, giọng văn (King), văn xuôi súc tích/cụ thể (Strunk &amp; White).</li>
<li><strong>Luyện tập</strong> — viết cảnh ngắn áp dụng cấu trúc câu chuyện &amp; want/need nhân vật (McKee).</li>
<li><strong>Đào sâu</strong> — thử một bài mỗi thể loại (truyện ngắn, thơ, tản văn), rồi một đoạn copy thương hiệu.</li>
<li><strong>Sẵn sàng đi làm</strong> — sửa bài theo 3 lượt (Lamott), workshop với bạn học, xây portfolio 4-6 bài.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CMC201c',
    slug: 'cmc201c-creative-writing',
    title: 'Creative Writing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CMC201c.webp',
    shortDescription: 'Creative writing for communication & marketing — voice, storytelling & structure, character, description, genres, brand copywriting, editing & workshop, publishing & portfolio. Bilingual, with examples & quizzes.|||Viết sáng tạo cho truyền thông & marketing — giọng văn, kể chuyện & cấu trúc, nhân vật, mô tả, thể loại, copywriting thương hiệu, biên tập & workshop, xuất bản & portfolio. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>CMC201c — Creative Writing</strong> (kỳ 2, khối Quản trị Kinh doanh) dạy viết sáng tạo ứng dụng cho <strong>truyền thông/marketing</strong>. Từ <strong>giọng văn &amp; thói quen viết</strong> (King) → <strong>kể chuyện &amp; cấu trúc câu chuyện</strong> (McKee) → <strong>nhân vật &amp; bối cảnh</strong> → <strong>mô tả, đối thoại &amp; cảm xúc</strong> (Strunk &amp; White) → <strong>thể loại</strong> (truyện ngắn, thơ, phi hư cấu sáng tạo) → <strong>viết cho thương hiệu &amp; nội dung số</strong> (copywriting) → <strong>biên tập &amp; workshop</strong> (Lamott) → <strong>xuất bản &amp; portfolio</strong>. Song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Viết như thói quen hằng ngày, tìm giọng văn; câu chuyện = nhân vật theo đuổi mong muốn trước trở ngại, cấu trúc 3 hồi; want vs. need, cung đường thay đổi nhân vật, bối cảnh là lực tác động; show-don\'t-tell, nguyên tắc súc tích (omit needless words), subtext trong đối thoại; quy ước truyện ngắn/thơ/phi hư cấu sáng tạo; công thức copywriting AIDA/PAS, kể chuyện thương hiệu, voice vs. tone; ba lượt sửa bản thảo, cho/nhận phản hồi workshop; gửi bài xuất bản, xây portfolio, hướng nghề viết chuyên nghiệp.',
    requirements: 'Không yêu cầu kiến thức viết chuyên sâu trước đó — chỉ cần đọc/viết tiếng Việt hoặc tiếng Anh cơ bản và sẵn sàng luyện viết thường xuyên.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách giáo trình (King, Lamott, Strunk & White, McKee), tài liệu miễn phí, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Viết sáng tạo là gì, vì sao ngành truyền thông/marketing cần.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng & giọng văn|||Chapter 1 — Foundations & voice', description: 'Viết như thói quen, tìm giọng văn (On Writing).', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kể chuyện & cấu trúc|||Chapter 2 — Storytelling & structure', description: 'Nhân vật, mong muốn, trở ngại, 3 hồi (Story).', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nhân vật & bối cảnh|||Chapter 3 — Character & setting', description: 'Want vs. need, cung đường thay đổi, bối cảnh là lực.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô tả, đối thoại & cảm xúc|||Chapter 4 — Description & dialogue', description: 'Show-don\'t-tell, súc tích (Elements of Style), subtext.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Các thể loại|||Chapter 5 — Genres', description: 'Truyện ngắn, thơ, phi hư cấu sáng tạo.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Viết cho thương hiệu & nội dung số|||Chapter 6 — Brand & digital writing', description: 'AIDA/PAS, kể chuyện thương hiệu, voice & tone.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Biên tập & workshop|||Chapter 7 — Editing & workshop', description: 'Bản thảo đầu tệp, 3 lượt sửa, phản hồi (Bird by Bird).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xuất bản & portfolio|||Chapter 8 — Publishing & portfolio', description: 'Gửi bài, xây portfolio, hướng nghề viết chuyên nghiệp.', lessons: [c8, c8q] },
  ],
};
