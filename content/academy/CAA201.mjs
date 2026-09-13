/**
 * CAA201 — Communications and Advertising (Truyền thông và Quảng cáo). Ngành
 * Thiết kế mỹ thuật số FPTU. Góc nhìn THIẾT KẾ / SÁNG TẠO quảng cáo. Sách chuẩn:
 * David Ogilvy "Ogilvy on Advertising", Luke Sullivan "Hey Whipple, Squeeze
 * This", Belch "Advertising & Promotion"; giải D&AD / Cannes Lions. Song ngữ +
 * ví dụ chiến dịch thật (Nike, Apple, Coca-Cola). Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick lồng/${ trong HTML; "&"→&amp; trong HTML content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('caa201-0-1-overview', 'Course overview: Communications & Advertising|||Tổng quan: Truyền thông & Quảng cáo',
  'Quảng cáo là gì dưới góc nhìn thiết kế/sáng tạo; vai trò trong marketing; lộ trình 4 bước: nền tảng → chiến lược & ý tưởng → thực thi (copy + hình) → chiến dịch, đo lường & đạo đức.',
  [[
    `<span class="eyebrow">CAA201 · Lesson 0.1 · Overview</span>
<h2>Communications &amp; Advertising</h2>
<p class="lead">This course looks at advertising through the eyes of a <strong>designer and creative</strong>: how a brand turns a business problem into an idea people notice, remember and act on. You will move from strategy to the craft of <strong>copywriting</strong> and <strong>visual design</strong>, and finally to <strong>integrated campaigns</strong> and how they are measured.</p>
<h3>What advertising really does</h3>
<p>Advertising is <strong>paid, persuasive communication</strong> that connects a brand to an audience. David Ogilvy put it plainly: the job is to <em>sell</em>, not to entertain the maker. Good advertising is built on a <strong>strategy</strong> (who, what, why) and delivered through a <strong>big idea</strong> that is both fresh and on-brief.</p>
<h3>Roadmap — four steps</h3>
<ol>
<li><strong>Foundation</strong> — the role of advertising, its history, the marketing mix, the audience.</li>
<li><strong>Strategy &amp; ideas</strong> — the creative brief, consumer insight, positioning, the big idea.</li>
<li><strong>Craft</strong> — copywriting (headline, body, tagline, CTA) and visual design (art direction, layout, type, colour).</li>
<li><strong>Campaigns &amp; responsibility</strong> — multi-channel and 360° campaigns, measurement, ethics and awards.</li>
</ol>
<div class="callout"><span class="badge">Reference shelf</span> Ogilvy, <em>Ogilvy on Advertising</em> · Sullivan, <em>Hey Whipple, Squeeze This</em> · Belch, <em>Advertising &amp; Promotion</em> · the D&amp;AD and Cannes Lions case libraries.</div>`,
    `<span class="eyebrow">CAA201 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông &amp; Quảng cáo</h2>
<p class="lead">Môn này nhìn quảng cáo bằng con mắt của <strong>nhà thiết kế và người sáng tạo</strong>: một thương hiệu biến bài toán kinh doanh thành ý tưởng mà công chúng để ý, ghi nhớ và hành động ra sao. Bạn đi từ chiến lược tới nghề <strong>viết lời (copywriting)</strong> và <strong>thiết kế thị giác</strong>, rồi tới <strong>chiến dịch tích hợp</strong> và cách đo lường.</p>
<h3>Quảng cáo thực chất làm gì</h3>
<p>Quảng cáo là <strong>truyền thông thuyết phục có trả tiền</strong> nối thương hiệu với công chúng. David Ogilvy nói thẳng: việc của nó là <em>bán</em>, không phải để người làm ra tự mua vui. Quảng cáo tốt dựng trên một <strong>chiến lược</strong> (ai, cái gì, vì sao) và truyền đi bằng một <strong>ý tưởng lớn (big idea)</strong> vừa mới mẻ vừa bám brief.</p>
<h3>Lộ trình — 4 bước</h3>
<ol>
<li><strong>Nền tảng</strong> — vai trò của quảng cáo, lịch sử, marketing mix, đối tượng.</li>
<li><strong>Chiến lược &amp; ý tưởng</strong> — creative brief, insight người tiêu dùng, positioning, big idea.</li>
<li><strong>Nghề</strong> — viết lời (headline, body, tagline, CTA) và thiết kế thị giác (art direction, layout, chữ, màu).</li>
<li><strong>Chiến dịch &amp; trách nhiệm</strong> — quảng cáo đa kênh và 360°, đo lường, đạo đức và giải thưởng.</li>
</ol>
<div class="callout"><span class="badge">Kệ sách tham khảo</span> Ogilvy, <em>Ogilvy on Advertising</em> · Sullivan, <em>Hey Whipple, Squeeze This</em> · Belch, <em>Advertising &amp; Promotion</em> · thư viện case của D&amp;AD và Cannes Lions.</div>`,
  ]]);

const c1 = doc('caa201-1-1-adv-communication', '1.1 — Advertising &amp; communication|||1.1 — Quảng cáo &amp; truyền thông',
  'Quảng cáo là gì, lịch sử ngắn; vị trí trong marketing mix (4P); mô hình truyền thông người gửi–thông điệp–người nhận; xác định đối tượng mục tiêu.',
  [[
    `<span class="eyebrow">CAA201 · Chapter 1 · Lesson 1.1</span>
<h2>Advertising &amp; communication</h2>
<h3>What it is, and a short history</h3>
<p><strong>Advertising</strong> is paid, one-to-many persuasive communication placed by an identified sponsor. From print posters and radio jingles, to the "creative revolution" of the 1960s (Bill Bernbach, DDB), to today's digital and social feeds — the medium changed, but the goal did not: <strong>influence what people think, feel and do</strong> about a brand.</p>
<h3>Where it sits in the marketing mix</h3>
<p>Advertising is one lever of <strong>Promotion</strong> in the classic 4P mix — Product, Price, Place, Promotion. It works alongside PR, sales promotion, direct and digital marketing. A great ad cannot save a bad product; it can make a good one famous.</p>
<h3>The communication model</h3>
<pre><code>Sender (brand) -&gt; encodes -&gt; Message (ad)
              -&gt; Channel (TV, print, social)
              -&gt; Receiver (audience) -&gt; decodes -&gt; Response
              &lt;- Feedback / Noise -&gt;
</code></pre>
<p>Every step can leak meaning. <strong>Noise</strong> (clutter, distraction) is why the message must be simple and the idea sharp.</p>
<h3>Know the audience</h3>
<p>Before a single visual, you define <strong>who</strong> you are talking to — demographics, behaviour, needs. Nike does not advertise to "everyone"; it speaks to the athlete inside each person, which is why <em>"Just Do It"</em> reads as personal, not mass.</p>
<div class="callout"><span class="badge">Designer takeaway</span> Communication is a chain from brand to person. Your design is the encoding step — clarity here is what survives the noise.</div>`,
    `<span class="eyebrow">CAA201 · Chương 1 · Bài 1.1</span>
<h2>Quảng cáo &amp; truyền thông</h2>
<h3>Là gì, và một chút lịch sử</h3>
<p><strong>Quảng cáo</strong> là truyền thông thuyết phục có trả tiền, một-tới-nhiều, do một nhà tài trợ xác định đặt ra. Từ áp phích in và nhạc hiệu radio, tới "cuộc cách mạng sáng tạo" thập niên 1960 (Bill Bernbach, DDB), tới dòng tin số và mạng xã hội hôm nay — phương tiện đổi, mục tiêu thì không: <strong>tác động lên điều công chúng nghĩ, cảm và làm</strong> về một thương hiệu.</p>
<h3>Vị trí trong marketing mix</h3>
<p>Quảng cáo là một đòn bẩy của <strong>Promotion (Xúc tiến)</strong> trong mô hình 4P cổ điển — Product, Price, Place, Promotion. Nó phối cùng PR, khuyến mãi, marketing trực tiếp và số. Một quảng cáo hay không cứu nổi sản phẩm tồi; nhưng nó làm sản phẩm tốt trở nên nổi tiếng.</p>
<h3>Mô hình truyền thông</h3>
<pre><code>Người gửi (thương hiệu) -&gt; mã hoá -&gt; Thông điệp (quảng cáo)
                       -&gt; Kênh (TV, in, mạng xã hội)
                       -&gt; Người nhận (công chúng) -&gt; giải mã -&gt; Phản hồi
                       &lt;- Phản hồi / Nhiễu -&gt;
</code></pre>
<p>Mỗi bước đều có thể rơi rụng ý nghĩa. <strong>Nhiễu (noise)</strong> — sự lộn xộn, phân tâm — là lý do thông điệp phải giản dị và ý tưởng phải sắc.</p>
<h3>Hiểu đối tượng</h3>
<p>Trước khi vẽ một hình nào, bạn xác định <strong>nói với ai</strong> — nhân khẩu, hành vi, nhu cầu. Nike không quảng cáo cho "tất cả mọi người"; nó nói với vận động viên bên trong mỗi người, nên <em>"Just Do It"</em> nghe như lời riêng chứ không phải phát loa.</p>
<div class="callout"><span class="badge">Điều nhà thiết kế cần nhớ</span> Truyền thông là một chuỗi từ thương hiệu tới con người. Thiết kế của bạn là bước mã hoá — rõ ràng ở đây mới sống sót qua nhiễu.</div>`,
  ]]);

const c1q = quiz('caa201-quiz-1', 'Quiz 1 — Advertising & communication|||Quiz 1 — Quảng cáo & truyền thông', [
  { id: 'q1', question: 'Quảng cáo là loại truyền thông như thế nào?', options: ['Miễn phí, ngẫu nhiên', 'Có trả tiền, thuyết phục, do nhà tài trợ xác định', 'Chỉ dùng trên TV', 'Không có mục tiêu bán hàng'], correctIndex: 1, explanation: 'Quảng cáo = truyền thông thuyết phục có trả tiền, do một nhà tài trợ xác định đặt ra.' },
  { id: 'q2', question: 'Trong marketing mix 4P, quảng cáo thuộc chữ P nào?', options: ['Product', 'Price', 'Place', 'Promotion'], correctIndex: 3, explanation: 'Quảng cáo là một đòn bẩy của Promotion (Xúc tiến).' },
  { id: 'q3', question: '"Nhiễu" (noise) trong mô hình truyền thông là?', options: ['Ngân sách quảng cáo', 'Sự lộn xộn/phân tâm làm rơi rụng thông điệp', 'Tên thương hiệu', 'Kênh phát sóng'], correctIndex: 1, explanation: 'Noise là clutter/phân tâm — vì nó mà thông điệp phải giản dị, ý tưởng phải sắc.' },
]);

const c2 = doc('caa201-2-1-strategy-insight', '2.1 — Strategy &amp; insight|||2.1 — Chiến lược &amp; insight',
  'Creative brief (bản tóm sáng tạo); consumer insight — sự thật ngầm hiểu; định vị (positioning); từ chiến lược tới big idea.',
  [[
    `<span class="eyebrow">CAA201 · Chapter 2 · Lesson 2.1</span>
<h2>Strategy &amp; insight</h2>
<h3>The creative brief</h3>
<p>Every great ad starts on paper, not in Photoshop. The <strong>creative brief</strong> is a one-page contract between strategy and creativity. It answers: <em>Who are we talking to? What do they currently think? What do we want them to think? What is the single most persuasive thing we can say? Why should they believe it?</em> A tight brief is the difference between an idea and a guess.</p>
<h3>Consumer insight</h3>
<p>An <strong>insight</strong> is a hidden truth about the audience that, once said aloud, feels obvious — a tension the brand can resolve. It is not a fact ("people drink coffee") but a felt truth ("mornings feel like a fight I have not won yet"). Insight is the raw material of ideas; without it, ads are decoration.</p>
<h3>Positioning</h3>
<p><strong>Positioning</strong> is the space a brand owns in the customer's mind relative to rivals. Volvo owns <em>safety</em>; Apple owns <em>simple, human technology</em>. You cannot own everything — positioning is the discipline of choosing one thing and defending it.</p>
<h3>From strategy to the big idea</h3>
<pre><code>Business problem -&gt; Brief -&gt; Insight
              -&gt; Positioning (the one thing)
              -&gt; BIG IDEA (fresh + on-brief)
</code></pre>
<div class="callout"><span class="badge">Case</span> Apple's <em>"Think Different"</em> did not sell specs — it positioned Apple as the brand for creative rebels, an insight about identity, not hardware.</div>`,
    `<span class="eyebrow">CAA201 · Chương 2 · Bài 2.1</span>
<h2>Chiến lược &amp; insight</h2>
<h3>Creative brief (bản tóm sáng tạo)</h3>
<p>Mọi quảng cáo hay khởi đầu trên giấy, không phải trong Photoshop. <strong>Creative brief</strong> là bản hợp đồng một trang giữa chiến lược và sáng tạo. Nó trả lời: <em>Ta nói với ai? Họ đang nghĩ gì? Ta muốn họ nghĩ gì? Điều thuyết phục nhất ta có thể nói là gì? Vì sao họ nên tin?</em> Một brief chặt là ranh giới giữa một ý tưởng và một cú đoán mò.</p>
<h3>Insight người tiêu dùng</h3>
<p><strong>Insight</strong> là sự thật ngầm hiểu về công chúng — nói ra thì thấy hiển nhiên, một căng thẳng mà thương hiệu có thể hoá giải. Nó không phải dữ kiện ("người ta uống cà phê") mà là sự thật được cảm ("buổi sáng như một trận đánh tôi chưa thắng"). Insight là nguyên liệu thô của ý tưởng; thiếu nó, quảng cáo chỉ là trang trí.</p>
<h3>Định vị (positioning)</h3>
<p><strong>Positioning</strong> là khoảng trống một thương hiệu chiếm giữ trong tâm trí khách hàng, so với đối thủ. Volvo giữ chữ <em>an toàn</em>; Apple giữ <em>công nghệ giản dị, thân người</em>. Không thể giữ tất cả — định vị là kỷ luật chọn một thứ và bảo vệ nó.</p>
<h3>Từ chiến lược tới big idea</h3>
<pre><code>Bài toán kinh doanh -&gt; Brief -&gt; Insight
                  -&gt; Positioning (một thứ duy nhất)
                  -&gt; BIG IDEA (mới mẻ + bám brief)
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> Chiến dịch <em>"Think Different"</em> của Apple không bán cấu hình — nó định vị Apple là thương hiệu cho những kẻ sáng tạo nổi loạn, một insight về bản sắc chứ không phải phần cứng.</div>`,
  ]]);

const c2q = quiz('caa201-quiz-2', 'Quiz 2 — Strategy & insight|||Quiz 2 — Chiến lược & insight', [
  { id: 'q1', question: 'Creative brief dùng để làm gì?', options: ['Trang trí layout', 'Là bản tóm một trang nối chiến lược với sáng tạo, xác định nói với ai/điều gì', 'Tính ngân sách media', 'Đặt lịch chạy quảng cáo'], correctIndex: 1, explanation: 'Brief trả lời: nói với ai, họ nghĩ gì, ta muốn họ nghĩ gì, điều thuyết phục nhất, vì sao tin.' },
  { id: 'q2', question: 'Insight người tiêu dùng khác dữ kiện ở chỗ?', options: ['Là con số thống kê', 'Là sự thật ngầm hiểu/căng thẳng được cảm, nói ra thấy hiển nhiên', 'Là tên sản phẩm', 'Là ngân sách'], correctIndex: 1, explanation: 'Insight là sự thật được cảm (felt truth), không phải dữ kiện khô như "người ta uống cà phê".' },
  { id: 'q3', question: 'Positioning (định vị) nghĩa là?', options: ['Vị trí đặt banner trên trang', 'Khoảng trống thương hiệu chiếm trong tâm trí khách hàng so với đối thủ', 'Giá bán sản phẩm', 'Kênh phát quảng cáo'], correctIndex: 1, explanation: 'Ví dụ Volvo = an toàn, Apple = công nghệ giản dị thân người; chọn một thứ và bảo vệ nó.' },
]);

const c3 = doc('caa201-3-1-creative-idea', '3.1 — The creative idea|||3.1 — Ý tưởng sáng tạo',
  'Concept vs execution; brainstorm & tư duy phân kỳ/hội tụ; USP (điểm bán độc nhất); quảng cáo cảm xúc vs lý tính; thế nào là một big idea.',
  [[
    `<span class="eyebrow">CAA201 · Chapter 3 · Lesson 3.1</span>
<h2>The creative idea</h2>
<h3>Concept vs execution</h3>
<p>The <strong>concept</strong> is the idea; the <strong>execution</strong> is how it looks and sounds. A strong concept can be executed a hundred ways and still hold together — that is the test. Luke Sullivan warns against "executions in search of an idea": pretty ads with nothing underneath.</p>
<h3>How ideas are made</h3>
<p>Brainstorming works in two moves: <strong>divergent</strong> (generate many, judge nothing) then <strong>convergent</strong> (select, sharpen). Quantity first, quality second. The best idea is rarely the first one.</p>
<h3>USP — the unique selling proposition</h3>
<p>The <strong>USP</strong> is the one benefit only your brand can honestly claim. M&amp;M's <em>"melts in your mouth, not in your hand"</em> is a USP turned into a line — a product truth made memorable.</p>
<h3>Emotional vs rational</h3>
<ul>
<li><strong>Rational</strong> — appeals to logic: features, price, proof. Good for considered, high-cost buys.</li>
<li><strong>Emotional</strong> — appeals to feeling: belonging, joy, fear, status. Coca-Cola sells <em>happiness</em>, not brown sugar water.</li>
</ul>
<div class="callout"><span class="badge">Test of a big idea</span> Is it <strong>on-brief</strong>? Is it <strong>fresh</strong>? Can it <strong>stretch</strong> across a campaign and channels? If yes to all three, you have an idea, not just an ad.</div>`,
    `<span class="eyebrow">CAA201 · Chương 3 · Bài 3.1</span>
<h2>Ý tưởng sáng tạo</h2>
<h3>Concept và execution</h3>
<p><strong>Concept</strong> là ý tưởng; <strong>execution</strong> là cách nó trông và nghe ra sao. Một concept mạnh có thể thực thi trăm kiểu mà vẫn dính liền — đó là phép thử. Luke Sullivan cảnh báo kiểu "execution đi tìm ý tưởng": quảng cáo đẹp mà rỗng bên dưới.</p>
<h3>Ý tưởng được tạo ra thế nào</h3>
<p>Brainstorm đi hai nhịp: <strong>phân kỳ (divergent)</strong> — sinh thật nhiều, chưa phán xét, rồi <strong>hội tụ (convergent)</strong> — chọn lọc, mài sắc. Số lượng trước, chất lượng sau. Ý tưởng hay hiếm khi là ý tưởng đầu tiên.</p>
<h3>USP — điểm bán độc nhất</h3>
<p><strong>USP</strong> là lợi ích duy nhất mà chỉ thương hiệu bạn nói được một cách trung thực. M&amp;M với <em>"tan trong miệng, không tan trên tay"</em> là một USP biến thành câu chữ — một sự thật sản phẩm được làm cho dễ nhớ.</p>
<h3>Cảm xúc và lý tính</h3>
<ul>
<li><strong>Lý tính</strong> — đánh vào logic: tính năng, giá, bằng chứng. Hợp với món cân nhắc kỹ, giá cao.</li>
<li><strong>Cảm xúc</strong> — đánh vào cảm giác: thuộc về, niềm vui, nỗi sợ, địa vị. Coca-Cola bán <em>hạnh phúc</em>, không bán nước đường màu nâu.</li>
</ul>
<div class="callout"><span class="badge">Phép thử big idea</span> Có <strong>bám brief</strong> không? Có <strong>mới mẻ</strong> không? Có <strong>giãn được</strong> qua cả chiến dịch và nhiều kênh không? Cả ba đều "có" thì bạn có một ý tưởng, không chỉ một mẩu quảng cáo.</div>`,
  ]]);

const c3q = quiz('caa201-quiz-3', 'Quiz 3 — The creative idea|||Quiz 3 — Ý tưởng sáng tạo', [
  { id: 'q1', question: 'Concept khác execution ở chỗ?', options: ['Concept là màu sắc, execution là ý tưởng', 'Concept là ý tưởng, execution là cách nó trông/nghe', 'Hai từ đồng nghĩa', 'Concept là ngân sách'], correctIndex: 1, explanation: 'Concept mạnh có thể thực thi trăm kiểu mà vẫn dính liền — đó là phép thử.' },
  { id: 'q2', question: 'USP (unique selling proposition) là?', options: ['Kênh phát quảng cáo', 'Lợi ích duy nhất chỉ thương hiệu bạn nói được một cách trung thực', 'Tên miền website', 'Ngày chạy chiến dịch'], correctIndex: 1, explanation: 'Ví dụ M&M "tan trong miệng, không tan trên tay" — sự thật sản phẩm làm cho dễ nhớ.' },
  { id: 'q3', question: 'Brainstorm hiệu quả gồm hai nhịp nào?', options: ['Vẽ rồi in', 'Phân kỳ (sinh nhiều) rồi hội tụ (chọn lọc)', 'Đo lường rồi báo cáo', 'Mua media rồi chạy'], correctIndex: 1, explanation: 'Divergent (số lượng, chưa phán xét) → convergent (chọn, mài sắc).' },
]);

const c4 = doc('caa201-4-1-copywriting', '4.1 — Advertising copywriting|||4.1 — Copywriting quảng cáo',
  'Headline (tiêu đề bắt mắt); tagline (khẩu hiệu); body copy (thân bài); call-to-action (kêu gọi hành động); tone of voice (giọng điệu thương hiệu).',
  [[
    `<span class="eyebrow">CAA201 · Chapter 4 · Lesson 4.1</span>
<h2>Advertising copywriting</h2>
<p>Words carry the idea. Ogilvy: <em>"On average, five times as many people read the headline as read the body copy."</em> The headline is where most of your money is spent.</p>
<h3>The parts of a piece of copy</h3>
<ul>
<li><strong>Headline</strong> — the hook. It stops the reader and promises a benefit or provokes curiosity. Short, specific, and about <em>them</em>, not you.</li>
<li><strong>Tagline</strong> — the brand's enduring line across campaigns. Nike's <em>"Just Do It"</em>; L'Oréal's <em>"Because you're worth it"</em>. It outlives any single ad.</li>
<li><strong>Body copy</strong> — the argument. It earns belief with proof, story and detail. Write to one person, not a crowd.</li>
<li><strong>Call-to-action (CTA)</strong> — the ask. "Shop now", "Book a test drive" — tell the reader exactly the next step.</li>
</ul>
<h3>Tone of voice</h3>
<p><strong>Tone of voice</strong> is the brand's personality in words — playful, authoritative, warm, rebellious. It must be consistent so the brand sounds like one person across every touchpoint. Innocent Drinks is chatty and funny; a bank is calm and reassuring — by design.</p>
<pre><code>Headline  -&gt; stop them
Body      -&gt; convince them
CTA       -&gt; move them
(all in one consistent voice)
</code></pre>
<div class="callout"><span class="badge">Craft tip</span> Cut every word that does not work. "Squeeze this" — Sullivan's title — means wring the copy until only the strong words are left.</div>`,
    `<span class="eyebrow">CAA201 · Chương 4 · Bài 4.1</span>
<h2>Copywriting quảng cáo</h2>
<p>Chữ mang ý tưởng. Ogilvy: <em>"Trung bình số người đọc tiêu đề nhiều gấp năm lần số người đọc thân bài."</em> Tiêu đề là nơi phần lớn tiền của bạn được tiêu.</p>
<h3>Các phần của một bài copy</h3>
<ul>
<li><strong>Headline (tiêu đề)</strong> — cái móc. Nó chặn người đọc lại, hứa một lợi ích hoặc khơi tò mò. Ngắn, cụ thể, và nói về <em>họ</em>, không phải về bạn.</li>
<li><strong>Tagline (khẩu hiệu)</strong> — câu bền của thương hiệu, đi xuyên các chiến dịch. Nike <em>"Just Do It"</em>; L'Oréal <em>"Vì bạn xứng đáng"</em>. Nó sống lâu hơn bất kỳ mẩu quảng cáo đơn lẻ nào.</li>
<li><strong>Body copy (thân bài)</strong> — phần lập luận. Nó chiếm niềm tin bằng bằng chứng, câu chuyện và chi tiết. Viết cho một người, không phải một đám đông.</li>
<li><strong>Call-to-action (CTA)</strong> — lời đề nghị. "Mua ngay", "Đặt lái thử" — chỉ đúng bước tiếp theo cho người đọc.</li>
</ul>
<h3>Tone of voice (giọng điệu)</h3>
<p><strong>Tone of voice</strong> là tính cách thương hiệu thể hiện qua chữ — tinh nghịch, uy tín, ấm áp, nổi loạn. Nó phải nhất quán để thương hiệu nghe như một con người ở mọi điểm chạm. Innocent Drinks tán gẫu và hài; một ngân hàng thì điềm tĩnh, trấn an — đều là chủ ý.</p>
<pre><code>Headline  -&gt; chặn họ lại
Body      -&gt; thuyết phục họ
CTA       -&gt; đẩy họ hành động
(tất cả trong một giọng nhất quán)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghề</span> Cắt mọi từ không làm việc. "Squeeze this" — tên sách Sullivan — nghĩa là vắt bài copy đến khi chỉ còn lại những từ mạnh.</div>`,
  ]]);

const c4q = quiz('caa201-quiz-4', 'Quiz 4 — Copywriting|||Quiz 4 — Copywriting', [
  { id: 'q1', question: 'Vì sao Ogilvy nói headline quan trọng bậc nhất?', options: ['Vì nó dài nhất', 'Vì trung bình số người đọc headline gấp ~5 lần số người đọc thân bài', 'Vì nó đặt cuối trang', 'Vì nó là logo'], correctIndex: 1, explanation: 'Headline là cái móc chặn người đọc — phần lớn tiền được tiêu ở đó.' },
  { id: 'q2', question: 'Tagline khác headline ở điểm nào?', options: ['Tagline là câu bền của thương hiệu, đi xuyên nhiều chiến dịch', 'Tagline chỉ dùng một lần', 'Tagline là thân bài', 'Không có khác biệt'], correctIndex: 0, explanation: 'Ví dụ "Just Do It" sống lâu hơn bất kỳ mẩu quảng cáo đơn lẻ nào; headline thay đổi theo từng ad.' },
  { id: 'q3', question: 'Call-to-action (CTA) làm nhiệm vụ gì?', options: ['Trang trí', 'Nêu chính xác bước hành động tiếp theo cho người đọc', 'Kể lịch sử thương hiệu', 'Liệt kê giá đối thủ'], correctIndex: 1, explanation: 'CTA là lời đề nghị: "Mua ngay", "Đặt lái thử"…' },
]);

const c5 = doc('caa201-5-1-visual-design', '5.1 — Visual design for advertising|||5.1 — Thiết kế thị giác quảng cáo',
  'Art direction; layout & hệ lưới; sức mạnh hình ảnh; màu sắc & tâm lý màu; typography quảng cáo; hierarchy thị giác dẫn mắt.',
  [[
    `<span class="eyebrow">CAA201 · Chapter 5 · Lesson 5.1</span>
<h2>Visual design for advertising</h2>
<h3>Art direction</h3>
<p><strong>Art direction</strong> is the visual voice of the idea — the choice of imagery, style, mood and craft that makes the concept feel like something. Copywriter and art director work as a pair (the classic "creative team"): words and pictures serving one idea.</p>
<h3>Layout &amp; the grid</h3>
<p>A <strong>layout</strong> arranges elements so the eye moves in the right order. A <strong>grid</strong> gives structure and calm; deliberate breaking of it creates tension and focus. Use <strong>visual hierarchy</strong> — size, contrast, position — so the reader sees the most important thing first.</p>
<h3>Image, colour, type</h3>
<ul>
<li><strong>Image</strong> — one strong image beats five weak ones. It should carry the idea even before the words are read.</li>
<li><strong>Colour</strong> — carries meaning and emotion: Coca-Cola red = energy and appetite; a lot of white = calm and premium. Colour is also brand recognition (Tiffany blue, Cadbury purple).</li>
<li><strong>Typography</strong> — type has a voice. A bold condensed sans shouts; a light serif whispers luxury. Legibility first, personality second.</li>
</ul>
<div class="callout"><span class="badge">Case</span> Apple ads: huge white space, one product, one line of type. The restraint <em>is</em> the message — simplicity as a visual argument.</div>`,
    `<span class="eyebrow">CAA201 · Chương 5 · Bài 5.1</span>
<h2>Thiết kế thị giác quảng cáo</h2>
<h3>Art direction (chỉ đạo mỹ thuật)</h3>
<p><strong>Art direction</strong> là giọng thị giác của ý tưởng — lựa chọn hình ảnh, phong cách, tâm trạng và độ tinh xảo khiến concept trở nên có hình hài. Copywriter và art director làm việc theo cặp ("creative team" kinh điển): chữ và hình cùng phục vụ một ý tưởng.</p>
<h3>Layout &amp; hệ lưới (grid)</h3>
<p><strong>Layout</strong> sắp các thành phần để mắt di chuyển đúng thứ tự. <strong>Grid</strong> cho cấu trúc và sự tĩnh; phá lưới có chủ đích tạo căng và điểm nhấn. Dùng <strong>hierarchy thị giác</strong> — kích thước, tương phản, vị trí — để người xem thấy thứ quan trọng nhất trước.</p>
<h3>Hình, màu, chữ</h3>
<ul>
<li><strong>Hình ảnh</strong> — một hình mạnh hơn năm hình yếu. Nó nên mang được ý tưởng ngay cả trước khi chữ được đọc.</li>
<li><strong>Màu sắc</strong> — mang ý nghĩa và cảm xúc: đỏ Coca-Cola = năng lượng và thèm ăn; nhiều trắng = tĩnh và cao cấp. Màu cũng là nhận diện thương hiệu (xanh Tiffany, tím Cadbury).</li>
<li><strong>Typography</strong> — chữ có giọng nói. Một font sans đậm, hẹp thì hô to; một font serif mảnh thì thì thầm sang trọng. Dễ đọc trước, cá tính sau.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Quảng cáo Apple: khoảng trắng mênh mông, một sản phẩm, một dòng chữ. Sự tiết chế <em>chính là</em> thông điệp — giản dị như một lập luận thị giác.</div>`,
  ]]);

const c5q = quiz('caa201-quiz-5', 'Quiz 5 — Visual design|||Quiz 5 — Thiết kế thị giác', [
  { id: 'q1', question: 'Art direction trong quảng cáo là?', options: ['Việc mua media', 'Giọng thị giác của ý tưởng — chọn hình ảnh, phong cách, tâm trạng, độ tinh xảo', 'Viết headline', 'Tính ngân sách'], correctIndex: 1, explanation: 'Art director bắt cặp với copywriter, cùng phục vụ một ý tưởng.' },
  { id: 'q2', question: 'Visual hierarchy dùng để làm gì?', options: ['Đổi giá sản phẩm', 'Dùng kích thước/tương phản/vị trí để người xem thấy thứ quan trọng nhất trước', 'Chọn kênh phát', 'Đặt tên thương hiệu'], correctIndex: 1, explanation: 'Hierarchy dẫn mắt theo đúng thứ tự đọc.' },
  { id: 'q3', question: 'Vì sao màu sắc quan trọng trong quảng cáo?', options: ['Chỉ để cho đẹp', 'Mang ý nghĩa/cảm xúc và là nhận diện thương hiệu (đỏ Coca-Cola, xanh Tiffany)', 'Không ảnh hưởng gì', 'Chỉ dùng khi in'], correctIndex: 1, explanation: 'Màu tải cảm xúc và giúp nhận ra thương hiệu ngay lập tức.' },
]);

const c6 = doc('caa201-6-1-multichannel', '6.1 — Advertising across channels|||6.1 — Quảng cáo đa kênh',
  'Đặc thù từng kênh: print, OOH (ngoài trời), TVC (phim quảng cáo), digital, social; chọn kênh theo hành trình & thông điệp; nhất quán thương hiệu.',
  [[
    `<span class="eyebrow">CAA201 · Chapter 6 · Lesson 6.1</span>
<h2>Advertising across channels</h2>
<p>The same idea must be re-crafted for each medium — a channel is not just a place to paste an ad, it changes how the idea should be told.</p>
<ul>
<li><strong>Print</strong> — magazines, newspapers. Rewards a strong headline + one image; the reader can dwell and read body copy.</li>
<li><strong>OOH (out-of-home)</strong> — billboards, transit. Seen in seconds by a moving audience: <em>one</em> idea, huge type, minimal words. If a driver cannot get it at a glance, it fails.</li>
<li><strong>TVC (TV commercial) / video</strong> — time-based, emotional, story-driven. Sound and motion carry feeling; the brand should arrive clearly, not only at the end.</li>
<li><strong>Digital</strong> — search, display, banners. Targeted and measurable; often direct-response with a clear CTA and a landing page.</li>
<li><strong>Social</strong> — feed-native, two-way. It must feel like content, invite sharing, and survive being seen on a phone with the sound off.</li>
</ul>
<h3>Choose the channel for the job</h3>
<p>Match channel to the <strong>audience</strong> and the <strong>stage of the journey</strong>: broad reach and feeling (TV, OOH) for awareness; targeted, actionable (search, social) for conversion. Whatever the channel, the brand and idea must stay <strong>consistent</strong>.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Design for the medium's reality: OOH is read at 60 km/h; social is watched muted. The constraint shapes the craft.</div>`,
    `<span class="eyebrow">CAA201 · Chương 6 · Bài 6.1</span>
<h2>Quảng cáo đa kênh</h2>
<p>Cùng một ý tưởng phải được chế lại cho từng phương tiện — kênh không chỉ là chỗ dán quảng cáo, nó đổi cách ý tưởng nên được kể.</p>
<ul>
<li><strong>Print (in)</strong> — tạp chí, báo. Thưởng cho một headline mạnh + một hình; người đọc có thể dừng lại và đọc thân bài.</li>
<li><strong>OOH (ngoài trời)</strong> — biển lớn, phương tiện công cộng. Người xem đang di chuyển, nhìn trong vài giây: <em>một</em> ý tưởng, chữ thật to, ít lời. Người lái xe không nắm được trong một cái liếc là hỏng.</li>
<li><strong>TVC (phim quảng cáo) / video</strong> — theo thời gian, giàu cảm xúc, kể chuyện. Âm thanh và chuyển động tải cảm xúc; thương hiệu nên xuất hiện rõ, không chỉ ở cuối.</li>
<li><strong>Digital</strong> — tìm kiếm, hiển thị, banner. Nhắm mục tiêu và đo được; thường là direct-response với CTA rõ và một landing page.</li>
<li><strong>Social (mạng xã hội)</strong> — hoà vào dòng tin, hai chiều. Nó phải giống như nội dung, mời chia sẻ, và sống được khi bị xem trên điện thoại đã tắt tiếng.</li>
</ul>
<h3>Chọn kênh theo việc cần làm</h3>
<p>Khớp kênh với <strong>đối tượng</strong> và <strong>giai đoạn hành trình</strong>: phủ rộng và cảm xúc (TV, OOH) cho nhận biết; nhắm đích, thúc hành động (search, social) cho chuyển đổi. Dù kênh nào, thương hiệu và ý tưởng phải giữ <strong>nhất quán</strong>.</p>
<div class="callout"><span class="badge">Kinh nghiệm</span> Thiết kế theo thực tế của phương tiện: OOH được đọc ở tốc độ 60 km/h; social bị xem trong im lặng. Ràng buộc định hình cái nghề.</div>`,
  ]]);

const c6q = quiz('caa201-quiz-6', 'Quiz 6 — Channels|||Quiz 6 — Đa kênh', [
  { id: 'q1', question: 'Nguyên tắc cốt lõi khi thiết kế biển quảng cáo ngoài trời (OOH)?', options: ['Càng nhiều chữ càng tốt', 'Một ý tưởng, chữ to, ít lời — nắm được trong một cái liếc', 'Body copy dài', 'Đặt logo thật nhỏ'], correctIndex: 1, explanation: 'Người xem đang di chuyển, chỉ có vài giây; không nắm được trong một liếc là hỏng.' },
  { id: 'q2', question: 'Vì sao quảng cáo social phải sống được khi "tắt tiếng"?', options: ['Vì luật cấm âm thanh', 'Vì phần lớn người xem social trên điện thoại ở chế độ muted', 'Vì âm thanh tốn tiền', 'Vì social không có video'], correctIndex: 1, explanation: 'Social hoà vào feed, thường bị xem muted — thông điệp phải rõ bằng hình/chữ.' },
  { id: 'q3', question: 'Kênh nào thường phù hợp nhất cho mục tiêu "nhận biết, phủ rộng, cảm xúc"?', options: ['Search quảng cáo tìm kiếm', 'TV và OOH', 'Email trực tiếp', 'Banner direct-response'], correctIndex: 1, explanation: 'TV/OOH phủ rộng và tải cảm xúc; search/social nhắm đích để chuyển đổi.' },
]);

const c7 = doc('caa201-7-1-integrated-campaign', '7.1 — The integrated campaign|||7.1 — Chiến dịch tích hợp',
  'Campaign là gì; storytelling thương hiệu; truyền thông tích hợp 360°; một ý tưởng, nhiều điểm chạm; phân tích chiến dịch nổi tiếng.',
  [[
    `<span class="eyebrow">CAA201 · Chapter 7 · Lesson 7.1</span>
<h2>The integrated campaign</h2>
<h3>From ad to campaign</h3>
<p>A <strong>campaign</strong> is one idea expressed consistently across many ads, channels and time. It is not five different ideas sharing a logo — it is one idea that <em>stretches</em>. This is why the "big idea" test in Chapter 3 mattered: only a stretchable idea can carry a campaign.</p>
<h3>Integrated marketing communication (IMC) &amp; 360°</h3>
<p><strong>IMC</strong> means every touchpoint — TV, print, OOH, social, PR, packaging, in-store — tells the same story in one voice. <strong>360°</strong> is the aim: wherever the audience turns, the idea is there, reinforcing itself. Consistency multiplies impact; contradiction wastes it.</p>
<h3>Brand storytelling</h3>
<p>People remember <strong>stories</strong>, not features. A campaign gives the brand a narrative — a hero, a tension, a resolution — that the audience can join. The brand is rarely the hero; the customer is.</p>
<h3>Famous campaigns</h3>
<ul>
<li><strong>Nike — "Just Do It"</strong> (1988–): one idea about personal will, told for decades across every channel and sport.</li>
<li><strong>Dove — "Real Beauty"</strong>: an insight about self-image turned into a 360° movement, not a single ad.</li>
<li><strong>Coca-Cola — "Share a Coke"</strong>: names on bottles made a mass product feel personal and shareable across pack, social and OOH.</li>
</ul>
<div class="callout"><span class="badge">Designer takeaway</span> Your job is to build a <em>system</em>, not a poster: a look, a voice and an idea that survive being reproduced a thousand ways.</div>`,
    `<span class="eyebrow">CAA201 · Chương 7 · Bài 7.1</span>
<h2>Chiến dịch tích hợp</h2>
<h3>Từ mẩu quảng cáo tới chiến dịch</h3>
<p>Một <strong>campaign (chiến dịch)</strong> là một ý tưởng được thể hiện nhất quán qua nhiều mẩu quảng cáo, nhiều kênh và theo thời gian. Nó không phải năm ý tưởng khác nhau chung một logo — mà là một ý tưởng biết <em>giãn</em>. Đây là lý do phép thử "big idea" ở Chương 3 quan trọng: chỉ ý tưởng giãn được mới gánh nổi một chiến dịch.</p>
<h3>Truyền thông tích hợp (IMC) &amp; 360°</h3>
<p><strong>IMC</strong> nghĩa là mọi điểm chạm — TV, in, OOH, social, PR, bao bì, tại điểm bán — cùng kể một câu chuyện bằng một giọng. <strong>360°</strong> là mục tiêu: công chúng quay về hướng nào cũng thấy ý tưởng ở đó, tự củng cố lẫn nhau. Nhất quán nhân tác động lên; mâu thuẫn thì phí đi.</p>
<h3>Storytelling thương hiệu</h3>
<p>Con người nhớ <strong>câu chuyện</strong>, không nhớ tính năng. Một chiến dịch cho thương hiệu một mạch kể — có nhân vật, có căng thẳng, có hoá giải — mà công chúng có thể nhập vào. Thương hiệu hiếm khi là người hùng; khách hàng mới là.</p>
<h3>Chiến dịch nổi tiếng</h3>
<ul>
<li><strong>Nike — "Just Do It"</strong> (1988–): một ý tưởng về ý chí cá nhân, kể suốt nhiều thập kỷ qua mọi kênh và mọi môn thể thao.</li>
<li><strong>Dove — "Real Beauty"</strong>: một insight về hình ảnh bản thân biến thành phong trào 360°, không chỉ một mẩu quảng cáo.</li>
<li><strong>Coca-Cola — "Share a Coke"</strong>: in tên lên chai khiến sản phẩm đại trà thành cá nhân và dễ chia sẻ, trải khắp bao bì, social và OOH.</li>
</ul>
<div class="callout"><span class="badge">Điều nhà thiết kế cần nhớ</span> Việc của bạn là dựng một <em>hệ thống</em>, không phải một tấm poster: một diện mạo, một giọng và một ý tưởng sống được khi bị nhân bản nghìn kiểu.</div>`,
  ]]);

const c7q = quiz('caa201-quiz-7', 'Quiz 7 — Integrated campaign|||Quiz 7 — Chiến dịch tích hợp', [
  { id: 'q1', question: 'Một "campaign" khác một mẩu quảng cáo đơn lẻ ở chỗ?', options: ['Nhiều ý tưởng khác nhau chung logo', 'Một ý tưởng được thể hiện nhất quán qua nhiều kênh và theo thời gian', 'Chỉ chạy trên TV', 'Không cần big idea'], correctIndex: 1, explanation: 'Chiến dịch là một ý tưởng biết "giãn" — chỉ ý tưởng giãn được mới gánh nổi campaign.' },
  { id: 'q2', question: 'Truyền thông tích hợp (IMC / 360°) hướng tới điều gì?', options: ['Mỗi kênh kể một câu chuyện riêng', 'Mọi điểm chạm cùng kể một câu chuyện bằng một giọng', 'Chỉ dùng một kênh duy nhất', 'Bỏ logo để tránh trùng'], correctIndex: 1, explanation: 'Nhất quán nhân tác động; mâu thuẫn thì phí đi.' },
  { id: 'q3', question: 'Trong storytelling thương hiệu, ai thường là "người hùng"?', options: ['Thương hiệu', 'Khách hàng', 'Đối thủ', 'Đạo diễn quảng cáo'], correctIndex: 1, explanation: 'Thương hiệu hiếm khi là người hùng; khách hàng mới là, thương hiệu là người trợ giúp.' },
]);

const c8 = doc('caa201-8-1-measurement-ethics', '8.1 — Measurement &amp; ethics|||8.1 — Đo lường &amp; đạo đức',
  'Đo hiệu quả quảng cáo (mục tiêu, chỉ số, hiệu ứng thương hiệu vs bán hàng); đạo đức & quảng cáo có trách nhiệm; giải thưởng ngành (Cannes Lions, D&AD).',
  [[
    `<span class="eyebrow">CAA201 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; ethics</h2>
<h3>Did it work?</h3>
<p>Effectiveness is judged against the <strong>objective set in the brief</strong>, not against how much you liked the ad. Distinguish two kinds of goal:</p>
<ul>
<li><strong>Brand effects</strong> — awareness, recall, favourability, consideration. Slower, measured by surveys and tracking.</li>
<li><strong>Response effects</strong> — clicks, leads, sales, ROI. Faster, measured directly, especially in digital.</li>
</ul>
<p>Common metrics: <strong>reach</strong> and <strong>frequency</strong>, engagement, click-through and conversion, and ultimately return on investment. Beware vanity metrics — likes are not sales.</p>
<h3>Ethics &amp; responsible advertising</h3>
<p>Advertising has power, so it carries duties: be <strong>truthful</strong> (no false or misleading claims), avoid <strong>harmful stereotypes</strong>, protect vulnerable audiences (children), and disclose paid content. Codes of practice and advertising standards authorities enforce this; a designer should refuse work that deceives.</p>
<h3>Awards &amp; the craft bar</h3>
<p><strong>Cannes Lions</strong> and <strong>D&amp;AD</strong> (its Yellow/Black Pencils) set the global benchmark for creative excellence. Studying winning cases teaches what "great" looks like — but awards reward ideas that also <em>worked</em>, not decoration.</p>
<div class="callout"><span class="badge">Full-circle</span> The brief set the objective (Ch.2); measurement asks whether the idea (Ch.3) delivered it — ethically. That loop is the professional discipline of advertising.</div>`,
    `<span class="eyebrow">CAA201 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; đạo đức</h2>
<h3>Nó có hiệu quả không?</h3>
<p>Hiệu quả được chấm theo <strong>mục tiêu đặt ra trong brief</strong>, không theo việc bạn thích mẩu quảng cáo tới đâu. Phân biệt hai loại mục tiêu:</p>
<ul>
<li><strong>Hiệu ứng thương hiệu</strong> — nhận biết, gợi nhớ, thiện cảm, cân nhắc mua. Chậm hơn, đo bằng khảo sát và tracking.</li>
<li><strong>Hiệu ứng phản hồi</strong> — click, lead, doanh số, ROI. Nhanh hơn, đo trực tiếp, nhất là trên digital.</li>
</ul>
<p>Chỉ số thường gặp: <strong>reach</strong> (độ phủ) và <strong>frequency</strong> (tần suất), tương tác, tỉ lệ click và chuyển đổi, và cuối cùng là lợi tức đầu tư. Cẩn thận với chỉ số phù phiếm — like không phải doanh số.</p>
<h3>Đạo đức &amp; quảng cáo có trách nhiệm</h3>
<p>Quảng cáo có quyền năng nên mang bổn phận: <strong>trung thực</strong> (không tuyên bố sai hay gây hiểu lầm), tránh <strong>định kiến gây hại</strong>, bảo vệ nhóm dễ tổn thương (trẻ em), và công khai nội dung được trả tiền. Bộ quy tắc và cơ quan chuẩn mực quảng cáo giám sát điều này; một nhà thiết kế nên từ chối việc lừa dối.</p>
<h3>Giải thưởng &amp; chuẩn nghề</h3>
<p><strong>Cannes Lions</strong> và <strong>D&amp;AD</strong> (với Yellow/Black Pencil) đặt chuẩn toàn cầu cho xuất sắc sáng tạo. Học các case đoạt giải dạy ta "hay" trông ra sao — nhưng giải thưởng tôn vinh ý tưởng còn <em>chạy được</em>, không phải trang trí.</p>
<div class="callout"><span class="badge">Khép vòng</span> Brief đặt mục tiêu (Ch.2); đo lường hỏi ý tưởng (Ch.3) có đạt được nó không — một cách có đạo đức. Vòng lặp đó chính là kỷ luật nghề nghiệp của quảng cáo.</div>`,
  ]]);

const c8q = quiz('caa201-quiz-8', 'Quiz 8 — Measurement & ethics|||Quiz 8 — Đo lường & đạo đức', [
  { id: 'q1', question: 'Hiệu quả của một quảng cáo được chấm dựa trên?', options: ['Việc người làm thích nó tới đâu', 'Mục tiêu đặt ra trong brief', 'Số lượng màu dùng', 'Độ dài body copy'], correctIndex: 1, explanation: 'Đo theo objective của brief — hiệu ứng thương hiệu (nhận biết) hoặc phản hồi (doanh số/ROI).' },
  { id: 'q2', question: 'Đâu là nguyên tắc của quảng cáo có trách nhiệm?', options: ['Tuyên bố phóng đại miễn bán được', 'Trung thực, tránh định kiến gây hại, bảo vệ nhóm dễ tổn thương, công khai nội dung trả tiền', 'Nhắm mạnh vào trẻ em', 'Giấu việc là quảng cáo'], correctIndex: 1, explanation: 'Bộ quy tắc và cơ quan chuẩn mực buộc quảng cáo phải trung thực và không gây hại.' },
  { id: 'q3', question: 'Cannes Lions và D&D (D&AD) là gì?', options: ['Kênh phát TV', 'Giải thưởng đặt chuẩn toàn cầu cho sáng tạo quảng cáo', 'Phần mềm thiết kế', 'Công ty in ấn'], correctIndex: 1, explanation: 'Chúng tôn vinh ý tưởng xuất sắc mà vẫn chạy được; học case đoạt giải để biết "hay" trông ra sao.' },
]);

const taiLieu = doc('caa201-0-0-tai-lieu', '📚 Course materials &amp; references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn ngành (Ogilvy, Sullivan, Belch), case Cannes Lions & D&AD, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CAA201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Communications &amp; Advertising from a designer's angle — strategy, ideas, copy, visual craft and integrated campaigns — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are trusted books, case libraries and free resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CAA201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Ogilvy_on_Advertising" target="_blank" rel="noopener">David Ogilvy — <em>Ogilvy on Advertising</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Hey_Whipple,_Squeeze_This" target="_blank" rel="noopener">Luke Sullivan — <em>Hey Whipple, Squeeze This</em></a></li>
<li><a href="https://www.mheducation.com/highered/product/advertising-promotion-integrated-marketing-communications-perspective-belch-belch.html" target="_blank" rel="noopener">Belch &amp; Belch — <em>Advertising &amp; Promotion (IMC Perspective)</em></a></li>
</ul>
<h3>🌐 Case libraries / free resources</h3>
<ul>
<li><a href="https://www.canneslions.com/" target="_blank" rel="noopener">Cannes Lions — the work &amp; winners</a></li>
<li><a href="https://www.dandad.org/awards/" target="_blank" rel="noopener">D&amp;AD Awards — the Pencils archive</a></li>
<li><a href="https://adsoftheworld.com/" target="_blank" rel="noopener">Ads of the World — global campaign gallery</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — branding, design &amp; creative strategy</li>
<li><a href="https://www.youtube.com/@Cannes_Lions" target="_blank" rel="noopener">Cannes Lions</a> — talks &amp; award-winning case studies</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — layout &amp; ad mockups</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — quick social &amp; print ad drafts</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — build &amp; test ad colour palettes</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — role of advertising, the communication model, the audience, the marketing mix.</li>
<li><strong>Strategy &amp; ideas</strong> — write a creative brief, find an insight, define positioning and a big idea.</li>
<li><strong>Craft</strong> — practise copywriting (headline/body/CTA) and visual design (layout, type, colour, image).</li>
<li><strong>Job-ready</strong> — build a small integrated campaign, then judge it against objectives and ethics.</li>
</ol></div>`,
    `<span class="eyebrow">CAA201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Truyền thông &amp; Quảng cáo dưới góc nhìn nhà thiết kế — chiến lược, ý tưởng, viết lời, nghề thị giác và chiến dịch tích hợp — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách uy tín, thư viện case và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CAA201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Ogilvy_on_Advertising" target="_blank" rel="noopener">David Ogilvy — <em>Ogilvy on Advertising</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Hey_Whipple,_Squeeze_This" target="_blank" rel="noopener">Luke Sullivan — <em>Hey Whipple, Squeeze This</em></a></li>
<li><a href="https://www.mheducation.com/highered/product/advertising-promotion-integrated-marketing-communications-perspective-belch-belch.html" target="_blank" rel="noopener">Belch &amp; Belch — <em>Advertising &amp; Promotion (góc nhìn IMC)</em></a></li>
</ul>
<h3>🌐 Thư viện case / nguồn miễn phí</h3>
<ul>
<li><a href="https://www.canneslions.com/" target="_blank" rel="noopener">Cannes Lions — bài dự thi &amp; đoạt giải</a></li>
<li><a href="https://www.dandad.org/awards/" target="_blank" rel="noopener">D&amp;AD Awards — kho Pencil</a></li>
<li><a href="https://adsoftheworld.com/" target="_blank" rel="noopener">Ads of the World — thư viện chiến dịch toàn cầu</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — thương hiệu, thiết kế &amp; chiến lược sáng tạo</li>
<li><a href="https://www.youtube.com/@Cannes_Lions" target="_blank" rel="noopener">Cannes Lions</a> — talk &amp; case đoạt giải</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — dựng layout &amp; mockup quảng cáo</li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — nháp nhanh quảng cáo social &amp; in</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — dựng &amp; thử bảng màu quảng cáo</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vai trò quảng cáo, mô hình truyền thông, đối tượng, marketing mix.</li>
<li><strong>Chiến lược &amp; ý tưởng</strong> — viết creative brief, tìm insight, định vị và big idea.</li>
<li><strong>Nghề</strong> — luyện copywriting (headline/body/CTA) và thiết kế thị giác (layout, chữ, màu, hình).</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng một chiến dịch tích hợp nhỏ, rồi tự chấm theo mục tiêu và đạo đức.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CAA201',
    slug: 'caa201-communications-and-advertising',
    title: 'Communications and Advertising',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CAA201.webp',
    shortDescription: 'Advertising for designers — communication model, creative brief & insight, positioning & the big idea, copywriting, visual craft, multi-channel & 360° campaigns, measurement & ethics. Bilingual, real cases (Nike, Apple, Coca-Cola) & quizzes.|||Quảng cáo cho nhà thiết kế — mô hình truyền thông, creative brief & insight, positioning & big idea, copywriting, nghề thị giác, chiến dịch đa kênh & 360°, đo lường & đạo đức. Song ngữ, case thật (Nike, Apple, Coca-Cola) & quiz.',
    description: 'Môn <strong>CAA201 — Communications and Advertising</strong> (kỳ 5, ngành Thiết kế mỹ thuật số) nhìn quảng cáo bằng con mắt <strong>nhà thiết kế và người sáng tạo</strong>. Từ <strong>nền tảng</strong> (vai trò quảng cáo, mô hình truyền thông, marketing mix) → <strong>chiến lược &amp; insight</strong> (creative brief, positioning, big idea) → <strong>nghề</strong> (copywriting: headline/tagline/body/CTA; thiết kế thị giác: art direction, layout, chữ, màu) → <strong>chiến dịch tích hợp 360°</strong>, <strong>đo lường &amp; đạo đức</strong>. Bám sách chuẩn (Ogilvy, Sullivan, Belch) và case Cannes Lions/D&amp;AD, song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Mô hình truyền thông & marketing mix; viết creative brief & tìm consumer insight; positioning & big idea; USP, cảm xúc vs lý tính; copywriting (headline, tagline, body, CTA, tone of voice); art direction, layout & grid, typography, màu sắc; đặc thù kênh (print/OOH/TVC/digital/social); chiến dịch tích hợp & storytelling thương hiệu; đo hiệu quả (reach/frequency, brand vs response, ROI); đạo đức & quảng cáo có trách nhiệm; giải thưởng ngành.',
    requirements: 'Không cần kiến thức quảng cáo trước. Nên quen công cụ thiết kế cơ bản (Figma/Canva) và có hứng thú với thương hiệu, hình ảnh và ngôn từ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn ngành, case Cannes/D&AD, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Quảng cáo góc nhìn thiết kế, vai trò, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Quảng cáo & truyền thông|||Chapter 1 — Advertising & communication', description: 'Vai trò, lịch sử, marketing mix, mô hình truyền thông, đối tượng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiến lược & insight|||Chapter 2 — Strategy & insight', description: 'Creative brief, insight, positioning, big idea.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ý tưởng sáng tạo|||Chapter 3 — The creative idea', description: 'Concept, brainstorm, USP, cảm xúc vs lý tính.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Copywriting quảng cáo|||Chapter 4 — Copywriting', description: 'Headline, tagline, body copy, CTA, tone of voice.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thiết kế thị giác|||Chapter 5 — Visual design', description: 'Art direction, layout, hình, màu, typography.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quảng cáo đa kênh|||Chapter 6 — Channels', description: 'Print, OOH, TVC, digital, social; chọn kênh.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Chiến dịch tích hợp|||Chapter 7 — Integrated campaign', description: 'Campaign, storytelling, 360°, case nổi tiếng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & đạo đức|||Chapter 8 — Measurement & ethics', description: 'Hiệu quả, đạo đức, quảng cáo có trách nhiệm, giải thưởng.', lessons: [c8, c8q] },
  ],
};
