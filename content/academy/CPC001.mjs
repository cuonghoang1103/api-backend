/**
 * CPC001 — Preparatory Chinese. Giáo trình tham khảo (trích dẫn, không upload):
 * HSK Standard Course cấp 1 (北京语言大学出版社, Jiang Liping); Integrated Chinese
 * (Cheng & Tsui). 8 chương nhập môn: pinyin & 4 thanh điệu → chào hỏi &
 * giới thiệu → số đếm/ngày/giờ → gia đình & nghề nghiệp → nét chữ & bộ thủ →
 * mua sắm/hỏi giá → ăn uống/gọi món → ôn tập & chuẩn bị HSK 1.
 * Giữ NGUYÊN semester/courseCode/slug/thumbnailUrl. ⚠️ KHÔNG backtick/${; chữ
 * Hán UTF-8 nguyên vẹn, pinyin có dấu thanh thật.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cpc001-1-1-pinyin', '1.1 — Pinyin: initials, finals & the four tones|||1.1 — Ngữ âm pinyin: thanh mẫu, vận mẫu & bốn thanh điệu',
  'Thanh mẫu (声母), vận mẫu (韵母), bốn thanh điệu (四声) qua ví dụ mā má mǎ mà; biến điệu thanh 3 trong nǐ hǎo.',
  [[
    `<span class="eyebrow">CPC001 · Chapter 1 · Lesson 1.1</span>
<h2>Pinyin: initials, finals &amp; the four tones</h2>
<p class="lead"><strong>Pinyin (拼音 pīnyīn)</strong> is the official Romanization for Mandarin sounds. Every syllable is built from an <strong>initial</strong> (声母 shēngmǔ — the starting consonant), a <strong>final</strong> (韵母 yùnmǔ — the vowel part), and a <strong>tone</strong> (声调 shēngdiào).</p>
<h3>Common initials (声母)</h3>
<pre><code>b  p  m  f     d  t  n  l
g  k  h        j  q  x
zh ch sh r     z  c  s
y  w</code></pre>
<h3>Common finals (韵母)</h3>
<pre><code>a  o  e  i  u  ü
ai ei ao ou
an en ang eng ong</code></pre>
<h3>The four tones (四声 sìshēng)</h3>
<p>Mandarin uses pitch to tell words apart. The classic example, all on the syllable <strong>ma</strong>:</p>
<pre><code>1st  ā  妈 mā  high &amp; flat        "mother"
2nd  á  麻 má  rising               "hemp"
3rd  ǎ  马 mǎ  dip then rise        "horse"
4th  à  骂 mà  sharp falling        "to scold"
neutral a 吗 ma  short, unstressed  (question particle)</code></pre>
<div class="callout"><span class="badge">Tip</span> Tones are not decoration — <em>mā</em>, <em>má</em>, <em>mǎ</em>, <em>mà</em> are four completely different words. Practice each tone alone before combining syllables.</div>
<h3>Try it: nǐ hǎo</h3>
<p><strong>你好 nǐ hǎo</strong> ("hello") combines two 3rd tones. When two 3rd tones meet, the first is pronounced as a rising 2nd tone in speech: <em>ní hǎo</em> — the <strong>3rd-tone sandhi</strong> rule, one of the very first pronunciation rules learners meet.</p>`,
    `<span class="eyebrow">CPC001 · Chương 1 · Bài 1.1</span>
<h2>Ngữ âm pinyin: thanh mẫu, vận mẫu &amp; bốn thanh điệu</h2>
<p class="lead"><strong>Pinyin (拼音 pīnyīn)</strong> là hệ phiên âm La-tinh chính thức của tiếng Trung phổ thông. Mỗi âm tiết gồm một <strong>thanh mẫu</strong> (声母 shēngmǔ — phụ âm đầu), một <strong>vận mẫu</strong> (韵母 yùnmǔ — phần nguyên âm), và một <strong>thanh điệu</strong> (声调 shēngdiào).</p>
<h3>Thanh mẫu thường gặp (声母)</h3>
<pre><code>b  p  m  f     d  t  n  l
g  k  h        j  q  x
zh ch sh r     z  c  s
y  w</code></pre>
<h3>Vận mẫu thường gặp (韵母)</h3>
<pre><code>a  o  e  i  u  ü
ai ei ao ou
an en ang eng ong</code></pre>
<h3>Bốn thanh điệu (四声 sìshēng)</h3>
<p>Tiếng Trung dùng cao độ để phân biệt nghĩa. Ví dụ kinh điển, cùng âm tiết <strong>ma</strong>:</p>
<pre><code>Thanh 1  ā  妈 mā  cao, đều          "mẹ"
Thanh 2  á  麻 má  đi lên            "cây gai (đay)"
Thanh 3  ǎ  马 mǎ  xuống rồi lên     "con ngựa"
Thanh 4  à  骂 mà  xuống mạnh        "mắng"
Nhẹ      a  吗 ma  ngắn, không nhấn  (trợ từ hỏi)</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Thanh điệu không phải trang trí — <em>mā</em>, <em>má</em>, <em>mǎ</em>, <em>mà</em> là bốn từ hoàn toàn khác nhau. Luyện từng thanh riêng lẻ trước khi ghép âm tiết.</div>
<h3>Thử luôn: nǐ hǎo</h3>
<p><strong>你好 nǐ hǎo</strong> ("xin chào") ghép hai thanh 3. Khi hai thanh 3 đứng liền nhau, âm tiết đầu được đọc thành thanh 2 (lên giọng): <em>ní hǎo</em> — đây là quy tắc <strong>biến điệu thanh 3</strong>, một trong những quy tắc phát âm đầu tiên người học gặp.</p>`,
  ]]);

const c1q = quiz('cpc001-quiz-1', 'Quiz 1 — Pinyin & tones|||Quiz 1 — Pinyin & thanh điệu', [
  { id: 'q1', question: 'Pinyin (拼音) dùng để làm gì?', options: ['Đếm số trong tiếng Trung', 'Phiên âm La-tinh cho cách đọc âm tiết tiếng Trung', 'Một bộ thủ chữ Hán', 'Tên một món ăn'], correctIndex: 1, explanation: 'Pinyin là hệ phiên âm chính thức thể hiện cách đọc âm tiết tiếng Trung.' },
  { id: 'q2', question: '妈 (mā, thanh 1) và 马 (mǎ, thanh 3) khác nhau ở đâu, và nghĩa có giống nhau không?', options: ['Khác thanh mẫu, nghĩa giống nhau', 'Khác thanh điệu, nghĩa hoàn toàn khác nhau (mẹ / ngựa)', 'Khác vận mẫu, nghĩa giống nhau', 'Không khác nhau'], correctIndex: 1, explanation: 'Cùng âm tiết ma nhưng khác thanh điệu tạo ra hai từ khác nhau: mā = mẹ, mǎ = ngựa.' },
  { id: 'q3', question: '你好 (nǐ hǎo) được đọc thực tế thế nào theo quy tắc biến điệu thanh 3?', options: ['nī hǎo', 'ní hǎo', 'nì hǎo', 'nǐ hāo'], correctIndex: 1, explanation: 'Hai thanh 3 liền nhau: âm tiết đầu (nǐ) biến thành thanh 2 khi nói → ní hǎo.' },
]);

const c2 = doc('cpc001-2-1-greetings', '2.1 — Greetings & self-introduction|||2.1 — Chào hỏi & giới thiệu bản thân',
  '你好, 谢谢, 再见; 我叫.../我是...; mẫu câu 你叫什么名字, 认识你很高兴; hội thoại mẫu.',
  [[
    `<span class="eyebrow">CPC001 · Chapter 2 · Lesson 2.1</span>
<h2>Greetings &amp; self-introduction</h2>
<h3>Basic greetings</h3>
<pre><code>你好       nǐ hǎo         hello
你好吗？   nǐ hǎo ma?     how are you?
我很好     wǒ hěn hǎo     I am fine
谢谢       xièxie         thank you
不客气     bú kèqi        you are welcome
对不起     duìbuqǐ        sorry
没关系     méi guānxi     it is okay
再见       zàijiàn        goodbye</code></pre>
<h3>Introducing yourself</h3>
<pre><code>我叫...          wǒ jiào...              my name is...
我是...          wǒ shì...               I am...
你叫什么名字？   nǐ jiào shénme míngzi?  what is your name?
你是哪国人？     nǐ shì nǎ guó rén?      where are you from?
我是越南人       wǒ shì Yuènán rén       I am Vietnamese
认识你很高兴     rènshi nǐ hěn gāoxìng   nice to meet you</code></pre>
<h3>Sample dialogue</h3>
<pre><code>A: 你好！我叫王明，你呢？
   Nǐ hǎo! Wǒ jiào Wáng Míng, nǐ ne?
B: 你好，王明！我叫玛丽。认识你很高兴。
   Nǐ hǎo, Wáng Míng! Wǒ jiào Mǎlì. Rènshi nǐ hěn gāoxìng.</code></pre>
<div class="callout"><span class="badge">Grammar note</span> The pattern <strong>X呢? (X ne?)</strong> means "and X?" — a quick way to bounce a question back, as in <em>你呢?</em> ("and you?").</div>`,
    `<span class="eyebrow">CPC001 · Chương 2 · Bài 2.1</span>
<h2>Chào hỏi &amp; giới thiệu bản thân</h2>
<h3>Chào hỏi cơ bản</h3>
<pre><code>你好       nǐ hǎo         xin chào
你好吗？   nǐ hǎo ma?     bạn khoẻ không?
我很好     wǒ hěn hǎo     tôi khoẻ
谢谢       xièxie         cảm ơn
不客气     bú kèqi        không có gì
对不起     duìbuqǐ        xin lỗi
没关系     méi guānxi     không sao
再见       zàijiàn        tạm biệt</code></pre>
<h3>Giới thiệu bản thân</h3>
<pre><code>我叫...          wǒ jiào...              tôi tên là...
我是...          wǒ shì...               tôi là...
你叫什么名字？   nǐ jiào shénme míngzi?  bạn tên gì?
你是哪国人？     nǐ shì nǎ guó rén?      bạn là người nước nào?
我是越南人       wǒ shì Yuènán rén       tôi là người Việt Nam
认识你很高兴     rènshi nǐ hěn gāoxìng   rất vui được quen bạn</code></pre>
<h3>Hội thoại mẫu</h3>
<pre><code>A: 你好！我叫王明，你呢？
   Nǐ hǎo! Wǒ jiào Wáng Míng, nǐ ne?
   (Chào! Tôi tên Vương Minh, còn bạn?)
B: 你好，王明！我叫玛丽。认识你很高兴。
   Nǐ hǎo, Wáng Míng! Wǒ jiào Mǎlì. Rènshi nǐ hěn gāoxìng.
   (Chào Vương Minh! Tôi tên Mary. Rất vui được quen bạn.)</code></pre>
<div class="callout"><span class="badge">Ngữ pháp</span> Mẫu <strong>X呢? (X ne?)</strong> nghĩa là "còn X thì sao?" — cách hỏi ngược nhanh gọn, như <em>你呢?</em> ("còn bạn thì sao?").</div>`,
  ]]);

const c2q = quiz('cpc001-quiz-2', 'Quiz 2 — Greetings|||Quiz 2 — Chào hỏi', [
  { id: 'q1', question: '谢谢 (xièxie) nghĩa là gì, và đáp lại thường dùng câu nào?', options: ['Xin lỗi — đáp 没关系', 'Cảm ơn — đáp 不客气 (không có gì)', 'Tạm biệt — đáp 再见', 'Xin chào — đáp 你好'], correctIndex: 1, explanation: '谢谢 = cảm ơn; đáp lại lịch sự là 不客气 (bú kèqi, không có gì).' },
  { id: 'q2', question: 'Câu hỏi tên "你叫什么名字？" nghĩa là gì?', options: ['Bạn khoẻ không?', 'Bạn tên gì?', 'Bạn là người nước nào?', 'Bạn bao nhiêu tuổi?'], correctIndex: 1, explanation: '叫 (jiào) = tên là; 什么名字 = tên gì → cả câu hỏi tên.' },
  { id: 'q3', question: 'Trong câu "我叫王明，你呢？", chữ 呢 (ne) dùng để làm gì?', options: ['Phủ định câu trước', 'Hỏi ngược lại đối phương ("còn bạn thì sao?")', 'Nhấn mạnh thời gian', 'Chỉ số nhiều'], correctIndex: 1, explanation: 'X呢? là mẫu hỏi ngược nhanh, tương đương "còn X thì sao?".' },
]);

const c3 = doc('cpc001-3-1-numbers-date-time', '3.1 — Numbers, date & time|||3.1 — Số đếm, ngày tháng & thời gian',
  'Số 0-99 (零一二三...十); 年月号, 今天/明天/昨天; 点/分, 现在几点; 星期一...星期日.',
  [[
    `<span class="eyebrow">CPC001 · Chapter 3 · Lesson 3.1</span>
<h2>Numbers, date &amp; time</h2>
<h3>Numbers 0-10</h3>
<pre><code>0  零 líng   1  一 yī    2  二 èr    3  三 sān   4  四 sì
5  五 wǔ     6  六 liù   7  七 qī    8  八 bā    9  九 jiǔ
10 十 shí</code></pre>
<h3>Building bigger numbers</h3>
<pre><code>11  十一   shí yī      20  二十   èr shí
12  十二   shí èr      21  二十一 èr shí yī
15  十五   shí wǔ      99  九十九 jiǔ shí jiǔ</code></pre>
<p>Pattern: <strong>tens digit + 十 (shí) + ones digit</strong>. 二十 = "two tens" = 20; 二十一 = "two tens one" = 21.</p>
<h3>Date &amp; days</h3>
<pre><code>年 nián  year        月 yuè  month       号/日 hào/rì  day
今天 jīntiān  today   明天 míngtiān  tomorrow   昨天 zuótiān  yesterday
今天几月几号？ Jīntiān jǐ yuè jǐ hào?  What is today's date?
星期一 xīngqī yī  Mon   星期二 xīngqī èr  Tue   星期三 xīngqī sān  Wed
星期四 xīngqī sì  Thu   星期五 xīngqī wǔ  Fri
星期六 xīngqī liù Sat   星期日/星期天 xīngqī rì/tiān  Sun</code></pre>
<h3>Telling time</h3>
<pre><code>点 diǎn  o'clock    分 fēn  minute     半 bàn  half
现在几点？  Xiànzài jǐ diǎn?   What time is it now?
三点半      sān diǎn bàn        3:30
八点十分    bā diǎn shí fēn     8:10</code></pre>
<div class="callout"><span class="badge">Note</span> 二 (èr) is used for the number two itself, but before a measure word (counting things) Mandarin usually switches to 两 (liǎng) — e.g. 两个人 (liǎng gè rén, two people), not 二个人.</div>`,
    `<span class="eyebrow">CPC001 · Chương 3 · Bài 3.1</span>
<h2>Số đếm, ngày tháng &amp; thời gian</h2>
<h3>Số 0-10</h3>
<pre><code>0  零 líng   1  一 yī    2  二 èr    3  三 sān   4  四 sì
5  五 wǔ     6  六 liù   7  七 qī    8  八 bā    9  九 jiǔ
10 十 shí</code></pre>
<h3>Ghép số lớn hơn</h3>
<pre><code>11  十一   shí yī      20  二十   èr shí
12  十二   shí èr      21  二十一 èr shí yī
15  十五   shí wǔ      99  九十九 jiǔ shí jiǔ</code></pre>
<p>Quy tắc: <strong>chữ số hàng chục + 十 (shí) + chữ số hàng đơn vị</strong>. 二十 = "hai mươi" = 20; 二十一 = "hai mươi mốt" = 21.</p>
<h3>Ngày tháng &amp; thứ trong tuần</h3>
<pre><code>年 nián  năm         月 yuè  tháng        号/日 hào/rì  ngày
今天 jīntiān  hôm nay  明天 míngtiān  ngày mai  昨天 zuótiān  hôm qua
今天几月几号？ Jīntiān jǐ yuè jǐ hào?  Hôm nay là ngày mấy?
星期一 xīngqī yī  Thứ 2   星期二 xīngqī èr  Thứ 3   星期三 xīngqī sān  Thứ 4
星期四 xīngqī sì  Thứ 5   星期五 xīngqī wǔ  Thứ 6
星期六 xīngqī liù Thứ 7   星期日/星期天 xīngqī rì/tiān  Chủ nhật</code></pre>
<h3>Nói giờ</h3>
<pre><code>点 diǎn  giờ    分 fēn  phút     半 bàn  rưỡi
现在几点？  Xiànzài jǐ diǎn?   Bây giờ là mấy giờ?
三点半      sān diǎn bàn        3 giờ rưỡi
八点十分    bā diǎn shí fēn     8 giờ 10 phút</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> 二 (èr) dùng khi đếm số thuần tuý, nhưng đứng trước lượng từ (đếm đồ vật/người) tiếng Trung thường đổi sang 两 (liǎng) — vd 两个人 (liǎng gè rén, hai người), không nói 二个人.</div>`,
  ]]);

const c3q = quiz('cpc001-quiz-3', 'Quiz 3 — Numbers, date & time|||Quiz 3 — Số đếm, ngày giờ', [
  { id: 'q1', question: '二十一 (èr shí yī) là số nào?', options: ['12', '21', '29', '11'], correctIndex: 1, explanation: '二十 (hai mươi) + 一 (một) = 二十一 = 21.' },
  { id: 'q2', question: 'Muốn hỏi "Bây giờ là mấy giờ?" thì nói câu nào?', options: ['今天几月几号？', '现在几点？', '你叫什么名字？', '多少钱？'], correctIndex: 1, explanation: '现在几点？ (xiànzài jǐ diǎn?) dùng để hỏi giờ hiện tại.' },
  { id: 'q3', question: 'Khi đếm người (lượng từ 个), vì sao nói 两个人 mà không nói 二个人?', options: ['两 và 二 nghĩa khác nhau hoàn toàn', 'Trước lượng từ, số 2 thường dùng 两 (liǎng) thay vì 二 (èr)', '二个人 mới là đúng chuẩn', 'Không có quy tắc nào'], correctIndex: 1, explanation: 'Quy tắc: trước lượng từ, "hai" dùng 两 (liǎng), không dùng 二 (èr).' },
]);

const c4 = doc('cpc001-4-1-family-jobs', '4.1 — Family & occupations|||4.1 — Gia đình & nghề nghiệp',
  '爸爸妈妈哥哥姐姐弟弟妹妹; 你家有几口人; nghề nghiệp 老师医生工程师; 你做什么工作.',
  [[
    `<span class="eyebrow">CPC001 · Chapter 4 · Lesson 4.1</span>
<h2>Family &amp; occupations</h2>
<h3>Family members (家庭 jiātíng)</h3>
<pre><code>爸爸 bàba    dad          妈妈 māma    mom
哥哥 gēge    older brother  姐姐 jiějie   older sister
弟弟 dìdi    younger brother 妹妹 mèimei  younger sister
儿子 érzi    son          女儿 nǚ ér    daughter
爷爷 yéye    paternal grandpa  奶奶 nǎinai  paternal grandma</code></pre>
<h3>Asking about family</h3>
<pre><code>你家有几口人？ Nǐ jiā yǒu jǐ kǒu rén?  How many people in your family?
我家有五口人。 Wǒ jiā yǒu wǔ kǒu rén.  There are five in my family.</code></pre>
<p>Note: 口 (kǒu, "mouth") is the measure word used to count family members, not 个 (gè).</p>
<h3>Occupations (职业 zhíyè)</h3>
<pre><code>老师 lǎoshī       teacher      学生 xuésheng    student
医生 yīshēng      doctor       工程师 gōngchéngshī  engineer
商人 shāngrén     businessperson  工人 gōngrén    worker
你做什么工作？ Nǐ zuò shénme gōngzuò?  What is your job?
他是老师。     Tā shì lǎoshī.          He/She is a teacher.</code></pre>
<div class="callout"><span class="badge">Grammar note</span> "To be" (是 shì) links a person directly to their role: <strong>Subject + 是 + occupation</strong> — no extra word for "a/an" is needed in Chinese.</div>`,
    `<span class="eyebrow">CPC001 · Chương 4 · Bài 4.1</span>
<h2>Gia đình &amp; nghề nghiệp</h2>
<h3>Thành viên gia đình (家庭 jiātíng)</h3>
<pre><code>爸爸 bàba    bố           妈妈 māma    mẹ
哥哥 gēge    anh trai      姐姐 jiějie   chị gái
弟弟 dìdi    em trai       妹妹 mèimei  em gái
儿子 érzi    con trai      女儿 nǚ ér    con gái
爷爷 yéye    ông nội       奶奶 nǎinai  bà nội</code></pre>
<h3>Hỏi về gia đình</h3>
<pre><code>你家有几口人？ Nǐ jiā yǒu jǐ kǒu rén?  Nhà bạn có mấy người?
我家有五口人。 Wǒ jiā yǒu wǔ kǒu rén.  Nhà tôi có năm người.</code></pre>
<p>Lưu ý: 口 (kǒu, nghĩa gốc "miệng") là lượng từ dùng để đếm người trong gia đình, không dùng 个 (gè).</p>
<h3>Nghề nghiệp (职业 zhíyè)</h3>
<pre><code>老师 lǎoshī       giáo viên     学生 xuésheng    học sinh/sinh viên
医生 yīshēng      bác sĩ        工程师 gōngchéngshī  kỹ sư
商人 shāngrén     doanh nhân    工人 gōngrén    công nhân
你做什么工作？ Nǐ zuò shénme gōngzuò?  Bạn làm nghề gì?
他是老师。     Tā shì lǎoshī.          Anh ấy/Cô ấy là giáo viên.</code></pre>
<div class="callout"><span class="badge">Ngữ pháp</span> Động từ "là" (是 shì) nối trực tiếp chủ ngữ với nghề nghiệp: <strong>Chủ ngữ + 是 + nghề nghiệp</strong> — tiếng Trung không cần thêm từ nào tương đương "một" trước danh từ.</div>`,
  ]]);

const c4q = quiz('cpc001-quiz-4', 'Quiz 4 — Family & jobs|||Quiz 4 — Gia đình & nghề nghiệp', [
  { id: 'q1', question: '哥哥 (gēge) và 弟弟 (dìdi) khác nhau ở điểm nào?', options: ['哥哥 = anh trai, 弟弟 = em trai', '哥哥 = em trai, 弟弟 = anh trai', 'Cả hai đều nghĩa là chị gái', 'Cả hai đều nghĩa là bố'], correctIndex: 0, explanation: '哥哥 chỉ anh trai (lớn hơn), 弟弟 chỉ em trai (nhỏ hơn).' },
  { id: 'q2', question: 'Câu "你家有几口人？" dùng lượng từ nào để đếm người trong nhà?', options: ['个 (gè)', '口 (kǒu)', '只 (zhī)', '本 (běn)'], correctIndex: 1, explanation: 'Khi đếm số người trong một gia đình, tiếng Trung dùng lượng từ 口 (kǒu), không dùng 个.' },
  { id: 'q3', question: 'Mẫu câu nào đúng để nói "Anh ấy là giáo viên"?', options: ['他老师是。', '他是老师。', '他有老师。', '他做老师吗？'], correctIndex: 1, explanation: 'Cấu trúc đúng: Chủ ngữ + 是 (shì, là) + nghề nghiệp → 他是老师。' },
]);

const c5 = doc('cpc001-5-1-strokes-radicals', '5.1 — Basic strokes, stroke order & common radicals|||5.1 — Nét cơ bản, quy tắc viết chữ Hán & bộ thủ thường gặp',
  '8 nét cơ bản (横竖撇捺点提折钩); quy tắc viết (trên-dưới, trái-phải, ngoài-trong); bộ thủ 氵木亻口女心讠日月.',
  [[
    `<span class="eyebrow">CPC001 · Chapter 5 · Lesson 5.1</span>
<h2>Basic strokes, stroke order &amp; common radicals</h2>
<h3>The 8 basic strokes (笔画 bǐhuà)</h3>
<pre><code>横 héng   —   horizontal   (e.g. in 一)
竖 shù    |   vertical     (e.g. in 十)
撇 piě    ノ  falling-left  (e.g. in 人)
捺 nà     乀  falling-right (e.g. in 人)
点 diǎn   ﹒  dot           (e.g. in 主)
提 tí     ㇀  rising        (e.g. in 我)
折 zhé    ㄱ  bend          (e.g. in 口)
钩 gōu    亅  hook          (e.g. in 小)</code></pre>
<h3>Stroke order rules (笔顺规则 bǐshùn guīzé)</h3>
<pre><code>先横后竖  xiān héng hòu shù     horizontal before vertical (十)
先撇后捺  xiān piě hòu nà       left-falling before right-falling (人)
从上到下  cóng shàng dào xià    top before bottom (三)
从左到右  cóng zuǒ dào yòu      left before right (你)
从外到内  cóng wài dào nèi      outside before inside (回)
先中间后两边 xiān zhōngjiān hòu liǎngbiān  middle before both sides (小)</code></pre>
<h3>Common radicals (部首 bùshǒu)</h3>
<pre><code>氵 (三点水)  water    汉 河 海
木  wood     林 森 树
亻 (单人旁)  person   你 他 们
口  mouth    吃 叫 名
女  woman    她 好 妈
心/忄 heart  想 忙 快
讠 (言字旁)  speech   说 语 认
日  sun/day  明 时 早
月  moon/month  期 有 朋</code></pre>
<div class="callout"><span class="badge">Radicals unlock meaning</span> 好 (hǎo, "good") = 女 (woman) + 子 (child) — a mother beside her child is the picture of "good". Learning radicals turns memorizing thousands of characters into recognizing a much smaller set of reusable building blocks.</div>`,
    `<span class="eyebrow">CPC001 · Chương 5 · Bài 5.1</span>
<h2>Nét cơ bản, quy tắc viết chữ Hán &amp; bộ thủ thường gặp</h2>
<h3>8 nét cơ bản (笔画 bǐhuà)</h3>
<pre><code>横 héng   —   nét ngang     (vd trong 一)
竖 shù    |   nét sổ        (vd trong 十)
撇 piě    ノ  nét phẩy      (vd trong 人)
捺 nà     乀  nét mác       (vd trong 人)
点 diǎn   ﹒  nét chấm      (vd trong 主)
提 tí     ㇀  nét hất       (vd trong 我)
折 zhé    ㄱ  nét gập       (vd trong 口)
钩 gōu    亅  nét móc       (vd trong 小)</code></pre>
<h3>Quy tắc viết chữ (笔顺规则 bǐshùn guīzé)</h3>
<pre><code>先横后竖  xiān héng hòu shù     ngang trước, sổ sau (十)
先撇后捺  xiān piě hòu nà       phẩy trước, mác sau (人)
从上到下  cóng shàng dào xià    trên trước, dưới sau (三)
从左到右  cóng zuǒ dào yòu      trái trước, phải sau (你)
从外到内  cóng wài dào nèi      ngoài trước, trong sau (回)
先中间后两边 xiān zhōngjiān hòu liǎngbiān  giữa trước, hai bên sau (小)</code></pre>
<h3>Bộ thủ thường gặp (部首 bùshǒu)</h3>
<pre><code>氵 (ba chấm thuỷ)  nước     汉 河 海
木  cây             林 森 树
亻 (nhân đứng)      người   你 他 们
口  miệng           吃 叫 名
女  nữ              她 好 妈
心/忄 tâm           想 忙 快
讠 (ngôn bên)       lời nói 说 语 认
日  mặt trời/ngày   明 时 早
月  mặt trăng/tháng 期 有 朋</code></pre>
<div class="callout"><span class="badge">Bộ thủ mở khoá nghĩa</span> 好 (hǎo, "tốt") = 女 (nữ) + 子 (con) — hình ảnh người mẹ bên con chính là "tốt". Học bộ thủ biến việc nhớ hàng ngàn chữ Hán thành nhận diện một bộ khối nhỏ hơn nhiều, dùng đi dùng lại.</div>`,
  ]]);

const c5q = quiz('cpc001-quiz-5', 'Quiz 5 — Strokes & radicals|||Quiz 5 — Nét chữ & bộ thủ', [
  { id: 'q1', question: 'Quy tắc "先横后竖" (xiān héng hòu shù) nghĩa là gì?', options: ['Viết nét sổ trước, nét ngang sau', 'Viết nét ngang trước, nét sổ sau', 'Viết từ trong ra ngoài', 'Viết từ phải sang trái'], correctIndex: 1, explanation: '先横后竖: nét ngang (横) viết trước, nét sổ (竖) viết sau, ví dụ trong chữ 十.' },
  { id: 'q2', question: 'Bộ thủ 氵 (ba chấm thuỷ) thường xuất hiện trong các chữ mang nghĩa liên quan đến gì?', options: ['Cây cối', 'Nước', 'Con người', 'Mặt trời'], correctIndex: 1, explanation: '氵 là dạng viết gọn của 水 (nước), xuất hiện trong 汉, 河, 海.' },
  { id: 'q3', question: 'Chữ 好 (hǎo, "tốt") được ghép từ hai bộ phận nào?', options: ['木 (cây) + 口 (miệng)', '女 (nữ) + 子 (con)', '心 (tâm) + 日 (ngày)', '人 (người) + 木 (cây)'], correctIndex: 1, explanation: '好 = 女 (nữ, người mẹ) + 子 (con) — hình ảnh mẹ bên con mang nghĩa "tốt".' },
]);

const c6 = doc('cpc001-6-1-shopping-money', '6.1 — Shopping, money & asking prices|||6.1 — Mua sắm, tiền bạc & hỏi giá',
  '多少钱, 元/块角/毛分; 太贵了, 便宜一点; 我要买..., 可以刷卡吗; hội thoại trả giá.',
  [[
    `<span class="eyebrow">CPC001 · Chapter 6 · Lesson 6.1</span>
<h2>Shopping, money &amp; asking prices</h2>
<h3>Asking the price</h3>
<pre><code>多少钱？      Duōshao qián?          How much money?
这个多少钱？  Zhège duōshao qián?    How much is this?
我要买...     Wǒ yào mǎi...          I want to buy...</code></pre>
<h3>Money units (人民币 rénmínbì)</h3>
<pre><code>元/块  yuán/kuài   the main unit (yuán = written/formal, kuài = spoken)
角/毛  jiǎo/máo    1/10 of a yuán (毛 = spoken)
分     fēn         1/100 of a yuán
十块五(毛)  shí kuài wǔ (máo)   =  10.5 yuán</code></pre>
<h3>Bargaining</h3>
<pre><code>太贵了       Tài guì le          too expensive
便宜一点     Piányi yìdiǎn       a bit cheaper
好吧         Hǎo ba              alright / okay then
可以刷卡吗？ Kěyǐ shuā kǎ ma?   can I pay by card?
现金 xiànjīn cash   微信支付 Wēixìn zhīfù  WeChat Pay   支付宝 Zhīfùbǎo  Alipay</code></pre>
<h3>Sample dialogue</h3>
<pre><code>A: 这件衣服多少钱？ Zhè jiàn yīfu duōshao qián? (How much is this piece of clothing?)
B: 一百五十块。 Yìbǎi wǔshí kuài. (150 yuán.)
A: 太贵了，便宜一点吧。 Tài guì le, piányi yìdiǎn ba. (Too expensive, a bit cheaper please.)
B: 好吧，一百三十块。 Hǎo ba, yìbǎi sānshí kuài. (Alright, 130 yuán.)</code></pre>
<div class="callout"><span class="badge">Tip</span> 吧 (ba) softens a sentence into a suggestion or a light request — 便宜一点吧 sounds friendlier than a flat demand.</div>`,
    `<span class="eyebrow">CPC001 · Chương 6 · Bài 6.1</span>
<h2>Mua sắm, tiền bạc &amp; hỏi giá</h2>
<h3>Hỏi giá</h3>
<pre><code>多少钱？      Duōshao qián?          Bao nhiêu tiền?
这个多少钱？  Zhège duōshao qián?    Cái này bao nhiêu tiền?
我要买...     Wǒ yào mǎi...          Tôi muốn mua...</code></pre>
<h3>Đơn vị tiền tệ (人民币 rénmínbì)</h3>
<pre><code>元/块  yuán/kuài   đơn vị chính (元 = văn viết, 块 = khẩu ngữ)
角/毛  jiǎo/máo    1/10 của một 元 (毛 = khẩu ngữ)
分     fēn         1/100 của một 元
十块五(毛)  shí kuài wǔ (máo)   =  10,5 tệ</code></pre>
<h3>Trả giá</h3>
<pre><code>太贵了       Tài guì le          đắt quá
便宜一点     Piányi yìdiǎn       rẻ hơn một chút
好吧         Hǎo ba              được rồi / thôi được
可以刷卡吗？ Kěyǐ shuā kǎ ma?   có thể quẹt thẻ không?
现金 xiànjīn tiền mặt   微信支付 Wēixìn zhīfù  WeChat Pay   支付宝 Zhīfùbǎo  Alipay</code></pre>
<h3>Hội thoại mẫu</h3>
<pre><code>A: 这件衣服多少钱？ Zhè jiàn yīfu duōshao qián? (Cái áo này bao nhiêu tiền?)
B: 一百五十块。 Yìbǎi wǔshí kuài. (150 tệ.)
A: 太贵了，便宜一点吧。 Tài guì le, piányi yìdiǎn ba. (Đắt quá, bớt chút đi.)
B: 好吧，一百三十块。 Hǎo ba, yìbǎi sānshí kuài. (Thôi được, 130 tệ.)</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Trợ từ 吧 (ba) làm câu nhẹ nhàng hơn, giống một lời đề nghị — 便宜一点吧 nghe thân thiện hơn một yêu cầu cộc lốc.</div>`,
  ]]);

const c6q = quiz('cpc001-quiz-6', 'Quiz 6 — Shopping & money|||Quiz 6 — Mua sắm & tiền bạc', [
  { id: 'q1', question: 'Câu "这个多少钱？" dùng để làm gì?', options: ['Hỏi tên món hàng', 'Hỏi giá của món hàng này', 'Hỏi giờ đóng cửa', 'Hỏi đường đi'], correctIndex: 1, explanation: '多少钱 (duōshao qián) nghĩa là "bao nhiêu tiền", dùng để hỏi giá.' },
  { id: 'q2', question: 'Trong khẩu ngữ, đơn vị tiền tệ chính (元 yuán) thường được nói là gì?', options: ['分 fēn', '块 kuài', '角 jiǎo', '毛 máo'], correctIndex: 1, explanation: '元 (yuán) là văn viết trang trọng, còn khẩu ngữ hằng ngày thường nói 块 (kuài).' },
  { id: 'q3', question: 'Câu "便宜一点吧" thể hiện điều gì?', options: ['Khen món hàng đẹp', 'Đề nghị người bán giảm giá một chút', 'Hỏi có thể trả bằng thẻ không', 'Từ chối mua hàng'], correctIndex: 1, explanation: '便宜一点 = rẻ hơn một chút; 吧 làm câu thành lời đề nghị nhẹ nhàng khi trả giá.' },
]);

const c7 = doc('cpc001-7-1-food-ordering', '7.1 — Eating & ordering food|||7.1 — Ăn uống & gọi món',
  '我饿了, 我想吃..., 服务员点菜; 米饭面条饺子汤茶; 好吃/好喝; 买单/结账.',
  [[
    `<span class="eyebrow">CPC001 · Chapter 7 · Lesson 7.1</span>
<h2>Eating &amp; ordering food</h2>
<h3>Getting ready to order</h3>
<pre><code>我饿了       Wǒ è le             I am hungry
我想吃...    Wǒ xiǎng chī...     I want to eat...
服务员！     Fúwùyuán!           Waiter/Waitress!
点菜         diǎn cài            to order dishes</code></pre>
<h3>Common foods &amp; drinks</h3>
<pre><code>米饭 mǐfàn      rice          面条 miàntiáo   noodles
饺子 jiǎozi     dumplings     汤 tāng          soup
茶 chá          tea           水 shuǐ          water</code></pre>
<h3>Talking about taste</h3>
<pre><code>好吃  hǎochī   tasty (for eating)
好喝  hǎohē    tasty (for drinking)
不要辣  bú yào là   not spicy, please</code></pre>
<h3>Sample dialogue</h3>
<pre><code>A: 服务员，我要点菜。 Fúwùyuán, wǒ yào diǎn cài. (Waiter, I would like to order.)
B: 你想吃什么？ Nǐ xiǎng chī shénme? (What would you like to eat?)
A: 我要一碗米饭和一个饺子。 Wǒ yào yì wǎn mǐfàn hé yí gè jiǎozi. (I would like a bowl of rice and a dumpling dish.)
B: 好的，请稍等。 Hǎo de, qǐng shāo děng. (Sure, please wait a moment.)
A: 买单！ Mǎidān! (Check, please!)</code></pre>
<div class="callout"><span class="badge">Measure words</span> Chinese nouns need a measure word between the number and the noun: 一碗米饭 (yì wǎn mǐfàn, one BOWL of rice), 一个饺子 (yí gè jiǎozi, one dumpling). 个 (gè) is the general-purpose measure word when in doubt.</div>`,
    `<span class="eyebrow">CPC001 · Chương 7 · Bài 7.1</span>
<h2>Ăn uống &amp; gọi món</h2>
<h3>Chuẩn bị gọi món</h3>
<pre><code>我饿了       Wǒ è le             tôi đói rồi
我想吃...    Wǒ xiǎng chī...     tôi muốn ăn...
服务员！     Fúwùyuán!           phục vụ ơi!
点菜         diǎn cài            gọi món</code></pre>
<h3>Món ăn &amp; đồ uống thường gặp</h3>
<pre><code>米饭 mǐfàn      cơm           面条 miàntiáo   mì/miến
饺子 jiǎozi     bánh sủi cảo  汤 tāng          canh/súp
茶 chá          trà           水 shuǐ          nước</code></pre>
<h3>Nói về hương vị</h3>
<pre><code>好吃  hǎochī   ngon (dùng cho món ăn)
好喝  hǎohē    ngon (dùng cho đồ uống)
不要辣  bú yào là   xin đừng cho cay</code></pre>
<h3>Hội thoại mẫu</h3>
<pre><code>A: 服务员，我要点菜。 Fúwùyuán, wǒ yào diǎn cài. (Phục vụ ơi, tôi muốn gọi món.)
B: 你想吃什么？ Nǐ xiǎng chī shénme? (Bạn muốn ăn gì?)
A: 我要一碗米饭和一个饺子。 Wǒ yào yì wǎn mǐfàn hé yí gè jiǎozi. (Tôi muốn một bát cơm và một phần sủi cảo.)
B: 好的，请稍等。 Hǎo de, qǐng shāo děng. (Được ạ, xin chờ một chút.)
A: 买单！ Mǎidān! (Tính tiền!)</code></pre>
<div class="callout"><span class="badge">Lượng từ</span> Danh từ tiếng Trung cần một lượng từ đứng giữa số đếm và danh từ: 一碗米饭 (yì wǎn mǐfàn, một BÁT cơm), 一个饺子 (yí gè jiǎozi, một phần sủi cảo). 个 (gè) là lượng từ dùng chung khi không chắc dùng lượng từ nào.</div>`,
  ]]);

const c7q = quiz('cpc001-quiz-7', 'Quiz 7 — Food & ordering|||Quiz 7 — Ăn uống & gọi món', [
  { id: 'q1', question: '好吃 (hǎochī) và 好喝 (hǎohē) khác nhau ở đâu?', options: ['好吃 dùng cho đồ uống, 好喝 dùng cho món ăn', '好吃 dùng cho món ăn, 好喝 dùng cho đồ uống', 'Cả hai đều dùng cho đồ uống', 'Không có gì khác nhau'], correctIndex: 1, explanation: '吃 (chī) = ăn nên 好吃 dùng cho món ăn; 喝 (hē) = uống nên 好喝 dùng cho đồ uống.' },
  { id: 'q2', question: 'Muốn tính tiền sau khi ăn xong, nói gì?', options: ['点菜', '买单', '好吃', '不要辣'], correctIndex: 1, explanation: '买单 (mǎidān) nghĩa là "tính tiền/thanh toán".' },
  { id: 'q3', question: 'Trong câu "一碗米饭", chữ 碗 (wǎn) đóng vai trò gì?', options: ['Là động từ chính của câu', 'Là lượng từ, đứng giữa số đếm và danh từ', 'Là tính từ chỉ vị ngon', 'Là trợ từ nghi vấn'], correctIndex: 1, explanation: '碗 (bát) là lượng từ bắt buộc giữa số 一 (một) và danh từ 米饭 (cơm).' },
]);

const c8 = doc('cpc001-8-1-review-hsk1', '8.1 — Comprehensive review & getting ready for HSK 1|||8.1 — Ôn tập tổng hợp & chuẩn bị HSK 1',
  'Hội thoại tổng hợp (chào hỏi+số+gia đình+mua sắm+ăn uống); cấu trúc đề HSK 1 (~150 từ, nghe+đọc).',
  [[
    `<span class="eyebrow">CPC001 · Chapter 8 · Lesson 8.1</span>
<h2>Comprehensive review &amp; getting ready for HSK 1</h2>
<h3>Full-length review dialogue</h3>
<pre><code>A: 你好！我叫玛丽，你叫什么名字？
   Nǐ hǎo! Wǒ jiào Mǎlì, nǐ jiào shénme míngzi?
B: 我叫王明。认识你很高兴。
   Wǒ jiào Wáng Míng. Rènshi nǐ hěn gāoxìng.
A: 你家有几口人？
   Nǐ jiā yǒu jǐ kǒu rén?
B: 我家有四口人：爸爸、妈妈、姐姐和我。
   Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.
A: 现在几点？我饿了，我们去吃饭吧。
   Xiànzài jǐ diǎn? Wǒ è le, wǒmen qù chī fàn ba.
B: 三点半。这家饭馆的饺子很好吃！
   Sān diǎn bàn. Zhè jiā fànguǎn de jiǎozi hěn hǎochī!</code></pre>
<h3>What HSK 1 tests</h3>
<p><strong>HSK 1</strong> (Hanyu Shuiping Kaoshi, level 1) checks the very basics: about <strong>150 core words</strong> and simple sentence patterns, through two sections — <strong>listening</strong> and <strong>reading</strong> (no writing section at this level). It matches exactly the topics of chapters 1-7: greetings, numbers, family, time, simple shopping and food.</p>
<h3>Study tips</h3>
<ul>
<li>Drill the <strong>four tones</strong> a little every day — most beginner mistakes are tone mistakes, not vocabulary mistakes.</li>
<li>Learn new characters by their <strong>radical</strong> (Chapter 5) — it makes them far easier to recognize and remember.</li>
<li>Practice full sentences from real dialogues (Chapters 2, 6, 7), not isolated words.</li>
<li>Reference books: <em>HSK Standard Course 1</em> (北京语言大学出版社, Jiang Liping) and <em>Integrated Chinese</em> (Cheng &amp; Tsui) both structure their early chapters around the same topics as this course.</li>
</ul>
<div class="callout"><span class="badge">Next step</span> After this course, continue with HSK Standard Course Level 2 vocabulary and grammar for a natural next step toward the HSK 1 exam and beyond.</div>`,
    `<span class="eyebrow">CPC001 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập tổng hợp &amp; chuẩn bị HSK 1</h2>
<h3>Hội thoại ôn tập tổng hợp</h3>
<pre><code>A: 你好！我叫玛丽，你叫什么名字？
   Nǐ hǎo! Wǒ jiào Mǎlì, nǐ jiào shénme míngzi?
   (Chào! Tôi tên Mary, bạn tên gì?)
B: 我叫王明。认识你很高兴。
   Wǒ jiào Wáng Míng. Rènshi nǐ hěn gāoxìng.
   (Tôi tên Vương Minh. Rất vui được quen bạn.)
A: 你家有几口人？
   Nǐ jiā yǒu jǐ kǒu rén?
   (Nhà bạn có mấy người?)
B: 我家有四口人：爸爸、妈妈、姐姐和我。
   Wǒ jiā yǒu sì kǒu rén: bàba, māma, jiějie hé wǒ.
   (Nhà tôi có bốn người: bố, mẹ, chị gái và tôi.)
A: 现在几点？我饿了，我们去吃饭吧。
   Xiànzài jǐ diǎn? Wǒ è le, wǒmen qù chī fàn ba.
   (Bây giờ mấy giờ rồi? Tôi đói rồi, mình đi ăn nhé.)
B: 三点半。这家饭馆的饺子很好吃！
   Sān diǎn bàn. Zhè jiā fànguǎn de jiǎozi hěn hǎochī!
   (3 giờ rưỡi. Sủi cảo quán này rất ngon!)</code></pre>
<h3>HSK 1 kiểm tra những gì</h3>
<p><strong>HSK 1</strong> (Hán ngữ Thuỷ bình Khảo thí, cấp 1) kiểm tra kiến thức nền tảng nhất: khoảng <strong>150 từ vựng cốt lõi</strong> và các mẫu câu đơn giản, qua hai phần — <strong>nghe</strong> và <strong>đọc</strong> (cấp này chưa có phần viết). Đề thi bám sát đúng các chủ đề của chương 1-7: chào hỏi, số đếm, gia đình, thời gian, mua sắm và ăn uống đơn giản.</p>
<h3>Mẹo tự học</h3>
<ul>
<li>Luyện <strong>bốn thanh điệu</strong> mỗi ngày một chút — hầu hết lỗi của người mới học là lỗi thanh điệu, không phải lỗi từ vựng.</li>
<li>Học chữ Hán mới theo <strong>bộ thủ</strong> (Chương 5) — giúp nhận diện và ghi nhớ dễ hơn nhiều.</li>
<li>Luyện cả câu trong hội thoại thật (Chương 2, 6, 7), không chỉ học từ rời rạc.</li>
<li>Sách tham khảo: <em>HSK Standard Course cấp 1</em> (北京语言大学出版社, Jiang Liping) và <em>Integrated Chinese</em> (Cheng &amp; Tsui) đều xây các chương đầu quanh đúng những chủ đề của môn này.</li>
</ul>
<div class="callout"><span class="badge">Bước tiếp theo</span> Sau môn này, tiếp tục với từ vựng &amp; ngữ pháp HSK Standard Course cấp 2 — bước đệm tự nhiên hướng tới kỳ thi HSK 1 và xa hơn.</div>`,
  ]]);

const c8q = quiz('cpc001-quiz-8', 'Quiz 8 — Comprehensive review & HSK 1|||Quiz 8 — Ôn tập & HSK 1', [
  { id: 'q1', question: 'HSK 1 kiểm tra khoảng bao nhiêu từ vựng cốt lõi, qua những kỹ năng nào?', options: ['500 từ, qua nghe + nói', '150 từ, qua nghe + đọc', '1000 từ, qua viết + nói', '150 từ, chỉ qua viết'], correctIndex: 1, explanation: 'HSK 1 kiểm tra khoảng 150 từ vựng cơ bản, qua hai phần nghe và đọc.' },
  { id: 'q2', question: 'Trong câu "我家有四口人：爸爸、妈妈、姐姐和我。", từ nào đóng vai trò lượng từ đếm người?', options: ['家 (jiā)', '口 (kǒu)', '和 (hé)', '有 (yǒu)'], correctIndex: 1, explanation: '口 (kǒu) là lượng từ đếm số người trong một gia đình.' },
  { id: 'q3', question: 'Theo mẹo tự học của chương này, cách hiệu quả để nhớ chữ Hán mới là gì?', options: ['Học thuộc lòng từng nét không theo quy luật', 'Học theo bộ thủ (部首) để nhận diện nhóm chữ liên quan', 'Chỉ học phiên âm, bỏ qua chữ Hán', 'Học ngẫu nhiên không cần lặp lại'], correctIndex: 1, explanation: 'Học theo bộ thủ giúp nhận ra các chữ có liên hệ về nghĩa, dễ nhớ và mở rộng vốn chữ nhanh hơn.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CPC001',
    slug: 'cpc001-preparatory-chinese',
    title: 'Preparatory Chinese',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CPC001.webp',
    shortDescription: 'Beginner Mandarin — pinyin & 4 tones, greetings, numbers/date/time, family & jobs, Hanzi strokes & radicals, shopping, ordering food, review for HSK 1. Real Hanzi + pinyin + meaning, with vocab tables, dialogues & quizzes.|||Tiếng Trung nhập môn — pinyin & 4 thanh điệu, chào hỏi, số đếm/ngày giờ, gia đình & nghề nghiệp, nét chữ & bộ thủ, mua sắm, gọi món, ôn tập HSK 1. Chữ Hán thật + pinyin + nghĩa, có bảng từ vựng, hội thoại & quiz.',
    description: 'Môn <strong>CPC001 — Preparatory Chinese</strong> (Tiếng Trung Dự bị, kỳ 1, ngành Ngôn ngữ Trung) dạy tiếng Trung THẬT từ đầu: <strong>ngữ âm pinyin</strong> (thanh mẫu, vận mẫu, bốn thanh điệu) → <strong>chào hỏi &amp; giới thiệu bản thân</strong> → <strong>số đếm, ngày tháng, thời gian</strong> → <strong>gia đình &amp; nghề nghiệp</strong> → <strong>nét cơ bản, quy tắc viết chữ Hán &amp; bộ thủ</strong> → <strong>mua sắm, hỏi giá</strong> → <strong>ăn uống, gọi món</strong> → <strong>ôn tập tổng hợp, chuẩn bị HSK 1</strong>. Bám giáo trình <em>HSK Standard Course</em> cấp 1 (北京语言大学出版社, Jiang Liping) và <em>Integrated Chinese</em> (Cheng &amp; Tsui). Mỗi chương có chữ Hán thật, pinyin có dấu thanh, bảng từ vựng, hội thoại mẫu và quiz.',
    whatYouLearn: 'Phát âm pinyin (thanh mẫu, vận mẫu, 4 thanh điệu, biến điệu thanh 3); chào hỏi, tự giới thiệu (我叫.../我是...); đếm số 0-99, ngày/tháng/giờ; từ vựng gia đình & nghề nghiệp; nét cơ bản & quy tắc viết chữ Hán, bộ thủ thường gặp (氵木亻口女心讠日月); hội thoại mua sắm, hỏi giá, trả giá; gọi món ăn, thanh toán; ôn tập tổng hợp và làm quen cấu trúc đề thi HSK 1 (khoảng 150 từ vựng).',
    requirements: 'Không cần biết tiếng Trung từ trước. Nên có bảng chữ Hán/pinyin để luyện viết, và tai nghe để luyện phát âm thanh điệu.',
  },
  sections: [
    { title: 'Chapter 1 — Pinyin: initials, finals & tones|||Chương 1 — Ngữ âm pinyin: thanh mẫu, vận mẫu & thanh điệu', description: 'Thanh mẫu, vận mẫu, bốn thanh điệu, biến điệu thanh 3.', lessons: [c1, c1q] },
    { title: 'Chapter 2 — Greetings & self-introduction|||Chương 2 — Chào hỏi & giới thiệu bản thân', description: 'Chào hỏi cơ bản, tự giới thiệu, hội thoại mẫu.', lessons: [c2, c2q] },
    { title: 'Chapter 3 — Numbers, date & time|||Chương 3 — Số đếm, ngày tháng & thời gian', description: 'Số 0-99, ngày tháng, thứ trong tuần, giờ phút.', lessons: [c3, c3q] },
    { title: 'Chapter 4 — Family & occupations|||Chương 4 — Gia đình & nghề nghiệp', description: 'Thành viên gia đình, hỏi số người, nghề nghiệp.', lessons: [c4, c4q] },
    { title: 'Chapter 5 — Strokes, stroke order & radicals|||Chương 5 — Nét cơ bản, quy tắc viết chữ & bộ thủ', description: '8 nét cơ bản, quy tắc viết, bộ thủ thường gặp.', lessons: [c5, c5q] },
    { title: 'Chapter 6 — Shopping, money & prices|||Chương 6 — Mua sắm, tiền bạc & hỏi giá', description: 'Hỏi giá, đơn vị tiền tệ, trả giá.', lessons: [c6, c6q] },
    { title: 'Chapter 7 — Eating & ordering food|||Chương 7 — Ăn uống & gọi món', description: 'Gọi món, món ăn thường gặp, thanh toán.', lessons: [c7, c7q] },
    { title: 'Chapter 8 — Review & HSK 1 prep|||Chương 8 — Ôn tập tổng hợp & chuẩn bị HSK 1', description: 'Hội thoại tổng hợp, cấu trúc đề HSK 1, mẹo tự học.', lessons: [c8, c8q] },
  ],
};
