/**
 * ENM402 — Business English - Level 2. Giáo trình tham khảo (KHÔNG upload PDF):
 * Market Leader Upper Intermediate (Pearson), Business Advantage (Cambridge),
 * Business Result (OUP). Nối tiếp ENM302 (Level 1), CAO HƠN: đàm phán, thuyết
 * trình, báo cáo/đề xuất, marketing, tài chính/số liệu, lãnh đạo, đa văn hoá,
 * phỏng vấn việc làm. Song ngữ + từ vựng + mẫu câu + hội thoại + ngữ pháp/kỹ
 * năng nâng cao. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('enm402-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Market Leader, Business Advantage, Business Result), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ENM402 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything for advanced Business English — negotiation, presentations, reports, marketing, finance and interviews — in one place. Below are widely-used reference textbooks and free, legal resources; check with your instructor for the exact required text.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>Market Leader Upper Intermediate</em> (Pearson) — the standard business-English course this level builds toward.</li>
<li><em>Business Advantage</em> (Cambridge University Press) — case-study driven, strong on cross-cultural communication.</li>
<li><em>Business Result</em> (Oxford University Press) — practical workplace communication tasks.</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.bbc.co.uk/learningenglish/business_english" target="_blank" rel="noopener">BBC Learning English — Business English</a></li>
<li><a href="https://dictionary.cambridge.org/dictionary/english/business-english" target="_blank" rel="noopener">Cambridge Dictionary — Business English</a></li>
<li><a href="https://www.oxfordlearnersdictionaries.com/" target="_blank" rel="noopener">Oxford Learner's Dictionaries</a> — check business collocations and register</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BusinessEnglishPod" target="_blank" rel="noopener">Business English Pod</a> — negotiation, meetings, presentations</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — professional English &amp; interview skills</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — check register and tone in emails/reports</li>
<li><a href="https://www.linguee.com/" target="_blank" rel="noopener">Linguee</a> — real bilingual usage examples for business terms</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Vocabulary first</strong> — learn each chapter's terms with their collocations, not in isolation.</li>
<li><strong>Read the dialogue aloud</strong> — business English is spoken under time pressure; fluency matters as much as grammar.</li>
<li><strong>Rewrite one real email/report of your own</strong> using the chapter's language.</li>
<li><strong>Mock-practice</strong> — negotiate, present or interview with a partner using the target phrases.</li>
</ol></div>`,
    `<span class="eyebrow">ENM402 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho Tiếng Anh thương mại nâng cao — đàm phán, thuyết trình, báo cáo, marketing, tài chính và phỏng vấn — gom về một chỗ. Bên dưới là các giáo trình tham khảo phổ biến và nguồn miễn phí, hợp pháp; hãy kiểm tra với giảng viên để biết giáo trình bắt buộc chính xác.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>Market Leader Upper Intermediate</em> (Pearson) — giáo trình thương mại chuẩn mà cấp độ này hướng tới.</li>
<li><em>Business Advantage</em> (Cambridge University Press) — theo tình huống thực tế, mạnh về giao tiếp đa văn hoá.</li>
<li><em>Business Result</em> (Oxford University Press) — bài tập giao tiếp công việc thực dụng.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.bbc.co.uk/learningenglish/business_english" target="_blank" rel="noopener">BBC Learning English — Business English</a></li>
<li><a href="https://dictionary.cambridge.org/dictionary/english/business-english" target="_blank" rel="noopener">Cambridge Dictionary — Business English</a></li>
<li><a href="https://www.oxfordlearnersdictionaries.com/" target="_blank" rel="noopener">Oxford Learner's Dictionaries</a> — tra collocation và văn phong thương mại</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BusinessEnglishPod" target="_blank" rel="noopener">Business English Pod</a> — đàm phán, họp, thuyết trình</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — tiếng Anh chuyên nghiệp &amp; kỹ năng phỏng vấn</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.grammarly.com/" target="_blank" rel="noopener">Grammarly</a> — kiểm văn phong &amp; sắc thái trong email/báo cáo</li>
<li><a href="https://www.linguee.com/" target="_blank" rel="noopener">Linguee</a> — ví dụ song ngữ thật cho thuật ngữ thương mại</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Từ vựng trước</strong> — học theo collocation của từng chương, không học từ lẻ.</li>
<li><strong>Đọc hội thoại thành tiếng</strong> — tiếng Anh thương mại là nói dưới áp lực thời gian; sự trôi chảy quan trọng không kém ngữ pháp.</li>
<li><strong>Viết lại một email/báo cáo thật của bạn</strong> bằng ngôn ngữ của chương đó.</li>
<li><strong>Luyện thử</strong> — đàm phán, thuyết trình hoặc phỏng vấn với một người bạn bằng các cụm từ mục tiêu.</li>
</ol></div>`,
  ]]);

const intro = doc('enm402-0-1-overview', 'Course overview: Business English - Level 2|||Tổng quan: Tiếng Anh thương mại - Cấp độ 2',
  'Nối tiếp Level 1: từ giao tiếp cơ bản lên các tình huống thương mại thực tế và có áp lực cao hơn — đàm phán, thuyết trình, báo cáo, marketing, tài chính, lãnh đạo, đa văn hoá, phỏng vấn.',
  [[
    `<span class="eyebrow">ENM402 · Lesson 0.1 · Overview</span>
<h2>Business English — Level 2</h2>
<p class="lead">This course builds directly on <strong>Level 1 (ENM302)</strong>. Where Level 1 covered everyday workplace English — small talk, emails, phone calls — Level 2 moves into <strong>higher-stakes, real-world business situations</strong>: negotiating a deal, presenting to a room, writing a formal report, reading marketing copy critically, discussing numbers with confidence, leading a team conversation, working across cultures, and landing a job.</p>
<h3>What's different from Level 1</h3>
<ul>
<li><strong>Register goes up</strong> — more formal, more precise, more persuasive language.</li>
<li><strong>Stakes go up</strong> — the language of disagreement, diplomacy and persuasion matters as much as vocabulary.</li>
<li><strong>Output goes up</strong> — you don't just recognize the language, you produce it under pressure (negotiating, presenting, interviewing).</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<p>Negotiations &amp; bargaining → Presentations &amp; public speaking → Business reports &amp; proposals → Marketing &amp; advertising English → Finance &amp; numbers in business → Leadership &amp; management communication → Cross-cultural business &amp; etiquette → Job interviews &amp; career English.</p>
<div class="callout"><span class="badge">How to use this course</span> Each chapter gives you: a vocabulary table with real collocations, sample sentences you can reuse verbatim, a short dialogue showing the language in context, and an advanced grammar/skill note that native speakers use without thinking about it. Finish each chapter with the quiz.</div>`,
    `<span class="eyebrow">ENM402 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Anh thương mại — Cấp độ 2</h2>
<p class="lead">Môn này nối tiếp trực tiếp <strong>Cấp độ 1 (ENM302)</strong>. Nếu Cấp độ 1 dạy tiếng Anh công việc hàng ngày — chào hỏi, email, gọi điện — thì Cấp độ 2 bước vào <strong>các tình huống thương mại thực tế, áp lực cao hơn</strong>: đàm phán một hợp đồng, thuyết trình trước một phòng họp, viết báo cáo chính thức, đọc hiểu ngôn ngữ marketing một cách có phê phán, nói về số liệu một cách tự tin, dẫn dắt một cuộc trao đổi trong nhóm, làm việc xuyên văn hoá, và giành được một công việc.</p>
<h3>Khác Cấp độ 1 ở đâu</h3>
<ul>
<li><strong>Văn phong cao hơn</strong> — ngôn ngữ trang trọng, chính xác và có tính thuyết phục hơn.</li>
<li><strong>Rủi ro cao hơn</strong> — ngôn ngữ bất đồng, ngoại giao và thuyết phục quan trọng không kém từ vựng.</li>
<li><strong>Đầu ra cao hơn</strong> — bạn không chỉ nhận ra ngôn ngữ, mà phải TẠO RA nó dưới áp lực (đàm phán, thuyết trình, phỏng vấn).</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<p>Đàm phán &amp; mặc cả → Thuyết trình &amp; nói trước công chúng → Báo cáo &amp; đề xuất kinh doanh → Ngôn ngữ marketing &amp; quảng cáo → Tài chính &amp; số liệu trong kinh doanh → Giao tiếp lãnh đạo &amp; quản lý → Kinh doanh &amp; ứng xử đa văn hoá → Phỏng vấn &amp; tiếng Anh sự nghiệp.</p>
<div class="callout"><span class="badge">Cách học môn này</span> Mỗi chương có: bảng từ vựng với collocation thật, mẫu câu bạn có thể dùng lại nguyên văn, một đoạn hội thoại đặt ngôn ngữ vào tình huống, và một ghi chú ngữ pháp/kỹ năng nâng cao mà người bản ngữ dùng mà không cần suy nghĩ. Kết thúc mỗi chương bằng quiz.</div>`,
  ]]);

// ---------- Chapter 1 — Negotiations & bargaining ----------
const c1 = doc('enm402-1-1-negotiations', '1.1 — Negotiations & bargaining|||1.1 — Đàm phán & mặc cả',
  'Từ vựng đàm phán (leverage, concession, bottom line...), mẫu câu đề nghị/nhượng bộ, hội thoại mua-bán, ngữ pháp hedging & điều kiện ngoại giao.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 1 · Lesson 1.1</span>
<h2>Negotiations &amp; bargaining</h2>
<h3>Key vocabulary</h3>
<pre><code>leverage (n.)      - bargaining power         "We have leverage because we're their biggest client."
concession (n.)    - something given up       "They made a concession on the delivery date."
counteroffer (n.)  - a return offer           "We'll send a counteroffer by Friday."
deadlock (n.)      - a stuck negotiation      "Talks reached a deadlock over price."
win-win (adj.)     - good for both sides       "Let's find a win-win solution."
walk away (phr.v.) - end talks without a deal "We're prepared to walk away if terms don't improve."
bottom line (n.)   - the minimum acceptable   "Our bottom line is a 10% discount, no less."
trade-off (n.)     - give one thing for other "It's a trade-off between price and speed."
red line (n.)      - a non-negotiable point   "Payment terms are a red line for us."
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"We're prepared to offer a 5% discount if you can commit to a 12-month contract."</li>
<li>"That's outside our budget — is there any flexibility on the price?"</li>
<li>"Let's find some middle ground that works for both of us."</li>
<li>"Before we go further, can we agree on the non-negotiables?"</li>
</ul>
<h3>Dialogue — closing a supplier deal</h3>
<pre><code>Buyer:   If you could bring the unit price down to $8, we'd sign today.
Seller:  I can't go below $8.50, but I could throw in free shipping.
Buyer:   That works for us, as long as delivery stays under two weeks.
Seller:  Agreed. Let's put that in writing.
</code></pre>
<h3>Advanced grammar/skill — hedging &amp; diplomatic conditionals</h3>
<p>Native negotiators rarely say things flatly. They soften proposals with <strong>hedging language</strong> and <strong>conditional structures</strong> so a "no" never sounds final:</p>
<ul>
<li><strong>If + could/would:</strong> "If you could match that price, we'd sign immediately." (softer than "match that price and we'll sign")</li>
<li><strong>Modal downtoners:</strong> "That might be a bit tight for us" instead of "No, that's too tight."</li>
<li><strong>Distancing verbs:</strong> "I'm afraid we can't go that low" — "I'm afraid" signals regret, not confrontation.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> In negotiation, HOW you say no keeps the relationship alive for the next round. Hedged language leaves room to move without losing face on either side.</div>`,
    `<span class="eyebrow">ENM402 · Chương 1 · Bài 1.1</span>
<h2>Đàm phán &amp; mặc cả</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>leverage (n.)      - lợi thế đàm phán         "Chúng ta có lợi thế vì là khách lớn nhất của họ."
concession (n.)    - điều nhượng bộ           "Họ nhượng bộ về ngày giao hàng."
counteroffer (n.)  - đề nghị đáp lại          "Chúng tôi sẽ gửi đề nghị đáp lại trước thứ Sáu."
deadlock (n.)      - bế tắc trong đàm phán    "Đàm phán bế tắc vì giá."
win-win (adj.)     - hai bên cùng có lợi      "Hãy tìm giải pháp hai bên cùng có lợi."
walk away (phr.v.) - dừng đàm phán, bỏ đi     "Chúng tôi sẵn sàng bỏ đi nếu điều khoản không cải thiện."
bottom line (n.)   - mức chấp nhận thấp nhất  "Mức thấp nhất của chúng tôi là giảm 10%, không hơn."
trade-off (n.)     - đánh đổi                 "Đó là đánh đổi giữa giá và tốc độ."
red line (n.)      - giới hạn không thương lượng "Điều khoản thanh toán là giới hạn không thương lượng với chúng tôi."
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Chúng tôi sẵn sàng giảm 5% nếu bạn cam kết hợp đồng 12 tháng." (We're prepared to offer a 5% discount if you can commit to a 12-month contract.)</li>
<li>"Mức đó vượt ngân sách của chúng tôi — có thể linh hoạt về giá không?"</li>
<li>"Hãy tìm một điểm chung có lợi cho cả hai bên."</li>
<li>"Trước khi đi xa hơn, ta có thể thống nhất những điều không thể nhượng bộ không?"</li>
</ul>
<h3>Hội thoại — chốt hợp đồng với nhà cung cấp</h3>
<pre><code>Buyer:   Nếu bạn có thể hạ giá đơn vị xuống 8 đô, chúng tôi ký ngay hôm nay.
Seller:  Tôi không thể xuống dưới 8.5 đô, nhưng có thể tặng miễn phí vận chuyển.
Buyer:   Vậy được, miễn là giao hàng dưới hai tuần.
Seller:  Đồng ý. Hãy ghi vào văn bản.
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — giảm nhẹ (hedging) &amp; câu điều kiện ngoại giao</h3>
<p>Người đàm phán bản ngữ hiếm khi nói thẳng. Họ làm dịu đề nghị bằng <strong>ngôn ngữ giảm nhẹ (hedging)</strong> và <strong>câu điều kiện</strong> để một câu "không" không bao giờ nghe dứt khoát:</p>
<ul>
<li><strong>If + could/would:</strong> "Nếu bạn có thể khớp mức giá đó, chúng tôi sẽ ký ngay." — dịu hơn "khớp giá đó rồi chúng tôi ký".</li>
<li><strong>Modal làm dịu:</strong> "Mức đó có thể hơi eo hẹp với chúng tôi" thay vì "Không, mức đó quá eo hẹp."</li>
<li><strong>Động từ giữ khoảng cách:</strong> "Tôi e là chúng tôi không thể xuống thấp vậy" — "I'm afraid" báo hiệu tiếc nuối, không phải đối đầu.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Trong đàm phán, CÁCH bạn nói không giữ cho mối quan hệ sống cho vòng sau. Ngôn ngữ giảm nhẹ để lại chỗ để lùi mà không bên nào mất mặt.</div>`,
  ]]);

const c1q = quiz('enm402-quiz-1', 'Quiz 1 — Negotiations & bargaining|||Quiz 1 — Đàm phán & mặc cả', [
  { id: 'q1', question: 'Từ nào chỉ "mức chấp nhận thấp nhất" trong đàm phán?', options: ['leverage', 'bottom line', 'counteroffer', 'deadlock'], correctIndex: 1, explanation: '"Bottom line" là mức thấp nhất một bên chấp nhận được.' },
  { id: 'q2', question: 'Câu nào dùng ngôn ngữ giảm nhẹ (hedging) đúng cách để từ chối?', options: ['No, that price is too low.', 'I\'m afraid we can\'t go that low.', 'That price is wrong.', 'We refuse that price.'], correctIndex: 1, explanation: '"I\'m afraid we can\'t..." làm dịu lời từ chối, giữ quan hệ đàm phán.' },
  { id: 'q3', question: 'Điểm không thể nhượng bộ trong đàm phán gọi là gì?', options: ['trade-off', 'concession', 'red line', 'win-win'], correctIndex: 2, explanation: '"Red line" là giới hạn cứng, không thương lượng.' },
]);

// ---------- Chapter 2 — Presentations & public speaking ----------
const c2 = doc('enm402-2-1-presentations', '2.1 — Presentations & public speaking|||2.1 — Thuyết trình & nói trước công chúng',
  'Từ vựng thuyết trình (signposting, elevator pitch, call to action...), mẫu câu dẫn dắt, hội thoại Q&A, ngữ pháp signposting & passive voice trang trọng.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 2 · Lesson 2.1</span>
<h2>Presentations &amp; public speaking</h2>
<h3>Key vocabulary</h3>
<pre><code>agenda (n.)          - the plan for a meeting     "Let's stick to today's agenda."
take-away (n.)       - the main point to remember "The key take-away is that costs fell 8%."
signposting language - phrases marking structure  "Moving on to the next point..."
elevator pitch (n.)  - a very short pitch          "Give me your elevator pitch in 30 seconds."
handout (n.)         - printed material for the audience
Q&amp;A session (n.)      - question &amp; answer time      "We'll open the floor for a Q&amp;A."
visual aid (n.)      - slide/chart/prop            "Use a visual aid to show the trend."
filler word (n.)     - "um", "like", "you know"    "Cut filler words to sound more confident."
call to action (n.)  - what you want the audience to do next
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"Let's move on to the next point."</li>
<li>"To sum up, there are three things I'd like you to remember."</li>
<li>"I'd like to draw your attention to this chart."</li>
<li>"That's a great question — let me address it."</li>
</ul>
<h3>Dialogue — fielding a tough question</h3>
<pre><code>Audience:  How confident are you in that Q3 forecast?
Speaker:   Fair question. The forecast was built on the data available in
           July, so I'd flag it as directional rather than final. Happy
           to follow up once next month's numbers land.
</code></pre>
<h3>Advanced grammar/skill — signposting &amp; the passive voice</h3>
<p><strong>Signposting language</strong> tells the audience where they are in your talk without them getting lost: "First... / Moving on... / That brings me to... / To wrap up...". Skilled speakers also switch to the <strong>passive voice</strong> for formal, fact-first statements that hide the doer when it doesn't matter who did it:</p>
<ul>
<li>"The data was collected over six months." (not "We collected the data" — the method matters more than who did it)</li>
<li>"Three options were considered before this one was chosen."</li>
</ul>
<div class="callout"><span class="badge">Delivery tip</span> Pause after signposting phrases — the half-second silence is what makes the structure land, not the words themselves.</div>`,
    `<span class="eyebrow">ENM402 · Chương 2 · Bài 2.1</span>
<h2>Thuyết trình &amp; nói trước công chúng</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>agenda (n.)          - chương trình họp            "Hãy bám theo chương trình hôm nay."
take-away (n.)       - điểm chính cần nhớ           "Điều cần nhớ là chi phí giảm 8%."
signposting language - cụm từ đánh dấu cấu trúc bài  "Chuyển sang điểm tiếp theo..."
elevator pitch (n.)  - bài giới thiệu rất ngắn      "Hãy trình bày trong 30 giây."
handout (n.)         - tài liệu in phát cho khán giả
Q&amp;A session (n.)      - phần hỏi &amp; đáp             "Chúng ta sẽ mở phần hỏi đáp."
visual aid (n.)      - slide/biểu đồ/vật minh hoạ   "Dùng biểu đồ để cho thấy xu hướng."
filler word (n.)     - từ đệm "ừm", "kiểu như"       "Bỏ từ đệm để nghe tự tin hơn."
call to action (n.)  - điều bạn muốn khán giả làm tiếp theo
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Hãy chuyển sang điểm tiếp theo." (Let's move on to the next point.)</li>
<li>"Tổng kết lại, có ba điều tôi muốn các bạn nhớ."</li>
<li>"Tôi muốn các bạn chú ý đến biểu đồ này."</li>
<li>"Đó là một câu hỏi hay — để tôi trả lời."</li>
</ul>
<h3>Hội thoại — xử lý câu hỏi khó</h3>
<pre><code>Audience:  Bạn tự tin bao nhiêu về dự báo Quý 3 đó?
Speaker:   Câu hỏi hợp lý. Dự báo được xây trên dữ liệu có tới tháng 7,
           nên tôi coi nó là định hướng chứ chưa phải cuối cùng. Rất sẵn
           lòng cập nhật khi số liệu tháng sau về.
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — signposting &amp; thể bị động</h3>
<p><strong>Ngôn ngữ signposting</strong> cho khán giả biết họ đang ở đâu trong bài nói mà không bị lạc: "Trước hết... / Chuyển sang... / Điều đó dẫn tôi tới... / Để tổng kết...". Người nói giỏi cũng chuyển sang <strong>thể bị động (passive voice)</strong> cho các câu trang trọng, ưu tiên sự kiện, ẩn đi ai làm việc đó khi điều đó không quan trọng:</p>
<ul>
<li>"Dữ liệu được thu thập trong sáu tháng." (không phải "Chúng tôi thu thập dữ liệu" — cách làm quan trọng hơn ai làm.)</li>
<li>"Ba phương án đã được xem xét trước khi phương án này được chọn."</li>
</ul>
<div class="callout"><span class="badge">Mẹo trình bày</span> Ngừng lại sau các cụm signposting — nửa giây im lặng đó mới là thứ khiến cấu trúc "chạm" khán giả, không phải từ ngữ.</div>`,
  ]]);

const c2q = quiz('enm402-quiz-2', 'Quiz 2 — Presentations & public speaking|||Quiz 2 — Thuyết trình & nói trước công chúng', [
  { id: 'q1', question: 'Cụm nào là ngôn ngữ signposting đúng để mở đầu tổng kết?', options: ['That works for us.', 'To sum up...', 'I\'m afraid we can\'t.', 'Let\'s walk away.'], correctIndex: 1, explanation: '"To sum up..." báo hiệu phần tổng kết bài nói.' },
  { id: 'q2', question: 'Câu nào dùng ĐÚNG thể bị động trang trọng?', options: ['We collected the data ourselves.', 'The data was collected over six months.', 'Someone collected data.', 'Data collecting we did.'], correctIndex: 1, explanation: 'Thể bị động ẩn chủ thể, nhấn vào sự kiện/phương pháp.' },
  { id: 'q3', question: '"Filler word" trong thuyết trình nghĩa là gì?', options: ['Từ trong slide', 'Từ đệm như "um", "like"', 'Câu hỏi khán giả', 'Tiêu đề slide'], correctIndex: 1, explanation: 'Filler word là từ đệm không mang nghĩa, nên loại bỏ để nói tự tin hơn.' },
]);

// ---------- Chapter 3 — Business reports & proposals ----------
const c3 = doc('enm402-3-1-reports-proposals', '3.1 — Business reports & proposals|||3.1 — Báo cáo & đề xuất kinh doanh',
  'Từ vựng báo cáo (executive summary, findings, feasibility...), mẫu câu mở đầu/kết luận báo cáo, hội thoại review, ngữ pháp nominalization & linking words.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 3 · Lesson 3.1</span>
<h2>Business reports &amp; proposals</h2>
<h3>Key vocabulary</h3>
<pre><code>executive summary (n.) - a one-page overview up top   "Busy readers only read the executive summary."
findings (n.)           - what the research showed     "Our findings show a 15% drop in retention."
recommendation (n.)     - the suggested action          "Our recommendation is to delay the launch."
appendix (n.)           - extra material at the end     "See Appendix B for the full dataset."
feasibility (n.)        - whether something is workable "A feasibility study came back positive."
stakeholder (n.)        - anyone affected by the decision
timeline (n.)           - the schedule of steps
budget breakdown (n.)   - costs itemized by category
risk assessment (n.)    - the identified risks &amp; their impact
KPI (n.)                - key performance indicator
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"This report outlines the findings of our Q2 customer-satisfaction survey."</li>
<li>"Based on the findings, we recommend a phased rollout."</li>
<li>"The main risk is a delay in supplier delivery, which could push the timeline back two weeks."</li>
<li>"Furthermore, the budget breakdown in Appendix A confirms the project stays under $50,000."</li>
</ul>
<h3>Dialogue — report review meeting</h3>
<pre><code>Manager:  The executive summary is strong. What about the risk section?
Analyst:  We flagged supplier delay as the top risk; the mitigation is a
          backup vendor already on standby.
Manager:  Good. Add the mitigation cost to the budget breakdown before
          we circulate this.
</code></pre>
<h3>Advanced grammar/skill — nominalization &amp; linking words</h3>
<p>Formal reports favor <strong>nominalization</strong> — turning verbs/adjectives into nouns — for a denser, more objective tone: "The team increased sales" → "There was an increase in sales." "We decided quickly" → "The decision was made quickly." Reports also lean on <strong>linking words</strong> to show logic: <em>furthermore, however, consequently, in contrast, as a result</em>.</p>
<div class="callout"><span class="badge">Register check</span> "We think this is risky" is spoken register. The report register is "This represents a significant risk" — nominalized, no personal pronoun, more authoritative.</div>`,
    `<span class="eyebrow">ENM402 · Chương 3 · Bài 3.1</span>
<h2>Báo cáo &amp; đề xuất kinh doanh</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>executive summary (n.) - tóm tắt một trang ở đầu       "Người bận chỉ đọc phần tóm tắt điều hành."
findings (n.)           - kết quả nghiên cứu cho thấy   "Kết quả cho thấy tỉ lệ giữ khách giảm 15%."
recommendation (n.)     - hành động được đề xuất        "Đề xuất của chúng tôi là hoãn ra mắt."
appendix (n.)           - phụ lục cuối báo cáo          "Xem Phụ lục B để có bộ dữ liệu đầy đủ."
feasibility (n.)        - tính khả thi                  "Nghiên cứu khả thi cho kết quả tích cực."
stakeholder (n.)        - bên liên quan chịu ảnh hưởng
timeline (n.)           - lịch trình các bước
budget breakdown (n.)   - chi phí chia theo mục
risk assessment (n.)    - đánh giá rủi ro &amp; tác động
KPI (n.)                - chỉ số hiệu suất chính
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Báo cáo này trình bày kết quả khảo sát hài lòng khách hàng Quý 2." (This report outlines the findings of our Q2 customer-satisfaction survey.)</li>
<li>"Dựa trên kết quả, chúng tôi đề xuất triển khai theo từng giai đoạn."</li>
<li>"Rủi ro chính là chậm giao hàng từ nhà cung cấp, có thể đẩy lịch trình lùi hai tuần."</li>
<li>"Hơn nữa, phần chi phí ở Phụ lục A xác nhận dự án vẫn dưới 50.000 đô."</li>
</ul>
<h3>Hội thoại — họp rà soát báo cáo</h3>
<pre><code>Manager:  Phần tóm tắt điều hành tốt. Còn phần rủi ro thì sao?
Analyst:  Chúng tôi đánh dấu chậm giao hàng là rủi ro hàng đầu; biện pháp
          giảm thiểu là đã có nhà cung cấp dự phòng sẵn sàng.
Manager:  Tốt. Thêm chi phí biện pháp giảm thiểu vào phần chi phí trước
          khi ta gửi báo cáo này đi.
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — danh hoá (nominalization) &amp; từ nối</h3>
<p>Báo cáo trang trọng ưu tiên <strong>danh hoá (nominalization)</strong> — biến động từ/tính từ thành danh từ — để có văn phong đặc, khách quan hơn: "Nhóm đã tăng doanh số" → "Đã có một sự tăng trong doanh số." "Chúng tôi quyết định nhanh" → "Quyết định đã được đưa ra nhanh chóng." Báo cáo cũng dựa vào <strong>từ nối</strong> để thể hiện logic: <em>furthermore (hơn nữa), however (tuy nhiên), consequently (do đó), in contrast (ngược lại), as a result (kết quả là)</em>.</p>
<div class="callout"><span class="badge">Kiểm văn phong</span> "Chúng tôi nghĩ điều này rủi ro" là văn phong nói. Văn phong báo cáo là "Điều này đại diện cho một rủi ro đáng kể" — danh hoá, không đại từ nhân xưng, có sức nặng hơn.</div>`,
  ]]);

const c3q = quiz('enm402-quiz-3', 'Quiz 3 — Business reports & proposals|||Quiz 3 — Báo cáo & đề xuất kinh doanh', [
  { id: 'q1', question: 'Phần nào của báo cáo mà "người bận chỉ đọc"?', options: ['Appendix', 'Executive summary', 'Risk assessment', 'Timeline'], correctIndex: 1, explanation: 'Executive summary là tóm tắt một trang, nhiều người chỉ đọc phần này.' },
  { id: 'q2', question: 'Câu nào là ví dụ ĐÚNG của nominalization (danh hoá)?', options: ['We decided quickly.', 'The decision was made quickly.', 'Deciding is quick.', 'We are deciding.'], correctIndex: 1, explanation: '"The decision" là danh từ hoá từ động từ "decide" — văn phong báo cáo.' },
  { id: 'q3', question: 'Từ nối nào diễn đạt "kết quả là"?', options: ['However', 'In contrast', 'As a result', 'Furthermore'], correctIndex: 2, explanation: '"As a result" nghĩa là "kết quả là", chỉ quan hệ nhân-quả.' },
]);

// ---------- Chapter 4 — Marketing & advertising English ----------
const c4 = doc('enm402-4-1-marketing', '4.1 — Marketing & advertising English|||4.1 — Ngôn ngữ marketing & quảng cáo',
  'Từ vựng marketing (USP, CTA, target audience...), mẫu câu quảng cáo, hội thoại brainstorm nhóm marketing, ngữ pháp mệnh lệnh & so sánh trong quảng cáo.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 4 · Lesson 4.1</span>
<h2>Marketing &amp; advertising English</h2>
<h3>Key vocabulary</h3>
<pre><code>brand awareness (n.) - how well people recognize a brand
target audience (n.) - the specific group you're marketing to
tagline (n.)          - a short memorable slogan       "Just Do It" is Nike's tagline.
CTA (n.)               - call-to-action                "Sign up today" is a strong CTA.
USP (n.)               - unique selling point           "Our USP is same-day delivery."
viral campaign (n.)    - a campaign that spreads fast
market segment (n.)    - a defined slice of the market
conversion rate (n.)   - % of visitors who take action
influencer (n.)        - someone with an engaged audience who promotes for you
brand loyalty (n.)     - customers who keep choosing your brand
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"Our USP is that we deliver same-day, nationwide."</li>
<li>"The campaign boosted brand awareness by 22% among 18-34 year-olds."</li>
<li>"Add a clearer CTA — right now visitors don't know what to click."</li>
<li>"This creative tests well with the 25-34 market segment."</li>
</ul>
<h3>Dialogue — marketing team brainstorm</h3>
<pre><code>Lead:      What's our angle for the new campaign?
Copywriter: Something like "Discover the difference" — speed as the USP.
Lead:      I like it, but let's A/B test the CTA. "Try it free" might
           convert better than "Discover the difference."
</code></pre>
<h3>Advanced grammar/skill — the imperative &amp; persuasive comparatives</h3>
<p>Ad copy leans on the <strong>imperative mood</strong> — direct commands that feel energetic, not rude, in this context: "Discover. Experience. Upgrade." It also leans on <strong>comparatives/superlatives</strong> to persuade: "faster," "the smartest choice," "better than ever." Careful — in most markets, superlative claims ("the best," "#1") must be substantiated or they risk being misleading advertising, a legal issue as much as a language one.</p>
<div class="callout"><span class="badge">Caution</span> "The best coffee in town" is a claim you'd need evidence for in most jurisdictions. "One of the most-loved coffees in town" is safer and still persuasive.</div>`,
    `<span class="eyebrow">ENM402 · Chương 4 · Bài 4.1</span>
<h2>Ngôn ngữ marketing &amp; quảng cáo</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>brand awareness (n.) - mức độ nhận diện thương hiệu
target audience (n.) - nhóm khách hàng mục tiêu
tagline (n.)          - slogan ngắn dễ nhớ             "Just Do It" là tagline của Nike.
CTA (n.)               - lời kêu gọi hành động          "Đăng ký ngay" là CTA mạnh.
USP (n.)               - điểm bán hàng độc nhất          "USP của chúng tôi là giao trong ngày."
viral campaign (n.)    - chiến dịch lan truyền nhanh
market segment (n.)    - một phân khúc thị trường xác định
conversion rate (n.)   - % khách truy cập chuyển đổi thành hành động
influencer (n.)        - người có lượng người theo dõi gắn kết, quảng bá thay bạn
brand loyalty (n.)     - khách hàng luôn chọn thương hiệu của bạn
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"USP của chúng tôi là giao trong ngày, toàn quốc." (Our USP is that we deliver same-day, nationwide.)</li>
<li>"Chiến dịch tăng nhận diện thương hiệu 22% ở nhóm 18-34 tuổi."</li>
<li>"Thêm CTA rõ hơn — hiện tại khách truy cập không biết nên bấm vào đâu."</li>
<li>"Mẫu quảng cáo này thử nghiệm tốt với phân khúc 25-34 tuổi."</li>
</ul>
<h3>Hội thoại — brainstorm nhóm marketing</h3>
<pre><code>Lead:      Góc tiếp cận cho chiến dịch mới là gì?
Copywriter: Kiểu như "Discover the difference" — lấy tốc độ làm USP.
Lead:      Tôi thích, nhưng hãy A/B test CTA. "Try it free" có thể chuyển
           đổi tốt hơn "Discover the difference."
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — thể mệnh lệnh &amp; so sánh thuyết phục</h3>
<p>Ngôn ngữ quảng cáo dựa vào <strong>thể mệnh lệnh</strong> — lệnh trực tiếp mà trong ngữ cảnh này nghe năng động, không thô lỗ: "Khám phá. Trải nghiệm. Nâng cấp." Nó cũng dựa vào <strong>so sánh/so sánh tuyệt đối</strong> để thuyết phục: "nhanh hơn," "lựa chọn thông minh nhất," "tốt hơn bao giờ hết." Cẩn thận — ở hầu hết thị trường, tuyên bố tuyệt đối ("tốt nhất," "#1") phải có chứng cứ, nếu không có nguy cơ là quảng cáo gây hiểu lầm — vấn đề pháp lý không kém vấn đề ngôn ngữ.</p>
<div class="callout"><span class="badge">Lưu ý</span> "Cà phê ngon nhất thị trấn" là tuyên bố cần chứng cứ ở hầu hết vùng pháp lý. "Một trong những loại cà phê được yêu thích nhất thị trấn" an toàn hơn mà vẫn thuyết phục.</div>`,
  ]]);

const c4q = quiz('enm402-quiz-4', 'Quiz 4 — Marketing & advertising English|||Quiz 4 — Ngôn ngữ marketing & quảng cáo', [
  { id: 'q1', question: '"USP" là viết tắt của gì?', options: ['User Support Plan', 'Unique Selling Point', 'Universal Sales Price', 'User Segment Plan'], correctIndex: 1, explanation: 'USP = Unique Selling Point, điểm bán hàng độc nhất.' },
  { id: 'q2', question: 'Câu quảng cáo nào dùng thể mệnh lệnh?', options: ['Our USP is fast delivery.', 'Discover the difference.', 'The campaign boosted awareness.', 'Conversion rate increased.'], correctIndex: 1, explanation: '"Discover the difference." là lệnh trực tiếp, thể mệnh lệnh trong quảng cáo.' },
  { id: 'q3', question: 'Vì sao tuyên bố "tốt nhất thị trấn" cần cẩn trọng?', options: ['Vì tốn tiền quảng cáo', 'Vì có thể bị coi là quảng cáo gây hiểu lầm nếu không có chứng cứ', 'Vì khách hàng không đọc', 'Vì CTA không rõ'], correctIndex: 1, explanation: 'Tuyên bố tuyệt đối không chứng cứ có thể vi phạm luật quảng cáo.' },
]);

// ---------- Chapter 5 — Finance & numbers in business ----------
const c5 = doc('enm402-5-1-finance-numbers', '5.1 — Finance & numbers in business|||5.1 — Tài chính & số liệu trong kinh doanh',
  'Từ vựng tài chính (revenue, profit margin, ROI...), mẫu câu đọc xu hướng số liệu, hội thoại họp tài chính, ngữ pháp động từ chỉ xu hướng & trạng từ mức độ.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 5 · Lesson 5.1</span>
<h2>Finance &amp; numbers in business</h2>
<h3>Key vocabulary</h3>
<pre><code>revenue (n.)        - total money earned from sales
profit margin (n.)  - profit as a % of revenue
cash flow (n.)       - money moving in and out of the business
break-even point (n.)- where revenue equals costs
ROI (n.)             - return on investment
fiscal year (n.)     - a company's 12-month accounting period
overhead (n.)        - ongoing running costs (rent, utilities...)
liquidity (n.)        - how easily assets convert to cash
forecast (n./v.)      - a prediction of future numbers
quarter (n.)          - a 3-month period (Q1-Q4)
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"Revenue grew by 12% year-on-year, driven mainly by the new product line."</li>
<li>"We're projecting a slight dip in Q3, followed by a strong rebound in Q4."</li>
<li>"Profit margin dropped sharply because of rising raw-material costs."</li>
<li>"Cash flow has plateaued this quarter, so we're holding off on new hires."</li>
</ul>
<h3>Dialogue — finance review meeting</h3>
<pre><code>CFO:      How does the ROI on the marketing spend look?
Analyst:  Solid. Every dollar spent returned $3.40 — up from $2.90 last
          quarter. Profit margin is steady at 18%.
CFO:      Good. Keep an eye on liquidity though, given the new lease.
</code></pre>
<h3>Advanced grammar/skill — describing trends</h3>
<p>Business English has a specific vocabulary for describing numbers moving over time. Pair a <strong>trend verb</strong> with an <strong>adverb of degree</strong> for precision: <em>rise/fall</em> (neutral), <em>surge/plummet</em> (dramatic), <em>plateau</em> (flatten out); <em>sharply, steadily, slightly, dramatically</em>. "Revenue rose steadily" ≠ "Revenue surged dramatically" — the second implies a much bigger, more sudden change.</p>
<div class="callout"><span class="badge">Reading numbers aloud</span> "12%" is spoken "twelve percent"; "$1.2m" is spoken "one point two million dollars"; "Q3" is spoken "the third quarter" or "Q three." Practice saying these out loud — hesitating on numbers undermines credibility in a finance meeting.</div>`,
    `<span class="eyebrow">ENM402 · Chương 5 · Bài 5.1</span>
<h2>Tài chính &amp; số liệu trong kinh doanh</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>revenue (n.)        - tổng doanh thu từ bán hàng
profit margin (n.)  - lợi nhuận theo % doanh thu
cash flow (n.)       - dòng tiền ra vào doanh nghiệp
break-even point (n.)- điểm hoà vốn, doanh thu bằng chi phí
ROI (n.)             - tỉ lệ hoàn vốn đầu tư
fiscal year (n.)     - năm tài chính (kỳ kế toán 12 tháng)
overhead (n.)        - chi phí vận hành cố định (thuê nhà, điện nước...)
liquidity (n.)        - mức độ dễ chuyển tài sản thành tiền mặt
forecast (n./v.)      - dự báo số liệu tương lai
quarter (n.)          - một quý (3 tháng, Q1-Q4)
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Doanh thu tăng 12% so với năm trước, chủ yếu nhờ dòng sản phẩm mới." (Revenue grew by 12% year-on-year, driven mainly by the new product line.)</li>
<li>"Chúng tôi dự báo giảm nhẹ ở Quý 3, sau đó bật lại mạnh ở Quý 4."</li>
<li>"Lợi nhuận giảm mạnh vì chi phí nguyên liệu tăng."</li>
<li>"Dòng tiền đã đi ngang trong quý này, nên chúng tôi tạm hoãn tuyển thêm."</li>
</ul>
<h3>Hội thoại — họp rà soát tài chính</h3>
<pre><code>CFO:      ROI cho chi tiêu marketing thế nào?
Analyst:  Tốt. Mỗi đô la chi ra thu về 3.4 đô — tăng từ 2.9 đô quý trước.
          Lợi nhuận ổn định ở mức 18%.
CFO:      Tốt. Nhưng để ý dòng tiền, vì hợp đồng thuê mới.
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — diễn đạt xu hướng</h3>
<p>Tiếng Anh thương mại có từ vựng riêng để mô tả số liệu biến động theo thời gian. Kết hợp <strong>động từ chỉ xu hướng</strong> với <strong>trạng từ mức độ</strong> để chính xác: <em>rise/fall</em> (trung tính), <em>surge/plummet</em> (đột biến), <em>plateau</em> (đi ngang); <em>sharply (mạnh), steadily (đều), slightly (nhẹ), dramatically (đột ngột)</em>. "Doanh thu tăng đều" ≠ "Doanh thu tăng vọt đột ngột" — câu sau ngụ ý một thay đổi lớn hơn, bất ngờ hơn nhiều.</p>
<div class="callout"><span class="badge">Đọc số thành tiếng</span> "12%" đọc "twelve percent"; "$1.2m" đọc "one point two million dollars"; "Q3" đọc "the third quarter" hay "Q three." Hãy luyện đọc to những con số này — ngập ngừng với số liệu làm giảm độ tin cậy trong họp tài chính.</div>`,
  ]]);

const c5q = quiz('enm402-quiz-5', 'Quiz 5 — Finance & numbers in business|||Quiz 5 — Tài chính & số liệu trong kinh doanh', [
  { id: 'q1', question: '"ROI" nghĩa là gì?', options: ['Rate of increase', 'Return on investment', 'Revenue of income', 'Ratio of interest'], correctIndex: 1, explanation: 'ROI = Return on investment, tỉ lệ hoàn vốn.' },
  { id: 'q2', question: 'Động từ nào diễn tả một xu hướng ĐỘT BIẾN, mạnh nhất?', options: ['plateau', 'rise', 'surge', 'fall'], correctIndex: 2, explanation: '"Surge" là tăng đột biến, mạnh hơn "rise" trung tính.' },
  { id: 'q3', question: '"Break-even point" là gì?', options: ['Điểm doanh thu bằng chi phí', 'Điểm lỗ tối đa', 'Điểm lợi nhuận cao nhất', 'Kỳ báo cáo tài chính'], correctIndex: 0, explanation: 'Break-even point là điểm hoà vốn, doanh thu = chi phí.' },
]);

// ---------- Chapter 6 — Leadership & management communication ----------
const c6 = doc('enm402-6-1-leadership', '6.1 — Leadership & management communication|||6.1 — Giao tiếp lãnh đạo & quản lý',
  'Từ vựng quản lý (delegate, accountability, feedback loop...), mẫu câu phản hồi mềm, hội thoại 1:1, ngữ pháp làm dịu góp ý & modal nghĩa vụ/khuyên.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 6 · Lesson 6.1</span>
<h2>Leadership &amp; management communication</h2>
<h3>Key vocabulary</h3>
<pre><code>delegate (v.)         - hand off a task to someone else
accountability (n.)   - being answerable for a result
feedback loop (n.)     - an ongoing cycle of feedback
performance review (n.)- a formal evaluation of someone's work
micromanage (v.)        - control every small detail (usually negative)
empower (v.)            - give someone authority/confidence to act
alignment (n.)          - everyone agreeing on the same goal
conflict resolution (n.)- resolving a disagreement constructively
1:1 (one-on-one) (n.)   - a private manager-employee meeting
constructive criticism (n.) - feedback meant to help, not just criticize
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"I noticed the report was submitted a day late — what happened?"</li>
<li>"It might help if we set a clearer deadline next time."</li>
<li>"Have you considered looping in the design team earlier?"</li>
<li>"I'd like to delegate this project to you — I think you're ready for it."</li>
</ul>
<h3>Dialogue — a 1:1 feedback conversation</h3>
<pre><code>Manager:   I noticed the client presentation went well, but the follow-up
           email went out two days late. What happened there?
Employee:  I was juggling the other project — I should have flagged it.
Manager:   Understood. Next time, just give me a heads-up if you're
           stretched — we can rebalance the workload.
</code></pre>
<h3>Advanced grammar/skill — softening criticism &amp; modals of obligation/advice</h3>
<p>Good managers give feedback without triggering defensiveness, using structures like: <strong>"I noticed... what happened?"</strong> (observation, not accusation), <strong>"It might help if..."</strong> (suggestion, not order), <strong>"Have you considered...?"</strong> (indirect question instead of a command). Contrast the strength of modal verbs: <em>must/need to</em> (strong obligation) vs. <em>should</em> (advice) vs. <em>could/might</em> (a gentle option).</p>
<div class="callout"><span class="badge">Register shift</span> "You need to stop being late" is direct and confrontational. "It might help if we agree on a buffer before deadlines" gets the same message across without putting the person on the defensive.</div>`,
    `<span class="eyebrow">ENM402 · Chương 6 · Bài 6.1</span>
<h2>Giao tiếp lãnh đạo &amp; quản lý</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>delegate (v.)         - giao việc cho người khác
accountability (n.)   - trách nhiệm giải trình cho kết quả
feedback loop (n.)     - vòng phản hồi liên tục
performance review (n.)- đánh giá hiệu suất công việc chính thức
micromanage (v.)        - kiểm soát từng chi tiết nhỏ (thường mang nghĩa tiêu cực)
empower (v.)            - trao quyền/sự tự tin để ai đó hành động
alignment (n.)          - mọi người đồng thuận cùng một mục tiêu
conflict resolution (n.)- giải quyết bất đồng theo hướng xây dựng
1:1 (one-on-one) (n.)   - buổi họp riêng giữa quản lý và nhân viên
constructive criticism (n.) - góp ý mang tính xây dựng, không chỉ chê
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Tôi nhận thấy báo cáo được nộp muộn một ngày — có chuyện gì vậy?" (I noticed the report was submitted a day late — what happened?)</li>
<li>"Có thể sẽ tốt hơn nếu lần sau ta đặt hạn rõ ràng hơn."</li>
<li>"Bạn có nghĩ đến việc mời nhóm thiết kế vào sớm hơn không?"</li>
<li>"Tôi muốn giao dự án này cho bạn — tôi nghĩ bạn đã sẵn sàng."</li>
</ul>
<h3>Hội thoại — trao đổi phản hồi 1:1</h3>
<pre><code>Manager:   Tôi thấy buổi thuyết trình với khách diễn ra tốt, nhưng email
           theo sau gửi muộn hai ngày. Chuyện gì đã xảy ra?
Employee:  Tôi đang lo dự án khác — tôi nên báo trước.
Manager:   Hiểu rồi. Lần sau, cứ báo sớm nếu bạn quá tải — chúng ta có
           thể cân lại khối lượng công việc.
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — làm dịu góp ý &amp; modal nghĩa vụ/khuyên</h3>
<p>Quản lý tốt đưa ra phản hồi mà không gây phản ứng phòng thủ, dùng các cấu trúc như: <strong>"I noticed... what happened?"</strong> (quan sát, không buộc tội), <strong>"It might help if..."</strong> (gợi ý, không ra lệnh), <strong>"Have you considered...?"</strong> (câu hỏi gián tiếp thay vì lệnh). So sánh độ mạnh của động từ khuyết thiếu: <em>must/need to</em> (nghĩa vụ mạnh) so với <em>should</em> (lời khuyên) so với <em>could/might</em> (một lựa chọn nhẹ nhàng).</p>
<div class="callout"><span class="badge">Đổi văn phong</span> "Bạn cần dừng việc đi trễ" trực tiếp và đối đầu. "Có thể sẽ tốt hơn nếu ta thống nhất một khoảng đệm trước hạn" truyền tải cùng ý mà không khiến người nghe phòng thủ.</div>`,
  ]]);

const c6q = quiz('enm402-quiz-6', 'Quiz 6 — Leadership & management communication|||Quiz 6 — Giao tiếp lãnh đạo & quản lý', [
  { id: 'q1', question: 'Cách nào đưa phản hồi MỀM nhất về việc đi trễ?', options: ['You need to stop being late.', 'It might help if we agree on a buffer before deadlines.', 'You are always late.', 'Being late is unacceptable.'], correctIndex: 1, explanation: '"It might help if..." là gợi ý mềm, không buộc tội.' },
  { id: 'q2', question: '"Micromanage" thường mang nghĩa gì?', options: ['Trao quyền cho nhân viên', 'Kiểm soát từng chi tiết nhỏ, thường tiêu cực', 'Họp riêng 1:1', 'Đánh giá hiệu suất'], correctIndex: 1, explanation: 'Micromanage nghĩa là kiểm soát quá chi tiết, thường bị coi là tiêu cực.' },
  { id: 'q3', question: 'Modal nào diễn tả nghĩa vụ MẠNH NHẤT?', options: ['could', 'might', 'must', 'should'], correctIndex: 2, explanation: '"Must/need to" diễn tả nghĩa vụ mạnh nhất, mạnh hơn "should" hay "could/might".' },
]);

// ---------- Chapter 7 — Cross-cultural business & etiquette ----------
const c7 = doc('enm402-7-1-cross-cultural', '7.1 — Cross-cultural business & etiquette|||7.1 — Kinh doanh & ứng xử đa văn hoá',
  'Từ vựng đa văn hoá (high/low-context, hierarchy, face-saving...), mẫu câu small talk mở đầu, hội thoại gặp đối tác quốc tế, ngữ pháp chiến lược lịch sự & yêu cầu gián tiếp.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 7 · Lesson 7.1</span>
<h2>Cross-cultural business &amp; etiquette</h2>
<h3>Key vocabulary</h3>
<pre><code>high-context culture (n.) - meaning relies on context, not just words (e.g. Japan, Vietnam)
low-context culture (n.)   - meaning is explicit, in the words themselves (e.g. Germany, US)
small talk (n.)             - light conversation before business
business card etiquette (n.)- customs around giving/receiving cards
punctuality norms (n.)       - cultural expectations about being on time
hierarchy (n.)               - the ranking of authority in an organization
direct/indirect communication - saying things plainly vs. implying them
face-saving (n.)              - avoiding public embarrassment for someone
gift-giving protocol (n.)     - customs around business gifts
dress code (n.)               - expected clothing standard
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"How was your flight? Did you have any trouble finding the office?"</li>
<li>"We'd be honored to host you — please let us know if you have any dietary requirements."</li>
<li>"I want to make sure I understand your position correctly — could you walk me through it again?"</li>
<li>"We really appreciate your patience while we finalize the details."</li>
</ul>
<h3>Dialogue — meeting an international partner</h3>
<pre><code>Host:    Welcome to Vietnam! I hope the flight wasn't too tiring.
Guest:   Not at all, thank you for asking. Your office is beautiful.
Host:    Thank you — shall we go through introductions before we start
         the agenda?
</code></pre>
<h3>Advanced grammar/skill — politeness strategies &amp; indirect requests</h3>
<p>In cross-cultural settings, <strong>indirect requests</strong> often read as more respectful than direct commands: "Would it be possible to move the meeting to 10am?" instead of "Move the meeting to 10am." Register also has to shift fast — small talk uses informal, warm language, while the agenda that follows shifts to formal register. Reading which mode you're in (and switching cleanly) is itself a business skill.</p>
<div class="callout"><span class="badge">Face-saving in practice</span> In many high-context cultures, correcting someone publicly damages the relationship more than the mistake itself. Raise concerns privately, and frame disagreement as a question: "Could we double-check that number together?" rather than "That number is wrong."</div>`,
    `<span class="eyebrow">ENM402 · Chương 7 · Bài 7.1</span>
<h2>Kinh doanh &amp; ứng xử đa văn hoá</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>high-context culture (n.) - văn hoá phụ thuộc bối cảnh, không chỉ lời nói (VD: Nhật, Việt Nam)
low-context culture (n.)   - văn hoá nói rõ ý, nằm ngay trong lời nói (VD: Đức, Mỹ)
small talk (n.)             - chuyện phiếm nhẹ trước khi vào việc
business card etiquette (n.)- phong tục trao/nhận danh thiếp
punctuality norms (n.)       - kỳ vọng văn hoá về đúng giờ
hierarchy (n.)               - cấp bậc quyền lực trong tổ chức
direct/indirect communication - nói thẳng vs. nói ngụ ý
face-saving (n.)              - tránh làm ai đó bối rối trước người khác
gift-giving protocol (n.)     - phong tục tặng quà trong kinh doanh
dress code (n.)               - chuẩn trang phục được kỳ vọng
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Chuyến bay của bạn thế nào? Có gặp khó khăn gì khi tìm văn phòng không?" (How was your flight? Did you have any trouble finding the office?)</li>
<li>"Chúng tôi rất hân hạnh được đón tiếp bạn — xin cho biết nếu bạn có yêu cầu ăn uống đặc biệt."</li>
<li>"Tôi muốn chắc mình hiểu đúng ý bạn — bạn có thể trình bày lại không?"</li>
<li>"Chúng tôi rất cảm ơn sự kiên nhẫn của bạn trong khi chúng tôi hoàn thiện chi tiết."</li>
</ul>
<h3>Hội thoại — gặp đối tác quốc tế</h3>
<pre><code>Host:    Chào mừng đến Việt Nam! Hy vọng chuyến bay không quá mệt.
Guest:   Không hề, cảm ơn bạn đã hỏi. Văn phòng của bạn đẹp quá.
Host:    Cảm ơn — chúng ta giới thiệu nhau trước khi vào chương trình chứ?
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — chiến lược lịch sự &amp; yêu cầu gián tiếp</h3>
<p>Trong bối cảnh đa văn hoá, <strong>yêu cầu gián tiếp</strong> thường được coi là lịch sự hơn lệnh trực tiếp: "Liệu có thể chuyển buổi họp sang 10 giờ sáng không?" thay vì "Chuyển buổi họp sang 10 giờ sáng." Văn phong cũng phải đổi nhanh — small talk dùng ngôn ngữ thân mật, ấm áp, còn phần chương trình họp sau đó chuyển sang văn phong trang trọng. Nhận ra mình đang ở chế độ nào (và chuyển đổi gọn gàng) chính là một kỹ năng kinh doanh.</p>
<div class="callout"><span class="badge">Giữ thể diện trong thực tế</span> Ở nhiều văn hoá bối cảnh cao, sửa lỗi ai đó công khai gây hại cho quan hệ hơn cả lỗi đó. Hãy nêu vấn đề riêng tư, và đặt bất đồng dưới dạng câu hỏi: "Chúng ta có thể kiểm lại số đó cùng nhau không?" thay vì "Số đó sai rồi."</div>`,
  ]]);

const c7q = quiz('enm402-quiz-7', 'Quiz 7 — Cross-cultural business & etiquette|||Quiz 7 — Kinh doanh & ứng xử đa văn hoá', [
  { id: 'q1', question: 'Văn hoá nào dựa vào lời nói RÕ RÀNG, ít phụ thuộc bối cảnh?', options: ['High-context culture', 'Low-context culture', 'Face-saving culture', 'Hierarchy culture'], correctIndex: 1, explanation: 'Low-context culture: nghĩa nằm ngay trong lời nói, ít cần bối cảnh.' },
  { id: 'q2', question: 'Yêu cầu gián tiếp nào lịch sự hơn khi muốn đổi giờ họp?', options: ['Move the meeting to 10am.', 'Would it be possible to move the meeting to 10am?', 'The meeting time is wrong.', 'Change it now.'], correctIndex: 1, explanation: 'Yêu cầu gián tiếp bằng "Would it be possible..." lịch sự hơn lệnh trực tiếp.' },
  { id: 'q3', question: '"Face-saving" trong kinh doanh đa văn hoá nghĩa là gì?', options: ['Tặng quà cho đối tác', 'Tránh làm ai đó bối rối trước người khác', 'Trao danh thiếp đúng cách', 'Đúng giờ trong cuộc họp'], correctIndex: 1, explanation: 'Face-saving là tránh làm mất mặt/bối rối ai đó công khai.' },
]);

// ---------- Chapter 8 — Job interviews & career English ----------
const c8 = doc('enm402-8-1-interviews-career', '8.1 — Job interviews & career English|||8.1 — Phỏng vấn & tiếng Anh sự nghiệp',
  'Từ vựng phỏng vấn (soft skills, STAR method, notice period...), mẫu câu trả lời phỏng vấn, hội thoại Q&A phỏng vấn, ngữ pháp phương pháp STAR & câu hỏi giả định.',
  [[
    `<span class="eyebrow">ENM402 · Chapter 8 · Lesson 8.1</span>
<h2>Job interviews &amp; career English</h2>
<h3>Key vocabulary</h3>
<pre><code>cover letter (n.)      - a letter introducing your application
soft skills (n.)        - communication, teamwork, adaptability etc.
career trajectory (n.)   - the path your career has taken/will take
salary negotiation (n.)  - discussing compensation before accepting
notice period (n.)        - time you must work before leaving a job
reference check (n.)      - verifying your work history with past employers
onboarding (n.)           - the process of joining a new company
behavioral question (n.)  - "Tell me about a time when..."
STAR method (n.)          - Situation, Task, Action, Result — an answer structure
follow-up email (n.)      - a thank-you/check-in email after the interview
</code></pre>
<h3>Useful sentences</h3>
<ul>
<li>"In my current role, I'm responsible for managing a portfolio of key accounts."</li>
<li>"What would you do if a project deadline suddenly moved up by two weeks?"</li>
<li>"I'm currently on a one-month notice period, so I could start by mid-October."</li>
<li>"Thank you again for your time today — I'm very excited about the opportunity."</li>
</ul>
<h3>Dialogue — answering a behavioral question</h3>
<pre><code>Interviewer: Tell me about a time you had to resolve a conflict on your team.
Candidate:   Sure. [Situation] Two team members disagreed on the project
             approach. [Task] As the lead, I needed a decision by Friday.
             [Action] I set up a 30-minute call so each could present
             their case, then we voted on the strongest points from both.
             [Result] We shipped on time, and both felt heard.
</code></pre>
<h3>Advanced grammar/skill — the STAR method &amp; hypothetical questions</h3>
<p>The <strong>STAR method</strong> (Situation, Task, Action, Result) structures interview answers with a narrative past tense — set the scene, state the task, describe your actions with active verbs, close with a measurable result. Interviewers also test <strong>hypothetical/conditional questions</strong>: "What would you do if...?" answered with <em>would + base verb</em>, showing judgment rather than reciting facts.</p>
<div class="callout"><span class="badge">Common trap</span> A STAR answer that skips the "Result" sounds unfinished — always close with what happened, ideally with a number ("we cut turnaround time by 30%").</div>`,
    `<span class="eyebrow">ENM402 · Chương 8 · Bài 8.1</span>
<h2>Phỏng vấn &amp; tiếng Anh sự nghiệp</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>cover letter (n.)      - thư giới thiệu bản thân kèm hồ sơ ứng tuyển
soft skills (n.)        - kỹ năng mềm: giao tiếp, làm việc nhóm, thích ứng...
career trajectory (n.)   - hướng đi sự nghiệp đã/ sẽ đi
salary negotiation (n.)  - đàm phán lương trước khi nhận việc
notice period (n.)        - thời gian phải làm việc trước khi nghỉ
reference check (n.)      - xác minh lịch sử làm việc với nhà tuyển dụng cũ
onboarding (n.)           - quy trình hoà nhập vào công ty mới
behavioral question (n.)  - câu hỏi hành vi "Kể về lần bạn..."
STAR method (n.)          - Situation, Task, Action, Result — cấu trúc trả lời
follow-up email (n.)      - email cảm ơn/hỏi thăm sau buổi phỏng vấn
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Ở vị trí hiện tại, tôi phụ trách quản lý danh mục khách hàng chủ chốt." (In my current role, I'm responsible for managing a portfolio of key accounts.)</li>
<li>"Bạn sẽ làm gì nếu hạn dự án bất ngờ bị đẩy sớm hai tuần?"</li>
<li>"Hiện tôi có thời hạn báo trước một tháng, nên có thể bắt đầu vào giữa tháng Mười."</li>
<li>"Cảm ơn bạn lần nữa vì thời gian hôm nay — tôi rất hào hứng với cơ hội này."</li>
</ul>
<h3>Hội thoại — trả lời câu hỏi hành vi</h3>
<pre><code>Interviewer: Kể cho tôi về lần bạn phải giải quyết xung đột trong nhóm.
Candidate:   Được. [Situation] Hai thành viên nhóm bất đồng về cách tiếp
             cận dự án. [Task] Là trưởng nhóm, tôi cần có quyết định
             trước thứ Sáu. [Action] Tôi tổ chức cuộc gọi 30 phút để mỗi
             người trình bày, rồi chúng tôi chọn những điểm mạnh nhất của
             cả hai. [Result] Chúng tôi giao đúng hạn, và cả hai đều
             thấy được lắng nghe.
</code></pre>
<h3>Ngữ pháp/kỹ năng nâng cao — phương pháp STAR &amp; câu hỏi giả định</h3>
<p><strong>Phương pháp STAR</strong> (Situation, Task, Action, Result) cấu trúc câu trả lời phỏng vấn bằng thì quá khứ kể chuyện — dựng bối cảnh, nêu nhiệm vụ, mô tả hành động bằng động từ chủ động, kết bằng kết quả đo được. Người phỏng vấn cũng kiểm tra bằng <strong>câu hỏi giả định/điều kiện</strong>: "Bạn sẽ làm gì nếu...?" trả lời bằng <em>would + động từ nguyên thể</em>, thể hiện khả năng phán đoán chứ không chỉ kể lại sự việc.</p>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Một câu trả lời STAR thiếu phần "Result" nghe như chưa xong — luôn kết bằng điều đã xảy ra, tốt nhất có số liệu ("chúng tôi giảm thời gian xử lý 30%").</div>`,
  ]]);

const c8q = quiz('enm402-quiz-8', 'Quiz 8 — Job interviews & career English|||Quiz 8 — Phỏng vấn & tiếng Anh sự nghiệp', [
  { id: 'q1', question: 'Phương pháp STAR gồm bốn phần nào?', options: ['Situation, Task, Action, Result', 'Skill, Time, Answer, Review', 'Start, Talk, Act, Reply', 'Speak, Try, Ask, Report'], correctIndex: 0, explanation: 'STAR = Situation, Task, Action, Result.' },
  { id: 'q2', question: 'Câu hỏi "What would you do if...?" nên trả lời bằng cấu trúc nào?', options: ['will + động từ', 'would + động từ nguyên thể', 'did + động từ', 'have + V3'], correctIndex: 1, explanation: 'Câu hỏi giả định "would" trả lời bằng "would + base verb".' },
  { id: 'q3', question: '"Notice period" nghĩa là gì?', options: ['Thời gian phải làm trước khi nghỉ việc', 'Thời gian nghỉ phép', 'Thời gian thử việc', 'Thời gian phỏng vấn'], correctIndex: 0, explanation: 'Notice period là thời hạn báo trước phải làm việc trước khi chính thức nghỉ.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'ENM402',
    slug: 'enm402-business-english-level-2',
    title: 'Business English - Level 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ENM402.webp',
    shortDescription: 'Advanced Business English — negotiation, presentations, reports & proposals, marketing, finance numbers, leadership communication, cross-cultural etiquette, job interviews. Builds on Level 1: vocabulary, dialogues, grammar, quizzes.|||Tiếng Anh thương mại nâng cao — đàm phán, thuyết trình, báo cáo & đề xuất, marketing, số liệu tài chính, giao tiếp lãnh đạo, đa văn hoá, phỏng vấn việc làm. Nối tiếp Cấp độ 1: từ vựng, hội thoại, ngữ pháp, quiz.',
    description: 'Môn <strong>ENM402 — Business English - Level 2</strong> (khối Quản trị Kinh doanh, kỳ 2) nối tiếp <strong>ENM302 (Level 1)</strong> ở mức cao hơn: <strong>đàm phán &amp; mặc cả</strong> → <strong>thuyết trình &amp; nói trước công chúng</strong> → <strong>báo cáo &amp; đề xuất kinh doanh</strong> → <strong>ngôn ngữ marketing &amp; quảng cáo</strong> → <strong>tài chính &amp; số liệu</strong> → <strong>giao tiếp lãnh đạo &amp; quản lý</strong> → <strong>kinh doanh &amp; ứng xử đa văn hoá</strong> → <strong>phỏng vấn &amp; tiếng Anh sự nghiệp</strong>. Tham khảo Market Leader Upper Intermediate (Pearson), Business Advantage (Cambridge), Business Result (OUP). Song ngữ, có từ vựng, mẫu câu, hội thoại, ngữ pháp/kỹ năng nâng cao và quiz mỗi chương.',
    whatYouLearn: 'Ngôn ngữ đàm phán & hedging; signposting & thuyết trình; nominalization trong báo cáo; ngôn ngữ marketing thuyết phục; mô tả xu hướng số liệu tài chính; làm dịu góp ý quản lý; chiến lược lịch sự đa văn hoá; phương pháp STAR trong phỏng vấn. Từ vựng, mẫu câu, hội thoại thực tế cho mỗi tình huống.',
    requirements: 'Đã hoàn thành ENM302 (Business English - Level 1) hoặc trình độ tiếng Anh tương đương B1+.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo (Market Leader, Business Advantage, Business Result), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp Level 1, tổng quan 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Đàm phán & mặc cả|||Chapter 1 — Negotiations & bargaining', description: 'Từ vựng đàm phán, hedging, câu điều kiện ngoại giao.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thuyết trình & nói trước công chúng|||Chapter 2 — Presentations & public speaking', description: 'Signposting, Q&A, thể bị động trang trọng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Báo cáo & đề xuất kinh doanh|||Chapter 3 — Business reports & proposals', description: 'Executive summary, findings, nominalization, từ nối.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ngôn ngữ marketing & quảng cáo|||Chapter 4 — Marketing & advertising English', description: 'USP, CTA, thể mệnh lệnh, so sánh thuyết phục.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tài chính & số liệu trong kinh doanh|||Chapter 5 — Finance & numbers in business', description: 'Revenue, ROI, động từ & trạng từ chỉ xu hướng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giao tiếp lãnh đạo & quản lý|||Chapter 6 — Leadership & management communication', description: 'Delegate, feedback, làm dịu góp ý, modal nghĩa vụ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kinh doanh & ứng xử đa văn hoá|||Chapter 7 — Cross-cultural business & etiquette', description: 'High/low-context, face-saving, yêu cầu gián tiếp.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phỏng vấn & tiếng Anh sự nghiệp|||Chapter 8 — Job interviews & career English', description: 'STAR method, câu hỏi giả định, follow-up email.', lessons: [c8, c8q] },
  ],
};
