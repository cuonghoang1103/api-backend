/**
 * ENH401 — Business English for Hospitality (Upper Intermediate). Khối Quản
 * trị Kinh doanh (BBA), FPTU, Kỳ 2. Tiếp nối ENH301 (Intermediate), trình độ
 * CAO HƠN: quan hệ khách VIP, đàm phán, marketing, sự kiện, lãnh đạo, thư từ,
 * đa văn hoá, thuyết trình & kết nối. Trích dẫn giáo trình, KHÔNG upload PDF.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('enh401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình tham khảo (Pearson, Cambridge, Hospitality Management English), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ENH401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to build upper-intermediate business English for hospitality — guest relations, negotiation, marketing, events, leadership, correspondence, cross-cultural communication and presentations — in one place.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>English for International Tourism (Upper Intermediate)</em> — Pearson. The core reference for this course's tourism/hospitality scenarios and vocabulary.</li>
<li><em>Professional English in Use</em> — Cambridge University Press. Business/professional vocabulary in context, useful for correspondence, meetings and presentations.</li>
<li><em>Hospitality Management English</em> — hospitality-specific business English for front office, sales, F&amp;B and events.</li>
</ul>
<h3>🌐 Free / official resources</h3>
<ul>
<li><a href="https://learnenglish.britishcouncil.org/business-english" target="_blank" rel="noopener">British Council — Business English</a></li>
<li><a href="https://www.bbc.co.uk/learningenglish/business-english" target="_blank" rel="noopener">BBC Learning English — Business English</a></li>
<li><a href="https://dictionary.cambridge.org/" target="_blank" rel="noopener">Cambridge Dictionary</a> — check collocations and formal register</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BBCLearningEnglish" target="_blank" rel="noopener">BBC Learning English</a> — business &amp; professional English lessons</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — pronunciation &amp; professional communication</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — checking register and tone in emails/reports</li>
<li><a href="https://www.linguee.com/" target="_blank" rel="noopener">Linguee</a> — bilingual phrase examples in context</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — review ENH301 vocabulary if guest-service basics feel shaky.</li>
<li><strong>Chapter-by-chapter</strong> — vocabulary → expressions → dialogue → grammar point → quiz.</li>
<li><strong>Practice</strong> — role-play each dialogue out loud with a partner or record yourself.</li>
<li><strong>Apply</strong> — draft a real email/report from your own workplace using this chapter's register.</li>
</ol></div>`,
    `<span class="eyebrow">ENH401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để xây tiếng Anh thương mại khách sạn trình độ trung-cao cấp — quan hệ khách hàng, đàm phán, marketing, sự kiện, lãnh đạo, thư từ, giao tiếp đa văn hoá và thuyết trình — gom về một chỗ.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>English for International Tourism (Upper Intermediate)</em> — Pearson. Nguồn tham khảo chính cho các tình huống du lịch/khách sạn và từ vựng của môn này.</li>
<li><em>Professional English in Use</em> — Cambridge University Press. Từ vựng thương mại/chuyên nghiệp theo ngữ cảnh, hữu ích cho thư từ, họp và thuyết trình.</li>
<li><em>Hospitality Management English</em> — tiếng Anh thương mại chuyên ngành khách sạn cho lễ tân, kinh doanh, F&amp;B và sự kiện.</li>
</ul>
<h3>🌐 Tài liệu miễn phí / chính thức</h3>
<ul>
<li><a href="https://learnenglish.britishcouncil.org/business-english" target="_blank" rel="noopener">British Council — Business English</a></li>
<li><a href="https://www.bbc.co.uk/learningenglish/business-english" target="_blank" rel="noopener">BBC Learning English — Business English</a></li>
<li><a href="https://dictionary.cambridge.org/" target="_blank" rel="noopener">Cambridge Dictionary</a> — kiểm tra collocation và văn phong trang trọng</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BBCLearningEnglish" target="_blank" rel="noopener">BBC Learning English</a> — bài học tiếng Anh thương mại &amp; chuyên nghiệp</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — phát âm &amp; giao tiếp chuyên nghiệp</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — kiểm tra văn phong và ngữ điệu trong email/báo cáo</li>
<li><a href="https://www.linguee.com/" target="_blank" rel="noopener">Linguee</a> — ví dụ cụm từ song ngữ theo ngữ cảnh</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ôn từ vựng ENH301 nếu các kỹ năng dịch vụ khách hàng cơ bản còn chưa vững.</li>
<li><strong>Theo từng chương</strong> — từ vựng → mẫu câu → hội thoại → điểm ngữ pháp → quiz.</li>
<li><strong>Luyện tập</strong> — đóng vai từng hội thoại thành tiếng cùng bạn học hoặc tự ghi âm.</li>
<li><strong>Áp dụng</strong> — soạn một email/báo cáo thật từ công việc của bạn theo văn phong của chương.</li>
</ol></div>`,
  ]]);

const intro = doc('enh401-0-1-overview', 'Course overview: Business English for Hospitality (Upper Intermediate)|||Tổng quan: Tiếng Anh thương mại ngành Khách sạn (Trung-cao cấp)',
  'Tiếp nối ENH301; lộ trình 8 chương: quan hệ khách VIP, đàm phán, marketing, sự kiện, lãnh đạo, thư từ, đa văn hoá, thuyết trình & kết nối.',
  [[
    `<span class="eyebrow">ENH401 · Lesson 0.1 · Overview</span>
<h2>Business English for Hospitality — Upper Intermediate</h2>
<p class="lead">This course continues on from <strong>ENH301 (Intermediate)</strong> and takes your hospitality English into more senior, high-stakes situations: handling VIP guests and service recovery, negotiating with clients, marketing and selling hotel services, running events, leading a team, writing formal correspondence, working across cultures, and presenting &amp; networking professionally.</p>
<h3>Why "upper intermediate" matters here</h3>
<p>At this level, English is no longer just about being understood — it's about sounding <strong>professional, diplomatic and persuasive</strong> under pressure: softening a refusal, negotiating a compromise, giving feedback without demotivating staff, or writing a report that reads objectively.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Managing guest relations &amp; VIP service</li>
<li>Negotiating &amp; handling difficult situations</li>
<li>Marketing &amp; selling hotel services</li>
<li>Event &amp; conference management English</li>
<li>Team leadership &amp; staff communication</li>
<li>Business correspondence &amp; reports</li>
<li>Cross-cultural communication in hospitality</li>
<li>Presentations &amp; professional networking</li>
</ol>
<p>Every chapter has key vocabulary, model sentences, a real-world dialogue, an advanced language point, and a short quiz.</p>`,
    `<span class="eyebrow">ENH401 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Anh thương mại ngành Khách sạn — Trung-cao cấp</h2>
<p class="lead">Môn này tiếp nối <strong>ENH301 (Trung cấp)</strong> và đưa tiếng Anh khách sạn của bạn lên các tình huống cấp cao, áp lực hơn: xử lý khách VIP &amp; khắc phục dịch vụ, đàm phán với khách hàng, marketing &amp; bán dịch vụ khách sạn, tổ chức sự kiện, lãnh đạo nhóm, viết thư từ trang trọng, làm việc đa văn hoá, và thuyết trình &amp; kết nối chuyên nghiệp.</p>
<h3>Vì sao "trung-cao cấp" quan trọng ở đây</h3>
<p>Ở trình độ này, tiếng Anh không còn chỉ là để được hiểu — mà là để nghe <strong>chuyên nghiệp, khéo léo và có sức thuyết phục</strong> dưới áp lực: giảm nhẹ một lời từ chối, đàm phán một thoả hiệp, góp ý cho nhân viên mà không làm mất động lực, hay viết một báo cáo nghe khách quan.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Quản lý quan hệ khách hàng &amp; dịch vụ VIP</li>
<li>Đàm phán &amp; xử lý tình huống khó</li>
<li>Marketing &amp; bán dịch vụ khách sạn</li>
<li>Tiếng Anh tổ chức sự kiện &amp; hội nghị</li>
<li>Lãnh đạo nhóm &amp; giao tiếp với nhân viên</li>
<li>Thư từ thương mại &amp; báo cáo</li>
<li>Giao tiếp đa văn hoá trong khách sạn</li>
<li>Thuyết trình &amp; kết nối chuyên nghiệp</li>
</ol>
<p>Mỗi chương có từ vựng trọng tâm, mẫu câu, hội thoại thực tế, một điểm ngữ pháp/kỹ năng nâng cao, và một quiz ngắn.</p>`,
  ]]);

const c1 = doc('enh401-1-1-guest-relations-vip', '1.1 — Managing guest relations & VIP service|||1.1 — Quản lý quan hệ khách hàng & dịch vụ VIP',
  'Từ vựng VIP/service recovery, mẫu câu, hội thoại chào đón khách VIP, ngôn ngữ giảm nhẹ & khắc phục dịch vụ 4 bước.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 1 · Lesson 1.1</span>
<h2>Managing guest relations &amp; VIP service</h2>
<h3>Key vocabulary</h3>
<pre><code>guest profile         — a stored record of a guest's preferences and history
loyalty tier          — a membership level (e.g. Silver/Gold/Platinum) with matching perks
complimentary upgrade — a free improvement to a higher room category
service recovery      — the steps taken to fix a service failure and rebuild trust
amenity               — an extra facility or item provided for comfort (e.g. a spa, a fruit basket)
concierge             — staff who arrange bookings, tickets and local recommendations for guests
special request       — a guest's specific ask noted in advance (e.g. a quiet floor, a crib)
feedback loop         — the cycle of collecting, acting on, and following up on guest feedback
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"We'd be delighted to..."</strong> — a warm, formal way to grant a request. "We'd be delighted to arrange a late check-out for you."</li>
<li><strong>"As a valued Platinum member, you're entitled to..."</strong> — framing a benefit around status. "...a complimentary suite upgrade, subject to availability."</li>
<li><strong>"I completely understand your frustration, and here's what I'll do..."</strong> — service recovery opener: acknowledge, then act.</li>
<li><strong>"Is there anything else I can personally take care of for you during your stay?"</strong> — proactive, ongoing care.</li>
</ul>
<h3>Dialogue: welcoming a returning VIP guest</h3>
<pre><code>Manager: Good evening, Mr. Patel, welcome back. I see from your profile this is your fifth stay with us this year.
Guest:   That's right. Last time the Wi-Fi in the business suite was unreliable during my calls.
Manager: I'm very sorry about that — I've flagged your room for a dedicated line this time, and as a Platinum
         member, we'd like to offer you a complimentary upgrade to the Executive Suite, at no extra cost.
Guest:   That's very kind, thank you.
Manager: Of course. I'll personally check in with you tomorrow morning to make sure everything is in order.
</code></pre>
<h3>Advanced language point: softening &amp; service-recovery language</h3>
<p>At upper-intermediate level, hospitality professionals move from simple politeness ("please", "thank you") to <strong>hedged, relationship-building language</strong>: modal verbs (<em>would</em>, <em>could</em>, <em>might</em>), passive framing to avoid blame ("the delay was caused by..." rather than "you caused..."), and a four-step service-recovery structure — <strong>acknowledge → apologise → act → follow up</strong> — that turns a complaint into loyalty.</p>
<div class="callout"><span class="badge">Tip</span> Never say "that's not our policy" to a VIP complaint. Reframe: "Let me see what I can personally do for you" — even when the answer is ultimately the same, ownership language changes how it lands.</div>`,
    `<span class="eyebrow">ENH401 · Chương 1 · Bài 1.1</span>
<h2>Quản lý quan hệ khách hàng &amp; dịch vụ VIP</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>guest profile         — hồ sơ lưu sở thích và lịch sử của khách
loyalty tier          — hạng thành viên (Bạc/Vàng/Bạch kim...) kèm quyền lợi tương ứng
complimentary upgrade — nâng hạng phòng miễn phí
service recovery      — các bước khắc phục sự cố dịch vụ và xây lại niềm tin
amenity               — tiện nghi/vật phẩm thêm cho sự thoải mái (spa, giỏ trái cây...)
concierge             — nhân viên sắp xếp đặt chỗ, vé, gợi ý địa điểm cho khách
special request       — yêu cầu riêng của khách được ghi trước (tầng yên tĩnh, nôi em bé...)
feedback loop         — vòng thu thập — xử lý — theo dõi lại phản hồi của khách
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"We'd be delighted to..."</strong> — cách trang trọng, ấm áp để chấp thuận yêu cầu. "Chúng tôi rất vui được sắp xếp trả phòng muộn cho ông/bà."</li>
<li><strong>"As a valued Platinum member, you're entitled to..."</strong> — gắn quyền lợi với hạng thành viên. "...nâng hạng phòng Suite miễn phí, tuỳ tình trạng phòng."</li>
<li><strong>"I completely understand your frustration, and here's what I'll do..."</strong> — mở đầu khắc phục dịch vụ: thừa nhận rồi hành động.</li>
<li><strong>"Is there anything else I can personally take care of for you during your stay?"</strong> — chăm sóc chủ động, xuyên suốt kỳ nghỉ.</li>
</ul>
<h3>Hội thoại: chào đón khách VIP quay lại</h3>
<pre><code>Manager: Chào ông Patel, chào mừng ông trở lại. Hồ sơ cho thấy đây là lần lưu trú thứ năm của ông trong năm nay.
Guest:   Đúng vậy. Lần trước Wi-Fi ở suite doanh nhân không ổn định khi tôi họp online.
Manager: Tôi rất xin lỗi về điều đó — tôi đã đánh dấu phòng ông cần đường truyền riêng lần này, và với hạng
         Platinum, chúng tôi muốn nâng hạng miễn phí lên Executive Suite cho ông, không tính thêm phí.
Guest:   Thật tốt bụng, cảm ơn.
Manager: Không có gì. Sáng mai tôi sẽ trực tiếp hỏi lại để chắc mọi thứ ổn.
</code></pre>
<h3>Điểm ngữ pháp nâng cao: ngôn ngữ giảm nhẹ &amp; khắc phục dịch vụ</h3>
<p>Ở trình độ trung-cao cấp, người làm khách sạn chuyển từ lịch sự đơn giản ("please", "thank you") sang <strong>ngôn ngữ giảm nhẹ, xây quan hệ</strong>: động từ khuyết thiếu (<em>would</em>, <em>could</em>, <em>might</em>), diễn đạt bị động để tránh đổ lỗi ("sự chậm trễ do..." thay vì "ông/bà đã gây ra..."), và cấu trúc khắc phục dịch vụ 4 bước — <strong>thừa nhận → xin lỗi → hành động → theo dõi lại</strong> — biến một lời phàn nàn thành sự trung thành.</p>
<div class="callout"><span class="badge">Gợi ý</span> Đừng bao giờ nói "đó không phải chính sách của chúng tôi" với khách VIP đang phàn nàn. Đổi lại: "Để tôi xem có thể tự mình làm gì cho ông/bà" — dù kết quả cuối cùng có thể giống nhau, ngôn ngữ nhận trách nhiệm thay đổi cách khách cảm nhận.</div>`,
  ]]);

const c1q = quiz('enh401-quiz-1', 'Quiz 1 — Guest relations & VIP service|||Quiz 1 — Quan hệ khách hàng & dịch vụ VIP', [
  { id: 'q1', question: '"Complimentary upgrade" nghĩa là gì?', options: ['Nâng hạng phòng miễn phí', 'Giảm giá theo mùa', 'Phòng bị lỗi cần đổi', 'Gói ăn sáng trả thêm'], correctIndex: 0, explanation: 'Complimentary upgrade = nâng hạng phòng lên loại cao hơn mà không tính thêm phí.' },
  { id: 'q2', question: 'Bước đầu tiên trong khắc phục dịch vụ (service recovery) 4 bước là gì?', options: ['Hành động ngay', 'Thừa nhận vấn đề', 'Đổ lỗi cho khách', 'Im lặng chờ khách quên'], correctIndex: 1, explanation: 'Chuỗi đúng: thừa nhận (acknowledge) → xin lỗi → hành động → theo dõi lại.' },
  { id: 'q3', question: 'Vì sao nên tránh nói "that\'s not our policy" với khách VIP đang phàn nàn?', options: ['Vì khách không hiểu tiếng Anh', 'Vì nó nghe như từ chối trách nhiệm thay vì nhận trách nhiệm', 'Vì chính sách đó luôn sai', 'Vì không liên quan đến VIP'], correctIndex: 1, explanation: 'Ngôn ngữ nhận trách nhiệm ("để tôi xem có thể làm gì") giữ được thiện cảm dù kết quả có thể như cũ.' },
]);

const c2 = doc('enh401-2-1-negotiating-difficult-situations', '2.1 — Negotiating & handling difficult situations|||2.1 — Đàm phán & xử lý tình huống khó',
  'Từ vựng đàm phán (bottom line, counter-offer, leverage), mẫu câu thoả hiệp, hội thoại đàm phán giá đoàn, câu điều kiện & ngôn ngữ ngoại giao.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 2 · Lesson 2.1</span>
<h2>Negotiating &amp; handling difficult situations</h2>
<h3>Key vocabulary</h3>
<pre><code>bottom line          — the minimum acceptable outcome in a negotiation
counter-offer        — an alternative offer made in response to the first one
to concede           — to give up a point in order to reach agreement
leverage             — the advantage one side holds in a negotiation
to de-escalate       — to reduce the tension of a heated situation
deadlock             — a point where neither side will move; talks stall
mutually beneficial  — an outcome that benefits both sides
ultimatum            — a final demand, with a stated consequence if refused
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"What if we met halfway on...?"</strong> — proposing a compromise. "What if we met halfway on the group rate — 15% instead of 20%?"</li>
<li><strong>"I hear your concern, and here's what I can do..."</strong> — validating before countering.</li>
<li><strong>"Let's park that point for now and come back to it."</strong> — deferring a sticking point without losing momentum.</li>
<li><strong>"I'm afraid that's not something we're able to offer, but I can propose an alternative."</strong> — a firm "no" softened by an alternative.</li>
</ul>
<h3>Dialogue: negotiating a corporate group rate</h3>
<pre><code>Client: Your quote is 20% above our budget for the 200-room block. We need it closer to our other proposals.
Sales:  I understand budget is tight. Our bottom line on room rate is fixed, but I could include complimentary
        breakfast and meeting-room use, which would close most of that gap in real value.
Client: That helps, but we're still looking for a bit more flexibility on the rate itself.
Sales:  What if we met halfway — a 5% rate reduction, plus the packages I mentioned? That's the most we can offer
        without escalating to my director.
Client: Let me take that back to my team. It's a reasonable middle ground.
</code></pre>
<h3>Advanced language point: conditional &amp; diplomatic language</h3>
<p>Skilled negotiators use <strong>second conditional structures</strong> ("If we lowered the rate, we'd need to cut the free breakfast") to explore options without commitment, and <strong>hedged disagreement</strong> ("I see it slightly differently...", "That's one way to look at it, though...") to challenge a position without causing offence. Escalation language ("let me check with my director") signals limits politely.</p>
<div class="callout"><span class="badge">Tip</span> Trade on <em>value</em>, not just price — packages, timing and add-ons often move a negotiation further than a raw discount, and they cost the hotel less.</div>`,
    `<span class="eyebrow">ENH401 · Chương 2 · Bài 2.1</span>
<h2>Đàm phán &amp; xử lý tình huống khó</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>bottom line          — kết quả tối thiểu có thể chấp nhận trong đàm phán
counter-offer        — lời đề nghị thay thế đưa ra để đáp lại đề nghị đầu
to concede           — nhượng bộ một điểm để đi đến thoả thuận
leverage             — lợi thế mà một bên nắm giữ trong đàm phán
to de-escalate       — hạ nhiệt một tình huống căng thẳng
deadlock             — điểm bế tắc khi không bên nào chịu nhượng; đàm phán đứng im
mutually beneficial  — kết quả có lợi cho cả hai bên
ultimatum            — yêu cầu cuối cùng, kèm hậu quả nếu bị từ chối
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"What if we met halfway on...?"</strong> — đề xuất một thoả hiệp. "Nếu ta gặp nhau ở giữa về giá đoàn — 15% thay vì 20% thì sao?"</li>
<li><strong>"I hear your concern, and here's what I can do..."</strong> — công nhận lo ngại trước khi đưa phương án.</li>
<li><strong>"Let's park that point for now and come back to it."</strong> — tạm gác điểm gay cấn lại mà không làm mất động lực buổi đàm phán.</li>
<li><strong>"I'm afraid that's not something we're able to offer, but I can propose an alternative."</strong> — một lời từ chối chắc chắn nhưng được giảm nhẹ bằng phương án khác.</li>
</ul>
<h3>Hội thoại: đàm phán giá đoàn doanh nghiệp</h3>
<pre><code>Client: Giá báo của các bạn cao hơn ngân sách 20% cho đoàn 200 phòng. Chúng tôi cần gần hơn với các đề nghị khác.
Sales:  Tôi hiểu ngân sách hạn hẹp. Mức giá tối thiểu của chúng tôi là cố định, nhưng tôi có thể thêm ăn sáng
        miễn phí và phòng họp, việc đó bù lại phần lớn khoảng cách về giá trị thực.
Client: Điều đó giúp được, nhưng chúng tôi vẫn muốn có thêm chút linh hoạt về giá phòng.
Sales:  Nếu ta gặp nhau ở giữa — giảm 5% giá phòng, cộng các gói tôi vừa nói thì sao? Đó là mức tối đa tôi có
        thể đưa ra mà không cần xin ý kiến giám đốc.
Client: Để tôi mang về trao đổi với đội của mình. Đây là một điểm giữa hợp lý.
</code></pre>
<h3>Điểm ngữ pháp nâng cao: câu điều kiện &amp; ngôn ngữ ngoại giao</h3>
<p>Người đàm phán giỏi dùng <strong>câu điều kiện loại 2</strong> ("If we lowered the rate, we'd need to cut the free breakfast") để thăm dò lựa chọn mà chưa cam kết, và <strong>ngôn ngữ bất đồng giảm nhẹ</strong> ("I see it slightly differently...", "That's one way to look at it, though...") để phản bác quan điểm mà không gây khó chịu. Ngôn ngữ leo thang ("để tôi hỏi giám đốc") báo hiệu giới hạn một cách khéo léo.</p>
<div class="callout"><span class="badge">Gợi ý</span> Đàm phán trên <em>giá trị</em>, không chỉ giá tiền — gói dịch vụ, thời điểm và tiện ích thường đẩy đàm phán đi xa hơn một khoản giảm giá thô, và tốn ít hơn cho khách sạn.</div>`,
  ]]);

const c2q = quiz('enh401-quiz-2', 'Quiz 2 — Negotiating & difficult situations|||Quiz 2 — Đàm phán & tình huống khó', [
  { id: 'q1', question: '"Bottom line" trong đàm phán nghĩa là?', options: ['Kết quả tối thiểu chấp nhận được', 'Lời đề nghị đầu tiên', 'Yêu cầu cuối cùng có điều kiện', 'Giá công bố ban đầu'], correctIndex: 0, explanation: 'Bottom line = giới hạn tối thiểu mà một bên có thể chấp nhận.' },
  { id: 'q2', question: 'Cấu trúc "What if we met halfway on...?" dùng để làm gì?', options: ['Từ chối thẳng', 'Đề xuất một thoả hiệp', 'Đưa ra tối hậu thư', 'Kết thúc đàm phán ngay'], correctIndex: 1, explanation: 'Đây là mẫu câu đề xuất gặp nhau ở giữa (compromise).' },
  { id: 'q3', question: 'Vì sao nên "trade on value, not just price" khi đàm phán?', options: ['Vì giá luôn cố định không đổi được', 'Vì gói dịch vụ/thời điểm thường đẩy đàm phán xa hơn và tốn ít hơn cho khách sạn', 'Vì khách hàng không quan tâm giá', 'Vì luật cấm giảm giá'], correctIndex: 1, explanation: 'Thêm giá trị (ăn sáng, phòng họp...) thường rẻ hơn giảm giá trực tiếp nhưng vẫn thoả mãn khách hàng.' },
]);

const c3 = doc('enh401-3-1-marketing-selling', '3.1 — Marketing & selling hotel services|||3.1 — Marketing & bán dịch vụ khách sạn',
  'Từ vựng USP/upselling/cross-selling, mẫu câu bán hàng, hội thoại upsell tại check-in, ngữ pháp features vs benefits.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 3 · Lesson 3.1</span>
<h2>Marketing &amp; selling hotel services</h2>
<h3>Key vocabulary</h3>
<pre><code>unique selling point (USP) — the one feature that sets a property apart from competitors
target market         — the specific group of customers a campaign is aimed at
occupancy rate         — the percentage of available rooms sold in a period
upselling              — persuading a guest to buy a higher-value option (e.g. a suite)
cross-selling          — offering a related service (e.g. spa, airport transfer)
promotional package    — a bundled offer (room + extras) at a set price
brand positioning      — how a hotel wants to be perceived versus competitors
call-to-action (CTA)   — the phrase that prompts the customer to act now ("Book today")
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"What really sets us apart is..."</strong> — leading with the USP. "...our rooftop infinity pool overlooking the bay."</li>
<li><strong>"For just a little more, you could enjoy..."</strong> — a classic upsell frame that focuses on the gain, not the extra cost.</li>
<li><strong>"Guests who book the Deluxe Room often also add..."</strong> — a soft, social-proof cross-sell.</li>
<li><strong>"Book by Friday and lock in this rate."</strong> — urgency-driven call-to-action.</li>
</ul>
<h3>Dialogue: upselling at check-in</h3>
<pre><code>Agent: Welcome, Ms. Torres. You've booked our Classic Room — for just $20 more a night, you could enjoy the
       Deluxe Room with a private balcony and sea view, which is very popular with guests staying three nights
       or more.
Guest: That does sound nice. What's the actual difference in size?
Agent: It's 8 square metres larger, plus the balcony and complimentary breakfast are included, which alone is
       worth $15.
Guest: Alright, let's do the upgrade.
</code></pre>
<h3>Advanced language point: features vs. benefits</h3>
<p>Persuasive sales language translates <strong>features</strong> (facts about the product — "8 square metres larger") into <strong>benefits</strong> (what that means for the guest — "enough space to work comfortably"). Comparatives and superlatives ("our largest suite", "more spacious than...") and framing price as small relative to value ("just $20 more") are core upper-intermediate selling patterns.</p>
<div class="callout"><span class="badge">Tip</span> Always state the benefit before the price — "you'll wake up to a sea view" lands better than "it's $20 extra" said first.</div>`,
    `<span class="eyebrow">ENH401 · Chương 3 · Bài 3.1</span>
<h2>Marketing &amp; bán dịch vụ khách sạn</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>unique selling point (USP) — điểm bán độc nhất giúp khách sạn khác biệt với đối thủ
target market          — nhóm khách hàng cụ thể mà một chiến dịch hướng tới
occupancy rate          — tỉ lệ phần trăm phòng đã bán trong một khoảng thời gian
upselling               — thuyết phục khách mua lựa chọn giá trị cao hơn (vd nâng suite)
cross-selling           — đề xuất một dịch vụ liên quan (spa, đưa đón sân bay...)
promotional package     — gói ưu đãi (phòng + dịch vụ đi kèm) theo mức giá cố định
brand positioning       — cách khách sạn muốn được nhìn nhận so với đối thủ
call-to-action (CTA)    — cụm từ thúc đẩy khách hành động ngay ("Đặt ngay hôm nay")
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"What really sets us apart is..."</strong> — mở đầu bằng USP. "...bể vô cực trên sân thượng nhìn ra vịnh."</li>
<li><strong>"For just a little more, you could enjoy..."</strong> — khung upsell kinh điển, tập trung vào lợi ích thay vì phần trả thêm.</li>
<li><strong>"Guests who book the Deluxe Room often also add..."</strong> — cross-sell nhẹ nhàng dựa trên hành vi số đông.</li>
<li><strong>"Book by Friday and lock in this rate."</strong> — lời kêu gọi hành động tạo cảm giác cấp bách.</li>
</ul>
<h3>Hội thoại: upsell lúc check-in</h3>
<pre><code>Agent: Chào chị Torres. Chị đã đặt Classic Room — chỉ với 20 đô thêm mỗi đêm, chị có thể nâng lên Deluxe Room
       với ban công riêng và view biển, rất được ưa chuộng với khách ở từ ba đêm trở lên.
Guest: Nghe hấp dẫn đó. Diện tích khác nhau thế nào?
Agent: Lớn hơn 8m2, cộng thêm ban công và ăn sáng miễn phí đi kèm, riêng phần ăn sáng đã đáng giá 15 đô.
Guest: Được, cho tôi nâng cấp.
</code></pre>
<h3>Điểm ngữ pháp nâng cao: đặc điểm (features) vs lợi ích (benefits)</h3>
<p>Ngôn ngữ bán hàng thuyết phục chuyển <strong>đặc điểm</strong> (sự thật về sản phẩm — "lớn hơn 8m2") thành <strong>lợi ích</strong> (ý nghĩa với khách — "đủ không gian để làm việc thoải mái"). So sánh và so sánh nhất ("suite lớn nhất của chúng tôi", "rộng hơn...") và đóng khung giá là nhỏ so với giá trị ("chỉ thêm 20 đô") là các mẫu bán hàng cốt lõi ở trình độ trung-cao cấp.</p>
<div class="callout"><span class="badge">Gợi ý</span> Luôn nói lợi ích trước giá — "bạn sẽ thức dậy với view biển" nghe hấp dẫn hơn khi nói trước "phải trả thêm 20 đô".</div>`,
  ]]);

const c3q = quiz('enh401-quiz-3', 'Quiz 3 — Marketing & selling|||Quiz 3 — Marketing & bán dịch vụ', [
  { id: 'q1', question: 'USP là viết tắt của?', options: ['Unique Selling Point', 'Universal Service Plan', 'Upgrade Sales Package', 'Unit Service Price'], correctIndex: 0, explanation: 'USP (Unique Selling Point) là điểm bán độc nhất giúp khách sạn khác biệt.' },
  { id: 'q2', question: 'Khi upsell, nên nói điều gì trước?', options: ['Giá trước, lợi ích sau', 'Lợi ích trước, giá sau', 'Chỉ nói giá', 'Không cần nói gì'], correctIndex: 1, explanation: 'Nói lợi ích trước giúp khách thấy giá trị trước khi cân nhắc chi phí.' },
  { id: 'q3', question: '"Cross-selling" nghĩa là gì?', options: ['Đề xuất dịch vụ liên quan để bán thêm', 'Giảm giá phòng', 'Nâng hạng phòng miễn phí', 'Huỷ đặt phòng'], correctIndex: 0, explanation: 'Cross-selling là bán thêm dịch vụ liên quan (spa, đưa đón sân bay...).' },
]);

const c4 = doc('enh401-4-1-events-conferences', '4.1 — Event & conference management English|||4.1 — Tiếng Anh tổ chức sự kiện & hội nghị',
  'Từ vựng run-of-show/AV/contingency plan, mẫu câu briefing, hội thoại briefing trước sự kiện, ngữ pháp trình tự & câu điều kiện chỉ dẫn.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 4 · Lesson 4.1</span>
<h2>Event &amp; conference management English</h2>
<h3>Key vocabulary</h3>
<pre><code>RFP (request for proposal) — a client's document asking venues to bid for their event
run-of-show            — the minute-by-minute schedule of an event
breakout session        — a smaller, parallel session within a larger conference
AV equipment            — audio-visual gear: microphones, projectors, screens
floor plan              — the diagram showing room layout and furniture placement
rider                   — a speaker's or performer's list of technical/hospitality requirements
registration desk       — the check-in point for event attendees
contingency plan        — the backup plan if something goes wrong (e.g. bad weather)
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"Let's walk through the run-of-show once more before doors open."</strong> — final briefing language.</li>
<li><strong>"In the event that the projector fails, we'll switch to the backup screen in Hall B."</strong> — contingency phrasing.</li>
<li><strong>"Could you confirm the AV rider has been actioned?"</strong> — polite follow-up/checking.</li>
<li><strong>"We'll need a 15-minute buffer between sessions for room turnover."</strong> — logistics planning.</li>
</ul>
<h3>Dialogue: pre-event briefing</h3>
<pre><code>Coordinator: Team, quick run-through. Registration opens at 8, keynote at 9 sharp in the Grand Ballroom.
AV Tech:     Mics and the main screen are tested. Backup projector is on standby in case Hall B's fails.
Catering:    Coffee break is set for 10:30, right after the first breakout sessions end.
Coordinator: Good. And if the keynote speaker's flight is delayed, we push registration by 15 minutes — that's
             our contingency. Any questions before we open the doors?
</code></pre>
<h3>Advanced language point: sequencing &amp; conditional instructions</h3>
<p>Event English relies heavily on <strong>sequencing markers</strong> (first, once, immediately after, as soon as) and <strong>conditional instructions</strong> ("in the event that...", "should the speaker be delayed, we will...") to brief a team clearly under time pressure, plus polite imperative forms ("could you just double-check...") that sound like instructions without sounding like orders.</p>
<div class="callout"><span class="badge">Tip</span> Every good briefing states the contingency plan out loud — "if X happens, we do Y" — so the team doesn't have to improvise live.</div>`,
    `<span class="eyebrow">ENH401 · Chương 4 · Bài 4.1</span>
<h2>Tiếng Anh tổ chức sự kiện &amp; hội nghị</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>RFP (request for proposal) — văn bản khách hàng gửi để địa điểm chào giá cho sự kiện
run-of-show             — lịch trình chi tiết theo từng phút của sự kiện
breakout session         — phiên nhỏ, chạy song song trong một hội nghị lớn
AV equipment             — thiết bị nghe-nhìn: micro, máy chiếu, màn hình
floor plan               — bản vẽ mặt bằng bố trí phòng và nội thất
rider                    — danh sách yêu cầu kỹ thuật/hậu cần của diễn giả hoặc nghệ sĩ
registration desk        — bàn đăng ký, nơi khách tham dự check-in
contingency plan         — phương án dự phòng khi có sự cố (vd thời tiết xấu)
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"Let's walk through the run-of-show once more before doors open."</strong> — ngôn ngữ briefing cuối cùng.</li>
<li><strong>"In the event that the projector fails, we'll switch to the backup screen in Hall B."</strong> — cách diễn đạt phương án dự phòng.</li>
<li><strong>"Could you confirm the AV rider has been actioned?"</strong> — kiểm tra lại một cách lịch sự.</li>
<li><strong>"We'll need a 15-minute buffer between sessions for room turnover."</strong> — lập kế hoạch hậu cần.</li>
</ul>
<h3>Hội thoại: briefing trước sự kiện</h3>
<pre><code>Coordinator: Cả nhóm nghe qua nhanh nhé. Đăng ký mở lúc 8h, keynote đúng 9h ở Grand Ballroom.
AV Tech:     Micro và màn hình chính đã kiểm tra xong. Máy chiếu dự phòng đứng chờ nếu máy ở Hall B lỗi.
Catering:    Giờ giải lao cà phê là 10h30, ngay sau khi các breakout session đầu tiên kết thúc.
Coordinator: Tốt. Và nếu chuyến bay của diễn giả chính bị trễ, chúng ta lùi đăng ký 15 phút — đó là phương án
             dự phòng. Còn câu hỏi nào trước khi mở cửa không?
</code></pre>
<h3>Điểm ngữ pháp nâng cao: trình tự &amp; câu điều kiện chỉ dẫn</h3>
<p>Tiếng Anh sự kiện dùng nhiều <strong>từ nối trình tự</strong> (first, once, immediately after, as soon as) và <strong>câu điều kiện chỉ dẫn</strong> ("in the event that...", "should the speaker be delayed, we will...") để briefing nhóm rõ ràng dưới áp lực thời gian, cùng dạng mệnh lệnh lịch sự ("could you just double-check...") nghe như chỉ dẫn mà không như ra lệnh.</p>
<div class="callout"><span class="badge">Gợi ý</span> Một buổi briefing tốt luôn nói to phương án dự phòng — "nếu X xảy ra, ta làm Y" — để nhóm không phải ứng biến ngay tại chỗ.</div>`,
  ]]);

const c4q = quiz('enh401-quiz-4', 'Quiz 4 — Events & conferences|||Quiz 4 — Sự kiện & hội nghị', [
  { id: 'q1', question: '"Run-of-show" là gì?', options: ['Lịch trình chi tiết theo từng phút của sự kiện', 'Danh sách khách mời', 'Hợp đồng thuê phòng', 'Bản vẽ mặt bằng'], correctIndex: 0, explanation: 'Run-of-show là lịch trình chi tiết, theo từng phút, của toàn bộ sự kiện.' },
  { id: 'q2', question: '"Contingency plan" dùng khi nào?', options: ['Khi mọi thứ diễn ra đúng kế hoạch', 'Khi có sự cố xảy ra ngoài dự kiến', 'Khi kết thúc sự kiện', 'Khi đăng ký khách tham dự'], correctIndex: 1, explanation: 'Contingency plan là phương án dự phòng cho các sự cố ngoài dự kiến.' },
  { id: 'q3', question: 'Vì sao một buổi briefing tốt nên nói to phương án dự phòng?', options: ['Để khoe kinh nghiệm', 'Để nhóm không phải ứng biến ngay tại chỗ khi có sự cố', 'Vì quy định bắt buộc', 'Để kéo dài thời gian họp'], correctIndex: 1, explanation: 'Nói rõ "nếu X xảy ra, ta làm Y" giúp cả nhóm biết trước cách xử lý, không phải ứng biến.' },
]);

const c5 = doc('enh401-5-1-team-leadership', '5.1 — Team leadership & staff communication|||5.1 — Lãnh đạo nhóm & giao tiếp với nhân viên',
  'Từ vựng delegation/SOP/feedback, mẫu câu góp ý, hội thoại phản hồi nhân viên, ngữ pháp động từ khuyết thiếu trong lãnh đạo.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 5 · Lesson 5.1</span>
<h2>Team leadership &amp; staff communication</h2>
<h3>Key vocabulary</h3>
<pre><code>shift handover         — the briefing passed from one shift's team to the next
standard operating procedure (SOP) — the official step-by-step way a task must be done
delegation             — assigning a task and its responsibility to someone else
constructive feedback  — feedback aimed at improvement, not blame
chain of command        — the official reporting order between staff levels
cross-training          — training staff to cover more than one role
morale                  — the overall mood and motivation of a team
accountability          — being answerable for a task's outcome
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"Talk me through how you handled that, and what you'd do differently."</strong> — coaching question, not accusation.</li>
<li><strong>"I'd like you to own this from start to finish."</strong> — clear delegation with accountability.</li>
<li><strong>"You handled the guest really well — one thing to work on is..."</strong> — the feedback "sandwich": positive, then developmental.</li>
<li><strong>"Let's flag this to the next shift so nothing gets lost."</strong> — handover language.</li>
</ul>
<h3>Dialogue: feedback conversation with a team member</h3>
<pre><code>Supervisor: You handled that guest complaint calmly, which I really appreciated. One thing to work on — try to
            offer a solution earlier in the conversation, before the guest has to ask for one.
Staff:      That makes sense, I was still checking the room availability in my head.
Supervisor: Totally understandable. Next time, just say "let me check that for you" out loud — it buys you time
            and reassures the guest at the same time.
Staff:      Got it, I'll do that going forward.
</code></pre>
<h3>Advanced language point: modality for leadership</h3>
<p>Leaders vary modal strength depending on the message: <strong>obligation</strong> ("you must log every incident") for safety/compliance, <strong>advice</strong> ("you should double-check the folio") for best practice, and <strong>soft suggestion</strong> ("you might want to try...") for coaching. Mixing register — friendly but clear — keeps authority without sounding harsh.</p>
<div class="callout"><span class="badge">Tip</span> The feedback sandwich (positive → developmental → positive/forward-looking) works because it keeps the listener receptive instead of defensive.</div>`,
    `<span class="eyebrow">ENH401 · Chương 5 · Bài 5.1</span>
<h2>Lãnh đạo nhóm &amp; giao tiếp với nhân viên</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>shift handover          — bàn giao thông tin từ ca làm này sang ca kế tiếp
standard operating procedure (SOP) — quy trình chuẩn, các bước chính thức bắt buộc phải làm
delegation              — giao việc và trách nhiệm cho người khác
constructive feedback   — phản hồi nhằm cải thiện, không nhằm đổ lỗi
chain of command         — trật tự báo cáo chính thức giữa các cấp nhân viên
cross-training           — huấn luyện nhân viên để đảm nhiệm nhiều hơn một vai trò
morale                   — tinh thần và động lực chung của một nhóm
accountability           — trách nhiệm giải trình cho kết quả một công việc
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"Talk me through how you handled that, and what you'd do differently."</strong> — câu hỏi huấn luyện, không phải buộc tội.</li>
<li><strong>"I'd like you to own this from start to finish."</strong> — giao việc rõ ràng kèm trách nhiệm.</li>
<li><strong>"You handled the guest really well — one thing to work on is..."</strong> — "bánh sandwich" phản hồi: khen trước, góp ý sau.</li>
<li><strong>"Let's flag this to the next shift so nothing gets lost."</strong> — ngôn ngữ bàn giao ca.</li>
</ul>
<h3>Hội thoại: buổi góp ý với một nhân viên</h3>
<pre><code>Supervisor: Em xử lý phàn nàn của khách rất bình tĩnh, chị rất đánh giá cao điều đó. Một điểm cần cải thiện —
            hãy thử đưa ra giải pháp sớm hơn trong cuộc nói chuyện, trước khi khách phải hỏi lại.
Staff:      Em hiểu rồi, lúc đó em vẫn đang kiểm tra tình trạng phòng trong đầu.
Supervisor: Rất bình thường thôi. Lần sau, chỉ cần nói to "để em kiểm tra giúp anh/chị" — nó vừa giúp em có
            thêm thời gian, vừa trấn an khách ngay lúc đó.
Staff:      Em hiểu rồi, từ nay em sẽ làm vậy.
</code></pre>
<h3>Điểm ngữ pháp nâng cao: động từ khuyết thiếu trong lãnh đạo</h3>
<p>Người lãnh đạo thay đổi mức độ mạnh của động từ khuyết thiếu tuỳ theo thông điệp: <strong>bắt buộc</strong> ("you must log every incident") cho an toàn/tuân thủ, <strong>lời khuyên</strong> ("you should double-check the folio") cho thực hành tốt nhất, và <strong>gợi ý nhẹ</strong> ("you might want to try...") khi huấn luyện. Trộn văn phong — thân thiện nhưng rõ ràng — giữ được uy tín mà không nghe gay gắt.</p>
<div class="callout"><span class="badge">Gợi ý</span> "Bánh sandwich phản hồi" (khen → góp ý cần cải thiện → khen/hướng tới) hiệu quả vì giữ người nghe cởi mở thay vì phòng thủ.</div>`,
  ]]);

const c5q = quiz('enh401-quiz-5', 'Quiz 5 — Team leadership & communication|||Quiz 5 — Lãnh đạo nhóm & giao tiếp', [
  { id: 'q1', question: '"SOP" là viết tắt của?', options: ['Standard Operating Procedure', 'Special Operations Plan', 'Staff Onboarding Process', 'Service Overview Paper'], correctIndex: 0, explanation: 'SOP (Standard Operating Procedure) là quy trình chuẩn bắt buộc cho một công việc.' },
  { id: 'q2', question: '"Feedback sandwich" có cấu trúc nào?', options: ['Chê - chê - chê', 'Khen - góp ý cần cải thiện - khen/hướng tới', 'Chỉ khen', 'Chỉ chê, không khen'], correctIndex: 1, explanation: 'Cấu trúc "sandwich": tích cực → điểm cần cải thiện → tích cực/hướng tới tương lai.' },
  { id: 'q3', question: 'Khi nào lãnh đạo nên dùng "must" thay vì "should"?', options: ['Khi chỉ là gợi ý nhẹ', 'Khi liên quan an toàn/tuân thủ bắt buộc', 'Khi muốn nói nhẹ nhàng hơn', 'Không bao giờ dùng "must"'], correctIndex: 1, explanation: '"Must" thể hiện tính bắt buộc, dùng cho an toàn và tuân thủ quy định.' },
]);

const c6 = doc('enh401-6-1-correspondence-reports', '6.1 — Business correspondence & reports|||6.1 — Thư từ thương mại & báo cáo',
  'Từ vựng incident report/executive summary/action items, mẫu câu email trang trọng, mẫu báo cáo sự cố, ngữ pháp thể bị động & văn phong trang trọng.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 6 · Lesson 6.1</span>
<h2>Business correspondence &amp; reports</h2>
<h3>Key vocabulary</h3>
<pre><code>incident report        — a formal written record of an unusual event (accident, complaint, damage)
executive summary       — a short opening section that summarises a longer report's key points
to draft                — to write a first version of a document
formal register          — a level of language appropriate for official, professional writing
follow-up email          — a message sent after an earlier one, to check status or add information
action items             — the specific tasks agreed on, usually with an owner and a deadline
occupancy report         — a report showing how many rooms were sold, and at what rate
CC / BCC                — copying other recipients openly (CC) or invisibly (BCC) on an email
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"Please find attached the incident report for your review."</strong> — formal email opener for reports.</li>
<li><strong>"I am writing to follow up on..."</strong> — a polite, formal follow-up opener.</li>
<li><strong>"The following action items were agreed during the meeting:"</strong> — introducing a task list in a report.</li>
<li><strong>"Should you require any further information, please do not hesitate to contact me."</strong> — a formal closing line.</li>
</ul>
<h3>Example: short incident report</h3>
<pre><code>INCIDENT REPORT
Date/time: 14 Sept, 22:40   Location: 4th floor corridor
Summary: A guest reported a leak from the ceiling near room 412. Housekeeping was
         notified immediately and the guest was relocated to room 508 at no extra cost.
Action items: 1) Maintenance to inspect the pipe by 09:00 the next day (Owner: J. Tran)
              2) Front office to follow up with the guest by phone (Owner: R. Nguyen)
</code></pre>
<h3>Advanced language point: formal register &amp; the passive voice</h3>
<p>Written hospitality English is more formal than spoken English, and often uses the <strong>passive voice</strong> to sound objective and to avoid naming blame directly: "The guest was relocated to room 508" rather than "We moved the guest." Reports open with an <strong>executive summary</strong>, state facts before opinions, and always close with clear, owned <strong>action items</strong>.</p>
<div class="callout"><span class="badge">Tip</span> A report without a named owner and a deadline on each action item is just a list of problems, not a plan.</div>`,
    `<span class="eyebrow">ENH401 · Chương 6 · Bài 6.1</span>
<h2>Thư từ thương mại &amp; báo cáo</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>incident report          — báo cáo chính thức bằng văn bản về một sự cố bất thường (tai nạn, phàn nàn, hư hại)
executive summary        — phần tóm tắt ngắn ở đầu báo cáo, nêu các điểm chính
to draft                 — soạn phiên bản đầu tiên của một văn bản
formal register           — mức độ ngôn ngữ phù hợp với văn bản chính thức, chuyên nghiệp
follow-up email           — thư gửi sau một thư trước đó, để kiểm tra tình trạng hoặc bổ sung thông tin
action items              — các việc cụ thể đã được thống nhất, thường kèm người phụ trách và hạn chót
occupancy report          — báo cáo cho biết bao nhiêu phòng đã bán, với mức giá nào
CC / BCC                 — sao gửi công khai (CC) hoặc ẩn danh (BCC) cho người nhận khác trên email
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"Please find attached the incident report for your review."</strong> — mở đầu email trang trọng khi gửi báo cáo.</li>
<li><strong>"I am writing to follow up on..."</strong> — mở đầu lịch sự, trang trọng khi theo dõi lại một việc.</li>
<li><strong>"The following action items were agreed during the meeting:"</strong> — dẫn vào danh sách việc cần làm trong báo cáo.</li>
<li><strong>"Should you require any further information, please do not hesitate to contact me."</strong> — câu kết trang trọng.</li>
</ul>
<h3>Ví dụ: báo cáo sự cố ngắn</h3>
<pre><code>BÁO CÁO SỰ CỐ
Ngày/giờ: 14/9, 22:40   Vị trí: hành lang tầng 4
Tóm tắt: Khách báo có nước rò từ trần gần phòng 412. Housekeeping được thông báo
         ngay lập tức và khách được chuyển sang phòng 508, không tính thêm phí.
Việc cần làm: 1) Bảo trì kiểm tra đường ống trước 09:00 sáng hôm sau (Phụ trách: J. Trần)
              2) Lễ tân gọi điện theo dõi lại với khách (Phụ trách: R. Nguyễn)
</code></pre>
<h3>Điểm ngữ pháp nâng cao: văn phong trang trọng &amp; thể bị động</h3>
<p>Tiếng Anh viết trong khách sạn trang trọng hơn tiếng Anh nói, và thường dùng <strong>thể bị động</strong> để nghe khách quan và tránh chỉ đích danh đổ lỗi: "The guest was relocated to room 508" thay vì "We moved the guest." Báo cáo mở đầu bằng <strong>executive summary</strong>, nêu sự thật trước ý kiến, và luôn kết bằng các <strong>action items</strong> rõ người phụ trách.</p>
<div class="callout"><span class="badge">Gợi ý</span> Một báo cáo không có người phụ trách và hạn chót cho mỗi việc cần làm chỉ là danh sách vấn đề, không phải một kế hoạch.</div>`,
  ]]);

const c6q = quiz('enh401-quiz-6', 'Quiz 6 — Correspondence & reports|||Quiz 6 — Thư từ & báo cáo', [
  { id: 'q1', question: '"Executive summary" nằm ở đâu trong báo cáo và làm gì?', options: ['Cuối báo cáo, liệt kê nguồn', 'Đầu báo cáo, tóm tắt các điểm chính', 'Giữa báo cáo, kể chuyện chi tiết', 'Không cần có trong báo cáo'], correctIndex: 1, explanation: 'Executive summary mở đầu báo cáo, tóm tắt ngắn các điểm quan trọng nhất.' },
  { id: 'q2', question: 'Vì sao báo cáo sự cố thường dùng thể bị động (passive voice)?', options: ['Để câu dài dòng hơn', 'Để nghe khách quan và tránh chỉ đích danh đổ lỗi', 'Vì quy tắc ngữ pháp bắt buộc', 'Vì dễ dịch hơn'], correctIndex: 1, explanation: 'Thể bị động ("guest was relocated") giữ giọng khách quan, không quy trách nhiệm trực tiếp.' },
  { id: 'q3', question: 'Một "action item" tốt cần có gì?', options: ['Chỉ cần mô tả vấn đề', 'Người chịu trách nhiệm và thời hạn cụ thể', 'Chỉ cần thời hạn, không cần người phụ trách', 'Không cần thông tin gì thêm'], correctIndex: 1, explanation: 'Action item cần rõ ai làm (owner) và khi nào xong (deadline) để thành một kế hoạch thực thi được.' },
]);

const c7 = doc('enh401-7-1-cross-cultural-communication', '7.1 — Cross-cultural communication in hospitality|||7.1 — Giao tiếp đa văn hoá trong khách sạn',
  'Từ vựng high/low-context culture, mẫu câu hỏi tế nhị, hội thoại điều chỉnh phong cách phục vụ, ngữ pháp đọc bối cảnh & câu hỏi mở.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 7 · Lesson 7.1</span>
<h2>Cross-cultural communication in hospitality</h2>
<h3>Key vocabulary</h3>
<pre><code>cultural sensitivity     — awareness of and respect for cultural differences
high-context culture     — a culture that relies heavily on implied meaning, tone and context
low-context culture      — a culture that relies on explicit, direct verbal statements
non-verbal cue           — body language, gestures, eye contact and their meaning
dietary restriction      — a food limitation based on religion, health or culture
personal space           — the physical distance people expect in interaction
direct/indirect communication — stating things plainly vs. hinting or softening them
inclusive language       — wording that avoids excluding or stereotyping any group
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"May I ask if you have any dietary requirements we should be aware of?"</strong> — a respectful, open way to check needs without assuming.</li>
<li><strong>"I want to make sure I've understood you correctly — could you confirm...?"</strong> — checking meaning across a language/culture gap.</li>
<li><strong>"Some of our guests prefer more formal address, so we default to 'Mr./Ms.' unless told otherwise."</strong> — house-style guidance for staff.</li>
<li><strong>"I noticed you seemed hesitant — is everything to your satisfaction?"</strong> — reading indirect signals and inviting direct feedback gently.</li>
</ul>
<h3>Dialogue: adapting service style</h3>
<pre><code>Staff: Good afternoon. Before I finalise your dinner reservation, may I ask if there are any dietary
       requirements or allergies I should pass on to the kitchen?
Guest: We don't eat pork or alcohol-based sauces, and my grandmother prefers everything served warm, not chilled.
Staff: Understood, I'll note that clearly for the kitchen and let the restaurant team know in advance.
Guest: Thank you, that's very thoughtful of you to ask.
</code></pre>
<h3>Advanced language point: reading context, not just words</h3>
<p>In high-context cultures, a guest's hesitation, silence or indirect phrasing ("it's fine, don't worry") can actually mean the opposite. Upper-intermediate staff learn to <strong>ask open, low-pressure questions</strong> rather than yes/no questions, and to avoid assumptions based on nationality alone — cultural background is a tendency, not a rule for every individual.</p>
<div class="callout"><span class="badge">Tip</span> When in doubt, ask rather than assume — and ask in a way that gives the guest an easy way to say what they really need.</div>`,
    `<span class="eyebrow">ENH401 · Chương 7 · Bài 7.1</span>
<h2>Giao tiếp đa văn hoá trong khách sạn</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>cultural sensitivity      — sự nhận biết và tôn trọng khác biệt văn hoá
high-context culture      — nền văn hoá dựa nhiều vào ý nghĩa ngầm, ngữ điệu và bối cảnh
low-context culture       — nền văn hoá dựa vào lời nói trực tiếp, rõ ràng
non-verbal cue            — ngôn ngữ cơ thể, cử chỉ, giao tiếp mắt và ý nghĩa của chúng
dietary restriction       — hạn chế về thực phẩm do tôn giáo, sức khoẻ hoặc văn hoá
personal space            — khoảng cách vật lý mà con người mong đợi khi giao tiếp
direct/indirect communication — nói thẳng vấn đề vs. gợi ý hoặc giảm nhẹ cách nói
inclusive language        — cách diễn đạt tránh loại trừ hoặc rập khuôn bất kỳ nhóm nào
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"May I ask if you have any dietary requirements we should be aware of?"</strong> — cách hỏi tôn trọng, cởi mở để kiểm tra nhu cầu mà không giả định trước.</li>
<li><strong>"I want to make sure I've understood you correctly — could you confirm...?"</strong> — xác nhận lại ý nghĩa khi có khoảng cách ngôn ngữ/văn hoá.</li>
<li><strong>"Some of our guests prefer more formal address, so we default to 'Mr./Ms.' unless told otherwise."</strong> — hướng dẫn văn phong chung cho nhân viên.</li>
<li><strong>"I noticed you seemed hesitant — is everything to your satisfaction?"</strong> — nhận ra tín hiệu gián tiếp và nhẹ nhàng mời khách nói thẳng.</li>
</ul>
<h3>Hội thoại: điều chỉnh phong cách phục vụ</h3>
<pre><code>Staff: Chào ông/bà. Trước khi hoàn tất đặt bàn tối, cho tôi hỏi có yêu cầu về ăn uống hay dị ứng nào cần
       báo cho nhà bếp không?
Guest: Chúng tôi không ăn thịt heo hoặc nước sốt có cồn, và bà tôi thích mọi món được phục vụ ấm, không lạnh.
Staff: Tôi hiểu rồi, tôi sẽ ghi chú rõ cho nhà bếp và báo trước cho đội nhà hàng.
Guest: Cảm ơn, thật tinh ý khi bạn hỏi điều đó.
</code></pre>
<h3>Điểm ngữ pháp nâng cao: đọc bối cảnh, không chỉ đọc lời nói</h3>
<p>Ở các nền văn hoá high-context, sự ngập ngừng, im lặng hoặc cách nói gián tiếp của khách ("không sao, đừng lo") có thể thực ra mang nghĩa ngược lại. Nhân viên trình độ trung-cao cấp học cách <strong>đặt câu hỏi mở, ít áp lực</strong> thay vì câu hỏi có/không, và tránh giả định chỉ dựa trên quốc tịch — nền văn hoá là một xu hướng chung, không phải quy tắc cho mọi cá nhân.</p>
<div class="callout"><span class="badge">Gợi ý</span> Khi còn nghi ngờ, hãy hỏi thay vì giả định — và hỏi theo cách giúp khách dễ dàng nói ra điều họ thực sự cần.</div>`,
  ]]);

const c7q = quiz('enh401-quiz-7', 'Quiz 7 — Cross-cultural communication|||Quiz 7 — Giao tiếp đa văn hoá', [
  { id: 'q1', question: '"High-context culture" nghĩa là gì?', options: ['Văn hoá dựa nhiều vào ý nghĩa ngầm, ngữ điệu và bối cảnh', 'Văn hoá luôn nói thẳng mọi thứ', 'Văn hoá không quan tâm phong tục', 'Văn hoá chỉ giao tiếp bằng văn bản'], correctIndex: 0, explanation: 'High-context culture dựa nhiều vào ngữ cảnh, ngữ điệu và ý nghĩa ngầm hơn là lời nói trực tiếp.' },
  { id: 'q2', question: 'Khi khách nói "it\'s fine, don\'t worry" một cách ngập ngừng, nên làm gì?', options: ['Tin ngay là mọi thứ ổn', 'Hỏi thêm một cách cởi mở, nhẹ nhàng để chắc chắn', 'Bỏ qua hoàn toàn', 'Chuyển sang phàn nàn ngược lại khách'], correctIndex: 1, explanation: 'Nên hỏi mở, nhẹ nhàng để khách có cơ hội nói ra điều thực sự cần, tránh hiểu sai tín hiệu gián tiếp.' },
  { id: 'q3', question: 'Vì sao không nên giả định nhu cầu của khách chỉ dựa vào quốc tịch?', options: ['Vì quốc tịch không tồn tại', 'Vì nền văn hoá là một xu hướng chung, không phải quy tắc cho mọi cá nhân', 'Vì luật cấm hỏi quốc tịch', 'Vì khách sạn không phục vụ khách quốc tế'], correctIndex: 1, explanation: 'Mỗi cá nhân có thể khác với xu hướng chung của văn hoá họ, nên cần hỏi thay vì giả định.' },
]);

const c8 = doc('enh401-8-1-presentations-networking', '8.1 — Presentations & professional networking|||8.1 — Thuyết trình & kết nối chuyên nghiệp',
  'Từ vựng elevator pitch/signposting, mẫu câu thuyết trình & networking, hội thoại kết nối tại hội nghị, ngữ pháp dẫn dắt & câu hỏi tu từ.',
  [[
    `<span class="eyebrow">ENH401 · Chapter 8 · Lesson 8.1</span>
<h2>Presentations &amp; professional networking</h2>
<h3>Key vocabulary</h3>
<pre><code>elevator pitch          — a very short, persuasive self-introduction (under a minute)
signposting language     — phrases that guide listeners through a talk's structure
visual aid               — a slide, chart or object used to support a spoken point
Q&amp;A session            — the question-and-answer part after a presentation
rapport                  — a friendly, trusting connection between two people
key takeaway             — the single most important point to remember from a talk
follow-up (noun)         — the message or action taken after an initial meeting
networking event         — a gathering organised for professionals to make new contacts
</code></pre>
<h3>Useful expressions</h3>
<ul>
<li><strong>"I'm [Name], I manage guest experience at [Hotel] — we help business travellers feel at home."</strong> — an elevator pitch template.</li>
<li><strong>"Moving on to our second point..." / "To sum up..."</strong> — signposting a presentation's structure.</li>
<li><strong>"That's a great question — let me address that."</strong> — a confident Q&amp;A opener, even for a hard question.</li>
<li><strong>"It was great meeting you — let's stay in touch. Could I get your contact details?"</strong> — a natural networking close.</li>
</ul>
<h3>Dialogue: networking at an industry conference</h3>
<pre><code>Person A: Hi, I don't think we've met — I'm Lan, I handle events at the Riverside Hotel.
Person B: Nice to meet you, Lan. I'm David, procurement manager for a regional airline — we book a lot of crew
          accommodation, actually.
Person A: That's a great overlap. I'd love to send you our corporate rates — could I get your card, or shall I
          just email you directly?
Person B: Email works, here's my card. Let's follow up next week.
</code></pre>
<h3>Advanced language point: signposting &amp; audience engagement</h3>
<p>Confident presenters use clear <strong>signposting</strong> ("firstly... next... to conclude...") so the audience never gets lost, and <strong>rhetorical questions</strong> ("So why does this matter to you?") to re-engage attention. In networking, the goal of small talk is not the conversation itself but a natural, low-pressure <strong>follow-up</strong> — get the contact, then let the relationship build over time.</p>
<div class="callout"><span class="badge">Tip</span> End every networking conversation with a concrete next step ("I'll email you Monday") — vague goodwill ("let's stay in touch") is usually forgotten by both sides.</div>`,
    `<span class="eyebrow">ENH401 · Chương 8 · Bài 8.1</span>
<h2>Thuyết trình &amp; kết nối chuyên nghiệp</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>elevator pitch           — lời tự giới thiệu rất ngắn, thuyết phục (dưới một phút)
signposting language      — các cụm từ dẫn dắt người nghe qua cấu trúc bài nói
visual aid                — slide, biểu đồ hoặc vật thể hỗ trợ cho điểm đang trình bày
Q&amp;A session             — phần hỏi-đáp sau bài thuyết trình
rapport                   — sự kết nối thân thiện, tin cậy giữa hai người
key takeaway              — điểm quan trọng nhất cần nhớ từ một bài nói
follow-up (danh từ)        — thông điệp hoặc hành động thực hiện sau buổi gặp đầu tiên
networking event           — buổi gặp mặt được tổ chức để người làm nghề tạo mối quan hệ mới
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li><strong>"I'm [Name], I manage guest experience at [Hotel] — we help business travellers feel at home."</strong> — mẫu elevator pitch.</li>
<li><strong>"Moving on to our second point..." / "To sum up..."</strong> — dẫn dắt cấu trúc bài thuyết trình.</li>
<li><strong>"That's a great question — let me address that."</strong> — mở đầu tự tin cho phần hỏi-đáp, kể cả với câu hỏi khó.</li>
<li><strong>"It was great meeting you — let's stay in touch. Could I get your contact details?"</strong> — cách kết thúc networking tự nhiên.</li>
</ul>
<h3>Hội thoại: kết nối tại một hội nghị ngành</h3>
<pre><code>Person A: Chào, tôi nghĩ chúng ta chưa gặp — tôi là Lan, phụ trách sự kiện ở khách sạn Riverside.
Person B: Rất vui được gặp Lan. Tôi là David, quản lý mua hàng của một hãng bay khu vực — thực ra chúng tôi
          đặt rất nhiều phòng cho tổ bay.
Person A: Đó là một điểm chung tuyệt vời. Tôi rất muốn gửi anh bảng giá doanh nghiệp — tôi lấy card của anh
          được không, hay tôi email trực tiếp luôn?
Person B: Email được, đây là card của tôi. Tuần sau ta liên lạc lại nhé.
</code></pre>
<h3>Điểm ngữ pháp nâng cao: dẫn dắt &amp; thu hút người nghe</h3>
<p>Người thuyết trình tự tin dùng <strong>dẫn dắt rõ ràng</strong> ("firstly... next... to conclude...") để người nghe không bị lạc, và <strong>câu hỏi tu từ</strong> ("So why does this matter to you?") để kéo lại sự chú ý. Trong networking, mục tiêu của chuyện xã giao không phải là cuộc nói chuyện đó, mà là một <strong>bước tiếp theo</strong> tự nhiên, ít áp lực — lấy được liên hệ, rồi để quan hệ phát triển dần theo thời gian.</p>
<div class="callout"><span class="badge">Gợi ý</span> Kết thúc mọi cuộc trò chuyện networking bằng một bước tiếp theo cụ thể ("tôi sẽ email anh vào thứ Hai") — thiện chí mơ hồ ("giữ liên lạc nhé") thường bị cả hai bên quên mất.</div>`,
  ]]);

const c8q = quiz('enh401-quiz-8', 'Quiz 8 — Presentations & networking|||Quiz 8 — Thuyết trình & kết nối', [
  { id: 'q1', question: '"Elevator pitch" là gì?', options: ['Bài thuyết trình dài một giờ', 'Lời tự giới thiệu ngắn, thuyết phục trong dưới một phút', 'Một loại hợp đồng', 'Một buổi họp báo'], correctIndex: 1, explanation: 'Elevator pitch là lời tự giới thiệu rất ngắn, đủ thời gian một chuyến đi thang máy.' },
  { id: 'q2', question: '"Signposting language" trong thuyết trình dùng để làm gì?', options: ['Trang trí slide', 'Dẫn dắt người nghe qua cấu trúc bài nói (đầu tiên...tiếp theo...tóm lại...)', 'Chỉ để đọc số liệu', 'Kết thúc buổi hỏi đáp'], correctIndex: 1, explanation: 'Signposting language là các cụm từ dẫn dắt cấu trúc bài nói, giúp người nghe theo dõi dễ hơn.' },
  { id: 'q3', question: 'Kết thúc một cuộc trò chuyện kết nối (networking) tốt nên có gì?', options: ['Chỉ nói lời chào tạm biệt chung', 'Một bước tiếp theo cụ thể (ví dụ hẹn gửi email vào ngày cụ thể)', 'Không cần làm gì thêm', 'Một lời mời không liên quan đến công việc'], correctIndex: 1, explanation: 'Một bước tiếp theo cụ thể (email, hẹn gặp...) giúp mối quan hệ networking thực sự được tiếp nối.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'ENH401',
    slug: 'enh401-business-english-for-hospitality-upper-intermediate',
    title: 'Business English for Hospitality - Upper Intermediate',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ENH401.webp',
    shortDescription: 'Upper-intermediate hospitality business English: VIP guest relations & service recovery, negotiation, marketing, events, leadership, correspondence, cross-cultural skills, presentations & networking. Bilingual, with vocabulary, dialogues & quizzes.|||Tiếng Anh khách sạn trình độ trung-cao cấp: khách VIP & khắc phục dịch vụ, đàm phán, marketing, sự kiện, lãnh đạo, thư từ, đa văn hoá, thuyết trình & kết nối. Song ngữ, có từ vựng, hội thoại & quiz.',
    description: 'Môn <strong>ENH401 — Business English for Hospitality (Upper Intermediate)</strong> thuộc khối Quản trị Kinh doanh (BBA), kỳ 2, <strong>tiếp nối ENH301</strong> ở trình độ cao hơn. Từ <strong>quan hệ khách VIP &amp; khắc phục dịch vụ</strong> → <strong>đàm phán &amp; xử lý tình huống khó</strong> → <strong>marketing &amp; bán dịch vụ khách sạn</strong> → <strong>tổ chức sự kiện &amp; hội nghị</strong> → <strong>lãnh đạo nhóm &amp; giao tiếp với nhân viên</strong> → <strong>thư từ thương mại &amp; báo cáo</strong> → <strong>giao tiếp đa văn hoá</strong> → <strong>thuyết trình &amp; kết nối chuyên nghiệp</strong>. Song ngữ, có từ vựng, mẫu câu, hội thoại thực tế và quiz mỗi chương. Tham khảo <em>English for International Tourism (Upper Intermediate)</em> — Pearson, <em>Professional English in Use</em> — Cambridge, và <em>Hospitality Management English</em>.',
    whatYouLearn: 'Ngôn ngữ giảm nhẹ & khắc phục dịch vụ cho khách VIP; câu điều kiện & ngoại giao trong đàm phán; features vs benefits khi marketing/bán dịch vụ; trình tự & câu điều kiện chỉ dẫn khi tổ chức sự kiện; động từ khuyết thiếu trong lãnh đạo & phản hồi nhân viên; văn phong trang trọng & thể bị động trong thư từ/báo cáo; đọc bối cảnh & câu hỏi mở trong giao tiếp đa văn hoá; dẫn dắt & câu hỏi tu từ khi thuyết trình và networking chuyên nghiệp.',
    requirements: 'Đã hoàn thành ENH301 (Business English for Hospitality - Intermediate) hoặc trình độ tiếng Anh tương đương B1-B2. Nên có kiến thức cơ bản về vận hành khách sạn/du lịch.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình Pearson/Cambridge/Hospitality Management English, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tiếp nối ENH301; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Quan hệ khách hàng & VIP|||Chapter 1 — Guest relations & VIP', description: 'Service recovery, ngôn ngữ giảm nhẹ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đàm phán & tình huống khó|||Chapter 2 — Negotiating & difficult situations', description: 'Câu điều kiện, ngôn ngữ ngoại giao.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Marketing & bán dịch vụ|||Chapter 3 — Marketing & selling', description: 'Upselling, cross-selling, features vs benefits.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sự kiện & hội nghị|||Chapter 4 — Events & conferences', description: 'Run-of-show, contingency plan, briefing.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Lãnh đạo nhóm & giao tiếp|||Chapter 5 — Team leadership & communication', description: 'Delegation, feedback sandwich, modal verbs.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thư từ & báo cáo|||Chapter 6 — Correspondence & reports', description: 'Incident report, executive summary, thể bị động.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giao tiếp đa văn hoá|||Chapter 7 — Cross-cultural communication', description: 'High/low-context, đọc bối cảnh.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thuyết trình & kết nối|||Chapter 8 — Presentations & networking', description: 'Elevator pitch, signposting, follow-up.', lessons: [c8, c8q] },
  ],
};
