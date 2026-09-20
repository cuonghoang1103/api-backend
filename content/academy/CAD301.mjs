/**
 * CAD301 — Creative Advertising (Quảng cáo sáng tạo). Ngành Truyền thông FPTU.
 * Môn KHÔNG có trong FLM → khung bám giáo trình chuẩn quốc tế: Altstiel & Grow
 * "Advertising Creative"; Mario Pricken "Creative Advertising"; David Ogilvy
 * "Ogilvy on Advertising". 8 chương: quảng cáo & vai trò sáng tạo · quy trình
 * sáng tạo & big idea · chiến lược thông điệp · copywriting · art direction ·
 * quảng cáo đa kênh · chiến dịch tích hợp (IMC 360) · đo lường & đạo đức.
 * Song ngữ VI+EN, có framework + ví dụ chiến dịch thật + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${}; "&"→&amp; trong content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cad301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền tảng, giải thưởng & thư viện chiến dịch, công cụ thiết kế, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">CAD301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Creative Advertising</strong> — from the creative brief and the big idea to copywriting, art direction, multi-channel execution, integrated campaigns and measurement — gathered in one place. There is no single FLM textbook for this subject, so the course is built on the international standard references below.</p>
<h3>📗 Core books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Advertising+Creative%3A+Strategy%2C+Copy%2C+and+Design-p-9781544326610" target="_blank" rel="noopener"><em>Advertising Creative: Strategy, Copy, and Design</em> — Tom Altstiel &amp; Jean Grow</a> — the modern workhorse textbook.</li>
<li><a href="https://www.penguinrandomhouse.com/books/167925/ogilvy-on-advertising-by-david-ogilvy/" target="_blank" rel="noopener"><em>Ogilvy on Advertising</em> — David Ogilvy</a> — the classic on selling with words &amp; craft.</li>
<li><a href="https://thamesandhudson.com/creative-advertising-9780500289945" target="_blank" rel="noopener"><em>Creative Advertising: Ideas and Techniques from the World's Best Campaigns</em> — Mario Pricken</a> — a toolbox of idea-generation techniques.</li>
</ul>
<h3>🏆 Awards &amp; campaign libraries</h3>
<ul>
<li><a href="https://www.dandad.org/" target="_blank" rel="noopener">D&amp;AD</a> — the Yellow &amp; Black Pencils, the global craft benchmark.</li>
<li><a href="https://www.canneslions.com/" target="_blank" rel="noopener">Cannes Lions</a> — the world's leading creativity festival &amp; case-study archive.</li>
<li><a href="https://www.adforum.com/" target="_blank" rel="noopener">AdForum</a> — searchable archive of ads &amp; agencies worldwide.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — fast layout &amp; social-format templates.</li>
<li><a href="https://www.adobe.com/creativecloud.html" target="_blank" rel="noopener">Adobe Creative Cloud</a> — Photoshop, Illustrator, Premiere for pro art direction.</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — collaborative design, moodboards &amp; campaign key-visual mockups.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what advertising is, the creative brief, and how a big idea is born from an insight.</li>
<li><strong>Craft</strong> — copywriting (headlines, body, taglines) and art direction (layout, type, colour, image).</li>
<li><strong>Channels</strong> — adapt one idea across TVC, print, OOH, digital and social without losing it.</li>
<li><strong>Campaign &amp; impact</strong> — build a 360° integrated campaign, then measure it and keep it ethical.</li>
</ol></div>`,
    `<span class="eyebrow">CAD301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Quảng cáo sáng tạo</strong> — từ creative brief và big idea đến copywriting, art direction, triển khai đa kênh, chiến dịch tích hợp và đo lường — gom về một chỗ. Môn này không có giáo trình FLM riêng, nên khung được dựng trên các sách chuẩn quốc tế dưới đây.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Advertising+Creative%3A+Strategy%2C+Copy%2C+and+Design-p-9781544326610" target="_blank" rel="noopener"><em>Advertising Creative: Strategy, Copy, and Design</em> — Tom Altstiel &amp; Jean Grow</a> — giáo trình hiện đại, dùng nhiều nhất.</li>
<li><a href="https://www.penguinrandomhouse.com/books/167925/ogilvy-on-advertising-by-david-ogilvy/" target="_blank" rel="noopener"><em>Ogilvy on Advertising</em> — David Ogilvy</a> — kinh điển về bán hàng bằng chữ &amp; tay nghề.</li>
<li><a href="https://thamesandhudson.com/creative-advertising-9780500289945" target="_blank" rel="noopener"><em>Creative Advertising</em> — Mario Pricken</a> — hộp công cụ kỹ thuật sinh ý tưởng.</li>
</ul>
<h3>🏆 Giải thưởng &amp; thư viện chiến dịch</h3>
<ul>
<li><a href="https://www.dandad.org/" target="_blank" rel="noopener">D&amp;AD</a> — bút chì Vàng &amp; Đen, chuẩn tay nghề toàn cầu.</li>
<li><a href="https://www.canneslions.com/" target="_blank" rel="noopener">Cannes Lions</a> — liên hoan sáng tạo lớn nhất thế giới &amp; kho case-study.</li>
<li><a href="https://www.adforum.com/" target="_blank" rel="noopener">AdForum</a> — kho tra cứu quảng cáo &amp; agency toàn cầu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dàn trang &amp; template định dạng mạng xã hội nhanh.</li>
<li><a href="https://www.adobe.com/creativecloud.html" target="_blank" rel="noopener">Adobe Creative Cloud</a> — Photoshop, Illustrator, Premiere cho art direction chuyên nghiệp.</li>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — thiết kế cộng tác, moodboard &amp; dựng key-visual chiến dịch.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — quảng cáo là gì, creative brief, và big idea sinh ra từ insight thế nào.</li>
<li><strong>Tay nghề</strong> — copywriting (headline, body, tagline) và art direction (layout, chữ, màu, hình).</li>
<li><strong>Kênh</strong> — đưa một ý tưởng qua TVC, print, OOH, digital và social mà không đánh mất nó.</li>
<li><strong>Chiến dịch &amp; hiệu quả</strong> — dựng chiến dịch tích hợp 360°, rồi đo lường và giữ đúng đạo đức.</li>
</ol></div>`,
  ]]);

const intro = doc('cad301-0-1-overview', 'Course overview: Creative Advertising|||Tổng quan: Quảng cáo sáng tạo',
  'Quảng cáo sáng tạo là gì; khác biệt strategy vs creativity; lộ trình từ brief → big idea → thông điệp → copy & art → đa kênh → chiến dịch 360 → đo lường & đạo đức.',
  [[
    `<span class="eyebrow">CAD301 · Lesson 0.1 · Overview</span>
<h2>What is Creative Advertising?</h2>
<p class="lead"><strong>Advertising</strong> is paid, persuasive communication that moves a defined audience to think, feel or do something for a brand. <strong>Creative advertising</strong> is the discipline of doing that <em>memorably</em> — solving a business problem with an idea people actually want to watch, share and remember.</p>
<h3>Strategy vs. creativity</h3>
<ul>
<li><strong>Strategy = what to say</strong> — the single most persuasive, true thing about the brand for this audience.</li>
<li><strong>Creativity = how to say it</strong> — the surprising, human execution that makes the message land.</li>
</ul>
<p>Great work needs both: a sharp strategy with a dull execution is ignored; a dazzling execution with no strategy sells nothing.</p>
<h3>Roadmap</h3>
<p>Advertising &amp; the creative brief → the creative process &amp; the big idea → message strategy (positioning, USP, tone, RTB) → copywriting → art direction → multi-channel execution → integrated 360° campaigns → measurement &amp; ethics. Bilingual, with frameworks, real campaigns and a quiz each chapter.</p>
<div class="callout"><span class="badge">The bar</span> Nike's <em>Just Do It</em> is three words, but behind them sits a precise strategy — sell courage, not shoes. That is creative advertising: strategy you can feel.</div>`,
    `<span class="eyebrow">CAD301 · Bài 0.1 · Tổng quan</span>
<h2>Quảng cáo sáng tạo là gì?</h2>
<p class="lead"><strong>Quảng cáo</strong> là truyền thông thuyết phục có trả tiền, thúc một nhóm công chúng xác định nghĩ, cảm hoặc làm gì đó cho thương hiệu. <strong>Quảng cáo sáng tạo</strong> là làm điều đó một cách <em>đáng nhớ</em> — giải một bài toán kinh doanh bằng ý tưởng mà người ta thật sự muốn xem, chia sẻ và nhớ.</p>
<h3>Chiến lược vs. sáng tạo</h3>
<ul>
<li><strong>Chiến lược = nói gì</strong> — điều đúng và thuyết phục nhất về thương hiệu với công chúng này.</li>
<li><strong>Sáng tạo = nói thế nào</strong> — cách thể hiện bất ngờ, giàu chất người khiến thông điệp ghim lại.</li>
</ul>
<p>Việc hay cần cả hai: chiến lược sắc mà thể hiện nhạt sẽ bị lướt qua; thể hiện chói lọi mà không chiến lược thì chẳng bán được gì.</p>
<h3>Lộ trình</h3>
<p>Quảng cáo &amp; creative brief → quy trình sáng tạo &amp; big idea → chiến lược thông điệp (positioning, USP, tone, RTB) → copywriting → art direction → triển khai đa kênh → chiến dịch tích hợp 360° → đo lường &amp; đạo đức. Song ngữ, có framework, chiến dịch thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Chuẩn cần đạt</span> <em>Just Do It</em> của Nike chỉ ba chữ, nhưng sau nó là một chiến lược chính xác — bán sự can đảm, không bán giày. Đó là quảng cáo sáng tạo: chiến lược mà bạn cảm được.</div>`,
  ]]);

const c1 = doc('cad301-1-1-advertising-role', '1.1 — Advertising & the creative role|||1.1 — Quảng cáo & vai trò sáng tạo',
  'Quảng cáo là gì & vì sao tồn tại; các bên (client, agency, media); creative brief và các thành phần lõi.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 1 · Lesson 1.1</span>
<h2>Advertising &amp; the creative role</h2>
<h3>What advertising does</h3>
<p>Advertising exists to solve a <strong>business problem</strong> with communication — build awareness, shift perception, drive an action. It sits inside a system: the <strong>client</strong> (brand) owns the problem, the <strong>agency</strong> creates the work, and <strong>media</strong> carries it to the audience.</p>
<h3>The creative brief</h3>
<p>The <strong>creative brief</strong> is the bridge from strategy to idea — a one-page document that focuses the whole team. Its core parts:</p>
<pre><code>CREATIVE BRIEF
  Background   -> why are we advertising now?
  Objective    -> what must the work achieve? (one clear goal)
  Audience     -> who exactly are we talking to? (a real person)
  Insight      -> a true, useful tension in their life
  Proposition  -> the ONE thing to say (single-minded)
  Support/RTB  -> why should they believe it?
  Tone         -> how should it feel?
  Mandatories  -> logo, legal, channels, deadline
</code></pre>
<p>A weak brief produces weak work. The single hardest, most valuable line is the <strong>proposition</strong> — one message, not five.</p>
<div class="callout"><span class="badge">Real campaign</span> Nike's brief has always pointed at emotion, not product specs. From that focus came <em>Just Do It</em> — a proposition ("greatness is for everyone") an audience could act on.</div>`,
    `<span class="eyebrow">CAD301 · Chương 1 · Bài 1.1</span>
<h2>Quảng cáo &amp; vai trò sáng tạo</h2>
<h3>Quảng cáo làm gì</h3>
<p>Quảng cáo tồn tại để giải một <strong>bài toán kinh doanh</strong> bằng truyền thông — xây nhận biết, dịch chuyển nhận thức, thúc hành động. Nó nằm trong một hệ: <strong>client</strong> (thương hiệu) sở hữu bài toán, <strong>agency</strong> tạo ra tác phẩm, và <strong>media</strong> đưa nó tới công chúng.</p>
<h3>Creative brief</h3>
<p><strong>Creative brief</strong> là cây cầu từ chiến lược sang ý tưởng — một trang giấy hội tụ cả nhóm. Các phần lõi:</p>
<pre><code>CREATIVE BRIEF
  Bối cảnh      -> vì sao quảng cáo ngay lúc này?
  Mục tiêu      -> việc phải đạt là gì? (một đích rõ)
  Công chúng    -> ta nói với AI CHÍNH XÁC? (một con người thật)
  Insight       -> một căng thẳng đúng, hữu ích trong đời họ
  Proposition   -> MỘT điều để nói (đơn nhất)
  Hỗ trợ/RTB    -> vì sao họ nên tin?
  Tone          -> nên cảm thấy thế nào?
  Bắt buộc      -> logo, pháp lý, kênh, deadline
</code></pre>
<p>Brief yếu sinh ra việc yếu. Dòng khó và giá trị nhất là <strong>proposition</strong> — một thông điệp, không phải năm.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> Brief của Nike luôn trỏ vào cảm xúc, không vào thông số. Từ tiêu điểm đó ra đời <em>Just Do It</em> — một proposition ("sự vĩ đại dành cho mọi người") mà công chúng có thể hành động theo.</div>`,
  ]]);

const c1q = quiz('cad301-quiz-1', 'Quiz 1 — Advertising & the brief|||Quiz 1 — Quảng cáo & brief', [
  { id: 'q1', question: 'Mục đích gốc của một mẩu quảng cáo là?|||What is the root purpose of an ad?', options: ['Giải một bài toán kinh doanh bằng truyền thông|||Solve a business problem with communication', 'Đoạt giải sáng tạo|||Win a creativity award', 'Khoe kỹ xảo|||Show off production tricks', 'Chạy càng nhiều kênh càng tốt|||Run on as many channels as possible'], correctIndex: 0, explanation: 'Quảng cáo tồn tại để giải bài toán kinh doanh (nhận biết, nhận thức, hành động).' },
  { id: 'q2', question: 'Trong creative brief, "proposition" nên là?|||In a creative brief, the proposition should be?', options: ['Năm thông điệp cho chắc|||Five messages to be safe', 'MỘT điều đơn nhất để nói|||The ONE single-minded thing to say', 'Danh sách tính năng sản phẩm|||A list of product features', 'Ngân sách chiến dịch|||The campaign budget'], correctIndex: 1, explanation: 'Proposition là một thông điệp đơn nhất — dòng khó và giá trị nhất của brief.' },
  { id: 'q3', question: 'Ba bên chính trong hệ quảng cáo là?|||The three main parties in advertising are?', options: ['Client, agency, media', 'Nhà in, đài, rạp|||Printer, radio, cinema', 'Copywriter, diễn viên, đạo diễn|||Copywriter, actor, director', 'Facebook, Google, TikTok'], correctIndex: 0, explanation: 'Client sở hữu bài toán, agency tạo tác phẩm, media đưa tới công chúng.' },
]);

const c2 = doc('cad301-2-1-big-idea', '2.1 — The creative process & the big idea|||2.1 — Quy trình sáng tạo & big idea',
  'Insight → concept → execution; big idea là gì; kỹ thuật sinh ý tưởng (Pricken); phân biệt idea vs execution.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 2 · Lesson 2.1</span>
<h2>The creative process &amp; the big idea</h2>
<h3>Insight → concept → execution</h3>
<pre><code>INSIGHT     -> a true human tension ("I want to belong")
CONCEPT     -> the big idea that resolves it (the "what")
EXECUTION   -> the ads that express it (the "how", many)
</code></pre>
<p>A <strong>big idea</strong> is a single, ownable thought big enough to run for years and across every channel — yet simple enough to say in a sentence. One idea, many executions.</p>
<h3>Where ideas come from</h3>
<p>Ideas are not luck. Techniques (Mario Pricken, James Webb Young) make them repeatable: gather raw material → find the <strong>insight</strong> → provoke with tools (exaggeration, analogy, reversal, "what if", combining two worlds) → let it incubate → judge against the brief.</p>
<div class="callout"><span class="badge">Real campaign</span> Dove's <em>Real Beauty</em> grew from one insight — most women don't think they're beautiful. The big idea (celebrate real bodies) has powered TVCs, films, print and social for two decades. Apple's <em>Think Different</em> is the same: one idea, endless executions.</div>`,
    `<span class="eyebrow">CAD301 · Chương 2 · Bài 2.1</span>
<h2>Quy trình sáng tạo &amp; big idea</h2>
<h3>Insight → concept → execution</h3>
<pre><code>INSIGHT     -> một căng thẳng người thật ("Tôi muốn thuộc về")
CONCEPT     -> big idea giải nó (cái "gì")
EXECUTION   -> các mẩu quảng cáo thể hiện nó (cái "thế nào", nhiều)
</code></pre>
<p>Một <strong>big idea</strong> là một suy nghĩ đơn nhất, sở hữu được, đủ lớn để chạy nhiều năm và qua mọi kênh — mà vẫn đủ đơn giản để nói trong một câu. Một ý tưởng, nhiều thể hiện.</p>
<h3>Ý tưởng đến từ đâu</h3>
<p>Ý tưởng không phải may rủi. Kỹ thuật (Mario Pricken, James Webb Young) khiến nó lặp lại được: gom nguyên liệu → tìm <strong>insight</strong> → kích bằng công cụ (phóng đại, ẩn dụ, đảo ngược, "nếu như", ghép hai thế giới) → để ủ → chấm lại theo brief.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <em>Real Beauty</em> của Dove lớn lên từ một insight — hầu hết phụ nữ không nghĩ mình đẹp. Big idea (tôn vinh cơ thể thật) đã nuôi TVC, phim, print và social suốt hai thập kỷ. <em>Think Different</em> của Apple cũng vậy: một ý tưởng, vô số thể hiện.</div>`,
  ]]);

const c2q = quiz('cad301-quiz-2', 'Quiz 2 — The big idea|||Quiz 2 — Big idea', [
  { id: 'q1', question: 'Thứ tự đúng của quy trình sáng tạo là?|||The correct order of the creative process is?', options: ['Execution → concept → insight', 'Insight → concept → execution', 'Concept → insight → execution', 'Execution → insight → concept'], correctIndex: 1, explanation: 'Từ insight (căng thẳng người) → concept (big idea) → execution (các mẩu quảng cáo).' },
  { id: 'q2', question: 'Đặc điểm của một big idea là?|||A big idea is characterised by?', options: ['Chỉ chạy được một mẩu print|||Only works as one print ad', 'Một ý tưởng đơn nhất, chạy nhiều năm & mọi kênh|||One idea, runs for years across every channel', 'Một danh sách tính năng|||A list of features', 'Một khẩu hiệu dịch máy|||A machine-translated slogan'], correctIndex: 1, explanation: 'Big idea: một thought đơn nhất, sở hữu được, một ý tưởng — nhiều execution.' },
  { id: 'q3', question: '"Insight" trong sáng tạo là?|||An insight is?', options: ['Một con số doanh thu|||A revenue number', 'Một căng thẳng đúng, giàu chất người|||A true, human tension', 'Tên sản phẩm|||The product name', 'Ngân sách media|||The media budget'], correctIndex: 1, explanation: 'Insight là một sự thật/căng thẳng con người mà big idea giải quyết.' },
]);

const c3 = doc('cad301-3-1-message-strategy', '3.1 — Message strategy|||3.1 — Chiến lược thông điệp',
  'Positioning (Ries & Trout), USP (Rosser Reeves), tone & voice, RTB; chọn một chỗ đứng trong tâm trí.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 3 · Lesson 3.1</span>
<h2>Message strategy</h2>
<h3>Positioning</h3>
<p><strong>Positioning</strong> (Al Ries &amp; Jack Trout) is the place a brand owns in the customer's mind relative to rivals. You cannot own everything — pick one word. Volvo owns <em>safety</em>; a mind has room for only one leader per category.</p>
<h3>USP, RTB, tone &amp; voice</h3>
<ul>
<li><strong>USP (Unique Selling Proposition)</strong> — Rosser Reeves: one specific, differentiating benefit the competition can't or doesn't claim.</li>
<li><strong>RTB (Reason To Believe)</strong> — the proof that makes the claim credible (an ingredient, a demo, a stat, a guarantee).</li>
<li><strong>Tone &amp; voice</strong> — the consistent personality of how the brand speaks (playful, authoritative, warm). Voice is fixed; tone flexes by context.</li>
</ul>
<pre><code>CLAIM  -> "We try harder"        (USP / positioning: the No.2)
RTB    -> because we have to     (a believable reason)
TONE   -> honest, cheeky, human
</code></pre>
<div class="callout"><span class="badge">Real campaign</span> Avis turned a weakness into a position: <em>"We're No. 2. We try harder."</em> — a USP no market leader could copy, backed by a credible RTB. De Beers positioned diamonds as eternal love ("A Diamond is Forever").</div>`,
    `<span class="eyebrow">CAD301 · Chương 3 · Bài 3.1</span>
<h2>Chiến lược thông điệp</h2>
<h3>Positioning (định vị)</h3>
<p><strong>Positioning</strong> (Al Ries &amp; Jack Trout) là chỗ đứng thương hiệu sở hữu trong tâm trí khách hàng, so với đối thủ. Không thể sở hữu tất cả — chọn một từ. Volvo sở hữu <em>an toàn</em>; tâm trí chỉ có chỗ cho một người dẫn đầu mỗi ngành.</p>
<h3>USP, RTB, tone &amp; voice</h3>
<ul>
<li><strong>USP (điểm bán độc nhất)</strong> — Rosser Reeves: một lợi ích cụ thể, khác biệt mà đối thủ không thể hoặc không nói.</li>
<li><strong>RTB (lý do để tin)</strong> — bằng chứng khiến lời tuyên bố đáng tin (thành phần, demo, số liệu, cam kết).</li>
<li><strong>Tone &amp; voice</strong> — cá tính nhất quán trong cách thương hiệu nói (tinh nghịch, uy tín, ấm áp). Voice cố định; tone linh hoạt theo ngữ cảnh.</li>
</ul>
<pre><code>CLAIM  -> "We try harder"        (USP / định vị: kẻ số 2)
RTB    -> vì chúng tôi buộc phải  (lý do đáng tin)
TONE   -> thật thà, tinh nghịch, người
</code></pre>
<div class="callout"><span class="badge">Chiến dịch thật</span> Avis biến điểm yếu thành chỗ đứng: <em>"Chúng tôi là số 2. Chúng tôi cố gắng hơn."</em> — một USP mà kẻ dẫn đầu không sao chép nổi, có RTB đáng tin. De Beers định vị kim cương là tình yêu vĩnh cửu ("A Diamond is Forever").</div>`,
  ]]);

const c3q = quiz('cad301-quiz-3', 'Quiz 3 — Message strategy|||Quiz 3 — Chiến lược thông điệp', [
  { id: 'q1', question: 'Positioning (định vị) là?|||Positioning is?', options: ['Ngân sách quảng cáo|||The ad budget', 'Chỗ đứng thương hiệu sở hữu trong tâm trí khách hàng|||The place a brand owns in the customer mind', 'Vị trí đặt biển OOH|||Where the billboard is placed', 'Thứ tự hiển thị banner|||Banner display order'], correctIndex: 1, explanation: 'Positioning (Ries & Trout): chỗ đứng trong tâm trí, so với đối thủ — chọn một từ.' },
  { id: 'q2', question: 'RTB (Reason To Believe) dùng để?|||A Reason To Believe (RTB) is used to?', options: ['Làm lời tuyên bố trở nên đáng tin|||Make the claim credible', 'Tăng ngân sách|||Increase the budget', 'Đổi logo|||Change the logo', 'Chọn kênh media|||Choose the media channel'], correctIndex: 0, explanation: 'RTB là bằng chứng (thành phần, demo, số liệu, cam kết) khiến claim đáng tin.' },
  { id: 'q3', question: 'Khác nhau giữa voice và tone là?|||Voice vs tone differ how?', options: ['Giống hệt nhau|||They are identical', 'Voice cố định; tone linh hoạt theo ngữ cảnh|||Voice is fixed; tone flexes by context', 'Voice là màu; tone là font|||Voice is colour; tone is font', 'Voice là TVC; tone là print|||Voice is TVC; tone is print'], correctIndex: 1, explanation: 'Voice là cá tính cố định của thương hiệu; tone thay đổi theo ngữ cảnh.' },
]);

const c4 = doc('cad301-4-1-copywriting', '4.1 — Copywriting|||4.1 — Copywriting (viết lời quảng cáo)',
  'Headline (loại & vai trò), body copy, tagline, storytelling; AIDA; nguyên tắc Ogilvy về bán bằng chữ.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 4 · Lesson 4.1</span>
<h2>Copywriting</h2>
<h3>The parts of copy</h3>
<ul>
<li><strong>Headline</strong> — does 80% of the work; it must stop and reward the reader. Types: news, benefit, question, curiosity, command.</li>
<li><strong>Body copy</strong> — earns belief with specifics and proof; sells one idea, then asks for an action.</li>
<li><strong>Tagline</strong> — the brand's enduring line across campaigns (Nike: <em>Just Do It</em>).</li>
</ul>
<h3>Structure &amp; storytelling</h3>
<pre><code>AIDA
  Attention  -> the headline stops them
  Interest   -> a relevant hook
  Desire     -> the benefit made vivid
  Action     -> a clear next step
</code></pre>
<p>Stories out-sell arguments: a character, a tension, a resolution the brand enables. Ogilvy's rule — be specific, be truthful, and never bore the reader into buying.</p>
<div class="callout"><span class="badge">Real campaign</span> Ogilvy's Rolls-Royce headline — <em>"At 60 miles an hour the loudest noise comes from the electric clock"</em> — is a single, concrete, provable benefit doing the whole job. De Beers' <em>"A Diamond is Forever"</em> is a tagline that outlived its writers.</div>`,
    `<span class="eyebrow">CAD301 · Chương 4 · Bài 4.1</span>
<h2>Copywriting (viết lời quảng cáo)</h2>
<h3>Các thành phần của copy</h3>
<ul>
<li><strong>Headline</strong> — làm 80% công việc; phải chặn và thưởng cho người đọc. Loại: tin tức, lợi ích, câu hỏi, tò mò, mệnh lệnh.</li>
<li><strong>Body copy</strong> — giành niềm tin bằng chi tiết và bằng chứng; bán một ý, rồi kêu gọi hành động.</li>
<li><strong>Tagline</strong> — câu bền của thương hiệu qua các chiến dịch (Nike: <em>Just Do It</em>).</li>
</ul>
<h3>Cấu trúc &amp; storytelling</h3>
<pre><code>AIDA
  Attention  -> headline chặn họ lại
  Interest   -> một mấu nối liên quan
  Desire     -> lợi ích được làm sống động
  Action     -> một bước tiếp theo rõ ràng
</code></pre>
<p>Câu chuyện bán tốt hơn lập luận: một nhân vật, một căng thẳng, một lời giải mà thương hiệu tạo điều kiện. Nguyên tắc Ogilvy — cụ thể, trung thực, và đừng bao giờ làm người đọc chán tới mức không mua.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> Headline Rolls-Royce của Ogilvy — <em>"Ở 100km/h, tiếng ồn to nhất đến từ chiếc đồng hồ điện"</em> — là một lợi ích cụ thể, chứng minh được, làm trọn cả việc. <em>"A Diamond is Forever"</em> của De Beers là một tagline sống lâu hơn cả người viết ra nó.</div>`,
  ]]);

const c4q = quiz('cad301-quiz-4', 'Quiz 4 — Copywriting|||Quiz 4 — Copywriting', [
  { id: 'q1', question: 'Thành phần nào của copy làm phần lớn công việc thu hút?|||Which copy part does most of the attracting work?', options: ['Body copy', 'Headline', 'Legal disclaimer|||Dòng pháp lý', 'Logo'], correctIndex: 1, explanation: 'Ogilvy: headline làm ~80% công việc — phải chặn và thưởng người đọc.' },
  { id: 'q2', question: 'AIDA là viết tắt của?|||AIDA stands for?', options: ['Attention, Interest, Desire, Action', 'Audience, Idea, Design, Ad', 'Awareness, Insight, Data, Analytics', 'Art, Image, Detail, Angle'], correctIndex: 0, explanation: 'AIDA: Attention → Interest → Desire → Action, khung cấu trúc thuyết phục.' },
  { id: 'q3', question: 'Tagline khác headline ở chỗ?|||A tagline differs from a headline in that?', options: ['Tagline chỉ dùng một lần|||A tagline is used once', 'Tagline là câu bền của thương hiệu qua nhiều chiến dịch|||A tagline endures across campaigns', 'Tagline luôn dài hơn|||A tagline is always longer', 'Tagline chỉ có trên TV|||A tagline is TV-only'], correctIndex: 1, explanation: 'Tagline gắn với thương hiệu lâu dài; headline riêng cho từng mẩu.' },
]);

const c5 = doc('cad301-5-1-art-direction', '5.1 — Art direction & visual design|||5.1 — Art direction & thiết kế thị giác',
  'Layout (grid, focal point, Gestalt), typography, màu sắc & tâm lý màu, hình ảnh; quan hệ copy–visual.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 5 · Lesson 5.1</span>
<h2>Art direction &amp; visual design</h2>
<h3>Layout</h3>
<p><strong>Art direction</strong> decides how an idea looks and feels. Layout guides the eye: a clear <strong>focal point</strong>, a <strong>grid</strong> for order, visual hierarchy (what to see first, second, third), and <strong>Gestalt</strong> principles (proximity, similarity, closure) that make elements read as a group.</p>
<h3>Type, colour, image</h3>
<ul>
<li><strong>Typography</strong> — type has a voice: a typeface can feel luxurious, technical or friendly before a word is read.</li>
<li><strong>Colour</strong> — carries meaning &amp; emotion and builds recognition (Coca-Cola red, Tiffany blue). Use a disciplined palette.</li>
<li><strong>Imagery</strong> — one strong, ownable visual beats a busy collage. The <strong>key visual</strong> is the image the whole campaign hangs on.</li>
</ul>
<p>Copy and art are partners, not layers: the best ads mean <em>more</em> together than either alone (the "1 + 1 = 3" of word and image).</p>
<div class="callout"><span class="badge">Real campaign</span> Apple's <em>Shot on iPhone</em> makes the product the hero with almost no copy — pure art direction. Absolut Vodka ran hundreds of print ads that all hang on one ownable key visual: the bottle silhouette.</div>`,
    `<span class="eyebrow">CAD301 · Chương 5 · Bài 5.1</span>
<h2>Art direction &amp; thiết kế thị giác</h2>
<h3>Layout (dàn trang)</h3>
<p><strong>Art direction</strong> quyết định ý tưởng trông và cảm thế nào. Layout dẫn mắt: một <strong>điểm nhấn</strong> rõ, một <strong>lưới (grid)</strong> để trật tự, thứ bậc thị giác (xem gì trước, sau), và các nguyên lý <strong>Gestalt</strong> (gần nhau, tương đồng, khép kín) khiến các phần đọc thành một nhóm.</p>
<h3>Chữ, màu, hình</h3>
<ul>
<li><strong>Typography</strong> — chữ có giọng: một kiểu chữ gợi sang trọng, kỹ thuật hay thân thiện trước khi đọc một từ.</li>
<li><strong>Màu sắc</strong> — mang nghĩa &amp; cảm xúc và xây nhận diện (đỏ Coca-Cola, xanh Tiffany). Dùng bảng màu kỷ luật.</li>
<li><strong>Hình ảnh</strong> — một hình mạnh, sở hữu được thắng một collage rối. <strong>Key visual</strong> là hình mà cả chiến dịch treo lên.</li>
</ul>
<p>Copy và art là bạn đồng hành, không phải các lớp: quảng cáo hay nhất khi cùng nhau nghĩa <em>nhiều hơn</em> từng cái riêng ("1 + 1 = 3" của chữ và hình).</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <em>Shot on iPhone</em> của Apple đưa sản phẩm làm nhân vật chính gần như không lời — art direction thuần. Absolut Vodka chạy hàng trăm mẩu print đều treo trên một key visual sở hữu được: bóng chai.</div>`,
  ]]);

const c5q = quiz('cad301-quiz-5', 'Quiz 5 — Art direction|||Quiz 5 — Art direction', [
  { id: 'q1', question: '"Key visual" của một chiến dịch là?|||A campaign key visual is?', options: ['Dòng chú thích nhỏ|||A small caption', 'Hình chủ đạo mà cả chiến dịch treo lên|||The central image the whole campaign hangs on', 'Bảng giá media|||The media rate card', 'Phông nền trắng|||A white background'], correctIndex: 1, explanation: 'Key visual là hình sở hữu được, nhất quán, xương sống thị giác của chiến dịch.' },
  { id: 'q2', question: 'Nguyên lý Gestalt (gần nhau, tương đồng) giúp?|||Gestalt principles help by?', options: ['Tăng ngân sách|||Increasing budget', 'Khiến các phần đọc thành một nhóm có trật tự|||Making elements read as an ordered group', 'Chọn model diễn viên|||Casting the model', 'Đặt lịch đăng bài|||Scheduling posts'], correctIndex: 1, explanation: 'Gestalt (proximity, similarity, closure) tổ chức thị giác để mắt đọc thành nhóm.' },
  { id: 'q3', question: 'Quan hệ đúng giữa copy và art trong quảng cáo hay là?|||Copy and art in great ads are?', options: ['Hai lớp rời, không liên quan|||Two unrelated layers', 'Bạn đồng hành: cùng nhau nghĩa nhiều hơn (1+1=3)|||Partners: together they mean more (1+1=3)', 'Copy luôn thắng art|||Copy always beats art', 'Art luôn thắng copy|||Art always beats copy'], correctIndex: 1, explanation: 'Chữ và hình cộng hưởng: cùng nhau tạo nghĩa lớn hơn từng cái riêng.' },
]);

const c6 = doc('cad301-6-1-multichannel', '6.1 — Multi-channel advertising|||6.1 — Quảng cáo đa kênh',
  'TVC, print, OOH, digital, social — thế mạnh & ngôn ngữ riêng của từng kênh; đưa một ý tưởng qua nhiều kênh.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 6 · Lesson 6.1</span>
<h2>Multi-channel advertising</h2>
<h3>Each channel has its own language</h3>
<pre><code>TVC     -> sight+sound+motion; emotion &amp; story (15-60s)
Print   -> a single frozen frame; one strong idea, craft
OOH     -> billboard/transit; read in 3 seconds, big &amp; simple
Digital -> search, display, video; targeted &amp; measurable
Social  -> conversation; native, shareable, made to be participated in
</code></pre>
<p>You do not paste the TV ad everywhere. The <strong>idea stays the same; the execution adapts</strong> to each channel's strengths — a 6-second bumper is not a 60-second film cut short.</p>
<h3>Channel-idea fit</h3>
<p>Choose channels by the objective and the audience's day: OOH for fame &amp; reach, social for participation, digital for action &amp; retargeting, TVC for emotional scale.</p>
<div class="callout"><span class="badge">Real campaign</span> Old Spice's <em>The Man Your Man Could Smell Like</em> was a TVC that exploded on social when the team filmed 180 personalised video replies in real time. Spotify <em>Wrapped</em> lives natively on OOH and social at once — same idea, channel-true executions.</div>`,
    `<span class="eyebrow">CAD301 · Chương 6 · Bài 6.1</span>
<h2>Quảng cáo đa kênh</h2>
<h3>Mỗi kênh có ngôn ngữ riêng</h3>
<pre><code>TVC     -> hình+tiếng+chuyển động; cảm xúc &amp; câu chuyện (15-60s)
Print   -> một khung tĩnh; một ý mạnh, tay nghề
OOH     -> biển/phương tiện; đọc trong 3 giây, to &amp; đơn giản
Digital -> tìm kiếm, display, video; nhắm đúng &amp; đo được
Social  -> đối thoại; native, chia sẻ được, để người ta tham gia
</code></pre>
<p>Bạn không dán mẩu TV lên khắp nơi. <strong>Ý tưởng giữ nguyên; execution thích ứng</strong> theo thế mạnh từng kênh — một bumper 6 giây không phải phim 60 giây cắt ngắn.</p>
<h3>Khớp kênh–ý tưởng</h3>
<p>Chọn kênh theo mục tiêu và một ngày của công chúng: OOH cho danh tiếng &amp; phủ, social cho tham gia, digital cho hành động &amp; retarget, TVC cho quy mô cảm xúc.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <em>The Man Your Man Could Smell Like</em> của Old Spice là TVC bùng nổ trên social khi ê-kíp quay 180 video trả lời cá nhân hoá theo thời gian thực. Spotify <em>Wrapped</em> sống native cùng lúc trên OOH và social — cùng ý tưởng, execution đúng chất từng kênh.</div>`,
  ]]);

const c6q = quiz('cad301-quiz-6', 'Quiz 6 — Multi-channel|||Quiz 6 — Đa kênh', [
  { id: 'q1', question: 'Nguyên tắc khi đưa một ý tưởng qua nhiều kênh là?|||When taking one idea across channels, you should?', options: ['Dán y hệt mẩu TV lên mọi kênh|||Paste the exact TV ad everywhere', 'Giữ nguyên ý tưởng, thích ứng execution theo từng kênh|||Keep the idea, adapt execution per channel', 'Đổi ý tưởng ở mỗi kênh|||Change the idea on each channel', 'Chỉ chạy một kênh|||Run only one channel'], correctIndex: 1, explanation: 'Ý tưởng giữ nguyên; execution thích ứng theo thế mạnh từng kênh.' },
  { id: 'q2', question: 'Thế mạnh đặc trưng của OOH (biển ngoài trời) là?|||The signature strength of OOH is?', options: ['Kể chuyện dài 60 giây|||Telling a 60-second story', 'Đọc được trong ~3 giây, to & đơn giản|||Read in ~3 seconds, big & simple', 'Nhắm mục tiêu cá nhân hoá|||Personalised targeting', 'Đối thoại hai chiều|||Two-way conversation'], correctIndex: 1, explanation: 'OOH phải to, đơn giản, đọc xong trong vài giây khi lướt qua.' },
  { id: 'q3', question: 'Kênh nào mạnh nhất cho sự THAM GIA & lan truyền?|||Which channel is strongest for participation & sharing?', options: ['Print', 'Social', 'OOH', 'Radio'], correctIndex: 1, explanation: 'Social là kênh đối thoại — nội dung native, chia sẻ được, mời người ta tham gia.' },
]);

const c7 = doc('cad301-7-1-integrated-campaign', '7.1 — Integrated campaigns (IMC)|||7.1 — Chiến dịch tích hợp (IMC)',
  'IMC & 360°; nhất quán qua điểm chạm; mô hình hero–hub–hygiene; từ một big idea tới một chiến dịch trọn vẹn.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 7 · Lesson 7.1</span>
<h2>Integrated campaigns (IMC)</h2>
<h3>One voice across every touchpoint</h3>
<p><strong>Integrated Marketing Communications (IMC)</strong> means every channel tells one consistent story so the whole is bigger than the parts. A <strong>360° campaign</strong> surrounds the audience — TVC, OOH, social, PR, retail, experiential — all rooted in the same big idea, look and line.</p>
<h3>Structuring a campaign</h3>
<pre><code>HERO     -> the big, emotional flagship film/idea (reach &amp; fame)
HUB      -> regular content that deepens engagement
HYGIENE  -> always-on, useful, search-led content (answers &amp; action)
</code></pre>
<p>Consistency is not sameness: keep the idea, tone and key visual constant, but let each touchpoint play its role. Map the customer journey and place the right message at the right moment.</p>
<div class="callout"><span class="badge">Real campaign</span> Coca-Cola's <em>Share a Coke</em> ran one idea — your name on the bottle — across packaging, OOH, TV, social and retail worldwide. Dove <em>Real Beauty Sketches</em> and Red Bull <em>Stratos</em> are model 360° integrations: one idea, every channel, one voice.</div>`,
    `<span class="eyebrow">CAD301 · Chương 7 · Bài 7.1</span>
<h2>Chiến dịch tích hợp (IMC)</h2>
<h3>Một giọng qua mọi điểm chạm</h3>
<p><strong>IMC (truyền thông marketing tích hợp)</strong> nghĩa là mọi kênh kể một câu chuyện nhất quán để tổng thể lớn hơn các phần. Một <strong>chiến dịch 360°</strong> vây quanh công chúng — TVC, OOH, social, PR, bán lẻ, trải nghiệm — tất cả bắt rễ từ cùng một big idea, một look và một câu.</p>
<h3>Cấu trúc một chiến dịch</h3>
<pre><code>HERO     -> phim/ý tưởng chủ lực, giàu cảm xúc (phủ &amp; danh tiếng)
HUB      -> nội dung đều đặn làm sâu gắn kết
HYGIENE  -> nội dung luôn-bật, hữu ích, dẫn từ tìm kiếm (giải đáp &amp; hành động)
</code></pre>
<p>Nhất quán không phải giống hệt: giữ ý tưởng, tone và key visual bất biến, nhưng để mỗi điểm chạm đóng đúng vai. Vẽ hành trình khách hàng và đặt đúng thông điệp vào đúng khoảnh khắc.</p>
<div class="callout"><span class="badge">Chiến dịch thật</span> <em>Share a Coke</em> của Coca-Cola chạy một ý tưởng — tên bạn trên vỏ chai — qua bao bì, OOH, TV, social và bán lẻ toàn cầu. <em>Real Beauty Sketches</em> của Dove và <em>Stratos</em> của Red Bull là hình mẫu tích hợp 360°: một ý tưởng, mọi kênh, một giọng.</div>`,
  ]]);

const c7q = quiz('cad301-quiz-7', 'Quiz 7 — Integrated campaigns|||Quiz 7 — Chiến dịch tích hợp', [
  { id: 'q1', question: 'IMC (truyền thông tích hợp) nhấn mạnh điều gì?|||IMC emphasises what?', options: ['Mỗi kênh một câu chuyện khác nhau|||A different story per channel', 'Mọi kênh kể một câu chuyện nhất quán|||Every channel tells one consistent story', 'Chỉ dùng TVC|||TVC only', 'Bỏ big idea|||Drop the big idea'], correctIndex: 1, explanation: 'IMC: một giọng, một câu chuyện nhất quán qua mọi điểm chạm — tổng lớn hơn các phần.' },
  { id: 'q2', question: 'Trong mô hình hero–hub–hygiene, "hero" là?|||In hero–hub–hygiene, the hero is?', options: ['Nội dung luôn-bật dẫn từ tìm kiếm|||Always-on search-led content', 'Phim/ý tưởng chủ lực giàu cảm xúc, phủ rộng|||The big emotional flagship for reach', 'Bảng giá media|||The media rate card', 'Dòng pháp lý|||The legal line'], correctIndex: 1, explanation: 'Hero là tác phẩm chủ lực, cảm xúc, để phủ & danh tiếng; hub gắn kết; hygiene luôn-bật.' },
  { id: 'q3', question: '"Nhất quán" trong chiến dịch 360° nghĩa là?|||Consistency in a 360° campaign means?', options: ['Mọi kênh phải giống hệt nhau|||Every channel must be identical', 'Giữ ý tưởng/tone/key visual, để mỗi điểm chạm đóng đúng vai|||Keep idea/tone/key visual; each touchpoint plays its role', 'Chỉ giữ logo giống nhau|||Only keep the logo the same', 'Đổi tone theo từng kênh|||Change tone per channel'], correctIndex: 1, explanation: 'Nhất quán ≠ giống hệt: giữ lõi (ý tưởng, tone, key visual) nhưng thích ứng vai trò từng kênh.' },
]);

const c8 = doc('cad301-8-1-measurement-ethics', '8.1 — Measurement & advertising ethics|||8.1 — Đo lường & đạo đức quảng cáo',
  'Đo hiệu quả (reach, recall, brand lift, ROI); brand safety; đạo đức & quy định; tránh khủng hoảng.',
  [[
    `<span class="eyebrow">CAD301 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; advertising ethics</h2>
<h3>Did it work? Measuring effectiveness</h3>
<pre><code>Media metrics   -> reach, frequency, impressions, CPM
Response        -> CTR, engagement, conversions, CPA/ROAS
Brand metrics   -> awareness, recall, brand lift, consideration
Business        -> sales, market share, ROI (the ultimate test)
</code></pre>
<p>Tie every metric back to the brief's objective — vanity numbers (views) are not the same as effect (sales, lift). Test, learn, optimise.</p>
<h3>Brand safety, ethics &amp; regulation</h3>
<ul>
<li><strong>Brand safety</strong> — control where ads appear so they don't sit beside harmful content.</li>
<li><strong>Ethics</strong> — be truthful; don't mislead, stereotype, or exploit fear. Respect privacy in data-driven targeting.</li>
<li><strong>Regulation</strong> — follow advertising standards &amp; local law (truth in advertising, claims substantiation, disclosure of paid partnerships, rules on children).</li>
</ul>
<div class="callout"><span class="badge">Real campaign</span> Pepsi's 2017 Kendall Jenner ad was pulled within a day for trivialising protest — a reminder that culturally tone-deaf work destroys value fast. "Greenwashing" claims now draw regulator action: ethics is risk management, not just principle.</div>`,
    `<span class="eyebrow">CAD301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; đạo đức quảng cáo</h2>
<h3>Có hiệu quả không? Đo lường</h3>
<pre><code>Chỉ số media   -> reach, tần suất, impression, CPM
Phản hồi       -> CTR, tương tác, chuyển đổi, CPA/ROAS
Chỉ số thương hiệu -> nhận biết, recall, brand lift, cân nhắc
Kinh doanh     -> doanh số, thị phần, ROI (phép thử cuối cùng)
</code></pre>
<p>Buộc mọi chỉ số về lại mục tiêu trong brief — con số phù phiếm (view) không đồng nghĩa với hiệu quả (doanh số, lift). Thử, học, tối ưu.</p>
<h3>Brand safety, đạo đức &amp; quy định</h3>
<ul>
<li><strong>Brand safety</strong> — kiểm soát nơi quảng cáo xuất hiện để không nằm cạnh nội dung độc hại.</li>
<li><strong>Đạo đức</strong> — trung thực; không gây hiểu lầm, rập khuôn, hay khai thác nỗi sợ. Tôn trọng riêng tư khi nhắm mục tiêu bằng dữ liệu.</li>
<li><strong>Quy định</strong> — theo chuẩn quảng cáo &amp; luật địa phương (trung thực, chứng minh tuyên bố, công bố hợp tác trả tiền, quy tắc với trẻ em).</li>
</ul>
<div class="callout"><span class="badge">Chiến dịch thật</span> Mẩu quảng cáo Pepsi có Kendall Jenner (2017) bị gỡ trong một ngày vì tầm thường hoá biểu tình — lời nhắc rằng việc lệch nhịp văn hoá phá giá trị rất nhanh. Tuyên bố "greenwashing" nay bị cơ quan quản lý xử: đạo đức là quản trị rủi ro, không chỉ là nguyên tắc.</div>`,
  ]]);

const c8q = quiz('cad301-quiz-8', 'Quiz 8 — Measurement & ethics|||Quiz 8 — Đo lường & đạo đức', [
  { id: 'q1', question: 'Phép thử cuối cùng cho hiệu quả một chiến dịch thường là?|||The ultimate test of campaign effectiveness is usually?', options: ['Số lượt xem|||View count', 'ROI / doanh số / thị phần|||ROI / sales / market share', 'Số giải thưởng|||Number of awards', 'Số kênh chạy|||Number of channels'], correctIndex: 1, explanation: 'Con số phù phiếm (view) ≠ hiệu quả; đích cuối là ROI, doanh số, thị phần — về lại mục tiêu brief.' },
  { id: 'q2', question: '"Brand safety" nghĩa là?|||Brand safety means?', options: ['Bảo hiểm cho agency|||Insurance for the agency', 'Kiểm soát nơi quảng cáo xuất hiện, tránh nội dung độc hại|||Controlling where ads appear, away from harmful content', 'Đăng ký nhãn hiệu|||Registering the trademark', 'Sao lưu file thiết kế|||Backing up design files'], correctIndex: 1, explanation: 'Brand safety: đảm bảo quảng cáo không xuất hiện cạnh nội dung gây hại cho thương hiệu.' },
  { id: 'q3', question: 'Bài học từ mẩu Pepsi–Kendall Jenner 2017 là?|||The lesson from the 2017 Pepsi–Kendall Jenner ad is?', options: ['Ngân sách lớn luôn thắng|||Big budgets always win', 'Việc lệch nhịp văn hoá/đạo đức phá giá trị rất nhanh|||Culturally/ethically tone-deaf work destroys value fast', 'Càng nhiều người nổi tiếng càng tốt|||More celebrities is always better', 'Chỉ cần chạy nhiều kênh|||Just run more channels'], correctIndex: 1, explanation: 'Đạo đức & nhạy cảm văn hoá là quản trị rủi ro — lệch nhịp có thể huỷ chiến dịch trong một ngày.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CAD301',
    slug: 'cad301-creative-advertising',
    title: 'Creative Advertising',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CAD301.webp',
    shortDescription: 'Creative advertising A–Z — creative brief, big idea, message strategy (positioning, USP, tone), copywriting, art direction, multi-channel (TVC/print/OOH/digital/social), integrated 360 campaigns, measurement & ethics. Bilingual, real campaigns.|||Quảng cáo sáng tạo A–Z — creative brief, big idea, chiến lược thông điệp, copywriting, art direction, đa kênh (TVC/print/OOH/digital/social), chiến dịch 360, đo lường & đạo đức. Song ngữ, ví dụ thật.',
    description: 'Môn <strong>CAD301 — Creative Advertising (Quảng cáo sáng tạo)</strong> thuộc ngành Truyền thông, kỳ 3. Vì môn không có giáo trình FLM riêng, khung bám sách chuẩn quốc tế: Altstiel &amp; Grow <em>Advertising Creative</em>, Ogilvy <em>Ogilvy on Advertising</em>, Pricken <em>Creative Advertising</em>. Đi từ <strong>quảng cáo &amp; creative brief</strong> → <strong>quy trình sáng tạo &amp; big idea</strong> → <strong>chiến lược thông điệp</strong> (positioning, USP, tone, RTB) → <strong>copywriting</strong> → <strong>art direction</strong> → <strong>quảng cáo đa kênh</strong> → <strong>chiến dịch tích hợp 360°</strong> → <strong>đo lường &amp; đạo đức</strong>. Song ngữ, có framework, ví dụ chiến dịch thật (Nike, Dove, Avis, Ogilvy, Old Spice, Coca-Cola) và quiz mỗi chương.',
    whatYouLearn: 'Quảng cáo là gì &amp; vai trò sáng tạo; đọc/viết creative brief; insight → concept → execution &amp; big idea; positioning, USP, RTB, tone &amp; voice; copywriting (headline, body, tagline, AIDA, storytelling); art direction (layout, typography, màu, key visual); triển khai đa kênh (TVC, print, OOH, digital, social); dựng chiến dịch tích hợp 360° (hero–hub–hygiene); đo lường hiệu quả (reach, recall, brand lift, ROI) và giữ đúng brand safety, đạo đức, quy định.',
    requirements: 'Không cần kiến thức nền chuyên sâu. Nên có hiểu biết marketing cơ bản và tài khoản Canva/Figma để thực hành dàn trang &amp; key visual.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền tảng, giải thưởng & thư viện chiến dịch, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Quảng cáo sáng tạo là gì; strategy vs creativity.', lessons: [intro] },
    { title: 'Chương 1 — Quảng cáo & vai trò sáng tạo|||Chapter 1 — Advertising & the creative role', description: 'Quảng cáo là gì, creative brief.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quy trình sáng tạo & big idea|||Chapter 2 — Process & the big idea', description: 'Insight → concept → execution.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chiến lược thông điệp|||Chapter 3 — Message strategy', description: 'Positioning, USP, tone & voice, RTB.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Copywriting|||Chapter 4 — Copywriting', description: 'Headline, body, tagline, storytelling.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Art direction & thiết kế thị giác|||Chapter 5 — Art direction', description: 'Layout, typography, màu, hình ảnh.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quảng cáo đa kênh|||Chapter 6 — Multi-channel', description: 'TVC, print, OOH, digital, social.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chiến dịch tích hợp|||Chapter 7 — Integrated campaigns', description: 'IMC 360°, hero–hub–hygiene.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & đạo đức|||Chapter 8 — Measurement & ethics', description: 'Hiệu quả, brand safety, quy định.', lessons: [c8, c8q] },
  ],
};
