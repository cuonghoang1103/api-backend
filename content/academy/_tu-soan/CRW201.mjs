// Khoá TỰ SOẠN cho CRW201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Nối tiếp CRW101 (HSK 1–2, bộ thủ đầu tiên, câu đơn): CRW201 đưa đọc–viết lên mức HSK 3 — đọc đoạn 100–200 chữ,
// cấu tạo chữ và bộ thủ nâng cao, lỗi viết thường gặp, câu và đoạn văn, ghi chú/tin nhắn/thư/email, bài văn ngắn 80–120 chữ.
// Mọi link ngoài đã mở thử (tiêu đề trang đúng chủ đề). Ví dụ tiếng Trung do người soạn viết, pinyin đã soát tay.
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng. Ký hiệu {{汉字}} trong nội dung
// được đổi thành thẻ span lang="zh" bởi hàm zh() bên dưới.

const zh = (s) => s.replace(/\{\{(.+?)\}\}/g, '<span lang="zh">$1</span>');
const bi = (en, vi) => '<div class="ml-en">' + zh(en) + '</div>\n<div class="ml-vi">' + zh(vi) + '</div>';
const ul = (a) => '<ul>' + a.map((x) => '<li>' + x + '</li>').join('') + '</ul>';
const tab = (head, rows, col) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>'
  + rows.map((r) => '<tr>' + [r[0], r[1], r[col]].map((c, i) => '<td>' + (i === 0 ? '<span lang="zh">' + c + '</span>' : c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
const links = (a, k) => ul(a.map((x) => '<a href="' + x[0] + '" target="_blank" rel="noopener">' + x[k] + '</a>'));
const prac = (a, k) => '<ol>' + a.map((x) => '<li>' + x[k] + '<div class="dap-an"><strong>' + (k === 0 ? 'Answer:' : 'Đáp án:') + '</strong> ' + x[k + 1] + '</div></li>').join('') + '</ol>';

// o: { gEN,gVI (mục tiêu), bEN,bVI (bài giảng), tab (hàng: [hán, pinyin, nghĩaEN, nghĩaVI]), mEN,mVI (lỗi hay gặp),
//      sEN,sVI (tóm tắt), lk ([url, tiêuĐềEN, tiêuĐềVI]), p ([[qEN,aEN,qVI,aVI]...]) }
const L = (slug, title, description, o) => {
  const num = slug.replace('crw201-ts-', '').replace('-', '.');
  const side = (k) => {
    const en = k === 1;
    const g = en ? o.gEN : o.gVI, b = en ? o.bEN : o.bVI, m = en ? o.mEN : o.mVI, s = en ? o.sEN : o.sVI;
    return '<span class="eyebrow">CRW201 · ' + (en ? 'Lesson ' : 'Bài ') + num + '</span>\n'
      + '<h3>' + (en ? 'Lesson goals' : 'Mục tiêu bài') + '</h3>' + ul(g) + '\n'
      + '<h3>' + (en ? 'Lesson' : 'Bài giảng') + '</h3>' + b + '\n'
      + (E[slug] ? '<h3>' + (en ? 'Going further' : 'Đào sâu') + '</h3>' + E[slug][k - 1] + '\n' : '')
      + (o.tab ? '<h3>' + (en ? 'Characters and words' : 'Bảng chữ và từ') + '</h3>' + tab(en ? ['Hanzi', 'Pinyin', 'Meaning'] : ['Hán tự', 'Pinyin', 'Nghĩa'], o.tab, en ? 2 : 3) + '\n' : '')
      + '<div class="pitfall"><strong>' + (en ? 'Common mistakes.' : 'Lỗi hay gặp.') + '</strong> ' + m + '</div>\n'
      + '<h3>📌 ' + (en ? 'Summary' : 'Tóm tắt') + '</h3>' + ul(s) + '\n'
      + '<h3>🔗 ' + (en ? 'Learn more' : 'Học thêm') + '</h3>' + links(o.lk, en ? 1 : 2) + '\n'
      + '<h3>🧪 ' + (en ? 'Practice' : 'Tự luyện') + '</h3>' + prac(o.p, en ? 0 : 2);
  };
  const en = side(1), vi = side(2);
  return { title, slug, type: 'DOCUMENT', description, content: bi(en, vi) };
};
// Câu hỏi: opts là mảng 4 chuỗi; chuỗi không có ||| thì dùng chung cho cả hai thứ tiếng.
const dup = (s) => (s.includes('|||') ? s : s + '|||' + s);
const sp = (s) => s.replace(/\{\{|\}\}/g, '');
const Q = (id, qEN, qVI, opts, ci, eEN, eVI) => ({ id, question: sp(qEN + '|||' + qVI), options: opts.map((o) => sp(dup(o))), correctIndex: ci, points: 1, explanation: sp(eEN + '|||' + eVI) });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'crw201-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// Liên kết ngoài đã mở thử (mỗi cái trả đúng chủ đề)
const U = {
  hanzi: ['https://hanziwriter.org/', 'Hanzi Writer — stroke order animations and quizzes', 'Hanzi Writer — hoạt hình thứ tự nét và bài kiểm tra'],
  mdbg: ['https://www.mdbg.net/chinese/dictionary', 'MDBG — free Chinese–English dictionary', 'MDBG — từ điển Hoa–Anh miễn phí'],
  duch: ['https://www.duchinese.net/', 'Du Chinese — graded reading stories', 'Du Chinese — truyện đọc theo cấp độ'],
  hsk3: ['http://hsk.academy/en/hsk-3-vocabulary-list', 'HSK Academy — HSK 3 vocabulary list', 'HSK Academy — danh sách từ HSK 3'],
  gram3: ['https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points', 'Chinese Grammar Wiki — HSK 3 grammar points', 'Chinese Grammar Wiki — điểm ngữ pháp HSK 3'],
  punct: ['https://en.wikipedia.org/wiki/Chinese_punctuation', 'Wikipedia — Chinese punctuation', 'Wikipedia — Dấu câu tiếng Trung'],
  kangxi: ['https://en.wikipedia.org/wiki/Kangxi_radicals', 'Wikipedia — Kangxi radicals', 'Wikipedia — 214 bộ thủ Khang Hy'],
  radical: ['https://en.wikipedia.org/wiki/Radical_(Chinese_characters)', 'Wikipedia — Radical (Chinese characters)', 'Wikipedia — Bộ thủ chữ Hán'],
  yb: ['https://www.yellowbridge.com/chinese/radicals.php', 'YellowBridge — list of radicals', 'YellowBridge — bảng bộ thủ'],
  stroke: ['https://en.wikipedia.org/wiki/Stroke_(CJK_character)', 'Wikipedia — Chinese character strokes', 'Wikipedia — Nét trong chữ Hán'],
  chars: ['https://en.wikipedia.org/wiki/Chinese_characters', 'Wikipedia — Chinese characters', 'Wikipedia — Chữ Hán'],
  class: ['https://en.wikipedia.org/wiki/Chinese_character_classification', 'Wikipedia — Chinese character classification', 'Wikipedia — Phân loại chữ Hán'],
  simp: ['https://en.wikipedia.org/wiki/Simplified_Chinese_characters', 'Wikipedia — Simplified Chinese characters', 'Wikipedia — Chữ Hán giản thể'],
  pinyin: ['https://en.wikipedia.org/wiki/Pinyin', 'Wikipedia — Pinyin', 'Wikipedia — Pinyin'],
  ime: ['https://en.wikipedia.org/wiki/Chinese_input_methods_for_computers', 'Wikipedia — Chinese input methods', 'Wikipedia — Bộ gõ chữ Hán'],
  hskw: ['https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi', 'Wikipedia — HSK (Hanyu Shuiping Kaoshi)', 'Wikipedia — Kỳ thi HSK'],
  hskc: ['https://www.chinesetest.cn/', 'Chinese Tests Service (official HSK site)', 'Chinesetest.cn — trang chính thức của kỳ thi HSK'],
  pleco: ['https://www.pleco.com/', 'Pleco — Chinese dictionary app', 'Pleco — ứng dụng từ điển tiếng Trung'],
  cali: ['https://en.wikipedia.org/wiki/Chinese_calligraphy', 'Wikipedia — Chinese calligraphy', 'Wikipedia — Thư pháp Trung Hoa'],
  ba: ['https://resources.allsetlearning.com/chinese/grammar/ASG2UB2B', 'Chinese Grammar Wiki — using 把 sentences', 'Chinese Grammar Wiki — câu chữ 把'],
  bei: ['https://resources.allsetlearning.com/chinese/grammar/ASGHF9F1', 'Chinese Grammar Wiki — using 被 sentences', 'Chinese Grammar Wiki — câu chữ 被'],
  ruguo: ['https://resources.allsetlearning.com/chinese/grammar/ASGGIVT0', 'Chinese Grammar Wiki — 如果…就… (if…then…)', 'Chinese Grammar Wiki — 如果…就… (nếu…thì…)'],
  xianzai: ['https://resources.allsetlearning.com/chinese/grammar/ASGLJM55', 'Chinese Grammar Wiki — sequencing with 先 and 再', 'Chinese Grammar Wiki — trình tự với 先 và 再'],
  chule: ['https://resources.allsetlearning.com/chinese/grammar/ASGHFPGG', 'Chinese Grammar Wiki — 除了…以外', 'Chinese Grammar Wiki — 除了…以外'],
  le: ['https://resources.allsetlearning.com/chinese/grammar/ASGT185D', 'Chinese Grammar Wiki — change of state with 了', 'Chinese Grammar Wiki — 了 chỉ sự thay đổi'],
  caijiu: ['https://resources.allsetlearning.com/chinese/grammar/ASGLOS9C', 'Chinese Grammar Wiki — comparing 才 and 就', 'Chinese Grammar Wiki — so sánh 才 và 就'],
  yibian: ['https://resources.allsetlearning.com/chinese/grammar/ASG2ZC5S', 'Chinese Grammar Wiki — simultaneous actions with 一边', 'Chinese Grammar Wiki — hai việc cùng lúc với 一边'],
  budan: ['https://resources.allsetlearning.com/chinese/grammar/ASGTYJ3E', 'Chinese Grammar Wiki — 不但…而且…', 'Chinese Grammar Wiki — 不但…而且…'],
  yuelai: ['https://resources.allsetlearning.com/chinese/grammar/ASG7UE4H', 'Chinese Grammar Wiki — 越来越 (more and more)', 'Chinese Grammar Wiki — 越来越 (càng ngày càng)'],
};

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = {
  title: '0.1 About CRW201 — Chinese Reading & Writing Skills 2|||0.1 Giới thiệu môn CRW201 — Kỹ năng Đọc–Viết tiếng Trung 2',
  slug: 'crw201-ts-0-1', type: 'DOCUMENT',
  description: 'CRW201 học gì, để làm gì, 8 chuẩn đầu ra tự soạn, nối tiếp CRW101 ở mức HSK 3, cảnh báo: trường chưa công bố syllabus trên FLM.',
  content: bi(
    `<span class="eyebrow">CRW201 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Chinese Reading &amp; Writing Skills 2</h2>
<p class="lead">CRW101 taught you to write strokes, use about forty radicals and read HSK 1–2 texts. CRW201 takes the same two skills to <strong>HSK 3 level</strong>: you will read passages of 100–200 characters, write notes, messages, emails and short essays of 80–120 characters, and learn to find and fix your own mistakes.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the CRW201 syllabus on FLM</strong> (we searched the code and the course name on 09/11/2026). This framework is <strong>self-authored</strong>, built from the HSK 3 level descriptions and the standard teaching order of reading and writing. <strong>Grading weights, exam format and dates are decided by your lecturer</strong> — always follow the outline you receive in class.</p></div>
<h3>What is the course about?</h3>
<p>Reading and writing are separate skills from speaking. In writing you must produce the <strong>right character</strong> (not just the right sound), put punctuation in the right place and link sentences without the help of tone of voice. In reading you must understand text without hearing it, so you rely on structure, signal words and character parts.</p>
<h3>Why do you need it?</h3>
<ul>
<li><strong>Study in or with China:</strong> forms, emails to teachers and offices, WeChat notices all arrive in writing.</li>
<li><strong>Work:</strong> a clear note or email is often the first impression for a Chinese-speaking partner or employer.</li>
<li><strong>Exams:</strong> HSK 3 has a reading part (about 30 questions) and a writing part (10 questions).</li>
<li><strong>Memory:</strong> writing a character from memory is the best test of whether you really know it.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<ol>
<li>Read an HSK 3 passage in three passes and answer detail, inference and main-idea questions.</li>
<li>Use signal words (connectors, time words, pronouns) to follow the logic of a text.</li>
<li>Analyse characters into components and use about 30 more radicals and phonetic families.</li>
<li>Tell apart common look-alike and homophone characters and avoid stroke-level slips.</li>
<li>Write correct HSK 3 sentences: word order, 了/过/着, complements, 把/被, 的/得/地.</li>
<li>Punctuate and join sentences into a paragraph with connectors and a clear order.</li>
<li>Write notes, messages, invitations, notices, letters and emails in the right format and tone.</li>
<li>Write a 80–120-character essay (narrate, describe, give an opinion) and proofread it with a checklist.</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>Prerequisite: <strong>CRW101</strong> (Reading &amp; Writing 1). It runs alongside <strong>CIC102 — Intensive Chinese 2</strong>, whose grammar (了/过/着, complements, 把/被, comparison) is the grammar you will write with here. Later integrated-Chinese courses such as CIC301 raise the level to HSK 4. Check your curriculum for the next reading–writing course.</p>
<h3>How to study</h3>
<ul><li>Every lesson has goals, a lecture with examples, common mistakes, a summary, links and practice with answers; each chapter ends with a quiz.</li>
<li>Write every practice answer <strong>by hand first</strong>, then check.</li>
<li>Keep an error notebook: one line per mistake, with the correct form. You will use it in the final project.</li></ul>
<p><em>Pinyin convention.</em> As in CRW101, pinyin appears with tone marks; the neutral tone has no mark (for example <span lang="zh">朋友</span> péngyou).</p>`,
    `<span class="eyebrow">CRW201 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Kỹ năng Đọc–Viết tiếng Trung 2</h2>
<p class="lead">CRW101 dạy bạn viết nét, dùng khoảng bốn mươi bộ thủ và đọc văn bản HSK 1–2. CRW201 đưa hai kỹ năng ấy lên <strong>trình độ HSK 3</strong>: bạn sẽ đọc đoạn 100–200 chữ, viết ghi chú, tin nhắn, email và bài văn ngắn 80–120 chữ, đồng thời học cách tự tìm và sửa lỗi của mình.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường Đại học FPT <strong>chưa công bố syllabus môn CRW201 trên FLM</strong> (đã dò mã và tên môn ngày 09/11/2026). Khung này do người soạn <strong>tự dựng</strong>, theo mô tả trình độ HSK 3 và trình tự dạy đọc–viết thông dụng. <strong>Cách tính điểm, hình thức và lịch thi do giảng viên quyết định</strong> — hãy luôn theo đề cương thầy cô phát trên lớp.</p></div>
<h3>Môn học gì?</h3>
<p>Đọc và viết là kỹ năng khác với nói. Khi viết bạn phải ra <strong>đúng chữ</strong> (không chỉ đúng âm), đặt dấu câu đúng chỗ và nối câu mà không có ngữ điệu giúp. Khi đọc bạn phải hiểu mà không nghe, nên dựa vào cấu trúc, từ nối và các bộ phận của chữ.</p>
<h3>Học để làm gì?</h3>
<ul>
<li><strong>Học tập ở Trung Quốc hoặc với người Trung Quốc:</strong> biểu mẫu, email gửi thầy cô và văn phòng, thông báo trên WeChat đều là chữ viết.</li>
<li><strong>Đi làm:</strong> một ghi chú hay email rõ ràng thường là ấn tượng đầu tiên với đối tác hoặc nhà tuyển dụng nói tiếng Trung.</li>
<li><strong>Thi cử:</strong> HSK 3 có phần đọc (khoảng 30 câu) và phần viết (10 câu).</li>
<li><strong>Trí nhớ:</strong> viết được chữ từ trí nhớ là phép thử tốt nhất xem bạn có thực sự biết chữ đó không.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<ol>
<li>Đọc một đoạn HSK 3 theo ba lượt và trả lời câu chi tiết, suy luận và ý chính.</li>
<li>Dùng tín hiệu (liên từ, từ chỉ thời gian, đại từ) để theo dõi mạch văn bản.</li>
<li>Phân tích chữ thành bộ phận và dùng thêm khoảng 30 bộ thủ và họ thanh phù.</li>
<li>Phân biệt chữ gần hình, chữ đồng âm thường gặp và tránh lỗi nét.</li>
<li>Viết câu HSK 3 đúng: trật tự từ, 了/过/着, bổ ngữ, 把/被, 的/得/地.</li>
<li>Chấm câu và nối câu thành đoạn bằng liên từ và trình tự rõ ràng.</li>
<li>Viết ghi chú, tin nhắn, lời mời, thông báo, thư và email đúng khuôn và đúng giọng.</li>
<li>Viết bài 80–120 chữ (kể chuyện, miêu tả, nêu ý kiến) và tự soát lỗi bằng danh sách kiểm.</li>
</ol>
<h3>Môn liên quan ở FPTU</h3>
<p>Tiên quyết: <strong>CRW101</strong> (Đọc–Viết 1). Môn này chạy song song với <strong>CIC102 — Tiếng Trung tổng hợp tăng cường 2</strong>, có ngữ pháp (了/过/着, bổ ngữ, 把/被, so sánh) chính là ngữ pháp bạn dùng để viết ở đây. Các môn tổng hợp sau như CIC301 nâng lên HSK 4. Hãy xem khung chương trình để biết môn đọc–viết kế tiếp.</p>
<h3>Cách học</h3>
<ul><li>Mỗi bài có mục tiêu, bài giảng kèm ví dụ, lỗi hay gặp, tóm tắt, link và bài tự luyện có đáp án; cuối chương có quiz.</li>
<li>Mọi bài tự luyện hãy <strong>viết tay trước</strong>, rồi mới đối chiếu.</li>
<li>Giữ một sổ lỗi: mỗi lỗi một dòng, kèm dạng đúng. Bạn sẽ dùng nó trong dự án cuối khoá.</li></ul>
<p><em>Quy ước pinyin.</em> Như CRW101, pinyin có dấu thanh; thanh nhẹ không đánh dấu (ví dụ <span lang="zh">朋友</span> péngyou).</p>`),
};

const m02 = {
  title: '0.2 Textbooks and study resources|||0.2 Giáo trình và tài liệu học',
  slug: 'crw201-ts-0-2', type: 'DOCUMENT',
  description: 'Sách chính HSK Standard Course 3 và tài liệu tra chữ, bộ thủ, đọc theo cấp độ, kèm link đã mở thử.',
  content: bi(
    `<span class="eyebrow">CRW201 · Lesson 0.2</span>
<h3>Core books</h3>
<ul><li><strong>HSK Standard Course 3</strong> (<span lang="zh">HSK标准教程3</span>), Jiang Liping (chief ed.), Beijing Language and Culture University Press, 2014. ISBN 978-7-5619-3818-8 (textbook); workbook ISBN 978-7-5619-3815-7. The same book as your integrated-Chinese course; use its word list and reading passages. A library record for 978-7-5619-3818-8 lists Jiang Liping and 2014, but the title there was garbled, so compare with the number printed on your own copy.</li>
<li><strong>Chinese Characters: A Genealogy and Dictionary</strong>, Rick Harbaugh, 1998, Zhongwen.com (a catalogue record also shows Yale University Press as publisher; records disagree, so check your copy). ISBN 978-0-9660750-0-7. Explains how each character is built — useful for chapters 2 and 3. The online version is at zhongwen.com.</li></ul>
<h3>Open resources</h3>
<ul><li><a href="https://hanziwriter.org/" target="_blank" rel="noopener">Hanzi Writer</a> — stroke order animations and a writing quiz.</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG dictionary</a> — free lookup by hanzi, pinyin or English; <a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> is the phone app with handwriting input.</li>
<li><a href="https://www.duchinese.net/" target="_blank" rel="noopener">Du Chinese</a> — graded reading stories for the level after the textbook.</li>
<li><a href="http://hsk.academy/en/hsk-3-vocabulary-list" target="_blank" rel="noopener">HSK Academy HSK 3 word list</a> and <a href="https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points" target="_blank" rel="noopener">Chinese Grammar Wiki HSK 3 grammar</a>.</li>
<li><a href="https://www.yellowbridge.com/chinese/radicals.php" target="_blank" rel="noopener">YellowBridge radical list</a> and <a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">the official HSK site</a> (formats are being revised — always check there).</li></ul>
<div class="callout"><strong>How to use them.</strong> Textbook for words, Hanzi Writer for the order of each new character, MDBG/Pleco for unknown characters, Du Chinese for extra reading, Chinese Grammar Wiki when a pattern in a lesson is unclear. Buy the edition named above, or ask your lecturer which edition the class uses.</div>`,
    `<span class="eyebrow">CRW201 · Bài 0.2</span>
<h3>Sách chính</h3>
<ul><li><strong>HSK Standard Course 3</strong> (<span lang="zh">HSK标准教程3</span>), chủ biên Khương Lệ Bình (Jiang Liping), NXB Đại học Ngôn ngữ và Văn hoá Bắc Kinh, 2014. ISBN 978-7-5619-3818-8 (sách bài học); sách bài tập ISBN 978-7-5619-3815-7. Cùng cuốn với môn tiếng Trung tổng hợp của bạn; dùng bảng từ và các bài đọc trong đó. Một bản ghi thư viện cho 978-7-5619-3818-8 ghi Khương Lệ Bình và năm 2014 nhưng tên sách bị lỗi mã hoá, nên hãy đối chiếu với số in trên cuốn của bạn.</li>
<li><strong>Chinese Characters: A Genealogy and Dictionary</strong>, Rick Harbaugh, 1998, Zhongwen.com (một bản ghi danh mục còn ghi NXB Yale University Press; các nguồn không thống nhất, hãy xem cuốn của bạn). ISBN 978-0-9660750-0-7. Giải thích cách mỗi chữ được cấu tạo — hữu ích cho chương 2 và 3. Bản trực tuyến ở zhongwen.com.</li></ul>
<h3>Tài liệu mở</h3>
<ul><li><a href="https://hanziwriter.org/" target="_blank" rel="noopener">Hanzi Writer</a> — hoạt hình thứ tự nét và bài kiểm tra viết.</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">Từ điển MDBG</a> — tra miễn phí theo chữ, pinyin hoặc tiếng Anh; <a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> là ứng dụng điện thoại có nhập tay.</li>
<li><a href="https://www.duchinese.net/" target="_blank" rel="noopener">Du Chinese</a> — truyện đọc theo cấp độ cho giai đoạn sau giáo trình.</li>
<li><a href="http://hsk.academy/en/hsk-3-vocabulary-list" target="_blank" rel="noopener">Danh sách từ HSK 3 của HSK Academy</a> và <a href="https://resources.allsetlearning.com/chinese/grammar/HSK_3_grammar_points" target="_blank" rel="noopener">ngữ pháp HSK 3 trên Chinese Grammar Wiki</a>.</li>
<li><a href="https://www.yellowbridge.com/chinese/radicals.php" target="_blank" rel="noopener">Bảng bộ thủ YellowBridge</a> và <a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">trang HSK chính thức</a> (định dạng đang được cập nhật — luôn kiểm tra ở đây).</li></ul>
<div class="callout"><strong>Cách dùng.</strong> Giáo trình lấy từ, Hanzi Writer học thứ tự nét chữ mới, MDBG/Pleco tra chữ lạ, Du Chinese đọc thêm, Chinese Grammar Wiki khi chưa rõ một mẫu câu trong bài. Hãy mua đúng ấn bản nêu trên, hoặc hỏi giảng viên lớp dùng ấn bản nào.</div>`),
};

// ── Phần "Đào sâu" thêm cho bài mỏng: E[slug] = [html EN, html VI] ──
const E = {};
const X = (en, vi, items) => [en + '<h4>More practice</h4>' + prac(items, 0), vi + '<h4>Luyện thêm</h4>' + prac(items, 2)];
E['crw201-ts-1-2'] = X(
`<p>Pairs are only part of the system. Single connectors also steer your reading, and each one says something about <em>how much weight</em> the sentence carries.</p>
<ul><li>{{可是}} and {{不过}} both mean "but", yet {{不过}} is softer: it adds a small reservation ({{这件衣服很好看，不过有点儿贵。}} "Nice, though a bit pricey").</li>
<li>{{其实}} "actually" corrects what was said before, so the true state of affairs comes <em>after</em> it.</li>
<li>{{另外}} "in addition" and {{而且}} start a new point; {{总之}} "in short" and {{所以}} begin the conclusion.</li>
<li>{{结果}} "as a result" announces what really happened, often after a plan: {{我想早点儿起床，结果还是迟到了。}}</li></ul>
<p>A useful habit: when you meet a signal, stop and say to yourself "this is the setup" or "this is the point". Setups can be skipped on a second look; points must be matched with the question.</p>
<div class="callout"><p lang="zh">因为明天有考试，所以我今天晚上不出去玩儿了。虽然我有点儿累，但是我还是要复习。只要认真复习，我就一定能考好。</p>
<p>Yīnwèi míngtiān yǒu kǎoshì, suǒyǐ wǒ jīntiān wǎnshang bù chūqù wánr le. Suīrán wǒ yǒudiǎnr lèi, dànshì wǒ háishi yào fùxí. Zhǐyào rènzhēn fùxí, wǒ jiù yídìng néng kǎo hǎo.</p>
<p>Because there is an exam tomorrow, I am not going out to play tonight. Although I am a little tired, I still have to review. As long as I review carefully, I will certainly do well.</p></div>
<p>Analysis: the first sentence gives cause and result; the second is a contrast whose main point ({{还是要复习}}) follows {{但是}}; the third is a condition whose result ({{就一定能考好}}) follows {{就}}.</p>`,
`<p>Cặp liên từ mới chỉ là một phần. Liên từ đơn cũng điều hướng việc đọc, và mỗi từ cho biết câu đó <em>nặng đến đâu</em>.</p>
<ul><li>{{可是}} và {{不过}} đều nghĩa là "nhưng", song {{不过}} nhẹ hơn: nó chỉ thêm một chút bảo lưu ({{这件衣服很好看，不过有点儿贵。}} "Đẹp đấy, có điều hơi đắt").</li>
<li>{{其实}} "thật ra" đính chính điều vừa nói, nên sự thật nằm <em>sau</em> nó.</li>
<li>{{另外}} "ngoài ra" và {{而且}} mở một ý mới; {{总之}} "tóm lại" và {{所以}} mở đầu phần kết luận.</li>
<li>{{结果}} "kết quả là" báo điều thật sự đã xảy ra, thường sau một dự định: {{我想早点儿起床，结果还是迟到了。}}</li></ul>
<p>Một thói quen hữu ích: gặp tín hiệu thì dừng lại tự nhủ "đây là phần dẫn" hoặc "đây là ý chính". Phần dẫn có thể lướt khi đọc lại; ý chính phải đối chiếu với câu hỏi.</p>
<div class="callout"><p lang="zh">因为明天有考试，所以我今天晚上不出去玩儿了。虽然我有点儿累，但是我还是要复习。只要认真复习，我就一定能考好。</p>
<p>Yīnwèi míngtiān yǒu kǎoshì, suǒyǐ wǒ jīntiān wǎnshang bù chūqù wánr le. Suīrán wǒ yǒudiǎnr lèi, dànshì wǒ háishi yào fùxí. Zhǐyào rènzhēn fùxí, wǒ jiù yídìng néng kǎo hǎo.</p>
<p>Vì ngày mai có kỳ thi nên tối nay tôi không ra ngoài chơi nữa. Tuy hơi mệt nhưng tôi vẫn phải ôn bài. Chỉ cần ôn bài nghiêm túc, tôi nhất định sẽ thi tốt.</p></div>
<p>Phân tích: câu đầu có nguyên nhân và kết quả; câu hai là tương phản, ý chính ({{还是要复习}}) đứng sau {{但是}}; câu ba là điều kiện, kết quả ({{就一定能考好}}) đứng sau {{就}}.</p>`,
[
 ['Why is the writer not going out tonight?', 'Because there is an exam tomorrow ({{因为明天有考试}}).', 'Vì sao người viết không ra ngoài tối nay?', 'Vì ngày mai có kỳ thi ({{因为明天有考试}}).'],
 ['Which half of {{虽然……但是……}} holds the main point in the passage above?', 'The half after {{但是}}: {{我还是要复习}}.', 'Vế nào của {{虽然……但是……}} chứa ý chính trong đoạn trên?', 'Vế sau {{但是}}: {{我还是要复习}}.'],
 ['Join into one sentence with {{其实}}: Everyone thought he was ill. He was only tired.', '{{大家都以为他生病了，其实他只是累了。}}', 'Nối thành một câu với {{其实}}: Mọi người tưởng anh ấy ốm. Anh ấy chỉ mệt.', '{{大家都以为他生病了，其实他只是累了。}}'],
]);

E['crw201-ts-1-3'] = X(
`<p>Inference is not guessing: every inference needs a clue in the text plus ordinary knowledge of the world. At this level three kinds appear in exams.</p>
<ul><li><strong>Cause from effect:</strong> the text gives the result and you supply the reason (the dog does not eat, so it is probably ill).</li>
<li><strong>Feeling from action:</strong> {{笑着说}} smiling as she spoke → happy; {{一句话也不说}} not saying a word → upset or shy.</li>
<li><strong>Place or time from clues:</strong> {{菜单}}, {{服务员}} → a restaurant; {{下课了}} → school; {{天黑了}} → evening.</li></ul>
<p>Be careful with pronouns when two nouns of the same kind compete. {{小王告诉小李他的手机丢了。}} is ambiguous in Chinese: {{他}} may be Xiao Wang or Xiao Li. In your own writing repeat the name; in reading, use the next sentence to decide.</p>
<div class="callout"><p lang="zh">今天是姐姐的生日。早上妈妈起得很早，在厨房里忙了很久。晚上，家里来了很多客人，桌子上放着一个大蛋糕。姐姐笑着说：“谢谢大家！”</p>
<p>Jīntiān shì jiějie de shēngrì. Zǎoshang māma qǐ de hěn zǎo, zài chúfáng li máng le hěn jiǔ. Wǎnshang, jiā li lái le hěn duō kèrén, zhuōzi shang fàng zhe yí gè dà dàngāo. Jiějie xiào zhe shuō: “Xièxie dàjiā!”</p>
<p>Today is my older sister's birthday. Mum got up very early in the morning and was busy in the kitchen for a long time. In the evening many guests came and a big cake stood on the table. My sister said with a smile, "Thank you all!"</p></div>
<p>The text never says why Mum was in the kitchen, but {{生日}}, {{客人}} and {{蛋糕}} let you infer that she was cooking for the party. {{笑着}} shows the sister is happy.</p>`,
`<p>Suy luận không phải là đoán mò: mỗi suy luận cần một manh mối trong văn bản cộng với hiểu biết thông thường. Ở trình độ này đề thi hay gặp ba loại.</p>
<ul><li><strong>Suy ra nguyên nhân từ kết quả:</strong> văn bản cho kết quả, bạn tự bổ sung lý do (chó không ăn nên chắc bị ốm).</li>
<li><strong>Suy ra cảm xúc từ hành động:</strong> {{笑着说}} vừa cười vừa nói → vui; {{一句话也不说}} không nói một lời → buồn hoặc ngại.</li>
<li><strong>Suy ra nơi chốn, thời gian từ manh mối:</strong> {{菜单}}, {{服务员}} → nhà hàng; {{下课了}} → trường học; {{天黑了}} → buổi tối.</li></ul>
<p>Cẩn thận với đại từ khi có hai danh từ cùng loại. {{小王告诉小李他的手机丢了。}} mơ hồ trong tiếng Trung: {{他}} có thể là Tiểu Vương hoặc Tiểu Lý. Khi viết hãy lặp tên; khi đọc, dùng câu sau để quyết định.</p>
<div class="callout"><p lang="zh">今天是姐姐的生日。早上妈妈起得很早，在厨房里忙了很久。晚上，家里来了很多客人，桌子上放着一个大蛋糕。姐姐笑着说：“谢谢大家！”</p>
<p>Jīntiān shì jiějie de shēngrì. Zǎoshang māma qǐ de hěn zǎo, zài chúfáng li máng le hěn jiǔ. Wǎnshang, jiā li lái le hěn duō kèrén, zhuōzi shang fàng zhe yí gè dà dàngāo. Jiějie xiào zhe shuō: “Xièxie dàjiā!”</p>
<p>Hôm nay là sinh nhật chị gái. Sáng sớm mẹ dậy rất sớm, bận rộn trong bếp rất lâu. Buổi tối nhà có nhiều khách, trên bàn đặt một chiếc bánh kem lớn. Chị cười nói: "Cảm ơn mọi người!"</p></div>
<p>Văn bản không nói vì sao mẹ ở trong bếp, nhưng {{生日}}, {{客人}} và {{蛋糕}} cho phép suy ra mẹ đang nấu cho bữa tiệc. {{笑着}} cho thấy chị đang vui.</p>`,
[
 ['In the birthday text, whose birthday is it, and who is {{姐姐}} thanking?', 'The sister\'s birthday; she thanks everyone ({{大家}}), the guests.', 'Trong đoạn sinh nhật, sinh nhật của ai và {{姐姐}} cảm ơn ai?', 'Sinh nhật của chị gái; chị cảm ơn mọi người ({{大家}}), tức các vị khách.'],
 ['What can you infer from {{在厨房里忙了很久}}? Name one clue that supports it.', 'Mum was cooking for the party; clues: {{生日}}, {{客人}}, {{蛋糕}}.', 'Từ {{在厨房里忙了很久}} có thể suy ra điều gì? Nêu một manh mối.', 'Mẹ nấu ăn cho bữa tiệc; manh mối: {{生日}}, {{客人}}, {{蛋糕}}.'],
 ['Why is {{小王告诉小李他的手机丢了}} unclear, and how do you fix it?', '{{他}} could be either person; repeat the name: {{小王告诉小李，小王的手机丢了。}}', 'Vì sao {{小王告诉小李他的手机丢了}} chưa rõ, và sửa thế nào?', '{{他}} có thể là một trong hai người; lặp tên: {{小王告诉小李，小王的手机丢了。}}'],
]);

E['crw201-ts-1-4'] = X(
`<p>Characters themselves offer clues. Even when the whole word is new, one component may be familiar. Practise a quick "radical + context" check:</p>
<ul><li>{{疼}} has {{疒}} (illness): in {{我感冒了，头很疼}} ("I have a cold and my head really hurts") the context confirms "pain".</li>
<li>{{饺}} has {{饣}} (food), so {{饺子}} is something to eat; {{河}} has {{氵}}, so it concerns water.</li>
<li>A new word of the type "verb + object" can often be read part by part: {{洗澡}} wash + bathe, {{请假}} ask + leave.</li></ul>
<div class="callout"><p lang="zh">我昨天感冒了，头很疼，所以没去上课，在家里休息了一天。</p>
<p>Wǒ zuótiān gǎnmào le, tóu hěn téng, suǒyǐ méi qù shàngkè, zài jiā li xiūxi le yì tiān.</p>
<p>I had a cold yesterday and my head hurt badly, so I did not go to class and rested at home for a day.</p></div>
<p>If {{疼}} is unknown, the clues {{感冒}} and {{没去上课}} still tell you that the writer was unwell. That is enough to answer "why did he miss class?".</p>
<h4>A vocabulary notebook that works</h4>
<p>After the passage, record each word you looked up in three columns: the word in its original sentence, the pinyin, and a short meaning. Copying the whole sentence keeps the word attached to its use. Review the page after two days, then after a week.</p>`,
`<p>Bản thân chữ cũng cho manh mối. Dù cả từ là mới, một thành phần có thể đã quen. Hãy tập kiểm tra nhanh "bộ thủ + ngữ cảnh":</p>
<ul><li>{{疼}} có {{疒}} (bệnh): trong {{我感冒了，头很疼}} ("tôi bị cảm, đầu đau lắm") ngữ cảnh xác nhận nghĩa "đau".</li>
<li>{{饺}} có {{饣}} (đồ ăn) nên {{饺子}} là thứ để ăn; {{河}} có {{氵}} nên liên quan đến nước.</li>
<li>Từ mới kiểu "động từ + tân ngữ" thường đọc được từng phần: {{洗澡}} rửa + tắm, {{请假}} xin + nghỉ.</li></ul>
<div class="callout"><p lang="zh">我昨天感冒了，头很疼，所以没去上课，在家里休息了一天。</p>
<p>Wǒ zuótiān gǎnmào le, tóu hěn téng, suǒyǐ méi qù shàngkè, zài jiā li xiūxi le yì tiān.</p>
<p>Hôm qua tôi bị cảm, đầu đau dữ dội nên không đi học, ở nhà nghỉ một ngày.</p></div>
<p>Nếu chưa biết {{疼}}, hai manh mối {{感冒}} và {{没去上课}} vẫn cho biết người viết không khoẻ. Thế là đủ để trả lời "vì sao anh ấy nghỉ học?".</p>
<h4>Sổ từ vựng hiệu quả</h4>
<p>Sau khi đọc xong đoạn, ghi mỗi từ đã tra vào ba cột: từ trong câu gốc, pinyin và nghĩa ngắn. Chép cả câu giúp từ gắn với cách dùng. Xem lại trang đó sau hai ngày, rồi sau một tuần.</p>`,
[
 ['Guess the meaning from the pattern: {{售货员}}, {{作家}}, {{读者}}.', 'Salesperson ({{售货}} sell goods + {{员}}); writer ({{作}} write + {{家}}); reader ({{读}} read + {{者}}).', 'Đoán nghĩa từ cấu trúc: {{售货员}}, {{作家}}, {{读者}}.', 'Nhân viên bán hàng ({{售货}} bán hàng + {{员}}); nhà văn ({{作}} viết + {{家}}); độc giả ({{读}} đọc + {{者}}).'],
 ['Why did the writer miss class?', 'Because of a cold and a headache ({{感冒}}, {{头很疼}}).', 'Vì sao người viết nghỉ học?', 'Vì bị cảm và đau đầu ({{感冒}}, {{头很疼}}).'],
]);

E['crw201-ts-2-3'] = X(
`<p>Link each radical with a short memory story and with two or three high-frequency words, and you will recognise characters you have never seen before.</p>
<ul><li>{{衤}}: {{衬衫}} chènshān "shirt" and {{袜子}} wàzi "socks" both wear the clothes radical, so a stranger such as {{袖}} xiù "sleeve" is probably clothing as well.</li>
<li>{{石}}: {{碗}} wǎn "bowl" is made of ceramic, a stone-like material. {{破}} pò means broken, as when a stone cracks.</li>
<li>{{巾}}: {{帽子}} màozi "hat", {{布}} bù "cloth", {{市}} shì "market" — in the modern form of 市 the shape 巾 sits in the lower half.</li>
<li>{{雨}}: {{雪}}, {{雷}}, {{零}} and {{雾}} wù "fog" are all weather; the rain radical stays on top while the lower part adds sound or detail.</li></ul>
<div class="callout"><p lang="zh">今天零下三度，下雪了，我戴了帽子，还穿了厚袜子。</p>
<p>Jīntiān língxià sān dù, xià xuě le, wǒ dài le màozi, hái chuān le hòu wàzi.</p>
<p>Today it is three degrees below zero and it is snowing; I put on a hat and also thick socks.</p></div>
<p>Notice the verbs: {{戴}} for things worn on the head or face, {{穿}} for clothes and shoes. Vietnamese uses "đội" and "mang/mặc"; keep the two Chinese verbs apart.</p>`,
`<p>Gắn mỗi bộ thủ với một câu chuyện nhớ và hai ba từ thông dụng, bạn sẽ nhận ra cả những chữ chưa từng gặp.</p>
<ul><li>{{衤}}: {{衬衫}} chènshān "áo sơ mi" và {{袜子}} wàzi "tất" đều mang bộ y, nên một chữ lạ như {{袖}} xiù "tay áo" nhiều khả năng cũng thuộc quần áo.</li>
<li>{{石}}: {{碗}} wǎn "bát" làm bằng gốm, vật liệu giống đá. {{破}} pò nghĩa là vỡ, như đá nứt.</li>
<li>{{巾}}: {{帽子}} màozi "mũ", {{布}} bù "vải", {{市}} shì "chợ" — ở dạng chữ hiện đại của 市, hình 巾 nằm ở nửa dưới.</li>
<li>{{雨}}: {{雪}}, {{雷}}, {{零}} và {{雾}} wù "sương mù" đều thuộc thời tiết; bộ mưa luôn ở trên, phần dưới thêm âm hoặc chi tiết.</li></ul>
<div class="callout"><p lang="zh">今天零下三度，下雪了，我戴了帽子，还穿了厚袜子。</p>
<p>Jīntiān língxià sān dù, xià xuě le, wǒ dài le màozi, hái chuān le hòu wàzi.</p>
<p>Hôm nay âm ba độ, tuyết rơi, tôi đội mũ và còn mang tất dày.</p></div>
<p>Chú ý động từ: {{戴}} dùng cho đồ đội đầu hoặc đeo trên mặt, {{穿}} dùng cho quần áo và giày. Tiếng Việt có "đội", "mang/mặc"; hãy giữ hai động từ Trung Quốc tách biệt.</p>`,
[
 ['Which radical do {{袜}}, {{碗}} and {{雪}} contain?', '{{袜}} has {{衤}} (clothes); {{碗}} has {{石}} (stone); {{雪}} has {{雨}} (rain).', 'Các chữ {{袜}}, {{碗}}, {{雪}} chứa bộ nào?', '{{袜}} có {{衤}} (quần áo); {{碗}} có {{石}} (đá); {{雪}} có {{雨}} (mưa).'],
 ['Fill in {{戴}} or {{穿}}: {{他______着帽子，______着一件红衣服。}}', '{{他戴着帽子，穿着一件红衣服。}}', 'Điền {{戴}} hoặc {{穿}}: {{他______着帽子，______着一件红衣服。}}', '{{他戴着帽子，穿着一件红衣服。}}'],
]);

E['crw201-ts-2-4'] = X(
`<p>Three more phonetic families are worth memorising because they contain very common words. Compare the sounds carefully: the tone or the initial consonant often shifts.</p>
<table><thead><tr><th>Sound part</th><th>Family</th></tr></thead><tbody>
<tr><td>{{青}} qīng</td><td>{{清}} qīng clear, {{请}} qǐng please, {{情}} qíng feeling, {{晴}} qíng sunny, {{睛}} jīng (in {{眼睛}})</td></tr>
<tr><td>{{马}} mǎ</td><td>{{妈}} mā mother, {{吗}} ma question particle, {{骂}} mà scold, {{码}} mǎ number</td></tr>
<tr><td>{{方}} fāng</td><td>{{房}} fáng house, {{放}} fàng put, {{访}} fǎng visit</td></tr>
</tbody></table>
<p>The meaning part tells the field: {{氵}} water for {{清}}, {{讠}} speech for {{请}}, {{忄}} heart for {{情}}, {{日}} sun for {{晴}}, {{目}} eye for {{睛}}. So one sound part plus five meaning parts yields five different words.</p>
<div class="callout"><p lang="zh">今天天气晴，我的心情也很好，请大家放心。</p>
<p>Jīntiān tiānqì qíng, wǒ de xīnqíng yě hěn hǎo, qǐng dàjiā fàngxīn.</p>
<p>The weather is sunny today and I am in a good mood too, so please do not worry, everyone.</p></div>
<p>This one sentence contains {{晴}}, {{情}}, {{请}} and {{放}}: three of them share the {{青}} family. Writing it out by hand is a quick, useful drill.</p>`,
`<p>Có thêm ba họ thanh phù đáng nhớ vì chứa nhiều từ rất thông dụng. Hãy so sánh âm thật kỹ: thanh điệu hoặc phụ âm đầu thường lệch.</p>
<table><thead><tr><th>Thanh phù</th><th>Họ chữ</th></tr></thead><tbody>
<tr><td>{{青}} qīng</td><td>{{清}} qīng trong, {{请}} qǐng xin mời, {{情}} qíng tình cảm, {{晴}} qíng nắng, {{睛}} jīng (trong {{眼睛}})</td></tr>
<tr><td>{{马}} mǎ</td><td>{{妈}} mā mẹ, {{吗}} ma trợ từ nghi vấn, {{骂}} mà mắng, {{码}} mǎ số</td></tr>
<tr><td>{{方}} fāng</td><td>{{房}} fáng nhà, {{放}} fàng đặt, {{访}} fǎng thăm</td></tr>
</tbody></table>
<p>Phần nghĩa cho biết lĩnh vực: {{氵}} nước trong {{清}}, {{讠}} lời nói trong {{请}}, {{忄}} tim trong {{情}}, {{日}} mặt trời trong {{晴}}, {{目}} mắt trong {{睛}}. Một thanh phù cộng năm phần nghĩa cho ra năm từ khác nhau.</p>
<div class="callout"><p lang="zh">今天天气晴，我的心情也很好，请大家放心。</p>
<p>Jīntiān tiānqì qíng, wǒ de xīnqíng yě hěn hǎo, qǐng dàjiā fàngxīn.</p>
<p>Hôm nay trời nắng, tâm trạng tôi cũng rất tốt, mọi người cứ yên tâm.</p></div>
<p>Riêng câu này chứa {{晴}}, {{情}}, {{请}} và {{放}}: ba chữ cùng họ {{青}}. Chép tay cả câu là bài tập nhanh và hữu ích.</p>`,
[
 ['What sound part do {{清}}, {{请}}, {{情}} share, and which meaning part makes {{请}}?', 'The sound part {{青}}; {{请}} has {{讠}} (speech).', '{{清}}, {{请}}, {{情}} chung thanh phù nào, và bộ nghĩa nào tạo nên {{请}}?', 'Thanh phù {{青}}; {{请}} có bộ {{讠}} (lời nói).'],
 ['{{睛}} is read jīng, not qīng. What does this show about phonetic families?', 'The sound is only approximate: the initial consonant can differ, so check the dictionary.', '{{睛}} đọc là jīng, không phải qīng. Điều này cho thấy gì về họ thanh phù?', 'Âm chỉ gần đúng: phụ âm đầu có thể khác, nên phải tra từ điển.'],
]);

E['crw201-ts-4-1'] = X(
`<p>When a sentence gets long, build it as a <strong>skeleton first</strong>: subject, verb, object. Then hang modifiers in front of the verb, from big to small. This is the opposite of English, where details usually trail behind the verb.</p>
<ul><li><strong>Time</strong> goes from large to small: {{2026年11月9日上午九点}} (year, month, day, part of day, hour).</li>
<li><strong>Place</strong> phrases with {{在}}, {{从}}, {{到}} come before the verb: {{我从家到学校走路。}}, {{他在银行工作。}}</li>
<li><strong>Beneficiary or partner</strong> phrases with {{给}}, {{跟}}, {{和}} also stay in front: {{我给妈妈打电话。}} "I phone Mum", {{我跟老师学汉语。}}</li></ul>
<div class="callout"><p lang="zh">我每天早上七点从家出发，坐公共汽车去学校。我们八点开始上课，中午十二点在食堂吃饭。</p>
<p>Wǒ měi tiān zǎoshang qī diǎn cóng jiā chūfā, zuò gōnggòng qìchē qù xuéxiào. Wǒmen bā diǎn kāishǐ shàngkè, zhōngwǔ shí'èr diǎn zài shítáng chīfàn.</p>
<p>Every morning at seven I leave home and take the bus to school. We start class at eight, and at noon we eat in the canteen.</p></div>
<p>Check the second clause: subject {{我们}}, time {{八点}}, verb {{开始上课}}; then time {{中午十二点}}, place {{在食堂}}, verb {{吃饭}}. Nothing important sits behind the verb except the object.</p>
<p>A quick self-test before you hand in any text: underline every verb, then look immediately before it. Whatever answers "when, where, with whom, how" should be there.</p>`,
`<p>Khi câu dài, hãy dựng <strong>bộ khung trước</strong>: chủ ngữ, động từ, tân ngữ. Sau đó treo các thành phần bổ nghĩa phía trước động từ, từ lớn đến nhỏ. Điều này ngược với tiếng Anh, nơi chi tiết thường đứng sau động từ.</p>
<ul><li><strong>Thời gian</strong> đi từ lớn đến nhỏ: {{2026年11月9日上午九点}} (năm, tháng, ngày, buổi, giờ).</li>
<li><strong>Nơi chốn</strong> với {{在}}, {{从}}, {{到}} đứng trước động từ: {{我从家到学校走路。}}, {{他在银行工作。}}</li>
<li><strong>Đối tượng hoặc người cùng làm</strong> với {{给}}, {{跟}}, {{和}} cũng đứng trước: {{我给妈妈打电话。}} "tôi gọi điện cho mẹ", {{我跟老师学汉语。}}</li></ul>
<div class="callout"><p lang="zh">我每天早上七点从家出发，坐公共汽车去学校。我们八点开始上课，中午十二点在食堂吃饭。</p>
<p>Wǒ měi tiān zǎoshang qī diǎn cóng jiā chūfā, zuò gōnggòng qìchē qù xuéxiào. Wǒmen bā diǎn kāishǐ shàngkè, zhōngwǔ shí'èr diǎn zài shítáng chīfàn.</p>
<p>Mỗi sáng bảy giờ tôi từ nhà xuất phát, đi xe buýt đến trường. Tám giờ chúng tôi bắt đầu học, trưa mười hai giờ ăn ở nhà ăn.</p></div>
<p>Kiểm tra vế hai: chủ ngữ {{我们}}, thời gian {{八点}}, động từ {{开始上课}}; rồi thời gian {{中午十二点}}, nơi chốn {{在食堂}}, động từ {{吃饭}}. Sau động từ không có gì quan trọng ngoài tân ngữ.</p>
<p>Tự kiểm nhanh trước khi nộp bài: gạch chân mọi động từ, rồi nhìn ngay phía trước nó. Những gì trả lời "khi nào, ở đâu, với ai, thế nào" phải nằm ở đó.</p>`,
[
 ['Rearrange: {{在 / 他 / 医院 / 工作 / 现在}}', '{{他现在在医院工作。}}', 'Sắp xếp: {{在 / 他 / 医院 / 工作 / 现在}}', '{{他现在在医院工作。}}'],
 ['Rearrange: {{昨天 / 一起 / 我们 / 看电影 / 去}}', '{{我们昨天一起去看电影。}}', 'Sắp xếp: {{昨天 / 一起 / 我们 / 看电影 / 去}}', '{{我们昨天一起去看电影。}}'],
 ['Correct: {{我吃饭在食堂。}}', '{{我在食堂吃饭。}} The place phrase goes before the verb.', 'Sửa: {{我吃饭在食堂。}}', '{{我在食堂吃饭。}} Cụm chỉ nơi chốn đứng trước động từ.'],
]);

E['crw201-ts-4-2'] = X(
`<p>Two more points often appear in compositions. First, <strong>{{着}} in a chain of verbs</strong>: the first verb with {{着}} describes the manner of the second, as in {{他笑着说}} "he said, smiling" and {{站着吃饭}} "eat standing up". Second, <strong>not yet</strong>: use {{还没……呢}} or {{还没……过}} instead of a bare {{不}}.</p>
<table><thead><tr><th>Meaning</th><th>Pattern</th><th>Example</th></tr></thead><tbody>
<tr><td>already done</td><td>{{已经……了}}</td><td>{{我已经吃过早饭了。}}</td></tr>
<tr><td>not yet</td><td>{{还没……(呢)}}</td><td>{{他还没起床呢。}}</td></tr>
<tr><td>never</td><td>{{从来没……过}}</td><td>{{我从来没去过南京。}}</td></tr>
<tr><td>manner</td><td>{{V1着V2}}</td><td>{{她哭着跑出去了。}}</td></tr>
</tbody></table>
<div class="callout"><p lang="zh">老师笑着走进教室，手里拿着一本书。他问：“你们看过这本书吗？”大家说：“还没看过。”</p>
<p>Lǎoshī xiào zhe zǒu jìn jiàoshì, shǒu li ná zhe yì běn shū. Tā wèn: “Nǐmen kàn guo zhè běn shū ma?” Dàjiā shuō: “Hái méi kàn guo.”</p>
<p>The teacher walked into the classroom smiling, a book in his hand. He asked, "Have you read this book?" Everyone said, "Not yet."</p></div>
<p>Count the aspect markers: {{笑着}} (manner), {{拿着}} (state of holding), {{看过}} (experience). Each one answers a different question, which is why you cannot swap them freely.</p>`,
`<p>Hai điểm nữa hay xuất hiện trong bài viết. Thứ nhất, <strong>{{着}} trong chuỗi động từ</strong>: động từ đầu có {{着}} mô tả cách thức của động từ sau, như {{他笑着说}} "anh ấy vừa cười vừa nói" và {{站着吃饭}} "đứng ăn cơm". Thứ hai, <strong>chưa</strong>: dùng {{还没……呢}} hoặc {{还没……过}} thay cho {{不}} trơn.</p>
<table><thead><tr><th>Ý nghĩa</th><th>Mẫu</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>đã làm xong</td><td>{{已经……了}}</td><td>{{我已经吃过早饭了。}}</td></tr>
<tr><td>chưa</td><td>{{还没……(呢)}}</td><td>{{他还没起床呢。}}</td></tr>
<tr><td>chưa bao giờ</td><td>{{从来没……过}}</td><td>{{我从来没去过南京。}}</td></tr>
<tr><td>cách thức</td><td>{{V1着V2}}</td><td>{{她哭着跑出去了。}}</td></tr>
</tbody></table>
<div class="callout"><p lang="zh">老师笑着走进教室，手里拿着一本书。他问：“你们看过这本书吗？”大家说：“还没看过。”</p>
<p>Lǎoshī xiào zhe zǒu jìn jiàoshì, shǒu li ná zhe yì běn shū. Tā wèn: “Nǐmen kàn guo zhè běn shū ma?” Dàjiā shuō: “Hái méi kàn guo.”</p>
<p>Thầy cười bước vào lớp, tay cầm một cuốn sách. Thầy hỏi: "Các em đã đọc cuốn này chưa?" Cả lớp đáp: "Chưa ạ."</p></div>
<p>Đếm các dấu hiệu thể: {{笑着}} (cách thức), {{拿着}} (trạng thái đang cầm), {{看过}} (kinh nghiệm). Mỗi cái trả lời một câu hỏi khác nhau nên không thể đổi chỗ tuỳ ý.</p>`,
[
 ['Negate: {{他吃了早饭。}} (past)', '{{他没吃早饭。}} (no {{了}})', 'Phủ định: {{他吃了早饭。}} (quá khứ)', '{{他没吃早饭。}} (bỏ {{了}})'],
 ['Answer "not yet" to {{你写完作业了吗？}}', '{{还没写完呢。}}', 'Trả lời "chưa" cho {{你写完作业了吗？}}', '{{还没写完呢。}}'],
 ['Correct: {{我昨天没去了学校。}}', '{{我昨天没去学校。}} {{没}} and {{了}} do not occur together.', 'Sửa: {{我昨天没去了学校。}}', '{{我昨天没去学校。}} {{没}} và {{了}} không đi cùng nhau.'],
]);

E['crw201-ts-4-3'] = X(
`<p>Two complements deserve extra attention because the exam likes them. <strong>The potential complement</strong> says whether an action can be achieved. Affirmative: verb + {{得}} + result ({{看得见}} "can see"); negative: verb + {{不}} + result ({{看不见}} "cannot see"). With a verb alone, add {{了}} (read liǎo): {{吃得了}} "can finish eating", {{去不了}} "cannot go".</p>
<table><thead><tr><th>Can</th><th>Cannot</th><th>Meaning</th></tr></thead><tbody>
<tr><td>{{听得懂}}</td><td>{{听不懂}}</td><td>understand by listening</td></tr>
<tr><td>{{写得好}}</td><td>{{写不好}}</td><td>write well enough</td></tr>
<tr><td>{{吃得完}}</td><td>{{吃不完}}</td><td>be able to finish eating</td></tr>
</tbody></table>
<p>The second point is the <strong>degree complement used for evaluation</strong>. It describes <em>how</em> something is done and always needs {{得}}; adverbs such as {{很}} or {{特别}} come before the adjective, never after it.</p>
<div class="callout"><p lang="zh">这个字太难了，我写不好。老师说，只要多练习，一定写得好。现在我每天写二十个字，写得越来越整齐了。</p>
<p>Zhè ge zì tài nán le, wǒ xiě bù hǎo. Lǎoshī shuō, zhǐyào duō liànxí, yídìng xiě de hǎo. Xiànzài wǒ měi tiān xiě èrshí gè zì, xiě de yuè lái yuè zhěngqí le.</p>
<p>This character is too hard and I cannot write it well. The teacher says that as long as I practise more I will certainly write it well. Now I write twenty characters every day, and my writing is getting neater and neater.</p></div>`,
`<p>Có hai bổ ngữ đáng chú ý thêm vì đề thi rất thích. <strong>Bổ ngữ khả năng</strong> cho biết một hành động có làm được không. Khẳng định: động từ + {{得}} + kết quả ({{看得见}} "nhìn thấy được"); phủ định: động từ + {{不}} + kết quả ({{看不见}} "không nhìn thấy"). Với động từ đứng một mình, thêm {{了}} (đọc liǎo): {{吃得了}} "ăn xong được", {{去不了}} "không đi được".</p>
<table><thead><tr><th>Được</th><th>Không được</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>{{听得懂}}</td><td>{{听不懂}}</td><td>nghe hiểu</td></tr>
<tr><td>{{写得好}}</td><td>{{写不好}}</td><td>viết đủ tốt</td></tr>
<tr><td>{{吃得完}}</td><td>{{吃不完}}</td><td>ăn hết được</td></tr>
</tbody></table>
<p>Điểm thứ hai là <strong>bổ ngữ trình độ dùng để đánh giá</strong>. Nó mô tả việc được làm <em>như thế nào</em> và luôn cần {{得}}; phó từ như {{很}} hay {{特别}} đứng trước tính từ, không bao giờ đứng sau.</p>
<div class="callout"><p lang="zh">这个字太难了，我写不好。老师说，只要多练习，一定写得好。现在我每天写二十个字，写得越来越整齐了。</p>
<p>Zhè ge zì tài nán le, wǒ xiě bù hǎo. Lǎoshī shuō, zhǐyào duō liànxí, yídìng xiě de hǎo. Xiànzài wǒ měi tiān xiě èrshí gè zì, xiě de yuè lái yuè zhěngqí le.</p>
<p>Chữ này khó quá, tôi viết không đẹp. Thầy nói chỉ cần luyện nhiều thì nhất định viết đẹp. Bây giờ mỗi ngày tôi viết hai mươi chữ, nét chữ ngày càng ngay ngắn.</p></div>`,
[
 ['Say "I cannot understand what he says" with a potential complement.', '{{他说的话我听不懂。}}', 'Nói "tôi không hiểu anh ấy nói gì" bằng bổ ngữ khả năng.', '{{他说的话我听不懂。}}'],
 ['Correct: {{他说汉语得很好。}}', '{{他说汉语说得很好。}} (repeat the verb)', 'Sửa: {{他说汉语得很好。}}', '{{他说汉语说得很好。}} (lặp động từ)'],
 ['Is {{他跑得快很}} correct?', 'No. Write {{他跑得很快。}}', '{{他跑得快很}} có đúng không?', 'Không. Viết {{他跑得很快。}}'],
]);

E['crw201-ts-4-4'] = X(
`<p>The three patterns can be extended in ways that appear in writing tasks.</p>
<ul><li><strong>把 with a destination or result noun.</strong> After {{把}} + object the verb is often followed by {{在}} (place), {{到}} (arrival), {{给}} (recipient) or {{成}} (becoming): {{把书放在桌子上}} "put the book on the table", {{把作业交给老师}} "hand the homework to the teacher", {{把这句话翻译成英语}} "translate this sentence into English".</li>
<li><strong>被 with an unnamed agent.</strong> If the doer is unknown or unimportant, omit it: {{我的自行车被骑走了。}} If you name the agent, keep it right after {{被}}: {{被弟弟拿走了}}.</li>
<li><strong>比 with a quantity.</strong> The difference goes after the adjective: {{哥哥比我大两岁}}, {{这个比那个贵十块钱}}. For "less than", use {{不如}} ({{我不如他高}}) or {{没有}} ({{我没有他高}}).</li></ul>
<div class="callout"><p lang="zh">老师把作业发给了我们，我的汉字写得比以前好多了。可是我的练习本被小林借走了，我只好把句子写在一张白纸上。</p>
<p>Lǎoshī bǎ zuòyè fā gěi le wǒmen, wǒ de Hànzì xiě de bǐ yǐqián hǎo duō le. Kěshì wǒ de liànxíběn bèi Xiǎo Lín jiè zǒu le, wǒ zhǐhǎo bǎ jùzi xiě zài yì zhāng bái zhǐ shang.</p>
<p>The teacher handed the homework out to us, and my characters are much better than before. But my exercise book was borrowed by Xiao Lin, so I had to write the sentences on a sheet of white paper.</p></div>
<p>Find the patterns: {{把作业发给我们}} (recipient), {{比以前好多了}} (comparison with {{多了}}), {{被小林借走了}} (agent named), {{把句子写在……上}} (destination).</p>`,
`<p>Ba mẫu này có thể mở rộng theo những cách hay gặp trong bài viết.</p>
<ul><li><strong>把 với đích đến hoặc danh từ kết quả.</strong> Sau {{把}} + tân ngữ, động từ thường kèm {{在}} (nơi chốn), {{到}} (đến), {{给}} (người nhận) hoặc {{成}} (trở thành): {{把书放在桌子上}} "đặt sách lên bàn", {{把作业交给老师}} "nộp bài cho thầy", {{把这句话翻译成英语}} "dịch câu này sang tiếng Anh".</li>
<li><strong>被 với tác nhân không nêu.</strong> Nếu không biết hoặc không quan trọng người làm thì bỏ đi: {{我的自行车被骑走了。}} Nếu nêu tác nhân, đặt ngay sau {{被}}: {{被弟弟拿走了}}.</li>
<li><strong>比 kèm số lượng.</strong> Phần chênh lệch đứng sau tính từ: {{哥哥比我大两岁}}, {{这个比那个贵十块钱}}. Muốn nói "kém hơn" dùng {{不如}} ({{我不如他高}}) hoặc {{没有}} ({{我没有他高}}).</li></ul>
<div class="callout"><p lang="zh">老师把作业发给了我们，我的汉字写得比以前好多了。可是我的练习本被小林借走了，我只好把句子写在一张白纸上。</p>
<p>Lǎoshī bǎ zuòyè fā gěi le wǒmen, wǒ de Hànzì xiě de bǐ yǐqián hǎo duō le. Kěshì wǒ de liànxíběn bèi Xiǎo Lín jiè zǒu le, wǒ zhǐhǎo bǎ jùzi xiě zài yì zhāng bái zhǐ shang.</p>
<p>Thầy phát bài tập cho chúng tôi, chữ của tôi viết đẹp hơn trước nhiều. Nhưng vở bài tập của tôi bị Tiểu Lâm mượn đi mất, nên tôi đành viết các câu lên một tờ giấy trắng.</p></div>
<p>Tìm các mẫu: {{把作业发给我们}} (người nhận), {{比以前好多了}} (so sánh với {{多了}}), {{被小林借走了}} (nêu tác nhân), {{把句子写在……上}} (đích đến).</p>`,
[
 ['Rewrite with {{把}}: {{我写完了作业。}}', '{{我把作业写完了。}}', 'Viết lại bằng {{把}}: {{我写完了作业。}}', '{{我把作业写完了。}}'],
 ['My brother is 20 and I am 18. Write it with {{比}}.', '{{哥哥比我大两岁。}}', 'Anh tôi 20 tuổi, tôi 18. Viết bằng {{比}}.', '{{哥哥比我大两岁。}}'],
 ['Rewrite as a passive: {{小林借走了我的书。}}', '{{我的书被小林借走了。}}', 'Viết lại thành câu bị động: {{小林借走了我的书。}}', '{{我的书被小林借走了。}}'],
]);

E['crw201-ts-5-1'] = X(
`<p>Three finer points save marks in handwritten tasks. First, the <strong>dash</strong> {{——}} takes two cells and adds an explanation: {{我的爱好——看书——很便宜。}} Second, the <strong>brackets</strong> {{（ ）}} hold a short note. Third, the closing quotation mark follows the final stop of the speech: {{他说：“我很累。”}}, but when the quotation is part of a longer sentence the stop goes outside: {{他说“我很累”，然后就睡了。}}</p>
<p>On a computer, check every mark after typing. The most common slip is a half-width English comma that looks thin and touches the next character.</p>
<div class="callout"><p lang="zh">老师问：“你们周末做什么？”小林说：“我去图书馆借了三本书：《红楼梦》、《西游记》和《骆驼祥子》。”</p>
<p>Lǎoshī wèn: “Nǐmen zhōumò zuò shénme?” Xiǎo Lín shuō: “Wǒ qù túshūguǎn jiè le sān běn shū: 《Hónglóumèng》, 《Xīyóujì》 hé 《Luòtuo Xiángzi》.”</p>
<p>The teacher asked, "What do you do at the weekend?" Xiao Lin said, "I went to the library and borrowed three books: Dream of the Red Chamber, Journey to the West and Camel Xiangzi."</p></div>
<p>Notice the colon before the list, the title marks around each book, and {{、}} is not needed here because {{和}} joins the last two titles; the first comma between titles is {{、}}.</p>`,
`<p>Ba điểm tinh tế giúp giữ điểm trong bài viết tay. Thứ nhất, <strong>dấu gạch ngang</strong> {{——}} chiếm hai ô và thêm lời giải thích: {{我的爱好——看书——很便宜。}} Thứ hai, <strong>ngoặc đơn</strong> {{（ ）}} chứa ghi chú ngắn. Thứ ba, dấu nháy đóng đứng sau dấu chấm cuối lời nói: {{他说：“我很累。”}}, còn khi câu trích là một phần của câu dài hơn thì dấu chấm ra ngoài: {{他说“我很累”，然后就睡了。}}</p>
<p>Trên máy tính, hãy kiểm tra mọi dấu sau khi gõ. Lỗi phổ biến nhất là dấu phẩy tiếng Anh nửa chiều rộng, mảnh và dính vào chữ kế bên.</p>
<div class="callout"><p lang="zh">老师问：“你们周末做什么？”小林说：“我去图书馆借了三本书：《红楼梦》、《西游记》和《骆驼祥子》。”</p>
<p>Lǎoshī wèn: “Nǐmen zhōumò zuò shénme?” Xiǎo Lín shuō: “Wǒ qù túshūguǎn jiè le sān běn shū: 《Hónglóumèng》, 《Xīyóujì》 hé 《Luòtuo Xiángzi》.”</p>
<p>Thầy hỏi: "Cuối tuần các em làm gì?" Tiểu Lâm nói: "Em đến thư viện mượn ba cuốn: Hồng lâu mộng, Tây du ký và Lạc đà Tường Tử."</p></div>
<p>Chú ý dấu hai chấm trước danh sách, dấu tên sách quanh mỗi cuốn; giữa hai tên đầu dùng {{、}}, còn {{和}} nối tên cuối.</p>`,
[
 ['Punctuate: {{我喜欢苹果香蕉和西瓜}}', '{{我喜欢苹果、香蕉和西瓜。}}', 'Thêm dấu: {{我喜欢苹果香蕉和西瓜}}', '{{我喜欢苹果、香蕉和西瓜。}}'],
 ['Which mark belongs around the title of a film?', '{{《 》}}, the title marks.', 'Dấu nào đặt quanh tên một bộ phim?', '{{《 》}}, dấu tên sách.'],
]);

E['crw201-ts-5-2'] = X(
`<p>Learners often know the pairs but still write choppy text. Use connectors to <strong>merge</strong> sentences. Start with two short sentences: {{我很累。我还想看电影。}} With a pair of connectors they become {{虽然我很累，但是我还想看电影。}} Now the contrast is explicit and the reader does not have to guess.</p>
<p>Also learn the <strong>single-word connectors</strong> that join sentences rather than clauses: {{然后}} then, {{后来}} later, {{所以}} so, {{可是}} but, {{而且}} moreover, {{另外}} besides, {{最后}} finally. Choose different ones in neighbouring sentences so the text does not repeat {{然后}} five times.</p>
<div class="callout"><p lang="zh">我先去超市买菜，然后回家做饭。因为朋友要来，所以我做了四个菜。虽然有点儿累，但是大家吃得很高兴，我也很开心。</p>
<p>Wǒ xiān qù chāoshì mǎi cài, ránhòu huí jiā zuòfàn. Yīnwèi péngyou yào lái, suǒyǐ wǒ zuò le sì gè cài. Suīrán yǒudiǎnr lèi, dànshì dàjiā chī de hěn gāoxìng, wǒ yě hěn kāixīn.</p>
<p>I first went to the supermarket to buy food, then went home to cook. Because friends were coming, I made four dishes. Although I was a little tired, everyone ate happily and I was happy too.</p></div>
<p>Three relations (sequence, cause, contrast) in three sentences, one relation each, as the rule requires.</p>`,
`<p>Người học thường biết các cặp liên từ nhưng vẫn viết rời rạc. Hãy dùng liên từ để <strong>gộp</strong> câu. Bắt đầu với hai câu ngắn: {{我很累。我还想看电影。}} Với một cặp liên từ chúng thành {{虽然我很累，但是我还想看电影。}} Lúc này sự tương phản đã rõ và người đọc không phải đoán.</p>
<p>Cũng cần học các <strong>liên từ đơn</strong> nối câu chứ không nối mệnh đề: {{然后}} sau đó, {{后来}} về sau, {{所以}} cho nên, {{可是}} nhưng, {{而且}} hơn nữa, {{另外}} ngoài ra, {{最后}} cuối cùng. Chọn từ khác nhau ở các câu liền kề để văn bản không lặp {{然后}} năm lần.</p>
<div class="callout"><p lang="zh">我先去超市买菜，然后回家做饭。因为朋友要来，所以我做了四个菜。虽然有点儿累，但是大家吃得很高兴，我也很开心。</p>
<p>Wǒ xiān qù chāoshì mǎi cài, ránhòu huí jiā zuòfàn. Yīnwèi péngyou yào lái, suǒyǐ wǒ zuò le sì gè cài. Suīrán yǒudiǎnr lèi, dànshì dàjiā chī de hěn gāoxìng, wǒ yě hěn kāixīn.</p>
<p>Tôi đi siêu thị mua thức ăn trước, rồi về nhà nấu cơm. Vì bạn sắp đến nên tôi nấu bốn món. Tuy hơi mệt nhưng mọi người ăn rất vui, tôi cũng vui.</p></div>
<p>Ba quan hệ (trình tự, nguyên nhân, tương phản) trong ba câu, mỗi câu một quan hệ, đúng như quy tắc.</p>`,
[
 ['Merge with {{因为……所以……}}: {{天气很冷。我穿了厚衣服。}}', '{{因为天气很冷，所以我穿了厚衣服。}}', 'Gộp bằng {{因为……所以……}}: {{天气很冷。我穿了厚衣服。}}', '{{因为天气很冷，所以我穿了厚衣服。}}'],
 ['Merge with {{不但……而且……}}: {{他会唱歌。他会跳舞。}}', '{{他不但会唱歌，而且会跳舞。}}', 'Gộp bằng {{不但……而且……}}: {{他会唱歌。他会跳舞。}}', '{{他不但会唱歌，而且会跳舞。}}'],
]);

E['crw201-ts-5-3'] = X(
`<p>A paragraph also needs a <strong>transition</strong> to the next paragraph when you write more than one. Useful openers: {{另外}} besides, {{除此以外}} apart from this, {{第二天}} the next day, {{最后}} finally. Keep the topic of each paragraph to one idea.</p>
<p>Check the paragraph by asking three questions: Can a stranger state the topic after reading only the first sentence? Does every middle sentence support that topic? Does the last sentence close without starting a new topic?</p>
<div class="callout"><p lang="zh">我喜欢在早上学习。早上空气新鲜，教室里很安静，我能很快记住新词。中午以后我常常觉得累，学得就慢了。所以我每天六点起床，先复习汉字，再做练习。</p>
<p>Wǒ xǐhuan zài zǎoshang xuéxí. Zǎoshang kōngqì xīnxiān, jiàoshì li hěn ānjìng, wǒ néng hěn kuài jìzhù xīn cí. Zhōngwǔ yǐhòu wǒ chángcháng juéde lèi, xué de jiù màn le. Suǒyǐ wǒ měi tiān liù diǎn qǐchuáng, xiān fùxí hànzì, zài zuò liànxí.</p>
<p>I like to study in the morning. The morning air is fresh, the classroom is quiet and I can remember new words quickly. After noon I often feel tired and learn more slowly. So I get up at six every day, first review characters and then do exercises.</p></div>
<p>Topic: {{我喜欢在早上学习}}. Support: two reasons, one contrast. Closing: the resulting habit.</p>`,
`<p>Khi viết nhiều đoạn, mỗi đoạn cần một <strong>câu chuyển</strong> sang đoạn tiếp. Các từ mở hữu ích: {{另外}} ngoài ra, {{除此以外}} ngoài điều này, {{第二天}} hôm sau, {{最后}} cuối cùng. Mỗi đoạn chỉ nên có một ý.</p>
<p>Kiểm tra đoạn văn bằng ba câu hỏi: Người lạ chỉ đọc câu đầu có nêu được chủ đề không? Mọi câu ở giữa có bổ trợ cho chủ đề đó không? Câu cuối có khép lại mà không mở chủ đề mới không?</p>
<div class="callout"><p lang="zh">我喜欢在早上学习。早上空气新鲜，教室里很安静，我能很快记住新词。中午以后我常常觉得累，学得就慢了。所以我每天六点起床，先复习汉字，再做练习。</p>
<p>Wǒ xǐhuan zài zǎoshang xuéxí. Zǎoshang kōngqì xīnxiān, jiàoshì li hěn ānjìng, wǒ néng hěn kuài jìzhù xīn cí. Zhōngwǔ yǐhòu wǒ chángcháng juéde lèi, xué de jiù màn le. Suǒyǐ wǒ měi tiān liù diǎn qǐchuáng, xiān fùxí hànzì, zài zuò liànxí.</p>
<p>Tôi thích học vào buổi sáng. Không khí buổi sáng trong lành, lớp học yên tĩnh, tôi nhớ từ mới rất nhanh. Sau buổi trưa tôi thường thấy mệt nên học chậm hơn. Vì vậy mỗi ngày tôi dậy lúc sáu giờ, ôn chữ Hán trước rồi mới làm bài tập.</p></div>
<p>Chủ đề: {{我喜欢在早上学习}}. Bổ trợ: hai lý do và một tương phản. Kết: thói quen rút ra.</p>`,
[
 ['Which sentence is the topic sentence in the morning paragraph?', '{{我喜欢在早上学习。}}', 'Câu nào là câu chủ đề trong đoạn về buổi sáng?', '{{我喜欢在早上学习。}}'],
 ['Write a topic sentence for a paragraph about your family.', 'For example: {{我的家人都很爱运动。}}', 'Viết một câu chủ đề cho đoạn về gia đình bạn.', 'Ví dụ: {{我的家人都很爱运动。}}'],
]);

E['crw201-ts-5-4'] = X(
`<p>Cohesion also comes from <strong>repeating key nouns on purpose</strong> when a pronoun would be unclear, and from <strong>synonyms</strong> that avoid monotony: {{老师}} then {{王老师}} then {{他}}. Another device is the <strong>topic chain</strong>: introduce the topic once, then let several clauses comment on it without repeating it.</p>
<p>Compare the choppy version {{这家店很小。这家店很干净。这家店的菜很好吃。}} with the chained version {{这家店很小，但是很干净，菜也很好吃。}} The second is shorter and sounds natural.</p>
<div class="callout"><p lang="zh">小林有一只猫，名字叫“雪球”。它全身白色，眼睛是蓝色的，每天都睡在窗边。小林很爱它，下课以后总是马上回家陪它玩儿。</p>
<p>Xiǎo Lín yǒu yì zhī māo, míngzi jiào “Xuěqiú”. Tā quánshēn báisè, yǎnjing shì lánsè de, měi tiān dōu shuì zài chuāng biān. Xiǎo Lín hěn ài tā, xiàkè yǐhòu zǒngshì mǎshàng huí jiā péi tā wánr.</p>
<p>Xiao Lin has a cat called Snowball. It is white all over, its eyes are blue, and it sleeps by the window every day. Xiao Lin loves it very much and after class always goes straight home to play with it.</p></div>
<p>Here {{它}} refers to the cat and the second {{小林}} is repeated deliberately, because the subject changes from the cat back to the person.</p>`,
`<p>Liên kết còn đến từ việc <strong>cố ý lặp danh từ then chốt</strong> khi đại từ gây mơ hồ, và từ <strong>từ đồng nghĩa</strong> để tránh đơn điệu: {{老师}} rồi {{王老师}} rồi {{他}}. Một cách nữa là <strong>chuỗi chủ đề</strong>: nêu chủ đề một lần, rồi nhiều mệnh đề cùng bình luận về nó mà không lặp lại.</p>
<p>So sánh bản rời rạc {{这家店很小。这家店很干净。这家店的菜很好吃。}} với bản liền mạch {{这家店很小，但是很干净，菜也很好吃。}} Bản sau ngắn hơn và tự nhiên hơn.</p>
<div class="callout"><p lang="zh">小林有一只猫，名字叫“雪球”。它全身白色，眼睛是蓝色的，每天都睡在窗边。小林很爱它，下课以后总是马上回家陪它玩儿。</p>
<p>Xiǎo Lín yǒu yì zhī māo, míngzi jiào “Xuěqiú”. Tā quánshēn báisè, yǎnjing shì lánsè de, měi tiān dōu shuì zài chuāng biān. Xiǎo Lín hěn ài tā, xiàkè yǐhòu zǒngshì mǎshàng huí jiā péi tā wánr.</p>
<p>Tiểu Lâm có một con mèo tên "Cầu Tuyết". Nó toàn thân màu trắng, mắt xanh, ngày nào cũng ngủ bên cửa sổ. Tiểu Lâm rất yêu nó, tan học luôn về nhà ngay để chơi với nó.</p></div>
<p>Ở đây {{它}} chỉ con mèo, còn {{小林}} thứ hai được lặp có chủ ý vì chủ ngữ chuyển từ con mèo về người.</p>`,
[
 ['Combine: {{这本书很贵。这本书很有意思。}}', '{{这本书很贵，但是很有意思。}}', 'Gộp: {{这本书很贵。这本书很有意思。}}', '{{这本书很贵，但是很有意思。}}'],
 ['In the cat text, what does {{它}} refer to?', 'The cat, {{雪球}}.', 'Trong đoạn về con mèo, {{它}} chỉ gì?', 'Con mèo, {{雪球}}.'],
]);

E['crw201-ts-6-2'] = X(
`<p>Two special situations come up often. <strong>Asking for leave</strong> must say who, when and why, and thank the teacher in advance. <strong>Reporting a problem</strong> (a missed file, a wrong time) should state the facts in a line, then ask for help. Never end with a bare {{怎么办？}} for a teacher; offer your own idea first.</p>
<div class="callout"><p lang="zh">李老师好！我是汉语二班的阮明。我明天上午发烧，不能去上课，想请一天假。我会请同学把笔记发给我。谢谢老师！</p>
<p>Lǐ lǎoshī hǎo! Wǒ shì Hànyǔ èr bān de Ruǎn Míng. Wǒ míngtiān shàngwǔ fāshāo, bù néng qù shàngkè, xiǎng qǐng yì tiān jià. Wǒ huì qǐng tóngxué bǎ bǐjì fā gěi wǒ. Xièxie lǎoshī!</p>
<p>Hello Teacher Li! I am Nguyen Minh from Chinese class 2. I have a fever tomorrow morning and cannot come to class, so I would like to ask for a day's leave. I will ask a classmate to send me the notes. Thank you!</p></div>
<p>Identity, reason, request, a plan, thanks — five short sentences. Also learn the friend version: {{我明天去不了，帮我请个假，行吗？}}</p>`,
`<p>Có hai tình huống đặc biệt hay gặp. <strong>Xin nghỉ</strong> phải nói rõ ai, khi nào, vì sao và cảm ơn thầy cô trước. <strong>Báo sự cố</strong> (nhầm tệp, sai giờ) nên nêu sự việc trong một dòng rồi nhờ giúp. Đừng kết thúc bằng một câu {{怎么办？}} trống không với thầy cô; hãy đưa ra cách của mình trước.</p>
<div class="callout"><p lang="zh">李老师好！我是汉语二班的阮明。我明天上午发烧，不能去上课，想请一天假。我会请同学把笔记发给我。谢谢老师！</p>
<p>Lǐ lǎoshī hǎo! Wǒ shì Hànyǔ èr bān de Ruǎn Míng. Wǒ míngtiān shàngwǔ fāshāo, bù néng qù shàngkè, xiǎng qǐng yì tiān jià. Wǒ huì qǐng tóngxué bǎ bǐjì fā gěi wǒ. Xièxie lǎoshī!</p>
<p>Chào thầy Lý! Em là Nguyễn Minh lớp tiếng Trung 2. Sáng mai em bị sốt, không đến lớp được nên xin nghỉ một ngày. Em sẽ nhờ bạn gửi ghi chép. Em cảm ơn thầy!</p></div>
<p>Danh tính, lý do, đề nghị, kế hoạch, lời cảm ơn — năm câu ngắn. Cũng học bản dành cho bạn: {{我明天去不了，帮我请个假，行吗？}}</p>`,
[
 ['Name the five parts of the leave message.', 'Identity, reason, request, plan, thanks.', 'Kể tên năm phần của tin nhắn xin nghỉ.', 'Danh tính, lý do, đề nghị, kế hoạch, cảm ơn.'],
 ['Make this polite for a teacher: {{告诉我作业。}}', '{{老师，请问今天的作业是什么？麻烦您了。}}', 'Làm lịch sự cho thầy cô: {{告诉我作业。}}', '{{老师，请问今天的作业是什么？麻烦您了。}}'],
]);

E['crw201-ts-6-3'] = X(
`<p>Invitations vary with the relationship. To a friend a message is enough: {{周末有空吗？一起去看电影吧！}} To a teacher or an older person use {{请}} and {{您}}: {{老师，下周六我们班想请您参加毕业聚会，您有时间吗？}}</p>
<p>A good reply to an invitation never leaves the host guessing. Even when you are unsure, say when you will know: {{我这周五告诉你，好吗？}} Two more acceptance frames are {{没问题，到时候见！}} and {{谢谢你想到我，我很高兴去。}}</p>
<div class="callout"><p lang="zh">小林，谢谢你的邀请！我很想去，可是那天下午我要考试，晚上六点才能结束。我考完试就马上过去，可以吗？</p>
<p>Xiǎo Lín, xièxie nǐ de yāoqǐng! Wǒ hěn xiǎng qù, kěshì nà tiān xiàwǔ wǒ yào kǎoshì, wǎnshang liù diǎn cái néng jiéshù. Wǒ kǎo wán shì jiù mǎshàng guòqù, kěyǐ ma?</p>
<p>Xiao Lin, thank you for the invitation! I would love to come, but that afternoon I have an exam which will not finish until six in the evening. I will come over right after the exam, if that is all right.</p></div>
<p>A partial acceptance: it thanks, explains in one clause, and gives a concrete alternative.</p>`,
`<p>Lời mời thay đổi theo mối quan hệ. Với bạn, một tin nhắn là đủ: {{周末有空吗？一起去看电影吧！}} Với thầy cô hoặc người lớn tuổi dùng {{请}} và {{您}}: {{老师，下周六我们班想请您参加毕业聚会，您有时间吗？}}</p>
<p>Câu trả lời tốt không để chủ nhà phải đoán. Dù chưa chắc cũng nên nói khi nào sẽ biết: {{我这周五告诉你，好吗？}} Thêm hai mẫu nhận lời: {{没问题，到时候见！}} và {{谢谢你想到我，我很高兴去。}}</p>
<div class="callout"><p lang="zh">小林，谢谢你的邀请！我很想去，可是那天下午我要考试，晚上六点才能结束。我考完试就马上过去，可以吗？</p>
<p>Xiǎo Lín, xièxie nǐ de yāoqǐng! Wǒ hěn xiǎng qù, kěshì nà tiān xiàwǔ wǒ yào kǎoshì, wǎnshang liù diǎn cái néng jiéshù. Wǒ kǎo wán shì jiù mǎshàng guòqù, kěyǐ ma?</p>
<p>Tiểu Lâm, cảm ơn lời mời của bạn! Mình rất muốn đến, nhưng chiều hôm đó mình thi, sáu giờ tối mới xong. Thi xong mình sẽ qua ngay, được không?</p></div>
<p>Đây là nhận lời một phần: cảm ơn, giải thích trong một mệnh đề và đưa ra phương án cụ thể.</p>`,
[
 ['Write a short invitation to a friend for a film on Sunday at 3 p.m.', 'For example: {{星期天下午三点我们一起去看电影，好吗？}}', 'Viết lời mời ngắn rủ bạn xem phim Chủ nhật lúc 3 giờ chiều.', 'Ví dụ: {{星期天下午三点我们一起去看电影，好吗？}}'],
 ['What three things should a refusal contain?', 'Thanks, a short reason with an apology, and an alternative.', 'Lời từ chối nên có ba điều gì?', 'Cảm ơn, lý do ngắn kèm xin lỗi, và phương án thay thế.'],
]);

E['crw201-ts-6-4'] = X(
`<p>Notices share a vocabulary worth memorising: {{兹通知}} (formal: "hereby notified"), {{请大家准时参加}} "please attend on time", {{如有变化}} "if anything changes", {{特此通知}} "notified accordingly". At HSK 3 you only need the simple version, but you should recognise these when you read.</p>
<p>A second common short text is the <strong>lost-and-found notice</strong> 寻物启事. It names the item, where and when it was lost, and a contact.</p>
<div class="callout"><p lang="zh">寻物启事 / 本人昨天下午在图书馆丢了一个黑色的钱包，里面有学生证和一些钱。捡到的同学请联系我，电话：0912345678，谢谢！ 阮明 11月9日</p>
<p>Xúnwù qǐshì / Běnrén zuótiān xiàwǔ zài túshūguǎn diū le yí gè hēisè de qiánbāo, lǐmiàn yǒu xuéshēngzhèng hé yìxiē qián. Jiǎndào de tóngxué qǐng liánxì wǒ, diànhuà: líng jiǔ yāo èr sān sì wǔ liù qī bā, xièxie! Ruǎn Míng, shíyī yuè jiǔ rì.</p>
<p>Lost item notice. Yesterday afternoon I lost a black wallet in the library; it holds a student card and some money. Whoever finds it please contact me, phone 0912345678, thank you! Nguyen Minh, 9 Nov.</p></div>
<p>In phone numbers {{1}} is often read {{yāo}} to avoid confusion with {{7}} ({{qī}}).</p>`,
`<p>Thông báo có vốn từ chung đáng nhớ: {{兹通知}} (trang trọng: "nay thông báo"), {{请大家准时参加}} "đề nghị mọi người tham dự đúng giờ", {{如有变化}} "nếu có thay đổi", {{特此通知}} "xin thông báo". Ở HSK 3 chỉ cần bản đơn giản, nhưng cần nhận ra các cụm này khi đọc.</p>
<p>Một văn bản ngắn phổ biến khác là <strong>thông báo tìm đồ</strong> 寻物启事. Nó nêu đồ vật, nơi và lúc mất, và cách liên hệ.</p>
<div class="callout"><p lang="zh">寻物启事 / 本人昨天下午在图书馆丢了一个黑色的钱包，里面有学生证和一些钱。捡到的同学请联系我，电话：0912345678，谢谢！ 阮明 11月9日</p>
<p>Xúnwù qǐshì / Běnrén zuótiān xiàwǔ zài túshūguǎn diū le yí gè hēisè de qiánbāo, lǐmiàn yǒu xuéshēngzhèng hé yìxiē qián. Jiǎndào de tóngxué qǐng liánxì wǒ, diànhuà: líng jiǔ yāo èr sān sì wǔ liù qī bā, xièxie! Ruǎn Míng, shíyī yuè jiǔ rì.</p>
<p>Thông báo tìm đồ. Chiều qua tôi làm mất một chiếc ví đen ở thư viện, bên trong có thẻ sinh viên và ít tiền. Bạn nào nhặt được xin liên hệ, điện thoại 0912345678, cảm ơn! Nguyễn Minh, 9/11.</p></div>
<p>Trong số điện thoại, {{1}} thường đọc là {{yāo}} để khỏi nhầm với {{7}} ({{qī}}).</p>`,
[
 ['What four facts does a lost-item notice give?', 'The item, the place, the time, and a contact.', 'Thông báo tìm đồ nêu bốn thông tin nào?', 'Đồ vật, nơi mất, thời gian mất và cách liên hệ.'],
 ['Write today\'s date in Chinese form: 9 November 2026.', '{{2026年11月9日}}', 'Viết ngày 9 tháng 11 năm 2026 theo dạng tiếng Trung.', '{{2026年11月9日}}'],
]);

E['crw201-ts-7-1'] = X(
`<p>The closing wish deserves a closer look because it is where learners sound unnatural. A formal closing is two lines: {{此致}} on the first line and {{敬礼！}} on the next, both left-aligned or indented as your teacher asks. Between friends use one line, {{祝你一切顺利！}} or {{保重！}}</p>
<p>Wishes can match the occasion: {{祝你生日快乐}} birthday, {{祝你新年快乐}} New Year, {{祝你考试顺利}} exams, {{祝您身体健康}} (for elders). The signature goes on the right below the wish, and the date goes under it.</p>
<div class="callout"><p lang="zh">亲爱的小林：你好！下个星期我要考试了，有点儿紧张。你能给我几个学习建议吗？谢谢你！祝你天天开心！ 你的朋友 阮明 2026年11月9日</p>
<p>Qīn'ài de Xiǎo Lín: Nǐ hǎo! Xià ge xīngqī wǒ yào kǎoshì le, yǒudiǎnr jǐnzhāng. Nǐ néng gěi wǒ jǐ gè xuéxí jiànyì ma? Xièxie nǐ! Zhù nǐ tiāntiān kāixīn! Nǐ de péngyou Ruǎn Míng, èr líng èr liù nián shíyī yuè jiǔ rì.</p>
<p>Dear Xiao Lin: Hello! Next week I have an exam and I am a bit nervous. Could you give me a few study tips? Thank you! Wishing you happiness every day! Your friend Nguyen Minh, 9 November 2026.</p></div>`,
`<p>Lời chúc cuối thư đáng xem kỹ vì đó là chỗ người học dễ viết thiếu tự nhiên. Lời kết trang trọng gồm hai dòng: {{此致}} ở dòng một và {{敬礼！}} ở dòng sau, canh lề hoặc thụt đầu dòng theo yêu cầu của thầy cô. Giữa bạn bè dùng một dòng, {{祝你一切顺利！}} hoặc {{保重！}}</p>
<p>Lời chúc có thể hợp với dịp: {{祝你生日快乐}} sinh nhật, {{祝你新年快乐}} năm mới, {{祝你考试顺利}} thi cử, {{祝您身体健康}} (cho người lớn tuổi). Chữ ký đặt bên phải dưới lời chúc, ngày tháng bên dưới chữ ký.</p>
<div class="callout"><p lang="zh">亲爱的小林：你好！下个星期我要考试了，有点儿紧张。你能给我几个学习建议吗？谢谢你！祝你天天开心！ 你的朋友 阮明 2026年11月9日</p>
<p>Qīn'ài de Xiǎo Lín: Nǐ hǎo! Xià ge xīngqī wǒ yào kǎoshì le, yǒudiǎnr jǐnzhāng. Nǐ néng gěi wǒ jǐ gè xuéxí jiànyì ma? Xièxie nǐ! Zhù nǐ tiāntiān kāixīn! Nǐ de péngyou Ruǎn Míng, èr líng èr liù nián shíyī yuè jiǔ rì.</p>
<p>Tiểu Lâm thân mến: Chào bạn! Tuần sau mình thi, hơi hồi hộp. Bạn cho mình vài lời khuyên học tập được không? Cảm ơn bạn! Chúc bạn ngày nào cũng vui! Bạn của bạn, Nguyễn Minh, 9/11/2026.</p></div>`,
[
 ['Which salutation fits a teacher: {{亲爱的老师}} or {{尊敬的老师}}?', '{{尊敬的老师}}; {{亲爱的}} is too intimate.', 'Lời xưng hô nào hợp với thầy cô: {{亲爱的老师}} hay {{尊敬的老师}}?', '{{尊敬的老师}}; {{亲爱的}} quá thân mật.'],
 ['Write a closing wish for an exam.', '{{祝你考试顺利！}}', 'Viết lời chúc cuối thư cho kỳ thi.', '{{祝你考试顺利！}}'],
]);

E['crw201-ts-7-2'] = X(
`<p>When you report news, vary the openers: {{告诉你一个好消息}} "good news", {{最近发生了一件有意思的事}} "something interesting happened", {{我想跟你说说……}} "I would like to tell you about". For thanks, say what you are thanking for: {{谢谢你上次陪我去医院}} sounds sincere, while a bare {{谢谢}} sounds cold.</p>
<div class="callout"><p lang="zh">小林：告诉你一个好消息，我通过汉语考试了！谢谢你上次教我写汉字，你的方法真的很有用。暑假我打算去北京玩儿，到时候想见你一面，好吗？</p>
<p>Xiǎo Lín: Gàosu nǐ yí gè hǎo xiāoxi, wǒ tōngguò Hànyǔ kǎoshì le! Xièxie nǐ shàng cì jiāo wǒ xiě Hànzì, nǐ de fāngfǎ zhēn de hěn yǒuyòng. Shǔjià wǒ dǎsuàn qù Běijīng wánr, dào shíhou xiǎng jiàn nǐ yí miàn, hǎo ma?</p>
<p>Xiao Lin: Good news, I passed the Chinese exam! Thank you for teaching me to write characters last time; your method really works. In the summer holiday I plan to visit Beijing and would like to meet you then, if that is all right.</p></div>`,
`<p>Khi báo tin, hãy đổi cách mở đầu: {{告诉你一个好消息}} "báo tin vui", {{最近发生了一件有意思的事}} "dạo này có chuyện thú vị", {{我想跟你说说……}} "mình muốn kể với bạn về…". Khi cảm ơn, nói rõ cảm ơn việc gì: {{谢谢你上次陪我去医院}} nghe chân thành, còn {{谢谢}} trơn nghe lạnh.</p>
<div class="callout"><p lang="zh">小林：告诉你一个好消息，我通过汉语考试了！谢谢你上次教我写汉字，你的方法真的很有用。暑假我打算去北京玩儿，到时候想见你一面，好吗？</p>
<p>Xiǎo Lín: Gàosu nǐ yí gè hǎo xiāoxi, wǒ tōngguò Hànyǔ kǎoshì le! Xièxie nǐ shàng cì jiāo wǒ xiě Hànzì, nǐ de fāngfǎ zhēn de hěn yǒuyòng. Shǔjià wǒ dǎsuàn qù Běijīng wánr, dào shíhou xiǎng jiàn nǐ yí miàn, hǎo ma?</p>
<p>Tiểu Lâm: Báo bạn tin vui, mình đã qua kỳ thi tiếng Trung! Cảm ơn bạn lần trước dạy mình viết chữ Hán, cách của bạn thật sự hiệu quả. Kỳ nghỉ hè mình định đi chơi Bắc Kinh, lúc đó muốn gặp bạn một lần, được không?</p></div>`,
[
 ['Which sentence thanks specifically: {{谢谢！}} or {{谢谢你上次帮我搬家！}}', 'The second one; it names the help.', 'Câu nào cảm ơn cụ thể: {{谢谢！}} hay {{谢谢你上次帮我搬家！}}', 'Câu thứ hai; nó nêu rõ việc được giúp.'],
 ['Write a one-sentence plan for next month.', 'For example: {{我打算下个月去看奶奶。}}', 'Viết một câu nêu dự định tháng sau.', 'Ví dụ: {{我打算下个月去看奶奶。}}'],
]);

E['crw201-ts-7-3'] = X(
`<p>Two variations are common: asking for <strong>information</strong> and <strong>reporting an absence</strong>. For information give the exact question, then say you have already checked the obvious source: {{我看了学校网站，但是没有找到考试时间。}} Teachers respond faster to a precise question.</p>
<div class="callout"><p lang="zh">尊敬的老师：您好！我想请问，下个月的汉语考试在哪个教室？我看了学校网站，但是没有找到。麻烦您告诉我，谢谢！学生阮明</p>
<p>Zūnjìng de lǎoshī: Nín hǎo! Wǒ xiǎng qǐngwèn, xià ge yuè de Hànyǔ kǎoshì zài nǎ ge jiàoshì? Wǒ kàn le xuéxiào wǎngzhàn, dànshì méiyǒu zhǎodào. Máfan nín gàosu wǒ, xièxie! Xuésheng Ruǎn Míng.</p>
<p>Dear Teacher: Hello! May I ask in which classroom next month's Chinese exam will be held? I looked at the school website but could not find it. Sorry to trouble you; thank you! Student Nguyen Minh.</p></div>
<p>Compare with an impolite version: {{考试在哪里？告诉我。}} It gives no greeting, no thanks and is a command.</p>`,
`<p>Hai biến thể thường gặp là hỏi <strong>thông tin</strong> và <strong>báo vắng mặt</strong>. Khi hỏi thông tin, nêu đúng câu hỏi rồi cho biết bạn đã xem nguồn hiển nhiên: {{我看了学校网站，但是没有找到考试时间。}} Thầy cô trả lời nhanh hơn khi câu hỏi chính xác.</p>
<div class="callout"><p lang="zh">尊敬的老师：您好！我想请问，下个月的汉语考试在哪个教室？我看了学校网站，但是没有找到。麻烦您告诉我，谢谢！学生阮明</p>
<p>Zūnjìng de lǎoshī: Nín hǎo! Wǒ xiǎng qǐngwèn, xià ge yuè de Hànyǔ kǎoshì zài nǎ ge jiàoshì? Wǒ kàn le xuéxiào wǎngzhàn, dànshì méiyǒu zhǎodào. Máfan nín gàosu wǒ, xièxie! Xuésheng Ruǎn Míng.</p>
<p>Kính gửi thầy: Chào thầy! Em xin hỏi kỳ thi tiếng Trung tháng sau ở phòng nào ạ? Em đã xem trang web trường nhưng không thấy. Làm phiền thầy cho em biết, em cảm ơn! Sinh viên Nguyễn Minh.</p></div>
<p>So với bản bất lịch sự: {{考试在哪里？告诉我。}} Không chào, không cảm ơn và là câu ra lệnh.</p>`,
[
 ['Why is {{考试在哪里？告诉我。}} impolite?', 'It is a command with no greeting or thanks.', 'Vì sao {{考试在哪里？告诉我。}} bất lịch sự?', 'Vì là câu ra lệnh, không chào và không cảm ơn.'],
 ['Rewrite politely: {{我明天不来。}}', '{{老师，我明天有事，不能来上课，可以请假吗？}}', 'Viết lại lịch sự: {{我明天不来。}}', '{{老师，我明天有事，不能来上课，可以请假吗？}}'],
]);

E['crw201-ts-8-1'] = X(
`<p>To make a narrative vivid, add one <strong>detail of feeling or senses</strong> at the turning point: what you saw, heard or thought. {{天一下子黑了}} "the sky suddenly went dark" or {{我心里很害怕}} "I felt scared inside" lift a bare list of events. Add one sentence of reflection at the end: {{这件事让我知道，出门要带伞。}}</p>
<div class="callout"><p lang="zh">去年春节，我跟爸爸妈妈回老家。路上堵车，我们走了八个小时。到家的时候，奶奶已经在门口等了很久。她一看见我们，就笑着说：“你们终于回来了！”那一刻，我觉得再累也值得。</p>
<p>Qùnián Chūnjié, wǒ gēn bàba māma huí lǎojiā. Lùshang dǔchē, wǒmen zǒu le bā gè xiǎoshí. Dào jiā de shíhou, nǎinai yǐjīng zài ménkǒu děng le hěn jiǔ. Tā yí kànjiàn wǒmen, jiù xiào zhe shuō: “Nǐmen zhōngyú huílái le!” Nà yí kè, wǒ juéde zài lèi yě zhídé.</p>
<p>Last Spring Festival I went back to my hometown with my parents. There was a traffic jam and the journey took eight hours. When we arrived, Grandma had already been waiting at the door for a long time. As soon as she saw us she said with a smile, "You are finally back!" At that moment I felt that however tired I was, it was worth it.</p></div>`,
`<p>Để bài kể sinh động, hãy thêm một <strong>chi tiết cảm xúc hoặc giác quan</strong> ở chỗ ngoặt: bạn thấy, nghe hay nghĩ gì. {{天一下子黑了}} "trời bỗng tối sầm" hay {{我心里很害怕}} "trong lòng tôi rất sợ" làm bản liệt kê trơ trụi sống động hơn. Thêm một câu suy ngẫm ở cuối: {{这件事让我知道，出门要带伞。}}</p>
<div class="callout"><p lang="zh">去年春节，我跟爸爸妈妈回老家。路上堵车，我们走了八个小时。到家的时候，奶奶已经在门口等了很久。她一看见我们，就笑着说：“你们终于回来了！”那一刻，我觉得再累也值得。</p>
<p>Qùnián Chūnjié, wǒ gēn bàba māma huí lǎojiā. Lùshang dǔchē, wǒmen zǒu le bā gè xiǎoshí. Dào jiā de shíhou, nǎinai yǐjīng zài ménkǒu děng le hěn jiǔ. Tā yí kànjiàn wǒmen, jiù xiào zhe shuō: “Nǐmen zhōngyú huílái le!” Nà yí kè, wǒ juéde zài lèi yě zhídé.</p>
<p>Tết năm ngoái tôi về quê với bố mẹ. Trên đường kẹt xe, chúng tôi đi mất tám tiếng. Lúc đến nhà, bà đã đứng đợi ở cửa rất lâu. Vừa thấy chúng tôi, bà cười nói: "Cuối cùng các con cũng về!" Khoảnh khắc ấy tôi thấy dù mệt đến mấy cũng đáng.</p></div>`,
[
 ['Name the six slots of a narrative.', 'When, where/who, what happened, turn, end, feeling.', 'Kể sáu ô của một bài kể chuyện.', 'Khi nào, ở đâu/ai, chuyện gì, ngoặt, kết, cảm xúc.'],
 ['Which word in the Spring Festival text marks the final arrival?', '{{终于}} "finally" in {{你们终于回来了}}.', 'Từ nào trong đoạn Tết đánh dấu việc cuối cùng cũng về đến?', '{{终于}} "cuối cùng" trong {{你们终于回来了}}.'],
]);

E['crw201-ts-8-2'] = X(
`<p>Two upgrades make descriptions richer. Use <strong>reduplicated adjectives</strong> for vivid images: {{高高的}} tall, {{大大的眼睛}} big eyes, {{长长的头发}} long hair; the small {{的}} follows. And use <strong>comparison</strong> to anchor a description: {{他比我高一点儿}} "a bit taller than me".</p>
<div class="callout"><p lang="zh">我的奶奶今年七十岁，头发白白的，脸上总是带着笑。她很会做饭，每次我回家，她都做我最爱吃的鱼。奶奶家在一个安静的小村子里，门前有一条小河，河边种着很多花。</p>
<p>Wǒ de nǎinai jīnnián qīshí suì, tóufa báibái de, liǎn shang zǒngshì dài zhe xiào. Tā hěn huì zuòfàn, měi cì wǒ huí jiā, tā dōu zuò wǒ zuì ài chī de yú. Nǎinai jiā zài yí gè ānjìng de xiǎo cūnzi li, ménqián yǒu yì tiáo xiǎo hé, hébiān zhòng zhe hěn duō huā.</p>
<p>My grandmother is seventy this year, her hair is white and there is always a smile on her face. She cooks well, and every time I go home she makes the fish I love best. Her house is in a quiet little village; in front of the door there is a small river, and many flowers are planted along its bank.</p></div>
<p>Person and place together: appearance, trait with evidence (the fish), location, details ({{有}} and {{种着}}).</p>`,
`<p>Hai cách nâng cấp giúp mô tả phong phú hơn. Dùng <strong>tính từ láy</strong> để tạo hình ảnh: {{高高的}} cao cao, {{大大的眼睛}} đôi mắt to, {{长长的头发}} tóc dài; có {{的}} nhỏ theo sau. Và dùng <strong>so sánh</strong> để neo mô tả: {{他比我高一点儿}} "cao hơn tôi chút".</p>
<div class="callout"><p lang="zh">我的奶奶今年七十岁，头发白白的，脸上总是带着笑。她很会做饭，每次我回家，她都做我最爱吃的鱼。奶奶家在一个安静的小村子里，门前有一条小河，河边种着很多花。</p>
<p>Wǒ de nǎinai jīnnián qīshí suì, tóufa báibái de, liǎn shang zǒngshì dài zhe xiào. Tā hěn huì zuòfàn, měi cì wǒ huí jiā, tā dōu zuò wǒ zuì ài chī de yú. Nǎinai jiā zài yí gè ānjìng de xiǎo cūnzi li, ménqián yǒu yì tiáo xiǎo hé, hébiān zhòng zhe hěn duō huā.</p>
<p>Bà tôi năm nay bảy mươi tuổi, tóc bạc trắng, trên mặt lúc nào cũng mỉm cười. Bà nấu ăn giỏi, mỗi lần tôi về, bà đều nấu món cá tôi thích nhất. Nhà bà ở một ngôi làng nhỏ yên tĩnh, trước cửa có con sông nhỏ, ven sông trồng nhiều hoa.</p></div>
<p>Cả người lẫn nơi chốn: ngoại hình, tính cách kèm dẫn chứng (món cá), vị trí, chi tiết ({{有}} và {{种着}}).</p>`,
[
 ['Form a reduplicated phrase for "long hair".', '{{长长的头发}}', 'Tạo cụm tính từ láy cho "tóc dài".', '{{长长的头发}}'],
 ['Which evidence supports "Grandma cooks well"?', 'She makes the fish I love best every time I go home.', 'Dẫn chứng nào cho thấy "bà nấu ăn giỏi"?', 'Mỗi lần tôi về bà đều nấu món cá tôi thích nhất.'],
]);

E['crw201-ts-8-3'] = X(
`<p>For three-word prompts, list the words in a chain first: person + place + feeling. Example prompt: {{生日 / 蛋糕 / 开心}}. A sentence plan: who has the birthday, what do they eat, how do they feel. A written result: {{今天是我的生日，朋友们给我买了一个大蛋糕，我觉得非常开心。}}</p>
<p>Always read your answer once after writing. Does it use <em>every</em> given word, in the form given? Is it a full sentence? Is there a full stop?</p>
<div class="callout"><p lang="zh">看图写句子（图：两个孩子在雨中走路，一个人打着伞）。词语：伞。→ 下雨了，哥哥打着伞，送弟弟去学校。</p>
<p>Kàn tú xiě jùzi (tú: liǎng gè háizi zài yǔ zhōng zǒulù, yí gè rén dǎ zhe sǎn). Cíyǔ: sǎn. → Xià yǔ le, gēge dǎ zhe sǎn, sòng dìdi qù xuéxiào.</p>
<p>Write a sentence from the picture (two children walking in the rain, one holding an umbrella). Word: umbrella. → It is raining; the older brother holds an umbrella and takes his younger brother to school.</p></div>`,
`<p>Với đề cho ba từ, hãy xếp các từ thành chuỗi trước: người + nơi chốn + cảm xúc. Ví dụ đề: {{生日 / 蛋糕 / 开心}}. Kế hoạch câu: ai có sinh nhật, ăn gì, cảm thấy thế nào. Bài viết: {{今天是我的生日，朋友们给我买了一个大蛋糕，我觉得非常开心。}}</p>
<p>Luôn đọc lại một lần sau khi viết. Có dùng <em>mọi</em> từ cho sẵn, đúng dạng không? Có phải câu đầy đủ không? Có dấu chấm không?</p>
<div class="callout"><p lang="zh">看图写句子（图：两个孩子在雨中走路，一个人打着伞）。词语：伞。→ 下雨了，哥哥打着伞，送弟弟去学校。</p>
<p>Kàn tú xiě jùzi (tú: liǎng gè háizi zài yǔ zhōng zǒulù, yí gè rén dǎ zhe sǎn). Cíyǔ: sǎn. → Xià yǔ le, gēge dǎ zhe sǎn, sòng dìdi qù xuéxiào.</p>
<p>Xem tranh viết câu (hai em bé đi bộ dưới mưa, một người cầm ô). Từ: ô. → Trời mưa, anh cầm ô đưa em đến trường.</p></div>`,
[
 ['Write a sentence using {{图书馆}} for a picture of a girl reading.', '{{她在图书馆看书。}}', 'Viết câu dùng {{图书馆}} cho tranh cô bé đang đọc sách.', '{{她在图书馆看书。}}'],
 ['Write two sentences using {{生日 / 蛋糕 / 开心}}.', '{{今天是我的生日，朋友们给我买了一个大蛋糕。我觉得非常开心。}}', 'Viết hai câu dùng {{生日 / 蛋糕 / 开心}}.', '{{今天是我的生日，朋友们给我买了一个大蛋糕。我觉得非常开心。}}'],
]);

E['crw201-ts-8-4'] = X(
`<p>When the topic is a choice, a comparison paragraph helps: state which option you prefer, then compare using {{比}}, {{更}} and {{没有}}. Another useful frame is {{一方面……，另一方面……}} "on one hand … on the other", which shows you see both sides.</p>
<div class="callout"><p lang="zh">我认为学生应该多运动。第一，运动对身体好，经常运动的人不容易生病。第二，运动以后学习更有精神。比如，我每天下课打半个小时球，晚上做作业就不太累。所以我建议大家每天运动。</p>
<p>Wǒ rènwéi xuésheng yīnggāi duō yùndòng. Dì yī, yùndòng duì shēntǐ hǎo, jīngcháng yùndòng de rén bù róngyì shēngbìng. Dì èr, yùndòng yǐhòu xuéxí gèng yǒu jīngshen. Bǐrú, wǒ měi tiān xiàkè dǎ bàn gè xiǎoshí qiú, wǎnshang zuò zuòyè jiù bú tài lèi. Suǒyǐ wǒ jiànyì dàjiā měi tiān yùndòng.</p>
<p>I think students should exercise more. First, exercise is good for health and people who exercise often do not fall ill easily. Second, after exercise you study with more energy. For example, I play ball for half an hour after class every day and I am not so tired doing homework in the evening. So I suggest that everyone exercises every day.</p></div>`,
`<p>Khi đề là một lựa chọn, đoạn so sánh sẽ giúp ích: nêu phương án bạn thích hơn rồi so sánh bằng {{比}}, {{更}} và {{没有}}. Một mẫu khác là {{一方面……，另一方面……}} "một mặt… mặt khác…", cho thấy bạn thấy cả hai phía.</p>
<div class="callout"><p lang="zh">我认为学生应该多运动。第一，运动对身体好，经常运动的人不容易生病。第二，运动以后学习更有精神。比如，我每天下课打半个小时球，晚上做作业就不太累。所以我建议大家每天运动。</p>
<p>Wǒ rènwéi xuésheng yīnggāi duō yùndòng. Dì yī, yùndòng duì shēntǐ hǎo, jīngcháng yùndòng de rén bù róngyì shēngbìng. Dì èr, yùndòng yǐhòu xuéxí gèng yǒu jīngshen. Bǐrú, wǒ měi tiān xiàkè dǎ bàn gè xiǎoshí qiú, wǎnshang zuò zuòyè jiù bú tài lèi. Suǒyǐ wǒ jiànyì dàjiā měi tiān yùndòng.</p>
<p>Tôi cho rằng học sinh nên vận động nhiều hơn. Thứ nhất, vận động tốt cho cơ thể, người thường xuyên vận động không dễ ốm. Thứ hai, sau khi vận động học tập tỉnh táo hơn. Ví dụ, mỗi ngày tan học tôi chơi bóng nửa tiếng nên tối làm bài không mệt lắm. Vì vậy tôi đề nghị mọi người ngày nào cũng vận động.</p></div>`,
[
 ['Mark the opinion, two reasons and example in the exercise text.', 'Opinion: {{学生应该多运动}}; reasons: {{第一}}, {{第二}}; example: {{比如}}.', 'Chỉ ra ý kiến, hai lý do và ví dụ trong đoạn về vận động.', 'Ý kiến: {{学生应该多运动}}; lý do: {{第一}}, {{第二}}; ví dụ: {{比如}}.'],
 ['Add a contrast sentence with {{当然……但是……}} about exercise.', '{{当然，运动很花时间，但是对身体很有好处。}}', 'Thêm câu tương phản với {{当然……但是……}} về vận động.', '{{当然，运动很花时间，但是对身体很有好处。}}'],
]);

E['crw201-ts-9-1'] = X(
`<p>Practise with a <strong>weekly routine</strong> so the techniques become habits. Day 1: ten sentence-rearrangement items, timed at 30 seconds each. Day 2: ten fill-in-the-blank items, naming the word class before choosing. Day 3: two short passages with the three-pass method. Day 4: ten missing-hanzi items from your own error log. Day 5: a full mini-test of 10 reading and 5 writing items.</p>
<p>For the missing-hanzi task, look for the pinyin's meaning in context, then recall the standard form from your notebook. Characters with the same sound are traps: {{在}} and {{再}} are both zài; {{做}} and {{作}} are both zuò. The surrounding words decide.</p>
<table><thead><tr><th>Item</th><th>Answer</th><th>Why</th></tr></thead><tbody>
<tr><td>{{我明天(zài)来。}}</td><td>{{再}}</td><td>repeat in the future</td></tr>
<tr><td>{{他(zài)教室里。}}</td><td>{{在}}</td><td>location</td></tr>
</tbody></table>`,
`<p>Hãy luyện theo <strong>lịch tuần</strong> để kỹ thuật thành thói quen. Ngày 1: mười câu sắp xếp từ, mỗi câu 30 giây. Ngày 2: mười câu điền từ, gọi tên từ loại trước khi chọn. Ngày 3: hai đoạn văn ngắn theo phương pháp ba lượt. Ngày 4: mười câu viết chữ Hán còn thiếu lấy từ sổ lỗi của bạn. Ngày 5: bài thi nhỏ gồm 10 câu đọc và 5 câu viết.</p>
<p>Với dạng viết chữ Hán còn thiếu, hãy tìm nghĩa của pinyin trong ngữ cảnh rồi nhớ lại dạng chuẩn từ sổ tay. Các chữ cùng âm là cái bẫy: {{在}} và {{再}} đều đọc zài; {{做}} và {{作}} đều đọc zuò. Từ xung quanh quyết định.</p>
<table><thead><tr><th>Câu</th><th>Đáp án</th><th>Vì sao</th></tr></thead><tbody>
<tr><td>{{我明天(zài)来。}}</td><td>{{再}}</td><td>lặp lại trong tương lai</td></tr>
<tr><td>{{他(zài)教室里。}}</td><td>{{在}}</td><td>chỉ nơi chốn</td></tr>
</tbody></table>`,
[
 ['Rearrange: {{喜欢 / 我 / 很 / 音乐}}', '{{我很喜欢音乐。}}', 'Sắp xếp: {{喜欢 / 我 / 很 / 音乐}}', '{{我很喜欢音乐。}}'],
 ['Why must you write hanzi, not pinyin, in the missing-character task?', 'Only the hanzi earns the point.', 'Vì sao phải viết chữ Hán chứ không viết pinyin ở dạng điền chữ?', 'Chỉ chữ Hán mới được điểm.'],
]);

E['crw201-ts-9-2'] = X(
`<p>Make the error log specific. A weak entry reads "word order wrong". A strong entry reads: sentence {{我看书在家}}, type word order (place), correction {{我在家看书}}, rule "place phrase before the verb" (lesson 4.1). With specific entries, patterns appear after a month, and the top two types are what you drill next.</p>
<div class="callout"><p lang="zh">昨天我去了公园，玩得很高兴。我和朋友们打球，还照了很多照片。回家的时候天黑了，所以我们坐了出租车。</p>
<p>Zuótiān wǒ qù le gōngyuán, wán de hěn gāoxìng. Wǒ hé péngyoumen dǎqiú, hái zhào le hěn duō zhàopiàn. Huí jiā de shíhou tiān hēi le, suǒyǐ wǒmen zuò le chūzūchē.</p>
<p>Yesterday I went to the park and had a very happy time. I played ball with my friends and also took many photos. When we went home it had got dark, so we took a taxi.</p></div>
<p>This version is correct. Try the seven passes on it and confirm that each pass finds nothing; this shows you what clean text feels like.</p>`,
`<p>Hãy ghi sổ lỗi cho cụ thể. Mục yếu chỉ ghi "sai trật tự từ". Mục tốt ghi: câu {{我看书在家}}, loại lỗi trật tự từ (nơi chốn), sửa {{我在家看书}}, quy tắc "cụm nơi chốn đứng trước động từ" (bài 4.1). Với mục cụ thể, sau một tháng sẽ lộ ra quy luật, và hai loại lỗi đầu là phần cần luyện tiếp.</p>
<div class="callout"><p lang="zh">昨天我去了公园，玩得很高兴。我和朋友们打球，还照了很多照片。回家的时候天黑了，所以我们坐了出租车。</p>
<p>Zuótiān wǒ qù le gōngyuán, wán de hěn gāoxìng. Wǒ hé péngyoumen dǎqiú, hái zhào le hěn duō zhàopiàn. Huí jiā de shíhou tiān hēi le, suǒyǐ wǒmen zuò le chūzūchē.</p>
<p>Hôm qua tôi đi công viên và chơi rất vui. Tôi chơi bóng với bạn bè, còn chụp nhiều ảnh. Lúc về nhà trời đã tối nên chúng tôi đi taxi.</p></div>
<p>Bản này đúng. Hãy thử bảy lượt soát trên nó và xác nhận mỗi lượt không tìm ra lỗi; việc này cho bạn thấy văn bản sạch có cảm giác thế nào.</p>`,
[
 ['Correct: {{他比我很高。}}', '{{他比我高。}} (no {{很}} after {{比}})', 'Sửa: {{他比我很高。}}', '{{他比我高。}} (không dùng {{很}} sau {{比}})'],
 ['Which four columns should an error log have?', 'Sentence, error type, correct form, rule or lesson.', 'Sổ lỗi nên có bốn cột nào?', 'Câu, loại lỗi, dạng đúng, quy tắc hoặc bài học.'],
]);

// ───────────────────────────── Chương 1 ─────────────────────────────
const c1 = {
  title: 'Chapter 1 — Reading HSK 3 passages|||Chương 1 — Đọc đoạn văn trình độ HSK 3',
  description: 'Ba lượt đọc, tín hiệu liên kết, đại từ và suy luận, đoán từ lạ trong đoạn 100–200 chữ.',
  lessons: [
    L('crw201-ts-1-1', '1.1 The three-pass method|||1.1 Phương pháp đọc ba lượt',
      'Skim – đọc câu hỏi – tìm bằng chứng; áp dụng vào đoạn 120 chữ.',
      {
        gEN: ['Skim a passage for topic and time order', 'Use the questions to focus the second reading', 'Find and quote the evidence sentence'],
        gVI: ['Lướt đoạn văn để nắm chủ đề và trình tự thời gian', 'Dùng câu hỏi để định hướng lượt đọc thứ hai', 'Tìm và trích câu làm bằng chứng'],
        bEN: `<p>At HSK 3 the passages are longer, so reading every character with equal care wastes time. Use <strong>three passes</strong>.</p>
<p><strong>Pass 1 — skim (20 seconds).</strong> Read the title if there is one, the first and last sentence, and circle time words and names. You are asking only: who, what topic, in what order?</p>
<p><strong>Pass 2 — questions.</strong> Read the questions and options <em>before</em> the text. Underline the key word of each question; this tells you what to look for.</p>
<p><strong>Pass 3 — evidence.</strong> Return to the text and find the sentence that answers each question. Answer with that sentence, not with what you feel is true.</p>
<h4>Worked example</h4>
<div class="callout"><p lang="zh">小王是我的同学。他来中国学习汉语已经一年了。刚来的时候，他一句汉语也不会说，所以很着急。后来，他每天都和中国朋友聊天，还看中文电视，慢慢地就能听懂了。现在他不但会说，而且会写。他说，只要努力，学习就不难。</p>
<p>Xiǎo Wáng shì wǒ de tóngxué. Tā lái Zhōngguó xuéxí Hànyǔ yǐjīng yì nián le. Gāng lái de shíhou, tā yí jù Hànyǔ yě bú huì shuō, suǒyǐ hěn zháojí. Hòulái, tā měi tiān dōu hé Zhōngguó péngyou liáotiān, hái kàn Zhōngwén diànshì, mànmàn de jiù néng tīngdǒng le. Xiànzài tā bùdàn huì shuō, érqiě huì xiě. Tā shuō, zhǐyào nǔlì, xuéxí jiù bù nán.</p>
<p>Xiao Wang is my classmate. He has been studying Chinese in China for a year. When he first arrived he could not say a single sentence, so he was worried. Later he chatted with Chinese friends every day and watched Chinese TV, and slowly he could understand. Now he can not only speak but also write. He says that as long as you work hard, study is not difficult.</p></div>
<p><strong>Pass 1</strong> gives: topic = a classmate learning Chinese; order = arrival → later → now. <strong>Question:</strong> {{小王刚来的时候怎么样？}} A {{说得很好}} B {{一句也不会说}} C {{很高兴}} D {{会写汉字}}. <strong>Pass 3:</strong> the key words {{刚来的时候}} point to the sentence {{他一句汉语也不会说}}, so the answer is <strong>B</strong>. Note the signal {{所以很着急}}: the feeling is worry, not happiness, so C is wrong.</p>
<p><strong>True/false:</strong> {{小王现在只会说，不会写。}} — False; the text says {{不但会说，而且会写}}.</p>`,
        bVI: `<p>Ở HSK 3 đoạn văn dài hơn, nên đọc từng chữ cẩn thận như nhau là phí thời gian. Hãy dùng <strong>ba lượt đọc</strong>.</p>
<p><strong>Lượt 1 — lướt (20 giây).</strong> Đọc tiêu đề (nếu có), câu đầu và câu cuối, khoanh từ chỉ thời gian và tên người. Chỉ tự hỏi: ai, chủ đề gì, theo trình tự nào?</p>
<p><strong>Lượt 2 — câu hỏi.</strong> Đọc câu hỏi và các lựa chọn <em>trước</em> khi đọc kỹ văn bản. Gạch từ khoá của mỗi câu hỏi; nó cho bạn biết cần tìm gì.</p>
<p><strong>Lượt 3 — bằng chứng.</strong> Quay lại văn bản, tìm câu trả lời cho từng câu hỏi. Trả lời bằng chính câu đó, không phải bằng điều bạn cảm thấy đúng.</p>
<h4>Ví dụ có lời giải</h4>
<div class="callout"><p lang="zh">小王是我的同学。他来中国学习汉语已经一年了。刚来的时候，他一句汉语也不会说，所以很着急。后来，他每天都和中国朋友聊天，还看中文电视，慢慢地就能听懂了。现在他不但会说，而且会写。他说，只要努力，学习就不难。</p>
<p>Xiǎo Wáng shì wǒ de tóngxué. Tā lái Zhōngguó xuéxí Hànyǔ yǐjīng yì nián le. Gāng lái de shíhou, tā yí jù Hànyǔ yě bú huì shuō, suǒyǐ hěn zháojí. Hòulái, tā měi tiān dōu hé Zhōngguó péngyou liáotiān, hái kàn Zhōngwén diànshì, mànmàn de jiù néng tīngdǒng le. Xiànzài tā bùdàn huì shuō, érqiě huì xiě. Tā shuō, zhǐyào nǔlì, xuéxí jiù bù nán.</p>
<p>Tiểu Vương là bạn cùng lớp của tôi. Anh ấy học tiếng Hán ở Trung Quốc đã một năm. Lúc mới đến, anh không nói nổi một câu tiếng Hán nên rất lo. Sau đó, mỗi ngày anh trò chuyện với bạn Trung Quốc, còn xem tivi tiếng Trung, dần dần nghe hiểu được. Bây giờ anh không chỉ nói được mà còn viết được. Anh nói chỉ cần cố gắng thì học không khó.</p></div>
<p><strong>Lượt 1</strong> cho: chủ đề = một bạn học tiếng Hán; trình tự = mới đến → sau đó → bây giờ. <strong>Câu hỏi:</strong> {{小王刚来的时候怎么样？}} A {{说得很好}} B {{一句也不会说}} C {{很高兴}} D {{会写汉字}}. <strong>Lượt 3:</strong> từ khoá {{刚来的时候}} dẫn tới câu {{他一句汉语也不会说}}, nên đáp án là <strong>B</strong>. Để ý tín hiệu {{所以很着急}}: cảm xúc là lo, không phải vui, nên C sai.</p>
<p><strong>Đúng/sai:</strong> {{小王现在只会说，不会写。}} — Sai; văn bản viết {{不但会说，而且会写}}.</p>`,
        tab: [['刚', 'gāng', 'just, only just', 'vừa mới'], ['着急', 'zháojí', 'be worried, anxious', 'lo lắng, sốt ruột'], ['后来', 'hòulái', 'later, afterwards', 'sau đó'], ['慢慢', 'mànmàn', 'slowly, gradually', 'dần dần'], ['听懂', 'tīngdǒng', 'understand by listening', 'nghe hiểu'], ['努力', 'nǔlì', 'work hard', 'cố gắng']],
        mEN: 'Reading the options first and picking the one that contains a word from the passage. Wrong options often use a real word from the text but in the wrong time or relation. Always match the <em>whole</em> claim to the evidence sentence.',
        mVI: 'Đọc lựa chọn trước rồi chọn cái có chứa từ trong đoạn văn. Đáp án sai thường dùng từ có thật trong văn bản nhưng sai thời điểm hoặc sai quan hệ. Luôn đối chiếu <em>cả ý</em> với câu bằng chứng.',
        sEN: ['Pass 1 skim, pass 2 questions, pass 3 evidence', 'Circle time words and feeling words', 'Quote the evidence sentence for each answer'],
        sVI: ['Lượt 1 lướt, lượt 2 câu hỏi, lượt 3 bằng chứng', 'Khoanh từ chỉ thời gian và từ chỉ cảm xúc', 'Trích câu bằng chứng cho mỗi đáp án'],
        lk: [U.duch, U.hsk3, U.hskc],
        p: [
          ['Which sentence proves that Xiao Wang improved over time?', '{{后来……慢慢地就能听懂了}} (and {{现在他不但会说，而且会写}}).', 'Câu nào chứng minh Tiểu Vương tiến bộ theo thời gian?', '{{后来……慢慢地就能听懂了}} (và {{现在他不但会说，而且会写}}).'],
          ['True or false: {{小王来中国半年了。}}', 'False — the text says {{已经一年了}} (a year).', 'Đúng hay sai: {{小王来中国半年了。}}', 'Sai — văn bản viết {{已经一年了}} (một năm).'],
          ['What does {{只要努力，学习就不难}} mean?', 'As long as you work hard, studying is not difficult.', '{{只要努力，学习就不难}} nghĩa là gì?', 'Chỉ cần cố gắng thì việc học không khó.'],
        ],
      }),
    L('crw201-ts-1-2', '1.2 Signal words: how connectors guide reading|||1.2 Từ tín hiệu: liên từ dẫn đường khi đọc',
      'Nhận ra nhân quả, nhượng bộ, tăng tiến, điều kiện, trình tự để biết ý chính nằm ở đâu.',
      {
        gEN: ['Recognise cause, contrast, addition, condition and sequence signals', 'Know which half of a pair carries the main point', 'Use signals to predict the next clause'],
        gVI: ['Nhận ra tín hiệu nhân quả, tương phản, tăng tiến, điều kiện, trình tự', 'Biết nửa nào của cặp từ mang ý chính', 'Dùng tín hiệu để đoán mệnh đề kế tiếp'],
        bEN: `<p>Chinese often marks logic with <strong>paired connectors</strong>. If you spot the first half you can predict the second, and you know where the main point sits.</p>
<table><thead><tr><th>Signal</th><th>Relation</th><th>Main point is…</th></tr></thead><tbody>
<tr><td>{{因为……所以……}}</td><td>cause → result</td><td>the result</td></tr>
<tr><td>{{虽然……但是……}}</td><td>although → but</td><td>after {{但是}}</td></tr>
<tr><td>{{不但……而且……}}</td><td>not only → but also</td><td>both, the second is stronger</td></tr>
<tr><td>{{如果……就……}} / {{只要……就……}}</td><td>if → then / as long as</td><td>the result</td></tr>
<tr><td>{{先……然后……最后……}}</td><td>sequence</td><td>the order itself</td></tr>
</tbody></table>
<p>Tip: in Chinese the second half is often introduced by {{就}}, {{也}} or {{还}}; and the subject may be omitted. In the HSK reading questions the answer is very often the idea <em>after</em> {{但是}}.</p>
<div class="callout"><p lang="zh">虽然这家饭店不大，但是菜很好吃，价格也不贵，所以每天中午都有很多人来吃饭。我先点了一个汤，然后又点了两个菜，最后还要了一碗米饭。</p>
<p>Suīrán zhè jiā fàndiàn bú dà, dànshì cài hěn hǎochī, jiàgé yě bú guì, suǒyǐ měi tiān zhōngwǔ dōu yǒu hěn duō rén lái chī fàn. Wǒ xiān diǎn le yí gè tāng, ránhòu yòu diǎn le liǎng gè cài, zuìhòu hái yào le yì wǎn mǐfàn.</p>
<p>Although this restaurant is not big, the food is delicious and the prices are not high, so many people come to eat every lunchtime. I first ordered a soup, then two dishes, and finally a bowl of rice.</p></div>
<p><strong>Question:</strong> {{这家饭店怎么样？}} The word {{虽然}} warns that a small point comes first; {{但是}} gives the main point: tasty and cheap. So the restaurant is good, even though small.</p>`,
        bVI: `<p>Tiếng Trung thường đánh dấu logic bằng <strong>cặp liên từ</strong>. Thấy nửa đầu là đoán được nửa sau, và biết ý chính nằm ở đâu.</p>
<table><thead><tr><th>Tín hiệu</th><th>Quan hệ</th><th>Ý chính là…</th></tr></thead><tbody>
<tr><td>{{因为……所以……}}</td><td>nguyên nhân → kết quả</td><td>kết quả</td></tr>
<tr><td>{{虽然……但是……}}</td><td>tuy… nhưng…</td><td>sau {{但是}}</td></tr>
<tr><td>{{不但……而且……}}</td><td>không chỉ… mà còn…</td><td>cả hai, vế sau mạnh hơn</td></tr>
<tr><td>{{如果……就……}} / {{只要……就……}}</td><td>nếu… thì / chỉ cần… thì</td><td>kết quả</td></tr>
<tr><td>{{先……然后……最后……}}</td><td>trình tự</td><td>chính thứ tự</td></tr>
</tbody></table>
<p>Mẹo: vế sau thường mở bằng {{就}}, {{也}} hoặc {{还}}; chủ ngữ có thể bị lược. Trong câu hỏi đọc hiểu HSK, đáp án rất hay là ý <em>sau</em> {{但是}}.</p>
<div class="callout"><p lang="zh">虽然这家饭店不大，但是菜很好吃，价格也不贵，所以每天中午都有很多人来吃饭。我先点了一个汤，然后又点了两个菜，最后还要了一碗米饭。</p>
<p>Suīrán zhè jiā fàndiàn bú dà, dànshì cài hěn hǎochī, jiàgé yě bú guì, suǒyǐ měi tiān zhōngwǔ dōu yǒu hěn duō rén lái chī fàn. Wǒ xiān diǎn le yí gè tāng, ránhòu yòu diǎn le liǎng gè cài, zuìhòu hái yào le yì wǎn mǐfàn.</p>
<p>Tuy quán này không lớn nhưng món rất ngon, giá cũng không đắt, nên trưa nào cũng có nhiều người đến ăn. Tôi gọi trước một món canh, rồi gọi thêm hai món, cuối cùng còn xin một bát cơm.</p></div>
<p><strong>Câu hỏi:</strong> {{这家饭店怎么样？}} Từ {{虽然}} báo hiệu một điểm nhỏ đi trước; {{但是}} đưa ý chính: ngon và rẻ. Vậy quán tốt dù nhỏ.</p>`,
        tab: [['虽然', 'suīrán', 'although', 'tuy, mặc dù'], ['但是', 'dànshì', 'but', 'nhưng'], ['所以', 'suǒyǐ', 'so, therefore', 'cho nên'], ['价格', 'jiàgé', 'price', 'giá cả'], ['先', 'xiān', 'first', 'trước tiên'], ['然后', 'ránhòu', 'then, afterwards', 'sau đó, rồi'], ['最后', 'zuìhòu', 'finally', 'cuối cùng']],
        mEN: 'Treating {{虽然……但是……}} like English "although … but" and adding both in a sentence translated word by word. In Chinese you normally use <em>both</em> words together, whereas English uses only one of "although" or "but".',
        mVI: 'Dịch {{虽然……但是……}} sát chữ theo tiếng Việt rồi bỏ một vế. Tiếng Trung thường dùng <em>cả hai</em> từ cùng lúc, còn tiếng Việt hay chỉ dùng "tuy" hoặc "nhưng".',
        sEN: ['Paired connectors predict the second clause', 'Main point is usually after {{但是}} and in the result of {{所以}}', '{{先…然后…最后}} gives order of events'],
        sVI: ['Cặp liên từ giúp đoán vế sau', 'Ý chính thường nằm sau {{但是}} và ở kết quả của {{所以}}', '{{先…然后…最后}} cho thứ tự sự việc'],
        lk: [U.gram3, U.budan, U.xianzai],
        p: [
          ['In the passage, what did the writer order last?', 'A bowl of rice ({{最后还要了一碗米饭}}).', 'Trong đoạn, người viết gọi món gì cuối cùng?', 'Một bát cơm ({{最后还要了一碗米饭}}).'],
          ['Is the restaurant big or small? Is the food good?', 'Small ({{不大}}); the food is good ({{很好吃}}).', 'Quán to hay nhỏ? Món ăn có ngon không?', 'Nhỏ ({{不大}}); món ngon ({{很好吃}}).'],
          ['Fill in: {{______下雨，我们______去公园。}} (Because it rained, so we did not go.) — rewrite with {{因为/所以}}.', '{{因为下雨，所以我们没去公园。}}', 'Điền: {{______下雨，我们______去公园。}} — viết lại bằng {{因为/所以}}.', '{{因为下雨，所以我们没去公园。}}'],
        ],
      }),
    L('crw201-ts-1-3', '1.3 Pronouns, omitted subjects and inference|||1.3 Đại từ, chủ ngữ bị lược và suy luận',
      'Theo dõi 他/她/它/这/那/这样, tìm chủ ngữ ẩn, suy ra điều văn bản không nói thẳng.',
      {
        gEN: ['Track who or what a pronoun refers to', 'Recover an omitted subject', 'Draw a simple inference from clues'],
        gVI: ['Theo dõi đại từ chỉ ai hoặc cái gì', 'Khôi phục chủ ngữ bị lược', 'Suy luận đơn giản từ manh mối'],
        bEN: `<p>Chinese drops the subject when it is clear: {{去商店买了一件衣服，很便宜。}} has no “I”, no “it”. A reader must supply them. Three habits help.</p>
<ul><li><strong>Look back to the nearest person or thing</strong> of the right kind. {{他}} is a man (or an unspecified person), {{她}} a woman, {{它}} an animal or thing. All three sound the same, tā, so written form is your only clue.</li>
<li><strong>Demonstratives point back:</strong> {{这}}, {{这样}}, {{这些}} refer to what was just said; {{那}}, {{那样}} to something further away.</li>
<li><strong>A new sentence without a subject usually keeps the previous subject.</strong></li></ul>
<div class="callout"><p lang="zh">我有一只小狗，叫“豆豆”。它很喜欢跑步，每天早上我都带它去公园。昨天它突然不吃饭，也不想玩儿。妈妈说它可能病了，就带它去看医生。医生说没什么大问题，吃点儿药就好了。</p>
<p>Wǒ yǒu yì zhī xiǎo gǒu, jiào “Dòudou”. Tā hěn xǐhuan pǎobù, měi tiān zǎoshang wǒ dōu dài tā qù gōngyuán. Zuótiān tā tūrán bù chī fàn, yě bù xiǎng wánr. Māma shuō tā kěnéng bìng le, jiù dài tā qù kàn yīshēng. Yīshēng shuō méi shénme dà wèntí, chī diǎnr yào jiù hǎo le.</p>
<p>I have a little dog called “Doudou”. It loves to run, and every morning I take it to the park. Yesterday it suddenly would not eat and did not want to play. Mum said it might be ill, so took it to the doctor. The doctor said it was nothing serious; some medicine would make it better.</p></div>
<p><strong>Reference:</strong> {{它}} = {{豆豆}} (the dog). <strong>Omitted subject:</strong> before {{就带它去看医生}} the subject is {{妈妈}}. <strong>Inference:</strong> {{为什么妈妈带小狗去看医生？}} — the text never says “because it was sick”, but {{不吃饭，也不想玩儿}} and {{可能病了}} let you infer it.</p>`,
        bVI: `<p>Tiếng Trung lược chủ ngữ khi đã rõ: {{去商店买了一件衣服，很便宜。}} không có “tôi”, không có “nó”. Người đọc phải tự bổ sung. Có ba thói quen giúp ích.</p>
<ul><li><strong>Nhìn ngược lại người hoặc vật gần nhất</strong> đúng loại. {{他}} là nam (hoặc người nói chung), {{她}} là nữ, {{它}} là con vật hay đồ vật. Cả ba đều đọc là tā nên chỉ chữ viết mới cho manh mối.</li>
<li><strong>Chỉ thị từ quy chiếu ngược:</strong> {{这}}, {{这样}}, {{这些}} chỉ điều vừa nói; {{那}}, {{那样}} chỉ điều xa hơn.</li>
<li><strong>Câu mới không có chủ ngữ thường giữ chủ ngữ câu trước.</strong></li></ul>
<div class="callout"><p lang="zh">我有一只小狗，叫“豆豆”。它很喜欢跑步，每天早上我都带它去公园。昨天它突然不吃饭，也不想玩儿。妈妈说它可能病了，就带它去看医生。医生说没什么大问题，吃点儿药就好了。</p>
<p>Wǒ yǒu yì zhī xiǎo gǒu, jiào “Dòudou”. Tā hěn xǐhuan pǎobù, měi tiān zǎoshang wǒ dōu dài tā qù gōngyuán. Zuótiān tā tūrán bù chī fàn, yě bù xiǎng wánr. Māma shuō tā kěnéng bìng le, jiù dài tā qù kàn yīshēng. Yīshēng shuō méi shénme dà wèntí, chī diǎnr yào jiù hǎo le.</p>
<p>Tôi có một chú chó nhỏ tên “Đậu Đậu”. Nó rất thích chạy, sáng nào tôi cũng dắt nó ra công viên. Hôm qua nó bỗng không ăn, cũng không muốn chơi. Mẹ bảo có lẽ nó ốm, bèn đưa nó đi khám. Bác sĩ nói không có gì nghiêm trọng, uống chút thuốc là khỏi.</p></div>
<p><strong>Quy chiếu:</strong> {{它}} = {{豆豆}} (con chó). <strong>Chủ ngữ bị lược:</strong> trước {{就带它去看医生}} chủ ngữ là {{妈妈}}. <strong>Suy luận:</strong> {{为什么妈妈带小狗去看医生？}} — văn bản không nói thẳng “vì nó bệnh”, nhưng {{不吃饭，也不想玩儿}} và {{可能病了}} cho phép suy ra.</p>`,
        tab: [['它', 'tā', 'it (animal/thing)', 'nó (vật, con vật)'], ['突然', 'tūrán', 'suddenly', 'đột nhiên'], ['可能', 'kěnéng', 'maybe, possibly', 'có thể, có lẽ'], ['病', 'bìng', 'be ill; illness', 'bệnh, ốm'], ['医生', 'yīshēng', 'doctor', 'bác sĩ'], ['药', 'yào', 'medicine', 'thuốc'], ['公园', 'gōngyuán', 'park', 'công viên']],
        mEN: 'Assigning a pronoun to the <em>nearest noun</em> without checking gender or kind. In the dog text, the nearest noun before {{它}} in some sentences is {{我}} or {{妈妈}}, but {{它}} can only mean the dog.',
        mVI: 'Gán đại từ cho <em>danh từ gần nhất</em> mà không kiểm tra giới tính hoặc loại. Trong bài về con chó, danh từ gần {{它}} có lúc là {{我}} hay {{妈妈}}, nhưng {{它}} chỉ có thể là con chó.',
        sEN: ['{{他/她/它}} sound alike; the character tells the kind', 'Dropped subjects usually repeat the previous one', 'Inference = evidence + common sense, not guessing'],
        sVI: ['{{他/她/它}} đọc giống nhau; chữ viết cho biết loại', 'Chủ ngữ bị lược thường lặp chủ ngữ trước', 'Suy luận = bằng chứng + lẽ thường, không phải đoán mò'],
        lk: [U.duch, U.mdbg, U.gram3],
        p: [
          ['Who took the dog to the doctor?', 'Mum ({{妈妈}}).', 'Ai đưa chó đi khám?', 'Mẹ ({{妈妈}}).'],
          ['What did the dog do every morning?', 'It ran in the park with the writer ({{跑步}}, {{去公园}}).', 'Mỗi sáng con chó làm gì?', 'Chạy ở công viên cùng người viết ({{跑步}}, {{去公园}}).'],
          ['What does {{没什么大问题}} tell you about the illness?', 'It is not serious.', '{{没什么大问题}} cho biết gì về bệnh?', 'Không nghiêm trọng.'],
        ],
      }),
    L('crw201-ts-1-4', '1.4 Guessing and handling unknown words|||1.4 Đoán và xử lý từ lạ',
      'Quy tắc đoán–bỏ qua–tra, kiểu từ ghép HSK 3, tiền tố hậu tố, tốc độ đọc.',
      {
        gEN: ['Decide when to guess, skip or look up', 'Read word patterns: verb-complement, verb-object, suffixes', 'Set a reading speed target'],
        gVI: ['Quyết định khi nào đoán, bỏ qua hoặc tra', 'Đọc kiểu cấu tạo từ: động–bổ, động–tân, hậu tố', 'Đặt mục tiêu tốc độ đọc'],
        bEN: `<p>You will meet words you have never studied. Use a simple rule.</p>
<ol><li><strong>Does it block the answer?</strong> If the question does not depend on it, skip.</li>
<li><strong>Can you guess?</strong> Use radical, a known component, and the pattern of the word (below).</li>
<li><strong>Only then look up</strong>, and write the word in your notebook with the sentence.</li></ol>
<h4>Common patterns at HSK 3</h4>
<ul><li><strong>Verb + result:</strong> {{听懂}} (listen + understand), {{看见}}, {{找到}}, {{做完}}.</li>
<li><strong>Verb + object:</strong> {{吃饭}}, {{打球}}, {{起床}}, {{游泳}}.</li>
<li><strong>Two near-synonyms:</strong> {{帮助}} (help + help), {{安静}} (quiet + still), {{热情}}.</li>
<li><strong>Suffixes:</strong> {{-员}} person with a job ({{服务员}}, {{售货员}}); {{-家}} specialist ({{画家}}); {{-者}} person who ({{读者}}); {{-们}} plural for people ({{同学们}}).</li>
<li><strong>Prefixes:</strong> {{老-}} ({{老师}}), {{第-}} ordinal ({{第一}}), {{不-}} / {{无-}} negative ({{不同}}, {{无聊}}).</li></ul>
<p><strong>Speed.</strong> A reasonable target at this stage is 80–100 characters a minute on familiar topics. Time yourself on the 120-character passages of this chapter; if you are far slower, you are probably translating each word to Vietnamese. Try to read in <em>chunks</em> as in CRW101 4.3.</p>
<div class="callout"><p lang="zh">服务员看见我们进来，马上拿来了菜单。</p><p>Fúwùyuán kànjiàn wǒmen jìnlái, mǎshàng nálái le càidān.</p><p>The waiter saw us come in and at once brought the menu.</p></div>
<p>Even if you do not know {{马上}}, the pattern {{服务员}} (person who serves) + {{看见}} (see) + {{拿来}} (bring) lets you follow the story.</p>`,
        bVI: `<p>Bạn sẽ gặp từ chưa học. Dùng một quy tắc đơn giản.</p>
<ol><li><strong>Từ đó có chặn đáp án không?</strong> Nếu câu hỏi không phụ thuộc vào nó thì bỏ qua.</li>
<li><strong>Có đoán được không?</strong> Dùng bộ thủ, bộ phận đã biết và kiểu cấu tạo từ (bên dưới).</li>
<li><strong>Rồi mới tra</strong>, và ghi từ vào sổ kèm câu chứa nó.</li></ol>
<h4>Các kiểu thường gặp ở HSK 3</h4>
<ul><li><strong>Động từ + kết quả:</strong> {{听懂}} (nghe + hiểu), {{看见}}, {{找到}}, {{做完}}.</li>
<li><strong>Động từ + tân ngữ:</strong> {{吃饭}}, {{打球}}, {{起床}}, {{游泳}}.</li>
<li><strong>Hai từ gần nghĩa:</strong> {{帮助}} (giúp + giúp), {{安静}} (yên + lặng), {{热情}}.</li>
<li><strong>Hậu tố:</strong> {{-员}} người làm nghề ({{服务员}}, {{售货员}}); {{-家}} chuyên gia ({{画家}}); {{-者}} người làm gì ({{读者}}); {{-们}} số nhiều chỉ người ({{同学们}}).</li>
<li><strong>Tiền tố:</strong> {{老-}} ({{老师}}), {{第-}} số thứ tự ({{第一}}), {{不-}} / {{无-}} phủ định ({{不同}}, {{无聊}}).</li></ul>
<p><strong>Tốc độ.</strong> Mục tiêu hợp lý ở giai đoạn này là 80–100 chữ một phút với chủ đề quen. Hãy bấm giờ khi đọc các đoạn 120 chữ của chương này; nếu chậm hơn nhiều, có lẽ bạn đang dịch từng từ sang tiếng Việt. Hãy đọc theo <em>cụm</em> như CRW101 bài 4.3.</p>
<div class="callout"><p lang="zh">服务员看见我们进来，马上拿来了菜单。</p><p>Fúwùyuán kànjiàn wǒmen jìnlái, mǎshàng nálái le càidān.</p><p>Nhân viên phục vụ thấy chúng tôi bước vào liền mang thực đơn đến ngay.</p></div>
<p>Dù chưa biết {{马上}}, kiểu {{服务员}} (người phục vụ) + {{看见}} (thấy) + {{拿来}} (mang đến) vẫn giúp bạn theo kịp câu chuyện.</p>`,
        tab: [['服务员', 'fúwùyuán', 'waiter, attendant', 'nhân viên phục vụ'], ['马上', 'mǎshàng', 'immediately', 'ngay lập tức'], ['菜单', 'càidān', 'menu', 'thực đơn'], ['帮助', 'bāngzhù', 'help', 'giúp đỡ'], ['安静', 'ānjìng', 'quiet', 'yên tĩnh'], ['画家', 'huàjiā', 'painter', 'hoạ sĩ'], ['同学们', 'tóngxuémen', 'classmates (plural)', 'các bạn học']],
        mEN: 'Looking up every unknown word. This breaks your reading rhythm and you forget the story. Look up <em>after</em> finishing the passage, unless the word blocks the answer.',
        mVI: 'Tra mọi từ lạ. Việc này làm đứt nhịp đọc và bạn quên mạch truyện. Hãy tra <em>sau khi</em> đọc xong, trừ khi từ đó chặn đáp án.',
        sEN: ['Skip, guess, then look up', 'Patterns: verb-result, verb-object, suffixes {{-员 -家 -者}}', 'Time yourself; aim to read in chunks'],
        sVI: ['Bỏ qua, đoán, rồi mới tra', 'Kiểu từ: động–kết quả, động–tân, hậu tố {{-员 -家 -者}}', 'Bấm giờ; tập đọc theo cụm'],
        lk: [U.mdbg, U.pleco, U.hsk3],
        p: [
          ['What kind of person is a {{售货员}}? Which part tells you?', 'A shop assistant; {{-员}} marks a person in a job and {{货}} means goods.', '{{售货员}} là người thế nào? Bộ phận nào cho biết?', 'Nhân viên bán hàng; {{-员}} chỉ người làm nghề và {{货}} nghĩa là hàng hoá.'],
          ['Break {{做完}} into parts.', '{{做}} (do) + {{完}} (finish) = finish doing.', 'Tách {{做完}} thành các phần.', '{{做}} (làm) + {{完}} (xong) = làm xong.'],
          ['Guess the meaning of {{无聊}} from {{无}} (no) and {{聊}} (chat).', 'Boring, dull (nothing to chat about).', 'Đoán nghĩa {{无聊}} từ {{无}} (không) và {{聊}} (chuyện trò).', 'Chán, tẻ nhạt (không có gì để nói).'],
        ],
      }),
    QZ(1, 'Quiz 1 — Reading HSK 3 passages|||Quiz 1 — Đọc đoạn văn HSK 3', 'Kiểm tra ba lượt đọc, từ tín hiệu, đại từ và đoán từ.', [
      Q('q1', 'In the three-pass method, what do you do in pass 2?', 'Trong phương pháp ba lượt, lượt 2 làm gì?', ['Read the questions and underline key words|||Đọc câu hỏi và gạch từ khoá', 'Translate the whole text|||Dịch cả văn bản', 'Look up every unknown word|||Tra mọi từ lạ', 'Copy the passage|||Chép lại đoạn văn'], 0, 'Questions first focus your reading.', 'Đọc câu hỏi trước giúp định hướng việc đọc.'),
      Q('q2', 'In {{虽然……但是……}}, the main point is usually…', 'Trong {{虽然……但是……}}, ý chính thường nằm ở…', ['after {{但是}}|||sau {{但是}}', 'after {{虽然}}|||sau {{虽然}}', 'in the title|||ở tiêu đề', 'nowhere|||không ở đâu cả'], 0, 'The idea after {{但是}} carries the point.', 'Ý sau {{但是}} mang ý chính.'),
      Q('q3', '{{因为……所以……}} expresses…', '{{因为……所以……}} biểu thị…', ['cause and result|||nguyên nhân và kết quả', 'sequence|||trình tự', 'comparison|||so sánh', 'question|||câu hỏi'], 0, 'Cause then result.', 'Nguyên nhân rồi kết quả.'),
      Q('q4', 'Which word means “finally”?', 'Từ nào nghĩa là “cuối cùng”?', ['{{最后}}', '{{先}}', '{{后来}}', '{{刚}}'], 0, '{{最后}} zuìhòu = finally.', '{{最后}} zuìhòu = cuối cùng.'),
      Q('q5', 'In {{妈妈说它可能病了}}, {{它}} refers to…', 'Trong {{妈妈说它可能病了}}, {{它}} chỉ…', ['the dog|||con chó', 'Mum|||mẹ', 'the doctor|||bác sĩ', 'the park|||công viên'], 0, '{{它}} is for animals/things; the dog is meant.', '{{它}} dùng cho con vật/đồ vật; ở đây là con chó.'),
      Q('q6', 'What does {{-员}} usually mark?', '{{-员}} thường đánh dấu gì?', ['a person with a job|||người làm một nghề', 'a place|||nơi chốn', 'a tense|||thì', 'a question|||câu hỏi'], 0, 'e.g. {{服务员}}, {{售货员}}.', 'Ví dụ {{服务员}}, {{售货员}}.'),
      Q('q7', 'A word you do not know does not affect the answer. Best action?', 'Một từ lạ không ảnh hưởng đáp án. Nên làm gì?', ['Skip it and continue|||Bỏ qua và đọc tiếp', 'Stop and look up|||Dừng lại tra', 'Give up|||Bỏ cuộc', 'Change the question|||Đổi câu hỏi'], 0, 'Skip first; look up after.', 'Bỏ qua trước; tra sau.'),
      Q('q8', '{{听懂}} is built as…', '{{听懂}} có cấu tạo…', ['verb + result|||động từ + kết quả', 'verb + object|||động từ + tân ngữ', 'noun + noun|||danh từ + danh từ', 'adjective + noun|||tính từ + danh từ'], 0, '{{听}} (listen) + {{懂}} (understand).', '{{听}} (nghe) + {{懂}} (hiểu).'),
    ]),
  ],
};

// ───────────────────────────── Chương 2 ─────────────────────────────
const c2 = {
  title: 'Chapter 2 — Character structure and more radicals|||Chương 2 — Cấu tạo chữ và thêm bộ thủ',
  description: 'Vị trí và tên gọi bộ thủ, biến thể hình dạng, ba nhóm bộ thủ mới và họ thanh phù, nối tiếp 40 bộ thủ của CRW101.',
  lessons: [
    L('crw201-ts-2-1', '2.1 Where radicals sit and how their shapes change|||2.1 Bộ thủ nằm ở đâu và đổi hình thế nào',
      'Năm vị trí của bộ thủ, bảng biến thể (人→亻, 水→氵, 衣→衤…), cách gọi tên bộ thủ.',
      {
        gEN: ['Name the five positions a radical can take', 'Recognise the compressed variants of common radicals', 'Name a radical when you ask a Chinese teacher about a character'],
        gVI: ['Gọi tên năm vị trí của bộ thủ', 'Nhận ra các biến thể rút gọn của bộ thủ thông dụng', 'Gọi tên bộ thủ khi hỏi giáo viên Trung Quốc về một chữ'],
        bEN: `<p>CRW101 introduced radicals as the meaning part of a character. A radical is not always at the left. Learn the <strong>five positions</strong> and you can look at a new character and decide where to cut it.</p>
<table><thead><tr><th>Position</th><th>Chinese term</th><th>Example</th></tr></thead><tbody>
<tr><td>left</td><td>{{左偏旁}}</td><td>{{妈}} ({{女}}), {{河}} ({{氵}})</td></tr>
<tr><td>right</td><td>{{右偏旁}}</td><td>{{到}} ({{刂}}), {{教}} ({{攵}})</td></tr>
<tr><td>top</td><td>{{头}}</td><td>{{家}} ({{宀}}), {{雪}} ({{雨}})</td></tr>
<tr><td>bottom</td><td>{{底}}</td><td>{{想}} ({{心}}), {{蛋}} ({{虫}})</td></tr>
<tr><td>surrounding</td><td>{{框}}</td><td>{{国}} ({{囗}}), {{起}} ({{走}}), {{原}} ({{厂}})</td></tr>
</tbody></table>
<h4>Variants</h4>
<p>Many radicals have a full form (used alone) and a squeezed form (used inside a character) so that the square stays balanced. You already know {{亻}}, {{氵}}, {{扌}}, {{忄}}, {{讠}}. New ones in this course:</p>
<table><thead><tr><th>Full form</th><th>Variant</th><th>Name used by teachers</th><th>Example</th></tr></thead><tbody>
<tr><td>{{刀}} knife</td><td>{{刂}}</td><td>{{立刀旁}}</td><td>{{别}}</td></tr>
<tr><td>{{犬}} dog</td><td>{{犭}}</td><td>{{反犬旁}}</td><td>{{狗}}</td></tr>
<tr><td>{{示}} altar</td><td>{{礻}}</td><td>{{示字旁}}</td><td>{{礼}}</td></tr>
<tr><td>{{衣}} clothes</td><td>{{衤}}</td><td>{{衣字旁}}</td><td>{{裤}}</td></tr>
<tr><td>{{肉}} flesh</td><td>{{月}}</td><td>{{肉月旁}}</td><td>{{脸}}</td></tr>
<tr><td>{{阜 / 邑}}</td><td>{{阝}}</td><td>{{左耳旁 / 右耳旁}}</td><td>{{院 / 都}}</td></tr>
</tbody></table>
<p><strong>Watch the position.</strong> {{阝}} on the <em>left</em> comes from {{阜}} “mound” ({{院}} yuàn, {{阳}} yáng); on the <em>right</em> it comes from {{邑}} “city” ({{都}} dōu, {{那}} nà). Same shape, different origin, and the position tells you which. The flesh radical {{月}} looks like the moon in {{明}}; but in {{脸}}, {{胖}} it relates to the body.</p>
<p><strong>How to use it.</strong> When you see a new character, first cut off the radical by its position, name it, then guess the meaning field: {{狗}} must have something to do with animals.</p>`,
        bVI: `<p>CRW101 giới thiệu bộ thủ là phần chỉ nghĩa của chữ. Bộ thủ không phải lúc nào cũng nằm bên trái. Học <strong>năm vị trí</strong> thì gặp chữ mới bạn sẽ biết cắt ở đâu.</p>
<table><thead><tr><th>Vị trí</th><th>Thuật ngữ Trung</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>trái</td><td>{{左偏旁}}</td><td>{{妈}} ({{女}}), {{河}} ({{氵}})</td></tr>
<tr><td>phải</td><td>{{右偏旁}}</td><td>{{到}} ({{刂}}), {{教}} ({{攵}})</td></tr>
<tr><td>trên</td><td>{{头}}</td><td>{{家}} ({{宀}}), {{雪}} ({{雨}})</td></tr>
<tr><td>dưới</td><td>{{底}}</td><td>{{想}} ({{心}}), {{蛋}} ({{虫}})</td></tr>
<tr><td>bao quanh</td><td>{{框}}</td><td>{{国}} ({{囗}}), {{起}} ({{走}}), {{原}} ({{厂}})</td></tr>
</tbody></table>
<h4>Biến thể</h4>
<p>Nhiều bộ thủ có dạng đầy đủ (dùng riêng) và dạng ép lại (dùng trong chữ) để ô vuông cân đối. Bạn đã biết {{亻}}, {{氵}}, {{扌}}, {{忄}}, {{讠}}. Những dạng mới trong khoá này:</p>
<table><thead><tr><th>Dạng đầy đủ</th><th>Biến thể</th><th>Tên giáo viên hay gọi</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>{{刀}} dao</td><td>{{刂}}</td><td>{{立刀旁}}</td><td>{{别}}</td></tr>
<tr><td>{{犬}} chó</td><td>{{犭}}</td><td>{{反犬旁}}</td><td>{{狗}}</td></tr>
<tr><td>{{示}} bàn thờ</td><td>{{礻}}</td><td>{{示字旁}}</td><td>{{礼}}</td></tr>
<tr><td>{{衣}} áo</td><td>{{衤}}</td><td>{{衣字旁}}</td><td>{{裤}}</td></tr>
<tr><td>{{肉}} thịt</td><td>{{月}}</td><td>{{肉月旁}}</td><td>{{脸}}</td></tr>
<tr><td>{{阜 / 邑}}</td><td>{{阝}}</td><td>{{左耳旁 / 右耳旁}}</td><td>{{院 / 都}}</td></tr>
</tbody></table>
<p><strong>Để ý vị trí.</strong> {{阝}} bên <em>trái</em> xuất phát từ {{阜}} “gò đất” ({{院}} yuàn, {{阳}} yáng); bên <em>phải</em> xuất phát từ {{邑}} “thành ấp” ({{都}} dōu, {{那}} nà). Cùng hình nhưng khác gốc, và vị trí cho biết là loại nào. Bộ nhục {{月}} trông giống mặt trăng trong {{明}}, nhưng trong {{脸}}, {{胖}} nó liên quan đến cơ thể.</p>
<p><strong>Cách dùng.</strong> Gặp chữ mới, trước hết cắt bộ thủ theo vị trí, gọi tên nó, rồi đoán trường nghĩa: {{狗}} chắc chắn có liên quan đến con vật.</p>`,
        tab: [['别', 'bié', 'other; do not', 'khác; đừng'], ['狗', 'gǒu', 'dog', 'con chó'], ['礼', 'lǐ', 'courtesy, gift', 'lễ, quà'], ['裤', 'kù', 'trousers', 'quần'], ['脸', 'liǎn', 'face', 'khuôn mặt'], ['院', 'yuàn', 'courtyard, institution', 'sân, viện'], ['都', 'dōu', 'all', 'đều']],
        mEN: 'Getting the stroke order of {{阝}} wrong. The shape is the same on both sides, but on the <em>left</em> it is written first ({{院}}) and on the <em>right</em> it is written last ({{都}}: {{者}} first, then {{阝}}). Also keep {{刂}} as a short stroke and a long vertical hook, not a letter “I”.',
        mVI: 'Sai thứ tự nét của {{阝}}. Hình giống nhau ở hai bên, nhưng bên <em>trái</em> viết trước ({{院}}), bên <em>phải</em> viết sau cùng ({{都}}: {{者}} trước rồi mới {{阝}}). Giữ {{刂}} là một nét ngắn và một nét sổ móc dài, đừng viết thành chữ “I”.',
        sEN: ['Five positions: left, right, top, bottom, surround', 'Variants: {{刂 犭 礻 衤 月 阝}}', 'Cut by position, name it, guess the meaning field'],
        sVI: ['Năm vị trí: trái, phải, trên, dưới, bao quanh', 'Biến thể: {{刂 犭 礻 衤 月 阝}}', 'Cắt theo vị trí, gọi tên, đoán trường nghĩa'],
        lk: [U.kangxi, U.radical, U.yb, U.hanzi],
        p: [
          ['Which position is the radical in {{想}}? Name it.', 'Bottom: {{心}} (the “heart bottom”).', 'Bộ thủ của {{想}} ở vị trí nào? Gọi tên.', 'Phía dưới: {{心}} (“tâm dưới”).'],
          ['{{院}} and {{都}} both have {{阝}}. Which one is the “mound” and which the “city”?', '{{院}} (left) = mound {{阜}}; {{都}} (right) = city {{邑}}.', '{{院}} và {{都}} đều có {{阝}}. Chữ nào là “gò”, chữ nào là “thành”?', '{{院}} (trái) = gò {{阜}}; {{都}} (phải) = thành {{邑}}.'],
          ['What is the full form of {{犭}}?', '{{犬}} (dog).', 'Dạng đầy đủ của {{犭}} là gì?', '{{犬}} (chó).'],
        ],
      }),
    L('crw201-ts-2-2', '2.2 Radicals of animals, body, movement and value|||2.2 Bộ thủ về con vật, cơ thể, chuyển động và giá trị',
      'Bảy bộ thủ mới: 犭 虫 足 彳 走 贝 页 kèm ví dụ HSK 3.',
      {
        gEN: ['Learn seven new radicals with meaning fields', 'Guess a new character from its radical', 'Write each example with the correct order'],
        gVI: ['Học bảy bộ thủ mới cùng trường nghĩa', 'Đoán chữ mới từ bộ thủ', 'Viết từng ví dụ đúng thứ tự nét'],
        bEN: `<p>Each radical below is a small “dictionary field”. Learn the field, then the examples.</p>
<ul>
<li><strong>{{犭}} animals (mostly mammals):</strong> {{狗}} dog, {{猫}} cat. <em>Note:</em> {{鸡}} chicken uses {{鸟}} (bird), not {{犭}}.</li>
<li><strong>{{虫}} insects, small creatures:</strong> {{蚊}} mosquito, {{蛋}} egg (a character where {{虫}} is only a component at the bottom, so use it with care).</li>
<li><strong>{{足}} / {{⻊}} foot and movement:</strong> {{跑}} run, {{跳}} jump, {{路}} road, {{跟}} follow.</li>
<li><strong>{{彳}} road, going:</strong> {{很}}, {{往}} toward, {{得}} (in {{得到}}). The meaning is weak here; {{彳}} is a historical “step” sign.</li>
<li><strong>{{走}} walk:</strong> {{起}} rise, {{超}} exceed, {{越}} cross over. The radical sits at the bottom-left and wraps the rest.</li>
<li><strong>{{贝}} shell = money, value:</strong> {{贵}} expensive, {{货}} goods, {{财}} wealth. Shells were once currency, so many “money” words use it.</li>
<li><strong>{{页}} head, page:</strong> {{题}} topic, {{顺}} smooth, {{须}} must. {{页}} originally meant head, so words about the head or facing have it.</li>
</ul>
<h4>Using the field</h4>
<p>If you read {{这个包太贵了。}} you may not know {{贵}}, but {{贝}} suggests money, and {{太……了}} gives “too …”. The meaning “expensive” is easy to infer.</p>
<p>Contrast with CRW101: {{钅}} (metal) appears in {{钱}} “money” because coins were metal, while {{贝}} (shell) appears in {{贵}}, {{货}}, {{财}} because shells were once currency. Both radicals can mark money words.</p>
<div class="callout"><p lang="zh">我家有一只猫和一条狗。它们每天跑来跑去，很可爱。</p><p>Wǒ jiā yǒu yì zhī māo hé yì tiáo gǒu. Tāmen měi tiān pǎo lái pǎo qù, hěn kě'ài.</p><p>My family has a cat and a dog. They run around every day and are very cute.</p></div>`,
        bVI: `<p>Mỗi bộ thủ dưới đây là một “trường từ điển” nhỏ. Học trường nghĩa trước rồi mới học ví dụ.</p>
<ul>
<li><strong>{{犭}} con vật (chủ yếu thú có vú):</strong> {{狗}} chó, {{猫}} mèo. <em>Lưu ý:</em> {{鸡}} (gà) dùng {{鸟}} (chim), không phải {{犭}}.</li>
<li><strong>{{虫}} côn trùng, sinh vật nhỏ:</strong> {{蚊}} muỗi, {{蛋}} trứng (ở đây {{虫}} chỉ là bộ phận dưới đáy, nên dùng cẩn thận).</li>
<li><strong>{{足}} / {{⻊}} bàn chân, chuyển động:</strong> {{跑}} chạy, {{跳}} nhảy, {{路}} đường, {{跟}} theo.</li>
<li><strong>{{彳}} đường đi:</strong> {{很}}, {{往}} hướng tới, {{得}} (trong {{得到}}). Nghĩa ở đây yếu; {{彳}} là dấu “bước chân” theo lịch sử.</li>
<li><strong>{{走}} đi bộ:</strong> {{起}} dậy, {{超}} vượt, {{越}} vượt qua. Bộ thủ ở góc dưới trái và ôm phần còn lại.</li>
<li><strong>{{贝}} vỏ sò = tiền, giá trị:</strong> {{贵}} đắt, {{货}} hàng hoá, {{财}} của cải. Xưa vỏ sò là tiền, nên nhiều từ về tiền có nó.</li>
<li><strong>{{页}} đầu, trang:</strong> {{题}} đề, {{顺}} thuận, {{须}} phải. {{页}} gốc nghĩa là đầu nên từ liên quan đến đầu, hướng mặt có nó.</li>
</ul>
<h4>Dùng trường nghĩa</h4>
<p>Nếu đọc {{这个包太贵了。}} có thể bạn chưa biết {{贵}}, nhưng {{贝}} gợi tiền, và {{太……了}} nghĩa “quá …”. Dễ suy ra nghĩa “đắt”.</p>
<p>Đối chiếu với CRW101: {{钅}} (kim loại) có trong {{钱}} “tiền” vì tiền xu bằng kim loại, còn {{贝}} (vỏ sò) có trong {{贵}}, {{货}}, {{财}} vì xưa vỏ sò là tiền. Cả hai bộ đều có thể đánh dấu từ về tiền.</p>
<div class="callout"><p lang="zh">我家有一只猫和一条狗。它们每天跑来跑去，很可爱。</p><p>Wǒ jiā yǒu yì zhī māo hé yì tiáo gǒu. Tāmen měi tiān pǎo lái pǎo qù, hěn kě'ài.</p><p>Nhà tôi có một con mèo và một con chó. Chúng ngày nào cũng chạy qua chạy lại, rất dễ thương.</p></div>`,
        tab: [['猫', 'māo', 'cat', 'con mèo'], ['蛋', 'dàn', 'egg', 'trứng'], ['跳', 'tiào', 'jump', 'nhảy'], ['路', 'lù', 'road', 'đường'], ['起', 'qǐ', 'rise, get up', 'dậy, nổi lên'], ['贵', 'guì', 'expensive', 'đắt'], ['题', 'tí', 'topic, question', 'đề, câu hỏi']],
        mEN: 'Treating a radical as a rule. {{蛋}} has {{虫}} but means egg, and {{得}} has {{彳}} but nothing to do with roads. A radical gives a <em>hint about the field</em>, not a guarantee. Combine it with context.',
        mVI: 'Coi bộ thủ là quy tắc tuyệt đối. {{蛋}} có {{虫}} nhưng nghĩa là trứng, {{得}} có {{彳}} nhưng không liên quan đến đường. Bộ thủ chỉ <em>gợi trường nghĩa</em>, không đảm bảo. Hãy kết hợp với ngữ cảnh.',
        sEN: ['{{犭 虫 足 彳 走 贝 页}} — seven new fields', 'The radical hints at the field; context decides', '{{贝}} = shell/money, {{钅}} = metal'],
        sVI: ['{{犭 虫 足 彳 走 贝 页}} — bảy trường nghĩa mới', 'Bộ thủ gợi trường nghĩa; ngữ cảnh quyết định', '{{贝}} = vỏ sò/tiền, {{钅}} = kim loại'],
        lk: [U.yb, U.hanzi, U.mdbg],
        p: [
          ['Guess the field of {{货}} and give a word with it.', 'Goods/money ({{贝}}); {{货}} huò = goods.', 'Đoán trường nghĩa của {{货}}.', 'Hàng hoá/tiền ({{贝}}); {{货}} huò = hàng hoá.'],
          ['Which radical does {{跑}} use, and why?', '{{足}} (foot) — running uses the feet.', '{{跑}} dùng bộ nào, vì sao?', '{{足}} (chân) — chạy dùng chân.'],
          ['Sort: {{起}}, {{超}}, {{越}} — what do they share?', 'The radical {{走}} (walk, move).', 'Phân loại: {{起}}, {{超}}, {{越}} — chúng chung gì?', 'Bộ {{走}} (đi, di chuyển).'],
        ],
      }),
    L('crw201-ts-2-3', '2.3 Radicals of clothes, grain, weather and materials|||2.3 Bộ thủ về quần áo, ngũ cốc, thời tiết và vật liệu',
      'Sáu bộ thủ mới: 衤/礻, 禾, 米, 雨, 石, 巾 kèm ví dụ.',
      {
        gEN: ['Learn six more radical fields', 'Link each to everyday HSK 3 words', 'Write the weather and clothes words in short sentences'],
        gVI: ['Học thêm sáu trường bộ thủ', 'Gắn mỗi bộ với từ đời thường HSK 3', 'Viết từ chỉ thời tiết và quần áo trong câu ngắn'],
        bEN: `<ul>
<li><strong>{{衤}} clothes:</strong> {{裤}} trousers, {{裙}} skirt, {{被}} quilt (and the passive). <strong>{{礻}} worship, blessing:</strong> {{礼}}, {{祝}} wish, {{福}} luck. They look alike: {{衤}} has one more stroke (a dot) than {{礻}} — remember “clothes have an extra sleeve dot”.</li>
<li><strong>{{禾}} grain, seasons:</strong> {{秋}} autumn, {{种}} kind or to plant, {{科}} subject, {{租}} rent.</li>
<li><strong>{{米}} rice, food:</strong> {{粉}} powder, {{糖}} sugar, {{粥}} congee.</li>
<li><strong>{{雨}} rain, sky:</strong> {{雪}} snow, {{雷}} thunder, {{零}} zero. {{雨}} always sits on top.</li>
<li><strong>{{石}} stone:</strong> {{破}} broken, {{码}} number, code.</li>
<li><strong>{{巾}} cloth:</strong> {{布}} cloth, {{帮}} help, {{常}} often, {{帽}} hat.</li>
</ul>
<h4>Short writing practice</h4>
<p>Use the weather and clothes words in a three-sentence diary line:</p>
<div class="callout"><p lang="zh">秋天到了，天气越来越凉。今天下雨了，我穿了一条新裤子和一件厚衣服。同学们说，秋天是最好的季节。</p>
<p>Qiūtiān dào le, tiānqì yuè lái yuè liáng. Jīntiān xià yǔ le, wǒ chuān le yì tiáo xīn kùzi hé yí jiàn hòu yīfu. Tóngxuémen shuō, qiūtiān shì zuì hǎo de jìjié.</p>
<p>Autumn has come and the weather is getting cooler and cooler. It rained today and I wore new trousers and a thick coat. My classmates say that autumn is the best season.</p></div>
<p>Notice {{越来越凉}} (more and more cool) and the measure words: {{一条裤子}} (long thing), {{一件衣服}} (clothing).</p>
<h4>Stroke-order tips</h4>
<p>{{雨}}: write the top horizontal, the vertical, the frame, then the four dots inside (as in a window). {{禾}}: the short left-falling stroke first, then horizontal, vertical, left-falling and right-falling. {{米}}: a dot, a left-falling stroke, then horizontal, vertical, and finally left-falling and right-falling.</p>`,
        bVI: `<ul>
<li><strong>{{衤}} quần áo:</strong> {{裤}} quần, {{裙}} váy, {{被}} chăn (và bị động). <strong>{{礻}} thờ cúng, phúc:</strong> {{礼}}, {{祝}} chúc, {{福}} phúc. Hai bộ giống nhau: {{衤}} nhiều hơn {{礻}} một nét (một chấm) — nhớ “quần áo có thêm chấm ở tay áo”.</li>
<li><strong>{{禾}} lúa, mùa:</strong> {{秋}} mùa thu, {{种}} loại hoặc trồng, {{科}} môn, {{租}} thuê.</li>
<li><strong>{{米}} gạo, thức ăn:</strong> {{粉}} bột, {{糖}} đường, {{粥}} cháo.</li>
<li><strong>{{雨}} mưa, bầu trời:</strong> {{雪}} tuyết, {{雷}} sấm, {{零}} số không. {{雨}} luôn nằm ở trên.</li>
<li><strong>{{石}} đá:</strong> {{破}} vỡ, {{码}} số, mã.</li>
<li><strong>{{巾}} khăn vải:</strong> {{布}} vải, {{帮}} giúp, {{常}} thường, {{帽}} mũ.</li>
</ul>
<h4>Luyện viết ngắn</h4>
<p>Dùng từ thời tiết và quần áo trong một dòng nhật ký ba câu:</p>
<div class="callout"><p lang="zh">秋天到了，天气越来越凉。今天下雨了，我穿了一条新裤子和一件厚衣服。同学们说，秋天是最好的季节。</p>
<p>Qiūtiān dào le, tiānqì yuè lái yuè liáng. Jīntiān xià yǔ le, wǒ chuān le yì tiáo xīn kùzi hé yí jiàn hòu yīfu. Tóngxuémen shuō, qiūtiān shì zuì hǎo de jìjié.</p>
<p>Mùa thu đến rồi, thời tiết càng ngày càng mát. Hôm nay trời mưa, tôi mặc một chiếc quần mới và một cái áo dày. Các bạn nói mùa thu là mùa đẹp nhất.</p></div>
<p>Chú ý {{越来越凉}} (càng ngày càng mát) và lượng từ: {{一条裤子}} (vật dài), {{一件衣服}} (quần áo).</p>
<h4>Mẹo thứ tự nét</h4>
<p>{{雨}}: nét ngang trên, nét sổ, khung, rồi bốn chấm bên trong (như ô cửa sổ). {{禾}}: nét phẩy ngắn trước, rồi ngang, sổ, phẩy và mác. {{米}}: một chấm, một nét phẩy, rồi ngang, sổ, cuối cùng phẩy và mác.</p>`,
        tab: [['裤子', 'kùzi', 'trousers', 'quần'], ['秋天', 'qiūtiān', 'autumn', 'mùa thu'], ['糖', 'táng', 'sugar, candy', 'đường, kẹo'], ['雪', 'xuě', 'snow', 'tuyết'], ['零', 'líng', 'zero', 'số không'], ['帮助', 'bāngzhù', 'help', 'giúp đỡ'], ['季节', 'jìjié', 'season', 'mùa']],
        mEN: 'Confusing {{衤}} and {{礻}}. Compare {{补}} (to patch, clothes → {{衤}}) with {{礼}} (courtesy → {{礻}}). If it is about cloth or garments it is {{衤}}; if it is about ritual or blessing it is {{礻}}.',
        mVI: 'Lẫn {{衤}} và {{礻}}. So {{补}} (vá, quần áo → {{衤}}) với {{礼}} (lễ → {{礻}}). Nếu liên quan vải vóc, áo quần thì là {{衤}}; liên quan lễ nghi, phúc thì là {{礻}}.',
        sEN: ['{{衤 礻 禾 米 雨 石 巾}} cover clothes, grain, weather, stone, cloth', '{{衤}} has one more dot than {{礻}}', '{{雨}} always on top'],
        sVI: ['{{衤 礻 禾 米 雨 石 巾}} gồm quần áo, lúa, thời tiết, đá, vải', '{{衤}} nhiều hơn {{礻}} một chấm', '{{雨}} luôn ở trên'],
        lk: [U.kangxi, U.yb, U.hanzi, U.yuelai],
        p: [
          ['Which radical is in {{祝}}? What does it hint at?', '{{礻}} — blessing, ritual (wish).', '{{祝}} có bộ nào? Gợi điều gì?', '{{礻}} — phúc, lễ nghi (chúc).'],
          ['Use {{越来越}} to say “It is getting colder and colder.”', '{{天气越来越冷了。}}', 'Dùng {{越来越}} để nói “Trời càng ngày càng lạnh”.', '{{天气越来越冷了。}}'],
          ['{{雪}} and {{雷}} share a radical. Name it and its position.', '{{雨}}, on top.', '{{雪}} và {{雷}} chung bộ nào, ở vị trí nào?', '{{雨}}, ở trên.'],
        ],
      }),
    L('crw201-ts-2-4', '2.4 Action radicals on the right and phonetic families|||2.4 Bộ thủ chỉ hành động bên phải và họ thanh phù',
      'Bộ 刂 阝 攵 và các nhóm chữ chung thanh phù 巴 可 反 昔 少 古 同.',
      {
        gEN: ['Learn three right-hand radicals', 'Use phonetic families to guess a pronunciation', 'Know the limits of the guessing method'],
        gVI: ['Học ba bộ thủ bên phải', 'Dùng họ thanh phù để đoán cách đọc', 'Biết giới hạn của phương pháp đoán'],
        bEN: `<h4>Right-hand radicals</h4>
<ul><li>{{刂}} (knife): cutting and dividing — {{别}} bié, {{刚}} gāng, {{利}} lì, {{刷}} shuā (to brush).</li>
<li>{{攵}} (tap, strike): actions done by hand — {{教}} jiāo/jiào, {{数}} shù, {{放}} fàng, {{收}} shōu, {{改}} gǎi.</li>
<li>{{阝}} (city): places — {{都}} dōu, {{部}} bù, {{那}} nà, {{邮}} yóu (post).</li></ul>
<p>Learn {{收到邮件}} “receive an email”, {{放心}} “be relieved”, {{改错}} “correct a mistake” as chunks — they are common in your writing.</p>
<h4>Phonetic families</h4>
<p>As in CRW101 3.3, most characters are built from a <strong>meaning part</strong> and a <strong>sound part</strong>. Seven phonetic families that appear in HSK 3:</p>
<table><thead><tr><th>Sound part</th><th>Sound</th><th>Family</th></tr></thead><tbody>
<tr><td>{{巴}} bā</td><td>bā / bà / pá</td><td>{{爸 bà, 吧 ba, 把 bǎ, 爬 pá}}</td></tr>
<tr><td>{{可}} kě</td><td>kě / hé / gē</td><td>{{河 hé, 歌 gē, 哥 gē}}</td></tr>
<tr><td>{{反}} fǎn</td><td>fǎn / fàn / bǎn</td><td>{{饭 fàn, 板 bǎn, 返 fǎn}}</td></tr>
<tr><td>{{昔}} xī</td><td>xī / cuò / jiè</td><td>{{错 cuò, 借 jiè, 惜 xī}}</td></tr>
<tr><td>{{少}} shǎo</td><td>chǎo / chāo</td><td>{{吵 chǎo, 炒 chǎo, 抄 chāo}}</td></tr>
<tr><td>{{古}} gǔ</td><td>gǔ / gù / kǔ</td><td>{{故 gù, 姑 gū, 苦 kǔ}}</td></tr>
<tr><td>{{同}} tóng</td><td>tóng / dòng / tǒng</td><td>{{铜 tóng, 洞 dòng, 筒 tǒng}}</td></tr>
</tbody></table>
<p>These help in two ways: you can guess a sound ({{爬}} is “p…á” like {{巴}}), and you can remember a character by saying “{{氵}} + {{可}} = {{河}}”. But the match is only <em>approximate</em>: tone, initial or vowel can drift over two thousand years. Treat it as a memory aid, not a spelling rule.</p>`,
        bVI: `<h4>Bộ thủ bên phải</h4>
<ul><li>{{刂}} (dao): cắt, chia — {{别}} bié, {{刚}} gāng, {{利}} lì, {{刷}} shuā (chải, đánh).</li>
<li>{{攵}} (gõ, đánh): hành động bằng tay — {{教}} jiāo/jiào, {{数}} shù, {{放}} fàng, {{收}} shōu, {{改}} gǎi.</li>
<li>{{阝}} (thành ấp): địa điểm — {{都}} dōu, {{部}} bù, {{那}} nà, {{邮}} yóu (bưu).</li></ul>
<p>Hãy học theo cụm: {{收到邮件}} “nhận được email”, {{放心}} “yên tâm”, {{改错}} “sửa lỗi” — chúng rất hay gặp khi viết.</p>
<h4>Họ thanh phù</h4>
<p>Như CRW101 bài 3.3, phần lớn chữ gồm <strong>phần chỉ nghĩa</strong> và <strong>phần chỉ âm</strong>. Bảy họ thanh phù xuất hiện ở HSK 3:</p>
<table><thead><tr><th>Phần chỉ âm</th><th>Âm</th><th>Họ chữ</th></tr></thead><tbody>
<tr><td>{{巴}} bā</td><td>bā / bà / pá</td><td>{{爸 bà, 吧 ba, 把 bǎ, 爬 pá}}</td></tr>
<tr><td>{{可}} kě</td><td>kě / hé / gē</td><td>{{河 hé, 歌 gē, 哥 gē}}</td></tr>
<tr><td>{{反}} fǎn</td><td>fǎn / fàn / bǎn</td><td>{{饭 fàn, 板 bǎn, 返 fǎn}}</td></tr>
<tr><td>{{昔}} xī</td><td>xī / cuò / jiè</td><td>{{错 cuò, 借 jiè, 惜 xī}}</td></tr>
<tr><td>{{少}} shǎo</td><td>chǎo / chāo</td><td>{{吵 chǎo, 炒 chǎo, 抄 chāo}}</td></tr>
<tr><td>{{古}} gǔ</td><td>gǔ / gù / kǔ</td><td>{{故 gù, 姑 gū, 苦 kǔ}}</td></tr>
<tr><td>{{同}} tóng</td><td>tóng / dòng / tǒng</td><td>{{铜 tóng, 洞 dòng, 筒 tǒng}}</td></tr>
</tbody></table>
<p>Chúng giúp theo hai cách: đoán âm ({{爬}} đọc “p…á” giống {{巴}}) và nhớ chữ bằng câu “{{氵}} + {{可}} = {{河}}”. Nhưng sự trùng khớp chỉ <em>gần đúng</em>: thanh điệu, phụ âm đầu hay vần có thể đã lệch sau hai nghìn năm. Hãy coi đây là mẹo nhớ, không phải quy tắc chính tả.</p>`,
        tab: [['教', 'jiāo / jiào', 'teach / teaching', 'dạy / giáo'], ['数', 'shù', 'number', 'số'], ['收', 'shōu', 'receive, collect', 'nhận, thu'], ['改', 'gǎi', 'change, correct', 'sửa, đổi'], ['邮件', 'yóujiàn', 'email, mail', 'thư, email'], ['借', 'jiè', 'borrow, lend', 'mượn, cho mượn'], ['吵', 'chǎo', 'noisy', 'ồn ào']],
        mEN: 'Reading {{错}} as “cuò” and then guessing {{借}} must also be “cuò”. The sound part {{昔}} is xī; {{错}} cuò and {{借}} jiè have shifted. When the guess disagrees with the dictionary, trust the dictionary and keep the family as a memory story.',
        mVI: 'Đọc {{错}} là “cuò” rồi đoán {{借}} cũng đọc “cuò”. Phần âm {{昔}} là xī; {{错}} cuò và {{借}} jiè đã đổi. Khi đoán khác từ điển, tin từ điển và giữ họ chữ như câu chuyện giúp nhớ.',
        sEN: ['{{刂 攵 阝}} are right-hand radicals for cutting, action, place', 'Phonetic families help memory but are approximate', 'Learn chunks: {{收到 放心 改错}}'],
        sVI: ['{{刂 攵 阝}} là bộ thủ bên phải: cắt, hành động, địa điểm', 'Họ thanh phù giúp nhớ nhưng chỉ gần đúng', 'Học theo cụm: {{收到 放心 改错}}'],
        lk: [U.class, U.chars, U.pleco],
        p: [
          ['Which sound part do {{爸}}, {{吧}}, {{把}} and {{爬}} share?', '{{巴}} bā.', '{{爸}}, {{吧}}, {{把}}, {{爬}} chung phần âm nào?', '{{巴}} bā.'],
          ['What do {{教}}, {{放}}, {{收}} share, and what is their radical?', 'They are actions done by hand; radical {{攵}}.', '{{教}}, {{放}}, {{收}} chung điều gì và bộ nào?', 'Đều là hành động bằng tay; bộ {{攵}}.'],
          ['Complete: {{氵}} + {{可}} = ?', '{{河}} hé (river).', 'Hoàn thành: {{氵}} + {{可}} = ?', '{{河}} hé (con sông).'],
        ],
      }),
    QZ(2, 'Quiz 2 — Structure and radicals II|||Quiz 2 — Cấu tạo chữ và bộ thủ II', 'Kiểm tra vị trí và biến thể bộ thủ, trường nghĩa, họ thanh phù.', [
      Q('q1', 'Which radical sits on top in {{雪}}?', 'Bộ thủ nào nằm trên trong {{雪}}?', ['{{雨}}', '{{彐}}', '{{氵}}', '{{石}}'], 0, '{{雨}} rain is the top radical.', '{{雨}} (mưa) là bộ ở trên.'),
      Q('q2', 'The variant of {{刀}} in {{别}} is…', 'Biến thể của {{刀}} trong {{别}} là…', ['{{刂}}', '{{力}}', '{{刃}}', '{{彳}}'], 0, '{{刂}} stand-knife.', '{{刂}} đứng dao.'),
      Q('q3', '{{贵}} has the radical…', '{{贵}} có bộ…', ['{{贝}}', '{{钅}}', '{{页}}', '{{走}}'], 0, '{{贝}} shell = money.', '{{贝}} vỏ sò = tiền.'),
      Q('q4', '{{衤}} is used for…', '{{衤}} dùng cho…', ['clothes|||quần áo', 'rain|||mưa', 'water|||nước', 'ritual|||lễ nghi'], 0, '{{裤}}, {{裙}}.', '{{裤}}, {{裙}}.'),
      Q('q5', 'The sound part of {{爸 把 吧 爬}} is…', 'Phần âm của {{爸 把 吧 爬}} là…', ['{{巴}}', '{{可}}', '{{反}}', '{{少}}'], 0, 'All have {{巴}} bā.', 'Tất cả có {{巴}} bā.'),
      Q('q6', '{{阝}} on the right side means…', '{{阝}} bên phải nghĩa là…', ['city (邑)|||thành ấp (邑)', 'mound (阜)|||gò (阜)', 'knife|||dao', 'dog|||chó'], 0, '{{都}}, {{部}}, {{那}}.', '{{都}}, {{部}}, {{那}}.'),
      Q('q7', 'Which radical is in {{教 放 收}}?', 'Bộ nào có trong {{教 放 收}}?', ['{{攵}}', '{{刂}}', '{{礻}}', '{{巾}}'], 0, 'Tap/strike, action by hand.', 'Gõ/đánh, hành động bằng tay.'),
      Q('q8', 'Phonetic families are…', 'Họ thanh phù là…', ['approximate hints|||gợi ý gần đúng', 'exact rules|||quy tắc chính xác', 'only for tones|||chỉ cho thanh điệu', 'only for verbs|||chỉ cho động từ'], 0, 'Sound drifts over time.', 'Âm thay đổi theo thời gian.'),
    ]),
  ],
};

// ───────────────────────────── Chương 3 ─────────────────────────────
const c3 = {
  title: 'Chapter 3 — Look-alikes, homophones and handwriting slips|||Chương 3 — Chữ gần hình, đồng âm và lỗi nét',
  description: 'Ba nhóm lỗi viết chữ hay gặp: nhầm chữ gần hình, nhầm đồng âm (kể cả 的/得/地), lỗi nét khi viết tay.',
  lessons: [
    L('crw201-ts-3-1', '3.1 Look-alike characters at HSK 3|||3.1 Chữ gần hình ở trình độ HSK 3',
      'Các cặp 昨/作/做, 住/往, 间/问/闻, 休/体, 晴/睛, 找/我, 场/汤 và cách phân biệt bằng bộ thủ.',
      {
        gEN: ['Separate seven look-alike sets by their radical', 'Use meaning to decide which one fits', 'Build a “confusion card” for your notebook'],
        gVI: ['Phân biệt bảy nhóm chữ gần hình bằng bộ thủ', 'Dùng nghĩa để chọn chữ đúng', 'Làm “thẻ nhầm lẫn” cho sổ chữ'],
        bEN: `<p>CRW101 3.4 covered {{己/已/巳}}, {{末/未}}, {{买/卖}} and others. At HSK 3 the confusion comes from characters that share a part and differ in the radical. The cure is always the same: <strong>name the radical, then ask what field the word belongs to</strong>.</p>
<table><thead><tr><th>Pair / set</th><th>Difference</th><th>Remember</th></tr></thead><tbody>
<tr><td>{{昨}} zuó / {{作}} zuò / {{做}} zuò</td><td>{{日}} sun; {{亻}} person; {{亻}} + {{故}}</td><td>{{昨天}} (yesterday, time → sun); {{作业}} homework; {{做饭}} cook</td></tr>
<tr><td>{{住}} zhù / {{往}} wǎng</td><td>{{亻}} vs {{彳}}</td><td>{{住}} live (person); {{往}} go toward (road)</td></tr>
<tr><td>{{间}} jiān / {{问}} wèn / {{闻}} wén</td><td>inside {{门}}: {{日}} / {{口}} / {{耳}}</td><td>sun through the gate = space; mouth = ask; ear = hear/smell</td></tr>
<tr><td>{{休}} xiū / {{体}} tǐ</td><td>{{木}} vs {{本}}</td><td>person under a tree = rest; {{本}} root = body</td></tr>
<tr><td>{{晴}} qíng / {{睛}} jīng</td><td>{{日}} vs {{目}}</td><td>{{晴天}} sunny; {{眼睛}} eye</td></tr>
<tr><td>{{找}} zhǎo / {{我}} wǒ</td><td>{{扌}} on {{找}}, none on {{我}}</td><td>hand → find</td></tr>
<tr><td>{{场}} chǎng / {{汤}} tāng</td><td>{{土}} vs {{氵}}</td><td>soil = field, place; water = soup</td></tr>
</tbody></table>
<h4>How to avoid the confusion</h4>
<ol><li><strong>Chunk, not character.</strong> Learn {{昨天}}, {{问题}}, {{时间}}, {{身体}}, {{晴天}}, {{找到}}, {{汤}} as units; the context fixes the character.</li>
<li><strong>Radical check.</strong> Before writing, say: “time word? → {{日}}; mouth/ask? → {{口}}”.</li>
<li><strong>Confusion card.</strong> For each mistake, write both characters side by side, circle the difference, and write one example word under each.</li></ol>
<div class="callout"><p lang="zh">昨天我在家休息，身体好多了。今天天气很晴，我想去公园找朋友玩儿。</p><p>Zuótiān wǒ zài jiā xiūxi, shēntǐ hǎo duō le. Jīntiān tiānqì hěn qíng, wǒ xiǎng qù gōngyuán zhǎo péngyou wánr.</p><p>Yesterday I rested at home and my health is much better. Today the weather is sunny, and I want to go to the park to look for friends to play with.</p></div>`,
        bVI: `<p>CRW101 bài 3.4 đã nói về {{己/已/巳}}, {{末/未}}, {{买/卖}}… Ở HSK 3, sự nhầm lẫn đến từ những chữ chung một phần và khác nhau ở bộ thủ. Cách chữa luôn như nhau: <strong>gọi tên bộ thủ, rồi hỏi từ thuộc trường nghĩa nào</strong>.</p>
<table><thead><tr><th>Cặp / nhóm</th><th>Khác nhau</th><th>Nhớ</th></tr></thead><tbody>
<tr><td>{{昨}} zuó / {{作}} zuò / {{做}} zuò</td><td>{{日}} mặt trời; {{亻}} người; {{亻}} + {{故}}</td><td>{{昨天}} (hôm qua, thời gian → mặt trời); {{作业}} bài tập; {{做饭}} nấu cơm</td></tr>
<tr><td>{{住}} zhù / {{往}} wǎng</td><td>{{亻}} so với {{彳}}</td><td>{{住}} ở (người); {{往}} hướng tới (đường)</td></tr>
<tr><td>{{间}} jiān / {{问}} wèn / {{闻}} wén</td><td>trong {{门}}: {{日}} / {{口}} / {{耳}}</td><td>mặt trời qua cổng = khoảng; miệng = hỏi; tai = nghe/ngửi</td></tr>
<tr><td>{{休}} xiū / {{体}} tǐ</td><td>{{木}} so với {{本}}</td><td>người dưới cây = nghỉ; {{本}} gốc = thân thể</td></tr>
<tr><td>{{晴}} qíng / {{睛}} jīng</td><td>{{日}} so với {{目}}</td><td>{{晴天}} trời nắng; {{眼睛}} mắt</td></tr>
<tr><td>{{找}} zhǎo / {{我}} wǒ</td><td>{{找}} có {{扌}}, {{我}} không</td><td>tay → tìm</td></tr>
<tr><td>{{场}} chǎng / {{汤}} tāng</td><td>{{土}} so với {{氵}}</td><td>đất = sân, nơi; nước = canh</td></tr>
</tbody></table>
<h4>Cách tránh nhầm</h4>
<ol><li><strong>Học theo cụm, không theo chữ lẻ.</strong> Học {{昨天}}, {{问题}}, {{时间}}, {{身体}}, {{晴天}}, {{找到}}, {{汤}} như một khối; ngữ cảnh sẽ chốt chữ.</li>
<li><strong>Kiểm bộ thủ.</strong> Trước khi viết, tự hỏi: “từ chỉ thời gian? → {{日}}; miệng/hỏi? → {{口}}”.</li>
<li><strong>Thẻ nhầm lẫn.</strong> Mỗi lỗi, viết hai chữ cạnh nhau, khoanh chỗ khác, ghi một từ ví dụ dưới mỗi chữ.</li></ol>
<div class="callout"><p lang="zh">昨天我在家休息，身体好多了。今天天气很晴，我想去公园找朋友玩儿。</p><p>Zuótiān wǒ zài jiā xiūxi, shēntǐ hǎo duō le. Jīntiān tiānqì hěn qíng, wǒ xiǎng qù gōngyuán zhǎo péngyou wánr.</p><p>Hôm qua tôi nghỉ ở nhà, sức khoẻ đã khá hơn nhiều. Hôm nay trời nắng đẹp, tôi muốn ra công viên tìm bạn chơi.</p></div>`,
        tab: [['昨天', 'zuótiān', 'yesterday', 'hôm qua'], ['作业', 'zuòyè', 'homework', 'bài tập về nhà'], ['问题', 'wèntí', 'question, problem', 'câu hỏi, vấn đề'], ['时间', 'shíjiān', 'time', 'thời gian'], ['身体', 'shēntǐ', 'body, health', 'cơ thể, sức khoẻ'], ['眼睛', 'yǎnjing', 'eye', 'mắt'], ['找', 'zhǎo', 'look for, find', 'tìm']],
        mEN: 'Writing {{昨天}} as {{作天}}. They sound close (zuó vs zuò) and share {{乍}}. Because the word is about <em>time</em>, you need {{日}}. A second typical slip: {{问题}} written as {{间题}}.',
        mVI: 'Viết {{昨天}} thành {{作天}}. Hai chữ đọc gần nhau (zuó và zuò) và cùng có {{乍}}. Vì đây là từ chỉ <em>thời gian</em> nên cần {{日}}. Một lỗi nữa: viết {{问题}} thành {{间题}}.',
        sEN: ['Look-alikes differ in the radical; name it', 'Learn words, not single characters', 'Keep a confusion card for each mistake'],
        sVI: ['Chữ gần hình khác nhau ở bộ thủ; gọi tên nó', 'Học từ, không học chữ lẻ', 'Mỗi lỗi làm một thẻ nhầm lẫn'],
        lk: [U.hanzi, U.mdbg, U.yb],
        p: [
          ['Fill: {{他住在这______。}} “He lives here” — {{住}} or {{往}}?', '{{住}} — to live.', 'Điền: {{他______在这儿。}} “Anh ấy sống ở đây” — {{住}} hay {{往}}?', '{{住}} — ở, sống.'],
          ['Which character: {{______气}} (weather is clear): {{晴}} or {{睛}}?', '{{晴}} ({{晴天}}).', 'Chữ nào: {{______天}} (trời nắng): {{晴}} hay {{睛}}?', '{{晴}} ({{晴天}}).'],
          ['What distinguishes {{问}} from {{闻}}?', 'The inside: {{口}} mouth (ask) vs {{耳}} ear (hear).', '{{问}} khác {{闻}} ở đâu?', 'Phần bên trong: {{口}} miệng (hỏi) và {{耳}} tai (nghe).'],
        ],
      }),
    L('crw201-ts-3-2', '3.2 Homophones: 在/再, 做/作, 的/得/地, 那/哪|||3.2 Chữ đồng âm: 在/再, 做/作, 的/得/地, 那/哪',
      'Phân biệt các chữ đọc giống nhau bằng chức năng ngữ pháp; quy tắc ba chữ de.',
      {
        gEN: ['Separate 在/再, 做/作, 那/哪, 他/她/它 by function', 'Use the rule for 的, 得, 地', 'Spot IME homophone errors in typed text'],
        gVI: ['Phân biệt 在/再, 做/作, 那/哪, 他/她/它 theo chức năng', 'Dùng quy tắc cho 的, 得, 地', 'Phát hiện lỗi đồng âm khi gõ'],
        bEN: `<p>When you type with pinyin, the computer shows several characters for one sound. Typing errors are almost always <strong>homophones</strong>. The solution is grammar and meaning, not sound.</p>
<table><thead><tr><th>Sound</th><th>Characters</th><th>Use</th></tr></thead><tbody>
<tr><td>zài</td><td>{{在}} / {{再}}</td><td>{{在}}: at, in, be doing; {{再}}: again, then, in the future</td></tr>
<tr><td>zuò</td><td>{{做}} / {{作}}</td><td>{{做}}: do, make (concrete things); {{作}} in fixed words ({{工作}}, {{作业}}, {{作家}})</td></tr>
<tr><td>nà / nǎ</td><td>{{那}} / {{哪}}</td><td>{{那}}: that; {{哪}}: which (a question, has {{口}})</td></tr>
<tr><td>tā</td><td>{{他}} / {{她}} / {{它}}</td><td>he; she; it</td></tr>
<tr><td>yǐ</td><td>{{以}} / {{已}}</td><td>{{以后}}, {{可以}} / {{已经}}</td></tr>
<tr><td>de</td><td>{{的}} / {{得}} / {{地}}</td><td>see below</td></tr>
</tbody></table>
<h4>The three <em>de</em></h4>
<ul><li>{{的}} — links a modifier and a <em>noun</em>: {{我的书}}, {{漂亮的衣服}}.</li>
<li>{{地}} — links an adverb phrase and a <em>verb</em>: {{高兴地说}}, {{慢慢地走}}.</li>
<li>{{得}} — links a verb and its <em>complement</em>: {{跑得快}}, {{说得很好}}, {{睡得不好}}.</li></ul>
<p>Quick test: what comes <em>after</em>? Noun → {{的}}; verb → {{地}}; the part before is the verb and after is how well → {{得}}. In informal chat many Chinese write {{的}} for all three, but in exams and formal writing the distinction is required.</p>
<div class="callout"><p lang="zh">昨天我做完作业，就高兴地去打球了。他打得很好，我们明天再打。</p><p>Zuótiān wǒ zuò wán zuòyè, jiù gāoxìng de qù dǎqiú le. Tā dǎ de hěn hǎo, wǒmen míngtiān zài dǎ.</p><p>Yesterday I finished my homework and happily went to play ball. He plays very well; we will play again tomorrow.</p></div>
<p>Each homophone has been tested: {{做完}} (concrete action), {{作业}} (fixed word), {{高兴地去}} (adverb + verb), {{打得很好}} (complement), {{明天再打}} (again, future).</p>`,
        bVI: `<p>Khi gõ bằng pinyin, máy hiện nhiều chữ cho một âm. Lỗi gõ hầu như luôn là <strong>đồng âm</strong>. Cách chữa là dựa vào ngữ pháp và nghĩa, không dựa vào âm.</p>
<table><thead><tr><th>Âm</th><th>Chữ</th><th>Cách dùng</th></tr></thead><tbody>
<tr><td>zài</td><td>{{在}} / {{再}}</td><td>{{在}}: ở, đang; {{再}}: lại, rồi, sau này</td></tr>
<tr><td>zuò</td><td>{{做}} / {{作}}</td><td>{{做}}: làm (việc cụ thể); {{作}} trong từ cố định ({{工作}}, {{作业}}, {{作家}})</td></tr>
<tr><td>nà / nǎ</td><td>{{那}} / {{哪}}</td><td>{{那}}: đó; {{哪}}: nào (câu hỏi, có {{口}})</td></tr>
<tr><td>tā</td><td>{{他}} / {{她}} / {{它}}</td><td>anh; chị; nó</td></tr>
<tr><td>yǐ</td><td>{{以}} / {{已}}</td><td>{{以后}}, {{可以}} / {{已经}}</td></tr>
<tr><td>de</td><td>{{的}} / {{得}} / {{地}}</td><td>xem bên dưới</td></tr>
</tbody></table>
<h4>Ba chữ <em>de</em></h4>
<ul><li>{{的}} — nối định ngữ và <em>danh từ</em>: {{我的书}}, {{漂亮的衣服}}.</li>
<li>{{地}} — nối trạng ngữ và <em>động từ</em>: {{高兴地说}}, {{慢慢地走}}.</li>
<li>{{得}} — nối động từ và <em>bổ ngữ</em>: {{跑得快}}, {{说得很好}}, {{睡得不好}}.</li></ul>
<p>Thử nhanh: <em>phía sau</em> là gì? Danh từ → {{的}}; động từ → {{地}}; phía trước là động từ, phía sau nói mức độ → {{得}}. Khi nhắn tin thân mật nhiều người Trung Quốc viết {{的}} cho cả ba, nhưng thi cử và văn bản trang trọng đòi hỏi phân biệt.</p>
<div class="callout"><p lang="zh">昨天我做完作业，就高兴地去打球了。他打得很好，我们明天再打。</p><p>Zuótiān wǒ zuò wán zuòyè, jiù gāoxìng de qù dǎqiú le. Tā dǎ de hěn hǎo, wǒmen míngtiān zài dǎ.</p><p>Hôm qua tôi làm xong bài tập rồi vui vẻ đi đá bóng. Cậu ấy chơi rất giỏi, ngày mai chúng tôi lại chơi tiếp.</p></div>
<p>Mỗi chữ đồng âm đã được kiểm: {{做完}} (hành động cụ thể), {{作业}} (từ cố định), {{高兴地去}} (trạng ngữ + động từ), {{打得很好}} (bổ ngữ), {{明天再打}} (lại, tương lai).</p>`,
        tab: [['再', 'zài', 'again, then', 'lại, rồi'], ['工作', 'gōngzuò', 'work; job', 'công việc'], ['哪', 'nǎ', 'which', 'nào'], ['已经', 'yǐjīng', 'already', 'đã'], ['漂亮', 'piàoliang', 'beautiful', 'đẹp'], ['高兴', 'gāoxìng', 'happy', 'vui'], ['慢慢', 'mànmàn', 'slowly', 'chậm rãi']],
        mEN: 'Typing {{我们再家里吃饭}} (using {{再}}) when you mean “we eat at home”. For location you need {{在}}: {{我们在家里吃饭}}. Another frequent error is {{他说得很快}} written with {{的}}; the verb {{说}} before the degree word needs {{得}}.',
        mVI: 'Gõ {{我们再家里吃饭}} (dùng {{再}}) khi muốn nói “chúng tôi ăn ở nhà”. Chỉ nơi chốn cần {{在}}: {{我们在家里吃饭}}. Lỗi hay gặp khác là viết {{他说的很快}} bằng {{的}}; động từ {{说}} trước từ chỉ mức độ cần {{得}}.',
        sEN: ['Homophones are solved by function, not sound', '{{的}} + noun, {{地}} + verb, verb + {{得}} + complement', '{{在}} = at/in, {{再}} = again'],
        sVI: ['Đồng âm giải quyết bằng chức năng, không bằng âm', '{{的}} + danh từ, {{地}} + động từ, động từ + {{得}} + bổ ngữ', '{{在}} = ở, {{再}} = lại'],
        lk: [U.ime, U.pinyin, U.gram3],
        p: [
          ['Choose: {{他跑______很快。}} (的/得/地)', '{{得}} — verb + degree complement.', 'Chọn: {{他跑______很快。}} (的/得/地)', '{{得}} — động từ + bổ ngữ mức độ.'],
          ['Choose: {{孩子们高兴______跑出去了。}} (的/得/地)', '{{地}} — it links the adverb phrase {{高兴}} to the verb {{跑}}.', 'Chọn: {{孩子们高兴______跑出去了。}} (的/得/地)', '{{地}} — nối trạng ngữ {{高兴}} với động từ {{跑}}.'],
          ['“Which day are you free?” {{______天你有空？}} {{那}} or {{哪}}?', '{{哪}} — a question word (“which”), so it carries {{口}}: {{哪天}}.', '“Ngày nào bạn rảnh?” {{______天你有空？}} {{那}} hay {{哪}}?', '{{哪}} — từ để hỏi (“nào”) nên có {{口}}: {{哪天}}.'],
        ],
      }),
    L('crw201-ts-3-3', '3.3 Stroke-level slips and clean handwriting|||3.3 Lỗi nét và chữ viết tay gọn gàng',
      'Các cặp 大/太/犬, 刀/力, 王/玉/主, 干/于/千, 日/曰, 土/士 và chuẩn viết tay khi thi.',
      {
        gEN: ['Spot extra, missing or misplaced strokes', 'Write clean characters that a marker can read', 'Use a four-step self-check for handwriting'],
        gVI: ['Phát hiện nét thừa, thiếu hoặc sai chỗ', 'Viết chữ sạch để người chấm đọc được', 'Dùng quy trình bốn bước tự kiểm tra chữ viết'],
        bEN: `<p>A single dot can change a character. Markers (and HSK graders) do not accept “almost right”. Learn the common slip pairs.</p>
<table><thead><tr><th>Set</th><th>Difference</th><th>Example word</th></tr></thead><tbody>
<tr><td>{{大}} / {{太}} / {{犬}}</td><td>no dot / dot below / dot at upper right</td><td>{{大学}}, {{太好了}}, {{警犬}}</td></tr>
<tr><td>{{刀}} / {{力}}</td><td>in {{力}} the left-falling stroke crosses the horizontal part; in {{刀}} it starts under it</td><td>{{刀子}}, {{力气}}</td></tr>
<tr><td>{{王}} / {{玉}} / {{主}}</td><td>dot at bottom right / dot on top</td><td>{{王先生}}, {{玉}}, {{主要}}</td></tr>
<tr><td>{{干}} / {{于}} / {{千}}</td><td>{{干}} plain vertical; {{于}} vertical hook; {{千}} starts with a left-falling stroke</td><td>{{干净}}, {{关于}}, {{一千}}</td></tr>
<tr><td>{{日}} / {{曰}}</td><td>{{曰}} is wider; an old word “say”</td><td>{{日子}}</td></tr>
<tr><td>{{土}} / {{士}}</td><td>the longer line is at the bottom for {{土}}, at the top for {{士}}</td><td>{{土地}}, {{士兵}}</td></tr>
</tbody></table>
<h4>Clean handwriting</h4>
<ul><li><strong>Square.</strong> Keep every character in an imaginary square; narrow or wide shapes ({{日}}, {{口}}) are not full squares.</li>
<li><strong>Stroke length.</strong> In {{土}}, the lower horizontal is longer; in {{未}} the upper horizontal is shorter than the lower one; in {{末}} the upper is longer.</li>
<li><strong>Do not join strokes.</strong> Cursive is not used in exams.</li>
<li><strong>Pen lift.</strong> Lifts follow the stroke order; do not draw a stroke in two parts.</li></ul>
<h4>Four-step self-check</h4>
<ol><li>Read the whole line aloud (does it make sense?).</li><li>Underline every new or doubtful character.</li><li>Check each underlined character in Hanzi Writer or a dictionary.</li><li>Rewrite wrong characters three times and add to your confusion cards.</li></ol>`,
        bVI: `<p>Chỉ một chấm có thể đổi cả chữ. Giám khảo (và người chấm HSK) không chấp nhận “gần đúng”. Hãy học các cặp hay trượt nét.</p>
<table><thead><tr><th>Nhóm</th><th>Khác nhau</th><th>Từ ví dụ</th></tr></thead><tbody>
<tr><td>{{大}} / {{太}} / {{犬}}</td><td>không chấm / chấm ở dưới / chấm ở trên bên phải</td><td>{{大学}}, {{太好了}}, {{警犬}}</td></tr>
<tr><td>{{刀}} / {{力}}</td><td>trong {{力}} nét phẩy cắt qua phần ngang; trong {{刀}} nét phẩy bắt đầu bên dưới</td><td>{{刀子}}, {{力气}}</td></tr>
<tr><td>{{王}} / {{玉}} / {{主}}</td><td>chấm góc dưới phải / chấm ở trên</td><td>{{王先生}}, {{玉}}, {{主要}}</td></tr>
<tr><td>{{干}} / {{于}} / {{千}}</td><td>{{干}} nét sổ thẳng; {{于}} nét sổ móc; {{千}} mở đầu bằng nét phẩy</td><td>{{干净}}, {{关于}}, {{一千}}</td></tr>
<tr><td>{{日}} / {{曰}}</td><td>{{曰}} rộng hơn; chữ cổ nghĩa “nói”</td><td>{{日子}}</td></tr>
<tr><td>{{土}} / {{士}}</td><td>{{土}} nét ngang dưới dài hơn, {{士}} nét ngang trên dài hơn</td><td>{{土地}}, {{士兵}}</td></tr>
</tbody></table>
<h4>Chữ viết tay gọn</h4>
<ul><li><strong>Ô vuông.</strong> Giữ mỗi chữ trong một ô vuông tưởng tượng; chữ hẹp hay rộng ({{日}}, {{口}}) không phủ đầy ô.</li>
<li><strong>Độ dài nét.</strong> Trong {{土}}, nét ngang dưới dài hơn; trong {{未}} nét ngang trên ngắn hơn nét dưới; trong {{末}} nét trên dài hơn.</li>
<li><strong>Không viết liền nét.</strong> Thi cử không dùng chữ thảo.</li>
<li><strong>Nhấc bút.</strong> Nhấc bút theo thứ tự nét; đừng vẽ một nét thành hai đoạn.</li></ul>
<h4>Bốn bước tự kiểm tra</h4>
<ol><li>Đọc to cả dòng (có hợp lý không?).</li><li>Gạch dưới mọi chữ mới hoặc nghi ngờ.</li><li>Tra từng chữ gạch dưới trong Hanzi Writer hoặc từ điển.</li><li>Viết lại chữ sai ba lần và thêm vào thẻ nhầm lẫn.</li></ol>`,
        tab: [['太', 'tài', 'too, extremely', 'quá, rất'], ['力气', 'lìqi', 'strength', 'sức lực'], ['主要', 'zhǔyào', 'main', 'chủ yếu'], ['干净', 'gānjìng', 'clean', 'sạch sẽ'], ['关于', 'guānyú', 'about, regarding', 'về, liên quan đến'], ['一千', 'yì qiān', 'one thousand', 'một nghìn'], ['土地', 'tǔdì', 'land', 'đất đai']],
        mEN: 'Writing {{太}} without the dot (so it becomes {{大}}), or with the dot in the wrong place. {{太}} has the dot below, in the lower right area. And writing {{干净}} as {{千净}}: the first stroke of {{干}} is a horizontal, not a left-falling stroke.',
        mVI: 'Viết {{太}} thiếu chấm (thành {{大}}) hoặc đặt chấm sai chỗ. {{太}} có chấm ở phía dưới. Và viết {{干净}} thành {{千净}}: nét đầu của {{干}} là nét ngang, không phải nét phẩy.',
        sEN: ['One stroke can change a character', 'Keep characters square and strokes unjoined', 'Self-check: read, underline, look up, rewrite'],
        sVI: ['Một nét có thể đổi cả chữ', 'Giữ chữ vuông vắn và không viết liền nét', 'Tự kiểm: đọc, gạch dưới, tra, viết lại'],
        lk: [U.stroke, U.hanzi, U.cali],
        p: [
          ['Which has the dot: {{大}} or {{太}}?', '{{太}} (the dot is below).', 'Chữ nào có chấm: {{大}} hay {{太}}?', '{{太}} (chấm ở dưới).'],
          ['Write “clean” in Chinese and name the first stroke of the first character.', '{{干净}}; the first stroke of {{干}} is a horizontal.', 'Viết “sạch sẽ” bằng tiếng Trung và nêu nét đầu của chữ đầu.', '{{干净}}; nét đầu của {{干}} là nét ngang.'],
          ['Why is cursive not recommended in exams?', 'Markers need clear, separate strokes; joined strokes can be misread.', 'Vì sao không nên viết thảo khi thi?', 'Người chấm cần nét rõ, tách; nét liền dễ bị đọc sai.'],
        ],
      }),
    QZ(3, 'Quiz 3 — Look-alikes, homophones and slips|||Quiz 3 — Chữ gần hình, đồng âm và lỗi nét', 'Kiểm tra phân biệt chữ gần hình, đồng âm, 的/得/地 và lỗi nét.', [
      Q('q1', '“Yesterday” is…', '“Hôm qua” là…', ['{{昨天}}', '{{作天}}', '{{做天}}', '{{乍天}}'], 0, '{{昨}} has {{日}} for time.', '{{昨}} có {{日}} chỉ thời gian.'),
      Q('q2', 'Which means “to ask”?', 'Chữ nào nghĩa là “hỏi”?', ['{{问}}', '{{间}}', '{{闻}}', '{{们}}'], 0, '{{口}} inside the gate.', '{{口}} trong cổng.'),
      Q('q3', 'Choose the right de: {{他说______很好。}}', 'Chọn de đúng: {{他说______很好。}}', ['{{得}}', '{{的}}', '{{地}}', '{{底}}'], 0, 'verb + complement.', 'động từ + bổ ngữ.'),
      Q('q4', 'Choose: {{我们明天______去。}} (again/at)', 'Chọn: {{我们明天______去。}}', ['{{再}}', '{{在}}', '{{载}}', '{{坐}}'], 0, '{{明天再去}}: go again tomorrow.', '{{明天再去}}: mai lại đi.'),
      Q('q5', 'Which has a dot below the horizontal?', 'Chữ nào có chấm ở dưới nét ngang?', ['{{太}}', '{{大}}', '{{天}}', '{{夫}}'], 0, 'The dot makes {{太}}.', 'Chấm tạo thành {{太}}.'),
      Q('q6', '{{眼______}} (eye) uses…', '{{眼______}} (mắt) dùng…', ['{{睛}}', '{{晴}}', '{{请}}', '{{清}}'], 0, '{{目}} for eye.', '{{目}} cho mắt.'),
      Q('q7', '{{地}} is used between…', '{{地}} nằm giữa…', ['adverb phrase and verb|||trạng ngữ và động từ', 'verb and complement|||động từ và bổ ngữ', 'adjective and noun|||tính từ và danh từ', 'noun and noun|||danh từ và danh từ'], 0, 'e.g. {{慢慢地走}}.', 'ví dụ {{慢慢地走}}.'),
      Q('q8', 'Best way to avoid look-alike errors?', 'Cách tốt nhất tránh nhầm chữ gần hình?', ['Learn words and name the radical|||Học theo từ và gọi tên bộ thủ', 'Guess by sound|||Đoán theo âm', 'Write faster|||Viết nhanh hơn', 'Ignore them|||Bỏ qua'], 0, 'Chunks plus radical check.', 'Học cụm và kiểm bộ thủ.'),
    ]),
  ],
};

// ───────────────────────────── Chương 4 ─────────────────────────────
const c4 = {
  title: 'Chapter 4 — Writing correct HSK 3 sentences|||Chương 4 — Viết câu HSK 3 đúng',
  description: 'Trật tự từ, 了/过/着, các loại bổ ngữ, 把/被 và so sánh dưới góc độ viết đúng và sửa lỗi.',
  lessons: [
    L('crw201-ts-4-1', '4.1 Word order checklist|||4.1 Danh sách kiểm trật tự từ',
      'Công thức chủ ngữ – thời gian – nơi chốn – trạng ngữ – động từ – tân ngữ; sửa các câu sai trật tự.',
      {
        gEN: ['Apply the order Subject – Time – Place – Adverb – Verb – Object', 'Place 都, 也, 还, 就, 才 and negation correctly', 'Fix word-order errors'],
        gVI: ['Áp dụng trật tự Chủ ngữ – Thời gian – Nơi chốn – Trạng ngữ – Động từ – Tân ngữ', 'Đặt đúng 都, 也, 还, 就, 才 và phủ định', 'Sửa lỗi trật tự từ'],
        bEN: `<p>In Chinese, information that tells <em>when</em>, <em>where</em> and <em>how</em> comes <strong>before</strong> the verb. English puts many of these after the verb, so this is the most common source of mistakes.</p>
<div class="formula"><span class="lbl">Core order</span>Subject + Time + Place + Adverb/Modal + Verb + Object</div>
<table><thead><tr><th>Wrong</th><th>Right</th><th>Reason</th></tr></thead><tbody>
<tr><td>{{我看书在图书馆。}}</td><td>{{我在图书馆看书。}}</td><td>place phrase before the verb</td></tr>
<tr><td>{{我去学校昨天。}}</td><td>{{我昨天去学校。}}</td><td>time before the verb</td></tr>
<tr><td>{{她去商店跟我一起。}}</td><td>{{她跟我一起去商店。}}</td><td>companion phrase before the verb</td></tr>
<tr><td>{{他们都也去。}}</td><td>{{他们也都去。}}</td><td>{{也}} comes before {{都}}</td></tr>
<tr><td>{{我不昨天去。}}</td><td>{{我昨天没去。}}</td><td>negation directly before the verb; {{没}} for past</td></tr>
</tbody></table>
<h4>Adverbs</h4>
<p>One-syllable adverbs ({{也}}, {{都}}, {{就}}, {{才}}, {{还}}, {{又}}, {{再}}) go after the subject and <strong>before the verb</strong>; the adverb comes <em>before</em> the negation: {{他还没来}}, {{我也不去}}. Time words may sit before or after the subject: {{我昨天去了}} or {{昨天我去了}}, but not after the verb.</p>
<h4>Questions</h4>
<p>Question words stay where the answer would be: {{你什么时候去？}} / {{你在哪儿工作？}} / {{他怎么回家？}}. Do not move them to the front as in English.</p>
<div class="callout"><p lang="zh">我们星期天上午在公园一起打球，下午都回家休息。</p><p>Wǒmen xīngqītiān shàngwǔ zài gōngyuán yìqǐ dǎqiú, xiàwǔ dōu huí jiā xiūxi.</p><p>On Sunday morning we play ball together in the park; in the afternoon we all go home to rest.</p></div>
<p>Check the first clause: subject {{我们}} → time {{星期天上午}} → place {{在公园}} → adverb {{一起}} → verb {{打球}}.</p>`,
        bVI: `<p>Trong tiếng Trung, thông tin chỉ <em>khi nào</em>, <em>ở đâu</em>, <em>thế nào</em> đứng <strong>trước</strong> động từ. Tiếng Việt thường đặt nhiều thông tin sau động từ, nên đây là nguồn lỗi phổ biến nhất.</p>
<div class="formula"><span class="lbl">Trật tự cơ bản</span>Chủ ngữ + Thời gian + Nơi chốn + Trạng ngữ/Năng nguyện + Động từ + Tân ngữ</div>
<table><thead><tr><th>Sai</th><th>Đúng</th><th>Lý do</th></tr></thead><tbody>
<tr><td>{{我看书在图书馆。}}</td><td>{{我在图书馆看书。}}</td><td>cụm nơi chốn trước động từ</td></tr>
<tr><td>{{我去学校昨天。}}</td><td>{{我昨天去学校。}}</td><td>thời gian trước động từ</td></tr>
<tr><td>{{她去商店跟我一起。}}</td><td>{{她跟我一起去商店。}}</td><td>cụm đi cùng trước động từ</td></tr>
<tr><td>{{他们都也去。}}</td><td>{{他们也都去。}}</td><td>{{也}} đứng trước {{都}}</td></tr>
<tr><td>{{我不昨天去。}}</td><td>{{我昨天没去。}}</td><td>phủ định ngay trước động từ; quá khứ dùng {{没}}</td></tr>
</tbody></table>
<h4>Phó từ</h4>
<p>Phó từ một âm tiết ({{也}}, {{都}}, {{就}}, {{才}}, {{还}}, {{又}}, {{再}}) đứng sau chủ ngữ và <strong>trước động từ</strong>; phó từ đứng <em>trước</em> phủ định: {{他还没来}}, {{我也不去}}. Từ chỉ thời gian có thể trước hoặc sau chủ ngữ: {{我昨天去了}} hoặc {{昨天我去了}}, nhưng không đặt sau động từ.</p>
<h4>Câu hỏi</h4>
<p>Từ để hỏi giữ nguyên vị trí của câu trả lời: {{你什么时候去？}} / {{你在哪儿工作？}} / {{他怎么回家？}}. Đừng dời lên đầu câu như trong tiếng Anh.</p>
<div class="callout"><p lang="zh">我们星期天上午在公园一起打球，下午都回家休息。</p><p>Wǒmen xīngqītiān shàngwǔ zài gōngyuán yìqǐ dǎqiú, xiàwǔ dōu huí jiā xiūxi.</p><p>Sáng Chủ nhật chúng tôi cùng chơi bóng ở công viên; chiều thì tất cả về nhà nghỉ.</p></div>
<p>Kiểm vế đầu: chủ ngữ {{我们}} → thời gian {{星期天上午}} → nơi chốn {{在公园}} → trạng ngữ {{一起}} → động từ {{打球}}.</p>`,
        tab: [['图书馆', 'túshūguǎn', 'library', 'thư viện'], ['一起', 'yìqǐ', 'together', 'cùng nhau'], ['商店', 'shāngdiàn', 'shop', 'cửa hàng'], ['打球', 'dǎqiú', 'play ball', 'chơi bóng'], ['休息', 'xiūxi', 'rest', 'nghỉ ngơi'], ['什么时候', 'shénme shíhou', 'when', 'khi nào'], ['怎么', 'zěnme', 'how', 'thế nào']],
        mEN: 'Copying the English order: {{我学习汉语在大学}} (“I study Chinese at university”). The place phrase must go before the verb: {{我在大学学习汉语}}. Also, never put {{很}} after the adjective: {{漂亮很}} is wrong.',
        mVI: 'Chép trật tự tiếng Việt: {{我学习汉语在大学}} (“tôi học tiếng Hán ở đại học”). Cụm nơi chốn phải đứng trước động từ: {{我在大学学习汉语}}. Cũng đừng đặt {{很}} sau tính từ: {{漂亮很}} là sai.',
        sEN: ['Time, place, manner go before the verb', '{{也}} before {{都}}; negation right before the verb', 'Question words stay in place'],
        sVI: ['Thời gian, nơi chốn, cách thức đứng trước động từ', '{{也}} trước {{都}}; phủ định ngay trước động từ', 'Từ để hỏi giữ nguyên vị trí'],
        lk: [U.gram3, U.caijiu, U.mdbg],
        p: [
          ['Fix: {{我吃饭在食堂中午。}}', '{{我中午在食堂吃饭。}}', 'Sửa: {{我吃饭在食堂中午。}}', '{{我中午在食堂吃饭。}}'],
          ['Fix: {{他们都也是学生。}}', '{{他们也都是学生。}}', 'Sửa: {{他们都也是学生。}}', '{{他们也都是学生。}}'],
          ['Write: “She did not go to class yesterday.”', '{{她昨天没去上课。}}', 'Viết: “Hôm qua cô ấy không đi học.”', '{{她昨天没去上课。}}'],
        ],
      }),
    L('crw201-ts-4-2', '4.2 Writing 了, 过 and 着 correctly|||4.2 Viết đúng 了, 过 và 着',
      'Phân biệt 了 hoàn thành và 了 cuối câu, 过 kinh nghiệm, 着 trạng thái; phủ định với 没.',
      {
        gEN: ['Choose 了, 过 or 着 by meaning', 'Negate with 没(有) and drop 了', 'Avoid sentences with an “unfinished” 了'],
        gVI: ['Chọn 了, 过 hay 着 theo nghĩa', 'Phủ định bằng 没(有) và bỏ 了', 'Tránh câu 了 “chưa trọn nghĩa”'],
        bEN: `<p>Aspect particles are among the hardest points for writers. Use a simple decision tree.</p>
<ul><li><strong>Completed action → verb + {{了}}</strong>: {{我买了一本书。}} Usually the verb needs a number/measure, a result, or a following action: {{我吃了饭就去学校。}} A bare {{我买了书。}} sounds unfinished.</li>
<li><strong>New situation → sentence-final {{了}}</strong>: {{天黑了。}} “It has got dark.” {{他是大学生了。}}</li>
<li><strong>Ever / never → {{过}}</strong>: {{我去过北京。}} {{他没吃过这个菜。}}</li>
<li><strong>State continuing → {{着}}</strong>: {{门开着。}} {{墙上挂着一张画。}} {{他戴着帽子。}}</li>
<li><strong>Action in progress → {{在}} before the verb</strong>: {{他在看书。}}</li></ul>
<h4>Negation</h4>
<p>Past negation uses {{没(有)}} and <strong>removes</strong> {{了}}: {{我买了书}} → {{我没买书}} (not {{我没买了书}}). With {{过}} keep {{过}}: {{我没去过北京}}. A {{着}} state is simply negated with {{没}} before the verb: {{门没开}} “the door is not open”.</p>
<h4>Questions</h4>
<p>{{你吃了吗？}} / {{你吃饭了没有？}} / {{你去过上海吗？}} Answer with the verb: {{吃了}} / {{没吃}}.</p>
<div class="callout"><p lang="zh">我去过上海，去年夏天去的。那天天气很热，我穿着短裤走了很长时间。回家以后，我洗了澡就睡觉了。</p><p>Wǒ qù guo Shànghǎi, qùnián xiàtiān qù de. Nà tiān tiānqì hěn rè, wǒ chuān zhe duǎnkù zǒu le hěn cháng shíjiān. Huí jiā yǐhòu, wǒ xǐ le zǎo jiù shuìjiào le.</p><p>I have been to Shanghai; I went last summer. It was very hot that day and I walked for a long time wearing shorts. After getting home, I took a bath and went to sleep.</p></div>
<p>Count the particles: {{去过}} (experience), {{穿着}} (state), {{走了很长时间}} (completed, with duration), {{洗了澡就睡觉了}} (two actions, last one with sentence-final {{了}}).</p>`,
        bVI: `<p>Trợ từ thể là điểm khó nhất với người viết. Dùng một cây quyết định đơn giản.</p>
<ul><li><strong>Hành động hoàn thành → động từ + {{了}}</strong>: {{我买了一本书。}} Thường động từ cần số lượng, kết quả hoặc hành động nối tiếp: {{我吃了饭就去学校。}} Chỉ viết {{我买了书。}} nghe chưa trọn câu.</li>
<li><strong>Tình huống mới → {{了}} cuối câu</strong>: {{天黑了。}} “Trời tối rồi.” {{他是大学生了。}}</li>
<li><strong>Đã từng / chưa từng → {{过}}</strong>: {{我去过北京。}} {{他没吃过这个菜。}}</li>
<li><strong>Trạng thái duy trì → {{着}}</strong>: {{门开着。}} {{墙上挂着一张画。}} {{他戴着帽子。}}</li>
<li><strong>Hành động đang diễn ra → {{在}} trước động từ</strong>: {{他在看书。}}</li></ul>
<h4>Phủ định</h4>
<p>Phủ định quá khứ dùng {{没(有)}} và <strong>bỏ</strong> {{了}}: {{我买了书}} → {{我没买书}} (không phải {{我没买了书}}). Với {{过}} giữ nguyên {{过}}: {{我没去过北京}}. Trạng thái {{着}} chỉ cần phủ định bằng {{没}} trước động từ: {{门没开}} “cửa không mở”.</p>
<h4>Câu hỏi</h4>
<p>{{你吃了吗？}} / {{你吃饭了没有？}} / {{你去过上海吗？}} Trả lời bằng động từ: {{吃了}} / {{没吃}}.</p>
<div class="callout"><p lang="zh">我去过上海，去年夏天去的。那天天气很热，我穿着短裤走了很长时间。回家以后，我洗了澡就睡觉了。</p><p>Wǒ qù guo Shànghǎi, qùnián xiàtiān qù de. Nà tiān tiānqì hěn rè, wǒ chuān zhe duǎnkù zǒu le hěn cháng shíjiān. Huí jiā yǐhòu, wǒ xǐ le zǎo jiù shuìjiào le.</p><p>Tôi đã từng đến Thượng Hải, đi vào mùa hè năm ngoái. Hôm đó trời rất nóng, tôi mặc quần short đi bộ rất lâu. Về nhà xong, tôi tắm rồi đi ngủ.</p></div>
<p>Đếm các trợ từ: {{去过}} (kinh nghiệm), {{穿着}} (trạng thái), {{走了很长时间}} (hoàn thành, có thời lượng), {{洗了澡就睡觉了}} (hai hành động, câu cuối có {{了}}).</p>`,
        tab: [['过', 'guo', 'experience marker', 'trợ từ kinh nghiệm'], ['着', 'zhe', 'continuing state', 'trợ từ trạng thái'], ['夏天', 'xiàtiān', 'summer', 'mùa hè'], ['短裤', 'duǎnkù', 'shorts', 'quần short'], ['洗澡', 'xǐzǎo', 'take a bath', 'tắm'], ['睡觉', 'shuìjiào', 'sleep', 'ngủ'], ['挂', 'guà', 'hang', 'treo']],
        mEN: 'Writing {{我昨天没去了学校}}: {{没}} and {{了}} cannot appear together to mark one past action. Also the Vietnamese “đã” is not always {{了}}: {{我去年去过北京}} sounds fine with {{过}} but {{我去年去了北京过}} is wrong.',
        mVI: 'Viết {{我昨天没去了学校}}: {{没}} và {{了}} không đi cùng nhau để chỉ một hành động quá khứ. Và “đã” trong tiếng Việt không phải lúc nào cũng là {{了}}: {{我去年去过北京}} đúng, nhưng {{我去年去了北京过}} sai.',
        sEN: ['{{了}} = completion or change, {{过}} = experience, {{着}} = state', 'Negate the past with {{没}} and drop {{了}}', 'A bare verb + object + {{了}} often needs more information'],
        sVI: ['{{了}} = hoàn thành hoặc thay đổi, {{过}} = kinh nghiệm, {{着}} = trạng thái', 'Phủ định quá khứ bằng {{没}} và bỏ {{了}}', 'Động từ + tân ngữ + {{了}} trơn thường cần thêm thông tin'],
        lk: [U.le, U.gram3, U.caijiu],
        p: [
          ['Fix: {{我没去了北京。}}', '{{我没去北京。}} (or {{我没去过北京。}} for “never”).', 'Sửa: {{我没去了北京。}}', '{{我没去北京。}} (hoặc {{我没去过北京。}} nghĩa là “chưa từng”).'],
          ['Choose 了, 过 or 着: {{墙上挂______一张地图。}}', '{{着}}: {{墙上挂着一张地图。}}', 'Chọn 了, 过 hay 着: {{墙上挂______一张地图。}}', '{{着}}: {{墙上挂着一张地图。}}'],
          ['Write: “Have you ever eaten Peking duck?”', '{{你吃过北京烤鸭吗？}}', 'Viết: “Bạn đã từng ăn vịt quay Bắc Kinh chưa?”', '{{你吃过北京烤鸭吗？}}'],
        ],
      }),
    L('crw201-ts-4-3', '4.3 Complements in writing|||4.3 Bổ ngữ khi viết',
      'Bổ ngữ mức độ, kết quả, xu hướng, thời lượng và số lần, khả năng; viết khi có tân ngữ.',
      {
        gEN: ['Write degree, result, direction, duration and potential complements', 'Repeat the verb when there is an object', 'Avoid {{很}} after an adjective in a complement'],
        gVI: ['Viết bổ ngữ mức độ, kết quả, xu hướng, thời lượng và khả năng', 'Lặp động từ khi có tân ngữ', 'Tránh {{很}} đặt sau tính từ trong bổ ngữ'],
        bEN: `<p>A complement follows the verb and tells how well, with what result, in what direction, or for how long. Complements are the heart of HSK 3 writing.</p>
<table><thead><tr><th>Type</th><th>Pattern</th><th>Example</th></tr></thead><tbody>
<tr><td>Degree</td><td>V + {{得}} + (very) adj</td><td>{{她跑得很快。}}</td></tr>
<tr><td>Result</td><td>V + result</td><td>{{我写完了作业。}} {{我听懂了。}}</td></tr>
<tr><td>Direction</td><td>V + {{来/去/上/下/回/出}}</td><td>{{他回来了。}} {{请进来。}}</td></tr>
<tr><td>Duration</td><td>V + {{了}} + time</td><td>{{我学了三年汉语。}}</td></tr>
<tr><td>Number of times</td><td>V + {{了/过}} + number + {{次}}</td><td>{{我去过两次中国。}}</td></tr>
<tr><td>Potential</td><td>V + {{得/不}} + complement</td><td>{{我看得懂。}} {{我听不懂。}}</td></tr>
</tbody></table>
<h4>Verb with an object</h4>
<p>If the verb has an object and a degree complement, repeat the verb: {{她说汉语说得很好。}} (or put the object first: {{她汉语说得很好。}}). Do not write {{她说得很好汉语}}. For duration, either {{我学了三年汉语}} or {{我学汉语学了三年}}.</p>
<h4>Common patterns for exams</h4>
<ul><li>{{看见 / 听见 / 找到 / 买到 / 做完 / 写好 / 听懂}}.</li><li>{{说得清楚 / 写得好 / 睡得早}}; negative {{说得不清楚}}.</li></ul>
<div class="callout"><p lang="zh">昨天我写了两个小时汉字，写得很累，但是终于写完了。老师看了我的作业，说我写得越来越好了。</p><p>Zuótiān wǒ xiě le liǎng gè xiǎoshí Hànzì, xiě de hěn lèi, dànshì zhōngyú xiě wán le. Lǎoshī kàn le wǒ de zuòyè, shuō wǒ xiě de yuè lái yuè hǎo le.</p><p>Yesterday I wrote characters for two hours; it was tiring, but I finally finished. The teacher looked at my homework and said my writing is getting better and better.</p></div>`,
        bVI: `<p>Bổ ngữ đứng sau động từ, cho biết giỏi đến đâu, kết quả gì, hướng nào, hay bao lâu. Bổ ngữ là cốt lõi của bài viết HSK 3.</p>
<table><thead><tr><th>Loại</th><th>Mẫu</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Mức độ</td><td>V + {{得}} + (rất) tính từ</td><td>{{她跑得很快。}}</td></tr>
<tr><td>Kết quả</td><td>V + kết quả</td><td>{{我写完了作业。}} {{我听懂了。}}</td></tr>
<tr><td>Xu hướng</td><td>V + {{来/去/上/下/回/出}}</td><td>{{他回来了。}} {{请进来。}}</td></tr>
<tr><td>Thời lượng</td><td>V + {{了}} + thời gian</td><td>{{我学了三年汉语。}}</td></tr>
<tr><td>Số lần</td><td>V + {{了/过}} + số + {{次}}</td><td>{{我去过两次中国。}}</td></tr>
<tr><td>Khả năng</td><td>V + {{得/不}} + bổ ngữ</td><td>{{我看得懂。}} {{我听不懂。}}</td></tr>
</tbody></table>
<h4>Động từ có tân ngữ</h4>
<p>Nếu động từ có tân ngữ và bổ ngữ mức độ thì lặp động từ: {{她说汉语说得很好。}} (hoặc đặt tân ngữ lên trước: {{她汉语说得很好。}}). Đừng viết {{她说得很好汉语}}. Với thời lượng, có thể {{我学了三年汉语}} hoặc {{我学汉语学了三年}}.</p>
<h4>Cụm hay gặp trong thi</h4>
<ul><li>{{看见 / 听见 / 找到 / 买到 / 做完 / 写好 / 听懂}}.</li><li>{{说得清楚 / 写得好 / 睡得早}}; phủ định {{说得不清楚}}.</li></ul>
<div class="callout"><p lang="zh">昨天我写了两个小时汉字，写得很累，但是终于写完了。老师看了我的作业，说我写得越来越好了。</p><p>Zuótiān wǒ xiě le liǎng gè xiǎoshí Hànzì, xiě de hěn lèi, dànshì zhōngyú xiě wán le. Lǎoshī kàn le wǒ de zuòyè, shuō wǒ xiě de yuè lái yuè hǎo le.</p><p>Hôm qua tôi viết chữ Hán hai tiếng, viết rất mệt nhưng cuối cùng cũng xong. Thầy xem bài tập của tôi và nói chữ tôi viết ngày càng tốt hơn.</p></div>`,
        tab: [['终于', 'zhōngyú', 'finally, at last', 'cuối cùng cũng'], ['清楚', 'qīngchu', 'clear', 'rõ ràng'], ['次', 'cì', 'time (occurrence)', 'lần'], ['小时', 'xiǎoshí', 'hour', 'giờ (đồng hồ)'], ['写完', 'xiěwán', 'finish writing', 'viết xong'], ['听懂', 'tīngdǒng', 'understand (by hearing)', 'nghe hiểu'], ['越来越', 'yuè lái yuè', 'more and more', 'càng ngày càng']],
        mEN: 'Writing {{他跑很快}} (no {{得}}) or {{他跑得快很}} ({{很}} must come before the adjective). Also {{我学汉语三年}}: duration has to come after the verb as a complement, so write {{我学了三年汉语}}.',
        mVI: 'Viết {{他跑很快}} (thiếu {{得}}) hoặc {{他跑得快很}} ({{很}} phải đứng trước tính từ). Cũng như {{我学汉语三年}}: thời lượng phải đứng sau động từ làm bổ ngữ, nên viết {{我学了三年汉语}}.',
        sEN: ['Complement after the verb: degree, result, direction, duration, potential', 'Object + degree complement ⇒ repeat the verb', '{{很}} before the adjective in {{得}} complements'],
        sVI: ['Bổ ngữ đứng sau động từ: mức độ, kết quả, xu hướng, thời lượng, khả năng', 'Tân ngữ + bổ ngữ mức độ ⇒ lặp động từ', '{{很}} đứng trước tính từ trong bổ ngữ {{得}}'],
        lk: [U.gram3, U.yuelai, U.hsk3],
        p: [
          ['Fix: {{她唱歌得很好。}}', '{{她唱歌唱得很好。}}', 'Sửa: {{她唱歌得很好。}}', '{{她唱歌唱得很好。}}'],
          ['Write: “I have waited for him for an hour.”', '{{我等了他一个小时。}}', 'Viết: “Tôi đã đợi anh ấy một tiếng.”', '{{我等了他一个小时。}}'],
          ['Write: “I cannot understand this sentence.”', '{{我看不懂这个句子。}}', 'Viết: “Tôi không hiểu câu này (khi đọc).”', '{{我看不懂这个句子。}}'],
        ],
      }),
    L('crw201-ts-4-4', '4.4 把, 被 and comparison sentences|||4.4 Câu chữ 把, 被 và so sánh',
      'Mẫu 把/被 bắt buộc có kết quả; so sánh 比, 没有, 一样, và lỗi hay gặp.',
      {
        gEN: ['Write 把 sentences with a result', 'Write 被 sentences with the agent or without', 'Use 比 correctly without 很'],
        gVI: ['Viết câu 把 có kết quả', 'Viết câu 被 có hoặc không có tác nhân', 'Dùng 比 đúng, không thêm 很'],
        bEN: `<p>These three patterns are tested often at HSK 3 because they change the usual order.</p>
<div class="formula"><span class="lbl">把</span>Subject + {{把}} + known object + verb + complement/result</div>
<ul><li>{{请把门关上。}} {{我把作业做完了。}} {{他把苹果吃了。}} (a specific, known object)</li>
<li>The verb must be followed by something (a result, direction, {{了}}, a quantity). A bare verb is wrong: {{我把书看。}}</li>
<li>The object must be definite: {{我把一本书买了}} is wrong.</li></ul>
<div class="formula"><span class="lbl">被</span>Receiver + ({{被}} + agent) + verb + complement</div>
<ul><li>{{我的手机被小王借走了。}} {{钱包被偷了。}}</li>
<li>{{被}} is often used for something unfortunate or unexpected; use {{让/叫}} for the agent in speech.</li></ul>
<div class="formula"><span class="lbl">比 comparison</span>A + {{比}} + B + adjective (+ how much)</div>
<ul><li>{{他比我高。}} {{今天比昨天热多了。}} {{这本书比那本贵十块钱。}}</li>
<li>No {{很}}, {{非常}}: write {{他比我高}}, not {{他比我很高}}. Use {{更}} or {{还}} for “even more”: {{他比我更高}}.</li>
<li>Negative: {{他没有我高。}} Same: {{他和我一样高。}}</li></ul>
<div class="callout"><p lang="zh">我把手机放在桌子上，可是被弟弟拿走了。他比我小三岁，但是比我调皮多了。</p><p>Wǒ bǎ shǒujī fàng zài zhuōzi shang, kěshì bèi dìdi názǒu le. Tā bǐ wǒ xiǎo sān suì, dànshì bǐ wǒ tiáopí duō le.</p><p>I put my phone on the table, but my younger brother took it away. He is three years younger than I am, but much naughtier.</p></div>`,
        bVI: `<p>Ba mẫu này được thi nhiều ở HSK 3 vì chúng đổi trật tự thông thường.</p>
<div class="formula"><span class="lbl">把</span>Chủ ngữ + {{把}} + tân ngữ xác định + động từ + bổ ngữ/kết quả</div>
<ul><li>{{请把门关上。}} {{我把作业做完了。}} {{他把苹果吃了。}} (tân ngữ cụ thể, đã biết)</li>
<li>Sau động từ phải có thành phần khác (kết quả, hướng, {{了}}, số lượng). Động từ trơn là sai: {{我把书看。}}</li>
<li>Tân ngữ phải xác định: {{我把一本书买了}} là sai.</li></ul>
<div class="formula"><span class="lbl">被</span>Đối tượng bị tác động + ({{被}} + tác nhân) + động từ + bổ ngữ</div>
<ul><li>{{我的手机被小王借走了。}} {{钱包被偷了。}}</li>
<li>{{被}} thường dùng với điều không may hoặc bất ngờ; khẩu ngữ dùng {{让/叫}} cho tác nhân.</li></ul>
<div class="formula"><span class="lbl">So sánh 比</span>A + {{比}} + B + tính từ (+ hơn bao nhiêu)</div>
<ul><li>{{他比我高。}} {{今天比昨天热多了。}} {{这本书比那本贵十块钱。}}</li>
<li>Không có {{很}}, {{非常}}: viết {{他比我高}}, không viết {{他比我很高}}. Dùng {{更}} hoặc {{还}} cho “còn hơn”: {{他比我更高}}.</li>
<li>Phủ định: {{他没有我高。}} Bằng nhau: {{他和我一样高。}}</li></ul>
<div class="callout"><p lang="zh">我把手机放在桌子上，可是被弟弟拿走了。他比我小三岁，但是比我调皮多了。</p><p>Wǒ bǎ shǒujī fàng zài zhuōzi shang, kěshì bèi dìdi názǒu le. Tā bǐ wǒ xiǎo sān suì, dànshì bǐ wǒ tiáopí duō le.</p><p>Tôi đặt điện thoại trên bàn, nhưng bị em trai cầm đi mất. Nó nhỏ hơn tôi ba tuổi nhưng nghịch hơn tôi nhiều.</p></div>`,
        tab: [['把', 'bǎ', 'marks the object before the verb', 'đưa tân ngữ lên trước động từ'], ['被', 'bèi', 'passive marker', 'dấu bị động'], ['比', 'bǐ', 'compared to', 'so với'], ['一样', 'yíyàng', 'the same', 'giống nhau'], ['偷', 'tōu', 'steal', 'trộm'], ['调皮', 'tiáopí', 'naughty', 'nghịch ngợm'], ['借', 'jiè', 'borrow, lend', 'mượn, cho mượn']],
        mEN: 'Writing {{我把书看}}, {{他比我很高}} or {{这件衣服被我买了}}. The first lacks a result; the second has a degree adverb after {{比}}; the third uses {{被}} for an ordinary, welcome action, which sounds unnatural. Say {{这件衣服我买了}} or {{我买了这件衣服}}.',
        mVI: 'Viết {{我把书看}}, {{他比我很高}} hoặc {{这件衣服被我买了}}. Câu một thiếu kết quả; câu hai có phó từ mức độ sau {{比}}; câu ba dùng {{被}} cho hành động bình thường, nghe không tự nhiên. Nên nói {{这件衣服我买了}} hoặc {{我买了这件衣服}}.',
        sEN: ['{{把}} + definite object + verb + result', '{{被}} marks the receiver; agent optional', '{{比}} never takes {{很}}'],
        sVI: ['{{把}} + tân ngữ xác định + động từ + kết quả', '{{被}} đánh dấu đối tượng bị tác động; tác nhân có thể bỏ', '{{比}} không đi với {{很}}'],
        lk: [U.ba, U.bei, U.gram3],
        p: [
          ['Fix: {{他比我很大。}}', '{{他比我大。}} (or {{他比我大很多。}})', 'Sửa: {{他比我很大。}}', '{{他比我大。}} (hoặc {{他比我大很多。}})'],
          ['Rewrite with 把: {{我写完作业了。}}', '{{我把作业写完了。}}', 'Viết lại với 把: {{我写完作业了。}}', '{{我把作业写完了。}}'],
          ['Write with 被: “My bike was stolen.”', '{{我的自行车被偷了。}}', 'Viết với 被: “Xe đạp của tôi bị trộm.”', '{{我的自行车被偷了。}}'],
        ],
      }),
    QZ(4, 'Quiz 4 — Writing correct sentences|||Quiz 4 — Viết câu đúng', 'Sửa lỗi trật tự từ, 了/过/着, bổ ngữ, 把/被/比.', [
      Q('q1', 'Which is correct?', 'Câu nào đúng?', ['{{我在图书馆看书。}}', '{{我看书在图书馆。}}', '{{在图书馆我看书在。}}', '{{我看在书图书馆。}}'], 0, 'Place phrase before the verb.', 'Cụm nơi chốn trước động từ.'),
      Q('q2', 'Which is correct?', 'Câu nào đúng?', ['{{他们也都去。}}', '{{他们都也去。}}', '{{他们去也都。}}', '{{也他们都去。}}'], 0, '{{也}} before {{都}}.', '{{也}} trước {{都}}.'),
      Q('q3', 'Negate: {{我买了书。}}', 'Phủ định: {{我买了书。}}', ['{{我没买书。}}', '{{我没买了书。}}', '{{我不买了书。}}', '{{我买了没书。}}'], 0, '{{没}} and drop {{了}}.', '{{没}} và bỏ {{了}}.'),
      Q('q4', 'Which shows experience?', 'Câu nào chỉ kinh nghiệm?', ['{{我去过上海。}}', '{{我去着上海。}}', '{{我去了上海过。}}', '{{我在上海去。}}'], 0, '{{过}} marks experience.', '{{过}} chỉ kinh nghiệm.'),
      Q('q5', 'Which is correct?', 'Câu nào đúng?', ['{{他说汉语说得很好。}}', '{{他说得很好汉语。}}', '{{他说汉语得很好。}}', '{{他很好说汉语得。}}'], 0, 'Repeat the verb.', 'Lặp động từ.'),
      Q('q6', 'Which is correct?', 'Câu nào đúng?', ['{{他比我高。}}', '{{他比我很高。}}', '{{他比我高很。}}', '{{他很比我高。}}'], 0, 'No {{很}} after {{比}}.', 'Không dùng {{很}} sau {{比}}.'),
      Q('q7', 'A {{把}} sentence needs…', 'Câu chữ {{把}} cần…', ['a result after the verb|||kết quả sau động từ', 'a question word|||từ để hỏi', 'no object|||không tân ngữ', 'a number first|||số ở đầu'], 0, 'e.g. {{把门关上}}.', 'ví dụ {{把门关上}}.'),
      Q('q8', 'Duration complement: “I studied for three years.”', 'Bổ ngữ thời lượng: “Tôi học ba năm.”', ['{{我学了三年。}}', '{{我三年了学。}}', '{{我学着三年。}}', '{{我在三年学了。}}'], 0, 'V + {{了}} + time.', 'V + {{了}} + thời gian.'),
    ]),
  ],
};

// ───────────────────────────── Chương 5 ─────────────────────────────
const c5 = {
  title: 'Chapter 5 — From sentences to paragraphs|||Chương 5 — Từ câu đến đoạn văn',
  description: 'Dấu câu tiếng Trung, liên từ khi viết, cấu trúc đoạn văn, và liên kết câu bằng đại từ và lược chủ ngữ.',
  lessons: [
    L('crw201-ts-5-1', '5.1 Chinese punctuation|||5.1 Dấu câu tiếng Trung',
      'Các dấu 。，、；：？！“” 《》 …… —— và quy tắc viết tay; khác biệt với tiếng Anh/Việt.',
      {
        gEN: ['Name and use the main Chinese punctuation marks', 'Distinguish the comma ， from the enumeration comma 、', 'Place punctuation correctly in handwriting and in quotations'],
        gVI: ['Gọi tên và dùng các dấu câu chính', 'Phân biệt dấu phẩy ， và dấu ngắt 、', 'Đặt dấu đúng chỗ khi viết tay và khi trích dẫn'],
        bEN: `<p>Chinese uses its own full-width punctuation. A mark takes up one cell, just like a character. Wrong marks (such as the English <code>.</code> or <code>,</code>) are a typical sign of a beginner.</p>
<table><thead><tr><th>Mark</th><th>Name</th><th>Use</th></tr></thead><tbody>
<tr><td>{{。}}</td><td>{{句号}}</td><td>end of a statement (a hollow circle)</td></tr>
<tr><td>{{，}}</td><td>{{逗号}}</td><td>pause between clauses</td></tr>
<tr><td>{{、}}</td><td>{{顿号}}</td><td>separates items in a list: {{苹果、香蕉、西瓜}}</td></tr>
<tr><td>{{；}}</td><td>{{分号}}</td><td>joins parallel clauses</td></tr>
<tr><td>{{：}}</td><td>{{冒号}}</td><td>introduces an explanation or a quotation</td></tr>
<tr><td>{{？ ！}}</td><td>{{问号 感叹号}}</td><td>question; exclamation</td></tr>
<tr><td>{{“ ”}}</td><td>{{引号}}</td><td>speech, titles of short items</td></tr>
<tr><td>{{《 》}}</td><td>{{书名号}}</td><td>titles of books, films, songs</td></tr>
<tr><td>{{……}}</td><td>{{省略号}}</td><td>ellipsis — six dots, two cells</td></tr>
</tbody></table>
<h4>Key habits</h4>
<ul><li><strong>A Chinese “sentence” can be long.</strong> One sentence often contains several clauses separated by {{，}} and ends with one {{。}}. Do not put a full stop after every clause like in English.</li>
<li><strong>Lists use {{、}}, not {{，}}:</strong> {{我喜欢苹果、香蕉和西瓜。}}</li>
<li><strong>Quotations:</strong> {{他说：“我明天去。”}} — a colon before the quote, the final mark inside the closing quotation mark.</li>
<li><strong>Titles:</strong> {{我看了电影《你好，李焕英》。}}</li>
<li><strong>Handwriting:</strong> {{。}} {{，}} {{、}} sit at the lower left of their cell, and no mark begins a line (carry it to the end of the previous line).</li>
<li><strong>Dates and numbers:</strong> {{2026年11月9日}}; no spaces between characters.</li></ul>
<div class="callout"><p lang="zh">妈妈在超市买了苹果、香蕉、鸡蛋和面包。她说：“明天早上我们吃面包，好吗？”</p><p>Māma zài chāoshì mǎi le píngguǒ, xiāngjiāo, jīdàn hé miànbāo. Tā shuō: “Míngtiān zǎoshang wǒmen chī miànbāo, hǎo ma?”</p><p>Mum bought apples, bananas, eggs and bread at the supermarket. She said, “Shall we have bread tomorrow morning?”</p></div>`,
        bVI: `<p>Tiếng Trung dùng dấu câu toàn chiều rộng riêng. Một dấu chiếm một ô như một chữ. Dùng dấu tiếng Anh <code>.</code> hay <code>,</code> là dấu hiệu của người mới học.</p>
<table><thead><tr><th>Dấu</th><th>Tên</th><th>Cách dùng</th></tr></thead><tbody>
<tr><td>{{。}}</td><td>{{句号}}</td><td>kết thúc câu kể (vòng tròn rỗng)</td></tr>
<tr><td>{{，}}</td><td>{{逗号}}</td><td>ngắt giữa các mệnh đề</td></tr>
<tr><td>{{、}}</td><td>{{顿号}}</td><td>ngăn các mục trong liệt kê: {{苹果、香蕉、西瓜}}</td></tr>
<tr><td>{{；}}</td><td>{{分号}}</td><td>nối các mệnh đề song song</td></tr>
<tr><td>{{：}}</td><td>{{冒号}}</td><td>mở đầu lời giải thích hoặc lời trích dẫn</td></tr>
<tr><td>{{？ ！}}</td><td>{{问号 感叹号}}</td><td>hỏi; cảm thán</td></tr>
<tr><td>{{“ ”}}</td><td>{{引号}}</td><td>lời nói, tên tác phẩm ngắn</td></tr>
<tr><td>{{《 》}}</td><td>{{书名号}}</td><td>tên sách, phim, bài hát</td></tr>
<tr><td>{{……}}</td><td>{{省略号}}</td><td>dấu lược — sáu chấm, hai ô</td></tr>
</tbody></table>
<h4>Thói quen cần nhớ</h4>
<ul><li><strong>“Câu” tiếng Trung có thể dài.</strong> Một câu thường có nhiều mệnh đề ngăn bởi {{，}} và kết thúc bằng một {{。}}. Đừng đặt dấu chấm sau mỗi mệnh đề như tiếng Anh.</li>
<li><strong>Liệt kê dùng {{、}}, không dùng {{，}}:</strong> {{我喜欢苹果、香蕉和西瓜。}}</li>
<li><strong>Trích dẫn:</strong> {{他说：“我明天去。”}} — dấu hai chấm trước lời trích, dấu kết thúc nằm trong ngoặc kép đóng.</li>
<li><strong>Tên tác phẩm:</strong> {{我看了电影《你好，李焕英》。}}</li>
<li><strong>Viết tay:</strong> {{。}} {{，}} {{、}} nằm góc dưới bên trái ô, và không dấu nào đứng đầu dòng (đưa lên cuối dòng trước).</li>
<li><strong>Ngày tháng, số:</strong> {{2026年11月9日}}; không có khoảng trắng giữa các chữ.</li></ul>
<div class="callout"><p lang="zh">妈妈在超市买了苹果、香蕉、鸡蛋和面包。她说：“明天早上我们吃面包，好吗？”</p><p>Māma zài chāoshì mǎi le píngguǒ, xiāngjiāo, jīdàn hé miànbāo. Tā shuō: “Míngtiān zǎoshang wǒmen chī miànbāo, hǎo ma?”</p><p>Mẹ mua táo, chuối, trứng và bánh mì ở siêu thị. Mẹ nói: “Sáng mai mình ăn bánh mì nhé?”</p></div>`,
        tab: [['句号', 'jùhào', 'full stop', 'dấu chấm'], ['逗号', 'dòuhào', 'comma', 'dấu phẩy'], ['顿号', 'dùnhào', 'enumeration comma', 'dấu ngắt'], ['引号', 'yǐnhào', 'quotation marks', 'dấu ngoặc kép'], ['书名号', 'shūmínghào', 'title marks', 'dấu tên sách'], ['超市', 'chāoshì', 'supermarket', 'siêu thị'], ['面包', 'miànbāo', 'bread', 'bánh mì']],
        mEN: 'Using <code>,</code> or <code>.</code> typed on an English keyboard. When you type Chinese, switch the input method to Chinese punctuation mode. Also writing {{苹果，香蕉，鸡蛋}} instead of {{苹果、香蕉、鸡蛋}} for a list.',
        mVI: 'Dùng <code>,</code> hay <code>.</code> gõ từ bàn phím tiếng Anh. Khi gõ tiếng Trung, hãy chuyển bộ gõ sang chế độ dấu câu tiếng Trung. Và viết {{苹果，香蕉，鸡蛋}} thay vì {{苹果、香蕉、鸡蛋}} cho liệt kê.',
        sEN: ['Chinese marks are full-width and take a cell', '{{、}} for lists, {{，}} between clauses, one {{。}} at the end', '{{《》}} for titles; colon plus {{“”}} for speech'],
        sVI: ['Dấu tiếng Trung toàn chiều rộng và chiếm một ô', '{{、}} cho liệt kê, {{，}} giữa mệnh đề, một {{。}} ở cuối', '{{《》}} cho tên tác phẩm; hai chấm và {{“”}} cho lời nói'],
        lk: [U.punct, U.ime, U.hanzi],
        p: [
          ['Punctuate: 我买了书包 本子 笔和尺子', '{{我买了书包、本子、笔和尺子。}}', 'Chấm câu: 我买了书包 本子 笔和尺子', '{{我买了书包、本子、笔和尺子。}}'],
          ['Punctuate speech: 老师说 明天考试', '{{老师说：“明天考试。”}}', 'Chấm câu lời nói: 老师说 明天考试', '{{老师说：“明天考试。”}}'],
          ['Where does a mark never go in handwriting?', 'At the start of a line.', 'Dấu nào không bao giờ đứng ở đâu khi viết tay?', 'Ở đầu dòng.'],
        ],
      }),
    L('crw201-ts-5-2', '5.2 Connectors for writing|||5.2 Liên từ khi viết',
      'Các cặp liên từ HSK 3 dùng khi viết: 因为…所以, 虽然…但是, 如果…就, 不但…而且, 一边…一边, 先…再, 除了…以外.',
      {
        gEN: ['Write cause, contrast, condition, addition and sequence with the right pair', 'Add the second half (就, 也, 还)', 'Combine two simple sentences into one'],
        gVI: ['Viết quan hệ nhân quả, tương phản, điều kiện, tăng tiến, trình tự bằng cặp đúng', 'Thêm vế sau (就, 也, 还)', 'Gộp hai câu đơn thành một'],
        bEN: `<p>In 1.2 you used connectors to <em>read</em>. Now you <em>write</em> with them. They make your text read like Chinese and not like a list of short sentences.</p>
<table><thead><tr><th>Idea</th><th>Pattern</th><th>Example</th></tr></thead><tbody>
<tr><td>Cause</td><td>{{因为……，所以……}}</td><td>{{因为下雨，所以我没去公园。}}</td></tr>
<tr><td>Contrast</td><td>{{虽然……，但是……}}</td><td>{{虽然很累，但是很高兴。}}</td></tr>
<tr><td>Condition</td><td>{{如果……，就……}}</td><td>{{如果明天天气好，我们就去爬山。}}</td></tr>
<tr><td>Addition</td><td>{{不但……，而且……}}</td><td>{{他不但会说，而且会写。}}</td></tr>
<tr><td>At the same time</td><td>{{一边……，一边……}}</td><td>{{他一边听音乐，一边做作业。}}</td></tr>
<tr><td>Sequence</td><td>{{先……，再/然后……}}</td><td>{{我先洗手，再吃饭。}}</td></tr>
<tr><td>Exception / addition</td><td>{{除了……以外，都/还……}}</td><td>{{除了星期天以外，我天天上课。}}</td></tr>
</tbody></table>
<h4>Writing rules</h4>
<ul><li>Use <strong>both halves</strong> for {{虽然……但是……}}; leaving out {{但是}} sounds unfinished.</li>
<li>With {{因为}} you may drop {{所以}}, or the reverse, but you should not drop both unless the cause is obvious.</li>
<li>The second half often takes {{就}}, {{也}} or {{还}}: {{如果你有空，我们就一起去}}.</li>
<li>The subject is stated once, in the first clause, or after the connector: {{他不但会说，而且会写}} is shorter and better than {{不但他会说，而且他会写}}.</li></ul>
<div class="callout"><p lang="zh">我不但喜欢吃中国菜，而且喜欢做中国菜。虽然做得不太好，但是朋友们都说很好吃。如果你有时间，我们就一起做吧。</p><p>Wǒ bùdàn xǐhuan chī Zhōngguó cài, érqiě xǐhuan zuò Zhōngguó cài. Suīrán zuò de bú tài hǎo, dànshì péngyoumen dōu shuō hěn hǎochī. Rúguǒ nǐ yǒu shíjiān, wǒmen jiù yìqǐ zuò ba.</p><p>I not only like eating Chinese food, I also like cooking it. Although I do not cook very well, my friends all say it is delicious. If you have time, let us cook together.</p></div>`,
        bVI: `<p>Ở bài 1.2 bạn dùng liên từ để <em>đọc</em>. Giờ bạn <em>viết</em> với chúng. Chúng làm văn bản đọc như tiếng Trung chứ không phải một chuỗi câu ngắn.</p>
<table><thead><tr><th>Ý</th><th>Mẫu</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Nguyên nhân</td><td>{{因为……，所以……}}</td><td>{{因为下雨，所以我没去公园。}}</td></tr>
<tr><td>Tương phản</td><td>{{虽然……，但是……}}</td><td>{{虽然很累，但是很高兴。}}</td></tr>
<tr><td>Điều kiện</td><td>{{如果……，就……}}</td><td>{{如果明天天气好，我们就去爬山。}}</td></tr>
<tr><td>Tăng tiến</td><td>{{不但……，而且……}}</td><td>{{他不但会说，而且会写。}}</td></tr>
<tr><td>Đồng thời</td><td>{{一边……，一边……}}</td><td>{{他一边听音乐，一边做作业。}}</td></tr>
<tr><td>Trình tự</td><td>{{先……，再/然后……}}</td><td>{{我先洗手，再吃饭。}}</td></tr>
<tr><td>Ngoại lệ / bổ sung</td><td>{{除了……以外，都/还……}}</td><td>{{除了星期天以外，我天天上课。}}</td></tr>
</tbody></table>
<h4>Quy tắc khi viết</h4>
<ul><li>Dùng <strong>cả hai vế</strong> với {{虽然……但是……}}; bỏ {{但是}} nghe chưa trọn câu.</li>
<li>Với {{因为}} có thể bỏ {{所以}} hoặc ngược lại, nhưng không nên bỏ cả hai trừ khi nguyên nhân quá rõ.</li>
<li>Vế sau hay có {{就}}, {{也}} hoặc {{还}}: {{如果你有空，我们就一起去}}.</li>
<li>Chủ ngữ nêu một lần ở vế đầu hoặc sau liên từ: viết {{他不但会说，而且会写}} gọn hơn {{不但他会说，而且他会写}}.</li></ul>
<div class="callout"><p lang="zh">我不但喜欢吃中国菜，而且喜欢做中国菜。虽然做得不太好，但是朋友们都说很好吃。如果你有时间，我们就一起做吧。</p><p>Wǒ bùdàn xǐhuan chī Zhōngguó cài, érqiě xǐhuan zuò Zhōngguó cài. Suīrán zuò de bú tài hǎo, dànshì péngyoumen dōu shuō hěn hǎochī. Rúguǒ nǐ yǒu shíjiān, wǒmen jiù yìqǐ zuò ba.</p><p>Tôi không chỉ thích ăn món Trung Quốc mà còn thích nấu. Tuy nấu chưa giỏi nhưng các bạn đều nói rất ngon. Nếu bạn có thời gian, chúng ta cùng nấu nhé.</p></div>`,
        tab: [['如果', 'rúguǒ', 'if', 'nếu'], ['就', 'jiù', 'then; right away', 'thì; ngay'], ['爬山', 'páshān', 'climb a mountain', 'leo núi'], ['音乐', 'yīnyuè', 'music', 'âm nhạc'], ['除了', 'chúle', 'except; besides', 'ngoài ra, trừ'], ['中国菜', 'Zhōngguó cài', 'Chinese food', 'món ăn Trung Quốc'], ['时间', 'shíjiān', 'time', 'thời gian']],
        mEN: 'Writing {{因为下雨了，所以我不去，但是他去}} — too many clauses with mixed connectors. Keep one relation per sentence; link sentences with {{然后}} or {{后来}} instead.',
        mVI: 'Viết {{因为下雨了，所以我不去，但是他去}} — quá nhiều mệnh đề, lẫn nhiều liên từ. Mỗi câu chỉ một quan hệ; nối các câu bằng {{然后}} hoặc {{后来}}.',
        sEN: ['Learn seven pairs: cause, contrast, condition, addition, same time, sequence, exception', 'Use both halves for {{虽然…但是}}', 'One relation per sentence'],
        sVI: ['Học bảy cặp: nhân quả, tương phản, điều kiện, tăng tiến, đồng thời, trình tự, ngoại lệ', 'Dùng cả hai vế cho {{虽然…但是}}', 'Mỗi câu chỉ một quan hệ'],
        lk: [U.ruguo, U.budan, U.yibian, U.chule],
        p: [
          ['Combine: {{他很忙。他常常帮助我。}} with {{虽然……但是……}}', '{{虽然他很忙，但是他常常帮助我。}}', 'Gộp: {{他很忙。他常常帮助我。}} bằng {{虽然……但是……}}', '{{虽然他很忙，但是他常常帮助我。}}'],
          ['Write with {{一边……一边……}}: “She sings while cooking.”', '{{她一边做饭，一边唱歌。}}', 'Viết với {{一边……一边……}}: “Cô ấy vừa nấu ăn vừa hát.”', '{{她一边做饭，一边唱歌。}}'],
          ['Write with {{除了……以外}}: “Besides Chinese, I also study English.”', '{{除了汉语以外，我还学英语。}}', 'Viết với {{除了……以外}}: “Ngoài tiếng Hán, tôi còn học tiếng Anh.”', '{{除了汉语以外，我还学英语。}}'],
        ],
      }),
    L('crw201-ts-5-3', '5.3 Building a paragraph|||5.3 Dựng một đoạn văn',
      'Câu chủ đề – câu triển khai – câu kết, trình tự thời gian và dấu hiệu, định dạng đoạn.',
      {
        gEN: ['Use a topic sentence, support and closing', 'Order events with time words', 'Format a paragraph: indentation and length'],
        gVI: ['Dùng câu chủ đề, câu triển khai và câu kết', 'Sắp xếp sự việc bằng từ chỉ thời gian', 'Định dạng đoạn: thụt dòng và độ dài'],
        bEN: `<p>A good short paragraph has three parts:</p>
<ol><li><strong>Topic sentence</strong> — says what the paragraph is about: {{我的周末很有意思。}}</li>
<li><strong>Support</strong> (2–4 sentences) — details, examples, in a clear order.</li>
<li><strong>Closing</strong> — a feeling, a result or a plan: {{我希望下个周末也这样。}}</li></ol>
<h4>Ordering with time</h4>
<p>Use time words as a spine: {{早上}}, {{上午}}, {{中午}}, {{下午}}, {{晚上}}; or the sequence {{先……然后……最后……}}; or {{开始}}, {{后来}}, {{现在}}. Pick one system and stay with it.</p>
<h4>Format</h4>
<ul><li>Indent the first line by <strong>two cells</strong> ({{空两格}}) at the start of every paragraph.</li>
<li>Use {{。}} only at the end of the sentence; the whole paragraph is one block of text.</li>
<li>Length at this level: 5–8 sentences, 80–120 characters.</li></ul>
<div class="callout"><p lang="zh">我的周末很有意思。星期六上午，我先去图书馆看书，然后和朋友一起吃午饭。下午我们去公园打球，打得很高兴。晚上我回家做作业，十点就睡觉了。我希望每个周末都这样。</p>
<p>Wǒ de zhōumò hěn yǒu yìsi. Xīngqīliù shàngwǔ, wǒ xiān qù túshūguǎn kànshū, ránhòu hé péngyou yìqǐ chī wǔfàn. Xiàwǔ wǒmen qù gōngyuán dǎqiú, dǎ de hěn gāoxìng. Wǎnshang wǒ huí jiā zuò zuòyè, shí diǎn jiù shuìjiào le. Wǒ xīwàng měi gè zhōumò dōu zhèyàng.</p>
<p>My weekend is interesting. On Saturday morning I first go to the library to read, then eat lunch with a friend. In the afternoon we go to the park to play ball and have a happy time. In the evening I go home to do homework and go to bed at ten. I hope every weekend is like this.</p></div>
<p>Analysis: topic = {{我的周末很有意思}}; support = four time-ordered sentences; closing = {{我希望每个周末都这样}}. It uses {{先……然后}}, {{一起}}, a {{得}} complement and {{就}}.</p>`,
        bVI: `<p>Một đoạn văn ngắn tốt có ba phần:</p>
<ol><li><strong>Câu chủ đề</strong> — nói đoạn viết về gì: {{我的周末很有意思。}}</li>
<li><strong>Triển khai</strong> (2–4 câu) — chi tiết, ví dụ, theo trật tự rõ ràng.</li>
<li><strong>Câu kết</strong> — cảm xúc, kết quả hoặc dự định: {{我希望下个周末也这样。}}</li></ol>
<h4>Sắp xếp theo thời gian</h4>
<p>Dùng từ chỉ thời gian làm xương sống: {{早上}}, {{上午}}, {{中午}}, {{下午}}, {{晚上}}; hoặc chuỗi {{先……然后……最后……}}; hoặc {{开始}}, {{后来}}, {{现在}}. Chọn một hệ và giữ nhất quán.</p>
<h4>Định dạng</h4>
<ul><li>Thụt đầu dòng <strong>hai ô</strong> ({{空两格}}) ở đầu mỗi đoạn.</li>
<li>Chỉ dùng {{。}} ở cuối câu; cả đoạn là một khối chữ liền.</li>
<li>Độ dài ở trình độ này: 5–8 câu, 80–120 chữ.</li></ul>
<div class="callout"><p lang="zh">我的周末很有意思。星期六上午，我先去图书馆看书，然后和朋友一起吃午饭。下午我们去公园打球，打得很高兴。晚上我回家做作业，十点就睡觉了。我希望每个周末都这样。</p>
<p>Wǒ de zhōumò hěn yǒu yìsi. Xīngqīliù shàngwǔ, wǒ xiān qù túshūguǎn kànshū, ránhòu hé péngyou yìqǐ chī wǔfàn. Xiàwǔ wǒmen qù gōngyuán dǎqiú, dǎ de hěn gāoxìng. Wǎnshang wǒ huí jiā zuò zuòyè, shí diǎn jiù shuìjiào le. Wǒ xīwàng měi gè zhōumò dōu zhèyàng.</p>
<p>Cuối tuần của tôi rất thú vị. Sáng thứ Bảy, tôi đến thư viện đọc sách trước, rồi ăn trưa cùng bạn. Chiều chúng tôi ra công viên chơi bóng, chơi rất vui. Tối tôi về nhà làm bài, mười giờ đã đi ngủ. Tôi mong cuối tuần nào cũng như vậy.</p></div>
<p>Phân tích: chủ đề = {{我的周末很有意思}}; triển khai = bốn câu theo thời gian; kết = {{我希望每个周末都这样}}. Có dùng {{先……然后}}, {{一起}}, bổ ngữ {{得}} và {{就}}.</p>`,
        tab: [['有意思', 'yǒu yìsi', 'interesting', 'thú vị'], ['午饭', 'wǔfàn', 'lunch', 'bữa trưa'], ['希望', 'xīwàng', 'hope', 'hy vọng'], ['这样', 'zhèyàng', 'like this', 'như vậy'], ['开始', 'kāishǐ', 'begin', 'bắt đầu'], ['上午', 'shàngwǔ', 'morning', 'buổi sáng'], ['空两格', 'kōng liǎng gé', 'indent two cells', 'thụt hai ô']],
        mEN: 'Writing a list of unconnected sentences about the day, starting every sentence with {{我}}. Combine them with time words and omit repeated subjects as in 5.4. Another slip: forgetting to indent the first line.',
        mVI: 'Viết một chuỗi câu rời rạc về ngày của mình, câu nào cũng bắt đầu bằng {{我}}. Hãy nối bằng từ chỉ thời gian và lược chủ ngữ lặp như bài 5.4. Lỗi khác: quên thụt đầu dòng.',
        sEN: ['Topic – support – closing', 'Time words are the spine', 'Indent two cells; 5–8 sentences'],
        sVI: ['Chủ đề – triển khai – kết', 'Từ chỉ thời gian là xương sống', 'Thụt hai ô; 5–8 câu'],
        lk: [U.duch, U.gram3, U.xianzai],
        p: [
          ['Which sentence is the closing in the model?', '{{我希望每个周末都这样。}}', 'Câu nào là câu kết trong bài mẫu?', '{{我希望每个周末都这样。}}'],
          ['Write a topic sentence for a paragraph about your family.', 'E.g. {{我家有五口人，大家都很爱学习。}}', 'Viết câu chủ đề cho đoạn về gia đình bạn.', 'Ví dụ {{我家有五口人，大家都很爱学习。}}'],
          ['How many cells is the indent?', 'Two cells ({{空两格}}).', 'Thụt đầu dòng bao nhiêu ô?', 'Hai ô ({{空两格}}).'],
        ],
      }),
    L('crw201-ts-5-4', '5.4 Cohesion: pronouns, omission and varied sentences|||5.4 Liên kết: đại từ, lược bỏ và đa dạng câu',
      'Bỏ chủ ngữ lặp, dùng đại từ và chỉ thị từ, nối câu ngắn thành câu có nhịp.',
      {
        gEN: ['Remove repeated subjects', 'Refer back with 他, 她, 它, 这, 这样', 'Vary sentence length'],
        gVI: ['Bỏ chủ ngữ lặp', 'Quy chiếu bằng 他, 她, 它, 这, 这样', 'Đa dạng độ dài câu'],
        bEN: `<p>Beginners write: {{我早上起床。我吃早饭。我去学校。我上课。}} Each sentence is correct, but the text is choppy. Native writers join them.</p>
<h4>1. Drop repeated subjects</h4>
<p>When the subject stays the same, write it once: {{我早上起床，吃了早饭，就去学校上课。}} Four sentences become one with three verbs in a chain.</p>
<h4>2. Refer back</h4>
<ul><li>{{他 / 她 / 它}} for people and things already named.</li><li>{{这 / 这样 / 这些}} for what was just said: {{我每天听音乐。这样学习汉语很有意思。}}</li><li>{{那时候}} “at that time”.</li></ul>
<h4>3. Vary length</h4>
<p>Mix short sentences (for emphasis) with longer ones that use connectors. A paragraph of ten four-character sentences feels like a list.</p>
<h4>4. Avoid repeated words</h4>
<p>Replace the second {{很}} or {{好}}: {{很高兴}} → {{非常高兴}} / {{特别开心}}; {{好看}} → {{漂亮}}.</p>
<div class="callout"><p lang="zh">我有一个朋友，叫小林。她在北京学习汉语，常常给我发消息。她说那里的冬天很冷，所以她每天都穿厚衣服。这让我很羡慕，因为我这里一直很热。</p><p>Wǒ yǒu yí gè péngyou, jiào Xiǎo Lín. Tā zài Běijīng xuéxí Hànyǔ, chángcháng gěi wǒ fā xiāoxi. Tā shuō nàlǐ de dōngtiān hěn lěng, suǒyǐ tā měi tiān dōu chuān hòu yīfu. Zhè ràng wǒ hěn xiànmù, yīnwèi wǒ zhèlǐ yìzhí hěn rè.</p><p>I have a friend called Xiao Lin. She studies Chinese in Beijing and often sends me messages. She says winters there are cold, so she wears thick clothes every day. This makes me envious, because it is always hot here.</p></div>
<p>Notice: {{她}} refers to {{小林}}; {{那里}} refers to {{北京}}; {{这}} refers to the whole previous idea; the subject {{我}} appears only when it changes.</p>`,
        bVI: `<p>Người mới thường viết: {{我早上起床。我吃早饭。我去学校。我上课。}} Mỗi câu đều đúng nhưng cả đoạn rời rạc. Người bản ngữ nối chúng lại.</p>
<h4>1. Bỏ chủ ngữ lặp</h4>
<p>Khi chủ ngữ không đổi, chỉ viết một lần: {{我早上起床，吃了早饭，就去学校上课。}} Bốn câu thành một câu với chuỗi ba động từ.</p>
<h4>2. Quy chiếu ngược</h4>
<ul><li>{{他 / 她 / 它}} cho người và vật đã nêu.</li><li>{{这 / 这样 / 这些}} cho điều vừa nói: {{我每天听音乐。这样学习汉语很有意思。}}</li><li>{{那时候}} “lúc đó”.</li></ul>
<h4>3. Đa dạng độ dài</h4>
<p>Xen câu ngắn (để nhấn mạnh) với câu dài có liên từ. Đoạn gồm mười câu bốn chữ giống như một danh sách.</p>
<h4>4. Tránh lặp từ</h4>
<p>Thay {{很}} hoặc {{好}} thứ hai: {{很高兴}} → {{非常高兴}} / {{特别开心}}; {{好看}} → {{漂亮}}.</p>
<div class="callout"><p lang="zh">我有一个朋友，叫小林。她在北京学习汉语，常常给我发消息。她说那里的冬天很冷，所以她每天都穿厚衣服。这让我很羡慕，因为我这里一直很热。</p><p>Wǒ yǒu yí gè péngyou, jiào Xiǎo Lín. Tā zài Běijīng xuéxí Hànyǔ, chángcháng gěi wǒ fā xiāoxi. Tā shuō nàlǐ de dōngtiān hěn lěng, suǒyǐ tā měi tiān dōu chuān hòu yīfu. Zhè ràng wǒ hěn xiànmù, yīnwèi wǒ zhèlǐ yìzhí hěn rè.</p><p>Tôi có một người bạn tên Tiểu Lâm. Cô ấy học tiếng Hán ở Bắc Kinh và hay nhắn tin cho tôi. Cô nói mùa đông ở đó rất lạnh nên ngày nào cũng mặc áo dày. Điều này làm tôi ghen tị, vì chỗ tôi lúc nào cũng nóng.</p></div>
<p>Chú ý: {{她}} chỉ {{小林}}; {{那里}} chỉ {{北京}}; {{这}} chỉ cả ý trước; chủ ngữ {{我}} chỉ xuất hiện khi đổi người.</p>`,
        tab: [['消息', 'xiāoxi', 'message, news', 'tin nhắn, tin tức'], ['发', 'fā', 'send', 'gửi'], ['冬天', 'dōngtiān', 'winter', 'mùa đông'], ['羡慕', 'xiànmù', 'envy, admire', 'ghen tị, ngưỡng mộ'], ['一直', 'yìzhí', 'always, all along', 'luôn luôn'], ['特别', 'tèbié', 'especially', 'đặc biệt'], ['厚', 'hòu', 'thick', 'dày']],
        mEN: 'Replacing every subject with a pronoun even when it is unclear ({{他}} could be two men). If the reference is ambiguous, repeat the noun. Also, not every omission is safe: when the subject changes, state the new one.',
        mVI: 'Thay mọi chủ ngữ bằng đại từ ngay cả khi không rõ ({{他}} có thể là hai người). Nếu quy chiếu mơ hồ, hãy lặp danh từ. Và không phải lúc nào lược cũng an toàn: khi chủ ngữ đổi, phải nêu chủ ngữ mới.',
        sEN: ['Write the subject once; chain verbs', 'Use {{他 她 它 这 这样}} to refer back', 'Mix short and long sentences'],
        sVI: ['Chỉ viết chủ ngữ một lần; xâu chuỗi động từ', 'Dùng {{他 她 它 这 这样}} để quy chiếu', 'Xen câu ngắn và dài'],
        lk: [U.gram3, U.duch, U.mdbg],
        p: [
          ['Join: {{我起床。我洗脸。我吃早饭。}}', '{{我起床，洗了脸，吃了早饭。}}', 'Gộp: {{我起床。我洗脸。我吃早饭。}}', '{{我起床，洗了脸，吃了早饭。}}'],
          ['What does {{这样}} refer to in: {{我每天听新闻。这样可以学到很多词。}}', 'To listening to the news every day.', '{{这样}} chỉ gì trong: {{我每天听新闻。这样可以学到很多词。}}', 'Việc ngày nào cũng nghe tin tức.'],
          ['Replace the second {{很}}: {{很好看，很好看。}}', 'E.g. {{很好看，也很漂亮。}}', 'Thay {{很}} thứ hai: {{很好看，很好看。}}', 'Ví dụ {{很好看，也很漂亮。}}'],
        ],
      }),
    QZ(5, 'Quiz 5 — Sentences to paragraphs|||Quiz 5 — Từ câu đến đoạn văn', 'Kiểm tra dấu câu, liên từ, cấu trúc đoạn, liên kết.', [
      Q('q1', 'Which mark separates items in a list?', 'Dấu nào ngăn các mục trong liệt kê?', ['{{、}}', '{{，}}', '{{；}}', '{{：}}'], 0, '{{顿号}}.', '{{顿号}}.'),
      Q('q2', 'A Chinese sentence normally ends with…', 'Câu tiếng Trung thường kết thúc bằng…', ['{{。}}', '.', '{{、}}', '{{，}}'], 0, 'The hollow-circle full stop.', 'Dấu chấm vòng tròn rỗng.'),
      Q('q3', 'Titles of books and films use…', 'Tên sách và phim dùng…', ['{{《 》}}', '{{“ ”}}', '{{（ ）}}', '{{【 】}}'], 0, '{{书名号}}.', '{{书名号}}.'),
      Q('q4', 'Which pair expresses “not only … but also”?', 'Cặp nào diễn đạt “không chỉ … mà còn”?', ['{{不但……而且……}}', '{{因为……所以……}}', '{{如果……就……}}', '{{一边……一边……}}'], 0, '{{不但…而且…}} = addition.', '{{不但…而且…}} = tăng tiến.'),
      Q('q5', '{{虽然……，______很好吃。}} Fill the blank.', '{{虽然……，______很好吃。}} Điền vào chỗ trống.', ['{{但是}}', '{{所以}}', '{{如果}}', '{{因为}}'], 0, 'contrast needs {{但是}}.', 'Tương phản cần {{但是}}.'),
      Q('q6', 'How many cells to indent a paragraph?', 'Thụt đầu đoạn bao nhiêu ô?', ['2', '1', '4', '0'], 0, '{{空两格}}.', '{{空两格}}.'),
      Q('q7', 'The topic sentence is…', 'Câu chủ đề là…', ['the sentence that says what the paragraph is about|||câu nói đoạn văn viết về gì', 'the longest sentence|||câu dài nhất', 'the last sentence|||câu cuối', 'a question|||một câu hỏi'], 0, 'It opens the paragraph.', 'Nó mở đầu đoạn.'),
      Q('q8', 'Best fix for four short sentences with the same subject?', 'Cách sửa tốt nhất cho bốn câu ngắn cùng chủ ngữ?', ['Join them and write the subject once|||Gộp lại và viết chủ ngữ một lần', 'Add 很 to each|||Thêm 很 vào mỗi câu', 'Use English punctuation|||Dùng dấu tiếng Anh', 'Delete all|||Xoá hết'], 0, 'Chain verbs.', 'Xâu chuỗi động từ.'),
    ]),
  ],
};

// ───────────────────────────── Chương 6 ─────────────────────────────
const c6 = {
  title: 'Chapter 6 — Practical writing: notes, messages and notices|||Chương 6 — Viết ứng dụng: ghi chú, tin nhắn và thông báo',
  description: 'Giấy xin nghỉ, giấy nhắn, tin nhắn WeChat, lời mời và thư trả lời, thông báo và điền biểu mẫu.',
  lessons: [
    L('crw201-ts-6-1', '6.1 Leave requests and short notes|||6.1 Giấy xin nghỉ và giấy nhắn',
      'Khuôn 请假条 và 留言条: tiêu đề, xưng hô, nội dung, lời kết, ký tên, ngày.',
      {
        gEN: ['Write a leave request in the standard format', 'Write a short note for a roommate or teacher', 'Use the polite closing 此致 / 敬礼'],
        gVI: ['Viết giấy xin nghỉ đúng khuôn', 'Viết giấy nhắn cho bạn cùng phòng hoặc thầy cô', 'Dùng lời kết lịch sự 此致 / 敬礼'],
        bEN: `<p>Chinese practical writing ({{应用文}}) has fixed formats. Learn the frame and fill in the details.</p>
<div class="formula"><span class="lbl">Leave request {{请假条}}</span>Title (centered) → Greeting + colon → Body (indented 2 cells) → {{此致}} / {{敬礼}} → Signature → Date (lower right)</div>
<div class="callout"><p lang="zh">请假条</p><p lang="zh">王老师：</p>
<p lang="zh">　我是汉语二班的学生阮明。因为今天发烧，头很疼，不能去上课，所以想请假一天。请您批准。</p>
<p lang="zh">　此致</p><p lang="zh">敬礼！</p>
<p lang="zh">学生：阮明</p><p lang="zh">11月9日</p>
<p>Qǐngjià tiáo / Wáng lǎoshī: / Wǒ shì Hànyǔ èr bān de xuésheng Ruǎn Míng. Yīnwèi jīntiān fāshāo, tóu hěn téng, bù néng qù shàngkè, suǒyǐ xiǎng qǐngjià yì tiān. Qǐng nín pīzhǔn. / Cǐzhì / jìngmǐ!</p>
<p>Leave request. Dear Teacher Wang: I am Nguyen Minh from Chinese class 2. Because I have a fever and a bad headache today, I cannot attend class and would like to take one day of leave. Please approve. Yours respectfully. Student: Nguyen Minh. 9 November.</p></div>
<h4>The frame, part by part</h4>
<ul><li><strong>Greeting:</strong> {{王老师：}} (surname + title + colon, at the left).</li>
<li><strong>Body:</strong> who you are → reason ({{因为……}}) → request ({{想请假一天}}) → polite end ({{请您批准}}).</li>
<li><strong>{{此致}}</strong> on its own line, indented; <strong>{{敬礼！}}</strong> on the next line at the left margin. This is the standard pair for formal notes.</li>
<li><strong>Signature and date</strong> at lower right: {{学生：阮明}}, {{11月9日}}.</li></ul>
<h4>A note ({{留言条}})</h4>
<div class="callout"><p lang="zh">小李：我下午三点回来。冰箱里有面包和牛奶，你饿了就先吃吧。小王　11月9日</p><p>Xiǎo Lǐ: Wǒ xiàwǔ sān diǎn huílái. Bīngxiāng li yǒu miànbāo hé niúnǎi, nǐ è le jiù xiān chī ba. Xiǎo Wáng, shíyī yuè jiǔ rì.</p><p>Xiao Li: I will be back at three this afternoon. There is bread and milk in the fridge; if you are hungry, eat first. Xiao Wang, 9 Nov.</p></div>
<p>A note is shorter and needs no {{此致}}. State the time, the item and an action in 2–3 sentences.</p>`,
        bVI: `<p>Văn ứng dụng tiếng Trung ({{应用文}}) có khuôn cố định. Hãy học khung rồi điền chi tiết.</p>
<div class="formula"><span class="lbl">Giấy xin nghỉ {{请假条}}</span>Tiêu đề (giữa) → Xưng hô + hai chấm → Nội dung (thụt 2 ô) → {{此致}} / {{敬礼}} → Ký tên → Ngày (góc dưới phải)</div>
<div class="callout"><p lang="zh">请假条</p><p lang="zh">王老师：</p>
<p lang="zh">　我是汉语二班的学生阮明。因为今天发烧，头很疼，不能去上课，所以想请假一天。请您批准。</p>
<p lang="zh">　此致</p><p lang="zh">敬礼！</p>
<p lang="zh">学生：阮明</p><p lang="zh">11月9日</p>
<p>Qǐngjià tiáo / Wáng lǎoshī: / Wǒ shì Hànyǔ èr bān de xuésheng Ruǎn Míng. Yīnwèi jīntiān fāshāo, tóu hěn téng, bù néng qù shàngkè, suǒyǐ xiǎng qǐngjià yì tiān. Qǐng nín pīzhǔn. / Cǐzhì / jìngmǐ!</p>
<p>Giấy xin nghỉ. Thưa thầy Vương: Em là Nguyễn Minh, lớp tiếng Hán 2. Hôm nay em bị sốt, đau đầu, không đi học được nên xin nghỉ một ngày. Mong thầy duyệt. Kính chào. Học sinh: Nguyễn Minh. Ngày 9 tháng 11.</p></div>
<h4>Từng phần của khung</h4>
<ul><li><strong>Xưng hô:</strong> {{王老师：}} (họ + chức danh + hai chấm, sát lề trái).</li>
<li><strong>Nội dung:</strong> bạn là ai → lý do ({{因为……}}) → đề nghị ({{想请假一天}}) → lời kết lịch sự ({{请您批准}}).</li>
<li><strong>{{此致}}</strong> một dòng riêng, thụt vào; <strong>{{敬礼！}}</strong> dòng tiếp theo sát lề trái. Đây là cặp chuẩn cho văn bản trang trọng.</li>
<li><strong>Ký tên và ngày</strong> ở góc dưới phải: {{学生：阮明}}, {{11月9日}}.</li></ul>
<h4>Giấy nhắn ({{留言条}})</h4>
<div class="callout"><p lang="zh">小李：我下午三点回来。冰箱里有面包和牛奶，你饿了就先吃吧。小王　11月9日</p><p>Xiǎo Lǐ: Wǒ xiàwǔ sān diǎn huílái. Bīngxiāng li yǒu miànbāo hé niúnǎi, nǐ è le jiù xiān chī ba. Xiǎo Wáng, shíyī yuè jiǔ rì.</p><p>Tiểu Lý: Ba giờ chiều mình về. Trong tủ lạnh có bánh mì và sữa, đói thì cứ ăn trước nhé. Tiểu Vương, 9/11.</p></div>
<p>Giấy nhắn ngắn hơn và không cần {{此致}}. Nêu thời gian, đồ vật và việc cần làm trong 2–3 câu.</p>`,
        tab: [['请假', 'qǐngjià', 'ask for leave', 'xin nghỉ'], ['发烧', 'fāshāo', 'have a fever', 'sốt'], ['疼', 'téng', 'ache, hurt', 'đau'], ['批准', 'pīzhǔn', 'approve', 'phê duyệt'], ['此致', 'cǐzhì', 'respectfully (to)', 'kính gửi, xin gửi tới'], ['敬礼', 'jìnglǐ', 'with respect', 'kính chào'], ['冰箱', 'bīngxiāng', 'refrigerator', 'tủ lạnh']],
        mEN: 'Writing 此致 and 敬礼 on the same line, or forgetting the signature and date. Also using “您” vs “你”: for a teacher always use {{您}}.',
        mVI: 'Viết 此致 và 敬礼 cùng một dòng, hoặc quên ký tên và ngày. Cũng như dùng “你” thay vì “您”: với thầy cô luôn dùng {{您}}.',
        sEN: ['Frame: title, greeting, body, {{此致/敬礼}}, signature, date', 'Body: who, why, request, polite end', 'Notes are shorter: time, item, action'],
        sVI: ['Khung: tiêu đề, xưng hô, nội dung, {{此致/敬礼}}, ký tên, ngày', 'Nội dung: ai, vì sao, đề nghị, lời kết', 'Giấy nhắn ngắn: thời gian, vật, việc cần làm'],
        lk: [U.mdbg, U.hsk3, U.duch],
        p: [
          ['What goes on the line right after the greeting?', 'The body, indented two cells.', 'Dòng ngay sau xưng hô là gì?', 'Nội dung, thụt hai ô.'],
          ['Write a one-sentence reason for leave: “I have a cold.”', '{{因为我感冒了，所以想请假。}}', 'Viết một câu lý do xin nghỉ: “Em bị cảm.”', '{{因为我感冒了，所以想请假。}}'],
          ['Which pronoun for a teacher: {{你}} or {{您}}?', '{{您}}.', 'Dùng đại từ nào cho thầy cô: {{你}} hay {{您}}?', '{{您}}.'],
        ],
      }),
    L('crw201-ts-6-2', '6.2 Chat messages to friends and teachers|||6.2 Tin nhắn WeChat cho bạn bè và thầy cô',
      'Giọng điệu khác nhau với bạn và với thầy cô, mẫu câu lịch sự, tin nhắn đủ thông tin.',
      {
        gEN: ['Choose register: friend vs teacher', 'Write a complete message with greeting, request, thanks', 'Use polite fillers like 麻烦您了'],
        gVI: ['Chọn giọng: bạn bè hay thầy cô', 'Viết tin nhắn đủ chào, đề nghị, cảm ơn', 'Dùng câu lịch sự như 麻烦您了'],
        bEN: `<p>Messaging is informal, but with a teacher or an official you still follow polite rules. A message that stands alone, with all the needed information, is better than five short ones.</p>
<table><thead><tr><th>To a friend</th><th>To a teacher</th></tr></thead><tbody>
<tr><td>{{在吗？}} (Are you there?)</td><td>{{老师好！我是汉语二班的阮明。}}</td></tr>
<tr><td>{{明天几点？}}</td><td>{{请问明天几点上课？}}</td></tr>
<tr><td>{{帮我一下，好吗？}}</td><td>{{麻烦您帮我看一下，可以吗？}}</td></tr>
<tr><td>{{谢啦！}}</td><td>{{谢谢老师！}}</td></tr>
</tbody></table>
<h4>Structure of a good message</h4>
<ol><li><strong>Greeting + who you are:</strong> {{老师好！我是……}}</li>
<li><strong>Purpose in one sentence:</strong> {{我想问一下作业的事。}}</li>
<li><strong>Details:</strong> time, place, what you need.</li>
<li><strong>Thanks + close:</strong> {{麻烦您了，谢谢！}}</li></ol>
<div class="callout"><p lang="zh">王老师好！我是汉语二班的阮明。我想问一下，明天的作业是第几页？我今天没来上课，不太清楚。麻烦您了，谢谢老师！</p><p>Wáng lǎoshī hǎo! Wǒ shì Hànyǔ èr bān de Ruǎn Míng. Wǒ xiǎng wèn yíxià, míngtiān de zuòyè shì dì jǐ yè? Wǒ jīntiān méi lái shàngkè, bú tài qīngchu. Máfan nín le, xièxie lǎoshī!</p><p>Hello Teacher Wang! I am Nguyen Minh from Chinese class 2. I would like to ask, which page is tomorrow's homework? I did not come to class today, so I am not sure. Sorry to trouble you, thank you!</p></div>
<h4>Replies</h4>
<p>Short replies are fine: {{好的，谢谢！}} {{收到。}} {{没问题。}} {{知道了。}} For a teacher add {{老师}} or {{您}}: {{好的，谢谢老师！}}</p>
<h4>Things to avoid</h4>
<ul><li>Only {{在吗？}} with nothing else — wait for a reply wastes the other person's time.</li><li>Typing in all pinyin. Use characters; if you cannot recall one, use the input method.</li><li>Long voice messages instead of a clear text for a teacher.</li></ul>`,
        bVI: `<p>Nhắn tin thì thân mật, nhưng với thầy cô hoặc người có chức trách vẫn phải theo phép lịch sự. Một tin nhắn tự đủ, có đầy đủ thông tin, tốt hơn năm tin ngắn.</p>
<table><thead><tr><th>Gửi bạn</th><th>Gửi thầy cô</th></tr></thead><tbody>
<tr><td>{{在吗？}} (Có đó không?)</td><td>{{老师好！我是汉语二班的阮明。}}</td></tr>
<tr><td>{{明天几点？}}</td><td>{{请问明天几点上课？}}</td></tr>
<tr><td>{{帮我一下，好吗？}}</td><td>{{麻烦您帮我看一下，可以吗？}}</td></tr>
<tr><td>{{谢啦！}}</td><td>{{谢谢老师！}}</td></tr>
</tbody></table>
<h4>Cấu trúc một tin nhắn tốt</h4>
<ol><li><strong>Chào + giới thiệu:</strong> {{老师好！我是……}}</li>
<li><strong>Mục đích trong một câu:</strong> {{我想问一下作业的事。}}</li>
<li><strong>Chi tiết:</strong> thời gian, nơi chốn, điều bạn cần.</li>
<li><strong>Cảm ơn + kết:</strong> {{麻烦您了，谢谢！}}</li></ol>
<div class="callout"><p lang="zh">王老师好！我是汉语二班的阮明。我想问一下，明天的作业是第几页？我今天没来上课，不太清楚。麻烦您了，谢谢老师！</p><p>Wáng lǎoshī hǎo! Wǒ shì Hànyǔ èr bān de Ruǎn Míng. Wǒ xiǎng wèn yíxià, míngtiān de zuòyè shì dì jǐ yè? Wǒ jīntiān méi lái shàngkè, bú tài qīngchu. Máfan nín le, xièxie lǎoshī!</p><p>Chào thầy Vương! Em là Nguyễn Minh lớp tiếng Hán 2. Em muốn hỏi bài tập ngày mai ở trang mấy ạ? Hôm nay em không đi học nên chưa rõ. Làm phiền thầy ạ, em cảm ơn thầy!</p></div>
<h4>Trả lời</h4>
<p>Trả lời ngắn là được: {{好的，谢谢！}} {{收到。}} {{没问题。}} {{知道了。}} Với thầy cô thêm {{老师}} hoặc {{您}}: {{好的，谢谢老师！}}</p>
<h4>Nên tránh</h4>
<ul><li>Chỉ gửi {{在吗？}} rồi đợi — làm mất thời gian người kia.</li><li>Gõ toàn pinyin. Hãy dùng chữ; nếu quên chữ thì dùng bộ gõ.</li><li>Gửi tin thoại dài thay cho một tin chữ rõ ràng với thầy cô.</li></ul>`,
        tab: [['麻烦', 'máfan', 'trouble, bother', 'làm phiền'], ['请问', 'qǐngwèn', 'may I ask', 'xin hỏi'], ['收到', 'shōudào', 'received', 'đã nhận được'], ['知道了', 'zhīdào le', 'understood', 'biết rồi'], ['页', 'yè', 'page', 'trang'], ['清楚', 'qīngchu', 'clear', 'rõ'], ['第', 'dì', 'ordinal prefix', 'tiền tố số thứ tự']],
        mEN: 'Messaging a teacher with only {{你好}} or {{在吗}}, or with commands such as {{告诉我作业}}. Use a request: {{请问……？}} or {{麻烦您……}}.',
        mVI: 'Nhắn thầy cô chỉ với {{你好}} hay {{在吗}}, hoặc dùng câu mệnh lệnh như {{告诉我作业}}. Hãy dùng lời đề nghị: {{请问……？}} hoặc {{麻烦您……}}.',
        sEN: ['Friend: short and casual; teacher: {{您}}, {{请问}}, {{麻烦}}', 'Greeting, purpose, details, thanks', 'Replies: {{好的 / 收到 / 没问题}}'],
        sVI: ['Bạn: ngắn gọn thân mật; thầy cô: {{您}}, {{请问}}, {{麻烦}}', 'Chào, mục đích, chi tiết, cảm ơn', 'Trả lời: {{好的 / 收到 / 没问题}}'],
        lk: [U.ime, U.pleco, U.gram3],
        p: [
          ['Turn into a polite request: {{告诉我考试时间。}}', '{{请问考试是什么时候？}} or {{麻烦您告诉我考试时间。}}', 'Đổi thành lời đề nghị lịch sự: {{告诉我考试时间。}}', '{{请问考试是什么时候？}} hoặc {{麻烦您告诉我考试时间。}}'],
          ['Reply to a teacher saying “The class is at 8.”', '{{好的，谢谢老师！}}', 'Trả lời thầy: “Tám giờ học nhé.”', '{{好的，谢谢老师！}}'],
          ['What four parts does a good message have?', 'Greeting + identity, purpose, details, thanks.', 'Một tin nhắn tốt có bốn phần nào?', 'Chào + giới thiệu, mục đích, chi tiết, cảm ơn.'],
        ],
      }),
    L('crw201-ts-6-3', '6.3 Invitations, acceptances and refusals|||6.3 Lời mời, nhận lời và từ chối',
      'Viết lời mời với thời gian–địa điểm–việc, trả lời đồng ý hoặc từ chối khéo.',
      {
        gEN: ['Write an invitation with time, place, event', 'Accept warmly', 'Refuse politely and offer an alternative'],
        gVI: ['Viết lời mời với thời gian, địa điểm, sự kiện', 'Nhận lời nồng nhiệt', 'Từ chối lịch sự và đề xuất thay thế'],
        bEN: `<p>An invitation needs <strong>what, when, where</strong> and a request to reply. A reply should thank, then accept or decline.</p>
<div class="callout"><p lang="zh">小林：</p><p lang="zh">　下个星期六是我的生日，我想请你来我家吃饭。时间是晚上六点，地址是学院路18号。如果你有时间，请告诉我。</p><p lang="zh">　阮明　11月9日</p>
<p>Xiǎo Lín: Xià ge xīngqīliù shì wǒ de shēngrì, wǒ xiǎng qǐng nǐ lái wǒ jiā chī fàn. Shíjiān shì wǎnshang liù diǎn, dìzhǐ shì Xuéyuàn lù shíbā hào. Rúguǒ nǐ yǒu shíjiān, qǐng gàosu wǒ.</p>
<p>Xiao Lin: Next Saturday is my birthday and I would like to invite you to eat at my home. The time is 6 p.m., the address is 18 Xueyuan Road. If you are free, please tell me.</p></div>
<h4>Useful frames</h4>
<ul><li>Invite: {{我想请你……}} / {{欢迎你来……}} / {{你有空吗？}}</li>
<li>Accept: {{谢谢你的邀请，我一定去。}} / {{太好了，我很想去！}}</li>
<li>Decline: {{谢谢你的邀请，可是那天我有事，不能去。对不起。}} + alternative: {{下次一定去。}} / {{我们下个星期再约，好吗？}}</li></ul>
<h4>Declining politely</h4>
<p>Chinese avoids a flat {{不去}}. Say thanks, give a reason in one clause (do not over-explain), apologise and offer another time. Compare:</p>
<p>✗ {{我不去。}} — too blunt.<br>✓ {{谢谢你的邀请，可是那天我要考试，所以不能去。祝你生日快乐！}}</p>
<div class="callout"><p lang="zh">谢谢你的邀请！可是那天我要去机场接朋友，恐怕去不了。对不起。下次我请你吃饭，好吗？祝你生日快乐！</p><p>Xièxie nǐ de yāoqǐng! Kěshì nà tiān wǒ yào qù jīchǎng jiē péngyou, kǒngpà qù bù liǎo. Duìbuqǐ. Xià cì wǒ qǐng nǐ chī fàn, hǎo ma? Zhù nǐ shēngrì kuàilè!</p><p>Thank you for the invitation! But that day I have to go to the airport to meet a friend, so I am afraid I cannot come. Sorry. Next time I will treat you to a meal, all right? Happy birthday!</p></div>`,
        bVI: `<p>Lời mời cần <strong>việc gì, khi nào, ở đâu</strong> và lời đề nghị trả lời. Thư trả lời nên cảm ơn rồi mới đồng ý hoặc từ chối.</p>
<div class="callout"><p lang="zh">小林：</p><p lang="zh">　下个星期六是我的生日，我想请你来我家吃饭。时间是晚上六点，地址是学院路18号。如果你有时间，请告诉我。</p><p lang="zh">　阮明　11月9日</p>
<p>Xiǎo Lín: Xià ge xīngqīliù shì wǒ de shēngrì, wǒ xiǎng qǐng nǐ lái wǒ jiā chī fàn. Shíjiān shì wǎnshang liù diǎn, dìzhǐ shì Xuéyuàn lù shíbā hào. Rúguǒ nǐ yǒu shíjiān, qǐng gàosu wǒ.</p>
<p>Tiểu Lâm: Thứ Bảy tuần sau là sinh nhật mình, mình muốn mời bạn đến nhà ăn cơm. Giờ là 6 giờ tối, địa chỉ số 18 đường Học Viện. Nếu bạn rảnh thì báo cho mình nhé.</p></div>
<h4>Mẫu câu hữu ích</h4>
<ul><li>Mời: {{我想请你……}} / {{欢迎你来……}} / {{你有空吗？}}</li>
<li>Nhận lời: {{谢谢你的邀请，我一定去。}} / {{太好了，我很想去！}}</li>
<li>Từ chối: {{谢谢你的邀请，可是那天我有事，不能去。对不起。}} + đề xuất: {{下次一定去。}} / {{我们下个星期再约，好吗？}}</li></ul>
<h4>Từ chối lịch sự</h4>
<p>Tiếng Trung tránh nói cụt {{不去}}. Cảm ơn, nêu lý do trong một vế (đừng giải thích quá), xin lỗi và đề xuất dịp khác. So sánh:</p>
<p>✗ {{我不去。}} — quá cộc.<br>✓ {{谢谢你的邀请，可是那天我要考试，所以不能去。祝你生日快乐！}}</p>
<div class="callout"><p lang="zh">谢谢你的邀请！可是那天我要去机场接朋友，恐怕去不了。对不起。下次我请你吃饭，好吗？祝你生日快乐！</p><p>Xièxie nǐ de yāoqǐng! Kěshì nà tiān wǒ yào qù jīchǎng jiē péngyou, kǒngpà qù bù liǎo. Duìbuqǐ. Xià cì wǒ qǐng nǐ chī fàn, hǎo ma? Zhù nǐ shēngrì kuàilè!</p><p>Cảm ơn lời mời của bạn! Nhưng hôm đó mình phải ra sân bay đón bạn nên e là không đến được. Xin lỗi nhé. Lần sau mình mời bạn ăn cơm nhé? Chúc bạn sinh nhật vui vẻ!</p></div>`,
        tab: [['邀请', 'yāoqǐng', 'invite; invitation', 'mời; lời mời'], ['生日', 'shēngrì', 'birthday', 'sinh nhật'], ['地址', 'dìzhǐ', 'address', 'địa chỉ'], ['一定', 'yídìng', 'certainly', 'nhất định'], ['恐怕', 'kǒngpà', 'I am afraid', 'e rằng'], ['机场', 'jīchǎng', 'airport', 'sân bay'], ['接', 'jiē', 'meet, pick up', 'đón']],
        mEN: 'Replying only {{不行}} or giving a long list of excuses. Keep it short, warm and give an alternative. Also {{我想邀请你来}} is stiff; {{我想请你来}} is natural.',
        mVI: 'Trả lời chỉ {{不行}} hoặc đưa cả danh sách lý do dài. Hãy ngắn gọn, thân thiện và đề xuất thay thế. Ngoài ra {{我想邀请你来}} hơi cứng; {{我想请你来}} tự nhiên hơn.',
        sEN: ['Invite: what, when, where, reply', 'Accept: thanks + {{一定去}}', 'Decline: thanks, short reason, sorry, alternative'],
        sVI: ['Mời: việc gì, khi nào, ở đâu, trả lời', 'Nhận lời: cảm ơn + {{一定去}}', 'Từ chối: cảm ơn, lý do ngắn, xin lỗi, đề xuất'],
        lk: [U.mdbg, U.caijiu, U.duch],
        p: [
          ['Invite a friend to see a film on Friday at 7 p.m.', 'E.g. {{星期五晚上七点我们去看电影，好吗？}}', 'Mời bạn xem phim thứ Sáu lúc 7 giờ tối.', 'Ví dụ {{星期五晚上七点我们去看电影，好吗？}}'],
          ['Politely decline: you have an exam.', '{{谢谢你的邀请，可是那天我要考试，不能去。对不起。}}', 'Từ chối lịch sự: bạn có bài thi.', '{{谢谢你的邀请，可是那天我要考试，不能去。对不起。}}'],
          ['Which phrase offers an alternative?', '{{下次一定去。}}', 'Cụm nào đề xuất dịp khác?', '{{下次一定去。}}'],
        ],
      }),
    L('crw201-ts-6-4', '6.4 Notices and forms|||6.4 Thông báo và biểu mẫu',
      'Viết 通知 với thời gian–địa điểm–nội dung–yêu cầu; điền biểu mẫu đăng ký.',
      {
        gEN: ['Write a short notice', 'Fill in a registration form', 'Write dates, phone numbers and addresses in Chinese format'],
        gVI: ['Viết thông báo ngắn', 'Điền biểu mẫu đăng ký', 'Viết ngày, số điện thoại và địa chỉ theo kiểu Trung Quốc'],
        bEN: `<h4>Notice {{通知}}</h4>
<p>A notice is public: it has a title, a body that answers <em>what, when, where, who, what to do</em>, and a sender and date at lower right.</p>
<div class="callout"><p lang="zh">通知</p>
<p lang="zh">　本周六上午九点，学校将举行汉语比赛。地点：三楼会议室。请参加比赛的同学八点四十分到。有问题请联系王老师。</p>
<p lang="zh">　汉语系　11月9日</p>
<p>Tōngzhī / Běn zhōuliù shàngwǔ jiǔ diǎn, xuéxiào jiāng jǔxíng Hànyǔ bǐsài. Dìdiǎn: sān lóu huìyìshì. Qǐng cānjiā bǐsài de tóngxué bā diǎn sìshí fēn dào. Yǒu wèntí qǐng liánxì Wáng lǎoshī.</p>
<p>Notice. This Saturday at nine in the morning the school will hold a Chinese contest. Place: third-floor meeting room. Participants, please arrive at 8:40. For questions contact Teacher Wang. Chinese Department, 9 November.</p></div>
<ul><li>Key patterns: {{将举行}} “will hold”, {{请……}} requests, {{地点：}} / {{时间：}} labels with a colon.</li><li>A notice does not use {{此致}}; it ends with the sender and date.</li></ul>
<h4>Form {{表格}}</h4>
<table><thead><tr><th>Field</th><th>Meaning</th><th>What to write</th></tr></thead><tbody>
<tr><td>{{姓名}}</td><td>name</td><td>{{阮明}} (family name first)</td></tr>
<tr><td>{{性别}}</td><td>sex</td><td>{{男}} or {{女}}</td></tr>
<tr><td>{{国籍}}</td><td>nationality</td><td>{{越南}}</td></tr>
<tr><td>{{出生日期}}</td><td>date of birth</td><td>{{2005年3月12日}}</td></tr>
<tr><td>{{专业}}</td><td>major</td><td>{{汉语}}</td></tr>
<tr><td>{{电话}}</td><td>phone</td><td>digits only</td></tr>
<tr><td>{{地址}}</td><td>address</td><td>large to small: country, city, street, number</td></tr>
</tbody></table>
<p>The principle for dates and addresses is <strong>large to small</strong>: year → month → day; country → city → street → number. This is the opposite of Vietnamese addresses.</p>`,
        bVI: `<h4>Thông báo {{通知}}</h4>
<p>Thông báo mang tính công khai: có tiêu đề, nội dung trả lời <em>việc gì, khi nào, ở đâu, ai, cần làm gì</em>, và người gửi cùng ngày ở góc dưới phải.</p>
<div class="callout"><p lang="zh">通知</p>
<p lang="zh">　本周六上午九点，学校将举行汉语比赛。地点：三楼会议室。请参加比赛的同学八点四十分到。有问题请联系王老师。</p>
<p lang="zh">　汉语系　11月9日</p>
<p>Tōngzhī / Běn zhōuliù shàngwǔ jiǔ diǎn, xuéxiào jiāng jǔxíng Hànyǔ bǐsài. Dìdiǎn: sān lóu huìyìshì. Qǐng cānjiā bǐsài de tóngxué bā diǎn sìshí fēn dào. Yǒu wèntí qǐng liánxì Wáng lǎoshī.</p>
<p>Thông báo. Chín giờ sáng thứ Bảy tuần này, nhà trường sẽ tổ chức cuộc thi tiếng Hán. Địa điểm: phòng họp tầng ba. Các bạn dự thi vui lòng đến lúc 8 giờ 40. Có thắc mắc xin liên hệ thầy Vương. Khoa Hán ngữ, ngày 9 tháng 11.</p></div>
<ul><li>Mẫu then chốt: {{将举行}} “sẽ tổ chức”, {{请……}} lời đề nghị, nhãn {{地点：}} / {{时间：}} có hai chấm.</li><li>Thông báo không dùng {{此致}}; kết thúc bằng người gửi và ngày.</li></ul>
<h4>Biểu mẫu {{表格}}</h4>
<table><thead><tr><th>Mục</th><th>Nghĩa</th><th>Điền gì</th></tr></thead><tbody>
<tr><td>{{姓名}}</td><td>họ tên</td><td>{{阮明}} (họ trước)</td></tr>
<tr><td>{{性别}}</td><td>giới tính</td><td>{{男}} hoặc {{女}}</td></tr>
<tr><td>{{国籍}}</td><td>quốc tịch</td><td>{{越南}}</td></tr>
<tr><td>{{出生日期}}</td><td>ngày sinh</td><td>{{2005年3月12日}}</td></tr>
<tr><td>{{专业}}</td><td>chuyên ngành</td><td>{{汉语}}</td></tr>
<tr><td>{{电话}}</td><td>điện thoại</td><td>chỉ ghi số</td></tr>
<tr><td>{{地址}}</td><td>địa chỉ</td><td>từ lớn đến nhỏ: nước, thành phố, đường, số</td></tr>
</tbody></table>
<p>Nguyên tắc cho ngày và địa chỉ là <strong>từ lớn đến nhỏ</strong>: năm → tháng → ngày; nước → thành phố → đường → số. Ngược với địa chỉ tiếng Việt.</p>`,
        tab: [['通知', 'tōngzhī', 'notice', 'thông báo'], ['比赛', 'bǐsài', 'contest', 'cuộc thi'], ['会议室', 'huìyìshì', 'meeting room', 'phòng họp'], ['联系', 'liánxì', 'contact', 'liên hệ'], ['姓名', 'xìngmíng', 'full name', 'họ tên'], ['国籍', 'guójí', 'nationality', 'quốc tịch'], ['专业', 'zhuānyè', 'major', 'chuyên ngành']],
        mEN: 'Writing the date as 9/11/2026 in Chinese text. Write {{2026年11月9日}}. Also writing the given name first on forms: {{姓名}} is family name first.',
        mVI: 'Viết ngày là 9/11/2026 trong văn bản tiếng Trung. Hãy viết {{2026年11月9日}}. Và ghi tên trước họ trên biểu mẫu: {{姓名}} ghi họ trước.',
        sEN: ['Notice: title, what/when/where/who/to do, sender, date', 'Forms: large to small', 'Dates: {{年月日}}'],
        sVI: ['Thông báo: tiêu đề, việc/khi/đâu/ai/cần làm, người gửi, ngày', 'Biểu mẫu: từ lớn đến nhỏ', 'Ngày: {{年月日}}'],
        lk: [U.mdbg, U.hsk3, U.hskc],
        p: [
          ['Write the date 9 November 2026 in Chinese format.', '{{2026年11月9日}}', 'Viết ngày 9 tháng 11 năm 2026 theo kiểu Trung Quốc.', '{{2026年11月9日}}'],
          ['Which word means “nationality” on a form?', '{{国籍}}', 'Từ nào là “quốc tịch” trên biểu mẫu?', '{{国籍}}'],
          ['Write a notice line: “The class meets at 8 a.m. in room 305.”', '{{时间：上午八点；地点：305教室。}}', 'Viết một dòng thông báo: “Lớp họp lúc 8 giờ sáng tại phòng 305.”', '{{时间：上午八点；地点：305教室。}}'],
        ],
      }),
    QZ(6, 'Quiz 6 — Practical writing|||Quiz 6 — Viết ứng dụng', 'Kiểm tra khuôn giấy xin nghỉ, tin nhắn, lời mời, thông báo và biểu mẫu.', [
      Q('q1', 'In a formal note, 此致 is followed by…', 'Trong văn bản trang trọng, 此致 đi kèm…', ['{{敬礼}}', '{{再见}}', '{{谢谢}}', '{{你好}}'], 0, '{{此致，敬礼}}.', '{{此致，敬礼}}.'),
      Q('q2', 'Pronoun for a teacher in a note:', 'Đại từ cho thầy cô trong giấy nhắn:', ['{{您}}', '{{你}}', '{{他}}', '{{它}}'], 0, 'Polite {{您}}.', '{{您}} lịch sự.'),
      Q('q3', 'The signature and date go…', 'Ký tên và ngày đặt…', ['lower right|||góc dưới phải', 'top left|||góc trên trái', 'centre|||giữa', 'nowhere|||không đâu'], 0, 'Standard format.', 'Khuôn chuẩn.'),
      Q('q4', 'Polite way to ask a teacher a question:', 'Cách hỏi thầy cô lịch sự:', ['{{请问……？}}', '{{你说……！}}', '{{告诉我……}}', '{{快点……}}'], 0, '{{请问}} = may I ask.', '{{请问}} = xin hỏi.'),
      Q('q5', 'To decline politely, add…', 'Để từ chối lịch sự, thêm…', ['thanks, reason, sorry, alternative|||cảm ơn, lý do, xin lỗi, đề xuất khác', 'only 不行|||chỉ 不行', 'a long story|||một câu chuyện dài', 'nothing|||không gì'], 0, 'Softens the refusal.', 'Làm lời từ chối nhẹ nhàng.'),
      Q('q6', 'Which date format is right?', 'Cách viết ngày nào đúng?', ['{{2026年11月9日}}', '{{9日11月2026年}}', '{{11/9/2026}}', '{{9-11-2026日}}'], 0, 'Year, month, day.', 'Năm, tháng, ngày.'),
      Q('q7', '{{国籍}} means…', '{{国籍}} nghĩa là…', ['nationality|||quốc tịch', 'address|||địa chỉ', 'major|||chuyên ngành', 'phone|||điện thoại'], 0, 'form field.', 'mục trong biểu mẫu.'),
      Q('q8', 'A notice does not end with…', 'Thông báo không kết thúc bằng…', ['{{此致 敬礼}}', 'sender|||người gửi', 'date|||ngày', 'time and place|||thời gian và nơi chốn'], 0, 'Notices are not letters.', 'Thông báo không phải thư.'),
    ]),
  ],
};

// ───────────────────────────── Chương 7 ─────────────────────────────
const c7 = {
  title: 'Chapter 7 — Letters and emails|||Chương 7 — Thư và email',
  description: 'Khuôn thư/email tiếng Trung, viết cho bạn bè, và viết cho thầy cô hoặc văn phòng với lời đề nghị, xin lỗi, cảm ơn.',
  lessons: [
    L('crw201-ts-7-1', '7.1 Anatomy of a Chinese letter and email|||7.1 Cấu tạo thư và email tiếng Trung',
      'Sáu phần của thư: xưng hô, chào, nội dung, lời chúc, ký tên, ngày; từ vựng email.',
      {
        gEN: ['Name the six parts of a letter', 'Pick the right greeting and wish for the reader', 'Use email vocabulary: subject, attachment, reply'],
        gVI: ['Gọi tên sáu phần của thư', 'Chọn lời chào và lời chúc phù hợp với người đọc', 'Dùng từ vựng email: chủ đề, tệp đính kèm, trả lời'],
        bEN: `<p>A letter or email follows the same six parts. In an email the subject line {{主题}} sits above them.</p>
<table><thead><tr><th>Part</th><th>Chinese</th><th>Example</th></tr></thead><tbody>
<tr><td>1 Salutation</td><td>{{称呼}}</td><td>{{亲爱的小林：}} (friend) / {{尊敬的王老师：}} (teacher)</td></tr>
<tr><td>2 Greeting</td><td>{{问候}}</td><td>{{你好！}} / {{您好！}}</td></tr>
<tr><td>3 Body</td><td>{{正文}}</td><td>news, questions, request</td></tr>
<tr><td>4 Wish</td><td>{{祝语}}</td><td>{{祝你学习进步！}} / {{祝您身体健康！}} / {{此致 敬礼}}</td></tr>
<tr><td>5 Signature</td><td>{{署名}}</td><td>{{阮明}}</td></tr>
<tr><td>6 Date</td><td>{{日期}}</td><td>{{2026年11月9日}}</td></tr>
</tbody></table>
<h4>Choosing the register</h4>
<ul><li><strong>Friends:</strong> {{亲爱的……：}}, {{你好！}}, wish with {{祝你……}}, close with {{你的朋友}}.</li>
<li><strong>Teachers and officials:</strong> {{尊敬的……：}}, {{您好！}}, {{此致 敬礼！}} or {{祝您身体健康，工作顺利！}}.</li>
<li>The wish is a separate short line, not part of the body.</li></ul>
<h4>Email words</h4>
<p>{{邮件}} email, {{电子邮箱}} mailbox, {{主题}} subject, {{发}} send, {{收}} receive, {{回复}} reply, {{附件}} attachment, {{抄送}} cc.</p>
<div class="callout"><p lang="zh">主题：请教一个问题</p><p lang="zh">尊敬的王老师：</p><p lang="zh">　您好！我想请教一个问题：“把”字句的作业可以明天交吗？我附上了我写的句子，请您看一下。谢谢！</p><p lang="zh">　祝您工作顺利！</p><p lang="zh">　学生阮明</p><p lang="zh">　2026年11月9日</p>
<p>Zhǔtí: qǐngjiào yí gè wèntí / Zūnjìng de Wáng lǎoshī: / Nín hǎo! Wǒ xiǎng qǐngjiào yí gè wèntí: “bǎ” zì jù de zuòyè kěyǐ míngtiān jiāo ma? Wǒ fùshàng le wǒ xiě de jùzi, qǐng nín kàn yíxià. Xièxie! / Zhù nín gōngzuò shùnlì! / Xuésheng Ruǎn Míng.</p>
<p>Subject: A question. Dear Teacher Wang: Hello! I would like to ask whether the 把-sentence homework can be handed in tomorrow. I attach the sentences I wrote; please have a look. Thank you! Wishing you success in your work. Student Nguyen Minh, 9 Nov 2026.</p></div>`,
        bVI: `<p>Thư hay email đều theo sáu phần giống nhau. Với email, dòng chủ đề {{主题}} nằm phía trên.</p>
<table><thead><tr><th>Phần</th><th>Tiếng Trung</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>1 Xưng hô</td><td>{{称呼}}</td><td>{{亲爱的小林：}} (bạn) / {{尊敬的王老师：}} (thầy cô)</td></tr>
<tr><td>2 Lời chào</td><td>{{问候}}</td><td>{{你好！}} / {{您好！}}</td></tr>
<tr><td>3 Nội dung</td><td>{{正文}}</td><td>tin tức, câu hỏi, đề nghị</td></tr>
<tr><td>4 Lời chúc</td><td>{{祝语}}</td><td>{{祝你学习进步！}} / {{祝您身体健康！}} / {{此致 敬礼}}</td></tr>
<tr><td>5 Ký tên</td><td>{{署名}}</td><td>{{阮明}}</td></tr>
<tr><td>6 Ngày</td><td>{{日期}}</td><td>{{2026年11月9日}}</td></tr>
</tbody></table>
<h4>Chọn giọng văn</h4>
<ul><li><strong>Bạn bè:</strong> {{亲爱的……：}}, {{你好！}}, chúc bằng {{祝你……}}, kết {{你的朋友}}.</li>
<li><strong>Thầy cô, cơ quan:</strong> {{尊敬的……：}}, {{您好！}}, {{此致 敬礼！}} hoặc {{祝您身体健康，工作顺利！}}.</li>
<li>Lời chúc là một dòng ngắn riêng, không thuộc nội dung.</li></ul>
<h4>Từ vựng email</h4>
<p>{{邮件}} email, {{电子邮箱}} hộp thư, {{主题}} chủ đề, {{发}} gửi, {{收}} nhận, {{回复}} trả lời, {{附件}} tệp đính kèm, {{抄送}} cc.</p>
<div class="callout"><p lang="zh">主题：请教一个问题</p><p lang="zh">尊敬的王老师：</p><p lang="zh">　您好！我想请教一个问题：“把”字句的作业可以明天交吗？我附上了我写的句子，请您看一下。谢谢！</p><p lang="zh">　祝您工作顺利！</p><p lang="zh">　学生阮明</p><p lang="zh">　2026年11月9日</p>
<p>Zhǔtí: qǐngjiào yí gè wèntí / Zūnjìng de Wáng lǎoshī: / Nín hǎo! Wǒ xiǎng qǐngjiào yí gè wèntí: “bǎ” zì jù de zuòyè kěyǐ míngtiān jiāo ma? Wǒ fùshàng le wǒ xiě de jùzi, qǐng nín kàn yíxià. Xièxie! / Zhù nín gōngzuò shùnlì! / Xuésheng Ruǎn Míng.</p>
<p>Chủ đề: Xin hỏi một vấn đề. Kính gửi thầy Vương: Chào thầy! Em muốn hỏi bài tập câu chữ 把 có thể nộp vào ngày mai không ạ? Em đính kèm các câu em đã viết, xin thầy xem giúp. Cảm ơn thầy! Chúc thầy công việc thuận lợi. Học sinh Nguyễn Minh, 9/11/2026.</p></div>`,
        tab: [['称呼', 'chēnghu', 'form of address', 'cách xưng hô'], ['尊敬', 'zūnjìng', 'respected', 'kính trọng'], ['亲爱', 'qīn\'ài', 'dear', 'thân mến'], ['附件', 'fùjiàn', 'attachment', 'tệp đính kèm'], ['回复', 'huífù', 'reply', 'trả lời'], ['顺利', 'shùnlì', 'smooth', 'thuận lợi'], ['交', 'jiāo', 'hand in', 'nộp']],
        mEN: 'Using {{亲爱的}} for a teacher (too intimate) or leaving out the colon after the salutation. The salutation ends with a full-width colon {{：}} and the body starts on the next line.',
        mVI: 'Dùng {{亲爱的}} cho thầy cô (quá thân mật) hoặc quên dấu hai chấm sau xưng hô. Xưng hô kết thúc bằng dấu hai chấm toàn chiều rộng {{：}} và nội dung bắt đầu ở dòng kế.',
        sEN: ['Six parts: salutation, greeting, body, wish, signature, date', '{{亲爱的}} for friends, {{尊敬的}} for teachers', 'Email: subject line and attachment'],
        sVI: ['Sáu phần: xưng hô, chào, nội dung, chúc, ký tên, ngày', '{{亲爱的}} cho bạn, {{尊敬的}} cho thầy cô', 'Email: dòng chủ đề và tệp đính kèm'],
        lk: [U.mdbg, U.ime, U.hsk3],
        p: [
          ['Which salutation fits a teacher?', '{{尊敬的王老师：}}', 'Xưng hô nào phù hợp với thầy cô?', '{{尊敬的王老师：}}'],
          ['What does {{附件}} mean?', 'Attachment.', '{{附件}} nghĩa là gì?', 'Tệp đính kèm.'],
          ['Write a wish for a teacher.', '{{祝您身体健康，工作顺利！}}', 'Viết một lời chúc cho thầy cô.', '{{祝您身体健康，工作顺利！}}'],
        ],
      }),
    L('crw201-ts-7-2', '7.2 Writing to a friend: news, thanks and plans|||7.2 Viết cho bạn: tin tức, cảm ơn và dự định',
      'Mở đầu, kể tin, hỏi thăm, cảm ơn, hẹn gặp, lời kết thân mật.',
      {
        gEN: ['Open and close a friendly letter naturally', 'Report news with 了, 听说, 最近', 'Thank someone and make plans'],
        gVI: ['Mở đầu và kết thư thân mật tự nhiên', 'Kể tin bằng 了, 听说, 最近', 'Cảm ơn và hẹn dự định'],
        bEN: `<p>A friendly letter sounds warm and personal. Use a simple scaffold: <strong>greet → ask → tell → thank/plan → wish</strong>.</p>
<ul><li><strong>Open:</strong> {{好久不见！}} “long time no see” / {{最近怎么样？}} “how have you been?” / {{收到你的邮件，我很高兴。}}</li>
<li><strong>Tell news:</strong> {{最近我很忙。}} {{我搬家了。}} {{听说你要来越南，是真的吗？}}</li>
<li><strong>Thank:</strong> {{谢谢你上次帮我。}} {{非常感谢你的礼物。}}</li>
<li><strong>Plan:</strong> {{有时间的话，我们一起吃饭吧。}} {{我打算下个月去旅行。}}</li>
<li><strong>Close:</strong> {{期待你的回信。}} {{代我向你的家人问好。}} {{祝你一切顺利！}} {{保重！}}</li></ul>
<div class="callout"><p lang="zh">亲爱的小林：</p><p lang="zh">　你好！好久不见，最近怎么样？我很好，就是有点儿忙。上个月我搬到了新宿舍，离学校很近。听说你下个月要来河内，是真的吗？如果是真的，我们一起去吃河粉吧。谢谢你上次寄给我的明信片，我很喜欢。期待你的回信！</p><p lang="zh">　祝你一切顺利！</p><p lang="zh">　你的朋友　阮明</p>
<p>Qīn'ài de Xiǎo Lín: / Nǐ hǎo! Hǎojiǔ bú jiàn, zuìjìn zěnmeyàng? Wǒ hěn hǎo, jiùshì yǒudiǎnr máng. Shàng ge yuè wǒ bān dào le xīn sùshè, lí xuéxiào hěn jìn. Tīngshuō nǐ xià ge yuè yào lái Hénèi, shì zhēn de ma? Rúguǒ shì zhēn de, wǒmen yìqǐ qù chī hé fěn ba. Xièxie nǐ shàng cì jì gěi wǒ de míngxìnpiàn, wǒ hěn xǐhuan. Qīdài nǐ de huíxìn!</p>
<p>Dear Xiao Lin: Hello! Long time no see; how are you? I am fine, just a bit busy. Last month I moved to a new dormitory, very close to school. I heard you are coming to Hanoi next month; is it true? If so, let us go and eat pho together. Thank you for the postcard you sent me last time; I like it a lot. I look forward to your reply!</p></div>
<p>Structure check: ask ({{最近怎么样}}), tell ({{搬到了新宿舍}}), question ({{听说……}}), plan ({{一起去吃河粉}}), thanks ({{谢谢你……}}), close ({{期待你的回信}}).</p>`,
        bVI: `<p>Thư thân mật cần ấm áp và riêng tư. Dùng khung đơn giản: <strong>chào → hỏi → kể → cảm ơn/hẹn → chúc</strong>.</p>
<ul><li><strong>Mở đầu:</strong> {{好久不见！}} “lâu rồi không gặp” / {{最近怎么样？}} “dạo này thế nào?” / {{收到你的邮件，我很高兴。}}</li>
<li><strong>Kể tin:</strong> {{最近我很忙。}} {{我搬家了。}} {{听说你要来越南，是真的吗？}}</li>
<li><strong>Cảm ơn:</strong> {{谢谢你上次帮我。}} {{非常感谢你的礼物。}}</li>
<li><strong>Hẹn:</strong> {{有时间的话，我们一起吃饭吧。}} {{我打算下个月去旅行。}}</li>
<li><strong>Kết:</strong> {{期待你的回信。}} {{代我向你的家人问好。}} {{祝你一切顺利！}} {{保重！}}</li></ul>
<div class="callout"><p lang="zh">亲爱的小林：</p><p lang="zh">　你好！好久不见，最近怎么样？我很好，就是有点儿忙。上个月我搬到了新宿舍，离学校很近。听说你下个月要来河内，是真的吗？如果是真的，我们一起去吃河粉吧。谢谢你上次寄给我的明信片，我很喜欢。期待你的回信！</p><p lang="zh">　祝你一切顺利！</p><p lang="zh">　你的朋友　阮明</p>
<p>Qīn'ài de Xiǎo Lín: / Nǐ hǎo! Hǎojiǔ bú jiàn, zuìjìn zěnmeyàng? Wǒ hěn hǎo, jiùshì yǒudiǎnr máng. Shàng ge yuè wǒ bān dào le xīn sùshè, lí xuéxiào hěn jìn. Tīngshuō nǐ xià ge yuè yào lái Hénèi, shì zhēn de ma? Rúguǒ shì zhēn de, wǒmen yìqǐ qù chī hé fěn ba. Xièxie nǐ shàng cì jì gěi wǒ de míngxìnpiàn, wǒ hěn xǐhuan. Qīdài nǐ de huíxìn!</p>
<p>Tiểu Lâm thân mến: Chào bạn! Lâu rồi không gặp, dạo này bạn thế nào? Mình khoẻ, chỉ hơi bận. Tháng trước mình chuyển sang ký túc xá mới, gần trường lắm. Nghe nói tháng sau bạn sẽ đến Hà Nội, có thật không? Nếu thật thì mình cùng đi ăn phở nhé. Cảm ơn tấm bưu thiếp bạn gửi lần trước, mình rất thích. Mong thư hồi âm của bạn! Chúc bạn mọi sự thuận lợi! Bạn của bạn, Nguyễn Minh.</p></div>
<p>Kiểm cấu trúc: hỏi ({{最近怎么样}}), kể ({{搬到了新宿舍}}), câu hỏi ({{听说……}}), hẹn ({{一起去吃河粉}}), cảm ơn ({{谢谢你……}}), kết ({{期待你的回信}}).</p>`,
        tab: [['好久不见', 'hǎojiǔ bú jiàn', 'long time no see', 'lâu quá không gặp'], ['最近', 'zuìjìn', 'recently', 'dạo này'], ['搬', 'bān', 'move', 'chuyển'], ['宿舍', 'sùshè', 'dormitory', 'ký túc xá'], ['听说', 'tīngshuō', 'I hear that', 'nghe nói'], ['明信片', 'míngxìnpiàn', 'postcard', 'bưu thiếp'], ['期待', 'qīdài', 'look forward to', 'mong đợi']],
        mEN: 'Translating Vietnamese letter phrases literally, for example “mong thư hồi âm” as {{希望你的回信}} (understandable but less natural than {{期待你的回信}}). Use set closings from the list.',
        mVI: 'Dịch sát các câu quen trong thư tiếng Việt, ví dụ “mong thư hồi âm” thành {{希望你的回信}} (hiểu được nhưng kém tự nhiên hơn {{期待你的回信}}). Hãy dùng các câu kết cố định trong danh sách.',
        sEN: ['Scaffold: greet, ask, tell, thank/plan, wish', 'Set phrases: {{好久不见 / 听说 / 期待你的回信 / 保重}}', 'Keep the tone warm'],
        sVI: ['Khung: chào, hỏi, kể, cảm ơn/hẹn, chúc', 'Câu cố định: {{好久不见 / 听说 / 期待你的回信 / 保重}}', 'Giữ giọng ấm áp'],
        lk: [U.duch, U.gram3, U.le],
        p: [
          ['Write an opening line for a friend you have not seen for a long time.', '{{好久不见！最近怎么样？}}', 'Viết câu mở đầu cho người bạn lâu chưa gặp.', '{{好久不见！最近怎么样？}}'],
          ['Say “I heard you passed the exam” in Chinese.', '{{听说你通过了考试。}}', 'Nói “Nghe nói bạn đã thi đỗ” bằng tiếng Trung.', '{{听说你通过了考试。}}'],
          ['Write a closing wish.', '{{祝你一切顺利！}} / {{保重！}}', 'Viết một lời chúc kết thư.', '{{祝你一切顺利！}} / {{保重！}}'],
        ],
      }),
    L('crw201-ts-7-3', '7.3 Writing to a teacher or an office: requests and apologies|||7.3 Viết cho thầy cô hoặc văn phòng: đề nghị và xin lỗi',
      'Email trang trọng với lý do, đề nghị rõ ràng, xin lỗi và cảm ơn; câu nhẹ nhàng.',
      {
        gEN: ['Write a formal email with a clear request', 'Apologise and explain in one sentence', 'Use softening phrases: 能不能, 可以……吗, 麻烦'],
        gVI: ['Viết email trang trọng với đề nghị rõ ràng', 'Xin lỗi và giải thích trong một câu', 'Dùng câu giảm nhẹ: 能不能, 可以……吗, 麻烦'],
        bEN: `<p>A formal email is direct but polite. One email = one purpose. Use this order: <strong>who I am → what I need → why → when → thanks</strong>.</p>
<h4>Tools for politeness</h4>
<ul><li>Soften with questions: {{我可以……吗？}} / {{能不能……？}} / {{您看可以吗？}}</li>
<li>Apologise: {{对不起}}, {{不好意思}}, {{很抱歉}}. {{很抱歉给您添麻烦了}} “sorry to trouble you”.</li>
<li>Thank in advance: {{麻烦您了，非常感谢！}}</li>
<li>Give a reason in one clause: {{因为生病了}}, {{因为有事}}.</li>
<li>Be exact: give the date, the class number and the file name.</li></ul>
<div class="callout"><p lang="zh">主题：作业迟交的请求</p><p lang="zh">尊敬的李老师：</p><p lang="zh">　您好！我是汉语二班的阮明。很抱歉，我这周生病了，没有写完作业。我可以星期五再交吗？我会在星期四晚上写完，然后发给您。给您添麻烦了，非常感谢！</p><p lang="zh">　此致</p><p lang="zh">敬礼！</p><p lang="zh">　学生阮明　11月9日</p>
<p>Zhǔtí: zuòyè chí jiāo de qǐngqiú / Zūnjìng de Lǐ lǎoshī: / Nín hǎo! Wǒ shì Hànyǔ èr bān de Ruǎn Míng. Hěn bàoqiàn, wǒ zhè zhōu shēngbìng le, méiyǒu xiě wán zuòyè. Wǒ kěyǐ xīngqīwǔ zài jiāo ma? Wǒ huì zài xīngqīsì wǎnshang xiě wán, ránhòu fā gěi nín. Gěi nín tiān máfan le, fēicháng gǎnxiè!</p>
<p>Subject: Request to submit homework late. Dear Teacher Li: Hello! I am Nguyen Minh from Chinese class 2. I am very sorry; I was ill this week and have not finished the homework. May I hand it in on Friday? I will finish it on Thursday evening and send it to you. Sorry for the trouble; thank you very much!</p></div>
<p>Check: identity, apology, reason, request, concrete date, promise, thanks, formal close. All in 5 sentences.</p>
<h4>Offices</h4>
<p>For an office ({{办公室}}), name the department and add contact details: {{我的学号是……，电话是……}}. End with {{请回复}} “please reply”.</p>`,
        bVI: `<p>Email trang trọng thì thẳng nhưng lịch sự. Một email = một mục đích. Dùng thứ tự: <strong>tôi là ai → tôi cần gì → vì sao → khi nào → cảm ơn</strong>.</p>
<h4>Công cụ lịch sự</h4>
<ul><li>Giảm nhẹ bằng câu hỏi: {{我可以……吗？}} / {{能不能……？}} / {{您看可以吗？}}</li>
<li>Xin lỗi: {{对不起}}, {{不好意思}}, {{很抱歉}}. {{很抱歉给您添麻烦了}} “xin lỗi đã làm phiền”.</li>
<li>Cảm ơn trước: {{麻烦您了，非常感谢！}}</li>
<li>Nêu lý do trong một vế: {{因为生病了}}, {{因为有事}}.</li>
<li>Cụ thể: ghi ngày, số lớp và tên tệp.</li></ul>
<div class="callout"><p lang="zh">主题：作业迟交的请求</p><p lang="zh">尊敬的李老师：</p><p lang="zh">　您好！我是汉语二班的阮明。很抱歉，我这周生病了，没有写完作业。我可以星期五再交吗？我会在星期四晚上写完，然后发给您。给您添麻烦了，非常感谢！</p><p lang="zh">　此致</p><p lang="zh">敬礼！</p><p lang="zh">　学生阮明　11月9日</p>
<p>Zhǔtí: zuòyè chí jiāo de qǐngqiú / Zūnjìng de Lǐ lǎoshī: / Nín hǎo! Wǒ shì Hànyǔ èr bān de Ruǎn Míng. Hěn bàoqiàn, wǒ zhè zhōu shēngbìng le, méiyǒu xiě wán zuòyè. Wǒ kěyǐ xīngqīwǔ zài jiāo ma? Wǒ huì zài xīngqīsì wǎnshang xiě wán, ránhòu fā gěi nín. Gěi nín tiān máfan le, fēicháng gǎnxiè!</p>
<p>Chủ đề: Xin nộp bài muộn. Kính gửi cô Lý: Chào cô! Em là Nguyễn Minh lớp tiếng Hán 2. Em rất xin lỗi, tuần này em bị ốm nên chưa viết xong bài tập. Em có thể nộp vào thứ Sáu được không ạ? Em sẽ viết xong tối thứ Năm rồi gửi cô. Làm phiền cô, em chân thành cảm ơn!</p></div>
<p>Kiểm: danh tính, lời xin lỗi, lý do, đề nghị, ngày cụ thể, lời hứa, cảm ơn, lời kết trang trọng. Tất cả chỉ trong 5 câu.</p>
<h4>Văn phòng</h4>
<p>Với văn phòng ({{办公室}}), nêu tên bộ phận và thông tin liên lạc: {{我的学号是……，电话是……}}. Kết bằng {{请回复}} “xin trả lời”.</p>`,
        tab: [['抱歉', 'bàoqiàn', 'sorry', 'xin lỗi'], ['迟', 'chí', 'late', 'muộn'], ['生病', 'shēngbìng', 'fall ill', 'bị ốm'], ['添麻烦', 'tiān máfan', 'cause trouble', 'làm phiền'], ['感谢', 'gǎnxiè', 'thank', 'cảm ơn'], ['办公室', 'bàngōngshì', 'office', 'văn phòng'], ['学号', 'xuéhào', 'student ID', 'mã số sinh viên']],
        mEN: 'Writing {{我不能交作业，因为我病了}} without apology or request. State the request positively: {{我可以星期五再交吗？}} A bare statement sounds like an excuse.',
        mVI: 'Viết {{我不能交作业，因为我病了}} mà không xin lỗi hay đề nghị. Hãy nêu đề nghị tích cực: {{我可以星期五再交吗？}} Một câu trần thuật nghe như lời bào chữa.',
        sEN: ['Order: identity, apology, reason, request, date, thanks', 'Soften with {{可以……吗 / 能不能}}', 'One email, one purpose'],
        sVI: ['Thứ tự: danh tính, xin lỗi, lý do, đề nghị, ngày, cảm ơn', 'Giảm nhẹ bằng {{可以……吗 / 能不能}}', 'Một email, một mục đích'],
        lk: [U.mdbg, U.gram3, U.duch],
        p: [
          ['Write a request: “May I hand in on Monday?”', '{{我可以星期一再交吗？}}', 'Viết lời đề nghị: “Em nộp vào thứ Hai được không ạ?”', '{{我可以星期一再交吗？}}'],
          ['Make this softer: {{我要请假。}}', '{{我想请假一天，可以吗？}}', 'Làm câu này nhẹ hơn: {{我要请假。}}', '{{我想请假一天，可以吗？}}'],
          ['Thank in advance for the trouble.', '{{麻烦您了，非常感谢！}}', 'Cảm ơn trước vì đã phiền.', '{{麻烦您了，非常感谢！}}'],
        ],
      }),
    QZ(7, 'Quiz 7 — Letters and emails|||Quiz 7 — Thư và email', 'Kiểm tra khuôn thư, lời chào, lời chúc, email trang trọng.', [
      Q('q1', 'How many parts does a letter have?', 'Một lá thư có bao nhiêu phần?', ['6', '2', '3', '10'], 0, 'Salutation, greeting, body, wish, signature, date.', 'Xưng hô, chào, nội dung, chúc, ký tên, ngày.'),
      Q('q2', 'Salutation for a teacher:', 'Xưng hô cho thầy cô:', ['{{尊敬的李老师：}}', '{{亲爱的李老师：}}', '{{喂，李老师！}}', '{{李老师，你好}}'], 0, '{{尊敬的}} = respected.', '{{尊敬的}} = kính.'),
      Q('q3', '{{附件}} means…', '{{附件}} nghĩa là…', ['attachment|||tệp đính kèm', 'subject|||chủ đề', 'signature|||chữ ký', 'reply|||trả lời'], 0, 'Email word.', 'Từ vựng email.'),
      Q('q4', 'Closing line for a friend:', 'Câu kết cho bạn:', ['{{期待你的回信！}}', '{{此致 敬礼}}', '{{特此通知}}', '{{请批准}}'], 0, 'Warm, informal.', 'Ấm áp, thân mật.'),
      Q('q5', 'Polite request:', 'Đề nghị lịch sự:', ['{{我可以星期五再交吗？}}', '{{我星期五再交。}}', '{{你让我星期五交！}}', '{{星期五！}}'], 0, 'Question softens.', 'Câu hỏi làm nhẹ giọng.'),
      Q('q6', 'Which means “sorry to trouble you”?', 'Câu nào nghĩa “xin lỗi đã làm phiền”?', ['{{给您添麻烦了}}', '{{我很高兴}}', '{{再见}}', '{{没关系}}'], 0, 'Polite apology.', 'Lời xin lỗi lịch sự.'),
      Q('q7', 'Date format in the signature:', 'Cách viết ngày ở chỗ ký tên:', ['{{2026年11月9日}}', '{{9/11/2026}}', '{{11 9 26}}', '{{9日}}'], 0, 'Year–month–day.', 'Năm–tháng–ngày.'),
      Q('q8', 'A good formal email has…', 'Một email trang trọng tốt có…', ['one clear purpose|||một mục đích rõ ràng', 'five different requests|||năm đề nghị khác nhau', 'no greeting|||không chào', 'no thanks|||không cảm ơn'], 0, 'One email, one purpose.', 'Một email, một mục đích.'),
    ]),
  ],
};

// ───────────────────────────── Chương 8 ─────────────────────────────
const c8 = {
  title: 'Chapter 8 — Short essays of 80–120 characters|||Chương 8 — Bài văn ngắn 80–120 chữ',
  description: 'Kể một sự việc, miêu tả người và nơi chốn, viết theo gợi ý hoặc tranh, và nêu ý kiến có lý do.',
  lessons: [
    L('crw201-ts-8-1', '8.1 Narrating an event|||8.1 Kể một sự việc',
      'Khung kể chuyện: thời gian – nơi chốn – nhân vật – diễn biến – kết quả – cảm nghĩ, với từ nối 突然, 后来, 结果, 终于.',
      {
        gEN: ['Plan a story with six slots', 'Use time and turning-point words', 'Write a 90-character narrative'],
        gVI: ['Lập khung câu chuyện sáu ô', 'Dùng từ chỉ thời gian và bước ngoặt', 'Viết bài kể chuyện 90 chữ'],
        bEN: `<p>A narrative answers six questions: <strong>when, where, who, what happened, how it ended, how you felt</strong>. Plan each with one phrase before you write.</p>
<table><thead><tr><th>Slot</th><th>Phrase</th></tr></thead><tbody>
<tr><td>When</td><td>{{上个星期天}}</td></tr><tr><td>Where / who</td><td>{{我和朋友去河边骑自行车}}</td></tr>
<tr><td>What happened</td><td>{{突然下起雨来了}}</td></tr><tr><td>Turn</td><td>{{没带雨伞，只好跑到咖啡店里}}</td></tr>
<tr><td>End</td><td>{{后来雨停了，我们才回家}}</td></tr><tr><td>Feeling</td><td>{{很有意思}}</td></tr>
</tbody></table>
<h4>Words that move the story</h4>
<ul><li>Beginning: {{有一天}}, {{那天}}, {{上个星期}}.</li><li>Turn: {{突然}} suddenly, {{可是}}, {{没想到}} unexpectedly.</li><li>Result: {{结果}} as a result, {{于是}}, {{终于}} finally, {{只好}} had no choice but.</li><li>Ending: {{后来}}, {{最后}}, {{这件事让我知道……}}</li></ul>
<div class="callout"><p lang="zh">上个星期天，我和朋友去河边骑自行车。我们骑了一个小时，突然下起雨来了。我们没带雨伞，只好跑到一家咖啡店里。后来雨停了，我们才回家。这一天虽然被雨淋了，但是很有意思。</p>
<p>Shàng ge xīngqītiān, wǒ hé péngyou qù hébiān qí zìxíngchē. Wǒmen qí le yí gè xiǎoshí, tūrán xià qǐ yǔ lái le. Wǒmen méi dài yǔsǎn, zhǐhǎo pǎo dào yì jiā kāfēidiàn li. Hòulái yǔ tíng le, wǒmen cái huí jiā. Zhè yì tiān suīrán bèi yǔ lín le, dànshì hěn yǒu yìsi.</p>
<p>Last Sunday a friend and I rode bicycles by the river. After riding an hour, it suddenly began to rain. We had not brought umbrellas, so we had to run into a café. Later the rain stopped and only then did we go home. Although we got rained on, the day was very interesting.</p></div>
<p>Analysis: six slots in six sentences; connectors {{突然}}, {{只好}}, {{后来}}, {{虽然……但是……}}; tense markers {{了}} on each completed event; {{才}} shows that going home came late.</p>`,
        bVI: `<p>Bài kể chuyện trả lời sáu câu hỏi: <strong>khi nào, ở đâu, ai, chuyện gì xảy ra, kết thúc ra sao, bạn cảm thấy thế nào</strong>. Lập mỗi ô bằng một cụm trước khi viết.</p>
<table><thead><tr><th>Ô</th><th>Cụm</th></tr></thead><tbody>
<tr><td>Khi nào</td><td>{{上个星期天}}</td></tr><tr><td>Ở đâu / ai</td><td>{{我和朋友去河边骑自行车}}</td></tr>
<tr><td>Chuyện gì</td><td>{{突然下起雨来了}}</td></tr><tr><td>Bước ngoặt</td><td>{{没带雨伞，只好跑到咖啡店里}}</td></tr>
<tr><td>Kết thúc</td><td>{{后来雨停了，我们才回家}}</td></tr><tr><td>Cảm nghĩ</td><td>{{很有意思}}</td></tr>
</tbody></table>
<h4>Từ đẩy câu chuyện đi</h4>
<ul><li>Mở đầu: {{有一天}}, {{那天}}, {{上个星期}}.</li><li>Bước ngoặt: {{突然}} bỗng, {{可是}}, {{没想到}} không ngờ.</li><li>Kết quả: {{结果}} kết quả là, {{于是}}, {{终于}} cuối cùng, {{只好}} đành phải.</li><li>Kết: {{后来}}, {{最后}}, {{这件事让我知道……}}</li></ul>
<div class="callout"><p lang="zh">上个星期天，我和朋友去河边骑自行车。我们骑了一个小时，突然下起雨来了。我们没带雨伞，只好跑到一家咖啡店里。后来雨停了，我们才回家。这一天虽然被雨淋了，但是很有意思。</p>
<p>Shàng ge xīngqītiān, wǒ hé péngyou qù hébiān qí zìxíngchē. Wǒmen qí le yí gè xiǎoshí, tūrán xià qǐ yǔ lái le. Wǒmen méi dài yǔsǎn, zhǐhǎo pǎo dào yì jiā kāfēidiàn li. Hòulái yǔ tíng le, wǒmen cái huí jiā. Zhè yì tiān suīrán bèi yǔ lín le, dànshì hěn yǒu yìsi.</p>
<p>Chủ nhật tuần trước, tôi và bạn đi xe đạp bên bờ sông. Đạp được một tiếng thì bỗng trời đổ mưa. Chúng tôi không mang ô nên đành chạy vào một quán cà phê. Sau đó mưa tạnh, chúng tôi mới về nhà. Hôm đó tuy bị mưa ướt nhưng rất thú vị.</p></div>
<p>Phân tích: sáu ô trong sáu câu; từ nối {{突然}}, {{只好}}, {{后来}}, {{虽然……但是……}}; {{了}} đánh dấu mỗi sự việc đã xong; {{才}} cho thấy việc về nhà đến muộn.</p>`,
        tab: [['骑', 'qí', 'ride', 'đi (xe đạp, ngựa)'], ['自行车', 'zìxíngchē', 'bicycle', 'xe đạp'], ['突然', 'tūrán', 'suddenly', 'đột nhiên'], ['雨伞', 'yǔsǎn', 'umbrella', 'ô, dù'], ['只好', 'zhǐhǎo', 'have to', 'đành phải'], ['咖啡店', 'kāfēidiàn', 'café', 'quán cà phê'], ['淋', 'lín', 'get soaked', 'bị ướt']],
        mEN: 'Telling the story in the present tense with no markers, or adding {{了}} to every verb. Use {{了}} for the key events, and sentence-final {{了}} only when a new situation begins ({{下雨了}}).',
        mVI: 'Kể chuyện ở thì hiện tại không có dấu hiệu, hoặc thêm {{了}} vào mọi động từ. Dùng {{了}} cho sự việc then chốt, và {{了}} cuối câu chỉ khi bắt đầu tình huống mới ({{下雨了}}).',
        sEN: ['Six slots: when, where/who, what, turn, end, feeling', 'Use {{突然 只好 后来 终于}} to move on', '{{了}} on key events only'],
        sVI: ['Sáu ô: khi nào, đâu/ai, chuyện gì, bước ngoặt, kết, cảm nghĩ', 'Dùng {{突然 只好 后来 终于}} để đẩy câu chuyện', '{{了}} chỉ cho sự việc then chốt'],
        lk: [U.le, U.caijiu, U.duch],
        p: [
          ['Which word means “suddenly”?', '{{突然}}', 'Từ nào nghĩa “đột nhiên”?', '{{突然}}'],
          ['Add a turning point: {{我们去公园玩儿。______。}}', 'E.g. {{突然下雨了。}}', 'Thêm bước ngoặt: {{我们去公园玩儿。______。}}', 'Ví dụ {{突然下雨了。}}'],
          ['Write an ending feeling in one sentence.', 'E.g. {{这一天虽然很累，但是我很高兴。}}', 'Viết một câu kết về cảm xúc.', 'Ví dụ {{这一天虽然很累，但是我很高兴。}}'],
        ],
      }),
    L('crw201-ts-8-2', '8.2 Describing a person and a place|||8.2 Miêu tả người và nơi chốn',
      'Từ vựng ngoại hình, tính cách, vị trí; mẫu 又…又…, 有…, 离…近; bài mẫu.',
      {
        gEN: ['Describe appearance and personality', 'Describe a place from general to detail', 'Give a reason or example for each trait'],
        gVI: ['Miêu tả ngoại hình và tính cách', 'Miêu tả nơi chốn từ khái quát đến chi tiết', 'Nêu lý do hoặc ví dụ cho mỗi nét'],
        bEN: `<h4>A person</h4>
<p>Order: <strong>identity → looks → character → evidence → feeling</strong>.</p>
<ul><li>Looks: {{个子很高 / 不高}}, {{头发长长的 / 短短的}}, {{眼睛很大}}, {{又高又瘦}}.</li>
<li>Character: {{热情}} warm, {{安静}} quiet, {{聪明}} clever, {{认真}} serious, {{爱笑}} likes to laugh.</li>
<li>Evidence: {{他学习又认真又努力，所以成绩很好。}}</li></ul>
<div class="callout"><p lang="zh">我的同桌叫小张，个子不高，头发短短的，眼睛很大。他很爱笑，对人也很热情。他学习又认真又努力，所以成绩很好。我很喜欢和他做朋友。</p>
<p>Wǒ de tóngzhuō jiào Xiǎo Zhāng, gèzi bù gāo, tóufa duǎnduǎn de, yǎnjing hěn dà. Tā hěn ài xiào, duì rén yě hěn rèqíng. Tā xuéxí yòu rènzhēn yòu nǔlì, suǒyǐ chéngjì hěn hǎo. Wǒ hěn xǐhuan hé tā zuò péngyou.</p>
<p>My deskmate is called Xiao Zhang. He is not tall, has short hair and big eyes. He loves to laugh and is warm to people. He is both serious and hard-working in his studies, so his grades are good. I like being his friend.</p></div>
<h4>A place</h4>
<p>Order: <strong>where it is → big picture → details → what people do there</strong>. Location words: {{在……的东边}}, {{离……很近 / 很远}}, {{旁边}}, {{前面}}, {{附近}}; existence: {{有}}, {{是}}.</p>
<div class="callout"><p lang="zh">我的学校在城市的东边，离我家不远。校门口有一棵很大的树，旁边是一家小书店。教学楼前面有一个操场，早上有很多同学在那儿跑步。</p>
<p>Wǒ de xuéxiào zài chéngshì de dōngbian, lí wǒ jiā bù yuǎn. Xiàoménkǒu yǒu yì kē hěn dà de shù, pángbiān shì yì jiā xiǎo shūdiàn. Jiàoxuélóu qiánmiàn yǒu yí gè cāochǎng, zǎoshang yǒu hěn duō tóngxué zài nàr pǎobù.</p>
<p>My school is in the east of the city, not far from my home. At the school gate there is a very large tree, and beside it is a small bookshop. In front of the teaching building is a sports ground, where many students run in the morning.</p></div>
<p>Notice the difference between {{有}} (existence: “there is a tree”) and {{是}} (identity: “next to it is a bookshop”).</p>`,
        bVI: `<h4>Một người</h4>
<p>Trật tự: <strong>danh tính → ngoại hình → tính cách → dẫn chứng → cảm nghĩ</strong>.</p>
<ul><li>Ngoại hình: {{个子很高 / 不高}}, {{头发长长的 / 短短的}}, {{眼睛很大}}, {{又高又瘦}}.</li>
<li>Tính cách: {{热情}} nhiệt tình, {{安静}} trầm lặng, {{聪明}} thông minh, {{认真}} nghiêm túc, {{爱笑}} hay cười.</li>
<li>Dẫn chứng: {{他学习又认真又努力，所以成绩很好。}}</li></ul>
<div class="callout"><p lang="zh">我的同桌叫小张，个子不高，头发短短的，眼睛很大。他很爱笑，对人也很热情。他学习又认真又努力，所以成绩很好。我很喜欢和他做朋友。</p>
<p>Wǒ de tóngzhuō jiào Xiǎo Zhāng, gèzi bù gāo, tóufa duǎnduǎn de, yǎnjing hěn dà. Tā hěn ài xiào, duì rén yě hěn rèqíng. Tā xuéxí yòu rènzhēn yòu nǔlì, suǒyǐ chéngjì hěn hǎo. Wǒ hěn xǐhuan hé tā zuò péngyou.</p>
<p>Bạn cùng bàn của tôi tên Tiểu Trương, không cao, tóc ngắn, mắt to. Cậu ấy hay cười và nhiệt tình với mọi người. Cậu học vừa nghiêm túc vừa chăm chỉ nên thành tích rất tốt. Tôi rất thích làm bạn với cậu ấy.</p></div>
<h4>Một nơi chốn</h4>
<p>Trật tự: <strong>ở đâu → bức tranh chung → chi tiết → người ta làm gì ở đó</strong>. Từ chỉ vị trí: {{在……的东边}}, {{离……很近 / 很远}}, {{旁边}}, {{前面}}, {{附近}}; sự tồn tại: {{有}}, {{是}}.</p>
<div class="callout"><p lang="zh">我的学校在城市的东边，离我家不远。校门口有一棵很大的树，旁边是一家小书店。教学楼前面有一个操场，早上有很多同学在那儿跑步。</p>
<p>Wǒ de xuéxiào zài chéngshì de dōngbian, lí wǒ jiā bù yuǎn. Xiàoménkǒu yǒu yì kē hěn dà de shù, pángbiān shì yì jiā xiǎo shūdiàn. Jiàoxuélóu qiánmiàn yǒu yí gè cāochǎng, zǎoshang yǒu hěn duō tóngxué zài nàr pǎobù.</p>
<p>Trường tôi ở phía đông thành phố, cách nhà không xa. Ở cổng trường có một cái cây rất to, bên cạnh là một hiệu sách nhỏ. Phía trước toà nhà học có một sân vận động, buổi sáng nhiều bạn chạy bộ ở đó.</p></div>
<p>Chú ý khác biệt giữa {{有}} (tồn tại: “có một cái cây”) và {{是}} (đồng nhất: “bên cạnh là một hiệu sách”).</p>`,
        tab: [['同桌', 'tóngzhuō', 'deskmate', 'bạn cùng bàn'], ['个子', 'gèzi', 'height, build', 'vóc dáng, chiều cao'], ['头发', 'tóufa', 'hair', 'tóc'], ['热情', 'rèqíng', 'warm, enthusiastic', 'nhiệt tình'], ['成绩', 'chéngjì', 'grades, results', 'thành tích, điểm'], ['附近', 'fùjìn', 'nearby', 'gần đây'], ['操场', 'cāochǎng', 'sports ground', 'sân vận động']],
        mEN: 'Listing adjectives with no evidence ({{他很好，很聪明，很热情}}). Add one example: why is he warm, what did he do? Also mixing {{有}} and {{是}}: {{旁边有是书店}} is wrong.',
        mVI: 'Liệt kê tính từ mà không có dẫn chứng ({{他很好，很聪明，很热情}}). Hãy thêm một ví dụ: vì sao cậu ấy nhiệt tình, cậu ấy đã làm gì? Cũng lẫn {{有}} và {{是}}: {{旁边有是书店}} là sai.',
        sEN: ['Person: identity, looks, character, evidence', 'Place: where, overview, details, activity', '{{有}} existence, {{是}} identity'],
        sVI: ['Người: danh tính, ngoại hình, tính cách, dẫn chứng', 'Nơi chốn: ở đâu, tổng quát, chi tiết, hoạt động', '{{有}} tồn tại, {{是}} đồng nhất'],
        lk: [U.gram3, U.mdbg, U.hsk3],
        p: [
          ['Describe your mother in two sentences.', 'E.g. {{我妈妈个子不高，头发很长。她很热情，常常帮助邻居。}}', 'Miêu tả mẹ bạn trong hai câu.', 'Ví dụ {{我妈妈个子不高，头发很长。她很热情，常常帮助邻居。}}'],
          ['Say: “There is a library beside the park.”', '{{公园旁边有一个图书馆。}}', 'Nói: “Bên cạnh công viên có một thư viện.”', '{{公园旁边有一个图书馆。}}'],
          ['What does {{又……又……}} do?', 'Joins two qualities: {{又高又瘦}}.', '{{又……又……}} dùng làm gì?', 'Nối hai đặc điểm: {{又高又瘦}}.'],
        ],
      }),
    L('crw201-ts-8-3', '8.3 Writing from prompts and pictures|||8.3 Viết theo gợi ý và tranh',
      'Dạng bài HSK 3: viết câu theo tranh và từ cho trước; năm bước xây câu; viết một đoạn từ ba từ.',
      {
        gEN: ['Build a sentence from a picture and a given word', 'Apply a five-step routine', 'Write a short paragraph with three given words'],
        gVI: ['Xây câu từ một bức tranh và từ cho trước', 'Áp dụng quy trình năm bước', 'Viết đoạn ngắn với ba từ cho trước'],
        bEN: `<p>HSK-style writing tasks give you a picture and a word, and ask for a complete sentence. The sentence must use the word and fit the picture. The same skill works for a paragraph prompt with three words.</p>
<h4>Five-step routine</h4>
<ol><li><strong>Who?</strong> Name the people or things in the picture.</li>
<li><strong>Where / when?</strong> Add the place or time word.</li>
<li><strong>What are they doing?</strong> Choose the verb.</li>
<li><strong>Fit the given word</strong> into the right slot (noun, verb or adjective).</li>
<li><strong>Check:</strong> complete sentence, correct order, punctuation.</li></ol>
<table><thead><tr><th>Picture (described)</th><th>Word</th><th>Sentence</th></tr></thead><tbody>
<tr><td>A boy reading in a library</td><td>{{图书馆}}</td><td>{{他在图书馆看书。}}</td></tr>
<tr><td>A woman with an umbrella in the rain</td><td>{{雨伞}}</td><td>{{下雨了，她打着雨伞回家。}}</td></tr>
<tr><td>Two friends eating noodles</td><td>{{面条}}</td><td>{{他们俩一起吃面条，吃得很高兴。}}</td></tr>
<tr><td>A girl waiting at a station</td><td>{{等}}</td><td>{{她在车站等朋友。}}</td></tr>
</tbody></table>
<h4>Using three words in a paragraph</h4>
<p>Prompt: {{周末 / 朋友 / 高兴}}. Think of one story that uses all three, then write 2–3 sentences.</p>
<div class="callout"><p lang="zh">周末我和朋友一起去公园玩儿。我们打了球，还拍了很多照片。大家都玩儿得很高兴。</p><p>Zhōumò wǒ hé péngyou yìqǐ qù gōngyuán wánr. Wǒmen dǎ le qiú, hái pāi le hěn duō zhàopiàn. Dàjiā dōu wánr de hěn gāoxìng.</p><p>At the weekend a friend and I went to the park to play. We played ball and took many photos. Everyone had a very happy time.</p></div>
<p>All three words are used: {{周末}} (time), {{朋友}} (companion), {{高兴}} (complement). The extra sentence {{还拍了很多照片}} is detail, not new vocabulary.</p>`,
        bVI: `<p>Bài viết kiểu HSK cho một bức tranh và một từ rồi yêu cầu viết câu hoàn chỉnh. Câu phải dùng từ đó và phù hợp tranh. Kỹ năng này cũng dùng cho đề viết đoạn có ba từ.</p>
<h4>Quy trình năm bước</h4>
<ol><li><strong>Ai?</strong> Gọi tên người hoặc vật trong tranh.</li>
<li><strong>Ở đâu / khi nào?</strong> Thêm từ chỉ nơi chốn hoặc thời gian.</li>
<li><strong>Họ đang làm gì?</strong> Chọn động từ.</li>
<li><strong>Đặt từ cho sẵn</strong> vào đúng chỗ (danh từ, động từ hay tính từ).</li>
<li><strong>Kiểm:</strong> câu trọn vẹn, đúng trật tự, đúng dấu câu.</li></ol>
<table><thead><tr><th>Tranh (mô tả)</th><th>Từ</th><th>Câu</th></tr></thead><tbody>
<tr><td>Cậu bé đọc sách trong thư viện</td><td>{{图书馆}}</td><td>{{他在图书馆看书。}}</td></tr>
<tr><td>Người phụ nữ che ô dưới mưa</td><td>{{雨伞}}</td><td>{{下雨了，她打着雨伞回家。}}</td></tr>
<tr><td>Hai bạn ăn mì</td><td>{{面条}}</td><td>{{他们俩一起吃面条，吃得很高兴。}}</td></tr>
<tr><td>Cô gái đợi ở nhà ga</td><td>{{等}}</td><td>{{她在车站等朋友。}}</td></tr>
</tbody></table>
<h4>Dùng ba từ trong một đoạn</h4>
<p>Đề: {{周末 / 朋友 / 高兴}}. Nghĩ một câu chuyện dùng cả ba từ rồi viết 2–3 câu.</p>
<div class="callout"><p lang="zh">周末我和朋友一起去公园玩儿。我们打了球，还拍了很多照片。大家都玩儿得很高兴。</p><p>Zhōumò wǒ hé péngyou yìqǐ qù gōngyuán wánr. Wǒmen dǎ le qiú, hái pāi le hěn duō zhàopiàn. Dàjiā dōu wánr de hěn gāoxìng.</p><p>Cuối tuần tôi và bạn cùng ra công viên chơi. Chúng tôi chơi bóng, còn chụp nhiều ảnh. Mọi người đều chơi rất vui.</p></div>
<p>Cả ba từ đều được dùng: {{周末}} (thời gian), {{朋友}} (người cùng), {{高兴}} (bổ ngữ). Câu {{还拍了很多照片}} chỉ là chi tiết, không phải từ mới.</p>`,
        tab: [['面条', 'miàntiáo', 'noodles', 'mì sợi'], ['车站', 'chēzhàn', 'station', 'nhà ga, bến xe'], ['拍', 'pāi', 'take (photo); clap', 'chụp; vỗ'], ['照片', 'zhàopiàn', 'photo', 'ảnh'], ['大家', 'dàjiā', 'everyone', 'mọi người'], ['打着', 'dǎ zhe', 'holding (umbrella)', 'đang che (ô)'], ['俩', 'liǎ', 'the two of', 'hai (người)']],
        mEN: 'Writing a phrase and not a sentence ({{在图书馆的男孩}}), or ignoring the picture. A sentence needs a verb and must match what is shown. Another trap is changing the given word to a near-synonym; use the word exactly as given.',
        mVI: 'Viết một cụm mà không phải câu ({{在图书馆的男孩}}), hoặc bỏ qua tranh. Câu cần có động từ và phải khớp với hình. Một bẫy khác là đổi từ cho sẵn sang từ gần nghĩa; hãy dùng đúng từ đã cho.',
        sEN: ['Five steps: who, where/when, doing what, the given word, check', 'A sentence needs a verb and must fit the picture', 'Use the given word exactly'],
        sVI: ['Năm bước: ai, đâu/khi nào, làm gì, từ cho sẵn, kiểm', 'Câu cần động từ và phải khớp tranh', 'Dùng đúng từ đã cho'],
        lk: [U.hskc, U.hskw, U.hsk3],
        p: [
          ['Picture: a cat sleeping on a sofa. Word: {{沙发}}. Write one sentence.', '{{猫在沙发上睡觉。}}', 'Tranh: con mèo ngủ trên ghế sofa. Từ: {{沙发}}. Viết một câu.', '{{猫在沙发上睡觉。}}'],
          ['Use {{银行 / 钱 / 取}} in two sentences.', 'E.g. {{我去银行取钱。银行里的人很多。}}', 'Dùng {{银行 / 钱 / 取}} trong hai câu.', 'Ví dụ {{我去银行取钱。银行里的人很多。}}'],
          ['Name the first step of the routine.', 'Identify who or what is in the picture.', 'Nêu bước đầu của quy trình.', 'Xác định ai hoặc cái gì trong tranh.'],
        ],
      }),
    L('crw201-ts-8-4', '8.4 Giving an opinion with reasons|||8.4 Nêu ý kiến có lý do',
      'Khung ý kiến – lý do 1 – lý do 2 – ví dụ – kết luận; câu 我觉得, 因为, 比如, 所以.',
      {
        gEN: ['Open with a clear opinion', 'Support with two reasons and an example', 'Close with a conclusion'],
        gVI: ['Mở đầu bằng ý kiến rõ ràng', 'Hỗ trợ bằng hai lý do và một ví dụ', 'Kết bằng kết luận'],
        bEN: `<p>An opinion paragraph has a clear skeleton. It is not enough to say “I like it”; you need <em>why</em>.</p>
<div class="formula"><span class="lbl">Skeleton</span>Opinion → Reason 1 → Reason 2 → Example → Conclusion</div>
<ul><li>Opinion: {{我觉得……}} / {{我认为……}} / {{我喜欢……}} / {{我同意……}} / {{我不同意……}}</li>
<li>Reasons: {{第一……，第二……}} / {{因为……}}</li>
<li>Example: {{比如……}} / {{例如……}}</li>
<li>Conclusion: {{所以我觉得……}}</li></ul>
<div class="callout"><p lang="zh">我喜欢住在城市。第一，城市里的交通很方便，坐地铁就可以去很多地方。第二，城市里工作机会多。比如，我哥哥在城市里很容易就找到了工作。所以我觉得城市生活更好。</p>
<p>Wǒ xǐhuan zhù zài chéngshì. Dì yī, chéngshì li de jiāotōng hěn fāngbiàn, zuò dìtiě jiù kěyǐ qù hěn duō dìfang. Dì èr, chéngshì li gōngzuò jīhuì duō. Bǐrú, wǒ gēge zài chéngshì li hěn róngyì jiù zhǎodào le gōngzuò. Suǒyǐ wǒ juéde chéngshì shēnghuó gèng hǎo.</p>
<p>I like living in a city. First, transport in the city is convenient; you can go to many places by metro. Second, there are many job opportunities in the city. For example, my brother found a job easily in the city. So I think city life is better.</p></div>
<h4>Showing the other view</h4>
<p>Even at this level you can add a contrast: {{当然，农村的空气比城市好，但是我还是喜欢城市。}} “Of course the air in the countryside is better than in the city, but I still like the city.” This shows balance and uses {{但是}} correctly.</p>
<h4>Common errors</h4>
<ul><li>{{我觉得很好}} with no reason. Always add {{因为……}}.</li><li>{{第一}} without {{第二}}. Provide at least two.</li><li>{{比如}} followed by a sentence that does not support the point.</li></ul>`,
        bVI: `<p>Đoạn nêu ý kiến có bộ khung rõ ràng. Chỉ nói “tôi thích” là chưa đủ; cần có <em>vì sao</em>.</p>
<div class="formula"><span class="lbl">Bộ khung</span>Ý kiến → Lý do 1 → Lý do 2 → Ví dụ → Kết luận</div>
<ul><li>Ý kiến: {{我觉得……}} / {{我认为……}} / {{我喜欢……}} / {{我同意……}} / {{我不同意……}}</li>
<li>Lý do: {{第一……，第二……}} / {{因为……}}</li>
<li>Ví dụ: {{比如……}} / {{例如……}}</li>
<li>Kết luận: {{所以我觉得……}}</li></ul>
<div class="callout"><p lang="zh">我喜欢住在城市。第一，城市里的交通很方便，坐地铁就可以去很多地方。第二，城市里工作机会多。比如，我哥哥在城市里很容易就找到了工作。所以我觉得城市生活更好。</p>
<p>Wǒ xǐhuan zhù zài chéngshì. Dì yī, chéngshì li de jiāotōng hěn fāngbiàn, zuò dìtiě jiù kěyǐ qù hěn duō dìfang. Dì èr, chéngshì li gōngzuò jīhuì duō. Bǐrú, wǒ gēge zài chéngshì li hěn róngyì jiù zhǎodào le gōngzuò. Suǒyǐ wǒ juéde chéngshì shēnghuó gèng hǎo.</p>
<p>Tôi thích sống ở thành phố. Thứ nhất, giao thông trong thành phố tiện lợi, đi tàu điện ngầm là đến được nhiều nơi. Thứ hai, thành phố có nhiều cơ hội việc làm. Ví dụ anh trai tôi tìm được việc rất dễ ở thành phố. Vì vậy tôi cho rằng cuộc sống thành phố tốt hơn.</p></div>
<h4>Cho thấy quan điểm đối lập</h4>
<p>Ngay ở trình độ này bạn cũng có thể thêm đối lập: {{当然，农村的空气比城市好，但是我还是喜欢城市。}} “Dĩ nhiên không khí nông thôn tốt hơn thành phố, nhưng tôi vẫn thích thành phố.” Cách này cho thấy sự cân bằng và dùng {{但是}} đúng.</p>
<h4>Lỗi thường gặp</h4>
<ul><li>{{我觉得很好}} mà không có lý do. Luôn thêm {{因为……}}.</li><li>{{第一}} mà không có {{第二}}. Cho ít nhất hai ý.</li><li>{{比如}} mà câu sau không hỗ trợ ý chính.</li></ul>`,
        tab: [['觉得', 'juéde', 'feel, think', 'cảm thấy, cho rằng'], ['认为', 'rènwéi', 'consider, think', 'cho rằng'], ['交通', 'jiāotōng', 'transport', 'giao thông'], ['地铁', 'dìtiě', 'metro', 'tàu điện ngầm'], ['机会', 'jīhuì', 'opportunity', 'cơ hội'], ['比如', 'bǐrú', 'for example', 'ví dụ'], ['容易', 'róngyì', 'easy', 'dễ']],
        mEN: 'Writing {{我觉得城市是好的因为好}} (circular reasoning). Give concrete reasons: transport, jobs, food, safety.',
        mVI: 'Viết {{我觉得城市是好的因为好}} (lập luận vòng tròn). Hãy nêu lý do cụ thể: giao thông, việc làm, ăn uống, an toàn.',
        sEN: ['Opinion, two reasons, example, conclusion', 'Use {{第一…第二…}} and {{比如}}', 'Add a contrast with {{当然……但是……}} for balance'],
        sVI: ['Ý kiến, hai lý do, ví dụ, kết luận', 'Dùng {{第一…第二…}} và {{比如}}', 'Thêm đối lập {{当然……但是……}} để cân bằng'],
        lk: [U.budan, U.gram3, U.duch],
        p: [
          ['Give two reasons why you study Chinese (in Chinese).', 'E.g. {{第一，我想去中国旅游。第二，学汉语对工作有帮助。}}', 'Nêu hai lý do bạn học tiếng Hán (bằng tiếng Trung).', 'Ví dụ {{第一，我想去中国旅游。第二，学汉语对工作有帮助。}}'],
          ['What does {{比如}} introduce?', 'An example.', '{{比如}} mở đầu cho gì?', 'Một ví dụ.'],
          ['Add a contrast: {{我喜欢夏天。}}', '{{当然，夏天很热，但是我还是喜欢夏天。}}', 'Thêm đối lập: {{我喜欢夏天。}}', '{{当然，夏天很热，但是我还是喜欢夏天。}}'],
        ],
      }),
    QZ(8, 'Quiz 8 — Short essays|||Quiz 8 — Bài văn ngắn', 'Kiểm tra khung kể chuyện, miêu tả, viết theo gợi ý và nêu ý kiến.', [
      Q('q1', 'A narrative answers…', 'Bài kể chuyện trả lời…', ['when, where, who, what, end, feeling|||khi nào, đâu, ai, gì, kết, cảm nghĩ', 'only who|||chỉ ai', 'only where|||chỉ ở đâu', 'only why|||chỉ vì sao'], 0, 'Six slots.', 'Sáu ô.'),
      Q('q2', '“Suddenly” is…', '“Đột nhiên” là…', ['{{突然}}', '{{然后}}', '{{所以}}', '{{一直}}'], 0, '{{突然}} tūrán.', '{{突然}} tūrán.'),
      Q('q3', 'Which describes existence?', 'Câu nào chỉ sự tồn tại?', ['{{旁边有一家书店。}}', '{{旁边是有书店。}}', '{{旁边书店有。}}', '{{有旁边书店。}}'], 0, '{{有}} = there is.', '{{有}} = có.'),
      Q('q4', '{{又高又瘦}} means…', '{{又高又瘦}} nghĩa là…', ['both tall and thin|||vừa cao vừa gầy', 'not tall|||không cao', 'tall then thin|||cao rồi gầy', 'short and thin|||thấp và gầy'], 0, '{{又……又……}} joins two qualities.', '{{又……又……}} nối hai đặc điểm.'),
      Q('q5', 'Picture task: the sentence must…', 'Bài tranh: câu phải…', ['use the given word and fit the picture|||dùng từ cho sẵn và khớp tranh', 'be a phrase|||là một cụm', 'ignore the word|||bỏ qua từ', 'have no verb|||không có động từ'], 0, 'Both conditions.', 'Cả hai điều kiện.'),
      Q('q6', 'Which introduces an example?', 'Từ nào mở đầu ví dụ?', ['{{比如}}', '{{所以}}', '{{但是}}', '{{如果}}'], 0, '{{比如}} = for example.', '{{比如}} = ví dụ.'),
      Q('q7', 'An opinion paragraph needs…', 'Đoạn nêu ý kiến cần…', ['at least two reasons|||ít nhất hai lý do', 'only a feeling|||chỉ cảm xúc', 'no conclusion|||không kết luận', 'no example|||không ví dụ'], 0, 'Opinion, reasons, example, conclusion.', 'Ý kiến, lý do, ví dụ, kết luận.'),
      Q('q8', 'How long is a short essay at this level?', 'Bài văn ngắn ở trình độ này dài bao nhiêu?', ['80–120 characters|||80–120 chữ', '10 characters|||10 chữ', '500 characters|||500 chữ', '1000 characters|||1000 chữ'], 0, 'Course target.', 'Mục tiêu môn học.'),
    ]),
  ],
};

// ───────────────────────────── Chương 9 ─────────────────────────────
const c9 = {
  title: 'Chapter 9 — Exam tasks, proofreading and final project|||Chương 9 — Dạng bài thi, soát lỗi và dự án cuối khoá',
  description: 'Dạng đề đọc–viết HSK 3, quy trình tự soát bài, kế hoạch ôn và dự án hồ sơ cuối khoá.',
  lessons: [
    L('crw201-ts-9-1', '9.1 HSK 3 reading and writing task types|||9.1 Dạng bài đọc–viết HSK 3',
      'Cấu trúc phần đọc và viết HSK 3, mẹo làm từng dạng; lưu ý chuẩn HSK mới đang thay đổi.',
      {
        gEN: ['Know the task types of HSK 3 reading and writing', 'Use a technique for each', 'Plan time during the exam'],
        gVI: ['Biết các dạng bài đọc và viết HSK 3', 'Dùng kỹ thuật riêng cho mỗi dạng', 'Phân bổ thời gian khi thi'],
        bEN: `<div class="callout"><p>⚠️ <strong>Check the current format.</strong> The HSK is being reorganised (the newer standard has more levels). The task types below describe the widely published HSK 3 paper (about 30 reading questions in about 30 minutes, 10 writing questions in about 15 minutes). Always confirm on <a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">the official site</a> before you register; your lecturer decides what is used in class.</p></div>
<h4>Reading</h4>
<ol><li><strong>Match sentences</strong> — a question sentence on one side and answer sentences on the other. Technique: find the key word ({{什么时候}} → a time; {{为什么}} → {{因为}}).</li>
<li><strong>Fill in the blank</strong> — choose from six words for sentences with a blank. Technique: decide the word class first (verb, noun, measure word) from the grammar around the blank.</li>
<li><strong>Passages</strong> — a short text with a true/false or multiple-choice question. Technique: three-pass reading from chapter 1.</li></ol>
<h4>Writing</h4>
<ol><li><strong>Rearrange words into a sentence</strong> — Example: {{把 / 我 / 作业 / 写完了}} → {{我把作业写完了。}} Technique: find the verb, then subject, then time/place, then object.</li>
<li><strong>Write the missing character</strong> — the pinyin is given, and you write the hanzi. Example: {{他每天早上六点起 (chuáng)。}} → {{床}}.</li></ol>
<table><thead><tr><th>Item</th><th>Answer</th><th>Why</th></tr></thead><tbody>
<tr><td>{{我 / 昨天 / 买了 / 一件 / 衣服}}</td><td>{{我昨天买了一件衣服。}}</td><td>time before the verb</td></tr>
<tr><td>{{大 / 苹果 / 很 / 这个}}</td><td>{{这个苹果很大。}}</td><td>subject + {{很}} + adjective</td></tr>
<tr><td>{{我家的狗很可 (ài)。}}</td><td>{{爱}}</td><td>{{可爱}} cute</td></tr>
<tr><td>{{请把门 (guān) 上。}}</td><td>{{关}}</td><td>{{把门关上}}</td></tr>
</tbody></table>
<h4>Time plan</h4>
<p>Reading: about one minute a question, with passages taking longer. Skip a hard item, mark it and come back. Writing: check characters last — one wrong stroke loses the point.</p>`,
        bVI: `<div class="callout"><p>⚠️ <strong>Kiểm tra định dạng hiện hành.</strong> HSK đang được tái cấu trúc (chuẩn mới có nhiều cấp hơn). Các dạng bài dưới đây mô tả đề HSK 3 được công bố rộng rãi (khoảng 30 câu đọc trong khoảng 30 phút, 10 câu viết trong khoảng 15 phút). Hãy luôn xác nhận trên <a href="https://www.chinesetest.cn/" target="_blank" rel="noopener">trang chính thức</a> trước khi đăng ký; giảng viên quyết định cách dùng trong lớp.</p></div>
<h4>Đọc</h4>
<ol><li><strong>Ghép câu</strong> — một bên là câu hỏi, bên kia là các câu trả lời. Kỹ thuật: tìm từ khoá ({{什么时候}} → thời gian; {{为什么}} → {{因为}}).</li>
<li><strong>Điền chỗ trống</strong> — chọn trong sáu từ cho câu có chỗ trống. Kỹ thuật: xác định từ loại trước (động từ, danh từ, lượng từ) dựa vào ngữ pháp quanh chỗ trống.</li>
<li><strong>Đoạn văn</strong> — văn bản ngắn với câu đúng/sai hoặc trắc nghiệm. Kỹ thuật: đọc ba lượt ở chương 1.</li></ol>
<h4>Viết</h4>
<ol><li><strong>Sắp xếp từ thành câu</strong> — Ví dụ: {{把 / 我 / 作业 / 写完了}} → {{我把作业写完了。}} Kỹ thuật: tìm động từ, rồi chủ ngữ, rồi thời gian/nơi chốn, rồi tân ngữ.</li>
<li><strong>Viết chữ còn thiếu</strong> — cho sẵn pinyin, bạn viết chữ Hán. Ví dụ: {{他每天早上六点起 (chuáng)。}} → {{床}}.</li></ol>
<table><thead><tr><th>Câu</th><th>Đáp án</th><th>Vì sao</th></tr></thead><tbody>
<tr><td>{{我 / 昨天 / 买了 / 一件 / 衣服}}</td><td>{{我昨天买了一件衣服。}}</td><td>thời gian trước động từ</td></tr>
<tr><td>{{大 / 苹果 / 很 / 这个}}</td><td>{{这个苹果很大。}}</td><td>chủ ngữ + {{很}} + tính từ</td></tr>
<tr><td>{{我家的狗很可 (ài)。}}</td><td>{{爱}}</td><td>{{可爱}} dễ thương</td></tr>
<tr><td>{{请把门 (guān) 上。}}</td><td>{{关}}</td><td>{{把门关上}}</td></tr>
</tbody></table>
<h4>Phân bổ thời gian</h4>
<p>Đọc: khoảng một phút mỗi câu, đoạn văn cần lâu hơn. Câu khó thì đánh dấu rồi quay lại. Viết: kiểm tra chữ ở cuối — sai một nét là mất điểm.</p>`,
        tab: [['可爱', 'kě\'ài', 'cute, lovable', 'dễ thương'], ['关', 'guān', 'close', 'đóng'], ['起床', 'qǐchuáng', 'get up', 'thức dậy'], ['填', 'tián', 'fill in', 'điền'], ['排列', 'páiliè', 'arrange', 'sắp xếp'], ['答案', 'dá\'àn', 'answer key', 'đáp án'], ['考试', 'kǎoshì', 'exam', 'kỳ thi']],
        mEN: 'Spending too long on the passages and leaving writing to the end with no time. Also writing the pinyin instead of the hanzi in the missing-character task: only the hanzi earns the point.',
        mVI: 'Dành quá nhiều thời gian cho đoạn văn rồi để phần viết đến cuối không còn giờ. Và viết pinyin thay vì chữ Hán ở dạng điền chữ: chỉ chữ Hán mới được điểm.',
        sEN: ['Reading: match, fill, passages', 'Writing: rearrange, write the hanzi', 'Always confirm the current format on the official site'],
        sVI: ['Đọc: ghép, điền, đoạn văn', 'Viết: sắp xếp, viết chữ Hán', 'Luôn xác nhận định dạng hiện hành trên trang chính thức'],
        lk: [U.hskc, U.hskw, U.hsk3, U.gram3],
        p: [
          ['Rearrange: {{喜欢 / 我 / 苹果 / 很}}', '{{我很喜欢苹果。}}', 'Sắp xếp: {{喜欢 / 我 / 苹果 / 很}}', '{{我很喜欢苹果。}}'],
          ['Write the hanzi: {{我们一起去 (gōngyuán) 玩儿。}}', '{{公园}}', 'Viết chữ Hán: {{我们一起去 (gōngyuán) 玩儿。}}', '{{公园}}'],
          ['What do you do with a hard question in the reading part?', 'Mark it, skip it and return later.', 'Gặp câu khó phần đọc thì làm gì?', 'Đánh dấu, bỏ qua và quay lại sau.'],
        ],
      }),
    L('crw201-ts-9-2', '9.2 Proofreading: a checklist and an error log|||9.2 Soát lỗi: danh sách kiểm và sổ lỗi',
      'Bảy bước soát bài, ví dụ sửa một đoạn có sáu lỗi, cách lập sổ lỗi.',
      {
        gEN: ['Proofread in seven passes', 'Correct a paragraph with six errors', 'Keep an error log that actually reduces mistakes'],
        gVI: ['Soát bài theo bảy lượt', 'Sửa một đoạn có sáu lỗi', 'Giữ sổ lỗi thực sự giúp giảm lỗi'],
        bEN: `<p>Good writers are good editors. After you write, read the text as a stranger. Use <strong>seven passes</strong>, each looking for one kind of error.</p>
<ol><li><strong>Meaning:</strong> does each sentence say what I want?</li>
<li><strong>Word order:</strong> time, place, adverb, verb, object.</li>
<li><strong>Aspect and complements:</strong> {{了 / 过 / 着}}, {{得}} complements.</li>
<li><strong>Function words:</strong> {{的 / 得 / 地}}, {{在 / 再}}, {{把 / 被 / 比}}.</li>
<li><strong>Connectors:</strong> do pairs match? ({{虽然…但是}}, not {{虽然…所以}}).</li>
<li><strong>Characters:</strong> look-alikes and stroke slips.</li>
<li><strong>Punctuation and format:</strong> {{，。、}}, indent, date.</li></ol>
<h4>An exercise: find the six errors</h4>
<div class="callout"><p lang="zh">昨天我去商店在市中心，买了一件漂亮衣服。这件衣服比我的旧衣服很好看。我没有钱了，所以但是很高兴。回家以后，我再家里睡一个小时了。</p>
<p>Zuótiān wǒ qù shāngdiàn zài shì zhōngxīn, mǎi le yí jiàn piàoliang yīfu. Zhè jiàn yīfu bǐ wǒ de jiù yīfu hěn hǎokàn. Wǒ méiyǒu qián le, suǒyǐ dànshì hěn gāoxìng. Huí jiā yǐhòu, wǒ zài jiā li shuì yí gè xiǎoshí le.</p></div>
<table><thead><tr><th>Error</th><th>Type</th><th>Correction</th></tr></thead><tbody>
<tr><td>{{去商店在市中心}}</td><td>word order</td><td>{{在市中心的商店}}</td></tr>
<tr><td>{{漂亮衣服}}</td><td>missing {{的}}</td><td>{{漂亮的衣服}}</td></tr>
<tr><td>{{比……很好看}}</td><td>{{比}} with {{很}}</td><td>{{比……好看}}</td></tr>
<tr><td>{{所以但是}}</td><td>connector clash</td><td>{{但是}} only</td></tr>
<tr><td>{{我再家里}}</td><td>{{在 / 再}}</td><td>{{我在家里}}</td></tr>
<tr><td>{{睡一个小时了}}</td><td>duration complement</td><td>{{睡了一个小时}}</td></tr>
</tbody></table>
<div class="callout"><p lang="zh">昨天我在市中心的商店买了一件漂亮的衣服。这件衣服比我的旧衣服好看。我没有钱了，但是很高兴。回家以后，我在家里睡了一个小时。</p><p>Zuótiān wǒ zài shì zhōngxīn de shāngdiàn mǎi le yí jiàn piàoliang de yīfu. Zhè jiàn yīfu bǐ wǒ de jiù yīfu hǎokàn. Wǒ méiyǒu qián le, dànshì hěn gāoxìng. Huí jiā yǐhòu, wǒ zài jiā li shuì le yí gè xiǎoshí.</p></div>
<h4>Error log</h4>
<p>Keep a table with four columns: <strong>sentence · error type · correct form · rule/lesson</strong>. Review it before each writing task. After a month, count error types; the top two are what you drill next.</p>`,
        bVI: `<p>Người viết giỏi cũng là biên tập viên giỏi. Sau khi viết, hãy đọc bài như một người lạ. Dùng <strong>bảy lượt soát</strong>, mỗi lượt tìm một loại lỗi.</p>
<ol><li><strong>Nghĩa:</strong> mỗi câu có nói đúng điều tôi muốn không?</li>
<li><strong>Trật tự từ:</strong> thời gian, nơi chốn, phó từ, động từ, tân ngữ.</li>
<li><strong>Thể và bổ ngữ:</strong> {{了 / 过 / 着}}, bổ ngữ {{得}}.</li>
<li><strong>Hư từ:</strong> {{的 / 得 / 地}}, {{在 / 再}}, {{把 / 被 / 比}}.</li>
<li><strong>Liên từ:</strong> các cặp có khớp không? ({{虽然…但是}}, không phải {{虽然…所以}}).</li>
<li><strong>Chữ:</strong> chữ gần hình và lỗi nét.</li>
<li><strong>Dấu câu và định dạng:</strong> {{，。、}}, thụt đầu dòng, ngày.</li></ol>
<h4>Bài tập: tìm sáu lỗi</h4>
<div class="callout"><p lang="zh">昨天我去商店在市中心，买了一件漂亮衣服。这件衣服比我的旧衣服很好看。我没有钱了，所以但是很高兴。回家以后，我再家里睡一个小时了。</p>
<p>Zuótiān wǒ qù shāngdiàn zài shì zhōngxīn, mǎi le yí jiàn piàoliang yīfu. Zhè jiàn yīfu bǐ wǒ de jiù yīfu hěn hǎokàn. Wǒ méiyǒu qián le, suǒyǐ dànshì hěn gāoxìng. Huí jiā yǐhòu, wǒ zài jiā li shuì yí gè xiǎoshí le.</p></div>
<table><thead><tr><th>Lỗi</th><th>Loại</th><th>Sửa</th></tr></thead><tbody>
<tr><td>{{去商店在市中心}}</td><td>trật tự từ</td><td>{{在市中心的商店}}</td></tr>
<tr><td>{{漂亮衣服}}</td><td>thiếu {{的}}</td><td>{{漂亮的衣服}}</td></tr>
<tr><td>{{比……很好看}}</td><td>{{比}} với {{很}}</td><td>{{比……好看}}</td></tr>
<tr><td>{{所以但是}}</td><td>liên từ xung đột</td><td>chỉ {{但是}}</td></tr>
<tr><td>{{我再家里}}</td><td>{{在 / 再}}</td><td>{{我在家里}}</td></tr>
<tr><td>{{睡一个小时了}}</td><td>bổ ngữ thời lượng</td><td>{{睡了一个小时}}</td></tr>
</tbody></table>
<div class="callout"><p lang="zh">昨天我在市中心的商店买了一件漂亮的衣服。这件衣服比我的旧衣服好看。我没有钱了，但是很高兴。回家以后，我在家里睡了一个小时。</p><p>Zuótiān wǒ zài shì zhōngxīn de shāngdiàn mǎi le yí jiàn piàoliang de yīfu. Zhè jiàn yīfu bǐ wǒ de jiù yīfu hǎokàn. Wǒ méiyǒu qián le, dànshì hěn gāoxìng. Huí jiā yǐhòu, wǒ zài jiā li shuì le yí gè xiǎoshí.</p></div>
<h4>Sổ lỗi</h4>
<p>Giữ một bảng bốn cột: <strong>câu · loại lỗi · dạng đúng · quy tắc/bài học</strong>. Xem lại trước mỗi bài viết. Sau một tháng, đếm các loại lỗi; hai loại nhiều nhất là thứ bạn luyện tiếp.</p>`,
        tab: [['商店', 'shāngdiàn', 'shop', 'cửa hàng'], ['市中心', 'shì zhōngxīn', 'city centre', 'trung tâm thành phố'], ['旧', 'jiù', 'old (things)', 'cũ'], ['好看', 'hǎokàn', 'good-looking', 'đẹp mắt'], ['检查', 'jiǎnchá', 'check', 'kiểm tra'], ['错误', 'cuòwù', 'mistake', 'lỗi'], ['改正', 'gǎizhèng', 'correct', 'sửa cho đúng']],
        mEN: 'Proofreading once for everything. Your eye will skip errors. Make separate passes, and read aloud once so you hear the broken sentences.',
        mVI: 'Soát một lần cho mọi thứ. Mắt sẽ bỏ sót lỗi. Hãy soát nhiều lượt riêng và đọc to một lần để nghe ra những câu hỏng.',
        sEN: ['Seven passes, one error type each', 'Read aloud once', 'Error log: sentence, type, correction, rule'],
        sVI: ['Bảy lượt, mỗi lượt một loại lỗi', 'Đọc to một lần', 'Sổ lỗi: câu, loại, dạng đúng, quy tắc'],
        lk: [U.hanzi, U.mdbg, U.gram3],
        p: [
          ['Correct: {{我想去商店买东西在明天。}}', '{{我明天想去商店买东西。}}', 'Sửa: {{我想去商店买东西在明天。}}', '{{我明天想去商店买东西。}}'],
          ['Correct: {{他比我很忙。}}', '{{他比我忙。}}', 'Sửa: {{他比我很忙。}}', '{{他比我忙。}}'],
          ['Correct: {{我们在去明天公园。}}', '{{我们明天去公园。}}', 'Sửa: {{我们在去明天公园。}}', '{{我们明天去公园。}}'],
        ],
      }),
    L('crw201-ts-9-3', '9.3 Review plan and final project|||9.3 Kế hoạch ôn tập và dự án cuối khoá',
      'Kế hoạch ôn bốn tuần, danh sách sản phẩm hồ sơ cuối khoá và thang tự đánh giá năm tiêu chí.',
      {
        gEN: ['Plan four weeks of review', 'Assemble a portfolio of four writing samples', 'Self-assess with a five-criteria rubric'],
        gVI: ['Lập kế hoạch ôn bốn tuần', 'Tập hợp hồ sơ bốn bài viết', 'Tự đánh giá bằng thang năm tiêu chí'],
        bEN: `<h4>Four-week review plan</h4>
<table><thead><tr><th>Week</th><th>Focus</th><th>Daily 30 minutes</th></tr></thead><tbody>
<tr><td>1</td><td>Characters: radicals, look-alikes, homophones</td><td>10 cards in spaced repetition + write 5 characters</td></tr>
<tr><td>2</td><td>Sentences: order, aspect, complements, {{把/被/比}}</td><td>3 correction items + 3 own sentences</td></tr>
<tr><td>3</td><td>Paragraphs and practical writing</td><td>1 note or message + 1 paragraph of 80 characters</td></tr>
<tr><td>4</td><td>Exam mode</td><td>1 reading passage in 5 minutes, 1 writing set</td></tr>
</tbody></table>
<p>Spaced repetition: review a card after 1, 3, 7 and 14 days; an app such as Anki is only a tool. The key is to <strong>write</strong>, not only to recognise.</p>
<h4>Final project: portfolio</h4>
<ol><li>A narrative or description of <strong>100–120 characters</strong> (chapter 8).</li>
<li>A formal <strong>email</strong> to a teacher (chapter 7).</li>
<li>A <strong>leave note or invitation</strong> (chapter 6).</li>
<li>An <strong>error log</strong> of at least ten entries from your own writing (chapter 9.2).</li></ol>
<p>Write drafts by hand, proofread with the seven passes, then produce a clean copy. Keep both versions.</p>
<h4>Self-assessment rubric</h4>
<table><thead><tr><th>Criterion</th><th>5 (strong)</th><th>3 (adequate)</th><th>1 (weak)</th></tr></thead><tbody>
<tr><td>Content and task</td><td>fully answers, rich detail</td><td>answers, thin detail</td><td>off-topic</td></tr>
<tr><td>Structure</td><td>clear opening, order, ending</td><td>order is mostly clear</td><td>no visible structure</td></tr>
<tr><td>Grammar</td><td>0–2 errors</td><td>3–6 errors</td><td>more than 6</td></tr>
<tr><td>Characters</td><td>all correct, neat</td><td>1–3 wrong</td><td>many wrong</td></tr>
<tr><td>Punctuation / format</td><td>correct</td><td>a few slips</td><td>English marks, wrong format</td></tr>
</tbody></table>
<p>Total out of 25. Compare your first draft with the final copy; the gain is your progress, and the remaining lowest criterion is your next goal.</p>
<div class="callout"><p>Next courses at FPTU continue with higher-level reading and writing (HSK 4 range). Keep your error log: it will save you time again.</p></div>`,
        bVI: `<h4>Kế hoạch ôn bốn tuần</h4>
<table><thead><tr><th>Tuần</th><th>Trọng tâm</th><th>30 phút mỗi ngày</th></tr></thead><tbody>
<tr><td>1</td><td>Chữ: bộ thủ, chữ gần hình, đồng âm</td><td>10 thẻ lặp lại ngắt quãng + viết 5 chữ</td></tr>
<tr><td>2</td><td>Câu: trật tự, thể, bổ ngữ, {{把/被/比}}</td><td>3 câu sửa lỗi + 3 câu tự viết</td></tr>
<tr><td>3</td><td>Đoạn văn và văn ứng dụng</td><td>1 ghi chú hoặc tin nhắn + 1 đoạn 80 chữ</td></tr>
<tr><td>4</td><td>Chế độ thi</td><td>1 đoạn đọc trong 5 phút, 1 bộ bài viết</td></tr>
</tbody></table>
<p>Lặp lại ngắt quãng: ôn thẻ sau 1, 3, 7 và 14 ngày; ứng dụng như Anki chỉ là công cụ. Điều then chốt là <strong>viết</strong>, không chỉ nhận mặt chữ.</p>
<h4>Dự án cuối khoá: hồ sơ</h4>
<ol><li>Một bài kể chuyện hoặc miêu tả <strong>100–120 chữ</strong> (chương 8).</li>
<li>Một <strong>email</strong> trang trọng gửi thầy cô (chương 7).</li>
<li>Một <strong>giấy xin nghỉ hoặc lời mời</strong> (chương 6).</li>
<li>Một <strong>sổ lỗi</strong> ít nhất mười mục từ bài viết của chính bạn (bài 9.2).</li></ol>
<p>Viết nháp bằng tay, soát bằng bảy lượt rồi chép bản sạch. Giữ cả hai bản.</p>
<h4>Thang tự đánh giá</h4>
<table><thead><tr><th>Tiêu chí</th><th>5 (tốt)</th><th>3 (đạt)</th><th>1 (yếu)</th></tr></thead><tbody>
<tr><td>Nội dung và yêu cầu đề</td><td>trả lời đủ, nhiều chi tiết</td><td>trả lời, chi tiết ít</td><td>lạc đề</td></tr>
<tr><td>Cấu trúc</td><td>mở, thứ tự, kết rõ</td><td>thứ tự khá rõ</td><td>không thấy cấu trúc</td></tr>
<tr><td>Ngữ pháp</td><td>0–2 lỗi</td><td>3–6 lỗi</td><td>trên 6 lỗi</td></tr>
<tr><td>Chữ</td><td>đúng hết, gọn</td><td>sai 1–3 chữ</td><td>sai nhiều</td></tr>
<tr><td>Dấu câu / định dạng</td><td>đúng</td><td>vài lỗi nhỏ</td><td>dùng dấu tiếng Anh, sai khuôn</td></tr>
</tbody></table>
<p>Tổng trên 25. So bản nháp đầu với bản sạch; phần tăng lên là tiến bộ của bạn, còn tiêu chí thấp nhất là mục tiêu kế tiếp.</p>
<div class="callout"><p>Các môn sau ở FPTU sẽ tiếp tục đọc–viết ở mức cao hơn (khoảng HSK 4). Hãy giữ sổ lỗi: nó sẽ giúp bạn tiết kiệm thời gian lần nữa.</p></div>`,
        tab: [['复习', 'fùxí', 'review', 'ôn tập'], ['计划', 'jìhuà', 'plan', 'kế hoạch'], ['作品', 'zuòpǐn', 'work (piece of writing)', 'tác phẩm, bài làm'], ['评价', 'píngjià', 'evaluate', 'đánh giá'], ['进步', 'jìnbù', 'progress', 'tiến bộ'], ['标准', 'biāozhǔn', 'standard', 'tiêu chuẩn'], ['草稿', 'cǎogǎo', 'draft', 'bản nháp']],
        mEN: 'Typing everything and never writing by hand, so characters fade. Or copying a model essay instead of writing your own. The portfolio must be your own work.',
        mVI: 'Gõ mọi thứ mà không bao giờ viết tay, nên chữ phai dần. Hoặc chép bài mẫu thay vì tự viết. Hồ sơ phải là bài của chính bạn.',
        sEN: ['Four-week plan from characters to exam mode', 'Portfolio: essay, email, note/invitation, error log', 'Rubric: content, structure, grammar, characters, punctuation'],
        sVI: ['Kế hoạch bốn tuần từ chữ đến chế độ thi', 'Hồ sơ: bài văn, email, giấy nhắn/lời mời, sổ lỗi', 'Thang: nội dung, cấu trúc, ngữ pháp, chữ, dấu câu'],
        lk: [U.hsk3, U.duch, U.hanzi, U.hskc],
        p: [
          ['Which four items make up the portfolio?', 'A 100–120-character text, a formal email, a leave note or invitation, and an error log.', 'Hồ sơ gồm bốn thứ nào?', 'Bài 100–120 chữ, email trang trọng, giấy xin nghỉ hoặc lời mời, và sổ lỗi.'],
          ['When do you review a spaced-repetition card?', 'After 1, 3, 7 and 14 days.', 'Khi nào ôn một thẻ lặp lại ngắt quãng?', 'Sau 1, 3, 7 và 14 ngày.'],
          ['Score your own text: no wrong characters, 4 grammar errors. Which rubric scores?', 'Characters 5, grammar 3.', 'Tự chấm bài: không sai chữ, 4 lỗi ngữ pháp. Điểm theo thang?', 'Chữ 5, ngữ pháp 3.'],
        ],
      }),
    QZ(9, 'Quiz 9 — Exam, proofreading and project|||Quiz 9 — Thi, soát lỗi và dự án', 'Kiểm tra dạng đề, bảy lượt soát bài, kế hoạch và thang đánh giá.', [
      Q('q1', 'Rearrange: {{把 / 我 / 作业 / 写完了}}', 'Sắp xếp: {{把 / 我 / 作业 / 写完了}}', ['{{我把作业写完了。}}', '{{把我作业写完了。}}', '{{我写完了把作业。}}', '{{作业我写把完了。}}'], 0, '{{把}} sentence order.', 'Trật tự câu {{把}}.'),
      Q('q2', 'Write the hanzi: {{可 (ài)}}', 'Viết chữ Hán: {{可 (ài)}}', ['{{爱}}', '{{爸}}', '{{受}}', '{{变}}'], 0, '{{可爱}}.', '{{可爱}}.'),
      Q('q3', 'Fix: {{他比我很高。}}', 'Sửa: {{他比我很高。}}', ['{{他比我高。}}', '{{他很比我高。}}', '{{他比很我高。}}', '{{他高比我。}}'], 0, 'No {{很}} after {{比}}.', 'Không {{很}} sau {{比}}.'),
      Q('q4', 'How many proofreading passes does this course use?', 'Khoá này dùng bao nhiêu lượt soát bài?', ['7', '1', '3', '12'], 0, 'Seven passes.', 'Bảy lượt.'),
      Q('q5', 'The error log has columns for…', 'Sổ lỗi có các cột…', ['sentence, type, correction, rule|||câu, loại, dạng đúng, quy tắc', 'only the date|||chỉ ngày', 'only the score|||chỉ điểm', 'only the teacher|||chỉ giáo viên'], 0, 'Four columns.', 'Bốn cột.'),
      Q('q6', 'In the missing-character task you must write…', 'Ở dạng điền chữ bạn phải viết…', ['hanzi|||chữ Hán', 'pinyin|||pinyin', 'English|||tiếng Anh', 'a number|||một số'], 0, 'Only hanzi earns the point.', 'Chỉ chữ Hán mới được điểm.'),
      Q('q7', 'Before the exam you should…', 'Trước kỳ thi nên…', ['check the current format on the official site|||kiểm tra định dạng hiện hành trên trang chính thức', 'guess the format|||đoán định dạng', 'ignore the rules|||bỏ qua quy định', 'skip the review|||bỏ ôn tập'], 0, 'The HSK format is being revised.', 'Định dạng HSK đang được cập nhật.'),
      Q('q8', 'The portfolio length target for the narrative is…', 'Mục tiêu độ dài bài kể chuyện trong hồ sơ là…', ['100–120 characters|||100–120 chữ', '10 characters|||10 chữ', '1000 characters|||1000 chữ', 'no limit|||không giới hạn'], 0, 'Course target.', 'Mục tiêu môn học.'),
    ]),
  ],
};

export default [
  { title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
    description: 'CRW201 học gì, học để làm gì, chuẩn đầu ra, giáo trình; trường chưa công bố syllabus trên FLM nên khung này soạn theo trình độ HSK 3 và trình tự dạy đọc–viết chuẩn.',
    lessons: [m01, m02] },
  c1, c2, c3, c4, c5, c6, c7, c8, c9,
];
