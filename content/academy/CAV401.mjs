/**
 * CAV401 — Chinese Advanced Audio-Visual Listening & Speaking 2 (Nghe - Nhìn -
 * Nói tiếng Trung Nâng cao 2). Khối Ngôn ngữ Trung FPTU, Kỳ 4. NỐI TIẾP CAV301
 * (HSK4) → nâng lên HSK5. Đây là MÔN NGHE-NHÌN (không phải môn ngữ pháp như
 * CHI4xx): tài liệu thật khó hơn — phim điện ảnh, thời sự CCTV, tranh luận
 * truyền hình, diễn thuyết TED, phim tài liệu, kinh tế/công nghệ, văn hoá đại
 * chúng — bám giáo trình "高级视听说" (Advanced Audio-Visual-Speaking, Bắc Kinh
 * Ngữ ngôn Đại học xuất bản xã). Mỗi chương: 1 lời thoại/văn bản mẫu + từ vựng
 * (汉字 | pinyin | nghĩa) + mẹo nghe-nói, rồi 1 quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick lồng/${; trong HTML content "&" → "&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh từ vựng & kỹ năng nghe-nói của chương.', quiz: { timeLimitSeconds: 420, questions } });

const taiLieu = doc('cav401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu & lộ trình học',
  'Giáo trình 高级视听说 (BLCU Press), nguồn phim/thời sự/TED thật, từ điển, YouTube, lộ trình 4 bước nghe-nhìn HSK5. Nối tiếp CAV301.',
  [[
    `<span class="eyebrow">CAV401 · Materials</span>
<h2>Advanced audio-visual Chinese — materials &amp; roadmap</h2>
<p class="lead">CAV401 <strong>continues CAV301</strong> but the material gets much harder: instead of short, clearly-enunciated clips, you now train on <strong>real, unedited</strong> movies, CCTV news, TV debates, TED-style talks and documentaries — the register, speed and background noise of real Chinese media, roughly <strong>HSK5</strong>.</p>
<h3>📘 Core textbook</h3>
<ul>
<li><strong>高级视听说 (Advanced Audio-Visual-Speaking)</strong> — Beijing Language and Culture University (BLCU) Press — the standard textbook this course's chapter order follows.</li>
</ul>
<h3>🎬 Real source material</h3>
<ul>
<li><a href="https://www.cctv.com/" target="_blank" rel="noopener">CCTV.com</a> — official news broadcasts &amp; documentaries with transcripts.</li>
<li><a href="https://www.ted.com/talks?language=zh-cn" target="_blank" rel="noopener">TED (中文字幕)</a> — Chinese-subtitled and Chinese-language talks.</li>
<li><a href="https://www.bilibili.com/" target="_blank" rel="noopener">Bilibili</a> — movie clip analysis (影视解说), talk shows, documentaries.</li>
</ul>
<h3>📱 Apps &amp; dictionaries</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — dictionary with OCR &amp; audio, essential for pausing on unknown characters.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — Chinese–Vietnamese dictionary.</li>
</ul>
<div class="callout"><span class="badge">4-step path</span>
<ol>
<li><strong>Review CAV301</strong> — standard-speed dialogue listening should already be comfortable.</li>
<li><strong>Shadow the transcript</strong> — listen once without subtitles, then read the transcript, then listen again.</li>
<li><strong>Genre by genre</strong> — movie → news → debate → speech → documentary → economy/tech → arts/culture, each with its own vocabulary and speech rhythm.</li>
<li><strong>Speak back</strong> — summarize what you heard in your own words, then argue a position (辩论) or give a short talk (演讲).</li>
</ol></div>`,
    `<span class="eyebrow">CAV401 · Tài liệu</span>
<h2>Nghe-nhìn tiếng Trung nâng cao — tài liệu &amp; lộ trình</h2>
<p class="lead">CAV401 <strong>nối tiếp CAV301</strong> nhưng tài liệu khó hơn hẳn: thay vì đoạn ngắn phát âm rõ ràng, giờ bạn luyện trên phim, thời sự CCTV, tranh luận truyền hình, diễn thuyết kiểu TED và phim tài liệu <strong>thật, không cắt gọt</strong> — đúng văn phong, tốc độ và tạp âm của truyền thông Trung thật, mức tương đương <strong>HSK5</strong>.</p>
<h3>📘 Giáo trình chính</h3>
<ul>
<li><strong>高级视听说 (Advanced Audio-Visual-Speaking)</strong> — NXB Đại học Ngôn ngữ Bắc Kinh (BLCU) — giáo trình chuẩn mà thứ tự chương của môn này bám theo.</li>
</ul>
<h3>🎬 Tư liệu nguồn thật</h3>
<ul>
<li><a href="https://www.cctv.com/" target="_blank" rel="noopener">CCTV.com</a> — bản tin &amp; phim tài liệu chính thức kèm văn bản.</li>
<li><a href="https://www.ted.com/talks?language=zh-cn" target="_blank" rel="noopener">TED (中文字幕)</a> — diễn thuyết phụ đề Trung hoặc nói tiếng Trung.</li>
<li><a href="https://www.bilibili.com/" target="_blank" rel="noopener">Bilibili</a> — phân tích trích đoạn phim (影视解说), talk show, phim tài liệu.</li>
</ul>
<h3>📱 App &amp; từ điển</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển kèm OCR &amp; phát âm, cần thiết để dừng lại tra chữ lạ.</li>
<li><a href="https://hanzii.net/" target="_blank" rel="noopener">hanzii.net</a> — từ điển Trung–Việt.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Ôn CAV301</strong> — nghe hội thoại tốc độ chuẩn phải đã thoải mái.</li>
<li><strong>Nghe theo văn bản</strong> — nghe một lần không phụ đề, đọc văn bản, rồi nghe lại lần hai.</li>
<li><strong>Theo từng thể loại</strong> — phim → thời sự → tranh luận → diễn thuyết → phim tài liệu → kinh tế/công nghệ → nghệ thuật/văn hoá, mỗi thể loại có từ vựng và nhịp nói riêng.</li>
<li><strong>Nói lại</strong> — tóm tắt điều vừa nghe bằng lời của mình, rồi tranh luận một quan điểm (辩论) hoặc thuyết trình ngắn (演讲).</li>
</ol></div>`,
  ]]);

const intro = doc('cav401-0-1-overview', 'Course overview: Advanced Audio-Visual Listening & Speaking 2|||Tổng quan: Nghe - Nhìn - Nói tiếng Trung Nâng cao 2',
  'Nối tiếp CAV301, nâng HSK4→HSK5; 8 chương theo thể loại thật: phim, thời sự, tranh luận, diễn thuyết, phim tài liệu, kinh tế/công nghệ, nghệ thuật/văn hoá, và ôn tập tổng hợp.',
  [[
    `<span class="eyebrow">CAV401 · Lesson 0.1 · Overview</span>
<h2>Advanced Audio-Visual Listening &amp; Speaking 2</h2>
<p class="lead">This course pushes your Chinese listening from <strong>CAV301's HSK4 dialogues</strong> to <strong>HSK5 real media</strong>: movies, CCTV news, TV debates, TED-style speeches, documentaries, economy/tech programs and arts/culture segments. Each genre has its own vocabulary, register and speaking rhythm — a news anchor and a movie character do not talk alike.</p>
<h3>What is new at this level</h3>
<ul>
<li><strong>台词 (táicí)</strong> — movie/drama dialogue, full of idioms, ellipsis and implied meaning (潜台词).</li>
<li><strong>据…报道 (jù … bàodào)</strong> — the fixed news formula "according to … reports", plus formal 时政 vocabulary.</li>
<li><strong>反驳 (fǎnbó)</strong> — rebutting a point in a live debate, without losing the thread.</li>
<li><strong>论点…举例…总结 (lùndiǎn … jǔlì … zǒngjié)</strong> — the thesis → example → conclusion skeleton of a prepared speech.</li>
</ul>
<h3>Roadmap of this course</h3>
<p>Movies &amp; dialogue analysis → news &amp; in-depth reports → TV debates &amp; talk shows → speeches &amp; TED talks → history/society documentaries → economy &amp; tech programs → arts, music &amp; pop culture → final review: long-form listening, commentary &amp; rebuttal presentation. Every lesson has a sample transcript (汉字 + pinyin + meaning), a vocabulary table, listening/speaking tips, and a quiz.</p>`,
    `<span class="eyebrow">CAV401 · Bài 0.1 · Tổng quan</span>
<h2>Nghe - Nhìn - Nói tiếng Trung Nâng cao 2</h2>
<p class="lead">Môn này đẩy khả năng nghe tiếng Trung từ <strong>hội thoại HSK4 của CAV301</strong> lên <strong>tài liệu thật mức HSK5</strong>: phim điện ảnh, thời sự CCTV, tranh luận truyền hình, diễn thuyết kiểu TED, phim tài liệu, chương trình kinh tế/công nghệ và nghệ thuật/văn hoá. Mỗi thể loại có từ vựng, văn phong và nhịp nói riêng — người dẫn bản tin và nhân vật phim không nói giống nhau.</p>
<h3>Điểm mới ở trình độ này</h3>
<ul>
<li><strong>台词 (táicí)</strong> — lời thoại phim/kịch, đầy thành ngữ, tỉnh lược và ẩn ý (潜台词).</li>
<li><strong>据…报道 (jù … bàodào)</strong> — công thức bản tin cố định "theo … đưa tin", cùng từ vựng 时政 trang trọng.</li>
<li><strong>反驳 (fǎnbó)</strong> — phản bác một luận điểm trong tranh luận trực tiếp mà không mất mạch.</li>
<li><strong>论点…举例…总结 (lùndiǎn … jǔlì … zǒngjié)</strong> — khung luận điểm → ví dụ → kết luận của một bài diễn thuyết chuẩn bị trước.</li>
</ul>
<h3>Lộ trình của môn</h3>
<p>Phim &amp; phân tích lời thoại → thời sự &amp; bản tin chuyên sâu → tranh luận &amp; talk show truyền hình → diễn thuyết &amp; TED tiếng Trung → phim tài liệu lịch sử-xã hội → chương trình kinh tế &amp; công nghệ → nghệ thuật, âm nhạc &amp; văn hoá đại chúng → ôn tập tổng hợp: nghe dài, bình luận &amp; thuyết trình phản biện. Mỗi bài có văn bản mẫu (汉字 + pinyin + nghĩa), bảng từ vựng, mẹo nghe-nói, và quiz.</p>`,
  ]]);

const c1 = doc('cav401-1-1-movie-dialogue', 'Chapter 1 — Movies & dialogue analysis|||Chương 1 — Phim điện ảnh & phân tích lời thoại',
  'Từ vựng: 台词, 剧情, 情节, 配音, 字幕, 伏笔, 隐喻, 潜台词, 演技. Mẹo nghe: bắt thành ngữ/khẩu ngữ, giọng điệu cảm xúc, câu rút gọn.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 1 · Movies</span>
<h2>Movies &amp; dialogue analysis (电影台词分析)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>台词</td><td>táicí</td><td>lines / dialogue (in a film or play)</td></tr>
<tr><td>剧情</td><td>jùqíng</td><td>plot / storyline</td></tr>
<tr><td>情节</td><td>qíngjié</td><td>plot detail / episode</td></tr>
<tr><td>配音</td><td>pèiyīn</td><td>dubbing; to dub</td></tr>
<tr><td>字幕</td><td>zìmù</td><td>subtitles</td></tr>
<tr><td>伏笔</td><td>fúbǐ</td><td>foreshadowing</td></tr>
<tr><td>隐喻</td><td>yǐnyù</td><td>metaphor</td></tr>
<tr><td>潜台词</td><td>qiántáicí</td><td>subtext / implied meaning</td></tr>
<tr><td>演技</td><td>yǎnjì</td><td>acting skill</td></tr>
</table>
<h3>Sample dialogue (选段台词)</h3>
<pre><code>甲: 你早就知道会这样，对不对？
   Jiǎ: Nǐ zǎo jiù zhīdào huì zhèyàng, duì bu duì?
   (You knew this would happen all along, didn't you?)
乙: 我什么都没说。
   Yǐ: Wǒ shénme dōu méi shuō.
   (I didn't say anything.)
甲: 你的沉默就是答案。
   Jiǎ: Nǐ de chénmò jiùshì dá'àn.
   (Your silence is the answer.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Movie 台词 is full of <strong>ellipsis</strong> (characters don't finish sentences), <strong>tone shifts</strong> (sarcasm vs sincerity sound almost the same in text but not in voice), and <strong>潜台词</strong> — what is meant is often not what is said. Watch the face and pause length, not just the words. Re-watch a scene twice: once for plot (剧情), once purely for how each line is delivered (演技).</div>
<div class="callout"><span class="badge">Speaking tip</span> Practice retelling a scene's 剧情 in your own words, then quote one line of 台词 and explain its 潜台词 — this is exactly the skill tested when discussing a film clip.</div>`,
    `<span class="eyebrow">CAV401 · Chương 1 · Phim</span>
<h2>Phim điện ảnh &amp; phân tích lời thoại (电影台词分析)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>台词</td><td>táicí</td><td>lời thoại (phim/kịch)</td></tr>
<tr><td>剧情</td><td>jùqíng</td><td>cốt truyện, diễn biến phim</td></tr>
<tr><td>情节</td><td>qíngjié</td><td>tình tiết</td></tr>
<tr><td>配音</td><td>pèiyīn</td><td>lồng tiếng</td></tr>
<tr><td>字幕</td><td>zìmù</td><td>phụ đề</td></tr>
<tr><td>伏笔</td><td>fúbǐ</td><td>chi tiết dẫn dắt, gợi ý trước</td></tr>
<tr><td>隐喻</td><td>yǐnyù</td><td>ẩn dụ</td></tr>
<tr><td>潜台词</td><td>qiántáicí</td><td>hàm ý, ý ngoài lời</td></tr>
<tr><td>演技</td><td>yǎnjì</td><td>diễn xuất</td></tr>
</table>
<h3>Trích đoạn lời thoại (选段台词)</h3>
<pre><code>甲: 你早就知道会这样，对不对？
   Jiǎ: Nǐ zǎo jiù zhīdào huì zhèyàng, duì bu duì?
   (Anh/em đã biết trước sẽ như vậy, đúng không?)
乙: 我什么都没说。
   Yǐ: Wǒ shénme dōu méi shuō.
   (Tôi chẳng nói gì cả.)
甲: 你的沉默就是答案。
   Jiǎ: Nǐ de chénmò jiùshì dá'àn.
   (Sự im lặng của anh/em chính là câu trả lời.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> 台词 trong phim đầy <strong>câu bỏ lửng</strong> (nhân vật không nói hết câu), <strong>đổi giọng điệu</strong> (mỉa mai và chân thành viết ra gần giống nhau nhưng nghe khác hẳn), và <strong>潜台词</strong> — điều muốn nói thường không phải điều được nói ra. Hãy quan sát nét mặt và độ dài khoảng lặng, đừng chỉ nghe chữ. Xem lại một cảnh hai lần: một lần để nắm 剧情, một lần chỉ để nghe cách từng câu được diễn (演技).</div>
<div class="callout"><span class="badge">Mẹo nói</span> Luyện kể lại 剧情 một cảnh bằng lời của mình, rồi trích một câu 台词 và giải thích 潜台词 của nó — đây đúng là kỹ năng được kiểm khi thảo luận về một đoạn phim.</div>`,
  ]]);

const c1q = quiz('cav401-quiz-1', 'Quiz 1 — Movies & dialogue|||Quiz 1 — Phim & lời thoại', [
  { id: 'q1', question: '"潜台词" (qiántáicí) nghĩa là gì?', options: ['Lời thoại được viết sẵn', 'Hàm ý, điều không nói ra trực tiếp', 'Phụ đề của phim', 'Nhạc nền của phim'], correctIndex: 1, explanation: '潜台词 là ý nghĩa ẩn sau câu nói — điều nhân vật thực sự muốn nói nhưng không nói thẳng.' },
  { id: 'q2', question: 'Trong câu "你的沉默就是答案" (Nǐ de chénmò jiùshì dá\'àn), "沉默" nghĩa là gì?', options: ['Sự im lặng', 'Câu trả lời', 'Sự tức giận', 'Lời hứa'], correctIndex: 0, explanation: '沉默 (chénmò) = sự im lặng; cả câu nghĩa là "Sự im lặng của anh/em chính là câu trả lời."' },
  { id: 'q3', question: 'Khi phân tích một đoạn phim, "伏笔" (fúbǐ) dùng để chỉ điều gì?', options: ['Diễn viên chính', 'Chi tiết được cài trước để dẫn tới tình tiết sau', 'Bản dịch phụ đề', 'Giọng lồng tiếng'], correctIndex: 1, explanation: '伏笔 là kỹ thuật kể chuyện: gài một chi tiết nhỏ trước, để sau đó nó có ý nghĩa quan trọng.' },
]);

const c2 = doc('cav401-2-1-news-report', 'Chapter 2 — News & in-depth reports|||Chương 2 — Thời sự & bản tin chuyên sâu',
  'Từ vựng: 播报, 时政, 综述, 据报道, 权威人士, 数据显示, 舆论, 评论员. Mẹo nghe: công thức bản tin CCTV, ghi chú tiêu đề + 5W.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 2 · News</span>
<h2>News &amp; in-depth reports (新闻与深度报道)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>播报</td><td>bōbào</td><td>to broadcast / report (news)</td></tr>
<tr><td>时政</td><td>shízhèng</td><td>current political affairs</td></tr>
<tr><td>综述</td><td>zòngshù</td><td>overview report / round-up</td></tr>
<tr><td>据报道</td><td>jù bàodào</td><td>according to reports</td></tr>
<tr><td>权威人士</td><td>quánwēi rénshì</td><td>authoritative source</td></tr>
<tr><td>数据显示</td><td>shùjù xiǎnshì</td><td>data shows (that)</td></tr>
<tr><td>舆论</td><td>yúlùn</td><td>public opinion</td></tr>
<tr><td>评论员</td><td>pínglùnyuán</td><td>commentator</td></tr>
</table>
<h3>Sample news opening (播报选段)</h3>
<pre><code>据中央电视台报道，本台记者从相关部门获悉，
Jù Zhōngyāng Diànshìtái bàodào, běn tái jìzhě cóng
xiāngguān bùmén huòxī,
(According to CCTV, our correspondent has learned from
the relevant department that)

最新数据显示，今年前三季度经济增速保持稳定。
zuìxīn shùjù xiǎnshì, jīnnián qián sān jìdù jīngjì
zēngsù bǎochí wěndìng.
(the latest data shows that economic growth held steady
in the first three quarters of this year.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> CCTV-style news has a fixed skeleton: <strong>据…报道</strong> (source) → <strong>数据显示 / 据了解</strong> (fact) → 评论员 opinion. The anchor's speed is fast but the sentence structure is very formulaic — once you recognize the formula, you can predict what comes next. Take notes as <strong>headline + 5W</strong> (who/what/when/where/why), not word-for-word.</div>
<div class="callout"><span class="badge">Speaking tip</span> Practice giving a 30-second 综述 (summary) of a news clip using the formula 据…报道，…数据显示，… — this formal register is exactly what a HSK5 speaking test on current affairs expects.</div>`,
    `<span class="eyebrow">CAV401 · Chương 2 · Thời sự</span>
<h2>Thời sự &amp; bản tin chuyên sâu (新闻与深度报道)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>播报</td><td>bōbào</td><td>đưa tin, phát bản tin</td></tr>
<tr><td>时政</td><td>shízhèng</td><td>thời sự chính trị</td></tr>
<tr><td>综述</td><td>zòngshù</td><td>bản tin tổng hợp</td></tr>
<tr><td>据报道</td><td>jù bàodào</td><td>theo tin đưa</td></tr>
<tr><td>权威人士</td><td>quánwēi rénshì</td><td>nguồn tin có thẩm quyền</td></tr>
<tr><td>数据显示</td><td>shùjù xiǎnshì</td><td>số liệu cho thấy</td></tr>
<tr><td>舆论</td><td>yúlùn</td><td>dư luận</td></tr>
<tr><td>评论员</td><td>pínglùnyuán</td><td>bình luận viên</td></tr>
</table>
<h3>Trích mở đầu bản tin (播报选段)</h3>
<pre><code>据中央电视台报道，本台记者从相关部门获悉，
Jù Zhōngyāng Diànshìtái bàodào, běn tái jìzhě cóng
xiāngguān bùmén huòxī,
(Theo tin từ Đài Truyền hình Trung ương, phóng viên đài
chúng tôi được biết từ các cơ quan liên quan,)

最新数据显示，今年前三季度经济增速保持稳定。
zuìxīn shùjù xiǎnshì, jīnnián qián sān jìdù jīngjì
zēngsù bǎochí wěndìng.
(số liệu mới nhất cho thấy tăng trưởng kinh tế ba quý
đầu năm nay giữ ổn định.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Bản tin kiểu CCTV có khung cố định: <strong>据…报道</strong> (nguồn tin) → <strong>数据显示 / 据了解</strong> (dữ kiện) → ý kiến 评论员. Người dẫn nói nhanh nhưng cấu trúc câu rất công thức — nhận ra công thức là đoán được vế tiếp theo. Ghi chú theo <strong>tiêu đề + 5W</strong> (ai/việc gì/khi nào/ở đâu/vì sao), đừng chép từng chữ.</div>
<div class="callout"><span class="badge">Mẹo nói</span> Luyện tóm tắt 综述 30 giây cho một đoạn thời sự theo công thức 据…报道，…数据显示，… — đây đúng là văn phong trang trọng mà phần thi nói HSK5 về thời sự yêu cầu.</div>`,
  ]]);

const c2q = quiz('cav401-quiz-2', 'Quiz 2 — News & reports|||Quiz 2 — Thời sự & bản tin', [
  { id: 'q1', question: 'Cụm "据报道" (jù bàodào) thường đứng ở đâu trong một bản tin?', options: ['Cuối bản tin, để kết luận', 'Đầu câu, để dẫn nguồn tin', 'Chỉ dùng trong phim', 'Chỉ dùng khi phỏng vấn'], correctIndex: 1, explanation: '据报道 = "theo tin đưa", luôn mở đầu câu để dẫn nguồn thông tin, đúng công thức bản tin.' },
  { id: 'q2', question: '"数据显示" (shùjù xiǎnshì) nghĩa là gì?', options: ['Dư luận cho rằng', 'Số liệu cho thấy', 'Nguồn tin từ chối', 'Bình luận viên nói'], correctIndex: 1, explanation: '数据显示 = "số liệu cho thấy", dùng để đưa dữ kiện thống kê trong bản tin.' },
  { id: 'q3', question: 'Khi nghe bản tin thời sự, mẹo ghi chú hiệu quả nhất là gì?', options: ['Chép lại nguyên văn từng chữ', 'Chỉ nghe phần mở đầu rồi bỏ qua phần sau', 'Ghi theo tiêu đề + 5W (ai/việc gì/khi nào/ở đâu/vì sao)', 'Không cần ghi chú vì đã có phụ đề'], correctIndex: 2, explanation: 'Bản tin nói nhanh nên ghi tiêu đề + 5W hiệu quả hơn chép nguyên văn.' },
]);

const c3 = doc('cav401-3-1-debate-talkshow', 'Chapter 3 — TV debates & talk shows|||Chương 3 — Tranh luận & talk show truyền hình',
  'Từ vựng: 辩论, 观点, 反驳, 立场, 论据, 主持人, 嘉宾, 打断, 达成共识. Mẹo nghe: bắt điểm ngắt lời, cụm phản bác, giữ mạch lập luận.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 3 · Debate</span>
<h2>TV debates &amp; talk shows (电视辩论与访谈节目)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>辩论</td><td>biànlùn</td><td>debate; to debate</td></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>viewpoint / opinion</td></tr>
<tr><td>反驳</td><td>fǎnbó</td><td>to rebut / refute</td></tr>
<tr><td>立场</td><td>lìchǎng</td><td>stance / position</td></tr>
<tr><td>论据</td><td>lùnjù</td><td>evidence / grounds for an argument</td></tr>
<tr><td>主持人</td><td>zhǔchírén</td><td>host / moderator</td></tr>
<tr><td>嘉宾</td><td>jiābīn</td><td>guest (on a show)</td></tr>
<tr><td>打断</td><td>dǎduàn</td><td>to interrupt</td></tr>
<tr><td>达成共识</td><td>dáchéng gòngshí</td><td>to reach a consensus</td></tr>
</table>
<h3>Sample exchange (辩论选段)</h3>
<pre><code>主持人: 请正方先陈述观点。
Zhǔchírén: Qǐng zhèngfāng xiān chénshù guāndiǎn.
(Host: Please let the affirmative side state their view first.)

嘉宾甲: 我认为这项政策利大于弊。
Jiābīn jiǎ: Wǒ rènwéi zhè xiàng zhèngcè lì dà yú bì.
(Guest A: I believe this policy does more good than harm.)

嘉宾乙: 恕我打断一下，您的论据并不充分。
Jiābīn yǐ: Shù wǒ dǎduàn yíxià, nín de lùnjù bìng bù
chōngfèn.
(Guest B: Forgive my interrupting, but your evidence is
not sufficient.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> In a live debate, speakers <strong>打断 (interrupt)</strong> each other and talk over one another — the key is catching who holds the floor and their 立场 even mid-sentence. Listen for signal phrases: <strong>恕我打断</strong> (forgive my interrupting), <strong>换句话说</strong> (in other words), <strong>我不完全同意</strong> (I don't entirely agree) mark a turn or a 反驳 coming.</div>
<div class="callout"><span class="badge">Speaking tip</span> Build a 反驳 with a fixed shape: acknowledge → 恕我打断/我理解您的观点，但是… → give your own 论据. Practicing this shape lets you jump into a debate without losing your 立场.</div>`,
    `<span class="eyebrow">CAV401 · Chương 3 · Tranh luận</span>
<h2>Tranh luận &amp; talk show truyền hình (电视辩论与访谈节目)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>辩论</td><td>biànlùn</td><td>tranh luận</td></tr>
<tr><td>观点</td><td>guāndiǎn</td><td>quan điểm</td></tr>
<tr><td>反驳</td><td>fǎnbó</td><td>phản bác</td></tr>
<tr><td>立场</td><td>lìchǎng</td><td>lập trường</td></tr>
<tr><td>论据</td><td>lùnjù</td><td>luận cứ, bằng chứng</td></tr>
<tr><td>主持人</td><td>zhǔchírén</td><td>người dẫn chương trình</td></tr>
<tr><td>嘉宾</td><td>jiābīn</td><td>khách mời</td></tr>
<tr><td>打断</td><td>dǎduàn</td><td>ngắt lời</td></tr>
<tr><td>达成共识</td><td>dáchéng gòngshí</td><td>đạt được đồng thuận</td></tr>
</table>
<h3>Trích đoạn tranh luận (辩论选段)</h3>
<pre><code>主持人: 请正方先陈述观点。
Zhǔchírén: Qǐng zhèngfāng xiān chénshù guāndiǎn.
(Người dẫn: Mời bên chính phát biểu quan điểm trước.)

嘉宾甲: 我认为这项政策利大于弊。
Jiābīn jiǎ: Wǒ rènwéi zhè xiàng zhèngcè lì dà yú bì.
(Khách mời A: Tôi cho rằng chính sách này lợi nhiều hơn hại.)

嘉宾乙: 恕我打断一下，您的论据并不充分。
Jiābīn yǐ: Shù wǒ dǎduàn yíxià, nín de lùnjù bìng bù
chōngfèn.
(Khách mời B: Xin lỗi vì ngắt lời, nhưng luận cứ của anh/chị chưa đủ thuyết phục.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Trong tranh luận trực tiếp, người nói <strong>打断 (ngắt lời)</strong> và nói chồng lên nhau — điều quan trọng là bắt được ai đang giữ lượt nói và 立场 của họ dù giữa câu. Nghe các cụm tín hiệu: <strong>恕我打断</strong> (xin lỗi vì ngắt lời), <strong>换句话说</strong> (nói cách khác), <strong>我不完全同意</strong> (tôi không hoàn toàn đồng ý) báo hiệu sắp đổi lượt hoặc sắp có 反驳.</div>
<div class="callout"><span class="badge">Mẹo nói</span> Xây một câu 反驳 theo khung cố định: ghi nhận → 恕我打断/我理解您的观点，但是… → đưa 论据 của mình. Luyện khung này giúp bạn chen vào tranh luận mà không mất 立场.</div>`,
  ]]);

const c3q = quiz('cav401-quiz-3', 'Quiz 3 — Debate & talk show|||Quiz 3 — Tranh luận & talk show', [
  { id: 'q1', question: 'Cụm "恕我打断一下" dùng để làm gì?', options: ['Kết thúc chương trình', 'Xin phép ngắt lời người khác một cách lịch sự', 'Giới thiệu khách mời', 'Đồng ý hoàn toàn với đối phương'], correctIndex: 1, explanation: '恕我打断一下 = "xin lỗi vì ngắt lời", một cách lịch sự để chen vào tranh luận trước khi 反驳.' },
  { id: 'q2', question: '"论据" (lùnjù) nghĩa là gì?', options: ['Quan điểm cá nhân', 'Luận cứ, bằng chứng để bảo vệ một quan điểm', 'Người dẫn chương trình', 'Sự đồng thuận'], correctIndex: 1, explanation: '论据 là bằng chứng/lý lẽ dùng để bảo vệ một 观点 trong tranh luận.' },
  { id: 'q3', question: 'Khi nghe một cuộc tranh luận có nhiều người nói chồng lên nhau, nên ưu tiên bắt điều gì?', options: ['Chỉ nghe người nói to nhất', 'Ai đang giữ lượt nói và lập trường (立场) của họ', 'Bỏ qua, chỉ nghe kết luận cuối', 'Đếm số lần ngắt lời'], correctIndex: 1, explanation: 'Kỹ năng nghe tranh luận là bắt được người giữ lượt nói và lập trường của họ, kể cả giữa câu.' },
]);

const c4 = doc('cav401-4-1-speech-ted', 'Chapter 4 — Speeches & TED talks|||Chương 4 — Diễn thuyết & TED tiếng Trung',
  'Từ vựng: 演讲稿, 开场白, 论点, 举例, 呼吁, 感染力, 停顿, 语调. Mẹo nghe: khung mở-luận điểm-ví dụ-kết, từ nối chuyển ý.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 4 · Speeches</span>
<h2>Speeches &amp; TED talks (演讲与TED演讲)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>演讲稿</td><td>yǎnjiǎnggǎo</td><td>speech script / manuscript</td></tr>
<tr><td>开场白</td><td>kāichǎngbái</td><td>opening remarks</td></tr>
<tr><td>论点</td><td>lùndiǎn</td><td>thesis / main argument</td></tr>
<tr><td>举例</td><td>jǔlì</td><td>to give an example</td></tr>
<tr><td>呼吁</td><td>hūyù</td><td>to appeal / call for</td></tr>
<tr><td>感染力</td><td>gǎnrǎnlì</td><td>persuasive power / appeal</td></tr>
<tr><td>停顿</td><td>tíngdùn</td><td>pause</td></tr>
<tr><td>语调</td><td>yǔdiào</td><td>intonation</td></tr>
</table>
<h3>Sample opening (演讲开场白)</h3>
<pre><code>大家好，今天我想和大家分享一个关于坚持的故事。
Dàjiā hǎo, jīntiān wǒ xiǎng hé dàjiā fēnxiǎng yí gè
guānyú jiānchí de gùshi.
(Hello everyone, today I want to share a story about
persistence with you.)

首先，请让我举一个例子。
Shǒuxiān, qǐng ràng wǒ jǔ yí gè lìzi.
(First, let me give an example.)

最后，我想呼吁大家，从今天开始行动。
Zuìhòu, wǒ xiǎng hūyù dàjiā, cóng jīntiān kāishǐ xíngdòng.
(Finally, I want to call on everyone to start taking
action today.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> A prepared speech follows a clear skeleton: <strong>开场白 → 论点 → 举例 → 呼吁/总结</strong>. Listen for the transition words <strong>首先 (first) / 其次 (next) / 最后 (finally) / 总而言之 (in short)</strong> — they mark where one part ends and the next begins. A speaker's 停顿 (pause) and rising 语调 usually signal the sentence they most want you to remember.</div>
<div class="callout"><span class="badge">Speaking tip</span> Draft your own short talk with the same skeleton — one 论点, one concrete 举例, one 呼吁 — and practice pausing on purpose before your key sentence for 感染力.</div>`,
    `<span class="eyebrow">CAV401 · Chương 4 · Diễn thuyết</span>
<h2>Diễn thuyết &amp; TED tiếng Trung (演讲与TED演讲)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>演讲稿</td><td>yǎnjiǎnggǎo</td><td>bài diễn thuyết viết sẵn</td></tr>
<tr><td>开场白</td><td>kāichǎngbái</td><td>lời mở đầu</td></tr>
<tr><td>论点</td><td>lùndiǎn</td><td>luận điểm chính</td></tr>
<tr><td>举例</td><td>jǔlì</td><td>đưa ví dụ</td></tr>
<tr><td>呼吁</td><td>hūyù</td><td>kêu gọi</td></tr>
<tr><td>感染力</td><td>gǎnrǎnlì</td><td>sức thuyết phục, sức lan toả cảm xúc</td></tr>
<tr><td>停顿</td><td>tíngdùn</td><td>khoảng ngắt, ngưng</td></tr>
<tr><td>语调</td><td>yǔdiào</td><td>ngữ điệu</td></tr>
</table>
<h3>Trích lời mở đầu (演讲开场白)</h3>
<pre><code>大家好，今天我想和大家分享一个关于坚持的故事。
Dàjiā hǎo, jīntiān wǒ xiǎng hé dàjiā fēnxiǎng yí gè
guānyú jiānchí de gùshi.
(Xin chào mọi người, hôm nay tôi muốn chia sẻ một câu chuyện về sự kiên trì.)

首先，请让我举一个例子。
Shǒuxiān, qǐng ràng wǒ jǔ yí gè lìzi.
(Trước hết, hãy để tôi đưa ra một ví dụ.)

最后，我想呼吁大家，从今天开始行动。
Zuìhòu, wǒ xiǎng hūyù dàjiā, cóng jīntiān kāishǐ xíngdòng.
(Cuối cùng, tôi muốn kêu gọi mọi người bắt đầu hành động từ hôm nay.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Một bài diễn thuyết chuẩn bị trước đi theo khung rõ ràng: <strong>开场白 → 论点 → 举例 → 呼吁/总结</strong>. Nghe các từ nối <strong>首先 (trước hết) / 其次 (tiếp theo) / 最后 (cuối cùng) / 总而言之 (tóm lại)</strong> — chúng đánh dấu ranh giới giữa các phần. 停顿 (khoảng ngắt) và 语调 lên cao thường báo hiệu câu diễn giả muốn bạn nhớ nhất.</div>
<div class="callout"><span class="badge">Mẹo nói</span> Soạn một bài nói ngắn của riêng bạn theo cùng khung — một 论点, một 举例 cụ thể, một 呼吁 — và luyện ngắt (停顿) có chủ đích trước câu quan trọng nhất để tăng 感染力.</div>`,
  ]]);

const c4q = quiz('cav401-quiz-4', 'Quiz 4 — Speeches & TED|||Quiz 4 — Diễn thuyết & TED', [
  { id: 'q1', question: 'Trong khung một bài diễn thuyết, "举例" nằm ở vị trí nào?', options: ['Trước 开场白', 'Sau 论点, để minh hoạ cho luận điểm', 'Chỉ xuất hiện ở phần kết', 'Không cần thiết trong diễn thuyết'], correctIndex: 1, explanation: 'Khung chuẩn là 开场白 → 论点 → 举例 (minh hoạ) → 呼吁/总结.' },
  { id: 'q2', question: 'Từ nối nào KHÔNG dùng để đánh dấu chuyển ý trong diễn thuyết?', options: ['首先', '其次', '最后', '打断'], correctIndex: 3, explanation: '打断 nghĩa là "ngắt lời", không phải từ nối chuyển ý; 首先/其次/最后 mới là từ nối.' },
  { id: 'q3', question: '"感染力" (gǎnrǎnlì) trong một bài diễn thuyết nghĩa là gì?', options: ['Tốc độ nói nhanh', 'Sức thuyết phục, khả năng lay động cảm xúc người nghe', 'Số lượng ví dụ đưa ra', 'Độ dài của bài diễn thuyết'], correctIndex: 1, explanation: '感染力 = sức lan toả cảm xúc/thuyết phục của người nói, thường tạo ra nhờ 停顿 và 语调.' },
]);

const c5 = doc('cav401-5-1-documentary', 'Chapter 5 — History & society documentaries|||Chương 5 — Phim tài liệu lịch sử - xã hội',
  'Từ vựng: 纪录片, 旁白, 史料, 变迁, 见证, 沧桑, 传承, 时代背景. Mẹo nghe: nhịp chậm trang trọng, số liệu/năm tháng, ẩn dụ văn hoá.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 5 · Documentary</span>
<h2>History &amp; society documentaries (历史社会纪录片)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>纪录片</td><td>jìlùpiàn</td><td>documentary film</td></tr>
<tr><td>旁白</td><td>pángbái</td><td>narration / voiceover</td></tr>
<tr><td>史料</td><td>shǐliào</td><td>historical material</td></tr>
<tr><td>变迁</td><td>biànqiān</td><td>changes over time / transformation</td></tr>
<tr><td>见证</td><td>jiànzhèng</td><td>to witness; a witness</td></tr>
<tr><td>沧桑</td><td>cāngsāng</td><td>vicissitudes of life; weathered by time</td></tr>
<tr><td>传承</td><td>chuánchéng</td><td>to inherit and pass down</td></tr>
<tr><td>时代背景</td><td>shídài bèijǐng</td><td>the background of an era</td></tr>
</table>
<h3>Sample narration (旁白选段)</h3>
<pre><code>这座古城，见证了百年来的历史变迁。
Zhè zuò gǔchéng, jiànzhèng le bǎinián lái de lìshǐ
biànqiān.
(This ancient city has witnessed a century of historical
change.)

如今，老一辈的手艺仍在被年轻人传承下去。
Rújīn, lǎo yíbèi de shǒuyì réng zài bèi niánqīngrén
chuánchéng xiàqu.
(Today, the older generation's craft is still being
passed down by young people.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Documentary 旁白 is read <strong>slowly and formally</strong>, closer to written Chinese than daily speech — a good genre for catching every word. But it is dense with <strong>dates, place names and numbers</strong> (百年, 20世纪, 三代人); write these down as they pass, since the sentence structure alone won't help you recall them later. Words like 沧桑 carry cultural/emotional weight beyond their literal meaning — hearing them signals the tone (reflective, nostalgic) of the whole segment.</div>
<div class="callout"><span class="badge">Speaking tip</span> Practice describing a place's 变迁 using 见证 as the verb ("这座城市见证了…") — a very natural documentary-style structure for talking about change over time.</div>`,
    `<span class="eyebrow">CAV401 · Chương 5 · Phim tài liệu</span>
<h2>Phim tài liệu lịch sử - xã hội (历史社会纪录片)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>纪录片</td><td>jìlùpiàn</td><td>phim tài liệu</td></tr>
<tr><td>旁白</td><td>pángbái</td><td>lời bình, thuyết minh</td></tr>
<tr><td>史料</td><td>shǐliào</td><td>tư liệu lịch sử</td></tr>
<tr><td>变迁</td><td>biànqiān</td><td>biến đổi, thay đổi theo thời gian</td></tr>
<tr><td>见证</td><td>jiànzhèng</td><td>chứng kiến; nhân chứng</td></tr>
<tr><td>沧桑</td><td>cāngsāng</td><td>thăng trầm, dãi dầu thời gian</td></tr>
<tr><td>传承</td><td>chuánchéng</td><td>kế thừa, truyền lại</td></tr>
<tr><td>时代背景</td><td>shídài bèijǐng</td><td>bối cảnh thời đại</td></tr>
</table>
<h3>Trích lời bình (旁白选段)</h3>
<pre><code>这座古城，见证了百年来的历史变迁。
Zhè zuò gǔchéng, jiànzhèng le bǎinián lái de lìshǐ
biànqiān.
(Toà cổ thành này đã chứng kiến trăm năm biến đổi lịch sử.)

如今，老一辈的手艺仍在被年轻人传承下去。
Rújīn, lǎo yíbèi de shǒuyì réng zài bèi niánqīngrén
chuánchéng xiàqu.
(Ngày nay, tay nghề của thế hệ trước vẫn đang được người trẻ kế thừa.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> 旁白 phim tài liệu đọc <strong>chậm và trang trọng</strong>, gần văn viết hơn lời nói hằng ngày — thể loại tốt để nghe rõ từng chữ. Nhưng lại dày đặc <strong>ngày tháng, địa danh, con số</strong> (百年, 20世纪, 三代人); hãy ghi lại ngay lúc nghe vì chỉ nhớ cấu trúc câu sẽ không giúp nhớ lại số liệu sau đó. Những từ như 沧桑 mang sức nặng văn hoá/cảm xúc vượt ngoài nghĩa đen — nghe thấy chúng là dấu hiệu giọng điệu (hoài niệm, suy tư) của cả đoạn.</div>
<div class="callout"><span class="badge">Mẹo nói</span> Luyện mô tả 变迁 của một địa điểm bằng động từ 见证 ("这座城市见证了…") — cấu trúc rất tự nhiên kiểu phim tài liệu khi nói về thay đổi theo thời gian.</div>`,
  ]]);

const c5q = quiz('cav401-quiz-5', 'Quiz 5 — Documentaries|||Quiz 5 — Phim tài liệu', [
  { id: 'q1', question: '"旁白" (pángbái) trong phim tài liệu là gì?', options: ['Lời thoại của nhân vật chính', 'Lời bình/thuyết minh của người kể chuyện ngoài hình', 'Phụ đề tiếng Anh', 'Nhạc nền'], correctIndex: 1, explanation: '旁白 là lời thuyết minh/bình luận đọc ngoài hình, đặc trưng của phim tài liệu.' },
  { id: 'q2', question: 'Vì sao phim tài liệu thường khó nhớ lại nội dung nếu không ghi chú?', options: ['Vì nói quá nhanh và lộn xộn', 'Vì dày đặc ngày tháng, địa danh, con số cụ thể', 'Vì toàn dùng khẩu ngữ khó hiểu', 'Vì không có lời bình'], correctIndex: 1, explanation: '旁白 phim tài liệu chậm và rõ nhưng chứa nhiều số liệu/ngày tháng cần ghi lại ngay.' },
  { id: 'q3', question: '"传承" (chuánchéng) nghĩa là gì?', options: ['Phá bỏ truyền thống cũ', 'Kế thừa và truyền lại (một nghề, văn hoá)', 'Chứng kiến một sự kiện', 'Ghi chép tư liệu lịch sử'], correctIndex: 1, explanation: '传承 = kế thừa, truyền lại từ thế hệ này sang thế hệ khác.' },
]);

const c6 = doc('cav401-6-1-economy-tech', 'Chapter 6 — Economy & tech programs|||Chương 6 — Chương trình kinh tế & công nghệ',
  'Từ vựng: 经济增长, 人工智能, 创新, 产业链, 投资, 数字化, 竞争力, 泡沫. Mẹo nghe: bắt số liệu/phần trăm, thuật ngữ chuyên ngành.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 6 · Economy &amp; tech</span>
<h2>Economy &amp; tech programs (经济科技节目)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>经济增长</td><td>jīngjì zēngzhǎng</td><td>economic growth</td></tr>
<tr><td>人工智能</td><td>réngōng zhìnéng</td><td>artificial intelligence (AI)</td></tr>
<tr><td>创新</td><td>chuàngxīn</td><td>innovation; to innovate</td></tr>
<tr><td>产业链</td><td>chǎnyèliàn</td><td>industry chain / supply chain</td></tr>
<tr><td>投资</td><td>tóuzī</td><td>investment; to invest</td></tr>
<tr><td>数字化</td><td>shùzìhuà</td><td>digitalization</td></tr>
<tr><td>竞争力</td><td>jìngzhēnglì</td><td>competitiveness</td></tr>
<tr><td>泡沫</td><td>pàomò</td><td>bubble (economic)</td></tr>
</table>
<h3>Sample analysis (分析选段)</h3>
<pre><code>专家指出，人工智能正在重塑整个产业链。
Zhuānjiā zhǐchū, réngōng zhìnéng zhèngzài chóngsù
zhěnggè chǎnyèliàn.
(Experts point out that AI is reshaping the entire supply
chain.)

但也有观点认为，部分领域已经出现投资泡沫。
Dàn yě yǒu guāndiǎn rènwéi, bùfen lǐngyù yǐjīng chūxiàn
tóuzī pàomò.
(But some also believe that an investment bubble has
already appeared in some areas.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Economy/tech segments pack in <strong>numbers and percentages</strong> (增长3.5%, 投资额翻了一番) — practice catching digits at speed, since a single mis-heard number changes the whole meaning. Technical terms like 人工智能, 数字化 repeat often; once you lock the term, focus your attention on the verb around it (重塑, 推动, 冲击) to get the actual claim.</div>
<div class="callout"><span class="badge">Speaking tip</span> Practice stating a claim + a counterpoint, mirroring the structure above: "专家认为…，但也有观点认为…" — this balanced-view structure is exactly what an HSK5 opinion answer on economy/tech topics expects.</div>`,
    `<span class="eyebrow">CAV401 · Chương 6 · Kinh tế &amp; công nghệ</span>
<h2>Chương trình kinh tế &amp; công nghệ (经济科技节目)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>经济增长</td><td>jīngjì zēngzhǎng</td><td>tăng trưởng kinh tế</td></tr>
<tr><td>人工智能</td><td>réngōng zhìnéng</td><td>trí tuệ nhân tạo (AI)</td></tr>
<tr><td>创新</td><td>chuàngxīn</td><td>đổi mới, sáng tạo</td></tr>
<tr><td>产业链</td><td>chǎnyèliàn</td><td>chuỗi ngành, chuỗi cung ứng</td></tr>
<tr><td>投资</td><td>tóuzī</td><td>đầu tư</td></tr>
<tr><td>数字化</td><td>shùzìhuà</td><td>số hoá</td></tr>
<tr><td>竞争力</td><td>jìngzhēnglì</td><td>năng lực cạnh tranh</td></tr>
<tr><td>泡沫</td><td>pàomò</td><td>bong bóng (kinh tế)</td></tr>
</table>
<h3>Trích đoạn phân tích (分析选段)</h3>
<pre><code>专家指出，人工智能正在重塑整个产业链。
Zhuānjiā zhǐchū, réngōng zhìnéng zhèngzài chóngsù
zhěnggè chǎnyèliàn.
(Chuyên gia chỉ ra rằng trí tuệ nhân tạo đang định hình lại toàn bộ chuỗi ngành.)

但也有观点认为，部分领域已经出现投资泡沫。
Dàn yě yǒu guāndiǎn rènwéi, bùfen lǐngyù yǐjīng chūxiàn
tóuzī pàomò.
(Nhưng cũng có quan điểm cho rằng một số lĩnh vực đã xuất hiện bong bóng đầu tư.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Chương trình kinh tế/công nghệ dồn dập <strong>số liệu và phần trăm</strong> (增长3.5%, 投资额翻了一番) — luyện bắt con số ở tốc độ nhanh, vì nghe nhầm một số là hiểu sai cả ý. Thuật ngữ như 人工智能, 数字化 lặp lại nhiều; khi đã chắc thuật ngữ, hãy tập trung vào động từ đi kèm (重塑, 推动, 冲击) để nắm đúng luận điểm.</div>
<div class="callout"><span class="badge">Mẹo nói</span> Luyện nêu một nhận định + một ý phản biện theo đúng khung trên: "专家认为…，但也有观点认为…" — cấu trúc nhìn hai chiều này chính là điều một câu trả lời quan điểm HSK5 về kinh tế/công nghệ cần có.</div>`,
  ]]);

const c6q = quiz('cav401-quiz-6', 'Quiz 6 — Economy & tech|||Quiz 6 — Kinh tế & công nghệ', [
  { id: 'q1', question: '"产业链" (chǎnyèliàn) nghĩa là gì?', options: ['Bong bóng kinh tế', 'Chuỗi ngành, chuỗi cung ứng', 'Năng lực cạnh tranh', 'Trí tuệ nhân tạo'], correctIndex: 1, explanation: '产业链 = chuỗi ngành/cung ứng, khác với 泡沫 (bong bóng) hay 竞争力 (năng lực cạnh tranh).' },
  { id: 'q2', question: 'Khi nghe một chương trình kinh tế có nhiều số liệu, nên tập trung vào điều gì để không hiểu sai?', options: ['Chỉ nghe thuật ngữ chuyên ngành', 'Nghe chính xác con số/phần trăm vì một số sai làm đổi cả ý', 'Bỏ qua số liệu, chỉ nghe kết luận', 'Chỉ cần nhớ tên chương trình'], correctIndex: 1, explanation: 'Số liệu/phần trăm rất dày trong chương trình kinh tế; nghe sai một số làm sai lệch cả ý nghĩa.' },
  { id: 'q3', question: 'Cấu trúc "专家认为…，但也有观点认为…" dùng để thể hiện điều gì?', options: ['Một quan điểm duy nhất, không phản biện', 'Đưa một nhận định rồi đưa ý kiến trái chiều', 'Kết luận cuối cùng của bản tin', 'Số liệu thống kê chính xác'], correctIndex: 1, explanation: 'Cấu trúc này đưa hai chiều quan điểm: nhận định chính rồi ý kiến phản biện, dùng phổ biến khi bàn kinh tế/công nghệ.' },
]);

const c7 = doc('cav401-7-1-arts-culture', 'Chapter 7 — Arts, music & pop culture|||Chương 7 — Nghệ thuật, âm nhạc & văn hoá đại chúng',
  'Từ vựng: 流行文化, 歌词, 旋律, 展览, 审美, 网红, 走红, 传统文化. Mẹo nghe: bắt từ lóng/hot trend, phân biệt nói-hát.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 7 · Arts &amp; culture</span>
<h2>Arts, music &amp; pop culture (艺术音乐与大众文化)</h2>
<h3>Vocabulary (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>流行文化</td><td>liúxíng wénhuà</td><td>pop culture</td></tr>
<tr><td>歌词</td><td>gēcí</td><td>song lyrics</td></tr>
<tr><td>旋律</td><td>xuánlǜ</td><td>melody</td></tr>
<tr><td>展览</td><td>zhǎnlǎn</td><td>exhibition</td></tr>
<tr><td>审美</td><td>shěnměi</td><td>aesthetic sense / taste</td></tr>
<tr><td>网红</td><td>wǎnghóng</td><td>internet celebrity / influencer</td></tr>
<tr><td>走红</td><td>zǒuhóng</td><td>to become popular / go viral</td></tr>
<tr><td>传统文化</td><td>chuántǒng wénhuà</td><td>traditional culture</td></tr>
</table>
<h3>Sample interview (采访选段)</h3>
<pre><code>记者: 这首歌为什么突然走红了？
Jìzhě: Zhè shǒu gē wèishénme tūrán zǒuhóng le?
(Reporter: Why did this song suddenly go viral?)

歌手: 我觉得是歌词写出了年轻人的心声，
      加上旋律很上口。
Gēshǒu: Wǒ juéde shì gēcí xiěchū le niánqīngrén de
xīnshēng, jiāshang xuánlǜ hěn shàngkǒu.
(Singer: I think the lyrics captured what young people
feel, plus the melody is very catchy.)
</code></pre>
<div class="callout"><span class="badge">Listening tip</span> Pop culture segments mix <strong>formal interview Chinese</strong> with <strong>internet slang</strong> (网红, 走红, 上口, 出圈) that changes fast — if a word isn't in your dictionary, it may be a recent buzzword; note it and check later. In music clips, distinguish 歌词 (sung, stretched, harder to catch) from the surrounding 旁白/采访 (spoken, normal speed) — don't expect to catch every sung word on first listen.</div>
<div class="callout"><span class="badge">Speaking tip</span> Practice explaining why something 走红了 using cause + effect: "因为…，所以…走红了" — a natural way to discuss trends, songs, or influencers in conversation.</div>`,
    `<span class="eyebrow">CAV401 · Chương 7 · Nghệ thuật &amp; văn hoá</span>
<h2>Nghệ thuật, âm nhạc &amp; văn hoá đại chúng (艺术音乐与大众文化)</h2>
<h3>Từ vựng (生词)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>流行文化</td><td>liúxíng wénhuà</td><td>văn hoá đại chúng</td></tr>
<tr><td>歌词</td><td>gēcí</td><td>lời bài hát</td></tr>
<tr><td>旋律</td><td>xuánlǜ</td><td>giai điệu</td></tr>
<tr><td>展览</td><td>zhǎnlǎn</td><td>triển lãm</td></tr>
<tr><td>审美</td><td>shěnměi</td><td>gu thẩm mỹ</td></tr>
<tr><td>网红</td><td>wǎnghóng</td><td>người nổi tiếng mạng, KOL</td></tr>
<tr><td>走红</td><td>zǒuhóng</td><td>nổi tiếng, trở nên viral</td></tr>
<tr><td>传统文化</td><td>chuántǒng wénhuà</td><td>văn hoá truyền thống</td></tr>
</table>
<h3>Trích phỏng vấn (采访选段)</h3>
<pre><code>记者: 这首歌为什么突然走红了？
Jìzhě: Zhè shǒu gē wèishénme tūrán zǒuhóng le?
(Phóng viên: Vì sao bài hát này đột nhiên trở nên nổi tiếng?)

歌手: 我觉得是歌词写出了年轻人的心声，
      加上旋律很上口。
Gēshǒu: Wǒ juéde shì gēcí xiěchū le niánqīngrén de
xīnshēng, jiāshang xuánlǜ hěn shàngkǒu.
(Ca sĩ: Tôi nghĩ là do lời bài hát nói đúng tiếng lòng người trẻ, cộng với giai điệu rất dễ nhớ.)
</code></pre>
<div class="callout"><span class="badge">Mẹo nghe</span> Đoạn về văn hoá đại chúng trộn <strong>tiếng Trung phỏng vấn trang trọng</strong> với <strong>từ lóng mạng</strong> (网红, 走红, 上口, 出圈) đổi rất nhanh — nếu một từ không có trong từ điển, có thể đó là từ hot gần đây; ghi lại và tra sau. Trong đoạn nhạc, hãy phân biệt 歌词 (được hát, kéo dài, khó bắt hơn) với phần 旁白/采访 xung quanh (nói, tốc độ bình thường) — đừng kỳ vọng nghe rõ mọi lời hát ngay lần đầu.</div>
<div class="callout"><span class="badge">Mẹo nói</span> Luyện giải thích vì sao một thứ 走红了 theo khung nhân-quả: "因为…，所以…走红了" — cách nói tự nhiên khi bàn về trend, bài hát hay người nổi tiếng mạng.</div>`,
  ]]);

const c7q = quiz('cav401-quiz-7', 'Quiz 7 — Arts & pop culture|||Quiz 7 — Nghệ thuật & văn hoá đại chúng', [
  { id: 'q1', question: '"走红" (zǒuhóng) nghĩa là gì?', options: ['Bị chê bai', 'Trở nên nổi tiếng, viral', 'Ngừng hoạt động', 'Tổ chức triển lãm'], correctIndex: 1, explanation: '走红 = nổi lên, trở nên nổi tiếng/viral, thường dùng cho bài hát, người nổi tiếng mạng.' },
  { id: 'q2', question: 'Vì sao phần 歌词 (lời hát) trong một video ca nhạc thường khó nghe hơn phần phỏng vấn?', options: ['Vì lời hát dùng từ khó hơn nhiều', 'Vì lời hát được hát/kéo dài khác với tốc độ nói chuyện bình thường', 'Vì không có phụ đề', 'Vì ca sĩ luôn nói giọng địa phương'], correctIndex: 1, explanation: '歌词 được hát và kéo dài âm khác với lời nói bình thường trong 旁白/采访, nên khó bắt hơn.' },
  { id: 'q3', question: '"网红" (wǎnghóng) chỉ đối tượng nào?', options: ['Nhà báo truyền hình', 'Người nổi tiếng trên mạng, KOL', 'Ca sĩ truyền thống', 'Nhân vật trong phim tài liệu'], correctIndex: 1, explanation: '网红 = người nổi tiếng nhờ mạng xã hội, tương đương "influencer/KOL".' },
]);

const c8 = doc('cav401-8-1-review', 'Chapter 8 — Review: long-form listening, commentary & rebuttal|||Chương 8 — Ôn tập: nghe dài, bình luận & thuyết trình phản biện',
  'Tổng ôn 7 chương: kết hợp phim/thời sự/tranh luận/diễn thuyết/tài liệu/kinh tế/văn hoá trong một bài nghe dài; khung thuyết trình phản biện HSK5.',
  [[
    `<span class="eyebrow">CAV401 · Chapter 8 · Review</span>
<h2>Review: long-form listening, commentary &amp; rebuttal presentation (综合复习)</h2>
<h3>Vocabulary review (综合词汇)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>meaning</th></tr>
<tr><td>综合运用</td><td>zònghé yùnyòng</td><td>to apply comprehensively</td></tr>
<tr><td>思辨</td><td>sībiàn</td><td>critical thinking</td></tr>
<tr><td>论证</td><td>lùnzhèng</td><td>argumentation; to argue a case</td></tr>
<tr><td>总结陈词</td><td>zǒngjié chéncí</td><td>closing statement</td></tr>
<tr><td>正方 / 反方</td><td>zhèngfāng / fǎnfāng</td><td>affirmative side / opposing side</td></tr>
<tr><td>提纲</td><td>tígāng</td><td>outline</td></tr>
</table>
<h3>Long-form listening strategy (长篇听力策略)</h3>
<p>A HSK5-level long clip usually mixes genres in one segment: a news lead-in (据报道…), a documentary-style 旁白, then an interview or debate exchange. Build one habit across all seven chapters: <strong>identify the genre first</strong> (news / movie / debate / speech / documentary / economy / culture), since that tells you what register and speed to expect, then apply that chapter's specific listening tip.</p>
<h3>Rebuttal presentation skeleton (反驳演讲结构)</h3>
<pre><code>1. 开场白 — state the topic in one sentence
2. 论点 — your position (正方/反方)
3. 论据 + 举例 — evidence and a concrete example
4. 反驳 — address the strongest opposing point:
   "有人认为…，但是…"
5. 总结陈词 — restate your 论点 in one sentence
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> In an HSK5 speaking or listening-response task, examiners reward a clear <strong>提纲</strong> (outline) more than raw vocabulary — even a simple 5-line structure like above, spoken clearly, out-scores a rambling answer stuffed with advanced words.</div>`,
    `<span class="eyebrow">CAV401 · Chương 8 · Ôn tập</span>
<h2>Ôn tập: nghe dài, bình luận &amp; thuyết trình phản biện (综合复习)</h2>
<h3>Từ vựng tổng hợp (综合词汇)</h3>
<table>
<tr><th>汉字</th><th>pīnyīn</th><th>Nghĩa</th></tr>
<tr><td>综合运用</td><td>zònghé yùnyòng</td><td>vận dụng tổng hợp</td></tr>
<tr><td>思辨</td><td>sībiàn</td><td>tư duy phản biện</td></tr>
<tr><td>论证</td><td>lùnzhèng</td><td>lập luận, luận chứng</td></tr>
<tr><td>总结陈词</td><td>zǒngjié chéncí</td><td>lời kết luận</td></tr>
<tr><td>正方 / 反方</td><td>zhèngfāng / fǎnfāng</td><td>bên chính / bên phản đối</td></tr>
<tr><td>提纲</td><td>tígāng</td><td>dàn ý, đề cương</td></tr>
</table>
<h3>Chiến lược nghe bài dài (长篇听力策略)</h3>
<p>Một đoạn nghe dài mức HSK5 thường trộn nhiều thể loại trong một bài: mở đầu kiểu thời sự (据报道…), 旁白 kiểu phim tài liệu, rồi đoạn phỏng vấn hoặc tranh luận. Xây một thói quen chung cho cả bảy chương: <strong>nhận diện thể loại trước tiên</strong> (thời sự / phim / tranh luận / diễn thuyết / tài liệu / kinh tế / văn hoá), vì điều đó cho biết văn phong và tốc độ cần chờ đợi, rồi áp dụng mẹo nghe riêng của chương đó.</p>
<h3>Khung thuyết trình phản biện (反驳演讲结构)</h3>
<pre><code>1. 开场白 — nêu chủ đề trong một câu
2. 论点 — lập trường của bạn (正方/反方)
3. 论据 + 举例 — bằng chứng và một ví dụ cụ thể
4. 反驳 — xử lý luận điểm phản đối mạnh nhất:
   "有人认为…，但是…"
5. 总结陈词 — nhắc lại 论点 trong một câu
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Trong phần thi nói hoặc trả lời sau khi nghe của HSK5, giám khảo đánh giá cao một <strong>提纲</strong> (dàn ý) rõ ràng hơn là từ vựng cao cấp thuần tuý — dù chỉ là khung 5 dòng như trên, nói rõ ràng vẫn ăn điểm hơn một câu trả lời lan man nhồi nhét từ khó.</div>`,
  ]]);

const c8q = quiz('cav401-quiz-8', 'Quiz 8 — Final review|||Quiz 8 — Ôn tập tổng hợp', [
  { id: 'q1', question: 'Khi gặp một bài nghe dài trộn nhiều thể loại, bước đầu tiên nên làm gì?', options: ['Ghi lại toàn bộ nguyên văn', 'Nhận diện thể loại đang nghe (thời sự/phim/tranh luận/…) để biết văn phong và tốc độ', 'Bỏ qua phần đầu vì thường không quan trọng', 'Chỉ nghe phần có nhạc nền'], correctIndex: 1, explanation: 'Nhận diện thể loại trước giúp áp dụng đúng mẹo nghe của từng chương (tốc độ, văn phong, từ vựng).' },
  { id: 'q2', question: 'Trong khung thuyết trình phản biện, bước "反驳" nằm ở vị trí nào?', options: ['Ngay sau 开场白, trước cả 论点', 'Sau 论据 + 举例, trước 总结陈词', 'Là bước đầu tiên của toàn bài', 'Không cần có trong bài thuyết trình'], correctIndex: 1, explanation: 'Khung chuẩn: 开场白 → 论点 → 论据+举例 → 反驳 → 总结陈词.' },
  { id: 'q3', question: 'Theo mẹo thi HSK5, điều gì thường được đánh giá cao hơn từ vựng cao cấp?', options: ['Nói càng nhanh càng tốt', 'Một dàn ý (提纲) rõ ràng, mạch lạc', 'Dùng càng nhiều thành ngữ càng tốt', 'Trả lời càng dài càng tốt'], correctIndex: 1, explanation: 'Giám khảo đánh giá cao một 提纲 rõ ràng hơn là nhồi nhét từ khó mà thiếu mạch lạc.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CAV401',
    slug: 'cav401-chinese-advanced-audio-visual-listening-speaking-2',
    title: 'Chinese Advanced Audio-Visual Listening & Speaking 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CAV401.webp',
    shortDescription: 'HSK5 audio-visual listening & speaking, continuing CAV301: movies, CCTV news, TV debates, TED-style speeches, documentaries, economy/tech programs, arts & pop culture, plus a final review of long-form listening & rebuttal presentation.|||Nghe-nhìn-nói tiếng Trung HSK5, nối tiếp CAV301: phim, thời sự CCTV, tranh luận truyền hình, diễn thuyết TED, phim tài liệu, kinh tế/công nghệ, nghệ thuật/văn hoá, và ôn tập nghe dài + thuyết trình phản biện.',
    description: 'Môn <strong>CAV401 — Chinese Advanced Audio-Visual Listening &amp; Speaking 2</strong> (Nghe - Nhìn - Nói tiếng Trung Nâng cao 2, kỳ 4) nối tiếp <strong>CAV301</strong>, nâng trình độ nghe-nhìn từ HSK4 lên <strong>HSK5</strong>. Thay vì hội thoại ngắn phát âm rõ, môn dùng tài liệu thật: <strong>phim điện ảnh</strong> (phân tích lời thoại), <strong>thời sự CCTV</strong> (bản tin chuyên sâu), <strong>tranh luận &amp; talk show truyền hình</strong>, <strong>diễn thuyết kiểu TED</strong>, <strong>phim tài liệu lịch sử-xã hội</strong>, <strong>chương trình kinh tế &amp; công nghệ</strong>, <strong>nghệ thuật, âm nhạc &amp; văn hoá đại chúng</strong>, và một chương <strong>ôn tập tổng hợp</strong> luyện nghe dài cùng thuyết trình phản biện. Bám giáo trình 高级视听说 (BLCU Press), mỗi chương có văn bản mẫu song ngữ (汉字 + pinyin + nghĩa), từ vựng, mẹo nghe-nói, và quiz.',
    whatYouLearn: 'Phân tích lời thoại phim (台词, 潜台词, 伏笔); công thức bản tin CCTV (据…报道, 数据显示); ngôn ngữ tranh luận & ngắt lời (反驳, 打断, 立场); khung diễn thuyết (开场白→论点→举例→呼吁); nghe旁白 phim tài liệu (变迁, 见证, 传承); từ vựng & số liệu kinh tế/công nghệ (人工智能, 产业链, 泡沫); từ lóng văn hoá đại chúng (网红, 走红); kỹ năng nghe dài đa thể loại và xây bài thuyết trình phản biện (论点→论据→反驳→总结陈词) mức HSK5.',
    requirements: 'Đã hoàn thành CAV301 (hoặc tương đương HSK4 nghe-nói). Nên có từ điển Pleco/hanzii để tra chữ khi luyện với tài liệu thật.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình 高级视听说, nguồn phim/thời sự/TED thật, từ điển, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CAV301, nâng HSK4→HSK5, lộ trình 8 chương theo thể loại.', lessons: [intro] },
    { title: 'Chương 1 — Phim & lời thoại|||Chapter 1 — Movies & dialogue', description: 'Phân tích 台词, 潜台词, 伏笔; giọng điệu và câu rút gọn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thời sự & bản tin|||Chapter 2 — News & reports', description: 'Công thức bản tin CCTV, ghi chú 5W.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tranh luận & talk show|||Chapter 3 — Debate & talk show', description: 'Ngắt lời, phản bác, giữ lập trường.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Diễn thuyết & TED|||Chapter 4 — Speeches & TED', description: 'Khung mở-luận điểm-ví dụ-kết, từ nối chuyển ý.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phim tài liệu|||Chapter 5 — Documentaries', description: 'Nghe旁白 chậm trang trọng, số liệu, ẩn dụ văn hoá.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kinh tế & công nghệ|||Chapter 6 — Economy & tech', description: 'Số liệu/phần trăm, thuật ngữ chuyên ngành.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nghệ thuật & văn hoá|||Chapter 7 — Arts & culture', description: 'Từ lóng, hot trend, phân biệt nói-hát.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập tổng hợp|||Chapter 8 — Final review', description: 'Nghe dài đa thể loại, khung thuyết trình phản biện.', lessons: [c8, c8q] },
  ],
};
