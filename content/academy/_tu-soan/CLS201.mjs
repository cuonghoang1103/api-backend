// Khoá TỰ SOẠN cho CLS201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Nối tiếp CLS101 (HSK 1–2): nâng lên HSK 3 — nghe đoạn dài, hội thoại tình huống, thuyết trình ngắn. Không dùng nội suy chuỗi.
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const x = (s) => (Array.isArray(s) ? s[0] + '|||' + s[1] : (String(s).includes('|||') ? s : s + '|||' + s));
const LK = {
  sandhi: ['https://en.wikipedia.org/wiki/Tone_sandhi', 'Wikipedia — Tone sandhi', 'Wikipedia — Biến điệu (tone sandhi)'],
  phon: ['https://en.wikipedia.org/wiki/Standard_Chinese_phonology', 'Wikipedia — Standard Chinese phonology', 'Wikipedia — Ngữ âm tiếng Trung chuẩn'],
  shadow: ['https://en.wikipedia.org/wiki/Shadowing', 'Wikipedia — Shadowing (language technique)', 'Wikipedia — Shadowing (kỹ thuật bắt chước theo)'],
  intonation: ['https://en.wikipedia.org/wiki/Intonation_(linguistics)', 'Wikipedia — Intonation', 'Wikipedia — Ngữ điệu'],
  stress: ['https://en.wikipedia.org/wiki/Stress_(linguistics)', 'Wikipedia — Stress (linguistics)', 'Wikipedia — Trọng âm (ngôn ngữ học)'],
  contr: ['https://en.wikipedia.org/wiki/Contraction_(grammar)', 'Wikipedia — Contraction (grammar)', 'Wikipedia — Rút gọn âm (contraction)'],
  gram: ['https://en.wikipedia.org/wiki/Chinese_grammar', 'Wikipedia — Chinese grammar', 'Wikipedia — Ngữ pháp tiếng Trung'],
  hsk: ['https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi', 'Wikipedia — HSK test', 'Wikipedia — Kỳ thi HSK'],
  hskoff: ['https://www.chinesetest.cn/', 'Chinese Testing International — official HSK site', 'Chinese Testing International — trang HSK chính thức'],
  coursera: ['https://www.coursera.org/learn/learn-chinese', 'Coursera — Chinese for Beginners (Peking University)', 'Coursera — Tiếng Trung cho người mới (ĐH Bắc Kinh)'],
  yoyo: ['https://www.youtube.com/@yoyochinese/videos', 'Yoyo Chinese — YouTube channel', 'Yoyo Chinese — kênh YouTube'],
  pod: ['https://www.chinesepod.com/', 'ChinesePod — graded audio and video lessons', 'ChinesePod — bài nghe và video theo cấp độ'],
  hello: ['https://www.hellochinese.cc/', 'HelloChinese — speaking practice app', 'HelloChinese — ứng dụng luyện nói'],
  wikib: ['https://en.wikibooks.org/wiki/Mandarin_Chinese', 'Wikibooks — Mandarin Chinese', 'Wikibooks — Tiếng Quan Thoại'],
  part: ['https://en.wikipedia.org/wiki/Chinese_particles', 'Wikipedia — Chinese particles', 'Wikipedia — Trợ từ tiếng Trung'],
  listen: ['https://en.wikipedia.org/wiki/Listening', 'Wikipedia — Listening', 'Wikipedia — Nghe (listening)'],
  note: ['https://en.wikipedia.org/wiki/Note-taking', 'Wikipedia — Note-taking', 'Wikipedia — Ghi chép (note-taking)'],
  disc: ['https://en.wikipedia.org/wiki/Discourse_marker', 'Wikipedia — Discourse marker', 'Wikipedia — Từ nối diễn ngôn (discourse marker)'],
  conj: ['https://en.wikipedia.org/wiki/Conjunction_(grammar)', 'Wikipedia — Conjunction (grammar)', 'Wikipedia — Liên từ (conjunction)'],
  cmp: ['https://en.wikipedia.org/wiki/Comparison_(grammar)', 'Wikipedia — Comparison (grammar)', 'Wikipedia — So sánh (ngữ pháp)'],
  clf: ['https://en.wikipedia.org/wiki/Chinese_classifier', 'Wikipedia — Chinese classifiers (measure words)', 'Wikipedia — Lượng từ tiếng Trung'],
  tcm: ['https://en.wikipedia.org/wiki/Traditional_Chinese_medicine', 'Wikipedia — Traditional Chinese medicine', 'Wikipedia — Y học cổ truyền Trung Hoa'],
  health: ['https://en.wikipedia.org/wiki/Healthcare_in_China', 'Wikipedia — Healthcare in China', 'Wikipedia — Hệ thống y tế ở Trung Quốc'],
  gaotie: ['https://en.wikipedia.org/wiki/China_Railway_High-speed', 'Wikipedia — China Railway High-speed (G trains)', 'Wikipedia — Đường sắt cao tốc Trung Quốc (tàu G)'],
  rail: ['https://en.wikipedia.org/wiki/Rail_transport_in_China', 'Wikipedia — Rail transport in China', 'Wikipedia — Đường sắt ở Trung Quốc'],
  hotel: ['https://en.wikipedia.org/wiki/Hotel', 'Wikipedia — Hotel', 'Wikipedia — Khách sạn'],
  clim: ['https://en.wikipedia.org/wiki/Climate_of_China', 'Wikipedia — Climate of China', 'Wikipedia — Khí hậu Trung Quốc'],
  tt: ['https://en.wikipedia.org/wiki/Table_tennis', 'Wikipedia — Table tennis', 'Wikipedia — Bóng bàn'],
  taichi: ['https://en.wikipedia.org/wiki/Tai_chi', 'Wikipedia — Tai chi', 'Wikipedia — Thái cực quyền'],
  cny: ['https://en.wikipedia.org/wiki/Chinese_New_Year', 'Wikipedia — Chinese New Year (Spring Festival)', 'Wikipedia — Tết Nguyên đán Trung Hoa (Xuân Tiết)'],
  mid: ['https://en.wikipedia.org/wiki/Mid-Autumn_Festival', 'Wikipedia — Mid-Autumn Festival', 'Wikipedia — Tết Trung Thu'],
  dragon: ['https://en.wikipedia.org/wiki/Dragon_Boat_Festival', 'Wikipedia — Dragon Boat Festival', 'Wikipedia — Tết Đoan Ngọ (Lễ hội thuyền rồng)'],
  interview: ['https://en.wikipedia.org/wiki/Job_interview', 'Wikipedia — Job interview', 'Wikipedia — Phỏng vấn xin việc'],
  intern: ['https://en.wikipedia.org/wiki/Internship', 'Wikipedia — Internship', 'Wikipedia — Thực tập'],
  speak: ['https://en.wikipedia.org/wiki/Public_speaking', 'Wikipedia — Public speaking', 'Wikipedia — Nói trước công chúng'],
  role: ['https://en.wikipedia.org/wiki/Role-playing', 'Wikipedia — Role-playing', 'Wikipedia — Nhập vai (role-playing)'],
  debate: ['https://en.wikipedia.org/wiki/Debate', 'Wikipedia — Debate', 'Wikipedia — Tranh luận (debate)'],
  ba: ['https://en.wikipedia.org/wiki/Ba_construction', 'Wikipedia — Ba construction (把)', 'Wikipedia — Cấu trúc 把 (ba)'],
  social: ['https://en.wikipedia.org/wiki/Social_media_in_China', 'Wikipedia — Social media in China', 'Wikipedia — Mạng xã hội ở Trung Quốc'],
  gaokao: ['https://en.wikipedia.org/wiki/Gaokao', 'Wikipedia — Gaokao', 'Wikipedia — Kỳ thi Cao khảo (Gaokao)'],
  mand: ['https://en.wikipedia.org/wiki/Mandarin_Chinese', 'Wikipedia — Mandarin Chinese', 'Wikipedia — Tiếng Quan Thoại'],
  tennis: ['https://en.wikipedia.org/wiki/Table_tennis', 'Wikipedia — Table tennis', 'Wikipedia — Bóng bàn'],
};
const zh = (s) => s.replace(/「([^」]*)」/g, '<span lang="zh">$1</span>');
const lk = (ks, i) => '<ul>' + ks.map((k) => '<li><a href="' + LK[k][0] + '" target="_blank" rel="noopener">' + LK[k][i] + '</a></li>').join('') + '</ul>';
const tbl = (head, rows) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
// o: {n, g:[[en,vi]], b:[en,vi], t:[[head-en,head-vi],rows] (optional extra table), v:[[han,py,en,vi]], d:[[spk,han,py,en,vi]], dn:[en,vi] (audio-script note), pit, s, l, p:[[qen,qvi,aen,avi]]}
const build = (o, L) => {
  const I = L === 'en' ? 0 : 1;
  const T = L === 'en'
    ? { goals: 'Lesson goals', lec: 'Lesson', vocab: 'Key words', dlg: 'Model dialogue', pit: 'Common listening and pronunciation mistakes', sum: '📌 Summary', more: '🔗 Learn more (listen!)', prac: '🧪 Practice', ans: 'Answer', vh: ['Hanzi', 'Pinyin', 'Meaning'], dh: ['Who', 'Hanzi', 'Pinyin', 'Meaning'], pat: 'Key sentence patterns' }
    : { goals: 'Mục tiêu bài', lec: 'Bài giảng', vocab: 'Từ then chốt', dlg: 'Hội thoại mẫu', pit: 'Lỗi nghe và phát âm hay gặp', sum: '📌 Tóm tắt', more: '🔗 Học thêm (hãy nghe!)', prac: '🧪 Tự luyện', ans: 'Đáp án', vh: ['Hán tự', 'Pinyin', 'Nghĩa'], dh: ['Ai', 'Hán tự', 'Pinyin', 'Nghĩa'], pat: 'Mẫu câu then chốt' };
  let h = '<span class="eyebrow">CLS201 · ' + (L === 'en' ? 'Lesson ' : 'Bài ') + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + o.b[I] + '\n';
  if (o.t) h += tbl(o.t[0].map((c) => (Array.isArray(c) ? c[I] : c)), o.t[1].map((r) => r.map((c) => (Array.isArray(c) ? c[I] : c)))) + '\n';
  if (o.pt) h += '<h3>' + T.pat + '</h3>' + tbl(T.vh, o.pt.map((r) => [r[0], r[1], r[2 + I]])) + '\n';
  if (o.v) h += '<h3>' + T.vocab + '</h3>' + tbl(T.vh, o.v.map((r) => [r[0], r[1], r[2 + I]])) + '\n';
  if (o.d) h += '<h3>' + T.dlg + '</h3>' + (o.dn ? '<p class="ghi-chu">' + o.dn[I] + '</p>' : '') + tbl(T.dh, o.d.map((r) => [r[0], r[1], r[2], r[3 + I]])) + '\n';
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong> ' + o.pit[I] + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
const D = (slug, en, vi, desc, o) => ({ title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: zh(bi(build(o, 'en'), build(o, 'vi'))) });
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => ({ id: 'q' + (i + 1), question: x(q[0]), options: q[1].map(x), correctIndex: q[2], points: 1, explanation: x(q[3]) })) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'cls201-ts-';
const secs = [];
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu CLS201, chuẩn đầu ra tự soạn, giáo trình nghe–nói HSK 3 và tài liệu nghe ngoài.', [
  D(P + '0-1', '0.1 About CLS201 — Chinese Listening & Speaking Skills 2', '0.1 Giới thiệu môn CLS201 — Kỹ năng Nghe–Nói tiếng Trung 2',
    'CLS201 là môn gì, nối tiếp CLS101 ra sao, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [[`Understand how CLS201 continues CLS101 and moves from HSK 1–2 to HSK 3`, `Hiểu CLS201 nối tiếp CLS101 và nâng từ HSK 1–2 lên HSK 3`],
        [`Know the 8 self-authored learning outcomes`, `Nắm 8 chuẩn đầu ra tự soạn`],
        [`See the map of 10 chapters and a weekly routine`, `Nắm bản đồ 10 chương và nhịp học mỗi tuần`]],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> The university has not published a CLS201 syllabus on FLM (checked 09/11/2026). This outline is self-authored from standard pre-intermediate listening-and-speaking materials (HSK Standard Course 3, Short-term Spoken Chinese: Elementary). Grading scheme, exam dates and the textbook your class really uses depend on your instructor. Always follow your instructor first.</div>
<p>CLS101 trained the ear and mouth on single sounds, tones, numbers and survival dialogues (HSK 1–2, about 300 words). CLS201 assumes you can already do all that and asks for more: <strong>longer passages</strong>, <strong>natural speed</strong>, <strong>connected speech</strong>, and <strong>speaking in paragraphs</strong> instead of single sentences. The target is HSK 3 (about 600 words), with the daily-life, study, health, travel and work topics that appear in listening tests and in real conversations with Chinese friends or teachers.</p>
<p>Why does it matter? In a Chinese-major programme, listening and speaking are the skills that decide whether an exchange semester, a company internship or a Chinese-speaking client meeting goes well. Reading can be slow; a conversation cannot wait. This course therefore gives you strategies (what to do when you miss a word), pronunciation drills in context, and many role-plays.</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Follow a 1–2 minute talk at normal speed and report gist and key details.</li><li>Recognise connected-speech reductions and stress patterns without relying on text.</li><li>Use signpost words (because, although, first… then…) to predict what comes next.</li><li>Narrate past experiences and plans in 6–10 connected sentences.</li><li>Handle role-plays: doctor, hotel, train station, interview, invitation.</li><li>Give and respond to opinions, comparisons, advice and polite refusals.</li><li>Deliver a prepared 3-minute presentation with a clear structure.</li><li>Answer the four listening parts of an HSK 3 style test with the right strategy.</li></ol>
<h4>Related courses</h4>
<p>Prerequisite in practice: <strong>CLS101</strong>. Parallel integrated-Chinese courses of the same level (grammar and reading) support the vocabulary used here. The exact FPTU prerequisite chain may differ — check your curriculum on FLM.</p>
<h4>Weekly routine</h4>
<p>Class: new topic, listen, role-play. Home: three 10-minute sessions — (1) listen without text, (2) listen with pinyin and mark what you missed, (3) shadow and record yourself. Review all marked words once at the end of the week.</p>`,
       `<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của CLS201 trên FLM (dò 09/11/2026). Khung này tự soạn theo giáo trình nghe–nói chuẩn trình độ tiền trung cấp (HSK Standard Course 3, Short-term Spoken Chinese: Elementary). Cách tính điểm, lịch thi và giáo trình lớp bạn thực sự dùng theo giảng viên. Luôn ưu tiên làm theo giảng viên.</div>
<p>CLS101 luyện tai và miệng trên âm đơn, thanh điệu, số đếm và hội thoại sinh tồn (HSK 1–2, khoảng 300 từ). CLS201 giả định bạn đã làm được những điều đó và đòi hỏi nhiều hơn: <strong>đoạn nghe dài hơn</strong>, <strong>tốc độ tự nhiên</strong>, <strong>lối nói liền mạch</strong>, và <strong>nói thành đoạn</strong> thay vì từng câu. Mục tiêu là HSK 3 (khoảng 600 từ), với các chủ đề đời sống, học tập, sức khoẻ, du lịch và công việc thường gặp trong bài thi nghe và khi trò chuyện với bạn bè, thầy cô người Trung.</p>
<p>Vì sao quan trọng? Với sinh viên ngành Ngôn ngữ Trung, nghe–nói quyết định kỳ trao đổi, kỳ thực tập hay buổi họp với khách Trung Quốc có suôn sẻ không. Đọc có thể chậm; hội thoại thì không chờ ai. Vì vậy môn này cho bạn chiến lược (làm gì khi lỡ một từ), bài luyện phát âm trong ngữ cảnh và nhiều bài nhập vai.</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Theo dõi bài nói 1–2 phút ở tốc độ bình thường và thuật lại ý chính, chi tiết quan trọng.</li><li>Nhận ra các hiện tượng rút gọn âm và kiểu nhấn trọng âm mà không cần nhìn chữ.</li><li>Dùng từ nối (vì, tuy, trước… rồi…) để đoán điều sắp nghe.</li><li>Kể trải nghiệm quá khứ và kế hoạch bằng 6–10 câu liền mạch.</li><li>Xử lý nhập vai: bác sĩ, khách sạn, ga tàu, phỏng vấn, lời mời.</li><li>Nêu và đáp lại ý kiến, so sánh, lời khuyên, cách từ chối lịch sự.</li><li>Thuyết trình 3 phút đã chuẩn bị với cấu trúc rõ ràng.</li><li>Làm bốn phần nghe của đề kiểu HSK 3 với chiến lược đúng.</li></ol>
<h4>Môn liên quan</h4>
<p>Tiên quyết trên thực tế: <strong>CLS101</strong>. Các môn Hán ngữ tổng hợp song song cùng trình độ (ngữ pháp, đọc) bổ trợ từ vựng dùng ở đây. Chuỗi tiên quyết chính thức của FPTU có thể khác — hãy xem khung chương trình trên FLM.</p>
<h4>Nhịp học mỗi tuần</h4>
<p>Trên lớp: chủ đề mới, nghe, nhập vai. Ở nhà: ba phiên 10 phút — (1) nghe không nhìn chữ, (2) nghe kèm pinyin và đánh dấu chỗ lỡ, (3) shadowing và tự ghi âm. Cuối tuần ôn các từ đã đánh dấu một lượt.</p>`],
    s: [[`CLS201 = CLS101 + longer passages, natural speed and paragraph-level speaking.`, `CLS201 = CLS101 + đoạn dài hơn, tốc độ tự nhiên, nói thành đoạn.`],
        [`The outline is self-authored; your instructor decides grading and exams.`, `Khung là tự soạn; điểm và thi do giảng viên quyết định.`],
        [`Weekly: listen blind, listen with text, shadow and record.`, `Mỗi tuần: nghe không chữ, nghe có chữ, shadowing và ghi âm.`]],
    l: ['hsk', 'hskoff', 'coursera'],
    p: [[`Name two differences between CLS101 and CLS201.`, `Nêu hai điểm khác giữa CLS101 và CLS201.`, `CLS201 uses longer passages and natural speed; it asks for connected paragraphs instead of single sentences; target level HSK 3.`, `CLS201 dùng đoạn dài hơn và tốc độ tự nhiên; yêu cầu nói thành đoạn thay vì câu lẻ; mục tiêu HSK 3.`],
        [`What should you do first if your instructor's rules differ from this outline?`, `Bạn nên làm gì nếu quy định của giảng viên khác khung này?`, `Follow the instructor — this outline is self-authored.`, `Làm theo giảng viên — khung này là tự soạn.`]]
  }),
  D(P + '0-2', '0.2 Textbooks & listening resources', '0.2 Giáo trình & tài liệu nghe',
    'Giáo trình nghe–nói HSK 3, khoá học mở và nguồn nghe ngoài; ghi rõ chỗ chưa kiểm được ISBN.', {
    n: '0.2',
    g: [[`Choose a main textbook and a listening source for HSK 3`, `Chọn giáo trình chính và nguồn nghe cho HSK 3`], [`Know free tools to practise at home`, `Biết công cụ miễn phí để luyện ở nhà`]],
    b: [`<h4>Books</h4>
<ul><li><strong>HSK Standard Course 3</strong> (<span lang="zh">HSK标准教程3</span>), Jiang Liping (chief ed.), Beijing Language and Culture University Press (BLCU Press). The direct continuation of the HSK Standard Course 1–2 series used in CLS101; each lesson has listening texts and speaking drills. I could not confirm its ISBN online during writing, so none is printed here — read it from the back cover of your copy.</li>
<li><strong>HSK Standard Course 2</strong>, Jiang Liping, BLCU Press. ISBN 978-7-5619-3726-6 (checked by the CLS101 author in the Google Books catalogue). Use it to review CLS101 material.</li>
<li><strong>Short-term Spoken Chinese: Elementary</strong> (<span lang="zh">汉语口语速成 基础篇</span>), Ma Jianfei (chief ed.), BLCU Press. A situational speaking course; several editions exist, so check the ISBN printed on your copy (not stated here to avoid mixing editions).</li></ul>
<h4>Free resources</h4>
<ul><li>Coursera — Chinese for Beginners (Peking University): graded video lessons.</li><li>Yoyo Chinese and ChinesePod: listening and pronunciation videos by level.</li><li>HelloChinese: short speaking drills on the phone.</li><li>Official HSK site: exam information and sample materials (check HSK 3.0 changes).</li></ul>`,
       `<h4>Sách</h4>
<ul><li><strong>HSK Standard Course 3</strong> (<span lang="zh">HSK标准教程3</span>), chủ biên Khương Lệ Bình (Jiang Liping), NXB Đại học Ngôn ngữ và Văn hoá Bắc Kinh (BLCU Press). Là phần nối tiếp trực tiếp bộ HSK Standard Course 1–2 dùng ở CLS101; mỗi bài có bài nghe và bài luyện nói. Khi soạn, tôi không xác nhận được ISBN của cuốn này trên mạng nên không ghi ở đây — hãy xem ISBN ở bìa sau cuốn của bạn.</li>
<li><strong>HSK Standard Course 2</strong>, Khương Lệ Bình, BLCU Press. ISBN 978-7-5619-3726-6 (tác giả CLS101 đã đối chiếu trong danh mục Google Books). Dùng để ôn lại nội dung CLS101.</li>
<li><strong>Short-term Spoken Chinese: Elementary</strong> (<span lang="zh">汉语口语速成 基础篇</span>), chủ biên Mã Tiễn Phi (Ma Jianfei), BLCU Press. Giáo trình khẩu ngữ theo tình huống; có nhiều lần xuất bản nên hãy xem ISBN in trên cuốn của bạn (không ghi ở đây để khỏi lẫn lần xuất bản).</li></ul>
<h4>Tài nguyên miễn phí</h4>
<ul><li>Coursera — Chinese for Beginners (ĐH Bắc Kinh): bài giảng video theo cấp.</li><li>Yoyo Chinese và ChinesePod: video nghe và phát âm theo trình độ.</li><li>HelloChinese: bài luyện nói ngắn trên điện thoại.</li><li>Trang HSK chính thức: thông tin kỳ thi và tài liệu mẫu (nhớ kiểm các thay đổi của HSK 3.0).</li></ul>`],
    s: [[`Main book: HSK Standard Course 3 (BLCU Press); support: Short-term Spoken Chinese: Elementary.`, `Sách chính: HSK Standard Course 3 (BLCU Press); bổ trợ: Short-term Spoken Chinese: Elementary.`],
        [`Always read the ISBN from your own copy.`, `Luôn xem ISBN trên chính cuốn của bạn.`],
        [`Use free audio daily, even 10 minutes.`, `Nghe tài nguyên miễn phí mỗi ngày, dù chỉ 10 phút.`]],
    l: ['coursera', 'yoyo', 'pod', 'hello'],
    p: [[`Why does this lesson not print an ISBN for HSK Standard Course 3?`, `Vì sao bài này không ghi ISBN cho HSK Standard Course 3?`, `It could not be confirmed online while writing; use the one on your copy.`, `Không xác nhận được trên mạng lúc soạn; hãy dùng ISBN trên cuốn của bạn.`],
        [`Which free resource gives short speaking drills on a phone?`, `Tài nguyên miễn phí nào cho bài luyện nói ngắn trên điện thoại?`, `HelloChinese.`, `HelloChinese.`]]
  }),
]));

// ===== Chương 1 =====
secs.push(SEC('Chapter 1 — Connected speech at HSK 3 speed', 'Chương 1 — Lối nói liền mạch ở tốc độ HSK 3',
  'Trọng âm câu, rút gọn âm khi nói nhanh, chia nhóm ngắt nghỉ và shadowing.', [
  D(P + '1-1', '1.1 Sentence stress and focus', '1.1 Trọng âm câu và điểm nhấn',
    'Chữ nào được nhấn trong câu, vì sao nhấn đổi nghĩa; nghe câu hỏi và câu trả lời có nhấn.', {
    n: '1.1',
    g: [[`Hear which word carries the focus`, `Nghe ra từ mang điểm nhấn`], [`Use stress to answer a question precisely`, `Dùng trọng âm để đáp chính xác câu hỏi`]],
    b: [`<p>Chinese words have tones, but a <em>sentence</em> still has stress. The stressed word is slightly longer, louder and its tone is fuller (pitch range wider); the words after it are often compressed. CLS101 trained the tone of each syllable; now listen to <strong>which word the speaker wants you to notice</strong>.</p>
<p>The same sentence changes meaning with the stress. 「我明天去北京。wǒ míngtiān qù Běijīng.」 Stress <em>我</em>: it is me, not someone else. Stress <em>明天</em>: tomorrow, not today. Stress <em>北京</em>: Beijing, not Shanghai. A question tells you where the stress will be in the answer: 「你什么时候去北京？」→ 「我<strong>明天</strong>去。」 The new information is stressed; the known information is light.</p>
<p>Contrastive stress is marked with 「是…的 shì…de」 and 「不是…是… bú shì…shì…」: 「我<strong>不是</strong>昨天来的，是<strong>前天</strong>来的。」 (I did not come yesterday, I came the day before.) Words such as 「才 cái」, 「就 jiù」, 「都 dōu」, 「只 zhǐ」 pull the stress to the word that comes before or after them.</p>
<p><strong>Listening tip.</strong> Before you hear the answer, listen to the question and ask: what is being asked? Then you only need to catch that one slot (time, place, person, quantity).</p>`,
       `<p>Từ tiếng Trung có thanh điệu, nhưng <em>câu</em> vẫn có trọng âm. Từ được nhấn thường dài hơn, to hơn một chút và thanh điệu đầy đặn hơn (biên độ cao độ rộng hơn); các từ sau nó thường bị nén lại. CLS101 luyện thanh điệu từng âm tiết; giờ hãy nghe <strong>người nói muốn bạn chú ý từ nào</strong>.</p>
<p>Cùng một câu, nhấn khác thì nghĩa khác. 「我明天去北京。wǒ míngtiān qù Běijīng.」 Nhấn <em>我</em>: là tôi chứ không phải người khác. Nhấn <em>明天</em>: ngày mai chứ không phải hôm nay. Nhấn <em>北京</em>: Bắc Kinh chứ không phải Thượng Hải. Câu hỏi cho bạn biết câu đáp sẽ nhấn ở đâu: 「你什么时候去北京？」→ 「我<strong>明天</strong>去。」 Thông tin mới được nhấn; thông tin đã biết thì nhẹ.</p>
<p>Nhấn đối chiếu được đánh dấu bằng 「是…的 shì…de」 và 「不是…是… bú shì…shì…」: 「我<strong>不是</strong>昨天来的，是<strong>前天</strong>来的。」 (Tôi không đến hôm qua mà đến hôm kia.) Các từ như 「才 cái」, 「就 jiù」, 「都 dōu」, 「只 zhǐ」 kéo trọng âm về từ đứng trước hoặc sau chúng.</p>
<p><strong>Mẹo nghe.</strong> Trước khi nghe câu đáp, hãy nghe câu hỏi và tự hỏi: đang hỏi điều gì? Khi đó bạn chỉ cần bắt đúng một ô thông tin (thời gian, nơi chốn, người, số lượng).</p>`],
    pt: [[`是…的`, `shì…de`, `focus on time/place/manner of a past event: 我是昨天来的`, `nhấn thời gian/nơi chốn/cách thức của sự việc đã xảy ra: 我是昨天来的`], [`不是…是…`, `bú shì…shì…`, `not X but Y`, `không phải X mà là Y`], [`才 / 就`, `cái / jiù`, `late-or-few / early-or-soon`, `muộn-ít / sớm-nhanh`]],
    d: [[`A`, `你什么时候到北京？`, `Nǐ shénme shíhou dào Běijīng?`, `When do you arrive in Beijing?`, `Bạn khi nào đến Bắc Kinh?`], [`B`, `我后天到。`, `Wǒ hòutiān dào.`, `The day after tomorrow.`, `Ngày kia.`], [`A`, `是坐飞机去的吗？`, `Shì zuò fēijī qù de ma?`, `Are you going by plane?`, `Bạn đi bằng máy bay à?`], [`B`, `不是坐飞机，是坐高铁。`, `Bú shì zuò fēijī, shì zuò gāotiě.`, `Not by plane, by high-speed train.`, `Không phải máy bay, mà là tàu cao tốc.`]],
    dn: [`Listen once and say which word was stressed in each answer.`, `Nghe một lần và nói từ nào được nhấn trong mỗi câu đáp.`],
    pit: [`Learners give every syllable equal force and lose the focus. Another trap: hearing a tone-3 word quietly after the stressed word and missing it.`, `Người học đọc mọi âm tiết đều lực nên mất điểm nhấn. Một bẫy khác: từ thanh 3 đứng sau từ nhấn bị nói nhỏ nên nghe sót.`],
    s: [[`Stress marks new or contrasted information.`, `Trọng âm đánh dấu thông tin mới hoặc đối chiếu.`], [`The question predicts the stressed slot of the answer.`, `Câu hỏi cho biết ô được nhấn trong câu đáp.`], [`是…的, 不是…是…, 才, 就 attract focus.`, `是…的, 不是…是…, 才, 就 kéo điểm nhấn.`]],
    l: ['stress', 'intonation', 'phon'],
    p: [[`Where is the stress in the answer to 你去哪儿？ — 我去图书馆。`, `Trọng âm ở đâu trong câu đáp của 你去哪儿？ — 我去图书馆。`, `On 图书馆 (the place asked about).`, `Ở 图书馆 (nơi được hỏi).`],
        [`Say aloud: 我不是昨天来的，是前天来的 — which two words are contrasted?`, `Đọc to: 我不是昨天来的，是前天来的 — hai từ nào được đối chiếu?`, `昨天 and 前天.`, `昨天 và 前天.`]]
  }),
  D(P + '1-2', '1.2 Fast-speech reductions', '1.2 Rút gọn âm khi nói nhanh',
    'Những cụm hay bị nuốt âm trong lời nói tự nhiên: 不知道, 什么, 这样, 一下, 的话…', {
    n: '1.2',
    g: [[`Recognise common reduced forms`, `Nhận ra các dạng rút gọn thường gặp`], [`Say them naturally without sounding careless`, `Nói tự nhiên mà không cẩu thả`]],
    b: [`<p>Textbook recordings are slow and clear. Real speech is faster: unstressed syllables lose their tone (neutral tone), consonants soften and some syllables nearly disappear. You will not write these forms, but you must <strong>hear</strong> them.</p>
<p>Frequent patterns: 「不知道 bù zhīdào」 sounds like <em>bùzhīdao</em> with 道 very short. 「什么 shénme」 is often <em>shém</em> or <em>shéme</em>. 「这样 zhèyàng」 becomes <em>zhèiyàng</em>; 「那样」 becomes <em>nèiyàng</em>. 「一下 yíxià」 is a light <em>yíxia</em>. 「我们 wǒmen」 may sound like <em>wǒm</em>. 「怎么样 zěnmeyàng」 shrinks to <em>zěnmeyàng</em> with weak 么. 「好不好 hǎo bu hǎo」: the middle syllable is neutral. In the north, 「不 bù」 between two identical words is read neutral: 「是不是 shì bu shì」.</p>
<p>Words that often fall off: 「的 de」, 「了 le」, 「吧 ba」 are very light, but you must still catch their meaning: 「吃了 chī le」 completed; 「吃吧 chī ba」 suggestion. Particles are short but carry the speaker's attitude.</p>
<p><strong>Strategy.</strong> Do not wait for each syllable. Listen for the skeleton: the stressed content words (verbs, nouns, numbers) and fill in the light words from context. When you speak, imitate the rhythm: strong content words, light grammar words.</p>`,
       `<p>Bản ghi âm giáo trình chậm và rõ. Lời nói thật nhanh hơn: âm tiết không nhấn mất thanh điệu (thành thanh nhẹ), phụ âm mềm đi và có âm tiết gần như biến mất. Bạn sẽ không viết những dạng này nhưng phải <strong>nghe</strong> được.</p>
<p>Mẫu thường gặp: 「不知道 bù zhīdào」 nghe như <em>bùzhīdao</em> với 道 rất ngắn. 「什么 shénme」 hay thành <em>shém</em> hoặc <em>shéme</em>. 「这样 zhèyàng」 thành <em>zhèiyàng</em>; 「那样」 thành <em>nèiyàng</em>. 「一下 yíxià」 là <em>yíxia</em> nhẹ. 「我们 wǒmen」 có thể nghe như <em>wǒm</em>. 「怎么样 zěnmeyàng」 co lại với 么 yếu. 「好不好 hǎo bu hǎo」: âm giữa là thanh nhẹ. Ở miền Bắc, 「不 bù」 nằm giữa hai từ giống nhau đọc thanh nhẹ: 「是不是 shì bu shì」.</p>
<p>Những từ hay rơi rụng: 「的 de」, 「了 le」, 「吧 ba」 rất nhẹ nhưng bạn vẫn phải bắt được nghĩa: 「吃了 chī le」 đã xong; 「吃吧 chī ba」 gợi ý. Trợ từ ngắn nhưng mang thái độ của người nói.</p>
<p><strong>Chiến lược.</strong> Đừng chờ từng âm tiết. Nghe bộ khung: các từ thực được nhấn (động từ, danh từ, số) và điền từ nhẹ theo ngữ cảnh. Khi nói, bắt chước nhịp: từ thực mạnh, từ ngữ pháp nhẹ.</p>`],
    v: [[`不知道`, `bù zhīdao`, `don't know`, `không biết`], [`什么`, `shénme`, `what`, `cái gì`], [`这样`, `zhèyàng`, `like this`, `như thế này`], [`一下`, `yíxià`, `a bit / once`, `một chút / một lần`], [`怎么样`, `zěnmeyàng`, `how about`, `thế nào`], [`是不是`, `shì bu shì`, `is it or not`, `phải không`]],
    d: [[`A`, `你知道他住哪儿吗？`, `Nǐ zhīdào tā zhù nǎr ma?`, `Do you know where he lives?`, `Bạn biết anh ấy ở đâu không?`], [`B`, `不知道，你问一下小王吧。`, `Bù zhīdao, nǐ wèn yíxia Xiǎo Wáng ba.`, `No idea, ask Xiao Wang.`, `Không biết, bạn hỏi Tiểu Vương đi.`], [`A`, `这样啊，好的。`, `Zhèyàng a, hǎo de.`, `I see. OK.`, `Vậy à, được rồi.`]],
    pit: [`Hearing 不知道 as 不 + 知 + 道 with full tones makes the speed seem impossible. Train the reduced form, not just the textbook form.`, `Nếu chỉ chờ nghe 不 + 知 + 道 đủ thanh thì tốc độ sẽ có vẻ quá nhanh. Hãy luyện cả dạng rút gọn chứ không chỉ dạng sách giáo khoa.`],
    s: [[`Real speech weakens grammar words and shortens common phrases.`, `Lời nói thật làm yếu từ ngữ pháp và rút ngắn cụm quen dùng.`], [`Listen for the skeleton of content words.`, `Nghe bộ khung các từ thực.`], [`Imitate the rhythm: strong content, light grammar.`, `Bắt chước nhịp: từ thực mạnh, từ ngữ pháp nhẹ.`]],
    l: ['contr', 'sandhi', 'yoyo'],
    p: [[`Which syllable of 不知道 is shortest in fast speech?`, `Âm tiết nào của 不知道 ngắn nhất khi nói nhanh?`, `道.`, `道.`], [`How is 是不是 read in natural northern speech?`, `是不是 đọc thế nào trong khẩu ngữ miền Bắc?`, `shì bu shì (middle 不 neutral).`, `shì bu shì (不 ở giữa thanh nhẹ).`]]
  }),
  D(P + '1-3', '1.3 Pause groups: parsing long sentences', '1.3 Nhóm ngắt nghỉ: tách câu dài',
    'Cách người Trung chia câu thành nhóm nhịp và cách bạn dùng nhóm đó để hiểu và đọc to.', {
    n: '1.3',
    g: [[`Split a long sentence into 2–4 pause groups`, `Tách câu dài thành 2–4 nhóm ngắt nghỉ`], [`Read aloud with natural breaks`, `Đọc to với chỗ ngắt tự nhiên`]],
    b: [`<p>HSK 3 sentences are longer than HSK 1–2: time phrase + subject + place + verb phrase + result. Speakers do not read them syllable by syllable; they cut them into <strong>pause groups</strong> (about 2–6 syllables each), with a tiny break or a pitch reset between groups.</p>
<p>Typical cut points: after a time word or topic (「昨天下午 / 我在图书馆 / 遇到了一个老同学」); before a new clause marker (「虽然很累 / 但是很开心」); after a subject that is long (「我昨天认识的那个朋友 / 是中国人」); before 「的」-modified nouns are NOT cut. Do not split inside a word, a measure phrase (「一个老同学」) or a verb + complement (「看完了」).</p>
<p>When you listen, mentally put brackets: [time] [who/where] [what happened]. When you lose one group, keep going; the next group usually restarts a clear idea. When you speak, the same method helps you: plan three short groups and breathe between them, instead of one endless sentence.</p>`,
       `<p>Câu HSK 3 dài hơn HSK 1–2: cụm thời gian + chủ ngữ + nơi chốn + cụm động từ + kết quả. Người nói không đọc từng âm tiết mà cắt thành <strong>nhóm ngắt nghỉ</strong> (khoảng 2–6 âm tiết), có quãng nghỉ rất ngắn hoặc cao độ đặt lại giữa các nhóm.</p>
<p>Chỗ cắt thường gặp: sau từ chỉ thời gian hoặc chủ đề (「昨天下午 / 我在图书馆 / 遇到了一个老同学」); trước từ mở mệnh đề mới (「虽然很累 / 但是很开心」); sau chủ ngữ dài (「我昨天认识的那个朋友 / 是中国人」); KHÔNG cắt trước danh từ có 「的」 bổ nghĩa. Không cắt giữa một từ, giữa cụm lượng từ (「一个老同学」) hay giữa động từ + bổ ngữ (「看完了」).</p>
<p>Khi nghe, hãy đặt ngoặc trong đầu: [thời gian] [ai/ở đâu] [chuyện gì]. Nếu lỡ một nhóm, cứ đi tiếp; nhóm sau thường mở lại một ý rõ ràng. Khi nói, cùng phương pháp đó giúp bạn: lên kế hoạch ba nhóm ngắn và lấy hơi giữa chúng, thay vì một câu dài vô tận.</p>`],
    d: [[`A`, `我昨天下午 / 在图书馆 / 遇到了一个老同学。`, `Wǒ zuótiān xiàwǔ / zài túshūguǎn / yùdào le yí ge lǎo tóngxué.`, `Yesterday afternoon, in the library, I ran into an old classmate.`, `Chiều qua, ở thư viện, tôi gặp một người bạn học cũ.`], [`B`, `他现在 / 在哪儿工作？`, `Tā xiànzài / zài nǎr gōngzuò?`, `Where does he work now?`, `Bây giờ anh ấy làm việc ở đâu?`], [`A`, `虽然工作很忙 / 但是他很喜欢。`, `Suīrán gōngzuò hěn máng / dànshì tā hěn xǐhuan.`, `Although work is busy, he likes it.`, `Tuy công việc bận nhưng anh ấy rất thích.`]],
    dn: [`The slash marks the usual pause groups.`, `Dấu gạch chéo là chỗ ngắt nhóm thường gặp.`],
    pit: [`Pausing inside a verb–complement (看 / 完了) or reading each character with the same pause makes your speech sound robotic and hard to follow.`, `Ngắt giữa động từ–bổ ngữ (看 / 完了) hoặc dừng đều sau mỗi chữ khiến lời nói như robot và khó theo dõi.`],
    s: [[`Long sentences are heard as 2–4 pause groups.`, `Câu dài được nghe thành 2–4 nhóm ngắt nghỉ.`], [`Cut after time/topic and before contrast words; never inside words.`, `Cắt sau thời gian/chủ đề và trước từ đối lập; không cắt trong từ.`], [`Plan your own speech in short groups.`, `Lên kế hoạch lời nói theo nhóm ngắn.`]],
    l: ['intonation', 'gram', 'yoyo'],
    p: [[`Mark pause groups: 我明天早上八点在学校门口等你。`, `Đánh dấu nhóm ngắt: 我明天早上八点在学校门口等你。`, `我 / 明天早上八点 / 在学校门口 / 等你。`, `我 / 明天早上八点 / 在学校门口 / 等你。`], [`Why is a break inside 看完了 wrong?`, `Vì sao ngắt giữa 看完了 là sai?`, `Verb and its complement form one unit.`, `Động từ và bổ ngữ là một khối.`]]
  }),
  D(P + '1-4', '1.4 Shadowing at HSK 3 speed', '1.4 Shadowing ở tốc độ HSK 3',
    'Quy trình shadowing 5 bước, cách tự ghi âm và chấm, kèm hội thoại mẫu để bắt chước.', {
    n: '1.4',
    g: [[`Run the 5-step shadowing routine`, `Chạy quy trình shadowing 5 bước`], [`Record and self-check your tones and rhythm`, `Tự ghi âm và kiểm tra thanh điệu, nhịp`]],
    b: [`<p><strong>Shadowing</strong> means repeating what you hear almost at the same time, 1–2 syllables behind, imitating rhythm, stress and tone. CLS101 introduced the idea with short sentences. At HSK 3 you do it with 20–40 second dialogues.</p>
<ol><li><strong>Listen blind</strong> once: what is the topic? Three keywords?</li><li><strong>Listen with script</strong> (pinyin if needed); underline words you missed.</li><li><strong>Read aloud</strong> slowly; fix the tones of the underlined words.</li><li><strong>Shadow</strong> with the audio, script in hand, three times.</li><li><strong>Shadow without script</strong> and record yourself; compare with the original.</li></ol>
<p>Self-check list: Did my tone-3 words fall and rise correctly? Did I reduce the light words? Did I stress the same word as the speaker? Was my speed close (not slower than 80%)? Do not aim for perfection; aim for one visible improvement per recording.</p>
<p>Choose material at your level (95% known words), 20–40 seconds long, spoken at natural speed. A textbook dialogue, a ChinesePod beginner clip, or a short video with subtitles all work.</p>`,
       `<p><strong>Shadowing</strong> nghĩa là lặp lại gần như đồng thời điều bạn nghe, chậm hơn 1–2 âm tiết, bắt chước nhịp, trọng âm và thanh điệu. CLS101 giới thiệu ý tưởng này với câu ngắn. Ở HSK 3 bạn làm với hội thoại 20–40 giây.</p>
<ol><li><strong>Nghe không chữ</strong> một lần: chủ đề gì? Ba từ khoá?</li><li><strong>Nghe kèm văn bản</strong> (pinyin nếu cần); gạch chân từ đã lỡ.</li><li><strong>Đọc to</strong> chậm; sửa thanh điệu của các từ đã gạch chân.</li><li><strong>Shadowing</strong> cùng bản ghi âm, cầm văn bản, ba lần.</li><li><strong>Shadowing không văn bản</strong> và ghi âm; so với bản gốc.</li></ol>
<p>Danh sách tự kiểm: Từ thanh 3 của tôi xuống–lên đúng chưa? Tôi có đọc nhẹ các từ nhẹ không? Tôi có nhấn cùng từ với người nói không? Tốc độ có gần (không chậm hơn 80%)? Đừng nhắm tới hoàn hảo; mỗi lần ghi âm chỉ cần một tiến bộ nhìn thấy được.</p>
<p>Chọn tài liệu đúng trình độ (95% từ đã biết), dài 20–40 giây, tốc độ tự nhiên. Một hội thoại trong giáo trình, đoạn ChinesePod mức cơ bản hay video ngắn có phụ đề đều dùng được.</p>`],
    d: [[`A`, `周末你有什么打算？`, `Zhōumò nǐ yǒu shénme dǎsuàn?`, `What are your plans for the weekend?`, `Cuối tuần bạn có dự định gì?`], [`B`, `我想去爬山，你呢？`, `Wǒ xiǎng qù páshān, nǐ ne?`, `I want to go hiking, you?`, `Mình muốn đi leo núi, còn bạn?`], [`A`, `我要在家休息，太累了。`, `Wǒ yào zài jiā xiūxi, tài lèi le.`, `I'll rest at home, too tired.`, `Mình sẽ nghỉ ở nhà, mệt quá.`]],
    dn: [`Shadow this 3-line dialogue five times, then record it.`, `Hãy shadowing hội thoại 3 dòng này năm lần rồi ghi âm.`],
    pit: [`Shadowing with a script you cannot yet read fluently turns it into reading practice. Choose easier material.`, `Shadowing với văn bản chưa đọc trôi chảy sẽ thành luyện đọc. Hãy chọn tài liệu dễ hơn.`],
    s: [[`Five steps: blind, script, read, shadow, shadow + record.`, `Năm bước: nghe không chữ, văn bản, đọc, shadowing, shadowing + ghi âm.`], [`Use 20–40 s clips at 95% known words.`, `Dùng đoạn 20–40 giây, 95% từ đã biết.`], [`Aim for one visible improvement per recording.`, `Mỗi lần ghi âm hướng tới một tiến bộ.`]],
    l: ['shadow', 'pod', 'hello'],
    p: [[`Name the 3rd step of the shadowing routine.`, `Nêu bước thứ 3 của quy trình shadowing.`, `Read aloud slowly and fix the tones of underlined words.`, `Đọc to chậm và sửa thanh điệu của từ đã gạch chân.`], [`What material level is best?`, `Tài liệu nên ở mức nào?`, `About 95% known words, 20–40 seconds.`, `Khoảng 95% từ đã biết, dài 20–40 giây.`]]
  }),
  Q(P + 'quiz-1', 'Quiz — Chapter 1', 'Quiz — Chương 1', [
    [[`Which word is stressed in the answer to 你什么时候去？ — 我明天去。`, `Từ nào được nhấn trong câu đáp 你什么时候去？ — 我明天去。`], [`明天`, `我`, `去`, `none`], 0, [`The new information (time) is stressed.`, `Thông tin mới (thời gian) được nhấn.`]],
    [[`不是…是… is used to`, `不是…是… dùng để`], [`contrast two items`, `ask a time`, `count`, `thank`], 0, [`It corrects: not X but Y.`, `Nó đính chính: không phải X mà là Y.`]],
    [[`In fast speech 什么 often sounds like`, `Khi nói nhanh 什么 hay nghe như`], [`shém / shéme`, `sān`, `mài`, `ba`], 0, [`The second syllable weakens.`, `Âm tiết thứ hai yếu đi.`]],
    [[`Which words are usually light in speech?`, `Những từ nào thường nhẹ khi nói?`], [`的 了 吧`, `numbers`, `verbs`, `place names`], 0, [`Grammar particles are weak.`, `Trợ từ ngữ pháp yếu.`]],
    [[`A good place to pause is`, `Chỗ ngắt tốt là`], [`after a time phrase`, `inside 看完`, `inside 一个`, `inside a surname`], 0, [`Time/topic phrases end a group.`, `Cụm thời gian/chủ đề kết thúc một nhóm.`]],
    [[`Pause groups are about how long?`, `Nhóm ngắt nghỉ dài khoảng bao nhiêu?`], [`2–6 syllables`, `1 syllable`, `20 syllables`, `no limit`], 0, [`Short groups are easy to hold.`, `Nhóm ngắn dễ giữ trong đầu.`]],
    [[`Step 1 of shadowing is`, `Bước 1 của shadowing là`], [`listen blind`, `record`, `read aloud`, `translate`], 0, [`First test your ear without text.`, `Trước hết thử tai không nhìn chữ.`]],
    [[`Best shadowing clip length`, `Độ dài đoạn shadowing tốt`], [`20–40 seconds`, `1 second`, `30 minutes`, `a whole movie`], 0, [`Short enough to repeat, long enough to flow.`, `Đủ ngắn để lặp, đủ dài để liền mạch.`]],
    [[`In 是不是, the middle 不 is read`, `Trong 是不是, 不 ở giữa đọc`], [`neutral`, `tone 4 strong`, `tone 2`, `tone 3`], 0, [`Between identical words it weakens.`, `Giữa hai từ giống nhau nó yếu đi.`]],
  ]),
]));

// ===== Chương 2 =====
secs.push(SEC('Chapter 2 — Listening strategies for longer texts', 'Chương 2 — Chiến lược nghe đoạn dài',
  'Ghi chú nhanh, từ nối báo hiệu, suy luận thái độ và các bẫy số–thời gian.', [
  D(P + '2-1', '2.1 Quick notes: keywords, symbols and numbers', '2.1 Ghi chú nhanh: từ khoá, ký hiệu và số',
    'Cách ghi 5 ô thông tin trong khi nghe, bộ ký hiệu riêng thay chữ Hán.', {
    n: '2.1',
    g: [[`Take notes in 5 slots while listening`, `Ghi chú theo 5 ô khi nghe`], [`Use a personal symbol set instead of Hanzi`, `Dùng bộ ký hiệu riêng thay vì chữ Hán`]],
    b: [`<p>A 60-second passage has more detail than memory can hold. Good listeners do not write sentences; they write <strong>slots</strong>: <em>who – when – where – what – why/how many</em>. In Chinese the question words tell you the slots: 谁 shéi (who), 什么时候 shénme shíhou (when), 在哪儿 zài nǎr (where), 做什么 zuò shénme (what), 为什么 wèishénme (why), 多少 duōshao (how many).</p>
<p>Write in the fastest script you have: pinyin initials, numbers as digits, arrows, and your own signs. Suggested symbols: → go / to, ← come from, ✓ yes / agree, ✗ no / disagree, $ money, ⏰ time, ≠ not, ↑ more, ↓ less, ? unclear. For people use A/B or initials. Never stop to remember a character — the next sentence will be lost.</p>
<p>Numbers need special care (see CLS101 Chapter 3 for digits and phone numbers). In HSK 3 the number is often changed in the second half: 「本来八点，后来改成八点半」 (originally 8:00, later changed to 8:30). Your notes should show both: 8:00 → 8:30. The final value is usually the answer.</p>
<p>After the audio ends you have 10–20 seconds: turn the slots into one sentence aloud (<em>Tomorrow 8:30, at the school gate, they go to the museum</em>). That is exactly what an examiner or a teacher expects when they ask you to report.</p>`,
       `<p>Một đoạn nghe 60 giây có nhiều chi tiết hơn trí nhớ giữ được. Người nghe giỏi không chép câu mà chép <strong>ô thông tin</strong>: <em>ai – khi nào – ở đâu – làm gì – vì sao/bao nhiêu</em>. Trong tiếng Trung, từ nghi vấn cho bạn biết ô: 谁 shéi (ai), 什么时候 shénme shíhou (khi nào), 在哪儿 zài nǎr (ở đâu), 做什么 zuò shénme (làm gì), 为什么 wèishénme (vì sao), 多少 duōshao (bao nhiêu).</p>
<p>Hãy ghi bằng kiểu chữ nhanh nhất mà bạn có: chữ cái đầu pinyin, số bằng chữ số, mũi tên và ký hiệu riêng. Gợi ý: → đi / đến, ← từ đâu đến, ✓ đồng ý, ✗ không / phản đối, $ tiền, ⏰ giờ, ≠ không phải, ↑ nhiều hơn, ↓ ít hơn, ? chưa rõ. Người thì ghi A/B hoặc chữ cái đầu. Đừng dừng lại nhớ chữ Hán — câu sau sẽ trôi mất.</p>
<p>Số cần đặc biệt cẩn thận (xem Chương 3 của CLS101 về chữ số và số điện thoại). Trong HSK 3 con số hay bị đổi ở nửa sau: 「本来八点，后来改成八点半」 (vốn 8 giờ, sau đổi thành 8 giờ rưỡi). Ghi chú nên có cả hai: 8:00 → 8:30. Giá trị cuối thường là đáp án.</p>
<p>Khi âm thanh kết thúc bạn có 10–20 giây: nói to các ô thành một câu (<em>Mai 8:30, ở cổng trường, đi bảo tàng</em>). Đó đúng là điều giám khảo hay thầy cô mong khi yêu cầu bạn thuật lại.</p>`],
    v: [[`本来`, `běnlái`, `originally`, `vốn dĩ`], [`后来`, `hòulái`, `later`, `về sau`], [`改成`, `gǎichéng`, `change into`, `đổi thành`], [`一共`, `yígòng`, `altogether`, `tổng cộng`], [`取消`, `qǔxiāo`, `cancel`, `huỷ`], [`推迟`, `tuīchí`, `postpone`, `hoãn`]],
    d: [[`A`, `明天的会本来八点开，后来改成八点半了。`, `Míngtiān de huì běnlái bā diǎn kāi, hòulái gǎichéng bā diǎn bàn le.`, `Tomorrow's meeting was at 8, now it is 8:30.`, `Cuộc họp mai vốn 8 giờ, sau đổi thành 8 rưỡi.`], [`B`, `在哪个房间？`, `Zài nǎ ge fángjiān?`, `Which room?`, `Phòng nào?`], [`A`, `三零五，一共有十二个人参加。`, `Sān líng wǔ, yígòng yǒu shí'èr ge rén cānjiā.`, `305, twelve people altogether.`, `Phòng 305, tổng cộng 12 người tham dự.`]],
    pit: [`Writing the first number you hear and not hearing the correction. Always wait for 后来, 改成, 不过, 但是 before you lock a number.`, `Ghi con số nghe đầu tiên mà không nghe lời đính chính. Hãy chờ 后来, 改成, 不过, 但是 rồi mới chốt số.`],
    s: [[`Take notes in slots: who, when, where, what, how many.`, `Ghi theo ô: ai, khi nào, ở đâu, làm gì, bao nhiêu.`], [`Use digits, arrows and personal symbols.`, `Dùng chữ số, mũi tên và ký hiệu riêng.`], [`Numbers can change: record both, trust the last.`, `Số có thể đổi: ghi cả hai, tin cái sau.`]],
    l: ['note', 'listen', 'pod'],
    p: [[`In the dialogue, what is the final time and room?`, `Trong hội thoại, giờ và phòng cuối cùng là gì?`, `8:30, room 305.`, `8 giờ 30, phòng 305.`], [`Which words warn that a number is corrected?`, `Những từ nào báo hiệu số được đính chính?`, `后来, 改成, 不过, 但是.`, `后来, 改成, 不过, 但是.`]]
  }),
  D(P + '2-2', '2.2 Signpost words: because, although, if, first… then…', '2.2 Từ báo hiệu: vì, tuy, nếu, trước… rồi…',
    'Các cặp liên từ giúp đoán trước điều sắp nghe; thực hành hiểu chuỗi lý do và kết quả.', {
    n: '2.2',
    g: [[`Recognise paired connectors and predict the second half`, `Nhận ra cặp liên từ và đoán nửa sau`], [`Use them in your own speech`, `Dùng chúng trong lời nói của bạn`]],
    b: [`<p>In Chinese the structure of a passage is announced by connectors. When you hear the first half, you can often guess the shape of the second half. This is the best defence against speed.</p>
<table><thead><tr><th>Pattern</th><th>Meaning</th><th>What to expect</th></tr></thead><tbody>
<tr><td>因为…所以…</td><td>because… so…</td><td>reason, then result</td></tr>
<tr><td>虽然…但是…</td><td>although… but…</td><td>the part after 但是 is the speaker's real point</td></tr>
<tr><td>如果…就…</td><td>if… then…</td><td>condition, then consequence</td></tr>
<tr><td>先…然后…最后…</td><td>first… then… finally</td><td>a sequence of 3 steps</td></tr>
<tr><td>不但…而且…</td><td>not only… but also</td><td>second item stronger</td></tr>
<tr><td>一边…一边…</td><td>while… at the same time</td><td>two actions together</td></tr>
</tbody></table>
<p>The speaker may drop half of the pair: 「因为下雨，我没去。」 has no 所以; 「虽然很贵，我还是买了。」 uses 还是 as the sign of contrast. Listen for the logic word that is left: 但是 / 可是 / 不过 (but), 所以 (so), 结果 (as a result), 然后 (then), 后来 (later), 最后 (finally).</p>
<p>Exam tip: the question after a 虽然…但是 sentence almost always asks about the part after 但是. After 因为…所以… it asks for the reason or the result, not both; hear which one the question mentions.</p>`,
       `<p>Cấu trúc đoạn nói tiếng Trung được báo trước bằng liên từ. Nghe nửa đầu là thường đoán được hình dạng nửa sau. Đây là cách phòng thủ tốt nhất trước tốc độ nói.</p>
<table><thead><tr><th>Mẫu</th><th>Nghĩa</th><th>Điều sắp nghe</th></tr></thead><tbody>
<tr><td>因为…所以…</td><td>vì… nên…</td><td>lý do rồi kết quả</td></tr>
<tr><td>虽然…但是…</td><td>tuy… nhưng…</td><td>phần sau 但是 là ý chính của người nói</td></tr>
<tr><td>如果…就…</td><td>nếu… thì…</td><td>điều kiện rồi hệ quả</td></tr>
<tr><td>先…然后…最后…</td><td>trước… rồi… cuối cùng</td><td>chuỗi 3 bước</td></tr>
<tr><td>不但…而且…</td><td>không những… mà còn…</td><td>vế sau mạnh hơn</td></tr>
<tr><td>一边…一边…</td><td>vừa… vừa…</td><td>hai việc cùng lúc</td></tr>
</tbody></table>
<p>Người nói có thể bỏ một nửa cặp: 「因为下雨，我没去。」 không có 所以; 「虽然很贵，我还是买了。」 dùng 还是 làm dấu đối lập. Hãy nghe từ logic còn lại: 但是 / 可是 / 不过 (nhưng), 所以 (nên), 结果 (kết quả là), 然后 (rồi), 后来 (về sau), 最后 (cuối cùng).</p>
<p>Mẹo thi: câu hỏi sau một câu 虽然…但是 hầu như luôn hỏi phần sau 但是. Sau 因为…所以… câu hỏi chỉ hỏi lý do hoặc kết quả, không hỏi cả hai; hãy nghe câu hỏi nhắc cái nào.</p>`],
    d: [[`A`, `你为什么没去看电影？`, `Nǐ wèishénme méi qù kàn diànyǐng?`, `Why didn't you go to the movie?`, `Sao bạn không đi xem phim?`], [`B`, `虽然票很便宜，但是我今天要加班，所以去不了。`, `Suīrán piào hěn piányi, dànshì wǒ jīntiān yào jiābān, suǒyǐ qù bu liǎo.`, `Although tickets are cheap, I have overtime today, so I can't.`, `Tuy vé rẻ nhưng hôm nay tôi phải tăng ca nên không đi được.`], [`A`, `那你先把工作做完，然后再休息吧。`, `Nà nǐ xiān bǎ gōngzuò zuò wán, ránhòu zài xiūxi ba.`, `Then finish work first, then rest.`, `Vậy bạn làm xong việc trước rồi hẵng nghỉ.`]],
    pit: [`Choosing the answer that matches the part before 但是. The speaker's real point is after it.`, `Chọn đáp án khớp phần trước 但是. Ý chính của người nói nằm sau nó.`],
    s: [[`Paired connectors announce the structure.`, `Cặp liên từ báo trước cấu trúc.`], [`After 但是 comes the main point.`, `Sau 但是 là ý chính.`], [`Half of a pair may be dropped; listen for the rest.`, `Có thể bỏ một nửa cặp; hãy nghe phần còn lại.`]],
    l: ['conj', 'disc', 'gram'],
    p: [[`Which part do questions usually ask after 虽然…但是…?`, `Câu hỏi thường hỏi phần nào sau 虽然…但是…?`, `The part after 但是.`, `Phần sau 但是.`], [`Make a sentence with 先…然后…最后… about your morning.`, `Đặt câu với 先…然后…最后… về buổi sáng của bạn.`, `E.g. 我先刷牙，然后吃早饭，最后去上课。`, `Ví dụ: 我先刷牙，然后吃早饭，最后去上课。`]]
  }),
  D(P + '2-3', '2.3 Reading between the lines: attitude and indirect answers', '2.3 Nghe giữa các dòng: thái độ và câu đáp gián tiếp',
    'Từ chối khéo, nói giảm, giọng điệu và hàm ý trong hội thoại HSK 3.', {
    n: '2.3',
    g: [[`Understand what a speaker means but does not say`, `Hiểu điều người nói muốn nói mà không nói thẳng`], [`Use indirect answers politely`, `Dùng câu đáp gián tiếp lịch sự`]],
    b: [`<p>Chinese speakers often avoid a direct «no». 「我考虑一下 wǒ kǎolǜ yíxià」 (let me think about it), 「可能不太方便 kěnéng bú tài fāngbiàn」 (maybe not very convenient), 「再说吧 zàishuō ba」 (we'll see) all usually mean <strong>no</strong>. An invitation answered with 「我尽量 wǒ jǐnliàng」 (I'll try) is a weak yes at best.</p>
<p>Intonation also carries attitude. A rising 「是吗？」 shows interest; a flat falling 「是吗。」 shows doubt or boredom. 「哦 ó / ò」 can be surprise or a bored acknowledgement. A longer, drawn-out 「嗯——」 is hesitation. Sentence-final particles: 「吧 ba」 softens (suggestion or guess), 「啊 a」 adds warmth, 「呢 ne」 adds a mild contrast or ongoing action, 「嘛 ma」 says "obviously".</p>
<p>Understatement is common: 「还可以 hái kěyǐ」 (not bad) is only mildly positive; 「不错 búcuò」 is good; 「有点儿 yǒudiǎnr + negative」 is a gentle complaint: 「有点儿贵」 means "it is too expensive for me". Compliments are refused as politeness: 「哪里哪里 nǎli nǎli」 (not at all).</p>
<p><strong>Listening test habit:</strong> if the answer choice repeats the speaker's words exactly, be suspicious. The right option often paraphrases the meaning (「不太方便」 → "cannot come").</p>`,
       `<p>Người Trung thường tránh nói thẳng «không». 「我考虑一下 wǒ kǎolǜ yíxià」 (để tôi suy nghĩ), 「可能不太方便 kěnéng bú tài fāngbiàn」 (có lẽ không tiện lắm), 「再说吧 zàishuō ba」 (để xem sao) thường đều là <strong>không</strong>. Lời mời được đáp bằng 「我尽量 wǒ jǐnliàng」 (tôi cố gắng) cùng lắm là «có» yếu.</p>
<p>Ngữ điệu cũng mang thái độ. 「是吗？」 lên giọng thể hiện quan tâm; 「是吗。」 xuống phẳng thể hiện nghi ngờ hoặc chán. 「哦 ó / ò」 có thể là ngạc nhiên hoặc đáp qua loa. 「嗯——」 kéo dài là do dự. Trợ từ cuối câu: 「吧 ba」 làm mềm (đề nghị hoặc đoán), 「啊 a」 thêm ấm áp, 「呢 ne」 thêm đối chiếu nhẹ hoặc hành động đang diễn ra, 「嘛 ma」 nghĩa là «hiển nhiên mà».</p>
<p>Nói giảm rất phổ biến: 「还可以 hái kěyǐ」 (tạm được) chỉ khen nhẹ; 「不错 búcuò」 là tốt; 「有点儿 yǒudiǎnr + từ tiêu cực」 là phàn nàn nhẹ: 「有点儿贵」 nghĩa là «đắt quá với tôi». Lời khen được từ chối cho lịch sự: 「哪里哪里 nǎli nǎli」 (đâu có đâu có).</p>
<p><strong>Thói quen khi làm bài nghe:</strong> nếu đáp án lặp y nguyên lời người nói thì phải nghi ngờ. Đáp án đúng thường diễn đạt lại ý (「不太方便」 → «không đến được»).</p>`],
    v: [[`考虑`, `kǎolǜ`, `consider`, `cân nhắc`], [`方便`, `fāngbiàn`, `convenient`, `tiện`], [`尽量`, `jǐnliàng`, `try one's best`, `cố hết sức`], [`再说`, `zàishuō`, `deal with it later`, `để sau hẵng tính`], [`还可以`, `hái kěyǐ`, `not bad`, `tạm được`], [`有点儿`, `yǒudiǎnr`, `a little (negative)`, `hơi (tiêu cực)`]],
    d: [[`A`, `周六晚上一起吃饭，怎么样？`, `Zhōuliù wǎnshang yìqǐ chīfàn, zěnmeyàng?`, `Dinner together on Saturday night?`, `Tối thứ Bảy cùng ăn cơm nhé?`], [`B`, `周六啊……可能不太方便，再说吧。`, `Zhōuliù a… kěnéng bú tài fāngbiàn, zàishuō ba.`, `Saturday… maybe not convenient, we'll see.`, `Thứ Bảy à… có lẽ không tiện lắm, để sau nhé.`], [`A`, `好的，那下次吧。`, `Hǎo de, nà xiàcì ba.`, `OK, next time.`, `Được, vậy lần sau.`]],
    pit: [`Taking 再说吧 or 我考虑一下 as a promise and waiting for a message. They are usually soft refusals.`, `Coi 再说吧 hoặc 我考虑一下 là lời hứa rồi chờ tin nhắn. Thường đó là lời từ chối mềm.`],
    s: [[`Soft refusals: 再说吧, 不太方便, 我考虑一下.`, `Từ chối mềm: 再说吧, 不太方便, 我考虑一下.`], [`Intonation and particles show attitude.`, `Ngữ điệu và trợ từ thể hiện thái độ.`], [`Right options paraphrase; identical words are suspicious.`, `Đáp án đúng thường diễn đạt lại; trùng từ nguyên văn là đáng ngờ.`]],
    l: ['intonation', 'part', 'yoyo'],
    p: [[`Does 可能不太方便 accept or refuse an invitation?`, `可能不太方便 là nhận hay từ chối lời mời?`, `It politely refuses.`, `Nó từ chối lịch sự.`], [`What does 有点儿贵 really say?`, `有点儿贵 thật ra nói gì?`, `It is too expensive for me — a gentle complaint.`, `Quá đắt với tôi — lời phàn nàn nhẹ.`]]
  }),
  D(P + '2-4', '2.4 Traps: numbers, time, negation and distractors', '2.4 Các bẫy: số, thời gian, phủ định và câu gây nhiễu',
    'Danh mục bẫy thường gặp trong đề nghe HSK 3 và cách tự bảo vệ.', {
    n: '2.4',
    g: [[`Name six frequent listening traps`, `Kể sáu bẫy nghe thường gặp`], [`Apply a check-before-answer routine`, `Áp dụng quy trình kiểm trước khi trả lời`]],
    b: [`<p>HSK 3 test makers do not hide the answer; they put <strong>competing information</strong> next to it. Learn the six common traps:</p>
<ol><li><strong>Changed numbers</strong>: 本来…后来… (see 2.1).</li><li><strong>Hidden negation</strong>: 「不是没有 bú shì méiyǒu」, 「不太 bú tài」, 「没(有)…过」; one 不 flips the answer.</li><li><strong>Similar-sounding words</strong>: 「十 shí / 四 sì」, 「买 mǎi / 卖 mài」, 「问 wèn / 闻 wén」, 「睡觉 shuìjiào / 水饺 shuǐjiǎo」.</li><li><strong>Time shifts</strong>: 昨天 / 前天 / 后天, 上个月 / 下个月, 早上 / 下午; the question asks for one specific time.</li><li><strong>Repeated words in a wrong sense</strong>: the option uses a word you just heard but about another person.</li><li><strong>Who does it?</strong>: 他说他妈妈…: the subject of the question is "mother", not "he".</li></ol>
<p><strong>Routine.</strong> (1) Read options during the first listening and underline the difference between them. (2) While the audio runs, only listen for that difference. (3) Before answering, do a one-second check: right person? right time? negation? (4) If unsure, choose the option that paraphrases the speaker's final statement, not the first.</p>
<p>When speaking, you can use the same logic: avoid ambiguity by repeating the key noun and adding a time word. 「是明天，不是今天。」</p>`,
       `<p>Người ra đề HSK 3 không giấu đáp án; họ đặt <strong>thông tin cạnh tranh</strong> ngay bên cạnh. Hãy học sáu bẫy thường gặp:</p>
<ol><li><strong>Số bị đổi</strong>: 本来…后来… (xem 2.1).</li><li><strong>Phủ định ẩn</strong>: 「不是没有 bú shì méiyǒu」, 「不太 bú tài」, 「没(有)…过」; một chữ 不 làm đảo đáp án.</li><li><strong>Từ gần âm</strong>: 「十 shí / 四 sì」, 「买 mǎi / 卖 mài」, 「问 wèn / 闻 wén」, 「睡觉 shuìjiào / 水饺 shuǐjiǎo」.</li><li><strong>Dịch chuyển thời gian</strong>: 昨天 / 前天 / 后天, 上个月 / 下个月, 早上 / 下午; câu hỏi chỉ hỏi một thời điểm.</li><li><strong>Từ lặp nhưng sai nghĩa</strong>: đáp án dùng từ bạn vừa nghe nhưng nói về người khác.</li><li><strong>Ai làm?</strong>: 他说他妈妈…: chủ thể của câu hỏi là «mẹ», không phải «anh ấy».</li></ol>
<p><strong>Quy trình.</strong> (1) Đọc các đáp án trong lần nghe đầu và gạch chân chỗ khác nhau. (2) Khi nghe, chỉ chú ý chỗ khác biệt đó. (3) Trước khi chọn, kiểm một giây: đúng người? đúng thời gian? có phủ định không? (4) Nếu chưa chắc, chọn đáp án diễn đạt lại câu kết của người nói, không phải câu đầu.</p>
<p>Khi nói, dùng cùng logic: tránh mơ hồ bằng cách lặp danh từ chính và thêm từ chỉ thời gian. 「是明天，不是今天。」</p>`],
    v: [[`不太`, `bú tài`, `not very`, `không… lắm`], [`没…过`, `méi…guo`, `never (experience)`, `chưa từng`], [`睡觉`, `shuìjiào`, `to sleep`, `ngủ`], [`水饺`, `shuǐjiǎo`, `boiled dumplings`, `sủi cảo`], [`前天`, `qiántiān`, `day before yesterday`, `hôm kia`], [`后天`, `hòutiān`, `day after tomorrow`, `ngày kia`]],
    d: [[`A`, `你妈妈是不是不太喜欢吃辣的？`, `Nǐ māma shì bu shì bú tài xǐhuan chī là de?`, `Doesn't your mother like spicy food much?`, `Mẹ bạn không thích ăn cay lắm phải không?`], [`B`, `不是，她不是不喜欢，是医生说她最近不能吃。`, `Bú shì, tā bú shì bù xǐhuan, shì yīshēng shuō tā zuìjìn bù néng chī.`, `No, it is not that she dislikes it; the doctor says she can't now.`, `Không, mẹ không phải không thích, mà bác sĩ bảo dạo này mẹ không được ăn.`]],
    pit: [`Choosing «dislikes spicy food» after hearing 不喜欢 — you missed 不是…是…, which reverses the reason.`, `Chọn «không thích cay» sau khi nghe 不喜欢 — bỏ sót 不是…是… làm đảo lý do.`],
    s: [[`Six traps: changed number, negation, similar sounds, time shift, wrong-sense repeats, wrong subject.`, `Sáu bẫy: số đổi, phủ định, gần âm, dịch thời gian, lặp sai nghĩa, sai chủ thể.`], [`Underline option differences before the audio.`, `Gạch chân chỗ khác nhau của đáp án trước khi nghe.`], [`One-second check: who, when, negation.`, `Kiểm một giây: ai, khi nào, phủ định.`]],
    l: ['hsk', 'hskoff', 'yoyo'],
    p: [[`Why was the mother not eating spicy food?`, `Vì sao mẹ không ăn cay?`, `The doctor said she can't now; it is not dislike.`, `Bác sĩ bảo dạo này không được; không phải không thích.`], [`Give one pair of similar-sounding words that change meaning.`, `Cho một cặp từ gần âm làm đổi nghĩa.`, `买 mǎi / 卖 mài.`, `买 mǎi / 卖 mài.`]]
  }),
  Q(P + 'quiz-2', 'Quiz — Chapter 2', 'Quiz — Chương 2', [
    [[`The five note slots are`, `Năm ô ghi chú là`], [`who, when, where, what, how many`, `colours only`, `tones only`, `grammar rules`], 0, [`They map to question words.`, `Chúng tương ứng các từ nghi vấn.`]],
    [[`In 本来八点，后来改成八点半, the final time is`, `Trong 本来八点，后来改成八点半, giờ cuối là`], [`8:30`, `8:00`, `9:00`, `none`], 0, [`改成 gives the new value.`, `改成 cho giá trị mới.`]],
    [[`After 虽然…但是… the main point is`, `Sau 虽然…但是… ý chính là`], [`after 但是`, `before 虽然`, `the tone`, `the number`], 0, [`But-clause carries the point.`, `Vế 但是 mang ý chính.`]],
    [[`先…然后…最后… signals`, `先…然后…最后… báo hiệu`], [`3 steps in order`, `a question`, `a negation`, `a price`], 0, [`First, then, finally.`, `Trước, rồi, cuối cùng.`]],
    [[`再说吧 as an answer to an invitation usually means`, `再说吧 đáp lời mời thường có nghĩa`], [`probably no`, `definitely yes`, `I am hungry`, `repeat please`], 0, [`It is a soft refusal.`, `Đó là từ chối mềm.`]],
    [[`有点儿贵 means`, `有点儿贵 nghĩa là`], [`a bit too expensive`, `very cheap`, `free`, `delicious`], 0, [`有点儿 + negative = mild complaint.`, `有点儿 + tiêu cực = phàn nàn nhẹ.`]],
    [[`Which pair is a similar-sounding trap?`, `Cặp nào là bẫy gần âm?`], [`买 / 卖`, `一 / 二`, `大 / 小`, `左 / 右`], 0, [`Same syllable, different tone.`, `Cùng âm tiết, khác thanh.`]],
    [[`An option that repeats the speaker's words exactly is`, `Đáp án lặp y nguyên lời người nói thì`], [`often a distractor`, `always right`, `always wrong`, `a number`], 0, [`Right answers often paraphrase.`, `Đáp án đúng thường diễn đạt lại.`]],
    [[`Before answering, check`, `Trước khi trả lời, kiểm`], [`person, time, negation`, `only colour`, `font`, `the page number`], 0, [`These are the common traps.`, `Đó là các bẫy thường gặp.`]],
  ]),
]));

// ===== Chương 3 =====
secs.push(SEC('Chapter 3 — People, campus life and opinions', 'Chương 3 — Con người, đời sống học đường và ý kiến',
  'Mô tả người, đời sống trường học, so sánh và bày tỏ quan điểm.', [
  D(P + '3-1', '3.1 Describing people: looks and personality', '3.1 Miêu tả người: ngoại hình và tính cách',
    'Từ vựng ngoại hình và tính cách, cấu trúc miêu tả, hội thoại nhận ra người ở sân bay.', {
    n: '3.1',
    g: [[`Describe a person in 4–5 sentences`, `Miêu tả một người trong 4–5 câu`], [`Understand descriptions when you listen`, `Hiểu lời miêu tả khi nghe`]],
    b: [`<p>A good description follows a fixed order: <strong>age/height → looks → clothes → personality</strong>. The frame is simple: 「他个子很高，头发短短的，戴着眼镜，穿一件蓝色的衬衫。」 Notice the reduplication 「短短的 duǎnduǎn de」 which makes an adjective vivid, and the pattern 「戴着 / 穿着」 (wearing) which gives a current state. 「长得 zhǎng de」 describes appearance: 「她长得很漂亮」, 「他长得像他爸爸」.</p>
<p>For personality: 「性格 xìnggé」 + adjective: 「开朗 kāilǎng」 (outgoing), 「内向 nèixiàng」 (shy), 「热情 rèqíng」 (warm), 「聪明 cōngmíng」 (clever), 「认真 rènzhēn」 (conscientious), 「幽默 yōumò」 (humorous). A typical sentence: 「他性格很开朗，喜欢和别人聊天。」 Give evidence with an example — Chinese speakers like it.</p>
<p>When you listen to a description to identify someone (airport pick-up, a missing item), catch the <strong>distinguishing features</strong>: the colour, 「戴眼镜」, 「背着包」, and the exact height (「一米七」 yì mǐ qī). Ignore generic words like 很 and 的.</p>
<p>When you speak, avoid a flat list. Link with 「而且 érqiě」 (moreover) and 「但是」: 「他有点儿内向，但是对朋友特别热情。」</p>`,
       `<p>Một bài miêu tả tốt theo thứ tự cố định: <strong>tuổi/chiều cao → ngoại hình → quần áo → tính cách</strong>. Khung đơn giản: 「他个子很高，头发短短的，戴着眼镜，穿一件蓝色的衬衫。」 Chú ý láy 「短短的 duǎnduǎn de」 làm tính từ sinh động, và mẫu 「戴着 / 穿着」 (đang đeo / đang mặc) chỉ trạng thái hiện tại. 「长得 zhǎng de」 miêu tả ngoại hình: 「她长得很漂亮」, 「他长得像他爸爸」.</p>
<p>Tính cách: 「性格 xìnggé」 + tính từ: 「开朗 kāilǎng」 (cởi mở), 「内向 nèixiàng」 (hướng nội), 「热情 rèqíng」 (nhiệt tình), 「聪明 cōngmíng」 (thông minh), 「认真 rènzhēn」 (chu đáo, nghiêm túc), 「幽默 yōumò」 (hài hước). Câu mẫu: 「他性格很开朗，喜欢和别人聊天。」 Hãy nêu dẫn chứng bằng ví dụ — người Trung rất thích điều này.</p>
<p>Khi nghe miêu tả để nhận ra ai đó (đón sân bay, tìm đồ thất lạc), hãy bắt <strong>đặc điểm phân biệt</strong>: màu sắc, 「戴眼镜」, 「背着包」 và chiều cao chính xác (「一米七」 yì mǐ qī). Bỏ qua các từ chung như 很 và 的.</p>
<p>Khi nói, tránh liệt kê phẳng. Nối bằng 「而且 érqiě」 (hơn nữa) và 「但是」: 「他有点儿内向，但是对朋友特别热情。」</p>`],
    v: [[`个子`, `gèzi`, `height / build`, `dáng người, chiều cao`], [`戴`, `dài`, `to wear (glasses, hat)`, `đeo, đội`], [`眼镜`, `yǎnjìng`, `glasses`, `kính`], [`开朗`, `kāilǎng`, `outgoing`, `cởi mở`], [`内向`, `nèixiàng`, `introverted`, `hướng nội`], [`热情`, `rèqíng`, `warm, enthusiastic`, `nhiệt tình`]],
    d: [[`A`, `你要接的朋友长什么样？`, `Nǐ yào jiē de péngyou zhǎng shénme yàng?`, `What does the friend you are picking up look like?`, `Người bạn bạn đón trông thế nào?`], [`B`, `个子很高，戴着眼镜，背着一个黑色的包。`, `Gèzi hěn gāo, dàizhe yǎnjìng, bēizhe yí ge hēisè de bāo.`, `Tall, wearing glasses, carrying a black bag.`, `Cao, đeo kính, đeo một chiếc túi đen.`], [`A`, `他性格怎么样？`, `Tā xìnggé zěnmeyàng?`, `What is he like?`, `Tính cách anh ấy thế nào?`], [`B`, `很开朗，也很幽默。`, `Hěn kāilǎng, yě hěn yōumò.`, `Outgoing and humorous.`, `Rất cởi mở và hài hước.`]],
    pit: [`Using 很 before every adjective sounds like a list. Also, 戴 is for things on the head/face, 穿 for clothes: do not say 穿眼镜.`, `Dùng 很 trước mọi tính từ nghe như liệt kê. Cũng vậy, 戴 dùng cho đồ đeo ở đầu/mặt, 穿 cho quần áo: đừng nói 穿眼镜.`],
    s: [[`Order: build → looks → clothes → personality.`, `Thứ tự: dáng → ngoại hình → quần áo → tính cách.`], [`着 shows a state: 戴着 / 穿着.`, `着 chỉ trạng thái: 戴着 / 穿着.`], [`Back personality with an example.`, `Dẫn chứng tính cách bằng ví dụ.`]],
    l: ['gram', 'yoyo', 'pod'],
    p: [[`Describe a classmate in 3 sentences using 个子, 戴着 and 性格.`, `Miêu tả một bạn học trong 3 câu dùng 个子, 戴着 và 性格.`, `E.g. 他个子很高，戴着眼镜，性格很开朗。`, `Ví dụ: 他个子很高，戴着眼镜，性格很开朗。`], [`Which verb goes with 眼镜: 穿 or 戴?`, `Động từ nào đi với 眼镜: 穿 hay 戴?`, `戴.`, `戴.`]]
  }),
  D(P + '3-2', '3.2 Campus and study life', '3.2 Đời sống học đường',
    'Từ vựng lớp học, bài tập, thi cử, thư viện; hỏi–đáp về lịch học và khó khăn.', {
    n: '3.2',
    g: [[`Talk about courses, homework and exams`, `Nói về môn học, bài tập và kỳ thi`], [`Ask for help from a teacher or classmate`, `Nhờ thầy cô hoặc bạn học giúp đỡ`]],
    b: [`<p>CLS101 gave you the class schedule. Now go deeper into study life. Key vocabulary: 「专业 zhuānyè」 (major), 「作业 zuòyè」 (homework), 「考试 kǎoshì」 (exam), 「成绩 chéngjì」 (grades), 「复习 fùxí」 (review), 「预习 yùxí」 (preview), 「图书馆 túshūguǎn」, 「宿舍 sùshè」 (dormitory), 「社团 shètuán」 (club).</p>
<p>Useful chunks: 「我学的是汉语专业」, 「这次考试我准备得不太好」, 「作业什么时候交？」, 「老师，这个词我没听懂，您能再说一遍吗？」 (Teacher, I did not understand this word, can you say it again?). Note the polite pattern 「能…吗」 and the verb complement 「听懂 tīngdǒng」, 「看懂 kàndǒng」. 「得 de」 links a verb to its degree: 「说得很快」, 「写得不太好」.</p>
<p>In listening, announcements often combine date, place and requirement: 「请大家下周三上午九点在二楼教室参加考试，别忘了带学生证。」 Notes: next Wednesday 9:00, 2nd floor classroom, exam, bring student card. Note the negative command 「别…」 and 「不要…」 (don't).</p>
<p>When you speak with a teacher, add a short polite opening (「老师，打扰一下」) and state your problem first, then your request.</p>`,
       `<p>CLS101 đã cho bạn thời khoá biểu. Giờ đi sâu vào đời sống học tập. Từ vựng chính: 「专业 zhuānyè」 (ngành), 「作业 zuòyè」 (bài tập), 「考试 kǎoshì」 (kỳ thi), 「成绩 chéngjì」 (điểm), 「复习 fùxí」 (ôn tập), 「预习 yùxí」 (chuẩn bị bài), 「图书馆 túshūguǎn」, 「宿舍 sùshè」 (ký túc xá), 「社团 shètuán」 (câu lạc bộ).</p>
<p>Cụm hữu ích: 「我学的是汉语专业」, 「这次考试我准备得不太好」, 「作业什么时候交？」, 「老师，这个词我没听懂，您能再说一遍吗？」 (Thưa thầy, em không nghe hiểu từ này, thầy nói lại được không ạ?). Chú ý mẫu lịch sự 「能…吗」 và bổ ngữ kết quả 「听懂 tīngdǒng」, 「看懂 kàndǒng」. 「得 de」 nối động từ với mức độ: 「说得很快」, 「写得不太好」.</p>
<p>Khi nghe, thông báo hay kết hợp ngày, nơi, yêu cầu: 「请大家下周三上午九点在二楼教室参加考试，别忘了带学生证。」 Ghi chú: thứ Tư tuần sau 9:00, phòng tầng 2, thi, mang thẻ sinh viên. Chú ý lệnh phủ định 「别…」 và 「不要…」 (đừng).</p>
<p>Khi nói với thầy cô, thêm mở đầu lịch sự ngắn (「老师，打扰一下」), nêu vấn đề trước rồi đến yêu cầu.</p>`],
    v: [[`专业`, `zhuānyè`, `major`, `chuyên ngành`], [`成绩`, `chéngjì`, `grades`, `điểm số`], [`复习`, `fùxí`, `review`, `ôn tập`], [`听懂`, `tīngdǒng`, `understand by listening`, `nghe hiểu`], [`交`, `jiāo`, `hand in`, `nộp`], [`打扰`, `dǎrǎo`, `disturb`, `làm phiền`]],
    d: [[`A`, `老师，打扰一下，这次作业什么时候交？`, `Lǎoshī, dǎrǎo yíxià, zhè cì zuòyè shénme shíhou jiāo?`, `Teacher, excuse me, when is the homework due?`, `Thưa thầy, cho em hỏi bài tập lần này khi nào nộp ạ?`], [`B`, `下周一上课前交。你做得怎么样？`, `Xià Zhōuyī shàngkè qián jiāo. Nǐ zuò de zěnmeyàng?`, `Before class next Monday. How is it going?`, `Trước giờ học thứ Hai tuần sau. Em làm thế nào rồi?`], [`A`, `有两个词我没看懂，您能给我讲一下吗？`, `Yǒu liǎng ge cí wǒ méi kàndǒng, nín néng gěi wǒ jiǎng yíxià ma?`, `There are two words I did not understand; can you explain?`, `Có hai từ em chưa hiểu, thầy giải thích giúp em được không?`]],
    pit: [`Saying 我不懂 alone is vague. Say which part: 没听懂 (heard but did not follow) or 没看懂 (read).`, `Chỉ nói 我不懂 thì mơ hồ. Hãy nói rõ: 没听懂 (nghe không hiểu) hay 没看懂 (đọc không hiểu).`],
    s: [[`Vocabulary: 专业, 作业, 考试, 成绩, 复习.`, `Từ vựng: 专业, 作业, 考试, 成绩, 复习.`], [`听懂 / 看懂 specify what failed.`, `听懂 / 看懂 chỉ rõ khâu nào hỏng.`], [`Announcements: date + place + requirement.`, `Thông báo: ngày + nơi + yêu cầu.`]],
    l: ['gaokao', 'gram', 'pod'],
    p: [[`Ask politely when the exam is.`, `Hỏi lịch sự khi nào thi.`, `老师，请问考试是什么时候？`, `老师，请问考试是什么时候？`], [`What is the difference between 听懂 and 看懂?`, `Khác nhau giữa 听懂 và 看懂?`, `Understand by hearing versus by reading.`, `Hiểu bằng nghe so với bằng đọc.`]]
  }),
  D(P + '3-3', '3.3 Comparing: 比, 没有, 一样, 更', '3.3 So sánh: 比, 没有, 一样, 更',
    'Các mẫu so sánh hay xuất hiện ở HSK 3, nghe số liệu so sánh và bày tỏ lựa chọn.', {
    n: '3.3',
    g: [[`Use four comparison patterns correctly`, `Dùng đúng bốn mẫu so sánh`], [`Listen for who is more/less`, `Nghe ra ai hơn/kém`]],
    b: [`<p>Chinese has no changing adjective ending; comparison comes from <strong>patterns</strong>:</p>
<table><thead><tr><th>Pattern</th><th>Example</th><th>Meaning</th></tr></thead><tbody>
<tr><td>A 比 B + adj</td><td>今天比昨天热</td><td>today is hotter than yesterday</td></tr>
<tr><td>A 比 B + adj + 多了/一点儿</td><td>他比我高一点儿</td><td>he is a bit taller</td></tr>
<tr><td>A 没有 B + adj</td><td>我没有他高</td><td>I am not as tall as him</td></tr>
<tr><td>A 跟 B 一样 + adj</td><td>这个跟那个一样大</td><td>the same size</td></tr>
<tr><td>更 / 最</td><td>更便宜, 最便宜</td><td>even cheaper, cheapest</td></tr>
</tbody></table>
<p>Do not put 很 in a 比 sentence: 「他比我很高」 is wrong. Use 「还 hái」 or 「更 gèng」 for "even more": 「他比我还高」. Differences are placed after the adjective: 「高五厘米」, 「贵十块」.</p>
<p>In listening, the trap is the direction. 「小王比小李大两岁」: Wang is older. 「我没有他高」: I am shorter. Write A > B in notes. Also 「不如 bùrú」: 「步行不如坐地铁快」 (walking is not as fast as the subway). When you speak, give the difference with a number: 「这个比那个便宜二十块」; numbers make a comparison convincing and easy to check.</p>
<p>Extra practice: listen to someone compare three items and rank them yourself with A &gt; B &gt; C. This forces you to hear the direction of the comparison, not only the names of the objects.</p>`,
       `<p>Tiếng Trung không đổi đuôi tính từ; so sánh dựa vào <strong>mẫu câu</strong>:</p>
<table><thead><tr><th>Mẫu</th><th>Ví dụ</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>A 比 B + tính từ</td><td>今天比昨天热</td><td>hôm nay nóng hơn hôm qua</td></tr>
<tr><td>A 比 B + tt + 多了/一点儿</td><td>他比我高一点儿</td><td>anh ấy cao hơn một chút</td></tr>
<tr><td>A 没有 B + tính từ</td><td>我没有他高</td><td>tôi không cao bằng anh ấy</td></tr>
<tr><td>A 跟 B 一样 + tt</td><td>这个跟那个一样大</td><td>to bằng nhau</td></tr>
<tr><td>更 / 最</td><td>更便宜, 最便宜</td><td>còn rẻ hơn, rẻ nhất</td></tr>
</tbody></table>
<p>Đừng đặt 很 trong câu 比: 「他比我很高」 là sai. Dùng 「还 hái」 hoặc 「更 gèng」 cho «còn hơn nữa»: 「他比我还高」. Mức chênh đặt sau tính từ: 「高五厘米」, 「贵十块」.</p>
<p>Khi nghe, bẫy là chiều so sánh. 「小王比小李大两岁」: Vương lớn hơn. 「我没有他高」: tôi thấp hơn. Ghi chú dạng A > B. Còn có 「不如 bùrú」: 「步行不如坐地铁快」 (đi bộ không nhanh bằng tàu điện ngầm). Khi nói, hãy nêu mức chênh bằng con số: 「这个比那个便宜二十块」; con số làm lời so sánh thuyết phục và dễ kiểm chứng.</p>
<p>Luyện tập thêm: nghe một người so sánh ba món đồ rồi tự xếp thứ tự bằng ký hiệu A &gt; B &gt; C. Cách này bắt bạn phải nghe chiều so sánh thay vì chỉ nghe tên đồ vật.</p>`],
    d: [[`A`, `这两部手机，你觉得哪个好？`, `Zhè liǎng bù shǒujī, nǐ juéde nǎ ge hǎo?`, `Of these two phones, which is better?`, `Hai chiếc điện thoại này, bạn thấy cái nào tốt?`], [`B`, `红的比黑的贵三百块，但是没有黑的轻。`, `Hóng de bǐ hēi de guì sān bǎi kuài, dànshì méiyǒu hēi de qīng.`, `The red one is 300 yuan more expensive but not as light.`, `Cái đỏ đắt hơn cái đen 300 tệ nhưng không nhẹ bằng.`], [`A`, `那我买黑的，质量跟红的一样好。`, `Nà wǒ mǎi hēi de, zhìliàng gēn hóng de yíyàng hǎo.`, `Then I will buy the black one; same quality.`, `Vậy mình mua cái đen, chất lượng tốt như nhau.`]],
    pit: [`Saying 比…很… or forgetting the direction of 没有. Check the subject: the first noun is the one who is less.`, `Nói 比…很… hoặc quên chiều của 没有. Kiểm chủ ngữ: danh từ đầu là bên kém hơn.`],
    s: [[`比 (than), 没有 (not as), 一样 (same), 更/最.`, `比 (hơn), 没有 (không bằng), 一样 (như nhau), 更/最.`], [`No 很 after 比; use 还/更.`, `Không dùng 很 sau 比; dùng 还/更.`], [`Write A > B in notes to avoid reversals.`, `Ghi A > B để tránh đảo chiều.`]],
    l: ['cmp', 'gram', 'wikib'],
    p: [[`In the dialogue, which phone is lighter?`, `Trong hội thoại, điện thoại nào nhẹ hơn?`, `The black one.`, `Cái đen.`], [`Translate: He is 5 cm taller than me.`, `Dịch: Anh ấy cao hơn tôi 5 cm.`, `他比我高五厘米。`, `他比我高五厘米。`]]
  }),
  D(P + '3-4', '3.4 Giving opinions, agreeing and disagreeing', '3.4 Nêu ý kiến, đồng ý và phản đối',
    'Cấu trúc nêu quan điểm, đồng ý một phần, phản đối lịch sự; thảo luận 3 câu có lý do.', {
    n: '3.4',
    g: [[`State an opinion with a reason`, `Nêu ý kiến kèm lý do`], [`Agree and disagree politely`, `Đồng ý và phản đối lịch sự`]],
    b: [`<p>Opinion frame: <strong>opinion + reason + example</strong>. Openers: 「我觉得 wǒ juéde」 (I feel), 「我认为 wǒ rènwéi」 (I think; more formal), 「在我看来 zài wǒ kànlái」 (in my view), 「依我看」 (as I see it). Reason: 「因为…」, example: 「比如 bǐrú…」, 「例如」.</p>
<p>Agree: 「我同意 wǒ tóngyì」, 「你说得对 nǐ shuō de duì」, 「我也这么想」. Partly agree: 「你说得有道理，不过…」 (you have a point, however…), 「我同意一半」. Disagree politely: 「我的看法不太一样」 (my view is a bit different), 「我不太同意」, 「也许吧，可是…」. Avoid a bare 「不对」 to a teacher or an elder.</p>
<p>Turn-taking: ask the other person: 「你呢？你怎么看？」 and respond to their point first before giving yours — a sign of good listening. Use fillers sparingly: 「这个嘛…」, 「怎么说呢…」 buy thinking time.</p>
<p>In tests, opinion sentences contain strength markers: 「非常」, 「一点儿也不」, 「完全」, 「有点儿」. Hear the degree: 「我不太同意」 (partly disagree) is weaker than 「我完全不同意」.</p>`,
       `<p>Khung nêu ý kiến: <strong>ý kiến + lý do + ví dụ</strong>. Mở đầu: 「我觉得 wǒ juéde」 (tôi thấy), 「我认为 wǒ rènwéi」 (tôi cho rằng; trang trọng hơn), 「在我看来 zài wǒ kànlái」 (theo tôi), 「依我看」. Lý do: 「因为…」, ví dụ: 「比如 bǐrú…」, 「例如」.</p>
<p>Đồng ý: 「我同意 wǒ tóngyì」, 「你说得对 nǐ shuō de duì」, 「我也这么想」. Đồng ý một phần: 「你说得有道理，不过…」 (bạn nói có lý, tuy nhiên…), 「我同意一半」. Phản đối lịch sự: 「我的看法不太一样」 (cách nhìn của tôi hơi khác), 「我不太同意」, 「也许吧，可是…」. Tránh nói trống không 「不对」 với thầy cô hay người lớn.</p>
<p>Luân phiên lượt nói: hỏi lại người kia: 「你呢？你怎么看？」 và đáp ý của họ trước rồi mới nêu ý mình — dấu hiệu của người biết lắng nghe. Dùng từ đệm vừa phải: 「这个嘛…」, 「怎么说呢…」 giúp có thời gian nghĩ.</p>
<p>Trong bài thi, câu ý kiến chứa từ chỉ mức độ: 「非常」, 「一点儿也不」, 「完全」, 「有点儿」. Hãy nghe mức: 「我不太同意」 (phản đối một phần) nhẹ hơn 「我完全不同意」.</p>`],
    v: [[`觉得`, `juéde`, `feel / think`, `cảm thấy`], [`认为`, `rènwéi`, `consider`, `cho rằng`], [`同意`, `tóngyì`, `agree`, `đồng ý`], [`有道理`, `yǒu dàolǐ`, `reasonable`, `có lý`], [`看法`, `kànfǎ`, `view`, `quan điểm`], [`比如`, `bǐrú`, `for example`, `ví dụ`]],
    d: [[`A`, `我觉得大学生应该打工，因为可以学到很多东西。`, `Wǒ juéde dàxuéshēng yīnggāi dǎgōng, yīnwèi kěyǐ xuédào hěn duō dōngxi.`, `I think students should work part time, because they learn a lot.`, `Mình thấy sinh viên nên làm thêm vì học được nhiều thứ.`], [`B`, `你说得有道理，不过我担心影响学习。`, `Nǐ shuō de yǒu dàolǐ, búguò wǒ dānxīn yǐngxiǎng xuéxí.`, `You have a point, but I worry it hurts studies.`, `Bạn nói có lý, nhưng mình lo ảnh hưởng việc học.`], [`A`, `那每周只做十个小时，怎么样？`, `Nà měi zhōu zhǐ zuò shí ge xiǎoshí, zěnmeyàng?`, `Then only ten hours a week?`, `Vậy mỗi tuần chỉ làm mười tiếng thì sao?`]],
    pit: [`Giving an opinion with no reason sounds abrupt. Always add 因为 or 比如.`, `Nêu ý kiến không kèm lý do nghe cộc lốc. Luôn thêm 因为 hoặc 比如.`],
    s: [[`Opinion + reason + example.`, `Ý kiến + lý do + ví dụ.`], [`Partly agree with 有道理，不过…`, `Đồng ý một phần với 有道理，不过…`], [`Hear the degree words: 不太 vs 完全不.`, `Nghe từ chỉ mức: 不太 so với 完全不.`]],
    l: ['debate', 'speak', 'yoyo'],
    p: [[`Give your opinion on «learning Chinese is useful» with a reason.`, `Nêu ý kiến về «học tiếng Trung hữu ích» kèm lý do.`, `我觉得学汉语很有用，因为可以找到更好的工作。`, `我觉得学汉语很有用，因为可以找到更好的工作。`], [`Which is weaker: 我不太同意 or 我完全不同意?`, `Câu nào nhẹ hơn: 我不太同意 hay 我完全不同意?`, `我不太同意.`, `我不太同意.`]]
  }),
  Q(P + 'quiz-3', 'Quiz — Chapter 3', 'Quiz — Chương 3', [
    [[`Which verb goes with 眼镜?`, `Động từ nào đi với 眼镜?`], [`戴`, `穿`, `吃`, `看`], 0, [`戴 is for glasses/hats.`, `戴 dùng cho kính/mũ.`]],
    [[`Order for describing a person`, `Thứ tự miêu tả người`], [`build → looks → clothes → personality`, `personality only`, `clothes only`, `colour only`], 0, [`This is the natural order.`, `Đây là thứ tự tự nhiên.`]],
    [[`听懂 means`, `听懂 nghĩa là`], [`understand by listening`, `see`, `buy`, `forget`], 0, [`懂 = understand.`, `懂 = hiểu.`]],
    [[`The announcement «别忘了带学生证» tells you to`, `Thông báo «别忘了带学生证» bảo bạn`], [`bring the student card`, `leave it`, `buy a card`, `lose it`], 0, [`别忘了 = don't forget.`, `别忘了 = đừng quên.`]],
    [[`Correct comparison`, `Câu so sánh đúng`], [`他比我高`, `他比我很高`, `他比我是高`, `他比我高很`], 0, [`No 很 after 比.`, `Không dùng 很 sau 比.`]],
    [[`我没有他高 means`, `我没有他高 nghĩa là`], [`I am shorter than him`, `I am taller`, `same`, `I have him`], 0, [`没有 = not as.`, `没有 = không bằng.`]],
    [[`Opinion opener (formal)`, `Câu mở ý kiến (trang trọng)`], [`我认为`, `你好`, `再见`, `谢谢`], 0, [`认为 = consider.`, `认为 = cho rằng.`]],
    [[`A polite partial disagreement`, `Phản đối một phần lịch sự`], [`你说得有道理，不过…`, `不对！`, `闭嘴`, `没意思`], 0, [`It acknowledges the point first.`, `Nó ghi nhận ý bên kia trước.`]],
    [[`比如 introduces`, `比如 dẫn vào`], [`an example`, `a question`, `a negation`, `a number`], 0, [`比如 = for example.`, `比如 = ví dụ.`]],
  ]),
]));

// ===== Chương 4 =====
secs.push(SEC('Chapter 4 — Experiences and narrating events', 'Chương 4 — Trải nghiệm và kể lại sự việc',
  'Phân biệt 过, 了, 着; thời lượng và tần suất; kể chuyện có trình tự; nghe 把 và 被.', [
  D(P + '4-1', '4.1 过, 了 and 着: experience, completion, state', '4.1 过, 了 và 着: trải nghiệm, hoàn thành, trạng thái',
    'Ba trợ từ thể hay nhầm; nghe để biết sự việc đã xảy ra hay đang diễn ra.', {
    n: '4.1',
    g: [[`Hear the difference between 过, 了 and 着`, `Nghe ra khác biệt giữa 过, 了 và 着`], [`Tell a past experience in 4–5 sentences`, `Kể một trải nghiệm quá khứ trong 4–5 câu`]],
    b: [`<p>Three small words change when the action happened.</p>
<ul><li><strong>V + 过 guo</strong>: experience at some time in life. 「我去过北京。」 I have been to Beijing. Negative: 「没去过」. Typical question: 「你吃过北京烤鸭吗？」</li>
<li><strong>V + 了 le</strong>: completion of one event. 「我昨天去了北京。」 I went to Beijing yesterday. Negative: 「没去」 (no 了).</li>
<li><strong>V + 着 zhe</strong>: ongoing state. 「门开着。」 The door is open. 「他穿着红衣服。」</li></ul>
<p>Compare: 「我看了那个电影」 (I watched it — one event, maybe yesterday) vs 「我看过那个电影」 (I have seen it — an experience, so I know it). In an interview or friendly small talk, 过 answers «Have you ever…?». Add 「一次 yí cì」 or 「两次」 for number of times: 「我去过两次」.</p>
<p>Another listening trap: sentence-final 了 (「下雨了」) means change of situation (it started raining), different from verb 了. Ask: is this a completed action, a new situation or an experience? Notes: ✓ done, new, ever.</p>
<p>To speak, practise question–answer pairs: 「你去过中国吗？」 「去过，去年去的。」 Then add 是…的 to give details: 「是和朋友一起去的。」</p>`,
       `<p>Ba từ nhỏ thay đổi thời điểm của hành động.</p>
<ul><li><strong>V + 过 guo</strong>: từng có trải nghiệm. 「我去过北京。」 Tôi đã từng đến Bắc Kinh. Phủ định: 「没去过」. Câu hỏi điển hình: 「你吃过北京烤鸭吗？」</li>
<li><strong>V + 了 le</strong>: hoàn thành một sự việc. 「我昨天去了北京。」 Hôm qua tôi đã đến Bắc Kinh. Phủ định: 「没去」 (không có 了).</li>
<li><strong>V + 着 zhe</strong>: trạng thái đang tiếp diễn. 「门开着。」 Cửa đang mở. 「他穿着红衣服。」</li></ul>
<p>So sánh: 「我看了那个电影」 (tôi đã xem — một sự việc, có thể hôm qua) với 「我看过那个电影」 (tôi từng xem — trải nghiệm nên tôi biết). Khi phỏng vấn hoặc nói chuyện thân mật, 过 trả lời câu «Bạn đã bao giờ… chưa?». Thêm 「一次 yí cì」 hay 「两次」 để chỉ số lần: 「我去过两次」.</p>
<p>Một bẫy nghe khác: 了 cuối câu (「下雨了」) nghĩa là tình huống thay đổi (trời bắt đầu mưa), khác với 了 sau động từ. Hãy tự hỏi: đây là hành động đã xong, tình huống mới hay trải nghiệm? Ghi chú: ✓ xong, mới, từng.</p>
<p>Khi nói, hãy luyện cặp hỏi–đáp: 「你去过中国吗？」 「去过，去年去的。」 Rồi thêm 是…的 để nêu chi tiết: 「是和朋友一起去的。」</p>`],
    v: [[`过`, `guo`, `have (done) before`, `đã từng`], [`了`, `le`, `completed / change`, `đã xong / thay đổi`], [`着`, `zhe`, `ongoing state`, `đang ở trạng thái`], [`烤鸭`, `kǎoyā`, `roast duck`, `vịt quay`], [`一次`, `yí cì`, `once`, `một lần`], [`去年`, `qùnián`, `last year`, `năm ngoái`]],
    d: [[`A`, `你去过上海吗？`, `Nǐ qùguo Shànghǎi ma?`, `Have you been to Shanghai?`, `Bạn từng đến Thượng Hải chưa?`], [`B`, `去过一次，去年夏天去的。`, `Qùguo yí cì, qùnián xiàtiān qù de.`, `Once, last summer.`, `Một lần, mùa hè năm ngoái.`], [`A`, `你吃了小笼包吗？`, `Nǐ chī le xiǎolóngbāo ma?`, `Did you eat xiaolongbao?`, `Bạn có ăn tiểu long bao không?`], [`B`, `吃了，还吃了很多别的菜。`, `Chī le, hái chī le hěn duō bié de cài.`, `Yes, and lots of other dishes.`, `Có, còn ăn nhiều món khác.`]],
    pit: [`Adding 了 to every past sentence, including the negative (✗ 我没去了). Remember: 没 + verb, no 了.`, `Thêm 了 vào mọi câu quá khứ, kể cả phủ định (✗ 我没去了). Nhớ: 没 + động từ, không có 了.`],
    s: [[`过 = experience; 了 = completed event; 着 = state.`, `过 = trải nghiệm; 了 = hoàn thành; 着 = trạng thái.`], [`Negative of 过 and 了: 没(有).`, `Phủ định của 过 và 了: 没(有).`], [`Add 一次/两次 for the number of times.`, `Thêm 一次/两次 để nói số lần.`]],
    l: ['gram', 'part', 'coursera'],
    p: [[`Which one says «I have eaten roast duck before»?`, `Câu nào là «Tôi từng ăn vịt quay»?`, `我吃过烤鸭。`, `我吃过烤鸭。`], [`Make the negative of 我去了北京.`, `Đặt phủ định của 我去了北京.`, `我没去北京。`, `我没去北京。`]]
  }),
  D(P + '4-2', '4.2 How long and how often: duration and frequency', '4.2 Bao lâu và bao nhiêu lần: thời lượng và tần suất',
    'Vị trí của thời lượng sau động từ, các từ tần suất, nghe số lần và khoảng thời gian.', {
    n: '4.2',
    g: [[`Place a duration after the verb correctly`, `Đặt thời lượng sau động từ đúng chỗ`], [`Catch frequency words in listening`, `Bắt từ tần suất khi nghe`]],
    b: [`<p>A duration (how long) goes <strong>after the verb</strong>: 「我学了两年汉语。」 I have studied Chinese for two years. With an object, repeat the verb: 「我学汉语学了两年」 or put the duration before the object with 的: 「我学了两年的汉语」. The sentence-final 了 means «up to now»: 「我学汉语学了两年了」 is a long, ongoing stretch.</p>
<p>Frequency (how often): 「每天 měitiān」, 「每周」, 「经常 jīngcháng」 (often), 「常常」, 「有时候 yǒushíhou」 (sometimes), 「很少」 (rarely), 「从来不 cónglái bù」 (never, habitually), 「一个星期三次」 (three times a week). Times: 「看了三次」 (watched three times). Adverbs of frequency go before the verb; durations and times-of-occurrence after it.</p>
<p>Listening: the question often asks «how long» (「多长时间 duō cháng shíjiān」, 「多久 duō jiǔ」) or «how many times» (「几次」). Be careful: 「一个半小时」 (1.5 hours), 「半个小时」 (half an hour), 「一刻钟」 (15 minutes). Separate the point in time (「七点」) from the duration (「七个小时」): 点 versus 个小时.</p>
<p>Speaking practice: describe your routine with frequency and duration: 「我每天晚上练一个小时的发音。」</p>`,
       `<p>Thời lượng (bao lâu) đặt <strong>sau động từ</strong>: 「我学了两年汉语。」 Tôi đã học tiếng Trung hai năm. Khi có tân ngữ, lặp động từ: 「我学汉语学了两年」 hoặc đặt thời lượng trước tân ngữ kèm 的: 「我学了两年的汉语」. 了 cuối câu nghĩa là «đến giờ»: 「我学汉语学了两年了」 là khoảng thời gian dài, còn tiếp diễn.</p>
<p>Tần suất (bao nhiêu lần): 「每天 měitiān」, 「每周」, 「经常 jīngcháng」 (thường), 「常常」, 「有时候 yǒushíhou」 (thỉnh thoảng), 「很少」 (hiếm), 「从来不 cónglái bù」 (không bao giờ, theo thói quen), 「一个星期三次」 (một tuần ba lần). Số lần: 「看了三次」. Phó từ tần suất đặt trước động từ; thời lượng và số lần đặt sau.</p>
<p>Khi nghe, câu hỏi hay hỏi «bao lâu» (「多长时间 duō cháng shíjiān」, 「多久 duō jiǔ」) hoặc «mấy lần» (「几次」). Cẩn thận: 「一个半小时」 (1,5 giờ), 「半个小时」 (nửa tiếng), 「一刻钟」 (15 phút). Tách thời điểm (「七点」) và thời lượng (「七个小时」): 点 so với 个小时.</p>
<p>Luyện nói: miêu tả thói quen bằng tần suất và thời lượng: 「我每天晚上练一个小时的发音。」</p>`],
    v: [[`经常`, `jīngcháng`, `often`, `thường xuyên`], [`有时候`, `yǒushíhou`, `sometimes`, `thỉnh thoảng`], [`很少`, `hěn shǎo`, `seldom`, `hiếm khi`], [`从来不`, `cónglái bù`, `never`, `chẳng bao giờ`], [`多久`, `duō jiǔ`, `how long`, `bao lâu`], [`一刻钟`, `yí kèzhōng`, `15 minutes`, `15 phút`]],
    d: [[`A`, `你每天锻炼多长时间？`, `Nǐ měitiān duànliàn duō cháng shíjiān?`, `How long do you exercise each day?`, `Mỗi ngày bạn tập bao lâu?`], [`B`, `一个半小时，一个星期去四次健身房。`, `Yí ge bàn xiǎoshí, yí ge xīngqī qù sì cì jiànshēnfáng.`, `One and a half hours, four times a week at the gym.`, `Một tiếng rưỡi, một tuần đi phòng gym bốn lần.`], [`A`, `你学汉语学了多久了？`, `Nǐ xué Hànyǔ xué le duō jiǔ le?`, `How long have you studied Chinese?`, `Bạn học tiếng Trung được bao lâu rồi?`], [`B`, `快两年了。`, `Kuài liǎng nián le.`, `Almost two years.`, `Sắp hai năm rồi.`]],
    pit: [`Putting the duration before the verb (✗ 我两年学汉语). Duration follows the verb.`, `Đặt thời lượng trước động từ (✗ 我两年学汉语). Thời lượng đứng sau động từ.`],
    s: [[`Duration after the verb; repeat the verb with an object.`, `Thời lượng sau động từ; có tân ngữ thì lặp động từ.`], [`Frequency adverbs go before the verb.`, `Phó từ tần suất trước động từ.`], [`Distinguish 点 (clock time) from 个小时 (duration).`, `Phân biệt 点 (giờ) và 个小时 (thời lượng).`]],
    l: ['gram', 'part', 'hello'],
    p: [[`Say «I have lived here for three years».`, `Nói «Tôi đã sống ở đây ba năm».`, `我在这儿住了三年。`, `我在这儿住了三年。`], [`How long is 一个半小时?`, `一个半小时 dài bao lâu?`, `1.5 hours.`, `1,5 giờ.`]]
  }),
  D(P + '4-3', '4.3 Telling a short story in order', '4.3 Kể một câu chuyện ngắn theo trình tự',
    'Từ nối trình tự (首先, 然后, 后来, 结果, 最后), khung mở–diễn–kết và bài kể mẫu.', {
    n: '4.3',
    g: [[`Retell an event in 6–8 sentences`, `Kể lại một sự việc trong 6–8 câu`], [`Follow the time order when listening`, `Theo dõi thứ tự thời gian khi nghe`]],
    b: [`<p>A short story has a frame: <strong>setting – problem – action – result – feeling</strong>. Sequence markers help the listener: 「首先 shǒuxiān」 (first), 「然后 ránhòu」 (then), 「接着 jiēzhe」 (next), 「后来 hòulái」 (later, in a past story only), 「结果 jiéguǒ」 (as a result), 「最后 zuìhòu」 (finally), 「没想到 méi xiǎngdào」 (unexpectedly).</p>
<p>Open with time and place: 「上个周末，我和朋友去爬山。」 Add a problem: 「没想到，下起了大雨。」 State the action: 「我们只好跑到一个小店里躲雨。」 Close with the result and a feeling: 「结果我们在小店里聊了两个小时，觉得特别有意思。」 Notice 「只好 zhǐhǎo」 (had no choice but), 「下起 xiàqǐ」 (start to fall, a directional complement).</p>
<p>When listening to a story, track the timeline in notes: T1 → T2 → T3, and the emotion at the end. Test questions often ask for <em>the reason of the change</em> («Why did they stay in the shop?») or <em>the final result</em>.</p>
<p>When speaking, keep each sentence short (one idea) and connect with the markers above. Avoid repeating 然后 five times: replace with 接着, 后来, 之后.</p>`,
       `<p>Một câu chuyện ngắn có khung: <strong>bối cảnh – vấn đề – hành động – kết quả – cảm xúc</strong>. Từ chỉ trình tự giúp người nghe: 「首先 shǒuxiān」 (trước hết), 「然后 ránhòu」 (rồi), 「接着 jiēzhe」 (tiếp theo), 「后来 hòulái」 (về sau, chỉ dùng cho chuyện quá khứ), 「结果 jiéguǒ」 (kết quả là), 「最后 zuìhòu」 (cuối cùng), 「没想到 méi xiǎngdào」 (không ngờ).</p>
<p>Mở bằng thời gian và nơi chốn: 「上个周末，我和朋友去爬山。」 Thêm vấn đề: 「没想到，下起了大雨。」 Nêu hành động: 「我们只好跑到一个小店里躲雨。」 Kết bằng kết quả và cảm xúc: 「结果我们在小店里聊了两个小时，觉得特别有意思。」 Chú ý 「只好 zhǐhǎo」 (đành phải), 「下起 xiàqǐ」 (bắt đầu rơi, bổ ngữ xu hướng).</p>
<p>Khi nghe chuyện, hãy theo dõi dòng thời gian trong ghi chú: T1 → T2 → T3, và cảm xúc ở cuối. Câu hỏi thi hay hỏi <em>nguyên nhân của sự thay đổi</em> («Vì sao họ ở lại quán?») hoặc <em>kết quả cuối</em>.</p>
<p>Khi nói, giữ mỗi câu ngắn (một ý) và nối bằng các từ trên. Tránh lặp 然后 năm lần: thay bằng 接着, 后来, 之后.</p>`],
    v: [[`首先`, `shǒuxiān`, `first`, `trước hết`], [`接着`, `jiēzhe`, `next`, `tiếp theo`], [`结果`, `jiéguǒ`, `as a result`, `kết quả là`], [`只好`, `zhǐhǎo`, `have no choice but`, `đành phải`], [`没想到`, `méi xiǎngdào`, `unexpectedly`, `không ngờ`], [`躲雨`, `duǒ yǔ`, `shelter from rain`, `trú mưa`]],
    d: [[`A`, `上周末你去哪儿了？`, `Shàng zhōumò nǐ qù nǎr le?`, `Where did you go last weekend?`, `Cuối tuần trước bạn đi đâu?`], [`B`, `我和朋友去爬山了，没想到下起了大雨。`, `Wǒ hé péngyou qù páshān le, méi xiǎngdào xiàqǐ le dàyǔ.`, `Hiking with a friend; unexpectedly it rained heavily.`, `Mình đi leo núi với bạn, không ngờ trời mưa to.`], [`A`, `那你们怎么办？`, `Nà nǐmen zěnme bàn?`, `So what did you do?`, `Vậy các bạn làm thế nào?`], [`B`, `只好躲在一个小店里，结果认识了很有意思的老板。`, `Zhǐhǎo duǒ zài yí ge xiǎodiàn lǐ, jiéguǒ rènshi le hěn yǒu yìsi de lǎobǎn.`, `We sheltered in a shop and met an interesting owner.`, `Đành trú trong một quán nhỏ, kết quả quen được ông chủ rất thú vị.`]],
    pit: [`Using 后来 for a future plan (✗ 后来我要去). 后来 is only for past stories; use 以后 for the future.`, `Dùng 后来 cho kế hoạch tương lai (✗ 后来我要去). 后来 chỉ dùng cho chuyện đã qua; tương lai dùng 以后.`],
    s: [[`Frame: setting, problem, action, result, feeling.`, `Khung: bối cảnh, vấn đề, hành động, kết quả, cảm xúc.`], [`Markers: 首先, 然后, 接着, 结果, 最后.`, `Từ nối: 首先, 然后, 接着, 结果, 最后.`], [`Short sentences, varied connectors.`, `Câu ngắn, từ nối đa dạng.`]],
    l: ['disc', 'speak', 'pod'],
    p: [[`Why did they stay in the shop?`, `Vì sao họ ở trong quán?`, `Because of heavy rain.`, `Vì trời mưa to.`], [`Is 后来 right in «___我要去中国»?`, `后来 có đúng trong «___我要去中国» không?`, `No; use 以后 for the future.`, `Không; dùng 以后 cho tương lai.`]]
  }),
  D(P + '4-4', '4.4 Hearing 把 and 被 sentences', '4.4 Nghe câu 把 và 被',
    'Cấu trúc 把 và 被 hay gặp trong khẩu ngữ; cách nghe xem ai tác động lên cái gì.', {
    n: '4.4',
    g: [[`Understand who did what to what in 把/被 sentences`, `Hiểu ai làm gì với cái gì trong câu 把/被`], [`Produce 3 simple 把 sentences`, `Đặt 3 câu 把 đơn giản`]],
    b: [`<p>The 把 sentence moves the object before the verb to say <em>what happens to it</em>: 「我把作业做完了。」 I finished the homework. The pattern: <strong>Subject + 把 + object + verb + result</strong>. The verb must have something after it (a result 完, 好, 到, 在, 给, or 了). 「把门关上」 (close the door), 「把书放在桌子上」 (put the book on the table), 「把钱给他」 (give him the money).</p>
<p>The 被 sentence is passive: <strong>object + 被 + doer + verb + result</strong>. 「我的手机被朋友借走了。」 My phone was borrowed by a friend. In speech the doer may be dropped: 「我的自行车被偷了。」 Often 被 reports unwelcome events. 「让 / 叫」 also mark the doer in colloquial speech: 「杯子让他打破了」.</p>
<p>Listening strategy: with 把, the noun right after 把 is the thing affected — it is what the question usually asks («Where is the book?» «What was finished?»). With 被, the noun before it is affected; after it comes the doer. Draw: A 把 B → B changes; B 被 A → B changes.</p>
<p>Speaking: use 把 for instructions: 「请把窗户打开」, 「你把地址发给我」.</p>`,
       `<p>Câu 把 đưa tân ngữ lên trước động từ để nói <em>điều xảy ra với nó</em>: 「我把作业做完了。」 Tôi làm xong bài tập. Mẫu: <strong>Chủ ngữ + 把 + tân ngữ + động từ + kết quả</strong>. Động từ phải có thành phần theo sau (kết quả 完, 好, 到, 在, 给 hoặc 了). 「把门关上」 (đóng cửa), 「把书放在桌子上」 (đặt sách lên bàn), 「把钱给他」 (đưa tiền cho anh ấy).</p>
<p>Câu 被 là bị động: <strong>tân ngữ + 被 + người làm + động từ + kết quả</strong>. 「我的手机被朋友借走了。」 Điện thoại của tôi bị bạn mượn đi. Trong khẩu ngữ có thể bỏ người làm: 「我的自行车被偷了。」 被 thường kể chuyện không mong muốn. 「让 / 叫」 cũng đánh dấu người làm trong khẩu ngữ: 「杯子让他打破了」.</p>
<p>Chiến lược nghe: với 把, danh từ ngay sau 把 là thứ bị tác động — thường là điều câu hỏi hỏi («Sách ở đâu?» «Cái gì đã xong?»). Với 被, danh từ đứng trước là thứ bị tác động; sau đó là người làm. Vẽ: A 把 B → B thay đổi; B 被 A → B thay đổi.</p>
<p>Khi nói, dùng 把 để chỉ dẫn: 「请把窗户打开」, 「你把地址发给我」.</p>`],
    pt: [[`把 + O + V + result`, `bǎ`, `deal with O: 把书放在桌子上`, `xử lý O: 把书放在桌子上`], [`O + 被 + doer + V`, `bèi`, `passive: 手机被借走了`, `bị động: 手机被借走了`], [`让 / 叫`, `ràng / jiào`, `colloquial passive marker`, `dấu bị động khẩu ngữ`]],
    d: [[`A`, `我的伞呢？我记得放在门口了。`, `Wǒ de sǎn ne? Wǒ jìde fàng zài ménkǒu le.`, `Where is my umbrella? I remember leaving it at the door.`, `Ô của mình đâu? Mình nhớ để ở cửa.`], [`B`, `被小李拿走了，他说下午就把伞还给你。`, `Bèi Xiǎo Lǐ ná zǒu le, tā shuō xiàwǔ jiù bǎ sǎn huán gěi nǐ.`, `Xiao Li took it; he says he'll return it this afternoon.`, `Tiểu Lý lấy đi rồi, anh ấy nói chiều sẽ trả lại.`]],
    pit: [`Using 把 with verbs that cannot "handle" an object (✗ 我把电影喜欢). Use 把 only when the verb changes or moves the object.`, `Dùng 把 với động từ không tác động lên tân ngữ (✗ 我把电影喜欢). Chỉ dùng 把 khi động từ làm thay đổi hoặc di chuyển tân ngữ.`],
    s: [[`把: object before verb, verb needs a result.`, `把: tân ngữ trước động từ, động từ cần kết quả.`], [`被: affected noun first, doer after 被.`, `被: danh từ bị tác động đứng trước, người làm sau 被.`], [`Listen for what changed or moved.`, `Nghe xem cái gì đã đổi hay di chuyển.`]],
    l: ['ba', 'gram', 'wikib'],
    p: [[`Rewrite with 把: 我做完了作业。`, `Viết lại với 把: 我做完了作业。`, `我把作业做完了。`, `我把作业做完了。`], [`In the dialogue, who has the umbrella now?`, `Trong hội thoại, ai đang giữ cái ô?`, `Xiao Li.`, `Tiểu Lý.`]]
  }),
  Q(P + 'quiz-4', 'Quiz — Chapter 4', 'Quiz — Chương 4', [
    [[`Which particle shows life experience?`, `Trợ từ nào chỉ trải nghiệm?`], [`过`, `了`, `着`, `吗`], 0, [`V + 过 = have done.`, `V + 过 = đã từng.`]],
    [[`Negative of 我吃了: `, `Phủ định của 我吃了: `], [`我没吃`, `我没吃了`, `我不吃了了`, `我吃没了`], 0, [`没 replaces 了.`, `没 thay cho 了.`]],
    [[`门开着 means`, `门开着 nghĩa là`], [`the door is open (state)`, `I opened it once`, `never open`, `open tomorrow`], 0, [`着 = ongoing state.`, `着 = trạng thái.`]],
    [[`Where does the duration go?`, `Thời lượng đặt ở đâu?`], [`after the verb`, `before the subject`, `at the end only`, `nowhere`], 0, [`我学了两年。`, `我学了两年。`]],
    [[`一个半小时 is`, `一个半小时 là`], [`1.5 hours`, `15 minutes`, `half a day`, `1 hour`], 0, [`半 = half.`, `半 = một nửa.`]],
    [[`Which marks a story's result?`, `Từ nào đánh dấu kết quả của chuyện?`], [`结果`, `首先`, `请`, `吗`], 0, [`结果 = as a result.`, `结果 = kết quả là.`]],
    [[`后来 is used for`, `后来 dùng cho`], [`past stories`, `future plans`, `questions`, `numbers`], 0, [`Only for the past.`, `Chỉ cho quá khứ.`]],
    [[`In 我把作业做完了, the thing affected is`, `Trong 我把作业做完了, thứ bị tác động là`], [`作业`, `我`, `完`, `了`], 0, [`The noun after 把.`, `Danh từ sau 把.`]],
    [[`我的手机被偷了 means`, `我的手机被偷了 nghĩa là`], [`my phone was stolen`, `I stole a phone`, `I bought a phone`, `phone is new`], 0, [`被 = passive.`, `被 = bị động.`]],
  ]),
]));

// ===== Chương 5 =====
secs.push(SEC('Chapter 5 — Health and the doctor', 'Chương 5 — Sức khoẻ và đi khám bệnh',
  'Triệu chứng, nhập vai bác sĩ–bệnh nhân, lời khuyên và thói quen lành mạnh.', [
  D(P + '5-1', '5.1 Body and symptoms', '5.1 Cơ thể và triệu chứng',
    'Từ vựng bộ phận cơ thể và triệu chứng thường gặp; nghe lời kể về bệnh.', {
    n: '5.1',
    g: [[`Name common body parts and symptoms`, `Gọi tên bộ phận cơ thể và triệu chứng thường gặp`], [`Describe how long and how badly it hurts`, `Miêu tả bị bao lâu và đau ra sao`]],
    b: [`<p>Basic body words: 「头 tóu」, 「眼睛」, 「耳朵」, 「鼻子」, 「嘴」, 「牙」, 「喉咙 hóulóng」 (throat), 「肚子 dùzi」 (belly), 「胃 wèi」 (stomach), 「手」, 「腿」, 「脚」, 「背 bèi」 (back). Symptoms: 「头疼 tóu téng」, 「发烧 fāshāo」 (fever), 「咳嗽 késou」 (cough), 「流鼻涕 liú bítì」 (runny nose), 「拉肚子 lā dùzi」 (diarrhea), 「过敏 guòmǐn」 (allergy), 「没力气」.</p>
<p>Pattern: <strong>body part + symptom</strong> (「我头疼」, 「他肚子疼」, 「我喉咙疼」). Duration after the verb: 「我发烧发了两天了」. Degree: 「有点儿疼」, 「很疼」, 「疼得厉害 lìhai」, 「疼得睡不着」. Cause: 「可能是吃坏了东西」 (maybe food poisoning), 「感冒了 gǎnmào le」.</p>
<p>Listening tip: a patient describes (1) what hurts, (2) since when, (3) how bad, (4) what else. Make a 4-slot note. Numbers matter: 「三十八度五」 (38.5 °C). Ask about temperature: 「量体温 liáng tǐwēn」.</p>
<p>Speaking: describe without panic: 「我从昨天晚上开始头疼，还有点儿发烧。」 Use 「从…开始 cóng… kāishǐ」 for the start time.</p>`,
       `<p>Từ cơ bản về cơ thể: 「头 tóu」, 「眼睛」, 「耳朵」, 「鼻子」, 「嘴」, 「牙」, 「喉咙 hóulóng」 (họng), 「肚子 dùzi」 (bụng), 「胃 wèi」 (dạ dày), 「手」, 「腿」, 「脚」, 「背 bèi」 (lưng). Triệu chứng: 「头疼 tóu téng」, 「发烧 fāshāo」 (sốt), 「咳嗽 késou」 (ho), 「流鼻涕 liú bítì」 (sổ mũi), 「拉肚子 lā dùzi」 (tiêu chảy), 「过敏 guòmǐn」 (dị ứng), 「没力气」 (không có sức).</p>
<p>Mẫu: <strong>bộ phận + triệu chứng</strong> (「我头疼」, 「他肚子疼」, 「我喉咙疼」). Thời lượng đặt sau động từ: 「我发烧发了两天了」. Mức độ: 「有点儿疼」, 「很疼」, 「疼得厉害 lìhai」, 「疼得睡不着」. Nguyên nhân: 「可能是吃坏了东西」 (có thể ngộ độc thực phẩm), 「感冒了 gǎnmào le」.</p>
<p>Mẹo nghe: bệnh nhân mô tả (1) đau chỗ nào, (2) từ bao giờ, (3) nặng đến đâu, (4) còn gì nữa. Hãy ghi 4 ô. Số rất quan trọng: 「三十八度五」 (38,5 °C). Hỏi nhiệt độ: 「量体温 liáng tǐwēn」.</p>
<p>Khi nói, mô tả bình tĩnh: 「我从昨天晚上开始头疼，还有点儿发烧。」 Dùng 「从…开始 cóng… kāishǐ」 cho thời điểm bắt đầu.</p>`],
    v: [[`喉咙`, `hóulóng`, `throat`, `cổ họng`], [`发烧`, `fāshāo`, `have a fever`, `sốt`], [`咳嗽`, `késou`, `cough`, `ho`], [`过敏`, `guòmǐn`, `allergy`, `dị ứng`], [`厉害`, `lìhai`, `severe`, `dữ dội`], [`体温`, `tǐwēn`, `body temperature`, `thân nhiệt`]],
    d: [[`A`, `你怎么了？脸色不太好。`, `Nǐ zěnme le? Liǎnsè bú tài hǎo.`, `What's wrong? You look pale.`, `Bạn sao thế? Sắc mặt không tốt.`], [`B`, `我从昨天开始喉咙疼，还咳嗽。`, `Wǒ cóng zuótiān kāishǐ hóulóng téng, hái késou.`, `My throat has hurt since yesterday, and I cough.`, `Từ hôm qua mình đau họng, còn ho nữa.`], [`A`, `发烧了吗？`, `Fāshāo le ma?`, `Any fever?`, `Có sốt không?`], [`B`, `三十七度八，有点儿烧。`, `Sānshíqī dù bā, yǒudiǎnr shāo.`, `37.8, a little.`, `37,8 độ, hơi sốt.`]],
    pit: [`Confusing 疼 (pain) with 痛 or saying 我有头疼 literally. The natural way is 我头疼.`, `Nói 我有头疼 máy móc. Tự nhiên hơn là 我头疼.`],
    s: [[`Body part + symptom: 我头疼.`, `Bộ phận + triệu chứng: 我头疼.`], [`Four slots: what, since when, how bad, other.`, `Bốn ô: gì, từ khi nào, nặng nhẹ, còn gì.`], [`Temperature in degrees: 三十八度五.`, `Nhiệt độ theo độ: 三十八度五.`]],
    l: ['health', 'tcm', 'yoyo'],
    p: [[`Say «I have had a cough for three days».`, `Nói «Tôi ho đã ba ngày».`, `我咳嗽咳了三天了。`, `我咳嗽咳了三天了。`], [`What is 38.5 degrees in Chinese?`, `38,5 độ nói thế nào?`, `三十八度五。`, `三十八度五。`]]
  }),
  D(P + '5-2', '5.2 At the doctor: a role-play', '5.2 Ở chỗ bác sĩ: nhập vai',
    'Quy trình đăng ký–khám–lấy thuốc, câu hỏi của bác sĩ và cách trả lời.', {
    n: '5.2',
    g: [[`Follow a clinic visit step by step`, `Theo dõi một lần khám từng bước`], [`Answer the doctor's standard questions`, `Trả lời các câu hỏi chuẩn của bác sĩ`]],
    b: [`<p>In many Chinese hospitals the steps are: 「挂号 guàhào」 (register) → 「看病 kànbìng」 (see the doctor) → 「检查 jiǎnchá」 (tests) → 「交费 jiāofèi」 (pay) → 「取药 qǔ yào」 (pick up medicine). Registration is often done via a phone app today; the department names are important: 「内科 nèikē」 (internal medicine), 「外科」, 「牙科」, 「发热门诊」 (fever clinic).</p>
<p>The doctor asks: 「哪儿不舒服？ nǎr bù shūfu?」 (What is wrong?) 「什么时候开始的？」 「发烧吗？」 「吃过什么药？」 「对什么药过敏吗？」 「张开嘴，说『啊』」 (open your mouth, say ah). Answers: 「我头疼，已经两天了」 / 「没吃药」 / 「我对青霉素过敏」 (allergic to penicillin).</p>
<p>Instructions you must catch: 「一天三次，一次两片，饭后吃」 (three times a day, two tablets each time, after meals). Write: 3×/day, 2 tablets, after meals. 「多喝水」, 「注意休息」, 「三天后再来」. The doctor may say 「开点儿药」 (prescribe some medicine) and 「开一张假条」 (write a sick note).</p>
<p>Practise in pairs: one plays patient, the other doctor. Patient must give four slots from lesson 5.1; the doctor must give diagnosis, medicine and advice.</p>`,
       `<p>Ở nhiều bệnh viện Trung Quốc các bước là: 「挂号 guàhào」 (đăng ký) → 「看病 kànbìng」 (gặp bác sĩ) → 「检查 jiǎnchá」 (xét nghiệm) → 「交费 jiāofèi」 (thanh toán) → 「取药 qǔ yào」 (lấy thuốc). Ngày nay đăng ký thường qua ứng dụng điện thoại; tên khoa rất quan trọng: 「内科 nèikē」 (nội), 「外科」, 「牙科」, 「发热门诊」 (phòng khám sốt).</p>
<p>Bác sĩ hỏi: 「哪儿不舒服？ nǎr bù shūfu?」 (Bạn thấy khó chịu ở đâu?) 「什么时候开始的？」 「发烧吗？」 「吃过什么药？」 「对什么药过敏吗？」 「张开嘴，说『啊』」 (há miệng, nói «a»). Trả lời: 「我头疼，已经两天了」 / 「没吃药」 / 「我对青霉素过敏」 (dị ứng penicillin).</p>
<p>Chỉ dẫn bạn phải nghe được: 「一天三次，一次两片，饭后吃」 (ngày ba lần, mỗi lần hai viên, sau bữa ăn). Ghi: 3 lần/ngày, 2 viên, sau ăn. 「多喝水」, 「注意休息」, 「三天后再来」. Bác sĩ có thể nói 「开点儿药」 (kê ít thuốc) và 「开一张假条」 (viết giấy nghỉ ốm).</p>
<p>Luyện theo cặp: một người làm bệnh nhân, người kia làm bác sĩ. Bệnh nhân phải nêu bốn ô của bài 5.1; bác sĩ phải nêu chẩn đoán, thuốc và lời dặn.</p>`],
    v: [[`挂号`, `guàhào`, `register`, `đăng ký khám`], [`不舒服`, `bù shūfu`, `unwell`, `khó chịu, không khoẻ`], [`开药`, `kāi yào`, `prescribe`, `kê thuốc`], [`饭后`, `fàn hòu`, `after meals`, `sau bữa ăn`], [`假条`, `jiàtiáo`, `sick note`, `giấy nghỉ`], [`青霉素`, `qīngméisù`, `penicillin`, `penicillin`]],
    d: [[`医生`, `请坐，哪儿不舒服？`, `Qǐng zuò, nǎr bù shūfu?`, `Please sit. What is wrong?`, `Mời ngồi, bạn khó chịu ở đâu?`], [`病人`, `我头疼，还有点儿发烧，两天了。`, `Wǒ tóu téng, hái yǒudiǎnr fāshāo, liǎng tiān le.`, `Headache and slight fever for two days.`, `Tôi đau đầu, hơi sốt, hai ngày rồi.`], [`医生`, `你是感冒了。我给你开点儿药，一天三次，饭后吃。`, `Nǐ shì gǎnmào le. Wǒ gěi nǐ kāi diǎnr yào, yì tiān sān cì, fàn hòu chī.`, `You have a cold. I'll prescribe medicine, three times a day after meals.`, `Bạn bị cảm. Tôi kê ít thuốc, ngày ba lần, sau bữa ăn.`], [`病人`, `要不要请假？`, `Yào bu yào qǐngjià?`, `Should I take leave?`, `Tôi có cần xin nghỉ không?`], [`医生`, `休息两天，多喝水，我给你开假条。`, `Xiūxi liǎng tiān, duō hē shuǐ, wǒ gěi nǐ kāi jiàtiáo.`, `Rest two days, drink water; I'll write a note.`, `Nghỉ hai ngày, uống nhiều nước, tôi viết giấy cho.`]],
    dn: [`Roles: 医生 doctor, 病人 patient.`, `Vai: 医生 bác sĩ, 病人 bệnh nhân.`],
    pit: [`Mixing up 饭前 and 饭后 (before/after meals) changes how you take medicine. Underline the character 前 / 后 in your notes.`, `Nhầm 饭前 và 饭后 (trước/sau ăn) làm thay đổi cách uống thuốc. Hãy gạch chân chữ 前 / 后 trong ghi chú.`],
    s: [[`Steps: 挂号, 看病, 检查, 交费, 取药.`, `Các bước: 挂号, 看病, 检查, 交费, 取药.`], [`Dosage: x times a day, x tablets, before/after meals.`, `Liều: x lần/ngày, x viên, trước/sau ăn.`], [`Tell the doctor about allergies.`, `Báo bác sĩ về dị ứng.`]],
    l: ['health', 'tcm', 'role'],
    p: [[`Write the dosage: 一天两次，一次一片，饭前吃。`, `Viết liều: 一天两次，一次一片，饭前吃。`, `2×/day, 1 tablet, before meals.`, `2 lần/ngày, 1 viên, trước ăn.`], [`How do you say «I am allergic to penicillin»?`, `Nói «Tôi dị ứng penicillin» thế nào?`, `我对青霉素过敏。`, `我对青霉素过敏。`]]
  }),
  D(P + '5-3', '5.3 Advice and healthy habits', '5.3 Lời khuyên và thói quen lành mạnh',
    'Các cách đưa và nhận lời khuyên: 应该, 最好, 别, 要; nghe lời khuyên và tóm tắt.', {
    n: '5.3',
    g: [[`Give advice at three levels of strength`, `Đưa lời khuyên ở ba mức độ`], [`Understand and summarise advice`, `Hiểu và tóm tắt lời khuyên`]],
    b: [`<p>Advice strength, from soft to strong: 「你可以…」 (you could), 「你最好… zuìhǎo」 (you had better), 「你应该… yīnggāi」 (you should), 「你一定要… yídìng yào」 (you must). Negatives: 「别…」, 「不要…」, 「千万别…」 (whatever you do, don't). Add reasons with 「这样… 对身体好」 (this is good for your health).</p>
<p>Healthy habits vocabulary: 「早睡早起」 (sleep early, wake early), 「少吃油腻的」 (eat less greasy food), 「多吃蔬菜水果」, 「每天运动三十分钟」, 「不要熬夜 áoyè」 (stay up late), 「戒烟 jièyān」 (quit smoking), 「压力 yālì」 (stress). Note 「少 + verb」 and 「多 + verb」 as soft commands: 「少喝饮料，多喝水。」</p>
<p>When you listen to a long piece of advice, count items: «three suggestions» (「三个建议」) and mark each with 1, 2, 3. A typical test question: «What does the doctor tell him NOT to do?» — the answer follows 别 or 不要.</p>
<p>When you speak, soften with 「吧」 and 「如果…就…」: 「如果你睡不着，就别看手机了。」 Reply to advice: 「谢谢，我试试」 (thanks, I'll try) or 「好的，我会注意的」 (OK, I will take care).</p>`,
       `<p>Độ mạnh của lời khuyên, từ nhẹ đến mạnh: 「你可以…」 (bạn có thể), 「你最好… zuìhǎo」 (tốt nhất là), 「你应该… yīnggāi」 (bạn nên), 「你一定要… yídìng yào」 (bạn nhất định phải). Phủ định: 「别…」, 「不要…」, 「千万别…」 (tuyệt đối đừng). Thêm lý do bằng 「这样… 对身体好」 (làm vậy tốt cho sức khoẻ).</p>
<p>Từ vựng thói quen lành mạnh: 「早睡早起」, 「少吃油腻的」 (ăn ít đồ dầu mỡ), 「多吃蔬菜水果」, 「每天运动三十分钟」, 「不要熬夜 áoyè」 (thức khuya), 「戒烟 jièyān」 (bỏ thuốc), 「压力 yālì」 (căng thẳng). Chú ý 「少 + động từ」 và 「多 + động từ」 như mệnh lệnh nhẹ: 「少喝饮料，多喝水。」</p>
<p>Khi nghe một chuỗi lời khuyên dài, hãy đếm mục: «ba lời khuyên» (「三个建议」) và đánh số 1, 2, 3. Câu hỏi thi điển hình: «Bác sĩ bảo anh ấy KHÔNG nên làm gì?» — đáp án theo sau 别 hoặc 不要.</p>
<p>Khi nói, làm mềm bằng 「吧」 và 「如果…就…」: 「如果你睡不着，就别看手机了。」 Đáp lại lời khuyên: 「谢谢，我试试」 hoặc 「好的，我会注意的」.</p>`],
    v: [[`最好`, `zuìhǎo`, `had better`, `tốt nhất là`], [`应该`, `yīnggāi`, `should`, `nên`], [`熬夜`, `áoyè`, `stay up late`, `thức khuya`], [`压力`, `yālì`, `pressure / stress`, `áp lực`], [`戒烟`, `jièyān`, `quit smoking`, `bỏ thuốc lá`], [`建议`, `jiànyì`, `suggestion`, `lời khuyên`]],
    d: [[`A`, `我最近总是睡不好，怎么办？`, `Wǒ zuìjìn zǒngshì shuì bu hǎo, zěnme bàn?`, `I haven't been sleeping well; what should I do?`, `Dạo này mình toàn ngủ không ngon, làm sao đây?`], [`B`, `你最好十一点以前睡觉，别熬夜。`, `Nǐ zuìhǎo shíyī diǎn yǐqián shuìjiào, bié áoyè.`, `Better sleep before eleven; don't stay up.`, `Tốt nhất bạn ngủ trước 11 giờ, đừng thức khuya.`], [`A`, `还有呢？`, `Hái yǒu ne?`, `Anything else?`, `Còn gì nữa?`], [`B`, `睡前别喝咖啡，多运动，对睡眠有好处。`, `Shuì qián bié hē kāfēi, duō yùndòng, duì shuìmián yǒu hǎochu.`, `No coffee before bed; exercise more — good for sleep.`, `Trước khi ngủ đừng uống cà phê, vận động nhiều — tốt cho giấc ngủ.`]],
    pit: [`Using 应该 where the situation is a rule or a strict order: 一定要 / 必须 is stronger. In listening, the strength decides whether it is optional.`, `Dùng 应该 khi tình huống là quy định hoặc lệnh nghiêm: 一定要 / 必须 mạnh hơn. Khi nghe, độ mạnh quyết định điều đó có bắt buộc không.`],
    s: [[`Strength: 可以 < 最好 < 应该 < 一定要.`, `Độ mạnh: 可以 < 最好 < 应该 < 一定要.`], [`Negative advice: 别 / 不要 / 千万别.`, `Khuyên đừng: 别 / 不要 / 千万别.`], [`Count items when you hear several suggestions.`, `Đếm mục khi nghe nhiều lời khuyên.`]],
    l: ['health', 'part', 'hello'],
    p: [[`What does B tell A not to do before sleep?`, `B bảo A đừng làm gì trước khi ngủ?`, `Do not drink coffee.`, `Đừng uống cà phê.`], [`Give advice to a friend who has no energy using 最好.`, `Khuyên một người bạn mệt mỏi, dùng 最好.`, `你最好早点儿睡觉。`, `你最好早点儿睡觉。`]]
  }),
  Q(P + 'quiz-5', 'Quiz — Chapter 5', 'Quiz — Chương 5', [
    [[`发烧 means`, `发烧 nghĩa là`], [`have a fever`, `cough`, `allergy`, `back pain`], 0, [`烧 = hot.`, `烧 = nóng.`]],
    [[`Natural way to say «I have a headache»`, `Cách nói tự nhiên «Tôi đau đầu»`], [`我头疼`, `我有头疼`, `头我疼`, `疼头我`], 0, [`Body part + symptom.`, `Bộ phận + triệu chứng.`]],
    [[`The first step in a hospital is`, `Bước đầu ở bệnh viện là`], [`挂号`, `取药`, `交费`, `检查`], 0, [`You register first.`, `Phải đăng ký trước.`]],
    [[`饭后吃 means take`, `饭后吃 nghĩa là uống`], [`after meals`, `before meals`, `at night`, `never`], 0, [`后 = after.`, `后 = sau.`]],
    [[`Which is the strongest advice?`, `Lời khuyên nào mạnh nhất?`], [`一定要`, `可以`, `最好`, `也许`], 0, [`一定要 = must.`, `一定要 = nhất định phải.`]],
    [[`别熬夜 tells you`, `别熬夜 bảo bạn`], [`not to stay up late`, `to stay up`, `to sleep late`, `to drink`], 0, [`别 = don't.`, `别 = đừng.`]],
    [[`三十八度五 is`, `三十八度五 là`], [`38.5 °C`, `35.8 °C`, `58 °C`, `8.5 °C`], 0, [`Read the digits in order.`, `Đọc các chữ số theo thứ tự.`]],
    [[`I am allergic to penicillin:`, `Tôi dị ứng penicillin:`], [`我对青霉素过敏`, `我是青霉素`, `我吃青霉素`, `我买青霉素`], 0, [`对…过敏 = allergic to.`, `对…过敏 = dị ứng với.`]],
    [[`A good reply to advice`, `Cách đáp lời khuyên tốt`], [`谢谢，我会注意的`, `不对`, `你错了`, `没意思`], 0, [`Polite acceptance.`, `Tiếp nhận lịch sự.`]],
  ]),
]));

// ===== Chương 6 =====
secs.push(SEC('Chapter 6 — Travel, hotels and changed plans', 'Chương 6 — Du lịch, khách sạn và kế hoạch thay đổi',
  'Mua vé tàu/máy bay, nhận phòng khách sạn, thời tiết, trễ chuyến và khiếu nại lịch sự.', [
  D(P + '6-1', '6.1 Tickets, stations and airports', '6.1 Vé, nhà ga và sân bay',
    'Mua vé, đọc số hiệu chuyến, loại ghế, thông báo ga; hội thoại ở quầy vé.', {
    n: '6.1',
    g: [[`Buy a ticket and state date, time, seat`, `Mua vé và nêu ngày, giờ, chỗ ngồi`], [`Understand station and airport announcements`, `Hiểu thông báo ở ga và sân bay`]],
    b: [`<p>Vocabulary: 「火车票 huǒchē piào」, 「高铁 gāotiě」 (high-speed train, G trains), 「动车 dòngchē」 (D trains), 「机票」, 「单程 dānchéng」 (one-way), 「往返 wǎngfǎn」 (return), 「靠窗 kào chuāng」 (window seat), 「二等座」 (second class), 「卧铺 wòpù」 (sleeper), 「检票口 jiǎnpiàokǒu」 (ticket gate), 「站台」 (platform), 「登机口」 (boarding gate).</p>
<p>Ask for a ticket: 「我要买一张明天去上海的高铁票，上午的。」 The counter staff will ask: 「几点的？几个人？要什么座位？」 Reply with number + measure word: 「两张，二等座。」 Often you must also show 「身份证 shēnfènzhèng」 or passport: 「请出示护照」. Payment: 「扫码」 or card.</p>
<p>Announcement language: 「前往上海的G7次列车现在开始检票，请到八号检票口。」 Notes: G7 → Shanghai, check-in now, gate 8. Train numbers are read digit by digit (G-seven), «yāo» for 1 in numbers like G1: <em>yāo</em>. Recall tone changes for 七 and 不 from CLS101. Times use 24-hour: 「十四点三十分」 (14:30).</p>
<p>Tip: a delay is announced with 「晚点 wǎndiǎn」: 「晚点二十分钟」. A changed gate: 「改到…」.</p>`,
       `<p>Từ vựng: 「火车票 huǒchē piào」, 「高铁 gāotiě」 (tàu cao tốc, tàu G), 「动车 dòngchē」 (tàu D), 「机票」, 「单程 dānchéng」 (một chiều), 「往返 wǎngfǎn」 (khứ hồi), 「靠窗 kào chuāng」 (ghế cạnh cửa sổ), 「二等座」 (hạng hai), 「卧铺 wòpù」 (giường nằm), 「检票口 jiǎnpiàokǒu」 (cổng soát vé), 「站台」 (sân ga), 「登机口」 (cổng lên máy bay).</p>
<p>Xin mua vé: 「我要买一张明天去上海的高铁票，上午的。」 Nhân viên sẽ hỏi: 「几点的？几个人？要什么座位？」 Đáp bằng số + lượng từ: 「两张，二等座。」 Thường phải xuất trình 「身份证 shēnfènzhèng」 hoặc hộ chiếu: 「请出示护照」. Thanh toán: 「扫码」 hoặc thẻ.</p>
<p>Ngôn ngữ thông báo: 「前往上海的G7次列车现在开始检票，请到八号检票口。」 Ghi chú: G7 → Thượng Hải, soát vé ngay, cổng 8. Số hiệu tàu đọc từng chữ số (G-bảy); số 1 đọc «yāo». Nhớ biến điệu của 七 và 不 từ CLS101. Giờ dùng hệ 24 giờ: 「十四点三十分」 (14:30).</p>
<p>Mẹo: trễ chuyến được thông báo bằng 「晚点 wǎndiǎn」: 「晚点二十分钟」. Đổi cổng: 「改到…」.</p>`],
    v: [[`单程`, `dānchéng`, `one-way`, `một chiều`], [`往返`, `wǎngfǎn`, `round trip`, `khứ hồi`], [`靠窗`, `kào chuāng`, `window seat`, `ghế cửa sổ`], [`身份证`, `shēnfènzhèng`, `ID card`, `chứng minh thư`], [`检票`, `jiǎnpiào`, `check tickets`, `soát vé`], [`晚点`, `wǎndiǎn`, `delayed`, `trễ giờ`]],
    d: [[`A`, `你好，我要两张明天去上海的高铁票。`, `Nǐ hǎo, wǒ yào liǎng zhāng míngtiān qù Shànghǎi de gāotiě piào.`, `Hello, two high-speed tickets to Shanghai tomorrow.`, `Chào chị, tôi muốn hai vé cao tốc đi Thượng Hải ngày mai.`], [`B`, `上午还是下午的？二等座可以吗？`, `Shàngwǔ háishi xiàwǔ de? Èrděng zuò kěyǐ ma?`, `Morning or afternoon? Second class OK?`, `Buổi sáng hay chiều? Hạng hai được không?`], [`A`, `上午的，靠窗的位子。`, `Shàngwǔ de, kào chuāng de wèizi.`, `Morning, window seats.`, `Buổi sáng, ghế cạnh cửa sổ.`], [`B`, `好的，请出示护照。`, `Hǎo de, qǐng chūshì hùzhào.`, `OK, please show your passport.`, `Vâng, mời anh xuất trình hộ chiếu.`]],
    pit: [`Reading train number G7 as «G seventy» or missing the platform change. Always listen for 改到 / 晚点 near the end.`, `Đọc số hiệu G7 thành «G bảy mươi» hoặc bỏ sót đổi sân ga. Luôn nghe 改到 / 晚点 ở cuối thông báo.`],
    s: [[`Ticket kit: destination, date, time, number, seat.`, `Bộ vé: nơi đến, ngày, giờ, số lượng, ghế.`], [`Show ID or passport.`, `Xuất trình CCCD hoặc hộ chiếu.`], [`Announcements: train number + gate + delay.`, `Thông báo: số hiệu + cổng + trễ.`]],
    l: ['gaotie', 'rail', 'pod'],
    p: [[`Ask for a one-way ticket to Beijing for tomorrow.`, `Xin một vé một chiều đi Bắc Kinh ngày mai.`, `我要一张明天去北京的单程票。`, `我要一张明天去北京的单程票。`], [`What does 晚点二十分钟 mean?`, `晚点二十分钟 nghĩa là gì?`, `Delayed by 20 minutes.`, `Trễ 20 phút.`]]
  }),
  D(P + '6-2', '6.2 Hotel check-in and problems', '6.2 Nhận phòng khách sạn và xử lý sự cố',
    'Đặt phòng, nhận phòng, hỏi tiện nghi, báo sự cố và yêu cầu đổi phòng.', {
    n: '6.2',
    g: [[`Check in and ask about facilities`, `Nhận phòng và hỏi tiện nghi`], [`Report a problem politely`, `Báo sự cố lịch sự`]],
    b: [`<p>Booking: 「我想订一个房间 dìng yí ge fángjiān」, 「标准间 biāozhǔnjiān」 (twin room), 「大床房」 (double bed), 「住两晚」 (stay two nights), 「含早餐」 (breakfast included). Check-in: 「我订了房间，我姓…」 and 「办理入住 bànlǐ rùzhù」; staff asks for 「护照」 and a 「押金 yājīn」 (deposit). Check-out: 「退房 tuìfáng」.</p>
<p>Facilities: 「Wi-Fi 密码是多少？」, 「早餐在几楼，几点到几点？」, 「房间里有没有吹风机 chuīfēngjī (hair dryer)？」. Numbers: floor 「八楼」, room 「八零六」 (806). Room numbers are read digit by digit; 0 is 「líng」.</p>
<p>Problems: 「空调坏了 kōngtiáo huài le」 (AC is broken), 「没有热水」 (no hot water), 「房间太吵了」 (too noisy), 「房间不太干净」. Polite request: 「麻烦您…」 (could you please…), 「能不能给我换一个房间？」. Staff replies: 「马上给您处理」 (I'll sort it out right away), 「非常抱歉 fēicháng bàoqiàn」.</p>
<p>In listening, catch: floor, room number, time of breakfast, and whether a service is free (「免费 miǎnfèi」).</p>`,
       `<p>Đặt phòng: 「我想订一个房间 dìng yí ge fángjiān」, 「标准间 biāozhǔnjiān」 (phòng hai giường), 「大床房」 (một giường đôi), 「住两晚」 (ở hai đêm), 「含早餐」 (gồm bữa sáng). Nhận phòng: 「我订了房间，我姓…」 và 「办理入住 bànlǐ rùzhù」; nhân viên xin 「护照」 và 「押金 yājīn」 (tiền cọc). Trả phòng: 「退房 tuìfáng」.</p>
<p>Tiện nghi: 「Wi-Fi 密码是多少？」, 「早餐在几楼，几点到几点？」, 「房间里有没有吹风机 chuīfēngjī (máy sấy tóc)？」. Số: tầng 「八楼」, phòng 「八零六」 (806). Số phòng đọc từng chữ số; 0 là 「líng」.</p>
<p>Sự cố: 「空调坏了 kōngtiáo huài le」 (điều hoà hỏng), 「没有热水」 (không có nước nóng), 「房间太吵了」 (phòng ồn quá), 「房间不太干净」. Yêu cầu lịch sự: 「麻烦您…」 (phiền anh/chị…), 「能不能给我换一个房间？」. Nhân viên đáp: 「马上给您处理」 (xử lý ngay ạ), 「非常抱歉 fēicháng bàoqiàn」.</p>
<p>Khi nghe, bắt: tầng, số phòng, giờ ăn sáng và dịch vụ có miễn phí không (「免费 miǎnfèi」).</p>`],
    v: [[`订`, `dìng`, `book`, `đặt`], [`押金`, `yājīn`, `deposit`, `tiền cọc`], [`退房`, `tuìfáng`, `check out`, `trả phòng`], [`空调`, `kōngtiáo`, `air conditioning`, `điều hoà`], [`换`, `huàn`, `change`, `đổi`], [`免费`, `miǎnfèi`, `free of charge`, `miễn phí`]],
    d: [[`A`, `您好，我订了一个大床房，住两晚。`, `Nín hǎo, wǒ dìng le yí ge dàchuángfáng, zhù liǎng wǎn.`, `Hello, I booked a double room for two nights.`, `Chào anh, tôi đặt một phòng giường đôi, ở hai đêm.`], [`B`, `好的，请给我您的护照。您住八零六，早餐在二楼，免费。`, `Hǎo de, qǐng gěi wǒ nín de hùzhào. Nín zhù bā líng liù, zǎocān zài èr lóu, miǎnfèi.`, `Passport please. Room 806, breakfast on 2nd floor, free.`, `Vâng, xin hộ chiếu. Anh ở phòng 806, bữa sáng ở tầng 2, miễn phí.`], [`A`, `麻烦问一下，房间的空调坏了，能给我换一个吗？`, `Máfan wèn yíxià, fángjiān de kōngtiáo huài le, néng gěi wǒ huàn yí ge ma?`, `Excuse me, the AC is broken; can I change rooms?`, `Xin hỏi, điều hoà phòng bị hỏng, đổi phòng giúp tôi được không?`], [`B`, `非常抱歉，马上给您换。`, `Fēicháng bàoqiàn, mǎshàng gěi nín huàn.`, `Very sorry, I'll change it now.`, `Rất xin lỗi, đổi ngay ạ.`]],
    pit: [`Complaining without a polite opener sounds rude. Start with 麻烦问一下 or 不好意思, then state the problem, then the request.`, `Phàn nàn không có lời mở lịch sự nghe thô. Hãy bắt đầu bằng 麻烦问一下 hoặc 不好意思, rồi nêu sự cố, rồi yêu cầu.`],
    s: [[`Booking and check-in: 订, 办理入住, 押金.`, `Đặt và nhận phòng: 订, 办理入住, 押金.`], [`Problem + polite request: 麻烦…, 能不能…`, `Sự cố + yêu cầu lịch sự: 麻烦…, 能不能…`], [`Catch floor, room, breakfast time.`, `Bắt tầng, phòng, giờ ăn sáng.`]],
    l: ['hotel', 'role', 'yoyo'],
    p: [[`Which room and where is breakfast?`, `Phòng nào và bữa sáng ở đâu?`, `Room 806; breakfast on the 2nd floor.`, `Phòng 806; bữa sáng ở tầng 2.`], [`Ask politely to change room because it is too noisy.`, `Xin đổi phòng lịch sự vì quá ồn.`, `不好意思，房间太吵了，能给我换一个吗？`, `不好意思，房间太吵了，能给我换一个吗？`]]
  }),
  D(P + '6-3', '6.3 Weather, delays and changed plans', '6.3 Thời tiết, trễ chuyến và thay đổi kế hoạch',
    'Nghe dự báo thời tiết, thông báo hủy–hoãn, bàn cách đổi kế hoạch.', {
    n: '6.3',
    g: [[`Understand a weather forecast`, `Hiểu bản dự báo thời tiết`], [`Negotiate a change of plans`, `Thương lượng đổi kế hoạch`]],
    b: [`<p>Forecast words: 「晴 qíng」 (sunny), 「阴 yīn」 (cloudy), 「多云」, 「小雨 / 大雨」, 「雷阵雨」 (thunderstorm), 「刮风」 (windy), 「下雪」, 「温度」 (temperature), 「最高气温 / 最低气温」 (highest/lowest), 「零下 língxià」 (below zero), 「湿度」. Example: 「明天多云转晴，最高气温二十八度，最低气温二十度。」 Notes: tomorrow cloudy → sunny, 28 / 20.</p>
<p>Changes use 「改 gǎi」, 「推迟 tuīchí」, 「取消 qǔxiāo」: 「因为台风，航班取消了」 (the flight was cancelled due to the typhoon). 「航班 hángbān」 (flight). Request: 「能改签吗？ gǎiqiān」 (can I change my ticket?) and 「退票 tuìpiào」 (refund).</p>
<p>Plan-changing conversation: 「天气不好，我们怎么办？」 → 「不如改到明天吧」 (better to change to tomorrow). 「不如 bùrú」 introduces a better alternative. 「要是下雨，我们就去博物馆」 (if it rains, we go to the museum). Offer a plan B: 「那我们就…」.</p>
<p>Listening hints: temperature numbers come in pairs (high/low); trap: 「最高」 and 「最低」 swapped in options. For delays the main data points are the new time and the reason.</p>`,
       `<p>Từ dự báo: 「晴 qíng」 (nắng), 「阴 yīn」 (âm u), 「多云」 (nhiều mây), 「小雨 / 大雨」, 「雷阵雨」 (mưa dông), 「刮风」 (gió), 「下雪」, 「温度」 (nhiệt độ), 「最高气温 / 最低气温」 (cao nhất/thấp nhất), 「零下 língxià」 (âm độ), 「湿度」 (độ ẩm). Ví dụ: 「明天多云转晴，最高气温二十八度，最低气温二十度。」 Ghi chú: mai nhiều mây → nắng, 28 / 20.</p>
<p>Thay đổi dùng 「改 gǎi」, 「推迟 tuīchí」, 「取消 qǔxiāo」: 「因为台风，航班取消了」 (do bão, chuyến bay bị huỷ). 「航班 hángbān」 (chuyến bay). Yêu cầu: 「能改签吗？ gǎiqiān」 (đổi vé được không?) và 「退票 tuìpiào」 (hoàn vé).</p>
<p>Hội thoại đổi kế hoạch: 「天气不好，我们怎么办？」 → 「不如改到明天吧」 (hay là dời sang mai). 「不如 bùrú」 mở ra phương án tốt hơn. 「要是下雨，我们就去博物馆」 (nếu mưa thì đi bảo tàng). Đưa phương án B: 「那我们就…」.</p>
<p>Gợi ý nghe: nhiệt độ đi thành cặp (cao/thấp); bẫy: 「最高」 và 「最低」 bị đảo trong đáp án. Với trễ chuyến, dữ liệu chính là giờ mới và lý do.</p>`],
    v: [[`多云`, `duōyún`, `cloudy`, `nhiều mây`], [`气温`, `qìwēn`, `air temperature`, `nhiệt độ không khí`], [`航班`, `hángbān`, `flight`, `chuyến bay`], [`改签`, `gǎiqiān`, `rebook`, `đổi vé`], [`不如`, `bùrú`, `had better / not as good as`, `chi bằng`], [`要是`, `yàoshi`, `if`, `nếu`]],
    d: [[`A`, `听说明天有大雨，我们还去长城吗？`, `Tīngshuō míngtiān yǒu dàyǔ, wǒmen hái qù Chángchéng ma?`, `They say heavy rain tomorrow; still go to the Great Wall?`, `Nghe nói mai mưa to, mình vẫn đi Trường Thành chứ?`], [`B`, `不如改到后天吧，后天晴，最高气温二十五度。`, `Bùrú gǎi dào hòutiān ba, hòutiān qíng, zuìgāo qìwēn èrshíwǔ dù.`, `Better move to the day after tomorrow: sunny, high 25.`, `Chi bằng dời sang ngày kia, trời nắng, cao nhất 25 độ.`], [`A`, `好，那明天我们就去博物馆。`, `Hǎo, nà míngtiān wǒmen jiù qù bówùguǎn.`, `OK, tomorrow we go to a museum.`, `Được, vậy mai mình đi bảo tàng.`]],
    pit: [`Swapping 最高 and 最低 in notes. Write H/L with each number immediately.`, `Đảo 最高 và 最低 trong ghi chú. Ghi H/L ngay cạnh từng con số.`],
    s: [[`Forecast: weather + high/low temperature.`, `Dự báo: thời tiết + nhiệt độ cao/thấp.`], [`Changes: 改, 推迟, 取消, 改签.`, `Thay đổi: 改, 推迟, 取消, 改签.`], [`不如 offers a better plan.`, `不如 đưa ra phương án tốt hơn.`]],
    l: ['clim', 'rail', 'pod'],
    p: [[`In the dialogue, what will they do tomorrow?`, `Trong hội thoại, ngày mai họ sẽ làm gì?`, `Visit a museum.`, `Đi bảo tàng.`], [`Say: if it rains, we stay at home.`, `Nói: nếu mưa thì ở nhà.`, `要是下雨，我们就在家。`, `要是下雨，我们就在家。`]]
  }),
  Q(P + 'quiz-6', 'Quiz — Chapter 6', 'Quiz — Chương 6', [
    [[`单程 means`, `单程 nghĩa là`], [`one-way`, `round trip`, `sleeper`, `window`], 0, [`单 = single.`, `单 = đơn.`]],
    [[`靠窗 means`, `靠窗 nghĩa là`], [`next to the window`, `next to the door`, `at the front`, `first class`], 0, [`靠 = lean on / near.`, `靠 = sát, gần.`]],
    [[`Room 806 is read`, `Phòng 806 đọc`], [`bā líng liù`, `bā bǎi liù`, `liù líng bā`, `bā liù`], 0, [`Digit by digit.`, `Đọc từng chữ số.`]],
    [[`退房 means`, `退房 nghĩa là`], [`check out`, `check in`, `book`, `clean`], 0, [`退 = return.`, `退 = trả.`]],
    [[`A polite start to a complaint`, `Mở đầu lịch sự khi phàn nàn`], [`麻烦问一下`, `喂！`, `快点`, `不对`], 0, [`It softens the request.`, `Nó làm mềm yêu cầu.`]],
    [[`晚点 means`, `晚点 nghĩa là`], [`delayed`, `cancelled`, `early`, `full`], 0, [`点 = point of time; 晚 = late.`, `Trễ giờ.`]],
    [[`不如改到明天吧 suggests`, `不如改到明天吧 gợi ý`], [`change to tomorrow`, `cancel for ever`, `go now`, `stay`], 0, [`不如 = better to.`, `不如 = chi bằng.`]],
    [[`最高气温 is`, `最高气温 là`], [`highest temperature`, `lowest temperature`, `rain amount`, `wind`], 0, [`最高 = highest.`, `最高 = cao nhất.`]],
    [[`改签 means`, `改签 nghĩa là`], [`change a ticket booking`, `refund`, `buy food`, `sign a letter`], 0, [`Rebook.`, `Đổi vé.`]],
  ]),
]));

// ===== Chương 7 =====
secs.push(SEC('Chapter 7 — Hobbies, plans and invitations', 'Chương 7 — Sở thích, kế hoạch và lời mời',
  'Nói về sở thích và thể thao, động từ tình thái, mời–nhận–từ chối.', [
  D(P + '7-1', '7.1 Hobbies and sports', '7.1 Sở thích và thể thao',
    'Từ vựng sở thích, mức độ yêu thích, hỏi–đáp dài hơn về một sở thích.', {
    n: '7.1',
    g: [[`Talk about a hobby for 30–40 seconds`, `Nói về một sở thích 30–40 giây`], [`Ask follow-up questions`, `Hỏi nối tiếp`]],
    b: [`<p>Hobby words: 「爱好 àihào」 (hobby), 「游泳」, 「打篮球」, 「踢足球」, 「打乒乓球 pīngpāngqiú」 (table tennis), 「跑步」, 「爬山」, 「太极拳 tàijíquán」, 「看电影」, 「听音乐」, 「弹吉他」, 「画画儿」, 「做饭」, 「玩游戏」. Verb choice matters: 打 for ball games played with hands/rackets, 踢 for kicking, 弹 for string/keyboard instruments, 拉 for violin.</p>
<p>Ask a chain: 「你有什么爱好？」 → 「你喜欢…吗？」 → 「你什么时候开始的？」 → 「多长时间练一次？」 → 「为什么喜欢？」 Answer with the frame from Chapter 3: <strong>what – since when – how often – why</strong>. Example: 「我喜欢打乒乓球，从十岁开始，每周打三次，因为它又快又有意思。」 Note 「又…又… yòu…yòu…」 (both… and…), and degree of liking: 「喜欢」 &lt; 「很喜欢」 &lt; 「爱」 &lt; 「迷上了」 (be hooked).</p>
<p>When you listen to someone describing a hobby, expect extra words such as 「水平 shuǐpíng」 (level), 「比赛 bǐsài」 (match), 「教练 jiàoliàn」 (coach), 「队 duì」 (team). Questions may ask who they play with or how long it has been.</p>
<p>Reaction phrases make you sound natural: 「真的吗？」, 「太棒了！」, 「听起来很有意思」 (sounds interesting), 「我也想试试」 (I want to try too).</p>`,
       `<p>Từ về sở thích: 「爱好 àihào」, 「游泳」, 「打篮球」, 「踢足球」, 「打乒乓球 pīngpāngqiú」 (bóng bàn), 「跑步」, 「爬山」, 「太极拳 tàijíquán」, 「看电影」, 「听音乐」, 「弹吉他」, 「画画儿」, 「做饭」, 「玩游戏」. Chọn động từ rất quan trọng: 打 cho bóng chơi bằng tay/vợt, 踢 cho đá chân, 弹 cho đàn dây/phím, 拉 cho vĩ cầm.</p>
<p>Hỏi theo chuỗi: 「你有什么爱好？」 → 「你喜欢…吗？」 → 「你什么时候开始的？」 → 「多长时间练一次？」 → 「为什么喜欢？」 Trả lời theo khung Chương 3: <strong>gì – từ khi nào – bao lâu một lần – vì sao</strong>. Ví dụ: 「我喜欢打乒乓球，从十岁开始，每周打三次，因为它又快又有意思。」 Chú ý 「又…又… yòu…yòu…」 (vừa… vừa…), và mức yêu thích: 「喜欢」 &lt; 「很喜欢」 &lt; 「爱」 &lt; 「迷上了」 (mê mẩn).</p>
<p>Khi nghe ai đó kể về sở thích, hãy chờ các từ như 「水平 shuǐpíng」 (trình độ), 「比赛 bǐsài」 (trận đấu), 「教练 jiàoliàn」 (huấn luyện viên), 「队 duì」 (đội). Câu hỏi có thể hỏi chơi với ai hoặc được bao lâu.</p>
<p>Câu phản hồi giúp bạn tự nhiên: 「真的吗？」, 「太棒了！」, 「听起来很有意思」, 「我也想试试」.</p>`],
    v: [[`爱好`, `àihào`, `hobby`, `sở thích`], [`乒乓球`, `pīngpāngqiú`, `table tennis`, `bóng bàn`], [`水平`, `shuǐpíng`, `level, skill`, `trình độ`], [`比赛`, `bǐsài`, `match`, `trận đấu`], [`又…又…`, `yòu…yòu…`, `both… and…`, `vừa… vừa…`], [`迷上`, `mí shàng`, `become hooked on`, `mê`]],
    d: [[`A`, `你有什么爱好？`, `Nǐ yǒu shénme àihào?`, `What are your hobbies?`, `Sở thích của bạn là gì?`], [`B`, `我喜欢打乒乓球，每周打三次，水平还不错。`, `Wǒ xǐhuan dǎ pīngpāngqiú, měi zhōu dǎ sān cì, shuǐpíng hái búcuò.`, `I like table tennis, three times a week; my level is OK.`, `Mình thích đánh bóng bàn, mỗi tuần ba lần, trình độ cũng khá.`], [`A`, `听起来很有意思，我也想试试。`, `Tīng qǐlái hěn yǒu yìsi, wǒ yě xiǎng shìshi.`, `Sounds fun, I want to try.`, `Nghe thú vị đấy, mình cũng muốn thử.`], [`B`, `周六来吧，我教你。`, `Zhōuliù lái ba, wǒ jiāo nǐ.`, `Come on Saturday, I'll teach you.`, `Thứ Bảy đến nhé, mình dạy.`]],
    pit: [`Using 打 for every sport (✗ 打游泳). Swimming is 游泳 alone; football uses 踢.`, `Dùng 打 cho mọi môn (✗ 打游泳). Bơi chỉ là 游泳; bóng đá dùng 踢.`],
    s: [[`Verb matches sport: 打, 踢, 弹, 拉.`, `Động từ đúng môn: 打, 踢, 弹, 拉.`], [`Frame: what, since when, how often, why.`, `Khung: gì, từ khi nào, bao lâu, vì sao.`], [`Use reaction phrases to sound natural.`, `Dùng câu phản hồi cho tự nhiên.`]],
    l: ['tt', 'taichi', 'hello'],
    p: [[`Which verb goes with 乒乓球?`, `Động từ nào đi với 乒乓球?`, `打.`, `打.`], [`Say: I have played guitar for two years.`, `Nói: Tôi chơi guitar hai năm rồi.`, `我弹吉他弹了两年了。`, `我弹吉他弹了两年了。`]]
  }),
  D(P + '7-2', '7.2 Can, will, plan to: 会, 能, 可以, 想, 要, 打算', '7.2 Có thể, sẽ, dự định: 会, 能, 可以, 想, 要, 打算',
    'Phân biệt động từ tình thái hay gây nhầm lẫn khi nghe và khi nói.', {
    n: '7.2',
    g: [[`Choose the right modal verb`, `Chọn đúng động từ tình thái`], [`Express plans with certainty levels`, `Diễn đạt kế hoạch với mức chắc chắn khác nhau`]],
    b: [`<table><thead><tr><th>Modal</th><th>Core meaning</th><th>Example</th></tr></thead><tbody>
<tr><td>会 huì</td><td>learned skill; also «will» (prediction)</td><td>我会游泳; 明天会下雨</td></tr>
<tr><td>能 néng</td><td>ability or condition allows</td><td>我今天能去; 这里不能抽烟</td></tr>
<tr><td>可以 kěyǐ</td><td>permission</td><td>这儿可以拍照吗？</td></tr>
<tr><td>想 xiǎng</td><td>want, would like</td><td>我想喝茶</td></tr>
<tr><td>要 yào</td><td>want / need / will</td><td>我要去北京; 要下雨了</td></tr>
<tr><td>打算 dǎsuàn</td><td>plan, intend</td><td>我打算明年去中国</td></tr>
</tbody></table>
<p>Plans have degrees of certainty: 「也许 yěxǔ / 可能 kěnéng」 (maybe) &lt; 「想」 (would like) &lt; 「打算」 (plan) &lt; 「准备 zhǔnbèi」 (prepare to) &lt; 「决定 juédìng」 (decided). A listening question often asks «What does he plan to do?» — a speaker with 「可能」 has not decided. Negative forms differ: 「不会」 (cannot, not skilled / won't), 「不能」 (not possible/not allowed), 「不可以」 (forbidden), 「不想」, 「不打算」.</p>
<p>Speaking practice: say each of your next-month plans with a different certainty level. 「我打算暑假去打工，也许会去北京。」 Notice 「要…了 yào…le」 for something about to happen: 「要下雨了」, 「火车要开了」.</p>
<p>Tip: in questions, 「能…吗」 is a polite request: 「你能帮我一下吗？」, while 「可以…吗」 asks permission.</p>`,
       `<table><thead><tr><th>Động từ</th><th>Nghĩa chính</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>会 huì</td><td>kỹ năng đã học; cũng là «sẽ» (dự đoán)</td><td>我会游泳; 明天会下雨</td></tr>
<tr><td>能 néng</td><td>khả năng hoặc điều kiện cho phép</td><td>我今天能去; 这里不能抽烟</td></tr>
<tr><td>可以 kěyǐ</td><td>được phép</td><td>这儿可以拍照吗？</td></tr>
<tr><td>想 xiǎng</td><td>muốn, mong</td><td>我想喝茶</td></tr>
<tr><td>要 yào</td><td>muốn / cần / sẽ</td><td>我要去北京; 要下雨了</td></tr>
<tr><td>打算 dǎsuàn</td><td>dự định</td><td>我打算明年去中国</td></tr>
</tbody></table>
<p>Kế hoạch có các mức chắc chắn: 「也许 yěxǔ / 可能 kěnéng」 (có thể) &lt; 「想」 (muốn) &lt; 「打算」 (dự định) &lt; 「准备 zhǔnbèi」 (chuẩn bị) &lt; 「决定 juédìng」 (đã quyết). Câu hỏi nghe hay hỏi «Anh ấy dự định làm gì?» — người nói dùng 「可能」 thì chưa quyết. Dạng phủ định khác nhau: 「不会」 (không biết / sẽ không), 「不能」 (không thể / không được), 「不可以」 (cấm), 「不想」, 「不打算」.</p>
<p>Luyện nói: nói từng kế hoạch tháng tới với mức chắc chắn khác nhau. 「我打算暑假去打工，也许会去北京。」 Chú ý 「要…了 yào…le」 cho việc sắp xảy ra: 「要下雨了」, 「火车要开了」.</p>
<p>Mẹo: trong câu hỏi, 「能…吗」 là lời nhờ lịch sự: 「你能帮我一下吗？」, còn 「可以…吗」 là xin phép.</p>`],
    d: [[`A`, `暑假你有什么打算？`, `Shǔjià nǐ yǒu shénme dǎsuàn?`, `What are your summer plans?`, `Kỳ nghỉ hè bạn có dự định gì?`], [`B`, `我打算去打工，也许会去北京学汉语。`, `Wǒ dǎsuàn qù dǎgōng, yěxǔ huì qù Běijīng xué Hànyǔ.`, `I plan to work part time, maybe study Chinese in Beijing.`, `Mình dự định đi làm thêm, có thể sẽ đến Bắc Kinh học tiếng Trung.`], [`A`, `你能帮我看看这个句子对不对吗？`, `Nǐ néng bāng wǒ kànkan zhège jùzi duì bu duì ma?`, `Could you check if this sentence is right?`, `Bạn xem giúp mình câu này đúng không được không?`], [`B`, `可以，给我吧。`, `Kěyǐ, gěi wǒ ba.`, `Sure, give it to me.`, `Được, đưa mình đi.`]],
    pit: [`Using 会 for permission or 可以 for a learned skill. Ask: skill → 会; permission → 可以; circumstance → 能.`, `Dùng 会 cho xin phép hoặc 可以 cho kỹ năng. Hỏi: kỹ năng → 会; được phép → 可以; hoàn cảnh → 能.`],
    s: [[`会 skill/prediction; 能 condition; 可以 permission.`, `会 kỹ năng/dự đoán; 能 điều kiện; 可以 cho phép.`], [`Certainty: 可能 < 想 < 打算 < 准备 < 决定.`, `Mức chắc: 可能 < 想 < 打算 < 准备 < 决定.`], [`要…了 = about to happen.`, `要…了 = sắp xảy ra.`]],
    l: ['gram', 'part', 'wikib'],
    p: [[`Choose 会 / 能 / 可以: 这儿___抽烟吗？`, `Chọn 会 / 能 / 可以: 这儿___抽烟吗？`, `可以 (permission) or 能; both are heard, 可以 is safest.`, `可以 (xin phép) hoặc 能; nghe cả hai, 可以 an toàn nhất.`], [`Is 也许会去 a firm plan?`, `也许会去 có phải kế hoạch chắc chắn không?`, `No — it is only a possibility.`, `Không — chỉ là khả năng.`]]
  }),
  D(P + '7-3', '7.3 Inviting, accepting and declining', '7.3 Mời, nhận lời và từ chối',
    'Cách mời lịch sự, đáp nhận và từ chối có lý do, hẹn lại; hội thoại mẫu.', {
    n: '7.3',
    g: [[`Invite someone with time, place and activity`, `Mời ai bằng thời gian, nơi chốn và hoạt động`], [`Accept or decline with a reason`, `Nhận lời hoặc từ chối có lý do`]],
    b: [`<p>An invitation has four parts: <strong>activity – time – place – question</strong>. 「周末我们一起去看电影，怎么样？」 or 「我想请你吃饭，你有空吗？」 Words: 「请 qǐng」 (invite / treat), 「约 yuē」 (arrange to meet), 「有空 yǒu kòng」 (be free), 「方便 fāngbiàn」.</p>
<p>Accept warmly: 「好啊！」 「太好了，我一定去。」 「没问题，几点？」 Confirm details: 「在哪儿见面？」 「几点？」 Decline with a reason and an alternative: 「真不巧，那天我有事，下次吧。」 (Unfortunately I have something that day, next time.) 「不好意思，我已经有安排了。」 Remember Chapter 2: a vague 「再说吧」 is a weak no — if you really cannot go, a clear reason is more polite.</p>
<p>Making a plan: 「几点见？」 → 「六点半，在学校门口」 → 「好，不见不散」 (be there or be square, i.e. we will wait for each other). Reminding: 「别忘了」, 「到时候给我打电话」. Changing: 「对不起，我可能要晚到十分钟」.</p>
<p>Who pays? 「我请客 qǐngkè」 (my treat) and 「AA制」 (split the bill). The polite pattern is a short struggle for the bill; a quick 「下次我请」 closes it.</p>`,
       `<p>Lời mời có bốn phần: <strong>hoạt động – thời gian – nơi chốn – câu hỏi</strong>. 「周末我们一起去看电影，怎么样？」 hoặc 「我想请你吃饭，你有空吗？」 Từ: 「请 qǐng」 (mời / đãi), 「约 yuē」 (hẹn), 「有空 yǒu kòng」 (rảnh), 「方便 fāngbiàn」 (tiện).</p>
<p>Nhận lời nồng nhiệt: 「好啊！」 「太好了，我一定去。」 「没问题，几点？」 Xác nhận chi tiết: 「在哪儿见面？」 「几点？」 Từ chối có lý do và gợi ý khác: 「真不巧，那天我有事，下次吧。」 (Thật không may, hôm đó tôi bận, lần sau nhé.) 「不好意思，我已经有安排了。」 Nhớ Chương 2: 「再说吧」 mơ hồ là «không» yếu — nếu thật sự không đi được thì nêu lý do rõ ràng sẽ lịch sự hơn.</p>
<p>Lên kế hoạch: 「几点见？」 → 「六点半，在学校门口」 → 「好，不见不散」 (không gặp không về). Nhắc: 「别忘了」, 「到时候给我打电话」. Đổi: 「对不起，我可能要晚到十分钟」.</p>
<p>Ai trả tiền? 「我请客 qǐngkè」 (tôi đãi) và 「AA制」 (chia đều). Phép lịch sự là giành trả một chút; một câu 「下次我请」 là kết thúc.</p>`],
    v: [[`有空`, `yǒu kòng`, `be free`, `rảnh`], [`约`, `yuē`, `make an appointment`, `hẹn`], [`不巧`, `bù qiǎo`, `unfortunately`, `không may`], [`安排`, `ānpái`, `arrangement`, `sắp xếp, lịch`], [`请客`, `qǐngkè`, `treat someone`, `đãi khách`], [`不见不散`, `bú jiàn bú sàn`, `be there, no matter what`, `không gặp không về`]],
    d: [[`A`, `这个周六你有空吗？我想请你吃饭。`, `Zhège Zhōuliù nǐ yǒu kòng ma? Wǒ xiǎng qǐng nǐ chīfàn.`, `Free this Saturday? I'd like to treat you to dinner.`, `Thứ Bảy này bạn rảnh không? Mình muốn mời bạn ăn cơm.`], [`B`, `真不巧，周六我已经有安排了。周日可以吗？`, `Zhēn bù qiǎo, Zhōuliù wǒ yǐjīng yǒu ānpái le. Zhōurì kěyǐ ma?`, `Unfortunately I'm booked Saturday. Sunday?`, `Thật không may, thứ Bảy mình có lịch rồi. Chủ nhật được không?`], [`A`, `可以，晚上六点半，学校门口见。`, `Kěyǐ, wǎnshang liù diǎn bàn, xuéxiào ménkǒu jiàn.`, `OK, 6:30 pm at the school gate.`, `Được, 6 giờ rưỡi tối, gặp ở cổng trường.`], [`B`, `好，不见不散！`, `Hǎo, bú jiàn bú sàn!`, `Deal, be there!`, `Được, không gặp không về!`]],
    pit: [`Saying a flat 我不去 with no reason or alternative. In Chinese a refusal is softened with 真不巧 / 不好意思 + reason + 下次.`, `Chỉ nói trống không 我不去 mà không lý do hay phương án khác. Tiếng Trung làm mềm lời từ chối bằng 真不巧 / 不好意思 + lý do + 下次.`],
    s: [[`Invite = activity + time + place + question.`, `Mời = hoạt động + thời gian + nơi chốn + câu hỏi.`], [`Decline = apology + reason + alternative.`, `Từ chối = xin lỗi + lý do + phương án khác.`], [`Confirm time and place.`, `Xác nhận giờ và nơi.`]],
    l: ['role', 'speak', 'pod'],
    p: [[`When and where do they meet on Sunday?`, `Họ gặp nhau khi nào và ở đâu vào Chủ nhật?`, `6:30 pm, school gate (from the plan they agreed).`, `6 giờ rưỡi tối, cổng trường (theo kế hoạch đã thống nhất).`], [`Decline an invitation politely for tomorrow.`, `Từ chối lịch sự lời mời ngày mai.`, `不好意思，明天我有事，下次吧。`, `不好意思，明天我有事，下次吧。`]]
  }),
  Q(P + 'quiz-7', 'Quiz — Chapter 7', 'Quiz — Chương 7', [
    [[`Verb for table tennis`, `Động từ cho bóng bàn`], [`打`, `踢`, `弹`, `拉`], 0, [`打 for racket/hand ball sports.`, `打 cho môn vợt/bóng tay.`]],
    [[`又快又有意思 means`, `又快又有意思 nghĩa là`], [`both fast and interesting`, `neither`, `slow`, `only fun`], 0, [`又…又… = both… and…`, `又…又… = vừa… vừa…`]],
    [[`Permission uses`, `Xin phép dùng`], [`可以`, `会`, `想`, `打算`], 0, [`可以 = may.`, `可以 = được phép.`]],
    [[`I can swim (learned skill)`, `Tôi biết bơi (kỹ năng)`], [`我会游泳`, `我可以游泳 (skill)`, `我要游泳`, `我想游泳`], 0, [`会 = learned skill.`, `会 = kỹ năng học được.`]],
    [[`Strongest certainty`, `Chắc chắn nhất`], [`决定`, `可能`, `想`, `也许`], 0, [`决定 = decided.`, `决定 = đã quyết định.`]],
    [[`要下雨了 means`, `要下雨了 nghĩa là`], [`it is about to rain`, `it never rains`, `it rained`, `no rain`], 0, [`要…了 = about to.`, `要…了 = sắp.`]],
    [[`真不巧 is used to`, `真不巧 dùng để`], [`soften a refusal`, `ask a price`, `thank`, `greet`], 0, [`It means unfortunately.`, `Nghĩa là không may.`]],
    [[`不见不散 means`, `不见不散 nghĩa là`], [`we will wait until we meet`, `never meet`, `meet tomorrow only`, `goodbye`], 0, [`A firm promise to meet.`, `Lời hẹn chắc chắn.`]],
    [[`AA制 means`, `AA制 nghĩa là`], [`split the bill`, `I pay all`, `no bill`, `bill later`], 0, [`Each pays their share.`, `Mỗi người trả phần mình.`]],
  ]),
]));

// ===== Chương 8 =====
secs.push(SEC('Chapter 8 — Work, internships and remote communication', 'Chương 8 — Công việc, thực tập và giao tiếp từ xa',
  'Tự giới thiệu khi xin thực tập, tin nhắn thoại và cuộc gọi có sự cố, nhờ vả trong công việc.', [
  D(P + '8-1', '8.1 Interview basics: introducing yourself for an internship', '8.1 Phỏng vấn cơ bản: tự giới thiệu xin thực tập',
    'Khung tự giới thiệu 1 phút, câu hỏi phỏng vấn thường gặp và cách trả lời.', {
    n: '8.1',
    g: [[`Give a 1-minute professional self-introduction`, `Tự giới thiệu chuyên nghiệp trong 1 phút`], [`Answer five standard interview questions`, `Trả lời năm câu hỏi phỏng vấn chuẩn`]],
    b: [`<p>CLS101 had a personal self-introduction. For an internship, the frame is: <strong>name & school – major – skills – experience – why this company</strong>. Sample: 「您好，我叫阮明，是FPT大学汉语专业的学生。我会说汉语和英语，用过Excel和PPT。去年暑假我在一家公司做过兼职。我对贵公司很感兴趣，希望有机会在这里实习。」 Note 「贵公司 guì gōngsī」 (your company; respectful), 「兼职 jiānzhí」 (part-time job), 「实习 shíxí」 (internship).</p>
<p>Standard interview questions: 「请做个自我介绍」, 「你为什么想来我们公司？」, 「你有什么优点和缺点？ yōudiǎn / quēdiǎn」, 「你有什么工作经验？ jīngyàn」, 「你什么时候能开始上班？」, 「你有什么问题要问我们吗？」. Prepare answers with example; for weaknesses, name a real one and what you do about it: 「我有时候太紧张，所以我常常提前练习。」</p>
<p>Listening: the interviewer speaks formally and fast. Catch the question word first: 为什么 (why), 怎么 (how), 什么时候 (when), 多长时间 (how long). If you did not hear, say: 「对不起，我没听清楚，您能再说一遍吗？」 and never guess.</p>
<p>Speaking style: calm speed, clear tones, complete sentences, polite words: 「请问」, 「谢谢您」, 「很高兴有这个机会」.</p>`,
       `<p>CLS101 có phần tự giới thiệu cá nhân. Với thực tập, khung là: <strong>tên & trường – chuyên ngành – kỹ năng – kinh nghiệm – vì sao chọn công ty</strong>. Mẫu: 「您好，我叫阮明，是FPT大学汉语专业的学生。我会说汉语和英语，用过Excel和PPT。去年暑假我在一家公司做过兼职。我对贵公司很感兴趣，希望有机会在这里实习。」 Chú ý 「贵公司 guì gōngsī」 (quý công ty; kính trọng), 「兼职 jiānzhí」 (làm thêm), 「实习 shíxí」 (thực tập).</p>
<p>Câu hỏi phỏng vấn chuẩn: 「请做个自我介绍」, 「你为什么想来我们公司？」, 「你有什么优点和缺点？ yōudiǎn / quēdiǎn」, 「你有什么工作经验？ jīngyàn」, 「你什么时候能开始上班？」, 「你有什么问题要问我们吗？」. Chuẩn bị đáp án có ví dụ; với điểm yếu, nêu một điểm thật và cách bạn khắc phục: 「我有时候太紧张，所以我常常提前练习。」</p>
<p>Khi nghe: người phỏng vấn nói trang trọng và nhanh. Bắt từ nghi vấn trước: 为什么 (vì sao), 怎么 (thế nào), 什么时候 (khi nào), 多长时间 (bao lâu). Nếu không nghe rõ, hãy nói: 「对不起，我没听清楚，您能再说一遍吗？」 và đừng đoán mò.</p>
<p>Phong cách nói: tốc độ bình tĩnh, thanh điệu rõ, câu đầy đủ, từ lịch sự: 「请问」, 「谢谢您」, 「很高兴有这个机会」.</p>`],
    v: [[`实习`, `shíxí`, `internship`, `thực tập`], [`兼职`, `jiānzhí`, `part-time job`, `việc làm thêm`], [`优点`, `yōudiǎn`, `strength`, `ưu điểm`], [`缺点`, `quēdiǎn`, `weakness`, `khuyết điểm`], [`经验`, `jīngyàn`, `experience`, `kinh nghiệm`], [`机会`, `jīhuì`, `opportunity`, `cơ hội`]],
    d: [[`面试官`, `请先做个自我介绍。`, `Qǐng xiān zuò ge zìwǒ jièshào.`, `Please introduce yourself first.`, `Mời bạn tự giới thiệu trước.`], [`应聘者`, `您好，我叫阮明，是汉语专业的学生，会说汉语和英语。`, `Nín hǎo, wǒ jiào Ruǎn Míng, shì Hànyǔ zhuānyè de xuésheng, huì shuō Hànyǔ hé Yīngyǔ.`, `Hello, I am Nguyen Minh, a Chinese major, I speak Chinese and English.`, `Chào ông/bà, tôi là Nguyễn Minh, sinh viên ngành Hán ngữ, biết tiếng Trung và tiếng Anh.`], [`面试官`, `你为什么想来我们公司实习？`, `Nǐ wèishénme xiǎng lái wǒmen gōngsī shíxí?`, `Why do you want to intern here?`, `Vì sao bạn muốn thực tập ở công ty chúng tôi?`], [`应聘者`, `因为贵公司和中国有很多合作，我想用汉语工作。`, `Yīnwèi guì gōngsī hé Zhōngguó yǒu hěn duō hézuò, wǒ xiǎng yòng Hànyǔ gōngzuò.`, `Because your firm cooperates a lot with China; I want to use Chinese at work.`, `Vì quý công ty hợp tác nhiều với Trung Quốc, tôi muốn dùng tiếng Trung khi làm việc.`]],
    pit: [`Memorising a speech and reciting it too fast. Practise a version you can slow down; pauses show confidence.`, `Học thuộc bài rồi đọc quá nhanh. Hãy luyện bản có thể nói chậm lại; biết dừng thể hiện sự tự tin.`],
    s: [[`Frame: name/school, major, skills, experience, why.`, `Khung: tên/trường, ngành, kỹ năng, kinh nghiệm, lý do.`], [`Prepare strengths/weaknesses with examples.`, `Chuẩn bị ưu/nhược điểm kèm ví dụ.`], [`If you did not hear, ask for repetition.`, `Không nghe rõ thì xin nhắc lại.`]],
    l: ['interview', 'intern', 'speak'],
    p: [[`Why does the candidate want to intern there?`, `Ứng viên vì sao muốn thực tập ở đó?`, `The company cooperates with China; he wants to use Chinese.`, `Công ty hợp tác nhiều với Trung Quốc; muốn dùng tiếng Trung.`], [`How do you ask the interviewer to repeat politely?`, `Xin người phỏng vấn nhắc lại lịch sự thế nào?`, `对不起，我没听清楚，您能再说一遍吗？`, `对不起，我没听清楚，您能再说一遍吗？`]]
  }),
  D(P + '8-2', '8.2 Voice messages and phone problems', '8.2 Tin nhắn thoại và sự cố điện thoại',
    'Nghe và để lại tin nhắn thoại rõ ràng; xử lý tín hiệu yếu, nói nhanh, không nghe rõ.', {
    n: '8.2',
    g: [[`Leave a clear voice message in 20 seconds`, `Để lại tin nhắn thoại rõ ràng trong 20 giây`], [`Handle bad connections and ask for repetition`, `Xử lý đường truyền kém và xin nhắc lại`]],
    b: [`<p>Chinese friends and colleagues often use voice messages on messaging apps. You listen to them without text, sometimes at 1.5× speed. A well-formed voice message follows: <strong>greeting – purpose – key facts – request – closing</strong>. Example: 「小王你好，我是阮明。明天下午的会议改到三点了，在三楼会议室。你收到后请回复我，谢谢！」 (Xiao Wang, hello, it is Minh. Tomorrow's meeting moved to 3 pm in the 3rd-floor room. Please reply when you get this. Thanks!) Key facts are repeated at the end if they are numbers.</p>
<p>Problems on calls: 「信号不好 xìnhào bù hǎo」, 「听不清楚」, 「声音太小」, 「你说得太快了」, 「你那边有点儿吵」. Repair phrases: 「请再说一遍」, 「请说慢一点儿」, 「请再大点儿声」, 「你能发给我文字吗？」 (can you send me text?), and checking: 「我重复一下，是明天三点，对吗？」 (let me repeat, tomorrow 3 pm, right?). Confirming by repeating numbers is a professional habit.</p>
<p>Spelling out: 「我的名字是阮，耳字旁的阮」 describes characters by components. For a rare name: 「明是日字旁加月」 (明 = 日 + 月). Phone numbers are read digit by digit with 「幺 yāo」 for 1.</p>
<p>When you leave a voice message, speak slightly slower than normal, and avoid background noise. Keep it under 30 seconds.</p>`,
       `<p>Bạn bè và đồng nghiệp Trung thường dùng tin nhắn thoại trên ứng dụng chat. Bạn nghe không có chữ, đôi khi ở tốc độ 1,5×. Một tin thoại tốt theo thứ tự: <strong>chào – mục đích – dữ kiện chính – đề nghị – kết</strong>. Ví dụ: 「小王你好，我是阮明。明天下午的会议改到三点了，在三楼会议室。你收到后请回复我，谢谢！」 (Chào Vương, mình là Minh. Cuộc họp chiều mai dời sang 3 giờ ở phòng họp tầng 3. Nhận được thì trả lời mình nhé, cảm ơn!) Nếu là con số thì nhắc lại ở cuối.</p>
<p>Sự cố khi gọi: 「信号不好 xìnhào bù hǎo」, 「听不清楚」, 「声音太小」, 「你说得太快了」, 「你那边有点儿吵」. Cụm sửa lỗi: 「请再说一遍」, 「请说慢一点儿」, 「请再大点儿声」, 「你能发给我文字吗？」 (gửi cho mình chữ được không?), và kiểm tra: 「我重复一下，是明天三点，对吗？」 Nhắc lại con số để xác nhận là thói quen chuyên nghiệp.</p>
<p>Đánh vần: 「我的名字是阮，耳字旁的阮」 mô tả chữ bằng bộ thành phần. Với tên hiếm: 「明是日字旁加月」 (明 = 日 + 月). Số điện thoại đọc từng số, 「幺 yāo」 cho số 1.</p>
<p>Khi để lại tin thoại, nói chậm hơn bình thường một chút, tránh nơi ồn, giữ dưới 30 giây.</p>`],
    v: [[`信号`, `xìnhào`, `signal`, `tín hiệu`], [`回复`, `huífù`, `reply`, `trả lời`], [`重复`, `chóngfù`, `repeat`, `lặp lại`], [`声音`, `shēngyīn`, `voice / sound`, `âm thanh, giọng`], [`会议室`, `huìyìshì`, `meeting room`, `phòng họp`], [`收到`, `shōudào`, `receive`, `nhận được`]],
    d: [[`A`, `喂，我这边信号不好，你说什么？`, `Wéi, wǒ zhè biān xìnhào bù hǎo, nǐ shuō shénme?`, `Hello, my signal is bad; what did you say?`, `Alô, bên mình sóng yếu, bạn nói gì?`], [`B`, `明天下午三点开会，在三楼会议室。`, `Míngtiān xiàwǔ sān diǎn kāihuì, zài sān lóu huìyìshì.`, `Meeting tomorrow 3 pm, 3rd-floor room.`, `Họp 3 giờ chiều mai, phòng họp tầng 3.`], [`A`, `我重复一下：明天下午三点，三楼，对吗？`, `Wǒ chóngfù yíxià: míngtiān xiàwǔ sān diǎn, sān lóu, duì ma?`, `Let me repeat: tomorrow 3 pm, 3rd floor, right?`, `Mình nhắc lại: mai 3 giờ chiều, tầng 3, đúng không?`], [`B`, `对，别忘了带电脑。`, `Duì, bié wàng le dài diànnǎo.`, `Right, don't forget your laptop.`, `Đúng, đừng quên mang laptop.`]],
    pit: [`Pretending to understand on the phone. Ask for repetition and repeat back the key numbers.`, `Giả vờ hiểu khi gọi điện. Hãy xin nhắc lại và đọc lại các con số chính.`],
    s: [[`Voice message: greeting, purpose, facts, request, closing.`, `Tin thoại: chào, mục đích, dữ kiện, đề nghị, kết.`], [`Repair phrases for bad connections.`, `Cụm sửa lỗi khi đường truyền kém.`], [`Repeat numbers back to confirm.`, `Nhắc lại con số để xác nhận.`]],
    l: ['social', 'pod', 'hello'],
    p: [[`What should A bring tomorrow?`, `Ngày mai A cần mang gì?`, `A laptop.`, `Laptop.`], [`Ask the speaker to talk more slowly.`, `Nhờ người nói chậm hơn.`, `请说慢一点儿。`, `请说慢一点儿。`]]
  }),
  D(P + '8-3', '8.3 Workplace requests, meetings and reporting', '8.3 Nhờ vả, họp và báo cáo trong công việc',
    'Cách nhờ, báo cáo tiến độ, thống nhất việc cần làm; nghe tóm tắt cuộc họp.', {
    n: '8.3',
    g: [[`Make polite requests to colleagues`, `Nhờ đồng nghiệp lịch sự`], [`Report progress in three sentences`, `Báo cáo tiến độ trong ba câu`]],
    b: [`<p>Requests escalate in politeness: 「帮我…」 (help me, to friends) → 「能不能帮我…？」 → 「麻烦您…」 → 「不好意思打扰一下，能请您…吗？」. Add deadlines: 「今天下班前」 (before leaving work), 「周五以前 yǐqián」. Accept: 「没问题」, 「好的，我马上去做」. Decline: 「现在有点儿忙，可以等一会儿吗？」.</p>
<p>Progress report in three parts: <strong>done – doing – need</strong>. 「报告已经写完了，PPT做了一半，还需要你们给我数据。」 Time words: 「已经 yǐjīng」 (already), 「还没 hái méi」 (not yet), 「正在 zhèngzài」 (in the process of), 「快…了」 (nearly). Numbers for progress: 「完成了百分之八十」 (80% done).</p>
<p>Meeting language: 「我先说一下」, 「我补充一点」 (let me add a point), 「我同意」, 「有什么问题吗？」, 「我们总结一下」 (summarise). In a listening summary the speaker gives <em>decisions</em> («we decided…» 「我们决定…」) and <em>action items</em> («Xiao Li will…» 「小李负责…」, 「谁来做」). Notes: person → task → deadline.</p>
<p>Practise: record a 30-second progress report on a real assignment this week.</p>`,
       `<p>Lời nhờ tăng dần độ lịch sự: 「帮我…」 (giúp mình, với bạn) → 「能不能帮我…？」 → 「麻烦您…」 → 「不好意思打扰一下，能请您…吗？」. Thêm hạn chót: 「今天下班前」, 「周五以前 yǐqián」. Nhận lời: 「没问题」, 「好的，我马上去做」. Từ chối: 「现在有点儿忙，可以等一会儿吗？」.</p>
<p>Báo cáo tiến độ gồm ba phần: <strong>xong – đang làm – cần</strong>. 「报告已经写完了，PPT做了一半，还需要你们给我数据。」 Từ chỉ thời gian: 「已经 yǐjīng」 (đã), 「还没 hái méi」 (chưa), 「正在 zhèngzài」 (đang), 「快…了」 (sắp). Con số tiến độ: 「完成了百分之八十」 (xong 80%).</p>
<p>Ngôn ngữ họp: 「我先说一下」, 「我补充一点」, 「我同意」, 「有什么问题吗？」, 「我们总结一下」. Trong bản tóm tắt nghe, người nói đưa <em>quyết định</em> («chúng ta quyết định…» 「我们决定…」) và <em>đầu việc</em> («Tiểu Lý phụ trách…» 「小李负责…」, 「谁来做」). Ghi chú: người → việc → hạn.</p>
<p>Luyện tập: ghi âm báo cáo tiến độ 30 giây về một bài tập thật trong tuần này.</p>`],
    v: [[`负责`, `fùzé`, `be responsible for`, `phụ trách`], [`已经`, `yǐjīng`, `already`, `đã`], [`正在`, `zhèngzài`, `in the middle of`, `đang`], [`补充`, `bǔchōng`, `add`, `bổ sung`], [`决定`, `juédìng`, `decide`, `quyết định`], [`总结`, `zǒngjié`, `summarise`, `tổng kết`]],
    d: [[`A`, `报告写得怎么样了？`, `Bàogào xiě de zěnmeyàng le?`, `How is the report going?`, `Báo cáo viết đến đâu rồi?`], [`B`, `已经写完了，PPT正在做，完成了百分之六十。`, `Yǐjīng xiě wán le, PPT zhèngzài zuò, wánchéng le bǎi fēn zhī liùshí.`, `Report done, PPT in progress, 60%.`, `Báo cáo xong, PPT đang làm, được 60%.`], [`A`, `好，明天下班前发给我，可以吗？`, `Hǎo, míngtiān xiàbān qián fā gěi wǒ, kěyǐ ma?`, `OK, send it to me before the end of tomorrow?`, `Được, gửi cho mình trước khi tan làm mai nhé?`], [`B`, `没问题，我一定按时完成。`, `Méi wèntí, wǒ yídìng ànshí wánchéng.`, `No problem, I'll finish on time.`, `Không vấn đề, mình sẽ hoàn thành đúng hạn.`]],
    pit: [`Using 已经 together with a negative (✗ 已经没做). Say 还没做 for «not yet».`, `Dùng 已经 với phủ định (✗ 已经没做). Nói 还没做 cho «chưa làm».`],
    s: [[`Requests: 帮我 → 麻烦您.`, `Lời nhờ: 帮我 → 麻烦您.`], [`Progress: done, doing, need.`, `Tiến độ: xong, đang làm, cần.`], [`Meetings: decision + owner + deadline.`, `Họp: quyết định + người phụ trách + hạn.`]],
    l: ['intern', 'speak', 'role'],
    p: [[`What percent of the PPT is done?`, `PPT xong bao nhiêu phần trăm?`, `60%.`, `60%.`], [`Say «I haven't finished yet».`, `Nói «Tôi chưa làm xong».`, `我还没做完。`, `我还没做完。`]]
  }),
  Q(P + 'quiz-8', 'Quiz — Chapter 8', 'Quiz — Chương 8', [
    [[`实习 means`, `实习 nghĩa là`], [`internship`, `holiday`, `exam`, `salary`], 0, [`实 = real; 习 = practise.`, `Thực tập.`]],
    [[`贵公司 is`, `贵公司 là`], [`your company (respectful)`, `my company`, `a rich firm`, `a bank`], 0, [`贵 = honourable.`, `贵 = kính trọng.`]],
    [[`First part of a self-introduction`, `Phần đầu của tự giới thiệu`], [`name and school`, `salary`, `hobby only`, `goodbye`], 0, [`Start with identity.`, `Mở bằng danh tính.`]],
    [[`If you did not hear a question, you should`, `Nếu không nghe rõ câu hỏi, bạn nên`], [`ask for repetition`, `guess`, `stay silent`, `leave`], 0, [`Ask politely.`, `Hỏi lại lịch sự.`]],
    [[`信号不好 means`, `信号不好 nghĩa là`], [`the signal is bad`, `the sound is loud`, `no money`, `the room is cold`], 0, [`信号 = signal.`, `信号 = tín hiệu.`]],
    [[`幺 is read in numbers for`, `幺 trong số đọc cho`], [`1`, `7`, `0`, `2`], 0, [`yāo = 1.`, `yāo = số 1.`]],
    [[`A progress report has`, `Báo cáo tiến độ gồm`], [`done, doing, need`, `only date`, `only name`, `only joke`], 0, [`Three parts.`, `Ba phần.`]],
    [[`还没做 means`, `还没做 nghĩa là`], [`not done yet`, `already done`, `never will`, `done twice`], 0, [`还没 = not yet.`, `还没 = chưa.`]],
    [[`负责 means`, `负责 nghĩa là`], [`be responsible for`, `be late`, `be sick`, `be rich`], 0, [`Owner of a task.`, `Người phụ trách việc.`]],
  ]),
]));

// ===== Chương 9 =====
secs.push(SEC('Chapter 9 — Festivals, hosting and cultural differences', 'Chương 9 — Lễ hội, đón tiếp và khác biệt văn hoá',
  'Nghe–nói về lễ tết, làm khách và chủ nhà, và so sánh văn hoá Việt–Trung.', [
  D(P + '9-1', '9.1 Festivals: Spring Festival, Mid-Autumn, Dragon Boat', '9.1 Lễ tết: Xuân Tiết, Trung Thu, Đoan Ngọ',
    'Từ vựng và phong tục ba lễ lớn, nghe mô tả lễ hội, nói về lễ tết quê mình.', {
    n: '9.1',
    g: [[`Describe a festival: date, food, activities`, `Miêu tả lễ hội: ngày, món ăn, hoạt động`], [`Compare with a Vietnamese festival`, `So sánh với một lễ hội của Việt Nam`]],
    b: [`<p>Three festivals, one frame: <strong>name – date (lunar) – food – activities – meaning</strong>. 「春节 Chūnjié」 (Spring Festival): first day of the first lunar month; people eat 「饺子 jiǎozi」 on New Year's Eve in the north, give 「红包 hóngbāo」 (red envelopes), watch fireworks and visit relatives. Greetings: 「新年快乐」, 「恭喜发财 gōngxǐ fācái」, 「过年好」. 「中秋节 Zhōngqiūjié」: fifteenth day of the eighth lunar month; people eat 「月饼 yuèbǐng」 and look at the full moon with family. 「端午节 Duānwǔjié」: fifth day of the fifth lunar month; eat 「粽子 zòngzi」 and watch dragon-boat races.</p>
<p>Vietnamese Tết and Trung Thu are similar yet different (for example the Vietnamese Tết is not called 春节 and food differs). When you compare, use the patterns of Chapter 3: 「越南的春节叫Tết，我们吃粽子，不吃饺子」 (note: Vietnamese bánh chưng is wrapped in leaves, a good point for comparison). Use 「跟…一样」 and 「不同的是… bùtóng de shì」 (the difference is…).</p>
<p>Listening: festival descriptions have many foods and verbs. Make three columns: date, food, activity. Dates in the lunar calendar: 「农历 nónglì」 months and days: 「农历八月十五」. Questions often ask «what do people do on that day?».</p>
<p>Speaking task: in 6 sentences, introduce your favourite festival to a Chinese friend.</p>`,
       `<p>Ba lễ, một khung: <strong>tên – ngày (âm lịch) – món ăn – hoạt động – ý nghĩa</strong>. 「春节 Chūnjié」 (Tết Xuân): mồng một tháng Giêng âm lịch; người miền Bắc ăn 「饺子 jiǎozi」 đêm giao thừa, tặng 「红包 hóngbāo」 (phong bì đỏ), xem pháo hoa và thăm họ hàng. Lời chúc: 「新年快乐」, 「恭喜发财 gōngxǐ fācái」, 「过年好」. 「中秋节 Zhōngqiūjié」: ngày rằm tháng Tám âm lịch; ăn 「月饼 yuèbǐng」 và ngắm trăng tròn cùng gia đình. 「端午节 Duānwǔjié」: mồng năm tháng Năm âm lịch; ăn 「粽子 zòngzi」 và xem đua thuyền rồng.</p>
<p>Tết và Trung Thu của Việt Nam giống mà khác (ví dụ Tết Việt không gọi là 春节 và món ăn khác). Khi so sánh, dùng mẫu của Chương 3: 「越南的春节叫Tết，我们吃粽子，不吃饺子」 (lưu ý: bánh chưng Việt gói bằng lá, điểm hay để so sánh). Dùng 「跟…一样」 và 「不同的是… bùtóng de shì」 (khác ở chỗ…).</p>
<p>Khi nghe: mô tả lễ hội có nhiều món và động từ. Lập ba cột: ngày, món, hoạt động. Ngày âm lịch: 「农历 nónglì」 tháng và ngày: 「农历八月十五」. Câu hỏi thường hỏi «vào ngày đó mọi người làm gì?».</p>
<p>Bài nói: trong 6 câu, giới thiệu lễ hội bạn thích nhất cho một người bạn Trung Quốc.</p>`],
    v: [[`农历`, `nónglì`, `lunar calendar`, `âm lịch`], [`红包`, `hóngbāo`, `red envelope`, `lì xì`], [`月饼`, `yuèbǐng`, `mooncake`, `bánh trung thu`], [`粽子`, `zòngzi`, `sticky-rice dumpling`, `bánh ú / bánh chưng kiểu Trung`], [`恭喜发财`, `gōngxǐ fācái`, `wishing you prosperity`, `chúc phát tài`], [`不同`, `bùtóng`, `different`, `khác nhau`]],
    d: [[`A`, `中秋节你们越南人也吃月饼吗？`, `Zhōngqiūjié nǐmen Yuènán rén yě chī yuèbǐng ma?`, `Do Vietnamese eat mooncakes at Mid-Autumn too?`, `Trung Thu người Việt các bạn cũng ăn bánh trung thu à?`], [`B`, `吃，小孩子还会提着灯笼玩。`, `Chī, xiǎo háizi hái huì tízhe dēnglong wán.`, `Yes, and children play with lanterns.`, `Có, trẻ con còn xách đèn lồng đi chơi.`], [`A`, `跟中国一样，也有赏月吗？`, `Gēn Zhōngguó yíyàng, yě yǒu shǎng yuè ma?`, `Like China, do you look at the moon?`, `Giống Trung Quốc, có ngắm trăng không?`], [`B`, `有，不同的是我们还有舞狮。`, `Yǒu, bùtóng de shì wǒmen hái yǒu wǔshī.`, `Yes; the difference is we also have lion dances.`, `Có, khác ở chỗ chúng mình còn có múa lân.`]],
    pit: [`Giving the solar date instead of the lunar date. Always say 农历 for the traditional festivals.`, `Nói ngày dương lịch thay vì âm lịch. Với lễ truyền thống hãy nói 农历.`],
    s: [[`Frame: name, lunar date, food, activities, meaning.`, `Khung: tên, ngày âm, món ăn, hoạt động, ý nghĩa.`], [`Greetings: 新年快乐, 恭喜发财.`, `Lời chúc: 新年快乐, 恭喜发财.`], [`Compare with 跟…一样 and 不同的是.`, `So sánh với 跟…一样 và 不同的是.`]],
    l: ['cny', 'mid', 'dragon'],
    p: [[`What do people eat at Mid-Autumn?`, `Trung Thu người ta ăn gì?`, `月饼 mooncakes.`, `月饼 bánh trung thu.`], [`Which date is Mid-Autumn?`, `Trung Thu vào ngày nào?`, `15th of the 8th lunar month.`, `Rằm tháng Tám âm lịch.`]]
  }),
  D(P + '9-2', '9.2 Hosting, being a guest, gifts and toasts', '9.2 Đón khách, làm khách, quà tặng và nâng ly',
    'Lời lẽ khi đến nhà, ăn cơm, tặng quà và nâng ly; những điều nên và không nên.', {
    n: '9.2',
    g: [[`Greet, thank and respond as a host and a guest`, `Chào, cảm ơn và đáp lại với tư cách chủ và khách`], [`Know a few etiquette rules to avoid mistakes`, `Biết vài quy tắc ứng xử để tránh lỗi`]],
    b: [`<p>Arriving: guest says 「打扰了 dǎrǎo le」 (sorry to disturb) and presents a gift: 「一点儿小礼物，请收下」 (a small gift, please accept). The host first refuses politely: 「你太客气了」, then accepts: 「谢谢，快请进」. In China a gift is often not opened in front of the giver. Avoid gifts of clocks (送钟 sounds like 送终, a funeral) and sets of four (四 sounds like 死).</p>
<p>At the table the host keeps adding food: 「多吃点儿」, 「别客气」, 「再来一碗」. Polite answers: 「够了，谢谢」 (enough) or 「我吃饱了」. Toasts: 「干杯 gānbēi」 (bottoms up), 「祝你健康」, 「欢迎你来」; in many settings the junior person holds their glass lower than the senior. Tea: tap two fingers on the table to say thanks when someone pours.</p>
<p>Leaving: 「今天太麻烦你们了」 (sorry to have troubled you), host: 「哪里哪里，欢迎再来」. A thank-you message the next day is a good habit: 「昨天谢谢你的招待 zhāodài」.</p>
<p>For listening tests, such conversations are heavy on formulaic politeness; match each formula to its situation: invitation, gift, food, leaving. The answers usually test whether the guest accepted or refused something.</p>`,
       `<p>Khi đến: khách nói 「打扰了 dǎrǎo le」 (xin lỗi làm phiền) và đưa quà: 「一点儿小礼物，请收下」 (chút quà nhỏ, xin nhận cho). Chủ nhà thường từ chối lịch sự trước: 「你太客气了」, rồi mới nhận: 「谢谢，快请进」. Ở Trung Quốc thường không mở quà ngay trước mặt người tặng. Tránh tặng đồng hồ (送钟 nghe như 送终, đám tang) và bộ bốn món (四 gần âm 死).</p>
<p>Ở bàn ăn chủ nhà liên tục gắp thêm: 「多吃点儿」, 「别客气」, 「再来一碗」. Đáp lịch sự: 「够了，谢谢」 hoặc 「我吃饱了」. Nâng ly: 「干杯 gānbēi」, 「祝你健康」, 「欢迎你来」; trong nhiều dịp người nhỏ tuổi cầm ly thấp hơn người lớn. Trà: gõ hai ngón tay lên bàn để cảm ơn khi có người rót.</p>
<p>Khi về: 「今天太麻烦你们了」, chủ nhà: 「哪里哪里，欢迎再来」. Gửi tin cảm ơn hôm sau là thói quen tốt: 「昨天谢谢你的招待 zhāodài」.</p>
<p>Với bài thi nghe, hội thoại kiểu này đầy lời lịch sự khuôn mẫu; hãy ghép mỗi khuôn với tình huống: mời, quà, ăn uống, ra về. Đáp án thường kiểm tra khách đã nhận hay từ chối điều gì.</p>`],
    v: [[`打扰`, `dǎrǎo`, `disturb`, `làm phiền`], [`客气`, `kèqi`, `polite / formal`, `khách sáo`], [`干杯`, `gānbēi`, `cheers`, `cạn ly`], [`招待`, `zhāodài`, `hospitality`, `sự đón tiếp`], [`礼物`, `lǐwù`, `gift`, `quà`], [`麻烦`, `máfan`, `trouble`, `phiền phức`]],
    d: [[`客`, `打扰了，一点儿小礼物，请收下。`, `Dǎrǎo le, yìdiǎnr xiǎo lǐwù, qǐng shōuxià.`, `Sorry to disturb; a small gift, please accept.`, `Xin làm phiền, chút quà nhỏ, xin nhận cho.`], [`主`, `你太客气了！快请进，请坐。`, `Nǐ tài kèqi le! Kuài qǐng jìn, qǐng zuò.`, `You shouldn't have! Please come in and sit.`, `Bạn khách sáo quá! Mời vào, mời ngồi.`], [`主`, `多吃点儿，别客气。`, `Duō chī diǎnr, bié kèqi.`, `Eat more, don't be shy.`, `Ăn nhiều vào, đừng khách sáo.`], [`客`, `我吃饱了，谢谢。今天太麻烦你们了。`, `Wǒ chī bǎo le, xièxie. Jīntiān tài máfan nǐmen le.`, `I am full, thanks. Sorry for all the trouble.`, `Mình no rồi, cảm ơn. Hôm nay làm phiền các bạn quá.`]],
    pit: [`Accepting a gift at once or praising a host too directly. A short polite refusal first is expected, and the host's cooking praise is answered with 哪里哪里.`, `Nhận quà ngay hoặc khen chủ nhà quá thẳng. Thường được mong đợi từ chối nhẹ trước, và lời khen món ăn được đáp bằng 哪里哪里.`],
    s: [[`Gift formulas: 一点儿小礼物 / 你太客气了.`, `Công thức quà: 一点儿小礼物 / 你太客气了.`], [`Table: 多吃点儿 / 我吃饱了.`, `Bàn ăn: 多吃点儿 / 我吃饱了.`], [`Leaving: 太麻烦你们了 / 欢迎再来.`, `Ra về: 太麻烦你们了 / 欢迎再来.`]],
    l: ['role', 'mand', 'pod'],
    p: [[`Reply politely to «多吃点儿！» when you are full.`, `Đáp lịch sự «多吃点儿！» khi bạn đã no.`, `我吃饱了，谢谢。`, `我吃饱了，谢谢。`], [`Why avoid giving a clock?`, `Vì sao tránh tặng đồng hồ?`, `送钟 sounds like 送终 (funeral).`, `送钟 gần âm 送终 (tang lễ).`]]
  }),
  D(P + '9-3', '9.3 Culture talk: comparing Vietnam and China', '9.3 Chuyện văn hoá: so sánh Việt Nam và Trung Quốc',
    'Nói về thói quen giống–khác, kể chuyện văn hoá và hỏi–đáp trong buổi giao lưu.', {
    n: '9.3',
    g: [[`Explain a custom of your country to a Chinese friend`, `Giải thích một phong tục nước mình cho bạn Trung`], [`Ask respectful questions about the other culture`, `Hỏi tôn trọng về văn hoá của đối phương`]],
    b: [`<p>In exchange events you will often be asked: 「在你们国家…？」. Use a three-step frame: <strong>describe – give a reason – compare</strong>. 「在越南，见面的时候年轻人要先问候长辈，因为我们很尊敬老人。跟中国有点儿像。」 Vocabulary: 「习惯 xíguàn」 (habit/custom), 「传统 chuántǒng」 (tradition), 「尊敬 zūnjìng」 (respect), 「礼貌 lǐmào」 (politeness), 「长辈 zhǎngbèi」 (elders), 「不同 / 相同」, 「有意思」.</p>
<p>Ask politely: 「请问，在中国…是不是…？」 「我可以问一个问题吗？」 「我不太了解，能给我介绍一下吗？」 (I don't know much, can you tell me?). Avoid judging: say 「不一样」 instead of 「不好」. React with interest: 「原来是这样 yuánlái shì zhèyàng」 (so that's how it is), 「我第一次知道」 (first time I knew this), 「真有意思」.</p>
<p>Topics that often surprise learners: saying «have you eaten?» 「吃了吗」 as a greeting, direct questions about age or salary (not rude in many settings), hot water instead of cold, noodles on birthdays for long life. Treat each as a story: <em>I was surprised that… because…</em> 「我很惊讶，因为…」.</p>
<p>When listening, expect the speaker to say 「其实 qíshí」 (actually) before a correction of a stereotype. The point after 其实 is the real answer.</p>`,
       `<p>Trong các buổi giao lưu bạn hay được hỏi: 「在你们国家…？」. Dùng khung ba bước: <strong>mô tả – nêu lý do – so sánh</strong>. 「在越南，见面的时候年轻人要先问候长辈，因为我们很尊敬老人。跟中国有点儿像。」 Từ vựng: 「习惯 xíguàn」 (thói quen/phong tục), 「传统 chuántǒng」 (truyền thống), 「尊敬 zūnjìng」 (tôn kính), 「礼貌 lǐmào」 (lịch sự), 「长辈 zhǎngbèi」 (bề trên), 「不同 / 相同」, 「有意思」.</p>
<p>Hỏi lịch sự: 「请问，在中国…是不是…？」 「我可以问一个问题吗？」 「我不太了解，能给我介绍一下吗？」. Tránh phán xét: nói 「不一样」 thay vì 「不好」. Phản hồi quan tâm: 「原来是这样 yuánlái shì zhèyàng」 (thì ra là vậy), 「我第一次知道」, 「真有意思」.</p>
<p>Chủ đề hay làm người học ngạc nhiên: chào «Ăn chưa?» 「吃了吗」, hỏi thẳng tuổi hay lương (nhiều nơi không bị coi là thô), uống nước nóng thay vì lạnh, ăn mì ngày sinh nhật để sống lâu. Hãy kể mỗi điều như một câu chuyện: <em>Tôi ngạc nhiên vì… bởi…</em> 「我很惊讶，因为…」.</p>
<p>Khi nghe, người nói thường dùng 「其实 qíshí」 (thật ra) trước khi đính chính một định kiến. Ý sau 其实 mới là đáp án thật.</p>`],
    v: [[`习惯`, `xíguàn`, `custom, habit`, `phong tục, thói quen`], [`传统`, `chuántǒng`, `tradition`, `truyền thống`], [`尊敬`, `zūnjìng`, `respect`, `tôn kính`], [`其实`, `qíshí`, `actually`, `thật ra`], [`原来`, `yuánlái`, `so, as it turns out`, `thì ra`], [`惊讶`, `jīngyà`, `surprised`, `ngạc nhiên`]],
    d: [[`A`, `在越南，吃饭的时候也要先请长辈吗？`, `Zài Yuènán, chīfàn de shíhou yě yào xiān qǐng zhǎngbèi ma?`, `In Vietnam do you also invite elders to eat first?`, `Ở Việt Nam, khi ăn cũng mời người lớn trước à?`], [`B`, `对，这是一种礼貌，也是传统。`, `Duì, zhè shì yì zhǒng lǐmào, yě shì chuántǒng.`, `Yes, it is politeness and tradition.`, `Đúng, đó là phép lịch sự và cũng là truyền thống.`], [`A`, `原来是这样，跟中国一样。`, `Yuánlái shì zhèyàng, gēn Zhōngguó yíyàng.`, `I see, same as China.`, `Thì ra vậy, giống Trung Quốc.`], [`B`, `其实还有不同的地方，下次再给你介绍。`, `Qíshí hái yǒu bùtóng de dìfang, xiàcì zài gěi nǐ jièshào.`, `Actually there are differences too; I'll tell you next time.`, `Thật ra còn có điểm khác, lần sau mình kể.`]],
    pit: [`Judging with «good/bad». Use 不一样 and explain the reason; this keeps conversations friendly.`, `Phán xét «tốt/xấu». Hãy dùng 不一样 và giải thích lý do; như vậy cuộc trò chuyện thân thiện hơn.`],
    s: [[`Describe, give a reason, compare.`, `Mô tả, nêu lý do, so sánh.`], [`其实 introduces the real point.`, `其实 mở ra ý thật.`], [`Ask politely and react with interest.`, `Hỏi lịch sự và phản hồi quan tâm.`]],
    l: ['mand', 'role', 'yoyo'],
    p: [[`What does 其实 signal?`, `其实 báo hiệu điều gì?`, `A correction or the real situation.`, `Một sự đính chính hoặc sự thật.`], [`Say: In Vietnam we respect elders.`, `Nói: Ở Việt Nam chúng tôi tôn kính người lớn.`, `在越南，我们很尊敬长辈。`, `在越南，我们很尊敬长辈。`]]
  }),
  Q(P + 'quiz-9', 'Quiz — Chapter 9', 'Quiz — Chương 9', [
    [[`春节 is`, `春节 là`], [`Spring Festival`, `Mid-Autumn`, `Dragon Boat`, `Labour Day`], 0, [`Chinese New Year.`, `Tết Nguyên đán Trung Hoa.`]],
    [[`月饼 is eaten at`, `月饼 ăn vào`], [`Mid-Autumn`, `Spring Festival`, `Dragon Boat`, `birthdays only`], 0, [`Moon festival food.`, `Món của Trung Thu.`]],
    [[`农历 means`, `农历 nghĩa là`], [`lunar calendar`, `solar`, `weekday`, `holiday`], 0, [`Traditional festivals follow it.`, `Lễ truyền thống theo nó.`]],
    [[`不同的是 introduces`, `不同的是 dẫn vào`], [`a difference`, `a question`, `a greeting`, `a price`], 0, [`The difference is…`, `Khác ở chỗ…`]],
    [[`A host first says 你太客气了 when`, `Chủ nhà nói 你太客气了 khi`], [`receiving a gift`, `saying goodbye`, `being late`, `paying`], 0, [`Polite refusal before accepting.`, `Từ chối nhẹ trước khi nhận.`]],
    [[`Why avoid a clock as a gift?`, `Vì sao tránh tặng đồng hồ?`], [`送钟 sounds like 送终`, `too expensive`, `too heavy`, `no reason`], 0, [`Sound association.`, `Liên tưởng âm.`]],
    [[`干杯 means`, `干杯 nghĩa là`], [`cheers`, `thank you`, `goodbye`, `sorry`], 0, [`Empty the glass.`, `Cạn ly.`]],
    [[`其实 usually introduces`, `其实 thường dẫn vào`], [`the real situation`, `a number`, `a place`, `a name`], 0, [`Actually…`, `Thật ra…`]],
    [[`Avoid judging a custom by saying`, `Tránh phán xét phong tục bằng cách nói`], [`不好 (bad)`, `不一样`, `有意思`, `我不了解`], 0, [`Use neutral words.`, `Dùng từ trung lập.`]],
  ]),
]));

// ===== Chương 10 =====
secs.push(SEC('Chapter 10 — Speaking projects and HSK 3 listening formats', 'Chương 10 — Dự án nói và dạng đề nghe HSK 3',
  'Thuyết trình 3 phút, thảo luận và nhập vai tổng hợp, bốn phần nghe HSK 3 và bài thi thử cuối môn.', [
  D(P + '10-1', '10.1 A three-minute presentation', '10.1 Bài thuyết trình 3 phút',
    'Cấu trúc 首先–其次–最后, mở bài và kết bài, ngôn ngữ cơ thể và xử lý câu hỏi.', {
    n: '10.1',
    g: [[`Build a 3-minute talk with opening, 3 points and closing`, `Dựng bài nói 3 phút gồm mở đầu, 3 ý và kết`], [`Answer audience questions`, `Trả lời câu hỏi của người nghe`]],
    b: [`<p>A 3-minute talk is about 350–450 syllables at HSK 3 level. Use a fixed skeleton: <strong>opening – three points – closing</strong>. Opening: greet, say the topic, say the plan: 「大家好，我今天想介绍我的家乡。我主要讲三个方面：美食、风景和人。」 Points: 「首先 shǒuxiān… 其次 qícì… 最后 zuìhòu…」 (first… second… finally…). Closing: summarise and thank: 「总之 zǒngzhī，我的家乡很美。谢谢大家！」 (in short…).</p>
<p>Make each point: claim + example + short detail. Prepare an outline of keywords, not a full script; read keywords, not sentences. Use short sentences with the connectors of Chapter 2. Give numbers (「有两千年的历史」) and a personal feeling (「我最喜欢…」).</p>
<p>Delivery: stand straight, look at the audience, speak slowly at the start (nerves speed you up), and keep your tones clear. Pause after each point. Do not apologise for your Chinese at the start.</p>
<p>Q&A: listen for the question word and repeat it: 「您问的是…对吗？」 If you do not know: 「这个问题我还没想过，不过我觉得…」. Thank the questioner: 「谢谢你的问题」.</p>
<p>Peer feedback: give one good point and one improvement using the form 「我觉得你…很好，如果…会更好」.</p>`,
       `<p>Bài nói 3 phút khoảng 350–450 âm tiết ở trình độ HSK 3. Dùng bộ khung cố định: <strong>mở đầu – ba ý – kết</strong>. Mở đầu: chào, nêu chủ đề, nêu kế hoạch: 「大家好，我今天想介绍我的家乡。我主要讲三个方面：美食、风景和人。」 Các ý: 「首先 shǒuxiān… 其次 qícì… 最后 zuìhòu…」 (thứ nhất… thứ hai… cuối cùng…). Kết: tóm lại và cảm ơn: 「总之 zǒngzhī，我的家乡很美。谢谢大家！」 (tóm lại…).</p>
<p>Mỗi ý gồm: nhận định + ví dụ + chi tiết ngắn. Chuẩn bị dàn ý từ khoá, không phải bài viết đầy đủ; đọc từ khoá chứ không đọc câu. Dùng câu ngắn với liên từ của Chương 2. Đưa con số (「有两千年的历史」) và cảm xúc riêng (「我最喜欢…」).</p>
<p>Cách trình bày: đứng thẳng, nhìn người nghe, bắt đầu chậm (hồi hộp làm bạn nói nhanh), giữ thanh điệu rõ. Dừng sau mỗi ý. Đừng xin lỗi về tiếng Trung của mình ngay từ đầu.</p>
<p>Hỏi đáp: nghe từ nghi vấn và nhắc lại: 「您问的是…对吗？」 Nếu không biết: 「这个问题我还没想过，不过我觉得…」. Cảm ơn người hỏi: 「谢谢你的问题」.</p>
<p>Góp ý đồng đẳng: nêu một điểm tốt và một điểm cải thiện theo mẫu 「我觉得你…很好，如果…会更好」.</p>`],
    v: [[`首先`, `shǒuxiān`, `first of all`, `trước hết`], [`其次`, `qícì`, `secondly`, `thứ hai`], [`总之`, `zǒngzhī`, `in short`, `tóm lại`], [`方面`, `fāngmiàn`, `aspect`, `phương diện`], [`介绍`, `jièshào`, `introduce`, `giới thiệu`], [`历史`, `lìshǐ`, `history`, `lịch sử`]],
    d: [[`听众`, `请问，你家乡最有名的是什么？`, `Qǐngwèn, nǐ jiāxiāng zuì yǒumíng de shì shénme?`, `What is your hometown most famous for?`, `Xin hỏi, quê bạn nổi tiếng nhất về điều gì?`], [`讲者`, `您问的是最有名的美食，对吗？是河粉，很多人都喜欢。`, `Nín wèn de shì zuì yǒumíng de měishí, duì ma? Shì hé fěn, hěn duō rén dōu xǐhuan.`, `You mean famous food? It is rice noodle soup, many people like it.`, `Bạn hỏi món ăn nổi tiếng nhất đúng không? Là phở, nhiều người thích.`], [`听众`, `谢谢，听起来很好吃。`, `Xièxie, tīng qǐlái hěn hǎochī.`, `Thanks, sounds delicious.`, `Cảm ơn, nghe rất ngon.`]],
    pit: [`Reading a full script with eyes down. Use a keyword outline and look up at each sentence end.`, `Đọc cả bài với mắt nhìn xuống. Dùng dàn ý từ khoá và ngẩng lên ở cuối mỗi câu.`],
    s: [[`Skeleton: opening, three points, closing.`, `Bộ khung: mở đầu, ba ý, kết.`], [`Each point: claim, example, detail.`, `Mỗi ý: nhận định, ví dụ, chi tiết.`], [`In Q&A, repeat the question first.`, `Khi hỏi đáp, nhắc lại câu hỏi trước.`]],
    l: ['speak', 'role', 'listen'],
    p: [[`List the three signposts of a talk.`, `Kể ba từ báo hiệu của bài nói.`, `首先, 其次, 最后.`, `首先, 其次, 最后.`], [`How do you politely check a question?`, `Kiểm tra câu hỏi lịch sự thế nào?`, `您问的是…对吗？`, `您问的是…对吗？`]]
  }),
  D(P + '10-2', '10.2 Discussion and integrated role-plays', '10.2 Thảo luận và nhập vai tổng hợp',
    'Ba tình huống tổng hợp, tiêu chí chấm nói và cách tự đánh giá.', {
    n: '10.2',
    g: [[`Run three integrated role-plays`, `Thực hiện ba tình huống nhập vai tổng hợp`], [`Use a speaking rubric to self-assess`, `Dùng thang chấm nói để tự đánh giá`]],
    b: [`<p>The role-plays combine earlier chapters. Each is 2–3 minutes with a partner; swap roles.</p>
<ol><li><strong>Clinic with a deadline</strong> (Ch. 5 + 8): you feel ill the day before a presentation. Describe symptoms, ask the doctor for a sick note, then phone your teacher to postpone and repeat the new time to confirm.</li><li><strong>Weekend plan fails</strong> (Ch. 6 + 7): bad weather cancels a trip. Propose an alternative, invite your friend, handle a refused invitation politely.</li><li><strong>Cultural exchange dinner</strong> (Ch. 3 + 9): you host a Chinese friend. Greet, offer food, compare festivals, give opinions on a custom and thank each other.</li></ol>
<h4>Speaking rubric (self-authored, 4 × 5 points)</h4>
<table><thead><tr><th>Criterion</th><th>Strong (5)</th><th>Weak (1–2)</th></tr></thead><tbody>
<tr><td>Tones & pronunciation</td><td>clear, natural rhythm</td><td>many tone errors hide meaning</td></tr>
<tr><td>Fluency</td><td>short pauses, groups</td><td>long silences, word by word</td></tr>
<tr><td>Content & accuracy</td><td>complete, correct patterns</td><td>missing information</td></tr>
<tr><td>Interaction</td><td>asks, reacts, repairs</td><td>answers only, no repair</td></tr></tbody></table>
<p>Record each role-play, listen once for each criterion, and write one goal for next time. Compare with your first recording from lesson 1.4: you should hear faster groups and fewer tone slips.</p>`,
       `<p>Các tình huống kết hợp nhiều chương. Mỗi tình huống 2–3 phút với bạn cặp; đổi vai.</p>
<ol><li><strong>Phòng khám trước hạn chót</strong> (Ch. 5 + 8): bạn ốm ngay trước ngày thuyết trình. Tả triệu chứng, xin bác sĩ giấy nghỉ, rồi gọi thầy cô xin dời và nhắc lại giờ mới để xác nhận.</li><li><strong>Kế hoạch cuối tuần đổ bể</strong> (Ch. 6 + 7): thời tiết xấu làm huỷ chuyến đi. Đề xuất phương án khác, mời bạn, và xử lý lịch sự khi bị từ chối.</li><li><strong>Bữa tối giao lưu văn hoá</strong> (Ch. 3 + 9): bạn đón một người bạn Trung Quốc. Chào, mời món, so sánh lễ tết, nêu ý kiến về một phong tục và cảm ơn nhau.</li></ol>
<h4>Thang chấm nói (tự soạn, 4 × 5 điểm)</h4>
<table><thead><tr><th>Tiêu chí</th><th>Tốt (5)</th><th>Yếu (1–2)</th></tr></thead><tbody>
<tr><td>Thanh điệu & phát âm</td><td>rõ, nhịp tự nhiên</td><td>nhiều lỗi thanh làm mất nghĩa</td></tr>
<tr><td>Độ trôi chảy</td><td>ngắt ngắn, theo nhóm</td><td>im lặng dài, từng chữ</td></tr>
<tr><td>Nội dung & chính xác</td><td>đầy đủ, mẫu câu đúng</td><td>thiếu thông tin</td></tr>
<tr><td>Tương tác</td><td>hỏi, phản hồi, sửa lỗi</td><td>chỉ trả lời, không sửa lỗi</td></tr></tbody></table>
<p>Ghi âm mỗi tình huống, nghe một lần cho từng tiêu chí và viết một mục tiêu cho lần sau. So với bản ghi âm đầu tiên ở bài 1.4: bạn sẽ nghe nhóm ngắt nhanh hơn và ít lỗi thanh hơn.</p>`],
    d: [[`A`, `我明天要做报告，可是今天发烧了，怎么办？`, `Wǒ míngtiān yào zuò bàogào, kěshì jīntiān fāshāo le, zěnme bàn?`, `I present tomorrow but have a fever today. What to do?`, `Mai mình phải báo cáo mà hôm nay lại sốt, làm sao đây?`], [`B`, `你最好先去医院，然后给老师打电话，请她推迟。`, `Nǐ zuìhǎo xiān qù yīyuàn, ránhòu gěi lǎoshī dǎ diànhuà, qǐng tā tuīchí.`, `Best go to hospital first, then call the teacher to postpone.`, `Tốt nhất đi bệnh viện trước, rồi gọi thầy xin dời.`], [`A`, `好的，我再问一下，推迟到下周三，对吗？`, `Hǎo de, wǒ zài wèn yíxià, tuīchí dào xià Zhōusān, duì ma?`, `OK, postponed to next Wednesday, right?`, `Được, mình hỏi lại, dời tới thứ Tư tuần sau đúng không?`]],
    dn: [`Model start for role-play 1.`, `Mở đầu mẫu cho tình huống 1.`],
    pit: [`Scoring yourself only on grammar. Interaction (asking, repairing) counts as much as accuracy.`, `Chỉ chấm mình về ngữ pháp. Tương tác (hỏi, sửa lỗi) quan trọng không kém độ chính xác.`],
    s: [[`Three integrated role-plays from Chapters 3–9.`, `Ba tình huống tổng hợp từ Chương 3–9.`], [`Rubric: tones, fluency, content, interaction.`, `Thang chấm: thanh điệu, trôi chảy, nội dung, tương tác.`], [`Record, listen, set one goal.`, `Ghi âm, nghe lại, đặt một mục tiêu.`]],
    l: ['role', 'debate', 'shadow'],
    p: [[`Name the four rubric criteria.`, `Kể bốn tiêu chí thang chấm.`, `Tones & pronunciation, fluency, content & accuracy, interaction.`, `Thanh điệu & phát âm, trôi chảy, nội dung & chính xác, tương tác.`], [`Why record yourself?`, `Vì sao nên ghi âm chính mình?`, `To hear errors and measure progress.`, `Để nghe lỗi và đo tiến bộ.`]]
  }),
  D(P + '10-3', '10.3 HSK 3 listening: four parts and strategies', '10.3 Nghe HSK 3: bốn phần và chiến lược',
    'Cấu trúc bài nghe HSK 3 (định dạng cổ điển), chiến lược theo từng phần, kèm lưu ý HSK 3.0.', {
    n: '10.3',
    g: [[`Describe the four listening parts of a classic HSK 3 paper`, `Mô tả bốn phần nghe của đề HSK 3 cổ điển`], [`Apply one strategy to each part`, `Áp dụng một chiến lược cho từng phần`]],
    b: [`<div class="callout"><strong>⚠️ Check the current format.</strong> The summary below follows the classic HSK 3 (about 40 listening questions, roughly 35 minutes). HSK 3.0 changes the standards and some task types; confirm the format on the official HSK site before you sit an exam.</div>
<ol><li><strong>Part 1 — match pictures:</strong> you hear short sentences and match each to a picture. Strategy: scan pictures first, label the key object in each (a person, an action).</li><li><strong>Part 2 — true / false:</strong> you read a printed sentence and hear a short passage; decide if they agree. Strategy: read the printed sentence, predict which word will be repeated or changed (number, time, negation).</li><li><strong>Part 3 — short dialogues:</strong> a two-turn dialogue and a question with three options. Strategy: underline the difference between options; the answer is usually in the second speaker's turn.</li><li><strong>Part 4 — longer dialogues:</strong> four turns or more, one question. Strategy: use Chapter 2 signposts; listen for a change of mind (但是, 不过, 后来) and for the final decision.</li></ol>
<p>Time management: you cannot replay. Use the pause between questions to read the next options. If you miss one question, skip it mentally and prepare for the next; dwelling costs two questions.</p>
<p>Practice with timed audio sets, then review each error by type: missed word, misheard number, wrong inference, trap. Keep an error log with the category and the fix.</p>`,
       `<div class="callout"><strong>⚠️ Hãy kiểm tra định dạng hiện hành.</strong> Tóm tắt dưới đây theo HSK 3 cổ điển (khoảng 40 câu nghe, chừng 35 phút). HSK 3.0 thay đổi chuẩn và một số dạng bài; hãy xác nhận định dạng trên trang HSK chính thức trước khi thi.</div>
<ol><li><strong>Phần 1 — ghép tranh:</strong> nghe câu ngắn và ghép với bức tranh. Chiến lược: xem lướt tranh trước, gắn nhãn vật chính trong mỗi tranh (người, hành động).</li><li><strong>Phần 2 — đúng / sai:</strong> đọc một câu in sẵn và nghe đoạn ngắn; quyết định có khớp không. Chiến lược: đọc câu in, đoán từ nào sẽ được lặp hoặc đổi (số, thời gian, phủ định).</li><li><strong>Phần 3 — hội thoại ngắn:</strong> hội thoại hai lượt và một câu hỏi có ba lựa chọn. Chiến lược: gạch chân chỗ khác nhau giữa các lựa chọn; đáp án thường nằm ở lượt của người nói thứ hai.</li><li><strong>Phần 4 — hội thoại dài hơn:</strong> bốn lượt trở lên, một câu hỏi. Chiến lược: dùng từ báo hiệu của Chương 2; nghe chỗ đổi ý (但是, 不过, 后来) và quyết định cuối cùng.</li></ol>
<p>Quản lý thời gian: không nghe lại được. Dùng quãng nghỉ giữa các câu để đọc trước lựa chọn tiếp theo. Nếu lỡ một câu, bỏ qua trong đầu và chuẩn bị câu sau; chần chừ sẽ mất hai câu.</p>
<p>Luyện với bộ đề nghe có tính giờ, rồi xem lại từng lỗi theo loại: sót từ, nghe nhầm số, suy luận sai, mắc bẫy. Giữ nhật ký lỗi với loại lỗi và cách sửa.</p>`],
    d: [[`男`, `你昨天不是说今天去买书吗？`, `Nǐ zuótiān bú shì shuō jīntiān qù mǎi shū ma?`, `Didn't you say yesterday you would buy books today?`, `Hôm qua bạn chẳng nói hôm nay đi mua sách sao?`], [`女`, `本来是的，可是下雨了，所以我改到明天了。`, `Běnlái shì de, kěshì xià yǔ le, suǒyǐ wǒ gǎi dào míngtiān le.`, `Originally yes, but it rained, so I moved it to tomorrow.`, `Vốn là thế, nhưng trời mưa nên mình dời sang mai.`]],
    dn: [`Question: When will the woman buy the books? (Answer: tomorrow.)`, `Câu hỏi: Người phụ nữ sẽ mua sách khi nào? (Đáp án: ngày mai.)`],
    pit: [`Choosing «today» because 今天 was the first time word. The change (改到明天) is the answer.`, `Chọn «hôm nay» vì 今天 là từ chỉ thời gian đầu tiên. Chỗ đổi (改到明天) mới là đáp án.`],
    s: [[`Four parts: pictures, true/false, short dialogues, long dialogues.`, `Bốn phần: tranh, đúng/sai, hội thoại ngắn, hội thoại dài.`], [`Read options during pauses.`, `Đọc lựa chọn trong quãng nghỉ.`], [`Keep an error log by type.`, `Giữ nhật ký lỗi theo loại.`]],
    l: ['hskoff', 'hsk', 'pod'],
    p: [[`Which part uses printed sentences you must compare with audio?`, `Phần nào dùng câu in sẵn để so với âm thanh?`, `Part 2 (true / false).`, `Phần 2 (đúng / sai).`], [`What is the answer to the sample question and why?`, `Đáp án câu hỏi mẫu là gì và vì sao?`, `Tomorrow — 改到明天 reveals the changed plan.`, `Ngày mai — 改到明天 cho thấy kế hoạch đã đổi.`]]
  }),
  D(P + '10-4', '10.4 Final mock and self-assessment', '10.4 Bài thi thử cuối môn và tự đánh giá',
    'Kế hoạch ôn tập 2 tuần, mẫu bài nghe thử tự soạn kèm đáp án, bảng tự đánh giá.', {
    n: '10.4',
    g: [[`Plan a two-week review`, `Lập kế hoạch ôn hai tuần`], [`Do a mini mock and diagnose your level`, `Làm bài thi thử nhỏ và chẩn đoán trình độ`]],
    b: [`<h4>Two-week plan</h4>
<table><thead><tr><th>Days</th><th>Focus</th><th>Task</th></tr></thead><tbody>
<tr><td>1–3</td><td>Connected speech</td><td>shadow three dialogues per day; record once</td></tr>
<tr><td>4–6</td><td>Topics 5–9</td><td>role-play each topic with a partner</td></tr>
<tr><td>7–9</td><td>Strategies</td><td>timed sets; error log by type</td></tr>
<tr><td>10–12</td><td>Presentation</td><td>give your 3-minute talk to two people</td></tr>
<tr><td>13–14</td><td>Mock</td><td>full practice paper; review every error</td></tr></tbody></table>
<h4>Mini mock (read the script aloud to a partner, who answers)</h4>
<p><strong>1.</strong> 「小李，明天的考试八点开始，不是九点，别迟到。」问：考试几点开始？ A 七点 B 八点 C 九点.</p>
<p><strong>2.</strong> 女：「你的感冒好点儿了吗？」男：「好多了，不过还有点儿咳嗽，医生让我多喝水。」问：男的现在怎么样？ A 完全好了 B 比以前好，但还咳嗽 C 更严重了.</p>
<p><strong>3.</strong> 男：「周六你去不去爬山？」女：「我很想去，可是周六要加班，周日可以吗？」问：女的什么时候有空？ A 周六 B 周日 C 都没空.</p>
<p><em>Answers: 1 B; 2 B; 3 B.</em> If you got all three, you are using the strategies; if not, note which trap (time correction, degree words, 可是) caught you.</p>
<h4>Self-assessment</h4>
<p>Keep your three recordings (week 1, week 7, final) in one folder and listen to them in order; this single habit shows your progress better than any score. Rate yourself 1–5 on: following a 1-minute passage; telling a past story; making a request; handling a phone problem; presenting for three minutes. Be honest: a self-rating helps only when it is compared with evidence such as your recordings. Items below 3 become your next-term priorities, for example with CLS301 or an HSK 4 course (if your curriculum has them).</p>`,
       `<h4>Kế hoạch hai tuần</h4>
<table><thead><tr><th>Ngày</th><th>Trọng tâm</th><th>Việc làm</th></tr></thead><tbody>
<tr><td>1–3</td><td>Lối nói liền mạch</td><td>shadowing ba hội thoại mỗi ngày; ghi âm một lần</td></tr>
<tr><td>4–6</td><td>Chủ đề 5–9</td><td>nhập vai từng chủ đề với bạn cặp</td></tr>
<tr><td>7–9</td><td>Chiến lược</td><td>bộ đề tính giờ; nhật ký lỗi theo loại</td></tr>
<tr><td>10–12</td><td>Thuyết trình</td><td>trình bày bài 3 phút trước hai người</td></tr>
<tr><td>13–14</td><td>Thi thử</td><td>làm trọn một đề; xem lại mọi lỗi</td></tr></tbody></table>
<h4>Bài thi thử nhỏ (đọc kịch bản to cho bạn cặp, bạn trả lời)</h4>
<p><strong>1.</strong> 「小李，明天的考试八点开始，不是九点，别迟到。」问：考试几点开始？ A 七点 B 八点 C 九点.</p>
<p><strong>2.</strong> 女：「你的感冒好点儿了吗？」男：「好多了，不过还有点儿咳嗽，医生让我多喝水。」问：男的现在怎么样？ A 完全好了 B 比以前好，但还咳嗽 C 更严重了.</p>
<p><strong>3.</strong> 男：「周六你去不去爬山？」女：「我很想去，可是周六要加班，周日可以吗？」问：女的什么时候有空？ A 周六 B 周日 C 都没空.</p>
<p><em>Đáp án: 1 B; 2 B; 3 B.</em> Nếu đúng cả ba là bạn đang dùng được chiến lược; nếu sai, ghi rõ bẫy nào (đính chính giờ, từ chỉ mức độ, 可是) đã làm bạn vấp.</p>
<h4>Tự đánh giá</h4>
<p>Giữ ba bản ghi âm (tuần 1, tuần 7, cuối kỳ) trong một thư mục và nghe theo thứ tự; riêng thói quen này cho thấy tiến bộ rõ hơn mọi con số. Chấm mình 1–5 về: theo dõi đoạn nghe 1 phút; kể chuyện quá khứ; đưa lời nhờ; xử lý sự cố điện thoại; thuyết trình ba phút. Hãy trung thực: tự chấm chỉ có ích khi đối chiếu với bằng chứng như các bản ghi âm của bạn. Mục dưới 3 là ưu tiên cho học kỳ sau, ví dụ với CLS301 hoặc khoá HSK 4 (nếu chương trình của bạn có).</p>`],
    pit: [`Doing a mock without timing and then trusting the score. Time yourself and do not pause the audio.`, `Làm thi thử không bấm giờ rồi tin vào điểm. Hãy bấm giờ và không tạm dừng âm thanh.`],
    s: [[`Two-week plan: shadowing, role-plays, timed sets, talk, mock.`, `Kế hoạch hai tuần: shadowing, nhập vai, đề tính giờ, bài nói, thi thử.`], [`Analyse errors by type, not only by score.`, `Phân tích lỗi theo loại, không chỉ theo điểm.`], [`Low self-ratings become next-term goals.`, `Điểm tự đánh giá thấp thành mục tiêu học kỳ sau.`]],
    l: ['hskoff', 'coursera', 'yoyo'],
    p: [[`Why is the answer to mock question 1 not 九点?`, `Vì sao đáp án câu 1 không phải 九点?`, `Because the speaker corrects: 八点, 不是九点.`, `Vì người nói đính chính: 八点, 不是九点.`], [`How should you log an error?`, `Nên ghi một lỗi thế nào?`, `By type (missed word, number, inference, trap) plus the fix.`, `Theo loại (sót từ, số, suy luận, bẫy) kèm cách sửa.`]]
  }),
  Q(P + 'quiz-10', 'Quiz — Chapter 10', 'Quiz — Chương 10', [
    [[`Skeleton of a 3-minute talk`, `Bộ khung bài nói 3 phút`], [`opening, three points, closing`, `only closing`, `only questions`, `song`], 0, [`Clear structure helps both speaker and listener.`, `Cấu trúc rõ giúp cả người nói và người nghe.`]],
    [[`总之 means`, `总之 nghĩa là`], [`in short`, `first`, `however`, `maybe`], 0, [`Used to summarise.`, `Dùng để tóm lại.`]],
    [[`In Q&A, first`, `Khi hỏi đáp, trước hết`], [`repeat the question to check`, `leave`, `guess`, `change topic`], 0, [`您问的是…对吗？`, `您问的是…对吗？`]],
    [[`Classic HSK 3 Part 2 is`, `Phần 2 HSK 3 cổ điển là`], [`true / false`, `essay`, `speaking`, `pictures only`], 0, [`Compare printed sentence to audio.`, `So câu in với âm thanh.`]],
    [[`Which is NOT in the speaking rubric?`, `Tiêu chí nào KHÔNG có trong thang chấm?`], [`handwriting`, `tones`, `fluency`, `interaction`], 0, [`Speaking is not handwriting.`, `Nói không liên quan chữ viết tay.`]],
    [[`In the mock question 2, the man is`, `Ở câu mock 2, người đàn ông`], [`better but still coughing`, `fully recovered`, `worse`, `at work`], 0, [`不过还有点儿咳嗽.`, `不过还有点儿咳嗽.`]],
    [[`Mock question 3: when is the woman free?`, `Mock câu 3: người phụ nữ rảnh khi nào?`], [`Sunday`, `Saturday`, `never`, `Friday`], 0, [`She asks 周日可以吗.`, `Cô ấy hỏi 周日可以吗.`]],
    [[`To prepare for an HSK 3.0 exam, you should`, `Để chuẩn bị thi HSK 3.0, bạn nên`], [`confirm the format on the official site`, `ignore updates`, `skip practice`, `guess`], 0, [`Formats change.`, `Định dạng có thể đổi.`]],
    [[`An error log records`, `Nhật ký lỗi ghi`], [`error type and the fix`, `only the score`, `nothing`, `only the date`], 0, [`This guides targeted practice.`, `Giúp luyện đúng chỗ yếu.`]],
  ]),
]));

// ===== Phần mở rộng (bài mỏng → đủ ≥ 450 từ EN): chèn trước Tóm tắt =====
const MORE = {
  'cls201-ts-1-1': [`<h3>Going further: finding the focus in a real conversation</h3>
<p>In natural speech the focus is rarely announced; you infer it from the <em>question the sentence answers</em>. Train this habit: after every sentence you hear, silently ask “which question would produce this answer?” If the answer is 「我骑自行车去。」 the hidden question is <em>how</em> (「你怎么去？」), so the stressed word is 自行车. If the answer is 「我跟朋友去。」 the question is <em>with whom</em>. Two more focus markers are worth knowing: 「连…都…」 (even…) puts the stress on the word between 连 and 都, and 「只有…才…」 (only if… then…) stresses the condition.</p>
<table><thead><tr><th>Hidden question</th><th>Answer (stress in bold)</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>谁去？</td><td>「<strong>小王</strong>去。」</td><td>Xiǎo Wáng qù.</td><td>Xiao Wang is going.</td></tr>
<tr><td>在哪儿吃？</td><td>「在<strong>食堂</strong>吃。」</td><td>Zài shítáng chī.</td><td>We eat in the canteen.</td></tr>
<tr><td>几点开始？</td><td>「<strong>八点</strong>开始。」</td><td>Bā diǎn kāishǐ.</td><td>It starts at eight.</td></tr>
<tr><td>买了几本？</td><td>「买了<strong>三本</strong>。」</td><td>Mǎi le sān běn.</td><td>I bought three.</td></tr>
<tr><td>他会不会来？</td><td>「他<strong>连</strong>周末<strong>都</strong>上班。」</td><td>Tā lián zhōumò dōu shàngbān.</td><td>He works even at weekends.</td></tr></tbody></table>
<p><strong>Mini role-play (speaking).</strong> Work in pairs. Student A asks one of the five questions above, Student B answers with the bold word clearly stressed and the rest light. Then swap and make the answer <em>wrong</em> on purpose (「不对，是<strong>九点</strong>开始。」) so that A hears contrastive stress. Record yourselves and check the pitch range of the stressed syllable.</p>
<p><strong>Extra practice.</strong></p><ol><li>Which word is stressed in 「我是在图书馆学习的。」 if the question is 「你在哪儿学习的？」<div class="dap-an"><strong>Answer:</strong> 图书馆 (place), because 是…的 marks the place.</div></li><li>Give a short answer to 「你喝茶还是喝咖啡？」 with the correct stress.<div class="dap-an"><strong>Answer:</strong> 「我喝<strong>茶</strong>。」 (or 咖啡); the chosen item is stressed.</div></li></ol>`,
`<h3>Đi xa hơn: tìm điểm nhấn trong hội thoại thật</h3>
<p>Trong lời nói tự nhiên, điểm nhấn hiếm khi được “báo trước”; bạn suy ra nó từ <em>câu hỏi mà câu này đang trả lời</em>. Hãy tập thói quen: sau mỗi câu nghe được, tự hỏi thầm “câu hỏi nào sinh ra câu đáp này?”. Nếu đáp là 「我骑自行车去。」 thì câu hỏi ẩn là <em>bằng cách nào</em> (「你怎么去？」), nên từ được nhấn là 自行车. Nếu đáp là 「我跟朋友去。」 thì câu hỏi là <em>đi với ai</em>. Hai dấu hiệu nhấn khác cũng nên biết: 「连…都…」 (đến cả…) nhấn từ nằm giữa 连 và 都, còn 「只有…才…」 (chỉ khi… mới…) nhấn vào điều kiện.</p>
<table><thead><tr><th>Câu hỏi ẩn</th><th>Câu đáp (in đậm = nhấn)</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>谁去？</td><td>「<strong>小王</strong>去。」</td><td>Xiǎo Wáng qù.</td><td>Tiểu Vương đi.</td></tr>
<tr><td>在哪儿吃？</td><td>「在<strong>食堂</strong>吃。」</td><td>Zài shítáng chī.</td><td>Ăn ở căng tin.</td></tr>
<tr><td>几点开始？</td><td>「<strong>八点</strong>开始。」</td><td>Bā diǎn kāishǐ.</td><td>Tám giờ bắt đầu.</td></tr>
<tr><td>买了几本？</td><td>「买了<strong>三本</strong>。」</td><td>Mǎi le sān běn.</td><td>Mua ba cuốn.</td></tr>
<tr><td>他会不会来？</td><td>「他<strong>连</strong>周末<strong>都</strong>上班。」</td><td>Tā lián zhōumò dōu shàngbān.</td><td>Anh ấy đến cuối tuần cũng đi làm.</td></tr></tbody></table>
<p><strong>Nhập vai ngắn (luyện nói).</strong> Làm theo cặp. Bạn A hỏi một trong năm câu trên, bạn B đáp và nhấn rõ từ in đậm, các từ còn lại nhẹ. Sau đó đổi vai và cố tình đáp <em>sai</em> (「不对，是<strong>九点</strong>开始。」) để A nghe nhấn đối chiếu. Hãy ghi âm và kiểm tra biên độ cao độ ở âm tiết được nhấn.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Từ nào được nhấn trong 「我是在图书馆学习的。」 nếu câu hỏi là 「你在哪儿学习的？」<div class="dap-an"><strong>Đáp án:</strong> 图书馆 (nơi chốn), vì 是…的 đánh dấu nơi chốn.</div></li><li>Hãy đáp ngắn cho 「你喝茶还是喝咖啡？」 với trọng âm đúng.<div class="dap-an"><strong>Đáp án:</strong> 「我喝<strong>茶</strong>。」 (hoặc 咖啡); món được chọn là chỗ nhấn.</div></li></ol>`],

  'cls201-ts-1-2': [`<h3>Going further: more reductions and how to train your ear</h3>
<p>Beyond the reductions in the lesson, native speakers at HSK 3 speed compress many frequent words. The commonest patterns are: 「不知道」 bù zhīdào → <em>bùzhīdao</em> (the middle syllable nearly disappears); 「什么」 shénme → <em>shém</em>; 「怎么样」 zěnmeyàng → <em>zěnmyàng</em>; 「我们」 wǒmen → <em>wǒm</em>; 「那个」 nà ge → <em>nèi ge</em> (also used as a hesitation filler); 「这样」 zhèyàng → <em>zhèiyàng</em>. Neutral-tone syllables become short and low, so the word seems to have lost a syllable. You do not have to <em>produce</em> these at first; you only have to <em>recognise</em> them.</p>
<table><thead><tr><th>Careful form</th><th>Pinyin</th><th>Fast form</th><th>Meaning</th></tr></thead><tbody>
<tr><td>我不知道</td><td>wǒ bù zhīdào</td><td>wǒ bùzhdao</td><td>I don't know</td></tr>
<tr><td>你在做什么？</td><td>nǐ zài zuò shénme?</td><td>nǐ zài zuò shém?</td><td>What are you doing?</td></tr>
<tr><td>怎么样？</td><td>zěnmeyàng?</td><td>zěmyàng?</td><td>How about it?</td></tr>
<tr><td>我们走吧</td><td>wǒmen zǒu ba</td><td>wǒm zǒu ba</td><td>Let's go</td></tr>
<tr><td>一点儿</td><td>yìdiǎnr</td><td>yìdiǎr</td><td>a little</td></tr></tbody></table>
<p><strong>Listening strategy.</strong> When a word “sounds missing”, do not stop. Keep the rhythm: count the stressed syllables, and let context fill the gap. A useful exercise is dictation in two passes: first write only what you are sure of, then fill the blanks from meaning. <strong>Typical Vietnamese-learner mistake:</strong> expecting each Chinese syllable to be as separate as in Vietnamese, where every syllable is a full, tone-bearing unit; Chinese neutral tones and erhua do not behave that way.</p>
<p><strong>Mini role-play.</strong> A: 「你吃饭了吗？」 B: 「还没呢，你呢？」 A: 「我也没吃，一起去吧？」 B: 「好啊，去哪儿？」 Say it slowly, then at full speed, and note which syllables shrink.</p>
<p><strong>Extra practice.</strong></p><ol><li>Transcribe the fast form “wǒm bùzhdao” into careful pinyin.<div class="dap-an"><strong>Answer:</strong> wǒmen bù zhīdào (我们不知道).</div></li><li>Which syllable is weakest in 「什么」?<div class="dap-an"><strong>Answer:</strong> -me (neutral tone, often dropped).</div></li></ol>`,
`<h3>Đi xa hơn: thêm các kiểu rút gọn và cách luyện tai</h3>
<p>Ngoài các kiểu rút gọn trong bài, người bản ngữ ở tốc độ HSK 3 còn nén nhiều từ quen thuộc. Phổ biến nhất: 「不知道」 bù zhīdào → <em>bùzhīdao</em> (âm giữa gần như biến mất); 「什么」 shénme → <em>shém</em>; 「怎么样」 zěnmeyàng → <em>zěnmyàng</em>; 「我们」 wǒmen → <em>wǒm</em>; 「那个」 nà ge → <em>nèi ge</em> (cũng dùng như từ đệm khi ngập ngừng); 「这样」 zhèyàng → <em>zhèiyàng</em>. Âm tiết thanh nhẹ trở nên ngắn và thấp, nên từ nghe như mất một âm. Ban đầu bạn chưa cần <em>nói</em> như vậy; chỉ cần <em>nhận ra</em> chúng.</p>
<table><thead><tr><th>Dạng đầy đủ</th><th>Pinyin</th><th>Dạng nói nhanh</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>我不知道</td><td>wǒ bù zhīdào</td><td>wǒ bùzhdao</td><td>Tôi không biết</td></tr>
<tr><td>你在做什么？</td><td>nǐ zài zuò shénme?</td><td>nǐ zài zuò shém?</td><td>Bạn đang làm gì?</td></tr>
<tr><td>怎么样？</td><td>zěnmeyàng?</td><td>zěmyàng?</td><td>Thế nào?</td></tr>
<tr><td>我们走吧</td><td>wǒmen zǒu ba</td><td>wǒm zǒu ba</td><td>Mình đi thôi</td></tr>
<tr><td>一点儿</td><td>yìdiǎnr</td><td>yìdiǎr</td><td>một chút</td></tr></tbody></table>
<p><strong>Chiến lược nghe.</strong> Khi một từ “nghe như mất”, đừng dừng lại. Giữ nhịp: đếm các âm tiết được nhấn và để ngữ cảnh lấp chỗ trống. Bài tập hữu ích là chép chính tả hai lượt: lượt đầu chỉ viết phần chắc chắn, lượt hai điền chỗ trống theo nghĩa. <strong>Lỗi điển hình của người Việt:</strong> mong mỗi âm tiết tiếng Trung tách bạch như tiếng Việt, nơi mỗi âm tiết là một đơn vị đầy đủ mang thanh; thanh nhẹ và âm uốn lưỡi (erhua) của tiếng Trung không hoạt động như thế.</p>
<p><strong>Nhập vai ngắn.</strong> A: 「你吃饭了吗？」 B: 「还没呢，你呢？」 A: 「我也没吃，一起去吧？」 B: 「好啊，去哪儿？」 Đọc chậm rồi đọc tốc độ thật, ghi lại những âm tiết bị co lại.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Chuyển dạng nhanh “wǒm bùzhdao” sang pinyin đầy đủ.<div class="dap-an"><strong>Đáp án:</strong> wǒmen bù zhīdào (我们不知道).</div></li><li>Âm tiết nào yếu nhất trong 「什么」?<div class="dap-an"><strong>Đáp án:</strong> -me (thanh nhẹ, thường bị lược).</div></li></ol>`],

  'cls201-ts-1-3': [`<h3>Going further: a worked example of chunking</h3>
<p>Take a 25-syllable sentence that would overwhelm you if heard as a stream: 「我的朋友告诉我，下个星期六学校门口有一个中文歌比赛，参加的人可以得到奖品。」 Chunk it where a native speaker would breathe. The first break comes after the speech verb (「我的朋友告诉我」 — <em>my friend told me</em>), the second after the time word (「下个星期六」), the third after the place (「学校门口」), and the last after the event (「有一个中文歌比赛」). Time, place and event arrive in a fixed order, so each chunk fills one slot in your notes.</p>
<table><thead><tr><th>Chunk</th><th>Pinyin</th><th>Slot</th></tr></thead><tbody>
<tr><td>我的朋友告诉我 /</td><td>wǒ de péngyou gàosu wǒ</td><td>source</td></tr>
<tr><td>下个星期六 /</td><td>xià ge xīngqī liù</td><td>time</td></tr>
<tr><td>学校门口 /</td><td>xuéxiào ménkǒu</td><td>place</td></tr>
<tr><td>有一个中文歌比赛 /</td><td>yǒu yí gè Zhōngwén gē bǐsài</td><td>event</td></tr>
<tr><td>参加的人可以得到奖品</td><td>cānjiā de rén kěyǐ dédào jiǎngpǐn</td><td>result</td></tr></tbody></table>
<p><strong>Boundary clues.</strong> Pauses typically fall before conjunctions (「但是」「所以」「如果」), after a comma-like topic (「这件事，…」) and before a new subject. Rising pitch plus a short pause often signals “more is coming”; a low, falling end signals the end of the thought. <strong>Typical mistake:</strong> holding a long chunk in memory word by word instead of keeping only its meaning. Summarise each chunk in two or three words and drop the rest.</p>
<p><strong>Speaking drill.</strong> Read the sentence aloud three times: once word by word, once chunk by chunk with a slash pause, once at natural speed. Then invent a similar sentence about your own weekend.</p>
<p><strong>Extra practice.</strong></p><ol><li>Where would you put the first pause in 「如果明天下雨，我们就不去爬山了。」?<div class="dap-an"><strong>Answer:</strong> after 下雨 (before 我们), i.e. at the comma.</div></li><li>Name the slot of 「学校门口」 in the example.<div class="dap-an"><strong>Answer:</strong> place.</div></li></ol>`,
`<h3>Đi xa hơn: ví dụ tách cụm từng bước</h3>
<p>Hãy lấy một câu 25 âm tiết sẽ làm bạn choáng nếu nghe liền một mạch: 「我的朋友告诉我，下个星期六学校门口有一个中文歌比赛，参加的人可以得到奖品。」 Tách nó ở chỗ người bản ngữ lấy hơi. Chỗ ngắt đầu tiên sau động từ nói (「我的朋友告诉我」 — <em>bạn tôi bảo tôi</em>), thứ hai sau từ chỉ thời gian (「下个星期六」), thứ ba sau nơi chốn (「学校门口」), cuối cùng sau sự kiện (「有一个中文歌比赛」). Thời gian, nơi chốn và sự kiện đến theo thứ tự cố định nên mỗi cụm điền vào một ô trong ghi chú.</p>
<table><thead><tr><th>Cụm</th><th>Pinyin</th><th>Ô thông tin</th></tr></thead><tbody>
<tr><td>我的朋友告诉我 /</td><td>wǒ de péngyou gàosu wǒ</td><td>nguồn tin</td></tr>
<tr><td>下个星期六 /</td><td>xià ge xīngqī liù</td><td>thời gian</td></tr>
<tr><td>学校门口 /</td><td>xuéxiào ménkǒu</td><td>nơi chốn</td></tr>
<tr><td>有一个中文歌比赛 /</td><td>yǒu yí gè Zhōngwén gē bǐsài</td><td>sự kiện</td></tr>
<tr><td>参加的人可以得到奖品</td><td>cānjiā de rén kěyǐ dédào jiǎngpǐn</td><td>kết quả</td></tr></tbody></table>
<p><strong>Dấu hiệu ranh giới.</strong> Chỗ ngắt thường rơi trước liên từ (「但是」「所以」「如果」), sau chủ đề dạng dấu phẩy (「这件事，…」) và trước chủ ngữ mới. Cao độ lên kèm ngắt ngắn thường báo “còn nữa”; kết thúc thấp và xuống báo hết ý. <strong>Lỗi điển hình:</strong> cố nhớ từng từ của cụm dài thay vì chỉ giữ nghĩa. Hãy tóm mỗi cụm bằng hai ba từ rồi bỏ phần còn lại.</p>
<p><strong>Bài nói.</strong> Đọc to câu trên ba lần: lần một từng từ, lần hai theo cụm có dấu gạch ngắt, lần ba ở tốc độ tự nhiên. Sau đó tự đặt một câu tương tự về cuối tuần của bạn.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Bạn sẽ ngắt đầu tiên ở đâu trong 「如果明天下雨，我们就不去爬山了。」?<div class="dap-an"><strong>Đáp án:</strong> sau 下雨 (trước 我们), tức ở dấu phẩy.</div></li><li>Nêu ô thông tin của 「学校门口」 trong ví dụ.<div class="dap-an"><strong>Đáp án:</strong> nơi chốn.</div></li></ol>`],

  'cls201-ts-1-4': [`<h3>Going further: a four-week shadowing plan</h3>
<p>Shadowing works only when it is systematic. Use a plan that raises speed gradually. <strong>Week 1:</strong> choose a 30-second clip at 0.75× speed; listen three times, read the pinyin, then shadow with the text in front of you. <strong>Week 2:</strong> same clip at normal speed, text hidden, and you start speaking one beat behind the speaker. <strong>Week 3:</strong> a new clip; shadow without text, then record yourself and compare tone shapes. <strong>Week 4:</strong> increase to 1.1× speed to build a margin of safety for the exam. Record your voice every week so you can hear progress, which is slow day to day but obvious across a month.</p>
<table><thead><tr><th>Sentence to shadow</th><th>Pinyin</th><th>Watch for</th></tr></thead><tbody>
<tr><td>我每天早上七点起床，先喝一杯水。</td><td>Wǒ měitiān zǎoshang qī diǎn qǐchuáng, xiān hē yì bēi shuǐ.</td><td>two chunks; 一杯 → yì bēi</td></tr>
<tr><td>虽然有点儿累，但是我很开心。</td><td>Suīrán yǒudiǎnr lèi, dànshì wǒ hěn kāixīn.</td><td>pause after 累; contrast</td></tr>
<tr><td>你能不能再说一遍？</td><td>Nǐ néng bu néng zài shuō yí biàn?</td><td>neutral 不; yí biàn</td></tr>
<tr><td>别担心，我们一定能赶上火车。</td><td>Bié dānxīn, wǒmen yídìng néng gǎnshàng huǒchē.</td><td>yídìng sandhi; falling end</td></tr></tbody></table>
<p><strong>Quality check.</strong> After each recording ask three questions: Did my tones rise and fall in the same places? Did I keep the same pauses? Did I finish at the same moment as the speaker? Mark one problem only and fix it in the next round; fixing five things at once fixes none. <strong>Common mistake:</strong> shadowing too difficult material. If you miss more than one word in ten, choose an easier clip.</p>
<p><strong>Pair task.</strong> One student reads a sentence at speed, the other shadows aloud immediately; swap roles after every four sentences.</p>
<p><strong>Extra practice.</strong></p><ol><li>Why is the speed raised only in week 4?<div class="dap-an"><strong>Answer:</strong> Accuracy and chunking come first; speed is added once the text is familiar.</div></li><li>How should you read 「一遍」 in 再说一遍?<div class="dap-an"><strong>Answer:</strong> yí biàn (一 changes to second tone before a fourth tone).</div></li></ol>`,
`<h3>Đi xa hơn: kế hoạch shadowing bốn tuần</h3>
<p>Shadowing chỉ hiệu quả khi có hệ thống. Hãy dùng kế hoạch tăng tốc dần. <strong>Tuần 1:</strong> chọn đoạn 30 giây ở tốc độ 0,75×; nghe ba lần, đọc pinyin rồi shadow khi vẫn nhìn văn bản. <strong>Tuần 2:</strong> cùng đoạn ấy ở tốc độ thường, giấu văn bản, bắt đầu nói chậm hơn người nói một nhịp. <strong>Tuần 3:</strong> đoạn mới; shadow không văn bản, rồi ghi âm và so sánh hình dạng thanh điệu. <strong>Tuần 4:</strong> tăng lên 1,1× để có biên độ an toàn cho kỳ thi. Mỗi tuần hãy ghi âm giọng mình để nghe được tiến bộ — từng ngày thì chậm nhưng qua một tháng thì rõ rệt.</p>
<table><thead><tr><th>Câu để shadow</th><th>Pinyin</th><th>Chú ý</th></tr></thead><tbody>
<tr><td>我每天早上七点起床，先喝一杯水。</td><td>Wǒ měitiān zǎoshang qī diǎn qǐchuáng, xiān hē yì bēi shuǐ.</td><td>hai cụm; 一杯 → yì bēi</td></tr>
<tr><td>虽然有点儿累，但是我很开心。</td><td>Suīrán yǒudiǎnr lèi, dànshì wǒ hěn kāixīn.</td><td>ngắt sau 累; đối lập</td></tr>
<tr><td>你能不能再说一遍？</td><td>Nǐ néng bu néng zài shuō yí biàn?</td><td>不 thanh nhẹ; yí biàn</td></tr>
<tr><td>别担心，我们一定能赶上火车。</td><td>Bié dānxīn, wǒmen yídìng néng gǎnshàng huǒchē.</td><td>yídìng biến điệu; cuối câu xuống</td></tr></tbody></table>
<p><strong>Kiểm tra chất lượng.</strong> Sau mỗi lần ghi âm hãy hỏi ba điều: Thanh điệu của mình lên xuống đúng chỗ chưa? Mình có giữ đúng các chỗ ngắt không? Mình có kết thúc cùng lúc với người nói không? Chỉ đánh dấu một vấn đề và sửa ở vòng sau; sửa năm thứ cùng lúc thì không sửa được thứ nào. <strong>Lỗi thường gặp:</strong> shadow tài liệu quá khó. Nếu bạn lỡ hơn một từ trong mười từ, hãy chọn đoạn dễ hơn.</p>
<p><strong>Bài tập cặp.</strong> Một bạn đọc câu ở tốc độ thật, bạn kia shadow thành tiếng ngay lập tức; đổi vai sau mỗi bốn câu.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Vì sao chỉ tăng tốc ở tuần 4?<div class="dap-an"><strong>Đáp án:</strong> Độ chính xác và việc tách cụm đến trước; tốc độ chỉ thêm khi văn bản đã quen.</div></li><li>Đọc 「一遍」 trong 再说一遍 như thế nào?<div class="dap-an"><strong>Đáp án:</strong> yí biàn (一 đổi sang thanh 2 trước thanh 4).</div></li></ol>`],
  'cls201-ts-2-1': [`<h3>Going further: a note-taking layout and a worked example</h3>
<p>Divide your page into three columns: <strong>who/what</strong>, <strong>when/where</strong>, <strong>numbers/result</strong>. Write in the fastest form you can read later: pinyin initials, English or Vietnamese words, and symbols. Never write full characters while the audio is still running; a stroke-heavy character costs you the next sentence. Useful symbols: ↑ increase (上升), ↓ decrease (下降), → leads to / then, = same, ≠ different, ? unclear, ✓ agreed, ✗ refused.</p>
<p>Example audio: 「上个月我们公司有两百三十个客人，这个月有三百个，比上个月多了七十个。」 Your notes might read: <em>cty: tháng trước 230 → tháng này 300 ↑ 70</em>. In Chinese, large numbers are built in units: 两百三十 liǎng bǎi sānshí = 230, 三百 sān bǎi = 300, 七十 qīshí = 70. Remember 「两」 (liǎng) is used before 百, 千, 万 instead of 二.</p>
<table><thead><tr><th>Hear</th><th>Pinyin</th><th>Write</th></tr></thead><tbody>
<tr><td>一千五百块</td><td>yì qiān wǔ bǎi kuài</td><td>1500¥</td></tr>
<tr><td>三分之一</td><td>sān fēn zhī yī</td><td>1/3</td></tr>
<tr><td>百分之八十</td><td>bǎi fēn zhī bāshí</td><td>80%</td></tr>
<tr><td>下午三点半</td><td>xiàwǔ sān diǎn bàn</td><td>pm 3:30</td></tr>
<tr><td>零下五度</td><td>líng xià wǔ dù</td><td>−5°</td></tr></tbody></table>
<p><strong>Common mistake:</strong> writing every word and falling behind. Decide before listening: which three slots will the question ask for? Note only those.</p>
<p><strong>Extra practice.</strong></p><ol><li>Write in digits: 「两千零五十」.<div class="dap-an"><strong>Answer:</strong> 2050 (liǎng qiān líng wǔshí).</div></li><li>What does 「百分之二十」 mean?<div class="dap-an"><strong>Answer:</strong> 20%.</div></li></ol>`,
`<h3>Đi xa hơn: bố cục ghi chú và ví dụ từng bước</h3>
<p>Chia trang giấy thành ba cột: <strong>ai/việc gì</strong>, <strong>khi nào/ở đâu</strong>, <strong>số liệu/kết quả</strong>. Hãy viết dạng nhanh nhất mà sau này bạn vẫn đọc được: chữ cái đầu pinyin, từ tiếng Anh hoặc tiếng Việt, và ký hiệu. Đừng viết chữ Hán đầy đủ khi âm thanh còn đang chạy; một chữ nhiều nét làm bạn mất câu kế tiếp. Ký hiệu hữu ích: ↑ tăng (上升), ↓ giảm (下降), → dẫn đến / rồi, = giống, ≠ khác, ? chưa rõ, ✓ đồng ý, ✗ từ chối.</p>
<p>Ví dụ âm thanh: 「上个月我们公司有两百三十个客人，这个月有三百个，比上个月多了七十个。」 Ghi chú của bạn có thể là: <em>cty: tháng trước 230 → tháng này 300 ↑ 70</em>. Trong tiếng Trung, số lớn được ghép theo đơn vị: 两百三十 liǎng bǎi sānshí = 230, 三百 sān bǎi = 300, 七十 qīshí = 70. Nhớ rằng 「两」 (liǎng) dùng trước 百, 千, 万 thay cho 二.</p>
<table><thead><tr><th>Nghe</th><th>Pinyin</th><th>Ghi</th></tr></thead><tbody>
<tr><td>一千五百块</td><td>yì qiān wǔ bǎi kuài</td><td>1500¥</td></tr>
<tr><td>三分之一</td><td>sān fēn zhī yī</td><td>1/3</td></tr>
<tr><td>百分之八十</td><td>bǎi fēn zhī bāshí</td><td>80%</td></tr>
<tr><td>下午三点半</td><td>xiàwǔ sān diǎn bàn</td><td>3:30 chiều</td></tr>
<tr><td>零下五度</td><td>líng xià wǔ dù</td><td>−5°</td></tr></tbody></table>
<p><strong>Lỗi thường gặp:</strong> viết mọi từ rồi tụt lại phía sau. Hãy quyết định trước khi nghe: câu hỏi sẽ hỏi ba ô nào? Chỉ ghi những ô đó.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Viết bằng chữ số: 「两千零五十」.<div class="dap-an"><strong>Đáp án:</strong> 2050 (liǎng qiān líng wǔshí).</div></li><li>「百分之二十」 nghĩa là gì?<div class="dap-an"><strong>Đáp án:</strong> 20%.</div></li></ol>`],

  'cls201-ts-2-2': [`<h3>Going further: signposts grouped by function</h3>
<p>Signposts tell you the logical relationship before the details arrive. Group them in five families and listen for the first word of each pair: <strong>cause–result</strong> 因为…所以… (yīnwèi… suǒyǐ…); <strong>concession</strong> 虽然…但是… (suīrán… dànshì…); <strong>condition</strong> 如果…就… (rúguǒ… jiù…) and 只要…就… (zhǐyào… jiù…); <strong>sequence</strong> 先…然后…最后… (xiān… ránhòu… zuìhòu…); <strong>addition/contrast</strong> 不但…而且… (búdàn… érqiě…), 一边…一边… (yìbiān… yìbiān…), 可是 (kěshì), 不过 (búguò). The word after 但是 or 不过 normally carries the speaker's real point, so listen hardest there.</p>
<table><thead><tr><th>Sentence</th><th>Pinyin</th><th>Real point</th></tr></thead><tbody>
<tr><td>虽然这家饭馆很便宜，但是不太干净。</td><td>Suīrán zhè jiā fànguǎn hěn piányi, dànshì bú tài gānjìng.</td><td>not clean</td></tr>
<tr><td>只要你努力，就一定能通过考试。</td><td>Zhǐyào nǐ nǔlì, jiù yídìng néng tōngguò kǎoshì.</td><td>effort is enough</td></tr>
<tr><td>他不但会说中文，而且说得很好。</td><td>Tā búdàn huì shuō Zhōngwén, érqiě shuō de hěn hǎo.</td><td>speaks very well</td></tr>
<tr><td>我先去银行，然后去超市，最后回家。</td><td>Wǒ xiān qù yínháng, ránhòu qù chāoshì, zuìhòu huí jiā.</td><td>three stops</td></tr></tbody></table>
<p><strong>Prediction drill.</strong> Say only the first half and let a partner finish it: 「因为下雨，…」 → 「所以我们没出去。」 Also notice that the first marker is often dropped in speech: 「下雨了，我们没出去」 still means cause–result. <strong>Typical mistake:</strong> hearing 「虽然」 and thinking the whole sentence is positive. The real information follows 「但是」.</p>
<p><strong>Extra practice.</strong></p><ol><li>In 「我想去，不过没有时间。」 does the speaker go?<div class="dap-an"><strong>Answer:</strong> Probably not; the point after 不过 is no time.</div></li><li>Order: 先…然后…最后… with 吃饭, 看电影, 回家.<div class="dap-an"><strong>Answer:</strong> 先吃饭，然后看电影，最后回家。</div></li></ol>`,
`<h3>Đi xa hơn: từ báo hiệu xếp theo chức năng</h3>
<p>Từ báo hiệu cho bạn biết quan hệ logic trước khi chi tiết đến. Hãy nhóm chúng thành năm họ và nghe từ đầu của mỗi cặp: <strong>nguyên nhân–kết quả</strong> 因为…所以… (yīnwèi… suǒyǐ…); <strong>nhượng bộ</strong> 虽然…但是… (suīrán… dànshì…); <strong>điều kiện</strong> 如果…就… (rúguǒ… jiù…) và 只要…就… (zhǐyào… jiù…); <strong>trình tự</strong> 先…然后…最后… (xiān… ránhòu… zuìhòu…); <strong>bổ sung/đối lập</strong> 不但…而且… (búdàn… érqiě…), 一边…一边… (yìbiān… yìbiān…), 可是 (kěshì), 不过 (búguò). Từ sau 但是 hoặc 不过 thường chứa ý chính của người nói, nên hãy nghe kỹ nhất ở đó.</p>
<table><thead><tr><th>Câu</th><th>Pinyin</th><th>Ý chính</th></tr></thead><tbody>
<tr><td>虽然这家饭馆很便宜，但是不太干净。</td><td>Suīrán zhè jiā fànguǎn hěn piányi, dànshì bú tài gānjìng.</td><td>không sạch lắm</td></tr>
<tr><td>只要你努力，就一定能通过考试。</td><td>Zhǐyào nǐ nǔlì, jiù yídìng néng tōngguò kǎoshì.</td><td>chỉ cần cố gắng</td></tr>
<tr><td>他不但会说中文，而且说得很好。</td><td>Tā búdàn huì shuō Zhōngwén, érqiě shuō de hěn hǎo.</td><td>nói rất giỏi</td></tr>
<tr><td>我先去银行，然后去超市，最后回家。</td><td>Wǒ xiān qù yínháng, ránhòu qù chāoshì, zuìhòu huí jiā.</td><td>ba điểm dừng</td></tr></tbody></table>
<p><strong>Bài đoán trước.</strong> Chỉ nói nửa đầu và để bạn cùng nói nốt: 「因为下雨，…」 → 「所以我们没出去。」 Cũng lưu ý rằng từ đánh dấu đầu thường bị lược khi nói: 「下雨了，我们没出去」 vẫn là nguyên nhân–kết quả. <strong>Lỗi điển hình:</strong> nghe 「虽然」 rồi tưởng cả câu mang nghĩa tích cực. Thông tin thật nằm sau 「但是」.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Trong 「我想去，不过没有时间。」 người nói có đi không?<div class="dap-an"><strong>Đáp án:</strong> Nhiều khả năng không; ý chính sau 不过 là không có thời gian.</div></li><li>Sắp xếp: 先…然后…最后… với 吃饭, 看电影, 回家.<div class="dap-an"><strong>Đáp án:</strong> 先吃饭，然后看电影，最后回家。</div></li></ol>`],

  'cls201-ts-2-3': [`<h3>Going further: five common indirect answers</h3>
<p>Chinese speakers value harmony, so refusals, complaints and disagreements are often softened. The literal words say one thing; the real message is different. Learn the formulas: <strong>1.</strong> 「我考虑一下。」 (Wǒ kǎolǜ yíxià.) = <em>I'll think about it</em>, usually a polite no. <strong>2.</strong> 「有点儿…」 (yǒudiǎnr…) before an adjective signals a complaint: 「有点儿贵」 means <em>too expensive for me</em>. <strong>3.</strong> 「可能不太方便。」 (Kěnéng bú tài fāngbiàn.) = <em>probably not possible</em>. <strong>4.</strong> 「还行。」 (Hái xíng.) = <em>so-so</em>, lukewarm, not praise. <strong>5.</strong> 「改天吧。」 (Gǎitiān ba.) = <em>another day</em>, a soft decline.</p>
<table><thead><tr><th>A says</th><th>B says</th><th>Pinyin</th><th>Real meaning</th></tr></thead><tbody>
<tr><td>周末一起去爬山吧？</td><td>我看看吧。</td><td>Wǒ kànkan ba.</td><td>probably no</td></tr>
<tr><td>这个菜怎么样？</td><td>还可以。</td><td>Hái kěyǐ.</td><td>not great</td></tr>
<tr><td>你喜欢这件衣服吗？</td><td>颜色有点儿深。</td><td>Yánsè yǒudiǎnr shēn.</td><td>I don't like it</td></tr>
<tr><td>明天能交报告吗？</td><td>我尽量吧。</td><td>Wǒ jǐnliàng ba.</td><td>not sure I can</td></tr></tbody></table>
<p><strong>Clues to attitude.</strong> Listen for a pause before the answer, a drawn-out 「嗯…」, a falling tone, and words like 其实 (qíshí, actually), which often introduce the truth. Warm agreement is quick and bright: 「好啊！」. <strong>Typical mistake:</strong> taking 「可以」 or 「还行」 as enthusiastic agreement.</p>
<p><strong>Extra practice.</strong></p><ol><li>Does 「我考虑一下」 usually mean yes?<div class="dap-an"><strong>Answer:</strong> No, it is a polite way to avoid saying no directly.</div></li><li>What does 「有点儿贵」 imply?<div class="dap-an"><strong>Answer:</strong> The price is a problem for the speaker.</div></li></ol>`,
`<h3>Đi xa hơn: năm kiểu đáp gián tiếp thường gặp</h3>
<p>Người Trung Quốc coi trọng sự hài hoà nên lời từ chối, phàn nàn hay phản đối thường được làm mềm. Câu chữ nói một đằng, thông điệp thật là một nẻo. Hãy học các công thức: <strong>1.</strong> 「我考虑一下。」 (Wǒ kǎolǜ yíxià.) = <em>để tôi cân nhắc</em>, thường là lời từ chối lịch sự. <strong>2.</strong> 「有点儿…」 (yǒudiǎnr…) trước tính từ báo hiệu phàn nàn: 「有点儿贵」 nghĩa là <em>đắt quá với tôi</em>. <strong>3.</strong> 「可能不太方便。」 (Kěnéng bú tài fāngbiàn.) = <em>chắc là không tiện</em>. <strong>4.</strong> 「还行。」 (Hái xíng.) = <em>tàm tạm</em>, hờ hững, không phải lời khen. <strong>5.</strong> 「改天吧。」 (Gǎitiān ba.) = <em>để hôm khác</em>, từ chối nhẹ.</p>
<table><thead><tr><th>A nói</th><th>B nói</th><th>Pinyin</th><th>Ý thật</th></tr></thead><tbody>
<tr><td>周末一起去爬山吧？</td><td>我看看吧。</td><td>Wǒ kànkan ba.</td><td>nhiều khả năng không</td></tr>
<tr><td>这个菜怎么样？</td><td>还可以。</td><td>Hái kěyǐ.</td><td>không ngon lắm</td></tr>
<tr><td>你喜欢这件衣服吗？</td><td>颜色有点儿深。</td><td>Yánsè yǒudiǎnr shēn.</td><td>tôi không thích</td></tr>
<tr><td>明天能交报告吗？</td><td>我尽量吧。</td><td>Wǒ jǐnliàng ba.</td><td>chưa chắc làm được</td></tr></tbody></table>
<p><strong>Manh mối về thái độ.</strong> Hãy nghe: ngập ngừng trước khi đáp, tiếng 「嗯…」 kéo dài, thanh điệu đi xuống, và các từ như 其实 (qíshí, thật ra) thường dẫn vào sự thật. Đồng ý nhiệt tình thì nhanh và tươi: 「好啊！」. <strong>Lỗi điển hình:</strong> coi 「可以」 hay 「还行」 là đồng ý hào hứng.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「我考虑一下」 thường có nghĩa là đồng ý không?<div class="dap-an"><strong>Đáp án:</strong> Không, đó là cách lịch sự để tránh nói “không” thẳng.</div></li><li>「有点儿贵」 ngụ ý gì?<div class="dap-an"><strong>Đáp án:</strong> Giá là vấn đề với người nói.</div></li></ol>`],

  'cls201-ts-2-4': [`<h3>Going further: a trap checklist for the exam</h3>
<p>HSK-style questions are built around traps. Learn to spot their shape. <strong>Number trap:</strong> the speaker says two numbers and the question asks about the second or the difference: 「原来八十块，现在打八折，六十四块。」 (Yuánlái bāshí kuài, xiànzài dǎ bā zhé, liùshísì kuài.) <em>Originally 80, now 20% off, 64.</em> Note that 「八折」 means 80% of the price, not 8% off. <strong>Time trap:</strong> 「本来…，后来…」 (běnlái… hòulái…) means <em>originally… later…</em>; the final plan is the second one. <strong>Negation trap:</strong> 「不是不想，是没时间」 = <em>not that I don't want to; I have no time</em>. <strong>Distractor trap:</strong> the option repeats a word you heard but attaches it to the wrong person or time.</p>
<table><thead><tr><th>Audio</th><th>Pinyin</th><th>Answer to “when?”</th></tr></thead><tbody>
<tr><td>会议本来是三点，后来改到四点半。</td><td>Huìyì běnlái shì sān diǎn, hòulái gǎi dào sì diǎn bàn.</td><td>4:30</td></tr>
<tr><td>我不是昨天来的，是今天早上到的。</td><td>Wǒ bú shì zuótiān lái de, shì jīntiān zǎoshang dào de.</td><td>this morning</td></tr>
<tr><td>他没去上海，去了广州。</td><td>Tā méi qù Shànghǎi, qù le Guǎngzhōu.</td><td>Guangzhou</td></tr></tbody></table>
<p><strong>Defence strategy.</strong> Read the options during the pause <em>before</em> the audio and underline what differs between them (numbers, places, people). While listening, cross out options that are contradicted. If you lose a number, use the remaining information (for example 「便宜二十块」) to calculate it back. <strong>Typical mistake:</strong> picking the first number heard. Wait for the sentence to finish.</p>
<p><strong>Extra practice.</strong></p><ol><li>「现在打七折，原价一百」: how much now?<div class="dap-an"><strong>Answer:</strong> 70 yuan (七折 = 70%).</div></li><li>「我本来想坐飞机，后来决定坐火车。」 What did he take?<div class="dap-an"><strong>Answer:</strong> The train.</div></li></ol>`,
`<h3>Đi xa hơn: danh sách kiểm bẫy cho kỳ thi</h3>
<p>Câu hỏi kiểu HSK được dựng quanh các cái bẫy. Hãy học nhận ra hình dạng của chúng. <strong>Bẫy số:</strong> người nói đọc hai số và câu hỏi hỏi số thứ hai hoặc chênh lệch: 「原来八十块，现在打八折，六十四块。」 (Yuánlái bāshí kuài, xiànzài dǎ bā zhé, liùshísì kuài.) <em>Ban đầu 80, nay giảm 20%, còn 64.</em> Lưu ý 「八折」 là còn 80% giá chứ không phải giảm 8%. <strong>Bẫy thời gian:</strong> 「本来…，后来…」 (běnlái… hòulái…) nghĩa là <em>ban đầu… sau đó…</em>; kế hoạch cuối là vế sau. <strong>Bẫy phủ định:</strong> 「不是不想，是没时间」 = <em>không phải không muốn mà là không có thời gian</em>. <strong>Bẫy gây nhiễu:</strong> phương án lặp lại một từ bạn vừa nghe nhưng gán nhầm cho người hoặc thời điểm khác.</p>
<table><thead><tr><th>Âm thanh</th><th>Pinyin</th><th>Đáp cho “khi nào?”</th></tr></thead><tbody>
<tr><td>会议本来是三点，后来改到四点半。</td><td>Huìyì běnlái shì sān diǎn, hòulái gǎi dào sì diǎn bàn.</td><td>4:30</td></tr>
<tr><td>我不是昨天来的，是今天早上到的。</td><td>Wǒ bú shì zuótiān lái de, shì jīntiān zǎoshang dào de.</td><td>sáng nay</td></tr>
<tr><td>他没去上海，去了广州。</td><td>Tā méi qù Shànghǎi, qù le Guǎngzhōu.</td><td>Quảng Châu</td></tr></tbody></table>
<p><strong>Chiến lược phòng thủ.</strong> Đọc các phương án trong khoảng lặng <em>trước</em> khi phát âm thanh và gạch chân chỗ khác nhau (số, nơi chốn, người). Khi nghe, gạch bỏ phương án bị mâu thuẫn. Nếu lỡ một số, hãy dùng thông tin còn lại (ví dụ 「便宜二十块」) để tính ngược. <strong>Lỗi điển hình:</strong> chọn số nghe được đầu tiên. Hãy chờ câu nói xong.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「现在打七折，原价一百」: bây giờ bao nhiêu?<div class="dap-an"><strong>Đáp án:</strong> 70 tệ (七折 = 70%).</div></li><li>「我本来想坐飞机，后来决定坐火车。」 Anh ấy đi gì?<div class="dap-an"><strong>Đáp án:</strong> Tàu hoả.</div></li></ol>`],
  'cls201-ts-3-1': [`<h3>Going further: describing someone so a listener can pick them out</h3>
<p>A good description moves from general to specific: age and build, then face and hair, then clothes, then personality. In listening tasks the speaker often gives four or five details and the question asks about only one, so practise sorting them. Useful frames: 「他个子很高，大概一米八。」 (He is tall, about 1.80 m); 「她留着长头发，戴着眼镜。」 (She has long hair and wears glasses); 「他看起来很严肃，其实很幽默。」 (He looks serious but is actually funny). Note the pattern 「看起来…，其实…」: the second half is the truth.</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>他三十岁左右，身体很结实。</td><td>Tā sānshí suì zuǒyòu, shēntǐ hěn jiēshi.</td><td>About thirty, strong build.</td></tr>
<tr><td>她皮肤很白，眼睛大大的。</td><td>Tā pífū hěn bái, yǎnjing dàdà de.</td><td>Fair skin, big eyes.</td></tr>
<tr><td>我的室友很外向，爱说话。</td><td>Wǒ de shìyǒu hěn wàixiàng, ài shuōhuà.</td><td>My roommate is outgoing and talkative.</td></tr>
<tr><td>他有点儿害羞，不太爱发言。</td><td>Tā yǒudiǎnr hàixiū, bú tài ài fāyán.</td><td>He is a bit shy and rarely speaks up.</td></tr></tbody></table>
<p><strong>Speaking task.</strong> Describe a classmate in six sentences using general → specific order; your partner guesses who it is. <strong>Typical mistake:</strong> using 「很」 in every sentence and sounding flat; vary with 「挺…的」, 「非常」, 「有点儿」.</p>
<p><strong>Extra practice.</strong></p><ol><li>「他看起来很凶，其实很温柔。」 What is he really like?<div class="dap-an"><strong>Answer:</strong> Gentle.</div></li></ol>`,
`<h3>Đi xa hơn: mô tả sao cho người nghe nhận ra đúng người</h3>
<p>Một bài mô tả tốt đi từ chung đến riêng: tuổi và vóc dáng, rồi khuôn mặt và tóc, rồi quần áo, rồi tính cách. Trong bài nghe, người nói thường đưa bốn năm chi tiết còn câu hỏi chỉ hỏi một, nên hãy tập sắp xếp chúng. Khung hữu ích: 「他个子很高，大概一米八。」 (Anh ấy cao, khoảng 1,80 m); 「她留着长头发，戴着眼镜。」 (Cô ấy để tóc dài, đeo kính); 「他看起来很严肃，其实很幽默。」 (Anh ấy trông nghiêm nhưng thật ra hài hước). Chú ý mẫu 「看起来…，其实…」: vế sau mới là sự thật.</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>他三十岁左右，身体很结实。</td><td>Tā sānshí suì zuǒyòu, shēntǐ hěn jiēshi.</td><td>Khoảng ba mươi tuổi, thân hình rắn chắc.</td></tr>
<tr><td>她皮肤很白，眼睛大大的。</td><td>Tā pífū hěn bái, yǎnjing dàdà de.</td><td>Da trắng, mắt to.</td></tr>
<tr><td>我的室友很外向，爱说话。</td><td>Wǒ de shìyǒu hěn wàixiàng, ài shuōhuà.</td><td>Bạn cùng phòng của tôi hướng ngoại, hay nói.</td></tr>
<tr><td>他有点儿害羞，不太爱发言。</td><td>Tā yǒudiǎnr hàixiū, bú tài ài fāyán.</td><td>Anh ấy hơi nhút nhát, ít phát biểu.</td></tr></tbody></table>
<p><strong>Bài nói.</strong> Mô tả một bạn cùng lớp trong sáu câu theo thứ tự chung → riêng; bạn cùng cặp đoán là ai. <strong>Lỗi điển hình:</strong> câu nào cũng dùng 「很」 nên nghe đều đều; hãy thay bằng 「挺…的」, 「非常」, 「有点儿」.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「他看起来很凶，其实很温柔。」 Thật ra anh ấy thế nào?<div class="dap-an"><strong>Đáp án:</strong> Dịu dàng.</div></li></ol>`],

  'cls201-ts-3-2': [`<h3>Going further: a campus announcement and a student dialogue</h3>
<p>Campus audio comes in two genres: <strong>announcements</strong> (formal, one speaker, key facts such as date, room, deadline) and <strong>student chat</strong> (informal, fast, with fillers like 「那个…」, 「就是…」). Treat them differently. In announcements, list the facts in your notes: 「请注意，明天下午两点，在三号教学楼二〇五教室举行汉语听力考试，请带学生证。」 (Qǐng zhùyì, míngtiān xiàwǔ liǎng diǎn, zài sān hào jiàoxuélóu èr líng wǔ jiàoshì jǔxíng Hànyǔ tīnglì kǎoshì, qǐng dài xuéshēngzhèng.) Facts: tomorrow 2 p.m., building 3, room 205, listening exam, bring student card. Note that room numbers are read digit by digit, with 0 as 「零」 or 「〇」.</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>A</td><td>你选了几门课？</td><td>Nǐ xuǎn le jǐ mén kè?</td><td>How many courses did you pick?</td></tr>
<tr><td>B</td><td>五门，每周二十个学时。</td><td>Wǔ mén, měi zhōu èrshí ge xuéshí.</td><td>Five, twenty periods a week.</td></tr>
<tr><td>A</td><td>太多了吧！作业呢？</td><td>Tài duō le ba! Zuòyè ne?</td><td>That's a lot! What about homework?</td></tr>
<tr><td>B</td><td>每天都有，不过我习惯了。</td><td>Měitiān dōu yǒu, búguò wǒ xíguàn le.</td><td>Every day, but I'm used to it.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> mixing up 「上课」 (attend class), 「下课」 (class ends) and 「放学」 (school finishes for the day). <strong>Role-play:</strong> one student asks about timetable, deadlines and exam format; the other answers from the announcement above.</p>
<p><strong>Extra practice.</strong></p><ol><li>How is 「三〇二」 read?<div class="dap-an"><strong>Answer:</strong> sān líng èr.</div></li></ol>`,
`<h3>Đi xa hơn: thông báo trong trường và hội thoại sinh viên</h3>
<p>Âm thanh ở trường có hai thể loại: <strong>thông báo</strong> (trang trọng, một người nói, nêu sự kiện như ngày, phòng, hạn chót) và <strong>trò chuyện sinh viên</strong> (thân mật, nhanh, có từ đệm như 「那个…」, 「就是…」). Hãy xử lý khác nhau. Với thông báo, liệt kê các dữ kiện vào ghi chú: 「请注意，明天下午两点，在三号教学楼二〇五教室举行汉语听力考试，请带学生证。」 (Qǐng zhùyì, míngtiān xiàwǔ liǎng diǎn, zài sān hào jiàoxuélóu èr líng wǔ jiàoshì jǔxíng Hànyǔ tīnglì kǎoshì, qǐng dài xuéshēngzhèng.) Dữ kiện: mai 2 giờ chiều, nhà 3, phòng 205, thi nghe, mang thẻ sinh viên. Lưu ý số phòng đọc từng chữ số, số 0 đọc 「零」 hoặc 「〇」.</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>A</td><td>你选了几门课？</td><td>Nǐ xuǎn le jǐ mén kè?</td><td>Bạn chọn mấy môn?</td></tr>
<tr><td>B</td><td>五门，每周二十个学时。</td><td>Wǔ mén, měi zhōu èrshí ge xuéshí.</td><td>Năm môn, mỗi tuần hai mươi tiết.</td></tr>
<tr><td>A</td><td>太多了吧！作业呢？</td><td>Tài duō le ba! Zuòyè ne?</td><td>Nhiều quá! Còn bài tập?</td></tr>
<tr><td>B</td><td>每天都有，不过我习惯了。</td><td>Měitiān dōu yǒu, búguò wǒ xíguàn le.</td><td>Ngày nào cũng có, nhưng mình quen rồi.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> nhầm 「上课」 (vào học), 「下课」 (hết tiết) và 「放学」 (tan học). <strong>Nhập vai:</strong> một bạn hỏi về thời khoá biểu, hạn nộp và hình thức thi; bạn kia đáp dựa trên thông báo ở trên.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「三〇二」 đọc thế nào?<div class="dap-an"><strong>Đáp án:</strong> sān líng èr.</div></li></ol>`],

  'cls201-ts-3-3': [`<h3>Going further: comparison patterns at a glance</h3>
<p>Comparisons appear constantly in HSK 3 listening because they hide the answer in word order. Keep four patterns apart: <strong>A 比 B + adj</strong> (A is more): 「今天比昨天冷。」 Jīntiān bǐ zuótiān lěng. <strong>A 没有 B + adj</strong> (A is not as … as B): 「我没有他高。」 Wǒ méiyǒu tā gāo. <strong>A 跟 B 一样 + adj</strong> (equal): 「这个跟那个一样大。」 Zhège gēn nàge yíyàng dà. <strong>更 / 还</strong> add degree: 「他比我更忙。」 Tā bǐ wǒ gèng máng. To state the size of the gap, put it after the adjective: 「他比我高五厘米。」 Tā bǐ wǒ gāo wǔ límǐ.</p>
<table><thead><tr><th>Audio</th><th>Pinyin</th><th>Who is higher/more?</th></tr></thead><tbody>
<tr><td>北京比河内冷多了。</td><td>Běijīng bǐ Hénèi lěng duō le.</td><td>Beijing is far colder</td></tr>
<tr><td>我没有姐姐聪明。</td><td>Wǒ méiyǒu jiějie cōngming.</td><td>Sister is smarter</td></tr>
<tr><td>这家比那家贵一点儿。</td><td>Zhè jiā bǐ nà jiā guì yìdiǎnr.</td><td>This one slightly dearer</td></tr>
<tr><td>他的汉语跟我的差不多。</td><td>Tā de Hànyǔ gēn wǒ de chàbuduō.</td><td>About equal</td></tr></tbody></table>
<p><strong>Typical mistakes:</strong> (1) saying 「他比我很高」 — never use 很 after 比; (2) hearing 「没有」 and thinking “has none”; with an adjective after it, it is a comparison. Listen for the person named <em>first</em>: in 「我没有姐姐聪明」 the speaker is the less clever one.</p>
<p><strong>Extra practice.</strong></p><ol><li>「弟弟比我小三岁。」 Who is older?<div class="dap-an"><strong>Answer:</strong> The speaker, by three years.</div></li></ol>`,
`<h3>Đi xa hơn: tổng hợp các mẫu so sánh</h3>
<p>So sánh xuất hiện liên tục trong bài nghe HSK 3 vì đáp án nằm ở trật tự từ. Hãy phân biệt bốn mẫu: <strong>A 比 B + tính từ</strong> (A hơn): 「今天比昨天冷。」 Jīntiān bǐ zuótiān lěng. <strong>A 没有 B + tính từ</strong> (A không bằng B): 「我没有他高。」 Wǒ méiyǒu tā gāo. <strong>A 跟 B 一样 + tính từ</strong> (bằng nhau): 「这个跟那个一样大。」 Zhège gēn nàge yíyàng dà. <strong>更 / 还</strong> thêm mức độ: 「他比我更忙。」 Tā bǐ wǒ gèng máng. Muốn nói độ chênh thì đặt sau tính từ: 「他比我高五厘米。」 Tā bǐ wǒ gāo wǔ límǐ.</p>
<table><thead><tr><th>Âm thanh</th><th>Pinyin</th><th>Ai hơn?</th></tr></thead><tbody>
<tr><td>北京比河内冷多了。</td><td>Běijīng bǐ Hénèi lěng duō le.</td><td>Bắc Kinh lạnh hơn nhiều</td></tr>
<tr><td>我没有姐姐聪明。</td><td>Wǒ méiyǒu jiějie cōngming.</td><td>Chị thông minh hơn</td></tr>
<tr><td>这家比那家贵一点儿。</td><td>Zhè jiā bǐ nà jiā guì yìdiǎnr.</td><td>Quán này đắt hơn chút</td></tr>
<tr><td>他的汉语跟我的差不多。</td><td>Tā de Hànyǔ gēn wǒ de chàbuduō.</td><td>Gần như bằng nhau</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> (1) nói 「他比我很高」 — không bao giờ dùng 很 sau 比; (2) nghe 「没有」 rồi tưởng “không có”; khi sau nó có tính từ thì đó là so sánh. Hãy nghe người được nêu <em>trước</em>: trong 「我没有姐姐聪明」 người nói là bên kém thông minh hơn.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「弟弟比我小三岁。」 Ai lớn hơn?<div class="dap-an"><strong>Đáp án:</strong> Người nói, hơn ba tuổi.</div></li></ol>`],

  'cls201-ts-3-4': [`<h3>Going further: a ladder of agreement and disagreement</h3>
<p>Opinions in Chinese are graded. Strong agreement: 「我完全同意。」 (Wǒ wánquán tóngyì.) and 「你说得对。」 (Nǐ shuō de duì.). Partial agreement: 「你说的有道理，不过…」 (Nǐ shuō de yǒu dàolǐ, búguò…). Polite disagreement: 「我的看法不太一样。」 (Wǒ de kànfǎ bú tài yíyàng.) or 「我不这么认为。」 (Wǒ bú zhème rènwéi.). Direct disagreement 「你错了」 is rare and rude. To give your own opinion you can open with 「我觉得…」 (Wǒ juéde…), 「在我看来…」 (Zài wǒ kànlái…), or 「依我看…」 (Yī wǒ kàn…); to give a reason, add 「因为…」.</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>A</td><td>我觉得大学生应该多打工。</td><td>Wǒ juéde dàxuéshēng yīnggāi duō dǎgōng.</td><td>I think students should work more.</td></tr>
<tr><td>B</td><td>有道理，不过学习更重要。</td><td>Yǒu dàolǐ, búguò xuéxí gèng zhòngyào.</td><td>True, but study matters more.</td></tr>
<tr><td>A</td><td>可是打工能学到经验啊。</td><td>Kěshì dǎgōng néng xuédào jīngyàn a.</td><td>But work gives experience.</td></tr>
<tr><td>B</td><td>这一点我同意。</td><td>Zhè yì diǎn wǒ tóngyì.</td><td>I agree on that point.</td></tr></tbody></table>
<p><strong>Listening tip.</strong> The speaker's final position is usually after 「不过」 or 「但是」. <strong>Typical mistake:</strong> translating “I think” literally as 「我想」, which means <em>I want / I am thinking</em>; use 「我觉得」 for opinions.</p>
<p><strong>Extra practice.</strong></p><ol><li>Is 「你说的有道理，不过…」 agreement or disagreement?<div class="dap-an"><strong>Answer:</strong> Partial agreement leading to a different view.</div></li></ol>`,
`<h3>Đi xa hơn: nấc thang đồng ý và phản đối</h3>
<p>Quan điểm trong tiếng Trung được chia mức. Đồng ý mạnh: 「我完全同意。」 (Wǒ wánquán tóngyì.) và 「你说得对。」 (Nǐ shuō de duì.). Đồng ý một phần: 「你说的有道理，不过…」 (Nǐ shuō de yǒu dàolǐ, búguò…). Phản đối lịch sự: 「我的看法不太一样。」 (Wǒ de kànfǎ bú tài yíyàng.) hoặc 「我不这么认为。」 (Wǒ bú zhème rènwéi.). Phản đối thẳng 「你错了」 hiếm và thô. Để nêu ý kiến, bạn có thể mở bằng 「我觉得…」 (Wǒ juéde…), 「在我看来…」 (Zài wǒ kànlái…) hoặc 「依我看…」 (Yī wǒ kàn…); để nêu lý do, thêm 「因为…」.</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>A</td><td>我觉得大学生应该多打工。</td><td>Wǒ juéde dàxuéshēng yīnggāi duō dǎgōng.</td><td>Mình nghĩ sinh viên nên đi làm thêm nhiều hơn.</td></tr>
<tr><td>B</td><td>有道理，不过学习更重要。</td><td>Yǒu dàolǐ, búguò xuéxí gèng zhòngyào.</td><td>Có lý, nhưng học quan trọng hơn.</td></tr>
<tr><td>A</td><td>可是打工能学到经验啊。</td><td>Kěshì dǎgōng néng xuédào jīngyàn a.</td><td>Nhưng đi làm học được kinh nghiệm mà.</td></tr>
<tr><td>B</td><td>这一点我同意。</td><td>Zhè yì diǎn wǒ tóngyì.</td><td>Điểm này mình đồng ý.</td></tr></tbody></table>
<p><strong>Mẹo nghe.</strong> Lập trường cuối cùng của người nói thường nằm sau 「不过」 hoặc 「但是」. <strong>Lỗi điển hình:</strong> dịch “tôi nghĩ” thành 「我想」, nghĩa là <em>tôi muốn / tôi đang nghĩ</em>; hãy dùng 「我觉得」 cho ý kiến.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「你说的有道理，不过…」 là đồng ý hay phản đối?<div class="dap-an"><strong>Đáp án:</strong> Đồng ý một phần rồi chuyển sang quan điểm khác.</div></li></ol>`],
  'cls201-ts-4-1': [`<h3>Going further: telling 过, 了 and 着 apart by ear</h3>
<p>These three particles look similar in pinyin lists but mean different things, and the question often depends on the difference. <strong>过 (guo)</strong> = the experience happened at some point: 「我去过上海。」 Wǒ qù guo Shànghǎi. (I have been to Shanghai.) The negative is 「没去过」. <strong>了 (le)</strong> = completion or a new situation: 「我吃了早饭。」 Wǒ chī le zǎofàn. (I ate breakfast.) <strong>着 (zhe)</strong> = a continuing state: 「门开着。」 Mén kāi zhe. (The door is open.) Compare 「他穿着红衣服」 (he is wearing red) with 「他穿了红衣服」 (he put on red clothes).</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>What you learn</th></tr></thead><tbody>
<tr><td>我没吃过北京烤鸭。</td><td>Wǒ méi chī guo Běijīng kǎoyā.</td><td>never tried it</td></tr>
<tr><td>他昨天买了一本书。</td><td>Tā zuótiān mǎi le yì běn shū.</td><td>bought, completed</td></tr>
<tr><td>墙上挂着一幅画。</td><td>Qiáng shàng guà zhe yì fú huà.</td><td>a picture hangs there</td></tr>
<tr><td>她笑着说：“谢谢！”</td><td>Tā xiào zhe shuō: “Xièxie!”</td><td>said while smiling</td></tr></tbody></table>
<p><strong>Typical mistakes:</strong> adding 了 to every past sentence (past habits take no 了: 「我小时候常常游泳」), and using 了 with 过 together for the same idea. Listen: if you hear 「去过」 you know nothing about a recent trip, only that it happened sometime.</p>
<p><strong>Extra practice.</strong></p><ol><li>「我没学过日语。」 Does he speak Japanese?<div class="dap-an"><strong>Answer:</strong> Probably not; he has never studied it.</div></li><li>Which particle describes a state in 「灯开着」?<div class="dap-an"><strong>Answer:</strong> 着.</div></li></ol>`,
`<h3>Đi xa hơn: phân biệt 过, 了 và 着 bằng tai</h3>
<p>Ba trợ từ này nhìn trong danh sách pinyin thì giống nhau nhưng nghĩa khác, và câu hỏi thường phụ thuộc vào sự khác biệt đó. <strong>过 (guo)</strong> = đã từng trải qua: 「我去过上海。」 Wǒ qù guo Shànghǎi. (Tôi đã từng đến Thượng Hải.) Phủ định là 「没去过」. <strong>了 (le)</strong> = hoàn thành hoặc tình huống mới: 「我吃了早饭。」 Wǒ chī le zǎofàn. (Tôi đã ăn sáng.) <strong>着 (zhe)</strong> = trạng thái đang kéo dài: 「门开着。」 Mén kāi zhe. (Cửa đang mở.) So sánh 「他穿着红衣服」 (anh ấy đang mặc đồ đỏ) với 「他穿了红衣服」 (anh ấy đã mặc đồ đỏ vào).</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Biết được gì</th></tr></thead><tbody>
<tr><td>我没吃过北京烤鸭。</td><td>Wǒ méi chī guo Běijīng kǎoyā.</td><td>chưa từng thử</td></tr>
<tr><td>他昨天买了一本书。</td><td>Tā zuótiān mǎi le yì běn shū.</td><td>đã mua xong</td></tr>
<tr><td>墙上挂着一幅画。</td><td>Qiáng shàng guà zhe yì fú huà.</td><td>có một bức tranh treo</td></tr>
<tr><td>她笑着说：“谢谢！”</td><td>Tā xiào zhe shuō: “Xièxie!”</td><td>vừa cười vừa nói</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> thêm 了 vào mọi câu quá khứ (thói quen quá khứ không có 了: 「我小时候常常游泳」), và dùng 了 cùng 过 cho một ý. Khi nghe 「去过」 bạn không biết gì về chuyến đi gần đây, chỉ biết nó từng xảy ra.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「我没学过日语。」 Anh ấy nói được tiếng Nhật không?<div class="dap-an"><strong>Đáp án:</strong> Nhiều khả năng không; anh chưa từng học.</div></li><li>Trợ từ nào chỉ trạng thái trong 「灯开着」?<div class="dap-an"><strong>Đáp án:</strong> 着.</div></li></ol>`],

  'cls201-ts-4-2': [`<h3>Going further: duration versus frequency, and where the number goes</h3>
<p>Duration answers “for how long”, frequency answers “how many times”. Both go <em>after the verb</em>, but they take different words. Duration: 「我学了两年汉语。」 Wǒ xué le liǎng nián Hànyǔ. With an object, repeat the verb or move the object: 「我学汉语学了两年。」 Frequency: 「我去过三次北京。」 Wǒ qù guo sān cì Běijīng. (次 cì for events; 遍 biàn for a complete run-through; 趟 tàng for trips.) Adverbs of frequency sit before the verb: 「他常常迟到」, 「我偶尔看电影」, 「她从来不喝酒」 (never). Habits are often stated with 「每…都…」: 「我每天都跑步。」</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>他每天睡八个小时。</td><td>Tā měitiān shuì bā ge xiǎoshí.</td><td>He sleeps eight hours a day.</td></tr>
<tr><td>我一个星期上三次课。</td><td>Wǒ yí ge xīngqī shàng sān cì kè.</td><td>I have class three times a week.</td></tr>
<tr><td>我等了他半个小时。</td><td>Wǒ děng le tā bàn ge xiǎoshí.</td><td>I waited half an hour for him.</td></tr>
<tr><td>这个电影我看了两遍。</td><td>Zhège diànyǐng wǒ kàn le liǎng biàn.</td><td>I watched this film twice.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> asking “how long” with 「多久」 but answering with a point in time (「三点」). Duration has no 「点」: 「三个小时」. In listening, tell 「一个小时」 (one hour long) from 「一点」 (one o'clock): the first has 个.</p>
<p><strong>Extra practice.</strong></p><ol><li>「他一个月回三次家。」 How often?<div class="dap-an"><strong>Answer:</strong> Three times a month.</div></li></ol>`,
`<h3>Đi xa hơn: thời lượng và tần suất, và vị trí của con số</h3>
<p>Thời lượng trả lời “bao lâu”, tần suất trả lời “mấy lần”. Cả hai đứng <em>sau động từ</em> nhưng dùng từ khác nhau. Thời lượng: 「我学了两年汉语。」 Wǒ xué le liǎng nián Hànyǔ. Khi có tân ngữ, lặp động từ hoặc dời tân ngữ: 「我学汉语学了两年。」 Tần suất: 「我去过三次北京。」 Wǒ qù guo sān cì Běijīng. (次 cì cho sự việc; 遍 biàn cho một lượt trọn vẹn; 趟 tàng cho chuyến đi.) Phó từ tần suất đứng trước động từ: 「他常常迟到」, 「我偶尔看电影」, 「她从来不喝酒」 (không bao giờ). Thói quen hay nói bằng 「每…都…」: 「我每天都跑步。」</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>他每天睡八个小时。</td><td>Tā měitiān shuì bā ge xiǎoshí.</td><td>Anh ấy ngủ tám tiếng mỗi ngày.</td></tr>
<tr><td>我一个星期上三次课。</td><td>Wǒ yí ge xīngqī shàng sān cì kè.</td><td>Một tuần tôi học ba buổi.</td></tr>
<tr><td>我等了他半个小时。</td><td>Wǒ děng le tā bàn ge xiǎoshí.</td><td>Tôi đã đợi anh ấy nửa tiếng.</td></tr>
<tr><td>这个电影我看了两遍。</td><td>Zhège diànyǐng wǒ kàn le liǎng biàn.</td><td>Phim này tôi xem hai lần.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> hỏi “bao lâu” bằng 「多久」 nhưng đáp bằng thời điểm (「三点」). Thời lượng không có 「点」: 「三个小时」. Khi nghe, phân biệt 「一个小时」 (dài một tiếng) với 「一点」 (một giờ): cái đầu có 个.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「他一个月回三次家。」 Tần suất thế nào?<div class="dap-an"><strong>Đáp án:</strong> Ba lần một tháng.</div></li></ol>`],

  'cls201-ts-4-3': [`<h3>Going further: a model story and a retelling frame</h3>
<p>A short story in Chinese keeps strict order: time words first, then events linked by connectors. Core connectors: 「首先」 (shǒuxiān, first), 「然后」 (ránhòu, then), 「接着」 (jiēzhe, next), 「后来」 (hòulái, later, past only), 「最后」 (zuìhòu, finally), 「突然」 (tūrán, suddenly). Model: 「上星期六我和朋友去爬山。首先我们坐地铁到山脚，然后走了两个小时才到山顶。突然下起了雨，我们只好躲在一个小亭子里。最后雨停了，我们高高兴兴地下山了。」 (Shàng xīngqī liù wǒ hé péngyou qù páshān. Shǒuxiān wǒmen zuò dìtiě dào shānjiǎo, ránhòu zǒu le liǎng ge xiǎoshí cái dào shāndǐng. Tūrán xià qǐ le yǔ, wǒmen zhǐhǎo duǒ zài yí ge xiǎo tíngzi lǐ. Zuìhòu yǔ tíng le, wǒmen gāogāoxìngxìng de xià shān le.)</p>
<table><thead><tr><th>Step</th><th>Frame</th><th>Pinyin</th></tr></thead><tbody>
<tr><td>time + people</td><td>上星期六，我和…</td><td>Shàng xīngqī liù, wǒ hé…</td></tr>
<tr><td>event 1</td><td>首先…</td><td>Shǒuxiān…</td></tr>
<tr><td>event 2</td><td>然后…，接着…</td><td>Ránhòu…, jiēzhe…</td></tr>
<tr><td>surprise</td><td>突然…</td><td>Tūrán…</td></tr>
<tr><td>end + feeling</td><td>最后…，我觉得…</td><td>Zuìhòu…, wǒ juéde…</td></tr></tbody></table>
<p><strong>Speaking task.</strong> Retell the story in 40 seconds from the five frame words only. <strong>Typical mistake:</strong> starting every sentence with 「我」 and dropping all connectors; learners then sound like a list of facts rather than a story.</p>
<p><strong>Extra practice.</strong></p><ol><li>Put in order: 最后 / 首先 / 然后.<div class="dap-an"><strong>Answer:</strong> 首先 → 然后 → 最后.</div></li></ol>`,
`<h3>Đi xa hơn: truyện mẫu và khung kể lại</h3>
<p>Một câu chuyện ngắn trong tiếng Trung giữ trật tự chặt: từ chỉ thời gian trước, rồi các sự kiện nối bằng liên từ. Liên từ cốt lõi: 「首先」 (shǒuxiān, trước hết), 「然后」 (ránhòu, sau đó), 「接着」 (jiēzhe, tiếp theo), 「后来」 (hòulái, về sau, chỉ quá khứ), 「最后」 (zuìhòu, cuối cùng), 「突然」 (tūrán, đột nhiên). Truyện mẫu: 「上星期六我和朋友去爬山。首先我们坐地铁到山脚，然后走了两个小时才到山顶。突然下起了雨，我们只好躲在一个小亭子里。最后雨停了，我们高高兴兴地下山了。」 (Shàng xīngqī liù wǒ hé péngyou qù páshān. Shǒuxiān wǒmen zuò dìtiě dào shānjiǎo, ránhòu zǒu le liǎng ge xiǎoshí cái dào shāndǐng. Tūrán xià qǐ le yǔ, wǒmen zhǐhǎo duǒ zài yí ge xiǎo tíngzi lǐ. Zuìhòu yǔ tíng le, wǒmen gāogāoxìngxìng de xià shān le.)</p>
<table><thead><tr><th>Bước</th><th>Khung</th><th>Pinyin</th></tr></thead><tbody>
<tr><td>thời gian + người</td><td>上星期六，我和…</td><td>Shàng xīngqī liù, wǒ hé…</td></tr>
<tr><td>sự kiện 1</td><td>首先…</td><td>Shǒuxiān…</td></tr>
<tr><td>sự kiện 2</td><td>然后…，接着…</td><td>Ránhòu…, jiēzhe…</td></tr>
<tr><td>bất ngờ</td><td>突然…</td><td>Tūrán…</td></tr>
<tr><td>kết + cảm xúc</td><td>最后…，我觉得…</td><td>Zuìhòu…, wǒ juéde…</td></tr></tbody></table>
<p><strong>Bài nói.</strong> Kể lại câu chuyện trong 40 giây chỉ dựa vào năm từ khung. <strong>Lỗi điển hình:</strong> câu nào cũng mở bằng 「我」 và bỏ hết liên từ; người học nghe như một danh sách sự việc chứ không phải câu chuyện.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Sắp xếp: 最后 / 首先 / 然后.<div class="dap-an"><strong>Đáp án:</strong> 首先 → 然后 → 最后.</div></li></ol>`],

  'cls201-ts-4-4': [`<h3>Going further: recognising 把 and 被 in fast speech</h3>
<p>Both patterns put the affected object <em>before</em> the verb, which surprises learners used to subject–verb–object order. <strong>把 sentence</strong>: Subject + 把 + object + verb + result. 「我把作业做完了。」 Wǒ bǎ zuòyè zuò wán le. (I finished the homework.) The verb is never bare: it needs a result (完, 好, 到), a direction (上, 下), or 了. <strong>被 sentence</strong>: affected thing + 被 + (doer) + verb + result. 「我的手机被他拿走了。」 Wǒ de shǒujī bèi tā ná zǒu le. (My phone was taken by him.) 被 often implies something unpleasant or unexpected. Spoken Chinese also uses 「让」 and 「叫」 in place of 被: 「书让弟弟弄坏了。」</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Who did what?</th></tr></thead><tbody>
<tr><td>请把门关上。</td><td>Qǐng bǎ mén guān shang.</td><td>request: close the door</td></tr>
<tr><td>他把钱包丢了。</td><td>Tā bǎ qiánbāo diū le.</td><td>he lost his wallet</td></tr>
<tr><td>蛋糕被孩子吃光了。</td><td>Dàngāo bèi háizi chī guāng le.</td><td>the kids ate it all</td></tr>
<tr><td>我被老师表扬了。</td><td>Wǒ bèi lǎoshī biǎoyáng le.</td><td>teacher praised me</td></tr></tbody></table>
<p><strong>Listening tip.</strong> Spot 把 or 被 first: it tells you the noun that follows is the <em>thing affected</em>, not the doer. After 被, the doer is the next noun. <strong>Typical mistake:</strong> hearing 「蛋糕被孩子吃光了」 and answering that the cake ate; check the order of 被.</p>
<p><strong>Extra practice.</strong></p><ol><li>Who lost the phone in 「他的手机被小偷偷走了」?<div class="dap-an"><strong>Answer:</strong> He did; the thief took it.</div></li></ol>`,
`<h3>Đi xa hơn: nhận ra 把 và 被 trong lời nói nhanh</h3>
<p>Cả hai mẫu đều đặt vật bị tác động <em>trước</em> động từ, điều khiến người quen trật tự chủ–vị–tân bị bất ngờ. <strong>Câu 把</strong>: Chủ ngữ + 把 + tân ngữ + động từ + kết quả. 「我把作业做完了。」 Wǒ bǎ zuòyè zuò wán le. (Tôi đã làm xong bài tập.) Động từ không đứng trơ trọi: cần kết quả (完, 好, 到), hướng (上, 下) hoặc 了. <strong>Câu 被</strong>: vật bị tác động + 被 + (người làm) + động từ + kết quả. 「我的手机被他拿走了。」 Wǒ de shǒujī bèi tā ná zǒu le. (Điện thoại của tôi bị anh ta lấy đi.) 被 thường hàm ý điều không hay hoặc bất ngờ. Khẩu ngữ còn dùng 「让」 và 「叫」 thay cho 被: 「书让弟弟弄坏了。」</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Ai làm gì?</th></tr></thead><tbody>
<tr><td>请把门关上。</td><td>Qǐng bǎ mén guān shang.</td><td>yêu cầu: đóng cửa lại</td></tr>
<tr><td>他把钱包丢了。</td><td>Tā bǎ qiánbāo diū le.</td><td>anh ấy làm mất ví</td></tr>
<tr><td>蛋糕被孩子吃光了。</td><td>Dàngāo bèi háizi chī guāng le.</td><td>bọn trẻ ăn hết</td></tr>
<tr><td>我被老师表扬了。</td><td>Wǒ bèi lǎoshī biǎoyáng le.</td><td>thầy khen tôi</td></tr></tbody></table>
<p><strong>Mẹo nghe.</strong> Bắt 把 hoặc 被 trước: nó cho biết danh từ theo sau là <em>vật bị tác động</em>, không phải người làm. Sau 被, người làm là danh từ kế tiếp. <strong>Lỗi điển hình:</strong> nghe 「蛋糕被孩子吃光了」 rồi trả lời là cái bánh ăn; hãy kiểm tra vị trí của 被.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Ai bị mất điện thoại trong 「他的手机被小偷偷走了」?<div class="dap-an"><strong>Đáp án:</strong> Anh ấy; tên trộm đã lấy.</div></li></ol>`],

  'cls201-ts-5-1': [`<h3>Going further: describing how, where and since when</h3>
<p>A symptom report in Chinese has four slots: <strong>where</strong> it hurts, <strong>what kind</strong> of pain, <strong>since when</strong>, and <strong>what makes it worse</strong>. Frames: 「我头疼」 (Wǒ tóu téng), 「我嗓子很痛」 (Wǒ sǎngzi hěn tòng, sore throat), 「我肚子不舒服」 (Wǒ dùzi bù shūfu), 「我咳嗽，还流鼻涕」 (Wǒ késou, hái liú bítì). Duration: 「已经三天了」 (yǐjīng sān tiān le) — note the final 了 meaning “and still continuing”. Degree: 「有点儿」 (a little), 「很」 (quite), 「特别」 (especially). Fever: 「我发烧了，三十八度五。」 Wǒ fāshāo le, sānshíbā dù wǔ. (38.5 °C.)</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>我从昨天晚上开始拉肚子。</td><td>Wǒ cóng zuótiān wǎnshang kāishǐ lā dùzi.</td><td>diarrhoea since last night</td></tr>
<tr><td>吃东西以后胃更疼。</td><td>Chī dōngxi yǐhòu wèi gèng téng.</td><td>stomach hurts more after eating</td></tr>
<tr><td>我浑身没力气。</td><td>Wǒ húnshēn méi lìqi.</td><td>no strength all over</td></tr>
<tr><td>晚上咳得睡不着。</td><td>Wǎnshang ké de shuì bu zháo.</td><td>coughing too much to sleep</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> using 「我有头疼」 (a literal “I have headache”); say 「我头疼」. <strong>Speaking task:</strong> report one symptom in four short sentences using all four slots.</p>
<p><strong>Extra practice.</strong></p><ol><li>Say "I have had a sore throat for two days."<div class="dap-an"><strong>Answer:</strong> 我嗓子疼已经两天了。</div></li></ol>`,
`<h3>Đi xa hơn: mô tả thế nào, ở đâu và từ khi nào</h3>
<p>Một bản báo triệu chứng bằng tiếng Trung có bốn ô: <strong>đau ở đâu</strong>, <strong>đau kiểu gì</strong>, <strong>từ khi nào</strong> và <strong>điều gì làm nặng thêm</strong>. Khung câu: 「我头疼」 (Wǒ tóu téng), 「我嗓子很痛」 (Wǒ sǎngzi hěn tòng, đau họng), 「我肚子不舒服」 (Wǒ dùzi bù shūfu), 「我咳嗽，还流鼻涕」 (Wǒ késou, hái liú bítì). Thời lượng: 「已经三天了」 (yǐjīng sān tiān le) — chú ý 了 cuối câu nghĩa là “và vẫn đang tiếp diễn”. Mức độ: 「有点儿」 (hơi), 「很」 (khá), 「特别」 (đặc biệt). Sốt: 「我发烧了，三十八度五。」 Wǒ fāshāo le, sānshíbā dù wǔ. (38,5 °C.)</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>我从昨天晚上开始拉肚子。</td><td>Wǒ cóng zuótiān wǎnshang kāishǐ lā dùzi.</td><td>tiêu chảy từ tối qua</td></tr>
<tr><td>吃东西以后胃更疼。</td><td>Chī dōngxi yǐhòu wèi gèng téng.</td><td>ăn xong dạ dày đau hơn</td></tr>
<tr><td>我浑身没力气。</td><td>Wǒ húnshēn méi lìqi.</td><td>cả người không có sức</td></tr>
<tr><td>晚上咳得睡不着。</td><td>Wǎnshang ké de shuì bu zháo.</td><td>ho đến không ngủ được</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> dùng 「我有头疼」 (dịch từng chữ “tôi có đau đầu”); hãy nói 「我头疼」. <strong>Bài nói:</strong> báo một triệu chứng bằng bốn câu ngắn, dùng đủ bốn ô.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Nói “Tôi bị đau họng đã hai ngày rồi.”<div class="dap-an"><strong>Đáp án:</strong> 我嗓子疼已经两天了。</div></li></ol>`],

  'cls201-ts-5-2': [`<h3>Going further: the doctor's question sequence</h3>
<p>A consultation follows a predictable script, so you can predict each question. (1) Greeting and complaint: 「哪里不舒服？」 Nǎlǐ bù shūfu? (2) Duration: 「多长时间了？」 Duō cháng shíjiān le? (3) Related symptoms: 「发烧吗？咳嗽吗？」 (4) History: 「以前有过这种情况吗？对什么药过敏吗？」 Duì shénme yào guòmǐn ma? (5) Examination: 「张开嘴，说‘啊’。」 Zhāng kāi zuǐ, shuō “à”. (6) Diagnosis: 「你得了感冒。」 (7) Instructions: 「一天三次，饭后吃，一次两片。」 Yì tiān sān cì, fàn hòu chī, yí cì liǎng piàn.</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>医生</td><td>你对什么药过敏吗？</td><td>Nǐ duì shénme yào guòmǐn ma?</td><td>Are you allergic to any drug?</td></tr>
<tr><td>病人</td><td>我对青霉素过敏。</td><td>Wǒ duì qīngméisù guòmǐn.</td><td>I'm allergic to penicillin.</td></tr>
<tr><td>医生</td><td>那我给你开别的药，要多喝水。</td><td>Nà wǒ gěi nǐ kāi bié de yào, yào duō hē shuǐ.</td><td>Then I'll prescribe another; drink plenty of water.</td></tr>
<tr><td>病人</td><td>要不要打针？</td><td>Yào bu yào dǎ zhēn?</td><td>Do I need an injection?</td></tr></tbody></table>
<p><strong>Listening tip.</strong> Prescription details (how many times, when, how many tablets) are the usual exam target; note them as <em>3× / after meal / 2</em>. <strong>Typical mistake:</strong> confusing 「饭前」 (before meals) with 「饭后」 (after meals).</p>
<p><strong>Extra practice.</strong></p><ol><li>「一天两次，一次一片」: total tablets per day?<div class="dap-an"><strong>Answer:</strong> Two.</div></li></ol>`,
`<h3>Đi xa hơn: chuỗi câu hỏi của bác sĩ</h3>
<p>Buổi khám theo một kịch bản dễ đoán nên bạn có thể đoán trước từng câu hỏi. (1) Chào và hỏi bệnh: 「哪里不舒服？」 Nǎlǐ bù shūfu? (2) Thời gian: 「多长时间了？」 Duō cháng shíjiān le? (3) Triệu chứng liên quan: 「发烧吗？咳嗽吗？」 (4) Tiền sử: 「以前有过这种情况吗？对什么药过敏吗？」 Duì shénme yào guòmǐn ma? (5) Khám: 「张开嘴，说‘啊’。」 Zhāng kāi zuǐ, shuō “à”. (6) Chẩn đoán: 「你得了感冒。」 (7) Dặn dò: 「一天三次，饭后吃，一次两片。」 Yì tiān sān cì, fàn hòu chī, yí cì liǎng piàn.</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>医生</td><td>你对什么药过敏吗？</td><td>Nǐ duì shénme yào guòmǐn ma?</td><td>Bạn dị ứng thuốc nào không?</td></tr>
<tr><td>病人</td><td>我对青霉素过敏。</td><td>Wǒ duì qīngméisù guòmǐn.</td><td>Tôi dị ứng penicillin.</td></tr>
<tr><td>医生</td><td>那我给你开别的药，要多喝水。</td><td>Nà wǒ gěi nǐ kāi bié de yào, yào duō hē shuǐ.</td><td>Vậy tôi kê thuốc khác, nhớ uống nhiều nước.</td></tr>
<tr><td>病人</td><td>要不要打针？</td><td>Yào bu yào dǎ zhēn?</td><td>Có cần tiêm không?</td></tr></tbody></table>
<p><strong>Mẹo nghe.</strong> Chi tiết kê đơn (mấy lần, khi nào, mấy viên) thường là đích của câu hỏi thi; hãy ghi dạng <em>3× / sau ăn / 2</em>. <strong>Lỗi điển hình:</strong> nhầm 「饭前」 (trước bữa ăn) với 「饭后」 (sau bữa ăn).</p>
<p><strong>Luyện thêm.</strong></p><ol><li>「一天两次，一次一片」: mỗi ngày tổng cộng mấy viên?<div class="dap-an"><strong>Đáp án:</strong> Hai viên.</div></li></ol>`],

  'cls201-ts-5-3': [`<h3>Going further: giving advice at three strengths</h3>
<p>Advice has levels. Gentle suggestion: 「你可以…」 (Nǐ kěyǐ…) and 「要不要…？」 (Yào bu yào…?). Normal advice: 「你最好…」 (Nǐ zuìhǎo…, you had better) and 「应该…」 (yīnggāi). Strong warning: 「千万不要…」 (qiānwàn bú yào…, absolutely do not) and 「一定要…」 (yídìng yào…). Healthy-habit vocabulary: 早睡早起 zǎo shuì zǎo qǐ, 锻炼身体 duànliàn shēntǐ, 少吃油腻的东西 shǎo chī yóunì de dōngxi, 多吃蔬菜水果 duō chī shūcài shuǐguǒ, 戒烟 jiè yān (quit smoking).</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Strength</th></tr></thead><tbody>
<tr><td>你可以每天散步半小时。</td><td>Nǐ kěyǐ měitiān sànbù bàn xiǎoshí.</td><td>gentle</td></tr>
<tr><td>你最好早点儿睡。</td><td>Nǐ zuìhǎo zǎodiǎnr shuì.</td><td>normal</td></tr>
<tr><td>千万别熬夜！</td><td>Qiānwàn bié áoyè!</td><td>strong</td></tr>
<tr><td>不要一边吃饭一边玩手机。</td><td>Bú yào yìbiān chī fàn yìbiān wán shǒujī.</td><td>normal, negative</td></tr></tbody></table>
<p><strong>Role-play.</strong> A has no energy and often stays up late; B gives three pieces of advice, one gentle, one normal, one strong. <strong>Typical mistake:</strong> using 「要」 alone as advice, which sounds like an order; soften it with 「最好」 or 「可以」.</p>
<p><strong>Extra practice.</strong></p><ol><li>Which is stronger: 「你最好戒烟」 or 「你一定要戒烟」?<div class="dap-an"><strong>Answer:</strong> 一定要.</div></li></ol>`,
`<h3>Đi xa hơn: đưa lời khuyên ở ba mức</h3>
<p>Lời khuyên có nhiều mức. Gợi ý nhẹ: 「你可以…」 (Nǐ kěyǐ…) và 「要不要…？」 (Yào bu yào…?). Khuyên thường: 「你最好…」 (Nǐ zuìhǎo…, tốt nhất là) và 「应该…」 (yīnggāi). Cảnh báo mạnh: 「千万不要…」 (qiānwàn bú yào…, tuyệt đối đừng) và 「一定要…」 (yídìng yào…). Từ vựng thói quen lành mạnh: 早睡早起 zǎo shuì zǎo qǐ, 锻炼身体 duànliàn shēntǐ, 少吃油腻的东西 shǎo chī yóunì de dōngxi, 多吃蔬菜水果 duō chī shūcài shuǐguǒ, 戒烟 jiè yān (bỏ thuốc).</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Mức</th></tr></thead><tbody>
<tr><td>你可以每天散步半小时。</td><td>Nǐ kěyǐ měitiān sànbù bàn xiǎoshí.</td><td>nhẹ</td></tr>
<tr><td>你最好早点儿睡。</td><td>Nǐ zuìhǎo zǎodiǎnr shuì.</td><td>thường</td></tr>
<tr><td>千万别熬夜！</td><td>Qiānwàn bié áoyè!</td><td>mạnh</td></tr>
<tr><td>不要一边吃饭一边玩手机。</td><td>Bú yào yìbiān chī fàn yìbiān wán shǒujī.</td><td>thường, phủ định</td></tr></tbody></table>
<p><strong>Nhập vai.</strong> A thiếu năng lượng và hay thức khuya; B đưa ba lời khuyên: một nhẹ, một thường, một mạnh. <strong>Lỗi điển hình:</strong> chỉ dùng 「要」 làm lời khuyên nghe như mệnh lệnh; hãy làm mềm bằng 「最好」 hoặc 「可以」.</p>
<p><strong>Luyện thêm.</strong></p><ol><li>Câu nào mạnh hơn: 「你最好戒烟」 hay 「你一定要戒烟」?<div class="dap-an"><strong>Đáp án:</strong> 一定要.</div></li></ol>`],
  'cls201-ts-6-1': [`<h3>Going further: reading a train announcement and buying a ticket</h3>
<p>Station audio is dense with numbers and fixed phrases. Learn the core ones: 「检票口」 jiǎnpiàokǒu (ticket gate), 「站台」 zhàntái (platform), 「候车室」 hòuchēshì (waiting hall), 「晚点」 wǎndiǎn (delayed), 「正点」 zhèngdiǎn (on time), 「始发站 / 终点站」 shǐfāzhàn / zhōngdiǎnzhàn (departure / terminal), 「改签」 gǎiqiān (change ticket), 「退票」 tuìpiào (refund). A typical announcement: 「各位旅客请注意，开往上海的G七次列车现在开始检票，请到五号检票口。」 (Gèwèi lǚkè qǐng zhùyì, kāi wǎng Shànghǎi de G qī cì lièchē xiànzài kāishǐ jiǎnpiào, qǐng dào wǔ hào jiǎnpiàokǒu.) Facts: destination Shanghai, train G7, boarding now, gate 5. Train numbers are read digit by digit; 「一」 is often read <em>yāo</em> in numbers to avoid confusion with 七.</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>顾客</td><td>我要两张去杭州的票。</td><td>Wǒ yào liǎng zhāng qù Hángzhōu de piào.</td><td>Two tickets to Hangzhou.</td></tr>
<tr><td>售票员</td><td>几号的？要硬座还是软卧？</td><td>Jǐ hào de? Yào yìngzuò háishi ruǎnwò?</td><td>Which date? Hard seat or soft sleeper?</td></tr>
<tr><td>顾客</td><td>下周一的，二等座。</td><td>Xià zhōuyī de, èr děng zuò.</td><td>Next Monday, second class.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> missing 「改到」 (changed to) and writing down the old platform. <strong>Extra practice:</strong></p><ol><li>How is "train D312" read?<div class="dap-an"><strong>Answer:</strong> D sān yāo èr (or yī èr).</div></li></ol>`,
`<h3>Đi xa hơn: nghe thông báo tàu và mua vé</h3>
<p>Âm thanh ở nhà ga dày đặc con số và cụm cố định. Hãy học các cụm cốt lõi: 「检票口」 jiǎnpiàokǒu (cổng soát vé), 「站台」 zhàntái (sân ga), 「候车室」 hòuchēshì (phòng chờ), 「晚点」 wǎndiǎn (trễ), 「正点」 zhèngdiǎn (đúng giờ), 「始发站 / 终点站」 shǐfāzhàn / zhōngdiǎnzhàn (ga xuất phát / ga cuối), 「改签」 gǎiqiān (đổi vé), 「退票」 tuìpiào (trả vé). Một thông báo điển hình: 「各位旅客请注意，开往上海的G七次列车现在开始检票，请到五号检票口。」 (Gèwèi lǚkè qǐng zhùyì, kāi wǎng Shànghǎi de G qī cì lièchē xiànzài kāishǐ jiǎnpiào, qǐng dào wǔ hào jiǎnpiàokǒu.) Dữ kiện: đi Thượng Hải, tàu G7, bắt đầu soát vé, cổng 5. Số hiệu tàu đọc từng chữ số; 「一」 trong dãy số thường đọc <em>yāo</em> để khỏi lẫn với 七.</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>顾客</td><td>我要两张去杭州的票。</td><td>Wǒ yào liǎng zhāng qù Hángzhōu de piào.</td><td>Tôi lấy hai vé đi Hàng Châu.</td></tr>
<tr><td>售票员</td><td>几号的？要硬座还是软卧？</td><td>Jǐ hào de? Yào yìngzuò háishi ruǎnwò?</td><td>Ngày mấy? Ghế cứng hay giường nằm mềm?</td></tr>
<tr><td>顾客</td><td>下周一的，二等座。</td><td>Xià zhōuyī de, èr děng zuò.</td><td>Thứ Hai tuần sau, ghế hạng hai.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> bỏ lỡ 「改到」 (đổi sang) và ghi sân ga cũ. <strong>Luyện thêm:</strong></p><ol><li>“Tàu D312” đọc thế nào?<div class="dap-an"><strong>Đáp án:</strong> D sān yāo èr (hoặc yī èr).</div></li></ol>`],

  'cls201-ts-6-2': [`<h3>Going further: solving problems politely at the front desk</h3>
<p>Complaints at a hotel follow a formula: state the problem, state what you want, add a polite softener. Problem: 「空调坏了」 (kōngtiáo huài le), 「没有热水」 (méiyǒu rè shuǐ), 「网络连不上」 (wǎngluò lián bu shàng), 「房间太吵了」 (fángjiān tài chǎo le). Request: 「能不能帮我换一个房间？」 (Néng bu néng bāng wǒ huàn yí ge fángjiān?), 「麻烦你找人来修一下」 (Máfan nǐ zhǎo rén lái xiū yíxià). Softeners: 「不好意思」 (bù hǎoyìsi), 「麻烦你」 (máfan nǐ). The receptionist's typical replies: 「马上处理」 (mǎshàng chǔlǐ, right away), 「请稍等」 (qǐng shāo děng), 「给您换一间」.</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>客人</td><td>不好意思，我房间的空调坏了。</td><td>Bù hǎoyìsi, wǒ fángjiān de kōngtiáo huài le.</td><td>Sorry, the air conditioner is broken.</td></tr>
<tr><td>前台</td><td>真抱歉，我们马上派人去修。</td><td>Zhēn bàoqiàn, wǒmen mǎshàng pài rén qù xiū.</td><td>So sorry, we'll send someone right away.</td></tr>
<tr><td>客人</td><td>要是修不好，能换房间吗？</td><td>Yàoshi xiū bu hǎo, néng huàn fángjiān ma?</td><td>If it can't be fixed, can I change rooms?</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> sounding commanding with 「你给我换房间」; add 「能不能」 or 「麻烦你」. Check-out phrases: 「退房」 (tuìfáng), 「押金」 (yājīn, deposit), 「发票」 (fāpiào, receipt). <strong>Extra practice:</strong></p><ol><li>Make "No hot water" into a polite request.<div class="dap-an"><strong>Answer:</strong> 不好意思，我房间没有热水，麻烦你找人看一下。</div></li></ol>`,
`<h3>Đi xa hơn: giải quyết sự cố lịch sự ở quầy lễ tân</h3>
<p>Phàn nàn ở khách sạn theo công thức: nêu vấn đề, nêu điều muốn, thêm lời làm mềm. Vấn đề: 「空调坏了」 (kōngtiáo huài le), 「没有热水」 (méiyǒu rè shuǐ), 「网络连不上」 (wǎngluò lián bu shàng), 「房间太吵了」 (fángjiān tài chǎo le). Yêu cầu: 「能不能帮我换一个房间？」 (Néng bu néng bāng wǒ huàn yí ge fángjiān?), 「麻烦你找人来修一下」 (Máfan nǐ zhǎo rén lái xiū yíxià). Từ làm mềm: 「不好意思」 (bù hǎoyìsi), 「麻烦你」 (máfan nǐ). Lễ tân hay đáp: 「马上处理」 (mǎshàng chǔlǐ, xử lý ngay), 「请稍等」 (qǐng shāo děng), 「给您换一间」.</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>客人</td><td>不好意思，我房间的空调坏了。</td><td>Bù hǎoyìsi, wǒ fángjiān de kōngtiáo huài le.</td><td>Xin lỗi, máy lạnh phòng tôi hỏng.</td></tr>
<tr><td>前台</td><td>真抱歉，我们马上派人去修。</td><td>Zhēn bàoqiàn, wǒmen mǎshàng pài rén qù xiū.</td><td>Thành thật xin lỗi, chúng tôi cử người sửa ngay.</td></tr>
<tr><td>客人</td><td>要是修不好，能换房间吗？</td><td>Yàoshi xiū bu hǎo, néng huàn fángjiān ma?</td><td>Nếu không sửa được, đổi phòng được không?</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> nói kiểu ra lệnh 「你给我换房间」; hãy thêm 「能不能」 hoặc 「麻烦你」. Cụm khi trả phòng: 「退房」 (tuìfáng), 「押金」 (yājīn, tiền cọc), 「发票」 (fāpiào, hoá đơn). <strong>Luyện thêm:</strong></p><ol><li>Biến “Không có nước nóng” thành lời đề nghị lịch sự.<div class="dap-an"><strong>Đáp án:</strong> 不好意思，我房间没有热水，麻烦你找人看一下。</div></li></ol>`],

  'cls201-ts-6-3': [`<h3>Going further: forecasts and how a plan changes</h3>
<p>Weather audio uses compact forecast language: 「多云转晴」 (duōyún zhuǎn qíng, cloudy turning clear), 「小雨」 (light rain), 「大雨」 (heavy rain), 「气温」 qìwēn (temperature), 「最高气温三十二度，最低气温二十四度」. The key word 「转」 zhuǎn means “changing to”. Delays: 「受大雾影响，航班延误」 (shòu dà wù yǐngxiǎng, hángbān yánwù, flights delayed because of fog), 「取消」 (qǔxiāo, cancelled), 「改期」 (gǎiqī, rescheduled). Plans change with 「改成」, 「推迟到」, 「提前」.</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>明天白天多云，夜里有小雨。</td><td>Míngtiān báitiān duōyún, yèlǐ yǒu xiǎoyǔ.</td><td>Cloudy by day, light rain at night.</td></tr>
<tr><td>由于台风，比赛推迟到周日。</td><td>Yóuyú táifēng, bǐsài tuīchí dào zhōurì.</td><td>Because of the typhoon, the match is postponed to Sunday.</td></tr>
<tr><td>航班提前了一个小时起飞。</td><td>Hángbān tíqián le yí ge xiǎoshí qǐfēi.</td><td>The flight takes off one hour earlier.</td></tr>
<tr><td>我们只好改成室内活动。</td><td>Wǒmen zhǐhǎo gǎi chéng shìnèi huódòng.</td><td>We have to switch to an indoor activity.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> confusing 「推迟」 (later) with 「提前」 (earlier). Note the direction word before writing the new time. <strong>Role-play:</strong> you call a friend to say the hiking trip is moved because of rain and propose an alternative. <strong>Extra practice:</strong></p><ol><li>「会议从三点提前到两点」: new time?<div class="dap-an"><strong>Answer:</strong> 2 o'clock.</div></li></ol>`,
`<h3>Đi xa hơn: dự báo thời tiết và khi kế hoạch thay đổi</h3>
<p>Âm thanh thời tiết dùng ngôn ngữ dự báo cô đọng: 「多云转晴」 (duōyún zhuǎn qíng, nhiều mây chuyển nắng), 「小雨」 (mưa nhỏ), 「大雨」 (mưa to), 「气温」 qìwēn (nhiệt độ), 「最高气温三十二度，最低气温二十四度」. Từ then chốt 「转」 zhuǎn nghĩa là “chuyển sang”. Trễ: 「受大雾影响，航班延误」 (shòu dà wù yǐngxiǎng, hángbān yánwù, chuyến bay trễ vì sương mù), 「取消」 (qǔxiāo, huỷ), 「改期」 (gǎiqī, dời ngày). Kế hoạch đổi với 「改成」, 「推迟到」, 「提前」.</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>明天白天多云，夜里有小雨。</td><td>Míngtiān báitiān duōyún, yèlǐ yǒu xiǎoyǔ.</td><td>Ban ngày nhiều mây, đêm có mưa nhỏ.</td></tr>
<tr><td>由于台风，比赛推迟到周日。</td><td>Yóuyú táifēng, bǐsài tuīchí dào zhōurì.</td><td>Do bão, trận đấu dời sang Chủ nhật.</td></tr>
<tr><td>航班提前了一个小时起飞。</td><td>Hángbān tíqián le yí ge xiǎoshí qǐfēi.</td><td>Chuyến bay cất cánh sớm một tiếng.</td></tr>
<tr><td>我们只好改成室内活动。</td><td>Wǒmen zhǐhǎo gǎi chéng shìnèi huódòng.</td><td>Chúng tôi đành đổi sang hoạt động trong nhà.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> nhầm 「推迟」 (muộn hơn) với 「提前」 (sớm hơn). Hãy ghi từ chỉ hướng trước khi ghi giờ mới. <strong>Nhập vai:</strong> bạn gọi cho bạn để báo chuyến leo núi dời vì mưa và đề xuất phương án khác. <strong>Luyện thêm:</strong></p><ol><li>「会议从三点提前到两点」: giờ mới?<div class="dap-an"><strong>Đáp án:</strong> 2 giờ.</div></li></ol>`],

  'cls201-ts-7-1': [`<h3>Going further: talking about a hobby in a paragraph</h3>
<p>To speak about a hobby for 30 seconds, use a four-step frame: <strong>what</strong> (我喜欢…), <strong>since when / how often</strong> (从…开始, 每…), <strong>why</strong> (因为…), <strong>result or plan</strong> (所以… / 以后想…). Model: 「我喜欢打羽毛球，从高中开始，每个星期打两次。因为打球可以锻炼身体，也可以认识新朋友。以后我想参加学校比赛。」 (Wǒ xǐhuan dǎ yǔmáoqiú, cóng gāozhōng kāishǐ, měi ge xīngqī dǎ liǎng cì. Yīnwèi dǎqiú kěyǐ duànliàn shēntǐ, yě kěyǐ rènshi xīn péngyou. Yǐhòu wǒ xiǎng cānjiā xuéxiào bǐsài.) Verb choice matters: 打 (hit/ball games: 打篮球), 踢 (kick: 踢足球), 游 (swim), 弹 (play string/keys: 弹吉他, 弹钢琴), 唱 (sing).</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>打乒乓球</td><td>dǎ pīngpāngqiú</td><td>play table tennis</td></tr>
<tr><td>踢足球</td><td>tī zúqiú</td><td>play football</td></tr>
<tr><td>弹吉他</td><td>tán jítā</td><td>play guitar</td></tr>
<tr><td>爬山</td><td>pá shān</td><td>go hiking</td></tr>
<tr><td>拍照</td><td>pāi zhào</td><td>take photos</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> using 「玩」 for everything (「玩足球」); use the specific verb. <strong>Extra practice:</strong></p><ol><li>Which verb goes with 钢琴?<div class="dap-an"><strong>Answer:</strong> 弹 (弹钢琴).</div></li></ol>`,
`<h3>Đi xa hơn: nói về sở thích thành một đoạn</h3>
<p>Để nói về sở thích 30 giây, dùng khung bốn bước: <strong>gì</strong> (我喜欢…), <strong>từ khi nào / bao lâu một lần</strong> (从…开始, 每…), <strong>vì sao</strong> (因为…), <strong>kết quả hoặc dự định</strong> (所以… / 以后想…). Mẫu: 「我喜欢打羽毛球，从高中开始，每个星期打两次。因为打球可以锻炼身体，也可以认识新朋友。以后我想参加学校比赛。」 (Wǒ xǐhuan dǎ yǔmáoqiú, cóng gāozhōng kāishǐ, měi ge xīngqī dǎ liǎng cì. Yīnwèi dǎqiú kěyǐ duànliàn shēntǐ, yě kěyǐ rènshi xīn péngyou. Yǐhòu wǒ xiǎng cānjiā xuéxiào bǐsài.) Chọn động từ rất quan trọng: 打 (đánh/bóng: 打篮球), 踢 (đá: 踢足球), 游 (bơi), 弹 (gảy/bấm: 弹吉他, 弹钢琴), 唱 (hát).</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>打乒乓球</td><td>dǎ pīngpāngqiú</td><td>chơi bóng bàn</td></tr>
<tr><td>踢足球</td><td>tī zúqiú</td><td>đá bóng</td></tr>
<tr><td>弹吉他</td><td>tán jítā</td><td>chơi guitar</td></tr>
<tr><td>爬山</td><td>pá shān</td><td>leo núi</td></tr>
<tr><td>拍照</td><td>pāi zhào</td><td>chụp ảnh</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> dùng 「玩」 cho mọi thứ (「玩足球」); hãy dùng động từ riêng. <strong>Luyện thêm:</strong></p><ol><li>Động từ nào đi với 钢琴?<div class="dap-an"><strong>Đáp án:</strong> 弹 (弹钢琴).</div></li></ol>`],

  'cls201-ts-7-2': [`<h3>Going further: choosing among the modal verbs by ear</h3>
<p>Six modals, six jobs. <strong>会 huì</strong> = learned skill or future likelihood: 「我会游泳」, 「明天会下雨」. <strong>能 néng</strong> = physical ability or circumstance permits: 「我今天能来」, 「这里能不能停车？」. <strong>可以 kěyǐ</strong> = permission: 「我可以进来吗？」. <strong>想 xiǎng</strong> = would like, wish: 「我想去中国」. <strong>要 yào</strong> = need or firm intention: 「我要买票」. <strong>打算 dǎsuàn</strong> = plan: 「我打算暑假去打工」. Negatives differ: 「不会」 (cannot, never learned), 「不能」 (cannot now), 「不可以 / 不行」 (not allowed), and 「别」 / 「不要」 (don't).</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>我感冒了，不能游泳。</td><td>Wǒ gǎnmào le, bù néng yóuyǒng.</td><td>I have a cold, so I can't swim today.</td></tr>
<tr><td>我不会游泳。</td><td>Wǒ bú huì yóuyǒng.</td><td>I don't know how to swim.</td></tr>
<tr><td>这里不可以拍照。</td><td>Zhèlǐ bù kěyǐ pāizhào.</td><td>Photos are not allowed here.</td></tr>
<tr><td>我打算明年去留学。</td><td>Wǒ dǎsuàn míngnián qù liúxué.</td><td>I plan to study abroad next year.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> using 「会」 for permission or 「能」 for learned skill when the meaning matters: 「我会说中文」 (I can speak Chinese) versus 「我今天不能说话」 (I can't speak today). <strong>Extra practice:</strong></p><ol><li>Which modal fits "May I sit here?"<div class="dap-an"><strong>Answer:</strong> 可以: 我可以坐这儿吗？</div></li></ol>`,
`<h3>Đi xa hơn: chọn động từ năng nguyện bằng tai</h3>
<p>Sáu động từ năng nguyện, sáu việc khác nhau. <strong>会 huì</strong> = kỹ năng đã học hoặc khả năng xảy ra: 「我会游泳」, 「明天会下雨」. <strong>能 néng</strong> = khả năng thể chất hoặc hoàn cảnh cho phép: 「我今天能来」, 「这里能不能停车？」. <strong>可以 kěyǐ</strong> = được phép: 「我可以进来吗？」. <strong>想 xiǎng</strong> = muốn: 「我想去中国」. <strong>要 yào</strong> = cần hoặc quyết tâm: 「我要买票」. <strong>打算 dǎsuàn</strong> = dự định: 「我打算暑假去打工」. Phủ định khác nhau: 「不会」 (không biết, chưa học), 「不能」 (lúc này không thể), 「不可以 / 不行」 (không được phép), và 「别」 / 「不要」 (đừng).</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>我感冒了，不能游泳。</td><td>Wǒ gǎnmào le, bù néng yóuyǒng.</td><td>Tôi bị cảm nên hôm nay không bơi được.</td></tr>
<tr><td>我不会游泳。</td><td>Wǒ bú huì yóuyǒng.</td><td>Tôi không biết bơi.</td></tr>
<tr><td>这里不可以拍照。</td><td>Zhèlǐ bù kěyǐ pāizhào.</td><td>Ở đây không được chụp ảnh.</td></tr>
<tr><td>我打算明年去留学。</td><td>Wǒ dǎsuàn míngnián qù liúxué.</td><td>Tôi dự định năm sau đi du học.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> dùng 「会」 cho sự cho phép hay 「能」 cho kỹ năng đã học khi nghĩa quan trọng: 「我会说中文」 (tôi biết nói tiếng Trung) khác 「我今天不能说话」 (hôm nay tôi không nói được). <strong>Luyện thêm:</strong></p><ol><li>Động từ nào hợp với “Tôi ngồi đây được không?”<div class="dap-an"><strong>Đáp án:</strong> 可以: 我可以坐这儿吗？</div></li></ol>`],

  'cls201-ts-7-3': [`<h3>Going further: a complete invitation exchange</h3>
<p>An invitation has five moves: opening, proposal, response, detail, closing. Proposal: 「周末有空吗？一起去看电影怎么样？」 (Zhōumò yǒu kòng ma? Yìqǐ qù kàn diànyǐng zěnmeyàng?). Warm acceptance: 「好啊，太好了！」 / 「没问题，我很想去。」 Soft decline with reason: 「真不巧，那天我已经有安排了。」 (Zhēn bù qiǎo, nà tiān wǒ yǐjīng yǒu ānpái le.) and counter-offer: 「下周可以吗？」 Details: time, place, meeting point: 「六点在校门口见。」 Closing: 「那就这么说定了！」 (Nà jiù zhème shuō dìng le!, It's settled).</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>A</td><td>这个星期六我过生日，你能来吗？</td><td>Zhège xīngqī liù wǒ guò shēngrì, nǐ néng lái ma?</td><td>It's my birthday on Saturday; can you come?</td></tr>
<tr><td>B</td><td>真不巧，我要回老家。</td><td>Zhēn bù qiǎo, wǒ yào huí lǎojiā.</td><td>Unlucky, I'm going home.</td></tr>
<tr><td>A</td><td>那太可惜了。</td><td>Nà tài kěxī le.</td><td>What a pity.</td></tr>
<tr><td>B</td><td>下次我请你吃饭，算是补过。</td><td>Xià cì wǒ qǐng nǐ chī fàn, suàn shì bǔguò.</td><td>Next time I'll treat you to make up.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> declining with a bare 「不行」, which sounds rude. Always give a reason and, if possible, a counter-offer. <strong>Role-play:</strong> invite your partner to a concert; they decline politely, then accept a new time. <strong>Extra practice:</strong></p><ol><li>Does 「我再看看」 accept the invitation?<div class="dap-an"><strong>Answer:</strong> Not yet; it is undecided, often a soft no.</div></li></ol>`,
`<h3>Đi xa hơn: một cuộc trao đổi mời trọn vẹn</h3>
<p>Một lời mời gồm năm bước: mở đầu, đề nghị, phản hồi, chi tiết, kết. Đề nghị: 「周末有空吗？一起去看电影怎么样？」 (Zhōumò yǒu kòng ma? Yìqǐ qù kàn diànyǐng zěnmeyàng?). Nhận lời ấm áp: 「好啊，太好了！」 / 「没问题，我很想去。」 Từ chối nhẹ có lý do: 「真不巧，那天我已经有安排了。」 (Zhēn bù qiǎo, nà tiān wǒ yǐjīng yǒu ānpái le.) và đề nghị khác: 「下周可以吗？」 Chi tiết: giờ, nơi, điểm hẹn: 「六点在校门口见。」 Kết: 「那就这么说定了！」 (Nà jiù zhème shuō dìng le!, Vậy chốt nhé).</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>A</td><td>这个星期六我过生日，你能来吗？</td><td>Zhège xīngqī liù wǒ guò shēngrì, nǐ néng lái ma?</td><td>Thứ Bảy này sinh nhật mình, bạn đến được không?</td></tr>
<tr><td>B</td><td>真不巧，我要回老家。</td><td>Zhēn bù qiǎo, wǒ yào huí lǎojiā.</td><td>Tiếc quá, mình phải về quê.</td></tr>
<tr><td>A</td><td>那太可惜了。</td><td>Nà tài kěxī le.</td><td>Vậy tiếc thật.</td></tr>
<tr><td>B</td><td>下次我请你吃饭，算是补过。</td><td>Xià cì wǒ qǐng nǐ chī fàn, suàn shì bǔguò.</td><td>Lần sau mình mời bạn ăn để bù.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> từ chối cộc lốc 「不行」 nghe thô. Luôn nêu lý do và nếu được thì đề nghị lựa chọn khác. <strong>Nhập vai:</strong> mời bạn cùng cặp đi xem hoà nhạc; bạn từ chối lịch sự, rồi nhận lời một thời điểm mới. <strong>Luyện thêm:</strong></p><ol><li>「我再看看」 có phải nhận lời không?<div class="dap-an"><strong>Đáp án:</strong> Chưa; còn lưng chừng, thường là từ chối nhẹ.</div></li></ol>`],

  'cls201-ts-8-1': [`<h3>Going further: a 60-second self-introduction and likely questions</h3>
<p>For an internship interview, build your introduction in four sentences: name and school, major, strengths with one example, reason for applying. Model: 「您好，我叫阮明，是越南FPT大学中文专业的三年级学生。我的汉语水平是HSK三级，也会一点儿英语。上学期我参加了学校的翻译社团，帮助中国同学办手续。我很喜欢贵公司的文化，希望能在这里实习，学到更多东西。」 (Nín hǎo, wǒ jiào Ruǎn Míng, shì Yuènán FPT dàxué Zhōngwén zhuānyè de sān niánjí de xuésheng. Wǒ de Hànyǔ shuǐpíng shì HSK sān jí, yě huì yìdiǎnr Yīngyǔ. Shàng xuéqī wǒ cānjiā le xuéxiào de fānyì shètuán, bāngzhù Zhōngguó tóngxué bàn shǒuxù. Wǒ hěn xǐhuan guì gōngsī de wénhuà, xīwàng néng zài zhèlǐ shíxí, xuédào gèng duō dōngxi.)</p>
<table><thead><tr><th>Question</th><th>Pinyin</th><th>Short answer idea</th></tr></thead><tbody>
<tr><td>你为什么选择我们公司？</td><td>Nǐ wèishénme xuǎnzé wǒmen gōngsī?</td><td>culture, learning</td></tr>
<tr><td>你的优点是什么？</td><td>Nǐ de yōudiǎn shì shénme?</td><td>strength + example</td></tr>
<tr><td>你能每周工作几天？</td><td>Nǐ néng měi zhōu gōngzuò jǐ tiān?</td><td>days, time</td></tr>
<tr><td>你有什么问题想问我们吗？</td><td>Nǐ yǒu shénme wèntí xiǎng wèn wǒmen ma?</td><td>one real question</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> using 「你」 to the interviewer instead of 「您」, or giving a one-word answer. Use 「您」 and 「贵公司」 (your company, formal). <strong>Extra practice:</strong></p><ol><li>Make a formal "I hope to learn from you".<div class="dap-an"><strong>Answer:</strong> 我希望能向您学习。</div></li></ol>`,
`<h3>Đi xa hơn: tự giới thiệu 60 giây và các câu hỏi thường gặp</h3>
<p>Với phỏng vấn thực tập, dựng phần giới thiệu trong bốn câu: tên và trường, ngành học, điểm mạnh kèm một ví dụ, lý do ứng tuyển. Mẫu: 「您好，我叫阮明，是越南FPT大学中文专业的三年级学生。我的汉语水平是HSK三级，也会一点儿英语。上学期我参加了学校的翻译社团，帮助中国同学办手续。我很喜欢贵公司的文化，希望能在这里实习，学到更多东西。」 (Nín hǎo, wǒ jiào Ruǎn Míng, shì Yuènán FPT dàxué Zhōngwén zhuānyè de sān niánjí de xuésheng. Wǒ de Hànyǔ shuǐpíng shì HSK sān jí, yě huì yìdiǎnr Yīngyǔ. Shàng xuéqī wǒ cānjiā le xuéxiào de fānyì shètuán, bāngzhù Zhōngguó tóngxué bàn shǒuxù. Wǒ hěn xǐhuan guì gōngsī de wénhuà, xīwàng néng zài zhèlǐ shíxí, xuédào gèng duō dōngxi.)</p>
<table><thead><tr><th>Câu hỏi</th><th>Pinyin</th><th>Ý đáp ngắn</th></tr></thead><tbody>
<tr><td>你为什么选择我们公司？</td><td>Nǐ wèishénme xuǎnzé wǒmen gōngsī?</td><td>văn hoá, học hỏi</td></tr>
<tr><td>你的优点是什么？</td><td>Nǐ de yōudiǎn shì shénme?</td><td>điểm mạnh + ví dụ</td></tr>
<tr><td>你能每周工作几天？</td><td>Nǐ néng měi zhōu gōngzuò jǐ tiān?</td><td>số ngày, giờ giấc</td></tr>
<tr><td>你有什么问题想问我们吗？</td><td>Nǐ yǒu shénme wèntí xiǎng wèn wǒmen ma?</td><td>một câu hỏi thật</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> dùng 「你」 với người phỏng vấn thay vì 「您」, hoặc trả lời một chữ. Hãy dùng 「您」 và 「贵公司」 (quý công ty, trang trọng). <strong>Luyện thêm:</strong></p><ol><li>Nói trang trọng “Tôi hy vọng được học hỏi từ ngài”.<div class="dap-an"><strong>Đáp án:</strong> 我希望能向您学习。</div></li></ol>`],

  'cls201-ts-8-2': [`<h3>Going further: voice-message habits and phone repair phrases</h3>
<p>WeChat voice messages are fast, informal and full of fillers (「嗯」, 「那个」, 「就是说」), and often leave out the subject. When you listen, play the message twice: first for the main request, second for numbers and times. When you record, keep to one idea per message, speak a little slower than normal, and state key numbers twice: 「我六点到，对，六点。」 On the phone, use repair phrases when the line is bad: 「喂，你能大声一点儿吗？」 (Wéi, nǐ néng dàshēng yìdiǎnr ma?), 「信号不好，我听不清楚」 (xìnhào bù hǎo, wǒ tīng bu qīngchu), 「请再说一遍」 (qǐng zài shuō yí biàn), 「我给你回电话」 (wǒ gěi nǐ huí diànhuà).</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Function</th></tr></thead><tbody>
<tr><td>喂，请问是王经理吗？</td><td>Wéi, qǐngwèn shì Wáng jīnglǐ ma?</td><td>opening a call</td></tr>
<tr><td>他现在不在，要我转告吗？</td><td>Tā xiànzài bú zài, yào wǒ zhuǎngào ma?</td><td>offering to pass a message</td></tr>
<tr><td>我的电话快没电了。</td><td>Wǒ de diànhuà kuài méi diàn le.</td><td>battery is dying</td></tr>
<tr><td>我先挂了，一会儿给你发微信。</td><td>Wǒ xiān guà le, yíhuìr gěi nǐ fā Wēixìn.</td><td>closing</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> saying 「再见」 and hanging up without confirming time or place. Repeat key facts back: 「那就明天九点，对吗？」 <strong>Extra practice:</strong></p><ol><li>How do you ask someone to repeat louder?<div class="dap-an"><strong>Answer:</strong> 请你大声一点儿，再说一遍。</div></li></ol>`,
`<h3>Đi xa hơn: thói quen tin nhắn thoại và câu sửa lỗi khi gọi điện</h3>
<p>Tin nhắn thoại WeChat nhanh, thân mật, đầy từ đệm (「嗯」, 「那个」, 「就是说」) và hay lược chủ ngữ. Khi nghe, phát tin hai lần: lần một lấy yêu cầu chính, lần hai lấy số và giờ. Khi ghi, mỗi tin một ý, nói chậm hơn bình thường một chút và nhắc lại số quan trọng hai lần: 「我六点到，对，六点。」 Khi gọi điện, dùng câu sửa lỗi lúc đường truyền kém: 「喂，你能大声一点儿吗？」 (Wéi, nǐ néng dàshēng yìdiǎnr ma?), 「信号不好，我听不清楚」 (xìnhào bù hǎo, wǒ tīng bu qīngchu), 「请再说一遍」 (qǐng zài shuō yí biàn), 「我给你回电话」 (wǒ gěi nǐ huí diànhuà).</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Chức năng</th></tr></thead><tbody>
<tr><td>喂，请问是王经理吗？</td><td>Wéi, qǐngwèn shì Wáng jīnglǐ ma?</td><td>mở đầu cuộc gọi</td></tr>
<tr><td>他现在不在，要我转告吗？</td><td>Tā xiànzài bú zài, yào wǒ zhuǎngào ma?</td><td>đề nghị nhắn lại</td></tr>
<tr><td>我的电话快没电了。</td><td>Wǒ de diànhuà kuài méi diàn le.</td><td>pin sắp hết</td></tr>
<tr><td>我先挂了，一会儿给你发微信。</td><td>Wǒ xiān guà le, yíhuìr gěi nǐ fā Wēixìn.</td><td>kết thúc</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> nói 「再见」 rồi cúp máy mà không xác nhận giờ hay nơi. Hãy nhắc lại dữ kiện chính: 「那就明天九点，对吗？」 <strong>Luyện thêm:</strong></p><ol><li>Nhờ người ta nói to hơn và lặp lại thế nào?<div class="dap-an"><strong>Đáp án:</strong> 请你大声一点儿，再说一遍。</div></li></ol>`],

  'cls201-ts-8-3': [`<h3>Going further: requests, status reports and meeting phrases</h3>
<p>The workplace register is polite but direct. Request with 「能不能…」 or 「请你…」 and a deadline: 「请你周五下班前把报告发给我。」 (Qǐng nǐ zhōuwǔ xiàbān qián bǎ bàogào fā gěi wǒ.) Accept with 「好的，没问题」 or negotiate: 「周五有点儿紧，周一可以吗？」 Report progress in the order <em>done / doing / blocked</em>: 「第一部分已经完成了，第二部分正在做，还缺一些数据。」 (Dì yī bùfen yǐjīng wánchéng le, dì èr bùfen zhèngzài zuò, hái quē yìxiē shùjù.) Meeting phrases: 「今天的议题有三个」 (three agenda items), 「我补充一点」 (I'd like to add something), 「会后发会议纪要」 (minutes after the meeting).</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>主管</td><td>这份资料明天要用，来得及吗？</td><td>Zhè fèn zīliào míngtiān yào yòng, láidejí ma?</td><td>Needed tomorrow; is there time?</td></tr>
<tr><td>实习生</td><td>今晚我整理好，早上发给您。</td><td>Jīn wǎn wǒ zhěnglǐ hǎo, zǎoshang fā gěi nín.</td><td>I'll finish tonight and send it in the morning.</td></tr>
<tr><td>主管</td><td>好，有问题随时告诉我。</td><td>Hǎo, yǒu wèntí suíshí gàosu wǒ.</td><td>OK, tell me anytime if there's a problem.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> saying 「我不知道」 to a supervisor; use 「我去确认一下」 (let me check). <strong>Extra practice:</strong></p><ol><li>Politely ask to move a deadline from Friday to Monday.<div class="dap-an"><strong>Answer:</strong> 周五有点儿紧，能不能推迟到周一？</div></li></ol>`,
`<h3>Đi xa hơn: yêu cầu, báo cáo tiến độ và cụm họp hành</h3>
<p>Văn phong nơi làm việc lịch sự nhưng thẳng. Yêu cầu bằng 「能不能…」 hoặc 「请你…」 kèm hạn chót: 「请你周五下班前把报告发给我。」 (Qǐng nǐ zhōuwǔ xiàbān qián bǎ bàogào fā gěi wǒ.) Nhận bằng 「好的，没问题」 hoặc thương lượng: 「周五有点儿紧，周一可以吗？」 Báo cáo tiến độ theo thứ tự <em>xong / đang làm / vướng</em>: 「第一部分已经完成了，第二部分正在做，还缺一些数据。」 (Dì yī bùfen yǐjīng wánchéng le, dì èr bùfen zhèngzài zuò, hái quē yìxiē shùjù.) Cụm họp: 「今天的议题有三个」 (ba nội dung), 「我补充一点」 (tôi xin bổ sung), 「会后发会议纪要」 (sau họp gửi biên bản).</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>主管</td><td>这份资料明天要用，来得及吗？</td><td>Zhè fèn zīliào míngtiān yào yòng, láidejí ma?</td><td>Tài liệu này mai cần, kịp không?</td></tr>
<tr><td>实习生</td><td>今晚我整理好，早上发给您。</td><td>Jīn wǎn wǒ zhěnglǐ hǎo, zǎoshang fā gěi nín.</td><td>Tối nay em sắp xếp xong, sáng gửi anh.</td></tr>
<tr><td>主管</td><td>好，有问题随时告诉我。</td><td>Hǎo, yǒu wèntí suíshí gàosu wǒ.</td><td>Được, có vấn đề cứ báo tôi bất cứ lúc nào.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> nói 「我不知道」 với cấp trên; hãy nói 「我去确认一下」 (để tôi kiểm tra). <strong>Luyện thêm:</strong></p><ol><li>Xin lịch sự dời hạn từ thứ Sáu sang thứ Hai.<div class="dap-an"><strong>Đáp án:</strong> 周五有点儿紧，能不能推迟到周一？</div></li></ol>`],
  'cls201-ts-9-1': [`<h3>Going further: festival customs you will hear described</h3>
<p>Festival audio usually names a date, a food, an activity and a meaning. <strong>Spring Festival</strong> (春节 Chūnjié, first day of the first lunar month): families reunite on New Year's Eve for 「年夜饭」 (niányèfàn), children receive 「红包」 (hóngbāo, red envelopes), people say 「新年快乐」 and 「恭喜发财」 (gōngxǐ fācái). <strong>Mid-Autumn</strong> (中秋节 Zhōngqiūjié, 15th of the eighth lunar month): people eat 「月饼」 (yuèbǐng) and look at the full moon, a symbol of reunion. <strong>Dragon Boat</strong> (端午节 Duānwǔjié, 5th of the fifth lunar month): 「粽子」 (zòngzi) and boat races, remembering the poet Qu Yuan. Dates are given by the lunar calendar: 「农历」 (nónglì) versus 「阳历」 (yánglì).</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>春节前大家都回老家过年。</td><td>Chūnjié qián dàjiā dōu huí lǎojiā guònián.</td><td>Before Spring Festival everyone goes home.</td></tr>
<tr><td>中秋节晚上全家一起赏月。</td><td>Zhōngqiūjié wǎnshang quánjiā yìqǐ shǎng yuè.</td><td>On Mid-Autumn night the family admires the moon.</td></tr>
<tr><td>端午节要吃粽子、赛龙舟。</td><td>Duānwǔjié yào chī zòngzi, sài lóngzhōu.</td><td>At Dragon Boat people eat zongzi and race boats.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> mixing up which food belongs to which festival, or forgetting that the dates are lunar. Link each festival to one food and one date in your notes. <strong>Extra practice:</strong></p><ol><li>Which festival is linked to 月饼?<div class="dap-an"><strong>Answer:</strong> Mid-Autumn Festival.</div></li></ol>`,
`<h3>Đi xa hơn: phong tục lễ hội bạn sẽ nghe mô tả</h3>
<p>Âm thanh về lễ hội thường nêu ngày, món ăn, hoạt động và ý nghĩa. <strong>Tết Nguyên đán</strong> (春节 Chūnjié, mùng một tháng Giêng âm lịch): cả nhà sum họp đêm giao thừa ăn 「年夜饭」 (niányèfàn), trẻ em nhận 「红包」 (hóngbāo, bao lì xì), người ta chúc 「新年快乐」 và 「恭喜发财」 (gōngxǐ fācái). <strong>Trung Thu</strong> (中秋节 Zhōngqiūjié, 15 tháng Tám âm lịch): ăn 「月饼」 (yuèbǐng) và ngắm trăng tròn, biểu tượng đoàn viên. <strong>Đoan Ngọ</strong> (端午节 Duānwǔjié, mùng 5 tháng Năm âm lịch): 「粽子」 (zòngzi) và đua thuyền rồng, tưởng nhớ thi nhân Khuất Nguyên. Ngày tháng tính theo âm lịch: 「农历」 (nónglì) so với 「阳历」 (yánglì).</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>春节前大家都回老家过年。</td><td>Chūnjié qián dàjiā dōu huí lǎojiā guònián.</td><td>Trước Tết mọi người đều về quê ăn Tết.</td></tr>
<tr><td>中秋节晚上全家一起赏月。</td><td>Zhōngqiūjié wǎnshang quánjiā yìqǐ shǎng yuè.</td><td>Đêm Trung Thu cả nhà cùng ngắm trăng.</td></tr>
<tr><td>端午节要吃粽子、赛龙舟。</td><td>Duānwǔjié yào chī zòngzi, sài lóngzhōu.</td><td>Tết Đoan Ngọ ăn bánh ú, đua thuyền rồng.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> nhầm món ăn với lễ hội hoặc quên rằng ngày là âm lịch. Hãy gắn mỗi lễ hội với một món và một ngày trong ghi chú. <strong>Luyện thêm:</strong></p><ol><li>Lễ hội nào gắn với 月饼?<div class="dap-an"><strong>Đáp án:</strong> Tết Trung Thu.</div></li></ol>`],

  'cls201-ts-9-2': [`<h3>Going further: a full host-and-guest script</h3>
<p>Hospitality has set phrases at every stage. Arrival: host 「欢迎欢迎，快请进！」 (Huānyíng huānyíng, kuài qǐng jìn!); guest 「打扰了」 (dǎrǎo le, sorry to disturb). Gift: guest 「一点儿小礼物，不成敬意」 (yìdiǎnr xiǎo lǐwù, bù chéng jìngyì, a small token); host first refuses 「太客气了，你人来就好」 (tài kèqi le, nǐ rén lái jiù hǎo), then accepts. At the table the host keeps filling your plate: 「多吃点儿，别客气」. Polite refusal: 「我吃饱了，谢谢」, said once or twice before finishing. Toast: 「干杯！」 (gānbēi) or the lighter 「随意」 (suíyì, as you wish). Leaving: 「今天太麻烦你了」 (jīntiān tài máfan nǐ le) and 「慢走」 (màn zǒu, take care) from the host.</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>主人</td><td>来，尝尝这个鱼，我自己做的。</td><td>Lái, chángchang zhège yú, wǒ zìjǐ zuò de.</td><td>Try this fish, I made it myself.</td></tr>
<tr><td>客人</td><td>真好吃！您的手艺太棒了。</td><td>Zhēn hǎochī! Nín de shǒuyì tài bàng le.</td><td>Delicious! Your cooking is great.</td></tr>
<tr><td>主人</td><td>哪里哪里，再来一点儿吧。</td><td>Nǎlǐ nǎlǐ, zài lái yìdiǎnr ba.</td><td>Not at all; have some more.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> saying 「谢谢」 to a compliment and nothing else; the modest reply 「哪里哪里」 is expected. <strong>Extra practice:</strong></p><ol><li>What does a host mean by 「随意」 when toasting?<div class="dap-an"><strong>Answer:</strong> Drink as much as you like; no pressure.</div></li></ol>`,
`<h3>Đi xa hơn: một kịch bản đầy đủ cho chủ nhà và khách</h3>
<p>Việc tiếp khách có cụm cố định ở mọi giai đoạn. Đến nơi: chủ 「欢迎欢迎，快请进！」 (Huānyíng huānyíng, kuài qǐng jìn!); khách 「打扰了」 (dǎrǎo le, xin lỗi làm phiền). Quà: khách 「一点儿小礼物，不成敬意」 (yìdiǎnr xiǎo lǐwù, bù chéng jìngyì, chút quà mọn); chủ trước hết từ chối 「太客气了，你人来就好」 (tài kèqi le, nǐ rén lái jiù hǎo), rồi mới nhận. Trên bàn ăn, chủ liên tục gắp thêm cho bạn: 「多吃点儿，别客气」. Từ chối lịch sự: 「我吃饱了，谢谢」, nói một hai lần trước khi ăn xong. Nâng ly: 「干杯！」 (gānbēi) hoặc nhẹ hơn 「随意」 (suíyì, tuỳ ý). Ra về: 「今天太麻烦你了」 (jīntiān tài máfan nǐ le) và chủ đáp 「慢走」 (màn zǒu, đi cẩn thận).</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>主人</td><td>来，尝尝这个鱼，我自己做的。</td><td>Lái, chángchang zhège yú, wǒ zìjǐ zuò de.</td><td>Nào, nếm thử món cá này, tôi tự nấu.</td></tr>
<tr><td>客人</td><td>真好吃！您的手艺太棒了。</td><td>Zhēn hǎochī! Nín de shǒuyì tài bàng le.</td><td>Ngon quá! Tay nghề của bác tuyệt thật.</td></tr>
<tr><td>主人</td><td>哪里哪里，再来一点儿吧。</td><td>Nǎlǐ nǎlǐ, zài lái yìdiǎnr ba.</td><td>Đâu có, dùng thêm chút nữa nhé.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> chỉ nói 「谢谢」 khi được khen mà không thêm gì; câu khiêm tốn 「哪里哪里」 mới là điều được mong đợi. <strong>Luyện thêm:</strong></p><ol><li>Chủ nói 「随意」 khi nâng ly có nghĩa gì?<div class="dap-an"><strong>Đáp án:</strong> Uống bao nhiêu tuỳ ý, không ép.</div></li></ol>`],

  'cls201-ts-9-3': [`<h3>Going further: a comparison frame for a short talk</h3>
<p>When you compare Vietnam and China, avoid stereotypes and anchor each point in a concrete fact. Use the frame: topic → similarity → difference → your opinion. Model: 「越南和中国都有春节，都要吃团圆饭，这是相同点。不同的是，越南人过年要吃粽子（bánh chưng），而很多中国北方人吃饺子。我觉得这些习俗都表达了对家人的爱。」 (Yuènán hé Zhōngguó dōu yǒu Chūnjié, dōu yào chī tuányuánfàn, zhè shì xiāngtóng diǎn. Bù tóng de shì, Yuènán rén guònián yào chī zòngzi, ér hěn duō Zhōngguó běifāng rén chī jiǎozi. Wǒ juéde zhèxiē xísú dōu biǎodá le duì jiārén de ài.) Useful words: 相同点 xiāngtóng diǎn (similarity), 不同点 bù tóng diǎn (difference), 而 ér (while, contrast), 相比 xiāngbǐ (in comparison), 习惯 xíguàn (habit), 习俗 xísú (custom).</p>
<table><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>两国都很重视家庭。</td><td>Liǎng guó dōu hěn zhòngshì jiātíng.</td><td>Both countries value family.</td></tr>
<tr><td>和中国相比，越南的夏天更热。</td><td>Hé Zhōngguó xiāngbǐ, Yuènán de xiàtiān gèng rè.</td><td>Compared with China, Vietnam's summers are hotter.</td></tr>
<tr><td>越南人爱喝咖啡，中国人爱喝茶。</td><td>Yuènán rén ài hē kāfēi, Zhōngguó rén ài hē chá.</td><td>Vietnamese love coffee, Chinese love tea.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> overgeneralising with 「所有中国人都…」. Prefer 「很多…」, 「一般…」, 「有的…」, which are more accurate and politer. <strong>Extra practice:</strong></p><ol><li>Soften "All Chinese like tea".<div class="dap-an"><strong>Answer:</strong> 很多中国人喜欢喝茶。</div></li></ol>`,
`<h3>Đi xa hơn: khung so sánh cho bài nói ngắn</h3>
<p>Khi so sánh Việt Nam và Trung Quốc, tránh định kiến và neo mỗi ý vào một sự thật cụ thể. Dùng khung: chủ đề → điểm giống → điểm khác → ý kiến của bạn. Mẫu: 「越南和中国都有春节，都要吃团圆饭，这是相同点。不同的是，越南人过年要吃粽子（bánh chưng），而很多中国北方人吃饺子。我觉得这些习俗都表达了对家人的爱。」 (Yuènán hé Zhōngguó dōu yǒu Chūnjié, dōu yào chī tuányuánfàn, zhè shì xiāngtóng diǎn. Bù tóng de shì, Yuènán rén guònián yào chī zòngzi, ér hěn duō Zhōngguó běifāng rén chī jiǎozi. Wǒ juéde zhèxiē xísú dōu biǎodá le duì jiārén de ài.) Từ hữu ích: 相同点 xiāngtóng diǎn (điểm giống), 不同点 bù tóng diǎn (điểm khác), 而 ér (còn, đối lập), 相比 xiāngbǐ (so với), 习惯 xíguàn (thói quen), 习俗 xísú (phong tục).</p>
<table><thead><tr><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>两国都很重视家庭。</td><td>Liǎng guó dōu hěn zhòngshì jiātíng.</td><td>Hai nước đều coi trọng gia đình.</td></tr>
<tr><td>和中国相比，越南的夏天更热。</td><td>Hé Zhōngguó xiāngbǐ, Yuènán de xiàtiān gèng rè.</td><td>So với Trung Quốc, mùa hè Việt Nam nóng hơn.</td></tr>
<tr><td>越南人爱喝咖啡，中国人爱喝茶。</td><td>Yuènán rén ài hē kāfēi, Zhōngguó rén ài hē chá.</td><td>Người Việt thích cà phê, người Trung thích trà.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> khái quát hoá quá mức với 「所有中国人都…」. Nên dùng 「很多…」, 「一般…」, 「有的…」 vừa chính xác hơn vừa lịch sự hơn. <strong>Luyện thêm:</strong></p><ol><li>Làm mềm câu “Tất cả người Trung đều thích trà”.<div class="dap-an"><strong>Đáp án:</strong> 很多中国人喜欢喝茶。</div></li></ol>`],

  'cls201-ts-10-1': [`<h3>Going further: a timed structure and delivery checklist</h3>
<p>A three-minute talk is about 350–450 Chinese characters at a comfortable pace. Plan it in five blocks with times: opening (20 s), point 1 (50 s), point 2 (50 s), point 3 (40 s), conclusion (20 s). Opening formula: 「大家好，今天我想介绍一下…」 (Dàjiā hǎo, jīntiān wǒ xiǎng jièshào yíxià…). Transitions: 「首先」, 「其次」 (qícì, second), 「另外」 (lìngwài, besides), 「最后」. Conclusion: 「总之…」 (zǒngzhī…, in short), 「谢谢大家，欢迎提问」 (xièxie dàjiā, huānyíng tíwèn). Delivery: look at the audience, speak slightly slower than in conversation, pause at chunk boundaries (Chapter 1), and stress the key word of each point.</p>
<table><thead><tr><th>Block</th><th>Sentence frame</th><th>Pinyin</th></tr></thead><tbody>
<tr><td>opening</td><td>今天我想谈谈…</td><td>Jīntiān wǒ xiǎng tántan…</td></tr>
<tr><td>point 1</td><td>首先，…</td><td>Shǒuxiān, …</td></tr>
<tr><td>point 2</td><td>其次，…</td><td>Qícì, …</td></tr>
<tr><td>point 3</td><td>另外，…</td><td>Lìngwài, …</td></tr>
<tr><td>close</td><td>总之，…谢谢大家。</td><td>Zǒngzhī, … xièxie dàjiā.</td></tr></tbody></table>
<p><strong>Typical mistakes:</strong> reading a script word for word, speeding up when nervous, and ending with 「就这样」. Practise once with a timer and once recorded; note your longest pause and your filler words (「嗯」, 「那个」) and reduce them. <strong>Extra practice:</strong></p><ol><li>Which word introduces the second point?<div class="dap-an"><strong>Answer:</strong> 其次.</div></li></ol>`,
`<h3>Đi xa hơn: cấu trúc theo thời gian và bảng kiểm trình bày</h3>
<p>Bài nói ba phút khoảng 350–450 chữ Hán ở tốc độ thoải mái. Hãy lập kế hoạch năm khối kèm thời gian: mở đầu (20 giây), ý 1 (50 giây), ý 2 (50 giây), ý 3 (40 giây), kết (20 giây). Công thức mở đầu: 「大家好，今天我想介绍一下…」 (Dàjiā hǎo, jīntiān wǒ xiǎng jièshào yíxià…). Chuyển ý: 「首先」, 「其次」 (qícì, thứ hai), 「另外」 (lìngwài, ngoài ra), 「最后」. Kết: 「总之…」 (zǒngzhī…, tóm lại), 「谢谢大家，欢迎提问」 (xièxie dàjiā, huānyíng tíwèn). Trình bày: nhìn khán giả, nói chậm hơn hội thoại một chút, ngắt ở ranh giới cụm (Chương 1) và nhấn từ khoá của mỗi ý.</p>
<table><thead><tr><th>Khối</th><th>Khung câu</th><th>Pinyin</th></tr></thead><tbody>
<tr><td>mở đầu</td><td>今天我想谈谈…</td><td>Jīntiān wǒ xiǎng tántan…</td></tr>
<tr><td>ý 1</td><td>首先，…</td><td>Shǒuxiān, …</td></tr>
<tr><td>ý 2</td><td>其次，…</td><td>Qícì, …</td></tr>
<tr><td>ý 3</td><td>另外，…</td><td>Lìngwài, …</td></tr>
<tr><td>kết</td><td>总之，…谢谢大家。</td><td>Zǒngzhī, … xièxie dàjiā.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> đọc thuộc từng chữ, nói nhanh khi hồi hộp và kết bằng 「就这样」. Hãy tập một lần có bấm giờ và một lần ghi âm; ghi lại chỗ ngắt dài nhất và các từ đệm (「嗯」, 「那个」) rồi giảm bớt. <strong>Luyện thêm:</strong></p><ol><li>Từ nào mở ý thứ hai?<div class="dap-an"><strong>Đáp án:</strong> 其次.</div></li></ol>`],

  'cls201-ts-10-2': [`<h3>Going further: managing a discussion turn by turn</h3>
<p>In a group discussion, the skill is not talking most but managing turns. Take the floor: 「我先说一下我的看法」 (wǒ xiān shuō yíxià wǒ de kànfǎ). Interrupt politely: 「不好意思，我插一句」 (bù hǎoyìsi, wǒ chā yí jù). Ask for clarification: 「你的意思是…吗？」 (nǐ de yìsi shì… ma?). Build on a partner's point: 「我同意你的看法，另外…」. Pass the turn: 「你呢？你怎么看？」 (nǐ ne? nǐ zěnme kàn?). Summarise: 「我们大家的意见是…」. Integrated role-plays combine skills: for example at a hotel (Chapter 6) you have a problem, call the front desk (Chapter 8) and then explain your plan change to a friend (Chapter 6.3).</p>
<table><thead><tr><th>Who</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>
<tr><td>A</td><td>我觉得暑假应该去实习。</td><td>Wǒ juéde shǔjià yīnggāi qù shíxí.</td><td>I think we should intern in summer.</td></tr>
<tr><td>B</td><td>你的意思是不旅游了吗？</td><td>Nǐ de yìsi shì bù lǚyóu le ma?</td><td>You mean no travelling?</td></tr>
<tr><td>A</td><td>不是，可以先实习再旅游。</td><td>Bú shì, kěyǐ xiān shíxí zài lǚyóu.</td><td>No, intern first then travel.</td></tr>
<tr><td>C</td><td>这个办法不错，我同意。</td><td>Zhège bànfǎ búcuò, wǒ tóngyì.</td><td>Good idea; I agree.</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> waiting silently for a perfect sentence. Use fillers deliberately (「这个问题嘛…」) to buy time, and ask a question to pass the turn. <strong>Extra practice:</strong></p><ol><li>How do you ask a partner to clarify?<div class="dap-an"><strong>Answer:</strong> 你的意思是…吗？</div></li></ol>`,
`<h3>Đi xa hơn: điều phối thảo luận theo từng lượt lời</h3>
<p>Trong thảo luận nhóm, kỹ năng không phải nói nhiều nhất mà là điều phối lượt lời. Xin lời: 「我先说一下我的看法」 (wǒ xiān shuō yíxià wǒ de kànfǎ). Ngắt lời lịch sự: 「不好意思，我插一句」 (bù hǎoyìsi, wǒ chā yí jù). Hỏi làm rõ: 「你的意思是…吗？」 (nǐ de yìsi shì… ma?). Nối ý bạn: 「我同意你的看法，另外…」. Nhường lời: 「你呢？你怎么看？」 (nǐ ne? nǐ zěnme kàn?). Tóm tắt: 「我们大家的意见是…」. Nhập vai tích hợp kết hợp nhiều kỹ năng: ví dụ ở khách sạn (Chương 6) bạn gặp sự cố, gọi lễ tân (Chương 8) rồi giải thích thay đổi kế hoạch cho bạn bè (Bài 6.3).</p>
<table><thead><tr><th>Ai</th><th>Hán tự</th><th>Pinyin</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>A</td><td>我觉得暑假应该去实习。</td><td>Wǒ juéde shǔjià yīnggāi qù shíxí.</td><td>Mình nghĩ hè nên đi thực tập.</td></tr>
<tr><td>B</td><td>你的意思是不旅游了吗？</td><td>Nǐ de yìsi shì bù lǚyóu le ma?</td><td>Ý bạn là không đi du lịch à?</td></tr>
<tr><td>A</td><td>不是，可以先实习再旅游。</td><td>Bú shì, kěyǐ xiān shíxí zài lǚyóu.</td><td>Không, thực tập trước rồi đi du lịch.</td></tr>
<tr><td>C</td><td>这个办法不错，我同意。</td><td>Zhège bànfǎ búcuò, wǒ tóngyì.</td><td>Cách này hay, mình đồng ý.</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> im lặng chờ một câu hoàn hảo. Hãy dùng từ đệm có chủ đích (「这个问题嘛…」) để câu giờ, và đặt câu hỏi để nhường lượt. <strong>Luyện thêm:</strong></p><ol><li>Hỏi bạn làm rõ ý như thế nào?<div class="dap-an"><strong>Đáp án:</strong> 你的意思是…吗？</div></li></ol>`],

  'cls201-ts-10-3': [`<h3>Going further: a four-step routine for each question type</h3>
<p>Whatever the format details (always confirm them on the official HSK site), a routine helps. <strong>Before the audio:</strong> read options and underline contrasts. <strong>During the first play:</strong> note only the slot the options differ on (number, place, person, action). <strong>Between plays or after:</strong> eliminate options that were contradicted; if two remain, choose the one that matches the <em>final</em> statement, since speakers often correct themselves (「不对，是…」). <strong>Never leave a blank:</strong> guess using context, because an unanswered item scores zero. For picture-matching tasks, decide the topic from the first verb you hear; for true/false tasks, remember the statement is a paraphrase, not a copy.</p>
<table><thead><tr><th>Part</th><th>Skill tested</th><th>Best tactic</th></tr></thead><tbody>
<tr><td>Short dialogue + picture</td><td>match scene</td><td>catch the first verb and place</td></tr>
<tr><td>True / false</td><td>paraphrase</td><td>compare meaning, not words</td></tr>
<tr><td>Short dialogue + question</td><td>detail</td><td>note numbers and negation</td></tr>
<tr><td>Longer dialogue</td><td>gist and attitude</td><td>listen after 但是 / 不过</td></tr></tbody></table>
<p><strong>Typical mistake:</strong> stopping to think about one hard item and missing the next three. Mark it, move on, return if time allows. Practise with a real past paper under timed conditions at least twice before the exam. <strong>Extra practice:</strong></p><ol><li>The speaker says 「不对，是三号」. Which date counts?<div class="dap-an"><strong>Answer:</strong> The 3rd (the correction).</div></li></ol>`,
`<h3>Đi xa hơn: quy trình bốn bước cho mỗi dạng câu hỏi</h3>
<p>Dù chi tiết định dạng thế nào (luôn xác nhận trên trang HSK chính thức), một quy trình sẽ giúp ích. <strong>Trước khi phát âm thanh:</strong> đọc các phương án và gạch chân chỗ đối lập. <strong>Lần phát đầu:</strong> chỉ ghi ô mà các phương án khác nhau (số, nơi, người, hành động). <strong>Giữa hoặc sau lần phát:</strong> loại phương án bị mâu thuẫn; còn hai thì chọn cái khớp với phát biểu <em>cuối cùng</em>, vì người nói hay tự sửa (「不对，是…」). <strong>Không bao giờ bỏ trống:</strong> hãy đoán theo ngữ cảnh, vì câu không trả lời được 0 điểm. Với dạng ghép tranh, xác định chủ đề từ động từ đầu tiên nghe được; với dạng đúng/sai, nhớ rằng phát biểu là diễn đạt lại chứ không chép nguyên.</p>
<table><thead><tr><th>Phần</th><th>Kỹ năng</th><th>Chiến thuật tốt nhất</th></tr></thead><tbody>
<tr><td>Hội thoại ngắn + tranh</td><td>ghép cảnh</td><td>bắt động từ và nơi chốn đầu tiên</td></tr>
<tr><td>Đúng / sai</td><td>diễn đạt lại</td><td>so nghĩa, không so chữ</td></tr>
<tr><td>Hội thoại ngắn + câu hỏi</td><td>chi tiết</td><td>ghi số và phủ định</td></tr>
<tr><td>Hội thoại dài</td><td>ý chính và thái độ</td><td>nghe sau 但是 / 不过</td></tr></tbody></table>
<p><strong>Lỗi điển hình:</strong> dừng lại nghĩ một câu khó rồi lỡ ba câu sau. Hãy đánh dấu, đi tiếp, quay lại nếu còn thời gian. Luyện đề thật các năm trước có bấm giờ ít nhất hai lần trước kỳ thi. <strong>Luyện thêm:</strong></p><ol><li>Người nói nói 「不对，是三号」. Ngày nào được tính?<div class="dap-an"><strong>Đáp án:</strong> Ngày 3 (lời sửa).</div></li></ol>`],

  'cls201-ts-10-4': [`<h3>Going further: running the mock and keeping an error log</h3>
<p>Treat the final mock as a rehearsal of the real day. Do it in one sitting, with audio played once only, no pausing and no pinyin. Score the listening part and, separately, record a two-minute speaking sample (self-introduction plus a three-sentence opinion). Then analyse errors in a table, because the pattern matters more than the total: <strong>type</strong> (number, negation, signpost, attitude, speed), <strong>cause</strong> (did not know the word / knew it but missed it at speed / misread the question), and <strong>fix</strong> (vocabulary card, shadowing, strategy rule). Review the log with a partner and set one target for each category.</p>
<table><thead><tr><th>Error type</th><th>Typical cause</th><th>Fix</th></tr></thead><tbody>
<tr><td>number / time</td><td>units mixed (两 vs 二, 点 vs 小时)</td><td>number dictation daily</td></tr>
<tr><td>negation</td><td>missed 不是…是…</td><td>practise contrast pairs</td></tr>
<tr><td>speed</td><td>reductions not recognised</td><td>shadowing (1.4)</td></tr>
<tr><td>attitude</td><td>took polite refusal literally</td><td>indirect answers (2.3)</td></tr></tbody></table>
<p><strong>Speaking self-assessment.</strong> Rate yourself 1–5 on pronunciation, fluency, vocabulary range, grammar accuracy and organisation; ask a partner to rate you too. Compare. <strong>Typical mistake:</strong> only counting the score and not reading the errors. A 70% with a clear error log is more useful than an 85% you cannot explain. <strong>Extra practice:</strong></p><ol><li>If your errors are mostly numbers, what is the best daily drill?<div class="dap-an"><strong>Answer:</strong> Number dictation: prices, dates, times, phone numbers.</div></li></ol>`,
`<h3>Đi xa hơn: làm bài thi thử và giữ nhật ký lỗi</h3>
<p>Hãy coi bài thi thử cuối khoá là buổi diễn tập cho ngày thật. Làm một lèo, âm thanh chỉ phát một lần, không tạm dừng và không có pinyin. Chấm phần nghe, và riêng ra, ghi âm mẫu nói hai phút (tự giới thiệu cộng ba câu nêu ý kiến). Sau đó phân tích lỗi trong bảng, vì quy luật quan trọng hơn tổng điểm: <strong>loại lỗi</strong> (số, phủ định, từ báo hiệu, thái độ, tốc độ), <strong>nguyên nhân</strong> (không biết từ / biết nhưng lỡ ở tốc độ nhanh / hiểu sai câu hỏi), và <strong>cách sửa</strong> (thẻ từ vựng, shadowing, quy tắc chiến lược). Xem lại nhật ký cùng bạn và đặt một mục tiêu cho từng nhóm.</p>
<table><thead><tr><th>Loại lỗi</th><th>Nguyên nhân thường gặp</th><th>Cách sửa</th></tr></thead><tbody>
<tr><td>số / thời gian</td><td>lẫn đơn vị (两 và 二, 点 và 小时)</td><td>chép chính tả số mỗi ngày</td></tr>
<tr><td>phủ định</td><td>bỏ lỡ 不是…是…</td><td>luyện cặp đối lập</td></tr>
<tr><td>tốc độ</td><td>không nhận ra rút gọn</td><td>shadowing (1.4)</td></tr>
<tr><td>thái độ</td><td>hiểu nghĩa đen lời từ chối lịch sự</td><td>câu đáp gián tiếp (2.3)</td></tr></tbody></table>
<p><strong>Tự đánh giá phần nói.</strong> Tự chấm 1–5 cho phát âm, độ trôi chảy, vốn từ, độ chính xác ngữ pháp và tổ chức; nhờ bạn chấm giúp rồi so sánh. <strong>Lỗi điển hình:</strong> chỉ đếm điểm mà không đọc lỗi. Được 70% với nhật ký lỗi rõ ràng hữu ích hơn 85% mà bạn không giải thích được. <strong>Luyện thêm:</strong></p><ol><li>Nếu lỗi chủ yếu là số, bài luyện hằng ngày tốt nhất là gì?<div class="dap-an"><strong>Đáp án:</strong> Chép chính tả số: giá tiền, ngày, giờ, số điện thoại.</div></li></ol>`],
};
for (const sec of secs) for (const l of sec.lessons) {
  const m = MORE[l.slug];
  if (!m || l.type !== 'DOCUMENT') continue;
  const [en, vi] = m.map(zh);
  l.content = l.content.replace('<h3>📌 Summary</h3>', en + '\n<h3>📌 Summary</h3>').replace('<h3>📌 Tóm tắt</h3>', vi + '\n<h3>📌 Tóm tắt</h3>');
}

export default secs;
