/**
 * CRW301 — Chinese Reading & Writing Skills 3 (Kỹ năng Đọc - Viết tiếng
 * Trung 3). Khối Ngôn ngữ Trung FPTU, Kỳ 3. Đây là MÔN NGÔN NGỮ, track
 * ĐỌC-VIẾT, NỐI TIẾP CRW201 (HSK3): nâng lên trình độ HSK4 — đọc hiểu văn
 * bản tự sự & miêu tả dài, văn thuyết minh/khoa học phổ thông, bài báo &
 * tin tức; viết văn kể chuyện có bố cục, văn thuyết minh, văn nghị luận nêu
 * & bảo vệ quan điểm, thành ngữ & văn phong trang trọng, bài luận hoàn
 * chỉnh & ôn chữ Hán HSK4. Giáo trình chuẩn: HSK Standard Course 4 (读写),
 * Graded Chinese Reader (nâng cao). Giữ NGUYÊN slug/semester/courseCode/
 * thumb. ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const taiLieu = doc('crw301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình chuẩn HSK Standard Course 4 (读写), Graded Chinese Reader; báo đọc phân cấp, từ điển, ngữ pháp, trang thi thử HSK4.',
  [[
    `<span class="eyebrow">CRW301 · Materials</span>
<h2>Reading &amp; writing HSK4 — materials hub</h2>
<p class="lead">Chinese Reading &amp; Writing 3 continues <strong>CRW201</strong>. There you built basic reading and writing at HSK3. Here you move to <strong>HSK4</strong>: longer texts, several text types (narrative, expository, news), and full essays instead of single sentences.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><strong>HSK Standard Course 4 (读写)</strong> — the reading-writing companion volume; every chapter here maps to its text types and grammar points.</li>
<li><strong>Graded Chinese Reader</strong> (series of leveled readers) — for extended practice once a chapter is done.</li>
</ul>
<h3>📗 Graded readers &amp; news for practice</h3>
<ul>
<li><a href="https://www.thechairmansbao.com/" target="_blank" rel="noopener">The Chairman's Bao</a> — real news articles graded by HSK level, ideal for Chapter 5.</li>
<li><a href="https://www.dulingo.com/" target="_blank" rel="noopener">Du Chinese</a> — graded stories with audio and character breakdown.</li>
</ul>
<h3>🌐 Dictionary &amp; grammar reference</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — character lookup, stroke order, example sentences.</li>
<li><a href="https://resources.allsetlearning.com/chinese/grammar/" target="_blank" rel="noopener">Chinese Grammar Wiki (AllSet Learning)</a> — grammar points by HSK level.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese-Vietnamese dictionary with example sentences.</li>
</ul>
<h3>📝 Official HSK4 exam</h3>
<ul>
<li><a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">chinesetest.cn</a> — the official HSK site: syllabus, sample papers, registration.</li>
</ul>
<div class="callout"><span class="badge">How each chapter is built</span> A reading chapter gives a passage (原文), pinyin, translation, a vocabulary table and a reading-strategy note. A writing chapter gives a structure template, connector words and a full model paragraph — copy the pattern, then swap in your own content.</div>`,
    `<span class="eyebrow">CRW301 · Tài liệu</span>
<h2>Trung tâm tài liệu đọc-viết HSK4</h2>
<p class="lead">Kỹ năng Đọc - Viết tiếng Trung 3 nối tiếp <strong>CRW201</strong>. Ở đó bạn xây nền đọc-viết cơ bản trình độ HSK3. Ở đây bạn chuyển lên <strong>HSK4</strong>: văn bản dài hơn, nhiều thể loại (tự sự, thuyết minh, tin tức), và viết cả bài luận thay vì từng câu đơn lẻ.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>HSK Standard Course 4 (读写)</strong> — tập đọc-viết đi kèm; mỗi chương ở đây bám theo thể loại văn bản và điểm ngữ pháp của tập này.</li>
<li><strong>Graded Chinese Reader</strong> (bộ sách đọc phân cấp) — để luyện thêm sau khi học xong mỗi chương.</li>
</ul>
<h3>📗 Sách đọc phân cấp &amp; tin tức luyện tập</h3>
<ul>
<li><a href="https://www.thechairmansbao.com/" target="_blank" rel="noopener">The Chairman's Bao</a> — tin tức thật được phân cấp theo trình độ HSK, hợp với Chương 5.</li>
<li><a href="https://www.dulingo.com/" target="_blank" rel="noopener">Du Chinese</a> — truyện phân cấp kèm audio và giải nghĩa từng chữ.</li>
</ul>
<h3>🌐 Từ điển &amp; ngữ pháp tra cứu</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ, thứ tự nét, câu ví dụ.</li>
<li><a href="https://resources.allsetlearning.com/chinese/grammar/" target="_blank" rel="noopener">Chinese Grammar Wiki (AllSet Learning)</a> — điểm ngữ pháp theo từng cấp HSK.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung-Việt kèm câu ví dụ.</li>
</ul>
<h3>📝 Kỳ thi HSK4 chính thức</h3>
<ul>
<li><a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">chinesetest.cn</a> — trang chính thức của HSK: đề cương, đề thi mẫu, đăng ký thi.</li>
</ul>
<div class="callout"><span class="badge">Mỗi chương dựng thế nào</span> Chương đọc có đoạn văn (原文), pinyin, bản dịch, bảng từ vựng và ghi chú kỹ năng đọc. Chương viết có khung cấu trúc, từ nối và một đoạn văn mẫu hoàn chỉnh — chép theo khung rồi thay bằng nội dung của riêng bạn.</div>`,
  ]]);

const intro = doc('crw301-0-1-overview', 'Course overview: Chinese Reading & Writing 3 (HSK4)|||Tổng quan: Kỹ năng Đọc - Viết tiếng Trung 3 (HSK4)',
  'Nối tiếp CRW201: đọc hiểu văn bản dài (tự sự, thuyết minh, tin tức) và viết bài có bố cục (kể chuyện, thuyết minh, nghị luận) ở trình độ HSK4.',
  [[
    `<span class="eyebrow">CRW301 · Lesson 0.1 · Overview</span>
<h2>Chinese Reading &amp; Writing 3 (HSK4)</h2>
<p class="lead">This course <strong>continues CRW201</strong>. There you read and wrote short, simple texts at HSK3. Here you move to <strong>HSK4</strong>: longer passages with several sentences per idea, three real text types — <strong>narrative &amp; descriptive</strong>, <strong>expository</strong>, <strong>news</strong> — and writing that has a real <strong>structure</strong>, not just correct grammar.</p>
<h3>What changes from HSK3 to HSK4</h3>
<ul>
<li><strong>Reading</strong> — from single sentences to paragraphs with a topic sentence, supporting details and connector words that signal order or logic.</li>
<li><strong>Writing</strong> — from filling a blank to producing an <strong>opening — development — ending</strong> essay with a clear point of view.</li>
</ul>
<h3>How each lesson works</h3>
<p>Reading chapters give a passage, pinyin, translation, a vocabulary table and a reading-strategy note. Writing chapters give a structure template, connector words and a full model paragraph. Every chapter ends with a short quiz.</p>
<h3>Roadmap</h3>
<p>Reading narrative/descriptive texts → writing a structured narrative → reading expository/science texts → writing expository essays → reading news articles → writing argumentative essays → idioms &amp; formal register → writing a complete essay and reviewing HSK4 characters.</p>`,
    `<span class="eyebrow">CRW301 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng Đọc - Viết tiếng Trung 3 (HSK4)</h2>
<p class="lead">Môn này <strong>nối tiếp CRW201</strong>. Ở đó bạn đọc và viết các văn bản ngắn, đơn giản ở trình độ HSK3. Ở đây bạn chuyển lên <strong>HSK4</strong>: đoạn văn dài hơn với nhiều câu cho một ý, ba thể loại văn bản thật — <strong>tự sự &amp; miêu tả</strong>, <strong>thuyết minh</strong>, <strong>tin tức</strong> — và cách viết có <strong>bố cục</strong> thật sự, không chỉ đúng ngữ pháp.</p>
<h3>HSK3 lên HSK4 khác gì</h3>
<ul>
<li><strong>Đọc</strong> — từ câu đơn lẻ lên đoạn văn có câu chủ đề, chi tiết bổ trợ và từ nối báo hiệu trình tự hoặc logic.</li>
<li><strong>Viết</strong> — từ điền vào chỗ trống lên một bài viết có <strong>mở đầu — diễn biến — kết thúc</strong> với quan điểm rõ ràng.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Chương đọc cho đoạn văn, pinyin, bản dịch, bảng từ vựng và ghi chú kỹ năng đọc. Chương viết cho khung cấu trúc, từ nối và một đoạn văn mẫu hoàn chỉnh. Mỗi chương kết thúc bằng một quiz ngắn.</p>
<h3>Lộ trình</h3>
<p>Đọc văn tự sự/miêu tả → viết văn kể chuyện có bố cục → đọc văn thuyết minh/khoa học phổ thông → viết văn thuyết minh → đọc bài báo tin tức → viết văn nghị luận → thành ngữ &amp; văn phong trang trọng → viết bài luận hoàn chỉnh và ôn chữ Hán HSK4.</p>`,
  ]]);

const c1 = doc('crw301-1-1-narrative-reading', '1.1 — Reading long narrative & descriptive texts|||1.1 — Đọc hiểu văn bản tự sự & miêu tả dài',
  'Đoạn văn kể chuyện chuyến đi Tây An; từ vựng miêu tả; nhận diện câu chủ đề, trình tự thời gian, biện pháp so sánh (比喻).',
  [[
    `<span class="eyebrow">CRW301 · Chapter 1 · Lesson 1.1</span>
<h2>Reading long narrative &amp; descriptive texts</h2>
<h3>原文 — Original text</h3>
<pre><code>上个星期，我和朋友一起去西安旅游。西安是一座有名的古城，那里有很多历史悠久的建筑。我们一大早就出发，先参观了兵马俑。兵马俑的规模让我非常吃惊：一排排陶俑站得整整齐齐，每个人的表情都不一样，好像真的士兵一样。下午，我们又去了古城墙，一边骑自行车一边欣赏周围的风景。夕阳把城墙照得金黄金黄的，美得让人忘记了疲劳。这次旅行不仅让我看到了历史，也让我感受到了中国文化的魅力。</code></pre>
<h3>拼音 — Pinyin</h3>
<p>Shàng ge xīngqī, wǒ hé péngyou yìqǐ qù Xī'ān lǚyóu. Xī'ān shì yí zuò yǒumíng de gǔchéng, nàli yǒu hěn duō lìshǐ yōujiǔ de jiànzhù. Wǒmen yí dà zǎo jiù chūfā, xiān cānguān le bīngmǎyǒng. Bīngmǎyǒng de guīmó ràng wǒ fēicháng chījīng: yì pái pái táoyǒng zhàn de zhěngzhěng qíqí, měi ge rén de biǎoqíng dōu bù yíyàng, hǎoxiàng zhēn de shìbīng yíyàng. Xiàwǔ, wǒmen yòu qù le gǔ chéngqiáng, yìbiān qí zìxíngchē yìbiān xīnshǎng zhōuwéi de fēngjǐng. Xīyáng bǎ chéngqiáng zhào de jīnhuáng jīnhuáng de, měi de ràng rén wàngjì le píláo. Zhè cì lǚxíng bùjǐn ràng wǒ kàndào le lìshǐ, yě ràng wǒ gǎnshòu dào le Zhōngguó wénhuà de mèilì.</p>
<h3>Translation</h3>
<p>Last week, my friend and I traveled to Xi'an together. Xi'an is a famous ancient city with many buildings of long history. We set off very early and first visited the Terracotta Warriors. Their scale amazed me: row after row of pottery figures stood in neat lines, each with a different expression, as if they were real soldiers. In the afternoon we went to the old city wall, cycling while admiring the scenery around us. The setting sun lit the wall a golden yellow, so beautiful it made people forget their fatigue. This trip let me not only see history, but also feel the charm of Chinese culture.</p>
<h3>词汇 — Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>规模</td><td>guīmó</td><td>scale</td></tr>
<tr><td>吃惊</td><td>chījīng</td><td>to be surprised</td></tr>
<tr><td>整整齐齐</td><td>zhěngzhěng qíqí</td><td>neat and tidy</td></tr>
<tr><td>表情</td><td>biǎoqíng</td><td>expression</td></tr>
<tr><td>欣赏</td><td>xīnshǎng</td><td>to admire</td></tr>
<tr><td>夕阳</td><td>xīyáng</td><td>the setting sun</td></tr>
<tr><td>魅力</td><td>mèilì</td><td>charm</td></tr>
<tr><td>疲劳</td><td>píláo</td><td>fatigue</td></tr>
</table>
<h3>Reading strategy</h3>
<ul>
<li><strong>Find the topic sentence</strong> — the last sentence sums up the whole passage: seeing history AND feeling culture.</li>
<li><strong>Time markers</strong> — 上个星期 (last week), 一大早 (very early), 下午 (in the afternoon) show the order of events; use them to build a timeline while reading.</li>
<li><strong>比喻 (simile)</strong> — 好像…一样 ("as if … / like …") compares the statues to real soldiers; spotting this pattern helps you understand descriptive language without knowing every word.</li>
</ul>
<div class="callout"><span class="badge">Skim then scan</span> First read once quickly for the overall idea (skim); then read again to find specific details like place names and numbers (scan). HSK4 reading questions test both skills.</div>`,
    `<span class="eyebrow">CRW301 · Chương 1 · Bài 1.1</span>
<h2>Đọc hiểu văn bản tự sự &amp; miêu tả dài</h2>
<h3>原文 — Đoạn văn gốc</h3>
<pre><code>上个星期，我和朋友一起去西安旅游。西安是一座有名的古城，那里有很多历史悠久的建筑。我们一大早就出发，先参观了兵马俑。兵马俑的规模让我非常吃惊：一排排陶俑站得整整齐齐，每个人的表情都不一样，好像真的士兵一样。下午，我们又去了古城墙，一边骑自行车一边欣赏周围的风景。夕阳把城墙照得金黄金黄的，美得让人忘记了疲劳。这次旅行不仅让我看到了历史，也让我感受到了中国文化的魅力。</code></pre>
<h3>拼音</h3>
<p>Shàng ge xīngqī, wǒ hé péngyou yìqǐ qù Xī'ān lǚyóu. Xī'ān shì yí zuò yǒumíng de gǔchéng, nàli yǒu hěn duō lìshǐ yōujiǔ de jiànzhù. Wǒmen yí dà zǎo jiù chūfā, xiān cānguān le bīngmǎyǒng. Bīngmǎyǒng de guīmó ràng wǒ fēicháng chījīng: yì pái pái táoyǒng zhàn de zhěngzhěng qíqí, měi ge rén de biǎoqíng dōu bù yíyàng, hǎoxiàng zhēn de shìbīng yíyàng. Xiàwǔ, wǒmen yòu qù le gǔ chéngqiáng, yìbiān qí zìxíngchē yìbiān xīnshǎng zhōuwéi de fēngjǐng. Xīyáng bǎ chéngqiáng zhào de jīnhuáng jīnhuáng de, měi de ràng rén wàngjì le píláo. Zhè cì lǚxíng bùjǐn ràng wǒ kàndào le lìshǐ, yě ràng wǒ gǎnshòu dào le Zhōngguó wénhuà de mèilì.</p>
<h3>Bản dịch</h3>
<p>Tuần trước, tôi cùng bạn đi du lịch Tây An. Tây An là một cổ thành nổi tiếng, nơi có rất nhiều công trình kiến trúc lâu đời. Chúng tôi xuất phát từ rất sớm, trước tiên tham quan đội quân đất nung (兵马俑). Quy mô của đội quân đất nung khiến tôi vô cùng kinh ngạc: từng hàng tượng gốm đứng ngay ngắn, biểu cảm của mỗi người đều khác nhau, giống như những người lính thật. Buổi chiều, chúng tôi lại đến bức tường thành cổ, vừa đạp xe vừa ngắm cảnh xung quanh. Ánh hoàng hôn chiếu lên bức tường thành vàng óng, đẹp đến mức khiến người ta quên cả mệt mỏi. Chuyến đi này không chỉ giúp tôi nhìn thấy lịch sử, mà còn giúp tôi cảm nhận được sức hút của văn hoá Trung Quốc.</p>
<h3>词汇 — Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>规模</td><td>guīmó</td><td>quy mô</td></tr>
<tr><td>吃惊</td><td>chījīng</td><td>kinh ngạc</td></tr>
<tr><td>整整齐齐</td><td>zhěngzhěng qíqí</td><td>ngay ngắn, gọn gàng</td></tr>
<tr><td>表情</td><td>biǎoqíng</td><td>biểu cảm</td></tr>
<tr><td>欣赏</td><td>xīnshǎng</td><td>thưởng thức, ngắm</td></tr>
<tr><td>夕阳</td><td>xīyáng</td><td>ánh hoàng hôn</td></tr>
<tr><td>魅力</td><td>mèilì</td><td>sức hút</td></tr>
<tr><td>疲劳</td><td>píláo</td><td>mệt mỏi</td></tr>
</table>
<h3>Kỹ năng đọc</h3>
<ul>
<li><strong>Tìm câu chủ đề</strong> — câu cuối cùng tóm gọn cả đoạn: vừa thấy lịch sử vừa cảm nhận văn hoá.</li>
<li><strong>Từ chỉ thời gian</strong> — 上个星期 (tuần trước), 一大早 (rất sớm), 下午 (buổi chiều) cho biết trình tự sự việc; dùng chúng để dựng lại dòng thời gian khi đọc.</li>
<li><strong>比喻 (so sánh)</strong> — 好像…一样 ("giống như…") ví các bức tượng với người lính thật; nhận ra mẫu câu này giúp hiểu văn miêu tả dù chưa biết hết từ.</li>
</ul>
<div class="callout"><span class="badge">Đọc lướt rồi đọc kỹ</span> Đọc lượt đầu thật nhanh để nắm ý chung (đọc lướt); đọc lại lần hai để tìm chi tiết cụ thể như tên địa danh, con số (đọc quét). Câu hỏi đọc hiểu HSK4 kiểm cả hai kỹ năng này.</div>`,
  ]]);

const c1q = quiz('crw301-quiz-1', 'Quiz 1 — Narrative & descriptive reading|||Quiz 1 — Đọc văn tự sự & miêu tả', [
  { id: 'q1', question: 'Theo đoạn văn, hai nhân vật đã đi du lịch ở đâu?', options: ['Tây An', 'Bắc Kinh', 'Thượng Hải', 'Quảng Châu'], correctIndex: 0, explanation: 'Đoạn văn nêu rõ "去西安旅游" — đi du lịch Tây An.' },
  { id: 'q2', question: 'Câu "好像真的士兵一样" sử dụng biện pháp tu từ nào?', options: ['So sánh (比喻)', 'Nhân hoá (拟人)', 'Nói quá (夸张)', 'Đối lập (对比)'], correctIndex: 0, explanation: '好像…一样 là cấu trúc so sánh (比喻), ví tượng gốm với người lính thật.' },
  { id: 'q3', question: 'Từ nào trong đoạn báo hiệu sự việc xảy ra vào buổi chiều?', options: ['下午', '首先', '总之', '虽然'], correctIndex: 0, explanation: '下午 (xiàwǔ) nghĩa là "buổi chiều" — từ chỉ thời gian đánh dấu sự kiện thứ hai trong đoạn.' },
]);

const c2 = doc('crw301-2-1-narrative-writing', '2.1 — Writing a structured narrative essay|||2.1 — Viết bài văn kể chuyện có bố cục',
  'Bố cục ba phần (开头-经过-结尾); từ nối trình tự thời gian (首先/然后/接着/后来/最后); khung viết mẫu.',
  [[
    `<span class="eyebrow">CRW301 · Chapter 2 · Lesson 2.1</span>
<h2>Writing a structured narrative essay</h2>
<h3>Three-part structure</h3>
<ul>
<li><strong>开头 (Opening)</strong> — introduce time, place and people: 时间、地点、人物.</li>
<li><strong>经过 (Development)</strong> — tell the events in order: cause (起因) → process (经过) → result (结果).</li>
<li><strong>结尾 (Ending)</strong> — close with a feeling or a lesson learned: 感受 or 总结.</li>
</ul>
<h3>Time connectors that build the order</h3>
<p>首先 (first) → 然后 (then) → 接着 (next) → 后来 (later) → 最后 (finally). Using them keeps a story easy to follow, and graders look for exactly these words in an HSK4 essay.</p>
<h3>Model outline (based on the Xi'an trip)</h3>
<pre><code>开头: 上个星期，我和朋友一起去西安旅游。 (time + people + place)
经过:
  首先 — 参观兵马俑，规模让人吃惊
  然后 — 下午去古城墙，骑自行车看风景
  接着 — 看到夕阳把城墙照得金黄
结尾: 这次旅行让我看到历史，也感受到文化的魅力。 (feeling + lesson)</code></pre>
<div class="callout"><span class="badge">Writing tip</span> Do not just list events. Add ONE descriptive or emotional detail per event — a sight, a sound, a feeling — so the piece reads like a story, not a schedule.</div>`,
    `<span class="eyebrow">CRW301 · Chương 2 · Bài 2.1</span>
<h2>Viết bài văn kể chuyện có bố cục</h2>
<h3>Bố cục ba phần</h3>
<ul>
<li><strong>开头 (Mở đầu)</strong> — giới thiệu thời gian, địa điểm, nhân vật: 时间、地点、人物.</li>
<li><strong>经过 (Diễn biến)</strong> — kể sự việc theo trình tự: nguyên nhân (起因) → diễn biến (经过) → kết quả (结果).</li>
<li><strong>结尾 (Kết thúc)</strong> — chốt lại bằng cảm xúc hoặc bài học rút ra: 感受 hoặc 总结.</li>
</ul>
<h3>Từ nối dựng trình tự thời gian</h3>
<p>首先 (trước tiên) → 然后 (sau đó) → 接着 (tiếp theo) → 后来 (về sau) → 最后 (cuối cùng). Dùng đúng các từ này giúp câu chuyện dễ theo dõi, và đây chính là những từ giám khảo HSK4 tìm trong bài viết.</p>
<h3>Khung mẫu (dựa trên chuyến đi Tây An)</h3>
<pre><code>开头: 上个星期，我和朋友一起去西安旅游。 (thời gian + người + địa điểm)
经过:
  首先 — 参观兵马俑，规模让人吃惊
  然后 — 下午去古城墙，骑自行车看风景
  接着 — 看到夕阳把城墙照得金黄
结尾: 这次旅行让我看到历史，也感受到文化的魅力。 (cảm xúc + bài học)</code></pre>
<div class="callout"><span class="badge">Mẹo viết</span> Đừng chỉ liệt kê sự việc. Thêm MỘT chi tiết miêu tả hoặc cảm xúc cho mỗi sự việc — một hình ảnh, một âm thanh, một cảm giác — để bài viết đọc như một câu chuyện, chứ không phải một thời khoá biểu.</div>`,
  ]]);

const c2q = quiz('crw301-quiz-2', 'Quiz 2 — Structured narrative writing|||Quiz 2 — Viết văn kể chuyện có bố cục', [
  { id: 'q1', question: 'Bố cục ba phần của một bài văn kể chuyện gồm những gì?', options: ['开头 - 经过 - 结尾', '论点 - 论据 - 结论', '定义 - 举例 - 总结', '标题 - 导语 - 正文'], correctIndex: 0, explanation: 'Văn kể chuyện dùng bố cục Mở đầu (开头) - Diễn biến (经过) - Kết thúc (结尾).' },
  { id: 'q2', question: 'Từ nối nào KHÔNG thuộc nhóm chỉ trình tự thời gian trong bài văn kể chuyện?', options: ['首先', '然后', '总之', '最后'], correctIndex: 2, explanation: '总之 nghĩa là "tóm lại", dùng để tổng kết chứ không chỉ trình tự thời gian như 首先/然后/最后.' },
  { id: 'q3', question: 'Theo mẹo viết trong bài, để bài văn kể chuyện hay hơn nên làm gì?', options: ['Thêm chi tiết miêu tả hoặc cảm xúc cho mỗi sự việc', 'Chỉ liệt kê thật nhiều sự việc', 'Bỏ hết từ nối cho gọn', 'Viết toàn bộ ở thì tương lai'], correctIndex: 0, explanation: 'Thêm một chi tiết miêu tả/cảm xúc cho mỗi sự việc giúp bài đọc như một câu chuyện thay vì một danh sách.' },
]);

const c3 = doc('crw301-3-1-expository-reading', '3.1 — Reading expository & popular-science texts|||3.1 — Đọc văn bản thuyết minh & khoa học phổ thông',
  'Đoạn văn thuyết minh về gấu trúc; từ nối logic (首先/其次/此外/总之); nhận diện cấu trúc lập luận thuyết minh.',
  [[
    `<span class="eyebrow">CRW301 · Chapter 3 · Lesson 3.1</span>
<h2>Reading expository &amp; popular-science texts</h2>
<h3>原文 — Original text</h3>
<pre><code>大熊猫是中国特有的珍稀动物，也是世界自然基金会的标志。大熊猫喜欢吃竹子，每天要花十几个小时进食。首先，竹子的营养价值并不高，所以大熊猫需要不断进食才能满足身体的需要。其次，大熊猫的繁殖能力比较弱，幼崽的成活率也不高，这是它们数量稀少的重要原因。此外，森林被破坏也让大熊猫失去了不少栖息地。总之，保护大熊猫不仅是保护一个物种，也是保护整个生态环境。</code></pre>
<h3>Translation</h3>
<p>The giant panda is a rare animal unique to China, and also the logo of the World Wildlife Fund. Giant pandas like eating bamboo, spending more than ten hours a day feeding. First, bamboo's nutritional value is not high, so pandas must keep feeding to meet the body's needs. Second, pandas have relatively weak reproductive ability, and cub survival rate is not high either — an important reason their numbers are scarce. In addition, forest destruction has also cost pandas much of their habitat. In sum, protecting the giant panda is not only protecting one species, but also protecting the whole ecological environment.</p>
<h3>词汇 — Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>特有</td><td>tèyǒu</td><td>unique to, endemic</td></tr>
<tr><td>珍稀</td><td>zhēnxī</td><td>rare and precious</td></tr>
<tr><td>竹子</td><td>zhúzi</td><td>bamboo</td></tr>
<tr><td>营养价值</td><td>yíngyǎng jiàzhí</td><td>nutritional value</td></tr>
<tr><td>繁殖</td><td>fánzhí</td><td>to reproduce</td></tr>
<tr><td>幼崽</td><td>yòuzǎi</td><td>cub, offspring</td></tr>
<tr><td>栖息地</td><td>qīxīdì</td><td>habitat</td></tr>
<tr><td>生态环境</td><td>shēngtài huánjìng</td><td>ecological environment</td></tr>
</table>
<h3>Reading strategy — logical connectors</h3>
<p>Expository texts group supporting points with logical connectors, not time connectors: <strong>首先</strong> (first) → <strong>其次</strong> (second) → <strong>此外</strong> (in addition) → <strong>总之</strong> (in sum). Spotting these four words instantly tells you the passage is explaining reasons, not telling a story — count them and you already know how many supporting points to expect.</p>
<div class="callout"><span class="badge">Reading tip</span> The first sentence of an expository paragraph is usually the definition or the main fact (什么); everything after 首先/其次/此外 answers why (为什么); 总之 restates the point. Read the first and last sentences first if you are short on time.</div>`,
    `<span class="eyebrow">CRW301 · Chương 3 · Bài 3.1</span>
<h2>Đọc văn bản thuyết minh &amp; khoa học phổ thông</h2>
<h3>原文 — Đoạn văn gốc</h3>
<pre><code>大熊猫是中国特有的珍稀动物，也是世界自然基金会的标志。大熊猫喜欢吃竹子，每天要花十几个小时进食。首先，竹子的营养价值并不高，所以大熊猫需要不断进食才能满足身体的需要。其次，大熊猫的繁殖能力比较弱，幼崽的成活率也不高，这是它们数量稀少的重要原因。此外，森林被破坏也让大熊猫失去了不少栖息地。总之，保护大熊猫不仅是保护一个物种，也是保护整个生态环境。</code></pre>
<h3>Bản dịch</h3>
<p>Gấu trúc lớn là loài động vật quý hiếm đặc hữu của Trung Quốc, cũng là biểu tượng của Quỹ Quốc tế Bảo vệ Thiên nhiên. Gấu trúc thích ăn tre trúc, mỗi ngày phải mất hơn mười tiếng để ăn. Thứ nhất, giá trị dinh dưỡng của tre trúc không cao, nên gấu trúc phải liên tục ăn mới đáp ứng đủ nhu cầu cơ thể. Thứ hai, khả năng sinh sản của gấu trúc khá yếu, tỷ lệ sống sót của con non cũng không cao, đây là nguyên nhân quan trọng khiến số lượng chúng thưa thớt. Ngoài ra, rừng bị phá hoại cũng khiến gấu trúc mất đi không ít môi trường sống. Tóm lại, bảo vệ gấu trúc không chỉ là bảo vệ một loài, mà còn là bảo vệ cả môi trường sinh thái.</p>
<h3>词汇 — Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>特有</td><td>tèyǒu</td><td>đặc hữu, riêng có</td></tr>
<tr><td>珍稀</td><td>zhēnxī</td><td>quý hiếm</td></tr>
<tr><td>竹子</td><td>zhúzi</td><td>tre trúc</td></tr>
<tr><td>营养价值</td><td>yíngyǎng jiàzhí</td><td>giá trị dinh dưỡng</td></tr>
<tr><td>繁殖</td><td>fánzhí</td><td>sinh sản</td></tr>
<tr><td>幼崽</td><td>yòuzǎi</td><td>con non</td></tr>
<tr><td>栖息地</td><td>qīxīdì</td><td>môi trường sống</td></tr>
<tr><td>生态环境</td><td>shēngtài huánjìng</td><td>môi trường sinh thái</td></tr>
</table>
<h3>Kỹ năng đọc — từ nối logic</h3>
<p>Văn thuyết minh gom các luận điểm bằng từ nối logic, không phải từ nối thời gian: <strong>首先</strong> (thứ nhất) → <strong>其次</strong> (thứ hai) → <strong>此外</strong> (ngoài ra) → <strong>总之</strong> (tóm lại). Nhận ra bốn từ này lập tức cho biết đoạn văn đang giải thích nguyên nhân chứ không kể chuyện — đếm chúng là biết ngay có bao nhiêu luận điểm.</p>
<div class="callout"><span class="badge">Mẹo đọc</span> Câu đầu đoạn thuyết minh thường là định nghĩa hoặc sự kiện chính (là gì); mọi thứ sau 首先/其次/此外 trả lời tại sao; 总之 nhắc lại luận điểm. Nếu thiếu thời gian, hãy đọc câu đầu và câu cuối trước.</div>`,
  ]]);

const c3q = quiz('crw301-quiz-3', 'Quiz 3 — Expository & science reading|||Quiz 3 — Đọc văn thuyết minh & khoa học phổ thông', [
  { id: 'q1', question: 'Theo đoạn văn, vì sao gấu trúc phải ăn liên tục nhiều giờ mỗi ngày?', options: ['Vì giá trị dinh dưỡng của tre trúc không cao', 'Vì chúng không thích ngủ', 'Vì môi trường sống quá lạnh', 'Vì con non ăn thay chúng'], correctIndex: 0, explanation: 'Đoạn văn nêu: "竹子的营养价值并不高，所以大熊猫需要不断进食".' },
  { id: 'q2', question: 'Từ nối nào trong đoạn dùng để tổng kết lại luận điểm?', options: ['总之', '首先', '其次', '此外'], correctIndex: 0, explanation: '总之 (tóm lại) đứng ở câu cuối để tổng kết toàn bộ đoạn văn.' },
  { id: 'q3', question: 'Bốn từ nối 首先/其次/此外/总之 thường xuất hiện trong thể loại văn bản nào?', options: ['Văn thuyết minh (giải thích nguyên nhân, luận điểm)', 'Văn kể chuyện theo trình tự thời gian', 'Bài báo tin tức khách quan', 'Thư từ thân mật'], correctIndex: 0, explanation: 'Đây là các từ nối logic đặc trưng của văn thuyết minh, dùng để sắp xếp các luận điểm/nguyên nhân.' },
]);

const c4 = doc('crw301-4-1-expository-writing', '4.1 — Writing expository & explanatory essays|||4.1 — Viết văn thuyết minh & giải thích',
  'Khung viết định nghĩa → đặc điểm → ví dụ → tổng kết; cấu trúc 之所以…是因为…, 举例来说, 由此可见; đoạn mẫu về phân loại rác.',
  [[
    `<span class="eyebrow">CRW301 · Chapter 4 · Lesson 4.1</span>
<h2>Writing expository &amp; explanatory essays</h2>
<h3>Four-part structure</h3>
<ul>
<li><strong>定义 (Definition)</strong> — state what the thing is.</li>
<li><strong>特点/成因 (Features / causes)</strong> — explain why, using 首先/其次/此外.</li>
<li><strong>举例 (Example)</strong> — back the point with a concrete case.</li>
<li><strong>总结 (Summary)</strong> — restate the significance with 由此可见 (from this we can see).</li>
</ul>
<h3>Useful connectors</h3>
<ul>
<li><strong>之所以…，是因为…</strong> zhī suǒyǐ…, shì yīnwèi… — the reason … is because …</li>
<li><strong>换句话说</strong> huàn jù huà shuō — in other words.</li>
<li><strong>举例来说</strong> jǔlì láishuō — for example.</li>
<li><strong>由此可见</strong> yóucǐ kějiàn — from this it can be seen that.</li>
</ul>
<h3>Model paragraph — 垃圾分类 (sorting garbage)</h3>
<pre><code>垃圾分类是指把不同种类的垃圾分开处理的方式。首先，垃圾分类可以减少环境污染，因为很多垃圾如果混在一起，就很难被回收利用。其次，垃圾分类还能节约资源，比如废纸、塑料瓶经过处理后可以重新使用。举例来说，很多城市已经开始实行垃圾分类政策，效果十分明显。由此可见，垃圾分类不仅对环境有好处，也和我们每个人的生活息息相关。</code></pre>
<div class="callout"><span class="badge">Writing tip</span> An expository paragraph stays neutral and factual — no personal feelings like 我很喜欢. Every claim should be followed by a reason (因为) or an example (比如/举例来说).</div>`,
    `<span class="eyebrow">CRW301 · Chương 4 · Bài 4.1</span>
<h2>Viết văn thuyết minh &amp; giải thích</h2>
<h3>Bố cục bốn phần</h3>
<ul>
<li><strong>定义 (Định nghĩa)</strong> — nêu đối tượng là gì.</li>
<li><strong>特点/成因 (Đặc điểm/nguyên nhân)</strong> — giải thích tại sao, dùng 首先/其次/此外.</li>
<li><strong>举例 (Ví dụ)</strong> — minh hoạ bằng một trường hợp cụ thể.</li>
<li><strong>总结 (Tổng kết)</strong> — nhắc lại ý nghĩa bằng 由此可见 (từ đó có thể thấy).</li>
</ul>
<h3>Từ nối hữu ích</h3>
<ul>
<li><strong>之所以…，是因为…</strong> zhī suǒyǐ…, shì yīnwèi… — sở dĩ … là vì …</li>
<li><strong>换句话说</strong> huàn jù huà shuō — nói cách khác.</li>
<li><strong>举例来说</strong> jǔlì láishuō — lấy ví dụ mà nói.</li>
<li><strong>由此可见</strong> yóucǐ kějiàn — từ đó có thể thấy.</li>
</ul>
<h3>Đoạn văn mẫu — 垃圾分类 (phân loại rác)</h3>
<pre><code>垃圾分类是指把不同种类的垃圾分开处理的方式。首先，垃圾分类可以减少环境污染，因为很多垃圾如果混在一起，就很难被回收利用。其次，垃圾分类还能节约资源，比如废纸、塑料瓶经过处理后可以重新使用。举例来说，很多城市已经开始实行垃圾分类政策，效果十分明显。由此可见，垃圾分类不仅对环境有好处，也和我们每个人的生活息息相关。</code></pre>
<div class="callout"><span class="badge">Mẹo viết</span> Đoạn văn thuyết minh giữ giọng khách quan, dựa trên sự thật — không chêm cảm xúc cá nhân kiểu 我很喜欢. Mỗi luận điểm nên đi kèm một lý do (因为) hoặc một ví dụ (比如/举例来说).</div>`,
  ]]);

const c4q = quiz('crw301-quiz-4', 'Quiz 4 — Expository & explanatory writing|||Quiz 4 — Viết văn thuyết minh & giải thích', [
  { id: 'q1', question: 'Bố cục bốn phần của văn thuyết minh gồm những gì?', options: ['定义 - 特点/成因 - 举例 - 总结', '开头 - 经过 - 结尾', '论点 - 论据 - 反驳 - 结论', '标题 - 导语 - 正文'], correctIndex: 0, explanation: 'Văn thuyết minh đi theo: Định nghĩa - Đặc điểm/nguyên nhân - Ví dụ - Tổng kết.' },
  { id: 'q2', question: 'Cụm "由此可见" thường xuất hiện ở phần nào của đoạn văn thuyết minh?', options: ['Phần tổng kết ở cuối đoạn', 'Câu đầu tiên nêu định nghĩa', 'Giữa hai ví dụ liên tiếp', 'Chỉ dùng trong hội thoại'], correctIndex: 0, explanation: '由此可见 (từ đó có thể thấy) dùng để nhắc lại ý nghĩa ở phần tổng kết, thường là câu cuối đoạn.' },
  { id: 'q3', question: 'Theo mẹo viết trong bài, văn thuyết minh nên tránh điều gì?', options: ['Chêm cảm xúc cá nhân kiểu 我很喜欢', 'Dùng ví dụ cụ thể', 'Nêu lý do bằng 因为', 'Dùng từ nối logic'], correctIndex: 0, explanation: 'Văn thuyết minh cần khách quan, dựa trên sự thật, nên tránh cảm xúc cá nhân.' },
]);

const c5 = doc('crw301-5-1-news-reading', '5.1 — Reading simple news articles|||5.1 — Đọc bài báo & tin tức đơn giản',
  'Bản tin về xe đạp công cộng; cấu trúc 标题/导语/正文; văn phong khách quan của tin tức khác với văn tự sự.',
  [[
    `<span class="eyebrow">CRW301 · Chapter 5 · Lesson 5.1</span>
<h2>Reading simple news articles</h2>
<h3>原文 — Original text</h3>
<pre><code>标题：本市新增两千辆共享单车
据报道，本市从下周一起将新增投放两千辆共享单车，方便市民短途出行。记者了解到，这批共享单车将主要投放在地铁站和商业区附近。相关负责人表示，近年来共享单车的使用人数不断增长，去年的使用量比前年增长了百分之三十。不过，也有市民反映，乱停乱放的问题仍然存在。对此，相关部门表示将加强管理，并呼吁市民文明用车。</code></pre>
<h3>Translation</h3>
<p><strong>Headline: This city adds 2,000 shared bicycles.</strong> It is reported that starting next Monday, the city will roll out an additional 2,000 shared bicycles to make short trips more convenient for residents. Reporters learned that these bikes will mainly be placed near subway stations and commercial areas. An official in charge said that in recent years the number of shared-bike users has kept growing, with last year's usage up 30 percent from the year before. However, some residents also reported that the problem of bikes parked messily still exists. In response, the relevant department said it will strengthen management and calls on citizens to use bikes responsibly.</p>
<h3>词汇 — Vocabulary</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>据报道</td><td>jù bàodào</td><td>it is reported that</td></tr>
<tr><td>投放</td><td>tóufàng</td><td>to release, put into circulation</td></tr>
<tr><td>市民</td><td>shìmín</td><td>city resident</td></tr>
<tr><td>记者</td><td>jìzhě</td><td>reporter</td></tr>
<tr><td>负责人</td><td>fùzérén</td><td>the person in charge</td></tr>
<tr><td>增长</td><td>zēngzhǎng</td><td>to grow, increase</td></tr>
<tr><td>反映</td><td>fǎnyìng</td><td>to report, reflect (an issue)</td></tr>
<tr><td>呼吁</td><td>hūyù</td><td>to call on, appeal</td></tr>
</table>
<h3>News structure</h3>
<ul>
<li><strong>标题 (Headline)</strong> — short, states the core fact.</li>
<li><strong>导语 (Lead)</strong> — the first sentence, usually starting with 据报道, answers who/what/when/where in one line.</li>
<li><strong>正文 (Body)</strong> — adds detail, quotes an official (…表示), and gives a number (百分之三十).</li>
</ul>
<div class="callout"><span class="badge">Register note</span> News writing avoids first person 我 and stays objective — opinions are always attributed to someone (相关负责人表示, 市民反映), never stated directly by the writer. This is different from the personal, first-person voice of a narrative in Chapter 1.</div>`,
    `<span class="eyebrow">CRW301 · Chương 5 · Bài 5.1</span>
<h2>Đọc bài báo &amp; tin tức đơn giản</h2>
<h3>原文 — Đoạn văn gốc</h3>
<pre><code>标题：本市新增两千辆共享单车
据报道，本市从下周一起将新增投放两千辆共享单车，方便市民短途出行。记者了解到，这批共享单车将主要投放在地铁站和商业区附近。相关负责人表示，近年来共享单车的使用人数不断增长，去年的使用量比前年增长了百分之三十。不过，也有市民反映，乱停乱放的问题仍然存在。对此，相关部门表示将加强管理，并呼吁市民文明用车。</code></pre>
<h3>Bản dịch</h3>
<p><strong>Tiêu đề: Thành phố bổ sung hai nghìn xe đạp công cộng.</strong> Theo tin đưa, từ thứ Hai tuần sau thành phố sẽ triển khai thêm hai nghìn xe đạp công cộng, giúp người dân đi lại quãng ngắn thuận tiện hơn. Phóng viên tìm hiểu, lô xe đạp này sẽ chủ yếu được đặt gần các ga tàu điện ngầm và khu thương mại. Người phụ trách liên quan cho biết, những năm gần đây số người sử dụng xe đạp công cộng không ngừng tăng, lượng sử dụng năm ngoái tăng ba mươi phần trăm so với năm trước đó. Tuy nhiên, cũng có người dân phản ánh, vấn đề đỗ xe bừa bãi vẫn còn tồn tại. Về việc này, cơ quan liên quan cho biết sẽ tăng cường quản lý, đồng thời kêu gọi người dân sử dụng xe văn minh.</p>
<h3>词汇 — Từ vựng</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>据报道</td><td>jù bàodào</td><td>theo tin đưa</td></tr>
<tr><td>投放</td><td>tóufàng</td><td>đưa vào sử dụng, triển khai</td></tr>
<tr><td>市民</td><td>shìmín</td><td>người dân thành phố</td></tr>
<tr><td>记者</td><td>jìzhě</td><td>phóng viên</td></tr>
<tr><td>负责人</td><td>fùzérén</td><td>người phụ trách</td></tr>
<tr><td>增长</td><td>zēngzhǎng</td><td>tăng trưởng</td></tr>
<tr><td>反映</td><td>fǎnyìng</td><td>phản ánh</td></tr>
<tr><td>呼吁</td><td>hūyù</td><td>kêu gọi</td></tr>
</table>
<h3>Cấu trúc bản tin</h3>
<ul>
<li><strong>标题 (Tiêu đề)</strong> — ngắn gọn, nêu sự việc cốt lõi.</li>
<li><strong>导语 (Câu dẫn)</strong> — câu đầu tiên, thường mở bằng 据报道, trả lời ai/việc gì/khi nào/ở đâu chỉ trong một câu.</li>
<li><strong>正文 (Nội dung)</strong> — bổ sung chi tiết, trích lời người có trách nhiệm (…表示), và đưa số liệu (百分之三十).</li>
</ul>
<div class="callout"><span class="badge">Ghi chú văn phong</span> Văn tin tức tránh ngôi thứ nhất 我 và giữ giọng khách quan — ý kiến luôn được gán cho ai đó (相关负责人表示, 市民反映), không bao giờ do người viết nêu trực tiếp. Đây là điểm khác với giọng cá nhân, ngôi thứ nhất của văn tự sự ở Chương 1.</div>`,
  ]]);

const c5q = quiz('crw301-quiz-5', 'Quiz 5 — News reading|||Quiz 5 — Đọc bài báo & tin tức', [
  { id: 'q1', question: 'Theo bản tin, xe đạp công cộng mới sẽ được đặt chủ yếu ở đâu?', options: ['Gần ga tàu điện ngầm và khu thương mại', 'Chỉ trong công viên', 'Chỉ ở khu dân cư xa trung tâm', 'Trong khuôn viên trường học'], correctIndex: 0, explanation: 'Bản tin nêu: "这批共享单车将主要投放在地铁站和商业区附近".' },
  { id: 'q2', question: 'Cụm từ nào thường mở đầu câu 导语 (câu dẫn) trong một bản tin?', options: ['据报道', '好像', '首先', '总之'], correctIndex: 0, explanation: '据报道 (theo tin đưa) là cụm mở đầu điển hình của câu dẫn tin tức.' },
  { id: 'q3', question: 'Điểm khác biệt về văn phong giữa tin tức và văn tự sự là gì?', options: ['Tin tức khách quan, tránh ngôi thứ nhất "我"', 'Tin tức luôn dùng ngôi thứ nhất "我"', 'Tin tức không bao giờ có số liệu', 'Tin tức luôn kể theo trình tự thời gian như truyện'], correctIndex: 0, explanation: 'Tin tức giữ giọng khách quan, ý kiến được gán cho người khác qua …表示/…反映, khác với giọng cá nhân của văn tự sự.' },
]);

const c6 = doc('crw301-6-1-argumentative-writing', '6.1 — Writing argumentative essays: stating & defending a view|||6.1 — Viết văn nghị luận: nêu & bảo vệ quan điểm',
  'Bố cục luận điểm-luận cứ-nhượng bộ-kết luận; cấu trúc 有人认为…但我不同意…, 虽然…但是…, 综上所述; đoạn mẫu về học online.',
  [[
    `<span class="eyebrow">CRW301 · Chapter 6 · Lesson 6.1</span>
<h2>Writing argumentative essays: stating &amp; defending a view</h2>
<h3>Four-part structure</h3>
<ul>
<li><strong>提出论点 (State the thesis)</strong> — often opens against a common opposite view: 有人认为…，但我不同意.</li>
<li><strong>论据 (Evidence)</strong> — give two supporting reasons, each with an example or fact.</li>
<li><strong>让步 (Concession)</strong> — admit the other side has a point: 虽然…，但是….</li>
<li><strong>结论 (Conclusion)</strong> — restate your position with 综上所述 (in summary).</li>
</ul>
<h3>Useful connectors</h3>
<ul>
<li><strong>有人认为…，但我不同意这种看法</strong> — some people think …, but I disagree with this view.</li>
<li><strong>首先…，其次…</strong> — first …, second … (to list evidence).</li>
<li><strong>然而 / 虽然…但是…</strong> — however / although … but … (to concede a counterpoint).</li>
<li><strong>综上所述</strong> zōng shàng suǒ shù — in summary, taking all this together.</li>
</ul>
<h3>Model paragraph — 网络学习能否取代传统课堂 (can online learning replace the traditional classroom)</h3>
<pre><code>有人认为，网络学习已经可以取代传统课堂教育，但我并不完全同意这种看法。首先，网络学习确实方便，学生可以随时随地上课，节省了大量时间。其次，网络课程的种类丰富，能满足不同学生的需求。然而，网络学习也有明显的缺点：老师和学生之间缺少面对面的交流，学生的自律性也受到很大考验。虽然网络学习是一种有效的补充方式，但它不能完全取代传统课堂教育中师生互动带来的效果。综上所述，我认为最好的方式是把网络学习和传统课堂结合起来。</code></pre>
<div class="callout"><span class="badge">Writing tip</span> A strong HSK4 argumentative essay always includes a concession (让步) before the conclusion — acknowledging the other side makes your own position sound more reasonable, not weaker.</div>`,
    `<span class="eyebrow">CRW301 · Chương 6 · Bài 6.1</span>
<h2>Viết văn nghị luận: nêu &amp; bảo vệ quan điểm</h2>
<h3>Bố cục bốn phần</h3>
<ul>
<li><strong>提出论点 (Nêu luận điểm)</strong> — thường mở đầu bằng cách đối lập với một quan điểm phổ biến: 有人认为…，但我不同意.</li>
<li><strong>论据 (Luận cứ)</strong> — đưa hai lý do ủng hộ, mỗi lý do kèm ví dụ hoặc dữ kiện.</li>
<li><strong>让步 (Nhượng bộ)</strong> — thừa nhận phía đối lập cũng có điểm đúng: 虽然…，但是….</li>
<li><strong>结论 (Kết luận)</strong> — nhắc lại lập trường bằng 综上所述 (tóm lại, tổng hợp lại).</li>
</ul>
<h3>Từ nối hữu ích</h3>
<ul>
<li><strong>有人认为…，但我不同意这种看法</strong> — có người cho rằng …, nhưng tôi không đồng ý với quan điểm này.</li>
<li><strong>首先…，其次…</strong> — thứ nhất …, thứ hai … (để liệt kê luận cứ).</li>
<li><strong>然而 / 虽然…但是…</strong> — tuy nhiên / mặc dù … nhưng … (để nhượng bộ phản biện).</li>
<li><strong>综上所述</strong> zōng shàng suǒ shù — tóm lại, tổng hợp những điều trên.</li>
</ul>
<h3>Đoạn văn mẫu — 网络学习能否取代传统课堂 (học online có thay được lớp học truyền thống không)</h3>
<pre><code>有人认为，网络学习已经可以取代传统课堂教育，但我并不完全同意这种看法。首先，网络学习确实方便，学生可以随时随地上课，节省了大量时间。其次，网络课程的种类丰富，能满足不同学生的需求。然而，网络学习也有明显的缺点：老师和学生之间缺少面对面的交流，学生的自律性也受到很大考验。虽然网络学习是一种有效的补充方式，但它不能完全取代传统课堂教育中师生互动带来的效果。综上所述，我认为最好的方式是把网络学习和传统课堂结合起来。</code></pre>
<div class="callout"><span class="badge">Mẹo viết</span> Một bài văn nghị luận HSK4 tốt luôn có phần nhượng bộ (让步) trước khi kết luận — thừa nhận phía đối lập khiến lập trường của bạn nghe hợp lý hơn, chứ không hề yếu đi.</div>`,
  ]]);

const c6q = quiz('crw301-quiz-6', 'Quiz 6 — Argumentative writing|||Quiz 6 — Viết văn nghị luận', [
  { id: 'q1', question: 'Trong bố cục văn nghị luận, phần "让步" (nhượng bộ) có tác dụng gì?', options: ['Thừa nhận phía đối lập cũng có điểm đúng, trước khi kết luận', 'Nêu luận điểm chính ngay từ câu đầu', 'Kể lại sự việc theo trình tự thời gian', 'Trích dẫn lời của phóng viên'], correctIndex: 0, explanation: '让步 (虽然…但是…) thừa nhận ý đối lập có phần đúng, giúp lập luận thuyết phục hơn trước khi đưa ra kết luận.' },
  { id: 'q2', question: 'Cụm từ nào dùng để mở đầu phần kết luận, tổng hợp lại toàn bộ lập luận?', options: ['综上所述', '据报道', '好像…一样', '首先'], correctIndex: 0, explanation: '综上所述 (tóm lại) dùng để mở đầu câu kết luận, tổng hợp các luận điểm đã nêu.' },
  { id: 'q3', question: 'Trong đoạn mẫu về học online, tác giả đưa ra bao nhiêu luận cứ ủng hộ trước khi nhượng bộ?', options: ['Hai (tiện lợi và đa dạng khoá học)', 'Một', 'Bốn', 'Không có luận cứ nào'], correctIndex: 0, explanation: 'Đoạn mẫu dùng 首先 (tiện lợi, tiết kiệm thời gian) và 其次 (khoá học đa dạng) — hai luận cứ, trước khi nhượng bộ bằng 然而.' },
]);

const c7 = doc('crw301-7-1-idioms-formal-style', '7.1 — Idioms, set phrases & formal writing register|||7.1 — Thành ngữ, quán ngữ & văn phong trang trọng trong viết',
  'Bảng thành ngữ HSK4 thường gặp; so sánh từ nối khẩu ngữ và trang trọng; quy tắc tránh từ khẩu ngữ trong bài viết.',
  [[
    `<span class="eyebrow">CRW301 · Chapter 7 · Lesson 7.1</span>
<h2>Idioms, set phrases &amp; formal writing register</h2>
<h3>Common HSK4 idioms (成语)</h3>
<table>
<tr><th>成语</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>马马虎虎</td><td>mǎmǎhūhū</td><td>careless, sloppy</td></tr>
<tr><td>半途而废</td><td>bàntú'érfèi</td><td>to give up halfway</td></tr>
<tr><td>画蛇添足</td><td>huàshétiānzú</td><td>to ruin something by adding an unnecessary detail (lit. draw legs on a snake)</td></tr>
<tr><td>入乡随俗</td><td>rùxiāng suísú</td><td>when in Rome, do as the Romans do</td></tr>
<tr><td>一举两得</td><td>yìjǔliǎngdé</td><td>to kill two birds with one stone</td></tr>
<tr><td>取长补短</td><td>qǔchángbǔduǎn</td><td>to learn from each other's strengths</td></tr>
<tr><td>持之以恒</td><td>chízhīyǐhéng</td><td>to persevere</td></tr>
<tr><td>脚踏实地</td><td>jiǎotàshídì</td><td>to be down-to-earth, work steadily</td></tr>
</table>
<h3>Colloquial vs. formal connectors</h3>
<table>
<tr><th>口语 (spoken)</th><th>书面语 (formal writing)</th></tr>
<tr><td>因为</td><td>由于</td></tr>
<tr><td>所以</td><td>因此</td></tr>
<tr><td>可是 / 不过</td><td>然而</td></tr>
<tr><td>挺 / 特别 / 超</td><td>十分 / 非常 / 相当</td></tr>
<tr><td>一点儿</td><td>略微 / 稍微</td></tr>
</table>
<div class="callout"><span class="badge">Register rule</span> Formal essay writing drops sentence-final particles like 啊/呢/吧 and colloquial intensifiers like 挺/超, and prefers 由于…因此… over 因为…所以… at a paragraph's start. Using one idiom correctly is worth more than using several loosely.</div>`,
    `<span class="eyebrow">CRW301 · Chương 7 · Bài 7.1</span>
<h2>Thành ngữ, quán ngữ &amp; văn phong trang trọng trong viết</h2>
<h3>Thành ngữ HSK4 thường gặp (成语)</h3>
<table>
<tr><th>成语</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>马马虎虎</td><td>mǎmǎhūhū</td><td>qua loa, cẩu thả</td></tr>
<tr><td>半途而废</td><td>bàntú'érfèi</td><td>bỏ dở giữa chừng</td></tr>
<tr><td>画蛇添足</td><td>huàshétiānzú</td><td>vẽ rắn thêm chân, làm thừa hoá hỏng</td></tr>
<tr><td>入乡随俗</td><td>rùxiāng suísú</td><td>nhập gia tuỳ tục</td></tr>
<tr><td>一举两得</td><td>yìjǔliǎngdé</td><td>một công đôi việc</td></tr>
<tr><td>取长补短</td><td>qǔchángbǔduǎn</td><td>lấy dài bù ngắn, học ưu điểm của nhau</td></tr>
<tr><td>持之以恒</td><td>chízhīyǐhéng</td><td>kiên trì bền bỉ</td></tr>
<tr><td>脚踏实地</td><td>jiǎotàshídì</td><td>làm việc chắc chắn, thực tế</td></tr>
</table>
<h3>Từ nối khẩu ngữ và trang trọng</h3>
<table>
<tr><th>口语 (khẩu ngữ)</th><th>书面语 (văn viết trang trọng)</th></tr>
<tr><td>因为</td><td>由于</td></tr>
<tr><td>所以</td><td>因此</td></tr>
<tr><td>可是 / 不过</td><td>然而</td></tr>
<tr><td>挺 / 特别 / 超</td><td>十分 / 非常 / 相当</td></tr>
<tr><td>一点儿</td><td>略微 / 稍微</td></tr>
</table>
<div class="callout"><span class="badge">Quy tắc văn phong</span> Bài viết trang trọng bỏ hẳn trợ từ cuối câu như 啊/呢/吧 và từ nhấn khẩu ngữ như 挺/超, và ưu tiên 由于…因此… hơn 因为…所以… ở đầu đoạn. Dùng đúng một thành ngữ có giá trị hơn dùng nhiều thành ngữ một cách hời hợt.</div>`,
  ]]);

const c7q = quiz('crw301-quiz-7', 'Quiz 7 — Idioms & formal register|||Quiz 7 — Thành ngữ & văn phong trang trọng', [
  { id: 'q1', question: 'Thành ngữ "半途而废" nghĩa là gì?', options: ['Bỏ dở giữa chừng', 'Một công đôi việc', 'Kiên trì bền bỉ', 'Nhập gia tuỳ tục'], correctIndex: 0, explanation: '半途而废 (bàntú’érfèi) nghĩa đen là "bỏ dở giữa đường", chỉ việc không làm đến cùng.' },
  { id: 'q2', question: 'Trong văn viết trang trọng, từ nào nên dùng thay cho "可是" (khẩu ngữ)?', options: ['然而', '挺', '啊', '呢'], correctIndex: 0, explanation: '然而 là dạng trang trọng của 可是/不过, thường dùng trong văn viết.' },
  { id: 'q3', question: 'Theo quy tắc văn phong trong bài, bài viết trang trọng nên tránh điều gì?', options: ['Trợ từ cuối câu như 啊/呢/吧', 'Dùng thành ngữ đúng chỗ', 'Dùng 由于…因此…', 'Dùng 十分/非常'], correctIndex: 0, explanation: 'Trợ từ cuối câu 啊/呢/吧 mang tính khẩu ngữ, không phù hợp với văn viết trang trọng.' },
]);

const c8 = doc('crw301-8-1-full-essay-review', '8.1 — Writing a complete essay & reviewing HSK4 characters|||8.1 — Viết bài luận hoàn chỉnh & ôn tập chữ Hán HSK4',
  'Checklist bài luận HSK4; bài mẫu hoàn chỉnh; bảng chữ Hán dễ nhầm (形近字) và cách phân biệt.',
  [[
    `<span class="eyebrow">CRW301 · Chapter 8 · Lesson 8.1</span>
<h2>Writing a complete essay &amp; reviewing HSK4 characters</h2>
<h3>Essay checklist (HSK4 writing exam)</h3>
<ul>
<li><strong>主题明确</strong> — one clear topic, stated in the first sentence.</li>
<li><strong>结构完整</strong> — opening - development - ending (narrative) or thesis - evidence - conclusion (argument).</li>
<li><strong>使用连接词</strong> — at least three connectors (时间: 首先/然后/最后; 逻辑: 因此/然而/由此可见).</li>
<li><strong>字数符合要求</strong> — roughly 80 characters for a sentence-building task, more for a full essay.</li>
<li><strong>检查错别字和标点</strong> — proofread for confusable characters and punctuation before finishing.</li>
</ul>
<h3>Model complete essay — 我最难忘的一次学习经历 (my most memorable learning experience)</h3>
<pre><code>上个学期，我参加了一次汉语演讲比赛，这是我最难忘的一次学习经历。一开始，我非常紧张，因为要用汉语在很多人面前讲话。后来，老师建议我每天对着镜子练习，还教我一些实用的表达方式。经过一个月的努力，我的汉语表达越来越流利。比赛那天，我克服了紧张，顺利地完成了演讲，还获得了第二名。这次经历让我明白，只有坚持练习，才能取得进步。以后遇到困难，我也会像这次一样，脚踏实地地去克服它。</code></pre>
<h3>形近字 — Confusable characters</h3>
<table>
<tr><th>Pair</th><th>Difference</th></tr>
<tr><td>已 (yǐ, already) vs 己 (jǐ, self)</td><td>已 has a closed top stroke; 己 is open — 已经 "already" vs 自己 "oneself".</td></tr>
<tr><td>未 (wèi, not yet) vs 末 (mò, end)</td><td>未 has a shorter top stroke; 末 a longer one — 未来 "future" vs 末尾 "the very end".</td></tr>
<tr><td>象 (xiàng, elephant/general shape) vs 像 (xiàng, to resemble)</td><td>像 adds 亻(person radical) for comparisons between people/things — 好像 "as if", 想象 "imagine".</td></tr>
<tr><td>在 (zài, at, in-progress) vs 再 (zài, again)</td><td>在 marks location/ongoing action; 再 marks repetition — 在学习 "is studying" vs 再来一次 "do it again".</td></tr>
<tr><td>的 / 地 / 得 (all read de)</td><td>的 before a noun; 地 before a verb (adverbial); 得 after a verb, before degree/result.</td></tr>
</table>
<div class="callout"><span class="badge">Final tip</span> Read your own essay once out loud before submitting — a wrong 的/地/得 or 在/再 is easy to hear even when it is easy to miss by eye.</div>`,
    `<span class="eyebrow">CRW301 · Chương 8 · Bài 8.1</span>
<h2>Viết bài luận hoàn chỉnh &amp; ôn tập chữ Hán HSK4</h2>
<h3>Checklist bài luận (thi viết HSK4)</h3>
<ul>
<li><strong>主题明确</strong> — một chủ đề rõ ràng, nêu ngay ở câu đầu.</li>
<li><strong>结构完整</strong> — mở đầu - diễn biến - kết thúc (văn tự sự) hoặc luận điểm - luận cứ - kết luận (văn nghị luận).</li>
<li><strong>使用连接词</strong> — dùng ít nhất ba từ nối (thời gian: 首先/然后/最后; logic: 因此/然而/由此可见).</li>
<li><strong>字数符合要求</strong> — khoảng 80 chữ cho dạng ghép câu, nhiều hơn cho bài luận đầy đủ.</li>
<li><strong>检查错别字和标点</strong> — rà lại chữ dễ nhầm và dấu câu trước khi nộp.</li>
</ul>
<h3>Bài luận mẫu hoàn chỉnh — 我最难忘的一次学习经历 (trải nghiệm học tập khó quên nhất của tôi)</h3>
<pre><code>上个学期，我参加了一次汉语演讲比赛，这是我最难忘的一次学习经历。一开始，我非常紧张，因为要用汉语在很多人面前讲话。后来，老师建议我每天对着镜子练习，还教我一些实用的表达方式。经过一个月的努力，我的汉语表达越来越流利。比赛那天，我克服了紧张，顺利地完成了演讲，还获得了第二名。这次经历让我明白，只有坚持练习，才能取得进步。以后遇到困难，我也会像这次一样，脚踏实地地去克服它。</code></pre>
<h3>形近字 — Chữ Hán dễ nhầm</h3>
<table>
<tr><th>Cặp chữ</th><th>Cách phân biệt</th></tr>
<tr><td>已 (yǐ, đã) và 己 (jǐ, bản thân)</td><td>已 có nét trên khép kín; 己 để hở — 已经 "đã" vs 自己 "bản thân".</td></tr>
<tr><td>未 (wèi, chưa) và 末 (mò, cuối)</td><td>未 nét ngang trên ngắn hơn; 末 dài hơn — 未来 "tương lai" vs 末尾 "phần cuối cùng".</td></tr>
<tr><td>象 (xiàng, con voi/dáng vẻ) và 像 (xiàng, giống như)</td><td>像 thêm bộ 亻(bộ nhân) khi so sánh người/vật — 好像 "dường như", 想象 "tưởng tượng".</td></tr>
<tr><td>在 (zài, ở, đang) và 再 (zài, lại, nữa)</td><td>在 chỉ vị trí/hành động đang diễn ra; 再 chỉ sự lặp lại — 在学习 "đang học" vs 再来一次 "làm lại lần nữa".</td></tr>
<tr><td>的 / 地 / 得 (đều đọc de)</td><td>的 đứng trước danh từ; 地 đứng trước động từ (bổ nghĩa cách thức); 得 đứng sau động từ, trước mức độ/kết quả.</td></tr>
</table>
<div class="callout"><span class="badge">Mẹo cuối</span> Đọc to bài luận của mình một lượt trước khi nộp — dùng sai 的/地/得 hoặc 在/再 rất dễ nghe ra, dù mắt đọc lướt dễ bỏ sót.</div>`,
  ]]);

const c8q = quiz('crw301-quiz-8', 'Quiz 8 — Complete essay & character review|||Quiz 8 — Bài luận hoàn chỉnh & ôn chữ Hán', [
  { id: 'q1', question: 'Theo checklist bài luận HSK4, một bài viết tốt cần dùng ít nhất bao nhiêu từ nối?', options: ['Ít nhất ba từ nối', 'Không cần từ nối nào', 'Chỉ cần đúng một từ nối', 'Càng nhiều càng tốt, không giới hạn loại'], correctIndex: 0, explanation: 'Checklist yêu cầu dùng ít nhất ba từ nối, kết hợp cả loại thời gian và loại logic.' },
  { id: 'q2', question: 'Chữ nào trong ba chữ "的/地/得" đứng trước một danh từ?', options: ['的', '地', '得', 'Cả ba đều như nhau'], correctIndex: 0, explanation: '的 đứng trước danh từ (định ngữ); 地 đứng trước động từ; 得 đứng sau động từ.' },
  { id: 'q3', question: 'Câu "以后遇到困难，我也会…脚踏实地地去克服它" dùng thành ngữ "脚踏实地" với ý nghĩa gì?', options: ['Làm việc chắc chắn, thực tế', 'Bỏ dở giữa chừng', 'Vẽ rắn thêm chân', 'Một công đôi việc'], correctIndex: 0, explanation: '脚踏实地 nghĩa là làm việc một cách chắc chắn, thực tế, không viển vông.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CRW301',
    slug: 'crw301-chinese-reading-writing-skills-3',
    title: 'Chinese Reading & Writing Skills 3',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CRW301.webp',
    shortDescription: 'Reading & writing at HSK4: narrative/descriptive and expository texts, simple news; write narratives, explanations and argumentative essays; formal register, idioms, HSK4 characters. Hanzi, pinyin, Vietnamese/English glosses.|||Đọc-viết trình độ HSK4: văn tự sự/miêu tả, thuyết minh, tin tức; viết văn kể chuyện, thuyết minh, nghị luận có bố cục; văn phong trang trọng, thành ngữ, chữ Hán HSK4. Có chữ Hán, pinyin, nghĩa Việt/Anh.',
    description: 'Môn <strong>CRW301 — Chinese Reading &amp; Writing Skills 3</strong> (Kỹ năng Đọc - Viết tiếng Trung 3) nối tiếp <strong>CRW201</strong>, nâng trình độ đọc-viết lên <strong>HSK4</strong>.<br><br>8 chương đi từ <strong>đọc hiểu văn bản tự sự &amp; miêu tả dài</strong>, <strong>văn thuyết minh/khoa học phổ thông</strong>, <strong>bài báo &amp; tin tức</strong> — đến <strong>viết văn kể chuyện có bố cục</strong>, <strong>văn thuyết minh</strong>, <strong>văn nghị luận nêu &amp; bảo vệ quan điểm</strong>, rồi <strong>thành ngữ, văn phong trang trọng</strong> và <strong>bài luận hoàn chỉnh</strong>. Giáo trình chuẩn: HSK Standard Course 4 (读写), Graded Chinese Reader. Mỗi chương có đoạn đọc + từ vựng (汉字 | pinyin | nghĩa) + khung viết mẫu, kèm quiz.',
    whatYouLearn: 'Đọc hiểu văn bản tự sự &amp; miêu tả dài; nhận diện câu chủ đề, trình tự thời gian, biện pháp tu từ (比喻/拟人); đọc văn thuyết minh khoa học phổ thông với từ nối 首先/其次/此外/总之; đọc bài báo — cấu trúc 标题/导语/正文; viết văn kể chuyện có bố cục mở đầu-diễn biến-kết thúc; viết văn thuyết minh (định nghĩa → đặc điểm → ví dụ → tổng kết); viết văn nghị luận nêu &amp; bảo vệ quan điểm, có luận cứ &amp; nhượng bộ; thành ngữ &amp; quán ngữ thường gặp; phân biệt văn phong khẩu ngữ/trang trọng; viết bài luận hoàn chỉnh theo chuẩn thi HSK4; ôn tập chữ Hán dễ nhầm (形近字).',
    requirements: 'Đã hoàn thành CRW201 (Chinese Reading &amp; Writing Skills 2) hoặc đạt trình độ HSK3; biết khoảng 600 chữ Hán cơ bản và ngữ pháp sơ-trung cấp.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình HSK Standard Course 4 (读写), Graded Chinese Reader, báo đọc phân cấp, từ điển, ngữ pháp.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CRW201, nâng lên HSK4: đọc văn bản dài, viết bài có bố cục.', lessons: [intro] },
    { title: 'Chương 1 — Đọc văn tự sự & miêu tả|||Chapter 1 — Narrative & descriptive reading', description: 'Đoạn văn kể chuyện dài, câu chủ đề, trình tự thời gian, so sánh 比喻.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Viết văn kể chuyện có bố cục|||Chapter 2 — Structured narrative writing', description: 'Bố cục mở đầu-diễn biến-kết thúc, từ nối thời gian.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đọc văn thuyết minh & khoa học|||Chapter 3 — Expository & science reading', description: 'Từ nối logic 首先/其次/此外/总之, cấu trúc lập luận thuyết minh.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Viết văn thuyết minh & giải thích|||Chapter 4 — Expository writing', description: 'Định nghĩa → đặc điểm → ví dụ → tổng kết.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đọc bài báo & tin tức|||Chapter 5 — News reading', description: 'Cấu trúc 标题/导语/正文, văn phong khách quan.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Viết văn nghị luận|||Chapter 6 — Argumentative writing', description: 'Luận điểm - luận cứ - nhượng bộ - kết luận.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thành ngữ & văn phong trang trọng|||Chapter 7 — Idioms & formal register', description: 'Thành ngữ HSK4, từ nối khẩu ngữ vs trang trọng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bài luận hoàn chỉnh & ôn chữ Hán|||Chapter 8 — Full essay & character review', description: 'Checklist bài luận, bài mẫu, chữ Hán dễ nhầm 形近字.', lessons: [c8, c8q] },
  ],
};
