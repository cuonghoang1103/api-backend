/**
 * IBF201 — Introduction to Behavioral Finance / Nhập môn Tài chính hành vi.
 * Khối Công nghệ Truyền thông FPTU (Kỳ 4). Góc nhìn hành vi/tâm lý trong ra
 * quyết định — hữu ích cho marketing & truyền thông. Song ngữ + thí nghiệm
 * thật + quiz. Sách chuẩn: Kahneman "Thinking, Fast and Slow"; Thaler & Sunstein
 * "Nudge"; Ariely "Predictably Irrational"; Shefrin "Beyond Greed and Fear".
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${ lồng; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ibf201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Kahneman, Thaler, Ariely, Shefrin), CFA, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">IBF201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Behavioral Finance</strong> — how real people (not textbook "rational agents") actually decide about money, risk and reward — in one place. Official slides &amp; syllabus live on <strong>FLM</strong>; below are legal, mostly-free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for IBF201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow" target="_blank" rel="noopener">Daniel Kahneman — <em>Thinking, Fast and Slow</em></a> (System 1 &amp; 2, heuristics, prospect theory)</li>
<li><a href="https://en.wikipedia.org/wiki/Nudge_(book)" target="_blank" rel="noopener">Thaler &amp; Sunstein — <em>Nudge</em></a> (choice architecture, defaults)</li>
<li><a href="https://en.wikipedia.org/wiki/Predictably_Irrational" target="_blank" rel="noopener">Dan Ariely — <em>Predictably Irrational</em></a> (experiments on everyday irrationality)</li>
<li><a href="https://global.oup.com/academic/product/beyond-greed-and-fear-9780195304213" target="_blank" rel="noopener">Hersh Shefrin — <em>Beyond Greed and Fear</em></a> (behavioral finance in markets)</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2024/behavioral-finance" target="_blank" rel="noopener">CFA Institute — Behavioral Finance readings</a></li>
<li><a href="https://www.behavioraleconomics.com/resources/mini-encyclopedia-of-be/" target="_blank" rel="noopener">Mini-encyclopedia of Behavioral Economics</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@veritasium" target="_blank" rel="noopener">Veritasium</a> — decision-making &amp; cognitive bias explainers</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED — Dan Ariely &amp; behavioral talks</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.thedecisionlab.com/biases" target="_blank" rel="noopener">The Decision Lab — bias reference library</a></li>
<li><a href="https://en.wikipedia.org/wiki/List_of_cognitive_biases" target="_blank" rel="noopener">List of cognitive biases (Wikipedia)</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what behavioral finance is; rational vs. real decision-makers; System 1/2.</li>
<li><strong>Biases</strong> — heuristics, overconfidence, loss aversion, framing — spot them in your own choices.</li>
<li><strong>Markets &amp; nudges</strong> — herding, bubbles, choice architecture and defaults.</li>
<li><strong>Apply</strong> — use it ethically in marketing &amp; communication; know where nudge ends and manipulation begins.</li>
</ol></div>`,
    `<span class="eyebrow">IBF201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tài chính hành vi</strong> — người thật (không phải "tác nhân lý trí" trong sách) thực sự ra quyết định về tiền, rủi ro và phần thưởng thế nào — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn hợp pháp, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IBF201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow" target="_blank" rel="noopener">Daniel Kahneman — <em>Thinking, Fast and Slow</em></a> (Hệ 1 &amp; 2, heuristic, lý thuyết triển vọng)</li>
<li><a href="https://en.wikipedia.org/wiki/Nudge_(book)" target="_blank" rel="noopener">Thaler &amp; Sunstein — <em>Nudge</em></a> (kiến trúc lựa chọn, mặc định)</li>
<li><a href="https://en.wikipedia.org/wiki/Predictably_Irrational" target="_blank" rel="noopener">Dan Ariely — <em>Predictably Irrational</em></a> (thí nghiệm về sự phi lý hằng ngày)</li>
<li><a href="https://global.oup.com/academic/product/beyond-greed-and-fear-9780195304213" target="_blank" rel="noopener">Hersh Shefrin — <em>Beyond Greed and Fear</em></a> (tài chính hành vi trong thị trường)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2024/behavioral-finance" target="_blank" rel="noopener">CFA Institute — tài liệu Behavioral Finance</a></li>
<li><a href="https://www.behavioraleconomics.com/resources/mini-encyclopedia-of-be/" target="_blank" rel="noopener">Bách khoa thu nhỏ Kinh tế học hành vi</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@veritasium" target="_blank" rel="noopener">Veritasium</a> — giảng về ra quyết định &amp; thiên kiến</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED — Dan Ariely &amp; các bài nói hành vi</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.thedecisionlab.com/biases" target="_blank" rel="noopener">The Decision Lab — thư viện tra thiên kiến</a></li>
<li><a href="https://en.wikipedia.org/wiki/List_of_cognitive_biases" target="_blank" rel="noopener">Danh sách thiên kiến nhận thức (Wikipedia)</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — tài chính hành vi là gì; người lý trí vs. người thật; Hệ 1/2.</li>
<li><strong>Thiên kiến</strong> — heuristic, tự tin thái quá, sợ lỗ, đóng khung — nhận ra chúng trong chính lựa chọn của bạn.</li>
<li><strong>Thị trường &amp; nudge</strong> — bầy đàn, bong bóng, kiến trúc lựa chọn và mặc định.</li>
<li><strong>Ứng dụng</strong> — dùng có đạo đức trong marketing &amp; truyền thông; biết ranh giới giữa nudge và thao túng.</li>
</ol></div>`,
  ]]);

const intro = doc('ibf201-0-1-overview', 'Course overview: Behavioral Finance|||Tổng quan: Tài chính hành vi',
  'Tài chính hành vi làm gì; người thật ra quyết định thế nào (khác "homo economicus"); lộ trình 8 chương từ hai hệ tư duy → thiên kiến → thị trường → nudge → marketing & đạo đức.',
  [[
    `<span class="eyebrow">IBF201 · Lesson 0.1 · Overview</span>
<h2>Behavioral Finance</h2>
<p class="lead">Classical finance assumes people are <strong>rational</strong>: they weigh all information and maximize expected value. Real people don't. <strong>Behavioral finance</strong> studies how psychology — emotion, mental shortcuts, and systematic biases — shapes the money and risk decisions we actually make.</p>
<h3>Two views of the decision-maker</h3>
<ul>
<li><strong>"Homo economicus"</strong> — the textbook rational agent: consistent, self-interested, unemotional.</li>
<li><strong>The real human</strong> — uses gut feeling, is swayed by how a choice is framed, fears losses more than it enjoys gains, and follows the crowd.</li>
</ul>
<p>The gap between the two is where behavioral finance lives — and it's <em>predictable</em>, not random. That predictability is exactly what marketing and communication professionals need to understand.</p>
<h3>Roadmap</h3>
<p>What behavioral finance is → two systems of thought &amp; heuristics → cognitive biases → prospect theory &amp; emotion → biases in markets → nudge &amp; choice architecture → applications in marketing &amp; communication → better decisions &amp; ethics. Bilingual, with real experiments and a quiz per chapter.</p>`,
    `<span class="eyebrow">IBF201 · Bài 0.1 · Tổng quan</span>
<h2>Tài chính hành vi</h2>
<p class="lead">Tài chính cổ điển giả định con người <strong>lý trí</strong>: cân nhắc mọi thông tin và tối đa hoá giá trị kỳ vọng. Người thật thì không. <strong>Tài chính hành vi</strong> nghiên cứu cách tâm lý — cảm xúc, lối tắt tư duy và các thiên kiến có hệ thống — định hình những quyết định về tiền và rủi ro mà ta thực sự đưa ra.</p>
<h3>Hai hình dung về người ra quyết định</h3>
<ul>
<li><strong>"Homo economicus"</strong> — tác nhân lý trí trong sách: nhất quán, vị lợi, không cảm xúc.</li>
<li><strong>Con người thật</strong> — dùng cảm tính, bị ảnh hưởng bởi cách trình bày lựa chọn, sợ mất mát hơn là thích được lợi, và đi theo đám đông.</li>
</ul>
<p>Khoảng cách giữa hai hình dung đó là nơi tài chính hành vi tồn tại — và nó <em>có thể đoán trước</em>, không ngẫu nhiên. Chính tính đoán trước ấy là điều người làm marketing và truyền thông cần hiểu.</p>
<h3>Lộ trình</h3>
<p>Tài chính hành vi là gì → hai hệ tư duy &amp; heuristic → thiên kiến nhận thức → lý thuyết triển vọng &amp; cảm xúc → thiên kiến trên thị trường → nudge &amp; kiến trúc lựa chọn → ứng dụng trong marketing &amp; truyền thông → ra quyết định tốt hơn &amp; đạo đức. Song ngữ, có thí nghiệm thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ibf201-1-1-what-is', '1.1 — What is behavioral finance?|||1.1 — Tài chính hành vi là gì?',
  'Behavioral finance vs. thị trường hiệu quả & con người lý trí (EMH, expected utility); vì sao quan trọng; bằng chứng thực nghiệm bác bỏ giả định lý trí.',
  [[
    `<span class="eyebrow">IBF201 · Chapter 1 · Lesson 1.1</span>
<h2>What is behavioral finance?</h2>
<h3>The rational baseline</h3>
<p>Traditional finance rests on two pillars: the <strong>Efficient Market Hypothesis (EMH)</strong> — prices reflect all available information — and <strong>expected utility theory</strong> — people choose the option with the highest weighted payoff. Together they describe a market of perfectly rational agents.</p>
<h3>Where it breaks</h3>
<p><strong>Behavioral finance</strong> collects the evidence that this baseline is wrong in systematic ways. People:</p>
<ul>
<li>overreact to recent news and underreact to slow, boring facts;</li>
<li>hold losing investments too long and sell winners too early;</li>
<li>trade too much because they're overconfident.</li>
</ul>
<p>These aren't rare mistakes — they're <em>regular and predictable</em>. That's the key claim: irrationality has structure.</p>
<h3>Why it matters</h3>
<p>For investors, understanding biases means fewer costly errors. For <strong>marketers and communicators</strong>, it's a map of how audiences really process offers, prices and messages — the difference between a campaign that persuades and one that's ignored.</p>
<div class="callout"><span class="badge">Key idea</span> Behavioral finance doesn't say people are stupid — it says they're <strong>predictably</strong> irrational, and prediction is power.</div>`,
    `<span class="eyebrow">IBF201 · Chương 1 · Bài 1.1</span>
<h2>Tài chính hành vi là gì?</h2>
<h3>Nền lý trí</h3>
<p>Tài chính truyền thống dựa trên hai trụ: <strong>Giả thuyết thị trường hiệu quả (EMH)</strong> — giá phản ánh mọi thông tin sẵn có — và <strong>lý thuyết hữu dụng kỳ vọng</strong> — người ta chọn phương án có phần thưởng trọng số cao nhất. Cùng nhau, chúng mô tả một thị trường của những tác nhân lý trí hoàn hảo.</p>
<h3>Chỗ nó vỡ</h3>
<p><strong>Tài chính hành vi</strong> gom bằng chứng cho thấy nền tảng ấy sai một cách có hệ thống. Con người:</p>
<ul>
<li>phản ứng thái quá với tin mới và phản ứng yếu với sự thật chậm, nhàm chán;</li>
<li>giữ khoản lỗ quá lâu và bán khoản lãi quá sớm;</li>
<li>giao dịch quá nhiều vì tự tin thái quá.</li>
</ul>
<p>Đây không phải lỗi hiếm gặp — chúng <em>đều đặn và đoán trước được</em>. Đó là luận điểm cốt lõi: sự phi lý có cấu trúc.</p>
<h3>Vì sao quan trọng</h3>
<p>Với nhà đầu tư, hiểu thiên kiến nghĩa là bớt sai lầm tốn kém. Với <strong>người làm marketing và truyền thông</strong>, đó là bản đồ về cách khán giả thực sự xử lý lời chào, giá và thông điệp — khác biệt giữa một chiến dịch thuyết phục được và một chiến dịch bị phớt lờ.</p>
<div class="callout"><span class="badge">Ý chính</span> Tài chính hành vi không nói người ta ngu — nó nói người ta phi lý một cách <strong>đoán trước được</strong>, và đoán trước là sức mạnh.</div>`,
  ]]);

const c1q = quiz('ibf201-quiz-1', 'Quiz 1 — What is behavioral finance|||Quiz 1 — Tài chính hành vi là gì', [
  { id: 'q1', question: 'Tài chính hành vi khác tài chính cổ điển chủ yếu ở chỗ?', options: ['Giả định con người luôn lý trí', 'Nghiên cứu cách tâm lý & thiên kiến ảnh hưởng quyết định', 'Chỉ dùng cho ngân hàng', 'Bỏ qua cảm xúc'], correctIndex: 1, explanation: 'Tài chính hành vi đưa tâm lý, cảm xúc và thiên kiến vào mô hình ra quyết định.' },
  { id: 'q2', question: 'Giả thuyết thị trường hiệu quả (EMH) cho rằng?', options: ['Giá phản ánh mọi thông tin sẵn có', 'Người ta luôn sợ lỗ', 'Đám đông luôn sai', 'Cảm xúc chi phối giá'], correctIndex: 0, explanation: 'EMH: giá đã phản ánh toàn bộ thông tin, thuộc nền lý trí truyền thống.' },
  { id: 'q3', question: 'Luận điểm cốt lõi của tài chính hành vi là sự phi lý?', options: ['Hoàn toàn ngẫu nhiên', 'Có hệ thống & đoán trước được', 'Chỉ xảy ra ở người thiếu học', 'Không thể đo lường'], correctIndex: 1, explanation: 'Sai lầm có cấu trúc, đều đặn và đoán trước được — nên nghiên cứu được.' },
]);

const c2 = doc('ibf201-2-1-two-systems', '2.1 — Two systems of thought & heuristics|||2.1 — Hai hệ tư duy & heuristics',
  'System 1 (nhanh, tự động) vs System 2 (chậm, nỗ lực) của Kahneman; heuristics: availability, representativeness, anchoring — kèm thí nghiệm gốc.',
  [[
    `<span class="eyebrow">IBF201 · Chapter 2 · Lesson 2.1</span>
<h2>Two systems of thought &amp; heuristics</h2>
<h3>System 1 and System 2</h3>
<p>Kahneman describes two modes of thinking:</p>
<ul>
<li><strong>System 1</strong> — fast, automatic, effortless, emotional. It answers "2 + 2" and reads faces. It also jumps to conclusions.</li>
<li><strong>System 2</strong> — slow, deliberate, effortful, logical. It does "17 × 24" and checks arguments. It's lazy and easily tired.</li>
</ul>
<p>Most everyday decisions run on System 1. Biases creep in when System 1 answers a hard question with a quick shortcut and System 2 doesn't bother to check.</p>
<h3>Three classic heuristics</h3>
<ul>
<li><strong>Availability</strong> — judge how likely something is by how easily examples come to mind. After seeing plane-crash news, people overestimate flight risk.</li>
<li><strong>Representativeness</strong> — judge by how much something fits a stereotype, ignoring base rates. (Kahneman &amp; Tversky's "Linda the bank teller" problem: people rank "Linda is a bank teller and a feminist" as <em>more</em> likely than "Linda is a bank teller" — logically impossible.)</li>
<li><strong>Anchoring</strong> — the first number you see drags your estimate toward it. Spinning a wheel to a random number changed people's guesses of how many African countries are in the UN.</li>
</ul>
<div class="callout"><span class="badge">Experiment</span> In the anchoring study, a rigged wheel landing on 10 vs. 65 shifted median estimates from 25% to 45% — a meaningless number moved a factual judgment.</div>`,
    `<span class="eyebrow">IBF201 · Chương 2 · Bài 2.1</span>
<h2>Hai hệ tư duy &amp; heuristics</h2>
<h3>Hệ 1 và Hệ 2</h3>
<p>Kahneman mô tả hai chế độ tư duy:</p>
<ul>
<li><strong>Hệ 1</strong> — nhanh, tự động, không tốn sức, cảm xúc. Nó trả lời "2 + 2" và đọc nét mặt. Nó cũng vội vàng kết luận.</li>
<li><strong>Hệ 2</strong> — chậm, có chủ ý, tốn sức, logic. Nó tính "17 × 24" và kiểm tra lập luận. Nó lười và dễ mệt.</li>
</ul>
<p>Phần lớn quyết định hằng ngày chạy bằng Hệ 1. Thiên kiến len vào khi Hệ 1 trả lời một câu khó bằng lối tắt nhanh mà Hệ 2 không buồn kiểm tra.</p>
<h3>Ba heuristic kinh điển</h3>
<ul>
<li><strong>Sẵn có (availability)</strong> — đoán xác suất theo mức độ dễ nhớ ra ví dụ. Sau khi xem tin rơi máy bay, người ta phóng đại rủi ro bay.</li>
<li><strong>Đại diện (representativeness)</strong> — đoán theo mức khớp với khuôn mẫu, bỏ qua tỉ lệ nền. (Bài "Linda nhân viên ngân hàng" của Kahneman &amp; Tversky: người ta xếp "Linda là nhân viên ngân hàng VÀ nhà nữ quyền" <em>khả dĩ hơn</em> "Linda là nhân viên ngân hàng" — điều bất khả về logic.)</li>
<li><strong>Neo (anchoring)</strong> — con số đầu tiên bạn thấy kéo ước lượng về phía nó. Quay bánh xe ra số ngẫu nhiên làm đổi cả ước đoán về số nước châu Phi trong Liên Hợp Quốc.</li>
</ul>
<div class="callout"><span class="badge">Thí nghiệm</span> Trong nghiên cứu neo, bánh xe gian lận dừng ở 10 so với 65 làm ước lượng trung vị đổi từ 25% lên 45% — một con số vô nghĩa dịch chuyển cả một phán đoán sự thật.</div>`,
  ]]);

const c2q = quiz('ibf201-quiz-2', 'Quiz 2 — Two systems & heuristics|||Quiz 2 — Hai hệ & heuristics', [
  { id: 'q1', question: 'Theo Kahneman, Hệ 1 (System 1) là kiểu tư duy?', options: ['Chậm, tốn sức, logic', 'Nhanh, tự động, cảm xúc', 'Chỉ dùng khi tính toán', 'Không tồn tại thật'], correctIndex: 1, explanation: 'Hệ 1 nhanh, tự động, cảm tính; Hệ 2 chậm, nỗ lực, logic.' },
  { id: 'q2', question: 'Đánh giá xác suất theo mức dễ nhớ ra ví dụ là heuristic?', options: ['Neo (anchoring)', 'Sẵn có (availability)', 'Đại diện (representativeness)', 'Khung (framing)'], correctIndex: 1, explanation: 'Availability: cái gì dễ gọi ra khỏi trí nhớ thì bị cho là dễ xảy ra hơn.' },
  { id: 'q3', question: 'Con số đầu tiên nhìn thấy kéo ước lượng về phía nó — đó là?', options: ['Anchoring (neo)', 'Availability', 'Representativeness', 'Mental accounting'], correctIndex: 0, explanation: 'Anchoring: một số khởi điểm, kể cả vô nghĩa, ảnh hưởng ước lượng sau đó.' },
]);

const c3 = doc('ibf201-3-1-cognitive-biases', '3.1 — Cognitive biases|||3.1 — Thiên kiến nhận thức',
  'Overconfidence, confirmation bias, hindsight bias, mental accounting — bốn thiên kiến định hình quyết định tiền bạc và cách đọc thông tin.',
  [[
    `<span class="eyebrow">IBF201 · Chapter 3 · Lesson 3.1</span>
<h2>Cognitive biases</h2>
<p>Heuristics harden into recurring <strong>biases</strong> — systematic errors that push us the same wrong way again and again.</p>
<ul>
<li><strong>Overconfidence</strong> — we overrate our knowledge and control. Most drivers rate themselves "above average"; investors who trade the most earn the least (Barber &amp; Odean's study of thousands of brokerage accounts).</li>
<li><strong>Confirmation bias</strong> — we seek and remember evidence that supports what we already believe, and dismiss the rest. It quietly filters what news we click.</li>
<li><strong>Hindsight bias</strong> — after something happens, we feel we "knew it all along". It makes markets look more predictable in the rear-view mirror than they ever were live.</li>
<li><strong>Mental accounting</strong> — we mentally sort money into separate "buckets" (salary vs. bonus vs. tax refund) and treat identical dollars differently, even though money is fungible.</li>
</ul>
<pre><code>Mental accounting in one line:
  Found $20 -> "fun money", spend it freely
  Earned $20 -> "hard-won", spend it carefully
  ...but it's the SAME $20.</code></pre>
<div class="callout"><span class="badge">Why marketers care</span> Framing a purchase as coming from a "bonus" or "gift card" bucket loosens the wallet — mental accounting is a lever, and an ethical line to watch.</div>`,
    `<span class="eyebrow">IBF201 · Chương 3 · Bài 3.1</span>
<h2>Thiên kiến nhận thức</h2>
<p>Heuristic đông cứng lại thành các <strong>thiên kiến</strong> lặp đi lặp lại — những sai lệch có hệ thống đẩy ta cùng một hướng sai hết lần này đến lần khác.</p>
<ul>
<li><strong>Tự tin thái quá (overconfidence)</strong> — ta đánh giá quá cao hiểu biết và khả năng kiểm soát của mình. Đa số tài xế tự xếp mình "trên trung bình"; nhà đầu tư giao dịch nhiều nhất lại lời ít nhất (nghiên cứu của Barber &amp; Odean trên hàng nghìn tài khoản môi giới).</li>
<li><strong>Thiên kiến xác nhận (confirmation bias)</strong> — ta tìm và nhớ bằng chứng ủng hộ điều mình đã tin, gạt bỏ phần còn lại. Nó âm thầm lọc tin ta bấm vào.</li>
<li><strong>Thiên kiến nhận thức muộn (hindsight bias)</strong> — sau khi việc xảy ra, ta thấy như "biết trước rồi". Nó làm thị trường trông dễ đoán hơn qua gương chiếu hậu so với lúc đang diễn ra.</li>
<li><strong>Kế toán tâm lý (mental accounting)</strong> — ta phân tiền vào các "ngăn" riêng (lương vs. thưởng vs. hoàn thuế) và đối xử với những đồng như nhau theo cách khác nhau, dù tiền là thứ có thể thay thế.</li>
</ul>
<pre><code>Kế toán tâm lý gói trong một dòng:
  Nhặt được 20$ -> "tiền vui", tiêu thoải mái
  Kiếm được 20$ -> "đổ mồ hôi", tiêu dè sẻn
  ...nhưng vẫn là CÙNG 20$.</code></pre>
<div class="callout"><span class="badge">Vì sao marketer quan tâm</span> Đóng khung một khoản mua như đến từ ngăn "tiền thưởng" hay "thẻ quà" làm ví lỏng ra — kế toán tâm lý là một đòn bẩy, và cũng là lằn ranh đạo đức cần để ý.</div>`,
  ]]);

const c3q = quiz('ibf201-quiz-3', 'Quiz 3 — Cognitive biases|||Quiz 3 — Thiên kiến nhận thức', [
  { id: 'q1', question: 'Nhà đầu tư giao dịch nhiều nhất thường lời ít nhất phản ánh thiên kiến?', options: ['Confirmation bias', 'Overconfidence (tự tin thái quá)', 'Hindsight bias', 'Anchoring'], correctIndex: 1, explanation: 'Tự tin thái quá dẫn tới giao dịch quá mức và hiệu suất kém (Barber & Odean).' },
  { id: 'q2', question: 'Chỉ tìm và nhớ bằng chứng ủng hộ điều mình đã tin là?', options: ['Thiên kiến xác nhận (confirmation bias)', 'Kế toán tâm lý', 'Neo', 'Sợ lỗ'], correctIndex: 0, explanation: 'Confirmation bias: lọc thông tin theo niềm tin sẵn có.' },
  { id: 'q3', question: 'Đối xử với "tiền thưởng" khác "tiền lương" dù giá trị như nhau là?', options: ['Hindsight bias', 'Kế toán tâm lý (mental accounting)', 'Overconfidence', 'Representativeness'], correctIndex: 1, explanation: 'Mental accounting: phân tiền vào các ngăn và tiêu khác nhau dù tiền thay thế được.' },
]);

const c4 = doc('ibf201-4-1-prospect-theory', '4.1 — Prospect theory & emotion|||4.1 — Lý thuyết triển vọng & cảm xúc',
  'Prospect theory (Kahneman & Tversky), loss aversion (~2x), framing, điểm tham chiếu; cảm xúc trong quyết định — sợ hãi & tham lam.',
  [[
    `<span class="eyebrow">IBF201 · Chapter 4 · Lesson 4.1</span>
<h2>Prospect theory &amp; emotion</h2>
<h3>Prospect theory</h3>
<p>Kahneman &amp; Tversky's <strong>prospect theory</strong> (which won the Nobel) replaced expected utility with how people <em>actually</em> value gains and losses:</p>
<ul>
<li>We judge outcomes as <strong>gains or losses from a reference point</strong>, not as final wealth.</li>
<li><strong>Loss aversion</strong> — losing $100 hurts about <em>twice</em> as much as gaining $100 feels good.</li>
<li>We're <strong>risk-averse for gains</strong> but <strong>risk-seeking for losses</strong> — we take a gamble to avoid a sure loss.</li>
</ul>
<h3>Framing</h3>
<p>Because value depends on the reference point, <em>how you frame the same fact changes the choice.</em> The classic "Asian disease" experiment: a program described as "saves 200 of 600" is chosen far more than the identical "400 will die" — same numbers, opposite framing, opposite decision.</p>
<h3>Emotion drives the reference point</h3>
<p><strong>Fear and greed</strong> move the whole market. Fear makes losses loom larger (panic selling); greed narrows attention to the upside (buying a bubble). Emotion isn't noise on top of decisions — it sets the frame the decision is made in.</p>
<div class="callout"><span class="badge">2× rule</span> Loss aversion (~2:1) explains why "Don't miss out — offer ends tonight" beats "Save 10%": avoiding a loss motivates more than an equal gain.</div>`,
    `<span class="eyebrow">IBF201 · Chương 4 · Bài 4.1</span>
<h2>Lý thuyết triển vọng &amp; cảm xúc</h2>
<h3>Lý thuyết triển vọng</h3>
<p><strong>Lý thuyết triển vọng</strong> (đoạt Nobel) của Kahneman &amp; Tversky thay lý thuyết hữu dụng kỳ vọng bằng cách con người <em>thực sự</em> định giá được và mất:</p>
<ul>
<li>Ta đánh giá kết quả là <strong>được hay mất so với một điểm tham chiếu</strong>, không phải theo tổng tài sản cuối.</li>
<li><strong>Sợ lỗ (loss aversion)</strong> — mất 100$ đau gấp khoảng <em>hai lần</em> niềm vui khi được 100$.</li>
<li>Ta <strong>ngại rủi ro khi đang lời</strong> nhưng <strong>tìm rủi ro khi đang lỗ</strong> — chấp nhận đánh bạc để né một khoản lỗ chắc chắn.</li>
</ul>
<h3>Đóng khung (framing)</h3>
<p>Vì giá trị phụ thuộc điểm tham chiếu, <em>cách bạn đóng khung cùng một sự thật sẽ đổi lựa chọn.</em> Thí nghiệm kinh điển "dịch bệnh châu Á": phương án mô tả là "cứu được 200 trong 600" được chọn nhiều hơn hẳn phương án y hệt "400 sẽ chết" — cùng con số, khung ngược, quyết định ngược.</p>
<h3>Cảm xúc định điểm tham chiếu</h3>
<p><strong>Sợ hãi và tham lam</strong> làm chuyển động cả thị trường. Sợ hãi khiến khoản lỗ trông to hơn (bán tháo hoảng loạn); tham lam thu hẹp chú ý vào mặt lợi (mua vào bong bóng). Cảm xúc không phải nhiễu phủ lên quyết định — nó định ra cái khung mà quyết định được đưa ra trong đó.</p>
<div class="callout"><span class="badge">Quy tắc 2×</span> Sợ lỗ (~2:1) giải thích vì sao "Đừng bỏ lỡ — ưu đãi hết hạn tối nay" mạnh hơn "Tiết kiệm 10%": né một khoản mất thúc đẩy hơn một khoản được tương đương.</div>`,
  ]]);

const c4q = quiz('ibf201-quiz-4', 'Quiz 4 — Prospect theory & emotion|||Quiz 4 — Triển vọng & cảm xúc', [
  { id: 'q1', question: 'Loss aversion (sợ lỗ) nói rằng?', options: ['Được và mất tác động như nhau', 'Mất đau gấp khoảng 2 lần niềm vui khi được tương đương', 'Người ta luôn tránh rủi ro', 'Cảm xúc không ảnh hưởng'], correctIndex: 1, explanation: 'Nỗi đau mất ~ gấp đôi niềm vui được cùng độ lớn — cốt lõi lý thuyết triển vọng.' },
  { id: 'q2', question: 'Thí nghiệm "dịch bệnh châu Á" cho thấy?', options: ['Con số quyết định tất cả', 'Cách đóng khung (framing) đổi cả lựa chọn dù số liệu như nhau', 'Người ta luôn chọn xác suất cao', 'Không ai sợ chết'], correctIndex: 1, explanation: '"Cứu 200" vs "400 chết" là cùng dữ liệu, khác khung → quyết định ngược nhau.' },
  { id: 'q3', question: 'Theo lý thuyết triển vọng, khi ĐANG LỖ người ta có xu hướng?', options: ['Ngại rủi ro hơn', 'Tìm rủi ro để né khoản lỗ chắc chắn', 'Bán ngay lập tức', 'Không làm gì'], correctIndex: 1, explanation: 'Risk-seeking khi lỗ: đánh bạc để tránh thua chắc; risk-averse khi lời.' },
]);

const c5 = doc('ibf201-5-1-market-biases', '5.1 — Biases in markets|||5.1 — Thiên kiến trên thị trường',
  'Herding (bầy đàn), bong bóng & sụp đổ, momentum, disposition effect (giữ lỗ bán lãi) — thiên kiến cá nhân cộng dồn thành hiện tượng thị trường.',
  [[
    `<span class="eyebrow">IBF201 · Chapter 5 · Lesson 5.1</span>
<h2>Biases in markets</h2>
<p>Individual biases don't stay individual. When millions act on the same shortcut, they move whole markets.</p>
<ul>
<li><strong>Herding</strong> — copying the crowd instead of your own analysis ("everyone's buying, it must be right"). Safe socially, dangerous financially.</li>
<li><strong>Bubbles &amp; crashes</strong> — herding plus greed inflates prices far past value (Dutch <em>tulip mania</em> 1637, dot-com 2000, crypto cycles); when confidence cracks, fear reverses it into a crash.</li>
<li><strong>Momentum</strong> — rising prices attract buyers <em>because</em> they're rising, briefly self-reinforcing the trend beyond fundamentals.</li>
<li><strong>Disposition effect</strong> — investors sell winners too early (to "lock in" a gain) and hold losers too long (to avoid realizing a loss) — loss aversion in action, and usually the wrong move.</li>
</ul>
<pre><code>Bubble life-cycle:
  Story -> Herding -> Greed -> Price >> Value
        -> Doubt -> Fear -> Panic selling -> Crash</code></pre>
<div class="callout"><span class="badge">Communication angle</span> Bubbles are stories that spread. Understanding herding and social proof explains both how manias grow and how a message goes viral.</div>`,
    `<span class="eyebrow">IBF201 · Chương 5 · Bài 5.1</span>
<h2>Thiên kiến trên thị trường</h2>
<p>Thiên kiến cá nhân không ở yên mức cá nhân. Khi hàng triệu người hành động theo cùng một lối tắt, chúng làm chuyển động cả thị trường.</p>
<ul>
<li><strong>Bầy đàn (herding)</strong> — bắt chước đám đông thay vì phân tích của mình ("ai cũng mua, chắc đúng"). An toàn về mặt xã hội, nguy hiểm về mặt tài chính.</li>
<li><strong>Bong bóng &amp; sụp đổ</strong> — bầy đàn cộng tham lam thổi giá vượt xa giá trị (cơn sốt <em>hoa tulip</em> Hà Lan 1637, dot-com 2000, các chu kỳ crypto); khi niềm tin rạn, sợ hãi đảo ngược thành sụp đổ.</li>
<li><strong>Momentum</strong> — giá tăng thu hút người mua <em>chính vì</em> nó đang tăng, tự củng cố xu hướng trong ngắn hạn vượt khỏi nền tảng.</li>
<li><strong>Hiệu ứng ngược vị thế (disposition effect)</strong> — nhà đầu tư bán khoản lãi quá sớm (để "chốt lời") và giữ khoản lỗ quá lâu (để né việc phải nhận lỗ) — sợ lỗ trong thực tế, và thường là nước đi sai.</li>
</ul>
<pre><code>Vòng đời bong bóng:
  Câu chuyện -> Bầy đàn -> Tham lam -> Giá >> Giá trị
             -> Nghi ngờ -> Sợ hãi -> Bán tháo -> Sụp đổ</code></pre>
<div class="callout"><span class="badge">Góc truyền thông</span> Bong bóng là những câu chuyện lan truyền. Hiểu bầy đàn và bằng chứng xã hội giải thích cả cách cơn sốt lớn lên lẫn cách một thông điệp bùng nổ.</div>`,
  ]]);

const c5q = quiz('ibf201-quiz-5', 'Quiz 5 — Biases in markets|||Quiz 5 — Thiên kiến thị trường', [
  { id: 'q1', question: 'Bắt chước đám đông thay vì phân tích riêng gọi là?', options: ['Momentum', 'Herding (bầy đàn)', 'Anchoring', 'Framing'], correctIndex: 1, explanation: 'Herding: theo đám đông; góp phần tạo bong bóng và sụp đổ.' },
  { id: 'q2', question: 'Bán khoản lãi quá sớm và giữ khoản lỗ quá lâu là?', options: ['Disposition effect', 'Overconfidence', 'Confirmation bias', 'Availability'], correctIndex: 0, explanation: 'Disposition effect bắt nguồn từ sợ lỗ — ngại nhận khoản lỗ.' },
  { id: 'q3', question: 'Cơn sốt hoa tulip Hà Lan 1637 là ví dụ điển hình của?', options: ['Kế toán tâm lý', 'Bong bóng do bầy đàn & tham lam', 'Thị trường hiệu quả', 'Anchoring'], correctIndex: 1, explanation: 'Giá bị thổi vượt xa giá trị rồi sụp — mẫu hình bong bóng cổ điển.' },
]);

const c6 = doc('ibf201-6-1-nudge', '6.1 — Nudge & choice architecture|||6.1 — Nudge & kiến trúc lựa chọn',
  'Nudge (Thaler & Sunstein), choice architecture, sức mạnh của default, libertarian paternalism; ứng dụng chính sách (hiến tạng, tiết kiệm hưu).',
  [[
    `<span class="eyebrow">IBF201 · Chapter 6 · Lesson 6.1</span>
<h2>Nudge &amp; choice architecture</h2>
<h3>The nudge</h3>
<p>If people predictably use shortcuts, you can design the environment to steer them <em>without</em> removing choice. Thaler &amp; Sunstein call this a <strong>nudge</strong>, and the designer a <strong>choice architect</strong> — every menu, form and default is a design decision that shapes behavior.</p>
<h3>The power of the default</h3>
<p>The single strongest nudge is the <strong>default option</strong> — what happens if you do nothing. Because System 2 is lazy, most people stick with it.</p>
<ul>
<li><strong>Organ donation</strong> — opt-out countries (you're a donor unless you decline) have donor rates above 90%; opt-in countries often sit below 20%. Same people, different default.</li>
<li><strong>Retirement saving</strong> — auto-enrolling employees into a pension (with the option to leave) dramatically raises participation.</li>
</ul>
<h3>Libertarian paternalism</h3>
<p>Thaler &amp; Sunstein call good nudging <strong>"libertarian paternalism"</strong>: guide people toward better outcomes (paternalism) while leaving them fully free to choose otherwise (libertarian). A cafeteria putting fruit at eye level nudges; banning dessert does not.</p>
<div class="callout"><span class="badge">Test of a nudge</span> A true nudge is easy and cheap to avoid. If opting out is hard or hidden, it's no longer a nudge — it's coercion.</div>`,
    `<span class="eyebrow">IBF201 · Chương 6 · Bài 6.1</span>
<h2>Nudge &amp; kiến trúc lựa chọn</h2>
<h3>Cú hích (nudge)</h3>
<p>Nếu người ta dùng lối tắt một cách đoán trước được, ta có thể thiết kế môi trường để dẫn dắt họ <em>mà không</em> bỏ đi lựa chọn. Thaler &amp; Sunstein gọi đó là <strong>nudge (cú hích)</strong>, và người thiết kế là <strong>kiến trúc sư lựa chọn</strong> — mọi thực đơn, biểu mẫu và mặc định đều là một quyết định thiết kế định hình hành vi.</p>
<h3>Sức mạnh của mặc định</h3>
<p>Cú hích mạnh nhất là <strong>lựa chọn mặc định</strong> — điều xảy ra nếu bạn không làm gì. Vì Hệ 2 lười, đa số người ta giữ nguyên nó.</p>
<ul>
<li><strong>Hiến tạng</strong> — nước theo cơ chế opt-out (mặc định là người hiến trừ khi bạn từ chối) có tỉ lệ hiến trên 90%; nước opt-in thường dưới 20%. Cùng con người, khác mặc định.</li>
<li><strong>Tiết kiệm hưu trí</strong> — tự động ghi danh nhân viên vào quỹ hưu (kèm quyền rút ra) làm tăng mạnh mức tham gia.</li>
</ul>
<h3>Gia trưởng tự do</h3>
<p>Thaler &amp; Sunstein gọi việc nudge tốt là <strong>"gia trưởng tự do" (libertarian paternalism)</strong>: dẫn người ta tới kết quả tốt hơn (gia trưởng) trong khi vẫn để họ hoàn toàn tự do chọn khác (tự do). Căng-tin đặt trái cây ngang tầm mắt là nudge; cấm món tráng miệng thì không.</p>
<div class="callout"><span class="badge">Phép thử một nudge</span> Nudge thật thì dễ và rẻ để né. Nếu việc từ chối khó hay bị giấu, nó không còn là nudge — mà là ép buộc.</div>`,
  ]]);

const c6q = quiz('ibf201-quiz-6', 'Quiz 6 — Nudge & choice architecture|||Quiz 6 — Nudge & kiến trúc lựa chọn', [
  { id: 'q1', question: 'Cú hích (nudge) mạnh nhất thường là?', options: ['Cấm lựa chọn xấu', 'Lựa chọn mặc định (default)', 'Phạt tiền', 'Quảng cáo lặp lại'], correctIndex: 1, explanation: 'Vì Hệ 2 lười, đa số giữ nguyên mặc định — nên default là đòn bẩy mạnh nhất.' },
  { id: 'q2', question: 'Nước theo cơ chế opt-out hiến tạng có tỉ lệ hiến?', options: ['Thấp hơn opt-in', 'Cao hơn hẳn (>90%)', 'Bằng nhau', 'Bằng 0'], correctIndex: 1, explanation: 'Mặc định là "người hiến" → tỉ lệ vượt 90%; cùng con người, khác default.' },
  { id: 'q3', question: 'Một nudge THẬT (theo Thaler & Sunstein) phải?', options: ['Bắt buộc, không thể tránh', 'Dễ và rẻ để từ chối', 'Giấu lối thoát', 'Loại bỏ mọi lựa chọn khác'], correctIndex: 1, explanation: 'Nudge giữ tự do lựa chọn; nếu từ chối khó/giấu thì là ép buộc.' },
]);

const c7 = doc('ibf201-7-1-marketing', '7.1 — Applications in marketing & communication|||7.1 — Ứng dụng trong marketing & truyền thông',
  'Định giá tâm lý (charm/anchor/decoy), khan hiếm, bằng chứng xã hội, mặc định, thiết kế thông điệp — hành vi học áp vào marketing & truyền thông.',
  [[
    `<span class="eyebrow">IBF201 · Chapter 7 · Lesson 7.1</span>
<h2>Applications in marketing &amp; communication</h2>
<p>Everything so far becomes a practical toolkit for anyone who designs offers and messages.</p>
<ul>
<li><strong>Psychological pricing</strong> — $9.99 reads as "9-something" (left-digit effect); a high "anchor" price makes the real one feel cheap; a <strong>decoy</strong> option (Ariely's <em>Economist</em> subscription study) steers people to the target plan by adding a deliberately worse third option.</li>
<li><strong>Scarcity</strong> — "only 3 left", "ends tonight" trigger loss aversion and the fear of missing out.</li>
<li><strong>Social proof</strong> — "12,000 people bought this" harnesses herding; reviews and follower counts are social proof at scale.</li>
<li><strong>Defaults</strong> — pre-ticked add-ons, "recommended" plans and auto-renew are choice architecture applied to a checkout.</li>
<li><strong>Message framing</strong> — "90% fat-free" beats "10% fat"; "join 2M members" (gain) vs. "don't miss out" (loss) — pick the frame that fits loss aversion.</li>
</ul>
<div class="callout"><span class="badge">The decoy effect</span> Ariely found: Economist offered web-only $59, print-only $125, print+web $125. Almost nobody wants print-only — but its presence makes print+web look like a steal, and sales of the top tier jump.</div>`,
    `<span class="eyebrow">IBF201 · Chương 7 · Bài 7.1</span>
<h2>Ứng dụng trong marketing &amp; truyền thông</h2>
<p>Mọi thứ tới giờ trở thành bộ công cụ thực dụng cho bất kỳ ai thiết kế lời chào và thông điệp.</p>
<ul>
<li><strong>Định giá tâm lý</strong> — 9,99$ đọc thành "9 mấy" (hiệu ứng chữ số bên trái); một "neo" giá cao làm giá thật thấy rẻ; một lựa chọn <strong>mồi (decoy)</strong> (nghiên cứu gói <em>Economist</em> của Ariely) dẫn người ta về gói mục tiêu bằng cách thêm một phương án thứ ba cố tình kém hơn.</li>
<li><strong>Khan hiếm</strong> — "chỉ còn 3", "hết hạn tối nay" kích hoạt sợ lỗ và nỗi sợ bỏ lỡ.</li>
<li><strong>Bằng chứng xã hội</strong> — "12.000 người đã mua" tận dụng bầy đàn; đánh giá và số người theo dõi là bằng chứng xã hội ở quy mô lớn.</li>
<li><strong>Mặc định</strong> — tiện ích tích sẵn, gói "được đề xuất" và tự động gia hạn là kiến trúc lựa chọn áp vào trang thanh toán.</li>
<li><strong>Đóng khung thông điệp</strong> — "90% không béo" mạnh hơn "10% béo"; "gia nhập 2 triệu thành viên" (được) vs. "đừng bỏ lỡ" (mất) — chọn khung khớp với sợ lỗ.</li>
</ul>
<div class="callout"><span class="badge">Hiệu ứng mồi</span> Ariely tìm thấy: Economist chào web 59$, chỉ in 125$, in+web 125$. Gần như không ai muốn gói chỉ in — nhưng sự hiện diện của nó làm gói in+web trông hời, và doanh số gói cao nhất vọt lên.</div>`,
  ]]);

const c7q = quiz('ibf201-quiz-7', 'Quiz 7 — Marketing & communication|||Quiz 7 — Marketing & truyền thông', [
  { id: 'q1', question: 'Thêm một lựa chọn cố tình kém hơn để đẩy người ta về gói mục tiêu là?', options: ['Bằng chứng xã hội', 'Hiệu ứng mồi (decoy effect)', 'Khan hiếm', 'Neo giá'], correctIndex: 1, explanation: 'Decoy effect (Ariely, Economist): phương án mồi làm gói mục tiêu trông hời hơn.' },
  { id: 'q2', question: '"Chỉ còn 3 sản phẩm — hết hạn tối nay" khai thác chủ yếu?', options: ['Sự lười của Hệ 2', 'Khan hiếm & sợ lỗ (FOMO)', 'Kế toán tâm lý', 'Hindsight bias'], correctIndex: 1, explanation: 'Khan hiếm + sợ lỗ kích hoạt nỗi sợ bỏ lỡ, thúc đẩy hành động ngay.' },
  { id: 'q3', question: '"90% không béo" hiệu quả hơn "10% béo" nhờ?', options: ['Đóng khung (framing) tích cực', 'Số liệu khác nhau', 'Bằng chứng xã hội', 'Momentum'], correctIndex: 0, explanation: 'Cùng dữ liệu, khung tích cực dễ được chấp nhận hơn — hiệu ứng framing.' },
]);

const c8 = doc('ibf201-8-1-better-decisions', '8.1 — Better decisions & ethics|||8.1 — Ra quyết định tốt hơn & đạo đức',
  'Debiasing (checklist, ý kiến ngoài, precommitment), ranh giới nudge vs. manipulation & dark patterns, đạo đức của kiến trúc lựa chọn.',
  [[
    `<span class="eyebrow">IBF201 · Chapter 8 · Lesson 8.1</span>
<h2>Better decisions &amp; ethics</h2>
<h3>Debiasing — helping System 2 win</h3>
<p>You can't delete biases, but you can build habits that catch them:</p>
<ul>
<li><strong>Checklists &amp; rules</strong> — pre-commit to criteria before emotion arrives (e.g. an investing rule, a cooling-off period).</li>
<li><strong>The outside view</strong> — ask "how did similar cases turn out?" instead of trusting your own story (fights overconfidence and the planning fallacy).</li>
<li><strong>Consider the opposite</strong> — actively argue the other side to counter confirmation bias.</li>
<li><strong>Precommitment</strong> — remove the tempting option in advance (auto-transfer to savings on payday).</li>
</ul>
<h3>Where nudge becomes manipulation</h3>
<p>The same knowledge that helps people can exploit them. A <strong>nudge</strong> steers toward the chooser's <em>own</em> benefit and is easy to refuse. A <strong>"dark pattern"</strong> steers toward the <em>designer's</em> benefit and hides the exit — a pre-ticked insurance box, a subscription that's one click to start and ten to cancel, a fake "only 1 left" timer.</p>
<pre><code>Nudge  vs  Dark pattern
 Helps the chooser   |  Helps the seller
 Transparent         |  Hidden / deceptive
 Easy to opt out     |  Hard to escape</code></pre>
<div class="callout"><span class="badge">Ethical line</span> Ask: whose interest does this design serve, and could I defend it to the person I'm nudging? If opting out is buried, you've crossed from persuasion into manipulation.</div>`,
    `<span class="eyebrow">IBF201 · Chương 8 · Bài 8.1</span>
<h2>Ra quyết định tốt hơn &amp; đạo đức</h2>
<h3>Gỡ thiên kiến (debiasing) — giúp Hệ 2 thắng</h3>
<p>Bạn không xoá được thiên kiến, nhưng có thể xây thói quen để bắt chúng:</p>
<ul>
<li><strong>Checklist &amp; quy tắc</strong> — cam kết trước tiêu chí trước khi cảm xúc ập tới (vd một quy tắc đầu tư, một khoảng thời gian "hạ nhiệt").</li>
<li><strong>Góc nhìn từ ngoài</strong> — hỏi "các trường hợp tương tự kết thúc thế nào?" thay vì tin câu chuyện của riêng mình (chống tự tin thái quá và ảo tưởng kế hoạch).</li>
<li><strong>Cân nhắc điều ngược lại</strong> — chủ động lập luận cho phía kia để đối chọi thiên kiến xác nhận.</li>
<li><strong>Cam kết trước (precommitment)</strong> — bỏ đi lựa chọn cám dỗ từ trước (tự động chuyển tiền vào tiết kiệm ngày nhận lương).</li>
</ul>
<h3>Khi nudge biến thành thao túng</h3>
<p>Chính hiểu biết giúp con người cũng có thể trục lợi họ. Một <strong>nudge</strong> dẫn tới lợi ích của <em>chính người chọn</em> và dễ từ chối. Một <strong>"dark pattern" (mẫu thiết kế đen)</strong> dẫn tới lợi ích của <em>người thiết kế</em> và giấu lối thoát — ô bảo hiểm tích sẵn, gói đăng ký một cú nhấp để bắt đầu và mười cú để huỷ, đồng hồ giả "chỉ còn 1".</p>
<pre><code>Nudge   vs   Dark pattern
 Lợi cho người chọn  |  Lợi cho người bán
 Minh bạch           |  Giấu giếm / đánh lừa
 Dễ từ chối          |  Khó thoát ra</code></pre>
<div class="callout"><span class="badge">Lằn ranh đạo đức</span> Hãy hỏi: thiết kế này phục vụ lợi ích của ai, và tôi có dám bảo vệ nó trước chính người mình đang nudge không? Nếu lối từ chối bị chôn giấu, bạn đã bước từ thuyết phục sang thao túng.</div>`,
  ]]);

const c8q = quiz('ibf201-quiz-8', 'Quiz 8 — Better decisions & ethics|||Quiz 8 — Quyết định tốt hơn & đạo đức', [
  { id: 'q1', question: 'Hỏi "các trường hợp tương tự kết thúc thế nào?" là kỹ thuật debiasing?', options: ['Góc nhìn từ ngoài (outside view)', 'Neo giá', 'Bằng chứng xã hội', 'Kế toán tâm lý'], correctIndex: 0, explanation: 'Outside view dùng tỉ lệ nền của các ca tương tự, chống tự tin thái quá.' },
  { id: 'q2', question: 'Điểm khác biệt cốt lõi giữa nudge và "dark pattern"?', options: ['Nudge đắt hơn', 'Nudge phục vụ người chọn & dễ từ chối; dark pattern phục vụ người bán & giấu lối thoát', 'Không có khác biệt', 'Dark pattern luôn hợp pháp hơn'], correctIndex: 1, explanation: 'Ranh giới đạo đức: lợi ích phục vụ ai và việc từ chối có dễ không.' },
  { id: 'q3', question: 'Tự động chuyển tiền vào tiết kiệm ngày nhận lương là ví dụ của?', options: ['Precommitment (cam kết trước)', 'Confirmation bias', 'Herding', 'Framing'], correctIndex: 0, explanation: 'Precommitment: loại bỏ trước cám dỗ để Hệ 2 không phải chống cự lúc yếu lòng.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'IBF201',
    slug: 'ibf201-introduction-to-behavioral-finance',
    title: 'Introduction to Behavioral Finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IBF201.webp',
    shortDescription: 'How real people decide about money & risk — System 1/2, heuristics, biases, prospect theory & loss aversion, market herding & bubbles, nudge & choice architecture, ethical use in marketing. Bilingual, real experiments & quizzes.|||Người thật quyết định về tiền & rủi ro thế nào — Hệ 1/2, heuristic, thiên kiến, triển vọng & sợ lỗ, bầy đàn & bong bóng, nudge & kiến trúc lựa chọn, dùng có đạo đức trong marketing. Song ngữ, thí nghiệm thật & quiz.',
    description: 'Môn <strong>IBF201 — Introduction to Behavioral Finance</strong> (Nhập môn Tài chính hành vi, kỳ 4, khối Công nghệ Truyền thông) nhìn vào <strong>cách con người thật ra quyết định</strong> về tiền, rủi ro và phần thưởng — khác hẳn "tác nhân lý trí" trong sách. Từ <strong>hai hệ tư duy &amp; heuristic</strong> (Kahneman) → <strong>thiên kiến nhận thức</strong> (tự tin thái quá, xác nhận, kế toán tâm lý) → <strong>lý thuyết triển vọng &amp; cảm xúc</strong> (sợ lỗ, đóng khung) → <strong>thiên kiến trên thị trường</strong> (bầy đàn, bong bóng) → <strong>nudge &amp; kiến trúc lựa chọn</strong> (Thaler &amp; Sunstein) → <strong>ứng dụng trong marketing &amp; truyền thông</strong> → <strong>ra quyết định tốt hơn &amp; đạo đức</strong>. Song ngữ, đầy thí nghiệm thật, quiz mỗi chương.',
    whatYouLearn: 'Người lý trí vs người thật; System 1/2 & heuristic (availability, representativeness, anchoring); thiên kiến (overconfidence, confirmation, hindsight, mental accounting); prospect theory & loss aversion (~2x), framing; herding, bong bóng, momentum, disposition effect; nudge, choice architecture, sức mạnh default; định giá tâm lý, khan hiếm, bằng chứng xã hội, decoy; debiasing & ranh giới nudge vs. dark pattern.',
    requirements: 'Không cần nền tài chính. Tò mò về tâm lý & hành vi con người là đủ. Đọc thêm Kahneman "Thinking, Fast and Slow" và Ariely "Predictably Irrational" để đào sâu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển (Kahneman, Thaler, Ariely, Shefrin), CFA, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tài chính hành vi là gì; người lý trí vs người thật.', lessons: [intro] },
    { title: 'Chương 1 — Tài chính hành vi là gì|||Chapter 1 — What is behavioral finance', description: 'Behavioral finance vs EMH & con người lý trí; vì sao quan trọng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hai hệ tư duy & heuristics|||Chapter 2 — Two systems & heuristics', description: 'System 1/2, availability, representativeness, anchoring.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thiên kiến nhận thức|||Chapter 3 — Cognitive biases', description: 'Overconfidence, confirmation, hindsight, mental accounting.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lý thuyết triển vọng & cảm xúc|||Chapter 4 — Prospect theory & emotion', description: 'Prospect theory, loss aversion, framing, cảm xúc.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thiên kiến trên thị trường|||Chapter 5 — Biases in markets', description: 'Herding, bong bóng, momentum, disposition effect.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nudge & kiến trúc lựa chọn|||Chapter 6 — Nudge & choice architecture', description: 'Nudge, choice architecture, default, ứng dụng chính sách.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Marketing & truyền thông|||Chapter 7 — Marketing & communication', description: 'Định giá tâm lý, khan hiếm, social proof, mặc định, thông điệp.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quyết định tốt hơn & đạo đức|||Chapter 8 — Better decisions & ethics', description: 'Debiasing, ranh giới nudge vs manipulation, đạo đức.', lessons: [c8, c8q] },
  ],
};
