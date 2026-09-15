/**
 * CCC501 — Classical Chinese Language (Hán văn Cổ điển / Văn ngôn 文言文).
 * Khung 8 chương: (1) tổng quan văn ngôn vs bạch thoại, (2) hư từ 之其而以于,
 * (3) thực từ & từ loại linh hoạt 词类活用, (4) cú pháp cổ (phán đoán/bị động/
 * đảo trang), (5) đọc hiểu 论语·孟子, (6) đọc hiểu 史记·左传, (7) thơ-từ-tản
 * văn cổ, (8) ôn tập dịch văn ngôn & điển cố. Tham khảo 古代汉语(王力),
 * 文言文入门, An Introduction to Literary Chinese (Fuller). Trích văn ngôn
 * nguyên bản + pinyin + dịch Việt. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('ccc501-1-1-overview', 'Overview of Classical Chinese (文言文)|||Tổng quan văn ngôn (文言文)',
  'Văn ngôn (文言文) là gì, vì sao khác bạch thoại (白话文): từ đơn âm tiết, lược bỏ nhiều, không dấu câu gốc, hệ hư từ ổn định. Trích Luận Ngữ mở đầu.',
  [[
    `<span class="eyebrow">CCC501 · Chapter 1 · Lesson 1.1</span>
<h2>What is Classical Chinese (文言文)?</h2>
<p class="lead"><strong>Wényánwén 文言文</strong> — Literary/Classical Chinese — is the written language of pre-modern China, rooted in the spoken Chinese of the Warring States/Han period, kept as the standard for scholarship, law and literature for over two thousand years even as everyday speech kept changing. <strong>Báihuàwén 白话文</strong> (vernacular Chinese), ancestor of the modern written language, only replaced it as the official written standard after the 1919 May Fourth Movement (新文化运动).</p>
<h3>Four hallmarks that separate 文言 from 白话</h3>
<ul>
<li><strong>Monosyllabic words.</strong> Where 白话 uses two-syllable words (朋友 péngyou "friend", 学习 xuéxí "to study"), 文言 mostly uses single characters as full words (友, 学). The 白话 sentence "我的朋友来了" collapses in 文言 to "友至".</li>
<li><strong>Dense grammar, heavy ellipsis.</strong> Subjects, objects, even verbs are dropped whenever context makes them recoverable — 文言 trusts the reader to fill the gaps.</li>
<li><strong>No native punctuation.</strong> Original texts ran unbroken; the periods, commas and quotation marks in modern editions (标点 biāodiǎn) were added by later editors — reading 文言 well starts with finding the sentence breaks correctly (断句 duànjù).</li>
<li><strong>A closed, stable function-word system.</strong> A small set of hư từ (虚词) — 之, 其, 而, 以, 于, 者, 也… — carries most of the grammatical load; mastering them unlocks a large share of classical texts (Chapter 2).</li>
</ul>
<pre><code>论语·学而 (opening line)
&lt;chữ Hán&gt; 子曰：学而时习之，不亦说乎？
&lt;pinyin&gt;   Zǐ yuē: "Xué ér shí xí zhī, bù yì yuè hū?"
&lt;dịch&gt;    Confucius said: "To learn, and to practice it often — is that not a joy?"
</code></pre>
<div class="callout"><span class="badge">Roadmap</span> Chapters 2-4 build the grammar toolkit (function words, flexible word classes, classical syntax); Chapters 5-7 apply it to real texts (Analects &amp; Mencius, historical narrative, poetry &amp; prose); Chapter 8 reviews translation method and allusions (典故).</div>`,
    `<span class="eyebrow">CCC501 · Chương 1 · Bài 1.1</span>
<h2>Văn ngôn 文言文 là gì?</h2>
<p class="lead"><strong>Văn ngôn (文言文, wényánwén)</strong> — Hán văn cổ điển — là ngôn ngữ viết của Trung Quốc thời tiền hiện đại, dựa trên khẩu ngữ thời Chiến Quốc - Hán, được giữ làm chuẩn viết cho học thuật, luật pháp và văn chương suốt hơn hai nghìn năm dù khẩu ngữ hằng ngày vẫn tiếp tục biến đổi. <strong>Bạch thoại (白话文, báihuàwén)</strong> — tổ tiên của chữ viết hiện đại — chỉ thay thế văn ngôn làm chuẩn viết chính thức sau phong trào Ngũ Tứ 1919 (新文化运动).</p>
<h3>Bốn đặc điểm tách văn ngôn khỏi bạch thoại</h3>
<ul>
<li><strong>Từ đơn âm tiết.</strong> Nơi bạch thoại dùng từ hai âm tiết (朋友 péngyou "bạn bè", 学习 xuéxí "học tập"), văn ngôn phần lớn dùng một chữ Hán làm một từ trọn nghĩa (友, 学). Câu bạch thoại "我的朋友来了" rút gọn thành văn ngôn "友至".</li>
<li><strong>Ngữ pháp cô đọng, lược bỏ nhiều.</strong> Chủ ngữ, tân ngữ, thậm chí động từ bị lược bỏ bất cứ khi nào ngữ cảnh cho phép suy ra — văn ngôn tin người đọc tự lấp khoảng trống.</li>
<li><strong>Không có dấu câu gốc.</strong> Văn bản gốc viết liền mạch; dấu chấm, phẩy, ngoặc kép (标点 biāodiǎn) trong bản in hiện đại là do người đời sau thêm vào — đọc tốt văn ngôn bắt đầu từ ngắt câu đúng (断句 duànjù).</li>
<li><strong>Hệ hư từ (虚词) khép kín, ổn định.</strong> Một nhóm nhỏ hư từ — 之, 其, 而, 以, 于, 者, 也… — gánh phần lớn công việc ngữ pháp; nắm vững chúng mở khoá được phần lớn văn bản cổ (xem Chương 2).</li>
</ul>
<pre><code>论语·学而 (câu mở đầu)
&lt;chữ Hán&gt; 子曰：学而时习之，不亦说乎？
&lt;pinyin&gt;   Zǐ yuē: "Xué ér shí xí zhī, bù yì yuè hū?"
&lt;dịch&gt;    Khổng Tử nói: "Học mà thường xuyên ôn tập, chẳng phải là vui sao?"
</code></pre>
<div class="callout"><span class="badge">Lộ trình môn học</span> Chương 2-4 dựng bộ công cụ ngữ pháp (hư từ, từ loại linh hoạt, cú pháp cổ); Chương 5-7 áp dụng vào văn bản thật (Luận Ngữ &amp; Mạnh Tử, sử truyện, thơ &amp; tản văn); Chương 8 ôn phương pháp dịch và điển cố.</div>`,
  ]]);

const c1q = quiz('ccc501-quiz-1', 'Quiz 1 — Overview of Classical Chinese|||Quiz 1 — Tổng quan văn ngôn', [
  { id: 'q1', question: 'Văn ngôn (文言文) khác bạch thoại (白话文) rõ nhất ở điểm nào?', options: ['Văn ngôn dùng nhiều từ hai âm tiết hơn bạch thoại', 'Văn ngôn chủ yếu dùng từ đơn âm tiết, một chữ Hán = một từ', 'Văn ngôn có dấu câu gốc do chính tác giả đặt', 'Văn ngôn chỉ xuất hiện sau phong trào Ngũ Tứ 1919'], correctIndex: 1, explanation: 'Văn ngôn thiên về đơn âm tiết (友, 学); bạch thoại mới phổ biến từ song âm tiết (朋友, 学习).' },
  { id: 'q2', question: 'Dấu câu (标点) trong các bản văn ngôn ta đọc ngày nay từ đâu mà có?', options: ['Do chính tác giả thời cổ viết sẵn', 'Do người đời sau (biên tập) thêm vào khi ngắt câu (断句)', 'Không tồn tại, mọi bản văn ngôn đều không có dấu câu', 'Do máy tính tự động sinh ra'], correctIndex: 1, explanation: 'Văn bản gốc viết liền mạch không dấu câu; biāodiǎn là công đoạn ngắt câu do người biên tập đời sau thêm.' },
  { id: 'q3', question: 'Câu bạch thoại "我的朋友来了" khi rút về văn ngôn gần nghĩa nhất là?', options: ['友至', '朋友来了也', '我友之来', '来友我'], correctIndex: 0, explanation: '文言 tối giản: 友 (bạn) + 至 (đến) = "bạn đến", đúng tinh thần đơn âm tiết, lược chủ ngữ sở hữu.' },
]);

const c2 = doc('ccc501-2-1-huu-tu', 'Function words: 之 · 其 · 而 · 以 · 于|||Hư từ: 之 · 其 · 而 · 以 · 于',
  'Năm hư từ cốt lõi: 之 (đại từ/trợ từ), 其 (sở hữu/ngữ khí), 而 (liên từ), 以 (giới từ phương tiện), 于 (giới từ nơi chốn/đối tượng). Ví dụ trích Luận Ngữ, Mạnh Tử.',
  [[
    `<span class="eyebrow">CCC501 · Chapter 2 · Lesson 2.1</span>
<h2>Function words (虚词): 之 · 其 · 而 · 以 · 于</h2>
<ul>
<li><strong>之 (zhī)</strong> — (1) pronoun standing in for a person/thing already mentioned; (2) possessive particle between two nouns, like "'s"; (3) a subordinating particle inserted between subject and predicate that cancels the clause's independent status (no direct English equivalent).</li>
<li><strong>其 (qí)</strong> — (1) third-person possessive "his/her/its/their"; (2) a modal adverb marking a suggestion or rhetorical hedge, roughly "perhaps/probably".</li>
<li><strong>而 (ér)</strong> — coordinating conjunction: sequential "and then", adversative "but/yet", or linking an adverbial modifier to the verb that follows it.</li>
<li><strong>以 (yǐ)</strong> — preposition "with/by means of/because of" introducing means or reason; often forms 以...为... "to regard...as...". Can also link two verb phrases like "in order to".</li>
<li><strong>于 (yú)</strong> — preposition introducing place, time, target or comparison — "at/in/to/than", close to modern 在/对/比/给; also common inside passive constructions 见...于 / 受...于.</li>
</ul>
<pre><code>学而时习之    xué ér shí xí zhī        之 = pronoun, "it" (what was learned)
己所不欲，勿施于人  jǐ suǒ bù yù, wù shī yú rén  于 = "onto/to" (target)
其恕乎!      qí shù hū!               其 = modal, "perhaps it is..."
温故而知新    wēn gù ér zhī xīn        而 = "and then" (sequential)
域民不以封疆之界  yù mín bù yǐ fēng jiāng zhī jiè  以 = "by means of"; 之 = "'s"
</code></pre>
<div class="callout"><span class="badge">Study tip</span> These five words appear on almost every page of Classical Chinese; drilling their 2-3 common functions each pays off far more than memorizing rare content words.</div>`,
    `<span class="eyebrow">CCC501 · Chương 2 · Bài 2.1</span>
<h2>Hư từ (虚词): 之 · 其 · 而 · 以 · 于</h2>
<ul>
<li><strong>之 (zhī)</strong> — (1) đại từ thay cho người/vật đã nhắc; (2) trợ từ sở hữu giữa hai danh từ, như "của"; (3) trợ từ chen giữa chủ ngữ - vị ngữ khiến mệnh đề mất tính độc lập (không có tương đương trực tiếp trong tiếng Việt).</li>
<li><strong>其 (qí)</strong> — (1) đại từ sở hữu ngôi ba "của nó/họ"; (2) phó từ ngữ khí biểu thị đề nghị hay ước đoán, gần nghĩa "có lẽ/hẳn là".</li>
<li><strong>而 (ér)</strong> — liên từ: nối tiếp "rồi thì", tương phản "nhưng/mà", hoặc nối một trạng ngữ cách thức với động từ theo sau.</li>
<li><strong>以 (yǐ)</strong> — giới từ "bằng/nhờ vào/vì" đưa ra phương tiện hoặc nguyên nhân; hay tạo cụm 以...为... "coi...là...". Cũng có thể nối hai cụm động từ như "để mà".</li>
<li><strong>于 (yú)</strong> — giới từ đưa ra nơi chốn, thời gian, đối tượng hoặc so sánh — "ở/tại/đến/hơn", gần với 在/对/比/给 trong bạch thoại; còn thường gặp trong câu bị động 见...于 / 受...于.</li>
</ul>
<pre><code>学而时习之    xué ér shí xí zhī        之 = đại từ, "điều đã học"
己所不欲，勿施于人  jǐ suǒ bù yù, wù shī yú rén  于 = "cho, đến" (đối tượng)
其恕乎!      qí shù hū!               其 = ngữ khí, "có lẽ đó là..."
温故而知新    wēn gù ér zhī xīn        而 = "rồi thì" (nối tiếp)
域民不以封疆之界  yù mín bù yǐ fēng jiāng zhī jiè  以 = "bằng/nhờ vào"; 之 = "của"
</code></pre>
<div class="callout"><span class="badge">Mẹo học</span> Năm chữ này xuất hiện gần như trên mọi trang văn ngôn; luyện kỹ 2-3 chức năng thường gặp của chúng có ích hơn nhiều so với học thuộc thực từ hiếm gặp.</div>`,
  ]]);

const c2q = quiz('ccc501-quiz-2', 'Quiz 2 — Function words|||Quiz 2 — Hư từ', [
  { id: 'q1', question: 'Trong câu 己所不欲，勿施于人, chữ 于 giữ vai trò gì?', options: ['Liên từ nối hai vế câu', 'Giới từ chỉ đối tượng, gần nghĩa "cho, đến"', 'Đại từ nhân xưng ngôi ba', 'Trợ từ nghi vấn cuối câu'], correctIndex: 1, explanation: '于 ở đây là giới từ đưa ra đối tượng chịu tác động "cho người khác", tương đương 对/给 trong bạch thoại.' },
  { id: 'q2', question: 'Chữ 之 trong 学而时习之 đóng vai trò gì?', options: ['Trợ từ sở hữu như "của"', 'Đại từ thay cho tân ngữ "điều đã học"', 'Liên từ chỉ nguyên nhân', 'Động từ "đi đến"'], correctIndex: 1, explanation: '之 ở cuối câu làm đại từ tân ngữ, thay cho "điều đã học được".' },
  { id: 'q3', question: '其恕乎 — chữ 其 ở đây biểu thị điều gì?', options: ['Sở hữu "của nó"', 'Ngữ khí ước đoán/đề nghị, gần nghĩa "có lẽ, chắc là"', 'Số nhiều "chúng nó"', 'Phủ định "không"'], correctIndex: 1, explanation: '其 đứng trước một nhận định mang nghĩa "có lẽ/hẳn là", tăng phần dè dặt cho lời nói.' },
]);

const c3 = doc('ccc501-3-1-tu-loai-linh-hoat', 'Content words & flexible word classes (词类活用)|||Thực từ & từ loại linh hoạt (词类活用)',
  'Danh/động/tính từ không cố định hình thức: 名词作动词 (域民), 使动 (春风又绿江南岸), đổi thanh điệu khi đổi từ loại (王 → wàng), 意动 (吾妻之美我者).',
  [[
    `<span class="eyebrow">CCC501 · Chapter 3 · Lesson 3.1</span>
<h2>Content words &amp; flexible word classes (词类活用)</h2>
<p class="lead">实词 (content words: noun, verb, adjective, numeral) carry the meaning; 虚词 (function words, Chapter 2) carry the grammar. Because Classical Chinese has no inflection, the same character's part of speech is decided purely by its position in the sentence — this fluidity is called <strong>词类活用</strong> ("flexible use of word classes").</p>
<h3>Four common patterns</h3>
<ul>
<li><strong>名词作动词</strong> (noun used as a verb) — 域民不以封疆之界 (yù mín bù yǐ fēng jiāng zhī jiè, <em>孟子·公孙丑下</em>): 域 normally means "territory" (noun); here it acts as a transitive verb, "to confine [the people] within a territory".</li>
<li><strong>形容词的使动用法</strong> (causative use of an adjective, "to make X [adj]") — 春风又绿江南岸 (chūn fēng yòu lǜ jiāng nán àn, 王安石《泊船瓜洲》) "the spring wind again greens the south bank of the river" — 绿 ("green", an adjective) is used causatively, "to make green".</li>
<li><strong>Tone change marks the shift</strong> — 先破秦入咸阳者王之 (xiān pò qín rù xián yáng zhě wàng zhī, from 楚怀王之约 recorded in <em>史记</em>): 王 read wàng (4th tone, verb "to make king/crown") instead of wáng (2nd tone, noun "king") — pronunciation itself flags the word-class change.</li>
<li><strong>意动用法</strong> (putative use, "to consider/treat X as...") — 吾妻之美我者，私我也 (wú qī zhī měi wǒ zhě, sī wǒ yě, <em>战国策·齐策</em>, 邹忌讽齐王纳谏): 美 ("beautiful", adjective) used putatively, "considers me handsome".</li>
</ul>
<pre><code>域民        yù mín        "to confine [people] within a territory" (noun 域 → verb)
绿江南岸    lǜ jiāng nán àn "to green the riverbank" (adjective 绿 → causative verb)
王之(wàng zhī) wàng zhī    "to crown him" (noun 王 wáng → verb wàng, tone shifts)
美我        měi wǒ         "considers me handsome" (adjective 美 → putative verb)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Word-class flexibility means a dictionary meaning is only a starting point — always check what role the character plays in ITS sentence before translating it.</div>`,
    `<span class="eyebrow">CCC501 · Chương 3 · Bài 3.1</span>
<h2>Thực từ &amp; từ loại linh hoạt (词类活用)</h2>
<p class="lead">实词 (thực từ: danh từ, động từ, tính từ, số từ) mang nghĩa; 虚词 (hư từ, Chương 2) mang ngữ pháp. Vì văn ngôn không biến hình từ, từ loại của một chữ Hán hoàn toàn do vị trí trong câu quyết định — hiện tượng linh hoạt này gọi là <strong>词类活用</strong> ("từ loại linh hoạt/hoạt dụng").</p>
<h3>Bốn kiểu thường gặp</h3>
<ul>
<li><strong>名词作动词</strong> (danh từ dùng như động từ) — 域民不以封疆之界 (yù mín bù yǐ fēng jiāng zhī jiè, <em>孟子·公孙丑下</em>): 域 vốn nghĩa "cõi/lãnh thổ" (danh từ); ở đây làm động từ ngoại động, "giữ dân trong cõi/ranh giới".</li>
<li><strong>形容词的使动用法</strong> (sử động — "khiến cho... [tính từ]") — 春风又绿江南岸 (chūn fēng yòu lǜ jiāng nán àn, 王安石《泊船瓜洲》) "gió xuân lại làm xanh bờ Giang Nam" — 绿 ("xanh", tính từ) dùng theo lối sử động, "khiến cho xanh".</li>
<li><strong>Đổi thanh điệu để đánh dấu chuyển loại</strong> — 先破秦入咸阳者王之 (xiān pò qín rù xián yáng zhě wàng zhī, thuộc 楚怀王之约 ghi trong <em>史记</em>): 王 đọc wàng (thanh 4, động từ "phong làm vương/xưng vương") thay vì wáng (thanh 2, danh từ "vua") — chính ngữ âm báo hiệu sự chuyển loại.</li>
<li><strong>意动用法</strong> (ý động — "cho là...") — 吾妻之美我者，私我也 (wú qī zhī měi wǒ zhě, sī wǒ yě, <em>战国策·齐策</em>, Trâu Kỵ can Tề vương): 美 ("đẹp", tính từ) dùng theo lối ý động, "cho ta là đẹp/khen ta đẹp".</li>
</ul>
<pre><code>域民        yù mín        "giữ dân trong cõi" (danh từ 域 → động từ)
绿江南岸    lǜ jiāng nán àn "làm xanh bờ sông" (tính từ 绿 → động từ sử động)
王之(wàng zhī) wàng zhī    "phong làm vương" (danh từ 王 wáng → động từ wàng, đổi thanh)
美我        měi wǒ         "cho ta là đẹp" (tính từ 美 → động từ ý động)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Từ loại linh hoạt nghĩa là nghĩa từ điển chỉ là điểm xuất phát — luôn kiểm tra vai trò của chữ Hán TRONG chính câu đó trước khi dịch.</div>`,
  ]]);

const c3q = quiz('ccc501-quiz-3', 'Quiz 3 — Flexible word classes|||Quiz 3 — Từ loại linh hoạt', [
  { id: 'q1', question: 'Hiện tượng 词类活用 trong văn ngôn nghĩa là gì?', options: ['Mỗi chữ Hán chỉ có đúng một từ loại cố định', 'Một chữ có thể đổi từ loại (danh/động/tính) tuỳ vị trí trong câu', 'Chỉ động từ mới có nhiều nghĩa', 'Hiện tượng chỉ xảy ra với hư từ'], correctIndex: 1, explanation: 'Văn ngôn không biến hình từ, nên cùng một chữ đổi chức năng ngữ pháp (và cả nghĩa) tuỳ vị trí — gọi là từ loại linh hoạt.' },
  { id: 'q2', question: '春风又绿江南岸 — chữ 绿 (vốn là tính từ "xanh") được dùng theo cách nào?', options: ['Danh từ hoá', 'Sử động (khiến cho...) — "khiến bờ sông xanh lại"', 'Ý động (cho là...)', 'Không đổi, vẫn là tính từ thường'], correctIndex: 1, explanation: '绿 dùng sử động: "gió xuân khiến bờ Giang Nam xanh lại" — tính từ chuyển thành động từ mang nghĩa khiến-thành.' },
  { id: 'q3', question: 'Trong 先破秦入咸阳者王之, chữ 王 nên đọc thanh điệu nào và mang nghĩa gì?', options: ['wáng (thanh 2) — danh từ "vua"', 'wàng (thanh 4) — động từ "phong làm vương"', 'wǎng (thanh 3) — "đi đến"', 'wāng (thanh 1) — trợ từ ngữ khí'], correctIndex: 1, explanation: 'Khi 王 chuyển thành động từ "phong làm vương/xưng vương", thanh điệu đổi sang wàng (thanh 4) — dấu hiệu ngữ âm của từ loại linh hoạt.' },
]);

const c4 = doc('ccc501-4-1-cu-phap', 'Classical syntax: judgment, passive & inverted sentences|||Cú pháp cổ: câu phán đoán, bị động, đảo trang',
  '判断句 (者...也), 被动句 (见...于/为...所), 倒装句 (宾语前置如 何陋之有, 状语后置如 战于长勺). Trích Sử Ký, Trang Tử, Mạnh Tử, Lưu Vũ Tích.',
  [[
    `<span class="eyebrow">CCC501 · Chapter 4 · Lesson 4.1</span>
<h2>Classical syntax: judgment, passive &amp; inverted sentences</h2>
<h3>判断句 — judgment (copula) sentences</h3>
<p>Early Classical Chinese has no copula 是; identity is marked by particles, most often <strong>"X者，Y也"</strong> = "X is Y." Example: 陈胜者，阳城人也 (chén shèng zhě, yáng chéng rén yě, <em>史记·陈涉世家</em>) — "Chen Sheng was a man of Yangcheng."</p>
<h3>被动句 — passive sentences</h3>
<p>Common markers: 于 after the verb introduces the agent; 见...于 combines a passive marker (见) on the verb with the agent-marker (于) — 吾长见笑于大方之家 (wú cháng jiàn xiào yú dà fāng zhī jiā, <em>庄子·秋水</em>) "I shall forever be laughed at by the masters of great learning." 为...所... is another common frame. 举于 alone can carry a passive sense in context: 傅说举于版筑之间 (fù yuè jǔ yú bǎn zhù zhī jiān, <em>孟子·告子下</em>) "Fu Yue was raised up from among the wall-builders."</p>
<h3>倒装句 — inverted word order</h3>
<ul>
<li><strong>宾语前置</strong> (fronted object) — in negative/interrogative sentences a pronoun object moves before the verb, often marked by 之: 何陋之有 (hé lòu zhī yǒu, 刘禹锡《陋室铭》) = 有何陋 "What crudeness is there?" — 之 here is a grammatical marker, not a pronoun.</li>
<li><strong>状语后置</strong> (postposed prepositional phrase) — 战于长勺 (zhàn yú cháng sháo, <em>左传·庄公十年</em>) = 于长勺战 "[they] fought at Changshao"; modern order would place 于长勺 before the verb.</li>
</ul>
<pre><code>判断句:  X者，Y也        陈胜者，阳城人也 — "Chen Sheng was a man of Yangcheng"
被动句:  见...于 / 为...所  吾长见笑于大方之家 — "laughed at by the masters"
宾语前置: 何V之有 = 有何V   何陋之有 = 有何陋 — "what crudeness is there?"
状语后置: V于X = 于XV      战于长勺 = 于长勺战 — "fought at Changshao"
</code></pre>
<div class="callout"><span class="badge">Reading strategy</span> When a sentence looks "backwards" or a verb seems to lack an object, first check whether it fits one of these three patterns before assuming a typo or unknown word.</div>`,
    `<span class="eyebrow">CCC501 · Chương 4 · Bài 4.1</span>
<h2>Cú pháp cổ: câu phán đoán, bị động, đảo trang</h2>
<h3>判断句 — câu phán đoán</h3>
<p>Văn ngôn thời cổ không có từ "là" (是); việc khẳng định đồng nhất được đánh dấu bằng trợ từ, phổ biến nhất là <strong>"X者，Y也"</strong> = "X là Y." Ví dụ: 陈胜者，阳城人也 (chén shèng zhě, yáng chéng rén yě, <em>史记·陈涉世家</em>) — "Trần Thắng là người đất Dương Thành."</p>
<h3>被动句 — câu bị động</h3>
<p>Dấu hiệu thường gặp: 于 sau động từ đưa ra chủ thể gây hành động; 见...于 kết hợp trợ từ bị động (见) trên động từ với dấu hiệu chủ thể (于) — 吾长见笑于大方之家 (wú cháng jiàn xiào yú dà fāng zhī jiā, <em>庄子·秋水</em>) "ta mãi bị bậc đại phương chê cười." 为...所... là khuôn khác cũng rất phổ biến. 举于 riêng nó cũng mang nghĩa bị động trong ngữ cảnh: 傅说举于版筑之间 (fù yuè jǔ yú bǎn zhù zhī jiān, <em>孟子·告子下</em>) "Phó Duyệt được cất nhắc lên từ giữa chốn đắp tường."</p>
<h3>倒装句 — câu đảo trang</h3>
<ul>
<li><strong>宾语前置</strong> (tân ngữ tiền trí) — trong câu phủ định/nghi vấn, tân ngữ đại từ đảo lên trước động từ, thường đánh dấu bằng 之: 何陋之有 (hé lòu zhī yǒu, 刘禹锡《陋室铭》) = 有何陋 "Có gì là quê mùa đâu?" — 之 ở đây chỉ là dấu hiệu ngữ pháp, không phải đại từ.</li>
<li><strong>状语后置</strong> (trạng ngữ giới từ hậu trí) — 战于长勺 (zhàn yú cháng sháo, <em>左传·庄公十年</em>) = 于长勺战 "đánh nhau ở đất Trường Thược"; trật tự hiện đại sẽ đặt 于长勺 trước động từ.</li>
</ul>
<pre><code>判断句:  X者，Y也        陈胜者，阳城人也 — "Trần Thắng là người đất Dương Thành"
被动句:  见...于 / 为...所  吾长见笑于大方之家 — "bị bậc đại phương chê cười"
宾语前置: 何V之有 = 有何V   何陋之有 = 有何陋 — "có gì là quê mùa đâu"
状语后置: V于X = 于XV      战于长勺 = 于长勺战 — "đánh nhau ở Trường Thược"
</code></pre>
<div class="callout"><span class="badge">Mẹo đọc</span> Khi một câu trông "ngược" hoặc động từ có vẻ thiếu tân ngữ, hãy kiểm tra xem nó có khớp một trong ba khuôn trên trước khi nghĩ là lỗi chép hay từ lạ.</div>`,
  ]]);

const c4q = quiz('ccc501-quiz-4', 'Quiz 4 — Classical syntax|||Quiz 4 — Cú pháp cổ', [
  { id: 'q1', question: 'Mẫu câu 判断句 phổ biến nhất trong văn ngôn cổ là gì?', options: ['X也，Y者', 'X者，Y也', 'X而Y', 'X于Y'], correctIndex: 1, explanation: '"X者，Y也" là khuôn phán đoán kinh điển, ví dụ 陈胜者，阳城人也.' },
  { id: 'q2', question: 'Trong 吾长见笑于大方之家, cấu trúc 见...于 biểu thị điều gì?', options: ['Câu nghi vấn', 'Câu bị động — chủ ngữ là đối tượng chịu tác động', 'Câu phán đoán', 'Câu điều kiện'], correctIndex: 1, explanation: '见 đứng trước động từ đánh dấu bị động, 于 sau đó đưa ra chủ thể gây ra hành động — "ta mãi bị bậc đại phương chê cười".' },
  { id: 'q3', question: '何陋之有 tương đương trật tự bình thường nào, và 之 ở đây có vai trò gì?', options: ['= 有何陋; 之 là đại từ tân ngữ', '= 有何陋; 之 là trợ từ đánh dấu tân ngữ đảo lên trước', '= 陋有何; 之 là động từ', '= 何有陋; 之 là giới từ'], correctIndex: 1, explanation: 'Đây là tân ngữ nghi vấn tiền trí, trật tự gốc là 有何陋 ("có gì là quê mùa"); 之 chỉ là dấu hiệu ngữ pháp của phép đảo, không mang nghĩa riêng.' },
]);

const c5 = doc('ccc501-5-1-luan-ngu-manh-tu', 'Reading the Analects (论语) & Mencius (孟子)|||Đọc hiểu Luận Ngữ (论语) & Mạnh Tử (孟子)',
  '学而不思则罔，思而不学则殆 (为政); 鱼，我所欲也 (告子上) — phân tích cấu trúc 而...则..., cụm 所+động từ, và ẩn dụ nghĩa/mạng sống.',
  [[
    `<span class="eyebrow">CCC501 · Chapter 5 · Lesson 5.1</span>
<h2>Reading the Analects (论语) &amp; Mencius (孟子)</h2>
<h3>Excerpt A — 论语·为政</h3>
<pre><code>学而不思则罔，思而不学则殆。
xué ér bù sī zé wǎng, sī ér bù xué zé dài.
"To learn without thinking leads to confusion; to think without learning leads to danger."
</code></pre>
<p>Grammar: 而 links the two verbs of each clause (learn-and-think / think-and-learn); 则 "then" introduces the resulting state; 罔/殆 are predicate adjectives standing for the outcome — a tightly parallel, two-clause structure typical of Analects aphorisms.</p>
<h3>Excerpt B — 孟子·告子上 (鱼我所欲也, opening)</h3>
<pre><code>鱼，我所欲也；熊掌，亦我所欲也。二者不可得兼，舍鱼而取熊掌者也。
yú, wǒ suǒ yù yě; xióng zhǎng, yì wǒ suǒ yù yě. èr zhě bù kě dé jiān, shě yú ér qǔ xióng zhǎng zhě yě.
"Fish is something I desire; bear's paw is also something I desire. If the two cannot both be had, I will give up the fish and take the bear's paw."
</code></pre>
<p>Grammar: 所欲 uses the 所-construction (所 + verb) to nominalize "that which is desired"; 者也 closes the sentence with the judgment-sentence flavor from Chapter 4. This is the opening of Mencius's famous analogy: the passage continues "生亦我所欲也，义亦我所欲也，二者不可得兼，舍生而取义者也" — choosing righteousness (义) over life (生) itself, just as one would choose bear's paw over fish.</p>
<div class="callout"><span class="badge">Reading habit</span> Notice how both excerpts are built from short, parallel, rhythmic clauses — a hallmark of pre-Qin philosophical prose that makes these lines easy to memorize and quote even today.</div>`,
    `<span class="eyebrow">CCC501 · Chương 5 · Bài 5.1</span>
<h2>Đọc hiểu Luận Ngữ (论语) &amp; Mạnh Tử (孟子)</h2>
<h3>Trích A — 论语·为政</h3>
<pre><code>学而不思则罔，思而不学则殆。
xué ér bù sī zé wǎng, sī ér bù xué zé dài.
"Học mà không suy nghĩ thì mờ mịt, suy nghĩ mà không học thì nguy hại."
</code></pre>
<p>Ngữ pháp: 而 nối hai động từ trong mỗi vế (học-rồi-suy nghĩ / suy nghĩ-rồi-học); 则 "thì" dẫn vào hệ quả; 罔/殆 làm vị ngữ tính từ diễn tả kết quả — cấu trúc đối xứng hai vế rất đặc trưng cho các câu cách ngôn trong Luận Ngữ.</p>
<h3>Trích B — 孟子·告子上 (câu mở đầu bài 鱼我所欲也)</h3>
<pre><code>鱼，我所欲也；熊掌，亦我所欲也。二者不可得兼，舍鱼而取熊掌者也。
yú, wǒ suǒ yù yě; xióng zhǎng, yì wǒ suǒ yù yě. èr zhě bù kě dé jiān, shě yú ér qǔ xióng zhǎng zhě yě.
"Cá là thứ ta muốn; tay gấu cũng là thứ ta muốn. Hai thứ không thể có cả, thì bỏ cá mà lấy tay gấu vậy."
</code></pre>
<p>Ngữ pháp: 所欲 dùng cấu trúc 所 + động từ để danh từ hoá "điều được muốn"; 者也 kết câu mang màu sắc câu phán đoán đã học ở Chương 4. Đây là câu mở đầu cho ẩn dụ nổi tiếng của Mạnh Tử: đoạn sau tiếp "生亦我所欲也，义亦我所欲也，二者不可得兼，舍生而取义者也" — chọn nghĩa (义) hơn mạng sống (生), cũng như chọn tay gấu hơn cá.</p>
<div class="callout"><span class="badge">Thói quen đọc</span> Cả hai trích đoạn đều dựng từ những vế câu ngắn, đối xứng, nhịp nhàng — đặc trưng của văn xuôi triết học tiền Tần, khiến những câu này dễ nhớ và vẫn được trích dẫn tới ngày nay.</div>`,
  ]]);

const c5q = quiz('ccc501-quiz-5', 'Quiz 5 — Analects & Mencius|||Quiz 5 — Luận Ngữ & Mạnh Tử', [
  { id: 'q1', question: '学而不思则罔，思而不学则殆 dạy điều gì về mối quan hệ học và suy nghĩ?', options: ['Chỉ cần học, không cần suy nghĩ', 'Chỉ cần suy nghĩ, không cần học', 'Học và suy nghĩ phải đi cùng nhau, thiếu một bên đều có hại', 'Học và suy nghĩ không liên quan gì nhau'], correctIndex: 2, explanation: 'Câu đối xứng 学而不思/思而不学 chỉ ra học thiếu suy nghĩ thì mờ mịt (罔), suy nghĩ thiếu học thì nguy hại (殆) — cần cả hai.' },
  { id: 'q2', question: 'Cấu trúc 所 + động từ (như 所欲) trong 鱼，我所欲也 tạo ra loại cụm từ gì?', options: ['Cụm danh từ hoá, nghĩa "điều/cái mà..." (điều ta muốn)', 'Cụm động từ mệnh lệnh', 'Cụm giới từ chỉ nơi chốn', 'Cụm liên từ nối hai câu'], correctIndex: 0, explanation: '所 đặt trước động từ biến cụm thành danh ngữ "cái được [động từ]" — 所欲 = "điều được muốn/điều ta muốn".' },
  { id: 'q3', question: 'Ẩn dụ "cá và tay gấu" trong Mạnh Tử dùng để dẫn tới lập luận nào?', options: ['So sánh giá trị ẩm thực', 'Chọn nghĩa (义) hơn mạng sống (生) khi không thể có cả hai', 'Bàn về nông nghiệp', 'Phê phán việc ăn uống xa hoa'], correctIndex: 1, explanation: 'Đoạn tiếp theo của bài 鱼我所欲也 suy luận 生 và 义 cũng như cá và tay gấu — khi phải chọn, người quân tử chọn nghĩa (义) mà bỏ mạng sống (生).' },
]);

const c6 = doc('ccc501-6-1-su-ky-ta-truyen', 'Reading Records of the Grand Historian (史记) & Zuo Zhuan (左传)|||Đọc hiểu Sử Ký (史记) & Tả Truyện (左传)',
  '王侯将相宁有种乎 (陈涉世家); 一鼓作气，再而衰，三而竭 (曹刿论战). Câu hỏi tu từ, chiến thuật đánh trận, liên hệ 战于长勺 đã học ở Chương 4.',
  [[
    `<span class="eyebrow">CCC501 · Chapter 6 · Lesson 6.1</span>
<h2>Reading historical narrative: 史记 &amp; 左传</h2>
<h3>Excerpt A — 史记·陈涉世家</h3>
<pre><code>王侯将相宁有种乎！
wáng hóu jiàng xiàng níng yǒu zhǒng hū!
"Are kings, marquises, generals and ministers a matter of bloodline?!"
</code></pre>
<p>Chen She's rhetorical question to his fellow conscripted laborers, spoken just before the first major uprising against the Qin dynasty (209 BCE). 宁...乎 is a rhetorical-question frame — "how could it possibly...?" — used to reject an assumption outright. The same chapter opens with the judgment sentence from Chapter 4: 陈胜者，阳城人也.</p>
<h3>Excerpt B — 左传·庄公十年 (曹刿论战)</h3>
<pre><code>一鼓作气，再而衰，三而竭。
yī gǔ zuò qì, zài ér shuāi, sān ér jié.
"At the first drumbeat morale rises; at the second it wanes; at the third it is spent."
</code></pre>
<p>Cao Gui's explanation of why he waited for the enemy's third drumroll before ordering the counterattack at the Battle of Changshao — the very battle from Chapter 4's example 战于长勺 (fought at Changshao). Note the historiographical styles: 史记 mixes narration with direct speech and moral judgment (太史公曰); 左传 is famous for compact battle accounts and diplomatic speeches.</p>
<div class="callout"><span class="badge">Cross-reference</span> Both excerpts reuse grammar from earlier chapters: 宁...乎 works like the modal hedges of Chapter 2, and 战于长勺 is the postposed adverbial from Chapter 4 in its original context.</div>`,
    `<span class="eyebrow">CCC501 · Chương 6 · Bài 6.1</span>
<h2>Đọc hiểu sử truyện: 史记 &amp; 左传</h2>
<h3>Trích A — 史记·陈涉世家</h3>
<pre><code>王侯将相宁有种乎！
wáng hóu jiàng xiàng níng yǒu zhǒng hū!
"Vương hầu tướng tướng lẽ nào là do dòng dõi sẵn có?!"
</code></pre>
<p>Câu hỏi tu từ của Trần Thắng nói với những người lính đồ dịch cùng cảnh ngộ, ngay trước cuộc khởi nghĩa lớn đầu tiên chống nhà Tần (năm 209 TCN). 宁...乎 là khuôn câu hỏi tu từ — "lẽ nào lại...?" — dùng để bác bỏ hẳn một giả định. Cũng trong chương này mở đầu bằng câu phán đoán đã học ở Chương 4: 陈胜者，阳城人也.</p>
<h3>Trích B — 左传·庄公十年 (曹刿论战)</h3>
<pre><code>一鼓作气，再而衰，三而竭。
yī gǔ zuò qì, zài ér shuāi, sān ér jié.
"Đánh trống lần một khí thế bừng lên, lần hai suy giảm, lần ba cạn kiệt."
</code></pre>
<p>Lời Tào Quế giải thích vì sao ông đợi đến hồi trống thứ ba của quân địch mới ra lệnh phản công trong trận Trường Thược — chính trận đánh trong ví dụ 战于长勺 của Chương 4. Lưu ý phong cách sử liệu: 史记 pha trộn tường thuật với lời thoại trực tiếp và lời bình (太史公曰); 左传 nổi tiếng với những đoạn tường thuật trận mạc và lời đối đáp ngoại giao cô đọng.</p>
<div class="callout"><span class="badge">Liên hệ ngược</span> Cả hai trích đoạn đều dùng lại ngữ pháp đã học: 宁...乎 hoạt động như các ngữ khí ước đoán ở Chương 2, còn 战于长勺 chính là trạng ngữ hậu trí của Chương 4 trong ngữ cảnh gốc.</div>`,
  ]]);

const c6q = quiz('ccc501-quiz-6', 'Quiz 6 — Records of the Grand Historian & Zuo Zhuan|||Quiz 6 — Sử Ký & Tả Truyện', [
  { id: 'q1', question: '王侯将相宁有种乎 là câu nói của ai, trong bối cảnh nào?', options: ['Khổng Tử, khi dạy học trò', 'Trần Thắng (陈胜), trước cuộc khởi nghĩa nông dân chống nhà Tần', 'Tào Quế, khi bàn về chiến thuật đánh trận', 'Tô Thức, khi làm thơ'], correctIndex: 1, explanation: 'Câu nói nổi tiếng của Trần Thắng trong Sử Ký·Trần Thiệp thế gia, mở đầu cuộc khởi nghĩa chống Tần năm 209 TCN.' },
  { id: 'q2', question: '一鼓作气，再而衰，三而竭 giải thích điều gì trong trận Trường Thược?', options: ['Vì sao phải đánh trống ba lần liên tục', 'Vì sao Tào Quế đợi đến hồi trống thứ ba của địch mới phản công', 'Cách chế tạo trống trận', 'Số lượng quân cần thiết để thắng trận'], correctIndex: 1, explanation: 'Tào Quế giải thích khí thế địch giảm dần qua ba hồi trống, nên đợi hồi thứ ba (địch đã kiệt sức) mới phản công.' },
  { id: 'q3', question: '战于长勺 minh hoạ cho hiện tượng cú pháp nào đã học ở Chương 4?', options: ['Câu phán đoán 者...也', 'Câu bị động 见...于', 'Trạng ngữ giới từ hậu trí (đảo ra sau động từ), = 于长勺战', 'Tân ngữ tiền trí'], correctIndex: 2, explanation: '战于长勺 đảo cụm giới từ 于长勺 ra sau động từ 战; trật tự thường sẽ là 于长勺战 (đánh ở Trường Thược).' },
]);

const c7 = doc('ccc501-7-1-tho-tu-tan-van', 'Classical poetry (诗), lyric verse (词) & prose (散文)|||Đọc hiểu thơ (诗), từ (词) & tản văn (散文) cổ',
  '静夜思 (李白), 水调歌头 (苏轼), 岳阳楼记 (范仲淹) — đối xứng trong thơ, khuôn từ điệu 词牌, và trợ từ 之 làm danh ngữ trong tản văn.',
  [[
    `<span class="eyebrow">CCC501 · Chapter 7 · Lesson 7.1</span>
<h2>Classical poetry, lyric verse &amp; prose</h2>
<h3>诗 — Li Bai, "Quiet Night Thoughts" (静夜思)</h3>
<pre><code>床前明月光，疑是地上霜。举头望明月，低头思故乡。
chuáng qián míng yuè guāng, yí shì dì shàng shuāng; jǔ tóu wàng míng yuè, dī tóu sī gù xiāng.
"Moonlight before my bed — I took it for frost on the ground. I raise my head to gaze at the bright moon, lower it, thinking of home."
</code></pre>
<p>Note the parallel structure 举头 / 低头 (raise head / lower head): Classical poetry favors strict parallelism (对仗) and compressed imagery with almost no explicit grammatical connectives.</p>
<h3>词 — Su Shi, "Prelude to Water Melody" (水调歌头)</h3>
<pre><code>明月几时有？把酒问青天。……但愿人长久，千里共婵娟。
míng yuè jǐ shí yǒu? bǎ jiǔ wèn qīng tiān. ... dàn yuàn rén cháng jiǔ, qiān lǐ gòng chán juān.
"When did the bright moon first appear? I raise my cup and ask the blue sky... I only wish we may all live long, sharing this graceful moonlight though a thousand miles apart."
</code></pre>
<p>Unlike 诗, a 词 (cí) follows the fixed tonal/metrical pattern of a named 词牌 (here 水调歌头, "Prelude to Water Melody") rather than a single uniform meter.</p>
<h3>散文 — Fan Zhongyan, "Record of Yueyang Tower" (岳阳楼记)</h3>
<pre><code>先天下之忧而忧，后天下之乐而乐。
xiān tiān xià zhī yōu ér yōu, hòu tiān xià zhī lè ér lè.
"Be first in worrying about the world's troubles, and last in enjoying its pleasures."
</code></pre>
<p>之 here is the subordinating particle from Chapter 2, nominalizing 天下 + 忧 into "the world's worry" — classical 散文 (unrhymed prose essays) lean on this device to pack compact, quotable clauses.</p>
<div class="callout"><span class="badge">Three genres, one toolkit</span> The same hư từ and syntax you drilled in Chapters 2-4 recur across poetry, lyric verse and prose — only the register and density of imagery change.</div>`,
    `<span class="eyebrow">CCC501 · Chương 7 · Bài 7.1</span>
<h2>Thơ (诗), từ (词) &amp; tản văn (散文) cổ</h2>
<h3>诗 — Lý Bạch, "Tĩnh dạ tứ" (静夜思)</h3>
<pre><code>床前明月光，疑是地上霜。举头望明月，低头思故乡。
chuáng qián míng yuè guāng, yí shì dì shàng shuāng; jǔ tóu wàng míng yuè, dī tóu sī gù xiāng.
"Đầu giường ánh trăng rọi, ngỡ là sương trên đất. Ngẩng đầu nhìn trăng sáng, cúi đầu nhớ cố hương."
</code></pre>
<p>Chú ý phép đối xứng 举头 / 低头 (ngẩng đầu / cúi đầu): thơ cổ ưa lối đối xứng (对仗) và hình ảnh cô đọng, gần như không dùng liên từ ngữ pháp tường minh.</p>
<h3>词 — Tô Thức, "Thuỷ điệu ca đầu" (水调歌头)</h3>
<pre><code>明月几时有？把酒问青天。……但愿人长久，千里共婵娟。
míng yuè jǐ shí yǒu? bǎ jiǔ wèn qīng tiān. ... dàn yuàn rén cháng jiǔ, qiān lǐ gòng chán juān.
"Trăng sáng có tự bao giờ? Nâng chén hỏi trời xanh... Chỉ mong người mãi trường tồn, ngàn dặm cùng ngắm ánh trăng đẹp."
</code></pre>
<p>Khác với 诗, một bài 词 tuân theo khuôn nhịp-điệu cố định của một 词牌 có tên riêng (ở đây là 水调歌头), chứ không theo một luật thơ đồng nhất.</p>
<h3>散文 — Phạm Trọng Yêm, "Nhạc Dương lâu ký" (岳阳楼记)</h3>
<pre><code>先天下之忧而忧，后天下之乐而乐。
xiān tiān xià zhī yōu ér yōu, hòu tiān xià zhī lè ér lè.
"Lo trước cái lo của thiên hạ, vui sau cái vui của thiên hạ."
</code></pre>
<p>之 ở đây là trợ từ chen giữa đã học ở Chương 2, biến 天下 + 忧 thành danh ngữ "nỗi lo của thiên hạ" — tản văn cổ (散文 không vần) dựa nhiều vào thủ pháp này để nén thành những vế câu cô đọng, dễ trích dẫn.</p>
<div class="callout"><span class="badge">Ba thể loại, một bộ công cụ</span> Cùng những hư từ và cú pháp đã luyện ở Chương 2-4 lặp lại xuyên suốt thơ, từ, tản văn — chỉ khác nhau ở giọng điệu và mật độ hình ảnh.</div>`,
  ]]);

const c7q = quiz('ccc501-quiz-7', 'Quiz 7 — Poetry, lyric verse & prose|||Quiz 7 — Thơ, từ, tản văn cổ', [
  { id: 'q1', question: '静夜思 dùng phép đối nào để diễn tả tâm trạng nhớ quê?', options: ['So sánh 明月 với 霜 rồi kết thúc', 'Đối xứng 举头 (ngẩng đầu) / 低头 (cúi đầu)', 'Dùng toàn câu hỏi tu từ', 'Liệt kê địa danh quê hương'], correctIndex: 1, explanation: 'Hai động tác đối xứng 举头 – 低头 (ngẩng đầu nhìn trăng / cúi đầu nhớ quê) là trục cảm xúc của bài thơ.' },
  { id: 'q2', question: 'Khác biệt cơ bản giữa 词 (từ) và 诗 (thơ) là gì?', options: ['Từ không có vần, thơ luôn có vần', 'Từ theo khuôn nhịp-điệu cố định của một từ điệu (词牌, vd Thuỷ Điệu Ca Đầu), thơ Đường luật theo luật bằng trắc/đối riêng', 'Từ chỉ viết về thiên nhiên, thơ chỉ viết về tình yêu', 'Từ xuất hiện trước thơ Đường'], correctIndex: 1, explanation: 'Từ tuân theo một 词牌 (khuôn nhịp-điệu cố định, ví dụ 水调歌头); thơ Đường luật có luật riêng về bằng trắc và đối, nhưng không theo 词牌.' },
  { id: 'q3', question: 'Trong 先天下之忧而忧，后天下之乐而乐, chữ 之 đóng vai trò gì (liên hệ Chương 2)?', options: ['Đại từ chỉ người nói', 'Trợ từ nối chủ ngữ "thiên hạ" với "nỗi lo" thành một danh ngữ, không dịch riêng', 'Giới từ chỉ nơi chốn', 'Động từ "đi tới"'], correctIndex: 1, explanation: '之 ở đây là trợ từ định ngữ, biến 天下 + 忧 thành cụm danh từ "nỗi lo của thiên hạ" — đúng chức năng đã học ở Chương 2.' },
]);

const c8 = doc('ccc501-8-1-on-tap-dich-dien-co', 'Review: translation method (六字诀) & allusions (典故)|||Ôn tập: phương pháp dịch (六字诀) & điển cố (典故)',
  'Lục tự quyết dịch văn ngôn: 留删补换调贯. Bốn thành ngữ điển cố: 画蛇添足, 守株待兔, 刻舟求剑, 狐假虎威 — nguồn gốc & bài học.',
  [[
    `<span class="eyebrow">CCC501 · Chapter 8 · Lesson 8.1</span>
<h2>Review: translation method &amp; allusions</h2>
<h3>六字诀 — six techniques for translating 文言文</h3>
<ul>
<li><strong>留 (liú, "retain")</strong> — keep proper nouns, dates, official titles as-is.</li>
<li><strong>删 (shān, "delete")</strong> — drop function words with no modern equivalent (some 之/也 exist purely for rhythm).</li>
<li><strong>补 (bǔ, "supplement")</strong> — restore subjects/objects the original omitted.</li>
<li><strong>换 (huàn, "replace")</strong> — swap an archaic word for its modern/Vietnamese equivalent (吾 → "tôi/ta").</li>
<li><strong>调 (diào, "reorder")</strong> — undo the inversions from Chapter 4 (fronted objects, postposed adverbials) back to normal order.</li>
<li><strong>贯 (guàn, "connect smoothly")</strong> — once the literal meaning is secure, polish it into natural, connected prose.</li>
</ul>
<h3>典故 — four allusions still used as chengyu today</h3>
<pre><code>画蛇添足 huà shé tiān zú   "draw a snake, add feet" (战国策) — a fast-drawing winner
  adds feet to his snake and loses the prize to the runner-up: ruining
  something by adding needless extras.
守株待兔 shǒu zhū dài tù   "guard the stump, wait for a rabbit" (韩非子) — a
  farmer who once saw a rabbit run into a stump abandons farming to wait
  for another: relying on a lucky fluke instead of real effort.
刻舟求剑 kè zhōu qiú jiàn  "carve the boat to find the sword" (吕氏春秋) — a
  man marks where his sword fell on a MOVING boat, then searches there
  later: clinging rigidly to a fixed method as circumstances change.
狐假虎威 hú jiǎ hǔ wēi     "the fox borrows the tiger's might" (战国策) — a
  fox tricks a tiger into "proving" other animals fear the fox: bullying
  others by borrowing someone else's power.
</code></pre>
<div class="callout"><span class="badge">Putting it together</span> Translating 文言文 well is not word-for-word substitution — apply 留删补换调 in that rough order, then 贯 the result into one smooth sentence, checking every hư từ (之其而以于), any 词类活用, and any inverted clause along the way.</div>`,
    `<span class="eyebrow">CCC501 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: phương pháp dịch &amp; điển cố</h2>
<h3>六字诀 — sáu thao tác dịch văn ngôn</h3>
<ul>
<li><strong>留 (liú, "giữ")</strong> — giữ nguyên tên riêng, niên hiệu, chức quan.</li>
<li><strong>删 (shān, "bỏ")</strong> — xoá những hư từ không có tương đương hiện đại (một số 之/也 chỉ để tạo nhịp).</li>
<li><strong>补 (bǔ, "thêm")</strong> — khôi phục chủ ngữ/tân ngữ bị nguyên bản lược bỏ.</li>
<li><strong>换 (huàn, "đổi")</strong> — thay từ cổ bằng từ tương đương hiện đại/tiếng Việt (吾 → "tôi/ta").</li>
<li><strong>调 (diào, "sắp lại")</strong> — trả các câu đảo trang ở Chương 4 (tân ngữ tiền trí, trạng ngữ hậu trí) về trật tự thường.</li>
<li><strong>贯 (guàn, "nối liền")</strong> — khi nghĩa đen đã chắc, gọt lại thành câu văn tự nhiên, mạch lạc.</li>
</ul>
<h3>典故 — bốn thành ngữ vẫn dùng tới ngày nay</h3>
<pre><code>画蛇添足 huà shé tiān zú   "vẽ rắn thêm chân" (战国策) — người vẽ xong
  trước, rảnh tay vẽ thêm chân cho rắn, thua mất phần rượu về tay người
  sau: làm hỏng việc vì thêm chi tiết thừa.
守株待兔 shǒu zhū dài tù   "ôm gốc cây đợi thỏ" (韩非子) — người nông dân
  từng thấy thỏ đâm vào gốc cây mà chết, bỏ cày cấy ngồi đợi con thỏ
  khác: ỷ vào may rủi thay vì nỗ lực thật sự.
刻舟求剑 kè zhōu qiú jiàn  "khắc mạn thuyền tìm gươm" (吕氏春秋) — đánh rơi
  gươm xuống sông, khắc dấu trên thuyền ĐANG TRÔI rồi tìm theo dấu đó:
  máy móc giữ cách làm cũ dù hoàn cảnh đã đổi khác.
狐假虎威 hú jiǎ hǔ wēi     "cáo mượn oai hùm" (战国策) — con cáo lừa hổ
  rằng muông thú sợ chính nó, rồi đi trước hổ để "chứng minh": mượn thế
  người khác để doạ nạt kẻ khác.
</code></pre>
<div class="callout"><span class="badge">Tổng kết</span> Dịch văn ngôn tốt không phải dịch từng chữ — áp dụng 留删补换调 theo thứ tự đó, rồi 贯 kết quả thành một câu văn trôi chảy, luôn rà lại từng hư từ (之其而以于), mọi 词类活用, và mọi mệnh đề đảo trang trên đường đi.</div>`,
  ]]);

const c8q = quiz('ccc501-quiz-8', 'Quiz 8 — Translation method & allusions|||Quiz 8 — Phương pháp dịch & điển cố', [
  { id: 'q1', question: 'Trong "lục tự quyết" dịch văn ngôn, chữ 调 (diào) chỉ thao tác nào?', options: ['Xoá hư từ thừa', 'Sắp lại trật tự từ bị đảo (tân ngữ tiền trí, trạng ngữ hậu trí…) về trật tự thường', 'Giữ nguyên tên riêng', 'Thêm chủ ngữ bị lược'], correctIndex: 1, explanation: '调 = điều chỉnh trật tự, áp dụng đúng cho các câu đảo trang đã học ở Chương 4 (như 何陋之有, 战于长勺).' },
  { id: 'q2', question: 'Thành ngữ 守株待兔 phê phán điều gì?', options: ['Sự chăm chỉ quá mức', 'Việc ỷ vào may mắn ngẫu nhiên thay vì nỗ lực thực sự', 'Kỹ thuật canh tác lạc hậu', 'Lòng tham của thương nhân'], correctIndex: 1, explanation: 'Người nông dân bỏ cày cấy, ngồi cạnh gốc cây chờ thỏ khác tự đâm vào chết như lần đầu — ví cho thói ỷ lại may rủi.' },
  { id: 'q3', question: '刻舟求剑 dùng để phê phán kiểu tư duy nào?', options: ['Tư duy đổi mới liên tục', 'Cố chấp giữ cách làm cũ dù hoàn cảnh đã đổi khác', 'Không dám hành động', 'Quá tin vào số liệu'], correctIndex: 1, explanation: 'Khắc dấu trên thuyền đang trôi rồi tìm gươm theo dấu đó — máy móc, không nhận ra hoàn cảnh (vị trí) đã thay đổi.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'CCC501',
    slug: 'ccc501-classical-chinese-language',
    title: 'Classical Chinese Language',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCC501.webp',
    shortDescription: 'Classical Chinese 文言文 vs vernacular 白话文: function words 之其而以于, flexible word classes 词类活用, syntax (judgment/passive/inversion), readings from Analects, Mencius, Sima Qian & Zuo Zhuan, classical poetry, translation method & allusions.|||Văn ngôn 文言文 và bạch thoại 白话文: hư từ 之其而以于, từ loại linh hoạt 词类活用, cú pháp cổ (phán đoán/bị động/đảo trang), đọc Luận Ngữ, Mạnh Tử, Sử Ký, Tả Truyện, thơ - từ - tản văn cổ, phương pháp dịch & điển cố.',
    description: 'Môn <strong>CCC501 — Classical Chinese Language</strong> (Hán văn Cổ điển / Văn ngôn 文言文, kỳ 7, ngành Ngôn ngữ Trung) dựng khung 8 chương: <strong>tổng quan văn ngôn</strong> (khác biệt với bạch thoại) → <strong>hư từ</strong> (之其而以于) → <strong>từ loại linh hoạt</strong> (词类活用) → <strong>cú pháp cổ</strong> (phán đoán, bị động, đảo trang) → <strong>đọc hiểu</strong> Luận Ngữ &amp; Mạnh Tử, Sử Ký &amp; Tả Truyện, thơ - từ - tản văn cổ → <strong>ôn tập</strong> phương pháp dịch &amp; điển cố. Trích văn ngôn nguyên bản (汉字) kèm pinyin và dịch nghĩa Việt, quiz mỗi chương. Tham khảo 古代汉语 (王力), 文言文入门, An Introduction to Literary Chinese (Fuller).',
    whatYouLearn: 'Đặc điểm văn ngôn vs bạch thoại; hư từ 之/其/而/以/于; thực từ & từ loại linh hoạt (使动/意动/名词作动词, đổi thanh điệu); cú pháp cổ (判断句 者...也, 被动句 见...于/为...所, 倒装句 宾语前置/状语后置); đọc hiểu Luận Ngữ, Mạnh Tử, Sử Ký, Tả Truyện, thơ Đường - từ Tống - tản văn cổ; phương pháp dịch văn ngôn (lục tự quyết: 留删补换调贯) & điển cố (成语).',
    requirements: 'Đã học các môn Hán ngữ cơ bản - trung cấp (từ vựng, ngữ pháp bạch thoại); đọc được chữ Hán phồn/giản thể ở mức trung cấp trở lên. Nên tra thêm giáo trình 古代汉语 (王力) trên FLM.',
  },
  sections: [
    { title: 'Chương 1 — Tổng quan văn ngôn|||Chapter 1 — Overview of Classical Chinese', description: 'Đặc điểm văn ngôn & khác biệt với bạch thoại.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hư từ 之其而以于|||Chapter 2 — Function words 之其而以于', description: 'Chức năng & ví dụ của năm hư từ cốt lõi.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thực từ & từ loại linh hoạt|||Chapter 3 — Content words & 词类活用', description: 'Danh/động/tính từ đổi chức năng theo vị trí câu.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cú pháp văn ngôn|||Chapter 4 — Classical syntax', description: 'Câu phán đoán, bị động, đảo trang.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đọc hiểu Luận Ngữ & Mạnh Tử|||Chapter 5 — Reading the Analects & Mencius', description: '论语, 孟子 — trích văn & phân tích ngữ pháp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đọc hiểu Sử Ký & Tả Truyện|||Chapter 6 — Reading Records of the Grand Historian & Zuo Zhuan', description: '史记, 左传 — trích sử truyện & phân tích.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đọc hiểu thơ, từ, tản văn cổ|||Chapter 7 — Classical poetry, lyric verse & prose', description: 'Lý Bạch, Tô Thức, Phạm Trọng Yêm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: dịch văn ngôn & điển cố|||Chapter 8 — Review: translation method & allusions', description: 'Lục tự quyết dịch văn ngôn & bốn thành ngữ điển cố.', lessons: [c8, c8q] },
  ],
};
