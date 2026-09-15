/**
 * CLS301 — Chinese Listening &amp; Speaking Skills 3 (Kỹ năng Nghe - Nói
 * tiếng Trung 3). Khối Ngôn ngữ Trung FPTU, Kỳ 3. Đây là MÔN KỸ NĂNG
 * NGHE-NÓI, NỐI TIẾP CLS201 (HSK3): nâng lên trình độ HSK4, trọng tâm
 * NGHE HIỂU bài nói dài (độc thoại, bản tin, phỏng vấn) chứ không chỉ nói
 * theo tình huống ngắn. 8 chương: (1) tính cách & quan hệ (hội thoại sâu),
 * (2) học tập & chia sẻ kinh nghiệm, (3) công việc & phỏng vấn xin việc,
 * (4) xã hội/môi trường/thời sự, (5) văn hoá/phong tục/lễ hội TQ, (6) bày
 * tỏ & bảo vệ quan điểm/tranh luận, (7) thuyết trình trước đám đông, (8)
 * ôn tập: nghe bài nói dài + phỏng vấn giả lập + hội thoại nâng cao. Giáo
 * trình chuẩn: HSK Standard Course 4 (听说); Short-term Spoken Chinese —
 * Intermediate (北京大学出版社). Mỗi bài: bảng từ vựng (汉字|pinyin|nghĩa),
 * mẫu câu nghe hiểu, một đoạn nghe (độc thoại/hội thoại/phỏng vấn) để
 * shadow, và một mẹo nghe. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${}; trong HTML "&" → "&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng, mẫu câu & nghe hiểu của bài.', quiz: { timeLimitSeconds: 420, questions } });

const taiLieu = doc('cls301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình luyện nghe-nói',
  'Giáo trình chuẩn (HSK Standard Course 4 听说, Short-term Spoken Chinese Intermediate), công cụ luyện nghe, lộ trình 4 bước: Nghe ý chính → Nghe chi tiết → Nói lại tóm tắt → Ứng dụng.',
  [[
    `<span class="eyebrow">CLS301 · Materials</span>
<h2>Chinese Listening &amp; Speaking 3 — materials &amp; roadmap</h2>
<p class="lead">CLS301 continues <strong>CLS201</strong> and moves you to <strong>HSK4</strong>. The skill you are training shifts: instead of short situational exchanges, you now need to <strong>follow a long turn of speech</strong> — a monologue, a news bulletin, an interview, a debate, a speech — and hold your own inside it.</p>
<h3>📘 Standard textbooks (listening-speaking track)</h3>
<ul>
<li><strong>HSK Standard Course 4 (听说)</strong> — the listening-speaking companion volume, matched to HSK4 vocabulary &amp; grammar.</li>
<li><strong>Short-term Spoken Chinese — Intermediate</strong> (北京大学出版社 / Peking University Press) — dialogues built for shadowing at this level.</li>
</ul>
<h3>🎧 Listening practice tools</h3>
<ul>
<li><a href="https://www.hskonline.com/" target="_blank" rel="noopener">HSKOnline</a> — free HSK4 listening tests with audio &amp; transcripts.</li>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — graded listening &amp; speech-recognition drills.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese-Vietnamese dictionary with native audio.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real, unscripted conversations with subtitles.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured HSK4 listening lessons.</li>
</ul>
<div class="callout"><span class="badge">4-step listening-speaking path</span>
<ol>
<li><strong>Nghe ý chính (gist)</strong> — first pass: who is speaking, what is the topic, is the tone for/against.</li>
<li><strong>Nghe chi tiết (detail)</strong> — second pass: catch the connectives (但是/所以/除了…以外) that carry the structure.</li>
<li><strong>Nói lại tóm tắt (retell)</strong> — say the passage back in your own words, out loud.</li>
<li><strong>Ứng dụng (apply)</strong> — reuse the same pattern in your own opinion, interview answer, or short speech.</li>
</ol></div>`,
    `<span class="eyebrow">CLS301 · Tài liệu</span>
<h2>Kỹ năng Nghe - Nói tiếng Trung 3 — tài liệu &amp; lộ trình</h2>
<p class="lead">CLS301 nối tiếp <strong>CLS201</strong> và đưa bạn lên trình độ <strong>HSK4</strong>. Kỹ năng cần luyện đổi khác: thay vì đối thoại tình huống ngắn, giờ bạn phải <strong>theo kịp một lượt nói dài</strong> — độc thoại, bản tin, phỏng vấn, tranh luận, bài phát biểu — và giữ được vai trò của mình trong đó.</p>
<h3>📘 Giáo trình chuẩn (hướng nghe-nói)</h3>
<ul>
<li><strong>HSK Standard Course 4 (听说)</strong> — tập nghe-nói đi kèm, khớp từ vựng &amp; ngữ pháp HSK4.</li>
<li><strong>Short-term Spoken Chinese — Intermediate</strong> (北京大学出版社 / NXB Đại học Bắc Kinh) — hội thoại dựng riêng để luyện nói nhại ở trình độ này.</li>
</ul>
<h3>🎧 Công cụ luyện nghe</h3>
<ul>
<li><a href="https://www.hskonline.com/" target="_blank" rel="noopener">HSKOnline</a> — đề nghe HSK4 miễn phí, kèm audio &amp; bản ghi.</li>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — bài luyện nghe phân cấp &amp; nhận diện giọng nói.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung-Việt kèm audio bản ngữ.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật, không kịch bản, có phụ đề.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài nghe HSK4 có hệ thống.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước nghe-nói</span>
<ol>
<li><strong>Nghe ý chính</strong> — lượt đầu: ai đang nói, chủ đề gì, thái độ ủng hộ hay phản đối.</li>
<li><strong>Nghe chi tiết</strong> — lượt hai: bắt các từ nối (但是/所以/除了…以外) mang cấu trúc bài nói.</li>
<li><strong>Nói lại tóm tắt</strong> — kể lại đoạn nghe bằng lời của bạn, nói thành tiếng.</li>
<li><strong>Ứng dụng</strong> — dùng lại mẫu câu đó trong ý kiến, câu trả lời phỏng vấn, hoặc bài nói ngắn của chính bạn.</li>
</ol></div>`,
  ]]);

const intro = doc('cls301-0-1-overview', 'Course overview: Chinese Listening & Speaking 3|||Tổng quan: Kỹ năng Nghe - Nói tiếng Trung 3',
  'Nối tiếp CLS201 (HSK3): nâng lên HSK4, trọng tâm nghe hiểu bài nói dài — độc thoại, bản tin, phỏng vấn, tranh luận, thuyết trình — không lặp lại hội thoại tình huống ngắn của cấp dưới.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 0.1 · Overview</span>
<h2>Chinese Listening &amp; Speaking 3 (HSK4)</h2>
<p class="lead">This course <strong>continues CLS201</strong>. There, you handled short situational exchanges. Here, the exam and real life both demand more: understanding a <strong>long turn of speech</strong> — a friend describing someone's personality, a news report, a job interview, a debate, a speech to an audience — and speaking back inside that same register.</p>
<h3>What changes at HSK4</h3>
<ul>
<li><strong>Length</strong> — passages run several sentences with more than one idea; you must track the structure, not just isolated words.</li>
<li><strong>Register</strong> — reporting phrases (据…了解/据报道), concession-rebuttal (我不否认…，但是…), and speech signposting (首先…接下来…最后) replace simple situational sentences.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives a <strong>listening vocabulary &amp; phrase table</strong> (汉字 | pinyin | nghĩa), the <strong>listening patterns</strong> that carry the topic's structure, a <strong>listening passage</strong> (monologue, interview or debate) to shadow and retell, and a <strong>listening tip</strong>. Then a short quiz. Always run the 4 steps: gist → detail → retell → apply.</p>
<h3>Roadmap</h3>
<p>Personality &amp; relationships → study methods &amp; sharing experience → work &amp; job interviews → society &amp; current events → Chinese culture &amp; festivals → stating &amp; defending an opinion, debate → public speaking → review: long passages, a simulated interview &amp; advanced dialogue.</p>`,
    `<span class="eyebrow">CLS301 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng Nghe - Nói tiếng Trung 3 (HSK4)</h2>
<p class="lead">Môn này <strong>nối tiếp CLS201</strong>. Ở đó bạn xử lý hội thoại tình huống ngắn. Ở đây, cả đề thi lẫn đời thực đều đòi hỏi nhiều hơn: hiểu được một <strong>lượt nói dài</strong> — bạn bè kể tính cách một người, bản tin thời sự, phỏng vấn xin việc, tranh luận, bài phát biểu trước đám đông — và nói lại được đúng giọng điệu đó.</p>
<h3>HSK4 khác gì</h3>
<ul>
<li><strong>Độ dài</strong> — đoạn nghe kéo dài nhiều câu, mang hơn một ý; bạn phải theo dõi cấu trúc chứ không chỉ từng từ rời rạc.</li>
<li><strong>Văn phong</strong> — cụm tường thuật (据…了解/据报道), nhượng bộ-phản bác (我不否认…，但是…), và cách dẫn dắt bài nói (首先…接下来…最后) thay cho câu tình huống đơn giản.</li>
</ul>
<h3>Mỗi bài học có gì</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu nghe hiểu</strong> (汉字 | pinyin | nghĩa), các <strong>mẫu câu nghe hiểu</strong> mang cấu trúc của chủ đề, một <strong>đoạn nghe</strong> (độc thoại, phỏng vấn hoặc tranh luận) để nói nhại &amp; kể lại, và một <strong>mẹo nghe</strong>. Sau đó là quiz ngắn. Luôn chạy đủ 4 bước: ý chính → chi tiết → kể lại → ứng dụng.</p>
<h3>Lộ trình</h3>
<p>Tính cách &amp; quan hệ → học tập &amp; chia sẻ kinh nghiệm → công việc &amp; phỏng vấn xin việc → xã hội &amp; thời sự → văn hoá &amp; lễ hội Trung Quốc → bày tỏ &amp; bảo vệ quan điểm, tranh luận → thuyết trình trước đám đông → ôn tập: bài nói dài, phỏng vấn giả lập &amp; hội thoại nâng cao.</p>`,
  ]]);

const b1 = doc('cls301-1-1-personality-relationships', 'Lesson 1 — Personality & relationships|||Bài 1 — Tính cách & quan hệ con người',
  'Mẫu câu: 据我了解…, 说实话…, 只要…就…, 不管…都…; từ 性格/外向/内向/相处/矛盾; nghe một đoạn kể sâu về tính cách một người bạn.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 1 · Personality</span>
<h2>Personality &amp; relationships — listening in depth</h2>
<h3>Listening vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>性格</td><td>xìnggé</td><td>personality</td></tr>
<tr><td>外向</td><td>wàixiàng</td><td>outgoing, extroverted</td></tr>
<tr><td>内向</td><td>nèixiàng</td><td>introverted</td></tr>
<tr><td>脾气</td><td>píqi</td><td>temper</td></tr>
<tr><td>相处</td><td>xiāngchǔ</td><td>to get along (with)</td></tr>
<tr><td>信任</td><td>xìnrèn</td><td>trust</td></tr>
<tr><td>矛盾</td><td>máodùn</td><td>conflict, disagreement</td></tr>
<tr><td>理解</td><td>lǐjiě</td><td>to understand</td></tr>
<tr><td>沟通</td><td>gōutōng</td><td>to communicate</td></tr>
<tr><td>包容</td><td>bāoróng</td><td>to be tolerant of</td></tr>
</table>
<h3>Listening patterns</h3>
<ul>
<li><strong>据我了解…</strong> jù wǒ liǎojiě… — as far as I understand … (signals a report of what the speaker knows).</li>
<li><strong>说实话…</strong> shuō shíhuà… — to be honest … (signals a candid opinion is coming).</li>
<li><strong>只要…，就…</strong> zhǐyào…, jiù… — as long as …, then … (condition–result, common in long turns).</li>
<li><strong>不管…，都…</strong> bùguǎn…, dōu… — no matter …, still … (a concession right before the speaker's real point).</li>
</ul>
<h3>Listening passage — a friend's personality (monologue)</h3>
<pre><code>我想跟大家说说我的室友小李。小李是一个很外向的人，说实话，他刚认识的时候话不多，但熟了以后特别爱说笑。 Wǒ xiǎng gēn dàjiā shuōshuo wǒ de shìyǒu Xiǎo Lǐ. Xiǎo Lǐ shì yí ge hěn wàixiàng de rén, shuō shíhuà, tā gāng rènshi de shíhou huà bù duō, dàn shúle yǐhòu tèbié ài shuōxiào. (I want to tell everyone about my roommate Xiao Li. Xiao Li is a very outgoing person — to be honest, he didn't talk much when we first met, but once we got close he loves joking around.)
我们俩性格不太一样，我比较内向，一开始相处得并不轻松，有过一些小矛盾。 Wǒmen liǎ xìnggé bú tài yíyàng, wǒ bǐjiào nèixiàng, yì kāishǐ xiāngchǔ de bìng bù qīngsōng, yǒuguò yìxiē xiǎo máodùn. (Our personalities aren't very alike; I'm more introverted, so getting along wasn't easy at first — we had a few small conflicts.)
不过只要多沟通、互相理解，不管性格差多少，都能处成好朋友。据我了解，这也是很多人的经验。 Búguò zhǐyào duō gōutōng, hùxiāng lǐjiě, bùguǎn xìnggé chà duōshao, dōu néng chǔ chéng hǎo péngyou. Jù wǒ liǎojiě, zhè yě shì hěn duō rén de jīngyàn. (But as long as you communicate a lot and understand each other, no matter how different your personalities are, you can still become good friends. As far as I know, that's many people's experience too.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> A long monologue usually opens with the topic (小李是一个…人), gives one contrasting detail (但是/可是), then closes with a wrap-up opinion (不过/所以). Follow that three-beat shape rather than every single word — the last sentence usually carries the main point.</div>`,
    `<span class="eyebrow">CLS301 · Bài 1 · Tính cách</span>
<h2>Tính cách &amp; quan hệ con người — nghe sâu</h2>
<h3>Từ vựng &amp; mẫu câu nghe hiểu</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>性格</td><td>xìnggé</td><td>tính cách</td></tr>
<tr><td>外向</td><td>wàixiàng</td><td>hướng ngoại</td></tr>
<tr><td>内向</td><td>nèixiàng</td><td>hướng nội</td></tr>
<tr><td>脾气</td><td>píqi</td><td>tính khí</td></tr>
<tr><td>相处</td><td>xiāngchǔ</td><td>chung sống, hoà hợp</td></tr>
<tr><td>信任</td><td>xìnrèn</td><td>tin tưởng</td></tr>
<tr><td>矛盾</td><td>máodùn</td><td>mâu thuẫn</td></tr>
<tr><td>理解</td><td>lǐjiě</td><td>thấu hiểu</td></tr>
<tr><td>沟通</td><td>gōutōng</td><td>giao tiếp, trao đổi</td></tr>
<tr><td>包容</td><td>bāoróng</td><td>bao dung</td></tr>
</table>
<h3>Mẫu câu nghe hiểu</h3>
<ul>
<li><strong>据我了解…</strong> jù wǒ liǎojiě… — theo tôi được biết … (báo hiệu người nói sắp thuật lại điều họ biết).</li>
<li><strong>说实话…</strong> shuō shíhuà… — nói thật thì … (báo hiệu một ý kiến thẳng thắn sắp tới).</li>
<li><strong>只要…，就…</strong> zhǐyào…, jiù… — chỉ cần …, thì … (điều kiện–kết quả, hay gặp trong lượt nói dài).</li>
<li><strong>不管…，都…</strong> bùguǎn…, dōu… — bất kể …, vẫn … (nhượng bộ, ngay trước ý chính của người nói).</li>
</ul>
<h3>Đoạn nghe — kể sâu về tính cách một người bạn</h3>
<pre><code>我想跟大家说说我的室友小李。小李是一个很外向的人，说实话，他刚认识的时候话不多，但熟了以后特别爱说笑。 Wǒ xiǎng gēn dàjiā shuōshuo wǒ de shìyǒu Xiǎo Lǐ. Xiǎo Lǐ shì yí ge hěn wàixiàng de rén, shuō shíhuà, tā gāng rènshi de shíhou huà bù duō, dàn shúle yǐhòu tèbié ài shuōxiào. (Tôi muốn kể cho mọi người nghe về bạn cùng phòng Tiểu Lý. Tiểu Lý là người rất hướng ngoại — nói thật, lúc mới quen cậu ấy không nói nhiều, nhưng thân rồi thì rất thích đùa vui.)
我们俩性格不太一样，我比较内向，一开始相处得并不轻松，有过一些小矛盾。 Wǒmen liǎ xìnggé bú tài yíyàng, wǒ bǐjiào nèixiàng, yì kāishǐ xiāngchǔ de bìng bù qīngsōng, yǒuguò yìxiē xiǎo máodùn. (Tính cách hai đứa không giống nhau lắm, tôi hướng nội hơn, nên lúc đầu chung sống không dễ dàng, từng có vài mâu thuẫn nhỏ.)
不过只要多沟通、互相理解，不管性格差多少，都能处成好朋友。据我了解，这也是很多人的经验。 Búguò zhǐyào duō gōutōng, hùxiāng lǐjiě, bùguǎn xìnggé chà duōshao, dōu néng chǔ chéng hǎo péngyou. Jù wǒ liǎojiě, zhè yě shì hěn duō rén de jīngyàn. (Nhưng chỉ cần trao đổi nhiều, thấu hiểu lẫn nhau, thì bất kể tính cách khác nhau đến đâu, vẫn có thể trở thành bạn tốt. Theo tôi được biết, đó cũng là kinh nghiệm của nhiều người.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Một đoạn độc thoại dài thường mở bằng chủ đề (小李是一个…人), nêu một chi tiết đối lập (但是/可是), rồi chốt bằng ý kiến tổng kết (不过/所以). Bắt lấy khung ba nhịp đó thay vì từng từ một — câu cuối thường mang ý chính.</div>`,
  ]]);

const b1q = quiz('cls301-quiz-1', 'Quiz 1 — Personality & relationships|||Quiz 1 — Tính cách & quan hệ', [
  { id: 'q1', question: '"据我了解" nghĩa là gì? / What does 据我了解 mean?', options: ['Theo tôi được biết|||As far as I know', 'Nói thật thì|||To be honest', 'Bất kể thế nào|||No matter what', 'Chỉ cần vậy thôi|||As long as that'], correctIndex: 0, explanation: '据我了解 jù wǒ liǎojiě = theo tôi được biết — báo hiệu người nói sắp thuật lại điều mình biết.' },
  { id: 'q2', question: 'Theo đoạn nghe, Tiểu Lý lúc mới quen thế nào? / In the passage, how was Xiao Li when they first met?', options: ['Nói nhiều ngay từ đầu|||Talkative from the start', 'Ít nói, sau đó mới cởi mở|||Quiet at first, then opened up', 'Luôn im lặng|||Always silent', 'Hay tức giận|||Often angry'], correctIndex: 1, explanation: 'Bài nghe: 刚认识的时候话不多，但熟了以后特别爱说笑 — ít nói lúc đầu, thân rồi mới hay đùa vui.' },
  { id: 'q3', question: '"不管性格差多少，都能处成好朋友" ý nói gì? / What does this sentence mean?', options: ['Bất kể tính cách khác nhau ra sao vẫn có thể thành bạn tốt|||No matter how different, they can still become good friends', 'Tính cách khác nhau thì không thể làm bạn|||Different personalities can never be friends', 'Chỉ người hướng ngoại mới kết bạn được|||Only extroverts can make friends', 'Mâu thuẫn không bao giờ giải quyết được|||Conflicts can never be resolved'], correctIndex: 0, explanation: '不管…都… = bất kể…vẫn… — nhượng bộ rồi khẳng định vẫn có thể thành bạn tốt.' },
]);

const b2 = doc('cls301-2-1-study-methods', 'Lesson 2 — Study methods & sharing experience|||Bài 2 — Học tập, phương pháp & chia sẻ kinh nghiệm',
  'Mẫu câu: 据…介绍, 除了…以外，还…, 只有…才能…; từ 学习方法/效率/坚持/拖延/专注; nghe một đoạn chia sẻ kinh nghiệm học tập.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 2 · Study methods</span>
<h2>Study methods &amp; sharing experience</h2>
<h3>Listening vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>学习方法</td><td>xuéxí fāngfǎ</td><td>study method</td></tr>
<tr><td>效率</td><td>xiàolǜ</td><td>efficiency</td></tr>
<tr><td>复习</td><td>fùxí</td><td>to review</td></tr>
<tr><td>计划</td><td>jìhuà</td><td>plan</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>to persist</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>experience</td></tr>
<tr><td>分享</td><td>fēnxiǎng</td><td>to share</td></tr>
<tr><td>重点</td><td>zhòngdiǎn</td><td>key point, focus</td></tr>
<tr><td>拖延</td><td>tuōyán</td><td>to procrastinate</td></tr>
<tr><td>专注</td><td>zhuānzhù</td><td>to focus</td></tr>
</table>
<h3>Listening patterns</h3>
<ul>
<li><strong>据…介绍</strong> jù…jièshào — according to what … explains/shares.</li>
<li><strong>除了…以外，还…</strong> chúle…yǐwài, hái… — besides …, also … (adds a second point).</li>
<li><strong>只有…，才能…</strong> zhǐyǒu…, cáinéng… — only by …, can one … (a strict condition for the result).</li>
</ul>
<h3>Listening passage — sharing a study method (monologue)</h3>
<pre><code>今天我想跟大家分享一下我的学习方法和经验。据我自己的经验介绍，最重要的是制定一个学习计划，每天安排好复习的时间。 Jīntiān wǒ xiǎng gēn dàjiā fēnxiǎng yíxià wǒ de xuéxí fāngfǎ hé jīngyàn. Jù wǒ zìjǐ de jīngyàn jièshào, zuì zhòngyào de shì zhìdìng yí ge xuéxí jìhuà, měitiān ānpái hǎo fùxí de shíjiān. (Today I want to share my study methods and experience. Based on my own experience, the most important thing is to make a study plan and set aside a fixed review time every day.)
除了制定计划以外，还要抓住重点，不要每个知识点都平均用力。 Chúle zhìdìng jìhuà yǐwài, hái yào zhuāzhù zhòngdiǎn, búyào měi ge zhīshidiǎn dōu píngjūn yònglì. (Besides making a plan, you also need to grasp the key points — don't spread equal effort across every single point.)
我以前很容易拖延，后来发现只有专注地学习一段时间，才能真正提高效率，坚持下来就会有进步。 Wǒ yǐqián hěn róngyì tuōyán, hòulái fāxiàn zhǐyǒu zhuānzhù de xuéxí yí duàn shíjiān, cáinéng zhēnzhèng tígāo xiàolǜ, jiānchí xiàlái jiù huì yǒu jìnbù. (I used to procrastinate easily; later I found that only by focusing on studying for a stretch of time could I truly raise my efficiency — keep it up and you'll make progress.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Experience-sharing talks step through with 除了…以外/后来/只有…才能 — each connector marks a new point. The word right after 最重要的是 or inside 只有…才能 is usually the exam's target answer.</div>`,
    `<span class="eyebrow">CLS301 · Bài 2 · Học tập</span>
<h2>Học tập, phương pháp &amp; chia sẻ kinh nghiệm</h2>
<h3>Từ vựng &amp; mẫu câu nghe hiểu</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>学习方法</td><td>xuéxí fāngfǎ</td><td>phương pháp học tập</td></tr>
<tr><td>效率</td><td>xiàolǜ</td><td>hiệu suất</td></tr>
<tr><td>复习</td><td>fùxí</td><td>ôn tập</td></tr>
<tr><td>计划</td><td>jìhuà</td><td>kế hoạch</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>kiên trì</td></tr>
<tr><td>经验</td><td>jīngyàn</td><td>kinh nghiệm</td></tr>
<tr><td>分享</td><td>fēnxiǎng</td><td>chia sẻ</td></tr>
<tr><td>重点</td><td>zhòngdiǎn</td><td>trọng tâm</td></tr>
<tr><td>拖延</td><td>tuōyán</td><td>trì hoãn</td></tr>
<tr><td>专注</td><td>zhuānzhù</td><td>tập trung</td></tr>
</table>
<h3>Mẫu câu nghe hiểu</h3>
<ul>
<li><strong>据…介绍</strong> jù…jièshào — theo … cho biết/chia sẻ.</li>
<li><strong>除了…以外，还…</strong> chúle…yǐwài, hái… — ngoài …ra, còn … (thêm ý thứ hai).</li>
<li><strong>只有…，才能…</strong> zhǐyǒu…, cáinéng… — chỉ có …, mới có thể … (điều kiện chặt cho kết quả).</li>
</ul>
<h3>Đoạn nghe — chia sẻ phương pháp học tập</h3>
<pre><code>今天我想跟大家分享一下我的学习方法和经验。据我自己的经验介绍，最重要的是制定一个学习计划，每天安排好复习的时间。 Jīntiān wǒ xiǎng gēn dàjiā fēnxiǎng yíxià wǒ de xuéxí fāngfǎ hé jīngyàn. Jù wǒ zìjǐ de jīngyàn jièshào, zuì zhòngyào de shì zhìdìng yí ge xuéxí jìhuà, měitiān ānpái hǎo fùxí de shíjiān. (Hôm nay tôi muốn chia sẻ với mọi người phương pháp học tập và kinh nghiệm của mình. Theo kinh nghiệm của tôi, điều quan trọng nhất là lập một kế hoạch học tập, mỗi ngày sắp xếp sẵn thời gian ôn tập.)
除了制定计划以外，还要抓住重点，不要每个知识点都平均用力。 Chúle zhìdìng jìhuà yǐwài, hái yào zhuāzhù zhòngdiǎn, búyào měi ge zhīshidiǎn dōu píngjūn yònglì. (Ngoài lập kế hoạch ra, còn phải nắm chắc trọng tâm, đừng dồn đều sức cho mọi điểm kiến thức.)
我以前很容易拖延，后来发现只有专注地学习一段时间，才能真正提高效率，坚持下来就会有进步。 Wǒ yǐqián hěn róngyì tuōyán, hòulái fāxiàn zhǐyǒu zhuānzhù de xuéxí yí duàn shíjiān, cáinéng zhēnzhèng tígāo xiàolǜ, jiānchí xiàlái jiù huì yǒu jìnbù. (Trước đây tôi rất dễ trì hoãn, sau đó phát hiện chỉ có tập trung học trong một khoảng thời gian, mới thật sự nâng cao hiệu suất, kiên trì thì sẽ có tiến bộ.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Bài chia sẻ kinh nghiệm bước qua từng ý bằng 除了…以外/后来/只有…才能 — mỗi từ nối đánh dấu một ý mới. Từ ngay sau 最重要的是 hoặc bên trong 只有…才能 thường là đáp án đề thi nhắm tới.</div>`,
  ]]);

const b2q = quiz('cls301-quiz-2', 'Quiz 2 — Study methods & experience|||Quiz 2 — Học tập & kinh nghiệm', [
  { id: 'q1', question: 'Theo đoạn nghe, điều quan trọng nhất là gì? / What is the most important thing according to the passage?', options: ['Lập kế hoạch học tập, sắp xếp giờ ôn tập|||Make a study plan, fix a review time', 'Học thuộc lòng cả ngày|||Memorize all day', 'Chỉ nghe giảng, không tự ôn|||Only listen in class, never self-review', 'Đổi phương pháp mỗi tuần|||Change method every week'], correctIndex: 0, explanation: '最重要的是制定一个学习计划，每天安排好复习的时间 — lập kế hoạch & sắp xếp giờ ôn tập.' },
  { id: 'q2', question: '"只有专注地学习一段时间，才能真正提高效率" nghĩa là gì? / What does this sentence mean?', options: ['Chỉ khi tập trung học một thời gian mới thật sự nâng cao hiệu suất|||Only by focusing for a stretch can you truly raise efficiency', 'Học càng nhiều giờ càng tốt bất kể có tập trung hay không|||More hours are good regardless of focus', 'Hiệu suất không liên quan đến sự tập trung|||Efficiency has nothing to do with focus', 'Chỉ cần có kế hoạch là đủ, không cần tập trung|||A plan alone is enough, focus is not needed'], correctIndex: 0, explanation: '只有…才能… = chỉ có…mới có thể… — điều kiện bắt buộc để đạt hiệu suất thật sự.' },
  { id: 'q3', question: '"拖延" (tuōyán) nghĩa là gì? / What does 拖延 mean?', options: ['Trì hoãn|||To procrastinate', 'Tập trung|||To focus', 'Chia sẻ|||To share', 'Ôn tập|||To review'], correctIndex: 0, explanation: '拖延 tuōyán = trì hoãn, để việc lại sau — điều người nói từng mắc phải.' },
]);

const b3 = doc('cls301-3-1-job-interview', 'Lesson 3 — Work, job interviews & careers|||Bài 3 — Công việc, phỏng vấn xin việc & nghề nghiệp',
  'Mẫu câu: 请您介绍一下…, 我认为自己的优势是…, 如果…的话，我会…; từ 面试/简历/应聘/优势/胜任; nghe một đoạn phỏng vấn xin việc giả lập.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 3 · Job interview</span>
<h2>Work, job interviews &amp; careers</h2>
<h3>Listening vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>面试</td><td>miànshì</td><td>job interview</td></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>résumé, CV</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>to apply for a job</td></tr>
<tr><td>岗位</td><td>gǎngwèi</td><td>position, post</td></tr>
<tr><td>优势</td><td>yōushì</td><td>strength, advantage</td></tr>
<tr><td>团队合作</td><td>tuánduì hézuò</td><td>teamwork</td></tr>
<tr><td>薪资</td><td>xīnzī</td><td>salary</td></tr>
<tr><td>录用</td><td>lùyòng</td><td>to hire</td></tr>
<tr><td>经历</td><td>jīnglì</td><td>experience, background</td></tr>
<tr><td>胜任</td><td>shèngrèn</td><td>to be competent for (a job)</td></tr>
</table>
<h3>Listening patterns</h3>
<ul>
<li><strong>请您介绍一下…</strong> qǐng nín jièshào yíxià… — please introduce/tell us a bit about … (an interviewer's opener).</li>
<li><strong>我认为自己的优势是…</strong> wǒ rènwéi zìjǐ de yōushì shì… — I think my strength is … (a candidate's self-marketing line).</li>
<li><strong>如果…的话，我会…</strong> rúguǒ…de huà, wǒ huì… — if …, I would … (hypothetical answer frame).</li>
</ul>
<h3>Listening passage — a simulated job interview</h3>
<pre><code>A（面试官）: 您好，请您先做一下自我介绍，然后说说您为什么应聘这个岗位。 Nín hǎo, qǐng nín xiān zuò yíxià zìwǒ jièshào, ránhòu shuōshuo nín wèishénme yìngpìn zhège gǎngwèi. (Hello, please introduce yourself first, then tell us why you're applying for this position.)
B（应聘者）: 您好，我叫王芳，学的是市场营销专业，有两年相关工作经历。我认为自己的优势是善于团队合作，也很有责任心。 Nín hǎo, wǒ jiào Wáng Fāng, xué de shì shìchǎng yíngxiāo zhuānyè, yǒu liǎng nián xiāngguān gōngzuò jīnglì. Wǒ rènwéi zìjǐ de yōushì shì shànyú tuánduì hézuò, yě hěn yǒu zérènxīn. (Hello, my name is Wang Fang. I studied marketing and have two years of related work experience. I think my strengths are that I'm good at teamwork and very responsible.)
A: 如果我们录用您的话，您希望的薪资是多少？ Rúguǒ wǒmen lùyòng nín de huà, nín xīwàng de xīnzī shì duōshao? (If we hire you, what salary would you expect?)
B: 这个可以商量，我更看重的是这个岗位能不能让我发挥自己的优势，我相信自己完全能胜任这份工作。 Zhège kěyǐ shāngliang, wǒ gèng kànzhòng de shì zhège gǎngwèi néng bu néng ràng wǒ fāhuī zìjǐ de yōushì, wǒ xiāngxìn zìjǐ wánquán néng shèngrèn zhè fèn gōngzuò. (That's negotiable — what matters more to me is whether this position lets me use my strengths; I believe I can fully handle this job.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Track who is speaking — 面试官 (interviewer) asks, 应聘者 (candidate) answers. The candidate's strongest self-marketing sentence usually follows 我认为自己的优势是 or 我相信自己 — that is what a "what does the candidate claim" question targets.</div>`,
    `<span class="eyebrow">CLS301 · Bài 3 · Phỏng vấn</span>
<h2>Công việc, phỏng vấn xin việc &amp; nghề nghiệp</h2>
<h3>Từ vựng &amp; mẫu câu nghe hiểu</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>面试</td><td>miànshì</td><td>phỏng vấn</td></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>sơ yếu lý lịch, CV</td></tr>
<tr><td>应聘</td><td>yìngpìn</td><td>ứng tuyển</td></tr>
<tr><td>岗位</td><td>gǎngwèi</td><td>vị trí việc làm</td></tr>
<tr><td>优势</td><td>yōushì</td><td>thế mạnh</td></tr>
<tr><td>团队合作</td><td>tuánduì hézuò</td><td>làm việc nhóm</td></tr>
<tr><td>薪资</td><td>xīnzī</td><td>lương</td></tr>
<tr><td>录用</td><td>lùyòng</td><td>tuyển dụng, nhận vào làm</td></tr>
<tr><td>经历</td><td>jīnglì</td><td>kinh nghiệm, trải nghiệm</td></tr>
<tr><td>胜任</td><td>shèngrèn</td><td>đảm đương được, đủ năng lực</td></tr>
</table>
<h3>Mẫu câu nghe hiểu</h3>
<ul>
<li><strong>请您介绍一下…</strong> qǐng nín jièshào yíxià… — xin anh/chị giới thiệu một chút về … (câu mở đầu của người phỏng vấn).</li>
<li><strong>我认为自己的优势是…</strong> wǒ rènwéi zìjǐ de yōushì shì… — tôi nghĩ thế mạnh của mình là … (câu "bán mình" của ứng viên).</li>
<li><strong>如果…的话，我会…</strong> rúguǒ…de huà, wǒ huì… — nếu … thì tôi sẽ … (khung trả lời giả định).</li>
</ul>
<h3>Đoạn nghe — một cuộc phỏng vấn xin việc giả lập</h3>
<pre><code>A（面试官）: 您好，请您先做一下自我介绍，然后说说您为什么应聘这个岗位。 Nín hǎo, qǐng nín xiān zuò yíxià zìwǒ jièshào, ránhòu shuōshuo nín wèishénme yìngpìn zhège gǎngwèi. (Chào bạn, mời bạn tự giới thiệu trước, sau đó cho biết vì sao bạn ứng tuyển vị trí này.)
B（应聘者）: 您好，我叫王芳，学的是市场营销专业，有两年相关工作经历。我认为自己的优势是善于团队合作，也很有责任心。 Nín hǎo, wǒ jiào Wáng Fāng, xué de shì shìchǎng yíngxiāo zhuānyè, yǒu liǎng nián xiāngguān gōngzuò jīnglì. Wǒ rènwéi zìjǐ de yōushì shì shànyú tuánduì hézuò, yě hěn yǒu zérènxīn. (Chào anh/chị, em tên là Vương Phương, học ngành marketing, có hai năm kinh nghiệm liên quan. Em nghĩ thế mạnh của mình là giỏi làm việc nhóm và có tinh thần trách nhiệm.)
A: 如果我们录用您的话，您希望的薪资是多少？ Rúguǒ wǒmen lùyòng nín de huà, nín xīwàng de xīnzī shì duōshao? (Nếu chúng tôi nhận bạn, bạn mong muốn mức lương bao nhiêu?)
B: 这个可以商量，我更看重的是这个岗位能不能让我发挥自己的优势，我相信自己完全能胜任这份工作。 Zhège kěyǐ shāngliang, wǒ gèng kànzhòng de shì zhège gǎngwèi néng bu néng ràng wǒ fāhuī zìjǐ de yōushì, wǒ xiāngxìn zìjǐ wánquán néng shèngrèn zhè fèn gōngzuò. (Cái này có thể thương lượng, điều em coi trọng hơn là vị trí này có cho em phát huy thế mạnh hay không, em tin mình hoàn toàn đảm đương được công việc này.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Theo dõi ai đang nói — 面试官 (người phỏng vấn) hỏi, 应聘者 (ứng viên) trả lời. Câu "bán mình" mạnh nhất của ứng viên thường theo sau 我认为自己的优势是 hoặc 我相信自己 — đó chính là điểm câu hỏi "ứng viên khẳng định gì" nhắm tới.</div>`,
  ]]);

const b3q = quiz('cls301-quiz-3', 'Quiz 3 — Job interviews & careers|||Quiz 3 — Phỏng vấn & nghề nghiệp', [
  { id: 'q1', question: '"我认为自己的优势是善于团队合作" ứng viên đang làm gì? / What is the candidate doing in this sentence?', options: ['Nêu thế mạnh của bản thân|||Stating her own strength', 'Hỏi về mức lương|||Asking about salary', 'Từ chối công việc|||Declining the job', 'Giới thiệu công ty|||Introducing the company'], correctIndex: 0, explanation: '我认为自己的优势是… = tôi nghĩ thế mạnh của mình là… — câu nêu thế mạnh bản thân, thường gặp khi trả lời phỏng vấn.' },
  { id: 'q2', question: 'Ứng viên coi trọng điều gì hơn mức lương? / What does the candidate value more than salary?', options: ['Vị trí có cho phát huy thế mạnh hay không|||Whether the position lets her use her strengths', 'Giờ làm việc ngắn|||Short working hours', 'Được làm việc một mình|||Working alone', 'Không phải phỏng vấn lại|||Not being interviewed again'], correctIndex: 0, explanation: '我更看重的是这个岗位能不能让我发挥自己的优势 — coi trọng việc phát huy thế mạnh hơn lương.' },
  { id: 'q3', question: '"胜任" (shèngrèn) nghĩa là gì? / What does 胜任 mean?', options: ['Đủ năng lực đảm đương (công việc)|||To be competent for (a job)', 'Từ chối|||To decline', 'Ứng tuyển|||To apply', 'Sa thải|||To fire'], correctIndex: 0, explanation: '胜任 shèngrèn = đủ khả năng đảm đương một công việc.' },
]);

const b4 = doc('cls301-4-1-society-current-events', 'Lesson 4 — Society, environment & current events|||Bài 4 — Xã hội, môi trường & vấn đề thời sự',
  'Mẫu câu: 据报道…, 随着…的发展…, 为了解决这个问题…; từ 社会问题/环境污染/措施/可持续发展; nghe một bản tin thời sự ngắn.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 4 · Current events</span>
<h2>Society, environment &amp; current events</h2>
<h3>Listening vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>社会问题</td><td>shèhuì wèntí</td><td>social issue</td></tr>
<tr><td>环境污染</td><td>huánjìng wūrǎn</td><td>environmental pollution</td></tr>
<tr><td>现象</td><td>xiànxiàng</td><td>phenomenon</td></tr>
<tr><td>引起关注</td><td>yǐnqǐ guānzhù</td><td>to draw attention</td></tr>
<tr><td>新闻报道</td><td>xīnwén bàodào</td><td>news report</td></tr>
<tr><td>老龄化</td><td>lǎolínghuà</td><td>population aging</td></tr>
<tr><td>资源</td><td>zīyuán</td><td>resource</td></tr>
<tr><td>可持续发展</td><td>kě chíxù fāzhǎn</td><td>sustainable development</td></tr>
<tr><td>措施</td><td>cuòshī</td><td>measure, step taken</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>impact, to affect</td></tr>
</table>
<h3>Listening patterns</h3>
<ul>
<li><strong>据报道…</strong> jù bàodào… — according to reports … (opens a news item).</li>
<li><strong>随着…的发展…</strong> suízhe…de fāzhǎn… — as … develops … (states the cause).</li>
<li><strong>为了解决这个问题…</strong> wèile jiějué zhège wèntí… — in order to solve this problem … (introduces the fix).</li>
</ul>
<h3>Listening passage — a short news bulletin</h3>
<pre><code>据报道，最近这座城市的空气质量问题引起了不少市民的关注。 Jù bàodào, zuìjìn zhè zuò chéngshì de kōngqì zhìliàng wèntí yǐnqǐle bùshǎo shìmín de guānzhù. (According to reports, the air-quality issue in this city has recently drawn the attention of many residents.)
随着经济的发展，工厂和汽车越来越多，环境污染也变成了一个严重的社会问题。 Suízhe jīngjì de fāzhǎn, gōngchǎng hé qìchē yuè lái yuè duō, huánjìng wūrǎn yě biànchéngle yí ge yánzhòng de shèhuì wèntí. (With economic development, there are more and more factories and cars, and environmental pollution has also become a serious social problem.)
为了解决这个问题，政府已经采取了一些措施，比如说鼓励大家乘坐公共交通工具，推动可持续发展。 Wèile jiějué zhège wèntí, zhèngfǔ yǐjīng cǎiqǔle yìxiē cuòshī, bǐrú shuō gǔlì dàjiā chéngzuò gōnggòng jiāotōng gōngjù, tuīdòng kě chíxù fāzhǎn. (To solve this problem, the government has already taken some measures, such as encouraging people to take public transport, promoting sustainable development.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> News items follow a fixed shape: 据报道/最近 states the problem, 随着…的发展 gives the cause, 为了解决…政府采取了…措施 gives the fix. The "what measure was taken" question sits right after 比如说.</div>`,
    `<span class="eyebrow">CLS301 · Bài 4 · Thời sự</span>
<h2>Xã hội, môi trường &amp; vấn đề thời sự</h2>
<h3>Từ vựng &amp; mẫu câu nghe hiểu</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>社会问题</td><td>shèhuì wèntí</td><td>vấn đề xã hội</td></tr>
<tr><td>环境污染</td><td>huánjìng wūrǎn</td><td>ô nhiễm môi trường</td></tr>
<tr><td>现象</td><td>xiànxiàng</td><td>hiện tượng</td></tr>
<tr><td>引起关注</td><td>yǐnqǐ guānzhù</td><td>thu hút sự chú ý</td></tr>
<tr><td>新闻报道</td><td>xīnwén bàodào</td><td>bản tin, tin tức</td></tr>
<tr><td>老龄化</td><td>lǎolínghuà</td><td>già hoá dân số</td></tr>
<tr><td>资源</td><td>zīyuán</td><td>tài nguyên</td></tr>
<tr><td>可持续发展</td><td>kě chíxù fāzhǎn</td><td>phát triển bền vững</td></tr>
<tr><td>措施</td><td>cuòshī</td><td>biện pháp</td></tr>
<tr><td>影响</td><td>yǐngxiǎng</td><td>ảnh hưởng</td></tr>
</table>
<h3>Mẫu câu nghe hiểu</h3>
<ul>
<li><strong>据报道…</strong> jù bàodào… — theo báo cáo/tin đưa … (mở đầu một tin thời sự).</li>
<li><strong>随着…的发展…</strong> suízhe…de fāzhǎn… — cùng với sự phát triển của … (nêu nguyên nhân).</li>
<li><strong>为了解决这个问题…</strong> wèile jiějué zhège wèntí… — để giải quyết vấn đề này … (dẫn vào biện pháp).</li>
</ul>
<h3>Đoạn nghe — một bản tin thời sự ngắn</h3>
<pre><code>据报道，最近这座城市的空气质量问题引起了不少市民的关注。 Jù bàodào, zuìjìn zhè zuò chéngshì de kōngqì zhìliàng wèntí yǐnqǐle bùshǎo shìmín de guānzhù. (Theo tin đưa, gần đây vấn đề chất lượng không khí của thành phố này đã thu hút sự chú ý của không ít người dân.)
随着经济的发展，工厂和汽车越来越多，环境污染也变成了一个严重的社会问题。 Suízhe jīngjì de fāzhǎn, gōngchǎng hé qìchē yuè lái yuè duō, huánjìng wūrǎn yě biànchéngle yí ge yánzhòng de shèhuì wèntí. (Cùng với sự phát triển kinh tế, nhà máy và ô tô ngày càng nhiều, ô nhiễm môi trường cũng trở thành một vấn đề xã hội nghiêm trọng.)
为了解决这个问题，政府已经采取了一些措施，比如说鼓励大家乘坐公共交通工具，推动可持续发展。 Wèile jiějué zhège wèntí, zhèngfǔ yǐjīng cǎiqǔle yìxiē cuòshī, bǐrú shuō gǔlì dàjiā chéngzuò gōnggòng jiāotōng gōngjù, tuīdòng kě chíxù fāzhǎn. (Để giải quyết vấn đề này, chính phủ đã áp dụng một số biện pháp, ví dụ như khuyến khích mọi người đi phương tiện công cộng, thúc đẩy phát triển bền vững.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Bản tin đi theo một khung cố định: 据报道/最近 nêu vấn đề, 随着…的发展 nêu nguyên nhân, 为了解决…政府采取了…措施 nêu biện pháp. Câu hỏi "biện pháp nào được nêu ra" nằm ngay sau 比如说.</div>`,
  ]]);

const b4q = quiz('cls301-quiz-4', 'Quiz 4 — Society & current events|||Quiz 4 — Xã hội & thời sự', [
  { id: 'q1', question: 'Bản tin nói vấn đề gì của thành phố? / What problem does the news report mention?', options: ['Chất lượng không khí|||Air quality', 'Giá nhà tăng|||Rising housing prices', 'Thiếu nước sạch|||Water shortage', 'Kẹt xe|||Traffic jams'], correctIndex: 0, explanation: '最近这座城市的空气质量问题引起了不少市民的关注 — vấn đề chất lượng không khí.' },
  { id: 'q2', question: 'Theo bản tin, nguyên nhân ô nhiễm môi trường là gì? / What causes the pollution, per the report?', options: ['Nhà máy và ô tô ngày càng nhiều theo đà phát triển kinh tế|||More factories and cars as the economy develops', 'Dân số giảm|||Population decline', 'Thời tiết thay đổi thất thường|||Erratic weather', 'Thiếu cây xanh trong nhà|||Lack of houseplants'], correctIndex: 0, explanation: '随着经济的发展，工厂和汽车越来越多，环境污染也变成了…社会问题.' },
  { id: 'q3', question: 'Chính phủ đưa ra biện pháp gì? / What measure does the government take?', options: ['Khuyến khích đi phương tiện công cộng, thúc đẩy phát triển bền vững|||Encourage public transport, promote sustainable development', 'Cấm hoàn toàn ô tô|||Ban all cars', 'Đóng cửa mọi nhà máy|||Shut down all factories', 'Không làm gì cả|||Take no action'], correctIndex: 0, explanation: '鼓励大家乘坐公共交通工具，推动可持续发展 — khuyến khích giao thông công cộng, thúc đẩy bền vững.' },
]);

const b5 = doc('cls301-5-1-culture-festivals', 'Lesson 5 — Chinese culture, customs & festivals|||Bài 5 — Văn hoá, phong tục & lễ hội Trung Quốc',
  'Mẫu câu: 一提到…就会想到…, 每逢…的时候…, 象征着…; từ 春节/传统/习俗/团圆/红包; nghe một đoạn giới thiệu Tết Nguyên đán Trung Quốc.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 5 · Festivals</span>
<h2>Chinese culture, customs &amp; festivals</h2>
<h3>Listening vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>春节</td><td>chūnjié</td><td>Spring Festival (Chinese New Year)</td></tr>
<tr><td>中秋节</td><td>zhōngqiūjié</td><td>Mid-Autumn Festival</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>tradition</td></tr>
<tr><td>习俗</td><td>xísú</td><td>custom</td></tr>
<tr><td>团圆</td><td>tuányuán</td><td>reunion (of family)</td></tr>
<tr><td>拜年</td><td>bàinián</td><td>to pay a New Year visit</td></tr>
<tr><td>红包</td><td>hóngbāo</td><td>red envelope (lucky money)</td></tr>
<tr><td>庆祝</td><td>qìngzhù</td><td>to celebrate</td></tr>
<tr><td>象征</td><td>xiàngzhēng</td><td>symbol; to symbolize</td></tr>
<tr><td>传承</td><td>chuánchéng</td><td>to pass down (a tradition)</td></tr>
</table>
<h3>Listening patterns</h3>
<ul>
<li><strong>一提到…就会想到…</strong> yì tídào…jiù huì xiǎngdào… — as soon as … is mentioned, one thinks of … (introduces a topic).</li>
<li><strong>每逢…的时候…</strong> měiféng…de shíhou… — every time … comes around … (marks a recurring custom).</li>
<li><strong>象征着…</strong> xiàngzhēngzhe… — it symbolizes … (states the meaning behind a custom).</li>
</ul>
<h3>Listening passage — introducing Spring Festival (monologue)</h3>
<pre><code>一提到中国的传统节日，大家可能就会想到春节。 Yì tídào Zhōngguó de chuántǒng jiérì, dàjiā kěnéng jiù huì xiǎngdào chūnjié. (When it comes to China's traditional festivals, most people probably think of Spring Festival right away.)
每逢春节的时候，全家人都要回家团圆，一起吃年夜饭，这象征着一家人和和美美。 Měiféng chūnjié de shíhou, quánjiā rén dōu yào huíjiā tuányuán, yìqǐ chī niányèfàn, zhè xiàngzhēngzhe yìjiā rén héhéměiměi. (Every time Spring Festival comes, the whole family goes home to reunite and eats the New Year's Eve dinner together, which symbolizes the family's harmony.)
除了团圆饭以外，孩子们还很喜欢拜年、收红包，这个习俗一直传承到现在。 Chúle tuányuánfàn yǐwài, háizimen hái hěn xǐhuan bàinián, shōu hóngbāo, zhège xísú yìzhí chuánchéng dào xiànzài. (Besides the reunion dinner, children also love paying New Year visits and receiving red envelopes — this custom has been passed down to today.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> A festival description follows "name it → what people do → what it symbolizes." Listen for 象征着 — the phrase right after it answers the classic "what does this custom mean" question.</div>`,
    `<span class="eyebrow">CLS301 · Bài 5 · Lễ hội</span>
<h2>Văn hoá, phong tục &amp; lễ hội Trung Quốc</h2>
<h3>Từ vựng &amp; mẫu câu nghe hiểu</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>春节</td><td>chūnjié</td><td>Tết Nguyên đán (TQ)</td></tr>
<tr><td>中秋节</td><td>zhōngqiūjié</td><td>Tết Trung thu</td></tr>
<tr><td>传统</td><td>chuántǒng</td><td>truyền thống</td></tr>
<tr><td>习俗</td><td>xísú</td><td>phong tục</td></tr>
<tr><td>团圆</td><td>tuányuán</td><td>đoàn viên, sum họp</td></tr>
<tr><td>拜年</td><td>bàinián</td><td>chúc Tết</td></tr>
<tr><td>红包</td><td>hóngbāo</td><td>bao lì xì</td></tr>
<tr><td>庆祝</td><td>qìngzhù</td><td>chúc mừng, kỷ niệm</td></tr>
<tr><td>象征</td><td>xiàngzhēng</td><td>biểu tượng; tượng trưng</td></tr>
<tr><td>传承</td><td>chuánchéng</td><td>kế thừa, truyền lại</td></tr>
</table>
<h3>Mẫu câu nghe hiểu</h3>
<ul>
<li><strong>一提到…就会想到…</strong> yì tídào…jiù huì xiǎngdào… — hễ nhắc đến … là nghĩ ngay đến … (dẫn vào chủ đề).</li>
<li><strong>每逢…的时候…</strong> měiféng…de shíhou… — mỗi khi đến dịp … (đánh dấu một phong tục lặp lại).</li>
<li><strong>象征着…</strong> xiàngzhēngzhe… — tượng trưng cho … (nêu ý nghĩa đằng sau một phong tục).</li>
</ul>
<h3>Đoạn nghe — giới thiệu Tết Nguyên đán Trung Quốc</h3>
<pre><code>一提到中国的传统节日，大家可能就会想到春节。 Yì tídào Zhōngguó de chuántǒng jiérì, dàjiā kěnéng jiù huì xiǎngdào chūnjié. (Hễ nhắc đến lễ hội truyền thống Trung Quốc, mọi người có lẽ sẽ nghĩ ngay đến Tết Nguyên đán.)
每逢春节的时候，全家人都要回家团圆，一起吃年夜饭，这象征着一家人和和美美。 Měiféng chūnjié de shíhou, quánjiā rén dōu yào huíjiā tuányuán, yìqǐ chī niányèfàn, zhè xiàngzhēngzhe yìjiā rén héhéměiměi. (Mỗi khi Tết đến, cả nhà đều về đoàn viên, cùng ăn bữa cơm tất niên, điều đó tượng trưng cho sự hoà thuận êm ấm của gia đình.)
除了团圆饭以外，孩子们还很喜欢拜年、收红包，这个习俗一直传承到现在。 Chúle tuányuánfàn yǐwài, háizimen hái hěn xǐhuan bàinián, shōu hóngbāo, zhège xísú yìzhí chuánchéng dào xiànzài. (Ngoài bữa cơm đoàn viên, trẻ con còn rất thích đi chúc Tết, nhận lì xì — phong tục này được truyền lại cho đến ngày nay.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Đoạn giới thiệu lễ hội theo khung "gọi tên → mọi người làm gì → tượng trưng điều gì". Bắt lấy 象征着 — cụm ngay sau nó chính là đáp án cho câu hỏi kinh điển "phong tục này mang ý nghĩa gì".</div>`,
  ]]);

const b5q = quiz('cls301-quiz-5', 'Quiz 5 — Culture & festivals|||Quiz 5 — Văn hoá & lễ hội', [
  { id: 'q1', question: 'Khi nhắc đến lễ hội truyền thống TQ, mọi người thường nghĩ đến gì? / What do people usually think of first?', options: ['春节 (Tết Nguyên đán)|||Spring Festival', '生日 (sinh nhật)|||Birthday', '婚礼 (đám cưới)|||Wedding', '毕业 (lễ tốt nghiệp)|||Graduation'], correctIndex: 0, explanation: '一提到中国的传统节日，大家可能就会想到春节.' },
  { id: 'q2', question: 'Bữa cơm tất niên (年夜饭) tượng trưng cho điều gì? / What does the reunion dinner symbolize?', options: ['Sự hoà thuận, êm ấm của gia đình|||The family\'s harmony', 'Sự giàu có|||Wealth', 'Sự may mắn trong công việc|||Career luck', 'Sức khoẻ dài lâu|||Long health'], correctIndex: 0, explanation: '这象征着一家人和和美美 — tượng trưng cho gia đình hoà thuận êm ấm.' },
  { id: 'q3', question: '"红包" (hóngbāo) là gì? / What is 红包?', options: ['Bao lì xì|||Red envelope (lucky money)', 'Món ăn ngày Tết|||A New Year dish', 'Câu đối đỏ|||A red couplet', 'Pháo hoa|||Fireworks'], correctIndex: 0, explanation: '红包 hóngbāo = bao lì xì, trẻ em nhận khi đi chúc Tết (拜年).' },
]);

const b6 = doc('cls301-6-1-opinion-debate', 'Lesson 6 — Stating & defending an opinion, debate|||Bài 6 — Bày tỏ & bảo vệ quan điểm, tranh luận',
  'Mẫu câu: 我不否认…，但是…, 换句话说…, 正如…所说…; từ 观点/反驳/立场/说服/客观; nghe một đoạn tranh luận hai chiều.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 6 · Debate</span>
<h2>Stating &amp; defending an opinion, debate</h2>
<h3>Listening vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>viewpoint, opinion</td></tr>
<tr><td>反驳</td><td>fǎnbó</td><td>to rebut</td></tr>
<tr><td>赞成</td><td>zànchéng</td><td>to agree with, be in favor</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>to oppose</td></tr>
<tr><td>论据</td><td>lùnjù</td><td>evidence, argument</td></tr>
<tr><td>立场</td><td>lìchǎng</td><td>stance, position</td></tr>
<tr><td>说服</td><td>shuōfú</td><td>to persuade</td></tr>
<tr><td>争论</td><td>zhēnglùn</td><td>to debate, argue</td></tr>
<tr><td>客观</td><td>kèguān</td><td>objective</td></tr>
<tr><td>片面</td><td>piànmiàn</td><td>one-sided</td></tr>
</table>
<h3>Listening patterns</h3>
<ul>
<li><strong>我不否认…，但是…</strong> wǒ bù fǒurèn…, dànshì… — I don't deny …, but … (concession, then the real point).</li>
<li><strong>换句话说…</strong> huàn jù huà shuō… — in other words … (a listener paraphrasing to confirm).</li>
<li><strong>正如…所说…</strong> zhèngrú…suǒ shuō… — just as … said … (cites outside support for a stance).</li>
</ul>
<h3>Listening passage — a two-sided debate</h3>
<pre><code>A: 我觉得现在的年轻人应该先创业，而不是先找一份稳定的工作。 Wǒ juéde xiànzài de niánqīngrén yīnggāi xiān chuàngyè, ér búshì xiān zhǎo yí fèn wěndìng de gōngzuò. (I think young people today should start a business first, rather than find a stable job first.)
B: 我不否认创业能锻炼人，但是风险也很大，大部分人其实并没有做好准备。 Wǒ bù fǒurèn chuàngyè néng duànliàn rén, dànshì fēngxiǎn yě hěn dà, dàbùfen rén qíshí bìng méiyǒu zuò hǎo zhǔnbèi. (I don't deny that starting a business builds character, but the risk is also great — most people actually aren't well prepared.)
A: 换句话说，你是觉得应该先积累经验，是吗？ Huàn jù huà shuō, nǐ shì juéde yīnggāi xiān jīlěi jīngyàn, shì ma? (In other words, you think one should accumulate experience first, right?)
B: 对，正如很多创业者所说，没有经验和资源，光有热情是不够的。这只是我的观点，不代表我完全反对创业。 Duì, zhèngrú hěn duō chuàngyèzhě suǒ shuō, méiyǒu jīngyàn hé zīyuán, guāng yǒu rèqíng shì bú gòu de. Zhè zhǐshì wǒ de guāndiǎn, bú dàibiǎo wǒ wánquán fǎnduì chuàngyè. (Right — as many entrepreneurs themselves say, without experience and resources, passion alone isn't enough. This is just my view; it doesn't mean I'm completely against starting a business.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> In a debate, catch the concession-then-rebuttal shape 我不否认…，但是… — the clause after 但是 usually carries the speaker's real stance, not the concession before it.</div>`,
    `<span class="eyebrow">CLS301 · Bài 6 · Tranh luận</span>
<h2>Bày tỏ &amp; bảo vệ quan điểm, tranh luận</h2>
<h3>Từ vựng &amp; mẫu câu nghe hiểu</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>quan điểm</td></tr>
<tr><td>反驳</td><td>fǎnbó</td><td>phản bác</td></tr>
<tr><td>赞成</td><td>zànchéng</td><td>tán thành</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>phản đối</td></tr>
<tr><td>论据</td><td>lùnjù</td><td>luận cứ</td></tr>
<tr><td>立场</td><td>lìchǎng</td><td>lập trường</td></tr>
<tr><td>说服</td><td>shuōfú</td><td>thuyết phục</td></tr>
<tr><td>争论</td><td>zhēnglùn</td><td>tranh luận</td></tr>
<tr><td>客观</td><td>kèguān</td><td>khách quan</td></tr>
<tr><td>片面</td><td>piànmiàn</td><td>phiến diện, một chiều</td></tr>
</table>
<h3>Mẫu câu nghe hiểu</h3>
<ul>
<li><strong>我不否认…，但是…</strong> wǒ bù fǒurèn…, dànshì… — tôi không phủ nhận …, nhưng … (nhượng bộ rồi vào ý chính).</li>
<li><strong>换句话说…</strong> huàn jù huà shuō… — nói cách khác … (người nghe diễn giải lại để xác nhận).</li>
<li><strong>正如…所说…</strong> zhèngrú…suǒ shuō… — đúng như … đã nói … (viện dẫn để củng cố lập trường).</li>
</ul>
<h3>Đoạn nghe — một cuộc tranh luận hai chiều</h3>
<pre><code>A: 我觉得现在的年轻人应该先创业，而不是先找一份稳定的工作。 Wǒ juéde xiànzài de niánqīngrén yīnggāi xiān chuàngyè, ér búshì xiān zhǎo yí fèn wěndìng de gōngzuò. (Tôi cho rằng giới trẻ hiện nay nên khởi nghiệp trước, chứ không phải tìm việc ổn định trước.)
B: 我不否认创业能锻炼人，但是风险也很大，大部分人其实并没有做好准备。 Wǒ bù fǒurèn chuàngyè néng duànliàn rén, dànshì fēngxiǎn yě hěn dà, dàbùfen rén qíshí bìng méiyǒu zuò hǎo zhǔnbèi. (Tôi không phủ nhận khởi nghiệp giúp rèn luyện con người, nhưng rủi ro cũng rất lớn, phần lớn mọi người thực ra chưa chuẩn bị tốt.)
A: 换句话说，你是觉得应该先积累经验，是吗？ Huàn jù huà shuō, nǐ shì juéde yīnggāi xiān jīlěi jīngyàn, shì ma? (Nói cách khác, bạn cho rằng nên tích luỹ kinh nghiệm trước, đúng không?)
B: 对，正如很多创业者所说，没有经验和资源，光有热情是不够的。这只是我的观点，不代表我完全反对创业。 Duì, zhèngrú hěn duō chuàngyèzhě suǒ shuō, méiyǒu jīngyàn hé zīyuán, guāng yǒu rèqíng shì bú gòu de. Zhè zhǐshì wǒ de guāndiǎn, bú dàibiǎo wǒ wánquán fǎnduì chuàngyè. (Đúng vậy, đúng như nhiều người khởi nghiệp từng nói, không có kinh nghiệm và nguồn lực thì chỉ có nhiệt huyết thôi là chưa đủ. Đây chỉ là quan điểm của tôi, không có nghĩa tôi hoàn toàn phản đối khởi nghiệp.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Trong tranh luận, bắt lấy khung nhượng bộ-rồi-phản bác 我不否认…，但是… — vế sau 但是 mới mang lập trường thật của người nói, không phải vế nhượng bộ trước đó.</div>`,
  ]]);

const b6q = quiz('cls301-quiz-6', 'Quiz 6 — Opinion & debate|||Quiz 6 — Quan điểm & tranh luận', [
  { id: 'q1', question: 'Lập trường thật của B nằm ở đâu trong câu "我不否认创业能锻炼人，但是风险也很大"? / Where is B\'s real stance in this sentence?', options: ['Vế sau 但是 (rủi ro lớn)|||After 但是 (the risk is great)', 'Vế trước 但是 (creo3 khởi nghiệp rèn luyện con người)|||Before 但是', 'Cả hai vế ngang nhau|||Both clauses equally', 'Không có lập trường rõ|||No clear stance'], correctIndex: 0, explanation: 'Cấu trúc nhượng bộ-phản bác: vế sau 但是 mới là ý chính của người nói.' },
  { id: 'q2', question: '"换句话说" dùng để làm gì? / What is 换句话说 used for?', options: ['Diễn giải lại ý vừa nghe để xác nhận|||Paraphrase what was just heard to confirm', 'Kết thúc cuộc trò chuyện|||End the conversation', 'Đưa ra số liệu|||Give a statistic', 'Xin lỗi|||Apologize'], correctIndex: 0, explanation: '换句话说 huàn jù huà shuō = nói cách khác — người nghe diễn giải lại để xác nhận đã hiểu đúng.' },
  { id: 'q3', question: 'B có hoàn toàn phản đối khởi nghiệp không? / Does B completely oppose starting a business?', options: ['Không, chỉ là quan điểm riêng, không phản đối hoàn toàn|||No, it is just her view, not full opposition', 'Có, phản đối hoàn toàn|||Yes, fully opposes', 'Không nói rõ|||Not stated', 'Có, và khuyên A bỏ ý định|||Yes, and tells A to give up the idea'], correctIndex: 0, explanation: '这只是我的观点，不代表我完全反对创业 — B nói rõ đây chỉ là quan điểm, không hoàn toàn phản đối.' },
]);

const b7 = doc('cls301-7-1-public-speaking', 'Lesson 7 — Public speaking|||Bài 7 — Thuyết trình & phát biểu trước đám đông',
  'Mẫu câu: 大家好，今天我要讲的题目是…, 接下来…, 谢谢大家，我的发言到此结束; từ 演讲/主题/强调/结论/掌声; nghe một bài phát biểu ngắn mẫu.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 7 · Public speaking</span>
<h2>Public speaking</h2>
<h3>Listening vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>演讲</td><td>yǎnjiǎng</td><td>speech</td></tr>
<tr><td>发言</td><td>fāyán</td><td>to speak (at a meeting/event)</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>topic, theme</td></tr>
<tr><td>提纲</td><td>tígāng</td><td>outline</td></tr>
<tr><td>强调</td><td>qiángdiào</td><td>to emphasize</td></tr>
<tr><td>举例说明</td><td>jǔlì shuōmíng</td><td>to give an example to illustrate</td></tr>
<tr><td>结论</td><td>jiélùn</td><td>conclusion</td></tr>
<tr><td>台下</td><td>táixià</td><td>the audience (lit. below the stage)</td></tr>
<tr><td>紧张</td><td>jǐnzhāng</td><td>nervous</td></tr>
<tr><td>掌声</td><td>zhǎngshēng</td><td>applause</td></tr>
</table>
<h3>Listening patterns</h3>
<ul>
<li><strong>大家好，今天我要讲的题目是…</strong> dàjiā hǎo, jīntiān wǒ yào jiǎng de tímù shì… — hello everyone, today's topic is … (a speech opener).</li>
<li><strong>首先…接下来…最后…</strong> shǒuxiān…jiē xiàlái…zuìhòu… — first …, next …, finally … (signposts the structure).</li>
<li><strong>谢谢大家，我的发言到此结束</strong> xièxie dàjiā, wǒ de fāyán dào cǐ jiéshù — thank you everyone, my speech ends here (a fixed closer).</li>
</ul>
<h3>Listening passage — a short sample speech</h3>
<pre><code>大家好，今天我要讲的题目是《坚持的力量》。 Dàjiā hǎo, jīntiān wǒ yào jiǎng de tímù shì "Jiānchí de lìliàng". (Hello everyone, today's topic I'll speak about is "The Power of Persistence.")
首先，我想举一个例子说明。 Shǒuxiān, wǒ xiǎng jǔ yí ge lìzi shuōmíng. (First, I'd like to give an example to illustrate this.)
接下来，请大家看一下这张图片，它说明了坚持带来的变化。 Jiē xiàlái, qǐng dàjiā kàn yíxià zhè zhāng túpiàn, tā shuōmíngle jiānchí dàilái de biànhuà. (Next, please look at this picture — it shows the change that persistence brings.)
最后，我的结论是：只要坚持下去，每个人都能实现自己的目标。谢谢大家，我的发言到此结束。 Zuìhòu, wǒ de jiélùn shì: zhǐyào jiānchí xiàqù, měi ge rén dōu néng shíxiàn zìjǐ de mùbiāo. Xièxie dàjiā, wǒ de fāyán dào cǐ jiéshù. (Finally, my conclusion is: as long as you persist, everyone can achieve their goals. Thank you everyone, my speech ends here.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Speeches signpost their own structure with 首先/接下来/最后 — when you need the conclusion, skip straight to 最后 or 我的结论是 instead of tracking the whole speech word by word.</div>`,
    `<span class="eyebrow">CLS301 · Bài 7 · Thuyết trình</span>
<h2>Thuyết trình &amp; phát biểu trước đám đông</h2>
<h3>Từ vựng &amp; mẫu câu nghe hiểu</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>演讲</td><td>yǎnjiǎng</td><td>diễn thuyết</td></tr>
<tr><td>发言</td><td>fāyán</td><td>phát biểu</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>chủ đề</td></tr>
<tr><td>提纲</td><td>tígāng</td><td>dàn ý, đề cương</td></tr>
<tr><td>强调</td><td>qiángdiào</td><td>nhấn mạnh</td></tr>
<tr><td>举例说明</td><td>jǔlì shuōmíng</td><td>lấy ví dụ minh hoạ</td></tr>
<tr><td>结论</td><td>jiélùn</td><td>kết luận</td></tr>
<tr><td>台下</td><td>táixià</td><td>khán giả (dưới sân khấu)</td></tr>
<tr><td>紧张</td><td>jǐnzhāng</td><td>căng thẳng, hồi hộp</td></tr>
<tr><td>掌声</td><td>zhǎngshēng</td><td>tiếng vỗ tay</td></tr>
</table>
<h3>Mẫu câu nghe hiểu</h3>
<ul>
<li><strong>大家好，今天我要讲的题目是…</strong> dàjiā hǎo, jīntiān wǒ yào jiǎng de tímù shì… — xin chào mọi người, hôm nay tôi sẽ nói về đề tài … (câu mở bài phát biểu).</li>
<li><strong>首先…接下来…最后…</strong> shǒuxiān…jiē xiàlái…zuìhòu… — trước hết …, tiếp theo …, cuối cùng … (dẫn dắt cấu trúc bài).</li>
<li><strong>谢谢大家，我的发言到此结束</strong> xièxie dàjiā, wǒ de fāyán dào cǐ jiéshù — cảm ơn mọi người, bài phát biểu của tôi đến đây kết thúc (câu kết cố định).</li>
</ul>
<h3>Đoạn nghe — một bài phát biểu ngắn mẫu</h3>
<pre><code>大家好，今天我要讲的题目是《坚持的力量》。 Dàjiā hǎo, jīntiān wǒ yào jiǎng de tímù shì "Jiānchí de lìliàng". (Xin chào mọi người, hôm nay tôi sẽ nói về đề tài "Sức mạnh của sự kiên trì".)
首先，我想举一个例子说明。 Shǒuxiān, wǒ xiǎng jǔ yí ge lìzi shuōmíng. (Trước hết, tôi muốn lấy một ví dụ để minh hoạ.)
接下来，请大家看一下这张图片，它说明了坚持带来的变化。 Jiē xiàlái, qǐng dàjiā kàn yíxià zhè zhāng túpiàn, tā shuōmíngle jiānchí dàilái de biànhuà. (Tiếp theo, mời mọi người xem bức ảnh này, nó cho thấy sự thay đổi mà kiên trì mang lại.)
最后，我的结论是：只要坚持下去，每个人都能实现自己的目标。谢谢大家，我的发言到此结束。 Zuìhòu, wǒ de jiélùn shì: zhǐyào jiānchí xiàqù, měi ge rén dōu néng shíxiàn zìjǐ de mùbiāo. Xièxie dàjiā, wǒ de fāyán dào cǐ jiéshù. (Cuối cùng, kết luận của tôi là: chỉ cần kiên trì, ai cũng có thể đạt được mục tiêu của mình. Cảm ơn mọi người, bài phát biểu của tôi đến đây là kết thúc.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Bài phát biểu tự đánh dấu cấu trúc bằng 首先/接下来/最后 — khi cần tìm kết luận, hãy nhảy thẳng đến 最后 hoặc 我的结论是 thay vì theo dõi cả bài từng chữ một.</div>`,
  ]]);

const b7q = quiz('cls301-quiz-7', 'Quiz 7 — Public speaking|||Quiz 7 — Thuyết trình', [
  { id: 'q1', question: 'Chủ đề bài phát biểu mẫu là gì? / What is the sample speech\'s topic?', options: ['坚持的力量 (Sức mạnh của sự kiên trì)|||The Power of Persistence', '我的家乡 (Quê hương tôi)|||My hometown', '学习计划 (Kế hoạch học tập)|||Study plan', '环境保护 (Bảo vệ môi trường)|||Environmental protection'], correctIndex: 0, explanation: '今天我要讲的题目是《坚持的力量》.' },
  { id: 'q2', question: 'Muốn nghe kết luận của bài phát biểu, nên chú ý từ nào? / Which word should you listen for to catch the conclusion?', options: ['最后 (cuối cùng)|||最后 (finally)', '大家好 (xin chào)|||大家好 (hello)', '举例 (ví dụ)|||举例 (example)', '图片 (hình ảnh)|||图片 (picture)'], correctIndex: 0, explanation: '最后，我的结论是… — 最后 báo hiệu phần kết luận sắp tới.' },
  { id: 'q3', question: 'Câu nào dùng để kết thúc một bài phát biểu? / Which sentence is used to end a speech?', options: ['谢谢大家，我的发言到此结束|||Thank you everyone, my speech ends here', '大家好，今天我要讲的题目是…|||Hello everyone, today I will talk about…', '首先，我想举一个例子|||First, I want to give an example', '请大家看一下这张图片|||Please look at this picture'], correctIndex: 0, explanation: '谢谢大家，我的发言到此结束 là câu kết cố định của một bài phát biểu.' },
]);

const b8 = doc('cls301-8-1-review-long-listening', 'Lesson 8 — Review: long passages, a simulated interview & advanced dialogue|||Bài 8 — Ôn tập: nghe bài nói dài, phỏng vấn giả lập & hội thoại nâng cao',
  'Ôn 7 mẫu câu & mẹo nghe của cả môn; nghe một đoạn phỏng vấn dài kết hợp nhiều chủ đề (tính cách, công việc, quan điểm); 5 mẹo làm bài nghe HSK4.',
  [[
    `<span class="eyebrow">CLS301 · Lesson 8 · Review</span>
<h2>Review: long passages, a simulated interview &amp; advanced dialogue</h2>
<h3>Vocabulary review</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>总结</td><td>zǒngjié</td><td>to sum up</td></tr>
<tr><td>综合</td><td>zōnghé</td><td>comprehensive, to combine</td></tr>
<tr><td>应对</td><td>yìngduì</td><td>to cope with, respond to</td></tr>
<tr><td>灵活</td><td>línghuó</td><td>flexible</td></tr>
<tr><td>熟练</td><td>shúliàn</td><td>proficient</td></tr>
</table>
<h3>Listening passage — an interview mixing several chapters</h3>
<pre><code>记者: 您好，能不能请您谈谈，年轻人应该怎么处理工作和生活的关系？ Nín hǎo, néng bu néng qǐng nín tántan, niánqīngrén yīnggāi zěnme chǔlǐ gōngzuò hé shēnghuó de guānxi? (Hello, could you talk about how young people should handle the relationship between work and life?)
被采访者: 说实话，这个问题没有标准答案。据我了解，不同性格的人有不同的处理方式：外向的人可能更需要社交来放松，内向的人可能更喜欢安静地休息。 Shuō shíhuà, zhège wèntí méiyǒu biāozhǔn dá'àn. Jù wǒ liǎojiě, bùtóng xìnggé de rén yǒu bùtóng de chǔlǐ fāngshì: wàixiàng de rén kěnéng gèng xūyào shèjiāo lái fàngsōng, nèixiàng de rén kěnéng gèng xǐhuan ānjìng de xiūxi. (Honestly, there's no standard answer to this. As far as I understand, people with different personalities handle it differently: outgoing people may need socializing to relax, introverted people may prefer quiet rest.)
记者: 那您自己是怎么平衡的呢？ Nà nín zìjǐ shì zěnme pínghéng de ne? (So how do you personally balance it?)
被采访者: 我的经验是，只要提前做好计划，抓住重点，不管工作多忙，都能留出时间陪家人。换句话说，平衡不是时间对半分，而是把重要的事情放在前面。 Wǒ de jīngyàn shì, zhǐyào tíqián zuò hǎo jìhuà, zhuāzhù zhòngdiǎn, bùguǎn gōngzuò duō máng, dōu néng liú chū shíjiān péi jiārén. Huàn jù huà shuō, pínghéng búshì shíjiān duìbàn fēn, ér shì bǎ zhòngyào de shìqing fàng zài qiánmiàn. (My experience is: as long as you plan ahead and grasp priorities, no matter how busy work is, you can still set aside time for family. In other words, balance isn't a 50/50 time split — it's putting the important things first.)
</code></pre>
<div class="callout"><span class="badge">5 HSK4 listening tips — review</span>
<ol>
<li>Read the answer options before the audio starts — you already know what to listen for.</li>
<li>Catch the connectives (但是/所以/除了…以外/只要…就/不管…都) — they carry the passage's structure, not the topic words.</li>
<li>Note any number, date or name exactly — these are common trap questions.</li>
<li>Don't freeze on an unknown word — infer it from context and keep listening; stopping loses the next two sentences.</li>
<li>In a monologue, the closing sentence (往往在 不过/所以/最后/我的结论是 之后) usually states the main opinion.</li>
</ol></div>`,
    `<span class="eyebrow">CLS301 · Bài 8 · Ôn tập</span>
<h2>Ôn tập: nghe bài nói dài, phỏng vấn giả lập &amp; hội thoại nâng cao</h2>
<h3>Ôn từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>总结</td><td>zǒngjié</td><td>tổng kết</td></tr>
<tr><td>综合</td><td>zōnghé</td><td>tổng hợp</td></tr>
<tr><td>应对</td><td>yìngduì</td><td>ứng phó</td></tr>
<tr><td>灵活</td><td>línghuó</td><td>linh hoạt</td></tr>
<tr><td>熟练</td><td>shúliàn</td><td>thành thạo</td></tr>
</table>
<h3>Đoạn nghe — một cuộc phỏng vấn kết hợp nhiều chương</h3>
<pre><code>记者: 您好，能不能请您谈谈，年轻人应该怎么处理工作和生活的关系？ Nín hǎo, néng bu néng qǐng nín tántan, niánqīngrén yīnggāi zěnme chǔlǐ gōngzuò hé shēnghuó de guānxi? (Chào anh/chị, anh/chị có thể chia sẻ, người trẻ nên xử lý mối quan hệ giữa công việc và cuộc sống thế nào không?)
被采访者: 说实话，这个问题没有标准答案。据我了解，不同性格的人有不同的处理方式：外向的人可能更需要社交来放松，内向的人可能更喜欢安静地休息。 Shuō shíhuà, zhège wèntí méiyǒu biāozhǔn dá'àn. Jù wǒ liǎojiě, bùtóng xìnggé de rén yǒu bùtóng de chǔlǐ fāngshì: wàixiàng de rén kěnéng gèng xūyào shèjiāo lái fàngsōng, nèixiàng de rén kěnéng gèng xǐhuan ānjìng de xiūxi. (Nói thật, câu hỏi này không có đáp án chuẩn. Theo tôi được biết, người có tính cách khác nhau thì xử lý khác nhau: người hướng ngoại có thể cần giao lưu để thư giãn, người hướng nội có thể thích nghỉ ngơi yên tĩnh hơn.)
记者: 那您自己是怎么平衡的呢？ Nà nín zìjǐ shì zěnme pínghéng de ne? (Vậy bản thân anh/chị cân bằng thế nào?)
被采访者: 我的经验是，只要提前做好计划，抓住重点，不管工作多忙，都能留出时间陪家人。换句话说，平衡不是时间对半分，而是把重要的事情放在前面。 Wǒ de jīngyàn shì, zhǐyào tíqián zuò hǎo jìhuà, zhuāzhù zhòngdiǎn, bùguǎn gōngzuò duō máng, dōu néng liú chū shíjiān péi jiārén. Huàn jù huà shuō, pínghéng búshì shíjiān duìbàn fēn, ér shì bǎ zhòngyào de shìqing fàng zài qiánmiàn. (Kinh nghiệm của tôi là: chỉ cần lên kế hoạch trước, nắm chắc trọng tâm, thì bất kể công việc bận đến đâu, vẫn có thể dành thời gian cho gia đình. Nói cách khác, cân bằng không phải chia đôi thời gian, mà là đặt việc quan trọng lên trước.)
</code></pre>
<div class="callout"><span class="badge">5 mẹo làm bài nghe HSK4 — tổng ôn</span>
<ol>
<li>Đọc trước các đáp án trước khi audio bắt đầu — bạn đã biết cần nghe tìm gì.</li>
<li>Bắt các từ nối (但是/所以/除了…以外/只要…就/不管…都) — chúng mang cấu trúc bài, không phải từ chủ đề.</li>
<li>Ghi chính xác mọi con số, ngày tháng, tên riêng — đây là bẫy hay gặp trong đề.</li>
<li>Đừng khựng lại ở một từ lạ — đoán nghĩa qua ngữ cảnh và nghe tiếp; dừng lại sẽ mất luôn hai câu sau.</li>
<li>Trong độc thoại, câu chốt (thường sau 不过/所以/最后/我的结论是) mới mang ý chính.</li>
</ol></div>`,
  ]]);

const b8q = quiz('cls301-quiz-8', 'Quiz 8 — Final review|||Quiz 8 — Ôn tập cuối', [
  { id: 'q1', question: 'Theo người được phỏng vấn, người hướng ngoại thường cần gì để thư giãn? / What do extroverts need to relax, per the interviewee?', options: ['Giao lưu, xã giao|||Socializing', 'Ở một mình, yên tĩnh|||Being alone, quiet', 'Ngủ nhiều|||Sleeping more', 'Không cần gì cả|||Nothing at all'], correctIndex: 0, explanation: '外向的人可能更需要社交来放松 — người hướng ngoại cần giao lưu để thư giãn.' },
  { id: 'q2', question: '"平衡不是时间对半分，而是把重要的事情放在前面" nghĩa là gì? / What does this sentence mean?', options: ['Cân bằng là ưu tiên việc quan trọng, không phải chia đều thời gian|||Balance means prioritizing what matters, not splitting time equally', 'Phải chia đúng 50/50 thời gian cho công việc và gia đình|||You must split time exactly 50/50', 'Không thể cân bằng công việc và cuộc sống|||Work-life balance is impossible', 'Chỉ cần làm việc nhiều hơn là đủ|||Working more is all it takes'], correctIndex: 0, explanation: 'Câu này phủ định cách chia đều thời gian, khẳng định ưu tiên việc quan trọng.' },
  { id: 'q3', question: 'Mẹo nghe nào ĐÚNG cho bài nghe HSK4 dài? / Which listening tip is correct for a long HSK4 passage?', options: ['Đọc trước đáp án và bắt các từ nối để theo cấu trúc bài|||Read options first and catch connectives to follow structure', 'Dịch từng từ sang tiếng Việt trong đầu|||Mentally translate every word into Vietnamese', 'Dừng lại suy nghĩ kỹ mỗi từ lạ|||Stop to think hard about every unknown word', 'Chỉ cần nghe câu đầu tiên là đủ|||Only the first sentence matters'], correctIndex: 0, explanation: 'Đọc trước đáp án + bắt từ nối là chiến lược đúng; dừng lại ở từ lạ sẽ mất nội dung tiếp theo.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CLS301',
    slug: 'cls301-chinese-listening-speaking-skills-3',
    title: 'Chinese Listening & Speaking Skills 3',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CLS301.webp',
    shortDescription: 'Chinese Listening & Speaking 3 (HSK4), after CLS201: personality, study methods, job interviews, society, Chinese festivals, debate, public speaking, review with long listening & mock interviews. Bilingual, vocab tables, listening tips, quizzes.|||Nghe - Nói tiếng Trung 3 (HSK4), nối tiếp CLS201: tính cách, phương pháp học, phỏng vấn, xã hội, lễ hội Trung Quốc, tranh luận, thuyết trình, ôn nghe bài dài & phỏng vấn giả lập. Song ngữ, bảng từ vựng, mẹo nghe, quiz.',
    description: 'Môn <strong>CLS301 — Chinese Listening &amp; Speaking Skills 3 (Kỹ năng Nghe - Nói tiếng Trung 3)</strong> là môn <strong>kỹ năng nghe-nói</strong> ở trình độ <strong>HSK4</strong>, <strong>nối tiếp CLS201 (HSK3)</strong>. Trọng tâm chuyển từ hội thoại tình huống ngắn sang <strong>nghe hiểu bài nói dài</strong>: <strong>tính cách &amp; quan hệ con người</strong> → <strong>học tập &amp; chia sẻ kinh nghiệm</strong> → <strong>công việc, phỏng vấn xin việc &amp; nghề nghiệp</strong> → <strong>xã hội, môi trường &amp; thời sự</strong> → <strong>văn hoá, phong tục &amp; lễ hội Trung Quốc</strong> → <strong>bày tỏ &amp; bảo vệ quan điểm, tranh luận</strong> → <strong>thuyết trình trước đám đông</strong> → <strong>ôn tập: nghe bài nói dài, phỏng vấn giả lập &amp; hội thoại nâng cao</strong>. Bám giáo trình chuẩn (HSK Standard Course 4 听说 / Short-term Spoken Chinese Intermediate), song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字|pinyin|nghĩa), mẫu câu nghe hiểu, một đoạn nghe (độc thoại/phỏng vấn/tranh luận) để nói nhại &amp; kể lại, mẹo nghe và quiz. Học theo lộ trình 4 bước: nghe ý chính → nghe chi tiết → nói lại tóm tắt → ứng dụng.',
    whatYouLearn: 'Nghe hiểu &amp; kể lại chuyện tính cách, quan hệ (据我了解, 说实话, 只要…就, 不管…都); chia sẻ kinh nghiệm học tập (据…介绍, 除了…以外还, 只有…才能); trả lời phỏng vấn xin việc (请您介绍一下, 我认为自己的优势是, 如果…的话我会); nghe bản tin thời sự (据报道, 随着…的发展, 为了解决这个问题); giới thiệu văn hoá &amp; lễ hội TQ (一提到…就会想到, 每逢…的时候, 象征着); bày tỏ &amp; bảo vệ quan điểm, tranh luận (我不否认…但是, 换句话说, 正如…所说); thuyết trình trước đám đông (大家好今天我要讲的题目是, 首先…接下来…最后); và 5 mẹo làm bài nghe HSK4 để xử lý bài nói dài, phỏng vấn giả lập.',
    requirements: 'Nên học xong CLS201 (giao tiếp-nghe HSK3) trước khi vào môn này. Cài Pleco hoặc HelloChinese để nghe audio bản ngữ; luyện theo đúng 4 bước nghe ý chính → nghe chi tiết → nói lại tóm tắt → ứng dụng cho mỗi bài, đừng chỉ đọc transcript.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình luyện nghe-nói|||📚 Course materials', description: 'Giáo trình HSK Standard Course 4 (听说), Short-term Spoken Chinese Intermediate, công cụ luyện nghe, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CLS201 (HSK3): nâng lên HSK4, trọng tâm nghe hiểu bài nói dài.', lessons: [intro] },
    { title: 'Bài 1 — Tính cách & quan hệ con người|||Lesson 1 — Personality & relationships', description: '据我了解, 说实话, 只要…就, 不管…都; hội thoại sâu về tính cách.', lessons: [b1, b1q] },
    { title: 'Bài 2 — Học tập & chia sẻ kinh nghiệm|||Lesson 2 — Study methods & experience', description: '据…介绍, 除了…以外还, 只有…才能; chia sẻ phương pháp học.', lessons: [b2, b2q] },
    { title: 'Bài 3 — Công việc, phỏng vấn & nghề nghiệp|||Lesson 3 — Work & job interviews', description: '请您介绍一下, 我认为自己的优势是, 如果…的话我会; phỏng vấn giả lập.', lessons: [b3, b3q] },
    { title: 'Bài 4 — Xã hội, môi trường & thời sự|||Lesson 4 — Society & current events', description: '据报道, 随着…的发展, 为了解决这个问题; nghe bản tin.', lessons: [b4, b4q] },
    { title: 'Bài 5 — Văn hoá, phong tục & lễ hội Trung Quốc|||Lesson 5 — Culture & festivals', description: '一提到…就会想到, 每逢…的时候, 象征着; giới thiệu Tết Nguyên đán.', lessons: [b5, b5q] },
    { title: 'Bài 6 — Bày tỏ & bảo vệ quan điểm, tranh luận|||Lesson 6 — Opinion & debate', description: '我不否认…但是, 换句话说, 正如…所说; tranh luận hai chiều.', lessons: [b6, b6q] },
    { title: 'Bài 7 — Thuyết trình trước đám đông|||Lesson 7 — Public speaking', description: '大家好今天我要讲的题目是, 首先…接下来…最后; bài phát biểu mẫu.', lessons: [b7, b7q] },
    { title: 'Bài 8 — Ôn tập: nghe dài, phỏng vấn giả lập & hội thoại nâng cao|||Lesson 8 — Review: long listening & advanced dialogue', description: 'Ôn 7 mẫu câu, phỏng vấn kết hợp nhiều chủ đề, 5 mẹo nghe HSK4.', lessons: [b8, b8q] },
  ],
};
