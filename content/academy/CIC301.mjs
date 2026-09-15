/**
 * CIC301 — Intensive Chinese 3 (Tiếng Trung Tổng hợp 3). Ngành Ngôn ngữ Trung,
 * FPTU, Kỳ 2. Trình độ HSK 3 → HSK 4, tiếp nối CIC102. 8 chương theo giáo
 * trình "HSK Standard Course 4" (北京语言大学出版社) + "Integrated Chinese
 * Level 2": tính cách/ngoại hình, phương pháp học (使/让/把 nâng cao), công
 * việc & phỏng vấn, môi trường & xã hội, văn hoá & phong tục, khoa học công
 * nghệ, cảm xúc & tranh luận (被, 连...都/也), ôn tập HSK4. Chữ Hán UTF-8 +
 * pinyin có dấu thanh + nghĩa Việt/Anh. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick lồng/${; tránh nháy đơn trong chuỗi JS nháy đơn.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

// ---------- Chương 1 — Tính cách & ngoại hình con người ----------
const c1 = doc('cic301-1-1-personality-appearance', '1.1 — Personality & appearance|||1.1 — Tính cách & ngoại hình',
  'Tính từ miêu tả tính cách và ngoại hình; cấu trúc lại...lại... và trong起来/上去.',
  [[
    `<span class="eyebrow">CIC301 · Chapter 1 · Lesson 1.1</span>
<h2>Personality &amp; appearance — 性格与外貌</h2>
<p class="lead">At HSK4 you move beyond simple adjectives (好/坏/高/矮) to describe a person's <strong>character (性格 xìnggé)</strong> and <strong>appearance (外貌 wàimào)</strong> in more nuanced, natural ways.</p>
<h3>Core vocabulary</h3>
<pre><code>汉字        拼音          Nghĩa / Meaning
性格        xìnggé        tính cách / character
外貌        wàimào        ngoại hình / appearance
长相        zhǎngxiàng    diện mạo / looks
幽默        yōumò         hài hước / humorous
诚实        chéngshí      thành thật / honest
骄傲        jiāo ào       kiêu ngạo / proud, arrogant
谦虚        qiānxū        khiêm tốn / modest
活泼        huópō         hoạt bát / lively
外向        wàixiàng      hướng ngoại / extroverted
内向        nèixiàng      hướng nội / introverted
苗条        miáotiao      thon thả / slim
打扮        dǎban         ăn diện, trang điểm / to dress up
</code></pre>
<h3>Grammar: 又...又... (both ... and ...)</h3>
<p>Use <strong>又...又...</strong> to list two qualities at once — much more natural than two separate sentences.</p>
<pre><code>她 又 聪明 又 幽默。
Tā yòu cōngming yòu yōumò.
She is both smart and humorous.
</code></pre>
<h3>Grammar: 看起来 / 看上去 (looks like, seems)</h3>
<p><strong>看起来</strong> and <strong>看上去</strong> both mean "it looks like / seems" — used for a first impression based on appearance.</p>
<pre><code>他 看起来 很 谦虚，一点儿 也 不 骄傲。
Tā kànqǐlái hěn qiānxū, yìdiǎnr yě bú jiāo ào.
He seems very modest — not arrogant at all.
</code></pre>
<div class="callout"><span class="badge">Tip</span> Pair a personality word with its opposite (谦虚 ↔ 骄傲, 内向 ↔ 外向) — HSK4 loves testing contrast pairs like these in reading passages.</div>`,
    `<span class="eyebrow">CIC301 · Chương 1 · Bài 1.1</span>
<h2>Tính cách &amp; ngoại hình — 性格与外貌</h2>
<p class="lead">Ở trình độ HSK4, bạn đi xa hơn các tính từ đơn giản (好/坏/高/矮) để miêu tả <strong>tính cách (性格 xìnggé)</strong> và <strong>ngoại hình (外貌 wàimào)</strong> của một người theo cách tự nhiên, tinh tế hơn.</p>
<h3>Từ vựng trọng tâm</h3>
<pre><code>汉字        拼音          Nghĩa / Meaning
性格        xìnggé        tính cách / character
外貌        wàimào        ngoại hình / appearance
长相        zhǎngxiàng    diện mạo / looks
幽默        yōumò         hài hước / humorous
诚实        chéngshí      thành thật / honest
骄傲        jiāo ào       kiêu ngạo / proud, arrogant
谦虚        qiānxū        khiêm tốn / modest
活泼        huópō         hoạt bát / lively
外向        wàixiàng      hướng ngoại / extroverted
内向        nèixiàng      hướng nội / introverted
苗条        miáotiao      thon thả / slim
打扮        dǎban         ăn diện, trang điểm / to dress up
</code></pre>
<h3>Ngữ pháp: 又...又... (vừa... vừa...)</h3>
<p>Dùng <strong>又...又...</strong> để liệt kê hai đặc điểm cùng lúc — tự nhiên hơn nhiều so với việc tách thành hai câu riêng.</p>
<pre><code>她 又 聪明 又 幽默。
Tā yòu cōngming yòu yōumò.
Cô ấy vừa thông minh vừa hài hước.
</code></pre>
<h3>Ngữ pháp: 看起来 / 看上去 (trông có vẻ)</h3>
<p><strong>看起来</strong> và <strong>看上去</strong> đều nghĩa "trông có vẻ / có vẻ như" — dùng để nói ấn tượng đầu tiên dựa trên ngoại hình, thái độ.</p>
<pre><code>他 看起来 很 谦虚，一点儿 也 不 骄傲。
Tā kànqǐlái hěn qiānxū, yìdiǎnr yě bú jiāo ào.
Anh ấy trông có vẻ rất khiêm tốn, không kiêu ngạo chút nào.
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Ghép mỗi từ tính cách với từ trái nghĩa của nó (谦虚 ↔ 骄傲, 内向 ↔ 外向) — bài đọc HSK4 rất thích khai thác các cặp trái nghĩa như thế này.</div>`,
  ]]);

const c1q = quiz('cic301-quiz-1', 'Quiz 1 — Personality & appearance|||Quiz 1 — Tính cách & ngoại hình', [
  { id: 'q1', question: 'Câu "她又聪明又幽默" có nghĩa là gì?', options: ['Cô ấy thông minh nhưng không hài hước', 'Cô ấy vừa thông minh vừa hài hước', 'Cô ấy không thông minh cũng không hài hước', 'Cô ấy chỉ hài hước thôi'], correctIndex: 1, explanation: '又...又... dùng để liệt kê hai đặc điểm cùng lúc: vừa...vừa...' },
  { id: 'q2', question: 'Từ nào trong các từ sau có nghĩa là "khiêm tốn"?', options: ['骄傲', '谦虚', '活泼', '内向'], correctIndex: 1, explanation: '谦虚 (qiānxū) nghĩa là khiêm tốn; 骄傲 (jiāo ào) mới là kiêu ngạo.' },
  { id: 'q3', question: '"看起来" trong câu "他看起来很谦虚" dùng để diễn tả điều gì?', options: ['Một sự việc đã hoàn thành', 'Một dự định trong tương lai', 'Ấn tượng/nhận xét ban đầu — "trông có vẻ"', 'Một lời khuyên'], correctIndex: 2, explanation: '看起来/看上去 diễn tả ấn tượng ban đầu dựa trên những gì quan sát được.' },
]);

// ---------- Chương 2 — Học tập & phương pháp (使/让/把 nâng cao) ----------
const c2 = doc('cic301-2-1-study-methods', '2.1 — Study methods: 使 / 让 / 把 (advanced)|||2.1 — Phương pháp học: 使/让/把 nâng cao',
  'Câu chữ 把 với bổ ngữ phức tạp; câu khiến 使/让 diễn đạt kết quả, tác động.',
  [[
    `<span class="eyebrow">CIC301 · Chapter 2 · Lesson 2.1</span>
<h2>Study methods — 学习方法</h2>
<h3>Core vocabulary</h3>
<pre><code>汉字          拼音              Nghĩa / Meaning
效率          xiàolǜ            hiệu suất / efficiency
效果          xiàoguǒ           hiệu quả / effect
总结          zǒngjié           tổng kết / summarize
掌握          zhǎngwò           nắm vững / master
方法          fāngfǎ            phương pháp / method
提高          tígāo             nâng cao / improve
坚持          jiānchí           kiên trì / persist
培养          péiyǎng           bồi dưỡng, rèn luyện / cultivate
集中注意力    jízhōng zhùyìlì   tập trung chú ý / concentrate
制定计划      zhìdìng jìhuà     lập kế hoạch / make a plan
</code></pre>
<h3>Grammar: the 把-sentence with a complex complement</h3>
<p>At HSK3 you met the basic pattern <strong>S + 把 + O + V + 了/complement</strong>. At HSK4, the complement after the verb gets richer — result complements, resultative directions, or a full clause.</p>
<pre><code>请 把 这些 生词 都 记住。
Qǐng bǎ zhèxiē shēngcí dōu jìzhu.
Please memorize (remember-fixed) all these new words.

他 把 学习 计划 制定 得 很 详细。
Tā bǎ xuéxí jìhuà zhìdìng de hěn xiángxì.
He made the study plan in great detail.
</code></pre>
<h3>Grammar: 使 / 让 (causative — "make/let someone do sth")</h3>
<p><strong>使 shǐ</strong> (more formal/written) and <strong>让 ràng</strong> (more spoken) both introduce a cause that produces a result or feeling in someone.</p>
<pre><code>好 的 学习 方法 能 使 学习 效率 提高 一倍。
Hǎo de xuéxí fāngfǎ néng shǐ xuéxí xiàolǜ tígāo yí bèi.
A good study method can double your study efficiency.

老师 的 鼓励 让 我 更 有 信心。
Lǎoshī de gǔlì ràng wǒ gèng yǒu xìnxīn.
The teacher's encouragement made me more confident.
</code></pre>
<div class="callout"><span class="badge">Tip</span> 使/让 + person + adjective/verb phrase = "X causes person to feel/do Y". Don't confuse with 把, which moves an OBJECT to before the verb and describes what happens TO it.</div>`,
    `<span class="eyebrow">CIC301 · Chương 2 · Bài 2.1</span>
<h2>Phương pháp học tập — 学习方法</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>汉字          拼音              Nghĩa / Meaning
效率          xiàolǜ            hiệu suất / efficiency
效果          xiàoguǒ           hiệu quả / effect
总结          zǒngjié           tổng kết / summarize
掌握          zhǎngwò           nắm vững / master
方法          fāngfǎ            phương pháp / method
提高          tígāo             nâng cao / improve
坚持          jiānchí           kiên trì / persist
培养          péiyǎng           bồi dưỡng, rèn luyện / cultivate
集中注意力    jízhōng zhùyìlì   tập trung chú ý / concentrate
制定计划      zhìdìng jìhuà     lập kế hoạch / make a plan
</code></pre>
<h3>Ngữ pháp: câu chữ 把 với bổ ngữ phức tạp</h3>
<p>Ở HSK3 bạn đã học mẫu cơ bản <strong>S + 把 + O + V + 了/bổ ngữ</strong>. Lên HSK4, phần bổ ngữ sau động từ phong phú hơn — bổ ngữ kết quả, bổ ngữ trạng thái, hoặc cả một mệnh đề.</p>
<pre><code>请 把 这些 生词 都 记住。
Qǐng bǎ zhèxiē shēngcí dōu jìzhu.
Hãy ghi nhớ hết những từ mới này.

他 把 学习 计划 制定 得 很 详细。
Tā bǎ xuéxí jìhuà zhìdìng de hěn xiángxì.
Anh ấy lập kế hoạch học tập rất chi tiết.
</code></pre>
<h3>Ngữ pháp: 使 / 让 (câu khiến — "khiến/làm cho ai đó...")</h3>
<p><strong>使 shǐ</strong> (trang trọng, viết) và <strong>让 ràng</strong> (khẩu ngữ, thường ngày) đều dùng để dẫn ra một nguyên nhân tạo ra kết quả hoặc cảm xúc ở ai đó.</p>
<pre><code>好 的 学习 方法 能 使 学习 效率 提高 一倍。
Hǎo de xuéxí fāngfǎ néng shǐ xuéxí xiàolǜ tígāo yí bèi.
Phương pháp học tốt có thể khiến hiệu suất học tập tăng gấp đôi.

老师 的 鼓励 让 我 更 有 信心。
Lǎoshī de gǔlì ràng wǒ gèng yǒu xìnxīn.
Lời động viên của thầy khiến tôi tự tin hơn.
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> 使/让 + người + tính từ/cụm động từ = "X khiến người đó cảm thấy/làm Y". Đừng nhầm với 把 — 把 đưa TÂN NGỮ (vật) lên trước động từ để nói về việc xảy ra VỚI nó.</div>`,
  ]]);

const c2q = quiz('cic301-quiz-2', 'Quiz 2 — 使/让/把|||Quiz 2 — 使/让/把', [
  { id: 'q1', question: 'Câu nào dùng đúng cấu trúc chữ 把?', options: ['他记住了把这些生词', '请把这些生词都记住', '请这些生词把都记住', '把请这些生词记住'], correctIndex: 1, explanation: 'Thứ tự đúng: S (请) + 把 + O (这些生词) + trạng ngữ (都) + V + bổ ngữ (记住).' },
  { id: 'q2', question: '使/让 trong ngữ pháp HSK4 dùng để biểu đạt điều gì?', options: ['Một hành động đã hoàn thành', 'Một nguyên nhân khiến/làm cho ai đó có kết quả/cảm xúc nào đó', 'Một câu hỏi lựa chọn', 'Một câu bị động với 被'], correctIndex: 1, explanation: '使/让 là câu khiến (causative): X 使/让 Y + kết quả/cảm xúc.' },
  { id: 'q3', question: '坚持 (jiānchí) có nghĩa gần nhất là gì?', options: ['Từ bỏ', 'Kiên trì, giữ vững', 'Nghỉ ngơi', 'Quên mất'], correctIndex: 1, explanation: '坚持 nghĩa là kiên trì, bền bỉ giữ vững một việc gì đó.' },
]);

// ---------- Chương 3 — Công việc, phỏng vấn & sự nghiệp ----------
const c3 = doc('cic301-3-1-job-interview-career', '3.1 — Job interviews & career|||3.1 — Phỏng vấn & sự nghiệp',
  'Từ vựng tuyển dụng/phỏng vấn; hội thoại mẫu; cấu trúc 尽管...但是... và 只要...就...',
  [[
    `<span class="eyebrow">CIC301 · Chapter 3 · Lesson 3.1</span>
<h2>Job interviews &amp; career — 面试与职业</h2>
<h3>Core vocabulary</h3>
<pre><code>汉字      拼音        Nghĩa / Meaning
面试      miànshì     phỏng vấn / interview
简历      jiǎnlì      sơ yếu lý lịch / résumé, CV
应聘      yìngpìn     ứng tuyển / apply for a job
招聘      zhāopìn     tuyển dụng / recruit
经验      jīngyàn     kinh nghiệm / experience
职业      zhíyè       nghề nghiệp / profession
待遇      dàiyù       đãi ngộ / pay &amp; benefits
升职      shēngzhí    thăng chức / get promoted
辞职      cízhí       từ chức / resign
同事      tóngshì     đồng nghiệp / colleague
压力      yālì        áp lực / pressure
加班      jiābān      tăng ca / work overtime
</code></pre>
<h3>Mini-dialogue: at the interview</h3>
<pre><code>A: 请 简单 介绍 一下 你 自己 的 工作 经验。
   Qǐng jiǎndān jièshào yíxià nǐ zìjǐ de gōngzuò jīngyàn.
   Please briefly introduce your work experience.

B: 我 大学 毕业 以后 一直 在 一 家 公司 做 市场 工作，
   积累 了 三 年 经验。
   Wǒ dàxué bìyè yǐhòu yìzhí zài yì jiā gōngsī zuò shìchǎng gōngzuò,
   jīlěi le sān nián jīngyàn.
   After graduating I worked in marketing at a company,
   and built up three years of experience.
</code></pre>
<h3>Grammar: 尽管...但是... / 只要...就...</h3>
<p><strong>尽管...但是...</strong> ("although ... but ...") concedes a fact before contrasting it. <strong>只要...就...</strong> ("as long as ... then ...") states a sufficient condition.</p>
<pre><code>尽管 工作 压力 很 大，但是 他 还是 坚持 下来 了。
Jǐnguǎn gōngzuò yālì hěn dà, dànshì tā háishi jiānchí xiàlái le.
Although the work pressure is huge, he still stuck it out.

只要 你 认真 准备 简历，就 有 机会 被 录用。
Zhǐyào nǐ rènzhēn zhǔnbèi jiǎnlì, jiù yǒu jīhuì bèi lùyòng.
As long as you prepare your résumé seriously, you have a chance of being hired.
</code></pre>
<div class="callout"><span class="badge">Tip</span> 应聘 = the applicant applies; 招聘 = the company recruits. Same event, two directions — don't swap them.</div>`,
    `<span class="eyebrow">CIC301 · Chương 3 · Bài 3.1</span>
<h2>Phỏng vấn &amp; sự nghiệp — 面试与职业</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>汉字      拼音        Nghĩa / Meaning
面试      miànshì     phỏng vấn / interview
简历      jiǎnlì      sơ yếu lý lịch / résumé, CV
应聘      yìngpìn     ứng tuyển / apply for a job
招聘      zhāopìn     tuyển dụng / recruit
经验      jīngyàn     kinh nghiệm / experience
职业      zhíyè       nghề nghiệp / profession
待遇      dàiyù       đãi ngộ / pay &amp; benefits
升职      shēngzhí    thăng chức / get promoted
辞职      cízhí       từ chức / resign
同事      tóngshì     đồng nghiệp / colleague
压力      yālì        áp lực / pressure
加班      jiābān      tăng ca / work overtime
</code></pre>
<h3>Hội thoại mẫu: trong buổi phỏng vấn</h3>
<pre><code>A: 请 简单 介绍 一下 你 自己 的 工作 经验。
   Qǐng jiǎndān jièshào yíxià nǐ zìjǐ de gōngzuò jīngyàn.
   Bạn hãy giới thiệu ngắn gọn về kinh nghiệm làm việc của mình.

B: 我 大学 毕业 以后 一直 在 一 家 公司 做 市场 工作，
   积累 了 三 年 经验。
   Wǒ dàxué bìyè yǐhòu yìzhí zài yì jiā gōngsī zuò shìchǎng gōngzuò,
   jīlěi le sān nián jīngyàn.
   Sau khi tốt nghiệp đại học, tôi làm marketing ở một công ty,
   tích luỹ được ba năm kinh nghiệm.
</code></pre>
<h3>Ngữ pháp: 尽管...但是... / 只要...就...</h3>
<p><strong>尽管...但是...</strong> ("mặc dù... nhưng...") thừa nhận một sự thật rồi nêu điều tương phản. <strong>只要...就...</strong> ("chỉ cần... thì...") nêu điều kiện đủ để một việc xảy ra.</p>
<pre><code>尽管 工作 压力 很 大，但是 他 还是 坚持 下来 了。
Jǐnguǎn gōngzuò yālì hěn dà, dànshì tā háishi jiānchí xiàlái le.
Mặc dù áp lực công việc rất lớn, nhưng anh ấy vẫn kiên trì được.

只要 你 认真 准备 简历，就 有 机会 被 录用。
Zhǐyào nǐ rènzhēn zhǔnbèi jiǎnlì, jiù yǒu jīhuì bèi lùyòng.
Chỉ cần bạn chuẩn bị sơ yếu lý lịch nghiêm túc, thì sẽ có cơ hội được nhận.
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> 应聘 = người xin việc ứng tuyển; 招聘 = công ty tuyển dụng. Cùng một sự việc nhưng hai chiều ngược nhau — đừng lẫn lộn.</div>`,
  ]]);

const c3q = quiz('cic301-quiz-3', 'Quiz 3 — Job interview & career|||Quiz 3 — Phỏng vấn & sự nghiệp', [
  { id: 'q1', question: '面试 (miànshì) có nghĩa là gì?', options: ['Sơ yếu lý lịch', 'Phỏng vấn', 'Tăng ca', 'Thăng chức'], correctIndex: 1, explanation: '面试 = phỏng vấn (xin việc).' },
  { id: 'q2', question: 'Từ nào có nghĩa "tăng ca" (làm thêm giờ)?', options: ['辞职', '升职', '加班', '同事'], correctIndex: 2, explanation: '加班 (jiābān) nghĩa là tăng ca, làm thêm giờ.' },
  { id: 'q3', question: 'Câu "尽管工作压力很大，但是他还是坚持下来了" dùng cấu trúc ngữ pháp nào?', options: ['因为...所以... (vì...nên...)', '尽管...但是... (mặc dù...nhưng...)', '只要...就... (chỉ cần...thì...)', '一边...一边... (vừa...vừa...)'], correctIndex: 1, explanation: '尽管...但是... dùng để thừa nhận một sự thật rồi nêu điều trái ngược với nó.' },
]);

// ---------- Chương 4 — Môi trường & xã hội ----------
const c4 = doc('cic301-4-1-environment-society', '4.1 — Environment & society|||4.1 — Môi trường & xã hội',
  'Từ vựng môi trường/xã hội; cấu trúc 随着... và 越来越...',
  [[
    `<span class="eyebrow">CIC301 · Chapter 4 · Lesson 4.1</span>
<h2>Environment &amp; society — 环境与社会</h2>
<h3>Core vocabulary</h3>
<pre><code>汉字        拼音            Nghĩa / Meaning
环境        huánjìng        môi trường / environment
污染        wūrǎn           ô nhiễm / pollution
保护        bǎohù           bảo vệ / protect
资源        zīyuán          tài nguyên / resource
节约        jiéyuē          tiết kiệm / save, conserve
气候        qìhòu           khí hậu / climate
人口        rénkǒu          dân số / population
社会        shèhuì          xã hội / society
现象        xiànxiàng       hiện tượng / phenomenon
垃圾分类    lājī fēnlèi     phân loại rác / waste sorting
</code></pre>
<h3>Grammar: 随着...(along with, as) / 越来越...(more and more)</h3>
<p><strong>随着</strong> introduces a background trend that another change follows. <strong>越来越</strong> ("more and more") describes a quality that keeps increasing over time.</p>
<pre><code>随着 社会 的 发展，环境 污染 问题 越来越 严重。
Suízhe shèhuì de fāzhǎn, huánjìng wūrǎn wèntí yuè lái yuè yánzhòng.
Along with society's development, environmental pollution keeps getting more serious.

现在 越来越 多 的 人 开始 重视 垃圾 分类。
Xiànzài yuè lái yuè duō de rén kāishǐ zhòngshì lājī fēnlèi.
Nowadays more and more people are starting to take waste sorting seriously.
</code></pre>
<div class="callout"><span class="badge">Tip</span> 保护环境 (protect the environment) and 节约资源 (conserve resources) are two of the most common fixed collocations in HSK4 reading passages about society.</div>`,
    `<span class="eyebrow">CIC301 · Chương 4 · Bài 4.1</span>
<h2>Môi trường &amp; xã hội — 环境与社会</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>汉字        拼音            Nghĩa / Meaning
环境        huánjìng        môi trường / environment
污染        wūrǎn           ô nhiễm / pollution
保护        bǎohù           bảo vệ / protect
资源        zīyuán          tài nguyên / resource
节约        jiéyuē          tiết kiệm / save, conserve
气候        qìhòu           khí hậu / climate
人口        rénkǒu          dân số / population
社会        shèhuì          xã hội / society
现象        xiànxiàng       hiện tượng / phenomenon
垃圾分类    lājī fēnlèi     phân loại rác / waste sorting
</code></pre>
<h3>Ngữ pháp: 随着... (theo cùng với) / 越来越... (ngày càng)</h3>
<p><strong>随着</strong> nêu một xu hướng nền để một thay đổi khác diễn ra theo. <strong>越来越</strong> ("ngày càng") miêu tả một tính chất tăng dần theo thời gian.</p>
<pre><code>随着 社会 的 发展，环境 污染 问题 越来越 严重。
Suízhe shèhuì de fāzhǎn, huánjìng wūrǎn wèntí yuè lái yuè yánzhòng.
Cùng với sự phát triển của xã hội, vấn đề ô nhiễm môi trường ngày càng nghiêm trọng.

现在 越来越 多 的 人 开始 重视 垃圾 分类。
Xiànzài yuè lái yuè duō de rén kāishǐ zhòngshì lājī fēnlèi.
Ngày nay ngày càng nhiều người bắt đầu coi trọng việc phân loại rác.
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> 保护环境 (bảo vệ môi trường) và 节约资源 (tiết kiệm tài nguyên) là hai cụm cố định xuất hiện nhiều nhất trong bài đọc HSK4 về chủ đề xã hội.</div>`,
  ]]);

const c4q = quiz('cic301-quiz-4', 'Quiz 4 — Environment & society|||Quiz 4 — Môi trường & xã hội', [
  { id: 'q1', question: '环境污染 có nghĩa là gì?', options: ['Bảo vệ môi trường', 'Ô nhiễm môi trường', 'Tiết kiệm tài nguyên', 'Phân loại rác'], correctIndex: 1, explanation: '环境 = môi trường, 污染 = ô nhiễm → 环境污染 = ô nhiễm môi trường.' },
  { id: 'q2', question: 'Cấu trúc "越来越" diễn đạt điều gì?', options: ['Một hành động lặp lại nhiều lần', 'Mức độ của một tính chất tăng dần theo thời gian — "ngày càng"', 'Hai lựa chọn ngang nhau', 'Một điều kiện giả định'], correctIndex: 1, explanation: '越来越 + tính từ/động từ = mức độ tăng dần: ngày càng...' },
  { id: 'q3', question: 'Từ nào có nghĩa là "tài nguyên"?', options: ['气候', '人口', '资源', '现象'], correctIndex: 2, explanation: '资源 (zīyuán) nghĩa là tài nguyên.' },
]);

// ---------- Chương 5 — Văn hoá & phong tục Trung Quốc ----------
const c5 = doc('cic301-5-1-chinese-culture-customs', '5.1 — Chinese culture & customs|||5.1 — Văn hoá & phong tục Trung Quốc',
  'Lễ hội truyền thống, phong tục; cấu trúc 据说... và 象征着...',
  [[
    `<span class="eyebrow">CIC301 · Chapter 5 · Lesson 5.1</span>
<h2>Chinese culture &amp; customs — 中国文化与习俗</h2>
<h3>Core vocabulary</h3>
<pre><code>汉字      拼音              Nghĩa / Meaning
春节      Chūnjié           Tết Nguyên đán / Spring Festival
中秋节    Zhōngqiūjié       Tết Trung thu / Mid-Autumn Festival
传统      chuántǒng         truyền thống / tradition
习俗      xísú              phong tục / custom
风俗      fēngsú            phong tục / custom
拜年      bàinián           chúc Tết / pay a New Year call
红包      hóngbāo           lì xì / red envelope
团圆      tuányuán          đoàn viên, sum họp / reunion
舞龙      wǔlóng            múa rồng / dragon dance
书法      shūfǎ             thư pháp / calligraphy
京剧      jīngjù            Kinh kịch / Peking opera
</code></pre>
<h3>Grammar: 据说...(it's said that) / V + 着 + 象征着...(symbolizes)</h3>
<p><strong>据说</strong> introduces information you've heard but haven't verified yourself. <strong>象征着</strong> ("symbolizes") explains the cultural meaning behind a tradition.</p>
<pre><code>据说，春节 的 时候 全 家 人 都 要 回家 团圆。
Jùshuō, Chūnjié de shíhou quán jiā rén dōu yào huíjiā tuányuán.
It's said that during Spring Festival the whole family must return home to reunite.

红包 象征着 好运 和 祝福。
Hóngbāo xiàngzhēngzhe hǎoyùn hé zhùfú.
The red envelope symbolizes good luck and blessings.
</code></pre>
<div class="callout"><span class="badge">Culture note</span> 春节 (Spring Festival) is the most important Chinese traditional holiday — like Tết in Vietnam. Both cultures share customs such as 拜年, 团圆 dinners, and giving lucky money to children.</div>`,
    `<span class="eyebrow">CIC301 · Chương 5 · Bài 5.1</span>
<h2>Văn hoá &amp; phong tục Trung Quốc — 中国文化与习俗</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>汉字      拼音              Nghĩa / Meaning
春节      Chūnjié           Tết Nguyên đán / Spring Festival
中秋节    Zhōngqiūjié       Tết Trung thu / Mid-Autumn Festival
传统      chuántǒng         truyền thống / tradition
习俗      xísú              phong tục / custom
风俗      fēngsú            phong tục / custom
拜年      bàinián           chúc Tết / pay a New Year call
红包      hóngbāo           lì xì / red envelope
团圆      tuányuán          đoàn viên, sum họp / reunion
舞龙      wǔlóng            múa rồng / dragon dance
书法      shūfǎ             thư pháp / calligraphy
京剧      jīngjù            Kinh kịch / Peking opera
</code></pre>
<h3>Ngữ pháp: 据说... (nghe nói) / V + 着 + 象征着... (tượng trưng cho)</h3>
<p><strong>据说</strong> dùng để dẫn thông tin bạn nghe được nhưng chưa tự kiểm chứng. <strong>象征着</strong> ("tượng trưng cho") giải thích ý nghĩa văn hoá đằng sau một phong tục.</p>
<pre><code>据说，春节 的 时候 全 家 人 都 要 回家 团圆。
Jùshuō, Chūnjié de shíhou quán jiā rén dōu yào huíjiā tuányuán.
Nghe nói, vào dịp Tết Nguyên đán, cả nhà đều phải về sum họp.

红包 象征着 好运 和 祝福。
Hóngbāo xiàngzhēngzhe hǎoyùn hé zhùfú.
Lì xì tượng trưng cho may mắn và lời chúc phúc.
</code></pre>
<div class="callout"><span class="badge">Góc văn hoá</span> 春节 (Tết Nguyên đán) là lễ truyền thống quan trọng nhất của Trung Quốc — giống Tết ở Việt Nam. Hai nền văn hoá có chung nhiều phong tục như 拜年 (chúc Tết), bữa cơm 团圆 (đoàn viên), và lì xì cho trẻ nhỏ.</div>`,
  ]]);

const c5q = quiz('cic301-quiz-5', 'Quiz 5 — Culture & customs|||Quiz 5 — Văn hoá & phong tục', [
  { id: 'q1', question: '红包 tượng trưng cho điều gì trong văn hoá Trung Quốc?', options: ['Sự tức giận', 'May mắn và lời chúc phúc', 'Sự chia ly', 'Áp lực công việc'], correctIndex: 1, explanation: '红包 (lì xì) 象征着 (tượng trưng cho) 好运和祝福 — may mắn và lời chúc phúc.' },
  { id: 'q2', question: '中秋节 là lễ hội nào?', options: ['Tết Nguyên đán', 'Tết Trung thu', 'Lễ Quốc khánh', 'Tết Thanh minh'], correctIndex: 1, explanation: '中秋节 (Zhōngqiūjié) là Tết Trung thu.' },
  { id: 'q3', question: '据说 dùng để làm gì trong câu?', options: ['Ra lệnh cho ai đó', 'Dẫn một thông tin nghe được, chưa tự kiểm chứng', 'Hỏi ý kiến người khác', 'Diễn tả sự bắt buộc'], correctIndex: 1, explanation: '据说 = nghe nói / nghe đồn — dẫn thông tin nghe được từ người khác.' },
]);

// ---------- Chương 6 — Khoa học, công nghệ & đời sống hiện đại ----------
const c6 = doc('cic301-6-1-technology-modern-life', '6.1 — Technology & modern life|||6.1 — Khoa học công nghệ & đời sống hiện đại',
  'Từ vựng công nghệ, AI; cấu trúc 不但...而且... và 一方面...另一方面...',
  [[
    `<span class="eyebrow">CIC301 · Chapter 6 · Lesson 6.1</span>
<h2>Technology &amp; modern life — 科技与现代生活</h2>
<h3>Core vocabulary</h3>
<pre><code>汉字          拼音                Nghĩa / Meaning
科技          kējì                khoa học công nghệ / technology
人工智能      réngōng zhìnéng     trí tuệ nhân tạo / AI
网络          wǎngluò             mạng, internet / network
智能          zhìnéng             thông minh, trí năng / smart
发明          fāmíng              phát minh / invent
便利          biànlì              tiện lợi / convenient
数据          shùjù               dữ liệu / data
更新          gēngxīn             cập nhật / update
依赖          yīlài               phụ thuộc / rely on
普及          pǔjí                phổ biến / popularize
</code></pre>
<h3>Grammar: 不但...而且... / 一方面...另一方面...</h3>
<p><strong>不但...而且...</strong> ("not only ... but also ...") builds up two related points. <strong>一方面...另一方面...</strong> ("on the one hand ... on the other hand ...") presents two sides of an issue.</p>
<pre><code>智能 手机 不但 方便 了 生活，而且 改变 了 我们 的 社交 方式。
Zhìnéng shǒujī búdàn fāngbiàn le shēnghuó, érqiě gǎibiàn le wǒmen de shèjiāo fāngshì.
Smartphones not only make life more convenient, but also changed how we socialize.

一方面，网络 给 我们 带来 了 便利；另一方面，我们 也 越来越 依赖 它。
Yì fāngmiàn, wǎngluò gěi wǒmen dàilái le biànlì; lìng yì fāngmiàn, wǒmen yě yuè lái yuè yīlài tā.
On the one hand, the internet has brought us convenience; on the other hand, we're also relying on it more and more.
</code></pre>
<div class="callout"><span class="badge">Tip</span> 一方面...另一方面... is the classic structure for a "balanced argument" paragraph in HSK4 writing — one point for, one point against/to consider.</div>`,
    `<span class="eyebrow">CIC301 · Chương 6 · Bài 6.1</span>
<h2>Khoa học công nghệ &amp; đời sống hiện đại — 科技与现代生活</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>汉字          拼音                Nghĩa / Meaning
科技          kējì                khoa học công nghệ / technology
人工智能      réngōng zhìnéng     trí tuệ nhân tạo / AI
网络          wǎngluò             mạng, internet / network
智能          zhìnéng             thông minh, trí năng / smart
发明          fāmíng              phát minh / invent
便利          biànlì              tiện lợi / convenient
数据          shùjù               dữ liệu / data
更新          gēngxīn             cập nhật / update
依赖          yīlài               phụ thuộc / rely on
普及          pǔjí                phổ biến / popularize
</code></pre>
<h3>Ngữ pháp: 不但...而且... / 一方面...另一方面...</h3>
<p><strong>不但...而且...</strong> ("không những... mà còn...") nối hai ý liên quan và tăng tiến. <strong>一方面...另一方面...</strong> ("một mặt... mặt khác...") trình bày hai khía cạnh của một vấn đề.</p>
<pre><code>智能 手机 不但 方便 了 生活，而且 改变 了 我们 的 社交 方式。
Zhìnéng shǒujī búdàn fāngbiàn le shēnghuó, érqiě gǎibiàn le wǒmen de shèjiāo fāngshì.
Điện thoại thông minh không những làm cuộc sống tiện lợi hơn, mà còn thay đổi cách chúng ta giao tiếp xã hội.

一方面，网络 给 我们 带来 了 便利；另一方面，我们 也 越来越 依赖 它。
Yì fāngmiàn, wǎngluò gěi wǒmen dàilái le biànlì; lìng yì fāngmiàn, wǒmen yě yuè lái yuè yīlài tā.
Một mặt, mạng internet mang lại sự tiện lợi cho chúng ta; mặt khác, chúng ta cũng ngày càng phụ thuộc vào nó.
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> 一方面...另一方面... là cấu trúc kinh điển cho đoạn văn "lập luận hai mặt" trong bài viết HSK4 — một ý ủng hộ, một ý cần cân nhắc.</div>`,
  ]]);

const c6q = quiz('cic301-quiz-6', 'Quiz 6 — Technology & modern life|||Quiz 6 — Khoa học công nghệ & đời sống hiện đại', [
  { id: 'q1', question: '人工智能 có nghĩa là gì?', options: ['Mạng internet', 'Trí tuệ nhân tạo (AI)', 'Dữ liệu', 'Điện thoại thông minh'], correctIndex: 1, explanation: '人工智能 (réngōng zhìnéng) = trí tuệ nhân tạo, AI.' },
  { id: 'q2', question: 'Cấu trúc "不但...而且..." dùng để làm gì?', options: ['So sánh hơn kém', 'Diễn đạt sự tăng tiến — không những...mà còn...', 'Diễn đạt điều kiện', 'Diễn đạt sự bị động'], correctIndex: 1, explanation: '不但...而且... nối hai ý theo hướng tăng tiến, bổ sung cho nhau.' },
  { id: 'q3', question: 'Từ nào có nghĩa là "phụ thuộc"?', options: ['普及', '依赖', '更新', '便利'], correctIndex: 1, explanation: '依赖 (yīlài) nghĩa là phụ thuộc, dựa dẫm vào.' },
]);

// ---------- Chương 7 — Cảm xúc, quan điểm & tranh luận (被字句, 连...都/也) ----------
const c7 = doc('cic301-7-1-emotions-opinions-debate', '7.1 — Emotions, opinions & debate: 被 / 连...都/也|||7.1 — Cảm xúc, quan điểm & tranh luận: 被 / 连...都/也',
  'Câu bị động 被; cấu trúc nhấn mạnh 连...都/也...; từ vựng cảm xúc, quan điểm.',
  [[
    `<span class="eyebrow">CIC301 · Chapter 7 · Lesson 7.1</span>
<h2>Emotions, opinions &amp; debate — 情绪、观点与争论</h2>
<h3>Core vocabulary</h3>
<pre><code>汉字      拼音        Nghĩa / Meaning
观点      guāndiǎn    quan điểm / viewpoint
态度      tàidu       thái độ / attitude
支持      zhīchí      ủng hộ / support
反对      fǎnduì      phản đối / oppose
争论      zhēnglùn    tranh luận / argue, debate
理解      lǐjiě       hiểu, thông cảm / understand
情绪      qíngxù      cảm xúc / emotion
委屈      wěiqu       ấm ức, tủi thân / feel wronged
后悔      hòuhuǐ      hối hận / regret
感动      gǎndòng     cảm động / be moved
</code></pre>
<h3>Grammar: the 被-sentence (passive voice)</h3>
<p>Pattern: <strong>S (receiver) + 被 + (agent) + V + complement</strong>. Used when the subject is affected by, rather than performing, the action — often something unfortunate.</p>
<pre><code>我 的 钱包 被 小偷 偷 走 了。
Wǒ de qiánbāo bèi xiǎotōu tōu zǒu le.
My wallet was stolen by a thief.

他 的 观点 被 大家 反对 了。
Tā de guāndiǎn bèi dàjiā fǎnduì le.
His viewpoint was opposed by everyone.
</code></pre>
<h3>Grammar: 连...都/也... (even ...)</h3>
<p>Use <strong>连...都/也...</strong> to emphasize an extreme or unexpected case — "even X".</p>
<pre><code>连 小孩子 都 知道 这个 道理，你 怎么 不 明白？
Lián xiǎoháizi dōu zhīdào zhège dàolǐ, nǐ zěnme bù míngbai?
Even a child understands this — how don't you?
</code></pre>
<div class="callout"><span class="badge">Tip</span> 被-sentences often carry a negative or unlucky tone (money stolen, plans ruined) — don't overuse it for neutral facts; a plain active sentence is usually more natural there.</div>`,
    `<span class="eyebrow">CIC301 · Chương 7 · Bài 7.1</span>
<h2>Cảm xúc, quan điểm &amp; tranh luận — 情绪、观点与争论</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>汉字      拼音        Nghĩa / Meaning
观点      guāndiǎn    quan điểm / viewpoint
态度      tàidu       thái độ / attitude
支持      zhīchí      ủng hộ / support
反对      fǎnduì      phản đối / oppose
争论      zhēnglùn    tranh luận / argue, debate
理解      lǐjiě       hiểu, thông cảm / understand
情绪      qíngxù      cảm xúc / emotion
委屈      wěiqu       ấm ức, tủi thân / feel wronged
后悔      hòuhuǐ      hối hận / regret
感动      gǎndòng     cảm động / be moved
</code></pre>
<h3>Ngữ pháp: câu chữ 被 (câu bị động)</h3>
<p>Mẫu câu: <strong>Chủ thể bị tác động + 被 + (tác nhân) + V + bổ ngữ</strong>. Dùng khi chủ ngữ chịu tác động của hành động, thay vì tự thực hiện nó — thường là điều không may.</p>
<pre><code>我 的 钱包 被 小偷 偷 走 了。
Wǒ de qiánbāo bèi xiǎotōu tōu zǒu le.
Ví của tôi bị tên trộm lấy mất rồi.

他 的 观点 被 大家 反对 了。
Tā de guāndiǎn bèi dàjiā fǎnduì le.
Quan điểm của anh ấy bị mọi người phản đối.
</code></pre>
<h3>Ngữ pháp: 连...都/也... (ngay cả... cũng...)</h3>
<p>Dùng <strong>连...都/也...</strong> để nhấn mạnh một trường hợp cực đoan hoặc bất ngờ nhất — "ngay cả X cũng...".</p>
<pre><code>连 小孩子 都 知道 这个 道理，你 怎么 不 明白？
Lián xiǎoháizi dōu zhīdào zhège dàolǐ, nǐ zěnme bù míngbai?
Ngay cả trẻ con cũng hiểu đạo lý này, sao bạn lại không hiểu?
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Câu chữ 被 thường mang sắc thái tiêu cực hoặc không may (mất tiền, kế hoạch hỏng) — đừng lạm dụng nó cho sự việc trung tính; câu chủ động bình thường thường tự nhiên hơn trong trường hợp đó.</div>`,
  ]]);

const c7q = quiz('cic301-quiz-7', 'Quiz 7 — 被 & 连...都/也|||Quiz 7 — 被 & 连...都/也', [
  { id: 'q1', question: 'Trong câu bị động tiếng Trung, chữ nào đứng trước tác nhân gây ra hành động?', options: ['把', '被', '让', '给'], correctIndex: 1, explanation: 'Câu bị động dùng 被: chủ thể bị tác động + 被 + tác nhân + động từ.' },
  { id: 'q2', question: 'Cấu trúc "连...都/也..." dùng để nhấn mạnh điều gì?', options: ['Một điều kiện giả định', 'Một trường hợp cực đoan/ít ngờ nhất — "ngay cả...cũng..."', 'Một sự so sánh hơn kém', 'Một lời mời'], correctIndex: 1, explanation: '连...都/也... nhấn mạnh trường hợp bất ngờ hoặc cực đoan nhất, nghĩa "ngay cả...cũng...".' },
  { id: 'q3', question: '后悔 (hòuhuǐ) có nghĩa là gì?', options: ['Cảm động', 'Hối hận', 'Ủng hộ', 'Tủi thân'], correctIndex: 1, explanation: '后悔 nghĩa là hối hận về việc đã làm hoặc không làm.' },
]);

// ---------- Chương 8 — Ôn tập HSK4: câu phức, thành ngữ cơ bản, viết đoạn văn ----------
const c8 = doc('cic301-8-1-hsk4-review', '8.1 — HSK4 review: complex sentences, basic chengyu & paragraph writing|||8.1 — Ôn tập HSK4: câu phức, thành ngữ cơ bản, viết đoạn văn',
  'Tổng ôn liên từ câu phức; 4 thành ngữ cơ bản; cấu trúc viết đoạn văn tổng-phân-tổng.',
  [[
    `<span class="eyebrow">CIC301 · Chapter 8 · Lesson 8.1</span>
<h2>HSK4 review — 综合复习</h2>
<h3>Complex-sentence connectors (review)</h3>
<pre><code>虽然...但是...   suīrán...dànshì...    although ... but ...
因为...所以...   yīnwèi...suǒyǐ...     because ... so ...
只要...就...     zhǐyào...jiù...       as long as ... then ...
除非...否则...   chúfēi...fǒuzé...     only if ... otherwise ...
</code></pre>
<pre><code>除非 你 每天 坚持 练习，否则 你 的 中文 水平 很 难 提高。
Chúfēi nǐ měitiān jiānchí liànxí, fǒuzé nǐ de Zhōngwén shuǐpíng hěn nán tígāo.
Only if you practice every day, otherwise it's hard to improve your Chinese level.
</code></pre>
<h3>Basic chengyu (成语)</h3>
<pre><code>马马虎虎    mǎmǎhǔhǔ        qua loa, xuề xoà / careless, so-so
半途而废    bàntú ér fèi    bỏ dở giữa chừng / give up halfway
入乡随俗    rùxiāng suísú   nhập gia tuỳ tục / when in Rome, do as Romans do
一举两得    yìjǔ liǎngdé    một công đôi việc / kill two birds with one stone
</code></pre>
<h3>Paragraph-writing skeleton: 总-分-总</h3>
<p>A well-structured HSK4 paragraph follows <strong>总 (overall statement) → 分 (supporting points) → 总 (conclusion)</strong>, linked with connector words: <strong>首先</strong> (first), <strong>然后/其次</strong> (then/next), <strong>最后</strong> (finally), <strong>总之</strong> (in short).</p>
<pre><code>首先，学习 中文 需要 每天 练习。
其次，要 多 听 多 说，不 要 怕 说错。
最后，坚持 下去，你 的 中文 水平 一定 会 提高。
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> In the HSK4 writing section, one clean 总-分-总 paragraph with 2-3 connectors scores far better than several disconnected sentences — even if the vocabulary is simple.</div>`,
    `<span class="eyebrow">CIC301 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập HSK4 — 综合复习</h2>
<h3>Liên từ câu phức (ôn lại)</h3>
<pre><code>虽然...但是...   suīrán...dànshì...    mặc dù ... nhưng ...
因为...所以...   yīnwèi...suǒyǐ...     vì ... nên ...
只要...就...     zhǐyào...jiù...       chỉ cần ... thì ...
除非...否则...   chúfēi...fǒuzé...     trừ phi ... nếu không thì ...
</code></pre>
<pre><code>除非 你 每天 坚持 练习，否则 你 的 中文 水平 很 难 提高。
Chúfēi nǐ měitiān jiānchí liànxí, fǒuzé nǐ de Zhōngwén shuǐpíng hěn nán tígāo.
Trừ phi bạn kiên trì luyện tập mỗi ngày, nếu không thì trình độ tiếng Trung của bạn rất khó nâng cao.
</code></pre>
<h3>Thành ngữ cơ bản (成语)</h3>
<pre><code>马马虎虎    mǎmǎhǔhǔ        qua loa, xuề xoà / careless, so-so
半途而废    bàntú ér fèi    bỏ dở giữa chừng / give up halfway
入乡随俗    rùxiāng suísú   nhập gia tuỳ tục / when in Rome, do as Romans do
一举两得    yìjǔ liǎngdé    một công đôi việc / kill two birds with one stone
</code></pre>
<h3>Khung viết đoạn văn: 总-分-总</h3>
<p>Một đoạn văn HSK4 có cấu trúc tốt đi theo <strong>总 (câu chủ đề tổng quát) → 分 (các ý triển khai) → 总 (câu kết)</strong>, nối bằng các từ liên kết: <strong>首先</strong> (trước tiên), <strong>然后/其次</strong> (tiếp theo), <strong>最后</strong> (cuối cùng), <strong>总之</strong> (tóm lại).</p>
<pre><code>首先，学习 中文 需要 每天 练习。
其次，要 多 听 多 说，不 要 怕 说错。
最后，坚持 下去，你 的 中文 水平 一定 会 提高。
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Trong phần viết HSK4, một đoạn văn mạch lạc theo cấu trúc 总-分-总 với 2-3 từ liên kết được điểm cao hơn nhiều so với nhiều câu rời rạc — dù từ vựng dùng đơn giản.</div>`,
  ]]);

const c8q = quiz('cic301-quiz-8', 'Quiz 8 — HSK4 review|||Quiz 8 — Ôn tập HSK4', [
  { id: 'q1', question: 'Thành ngữ 半途而废 có nghĩa là gì?', options: ['Một công đôi việc', 'Bỏ dở giữa chừng', 'Nhập gia tuỳ tục', 'Qua loa, xuề xoà'], correctIndex: 1, explanation: '半途而废 (bàntú ér fèi) nghĩa là bỏ dở một việc gì đó giữa chừng.' },
  { id: 'q2', question: 'Cấu trúc nào diễn đạt điều kiện đủ duy nhất, "chỉ cần...thì..."?', options: ['虽然...但是...', '因为...所以...', '只要...就...', '除非...否则...'], correctIndex: 2, explanation: '只要...就... = chỉ cần (điều kiện) ... thì (kết quả xảy ra).' },
  { id: 'q3', question: 'Một đoạn văn HSK4 mạch lạc nên đi theo cấu trúc nào?', options: ['Liệt kê ngẫu nhiên các câu', '总-分-总 (mở ý tổng quát → triển khai → kết luận)', 'Chỉ dùng một câu duy nhất', 'Chỉ toàn câu hỏi'], correctIndex: 1, explanation: '总-分-总 là khung chuẩn: câu chủ đề → các ý triển khai (dùng 首先/然后/最后) → câu kết (总之).' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CIC301',
    slug: 'cic301-intensive-chinese-3',
    title: 'Intensive Chinese 3',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIC301.webp',
    shortDescription: 'Intensive Chinese 3 — HSK3→4: personality, study methods (使/让/把), job interviews, environment & society, Chinese culture, technology, emotions & debate (被, 连...都), HSK4 review. Hanzi + pinyin + Vietnamese/English meaning.|||Tiếng Trung Tổng hợp 3 — HSK3→4: tính cách, phương pháp học (使/让/把), phỏng vấn xin việc, môi trường-xã hội, văn hoá Trung Quốc, công nghệ, cảm xúc-tranh luận (被, 连...都), ôn tập HSK4. Chữ Hán + pinyin + nghĩa Việt/Anh.',
    description: 'Môn <strong>CIC301 — Intensive Chinese 3</strong> (Tiếng Trung Tổng hợp 3, kỳ 2, ngành Ngôn ngữ Trung) đưa trình độ từ <strong>HSK3 lên HSK4</strong>, bám theo giáo trình <em>HSK Standard Course 4</em> và <em>Integrated Chinese Level 2</em>. 8 chương: <strong>tính cách &amp; ngoại hình</strong> → <strong>phương pháp học (使/让/把 nâng cao)</strong> → <strong>công việc, phỏng vấn &amp; sự nghiệp</strong> → <strong>môi trường &amp; xã hội</strong> → <strong>văn hoá &amp; phong tục Trung Quốc</strong> → <strong>khoa học công nghệ &amp; đời sống hiện đại</strong> → <strong>cảm xúc, quan điểm &amp; tranh luận (被字句, 连...都/也)</strong> → <strong>ôn tập HSK4</strong> (câu phức, thành ngữ, viết đoạn văn). Mỗi bài có chữ Hán, pinyin có dấu thanh và nghĩa Việt/Anh, kèm quiz mỗi chương.',
    whatYouLearn: 'Miêu tả tính cách/ngoại hình (又...又..., 看起来); câu 把 nâng cao & câu khiến 使/让; từ vựng phỏng vấn xin việc & cấu trúc 尽管...但是.../只要...就...; 随着.../越来越... khi nói về môi trường-xã hội; lễ hội & phong tục Trung Quốc (据说, 象征着); từ vựng công nghệ & 不但...而且.../一方面...另一方面...; câu bị động 被 & nhấn mạnh 连...都/也...; ôn tập liên từ câu phức, 4 thành ngữ cơ bản, khung viết đoạn văn 总-分-总.',
    requirements: 'Đã hoàn thành CIC102 (hoặc tương đương HSK3): đọc/viết được ~600 chữ Hán cơ bản, nắm ngữ pháp HSK3 (了/过/在/正在, so sánh 比, câu 把 cơ bản, bổ ngữ khả năng).',
  },
  sections: [
    { title: 'Chương 1 — Tính cách & ngoại hình|||Chapter 1 — Personality & appearance', description: 'Tính từ tính cách/ngoại hình; 又...又..., 看起来.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phương pháp học: 使/让/把|||Chapter 2 — Study methods: 使/让/把', description: 'Câu 把 nâng cao; câu khiến 使/让.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Công việc, phỏng vấn & sự nghiệp|||Chapter 3 — Job interviews & career', description: 'Từ vựng tuyển dụng; 尽管...但是..., 只要...就...', lessons: [c3, c3q] },
    { title: 'Chương 4 — Môi trường & xã hội|||Chapter 4 — Environment & society', description: 'Từ vựng môi trường/xã hội; 随着..., 越来越...', lessons: [c4, c4q] },
    { title: 'Chương 5 — Văn hoá & phong tục Trung Quốc|||Chapter 5 — Chinese culture & customs', description: 'Lễ hội, phong tục; 据说..., 象征着...', lessons: [c5, c5q] },
    { title: 'Chương 6 — Khoa học công nghệ & đời sống hiện đại|||Chapter 6 — Technology & modern life', description: 'Từ vựng công nghệ/AI; 不但...而且..., 一方面...另一方面...', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cảm xúc, quan điểm & tranh luận|||Chapter 7 — Emotions, opinions & debate', description: 'Câu bị động 被; nhấn mạnh 连...都/也...', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập HSK4|||Chapter 8 — HSK4 review', description: 'Liên từ câu phức, thành ngữ cơ bản, viết đoạn văn.', lessons: [c8, c8q] },
  ],
};
