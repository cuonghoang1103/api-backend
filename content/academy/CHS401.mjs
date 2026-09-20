/**
 * CHS401 — Chinese Speaking 5 (Nói tiếng Trung 5, nâng cao). Khối Ngôn ngữ
 * Trung FPTU. Đây là MÔN NGÔN NGỮ, track LUYỆN NÓI, NỐI TIẾP CHS301: trình độ
 * khẩu ngữ HSK5 — không còn chỉ nêu ý kiến, mà phải NÓI TRÔI CHẢY: kể chuyện
 * mạch lạc, miêu tả & bình luận, bảo vệ quan điểm, thảo luận nhóm & đàm phán,
 * thuyết trình có cấu trúc, giao tiếp công việc & phỏng vấn, tranh luận xã
 * hội, và ôn tập hùng biện/phản biện/luyện lưu loát. Giáo trình chuẩn:
 * Advanced Spoken Chinese (北京语言大学出版社), HSK Standard Course 5 (口语).
 * Trọng tâm: mẫu chuyển ý, cụm diễn đạt trôi chảy, hội thoại nhiều lượt. Lộ
 * trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng. Giữ NGUYÊN
 * slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; trong HTML
 * content "&" → "&amp;". shortDescription "&".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & mẫu câu khẩu ngữ của bài.', quiz: { timeLimitSeconds: 360, questions } });

const taiLieu = doc('chs401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình luyện nói',
  'Giáo trình khẩu ngữ chuẩn (Advanced Spoken Chinese, HSK Standard Course 5 口语), app luyện nói (HelloChinese/Pleco), lộ trình 4 bước: Nghe → Bắt chước → Luyện cặp → Ứng dụng.',
  [[
    `<span class="eyebrow">CHS401 · Materials</span>
<h2>Speak fluently in Chinese — materials &amp; roadmap</h2>
<p class="lead">Chinese Speaking 5 continues <strong>CHS301</strong>. There you learned to state and defend an opinion. Here, at <strong>HSK5</strong>, the goal shifts to <strong>fluency</strong>: narrating a story with no gaps, describing and commenting on a phenomenon, negotiating in a group, giving a structured presentation, handling a professional interview, and debating a social topic — all with the connective phrases that make long speech sound natural instead of choppy.</p>
<h3>📘 Standard textbooks (spoken track)</h3>
<ul>
<li><strong>Advanced Spoken Chinese</strong> (北京语言大学出版社 — Beijing Language and Culture University Press): the advanced volume of the mainstream spoken-Chinese series, built around fluent narration, debate and presentation.</li>
<li><strong>HSK Standard Course 5 (口语)</strong> — the spoken component of HSK5: vocabulary and grammar dense enough to support a five-minute talk.</li>
</ul>
<h3>📱 Apps for speaking &amp; sound</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — course with speech-recognition practice.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — dictionary with native audio for every word (shadow it).</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese-Vietnamese dictionary with audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real conversations with subtitles, closer to native speed.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — structured HSK lessons.</li>
</ul>
<div class="callout"><span class="badge">4-step speaking path</span>
<ol>
<li><strong>Listen (Nghe)</strong> — hear a whole connective phrase and its tones before reading the pinyin.</li>
<li><strong>Imitate (Bắt chước)</strong> — shadow the audio out loud; keep the rhythm across the WHOLE sentence, not word by word.</li>
<li><strong>Pair drill (Luyện cặp)</strong> — run each dialogue with a partner, swapping the two sides.</li>
<li><strong>Apply (Ứng dụng)</strong> — retell, comment on, or debate a real topic the same day, using the pattern you just learned.</li>
</ol></div>`,
    `<span class="eyebrow">CHS401 · Tài liệu</span>
<h2>Nói tiếng Trung lưu loát — tài liệu &amp; lộ trình</h2>
<p class="lead">Tiếng Trung nói 5 nối tiếp <strong>CHS301</strong>. Ở đó bạn học nêu và bảo vệ một quan điểm. Ở đây, trình độ <strong>HSK5</strong>, mục tiêu chuyển sang <strong>sự trôi chảy</strong>: kể lại một câu chuyện không đứt đoạn, miêu tả &amp; bình luận một hiện tượng, đàm phán trong nhóm, thuyết trình có cấu trúc, xử lý một buổi phỏng vấn chuyên nghiệp, và tranh luận một chủ đề xã hội — tất cả cùng các cụm từ nối ý khiến câu nói dài nghe tự nhiên chứ không rời rạc.</p>
<h3>📘 Giáo trình chuẩn (hướng khẩu ngữ)</h3>
<ul>
<li><strong>Advanced Spoken Chinese</strong> (北京语言大学出版社 — NXB Đại học Ngôn ngữ Bắc Kinh): tập nâng cao của bộ giáo trình khẩu ngữ phổ biến nhất, xoay quanh kể chuyện trôi chảy, tranh luận và thuyết trình.</li>
<li><strong>HSK Standard Course 5 (口语)</strong> — phần khẩu ngữ của HSK5: từ vựng &amp; ngữ pháp đủ dày để đỡ được một bài nói năm phút.</li>
</ul>
<h3>📱 App luyện nói &amp; nghe âm</h3>
<ul>
<li><a href="https://www.hellochinese.cc/" target="_blank" rel="noopener">HelloChinese</a> — khoá học có nhận diện giọng nói.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển có audio bản ngữ cho từng từ (hãy nói nhại theo).</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung-Việt kèm audio &amp; pinyin.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại thật có phụ đề, gần tốc độ bản ngữ.</li>
<li><a href="https://www.youtube.com/@ChineseZeroToHero" target="_blank" rel="noopener">Chinese Zero to Hero</a> — bài HSK có hệ thống.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước luyện nói</span>
<ol>
<li><strong>Nghe</strong> — nghe trọn một cụm từ nối ý và thanh điệu của nó trước khi nhìn pinyin.</li>
<li><strong>Bắt chước</strong> — nói nhại theo audio thật to; giữ nhịp xuyên suốt CẢ CÂU, không nói rời từng từ.</li>
<li><strong>Luyện cặp</strong> — chạy mỗi hội thoại với bạn, đổi hai phía cho nhau.</li>
<li><strong>Ứng dụng</strong> — kể lại, bình luận, hoặc tranh luận một chủ đề thật ngay trong ngày, dùng đúng mẫu câu vừa học.</li>
</ol></div>`,
  ]]);

const intro = doc('chs401-0-1-overview', 'Course overview: Chinese Speaking 5|||Tổng quan: Tiếng Trung nói 5',
  'Nối tiếp CHS301: mục tiêu khẩu ngữ HSK5 là sự TRÔI CHẢY — kể chuyện mạch lạc, miêu tả &amp; bình luận, bảo vệ quan điểm, đàm phán, thuyết trình, phỏng vấn, tranh luận, ôn tập lưu loát.',
  [[
    `<span class="eyebrow">CHS401 · Lesson 0.1 · Overview</span>
<h2>Chinese Speaking 5 (HSK5)</h2>
<p class="lead">This course <strong>continues CHS301</strong>. There you learned to state and defend an opinion in a short exchange. Here the target is <strong>fluency across a whole turn</strong> — several sentences in a row, held together by connective phrases, without long pauses or restarting mid-sentence. Eight chapters: <strong>narrating &amp; retelling</strong>, <strong>describing &amp; commenting</strong>, <strong>expressing &amp; defending an opinion</strong>, <strong>group discussion &amp; negotiation</strong>, <strong>structured presentation</strong>, <strong>professional communication &amp; interviews</strong>, <strong>debating a social topic</strong>, then a full <strong>review of rhetoric, rebuttal and fluency drills</strong>.</p>
<h3>What CHS301 gave you (the base)</h3>
<ul>
<li><strong>Opinion frames</strong> — 在我看来…, 一方面…另一方面…, 我不完全同意 already sit in your toolkit; CHS401 adds the frames that link several of these together into one fluent turn.</li>
<li><strong>Discussion, not just Q&amp;A</strong> — you can already hold a 4-turn discussion; now you hold the floor for longer, and you take the lead in a negotiation or a debate.</li>
</ul>
<h3>How each lesson works</h3>
<p>Every lesson gives you a <strong>spoken vocabulary &amp; phrase table</strong> (汉字 | pinyin | nghĩa), the <strong>connective / expression patterns</strong> at the centre of the skill, a <strong>sample dialogue</strong> (4 turns) to shadow and role-play, and a <strong>fluency / delivery note</strong>. Then a short quiz. Always follow the 4 steps: listen → imitate → pair-drill → apply.</p>
<h3>Roadmap</h3>
<p>Narrating &amp; retelling → describing &amp; commenting → expressing &amp; defending an opinion → group discussion &amp; negotiation → structured presentation → professional communication &amp; interviews → debating a social topic → review: rhetoric, rebuttal &amp; fluency.</p>`,
    `<span class="eyebrow">CHS401 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Trung nói 5 (HSK5)</h2>
<p class="lead">Môn này <strong>nối tiếp CHS301</strong>. Ở đó bạn học nêu và bảo vệ một quan điểm trong một lượt trao đổi ngắn. Ở đây mục tiêu là <strong>trôi chảy xuyên suốt một lượt nói</strong> — nhiều câu liên tiếp, gắn với nhau bằng các cụm từ nối ý, không ngắt quãng lâu hay nói lại giữa câu. Tám chương: <strong>kể chuyện &amp; thuật lại</strong>, <strong>miêu tả &amp; bình luận</strong>, <strong>bày tỏ &amp; bảo vệ quan điểm</strong>, <strong>thảo luận nhóm &amp; đàm phán</strong>, <strong>thuyết trình có cấu trúc</strong>, <strong>giao tiếp công việc &amp; phỏng vấn</strong>, <strong>tranh luận chủ đề xã hội</strong>, rồi một chương <strong>ôn tập hùng biện, phản biện &amp; luyện lưu loát</strong> trọn vẹn.</p>
<h3>CHS301 đã cho bạn nền gì</h3>
<ul>
<li><strong>Khung nêu quan điểm</strong> — 在我看来…, 一方面…另一方面…, 我不完全同意 đã có sẵn trong túi công cụ của bạn; CHS401 thêm những khung nối các mẫu này lại thành một lượt nói trôi chảy.</li>
<li><strong>Thảo luận, không chỉ hỏi-đáp</strong> — bạn đã giữ được một cuộc thảo luận 4 lượt; giờ bạn giữ lời lâu hơn, và dẫn dắt trong một cuộc đàm phán hay tranh luận.</li>
</ul>
<h3>Mỗi bài học ra sao</h3>
<p>Mỗi bài có <strong>bảng từ vựng &amp; mẫu câu khẩu ngữ</strong> (汉字 | pinyin | nghĩa), các <strong>mẫu câu nối ý / diễn đạt</strong> trọng tâm của kỹ năng, một <strong>hội thoại mẫu</strong> (4 lượt) để nói nhại &amp; đóng vai, và <strong>ghi chú lưu loát / cách nói</strong>. Sau đó là quiz ngắn. Luôn theo 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.</p>
<h3>Lộ trình</h3>
<p>Kể chuyện &amp; thuật lại → miêu tả &amp; bình luận → bày tỏ &amp; bảo vệ quan điểm → thảo luận nhóm &amp; đàm phán → thuyết trình có cấu trúc → giao tiếp công việc &amp; phỏng vấn → tranh luận chủ đề xã hội → ôn tập: hùng biện, phản biện &amp; lưu loát.</p>`,
  ]]);

const c1 = doc('chs401-1-1-narrating', 'Chapter 1 — Narrating & retelling coherently|||Chương 1 — Kể chuyện & thuật lại có mạch lạc',
  'Mẫu câu: 事情是这样的, 首先…然后…接着…最后…, 结果; từ 情节/经过/细节/转折; luyện kể lại một sự việc không đứt đoạn.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 1 · Narrating</span>
<h2>Narrating &amp; retelling coherently</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>情节</td><td>qíngjié</td><td>plot, storyline</td></tr>
<tr><td>经过</td><td>jīngguò</td><td>the course of events</td></tr>
<tr><td>事情</td><td>shìqing</td><td>matter, event</td></tr>
<tr><td>描述</td><td>miáoshù</td><td>to describe</td></tr>
<tr><td>细节</td><td>xìjié</td><td>detail</td></tr>
<tr><td>转折</td><td>zhuǎnzhé</td><td>turning point</td></tr>
<tr><td>背景</td><td>bèijǐng</td><td>background</td></tr>
<tr><td>概括</td><td>gàikuò</td><td>to summarize</td></tr>
<tr><td>顺序</td><td>shùnxù</td><td>order, sequence</td></tr>
<tr><td>结果</td><td>jiéguǒ</td><td>as a result, outcome</td></tr>
</table>
<h3>Narrative patterns to say</h3>
<ul>
<li><strong>事情是这样的</strong> shìqing shì zhèyàng de — here's what happened (opens a retelling).</li>
<li><strong>首先…，然后…，接着…，最后…</strong> shǒuxiān…, ránhòu…, jiēzhe…, zuìhòu… — first …, then …, next …, finally … (keeps the sequence straight).</li>
<li><strong>让我从头说起</strong> ràng wǒ cóngtóu shuōqǐ — let me start from the beginning.</li>
<li><strong>结果…</strong> jiéguǒ… — as a result, … (lands the outcome).</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你怎么现在才到？ Nǐ zěnme xiànzài cái dào? (Why are you only arriving now?)
B: 事情是这样的：首先地铁突然停了，然后广播说信号故障，接着我们等了半个小时，最后只能打车过来。 Shìqing shì zhèyàng de: shǒuxiān dìtiě tūrán tíng le, ránhòu guǎngbò shuō xìnhào gùzhàng, jiēzhe wǒmen děngle bàn gè xiǎoshí, zuìhòu zhǐ néng dǎchē guòlái. (Here's what happened: first the subway suddenly stopped, then the announcement said there was a signal fault, next we waited half an hour, and finally we had to take a taxi.)
A: 结果呢？ Jiéguǒ ne? (And the result?)
B: 结果堵车，又晚了二十分钟，真不好意思。 Jiéguǒ dǔchē, yòu wǎn le èrshí fēnzhōng, zhēn bù hǎoyìsi. (As a result there was traffic, and we were another twenty minutes late — I'm really sorry.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> A retelling that only lists actions sounds flat. Chain 首先…然后…接着…最后… into ONE breath group, then close with 结果 for the outcome — that single word turns a list into a story.</div>`,
    `<span class="eyebrow">CHS401 · Chương 1 · Kể chuyện</span>
<h2>Kể chuyện &amp; thuật lại có mạch lạc</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>情节</td><td>qíngjié</td><td>tình tiết, diễn biến</td></tr>
<tr><td>经过</td><td>jīngguò</td><td>quá trình xảy ra</td></tr>
<tr><td>事情</td><td>shìqing</td><td>sự việc</td></tr>
<tr><td>描述</td><td>miáoshù</td><td>miêu tả</td></tr>
<tr><td>细节</td><td>xìjié</td><td>chi tiết</td></tr>
<tr><td>转折</td><td>zhuǎnzhé</td><td>khúc ngoặt, chuyển biến</td></tr>
<tr><td>背景</td><td>bèijǐng</td><td>bối cảnh</td></tr>
<tr><td>概括</td><td>gàikuò</td><td>khái quát, tóm gọn</td></tr>
<tr><td>顺序</td><td>shùnxù</td><td>trình tự</td></tr>
<tr><td>结果</td><td>jiéguǒ</td><td>kết quả</td></tr>
</table>
<h3>Mẫu câu kể chuyện trọng tâm</h3>
<ul>
<li><strong>事情是这样的</strong> shìqing shì zhèyàng de — sự việc là như thế này (mở đầu một lượt thuật lại).</li>
<li><strong>首先…，然后…，接着…，最后…</strong> shǒuxiān…, ránhòu…, jiēzhe…, zuìhòu… — trước tiên …, sau đó …, tiếp theo …, cuối cùng … (giữ trình tự rõ ràng).</li>
<li><strong>让我从头说起</strong> ràng wǒ cóngtóu shuōqǐ — để tôi kể từ đầu.</li>
<li><strong>结果…</strong> jiéguǒ… — kết quả là … (chốt lại phần kết).</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你怎么现在才到？ Nǐ zěnme xiànzài cái dào? (Sao giờ bạn mới tới?)
B: 事情是这样的：首先地铁突然停了，然后广播说信号故障，接着我们等了半个小时，最后只能打车过来。 Shìqing shì zhèyàng de: shǒuxiān dìtiě tūrán tíng le, ránhòu guǎngbò shuō xìnhào gùzhàng, jiēzhe wǒmen děngle bàn gè xiǎoshí, zuìhòu zhǐ néng dǎchē guòlái. (Sự việc là như thế này: trước tiên tàu điện tự nhiên dừng, sau đó phát thanh nói tín hiệu bị lỗi, tiếp theo chúng tôi đợi nửa giờ, cuối cùng chỉ còn cách bắt taxi tới.)
A: 结果呢？ Jiéguǒ ne? (Kết quả sao?)
B: 结果堵车，又晚了二十分钟，真不好意思。 Jiéguǒ dǔchē, yòu wǎn le èrshí fēnzhōng, zhēn bù hǎoyìsi. (Kết quả bị tắc đường, lại trễ thêm hai mươi phút, thật xin lỗi.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> Kể chuyện mà chỉ liệt kê hành động sẽ nghe khô khan. Nối 首先…然后…接着…最后… thành MỘT hơi thở duy nhất, rồi chốt bằng 结果 cho phần kết — chỉ một từ đó biến danh sách thành câu chuyện.</div>`,
  ]]);

const c1q = quiz('chs401-quiz-1', 'Quiz 1 — Narrating & retelling|||Quiz 1 — Kể chuyện & thuật lại', [
  { id: 'q1', question: 'Cụm nào dùng để MỞ ĐẦU một lượt thuật lại sự việc? / Which phrase OPENS a retelling?', options: ['事情是这样的|||Here is what happened', '多少钱？|||How much?', '再见|||Goodbye', '谢谢|||Thank you'], correctIndex: 0, explanation: '事情是这样的 shìqing shì zhèyàng de = sự việc là như thế này — câu mở đầu một lượt kể lại.' },
  { id: 'q2', question: 'Chuỗi liên từ "首先…然后…接着…最后…" dùng để làm gì? / What is 首先…然后…接着…最后… used for?', options: ['Giữ đúng trình tự các bước trong câu chuyện|||Keep the story steps in order', 'Hỏi giá tiền|||Ask a price', 'Từ chối lời mời|||Decline an invitation', 'Xin lỗi|||Apologize'], correctIndex: 0, explanation: '首先 (trước tiên) → 然后 (sau đó) → 接着 (tiếp theo) → 最后 (cuối cùng) nối các bước theo đúng thứ tự thời gian.' },
  { id: 'q3', question: 'Vì sao chỉ liệt kê hành động (không dùng 结果) khiến lời kể nghe khô khan? / Why does listing actions without 结果 sound flat?', options: ['Vì thiếu phần kết quả/hệ quả nối các hành động lại thành câu chuyện|||Because it lacks the outcome that ties the actions into a story', 'Vì nói quá nhanh|||Because it is spoken too fast', 'Vì dùng sai thanh điệu|||Because the tones are wrong', 'Vì thiếu chủ ngữ|||Because the subject is missing'], correctIndex: 0, explanation: '结果 jiéguǒ chốt lại hệ quả — thiếu nó, chuỗi hành động chỉ là một danh sách rời rạc.' },
]);

const c2 = doc('chs401-2-1-describing-commenting', 'Chapter 2 — Describing & commenting on phenomena|||Chương 2 — Miêu tả & bình luận sự vật, hiện tượng',
  'Mẫu câu: 给我的印象是, 不可否认, 总的来说; từ 现象/普遍/引起争议/利大于弊; luyện bình luận một hiện tượng xã hội.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 2 · Describing</span>
<h2>Describing &amp; commenting on phenomena</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>现象</td><td>xiànxiàng</td><td>phenomenon</td></tr>
<tr><td>特点</td><td>tèdiǎn</td><td>characteristic</td></tr>
<tr><td>普遍</td><td>pǔbiàn</td><td>common, widespread</td></tr>
<tr><td>反映</td><td>fǎnyìng</td><td>to reflect</td></tr>
<tr><td>利大于弊</td><td>lì dàyú bì</td><td>advantages outweigh disadvantages</td></tr>
<tr><td>消极</td><td>xiāojí</td><td>negative</td></tr>
<tr><td>积极</td><td>jījí</td><td>positive</td></tr>
<tr><td>引起</td><td>yǐnqǐ</td><td>to cause, trigger</td></tr>
<tr><td>争议</td><td>zhēngyì</td><td>controversy</td></tr>
<tr><td>普遍现象</td><td>pǔbiàn xiànxiàng</td><td>widespread phenomenon</td></tr>
</table>
<h3>Comment patterns to say</h3>
<ul>
<li><strong>给我的印象是…</strong> gěi wǒ de yìnxiàng shì… — the impression it gives me is …</li>
<li><strong>不可否认…</strong> bùkě fǒurèn… — it cannot be denied that …</li>
<li><strong>总的来说…</strong> zǒng de láishuō… — overall, … (wraps up a comment).</li>
<li><strong>这种现象反映了…</strong> zhè zhǒng xiànxiàng fǎnyìng le… — this phenomenon reflects …</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你怎么看现在"加班文化"这种现象？ Nǐ zěnme kàn xiànzài "jiābān wénhuà" zhè zhǒng xiànxiàng? (What do you think of the "overtime culture" phenomenon nowadays?)
B: 给我的印象是，这种现象越来越普遍，也引起了不少争议。 Gěi wǒ de yìnxiàng shì, zhè zhǒng xiànxiàng yuè lái yuè pǔbiàn, yě yǐnqǐ le bùshǎo zhēngyì. (My impression is that this phenomenon is becoming more and more common, and it has also caused quite a bit of controversy.)
A: 那你觉得利大于弊吗？ Nà nǐ juéde lì dàyú bì ma? (So do you think the advantages outweigh the disadvantages?)
B: 不可否认，加班能提高效率，但总的来说，它对健康的消极影响更大。 Bùkě fǒurèn, jiābān néng tígāo xiàolǜ, dàn zǒng de láishuō, tā duì jiànkāng de xiāojí yǐngxiǎng gèng dà. (It cannot be denied that overtime can increase efficiency, but overall, its negative impact on health is greater.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> 不可否认 A，但总的来说 B is the shape of a balanced comment: concede A, then land your real point B — say 但 with a slight rise to signal the pivot is coming.</div>`,
    `<span class="eyebrow">CHS401 · Chương 2 · Miêu tả</span>
<h2>Miêu tả &amp; bình luận sự vật, hiện tượng</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>现象</td><td>xiànxiàng</td><td>hiện tượng</td></tr>
<tr><td>特点</td><td>tèdiǎn</td><td>đặc điểm</td></tr>
<tr><td>普遍</td><td>pǔbiàn</td><td>phổ biến</td></tr>
<tr><td>反映</td><td>fǎnyìng</td><td>phản ánh</td></tr>
<tr><td>利大于弊</td><td>lì dàyú bì</td><td>lợi nhiều hơn hại</td></tr>
<tr><td>消极</td><td>xiāojí</td><td>tiêu cực</td></tr>
<tr><td>积极</td><td>jījí</td><td>tích cực</td></tr>
<tr><td>引起</td><td>yǐnqǐ</td><td>gây ra</td></tr>
<tr><td>争议</td><td>zhēngyì</td><td>tranh cãi, tranh nghị</td></tr>
<tr><td>普遍现象</td><td>pǔbiàn xiànxiàng</td><td>hiện tượng phổ biến</td></tr>
</table>
<h3>Mẫu câu bình luận trọng tâm</h3>
<ul>
<li><strong>给我的印象是…</strong> gěi wǒ de yìnxiàng shì… — ấn tượng của tôi là …</li>
<li><strong>不可否认…</strong> bùkě fǒurèn… — không thể phủ nhận là …</li>
<li><strong>总的来说…</strong> zǒng de láishuō… — nhìn chung, … (chốt lại một bình luận).</li>
<li><strong>这种现象反映了…</strong> zhè zhǒng xiànxiàng fǎnyìng le… — hiện tượng này phản ánh …</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你怎么看现在"加班文化"这种现象？ Nǐ zěnme kàn xiànzài "jiābān wénhuà" zhè zhǒng xiànxiàng? (Bạn nghĩ sao về hiện tượng "văn hoá làm thêm giờ" hiện nay?)
B: 给我的印象是，这种现象越来越普遍，也引起了不少争议。 Gěi wǒ de yìnxiàng shì, zhè zhǒng xiànxiàng yuè lái yuè pǔbiàn, yě yǐnqǐ le bùshǎo zhēngyì. (Ấn tượng của tôi là hiện tượng này ngày càng phổ biến, và cũng gây ra không ít tranh cãi.)
A: 那你觉得利大于弊吗？ Nà nǐ juéde lì dàyú bì ma? (Vậy bạn nghĩ lợi có nhiều hơn hại không?)
B: 不可否认，加班能提高效率，但总的来说，它对健康的消极影响更大。 Bùkě fǒurèn, jiābān néng tígāo xiàolǜ, dàn zǒng de láishuō, tā duì jiànkāng de xiāojí yǐngxiǎng gèng dà. (Không thể phủ nhận làm thêm giờ giúp tăng hiệu suất, nhưng nhìn chung, nó gây ảnh hưởng tiêu cực lớn hơn tới sức khoẻ.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> 不可否认 A，但总的来说 B là khuôn của một bình luận cân bằng: nhượng bộ A rồi chốt ý thật của mình là B — nói 但 hơi lên giọng để báo hiệu cú xoay chuyển sắp tới.</div>`,
  ]]);

const c2q = quiz('chs401-quiz-2', 'Quiz 2 — Describing & commenting|||Quiz 2 — Miêu tả & bình luận', [
  { id: 'q1', question: '"不可否认…，但总的来说…" là khuôn câu để làm gì? / What is the 不可否认…，但总的来说… frame for?', options: ['Nhượng bộ một ý rồi chốt ý thật của mình — bình luận cân bằng|||Concede a point, then land your real point — a balanced comment', 'Hỏi đường|||Ask for directions', 'Từ chối một lời mời|||Decline an invitation', 'Giới thiệu bản thân|||Introduce yourself'], correctIndex: 0, explanation: '不可否认 A nhượng bộ, 但总的来说 B chốt quan điểm thật — cấu trúc bình luận cân bằng.' },
  { id: 'q2', question: '"利大于弊" (lì dàyú bì) nghĩa là gì? / What does 利大于弊 mean?', options: ['Lợi nhiều hơn hại|||Advantages outweigh disadvantages', 'Hại nhiều hơn lợi|||Disadvantages outweigh advantages', 'Không có lợi cũng không có hại|||Neither good nor bad', 'Chỉ có hại|||Only harmful'], correctIndex: 0, explanation: '利 (lợi) 大于 (lớn hơn) 弊 (hại) = lợi nhiều hơn hại.' },
  { id: 'q3', question: 'Cụm nào dùng để MỞ ĐẦU một nhận xét cá nhân về hiện tượng? / Which phrase OPENS a personal comment on a phenomenon?', options: ['给我的印象是…|||The impression it gives me is …', '多少钱？|||How much?', '再见|||Goodbye', '不客气|||You are welcome'], correctIndex: 0, explanation: '给我的印象是 gěi wǒ de yìnxiàng shì = ấn tượng của tôi là — mở đầu một nhận xét.' },
]);

const c3 = doc('chs401-3-1-opinion-defend', 'Chapter 3 — Expressing & defending personal opinions|||Chương 3 — Bày tỏ & bảo vệ quan điểm cá nhân',
  'Mẫu câu: 就我而言, 我坚持认为, 换个角度说, 不得不承认; từ 立场/说服力/理由/让步; luyện bảo vệ quan điểm khi bị phản đối.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 3 · Defending opinions</span>
<h2>Expressing &amp; defending personal opinions</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>立场</td><td>lìchǎng</td><td>stance, position</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>to insist, persist</td></tr>
<tr><td>说服力</td><td>shuōfúlì</td><td>persuasiveness</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>to oppose</td></tr>
<tr><td>支持</td><td>zhīchí</td><td>to support</td></tr>
<tr><td>理由</td><td>lǐyóu</td><td>reason</td></tr>
<tr><td>证据</td><td>zhèngjù</td><td>evidence</td></tr>
<tr><td>让步</td><td>ràngbù</td><td>to concede, give way</td></tr>
<tr><td>矛盾</td><td>máodùn</td><td>contradiction</td></tr>
<tr><td>坚定</td><td>jiāndìng</td><td>firm, resolute</td></tr>
</table>
<h3>Opinion &amp; defense patterns to say</h3>
<ul>
<li><strong>就我而言…</strong> jiù wǒ ér yán… — as for me, …</li>
<li><strong>我坚持认为…</strong> wǒ jiānchí rènwéi… — I firmly believe …</li>
<li><strong>虽然…，但是…</strong> suīrán…, dànshì… — although …, but … (concede, then hold your line).</li>
<li><strong>换个角度说…</strong> huàn gè jiǎodù shuō… — looking at it another way, …</li>
<li><strong>不得不承认…</strong> bùdébù chéngrèn… — I have to admit …</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你支持网课还是线下上课？ Nǐ zhīchí wǎngkè háishi xiànxià shàngkè? (Do you support online classes or offline classes?)
B: 就我而言，我坚持认为线下上课效果更好。 Jiù wǒ ér yán, wǒ jiānchí rènwéi xiànxià shàngkè xiàoguǒ gèng hǎo. (As for me, I firmly believe offline classes work better.)
A: 可是网课更方便，虽然你说的有道理，但是很多人没有时间去学校。 Kěshì wǎngkè gèng fāngbiàn, suīrán nǐ shuō de yǒu dàolǐ, dànshì hěnduō rén méiyǒu shíjiān qù xuéxiào. (But online classes are more convenient; although what you say makes sense, many people don't have time to go to school.)
B: 换个角度说，不得不承认网课确实节省时间，但面对面交流的说服力是网课比不了的。 Huàn gè jiǎodù shuō, bùdébù chéngrèn wǎngkè quèshí jiéshěng shíjiān, dàn miànduìmiàn jiāoliú de shuōfúlì shì wǎngkè bǐ bùliǎo de. (Looking at it another way, I have to admit online classes really do save time, but the persuasiveness of face-to-face communication is something online classes can't match.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> Defending an opinion is not repeating it louder. Use 不得不承认 to concede one real point, then close with 但 + your strongest reason — conceding first makes the final point land harder, not softer.</div>`,
    `<span class="eyebrow">CHS401 · Chương 3 · Bảo vệ quan điểm</span>
<h2>Bày tỏ &amp; bảo vệ quan điểm cá nhân</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>立场</td><td>lìchǎng</td><td>lập trường</td></tr>
<tr><td>坚持</td><td>jiānchí</td><td>kiên trì, giữ vững</td></tr>
<tr><td>说服力</td><td>shuōfúlì</td><td>sức thuyết phục</td></tr>
<tr><td>反对</td><td>fǎnduì</td><td>phản đối</td></tr>
<tr><td>支持</td><td>zhīchí</td><td>ủng hộ</td></tr>
<tr><td>理由</td><td>lǐyóu</td><td>lý do</td></tr>
<tr><td>证据</td><td>zhèngjù</td><td>bằng chứng</td></tr>
<tr><td>让步</td><td>ràngbù</td><td>nhượng bộ</td></tr>
<tr><td>矛盾</td><td>máodùn</td><td>mâu thuẫn</td></tr>
<tr><td>坚定</td><td>jiāndìng</td><td>kiên định</td></tr>
</table>
<h3>Mẫu câu nêu &amp; bảo vệ quan điểm trọng tâm</h3>
<ul>
<li><strong>就我而言…</strong> jiù wǒ ér yán… — đối với tôi, …</li>
<li><strong>我坚持认为…</strong> wǒ jiānchí rènwéi… — tôi kiên định cho rằng …</li>
<li><strong>虽然…，但是…</strong> suīrán…, dànshì… — mặc dù …, nhưng … (nhượng bộ rồi vẫn giữ vững).</li>
<li><strong>换个角度说…</strong> huàn gè jiǎodù shuō… — nói theo góc nhìn khác, …</li>
<li><strong>不得不承认…</strong> bùdébù chéngrèn… — không thể không thừa nhận …</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你支持网课还是线下上课？ Nǐ zhīchí wǎngkè háishi xiànxià shàngkè? (Bạn ủng hộ học online hay học trực tiếp?)
B: 就我而言，我坚持认为线下上课效果更好。 Jiù wǒ ér yán, wǒ jiānchí rènwéi xiànxià shàngkè xiàoguǒ gèng hǎo. (Đối với tôi, tôi kiên định cho rằng học trực tiếp hiệu quả hơn.)
A: 可是网课更方便，虽然你说的有道理，但是很多人没有时间去学校。 Kěshì wǎngkè gèng fāngbiàn, suīrán nǐ shuō de yǒu dàolǐ, dànshì hěnduō rén méiyǒu shíjiān qù xuéxiào. (Nhưng học online tiện hơn; mặc dù bạn nói có lý, nhưng nhiều người không có thời gian tới trường.)
B: 换个角度说，不得不承认网课确实节省时间，但面对面交流的说服力是网课比不了的。 Huàn gè jiǎodù shuō, bùdébù chéngrèn wǎngkè quèshí jiéshěng shíjiān, dàn miànduìmiàn jiāoliú de shuōfúlì shì wǎngkè bǐ bùliǎo de. (Nói theo góc nhìn khác, không thể không thừa nhận học online đúng là tiết kiệm thời gian, nhưng sức thuyết phục của giao tiếp trực tiếp là điều học online không sánh được.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> Bảo vệ quan điểm không phải là lặp lại to hơn. Dùng 不得不承认 để nhượng bộ một điểm thật, rồi chốt bằng 但 + lý do mạnh nhất — nhượng bộ trước khiến ý cuối càng có lực, không phải yếu đi.</div>`,
  ]]);

const c3q = quiz('chs401-quiz-3', 'Quiz 3 — Expressing & defending opinions|||Quiz 3 — Bày tỏ & bảo vệ quan điểm', [
  { id: 'q1', question: 'Vì sao nên dùng 不得不承认 TRƯỚC KHI chốt ý bảo vệ bằng 但…? / Why concede with 不得不承认 BEFORE landing your point with 但…?', options: ['Vì nhượng bộ trước khiến ý chốt sau có lực hơn, nghe khách quan hơn|||Conceding first makes the final point land harder and sound more objective', 'Vì phải nói đủ số câu quy định|||Because a fixed sentence count is required', 'Vì tránh phải dùng 但|||To avoid using 但 at all', 'Vì đó là cách chào hỏi|||Because it is a greeting'], correctIndex: 0, explanation: 'Nhượng bộ một điểm thật (不得不承认) trước rồi chốt lý do mạnh nhất bằng 但 khiến lập luận thuyết phục hơn.' },
  { id: 'q2', question: '"就我而言" (jiù wǒ ér yán) dùng để làm gì? / What is 就我而言 used for?', options: ['Mở đầu quan điểm cá nhân — đối với tôi|||Open a personal opinion — as for me', 'Hỏi giờ|||Ask the time', 'Cảm ơn|||Say thank you', 'Xin lỗi|||Apologize'], correctIndex: 0, explanation: '就我而言 = đối với tôi / as for me — mở đầu một quan điểm cá nhân.' },
  { id: 'q3', question: 'Cấu trúc "虽然…，但是…" trong đoạn hội thoại dùng để làm gì? / What does 虽然…，但是… do in the dialogue?', options: ['Thừa nhận lý do của người khác rồi vẫn giữ lập trường riêng|||Acknowledge the other side\'s reason while still holding one\'s own stance', 'Kết thúc cuộc nói chuyện|||End the conversation', 'Đề nghị giúp đỡ|||Offer help', 'Giới thiệu tên|||Introduce a name'], correctIndex: 0, explanation: '虽然 A 但是 B công nhận A của đối phương rồi vẫn giữ quan điểm B của mình.' },
]);

const c4 = doc('chs401-4-1-negotiation', 'Chapter 4 — Group discussion & negotiation|||Chương 4 — Thảo luận nhóm & đàm phán',
  'Mẫu câu: 我同意你的看法,不过, 我们不妨, 折中一下, 各退一步; từ 协商/妥协/达成共识/分歧; luyện đàm phán để đạt thoả thuận.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 4 · Negotiation</span>
<h2>Group discussion &amp; negotiation</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>协商</td><td>xiéshāng</td><td>to negotiate</td></tr>
<tr><td>妥协</td><td>tuǒxié</td><td>to compromise</td></tr>
<tr><td>达成共识</td><td>dáchéng gòngshí</td><td>to reach consensus</td></tr>
<tr><td>折中</td><td>zhézhōng</td><td>to find a middle ground</td></tr>
<tr><td>方案</td><td>fāng'àn</td><td>plan, proposal</td></tr>
<tr><td>分歧</td><td>fēnqí</td><td>disagreement</td></tr>
<tr><td>退让</td><td>tuìràng</td><td>to yield</td></tr>
<tr><td>提议</td><td>tíyì</td><td>to propose, proposal</td></tr>
<tr><td>考虑</td><td>kǎolǜ</td><td>to consider</td></tr>
<tr><td>各退一步</td><td>gè tuì yī bù</td><td>each side gives a little</td></tr>
</table>
<h3>Negotiation patterns to say</h3>
<ul>
<li><strong>我同意你的看法，不过…</strong> wǒ tóngyì nǐ de kànfǎ, bùguò… — I agree with you, but …</li>
<li><strong>我们不妨…</strong> wǒmen bùfáng… — we might as well …</li>
<li><strong>折中一下…</strong> zhézhōng yīxià… — let's find a middle ground …</li>
<li><strong>各退一步，达成共识</strong> gè tuì yī bù, dáchéng gòngshí — each side gives a little, and we reach agreement.</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A: 关于小组报告的地点，你有什么方案？ Guānyú xiǎozǔ bàogào de dìdiǎn, nǐ yǒu shénme fāng'àn? (Regarding the location for the group presentation, what's your proposal?)
B: 我提议在图书馆讨论室，那里比较安静。 Wǒ tíyì zài túshūguǎn tǎolùnshì, nàlǐ bǐjiào ānjìng. (I propose the library discussion room, it's quieter there.)
A: 我同意你的看法，不过图书馆晚上关门早。我们不妨改到咖啡馆。 Wǒ tóngyì nǐ de kànfǎ, bùguò túshūguǎn wǎnshàng guānmén zǎo. Wǒmen bùfáng gǎi dào kāfēiguǎn. (I agree with you, but the library closes early at night. We might as well change to a café.)
B: 好，那就折中一下，先在图书馆讨论，晚上再去咖啡馆继续。各退一步，达成共识。 Hǎo, nà jiù zhézhōng yīxià, xiān zài túshūguǎn tǎolùn, wǎnshàng zài qù kāfēiguǎn jìxù. Gè tuì yī bù, dáchéng gòngshí. (Okay, let's compromise then — discuss in the library first, then continue at the café in the evening. Each side gives a little, and we reach an agreement.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> 我同意你的看法，不过… agrees before disagreeing — never open a negotiation with a flat 不. Close a deal with 各退一步，达成共识, a fixed phrase that signals the negotiation is DONE.</div>`,
    `<span class="eyebrow">CHS401 · Chương 4 · Đàm phán</span>
<h2>Thảo luận nhóm &amp; đàm phán</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>协商</td><td>xiéshāng</td><td>hiệp thương, thương lượng</td></tr>
<tr><td>妥协</td><td>tuǒxié</td><td>thoả hiệp</td></tr>
<tr><td>达成共识</td><td>dáchéng gòngshí</td><td>đạt được đồng thuận</td></tr>
<tr><td>折中</td><td>zhézhōng</td><td>chọn phương án trung gian</td></tr>
<tr><td>方案</td><td>fāng'àn</td><td>phương án, kế hoạch</td></tr>
<tr><td>分歧</td><td>fēnqí</td><td>bất đồng</td></tr>
<tr><td>退让</td><td>tuìràng</td><td>nhượng bộ, lùi bước</td></tr>
<tr><td>提议</td><td>tíyì</td><td>đề xuất</td></tr>
<tr><td>考虑</td><td>kǎolǜ</td><td>xem xét, cân nhắc</td></tr>
<tr><td>各退一步</td><td>gè tuì yī bù</td><td>mỗi bên lùi một bước</td></tr>
</table>
<h3>Mẫu câu đàm phán trọng tâm</h3>
<ul>
<li><strong>我同意你的看法，不过…</strong> wǒ tóngyì nǐ de kànfǎ, bùguò… — tôi đồng ý với bạn, nhưng …</li>
<li><strong>我们不妨…</strong> wǒmen bùfáng… — chúng ta không ngại …</li>
<li><strong>折中一下…</strong> zhézhōng yīxià… — thoả hiệp một chút …</li>
<li><strong>各退一步，达成共识</strong> gè tuì yī bù, dáchéng gòngshí — mỗi bên lùi một bước, đạt được đồng thuận.</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A: 关于小组报告的地点，你有什么方案？ Guānyú xiǎozǔ bàogào de dìdiǎn, nǐ yǒu shénme fāng'àn? (Về địa điểm làm báo cáo nhóm, bạn có phương án gì?)
B: 我提议在图书馆讨论室，那里比较安静。 Wǒ tíyì zài túshūguǎn tǎolùnshì, nàlǐ bǐjiào ānjìng. (Tôi đề xuất phòng thảo luận thư viện, ở đó khá yên tĩnh.)
A: 我同意你的看法，不过图书馆晚上关门早。我们不妨改到咖啡馆。 Wǒ tóngyì nǐ de kànfǎ, bùguò túshūguǎn wǎnshàng guānmén zǎo. Wǒmen bùfáng gǎi dào kāfēiguǎn. (Tôi đồng ý với bạn, nhưng thư viện đóng cửa sớm vào buổi tối. Chúng ta không ngại đổi sang quán cà phê.)
B: 好，那就折中一下，先在图书馆讨论，晚上再去咖啡馆继续。各退一步，达成共识。 Hǎo, nà jiù zhézhōng yīxià, xiān zài túshūguǎn tǎolùn, wǎnshàng zài qù kāfēiguǎn jìxù. Gè tuì yī bù, dáchéng gòngshí. (Được, vậy thoả hiệp một chút, thảo luận ở thư viện trước, tối lại ra quán cà phê tiếp tục. Mỗi bên lùi một bước, đạt được đồng thuận.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> 我同意你的看法，不过… đồng ý trước rồi mới bất đồng — đừng bao giờ mở đầu đàm phán bằng một chữ 不 khô khan. Chốt thoả thuận bằng 各退一步，达成共识, một cụm cố định báo hiệu cuộc đàm phán đã XONG.</div>`,
  ]]);

const c4q = quiz('chs401-quiz-4', 'Quiz 4 — Group discussion & negotiation|||Quiz 4 — Thảo luận nhóm & đàm phán', [
  { id: 'q1', question: 'Vì sao KHÔNG nên mở đầu một cuộc đàm phán bằng một chữ 不 khô khan? / Why NOT open a negotiation with a flat 不?', options: ['Vì nó bác bỏ ngay, làm mất cơ hội thương lượng; nên đồng ý trước bằng 我同意你的看法,不过…|||It rejects outright and kills room to negotiate; agree first with 我同意你的看法, 不过…', 'Vì 不 khó phát âm|||Because 不 is hard to pronounce', 'Vì 不 chỉ dùng trong văn viết|||Because 不 is written-only', 'Vì phải nói tiếng Anh trước|||Because English must come first'], correctIndex: 0, explanation: 'Mở đầu bằng đồng ý một phần (我同意你的看法，不过…) giữ được không khí hợp tác trước khi nêu bất đồng.' },
  { id: 'q2', question: '"各退一步，达成共识" báo hiệu điều gì trong một cuộc đàm phán? / What does 各退一步，达成共识 signal in a negotiation?', options: ['Cuộc đàm phán đã kết thúc bằng một thoả thuận|||The negotiation has ended in an agreement', 'Cuộc đàm phán vừa mới bắt đầu|||The negotiation has just started', 'Hai bên không đồng ý gì cả|||Both sides agree on nothing', 'Một bên bỏ cuộc|||One side gave up'], correctIndex: 0, explanation: '各退一步 (mỗi bên lùi một bước) 达成共识 (đạt đồng thuận) là cụm cố định báo hiệu thoả thuận đã đạt được.' },
  { id: 'q3', question: '"折中一下" (zhézhōng yīxià) nghĩa là gì? / What does 折中一下 mean?', options: ['Thoả hiệp/chọn phương án trung gian một chút|||Compromise / find a middle ground a bit', 'Từ chối hoàn toàn|||Reject completely', 'Đồng ý hoàn toàn|||Fully agree', 'Im lặng không nói|||Stay silent'], correctIndex: 0, explanation: '折中 zhézhōng = chọn phương án ở giữa, một dạng thoả hiệp.' },
]);

const c5 = doc('chs401-5-1-presentation', 'Chapter 5 — Structured presentation to an audience|||Chương 5 — Thuyết trình có cấu trúc trước đám đông',
  'Mẫu câu: 今天我想跟大家谈谈, 接下来, 大家有没有想过, 谢谢大家的聆听; từ 演讲稿/开场白/过渡/听众; luyện dựng &amp; nói một bài thuyết trình 4 phần.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 5 · Presentation</span>
<h2>Structured presentation to an audience</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>演讲稿</td><td>yǎnjiǎnggǎo</td><td>speech script</td></tr>
<tr><td>开场白</td><td>kāichǎngbái</td><td>opening remarks</td></tr>
<tr><td>过渡</td><td>guòdù</td><td>transition</td></tr>
<tr><td>互动</td><td>hùdòng</td><td>interaction</td></tr>
<tr><td>听众</td><td>tīngzhòng</td><td>audience</td></tr>
<tr><td>强调</td><td>qiángdiào</td><td>to emphasize</td></tr>
<tr><td>呼吁</td><td>hūyù</td><td>to appeal, call for</td></tr>
<tr><td>结束语</td><td>jiéshùyǔ</td><td>closing remarks</td></tr>
<tr><td>提纲</td><td>tígāng</td><td>outline</td></tr>
<tr><td>逻辑清晰</td><td>luójí qīngxī</td><td>logically clear</td></tr>
</table>
<h3>Presentation patterns to say</h3>
<ul>
<li><strong>大家好，今天我想跟大家谈谈…</strong> dàjiā hǎo, jīntiān wǒ xiǎng gēn dàjiā tántán… — hello everyone, today I want to talk to you about … (opening).</li>
<li><strong>接下来…</strong> jiēxiàlái… — next, … (moves to a new part).</li>
<li><strong>大家有没有想过…？</strong> dàjiā yǒu méiyǒu xiǎngguò…? — has everyone ever thought about …? (engages the audience).</li>
<li><strong>谢谢大家的聆听</strong> xièxie dàjiā de língtīng — thank you all for listening (closing).</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A: 你的演讲怎么开头？ Nǐ de yǎnjiǎng zěnme kāitóu? (How does your speech open?)
B: 大家好，今天我想跟大家谈谈"终身学习"这个话题。 Dàjiā hǎo, jīntiān wǒ xiǎng gēn dàjiā tántán "zhōngshēn xuéxí" zhège huàtí. (Hello everyone, today I want to talk to you about the topic of "lifelong learning".)
A: 中间怎么过渡到下一部分？ Zhōngjiān zěnme guòdù dào xià yī bùfèn? (How do you transition to the next part in the middle?)
B: 接下来，大家有没有想过，为什么有些人退休以后还坚持学习新技能？最后我会总结一下，谢谢大家的聆听。 Jiēxiàlái, dàjiā yǒu méiyǒu xiǎngguò, wèishénme yǒuxiē rén tuìxiū yǐhòu hái jiānchí xuéxí xīn jìnéng? Zuìhòu wǒ huì zǒngjié yīxià, xièxie dàjiā de língtīng. (Next, has everyone ever thought about why some people keep learning new skills even after retirement? At the end I'll summarize, thank you all for listening.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> A short speech has four parts: 开场白 (opening) → body → 互动 question (大家有没有想过…?) → 结束语 (closing, 谢谢大家的聆听). The question mid-speech is not filler — it keeps the 听众 with you.</div>`,
    `<span class="eyebrow">CHS401 · Chương 5 · Thuyết trình</span>
<h2>Thuyết trình có cấu trúc trước đám đông</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>演讲稿</td><td>yǎnjiǎnggǎo</td><td>bản thảo bài thuyết trình</td></tr>
<tr><td>开场白</td><td>kāichǎngbái</td><td>lời mở đầu</td></tr>
<tr><td>过渡</td><td>guòdù</td><td>chuyển ý</td></tr>
<tr><td>互动</td><td>hùdòng</td><td>tương tác</td></tr>
<tr><td>听众</td><td>tīngzhòng</td><td>người nghe, khán giả</td></tr>
<tr><td>强调</td><td>qiángdiào</td><td>nhấn mạnh</td></tr>
<tr><td>呼吁</td><td>hūyù</td><td>kêu gọi</td></tr>
<tr><td>结束语</td><td>jiéshùyǔ</td><td>lời kết</td></tr>
<tr><td>提纲</td><td>tígāng</td><td>dàn ý, đề cương</td></tr>
<tr><td>逻辑清晰</td><td>luójí qīngxī</td><td>logic rõ ràng</td></tr>
</table>
<h3>Mẫu câu thuyết trình trọng tâm</h3>
<ul>
<li><strong>大家好，今天我想跟大家谈谈…</strong> dàjiā hǎo, jīntiān wǒ xiǎng gēn dàjiā tántán… — xin chào mọi người, hôm nay tôi muốn nói với mọi người về … (mở đầu).</li>
<li><strong>接下来…</strong> jiēxiàlái… — tiếp theo, … (chuyển sang phần mới).</li>
<li><strong>大家有没有想过…？</strong> dàjiā yǒu méiyǒu xiǎngguò…? — mọi người đã bao giờ nghĩ …? (tương tác với khán giả).</li>
<li><strong>谢谢大家的聆听</strong> xièxie dàjiā de língtīng — cảm ơn mọi người đã lắng nghe (kết bài).</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A: 你的演讲怎么开头？ Nǐ de yǎnjiǎng zěnme kāitóu? (Bài thuyết trình của bạn mở đầu thế nào?)
B: 大家好，今天我想跟大家谈谈"终身学习"这个话题。 Dàjiā hǎo, jīntiān wǒ xiǎng gēn dàjiā tántán "zhōngshēn xuéxí" zhège huàtí. (Xin chào mọi người, hôm nay tôi muốn nói với mọi người về chủ đề "học tập suốt đời".)
A: 中间怎么过渡到下一部分？ Zhōngjiān zěnme guòdù dào xià yī bùfèn? (Ở giữa bạn chuyển ý sang phần sau thế nào?)
B: 接下来，大家有没有想过，为什么有些人退休以后还坚持学习新技能？最后我会总结一下，谢谢大家的聆听。 Jiēxiàlái, dàjiā yǒu méiyǒu xiǎngguò, wèishénme yǒuxiē rén tuìxiū yǐhòu hái jiānchí xuéxí xīn jìnéng? Zuìhòu wǒ huì zǒngjié yīxià, xièxie dàjiā de língtīng. (Tiếp theo, mọi người đã bao giờ nghĩ, vì sao có người sau khi hưu vẫn kiên trì học kỹ năng mới? Cuối cùng tôi sẽ tổng kết lại, cảm ơn mọi người đã lắng nghe.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> Một bài thuyết trình ngắn có bốn phần: 开场白 (mở đầu) → phần thân → câu hỏi 互动 (大家有没有想过…?) → 结束语 (kết, 谢谢大家的聆听). Câu hỏi giữa bài không phải để câu giờ — nó giữ 听众 ở lại cùng bạn.</div>`,
  ]]);

const c5q = quiz('chs401-quiz-5', 'Quiz 5 — Structured presentation|||Quiz 5 — Thuyết trình có cấu trúc', [
  { id: 'q1', question: 'Bốn phần của một bài thuyết trình theo đúng thứ tự là gì? / What are the four parts of a presentation, in order?', options: ['开场白 → phần thân → câu hỏi tương tác → 结束语|||Opening → body → interactive question → closing', '结束语 → 开场白 → phần thân → câu hỏi tương tác|||Closing → opening → body → interactive question', 'Câu hỏi tương tác → 结束语 → 开场白 → phần thân|||Interactive question → closing → opening → body', 'Phần thân → 结束语 → 开场白 → câu hỏi tương tác|||Body → closing → opening → interactive question'], correctIndex: 0, explanation: 'Mở đầu (开场白) → phần thân → câu hỏi tương tác (大家有没有想过…?) → kết (结束语).' },
  { id: 'q2', question: 'Vì sao nên chèn một câu hỏi kiểu 大家有没有想过…? giữa bài thuyết trình? / Why insert a question like 大家有没有想过…? mid-speech?', options: ['Để giữ khán giả tương tác, không phải để câu giờ|||To keep the audience engaged, not to stall for time', 'Để kết thúc bài nói sớm hơn|||To end the talk earlier', 'Vì quy định bắt buộc phải hỏi|||Because a rule requires a question', 'Để đổi chủ đề hoàn toàn|||To change topic entirely'], correctIndex: 0, explanation: 'Câu hỏi tương tác (互动) giữa bài giữ 听众 chú ý và tham gia cùng người nói.' },
  { id: 'q3', question: 'Cụm nào dùng để MỞ ĐẦU một bài thuyết trình? / Which phrase OPENS a presentation?', options: ['大家好，今天我想跟大家谈谈…|||Hello everyone, today I want to talk to you about …', '谢谢大家的聆听|||Thank you all for listening', '再见|||Goodbye', '多少钱？|||How much?'], correctIndex: 0, explanation: '大家好，今天我想跟大家谈谈… là câu mở đầu quen thuộc của một bài thuyết trình.' },
]);

const c6 = doc('chs401-6-1-professional', 'Chapter 6 — Professional & interview communication|||Chương 6 — Giao tiếp công việc & phỏng vấn chuyên nghiệp',
  'Mẫu câu: 请问, 能否请您, 我的优势在于, 我期待, 敬请指教; từ 简历/胜任/面试官/汇报; luyện trả lời phỏng vấn xin việc.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 6 · Professional</span>
<h2>Professional &amp; interview communication</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>CV, resume</td></tr>
<tr><td>优势</td><td>yōushì</td><td>strength, advantage</td></tr>
<tr><td>劣势</td><td>lièshì</td><td>weakness</td></tr>
<tr><td>胜任</td><td>shèngrèn</td><td>to be competent for</td></tr>
<tr><td>录用</td><td>lùyòng</td><td>to hire</td></tr>
<tr><td>面试官</td><td>miànshìguān</td><td>interviewer</td></tr>
<tr><td>职责</td><td>zhízé</td><td>responsibility, duty</td></tr>
<tr><td>薪资</td><td>xīnzī</td><td>salary</td></tr>
<tr><td>合作</td><td>hézuò</td><td>cooperation</td></tr>
<tr><td>汇报</td><td>huìbào</td><td>to report (work)</td></tr>
</table>
<h3>Professional patterns to say</h3>
<ul>
<li><strong>请问…</strong> qǐngwèn… — may I ask …</li>
<li><strong>能否请您…？</strong> néng fǒu qǐng nín…? — could I ask you to …?</li>
<li><strong>我的优势在于…</strong> wǒ de yōushì zàiyú… — my strength lies in …</li>
<li><strong>我期待…</strong> wǒ qídài… — I look forward to …</li>
<li><strong>敬请指教</strong> jìngqǐng zhǐjiào — I welcome your guidance (a polite formal close).</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A: 请问，你为什么想应聘这个职位？ Qǐngwèn, nǐ wèishénme xiǎng yìngpìn zhège zhíwèi? (May I ask, why do you want to apply for this position?)
B: 我的优势在于三年的相关经验，而且我很擅长跟团队合作。 Wǒ de yōushì zàiyú sān nián de xiāngguān jīngyàn, érqiě wǒ hěn shàncháng gēn tuánduì hézuò. (My strength lies in three years of relevant experience, and I'm also good at working with a team.)
A: 能否请您举个例子？ Néng fǒu qǐng nín jǔ gè lìzi? (Could you give an example?)
B: 当然。在上一家公司，我负责每周向经理汇报项目进度，从没延误过。我期待能把这份经验带到新的职责中。 Dāngrán. Zài shàng yī jiā gōngsī, wǒ fùzé měi zhōu xiàng jīnglǐ huìbào xiàngmù jìndù, cóng méi yánwù guò. Wǒ qídài néng bǎ zhè fèn jīngyàn dài dào xīn de zhízé zhōng. (Of course. At my previous company, I was responsible for reporting project progress to the manager every week, and never missed a deadline. I look forward to bringing this experience to new responsibilities.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> 我的优势在于… must be followed by a CONCRETE example, not just an adjective — that's why the dialogue moves straight to 举个例子. Vague strengths do not persuade a 面试官.</div>`,
    `<span class="eyebrow">CHS401 · Chương 6 · Công việc</span>
<h2>Giao tiếp công việc &amp; phỏng vấn chuyên nghiệp</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>简历</td><td>jiǎnlì</td><td>hồ sơ, CV</td></tr>
<tr><td>优势</td><td>yōushì</td><td>ưu điểm, điểm mạnh</td></tr>
<tr><td>劣势</td><td>lièshì</td><td>điểm yếu</td></tr>
<tr><td>胜任</td><td>shèngrèn</td><td>đảm đương được, đủ năng lực</td></tr>
<tr><td>录用</td><td>lùyòng</td><td>tuyển dụng</td></tr>
<tr><td>面试官</td><td>miànshìguān</td><td>người phỏng vấn</td></tr>
<tr><td>职责</td><td>zhízé</td><td>trách nhiệm, nhiệm vụ</td></tr>
<tr><td>薪资</td><td>xīnzī</td><td>lương, thu nhập</td></tr>
<tr><td>合作</td><td>hézuò</td><td>hợp tác</td></tr>
<tr><td>汇报</td><td>huìbào</td><td>báo cáo (công việc)</td></tr>
</table>
<h3>Mẫu câu giao tiếp công việc trọng tâm</h3>
<ul>
<li><strong>请问…</strong> qǐngwèn… — xin hỏi …</li>
<li><strong>能否请您…？</strong> néng fǒu qǐng nín…? — liệu tôi có thể nhờ ông/bà …?</li>
<li><strong>我的优势在于…</strong> wǒ de yōushì zàiyú… — điểm mạnh của tôi nằm ở …</li>
<li><strong>我期待…</strong> wǒ qídài… — tôi mong được …</li>
<li><strong>敬请指教</strong> jìngqǐng zhǐjiào — rất mong được chỉ dẫn (câu kết trang trọng, lịch sự).</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A: 请问，你为什么想应聘这个职位？ Qǐngwèn, nǐ wèishénme xiǎng yìngpìn zhège zhíwèi? (Xin hỏi, vì sao bạn muốn ứng tuyển vị trí này?)
B: 我的优势在于三年的相关经验，而且我很擅长跟团队合作。 Wǒ de yōushì zàiyú sān nián de xiāngguān jīngyàn, érqiě wǒ hěn shàncháng gēn tuánduì hézuò. (Điểm mạnh của tôi nằm ở ba năm kinh nghiệm liên quan, và tôi cũng rất giỏi hợp tác cùng nhóm.)
A: 能否请您举个例子？ Néng fǒu qǐng nín jǔ gè lìzi? (Liệu ông/bà có thể cho một ví dụ?)
B: 当然。在上一家公司，我负责每周向经理汇报项目进度，从没延误过。我期待能把这份经验带到新的职责中。 Dāngrán. Zài shàng yī jiā gōngsī, wǒ fùzé měi zhōu xiàng jīnglǐ huìbào xiàngmù jìndù, cóng méi yánwù guò. Wǒ qídài néng bǎ zhè fèn jīngyàn dài dào xīn de zhízé zhōng. (Tất nhiên. Ở công ty trước, tôi phụ trách báo cáo tiến độ dự án cho quản lý mỗi tuần, chưa từng trễ hạn. Tôi mong được mang kinh nghiệm này vào trách nhiệm mới.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> 我的优势在于… phải đi kèm một VÍ DỤ CỤ THỂ, không chỉ một tính từ suông — đó là lý do hội thoại chuyển ngay sang 举个例子. Điểm mạnh mơ hồ không thuyết phục được 面试官.</div>`,
  ]]);

const c6q = quiz('chs401-quiz-6', 'Quiz 6 — Professional & interview communication|||Quiz 6 — Giao tiếp công việc & phỏng vấn', [
  { id: 'q1', question: 'Sau khi nói "我的优势在于…" nên tiếp tục bằng gì để thuyết phục? / What should follow 我的优势在于… to be persuasive?', options: ['Một ví dụ cụ thể minh chứng cho điểm mạnh đó|||A concrete example proving that strength', 'Chuyển sang chào tạm biệt ngay|||Move straight to a goodbye', 'Hỏi về lương ngay lập tức|||Ask about salary immediately', 'Im lặng chờ câu hỏi tiếp|||Stay silent and wait for the next question'], correctIndex: 0, explanation: 'Điểm mạnh mơ hồ không thuyết phục — phải có ví dụ cụ thể (举个例子) đi kèm.' },
  { id: 'q2', question: '"敬请指教" (jìngqǐng zhǐjiào) dùng trong tình huống nào? / When is 敬请指教 used?', options: ['Câu kết trang trọng, lịch sự trong giao tiếp công việc|||A formal, polite closing in professional communication', 'Khi mặc cả giá|||When haggling over price', 'Khi từ chối phỏng vấn|||When declining an interview', 'Khi gọi món ăn|||When ordering food'], correctIndex: 0, explanation: '敬请指教 = rất mong được chỉ dẫn — câu kết lịch sự, trang trọng.' },
  { id: 'q3', question: '"汇报" (huìbào) trong ngữ cảnh công việc nghĩa là gì? / What does 汇报 mean in a work context?', options: ['Báo cáo (tiến độ công việc)|||To report (work progress)', 'Nghỉ việc|||To resign', 'Tăng lương|||To get a raise', 'Đi họp muộn|||To be late for a meeting'], correctIndex: 0, explanation: '汇报 = báo cáo, thường dùng cho báo cáo tiến độ công việc lên cấp trên.' },
]);

const c7 = doc('chs401-7-1-social-debate', 'Chapter 7 — Debating a social topic|||Chương 7 — Tranh luận về chủ đề xã hội',
  'Mẫu câu: 众所周知, 有人认为…而另一些人认为…, 正如…所说, 我方观点是; từ 辩论/反驳/论据/客观; luyện tranh luận có phe chính-phản.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 7 · Social debate</span>
<h2>Debating a social topic</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>社会问题</td><td>shèhuì wèntí</td><td>social issue</td></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>viewpoint</td></tr>
<tr><td>辩论</td><td>biànlùn</td><td>debate</td></tr>
<tr><td>反驳</td><td>fǎnbó</td><td>to rebut</td></tr>
<tr><td>正方 / 反方</td><td>zhèngfāng / fǎnfāng</td><td>affirmative side / negative side</td></tr>
<tr><td>论据</td><td>lùnjù</td><td>argument, evidence</td></tr>
<tr><td>偏见</td><td>piānjiàn</td><td>bias, prejudice</td></tr>
<tr><td>客观</td><td>kèguān</td><td>objective</td></tr>
<tr><td>公平</td><td>gōngpíng</td><td>fair</td></tr>
<tr><td>立论</td><td>lìlùn</td><td>to build an argument</td></tr>
</table>
<h3>Debate patterns to say</h3>
<ul>
<li><strong>众所周知…</strong> zhòngsuǒzhōuzhī… — as everyone knows, …</li>
<li><strong>有人认为…，而另一些人认为…</strong> yǒurén rènwéi…, ér lìng yīxiē rén rènwéi… — some people think …, while others think …</li>
<li><strong>正如…所说…</strong> zhèngrú…suǒ shuō… — just as … said, …</li>
<li><strong>我方观点是…</strong> wǒ fāng guāndiǎn shì… — our side's view is that …</li>
<li><strong>从长远来看…</strong> cóng chángyuǎn lái kàn… — in the long run, …</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A（正方）: 我方观点是，应该限制未成年人使用社交媒体的时间。 Wǒ fāng guāndiǎn shì, yīnggāi xiànzhì wèichéngniánrén shǐyòng shèjiāo méitǐ de shíjiān. (Our side's view is that minors' use of social media time should be limited.)
B（反方）: 众所周知，社交媒体也有教育意义，不能一概而论。 Zhòngsuǒzhōuzhī, shèjiāo méitǐ yě yǒu jiàoyù yìyì, bùnéng yígài érlùn. (As everyone knows, social media also has educational value, we can't generalize.)
A: 正如专家所说，过度使用会影响视力和注意力。从长远来看，家长有必要设定规则。 Zhèngrú zhuānjiā suǒ shuō, guòdù shǐyòng huì yǐngxiǎng shìlì hé zhùyìlì. Cóng chángyuǎn lái kàn, jiāzhǎng yǒu bìyào shèdìng guīzé. (As experts have said, overuse affects eyesight and attention. In the long run, it's necessary for parents to set rules.)
B: 有人认为限制是保护，而另一些人认为这剥夺了孩子的自主权，这一点值得我们继续讨论。 Yǒurén rènwéi xiànzhì shì bǎohù, ér lìng yīxiē rén rènwéi zhè bōduó le háizi de zìzhǔquán, zhè yī diǎn zhídé wǒmen jìxù tǎolùn. (Some people think limiting it is protection, while others think it deprives children of autonomy — this point is worth us continuing to discuss.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> 我方观点是… states your side's position ONCE, clearly, then backs it with 正如…所说 (an outside authority) — never rebut with emotion alone; a debate needs 论据, not just 反对.</div>`,
    `<span class="eyebrow">CHS401 · Chương 7 · Tranh luận xã hội</span>
<h2>Tranh luận về chủ đề xã hội</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>社会问题</td><td>shèhuì wèntí</td><td>vấn đề xã hội</td></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>quan điểm</td></tr>
<tr><td>辩论</td><td>biànlùn</td><td>tranh luận</td></tr>
<tr><td>反驳</td><td>fǎnbó</td><td>phản bác</td></tr>
<tr><td>正方 / 反方</td><td>zhèngfāng / fǎnfāng</td><td>phe chính / phe phản</td></tr>
<tr><td>论据</td><td>lùnjù</td><td>luận cứ, bằng chứng</td></tr>
<tr><td>偏见</td><td>piānjiàn</td><td>định kiến</td></tr>
<tr><td>客观</td><td>kèguān</td><td>khách quan</td></tr>
<tr><td>公平</td><td>gōngpíng</td><td>công bằng</td></tr>
<tr><td>立论</td><td>lìlùn</td><td>xây dựng luận điểm</td></tr>
</table>
<h3>Mẫu câu tranh luận trọng tâm</h3>
<ul>
<li><strong>众所周知…</strong> zhòngsuǒzhōuzhī… — ai cũng biết là …</li>
<li><strong>有人认为…，而另一些人认为…</strong> yǒurén rènwéi…, ér lìng yīxiē rén rènwéi… — có người cho rằng …, mà một số người khác lại cho rằng …</li>
<li><strong>正如…所说…</strong> zhèngrú…suǒ shuō… — đúng như … đã nói, …</li>
<li><strong>我方观点是…</strong> wǒ fāng guāndiǎn shì… — quan điểm của phe chúng tôi là …</li>
<li><strong>从长远来看…</strong> cóng chángyuǎn lái kàn… — nhìn về lâu dài, …</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A（正方）: 我方观点是，应该限制未成年人使用社交媒体的时间。 Wǒ fāng guāndiǎn shì, yīnggāi xiànzhì wèichéngniánrén shǐyòng shèjiāo méitǐ de shíjiān. (Quan điểm của phe chúng tôi là nên hạn chế thời gian trẻ chưa thành niên dùng mạng xã hội.)
B（反方）: 众所周知，社交媒体也有教育意义，不能一概而论。 Zhòngsuǒzhōuzhī, shèjiāo méitǐ yě yǒu jiàoyù yìyì, bùnéng yígài érlùn. (Ai cũng biết mạng xã hội cũng có ý nghĩa giáo dục, không thể vơ đũa cả nắm.)
A: 正如专家所说，过度使用会影响视力和注意力。从长远来看，家长有必要设定规则。 Zhèngrú zhuānjiā suǒ shuō, guòdù shǐyòng huì yǐngxiǎng shìlì hé zhùyìlì. Cóng chángyuǎn lái kàn, jiāzhǎng yǒu bìyào shèdìng guīzé. (Đúng như chuyên gia đã nói, dùng quá mức sẽ ảnh hưởng thị lực và sự chú ý. Nhìn về lâu dài, phụ huynh cần thiết phải đặt ra quy tắc.)
B: 有人认为限制是保护，而另一些人认为这剥夺了孩子的自主权，这一点值得我们继续讨论。 Yǒurén rènwéi xiànzhì shì bǎohù, ér lìng yīxiē rén rènwéi zhè bōduó le háizi de zìzhǔquán, zhè yī diǎn zhídé wǒmen jìxù tǎolùn. (Có người cho rằng hạn chế là bảo vệ, mà một số người khác lại cho rằng điều đó tước đi quyền tự chủ của trẻ, điểm này đáng để chúng ta tiếp tục thảo luận.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> 我方观点是… nêu lập trường phe mình MỘT LẦN, rõ ràng, rồi củng cố bằng 正如…所说 (dẫn một nguồn có uy tín) — đừng phản bác chỉ bằng cảm xúc; một cuộc tranh luận cần 论据, không chỉ 反对.</div>`,
  ]]);

const c7q = quiz('chs401-quiz-7', 'Quiz 7 — Debating a social topic|||Quiz 7 — Tranh luận về chủ đề xã hội', [
  { id: 'q1', question: 'Vì sao không nên phản bác chỉ bằng cảm xúc trong tranh luận? / Why should a rebuttal not rely on emotion alone?', options: ['Vì tranh luận cần 论据 (luận cứ/bằng chứng) để thuyết phục, không chỉ 反对|||Because a debate needs 论据 (evidence/argument) to persuade, not just 反对 (opposing)', 'Vì cảm xúc không thể nói bằng tiếng Trung|||Because emotion cannot be expressed in Chinese', 'Vì phe phản không được nói|||Because the opposing side is not allowed to speak', 'Vì phải nói tiếng Anh khi tranh luận|||Because debates must be in English'], correctIndex: 0, explanation: 'Một lập luận thuyết phục cần 论据 (bằng chứng/luận cứ) hỗ trợ, không chỉ phản đối suông.' },
  { id: 'q2', question: '"正如…所说" dùng để làm gì trong một bài tranh luận? / What is 正如…所说 used for in a debate?', options: ['Dẫn lời một nguồn có uy tín để củng cố lập luận|||Cite an authoritative source to back up an argument', 'Kết thúc cuộc tranh luận|||End the debate', 'Xin lỗi đối phương|||Apologize to the opponent', 'Đổi chủ đề|||Change the topic'], correctIndex: 0, explanation: '正如…所说 = đúng như … đã nói — dẫn nguồn (như chuyên gia) để tăng sức nặng cho luận điểm.' },
  { id: 'q3', question: '"我方观点是…" mở đầu cho điều gì? / What does 我方观点是… open?', options: ['Việc nêu rõ lập trường của phe mình trong tranh luận|||Stating one\'s side\'s position clearly in a debate', 'Một lời chào hỏi thông thường|||An everyday greeting', 'Một lời mời ăn tối|||A dinner invitation', 'Một câu hỏi giá cả|||A price question'], correctIndex: 0, explanation: '我方观点是 = quan điểm của phe chúng tôi là — câu nêu lập trường rõ ràng khi tranh luận.' },
]);

const c8 = doc('chs401-8-1-review-fluency', 'Chapter 8 — Review: rhetoric, rebuttal & fluency drills|||Chương 8 — Ôn tập: hùng biện, phản biện tình huống & luyện nói lưu loát',
  'Mẫu câu: 这么说吧, 怎么说呢, 也就是说, 一言以蔽之; từ 流利/临场/应变能力/连贯; luyện phản biện tại chỗ khi bí từ.',
  [[
    `<span class="eyebrow">CHS401 · Chapter 8 · Review</span>
<h2>Review: rhetoric, rebuttal &amp; fluency drills</h2>
<h3>Spoken vocabulary &amp; phrases</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>流利</td><td>liúlì</td><td>fluent</td></tr>
<tr><td>临场</td><td>línchǎng</td><td>on the spot, impromptu</td></tr>
<tr><td>应变能力</td><td>yìngbiàn nénglì</td><td>adaptability</td></tr>
<tr><td>措辞</td><td>cuòcí</td><td>wording, phrasing</td></tr>
<tr><td>停顿</td><td>tíngdùn</td><td>pause</td></tr>
<tr><td>连贯</td><td>liánguàn</td><td>coherent</td></tr>
<tr><td>语速</td><td>yǔsù</td><td>speaking speed</td></tr>
<tr><td>补充</td><td>bǔchōng</td><td>to add, supplement</td></tr>
<tr><td>归纳</td><td>guīnà</td><td>to summarize</td></tr>
<tr><td>即兴</td><td>jíxìng</td><td>improvised</td></tr>
</table>
<h3>Fluency &amp; rebuttal patterns to say</h3>
<ul>
<li><strong>这么说吧…</strong> zhème shuō ba… — let me put it this way … (buys a beat to think, stays fluent).</li>
<li><strong>怎么说呢…</strong> zěnme shuō ne… — how should I put it … (a natural filler, not dead air).</li>
<li><strong>也就是说…</strong> yě jiùshì shuō… — in other words, … (rephrases when a word is missing).</li>
<li><strong>一言以蔽之…</strong> yī yán yǐ bì zhī… — in a word, … (a formal way to summarize on the spot).</li>
</ul>
<h3>Sample dialogue — shadow &amp; role-play</h3>
<pre><code>A: 如果考官突然问一个你没准备的问题，你会怎么办？ Rúguǒ kǎoguān tūrán wèn yī gè nǐ méi zhǔnbèi de wèntí, nǐ huì zěnme bàn? (If the examiner suddenly asks a question you haven't prepared, what will you do?)
B: 这么说吧，我会先停顿两三秒，组织一下语言，不会一紧张就语速太快。 Zhème shuō ba, wǒ huì xiān tíngdùn liǎng sān miǎo, zǔzhī yīxià yǔyán, bú huì yī jǐnzhāng jiù yǔsù tài kuài. (Let me put it this way — I'll pause for two or three seconds first, organize my language a bit, and won't speed up just because I'm nervous.)
A: 那如果一时想不出汉字怎么说，怎么办？ Nà rúguǒ yīshí xiǎng bù chū hànzì zěnme shuō, zěnme bàn? (Then if you can't think of how to say a word for a moment, what do you do?)
B: 怎么说呢，我会用简单的话解释，也就是说，用我会的词绕一下，一言以蔽之，流利比完美更重要。 Zěnme shuō ne, wǒ huì yòng jiǎndān de huà jiěshì, yě jiùshì shuō, yòng wǒ huì de cí rào yīxià, yī yán yǐ bì zhī, liúlì bǐ wánměi gèng zhòngyào. (How should I put it — I'll explain with simple words, in other words, work around it using words I know. In a word, fluency matters more than perfection.)
</code></pre>
<div class="callout"><span class="badge">Fluency note</span> This whole course is a chain: 首先…然后… (Ch.1) narrates, 给我的印象是 (Ch.2) comments, 我坚持认为 (Ch.3) defends, 我们不妨 (Ch.4) negotiates, 今天我想跟大家谈谈 (Ch.5) presents, 我的优势在于 (Ch.6) sells you, 我方观点是 (Ch.7) argues — and 这么说吧 / 也就是说 (Ch.8) are the safety net that keeps ANY of them fluent when a word escapes you.</div>`,
    `<span class="eyebrow">CHS401 · Chương 8 · Ôn tập</span>
<h2>Ôn tập: hùng biện, phản biện tình huống &amp; luyện nói lưu loát</h2>
<h3>Từ vựng &amp; mẫu câu khẩu ngữ</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>流利</td><td>liúlì</td><td>trôi chảy, lưu loát</td></tr>
<tr><td>临场</td><td>línchǎng</td><td>tại chỗ, tức thời</td></tr>
<tr><td>应变能力</td><td>yìngbiàn nénglì</td><td>khả năng ứng biến</td></tr>
<tr><td>措辞</td><td>cuòcí</td><td>cách dùng từ, cách diễn đạt</td></tr>
<tr><td>停顿</td><td>tíngdùn</td><td>ngắt, dừng</td></tr>
<tr><td>连贯</td><td>liánguàn</td><td>mạch lạc, liền mạch</td></tr>
<tr><td>语速</td><td>yǔsù</td><td>tốc độ nói</td></tr>
<tr><td>补充</td><td>bǔchōng</td><td>bổ sung</td></tr>
<tr><td>归纳</td><td>guīnà</td><td>tóm lược, quy nạp</td></tr>
<tr><td>即兴</td><td>jíxìng</td><td>tức thời, ứng tác</td></tr>
</table>
<h3>Mẫu câu lưu loát &amp; phản biện trọng tâm</h3>
<ul>
<li><strong>这么说吧…</strong> zhème shuō ba… — nói thế này nhé … (mua thời gian suy nghĩ mà vẫn trôi chảy).</li>
<li><strong>怎么说呢…</strong> zěnme shuō ne… — nói sao nhỉ … (từ đệm tự nhiên, không phải im lặng chết đứng).</li>
<li><strong>也就是说…</strong> yě jiùshì shuō… — nói cách khác, … (diễn đạt lại khi thiếu từ).</li>
<li><strong>一言以蔽之…</strong> yī yán yǐ bì zhī… — tóm lại một câu, … (cách tóm gọn trang trọng ngay tại chỗ).</li>
</ul>
<h3>Hội thoại mẫu — nói nhại &amp; đóng vai</h3>
<pre><code>A: 如果考官突然问一个你没准备的问题，你会怎么办？ Rúguǒ kǎoguān tūrán wèn yī gè nǐ méi zhǔnbèi de wèntí, nǐ huì zěnme bàn? (Nếu giám khảo bất ngờ hỏi một câu bạn chưa chuẩn bị, bạn sẽ làm gì?)
B: 这么说吧，我会先停顿两三秒，组织一下语言，不会一紧张就语速太快。 Zhème shuō ba, wǒ huì xiān tíngdùn liǎng sān miǎo, zǔzhī yīxià yǔyán, bú huì yī jǐnzhāng jiù yǔsù tài kuài. (Nói thế này nhé, tôi sẽ ngắt hai ba giây trước, sắp xếp lại lời nói một chút, không để hễ căng thẳng là nói quá nhanh.)
A: 那如果一时想不出汉字怎么说，怎么办？ Nà rúguǒ yīshí xiǎng bù chū hànzì zěnme shuō, zěnme bàn? (Vậy nếu một lúc không nghĩ ra cách nói một chữ Hán, làm sao?)
B: 怎么说呢，我会用简单的话解释，也就是说，用我会的词绕一下，一言以蔽之，流利比完美更重要。 Zěnme shuō ne, wǒ huì yòng jiǎndān de huà jiěshì, yě jiùshì shuō, yòng wǒ huì de cí rào yīxià, yī yán yǐ bì zhī, liúlì bǐ wánměi gèng zhòngyào. (Nói sao nhỉ, tôi sẽ giải thích bằng từ đơn giản, nói cách khác, dùng từ mình biết để vòng qua. Tóm lại một câu, trôi chảy quan trọng hơn hoàn hảo.)
</code></pre>
<div class="callout"><span class="badge">Ghi chú lưu loát</span> Cả môn học này là một chuỗi: 首先…然后… (Chương 1) kể chuyện, 给我的印象是 (Chương 2) bình luận, 我坚持认为 (Chương 3) bảo vệ, 我们不妨 (Chương 4) đàm phán, 今天我想跟大家谈谈 (Chương 5) thuyết trình, 我的优势在于 (Chương 6) thể hiện bản thân, 我方观点是 (Chương 7) tranh luận — và 这么说吧 / 也就是说 (Chương 8) là lưới an toàn giữ cho BẤT KỲ mẫu nào trong số đó vẫn trôi chảy khi bạn bí một từ.</div>`,
  ]]);

const c8q = quiz('chs401-quiz-8', 'Quiz 8 — Review: rhetoric & fluency|||Quiz 8 — Ôn tập: hùng biện & lưu loát', [
  { id: 'q1', question: 'Khi bí một từ tiếng Trung giữa lúc nói, cách xử lý ĐÚNG theo bài học là gì? / When you get stuck on a word mid-speech, what is the RIGHT move taught here?', options: ['Ngắt 2-3 giây rồi diễn đạt lại bằng 也就是说/怎么说呢, dùng từ đã biết vòng qua|||Pause 2-3 seconds, then rephrase with 也就是说/怎么说呢, working around it with known words', 'Dừng hẳn cuộc nói và bỏ cuộc|||Stop the talk entirely and give up', 'Nói tiếng Việt xen vào|||Switch to Vietnamese mid-sentence', 'Nói càng nhanh càng tốt để che lấp|||Speed up as much as possible to hide it'], correctIndex: 0, explanation: 'Ngắt ngắn rồi diễn đạt lại bằng từ đã biết (也就是说, 怎么说呢) giữ được sự lưu loát — 流利 quan trọng hơn hoàn hảo.' },
  { id: 'q2', question: '"一言以蔽之" (yī yán yǐ bì zhī) dùng để làm gì? / What is 一言以蔽之 used for?', options: ['Tóm lại một câu, ngay tại chỗ|||To summarize in a word, on the spot', 'Mở đầu một câu chuyện dài|||To open a long story', 'Từ chối trả lời|||To refuse to answer', 'Hỏi lại câu hỏi|||To ask the question back'], correctIndex: 0, explanation: '一言以蔽之 = tóm lại một câu — cách tóm gọn trang trọng, dùng khi cần kết luận nhanh.' },
  { id: 'q3', question: 'Vì sao 这么说吧 / 怎么说呢 được gọi là "lưới an toàn" của cả môn học? / Why are 这么说吧 / 怎么说呢 called the course\'s "safety net"?', options: ['Vì chúng giữ lời nói trôi chảy trong MỌI kỹ năng đã học (kể chuyện, bình luận, tranh luận…) khi người nói cần thời gian nghĩ|||Because they keep speech fluent across EVERY skill learned (narrating, commenting, debating…) when the speaker needs a beat to think', 'Vì chúng chỉ dùng được trong phỏng vấn|||Because they only work in interviews', 'Vì chúng thay thế toàn bộ từ vựng đã học|||Because they replace all vocabulary learned', 'Vì chúng là câu chào hỏi|||Because they are greetings'], correctIndex: 0, explanation: 'Các từ đệm này hoạt động xuyên suốt mọi kỹ năng của 8 chương, giữ lưu loát khi bí từ hoặc cần thời gian tổ chức ý.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CHS401',
    slug: 'chs401-chinese-speaking-5',
    title: 'Chinese Speaking 5',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CHS401.webp',
    shortDescription: 'Advanced spoken Chinese (HSK5), after CHS301: narrate, describe & comment, defend opinions, negotiate, present, interview, debate, and drill fluency & rebuttal. 汉字, pinyin, dialogues, bilingual, quizzes.|||Nói tiếng Trung nâng cao (HSK5), nối tiếp CHS301: kể chuyện, miêu tả–bình luận, bảo vệ quan điểm, đàm phán, thuyết trình, phỏng vấn, tranh luận, luyện hùng biện & lưu loát. Chữ Hán, pinyin, hội thoại, song ngữ, quiz.',
    description: 'Môn <strong>CHS401 — Chinese Speaking 5 (Nói tiếng Trung 5, nâng cao)</strong> là môn <strong>luyện nói</strong> ở trình độ khẩu ngữ <strong>HSK5</strong>, <strong>nối tiếp CHS301</strong>. Chuyển từ nêu &amp; bảo vệ quan điểm sang <strong>trôi chảy trong một lượt nói dài</strong>: <strong>kể chuyện &amp; thuật lại</strong> → <strong>miêu tả &amp; bình luận</strong> → <strong>bày tỏ &amp; bảo vệ quan điểm</strong> → <strong>thảo luận nhóm &amp; đàm phán</strong> → <strong>thuyết trình có cấu trúc</strong> → <strong>giao tiếp công việc &amp; phỏng vấn</strong> → <strong>tranh luận chủ đề xã hội</strong> → <strong>ôn tập: hùng biện, phản biện &amp; luyện lưu loát</strong>. Bám giáo trình khẩu ngữ chuẩn (Advanced Spoken Chinese — 北京语言大学出版社, HSK Standard Course 5 口语), song ngữ Trung–Việt, mỗi bài có bảng từ vựng khẩu ngữ (汉字|pinyin|nghĩa), mẫu câu diễn đạt/nối ý trọng tâm, hội thoại mẫu nhiều lượt để nói nhại, ghi chú lưu loát/cách nói, và quiz. Học theo lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.',
    whatYouLearn: 'Kể chuyện &amp; thuật lại mạch lạc (事情是这样的, 首先…然后…接着…最后…, 结果); miêu tả &amp; bình luận hiện tượng (给我的印象是, 不可否认, 总的来说); bày tỏ &amp; bảo vệ quan điểm (就我而言, 我坚持认为, 换个角度说, 不得不承认); thảo luận nhóm &amp; đàm phán (我同意你的看法不过, 我们不妨, 折中一下, 各退一步); thuyết trình có cấu trúc (今天我想跟大家谈谈, 接下来, 大家有没有想过, 谢谢大家的聆听); giao tiếp công việc &amp; phỏng vấn (请问, 我的优势在于, 我期待, 敬请指教); tranh luận xã hội (众所周知, 有人认为…而另一些人认为, 正如…所说, 我方观点是); ôn tập hùng biện &amp; lưu loát (这么说吧, 怎么说呢, 也就是说, 一言以蔽之). Nói được các đoạn dài nhiều câu liên tiếp, mạch lạc, trôi chảy đúng chuẩn HSK5.',
    requirements: 'Nên học xong CHS301 (giao tiếp HSK4: nêu &amp; bảo vệ quan điểm về công việc, giáo dục, công nghệ, môi trường, văn hoá, sức khoẻ, tranh luận, thuyết trình) trước khi vào môn này. Cài Pleco hoặc HelloChinese để nghe audio bản ngữ &amp; luyện nói theo; hãy nói to, tự thu âm để so với mẫu, và tập giữ mạch một lượt nói dài chứ không chỉ một câu.',
  },
  sections: [
    { title: '📚 Tài liệu & lộ trình luyện nói|||📚 Course materials', description: 'Advanced Spoken Chinese, HSK Standard Course 5 (口语), app luyện nói, lộ trình 4 bước: nghe → bắt chước → luyện cặp → ứng dụng.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CHS301: mục tiêu khẩu ngữ HSK5 là sự trôi chảy qua 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Kể chuyện & thuật lại có mạch lạc|||Chapter 1 — Narrating & retelling', description: '事情是这样的, 首先…然后…接着…最后…, 结果, 情节, 转折.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Miêu tả & bình luận sự vật, hiện tượng|||Chapter 2 — Describing & commenting', description: '给我的印象是, 不可否认, 总的来说, 现象, 利大于弊.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bày tỏ & bảo vệ quan điểm cá nhân|||Chapter 3 — Expressing & defending opinions', description: '就我而言, 我坚持认为, 换个角度说, 不得不承认, 立场.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thảo luận nhóm & đàm phán|||Chapter 4 — Group discussion & negotiation', description: '我同意你的看法不过, 我们不妨, 折中一下, 各退一步, 达成共识.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thuyết trình có cấu trúc trước đám đông|||Chapter 5 — Structured presentation', description: '今天我想跟大家谈谈, 接下来, 大家有没有想过, 谢谢大家的聆听, 开场白.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giao tiếp công việc & phỏng vấn chuyên nghiệp|||Chapter 6 — Professional & interview communication', description: '请问, 能否请您, 我的优势在于, 我期待, 敬请指教.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tranh luận về chủ đề xã hội|||Chapter 7 — Debating a social topic', description: '众所周知, 有人认为…而另一些人认为, 正如…所说, 我方观点是, 从长远来看.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: hùng biện, phản biện tình huống & luyện nói lưu loát|||Chapter 8 — Review: rhetoric, rebuttal & fluency', description: '这么说吧, 怎么说呢, 也就是说, 一言以蔽之, 流利.', lessons: [c8, c8q] },
  ],
};
