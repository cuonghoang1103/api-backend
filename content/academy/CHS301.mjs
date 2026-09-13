/**
 * CHS301 — Chinese Speaking 4 (Tiếng Trung giao tiếp/nói 4). Khối Ngôn ngữ
 * Trung FPTU. Đây là MÔN NGÔN NGỮ, track LUYỆN NÓI, NỐI TIẾP CHS201/CHS211:
 * giao tiếp ở trình độ khẩu ngữ HSK4 với các chủ đề trừu tượng &
 * thảo luận — bàn về công việc & sự nghiệp, thảo luận giáo dục, quan điểm
 * về công nghệ, môi trường & lối sống, văn hoá & du lịch, sức khoẻ & tâm lý,
 * tranh luận có phản biện, thuyết trình chủ đề. Giáo trình chuẩn: 汉语口语速成
 * 中级篇 (Short-term Spoken Chinese, Intermediate), HSK Standard Course 4.
 * Trọng tâm: diễn đạt quan điểm dài, hội thoại thảo luận nhiều lượt. Lộ trình
 * 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng. Giữ NGUYÊN
 * slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong HTML
 * content "&" → "&amp;". shortDescription "&".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & mẫu câu khẩu ngữ của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chs301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình luyện nói',
  'Giáo trình khẩu ngữ chuẩn (汉语口语速成 中级篇, HSK Standard Course 4), app luyện nói (HelloChinese/Pleco), lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng.',
  [[
    `<span class="eyebrow">CHS301 · Materials</span>
<h2>Discuss in Chinese — materials &amp; roadmap</h2>
<p class="lead">Chinese Speaking 4 continues <strong>CHS201 / CHS211</strong>. It is still a <strong>speaking-first</strong> course, now at the <strong>HSK4</strong> level: you no longer just handle a situation, you <strong>hold an opinion</strong> on abstract topics — work, education, technology, the environment — and defend it across a multi-turn discussion.</p>
<h3>📘 Standard textbooks (spoken track)</h3>
<ul>
<li><strong>汉语口语速成 中级篇 (Short-term Spoken Chinese, Intermediate)</strong> (Beijing Language and Culture University Press): the mainstream spoken-Chinese coursebook, intermediate level.</li>
<li><strong>HSK Standard Course 4</strong> — vocabulary &amp; grammar that back up each discussion topic.</li>
</ul>
<h3>📱 Apps for speaking &amp; sound</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — course with speech-recognition practice.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — dictionary with native audio for every word (shadow it).</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese-Vietnamese dictionary with audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real conversations with subtitles.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured HSK lessons.</li>
</ul>
<div class="callout"><span class="badge">4-step speaking path</span>
<ol>
<li><strong>Listen (Nghe)</strong> — hear the opinion phrase and its tones before you read the pinyin.</li>
<li><strong>Imitate (Bắt chước)</strong> — shadow the audio out loud; copy the rhythm of a long sentence.</li>
<li><strong>Pair drill (Luyện cặp)</strong> — run each discussion with a partner, swapping the two sides.</li>
<li><strong>Apply (Ứng dụng)</strong> — state your own opinion on the topic the same day.</li>
</ol></div>`,
    `<span class="eyebrow">CHS301 · Tài liệu</span>
<h2>Thảo luận bằng tiếng Trung — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung giao tiếp 4 nối tiếp <strong>CHS201 / CHS211</strong>. Vẫn là môn <strong>lấy nói làm gốc</strong>, giờ ở trình độ <strong>HSK4</strong>: bạn không chỉ xử lý tình huống nữa mà phải <strong>giữ một quan điểm</strong> về chủ đề trừu tượng — công việc, giáo dục, công nghệ, môi trường — và bảo vệ nó qua một cuộc thảo luận nhiều lượt.</p>
<h3>📘 Giáo trình chuẩn (hướng khẩu ngữ)</h3>
<ul>
<li><strong>汉语口语速成 中级篇 (Short-term Spoken Chinese, Intermediate)</strong> (NXB Đại học Ngôn ngữ Bắc Kinh): giáo trình khẩu ngữ phổ biến nhất, cấp trung cấp.</li>
<li><strong>HSK Standard Course 4</strong> — từ vựng &amp; ngữ pháp nền cho mỗi chủ đề thảo luận.</li>
</ul>
<h3>📱 App luyện nói &amp; nghe âm</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — khoá học có nhận diện giọng nói.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển có audio bản ngữ cho từng từ (hãy nói nhại theo).</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung-Việt kèm audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật có phụ đề.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài HSK có hệ thống.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước luyện nói</span>
<ol>
<li><strong>Nghe</strong> — nghe câu nêu quan điểm và thanh điệu trước khi nhìn pinyin.</li>
<li><strong>Bắt chước</strong> — nói nhại theo audio thật to; sao chép nhịp của một câu dài.</li>
<li><strong>Luyện cặp</strong> — chạy mỗi cuộc thảo luận với bạn, đổi hai phía cho nhau.</li>
<li><strong>Ứng dụng</strong> — nêu quan điểm riêng của bạn về chủ đề ngay trong ngày.</li>
</ol></div>`,
  ]]);

const intro = doc('chs301-0-1-overview', 'Course overview: Chinese Speaking 4|||Tổng quan: Tiếng Trung giao tiếp 4',
  'Nối tiếp CHS201/CHS211: mục tiêu giao tiếp HSK4 — nêu &amp; bảo vệ quan điểm về chủ đề trừu tượng, hội thoại thảo luận nhiều lượt, tranh luận và thuyết trình.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 0.1 · Overview</span>
<h2>Chinese Speaking 4 (HSK4)</h2>
<p class="lead">This course <strong>continues CHS201 / CHS211</strong>. There you spoke about your own life and everyday situations. Here you move to <strong>abstract topics</strong> and learn to <strong>state, support and defend an opinion</strong>: work and careers, education, technology, the environment, culture, mental health, then formal <strong>debate</strong> and a short <strong>speech</strong>.</p>
<h3>What CHS201 / CHS211 gave you (the base)</h3>
<ul>
<li><strong>Sound first</strong> — the 4 tones plus the neutral tone; a wrong tone is a wrong word, so keep shadowing native audio.</li>
<li><strong>Opinion phrases</strong> — you already have 我觉得… and 因为…所以…. Now you add longer frames like 在我看来…, 一方面…另一方面…, 我不完全同意.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives you a <strong>spoken vocabulary &amp; phrase table</strong> (汉字 | pinyin | nghĩa), the <strong>opinion patterns</strong> at the centre of the topic, a <strong>discussion dialogue</strong> (4 turns) to shadow and role-play, and <strong>pronunciation / intonation notes</strong>. Then a short quiz. Always follow the 4 steps: listen → imitate → pair-drill → apply.</p>
<h3>Roadmap</h3>
<p>Work &amp; careers → education → technology &amp; AI → environment &amp; lifestyle → culture &amp; travel → health &amp; the mind → debate with rebuttal → giving a short speech.</p>`,
    `<span class="eyebrow">CHS301 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung giao tiếp 4 (HSK4)</h2>
<p class="lead">Môn này <strong>nối tiếp CHS201 / CHS211</strong>. Ở đó bạn nói về đời sống của mình và các tình huống hằng ngày. Ở đây bạn chuyển sang <strong>chủ đề trừu tượng</strong> và học cách <strong>nêu, chống đỡ và bảo vệ một quan điểm</strong>: công việc &amp; sự nghiệp, giáo dục, công nghệ, môi trường, văn hoá, sức khoẻ tâm lý, rồi <strong>tranh luận</strong> chính thức và một bài <strong>thuyết trình</strong> ngắn.</p>
<h3>CHS201 / CHS211 đã cho bạn nền gì</h3>
<ul>
<li><strong>Âm là gốc</strong> — 4 thanh cộng thanh nhẹ; sai thanh là sai từ, nên hãy tiếp tục nói nhại theo audio bản ngữ.</li>
<li><strong>Cụm nêu ý kiến</strong> — bạn đã có 我觉得… và 因为…所以…. Giờ thêm các khung dài hơn như 在我看来…, 一方面…另一方面…, 我不完全同意.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu khẩu ngữ</strong> (汉字 | pinyin | nghĩa), các <strong>mẫu câu diễn đạt quan điểm</strong> trọng tâm của chủ đề, một <strong>hội thoại thảo luận</strong> (4 lượt) để nói nhại &amp; đóng vai, và <strong>ghi chú phát âm / ngữ điệu</strong>. Sau đó là quiz ngắn. Luôn theo 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.</p>
<h3>Lộ trình</h3>
<p>Công việc &amp; sự nghiệp → giáo dục → công nghệ &amp; AI → môi trường &amp; lối sống → văn hoá &amp; du lịch → sức khoẻ &amp; tâm lý → tranh luận có phản biện → thuyết trình ngắn.</p>`,
  ]]);

const b1 = doc('chs301-1-1-work-careers', 'Lesson 1 — Work &amp; careers|||Bài 1 — Bàn về công việc &amp; sự nghiệp',
  'Mẫu câu: 在我看来…, 一方面…另一方面…, 与其…不如…; từ 职业规划/跳槽/工作压力/平衡; luyện nêu quan điểm về công việc.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 1 · Work</span>
<h2>Work &amp; careers</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>职业规划</td><td>zhíyè guīhuà</td><td>career planning</td></tr>
<tr><td>跳槽</td><td>tiàocáo</td><td>to change jobs, job-hopping</td></tr>
<tr><td>工作压力</td><td>gōngzuò yālì</td><td>work pressure</td></tr>
<tr><td>加班</td><td>jiābān</td><td>to work overtime</td></tr>
<tr><td>平衡</td><td>pínghéng</td><td>balance</td></tr>
<tr><td>升职</td><td>shēngzhí</td><td>to be promoted</td></tr>
<tr><td>收入</td><td>shōurù</td><td>income</td></tr>
<tr><td>前途</td><td>qiántú</td><td>prospects, future</td></tr>
<tr><td>稳定</td><td>wěndìng</td><td>stable</td></tr>
<tr><td>挑战</td><td>tiǎozhàn</td><td>challenge</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>在我看来…</strong> zài wǒ kànlái… — in my view … (opens a personal opinion).</li>
<li><strong>一方面…，另一方面…</strong> yì fāngmiàn…, lìng yì fāngmiàn… — on one hand …, on the other hand …</li>
<li><strong>我认为最重要的是…</strong> wǒ rènwéi zuì zhòngyào de shì… — I think the most important thing is …</li>
<li><strong>与其…，不如…</strong> yǔqí…, bùrú… — rather than …, it is better to …</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你为什么想跳槽？ Nǐ wèishénme xiǎng tiàocáo? (Why do you want to change jobs?)
B: 在我看来，现在的工作压力太大，也没有升职的机会。 Zài wǒ kànlái, xiànzài de gōngzuò yālì tài dà, yě méiyǒu shēngzhí de jīhuì. (In my view, the current work pressure is too great, and there is no chance of promotion.)
A: 可是新工作不一定稳定。 Kěshì xīn gōngzuò bù yídìng wěndìng. (But a new job is not necessarily stable.)
B: 你说得有道理。不过我认为，与其每天加班，不如找一个更有前途的工作。 Nǐ shuō de yǒu dàoli. Búguò wǒ rènwéi, yǔqí měitiān jiābān, bùrú zhǎo yí ge gèng yǒu qiántú de gōngzuò. (You have a point. But I think, rather than working overtime every day, it is better to find a job with better prospects.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 在我看来 opens your view — say it as one block, then pause. 与其 A 不如 B weighs two options and lands on B; stress 不如 to signal your choice.</div>`,
    `<span class="eyebrow">CHS301 · Bài 1 · Công việc</span>
<h2>Bàn về công việc &amp; sự nghiệp</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>职业规划</td><td>zhíyè guīhuà</td><td>hoạch định nghề nghiệp</td></tr>
<tr><td>跳槽</td><td>tiàocáo</td><td>nhảy việc, đổi việc</td></tr>
<tr><td>工作压力</td><td>gōngzuò yālì</td><td>áp lực công việc</td></tr>
<tr><td>加班</td><td>jiābān</td><td>làm thêm giờ</td></tr>
<tr><td>平衡</td><td>pínghéng</td><td>cân bằng</td></tr>
<tr><td>升职</td><td>shēngzhí</td><td>thăng chức</td></tr>
<tr><td>收入</td><td>shōurù</td><td>thu nhập</td></tr>
<tr><td>前途</td><td>qiántú</td><td>tương lai, triển vọng</td></tr>
<tr><td>稳定</td><td>wěndìng</td><td>ổn định</td></tr>
<tr><td>挑战</td><td>tiǎozhàn</td><td>thử thách</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>在我看来…</strong> zài wǒ kànlái… — theo tôi thấy … (mở đầu một quan điểm cá nhân).</li>
<li><strong>一方面…，另一方面…</strong> yì fāngmiàn…, lìng yì fāngmiàn… — một mặt …, mặt khác …</li>
<li><strong>我认为最重要的是…</strong> wǒ rènwéi zuì zhòngyào de shì… — tôi cho rằng điều quan trọng nhất là …</li>
<li><strong>与其…，不如…</strong> yǔqí…, bùrú… — thay vì …, chi bằng …</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你为什么想跳槽？ Nǐ wèishénme xiǎng tiàocáo? (Sao bạn muốn nhảy việc?)
B: 在我看来，现在的工作压力太大，也没有升职的机会。 Zài wǒ kànlái, xiànzài de gōngzuò yālì tài dà, yě méiyǒu shēngzhí de jīhuì. (Theo tôi thấy, áp lực công việc hiện tại quá lớn, lại không có cơ hội thăng chức.)
A: 可是新工作不一定稳定。 Kěshì xīn gōngzuò bù yídìng wěndìng. (Nhưng việc mới chưa chắc đã ổn định.)
B: 你说得有道理。不过我认为，与其每天加班，不如找一个更有前途的工作。 Nǐ shuō de yǒu dàoli. Búguò wǒ rènwéi, yǔqí měitiān jiābān, bùrú zhǎo yí ge gèng yǒu qiántú de gōngzuò. (Bạn nói có lý. Nhưng tôi cho rằng, thay vì ngày nào cũng làm thêm giờ, chi bằng tìm một việc có triển vọng hơn.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 在我看来 mở đầu quan điểm — đọc liền thành một khối rồi ngắt. 与其 A 不如 B cân hai lựa chọn và ngả về B; nhấn 不如 để báo hiệu điều bạn chọn.</div>`,
  ]]);

const b1q = quiz('chs301-quiz-1', 'Quiz 1 — Work &amp; careers|||Quiz 1 — Công việc &amp; sự nghiệp', [
  { id: 'q1', question: 'Cụm nào mở đầu một quan điểm cá nhân? / Which phrase opens a personal opinion?', options: ['在我看来…', '多少钱？', '怎么走？', '再见'], correctIndex: 0, explanation: '在我看来 zài wǒ kànlái = theo tôi thấy / in my view — mở đầu một ý kiến.' },
  { id: 'q2', question: '"与其每天加班，不如找一个更有前途的工作" nghĩa là gì? / What does 与其…不如… express here?', options: ['Thay vì làm thêm mỗi ngày, chi bằng tìm việc triển vọng hơn|||Rather than overtime daily, better find a job with prospects', 'Vừa làm thêm vừa tìm việc|||Do overtime and job-hunt at once', 'Không làm thêm cũng không tìm việc|||Neither overtime nor job-hunt', 'Làm thêm để được thăng chức|||Overtime to get promoted'], correctIndex: 0, explanation: '与其 A 不如 B = thay vì A, chi bằng B — cân nhắc rồi ngả về B.' },
  { id: 'q3', question: '"跳槽" (tiàocáo) nghĩa là gì? / What does 跳槽 mean?', options: ['Nhảy việc, đổi việc|||To change jobs', 'Làm thêm giờ|||To work overtime', 'Thăng chức|||To be promoted', 'Nghỉ hưu|||To retire'], correctIndex: 0, explanation: '跳槽 tiàocáo = nhảy việc, chuyển sang công ty khác.' },
]);

const b2 = doc('chs301-2-1-education', 'Lesson 2 — Discussing education|||Bài 2 — Thảo luận giáo dục',
  'Mẫu câu: 从…的角度来看, 不但…而且…, 我完全同意; từ 教育方式/考试/补习班/减负; luyện thảo luận về giáo dục.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 2 · Education</span>
<h2>Discussing education</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>教育</td><td>jiàoyù</td><td>education</td></tr>
<tr><td>方式</td><td>fāngshì</td><td>way, method</td></tr>
<tr><td>考试</td><td>kǎoshì</td><td>exam</td></tr>
<tr><td>补习班</td><td>bǔxíbān</td><td>tutoring class, cram school</td></tr>
<tr><td>压力</td><td>yālì</td><td>pressure</td></tr>
<tr><td>减负</td><td>jiǎnfù</td><td>to reduce the study burden</td></tr>
<tr><td>成绩</td><td>chéngjì</td><td>grades, results</td></tr>
<tr><td>独立</td><td>dúlì</td><td>independent</td></tr>
<tr><td>培养</td><td>péiyǎng</td><td>to cultivate, foster</td></tr>
<tr><td>全面</td><td>quánmiàn</td><td>all-round, comprehensive</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>从…的角度来看</strong> cóng… de jiǎodù lái kàn — looking from the perspective of …</li>
<li><strong>不但…，而且…</strong> búdàn…, érqiě… — not only …, but also …</li>
<li><strong>我完全同意</strong> wǒ wánquán tóngyì — I completely agree.</li>
<li><strong>应该注重…</strong> yīnggāi zhùzhòng… — we should focus on …</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你怎么看现在孩子的学习压力？ Nǐ zěnme kàn xiànzài háizi de xuéxí yālì? (What do you think of children study pressure now?)
B: 从家长的角度来看，压力确实太大了，周末还要上补习班。 Cóng jiāzhǎng de jiǎodù lái kàn, yālì quèshí tài dà le, zhōumò hái yào shàng bǔxíbān. (From a parent perspective, the pressure really is too great; they still attend cram school on weekends.)
A: 所以国家现在提倡减负。 Suǒyǐ guójiā xiànzài tíchàng jiǎnfù. (So the country now advocates reducing the burden.)
B: 我完全同意。我认为教育不但要看成绩，而且要培养孩子的独立能力。 Wǒ wánquán tóngyì. Wǒ rènwéi jiàoyù búdàn yào kàn chéngjì, érqiě yào péiyǎng háizi de dúlì nénglì. (I completely agree. I think education should not only look at grades, but also cultivate children independent ability.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 从…的角度来看 frames whose viewpoint you take — useful to sound fair. 不但…而且… adds a second, stronger point; lift the voice on 而且 to push the idea further.</div>`,
    `<span class="eyebrow">CHS301 · Bài 2 · Giáo dục</span>
<h2>Thảo luận giáo dục</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>教育</td><td>jiàoyù</td><td>giáo dục</td></tr>
<tr><td>方式</td><td>fāngshì</td><td>phương thức, cách</td></tr>
<tr><td>考试</td><td>kǎoshì</td><td>thi cử</td></tr>
<tr><td>补习班</td><td>bǔxíbān</td><td>lớp học thêm</td></tr>
<tr><td>压力</td><td>yālì</td><td>áp lực</td></tr>
<tr><td>减负</td><td>jiǎnfù</td><td>giảm tải học tập</td></tr>
<tr><td>成绩</td><td>chéngjì</td><td>thành tích, điểm số</td></tr>
<tr><td>独立</td><td>dúlì</td><td>độc lập</td></tr>
<tr><td>培养</td><td>péiyǎng</td><td>bồi dưỡng, rèn</td></tr>
<tr><td>全面</td><td>quánmiàn</td><td>toàn diện</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>从…的角度来看</strong> cóng… de jiǎodù lái kàn — nhìn từ góc độ của …</li>
<li><strong>不但…，而且…</strong> búdàn…, érqiě… — không những …, mà còn …</li>
<li><strong>我完全同意</strong> wǒ wánquán tóngyì — tôi hoàn toàn đồng ý.</li>
<li><strong>应该注重…</strong> yīnggāi zhùzhòng… — nên chú trọng …</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你怎么看现在孩子的学习压力？ Nǐ zěnme kàn xiànzài háizi de xuéxí yālì? (Bạn nghĩ sao về áp lực học tập của trẻ bây giờ?)
B: 从家长的角度来看，压力确实太大了，周末还要上补习班。 Cóng jiāzhǎng de jiǎodù lái kàn, yālì quèshí tài dà le, zhōumò hái yào shàng bǔxíbān. (Nhìn từ góc độ phụ huynh, áp lực đúng là quá lớn, cuối tuần còn phải đi học thêm.)
A: 所以国家现在提倡减负。 Suǒyǐ guójiā xiànzài tíchàng jiǎnfù. (Nên nhà nước bây giờ khuyến khích giảm tải.)
B: 我完全同意。我认为教育不但要看成绩，而且要培养孩子的独立能力。 Wǒ wánquán tóngyì. Wǒ rènwéi jiàoyù búdàn yào kàn chéngjì, érqiě yào péiyǎng háizi de dúlì nénglì. (Tôi hoàn toàn đồng ý. Tôi cho rằng giáo dục không những phải nhìn điểm số, mà còn phải rèn năng lực tự lập cho trẻ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 从…的角度来看 báo bạn đang đứng ở góc nhìn nào — nghe khách quan hơn. 不但…而且… thêm một ý thứ hai mạnh hơn; lên giọng ở 而且 để đẩy ý đi xa hơn.</div>`,
  ]]);

const b2q = quiz('chs301-quiz-2', 'Quiz 2 — Discussing education|||Quiz 2 — Thảo luận giáo dục', [
  { id: 'q1', question: '"从家长的角度来看" nghĩa là gì? / What does 从家长的角度来看 mean?', options: ['Nhìn từ góc độ phụ huynh|||From a parent perspective', 'Học sinh về nhà|||Students go home', 'Thi lại lần nữa|||Retake the exam', 'Giáo viên nghỉ dạy|||Teacher off work'], correctIndex: 0, explanation: '从 … 的角度来看 = nhìn từ góc độ của …; 家长 = phụ huynh.' },
  { id: 'q2', question: 'Cặp từ "不但…而且…" diễn tả điều gì? / What does 不但…而且… express?', options: ['Không những … mà còn …|||Not only … but also …', 'Nếu … thì không|||If … not', 'Càng … càng ít|||The more … the less', 'Vừa … đã xong|||As soon as … done'], correctIndex: 0, explanation: '不但 A 而且 B = không những A mà còn B — thêm ý thứ hai mạnh hơn.' },
  { id: 'q3', question: '"减负" (jiǎnfù) nghĩa là gì? / What does 减负 mean?', options: ['Giảm tải học tập|||Reduce the study burden', 'Tăng học phí|||Raise tuition', 'Thi cuối kỳ|||Final exam', 'Nghỉ hè|||Summer break'], correctIndex: 0, explanation: '减负 = giảm gánh nặng học hành cho học sinh.' },
]);

const b3 = doc('chs301-3-1-technology', 'Lesson 3 — Views on technology|||Bài 3 — Quan điểm về công nghệ',
  'Mẫu câu: 随着…的发展, 凡事都有两面性, 我担心的是…; từ 人工智能/网络/利弊/隐私; luyện nêu lợi hại của công nghệ.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 3 · Technology</span>
<h2>Views on technology</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>科技</td><td>kējì</td><td>technology</td></tr>
<tr><td>人工智能</td><td>réngōng zhìnéng</td><td>artificial intelligence</td></tr>
<tr><td>网络</td><td>wǎngluò</td><td>the internet, network</td></tr>
<tr><td>利弊</td><td>lìbì</td><td>pros and cons</td></tr>
<tr><td>隐私</td><td>yǐnsī</td><td>privacy</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>convenient</td></tr>
<tr><td>依赖</td><td>yīlài</td><td>to rely on, dependence</td></tr>
<tr><td>信息</td><td>xìnxī</td><td>information</td></tr>
<tr><td>保护</td><td>bǎohù</td><td>to protect</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>influence, to affect</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>随着…的发展</strong> suízhe… de fāzhǎn — along with the development of …</li>
<li><strong>凡事都有两面性</strong> fánshì dōu yǒu liǎngmiànxìng — everything has two sides.</li>
<li><strong>好处是…，坏处是…</strong> hǎochù shì…, huàichù shì… — the advantage is …, the drawback is …</li>
<li><strong>我担心的是…</strong> wǒ dānxīn de shì… — what I worry about is …</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你觉得人工智能对我们的生活影响大吗？ Nǐ juéde réngōng zhìnéng duì wǒmen de shēnghuó yǐngxiǎng dà ma? (Do you think AI has a big impact on our lives?)
B: 当然大。随着科技的发展，它让生活越来越方便。 Dāngrán dà. Suízhe kējì de fāzhǎn, tā ràng shēnghuó yuè lái yuè fāngbiàn. (Of course big. Along with tech development, it makes life more and more convenient.)
A: 但是凡事都有两面性。 Dànshì fánshì dōu yǒu liǎngmiànxìng. (But everything has two sides.)
B: 你说得对。我担心的是隐私问题，我们的个人信息很难得到保护。 Nǐ shuō de duì. Wǒ dānxīn de shì yǐnsī wèntí, wǒmen de gèrén xìnxī hěn nán dédào bǎohù. (You are right. What I worry about is privacy; our personal information is hard to protect.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 随着…的发展 links a trend to its effect — a natural way to open a big topic. 凡事都有两面性 is a set phrase that signals you are about to give a balanced view.</div>`,
    `<span class="eyebrow">CHS301 · Bài 3 · Công nghệ</span>
<h2>Quan điểm về công nghệ</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>科技</td><td>kējì</td><td>khoa học công nghệ</td></tr>
<tr><td>人工智能</td><td>réngōng zhìnéng</td><td>trí tuệ nhân tạo</td></tr>
<tr><td>网络</td><td>wǎngluò</td><td>mạng, internet</td></tr>
<tr><td>利弊</td><td>lìbì</td><td>lợi và hại</td></tr>
<tr><td>隐私</td><td>yǐnsī</td><td>quyền riêng tư</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>tiện lợi</td></tr>
<tr><td>依赖</td><td>yīlài</td><td>phụ thuộc, lệ thuộc</td></tr>
<tr><td>信息</td><td>xìnxī</td><td>thông tin</td></tr>
<tr><td>保护</td><td>bǎohù</td><td>bảo vệ</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>ảnh hưởng</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>随着…的发展</strong> suízhe… de fāzhǎn — cùng với sự phát triển của …</li>
<li><strong>凡事都有两面性</strong> fánshì dōu yǒu liǎngmiànxìng — việc gì cũng có hai mặt.</li>
<li><strong>好处是…，坏处是…</strong> hǎochù shì…, huàichù shì… — cái lợi là …, cái hại là …</li>
<li><strong>我担心的是…</strong> wǒ dānxīn de shì… — điều tôi lo là …</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你觉得人工智能对我们的生活影响大吗？ Nǐ juéde réngōng zhìnéng duì wǒmen de shēnghuó yǐngxiǎng dà ma? (Bạn thấy trí tuệ nhân tạo ảnh hưởng lớn tới đời sống không?)
B: 当然大。随着科技的发展，它让生活越来越方便。 Dāngrán dà. Suízhe kējì de fāzhǎn, tā ràng shēnghuó yuè lái yuè fāngbiàn. (Tất nhiên lớn. Cùng với sự phát triển của công nghệ, nó khiến cuộc sống ngày càng tiện.)
A: 但是凡事都有两面性。 Dànshì fánshì dōu yǒu liǎngmiànxìng. (Nhưng việc gì cũng có hai mặt.)
B: 你说得对。我担心的是隐私问题，我们的个人信息很难得到保护。 Nǐ shuō de duì. Wǒ dānxīn de shì yǐnsī wèntí, wǒmen de gèrén xìnxī hěn nán dédào bǎohù. (Bạn nói đúng. Điều tôi lo là quyền riêng tư; thông tin cá nhân của ta rất khó được bảo vệ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 随着…的发展 nối một xu hướng với hệ quả — cách mở một chủ đề lớn. 凡事都有两面性 là câu cố định, báo hiệu bạn sắp đưa ra cái nhìn cân bằng.</div>`,
  ]]);

const b3q = quiz('chs301-quiz-3', 'Quiz 3 — Views on technology|||Quiz 3 — Quan điểm về công nghệ', [
  { id: 'q1', question: '"凡事都有两面性" nghĩa là gì? / What does 凡事都有两面性 mean?', options: ['Việc gì cũng có hai mặt|||Everything has two sides', 'Mọi thứ đều tốt|||Everything is good', 'Không có gì thay đổi|||Nothing changes', 'Ai cũng bận|||Everyone is busy'], correctIndex: 0, explanation: '凡事 (mọi việc) + 都有两面性 (đều có tính hai mặt) — câu cố định để nêu cái nhìn cân bằng.' },
  { id: 'q2', question: 'Cụm "随着…的发展" dùng để làm gì? / What is 随着…的发展 used for?', options: ['Nối một xu hướng với hệ quả|||Link a trend to its effect', 'Hỏi giá tiền|||Ask a price', 'Từ chối lời mời|||Decline an invite', 'Chào hỏi|||Greeting'], correctIndex: 0, explanation: '随着科技的发展 = cùng với sự phát triển của công nghệ … — mở một chủ đề lớn.' },
  { id: 'q3', question: '"我担心的是隐私问题" nghĩa là gì? / What does 我担心的是隐私问题 mean?', options: ['Điều tôi lo là vấn đề riêng tư|||What I worry about is privacy', 'Tôi thích công nghệ|||I like technology', 'Tôi không có mạng|||I have no internet', 'Tôi rất bận|||I am very busy'], correctIndex: 0, explanation: '我担心的是 … = điều tôi lo là …; 隐私 = quyền riêng tư.' },
]);

const b4 = doc('chs301-4-1-environment', 'Lesson 4 — Environment &amp; lifestyle|||Bài 4 — Môi trường &amp; lối sống',
  'Mẫu câu: 为了…，我们应该…, 只有…才能…, 我不这么看; từ 环保/低碳/浪费/可持续; luyện thảo luận về môi trường.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 4 · Environment</span>
<h2>Environment &amp; lifestyle</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>环保</td><td>huánbǎo</td><td>environmental protection</td></tr>
<tr><td>环境</td><td>huánjìng</td><td>environment</td></tr>
<tr><td>污染</td><td>wūrǎn</td><td>pollution</td></tr>
<tr><td>低碳</td><td>dītàn</td><td>low-carbon</td></tr>
<tr><td>浪费</td><td>làngfèi</td><td>to waste</td></tr>
<tr><td>节约</td><td>jiéyuē</td><td>to save, economize</td></tr>
<tr><td>垃圾分类</td><td>lājī fēnlèi</td><td>to sort garbage</td></tr>
<tr><td>可持续</td><td>kěchíxù</td><td>sustainable</td></tr>
<tr><td>资源</td><td>zīyuán</td><td>resources</td></tr>
<tr><td>行动</td><td>xíngdòng</td><td>to act, action</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>为了…，我们应该…</strong> wèile…, wǒmen yīnggāi… — in order to …, we should …</li>
<li><strong>只有…，才能…</strong> zhǐyǒu…, cáinéng… — only if …, can we …</li>
<li><strong>我不这么看</strong> wǒ bú zhème kàn — I do not see it that way.</li>
<li><strong>从小事做起</strong> cóng xiǎoshì zuòqǐ — to start from small things.</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你平时注意环保吗？ Nǐ píngshí zhùyì huánbǎo ma? (Do you usually pay attention to the environment?)
B: 注意。为了保护环境，我们应该节约用水，也要垃圾分类。 Zhùyì. Wèile bǎohù huánjìng, wǒmen yīnggāi jiéyuē yòng shuǐ, yě yào lājī fēnlèi. (Yes. To protect the environment, we should save water and sort garbage.)
A: 一个人的力量太小了吧？ Yí ge rén de lìliàng tài xiǎo le ba? (Is one person strength too small?)
B: 我不这么看。只有每个人都行动，才能实现可持续发展。 Wǒ bú zhème kàn. Zhǐyǒu měi ge rén dōu xíngdòng, cáinéng shíxiàn kěchíxù fāzhǎn. (I do not see it that way. Only if everyone acts can we achieve sustainable development.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 只有…才能… states a necessary condition — stress 只有 and 才能 to make the point firm. 我不这么看 disagrees while staying polite; say it calmly, not sharply.</div>`,
    `<span class="eyebrow">CHS301 · Bài 4 · Môi trường</span>
<h2>Môi trường &amp; lối sống</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>环保</td><td>huánbǎo</td><td>bảo vệ môi trường</td></tr>
<tr><td>环境</td><td>huánjìng</td><td>môi trường</td></tr>
<tr><td>污染</td><td>wūrǎn</td><td>ô nhiễm</td></tr>
<tr><td>低碳</td><td>dītàn</td><td>ít các-bon</td></tr>
<tr><td>浪费</td><td>làngfèi</td><td>lãng phí</td></tr>
<tr><td>节约</td><td>jiéyuē</td><td>tiết kiệm</td></tr>
<tr><td>垃圾分类</td><td>lājī fēnlèi</td><td>phân loại rác</td></tr>
<tr><td>可持续</td><td>kěchíxù</td><td>bền vững</td></tr>
<tr><td>资源</td><td>zīyuán</td><td>tài nguyên</td></tr>
<tr><td>行动</td><td>xíngdòng</td><td>hành động</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>为了…，我们应该…</strong> wèile…, wǒmen yīnggāi… — để …, chúng ta nên …</li>
<li><strong>只有…，才能…</strong> zhǐyǒu…, cáinéng… — chỉ khi …, mới có thể …</li>
<li><strong>我不这么看</strong> wǒ bú zhème kàn — tôi không nghĩ vậy.</li>
<li><strong>从小事做起</strong> cóng xiǎoshì zuòqǐ — bắt đầu từ việc nhỏ.</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你平时注意环保吗？ Nǐ píngshí zhùyì huánbǎo ma? (Bạn thường chú ý bảo vệ môi trường không?)
B: 注意。为了保护环境，我们应该节约用水，也要垃圾分类。 Zhùyì. Wèile bǎohù huánjìng, wǒmen yīnggāi jiéyuē yòng shuǐ, yě yào lājī fēnlèi. (Có. Để bảo vệ môi trường, ta nên tiết kiệm nước, và phải phân loại rác.)
A: 一个人的力量太小了吧？ Yí ge rén de lìliàng tài xiǎo le ba? (Sức một người thì quá nhỏ mà?)
B: 我不这么看。只有每个人都行动，才能实现可持续发展。 Wǒ bú zhème kàn. Zhǐyǒu měi ge rén dōu xíngdòng, cáinéng shíxiàn kěchíxù fāzhǎn. (Tôi không nghĩ vậy. Chỉ khi mỗi người đều hành động, mới đạt được phát triển bền vững.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 只有…才能… nêu một điều kiện cần — nhấn 只有 và 才能 để ý được chắc. 我不这么看 phản đối mà vẫn lịch sự; nói bình tĩnh, đừng gắt.</div>`,
  ]]);

const b4q = quiz('chs301-quiz-4', 'Quiz 4 — Environment &amp; lifestyle|||Quiz 4 — Môi trường &amp; lối sống', [
  { id: 'q1', question: 'Cấu trúc "只有…才能…" diễn tả điều gì? / What does 只有…才能… express?', options: ['Chỉ khi … mới có thể …|||Only if … can …', 'Vừa … thì …|||As soon as …', 'Không những … mà còn …|||Not only … but also', 'Nếu … thì không|||If … not'], correctIndex: 0, explanation: '只有 A 才能 B = chỉ khi A mới có thể B — nêu điều kiện cần.' },
  { id: 'q2', question: '"我不这么看" dùng khi nào? / When do you use 我不这么看?', options: ['Khi phản đối một cách lịch sự|||To disagree politely', 'Khi đồng ý hoàn toàn|||To fully agree', 'Khi cảm ơn|||To say thanks', 'Khi xin lỗi|||To apologize'], correctIndex: 0, explanation: '我不这么看 = tôi không nghĩ như vậy — cách nêu ý phản đối nhẹ nhàng.' },
  { id: 'q3', question: '"垃圾分类" (lājī fēnlèi) nghĩa là gì? / What does 垃圾分类 mean?', options: ['Phân loại rác|||To sort garbage', 'Tiết kiệm điện|||Save power', 'Trồng cây|||Plant trees', 'Đổ nước|||Pour water'], correctIndex: 0, explanation: '垃圾 (rác) + 分类 (phân loại) = phân loại rác.' },
]);

const b5 = doc('chs301-5-1-culture-travel', 'Lesson 5 — Culture &amp; travel|||Bài 5 — Văn hoá &amp; du lịch',
  'Mẫu câu: 每个地方都有自己的…, 我印象最深的是…, 入乡随俗; từ 文化差异/风俗/体验/尊重; luyện nói về văn hoá &amp; du lịch.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 5 · Culture</span>
<h2>Culture &amp; travel</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>文化</td><td>wénhuà</td><td>culture</td></tr>
<tr><td>差异</td><td>chāyì</td><td>difference</td></tr>
<tr><td>风俗</td><td>fēngsú</td><td>custom</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>habit, custom</td></tr>
<tr><td>旅游</td><td>lǚyóu</td><td>to travel, tourism</td></tr>
<tr><td>体验</td><td>tǐyàn</td><td>to experience</td></tr>
<tr><td>入乡随俗</td><td>rùxiāng suísú</td><td>when in Rome, do as Romans (idiom)</td></tr>
<tr><td>尊重</td><td>zūnzhòng</td><td>to respect</td></tr>
<tr><td>交流</td><td>jiāoliú</td><td>to communicate, exchange</td></tr>
<tr><td>开阔眼界</td><td>kāikuò yǎnjiè</td><td>to broaden horizons</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>每个地方都有自己的…</strong> měi ge dìfang dōu yǒu zìjǐ de… — every place has its own …</li>
<li><strong>我印象最深的是…</strong> wǒ yìnxiàng zuì shēn de shì… — what impressed me most is …</li>
<li><strong>虽然…，但是…</strong> suīrán…, dànshì… — although …, but …</li>
<li><strong>应该入乡随俗</strong> yīnggāi rùxiāng suísú — one should follow local customs.</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你去中国旅游，有什么感受？ Nǐ qù Zhōngguó lǚyóu, yǒu shénme gǎnshòu? (You traveled to China, what were your impressions?)
B: 我印象最深的是文化差异。每个地方都有自己的风俗。 Wǒ yìnxiàng zuì shēn de shì wénhuà chāyì. Měi ge dìfang dōu yǒu zìjǐ de fēngsú. (What impressed me most is the cultural difference. Every place has its own customs.)
A: 遇到不同的风俗，你会怎么做？ Yùdào bùtóng de fēngsú, nǐ huì zěnme zuò? (When you meet different customs, what do you do?)
B: 我觉得应该入乡随俗，尊重当地的习惯，这样也能开阔眼界。 Wǒ juéde yīnggāi rùxiāng suísú, zūnzhòng dāngdì de xíguàn, zhèyàng yě néng kāikuò yǎnjiè. (I think one should follow local customs, respect local habits; this also broadens horizons.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 我印象最深的是… picks out the strongest point of a story — say it slowly for weight. 入乡随俗 is a four-character idiom (rù-xiāng-suí-sú); keep the four syllables even.</div>`,
    `<span class="eyebrow">CHS301 · Bài 5 · Văn hoá</span>
<h2>Văn hoá &amp; du lịch</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>文化</td><td>wénhuà</td><td>văn hoá</td></tr>
<tr><td>差异</td><td>chāyì</td><td>sự khác biệt</td></tr>
<tr><td>风俗</td><td>fēngsú</td><td>phong tục</td></tr>
<tr><td>习惯</td><td>xíguàn</td><td>thói quen, tập quán</td></tr>
<tr><td>旅游</td><td>lǚyóu</td><td>du lịch</td></tr>
<tr><td>体验</td><td>tǐyàn</td><td>trải nghiệm</td></tr>
<tr><td>入乡随俗</td><td>rùxiāng suísú</td><td>nhập gia tuỳ tục (thành ngữ)</td></tr>
<tr><td>尊重</td><td>zūnzhòng</td><td>tôn trọng</td></tr>
<tr><td>交流</td><td>jiāoliú</td><td>giao lưu, trao đổi</td></tr>
<tr><td>开阔眼界</td><td>kāikuò yǎnjiè</td><td>mở mang tầm mắt</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>每个地方都有自己的…</strong> měi ge dìfang dōu yǒu zìjǐ de… — mỗi nơi đều có … riêng.</li>
<li><strong>我印象最深的是…</strong> wǒ yìnxiàng zuì shēn de shì… — điều tôi ấn tượng nhất là …</li>
<li><strong>虽然…，但是…</strong> suīrán…, dànshì… — tuy … nhưng …</li>
<li><strong>应该入乡随俗</strong> yīnggāi rùxiāng suísú — nên nhập gia tuỳ tục.</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你去中国旅游，有什么感受？ Nǐ qù Zhōngguó lǚyóu, yǒu shénme gǎnshòu? (Bạn đi Trung Quốc du lịch, cảm nhận thế nào?)
B: 我印象最深的是文化差异。每个地方都有自己的风俗。 Wǒ yìnxiàng zuì shēn de shì wénhuà chāyì. Měi ge dìfang dōu yǒu zìjǐ de fēngsú. (Điều tôi ấn tượng nhất là sự khác biệt văn hoá. Mỗi nơi đều có phong tục riêng.)
A: 遇到不同的风俗，你会怎么做？ Yùdào bùtóng de fēngsú, nǐ huì zěnme zuò? (Gặp phong tục khác, bạn sẽ làm gì?)
B: 我觉得应该入乡随俗，尊重当地的习惯，这样也能开阔眼界。 Wǒ juéde yīnggāi rùxiāng suísú, zūnzhòng dāngdì de xíguàn, zhèyàng yě néng kāikuò yǎnjiè. (Tôi thấy nên nhập gia tuỳ tục, tôn trọng tập quán địa phương; như vậy cũng mở mang tầm mắt.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 我印象最深的是… chọn ra điểm mạnh nhất của câu chuyện — nói chậm cho có sức nặng. 入乡随俗 là thành ngữ bốn chữ (rù-xiāng-suí-sú); giữ bốn âm tiết đều nhau.</div>`,
  ]]);

const b5q = quiz('chs301-quiz-5', 'Quiz 5 — Culture &amp; travel|||Quiz 5 — Văn hoá &amp; du lịch', [
  { id: 'q1', question: '"入乡随俗" nghĩa là gì? / What does 入乡随俗 mean?', options: ['Nhập gia tuỳ tục|||When in Rome, do as Romans', 'Đi du lịch một mình|||Travel alone', 'Ở nhà nghỉ ngơi|||Stay home and rest', 'Học một ngoại ngữ|||Learn a language'], correctIndex: 0, explanation: '入乡随俗 = vào làng theo tục của làng — nhập gia tuỳ tục.' },
  { id: 'q2', question: '"我印象最深的是文化差异" nghĩa là gì? / What does the sentence mean?', options: ['Điều tôi ấn tượng nhất là sự khác biệt văn hoá|||What impressed me most is the cultural difference', 'Tôi quên mất đường|||I forgot the way', 'Tôi thích ăn cay|||I like spicy food', 'Tôi đến muộn|||I was late'], correctIndex: 0, explanation: '我印象最深的是 … = điều tôi ấn tượng nhất là …; 文化差异 = khác biệt văn hoá.' },
  { id: 'q3', question: 'Cặp "虽然…但是…" diễn tả điều gì? / What does 虽然…但是… express?', options: ['Tuy … nhưng …|||Although … but …', 'Vì … nên …|||Because … so …', 'Chỉ khi … mới …|||Only if … then', 'Vừa … đã …|||As soon as …'], correctIndex: 0, explanation: '虽然 A 但是 B = tuy A nhưng B — nêu điều tương phản.' },
]);

const b6 = doc('chs301-6-1-mental-health', 'Lesson 6 — Health &amp; the mind|||Bài 6 — Sức khoẻ &amp; tâm lý',
  'Mẫu câu: 最近我感到…, 如果…的话，可以…, 保持…的心态; từ 心理健康/情绪/放松/调整; luyện nói về sức khoẻ tâm lý.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 6 · The mind</span>
<h2>Health &amp; the mind</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>心理健康</td><td>xīnlǐ jiànkāng</td><td>mental health</td></tr>
<tr><td>压力</td><td>yālì</td><td>stress</td></tr>
<tr><td>情绪</td><td>qíngxù</td><td>emotion, mood</td></tr>
<tr><td>放松</td><td>fàngsōng</td><td>to relax</td></tr>
<tr><td>失眠</td><td>shīmián</td><td>insomnia</td></tr>
<tr><td>锻炼</td><td>duànliàn</td><td>to exercise</td></tr>
<tr><td>调整</td><td>tiáozhěng</td><td>to adjust</td></tr>
<tr><td>积极</td><td>jījí</td><td>positive</td></tr>
<tr><td>心态</td><td>xīntài</td><td>mindset, state of mind</td></tr>
<tr><td>心情</td><td>xīnqíng</td><td>mood, feelings</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>最近我感到…</strong> zuìjìn wǒ gǎndào… — recently I feel …</li>
<li><strong>如果…的话，可以…</strong> rúguǒ… dehuà, kěyǐ… — if …, you can …</li>
<li><strong>保持…的心态</strong> bǎochí… de xīntài — keep a … mindset.</li>
<li><strong>一定要学会…</strong> yídìng yào xuéhuì… — you must learn to …</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 最近我压力很大，常常失眠。 Zuìjìn wǒ yālì hěn dà, chángcháng shīmián. (Recently I am very stressed and often cannot sleep.)
B: 你一定要学会放松，别把什么事都放在心上。 Nǐ yídìng yào xuéhuì fàngsōng, bié bǎ shénme shì dōu fàng zài xīnshàng. (You must learn to relax, do not take everything to heart.)
A: 那我该怎么调整呢？ Nà wǒ gāi zěnme tiáozhěng ne? (So how should I adjust?)
B: 如果心情不好的话，可以去锻炼，或者跟朋友聊聊。保持积极的心态很重要。 Rúguǒ xīnqíng bù hǎo dehuà, kěyǐ qù duànliàn, huòzhě gēn péngyou liáoliao. Bǎochí jījí de xīntài hěn zhòngyào. (If you are in a bad mood, you can exercise or chat with friends. Keeping a positive mindset is important.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 把…放在心上 means take to heart; 别把…放在心上 is common friendly advice. 保持积极的心态 is a natural collocation — learn the four words as one chunk.</div>`,
    `<span class="eyebrow">CHS301 · Bài 6 · Tâm lý</span>
<h2>Sức khoẻ &amp; tâm lý</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>心理健康</td><td>xīnlǐ jiànkāng</td><td>sức khoẻ tâm lý</td></tr>
<tr><td>压力</td><td>yālì</td><td>áp lực, căng thẳng</td></tr>
<tr><td>情绪</td><td>qíngxù</td><td>cảm xúc, tâm trạng</td></tr>
<tr><td>放松</td><td>fàngsōng</td><td>thư giãn</td></tr>
<tr><td>失眠</td><td>shīmián</td><td>mất ngủ</td></tr>
<tr><td>锻炼</td><td>duànliàn</td><td>rèn luyện, tập thể dục</td></tr>
<tr><td>调整</td><td>tiáozhěng</td><td>điều chỉnh</td></tr>
<tr><td>积极</td><td>jījí</td><td>tích cực</td></tr>
<tr><td>心态</td><td>xīntài</td><td>tâm thế, trạng thái tinh thần</td></tr>
<tr><td>心情</td><td>xīnqíng</td><td>tâm trạng</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>最近我感到…</strong> zuìjìn wǒ gǎndào… — gần đây tôi cảm thấy …</li>
<li><strong>如果…的话，可以…</strong> rúguǒ… dehuà, kěyǐ… — nếu … thì có thể …</li>
<li><strong>保持…的心态</strong> bǎochí… de xīntài — giữ tâm thế …</li>
<li><strong>一定要学会…</strong> yídìng yào xuéhuì… — nhất định phải học cách …</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 最近我压力很大，常常失眠。 Zuìjìn wǒ yālì hěn dà, chángcháng shīmián. (Gần đây tôi rất căng thẳng, thường mất ngủ.)
B: 你一定要学会放松，别把什么事都放在心上。 Nǐ yídìng yào xuéhuì fàngsōng, bié bǎ shénme shì dōu fàng zài xīnshàng. (Bạn nhất định phải học cách thư giãn, đừng để chuyện gì cũng canh cánh trong lòng.)
A: 那我该怎么调整呢？ Nà wǒ gāi zěnme tiáozhěng ne? (Vậy tôi nên điều chỉnh thế nào?)
B: 如果心情不好的话，可以去锻炼，或者跟朋友聊聊。保持积极的心态很重要。 Rúguǒ xīnqíng bù hǎo dehuà, kěyǐ qù duànliàn, huòzhě gēn péngyou liáoliao. Bǎochí jījí de xīntài hěn zhòngyào. (Nếu tâm trạng không tốt thì có thể đi tập, hoặc trò chuyện với bạn. Giữ tâm thế tích cực rất quan trọng.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 把…放在心上 nghĩa là để bụng, canh cánh; 别把…放在心上 là lời khuyên thân mật quen thuộc. 保持积极的心态 là cụm đi liền nhau — học bốn chữ như một khối.</div>`,
  ]]);

const b6q = quiz('chs301-quiz-6', 'Quiz 6 — Health &amp; the mind|||Quiz 6 — Sức khoẻ &amp; tâm lý', [
  { id: 'q1', question: '"别把什么事都放在心上" nghĩa là gì? / What does 别把什么事都放在心上 mean?', options: ['Đừng để chuyện gì cũng canh cánh trong lòng|||Do not take everything to heart', 'Đừng đi làm hôm nay|||Do not go to work today', 'Đừng ăn đồ lạnh|||Do not eat cold food', 'Đừng nói chuyện|||Do not talk'], correctIndex: 0, explanation: '把 … 放在心上 = để bụng; 别 … = đừng — đừng để mọi chuyện canh cánh.' },
  { id: 'q2', question: 'Cụm "如果…的话，可以…" dùng để làm gì? / What is 如果…的话，可以… used for?', options: ['Đưa lời khuyên có điều kiện|||Give conditional advice', 'Hỏi đường|||Ask for directions', 'Từ chối|||Decline', 'Khen ngợi|||Praise'], correctIndex: 0, explanation: '如果 … 的话，可以 … = nếu … thì có thể … — đưa gợi ý theo điều kiện.' },
  { id: 'q3', question: '"保持积极的心态" nghĩa là gì? / What does 保持积极的心态 mean?', options: ['Giữ tâm thế tích cực|||Keep a positive mindset', 'Uống nhiều nước|||Drink more water', 'Ngủ sớm|||Sleep early', 'Ăn ít lại|||Eat less'], correctIndex: 0, explanation: '保持 (giữ) + 积极的 (tích cực) + 心态 (tâm thế) = giữ tâm thế tích cực.' },
]);

const b7 = doc('chs301-7-1-debate', 'Lesson 7 — Debate with rebuttal|||Bài 7 — Tranh luận có phản biện',
  'Mẫu câu: 我不完全同意, 换个角度看, 首先…其次…最后…; từ 辩论/观点/正方反方/理由; luyện tranh luận và phản biện.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 7 · Debate</span>
<h2>Debate with rebuttal</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>辩论</td><td>biànlùn</td><td>debate</td></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>viewpoint</td></tr>
<tr><td>正方</td><td>zhèngfāng</td><td>the affirmative side</td></tr>
<tr><td>反方</td><td>fǎnfāng</td><td>the negative side</td></tr>
<tr><td>支持</td><td>zhīchí</td><td>to support</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>to oppose</td></tr>
<tr><td>理由</td><td>lǐyóu</td><td>reason</td></tr>
<tr><td>说服</td><td>shuōfú</td><td>to persuade</td></tr>
<tr><td>立场</td><td>lìchǎng</td><td>stance, position</td></tr>
<tr><td>角度</td><td>jiǎodù</td><td>angle, perspective</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>我不完全同意</strong> wǒ bù wánquán tóngyì — I do not entirely agree.</li>
<li><strong>换个角度看…</strong> huàn ge jiǎodù kàn… — looking at it from another angle …</li>
<li><strong>你的理由是什么?</strong> nǐ de lǐyóu shì shénme? — what is your reason?</li>
<li><strong>首先…，其次…，最后…</strong> shǒuxiān…, qícì…, zuìhòu… — firstly …, secondly …, lastly …</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 我认为大学生应该先就业，你支持吗？ Wǒ rènwéi dàxuéshēng yīnggāi xiān jiùyè, nǐ zhīchí ma? (I think college students should get a job first, do you support that?)
B: 我不完全同意。换个角度看，继续读研究生也是一条好路。 Wǒ bù wánquán tóngyì. Huàn ge jiǎodù kàn, jìxù dú yánjiūshēng yě shì yì tiáo hǎo lù. (I do not entirely agree. From another angle, going on to grad school is also a good path.)
A: 你的理由是什么？ Nǐ de lǐyóu shì shénme? (What is your reason?)
B: 首先，学历更高；其次，机会更多；最后，也能提高能力。 Shǒuxiān, xuélì gèng gāo; qícì, jīhuì gèng duō; zuìhòu, yě néng tígāo nénglì. (Firstly, higher qualifications; secondly, more opportunities; lastly, it also improves ability.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> 我不完全同意 + 换个角度看 is the polite rebuttal frame — disagree, then offer a new angle. 首先…其次…最后… lines up your reasons so a listener can follow; pause a beat at each marker.</div>`,
    `<span class="eyebrow">CHS301 · Bài 7 · Tranh luận</span>
<h2>Tranh luận có phản biện</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>辩论</td><td>biànlùn</td><td>tranh luận</td></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>quan điểm</td></tr>
<tr><td>正方</td><td>zhèngfāng</td><td>bên ủng hộ</td></tr>
<tr><td>反方</td><td>fǎnfāng</td><td>bên phản đối</td></tr>
<tr><td>支持</td><td>zhīchí</td><td>ủng hộ</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>phản đối</td></tr>
<tr><td>理由</td><td>lǐyóu</td><td>lý do</td></tr>
<tr><td>说服</td><td>shuōfú</td><td>thuyết phục</td></tr>
<tr><td>立场</td><td>lìchǎng</td><td>lập trường</td></tr>
<tr><td>角度</td><td>jiǎodù</td><td>góc độ</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>我不完全同意</strong> wǒ bù wánquán tóngyì — tôi không hoàn toàn đồng ý.</li>
<li><strong>换个角度看…</strong> huàn ge jiǎodù kàn… — nhìn từ một góc khác …</li>
<li><strong>你的理由是什么?</strong> nǐ de lǐyóu shì shénme? — lý do của bạn là gì?</li>
<li><strong>首先…，其次…，最后…</strong> shǒuxiān…, qícì…, zuìhòu… — trước hết …, tiếp theo …, cuối cùng …</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 我认为大学生应该先就业，你支持吗？ Wǒ rènwéi dàxuéshēng yīnggāi xiān jiùyè, nǐ zhīchí ma? (Tôi cho rằng sinh viên nên đi làm trước, bạn ủng hộ không?)
B: 我不完全同意。换个角度看，继续读研究生也是一条好路。 Wǒ bù wánquán tóngyì. Huàn ge jiǎodù kàn, jìxù dú yánjiūshēng yě shì yì tiáo hǎo lù. (Tôi không hoàn toàn đồng ý. Nhìn từ góc khác, học tiếp cao học cũng là một con đường tốt.)
A: 你的理由是什么？ Nǐ de lǐyóu shì shénme? (Lý do của bạn là gì?)
B: 首先，学历更高；其次，机会更多；最后，也能提高能力。 Shǒuxiān, xuélì gèng gāo; qícì, jīhuì gèng duō; zuìhòu, yě néng tígāo nénglì. (Trước hết, bằng cấp cao hơn; tiếp theo, cơ hội nhiều hơn; cuối cùng, cũng nâng cao năng lực.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> 我不完全同意 + 换个角度看 là khung phản biện lịch sự — phản đối rồi đưa góc nhìn mới. 首先…其次…最后… xếp lý lẽ để người nghe theo được; ngắt một nhịp ở mỗi mốc.</div>`,
  ]]);

const b7q = quiz('chs301-quiz-7', 'Quiz 7 — Debate with rebuttal|||Quiz 7 — Tranh luận có phản biện', [
  { id: 'q1', question: '"我不完全同意" nghĩa là gì? / What does 我不完全同意 mean?', options: ['Tôi không hoàn toàn đồng ý|||I do not entirely agree', 'Tôi rất đồng ý|||I strongly agree', 'Tôi không hiểu|||I do not understand', 'Tôi không quan tâm|||I do not care'], correctIndex: 0, explanation: '不完全 (không hoàn toàn) + 同意 (đồng ý) — cách phản biện nhẹ nhàng.' },
  { id: 'q2', question: '"换个角度看" dùng để làm gì? / What is 换个角度看 for?', options: ['Đưa ra một góc nhìn khác|||Offer a different angle', 'Kết thúc buổi nói|||End the talk', 'Hỏi giờ|||Ask the time', 'Xin lỗi|||Apologize'], correctIndex: 0, explanation: '换个角度看 = đổi một góc mà nhìn — mời người nghe xét theo hướng khác.' },
  { id: 'q3', question: 'Bộ từ nào xếp lý lẽ "trước hết… tiếp theo… cuối cùng"? / Which set orders reasons?', options: ['首先…其次…最后…', '因为…所以…', '虽然…但是…', '一…就…'], correctIndex: 0, explanation: '首先 (trước hết) … 其次 (tiếp theo) … 最后 (cuối cùng) — khung liệt kê lý lẽ.' },
]);

const b8 = doc('chs301-8-1-presentation', 'Lesson 8 — Giving a short speech|||Bài 8 — Thuyết trình chủ đề',
  'Mẫu câu: 今天我想跟大家谈谈…, 我的主要论点是…, 比如说…, 综上所述…; từ 演讲/主题/论点/总结; luyện thuyết trình.',
  [[
    `<span class="eyebrow">CHS301 · Lesson 8 · Speech</span>
<h2>Giving a short speech</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>演讲</td><td>yǎnjiǎng</td><td>speech, to give a speech</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>theme, topic</td></tr>
<tr><td>开头</td><td>kāitóu</td><td>opening, beginning</td></tr>
<tr><td>论点</td><td>lùndiǎn</td><td>argument, main point</td></tr>
<tr><td>举例</td><td>jǔlì</td><td>to give an example</td></tr>
<tr><td>比如</td><td>bǐrú</td><td>for example</td></tr>
<tr><td>总结</td><td>zǒngjié</td><td>to summarize, conclusion</td></tr>
<tr><td>观众</td><td>guānzhòng</td><td>audience</td></tr>
<tr><td>准备</td><td>zhǔnbèi</td><td>to prepare</td></tr>
<tr><td>综上所述</td><td>zōng shàng suǒshù</td><td>in summary (formal)</td></tr>
</table>
<h3>Opinion patterns to say</h3>
<ul>
<li><strong>今天我想跟大家谈谈…</strong> jīntiān wǒ xiǎng gēn dàjiā tántan… — today I want to talk with everyone about …</li>
<li><strong>我的主要论点是…</strong> wǒ de zhǔyào lùndiǎn shì… — my main point is …</li>
<li><strong>比如说…</strong> bǐrú shuō… — for example …</li>
<li><strong>综上所述…</strong> zōng shàng suǒshù… — in summary …</li>
</ul>
<h3>Discussion dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你的演讲准备好了吗？ Nǐ de yǎnjiǎng zhǔnbèi hǎo le ma? (Is your speech ready?)
B: 准备好了。开头我会说：今天我想跟大家谈谈环保。 Zhǔnbèi hǎo le. Kāitóu wǒ huì shuō: jīntiān wǒ xiǎng gēn dàjiā tántan huánbǎo. (Ready. In the opening I will say: today I want to talk with everyone about the environment.)
A: 那你的主要论点是什么？ Nà nǐ de zhǔyào lùndiǎn shì shénme? (So what is your main point?)
B: 我的主要论点是保护环境要从小事做起，比如说垃圾分类。综上所述，人人有责。 Wǒ de zhǔyào lùndiǎn shì bǎohù huánjìng yào cóng xiǎoshì zuòqǐ, bǐrú shuō lājī fēnlèi. Zōng shàng suǒshù, rénrén yǒu zé. (My main point is that protecting the environment starts with small things, for example sorting garbage. In summary, everyone is responsible.)
</code></pre>
<div class="callout"><span class="badge">Intonation note</span> A short speech has four parts: 开头 (opening) → 论点 (points) → 举例 (examples) → 总结 (summary). Open with 今天我想跟大家谈谈…, and signal your conclusion with 综上所述.</div>`,
    `<span class="eyebrow">CHS301 · Bài 8 · Thuyết trình</span>
<h2>Thuyết trình chủ đề</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>演讲</td><td>yǎnjiǎng</td><td>thuyết trình, diễn thuyết</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>chủ đề</td></tr>
<tr><td>开头</td><td>kāitóu</td><td>phần mở đầu</td></tr>
<tr><td>论点</td><td>lùndiǎn</td><td>luận điểm</td></tr>
<tr><td>举例</td><td>jǔlì</td><td>nêu ví dụ</td></tr>
<tr><td>比如</td><td>bǐrú</td><td>ví dụ như</td></tr>
<tr><td>总结</td><td>zǒngjié</td><td>tổng kết, kết luận</td></tr>
<tr><td>观众</td><td>guānzhòng</td><td>khán giả</td></tr>
<tr><td>准备</td><td>zhǔnbèi</td><td>chuẩn bị</td></tr>
<tr><td>综上所述</td><td>zōng shàng suǒshù</td><td>tóm lại (trang trọng)</td></tr>
</table>
<h3>Mẫu câu diễn đạt quan điểm trọng tâm</h3>
<ul>
<li><strong>今天我想跟大家谈谈…</strong> jīntiān wǒ xiǎng gēn dàjiā tántan… — hôm nay tôi muốn cùng mọi người bàn về …</li>
<li><strong>我的主要论点是…</strong> wǒ de zhǔyào lùndiǎn shì… — luận điểm chính của tôi là …</li>
<li><strong>比如说…</strong> bǐrú shuō… — ví dụ như …</li>
<li><strong>综上所述…</strong> zōng shàng suǒshù… — tóm lại …</li>
</ul>
<h3>Hội thoại thảo luận — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你的演讲准备好了吗？ Nǐ de yǎnjiǎng zhǔnbèi hǎo le ma? (Bài thuyết trình của bạn chuẩn bị xong chưa?)
B: 准备好了。开头我会说：今天我想跟大家谈谈环保。 Zhǔnbèi hǎo le. Kāitóu wǒ huì shuō: jīntiān wǒ xiǎng gēn dàjiā tántan huánbǎo. (Xong rồi. Phần mở đầu tôi sẽ nói: hôm nay tôi muốn cùng mọi người bàn về bảo vệ môi trường.)
A: 那你的主要论点是什么？ Nà nǐ de zhǔyào lùndiǎn shì shénme? (Vậy luận điểm chính của bạn là gì?)
B: 我的主要论点是保护环境要从小事做起，比如说垃圾分类。综上所述，人人有责。 Wǒ de zhǔyào lùndiǎn shì bǎohù huánjìng yào cóng xiǎoshì zuòqǐ, bǐrú shuō lājī fēnlèi. Zōng shàng suǒshù, rénrén yǒu zé. (Luận điểm chính của tôi là bảo vệ môi trường phải bắt đầu từ việc nhỏ, ví dụ như phân loại rác. Tóm lại, ai cũng có trách nhiệm.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú ngữ điệu</span> Một bài thuyết trình ngắn có bốn phần: 开头 (mở đầu) → 论点 (luận điểm) → 举例 (ví dụ) → 总结 (tổng kết). Mở bằng 今天我想跟大家谈谈…, và báo hiệu kết luận bằng 综上所述.</div>`,
  ]]);

const b8q = quiz('chs301-quiz-8', 'Quiz 8 — Giving a short speech|||Quiz 8 — Thuyết trình chủ đề', [
  { id: 'q1', question: 'Câu nào mở đầu một bài thuyết trình? / Which sentence opens a speech?', options: ['今天我想跟大家谈谈…', '多少钱？', '你打错了', '我要投诉'], correctIndex: 0, explanation: '今天我想跟大家谈谈 … = hôm nay tôi muốn cùng mọi người bàn về … — câu mở đầu quen thuộc.' },
  { id: 'q2', question: '"综上所述" nghĩa là gì? / What does 综上所述 mean?', options: ['Tóm lại|||In summary', 'Ví dụ như|||For example', 'Trước hết|||Firstly', 'Ngược lại|||On the contrary'], correctIndex: 0, explanation: '综上所述 = tóm lại / in summary — báo hiệu phần kết luận, khá trang trọng.' },
  { id: 'q3', question: 'Bốn phần của một bài thuyết trình theo đúng thứ tự là? / The four parts of a speech in order are?', options: ['开头 → 论点 → 举例 → 总结', '总结 → 举例 → 开头 → 论点', '论点 → 开头 → 总结 → 举例', '举例 → 总结 → 论点 → 开头'], correctIndex: 0, explanation: 'Mở đầu (开头) → luận điểm (论点) → ví dụ (举例) → tổng kết (总结).' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CHS301',
    slug: 'chs301-chinese-speaking-4',
    title: 'Chinese Speaking 4',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHS301.webp',
    shortDescription: 'Spoken Chinese 4 (HSK4), after CHS201/CHS211: work & careers, education, technology, environment, culture, mental health, debate, giving a speech. Multi-turn discussion dialogues, opinion patterns, bilingual, quizzes.|||Tiếng Trung giao tiếp 4 (HSK4), nối tiếp CHS201/CHS211: công việc, giáo dục, công nghệ, môi trường, văn hoá, sức khoẻ tâm lý, tranh luận, thuyết trình. Hội thoại thảo luận nhiều lượt, nêu quan điểm, song ngữ, quiz.',
    description: 'Môn <strong>CHS301 — Chinese Speaking 4 (Tiếng Trung giao tiếp 4)</strong> là môn <strong>luyện nói</strong> ở trình độ khẩu ngữ <strong>HSK4</strong>, <strong>nối tiếp CHS201 / CHS211</strong>. Chuyển từ tình huống hằng ngày sang <strong>chủ đề trừu tượng &amp; thảo luận</strong>: <strong>công việc &amp; sự nghiệp</strong> → <strong>giáo dục</strong> → <strong>công nghệ</strong> → <strong>môi trường &amp; lối sống</strong> → <strong>văn hoá &amp; du lịch</strong> → <strong>sức khoẻ &amp; tâm lý</strong> → <strong>tranh luận có phản biện</strong> → <strong>thuyết trình chủ đề</strong>. Bám giáo trình khẩu ngữ chuẩn (汉语口语速成 中级篇 / HSK Standard Course 4), song ngữ Trung–Việt, mỗi bài có bảng từ vựng khẩu ngữ (汉字|pinyin|nghĩa), mẫu câu diễn đạt quan điểm trọng tâm, hội thoại thảo luận nhiều lượt để nói nhại, ghi chú phát âm/ngữ điệu và quiz. Học theo lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.',
    whatYouLearn: 'Nêu &amp; bảo vệ quan điểm về công việc (在我看来, 一方面…另一方面, 与其…不如); thảo luận giáo dục (从…的角度来看, 不但…而且, 我完全同意); bàn về công nghệ (随着…的发展, 凡事都有两面性, 我担心的是); môi trường &amp; lối sống (为了…我们应该, 只有…才能, 从小事做起); văn hoá &amp; du lịch (每个地方都有自己的, 我印象最深的是, 入乡随俗); sức khoẻ &amp; tâm lý (最近我感到, 保持积极的心态, 别把…放在心上); tranh luận có phản biện (我不完全同意, 换个角度看, 首先…其次…最后); thuyết trình chủ đề (今天我想跟大家谈谈, 我的主要论点是, 比如说, 综上所述). Nói được các đoạn thảo luận nhiều lượt với phát âm rõ và ý mạch lạc.',
    requirements: 'Nên học xong CHS201 &amp; CHS211 (giao tiếp HSK3: bản thân, lời khuyên, ý kiến, kể chuyện, nhà hàng, du lịch, phỏng vấn, so sánh) trước khi vào môn này. Cài Pleco hoặc HelloChinese để nghe audio bản ngữ &amp; luyện nói theo; hãy nói to và tự thu âm để so với mẫu, tập diễn đạt trọn một ý dài chứ không chỉ một câu.',
  },
  sections: [
    { title: '📚 Tài liệu &amp; lộ trình luyện nói|||📚 Course materials', description: 'Giáo trình khẩu ngữ 汉语口语速成 中级篇, app luyện nói, lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHS201/CHS211: mục tiêu giao tiếp HSK4, cách nêu &amp; bảo vệ quan điểm về chủ đề trừu tượng.', lessons: [intro] },
    { title: 'Bài 1 — Bàn về công việc &amp; sự nghiệp|||Lesson 1 — Work &amp; careers', description: '在我看来, 一方面…另一方面, 与其…不如, 跳槽, 平衡.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Thảo luận giáo dục|||Lesson 2 — Discussing education', description: '从…的角度来看, 不但…而且, 我完全同意, 补习班, 减负.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Quan điểm về công nghệ|||Lesson 3 — Views on technology', description: '随着…的发展, 凡事都有两面性, 我担心的是, 人工智能, 隐私.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Môi trường &amp; lối sống|||Lesson 4 — Environment &amp; lifestyle', description: '为了…我们应该, 只有…才能, 我不这么看, 低碳, 可持续.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Văn hoá &amp; du lịch|||Lesson 5 — Culture &amp; travel', description: '每个地方都有自己的, 我印象最深的是, 入乡随俗, 风俗, 尊重.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Sức khoẻ &amp; tâm lý|||Lesson 6 — Health &amp; the mind', description: '最近我感到, 保持积极的心态, 别把…放在心上, 情绪, 调整.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Tranh luận có phản biện|||Lesson 7 — Debate with rebuttal', description: '我不完全同意, 换个角度看, 首先…其次…最后, 理由, 立场.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Thuyết trình chủ đề|||Lesson 8 — Giving a short speech', description: '今天我想跟大家谈谈, 我的主要论点是, 比如说, 综上所述, 总结.', lessons: [b8, b8q] },
  ],
};
