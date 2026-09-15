/**
 * CIC101 — Intensive Chinese 1 (Tiếng Trung Tổng hợp 1). Ngành Ngôn ngữ Trung, Kỳ 1.
 * Sơ cấp tổng hợp nghe-nói-đọc-viết, tương đương HSK 1→2, cao hơn CPC001 (dự bị)
 * một bậc — không dựng lại ngữ âm dự bị, đi thẳng từ vựng/ngữ pháp/hội thoại.
 * Giáo trình tham khảo: HSK Standard Course 1-2 (北京语言大学出版社);
 * Integrated Chinese Level 1 (Cheng & Tsui). 8 chương: chào hỏi, gia đình, thời
 * gian, ăn uống, mua sắm, giao thông/hỏi đường, sở thích/thời tiết, ôn tập HSK2.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cic101-1-1-greetings', 'Chapter 1 — Greetings & getting acquainted|||Chương 1 — Chào hỏi & làm quen mở rộng',
  'Chào hỏi, hỏi thăm, tự giới thiệu tên/quốc tịch; mẫu câu 是/吗/呢/不.',
  [[
    `<span class="eyebrow">CIC101 · Chapter 1 · Lesson 1.1</span>
<h2>Greetings &amp; getting acquainted (extended)</h2>
<h3>Core vocabulary</h3>
<pre><code>你好         nǐ hǎo                hello
你好吗        nǐ hǎo ma             how are you?
很好         hěn hǎo               (I'm) fine / very good
谢谢         xièxie                thank you
不客气        bú kèqi               you're welcome
再见         zàijiàn               goodbye
请问         qǐngwèn               excuse me, may I ask...
你叫什么名字     nǐ jiào shénme míngzi what is your name?
我叫...       wǒ jiào...            my name is...
认识你很高兴     rènshi nǐ hěn gāoxìng nice to meet you
你是哪国人      nǐ shì nǎ guó rén     which country are you from?
我是越南人      wǒ shì yuènán rén     I am Vietnamese
老师 / 学生 / 朋友  lǎoshī / xuésheng / péngyou   teacher / student / friend
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>A 是 B</strong> (shì — "to be"): 我是学生。Wǒ shì xuésheng. — I am a student.</li>
<li><strong>吗</strong> turns a statement into a yes/no question: 你是老师吗？Nǐ shì lǎoshī ma? — Are you a teacher?</li>
<li><strong>呢</strong> throws the same question back: 我很好，你呢？Wǒ hěn hǎo, nǐ ne? — I'm fine, and you?</li>
<li><strong>不</strong> negates: 我不是老师。Wǒ bú shì lǎoshī. — I am not a teacher. (不 bù becomes bú before a 4th-tone syllable)</li>
</ul>
<h3>Mini dialogue</h3>
<pre><code>A: 你好！你叫什么名字？        Nǐ hǎo! Nǐ jiào shénme míngzi?
B: 我叫玛丽。你呢？          Wǒ jiào Mǎlì. Nǐ ne?
A: 我叫明。认识你很高兴。      Wǒ jiào Míng. Rènshi nǐ hěn gāoxìng.
B: 我也很高兴认识你。你是哪国人？ Wǒ yě hěn gāoxìng rènshi nǐ. Nǐ shì nǎ guó rén?
A: 我是越南人。你呢？         Wǒ shì yuènán rén. Nǐ ne?
B: 我是中国人。            Wǒ shì Zhōngguó rén.
</code></pre>
<div class="callout"><span class="badge">Tone tip</span> 你好 is nǐ (3rd tone) + hǎo (3rd tone) — two 3rd tones in a row: in speech the first rises like a 2nd tone (ní hǎo), though it's still written nǐ hǎo.</div>`,
    `<span class="eyebrow">CIC101 · Chương 1 · Bài 1.1</span>
<h2>Chào hỏi &amp; làm quen mở rộng</h2>
<h3>Từ vựng cốt lõi</h3>
<pre><code>你好         nǐ hǎo                xin chào
你好吗        nǐ hǎo ma             bạn khoẻ không?
很好         hěn hǎo               (tôi) khoẻ / rất tốt
谢谢         xièxie                cảm ơn
不客气        bú kèqi               không có gì
再见         zàijiàn               tạm biệt
请问         qǐngwèn               xin hỏi...
你叫什么名字     nǐ jiào shénme míngzi bạn tên gì?
我叫...       wǒ jiào...            tôi tên là...
认识你很高兴     rènshi nǐ hěn gāoxìng rất vui được quen bạn
你是哪国人      nǐ shì nǎ guó rén     bạn là người nước nào?
我是越南人      wǒ shì yuènán rén     tôi là người Việt Nam
老师 / 学生 / 朋友  lǎoshī / xuésheng / péngyou   giáo viên / học sinh / bạn bè
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>A 是 B</strong> (shì — "là"): 我是学生。Wǒ shì xuésheng. — Tôi là học sinh.</li>
<li><strong>吗</strong> biến câu khẳng định thành câu hỏi có/không: 你是老师吗？Nǐ shì lǎoshī ma? — Bạn là giáo viên phải không?</li>
<li><strong>呢</strong> hỏi lại đúng câu hỏi vừa nhận: 我很好，你呢？Wǒ hěn hǎo, nǐ ne? — Tôi khoẻ, còn bạn thì sao?</li>
<li><strong>不</strong> phủ định: 我不是老师。Wǒ bú shì lǎoshī. — Tôi không phải là giáo viên. (不 bù đổi thành bú trước âm tiết thanh 4)</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你好！你叫什么名字？        Nǐ hǎo! Nǐ jiào shénme míngzi?
B: 我叫玛丽。你呢？          Wǒ jiào Mǎlì. Nǐ ne?
A: 我叫明。认识你很高兴。      Wǒ jiào Míng. Rènshi nǐ hěn gāoxìng.
B: 我也很高兴认识你。你是哪国人？ Wǒ yě hěn gāoxìng rènshi nǐ. Nǐ shì nǎ guó rén?
A: 我是越南人。你呢？         Wǒ shì yuènán rén. Nǐ ne?
B: 我是中国人。            Wǒ shì Zhōngguó rén.
</code></pre>
<div class="callout"><span class="badge">Mẹo về thanh điệu</span> 你好 gồm nǐ (thanh 3) + hǎo (thanh 3) — hai thanh 3 liên tiếp: khi nói, tiếng đầu đổi thành lên giọng như thanh 2 (ní hǎo), nhưng vẫn viết là nǐ hǎo.</div>`,
  ]]);

const c1q = quiz('cic101-quiz-1', 'Quiz 1 — Greetings|||Quiz 1 — Chào hỏi', [
  { id: 'q1', question: '"你好吗?" nghĩa là gì?', options: ['Bạn tên gì?', 'Bạn khoẻ không?', 'Bạn là người nước nào?', 'Xin chào tạm biệt.'], correctIndex: 1, explanation: '你好吗 (nǐ hǎo ma) nghĩa là "bạn khoẻ không?", câu hỏi thăm sức khoẻ.' },
  { id: 'q2', question: 'Từ nào dùng để phủ định trong câu tiếng Trung sơ cấp?', options: ['吗', '呢', '不', '是'], correctIndex: 2, explanation: '不 (bù/bú) là từ phủ định, đứng trước động từ hoặc tính từ.' },
  { id: 'q3', question: 'Trong câu "我是越南人，你呢？", từ "呢" dùng để làm gì?', options: ['Hỏi lại câu tương tự đối phương', 'Phủ định câu nói', 'Chào tạm biệt', 'Chỉ số nhiều'], correctIndex: 0, explanation: '呢 dùng hỏi lại đối phương đúng câu hỏi vừa nhận, kiểu "còn bạn thì sao?".' },
]);

const c2 = doc('cic101-2-1-family', 'Chapter 2 — Family, age & introductions|||Chương 2 — Gia đình, tuổi tác & giới thiệu',
  'Từ vựng gia đình, lượng từ 口/个, hỏi tuổi, sở hữu 的, chỉ định 这/那.',
  [[
    `<span class="eyebrow">CIC101 · Chapter 2 · Lesson 2.1</span>
<h2>Family, age &amp; introductions</h2>
<h3>Core vocabulary</h3>
<pre><code>家 / 家人      jiā / jiārén          family / home / family member
爸爸 / 妈妈     bàba / māma           dad / mom
哥哥 / 姐姐     gēge / jiějie         older brother / older sister
弟弟 / 妹妹     dìdi / mèimei         younger brother / younger sister
儿子 / 女儿     érzi / nǚ'ér          son / daughter
有            yǒu                   to have
几            jǐ                    how many (small number)
多大           duō dà                how old (adults)
岁            suì                   year(s) of age
个 / 口         gè / kǒu              measure word (general / family headcount)
这 / 那         zhè / nà              this / that
和             hé                    and
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>有</strong> sentence (possession): 我有一个哥哥。Wǒ yǒu yí gè gēge. — I have an older brother.</li>
<li><strong>的</strong> marks possession: 我的家人 wǒ de jiārén — my family.</li>
<li>Number + measure word + noun: 三口人 sān kǒu rén — three family members (口 counts people IN a household).</li>
<li>Asking age: adults 你今年多大了？Nǐ jīnnián duō dà le?; children 你几岁了？Nǐ jǐ suì le?</li>
<li><strong>这 / 那</strong>: 这是我爸爸。Zhè shì wǒ bàba. — This is my dad. 那是我姐姐。Nà shì wǒ jiějie. — That is my older sister.</li>
</ul>
<h3>Mini dialogue</h3>
<pre><code>A: 你家有几口人？          Nǐ jiā yǒu jǐ kǒu rén?
B: 我家有四口人：爸爸、妈妈、哥哥和我。 Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.
A: 你哥哥多大了？          Nǐ gēge duō dà le?
B: 他二十岁了。           Tā èrshí suì le.
A: 这是你女儿吗？          Zhè shì nǐ nǚ'ér ma?
B: 是，她三岁了。          Shì, tā sān suì le.
</code></pre>
<div class="callout"><span class="badge">Measure word note</span> 口 (kǒu, literally "mouth") is used ONLY to count how many people are in a family — for people in general you use 个 (gè) instead, e.g. 三个学生 sān gè xuésheng — three students.</div>`,
    `<span class="eyebrow">CIC101 · Chương 2 · Bài 2.1</span>
<h2>Gia đình, tuổi tác &amp; giới thiệu</h2>
<h3>Từ vựng cốt lõi</h3>
<pre><code>家 / 家人      jiā / jiārén          nhà / gia đình / thành viên gia đình
爸爸 / 妈妈     bàba / māma           bố / mẹ
哥哥 / 姐姐     gēge / jiějie         anh trai / chị gái
弟弟 / 妹妹     dìdi / mèimei         em trai / em gái
儿子 / 女儿     érzi / nǚ'ér          con trai / con gái
有            yǒu                   có
几            jǐ                    mấy (số nhỏ)
多大           duō dà                bao nhiêu tuổi (người lớn)
岁            suì                   tuổi
个 / 口         gè / kǒu              lượng từ (chung / đếm số người trong nhà)
这 / 那         zhè / nà              này / kia
和             hé                    và
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li>Câu <strong>有</strong> (sở hữu): 我有一个哥哥。Wǒ yǒu yí gè gēge. — Tôi có một anh trai.</li>
<li><strong>的</strong> đánh dấu sở hữu: 我的家人 wǒ de jiārén — gia đình tôi.</li>
<li>Số + lượng từ + danh từ: 三口人 sān kǒu rén — ba người trong nhà (口 chỉ đếm người TRONG một hộ gia đình).</li>
<li>Hỏi tuổi: người lớn dùng 你今年多大了？Nǐ jīnnián duō dà le?; trẻ em dùng 你几岁了？Nǐ jǐ suì le?</li>
<li><strong>这 / 那</strong>: 这是我爸爸。Zhè shì wǒ bàba. — Đây là bố tôi. 那是我姐姐。Nà shì wǒ jiějie. — Kia là chị gái tôi.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你家有几口人？          Nǐ jiā yǒu jǐ kǒu rén?
B: 我家有四口人：爸爸、妈妈、哥哥和我。 Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.
A: 你哥哥多大了？          Nǐ gēge duō dà le?
B: 他二十岁了。           Tā èrshí suì le.
A: 这是你女儿吗？          Zhè shì nǐ nǚ'ér ma?
B: 是，她三岁了。          Shì, tā sān suì le.
</code></pre>
<div class="callout"><span class="badge">Lưu ý lượng từ</span> 口 (kǒu, nghĩa đen "cái miệng") CHỈ dùng để đếm số người trong một gia đình — đếm người nói chung thì dùng 个 (gè), vd 三个学生 sān gè xuésheng — ba học sinh.</div>`,
  ]]);

const c2q = quiz('cic101-quiz-2', 'Quiz 2 — Family & age|||Quiz 2 — Gia đình & tuổi tác', [
  { id: 'q1', question: '"我家有三口人" nghĩa là?', options: ['Nhà tôi có 3 người', 'Tôi 3 tuổi', 'Nhà tôi có 3 tầng', 'Tôi có 3 người bạn'], correctIndex: 0, explanation: '口 là lượng từ đếm số người trong gia đình; câu này nghĩa "nhà tôi có 3 người".' },
  { id: 'q2', question: 'Từ nào dùng để hỏi tuổi trẻ em (số nhỏ)?', options: ['你多大了', '你几岁了', '你是谁', '你叫什么名字'], correctIndex: 1, explanation: '几岁 dùng hỏi tuổi trẻ em vì con số nhỏ; 多大 dùng hỏi người lớn hơn.' },
  { id: 'q3', question: 'Trong câu "这是我爸爸", từ "这" nghĩa là?', options: ['Đó là (vật ở xa)', 'Đây là (vật ở gần)', 'Ai vậy', 'Bao nhiêu'], correctIndex: 1, explanation: '这 (zhè) nghĩa "đây/này" chỉ vật ở gần; 那 (nà) nghĩa "đó/kia" chỉ vật ở xa.' },
]);

const c3 = doc('cic101-3-1-time', 'Chapter 3 — Time, calendar & appointments|||Chương 3 — Thời gian, lịch & hẹn gặp',
  'Nói giờ, ngày tháng năm, thứ tự lớn→nhỏ, hẹn gặp với 什么时候/从...到...',
  [[
    `<span class="eyebrow">CIC101 · Chapter 3 · Lesson 3.1</span>
<h2>Time, calendar &amp; appointments</h2>
<h3>Core vocabulary</h3>
<pre><code>现在              xiànzài             now
点 / 分 / 半         diǎn / fēn / bàn    o'clock / minute / half
今天 / 明天 / 昨天     jīntiān / míngtiān / zuótiān   today / tomorrow / yesterday
星期一 ... 星期天      xīngqīyī ... xīngqītiān   Monday ... Sunday
号 / 月 / 年          hào / yuè / nián    day (of month) / month / year
早上 / 中午 / 下午 / 晚上 zǎoshang / zhōngwǔ / xiàwǔ / wǎnshang  morning/noon/afternoon/evening
什么时候            shénme shíhou       when
见面 / 有空          jiànmiàn / yǒu kòng to meet up / to be free
怎么样             zěnmeyàng           how about...?
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li>Word order goes big → small: <strong>年 → 月 → 号 → 星期 → 点</strong>: 2026年9月16号，星期三 — 2026 nián 9 yuè 16 hào, xīngqīsān.</li>
<li>Telling time: 三点半 sān diǎn bàn = 3:30; 九点二十分 jiǔ diǎn èrshí fēn = 9:20. (Use 两 liǎng for "two" before 点, not 二.)</li>
<li><strong>从...到...</strong> "from...to...": 从九点到十点 cóng jiǔ diǎn dào shí diǎn — from 9 to 10 o'clock.</li>
<li>Time words go BEFORE the verb: 我三点跟你见面。Wǒ sān diǎn gēn nǐ jiànmiàn. — I'll meet you at 3 o'clock.</li>
</ul>
<h3>Mini dialogue</h3>
<pre><code>A: 现在几点？             Xiànzài jǐ diǎn?
B: 现在两点半。            Xiànzài liǎng diǎn bàn.
A: 我们什么时候见面？        Wǒmen shénme shíhou jiànmiàn?
B: 明天下午三点，怎么样？      Míngtiān xiàwǔ sān diǎn, zěnmeyàng?
A: 好，明天见！            Hǎo, míngtiān jiàn!
</code></pre>
<div class="callout"><span class="badge">两 vs 二</span> Before a measure word or 点 (o'clock), "two" is 两 (liǎng), not 二 (èr): 两点 liǎng diǎn (2 o'clock), 两个人 liǎng gè rén (two people) — but 二十 èrshí (twenty) still uses 二.</div>`,
    `<span class="eyebrow">CIC101 · Chương 3 · Bài 3.1</span>
<h2>Thời gian, lịch &amp; hẹn gặp</h2>
<h3>Từ vựng cốt lõi</h3>
<pre><code>现在              xiànzài             bây giờ
点 / 分 / 半         diǎn / fēn / bàn    giờ / phút / rưỡi
今天 / 明天 / 昨天     jīntiān / míngtiān / zuótiān   hôm nay / ngày mai / hôm qua
星期一 ... 星期天      xīngqīyī ... xīngqītiān   thứ hai ... chủ nhật
号 / 月 / 年          hào / yuè / nián    ngày / tháng / năm
早上 / 中午 / 下午 / 晚上 zǎoshang / zhōngwǔ / xiàwǔ / wǎnshang  sáng/trưa/chiều/tối
什么时候            shénme shíhou       khi nào
见面 / 有空          jiànmiàn / yǒu kòng gặp mặt / rảnh
怎么样             zěnmeyàng           thế nào, được không?
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li>Thứ tự nói từ lớn đến nhỏ: <strong>年 → 月 → 号 → 星期 → 点</strong>: 2026年9月16号，星期三 — 2026 nián 9 yuè 16 hào, xīngqīsān.</li>
<li>Nói giờ: 三点半 sān diǎn bàn = 3 giờ rưỡi; 九点二十分 jiǔ diǎn èrshí fēn = 9 giờ 20. (Dùng 两 liǎng cho "hai" trước 点, không dùng 二.)</li>
<li><strong>从...到...</strong> "từ...đến...": 从九点到十点 cóng jiǔ diǎn dào shí diǎn — từ 9 giờ đến 10 giờ.</li>
<li>Từ chỉ thời gian đứng TRƯỚC động từ: 我三点跟你见面。Wǒ sān diǎn gēn nǐ jiànmiàn. — Tôi sẽ gặp bạn lúc 3 giờ.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 现在几点？             Xiànzài jǐ diǎn?
B: 现在两点半。            Xiànzài liǎng diǎn bàn.
A: 我们什么时候见面？        Wǒmen shénme shíhou jiànmiàn?
B: 明天下午三点，怎么样？      Míngtiān xiàwǔ sān diǎn, zěnmeyàng?
A: 好，明天见！            Hǎo, míngtiān jiàn!
</code></pre>
<div class="callout"><span class="badge">两 và 二</span> Trước lượng từ hoặc trước 点 (giờ), "hai" là 两 (liǎng), không phải 二 (èr): 两点 liǎng diǎn (2 giờ), 两个人 liǎng gè rén (hai người) — nhưng 二十 èrshí (hai mươi) vẫn dùng 二.</div>`,
  ]]);

const c3q = quiz('cic101-quiz-3', 'Quiz 3 — Time & appointments|||Quiz 3 — Thời gian & hẹn gặp', [
  { id: 'q1', question: 'Muốn nói "3 giờ rưỡi" trong tiếng Trung, ta nói?', options: ['三点半', '半点三', '三分半', '三点分'], correctIndex: 0, explanation: '"X点半" nghĩa là "X giờ rưỡi", ví dụ 三点半 = 3 giờ 30.' },
  { id: 'q2', question: 'Thứ tự đúng khi nói ngày tháng năm kiểu tiếng Trung là?', options: ['Ngày - tháng - năm', 'Năm - tháng - ngày', 'Tháng - năm - ngày', 'Ngày - năm - tháng'], correctIndex: 1, explanation: 'Tiếng Trung nói từ đơn vị lớn đến nhỏ: năm (年) rồi tháng (月) rồi ngày (号).' },
  { id: 'q3', question: 'Câu "你什么时候有空?" dùng để làm gì?', options: ['Hỏi giờ hiện tại', 'Hỏi khi nào bạn rảnh', 'Hỏi bạn bao nhiêu tuổi', 'Hỏi bạn ở đâu'], correctIndex: 1, explanation: '什么时候 nghĩa "khi nào", 有空 nghĩa "rảnh"; đây là câu hỏi để hẹn gặp.' },
]);

const c4 = doc('cic101-4-1-food', 'Chapter 4 — Food & restaurant|||Chương 4 — Ăn uống & nhà hàng',
  'Gọi món, hỏi giá, lượng từ đồ ăn/đồ uống, mẫu câu 想+V và 一点儿.',
  [[
    `<span class="eyebrow">CIC101 · Chapter 4 · Lesson 4.1</span>
<h2>Food &amp; restaurant</h2>
<h3>Core vocabulary</h3>
<pre><code>吃 / 喝           chī / hē            to eat / to drink
米饭 / 面条         mǐfàn / miàntiáo   rice / noodles
菜 / 水 / 茶 / 咖啡     cài / shuǐ / chá / kāfēi   dish / water / tea / coffee
服务员 / 菜单        fúwùyuán / càidān  waiter, waitress / menu
好吃 / 好喝         hǎochī / hǎohē    tasty (food) / tasty (drink)
一点儿             yìdiǎnr            a little
买单 / 结账         mǎidān / jiézhàng  check please / to pay the bill
多少钱             duōshao qián       how much money
元 / 块            yuán / kuài        yuan (formal / colloquial unit)
想               xiǎng              would like to
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>想</strong> + verb expresses a wish: 我想吃面条。Wǒ xiǎng chī miàntiáo. — I'd like to eat noodles.</li>
<li>Measure words for food/drink: 一碗米饭 yì wǎn mǐfàn (a bowl of rice), 一杯茶 yì bēi chá (a cup of tea), 一瓶水 yì píng shuǐ (a bottle of water).</li>
<li><strong>一点儿</strong> softens a request: 请给我一点儿水。Qǐng gěi wǒ yìdiǎnr shuǐ. — Please give me a little water.</li>
<li>Asking price: 这个多少钱？Zhège duōshao qián? — How much is this?</li>
</ul>
<h3>Mini dialogue</h3>
<pre><code>A: 服务员，请给我菜单。       Fúwùyuán, qǐng gěi wǒ càidān.
B: 好的，您要吃什么？        Hǎo de, nín yào chī shénme?
A: 我想吃一碗面条，还要一杯茶。   Wǒ xiǎng chī yì wǎn miàntiáo, hái yào yì bēi chá.
B: 好，请等一下。          Hǎo, qǐng děng yíxià.
A: 服务员，买单！多少钱？      Fúwùyuán, mǎidān! Duōshao qián?
B: 一共二十五块。          Yígòng èrshíwǔ kuài.
</code></pre>
<div class="callout"><span class="badge">元 vs 块</span> 元 (yuán) is the formal written unit for Chinese currency; 块 (kuài) is what people actually say in speech — like "dollar" vs "buck".</div>`,
    `<span class="eyebrow">CIC101 · Chương 4 · Bài 4.1</span>
<h2>Ăn uống &amp; nhà hàng</h2>
<h3>Từ vựng cốt lõi</h3>
<pre><code>吃 / 喝           chī / hē            ăn / uống
米饭 / 面条         mǐfàn / miàntiáo   cơm / mì
菜 / 水 / 茶 / 咖啡     cài / shuǐ / chá / kāfēi   món ăn / nước / trà / cà phê
服务员 / 菜单        fúwùyuán / càidān  phục vụ / thực đơn
好吃 / 好喝         hǎochī / hǎohē    ngon (đồ ăn) / ngon (đồ uống)
一点儿             yìdiǎnr            một chút
买单 / 结账         mǎidān / jiézhàng  tính tiền / thanh toán
多少钱             duōshao qián       bao nhiêu tiền
元 / 块            yuán / kuài        đơn vị tiền tệ (trang trọng / khẩu ngữ)
想               xiǎng              muốn
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>想</strong> + động từ diễn tả mong muốn: 我想吃面条。Wǒ xiǎng chī miàntiáo. — Tôi muốn ăn mì.</li>
<li>Lượng từ cho đồ ăn/uống: 一碗米饭 yì wǎn mǐfàn (một bát cơm), 一杯茶 yì bēi chá (một cốc trà), 一瓶水 yì píng shuǐ (một chai nước).</li>
<li><strong>一点儿</strong> làm câu đề nghị nhẹ nhàng hơn: 请给我一点儿水。Qǐng gěi wǒ yìdiǎnr shuǐ. — Cho tôi xin một chút nước.</li>
<li>Hỏi giá: 这个多少钱？Zhège duōshao qián? — Cái này bao nhiêu tiền?</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 服务员，请给我菜单。       Fúwùyuán, qǐng gěi wǒ càidān.
B: 好的，您要吃什么？        Hǎo de, nín yào chī shénme?
A: 我想吃一碗面条，还要一杯茶。   Wǒ xiǎng chī yì wǎn miàntiáo, hái yào yì bēi chá.
B: 好，请等一下。          Hǎo, qǐng děng yíxià.
A: 服务员，买单！多少钱？      Fúwùyuán, mǎidān! Duōshao qián?
B: 一共二十五块。          Yígòng èrshíwǔ kuài.
</code></pre>
<div class="callout"><span class="badge">元 và 块</span> 元 (yuán) là đơn vị tiền tệ trang trọng dùng khi viết; 块 (kuài) là từ người ta thật sự nói khi giao tiếp — giống như "đồng" so với cách nói đời thường.</div>`,
  ]]);

const c4q = quiz('cic101-quiz-4', 'Quiz 4 — Food & restaurant|||Quiz 4 — Ăn uống & nhà hàng', [
  { id: 'q1', question: 'Muốn gọi phục vụ để tính tiền, ta nói?', options: ['多少钱', '买单', '好吃', '请问'], correctIndex: 1, explanation: '买单 (mǎidān) nghĩa là "tính tiền, thanh toán", dùng khi gọi phục vụ lúc ăn xong.' },
  { id: 'q2', question: 'Lượng từ nào dùng cho "một bát mì"?', options: ['一杯面条', '一碗面条', '一瓶面条', '一个面条'], correctIndex: 1, explanation: '碗 (wǎn - cái bát) là lượng từ cho món ăn đựng trong bát như mì, cơm.' },
  { id: 'q3', question: 'Câu "我想吃面条" thể hiện điều gì?', options: ['Ra lệnh cho ai đó', 'Mong muốn (muốn ăn gì đó)', 'Phủ định', 'Câu hỏi'], correctIndex: 1, explanation: '想 + động từ diễn tả mong muốn làm việc gì đó.' },
]);

const c5 = doc('cic101-5-1-shopping', 'Chapter 5 — Shopping & bargaining|||Chương 5 — Mua sắm & mặc cả',
  'Hỏi giá, mặc cả, màu sắc/kích cỡ, mẫu câu 太...了 và 能不能.',
  [[
    `<span class="eyebrow">CIC101 · Chapter 5 · Lesson 5.1</span>
<h2>Shopping &amp; bargaining</h2>
<h3>Core vocabulary</h3>
<pre><code>买 / 卖           mǎi / mài          to buy / to sell
商店             shāngdiàn          shop, store
便宜 / 贵         piányi / guì       cheap / expensive
打折             dǎzhé              to give a discount
太...了           tài...le           too...
大 / 小           dà / xiǎo          big / small
颜色             yánsè              color
红色 / 白色 / 黑色    hóngsè / báisè / hēisè  red / white / black
试穿 / 号          shìchuān / hào     to try on (clothes) / size
现金 / 刷卡         xiànjīn / shuākǎ   cash / to pay by card
能不能            néng bu néng       can (you)... or not
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>太...了</strong> expresses "too much": 太贵了！Tài guì le! — Too expensive!</li>
<li><strong>比</strong> for comparison: 这个比那个便宜。Zhège bǐ nàge piányi. — This one is cheaper than that one.</li>
<li>Measure word for clothes: 一件衣服 yí jiàn yīfu (a piece of clothing).</li>
<li>Negotiating: 能不能便宜一点儿？Néng bu néng piányi yìdiǎnr? — Can it be a bit cheaper?</li>
</ul>
<h3>Mini dialogue</h3>
<pre><code>A: 这件衣服多少钱？          Zhè jiàn yīfu duōshao qián?
B: 一百块。               Yìbǎi kuài.
A: 太贵了！能不能便宜一点儿？     Tài guì le! Néng bu néng piányi yìdiǎnr?
B: 好吧，八十块。           Hǎo ba, bāshí kuài.
A: 我可以试穿吗？有没有大一点儿的？ Wǒ kěyǐ shìchuān ma? Yǒu méiyǒu dà yìdiǎnr de?
B: 有，这是大号的。          Yǒu, zhè shì dà hào de.
</code></pre>
<div class="callout"><span class="badge">Haggling politely</span> 能不能 + verb (literally "can or can't...") is the standard, polite way to ask for a favor or a discount — much softer than a flat demand.</div>`,
    `<span class="eyebrow">CIC101 · Chương 5 · Bài 5.1</span>
<h2>Mua sắm &amp; mặc cả</h2>
<h3>Từ vựng cốt lõi</h3>
<pre><code>买 / 卖           mǎi / mài          mua / bán
商店             shāngdiàn          cửa hàng
便宜 / 贵         piányi / guì       rẻ / đắt
打折             dǎzhé              giảm giá
太...了           tài...le           quá...
大 / 小           dà / xiǎo          to, lớn / nhỏ
颜色             yánsè              màu sắc
红色 / 白色 / 黑色    hóngsè / báisè / hēisè  màu đỏ / màu trắng / màu đen
试穿 / 号          shìchuān / hào     thử đồ / cỡ (số)
现金 / 刷卡         xiànjīn / shuākǎ   tiền mặt / quẹt thẻ
能不能            néng bu néng       có thể... không
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>太...了</strong> diễn tả "quá...": 太贵了！Tài guì le! — Đắt quá!</li>
<li><strong>比</strong> dùng so sánh: 这个比那个便宜。Zhège bǐ nàge piányi. — Cái này rẻ hơn cái kia.</li>
<li>Lượng từ cho quần áo: 一件衣服 yí jiàn yīfu (một cái áo).</li>
<li>Mặc cả: 能不能便宜一点儿？Néng bu néng piányi yìdiǎnr? — Có thể bớt một chút không?</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 这件衣服多少钱？          Zhè jiàn yīfu duōshao qián?
B: 一百块。               Yìbǎi kuài.
A: 太贵了！能不能便宜一点儿？     Tài guì le! Néng bu néng piányi yìdiǎnr?
B: 好吧，八十块。           Hǎo ba, bāshí kuài.
A: 我可以试穿吗？有没有大一点儿的？ Wǒ kěyǐ shìchuān ma? Yǒu méiyǒu dà yìdiǎnr de?
B: 有，这是大号的。          Yǒu, zhè shì dà hào de.
</code></pre>
<div class="callout"><span class="badge">Mặc cả lịch sự</span> 能不能 + động từ (nghĩa đen "có thể hay không thể...") là cách chuẩn mực, lịch sự để nhờ vả hoặc xin giảm giá — nhẹ nhàng hơn nhiều so với yêu cầu thẳng.</div>`,
  ]]);

const c5q = quiz('cic101-quiz-5', 'Quiz 5 — Shopping|||Quiz 5 — Mua sắm & mặc cả', [
  { id: 'q1', question: '"太贵了!" nghĩa là?', options: ['Rẻ quá!', 'Đắt quá!', 'Đẹp quá!', 'Nhỏ quá!'], correctIndex: 1, explanation: '太...了 nghĩa là "quá...", 贵 nghĩa là "đắt" nên câu này là "đắt quá!".' },
  { id: 'q2', question: 'Muốn hỏi kiểu "có thể bớt chút không?", dùng cấu trúc nào?', options: ['能不能便宜一点儿?', '你叫什么名字?', '多少钱?', '你好吗?'], correctIndex: 0, explanation: '能不能 + động từ (được không) dùng để đề nghị, thương lượng một cách lịch sự.' },
  { id: 'q3', question: 'Lượng từ nào dùng cho "một cái áo"?', options: ['一条衣服', '一件衣服', '一个衣服', '一只衣服'], correctIndex: 1, explanation: '件 (jiàn) là lượng từ dùng cho áo/quần dạng "chiếc" quần áo mặc phía trên.' },
]);

const c6 = doc('cic101-6-1-directions', 'Chapter 6 — Directions, transportation & asking the way|||Chương 6 — Phương hướng, giao thông & hỏi đường',
  'Từ chỉ phương hướng, phương tiện giao thông, hỏi đường với 怎么走.',
  [[
    `<span class="eyebrow">CIC101 · Chapter 6 · Lesson 6.1</span>
<h2>Directions, transportation &amp; asking the way</h2>
<h3>Core vocabulary</h3>
<pre><code>在哪儿                zài nǎr             where is...?
左边 / 右边             zuǒbiān / yòubiān   left side / right side
前边 / 后边 / 旁边         qiánbiān / hòubiān / pángbiān  front / back / next to
一直走 / 拐弯            yìzhí zǒu / guǎiwān  go straight / to turn
公共汽车 / 出租车 / 地铁      gōnggòng qìchē / chūzū chē / dìtiě  bus / taxi / subway
火车站 / 机场             huǒchēzhàn / jīchǎng  train station / airport
远 / 近                yuǎn / jìn          far / near
怎么走                 zěnme zǒu           how to get there
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>在</strong> location sentence (A 在 B): 银行在超市旁边。Yínháng zài chāoshì pángbiān. — The bank is next to the supermarket.</li>
<li><strong>怎么</strong> (how, by what means) + verb: 去火车站怎么走？Qù huǒchēzhàn zěnme zǒu? — How do I get to the train station?</li>
<li><strong>从...到...</strong>: 从这儿到机场远不远？Cóng zhèr dào jīchǎng yuǎn bu yuǎn? — Is it far from here to the airport?</li>
<li>Chaining directions: 一直走，然后往右拐 — yìzhí zǒu, ránhòu wǎng yòu guǎi — go straight, then turn right.</li>
</ul>
<h3>Mini dialogue</h3>
<pre><code>A: 请问，火车站怎么走？        Qǐngwèn, huǒchēzhàn zěnme zǒu?
B: 一直走，然后往右拐，就在前边。   Yìzhí zǒu, ránhòu wǎng yòu guǎi, jiù zài qiánbiān.
A: 远不远？               Yuǎn bu yuǎn?
B: 不远，走路十分钟。         Bù yuǎn, zǒulù shí fēnzhōng.
A: 谢谢你！               Xièxie nǐ!
</code></pre>
<div class="callout"><span class="badge">V-not-V questions</span> 远不远？(literally "far not far?") is another way to ask yes/no questions, alongside 吗 — put the verb/adjective, then its negation, back to back.</div>`,
    `<span class="eyebrow">CIC101 · Chương 6 · Bài 6.1</span>
<h2>Phương hướng, giao thông &amp; hỏi đường</h2>
<h3>Từ vựng cốt lõi</h3>
<pre><code>在哪儿                zài nǎr             ở đâu?
左边 / 右边             zuǒbiān / yòubiān   bên trái / bên phải
前边 / 后边 / 旁边         qiánbiān / hòubiān / pángbiān  phía trước / phía sau / bên cạnh
一直走 / 拐弯            yìzhí zǒu / guǎiwān  đi thẳng / rẽ
公共汽车 / 出租车 / 地铁      gōnggòng qìchē / chūzū chē / dìtiě  xe buýt / taxi / tàu điện ngầm
火车站 / 机场             huǒchēzhàn / jīchǎng  ga tàu hoả / sân bay
远 / 近                yuǎn / jìn          xa / gần
怎么走                 zěnme zǒu           đi thế nào, đi đường nào
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li>Câu <strong>在</strong> chỉ vị trí (A 在 B): 银行在超市旁边。Yínháng zài chāoshì pángbiān. — Ngân hàng ở bên cạnh siêu thị.</li>
<li><strong>怎么</strong> (thế nào, bằng cách nào) + động từ: 去火车站怎么走？Qù huǒchēzhàn zěnme zǒu? — Đi đến ga tàu hoả bằng cách nào?</li>
<li><strong>从...到...</strong>: 从这儿到机场远不远？Cóng zhèr dào jīchǎng yuǎn bu yuǎn? — Từ đây đến sân bay có xa không?</li>
<li>Nối các bước chỉ đường: 一直走，然后往右拐 — yìzhí zǒu, ránhòu wǎng yòu guǎi — đi thẳng, sau đó rẽ phải.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 请问，火车站怎么走？        Qǐngwèn, huǒchēzhàn zěnme zǒu?
B: 一直走，然后往右拐，就在前边。   Yìzhí zǒu, ránhòu wǎng yòu guǎi, jiù zài qiánbiān.
A: 远不远？               Yuǎn bu yuǎn?
B: 不远，走路十分钟。         Bù yuǎn, zǒulù shí fēnzhōng.
A: 谢谢你！               Xièxie nǐ!
</code></pre>
<div class="callout"><span class="badge">Câu hỏi V-không-V</span> 远不远？(nghĩa đen "xa không xa?") là một cách khác để hỏi câu có/không, song song với 吗 — đặt động từ/tính từ rồi đến dạng phủ định của nó liền kề nhau.</div>`,
  ]]);

const c6q = quiz('cic101-quiz-6', 'Quiz 6 — Directions|||Quiz 6 — Phương hướng & hỏi đường', [
  { id: 'q1', question: '"一直走" nghĩa là?', options: ['Rẽ trái', 'Đi thẳng', 'Đi bộ chậm', 'Dừng lại'], correctIndex: 1, explanation: '一直走 nghĩa là "đi thẳng liên tục", dùng chỉ hướng đi.' },
  { id: 'q2', question: 'Câu "从这儿到机场远不远?" hỏi điều gì?', options: ['Từ đây đến sân bay xa hay gần', 'Sân bay ở đâu', 'Mấy giờ máy bay cất cánh', 'Vé máy bay bao nhiêu tiền'], correctIndex: 0, explanation: '从...到... nghĩa "từ...đến...", 远不远 là dạng hỏi V-không-V để hỏi có xa không.' },
  { id: 'q3', question: 'Từ nào dùng để chỉ "bên cạnh"?', options: ['前边', '旁边', '后边', '左边'], correctIndex: 1, explanation: '旁边 (pángbiān) nghĩa là "bên cạnh, kế bên".' },
]);

const c7 = doc('cic101-7-1-hobbies', 'Chapter 7 — Hobbies, weather & daily activities|||Chương 7 — Sở thích, thời tiết & hoạt động hằng ngày',
  'Sở thích với 喜欢, trạng từ tần suất, nói về thời tiết, câu nguyên nhân 因为...所以...',
  [[
    `<span class="eyebrow">CIC101 · Chapter 7 · Lesson 7.1</span>
<h2>Hobbies, weather &amp; daily activities</h2>
<h3>Core vocabulary</h3>
<pre><code>爱好 / 喜欢             àihào / xǐhuan     hobby / to like
运动                  yùndòng            sports, exercise
看书 / 看电影            kànshū / kàn diànyǐng  read books / watch movies
听音乐 / 唱歌 / 跳舞        tīng yīnyuè / chànggē / tiàowǔ  listen to music / sing / dance
打篮球 / 踢足球           dǎ lánqiú / tī zúqiú  play basketball / play soccer
天气                  tiānqì             weather
冷 / 热                lěng / rè          cold / hot
下雨 / 晴天             xiàyǔ / qíngtiān   to rain / sunny day
每天 / 常常 / 有时候         měitiān / chángcháng / yǒu shíhou  every day / often / sometimes
</code></pre>
<h3>Sentence patterns</h3>
<ul>
<li><strong>喜欢</strong> + verb/noun: 我喜欢看书。Wǒ xǐhuan kànshū. — I like reading.</li>
<li>Frequency adverbs go before the verb: 我常常运动。Wǒ chángcháng yùndòng. — I often exercise.</li>
<li>Weather: 今天天气怎么样？Jīntiān tiānqì zěnmeyàng? — How's the weather today? 今天很热。Jīntiān hěn rè. — It's hot today.</li>
<li><strong>因为...所以...</strong> reason → result: 因为下雨，所以我们不运动。Yīnwèi xiàyǔ, suǒyǐ wǒmen bú yùndòng. — Because it's raining, so we're not exercising.</li>
</ul>
<h3>Mini dialogue</h3>
<pre><code>A: 你有什么爱好？             Nǐ yǒu shénme àihào?
B: 我喜欢打篮球，也喜欢听音乐。你呢？ Wǒ xǐhuan dǎ lánqiú, yě xǐhuan tīng yīnyuè. Nǐ ne?
A: 我喜欢看书和跳舞。今天天气怎么样？ Wǒ xǐhuan kànshū hé tiàowǔ. Jīntiān tiānqì zěnmeyàng?
B: 今天下雨，很冷。我们在家看电影吧！ Jīntiān xiàyǔ, hěn lěng. Wǒmen zài jiā kàn diànyǐng ba!
</code></pre>
<div class="callout"><span class="badge">The particle 吧</span> 吧 at the end of a sentence softens it into a suggestion: 看电影吧！Kàn diànyǐng ba! — Let's watch a movie! — instead of a flat command.</div>`,
    `<span class="eyebrow">CIC101 · Chương 7 · Bài 7.1</span>
<h2>Sở thích, thời tiết &amp; hoạt động hằng ngày</h2>
<h3>Từ vựng cốt lõi</h3>
<pre><code>爱好 / 喜欢             àihào / xǐhuan     sở thích / thích
运动                  yùndòng            thể thao, vận động
看书 / 看电影            kànshū / kàn diànyǐng  đọc sách / xem phim
听音乐 / 唱歌 / 跳舞        tīng yīnyuè / chànggē / tiàowǔ  nghe nhạc / hát / nhảy múa
打篮球 / 踢足球           dǎ lánqiú / tī zúqiú  chơi bóng rổ / đá bóng
天气                  tiānqì             thời tiết
冷 / 热                lěng / rè          lạnh / nóng
下雨 / 晴天             xiàyǔ / qíngtiān   trời mưa / trời nắng
每天 / 常常 / 有时候         měitiān / chángcháng / yǒu shíhou  mỗi ngày / thường xuyên / thỉnh thoảng
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>喜欢</strong> + động từ/danh từ: 我喜欢看书。Wǒ xǐhuan kànshū. — Tôi thích đọc sách.</li>
<li>Trạng từ tần suất đứng trước động từ: 我常常运动。Wǒ chángcháng yùndòng. — Tôi thường xuyên tập thể dục.</li>
<li>Nói thời tiết: 今天天气怎么样？Jīntiān tiānqì zěnmeyàng? — Hôm nay thời tiết thế nào? 今天很热。Jīntiān hěn rè. — Hôm nay nóng.</li>
<li><strong>因为...所以...</strong> nguyên nhân → kết quả: 因为下雨，所以我们不运动。Yīnwèi xiàyǔ, suǒyǐ wǒmen bú yùndòng. — Vì trời mưa nên chúng tôi không tập thể dục.</li>
</ul>
<h3>Hội thoại ngắn</h3>
<pre><code>A: 你有什么爱好？             Nǐ yǒu shénme àihào?
B: 我喜欢打篮球，也喜欢听音乐。你呢？ Wǒ xǐhuan dǎ lánqiú, yě xǐhuan tīng yīnyuè. Nǐ ne?
A: 我喜欢看书和跳舞。今天天气怎么样？ Wǒ xǐhuan kànshū hé tiàowǔ. Jīntiān tiānqì zěnmeyàng?
B: 今天下雨，很冷。我们在家看电影吧！ Jīntiān xiàyǔ, hěn lěng. Wǒmen zài jiā kàn diànyǐng ba!
</code></pre>
<div class="callout"><span class="badge">Trợ từ 吧</span> 吧 ở cuối câu làm câu trở thành lời đề nghị nhẹ nhàng: 看电影吧！Kàn diànyǐng ba! — Xem phim đi! — thay vì một mệnh lệnh cứng.</div>`,
  ]]);

const c7q = quiz('cic101-quiz-7', 'Quiz 7 — Hobbies & weather|||Quiz 7 — Sở thích & thời tiết', [
  { id: 'q1', question: '"我喜欢看书" nghĩa là?', options: ['Tôi thích đọc sách', 'Tôi ghét đọc sách', 'Tôi đang đọc sách', 'Tôi đã đọc xong sách'], correctIndex: 0, explanation: '喜欢 + động từ nghĩa là "thích làm gì"; câu này nghĩa "tôi thích đọc sách".' },
  { id: 'q2', question: 'Cấu trúc "因为...所以..." dùng để làm gì?', options: ['So sánh hai vật', 'Diễn tả nguyên nhân - kết quả', 'Hỏi thời gian', 'Phủ định câu'], correctIndex: 1, explanation: '因为 (nguyên nhân) ... 所以 (kết quả) ... nghĩa là "bởi vì... nên...".' },
  { id: 'q3', question: '"今天下雨" nghĩa là?', options: ['Hôm nay nắng', 'Hôm nay mưa', 'Hôm nay lạnh', 'Hôm nay nóng'], correctIndex: 1, explanation: '下雨 (xiàyǔ) nghĩa là "trời mưa, đổ mưa".' },
]);

const c8 = doc('cic101-8-1-review', 'Chapter 8 — Review & HSK 2 practice (是/有/在, 了/过)|||Chương 8 — Ôn tập & luyện HSK 2 (是/有/在, 了/过)',
  'So sánh 是/有/在, phân biệt 了 (hoàn thành) và 过 (kinh nghiệm), bổ ngữ trình độ đơn giản với 得.',
  [[
    `<span class="eyebrow">CIC101 · Chapter 8 · Lesson 8.1</span>
<h2>Review &amp; HSK 2 practice</h2>
<h3>是 vs 有 vs 在 — three "core" sentence types</h3>
<pre><code>是 (shì)  A 是 B — identity / classification   我是学生。Wǒ shì xuésheng.
有 (yǒu)  A 有 B — possession / existence      我有一个哥哥。Wǒ yǒu yí gè gēge.
在 (zài)  A 在 B — location                   我在家。Wǒ zài jiā.
</code></pre>
<p>有 also builds "existential" sentences (something exists at a place): 桌子上有一本书。Zhuōzi shàng yǒu yì běn shū. — There's a book on the table.</p>
<h3>了 vs 过 — two ways to talk about the past</h3>
<pre><code>了 (le)   completion of an action / new state    我吃饭了。      Wǒ chīfàn le.       (I've eaten.)
过 (guo)  experience — "have ever done sth"     我去过中国。    Wǒ qùguo Zhōngguó.  (I've been to China [before].)
Negation of 过:                                我没去过中国。  Wǒ méi qùguo Zhōngguó.
</code></pre>
<p>了 marks a specific, completed event; 过 marks a life experience, detached from "just now". Compare: 我吃了饭 (I ate, a specific event) vs 我吃过中国菜 (I've had Chinese food before, at some point in my life).</p>
<h3>A simple degree complement: V + 得 + adjective</h3>
<p>他说得很好。Tā shuō de hěn hǎo. — He speaks (it) very well. (说 "speak" + 得 + 很好 "very well" describes HOW the action goes.)</p>
<h3>Putting it together</h3>
<pre><code>A: 你去过中国吗？               Nǐ qùguo Zhōngguó ma?
B: 去过，我去年去了北京。          Qùguo, wǒ qùnián qùle Běijīng.
A: 北京怎么样？                Běijīng zěnmeyàng?
B: 很好，那儿的烤鸭很好吃，我还吃了三次！ Hěn hǎo, nàr de kǎoyā hěn hǎochī, wǒ hái chīle sān cì!
</code></pre>
<div class="callout"><span class="badge">HSK 2 checklist</span> By the end of this chapter you should handle: 是/有/在 sentences, basic measure words, 吗/呢/不 questions, telling time and dates, 想/喜欢 + verb, 太...了 and 比 comparisons, 怎么走 directions, and 了/过 for past events.</div>`,
    `<span class="eyebrow">CIC101 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập &amp; luyện HSK 2</h2>
<h3>是, 有, 在 — ba mẫu câu "trụ cột"</h3>
<pre><code>是 (shì)  A 是 B — nhận định / phân loại     我是学生。Wǒ shì xuésheng.
有 (yǒu)  A 有 B — sở hữu / tồn tại          我有一个哥哥。Wǒ yǒu yí gè gēge.
在 (zài)  A 在 B — vị trí                   我在家。Wǒ zài jiā.
</code></pre>
<p>有 còn dùng để tạo câu "tồn tại" (có vật gì đó ở một nơi): 桌子上有一本书。Zhuōzi shàng yǒu yì běn shū. — Trên bàn có một quyển sách.</p>
<h3>了 và 过 — hai cách nói về quá khứ</h3>
<pre><code>了 (le)   hoàn thành hành động / trạng thái mới   我吃饭了。      Wǒ chīfàn le.       (Tôi ăn cơm rồi.)
过 (guo)  kinh nghiệm — "đã từng làm gì"          我去过中国。    Wǒ qùguo Zhōngguó.  (Tôi từng đi Trung Quốc.)
Phủ định của 过:                                 我没去过中国。  Wǒ méi qùguo Zhōngguó.
</code></pre>
<p>了 đánh dấu một việc cụ thể đã hoàn tất; 过 đánh dấu một trải nghiệm trong đời, tách rời khỏi "vừa mới xảy ra". So sánh: 我吃了饭 (tôi đã ăn cơm, một sự việc cụ thể) và 我吃过中国菜 (tôi từng ăn món Trung Quốc, một trải nghiệm nào đó trong đời).</p>
<h3>Bổ ngữ trình độ đơn giản: V + 得 + tính từ</h3>
<p>他说得很好。Tā shuō de hěn hǎo. — Anh ấy nói (điều đó) rất hay. (说 "nói" + 得 + 很好 "rất hay" mô tả hành động diễn ra NHƯ THẾ NÀO.)</p>
<h3>Ghép lại thành hội thoại</h3>
<pre><code>A: 你去过中国吗？               Nǐ qùguo Zhōngguó ma?
B: 去过，我去年去了北京。          Qùguo, wǒ qùnián qùle Běijīng.
A: 北京怎么样？                Běijīng zěnmeyàng?
B: 很好，那儿的烤鸭很好吃，我还吃了三次！ Hěn hǎo, nàr de kǎoyā hěn hǎochī, wǒ hái chīle sān cì!
</code></pre>
<div class="callout"><span class="badge">Danh sách kiểm tra HSK 2</span> Kết thúc chương này, bạn cần làm chủ: câu 是/有/在, lượng từ cơ bản, câu hỏi 吗/呢/不, nói giờ và ngày tháng, 想/喜欢 + động từ, so sánh 太...了 và 比, hỏi đường 怎么走, và 了/过 cho các sự việc trong quá khứ.</div>`,
  ]]);

const c8q = quiz('cic101-quiz-8', 'Quiz 8 — Review 是/有/在, 了/过|||Quiz 8 — Ôn tập 是/有/在, 了/过', [
  { id: 'q1', question: 'Câu nào dùng đúng để nói "Tôi đã từng đi Trung Quốc"?', options: ['我去中国了', '我去过中国', '我是中国', '我在中国'], correctIndex: 1, explanation: '过 (guo) diễn tả kinh nghiệm đã từng trải qua; "我去过中国" nghĩa là "tôi đã từng đi Trung Quốc".' },
  { id: 'q2', question: 'Khác biệt chính giữa 了 và 过 là gì?', options: ['Không khác nhau, dùng thay thế cho nhau', '了 nhấn vào việc đã hoàn thành cụ thể, 过 nhấn vào kinh nghiệm đã từng có', '了 dùng cho câu phủ định, 过 dùng cho câu khẳng định', '过 chỉ dùng cho hành động ở tương lai'], correctIndex: 1, explanation: '了 đánh dấu một việc cụ thể đã hoàn tất; 过 đánh dấu một trải nghiệm từng có trong quá khứ.' },
  { id: 'q3', question: 'Câu "桌子上有一本书" dùng mẫu câu nào?', options: ['Mẫu câu 是', 'Mẫu câu 有 (tồn tại)', 'Mẫu câu 在', 'Mẫu câu 了'], correctIndex: 1, explanation: '有 dùng để diễn tả có/tồn tại một vật gì đó ở một nơi (câu tồn tại).' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CIC101',
    slug: 'cic101-intensive-chinese-1',
    title: 'Intensive Chinese 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CIC101.webp',
    shortDescription: 'Beginner Chinese (HSK 1-2): real Hanzi & toned pinyin, VI/EN glosses, 8 chapters — greetings, family, time, food, shopping, directions, hobbies/weather, review (是/有/在, 了/过). Vocab tables, sample sentences, dialogues & quizzes.|||Tiếng Trung sơ cấp (HSK 1-2): chữ Hán thật, pinyin có dấu thanh, chú thích Việt/Anh, 8 chương — chào hỏi, gia đình, thời gian, ăn uống, mua sắm, hỏi đường, sở thích/thời tiết, ôn tập (是/有/在, 了/过). Có từ vựng, mẫu câu, hội thoại và quiz.',
    description: 'Môn <strong>CIC101 — Intensive Chinese 1</strong> (Tiếng Trung Tổng hợp 1, kỳ 1, ngành Ngôn ngữ Trung) dạy tiếng Trung sơ cấp tổng hợp nghe-nói-đọc-viết, tương đương <strong>HSK 1→2</strong>. Bám theo tinh thần giáo trình <em>HSK Standard Course 1-2</em> (北京语言大学出版社) và <em>Integrated Chinese Level 1</em> (Cheng &amp; Tsui): 8 chương đi từ <strong>chào hỏi &amp; làm quen</strong> → <strong>gia đình, tuổi tác</strong> → <strong>thời gian, lịch, hẹn gặp</strong> → <strong>ăn uống, nhà hàng</strong> → <strong>mua sắm, mặc cả</strong> → <strong>phương hướng, giao thông, hỏi đường</strong> → <strong>sở thích, thời tiết, hoạt động hằng ngày</strong> → <strong>ôn tập &amp; luyện HSK 2</strong> (是/有/在, bổ ngữ, 了/过). Mỗi chương có chữ Hán thật kèm pinyin có dấu thanh, bảng từ vựng, mẫu câu ngữ pháp, hội thoại ngắn và quiz 3 câu.',
    whatYouLearn: 'Chào hỏi, tự giới thiệu tên/quốc tịch (是/吗/呢/不); gia đình & tuổi tác (有, 的, lượng từ 口/个, 这/那); thời gian, ngày tháng, hẹn gặp (点/号/月/年, 从...到...); gọi món & hỏi giá (想+V, lượng từ đồ ăn, 一点儿); mua sắm & mặc cả (太...了, 比, 能不能); hỏi đường & phương tiện (在, 怎么走, 从...到...); sở thích & thời tiết (喜欢, trạng từ tần suất, 因为...所以...); ôn tập 是/有/在 và phân biệt 了/过, bổ ngữ trình độ V+得.',
    requirements: 'Đã quen bảng chữ cái pinyin và 4 thanh điệu cơ bản (như trong CPC001 — Preparatory Chinese hoặc tương đương). Không yêu cầu biết chữ Hán trước.',
  },
  sections: [
    { title: 'Chương 1 — Chào hỏi & làm quen|||Chapter 1 — Greetings & getting acquainted', description: 'Chào hỏi, tự giới thiệu, 是/吗/呢/不.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Gia đình & tuổi tác|||Chapter 2 — Family & age', description: 'Từ vựng gia đình, 有/的, hỏi tuổi.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thời gian & hẹn gặp|||Chapter 3 — Time & appointments', description: 'Giờ, ngày tháng năm, hẹn gặp.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ăn uống & nhà hàng|||Chapter 4 — Food & restaurant', description: 'Gọi món, hỏi giá, 想+V.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mua sắm & mặc cả|||Chapter 5 — Shopping & bargaining', description: 'Giá cả, màu sắc, cỡ, mặc cả.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phương hướng & hỏi đường|||Chapter 6 — Directions & asking the way', description: 'Phương hướng, phương tiện, 怎么走.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sở thích & thời tiết|||Chapter 7 — Hobbies & weather', description: '喜欢, tần suất, thời tiết, nguyên nhân.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập & luyện HSK 2|||Chapter 8 — Review & HSK 2 practice', description: '是/有/在, 了/过, bổ ngữ V+得.', lessons: [c8, c8q] },
  ],
};
