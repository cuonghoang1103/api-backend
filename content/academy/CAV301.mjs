/**
 * CAV301 — Chinese Advanced Audio-Visual Listening & Speaking 1. Ngành Ngôn
 * ngữ Trung, FPTU, Kỳ 3, trình độ HSK4. Giáo trình tham khảo: "视听说教程"
 * (Chinese Audio-Visual-Speaking Course, 北京语言大学出版社) + phóng sự CCTV.
 * 8 chương nghe-nhìn: hội thoại phim → tin tức → quảng cáo → talk show →
 * phim tài liệu → du lịch/ẩm thực → vlog → ôn tập nghe đoạn dài.
 * Giữ NGUYÊN slug/semester/thumbnailUrl/courseCode. ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('cav301-1-1-drama-dialogue', 'Chapter 1 — Everyday drama dialogue listening|||Chương 1 — Nghe hiểu hội thoại phim đời thường',
  'Nghe hội thoại phim/truyền hình đời thường tốc độ tự nhiên; nhận diện từ nối chuyển ý (然后/那/所以).',
  [[
    `<span class="eyebrow">CAV301 · Chapter 1 · Lesson 1.1</span>
<h2>Everyday drama dialogue listening</h2>
<p class="lead">This chapter trains you to follow <strong>natural-speed conversations</strong> from everyday-life TV dramas — casual tone, contractions, and filler words that textbook audio never has.</p>
<h3>Sample dialogue</h3>
<pre><code>A: 你周末打算做什么?
   Nǐ zhōumò dǎsuàn zuò shénme?
   (What are you planning to do this weekend?)
B: 我打算去超市买点儿东西,然后在家看电视剧。
   Wǒ dǎsuàn qù chāoshì mǎi diǎnr dōngxi, ránhòu zài jiā kàn diànshìjù.
   (I'm planning to go to the supermarket to buy some things, then watch a TV drama at home.)
A: 那部电视剧真的很好看,我也想看。
   Nà bù diànshìjù zhēn de hěn hǎokàn, wǒ yě xiǎng kàn.
   (That TV drama is really good, I want to watch it too.)
B: 那你周六下午来我家吧,我们一起看!
   Nà nǐ zhōuliù xiàwǔ lái wǒ jiā ba, wǒmen yìqǐ kàn!
   (Then come to my place Saturday afternoon, let's watch it together!)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>打算   dǎsuàn      to plan / intend
超市   chāoshì     supermarket
电视剧 diànshìjù   TV drama
好看   hǎokàn      good-looking, enjoyable (of a show)
然后   ránhòu      then, after that
一起   yìqǐ        together
</code></pre>
<h3>Listening &amp; speaking tips</h3>
<ul>
<li>Casual dialogue drops formal connectives — listen for <strong>然后 / 那 / 所以</strong> as the signal that the speaker is shifting to a new idea.</li>
<li>Shadow the lines out loud right after listening, matching rhythm and rising/falling intonation of casual speech, not textbook-flat tone.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Watch a 2–3 minute slice of a Chinese sitcom without subtitles first, write down every word you catch, then check with subtitles.</div>`,
    `<span class="eyebrow">CAV301 · Chương 1 · Bài 1.1</span>
<h2>Nghe hiểu hội thoại phim đời thường</h2>
<p class="lead">Chương này luyện nghe <strong>hội thoại tốc độ tự nhiên</strong> trong phim truyền hình đời thường — giọng thân mật, nói tắt, từ đệm mà băng giáo trình không có.</p>
<h3>Đoạn hội thoại mẫu</h3>
<pre><code>A: 你周末打算做什么?
   Nǐ zhōumò dǎsuàn zuò shénme?
   (Cuối tuần bạn định làm gì?)
B: 我打算去超市买点儿东西,然后在家看电视剧。
   Wǒ dǎsuàn qù chāoshì mǎi diǎnr dōngxi, ránhòu zài jiā kàn diànshìjù.
   (Tôi định đi siêu thị mua ít đồ, sau đó ở nhà xem phim truyền hình.)
A: 那部电视剧真的很好看,我也想看。
   Nà bù diànshìjù zhēn de hěn hǎokàn, wǒ yě xiǎng kàn.
   (Bộ phim đó thực sự rất hay, tôi cũng muốn xem.)
B: 那你周六下午来我家吧,我们一起看!
   Nà nǐ zhōuliù xiàwǔ lái wǒ jiā ba, wǒmen yìqǐ kàn!
   (Vậy chiều thứ Bảy bạn đến nhà tôi nhé, chúng ta cùng xem!)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>打算   dǎsuàn      dự định, định làm
超市   chāoshì     siêu thị
电视剧 diànshìjù   phim truyền hình
好看   hǎokàn      hay, đẹp (về phim/chương trình)
然后   ránhòu      sau đó, rồi thì
一起   yìqǐ        cùng nhau
</code></pre>
<h3>Mẹo nghe - nói</h3>
<ul>
<li>Hội thoại đời thường bỏ bớt liên từ trang trọng — chú ý <strong>然后 / 那 / 所以</strong> như tín hiệu chuyển sang ý mới.</li>
<li>Nhại lại (shadowing) câu thoại ngay sau khi nghe, bám đúng nhịp và ngữ điệu lên xuống tự nhiên, không đọc phẳng như sách giáo trình.</li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Xem 2-3 phút một đoạn phim sitcom Trung Quốc không phụ đề trước, ghi lại mọi từ nghe được, rồi đối chiếu với phụ đề.</div>`,
  ]]);

const c1q = quiz('cav301-quiz-1', 'Quiz 1 — Everyday drama listening|||Quiz 1 — Nghe hội thoại phim đời thường', [
  { id: 'q1', question: '"电视剧" (diànshìjù) có nghĩa là gì?', options: ['Siêu thị', 'Phim truyền hình', 'Cuối tuần', 'Nhà hàng'], correctIndex: 1, explanation: '电视剧 (diànshìjù) = phim truyền hình / TV drama.' },
  { id: 'q2', question: 'Trong hội thoại đời thường, từ nào thường báo hiệu người nói đang CHUYỂN sang ý mới?', options: ['好看', '电视剧', '然后', '周末'], correctIndex: 2, explanation: '然后 (ránhòu, "sau đó") là liên từ chuyển ý phổ biến trong khẩu ngữ.' },
  { id: 'q3', question: '"打算" (dǎsuàn) nghĩa là gì?', options: ['Đã xong', 'Dự định, định làm', 'Không muốn', 'Rất thích'], correctIndex: 1, explanation: '打算 (dǎsuàn) = dự định, có ý định làm gì đó.' },
]);

const c2 = doc('cav301-2-1-news-report', 'Chapter 2 — TV news reports & short bulletins|||Chương 2 — Phóng sự & tin tức truyền hình ngắn',
  'Cấu trúc bản tin (mở đầu cố định, dẫn tin), từ vựng thời sự; tóm tắt theo 5W (ai/gì/khi nào/ở đâu/tại sao).',
  [[
    `<span class="eyebrow">CAV301 · Chapter 2 · Lesson 2.1</span>
<h2>TV news reports &amp; short bulletins</h2>
<p class="lead">News broadcasts follow a <strong>fixed structure</strong> and formal register. Learning the opening formulas lets you catch the topic in the first few seconds, even before understanding every word.</p>
<h3>Sample news segment</h3>
<pre><code>主持人: 各位观众,大家好,欢迎收看今天的新闻。
        Zhǔchírén: Gèwèi guānzhòng, dàjiā hǎo, huānyíng shōukàn jīntiān de xīnwén.
        (Anchor: Dear viewers, welcome to today's news.)
记者:   据报道,本市今天上午举行了一场文化交流活动,
        吸引了上千名市民参加。
        Jìzhě: Jù bàodào, běn shì jīntiān shàngwǔ jǔxíngle yì chǎng wénhuà
        jiāoliú huódòng, xīyǐnle shàng qiān míng shìmín cānjiā.
        (Reporter: According to reports, the city held a cultural exchange
        event this morning, attracting over a thousand citizens.)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>据报道 jù bàodào   according to reports
举行   jǔxíng      to hold (an event)
吸引   xīyǐn       to attract
市民   shìmín      city resident, citizen
记者   jìzhě       reporter, journalist
</code></pre>
<h3>Listening &amp; speaking tips</h3>
<ul>
<li>News opens with fixed formulas (<strong>各位观众 / 据报道</strong>) — memorize them so your ear locks onto the actual content that follows.</li>
<li>Summarize each segment using <strong>5W</strong>: who (谁), what (什么事), when (什么时候), where (哪里), why (为什么).</li>
</ul>
<div class="callout"><span class="badge">Practice</span> After one CCTV news clip, retell it in 3 sentences using only the 5W facts — no opinions.</div>`,
    `<span class="eyebrow">CAV301 · Chương 2 · Bài 2.1</span>
<h2>Phóng sự &amp; tin tức truyền hình ngắn</h2>
<p class="lead">Bản tin thời sự có <strong>cấu trúc cố định</strong> và văn phong trang trọng. Nắm được các câu mở đầu quen thuộc giúp bạn bắt được chủ đề ngay trong vài giây đầu, dù chưa hiểu hết từng từ.</p>
<h3>Đoạn tin tức mẫu</h3>
<pre><code>主持人: 各位观众,大家好,欢迎收看今天的新闻。
        Zhǔchírén: Gèwèi guānzhòng, dàjiā hǎo, huānyíng shōukàn jīntiān de xīnwén.
        (MC: Kính chào quý khán giả, hoan nghênh đón xem bản tin hôm nay.)
记者:   据报道,本市今天上午举行了一场文化交流活动,
        吸引了上千名市民参加。
        Jìzhě: Jù bàodào, běn shì jīntiān shàngwǔ jǔxíngle yì chǎng wénhuà
        jiāoliú huódòng, xīyǐnle shàng qiān míng shìmín cānjiā.
        (Phóng viên: Theo tin đưa, sáng nay thành phố đã tổ chức một hoạt
        động giao lưu văn hóa, thu hút hơn một nghìn người dân tham gia.)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>据报道 jù bàodào   theo tin đưa, theo báo cáo
举行   jǔxíng      tổ chức (một sự kiện)
吸引   xīyǐn       thu hút
市民   shìmín      người dân thành phố
记者   jìzhě       phóng viên, nhà báo
</code></pre>
<h3>Mẹo nghe - nói</h3>
<ul>
<li>Bản tin luôn mở đầu bằng công thức cố định (<strong>各位观众 / 据报道</strong>) — thuộc lòng để tai bắt ngay vào nội dung chính phía sau.</li>
<li>Tóm tắt mỗi đoạn tin theo <strong>5W</strong>: ai (谁), việc gì (什么事), khi nào (什么时候), ở đâu (哪里), vì sao (为什么).</li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Sau một đoạn tin CCTV, kể lại bằng 3 câu chỉ dùng dữ kiện 5W — không thêm ý kiến cá nhân.</div>`,
  ]]);

const c2q = quiz('cav301-quiz-2', 'Quiz 2 — News reports & bulletins|||Quiz 2 — Phóng sự & tin tức', [
  { id: 'q1', question: 'Cụm "据报道" (jù bàodào) dùng để làm gì trong bản tin?', options: ['Chào tạm biệt khán giả', 'Dẫn nguồn tin, "theo báo cáo/tin đưa"', 'Hỏi ý kiến khán giả', 'Giới thiệu quảng cáo'], correctIndex: 1, explanation: '据报道 = "theo tin đưa/theo báo cáo", công thức mở đầu dẫn nguồn tin thường gặp.' },
  { id: 'q2', question: 'Khi tóm tắt một bản tin, khung 5W KHÔNG bao gồm yếu tố nào?', options: ['Ai (谁)', 'Khi nào (什么时候)', 'Cảm nhận cá nhân của người nghe', 'Ở đâu (哪里)'], correctIndex: 2, explanation: '5W là ai/gì/khi nào/ở đâu/tại sao — sự kiện khách quan, không gồm cảm nhận cá nhân.' },
  { id: 'q3', question: '"记者" (jìzhě) nghĩa là gì?', options: ['Khán giả', 'Người dẫn chương trình', 'Phóng viên', 'Diễn viên'], correctIndex: 2, explanation: '记者 (jìzhě) = phóng viên, nhà báo.' },
]);

const c3 = doc('cav301-3-1-ads-promo', 'Chapter 3 — Advertisements & promotional videos|||Chương 3 — Quảng cáo & video giới thiệu',
  'Ngôn ngữ quảng cáo: câu hỏi tu từ, khẩu hiệu vần điệu, từ khóa lợi ích sản phẩm.',
  [[
    `<span class="eyebrow">CAV301 · Chapter 3 · Lesson 3.1</span>
<h2>Advertisements &amp; promotional videos</h2>
<p class="lead">Ad scripts are short, punchy, and built to be remembered — rhetorical questions, catchy slogans, and repeated product-benefit keywords.</p>
<h3>Sample ad script</h3>
<pre><code>您还在为选择而烦恼吗?我们的新产品,
让您的生活更轻松、更美好!
Nín hái zài wèi xuǎnzé ér fánnǎo ma? Wǒmen de xīn chǎnpǐn,
ràng nín de shēnghuó gèng qīngsōng, gèng měihǎo!
(Still troubled by too many choices? Our new product makes
your life easier and better!)

心动不如行动,现在就来体验吧!
Xīndòng bùrú xíngdòng, xiànzài jiù lái tǐyàn ba!
(Feeling tempted is not as good as acting — come experience it now!)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>烦恼       fánnǎo            troubled, worried
产品       chǎnpǐn           product
轻松       qīngsōng          relaxed, effortless
心动不如行动 xīndòng bùrú xíngdòng  "feeling tempted beats just thinking" (catchy slogan idiom)
体验       tǐyàn             to experience
</code></pre>
<h3>Listening &amp; speaking tips</h3>
<ul>
<li>Ads open with a <strong>rhetorical question</strong> (还在为...烦恼吗?) to hook the viewer — listen for the question mark tone, then catch the product name right after.</li>
<li>Slogans rhyme and repeat structure (更轻松、更美好) — practice saying them fast and evenly, the way a voice-over artist would.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Pick a Chinese TV commercial, write down its slogan, then create your own product ad using the same 心动不如行动 pattern.</div>`,
    `<span class="eyebrow">CAV301 · Chương 3 · Bài 3.1</span>
<h2>Quảng cáo &amp; video giới thiệu</h2>
<p class="lead">Lời thoại quảng cáo ngắn gọn, dễ nhớ — câu hỏi tu từ, khẩu hiệu có vần, và từ khóa lợi ích sản phẩm được lặp lại.</p>
<h3>Lời quảng cáo mẫu</h3>
<pre><code>您还在为选择而烦恼吗?我们的新产品,
让您的生活更轻松、更美好!
Nín hái zài wèi xuǎnzé ér fánnǎo ma? Wǒmen de xīn chǎnpǐn,
ràng nín de shēnghuó gèng qīngsōng, gèng měihǎo!
(Bạn vẫn còn băn khoăn vì phải lựa chọn? Sản phẩm mới của
chúng tôi sẽ khiến cuộc sống bạn nhẹ nhàng hơn, tốt đẹp hơn!)

心动不如行动,现在就来体验吧!
Xīndòng bùrú xíngdòng, xiànzài jiù lái tǐyàn ba!
(Rung động không bằng hành động, hãy đến trải nghiệm ngay bây giờ!)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>烦恼       fánnǎo            phiền não, băn khoăn
产品       chǎnpǐn           sản phẩm
轻松       qīngsōng          nhẹ nhàng, thoải mái
心动不如行动 xīndòng bùrú xíngdòng  "rung động không bằng hành động" (thành ngữ khẩu hiệu)
体验       tǐyàn             trải nghiệm
</code></pre>
<h3>Mẹo nghe - nói</h3>
<ul>
<li>Quảng cáo mở đầu bằng <strong>câu hỏi tu từ</strong> (还在为...烦恼吗?) để lôi kéo người xem — chú ý ngữ điệu câu hỏi rồi bắt ngay tên sản phẩm phía sau.</li>
<li>Khẩu hiệu có vần và cấu trúc lặp (更轻松、更美好) — luyện đọc nhanh, đều nhịp như giọng lồng tiếng quảng cáo.</li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Chọn một quảng cáo truyền hình Trung Quốc, chép lại khẩu hiệu, rồi tự đặt một khẩu hiệu sản phẩm khác theo mẫu 心动不如行动.</div>`,
  ]]);

const c3q = quiz('cav301-quiz-3', 'Quiz 3 — Ads & promo videos|||Quiz 3 — Quảng cáo & video giới thiệu', [
  { id: 'q1', question: 'Quảng cáo thường mở đầu bằng loại câu nào để lôi kéo người xem?', options: ['Câu mệnh lệnh', 'Câu hỏi tu từ', 'Câu cảm thán dài', 'Câu kể chuyện lịch sử'], correctIndex: 1, explanation: 'Quảng cáo hay mở đầu bằng câu hỏi tu từ kiểu "您还在为...烦恼吗?" để gợi vấn đề của khách hàng.' },
  { id: 'q2', question: '"体验" (tǐyàn) nghĩa là gì?', options: ['Trải nghiệm', 'Phiền não', 'Sản phẩm', 'Nhẹ nhàng'], correctIndex: 0, explanation: '体验 (tǐyàn) = trải nghiệm.' },
  { id: 'q3', question: 'Thành ngữ khẩu hiệu "心动不如行动" gần nghĩa với câu nào?', options: ['Nói ít làm nhiều', 'Rung động không bằng hành động, hãy hành động ngay', 'Im lặng là vàng', 'Có công mài sắt có ngày nên kim'], correctIndex: 1, explanation: '心动不如行动 (xīndòng bùrú xíngdòng) nghĩa đen là "rung động không bằng hành động" — khẩu hiệu thúc giục hành động ngay.' },
]);

const c4 = doc('cav301-4-1-talk-show-interview', 'Chapter 4 — Talk shows & TV interviews|||Chương 4 — Talk show & phỏng vấn truyền hình',
  'Nhịp hỏi-đáp của MC/khách mời; câu hỏi mở, cách trả lời có dẫn dắt.',
  [[
    `<span class="eyebrow">CAV301 · Chapter 4 · Lesson 4.1</span>
<h2>Talk shows &amp; TV interviews</h2>
<p class="lead">Talk shows follow a clear <strong>host-guest turn-taking rhythm</strong>. Listening for the host's open-ended questions lets you predict the shape of the guest's answer before it fully unfolds.</p>
<h3>Sample interview</h3>
<pre><code>主持人: 今天我们请到了一位年轻的创业者,欢迎你!
        Zhǔchírén: Jīntiān wǒmen qǐngdàole yí wèi niánqīng de chuàngyèzhě,
        huānyíng nǐ!
        (Host: Today we have a young entrepreneur with us, welcome!)
嘉宾:   谢谢主持人,很高兴能来到这个节目。
        Jiābīn: Xièxiè zhǔchírén, hěn gāoxìng néng láidào zhège jiémù.
        (Guest: Thank you, I'm very happy to be on this show.)
主持人: 你觉得创业过程中最大的挑战是什么?
        Zhǔchírén: Nǐ juéde chuàngyè guòchéng zhōng zuì dà de tiǎozhàn
        shì shénme?
        (Host: What do you think is the biggest challenge in starting
        a business?)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>创业者 chuàngyèzhě   entrepreneur, startup founder
嘉宾   jiābīn         guest (on a show)
挑战   tiǎozhàn       challenge
节目   jiémù          program, show
过程   guòchéng       process
</code></pre>
<h3>Listening &amp; speaking tips</h3>
<ul>
<li>Host questions with <strong>你觉得...是什么?</strong> signal an opinion answer is coming — get ready to hear a personal stance, not a fact.</li>
<li>Practice answering the same question yourself in Chinese before hearing the guest's answer, then compare structures.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Pair up and role-play host/guest using one open-ended question from this lesson, then swap roles.</div>`,
    `<span class="eyebrow">CAV301 · Chương 4 · Bài 4.1</span>
<h2>Talk show &amp; phỏng vấn truyền hình</h2>
<p class="lead">Talk show có <strong>nhịp hỏi-đáp giữa MC và khách mời</strong> rất rõ ràng. Nghe được câu hỏi mở của MC giúp bạn đoán trước hướng trả lời của khách mời trước khi nó được nói hết.</p>
<h3>Đoạn phỏng vấn mẫu</h3>
<pre><code>主持人: 今天我们请到了一位年轻的创业者,欢迎你!
        Zhǔchírén: Jīntiān wǒmen qǐngdàole yí wèi niánqīng de chuàngyèzhě,
        huānyíng nǐ!
        (MC: Hôm nay chúng tôi mời được một nhà khởi nghiệp trẻ, chào
        mừng bạn!)
嘉宾:   谢谢主持人,很高兴能来到这个节目。
        Jiābīn: Xièxiè zhǔchírén, hěn gāoxìng néng láidào zhège jiémù.
        (Khách mời: Cảm ơn MC, tôi rất vui khi được đến chương trình này.)
主持人: 你觉得创业过程中最大的挑战是什么?
        Zhǔchírén: Nǐ juéde chuàngyè guòchéng zhōng zuì dà de tiǎozhàn
        shì shénme?
        (MC: Bạn nghĩ thử thách lớn nhất trong quá trình khởi nghiệp là gì?)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>创业者 chuàngyèzhě   người khởi nghiệp
嘉宾   jiābīn         khách mời (trong chương trình)
挑战   tiǎozhàn       thử thách
节目   jiémù          chương trình
过程   guòchéng       quá trình
</code></pre>
<h3>Mẹo nghe - nói</h3>
<ul>
<li>Câu hỏi MC dạng <strong>你觉得...是什么?</strong> báo hiệu sắp có câu trả lời quan điểm — chuẩn bị nghe lập trường cá nhân, không phải sự kiện khách quan.</li>
<li>Tự trả lời câu hỏi bằng tiếng Trung trước khi nghe khách mời trả lời, rồi so sánh cách diễn đạt.</li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Ghép cặp đóng vai MC/khách mời với một câu hỏi mở trong bài, sau đó đổi vai.</div>`,
  ]]);

const c4q = quiz('cav301-quiz-4', 'Quiz 4 — Talk shows & interviews|||Quiz 4 — Talk show & phỏng vấn', [
  { id: 'q1', question: '"嘉宾" (jiābīn) trong chương trình truyền hình nghĩa là gì?', options: ['Người dẫn chương trình', 'Khách mời', 'Đạo diễn', 'Biên tập viên'], correctIndex: 1, explanation: '嘉宾 (jiābīn) = khách mời trên chương trình.' },
  { id: 'q2', question: 'Câu hỏi "你觉得...是什么?" của MC thường dẫn đến loại câu trả lời nào?', options: ['Số liệu thống kê', 'Quan điểm/ý kiến cá nhân', 'Lời chào tạm biệt', 'Quảng cáo sản phẩm'], correctIndex: 1, explanation: '你觉得 ("bạn nghĩ...") mở đầu câu hỏi xin ý kiến, nên câu trả lời thường là quan điểm cá nhân.' },
  { id: 'q3', question: '"挑战" (tiǎozhàn) nghĩa là gì?', options: ['Cơ hội', 'Thử thách', 'Thành công', 'Kế hoạch'], correctIndex: 1, explanation: '挑战 (tiǎozhàn) = thử thách, khó khăn cần vượt qua.' },
]);

const c5 = doc('cav301-5-1-culture-documentary', 'Chapter 5 — Chinese culture documentaries|||Chương 5 — Phim tài liệu văn hóa Trung Quốc',
  'Giọng thuyết minh chậm, trang trọng; mốc thời gian (从...到...) giúp nắm mạch nội dung.',
  [[
    `<span class="eyebrow">CAV301 · Chapter 5 · Lesson 5.1</span>
<h2>Chinese culture documentaries</h2>
<p class="lead">Documentary narration is slow, formal, and information-dense. Time markers like <strong>从...到...</strong> ("from... to...") are the backbone that lets you follow the storyline across centuries in a few sentences.</p>
<h3>Sample narration</h3>
<pre><code>中国有着五千年的历史,茶文化就是其中重要的一部分。
Zhōngguó yǒuzhe wǔqiān nián de lìshǐ, chá wénhuà jiùshì
qízhōng zhòngyào de yí bùfen.
(China has a five-thousand-year history, and tea culture is
an important part of it.)

从古代到现代,喝茶已经成为中国人日常生活中
不可缺少的习惯。
Cóng gǔdài dào xiàndài, hē chá yǐjīng chéngwéi Zhōngguó rén
rìcháng shēnghuó zhōng bùkě quēshǎo de xíguàn.
(From ancient times to the present, drinking tea has become
an indispensable habit in Chinese people's daily life.)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>历史     lìshǐ          history
文化     wénhuà         culture
习惯     xíguàn         habit
古代/现代 gǔdài / xiàndài  ancient times / modern times
不可缺少 bùkě quēshǎo   indispensable
</code></pre>
<h3>Listening &amp; speaking tips</h3>
<ul>
<li>Track <strong>从...到...</strong> phrases to build a timeline in your head as you listen — it's the documentary's structural skeleton.</li>
<li>Formal narration uses full sentences with no slang — good material for practicing clear, textbook-level pronunciation.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Watch a 3-minute CCTV culture documentary clip and draw a simple timeline of the events/periods it mentions.</div>`,
    `<span class="eyebrow">CAV301 · Chương 5 · Bài 5.1</span>
<h2>Phim tài liệu văn hóa Trung Quốc</h2>
<p class="lead">Giọng thuyết minh phim tài liệu chậm rãi, trang trọng, chứa nhiều thông tin. Các mốc thời gian như <strong>从...到...</strong> ("từ... đến...") là khung xương giúp bạn theo dõi mạch nội dung trải dài nhiều thế kỷ chỉ trong vài câu.</p>
<h3>Đoạn thuyết minh mẫu</h3>
<pre><code>中国有着五千年的历史,茶文化就是其中重要的一部分。
Zhōngguó yǒuzhe wǔqiān nián de lìshǐ, chá wénhuà jiùshì
qízhōng zhòngyào de yí bùfen.
(Trung Quốc có lịch sử năm nghìn năm, văn hóa trà là một
phần quan trọng trong đó.)

从古代到现代,喝茶已经成为中国人日常生活中
不可缺少的习惯。
Cóng gǔdài dào xiàndài, hē chá yǐjīng chéngwéi Zhōngguó rén
rìcháng shēnghuó zhōng bùkě quēshǎo de xíguàn.
(Từ cổ đại đến hiện đại, uống trà đã trở thành thói quen
không thể thiếu trong đời sống hàng ngày của người Trung Quốc.)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>历史     lìshǐ          lịch sử
文化     wénhuà         văn hóa
习惯     xíguàn         thói quen
古代/现代 gǔdài / xiàndài  cổ đại / hiện đại
不可缺少 bùkě quēshǎo   không thể thiếu
</code></pre>
<h3>Mẹo nghe - nói</h3>
<ul>
<li>Bắt các cụm <strong>从...到...</strong> để dựng dòng thời gian trong đầu khi nghe — đây là khung xương cấu trúc của phim tài liệu.</li>
<li>Thuyết minh trang trọng dùng câu đầy đủ, không tiếng lóng — chất liệu tốt để luyện phát âm rõ ràng, chuẩn giáo trình.</li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Xem một đoạn phim tài liệu văn hóa CCTV 3 phút và vẽ một dòng thời gian đơn giản các sự kiện/giai đoạn được nhắc tới.</div>`,
  ]]);

const c5q = quiz('cav301-quiz-5', 'Quiz 5 — Culture documentaries|||Quiz 5 — Phim tài liệu văn hóa', [
  { id: 'q1', question: 'Cụm "从...到..." trong phim tài liệu dùng để làm gì?', options: ['Đưa ra câu hỏi', 'Diễn tả khoảng thời gian/quá trình "từ... đến..."', 'Kết thúc bản tin', 'Giới thiệu sản phẩm'], correctIndex: 1, explanation: '从...到... nghĩa là "từ... đến...", dùng nối hai mốc thời gian hoặc trạng thái.' },
  { id: 'q2', question: '"不可缺少" (bùkě quēshǎo) nghĩa là gì?', options: ['Có thể bỏ qua', 'Không thể thiếu', 'Rất hiếm gặp', 'Đã lỗi thời'], correctIndex: 1, explanation: '不可缺少 (bùkě quēshǎo) = không thể thiếu, thiết yếu.' },
  { id: 'q3', question: 'Giọng thuyết minh phim tài liệu văn hóa thường có đặc điểm gì?', options: ['Nói rất nhanh, nhiều tiếng lóng', 'Chậm rãi, trang trọng, câu đầy đủ', 'Chỉ có câu hỏi tu từ', 'Ngắt quãng ngẫu nhiên'], correctIndex: 1, explanation: 'Thuyết minh phim tài liệu dùng văn phong trang trọng, câu đầy đủ, tốc độ chậm hơn hội thoại đời thường.' },
]);

const c6 = doc('cav301-6-1-travel-food', 'Chapter 6 — Travel & food videos|||Chương 6 — Video du lịch & ẩm thực',
  'Tính từ miêu tả vị giác (地道/香/辣), tên món ăn đặc trưng theo vùng miền.',
  [[
    `<span class="eyebrow">CAV301 · Chapter 6 · Lesson 6.1</span>
<h2>Travel &amp; food videos</h2>
<p class="lead">Food and travel content is rich in <strong>taste adjectives</strong> and place-specific dish names. Catching the adjective right after the dish name is the key listening skill here.</p>
<h3>Sample narration</h3>
<pre><code>这家小吃店的招牌菜是麻辣烫,味道非常地道。
Zhè jiā xiǎochī diàn de zhāopái cài shì málàtàng,
wèidào fēicháng dìdao.
(This snack shop's signature dish is malatang, and the
flavor is very authentic.)

如果你来这座城市旅游,一定要尝尝当地的特色小吃。
Rúguǒ nǐ lái zhè zuò chéngshì lǚyóu, yídìng yào chángchang
dāngdì de tèsè xiǎochī.
(If you come to this city to travel, you must try the
local specialty snacks.)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>招牌菜 zhāopái cài   signature dish
地道   dìdao         authentic, genuine (of flavor/style)
特色   tèsè          special feature, specialty
尝     cháng         to taste
当地   dāngdì        local
</code></pre>
<h3>Listening &amp; speaking tips</h3>
<ul>
<li>Food vlogs stack taste adjectives right after the dish name (麻辣烫...很地道) — listen for the pattern "[dish] + 味道 + [adjective]".</li>
<li>Practice describing a dish you know using 地道/香/辣/甜 — food videos reuse this small adjective set constantly.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Watch a Chinese food-travel vlog and list every dish name plus the adjective used to describe it.</div>`,
    `<span class="eyebrow">CAV301 · Chương 6 · Bài 6.1</span>
<h2>Video du lịch &amp; ẩm thực</h2>
<p class="lead">Nội dung du lịch - ẩm thực dùng nhiều <strong>tính từ miêu tả vị giác</strong> và tên món ăn đặc trưng theo vùng. Kỹ năng nghe chính ở đây là bắt được tính từ đi ngay sau tên món ăn.</p>
<h3>Đoạn thuyết minh mẫu</h3>
<pre><code>这家小吃店的招牌菜是麻辣烫,味道非常地道。
Zhè jiā xiǎochī diàn de zhāopái cài shì málàtàng,
wèidào fēicháng dìdao.
(Món đặc trưng của quán ăn vặt này là malatang, hương vị
rất chuẩn vị.)

如果你来这座城市旅游,一定要尝尝当地的特色小吃。
Rúguǒ nǐ lái zhè zuò chéngshì lǚyóu, yídìng yào chángchang
dāngdì de tèsè xiǎochī.
(Nếu bạn đến thành phố này du lịch, nhất định phải thử món
ăn vặt đặc trưng của địa phương.)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>招牌菜 zhāopái cài   món đặc trưng, món tủ
地道   dìdao         chuẩn vị, đúng gốc
特色   tèsè          đặc trưng, đặc sản
尝     cháng         nếm thử
当地   dāngdì        địa phương
</code></pre>
<h3>Mẹo nghe - nói</h3>
<ul>
<li>Video ẩm thực đặt tính từ vị giác ngay sau tên món (麻辣烫...很地道) — nghe theo mẫu "[món ăn] + 味道 + [tính từ]".</li>
<li>Luyện miêu tả một món ăn quen thuộc bằng 地道/香/辣/甜 — video ẩm thực lặp lại đúng bộ tính từ nhỏ này liên tục.</li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Xem một video vlog du lịch - ẩm thực Trung Quốc và liệt kê mọi tên món ăn cùng tính từ miêu tả đi kèm.</div>`,
  ]]);

const c6q = quiz('cav301-quiz-6', 'Quiz 6 — Travel & food videos|||Quiz 6 — Video du lịch & ẩm thực', [
  { id: 'q1', question: '"地道" (dìdao) khi miêu tả món ăn nghĩa là gì?', options: ['Rất đắt', 'Chuẩn vị, đúng gốc', 'Rất mới lạ', 'Không ngon'], correctIndex: 1, explanation: '地道 (dìdao) = chuẩn vị, đúng gốc, authentic.' },
  { id: 'q2', question: '"招牌菜" (zhāopái cài) nghĩa là gì?', options: ['Món ăn kiêng', 'Món đặc trưng/món tủ của quán', 'Món tráng miệng', 'Món ăn thử miễn phí'], correctIndex: 1, explanation: '招牌菜 (zhāopái cài) = món đặc trưng, món "hiệu" của một quán ăn.' },
  { id: 'q3', question: 'Mẫu câu phổ biến trong video ẩm thực là gì?', options: ['[món ăn] + 味道 + [tính từ]', '[tính từ] + 味道 + [món ăn]', 'Chỉ nêu tên món, không miêu tả', 'Luôn dùng câu hỏi tu từ'], correctIndex: 0, explanation: 'Video ẩm thực thường nói tên món rồi mới đến "味道" + tính từ miêu tả, ví dụ "麻辣烫...很地道".' },
]);

const c7 = doc('cav301-7-1-vlog-social-media', 'Chapter 7 — Vlogs & social media content|||Chương 7 — Vlog & nội dung mạng xã hội',
  'Tốc độ nói nhanh, từ mạng (网络用语), cụm mở/kết video cố định.',
  [[
    `<span class="eyebrow">CAV301 · Chapter 7 · Lesson 7.1</span>
<h2>Vlogs &amp; social media content</h2>
<p class="lead">Vlogs are fast-paced and full of <strong>internet slang</strong> (网络用语). Recognizing the fixed opening/closing phrases frees up your attention for the actual content in between.</p>
<h3>Sample vlog script</h3>
<pre><code>大家好,欢迎来到我的频道!今天想跟大家
分享一下我的日常生活。
Dàjiā hǎo, huānyíng láidào wǒ de píndào! Jīntiān xiǎng
gēn dàjiā fēnxiǎng yíxià wǒ de rìcháng shēnghuó.
(Hi everyone, welcome to my channel! Today I want to
share a bit of my daily life with you.)

别忘了点赞、关注,我们下期视频再见!
Bié wàngle diǎnzàn, guānzhù, wǒmen xià qī shìpín zài jiàn!
(Don't forget to like and follow, see you in the next video!)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>频道 píndào     channel
分享 fēnxiǎng   to share
点赞 diǎnzàn    to like (a post/video)
关注 guānzhù    to follow (an account)
视频 shìpín     video
</code></pre>
<h3>Listening &amp; speaking tips</h3>
<ul>
<li>Vloggers reuse the same opening (大家好,欢迎来到我的频道) and closing (别忘了点赞、关注) every episode — once memorized, you skip straight to new content.</li>
<li>Speed here is much higher than news or documentaries — practice with 1.25x-speed playback before trying real-time.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Record a 30-second self-introduction vlog opening in Chinese using 大家好…欢迎来到我的频道.</div>`,
    `<span class="eyebrow">CAV301 · Chương 7 · Bài 7.1</span>
<h2>Vlog &amp; nội dung mạng xã hội</h2>
<p class="lead">Vlog nói rất nhanh và dùng nhiều <strong>từ mạng</strong> (网络用语). Nhận diện được các cụm mở đầu/kết thúc cố định giúp bạn dồn sự chú ý vào phần nội dung thật sự ở giữa.</p>
<h3>Kịch bản vlog mẫu</h3>
<pre><code>大家好,欢迎来到我的频道!今天想跟大家
分享一下我的日常生活。
Dàjiā hǎo, huānyíng láidào wǒ de píndào! Jīntiān xiǎng
gēn dàjiā fēnxiǎng yíxià wǒ de rìcháng shēnghuó.
(Chào mọi người, chào mừng đến kênh của mình! Hôm nay
mình muốn chia sẻ với mọi người về cuộc sống thường ngày.)

别忘了点赞、关注,我们下期视频再见!
Bié wàngle diǎnzàn, guānzhù, wǒmen xià qī shìpín zài jiàn!
(Đừng quên thả tim, theo dõi nhé, hẹn gặp lại ở video kỳ sau!)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>频道 píndào     kênh (video)
分享 fēnxiǎng   chia sẻ
点赞 diǎnzàn    thả tim, thích (bài đăng/video)
关注 guānzhù    theo dõi (một tài khoản)
视频 shìpín     video
</code></pre>
<h3>Mẹo nghe - nói</h3>
<ul>
<li>Vlogger dùng lại đúng câu mở đầu (大家好,欢迎来到我的频道) và kết thúc (别忘了点赞、关注) ở mọi tập — thuộc rồi thì bỏ qua ngay để tập trung vào nội dung mới.</li>
<li>Tốc độ nói ở đây nhanh hơn nhiều so với tin tức hay phim tài liệu — luyện với tốc độ phát 1.25x trước khi nghe tốc độ thật.</li>
</ul>
<div class="callout"><span class="badge">Luyện tập</span> Tự quay một đoạn mở đầu vlog giới thiệu bản thân 30 giây bằng tiếng Trung, dùng mẫu 大家好…欢迎来到我的频道.</div>`,
  ]]);

const c7q = quiz('cav301-quiz-7', 'Quiz 7 — Vlogs & social media|||Quiz 7 — Vlog & mạng xã hội', [
  { id: 'q1', question: '"点赞" (diǎnzàn) nghĩa là gì?', options: ['Đăng ký kênh', 'Thả tim/thích (bài đăng, video)', 'Bình luận', 'Chia sẻ bài viết'], correctIndex: 1, explanation: '点赞 (diǎnzàn) = thả tim, "like" một bài đăng/video.' },
  { id: 'q2', question: 'Vì sao nên thuộc câu mở đầu/kết thúc cố định của vlog?', options: ['Vì đó là phần khó nhất', 'Để dồn sự chú ý nghe vào phần nội dung mới ở giữa', 'Vì nó không lặp lại ở tập sau', 'Vì nó luôn chứa đáp án bài kiểm tra'], correctIndex: 1, explanation: 'Cụm mở/kết lặp lại mỗi tập; thuộc rồi thì tai tập trung được vào nội dung thật sự thay đổi.' },
  { id: 'q3', question: 'Tốc độ nói trong vlog so với tin tức/phim tài liệu thường như thế nào?', options: ['Chậm hơn nhiều', 'Ngang bằng', 'Nhanh hơn, nhiều từ mạng', 'Không có lời thoại'], correctIndex: 2, explanation: 'Vlog thường nói nhanh và dùng nhiều 网络用语 (từ mạng) hơn tin tức hay phim tài liệu trang trọng.' },
]);

const c8 = doc('cav301-8-1-review-long-video', 'Chapter 8 — Review: long video listening, summary & discussion|||Chương 8 — Ôn tập: nghe đoạn video dài, tóm tắt & thảo luận',
  'Tổng hợp kỹ năng cả 7 chương: nghe theo đoạn (chunk), ghi chú từ khóa, tóm tắt 5W1H, mẫu câu thảo luận.',
  [[
    `<span class="eyebrow">CAV301 · Chapter 8 · Lesson 8.1</span>
<h2>Review: long video listening, summary &amp; discussion</h2>
<p class="lead">This closing chapter combines every skill from Chapters 1–7 to tackle a <strong>5-minute-plus authentic video</strong> (drama, news, documentary, or vlog) — chunk listening, keyword note-taking, and structured discussion.</p>
<h3>Listening strategy for long videos</h3>
<pre><code>1. Chunk it   — split the video into 30-60 second segments by topic shift.
2. Note keywords — write only nouns/verbs per segment, not full sentences.
3. Rebuild    — after listening, reconstruct each segment's main idea
                from your keywords.
4. Summarize  — combine segments using the 5W1H frame (who/what/when/
                where/why/how).
</code></pre>
<h3>Discussion phrases</h3>
<pre><code>我觉得这段视频主要讲的是......
Wǒ juéde zhè duàn shìpín zhǔyào jiǎng de shì......
(I think this video is mainly about ...)

关于这个话题,我的看法是......
Guānyú zhège huàtí, wǒ de kànfǎ shì......
(Regarding this topic, my opinion is ...)
</code></pre>
<h3>Key vocabulary</h3>
<pre><code>主要 zhǔyào     mainly
话题 huàtí      topic
看法 kànfǎ      opinion, point of view
总结 zǒngjié    to summarize
讨论 tǎolùn     to discuss
</code></pre>
<div class="callout"><span class="badge">Final practice</span> Watch one 5+ minute Chinese video of your choice (from any genre in Chapters 1–7), summarize it in Chinese using 5W1H, then discuss your opinion with a partner using 我觉得/我的看法是.</div>`,
    `<span class="eyebrow">CAV301 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: nghe đoạn video dài, tóm tắt &amp; thảo luận</h2>
<p class="lead">Chương cuối gộp mọi kỹ năng từ Chương 1-7 để xử lý một <strong>video thực tế dài trên 5 phút</strong> (phim, tin tức, phim tài liệu, hoặc vlog) — nghe theo đoạn, ghi chú từ khóa, và thảo luận có cấu trúc.</p>
<h3>Chiến lược nghe video dài</h3>
<pre><code>1. Chia đoạn — cắt video thành các đoạn 30-60 giây theo mỗi lần đổi chủ đề.
2. Ghi từ khóa — chỉ ghi danh từ/động từ mỗi đoạn, không ghi cả câu.
3. Dựng lại   — sau khi nghe xong, dựng lại ý chính từng đoạn từ
                các từ khóa đã ghi.
4. Tóm tắt    — gộp các đoạn theo khung 5W1H (ai/gì/khi nào/ở đâu/
                vì sao/như thế nào).
</code></pre>
<h3>Mẫu câu thảo luận</h3>
<pre><code>我觉得这段视频主要讲的是......
Wǒ juéde zhè duàn shìpín zhǔyào jiǎng de shì......
(Tôi nghĩ đoạn video này chủ yếu nói về ...)

关于这个话题,我的看法是......
Guānyú zhège huàtí, wǒ de kànfǎ shì......
(Về chủ đề này, quan điểm của tôi là ...)
</code></pre>
<h3>Từ vựng trọng tâm</h3>
<pre><code>主要 zhǔyào     chủ yếu
话题 huàtí      chủ đề
看法 kànfǎ      quan điểm, ý kiến
总结 zǒngjié    tóm tắt
讨论 tǎolùn     thảo luận
</code></pre>
<div class="callout"><span class="badge">Luyện tập tổng hợp</span> Xem một video tiếng Trung bất kỳ dài trên 5 phút (thuộc thể loại nào ở Chương 1-7 cũng được), tóm tắt bằng tiếng Trung theo khung 5W1H, rồi thảo luận quan điểm với bạn học bằng mẫu 我觉得/我的看法是.</div>`,
  ]]);

const c8q = quiz('cav301-quiz-8', 'Quiz 8 — Review: long video & discussion|||Quiz 8 — Ôn tập nghe đoạn dài & thảo luận', [
  { id: 'q1', question: 'Khi nghe một video dài, bước "chunk it" (chia đoạn) nghĩa là gì?', options: ['Nghe toàn bộ video một lần duy nhất không dừng', 'Cắt video thành các đoạn ngắn theo mỗi lần đổi chủ đề', 'Chỉ nghe 10 giây đầu', 'Bỏ qua phần giữa video'], correctIndex: 1, explanation: 'Chia video thành đoạn 30-60 giây theo chủ đề giúp việc ghi chú và tóm tắt dễ quản lý hơn.' },
  { id: 'q2', question: 'Mẫu câu "关于这个话题,我的看法是......" dùng để làm gì?', options: ['Chào hỏi mở đầu', 'Nêu quan điểm cá nhân về một chủ đề', 'Tóm tắt tin tức khách quan', 'Giới thiệu sản phẩm'], correctIndex: 1, explanation: '关于这个话题,我的看法是... = "Về chủ đề này, quan điểm của tôi là...", dùng để nêu ý kiến cá nhân trong thảo luận.' },
  { id: 'q3', question: 'Khung tóm tắt 5W1H bổ sung thêm yếu tố nào so với 5W đã học ở Chương 2?', options: ['Ai (who)', 'Như thế nào (how)', 'Ở đâu (where)', 'Khi nào (when)'], correctIndex: 1, explanation: '5W1H = 5W (ai/gì/khi nào/ở đâu/vì sao) cộng thêm "how" (như thế nào) — phù hợp tóm tắt video dài, nhiều diễn biến.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CAV301',
    slug: 'cav301-chinese-advanced-audio-visual-listening-speaking-1',
    title: 'Chinese Advanced Audio-Visual Listening & Speaking 1',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CAV301.webp',
    shortDescription: 'HSK4 audio-visual listening & speaking: real Chinese video — drama dialogue, news, ads, talk shows, culture documentaries, travel/food, vlogs, then a long-video review with summary & discussion. Hanzi + real-tone pinyin + Vietnamese/English meaning.|||Nghe - nói tiếng Trung HSK4 qua tài liệu thực: hội thoại phim, tin tức, quảng cáo, talk show, phim tài liệu văn hóa, du lịch/ẩm thực, vlog, và ôn tập nghe đoạn dài + thảo luận. Chữ Hán + pinyin dấu thanh thật + nghĩa Việt/Anh.',
    description: 'Môn <strong>CAV301 — Chinese Advanced Audio-Visual Listening &amp; Speaking 1</strong> (ngành Ngôn ngữ Trung, kỳ 3, trình độ HSK4) luyện <strong>nghe hiểu qua tài liệu nghe-nhìn thực tế</strong> — phim, phóng sự, quảng cáo, talk show, phim tài liệu, video du lịch/ẩm thực, vlog — rồi nói lại/thảo luận theo tài liệu vừa nghe. Bám giáo trình <em>视听说教程</em> (Chinese Audio-Visual-Speaking Course, 北京语言大学出版社) và phóng sự CCTV. 8 chương, mỗi chương gồm lời thoại/thuyết minh mẫu (chữ Hán + pinyin có dấu thanh + nghĩa Việt/Anh), từ vựng trọng tâm, mẹo nghe-nói, và quiz kiểm tra.',
    whatYouLearn: 'Nghe hội thoại phim đời thường tốc độ tự nhiên; cấu trúc & từ vựng bản tin thời sự, tóm tắt 5W; ngôn ngữ quảng cáo (câu hỏi tu từ, khẩu hiệu); nhịp hỏi-đáp talk show/phỏng vấn; giọng thuyết minh phim tài liệu văn hóa (mốc thời gian 从...到...); tính từ vị giác & tên món trong video du lịch-ẩm thực; từ mạng & cụm mở/kết vlog; chiến lược nghe video dài (chia đoạn, ghi từ khóa, tóm tắt 5W1H) và mẫu câu thảo luận.',
    requirements: 'Đã hoàn thành các môn tiếng Trung trình độ HSK3 (nghe-nói cơ bản) trong khung chương trình ngành Ngôn ngữ Trung. Xem điều kiện tiên quyết chính thức trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: 'Chương 1 — Nghe hiểu hội thoại phim đời thường|||Chapter 1 — Everyday drama dialogue', description: 'Hội thoại tốc độ tự nhiên, từ nối chuyển ý.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phóng sự & tin tức truyền hình ngắn|||Chapter 2 — News reports & bulletins', description: 'Cấu trúc bản tin, từ vựng thời sự, tóm tắt 5W.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quảng cáo & video giới thiệu|||Chapter 3 — Ads & promo videos', description: 'Câu hỏi tu từ, khẩu hiệu, từ khóa lợi ích sản phẩm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Talk show & phỏng vấn truyền hình|||Chapter 4 — Talk shows & interviews', description: 'Nhịp hỏi-đáp MC/khách mời, câu hỏi mở.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phim tài liệu văn hóa Trung Quốc|||Chapter 5 — Chinese culture documentaries', description: 'Giọng thuyết minh trang trọng, mốc thời gian 从...到....', lessons: [c5, c5q] },
    { title: 'Chương 6 — Video du lịch & ẩm thực|||Chapter 6 — Travel & food videos', description: 'Tính từ vị giác, tên món ăn đặc trưng vùng miền.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Vlog & nội dung mạng xã hội|||Chapter 7 — Vlogs & social media content', description: 'Tốc độ nói nhanh, từ mạng, cụm mở/kết vlog.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: nghe đoạn dài, tóm tắt & thảo luận|||Chapter 8 — Review: long video, summary & discussion', description: 'Chia đoạn, ghi từ khóa, khung 5W1H, mẫu câu thảo luận.', lessons: [c8, c8q] },
  ],
};
