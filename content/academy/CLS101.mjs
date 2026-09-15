/**
 * CLS101 — Chinese Listening & Speaking Skills 1. Giáo trình tham khảo (trích
 * dẫn, KHÔNG upload PDF): "HSK Standard Course 1-2 (听说)"; "Short-term
 * Spoken Chinese: Threshold" (北京大学出版社, Ma Jianfei). Trình độ HSK1-2.
 * ⚠️ Môn KỸ NĂNG NGHE-NÓI: trọng tâm phát âm/thanh điệu, nghe hiểu, hội thoại,
 * phản xạ nói — không phải môn tổng hợp (khác CIC101). Nhiều hội thoại mẫu +
 * mẹo luyện nghe/phát âm. Giữ NGUYÊN slug/semester/thumb. Song ngữ EN/VI +
 * chữ Hán (汉字) + pinyin có dấu thanh thật. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('cls101-0-1-overview', 'Course overview: Listening & speaking, not grammar drills|||Tổng quan: Nghe - nói, không phải học ngữ pháp suông',
  'Vì sao đây là môn kỹ năng nghe-nói (khác môn tổng hợp); lộ trình 8 chương từ thanh điệu đến hội thoại tổng hợp; phương pháp shadowing.',
  [[
    `<span class="eyebrow">CLS101 · Lesson 0.1 · Overview</span>
<h2>Chinese Listening &amp; Speaking Skills 1</h2>
<p class="lead">This course trains your <strong>ear and mouth</strong>, not your grammar notebook. Every chapter centers on a real dialogue you listen to, break down, and repeat out loud until it becomes reflex — the HSK1-2 level target of "Standard Course 1-2 (听说)" and "Short-term Spoken Chinese: Threshold".</p>
<h3>Roadmap</h3>
<ol>
<li>Pronunciation &amp; the 4 tones — training your ear before your mouth</li>
<li>Greetings &amp; self-introduction</li>
<li>Asking personal info &amp; phone numbers</li>
<li>Time &amp; making appointments</li>
<li>Shopping &amp; asking prices</li>
<li>Dining &amp; ordering food</li>
<li>Asking for &amp; giving directions</li>
<li>Review: mixed dialogues &amp; reflex drills</li>
</ol>
<h3>The one method that works: shadowing</h3>
<p>Listen to a short line → pause → repeat it out loud, matching rhythm and tone, not just words. Do this 5-10 times per line before moving on. Reading pinyin silently does NOT train listening — your ear only improves from audio you actually hear and imitate.</p>`,
    `<span class="eyebrow">CLS101 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng Nghe - Nói tiếng Trung 1</h2>
<p class="lead">Đây là môn luyện <strong>tai và miệng</strong>, không phải vở ngữ pháp. Mỗi chương xoay quanh một hội thoại thật mà bạn nghe, phân tích rồi lặp lại thành tiếng cho đến khi thành phản xạ — đúng mục tiêu trình độ HSK1-2 của "HSK Standard Course 1-2 (听说)" và "Short-term Spoken Chinese: Threshold".</p>
<h3>Lộ trình</h3>
<ol>
<li>Phát âm &amp; 4 thanh điệu — luyện tai trước khi luyện miệng</li>
<li>Chào hỏi &amp; tự giới thiệu</li>
<li>Hỏi thông tin cá nhân &amp; số điện thoại</li>
<li>Thời gian &amp; hẹn gặp</li>
<li>Mua sắm &amp; hỏi giá</li>
<li>Ăn uống &amp; gọi món</li>
<li>Hỏi đường &amp; chỉ đường</li>
<li>Ôn tập: hội thoại tổng hợp &amp; phản xạ</li>
</ol>
<h3>Một phương pháp duy nhất thật sự hiệu quả: shadowing</h3>
<p>Nghe một câu ngắn → dừng → nói lại thành tiếng, bám đúng nhịp và thanh điệu, không chỉ đúng từ. Lặp 5-10 lần mỗi câu trước khi qua câu khác. Đọc pinyin trong đầu KHÔNG luyện được kỹ năng nghe — tai chỉ tiến bộ nhờ âm thanh thật bạn nghe và bắt chước.</p>`,
  ]]);

const c1 = doc('cls101-1-1-tones', '1.1 — Pronunciation & the 4 tones|||1.1 — Phát âm & 4 thanh điệu',
  'Cấu trúc âm tiết pinyin (thanh mẫu/vận mẫu/thanh điệu); 4 thanh + thanh nhẹ qua ví dụ mā/má/mǎ/mà; mẹo nghe phân biệt thanh 2 và thanh 3.',
  [[
    `<span class="eyebrow">CLS101 · Chapter 1 · Lesson 1.1</span>
<h2>Pronunciation &amp; the 4 tones</h2>
<h3>How a pinyin syllable is built</h3>
<p>Every syllable = <strong>initial</strong> (consonant, e.g. <code>m-</code>) + <strong>final</strong> (vowel, e.g. <code>-a</code>) + <strong>tone</strong> (pitch shape). Same sounds, different tone = different word — this is why tones are not decoration, they carry meaning.</p>
<pre><code>Tone 1 (ā) flat, high      — 妈 mā  = mother
Tone 2 (á) rising          — 麻 má  = hemp / numb
Tone 3 (ǎ) dip then rise   — 马 mǎ  = horse
Tone 4 (à) sharp fall      — 骂 mà  = to scold
Neutral (a) short, light   — 吗 ma  = question particle
</code></pre>
<h3>Ear drill: tone pairs</h3>
<p>Listen for the SHAPE of the pitch, not the word. Two common confusions for beginners:</p>
<ul>
<li><strong>Tone 2 vs Tone 3</strong> — both dip low; Tone 2 always ENDS rising, Tone 3 (alone) ends flat-low. Play a native recording, hum along without words first.</li>
<li><strong>Tone 3 + Tone 3</strong> — sandhi rule: the first becomes Tone 2. E.g. <code>你好 nǐ hǎo</code> is spoken as <code>ní hǎo</code>.</li>
</ul>
<pre><code>Practice set (listen, then say aloud):
 mā - má - mǎ - mà
 bā - bá - bǎ - bà
 wǒ hěn hǎo   (wǒ + hěn both Tone 3 -> wó hěn hǎo)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Before checking pinyin, guess the tone from the AUDIO alone. Right or wrong, saying your guess out loud trains the ear-to-mouth link faster than silent reading.</div>`,
    `<span class="eyebrow">CLS101 · Chương 1 · Bài 1.1</span>
<h2>Phát âm &amp; 4 thanh điệu</h2>
<h3>Một âm tiết pinyin được ghép ra sao</h3>
<p>Mỗi âm tiết = <strong>thanh mẫu</strong> (phụ âm đầu, vd <code>m-</code>) + <strong>vận mẫu</strong> (nguyên âm, vd <code>-a</code>) + <strong>thanh điệu</strong> (đường nét cao độ). Cùng âm, khác thanh = khác nghĩa hoàn toàn — vì vậy thanh điệu không phải trang trí mà mang nghĩa.</p>
<pre><code>Thanh 1 (ā) ngang, cao       — 妈 mā  = mẹ
Thanh 2 (á) đi lên           — 麻 má  = cây gai / tê
Thanh 3 (ǎ) xuống rồi lên    — 马 mǎ  = ngựa
Thanh 4 (à) rơi mạnh xuống   — 骂 mà  = mắng, chửi
Thanh nhẹ (a) ngắn, nhẹ      — 吗 ma  = trợ từ nghi vấn
</code></pre>
<h3>Luyện tai: cặp thanh điệu</h3>
<p>Nghe HÌNH DẠNG cao độ, đừng cố nghe ra chữ trước. Hai lỗi phổ biến của người mới học:</p>
<ul>
<li><strong>Thanh 2 và thanh 3</strong> — cả hai đều đi xuống trước; thanh 2 LUÔN kết thúc đi lên, thanh 3 (đứng riêng) kết thúc bằng, thấp. Mở bản ghi âm người bản xứ, ậm ừ theo giai điệu trước khi nói từ.</li>
<li><strong>Thanh 3 + thanh 3</strong> — quy tắc biến điệu: chữ đầu đổi thành thanh 2. Vd <code>你好 nǐ hǎo</code> khi nói thành <code>ní hǎo</code>.</li>
</ul>
<pre><code>Bộ luyện tập (nghe rồi nói theo):
 mā - má - mǎ - mà
 bā - bá - bǎ - bà
 我很好 wǒ hěn hǎo   (wǒ + hěn cùng thanh 3 -> đọc wó hěn hǎo)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Trước khi xem pinyin, hãy đoán thanh điệu chỉ từ ÂM THANH. Đúng hay sai, nói to phỏng đoán của bạn luyện đường nối tai-miệng nhanh hơn đọc thầm.</div>`,
  ]]);

const c1q = quiz('cls101-quiz-1', 'Quiz 1 — Pronunciation & tones|||Quiz 1 — Phát âm & thanh điệu', [
  { id: 'q1', question: 'Chữ "骂" (mà) mang thanh điệu số mấy?', options: ['Thanh 1 — ngang, cao', 'Thanh 2 — đi lên', 'Thanh 3 — xuống rồi lên', 'Thanh 4 — rơi mạnh'], correctIndex: 3, explanation: 'Mà (骂, mắng) là thanh 4 — âm rơi mạnh và nhanh từ cao xuống thấp.' },
  { id: 'q2', question: '"你好" (nǐ hǎo) khi nói ra thực tế nghe giống cách đọc nào?', options: ['ni hao (giữ nguyên hai thanh 3)', 'ní hǎo (chữ đầu đổi sang thanh 2)', 'nì hào (đổi cả hai sang thanh 4)', 'nī hao (đổi cả hai sang thanh 1)'], correctIndex: 1, explanation: 'Quy tắc biến điệu: hai thanh 3 liền nhau, chữ đầu đổi thành thanh 2 khi nói — "ní hǎo".' },
  { id: 'q3', question: 'Một âm tiết pinyin được ghép từ những phần nào?', options: ['Chỉ nguyên âm và thanh điệu', 'Thanh mẫu (phụ âm) + vận mẫu (nguyên âm) + thanh điệu', 'Chỉ chữ Hán, không cần thanh điệu', 'Thanh mẫu và chữ Hán, bỏ vận mẫu'], correctIndex: 1, explanation: 'Mỗi âm tiết = thanh mẫu + vận mẫu + thanh điệu; đổi thanh điệu là đổi nghĩa của từ.' },
]);

const c2 = doc('cls101-2-1-greetings', '2.1 — Greetings & self-introduction|||2.1 — Chào hỏi & tự giới thiệu',
  'Hội thoại chào hỏi cơ bản (你好/你好吗/谢谢/再见); mẫu câu tự giới thiệu tên, quốc tịch (你叫什么名字/你是哪国人); mẹo nghe phản xạ nhanh.',
  [[
    `<span class="eyebrow">CLS101 · Chapter 2 · Lesson 2.1</span>
<h2>Greetings &amp; self-introduction</h2>
<h3>Core dialogue — listen, then shadow</h3>
<pre><code>A: 你好！          Nǐ hǎo!            Hello!
B: 你好！你好吗？   Nǐ hǎo! Nǐ hǎo ma? Hi! How are you?
A: 我很好，谢谢。你呢？
   Wǒ hěn hǎo, xièxie. Nǐ ne?
   I'm fine, thanks. And you?
B: 我也很好。       Wǒ yě hěn hǎo.     I'm fine too.
A: 你叫什么名字？   Nǐ jiào shénme míngzi?  What's your name?
B: 我叫小明。你呢？ Wǒ jiào Xiǎomíng. Nǐ ne?  I'm Xiaoming. And you?
A: 我叫玛丽。       Wǒ jiào Mǎlì.      I'm Mary.
B: 你是哪国人？     Nǐ shì nǎ guó rén? Which country are you from?
A: 我是越南人。     Wǒ shì Yuènán rén. I'm Vietnamese.
B: 再见！           Zàijiàn!           Bye!
A: 再见！           Zàijiàn!           Bye!
</code></pre>
<h3>Key phrases</h3>
<ul>
<li><strong>你好 (nǐ hǎo)</strong> — hello; <strong>谢谢 (xièxie)</strong> — thank you; <strong>不客气 (bú kèqi)</strong> — you're welcome</li>
<li><strong>叫 (jiào)</strong> — to be named; <strong>名字 (míngzi)</strong> — name; <strong>哪国人 (nǎ guó rén)</strong> — which nationality</li>
<li><strong>呢 (ne)</strong> — "and ...?" — the fastest way to bounce a question back</li>
</ul>
<div class="callout"><span class="badge">Reflex drill</span> Cover the pinyin, play only the audio, and answer out loud in under 2 seconds when you hear <code>你好吗？</code> or <code>你叫什么名字？</code>. Real conversation doesn't wait for you to translate.</div>`,
    `<span class="eyebrow">CLS101 · Chương 2 · Bài 2.1</span>
<h2>Chào hỏi &amp; tự giới thiệu</h2>
<h3>Hội thoại chính — nghe rồi shadow theo</h3>
<pre><code>A: 你好！          Nǐ hǎo!            Xin chào!
B: 你好！你好吗？   Nǐ hǎo! Nǐ hǎo ma? Chào! Bạn khỏe không?
A: 我很好，谢谢。你呢？
   Wǒ hěn hǎo, xièxie. Nǐ ne?
   Tôi khỏe, cảm ơn. Còn bạn?
B: 我也很好。       Wǒ yě hěn hǎo.     Tôi cũng khỏe.
A: 你叫什么名字？   Nǐ jiào shénme míngzi?  Bạn tên là gì?
B: 我叫小明。你呢？ Wǒ jiào Xiǎomíng. Nǐ ne?  Tôi tên Tiểu Minh. Còn bạn?
A: 我叫玛丽。       Wǒ jiào Mǎlì.      Tôi tên Mary.
B: 你是哪国人？     Nǐ shì nǎ guó rén? Bạn là người nước nào?
A: 我是越南人。     Wǒ shì Yuènán rén. Tôi là người Việt Nam.
B: 再见！           Zàijiàn!           Tạm biệt!
A: 再见！           Zàijiàn!           Tạm biệt!
</code></pre>
<h3>Cụm từ chính</h3>
<ul>
<li><strong>你好 (nǐ hǎo)</strong> — xin chào; <strong>谢谢 (xièxie)</strong> — cảm ơn; <strong>不客气 (bú kèqi)</strong> — không có gì</li>
<li><strong>叫 (jiào)</strong> — tên là; <strong>名字 (míngzi)</strong> — tên; <strong>哪国人 (nǎ guó rén)</strong> — người nước nào</li>
<li><strong>呢 (ne)</strong> — "còn ...?" — cách hỏi ngược nhanh nhất</li>
</ul>
<div class="callout"><span class="badge">Luyện phản xạ</span> Che pinyin đi, chỉ nghe âm thanh, trả lời thành tiếng trong dưới 2 giây khi nghe <code>你好吗？</code> hoặc <code>你叫什么名字？</code>. Hội thoại thật không chờ bạn dịch xong.</div>`,
  ]]);

const c2q = quiz('cls101-quiz-2', 'Quiz 2 — Greetings & introduction|||Quiz 2 — Chào hỏi & giới thiệu', [
  { id: 'q1', question: '"你叫什么名字？" dùng để hỏi điều gì?', options: ['Hỏi tuổi', 'Hỏi tên', 'Hỏi quốc tịch', 'Hỏi số điện thoại'], correctIndex: 1, explanation: '叫 (jiào) = tên là; 名字 (míngzi) = tên → cả câu nghĩa là "Bạn tên là gì?".' },
  { id: 'q2', question: 'Khi ai đó nói "谢谢" (xièxie) với bạn, câu đáp lịch sự nhất là?', options: ['再见 (zàijiàn)', '你好吗 (nǐ hǎo ma)', '不客气 (bú kèqi)', '我是越南人 (wǒ shì Yuènán rén)'], correctIndex: 2, explanation: '不客气 (bú kèqi) = "không có gì" — câu đáp chuẩn cho lời cảm ơn.' },
  { id: 'q3', question: 'Từ "呢" (ne) trong "我很好，你呢？" có vai trò gì?', options: ['Phủ định câu trước', 'Hỏi ngược lại, nghĩa là "còn ... thì sao?"', 'Kết thúc câu chào', 'Chỉ số nhiều'], correctIndex: 1, explanation: '呢 (ne) dùng để bật câu hỏi ngược ngắn gọn: "còn bạn thì sao?".' },
]);

const c3 = doc('cls101-3-1-personal-info', '3.1 — Personal info & phone numbers|||3.1 — Thông tin cá nhân & số điện thoại',
  'Hội thoại hỏi tuổi, số điện thoại; cách đọc số 0-100 (零/一/二/三...); mẹo nghe số đọc nhanh và số dễ nhầm (4≠10).',
  [[
    `<span class="eyebrow">CLS101 · Chapter 3 · Lesson 3.1</span>
<h2>Personal info &amp; phone numbers</h2>
<h3>Numbers 0-10 — the foundation for everything</h3>
<pre><code>0 零 líng   1 一 yī   2 二 èr   3 三 sān   4 四 sì
5 五 wǔ    6 六 liù   7 七 qī   8 八 bā    9 九 jiǔ    10 十 shí
11 十一 shíyī   20 二十 èrshí   35 三十五 sānshíwǔ
</code></pre>
<h3>Dialogue — asking age &amp; phone number</h3>
<pre><code>A: 你多大了？        Nǐ duō dà le?          How old are you?
B: 我二十岁。你呢？  Wǒ èrshí suì. Nǐ ne?   I'm 20. And you?
A: 我二十一岁。      Wǒ èrshíyī suì.        I'm 21.
A: 你的电话号码是多少？
   Nǐ de diànhuà hàomǎ shì duōshao?
   What's your phone number?
B: 我的电话号码是一三九，八八八，六六零六。
   Wǒ de diànhuà hàomǎ shì yāo sān jiǔ, bā bā bā, liù liù líng liù.
   My number is 139-888-6606.
</code></pre>
<div class="callout"><span class="badge">Two listening traps</span>
<ul>
<li><strong>四 (sì) vs 十 (shí)</strong> — very different tones/sounds but beginners still mix them up by rhythm alone; always confirm the FINAL sound (<code>-ì</code> vs <code>-í</code>).</li>
<li><strong>In phone numbers, 一 (yī) is read "yāo"</strong> to avoid confusion with 七 (qī) over a noisy line — a real spoken-Chinese convention, not a textbook rule.</li>
</ul></div>`,
    `<span class="eyebrow">CLS101 · Chương 3 · Bài 3.1</span>
<h2>Thông tin cá nhân &amp; số điện thoại</h2>
<h3>Số 0-10 — nền tảng của mọi thứ</h3>
<pre><code>0 零 líng   1 一 yī   2 二 èr   3 三 sān   4 四 sì
5 五 wǔ    6 六 liù   7 七 qī   8 八 bā    9 九 jiǔ    10 十 shí
11 十一 shíyī   20 二十 èrshí   35 三十五 sānshíwǔ
</code></pre>
<h3>Hội thoại — hỏi tuổi &amp; số điện thoại</h3>
<pre><code>A: 你多大了？        Nǐ duō dà le?          Bạn bao nhiêu tuổi?
B: 我二十岁。你呢？  Wǒ èrshí suì. Nǐ ne?   Tôi 20 tuổi. Còn bạn?
A: 我二十一岁。      Wǒ èrshíyī suì.        Tôi 21 tuổi.
A: 你的电话号码是多少？
   Nǐ de diànhuà hàomǎ shì duōshao?
   Số điện thoại của bạn là bao nhiêu?
B: 我的电话号码是一三九，八八八，六六零六。
   Wǒ de diànhuà hàomǎ shì yāo sān jiǔ, bā bā bā, liù liù líng liù.
   Số của tôi là 139-888-6606.
</code></pre>
<div class="callout"><span class="badge">Hai bẫy khi nghe</span>
<ul>
<li><strong>四 (sì) và 十 (shí)</strong> — thanh điệu/âm khác hẳn nhau nhưng người mới vẫn dễ lẫn nếu chỉ nghe nhịp; luôn nghe kỹ ÂM CUỐI (<code>-ì</code> so với <code>-í</code>).</li>
<li><strong>Trong số điện thoại, 一 (yī) được đọc thành "yāo"</strong> để tránh nhầm với 七 (qī) khi đường truyền ồn — đây là quy ước nói thật, không có trong sách vở cứng nhắc.</li>
</ul></div>`,
  ]]);

const c3q = quiz('cls101-quiz-3', 'Quiz 3 — Personal info & phone numbers|||Quiz 3 — Thông tin cá nhân & số điện thoại', [
  { id: 'q1', question: '"你多大了？" dùng để hỏi gì?', options: ['Hỏi tên', 'Hỏi tuổi', 'Hỏi số điện thoại', 'Hỏi quốc tịch'], correctIndex: 1, explanation: '多大 (duō dà) = bao nhiêu tuổi (lớn cỡ nào) → câu hỏi tuổi.' },
  { id: 'q2', question: 'Trong số điện thoại nói miệng, số "一" (yī) thường được đọc thành gì để tránh nhầm lẫn?', options: ['"yāo"', '"èr"', '"shí"', 'Vẫn giữ nguyên "yī"'], correctIndex: 0, explanation: 'Khi đọc số điện thoại, 一 được đọc "yāo" để không lẫn với 七 (qī) qua điện thoại.' },
  { id: 'q3', question: 'Cặp số nào dễ bị nghe nhầm nhất với người mới học?', options: ['一 (yī) và 二 (èr)', '四 (sì) và 十 (shí)', '五 (wǔ) và 六 (liù)', '八 (bā) và 九 (jiǔ)'], correctIndex: 1, explanation: '四 (sì) và 十 (shí) có âm cuối khác nhưng người mới dễ lẫn nếu chỉ nghe qua nhịp điệu.' },
]);

const c4 = doc('cls101-4-1-time-appointments', '4.1 — Time & making appointments|||4.1 — Thời gian & hẹn gặp',
  'Cách nói giờ (点/分/半/刻), ngày trong tuần (星期); hội thoại hẹn gặp; mẹo nghe giờ đọc nhanh trong hội thoại tự nhiên.',
  [[
    `<span class="eyebrow">CLS101 · Chapter 4 · Lesson 4.1</span>
<h2>Time &amp; making appointments</h2>
<h3>Telling time</h3>
<pre><code>点 diǎn  = o'clock       分 fēn = minute
半 bàn   = half (:30)    刻 kè  = quarter (15 min)
3:00  三点        sān diǎn
3:15  三点一刻     sān diǎn yí kè
3:30  三点半       sān diǎn bàn
3:45  三点三刻 / 差一刻四点   sān diǎn sān kè / chà yí kè sì diǎn
</code></pre>
<h3>Days of the week</h3>
<pre><code>星期一 xīngqīyī Mon  星期二 xīngqī'èr Tue  星期三 xīngqīsān Wed
星期四 xīngqīsì Thu  星期五 xīngqīwǔ Fri  星期六 xīngqīliù Sat
星期天/星期日 xīngqītiān / xīngqīrì Sun
</code></pre>
<h3>Dialogue — making an appointment</h3>
<pre><code>A: 现在几点？          Xiànzài jǐ diǎn?          What time is it now?
B: 现在三点半。        Xiànzài sān diǎn bàn.     It's 3:30 now.
A: 我们几点见面？      Wǒmen jǐ diǎn jiànmiàn?   What time shall we meet?
B: 下午四点，怎么样？  Xiàwǔ sì diǎn, zěnmeyàng? 4 pm, how about it?
A: 好，明天见！        Hǎo, míngtiān jiàn!       Great, see you tomorrow!
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Native speakers slur <code>几点</code> (jǐ diǎn) into something close to <code>jídiǎn</code> — listen for the whole two-syllable shape, not each syllable cleanly separated.</div>`,
    `<span class="eyebrow">CLS101 · Chương 4 · Bài 4.1</span>
<h2>Thời gian &amp; hẹn gặp</h2>
<h3>Cách nói giờ</h3>
<pre><code>点 diǎn  = giờ            分 fēn = phút
半 bàn   = rưỡi (:30)     刻 kè  = 15 phút (một khắc)
3:00  三点        sān diǎn
3:15  三点一刻     sān diǎn yí kè
3:30  三点半       sān diǎn bàn
3:45  三点三刻 / 差一刻四点   sān diǎn sān kè / chà yí kè sì diǎn
</code></pre>
<h3>Các ngày trong tuần</h3>
<pre><code>星期一 xīngqīyī Thứ 2  星期二 xīngqī'èr Thứ 3  星期三 xīngqīsān Thứ 4
星期四 xīngqīsì Thứ 5  星期五 xīngqīwǔ Thứ 6  星期六 xīngqīliù Thứ 7
星期天/星期日 xīngqītiān / xīngqīrì Chủ nhật
</code></pre>
<h3>Hội thoại — hẹn gặp</h3>
<pre><code>A: 现在几点？          Xiànzài jǐ diǎn?          Bây giờ mấy giờ?
B: 现在三点半。        Xiànzài sān diǎn bàn.     Bây giờ 3 giờ rưỡi.
A: 我们几点见面？      Wǒmen jǐ diǎn jiànmiàn?   Chúng ta gặp nhau lúc mấy giờ?
B: 下午四点，怎么样？  Xiàwǔ sì diǎn, zěnmeyàng? 4 giờ chiều, được không?
A: 好，明天见！        Hǎo, míngtiān jiàn!       Được, hẹn gặp lại ngày mai!
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Người bản xứ nói lướt <code>几点</code> (jǐ diǎn) gần như dính thành <code>jídiǎn</code> — hãy nghe cả HÌNH DẠNG hai âm tiết chứ đừng cố tách rời từng chữ.</div>`,
  ]]);

const c4q = quiz('cls101-quiz-4', 'Quiz 4 — Time & appointments|||Quiz 4 — Thời gian & hẹn gặp', [
  { id: 'q1', question: '"三点半" (sān diǎn bàn) nghĩa là mấy giờ?', options: ['3 giờ đúng', '3 giờ 15', '3 giờ rưỡi (3:30)', '3 giờ 45'], correctIndex: 2, explanation: '半 (bàn) = rưỡi/nửa → 三点半 = 3 giờ rưỡi (3:30).' },
  { id: 'q2', question: '"刻" (kè) trong cách nói giờ tiếng Trung tương đương bao nhiêu phút?', options: ['5 phút', '10 phút', '15 phút', '30 phút'], correctIndex: 2, explanation: '刻 (kè) = một khắc = 15 phút, dùng như "quarter" trong tiếng Anh.' },
  { id: 'q3', question: '"我们几点见面？" dùng để hỏi điều gì?', options: ['Hỏi hôm nay thứ mấy', 'Hỏi mấy giờ gặp nhau', 'Hỏi địa điểm gặp', 'Hỏi tên người gặp'], correctIndex: 1, explanation: '几点 (jǐ diǎn) = mấy giờ; 见面 (jiànmiàn) = gặp mặt → hỏi giờ hẹn gặp.' },
]);

const c5 = doc('cls101-5-1-shopping-prices', '5.1 — Shopping & asking prices|||5.1 — Mua sắm & hỏi giá',
  'Đơn vị tiền tệ (元/块, 角/毛, 分); mẫu câu hỏi giá, trả giá (太贵了/便宜点儿); mẹo nghe số tiền đọc nhanh, dễ nhầm hàng chục/hàng trăm.',
  [[
    `<span class="eyebrow">CLS101 · Chapter 5 · Lesson 5.1</span>
<h2>Shopping &amp; asking prices</h2>
<h3>Money units</h3>
<pre><code>元/块 yuán/kuài = "dollar" unit (块 kuài is spoken, 元 yuán is written)
角/毛 jiǎo/máo  = 1/10 yuan (毛 máo is spoken)
分 fēn          = 1/100 yuan (rarely used today)
15.50 yuan = 十五块五(毛)  shíwǔ kuài wǔ (máo)
</code></pre>
<h3>Dialogue — at a market stall</h3>
<pre><code>A: 这个多少钱？        Zhège duōshao qián?       How much is this?
B: 三十五块。          Sānshíwǔ kuài.            35 yuan.
A: 太贵了！便宜一点儿吧。
   Tài guì le! Piányi yìdiǎnr ba.
   Too expensive! Cheaper please.
B: 好吧，三十块。      Hǎo ba, sānshí kuài.      OK, 30 yuan.
A: 谢谢，我要这个。    Xièxie, wǒ yào zhège.     Thanks, I'll take this.
</code></pre>
<div class="callout"><span class="badge">Listening trap</span> <strong>三十 (sānshí, 30)</strong> vs <strong>十三 (shísān, 13)</strong> — same two syllables, REVERSED order and stress. In fast speech only the stress pattern tells them apart; always ask <code>多少钱？</code> again if unsure rather than guess.</div>`,
    `<span class="eyebrow">CLS101 · Chương 5 · Bài 5.1</span>
<h2>Mua sắm &amp; hỏi giá</h2>
<h3>Đơn vị tiền tệ</h3>
<pre><code>元/块 yuán/kuài = đơn vị "đồng" (块 kuài dùng khi nói, 元 yuán dùng khi viết)
角/毛 jiǎo/máo  = 1/10 đồng (毛 máo dùng khi nói)
分 fēn          = 1/100 đồng (ngày nay hiếm dùng)
15.50 tệ = 十五块五(毛)  shíwǔ kuài wǔ (máo)
</code></pre>
<h3>Hội thoại — ở quầy hàng</h3>
<pre><code>A: 这个多少钱？        Zhège duōshao qián?       Cái này bao nhiêu tiền?
B: 三十五块。          Sānshíwǔ kuài.            35 tệ.
A: 太贵了！便宜一点儿吧。
   Tài guì le! Piányi yìdiǎnr ba.
   Đắt quá! Bớt chút đi.
B: 好吧，三十块。      Hǎo ba, sānshí kuài.      Được, 30 tệ vậy.
A: 谢谢，我要这个。    Xièxie, wǒ yào zhège.     Cảm ơn, tôi lấy cái này.
</code></pre>
<div class="callout"><span class="badge">Bẫy khi nghe</span> <strong>三十 (sānshí, 30)</strong> và <strong>十三 (shísān, 13)</strong> — cùng hai âm tiết nhưng ĐẢO thứ tự và trọng âm. Nói nhanh chỉ còn cách phân biệt bằng trọng âm; nếu chưa chắc, hỏi lại <code>多少钱？</code> thay vì đoán liều.</div>`,
  ]]);

const c5q = quiz('cls101-quiz-5', 'Quiz 5 — Shopping & prices|||Quiz 5 — Mua sắm & hỏi giá', [
  { id: 'q1', question: '"太贵了" (tài guì le) nghĩa là gì?', options: ['Rẻ quá', 'Đắt quá', 'Bao nhiêu tiền', 'Tôi muốn mua'], correctIndex: 1, explanation: '太...了 (tài...le) = quá; 贵 (guì) = đắt → "đắt quá".' },
  { id: 'q2', question: 'Đơn vị nào dùng khi NÓI để chỉ 1/10 đồng (yuan)?', options: ['块 (kuài)', '元 (yuán)', '毛 (máo)', '分 (fēn)'], correctIndex: 2, explanation: '毛 (máo) là cách nói miệng của 角 (jiǎo), bằng 1/10 yuan.' },
  { id: 'q3', question: 'Vì sao "三十" (sānshí, 30) và "十三" (shísān, 13) dễ bị nghe nhầm?', options: ['Vì chúng viết giống hệt nhau', 'Vì cùng hai âm tiết nhưng đảo thứ tự, chỉ khác trọng âm', 'Vì cùng thanh điệu với 四 (sì)', 'Vì đều là số chẵn'], correctIndex: 1, explanation: 'Hai số dùng đúng hai âm tiết sān và shí nhưng đảo vị trí — nói nhanh dễ lẫn nếu không để ý trọng âm.' },
]);

const c6 = doc('cls101-6-1-dining-ordering', '6.1 — Dining & ordering food|||6.1 — Ăn uống & gọi món',
  'Từ vựng nhà hàng, lượng từ (碗/盘/杯); hội thoại gọi món, tính tiền; mẹo nghe từ chỉ số lượng đứng trước danh từ món ăn.',
  [[
    `<span class="eyebrow">CLS101 · Chapter 6 · Lesson 6.1</span>
<h2>Dining &amp; ordering food</h2>
<h3>Restaurant vocabulary</h3>
<pre><code>服务员 fúwùyuán  waiter/waitress     菜单 càidān  menu
米饭 mǐfàn  rice        面条 miàntiáo noodles    饺子 jiǎozi dumplings
茶 chá  tea             啤酒 píjiǔ beer
碗 wǎn (bowl)  盘 pán (plate)  杯 bēi (cup/glass)  — measure words for food/drink
</code></pre>
<h3>Dialogue — ordering at a restaurant</h3>
<pre><code>服务员: 你要点什么？    Nǐ yào diǎn shénme?     What would you like to order?
顾客:  我要一碗米饭，   Wǒ yào yì wǎn mǐfàn,     I'd like a bowl of rice,
       一盘饺子，        yì pán jiǎozi,           a plate of dumplings,
       还有一杯茶。      hái yǒu yì bēi chá.      and a cup of tea.
服务员: 好的，请稍等。   Hǎode, qǐng shāo děng.   OK, please wait a moment.
顾客:  服务员，买单！    Fúwùyuán, mǎidān!        Waiter, the bill please!
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> A number NEVER attaches directly to a food noun — it always needs a measure word: <code>一碗米饭</code> (not <code>一米饭</code>). Listen for "number + measure word" as ONE chunk before the food name arrives.</div>`,
    `<span class="eyebrow">CLS101 · Chương 6 · Bài 6.1</span>
<h2>Ăn uống &amp; gọi món</h2>
<h3>Từ vựng nhà hàng</h3>
<pre><code>服务员 fúwùyuán  phục vụ            菜单 càidān  thực đơn
米饭 mǐfàn  cơm          面条 miàntiáo mì/phở    饺子 jiǎozi bánh chẻo
茶 chá  trà              啤酒 píjiǔ bia
碗 wǎn (bát)  盘 pán (đĩa)  杯 bēi (ly/cốc)  — lượng từ cho đồ ăn/uống
</code></pre>
<h3>Hội thoại — gọi món ở nhà hàng</h3>
<pre><code>服务员: 你要点什么？    Nǐ yào diǎn shénme?     Anh/chị muốn gọi món gì?
顾客:  我要一碗米饭，   Wǒ yào yì wǎn mǐfàn,     Tôi muốn một bát cơm,
       一盘饺子，        yì pán jiǎozi,           một đĩa bánh chẻo,
       还有一杯茶。      hái yǒu yì bēi chá.      và một ly trà.
服务员: 好的，请稍等。   Hǎode, qǐng shāo děng.   Được, xin đợi một chút.
顾客:  服务员，买单！    Fúwùyuán, mǎidān!        Phục vụ ơi, tính tiền!
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Một con số KHÔNG BAO GIỜ đứng thẳng trước danh từ món ăn — luôn cần lượng từ ở giữa: <code>一碗米饭</code> (không phải <code>一米饭</code>). Hãy nghe cụm "số + lượng từ" như MỘT khối trước khi tên món ăn xuất hiện.</div>`,
  ]]);

const c6q = quiz('cls101-quiz-6', 'Quiz 6 — Dining & ordering|||Quiz 6 — Ăn uống & gọi món', [
  { id: 'q1', question: '"服务员，买单！" dùng để làm gì?', options: ['Gọi món ăn', 'Xin thực đơn', 'Yêu cầu tính tiền', 'Hỏi giờ mở cửa'], correctIndex: 2, explanation: '买单 (mǎidān) = thanh toán/tính tiền → câu này gọi phục vụ tính tiền.' },
  { id: 'q2', question: 'Lượng từ nào đi với "一...米饭" (một bát cơm)?', options: ['盘 (pán)', '碗 (wǎn)', '杯 (bēi)', 'Không cần lượng từ'], correctIndex: 1, explanation: '碗 (wǎn, bát) là lượng từ chuẩn cho cơm/mì trong bát: 一碗米饭.' },
  { id: 'q3', question: 'Vì sao khi nghe tiếng Trung không thể nói "一米饭" mà phải là "一碗米饭"?', options: ['Vì 米饭 là động từ', 'Vì số từ tiếng Trung luôn cần một lượng từ đứng giữa số và danh từ', 'Vì 一 không dùng được với đồ ăn', 'Vì đây là quy tắc chỉ áp dụng với đồ uống'], correctIndex: 1, explanation: 'Tiếng Trung bắt buộc có lượng từ (碗/盘/杯...) xen giữa số đếm và danh từ.' },
]);

const c7 = doc('cls101-7-1-directions', '7.1 — Asking for & giving directions|||7.1 — Hỏi đường & chỉ đường',
  'Mẫu câu hỏi đường (请问...怎么走); từ chỉ hướng (一直走/左拐/右拐/红绿灯); mẹo nghe chuỗi chỉ dẫn liên tiếp trong hội thoại thật.',
  [[
    `<span class="eyebrow">CLS101 · Chapter 7 · Lesson 7.1</span>
<h2>Asking for &amp; giving directions</h2>
<h3>Direction vocabulary</h3>
<pre><code>请问 qǐngwèn  excuse me (polite opener)    怎么走 zěnme zǒu how to get there
一直走 yìzhí zǒu go straight               往左/右拐 wǎng zuǒ/yòu guǎi turn left/right
红绿灯 hónglǜdēng traffic light            路口 lùkǒu intersection
附近 fùjìn nearby                          对面 duìmiàn across from / opposite
</code></pre>
<h3>Dialogue — finding the train station</h3>
<pre><code>A: 请问，火车站怎么走？
   Qǐngwèn, huǒchēzhàn zěnme zǒu?
   Excuse me, how do I get to the train station?
B: 一直走，到红绿灯往左拐，
   Yìzhí zǒu, dào hónglǜdēng wǎng zuǒ guǎi,
   Go straight, turn left at the traffic light,
   火车站就在你的右边。
   huǒchēzhàn jiù zài nǐ de yòubian.
   the train station will be on your right.
A: 远吗？             Yuǎn ma?                Is it far?
B: 不远，走五分钟就到了。
   Bù yuǎn, zǒu wǔ fēnzhōng jiù dào le.
   Not far, five minutes on foot and you're there.
A: 谢谢你！           Xièxie nǐ!               Thank you!
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Direction instructions arrive as a CHAIN: [action] + [landmark] + [action]. Don't try to translate word by word — listen for the sequence of verbs (走 → 拐 → 到) and land marks (红绿灯) as checkpoints.</div>`,
    `<span class="eyebrow">CLS101 · Chương 7 · Bài 7.1</span>
<h2>Hỏi đường &amp; chỉ đường</h2>
<h3>Từ vựng chỉ phương hướng</h3>
<pre><code>请问 qǐngwèn  xin hỏi (mở lời lịch sự)     怎么走 zěnme zǒu đi thế nào
一直走 yìzhí zǒu đi thẳng                  往左/右拐 wǎng zuǒ/yòu guǎi rẽ trái/phải
红绿灯 hónglǜdēng đèn giao thông           路口 lùkǒu ngã tư
附近 fùjìn gần đây                         对面 duìmiàn đối diện
</code></pre>
<h3>Hội thoại — tìm ga tàu</h3>
<pre><code>A: 请问，火车站怎么走？
   Qǐngwèn, huǒchēzhàn zěnme zǒu?
   Xin hỏi, ga tàu đi thế nào ạ?
B: 一直走，到红绿灯往左拐，
   Yìzhí zǒu, dào hónglǜdēng wǎng zuǒ guǎi,
   Đi thẳng, đến đèn giao thông thì rẽ trái,
   火车站就在你的右边。
   huǒchēzhàn jiù zài nǐ de yòubian.
   ga tàu sẽ ở bên phải bạn.
A: 远吗？             Yuǎn ma?                Có xa không?
B: 不远，走五分钟就到了。
   Bù yuǎn, zǒu wǔ fēnzhōng jiù dào le.
   Không xa, đi bộ 5 phút là tới.
A: 谢谢你！           Xièxie nǐ!               Cảm ơn bạn!
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Chỉ đường luôn đến dưới dạng một CHUỖI: [hành động] + [mốc] + [hành động]. Đừng cố dịch từng chữ — hãy bám theo trình tự động từ (走 → 拐 → 到) và mốc (红绿灯) như các điểm mốc để định vị.</div>`,
  ]]);

const c7q = quiz('cls101-quiz-7', 'Quiz 7 — Asking directions|||Quiz 7 — Hỏi đường', [
  { id: 'q1', question: '"往左拐" (wǎng zuǒ guǎi) nghĩa là gì?', options: ['Đi thẳng', 'Rẽ trái', 'Rẽ phải', 'Dừng lại'], correctIndex: 1, explanation: '往左 (wǎng zuǒ) = về phía trái; 拐 (guǎi) = rẽ → "rẽ trái".' },
  { id: 'q2', question: 'Câu mở đầu lịch sự khi hỏi đường người lạ là gì?', options: ['再见 (zàijiàn)', '请问 (qǐngwèn)', '谢谢 (xièxie)', '多少钱 (duōshao qián)'], correctIndex: 1, explanation: '请问 (qǐngwèn) = "xin hỏi" — cách mở lời lịch sự chuẩn trước khi hỏi đường.' },
  { id: 'q3', question: 'Khi nghe người bản xứ chỉ đường một chuỗi dài, nên tập trung nghe điều gì?', options: ['Dịch chính xác từng chữ một', 'Trình tự động từ chỉ hành động và các mốc (landmark) được nhắc tới', 'Chỉ đếm số âm tiết', 'Bỏ qua, chỉ nghe câu cuối cùng'], correctIndex: 1, explanation: 'Chỉ đường là một chuỗi hành động + mốc; bám trình tự đó dễ theo hơn dịch từng từ.' },
]);

const c8 = doc('cls101-8-1-review-mixed', '8.1 — Review: mixed dialogues & reflex drills|||8.1 — Ôn tập: hội thoại tổng hợp & luyện phản xạ',
  'Hội thoại tổng hợp kết hợp chào hỏi, thông tin cá nhân, thời gian, mua sắm, ăn uống, hỏi đường; kỹ thuật luyện phản xạ nói (shadowing, tự ghi âm, dạng đề nghe HSK1-2).',
  [[
    `<span class="eyebrow">CLS101 · Chapter 8 · Lesson 8.1</span>
<h2>Review: mixed dialogues &amp; reflex drills</h2>
<h3>One dialogue, all seven chapters</h3>
<pre><code>A: 你好！你叫什么名字？
   Nǐ hǎo! Nǐ jiào shénme míngzi?
   Hi! What's your name?
B: 我叫玛丽，我是越南人。
   Wǒ jiào Mǎlì, wǒ shì Yuènán rén.
   I'm Mary, I'm Vietnamese.
A: 现在几点？我们去吃饭，好吗？
   Xiànzài jǐ diǎn? Wǒmen qù chīfàn, hǎo ma?
   What time is it? Let's go eat, shall we?
B: 现在六点半。好啊，去哪儿？
   Xiànzài liù diǎn bàn. Hǎo a, qù nǎr?
   It's 6:30. Sure, where to?
A: 请问，那家饭馆怎么走？
   Qǐngwèn, nà jiā fànguǎn zěnme zǒu?
   Excuse me, how do I get to that restaurant?
C: 一直走，往右拐就到了。
   Yìzhí zǒu, wǎng yòu guǎi jiù dào le.
   Go straight, turn right and you're there.
B: 服务员，多少钱一碗面条？
   Fúwùyuán, duōshao qián yì wǎn miàntiáo?
   Waiter, how much for a bowl of noodles?
</code></pre>
<h3>Reflex training toolkit</h3>
<ul>
<li><strong>Shadow at native speed</strong> — no pausing after the first pass; match rhythm before worrying about every word.</li>
<li><strong>Record yourself</strong> — play back your own audio next to the original; tone errors are obvious once you hear both side by side.</li>
<li><strong>Answer-in-2-seconds drill</strong> — a partner (or app) asks any question from Chapters 2-7 at random; you must answer before you can think in your native language.</li>
<li><strong>HSK1-2 listening format</strong> — short dialogue + one question with 3 picture/text options; the trap is usually a NUMBER or TIME mentioned twice with a correction ("原来是三点，后来改成四点" — "it was 3, then changed to 4").</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> In HSK listening, the FIRST number you hear is often a decoy that gets corrected later in the same clip. Keep listening to the end before choosing an answer.</div>`,
    `<span class="eyebrow">CLS101 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: hội thoại tổng hợp &amp; luyện phản xạ</h2>
<h3>Một hội thoại, gồm cả bảy chương</h3>
<pre><code>A: 你好！你叫什么名字？
   Nǐ hǎo! Nǐ jiào shénme míngzi?
   Chào! Bạn tên gì?
B: 我叫玛丽，我是越南人。
   Wǒ jiào Mǎlì, wǒ shì Yuènán rén.
   Tôi tên Mary, tôi là người Việt Nam.
A: 现在几点？我们去吃饭，好吗？
   Xiànzài jǐ diǎn? Wǒmen qù chīfàn, hǎo ma?
   Bây giờ mấy giờ? Mình đi ăn nhé?
B: 现在六点半。好啊，去哪儿？
   Xiànzài liù diǎn bàn. Hǎo a, qù nǎr?
   Bây giờ 6 giờ rưỡi. Được, đi đâu?
A: 请问，那家饭馆怎么走？
   Qǐngwèn, nà jiā fànguǎn zěnme zǒu?
   Xin hỏi, quán ăn đó đi thế nào?
C: 一直走，往右拐就到了。
   Yìzhí zǒu, wǎng yòu guǎi jiù dào le.
   Đi thẳng, rẽ phải là tới.
B: 服务员，多少钱一碗面条？
   Fúwùyuán, duōshao qián yì wǎn miàntiáo?
   Phục vụ ơi, một bát mì bao nhiêu tiền?
</code></pre>
<h3>Bộ công cụ luyện phản xạ</h3>
<ul>
<li><strong>Shadow theo tốc độ người bản xứ</strong> — đừng dừng lại ở lần nghe đầu; bám nhịp trước, lo từng từ sau.</li>
<li><strong>Tự ghi âm mình</strong> — nghe lại bản ghi của mình cạnh bản gốc; lỗi thanh điệu sẽ lộ rõ ngay khi so sánh hai bản.</li>
<li><strong>Bài tập trả lời trong 2 giây</strong> — một người bạn (hoặc app) hỏi ngẫu nhiên câu từ Chương 2-7; bạn phải trả lời trước khi kịp nghĩ bằng tiếng Việt.</li>
<li><strong>Dạng đề nghe HSK1-2</strong> — một đoạn hội thoại ngắn + một câu hỏi với 3 lựa chọn hình/chữ; bẫy thường là một CON SỐ hoặc GIỜ được nhắc hai lần rồi sửa lại ("原来是三点，后来改成四点" — "ban đầu là 3 giờ, sau đó đổi thành 4 giờ").</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> Trong bài nghe HSK, con số ĐẦU TIÊN bạn nghe thường là bẫy và sẽ được sửa lại ở cuối đoạn. Nghe hết đoạn rồi mới chọn đáp án.</div>`,
  ]]);

const c8q = quiz('cls101-quiz-8', 'Quiz 8 — Review & reflex|||Quiz 8 — Ôn tập & phản xạ', [
  { id: 'q1', question: 'Trong bài nghe HSK, bẫy phổ biến nhất liên quan đến điều gì?', options: ['Tên riêng bị đọc sai', 'Một con số/giờ được nhắc rồi sửa lại ở cuối đoạn', 'Câu hỏi luôn có 2 đáp án đúng', 'Đoạn hội thoại không có câu hỏi'], correctIndex: 1, explanation: 'Đề nghe hay đưa một số/giờ ban đầu rồi sửa lại — phải nghe hết đoạn mới chọn đáp án đúng.' },
  { id: 'q2', question: 'Kỹ thuật "shadowing" trong luyện nói nghĩa là gì?', options: ['Đọc thầm pinyin trong đầu', 'Nghe rồi lặp lại thành tiếng, bám đúng nhịp và thanh điệu', 'Dịch câu sang tiếng Việt trước khi nói', 'Chỉ học thuộc lòng chữ Hán, không cần nghe'], correctIndex: 1, explanation: 'Shadowing = nghe một câu ngắn rồi lặp lại ngay, bám sát nhịp điệu và thanh điệu gốc.' },
  { id: 'q3', question: 'Vì sao nên tự ghi âm giọng nói của mình khi luyện tập?', options: ['Để gửi bài tập cho giáo viên', 'Để nghe lại và so sánh với bản gốc, phát hiện lỗi thanh điệu', 'Vì quy định bắt buộc của HSK', 'Để thay thế hoàn toàn việc nghe người bản xứ'], correctIndex: 1, explanation: 'Nghe lại bản ghi của chính mình cạnh bản gốc giúp phát hiện lỗi thanh điệu/phát âm rõ ràng hơn.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CLS101',
    slug: 'cls101-chinese-listening-speaking-skills-1',
    title: 'Chinese Listening & Speaking Skills 1',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CLS101.webp',
    shortDescription: 'Beginner Mandarin listening & speaking (HSK1-2): tones, greetings, personal info, time, shopping, dining, directions & mixed-dialogue review — with pinyin, Hanzi & Vietnamese/English meaning.|||Nghe - nói tiếng Trung sơ cấp (HSK1-2): thanh điệu, chào hỏi, thông tin cá nhân, thời gian, mua sắm, ăn uống, hỏi đường & ôn tập hội thoại tổng hợp — kèm pinyin, chữ Hán, nghĩa Việt/Anh.',
    description: 'Môn <strong>CLS101 — Chinese Listening &amp; Speaking Skills 1</strong> (Kỹ năng Nghe - Nói tiếng Trung 1, ngành Ngôn ngữ Trung, kỳ 1) là môn <strong>kỹ năng thực hành</strong>, không phải môn tổng hợp: trọng tâm luyện <strong>phát âm/thanh điệu, nghe hiểu và phản xạ nói</strong> qua hội thoại thật. 8 chương đi từ <strong>4 thanh điệu</strong> → <strong>chào hỏi &amp; giới thiệu</strong> → <strong>thông tin cá nhân &amp; số điện thoại</strong> → <strong>thời gian &amp; hẹn gặp</strong> → <strong>mua sắm &amp; hỏi giá</strong> → <strong>ăn uống &amp; gọi món</strong> → <strong>hỏi đường</strong> → <strong>ôn tập hội thoại tổng hợp &amp; luyện phản xạ</strong>. Bám trình độ HSK1-2 theo "HSK Standard Course 1-2 (听说)" và "Short-term Spoken Chinese: Threshold", có chữ Hán, pinyin dấu thanh, nghĩa Việt/Anh, mẹo nghe và quiz mỗi chương.',
    whatYouLearn: '4 thanh điệu & cấu trúc âm tiết pinyin; chào hỏi & tự giới thiệu tên/quốc tịch; hỏi tuổi & số điện thoại, đọc số 0-100; nói giờ (点/分/半/刻) & hẹn gặp; hỏi giá & trả giá (元/块, 角/毛); gọi món nhà hàng & lượng từ (碗/盘/杯); hỏi đường & chỉ đường (一直走/左拐/右拐); kỹ thuật shadowing & phản xạ nói nhanh; dạng đề nghe HSK1-2.',
    requirements: 'Không cần biết tiếng Trung trước đó. Nên có tai nghe/loa để luyện nghe, và mạnh dạn nói to khi luyện shadowing.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao là môn nghe-nói, lộ trình 8 chương, phương pháp shadowing.', lessons: [intro] },
    { title: 'Chương 1 — Phát âm & thanh điệu|||Chapter 1 — Pronunciation & tones', description: 'Cấu trúc pinyin, 4 thanh, mẹo nghe phân biệt.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chào hỏi & giới thiệu|||Chapter 2 — Greetings & introduction', description: 'Hội thoại chào hỏi, tự giới thiệu tên & quốc tịch.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thông tin cá nhân & số điện thoại|||Chapter 3 — Personal info & phone numbers', description: 'Hỏi tuổi, số điện thoại, số 0-100.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thời gian & hẹn gặp|||Chapter 4 — Time & appointments', description: 'Nói giờ, ngày trong tuần, hẹn gặp.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mua sắm & hỏi giá|||Chapter 5 — Shopping & prices', description: 'Đơn vị tiền tệ, hỏi giá, trả giá.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ăn uống & gọi món|||Chapter 6 — Dining & ordering', description: 'Từ vựng nhà hàng, lượng từ, gọi món & tính tiền.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hỏi đường & phương hướng|||Chapter 7 — Asking directions', description: 'Mẫu câu hỏi đường, từ chỉ hướng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập nghe-nói tổng hợp|||Chapter 8 — Comprehensive review', description: 'Hội thoại tổng hợp, kỹ thuật luyện phản xạ, dạng đề HSK1-2.', lessons: [c8, c8q] },
  ],
};
