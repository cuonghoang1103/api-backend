// Khoá TỰ SOẠN cho CIC101 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Giáo trình chuẩn: HSK Standard Course 1–2 (BLCU) + Integrated Chinese. Lưu ý: không dùng template-literal nội suy.
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const x = (s) => (Array.isArray(s) ? s[0] + '|||' + s[1] : (String(s).includes('|||') ? s : s + '|||' + s));
const LK = {
  pinyin: ['https://en.wikipedia.org/wiki/Pinyin', 'Wikipedia — Hanyu Pinyin', 'Wikipedia — Hán ngữ phiên âm (Pinyin)'],
  phon: ['https://en.wikipedia.org/wiki/Standard_Chinese_phonology', 'Wikipedia — Standard Chinese phonology', 'Wikipedia — Ngữ âm tiếng Trung chuẩn'],
  chart: ['https://yoyochinese.com/chinese-learning-tools/Mandarin-Chinese-pronunciation-lesson/pinyin-chart-table', 'Yoyo Chinese — interactive pinyin chart with audio', 'Yoyo Chinese — bảng pinyin tương tác có âm thanh'],
  sandhi: ['https://en.wikipedia.org/wiki/Tone_sandhi', 'Wikipedia — Tone sandhi', 'Wikipedia — Biến điệu (tone sandhi)'],
  stroke: ['https://en.wikipedia.org/wiki/Stroke_(CJK_character)', 'Wikipedia — Strokes of Chinese characters', 'Wikipedia — Nét chữ Hán'],
  radical: ['https://en.wikipedia.org/wiki/Radical_(Chinese_characters)', 'Wikipedia — Chinese radicals', 'Wikipedia — Bộ thủ chữ Hán'],
  hanzi: ['https://en.wikipedia.org/wiki/Chinese_characters', 'Wikipedia — Chinese characters', 'Wikipedia — Chữ Hán'],
  simp: ['https://en.wikipedia.org/wiki/Simplified_Chinese_characters', 'Wikipedia — Simplified Chinese characters', 'Wikipedia — Chữ Hán giản thể'],
  hanziw: ['https://hanziwriter.org/', 'Hanzi Writer — animated stroke order and writing practice', 'Hanzi Writer — hoạt hình thứ tự nét và luyện viết'],
  mdbg: ['https://www.mdbg.net/chinese/dictionary', 'MDBG — free Chinese–English dictionary', 'MDBG — từ điển Trung–Anh miễn phí'],
  hsk: ['https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi', 'Wikipedia — HSK test', 'Wikipedia — Kỳ thi HSK'],
  gram: ['https://en.wikipedia.org/wiki/Chinese_grammar', 'Wikipedia — Chinese grammar', 'Wikipedia — Ngữ pháp tiếng Trung'],
  cls: ['https://en.wikipedia.org/wiki/Chinese_classifier', 'Wikipedia — Chinese classifiers (measure words)', 'Wikipedia — Lượng từ tiếng Trung'],
  num: ['https://en.wikipedia.org/wiki/Chinese_numerals', 'Wikipedia — Chinese numerals', 'Wikipedia — Chữ số tiếng Trung'],
  cal: ['https://en.wikipedia.org/wiki/Chinese_calendar', 'Wikipedia — Chinese calendar', 'Wikipedia — Lịch Trung Hoa (âm dương lịch)'],
  zod: ['https://en.wikipedia.org/wiki/Chinese_zodiac', 'Wikipedia — Chinese zodiac', 'Wikipedia — Mười hai con giáp Trung Hoa'],
  kin: ['https://en.wikipedia.org/wiki/Chinese_kinship', 'Wikipedia — Chinese kinship terms', 'Wikipedia — Hệ thống xưng hô họ hàng Trung Hoa'],
  name: ['https://en.wikipedia.org/wiki/Chinese_name', 'Wikipedia — Chinese names', 'Wikipedia — Tên người Trung Quốc'],
  cuis: ['https://en.wikipedia.org/wiki/Chinese_cuisine', 'Wikipedia — Chinese cuisine', 'Wikipedia — Ẩm thực Trung Hoa'],
  tea: ['https://en.wikipedia.org/wiki/Chinese_tea', 'Wikipedia — Chinese tea', 'Wikipedia — Trà Trung Hoa'],
  chop: ['https://en.wikipedia.org/wiki/Chopsticks', 'Wikipedia — Chopsticks (etiquette)', 'Wikipedia — Đũa (và phép lịch sự khi dùng)'],
  rmb: ['https://en.wikipedia.org/wiki/Renminbi', 'Wikipedia — Renminbi (yuan, jiao, fen)', 'Wikipedia — Nhân dân tệ (nguyên, giác, phân)'],
  dir: ['https://en.wikipedia.org/wiki/Cardinal_direction', 'Wikipedia — Cardinal directions', 'Wikipedia — Các phương hướng chính'],
  asp: ['https://en.wikipedia.org/wiki/Aspect_(linguistics)', 'Wikipedia — Grammatical aspect', 'Wikipedia — Thể (aspect) trong ngữ pháp'],
  wikib: ['https://en.wikibooks.org/wiki/Mandarin_Chinese', 'Wikibooks — Mandarin Chinese', 'Wikibooks — Tiếng Quan Thoại'],
  coursera: ['https://www.coursera.org/learn/learn-chinese', 'Coursera — Learn Mandarin Chinese (Peking University)', 'Coursera — Học tiếng Quan Thoại (Đại học Bắc Kinh)'],
};
const lk = (ks, i) => '<ul>' + ks.map((k) => '<li><a href="' + LK[k][0] + '" target="_blank" rel="noopener">' + LK[k][i] + '</a></li>').join('') + '</ul>';
const tbl = (head, rows) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
// o: {n:'1.1', g:[[en,vi]], b:[en,vi], v:[[han,py,en,vi]], d:[[spk,han,py,en,vi]], pit:[en,vi], s:[[en,vi]], l:[keys], p:[[qen,qvi,aen,avi]]}
const build = (o, L) => {
  const I = L === 'en' ? 0 : 1;
  const T = L === 'en'
    ? { goals: 'Lesson goals', lec: 'Lesson', vocab: 'Vocabulary', dlg: 'Model dialogue', pit: 'Common mistakes', sum: '📌 Summary', more: '🔗 Learn more', prac: '🧪 Practice', ans: 'Answer', vh: ['Hanzi', 'Pinyin', 'Meaning'], dh: ['Who', 'Hanzi', 'Pinyin', 'Meaning'] }
    : { goals: 'Mục tiêu bài', lec: 'Bài giảng', vocab: 'Từ vựng', dlg: 'Hội thoại mẫu', pit: 'Lỗi hay gặp', sum: '📌 Tóm tắt', more: '🔗 Học thêm', prac: '🧪 Tự luyện', ans: 'Đáp án', vh: ['Hán tự', 'Pinyin', 'Nghĩa'], dh: ['Ai', 'Hán tự', 'Pinyin', 'Nghĩa'] };
  let h = '<span class="eyebrow">CIC101 · ' + (L === 'en' ? 'Lesson ' : 'Bài ') + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + o.b[I] + '\n';
  if (o.v) h += '<h3>' + T.vocab + '</h3>' + tbl(T.vh, o.v.map((r) => [r[0], r[1], r[2 + I]])) + '\n';
  if (o.d) h += '<h3>' + T.dlg + '</h3>' + tbl(T.dh, o.d.map((r) => [r[0], r[1], r[2], r[3 + I]])) + '\n';
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong> ' + o.pit[I] + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
const D = (slug, en, vi, desc, o) => ({ title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: bi(build(o, 'en'), build(o, 'vi')) });
// p: [qen,qvi,aen,avi] -> build() reads p[I] for question and p[2+I] for answer
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => ({ id: 'q' + (i + 1), question: x(q[0]), options: q[1].map(x), correctIndex: q[2], points: 1, explanation: x(q[3]) })) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'cic101-ts-';
const secs = [];
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu CIC101, chuẩn đầu ra tự soạn, giáo trình và tài liệu học.', [
  D(P + '0-1', '0.1 About CIC101 — Intensive Chinese 1', '0.1 Giới thiệu môn CIC101 — Tiếng Trung tổng hợp tăng cường 1',
    'CIC101 là môn gì, học để làm gì, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [['Understand what CIC101 is and where it sits in the program', 'Hiểu CIC101 là môn gì và đứng ở đâu trong chương trình'],
        ['Know the 8 self-authored learning outcomes', 'Nắm 8 chuẩn đầu ra tự soạn'],
        ['Know the map of the 11 chapters', 'Nắm bản đồ 11 chương của khoá']],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> The university has not published a CIC101 syllabus on FLM (checked by code, variants and name on 09/11/2026). This outline is self-authored from standard textbooks (HSK Standard Course 1–2, Integrated Chinese). Grading scheme and exam schedule follow your lecturer.</div>
<p><strong>What it is.</strong> CIC101 (Intensive Chinese 1, <span lang="zh">汉语综合强化 1</span> in spirit) is a first-semester core subject for the Chinese Language major. "Intensive" means more hours and all four skills together: listening, speaking, reading, writing. Our outline starts from zero sounds and ends around the HSK 1 to early HSK 2 range (roughly 300 words).</p>
<p><strong>Why it matters.</strong> Everything later in the major (reading, translation, business Chinese) is built on pronunciation and the first 300 words. Wrong tones or stroke habits learned now are very hard to fix later. For work, HSK 2 level already lets you handle greetings, numbers, prices, directions and simple small talk with Chinese partners.</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Pronounce all initials, finals and four tones, and apply tone sandhi (3rd+3rd, <span lang="zh">不</span>, <span lang="zh">一</span>).</li>
<li>Read pinyin with correct tone marks and spelling rules.</li>
<li>Write about 100 Hanzi with correct strokes and stroke order; recognise 20 common radicals.</li>
<li>Greet, introduce yourself and others, talk about family, age and nationality.</li>
<li>Handle numbers, dates, time, money and measure words.</li>
<li>Order food, shop, ask for and give directions, use transport.</li>
<li>Use core grammar: <span lang="zh">是/有/在</span>, questions, <span lang="zh">的</span>, modals, <span lang="zh">了/过/在</span>, comparison with <span lang="zh">比</span>.</li>
<li>Read short dialogues and write 5–8 connected sentences on familiar topics.</li></ol>
<h4>Related subjects</h4>
<p>At FPTU a similar beginner subject is CHI111 (Integrated Chinese 1, HSK 1 textbook, 15 lessons). Prerequisites and follow-up subjects of CIC101 are not published; ask your academic office. Chapter map: 1 Sounds · 2 Characters · 3 Greetings · 4 Numbers and time · 5 Family and people · 6 Study and daily life · 7 Food · 8 Shopping · 9 Directions and transport · 10 Hobbies, weather, aspect · 11 Review and exam skills.</p>`,
       `<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của CIC101 trên FLM (đã dò theo mã, biến thể mã và tên ngày 09/11/2026). Khung này soạn theo giáo trình chuẩn (HSK Standard Course 1–2, Integrated Chinese); cách tính điểm và lịch thi theo giảng viên của lớp bạn.</div>
<p><strong>Là môn gì.</strong> CIC101 (Intensive Chinese 1, Tiếng Trung tổng hợp tăng cường 1) là môn nền tảng kỳ 1 của ngành Ngôn ngữ Trung Quốc. "Tăng cường" nghĩa là nhiều giờ hơn và luyện đủ bốn kỹ năng nghe – nói – đọc – viết cùng lúc. Khung của ta đi từ con số 0 về ngữ âm đến khoảng HSK 1 và đầu HSK 2 (chừng 300 từ).</p>
<p><strong>Để làm gì.</strong> Mọi môn sau (đọc hiểu, biên phiên dịch, tiếng Trung thương mại) đều dựa trên phát âm và 300 từ đầu tiên. Sai thanh điệu hay thói quen viết nét sai lúc này rất khó sửa về sau. Đi làm, trình độ HSK 2 đã đủ để chào hỏi, nói số, giá cả, chỉ đường và trò chuyện đơn giản với đối tác người Trung.</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Phát âm đủ thanh mẫu, vận mẫu, bốn thanh điệu và áp dụng biến điệu (3+3, <span lang="zh">不</span>, <span lang="zh">一</span>).</li>
<li>Đọc pinyin đúng dấu thanh và quy tắc chính tả.</li>
<li>Viết khoảng 100 chữ Hán đúng nét, đúng thứ tự; nhận biết 20 bộ thủ thông dụng.</li>
<li>Chào hỏi, giới thiệu bản thân và người khác, nói về gia đình, tuổi, quốc tịch.</li>
<li>Dùng số, ngày giờ, tiền và lượng từ.</li>
<li>Gọi món, mua sắm, hỏi và chỉ đường, đi lại bằng phương tiện.</li>
<li>Dùng ngữ pháp cốt lõi: <span lang="zh">是/有/在</span>, câu hỏi, <span lang="zh">的</span>, động từ năng nguyện, <span lang="zh">了/过/在</span>, so sánh với <span lang="zh">比</span>.</li>
<li>Đọc hội thoại ngắn và viết đoạn 5–8 câu về chủ đề quen thuộc.</li></ol>
<h4>Môn liên quan</h4>
<p>Ở FPTU có môn sơ cấp tương tự là CHI111 (Integrated Chinese 1, giáo trình chuẩn HSK 1, 15 bài). Môn tiên quyết và môn học tiếp của CIC101 chưa được công bố; hỏi phòng đào tạo. Bản đồ chương: 1 Ngữ âm · 2 Chữ Hán · 3 Chào hỏi · 4 Số và thời gian · 5 Gia đình và con người · 6 Học tập và sinh hoạt · 7 Ăn uống · 8 Mua sắm · 9 Phương hướng và giao thông · 10 Sở thích, thời tiết, thể · 11 Ôn tập và kỹ năng thi.</p>`],
    s: [['CIC101 = beginner Chinese, four skills, about HSK 1–2.', 'CIC101 = tiếng Trung sơ cấp, đủ bốn kỹ năng, khoảng HSK 1–2.'],
        ['No FLM syllabus exists: this outline is self-authored.', 'Chưa có syllabus trên FLM: khung này tự soạn.'],
        ['Pronunciation and the first 300 words are the foundation of the major.', 'Phát âm và 300 từ đầu là nền móng của cả ngành.']],
    l: ['hsk', 'coursera'],
    p: [['Name the four skills trained together in an "intensive" course.', 'Kể bốn kỹ năng được luyện cùng nhau trong môn "tăng cường".', 'Listening, speaking, reading, writing.', 'Nghe, nói, đọc, viết.'],
        ['Why does this course start with pronunciation before dialogues?', 'Vì sao khoá bắt đầu bằng ngữ âm trước khi học hội thoại?', 'Wrong tones are hard to fix later and change word meaning.', 'Sai thanh điệu khó sửa về sau và làm đổi nghĩa từ.']] }),

  D(P + '0-2', '0.2 Textbooks & resources', '0.2 Giáo trình & tài liệu',
    'Giáo trình chuẩn có ISBN, khoá học mở và công cụ tra cứu đã kiểm.', {
    n: '0.2',
    g: [['Choose a main textbook and a reference', 'Chọn giáo trình chính và sách tham khảo'], ['Know free tools for dictionary lookup and stroke order', 'Biết công cụ miễn phí để tra từ và xem thứ tự nét']],
    b: [`<h4>Books (checked on Open Library and the FPTU CHI111 syllabus)</h4>
<ul><li><strong>HSK Standard Course 1</strong> (<span lang="zh">HSK标准教程1</span>), Jiang Liping (chief ed.), Beijing Language and Culture University Press. ISBN 978-7-5619-3709-9 (textbook); a Vietnamese-market edition used by FPTU for CHI111 is ISBN 978-604-377-566-2 (NXB Tổng hợp TP.HCM, 2023, per the CHI111 syllabus on FLM).</li>
<li><strong>HSK Standard Course 2</strong>, Jiang Liping, same publisher. ISBN 978-7-5619-3726-6; workbook 978-7-5619-3780-8.</li>
<li><strong>Integrated Chinese</strong> (Yao Tao-chung, Liu Yuehua et al.), Cheng &amp; Tsui. Many editions exist; check the ISBN printed on your copy (not stated here to avoid mixing editions).</li>
<li><strong>Standard Chinese Conversation 360</strong> (<span lang="zh">标准汉语会话360句</span>) vol. 1, per CHI111 syllabus ISBN 978-604-58-4796-1 (NXB Tổng hợp TP.HCM, 2020).</li></ul>
<h4>Free resources</h4>` + lk(['coursera', 'wikib', 'chart', 'mdbg', 'hanziw'], 1) + `<p><strong>Study routine.</strong> 30 minutes a day beats 3 hours on Sunday: 10 min listening and shadowing, 10 min writing characters, 10 min flashcards.</p>`,
       `<h4>Sách (đã kiểm trên Open Library và syllabus CHI111 của FPTU)</h4>
<ul><li><strong>HSK Standard Course 1</strong> (<span lang="zh">HSK标准教程1</span>), chủ biên Khương Lệ Bình (Jiang Liping), NXB Đại học Ngôn ngữ và Văn hoá Bắc Kinh. ISBN 978-7-5619-3709-9 (sách bài học); bản phát hành tại Việt Nam FPTU dùng cho CHI111 là ISBN 978-604-377-566-2 (NXB Tổng hợp TP.HCM, 2023, theo syllabus CHI111 trên FLM).</li>
<li><strong>HSK Standard Course 2</strong>, Khương Lệ Bình, cùng NXB. ISBN 978-7-5619-3726-6; sách bài tập 978-7-5619-3780-8.</li>
<li><strong>Integrated Chinese</strong> (Diêu Đạo Trung – Yao Tao-chung, Lưu Nguyệt Hoa – Liu Yuehua và cộng sự), Cheng &amp; Tsui. Có nhiều lần xuất bản, hãy xem ISBN in trên cuốn của bạn (không ghi ở đây để khỏi lẫn lần xuất bản).</li>
<li><strong>360 câu đàm thoại tiếng Trung</strong> (<span lang="zh">标准汉语会话360句</span>) tập 1, theo syllabus CHI111 ISBN 978-604-58-4796-1 (NXB Tổng hợp TP.HCM, 2020).</li></ul>
<h4>Tài nguyên miễn phí</h4>` + lk(['coursera', 'wikib', 'chart', 'mdbg', 'hanziw'], 2) + `<p><strong>Thói quen học.</strong> 30 phút mỗi ngày hơn hẳn 3 giờ chủ nhật: 10 phút nghe và nhại giọng, 10 phút viết chữ, 10 phút thẻ từ.</p>`],
    s: [['Main book: HSK Standard Course 1 then 2.', 'Sách chính: HSK Standard Course 1 rồi 2.'], ['Use MDBG and Hanzi Writer daily.', 'Dùng MDBG và Hanzi Writer hằng ngày.'], ['Short daily practice beats long weekly sessions.', 'Học ngắn mỗi ngày hơn học dài mỗi tuần.']],
    l: ['mdbg', 'hanziw'],
    p: [['Which free site animates stroke order?', 'Trang miễn phí nào chiếu hoạt hình thứ tự nét?', 'Hanzi Writer.', 'Hanzi Writer.'],
        ['Which tool looks up a word in Chinese–English?', 'Công cụ nào tra từ Trung–Anh?', 'MDBG dictionary.', 'Từ điển MDBG.']] }),
]));
// ===== Chương 1: Ngữ âm =====
secs.push(SEC('Chapter 1 — Sounds: initials, finals, tones', 'Chương 1 — Ngữ âm: thanh mẫu, vận mẫu, thanh điệu',
  'Hệ thống pinyin: 21 thanh mẫu, vận mẫu, bốn thanh điệu, biến điệu và quy tắc viết.', [
  D(P + '1-1', '1.1 Initials (声母)', '1.1 Thanh mẫu (声母)', 'Sáu nhóm thanh mẫu, cặp bật hơi – không bật hơi.', {
    n: '1.1',
    g: [['Name and pronounce the 21 initials', 'Gọi tên và phát âm 21 thanh mẫu'], ['Hear aspirated vs unaspirated pairs', 'Phân biệt cặp bật hơi và không bật hơi'], ['Pronounce zh/ch/sh/r and z/c/s correctly', 'Phát âm đúng zh/ch/sh/r và z/c/s']],
    b: [`<p>Pinyin (<span lang="zh">拼音</span>) writes Mandarin with the Latin alphabet. A syllable = initial (<span lang="zh">声母</span>) + final (<span lang="zh">韵母</span>) + tone. Mandarin has 21 initials, grouped by where the sound is made:</p>
<ul><li><strong>b p m f</strong> — lips. <strong>d t n l</strong> — tongue tip on the gum ridge. <strong>g k h</strong> — back of tongue.</li>
<li><strong>j q x</strong> — tongue flat against the hard palate, always followed by i or ü.</li>
<li><strong>zh ch sh r</strong> — retroflex: curl the tongue tip up. <strong>z c s</strong> — tongue tip behind the teeth.</li></ul>
<p><strong>Aspirated pairs.</strong> b/p, d/t, g/k, j/q, zh/ch, z/c differ only by a puff of air. Hold a sheet of paper before your mouth: it moves for p, t, k, q, ch, c and stays still for b, d, g, j, zh, z. Note that b is closer to English "p" in "spin", not English "b".</p>
<p><strong>Tricky ones.</strong> <em>x</em> is like a soft "sh" with the tongue behind the lower teeth (<span lang="zh">西</span> xī). <em>q</em> is aspirated "ch" with a smile (<span lang="zh">七</span> qī). <em>r</em> is a light buzzy "zh", not English r (<span lang="zh">人</span> rén). <em>c</em> sounds like "ts" in "cats" (<span lang="zh">菜</span> cài).</p>`,
       `<p>Pinyin (<span lang="zh">拼音</span>) viết tiếng Phổ thông bằng chữ cái La-tinh. Một âm tiết = thanh mẫu (<span lang="zh">声母</span>, phụ âm đầu) + vận mẫu (<span lang="zh">韵母</span>) + thanh điệu. Có 21 thanh mẫu, chia theo vị trí phát âm:</p>
<ul><li><strong>b p m f</strong> — môi. <strong>d t n l</strong> — đầu lưỡi chạm lợi trên. <strong>g k h</strong> — gốc lưỡi.</li>
<li><strong>j q x</strong> — mặt lưỡi áp vòm cứng, luôn đi với i hoặc ü.</li>
<li><strong>zh ch sh r</strong> — âm uốn lưỡi: cong đầu lưỡi lên. <strong>z c s</strong> — đầu lưỡi sau răng.</li></ul>
<p><strong>Cặp bật hơi.</strong> b/p, d/t, g/k, j/q, zh/ch, z/c chỉ khác nhau ở luồng hơi. Đặt tờ giấy trước miệng: giấy bay khi đọc p, t, k, q, ch, c và đứng yên với b, d, g, j, zh, z. Chú ý b giống "p" không bật hơi trong tiếng Việt (ba, pa nhẹ), không giống "b" tiếng Việt có rung thanh.</p>
<p><strong>Âm khó.</strong> <em>x</em> như "x" mềm của tiếng Việt, đầu lưỡi sau răng dưới (<span lang="zh">西</span> xī). <em>q</em> là "ch" bật hơi khi cười (<span lang="zh">七</span> qī). <em>r</em> như "zh" rung nhẹ, không giống "r" tiếng Anh (<span lang="zh">人</span> rén). <em>c</em> như "ts" trong "cats" (<span lang="zh">菜</span> cài).</p>`],
    v: [['爸爸', 'bàba', 'dad', 'bố'], ['怕', 'pà', 'to fear', 'sợ'], ['你', 'nǐ', 'you', 'bạn'], ['哥哥', 'gēge', 'older brother', 'anh trai'], ['可以', 'kěyǐ', 'can, may', 'có thể'], ['七', 'qī', 'seven', 'bảy'], ['十', 'shí', 'ten', 'mười'], ['人', 'rén', 'person', 'người'], ['四', 'sì', 'four', 'bốn'], ['词', 'cí', 'word', 'từ']],
    pit: ['Vietnamese learners often read zh/ch/sh like Vietnamese tr/ch/s and merge them with z/c/s. Practise the pair shì (is) vs sì (four), and zhī vs zī.', 'Người Việt hay đọc zh/ch/sh thành tr/ch/s của tiếng Việt và lẫn với z/c/s. Luyện cặp shì (là) / sì (bốn), zhī / zī.'],
    s: [['21 initials in six groups by place of articulation.', '21 thanh mẫu chia sáu nhóm theo vị trí phát âm.'], ['Aspirated pairs differ by a breath: b/p, d/t, g/k, j/q, zh/ch, z/c.', 'Cặp bật hơi chỉ khác luồng hơi: b/p, d/t, g/k, j/q, zh/ch, z/c.'], ['Retroflex zh ch sh r are not z c s.', 'Uốn lưỡi zh ch sh r khác z c s.']],
    l: ['chart', 'pinyin', 'phon'],
    p: [['Which of b, p is aspirated? Which of j, q?', 'Trong b, p âm nào bật hơi? Trong j, q?', 'p and q.', 'p và q.'], ['Read aloud and note the difference: shí (10) – sì (4).', 'Đọc to và phân biệt: shí (10) – sì (4).', 'shí uses curled tongue; sì tongue tip behind teeth.', 'shí uốn lưỡi; sì đầu lưỡi sau răng.'], ['Which initials may only be followed by i or ü?', 'Thanh mẫu nào chỉ đi với i hoặc ü?', 'j, q, x.', 'j, q, x.']] }),

  D(P + '1-2', '1.2 Finals (韵母) and spelling rules', '1.2 Vận mẫu (韵母) và quy tắc viết', 'Vận mẫu đơn, kép, mũi; y/w, ü, iu/ui/un.', {
    n: '1.2',
    g: [['Read simple, compound and nasal finals', 'Đọc vận mẫu đơn, kép và vận mẫu mũi'], ['Apply the y/w and ü spelling rules', 'Áp dụng quy tắc viết y/w và ü'], ['Place the tone mark correctly', 'Đặt dấu thanh đúng chỗ']],
    b: [`<p>There are 36 finals. Core groups:</p>
<ul><li>Simple: <strong>a o e i u ü</strong>, plus <strong>er</strong>.</li>
<li>Compound: <strong>ai ei ao ou</strong>; <strong>ia ie iao iu(iou) ua uo uai ui(uei) üe</strong>.</li>
<li>Nasal: <strong>an en ang eng ong</strong>; <strong>ian in iang ing iong</strong>; <strong>uan un(uen) uang ueng</strong>; <strong>üan ün</strong>. Final <em>-n</em> is front nasal (tongue up); <em>-ng</em> is back nasal (tongue down, mouth open).</li></ul>
<p><strong>Spelling rules.</strong> (1) No initial: i→<em>yi</em>, u→<em>wu</em>, ü→<em>yu</em>, ia→<em>ya</em>, ie→<em>ye</em>, ua→<em>wa</em>, uo→<em>wo</em>, üe→<em>yue</em>, in→<em>yin</em>, ing→<em>ying</em>, üan→<em>yuan</em>, ün→<em>yun</em>. (2) After j, q, x the ü loses its dots: <em>ju, qu, xu</em> (<span lang="zh">去</span> qù), but after n and l it keeps them: <em>nǚ, lǜ</em>. (3) iou, uei, uen shorten to <em>iu, ui, un</em> after an initial: <span lang="zh">六</span> liù, <span lang="zh">对</span> duì. (4) Apostrophe separates syllables: <span lang="zh">女儿</span> nǚ’ér.</p>
<p><strong>Tone mark position.</strong> Mark <em>a</em> if present; otherwise <em>o</em> or <em>e</em>; in <em>iu</em> and <em>ui</em> mark the last vowel (liù, duì). Replace the dot of i: nǐ.</p>`,
       `<p>Có 36 vận mẫu. Các nhóm chính:</p>
<ul><li>Đơn: <strong>a o e i u ü</strong>, thêm <strong>er</strong>.</li>
<li>Kép: <strong>ai ei ao ou</strong>; <strong>ia ie iao iu(iou) ua uo uai ui(uei) üe</strong>.</li>
<li>Mũi: <strong>an en ang eng ong</strong>; <strong>ian in iang ing iong</strong>; <strong>uan un(uen) uang ueng</strong>; <strong>üan ün</strong>. Đuôi <em>-n</em> là mũi trước (đầu lưỡi lên); <em>-ng</em> là mũi sau (lưỡi hạ, miệng mở).</li></ul>
<p><strong>Quy tắc viết.</strong> (1) Không có thanh mẫu: i→<em>yi</em>, u→<em>wu</em>, ü→<em>yu</em>, ia→<em>ya</em>, ie→<em>ye</em>, ua→<em>wa</em>, uo→<em>wo</em>, üe→<em>yue</em>, in→<em>yin</em>, ing→<em>ying</em>, üan→<em>yuan</em>, ün→<em>yun</em>. (2) Sau j, q, x thì ü bỏ hai chấm: <em>ju, qu, xu</em> (<span lang="zh">去</span> qù), nhưng sau n, l vẫn giữ: <em>nǚ, lǜ</em>. (3) iou, uei, uen rút gọn thành <em>iu, ui, un</em> khi có thanh mẫu: <span lang="zh">六</span> liù, <span lang="zh">对</span> duì. (4) Dấu cách âm ’ tách âm tiết: <span lang="zh">女儿</span> nǚ’ér.</p>
<p><strong>Vị trí dấu thanh.</strong> Đặt trên <em>a</em> nếu có; không thì <em>o</em> hoặc <em>e</em>; với <em>iu</em>, <em>ui</em> đặt trên nguyên âm sau (liù, duì). Chữ i bỏ chấm khi thêm dấu: nǐ.</p>`],
    v: [['鱼', 'yú', 'fish', 'cá'], ['五', 'wǔ', 'five', 'năm'], ['月', 'yuè', 'month, moon', 'tháng, trăng'], ['去', 'qù', 'to go', 'đi'], ['女儿', 'nǚ’ér', 'daughter', 'con gái'], ['六', 'liù', 'six', 'sáu'], ['对', 'duì', 'correct', 'đúng'], ['中国', 'Zhōngguó', 'China', 'Trung Quốc'], ['北京', 'Běijīng', 'Beijing', 'Bắc Kinh'], ['朋友', 'péngyou', 'friend', 'bạn']],
    pit: ['Mixing -n and -ng: <em>xīn</em> (new/heart) vs <em>xīng</em> (star); <em>yīn</em> vs <em>yīng</em>. Also writing <em>ü</em> as <em>u</em> after n/l changes the word: nǚ (woman) vs nǔ.', 'Lẫn -n và -ng: <em>xīn</em> (mới/tim) khác <em>xīng</em> (sao); <em>yīn</em> khác <em>yīng</em>. Bỏ dấu ü sau n/l cũng đổi từ: nǚ (nữ) khác nǔ.'],
    s: [['Finals: simple, compound, nasal (-n front, -ng back).', 'Vận mẫu: đơn, kép, mũi (-n trước, -ng sau).'], ['No initial: i→yi, u→wu, ü→yu.', 'Không thanh mẫu: i→yi, u→wu, ü→yu.'], ['ü drops its dots after j q x only.', 'ü chỉ bỏ chấm sau j q x.'], ['Tone mark: a > o/e > last of iu/ui.', 'Dấu thanh: a > o/e > nguyên âm sau của iu/ui.']],
    l: ['chart', 'pinyin'],
    p: [['Write in pinyin with tone mark: 去, 六, 月.', 'Viết pinyin có dấu: 去, 六, 月.', 'qù, liù, yuè.', 'qù, liù, yuè.'], ['Where does the tone go in "duì"?', 'Dấu thanh của "duì" đặt ở đâu?', 'On the second vowel i: the last vowel of ui.', 'Trên i: nguyên âm sau của ui.'], ['Spell "ü" alone with no initial.', 'Viết "ü" khi đứng một mình.', 'yu.', 'yu.']] }),

  D(P + '1-3', '1.3 Tones & tone sandhi (声调, 变调)', '1.3 Thanh điệu và biến điệu (声调, 变调)', 'Bốn thanh, thanh nhẹ, biến điệu 3+3, 不, 一.', {
    n: '1.3',
    g: [['Produce the four tones and the neutral tone', 'Phát âm bốn thanh và thanh nhẹ'], ['Apply 3rd-tone, 不 and 一 sandhi', 'Áp dụng biến điệu thanh 3, 不 và 一'], ['Read a short sentence with correct tones', 'Đọc câu ngắn đúng thanh điệu']],
    b: [`<p>Tone changes the word: <span lang="zh">妈</span> mā (mother), <span lang="zh">麻</span> má (hemp), <span lang="zh">马</span> mǎ (horse), <span lang="zh">骂</span> mà (scold). Picture a 5-level pitch scale:</p>
<ul><li>1st <em>ˉ</em>: high and flat (55). 2nd <em>ˊ</em>: rising (35), like a question "huh?". 3rd <em>ˇ</em>: dips low (214), full dip only at the end of a phrase. 4th <em>ˋ</em>: sharp fall (51), like a command.</li>
<li>Neutral tone: short, light, no mark: <span lang="zh">妈妈</span> māma. Its pitch depends on the previous tone.</li></ul>
<p><strong>Sandhi rules.</strong></p>
<ol><li>3rd + 3rd → 2nd + 3rd: <span lang="zh">你好</span> written nǐ hǎo, said ní hǎo. Three 3rds: the first two pair up according to meaning.</li>
<li>3rd before 1st, 2nd, 4th or neutral: only the low half (half-third): <span lang="zh">老师</span> lǎoshī.</li>
<li><span lang="zh">不</span> bù → <strong>bú</strong> before a 4th tone: <span lang="zh">不是</span> bú shì; otherwise bù: <span lang="zh">不好</span> bù hǎo.</li>
<li><span lang="zh">一</span> yī alone/in counting/in numbers; <strong>yí</strong> before a 4th tone (<span lang="zh">一个</span> yí gè); <strong>yì</strong> before 1st/2nd/3rd (<span lang="zh">一天</span> yì tiān, <span lang="zh">一年</span> yì nián, <span lang="zh">一起</span> yì qǐ).</li></ol>
<p>Textbooks usually print the <em>original</em> tone for 3+3 (nǐ hǎo) but the changed tone for 不 and 一 (bú shì, yí gè). Follow the book your lecturer uses.</p>`,
       `<p>Thanh điệu đổi nghĩa từ: <span lang="zh">妈</span> mā (mẹ), <span lang="zh">麻</span> má (gai), <span lang="zh">马</span> mǎ (ngựa), <span lang="zh">骂</span> mà (mắng). Hình dung thang cao độ 5 mức:</p>
<ul><li>Thanh 1 <em>ˉ</em>: cao và bằng (55). Thanh 2 <em>ˊ</em>: lên (35), như hỏi "hả?". Thanh 3 <em>ˇ</em>: xuống thấp (214), chỉ đọc đủ cả dấu lên ở cuối cụm. Thanh 4 <em>ˋ</em>: rơi gắt (51), như ra lệnh.</li>
<li>Thanh nhẹ: ngắn, nhẹ, không dấu: <span lang="zh">妈妈</span> māma. Cao độ phụ thuộc thanh trước.</li></ul>
<p><strong>Quy tắc biến điệu.</strong></p>
<ol><li>Thanh 3 + thanh 3 → thanh 2 + thanh 3: <span lang="zh">你好</span> viết nǐ hǎo, đọc ní hǎo. Ba thanh 3 liền: hai chữ đầu gộp theo nghĩa.</li>
<li>Thanh 3 trước thanh 1, 2, 4 hoặc thanh nhẹ: chỉ đọc nửa thấp (bán thanh 3): <span lang="zh">老师</span> lǎoshī.</li>
<li><span lang="zh">不</span> bù → <strong>bú</strong> trước thanh 4: <span lang="zh">不是</span> bú shì; còn lại là bù: <span lang="zh">不好</span> bù hǎo.</li>
<li><span lang="zh">一</span> yī khi đứng riêng, đếm số, trong số; <strong>yí</strong> trước thanh 4 (<span lang="zh">一个</span> yí gè); <strong>yì</strong> trước thanh 1/2/3 (<span lang="zh">一天</span> yì tiān, <span lang="zh">一年</span> yì nián, <span lang="zh">一起</span> yì qǐ).</li></ol>
<p>Giáo trình thường ghi thanh gốc với 3+3 (nǐ hǎo) nhưng ghi thanh đã biến với 不 và 一 (bú shì, yí gè). Theo sách giảng viên dùng.</p>`],
    v: [['你好', 'nǐ hǎo', 'hello', 'xin chào'], ['不是', 'bú shì', 'is not', 'không phải'], ['不好', 'bù hǎo', 'not good', 'không tốt'], ['一个', 'yí gè', 'one (item)', 'một cái'], ['一天', 'yì tiān', 'one day', 'một ngày'], ['老师', 'lǎoshī', 'teacher', 'giáo viên'], ['谢谢', 'xièxie', 'thank you', 'cảm ơn'], ['再见', 'zàijiàn', 'goodbye', 'tạm biệt']],
    pit: ['Pronouncing every 3rd tone with the full dip makes speech choppy. And do not change 一 in 第一 (dì yī) or in years/phone numbers read as digits: yī.', 'Đọc đủ cả dấu của mọi thanh 3 làm câu nặng nề. Đừng biến 一 trong 第一 (dì yī) hay khi đọc từng số điện thoại, năm: vẫn là yī.'],
    s: [['Four tones: high flat, rising, dipping, falling; plus neutral.', 'Bốn thanh: cao bằng, lên, gãy, xuống; thêm thanh nhẹ.'], ['3+3 → 2+3 (ní hǎo).', '3+3 → 2+3 (ní hǎo).'], ['不 → bú before 4th; 一 → yí before 4th, yì before 1/2/3.', '不 → bú trước thanh 4; 一 → yí trước 4, yì trước 1/2/3.']],
    l: ['sandhi', 'chart', 'phon'],
    p: [['How is 你好 pronounced?', '你好 được đọc thế nào?', 'ní hǎo.', 'ní hǎo.'], ['Add tone: 不 + 去; 一 + 起.', 'Thêm thanh: 不 + 去; 一 + 起.', 'bú qù; yì qǐ.', 'bú qù; yì qǐ.'], ['What do mā, má, mǎ, mà mean?', 'mā, má, mǎ, mà nghĩa là gì?', 'mother, hemp, horse, scold.', 'mẹ, gai, ngựa, mắng.']] }),

  Q(P + 'quiz-1', 'Quiz 1 — Sounds', 'Quiz 1 — Ngữ âm', [
    [['Which pair differs only by aspiration?', 'Cặp nào chỉ khác nhau ở bật hơi?'], ['b / p', 'm / n', 's / sh', 'l / r'], 0, ['b is unaspirated, p aspirated.', 'b không bật hơi, p bật hơi.']],
    [['How is "ü" written with no initial?', '"ü" không có thanh mẫu được viết là gì?'], ['yu', 'wu', 'yi', 'ü'], 0, ['ü → yu (e.g. 鱼 yú).', 'ü → yu (vd 鱼 yú).']],
    [['Where does the tone mark go in "liu4"?', 'Dấu thanh của "liu4" đặt ở đâu?'], ['On i', 'On u (liù)', 'Between', 'Both'], 1, ['In iu, mark the last vowel: liù.', 'Với iu đặt trên nguyên âm sau: liù.']],
    [['How is 你好 actually said?', '你好 thực tế đọc thế nào?'], ['nǐ hǎo', 'ní hǎo', 'nì hào', 'nī hāo'], 1, ['3+3 → 2+3.', '3+3 → 2+3.']],
    [['Correct pronunciation of 不是:', 'Cách đọc đúng của 不是:'], ['bù shì', 'bú shì', 'bǔ shì', 'bū shì'], 1, ['不 becomes bú before a 4th tone.', '不 đọc bú trước thanh 4.']],
    [['一 in 一个 is read:', '一 trong 一个 đọc là:'], ['yī', 'yí', 'yì', 'yǐ'], 1, ['Before a 4th tone 一 is yí.', 'Trước thanh 4, 一 đọc yí.']],
    [['Which initials are retroflex?', 'Thanh mẫu nào là âm uốn lưỡi?'], ['z c s', 'zh ch sh r', 'j q x', 'b p m f'], 1, ['zh ch sh r curl the tongue.', 'zh ch sh r cong lưỡi.']],
    [['After j, q, x, "ü" is written:', 'Sau j, q, x, "ü" viết là:'], ['ü', 'u', 'v', 'iu'], 1, ['Dots are dropped: qù.', 'Bỏ hai chấm: qù.']],
  ]),
]));

// ===== Chương 2: Chữ Hán =====
secs.push(SEC('Chapter 2 — Hanzi: strokes, radicals, first characters', 'Chương 2 — Chữ Hán: nét, bộ thủ, những chữ đầu tiên',
  'Các nét cơ bản, quy tắc bút thuận, bộ thủ và 20 chữ đầu tiên.', [
  D(P + '2-1', '2.1 Strokes & stroke order', '2.1 Nét chữ và quy tắc bút thuận', 'Tám nét cơ bản và bảy quy tắc viết.', {
    n: '2.1',
    g: [['Name the basic strokes', 'Gọi tên các nét cơ bản'], ['Apply the stroke-order rules', 'Áp dụng quy tắc bút thuận'], ['Write 10 simple characters correctly', 'Viết đúng 10 chữ đơn giản']],
    b: [`<p>Simplified characters (<span lang="zh">简体字</span>) are built from a small set of strokes (<span lang="zh">笔画</span>):</p>
<ul><li><span lang="zh">一</span> héng horizontal (left→right); <span lang="zh">丨</span> shù vertical (top→down); <span lang="zh">丿</span> piě left-falling; <span lang="zh">丶</span> diǎn dot; <span lang="zh">㇏</span> nà right-falling; <span lang="zh">㇀</span> tí rising; <span lang="zh">乛</span> zhé turning stroke; hook <span lang="zh">钩</span> gōu.</li></ul>
<p><strong>Stroke-order rules (<span lang="zh">笔顺规则</span>):</strong></p>
<ol><li>Top before bottom: <span lang="zh">三</span> sān (3 strokes).</li><li>Left before right: <span lang="zh">川</span>, <span lang="zh">你</span>.</li><li>Horizontal before vertical when crossing: <span lang="zh">十</span> shí (2 strokes).</li><li>Left-falling before right-falling: <span lang="zh">人</span> rén (2), <span lang="zh">大</span> dà (3).</li><li>Outside before inside: <span lang="zh">月</span> yuè (4), <span lang="zh">国</span> guó (8).</li><li>Centre before sides: <span lang="zh">小</span> xiǎo (3).</li><li>Close the box last: <span lang="zh">日</span> rì (4), <span lang="zh">国</span>: 囗 first three sides, inside, then bottom.</li></ol>
<p>Practise slowly with the animated stroke order tool: the order is part of exams and of recognising handwriting.</p>`,
       `<p>Chữ giản thể (<span lang="zh">简体字</span>) tạo từ một số ít nét (<span lang="zh">笔画</span>):</p>
<ul><li><span lang="zh">一</span> héng ngang (trái→phải); <span lang="zh">丨</span> shù sổ (trên→dưới); <span lang="zh">丿</span> piě phẩy; <span lang="zh">丶</span> diǎn chấm; <span lang="zh">㇏</span> nà mác; <span lang="zh">㇀</span> tí hất; <span lang="zh">乛</span> zhé gấp khúc; nét móc <span lang="zh">钩</span> gōu.</li></ul>
<p><strong>Quy tắc bút thuận (<span lang="zh">笔顺规则</span>):</strong></p>
<ol><li>Trên trước dưới: <span lang="zh">三</span> sān (3 nét).</li><li>Trái trước phải: <span lang="zh">川</span>, <span lang="zh">你</span>.</li><li>Ngang trước sổ khi cắt nhau: <span lang="zh">十</span> shí (2 nét).</li><li>Phẩy trước mác: <span lang="zh">人</span> rén (2), <span lang="zh">大</span> dà (3).</li><li>Ngoài trước trong: <span lang="zh">月</span> yuè (4), <span lang="zh">国</span> guó (8).</li><li>Giữa trước hai bên: <span lang="zh">小</span> xiǎo (3).</li><li>Đóng khung sau cùng: <span lang="zh">日</span> rì (4); <span lang="zh">国</span>: viết ba cạnh 囗, rồi phần trong, cuối cùng đóng đáy.</li></ol>
<p>Luyện chậm với công cụ chiếu thứ tự nét: thứ tự nét có trong đề thi và giúp đọc chữ viết tay.</p>`],
    v: [['一', 'yī', 'one (1 stroke)', 'một (1 nét)'], ['二', 'èr', 'two (2)', 'hai (2 nét)'], ['三', 'sān', 'three (3)', 'ba (3 nét)'], ['十', 'shí', 'ten (2)', 'mười (2 nét)'], ['人', 'rén', 'person (2)', 'người (2 nét)'], ['大', 'dà', 'big (3)', 'to (3 nét)'], ['小', 'xiǎo', 'small (3)', 'nhỏ (3 nét)'], ['口', 'kǒu', 'mouth (3)', 'miệng (3 nét)'], ['日', 'rì', 'sun, day (4)', 'mặt trời, ngày (4 nét)'], ['月', 'yuè', 'moon, month (4)', 'trăng, tháng (4 nét)']],
    pit: ['Common errors: writing 口 as one continuous round stroke, closing 日 before the middle bar, and writing 十 vertical first. Shape and order both count.', 'Lỗi thường gặp: viết 口 một nét tròn, đóng khung 日 trước khi kẻ nét giữa, viết 十 sổ trước. Cả hình dạng lẫn thứ tự đều tính.'],
    s: [['Eight basic strokes build all characters.', 'Tám nét cơ bản tạo nên mọi chữ.'], ['Top→bottom, left→right, outside→inside.', 'Trên→dưới, trái→phải, ngoài→trong.'], ['Cross: horizontal first; 人: 丿 then 乀.', 'Giao nhau: ngang trước; 人: phẩy rồi mác.']],
    l: ['stroke', 'hanziw', 'hanzi'],
    p: [['How many strokes: 大, 日, 月?', 'Mấy nét: 大, 日, 月?', '3, 4, 4.', '3, 4, 4.'], ['Which comes first in 十?', 'Trong 十 nét nào viết trước?', 'The horizontal stroke.', 'Nét ngang.'], ['Name the rule for 小.', 'Gọi tên quy tắc cho 小.', 'Centre before the sides.', 'Giữa trước hai bên.']] }),

  D(P + '2-2', '2.2 Radicals & character structure', '2.2 Bộ thủ và cấu trúc chữ', 'Bộ thủ thông dụng, chữ hình thanh, bố cục chữ.', {
    n: '2.2',
    g: [['Recognise 12 common radicals', 'Nhận biết 12 bộ thủ thông dụng'], ['Explain phonetic–semantic characters', 'Giải thích chữ hình thanh'], ['Identify left-right / top-bottom / enclosed structure', 'Nhận ra cấu trúc trái-phải / trên-dưới / bao quanh']],
    b: [`<p>A <strong>radical</strong> (<span lang="zh">部首 bùshǒu</span>) is the component that indexes a character in dictionaries and often hints at its meaning. About 80% of characters are <em>phonetic-semantic compounds</em>: one part gives the meaning, another the sound. Example: <span lang="zh">妈</span> mā = <span lang="zh">女</span> (woman) + <span lang="zh">马</span> mǎ (sound). <span lang="zh">吗</span> ma = <span lang="zh">口</span> (mouth, a spoken particle) + <span lang="zh">马</span>. <span lang="zh">请</span> qǐng = <span lang="zh">讠</span> (speech) + <span lang="zh">青</span> qīng.</p>
<p><strong>Layout types:</strong> left-right (<span lang="zh">你 好 吗</span>), top-bottom (<span lang="zh">学 想 姐</span>), enclosing (<span lang="zh">国 问 这</span>), single (<span lang="zh">人 大</span>). Components keep a fixed size ratio, so write left-right characters narrower.</p>
<p>Use the table below to learn the radicals with a known character each.</p>`,
       `<p><strong>Bộ thủ</strong> (<span lang="zh">部首 bùshǒu</span>) là thành phần dùng để tra từ điển và thường gợi nghĩa. Khoảng 80% chữ Hán là <em>chữ hình thanh</em>: một phần chỉ nghĩa, một phần chỉ âm. Ví dụ: <span lang="zh">妈</span> mā = <span lang="zh">女</span> (phụ nữ) + <span lang="zh">马</span> mǎ (âm). <span lang="zh">吗</span> ma = <span lang="zh">口</span> (miệng, trợ từ nói) + <span lang="zh">马</span>. <span lang="zh">请</span> qǐng = <span lang="zh">讠</span> (lời nói) + <span lang="zh">青</span> qīng.</p>
<p><strong>Kiểu bố cục:</strong> trái-phải (<span lang="zh">你 好 吗</span>), trên-dưới (<span lang="zh">学 想 姐</span>), bao quanh (<span lang="zh">国 问 这</span>), độc thể (<span lang="zh">人 大</span>). Các thành phần có tỉ lệ cố định nên chữ trái-phải viết hẹp hơn.</p>
<p>Dùng bảng dưới để học bộ thủ cùng một chữ ví dụ quen thuộc.</p>`],
    v: [['亻', 'rén', 'person: 你 nǐ, 他 tā', 'người: 你 nǐ, 他 tā'], ['女', 'nǚ', 'woman: 妈 mā, 好 hǎo, 姐 jiě', 'phụ nữ: 妈 mā, 好 hǎo, 姐 jiě'], ['口', 'kǒu', 'mouth: 吗 ma, 吃 chī, 喝 hē', 'miệng: 吗 ma, 吃 chī, 喝 hē'], ['讠', 'yán', 'speech: 请 qǐng, 谢 xiè, 说 shuō', 'lời nói: 请 qǐng, 谢 xiè, 说 shuō'], ['氵', 'shuǐ', 'water: 汉 hàn, 河 hé', 'nước: 汉 hàn, 河 hé'], ['木', 'mù', 'tree: 校 xiào, 本 běn', 'cây: 校 xiào, 本 běn'], ['日', 'rì', 'sun/time: 明 míng, 时 shí', 'mặt trời/thời gian: 明 míng, 时 shí'], ['忄/心', 'xīn', 'heart: 忙 máng, 想 xiǎng', 'tim: 忙 máng, 想 xiǎng'], ['扌', 'shǒu', 'hand: 打 dǎ, 找 zhǎo', 'tay: 打 dǎ, 找 zhǎo'], ['饣', 'shí', 'food: 饭 fàn, 饿 è', 'thức ăn: 饭 fàn, 饿 è'], ['钅', 'jīn', 'metal: 钱 qián, 钟 zhōng', 'kim loại: 钱 qián, 钟 zhōng'], ['辶', 'chuò', 'walk: 这 zhè, 过 guò, 远 yuǎn', 'đi: 这 zhè, 过 guò, 远 yuǎn']],
    pit: ['A hint, not a rule: the radical suggests meaning only roughly, and the phonetic part can be off by tone or initial (妈 mā / 马 mǎ). Do not guess blindly; check a dictionary.', 'Chỉ là gợi ý, không phải luật: bộ thủ chỉ gợi nghĩa đại khái, phần chỉ âm có thể lệch thanh (妈 mā / 马 mǎ). Đừng đoán mò, hãy tra từ điển.'],
    s: [['Radical = index + meaning hint.', 'Bộ thủ = chỉ mục tra + gợi nghĩa.'], ['Most characters = meaning part + sound part.', 'Phần lớn chữ = phần nghĩa + phần âm.'], ['Layouts: left-right, top-bottom, enclosing.', 'Bố cục: trái-phải, trên-dưới, bao quanh.']],
    l: ['radical', 'hanzi', 'mdbg'],
    p: [['Which radical is in 请 and 说?', 'Bộ nào có trong 请 và 说?', '讠 (speech).', '讠 (lời nói).'], ['Split 吗 into meaning and sound.', 'Tách 吗 thành phần nghĩa và phần âm.', '口 meaning, 马 sound.', '口 nghĩa, 马 âm.'], ['Layout of 国?', 'Bố cục của 国?', 'Enclosing.', 'Bao quanh.']] }),

  D(P + '2-3', '2.3 First characters you can write', '2.3 Những chữ đầu tiên bạn viết được', 'Ghép chữ đã học thành từ: 学生, 中国, 好人…', {
    n: '2.3',
    g: [['Read and write 20 high-frequency characters', 'Đọc và viết 20 chữ tần suất cao'], ['Combine characters into words', 'Ghép chữ thành từ'], ['Know simplified vs traditional', 'Biết giản thể khác phồn thể']],
    b: [`<p>Chinese words are mostly 2 characters: <span lang="zh">学生</span> xuésheng (student), <span lang="zh">中国</span> Zhōngguó (China), <span lang="zh">好人</span> hǎorén (good person), <span lang="zh">大学</span> dàxué (university), <span lang="zh">小学生</span> xiǎoxuéshēng (primary pupil). Knowing a few characters unlocks many words (productive characters).</p>
<p><strong>Simplified vs traditional.</strong> Mainland China and Singapore use simplified characters; Taiwan and Hong Kong use traditional. Examples: <span lang="zh">学</span> (traditional 學), <span lang="zh">国</span> (國), <span lang="zh">马</span> (馬). This course uses simplified only.</p>
<p><strong>Learning method.</strong> For each character: say pinyin and meaning, trace the strokes, write 5 times from memory, put it in a word. Spaced repetition (apps such as Anki/Pleco) fixes them in memory.</p>`,
       `<p>Từ tiếng Trung đa phần gồm 2 chữ: <span lang="zh">学生</span> xuésheng (học sinh), <span lang="zh">中国</span> Zhōngguó (Trung Quốc), <span lang="zh">好人</span> hǎorén (người tốt), <span lang="zh">大学</span> dàxué (đại học), <span lang="zh">小学生</span> xiǎoxuéshēng (học sinh tiểu học). Biết vài chữ là mở được nhiều từ (chữ có sức sản sinh cao).</p>
<p><strong>Giản thể và phồn thể.</strong> Trung Quốc đại lục và Singapore dùng giản thể; Đài Loan và Hồng Kông dùng phồn thể. Ví dụ: <span lang="zh">学</span> (phồn thể 學), <span lang="zh">国</span> (國), <span lang="zh">马</span> (馬). Khoá này chỉ dùng giản thể.</p>
<p><strong>Cách học.</strong> Với mỗi chữ: đọc pinyin và nghĩa, tô theo nét, viết lại 5 lần theo trí nhớ, đặt vào một từ. Lặp lại ngắt quãng (Anki/Pleco) giúp nhớ lâu.</p>`],
    v: [['学', 'xué', 'to study', 'học'], ['生', 'shēng', 'to be born; student', 'sinh; học sinh'], ['中', 'zhōng', 'middle', 'giữa, trung'], ['国', 'guó', 'country', 'nước'], ['好', 'hǎo', 'good', 'tốt'], ['你', 'nǐ', 'you', 'bạn'], ['山', 'shān', 'mountain', 'núi'], ['水', 'shuǐ', 'water', 'nước (uống)'], ['火', 'huǒ', 'fire', 'lửa'], ['木', 'mù', 'tree, wood', 'cây, gỗ'], ['学生', 'xuésheng', 'student', 'học sinh'], ['中国', 'Zhōngguó', 'China', 'Trung Quốc'], ['大学', 'dàxué', 'university', 'đại học']],
    pit: ['Do not confuse look-alikes: 日 (sun) / 目 (eye) / 曰; 大 / 太 / 犬. Mind the number of dots and strokes.', 'Đừng lẫn chữ giống nhau: 日 (mặt trời) / 目 (mắt) / 曰; 大 / 太 / 犬. Chú ý số chấm và số nét.'],
    s: [['Most words have 2 characters.', 'Đa số từ có 2 chữ.'], ['Simplified for mainland China; traditional for Taiwan/HK.', 'Giản thể cho đại lục; phồn thể cho Đài Loan/Hồng Kông.'], ['Learn: say, trace, write from memory, use in a word.', 'Học: đọc, tô, viết lại, đặt trong từ.']],
    l: ['simp', 'hanziw', 'mdbg'],
    p: [['Write the pinyin of 大学 and 中国.', 'Viết pinyin của 大学 và 中国.', 'dàxué; Zhōngguó.', 'dàxué; Zhōngguó.'], ['Traditional form of 学?', 'Dạng phồn thể của 学?', '學.', '學.'], ['Make a word with 学 and 生.', 'Ghép một từ với 学 và 生.', '学生 xuésheng, student.', '学生 xuésheng, học sinh.']] }),

  Q(P + 'quiz-2', 'Quiz 2 — Hanzi', 'Quiz 2 — Chữ Hán', [
    [['What is the first stroke of 十?', 'Nét đầu của 十?'], ['Horizontal', 'Vertical', 'Dot', 'Hook'], 0, ['Horizontal comes before vertical.', 'Ngang trước sổ.']],
    [['How many strokes does 人 have?', '人 có mấy nét?'], ['1', '2', '3', '4'], 1, ['丿 then 乀.', 'Phẩy rồi mác.']],
    [['In 国 the box is closed:', 'Trong 国 khung được đóng:'], ['First', 'Last', 'Never', 'Before inside'], 1, ['Close the box last.', 'Đóng khung sau cùng.']],
    [['Which radical means "speech"?', 'Bộ nào nghĩa "lời nói"?'], ['讠', '氵', '木', '扌'], 0, ['讠 in 请, 说, 谢.', '讠 trong 请, 说, 谢.']],
    [['What is the sound part of 妈?', 'Phần chỉ âm của 妈 là gì?'], ['女', '马', '口', '女马'], 1, ['马 mǎ gives the sound.', '马 mǎ chỉ âm.']],
    [['Which uses simplified characters?', 'Nơi nào dùng chữ giản thể?'], ['Taiwan', 'Hong Kong', 'Mainland China', 'None'], 2, ['Mainland China and Singapore.', 'Đại lục và Singapore.']],
    [['小 follows which rule?', '小 theo quy tắc nào?'], ['Centre before sides', 'Outside first', 'Bottom first', 'Right first'], 0, ['The middle stroke is first.', 'Nét giữa viết trước.']],
    [['Pinyin of 大学:', 'Pinyin của 大学:'], ['dàxué', 'dàxuē', 'tàxué', 'dāxué'], 0, ['大 dà, 学 xué.', '大 dà, 学 xué.']],
  ]),
]));
// ===== Chương 3: Chào hỏi =====
secs.push(SEC('Chapter 3 — Greetings and introductions', 'Chương 3 — Chào hỏi và giới thiệu',
  'Chào hỏi, lịch sự, tên, quốc tịch, câu hỏi 吗/呢/什么/谁/哪.', [
  D(P + '3-1', '3.1 Greetings & polite phrases', '3.1 Chào hỏi và câu lịch sự', 'Chào theo thời điểm, cảm ơn, xin lỗi, tạm biệt.', {
    n: '3.1',
    g: [['Greet people at different times and formality levels', 'Chào hỏi theo thời điểm và mức độ trang trọng'], ['Thank, apologise, say goodbye', 'Cảm ơn, xin lỗi, tạm biệt'], ['Respond naturally in a short exchange', 'Đáp lại tự nhiên trong hội thoại ngắn']],
    b: [`<p>The basic greeting is <span lang="zh">你好</span> nǐ hǎo. Use <span lang="zh">您好</span> nín hǎo for elders or customers (<span lang="zh">您</span> is the polite “you”), and <span lang="zh">你们好</span> for a group. By time of day: <span lang="zh">早上好</span> zǎoshang hǎo, <span lang="zh">晚上好</span> wǎnshang hǎo; at night <span lang="zh">晚安</span> wǎn’ān. Native speakers often just say <span lang="zh">早</span>.</p>
<p><strong>How are you?</strong> <span lang="zh">你好吗？</span> → <span lang="zh">我很好，谢谢。你呢？</span>. Note the adverb <span lang="zh">很</span> (very) is normally needed before an adjective predicate; <span lang="zh">我好</span> sounds like a contrast (“I’m fine [but others aren’t]”).</p>
<p><strong>Thanks and sorry.</strong> <span lang="zh">谢谢</span> → <span lang="zh">不客气</span> / <span lang="zh">不谢</span>. <span lang="zh">对不起</span> → <span lang="zh">没关系</span>. <span lang="zh">请</span> qǐng = please / invite: <span lang="zh">请坐</span> have a seat, <span lang="zh">请进</span> come in, <span lang="zh">请问</span> may I ask. Goodbye: <span lang="zh">再见</span>, <span lang="zh">明天见</span> see you tomorrow.</p>`,
       `<p>Câu chào cơ bản là <span lang="zh">你好</span> nǐ hǎo. Với người lớn tuổi hay khách hàng dùng <span lang="zh">您好</span> nín hǎo (<span lang="zh">您</span> là “bạn” lịch sự), với nhiều người dùng <span lang="zh">你们好</span>. Theo thời điểm: <span lang="zh">早上好</span> zǎoshang hǎo, <span lang="zh">晚上好</span> wǎnshang hǎo; chúc ngủ ngon <span lang="zh">晚安</span> wǎn’ān. Người bản xứ thường chỉ nói <span lang="zh">早</span>.</p>
<p><strong>Hỏi thăm sức khoẻ.</strong> <span lang="zh">你好吗？</span> → <span lang="zh">我很好，谢谢。你呢？</span>. Chú ý phó từ <span lang="zh">很</span> (rất) thường cần có trước tính từ làm vị ngữ; nói <span lang="zh">我好</span> nghe như đối chiếu (“tôi khoẻ [còn người khác thì không]”).</p>
<p><strong>Cảm ơn và xin lỗi.</strong> <span lang="zh">谢谢</span> → <span lang="zh">不客气</span> / <span lang="zh">不谢</span>. <span lang="zh">对不起</span> → <span lang="zh">没关系</span>. <span lang="zh">请</span> qǐng = xin mời / làm ơn: <span lang="zh">请坐</span> mời ngồi, <span lang="zh">请进</span> mời vào, <span lang="zh">请问</span> xin hỏi. Tạm biệt: <span lang="zh">再见</span>, <span lang="zh">明天见</span> hẹn mai gặp.</p>`],
    v: [['您好', 'nín hǎo', 'hello (polite)', 'xin chào (lịch sự)'], ['你们', 'nǐmen', 'you (plural)', 'các bạn'], ['早上', 'zǎoshang', 'morning', 'buổi sáng'], ['晚上', 'wǎnshang', 'evening', 'buổi tối'], ['很', 'hěn', 'very', 'rất'], ['谢谢', 'xièxie', 'thank you', 'cảm ơn'], ['不客气', 'bú kèqi', 'you are welcome', 'đừng khách sáo'], ['对不起', 'duìbuqǐ', 'sorry', 'xin lỗi'], ['没关系', 'méi guānxi', 'it does not matter', 'không sao'], ['请', 'qǐng', 'please', 'xin mời'], ['明天', 'míngtiān', 'tomorrow', 'ngày mai']],
    d: [['A', '您好！', 'Nín hǎo!', 'Hello (polite)!', 'Chào ông/bà!'], ['B', '你好！你好吗？', 'Nǐ hǎo! Nǐ hǎo ma?', 'Hello! How are you?', 'Chào bạn! Bạn khoẻ không?'], ['A', '我很好，谢谢。你呢？', 'Wǒ hěn hǎo, xièxie. Nǐ ne?', 'Fine, thanks. And you?', 'Tôi khoẻ, cảm ơn. Còn bạn?'], ['B', '我也很好。再见！', 'Wǒ yě hěn hǎo. Zàijiàn!', 'I am fine too. Goodbye!', 'Tôi cũng khoẻ. Tạm biệt!']],
    pit: ['Saying “我好” alone, or answering thanks with “谢谢” again. Also avoid 您 with friends of your age: it sounds distant.', 'Nói “我好” trơ trọi, hoặc đáp lại lời cảm ơn bằng “谢谢”. Cũng đừng dùng 您 với bạn cùng tuổi: nghe xa cách.'],
    s: [['你好 / 您好 (polite) / 你们好 (group).', '你好 / 您好 (lịch sự) / 你们好 (nhóm).'], ['Adjective predicate needs 很: 我很好.', 'Vị ngữ tính từ cần 很: 我很好.'], ['谢谢→不客气; 对不起→没关系.', '谢谢→不客气; 对不起→没关系.']],
    l: ['wikib', 'coursera', 'chart'],
    p: [['Reply to 谢谢 and to 对不起.', 'Đáp lại 谢谢 và 对不起.', '不客气; 没关系.', '不客气; 没关系.'], ['Write the polite form of “you”.', 'Viết chữ “bạn” dạng lịch sự.', '您 nín.', '您 nín.'], ['Translate: “I am very well, and you?”', 'Dịch: “Tôi rất khoẻ, còn bạn?”', '我很好，你呢？', '我很好，你呢？']] }),

  D(P + '3-2', '3.2 Names, nationality & basic sentences', '3.2 Tên, quốc tịch và câu cơ bản', 'Câu 是, phủ định 不, câu hỏi 吗, 呢, từ 也 và 都.', {
    n: '3.2',
    g: [['Say and ask names with 叫 and 姓', 'Nói và hỏi tên với 叫 và 姓'], ['Use 是, 不是, 吗, 呢, 也, 都', 'Dùng 是, 不是, 吗, 呢, 也, 都'], ['Name common countries', 'Gọi tên các nước thông dụng']],
    b: [`<p><strong>Names.</strong> Chinese puts the family name first: <span lang="zh">王明</span> Wáng Míng = Wang (family) + Ming (given). <span lang="zh">姓</span> xìng gives only the family name: <span lang="zh">我姓王</span>. <span lang="zh">叫</span> jiào gives the full name: <span lang="zh">我叫王明</span>. Ask <span lang="zh">你叫什么名字？</span> or politely <span lang="zh">您贵姓？</span> (answer with 姓 only).</p>
<p><strong>是 sentences.</strong> A <span lang="zh">是</span> B (A is B): <span lang="zh">我是学生</span>. Negative: put <span lang="zh">不</span> before 是: <span lang="zh">我不是老师</span>. Yes/no question: add <span lang="zh">吗</span>: <span lang="zh">你是越南人吗？</span> Answer: <span lang="zh">是</span> / <span lang="zh">不是</span> (the verb repeats; Chinese has no single “yes”). <span lang="zh">呢</span> returns the question: <span lang="zh">我是学生，你呢？</span></p>
<p><strong>也 and 都.</strong> Both go <em>after the subject and before the verb</em>: <span lang="zh">我也是学生</span> (me too), <span lang="zh">我们都是学生</span> (we are all students). Together: <span lang="zh">也都</span>. Nationality: country + <span lang="zh">人</span>: <span lang="zh">越南人</span>, <span lang="zh">中国人</span>. Ask <span lang="zh">你是哪国人？</span></p>`,
       `<p><strong>Tên.</strong> Tiếng Trung đặt họ trước: <span lang="zh">王明</span> Wáng Míng = họ Vương + tên Minh. <span lang="zh">姓</span> xìng chỉ nói họ: <span lang="zh">我姓王</span>. <span lang="zh">叫</span> jiào nói cả họ tên: <span lang="zh">我叫王明</span>. Hỏi <span lang="zh">你叫什么名字？</span> hoặc lịch sự <span lang="zh">您贵姓？</span> (trả lời chỉ với 姓).</p>
<p><strong>Câu 是.</strong> A <span lang="zh">是</span> B (A là B): <span lang="zh">我是学生</span>. Phủ định: đặt <span lang="zh">不</span> trước 是: <span lang="zh">我不是老师</span>. Câu hỏi có/không: thêm <span lang="zh">吗</span>: <span lang="zh">你是越南人吗？</span> Trả lời: <span lang="zh">是</span> / <span lang="zh">不是</span> (lặp lại động từ; tiếng Trung không có từ “vâng” riêng). <span lang="zh">呢</span> hỏi lại: <span lang="zh">我是学生，你呢？</span></p>
<p><strong>也 và 都.</strong> Cả hai đứng <em>sau chủ ngữ, trước động từ</em>: <span lang="zh">我也是学生</span> (tôi cũng), <span lang="zh">我们都是学生</span> (chúng tôi đều là học sinh). Dùng cùng nhau: <span lang="zh">也都</span>. Quốc tịch: tên nước + <span lang="zh">人</span>: <span lang="zh">越南人</span>, <span lang="zh">中国人</span>. Hỏi <span lang="zh">你是哪国人？</span></p>`],
    v: [['姓', 'xìng', 'surname; to be surnamed', 'họ; mang họ'], ['叫', 'jiào', 'to be called', 'tên là, gọi'], ['什么', 'shénme', 'what', 'cái gì'], ['名字', 'míngzi', 'name', 'tên'], ['是', 'shì', 'to be', 'là'], ['吗', 'ma', 'question particle', 'trợ từ nghi vấn'], ['也', 'yě', 'also', 'cũng'], ['都', 'dōu', 'all, both', 'đều'], ['我们', 'wǒmen', 'we', 'chúng tôi'], ['哪', 'nǎ', 'which', 'nào'], ['越南', 'Yuènán', 'Vietnam', 'Việt Nam'], ['美国', 'Měiguó', 'USA', 'Mỹ'], ['日本', 'Rìběn', 'Japan', 'Nhật Bản'], ['韩国', 'Hánguó', 'South Korea', 'Hàn Quốc']],
    d: [['A', '你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'What is your name?', 'Bạn tên là gì?'], ['B', '我叫阮明，你呢？', 'Wǒ jiào Ruǎn Míng, nǐ ne?', 'I am Nguyen Minh. And you?', 'Tôi là Nguyễn Minh, còn bạn?'], ['A', '我姓王，叫王丽。你是越南人吗？', 'Wǒ xìng Wáng, jiào Wáng Lì. Nǐ shì Yuènán rén ma?', 'My surname is Wang, I am Wang Li. Are you Vietnamese?', 'Tôi họ Vương, tên Vương Lệ. Bạn là người Việt à?'], ['B', '是，我是越南人。', 'Shì, wǒ shì Yuènán rén.', 'Yes, I am Vietnamese.', 'Vâng, tôi là người Việt.']],
    pit: ['Putting 也/都 after the verb (“我是也学生” is wrong) and adding 很 before 是 (“我很是学生”). Also, never put 吗 and 呢 on the same question.', 'Đặt 也/都 sau động từ (“我是也学生” sai) và thêm 很 trước 是 (“我很是学生”). Không dùng 吗 và 呢 trong cùng một câu hỏi.'],
    s: [['Surname first; 姓 = surname only, 叫 = full name.', 'Họ đứng trước; 姓 chỉ họ, 叫 cả họ tên.'], ['A 是 B; negative 不是; question + 吗.', 'A 是 B; phủ định 不是; hỏi thêm 吗.'], ['也 and 都 stand before the verb.', '也 và 都 đứng trước động từ.']],
    l: ['name', 'gram', 'mdbg'],
    p: [['Translate: “I am not a teacher; I am a student.”', 'Dịch: “Tôi không phải giáo viên, tôi là học sinh.”', '我不是老师，我是学生。', '我不是老师，我是学生。'], ['Make a question from 他是中国人.', 'Biến 他是中国人 thành câu hỏi.', '他是中国人吗？', '他是中国人吗？'], ['Order the words: 都 学生 是 我们', 'Sắp xếp: 都 学生 是 我们', '我们都是学生。', '我们都是学生。']] }),

  D(P + '3-3', '3.3 Introducing people & question words', '3.3 Giới thiệu người và từ để hỏi', 'Giới thiệu bằng 这是/那是, hỏi 谁, 什么, 哪, 几.', {
    n: '3.3',
    g: [['Introduce a friend and yourself in 5 sentences', 'Giới thiệu bạn bè và bản thân bằng 5 câu'], ['Use 谁, 什么, 哪, 哪儿, 几', 'Dùng 谁, 什么, 哪, 哪儿, 几'], ['Understand that question words stay in place', 'Hiểu từ để hỏi giữ nguyên vị trí']],
    b: [`<p><strong>Introductions.</strong> <span lang="zh">这是我的朋友，他叫大卫。</span> “This is my friend, his name is David.” Use <span lang="zh">认识你很高兴</span> or <span lang="zh">很高兴认识你</span> (nice to meet you), <span lang="zh">请多关照</span> for “please take care of me” in a new group.</p>
<p><strong>Question words keep the position of the answer.</strong> Unlike English, there is no fronting: <span lang="zh">你叫什么名字？</span> → <span lang="zh">我叫明</span>. <span lang="zh">他是谁？</span> → <span lang="zh">他是我哥哥</span>. <span lang="zh">你是哪国人？</span> → <span lang="zh">我是越南人</span>. <span lang="zh">你在哪儿学习？</span> → <span lang="zh">我在河内学习</span>. Do not add <span lang="zh">吗</span> to a question that already has a question word.</p>
<p><strong>Pronouns.</strong> <span lang="zh">我 你 他 她 它</span> (he, she, it: all pronounced tā); plural <span lang="zh">们</span>: <span lang="zh">我们 你们 他们</span>. A short self-introduction pattern: name · nationality · job · hometown.</p>`,
       `<p><strong>Giới thiệu.</strong> <span lang="zh">这是我的朋友，他叫大卫。</span> “Đây là bạn tôi, anh ấy tên David.” Dùng <span lang="zh">认识你很高兴</span> hoặc <span lang="zh">很高兴认识你</span> (rất vui được làm quen), <span lang="zh">请多关照</span> (xin giúp đỡ) khi vào nhóm mới.</p>
<p><strong>Từ để hỏi đứng đúng chỗ của câu trả lời.</strong> Khác tiếng Anh, không đảo lên đầu: <span lang="zh">你叫什么名字？</span> → <span lang="zh">我叫明</span>. <span lang="zh">他是谁？</span> → <span lang="zh">他是我哥哥</span>. <span lang="zh">你是哪国人？</span> → <span lang="zh">我是越南人</span>. <span lang="zh">你在哪儿学习？</span> → <span lang="zh">我在河内学习</span>. Không thêm <span lang="zh">吗</span> vào câu đã có từ để hỏi.</p>
<p><strong>Đại từ.</strong> <span lang="zh">我 你 他 她 它</span> (anh, cô, nó: đều đọc tā); số nhiều thêm <span lang="zh">们</span>: <span lang="zh">我们 你们 他们</span>. Mẫu tự giới thiệu: tên · quốc tịch · nghề · quê.</p>`],
    v: [['这', 'zhè', 'this', 'đây, này'], ['那', 'nà', 'that', 'kia, đó'], ['谁', 'shéi', 'who', 'ai'], ['他', 'tā', 'he', 'anh ấy'], ['她', 'tā', 'she', 'cô ấy'], ['朋友', 'péngyou', 'friend', 'bạn'], ['哪儿', 'nǎr', 'where', 'ở đâu'], ['高兴', 'gāoxìng', 'happy', 'vui'], ['认识', 'rènshi', 'to know (a person)', 'quen biết'], ['介绍', 'jièshào', 'to introduce', 'giới thiệu'], ['河内', 'Hénèi', 'Hanoi', 'Hà Nội']],
    d: [['A', '这是我的朋友，她叫李红。', 'Zhè shì wǒ de péngyou, tā jiào Lǐ Hóng.', 'This is my friend, her name is Li Hong.', 'Đây là bạn tôi, cô ấy tên Lý Hồng.'], ['B', '你好，认识你很高兴。', 'Nǐ hǎo, rènshi nǐ hěn gāoxìng.', 'Hello, nice to meet you.', 'Chào bạn, rất vui được quen bạn.'], ['C', '我也很高兴。你是哪国人？', 'Wǒ yě hěn gāoxìng. Nǐ shì nǎ guó rén?', 'Me too. Which country are you from?', 'Tôi cũng rất vui. Bạn là người nước nào?'], ['B', '我是越南人，在河内学习。', 'Wǒ shì Yuènán rén, zài Hénèi xuéxí.', 'I am Vietnamese and study in Hanoi.', 'Tôi là người Việt, học ở Hà Nội.']],
    pit: ['English speakers put 谁/什么 at the start (“什么你叫?”). Keep the normal word order. Also 谁 can be read shéi or shuí; both are fine.', 'Người học hay đưa 谁/什么 lên đầu câu (“什么你叫?”). Giữ nguyên trật tự bình thường. 谁 đọc shéi hoặc shuí đều được.'],
    s: [['这是 + N introduces a person or thing.', '这是 + N dùng để giới thiệu người, vật.'], ['Question words stay where the answer goes.', 'Từ để hỏi đứng ở chỗ câu trả lời.'], ['们 makes pronouns plural; 他/她/它 all read tā.', '们 làm đại từ số nhiều; 他/她/它 đều đọc tā.']],
    l: ['gram', 'coursera', 'wikib'],
    p: [['Ask “Who is she?” in Chinese.', 'Hỏi “Cô ấy là ai?” bằng tiếng Trung.', '她是谁？', '她是谁？'], ['Correct: 你是谁国人？', 'Sửa: 你是谁国人？', '你是哪国人？', '你是哪国人？'], ['Write a 4-sentence self-introduction.', 'Viết đoạn tự giới thiệu 4 câu.', 'Eg: 我叫明。我是越南人。我是学生。我在河内学习。', 'Vd: 我叫明。我是越南人。我是学生。我在河内学习。']] }),

  Q(P + 'quiz-3', 'Quiz 3 — Greetings', 'Quiz 3 — Chào hỏi', [
    [['“You’re welcome” is:', '“Không có gì” là:'], ['不客气', '对不起', '再见', '请问'], 0, ['不客气 answers thanks.', '不客气 đáp lại cảm ơn.']],
    [['Polite “you”:', '“Bạn” dạng lịch sự:'], ['你们', '您', '他', '我'], 1, ['您 nín.', '您 nín.']],
    [['Correct word order:', 'Trật tự đúng:'], ['我是也学生', '我也是学生', '也我是学生', '我是学生也'], 1, ['也 comes before the verb.', '也 đứng trước động từ.']],
    [['Which question is wrong?', 'Câu hỏi nào sai?'], ['你是谁？', '你是学生吗？', '你叫什么名字吗？', '你是哪国人？'], 2, ['Do not use 吗 with a question word.', 'Không dùng 吗 với từ để hỏi.']],
    [['“我姓王” means:', '“我姓王” nghĩa là:'], ['I am called Wang Li', 'My surname is Wang', 'I like Wang', 'I am Wang’s friend'], 1, ['姓 gives the surname only.', '姓 chỉ họ.']],
    [['What does 我们都是学生 mean?', '我们都是学生 nghĩa là:'], ['We are all students', 'We are also students', 'I am a student', 'They are students'], 0, ['都 = all.', '都 = đều.']],
    [['The pinyin of 对不起 is:', 'Pinyin của 对不起:'], ['duìbuqǐ', 'dùibùqì', 'duībuqí', 'duìbúqǐ'], 0, ['不 is neutral here.', '不 ở đây đọc nhẹ.']],
    [['“你呢?” is used to:', '“你呢?” dùng để:'], ['Return the same question', 'Say goodbye', 'Deny', 'Thank'], 0, ['It means “and you?”.', 'Nghĩa là “còn bạn?”.']],
  ]),
]));

// ===== Chương 4: Số và thời gian =====
secs.push(SEC('Chapter 4 — Numbers, dates and time', 'Chương 4 — Số đếm, ngày tháng và giờ giấc',
  'Số 0–100, ngày tháng, thứ, giờ, trật tự từ chỉ thời gian.', [
  D(P + '4-1', '4.1 Numbers 0–100', '4.1 Số đếm 0–100', 'Số, 二 và 两, số điện thoại.', {
    n: '4.1',
    g: [['Count 0–100', 'Đếm 0–100'], ['Choose between 二 and 两', 'Chọn giữa 二 và 两'], ['Read phone numbers and ages', 'Đọc số điện thoại và tuổi']],
    b: [`<p>Digits: <span lang="zh">零 líng 0, 一 yī 1, 二 èr 2, 三 sān 3, 四 sì 4, 五 wǔ 5, 六 liù 6, 七 qī 7, 八 bā 8, 九 jiǔ 9, 十 shí 10</span>. The system is regular: 11 = 十一, 20 = 二十, 21 = 二十一, 99 = 九十九, 100 = 一百 yì bǎi.</p>
<p><strong>二 vs 两.</strong> <span lang="zh">二</span> is for counting, ordinals and numbers (十二, 第二); <span lang="zh">两</span> liǎng is “two of something” before a measure word: <span lang="zh">两个人</span>, <span lang="zh">两本书</span>. Two hundred: <span lang="zh">两百</span> (also 二百).</p>
<p><strong>Phone numbers</strong> are read digit by digit, with <span lang="zh">一</span> often said <em>yāo</em> to avoid confusion with 七. Example: 138-0000-1234 → yāo sān bā …. Hint on culture: 八 bā sounds like 发 (get rich), so it is lucky; 四 sounds like 死 (death), so it is avoided.</p>`,
       `<p>Chữ số: <span lang="zh">零 líng 0, 一 yī 1, 二 èr 2, 三 sān 3, 四 sì 4, 五 wǔ 5, 六 liù 6, 七 qī 7, 八 bā 8, 九 jiǔ 9, 十 shí 10</span>. Hệ đếm rất đều: 11 = 十一, 20 = 二十, 21 = 二十一, 99 = 九十九, 100 = 一百 yì bǎi.</p>
<p><strong>二 và 两.</strong> <span lang="zh">二</span> dùng khi đếm, số thứ tự và trong số (十二, 第二); <span lang="zh">两</span> liǎng là “hai cái” đứng trước lượng từ: <span lang="zh">两个人</span>, <span lang="zh">两本书</span>. Hai trăm: <span lang="zh">两百</span> (cũng nói 二百).</p>
<p><strong>Số điện thoại</strong> đọc từng chữ số, <span lang="zh">一</span> thường đọc <em>yāo</em> để khỏi lẫn với 七. Ví dụ: 138-0000-1234 → yāo sān bā …. Văn hoá: 八 bā gần âm 发 (phát tài) nên may mắn; 四 gần âm 死 (chết) nên bị kiêng.</p>`],
    v: [['零', 'líng', 'zero', 'không'], ['七', 'qī', 'seven', 'bảy'], ['八', 'bā', 'eight', 'tám'], ['九', 'jiǔ', 'nine', 'chín'], ['十', 'shí', 'ten', 'mười'], ['二十一', 'èrshíyī', 'twenty-one', 'hai mươi mốt'], ['九十九', 'jiǔshíjiǔ', 'ninety-nine', 'chín mươi chín'], ['一百', 'yì bǎi', 'one hundred', 'một trăm'], ['两', 'liǎng', 'two (before measure word)', 'hai (trước lượng từ)'], ['多少', 'duōshao', 'how many/much', 'bao nhiêu'], ['几', 'jǐ', 'how many (<10)', 'mấy']],
    pit: ['Saying 二个人 instead of 两个人, and confusing 几 (expecting small numbers) with 多少 (any number).', 'Nói 二个人 thay vì 两个人; lẫn 几 (số nhỏ, dưới 10) với 多少 (số bất kỳ).'],
    s: [['0–10 then regular combinations.', '0–10 rồi ghép đều đặn.'], ['两 before measure words; 二 in numbers.', '两 trước lượng từ; 二 trong số.'], ['几 for small numbers; 多少 for any amount.', '几 cho số nhỏ; 多少 cho số bất kỳ.']],
    l: ['num', 'chart', 'mdbg'],
    p: [['Write in Chinese: 15, 38, 100.', 'Viết bằng chữ Hán: 15, 38, 100.', '十五，三十八，一百。', '十五，三十八，一百。'], ['二个 or 两个 before 学生?', '二个 hay 两个 trước 学生?', '两个学生.', '两个学生.'], ['Why is 四 unlucky?', 'Vì sao 四 bị kiêng?', 'It sounds like 死 (death).', 'Gần âm 死 (chết).']] }),

  D(P + '4-2', '4.2 Dates and days of the week', '4.2 Ngày, tháng, thứ', 'Năm tháng ngày, 星期, cấu trúc không cần 是.', {
    n: '4.2',
    g: [['Say and write dates in Chinese order', 'Nói và viết ngày theo trật tự tiếng Trung'], ['Use 星期 and relative day words', 'Dùng 星期 và các từ chỉ ngày tương đối'], ['Ask about dates', 'Hỏi về ngày tháng']],
    b: [`<p>Chinese goes from <em>big to small</em>: year → month → day → weekday. <span lang="zh">2026年11月9日</span> reads <em>èr líng èr liù nián shíyī yuè jiǔ rì</em> (years are read digit by digit). Spoken day is <span lang="zh">号</span> hào: <span lang="zh">十一月九号</span>. Months are number + <span lang="zh">月</span>: <span lang="zh">一月</span> … <span lang="zh">十二月</span> (no special names).</p>
<p><strong>Weekdays.</strong> <span lang="zh">星期一 … 星期六</span>, and Sunday is <span lang="zh">星期天</span> or <span lang="zh">星期日</span>. Ask <span lang="zh">今天星期几？</span> and <span lang="zh">今天几月几号？</span> Answers need no 是: <span lang="zh">今天星期一。</span> (date/day predicates are nouns). Negative needs it: <span lang="zh">今天不是星期二。</span></p>
<p>Relative days: <span lang="zh">前天 昨天 今天 明天 后天</span>; weeks: <span lang="zh">上星期 这星期 下星期</span> (last, this, next). Birthdays: <span lang="zh">你的生日是几月几号？</span> Culture: the lunar calendar and 12 zodiac animals still matter for festivals.</p>`,
       `<p>Tiếng Trung đi từ <em>lớn đến nhỏ</em>: năm → tháng → ngày → thứ. <span lang="zh">2026年11月9日</span> đọc là <em>èr líng èr liù nián shíyī yuè jiǔ rì</em> (năm đọc từng chữ số). Khẩu ngữ gọi ngày là <span lang="zh">号</span> hào: <span lang="zh">十一月九号</span>. Tháng là số + <span lang="zh">月</span>: <span lang="zh">一月</span> … <span lang="zh">十二月</span> (không có tên riêng).</p>
<p><strong>Thứ.</strong> <span lang="zh">星期一 … 星期六</span>, chủ nhật là <span lang="zh">星期天</span> hoặc <span lang="zh">星期日</span>. Hỏi <span lang="zh">今天星期几？</span> và <span lang="zh">今天几月几号？</span> Câu trả lời không cần 是: <span lang="zh">今天星期一。</span> (vị ngữ ngày tháng là danh từ). Phủ định thì phải có: <span lang="zh">今天不是星期二。</span></p>
<p>Ngày tương đối: <span lang="zh">前天 昨天 今天 明天 后天</span>; tuần: <span lang="zh">上星期 这星期 下星期</span> (tuần trước, này, sau). Sinh nhật: <span lang="zh">你的生日是几月几号？</span> Văn hoá: âm lịch và 12 con giáp vẫn quan trọng với lễ tết.</p>`],
    v: [['年', 'nián', 'year', 'năm'], ['月', 'yuè', 'month', 'tháng'], ['号', 'hào', 'day (spoken)', 'ngày (khẩu ngữ)'], ['星期', 'xīngqī', 'week', 'tuần, thứ'], ['星期天', 'xīngqītiān', 'Sunday', 'chủ nhật'], ['今天', 'jīntiān', 'today', 'hôm nay'], ['昨天', 'zuótiān', 'yesterday', 'hôm qua'], ['明天', 'míngtiān', 'tomorrow', 'ngày mai'], ['生日', 'shēngrì', 'birthday', 'sinh nhật'], ['下星期', 'xià xīngqī', 'next week', 'tuần sau']],
    pit: ['Saying 今天是星期三 is fine, but 今天很星期三 is not. Do not reverse the order (“9号11月”).', 'Nói 今天是星期三 được, nhưng 今天很星期三 thì sai. Không đảo trật tự (“9号11月”).'],
    s: [['Date order: year, month, day, weekday.', 'Trật tự: năm, tháng, ngày, thứ.'], ['星期一–六, 星期天/日.', '星期一–六, 星期天/日.'], ['Date predicates omit 是 in affirmative.', 'Vị ngữ ngày tháng bỏ 是 ở câu khẳng định.']],
    l: ['cal', 'zod', 'num'],
    p: [['Write “Friday”.', 'Viết “thứ sáu”.', '星期五.', '星期五.'], ['Answer: 今天几月几号？ (9 Nov)', 'Trả lời: 今天几月几号？ (9/11)', '今天十一月九号。', '今天十一月九号。'], ['What is 后天?', '后天 là gì?', 'The day after tomorrow.', 'Ngày kia.']] }),

  D(P + '4-3', '4.3 Clock time & time-word order', '4.3 Giờ giấc và vị trí từ chỉ thời gian', '点, 分, 半, 刻, 差; thời gian đứng trước động từ.', {
    n: '4.3',
    g: [['Tell the time', 'Nói giờ'], ['Put time words in the right place', 'Đặt từ chỉ thời gian đúng chỗ'], ['Describe a daily routine', 'Mô tả thói quen hằng ngày']],
    b: [`<p>Time = number + <span lang="zh">点</span> diǎn (o’clock) + number + <span lang="zh">分</span> fēn. <span lang="zh">8:00 八点</span>; <span lang="zh">8:05 八点零五分</span>; <span lang="zh">8:15 八点一刻</span> (quarter); <span lang="zh">8:30 八点半</span>; <span lang="zh">8:55 差五分九点</span> (five minutes to nine). For 2:00 say <span lang="zh">两点</span>, not 二点. Ask <span lang="zh">现在几点？</span></p>
<p>Parts of the day: <span lang="zh">早上 上午 中午 下午 晚上</span>; they come <em>before</em> the clock time: <span lang="zh">下午三点</span>.</p>
<p><strong>Word order rule.</strong> Time words (when) go <em>before the verb</em>, either after the subject or at the very start: <span lang="zh">我八点起床</span> / <span lang="zh">八点我起床</span>. Never at the end as in English or Vietnamese. With both time and place: subject + time + place + verb: <span lang="zh">我晚上在家学习</span>.</p>`,
       `<p>Giờ = số + <span lang="zh">点</span> diǎn (giờ) + số + <span lang="zh">分</span> fēn (phút). <span lang="zh">8:00 八点</span>; <span lang="zh">8:05 八点零五分</span>; <span lang="zh">8:15 八点一刻</span> (một khắc); <span lang="zh">8:30 八点半</span>; <span lang="zh">8:55 差五分九点</span> (9 giờ kém 5). Hai giờ nói <span lang="zh">两点</span>, không nói 二点. Hỏi <span lang="zh">现在几点？</span></p>
<p>Buổi trong ngày: <span lang="zh">早上 上午 中午 下午 晚上</span>; đứng <em>trước</em> giờ: <span lang="zh">下午三点</span>.</p>
<p><strong>Quy tắc trật tự từ.</strong> Từ chỉ thời gian (khi nào) đứng <em>trước động từ</em>, sau chủ ngữ hoặc ngay đầu câu: <span lang="zh">我八点起床</span> / <span lang="zh">八点我起床</span>. Không đặt cuối câu như tiếng Việt, tiếng Anh. Có cả thời gian và nơi chốn: chủ ngữ + thời gian + nơi chốn + động từ: <span lang="zh">我晚上在家学习</span>.</p>`],
    v: [['点', 'diǎn', 'o’clock', 'giờ'], ['分', 'fēn', 'minute', 'phút'], ['半', 'bàn', 'half', 'rưỡi'], ['一刻', 'yí kè', 'quarter hour', 'mười lăm phút'], ['差', 'chà', 'to lack, to be short of', 'kém'], ['现在', 'xiànzài', 'now', 'bây giờ'], ['起床', 'qǐchuáng', 'get up', 'thức dậy'], ['上课', 'shàngkè', 'attend class', 'vào học'], ['吃饭', 'chīfàn', 'eat a meal', 'ăn cơm'], ['睡觉', 'shuìjiào', 'sleep', 'ngủ'], ['下午', 'xiàwǔ', 'afternoon', 'buổi chiều']],
    d: [['A', '现在几点？', 'Xiànzài jǐ diǎn?', 'What time is it?', 'Bây giờ mấy giờ?'], ['B', '现在七点半。', 'Xiànzài qī diǎn bàn.', 'It is seven thirty.', 'Bây giờ bảy giờ rưỡi.'], ['A', '你几点上课？', 'Nǐ jǐ diǎn shàngkè?', 'When does your class start?', 'Mấy giờ bạn vào học?'], ['B', '我八点上课，十二点吃饭。', 'Wǒ bā diǎn shàngkè, shí’èr diǎn chīfàn.', 'Class at eight, lunch at twelve.', 'Tám giờ học, mười hai giờ ăn cơm.']],
    pit: ['“我吃饭十二点” is wrong: time goes before the verb. And 二点 should be 两点.', '“我吃饭十二点” sai: thời gian phải trước động từ. 二点 phải là 两点.'],
    s: [['点 for hours, 分 for minutes, 半 half, 一刻 quarter.', '点 giờ, 分 phút, 半 rưỡi, 一刻 15 phút.'], ['Time words precede the verb.', 'Từ chỉ thời gian đứng trước động từ.'], ['2 o’clock = 两点.', '2 giờ = 两点.']],
    l: ['gram', 'coursera', 'num'],
    p: [['Write 6:15 and 9:30.', 'Viết 6:15 và 9:30.', '六点一刻；九点半。', '六点一刻；九点半。'], ['Reorder: 起床 我 七点', 'Sắp xếp: 起床 我 七点', '我七点起床。', '我七点起床。'], ['Say “I sleep at 11 pm”.', 'Nói “Tôi ngủ lúc 11 giờ tối”.', '我晚上十一点睡觉。', '我晚上十一点睡觉。']] }),

  Q(P + 'quiz-4', 'Quiz 4 — Numbers & time', 'Quiz 4 — Số và thời gian', [
    [['十二 is:', '十二 là:'], ['12', '20', '2', '102'], 0, ['10 + 2.', '10 + 2.']],
    [['“two students” is:', '“hai học sinh” là:'], ['二个学生', '两个学生', '二学生', '两学生个'], 1, ['两 before a measure word.', '两 trước lượng từ.']],
    [['Which is Sunday?', 'Chủ nhật là:'], ['星期天', '星期七', '星期零', '礼拜八'], 0, ['星期天 or 星期日.', '星期天 hoặc 星期日.']],
    [['8:30 is:', '8:30 là:'], ['八点半', '八点三', '八半点', '八刻三十'], 0, ['半 = half.', '半 = rưỡi.']],
    [['Correct order:', 'Trật tự đúng:'], ['我吃饭十二点', '我十二点吃饭', '十二点吃饭我', '吃饭我十二点'], 1, ['Time before the verb.', 'Thời gian trước động từ.']],
    [['Phone numbers often read 1 as:', 'Số điện thoại thường đọc 1 là:'], ['yāo', 'èr', 'liù', 'yí'], 0, ['yāo avoids confusion with qī.', 'yāo để khỏi lẫn với qī.']],
    [['“Yesterday” is:', '“Hôm qua” là:'], ['昨天', '明天', '今天', '后天'], 0, ['昨天 zuótiān.', '昨天 zuótiān.']],
    [['“Next week”:', '“Tuần sau”:'], ['上星期', '这星期', '下星期', '星期下'], 2, ['下 = next.', '下 = sau.']],
  ]),
]));

// ===== Chương 5: Gia đình & con người =====
secs.push(SEC('Chapter 5 — Family and people', 'Chương 5 — Gia đình và con người',
  'Gia đình, 有/没有, 的, tuổi, nghề nghiệp, 这/那 và lượng từ, miêu tả người.', [
  D(P + '5-1', '5.1 Family members & 有', '5.1 Thành viên gia đình và 有', 'Từ xưng hô, 有 / 没有, hỏi số người.', {
    n: '5.1',
    g: [['Name family members', 'Gọi tên các thành viên gia đình'], ['Use 有 and 没有', 'Dùng 有 và 没有'], ['Ask and answer about family size', 'Hỏi đáp về số người trong gia đình']],
    b: [`<p>Chinese kinship terms distinguish older/younger and paternal/maternal sides (grandparents: <span lang="zh">爷爷 奶奶</span> paternal, <span lang="zh">外公 外婆</span> maternal). Siblings: <span lang="zh">哥哥</span> older brother, <span lang="zh">姐姐</span> older sister, <span lang="zh">弟弟</span> younger brother, <span lang="zh">妹妹</span> younger sister.</p>
<p><strong>有 (to have).</strong> Negative is special: <span lang="zh">没有</span> (<em>never</em> 不有). <span lang="zh">我有一个姐姐，没有哥哥。</span> Question: <span lang="zh">你有姐姐吗？</span> or the verb-not-verb form <span lang="zh">你有没有姐姐？</span> Answer with <span lang="zh">有</span> / <span lang="zh">没有</span>.</p>
<p><strong>Family size.</strong> <span lang="zh">你家有几口人？</span> → <span lang="zh">我家有五口人：爸爸、妈妈、哥哥、妹妹和我。</span> 口 counts family members; <span lang="zh">和</span> hé joins nouns only (not verbs/sentences). Politeness note: mentioning one’s own family uses <span lang="zh">家</span>; <span lang="zh">我的</span> is dropped before close relations: <span lang="zh">我妈妈</span>, <span lang="zh">我家</span>.</p>`,
       `<p>Xưng hô Trung Quốc phân biệt anh/em và bên nội/ngoại (ông bà nội: <span lang="zh">爷爷 奶奶</span>, ông bà ngoại: <span lang="zh">外公 外婆</span>). Anh chị em: <span lang="zh">哥哥</span> anh trai, <span lang="zh">姐姐</span> chị gái, <span lang="zh">弟弟</span> em trai, <span lang="zh">妹妹</span> em gái.</p>
<p><strong>有 (có).</strong> Phủ định đặc biệt: <span lang="zh">没有</span> (<em>không bao giờ</em> nói 不有). <span lang="zh">我有一个姐姐，没有哥哥。</span> Hỏi: <span lang="zh">你有姐姐吗？</span> hoặc dạng chính phản <span lang="zh">你有没有姐姐？</span> Trả lời <span lang="zh">有</span> / <span lang="zh">没有</span>.</p>
<p><strong>Số người trong nhà.</strong> <span lang="zh">你家有几口人？</span> → <span lang="zh">我家有五口人：爸爸、妈妈、哥哥、妹妹和我。</span> 口 đếm thành viên gia đình; <span lang="zh">和</span> hé chỉ nối danh từ (không nối động từ/câu). Lưu ý: nói về người thân gần gũi thường bỏ <span lang="zh">的</span>: <span lang="zh">我妈妈</span>, <span lang="zh">我家</span>.</p>`],
    v: [['爸爸', 'bàba', 'dad', 'bố'], ['妈妈', 'māma', 'mom', 'mẹ'], ['爷爷', 'yéye', 'paternal grandpa', 'ông nội'], ['奶奶', 'nǎinai', 'paternal grandma', 'bà nội'], ['外公', 'wàigōng', 'maternal grandpa', 'ông ngoại'], ['外婆', 'wàipó', 'maternal grandma', 'bà ngoại'], ['哥哥', 'gēge', 'older brother', 'anh trai'], ['姐姐', 'jiějie', 'older sister', 'chị gái'], ['弟弟', 'dìdi', 'younger brother', 'em trai'], ['妹妹', 'mèimei', 'younger sister', 'em gái'], ['有', 'yǒu', 'to have', 'có'], ['没有', 'méiyǒu', 'not have', 'không có'], ['和', 'hé', 'and', 'và']],
    d: [['A', '你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'How many are in your family?', 'Nhà bạn có mấy người?'], ['B', '我家有四口人，爸爸、妈妈、妹妹和我。', 'Wǒ jiā yǒu sì kǒu rén, bàba, māma, mèimei hé wǒ.', 'Four: dad, mom, younger sister and me.', 'Bốn người: bố, mẹ, em gái và tôi.'], ['A', '你有哥哥吗？', 'Nǐ yǒu gēge ma?', 'Do you have an older brother?', 'Bạn có anh trai không?'], ['B', '没有，我有一个妹妹。', 'Méiyǒu, wǒ yǒu yí gè mèimei.', 'No, I have one younger sister.', 'Không, tôi có một em gái.']],
    pit: ['“我不有姐姐” is wrong → 我没有姐姐. And 和 cannot join verbs: use 也 or 还 instead.', '“我不有姐姐” sai → 我没有姐姐. 和 không nối động từ: dùng 也 hoặc 还.'],
    s: [['Older/younger and paternal/maternal terms are distinct.', 'Xưng hô phân biệt lớn/nhỏ, nội/ngoại.'], ['Negative of 有 is 没有.', 'Phủ định của 有 là 没有.'], ['几口人 asks about family size.', '几口人 hỏi số người trong nhà.']],
    l: ['kin', 'name', 'mdbg'],
    p: [['Say “I do not have a younger brother”.', 'Nói “Tôi không có em trai”.', '我没有弟弟。', '我没有弟弟。'], ['Ask “Does she have an older sister?” two ways.', 'Hỏi “Cô ấy có chị gái không?” hai cách.', '她有姐姐吗？/ 她有没有姐姐？', '她有姐姐吗？/ 她有没有姐姐？'], ['Which grandma is 外婆?', '外婆 là bà nào?', 'Maternal grandmother.', 'Bà ngoại.']] }),

  D(P + '5-2', '5.2 Age, jobs & possession 的', '5.2 Tuổi, nghề nghiệp và sở hữu 的', 'Hỏi tuổi, nghề, 在…工作, 的.', {
    n: '5.2',
    g: [['Ask and tell age', 'Hỏi và nói tuổi'], ['Name common jobs', 'Gọi tên các nghề thông dụng'], ['Use 的 for possession', 'Dùng 的 để chỉ sở hữu']],
    b: [`<p><strong>Age.</strong> Children: <span lang="zh">你几岁了？</span> → <span lang="zh">我五岁了。</span> Peers: <span lang="zh">你多大了？</span> Elders: <span lang="zh">您多大年纪？</span> / <span lang="zh">您今年多大岁数？</span> Answer: number + <span lang="zh">岁</span>: <span lang="zh">我十九岁。</span> No verb is needed (like dates). The sentence-final <span lang="zh">了</span> marks the current state (“is now”).</p>
<p><strong>Jobs.</strong> <span lang="zh">你做什么工作？</span> → <span lang="zh">我是医生。</span> Workplace: <span lang="zh">在……工作</span>: <span lang="zh">我爸爸在银行工作。</span> Note the order: in + place + work.</p>
<p><strong>的 de.</strong> N1 + 的 + N2 = N1’s N2: <span lang="zh">老师的书</span>; adjectives: <span lang="zh">漂亮的衣服</span>. Drop 的 for close relationships and pronouns+kin: <span lang="zh">我朋友</span>, <span lang="zh">他爸爸</span>, <span lang="zh">我们学校</span>. Without a noun: <span lang="zh">这本书是我的</span> (“…is mine”).</p>`,
       `<p><strong>Tuổi.</strong> Trẻ em: <span lang="zh">你几岁了？</span> → <span lang="zh">我五岁了。</span> Cùng lứa: <span lang="zh">你多大了？</span> Người lớn tuổi: <span lang="zh">您多大年纪？</span> / <span lang="zh">您今年多大岁数？</span> Trả lời: số + <span lang="zh">岁</span>: <span lang="zh">我十九岁。</span> Không cần động từ (như ngày tháng). <span lang="zh">了</span> cuối câu chỉ trạng thái hiện tại (“nay đã”).</p>
<p><strong>Nghề nghiệp.</strong> <span lang="zh">你做什么工作？</span> → <span lang="zh">我是医生。</span> Nơi làm việc: <span lang="zh">在……工作</span>: <span lang="zh">我爸爸在银行工作。</span> Lưu ý trật tự: ở + nơi + làm việc.</p>
<p><strong>的 de.</strong> N1 + 的 + N2 = N2 của N1: <span lang="zh">老师的书</span>; tính từ: <span lang="zh">漂亮的衣服</span>. Bỏ 的 với quan hệ gần gũi và đại từ + người thân: <span lang="zh">我朋友</span>, <span lang="zh">他爸爸</span>, <span lang="zh">我们学校</span>. Không có danh từ phía sau: <span lang="zh">这本书是我的</span> (“…là của tôi”).</p>`],
    v: [['岁', 'suì', 'years old', 'tuổi'], ['多大', 'duō dà', 'how old', 'bao nhiêu tuổi'], ['工作', 'gōngzuò', 'job; to work', 'công việc; làm việc'], ['医生', 'yīshēng', 'doctor', 'bác sĩ'], ['老师', 'lǎoshī', 'teacher', 'giáo viên'], ['学生', 'xuésheng', 'student', 'học sinh'], ['工程师', 'gōngchéngshī', 'engineer', 'kỹ sư'], ['司机', 'sījī', 'driver', 'tài xế'], ['银行', 'yínháng', 'bank', 'ngân hàng'], ['医院', 'yīyuàn', 'hospital', 'bệnh viện'], ['的', 'de', 'possessive particle', 'trợ từ sở hữu'], ['今年', 'jīnnián', 'this year', 'năm nay']],
    pit: ['“我的爸爸” is not wrong, but sounds stiff; “我爸爸” is natural. And “我在工作银行” breaks the order.', '“我的爸爸” không sai nhưng nặng nề; “我爸爸” tự nhiên. “我在工作银行” sai trật tự.'],
    s: [['岁 after the number; 几岁 children, 多大 peers.', '岁 sau số; 几岁 cho trẻ, 多大 cho cùng lứa.'], ['在 + place + 工作.', '在 + nơi + 工作.'], ['的 links owner and thing; drop it for close kin.', '的 nối chủ và vật; bỏ khi nói người thân gần.']],
    l: ['gram', 'mdbg', 'wikib'],
    p: [['Say “My father is an engineer; he works in a bank.”', 'Nói “Bố tôi là kỹ sư, làm ở ngân hàng.”', '我爸爸是工程师，他在银行工作。', '我爸爸是工程师，他在银行工作。'], ['Ask a 4-year-old’s age.', 'Hỏi tuổi em bé 4 tuổi.', '你几岁了？', '你几岁了？'], ['Make “teacher’s book”.', 'Viết “sách của giáo viên”.', '老师的书。', '老师的书。']] }),

  D(P + '5-3', '5.3 This/that, measure words & describing people', '5.3 这/那, lượng từ và miêu tả người', 'Chỉ định, lượng từ 个 本 杯, tính từ vị ngữ.', {
    n: '5.3',
    g: [['Use 这/那 with measure words', 'Dùng 这/那 với lượng từ'], ['Know 8 common measure words', 'Biết 8 lượng từ thông dụng'], ['Describe people with adjectives', 'Miêu tả người bằng tính từ']],
    b: [`<p><strong>Measure words (<span lang="zh">量词</span>)</strong> are required between a number/demonstrative and a noun: number + MW + noun. <span lang="zh">一个人</span>, <span lang="zh">两本书</span>, <span lang="zh">三杯茶</span>, <span lang="zh">这个学生</span>, <span lang="zh">那件衣服</span>. Common: <span lang="zh">个</span> gè (general), <span lang="zh">本</span> běn (books), <span lang="zh">杯</span> bēi (cups), <span lang="zh">件</span> jiàn (clothes, matters), <span lang="zh">张</span> zhāng (flat things), <span lang="zh">只</span> zhī (animals), <span lang="zh">瓶</span> píng (bottles), <span lang="zh">位</span> wèi (polite, people).</p>
<p><strong>This/that.</strong> <span lang="zh">这个 / 那个</span> (singular), <span lang="zh">这些 / 那些</span> (these/those), place: <span lang="zh">这儿 / 那儿</span>. Ask <span lang="zh">这是什么？</span>, <span lang="zh">那是谁的书？</span></p>
<p><strong>Adjective predicates.</strong> No 是: <span lang="zh">她很漂亮</span>, <span lang="zh">他很高</span>. Negative: <span lang="zh">他不高</span> (no 很). Question: <span lang="zh">他高吗？</span> Without 很 it feels comparative. Intensifiers: <span lang="zh">非常 fēicháng</span>, <span lang="zh">太……了</span>.</p>`,
       `<p><strong>Lượng từ (<span lang="zh">量词</span>)</strong> bắt buộc giữa số/chỉ định và danh từ: số + lượng từ + danh từ. <span lang="zh">一个人</span>, <span lang="zh">两本书</span>, <span lang="zh">三杯茶</span>, <span lang="zh">这个学生</span>, <span lang="zh">那件衣服</span>. Thông dụng: <span lang="zh">个</span> gè (chung), <span lang="zh">本</span> běn (sách), <span lang="zh">杯</span> bēi (cốc), <span lang="zh">件</span> jiàn (áo, việc), <span lang="zh">张</span> zhāng (vật phẳng), <span lang="zh">只</span> zhī (con vật), <span lang="zh">瓶</span> píng (chai), <span lang="zh">位</span> wèi (lịch sự, người).</p>
<p><strong>Này/kia.</strong> <span lang="zh">这个 / 那个</span> (số ít), <span lang="zh">这些 / 那些</span> (những cái này/kia), nơi chốn: <span lang="zh">这儿 / 那儿</span>. Hỏi <span lang="zh">这是什么？</span>, <span lang="zh">那是谁的书？</span></p>
<p><strong>Vị ngữ tính từ.</strong> Không dùng 是: <span lang="zh">她很漂亮</span>, <span lang="zh">他很高</span>. Phủ định: <span lang="zh">他不高</span> (không có 很). Hỏi: <span lang="zh">他高吗？</span> Không có 很 nghe như so sánh. Tăng nghĩa: <span lang="zh">非常 fēicháng</span>, <span lang="zh">太……了</span>.</p>`],
    v: [['个', 'gè', 'general measure word', 'lượng từ chung'], ['本', 'běn', 'measure word for books', 'lượng từ sách'], ['杯', 'bēi', 'cup, glass', 'cốc, ly'], ['件', 'jiàn', 'piece (clothes)', 'chiếc (áo)'], ['只', 'zhī', 'measure word for animals', 'lượng từ con vật'], ['这些', 'zhèxiē', 'these', 'những cái này'], ['高', 'gāo', 'tall', 'cao'], ['矮', 'ǎi', 'short', 'thấp'], ['漂亮', 'piàoliang', 'pretty', 'xinh đẹp'], ['帅', 'shuài', 'handsome', 'đẹp trai'], ['非常', 'fēicháng', 'extremely', 'vô cùng']],
    pit: ['Dropping the measure word (“三书”) or adding 是 before an adjective (“她是很漂亮”).', 'Bỏ lượng từ (“三书”) hoặc thêm 是 trước tính từ (“她是很漂亮”).'],
    s: [['Number/demonstrative + measure word + noun.', 'Số/chỉ định + lượng từ + danh từ.'], ['个 is the safe default measure word.', '个 là lượng từ an toàn mặc định.'], ['Adjective predicates take 很, not 是.', 'Vị ngữ tính từ dùng 很, không dùng 是.']],
    l: ['cls', 'gram', 'mdbg'],
    p: [['Fill the measure word: 三__书, 两__茶.', 'Điền lượng từ: 三__书, 两__茶.', '本; 杯.', '本; 杯.'], ['Translate: “That girl is very pretty.”', 'Dịch: “Cô gái kia rất xinh.”', '那个女孩儿很漂亮。', '那个女孩儿很漂亮。'], ['Negate 他很高.', 'Phủ định 他很高.', '他不高。', '他不高。']] }),

  Q(P + 'quiz-5', 'Quiz 5 — Family & people', 'Quiz 5 — Gia đình và con người', [
    [['“I do not have a sister”:', '“Tôi không có chị gái”:'], ['我不有姐姐', '我没有姐姐', '我有没姐姐', '我没姐姐有'], 1, ['有 is negated with 没.', '有 phủ định bằng 没.']],
    [['Maternal grandfather:', 'Ông ngoại:'], ['爷爷', '外公', '奶奶', '外婆'], 1, ['外公 wàigōng.', '外公 wàigōng.']],
    [['Ask a child’s age:', 'Hỏi tuổi trẻ nhỏ:'], ['你多大？', '你几岁了？', '你什么岁？', '你有岁吗？'], 1, ['几岁 for children.', '几岁 dùng cho trẻ.']],
    [['Which is natural?', 'Câu nào tự nhiên?'], ['我的妈妈', '我妈妈', '妈妈我', '我是妈妈'], 1, ['的 is dropped before close kin.', 'Bỏ 的 trước người thân gần.']],
    [['Measure word for books:', 'Lượng từ cho sách:'], ['杯', '本', '只', '张'], 1, ['本 běn.', '本 běn.']],
    [['Negative: 他很高 →', 'Phủ định: 他很高 →'], ['他不很高', '他不高', '他没高', '他不是高'], 1, ['Drop 很 when negating.', 'Bỏ 很 khi phủ định.']],
    [['“Works in a bank”:', '“Làm ở ngân hàng”:'], ['在银行工作', '工作在银行', '银行在工作', '工作银行'], 0, ['在 + place + verb.', '在 + nơi + động từ.']],
    [['这些 means:', '这些 nghĩa là:'], ['this', 'these', 'that', 'those'], 1, ['些 = plural.', '些 = số nhiều.']],
  ]),
]));
// ===== Chương 6: Học tập và sinh hoạt =====
secs.push(SEC('Chapter 6 — Study and daily life', 'Chương 6 — Học tập và sinh hoạt',
  'Động từ học tập, 在/去/来 với nơi chốn, động từ năng nguyện.', [
  D(P + '6-1', '6.1 Study vocabulary & verb–object sentences', '6.1 Từ vựng học tập và câu động từ–tân ngữ', 'Mẫu S+V+O, hỏi 吗, phủ định 不.', {
    n: '6.1',
    g: [['Name school objects and activities', 'Gọi tên đồ dùng và hoạt động ở trường'], ['Build S + V + O sentences', 'Lập câu S + V + O'], ['Negate and question action verbs', 'Phủ định và hỏi động từ hành động']],
    b: [`<p>Chinese verbs <strong>never conjugate</strong>: <span lang="zh">学</span> is the same for I, you, he, past or future (time words show when). Basic order: Subject + Verb + Object: <span lang="zh">我学汉语</span>, <span lang="zh">他看书</span>, <span lang="zh">我们听音乐</span>.</p>
<p>Negative <span lang="zh">不</span> + verb (habit/present/future): <span lang="zh">我不喝咖啡</span>. Yes/no: <span lang="zh">你学英语吗？</span> Alternatively V-not-V: <span lang="zh">你学不学英语？</span> (no 吗). Adverbs <span lang="zh">也 都 很</span> go before the verb; <span lang="zh">常常 chángcháng</span> (often), <span lang="zh">每天 měitiān</span> (every day).</p>
<p>Many verb–object pairs are compounds that can split: <span lang="zh">上课</span> (have class), <span lang="zh">睡觉</span>, <span lang="zh">吃饭</span>, <span lang="zh">说话</span>. Because they already contain an object, add a second object with care: <span lang="zh">我学习汉语</span> (OK), but <span lang="zh">我说话汉语</span> (wrong).</p>`,
       `<p>Động từ tiếng Trung <strong>không chia</strong>: <span lang="zh">学</span> dùng giống nhau cho tôi, bạn, anh ấy, quá khứ hay tương lai (từ chỉ thời gian báo thời điểm). Trật tự cơ bản: Chủ ngữ + Động từ + Tân ngữ: <span lang="zh">我学汉语</span>, <span lang="zh">他看书</span>, <span lang="zh">我们听音乐</span>.</p>
<p>Phủ định <span lang="zh">不</span> + động từ (thói quen/hiện tại/tương lai): <span lang="zh">我不喝咖啡</span>. Câu hỏi có/không: <span lang="zh">你学英语吗？</span> Hoặc chính phản: <span lang="zh">你学不学英语？</span> (không có 吗). Phó từ <span lang="zh">也 都 很</span> đứng trước động từ; <span lang="zh">常常 chángcháng</span> (thường), <span lang="zh">每天 měitiān</span> (mỗi ngày).</p>
<p>Nhiều động từ là cụm động–tân có thể tách: <span lang="zh">上课</span> (vào học), <span lang="zh">睡觉</span>, <span lang="zh">吃饭</span>, <span lang="zh">说话</span>. Vì đã có tân ngữ, cẩn thận khi thêm tân ngữ nữa: <span lang="zh">我学习汉语</span> (đúng), nhưng <span lang="zh">我说话汉语</span> (sai).</p>`],
    v: [['学习', 'xuéxí', 'to study', 'học tập'], ['汉语', 'Hànyǔ', 'Chinese language', 'tiếng Trung'], ['英语', 'Yīngyǔ', 'English', 'tiếng Anh'], ['看', 'kàn', 'to look, read, watch', 'xem, đọc'], ['听', 'tīng', 'to listen', 'nghe'], ['说', 'shuō', 'to speak', 'nói'], ['读', 'dú', 'to read aloud', 'đọc'], ['写', 'xiě', 'to write', 'viết'], ['书', 'shū', 'book', 'sách'], ['同学', 'tóngxué', 'classmate', 'bạn học'], ['作业', 'zuòyè', 'homework', 'bài tập'], ['每天', 'měitiān', 'every day', 'mỗi ngày'], ['常常', 'chángcháng', 'often', 'thường']],
    pit: ['Adding tense endings (“我学了习”) or putting the time after the verb. Also 看 covers “read, watch, look at, see (a doctor)”.', 'Thêm đuôi thì (“我学了习”) hoặc đặt thời gian sau động từ. 看 bao gồm “đọc, xem, nhìn, khám (bác sĩ)”.'],
    s: [['No conjugation; word order shows meaning.', 'Không chia động từ; trật tự từ quyết định nghĩa.'], ['不 negates habits; V-not-V questions.', '不 phủ định thói quen; hỏi chính phản.'], ['Adverbs precede the verb.', 'Phó từ đứng trước động từ.']],
    l: ['gram', 'coursera', 'mdbg'],
    p: [['Translate: “We listen to music every day.”', 'Dịch: “Chúng tôi nghe nhạc mỗi ngày.”', '我们每天听音乐。', '我们每天听音乐。'], ['Turn into V-not-V: 你看书吗？', 'Chuyển sang chính phản: 你看书吗？', '你看不看书？', '你看不看书？'], ['Pinyin of 作业.', 'Pinyin của 作业.', 'zuòyè.', 'zuòyè.']] }),

  D(P + '6-2', '6.2 Places: 在, 去, 来', '6.2 Nơi chốn: 在, 去, 来', 'Hỏi nơi chốn, đi đâu, ở đâu, trật tự 在+nơi+V.', {
    n: '6.2',
    g: [['Say where someone is, goes, comes from', 'Nói ai ở đâu, đi đâu, từ đâu đến'], ['Order place words correctly', 'Đặt từ chỉ nơi chốn đúng chỗ'], ['Name 10 campus and city places', 'Gọi tên 10 địa điểm trường lớp và thành phố']],
    b: [`<p><span lang="zh">在</span> zài as a verb: A + 在 + place = A is at place: <span lang="zh">他在图书馆</span>. As a preposition it sits <em>before the main verb</em>: <span lang="zh">他在图书馆看书</span> (he reads at the library). Compare English where place is at the end.</p>
<p><span lang="zh">去</span> (go) and <span lang="zh">来</span> (come) take a place directly, no preposition: <span lang="zh">我去学校</span>, <span lang="zh">你来我家</span>. Purpose: <span lang="zh">我去图书馆看书</span> (go to the library <em>to</em> read: two verbs in a row). Ask <span lang="zh">你去哪儿？</span> <span lang="zh">你在哪儿？</span> Answer <span lang="zh">我去超市</span>, <span lang="zh">我在宿舍</span>.</p>
<p><span lang="zh">从……来</span> expresses origin: <span lang="zh">我从越南来</span>. Place demonstratives: <span lang="zh">这儿 那儿 哪儿</span> (northern) or <span lang="zh">这里 那里 哪里</span>.</p>`,
       `<p><span lang="zh">在</span> zài là động từ: A + 在 + nơi = A ở nơi: <span lang="zh">他在图书馆</span>. Làm giới từ, nó đứng <em>trước động từ chính</em>: <span lang="zh">他在图书馆看书</span> (anh ấy đọc sách ở thư viện). Khác tiếng Việt, nơi chốn không đặt cuối câu.</p>
<p><span lang="zh">去</span> (đi) và <span lang="zh">来</span> (đến) mang nơi chốn trực tiếp, không cần giới từ: <span lang="zh">我去学校</span>, <span lang="zh">你来我家</span>. Mục đích: <span lang="zh">我去图书馆看书</span> (đi thư viện <em>để</em> đọc: hai động từ liên tiếp). Hỏi <span lang="zh">你去哪儿？</span> <span lang="zh">你在哪儿？</span> Đáp <span lang="zh">我去超市</span>, <span lang="zh">我在宿舍</span>.</p>
<p><span lang="zh">从……来</span> chỉ nguồn gốc: <span lang="zh">我从越南来</span>. Chỉ định nơi: <span lang="zh">这儿 那儿 哪儿</span> (phương Bắc) hoặc <span lang="zh">这里 那里 哪里</span>.</p>`],
    v: [['学校', 'xuéxiào', 'school', 'trường học'], ['教室', 'jiàoshì', 'classroom', 'phòng học'], ['图书馆', 'túshūguǎn', 'library', 'thư viện'], ['食堂', 'shítáng', 'canteen', 'nhà ăn'], ['宿舍', 'sùshè', 'dormitory', 'ký túc xá'], ['超市', 'chāoshì', 'supermarket', 'siêu thị'], ['公司', 'gōngsī', 'company', 'công ty'], ['家', 'jiā', 'home', 'nhà'], ['去', 'qù', 'to go', 'đi'], ['来', 'lái', 'to come', 'đến'], ['在', 'zài', 'to be at; at', 'ở; tại'], ['从', 'cóng', 'from', 'từ']],
    d: [['A', '你去哪儿？', 'Nǐ qù nǎr?', 'Where are you going?', 'Bạn đi đâu?'], ['B', '我去图书馆看书。你呢？', 'Wǒ qù túshūguǎn kàn shū. Nǐ ne?', 'To the library to read. You?', 'Tôi đi thư viện đọc sách. Còn bạn?'], ['A', '我去食堂吃饭。', 'Wǒ qù shítáng chīfàn.', 'I am going to the canteen to eat.', 'Tôi đi nhà ăn ăn cơm.'], ['B', '好，下午见！', 'Hǎo, xiàwǔ jiàn!', 'OK, see you this afternoon!', 'Được, chiều gặp!']],
    pit: ['“我看书在图书馆” (place at the end) is the commonest error. Also do not insert 在 after 去: “我去在学校”.', '“我看书在图书馆” (nơi chốn cuối câu) là lỗi phổ biến nhất. Đừng chèn 在 sau 去: “我去在学校”.'],
    s: [['在 + place before the verb.', '在 + nơi trước động từ.'], ['去/来 + place directly.', '去/来 + nơi, không giới từ.'], ['Go + place + verb = go to do.', 'Đi + nơi + động từ = đi để làm.']],
    l: ['gram', 'wikib', 'mdbg'],
    p: [['Say “She studies in the classroom.”', 'Nói “Cô ấy học trong phòng học.”', '她在教室学习。', '她在教室学习。'], ['Correct: 我去在超市。', 'Sửa: 我去在超市。', '我去超市。', '我去超市。'], ['Ask “Where is he?”', 'Hỏi “Anh ấy ở đâu?”', '他在哪儿？', '他在哪儿？']] }),

  D(P + '6-3', '6.3 Modal verbs: 想, 会, 能, 可以, 要', '6.3 Động từ năng nguyện: 想, 会, 能, 可以, 要', 'Phân biệt 会 / 能 / 可以, 想 / 要.', {
    n: '6.3',
    g: [['Choose the right modal verb', 'Chọn đúng động từ năng nguyện'], ['Form negatives and questions with modals', 'Phủ định và hỏi với năng nguyện'], ['Ask for permission politely', 'Xin phép lịch sự']],
    b: [`<p>Modals stand <em>before the main verb</em>: S + modal + V (+ O).</p>
<ul><li><span lang="zh">想</span> xiǎng want/would like/think of: <span lang="zh">我想喝水</span>.</li>
<li><span lang="zh">要</span> yào want (stronger)/need/will: <span lang="zh">我要一杯茶</span>. Negative of 要 (will) is 不会/不用; “don’t want” is <span lang="zh">不想</span>.</li>
<li><span lang="zh">会</span> huì learned skill: <span lang="zh">我会说汉语</span>; also future probability <span lang="zh">明天会下雨</span>.</li>
<li><span lang="zh">能</span> néng physical ability/conditions: <span lang="zh">我今天不能去</span> (I am not able to go today).</li>
<li><span lang="zh">可以</span> kěyǐ permission: <span lang="zh">我可以坐这儿吗？</span> “May I sit here?” Negative “not allowed” is <span lang="zh">不能</span>/<span lang="zh">不可以</span>.</li></ul>
<p>Learned skill: <span lang="zh">他会游泳</span> (he can swim, has learned); condition: <span lang="zh">这里不能游泳</span> (swimming not permitted here).</p>`,
       `<p>Năng nguyện đứng <em>trước động từ chính</em>: S + năng nguyện + V (+ O).</p>
<ul><li><span lang="zh">想</span> xiǎng muốn/định/nghĩ: <span lang="zh">我想喝水</span>.</li>
<li><span lang="zh">要</span> yào muốn (mạnh hơn)/cần/sẽ: <span lang="zh">我要一杯茶</span>. Phủ định của 要 (sẽ) là 不会/不用; “không muốn” là <span lang="zh">不想</span>.</li>
<li><span lang="zh">会</span> huì kỹ năng học được: <span lang="zh">我会说汉语</span>; cũng chỉ khả năng xảy ra <span lang="zh">明天会下雨</span>.</li>
<li><span lang="zh">能</span> néng khả năng thể chất/điều kiện: <span lang="zh">我今天不能去</span> (hôm nay tôi không đi được).</li>
<li><span lang="zh">可以</span> kěyǐ được phép: <span lang="zh">我可以坐这儿吗？</span> “Tôi ngồi đây được không?” “Không được phép” là <span lang="zh">不能</span>/<span lang="zh">不可以</span>.</li></ul>
<p>Kỹ năng học được: <span lang="zh">他会游泳</span> (anh ấy biết bơi); điều kiện: <span lang="zh">这里不能游泳</span> (ở đây không được bơi).</p>`],
    v: [['想', 'xiǎng', 'to want, to think', 'muốn, nghĩ'], ['要', 'yào', 'to want, to need', 'muốn, cần'], ['会', 'huì', 'can (skill)', 'biết'], ['能', 'néng', 'can (ability)', 'có thể'], ['可以', 'kěyǐ', 'may, can', 'được phép'], ['游泳', 'yóuyǒng', 'to swim', 'bơi'], ['开车', 'kāichē', 'to drive', 'lái xe'], ['汉字', 'Hànzì', 'Chinese character', 'chữ Hán'], ['喝', 'hē', 'to drink', 'uống'], ['水', 'shuǐ', 'water', 'nước']],
    pit: ['Mixing 会 and 能: after months of study, “我会说汉语”; with a sore throat, “我今天不能说话”. Also the negative of 想 is 不想, not 没想.', 'Lẫn 会 và 能: học vài tháng thì “我会说汉语”; đau họng thì “我今天不能说话”. Phủ định của 想 là 不想, không phải 没想.'],
    s: [['Modal + verb; modal stays before the verb.', 'Năng nguyện + động từ, đứng trước động từ.'], ['会 skill, 能 ability, 可以 permission.', '会 kỹ năng, 能 khả năng, 可以 được phép.'], ['想 want; 要 want/need/will.', '想 muốn; 要 muốn/cần/sẽ.']],
    l: ['gram', 'wikib', 'coursera'],
    p: [['Say “I can speak Chinese (I learned it).”', 'Nói “Tôi biết nói tiếng Trung.”', '我会说汉语。', '我会说汉语。'], ['Ask permission to come in.', 'Xin phép vào.', '我可以进来吗？', '我可以进来吗？'], ['Negate: 他能来.', 'Phủ định: 他能来.', '他不能来。', '他不能来。']] }),

  Q(P + 'quiz-6', 'Quiz 6 — Study & daily life', 'Quiz 6 — Học tập và sinh hoạt', [
    [['Correct order:', 'Trật tự đúng:'], ['我看书在图书馆', '我在图书馆看书', '在我图书馆看书', '我看在图书馆书'], 1, ['Place before the verb.', 'Nơi chốn trước động từ.']],
    [['“Go to school”:', '“Đi đến trường”:'], ['去学校', '去在学校', '在去学校', '学校去'], 0, ['去 takes a place directly.', '去 mang nơi chốn trực tiếp.']],
    [['Skill you learned:', 'Kỹ năng đã học:'], ['会', '能', '可以', '要'], 0, ['会 for learned skills.', '会 cho kỹ năng học được.']],
    [['“May I sit here?”', '“Tôi ngồi đây được không?”'], ['我可以坐这儿吗？', '我会坐这儿吗？', '我是坐这儿吗？', '我很坐这儿吗？'], 0, ['可以 = permission.', '可以 = được phép.']],
    [['V-not-V question:', 'Câu hỏi chính phản:'], ['你学不学汉语？', '你学汉语不吗？', '你不学汉语吗不？', '你学学汉语？'], 0, ['No 吗 with V-not-V.', 'Không dùng 吗 với dạng chính phản.']],
    [['Pinyin of 图书馆:', 'Pinyin của 图书馆:'], ['túshūguǎn', 'tǔshūguān', 'tūshǔguǎn', 'túshùguǎn'], 0, ['tú-shū-guǎn.', 'tú-shū-guǎn.']],
    [['Negative of 想:', 'Phủ định của 想:'], ['不想', '没想', '不有想', '想不'], 0, ['不想 = do not want.', '不想 = không muốn.']],
    [['Chinese verbs:', 'Động từ tiếng Trung:'], ['conjugate for tense', 'never conjugate', 'agree with subject', 'change by gender'], 1, ['Time words show tense.', 'Từ chỉ thời gian báo thì.']],
  ]),
]));

// ===== Chương 7: Ăn uống =====
secs.push(SEC('Chapter 7 — Food and drink', 'Chương 7 — Ăn uống',
  'Từ vựng món ăn, gọi món, 还是, vị, văn hoá bàn ăn.', [
  D(P + '7-1', '7.1 Food & drink vocabulary, tastes', '7.1 Từ vựng đồ ăn thức uống và vị', 'Món cơ bản, vị, 好吃, 喜欢.', {
    n: '7.1',
    g: [['Name 20 common foods and drinks', 'Gọi tên 20 món ăn, đồ uống'], ['Describe tastes', 'Miêu tả vị'], ['Express likes and dislikes', 'Nói thích và không thích']],
    b: [`<p>Staple: <span lang="zh">米饭</span> rice, <span lang="zh">面条</span> noodles, <span lang="zh">饺子</span> dumplings, <span lang="zh">包子</span> steamed buns. Dishes: <span lang="zh">菜</span> (vegetable/dish), <span lang="zh">肉</span> meat, <span lang="zh">鸡蛋</span> egg, <span lang="zh">鱼</span> fish, <span lang="zh">汤</span> soup. Drinks: <span lang="zh">水 茶 咖啡 牛奶 果汁</span>. Fruit: <span lang="zh">苹果 香蕉</span>.</p>
<p><strong>Eat/drink verbs</strong> differ: <span lang="zh">吃</span> chī (eat), <span lang="zh">喝</span> hē (drink): <span lang="zh">吃米饭，喝茶</span>. Tastes: <span lang="zh">甜 tián</span> sweet, <span lang="zh">咸 xián</span> salty, <span lang="zh">酸 suān</span> sour, <span lang="zh">辣 là</span> spicy, <span lang="zh">苦 kǔ</span> bitter.</p>
<p><strong>Evaluation.</strong> <span lang="zh">好吃</span> (tasty), <span lang="zh">好喝</span> (good to drink), <span lang="zh">不好吃</span>. <span lang="zh">这个菜很好吃</span>. Preferences: <span lang="zh">我喜欢吃面条</span>, <span lang="zh">我不喜欢喝咖啡</span>. A culture note: tea is central; offer tea with both hands.</p>`,
       `<p>Món chính: <span lang="zh">米饭</span> cơm, <span lang="zh">面条</span> mì, <span lang="zh">饺子</span> sủi cảo, <span lang="zh">包子</span> bánh bao. Món ăn: <span lang="zh">菜</span> (rau/món), <span lang="zh">肉</span> thịt, <span lang="zh">鸡蛋</span> trứng, <span lang="zh">鱼</span> cá, <span lang="zh">汤</span> canh. Đồ uống: <span lang="zh">水 茶 咖啡 牛奶 果汁</span>. Trái cây: <span lang="zh">苹果 香蕉</span>.</p>
<p><strong>Động từ ăn/uống</strong> khác nhau: <span lang="zh">吃</span> chī (ăn), <span lang="zh">喝</span> hē (uống): <span lang="zh">吃米饭，喝茶</span>. Vị: <span lang="zh">甜 tián</span> ngọt, <span lang="zh">咸 xián</span> mặn, <span lang="zh">酸 suān</span> chua, <span lang="zh">辣 là</span> cay, <span lang="zh">苦 kǔ</span> đắng.</p>
<p><strong>Nhận xét.</strong> <span lang="zh">好吃</span> (ngon), <span lang="zh">好喝</span> (ngon khi uống), <span lang="zh">不好吃</span>. <span lang="zh">这个菜很好吃</span>. Sở thích: <span lang="zh">我喜欢吃面条</span>, <span lang="zh">我不喜欢喝咖啡</span>. Văn hoá: trà rất quan trọng; mời trà bằng hai tay.</p>`],
    v: [['米饭', 'mǐfàn', 'cooked rice', 'cơm'], ['面条', 'miàntiáo', 'noodles', 'mì'], ['饺子', 'jiǎozi', 'dumplings', 'sủi cảo'], ['包子', 'bāozi', 'steamed bun', 'bánh bao'], ['菜', 'cài', 'dish, vegetable', 'món ăn, rau'], ['肉', 'ròu', 'meat', 'thịt'], ['鸡蛋', 'jīdàn', 'egg', 'trứng gà'], ['茶', 'chá', 'tea', 'trà'], ['咖啡', 'kāfēi', 'coffee', 'cà phê'], ['牛奶', 'niúnǎi', 'milk', 'sữa bò'], ['苹果', 'píngguǒ', 'apple', 'táo'], ['好吃', 'hǎochī', 'delicious', 'ngon'], ['辣', 'là', 'spicy', 'cay'], ['喜欢', 'xǐhuan', 'to like', 'thích']],
    pit: ['Using 吃 with drinks (“吃茶”) is wrong; soup is the exception: 喝汤. Also 好吃 is only for food; use 好喝 for drinks.', 'Dùng 吃 với đồ uống (“吃茶”) là sai; riêng canh dùng 喝汤. 好吃 chỉ cho đồ ăn; đồ uống dùng 好喝.'],
    s: [['吃 eat, 喝 drink (soup: 喝汤).', '吃 ăn, 喝 uống (canh: 喝汤).'], ['Five tastes: 甜 咸 酸 辣 苦.', 'Năm vị: 甜 咸 酸 辣 苦.'], ['喜欢 + verb to say what you like.', '喜欢 + động từ để nói thích gì.']],
    l: ['cuis', 'tea', 'chop'],
    p: [['Say “I like to drink tea.”', 'Nói “Tôi thích uống trà.”', '我喜欢喝茶。', '我喜欢喝茶。'], ['Which verb: __咖啡?', 'Động từ nào: __咖啡?', '喝.', '喝.'], ['Translate: “This dish is spicy.”', 'Dịch: “Món này cay.”', '这个菜很辣。', '这个菜很辣。']] }),

  D(P + '7-2', '7.2 Ordering in a restaurant', '7.2 Gọi món ở nhà hàng', 'Hội thoại gọi món, lượng từ đồ ăn, 来, 要, 买单.', {
    n: '7.2',
    g: [['Order food and ask for the bill', 'Gọi món và xin tính tiền'], ['Use food measure words 碗 杯 瓶 份', 'Dùng lượng từ đồ ăn 碗 杯 瓶 份'], ['Give simple requests with 请 and 来', 'Đưa yêu cầu đơn giản với 请 và 来']],
    b: [`<p>Call the waiter: <span lang="zh">服务员！</span> (or 您好!). Ask for the menu <span lang="zh">请给我菜单</span> (<span lang="zh">给 gěi</span> = give). Order with <span lang="zh">我要……</span> / <span lang="zh">我想吃……</span> / <span lang="zh">来一份……</span> (“bring one portion of…”). Measure words: <span lang="zh">一碗 wǎn</span> bowl, <span lang="zh">一杯</span> cup, <span lang="zh">一瓶</span> bottle, <span lang="zh">一份 fèn</span> portion, <span lang="zh">一盘 pán</span> plate.</p>
<p>Preferences: <span lang="zh">不要辣</span> (no spicy), <span lang="zh">少放盐</span> (less salt, lit. put less salt), <span lang="zh">别放糖</span> (don’t add sugar). The waiter: <span lang="zh">您要点什么？</span> / <span lang="zh">还要别的吗？</span> (Anything else?) You answer <span lang="zh">不要了，谢谢</span>. Finish: <span lang="zh">买单</span> mǎidān (the bill) or <span lang="zh">结账 jiézhàng</span>. <span lang="zh">一共多少钱？</span> asks the total.</p>`,
       `<p>Gọi phục vụ: <span lang="zh">服务员！</span> (hoặc 您好!). Xin thực đơn <span lang="zh">请给我菜单</span> (<span lang="zh">给 gěi</span> = đưa). Gọi món: <span lang="zh">我要……</span> / <span lang="zh">我想吃……</span> / <span lang="zh">来一份……</span> (“mang cho một phần…”). Lượng từ: <span lang="zh">一碗 wǎn</span> bát, <span lang="zh">一杯</span> cốc, <span lang="zh">一瓶</span> chai, <span lang="zh">一份 fèn</span> phần, <span lang="zh">一盘 pán</span> đĩa.</p>
<p>Yêu cầu: <span lang="zh">不要辣</span> (đừng cay), <span lang="zh">少放盐</span> (cho ít muối), <span lang="zh">别放糖</span> (đừng cho đường). Phục vụ hỏi: <span lang="zh">您要点什么？</span> / <span lang="zh">还要别的吗？</span> (Còn gì nữa không?) Bạn đáp <span lang="zh">不要了，谢谢</span>. Thanh toán: <span lang="zh">买单</span> mǎidān (tính tiền) hoặc <span lang="zh">结账 jiézhàng</span>. <span lang="zh">一共多少钱？</span> hỏi tổng tiền.</p>`],
    v: [['服务员', 'fúwùyuán', 'waiter', 'nhân viên phục vụ'], ['菜单', 'càidān', 'menu', 'thực đơn'], ['点', 'diǎn', 'to order', 'gọi (món)'], ['来', 'lái', 'bring (colloquial order)', 'mang đến (gọi món)'], ['碗', 'wǎn', 'bowl', 'bát'], ['份', 'fèn', 'portion', 'phần'], ['瓶', 'píng', 'bottle', 'chai'], ['别的', 'bié de', 'other things', 'thứ khác'], ['买单', 'mǎidān', 'the bill', 'tính tiền'], ['一共', 'yígòng', 'altogether', 'tổng cộng'], ['给', 'gěi', 'to give', 'đưa, cho']],
    d: [['服务员', '您好，您要点什么？', 'Nín hǎo, nín yào diǎn shénme?', 'Hello, what would you like to order?', 'Chào anh/chị, anh/chị gọi gì?'], ['客人', '我要一碗面条，一杯茶。', 'Wǒ yào yì wǎn miàntiáo, yì bēi chá.', 'A bowl of noodles and a cup of tea.', 'Cho một bát mì, một cốc trà.'], ['服务员', '还要别的吗？', 'Hái yào bié de ma?', 'Anything else?', 'Còn gì nữa không?'], ['客人', '不要了，谢谢。买单！', 'Bú yào le, xièxie. Mǎidān!', 'No more, thanks. The bill!', 'Thôi, cảm ơn. Tính tiền!']],
    pit: ['“我要吃一碗” is incomplete: name the dish after the measure word. Also 一 before 碗 (wǎn, 3rd tone) is yì: yì wǎn.', '“我要吃一碗” thiếu món sau lượng từ. Chú ý 一 trước 碗 (thanh 3) đọc yì: yì wǎn.'],
    s: [['Order: 我要 / 来一份 + noun.', 'Gọi món: 我要 / 来一份 + danh từ.'], ['Measure words: 碗 杯 瓶 份 盘.', 'Lượng từ: 碗 杯 瓶 份 盘.'], ['买单 / 结账 asks for the bill.', '买单 / 结账 để tính tiền.']],
    l: ['cuis', 'wikib', 'mdbg'],
    p: [['Order two bowls of rice.', 'Gọi hai bát cơm.', '我要两碗米饭。', '我要两碗米饭。'], ['Say “no spicy”.', 'Nói “đừng cay”.', '不要辣。', '不要辣。'], ['Ask for the total.', 'Hỏi tổng tiền.', '一共多少钱？', '一共多少钱？']] }),

  D(P + '7-3', '7.3 Choices with 还是 & suggestions with 吧', '7.3 Hỏi lựa chọn với 还是 và đề nghị với 吧', '还是, 或者, 吧, 一起, 有点儿.', {
    n: '7.3',
    g: [['Ask “A or B?” with 还是', 'Hỏi “A hay B?” với 还是'], ['Make suggestions with 吧 and 一起', 'Đề nghị bằng 吧 và 一起'], ['Tell 有点儿 from 一点儿', 'Phân biệt 有点儿 và 一点儿']],
    b: [`<p><strong>还是 háishi</strong> offers alternatives in <em>questions</em>: <span lang="zh">你喝茶还是喝咖啡？</span> (tea or coffee?). Statements use <span lang="zh">或者 huòzhě</span>: <span lang="zh">我喝茶或者咖啡</span>. Do not add 吗.</p>
<p><strong>吧 ba</strong> softens a suggestion: <span lang="zh">我们去吃饭吧</span> (let’s go eat), <span lang="zh">你喝茶吧</span>. <span lang="zh">一起 yìqǐ</span> = together: <span lang="zh">我们一起去</span>. Invitation: <span lang="zh">你想不想跟我一起吃饭？</span> <span lang="zh">跟 gēn</span> = with.</p>
<p><strong>有点儿 vs 一点儿.</strong> <span lang="zh">有点儿</span> + adjective = “a bit (too much, negative)”: <span lang="zh">这个菜有点儿辣</span> (a bit too spicy). <span lang="zh">一点儿</span> follows an adjective or verb in requests/comparisons: <span lang="zh">我想吃一点儿</span> (I’d like a little), <span lang="zh">请少放一点儿盐</span>. Culture: share dishes; the host pours for guests.</p>`,
       `<p><strong>还是 háishi</strong> đưa lựa chọn trong <em>câu hỏi</em>: <span lang="zh">你喝茶还是喝咖啡？</span> (trà hay cà phê?). Câu kể dùng <span lang="zh">或者 huòzhě</span>: <span lang="zh">我喝茶或者咖啡</span>. Không thêm 吗.</p>
<p><strong>吧 ba</strong> làm mềm đề nghị: <span lang="zh">我们去吃饭吧</span> (mình đi ăn nhé), <span lang="zh">你喝茶吧</span>. <span lang="zh">一起 yìqǐ</span> = cùng nhau: <span lang="zh">我们一起去</span>. Mời: <span lang="zh">你想不想跟我一起吃饭？</span> <span lang="zh">跟 gēn</span> = cùng với.</p>
<p><strong>有点儿 và 一点儿.</strong> <span lang="zh">有点儿</span> + tính từ = “hơi (quá, nghĩa tiêu cực)”: <span lang="zh">这个菜有点儿辣</span> (hơi cay quá). <span lang="zh">一点儿</span> đứng sau tính từ hoặc động từ khi đề nghị/so sánh: <span lang="zh">我想吃一点儿</span> (tôi muốn ăn một ít), <span lang="zh">请少放一点儿盐</span>. Văn hoá: dùng chung các món; chủ nhà rót cho khách.</p>`],
    v: [['还是', 'háishi', 'or (in questions)', 'hay là'], ['或者', 'huòzhě', 'or (in statements)', 'hoặc'], ['吧', 'ba', 'suggestion particle', 'nhé (trợ từ đề nghị)'], ['一起', 'yìqǐ', 'together', 'cùng nhau'], ['跟', 'gēn', 'with', 'cùng với'], ['有点儿', 'yǒudiǎnr', 'a bit (too)', 'hơi (quá)'], ['一点儿', 'yìdiǎnr', 'a little', 'một chút'], ['饿', 'è', 'hungry', 'đói'], ['渴', 'kě', 'thirsty', 'khát']],
    pit: ['“你喝茶还是咖啡吗？” (no 吗 with 还是). Also 有点儿 for a good thing is odd: 有点儿好吃 sounds like “somewhat”.', '“你喝茶还是咖啡吗？” sai (không 吗 với 还是). 有点儿 cho điều tốt nghe lạ: 有点儿好吃 nghĩa “tạm được”.'],
    s: [['还是 for questions, 或者 for statements.', '还是 cho câu hỏi, 或者 cho câu kể.'], ['吧 softens a suggestion.', '吧 làm mềm đề nghị.'], ['有点儿 + adj (negative); adj + 一点儿 (request).', '有点儿 + tính từ (tiêu cực); tính từ + 一点儿 (đề nghị).']],
    l: ['gram', 'cuis', 'chop'],
    p: [['Ask: “Rice or noodles?”', 'Hỏi: “Cơm hay mì?”', '你吃米饭还是面条？', '你吃米饭还是面条？'], ['Say “Let’s go together.”', 'Nói “Chúng ta đi cùng nhau nhé.”', '我们一起去吧。', '我们一起去吧。'], ['Say “a bit spicy” (complaint).', 'Nói “hơi cay” (phàn nàn).', '有点儿辣。', '有点儿辣。']] }),

  Q(P + 'quiz-7', 'Quiz 7 — Food & drink', 'Quiz 7 — Ăn uống', [
    [['Verb for tea:', 'Động từ cho trà:'], ['吃', '喝', '看', '听'], 1, ['喝 = drink.', '喝 = uống.']],
    [['“Spicy” is:', '“Cay” là:'], ['甜', '咸', '辣', '苦'], 2, ['辣 là.', '辣 là.']],
    [['Measure word for a bowl of noodles:', 'Lượng từ cho bát mì:'], ['杯', '碗', '本', '只'], 1, ['碗 wǎn.', '碗 wǎn.']],
    [['Ask for the bill:', 'Xin tính tiền:'], ['买单', '菜单', '服务', '再见'], 0, ['买单 mǎidān.', '买单 mǎidān.']],
    [['Question “tea or coffee?”', 'Hỏi “trà hay cà phê?”'], ['茶或者咖啡吗', '茶还是咖啡', '茶也咖啡', '茶和咖啡吗'], 1, ['还是 in questions.', '还是 trong câu hỏi.']],
    [['Soften “let’s go”:', 'Làm mềm “đi nào”:'], ['我们去吧', '我们去吗', '我们去呢', '我们去的'], 0, ['吧 suggests.', '吧 đề nghị.']],
    [['有点儿辣 means:', '有点儿辣 nghĩa:'], ['not spicy', 'a bit too spicy', 'very good', 'sweet'], 1, ['有点儿 is slightly negative.', '有点儿 hơi tiêu cực.']],
    [['“together” is:', '“cùng nhau” là:'], ['一起', '一共', '一样', '一定'], 0, ['一起 yìqǐ.', '一起 yìqǐ.']],
  ]),
]));

// ===== Chương 8: Mua sắm =====
secs.push(SEC('Chapter 8 — Shopping and money', 'Chương 8 — Mua sắm và tiền tệ',
  'Tiền, giá, quần áo, màu sắc, trả giá, thanh toán.', [
  D(P + '8-1', '8.1 Money & prices', '8.1 Tiền và giá cả', '块/元, 毛/角, 分, 多少钱, 贵 便宜.', {
    n: '8.1',
    g: [['Ask and say prices', 'Hỏi và nói giá'], ['Read amounts with 块 and 毛', 'Đọc số tiền với 块 và 毛'], ['Describe price as expensive or cheap', 'Nhận xét giá đắt hay rẻ']],
    b: [`<p>The currency is <span lang="zh">人民币 rénmínbì</span>. Written units: <span lang="zh">元 yuán</span>, <span lang="zh">角 jiǎo</span>, <span lang="zh">分 fēn</span>; spoken: <span lang="zh">块 kuài</span>, <span lang="zh">毛 máo</span>, <span lang="zh">分</span> (1 yuan = 10 jiao = 100 fen). Ask <span lang="zh">多少钱？</span> or <span lang="zh">这个多少钱？</span> or <span lang="zh">几块钱？</span> (for small prices).</p>
<p>Reading: <span lang="zh">¥3.00 三块</span>; <span lang="zh">¥3.50 三块五</span> (the last unit is dropped); <span lang="zh">¥12.05 十二块零五分</span>; <span lang="zh">¥200 两百块</span>. “Two” is <span lang="zh">两块</span>, not 二块. Price as predicate, no verb: <span lang="zh">一斤苹果八块</span> (a jin of apples is 8 yuan; 斤 jīn = 500 g).</p>
<p>Adjectives: <span lang="zh">贵 guì</span> expensive, <span lang="zh">便宜 piányi</span> cheap. <span lang="zh">太贵了！</span> “Too expensive!” Structure <span lang="zh">太……了</span>. The verbs <span lang="zh">买 mǎi</span> (buy) and <span lang="zh">卖 mài</span> (sell) differ only by tone: mǎi 3rd, mài 4th.</p>`,
       `<p>Đơn vị tiền là <span lang="zh">人民币 rénmínbì</span>. Chữ viết: <span lang="zh">元 yuán</span>, <span lang="zh">角 jiǎo</span>, <span lang="zh">分 fēn</span>; khẩu ngữ: <span lang="zh">块 kuài</span>, <span lang="zh">毛 máo</span>, <span lang="zh">分</span> (1 nguyên = 10 giác = 100 phân). Hỏi <span lang="zh">多少钱？</span> hoặc <span lang="zh">这个多少钱？</span> hoặc <span lang="zh">几块钱？</span> (giá nhỏ).</p>
<p>Cách đọc: <span lang="zh">¥3.00 三块</span>; <span lang="zh">¥3.50 三块五</span> (bỏ đơn vị cuối); <span lang="zh">¥12.05 十二块零五分</span>; <span lang="zh">¥200 两百块</span>. “Hai” là <span lang="zh">两块</span>, không phải 二块. Giá làm vị ngữ, không cần động từ: <span lang="zh">一斤苹果八块</span> (một cân táo 8 tệ; 斤 jīn = 500 g).</p>
<p>Tính từ: <span lang="zh">贵 guì</span> đắt, <span lang="zh">便宜 piányi</span> rẻ. <span lang="zh">太贵了！</span> “Đắt quá!” Cấu trúc <span lang="zh">太……了</span>. Hai động từ <span lang="zh">买 mǎi</span> (mua) và <span lang="zh">卖 mài</span> (bán) chỉ khác thanh: mǎi thanh 3, mài thanh 4.</p>`],
    v: [['钱', 'qián', 'money', 'tiền'], ['块', 'kuài', 'yuan (spoken)', 'tệ (khẩu ngữ)'], ['毛', 'máo', 'jiao (spoken)', 'hào (khẩu ngữ)'], ['元', 'yuán', 'yuan', 'nguyên (tệ)'], ['多少钱', 'duōshao qián', 'how much', 'bao nhiêu tiền'], ['贵', 'guì', 'expensive', 'đắt'], ['便宜', 'piányi', 'cheap', 'rẻ'], ['买', 'mǎi', 'to buy', 'mua'], ['卖', 'mài', 'to sell', 'bán'], ['斤', 'jīn', 'half a kilo', 'cân (500 g)'], ['一共', 'yígòng', 'in total', 'tổng cộng']],
    pit: ['Mixing 买 and 卖, and reading 3.50 as “三块五十” (it is 三块五). Also 二块 should be 两块.', 'Lẫn 买 và 卖; đọc 3,50 là “三块五十” (đúng là 三块五). 二块 phải là 两块.'],
    s: [['块 = 元, 毛 = 角 in speech.', '块 = 元, 毛 = 角 khi nói.'], ['Drop the last unit: 三块五.', 'Bỏ đơn vị cuối: 三块五.'], ['太……了 expresses “too”.', '太……了 nghĩa “quá”.']],
    l: ['rmb', 'num', 'mdbg'],
    p: [['Say ¥6.50 and ¥22.', 'Đọc ¥6,50 và ¥22.', '六块五；二十二块。', '六块五；二十二块。'], ['Which verb is “sell”?', 'Động từ nào là “bán”?', '卖 mài.', '卖 mài.'], ['Say “Too expensive!”', 'Nói “Đắt quá!”', '太贵了！', '太贵了！']] }),

  D(P + '8-2', '8.2 Clothes, colours & sizes', '8.2 Quần áo, màu sắc và cỡ', 'Màu, cỡ, 试, 一下, so với 太 và 有点儿.', {
    n: '8.2',
    g: [['Name clothes and colours', 'Gọi tên quần áo và màu sắc'], ['Ask about size and try on', 'Hỏi cỡ và thử đồ'], ['Use 一下 and 的 + colour phrases', 'Dùng 一下 và cụm 的 + màu']],
    b: [`<p>Clothes: <span lang="zh">衣服 yīfu</span>, <span lang="zh">裤子 kùzi</span>, <span lang="zh">裙子 qúnzi</span>, <span lang="zh">鞋 xié</span>, <span lang="zh">帽子 màozi</span>. Colours: <span lang="zh">红 hóng</span>, <span lang="zh">黄 huáng</span>, <span lang="zh">蓝 lán</span>, <span lang="zh">绿 lǜ</span>, <span lang="zh">白 bái</span>, <span lang="zh">黑 hēi</span>. Add <span lang="zh">色 sè</span> for a noun (<span lang="zh">红色</span>) or <span lang="zh">的</span> for modifying: <span lang="zh">红色的衣服</span>, <span lang="zh">我要白的</span> (I want the white one).</p>
<p>Size: <span lang="zh">大 小 长 短 cháng/duǎn</span>; number sizes <span lang="zh">号 hào</span>: <span lang="zh">你穿多大号？</span> <span lang="zh">穿 chuān</span> = wear (clothes, shoes). Try on: <span lang="zh">我可以试一下吗？</span> <span lang="zh">试 shì</span> = try, and <span lang="zh">一下</span> softens the verb (“a bit”): <span lang="zh">看一下</span>, <span lang="zh">试一下</span>.</p>
<p>Comments: <span lang="zh">这件有点儿大，有小一点儿的吗？</span> (A bit large; do you have a smaller one?) <span lang="zh">太小了</span>. Remember 件 for upper clothes, 条 tiáo for trousers/skirts, 双 shuāng for pairs of shoes.</p>`,
       `<p>Quần áo: <span lang="zh">衣服 yīfu</span>, <span lang="zh">裤子 kùzi</span>, <span lang="zh">裙子 qúnzi</span>, <span lang="zh">鞋 xié</span>, <span lang="zh">帽子 màozi</span>. Màu: <span lang="zh">红 hóng</span>, <span lang="zh">黄 huáng</span>, <span lang="zh">蓝 lán</span>, <span lang="zh">绿 lǜ</span>, <span lang="zh">白 bái</span>, <span lang="zh">黑 hēi</span>. Thêm <span lang="zh">色 sè</span> thành danh từ (<span lang="zh">红色</span>) hoặc <span lang="zh">的</span> để bổ nghĩa: <span lang="zh">红色的衣服</span>, <span lang="zh">我要白的</span> (tôi lấy cái màu trắng).</p>
<p>Cỡ: <span lang="zh">大 小 长 短 cháng/duǎn</span>; cỡ số <span lang="zh">号 hào</span>: <span lang="zh">你穿多大号？</span> <span lang="zh">穿 chuān</span> = mặc, mang (quần áo, giày). Thử: <span lang="zh">我可以试一下吗？</span> <span lang="zh">试 shì</span> = thử, và <span lang="zh">一下</span> làm nhẹ động từ (“một chút”): <span lang="zh">看一下</span>, <span lang="zh">试一下</span>.</p>
<p>Nhận xét: <span lang="zh">这件有点儿大，有小一点儿的吗？</span> (Cái này hơi to, có cái nhỏ hơn không?) <span lang="zh">太小了</span>. Nhớ: 件 cho áo, 条 tiáo cho quần/váy, 双 shuāng cho đôi giày.</p>`],
    v: [['衣服', 'yīfu', 'clothes', 'quần áo'], ['裤子', 'kùzi', 'trousers', 'quần'], ['裙子', 'qúnzi', 'skirt', 'váy'], ['鞋', 'xié', 'shoes', 'giày'], ['红', 'hóng', 'red', 'đỏ'], ['黄', 'huáng', 'yellow', 'vàng'], ['蓝', 'lán', 'blue', 'xanh dương'], ['绿', 'lǜ', 'green', 'xanh lá'], ['白', 'bái', 'white', 'trắng'], ['黑', 'hēi', 'black', 'đen'], ['穿', 'chuān', 'to wear', 'mặc'], ['试', 'shì', 'to try', 'thử'], ['条', 'tiáo', 'measure word for trousers', 'lượng từ quần/váy'], ['双', 'shuāng', 'pair', 'đôi']],
    d: [['顾客', '我可以试一下这件吗？', 'Wǒ kěyǐ shì yíxià zhè jiàn ma?', 'Can I try this one on?', 'Tôi thử cái này được không?'], ['店员', '可以，您穿多大号？', 'Kěyǐ, nín chuān duō dà hào?', 'Sure, what size do you wear?', 'Được, chị mặc cỡ nào?'], ['顾客', '中号。有白色的吗？', 'Zhōng hào. Yǒu báisè de ma?', 'Medium. Do you have white?', 'Cỡ vừa. Có màu trắng không?'], ['店员', '有，请等一下。', 'Yǒu, qǐng děng yíxià.', 'Yes, wait a moment.', 'Có, xin chờ một chút.']],
    pit: ['“我要红” without 的/色 is incomplete; use 红的. And 绿 is lǜ (ü), not lù.', '“我要红” thiếu 的/色; dùng 红的. 绿 đọc lǜ (ü), không phải lù.'],
    s: [['Colour + 色 or 的 to modify nouns.', 'Màu + 色 hoặc 的 để bổ nghĩa danh từ.'], ['穿 for clothes; 条, 件, 双 as measure words.', '穿 cho quần áo; 条, 件, 双 là lượng từ.'], ['V + 一下 softens a request.', 'V + 一下 làm nhẹ lời đề nghị.']],
    l: ['cls', 'gram', 'mdbg'],
    p: [['Say “a red shirt” with a measure word.', 'Nói “một chiếc áo đỏ” kèm lượng từ.', '一件红色的衣服。', '一件红色的衣服。'], ['Request: “Let me look at it a bit.”', 'Yêu cầu: “Cho tôi xem một chút.”', '让我看一下。', '让我看一下。'], ['Measure word for shoes?', 'Lượng từ cho giày?', '双.', '双.']] }),

  D(P + '8-3', '8.3 Bargaining & payment', '8.3 Trả giá và thanh toán', 'Trả giá, 能不能, 便宜一点儿, thanh toán điện tử.', {
    n: '8.3',
    g: [['Bargain politely', 'Trả giá lịch sự'], ['Choose a payment method', 'Chọn phương thức thanh toán'], ['Role-play a market dialogue', 'Đóng vai hội thoại ở chợ']],
    b: [`<p>At markets bargaining is normal; in supermarkets prices are fixed. Useful moves: <span lang="zh">太贵了！能不能便宜一点儿？</span> “Too expensive, can it be cheaper?” <span lang="zh">最低多少钱？</span> “What is the lowest price?” <span lang="zh">五十块行不行？</span> “50, OK?” Seller: <span lang="zh">好吧</span>, <span lang="zh">不行</span>. <span lang="zh">打折 dǎzhé</span> = discount, <span lang="zh">八折</span> = 20% off (the number is the share you pay in tenths).</p>
<p>Payment: <span lang="zh">现金 xiànjīn</span> (cash), <span lang="zh">刷卡 shuākǎ</span> (swipe card), <span lang="zh">扫码 sǎomǎ</span> (scan QR), <span lang="zh">微信支付</span> and <span lang="zh">支付宝</span> (the two mobile wallets in China). <span lang="zh">可以用微信吗？</span> Change: <span lang="zh">找您五块</span> (here is 5 yuan change).</p>
<p>Closing phrases: <span lang="zh">我买两件</span>, <span lang="zh">再便宜点儿吧</span>, <span lang="zh">谢谢，欢迎再来！</span> (the seller’s “welcome back”).</p>`,
       `<p>Ở chợ trả giá là bình thường; siêu thị thì giá cố định. Cách nói: <span lang="zh">太贵了！能不能便宜一点儿？</span> “Đắt quá, rẻ hơn được không?” <span lang="zh">最低多少钱？</span> “Giá thấp nhất bao nhiêu?” <span lang="zh">五十块行不行？</span> “50 được không?” Người bán: <span lang="zh">好吧</span>, <span lang="zh">不行</span>. <span lang="zh">打折 dǎzhé</span> = giảm giá, <span lang="zh">八折</span> = giảm 20% (số là phần bạn trả tính theo phần mười).</p>
<p>Thanh toán: <span lang="zh">现金 xiànjīn</span> (tiền mặt), <span lang="zh">刷卡 shuākǎ</span> (quẹt thẻ), <span lang="zh">扫码 sǎomǎ</span> (quét mã QR), <span lang="zh">微信支付</span> và <span lang="zh">支付宝</span> (hai ví điện tử phổ biến ở Trung Quốc). <span lang="zh">可以用微信吗？</span> Tiền thừa: <span lang="zh">找您五块</span> (trả lại bạn 5 tệ).</p>
<p>Câu kết: <span lang="zh">我买两件</span>, <span lang="zh">再便宜点儿吧</span>, <span lang="zh">谢谢，欢迎再来！</span> (lời người bán “mời quay lại”).</p>`],
    v: [['便宜点儿', 'piányi diǎnr', 'a bit cheaper', 'rẻ chút'], ['最低', 'zuì dī', 'lowest', 'thấp nhất'], ['打折', 'dǎzhé', 'discount', 'giảm giá'], ['现金', 'xiànjīn', 'cash', 'tiền mặt'], ['刷卡', 'shuākǎ', 'pay by card', 'quẹt thẻ'], ['扫码', 'sǎomǎ', 'scan QR code', 'quét mã QR'], ['微信', 'Wēixìn', 'WeChat', 'WeChat'], ['支付宝', 'Zhīfùbǎo', 'Alipay', 'Alipay'], ['找', 'zhǎo', 'to give change', 'thối tiền'], ['行', 'xíng', 'OK, all right', 'được'], ['欢迎', 'huānyíng', 'welcome', 'hoan nghênh']],
    d: [['顾客', '这件衣服多少钱？', 'Zhè jiàn yīfu duōshao qián?', 'How much is this garment?', 'Cái áo này bao nhiêu tiền?'], ['店员', '一百二十块。', 'Yì bǎi èrshí kuài.', '120 yuan.', 'Một trăm hai mươi tệ.'], ['顾客', '太贵了！一百块行不行？', 'Tài guì le! Yì bǎi kuài xíng bu xíng?', 'Too expensive! 100, OK?', 'Đắt quá! Một trăm được không?'], ['店员', '好吧，可以扫码，也可以刷卡。', 'Hǎo ba, kěyǐ sǎomǎ, yě kěyǐ shuākǎ.', 'Fine; you can scan or use a card.', 'Được, quét mã hoặc quẹt thẻ đều được.']],
    pit: ['“很贵了” instead of 太贵了 for complaint; and reading 八折 as “80% off”. It means you pay 80%.', '“很贵了” thay vì 太贵了 khi chê đắt; hiểu 八折 là “giảm 80%”. Thực ra là trả 80%.'],
    s: [['Bargaining: 能不能便宜一点儿？', 'Trả giá: 能不能便宜一点儿？'], ['八折 = pay 80%.', '八折 = trả 80%.'], ['Pay: 现金, 刷卡, 扫码.', 'Thanh toán: 现金, 刷卡, 扫码.']],
    l: ['rmb', 'cuis', 'coursera'],
    p: [['Ask for a lower price politely.', 'Hỏi giá thấp hơn lịch sự.', '能不能便宜一点儿？', '能不能便宜一点儿？'], ['What does 七折 mean?', '七折 nghĩa là gì?', 'You pay 70%.', 'Trả 70%.'], ['Ask if you can pay with WeChat.', 'Hỏi có trả bằng WeChat được không.', '可以用微信吗？', '可以用微信吗？']] }),

  Q(P + 'quiz-8', 'Quiz 8 — Shopping', 'Quiz 8 — Mua sắm', [
    [['3.50 yuan is read:', '3,50 tệ đọc là:'], ['三块五', '三块五十', '三点五元', '三块零五'], 0, ['The last unit is dropped.', 'Bỏ đơn vị cuối.']],
    [['“buy” is:', '“mua” là:'], ['买 mǎi', '卖 mài', '卖 mǎi', '买 mài'], 0, ['买 3rd tone.', '买 thanh 3.']],
    [['Measure word for trousers:', 'Lượng từ cho quần:'], ['件', '条', '双', '杯'], 1, ['条 tiáo.', '条 tiáo.']],
    [['Green:', 'Xanh lá:'], ['红', '蓝', '绿', '黄'], 2, ['绿 lǜ.', '绿 lǜ.']],
    [['八折 means:', '八折 nghĩa:'], ['80% off', 'pay 80%', 'pay 20%', 'pay 8 yuan'], 1, ['You pay eight tenths.', 'Trả tám phần mười.']],
    [['“Too expensive!”', '“Đắt quá!”'], ['太贵了', '很贵吗', '不贵了', '有点贵吗'], 0, ['太……了.', '太……了.']],
    [['Which is NOT a payment method?', 'Cái nào KHÔNG phải phương thức thanh toán?'], ['刷卡', '扫码', '现金', '打折'], 3, ['打折 = discount.', '打折 = giảm giá.']],
    [['Soften “try it”:', 'Làm nhẹ “thử”:'], ['试一下', '试了', '试过', '试着'], 0, ['V + 一下.', 'V + 一下.']],
  ]),
]));
// ===== Chương 9: Phương hướng & giao thông =====
secs.push(SEC('Chapter 9 — Directions and transport', 'Chương 9 — Phương hướng và giao thông',
  'Từ chỉ vị trí, hỏi đường, phương tiện, khoảng cách và thời gian.', [
  D(P + '9-1', '9.1 Location words & existence: 在 vs 有', '9.1 Từ chỉ vị trí và câu tồn tại: 在 và 有', 'Trên, dưới, trong, ngoài, bên cạnh; hai mẫu câu 在 / 有.', {
    n: '9.1',
    g: [['Use location words after nouns', 'Dùng từ chỉ vị trí sau danh từ'], ['Contrast “X 在 place” and “place 有 X”', 'Đối chiếu “X 在 nơi” và “nơi 有 X”'], ['Describe where things are', 'Mô tả vị trí đồ vật']],
    b: [`<p>Location words: <span lang="zh">上 shàng</span> on/above, <span lang="zh">下 xià</span> under, <span lang="zh">前 qián</span> front, <span lang="zh">后 hòu</span> back, <span lang="zh">左 zuǒ</span> left, <span lang="zh">右 yòu</span> right, <span lang="zh">里 lǐ</span> inside, <span lang="zh">外 wài</span> outside, <span lang="zh">旁边 pángbiān</span> beside, <span lang="zh">中间 zhōngjiān</span> between/middle, <span lang="zh">对面 duìmiàn</span> opposite. Add <span lang="zh">边 biān / 面 miàn</span> to make standalone forms: <span lang="zh">前边 左边 里面</span>.</p>
<p><strong>They follow the noun</strong> (opposite to English prepositions): <span lang="zh">桌子上</span> on the table, <span lang="zh">教室里</span> in the classroom, <span lang="zh">学校旁边</span> next to school.</p>
<p><strong>Two patterns.</strong> (1) Known thing + <span lang="zh">在</span> + place: <span lang="zh">书在桌子上</span> (the book is on the table: definite subject). (2) Place + <span lang="zh">有</span> + (new) thing: <span lang="zh">桌子上有一本书</span> (on the table there is a book: indefinite). Questions: <span lang="zh">书在哪儿？</span> / <span lang="zh">桌子上有什么？</span>. Compass directions: <span lang="zh">东 西 南 北</span> (in this order: dōng xī nán běi).</p>`,
       `<p>Từ chỉ vị trí: <span lang="zh">上 shàng</span> trên, <span lang="zh">下 xià</span> dưới, <span lang="zh">前 qián</span> trước, <span lang="zh">后 hòu</span> sau, <span lang="zh">左 zuǒ</span> trái, <span lang="zh">右 yòu</span> phải, <span lang="zh">里 lǐ</span> trong, <span lang="zh">外 wài</span> ngoài, <span lang="zh">旁边 pángbiān</span> bên cạnh, <span lang="zh">中间 zhōngjiān</span> giữa, <span lang="zh">对面 duìmiàn</span> đối diện. Thêm <span lang="zh">边 biān / 面 miàn</span> để dùng độc lập: <span lang="zh">前边 左边 里面</span>.</p>
<p><strong>Chúng đứng sau danh từ</strong>: <span lang="zh">桌子上</span> trên bàn, <span lang="zh">教室里</span> trong phòng học, <span lang="zh">学校旁边</span> cạnh trường.</p>
<p><strong>Hai mẫu câu.</strong> (1) Vật đã biết + <span lang="zh">在</span> + nơi: <span lang="zh">书在桌子上</span> (quyển sách ở trên bàn: chủ ngữ xác định). (2) Nơi + <span lang="zh">有</span> + vật (mới): <span lang="zh">桌子上有一本书</span> (trên bàn có một quyển sách: không xác định). Hỏi: <span lang="zh">书在哪儿？</span> / <span lang="zh">桌子上有什么？</span> Phương hướng: <span lang="zh">东 西 南 北</span> (đông tây nam bắc).</p>`],
    v: [['上边', 'shàngbian', 'above', 'phía trên'], ['下边', 'xiàbian', 'below', 'phía dưới'], ['前边', 'qiánbian', 'in front', 'phía trước'], ['后边', 'hòubian', 'behind', 'phía sau'], ['左边', 'zuǒbian', 'left side', 'bên trái'], ['右边', 'yòubian', 'right side', 'bên phải'], ['里面', 'lǐmiàn', 'inside', 'bên trong'], ['外面', 'wàimiàn', 'outside', 'bên ngoài'], ['旁边', 'pángbiān', 'beside', 'bên cạnh'], ['对面', 'duìmiàn', 'opposite', 'đối diện'], ['桌子', 'zhuōzi', 'table', 'cái bàn'], ['东南西北', 'dōng nán xī běi', 'E S W N', 'đông nam tây bắc']],
    pit: ['English-style order (“在上桌子”) is wrong: the location word goes after the noun. Also “桌子上在一本书” mixes the two patterns.', 'Trật tự kiểu Anh (“在上桌子”) sai: từ vị trí đứng sau danh từ. “桌子上在一本书” trộn lẫn hai mẫu câu.'],
    s: [['Location word follows the noun.', 'Từ vị trí đứng sau danh từ.'], ['Definite X + 在 + place; place + 有 + new X.', 'X xác định + 在 + nơi; nơi + 有 + X mới.'], ['东西南北 is the fixed order of compass points.', '东西南北 là thứ tự cố định của bốn phương.']],
    l: ['dir', 'gram', 'mdbg'],
    p: [['Say “The cat is under the table.”', 'Nói “Con mèo ở dưới bàn.”', '猫在桌子下边。', '猫在桌子下边。'], ['Say “There are two students in the classroom.”', 'Nói “Trong phòng học có hai học sinh.”', '教室里有两个学生。', '教室里有两个学生。'], ['Order of compass points?', 'Thứ tự bốn phương?', '东 西 南 北.', '东 西 南 北.']] }),

  D(P + '9-2', '9.2 Asking and giving directions', '9.2 Hỏi đường và chỉ đường', 'Hỏi đường, 往…拐, 一直走, 离, 从…到.', {
    n: '9.2',
    g: [['Ask the way politely', 'Hỏi đường lịch sự'], ['Give directions with 往, 拐, 一直走', 'Chỉ đường với 往, 拐, 一直走'], ['Use 离 and 从……到……', 'Dùng 离 và 从……到……']],
    b: [`<p>Ask: <span lang="zh">请问，地铁站在哪儿？</span> or <span lang="zh">去地铁站怎么走？</span> (<span lang="zh">怎么 zěnme</span> = how). Answers combine: <span lang="zh">一直走</span> (go straight), <span lang="zh">往左拐</span> (turn left; <span lang="zh">往 wǎng</span> = towards, <span lang="zh">拐 guǎi</span> = turn), <span lang="zh">到路口</span> (reach the crossing), <span lang="zh">过马路</span> (cross the road), <span lang="zh">红绿灯 hónglǜdēng</span> (traffic light). Confirm: <span lang="zh">不远，走五分钟就到了。</span></p>
<p><strong>离 lí</strong> “from/away from” expresses distance between two points: <span lang="zh">学校离我家很近</span>. <span lang="zh">近 jìn</span> near, <span lang="zh">远 yuǎn</span> far. Question: <span lang="zh">你家离学校远吗？</span> <strong>从……到……</strong> gives the route: <span lang="zh">从我家到学校要二十分钟</span>. 要 here = takes (time). <span lang="zh">就 jiù</span> stresses “just/only” and <span lang="zh">才 cái</span> “only after”.</p>
<p>Thank: <span lang="zh">谢谢，麻烦你了。</span> (Thanks for your trouble.)</p>`,
       `<p>Hỏi: <span lang="zh">请问，地铁站在哪儿？</span> hoặc <span lang="zh">去地铁站怎么走？</span> (<span lang="zh">怎么 zěnme</span> = thế nào). Câu trả lời ghép các cụm: <span lang="zh">一直走</span> (đi thẳng), <span lang="zh">往左拐</span> (rẽ trái; <span lang="zh">往 wǎng</span> = hướng về, <span lang="zh">拐 guǎi</span> = rẽ), <span lang="zh">到路口</span> (đến ngã tư), <span lang="zh">过马路</span> (qua đường), <span lang="zh">红绿灯 hónglǜdēng</span> (đèn giao thông). Xác nhận: <span lang="zh">不远，走五分钟就到了。</span></p>
<p><strong>离 lí</strong> “cách” biểu thị khoảng cách giữa hai điểm: <span lang="zh">学校离我家很近</span>. <span lang="zh">近 jìn</span> gần, <span lang="zh">远 yuǎn</span> xa. Hỏi: <span lang="zh">你家离学校远吗？</span> <strong>从……到……</strong> chỉ lộ trình: <span lang="zh">从我家到学校要二十分钟</span>. 要 ở đây = mất (thời gian). <span lang="zh">就 jiù</span> nhấn “chỉ/đã”, <span lang="zh">才 cái</span> “mãi mới”.</p>
<p>Cảm ơn: <span lang="zh">谢谢，麻烦你了。</span> (Cảm ơn, làm phiền bạn rồi.)</p>`],
    v: [['请问', 'qǐngwèn', 'excuse me, may I ask', 'xin hỏi'], ['怎么走', 'zěnme zǒu', 'how to get there', 'đi thế nào'], ['一直', 'yìzhí', 'straight on', 'thẳng'], ['往', 'wǎng', 'towards', 'về phía'], ['拐', 'guǎi', 'to turn', 'rẽ'], ['路口', 'lùkǒu', 'crossing', 'ngã tư'], ['红绿灯', 'hónglǜdēng', 'traffic light', 'đèn giao thông'], ['离', 'lí', 'away from', 'cách'], ['远', 'yuǎn', 'far', 'xa'], ['近', 'jìn', 'near', 'gần'], ['地铁站', 'dìtiězhàn', 'metro station', 'ga tàu điện ngầm']],
    d: [['A', '请问，地铁站在哪儿？', 'Qǐngwèn, dìtiězhàn zài nǎr?', 'Excuse me, where is the metro station?', 'Xin hỏi, ga tàu điện ngầm ở đâu?'], ['B', '一直走，到红绿灯往右拐。', 'Yìzhí zǒu, dào hónglǜdēng wǎng yòu guǎi.', 'Go straight, at the light turn right.', 'Đi thẳng, đến đèn giao thông rẽ phải.'], ['A', '远不远？', 'Yuǎn bu yuǎn?', 'Is it far?', 'Có xa không?'], ['B', '不远，走五分钟就到。', 'Bù yuǎn, zǒu wǔ fēnzhōng jiù dào.', 'Not far, five minutes on foot.', 'Không xa, đi bộ năm phút là tới.']],
    pit: ['“我家离学校到近” and “学校从我家很近” mix 离 and 从. Remember: 离 = distance state, 从…到 = route/time.', '“我家离学校到近” và “学校从我家很近” lẫn 离 và 从. Nhớ: 离 = khoảng cách, 从…到 = lộ trình/thời gian.'],
    s: [['怎么走 asks the way; 一直走, 往…拐 answer.', '怎么走 hỏi đường; 一直走, 往…拐 trả lời.'], ['A 离 B + adj gives distance.', 'A 离 B + tính từ nói khoảng cách.'], ['从 A 到 B 要 + time.', '从 A 到 B 要 + thời gian.']],
    l: ['dir', 'wikib', 'mdbg'],
    p: [['Say “Turn left at the crossing.”', 'Nói “Đến ngã tư rẽ trái.”', '到路口往左拐。', '到路口往左拐。'], ['Say “The library is close to my dorm.”', 'Nói “Thư viện gần ký túc xá của tôi.”', '图书馆离我的宿舍很近。', '图书馆离我的宿舍很近。'], ['Ask how long it takes from home to school.', 'Hỏi từ nhà đến trường mất bao lâu.', '从家到学校要多长时间？', '从家到学校要多长时间？']] }),

  D(P + '9-3', '9.3 Transport & how long it takes', '9.3 Phương tiện và thời gian di chuyển', '坐 / 骑 / 开, 多长时间, 要, 先…再…', {
    n: '9.3',
    g: [['Name vehicles and use 坐/骑/开', 'Gọi tên phương tiện và dùng 坐/骑/开'], ['Say how you travel and how long it takes', 'Nói đi bằng gì và mất bao lâu'], ['Sequence actions with 先……再……', 'Sắp xếp hành động với 先……再……']],
    b: [`<p>Verbs by vehicle: <span lang="zh">坐 zuò</span> ride as a passenger (bus, metro, taxi, plane, train), <span lang="zh">骑 qí</span> straddle (bike, motorbike), <span lang="zh">开 kāi</span> drive (car), <span lang="zh">走路 zǒulù</span> walk. Pattern: <span lang="zh">我坐地铁去学校</span> (go to school <em>by</em> metro): the means precedes the verb of going. <span lang="zh">怎么去？</span> asks the means.</p>
<p><strong>Duration.</strong> Amount of time follows the verb: <span lang="zh">坐地铁要三十分钟</span>, <span lang="zh">我学了两年汉语</span>. Question <span lang="zh">要多长时间？</span> Possible words: <span lang="zh">一个小时 yí ge xiǎoshí</span> (1 hour), <span lang="zh">半个小时</span>, <span lang="zh">两天</span>. Note: <em>duration</em> (how long, after verb) differs from <em>point in time</em> (when, before verb).</p>
<p><strong>先……再……</strong> “first…, then…”: <span lang="zh">先坐公共汽车，再换地铁</span> (first bus, then change to metro; <span lang="zh">换 huàn</span> = change).</p>`,
       `<p>Động từ theo phương tiện: <span lang="zh">坐 zuò</span> ngồi (xe buýt, tàu điện, taxi, máy bay, tàu hoả), <span lang="zh">骑 qí</span> cưỡi (xe đạp, xe máy), <span lang="zh">开 kāi</span> lái (ô tô), <span lang="zh">走路 zǒulù</span> đi bộ. Mẫu: <span lang="zh">我坐地铁去学校</span> (đi học <em>bằng</em> tàu điện): phương tiện đứng trước động từ đi. <span lang="zh">怎么去？</span> hỏi phương tiện.</p>
<p><strong>Khoảng thời gian.</strong> Lượng thời gian đứng sau động từ: <span lang="zh">坐地铁要三十分钟</span>, <span lang="zh">我学了两年汉语</span>. Hỏi <span lang="zh">要多长时间？</span> Từ có thể dùng: <span lang="zh">一个小时 yí ge xiǎoshí</span> (1 giờ), <span lang="zh">半个小时</span>, <span lang="zh">两天</span>. Lưu ý: <em>khoảng thời gian</em> (bao lâu, sau động từ) khác <em>thời điểm</em> (khi nào, trước động từ).</p>
<p><strong>先……再……</strong> “trước…, rồi…”: <span lang="zh">先坐公共汽车，再换地铁</span> (trước đi xe buýt, sau đổi sang tàu điện; <span lang="zh">换 huàn</span> = đổi).</p>`],
    v: [['坐', 'zuò', 'to sit, to ride', 'ngồi, đi (xe)'], ['骑', 'qí', 'to ride (bike)', 'cưỡi, đi (xe đạp)'], ['开', 'kāi', 'to drive; open', 'lái; mở'], ['地铁', 'dìtiě', 'metro', 'tàu điện ngầm'], ['公共汽车', 'gōnggòng qìchē', 'bus', 'xe buýt'], ['出租车', 'chūzūchē', 'taxi', 'taxi'], ['自行车', 'zìxíngchē', 'bicycle', 'xe đạp'], ['飞机', 'fēijī', 'plane', 'máy bay'], ['火车', 'huǒchē', 'train', 'tàu hoả'], ['小时', 'xiǎoshí', 'hour', 'giờ (khoảng thời gian)'], ['分钟', 'fēnzhōng', 'minute', 'phút'], ['换', 'huàn', 'to change', 'đổi, chuyển']],
    pit: ['“我去学校坐地铁” (means after the verb) is wrong: 我坐地铁去学校. Also 小时 is a duration (3小时); the clock hour is 点.', '“我去学校坐地铁” (phương tiện sau) sai: 我坐地铁去学校. 小时 là khoảng thời gian (3小时); giờ trên đồng hồ là 点.'],
    s: [['坐 passenger, 骑 straddle, 开 drive.', '坐 hành khách, 骑 cưỡi, 开 lái.'], ['Means before the verb; duration after the verb.', 'Phương tiện trước động từ; khoảng thời gian sau động từ.'], ['先……再…… sequences actions.', '先……再…… sắp xếp trình tự.']],
    l: ['gram', 'cuis', 'wikib'],
    p: [['Say “I go to work by bike.”', 'Nói “Tôi đi làm bằng xe đạp.”', '我骑自行车去上班。', '我骑自行车去上班。'], ['Ask: “How long does it take by metro?”', 'Hỏi: “Đi tàu điện mất bao lâu?”', '坐地铁要多长时间？', '坐地铁要多长时间？'], ['Which verb for a car?', 'Động từ nào cho ô tô?', '开.', '开.']] }),

  Q(P + 'quiz-9', 'Quiz 9 — Directions', 'Quiz 9 — Phương hướng', [
    [['“On the table”:', '“Trên bàn”:'], ['桌子上', '上桌子', '在上桌子', '桌上子'], 0, ['Location word follows the noun.', 'Từ vị trí đứng sau danh từ.']],
    [['Which pattern introduces a new thing?', 'Mẫu nào giới thiệu vật mới?'], ['书在桌子上', '桌子上有一本书', '桌子上是书在', '书有桌子'], 1, ['Place + 有 + new thing.', 'Nơi + 有 + vật mới.']],
    [['“Turn left”:', '“Rẽ trái”:'], ['往左拐', '左往拐', '拐往左', '往拐左'], 0, ['往 + direction + 拐.', '往 + hướng + 拐.']],
    [['“The school is near my home.”', '“Trường gần nhà tôi.”'], ['学校离我家很近', '学校从我家很近', '学校到我家近', '学校在我家近'], 0, ['离 expresses distance.', '离 chỉ khoảng cách.']],
    [['Verb for a bus:', 'Động từ cho xe buýt:'], ['坐', '骑', '开', '走'], 0, ['坐 = ride as a passenger.', '坐 = đi (hành khách).']],
    [['Duration goes:', 'Khoảng thời gian đứng:'], ['before the verb', 'after the verb', 'sentence start only', 'nowhere'], 1, ['我学了两年.', '我学了两年.']],
    [['Order of compass:', 'Thứ tự bốn phương:'], ['东西南北', '北南西东', '东南西北', '南北东西'], 0, ['Fixed order dōng xī nán běi.', 'Thứ tự cố định dōng xī nán běi.']],
    [['“First…then…”:', '“Trước…rồi…”:'], ['先……再……', '再……先……', '也……都……', '又……又……'], 0, ['先…再… sequences.', '先…再… sắp xếp.']],
  ]),
]));

// ===== Chương 10: Sở thích, thời tiết, thể =====
secs.push(SEC('Chapter 10 — Hobbies, weather and aspect', 'Chương 10 — Sở thích, thời tiết và thể',
  'Sở thích, thời tiết và so sánh 比, các trợ từ 了 / 过 / 在.', [
  D(P + '10-1', '10.1 Hobbies & leisure', '10.1 Sở thích và giải trí', '喜欢, 爱好, 最, 会, 一起, câu liên động.', {
    n: '10.1',
    g: [['Talk about hobbies', 'Nói về sở thích'], ['Use 喜欢, 最, 爱好', 'Dùng 喜欢, 最, 爱好'], ['Invite someone to an activity', 'Mời ai tham gia hoạt động']],
    b: [`<p>Ask: <span lang="zh">你有什么爱好？</span> (<span lang="zh">爱好 àihào</span> = hobby) or <span lang="zh">你喜欢做什么？</span>. Answer: <span lang="zh">我喜欢听音乐 / 看电影 / 打篮球 / 踢足球 / 唱歌 / 跳舞 / 旅游 / 游泳 / 上网</span>. Ball sports use <span lang="zh">打</span> (basketball, tennis, badminton) except football: <span lang="zh">踢足球</span>.</p>
<p><strong>最 zuì</strong> = most: <span lang="zh">我最喜欢听音乐</span> (what I like best). Frequency: <span lang="zh">常常 有时候 很少 从不</span>. Degree of skill: <span lang="zh">他游泳游得很好</span> (he swims very well; the 得 pattern: V + 得 + adj, see 11.1).</p>
<p>Invitation: <span lang="zh">周末我们一起去看电影，好吗？</span> “Let’s go to a film this weekend, OK?” Accept: <span lang="zh">好啊</span> / <span lang="zh">太好了</span>; refuse politely: <span lang="zh">对不起，我有事</span> (sorry, I am busy) / <span lang="zh">下次吧</span> (next time).</p>`,
       `<p>Hỏi: <span lang="zh">你有什么爱好？</span> (<span lang="zh">爱好 àihào</span> = sở thích) hoặc <span lang="zh">你喜欢做什么？</span>. Trả lời: <span lang="zh">我喜欢听音乐 / 看电影 / 打篮球 / 踢足球 / 唱歌 / 跳舞 / 旅游 / 游泳 / 上网</span>. Môn bóng dùng <span lang="zh">打</span> (bóng rổ, quần vợt, cầu lông) trừ bóng đá: <span lang="zh">踢足球</span>.</p>
<p><strong>最 zuì</strong> = nhất: <span lang="zh">我最喜欢听音乐</span> (thích nhất). Tần suất: <span lang="zh">常常 有时候 很少 从不</span>. Mức độ: <span lang="zh">他游泳游得很好</span> (anh ấy bơi rất giỏi; mẫu V + 得 + tính từ, xem 11.1).</p>
<p>Lời mời: <span lang="zh">周末我们一起去看电影，好吗？</span> “Cuối tuần mình đi xem phim nhé?” Nhận lời: <span lang="zh">好啊</span> / <span lang="zh">太好了</span>; từ chối lịch sự: <span lang="zh">对不起，我有事</span> (xin lỗi, tôi bận) / <span lang="zh">下次吧</span> (lần sau nhé).</p>`],
    v: [['爱好', 'àihào', 'hobby', 'sở thích'], ['音乐', 'yīnyuè', 'music', 'âm nhạc'], ['电影', 'diànyǐng', 'movie', 'phim'], ['篮球', 'lánqiú', 'basketball', 'bóng rổ'], ['足球', 'zúqiú', 'football', 'bóng đá'], ['唱歌', 'chànggē', 'to sing', 'hát'], ['跳舞', 'tiàowǔ', 'to dance', 'nhảy'], ['旅游', 'lǚyóu', 'to travel', 'du lịch'], ['上网', 'shàngwǎng', 'to go online', 'lên mạng'], ['最', 'zuì', 'most', 'nhất'], ['周末', 'zhōumò', 'weekend', 'cuối tuần']],
    pit: ['Using 打 for football (“打足球”) is not standard; say 踢足球. Also, 喜欢 + noun is fine (我喜欢音乐), and with a verb the verb stays bare (我喜欢游泳).', 'Dùng 打 cho bóng đá (“打足球”) không chuẩn; phải nói 踢足球. 喜欢 + danh từ được (我喜欢音乐), với động từ thì giữ nguyên dạng (我喜欢游泳).'],
    s: [['喜欢 + V/N; 最喜欢 = like best.', '喜欢 + V/N; 最喜欢 = thích nhất.'], ['打 for most ball sports; 踢 for football.', '打 cho đa số môn bóng; 踢 cho bóng đá.'], ['Invitation + 好吗; refuse with 对不起，我有事.', 'Mời + 好吗; từ chối bằng 对不起，我有事.']],
    l: ['coursera', 'gram', 'mdbg'],
    p: [['Say “I like swimming and singing best.”', 'Nói “Tôi thích nhất là bơi và hát.”', '我最喜欢游泳和唱歌。', '我最喜欢游泳和唱歌。'], ['Invite a friend to see a movie.', 'Mời bạn đi xem phim.', '我们一起去看电影，好吗？', '我们一起去看电影，好吗？'], ['Verb for basketball?', 'Động từ cho bóng rổ?', '打.', '打.']] }),

  D(P + '10-2', '10.2 Weather, seasons & comparison with 比', '10.2 Thời tiết, mùa và so sánh với 比', '天气, 四季, 下雨, 比 / 没有 / 一样.', {
    n: '10.2',
    g: [['Describe weather and seasons', 'Mô tả thời tiết và các mùa'], ['Compare with 比, 没有, 一样', 'So sánh với 比, 没有, 一样'], ['Ask about weather and temperature', 'Hỏi về thời tiết và nhiệt độ']],
    b: [`<p>Ask: <span lang="zh">今天天气怎么样？</span> Answer: <span lang="zh">今天很热 / 很冷 / 天气很好 / 下雨了 / 刮风</span>. Weather verbs: <span lang="zh">下雨 xiàyǔ</span>, <span lang="zh">下雪 xiàxuě</span>, <span lang="zh">刮风 guāfēng</span>. Adjectives: <span lang="zh">晴 qíng</span> sunny, <span lang="zh">阴 yīn</span> overcast, <span lang="zh">冷 lěng</span>, <span lang="zh">热 rè</span>, <span lang="zh">凉快 liángkuai</span> pleasantly cool, <span lang="zh">暖和 nuǎnhuo</span> warm. Seasons: <span lang="zh">春 夏 秋 冬</span> + <span lang="zh">天</span>: <span lang="zh">夏天</span>. Temperature: <span lang="zh">今天三十度</span> (30°C).</p>
<p><strong>Comparison.</strong> A <span lang="zh">比</span> B + adjective: <span lang="zh">今天比昨天热</span>. Do <em>not</em> add 很 before the adjective; amount of difference goes after: <span lang="zh">热三度</span>, <span lang="zh">热一点儿</span>, <span lang="zh">热多了</span>. Negative: <span lang="zh">A 没有 B + adj</span>: <span lang="zh">河内没有北京冷</span> (not as cold). Equal: <span lang="zh">A 跟 B 一样 + adj</span>: <span lang="zh">今天跟昨天一样热</span>.</p>`,
       `<p>Hỏi: <span lang="zh">今天天气怎么样？</span> Trả lời: <span lang="zh">今天很热 / 很冷 / 天气很好 / 下雨了 / 刮风</span>. Động từ thời tiết: <span lang="zh">下雨 xiàyǔ</span>, <span lang="zh">下雪 xiàxuě</span>, <span lang="zh">刮风 guāfēng</span>. Tính từ: <span lang="zh">晴 qíng</span> nắng, <span lang="zh">阴 yīn</span> âm u, <span lang="zh">冷 lěng</span>, <span lang="zh">热 rè</span>, <span lang="zh">凉快 liángkuai</span> mát mẻ, <span lang="zh">暖和 nuǎnhuo</span> ấm. Mùa: <span lang="zh">春 夏 秋 冬</span> + <span lang="zh">天</span>: <span lang="zh">夏天</span>. Nhiệt độ: <span lang="zh">今天三十度</span> (30°C).</p>
<p><strong>So sánh.</strong> A <span lang="zh">比</span> B + tính từ: <span lang="zh">今天比昨天热</span>. <em>Không</em> thêm 很 trước tính từ; mức chênh lệch đặt sau: <span lang="zh">热三度</span>, <span lang="zh">热一点儿</span>, <span lang="zh">热多了</span>. Phủ định: <span lang="zh">A 没有 B + tính từ</span>: <span lang="zh">河内没有北京冷</span> (không lạnh bằng). Bằng nhau: <span lang="zh">A 跟 B 一样 + tính từ</span>: <span lang="zh">今天跟昨天一样热</span>.</p>`],
    v: [['天气', 'tiānqì', 'weather', 'thời tiết'], ['下雨', 'xiàyǔ', 'to rain', 'mưa'], ['下雪', 'xiàxuě', 'to snow', 'tuyết rơi'], ['刮风', 'guāfēng', 'windy', 'có gió'], ['晴', 'qíng', 'sunny', 'nắng'], ['阴', 'yīn', 'overcast', 'âm u'], ['冷', 'lěng', 'cold', 'lạnh'], ['热', 'rè', 'hot', 'nóng'], ['春天', 'chūntiān', 'spring', 'mùa xuân'], ['夏天', 'xiàtiān', 'summer', 'mùa hè'], ['秋天', 'qiūtiān', 'autumn', 'mùa thu'], ['冬天', 'dōngtiān', 'winter', 'mùa đông'], ['比', 'bǐ', 'compared with', 'so với'], ['一样', 'yíyàng', 'same', 'giống nhau']],
    pit: ['“今天比昨天很热” is wrong; 比 sentences never take 很. And “A 不比 B…” does not mean “A is much less than B” but “A is not more than B”.', '“今天比昨天很热” sai; câu 比 không dùng 很. “A 不比 B…” không có nghĩa “ít hơn nhiều” mà là “không hơn B”.'],
    s: [['A 比 B + adj (no 很); difference after the adjective.', 'A 比 B + tính từ (không 很); mức chênh sau tính từ.'], ['没有 for “not as…as”.', '没有 cho “không bằng”.'], ['跟……一样 for equal.', '跟……一样 cho bằng nhau.']],
    l: ['gram', 'cal', 'coursera'],
    p: [['Say “Today is hotter than yesterday.”', 'Nói “Hôm nay nóng hơn hôm qua.”', '今天比昨天热。', '今天比昨天热。'], ['Say “Hanoi is not as cold as Beijing.”', 'Nói “Hà Nội không lạnh bằng Bắc Kinh.”', '河内没有北京冷。', '河内没有北京冷。'], ['Fix: 他比我很高。', 'Sửa: 他比我很高。', '他比我高。', '他比我高。']] }),

  D(P + '10-3', '10.3 Aspect: 了, 过, 在, 着', '10.3 Thể: 了, 过, 在, 着', 'Hoàn thành 了, kinh nghiệm 过, tiến hành 在, trạng thái 着.', {
    n: '10.3',
    g: [['Use 了 for completed actions and changes', 'Dùng 了 cho hành động hoàn thành và sự thay đổi'], ['Use 过 for experience, 在 for ongoing actions', 'Dùng 过 cho kinh nghiệm, 在 cho hành động đang diễn ra'], ['Negate each aspect correctly', 'Phủ định đúng từng thể']],
    b: [`<p>Chinese marks <em>aspect</em> (how an action unfolds), not tense. Four markers:</p>
<ul><li><strong>了 (verb suffix)</strong>: completed: <span lang="zh">我吃了饭</span>. With a plain object it usually needs more information: <span lang="zh">我吃了两碗饭</span> or a follow-on clause <span lang="zh">我吃了饭就去上课</span>. <strong>了 (sentence-final)</strong>: new situation/change: <span lang="zh">下雨了</span>, <span lang="zh">我二十岁了</span>. Negative: <span lang="zh">没(有)</span> and <em>drop</em> 了: <span lang="zh">我没吃饭</span>. Question: <span lang="zh">你吃饭了吗？</span> / <span lang="zh">你吃了没有？</span></li>
<li><strong>过 guo</strong>: experience: <span lang="zh">我去过中国</span> (I have been to China); negative <span lang="zh">我没去过</span>.</li>
<li><strong>在 / 正在 zài/zhèngzài</strong>: ongoing: <span lang="zh">他在看书</span>; negative <span lang="zh">他没在看书</span>; often ends with 呢: <span lang="zh">我正在吃饭呢</span>.</li>
<li><strong>着 zhe</strong>: continuing state: <span lang="zh">门开着</span> (the door is open), <span lang="zh">他穿着红衣服</span>.</li></ul>`,
       `<p>Tiếng Trung đánh dấu <em>thể</em> (diễn tiến của hành động) chứ không đánh dấu thì. Bốn trợ từ:</p>
<ul><li><strong>了 (đứng sau động từ)</strong>: hoàn thành: <span lang="zh">我吃了饭</span>. Khi tân ngữ trơn, thường cần thêm thông tin: <span lang="zh">我吃了两碗饭</span> hoặc mệnh đề sau <span lang="zh">我吃了饭就去上课</span>. <strong>了 (cuối câu)</strong>: tình huống mới/thay đổi: <span lang="zh">下雨了</span>, <span lang="zh">我二十岁了</span>. Phủ định: <span lang="zh">没(有)</span> và <em>bỏ</em> 了: <span lang="zh">我没吃饭</span>. Hỏi: <span lang="zh">你吃饭了吗？</span> / <span lang="zh">你吃了没有？</span></li>
<li><strong>过 guo</strong>: kinh nghiệm: <span lang="zh">我去过中国</span> (tôi từng đến Trung Quốc); phủ định <span lang="zh">我没去过</span>.</li>
<li><strong>在 / 正在 zài/zhèngzài</strong>: đang diễn ra: <span lang="zh">他在看书</span>; phủ định <span lang="zh">他没在看书</span>; hay có 呢 cuối câu: <span lang="zh">我正在吃饭呢</span>.</li>
<li><strong>着 zhe</strong>: trạng thái tiếp diễn: <span lang="zh">门开着</span> (cửa đang mở), <span lang="zh">他穿着红衣服</span>.</li></ul>`],
    v: [['了', 'le', 'completed-action particle', 'trợ từ hoàn thành'], ['过', 'guo', 'experiential particle', 'trợ từ kinh nghiệm'], ['正在', 'zhèngzài', 'in the middle of', 'đang'], ['着', 'zhe', 'continuous particle', 'trợ từ trạng thái'], ['没', 'méi', 'not (past/completed)', 'chưa, không (quá khứ)'], ['已经', 'yǐjīng', 'already', 'đã'], ['还没', 'hái méi', 'not yet', 'chưa'], ['去过', 'qùguo', 'have been to', 'đã từng đến'], ['门', 'mén', 'door', 'cửa'], ['开', 'kāi', 'to open', 'mở']],
    d: [['A', '你去过中国吗？', 'Nǐ qùguo Zhōngguó ma?', 'Have you been to China?', 'Bạn từng đến Trung Quốc chưa?'], ['B', '没去过，我想明年去。你呢？', 'Méi qùguo, wǒ xiǎng míngnián qù. Nǐ ne?', 'Not yet, I want to go next year. You?', 'Chưa, tôi muốn đi năm sau. Còn bạn?'], ['A', '我去过北京，现在正在学汉语。', 'Wǒ qùguo Běijīng, xiànzài zhèngzài xué Hànyǔ.', 'I have been to Beijing, now I am learning Chinese.', 'Tôi từng đến Bắc Kinh, bây giờ đang học tiếng Trung.'], ['B', '你吃饭了吗？', 'Nǐ chīfàn le ma?', 'Have you eaten?', 'Bạn ăn cơm chưa?']],
    pit: ['“我没吃了饭” is wrong: negated past drops 了. Also 了 is not a past-tense marker: “明天我吃了饭就去” is about the future.', '“我没吃了饭” sai: phủ định quá khứ bỏ 了. 了 không phải dấu quá khứ: “明天我吃了饭就去” nói về tương lai.'],
    s: [['了 completes or signals change; 过 experience.', '了 hoàn thành hay báo thay đổi; 过 kinh nghiệm.'], ['在/正在 ongoing; 着 state.', '在/正在 đang diễn ra; 着 trạng thái.'], ['Negate completed/experienced with 没(有), drop 了.', 'Phủ định bằng 没(有), bỏ 了.']],
    l: ['asp', 'gram', 'coursera'],
    p: [['Say “I haven’t eaten yet.”', 'Nói “Tôi chưa ăn cơm.”', '我还没吃饭。', '我还没吃饭。'], ['Say “I’ve been to Vietnam.”', 'Nói “Tôi từng đến Việt Nam.”', '我去过越南。', '我去过越南。'], ['Which marker: “It’s raining now (new situation)”?', 'Trợ từ nào: “Bây giờ trời mưa rồi”?', '下雨了 (sentence-final 了).', '下雨了 (了 cuối câu).']] }),

  Q(P + 'quiz-10', 'Quiz 10 — Hobbies, weather, aspect', 'Quiz 10 — Sở thích, thời tiết, thể', [
    [['Verb for football:', 'Động từ cho bóng đá:'], ['打', '踢', '玩', '做'], 1, ['踢足球.', '踢足球.']],
    [['“Most like” is:', '“Thích nhất” là:'], ['最喜欢', '很喜欢', '太喜欢', '都喜欢'], 0, ['最 = most.', '最 = nhất.']],
    [['Correct comparison:', 'So sánh đúng:'], ['今天比昨天热', '今天比昨天很热', '今天很比昨天热', '今天热比昨天'], 0, ['Never 很 after 比.', 'Không dùng 很 sau 比.']],
    [['“Not as cold as Beijing”:', '“Không lạnh bằng Bắc Kinh”:'], ['没有北京冷', '不比北京很冷', '跟北京冷', '比不北京冷'], 0, ['A 没有 B + adj.', 'A 没有 B + tính từ.']],
    [['Marker for experience:', 'Trợ từ kinh nghiệm:'], ['了', '过', '着', '在'], 1, ['过 guo.', '过 guo.']],
    [['Negative of 我吃了饭:', 'Phủ định của 我吃了饭:'], ['我没吃饭', '我不吃了饭', '我没吃了饭', '我吃没饭'], 0, ['没 + verb, drop 了.', '没 + động từ, bỏ 了.']],
    [['下雨了 means:', '下雨了 nghĩa:'], ['It rained yesterday', 'It has started to rain', 'It never rains', 'Will it rain?'], 1, ['了 marks a new situation.', '了 báo tình huống mới.']],
    [['门开着 expresses:', '门开着 diễn đạt:'], ['a state', 'a past event', 'experience', 'a command'], 0, ['着 = continuing state.', '着 = trạng thái tiếp diễn.']],
  ]),
]));
// ===== Chương 11: Ôn tập =====
secs.push(SEC('Chapter 11 — Review and exam skills', 'Chương 11 — Ôn tập và kỹ năng thi',
  'Bảng ngữ pháp tổng hợp, bổ ngữ trình độ 得, hội thoại tổng hợp và cách ôn thi.', [
  D(P + '11-1', '11.1 Grammar review table & the 得 complement', '11.1 Bảng ngữ pháp tổng hợp và bổ ngữ trình độ 得', 'Tổng kết mẫu câu, thêm V+得+adj.', {
    n: '11.1',
    g: [['Review the 15 core patterns', 'Ôn 15 mẫu câu cốt lõi'], ['Use V + 得 + adjective to evaluate an action', 'Dùng V + 得 + tính từ để đánh giá hành động'], ['Find and fix your own typical errors', 'Tự tìm và sửa lỗi thường gặp của mình']],
    b: [tbl(['Pattern', 'Example'], [
        ['A 是 B', '我是学生。'], ['Adj predicate with 很', '她很高。'], ['有 / 没有', '我有一个哥哥，没有姐姐。'], ['吗 / 呢 / 吧', '你好吗？我很好，你呢？我们走吧。'],
        ['Time before verb', '我八点上课。'], ['在 + place + V', '我在图书馆看书。'], ['去/来 + place', '我去学校。'], ['Modals 想 会 能 可以', '我想学汉语，也会说一点儿。'],
        ['还是 (questions)', '你喝茶还是喝咖啡？'], ['离 / 从……到……', '学校离我家很近。从家到学校要二十分钟。'], ['比', '今天比昨天热。'], ['了 (complete/change)', '我吃了饭。下雨了。'], ['过 (experience)', '我去过北京。'], ['在 (ongoing)', '他在看书。'], ['先……再……', '先坐地铁，再换公共汽车。']]) +
      `<p><strong>V + 得 + adjective.</strong> Describes how well an action is done: <span lang="zh">他说得很好</span> (he speaks very well). With an object repeat the verb: <span lang="zh">他说汉语说得很好</span>, <span lang="zh">她唱歌唱得好听</span>. Negative: <span lang="zh">说得不好</span>. Question: <span lang="zh">他说得好不好？</span> This 得 (de, neutral) differs from the 的 of possession and the 地 de for adverbs (which you will meet later).</p>`,
       tbl(['Mẫu câu', 'Ví dụ'], [
        ['A 是 B', '我是学生。'], ['Vị ngữ tính từ với 很', '她很高。'], ['有 / 没有', '我有一个哥哥，没有姐姐。'], ['吗 / 呢 / 吧', '你好吗？我很好，你呢？我们走吧。'],
        ['Thời gian trước động từ', '我八点上课。'], ['在 + nơi + V', '我在图书馆看书。'], ['去/来 + nơi', '我去学校。'], ['Năng nguyện 想 会 能 可以', '我想学汉语，也会说一点儿。'],
        ['还是 (câu hỏi)', '你喝茶还是喝咖啡？'], ['离 / 从……到……', '学校离我家很近。从家到学校要二十分钟。'], ['比', '今天比昨天热。'], ['了 (hoàn thành/thay đổi)', '我吃了饭。下雨了。'], ['过 (kinh nghiệm)', '我去过北京。'], ['在 (đang diễn ra)', '他在看书。'], ['先……再……', '先坐地铁，再换公共汽车。']]) +
      `<p><strong>V + 得 + tính từ.</strong> Đánh giá hành động làm tốt đến đâu: <span lang="zh">他说得很好</span> (anh ấy nói rất tốt). Có tân ngữ thì lặp động từ: <span lang="zh">他说汉语说得很好</span>, <span lang="zh">她唱歌唱得好听</span>. Phủ định: <span lang="zh">说得不好</span>. Hỏi: <span lang="zh">他说得好不好？</span> 得 (de, thanh nhẹ) này khác 的 sở hữu và 地 de của phó từ (sẽ gặp sau).</p>`],
    v: [['说得好', 'shuō de hǎo', 'speaks well', 'nói giỏi'], ['写得很快', 'xiě de hěn kuài', 'writes quickly', 'viết nhanh'], ['听得懂', 'tīng de dǒng', 'can understand (by listening)', 'nghe hiểu'], ['看不懂', 'kàn bu dǒng', 'cannot understand (by reading)', 'đọc không hiểu'], ['慢', 'màn', 'slow', 'chậm'], ['快', 'kuài', 'fast', 'nhanh'], ['再说一遍', 'zài shuō yí biàn', 'say it once more', 'nói lại một lần nữa'], ['对', 'duì', 'correct', 'đúng'], ['错', 'cuò', 'wrong', 'sai']],
    pit: ['Forgetting to repeat the verb with an object (“他说汉语得很好”), and adding 很 in the wrong place. Keep a personal list of your top 5 errors and test them weekly.', 'Quên lặp động từ khi có tân ngữ (“他说汉语得很好”) và đặt 很 sai chỗ. Giữ danh sách 5 lỗi hay mắc của chính bạn và kiểm lại mỗi tuần.'],
    s: [['15 patterns cover about HSK 1–2 grammar.', '15 mẫu câu bao gồm ngữ pháp HSK 1–2.'], ['V(O)V + 得 + adj evaluates an action.', 'V(O)V + 得 + tính từ đánh giá hành động.'], ['Track personal errors.', 'Theo dõi lỗi cá nhân.']],
    l: ['gram', 'hsk', 'wikib'],
    p: [['Say “She sings very well.”', 'Nói “Cô ấy hát rất hay.”', '她唱歌唱得很好。', '她唱歌唱得很好。'], ['Correct: 他写字得很快。', 'Sửa: 他写字得很快。', '他写字写得很快。', '他写字写得很快。'], ['Make the negative of 他说得好.', 'Phủ định của 他说得好.', '他说得不好。', '他说得不好。']] }),

  D(P + '11-2', '11.2 Integrated dialogue, writing and exam plan', '11.2 Hội thoại tổng hợp, bài viết và kế hoạch ôn thi', 'Hội thoại tổng hợp, mẫu đoạn văn, tự đánh giá, HSK.', {
    n: '11.2',
    g: [['Read a dialogue that uses the whole course', 'Đọc hội thoại dùng cả khoá'], ['Write a 6–8 sentence paragraph', 'Viết đoạn 6–8 câu'], ['Plan the last weeks before an exam', 'Lập kế hoạch cho vài tuần cuối trước thi']],
    b: [`<p><strong>Reading.</strong> Read the dialogue below aloud three times: first with pinyin, then without, then with only the English/Vietnamese gloss. It combines greeting, introduction, time, directions, food and aspect.</p>
<p><strong>Writing task.</strong> Write 6–8 sentences about “My weekend”: when you get up, where you go, how you go, what you eat, whom you meet and how you feel. Model: <span lang="zh">星期六我八点起床。我骑自行车去图书馆看书。中午我在食堂吃了面条，很好吃。下午我和朋友一起去看电影。晚上我回家，有点儿累。</span> (<span lang="zh">累 lèi</span> tired; <span lang="zh">回 huí</span> go back).</p>
<p><strong>Exam skills.</strong> HSK level 1–2 tests (in the six-level version) cover roughly 150 and 300 words; HSK has been reformed, so ask your lecturer which format your exam uses. Typical tasks: match pictures to sentences, choose the word that fits, reorder words into a sentence, listen and answer. A practical weekly plan: Mon–Thu 30 min new content + 15 min review; Fri mock test; Sat dialogue shadowing; Sun rest and error list.</p>`,
       `<p><strong>Đọc.</strong> Đọc to hội thoại dưới đây ba lần: lần một có pinyin, lần hai không có, lần ba chỉ nhìn phần dịch tiếng Anh/Việt. Hội thoại tổng hợp chào hỏi, giới thiệu, thời gian, chỉ đường, ăn uống và thể.</p>
<p><strong>Bài viết.</strong> Viết 6–8 câu về “Cuối tuần của tôi”: mấy giờ dậy, đi đâu, đi bằng gì, ăn gì, gặp ai và cảm giác thế nào. Mẫu: <span lang="zh">星期六我八点起床。我骑自行车去图书馆看书。中午我在食堂吃了面条，很好吃。下午我和朋友一起去看电影。晚上我回家，有点儿累。</span> (<span lang="zh">累 lèi</span> mệt; <span lang="zh">回 huí</span> về).</p>
<p><strong>Kỹ năng thi.</strong> HSK cấp 1–2 (bản sáu cấp) khoảng 150 và 300 từ; HSK đã được cải cách, hãy hỏi giảng viên đề của bạn theo dạng nào. Dạng bài hay gặp: nối tranh với câu, chọn từ điền chỗ trống, sắp xếp từ thành câu, nghe và trả lời. Kế hoạch tuần gợi ý: T2–T5 30 phút bài mới + 15 phút ôn; T6 thi thử; T7 nhại hội thoại; CN nghỉ và rà danh sách lỗi.</p>`],
    v: [['累', 'lèi', 'tired', 'mệt'], ['回', 'huí', 'to return', 'về'], ['周末', 'zhōumò', 'weekend', 'cuối tuần'], ['起床', 'qǐchuáng', 'to get up', 'thức dậy'], ['复习', 'fùxí', 'to review', 'ôn tập'], ['考试', 'kǎoshì', 'exam', 'kỳ thi'], ['练习', 'liànxí', 'practice', 'luyện tập'], ['成绩', 'chéngjì', 'score', 'thành tích, điểm']],
    d: [['小明', '你好，我叫小明，是越南学生。', 'Nǐ hǎo, wǒ jiào Xiǎo Míng, shì Yuènán xuésheng.', 'Hello, I am Xiao Ming, a Vietnamese student.', 'Chào bạn, tôi là Tiểu Minh, sinh viên Việt Nam.'], ['丽丽', '你好，我叫丽丽。你现在去哪儿？', 'Nǐ hǎo, wǒ jiào Lìli. Nǐ xiànzài qù nǎr?', 'Hi, I am Lili. Where are you going now?', 'Chào bạn, tôi là Lệ Lệ. Bạn đi đâu đấy?'], ['小明', '我去食堂吃饭，你吃了吗？', 'Wǒ qù shítáng chīfàn, nǐ chī le ma?', 'To the canteen. Have you eaten?', 'Tôi đi nhà ăn ăn cơm, bạn ăn chưa?'], ['丽丽', '还没吃。食堂在哪儿？', 'Hái méi chī. Shítáng zài nǎr?', 'Not yet. Where is the canteen?', 'Chưa. Nhà ăn ở đâu?'], ['小明', '一直走，图书馆旁边。我们一起去吧。', 'Yìzhí zǒu, túshūguǎn pángbiān. Wǒmen yìqǐ qù ba.', 'Straight on, next to the library. Let us go together.', 'Đi thẳng, cạnh thư viện. Mình cùng đi nhé.']],
    pit: ['Cramming the night before. Language is a skill: five short sessions beat one long one. Another trap is only reading pinyin: practise recognising characters without pinyin, as exams do.', 'Học nhồi nhét đêm trước. Ngôn ngữ là kỹ năng: năm buổi ngắn tốt hơn một buổi dài. Cũng đừng chỉ đọc pinyin: tập nhận chữ Hán không pinyin như đề thi.'],
    s: [['Read aloud, then without pinyin.', 'Đọc to, rồi đọc không pinyin.'], ['Write 6–8 connected sentences weekly.', 'Mỗi tuần viết 6–8 câu liền mạch.'], ['Confirm exam format with the lecturer.', 'Xác nhận dạng đề với giảng viên.']],
    l: ['hsk', 'coursera', 'hanziw'],
    p: [['Write 3 sentences about yesterday using 了.', 'Viết 3 câu về hôm qua dùng 了.', 'Eg: 昨天我去了图书馆。我看了书。我没吃晚饭。', 'Vd: 昨天我去了图书馆。我看了书。我没吃晚饭。'], ['Ask someone the way to the canteen.', 'Hỏi đường đến nhà ăn.', '请问，食堂在哪儿？', '请问，食堂在哪儿？'], ['Name two exam tasks.', 'Kể hai dạng bài thi.', 'Match pictures; reorder words.', 'Nối tranh; sắp xếp từ.']] }),

  Q(P + 'quiz-11', 'Quiz 11 — Review', 'Quiz 11 — Ôn tập', [
    [['He speaks Chinese well:', 'Anh ấy nói tiếng Trung giỏi:'], ['他说汉语得很好', '他说汉语说得很好', '他很好说汉语', '他说得汉语很好'], 1, ['Repeat the verb.', 'Lặp động từ.']],
    [['Negative of 我吃了:', 'Phủ định của 我吃了:'], ['我没吃', '我不吃了', '我没吃了', '我吃不'], 0, ['没 + verb.', '没 + động từ.']],
    [['Time position:', 'Vị trí thời gian:'], ['before the verb', 'after the object', 'always last', 'none'], 0, ['我八点上课.', '我八点上课.']],
    [['In “我在图书馆看书” the place is:', 'Trong “我在图书馆看书”, nơi chốn đứng:'], ['before the verb', 'after the verb', 'at the end', 'omitted'], 0, ['在 + place + V.', '在 + nơi + V.']],
    [['Comparison:', 'So sánh:'], ['A比B很大', 'A比B大', 'A很比B大', 'A大比B'], 1, ['No 很 after 比.', 'Không 很 sau 比.']],
    [['Choice question:', 'Câu hỏi lựa chọn:'], ['还是', '或者', '和', '也'], 0, ['还是 in questions.', '还是 trong câu hỏi.']],
    [['Best exam prep:', 'Cách ôn thi hiệu quả:'], ['Cram one night', 'Short daily review', 'Only reading pinyin', 'Skip writing'], 1, ['Spaced practice works best.', 'Ôn ngắt quãng hiệu quả nhất.']],
    [['听得懂 means:', '听得懂 nghĩa:'], ['can understand by listening', 'cannot hear', 'listen again', 'listened'], 0, ['V得懂 = can.', 'V得懂 = có thể.']],
  ]),
]));
export default secs;
