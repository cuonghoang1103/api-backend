/**
 * CIC102 — Intensive Chinese 2 (Tiếng Trung Tổng hợp 2). Ngành Ngôn ngữ Trung,
 * FPTU, Kỳ 1. Nối tiếp CIC101 (HSK1-2 nhập môn), nâng lên HSK2→3: 8 chương
 * theo "HSK Standard Course 3" (BLCU) + "Integrated Chinese L1 Part 2".
 * Dạy chữ Hán thật + pinyin có dấu thanh + nghĩa, chú thích song ngữ Việt/Anh.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('cic102-0-1-overview', 'Course overview: Intensive Chinese 2|||Tổng quan: Tiếng Trung Tổng hợp 2',
  'Mục tiêu HSK2 lên HSK3; 8 chủ đề: quá khứ và trải nghiệm, so sánh, sức khoẻ, công việc, du lịch, cảm xúc và đề nghị, điện thoại và giao tiếp, ôn tập câu phức.',
  [[
    `<span class="eyebrow">CIC102 · Lesson 0.1 · Overview</span>
<h2>Intensive Chinese 2 — from HSK 2 to HSK 3</h2>
<p class="lead">This course continues directly from <strong>CIC101</strong> (HSK 1-2 basics: greetings, numbers, daily routine). Here you push into <strong>HSK 3</strong> territory: talking about the <strong>past and experience</strong>, <strong>comparing</strong> things, describing <strong>health</strong>, discussing <strong>work and future plans</strong>, handling <strong>travel and booking</strong>, expressing <strong>feelings and suggestions</strong>, making <strong>phone calls and appointments</strong>, and finally combining everything into the <strong>complex sentences</strong> tested on HSK 3.</p>
<h3>Eight chapters</h3>
<ul>
<li><strong>1.</strong> Past &amp; experience — <code>了 (le)</code>, <code>过 (guo)</code>, result complements</li>
<li><strong>2.</strong> Comparison &amp; degree — <code>比 (bǐ)</code>, <code>一样 (yīyàng)</code>, <code>更/最 (gèng/zuì)</code></li>
<li><strong>3.</strong> Health, illness &amp; seeing a doctor</li>
<li><strong>4.</strong> Work, study &amp; future plans</li>
<li><strong>5.</strong> Travel, booking &amp; the airport</li>
<li><strong>6.</strong> Feelings, opinions &amp; suggestions — potential complements, <code>把 (bǎ)</code>-sentences</li>
<li><strong>7.</strong> Phone calls, appointments &amp; social chat</li>
<li><strong>8.</strong> HSK 3 review — complex sentences (因为/所以, 虽然/但是…)</li>
</ul>
<h3>How each lesson works</h3>
<p>Every chapter gives you a real <strong>vocabulary table</strong> (Hanzi + pinyin with tone marks + meaning), one or two <strong>grammar points</strong> with worked example sentences, a short <strong>dialogue</strong>, and a 3-question quiz.</p>`,
    `<span class="eyebrow">CIC102 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung Tổng hợp 2 — từ HSK2 lên HSK3</h2>
<p class="lead">Môn này nối tiếp trực tiếp <strong>CIC101</strong> (HSK1-2 cơ bản: chào hỏi, số đếm, sinh hoạt hằng ngày). Ở đây bạn tiến vào vùng <strong>HSK3</strong>: kể chuyện <strong>quá khứ &amp; trải nghiệm</strong>, <strong>so sánh</strong> sự vật, mô tả <strong>sức khoẻ</strong>, bàn về <strong>công việc &amp; kế hoạch tương lai</strong>, xử lý tình huống <strong>du lịch &amp; đặt phòng</strong>, bày tỏ <strong>cảm xúc &amp; đề nghị</strong>, gọi <strong>điện thoại &amp; hẹn gặp</strong>, và cuối cùng ghép mọi thứ lại thành <strong>câu phức</strong> — đúng dạng bài thi HSK3.</p>
<h3>Tám chương</h3>
<ul>
<li><strong>1.</strong> Quá khứ &amp; trải nghiệm — <code>了 (le)</code>, <code>过 (guo)</code>, bổ ngữ kết quả</li>
<li><strong>2.</strong> So sánh &amp; mức độ — <code>比 (bǐ)</code>, <code>一样 (yīyàng)</code>, <code>更/最 (gèng/zuì)</code></li>
<li><strong>3.</strong> Sức khoẻ, bệnh tật &amp; khám bệnh</li>
<li><strong>4.</strong> Công việc, học tập &amp; kế hoạch tương lai</li>
<li><strong>5.</strong> Du lịch, đặt phòng &amp; sân bay</li>
<li><strong>6.</strong> Cảm xúc, ý kiến &amp; đề nghị — bổ ngữ khả năng, câu chữ <code>把 (bǎ)</code></li>
<li><strong>7.</strong> Điện thoại, hẹn &amp; giao tiếp xã hội</li>
<li><strong>8.</strong> Ôn tập HSK3 — câu phức (因为/所以, 虽然/但是…)</li>
</ul>
<h3>Mỗi bài học gồm gì</h3>
<p>Mỗi chương có một <strong>bảng từ vựng</strong> thật (chữ Hán + pinyin có dấu thanh + nghĩa), một hoặc hai <strong>điểm ngữ pháp</strong> kèm câu ví dụ, một <strong>đoạn hội thoại</strong> ngắn, và quiz 3 câu.</p>`,
  ]]);

const c1 = doc('cic102-1-1-past-experience', 'Chapter 1 - Past and experience (le/guo, result complements)|||Chương 1 - Kể chuyện quá khứ và trải nghiệm (了/过, bổ ngữ kết quả)',
  'Trợ từ 了 (hoàn thành), 过 (từng trải nghiệm), bổ ngữ kết quả (完/到/懂); từ vựng kể chuyện, hội thoại du lịch quá khứ.',
  [[
    `<span class="eyebrow">CIC102 · Chapter 1 · Lesson 1.1</span>
<h2>Talking about the past &amp; experience</h2>
<h3>Vocabulary</h3>
<pre><code>经历  jīnglì     experience (n.)
曾经  céngjīng   once, in the past
已经  yǐjīng     already
后来  hòulái     afterwards, later
终于  zhōngyú    finally
完成  wánchéng   to complete
发生  fāshēng    to happen
记得  jìde       to remember
忘记  wàngjì     to forget
决定  juédìng    to decide
</code></pre>
<h3>Grammar 1 — 了 (le): a completed action</h3>
<p>Put <code>了</code> right after the verb (or at the end of the sentence) to mark that an action is <strong>completed</strong>, usually a specific event.</p>
<pre><code>我去了北京。
Wǒ qùle Běijīng.
I went to Beijing.
</code></pre>
<h3>Grammar 2 — 过 (guo): ever experienced</h3>
<p><code>过</code> after a verb marks that you have <strong>ever done</strong> something before — an experience, not a specific completed event. Negative: <code>没 + V + 过</code>.</p>
<pre><code>我去过中国,可是没去过上海。
Wǒ qùguo Zhōngguó, kěshì méi qùguo Shànghǎi.
I have been to China, but I have never been to Shanghai.
</code></pre>
<h3>Grammar 3 — result complements</h3>
<p>A second verb/adjective right after the main verb shows the <strong>result</strong> of the action: <code>完</code> (finish), <code>到</code> (achieve/succeed), <code>懂</code> (understand).</p>
<pre><code>我做完了作业。   Wǒ zuò wán le zuòyè.       I finished the homework.
我听懂了。      Wǒ tīng dǒng le.           I understood (by listening).
我找到了钥匙。   Wǒ zhǎodàole yàoshi.       I found the keys.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 你去过中国吗?
   Nǐ qùguo Zhōngguó ma?
   Have you ever been to China?
B: 去过,我去年去了北京和上海。
   Qùguo, wǒ qùnián qùle Běijīng hé Shànghǎi.
   Yes, I went to Beijing and Shanghai last year.
A: 玩得怎么样?
   Wán de zěnmeyàng?
   How was it?
B: 太好了!我终于看到了长城。
   Tài hǎo le! Wǒ zhōngyú kàndàole Chángchéng.
   Great! I finally saw the Great Wall.
</code></pre>
<div class="callout"><span class="badge">了 vs 过</span> <code>了</code> = "this specific thing happened" (a completed event). <code>过</code> = "I have this experience, ever" — no fixed time needed.</div>`,
    `<span class="eyebrow">CIC102 · Chương 1 · Bài 1.1</span>
<h2>Kể chuyện quá khứ &amp; trải nghiệm</h2>
<h3>Từ vựng</h3>
<pre><code>经历  jīnglì     trải nghiệm (dt.)
曾经  céngjīng   đã từng, trước kia
已经  yǐjīng     đã (rồi)
后来  hòulái     sau đó
终于  zhōngyú    cuối cùng
完成  wánchéng   hoàn thành
发生  fāshēng    xảy ra
记得  jìde       nhớ
忘记  wàngjì     quên
决定  juédìng    quyết định
</code></pre>
<h3>Ngữ pháp 1 — 了 (le): hành động đã hoàn thành</h3>
<p>Đặt <code>了</code> ngay sau động từ (hoặc cuối câu) để đánh dấu một hành động đã <strong>hoàn thành</strong>, thường là một sự việc cụ thể.</p>
<pre><code>我去了北京。
Wǒ qùle Běijīng.
Tôi đã đi Bắc Kinh.
</code></pre>
<h3>Ngữ pháp 2 — 过 (guo): đã từng trải nghiệm</h3>
<p><code>过</code> sau động từ đánh dấu bạn đã <strong>từng làm</strong> điều gì đó — một trải nghiệm, không nhất thiết gắn thời điểm cụ thể. Phủ định: <code>没 + V + 过</code>.</p>
<pre><code>我去过中国,可是没去过上海。
Wǒ qùguo Zhōngguó, kěshì méi qùguo Shànghǎi.
Tôi đã từng đến Trung Quốc, nhưng chưa từng đến Thượng Hải.
</code></pre>
<h3>Ngữ pháp 3 — bổ ngữ kết quả</h3>
<p>Một động từ/tính từ thứ hai đứng ngay sau động từ chính để chỉ <strong>kết quả</strong> của hành động: <code>完</code> (xong), <code>到</code> (đạt được), <code>懂</code> (hiểu).</p>
<pre><code>我做完了作业。   Wǒ zuò wán le zuòyè.       Tôi đã làm xong bài tập.
我听懂了。      Wǒ tīng dǒng le.           Tôi đã nghe hiểu.
我找到了钥匙。   Wǒ zhǎodàole yàoshi.       Tôi đã tìm thấy chìa khoá.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 你去过中国吗?
   Nǐ qùguo Zhōngguó ma?
   Bạn đã từng đến Trung Quốc chưa?
B: 去过,我去年去了北京和上海。
   Qùguo, wǒ qùnián qùle Běijīng hé Shànghǎi.
   Đã từng, năm ngoái tôi đã đi Bắc Kinh và Thượng Hải.
A: 玩得怎么样?
   Wán de zěnmeyàng?
   Chơi thế nào?
B: 太好了!我终于看到了长城。
   Tài hǎo le! Wǒ zhōngyú kàndàole Chángchéng.
   Tuyệt lắm! Cuối cùng tôi đã nhìn thấy Vạn Lý Trường Thành.
</code></pre>
<div class="callout"><span class="badge">了 khác 过</span> <code>了</code> = "việc cụ thể này đã xảy ra" (một sự kiện hoàn thành). <code>过</code> = "tôi từng có trải nghiệm này" — không cần mốc thời gian cố định.</div>`,
  ]]);

const c1q = quiz('cic102-quiz-1', 'Quiz 1 - Past and experience|||Quiz 1 - Quá khứ và trải nghiệm', [
  { id: 'q1', question: 'Muốn nói "đã từng đến Nhật Bản" (kinh nghiệm, không cần mốc thời gian), dùng trợ từ nào?', options: ['了 (le)', '过 (guo)', '着 (zhe)', '的 (de)'], correctIndex: 1, explanation: '过 đánh dấu kinh nghiệm đã từng làm, ví dụ 我去过日本 - Tôi đã từng đến Nhật Bản.' },
  { id: 'q2', question: 'Câu "我听懂了" (Wǒ tīng dǒng le) nghĩa là gì?', options: ['Tôi đang nghe', 'Tôi đã nghe hiểu', 'Tôi muốn nghe', 'Tôi không nghe'], correctIndex: 1, explanation: '懂 là bổ ngữ kết quả sau 听, cho biết kết quả của việc nghe là "hiểu".' },
  { id: 'q3', question: 'Câu nào dùng đúng để phủ định "chưa từng đi Thượng Hải"?', options: ['我不去过上海', '我没去过上海', '我去过没上海', '我去了上海'], correctIndex: 1, explanation: 'Phủ định của 过 luôn dùng 没 đứng trước động từ: 没 + V + 过.' },
]);

const c2 = doc('cic102-2-1-comparison', 'Chapter 2 - Comparison and degree (bi/yiyang/geng/zui)|||Chương 2 - So sánh và mức độ (比/一样/更/最)',
  'Câu so sánh 比, câu giống nhau 一样, mức độ 更/最, càng ngày càng 越来越; từ vựng mua sắm & so sánh.',
  [[
    `<span class="eyebrow">CIC102 · Chapter 2 · Lesson 2.1</span>
<h2>Comparison &amp; degree</h2>
<h3>Vocabulary</h3>
<pre><code>比较   bǐjiào     relatively; to compare
一样   yīyàng     the same
更     gèng       even more
最     zuì        the most
差不多  chàbuduō   almost the same
有点儿  yǒudiǎnr   a bit, slightly
越来越  yuèláiyuè  more and more
比如   bǐrú       for example
特别   tèbié      especially
一般   yìbān      generally, ordinary
</code></pre>
<h3>Grammar 1 — A 比 B + adjective</h3>
<p>The basic comparative: <strong>A is more [adj] than B</strong>. Do not add <code>很</code> before the adjective.</p>
<pre><code>今天比昨天冷。
Jīntiān bǐ zuótiān lěng.
Today is colder than yesterday.
</code></pre>
<h3>Grammar 2 — A 跟/和 B 一样 (+ adj)</h3>
<pre><code>我的手机跟你的一样。
Wǒ de shǒujī gēn nǐ de yīyàng.
My phone is the same as yours.
</code></pre>
<h3>Grammar 3 — 更 / 最, and 越来越</h3>
<pre><code>这家比那家更贵,那家最便宜。
Zhè jiā bǐ nà jiā gèng guì, nà jiā zuì piányi.
This shop is more expensive than that one; that one is the cheapest.

天气越来越冷了。
Tiānqì yuèláiyuè lěng le.
The weather is getting colder and colder.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 这两件衣服,你觉得哪件更好看?
   Zhè liǎng jiàn yīfu, nǐ juéde nǎ jiàn gèng hǎokàn?
   Between these two, which do you think looks better?
B: 我觉得红色的比蓝色的更好看,而且不贵。
   Wǒ juéde hóngsè de bǐ lánsè de gèng hǎokàn, érqiě bú guì.
   I think the red one looks better than the blue one, and it is not expensive.
A: 是啊,而且它跟我的裙子颜色一样。
   Shì a, érqiě tā gēn wǒ de qúnzi yánsè yīyàng.
   Right, and it is the same color as my skirt.
</code></pre>
<div class="callout"><span class="badge">Common mistake</span> Never say <code>很比</code> or add <code>很</code> right before the adjective in a 比-sentence — that is a top HSK3 error.</div>`,
    `<span class="eyebrow">CIC102 · Chương 2 · Bài 2.1</span>
<h2>So sánh &amp; mức độ</h2>
<h3>Từ vựng</h3>
<pre><code>比较   bǐjiào     tương đối; so sánh
一样   yīyàng     giống nhau
更     gèng       hơn nữa, càng
最     zuì        nhất
差不多  chàbuduō   xấp xỉ, gần như
有点儿  yǒudiǎnr   hơi
越来越  yuèláiyuè  càng ngày càng
比如   bǐrú       ví dụ như
特别   tèbié      đặc biệt
一般   yìbān      bình thường, thông thường
</code></pre>
<h3>Ngữ pháp 1 — A 比 B + tính từ</h3>
<p>Cấu trúc so sánh hơn cơ bản: <strong>A [tính từ] hơn B</strong>. Không thêm <code>很</code> trước tính từ.</p>
<pre><code>今天比昨天冷。
Jīntiān bǐ zuótiān lěng.
Hôm nay lạnh hơn hôm qua.
</code></pre>
<h3>Ngữ pháp 2 — A 跟/和 B 一样 (+ tính từ)</h3>
<pre><code>我的手机跟你的一样。
Wǒ de shǒujī gēn nǐ de yīyàng.
Điện thoại của tôi giống của bạn.
</code></pre>
<h3>Ngữ pháp 3 — 更 / 最, và 越来越</h3>
<pre><code>这家比那家更贵,那家最便宜。
Zhè jiā bǐ nà jiā gèng guì, nà jiā zuì piányi.
Quán này đắt hơn quán kia, quán kia rẻ nhất.

天气越来越冷了。
Tiānqì yuèláiyuè lěng le.
Thời tiết càng ngày càng lạnh.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 这两件衣服,你觉得哪件更好看?
   Zhè liǎng jiàn yīfu, nǐ juéde nǎ jiàn gèng hǎokàn?
   Hai cái áo này, bạn thấy cái nào đẹp hơn?
B: 我觉得红色的比蓝色的更好看,而且不贵。
   Wǒ juéde hóngsè de bǐ lánsè de gèng hǎokàn, érqiě bú guì.
   Tôi thấy cái màu đỏ đẹp hơn cái màu xanh, mà lại không đắt.
A: 是啊,而且它跟我的裙子颜色一样。
   Shì a, érqiě tā gēn wǒ de qúnzi yánsè yīyàng.
   Đúng vậy, với lại nó cùng màu với váy của tôi.
</code></pre>
<div class="callout"><span class="badge">Lỗi hay gặp</span> Không được nói <code>很比</code> hoặc thêm <code>很</code> ngay trước tính từ trong câu chữ 比 — đây là lỗi rất hay gặp ở HSK3.</div>`,
  ]]);

const c2q = quiz('cic102-quiz-2', 'Quiz 2 - Comparison and degree|||Quiz 2 - So sánh và mức độ', [
  { id: 'q1', question: 'Câu nào dịch đúng "Hôm nay lạnh hơn hôm qua"?', options: ['今天很冷昨天', '今天比昨天冷', '今天冷比昨天', '昨天比今天冷'], correctIndex: 1, explanation: 'Cấu trúc A 比 B + tính từ: 今天比昨天冷 (A=hôm nay, B=hôm qua).' },
  { id: 'q2', question: 'Từ nào diễn tả "càng ngày càng" như trong 天气越来越冷了?', options: ['一样', '越来越', '差不多', '有点儿'], correctIndex: 1, explanation: '越来越 + tính từ diễn tả mức độ tăng dần theo thời gian.' },
  { id: 'q3', question: 'Trong câu chữ 比 (A 比 B + tính từ), lỗi sai phổ biến nhất là gì?', options: ['Quên chủ ngữ A', 'Thêm 很 trước tính từ', 'Bỏ chữ 比', 'Dùng sai chữ Hán cho B'], correctIndex: 1, explanation: 'Không thêm 很 (rất) trước tính từ trong câu so sánh dùng 比 — 很 chỉ dùng khi không so sánh.' },
]);

const c3 = doc('cic102-3-1-health-clinic', 'Chapter 3 - Health, illness and seeing a doctor|||Chương 3 - Sức khoẻ, bệnh tật và khám bệnh',
  'Từ vựng triệu chứng & khám bệnh; cấu trúc 又...又..., 得 (phải), 一...就...; hội thoại tại phòng khám.',
  [[
    `<span class="eyebrow">CIC102 · Chapter 3 · Lesson 3.1</span>
<h2>Health, illness &amp; seeing a doctor</h2>
<h3>Vocabulary</h3>
<pre><code>身体    shēntǐ       body, health
生病    shēngbìng    to get sick
感冒    gǎnmào       to catch a cold
发烧    fāshāo       to have a fever
咳嗽    késou        to cough
头疼    tóuténg      headache
肚子疼   dùziténg     stomachache
医院    yīyuàn       hospital
医生    yīshēng      doctor
检查    jiǎnchá      to examine
打针    dǎzhēn       to get an injection
吃药    chīyào       to take medicine
休息    xiūxi        to rest
</code></pre>
<h3>Grammar 1 — 又...又... (both...and...)</h3>
<pre><code>我又发烧又咳嗽。
Wǒ yòu fāshāo yòu késou.
I have a fever and a cough (both at once).
</code></pre>
<h3>Grammar 2 — 得 (děi): must, have to</h3>
<pre><code>你得去医院看病。
Nǐ děi qù yīyuàn kànbìng.
You must go to the hospital to see a doctor.
</code></pre>
<h3>Grammar 3 — 一...就... (as soon as...then...)</h3>
<pre><code>我一吃药就好多了。
Wǒ yī chīyào jiù hǎo duō le.
As soon as I took the medicine, I felt much better.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 你怎么了?脸色不太好。
   Nǐ zěnme le? Liǎnsè bú tài hǎo.
   What is wrong? You do not look well.
B: 我头疼,还有点儿发烧。
   Wǒ tóuténg, hái yǒudiǎnr fāshāo.
   I have a headache, and a bit of a fever too.
A: 你得去医院检查一下,别硬撑着。
   Nǐ děi qù yīyuàn jiǎnchá yíxià, bié yìngchēngzhe.
   You should go get checked at the hospital, do not push through it.
B: 好吧,医生说我感冒了,让我多喝水、多休息。
   Hǎo ba, yīshēng shuō wǒ gǎnmào le, ràng wǒ duō hē shuǐ, duō xiūxi.
   OK, the doctor said I have a cold and told me to drink more water and rest more.
</code></pre>
<div class="callout"><span class="badge">Body + symptom</span> Most symptom words follow "body part + adjective/verb": 头疼 (head-hurt), 肚子疼 (belly-hurt) — very productive pattern, easy to reuse.</div>`,
    `<span class="eyebrow">CIC102 · Chương 3 · Bài 3.1</span>
<h2>Sức khoẻ, bệnh tật &amp; khám bệnh</h2>
<h3>Từ vựng</h3>
<pre><code>身体    shēntǐ       cơ thể, sức khoẻ
生病    shēngbìng    bị bệnh
感冒    gǎnmào       cảm cúm
发烧    fāshāo       sốt
咳嗽    késou        ho
头疼    tóuténg      đau đầu
肚子疼   dùziténg     đau bụng
医院    yīyuàn       bệnh viện
医生    yīshēng      bác sĩ
检查    jiǎnchá      kiểm tra, khám
打针    dǎzhēn       tiêm
吃药    chīyào       uống thuốc
休息    xiūxi        nghỉ ngơi
</code></pre>
<h3>Ngữ pháp 1 — 又...又... (vừa...vừa...)</h3>
<pre><code>我又发烧又咳嗽。
Wǒ yòu fāshāo yòu késou.
Tôi vừa sốt vừa ho.
</code></pre>
<h3>Ngữ pháp 2 — 得 (děi): phải</h3>
<pre><code>你得去医院看病。
Nǐ děi qù yīyuàn kànbìng.
Bạn phải đi bệnh viện khám bệnh.
</code></pre>
<h3>Ngữ pháp 3 — 一...就... (vừa...thì...ngay)</h3>
<pre><code>我一吃药就好多了。
Wǒ yī chīyào jiù hǎo duō le.
Tôi vừa uống thuốc là khoẻ hơn nhiều.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 你怎么了?脸色不太好。
   Nǐ zěnme le? Liǎnsè bú tài hǎo.
   Bạn sao vậy? Sắc mặt không tốt lắm.
B: 我头疼,还有点儿发烧。
   Wǒ tóuténg, hái yǒudiǎnr fāshāo.
   Tôi đau đầu, còn hơi sốt nữa.
A: 你得去医院检查一下,别硬撑着。
   Nǐ děi qù yīyuàn jiǎnchá yíxià, bié yìngchēngzhe.
   Bạn phải đi bệnh viện kiểm tra, đừng cố chịu đựng.
B: 好吧,医生说我感冒了,让我多喝水、多休息。
   Hǎo ba, yīshēng shuō wǒ gǎnmào le, ràng wǒ duō hē shuǐ, duō xiūxi.
   Được rồi, bác sĩ nói tôi bị cảm, bảo tôi uống nhiều nước, nghỉ ngơi nhiều.
</code></pre>
<div class="callout"><span class="badge">Bộ phận + triệu chứng</span> Đa số từ triệu chứng theo mẫu "bộ phận cơ thể + tính từ/động từ": 头疼 (đầu-đau), 肚子疼 (bụng-đau) — mẫu rất dễ dùng lại.</div>`,
  ]]);

const c3q = quiz('cic102-quiz-3', 'Quiz 3 - Health and clinic|||Quiz 3 - Sức khoẻ và khám bệnh', [
  { id: 'q1', question: 'Câu 我又发烧又咳嗽 (Wǒ yòu fāshāo yòu késou) nghĩa là gì?', options: ['Tôi chỉ sốt, không ho', 'Tôi vừa sốt vừa ho', 'Tôi hết sốt rồi', 'Tôi chưa từng ho'], correctIndex: 1, explanation: '又...又... nối hai trạng thái xảy ra cùng lúc: vừa sốt vừa ho.' },
  { id: 'q2', question: '得 (děi) trong câu 你得去医院 nghĩa là gì?', options: ['Được', 'Phải, cần phải', 'Có thể', 'Không cần'], correctIndex: 1, explanation: '得 (děi) đứng trước động từ diễn tả nghĩa vụ "phải làm gì".' },
  { id: 'q3', question: 'Cấu trúc 一...就... trong 我一吃药就好多了 diễn tả điều gì?', options: ['Hai việc không liên quan', 'Việc B xảy ra ngay sau việc A', 'Việc A không bao giờ xảy ra', 'So sánh hai sự vật'], correctIndex: 1, explanation: '一...就... nghĩa là "vừa...là...ngay" — B xảy ra ngay sau khi A xảy ra.' },
]);

const c4 = doc('cic102-4-1-work-study-plans', 'Chapter 4 - Work, study and future plans|||Chương 4 - Công việc, học tập và kế hoạch tương lai',
  'Từ vựng nghề nghiệp & tốt nghiệp; cấu trúc 打算 (dự định), 为了 (để), 越...越... (càng...càng); hội thoại phỏng vấn.',
  [[
    `<span class="eyebrow">CIC102 · Chapter 4 · Lesson 4.1</span>
<h2>Work, study &amp; future plans</h2>
<h3>Vocabulary</h3>
<pre><code>工作    gōngzuò    work, job
专业    zhuānyè    major (field of study)
毕业    bìyè       to graduate
找工作   zhǎo gōngzuò   to look for a job
面试    miànshì    interview
经验    jīngyàn    experience
打算    dǎsuàn     to plan
将来    jiānglái   in the future
目标    mùbiāo     goal
努力    nǔlì       to work hard
机会    jīhuì      opportunity
提高    tígāo      to improve
</code></pre>
<h3>Grammar 1 — 打算 + verb (to plan to...)</h3>
<pre><code>我打算明年去中国留学。
Wǒ dǎsuàn míngnián qù Zhōngguó liúxué.
I plan to study abroad in China next year.
</code></pre>
<h3>Grammar 2 — 为了 + goal, ... (in order to...)</h3>
<pre><code>为了找到好工作,他每天都努力学习。
Wèile zhǎodào hǎo gōngzuò, tā měitiān dōu nǔlì xuéxí.
In order to find a good job, he studies hard every day.
</code></pre>
<h3>Grammar 3 — 越...越... (the more...the more...)</h3>
<pre><code>越努力,机会越多。
Yuè nǔlì, jīhuì yuè duō.
The harder you work, the more opportunities you have.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 你快毕业了,以后有什么打算?
   Nǐ kuài bìyè le, yǐhòu yǒu shénme dǎsuàn?
   You are about to graduate, what are your plans afterwards?
B: 我打算先找工作,积累一些经验。
   Wǒ dǎsuàn xiān zhǎo gōngzuò, jīlěi yìxiē jīngyàn.
   I plan to find a job first and gain some experience.
A: 你下周不是要去面试吗?祝你顺利!
   Nǐ xiàzhōu bú shì yào qù miànshì ma? Zhù nǐ shùnlì!
   Are not you going to an interview next week? Good luck!
</code></pre>
<div class="callout"><span class="badge">打算 vs 决定</span> <code>打算</code> (dǎsuàn) = a plan/intention, still flexible. <code>决定</code> (juédìng) from Chapter 1 = a firm decision already made.</div>`,
    `<span class="eyebrow">CIC102 · Chương 4 · Bài 4.1</span>
<h2>Công việc, học tập &amp; kế hoạch tương lai</h2>
<h3>Từ vựng</h3>
<pre><code>工作    gōngzuò    công việc
专业    zhuānyè    chuyên ngành
毕业    bìyè       tốt nghiệp
找工作   zhǎo gōngzuò   tìm việc
面试    miànshì    phỏng vấn
经验    jīngyàn    kinh nghiệm
打算    dǎsuàn     dự định
将来    jiānglái   tương lai
目标    mùbiāo     mục tiêu
努力    nǔlì       nỗ lực
机会    jīhuì      cơ hội
提高    tígāo      nâng cao
</code></pre>
<h3>Ngữ pháp 1 — 打算 + động từ (dự định làm gì)</h3>
<pre><code>我打算明年去中国留学。
Wǒ dǎsuàn míngnián qù Zhōngguó liúxué.
Tôi dự định sang năm đi du học Trung Quốc.
</code></pre>
<h3>Ngữ pháp 2 — 为了 + mục đích, ... (để...)</h3>
<pre><code>为了找到好工作,他每天都努力学习。
Wèile zhǎodào hǎo gōngzuò, tā měitiān dōu nǔlì xuéxí.
Để tìm được công việc tốt, cậu ấy ngày nào cũng học tập chăm chỉ.
</code></pre>
<h3>Ngữ pháp 3 — 越...越... (càng...càng...)</h3>
<pre><code>越努力,机会越多。
Yuè nǔlì, jīhuì yuè duō.
Càng nỗ lực, cơ hội càng nhiều.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 你快毕业了,以后有什么打算?
   Nǐ kuài bìyè le, yǐhòu yǒu shénme dǎsuàn?
   Bạn sắp tốt nghiệp rồi, sau này có dự định gì?
B: 我打算先找工作,积累一些经验。
   Wǒ dǎsuàn xiān zhǎo gōngzuò, jīlěi yìxiē jīngyàn.
   Tôi dự định trước tiên tìm việc, tích luỹ chút kinh nghiệm.
A: 你下周不是要去面试吗?祝你顺利!
   Nǐ xiàzhōu bú shì yào qù miànshì ma? Zhù nǐ shùnlì!
   Tuần sau bạn chẳng phải đi phỏng vấn à? Chúc bạn thuận lợi!
</code></pre>
<div class="callout"><span class="badge">打算 khác 决定</span> <code>打算</code> (dǎsuàn) = một dự định, còn linh hoạt. <code>决定</code> (juédìng) ở Chương 1 = một quyết định đã chốt chắc chắn.</div>`,
  ]]);

const c4q = quiz('cic102-quiz-4', 'Quiz 4 - Work and future plans|||Quiz 4 - Công việc và kế hoạch tương lai', [
  { id: 'q1', question: 'Câu 我打算明年去中国留学 nghĩa là gì?', options: ['Tôi đã đi du học Trung Quốc', 'Tôi dự định sang năm đi du học Trung Quốc', 'Tôi không muốn đi du học', 'Tôi đã tốt nghiệp'], correctIndex: 1, explanation: '打算 + động từ diễn tả một dự định cho tương lai.' },
  { id: 'q2', question: 'Cấu trúc 为了...+ mệnh đề dùng để diễn tả điều gì?', options: ['Kết quả', 'Mục đích (để làm gì)', 'So sánh', 'Thời gian quá khứ'], correctIndex: 1, explanation: '为了 + mục đích, mệnh đề sau nêu hành động thực hiện để đạt mục đích đó.' },
  { id: 'q3', question: 'Trong câu 越努力,机会越多, ý nghĩa đúng là gì?', options: ['Nỗ lực và cơ hội không liên quan', 'Càng nỗ lực thì cơ hội càng nhiều', 'Nỗ lực làm giảm cơ hội', 'Chỉ cần nỗ lực một lần là đủ'], correctIndex: 1, explanation: '越...越... diễn tả quan hệ tỉ lệ thuận: A tăng thì B cũng tăng theo.' },
]);

const c5 = doc('cic102-5-1-travel-booking-airport', 'Chapter 5 - Travel, booking and the airport|||Chương 5 - Du lịch, đặt phòng và sân bay',
  'Từ vựng hộ chiếu, vé, hành lý, chuyến bay; cấu trúc 是...的 (nhấn mạnh cách thức), 先...然后..., 要是...就...; hội thoại đặt phòng.',
  [[
    `<span class="eyebrow">CIC102 · Chapter 5 · Lesson 5.1</span>
<h2>Travel, booking &amp; the airport</h2>
<h3>Vocabulary</h3>
<pre><code>旅游    lǚyóu      to travel
护照    hùzhào     passport
签证    qiānzhèng  visa
机票    jīpiào     air ticket
订     dìng       to book, to reserve
房间    fángjiān   room
行李    xíngli     luggage
登机    dēngjī     to board a plane
航班    hángbān    flight
出发    chūfā      to depart
到达    dàodá      to arrive
导游    dǎoyóu     tour guide
</code></pre>
<h3>Grammar 1 — 是...的 (emphasizing how/when/where)</h3>
<p>Used for a completed past action when you want to emphasize the manner, time or place — not whether it happened.</p>
<pre><code>我是坐飞机来的。
Wǒ shì zuò fēijī lái de.
I came by plane. (emphasizing HOW I came)
</code></pre>
<h3>Grammar 2 — 先...然后... (first...then...)</h3>
<pre><code>我们先办登机手续,然后去买点儿东西。
Wǒmen xiān bàn dēngjī shǒuxù, ránhòu qù mǎi diǎnr dōngxi.
Let us check in first, then go buy some things.
</code></pre>
<h3>Grammar 3 — 要是...就... (if...then...)</h3>
<pre><code>要是航班延误,我们就得改签。
Yàoshi hángbān yánwù, wǒmen jiù děi gǎiqiān.
If the flight is delayed, we will have to rebook.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 你好,我想订一个房间,三个晚上。
   Nǐ hǎo, wǒ xiǎng dìng yí ge fángjiān, sān ge wǎnshang.
   Hello, I would like to book a room for three nights.
B: 好的,请问您带护照了吗?
   Hǎo de, qǐngwèn nín dài hùzhào le ma?
   Sure, do you have your passport with you?
A: 带了。飞机几点到达机场?
   Dài le. Fēijī jǐ diǎn dàodá jīchǎng?
   Yes. What time does the flight arrive at the airport?
B: 航班八点出发,大概两个小时后到达。
   Hángbān bā diǎn chūfā, dàgài liǎng ge xiǎoshí hòu dàodá.
   The flight departs at 8, and arrives about two hours later.
</code></pre>
<div class="callout"><span class="badge">是...的 vs 了</span> Both mark the past, but <code>是...的</code> highlights HOW/WHEN/WHERE something already-known happened; <code>了</code> simply reports that it happened.</div>`,
    `<span class="eyebrow">CIC102 · Chương 5 · Bài 5.1</span>
<h2>Du lịch, đặt phòng &amp; sân bay</h2>
<h3>Từ vựng</h3>
<pre><code>旅游    lǚyóu      du lịch
护照    hùzhào     hộ chiếu
签证    qiānzhèng  visa
机票    jīpiào     vé máy bay
订     dìng       đặt (phòng/vé)
房间    fángjiān   phòng
行李    xíngli     hành lý
登机    dēngjī     lên máy bay
航班    hángbān    chuyến bay
出发    chūfā      xuất phát, khởi hành
到达    dàodá      đến nơi
导游    dǎoyóu     hướng dẫn viên
</code></pre>
<h3>Ngữ pháp 1 — 是...的 (nhấn mạnh cách thức/thời gian/địa điểm)</h3>
<p>Dùng cho hành động đã hoàn thành trong quá khứ khi muốn nhấn mạnh cách thức, thời điểm hay địa điểm — không phải việc có xảy ra hay không.</p>
<pre><code>我是坐飞机来的。
Wǒ shì zuò fēijī lái de.
Tôi đến bằng máy bay. (nhấn mạnh CÁCH đến)
</code></pre>
<h3>Ngữ pháp 2 — 先...然后... (trước tiên...sau đó...)</h3>
<pre><code>我们先办登机手续,然后去买点儿东西。
Wǒmen xiān bàn dēngjī shǒuxù, ránhòu qù mǎi diǎnr dōngxi.
Chúng ta làm thủ tục lên máy bay trước, sau đó đi mua chút đồ.
</code></pre>
<h3>Ngữ pháp 3 — 要是...就... (nếu...thì...)</h3>
<pre><code>要是航班延误,我们就得改签。
Yàoshi hángbān yánwù, wǒmen jiù děi gǎiqiān.
Nếu chuyến bay bị trễ, chúng ta phải đổi vé.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 你好,我想订一个房间,三个晚上。
   Nǐ hǎo, wǒ xiǎng dìng yí ge fángjiān, sān ge wǎnshang.
   Xin chào, tôi muốn đặt một phòng, ba đêm.
B: 好的,请问您带护照了吗?
   Hǎo de, qǐngwèn nín dài hùzhào le ma?
   Được ạ, xin hỏi anh/chị mang hộ chiếu chưa?
A: 带了。飞机几点到达机场?
   Dài le. Fēijī jǐ diǎn dàodá jīchǎng?
   Mang rồi. Mấy giờ máy bay đến sân bay?
B: 航班八点出发,大概两个小时后到达。
   Hángbān bā diǎn chūfā, dàgài liǎng ge xiǎoshí hòu dàodá.
   Chuyến bay khởi hành lúc 8 giờ, khoảng 2 tiếng sau thì đến.
</code></pre>
<div class="callout"><span class="badge">是...的 khác 了</span> Cả hai đều nói về quá khứ, nhưng <code>是...的</code> nhấn mạnh CÁCH/THỜI ĐIỂM/NƠI CHỐN của việc đã biết là đã xảy ra; <code>了</code> chỉ đơn thuần báo việc đó đã xảy ra.</div>`,
  ]]);

const c5q = quiz('cic102-quiz-5', 'Quiz 5 - Travel and airport|||Quiz 5 - Du lịch và sân bay', [
  { id: 'q1', question: 'Câu 我是坐飞机来的 nhấn mạnh điều gì?', options: ['Việc đến có xảy ra hay không', 'Cách thức đến (bằng máy bay)', 'Thời gian trong tương lai', 'Ai là người đến'], correctIndex: 1, explanation: '是...的 nhấn mạnh cách thức/thời gian/nơi chốn của một việc đã biết là đã xảy ra.' },
  { id: 'q2', question: '先...然后... trong câu 我们先办登机手续,然后去买点儿东西 diễn tả điều gì?', options: ['Hai việc xảy ra cùng lúc', 'Thứ tự trước - sau của hai việc', 'So sánh hai việc', 'Điều kiện - kết quả'], correctIndex: 1, explanation: '先...然后... nêu trình tự: việc A làm trước, việc B làm sau.' },
  { id: 'q3', question: 'Câu 要是航班延误,我们就得改签 nghĩa là gì?', options: ['Chuyến bay chắc chắn trễ', 'Nếu chuyến bay trễ thì phải đổi vé', 'Chuyến bay không bao giờ trễ', 'Chúng tôi đã đổi vé rồi'], correctIndex: 1, explanation: '要是...就... là cấu trúc điều kiện: nếu A xảy ra thì B là kết quả/hành động cần làm.' },
]);

const c6 = doc('cic102-6-1-feelings-suggestions', 'Chapter 6 - Feelings, opinions and suggestions (potential complements, ba-sentence)|||Chương 6 - Cảm xúc, ý kiến và đề nghị (bổ ngữ khả năng, câu chữ 把)',
  'Từ vựng cảm xúc & ý kiến; bổ ngữ khả năng (V得/不+bổ ngữ), câu chữ 把 (xử lý tân ngữ), 建议 + đề nghị.',
  [[
    `<span class="eyebrow">CIC102 · Chapter 6 · Lesson 6.1</span>
<h2>Feelings, opinions &amp; suggestions</h2>
<h3>Vocabulary</h3>
<pre><code>高兴    gāoxìng   happy
难过    nánguò    sad
紧张    jǐnzhāng  nervous
担心    dānxīn    to worry
意见    yìjiàn    opinion
建议    jiànyì    suggestion
同意    tóngyì    to agree
反对    fǎnduì    to oppose
满意    mǎnyì     satisfied
生气    shēngqì   angry
</code></pre>
<h3>Grammar 1 — potential complement (V 得/不 + complement)</h3>
<p>Insert <code>得</code> (can) or <code>不</code> (cannot) between the verb and its result complement to say whether the result is achievable.</p>
<pre><code>这个字太小了,我看不清楚。
Zhège zì tài xiǎo le, wǒ kàn bu qīngchu.
This character is too small, I cannot see it clearly.

听得懂 tīng de dǒng (can understand by listening) / 听不懂 tīng bu dǒng (cannot understand)
</code></pre>
<h3>Grammar 2 — 把-sentence (S + 把 + O + V + complement)</h3>
<p>Used to emphasize what happens TO an object — moving it, changing it, or disposing of it.</p>
<pre><code>请把窗户打开。
Qǐng bǎ chuānghu dǎkāi.
Please open the window.

我把作业做完了。
Wǒ bǎ zuòyè zuò wán le.
I finished the homework.
</code></pre>
<h3>Grammar 3 — 建议 + (person) + verb</h3>
<pre><code>我建议你多休息。
Wǒ jiànyì nǐ duō xiūxi.
I suggest you rest more.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 你别紧张,把你的想法说出来就行了。
   Nǐ bié jǐnzhāng, bǎ nǐ de xiǎngfǎ shuō chūlái jiù xíng le.
   Do not be nervous, just say your thoughts out loud.
B: 好,我同意你的建议,不过我有点儿担心时间不够。
   Hǎo, wǒ tóngyì nǐ de jiànyì, búguò wǒ yǒudiǎnr dānxīn shíjiān bú gòu.
   OK, I agree with your suggestion, but I am a bit worried there is not enough time.
A: 别担心,我们把计划提前做好就够了。
   Bié dānxīn, wǒmen bǎ jìhuà tíqián zuò hǎo jiù gòu le.
   Do not worry, it is enough that we prepare the plan in advance.
</code></pre>
<div class="callout"><span class="badge">把-sentence rule</span> The object after <code>把</code> must be something specific/known, and the verb ALWAYS needs something after it (a complement, 了, or a second verb) — <code>把作业做</code> alone is incomplete.</div>`,
    `<span class="eyebrow">CIC102 · Chương 6 · Bài 6.1</span>
<h2>Cảm xúc, ý kiến &amp; đề nghị</h2>
<h3>Từ vựng</h3>
<pre><code>高兴    gāoxìng   vui
难过    nánguò    buồn
紧张    jǐnzhāng  căng thẳng
担心    dānxīn    lo lắng
意见    yìjiàn    ý kiến
建议    jiànyì    đề nghị
同意    tóngyì    đồng ý
反对    fǎnduì    phản đối
满意    mǎnyì     hài lòng
生气    shēngqì   tức giận
</code></pre>
<h3>Ngữ pháp 1 — bổ ngữ khả năng (V 得/不 + bổ ngữ)</h3>
<p>Chèn <code>得</code> (có thể) hoặc <code>不</code> (không thể) giữa động từ và bổ ngữ kết quả để nói kết quả đó có đạt được hay không.</p>
<pre><code>这个字太小了,我看不清楚。
Zhège zì tài xiǎo le, wǒ kàn bu qīngchu.
Chữ này quá nhỏ, tôi nhìn không rõ.

听得懂 tīng de dǒng (nghe hiểu được) / 听不懂 tīng bu dǒng (nghe không hiểu)
</code></pre>
<h3>Ngữ pháp 2 — câu chữ 把 (S + 把 + O + V + bổ ngữ)</h3>
<p>Dùng để nhấn mạnh điều xảy ra VỚI một tân ngữ — di chuyển, thay đổi, hoặc xử lý xong nó.</p>
<pre><code>请把窗户打开。
Qǐng bǎ chuānghu dǎkāi.
Xin hãy mở cửa sổ ra.

我把作业做完了。
Wǒ bǎ zuòyè zuò wán le.
Tôi đã làm xong bài tập rồi.
</code></pre>
<h3>Ngữ pháp 3 — 建议 + (người) + động từ</h3>
<pre><code>我建议你多休息。
Wǒ jiànyì nǐ duō xiūxi.
Tôi đề nghị bạn nghỉ ngơi nhiều.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 你别紧张,把你的想法说出来就行了。
   Nǐ bié jǐnzhāng, bǎ nǐ de xiǎngfǎ shuō chūlái jiù xíng le.
   Đừng căng thẳng, cứ nói ý nghĩ của bạn ra là được.
B: 好,我同意你的建议,不过我有点儿担心时间不够。
   Hǎo, wǒ tóngyì nǐ de jiànyì, búguò wǒ yǒudiǎnr dānxīn shíjiān bú gòu.
   Được, tôi đồng ý với đề nghị của bạn, nhưng tôi hơi lo thời gian không đủ.
A: 别担心,我们把计划提前做好就够了。
   Bié dānxīn, wǒmen bǎ jìhuà tíqián zuò hǎo jiù gòu le.
   Đừng lo, chúng ta chuẩn bị kế hoạch trước là đủ rồi.
</code></pre>
<div class="callout"><span class="badge">Quy tắc câu chữ 把</span> Tân ngữ sau <code>把</code> phải là thứ cụ thể/đã biết, và động từ LUÔN cần có gì đó theo sau (bổ ngữ, 了, hoặc động từ thứ hai) — chỉ nói <code>把作业做</code> là chưa trọn câu.</div>`,
  ]]);

const c6q = quiz('cic102-quiz-6', 'Quiz 6 - Feelings and suggestions|||Quiz 6 - Cảm xúc và đề nghị', [
  { id: 'q1', question: 'Câu 我看不清楚 (Wǒ kàn bu qīngchu) dùng cấu trúc gì?', options: ['Câu chữ 把', 'Bổ ngữ khả năng (V不+bổ ngữ)', 'So sánh 比', 'Trợ từ 过'], correctIndex: 1, explanation: 'Chèn 不 giữa 看 và 清楚 tạo bổ ngữ khả năng phủ định: "nhìn không rõ".' },
  { id: 'q2', question: 'Trong câu chữ 把 (我把作业做完了), thành phần nào bắt buộc phải có sau động từ?', options: ['Không cần gì thêm', 'Một bổ ngữ, 了, hoặc động từ thứ hai', 'Chỉ cần chủ ngữ', 'Chỉ cần 吗'], correctIndex: 1, explanation: 'Câu chữ 把 luôn cần thành phần theo sau động từ (bổ ngữ/了/động từ khác) để câu trọn nghĩa.' },
  { id: 'q3', question: 'Câu 我建议你多休息 nghĩa là gì?', options: ['Tôi phản đối bạn nghỉ ngơi', 'Tôi đề nghị bạn nghỉ ngơi nhiều hơn', 'Tôi lo lắng cho bạn', 'Tôi đồng ý với bạn'], correctIndex: 1, explanation: '建议 + người + động từ là cấu trúc đưa ra lời đề nghị/khuyên nhủ.' },
]);

const c7 = doc('cic102-7-1-phone-appointments-social', 'Chapter 7 - Phone calls, appointments and social chat|||Chương 7 - Điện thoại, hẹn và giao tiếp xã hội',
  'Từ vựng gọi điện & hẹn gặp; cấu trúc 正在...呢 (đang), 要不 (hay là), 万一 (lỡ như); hội thoại điện thoại.',
  [[
    `<span class="eyebrow">CIC102 · Chapter 7 · Lesson 7.1</span>
<h2>Phone calls, appointments &amp; social chat</h2>
<h3>Vocabulary</h3>
<pre><code>打电话   dǎ diànhuà   to make a phone call
手机号   shǒujī hào   mobile number
留言    liúyán       to leave a message
约     yuē          to make an appointment
见面    jiànmiàn     to meet
迟到    chídào       to be late
提前    tíqián       in advance
改天    gǎitiān      another day
联系    liánxì       to contact
回复    huífù        to reply
</code></pre>
<h3>Grammar 1 — 正在...呢 (right now, in progress)</h3>
<pre><code>我正在开会呢,一会儿给你回电话。
Wǒ zhèngzài kāihuì ne, yíhuìr gěi nǐ huí diànhuà.
I am in a meeting right now, I will call you back in a bit.
</code></pre>
<h3>Grammar 2 — 要不 (how about, or else)</h3>
<pre><code>要不我们改天再约吧。
Yàobù wǒmen gǎitiān zài yuē ba.
How about we make an appointment another day.
</code></pre>
<h3>Grammar 3 — 万一 (in case, what if)</h3>
<pre><code>万一你迟到了,记得提前打电话告诉我。
Wànyī nǐ chídào le, jìde tíqián dǎ diànhuà gàosu wǒ.
In case you are late, remember to call me in advance to let me know.
</code></pre>
<h3>Dialogue</h3>
<pre><code>A: 喂,你好,请问王老师在吗?
   Wéi, nǐ hǎo, qǐngwèn Wáng lǎoshī zài ma?
   Hello, is Teacher Wang there?
B: 他现在不在,你要留言吗?
   Tā xiànzài bú zài, nǐ yào liúyán ma?
   He is not here right now, would you like to leave a message?
A: 好的,麻烦告诉他明天的见面时间改到下午三点。
   Hǎo de, máfan gàosu tā míngtiān de jiànmiàn shíjiān gǎi dào xiàwǔ sān diǎn.
   OK, please tell him tomorrow's meeting time has been changed to 3pm.
</code></pre>
<div class="callout"><span class="badge">喂 (wéi)</span> Only used to answer the PHONE — never as a face-to-face greeting. Face-to-face still uses 你好.</div>`,
    `<span class="eyebrow">CIC102 · Chương 7 · Bài 7.1</span>
<h2>Điện thoại, hẹn &amp; giao tiếp xã hội</h2>
<h3>Từ vựng</h3>
<pre><code>打电话   dǎ diànhuà   gọi điện
手机号   shǒujī hào   số điện thoại di động
留言    liúyán       để lại lời nhắn
约     yuē          hẹn
见面    jiànmiàn     gặp mặt
迟到    chídào       đến muộn
提前    tíqián       trước thời hạn
改天    gǎitiān      hôm khác
联系    liánxì       liên lạc
回复    huífù        trả lời, hồi âm
</code></pre>
<h3>Ngữ pháp 1 — 正在...呢 (đang, ngay lúc này)</h3>
<pre><code>我正在开会呢,一会儿给你回电话。
Wǒ zhèngzài kāihuì ne, yíhuìr gěi nǐ huí diànhuà.
Tôi đang họp, lát nữa gọi lại cho bạn.
</code></pre>
<h3>Ngữ pháp 2 — 要不 (hay là, không thì)</h3>
<pre><code>要不我们改天再约吧。
Yàobù wǒmen gǎitiān zài yuē ba.
Hay là chúng ta hẹn hôm khác vậy.
</code></pre>
<h3>Ngữ pháp 3 — 万一 (lỡ như, nhỡ đâu)</h3>
<pre><code>万一你迟到了,记得提前打电话告诉我。
Wànyī nǐ chídào le, jìde tíqián dǎ diànhuà gàosu wǒ.
Lỡ như bạn đến muộn, nhớ gọi điện báo trước cho tôi.
</code></pre>
<h3>Hội thoại</h3>
<pre><code>A: 喂,你好,请问王老师在吗?
   Wéi, nǐ hǎo, qǐngwèn Wáng lǎoshī zài ma?
   Alo, xin chào, cho hỏi thầy Vương có ở đó không?
B: 他现在不在,你要留言吗?
   Tā xiànzài bú zài, nǐ yào liúyán ma?
   Thầy hiện không có ở đây, bạn muốn để lại lời nhắn không?
A: 好的,麻烦告诉他明天的见面时间改到下午三点。
   Hǎo de, máfan gàosu tā míngtiān de jiànmiàn shíjiān gǎi dào xiàwǔ sān diǎn.
   Được, phiền anh/chị nói với thầy giờ gặp mặt ngày mai đổi sang 3 giờ chiều.
</code></pre>
<div class="callout"><span class="badge">喂 (wéi)</span> Chỉ dùng khi NGHE ĐIỆN THOẠI — không dùng để chào mặt đối mặt. Gặp trực tiếp vẫn dùng 你好.</div>`,
  ]]);

const c7q = quiz('cic102-quiz-7', 'Quiz 7 - Phone calls and social chat|||Quiz 7 - Điện thoại và giao tiếp', [
  { id: 'q1', question: 'Chữ 喂 (wéi) thường dùng khi nào?', options: ['Chào mặt đối mặt', 'Trả lời điện thoại', 'Tạm biệt', 'Xin lỗi'], correctIndex: 1, explanation: '喂 chỉ dùng để bắt máy/gọi điện thoại, không dùng khi gặp trực tiếp.' },
  { id: 'q2', question: 'Câu 我正在开会呢 nghĩa là gì?', options: ['Tôi sắp họp', 'Tôi đang họp (ngay lúc này)', 'Tôi đã họp xong', 'Tôi không muốn họp'], correctIndex: 1, explanation: '正在...呢 diễn tả một hành động đang diễn ra ngay tại thời điểm nói.' },
  { id: 'q3', question: 'Từ 万一 (wànyī) trong câu 万一你迟到了,记得打电话告诉我 mang nghĩa gì?', options: ['Chắc chắn', 'Lỡ như, phòng trường hợp', 'Không bao giờ', 'Ngay lập tức'], correctIndex: 1, explanation: '万一 giới thiệu một tình huống giả định không mong muốn, giống "lỡ như/nhỡ đâu".' },
]);

const c8 = doc('cic102-8-1-hsk3-review-complex-sentences', 'Chapter 8 - HSK3 review: complex sentences|||Chương 8 - Ôn tập HSK3: câu phức',
  'Ôn tập liên từ ghép câu phức: 因为...所以..., 虽然...但是..., 不但...而且..., 如果...就..., 只要...就..., 不管...都...',
  [[
    `<span class="eyebrow">CIC102 · Chapter 8 · Lesson 8.1</span>
<h2>HSK 3 review: complex sentences</h2>
<h3>Vocabulary</h3>
<pre><code>复习    fùxí     to review
考试    kǎoshì   exam
复杂    fùzá     complex
总结    zǒngjié  to summarize
</code></pre>
<h3>Six paired connectors</h3>
<pre><code>因为...所以...  yīnwèi...suǒyǐ...   because...so...
虽然...但是...  suīrán...dànshì...  although...but...
不但...而且...  búdàn...érqiě...    not only...but also...
如果...就...   rúguǒ...jiù...      if...then...
只要...就...   zhǐyào...jiù...     as long as...then...
不管...都...   bùguǎn...dōu...     no matter what...still...
</code></pre>
<h3>Examples</h3>
<pre><code>因为下雨,所以我们没去公园。
Yīnwèi xiàyǔ, suǒyǐ wǒmen méi qù gōngyuán.
Because it rained, we did not go to the park.

虽然汉语很难,但是我很喜欢学。
Suīrán Hànyǔ hěn nán, dànshì wǒ hěn xǐhuan xué.
Although Chinese is hard, I really like learning it.

他不但会说汉语,而且写得也不错。
Tā búdàn huì shuō Hànyǔ, érqiě xiě de yě búcuò.
He can not only speak Chinese but also writes pretty well.

只要你努力,就一定能通过HSK3考试。
Zhǐyào nǐ nǔlì, jiù yídìng néng tōngguò HSK sān kǎoshì.
As long as you work hard, you will definitely pass the HSK 3 exam.

不管天气怎么样,我们都要去。
Bùguǎn tiānqì zěnmeyàng, wǒmen dōu yào qù.
No matter what the weather is like, we are going.
</code></pre>
<h3>Putting it together</h3>
<pre><code>虽然我以前没学过汉语,但是因为我每天都练习,
所以现在不但能听得懂,而且能说得比较流利了。
只要坚持下去,不管多难,你都能提高。

Suīrán wǒ yǐqián méi xuéguo Hànyǔ, dànshì yīnwèi wǒ měitiān dōu liànxí,
suǒyǐ xiànzài búdàn néng tīng de dǒng, érqiě néng shuō de bǐjiào liúlì le.
Zhǐyào jiānchí xiàqù, bùguǎn duō nán, nǐ dōu néng tígāo.

Although I never studied Chinese before, because I practice every day,
now I can not only understand by listening, but also speak fairly fluently.
As long as you keep at it, no matter how hard, you can always improve.
</code></pre>
<div class="callout"><span class="badge">HSK3 exam tip</span> These six connector pairs cover most of the "fill in the blank / reorder the sentence" grammar questions on HSK 3 — memorize the PAIRS, not just one half.</div>`,
    `<span class="eyebrow">CIC102 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập HSK3: câu phức</h2>
<h3>Từ vựng</h3>
<pre><code>复习    fùxí     ôn tập
考试    kǎoshì   kỳ thi
复杂    fùzá     phức tạp
总结    zǒngjié  tổng kết
</code></pre>
<h3>Sáu cặp liên từ</h3>
<pre><code>因为...所以...  yīnwèi...suǒyǐ...   vì...nên...
虽然...但是...  suīrán...dànshì...  mặc dù...nhưng...
不但...而且...  búdàn...érqiě...    không những...mà còn...
如果...就...   rúguǒ...jiù...      nếu...thì...
只要...就...   zhǐyào...jiù...     chỉ cần...thì...
不管...都...   bùguǎn...dōu...     dù...đều...
</code></pre>
<h3>Ví dụ</h3>
<pre><code>因为下雨,所以我们没去公园。
Yīnwèi xiàyǔ, suǒyǐ wǒmen méi qù gōngyuán.
Vì trời mưa nên chúng tôi không đi công viên.

虽然汉语很难,但是我很喜欢学。
Suīrán Hànyǔ hěn nán, dànshì wǒ hěn xǐhuan xué.
Mặc dù tiếng Hán khó nhưng tôi rất thích học.

他不但会说汉语,而且写得也不错。
Tā búdàn huì shuō Hànyǔ, érqiě xiě de yě búcuò.
Cậu ấy không những biết nói tiếng Hán mà viết cũng khá tốt.

只要你努力,就一定能通过HSK3考试。
Zhǐyào nǐ nǔlì, jiù yídìng néng tōngguò HSK sān kǎoshì.
Chỉ cần bạn nỗ lực, chắc chắn sẽ vượt qua kỳ thi HSK3.

不管天气怎么样,我们都要去。
Bùguǎn tiānqì zěnmeyàng, wǒmen dōu yào qù.
Dù thời tiết thế nào, chúng tôi đều phải đi.
</code></pre>
<h3>Ghép lại thành đoạn văn</h3>
<pre><code>虽然我以前没学过汉语,但是因为我每天都练习,
所以现在不但能听得懂,而且能说得比较流利了。
只要坚持下去,不管多难,你都能提高。

Suīrán wǒ yǐqián méi xuéguo Hànyǔ, dànshì yīnwèi wǒ měitiān dōu liànxí,
suǒyǐ xiànzài búdàn néng tīng de dǒng, érqiě néng shuō de bǐjiào liúlì le.
Zhǐyào jiānchí xiàqù, bùguǎn duō nán, nǐ dōu néng tígāo.

Mặc dù trước đây tôi chưa từng học tiếng Hán, nhưng vì ngày nào tôi cũng luyện tập,
nên bây giờ tôi không những nghe hiểu được, mà còn nói khá lưu loát.
Chỉ cần kiên trì, dù khó đến đâu, bạn cũng đều có thể tiến bộ.
</code></pre>
<div class="callout"><span class="badge">Mẹo thi HSK3</span> Sáu cặp liên từ này phủ hầu hết dạng bài "điền chỗ trống / sắp xếp lại câu" ngữ pháp trong HSK3 — học thuộc theo CẶP, đừng chỉ nhớ một nửa.</div>`,
  ]]);

const c8q = quiz('cic102-quiz-8', 'Quiz 8 - HSK3 review|||Quiz 8 - Ôn tập HSK3', [
  { id: 'q1', question: 'Cặp liên từ nào đúng để diễn tả "vì...nên..."?', options: ['虽然...但是...', '因为...所以...', '不但...而且...', '不管...都...'], correctIndex: 1, explanation: '因为 (vì) đi cùng 所以 (nên) để nêu nguyên nhân - kết quả.' },
  { id: 'q2', question: 'Câu 虽然汉语很难,但是我很喜欢学 nghĩa là gì?', options: ['Vì tiếng Hán khó nên tôi không học', 'Mặc dù tiếng Hán khó nhưng tôi rất thích học', 'Tiếng Hán không khó', 'Tôi thích học nhưng tiếng Hán rất khó hiểu'], correctIndex: 1, explanation: '虽然...但是... diễn tả sự tương phản: dù A (khó) nhưng B (vẫn thích) vẫn đúng.' },
  { id: 'q3', question: 'Cặp nào đúng cho nghĩa "chỉ cần...thì chắc chắn..."?', options: ['如果...就...', '只要...就...', '不但...而且...', '因为...所以...'], correctIndex: 1, explanation: '只要...就... nhấn mạnh điều kiện đủ (chỉ cần) để có kết quả chắc chắn xảy ra.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CIC102',
    slug: 'cic102-intensive-chinese-2',
    title: 'Intensive Chinese 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIC102.webp',
    shortDescription: 'Intensive Chinese 2 (HSK 2 to 3): past (le/guo), comparison (bi/geng/zui), health, work & plans, travel & booking, feelings & suggestions (ba-sentence), phone & social chat, HSK3 review. Real Hanzi, toned pinyin, vocab, dialogues, quizzes.|||Tiếng Trung Tổng hợp 2 (HSK2 lên 3): quá khứ (了/过), so sánh (比/更/最), sức khoẻ, công việc & kế hoạch, du lịch & đặt phòng, cảm xúc & đề nghị (把字句), điện thoại & giao tiếp, ôn HSK3. Chữ Hán thật, pinyin có dấu, từ vựng, hội thoại, quiz.',
    description: 'Môn <strong>CIC102 — Intensive Chinese 2</strong> (kỳ 1, ngành Ngôn ngữ Trung) nối tiếp CIC101, nâng trình độ từ <strong>HSK2 lên HSK3</strong>. 8 chương bám <strong>HSK Standard Course 3</strong> (BLCU) và <strong>Integrated Chinese Level 1 Part 2</strong>: kể chuyện quá khứ &amp; trải nghiệm (了/过, bổ ngữ kết quả) → so sánh &amp; mức độ (比/一样/更/最) → sức khoẻ &amp; khám bệnh → công việc, học tập &amp; kế hoạch tương lai → du lịch, đặt phòng &amp; sân bay → cảm xúc, ý kiến &amp; đề nghị (bổ ngữ khả năng, câu chữ 把) → điện thoại, hẹn &amp; giao tiếp xã hội → ôn tập câu phức cho kỳ thi HSK3. Mỗi chương có bảng từ vựng chữ Hán + pinyin có dấu thanh, điểm ngữ pháp, hội thoại và quiz.',
    whatYouLearn: 'Trợ từ 了/过 & bổ ngữ kết quả; câu so sánh 比/一样/更/最 & 越来越; từ vựng & mẫu câu sức khoẻ - khám bệnh; 打算/为了/越...越... khi nói công việc & kế hoạch; 是...的, 先...然后..., 要是...就... khi du lịch & đặt phòng; bổ ngữ khả năng & câu chữ 把 khi bày tỏ ý kiến; 正在...呢, 要不, 万一 khi gọi điện & hẹn gặp; sáu cặp liên từ câu phức (因为/所以, 虽然/但是, 不但/而且, 如果/就, 只要/就, 不管/都) cho HSK3.',
    requirements: 'Đã hoàn thành CIC101 (hoặc tương đương HSK1-2): đọc được pinyin có dấu thanh, khoảng 150-300 chữ Hán cơ bản, câu đơn giản với 是/有/在.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ HSK2 lên HSK3, 8 chủ đề của môn.', lessons: [intro] },
    { title: 'Chương 1 — Quá khứ & trải nghiệm|||Chapter 1 — Past & experience', description: 'Trợ từ 了/过, bổ ngữ kết quả.', lessons: [c1, c1q] },
    { title: 'Chương 2 — So sánh & mức độ|||Chapter 2 — Comparison & degree', description: '比, 一样, 更/最, 越来越.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Sức khoẻ & khám bệnh|||Chapter 3 — Health & clinic', description: 'Triệu chứng, phòng khám, 得/又...又.../一...就...', lessons: [c3, c3q] },
    { title: 'Chương 4 — Công việc & kế hoạch|||Chapter 4 — Work & plans', description: '打算, 为了, 越...越... khi nói nghề nghiệp.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Du lịch & sân bay|||Chapter 5 — Travel & airport', description: '是...的, 先...然后..., 要是...就...', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cảm xúc & đề nghị|||Chapter 6 — Feelings & suggestions', description: 'Bổ ngữ khả năng, câu chữ 把.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Điện thoại & giao tiếp|||Chapter 7 — Phone & social chat', description: '正在...呢, 要不, 万一.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập HSK3|||Chapter 8 — HSK3 review', description: 'Sáu cặp liên từ câu phức.', lessons: [c8, c8q] },
  ],
};
