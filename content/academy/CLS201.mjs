/**
 * CLS201 — Chinese Listening &amp; Speaking Skills 2 (Kỹ năng Nghe - Nói tiếng
 * Trung 2). Khối Ngôn ngữ Trung FPTU, Kỳ 2. Nối tiếp CLS101 (HSK1-2), nâng lên
 * HSK3: nghe đoạn dài hơn, hội thoại tình huống, thuyết trình ngắn. Giáo trình
 * chuẩn: HSK Standard Course 3 (听说), Short-term Spoken Chinese: Elementary
 * (北京大学出版社). Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick
 * lồng/${; trong HTML content "&" → "&amp;". shortDescription "&".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng, mẫu câu & kỹ năng nghe hiểu của chương.', quiz: { timeLimitSeconds: 420, questions } });

const taiLieu = doc('cls201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình chuẩn HSK Standard Course 3 (听说), Short-term Spoken Chinese: Elementary; app nghe/luyện nói, kênh YouTube, chiến lược nghe hiểu HSK3.',
  [[
    `<span class="eyebrow">CLS201 · Materials</span>
<h2>Listening &amp; speaking materials — HSK3</h2>
<p class="lead">CLS201 continues from <strong>CLS101 (HSK1-2)</strong> and moves you up to <strong>HSK3</strong>: longer listening passages, situational dialogues, and short talks. Below are the standard textbooks and free resources to practise with.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><strong>HSK Standard Course 3 (听说)</strong> — the official listening &amp; speaking companion volume for HSK level 3.</li>
<li><strong>Short-term Spoken Chinese: Elementary</strong> (Beijing Language and Culture University Press, 北京大学出版社) — situational dialogues and speaking drills.</li>
</ul>
<h3>📱 Apps for listening &amp; speaking</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — listening exercises with speech-recognition practice.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — dictionary with native audio for every word.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese-Vietnamese dictionary with audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured HSK listening &amp; speaking lessons.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real conversations with subtitles, good for longer-passage practice.</li>
</ul>
<div class="callout"><span class="badge">Listening strategy (HSK3)</span>
<ol>
<li><strong>Read the question first</strong> — predict the topic before you press play.</li>
<li><strong>Catch numbers, times &amp; names</strong> — HSK3 questions often hinge on one of these.</li>
<li><strong>Listen for connectors</strong> — 因为/所以, 后来, 结果, 但是 mark the structure of the passage.</li>
<li><strong>Two passes</strong> — first pass for the main idea, second pass for detail.</li>
</ol></div>`,
    `<span class="eyebrow">CLS201 · Tài liệu</span>
<h2>Tài liệu nghe - nói — HSK3</h2>
<p class="lead">CLS201 nối tiếp <strong>CLS101 (HSK1-2)</strong> và nâng bạn lên <strong>HSK3</strong>: nghe đoạn dài hơn, hội thoại tình huống, và thuyết trình ngắn. Dưới đây là giáo trình chuẩn và nguồn tài liệu miễn phí để luyện tập.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>HSK Standard Course 3 (听说)</strong> — tập giáo trình nghe - nói chính thức cho trình độ HSK3.</li>
<li><strong>Short-term Spoken Chinese: Elementary</strong> (NXB Đại học Ngôn ngữ Bắc Kinh, 北京大学出版社) — hội thoại tình huống và bài luyện nói.</li>
</ul>
<h3>📱 App luyện nghe &amp; nói</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — bài tập nghe kèm nhận diện giọng nói.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển có audio bản ngữ cho từng từ.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung-Việt kèm audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài nghe - nói HSK có hệ thống.</li>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật có phụ đề, hợp để luyện đoạn dài.</li>
</ul>
<div class="callout"><span class="badge">Chiến lược nghe (HSK3)</span>
<ol>
<li><strong>Đọc câu hỏi trước</strong> — đoán chủ đề trước khi bấm nghe.</li>
<li><strong>Bắt số liệu, thời gian, tên riêng</strong> — câu hỏi HSK3 thường xoay quanh những thứ này.</li>
<li><strong>Chú ý từ nối</strong> — 因为/所以, 后来, 结果, 但是 đánh dấu mạch của đoạn nghe.</li>
<li><strong>Nghe hai lượt</strong> — lượt 1 nắm ý chính, lượt 2 bắt chi tiết.</li>
</ol></div>`,
  ]]);

const intro = doc('cls201-0-1-overview', 'Course overview: Chinese Listening & Speaking 2|||Tổng quan: Kỹ năng Nghe - Nói tiếng Trung 2',
  'Nối tiếp CLS101 (HSK1-2), nâng lên HSK3; mỗi bài có từ vựng nghe-nói, mẫu câu, hội thoại tình huống, đoạn nghe dài hơn (độc thoại) và mẹo nghe hiểu.',
  [[
    `<span class="eyebrow">CLS201 · Lesson 0.1 · Overview</span>
<h2>Chinese Listening &amp; Speaking Skills 2 (HSK3)</h2>
<p class="lead">This course continues from <strong>CLS101 (HSK1-2)</strong>. Where CLS101 built the basics — greetings, numbers, simple questions — CLS201 raises the level to <strong>HSK3</strong>: <strong>longer listening passages</strong> (a short monologue, not just one line of dialogue), <strong>situational dialogues</strong> (clinic, hotel, phone calls), and a first <strong>short spoken talk</strong>.</p>
<h3>What's new at HSK3</h3>
<ul>
<li><strong>Longer input</strong> — a passage of 4-8 sentences instead of one exchange; you must hold the whole story in your head, not just the last sentence.</li>
<li><strong>Connectors carry meaning</strong> — 了/过 (past &amp; experience), 比 (comparison), 因为…所以… , 后来, 结果 — catching these is how you follow a longer passage.</li>
<li><strong>Real-life situations</strong> — seeing a doctor, booking a hotel room, rescheduling by phone, giving your opinion.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives a <strong>vocabulary &amp; key-pattern table</strong> (汉字 | pinyin | nghĩa), a <strong>situational dialogue</strong> to shadow and role-play, a <strong>longer listening passage</strong> (a short monologue) to train real HSK3-length listening, and <strong>listening tips</strong>. Then a short quiz.</p>
<h3>Roadmap</h3>
<p>Retelling past experiences → describing &amp; comparing → health &amp; the clinic → plans, work &amp; study → travel &amp; hotel booking → feelings, opinions &amp; suggestions → phone calls &amp; appointments → review: a longer passage, a short talk, and a mixed situational dialogue.</p>`,
    `<span class="eyebrow">CLS201 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng Nghe - Nói tiếng Trung 2 (HSK3)</h2>
<p class="lead">Môn này nối tiếp <strong>CLS101 (HSK1-2)</strong>. CLS101 dựng nền — chào hỏi, số đếm, câu hỏi đơn giản — còn CLS201 nâng lên <strong>HSK3</strong>: <strong>nghe đoạn dài hơn</strong> (một đoạn độc thoại, không chỉ một câu hội thoại), <strong>hội thoại tình huống</strong> (phòng khám, khách sạn, gọi điện), và bài <strong>thuyết trình ngắn</strong> đầu tiên.</p>
<h3>Cái mới ở HSK3</h3>
<ul>
<li><strong>Đầu vào dài hơn</strong> — đoạn 4-8 câu thay vì một lượt trao đổi; bạn phải giữ được cả mạch chuyện trong đầu, không chỉ câu cuối.</li>
<li><strong>Từ nối mang nghĩa</strong> — 了/过 (quá khứ &amp; kinh nghiệm), 比 (so sánh), 因为…所以… , 后来, 结果 — bắt được những từ này là cách theo kịp một đoạn nghe dài.</li>
<li><strong>Tình huống đời thật</strong> — đi khám bệnh, đặt phòng khách sạn, đổi lịch hẹn qua điện thoại, nêu ý kiến.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu trọng tâm</strong> (汉字 | pinyin | nghĩa), một <strong>hội thoại tình huống</strong> để nói nhại &amp; đóng vai, một <strong>đoạn nghe dài hơn</strong> (độc thoại ngắn) để luyện đúng độ dài HSK3, và <strong>mẹo nghe hiểu</strong>. Sau đó là quiz ngắn.</p>
<h3>Lộ trình</h3>
<p>Kể lại trải nghiệm &amp; sự việc quá khứ → miêu tả &amp; so sánh → sức khoẻ &amp; đi khám bệnh → kế hoạch, công việc &amp; học tập → du lịch &amp; đặt phòng → cảm xúc, ý kiến &amp; đề nghị → điện thoại &amp; hẹn gặp → ôn tập: đoạn nghe dài, thuyết trình ngắn &amp; hội thoại tình huống tổng hợp.</p>`,
  ]]);

const c1 = doc('cls201-1-1-past-experience', 'Chapter 1 — Retelling past experiences & events|||Chương 1 — Kể lại trải nghiệm & sự việc quá khứ',
  'Mẫu câu: V+过, 有没有…过, …的时候, 结果; từ 经历/曾经/印象/难忘; luyện kể lại một chuyến đi và nghe một đoạn độc thoại kể chuyện.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 1 · Lesson 1.1</span>
<h2>Retelling past experiences &amp; events</h2>
<h3>Vocabulary &amp; key patterns</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>经历</td><td>jīnglì</td><td>experience</td></tr>
<tr><td>发生</td><td>fāshēng</td><td>to happen</td></tr>
<tr><td>曾经</td><td>céngjīng</td><td>once, ever</td></tr>
<tr><td>记得</td><td>jìde</td><td>to remember</td></tr>
<tr><td>印象</td><td>yìnxiàng</td><td>impression</td></tr>
<tr><td>难忘</td><td>nánwàng</td><td>unforgettable</td></tr>
<tr><td>结果</td><td>jiéguǒ</td><td>as a result</td></tr>
<tr><td>一直</td><td>yìzhí</td><td>all along, continuously</td></tr>
<tr><td>后来</td><td>hòulái</td><td>afterwards</td></tr>
<tr><td>以前</td><td>yǐqián</td><td>before, in the past</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你有没有 + V + 过 + O？</strong> nǐ yǒu méiyǒu V guo O? — have you ever V-ed O?</li>
<li><strong>我 + V + 过 + O 了</strong> wǒ V guo O le — I have V-ed O (before).</li>
<li><strong>…的时候，…</strong> …de shíhou, … — when …, …</li>
<li><strong>结果，…</strong> jiéguǒ, … — as a result, …</li>
</ul>
<h3>Situational dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你去过上海吗？ Nǐ qùguo Shànghǎi ma? (Have you been to Shanghai?)
B: 去过，我去年去的。 Qùguo, wǒ qùnián qù de. (Yes, I went last year.)
A: 那次旅行怎么样？ Nà cì lǚxíng zěnmeyàng? (How was that trip?)
B: 印象很深，特别是外滩的夜景，一直忘不了。 Yìnxiàng hěn shēn, tèbié shì Wàitān de yèjǐng, yìzhí wàng bu liǎo. (It left a deep impression, especially the night view of the Bund — I still can't forget it.)
</code></pre>
<h3>Longer listening passage — a story (monologue)</h3>
<pre><code>上个月我去云南旅游。第一天下雨，我们没能去爬山，后来天气变好了，我们就去了。路上发生了一件有意思的事：我们的车坏了，结果我们等了两个小时。虽然这样，那次旅行我还是很难忘。
Shàng ge yuè wǒ qù Yúnnán lǚyóu. Dì-yī tiān xiàyǔ, wǒmen méi néng qù páshān, hòulái tiānqì biàn hǎo le, wǒmen jiù qù le. Lù shang fāshēng le yí jiàn yǒu yìsi de shì: wǒmen de chē huài le, jiéguǒ wǒmen děng le liǎng ge xiǎoshí. Suīrán zhèyàng, nà cì lǚxíng wǒ háishi hěn nánwàng.
(Last month I traveled to Yunnan. On the first day it rained and we couldn't go hiking; later the weather turned good, so we went. Something interesting happened on the way: our car broke down, so we ended up waiting two hours. Even so, that trip was still unforgettable to me.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> 了 marks a completed action, 过 marks "has ever happened." In a story, listen for the chain 后来 (afterwards) → 结果 (as a result) — they tell you what changed and what it led to.</div>`,
    `<span class="eyebrow">CLS201 · Chương 1 · Bài 1.1</span>
<h2>Kể lại trải nghiệm &amp; sự việc quá khứ</h2>
<h3>Từ vựng &amp; mẫu câu trọng tâm</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>经历</td><td>jīnglì</td><td>trải nghiệm</td></tr>
<tr><td>发生</td><td>fāshēng</td><td>xảy ra</td></tr>
<tr><td>曾经</td><td>céngjīng</td><td>đã từng</td></tr>
<tr><td>记得</td><td>jìde</td><td>nhớ</td></tr>
<tr><td>印象</td><td>yìnxiàng</td><td>ấn tượng</td></tr>
<tr><td>难忘</td><td>nánwàng</td><td>khó quên</td></tr>
<tr><td>结果</td><td>jiéguǒ</td><td>kết quả là</td></tr>
<tr><td>一直</td><td>yìzhí</td><td>luôn, mãi</td></tr>
<tr><td>后来</td><td>hòulái</td><td>sau đó</td></tr>
<tr><td>以前</td><td>yǐqián</td><td>trước đây</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你有没有 + V + 过 + O？</strong> nǐ yǒu méiyǒu V guo O? — bạn đã từng V O chưa?</li>
<li><strong>我 + V + 过 + O 了</strong> wǒ V guo O le — tôi đã từng V O (rồi).</li>
<li><strong>…的时候，…</strong> …de shíhou, … — khi …, thì …</li>
<li><strong>结果，…</strong> jiéguǒ, … — kết quả là, …</li>
</ul>
<h3>Hội thoại tình huống — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你去过上海吗？ Nǐ qùguo Shànghǎi ma? (Bạn đã từng đến Thượng Hải chưa?)
B: 去过，我去年去的。 Qùguo, wǒ qùnián qù de. (Đã từng, tôi đi năm ngoái.)
A: 那次旅行怎么样？ Nà cì lǚxíng zěnmeyàng? (Chuyến đi đó thế nào?)
B: 印象很深，特别是外滩的夜景，一直忘不了。 Yìnxiàng hěn shēn, tèbié shì Wàitān de yèjǐng, yìzhí wàng bu liǎo. (Ấn tượng rất sâu, đặc biệt là cảnh đêm ở Ngoại Than — tôi mãi không quên được.)
</code></pre>
<h3>Đoạn nghe dài hơn — kể chuyện (độc thoại)</h3>
<pre><code>上个月我去云南旅游。第一天下雨，我们没能去爬山，后来天气变好了，我们就去了。路上发生了一件有意思的事：我们的车坏了，结果我们等了两个小时。虽然这样，那次旅行我还是很难忘。
Shàng ge yuè wǒ qù Yúnnán lǚyóu. Dì-yī tiān xiàyǔ, wǒmen méi néng qù páshān, hòulái tiānqì biàn hǎo le, wǒmen jiù qù le. Lù shang fāshēng le yí jiàn yǒu yìsi de shì: wǒmen de chē huài le, jiéguǒ wǒmen děng le liǎng ge xiǎoshí. Suīrán zhèyàng, nà cì lǚxíng wǒ háishi hěn nánwàng.
(Tháng trước tôi đi du lịch Vân Nam. Ngày đầu trời mưa, chúng tôi không leo núi được, sau đó trời đẹp hơn nên chúng tôi đi. Trên đường xảy ra một chuyện thú vị: xe của chúng tôi hỏng, kết quả là chúng tôi phải đợi hai tiếng. Dù vậy, chuyến đi đó tôi vẫn thấy rất khó quên.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> 了 đánh dấu việc đã hoàn thành, 过 đánh dấu "đã từng xảy ra." Trong một câu chuyện, hãy bắt chuỗi 后来 (sau đó) → 结果 (kết quả là) — chúng cho biết điều gì đã thay đổi và dẫn tới đâu.</div>`,
  ]]);

const c1q = quiz('cls201-quiz-1', 'Quiz 1 — Retelling past experiences|||Quiz 1 — Kể lại trải nghiệm quá khứ', [
  { id: 'q1', question: '"你去过上海吗？" dùng để hỏi điều gì?', options: ['Bạn đã từng đến Thượng Hải chưa', 'Thượng Hải ở đâu', 'Thượng Hải có gì đẹp', 'Bao giờ bạn đi Thượng Hải'], correctIndex: 0, explanation: '过 (guo) đứng sau động từ dùng để hỏi đã từng làm việc gì đó chưa.' },
  { id: 'q2', question: 'Trong đoạn nghe, vì sao ngày đầu cả nhóm không đi leo núi được?', options: ['Vì trời mưa', 'Vì xe hỏng', 'Vì hết vé', 'Vì mệt'], correctIndex: 0, explanation: 'Đoạn nghe nói "第一天下雨，我们没能去爬山" — ngày đầu trời mưa nên không leo núi được.' },
  { id: 'q3', question: 'Từ "结果" (jiéguǒ) trong đoạn nghe gần nghĩa nhất với gì?', options: ['Kết quả là', 'Có lẽ', 'Chắc chắn', 'Hi vọng'], correctIndex: 0, explanation: '结果 = kết quả là, dùng để nêu điều xảy ra sau một sự việc trước đó.' },
]);

const c2 = doc('cls201-2-1-describing-comparing', 'Chapter 2 — Describing & comparing people, things|||Chương 2 — Miêu tả & so sánh người, vật',
  'Mẫu câu: A比B+adj, A跟B一样, A没有B那么, 越来越; từ 比较/差不多/质量/样子; luyện so sánh hai đồ vật/thành phố.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 2 · Lesson 2.1</span>
<h2>Describing &amp; comparing people, things</h2>
<h3>Vocabulary &amp; key patterns</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>比较</td><td>bǐjiào</td><td>to compare; relatively</td></tr>
<tr><td>差不多</td><td>chàbuduō</td><td>about the same</td></tr>
<tr><td>更</td><td>gèng</td><td>more, even more</td></tr>
<tr><td>不如</td><td>bùrú</td><td>not as good as</td></tr>
<tr><td>特点</td><td>tèdiǎn</td><td>characteristic</td></tr>
<tr><td>外表</td><td>wàibiǎo</td><td>appearance</td></tr>
<tr><td>质量</td><td>zhìliàng</td><td>quality</td></tr>
<tr><td>价格</td><td>jiàgé</td><td>price</td></tr>
<tr><td>样子</td><td>yàngzi</td><td>look, style</td></tr>
<tr><td>适合</td><td>shìhé</td><td>to suit</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>A 比 B + adj (+ 一点儿/多了)</strong> — A is [adj]-er than B (a bit / a lot).</li>
<li><strong>A 跟 B 一样 + adj</strong> — A is as [adj] as B.</li>
<li><strong>A 没有 B (那么) + adj</strong> — A is not as [adj] as B.</li>
<li><strong>越来越 + adj</strong> yuè lái yuè + adj — more and more [adj].</li>
</ul>
<h3>Situational dialogue — shadow &amp; role-play</h3>
<pre><code>顾客: 这两部手机哪个更好？ Zhège liǎng bù shǒujī nǎge gèng hǎo? (Which of these two phones is better?)
店员: 这部比那部贵一点儿，可是质量更好。 Zhè bù bǐ nà bù guì yìdiǎnr, kěshì zhìliàng gèng hǎo. (This one is a bit more expensive than that one, but the quality is better.)
顾客: 那两部手机的样子差不多吧？ Nà liǎng bù shǒujī de yàngzi chàbuduō ba? (The look of the two phones is about the same, right?)
店员: 差不多，不过这部的屏幕更大，跟平板电脑一样大。 Chàbuduō, búguò zhè bù de píngmù gèng dà, gēn píngbǎn diànnǎo yíyàng dà. (About the same, but this one's screen is bigger — as big as a tablet.)
</code></pre>
<h3>Longer listening passage — comparing two cities (monologue)</h3>
<pre><code>我去过杭州，也去过苏州。这两个城市都很美，但是杭州比苏州大一点儿，人也更多。苏州没有杭州那么热闹，可是环境更安静，我更喜欢苏州的生活节奏。
Wǒ qùguo Hángzhōu, yě qùguo Sūzhōu. Zhè liǎng ge chéngshì dōu hěn měi, dànshì Hángzhōu bǐ Sūzhōu dà yìdiǎnr, rén yě gèng duō. Sūzhōu méiyǒu Hángzhōu nàme rènao, kěshì huánjìng gèng ānjìng, wǒ gèng xǐhuan Sūzhōu de shēnghuó jiézòu.
(I have been to Hangzhou and to Suzhou. Both cities are beautiful, but Hangzhou is a bit bigger than Suzhou and has more people. Suzhou is not as lively as Hangzhou, but the environment is quieter — I prefer Suzhou's pace of life.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Comparisons hide the key fact in one small word: 比 (more than), 没有…那么 (not as … as), 一样 (the same as). Missing that one word flips the whole meaning — listen for it deliberately.</div>`,
    `<span class="eyebrow">CLS201 · Chương 2 · Bài 2.1</span>
<h2>Miêu tả &amp; so sánh người, vật</h2>
<h3>Từ vựng &amp; mẫu câu trọng tâm</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>比较</td><td>bǐjiào</td><td>so sánh; tương đối</td></tr>
<tr><td>差不多</td><td>chàbuduō</td><td>gần như nhau</td></tr>
<tr><td>更</td><td>gèng</td><td>hơn, càng</td></tr>
<tr><td>不如</td><td>bùrú</td><td>không bằng</td></tr>
<tr><td>特点</td><td>tèdiǎn</td><td>đặc điểm</td></tr>
<tr><td>外表</td><td>wàibiǎo</td><td>vẻ ngoài</td></tr>
<tr><td>质量</td><td>zhìliàng</td><td>chất lượng</td></tr>
<tr><td>价格</td><td>jiàgé</td><td>giá cả</td></tr>
<tr><td>样子</td><td>yàngzi</td><td>dáng vẻ, kiểu</td></tr>
<tr><td>适合</td><td>shìhé</td><td>phù hợp</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>A 比 B + tính từ (+ 一点儿/多了)</strong> — A [tính từ] hơn B (một chút/nhiều).</li>
<li><strong>A 跟 B 一样 + tính từ</strong> — A [tính từ] giống B, bằng nhau.</li>
<li><strong>A 没有 B (那么) + tính từ</strong> — A không [tính từ] bằng B.</li>
<li><strong>越来越 + tính từ</strong> yuè lái yuè + tính từ — càng ngày càng [tính từ].</li>
</ul>
<h3>Hội thoại tình huống — nói nhại &amp; đóng vai</h3>
<pre><code>顾客: 这两部手机哪个更好？ Zhège liǎng bù shǒujī nǎge gèng hǎo? (Trong hai chiếc điện thoại này cái nào tốt hơn?)
店员: 这部比那部贵一点儿，可是质量更好。 Zhè bù bǐ nà bù guì yìdiǎnr, kěshì zhìliàng gèng hǎo. (Cái này đắt hơn cái kia một chút, nhưng chất lượng tốt hơn.)
顾客: 那两部手机的样子差不多吧？ Nà liǎng bù shǒujī de yàngzi chàbuduō ba? (Kiểu dáng hai cái này gần như nhau nhỉ?)
店员: 差不多，不过这部的屏幕更大，跟平板电脑一样大。 Chàbuduō, búguò zhè bù de píngmù gèng dà, gēn píngbǎn diànnǎo yíyàng dà. (Gần như nhau, nhưng màn hình cái này to hơn, to bằng máy tính bảng luôn.)
</code></pre>
<h3>Đoạn nghe dài hơn — so sánh hai thành phố (độc thoại)</h3>
<pre><code>我去过杭州，也去过苏州。这两个城市都很美，但是杭州比苏州大一点儿，人也更多。苏州没有杭州那么热闹，可是环境更安静，我更喜欢苏州的生活节奏。
Wǒ qùguo Hángzhōu, yě qùguo Sūzhōu. Zhè liǎng ge chéngshì dōu hěn měi, dànshì Hángzhōu bǐ Sūzhōu dà yìdiǎnr, rén yě gèng duō. Sūzhōu méiyǒu Hángzhōu nàme rènao, kěshì huánjìng gèng ānjìng, wǒ gèng xǐhuan Sūzhōu de shēnghuó jiézòu.
(Tôi đã từng đến Hàng Châu, cũng đã từng đến Tô Châu. Hai thành phố này đều rất đẹp, nhưng Hàng Châu to hơn Tô Châu một chút, người cũng đông hơn. Tô Châu không nhộn nhịp bằng Hàng Châu, nhưng môi trường yên tĩnh hơn, tôi thích nhịp sống ở Tô Châu hơn.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Câu so sánh giấu sự thật quan trọng trong một từ nhỏ: 比 (hơn), 没有…那么 (không … bằng), 一样 (giống nhau). Bỏ lỡ đúng từ đó là hiểu ngược cả câu — hãy nghe thật kỹ từ đó.</div>`,
  ]]);

const c2q = quiz('cls201-quiz-2', 'Quiz 2 — Describing & comparing|||Quiz 2 — Miêu tả & so sánh', [
  { id: 'q1', question: 'Mẫu câu nào dùng để nói "A hơn B một chút"?', options: ['A 比 B + tính từ + 一点儿', 'A 跟 B 一样', 'A 没有 B 那么', '越来越'], correctIndex: 0, explanation: 'A 比 B + tính từ (+一点儿/多了) là cấu trúc so sánh hơn.' },
  { id: 'q2', question: 'Theo đoạn nghe, thành phố nào đông người hơn?', options: ['Hàng Châu', 'Tô Châu', 'Cả hai bằng nhau', 'Không nhắc tới'], correctIndex: 0, explanation: 'Đoạn nghe nói "杭州比苏州大一点儿，人也更多" — Hàng Châu to hơn và đông người hơn.' },
  { id: 'q3', question: '"苏州没有杭州那么热闹" nghĩa là gì?', options: ['Tô Châu không nhộn nhịp bằng Hàng Châu', 'Tô Châu nhộn nhịp hơn Hàng Châu', 'Hai nơi giống hệt nhau', 'Tô Châu không có gì để xem'], correctIndex: 0, explanation: 'A 没有 B 那么 + tính từ = A không [tính từ] bằng B.' },
]);

const c3 = doc('cls201-3-1-health-clinic', 'Chapter 3 — Health & seeing a doctor|||Chương 3 — Sức khoẻ & đi khám bệnh',
  'Mẫu câu: 你哪儿不舒服, 我从…开始, 医生说要, 最好; từ 挂号/症状/发烧/打针/开药; luyện hội thoại phòng khám và nghe lời dặn của bác sĩ.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 3 · Lesson 3.1</span>
<h2>Health &amp; seeing a doctor</h2>
<h3>Vocabulary &amp; key patterns</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>挂号</td><td>guàhào</td><td>to register (at a clinic)</td></tr>
<tr><td>症状</td><td>zhèngzhuàng</td><td>symptom</td></tr>
<tr><td>发烧</td><td>fāshāo</td><td>to have a fever</td></tr>
<tr><td>咳嗽</td><td>késou</td><td>to cough</td></tr>
<tr><td>头疼</td><td>tóuténg</td><td>headache</td></tr>
<tr><td>打针</td><td>dǎzhēn</td><td>to get an injection</td></tr>
<tr><td>开药</td><td>kāiyào</td><td>to prescribe medicine</td></tr>
<tr><td>请假</td><td>qǐngjià</td><td>to ask for leave</td></tr>
<tr><td>按时吃药</td><td>ànshí chīyào</td><td>take medicine on time</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>comfortable, well</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>你哪儿不舒服？</strong> nǐ nǎr bù shūfu? — where do you feel unwell?</li>
<li><strong>我从…开始 + symptom</strong> wǒ cóng… kāishǐ… — I've had [symptom] since …</li>
<li><strong>医生说要…</strong> yīshēng shuō yào… — the doctor said I should …</li>
<li><strong>最好 + V</strong> zuìhǎo + V — it's best to …</li>
</ul>
<h3>Situational dialogue — shadow &amp; role-play</h3>
<pre><code>医生: 你哪儿不舒服？ Nǐ nǎr bù shūfu? (Where do you feel unwell?)
病人: 我从昨天开始头疼，还有点儿咳嗽。 Wǒ cóng zuótiān kāishǐ tóuténg, hái yǒudiǎnr késou. (I've had a headache since yesterday, and a bit of a cough too.)
医生: 我先给你量一下体温……有点儿发烧，三十八度。 Wǒ xiān gěi nǐ liáng yíxià tǐwēn... Yǒudiǎnr fāshāo, sānshíbā dù. (Let me take your temperature first... a bit of a fever, 38 degrees.)
医生: 我给你开点儿药，回去按时吃药，多喝水，最好请一天假在家休息。 Wǒ gěi nǐ kāi diǎnr yào, huíqu ànshí chīyào, duō hē shuǐ, zuìhǎo qǐng yì tiān jià zài jiā xiūxi. (I'll prescribe you some medicine — take it on time, drink more water, and it's best to take a day off to rest at home.)
</code></pre>
<h3>Longer listening passage — recapping a clinic visit (monologue)</h3>
<pre><code>昨天我觉得不舒服，就去医院挂号看病。医生说我有点儿发烧，还有咳嗽的症状。医生给我开了药，让我按时吃，还叫我请假在家休息两天。今天我已经好多了。
Zuótiān wǒ juéde bù shūfu, jiù qù yīyuàn guàhào kànbìng. Yīshēng shuō wǒ yǒudiǎnr fāshāo, hái yǒu késou de zhèngzhuàng. Yīshēng gěi wǒ kāile yào, ràng wǒ ànshí chī, hái jiào wǒ qǐngjià zài jiā xiūxi liǎng tiān. Jīntiān wǒ yǐjīng hǎo duō le.
(Yesterday I felt unwell, so I went to the hospital to register and see a doctor. The doctor said I had a slight fever and coughing symptoms. The doctor prescribed me medicine, told me to take it on time, and also told me to take two days off to rest at home. Today I already feel much better.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Clinic passages stack instructions — 让/叫 + person + V ("told [someone] to …"). Count how many instructions the doctor gives; HSK3 questions often ask "what did the doctor NOT say."</div>`,
    `<span class="eyebrow">CLS201 · Chương 3 · Bài 3.1</span>
<h2>Sức khoẻ &amp; đi khám bệnh</h2>
<h3>Từ vựng &amp; mẫu câu trọng tâm</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>挂号</td><td>guàhào</td><td>đăng ký khám bệnh</td></tr>
<tr><td>症状</td><td>zhèngzhuàng</td><td>triệu chứng</td></tr>
<tr><td>发烧</td><td>fāshāo</td><td>sốt</td></tr>
<tr><td>咳嗽</td><td>késou</td><td>ho</td></tr>
<tr><td>头疼</td><td>tóuténg</td><td>đau đầu</td></tr>
<tr><td>打针</td><td>dǎzhēn</td><td>tiêm</td></tr>
<tr><td>开药</td><td>kāiyào</td><td>kê đơn thuốc</td></tr>
<tr><td>请假</td><td>qǐngjià</td><td>xin nghỉ phép</td></tr>
<tr><td>按时吃药</td><td>ànshí chīyào</td><td>uống thuốc đúng giờ</td></tr>
<tr><td>舒服</td><td>shūfu</td><td>khoẻ, dễ chịu</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>你哪儿不舒服？</strong> nǐ nǎr bù shūfu? — bạn thấy khó chịu ở đâu?</li>
<li><strong>我从…开始 + triệu chứng</strong> wǒ cóng… kāishǐ… — tôi bị [triệu chứng] từ …</li>
<li><strong>医生说要…</strong> yīshēng shuō yào… — bác sĩ nói tôi phải …</li>
<li><strong>最好 + động từ</strong> zuìhǎo + V — tốt nhất nên …</li>
</ul>
<h3>Hội thoại tình huống — nói nhại &amp; đóng vai</h3>
<pre><code>医生: 你哪儿不舒服？ Nǐ nǎr bù shūfu? (Bạn thấy khó chịu ở đâu?)
病人: 我从昨天开始头疼，还有点儿咳嗽。 Wǒ cóng zuótiān kāishǐ tóuténg, hái yǒudiǎnr késou. (Tôi bị đau đầu từ hôm qua, còn hơi ho nữa.)
医生: 我先给你量一下体温……有点儿发烧，三十八度。 Wǒ xiān gěi nǐ liáng yíxià tǐwēn... Yǒudiǎnr fāshāo, sānshíbā dù. (Để tôi đo nhiệt độ cho bạn trước... Hơi sốt, ba mươi tám độ.)
医生: 我给你开点儿药，回去按时吃药，多喝水，最好请一天假在家休息。 Wǒ gěi nǐ kāi diǎnr yào, huíqu ànshí chīyào, duō hē shuǐ, zuìhǎo qǐng yì tiān jià zài jiā xiūxi. (Tôi kê cho bạn ít thuốc, về nhà uống đúng giờ, uống nhiều nước, tốt nhất nên xin nghỉ một ngày ở nhà.)
</code></pre>
<h3>Đoạn nghe dài hơn — thuật lại một lần khám bệnh (độc thoại)</h3>
<pre><code>昨天我觉得不舒服，就去医院挂号看病。医生说我有点儿发烧，还有咳嗽的症状。医生给我开了药，让我按时吃，还叫我请假在家休息两天。今天我已经好多了。
Zuótiān wǒ juéde bù shūfu, jiù qù yīyuàn guàhào kànbìng. Yīshēng shuō wǒ yǒudiǎnr fāshāo, hái yǒu késou de zhèngzhuàng. Yīshēng gěi wǒ kāile yào, ràng wǒ ànshí chī, hái jiào wǒ qǐngjià zài jiā xiūxi liǎng tiān. Jīntiān wǒ yǐjīng hǎo duō le.
(Hôm qua tôi thấy khó chịu nên đi bệnh viện đăng ký khám. Bác sĩ nói tôi hơi sốt, lại có triệu chứng ho. Bác sĩ kê thuốc cho tôi, bảo tôi uống đúng giờ, còn bảo tôi xin nghỉ ở nhà hai ngày. Hôm nay tôi đã khá hơn nhiều rồi.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Đoạn về phòng khám hay xếp chồng các lời dặn — 让/叫 + người + V ("bảo [ai] làm gì"). Hãy đếm xem bác sĩ dặn bao nhiêu việc; câu hỏi HSK3 hay hỏi "bác sĩ KHÔNG dặn điều gì."</div>`,
  ]]);

const c3q = quiz('cls201-quiz-3', 'Quiz 3 — Health & the clinic|||Quiz 3 — Sức khoẻ & đi khám bệnh', [
  { id: 'q1', question: '"你哪儿不舒服？" bác sĩ hỏi điều gì?', options: ['Bạn khó chịu ở đâu', 'Bạn bao nhiêu tuổi', 'Bạn ở đâu', 'Bạn tên gì'], correctIndex: 0, explanation: '哪儿不舒服 = ở đâu khó chịu — câu bác sĩ hỏi triệu chứng.' },
  { id: 'q2', question: 'Theo đoạn nghe, bác sĩ dặn bệnh nhân làm gì?', options: ['Uống thuốc đúng giờ và nghỉ 2 ngày', 'Đi khám ở bệnh viện khác', 'Tiêm ngay lập tức', 'Không cần uống thuốc'], correctIndex: 0, explanation: 'Đoạn nghe: "让我按时吃，还叫我请假在家休息两天".' },
  { id: 'q3', question: '"挂号" (guàhào) nghĩa là gì?', options: ['Đăng ký khám bệnh', 'Trả tiền viện phí', 'Lấy thuốc', 'Đo huyết áp'], correctIndex: 0, explanation: '挂号 = làm thủ tục đăng ký trước khi gặp bác sĩ.' },
]);

const c4 = doc('cls201-4-1-plans-work-study', 'Chapter 4 — Plans, work & study|||Chương 4 — Kế hoạch, công việc & học tập',
  'Mẫu câu: 我打算/计划, 先…然后…最后, 争取; từ 计划/安排/任务/提前/完成; luyện trình bày kế hoạch học tập/công việc.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 4 · Lesson 4.1</span>
<h2>Plans, work &amp; study</h2>
<h3>Vocabulary &amp; key patterns</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>计划</td><td>jìhuà</td><td>plan</td></tr>
<tr><td>打算</td><td>dǎsuàn</td><td>to intend to</td></tr>
<tr><td>安排</td><td>ānpái</td><td>to arrange</td></tr>
<tr><td>目标</td><td>mùbiāo</td><td>goal</td></tr>
<tr><td>任务</td><td>rènwu</td><td>task</td></tr>
<tr><td>提前</td><td>tíqián</td><td>ahead of schedule</td></tr>
<tr><td>按时</td><td>ànshí</td><td>on time</td></tr>
<tr><td>完成</td><td>wánchéng</td><td>to complete</td></tr>
<tr><td>加班</td><td>jiābān</td><td>to work overtime</td></tr>
<tr><td>争取</td><td>zhēngqǔ</td><td>to strive to</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我打算/计划 + V</strong> wǒ dǎsuàn/jìhuà + V — I plan to …</li>
<li><strong>先…，然后…，最后…</strong> xiān…, ránhòu…, zuìhòu… — first …, then …, finally …</li>
<li><strong>到…为止</strong> dào… wéizhǐ — up until …</li>
<li><strong>争取 + V</strong> zhēngqǔ + V — strive to …</li>
</ul>
<h3>Situational dialogue — shadow &amp; role-play</h3>
<pre><code>A: 这个学期你有什么计划？ Zhège xuéqī nǐ yǒu shénme jìhuà? (What plans do you have this semester?)
B: 我打算先把基础知识学好，然后多练习听说。 Wǒ dǎsuàn xiān bǎ jīchǔ zhīshi xué hǎo, ránhòu duō liànxí tīngshuō. (I plan to first master the basics well, then practice listening and speaking more.)
A: 工作方面呢？ Gōngzuò fāngmiàn ne? (What about work?)
B: 这个月的任务比较多，我得提前安排时间，争取按时完成。 Zhège yuè de rènwu bǐjiào duō, wǒ děi tíqián ānpái shíjiān, zhēngqǔ ànshí wánchéng. (This month's tasks are quite a lot; I have to arrange my time ahead of schedule and strive to finish on time.)
</code></pre>
<h3>Longer listening passage — a study plan (monologue)</h3>
<pre><code>下个月我要参加一个重要的考试，所以我给自己安排了一个学习计划。每天早上先复习生词，然后练习听力，晚上做练习题。工作也不能忽视，我打算把简单的任务提前完成，这样考试前的一个星期就可以专心复习了。
Xià ge yuè wǒ yào cānjiā yí ge zhòngyào de kǎoshì, suǒyǐ wǒ gěi zìjǐ ānpáile yí ge xuéxí jìhuà. Měitiān zǎoshang xiān fùxí shēngcí, ránhòu liànxí tīnglì, wǎnshang zuò liànxítí. Gōngzuò yě bùnéng hūshì, wǒ dǎsuàn bǎ jiǎndān de rènwu tíqián wánchéng, zhèyàng kǎoshì qián de yí ge xīngqī jiù kěyǐ zhuānxīn fùxí le.
(Next month I have an important exam, so I've arranged a study plan for myself. Every morning I first review vocabulary, then practice listening, and do exercises in the evening. Work can't be ignored either — I plan to finish the simple tasks ahead of time, so that in the week before the exam I can focus fully on reviewing.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> A plan passage is often ordered by 先…然后…晚上/最后 — draw a quick timeline in your head (morning → then → evening) as you listen, rather than trying to remember every sentence word for word.</div>`,
    `<span class="eyebrow">CLS201 · Chương 4 · Bài 4.1</span>
<h2>Kế hoạch, công việc &amp; học tập</h2>
<h3>Từ vựng &amp; mẫu câu trọng tâm</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>计划</td><td>jìhuà</td><td>kế hoạch</td></tr>
<tr><td>打算</td><td>dǎsuàn</td><td>dự định</td></tr>
<tr><td>安排</td><td>ānpái</td><td>sắp xếp</td></tr>
<tr><td>目标</td><td>mùbiāo</td><td>mục tiêu</td></tr>
<tr><td>任务</td><td>rènwu</td><td>nhiệm vụ</td></tr>
<tr><td>提前</td><td>tíqián</td><td>sớm hơn dự kiến</td></tr>
<tr><td>按时</td><td>ànshí</td><td>đúng giờ</td></tr>
<tr><td>完成</td><td>wánchéng</td><td>hoàn thành</td></tr>
<tr><td>加班</td><td>jiābān</td><td>làm thêm giờ</td></tr>
<tr><td>争取</td><td>zhēngqǔ</td><td>cố gắng đạt được</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我打算/计划 + động từ</strong> wǒ dǎsuàn/jìhuà + V — tôi dự định/có kế hoạch …</li>
<li><strong>先…，然后…，最后…</strong> xiān…, ránhòu…, zuìhòu… — trước tiên …, sau đó …, cuối cùng …</li>
<li><strong>到…为止</strong> dào… wéizhǐ — cho đến khi …</li>
<li><strong>争取 + động từ</strong> zhēngqǔ + V — cố gắng để …</li>
</ul>
<h3>Hội thoại tình huống — nói nhại &amp; đóng vai</h3>
<pre><code>A: 这个学期你有什么计划？ Zhège xuéqī nǐ yǒu shénme jìhuà? (Học kỳ này bạn có kế hoạch gì?)
B: 我打算先把基础知识学好，然后多练习听说。 Wǒ dǎsuàn xiān bǎ jīchǔ zhīshi xué hǎo, ránhòu duō liànxí tīngshuō. (Tôi dự định trước tiên học vững kiến thức nền, sau đó luyện nghe nói nhiều hơn.)
A: 工作方面呢？ Gōngzuò fāngmiàn ne? (Còn công việc thì sao?)
B: 这个月的任务比较多，我得提前安排时间，争取按时完成。 Zhège yuè de rènwu bǐjiào duō, wǒ děi tíqián ānpái shíjiān, zhēngqǔ ànshí wánchéng. (Nhiệm vụ tháng này khá nhiều, tôi phải sắp xếp thời gian sớm hơn, cố gắng hoàn thành đúng giờ.)
</code></pre>
<h3>Đoạn nghe dài hơn — một kế hoạch học tập (độc thoại)</h3>
<pre><code>下个月我要参加一个重要的考试，所以我给自己安排了一个学习计划。每天早上先复习生词，然后练习听力，晚上做练习题。工作也不能忽视，我打算把简单的任务提前完成，这样考试前的一个星期就可以专心复习了。
Xià ge yuè wǒ yào cānjiā yí ge zhòngyào de kǎoshì, suǒyǐ wǒ gěi zìjǐ ānpáile yí ge xuéxí jìhuà. Měitiān zǎoshang xiān fùxí shēngcí, ránhòu liànxí tīnglì, wǎnshang zuò liànxítí. Gōngzuò yě bùnéng hūshì, wǒ dǎsuàn bǎ jiǎndān de rènwu tíqián wánchéng, zhèyàng kǎoshì qián de yí ge xīngqī jiù kěyǐ zhuānxīn fùxí le.
(Tháng sau tôi sẽ tham gia một kỳ thi quan trọng, nên tôi đã sắp xếp cho mình một kế hoạch học tập. Mỗi sáng tôi ôn từ mới trước, sau đó luyện nghe, buổi tối làm bài tập. Công việc cũng không thể bỏ qua, tôi dự định hoàn thành sớm các nhiệm vụ đơn giản, như vậy tuần trước kỳ thi tôi có thể tập trung ôn tập.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Đoạn về kế hoạch thường xếp theo 先…然后…晚上/最后 — hãy vẽ nhanh một mốc thời gian trong đầu (sáng → sau đó → tối) khi nghe, thay vì cố nhớ từng câu một.</div>`,
  ]]);

const c4q = quiz('cls201-quiz-4', 'Quiz 4 — Plans, work & study|||Quiz 4 — Kế hoạch, công việc & học tập', [
  { id: 'q1', question: '"打算" (dǎsuàn) gần nghĩa nhất với từ nào?', options: ['Dự định', 'Hoàn thành', 'Mục tiêu', 'Nhiệm vụ'], correctIndex: 0, explanation: '打算 = dự định, nói về việc định làm gì.' },
  { id: 'q2', question: 'Trong đoạn nghe, buổi sáng người nói làm gì trước tiên?', options: ['Ôn từ mới', 'Luyện nghe', 'Làm bài tập', 'Đi làm'], correctIndex: 0, explanation: 'Đoạn nghe: "每天早上先复习生词，然后练习听力".' },
  { id: 'q3', question: '"争取按时完成" nghĩa là gì?', options: ['Cố gắng hoàn thành đúng giờ', 'Không cần hoàn thành', 'Hoàn thành muộn cũng được', 'Đã hoàn thành rồi'], correctIndex: 0, explanation: '争取 = cố gắng đạt được; 按时完成 = hoàn thành đúng giờ.' },
]);

const c5 = doc('cls201-5-1-travel-hotel', 'Chapter 5 — Travel, hotel booking & asking for information|||Chương 5 — Du lịch, đặt phòng & hỏi thông tin',
  'Mẫu câu: 我想预订一间…, …多少钱一晚, 几点退房; từ 预订/前台/押金/景点/门票; luyện đặt phòng qua điện thoại và nghe thông báo lịch trình tour.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 5 · Lesson 5.1</span>
<h2>Travel, hotel booking &amp; asking for information</h2>
<h3>Vocabulary &amp; key patterns</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>预订</td><td>yùdìng</td><td>to book, to reserve</td></tr>
<tr><td>房间</td><td>fángjiān</td><td>room</td></tr>
<tr><td>双人间</td><td>shuāngrénjiān</td><td>double room</td></tr>
<tr><td>前台</td><td>qiántái</td><td>front desk</td></tr>
<tr><td>押金</td><td>yājīn</td><td>deposit</td></tr>
<tr><td>退房</td><td>tuìfáng</td><td>to check out</td></tr>
<tr><td>景点</td><td>jǐngdiǎn</td><td>tourist attraction</td></tr>
<tr><td>导游</td><td>dǎoyóu</td><td>tour guide</td></tr>
<tr><td>门票</td><td>ménpiào</td><td>entrance ticket</td></tr>
<tr><td>集合</td><td>jíhé</td><td>to gather, assemble</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我想预订一间…</strong> wǒ xiǎng yùdìng yì jiān… — I'd like to book a … room.</li>
<li><strong>请问…多少钱一晚?</strong> qǐngwèn… duōshao qián yì wǎn? — may I ask, how much per night?</li>
<li><strong>几点可以退房?</strong> jǐ diǎn kěyǐ tuìfáng? — what time can I check out?</li>
<li><strong>从这儿到…怎么走?</strong> cóng zhèr dào… zěnme zǒu? — how do I get from here to …?</li>
</ul>
<h3>Situational dialogue — shadow &amp; role-play</h3>
<pre><code>A: 喂，你好，我想预订一间双人间。 Wéi, nǐ hǎo, wǒ xiǎng yùdìng yì jiān shuāngrénjiān. (Hello, I'd like to book a double room.)
B: 好的，请问您想住几天？ Hǎo de, qǐngwèn nín xiǎng zhù jǐ tiān? (Sure, may I ask how many days you'd like to stay?)
A: 三天。请问一晚多少钱？需要押金吗？ Sān tiān. Qǐngwèn yì wǎn duōshao qián? Xūyào yājīn ma? (Three days. How much per night? Is a deposit needed?)
B: 一晚三百块，需要交一百块押金。退房时间是中午十二点。 Yì wǎn sānbǎi kuài, xūyào jiāo yìbǎi kuài yājīn. Tuìfáng shíjiān shì zhōngwǔ shí'èr diǎn. (300 yuan per night, a 100 yuan deposit is needed. Check-out time is 12 noon.)
</code></pre>
<h3>Longer listening passage — a tour announcement (monologue)</h3>
<pre><code>各位游客，欢迎参加今天的旅行团。我们先去参观一个有名的景点，大概玩两个小时，然后去饭馆吃午饭。下午三点我们去买门票，参观博物馆。今天晚上大家可以自由活动，明天早上八点在酒店门口集合。
Gèwèi yóukè, huānyíng cānjiā jīntiān de lǚxíngtuán. Wǒmen xiān qù cānguān yí ge yǒumíng de jǐngdiǎn, dàgài wán liǎng ge xiǎoshí, ránhòu qù fànguǎn chī wǔfàn. Xiàwǔ sān diǎn wǒmen qù mǎi ménpiào, cānguān bówùguǎn. Jīntiān wǎnshang dàjiā kěyǐ zìyóu huódòng, míngtiān zǎoshang bā diǎn zài jiǔdiàn ménkǒu jíhé.
(Dear tourists, welcome to today's tour group. We'll first visit a famous attraction, spend about two hours there, then go to a restaurant for lunch. At 3pm we'll buy tickets and visit the museum. Tonight everyone is free to do their own thing, and tomorrow morning we'll gather at the hotel entrance at 8am.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Itinerary passages are a chain of times: 先…大概…下午三点…明天早上八点. Jot down just the times and the matching activity — that alone answers most HSK3 questions on this kind of passage.</div>`,
    `<span class="eyebrow">CLS201 · Chương 5 · Bài 5.1</span>
<h2>Du lịch, đặt phòng &amp; hỏi thông tin</h2>
<h3>Từ vựng &amp; mẫu câu trọng tâm</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>预订</td><td>yùdìng</td><td>đặt trước</td></tr>
<tr><td>房间</td><td>fángjiān</td><td>phòng</td></tr>
<tr><td>双人间</td><td>shuāngrénjiān</td><td>phòng đôi</td></tr>
<tr><td>前台</td><td>qiántái</td><td>lễ tân</td></tr>
<tr><td>押金</td><td>yājīn</td><td>tiền đặt cọc</td></tr>
<tr><td>退房</td><td>tuìfáng</td><td>trả phòng</td></tr>
<tr><td>景点</td><td>jǐngdiǎn</td><td>điểm tham quan</td></tr>
<tr><td>导游</td><td>dǎoyóu</td><td>hướng dẫn viên</td></tr>
<tr><td>门票</td><td>ménpiào</td><td>vé vào cửa</td></tr>
<tr><td>集合</td><td>jíhé</td><td>tập trung</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我想预订一间…</strong> wǒ xiǎng yùdìng yì jiān… — tôi muốn đặt một phòng …</li>
<li><strong>请问…多少钱一晚?</strong> qǐngwèn… duōshao qián yì wǎn? — xin hỏi … bao nhiêu tiền một đêm?</li>
<li><strong>几点可以退房?</strong> jǐ diǎn kěyǐ tuìfáng? — mấy giờ có thể trả phòng?</li>
<li><strong>从这儿到…怎么走?</strong> cóng zhèr dào… zěnme zǒu? — từ đây đến … đi thế nào?</li>
</ul>
<h3>Hội thoại tình huống — nói nhại &amp; đóng vai</h3>
<pre><code>A: 喂，你好，我想预订一间双人间。 Wéi, nǐ hǎo, wǒ xiǎng yùdìng yì jiān shuāngrénjiān. (Alô, chào, tôi muốn đặt một phòng đôi.)
B: 好的，请问您想住几天？ Hǎo de, qǐngwèn nín xiǎng zhù jǐ tiān? (Vâng, xin hỏi anh/chị muốn ở mấy ngày?)
A: 三天。请问一晚多少钱？需要押金吗？ Sān tiān. Qǐngwèn yì wǎn duōshao qián? Xūyào yājīn ma? (Ba ngày. Xin hỏi một đêm bao nhiêu tiền? Có cần đặt cọc không?)
B: 一晚三百块，需要交一百块押金。退房时间是中午十二点。 Yì wǎn sānbǎi kuài, xūyào jiāo yìbǎi kuài yājīn. Tuìfáng shíjiān shì zhōngwǔ shí'èr diǎn. (Một đêm ba trăm tệ, cần đặt cọc một trăm tệ. Giờ trả phòng là mười hai giờ trưa.)
</code></pre>
<h3>Đoạn nghe dài hơn — thông báo lịch trình tour (độc thoại)</h3>
<pre><code>各位游客，欢迎参加今天的旅行团。我们先去参观一个有名的景点，大概玩两个小时，然后去饭馆吃午饭。下午三点我们去买门票，参观博物馆。今天晚上大家可以自由活动，明天早上八点在酒店门口集合。
Gèwèi yóukè, huānyíng cānjiā jīntiān de lǚxíngtuán. Wǒmen xiān qù cānguān yí ge yǒumíng de jǐngdiǎn, dàgài wán liǎng ge xiǎoshí, ránhòu qù fànguǎn chī wǔfàn. Xiàwǔ sān diǎn wǒmen qù mǎi ménpiào, cānguān bówùguǎn. Jīntiān wǎnshang dàjiā kěyǐ zìyóu huódòng, míngtiān zǎoshang bā diǎn zài jiǔdiàn ménkǒu jíhé.
(Kính chào quý khách, chào mừng tham gia đoàn du lịch hôm nay. Chúng ta sẽ tham quan một điểm nổi tiếng trước, chơi khoảng hai tiếng, sau đó đi nhà hàng ăn trưa. Ba giờ chiều chúng ta đi mua vé, tham quan bảo tàng. Tối nay mọi người có thể tự do hoạt động, sáng mai tám giờ tập trung ở cửa khách sạn.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Đoạn về lịch trình là một chuỗi mốc giờ: 先…大概…下午三点…明天早上八点. Chỉ cần ghi lại giờ và hoạt động tương ứng — vậy là trả lời được hầu hết câu hỏi HSK3 dạng này.</div>`,
  ]]);

const c5q = quiz('cls201-quiz-5', 'Quiz 5 — Travel & hotel booking|||Quiz 5 — Du lịch & đặt phòng', [
  { id: 'q1', question: '"我想预订一间双人间" nghĩa là gì?', options: ['Tôi muốn đặt một phòng đôi', 'Tôi muốn trả phòng', 'Tôi muốn đổi phòng', 'Tôi muốn huỷ đặt phòng'], correctIndex: 0, explanation: '预订 = đặt trước; 双人间 = phòng đôi.' },
  { id: 'q2', question: 'Theo đoạn nghe, mấy giờ sáng mai đoàn tập trung?', options: ['8 giờ sáng', '12 giờ trưa', '3 giờ chiều', '8 giờ tối'], correctIndex: 0, explanation: 'Đoạn nghe: "明天早上八点在酒店门口集合".' },
  { id: 'q3', question: '"退房" (tuìfáng) nghĩa là gì?', options: ['Trả phòng', 'Đặt phòng', 'Đổi phòng', 'Dọn phòng'], correctIndex: 0, explanation: '退房 = trả phòng khi rời khách sạn.' },
]);

const c6 = doc('cls201-6-1-feelings-opinions', 'Chapter 6 — Expressing feelings, opinions & suggestions|||Chương 6 — Bày tỏ cảm xúc, ý kiến & đề nghị',
  'Mẫu câu: 我对…感到…, 我觉得/我认为, 要是我…我会, 你觉得…怎么样; từ 满意/失望/担心/建议/看法; luyện nêu ý kiến và nghe một đoạn chia sẻ cảm xúc.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 6 · Lesson 6.1</span>
<h2>Expressing feelings, opinions &amp; suggestions</h2>
<h3>Vocabulary &amp; key patterns</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>感到</td><td>gǎndào</td><td>to feel</td></tr>
<tr><td>满意</td><td>mǎnyì</td><td>satisfied</td></tr>
<tr><td>失望</td><td>shīwàng</td><td>disappointed</td></tr>
<tr><td>担心</td><td>dānxīn</td><td>worried</td></tr>
<tr><td>建议</td><td>jiànyì</td><td>to suggest; suggestion</td></tr>
<tr><td>看法</td><td>kànfǎ</td><td>view, opinion</td></tr>
<tr><td>赞成</td><td>zànchéng</td><td>to approve, to agree</td></tr>
<tr><td>提议</td><td>tíyì</td><td>to propose</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我对…感到…</strong> wǒ duì… gǎndào… — I feel … about …</li>
<li><strong>我觉得/我认为…</strong> wǒ juéde/wǒ rènwéi… — I think that …</li>
<li><strong>要是我，我会…</strong> yàoshi wǒ, wǒ huì… — if I were you, I would …</li>
<li><strong>你觉得…怎么样?</strong> nǐ juéde… zěnmeyàng? — what do you think of …?</li>
</ul>
<h3>Situational dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你对这次的活动有什么看法？ Nǐ duì zhè cì de huódòng yǒu shénme kànfǎ? (What's your view on this event?)
B: 说实话，我有点儿失望，觉得安排得不太好。 Shuō shíhuà, wǒ yǒudiǎnr shīwàng, juéde ānpái de bú tài hǎo. (To be honest, I'm a bit disappointed — I feel it wasn't arranged very well.)
A: 那你有什么建议？ Nà nǐ yǒu shénme jiànyì? (So what's your suggestion?)
B: 我建议下次提前一个星期做好计划，这样大家就不用担心时间不够了。 Wǒ jiànyì xiàcì tíqián yí ge xīngqī zuò hǎo jìhuà, zhèyàng dàjiā jiù bú yòng dānxīn shíjiān bú gòu le. (I suggest next time we make the plan a week in advance, so everyone won't worry about not having enough time.)
</code></pre>
<h3>Longer listening passage — sharing feelings about a change (monologue)</h3>
<pre><code>我朋友最近换了工作，她跟我说她对新工作感到很满意，因为同事都很热情，工作也很有意思。不过她也有点儿担心，怕自己做不好新的任务。我建议她多跟同事学习，慢慢就会习惯的。
Wǒ péngyou zuìjìn huànle gōngzuò, tā gēn wǒ shuō tā duì xīn gōngzuò gǎndào hěn mǎnyì, yīnwèi tóngshì dōu hěn rèqíng, gōngzuò yě hěn yǒu yìsi. Búguò tā yě yǒudiǎnr dānxīn, pà zìjǐ zuò bu hǎo xīn de rènwu. Wǒ jiànyì tā duō gēn tóngshì xuéxí, mànmàn jiù huì xíguàn de.
(My friend recently changed jobs. She told me she's very satisfied with the new job, because her colleagues are all warm and friendly, and the work is interesting too. But she's also a bit worried, afraid she won't do the new tasks well. I suggested she learn more from her colleagues, and she'll gradually get used to it.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Feelings passages often pair a positive with a 不过/但是 twist ("satisfied … but also worried"). Don't stop listening at the first feeling word — the sentence after 不过 is usually the part a question asks about.</div>`,
    `<span class="eyebrow">CLS201 · Chương 6 · Bài 6.1</span>
<h2>Bày tỏ cảm xúc, ý kiến &amp; đề nghị</h2>
<h3>Từ vựng &amp; mẫu câu trọng tâm</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>感到</td><td>gǎndào</td><td>cảm thấy</td></tr>
<tr><td>满意</td><td>mǎnyì</td><td>hài lòng</td></tr>
<tr><td>失望</td><td>shīwàng</td><td>thất vọng</td></tr>
<tr><td>担心</td><td>dānxīn</td><td>lo lắng</td></tr>
<tr><td>建议</td><td>jiànyì</td><td>đề nghị, khuyên</td></tr>
<tr><td>看法</td><td>kànfǎ</td><td>quan điểm</td></tr>
<tr><td>赞成</td><td>zànchéng</td><td>tán thành</td></tr>
<tr><td>提议</td><td>tíyì</td><td>đề xuất</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我对…感到…</strong> wǒ duì… gǎndào… — tôi cảm thấy … về …</li>
<li><strong>我觉得/我认为…</strong> wǒ juéde/wǒ rènwéi… — tôi thấy/tôi cho rằng …</li>
<li><strong>要是我，我会…</strong> yàoshi wǒ, wǒ huì… — nếu là tôi, tôi sẽ …</li>
<li><strong>你觉得…怎么样?</strong> nǐ juéde… zěnmeyàng? — bạn thấy … thế nào?</li>
</ul>
<h3>Hội thoại tình huống — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你对这次的活动有什么看法？ Nǐ duì zhè cì de huódòng yǒu shénme kànfǎ? (Bạn thấy sự kiện lần này thế nào?)
B: 说实话，我有点儿失望，觉得安排得不太好。 Shuō shíhuà, wǒ yǒudiǎnr shīwàng, juéde ānpái de bú tài hǎo. (Nói thật, tôi hơi thất vọng, thấy sắp xếp chưa được tốt lắm.)
A: 那你有什么建议？ Nà nǐ yǒu shénme jiànyì? (Vậy bạn có đề nghị gì không?)
B: 我建议下次提前一个星期做好计划，这样大家就不用担心时间不够了。 Wǒ jiànyì xiàcì tíqián yí ge xīngqī zuò hǎo jìhuà, zhèyàng dàjiā jiù bú yòng dānxīn shíjiān bú gòu le. (Tôi đề nghị lần sau chuẩn bị kế hoạch sớm một tuần, như vậy mọi người sẽ không phải lo thiếu thời gian nữa.)
</code></pre>
<h3>Đoạn nghe dài hơn — chia sẻ cảm xúc về một thay đổi (độc thoại)</h3>
<pre><code>我朋友最近换了工作，她跟我说她对新工作感到很满意，因为同事都很热情，工作也很有意思。不过她也有点儿担心，怕自己做不好新的任务。我建议她多跟同事学习，慢慢就会习惯的。
Wǒ péngyou zuìjìn huànle gōngzuò, tā gēn wǒ shuō tā duì xīn gōngzuò gǎndào hěn mǎnyì, yīnwèi tóngshì dōu hěn rèqíng, gōngzuò yě hěn yǒu yìsi. Búguò tā yě yǒudiǎnr dānxīn, pà zìjǐ zuò bu hǎo xīn de rènwu. Wǒ jiànyì tā duō gēn tóngshì xuéxí, mànmàn jiù huì xíguàn de.
(Bạn tôi vừa đổi việc, bạn ấy nói với tôi rằng bạn ấy rất hài lòng với công việc mới, vì đồng nghiệp đều rất nhiệt tình, công việc cũng thú vị. Nhưng bạn ấy cũng hơi lo, sợ mình làm không tốt nhiệm vụ mới. Tôi khuyên bạn ấy học hỏi thêm từ đồng nghiệp, dần dần sẽ quen thôi.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Đoạn về cảm xúc hay ghép một ý tích cực với một cú lật bằng 不过/但是 ("hài lòng … nhưng cũng lo lắng"). Đừng dừng nghe ở từ cảm xúc đầu tiên — câu sau 不过 mới thường là điều câu hỏi nhắm tới.</div>`,
  ]]);

const c6q = quiz('cls201-quiz-6', 'Quiz 6 — Feelings, opinions & suggestions|||Quiz 6 — Cảm xúc, ý kiến & đề nghị', [
  { id: 'q1', question: '"我对新工作感到很满意" nghĩa là gì?', options: ['Tôi rất hài lòng với công việc mới', 'Tôi rất thất vọng về công việc mới', 'Tôi lo lắng về công việc mới', 'Tôi không thích công việc mới'], correctIndex: 0, explanation: '感到满意 = cảm thấy hài lòng.' },
  { id: 'q2', question: 'Trong đoạn nghe, bạn của người nói lo lắng điều gì?', options: ['Sợ làm không tốt nhiệm vụ mới', 'Sợ đồng nghiệp không thân thiện', 'Sợ lương thấp', 'Sợ đi làm xa'], correctIndex: 0, explanation: 'Đoạn nghe: "怕自己做不好新的任务".' },
  { id: 'q3', question: 'Mẫu câu nào dùng để hỏi ý kiến người khác?', options: ['你觉得…怎么样？', '多少钱？', '几点了？', '你叫什么名字？'], correctIndex: 0, explanation: '你觉得…怎么样 = bạn thấy … thế nào — dùng để hỏi ý kiến.' },
]);

const c7 = doc('cls201-7-1-phone-appointments', 'Chapter 7 — Phone calls & making appointments|||Chương 7 — Giao tiếp qua điện thoại & hẹn gặp',
  'Mẫu câu: 我们几点/在哪儿见面, 你什么时候方便, 到时候见, 别忘了; từ 约/改约/确认/挂电话; luyện hẹn gặp qua điện thoại và nghe một tin nhắn thoại.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 7 · Lesson 7.1</span>
<h2>Phone calls &amp; making appointments</h2>
<h3>Vocabulary &amp; key patterns</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>打电话</td><td>dǎ diànhuà</td><td>to make a phone call</td></tr>
<tr><td>接电话</td><td>jiē diànhuà</td><td>to answer the phone</td></tr>
<tr><td>约</td><td>yuē</td><td>to arrange (a meeting)</td></tr>
<tr><td>见面</td><td>jiànmiàn</td><td>to meet</td></tr>
<tr><td>迟到</td><td>chídào</td><td>to be late</td></tr>
<tr><td>改约</td><td>gǎiyuē</td><td>to reschedule</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>convenient</td></tr>
<tr><td>确认</td><td>quèrèn</td><td>to confirm</td></tr>
<tr><td>挂电话</td><td>guà diànhuà</td><td>to hang up</td></tr>
</table>
<h3>Key patterns to say</h3>
<ul>
<li><strong>我们几点/在哪儿见面?</strong> wǒmen jǐ diǎn/zài nǎr jiànmiàn? — what time / where shall we meet?</li>
<li><strong>你什么时候方便?</strong> nǐ shénme shíhou fāngbiàn? — when is convenient for you?</li>
<li><strong>到时候见</strong> dào shíhou jiàn — see you then.</li>
<li><strong>别忘了 + V</strong> bié wàngle + V — don't forget to …</li>
</ul>
<h3>Situational dialogue — shadow &amp; role-play</h3>
<pre><code>A: 喂，是小王吗？我们明天几点见面？ Wéi, shì Xiǎo Wáng ma? Wǒmen míngtiān jǐ diǎn jiànmiàn? (Hello, is this Xiao Wang? What time shall we meet tomorrow?)
B: 下午两点怎么样？你什么时候方便？ Xiàwǔ liǎng diǎn zěnmeyàng? Nǐ shénme shíhou fāngbiàn? (How about 2pm? When is convenient for you?)
A: 两点可以。那我们就约在图书馆门口吧，到时候见。 Liǎng diǎn kěyǐ. Nà wǒmen jiù yuē zài túshūguǎn ménkǒu ba, dào shíhou jiàn. (2pm works. Let's arrange to meet at the library entrance then, see you then.)
B: 好，别忘了带你的笔记本，先挂了，再见！ Hǎo, bié wàngle dài nǐ de bǐjìběn, xiān guà le, zàijiàn! (Okay, don't forget to bring your notebook — I'll hang up now, bye!)
</code></pre>
<h3>Longer listening passage — a voicemail rescheduling (monologue)</h3>
<pre><code>你好，我是小李。因为明天有点儿急事，我们的约会得改约了。要是可以的话，我们改到后天下午三点，在咖啡馆见面，你方便的话给我回个电话确认一下，谢谢！
Nǐ hǎo, wǒ shì Xiǎo Lǐ. Yīnwèi míngtiān yǒudiǎnr jíshì, wǒmen de yuēhuì děi gǎiyuē le. Yàoshi kěyǐ dehuà, wǒmen gǎidào hòutiān xiàwǔ sān diǎn, zài kāfēiguǎn jiànmiàn, nǐ fāngbiàn dehuà gěi wǒ huí ge diànhuà quèrèn yíxià, xièxie!
(Hello, this is Xiao Li. Since I have something urgent tomorrow, we need to reschedule our appointment. If possible, let's change it to the day after tomorrow at 3pm, meeting at the café. If it's convenient, please call me back to confirm, thanks!)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Voicemails give one new time and one new place — the old plan is only mentioned to be cancelled. Listen past the reason (因为…) straight to 改到… (changed to …) for the actual new detail.</div>`,
    `<span class="eyebrow">CLS201 · Chương 7 · Bài 7.1</span>
<h2>Giao tiếp qua điện thoại &amp; hẹn gặp</h2>
<h3>Từ vựng &amp; mẫu câu trọng tâm</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>打电话</td><td>dǎ diànhuà</td><td>gọi điện thoại</td></tr>
<tr><td>接电话</td><td>jiē diànhuà</td><td>nghe điện thoại</td></tr>
<tr><td>约</td><td>yuē</td><td>hẹn</td></tr>
<tr><td>见面</td><td>jiànmiàn</td><td>gặp mặt</td></tr>
<tr><td>迟到</td><td>chídào</td><td>đến muộn</td></tr>
<tr><td>改约</td><td>gǎiyuē</td><td>đổi lịch hẹn</td></tr>
<tr><td>方便</td><td>fāngbiàn</td><td>tiện</td></tr>
<tr><td>确认</td><td>quèrèn</td><td>xác nhận</td></tr>
<tr><td>挂电话</td><td>guà diànhuà</td><td>cúp máy</td></tr>
</table>
<h3>Mẫu câu giao tiếp trọng tâm</h3>
<ul>
<li><strong>我们几点/在哪儿见面?</strong> wǒmen jǐ diǎn/zài nǎr jiànmiàn? — mấy giờ/ở đâu mình gặp nhau?</li>
<li><strong>你什么时候方便?</strong> nǐ shénme shíhou fāngbiàn? — khi nào bạn tiện?</li>
<li><strong>到时候见</strong> dào shíhou jiàn — lúc đó gặp nhé.</li>
<li><strong>别忘了 + động từ</strong> bié wàngle + V — đừng quên …</li>
</ul>
<h3>Hội thoại tình huống — nói nhại &amp; đóng vai</h3>
<pre><code>A: 喂，是小王吗？我们明天几点见面？ Wéi, shì Xiǎo Wáng ma? Wǒmen míngtiān jǐ diǎn jiànmiàn? (Alô, phải Tiểu Vương không? Mai mấy giờ mình gặp nhau?)
B: 下午两点怎么样？你什么时候方便？ Xiàwǔ liǎng diǎn zěnmeyàng? Nǐ shénme shíhou fāngbiàn? (Hai giờ chiều được không? Khi nào bạn tiện?)
A: 两点可以。那我们就约在图书馆门口吧，到时候见。 Liǎng diǎn kěyǐ. Nà wǒmen jiù yuē zài túshūguǎn ménkǒu ba, dào shíhou jiàn. (Hai giờ được. Vậy mình hẹn ở cửa thư viện nhé, lúc đó gặp.)
B: 好，别忘了带你的笔记本，先挂了，再见！ Hǎo, bié wàngle dài nǐ de bǐjìběn, xiān guà le, zàijiàn! (Được, đừng quên mang vở của bạn nhé, mình cúp máy trước đây, tạm biệt!)
</code></pre>
<h3>Đoạn nghe dài hơn — tin nhắn thoại đổi lịch hẹn (độc thoại)</h3>
<pre><code>你好，我是小李。因为明天有点儿急事，我们的约会得改约了。要是可以的话，我们改到后天下午三点，在咖啡馆见面，你方便的话给我回个电话确认一下，谢谢！
Nǐ hǎo, wǒ shì Xiǎo Lǐ. Yīnwèi míngtiān yǒudiǎnr jíshì, wǒmen de yuēhuì děi gǎiyuē le. Yàoshi kěyǐ dehuà, wǒmen gǎidào hòutiān xiàwǔ sān diǎn, zài kāfēiguǎn jiànmiàn, nǐ fāngbiàn dehuà gěi wǒ huí ge diànhuà quèrèn yíxià, xièxie!
(Chào bạn, mình là Tiểu Lý. Vì mai mình có việc gấp nên cuộc hẹn của mình phải đổi lịch rồi. Nếu được thì mình đổi sang ba giờ chiều ngày kia, gặp nhau ở quán cà phê, nếu tiện thì gọi lại xác nhận giúp mình nhé, cảm ơn!)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Tin nhắn thoại chỉ đưa ra một giờ mới và một địa điểm mới — kế hoạch cũ chỉ được nhắc tới để huỷ. Hãy nghe qua phần lý do (因为…) để bắt thẳng vào 改到… (đổi sang …) — đó mới là chi tiết mới thật sự.</div>`,
  ]]);

const c7q = quiz('cls201-quiz-7', 'Quiz 7 — Phone calls & appointments|||Quiz 7 — Điện thoại & hẹn gặp', [
  { id: 'q1', question: '"我们改约到后天" nghĩa là gì?', options: ['Đổi lịch hẹn sang ngày kia', 'Huỷ hẹn luôn', 'Giữ nguyên lịch hẹn', 'Hẹn sớm hơn'], correctIndex: 0, explanation: '改约 = đổi lịch hẹn; 后天 = ngày kia.' },
  { id: 'q2', question: 'Theo tin nhắn thoại, cuộc hẹn mới diễn ra ở đâu?', options: ['Quán cà phê', 'Thư viện', 'Bệnh viện', 'Sân bay'], correctIndex: 0, explanation: 'Đoạn nghe: "在咖啡馆见面".' },
  { id: 'q3', question: '"别忘了" nghĩa là gì?', options: ['Đừng quên', 'Hãy nhớ trả tiền', 'Xin lỗi', 'Tạm biệt'], correctIndex: 0, explanation: '别忘了 + động từ = đừng quên làm gì.' },
]);

const c8 = doc('cls201-8-1-review-comprehensive', 'Chapter 8 — Review: a longer passage, a short talk & a mixed dialogue|||Chương 8 — Ôn tập: nghe đoạn dài, thuyết trình ngắn & hội thoại tình huống',
  'Ôn tổng hợp: đoạn nghe dài (~8 câu), mẫu khung thuyết trình ngắn 首先…然后…总的来说, hội thoại tình huống kết hợp sức khoẻ/du lịch/điện thoại, và mẹo nghe HSK3.',
  [[
    `<span class="eyebrow">CLS201 · Chapter 8 · Lesson 8.1</span>
<h2>Review: a longer passage, a short talk &amp; a mixed situational dialogue</h2>
<h3>Vocabulary for summarising &amp; presenting</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>总的来说</td><td>zǒngdeláishuō</td><td>overall, in general</td></tr>
<tr><td>简单来说</td><td>jiǎndān láishuō</td><td>simply put</td></tr>
<tr><td>总结</td><td>zǒngjié</td><td>to summarise</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>topic</td></tr>
<tr><td>提到</td><td>tídào</td><td>to mention</td></tr>
<tr><td>重点</td><td>zhòngdiǎn</td><td>key point</td></tr>
<tr><td>根据</td><td>gēnjù</td><td>according to</td></tr>
</table>
<h3>Short-talk frame</h3>
<ul>
<li><strong>首先…，然后…，最后…</strong> shǒuxiān…, ránhòu…, zuìhòu… — first …, then …, finally … (structures a short talk).</li>
<li><strong>总的来说，…</strong> zǒngdeláishuō, … — overall, … (closes with the main takeaway).</li>
</ul>
<h3>Longer listening passage (~8 sentences, combining chapters 1-7)</h3>
<pre><code>上个星期我们公司组织了一次旅游活动，我打算跟同事们一起去杭州。出发前一天我有点儿感冒，还发烧了，医生让我在家休息，所以我没能提前去买票。后来我打电话给同事，改约了一起去的时间。到了杭州以后，我发现这个城市比我想象的更美，风景跟照片上的一样好看。我们先参观了有名的景点，然后去了一家很有特色的饭馆吃饭。总的来说，这次旅行虽然一开始有点儿麻烦，但是结果非常愉快，我打算以后有机会再去一次。
Shàng ge xīngqī wǒmen gōngsī zǔzhīle yí cì lǚyóu huódòng, wǒ dǎsuàn gēn tóngshìmen yìqǐ qù Hángzhōu. Chūfā qián yì tiān wǒ yǒudiǎnr gǎnmào, hái fāshāo le, yīshēng ràng wǒ zài jiā xiūxi, suǒyǐ wǒ méi néng tíqián qù mǎi piào. Hòulái wǒ dǎ diànhuà gěi tóngshì, gǎiyuēle yìqǐ qù de shíjiān. Dàole Hángzhōu yǐhòu, wǒ fāxiàn zhège chéngshì bǐ wǒ xiǎngxiàng de gèng měi, fēngjǐng gēn zhàopiàn shang de yíyàng hǎokàn. Wǒmen xiān cānguānle yǒumíng de jǐngdiǎn, ránhòu qùle yì jiā hěn yǒu tèsè de fànguǎn chīfàn. Zǒngdeláishuō, zhè cì lǚxíng suīrán yì kāishǐ yǒudiǎnr máfan, dànshì jiéguǒ fēicháng yúkuài, wǒ dǎsuàn yǐhòu yǒu jīhuì zài qù yí cì.
(Last week our company organised a trip, and I planned to go to Hangzhou with my colleagues. The day before departure I caught a bit of a cold and even had a fever; the doctor told me to rest at home, so I couldn't go buy the tickets in advance. Afterwards I called a colleague and we rearranged the time to go together. After arriving in Hangzhou, I found this city more beautiful than I had imagined — the scenery was just as pretty as in the photos. We first visited a famous attraction, then went to a restaurant with a lot of character to eat. Overall, although this trip was a bit of a hassle at the start, it turned out to be very enjoyable, and I plan to go again if I get the chance.)
</code></pre>
<h3>Short talk sample — my listening-speaking study plan</h3>
<pre><code>大家好，今天我想简单谈谈我的听说学习计划。首先，我打算每天听半个小时的中文材料，练习抓住重点。然后，我会多跟同学练习对话，比如打电话、看病、订酒店这些情景。最后，我打算每个星期做一次小小的口头总结。总的来说，我的目标是能听懂比较长的段落，也能自信地说出一段完整的话。
Dàjiā hǎo, jīntiān wǒ xiǎng jiǎndān tántan wǒ de tīngshuō xuéxí jìhuà. Shǒuxiān, wǒ dǎsuàn měitiān tīng bàn ge xiǎoshí de Zhōngwén cáiliào, liànxí zhuāzhù zhòngdiǎn. Ránhòu, wǒ huì duō gēn tóngxué liànxí duìhuà, bǐrú dǎ diànhuà, kànbìng, dìng jiǔdiàn zhèxiē qíngjǐng. Zuìhòu, wǒ dǎsuàn měi ge xīngqī zuò yí cì xiǎoxiǎo de kǒutóu zǒngjié. Zǒngdeláishuō, wǒ de mùbiāo shì néng tīngdǒng bǐjiào cháng de duànluò, yě néng zìxìn de shuō chū yí duàn wánzhěng de huà.
(Hi everyone, today I'd like to briefly talk about my listening-speaking study plan. First, I plan to listen to half an hour of Chinese material every day, practising catching the key points. Then, I'll practise conversations with classmates more, situations like phone calls, seeing a doctor, booking a hotel. Finally, I plan to do a short spoken summary once a week. Overall, my goal is to be able to understand fairly long passages, and also speak a complete passage confidently.)
</code></pre>
<h3>Mixed situational dialogue — hotel front desk (health + travel + phone review)</h3>
<pre><code>客人: 前台你好，我想问一下，因为我有点儿不舒服，可以提前退房吗？ Qiántái nǐ hǎo, wǒ xiǎng wènyíxià, yīnwèi wǒ yǒudiǎnr bù shūfu, kěyǐ tíqián tuìfáng ma? (Hello front desk, since I'm feeling a bit unwell, can I check out early?)
前台: 没问题，请问您需要我们帮您叫医生吗？ Méi wèntí, qǐngwèn nín xūyào wǒmen bāng nín jiào yīshēng ma? (No problem, would you like us to call a doctor for you?)
客人: 不用了，谢谢，我已经吃了药。对了，我们后天的旅游计划可能要改一下时间。 Bú yòng le, xièxie, wǒ yǐjīng chīle yào. Duìle, wǒmen hòutiān de lǚyóu jìhuà kěnéng yào gǎi yíxià shíjiān. (No need, thanks, I've already taken medicine. By the way, our sightseeing plan for the day after tomorrow might need to change time.)
前台: 好的，我帮您跟导游联系，确认新的时间后给您打电话。 Hǎo de, wǒ bāng nín gēn dǎoyóu liánxì, quèrèn xīn de shíjiān hòu gěi nín dǎ diànhuà. (Okay, I'll contact the tour guide for you, and call you once the new time is confirmed.)
</code></pre>
<div class="callout"><span class="badge">HSK3 listening checklist</span>
<ol>
<li>Read the question stem first — predict what to listen for.</li>
<li>Catch numbers, times &amp; names as they pass.</li>
<li>Follow the connectors — 因为/所以, 后来, 结果, 不过/但是 — they carry the structure.</li>
<li>Give a short talk in the 首先…然后…总的来说 frame — it's the easiest way to sound organised.</li>
</ol></div>`,
    `<span class="eyebrow">CLS201 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: đoạn nghe dài, thuyết trình ngắn &amp; hội thoại tình huống tổng hợp</h2>
<h3>Từ vựng để tóm tắt &amp; trình bày</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>总的来说</td><td>zǒngdeláishuō</td><td>nhìn chung</td></tr>
<tr><td>简单来说</td><td>jiǎndān láishuō</td><td>nói đơn giản</td></tr>
<tr><td>总结</td><td>zǒngjié</td><td>tổng kết</td></tr>
<tr><td>主题</td><td>zhǔtí</td><td>chủ đề</td></tr>
<tr><td>提到</td><td>tídào</td><td>nhắc đến</td></tr>
<tr><td>重点</td><td>zhòngdiǎn</td><td>trọng tâm</td></tr>
<tr><td>根据</td><td>gēnjù</td><td>dựa theo</td></tr>
</table>
<h3>Khung thuyết trình ngắn</h3>
<ul>
<li><strong>首先…，然后…，最后…</strong> shǒuxiān…, ránhòu…, zuìhòu… — trước tiên …, sau đó …, cuối cùng … (dựng khung một bài nói ngắn).</li>
<li><strong>总的来说，…</strong> zǒngdeláishuō, … — nhìn chung, … (chốt ý chính ở cuối).</li>
</ul>
<h3>Đoạn nghe dài hơn (~8 câu, tổng hợp chương 1-7)</h3>
<pre><code>上个星期我们公司组织了一次旅游活动，我打算跟同事们一起去杭州。出发前一天我有点儿感冒，还发烧了，医生让我在家休息，所以我没能提前去买票。后来我打电话给同事，改约了一起去的时间。到了杭州以后，我发现这个城市比我想象的更美，风景跟照片上的一样好看。我们先参观了有名的景点，然后去了一家很有特色的饭馆吃饭。总的来说，这次旅行虽然一开始有点儿麻烦，但是结果非常愉快，我打算以后有机会再去一次。
Shàng ge xīngqī wǒmen gōngsī zǔzhīle yí cì lǚyóu huódòng, wǒ dǎsuàn gēn tóngshìmen yìqǐ qù Hángzhōu. Chūfā qián yì tiān wǒ yǒudiǎnr gǎnmào, hái fāshāo le, yīshēng ràng wǒ zài jiā xiūxi, suǒyǐ wǒ méi néng tíqián qù mǎi piào. Hòulái wǒ dǎ diànhuà gěi tóngshì, gǎiyuēle yìqǐ qù de shíjiān. Dàole Hángzhōu yǐhòu, wǒ fāxiàn zhège chéngshì bǐ wǒ xiǎngxiàng de gèng měi, fēngjǐng gēn zhàopiàn shang de yíyàng hǎokàn. Wǒmen xiān cānguānle yǒumíng de jǐngdiǎn, ránhòu qùle yì jiā hěn yǒu tèsè de fànguǎn chīfàn. Zǒngdeláishuō, zhè cì lǚxíng suīrán yì kāishǐ yǒudiǎnr máfan, dànshì jiéguǒ fēicháng yúkuài, wǒ dǎsuàn yǐhòu yǒu jīhuì zài qù yí cì.
(Tuần trước công ty tôi tổ chức một chuyến du lịch, tôi dự định cùng đồng nghiệp đi Hàng Châu. Ngày trước khi khởi hành tôi hơi cảm và còn bị sốt, bác sĩ bảo tôi nghỉ ở nhà, nên tôi không kịp đi mua vé trước. Sau đó tôi gọi điện cho đồng nghiệp, đổi lại thời gian đi cùng nhau. Đến Hàng Châu rồi, tôi thấy thành phố này đẹp hơn tôi tưởng, phong cảnh đẹp giống hệt trong ảnh. Chúng tôi tham quan điểm nổi tiếng trước, sau đó đến một nhà hàng rất có đặc trưng để ăn. Nhìn chung, chuyến đi này tuy lúc đầu hơi rắc rối, nhưng kết quả lại rất vui vẻ, tôi dự định sau này có dịp sẽ đi lại một lần nữa.)
</code></pre>
<h3>Mẫu thuyết trình ngắn — kế hoạch học nghe-nói của tôi</h3>
<pre><code>大家好，今天我想简单谈谈我的听说学习计划。首先，我打算每天听半个小时的中文材料，练习抓住重点。然后，我会多跟同学练习对话，比如打电话、看病、订酒店这些情景。最后，我打算每个星期做一次小小的口头总结。总的来说，我的目标是能听懂比较长的段落，也能自信地说出一段完整的话。
Dàjiā hǎo, jīntiān wǒ xiǎng jiǎndān tántan wǒ de tīngshuō xuéxí jìhuà. Shǒuxiān, wǒ dǎsuàn měitiān tīng bàn ge xiǎoshí de Zhōngwén cáiliào, liànxí zhuāzhù zhòngdiǎn. Ránhòu, wǒ huì duō gēn tóngxué liànxí duìhuà, bǐrú dǎ diànhuà, kànbìng, dìng jiǔdiàn zhèxiē qíngjǐng. Zuìhòu, wǒ dǎsuàn měi ge xīngqī zuò yí cì xiǎoxiǎo de kǒutóu zǒngjié. Zǒngdeláishuō, wǒ de mùbiāo shì néng tīngdǒng bǐjiào cháng de duànluò, yě néng zìxìn de shuō chū yí duàn wánzhěng de huà.
(Chào mọi người, hôm nay tôi muốn nói ngắn gọn về kế hoạch học nghe-nói của mình. Trước tiên, tôi dự định mỗi ngày nghe nửa tiếng tài liệu tiếng Trung, luyện bắt trọng tâm. Sau đó, tôi sẽ luyện hội thoại với bạn học nhiều hơn, ví dụ các tình huống như gọi điện, khám bệnh, đặt khách sạn. Cuối cùng, tôi dự định mỗi tuần làm một bài tổng kết nói ngắn. Nhìn chung, mục tiêu của tôi là nghe hiểu được đoạn tương đối dài, và cũng tự tin nói được một đoạn hoàn chỉnh.)
</code></pre>
<h3>Hội thoại tình huống tổng hợp — tại quầy lễ tân khách sạn (ôn sức khoẻ + du lịch + điện thoại)</h3>
<pre><code>客人: 前台你好，我想问一下，因为我有点儿不舒服，可以提前退房吗？ Qiántái nǐ hǎo, wǒ xiǎng wènyíxià, yīnwèi wǒ yǒudiǎnr bù shūfu, kěyǐ tíqián tuìfáng ma? (Chào lễ tân, tôi muốn hỏi, vì tôi hơi khó chịu, tôi có thể trả phòng sớm không?)
前台: 没问题，请问您需要我们帮您叫医生吗？ Méi wèntí, qǐngwèn nín xūyào wǒmen bāng nín jiào yīshēng ma? (Không vấn đề gì, anh/chị có cần chúng tôi gọi bác sĩ giúp không?)
客人: 不用了，谢谢，我已经吃了药。对了，我们后天的旅游计划可能要改一下时间。 Bú yòng le, xièxie, wǒ yǐjīng chīle yào. Duìle, wǒmen hòutiān de lǚyóu jìhuà kěnéng yào gǎi yíxià shíjiān. (Không cần đâu, cảm ơn, tôi uống thuốc rồi. À, kế hoạch du lịch ngày kia của chúng tôi có thể phải đổi giờ.)
前台: 好的，我帮您跟导游联系，确认新的时间后给您打电话。 Hǎo de, wǒ bāng nín gēn dǎoyóu liánxì, quèrèn xīn de shíjiān hòu gěi nín dǎ diànhuà. (Vâng, tôi sẽ liên hệ với hướng dẫn viên giúp anh/chị, xác nhận giờ mới rồi sẽ gọi điện lại cho anh/chị.)
</code></pre>
<div class="callout"><span class="badge">Danh sách mẹo nghe HSK3</span>
<ol>
<li>Đọc câu hỏi trước — đoán trước cần nghe điều gì.</li>
<li>Bắt số liệu, thời gian, tên riêng khi chúng lướt qua.</li>
<li>Theo dõi từ nối — 因为/所以, 后来, 结果, 不过/但是 — chúng mang cả mạch bài.</li>
<li>Thuyết trình ngắn theo khung 首先…然后…总的来说 — cách dễ nhất để nghe có tổ chức.</li>
</ol></div>`,
  ]]);

const c8q = quiz('cls201-quiz-8', 'Quiz 8 — Review: long passage, short talk & dialogue|||Quiz 8 — Ôn tập: đoạn nghe dài, thuyết trình & hội thoại', [
  { id: 'q1', question: 'Trong đoạn nghe dài, vì sao người nói không kịp mua vé trước?', options: ['Vì bị cảm/sốt phải nghỉ ở nhà', 'Vì hết vé', 'Vì đổi ý không muốn đi', 'Vì trời mưa'], correctIndex: 0, explanation: 'Đoạn nghe: "我有点儿感冒，还发烧了，医生让我在家休息，所以我没能提前去买票".' },
  { id: 'q2', question: 'Mẹo nghe nào giúp nắm ý chính trước khi nghe chi tiết?', options: ['Đọc câu hỏi trước để đoán nội dung', 'Chỉ nghe đúng một lần rồi thôi', 'Bỏ qua hết số liệu', 'Dịch từng từ một sang tiếng Việt'], correctIndex: 0, explanation: 'Đọc câu hỏi trước giúp đoán chủ đề và biết cần bắt thông tin gì khi nghe.' },
  { id: 'q3', question: '"总的来说" dùng để làm gì trong một bài nói/nghe?', options: ['Tóm lại, chốt ý chung', 'Hỏi lại thông tin', 'Mở đầu câu chuyện', 'Xin lỗi'], correctIndex: 0, explanation: '总的来说 = nhìn chung, dùng để tóm tắt ý chính ở cuối bài nói hoặc đoạn nghe.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CLS201',
    slug: 'cls201-chinese-listening-speaking-skills-2',
    title: 'Chinese Listening & Speaking Skills 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CLS201.webp',
    shortDescription: 'Chinese Listening & Speaking 2 (HSK3), continuing CLS101: past experiences, comparisons, health & clinic, plans & work, travel & hotel booking, opinions & suggestions, phone calls & appointments, plus review: long passages & a short talk.|||Kỹ năng Nghe - Nói tiếng Trung 2 (HSK3), nối tiếp CLS101: trải nghiệm quá khứ, so sánh, sức khoẻ & khám bệnh, kế hoạch & công việc, du lịch & đặt phòng, ý kiến & đề nghị, điện thoại & hẹn gặp, ôn tập nghe đoạn dài & thuyết trình.',
    description: 'Môn <strong>CLS201 — Chinese Listening &amp; Speaking Skills 2 (Kỹ năng Nghe - Nói tiếng Trung 2)</strong> nối tiếp <strong>CLS101 (HSK1-2)</strong> và nâng lên trình độ <strong>HSK3</strong>, với trọng tâm là <strong>nghe hiểu đoạn dài hơn</strong> (độc thoại 4-8 câu), <strong>hội thoại tình huống</strong> và bước đầu <strong>thuyết trình ngắn</strong>. Tám chương: <strong>kể lại trải nghiệm &amp; sự việc quá khứ</strong> → <strong>miêu tả &amp; so sánh người, vật</strong> → <strong>sức khoẻ &amp; đi khám bệnh</strong> → <strong>kế hoạch, công việc &amp; học tập</strong> → <strong>du lịch, đặt phòng &amp; hỏi thông tin</strong> → <strong>bày tỏ cảm xúc, ý kiến &amp; đề nghị</strong> → <strong>giao tiếp qua điện thoại &amp; hẹn gặp</strong> → <strong>ôn tập: nghe đoạn dài, thuyết trình ngắn &amp; hội thoại tình huống</strong>. Bám giáo trình chuẩn HSK Standard Course 3 (听说) và Short-term Spoken Chinese: Elementary (北京大学出版社), song ngữ Trung–Việt, mỗi bài có bảng từ vựng (汉字|pinyin|nghĩa), mẫu câu trọng tâm, hội thoại tình huống, một đoạn nghe dài hơn (độc thoại) và mẹo nghe hiểu, kèm quiz.',
    whatYouLearn: 'Kể lại trải nghiệm &amp; sự việc quá khứ (V+过, 有没有…过, 后来…结果); miêu tả &amp; so sánh (A比B, A跟B一样, A没有B那么, 越来越); sức khoẻ &amp; đi khám bệnh (哪儿不舒服, 症状, 开药, 按时吃药); kế hoạch, công việc &amp; học tập (打算, 先…然后…最后, 争取完成); du lịch, đặt phòng &amp; hỏi thông tin (预订房间, 多少钱一晚, 几点退房, 景点); bày tỏ cảm xúc, ý kiến &amp; đề nghị (感到满意/失望, 我觉得, 建议); giao tiếp qua điện thoại &amp; hẹn gặp (几点见面, 改约, 确认, 别忘了); và kỹ năng ôn tập: nghe đoạn dài, cấu trúc thuyết trình ngắn (首先…然后…总的来说), hội thoại tình huống tổng hợp.',
    requirements: 'Nên học xong CLS101 (Kỹ năng Nghe - Nói tiếng Trung 1, HSK1-2: chào hỏi, số đếm, câu hỏi cơ bản) hoặc có trình độ tương đương. Cài Pleco hoặc HelloChinese để nghe audio bản ngữ và luyện nói theo; nên tự thu âm để so sánh với mẫu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình HSK Standard Course 3 (听说), Short-term Spoken Chinese: Elementary, app luyện nghe/nói, chiến lược nghe hiểu HSK3.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CLS101, nâng lên HSK3: nghe đoạn dài hơn, hội thoại tình huống, thuyết trình ngắn.', lessons: [intro] },
    { title: 'Chương 1 — Kể lại trải nghiệm & sự việc quá khứ|||Chapter 1 — Retelling past experiences', description: 'V+过, 有没有…过, …的时候, 结果, 后来.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Miêu tả & so sánh người, vật|||Chapter 2 — Describing & comparing', description: 'A比B, A跟B一样, A没有B那么, 越来越.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Sức khoẻ & đi khám bệnh|||Chapter 3 — Health & the clinic', description: '哪儿不舒服, 症状, 发烧, 开药, 按时吃药.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kế hoạch, công việc & học tập|||Chapter 4 — Plans, work & study', description: '打算/计划, 先…然后…最后, 提前, 争取完成.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Du lịch, đặt phòng & hỏi thông tin|||Chapter 5 — Travel & hotel booking', description: '预订房间, 多少钱一晚, 几点退房, 景点, 门票.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Bày tỏ cảm xúc, ý kiến & đề nghị|||Chapter 6 — Feelings, opinions & suggestions', description: '感到满意/失望, 我觉得, 建议, 你觉得…怎么样.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giao tiếp qua điện thoại & hẹn gặp|||Chapter 7 — Phone calls & appointments', description: '几点见面, 你什么时候方便, 改约, 确认, 别忘了.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: nghe đoạn dài, thuyết trình ngắn & hội thoại tình huống|||Chapter 8 — Review: long passage, short talk & dialogue', description: 'Đoạn nghe dài tổng hợp, khung 首先…然后…总的来说, hội thoại tình huống kết hợp.', lessons: [c8, c8q] },
  ],
};
