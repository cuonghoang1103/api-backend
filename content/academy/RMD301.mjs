/**
 * RMD301 — Research Methods For Designers. Phương pháp nghiên cứu cho nhà
 * thiết kế (ngành Thiết kế mỹ thuật số FPTU). Song ngữ + phương pháp + ví dụ
 * nghiên cứu thiết kế thật. Sách chuẩn: Hanington & Martin "Universal Methods
 * of Design", IDEO Field Guide to HCD, Creswell "Research Design", NN/g.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('rmd301-0-1-overview', 'Course overview: Research methods for designers|||Tổng quan: Phương pháp nghiên cứu cho nhà thiết kế',
  'Vì sao nhà thiết kế cần nghiên cứu; nghiên cứu tốt là gì; lộ trình 4 bước: hiểu người dùng → chọn phương pháp → phân tích/tổng hợp → biến insight thành quyết định thiết kế.',
  [[
    `<span class="eyebrow">RMD301 · Lesson 0.1 · Overview</span>
<h2>Research Methods for Designers</h2>
<p class="lead">Great design is not guessing prettier — it is <strong>designing from evidence</strong>. This course teaches you how to <strong>ask the right questions about people</strong> and answer them with rigour: choosing a method, gathering data on how real users behave, making sense of it, and turning what you learn into confident design decisions.</p>
<h3>Why research?</h3>
<ul>
<li><strong>Reduce risk</strong> — a wrong assumption caught in a study costs a sketch; caught after launch it costs a product.</li>
<li><strong>Speak for the user</strong> — evidence beats the loudest opinion (or the boss) in the room.</li>
<li><strong>Design for reality</strong> — people rarely behave the way we imagine at our desk.</li>
</ul>
<h3>Roadmap (4 steps)</h3>
<p><strong>Understand people</strong> (why research, qual vs quant, user research) → <strong>observe in context</strong> (ethnography, field methods) → <strong>analyse &amp; synthesise</strong> (affinity, themes, personas, journeys) → <strong>test &amp; report</strong> (usability, ethics, insight to decision). Following Hanington &amp; Martin, IDEO&#39;s HCD and Creswell.</p>`,
    `<span class="eyebrow">RMD301 · Bài 0.1 · Tổng quan</span>
<h2>Phương pháp nghiên cứu cho nhà thiết kế</h2>
<p class="lead">Thiết kế giỏi không phải là đoán cho đẹp hơn — mà là <strong>thiết kế dựa trên bằng chứng</strong>. Môn này dạy bạn cách <strong>đặt đúng câu hỏi về con người</strong> và trả lời một cách chặt chẽ: chọn phương pháp, thu dữ liệu về cách người dùng thật hành xử, hiểu dữ liệu đó, rồi biến điều học được thành quyết định thiết kế tự tin.</p>
<h3>Vì sao phải nghiên cứu?</h3>
<ul>
<li><strong>Giảm rủi ro</strong> — một giả định sai bắt được lúc nghiên cứu chỉ tốn một bản phác; bắt sau khi ra mắt thì tốn cả sản phẩm.</li>
<li><strong>Nói thay người dùng</strong> — bằng chứng thắng ý kiến to mồm nhất (hay của sếp) trong phòng.</li>
<li><strong>Thiết kế cho thực tế</strong> — người ta hiếm khi hành xử như ta tưởng lúc ngồi bàn.</li>
</ul>
<h3>Lộ trình (4 bước)</h3>
<p><strong>Hiểu con người</strong> (vì sao nghiên cứu, định tính vs định lượng, nghiên cứu người dùng) → <strong>quan sát trong bối cảnh</strong> (dân tộc học, phương pháp hiện trường) → <strong>phân tích &amp; tổng hợp</strong> (affinity, chủ đề, persona, hành trình) → <strong>kiểm thử &amp; báo cáo</strong> (khả dụng, đạo đức, insight thành quyết định). Theo Hanington &amp; Martin, HCD của IDEO và Creswell.</p>`,
  ]]);

const c1 = doc('rmd301-1-1-design-research', '1.1 — Research in design|||1.1 — Nghiên cứu trong thiết kế',
  'Design research là gì, vì sao cần; nghiên cứu vs quan điểm cá nhân; evidence-based design; ba loại: research FOR / THROUGH / ABOUT design.',
  [[
    `<span class="eyebrow">RMD301 · Chapter 1 · Lesson 1.1</span>
<h2>Research in design</h2>
<h3>What is design research?</h3>
<p><strong>Design research</strong> is the systematic gathering of evidence about people, problems and solutions to <em>inform</em> and <em>evaluate</em> design. It is not a literature review for a thesis — it is the loop of learning that keeps a product honest.</p>
<ul>
<li><strong>Research FOR design</strong> — before designing: understand users, needs, context.</li>
<li><strong>Research THROUGH design</strong> — during: prototypes as questions you test.</li>
<li><strong>Research ABOUT design</strong> — after: does the design actually work?</li>
</ul>
<h3>Evidence-based design</h3>
<p>Opinions are cheap and plentiful; <strong>evidence</strong> is what settles arguments. An <em>assumption</em> ("users want a dashboard") becomes a <em>testable question</em> ("which tasks do users do most in the first week?"), which becomes <em>data</em>, which becomes a <em>decision</em>.</p>
<div class="callout"><span class="badge">Real example</span> Redesigning a hospital form, a team assumed nurses wanted more fields for safety. Observing real shifts showed the opposite — nurses skipped fields under time pressure. The evidence flipped the brief from "add fields" to "remove and default them".</div>`,
    `<span class="eyebrow">RMD301 · Chương 1 · Bài 1.1</span>
<h2>Nghiên cứu trong thiết kế</h2>
<h3>Design research là gì?</h3>
<p><strong>Nghiên cứu thiết kế</strong> là việc thu thập bằng chứng một cách có hệ thống về con người, vấn đề và giải pháp để <em>định hướng</em> và <em>đánh giá</em> thiết kế. Nó không phải bài tổng quan tài liệu cho luận văn — mà là vòng lặp học hỏi giữ cho sản phẩm trung thực.</p>
<ul>
<li><strong>Nghiên cứu CHO thiết kế</strong> — trước khi làm: hiểu người dùng, nhu cầu, bối cảnh.</li>
<li><strong>Nghiên cứu QUA thiết kế</strong> — trong khi làm: bản mẫu như câu hỏi để kiểm chứng.</li>
<li><strong>Nghiên cứu VỀ thiết kế</strong> — sau khi làm: thiết kế có thực sự hiệu quả không?</li>
</ul>
<h3>Thiết kế dựa trên bằng chứng</h3>
<p>Ý kiến thì rẻ và đầy rẫy; <strong>bằng chứng</strong> mới dứt điểm tranh cãi. Một <em>giả định</em> ("người dùng muốn dashboard") biến thành <em>câu hỏi kiểm chứng được</em> ("tuần đầu người dùng làm tác vụ nào nhiều nhất?"), thành <em>dữ liệu</em>, rồi thành <em>quyết định</em>.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Khi thiết kế lại một biểu mẫu bệnh viện, nhóm cho rằng y tá muốn thêm ô để an toàn hơn. Quan sát ca trực thật cho kết quả ngược — y tá bỏ ô khi gấp. Bằng chứng lật đề bài từ "thêm ô" thành "bớt ô và điền sẵn".</div>`,
  ]]);

const c1q = quiz('rmd301-quiz-1', 'Quiz 1 — Research in design|||Quiz 1 — Nghiên cứu trong thiết kế', [
  { id: 'q1', question: 'Evidence-based design nghĩa là?', options: ['Thiết kế theo ý sếp', 'Thiết kế dựa trên bằng chứng thu được về người dùng', 'Thiết kế cho đẹp mắt', 'Sao chép đối thủ'], correctIndex: 1, explanation: 'Quyết định thiết kế dựa trên dữ liệu/bằng chứng, không phải ý kiến.' },
  { id: 'q2', question: '"Research FOR design" xảy ra khi nào?', options: ['Trước khi thiết kế, để hiểu người dùng & bối cảnh', 'Chỉ sau khi ra mắt', 'Không bao giờ', 'Khi viết luận văn'], correctIndex: 0, explanation: 'FOR design: nghiên cứu trước để định hướng thiết kế.' },
  { id: 'q3', question: 'Vì sao nên bắt giả định sai sớm?', options: ['Để có nhiều tài liệu', 'Sai bắt sớm chỉ tốn bản phác, bắt muộn tốn cả sản phẩm', 'Không quan trọng', 'Để làm hài lòng khách'], correctIndex: 1, explanation: 'Giảm rủi ro: chi phí sửa tăng vọt càng về sau.' },
]);

const c2 = doc('rmd301-2-1-qual-quant', '2.1 — Qualitative vs quantitative|||2.1 — Định tính vs định lượng',
  'Định tính (vì sao, sâu, ít người) vs định lượng (bao nhiêu, đo được, nhiều người); mixed methods; chọn phương pháp theo câu hỏi.',
  [[
    `<span class="eyebrow">RMD301 · Chapter 2 · Lesson 2.1</span>
<h2>Qualitative vs quantitative</h2>
<h3>Two ways of knowing</h3>
<ul>
<li><strong>Qualitative</strong> — answers <em>why</em> and <em>how</em>. Words, stories, behaviours from a few people, studied deeply. Interviews, observation, diary studies. Rich but not statistically projectable.</li>
<li><strong>Quantitative</strong> — answers <em>how many</em> and <em>how much</em>. Numbers from many people. Surveys at scale, analytics, A/B tests. Projectable but shallow on motive.</li>
</ul>
<h3>Mixed methods</h3>
<p>The strongest studies combine them: <strong>qual to find the question, quant to measure it</strong> (or quant to find a spike, qual to explain it). Analytics show 60% abandon a checkout step; interviews reveal <em>why</em>.</p>
<pre><code>Match method to question:
  "Why do users abandon signup?" -> qualitative (interviews)
  "What % abandon on step 3?"     -> quantitative (analytics)
  "Which of two layouts is faster?" -> quantitative (A/B test)
  "How does this feel to use?"    -> qualitative (observation)
</code></pre>
<div class="callout"><span class="badge">Real example</span> Spotify pairs large-scale listening data (quant) with in-home interviews (qual). The numbers say <em>what</em> people skip; the conversations say <em>why</em> a commute playlist must feel different from a workout one.</div>`,
    `<span class="eyebrow">RMD301 · Chương 2 · Bài 2.1</span>
<h2>Định tính vs định lượng</h2>
<h3>Hai cách để biết</h3>
<ul>
<li><strong>Định tính (qualitative)</strong> — trả lời <em>vì sao</em> và <em>như thế nào</em>. Lời kể, câu chuyện, hành vi của ít người, nghiên cứu sâu. Phỏng vấn, quan sát, nhật ký. Giàu chi tiết nhưng không suy rộng thống kê được.</li>
<li><strong>Định lượng (quantitative)</strong> — trả lời <em>bao nhiêu</em>. Con số từ nhiều người. Khảo sát quy mô lớn, phân tích số liệu, A/B test. Suy rộng được nhưng nông về động cơ.</li>
</ul>
<h3>Phương pháp hỗn hợp (mixed methods)</h3>
<p>Nghiên cứu mạnh nhất kết hợp cả hai: <strong>định tính để tìm câu hỏi, định lượng để đo</strong> (hoặc định lượng thấy điểm bất thường, định tính giải thích). Số liệu cho thấy 60% bỏ một bước thanh toán; phỏng vấn cho biết <em>vì sao</em>.</p>
<pre><code>Khớp phương pháp với câu hỏi:
  "Vì sao người dùng bỏ đăng ký?" -> định tính (phỏng vấn)
  "Bao nhiêu % bỏ ở bước 3?"       -> định lượng (analytics)
  "Bố cục nào thao tác nhanh hơn?" -> định lượng (A/B test)
  "Dùng thấy cảm giác thế nào?"    -> định tính (quan sát)
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Spotify ghép dữ liệu nghe nhạc quy mô lớn (định lượng) với phỏng vấn tại nhà (định tính). Con số nói người ta bỏ qua <em>cái gì</em>; các cuộc trò chuyện nói <em>vì sao</em> playlist đi làm phải khác playlist tập gym.</div>`,
  ]]);

const c2q = quiz('rmd301-quiz-2', 'Quiz 2 — Qual vs quant|||Quiz 2 — Định tính vs định lượng', [
  { id: 'q1', question: 'Nghiên cứu định tính giỏi trả lời câu hỏi nào nhất?', options: ['Bao nhiêu phần trăm', 'Vì sao & như thế nào', 'Giá bao nhiêu', 'Có bao nhiêu người'], correctIndex: 1, explanation: 'Định tính: chiều sâu, động cơ, vì sao/như thế nào.' },
  { id: 'q2', question: 'Câu hỏi "Bao nhiêu % người bỏ ở bước 3?" hợp với?', options: ['Định tính (phỏng vấn)', 'Định lượng (analytics)', 'Không đo được', 'Brainstorm'], correctIndex: 1, explanation: 'Đếm/tỉ lệ trên nhiều người là định lượng.' },
  { id: 'q3', question: 'Mixed methods mạnh vì?', options: ['Chỉ dùng số', 'Kết hợp: định tính tìm câu hỏi, định lượng đo lường', 'Bỏ qua người dùng', 'Nhanh và rẻ nhất'], correctIndex: 1, explanation: 'Hai loại bù nhau: cái gì (quant) và vì sao (qual).' },
]);

const c3 = doc('rmd301-3-1-user-research', '3.1 — User research|||3.1 — Nghiên cứu người dùng',
  'Phỏng vấn (mở, tránh câu dẫn), khảo sát (câu hỏi rõ, mẫu), contextual inquiry (hỏi ngay tại nơi làm việc); tránh thiên lệch xác nhận.',
  [[
    `<span class="eyebrow">RMD301 · Chapter 3 · Lesson 3.1</span>
<h2>User research</h2>
<h3>Interviews</h3>
<p>A <strong>semi-structured interview</strong> uses open questions and follows the person&#39;s answers. Ask about <em>past behaviour</em> ("tell me about the last time you booked a trip"), not hypotheticals ("would you use this?"). Avoid <strong>leading questions</strong> — "how much did you love it?" bakes in the answer.</p>
<h3>Surveys</h3>
<p>Surveys scale to many people but only reward <strong>clear, unbiased questions</strong>. One idea per question, no double-barrelled ("is it fast and easy?"), balanced scales. Great for measuring what you already understand — bad for discovery.</p>
<h3>Contextual inquiry</h3>
<p>Interview people <em>where and while they work</em>. You watch the real task, then ask "why did you do that?" in the moment — surfacing workarounds and tacit knowledge people never report in a meeting room.</p>
<pre><code>Leading   -> "Don&#39;t you find the old app confusing?"
Neutral   -> "Walk me through how you use the old app."
Hypothet. -> "Would you pay for this?"
Behaviour -> "What did you pay for something like this last time?"
</code></pre>
<div class="callout"><span class="badge">Real example</span> Intuit&#39;s "Follow Me Home" program sends designers to watch customers do their taxes at their own kitchen table. Sitting in the real context revealed pain points no lab interview ever surfaced — and became a core part of the company&#39;s method.</div>`,
    `<span class="eyebrow">RMD301 · Chương 3 · Bài 3.1</span>
<h2>Nghiên cứu người dùng</h2>
<h3>Phỏng vấn</h3>
<p><strong>Phỏng vấn bán cấu trúc</strong> dùng câu hỏi mở và bám theo câu trả lời. Hỏi về <em>hành vi đã xảy ra</em> ("kể tôi nghe lần gần nhất bạn đặt vé"), đừng hỏi giả định ("bạn có dùng cái này không?"). Tránh <strong>câu hỏi dẫn dắt</strong> — "bạn thích nó đến mức nào?" đã cài sẵn câu trả lời.</p>
<h3>Khảo sát</h3>
<p>Khảo sát suy rộng ra nhiều người nhưng chỉ hiệu quả với <strong>câu hỏi rõ, không thiên lệch</strong>. Mỗi câu một ý, tránh câu hai nòng ("nó nhanh và dễ không?"), thang đo cân bằng. Tốt để đo điều đã hiểu — dở để khám phá.</p>
<h3>Contextual inquiry (điều tra bối cảnh)</h3>
<p>Phỏng vấn người dùng <em>ngay tại nơi và lúc họ làm việc</em>. Bạn xem tác vụ thật, rồi hỏi "vì sao bạn làm vậy?" ngay lúc đó — lộ ra các mẹo lách và hiểu biết ngầm mà người ta không bao giờ kể trong phòng họp.</p>
<pre><code>Dẫn dắt   -> "Bạn thấy app cũ rối rắm đúng không?"
Trung lập -> "Chỉ tôi cách bạn dùng app cũ."
Giả định  -> "Bạn có trả tiền cho cái này không?"
Hành vi   -> "Lần trước bạn trả bao nhiêu cho thứ tương tự?"
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Chương trình "Follow Me Home" của Intuit cử nhà thiết kế đến xem khách khai thuế ngay tại bàn bếp nhà họ. Ngồi trong bối cảnh thật lộ ra điểm đau mà phỏng vấn trong phòng lab không bao giờ thấy — và thành một phần cốt lõi trong phương pháp của công ty.</div>`,
  ]]);

const c3q = quiz('rmd301-quiz-3', 'Quiz 3 — User research|||Quiz 3 — Nghiên cứu người dùng', [
  { id: 'q1', question: 'Câu nào là câu hỏi DẪN DẮT (nên tránh)?', options: ['Chỉ tôi cách bạn dùng app.', 'Bạn thấy app cũ rối rắm đúng không?', 'Lần gần nhất bạn đặt vé thế nào?', 'Bạn làm bước này ra sao?'], correctIndex: 1, explanation: 'Câu dẫn dắt cài sẵn câu trả lời mong muốn.' },
  { id: 'q2', question: 'Contextual inquiry là?', options: ['Khảo sát online quy mô lớn', 'Phỏng vấn ngay tại nơi & lúc người dùng làm việc', 'Đọc tài liệu', 'A/B test'], correctIndex: 1, explanation: 'Quan sát + hỏi trong bối cảnh thật, lộ mẹo lách.' },
  { id: 'q3', question: 'Trong phỏng vấn nên ưu tiên hỏi về?', options: ['Hành vi đã xảy ra thật', 'Giả định tương lai', 'Ý kiến của bạn thiết kế', 'Đối thủ cạnh tranh'], correctIndex: 0, explanation: 'Hành vi quá khứ đáng tin hơn dự đoán "sẽ dùng không".' },
]);

const c4 = doc('rmd301-4-1-observation-ethnography', '4.1 — Observation & ethnography|||4.1 — Quan sát & dân tộc học',
  'Quan sát (thấy điều người ta không kể), dân tộc học (đắm trong bối cảnh), diary study (theo thời gian), shadowing (bám theo).',
  [[
    `<span class="eyebrow">RMD301 · Chapter 4 · Lesson 4.1</span>
<h2>Observation &amp; ethnography</h2>
<h3>Watch what people do, not just what they say</h3>
<p>People are unreliable narrators of their own behaviour — not lying, just unaware. <strong>Observation</strong> catches the gap between the reported and the real: the sticky note on the monitor, the app opened then abandoned, the workaround nobody mentions.</p>
<h3>Methods</h3>
<ul>
<li><strong>Ethnography</strong> — immerse in users&#39; environment over time to understand culture and context, not a single task.</li>
<li><strong>Diary study</strong> — participants log their own experience over days or weeks; captures change and rare moments a single session misses.</li>
<li><strong>Shadowing</strong> — follow one person through their day, watching how tools fit into a real flow.</li>
<li><strong>Fly-on-the-wall</strong> — observe without intervening, to avoid influencing behaviour.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> When redesigning the OXO Good Grips peeler, designers watched people — including those with arthritis — actually peel vegetables. Watching hands struggle with thin metal handles led to the thick, soft grip that made the product famous. No survey would have produced it.</div>`,
    `<span class="eyebrow">RMD301 · Chương 4 · Bài 4.1</span>
<h2>Quan sát &amp; dân tộc học</h2>
<h3>Xem người ta LÀM gì, không chỉ NÓI gì</h3>
<p>Con người kể lại hành vi của chính mình không đáng tin — không phải nói dối, chỉ là không tự nhận ra. <strong>Quan sát</strong> bắt được khoảng cách giữa điều được kể và điều thật: tờ giấy dán trên màn hình, app mở ra rồi bỏ, mẹo lách chẳng ai nhắc.</p>
<h3>Các phương pháp</h3>
<ul>
<li><strong>Dân tộc học (ethnography)</strong> — đắm mình trong môi trường người dùng theo thời gian để hiểu văn hoá và bối cảnh, không chỉ một tác vụ.</li>
<li><strong>Nhật ký (diary study)</strong> — người tham gia tự ghi trải nghiệm qua nhiều ngày/tuần; bắt được sự thay đổi và khoảnh khắc hiếm mà một buổi bỏ lỡ.</li>
<li><strong>Bám theo (shadowing)</strong> — theo một người suốt ngày làm việc, xem công cụ khớp vào luồng thật ra sao.</li>
<li><strong>Ruồi trên tường (fly-on-the-wall)</strong> — quan sát mà không can thiệp, tránh làm lệch hành vi.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Khi thiết kế lại dụng cụ gọt OXO Good Grips, nhà thiết kế xem người ta — kể cả người bị viêm khớp — gọt rau thật. Nhìn bàn tay vật lộn với cán kim loại mỏng dẫn tới tay cầm dày, mềm làm nên tên tuổi sản phẩm. Không khảo sát nào sinh ra được điều đó.</div>`,
  ]]);

const c4q = quiz('rmd301-quiz-4', 'Quiz 4 — Observation|||Quiz 4 — Quan sát', [
  { id: 'q1', question: 'Vì sao phải QUAN SÁT chứ không chỉ hỏi?', options: ['Người ta luôn nói dối', 'Người ta không tự nhận ra hành vi thật của mình', 'Quan sát nhanh hơn', 'Để tiết kiệm tiền'], correctIndex: 1, explanation: 'Khoảng cách giữa điều được kể và điều thật diễn ra.' },
  { id: 'q2', question: 'Diary study phù hợp nhất để bắt?', options: ['Một tác vụ đơn lẻ trong lab', 'Trải nghiệm & thay đổi qua nhiều ngày/tuần', 'Tỉ lệ nhấp chuột', 'Ý kiến chuyên gia'], correctIndex: 1, explanation: 'Nhật ký ghi theo thời gian, bắt khoảnh khắc hiếm.' },
  { id: 'q3', question: '"Fly-on-the-wall" nghĩa là?', options: ['Phỏng vấn sâu', 'Quan sát mà không can thiệp để tránh làm lệch hành vi', 'Khảo sát ẩn danh', 'Bám theo và hỏi liên tục'], correctIndex: 1, explanation: 'Quan sát thụ động, không tác động lên hành vi.' },
]);

const c5 = doc('rmd301-5-1-analysis-synthesis', '5.1 — Analysis & synthesis|||5.1 — Phân tích & tổng hợp',
  'Affinity diagram (gom mẩu thành chủ đề), thematic analysis (mã hoá → chủ đề), persona (mẫu người dùng), journey map (hành trình + điểm đau).',
  [[
    `<span class="eyebrow">RMD301 · Chapter 5 · Lesson 5.1</span>
<h2>Analysis &amp; synthesis</h2>
<h3>From raw data to insight</h3>
<p>Research produces a pile of notes, quotes and clips. <strong>Synthesis</strong> is the craft of turning that mess into patterns a team can act on. It is where data becomes meaning.</p>
<ul>
<li><strong>Affinity diagram</strong> — write each observation on a sticky note, then cluster related notes bottom-up until themes emerge. No pre-set categories.</li>
<li><strong>Thematic analysis</strong> — systematically <em>code</em> the data (tag recurring ideas), group codes into <em>themes</em>, and name the story each theme tells.</li>
<li><strong>Persona</strong> — a concise, evidence-based portrait of a representative user (goals, behaviours, frustrations) that keeps the team designing for a real someone, not "the user".</li>
<li><strong>Journey map</strong> — the steps a user takes to reach a goal, with their actions, thoughts and emotions at each stage — pain points and opportunities jump out.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> A banking team mapped the "open an account" journey and found the emotional low was not the paperwork but the silent wait afterwards — no confirmation of what happens next. The fix was not a new screen but a single status message, born entirely from the journey map.</div>`,
    `<span class="eyebrow">RMD301 · Chương 5 · Bài 5.1</span>
<h2>Phân tích &amp; tổng hợp</h2>
<h3>Từ dữ liệu thô đến insight</h3>
<p>Nghiên cứu để lại một đống ghi chú, trích dẫn và đoạn clip. <strong>Tổng hợp (synthesis)</strong> là nghề biến mớ hỗn độn đó thành các mẫu hình mà nhóm hành động được. Đây là chỗ dữ liệu thành ý nghĩa.</p>
<ul>
<li><strong>Affinity diagram (sơ đồ tương đồng)</strong> — ghi mỗi quan sát lên một mẩu giấy, rồi gom các mẩu liên quan từ dưới lên cho tới khi chủ đề hiện ra. Không định sẵn nhóm.</li>
<li><strong>Thematic analysis (phân tích chủ đề)</strong> — <em>mã hoá</em> dữ liệu có hệ thống (gắn nhãn ý lặp lại), gom mã thành <em>chủ đề</em>, và đặt tên cho câu chuyện mỗi chủ đề kể.</li>
<li><strong>Persona</strong> — chân dung súc tích, dựa trên bằng chứng, của một người dùng đại diện (mục tiêu, hành vi, bực bội) để nhóm thiết kế cho một người thật, không phải "người dùng chung chung".</li>
<li><strong>Journey map (bản đồ hành trình)</strong> — các bước người dùng đi để đạt mục tiêu, kèm hành động, suy nghĩ và cảm xúc ở từng chặng — điểm đau và cơ hội bật ra.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Một nhóm ngân hàng vẽ hành trình "mở tài khoản" và phát hiện đáy cảm xúc không phải là giấy tờ mà là khoảng chờ im lặng sau đó — không có xác nhận điều gì xảy ra tiếp. Lời giải không phải màn hình mới mà chỉ một tin nhắn trạng thái, sinh ra hoàn toàn từ journey map.</div>`,
  ]]);

const c5q = quiz('rmd301-quiz-5', 'Quiz 5 — Synthesis|||Quiz 5 — Tổng hợp', [
  { id: 'q1', question: 'Affinity diagram hoạt động thế nào?', options: ['Định sẵn nhóm rồi nhét dữ liệu vào', 'Gom các mẩu quan sát liên quan từ dưới lên tới khi chủ đề hiện ra', 'Chỉ đếm số lượng', 'Vẽ biểu đồ tròn'], correctIndex: 1, explanation: 'Gom cụm bottom-up, chủ đề tự nổi, không định sẵn nhóm.' },
  { id: 'q2', question: 'Persona tốt phải?', options: ['Do nhóm bịa cho vui', 'Dựa trên bằng chứng nghiên cứu về người dùng thật', 'Càng nhiều persona càng tốt', 'Chỉ ghi tuổi và giới tính'], correctIndex: 1, explanation: 'Persona là chân dung DỰA TRÊN dữ liệu, không phải tưởng tượng.' },
  { id: 'q3', question: 'Journey map làm bật ra điều gì?', options: ['Mã nguồn', 'Điểm đau & cơ hội ở từng chặng của hành trình', 'Giá thành sản phẩm', 'Số dòng code'], correctIndex: 1, explanation: 'Bản đồ hành trình lộ cảm xúc, điểm đau, cơ hội theo bước.' },
]);

const c6 = doc('rmd301-6-1-usability-research', '6.1 — Usability research|||6.1 — Nghiên cứu khả dụng',
  'Usability testing (giao nhiệm vụ, quan sát), A/B testing (so hai bản), card sorting (kiến trúc thông tin), heuristic evaluation (chuyên gia rà 10 nguyên tắc).',
  [[
    `<span class="eyebrow">RMD301 · Chapter 6 · Lesson 6.1</span>
<h2>Usability research</h2>
<h3>Does the design actually work?</h3>
<ul>
<li><strong>Usability testing</strong> — give a real user real tasks and watch where they struggle. Do not lead; ask them to think aloud. Nielsen&#39;s rule of thumb: about <strong>5 users</strong> surface most major problems in a qualitative test.</li>
<li><strong>A/B testing</strong> — show two versions to different live users and measure which performs better on a metric. Quantitative, needs traffic and one clear variable.</li>
<li><strong>Card sorting</strong> — users group and label content their way, revealing a mental model for <em>information architecture</em> (menus, categories).</li>
<li><strong>Heuristic evaluation</strong> — experts inspect the interface against a set of usability principles (e.g. Nielsen&#39;s 10) to catch problems cheaply, before testing with users.</li>
</ul>
<pre><code>Task-based test setup:
  1. Write realistic tasks (not "click the blue button")
  2. Recruit ~5 representative users
  3. Watch + think-aloud; note failures, not opinions
  4. Rank issues by severity -> fix -> retest
</code></pre>
<div class="callout"><span class="badge">Real example</span> A team argued for weeks over two navigation labels. A 5-person usability test settled it in an afternoon: users simply could not find "Resources", but found "Help" instantly. Evidence ended the debate that opinion could not.</div>`,
    `<span class="eyebrow">RMD301 · Chương 6 · Bài 6.1</span>
<h2>Nghiên cứu khả dụng</h2>
<h3>Thiết kế có thực sự chạy được không?</h3>
<ul>
<li><strong>Usability testing (kiểm thử khả dụng)</strong> — giao cho người dùng thật nhiệm vụ thật và xem họ vấp ở đâu. Đừng dẫn dắt; bảo họ nghĩ thành lời. Kinh nghiệm Nielsen: khoảng <strong>5 người dùng</strong> đã lộ phần lớn lỗi lớn trong một buổi kiểm thử định tính.</li>
<li><strong>A/B testing</strong> — cho hai phiên bản đến hai nhóm người dùng thật và đo bản nào tốt hơn theo một chỉ số. Định lượng, cần lưu lượng và một biến rõ ràng.</li>
<li><strong>Card sorting</strong> — người dùng tự gom và đặt tên nội dung theo cách của họ, lộ ra mô hình tư duy cho <em>kiến trúc thông tin</em> (menu, danh mục).</li>
<li><strong>Heuristic evaluation (đánh giá theo nguyên tắc)</strong> — chuyên gia soi giao diện theo bộ nguyên tắc khả dụng (vd 10 nguyên tắc Nielsen) để bắt lỗi rẻ, trước khi thử với người dùng.</li>
</ul>
<pre><code>Thiết lập kiểm thử theo nhiệm vụ:
  1. Viết nhiệm vụ thực tế (không phải "bấm nút xanh")
  2. Tuyển ~5 người dùng đại diện
  3. Xem + nghĩ thành lời; ghi lỗi, không ghi ý kiến
  4. Xếp lỗi theo mức nghiêm trọng -> sửa -> thử lại
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Một nhóm cãi nhau hàng tuần về hai nhãn điều hướng. Buổi usability 5 người giải quyết trong một buổi chiều: người dùng đơn giản không tìm ra "Tài nguyên", nhưng thấy "Trợ giúp" ngay. Bằng chứng chấm dứt cuộc tranh cãi mà ý kiến không dứt được.</div>`,
  ]]);

const c6q = quiz('rmd301-quiz-6', 'Quiz 6 — Usability|||Quiz 6 — Khả dụng', [
  { id: 'q1', question: 'Theo kinh nghiệm Nielsen, bao nhiêu người dùng lộ phần lớn lỗi lớn trong test định tính?', options: ['Khoảng 5', 'Ít nhất 100', 'Đúng 1', 'Trên 1000'], correctIndex: 0, explanation: 'Khoảng 5 người đã bắt hầu hết lỗi khả dụng nghiêm trọng.' },
  { id: 'q2', question: 'Card sorting dùng để?', options: ['Đo tốc độ tải trang', 'Hiểu mô hình tư duy cho kiến trúc thông tin (menu/danh mục)', 'Chọn màu', 'So sánh doanh thu'], correctIndex: 1, explanation: 'Người dùng tự gom/đặt tên nội dung → IA.' },
  { id: 'q3', question: 'Heuristic evaluation là?', options: ['Người dùng thật làm nhiệm vụ', 'Chuyên gia soi giao diện theo bộ nguyên tắc khả dụng', 'Khảo sát quy mô lớn', 'A/B test'], correctIndex: 1, explanation: 'Chuyên gia rà theo nguyên tắc (vd 10 của Nielsen), rẻ và nhanh.' },
]);

const c7 = doc('rmd301-7-1-ethics-sampling', '7.1 — Research ethics & sampling|||7.1 — Đạo đức & lấy mẫu nghiên cứu',
  'Đồng thuận có hiểu biết (consent), bảo mật/ẩn danh, không gây hại; lấy mẫu (đại diện, không tiện lợi lệch); nhận diện thiên lệch (confirmation, leading, sampling).',
  [[
    `<span class="eyebrow">RMD301 · Chapter 7 · Lesson 7.1</span>
<h2>Research ethics &amp; sampling</h2>
<h3>Ethics: research on people is a responsibility</h3>
<ul>
<li><strong>Informed consent</strong> — participants know what the study is, that it is voluntary, and can stop at any time.</li>
<li><strong>Privacy &amp; anonymity</strong> — protect personal data; report findings so no individual is identifiable.</li>
<li><strong>Do no harm</strong> — no deception that hurts, no pressure, respect for vulnerable groups.</li>
</ul>
<h3>Sampling: who you talk to shapes what you learn</h3>
<p>Recruit people who represent your real users. A <strong>convenience sample</strong> (whoever is easy — friends, colleagues) skews results. Small qualitative studies are fine, but be honest about who was <em>not</em> in the room.</p>
<h3>Bias to watch for</h3>
<ul>
<li><strong>Confirmation bias</strong> — hearing only what supports your idea.</li>
<li><strong>Leading questions</strong> — wording that pushes an answer.</li>
<li><strong>Sampling bias</strong> — a group that does not match real users.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> A team tested a health app only with young, tech-savvy volunteers and shipped confidently. Older patients — the actual target — could not read the small text or trust the flow. A biased sample hid the biggest problem until launch.</div>`,
    `<span class="eyebrow">RMD301 · Chương 7 · Bài 7.1</span>
<h2>Đạo đức &amp; lấy mẫu nghiên cứu</h2>
<h3>Đạo đức: nghiên cứu trên con người là trách nhiệm</h3>
<ul>
<li><strong>Đồng thuận có hiểu biết (informed consent)</strong> — người tham gia biết nghiên cứu là gì, là tự nguyện, và có thể dừng bất cứ lúc nào.</li>
<li><strong>Riêng tư &amp; ẩn danh</strong> — bảo vệ dữ liệu cá nhân; báo cáo sao cho không nhận ra được cá nhân nào.</li>
<li><strong>Không gây hại</strong> — không lừa dối gây tổn thương, không ép buộc, tôn trọng nhóm dễ tổn thương.</li>
</ul>
<h3>Lấy mẫu: bạn nói chuyện với ai quyết định bạn học được gì</h3>
<p>Tuyển người đại diện cho người dùng thật. <strong>Mẫu tiện lợi (convenience sample)</strong> (ai dễ kiếm — bạn bè, đồng nghiệp) làm lệch kết quả. Nghiên cứu định tính nhỏ thì ổn, nhưng phải thành thật về ai <em>không</em> có mặt.</p>
<h3>Các thiên lệch cần đề phòng</h3>
<ul>
<li><strong>Thiên lệch xác nhận (confirmation bias)</strong> — chỉ nghe điều ủng hộ ý mình.</li>
<li><strong>Câu hỏi dẫn dắt</strong> — cách hỏi đẩy về một câu trả lời.</li>
<li><strong>Thiên lệch lấy mẫu (sampling bias)</strong> — nhóm không khớp người dùng thật.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Một nhóm thử app sức khoẻ chỉ với tình nguyện viên trẻ, rành công nghệ rồi tự tin ra mắt. Bệnh nhân lớn tuổi — đối tượng thật — không đọc nổi chữ nhỏ và không tin luồng thao tác. Mẫu thiên lệch giấu vấn đề lớn nhất tới tận lúc ra mắt.</div>`,
  ]]);

const c7q = quiz('rmd301-quiz-7', 'Quiz 7 — Ethics & sampling|||Quiz 7 — Đạo đức & lấy mẫu', [
  { id: 'q1', question: 'Informed consent bảo đảm điều gì?', options: ['Người tham gia biết & tự nguyện, có thể dừng bất cứ lúc nào', 'Kết quả luôn đúng', 'Miễn phí cho công ty', 'Không cần ghi âm'], correctIndex: 0, explanation: 'Đồng thuận có hiểu biết: minh bạch, tự nguyện, rút được.' },
  { id: 'q2', question: 'Vì sao "convenience sample" (bạn bè/đồng nghiệp) nguy hiểm?', options: ['Quá đắt', 'Làm lệch kết quả vì không đại diện người dùng thật', 'Quá chậm', 'Vi phạm pháp luật'], correctIndex: 1, explanation: 'Mẫu tiện lợi thiên lệch, giấu vấn đề của người dùng thật.' },
  { id: 'q3', question: 'Confirmation bias là?', options: ['Chọn màu theo cảm tính', 'Chỉ nghe/tìm bằng chứng ủng hộ ý mình sẵn có', 'Lấy mẫu ngẫu nhiên', 'Ẩn danh dữ liệu'], correctIndex: 1, explanation: 'Thiên lệch xác nhận: bỏ qua dữ liệu trái ý.' },
]);

const c8 = doc('rmd301-8-1-report-impact', '8.1 — Reporting & applying research|||8.1 — Báo cáo & ứng dụng nghiên cứu',
  'Báo cáo nghiên cứu (súc tích, dẫn chứng), biến insight thành quyết định thiết kế, trình bày & kể chuyện (storytelling) để nghiên cứu tạo tác động.',
  [[
    `<span class="eyebrow">RMD301 · Chapter 8 · Lesson 8.1</span>
<h2>Reporting &amp; applying research</h2>
<h3>Research that nobody acts on is wasted</h3>
<p>The final skill is turning findings into <strong>influence</strong>. A great study that lands as a 60-page PDF nobody reads changes nothing.</p>
<ul>
<li><strong>Report tightly</strong> — lead with key findings and recommendations, back each with evidence (a quote, a clip, a number). Detail goes in an appendix.</li>
<li><strong>Insight to decision</strong> — every insight should point to an action. "Users miss the save button" (finding) → "make save persistent and labelled" (decision).</li>
<li><strong>Storytelling</strong> — a memorable user story or a short clip of someone struggling moves a team more than a bar chart. Make the user real to the people who build.</li>
<li><strong>Prioritise</strong> — frame findings by severity and effort so the team knows what to fix first.</li>
</ul>
<pre><code>Insight -> Decision:
  Finding:   "7 of 8 users never scrolled past the fold."
  Insight:   key actions below the fold are invisible.
  Decision:  move primary CTA above the fold; retest.
</code></pre>
<div class="callout"><span class="badge">Real example</span> Airbnb famously spread empathy by sharing a single guest&#39;s story — not a spreadsheet. A vivid narrative of one traveller&#39;s trust concerns did more to align the company than any metrics deck, and shaped review and photo features.</div>`,
    `<span class="eyebrow">RMD301 · Chương 8 · Bài 8.1</span>
<h2>Báo cáo &amp; ứng dụng nghiên cứu</h2>
<h3>Nghiên cứu không ai hành động theo là lãng phí</h3>
<p>Kỹ năng cuối là biến phát hiện thành <strong>ảnh hưởng</strong>. Một nghiên cứu tuyệt vời mà đọng lại thành file PDF 60 trang không ai đọc thì chẳng thay đổi gì.</p>
<ul>
<li><strong>Báo cáo gọn</strong> — mở đầu bằng phát hiện chính và khuyến nghị, mỗi cái kèm bằng chứng (trích dẫn, clip, con số). Chi tiết để phụ lục.</li>
<li><strong>Insight thành quyết định</strong> — mỗi insight phải chỉ tới một hành động. "Người dùng bỏ lỡ nút lưu" (phát hiện) → "làm nút lưu cố định và dán nhãn" (quyết định).</li>
<li><strong>Kể chuyện (storytelling)</strong> — một câu chuyện người dùng đáng nhớ hay đoạn clip ai đó vật lộn lay động nhóm hơn một biểu đồ cột. Làm người dùng trở nên có thật với người xây sản phẩm.</li>
<li><strong>Ưu tiên</strong> — sắp phát hiện theo mức nghiêm trọng và công sức để nhóm biết sửa gì trước.</li>
</ul>
<pre><code>Insight -> Quyết định:
  Phát hiện: "7/8 người dùng không cuộn qua khỏi nếp gấp."
  Insight:   hành động chính dưới nếp gấp bị vô hình.
  Quyết định: đưa CTA chính lên trên nếp gấp; thử lại.
</code></pre>
<div class="callout"><span class="badge">Ví dụ thật</span> Airbnb nổi tiếng lan toả sự thấu cảm bằng cách kể câu chuyện của một vị khách — không phải bảng tính. Một câu chuyện sống động về nỗi lo tin tưởng của một du khách gắn kết công ty hơn mọi bộ slide chỉ số, và định hình các tính năng đánh giá &amp; ảnh.</div>`,
  ]]);

const c8q = quiz('rmd301-quiz-8', 'Quiz 8 — Reporting & impact|||Quiz 8 — Báo cáo & tác động', [
  { id: 'q1', question: 'Một báo cáo nghiên cứu tốt nên?', options: ['Dài 60 trang, đủ mọi chi tiết đầu tiên', 'Mở đầu bằng phát hiện chính & khuyến nghị, kèm bằng chứng, chi tiết để phụ lục', 'Chỉ toàn số liệu, không lời', 'Không đưa khuyến nghị'], correctIndex: 1, explanation: 'Gọn, dẫn chứng, chi tiết ở phụ lục — để người ta hành động.' },
  { id: 'q2', question: '"Insight thành quyết định" nghĩa là?', options: ['Mỗi insight chỉ tới một hành động thiết kế cụ thể', 'Chỉ ghi lại rồi lưu trữ', 'Giữ bí mật với nhóm', 'Đợi khách hàng quyết'], correctIndex: 0, explanation: 'Nghiên cứu tạo tác động khi phát hiện dẫn tới hành động.' },
  { id: 'q3', question: 'Vì sao storytelling mạnh trong trình bày nghiên cứu?', options: ['Vì nó dài hơn', 'Câu chuyện/clip người dùng thật lay động nhóm hơn biểu đồ khô khan', 'Vì tránh được dữ liệu', 'Vì không cần bằng chứng'], correctIndex: 1, explanation: 'Kể chuyện làm người dùng "có thật", gắn kết & thúc đẩy hành động.' },
]);

const taiLieu = doc('rmd301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Hanington, IDEO, Creswell), tài liệu miễn phí (NN/g, IDEO), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">RMD301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn research methods for designers — from choosing a method to reporting insight — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for RMD301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.universalmethodsofdesign.com/" target="_blank" rel="noopener"><em>Universal Methods of Design</em> — Hanington &amp; Martin</a></li>
<li><a href="https://www.designkit.org/resources/1" target="_blank" rel="noopener">IDEO — <em>The Field Guide to Human-Centered Design</em> (free)</a></li>
<li><a href="https://us.sagepub.com/en-us/nam/research-design/book270550" target="_blank" rel="noopener"><em>Research Design</em> — Creswell &amp; Creswell</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.nngroup.com/topic/research-methods/" target="_blank" rel="noopener">Nielsen Norman Group — UX research methods</a></li>
<li><a href="https://www.designkit.org/methods.html" target="_blank" rel="noopener">IDEO Design Kit — methods library</a></li>
<li><a href="https://www.interaction-design.org/literature/topics/design-research" target="_blank" rel="noopener">Interaction Design Foundation — design research</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@NNgroup" target="_blank" rel="noopener">Nielsen Norman Group</a> — short, evidence-based UX research videos</li>
<li><a href="https://www.youtube.com/@AJSmartVideo" target="_blank" rel="noopener">AJ&amp;Smart</a> — practical design &amp; research sprints</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/figjam/" target="_blank" rel="noopener">FigJam</a> — affinity diagrams, journey maps, synthesis boards</li>
<li><a href="https://www.maze.co/" target="_blank" rel="noopener">Maze</a> — remote usability tests &amp; surveys</li>
<li><a href="https://www.optimalworkshop.com/" target="_blank" rel="noopener">Optimal Workshop</a> — card sorting &amp; tree testing</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — why designers research, qualitative vs quantitative, matching method to question.</li>
<li><strong>Gather</strong> — run an interview and an observation; write neutral, non-leading questions.</li>
<li><strong>Synthesise</strong> — turn notes into an affinity diagram, a persona and a journey map.</li>
<li><strong>Apply</strong> — test with 5 users, report tightly, and turn each insight into a decision.</li>
</ol></div>`,
    `<span class="eyebrow">RMD301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học phương pháp nghiên cứu cho nhà thiết kế — từ chọn phương pháp tới báo cáo insight — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của RMD301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.universalmethodsofdesign.com/" target="_blank" rel="noopener"><em>Universal Methods of Design</em> — Hanington &amp; Martin</a></li>
<li><a href="https://www.designkit.org/resources/1" target="_blank" rel="noopener">IDEO — <em>The Field Guide to Human-Centered Design</em> (miễn phí)</a></li>
<li><a href="https://us.sagepub.com/en-us/nam/research-design/book270550" target="_blank" rel="noopener"><em>Research Design</em> — Creswell &amp; Creswell</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.nngroup.com/topic/research-methods/" target="_blank" rel="noopener">Nielsen Norman Group — phương pháp nghiên cứu UX</a></li>
<li><a href="https://www.designkit.org/methods.html" target="_blank" rel="noopener">IDEO Design Kit — thư viện phương pháp</a></li>
<li><a href="https://www.interaction-design.org/literature/topics/design-research" target="_blank" rel="noopener">Interaction Design Foundation — nghiên cứu thiết kế</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NNgroup" target="_blank" rel="noopener">Nielsen Norman Group</a> — video nghiên cứu UX ngắn, dựa bằng chứng</li>
<li><a href="https://www.youtube.com/@AJSmartVideo" target="_blank" rel="noopener">AJ&amp;Smart</a> — sprint thiết kế &amp; nghiên cứu thực tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/figjam/" target="_blank" rel="noopener">FigJam</a> — affinity diagram, journey map, bảng tổng hợp</li>
<li><a href="https://www.maze.co/" target="_blank" rel="noopener">Maze</a> — kiểm thử khả dụng từ xa &amp; khảo sát</li>
<li><a href="https://www.optimalworkshop.com/" target="_blank" rel="noopener">Optimal Workshop</a> — card sorting &amp; tree testing</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vì sao nhà thiết kế nghiên cứu, định tính vs định lượng, khớp phương pháp với câu hỏi.</li>
<li><strong>Thu thập</strong> — làm một buổi phỏng vấn và một buổi quan sát; viết câu hỏi trung lập, không dẫn dắt.</li>
<li><strong>Tổng hợp</strong> — biến ghi chú thành affinity diagram, persona và journey map.</li>
<li><strong>Ứng dụng</strong> — kiểm thử với 5 người, báo cáo gọn, và biến mỗi insight thành quyết định.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'RMD301',
    slug: 'rmd301-reseach-methods-for-designers',
    title: 'Research Methods For Designers',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/RMD301.webp',
    shortDescription: 'Why designers research and how — qual vs quant, user research, observation & ethnography, synthesis (personas, journey maps), usability testing, ethics & sampling, insight to decision. Bilingual, with examples & quizzes.|||Vì sao nhà thiết kế nghiên cứu và làm thế nào — định tính vs định lượng, nghiên cứu người dùng, quan sát & dân tộc học, tổng hợp (persona, journey map), kiểm thử khả dụng, đạo đức & lấy mẫu, insight thành quyết định. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>RMD301 — Research Methods For Designers</strong> (Phương pháp nghiên cứu cho nhà thiết kế, kỳ 3) dạy cách <strong>thiết kế dựa trên bằng chứng</strong>. Từ <strong>vì sao nghiên cứu</strong> &amp; <strong>định tính vs định lượng</strong> → <strong>nghiên cứu người dùng</strong> (phỏng vấn, khảo sát, contextual inquiry) → <strong>quan sát &amp; dân tộc học</strong> → <strong>phân tích &amp; tổng hợp</strong> (affinity, persona, journey map) → <strong>nghiên cứu khả dụng</strong> (usability, A/B, card sorting) → <strong>đạo đức &amp; lấy mẫu</strong> → <strong>báo cáo &amp; biến insight thành quyết định</strong>. Bám sách chuẩn (Hanington &amp; Martin, IDEO HCD, Creswell), song ngữ, có ví dụ nghiên cứu thiết kế thật và quiz mỗi chương.',
    whatYouLearn: 'Vì sao & khi nào nghiên cứu; evidence-based design; định tính/định lượng/mixed methods; phỏng vấn không dẫn dắt, khảo sát, contextual inquiry; quan sát, ethnography, diary study, shadowing; affinity diagram, thematic analysis, persona, journey map; usability testing (5 người), A/B, card sorting, heuristic evaluation; đạo đức (consent, ẩn danh), lấy mẫu & thiên lệch; báo cáo gọn, insight → quyết định, storytelling.',
    requirements: 'Không cần nền kỹ thuật. Nên có sổ tay/công cụ vẽ sơ đồ (FigJam) để thực hành tổng hợp. Xem điều kiện tiên quyết của ngành Thiết kế mỹ thuật số trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách chuẩn, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao nghiên cứu, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Nghiên cứu trong thiết kế|||Chapter 1 — Research in design', description: 'Design research, evidence-based design.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Định tính vs định lượng|||Chapter 2 — Qual vs quant', description: 'Qualitative, quantitative, mixed methods.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nghiên cứu người dùng|||Chapter 3 — User research', description: 'Phỏng vấn, khảo sát, contextual inquiry.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quan sát & dân tộc học|||Chapter 4 — Observation & ethnography', description: 'Observation, ethnography, diary, shadowing.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân tích & tổng hợp|||Chapter 5 — Analysis & synthesis', description: 'Affinity, thematic, persona, journey map.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nghiên cứu khả dụng|||Chapter 6 — Usability research', description: 'Usability testing, A/B, card sorting, heuristic.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đạo đức & lấy mẫu|||Chapter 7 — Ethics & sampling', description: 'Consent, ẩn danh, lấy mẫu, thiên lệch.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo & ứng dụng|||Chapter 8 — Reporting & impact', description: 'Report, insight→decision, storytelling.', lessons: [c8, c8q] },
  ],
};
