/**
 * CIC302 — Intensive Chinese 4 (Tiếng Trung Tổng hợp 4). Ngành Ngôn ngữ Trung,
 * FPTU, Kỳ 2. Nối tiếp CIC301 (HSK3→4), nâng lên HSK4→5: 8 chương theo
 * "HSK Standard Course 5" (BLCU) + "Developing Chinese Advanced".
 * Dạy chữ Hán thật + pinyin có dấu thanh + nghĩa, chú thích song ngữ Việt/Anh.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('cic302-0-1-overview', 'Course overview: Intensive Chinese 4|||Tổng quan: Tiếng Trung Tổng hợp 4',
  'Mục tiêu HSK4 lên HSK5; 8 chủ đề: kinh tế & tiêu dùng, giáo dục & phát triển bản thân, nghề nghiệp, truyền thống & hiện đại, môi trường, nghệ thuật & điện ảnh, thành ngữ & tục ngữ, ôn tập HSK5.',
  [[
    `<span class="eyebrow">CIC302 · Lesson 0.1 · Overview</span>
<h2>Intensive Chinese 4 — from HSK 4 to HSK 5</h2>
<p class="lead">This course continues directly from <strong>CIC301</strong> (HSK 3-4: past/future, comparison, workplace basics). Here you push into <strong>HSK 5</strong> territory: abstract topics like <strong>economy</strong>, <strong>education</strong>, <strong>professional career</strong>, <strong>tradition vs. modernity</strong>, <strong>environment</strong>, <strong>arts &amp; film</strong>, advanced <strong>chengyu &amp; xiehouyu</strong> idioms, and finally the writing/reading skills tested on HSK 5.</p>
<h3>Eight chapters</h3>
<ul>
<li><strong>1.</strong> Economy &amp; consumption — <code>随着 (suízhe)</code>, <code>除非...否则... (chúfēi...fǒuzé...)</code>, <code>以...为... (yǐ...wéi...)</code></li>
<li><strong>2.</strong> Education &amp; self-development — <code>之所以...是因为... (zhīsuǒyǐ...shìyīnwèi...)</code>, <code>不仅...还... (bùjǐn...hái...)</code></li>
<li><strong>3.</strong> Career &amp; professional workplace — causative <code>使/让/令</code>, <code>就算...也... (jiùsuàn...yě...)</code></li>
<li><strong>4.</strong> Tradition &amp; modernity in Chinese society — <code>与其...不如... (yǔqí...bùrú...)</code>, <code>无论...都... (wúlùn...dōu...)</code></li>
<li><strong>5.</strong> Environment &amp; sustainable development — <code>一旦...就... (yídàn...jiù...)</code>, <code>只有...才... (zhǐyǒu...cái...)</code></li>
<li><strong>6.</strong> Arts, literature &amp; film — advanced <code>被</code>-passive, <code>之一 (zhīyī)</code>, <code>越...越... (yuè...yuè...)</code></li>
<li><strong>7.</strong> Chengyu, proverbs &amp; advanced expressions — <code>成语</code>, <code>歇后语</code></li>
<li><strong>8.</strong> HSK 5 review — essay writing, long-passage reading, expressing opinions</li>
</ul>
<h3>How each lesson works</h3>
<p>Every chapter gives you a real <strong>vocabulary table</strong> (Hanzi + pinyin with tone marks + meaning), two or three <strong>grammar points</strong> with worked example sentences, a short <strong>dialogue or passage</strong>, and a 3-question quiz.</p>`,
    `<span class="eyebrow">CIC302 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung Tổng hợp 4 — từ HSK4 lên HSK5</h2>
<p class="lead">Môn này nối tiếp trực tiếp <strong>CIC301</strong> (HSK3-4: quá khứ/tương lai, so sánh, nơi làm việc cơ bản). Ở đây bạn tiến vào vùng <strong>HSK5</strong>: các chủ đề trừu tượng hơn như <strong>kinh tế</strong>, <strong>giáo dục</strong>, <strong>nghề nghiệp chuyên nghiệp</strong>, <strong>truyền thống &amp; hiện đại</strong>, <strong>môi trường</strong>, <strong>nghệ thuật &amp; điện ảnh</strong>, thành ngữ <strong>成语</strong> &amp; <strong>歇后语</strong> nâng cao, và cuối cùng là kỹ năng viết/đọc cho kỳ thi HSK5.</p>
<h3>Tám chương</h3>
<ul>
<li><strong>1.</strong> Kinh tế &amp; tiêu dùng — <code>随着 (suízhe)</code>, <code>除非...否则... (chúfēi...fǒuzé...)</code>, <code>以...为... (yǐ...wéi...)</code></li>
<li><strong>2.</strong> Giáo dục &amp; phát triển bản thân — <code>之所以...是因为... (zhīsuǒyǐ...shìyīnwèi...)</code>, <code>不仅...还... (bùjǐn...hái...)</code></li>
<li><strong>3.</strong> Nghề nghiệp &amp; nơi làm việc chuyên nghiệp — khiến/để <code>使/让/令</code>, <code>就算...也... (jiùsuàn...yě...)</code></li>
<li><strong>4.</strong> Truyền thống &amp; hiện đại trong xã hội Trung Quốc — <code>与其...不如... (yǔqí...bùrú...)</code>, <code>无论...都... (wúlùn...dōu...)</code></li>
<li><strong>5.</strong> Môi trường &amp; phát triển bền vững — <code>一旦...就... (yídàn...jiù...)</code>, <code>只有...才... (zhǐyǒu...cái...)</code></li>
<li><strong>6.</strong> Nghệ thuật, văn học &amp; điện ảnh — bị động <code>被</code> nâng cao, <code>之一 (zhīyī)</code>, <code>越...越... (yuè...yuè...)</code></li>
<li><strong>7.</strong> Thành ngữ, tục ngữ &amp; biểu đạt nâng cao — <code>成语</code>, <code>歇后语</code></li>
<li><strong>8.</strong> Ôn tập HSK5 — viết luận, đọc hiểu văn bản dài, biểu đạt quan điểm</li>
</ul>
<h3>Mỗi bài học gồm gì</h3>
<p>Mỗi chương có một <strong>bảng từ vựng</strong> thật (chữ Hán + pinyin có dấu thanh + nghĩa), hai hoặc ba <strong>điểm ngữ pháp</strong> kèm câu ví dụ, một <strong>đoạn hội thoại/đoạn văn</strong> ngắn, và quiz 3 câu.</p>`,
  ]]);

const c1 = doc('cic302-1-1-economy-consumption', 'Chapter 1 - Economy and consumption|||Chương 1 - Kinh tế và tiêu dùng',
  'Từ vựng kinh tế & tiêu dùng; ngữ pháp 随着, 除非...否则..., 以...为...; đoạn hội thoại về thói quen chi tiêu.',
  [[
    `<span class="eyebrow">CIC302 · Chapter 1 · Lesson 1.1</span>
<h2>Economy &amp; consumption</h2>
<h3>Vocabulary</h3>
<pre><code>经济     jīngjì          economy
消费     xiāofèi         consumption; to spend
投资     tóuzī           investment; to invest
市场     shìchǎng        market
竞争     jìngzhēng       competition
通货膨胀  tōnghuò péngzhàng  inflation
收入     shōurù          income
支出     zhīchū          expenditure
储蓄     chǔxù           savings; to save money
网购     wǎnggòu         online shopping
</code></pre>
<h3>Grammar 1 — 随着...(的发展/提高) : "along with..."</h3>
<p>Introduces a background trend that causes a change described in the second clause.</p>
<pre><code>随着经济的发展,人们的消费观念也在不断变化。
Suízhe jīngjì de fāzhǎn, rénmen de xiāofèi guānniàn yě zài búduàn biànhuà.
Along with economic development, people's consumption mindset keeps changing too.
</code></pre>
<h3>Grammar 2 — 除非...否则... : "unless... otherwise..."</h3>
<p>States a necessary condition; if it is not met, the negative outcome in the second clause follows.</p>
<pre><code>除非价格降低,否则我不会买这件商品。
Chúfēi jiàgé jiàngdī, fǒuzé wǒ bú huì mǎi zhè jiàn shāngpǐn.
Unless the price drops, otherwise I won't buy this item.
</code></pre>
<h3>Grammar 3 — 以...为... : "take ... as ..."</h3>
<pre><code>很多年轻人以网购为主要消费方式。
Hěn duō niánqīngrén yǐ wǎnggòu wéi zhǔyào xiāofèi fāngshì.
Many young people take online shopping as their main way of consuming.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 你觉得现在的年轻人消费观念怎么样?
   Nǐ juéde xiànzài de niánqīngrén xiāofèi guānniàn zěnmeyàng?
   What do you think of young people's consumption mindset nowadays?
B: 随着网购的发展,很多人花钱越来越随意了。
   Suízhe wǎnggòu de fāzhǎn, hěn duō rén huāqián yuèláiyuè suíyì le.
   With online shopping developing, many people spend money more and more casually.
A: 除非收入提高,否则应该多储蓄一点吧?
   Chúfēi shōurù tígāo, fǒuzé yīnggāi duō chǔxù yìdiǎn ba?
   Unless income rises, shouldn't people save a bit more?
B: 你说得对,理财意识确实很重要。
   Nǐ shuō de duì, lǐcái yìshí quèshí hěn zhòngyào.
   You're right, financial literacy really matters.
</code></pre>
<div class="callout"><span class="badge">HSK5 tip</span> 随着 always pairs with a noun phrase ending in 的发展/提高/变化, and the main clause often uses 也/都 to echo the trend.</div>`,
    `<span class="eyebrow">CIC302 · Chương 1 · Bài 1.1</span>
<h2>Kinh tế &amp; tiêu dùng</h2>
<h3>Từ vựng</h3>
<pre><code>经济     jīngjì          kinh tế
消费     xiāofèi         tiêu dùng; chi tiêu
投资     tóuzī           đầu tư
市场     shìchǎng        thị trường
竞争     jìngzhēng       cạnh tranh
通货膨胀  tōnghuò péngzhàng  lạm phát
收入     shōurù          thu nhập
支出     zhīchū          chi phí, khoản chi
储蓄     chǔxù           tiết kiệm
网购     wǎnggòu         mua sắm trực tuyến
</code></pre>
<h3>Ngữ pháp 1 — 随着...(的发展/提高): "cùng với..."</h3>
<p>Nêu một xu hướng nền làm nguyên nhân cho sự thay đổi ở vế sau.</p>
<pre><code>随着经济的发展,人们的消费观念也在不断变化。
Suízhe jīngjì de fāzhǎn, rénmen de xiāofèi guānniàn yě zài búduàn biànhuà.
Cùng với sự phát triển của kinh tế, quan niệm tiêu dùng của con người cũng không ngừng thay đổi.
</code></pre>
<h3>Ngữ pháp 2 — 除非...否则...: "trừ khi... nếu không..."</h3>
<p>Nêu điều kiện cần; nếu điều kiện đó không xảy ra thì kết quả tiêu cực ở vế sau sẽ xảy ra.</p>
<pre><code>除非价格降低,否则我不会买这件商品。
Chúfēi jiàgé jiàngdī, fǒuzé wǒ bú huì mǎi zhè jiàn shāngpǐn.
Trừ khi giá giảm xuống, nếu không tôi sẽ không mua món hàng này.
</code></pre>
<h3>Ngữ pháp 3 — 以...为...: "lấy ... làm ..."</h3>
<pre><code>很多年轻人以网购为主要消费方式。
Hěn duō niánqīngrén yǐ wǎnggòu wéi zhǔyào xiāofèi fāngshì.
Nhiều bạn trẻ lấy mua sắm trực tuyến làm phương thức tiêu dùng chủ yếu.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 你觉得现在的年轻人消费观念怎么样?
   Nǐ juéde xiànzài de niánqīngrén xiāofèi guānniàn zěnmeyàng?
   Bạn thấy quan niệm tiêu dùng của người trẻ bây giờ thế nào?
B: 随着网购的发展,很多人花钱越来越随意了。
   Suízhe wǎnggòu de fāzhǎn, hěn duō rén huāqián yuèláiyuè suíyì le.
   Cùng với sự phát triển của mua sắm trực tuyến, nhiều người tiêu tiền ngày càng tuỳ tiện.
A: 除非收入提高,否则应该多储蓄一点吧?
   Chúfēi shōurù tígāo, fǒuzé yīnggāi duō chǔxù yìdiǎn ba?
   Trừ khi thu nhập tăng lên, nếu không nên tiết kiệm nhiều hơn một chút chứ?
B: 你说得对,理财意识确实很重要。
   Nǐ shuō de duì, lǐcái yìshí quèshí hěn zhòngyào.
   Bạn nói đúng, ý thức quản lý tài chính thật sự rất quan trọng.
</code></pre>
<div class="callout"><span class="badge">Mẹo HSK5</span> 随着 luôn đi cùng một cụm danh từ kết thúc bằng 的发展/提高/变化, và vế chính thường dùng 也/都 để nhấn lại xu hướng đó.</div>`,
  ]]);

const c1q = quiz('cic302-quiz-1', 'Quiz 1 - Economy & consumption|||Quiz 1 - Kinh tế & tiêu dùng', [
  { id: 'q1', question: 'Câu "除非价格降低,否则我不会买" nghĩa là gì?', options: ['Nếu giá giảm thì tôi sẽ không mua', 'Trừ khi giá giảm, nếu không tôi sẽ không mua', 'Giá đã giảm nên tôi mua', 'Tôi mua bất kể giá cả'], correctIndex: 1, explanation: '除非...否则... nêu điều kiện cần: không có điều kiện đó thì kết quả (không mua) xảy ra.' },
  { id: 'q2', question: 'Từ nào có nghĩa "lạm phát"?', options: ['投资', '通货膨胀', '储蓄', '竞争'], correctIndex: 1, explanation: '通货膨胀 (tōnghuò péngzhàng) là lạm phát; 投资 = đầu tư, 储蓄 = tiết kiệm, 竞争 = cạnh tranh.' },
  { id: 'q3', question: 'Cấu trúc 以...为... dùng để làm gì?', options: ['So sánh hơn kém', 'Lấy A làm B (A là chủ yếu)', 'Phủ định toàn bộ câu', 'Diễn tả hành động đang diễn ra'], correctIndex: 1, explanation: '以...为... = "lấy... làm...", ví dụ 以网购为主要消费方式 = lấy mua sắm online làm cách tiêu dùng chính.' },
]);

const c2 = doc('cic302-2-1-education-self-development', 'Chapter 2 - Education and self-development|||Chương 2 - Giáo dục và phát triển bản thân',
  'Từ vựng giáo dục & phát triển bản thân; ngữ pháp 之所以...是因为..., 不仅...还..., 一方面...另一方面...',
  [[
    `<span class="eyebrow">CIC302 · Chapter 2 · Lesson 2.1</span>
<h2>Education &amp; self-development</h2>
<h3>Vocabulary</h3>
<pre><code>教育     jiàoyù       education
培养     péiyǎng      to cultivate, to foster
素质     sùzhì        quality, competency
竞争力    jìngzhēnglì  competitiveness
潜力     qiánlì       potential
挑战     tiǎozhàn     challenge
压力     yālì         pressure
提升     tíshēng      to improve, to raise
终身学习  zhōngshēn xuéxí  lifelong learning
自律     zìlǜ         self-discipline
</code></pre>
<h3>Grammar 1 — 之所以...是因为... : "the reason why... is because..."</h3>
<p>Reverses cause-effect order: result/phenomenon first (之所以), reason second (是因为).</p>
<pre><code>他之所以能成功,是因为他一直坚持终身学习。
Tā zhī suǒyǐ néng chénggōng, shì yīnwèi tā yìzhí jiānchí zhōngshēn xuéxí.
The reason he could succeed is because he always kept up lifelong learning.
</code></pre>
<h3>Grammar 2 — 不仅...还/而且... : "not only... but also..."</h3>
<pre><code>良好的教育不仅能提高个人素质,还能增强竞争力。
Liánghǎo de jiàoyù bùjǐn néng tígāo gèrén sùzhì, hái néng zēngqiáng jìngzhēnglì.
Good education can not only raise personal quality, but also strengthen competitiveness.
</code></pre>
<h3>Grammar 3 — 一方面...另一方面... : "on one hand... on the other hand..."</h3>
<pre><code>一方面要努力学习,另一方面也要注意休息。
Yì fāngmiàn yào nǔlì xuéxí, lìng yì fāngmiàn yě yào zhùyì xiūxi.
On one hand you must study hard, on the other hand you must also mind rest.
</code></pre>
<h3>Passage</h3>
<pre><code>现代社会竞争激烈,一方面年轻人面临很大的压力,
另一方面也有更多提升自己的机会。之所以终身学习
变得越来越重要,是因为知识和技能更新得太快了。
Xiàndài shèhuì jìngzhēng jīliè, yì fāngmiàn niánqīngrén miànlín hěn dà
de yālì, lìng yì fāngmiàn yě yǒu gèng duō tíshēng zìjǐ de jīhuì. Zhī suǒyǐ
zhōngshēn xuéxí biàn de yuèláiyuè zhòngyào, shì yīnwèi zhīshi hé jìnéng
gēngxīn de tài kuài le.
Modern society is fiercely competitive; on one hand young people face
great pressure, on the other hand they also have more chances to
improve themselves. Lifelong learning has become more and more
important because knowledge and skills update too fast.
</code></pre>
<div class="callout"><span class="badge">HSK5 tip</span> 之所以 always sits in the FIRST clause, followed later by 是因为 (never the other order) — a common word-order trap in HSK5.</div>`,
    `<span class="eyebrow">CIC302 · Chương 2 · Bài 2.1</span>
<h2>Giáo dục &amp; phát triển bản thân</h2>
<h3>Từ vựng</h3>
<pre><code>教育     jiàoyù       giáo dục
培养     péiyǎng      bồi dưỡng, rèn luyện
素质     sùzhì        tố chất, phẩm chất
竞争力    jìngzhēnglì  năng lực cạnh tranh
潜力     qiánlì       tiềm năng
挑战     tiǎozhàn     thử thách
压力     yālì         áp lực
提升     tíshēng      nâng cao
终身学习  zhōngshēn xuéxí  học tập suốt đời
自律     zìlǜ         tự giác, kỷ luật bản thân
</code></pre>
<h3>Ngữ pháp 1 — 之所以...是因为...: "sở dĩ... là vì..."</h3>
<p>Đảo thứ tự nhân-quả thông thường: nêu kết quả/hiện tượng trước (之所以), lý do sau (是因为).</p>
<pre><code>他之所以能成功,是因为他一直坚持终身学习。
Tā zhī suǒyǐ néng chénggōng, shì yīnwèi tā yìzhí jiānchí zhōngshēn xuéxí.
Sở dĩ anh ấy thành công là vì anh ấy luôn kiên trì học tập suốt đời.
</code></pre>
<h3>Ngữ pháp 2 — 不仅...还/而且...: "không những... mà còn..."</h3>
<pre><code>良好的教育不仅能提高个人素质,还能增强竞争力。
Liánghǎo de jiàoyù bùjǐn néng tígāo gèrén sùzhì, hái néng zēngqiáng jìngzhēnglì.
Giáo dục tốt không những nâng cao tố chất cá nhân mà còn tăng cường năng lực cạnh tranh.
</code></pre>
<h3>Ngữ pháp 3 — 一方面...另一方面...: "một mặt... mặt khác..."</h3>
<pre><code>一方面要努力学习,另一方面也要注意休息。
Yì fāngmiàn yào nǔlì xuéxí, lìng yì fāngmiàn yě yào zhùyì xiūxi.
Một mặt phải cố gắng học tập, mặt khác cũng phải chú ý nghỉ ngơi.
</code></pre>
<h3>Đoạn văn</h3>
<pre><code>现代社会竞争激烈,一方面年轻人面临很大的压力,
另一方面也有更多提升自己的机会。之所以终身学习
变得越来越重要,是因为知识和技能更新得太快了。
Xiàndài shèhuì jìngzhēng jīliè, yì fāngmiàn niánqīngrén miànlín hěn dà
de yālì, lìng yì fāngmiàn yě yǒu gèng duō tíshēng zìjǐ de jīhuì. Zhī suǒyǐ
zhōngshēn xuéxí biàn de yuèláiyuè zhòngyào, shì yīnwèi zhīshi hé jìnéng
gēngxīn de tài kuài le.
Xã hội hiện đại cạnh tranh gay gắt, một mặt người trẻ đối mặt với áp
lực rất lớn, mặt khác cũng có nhiều cơ hội hơn để nâng cao bản thân.
Sở dĩ học tập suốt đời ngày càng trở nên quan trọng là vì kiến thức và
kỹ năng đổi mới quá nhanh.
</code></pre>
<div class="callout"><span class="badge">Mẹo HSK5</span> 之所以 luôn nằm ở vế ĐẦU, 是因为 theo sau ở vế sau (không đảo ngược) — một bẫy thứ tự từ hay gặp trong HSK5.</div>`,
  ]]);

const c2q = quiz('cic302-quiz-2', 'Quiz 2 - Education & self-development|||Quiz 2 - Giáo dục & phát triển bản thân', [
  { id: 'q1', question: 'Trong câu "他之所以能成功,是因为他一直坚持终身学习", vế nào nêu LÝ DO?', options: ['他之所以能成功', '是因为他一直坚持终身学习', 'Cả hai vế đều là lý do', 'Không vế nào là lý do'], correctIndex: 1, explanation: '之所以 nêu kết quả/hiện tượng, 是因为 mới nêu lý do — theo đúng thứ tự đó.' },
  { id: 'q2', question: '不仅...还... tương đương cấu trúc tiếng Việt nào?', options: ['Tuy... nhưng...', 'Không những... mà còn...', 'Nếu... thì...', 'Vì... nên...'], correctIndex: 1, explanation: '不仅 (không những) đi cùng 还/而且 (mà còn) để bổ sung ý thứ hai.' },
  { id: 'q3', question: '素质 trong bài có nghĩa gần nhất là?', options: ['Áp lực', 'Tố chất, phẩm chất', 'Thử thách', 'Tiềm năng'], correctIndex: 1, explanation: '素质 (sùzhì) = tố chất/phẩm chất cá nhân; 压力 = áp lực, 挑战 = thử thách, 潜力 = tiềm năng.' },
]);

const c3 = doc('cic302-3-1-career-workplace', 'Chapter 3 - Career and professional workplace|||Chương 3 - Nghề nghiệp và nơi làm việc chuyên nghiệp',
  'Từ vựng nghề nghiệp & nơi làm việc; ngữ pháp khiến/để 使/让/令, 就算...也..., 把 với bổ ngữ mức độ phức tạp.',
  [[
    `<span class="eyebrow">CIC302 · Chapter 3 · Lesson 3.1</span>
<h2>Career &amp; professional workplace</h2>
<h3>Vocabulary</h3>
<pre><code>职业     zhíyè         occupation, career
职场     zhíchǎng      workplace
晋升     jìnshēng      promotion
团队合作  tuánduì hézuò teamwork
沟通能力  gōutōng nénglì  communication skill
面试     miànshì       interview
简历     jiǎnlì        resume, CV
跳槽     tiàocáo       to change jobs
加班     jiābān        to work overtime
同事     tóngshì       colleague
</code></pre>
<h3>Grammar 1 — causative 使/让/令 : "to make/cause someone (feel/do)..."</h3>
<p>All three introduce a causer + causee + resulting state/action; 令 is more formal/written than 让.</p>
<pre><code>这份工作让他学到了很多沟通技巧。
Zhè fèn gōngzuò ràng tā xuédàole hěn duō gōutōng jìqiǎo.
This job made him learn a lot of communication skills.
</code></pre>
<h3>Grammar 2 — 就算...也... : "even if... still..."</h3>
<pre><code>就算加班到很晚,他也从不抱怨。
Jiùsuàn jiābān dào hěn wǎn, tā yě cóng bù bàoyuàn.
Even if he works overtime until very late, he never complains.
</code></pre>
<h3>Grammar 3 — 把 with a degree complement</h3>
<p>把 fronts the object; the verb is followed by 得 + a phrase describing HOW well/thoroughly the action was done.</p>
<pre><code>她把这次面试准备得非常充分。
Tā bǎ zhè cì miànshì zhǔnbèi de fēicháng chōngfèn.
She prepared for this interview extremely thoroughly.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 听说你要跳槽了?
   Tīngshuō nǐ yào tiàocáo le?
   I heard you're changing jobs?
B: 是啊,这份工作让我压力很大,我想找一个更适合发展的职场。
   Shì a, zhè fèn gōngzuò ràng wǒ yālì hěn dà, wǒ xiǎng zhǎo yí ge gèng
   shìhé fāzhǎn de zhíchǎng.
   Yeah, this job gives me a lot of pressure, I want to find a workplace
   better suited to growth.
A: 面试准备得怎么样了?
   Miànshì zhǔnbèi de zěnmeyàng le?
   How's your interview prep going?
B: 我把简历改得很仔细,就算竞争激烈,我也有信心。
   Wǒ bǎ jiǎnlì gǎi de hěn zǐxì, jiùsuàn jìngzhēng jīliè, wǒ yě yǒu xìnxīn.
   I revised my resume very carefully — even if competition is fierce, I'm confident.
</code></pre>
<div class="callout"><span class="badge">HSK5 tip</span> Don't confuse causative 让 (make someone do/feel) with permissive 让 (let someone do) — context (a following adjective/emotion vs. an action they wanted) tells them apart.</div>`,
    `<span class="eyebrow">CIC302 · Chương 3 · Bài 3.1</span>
<h2>Nghề nghiệp &amp; nơi làm việc chuyên nghiệp</h2>
<h3>Từ vựng</h3>
<pre><code>职业     zhíyè         nghề nghiệp
职场     zhíchǎng      nơi làm việc, môi trường công sở
晋升     jìnshēng      thăng chức
团队合作  tuánduì hézuò làm việc nhóm
沟通能力  gōutōng nénglì  kỹ năng giao tiếp
面试     miànshì       phỏng vấn
简历     jiǎnlì        sơ yếu lý lịch, CV
跳槽     tiàocáo       nhảy việc
加班     jiābān        tăng ca
同事     tóngshì       đồng nghiệp
</code></pre>
<h3>Ngữ pháp 1 — khiến/để 使/让/令: "khiến ai đó (cảm thấy/làm)..."</h3>
<p>Cả ba đều giới thiệu chủ thể gây ra + người chịu tác động + trạng thái/hành động kết quả; 令 trang trọng và văn viết hơn 让.</p>
<pre><code>这份工作让他学到了很多沟通技巧。
Zhè fèn gōngzuò ràng tā xuédàole hěn duō gōutōng jìqiǎo.
Công việc này khiến anh ấy học được nhiều kỹ năng giao tiếp.
</code></pre>
<h3>Ngữ pháp 2 — 就算...也...: "cho dù... cũng..."</h3>
<pre><code>就算加班到很晚,他也从不抱怨。
Jiùsuàn jiābān dào hěn wǎn, tā yě cóng bù bàoyuàn.
Cho dù tăng ca đến rất muộn, anh ấy cũng chưa bao giờ than phiền.
</code></pre>
<h3>Ngữ pháp 3 — 把 với bổ ngữ mức độ</h3>
<p>把 đưa tân ngữ ra trước; động từ theo sau 得 + cụm chỉ mức độ/độ kỹ của hành động.</p>
<pre><code>她把这次面试准备得非常充分。
Tā bǎ zhè cì miànshì zhǔnbèi de fēicháng chōngfèn.
Cô ấy đã chuẩn bị cho buổi phỏng vấn này rất chu đáo.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 听说你要跳槽了?
   Tīngshuō nǐ yào tiàocáo le?
   Nghe nói bạn sắp nhảy việc à?
B: 是啊,这份工作让我压力很大,我想找一个更适合发展的职场。
   Shì a, zhè fèn gōngzuò ràng wǒ yālì hěn dà, wǒ xiǎng zhǎo yí ge gèng
   shìhé fāzhǎn de zhíchǎng.
   Ừ, công việc này khiến tôi áp lực lắm, tôi muốn tìm một môi trường
   phù hợp để phát triển hơn.
A: 面试准备得怎么样了?
   Miànshì zhǔnbèi de zěnmeyàng le?
   Chuẩn bị phỏng vấn đến đâu rồi?
B: 我把简历改得很仔细,就算竞争激烈,我也有信心。
   Wǒ bǎ jiǎnlì gǎi de hěn zǐxì, jiùsuàn jìngzhēng jīliè, wǒ yě yǒu xìnxīn.
   Tôi đã sửa CV rất kỹ, cho dù cạnh tranh gay gắt, tôi cũng tự tin.
</code></pre>
<div class="callout"><span class="badge">Mẹo HSK5</span> Đừng nhầm 让 gây khiến (khiến ai làm/cảm thấy gì) với 让 cho phép (để ai làm gì) — ngữ cảnh (theo sau là tính từ/cảm xúc hay một hành động họ chủ động muốn) giúp phân biệt.</div>`,
  ]]);

const c3q = quiz('cic302-quiz-3', 'Quiz 3 - Career & workplace|||Quiz 3 - Nghề nghiệp & nơi làm việc', [
  { id: 'q1', question: '就算加班到很晚,他也从不抱怨 nghĩa là gì?', options: ['Vì tăng ca muộn nên anh ấy phàn nàn', 'Cho dù tăng ca đến muộn, anh ấy cũng không bao giờ phàn nàn', 'Anh ấy không bao giờ tăng ca', 'Anh ấy chỉ phàn nàn khi tăng ca'], correctIndex: 1, explanation: '就算...也... = "cho dù... cũng...", diễn tả điều xảy ra bất kể hoàn cảnh khó khăn.' },
  { id: 'q2', question: 'Trong "她把这次面试准备得非常充分", phần "准备得非常充分" bổ sung ý gì?', options: ['Thời gian chuẩn bị', 'Mức độ/độ kỹ của việc chuẩn bị', 'Nguyên nhân chuẩn bị', 'Địa điểm chuẩn bị'], correctIndex: 1, explanation: '把...V得... nêu bổ ngữ mức độ, mô tả hành động được làm kỹ/tốt đến đâu.' },
  { id: 'q3', question: '跳槽 có nghĩa là gì?', options: ['Thăng chức', 'Nhảy việc, đổi công ty', 'Tăng ca', 'Phỏng vấn'], correctIndex: 1, explanation: '跳槽 (tiàocáo) nghĩa đen "nhảy máng ăn", nghĩa bóng là đổi công việc/công ty.' },
]);

const c4 = doc('cic302-4-1-tradition-modernity', 'Chapter 4 - Tradition and modernity in Chinese society|||Chương 4 - Truyền thống và hiện đại trong xã hội Trung Quốc',
  'Từ vựng truyền thống & hiện đại; ngữ pháp 与其...不如..., 尽管...但是..., 无论...都...',
  [[
    `<span class="eyebrow">CIC302 · Chapter 4 · Lesson 4.1</span>
<h2>Tradition &amp; modernity in Chinese society</h2>
<h3>Vocabulary</h3>
<pre><code>传统     chuántǒng      tradition
习俗     xísú           custom
春节     Chūnjié        Spring Festival (Lunar New Year)
文化遗产  wénhuà yíchǎn  cultural heritage
现代化    xiàndàihuà     modernization
城市化    chéngshìhuà    urbanization
传承     chuánchéng     to inherit, to pass down
变迁     biànqiān       change, transformation
风俗     fēngsú         custom, folkway
观念     guānniàn       concept, mindset
</code></pre>
<h3>Grammar 1 — 与其...不如... : "rather than... it's better to..."</h3>
<pre><code>与其一味模仿西方,不如保留自己的传统文化。
Yǔqí yíwèi mófǎng xīfāng, bùrú bǎoliú zìjǐ de chuántǒng wénhuà.
Rather than blindly imitating the West, it's better to preserve one's own
traditional culture.
</code></pre>
<h3>Grammar 2 — 尽管...但是... : "although... but..."</h3>
<pre><code>尽管社会越来越现代化,但是很多传统习俗依然保留下来。
Jǐnguǎn shèhuì yuèláiyuè xiàndàihuà, dànshì hěn duō chuántǒng xísú
yīrán bǎoliú xiàlái.
Although society is becoming more and more modernized, many
traditional customs are still preserved.
</code></pre>
<h3>Grammar 3 — 无论...都... : "no matter... all/still..."</h3>
<pre><code>无论时代怎么变,春节团圆的意义都不会改变。
Wúlùn shídài zěnme biàn, Chūnjié tuányuán de yìyì dōu bú huì gǎibiàn.
No matter how the era changes, the meaning of reunion at Spring
Festival will never change.
</code></pre>
<h3>Passage</h3>
<pre><code>随着城市化的加快,很多传统的生活方式正在慢慢消失。
尽管如此,春节、中秋节这样的节日习俗依然被一代代
传承下来。无论社会观念怎么变迁,家人团聚的重要性
都没有改变。与其担心传统会消失,不如想办法让年轻
人重新爱上它们。
Suízhe chéngshìhuà de jiākuài, hěn duō chuántǒng de shēnghuó fāngshì
zhèngzài mànmàn xiāoshī. Jǐnguǎn rúcǐ, Chūnjié, Zhōngqiūjié zhèyàng de
jiérì xísú yīrán bèi yí dài dài chuánchéng xiàlái. Wúlùn shèhuì guānniàn
zěnme biànqiān, jiārén tuánjù de zhòngyàoxìng dōu méiyǒu gǎibiàn.
Yǔqí dānxīn chuántǒng huì xiāoshī, bùrú xiǎng bànfǎ ràng niánqīngrén
chóngxīn ài shàng tāmen.
As urbanization speeds up, many traditional ways of life are slowly
disappearing. Even so, festival customs like Spring Festival and
Mid-Autumn Festival are still passed down generation after
generation. No matter how social mindsets shift, the importance of
family reunion has not changed. Rather than worrying traditions will
disappear, it's better to find ways to make young people love them again.
</code></pre>
<div class="callout"><span class="badge">HSK5 tip</span> 无论 pairs with a question-word clause (怎么/什么/多么...) — the second half ALWAYS uses 都 or 也, never 就.</div>`,
    `<span class="eyebrow">CIC302 · Chương 4 · Bài 4.1</span>
<h2>Truyền thống &amp; hiện đại trong xã hội Trung Quốc</h2>
<h3>Từ vựng</h3>
<pre><code>传统     chuántǒng      truyền thống
习俗     xísú           tập tục
春节     Chūnjié        Tết Nguyên đán
文化遗产  wénhuà yíchǎn  di sản văn hoá
现代化    xiàndàihuà     hiện đại hoá
城市化    chéngshìhuà    đô thị hoá
传承     chuánchéng     kế thừa, truyền lại
变迁     biànqiān       biến đổi, thay đổi
风俗     fēngsú         phong tục
观念     guānniàn       quan niệm
</code></pre>
<h3>Ngữ pháp 1 — 与其...不如...: "thà... chi bằng..."</h3>
<pre><code>与其一味模仿西方,不如保留自己的传统文化。
Yǔqí yíwèi mófǎng xīfāng, bùrú bǎoliú zìjǐ de chuántǒng wénhuà.
Thay vì cứ mãi bắt chước phương Tây, chi bằng giữ gìn văn hoá truyền
thống của mình.
</code></pre>
<h3>Ngữ pháp 2 — 尽管...但是...: "mặc dù... nhưng..."</h3>
<pre><code>尽管社会越来越现代化,但是很多传统习俗依然保留下来。
Jǐnguǎn shèhuì yuèláiyuè xiàndàihuà, dànshì hěn duō chuántǒng xísú
yīrán bǎoliú xiàlái.
Mặc dù xã hội ngày càng hiện đại hoá, nhưng nhiều phong tục truyền
thống vẫn được giữ lại.
</code></pre>
<h3>Ngữ pháp 3 — 无论...都...: "dù... đều/vẫn..."</h3>
<pre><code>无论时代怎么变,春节团圆的意义都不会改变。
Wúlùn shídài zěnme biàn, Chūnjié tuányuán de yìyì dōu bú huì gǎibiàn.
Dù thời đại thay đổi thế nào, ý nghĩa đoàn viên của Tết Nguyên đán vẫn
không thay đổi.
</code></pre>
<h3>Đoạn văn</h3>
<pre><code>随着城市化的加快,很多传统的生活方式正在慢慢消失。
尽管如此,春节、中秋节这样的节日习俗依然被一代代
传承下来。无论社会观念怎么变迁,家人团聚的重要性
都没有改变。与其担心传统会消失,不如想办法让年轻
人重新爱上它们。
Suízhe chéngshìhuà de jiākuài, hěn duō chuántǒng de shēnghuó fāngshì
zhèngzài mànmàn xiāoshī. Jǐnguǎn rúcǐ, Chūnjié, Zhōngqiūjié zhèyàng de
jiérì xísú yīrán bèi yí dài dài chuánchéng xiàlái. Wúlùn shèhuì guānniàn
zěnme biànqiān, jiārén tuánjù de zhòngyàoxìng dōu méiyǒu gǎibiàn.
Yǔqí dānxīn chuántǒng huì xiāoshī, bùrú xiǎng bànfǎ ràng niánqīngrén
chóngxīn ài shàng tāmen.
Cùng với tốc độ đô thị hoá tăng nhanh, nhiều lối sống truyền thống
đang dần biến mất. Dù vậy, phong tục lễ hội như Tết Nguyên đán,
Trung thu vẫn được truyền từ đời này sang đời khác. Dù quan niệm xã
hội biến đổi thế nào, tầm quan trọng của việc đoàn tụ gia đình vẫn
không đổi. Thay vì lo lắng truyền thống sẽ mất đi, chi bằng tìm cách
để người trẻ yêu lại chúng.
</code></pre>
<div class="callout"><span class="badge">Mẹo HSK5</span> 无论 luôn đi cùng cụm nghi vấn (怎么/什么/多么...) — vế sau LUÔN dùng 都 hoặc 也, không bao giờ dùng 就.</div>`,
  ]]);

const c4q = quiz('cic302-quiz-4', 'Quiz 4 - Tradition & modernity|||Quiz 4 - Truyền thống & hiện đại', [
  { id: 'q1', question: '与其一味模仿西方,不如保留自己的传统文化 nghĩa là gì?', options: ['Nên bắt chước phương Tây hoàn toàn', 'Thay vì bắt chước phương Tây, chi bằng giữ văn hoá truyền thống', 'Văn hoá truyền thống không quan trọng', 'Phương Tây và truyền thống giống nhau'], correctIndex: 1, explanation: '与其...不如... so sánh hai lựa chọn và chọn cái tốt hơn (giữ truyền thống) thay vì cái trước (bắt chước).' },
  { id: 'q2', question: '无论 thường đi cùng từ nào ở vế sau?', options: ['就', '都/也', '才', '却'], correctIndex: 1, explanation: '无论...都/也... diễn tả kết quả không đổi bất kể điều kiện nào ở vế trước.' },
  { id: 'q3', question: '文化遗产 có nghĩa là gì?', options: ['Phong tục', 'Di sản văn hoá', 'Đô thị hoá', 'Quan niệm'], correctIndex: 1, explanation: '文化遗产 (wénhuà yíchǎn) = di sản văn hoá, ví dụ di tích, lễ hội được UNESCO công nhận.' },
]);

const c5 = doc('cic302-5-1-environment-sustainability', 'Chapter 5 - Environment and sustainable development|||Chương 5 - Môi trường và phát triển bền vững',
  'Từ vựng môi trường & phát triển bền vững; ngữ pháp 一旦...就..., 只有...才..., 为了...而...',
  [[
    `<span class="eyebrow">CIC302 · Chapter 5 · Lesson 5.1</span>
<h2>Environment &amp; sustainable development</h2>
<h3>Vocabulary</h3>
<pre><code>环境保护  huánjìng bǎohù  environmental protection
污染     wūrǎn           pollution
资源     zīyuán          resource
可持续发展 kěchíxù fāzhǎn  sustainable development
气候变化  qìhòu biànhuà   climate change
节能     jiénéng         energy saving
回收利用  huíshōu lìyòng  recycling
垃圾分类  lājī fēnlèi     waste sorting
温室效应  wēnshì xiàoyìng greenhouse effect
低碳     dītàn           low-carbon
</code></pre>
<h3>Grammar 1 — 一旦...就... : "once... then..."</h3>
<pre><code>一旦资源被过度开发,环境就很难恢复。
Yídàn zīyuán bèi guòdù kāifā, huánjìng jiù hěn nán huīfù.
Once resources are over-exploited, the environment becomes hard to
restore.
</code></pre>
<h3>Grammar 2 — 只有...才... : "only if... then (and only then)..."</h3>
<pre><code>只有大家共同努力,才能实现可持续发展。
Zhǐyǒu dàjiā gòngtóng nǔlì, cáinéng shíxiàn kěchíxù fāzhǎn.
Only if everyone works together can sustainable development be
achieved.
</code></pre>
<h3>Grammar 3 — 为了... : "in order to..."</h3>
<pre><code>为了减少污染,政府提倡垃圾分类和低碳出行。
Wèile jiǎnshǎo wūrǎn, zhèngfǔ tíchàng lājī fēnlèi hé dītàn chūxíng.
In order to reduce pollution, the government promotes waste sorting
and low-carbon travel.
</code></pre>
<h3>Passage</h3>
<pre><code>气候变化已经不是遥远的话题。一旦温室效应继续加剧,
极端天气就会越来越常见。只有各国政府和普通人都行
动起来,才能真正实现可持续发展。为了保护环境,我
们可以从节能、回收利用、垃圾分类这些小事做起。
Qìhòu biànhuà yǐjīng bú shì yáoyuǎn de huàtí. Yídàn wēnshì xiàoyìng
jìxù jiājù, jíduān tiānqì jiù huì yuèláiyuè chángjiàn. Zhǐyǒu gèguó
zhèngfǔ hé pǔtōng rén dōu xíngdòng qǐlái, cáinéng zhēnzhèng shíxiàn
kěchíxù fāzhǎn. Wèile bǎohù huánjìng, wǒmen kěyǐ cóng jiénéng,
huíshōu lìyòng, lājī fēnlèi zhèxiē xiǎoshì zuò qǐ.
Climate change is no longer a distant topic. Once the greenhouse
effect keeps intensifying, extreme weather will become more and more
common. Only if governments of every country and ordinary people
alike take action can sustainable development truly be achieved. To
protect the environment, we can start from small things like saving
energy, recycling, and sorting waste.
</code></pre>
<div class="callout"><span class="badge">HSK5 tip</span> 只有...才... requires 才 (not 就) in the result clause — 才 marks a strict, exclusive condition, unlike 一旦...就... which marks a trigger.</div>`,
    `<span class="eyebrow">CIC302 · Chương 5 · Bài 5.1</span>
<h2>Môi trường &amp; phát triển bền vững</h2>
<h3>Từ vựng</h3>
<pre><code>环境保护  huánjìng bǎohù  bảo vệ môi trường
污染     wūrǎn           ô nhiễm
资源     zīyuán          tài nguyên
可持续发展 kěchíxù fāzhǎn  phát triển bền vững
气候变化  qìhòu biànhuà   biến đổi khí hậu
节能     jiénéng         tiết kiệm năng lượng
回收利用  huíshōu lìyòng  tái chế
垃圾分类  lājī fēnlèi     phân loại rác
温室效应  wēnshì xiàoyìng hiệu ứng nhà kính
低碳     dītàn           phát thải carbon thấp
</code></pre>
<h3>Ngữ pháp 1 — 一旦...就...: "một khi... thì..."</h3>
<pre><code>一旦资源被过度开发,环境就很难恢复。
Yídàn zīyuán bèi guòdù kāifā, huánjìng jiù hěn nán huīfù.
Một khi tài nguyên bị khai thác quá mức, môi trường sẽ rất khó phục hồi.
</code></pre>
<h3>Ngữ pháp 2 — 只有...才...: "chỉ khi... mới..."</h3>
<pre><code>只有大家共同努力,才能实现可持续发展。
Zhǐyǒu dàjiā gòngtóng nǔlì, cáinéng shíxiàn kěchíxù fāzhǎn.
Chỉ khi mọi người cùng nỗ lực, mới có thể thực hiện được phát triển bền
vững.
</code></pre>
<h3>Ngữ pháp 3 — 为了...: "để..."</h3>
<pre><code>为了减少污染,政府提倡垃圾分类和低碳出行。
Wèile jiǎnshǎo wūrǎn, zhèngfǔ tíchàng lājī fēnlèi hé dītàn chūxíng.
Để giảm ô nhiễm, chính phủ khuyến khích phân loại rác và đi lại phát
thải carbon thấp.
</code></pre>
<h3>Đoạn văn</h3>
<pre><code>气候变化已经不是遥远的话题。一旦温室效应继续加剧,
极端天气就会越来越常见。只有各国政府和普通人都行
动起来,才能真正实现可持续发展。为了保护环境,我
们可以从节能、回收利用、垃圾分类这些小事做起。
Qìhòu biànhuà yǐjīng bú shì yáoyuǎn de huàtí. Yídàn wēnshì xiàoyìng
jìxù jiājù, jíduān tiānqì jiù huì yuèláiyuè chángjiàn. Zhǐyǒu gèguó
zhèngfǔ hé pǔtōng rén dōu xíngdòng qǐlái, cáinéng zhēnzhèng shíxiàn
kěchíxù fāzhǎn. Wèile bǎohù huánjìng, wǒmen kěyǐ cóng jiénéng,
huíshōu lìyòng, lājī fēnlèi zhèxiē xiǎoshì zuò qǐ.
Biến đổi khí hậu không còn là chủ đề xa vời nữa. Một khi hiệu ứng nhà
kính tiếp tục gia tăng, thời tiết cực đoan sẽ ngày càng phổ biến. Chỉ khi
chính phủ các nước và người dân bình thường đều hành động, mới có
thể thực sự đạt được phát triển bền vững. Để bảo vệ môi trường,
chúng ta có thể bắt đầu từ những việc nhỏ như tiết kiệm năng lượng,
tái chế, phân loại rác.
</code></pre>
<div class="callout"><span class="badge">Mẹo HSK5</span> 只有...才... bắt buộc dùng 才 (không phải 就) ở vế kết quả — 才 đánh dấu điều kiện chặt/duy nhất, khác với 一旦...就... vốn chỉ đánh dấu một điểm kích hoạt.</div>`,
  ]]);

const c5q = quiz('cic302-quiz-5', 'Quiz 5 - Environment & sustainability|||Quiz 5 - Môi trường & phát triển bền vững', [
  { id: 'q1', question: '只有大家共同努力,才能实现可持续发展 — chữ nào KHÔNG thể thay 才 mà vẫn đúng ngữ pháp HSK5 chuẩn?', options: ['才', '就', '才能', '方能'], correctIndex: 1, explanation: '只有...才... là cặp cố định; dùng 就 thay 才 là sai cấu trúc điều kiện duy nhất.' },
  { id: 'q2', question: '温室效应 nghĩa là gì?', options: ['Phân loại rác', 'Hiệu ứng nhà kính', 'Tái chế', 'Tiết kiệm năng lượng'], correctIndex: 1, explanation: '温室效应 (wēnshì xiàoyìng) = hiệu ứng nhà kính, nguyên nhân chính gây biến đổi khí hậu.' },
  { id: 'q3', question: '一旦资源被过度开发,环境就很难恢复 nghĩa là gì?', options: ['Tài nguyên không bao giờ cạn', 'Một khi tài nguyên bị khai thác quá mức, môi trường khó phục hồi', 'Môi trường luôn tự phục hồi', 'Khai thác tài nguyên không ảnh hưởng môi trường'], correctIndex: 1, explanation: '一旦...就... nêu một sự kiện kích hoạt (khai thác quá mức) dẫn tới hệ quả (khó phục hồi).' },
]);

const c6 = doc('cic302-6-1-arts-literature-film', 'Chapter 6 - Arts, literature and film|||Chương 6 - Nghệ thuật, văn học và điện ảnh',
  'Từ vựng nghệ thuật & điện ảnh; ngữ pháp bị động 被 nâng cao, 之一, 越...越...',
  [[
    `<span class="eyebrow">CIC302 · Chapter 6 · Lesson 6.1</span>
<h2>Arts, literature &amp; film</h2>
<h3>Vocabulary</h3>
<pre><code>艺术     yìshù        art
文学     wénxué       literature
电影     diànyǐng     film, movie
导演     dǎoyǎn       director
演员     yǎnyuán      actor, actress
情节     qíngjié      plot
表演     biǎoyǎn      performance; to perform
欣赏     xīnshǎng     to appreciate
创作     chuàngzuò    to create (a work of art)
风格     fēnggé       style
</code></pre>
<h3>Grammar 1 — advanced 被-passive (with agent + complex complement)</h3>
<pre><code>这部电影被观众评为今年最感人的作品之一。
Zhè bù diànyǐng bèi guānzhòng píngwéi jīnnián zuì gǎnrén de zuòpǐn zhī yī.
This film was rated by audiences as one of this year's most moving works.
</code></pre>
<h3>Grammar 2 — 之一 : "one of..."</h3>
<pre><code>他是当代最有名的导演之一。
Tā shì dāngdài zuì yǒumíng de dǎoyǎn zhī yī.
He is one of the most famous directors of his time.
</code></pre>
<h3>Grammar 3 — 越...越... : "the more... the more..."</h3>
<pre><code>这部小说的情节越看越吸引人。
Zhè bù xiǎoshuō de qíngjié yuè kàn yuè xīyǐn rén.
The plot of this novel is more and more gripping the more you read.
</code></pre>
<h3>Passage</h3>
<pre><code>好的艺术作品往往越欣赏越有味道。这位导演的电影之
所以受欢迎,是因为他的风格独一无二 —— 他被公认为
最会讲故事的导演之一。他的每一部作品都由演员用心
表演,情节也常常出人意料。
Hǎo de yìshù zuòpǐn wǎngwǎng yuè xīnshǎng yuè yǒu wèidào. Zhè wèi
dǎoyǎn de diànyǐng zhī suǒyǐ shòu huānyíng, shì yīnwèi tā de fēnggé
dúyīwú'èr —— tā bèi gōngrèn wéi zuì huì jiǎng gùshi de dǎoyǎn zhī yī.
Tā de měi yí bù zuòpǐn dōu yóu yǎnyuán yòngxīn biǎoyǎn, qíngjié yě
chángcháng chūrén yìliào.
Good works of art often taste better the more you appreciate them.
This director's films are popular because his style is one of a kind — he
is widely recognized as one of the directors best at storytelling. Every
one of his works is performed wholeheartedly by the actors, and the
plots are often full of surprises.
</code></pre>
<div class="callout"><span class="badge">HSK5 tip</span> 被 + agent + verb + resultative phrase (被...评为/称为/看作 + noun) is the exam-favorite passive pattern for describing reputation or reviews.</div>`,
    `<span class="eyebrow">CIC302 · Chương 6 · Bài 6.1</span>
<h2>Nghệ thuật, văn học &amp; điện ảnh</h2>
<h3>Từ vựng</h3>
<pre><code>艺术     yìshù        nghệ thuật
文学     wénxué       văn học
电影     diànyǐng     điện ảnh, phim
导演     dǎoyǎn       đạo diễn
演员     yǎnyuán      diễn viên
情节     qíngjié      tình tiết, cốt truyện
表演     biǎoyǎn      biểu diễn; diễn xuất
欣赏     xīnshǎng     thưởng thức
创作     chuàngzuò    sáng tác
风格     fēnggé       phong cách
</code></pre>
<h3>Ngữ pháp 1 — bị động 被 nâng cao (kèm chủ thể + bổ ngữ phức tạp)</h3>
<pre><code>这部电影被观众评为今年最感人的作品之一。
Zhè bù diànyǐng bèi guānzhòng píngwéi jīnnián zuì gǎnrén de zuòpǐn zhī yī.
Bộ phim này được khán giả đánh giá là một trong những tác phẩm cảm
động nhất năm nay.
</code></pre>
<h3>Ngữ pháp 2 — 之一: "một trong những..."</h3>
<pre><code>他是当代最有名的导演之一。
Tā shì dāngdài zuì yǒumíng de dǎoyǎn zhī yī.
Anh ấy là một trong những đạo diễn nổi tiếng nhất đương đại.
</code></pre>
<h3>Ngữ pháp 3 — 越...越...: "càng... càng..."</h3>
<pre><code>这部小说的情节越看越吸引人。
Zhè bù xiǎoshuō de qíngjié yuè kàn yuè xīyǐn rén.
Tình tiết cuốn tiểu thuyết này càng đọc càng lôi cuốn.
</code></pre>
<h3>Đoạn văn</h3>
<pre><code>好的艺术作品往往越欣赏越有味道。这位导演的电影之
所以受欢迎,是因为他的风格独一无二 —— 他被公认为
最会讲故事的导演之一。他的每一部作品都由演员用心
表演,情节也常常出人意料。
Hǎo de yìshù zuòpǐn wǎngwǎng yuè xīnshǎng yuè yǒu wèidào. Zhè wèi
dǎoyǎn de diànyǐng zhī suǒyǐ shòu huānyíng, shì yīnwèi tā de fēnggé
dúyīwú'èr —— tā bèi gōngrèn wéi zuì huì jiǎng gùshi de dǎoyǎn zhī yī.
Tā de měi yí bù zuòpǐn dōu yóu yǎnyuán yòngxīn biǎoyǎn, qíngjié yě
chángcháng chūrén yìliào.
Tác phẩm nghệ thuật hay thường càng thưởng thức càng thấy thú vị.
Phim của vị đạo diễn này sở dĩ được yêu thích là vì phong cách của
ông độc nhất vô nhị — ông được công nhận là một trong những đạo
diễn kể chuyện giỏi nhất. Mỗi tác phẩm của ông đều được diễn viên
diễn xuất hết mình, tình tiết cũng thường gây bất ngờ.
</code></pre>
<div class="callout"><span class="badge">Mẹo HSK5</span> Mẫu 被 + chủ thể + động từ + bổ ngữ kết quả (被...评为/称为/看作 + danh từ) là dạng bị động hay gặp nhất trong đề thi khi mô tả danh tiếng/đánh giá.</div>`,
  ]]);

const c6q = quiz('cic302-quiz-6', 'Quiz 6 - Arts, literature & film|||Quiz 6 - Nghệ thuật, văn học & điện ảnh', [
  { id: 'q1', question: '这部电影被观众评为今年最感人的作品之一 nghĩa là gì?', options: ['Bộ phim này bị khán giả chê', 'Bộ phim này được khán giả đánh giá là một trong những tác phẩm cảm động nhất năm nay', 'Bộ phim này không được đánh giá', 'Đạo diễn tự đánh giá phim của mình'], correctIndex: 1, explanation: '被...评为... là cấu trúc bị động: chủ thể (观众) đánh giá đối tượng (电影) thành một kết quả (最感人的作品之一).' },
  { id: 'q2', question: '越...越... diễn tả điều gì?', options: ['Mức độ giảm dần', 'Hai yếu tố tăng cùng nhau ("càng... càng...")', 'Sự tương phản', 'Sự lựa chọn'], correctIndex: 1, explanation: '越A越B nghĩa là mức độ A tăng thì B cũng tăng theo, ví dụ 越看越吸引人.' },
  { id: 'q3', question: '之一 trong "最有名的导演之一" có nghĩa gì?', options: ['Duy nhất', 'Một trong những...', 'Không phải là', 'Đầu tiên'], correctIndex: 1, explanation: '之一 = "một trong những", cho biết đối tượng thuộc một nhóm nổi bật chứ không phải là cái duy nhất.' },
]);

const c7 = doc('cic302-7-1-chengyu-xiehouyu', 'Chapter 7 - Chengyu, proverbs and advanced expressions|||Chương 7 - Thành ngữ, tục ngữ và biểu đạt nâng cao',
  'Thành ngữ 成语 thường gặp trong HSK5, tục ngữ và câu nói lấp lửng 歇后语, cách dùng trong câu.',
  [[
    `<span class="eyebrow">CIC302 · Chapter 7 · Lesson 7.1</span>
<h2>Chengyu (成语), proverbs &amp; xiehouyu (歇后语)</h2>
<h3>Six essential chengyu</h3>
<pre><code>画蛇添足  huàshé tiānzú     "draw a snake and add feet" -> ruin something
                            by adding unnecessary extras
守株待兔  shǒuzhū dàitù     "guard a tree stump waiting for a rabbit" ->
                            relying on luck instead of effort
半途而废  bàntú érfèi       to give up halfway
入乡随俗  rùxiāng suísú     "entering a village, follow its customs" ->
                            when in Rome, do as the Romans do
众所周知  zhòngsuǒ zhōuzhī  as everyone knows, it is well known that...
画龙点睛  huàlóng diǎnjīng  "paint the dragon, dot the eyes" -> the
                            finishing touch that brings a work to life
</code></pre>
<h3>Using chengyu in a sentence</h3>
<p>Most chengyu act like a verb phrase or adjective inside a normal sentence — no extra grammar needed, just slot them in.</p>
<pre><code>众所周知,学好一门外语需要长期坚持。
Zhòngsuǒ zhōuzhī, xuéhǎo yì mén wàiyǔ xūyào chángqī jiānchí.
As everyone knows, mastering a foreign language takes long-term
persistence.

做事不能半途而废,不然以前的努力就白费了。
Zuòshì bùnéng bàntú érfèi, bùrán yǐqián de nǔlì jiù báifèi le.
You can't give up halfway, otherwise your previous effort is wasted.
</code></pre>
<h3>What is a xiehouyu (歇后语)?</h3>
<p>A two-part folk saying: a vivid image/situation, then a dash, then the punchline — often a pun. In speech people sometimes say only the first half and let the listener guess the rest.</p>
<pre><code>泥菩萨过江 —— 自身难保
Ní púsà guò jiāng —— zìshēn nánbǎo
"A clay Buddha statue crossing a river — can't even save itself" ->
someone in trouble themselves can't help others.

外甥打灯笼 —— 照旧(舅)
Wàishēng dǎ dēnglóng —— zhàojiù (jiù)
"A nephew carrying a lantern — lighting up his uncle (照舅, pun on
照旧 'as before')" -> nothing has changed, same as usual.
</code></pre>
<div class="callout"><span class="badge">HSK5 tip</span> HSK5 reading/listening often tests chengyu meaning in context rather than literal translation — learn the FIGURATIVE meaning, not just the individual characters.</div>`,
    `<span class="eyebrow">CIC302 · Chương 7 · Bài 7.1</span>
<h2>Thành ngữ (成语), tục ngữ &amp; xiehouyu (歇后语)</h2>
<h3>Sáu thành ngữ trọng tâm</h3>
<pre><code>画蛇添足  huàshé tiānzú     "vẽ rắn thêm chân" -> làm hỏng việc vì
                            thêm thắt thừa thãi không cần thiết
守株待兔  shǒuzhū dàitù     "ôm gốc cây đợi thỏ" -> ỷ lại vào may rủi
                            thay vì nỗ lực
半途而废  bàntú érfèi       bỏ dở giữa chừng
入乡随俗  rùxiāng suísú     "vào làng theo tục làng" -> nhập gia tuỳ tục
众所周知  zhòngsuǒ zhōuzhī  ai cũng biết, như mọi người đã biết
画龙点睛  huàlóng diǎnjīng  "vẽ rồng điểm mắt" -> điểm nhấn thần kỳ
                            làm tác phẩm sống động hẳn lên
</code></pre>
<h3>Cách dùng thành ngữ trong câu</h3>
<p>Đa số thành ngữ hoạt động như một cụm động từ/tính từ trong câu bình thường — không cần ngữ pháp đặc biệt, chỉ cần chèn đúng chỗ.</p>
<pre><code>众所周知,学好一门外语需要长期坚持。
Zhòngsuǒ zhōuzhī, xuéhǎo yì mén wàiyǔ xūyào chángqī jiānchí.
Ai cũng biết, học giỏi một ngoại ngữ cần kiên trì lâu dài.

做事不能半途而废,不然以前的努力就白费了。
Zuòshì bùnéng bàntú érfèi, bùrán yǐqián de nǔlì jiù báifèi le.
Làm việc không thể bỏ dở giữa chừng, nếu không công sức trước đó sẽ
uổng phí.
</code></pre>
<h3>Xiehouyu (歇后语) là gì?</h3>
<p>Một câu nói dân gian hai vế: hình ảnh/tình huống sinh động, sau đó gạch ngang, rồi đến vế "chốt" — thường chơi chữ đồng âm. Trong lời nói, người ta đôi khi chỉ nói vế đầu và để người nghe tự đoán vế sau.</p>
<pre><code>泥菩萨过江 —— 自身难保
Ní púsà guò jiāng —— zìshēn nánbǎo
"Tượng Bồ Tát bằng đất qua sông — tự thân khó giữ nổi mình" -> người
đang gặp khó khăn thì không thể giúp được ai khác.

外甥打灯笼 —— 照旧(舅)
Wàishēng dǎ dēnglóng —— zhàojiù (jiù)
"Cháu ngoại cầm đèn lồng — soi cho cậu (照舅, chơi chữ đồng âm với
照旧 'như cũ')" -> mọi thứ vẫn như cũ, không có gì thay đổi.
</code></pre>
<div class="callout"><span class="badge">Mẹo HSK5</span> Đề đọc/nghe HSK5 thường kiểm tra NGHĨA BÓNG của thành ngữ theo ngữ cảnh chứ không phải dịch từng chữ — hãy học nghĩa bóng, đừng chỉ học từng ký tự riêng lẻ.</div>`,
  ]]);

const c7q = quiz('cic302-quiz-7', 'Quiz 7 - Chengyu & xiehouyu|||Quiz 7 - Thành ngữ & tục ngữ', [
  { id: 'q1', question: '画蛇添足 nghĩa bóng là gì?', options: ['Làm việc hiệu quả', 'Làm hỏng việc vì thêm thắt thừa thãi', 'Kiên trì đến cùng', 'Nhập gia tuỳ tục'], correctIndex: 1, explanation: '画蛇添足 (vẽ rắn thêm chân) chỉ hành động thừa thãi, phản tác dụng, làm hỏng việc vốn đã hoàn chỉnh.' },
  { id: 'q2', question: '泥菩萨过江——自身难保 mang ý nghĩa gì?', options: ['Người rất giỏi giúp đỡ người khác', 'Người đang gặp khó khăn thì khó giúp được ai khác', 'Đi qua sông rất nguy hiểm', 'Tượng Phật rất linh thiêng'], correctIndex: 1, explanation: 'Đây là một câu 歇后语: hình ảnh tượng đất qua sông tự thân khó giữ, ví với người tự lo cho mình còn khó, nói gì giúp người khác.' },
  { id: 'q3', question: '入乡随俗 gần nghĩa nhất với thành ngữ Việt nào?', options: ['Nhập gia tuỳ tục', 'Ăn cây nào rào cây nấy', 'Có công mài sắt', 'Một cây làm chẳng nên non'], correctIndex: 0, explanation: '入乡随俗 nghĩa đen "vào làng theo tục làng", tương đương "nhập gia tuỳ tục" trong tiếng Việt.' },
]);

const c8 = doc('cic302-8-1-hsk5-review', 'Chapter 8 - HSK5 review: essay writing, long reading, expressing opinions|||Chương 8 - Ôn tập HSK5: viết luận, đọc hiểu văn bản dài, biểu đạt quan điểm',
  'Cấu trúc bài viết HSK5 (归纳缩写 + 看图作文), cụm từ biểu đạt quan điểm, chiến thuật đọc hiểu văn bản dài.',
  [[
    `<span class="eyebrow">CIC302 · Chapter 8 · Lesson 8.1</span>
<h2>HSK5 review — writing, long reading, opinions</h2>
<h3>HSK5 writing tasks</h3>
<ul>
<li><strong>Task 1 — 缩写 (summary):</strong> read a ~1000-character story for 10 minutes (no notes allowed), then rewrite it from memory in about 400 characters, keeping the plot and title.</li>
<li><strong>Task 2 — 看图作文:</strong> given one picture and 5 required words, write a short story or short essay (about 80 characters) using all 5 words naturally.</li>
</ul>
<h3>Useful phrases for expressing an opinion</h3>
<pre><code>我认为 / 我觉得   wǒ rènwéi / wǒ juéde   I think / I feel that...
依我看          yī wǒ kàn              in my view
换句话说        huàn jù huà shuō       in other words
总而言之        zǒng ér yán zhī        in summary, all in all
综上所述        zōng shàng suǒ shù     to sum up the above
首先...其次...最后... shǒuxiān...qícì...zuìhòu...  firstly...secondly...lastly...
</code></pre>
<h3>A model opinion paragraph</h3>
<pre><code>依我看,网络给我们带来了很多方便,但也带来了不少
问题。首先,信息传播得太快,有时候很难分辨真假。
其次,很多人越来越依赖手机,面对面的交流反而变少
了。综上所述,我认为我们应该学会合理使用网络,而
不是被网络控制。
Yī wǒ kàn, wǎngluò gěi wǒmen dàilái le hěn duō fāngbiàn, dàn yě
dàilái le bùshǎo wèntí. Shǒuxiān, xìnxī chuánbò de tài kuài, yǒushíhou
hěn nán fēnbiàn zhēnjiǎ. Qícì, hěn duō rén yuèláiyuè yīlài shǒujī,
miànduìmiàn de jiāoliú fǎn'ér biàn shǎo le. Zōng shàng suǒ shù, wǒ
rènwéi wǒmen yīnggāi xuéhuì hélǐ shǐyòng wǎngluò, ér bú shì bèi
wǎngluò kòngzhì.
In my view, the internet has brought us a lot of convenience, but also
quite a few problems. First, information spreads too fast, and it's
sometimes hard to tell true from false. Second, many people rely more
and more on their phones, and face-to-face communication has
actually decreased. To sum up, I think we should learn to use the
internet reasonably, rather than being controlled by it.
</code></pre>
<h3>Reading strategy for long passages</h3>
<ul>
<li>Read the <strong>first and last sentence</strong> of each paragraph first — HSK5 topic sentences usually sit there.</li>
<li>Read the <strong>questions before</strong> the passage, then scan for keywords instead of reading word-by-word.</li>
<li>Watch for signal words (但是/然而 = contrast, 因此/所以 = conclusion) — the answer is often right after them.</li>
</ul>
<div class="callout"><span class="badge">Exam-day tip</span> In 看图作文, weave all 5 required words in naturally — examiners check that each word is used correctly, not just present.</div>`,
    `<span class="eyebrow">CIC302 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập HSK5 — viết luận, đọc hiểu, biểu đạt quan điểm</h2>
<h3>Hai dạng bài viết HSK5</h3>
<ul>
<li><strong>Phần 1 — 缩写 (tóm tắt):</strong> đọc một câu chuyện khoảng 1000 chữ trong 10 phút (không được ghi chép), sau đó viết lại theo trí nhớ khoảng 400 chữ, giữ đúng cốt truyện và tiêu đề.</li>
<li><strong>Phần 2 — 看图作文:</strong> cho một bức tranh và 5 từ bắt buộc, viết một đoạn văn/câu chuyện ngắn (khoảng 80 chữ) dùng tự nhiên cả 5 từ đó.</li>
</ul>
<h3>Cụm từ hữu ích để biểu đạt quan điểm</h3>
<pre><code>我认为 / 我觉得   wǒ rènwéi / wǒ juéde   tôi cho rằng / tôi thấy rằng...
依我看          yī wǒ kàn              theo tôi thấy
换句话说        huàn jù huà shuō       nói cách khác
总而言之        zǒng ér yán zhī        nói tóm lại
综上所述        zōng shàng suǒ shù     tổng hợp những điều trên
首先...其次...最后... shǒuxiān...qícì...zuìhòu...  trước hết...tiếp theo...cuối cùng...
</code></pre>
<h3>Đoạn văn nêu quan điểm mẫu</h3>
<pre><code>依我看,网络给我们带来了很多方便,但也带来了不少
问题。首先,信息传播得太快,有时候很难分辨真假。
其次,很多人越来越依赖手机,面对面的交流反而变少
了。综上所述,我认为我们应该学会合理使用网络,而
不是被网络控制。
Yī wǒ kàn, wǎngluò gěi wǒmen dàilái le hěn duō fāngbiàn, dàn yě
dàilái le bùshǎo wèntí. Shǒuxiān, xìnxī chuánbò de tài kuài, yǒushíhou
hěn nán fēnbiàn zhēnjiǎ. Qícì, hěn duō rén yuèláiyuè yīlài shǒujī,
miànduìmiàn de jiāoliú fǎn'ér biàn shǎo le. Zōng shàng suǒ shù, wǒ
rènwéi wǒmen yīnggāi xuéhuì hélǐ shǐyòng wǎngluò, ér bú shì bèi
wǎngluò kòngzhì.
Theo tôi thấy, mạng internet mang lại cho chúng ta rất nhiều tiện lợi,
nhưng cũng kéo theo không ít vấn đề. Trước hết, thông tin lan truyền
quá nhanh, đôi khi rất khó phân biệt thật giả. Tiếp theo, nhiều người
ngày càng phụ thuộc vào điện thoại, giao tiếp trực tiếp ngược lại giảm
đi. Tóm lại, tôi cho rằng chúng ta nên học cách sử dụng mạng một
cách hợp lý, chứ không phải bị mạng điều khiển.
</code></pre>
<h3>Chiến thuật đọc hiểu văn bản dài</h3>
<ul>
<li>Đọc <strong>câu đầu và câu cuối</strong> mỗi đoạn trước — câu chủ đề của HSK5 thường nằm ở đó.</li>
<li>Đọc <strong>câu hỏi trước</strong> khi đọc đoạn văn, rồi quét tìm từ khoá thay vì đọc từng chữ.</li>
<li>Chú ý các từ hiệu lệnh (但是/然而 = chuyển ý tương phản, 因此/所以 = kết luận) — đáp án thường nằm ngay sau chúng.</li>
</ul>
<div class="callout"><span class="badge">Mẹo phòng thi</span> Ở phần 看图作文, hãy lồng ghép tự nhiên cả 5 từ bắt buộc — giám khảo chấm việc dùng ĐÚNG từng từ, không chỉ việc từ đó có xuất hiện hay không.</div>`,
  ]]);

const c8q = quiz('cic302-quiz-8', 'Quiz 8 - HSK5 review|||Quiz 8 - Ôn tập HSK5', [
  { id: 'q1', question: 'Phần viết 缩写 của HSK5 yêu cầu thí sinh làm gì?', options: ['Dịch một đoạn văn tiếng Anh', 'Đọc một câu chuyện rồi viết lại theo trí nhớ khoảng 400 chữ', 'Vẽ tranh minh hoạ cho câu chuyện', 'Chép lại nguyên văn đoạn đọc'], correctIndex: 1, explanation: '缩写 yêu cầu đọc truyện trong 10 phút (không ghi chép) rồi viết lại từ trí nhớ, giữ đúng cốt truyện và tiêu đề, khoảng 400 chữ.' },
  { id: 'q2', question: 'Cụm nào dùng để MỞ ĐẦU khi nêu quan điểm cá nhân?', options: ['综上所述', '依我看 / 我认为', '换句话说', '首先...其次...'], correctIndex: 1, explanation: '依我看 và 我认为 dùng để mở đầu, nêu quan điểm cá nhân; 综上所述 dùng để kết luận.' },
  { id: 'q3', question: 'Khi đọc hiểu văn bản dài HSK5, nên ưu tiên đọc phần nào của mỗi đoạn để tìm câu chủ đề?', options: ['Câu giữa đoạn', 'Câu đầu và câu cuối đoạn', 'Chỉ đọc tiêu đề bài', 'Chỉ đọc câu có số liệu'], correctIndex: 1, explanation: 'Câu chủ đề của đoạn văn HSK5 thường nằm ở câu đầu hoặc câu cuối đoạn, đọc hai vị trí này giúp nắm ý chính nhanh hơn.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CIC302',
    slug: 'cic302-intensive-chinese-4',
    title: 'Intensive Chinese 4',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIC302.webp',
    shortDescription: 'Intensive Chinese 4 (HSK4 to 5): economy, education, career, tradition vs modernity, environment, arts & film, chengyu/xiehouyu, HSK5 review (essay, long reading, opinions). Real Hanzi, toned pinyin, quizzes.|||Tiếng Trung Tổng hợp 4 (HSK4 lên 5): kinh tế, giáo dục, nghề nghiệp, truyền thống & hiện đại, môi trường, nghệ thuật & điện ảnh, thành ngữ nâng cao, ôn HSK5 (viết luận, đọc hiểu, quan điểm). Chữ Hán thật, pinyin có dấu, quiz.',
    description: 'Môn <strong>CIC302 — Intensive Chinese 4</strong> (kỳ 2, ngành Ngôn ngữ Trung) nối tiếp CIC301, nâng trình độ từ <strong>HSK4 lên HSK5</strong>. 8 chương bám <strong>HSK Standard Course 5</strong> (BLCU) và <strong>Developing Chinese Advanced</strong>: kinh tế &amp; tiêu dùng (随着, 除非...否则...) → giáo dục &amp; phát triển bản thân (之所以...是因为..., 不仅...还...) → nghề nghiệp &amp; nơi làm việc chuyên nghiệp (使/让/令, 就算...也...) → truyền thống &amp; hiện đại trong xã hội Trung Quốc (与其...不如..., 无论...都...) → môi trường &amp; phát triển bền vững (一旦...就..., 只有...才...) → nghệ thuật, văn học &amp; điện ảnh (被 nâng cao, 之一, 越...越...) → thành ngữ, tục ngữ &amp; biểu đạt nâng cao (成语, 歇后语) → ôn tập HSK5 (viết luận, đọc hiểu văn bản dài, biểu đạt quan điểm). Mỗi chương có bảng từ vựng chữ Hán + pinyin có dấu thanh, điểm ngữ pháp, đoạn hội thoại/đoạn văn và quiz.',
    whatYouLearn: '随着, 除非...否则..., 以...为... khi bàn kinh tế & tiêu dùng; 之所以...是因为..., 不仅...还..., 一方面...另一方面... khi nói giáo dục & bản thân; 使/让/令, 就算...也..., 把 với bổ ngữ mức độ khi nói nghề nghiệp; 与其...不如..., 尽管...但是..., 无论...都... khi bàn truyền thống & hiện đại; 一旦...就..., 只有...才..., 为了... khi nói môi trường; 被 nâng cao, 之一, 越...越... khi bàn nghệ thuật & điện ảnh; sáu thành ngữ + hai câu 歇后语 trọng tâm; cấu trúc bài viết HSK5 (缩写, 看图作文) và cụm từ biểu đạt quan điểm.',
    requirements: 'Đã hoàn thành CIC301 (hoặc tương đương HSK3-4): đọc được pinyin có dấu thanh, khoảng 600-900 chữ Hán, dùng được câu ghép cơ bản (因为/所以, 虽然/但是).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ HSK4 lên HSK5, 8 chủ đề của môn.', lessons: [intro] },
    { title: 'Chương 1 — Kinh tế & tiêu dùng|||Chapter 1 — Economy & consumption', description: '随着, 除非...否则..., 以...为...', lessons: [c1, c1q] },
    { title: 'Chương 2 — Giáo dục & phát triển bản thân|||Chapter 2 — Education & self-development', description: '之所以...是因为..., 不仅...还...', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nghề nghiệp & nơi làm việc|||Chapter 3 — Career & workplace', description: '使/让/令, 就算...也..., 把 bổ ngữ mức độ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Truyền thống & hiện đại|||Chapter 4 — Tradition & modernity', description: '与其...不如..., 尽管...但是..., 无论...都...', lessons: [c4, c4q] },
    { title: 'Chương 5 — Môi trường & phát triển bền vững|||Chapter 5 — Environment & sustainability', description: '一旦...就..., 只有...才..., 为了...', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nghệ thuật, văn học & điện ảnh|||Chapter 6 — Arts, literature & film', description: '被 nâng cao, 之一, 越...越...', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thành ngữ & tục ngữ|||Chapter 7 — Chengyu & proverbs', description: '成语, 歇后语.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập HSK5|||Chapter 8 — HSK5 review', description: 'Viết luận, đọc hiểu, biểu đạt quan điểm.', lessons: [c8, c8q] },
  ],
};
