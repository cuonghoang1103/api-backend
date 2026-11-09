// Khoá TỰ SOẠN cho CIC102 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Giáo trình chuẩn: HSK Standard Course 3 (BLCU) + Boya Chinese / Developing Chinese. Không dùng template-literal nội suy.
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const x = (s) => (Array.isArray(s) ? s[0] + '|||' + s[1] : (String(s).includes('|||') ? s : s + '|||' + s));
const GW = 'https://resources.allsetlearning.com/chinese/grammar/';
const W = 'https://en.wikipedia.org/wiki/';
const LK = {
  gram: [W + 'Chinese_grammar', 'Wikipedia — Chinese grammar', 'Wikipedia — Ngữ pháp tiếng Trung'],
  wikib: ['https://en.wikibooks.org/wiki/Mandarin_Chinese', 'Wikibooks — Mandarin Chinese', 'Wikibooks — Tiếng Quan Thoại'],
  mdbg: ['https://www.mdbg.net/chinese/dictionary', 'MDBG — free Chinese–English dictionary', 'MDBG — từ điển Trung–Anh miễn phí'],
  hanziw: ['https://hanziwriter.org/', 'Hanzi Writer — stroke order animation', 'Hanzi Writer — hoạt hình thứ tự nét'],
  coursera: ['https://www.coursera.org/learn/learn-chinese', 'Coursera — Learn Mandarin Chinese (Peking University)', 'Coursera — Học tiếng Quan Thoại (Đại học Bắc Kinh)'],
  hsk: [W + 'Hanyu_Shuiping_Kaoshi', 'Wikipedia — HSK test', 'Wikipedia — Kỳ thi HSK'],
  hsk3: ['https://www.hsk.academy/en/hsk-3-vocabulary-list', 'HSK Academy — HSK 3 vocabulary list', 'HSK Academy — danh sách từ vựng HSK 3'],
  pleco: ['https://www.pleco.com/', 'Pleco — Chinese dictionary app', 'Pleco — ứng dụng từ điển tiếng Trung'],
  duchinese: ['https://www.duchinese.net/', 'Du Chinese — graded reading', 'Du Chinese — đọc hiểu theo cấp độ'],
  yoyo: ['https://yoyochinese.com/', 'Yoyo Chinese — video lessons', 'Yoyo Chinese — bài giảng video'],
  le: [GW + 'ASGAGDCQ', 'Chinese Grammar Wiki — completion with 了', 'Chinese Grammar Wiki — 了 chỉ hoàn thành'],
  lechange: [GW + 'ASGT185D', 'Chinese Grammar Wiki — change of state with 了', 'Chinese Grammar Wiki — 了 chỉ thay đổi trạng thái'],
  guo: [GW + 'ASGQGV3P', 'Chinese Grammar Wiki — experiences with 过', 'Chinese Grammar Wiki — 过 chỉ trải nghiệm'],
  zhe: [GW + 'ASGOIDEO', 'Chinese Grammar Wiki — aspect particle 着', 'Chinese Grammar Wiki — trợ từ thể 着'],
  resc: [GW + 'ASGNNMST', 'Chinese Grammar Wiki — result complements', 'Chinese Grammar Wiki — bổ ngữ kết quả'],
  resdj: [GW + 'ASGWNGEP', 'Chinese Grammar Wiki — result complements 到 and 见', 'Chinese Grammar Wiki — bổ ngữ kết quả 到 và 见'],
  dur: [GW + 'ASGJ36VN', 'Chinese Grammar Wiki — duration with 了', 'Chinese Grammar Wiki — thời lượng với 了'],
  bi: [GW + 'ASG8SI2K', 'Chinese Grammar Wiki — basic comparisons with 比', 'Chinese Grammar Wiki — so sánh cơ bản với 比'],
  meiyou: [GW + 'ASGEAH5M', 'Chinese Grammar Wiki — comparisons with 没有', 'Chinese Grammar Wiki — so sánh với 没有'],
  yiyang: [GW + 'ASGC06N0', 'Chinese Grammar Wiki — comparisons with 一样', 'Chinese Grammar Wiki — so sánh với 一样'],
  yue: [GW + 'ASG7UE4H', 'Chinese Grammar Wiki — 越来越 (more and more)', 'Chinese Grammar Wiki — 越来越 (càng ngày càng)'],
  dircomp: [GW + 'ASG8LWBJ', 'Chinese Grammar Wiki — direction complements', 'Chinese Grammar Wiki — bổ ngữ xu hướng'],
  qilai: [GW + 'ASGBPXOB', 'Chinese Grammar Wiki — direction complement 起来', 'Chinese Grammar Wiki — bổ ngữ xu hướng 起来'],
  pot: [GW + 'ASGCPJPQ', 'Chinese Grammar Wiki — potential complement', 'Chinese Grammar Wiki — bổ ngữ khả năng'],
  deg: [GW + 'ASG79STE', 'Chinese Grammar Wiki — degree complement 得', 'Chinese Grammar Wiki — bổ ngữ trạng thái/mức độ 得'],
  ba: [GW + 'ASG2UB2B', 'Chinese Grammar Wiki — 把 sentences', 'Chinese Grammar Wiki — câu chữ 把'],
  bei: [GW + 'ASGHF9F1', 'Chinese Grammar Wiki — 被 sentences', 'Chinese Grammar Wiki — câu chữ 被'],
  exist: [GW + 'ASGAC619', 'Chinese Grammar Wiki — existential sentences', 'Chinese Grammar Wiki — câu tồn hiện'],
  yinwei: [GW + 'ASGTDUJO', 'Chinese Grammar Wiki — 因为…所以…', 'Chinese Grammar Wiki — 因为…所以…'],
  suiran: [GW + 'ASGXI560', 'Chinese Grammar Wiki — 虽然…但是…', 'Chinese Grammar Wiki — 虽然…但是…'],
  ruguo: [GW + 'ASGGIVT0', 'Chinese Grammar Wiki — 如果…就…', 'Chinese Grammar Wiki — 如果…就…'],
  chule: [GW + 'ASGHFPGG', 'Chinese Grammar Wiki — 除了…以外', 'Chinese Grammar Wiki — 除了…以外'],
  budan: [GW + 'ASGTYJ3E', 'Chinese Grammar Wiki — 不但…而且…', 'Chinese Grammar Wiki — 不但…而且…'],
  yijiu: [GW + 'ASGTFUD0', 'Chinese Grammar Wiki — 一…就…', 'Chinese Grammar Wiki — 一…就…'],
  xianzai: [GW + 'ASGLJM55', 'Chinese Grammar Wiki — sequencing with 先…再…', 'Chinese Grammar Wiki — trình tự 先…再…'],
  yibian: [GW + 'ASG2ZC5S', 'Chinese Grammar Wiki — simultaneous actions 一边…一边…', 'Chinese Grammar Wiki — song song 一边…一边…'],
  weile: [GW + 'ASGQGJXT', 'Chinese Grammar Wiki — purpose with 为了', 'Chinese Grammar Wiki — mục đích với 为了'],
  about: [GW + 'ASGNGEU8', 'Chinese Grammar Wiki — about to happen with 了 (要…了)', 'Chinese Grammar Wiki — sắp xảy ra 要…了'],
  lidist: [GW + 'ASGI96BQ', 'Chinese Grammar Wiki — distance with 离', 'Chinese Grammar Wiki — khoảng cách với 离'],
  bijiao: [GW + 'ASG72HKP', 'Chinese Grammar Wiki — 比较 (rather)', 'Chinese Grammar Wiki — 比较 (khá là)'],
  haoxiang: [GW + 'ASG3ROPY', 'Chinese Grammar Wiki — 好像 (it seems)', 'Chinese Grammar Wiki — 好像 (hình như)'],
  cai: [GW + 'ASG3WTCJ', 'Chinese Grammar Wiki — lateness with 才', 'Chinese Grammar Wiki — 才 chỉ muộn/chậm'],
  lian: [GW + 'ASGNP0WV', 'Chinese Grammar Wiki — 连…都…', 'Chinese Grammar Wiki — 连…都…'],
  bie: [GW + 'ASG9W0UX', 'Chinese Grammar Wiki — negative commands with 别', 'Chinese Grammar Wiki — câu cấm với 别'],
  serial: [W + 'Serial_verb_construction', 'Wikipedia — Serial verb construction', 'Wikipedia — Cấu trúc liên động'],
  baw: [W + 'Ba_construction', 'Wikipedia — bǎ construction', 'Wikipedia — cấu trúc 把'],
  exw: [W + 'Existential_clause', 'Wikipedia — Existential clause', 'Wikipedia — Câu tồn tại'],
  part: [W + 'Chinese_particles', 'Wikipedia — Chinese particles', 'Wikipedia — Trợ từ tiếng Trung'],
  compl: [W + 'Complement_(linguistics)', 'Wikipedia — Complement (linguistics)', 'Wikipedia — Bổ ngữ (ngôn ngữ học)'],
  tcm: [W + 'Traditional_Chinese_medicine', 'Wikipedia — Traditional Chinese medicine', 'Wikipedia — Y học cổ truyền Trung Hoa'],
  acu: [W + 'Acupuncture', 'Wikipedia — Acupuncture', 'Wikipedia — Châm cứu'],
  health: [W + 'Healthcare_in_China', 'Wikipedia — Healthcare in China', 'Wikipedia — Y tế ở Trung Quốc'],
  clim: [W + 'Climate_of_China', 'Wikipedia — Climate of China', 'Wikipedia — Khí hậu Trung Quốc'],
  hsr: [W + 'High-speed_rail_in_China', 'Wikipedia — High-speed rail in China', 'Wikipedia — Đường sắt cao tốc Trung Quốc'],
  tour: [W + 'Tourism_in_China', 'Wikipedia — Tourism in China', 'Wikipedia — Du lịch Trung Quốc'],
  pek: [W + 'Beijing_Capital_International_Airport', 'Wikipedia — Beijing Capital International Airport', 'Wikipedia — Sân bay quốc tế Thủ đô Bắc Kinh'],
  wall: [W + 'Great_Wall_of_China', 'Wikipedia — Great Wall of China', 'Wikipedia — Vạn Lý Trường Thành'],
  sihe: [W + 'Siheyuan', 'Wikipedia — Siheyuan (courtyard house)', 'Wikipedia — Tứ hợp viện'],
  wechat: [W + 'WeChat', 'Wikipedia — WeChat', 'Wikipedia — WeChat (Weixin)'],
  alipay: [W + 'Alipay', 'Wikipedia — Alipay', 'Wikipedia — Alipay (Chi Phó Bảo)'],
  phone: [W + 'Telephone_numbers_in_China', 'Wikipedia — Telephone numbers in mainland China', 'Wikipedia — Số điện thoại ở Trung Quốc đại lục'],
  cny: [W + 'Chinese_New_Year', 'Wikipedia — Chinese New Year', 'Wikipedia — Tết Nguyên đán Trung Quốc (Xuân Tiết)'],
  midau: [W + 'Mid-Autumn_Festival', 'Wikipedia — Mid-Autumn Festival', 'Wikipedia — Tết Trung thu'],
  dragon: [W + 'Dragon_Boat_Festival', 'Wikipedia — Dragon Boat Festival', 'Wikipedia — Tết Đoan Ngọ'],
  qingming: [W + 'Qingming_Festival', 'Wikipedia — Qingming Festival', 'Wikipedia — Tiết Thanh Minh'],
  lantern: [W + 'Lantern_Festival', 'Wikipedia — Lantern Festival', 'Wikipedia — Tết Nguyên tiêu'],
  hongbao: [W + 'Red_envelope', 'Wikipedia — Red envelope (hóngbāo)', 'Wikipedia — Bao lì xì (hóngbāo)'],
  holiday: [W + 'Public_holidays_in_China', 'Wikipedia — Public holidays in China', 'Wikipedia — Ngày nghỉ lễ ở Trung Quốc'],
  tea: [W + 'Chinese_tea', 'Wikipedia — Chinese tea', 'Wikipedia — Trà Trung Hoa'],
  hotpot: [W + 'Hot_pot', 'Wikipedia — Hot pot', 'Wikipedia — Lẩu'],
  cal: [W + 'Chinese_calendar', 'Wikipedia — Chinese calendar', 'Wikipedia — Lịch Trung Hoa'],
  zod: [W + 'Chinese_zodiac', 'Wikipedia — Chinese zodiac', 'Wikipedia — Mười hai con giáp'],
  mand: [W + 'Mandarin_Chinese', 'Wikipedia — Mandarin Chinese', 'Wikipedia — Tiếng Quan Thoại'],
};
const lk = (ks, i) => '<ul>' + ks.map((k) => '<li><a href="' + LK[k][0] + '" target="_blank" rel="noopener">' + LK[k][i] + '</a></li>').join('') + '</ul>';
const tbl = (head, rows) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
// o: {n, g:[[en,vi]], b:[en,vi] (mở đầu, tuỳ chọn), gr:[{h:[en,vi], t:[en,vi], ex:[[han,py,en,vi]]}], v:[[han,py,en,vi]], d:[[spk,han,py,en,vi]], pit:[en,vi], s:[[en,vi]], l:[keys], p:[[qen,qvi,aen,avi]]}
const build = (o, L) => {
  const I = L === 'en' ? 0 : 1;
  const T = L === 'en'
    ? { goals: 'Lesson goals', lec: 'Lesson', vocab: 'Vocabulary', dlg: 'Model dialogue', pit: 'Common mistakes', sum: '📌 Summary', more: '🔗 Learn more', prac: '🧪 Practice', ans: 'Answer', vh: ['Hanzi', 'Pinyin', 'Meaning'], dh: ['Who', 'Hanzi', 'Pinyin', 'Meaning'] }
    : { goals: 'Mục tiêu bài', lec: 'Bài giảng', vocab: 'Từ vựng', dlg: 'Hội thoại mẫu', pit: 'Lỗi hay gặp', sum: '📌 Tóm tắt', more: '🔗 Học thêm', prac: '🧪 Tự luyện', ans: 'Đáp án', vh: ['Hán tự', 'Pinyin', 'Nghĩa'], dh: ['Ai', 'Hán tự', 'Pinyin', 'Nghĩa'] };
  let h = '<span class="eyebrow">CIC102 · ' + (L === 'en' ? 'Lesson ' : 'Bài ') + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + (o.b ? o.b[I] : '') + '\n';
  (o.gr || []).forEach((g) => {
    h += '<h4>' + g.h[I] + '</h4><p>' + g.t[I] + '</p><ul>' + g.ex.map((e) => '<li><span lang="zh">' + e[0] + '</span><br><em>' + e[1] + '</em><br>' + e[2 + I] + '</li>').join('') + '</ul>\n';
  });
  if (o.v) h += '<h3>' + T.vocab + '</h3>' + tbl(T.vh, o.v.map((r) => ['<span lang="zh">' + r[0] + '</span>', r[1], r[2 + I]])) + '\n';
  if (o.d) h += '<h3>' + T.dlg + '</h3>' + tbl(T.dh, o.d.map((r) => [r[0], '<span lang="zh">' + r[1] + '</span>', r[2], r[3 + I]])) + '\n';
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong> ' + o.pit[I] + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
const D = (slug, en, vi, desc, o) => ({ title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: bi(build(o, 'en'), build(o, 'vi')) });
// qs: [[stem(en,vi) , options[], correctIndex, expl(en,vi)]]
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => { const r = (i * 3 + 1) % 4; const o = q[1].map(x); const opts = o.slice(r).concat(o.slice(0, r)); return { id: 'q' + (i + 1), question: x(q[0]), options: opts, correctIndex: (q[2] - r + 4) % 4, points: 1, explanation: x(q[3]) }; }) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'cic102-ts-';
const secs = [];
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu CIC102, chuẩn đầu ra tự soạn, giáo trình và tài liệu học.', [
  D(P + '0-1', '0.1 About CIC102 — Intensive Chinese 2', '0.1 Giới thiệu môn CIC102 — Tiếng Trung tổng hợp tăng cường 2',
    'CIC102 là môn gì, học để làm gì, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [['Understand what CIC102 is and how it continues CIC101', 'Hiểu CIC102 là môn gì và nối tiếp CIC101 thế nào'],
        ['Know the 8 self-authored learning outcomes', 'Nắm 8 chuẩn đầu ra tự soạn'],
        ['See the map of the 9 chapters', 'Nắm bản đồ 9 chương của khoá']],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> The university has not published a CIC102 syllabus on FLM (checked by code, variants and name on 09/11/2026). This outline is self-authored from standard textbooks (HSK Standard Course 3, Boya Chinese, Developing Chinese). Grading scheme and exam schedule follow your lecturer.</div>
<p><strong>What it is.</strong> CIC102 (Intensive Chinese 2) is the second intensive Chinese subject of the Chinese Language major, right after CIC101. CIC101 gave you pronunciation, the first 300 words and HSK 1–2 sentences. CIC102 takes you from <strong>HSK 2 to the beginning of HSK 3</strong> (roughly words 300–600): you stop producing isolated sentences and start telling stories, comparing, explaining reasons and giving advice.</p>
<p><strong>What is new.</strong> New life topics (health, weather and seasons, jobs, travel, housing, hobbies, festivals) and new grammar: aspect particles in depth (<strong>了, 过, 着</strong>), <strong>result, direction, potential and degree complements</strong>, comparisons (<strong>比, 没有, 一样, 越来越</strong>), serial-verb sentences, existential sentences, <strong>把</strong> and <strong>被</strong> sentences, and complex sentences.</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Narrate past events and experiences with 了, 过, 着 and time-duration/frequency phrases.</li>
<li>Use result, direction, potential and degree complements correctly (看懂, 走出去, 听不懂, 跑得快).</li>
<li>Compare people, places and things with 比, 没有, 一样, 越来越.</li>
<li>Describe symptoms, follow a doctor’s advice, talk about weather and seasons.</li>
<li>Handle job, travel, housing and phone situations with ready-made patterns.</li>
<li>Produce 把 / 被 / existential / serial-verb sentences.</li>
<li>Link ideas with complex sentences (因为…所以, 虽然…但是, 如果…就, 不但…而且).</li>
<li>Read dialogues of about 150–250 characters and write a connected paragraph of 8–10 sentences, at about HSK 3 level.</li></ol>
<h4>Related subjects</h4>
<p>Prerequisite in spirit: <strong>CIC101</strong> (Intensive Chinese 1). The follow-up subjects of the Intensive Chinese chain are not published; ask your academic office. Chapter map: 1 Past and results · 2 Comparison · 3 Health, weather · 4 Work and plans · 5 Travel · 6 Home, 把 and 被 · 7 Hobbies and complements · 8 Festivals and social life · 9 Complex sentences and exam skills.</p>`,
       `<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của CIC102 trên FLM (đã dò theo mã, biến thể mã và tên ngày 09/11/2026). Khung này soạn theo giáo trình chuẩn (HSK Standard Course 3, Boya Chinese, Developing Chinese); cách tính điểm và lịch thi theo giảng viên của lớp bạn.</div>
<p><strong>Là môn gì.</strong> CIC102 (Intensive Chinese 2, Tiếng Trung tổng hợp tăng cường 2) là môn tiếng Trung tăng cường thứ hai của ngành Ngôn ngữ Trung Quốc, ngay sau CIC101. CIC101 cho bạn ngữ âm, 300 từ đầu và câu HSK 1–2. CIC102 đưa bạn <strong>từ HSK 2 lên đầu HSK 3</strong> (khoảng từ thứ 300–600): thôi nói từng câu rời, bắt đầu kể chuyện, so sánh, giải thích lý do và đưa lời khuyên.</p>
<p><strong>Có gì mới.</strong> Chủ đề đời sống mới (sức khoẻ, thời tiết và mùa, nghề nghiệp, du lịch, nhà ở, sở thích, lễ tết) và ngữ pháp mới: trợ từ thể <strong>了, 过, 着</strong> đi sâu hơn, các <strong>bổ ngữ kết quả, xu hướng, khả năng, trạng thái</strong>, so sánh (<strong>比, 没有, 一样, 越来越</strong>), câu liên động, câu tồn hiện, câu <strong>把</strong> và <strong>被</strong>, câu phức.</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Kể việc đã xảy ra và trải nghiệm bằng 了, 过, 着 và cụm chỉ thời lượng/số lần.</li>
<li>Dùng đúng bổ ngữ kết quả, xu hướng, khả năng, trạng thái (看懂, 走出去, 听不懂, 跑得快).</li>
<li>So sánh người, nơi chốn, sự vật bằng 比, 没有, 一样, 越来越.</li>
<li>Mô tả triệu chứng, nghe lời dặn của bác sĩ, nói về thời tiết và mùa.</li>
<li>Xử lý tình huống việc làm, du lịch, nhà ở, điện thoại bằng mẫu câu dựng sẵn.</li>
<li>Tạo câu 把 / 被 / tồn hiện / liên động.</li>
<li>Nối ý bằng câu phức (因为…所以, 虽然…但是, 如果…就, 不但…而且).</li>
<li>Đọc hội thoại khoảng 150–250 chữ và viết đoạn văn liền mạch 8–10 câu, ở mức HSK 3.</li></ol>
<h4>Môn liên quan</h4>
<p>Tiên quyết theo tinh thần học: <strong>CIC101</strong> (Tiếng Trung tổng hợp tăng cường 1). Các môn tiếp theo của chuỗi Intensive Chinese chưa được công bố; hỏi phòng đào tạo. Bản đồ chương: 1 Quá khứ và kết quả · 2 So sánh · 3 Sức khoẻ, thời tiết · 4 Công việc và kế hoạch · 5 Du lịch · 6 Nhà ở, 把 và 被 · 7 Sở thích và bổ ngữ · 8 Lễ tết và giao tiếp · 9 Câu phức và kỹ năng thi.</p>`],
    s: [['CIC102 = Chinese from HSK 2 to early HSK 3.', 'CIC102 = tiếng Trung từ HSK 2 lên đầu HSK 3.'],
        ['No FLM syllabus exists: this outline is self-authored.', 'Chưa có syllabus trên FLM: khung này tự soạn.'],
        ['Focus: complements, comparison, 把/被, complex sentences.', 'Trọng tâm: bổ ngữ, so sánh, 把/被, câu phức.']],
    l: ['hsk', 'hsk3'],
    p: [['Which subject comes right before CIC102 in this outline?', 'Môn nào đứng ngay trước CIC102 trong khung này?', 'CIC101 (Intensive Chinese 1).', 'CIC101 (Tiếng Trung tổng hợp tăng cường 1).'],
        ['Name three new grammar areas of CIC102.', 'Kể ba mảng ngữ pháp mới của CIC102.', 'For example: complements, 把/被 sentences, complex sentences.', 'Ví dụ: bổ ngữ, câu 把/被, câu phức.']] }),

  D(P + '0-2', '0.2 Textbooks & resources', '0.2 Giáo trình & tài liệu',
    'Giáo trình chuẩn có ISBN, từ điển, nguồn đọc và công cụ học đã kiểm.', {
    n: '0.2',
    g: [['Choose a main textbook and a reference', 'Chọn giáo trình chính và sách tham khảo'], ['Know free tools for lookup, reading and grammar', 'Biết công cụ miễn phí để tra từ, đọc và học ngữ pháp']],
    b: [`<h4>Books</h4>
<ul><li><strong>HSK Standard Course 3</strong> (<span lang="zh">HSK标准教程3</span>), Jiang Liping (chief ed.), Beijing Language and Culture University Press, 2014. Textbook ISBN 978-7-5619-3818-8 (confirmed on several retailer and library records); workbook ISBN 978-7-5619-3815-7. 20 lessons, aligned with the HSK 3 word list. This is our main reference.</li>
<li><strong>HSK Standard Course 2</strong> (same series) — review for the gaps left from CIC101. ISBN not quoted here; check the one printed on your copy.</li>
<li><strong>Boya Chinese</strong> (<span lang="zh">博雅汉语</span>) Elementary II and <strong>Developing Chinese</strong> (<span lang="zh">发展汉语</span>) Elementary Comprehensive II, Peking University Press / BLCU Press — common alternative intensive courses; editions differ, so no ISBN is quoted.</li></ul>
<h4>Free resources</h4>` + lk(['hsk3', 'mdbg', 'pleco', 'duchinese', 'coursera', 'wikib'], 1) + `<p><strong>Study routine.</strong> 30 minutes a day: 10 min review old words, 10 min new grammar with 5 own sentences, 10 min read or listen. Always learn words inside sentences.</p>`,
       `<h4>Sách</h4>
<ul><li><strong>HSK Standard Course 3</strong> (<span lang="zh">HSK标准教程3</span>), chủ biên Khương Lệ Bình (Jiang Liping), NXB Đại học Ngôn ngữ và Văn hoá Bắc Kinh, 2014. Sách bài học ISBN 978-7-5619-3818-8 (đã đối chiếu trên nhiều trang bán sách và thư viện); sách bài tập ISBN 978-7-5619-3815-7. 20 bài, bám bảng từ HSK 3. Đây là tài liệu tham chiếu chính.</li>
<li><strong>HSK Standard Course 2</strong> (cùng bộ) — ôn lại phần còn hổng từ CIC101. Không ghi ISBN ở đây; hãy xem ISBN in trên cuốn của bạn.</li>
<li><strong>Boya Chinese</strong> (<span lang="zh">博雅汉语</span>) sơ cấp II và <strong>Developing Chinese</strong> (<span lang="zh">发展汉语</span>) sơ cấp tổng hợp II, NXB ĐH Bắc Kinh / BLCU — các bộ giáo trình tăng cường thay thế phổ biến; mỗi lần xuất bản khác nhau nên không ghi ISBN.</li></ul>
<h4>Tài nguyên miễn phí</h4>` + lk(['hsk3', 'mdbg', 'pleco', 'duchinese', 'coursera', 'wikib'], 2) + `<p><strong>Thói quen học.</strong> 30 phút mỗi ngày: 10 phút ôn từ cũ, 10 phút ngữ pháp mới kèm 5 câu tự đặt, 10 phút đọc hoặc nghe. Luôn học từ trong câu.</p>`],
    s: [['Main book: HSK Standard Course 3 (ISBN 978-7-5619-3818-8).', 'Sách chính: HSK Standard Course 3 (ISBN 978-7-5619-3818-8).'], ['Use a dictionary (MDBG/Pleco) and graded reading (Du Chinese).', 'Dùng từ điển (MDBG/Pleco) và đọc theo cấp độ (Du Chinese).'], ['Learn words inside sentences.', 'Học từ trong câu.']],
    l: ['mdbg', 'duchinese'],
    p: [['Which list should you check to see HSK 3 words?', 'Nên xem danh sách nào để biết từ HSK 3?', 'The HSK 3 vocabulary list (e.g. HSK Academy).', 'Danh sách từ vựng HSK 3 (ví dụ HSK Academy).'],
        ['Why learn words inside sentences?', 'Vì sao học từ trong câu?', 'You also learn the grammar pattern and collocations.', 'Vì học luôn mẫu ngữ pháp và cách kết hợp từ.']] }),
]));

// ===== Chương 1 =====
secs.push(SEC('Chapter 1 — Past, experience and results', 'Chương 1 — Quá khứ, trải nghiệm và kết quả',
  '了 hoàn thành và thay đổi, 过 trải nghiệm, 着 trạng thái, bổ ngữ kết quả, thời lượng và số lần.', [
  D(P + '1-1', '1.1 了: finished actions and new situations', '1.1 了: việc đã xong và tình huống mới', 'Hai chức năng của 了, phủ định 没, khi nào không dùng 了.', {
    n: '1.1',
    g: [['Use verb 了 for a completed, specific action', 'Dùng V+了 cho hành động đã hoàn thành, cụ thể'], ['Use sentence-final 了 for a new situation', 'Dùng 了 cuối câu cho tình huống mới'], ['Negate with 没(有) and drop 了', 'Phủ định bằng 没(有) và bỏ 了']],
    b: [`<p>You already met <strong>了</strong> in CIC101. Now we separate its two jobs. (1) <strong>Verb 了</strong> marks that an action is completed. (2) <strong>Sentence-final 了</strong> says “things have changed”: a new state, a decision, a start.</p>`,
        `<p>Bạn đã gặp <strong>了</strong> ở CIC101. Giờ ta tách hai việc của nó. (1) <strong>V+了</strong> đánh dấu hành động đã hoàn thành. (2) <strong>了 cuối câu</strong> nói “có sự thay đổi”: trạng thái mới, quyết định, bắt đầu.</p>`],
    gr: [{ h: ['Verb + 了 (completion)', 'V+了 (hoàn thành)'], t: ['With an object, the object usually needs a number, measure word or adjective: V 了 + number + noun. A bare object normally needs another clause to finish the sentence.', 'Khi có tân ngữ, tân ngữ thường cần số từ, lượng từ hoặc tính từ: V了 + số + danh từ. Tân ngữ trơn thường cần thêm một vế câu nữa mới trọn nghĩa.'],
           ex: [['我昨天买了三本书。', 'Wǒ zuótiān mǎile sān běn shū.', 'Yesterday I bought three books.', 'Hôm qua tôi đã mua ba quyển sách.'], ['他吃了饭就去上班了。', 'Tā chīle fàn jiù qù shàngbān le.', 'He went to work after eating.', 'Anh ấy ăn cơm xong là đi làm.'], ['我没买书。', 'Wǒ méi mǎi shū.', 'I did not buy books (no 了).', 'Tôi không mua sách (không có 了).']] },
         { h: ['Sentence-final 了 (change)', '了 cuối câu (thay đổi)'], t: ['Final 了 can attach to adjectives and nouns too. It often means “now it is different from before”.', '了 cuối câu còn gắn được với tính từ và danh từ. Thường có nghĩa “bây giờ khác trước rồi”.'],
           ex: [['下雨了,我们不去了。', 'Xià yǔ le, wǒmen bú qù le.', 'It is raining, so we are not going any more.', 'Mưa rồi, chúng ta không đi nữa.'], ['他已经十八岁了。', 'Tā yǐjīng shíbā suì le.', 'He is already eighteen.', 'Cậu ấy đã mười tám tuổi rồi.'], ['天黑了,快回家吧。', 'Tiān hēi le, kuài huí jiā ba.', 'It got dark, go home quickly.', 'Trời tối rồi, mau về nhà đi.']] }],
    v: [['昨天', 'zuótiān', 'yesterday', 'hôm qua'], ['刚才', 'gāngcái', 'just now', 'vừa nãy'], ['已经', 'yǐjīng', 'already', 'đã'], ['终于', 'zhōngyú', 'finally', 'cuối cùng cũng'], ['丢', 'diū', 'to lose', 'làm mất'], ['钥匙', 'yàoshi', 'key', 'chìa khoá'], ['手机', 'shǒujī', 'mobile phone', 'điện thoại di động'], ['决定', 'juédìng', 'to decide', 'quyết định'], ['开始', 'kāishǐ', 'to begin', 'bắt đầu'], ['发现', 'fāxiàn', 'to discover', 'phát hiện']],
    d: [['A', '你怎么了?', 'Nǐ zěnme le?', 'What happened?', 'Bạn sao vậy?'], ['B', '我的手机丢了。', 'Wǒ de shǒujī diū le.', 'I lost my phone.', 'Điện thoại của tôi mất rồi.'], ['A', '你什么时候发现的?', 'Nǐ shénme shíhou fāxiàn de?', 'When did you notice?', 'Bạn phát hiện lúc nào?'], ['B', '刚才下车的时候发现没有了。', 'Gāngcái xià chē de shíhou fāxiàn méiyǒu le.', 'Just now when I got off the bus it was gone.', 'Vừa nãy lúc xuống xe thì thấy không còn nữa.'], ['A', '别着急,我们给公司打个电话吧。', 'Bié zháojí, wǒmen gěi gōngsī dǎ ge diànhuà ba.', 'Do not worry, let us call the company.', 'Đừng lo, ta gọi điện cho công ty đi.']],
    pit: ['Using 了 for habits (“every day I went” + 了) and for past states with no change; also keeping 了 in the negative: say 没买, not 没买了.', 'Dùng 了 cho thói quen (“hằng ngày tôi đã đi” + 了) hoặc trạng thái quá khứ không đổi; và giữ 了 trong câu phủ định: nói 没买, không nói 没买了.'],
    s: [['V了 = completed action; needs a quantity or another clause.', 'V了 = hành động đã xong; cần số lượng hoặc vế sau.'], ['Final 了 = new situation or change.', '了 cuối câu = tình huống/thay đổi mới.'], ['Negative: 没(有) + V, no 了.', 'Phủ định: 没(有) + V, không 了.']],
    l: ['le', 'lechange', 'part'],
    p: [['Translate: “I drank two cups of tea.”', 'Dịch: “Tôi đã uống hai tách trà.”', '我喝了两杯茶。Wǒ hēle liǎng bēi chá.', '我喝了两杯茶。Wǒ hēle liǎng bēi chá.'],
        ['Fix: 我昨天没去了学校。', 'Sửa: 我昨天没去了学校。', '我昨天没去学校。 (drop 了 after 没)', '我昨天没去学校。 (bỏ 了 sau 没)'],
        ['Make a sentence with final 了: “I do not want to eat any more.”', 'Đặt câu với 了 cuối câu: “Tôi không muốn ăn nữa.”', '我不想吃了。Wǒ bù xiǎng chī le.', '我不想吃了。Wǒ bù xiǎng chī le.']] }),

  D(P + '1-2', '1.2 过 and 着: experience and state', '1.2 过 và 着: trải nghiệm và trạng thái', 'V+过 từng làm, 没…过, V+着 trạng thái kéo dài, cặp 了/过/着.', {
    n: '1.2',
    g: [['Say what you have (never) done with 过', 'Nói đã (chưa từng) làm gì với 过'], ['Describe a continuing state with 着', 'Mô tả trạng thái đang duy trì bằng 着'], ['Choose among 了, 过, 着', 'Chọn giữa 了, 过, 着']],
    b: [`<p><strong>过</strong> after a verb means the action happened at least once in your life, and it is over. <strong>着</strong> after a verb describes a state that is going on (a door that is open, a person who is standing). A quick contrast: 了 = “done”, 过 = “has been done before”, 着 = “is in that state”.</p>`,
        `<p><strong>过</strong> sau động từ nghĩa là hành động đã xảy ra ít nhất một lần trong đời và đã kết thúc. <strong>着</strong> sau động từ mô tả trạng thái đang duy trì (cửa đang mở, người đang đứng). Đối chiếu nhanh: 了 = “xong”, 过 = “từng làm”, 着 = “đang ở trạng thái đó”.</p>`],
    gr: [{ h: ['V + 过 (experience)', 'V+过 (trải nghiệm)'], t: ['Negative: 没(有) + V + 过. Question: V 过 + 吗, or V 没 V 过. Never add 了 after 过 for plain experience.', 'Phủ định: 没(有) + V + 过. Câu hỏi: V过…吗 hoặc 有没有 V过. Kể trải nghiệm thì không thêm 了 sau 过.'],
           ex: [['你去过北京吗?', 'Nǐ qùguo Běijīng ma?', 'Have you ever been to Beijing?', 'Bạn từng đến Bắc Kinh chưa?'], ['我从来没吃过火锅。', 'Wǒ cónglái méi chīguo huǒguō.', 'I have never eaten hot pot.', 'Tôi chưa bao giờ ăn lẩu.'], ['他以前学过汉语。', 'Tā yǐqián xuéguo Hànyǔ.', 'He studied Chinese before.', 'Trước đây anh ấy từng học tiếng Trung.']] },
         { h: ['V + 着 (state)', 'V+着 (trạng thái)'], t: ['Works with posture and placement verbs: 站, 坐, 躺, 挂, 放, 开, 穿, 拿. Negative: 没(有) + V + 着.', 'Hợp với động từ tư thế và đặt để: 站, 坐, 躺, 挂, 放, 开, 穿, 拿. Phủ định: 没(有) + V + 着.'],
           ex: [['门开着,灯也开着。', 'Mén kāizhe, dēng yě kāizhe.', 'The door is open and the light is on.', 'Cửa đang mở, đèn cũng đang bật.'], ['他穿着一件红色的衬衫。', 'Tā chuānzhe yí jiàn hóngsè de chènshān.', 'He is wearing a red shirt.', 'Anh ấy đang mặc một chiếc sơ mi đỏ.'], ['她笑着说:“谢谢你。”', 'Tā xiàozhe shuō: “Xièxie nǐ.”', 'She said “thank you” with a smile.', 'Cô ấy mỉm cười nói: “Cảm ơn bạn.”']] }],
    v: [['以前', 'yǐqián', 'before, in the past', 'trước đây'], ['从来', 'cónglái', 'ever, all along (with negative)', 'từ trước đến nay (đi với phủ định)'], ['听说', 'tīngshuō', 'to hear (that)', 'nghe nói'], ['旅游', 'lǚyóu', 'to travel, tour', 'du lịch'], ['火锅', 'huǒguō', 'hot pot', 'lẩu'], ['站', 'zhàn', 'to stand', 'đứng'], ['躺', 'tǎng', 'to lie down', 'nằm'], ['挂', 'guà', 'to hang', 'treo'], ['穿', 'chuān', 'to wear, put on', 'mặc'], ['拿', 'ná', 'to hold, take', 'cầm']],
    d: [['A', '你去过中国吗?', 'Nǐ qùguo Zhōngguó ma?', 'Have you been to China?', 'Bạn từng đến Trung Quốc chưa?'], ['B', '去过一次,是去年夏天。', 'Qùguo yí cì, shì qùnián xiàtiān.', 'Once, last summer.', 'Một lần, mùa hè năm ngoái.'], ['A', '你吃过北京烤鸭吗?', 'Nǐ chīguo Běijīng kǎoyā ma?', 'Did you try Peking duck?', 'Bạn ăn vịt quay Bắc Kinh chưa?'], ['B', '吃过,可是我没吃过四川火锅。', 'Chīguo, kěshì wǒ méi chīguo Sìchuān huǒguō.', 'Yes, but I have not had Sichuan hot pot.', 'Rồi, nhưng tôi chưa ăn lẩu Tứ Xuyên.']],
    pit: ['Writing 我去过北京了 for a plain experience, and using 着 for an action that already finished (use 了 for that).', 'Viết 我去过北京了 để kể trải nghiệm thông thường; và dùng 着 cho hành động đã xong (phải dùng 了).'],
    s: [['过 = ever done; negative 没…过.', '过 = từng làm; phủ định 没…过.'], ['着 = ongoing state, good with posture verbs.', '着 = trạng thái đang duy trì, hợp động từ tư thế.'], ['了 done · 过 happened before · 着 state.', '了 xong · 过 từng · 着 trạng thái.']],
    l: ['guo', 'zhe', 'gram'],
    p: [['Ask: “Have you ever eaten hot pot?”', 'Hỏi: “Bạn đã từng ăn lẩu chưa?”', '你吃过火锅吗? Nǐ chīguo huǒguō ma?', '你吃过火锅吗? Nǐ chīguo huǒguō ma?'],
        ['Say: “There is a picture hanging on the wall.” (use 着)', 'Nói: “Trên tường đang treo một bức tranh.” (dùng 着)', '墙上挂着一张画。Qiáng shang guàzhe yì zhāng huà.', '墙上挂着一张画。Qiáng shang guàzhe yì zhāng huà.'],
        ['Which is correct: 我没去过上海 or 我没去过了上海?', 'Câu nào đúng: 我没去过上海 hay 我没去过了上海?', '我没去过上海.', '我没去过上海.']] }),

  D(P + '1-3', '1.3 Result complements: 完, 到, 见, 懂, 错, 好', '1.3 Bổ ngữ kết quả: 完, 到, 见, 懂, 错, 好', 'V+kết quả, phủ định 没, sai lầm thường gặp.', {
    n: '1.3',
    g: [['Add a result complement right after the verb', 'Gắn bổ ngữ kết quả ngay sau động từ'], ['Know the six most common results', 'Biết sáu kết quả thông dụng nhất'], ['Negate with 没 and ask with 了没有', 'Phủ định bằng 没 và hỏi bằng 了没有']],
    b: [`<p>A result complement is a short verb or adjective placed <strong>directly</strong> after the main verb to tell the outcome: 看<strong>见</strong> (look → see), 听<strong>懂</strong> (listen → understand). Think of it as one compound verb: no word may come between them (except 得/不 for potential, Chapter 7).</p><p>Common results: 完 finish · 到 reach/succeed · 见 perceive · 懂 understand · 错 wrong · 好 properly done · 饱 full · 清楚 clearly.</p>`,
        `<p>Bổ ngữ kết quả là một động từ hoặc tính từ ngắn đặt <strong>ngay sau</strong> động từ chính để nói kết quả: 看<strong>见</strong> (nhìn → thấy), 听<strong>懂</strong> (nghe → hiểu). Coi nó như một động từ ghép: không chen từ nào vào giữa (trừ 得/不 của bổ ngữ khả năng, Chương 7).</p><p>Kết quả hay gặp: 完 xong · 到 đạt/được · 见 cảm nhận được · 懂 hiểu · 错 sai · 好 xong xuôi · 饱 no · 清楚 rõ.</p>`],
    gr: [{ h: ['Pattern and negation', 'Mẫu câu và phủ định'], t: ['Affirmative: V + result + 了. Negative: 没(有) + V + result (no 了). Question: V + result + 了没有?', 'Khẳng định: V + kết quả + 了. Phủ định: 没(有) + V + kết quả (không 了). Hỏi: V + kết quả + 了没有?'],
           ex: [['我做完作业了。', 'Wǒ zuòwán zuòyè le.', 'I finished my homework.', 'Tôi làm xong bài tập rồi.'], ['你听懂老师的话了吗?', 'Nǐ tīngdǒng lǎoshī de huà le ma?', 'Did you understand the teacher?', 'Bạn nghe hiểu lời thầy chưa?'], ['我没找到我的书。', 'Wǒ méi zhǎodào wǒ de shū.', 'I did not find my book.', 'Tôi không tìm thấy sách của mình.'], ['你写错了这个字。', 'Nǐ xiěcuòle zhège zì.', 'You wrote this character wrong.', 'Bạn viết sai chữ này.']] }],
    v: [['完', 'wán', 'to finish (result)', 'xong (bổ ngữ)'], ['到', 'dào', 'to reach, achieve (result)', 'được, tới (bổ ngữ)'], ['见', 'jiàn', 'to perceive (result)', 'thấy (bổ ngữ)'], ['懂', 'dǒng', 'to understand', 'hiểu'], ['错', 'cuò', 'wrong', 'sai'], ['饱', 'bǎo', 'full (stomach)', 'no'], ['清楚', 'qīngchu', 'clear', 'rõ ràng'], ['找', 'zhǎo', 'to look for', 'tìm'], ['作业', 'zuòyè', 'homework', 'bài tập về nhà'], ['准备', 'zhǔnbèi', 'to prepare', 'chuẩn bị']],
    d: [['A', '你的作业做完了吗?', 'Nǐ de zuòyè zuòwán le ma?', 'Have you finished your homework?', 'Bài tập của bạn làm xong chưa?'], ['B', '还没做完,有一个字我没看懂。', 'Hái méi zuòwán, yǒu yí ge zì wǒ méi kàndǒng.', 'Not yet, there is a word I did not understand.', 'Chưa xong, có một chữ tôi chưa hiểu.'], ['A', '你看清楚了吗?是这个字。', 'Nǐ kàn qīngchu le ma? Shì zhège zì.', 'Did you look carefully? It is this character.', 'Bạn nhìn rõ chưa? Là chữ này.'], ['B', '啊,我看错了!谢谢。', 'À, wǒ kàncuò le! Xièxie.', 'Oh, I misread it! Thanks.', 'À, tôi nhìn nhầm! Cảm ơn.']],
    pit: ['Putting 了 before the complement (做了完) or keeping 了 in the negative (没做完了). Also confusing 看 (to look) with 看见 (to actually see).', 'Đặt 了 trước bổ ngữ (做了完) hoặc giữ 了 trong câu phủ định (没做完了). Cũng hay lẫn 看 (nhìn) với 看见 (nhìn thấy).'],
    s: [['V + result gives the outcome of an action.', 'V + kết quả cho biết kết cục của hành động.'], ['Negative: 没 + V + result.', 'Phủ định: 没 + V + kết quả.'], ['Learn pairs as units: 听懂, 看见, 找到, 写错.', 'Học theo cặp: 听懂, 看见, 找到, 写错.']],
    l: ['resc', 'resdj', 'compl'],
    p: [['Say: “I have not finished eating.”', 'Nói: “Tôi chưa ăn xong.”', '我还没吃完。Wǒ hái méi chīwán.', '我还没吃完。Wǒ hái méi chīwán.'],
        ['Say: “I heard it clearly.” (听 + 清楚)', 'Nói: “Tôi nghe rõ rồi.” (听 + 清楚)', '我听清楚了。Wǒ tīng qīngchu le.', '我听清楚了。Wǒ tīng qīngchu le.']] }),

  D(P + '1-4', '1.4 How long and how many times', '1.4 Bao lâu và bao nhiêu lần', 'Bổ ngữ thời lượng (了 + thời gian), động lượng 次/遍/下, lặp tân ngữ.', {
    n: '1.4',
    g: [['Say how long an action lasted', 'Nói hành động kéo dài bao lâu'], ['Count times with 次, 遍, 下', 'Đếm số lần với 次, 遍, 下'], ['Place the object correctly', 'Đặt tân ngữ đúng chỗ']],
    b: [`<p>Duration and frequency come <strong>after</strong> the verb (unlike English). Duration: V + 了 + time. Frequency: V + number + 次/遍/下. If the verb has an object, the object goes after the quantity when it is a thing, but a <strong>person or place</strong> object comes before the number.</p>`,
        `<p>Thời lượng và số lần đứng <strong>sau</strong> động từ (khác tiếng Anh). Thời lượng: V + 了 + thời gian. Số lần: V + số + 次/遍/下. Nếu có tân ngữ: tân ngữ là vật thì đứng sau lượng từ, còn tân ngữ là <strong>người hoặc nơi chốn</strong> thì đứng trước số lượng.</p>`],
    gr: [{ h: ['Duration', 'Thời lượng'], t: ['V + 了 + time (+ 的 + object). With final 了 too, the action is still going on.', 'V + 了 + thời gian (+ 的 + tân ngữ). Có thêm 了 cuối câu thì hành động vẫn còn tiếp diễn.'],
           ex: [['我学了两年汉语。', 'Wǒ xuéle liǎng nián Hànyǔ.', 'I studied Chinese for two years.', 'Tôi đã học tiếng Trung hai năm.'], ['我学了两年汉语了。', 'Wǒ xuéle liǎng nián Hànyǔ le.', 'I have been studying Chinese for two years (still do).', 'Tôi học tiếng Trung được hai năm rồi (vẫn đang học).'], ['他等了你半个小时。', 'Tā děngle nǐ bàn ge xiǎoshí.', 'He waited half an hour for you.', 'Anh ấy đã đợi bạn nửa tiếng.']] },
         { h: ['Frequency', 'Số lần'], t: ['次 = occasions, 遍 = from start to finish, 下 = a short try. Person/place objects go in front of the number.', '次 = lần (sự việc), 遍 = lượt từ đầu đến cuối, 下 = thử nhanh một cái. Tân ngữ người/nơi đứng trước số lượng.'],
           ex: [['这本书我看了两遍。', 'Zhè běn shū wǒ kànle liǎng biàn.', 'I read this book twice through.', 'Quyển sách này tôi đọc hai lượt.'], ['我去过北京三次。', 'Wǒ qùguo Běijīng sān cì.', 'I have been to Beijing three times.', 'Tôi đã đến Bắc Kinh ba lần.'], ['请你等一下。', 'Qǐng nǐ děng yíxià.', 'Please wait a moment.', 'Xin bạn đợi một chút.']] }],
    v: [['小时', 'xiǎoshí', 'hour', 'giờ (đồng hồ)'], ['分钟', 'fēnzhōng', 'minute', 'phút'], ['次', 'cì', 'time (occasion)', 'lần'], ['遍', 'biàn', 'time (whole run)', 'lượt'], ['一下', 'yíxià', 'a bit, once', 'một chút'], ['一会儿', 'yíhuìr', 'a little while', 'một lát'], ['半天', 'bàntiān', 'half a day, ages', 'nửa ngày, rất lâu'], ['左右', 'zuǒyòu', 'about', 'khoảng'], ['练习', 'liànxí', 'to practise', 'luyện tập'], ['多长时间', 'duō cháng shíjiān', 'how long', 'bao lâu']],
    d: [['A', '你学汉语学了多长时间了?', 'Nǐ xué Hànyǔ xuéle duō cháng shíjiān le?', 'How long have you studied Chinese?', 'Bạn học tiếng Trung được bao lâu rồi?'], ['B', '学了一年半了。', 'Xuéle yì nián bàn le.', 'A year and a half.', 'Được một năm rưỡi rồi.'], ['A', '每天练习多长时间?', 'Měi tiān liànxí duō cháng shíjiān?', 'How long do you practise daily?', 'Mỗi ngày luyện bao lâu?'], ['B', '一个小时左右,课文我会读三遍。', 'Yí ge xiǎoshí zuǒyòu, kèwén wǒ huì dú sān biàn.', 'About an hour; I read each text three times.', 'Khoảng một tiếng, bài khoá tôi đọc ba lượt.']],
    pit: ['Saying 我学汉语两年 (English order). Put time after the verb: 我学了两年汉语 or 我学汉语学了两年. Also placing a person object after the number: say 看了他两次, not 看了两次他.', 'Nói 我学汉语两年 (theo trật tự tiếng Anh). Thời gian đứng sau động từ: 我学了两年汉语 hoặc 我学汉语学了两年. Tân ngữ là người không đặt sau số lượng: nói 看了他两次, không nói 看了两次他.'],
    s: [['Duration and frequency follow the verb.', 'Thời lượng và số lần đứng sau động từ.'], ['V了…了 = still continuing.', 'V了…了 = vẫn đang tiếp tục.'], ['次 occasions · 遍 whole run · 下 short try.', '次 lần · 遍 cả lượt · 下 thử nhanh.']],
    l: ['dur', 'gram', 'mdbg'],
    p: [['Say: “I waited for him for 20 minutes.”', 'Nói: “Tôi đã đợi anh ấy 20 phút.”', '我等了他二十分钟。Wǒ děngle tā èrshí fēnzhōng.', '我等了他二十分钟。Wǒ děngle tā èrshí fēnzhōng.'],
        ['Say: “I have seen this film twice.”', 'Nói: “Phim này tôi đã xem hai lần.”', '这部电影我看过两遍。Zhè bù diànyǐng wǒ kànguo liǎng biàn.', '这部电影我看过两遍。Zhè bù diànyǐng wǒ kànguo liǎng biàn.']] }),

  Q(P + 'quiz-1', 'Chapter 1 quiz', 'Quiz chương 1', [
    [['Which sentence is correct for “I did not buy it”?', 'Câu nào đúng cho “Tôi đã không mua”?'], ['我没买了。', '我没买。', '我不买了过。', '我没了买。'], 1, ['After 没 we drop 了.', 'Sau 没 bỏ 了.']],
    [['“Have you ever been to China?”', '“Bạn từng đến Trung Quốc chưa?”'], ['你去了中国吗?', '你去着中国吗?', '你去过中国吗?', '你在去中国吗?'], 2, ['过 marks experience.', '过 chỉ trải nghiệm.']],
    [['“The door is open.” uses:', '“Cửa đang mở.” dùng:'], ['门开了过。', '门开着。', '门开完。', '门开到。'], 1, ['着 marks a continuing state.', '着 chỉ trạng thái duy trì.']],
    [['“I understood (by listening).”', '“Tôi nghe hiểu rồi.”'], ['我听懂了。', '我听见了懂。', '我听了懂。', '我懂听了。'], 0, ['V + result complement + 了.', 'V + bổ ngữ kết quả + 了.']],
    [['Negative of 我找到了:', 'Phủ định của 我找到了:'], ['我不找到。', '我没找到。', '我没找到了。', '我找不到了。'], 1, ['没 + V + result, no 了.', '没 + V + kết quả, không 了.']],
    [['“I studied Chinese for two years.”', '“Tôi đã học tiếng Trung hai năm.”'], ['我学汉语两年。', '我两年学了汉语。', '我学了两年汉语。', '我学两年了汉语。'], 2, ['Duration follows the verb.', 'Thời lượng đứng sau động từ.']],
    [['Which measure word means “a whole read-through”?', 'Từ nào chỉ “một lượt từ đầu đến cuối”?'], ['次', '遍', '下', '个'], 1, ['遍 counts complete runs.', '遍 đếm cả lượt.']],
    [['Sentence-final 了 mainly says:', '了 cuối câu chủ yếu nói:'], [['a habit','một thói quen'], ['a new situation','một tình huống mới'], ['a question','một câu hỏi'], ['a negative','một phủ định']], 1, ['It marks change.', 'Nó đánh dấu sự thay đổi.']],
  ]),
]));
// ===== Chương 2 =====
secs.push(SEC('Chapter 2 — Comparing things', 'Chương 2 — So sánh',
  '比, 没有, 一样, 差距, 越来越, 越…越…, 最.', [
  D(P + '2-1', '2.1 Comparing with 比', '2.1 So sánh với 比', 'A 比 B + tính từ, mức chênh, 更/还, lỗi 很 + 比.', {
    n: '2.1',
    g: [['Build A 比 B + adjective', 'Dựng A 比 B + tính từ'], ['Say how much bigger/smaller', 'Nói hơn kém bao nhiêu'], ['Use 更 and 还 for “even more”', 'Dùng 更 và 还 cho “còn hơn nữa”']],
    b: [`<p>In CIC101 you saw 比 once. Now we use it fully. Pattern: <strong>A 比 B + adjective</strong>. The adjective stands alone: no 很, 非常, 太 before it. To give the amount of difference, add it <strong>after</strong> the adjective.</p>`,
        `<p>Ở CIC101 bạn mới gặp 比 một lần. Giờ dùng đầy đủ. Mẫu: <strong>A 比 B + tính từ</strong>. Tính từ đứng trơn: không có 很, 非常, 太 phía trước. Muốn nói chênh bao nhiêu thì thêm <strong>sau</strong> tính từ.</p>`],
    gr: [{ h: ['A 比 B + adjective (+ difference)', 'A 比 B + tính từ (+ mức chênh)'], t: ['Difference words: 一点儿 (a little), 得多 / 多了 (much), a number (三岁, 五块钱). Negative: A 没有 B + adj (next lesson) or 不比.', 'Từ chỉ mức chênh: 一点儿 (một chút), 得多 / 多了 (nhiều), con số (三岁, 五块钱). Phủ định: A 没有 B + tính từ (bài sau) hoặc 不比.'],
           ex: [['今天比昨天冷。', 'Jīntiān bǐ zuótiān lěng.', 'Today is colder than yesterday.', 'Hôm nay lạnh hơn hôm qua.'], ['我哥哥比我大三岁。', 'Wǒ gēge bǐ wǒ dà sān suì.', 'My older brother is three years older than me.', 'Anh trai tôi lớn hơn tôi ba tuổi.'], ['这家店的东西比那家便宜得多。', 'Zhè jiā diàn de dōngxi bǐ nà jiā piányi de duō.', 'Things here are much cheaper than there.', 'Đồ ở tiệm này rẻ hơn tiệm kia nhiều.']] },
         { h: ['更 / 还 and comparing actions', '更 / 还 và so sánh hành động'], t: ['更 and 还 can precede the adjective to say “even more”. With verbs, repeat the verb: A 说汉语说得比 B 好 (degree complement, see Chapter 7), or put 比 before the verb phrase for amounts: 比我多买了两本.', '更 và 还 đứng trước tính từ để nói “còn … hơn nữa”. Với động từ: A 说得比 B 好 (bổ ngữ trạng thái, xem Chương 7), hoặc 比 đặt trước cụm động từ chỉ số lượng: 比我多买了两本.'],
           ex: [['北京很冷,哈尔滨比北京还冷。', 'Běijīng hěn lěng, Hā’ěrbīn bǐ Běijīng hái lěng.', 'Beijing is cold, Harbin is even colder.', 'Bắc Kinh rất lạnh, Cáp Nhĩ Tân còn lạnh hơn.'], ['他比我多买了两本书。', 'Tā bǐ wǒ duō mǎile liǎng běn shū.', 'He bought two more books than I did.', 'Anh ấy mua nhiều hơn tôi hai quyển sách.'], ['今年比去年更忙。', 'Jīnnián bǐ qùnián gèng máng.', 'This year is even busier than last year.', 'Năm nay còn bận hơn năm ngoái.']] }],
    v: [['比', 'bǐ', 'than; to compare', 'hơn; so sánh'], ['更', 'gèng', 'even more', 'càng, hơn nữa'], ['还', 'hái', 'even more (in comparison)', 'còn (hơn)'], ['一点儿', 'yìdiǎnr', 'a little', 'một chút'], ['得多', 'de duō', 'much more', 'hơn nhiều'], ['便宜', 'piányi', 'cheap', 'rẻ'], ['贵', 'guì', 'expensive', 'đắt'], ['冷', 'lěng', 'cold', 'lạnh'], ['热', 'rè', 'hot', 'nóng'], ['忙', 'máng', 'busy', 'bận']],
    d: [['A', '这件衣服比那件好看。', 'Zhè jiàn yīfu bǐ nà jiàn hǎokàn.', 'This piece looks nicer than that one.', 'Cái áo này đẹp hơn cái kia.'], ['B', '可是它比那件贵一百块。', 'Kěshì tā bǐ nà jiàn guì yì bǎi kuài.', 'But it is 100 yuan more expensive.', 'Nhưng nó đắt hơn cái kia 100 tệ.'], ['A', '没关系,质量也好得多。', 'Méi guānxi, zhìliàng yě hǎo de duō.', 'Never mind, the quality is much better too.', 'Không sao, chất lượng cũng tốt hơn nhiều.']],
    pit: ['Writing 我比他很高 (very + 比 clash). Say 我比他高 or 我比他高得多. Also using 比 with 一样 together.', 'Viết 我比他很高 (很 và 比 xung đột). Nói 我比他高 hoặc 我比他高得多. Đừng dùng 比 chung với 一样.'],
    s: [['A 比 B + adjective, no 很.', 'A 比 B + tính từ, không 很.'], ['Difference goes after the adjective.', 'Mức chênh đặt sau tính từ.'], ['更/还 = even more.', '更/还 = càng hơn.']],
    l: ['bi', 'gram', 'mdbg'],
    p: [['Say: “My phone is more expensive than yours.”', 'Nói: “Điện thoại của tôi đắt hơn của bạn.”', '我的手机比你的贵。Wǒ de shǒujī bǐ nǐ de guì.', '我的手机比你的贵。Wǒ de shǒujī bǐ nǐ de guì.'],
        ['Fix: 他比我很高。', 'Sửa: 他比我很高。', '他比我高。 (remove 很)', '他比我高。 (bỏ 很)'],
        ['Say: “She is two years younger than me.”', 'Nói: “Cô ấy nhỏ hơn tôi hai tuổi.”', '她比我小两岁。Tā bǐ wǒ xiǎo liǎng suì.', '她比我小两岁。Tā bǐ wǒ xiǎo liǎng suì.']] }),

  D(P + '2-2', '2.2 没有, 一样, 不如: equal and less', '2.2 没有, 一样, 不如: bằng nhau và kém hơn', 'A 没有 B (那么) adj, A 跟 B 一样, 有 B 那么 adj, 不如.', {
    n: '2.2',
    g: [['Say “not as … as” with 没有', 'Nói “không … bằng” với 没有'], ['Say “the same as” with 一样', 'Nói “giống / bằng” với 一样'], ['Compare in questions', 'Hỏi so sánh']],
    b: [`<p>The negative of 比 is <strong>没有</strong>: “A is not as … as B”. For equality, use <strong>跟…一样</strong>. For “reach the level of”, use <strong>有…那么/这么</strong> (often in questions).</p>`,
        `<p>Phủ định của 比 là <strong>没有</strong>: “A không … bằng B”. Nói bằng nhau dùng <strong>跟…一样</strong>. Nói “đạt tới mức” dùng <strong>有…那么/这么</strong> (hay gặp trong câu hỏi).</p>`],
    gr: [{ h: ['A 没有 B (那么) + adjective', 'A 没有 B (那么) + tính từ'], t: ['Do not add a difference amount here. 不如 is a stronger, slightly literary “is inferior to”.', 'Không thêm mức chênh ở mẫu này. 不如 mạnh hơn, hơi văn viết: “kém hơn”.'],
           ex: [['上海没有北京那么冷。', 'Shànghǎi méiyǒu Běijīng nàme lěng.', 'Shanghai is not as cold as Beijing.', 'Thượng Hải không lạnh như Bắc Kinh.'], ['我的汉语没有他的好。', 'Wǒ de Hànyǔ méiyǒu tā de hǎo.', 'My Chinese is not as good as his.', 'Tiếng Trung của tôi không giỏi bằng anh ấy.'], ['坐地铁不如骑车快。', 'Zuò dìtiě bùrú qí chē kuài.', 'The metro is not as fast as cycling.', 'Đi tàu điện không nhanh bằng đạp xe.']] },
         { h: ['A 跟 B 一样 (+ adjective)', 'A 跟 B 一样 (+ tính từ)'], t: ['Negative: 不一样. Add an adjective for the aspect compared: 一样高, 一样贵. “Is there … as …?” 有…吗?', 'Phủ định: 不一样. Thêm tính từ cho mặt đang so sánh: 一样高, 一样贵. Hỏi: 有…吗?'],
           ex: [['我的书包跟你的一样。', 'Wǒ de shūbāo gēn nǐ de yíyàng.', 'My bag is the same as yours.', 'Cặp của tôi giống cặp của bạn.'], ['他跟我一样高。', 'Tā gēn wǒ yíyàng gāo.', 'He is as tall as I am.', 'Anh ấy cao bằng tôi.'], ['你们的老师有他那么年轻吗?', 'Nǐmen de lǎoshī yǒu tā nàme niánqīng ma?', 'Is your teacher as young as he is?', 'Thầy các bạn có trẻ như anh ấy không?']] }],
    v: [['没有', 'méiyǒu', 'not as … as', 'không … bằng'], ['一样', 'yíyàng', 'same', 'giống, như nhau'], ['不如', 'bùrú', 'not as good as', 'không bằng, kém hơn'], ['那么', 'nàme', 'so, that (degree)', 'như thế (mức độ)'], ['这么', 'zhème', 'so, this (degree)', 'như thế này'], ['跟', 'gēn', 'with, as (compare)', 'với, như'], ['年轻', 'niánqīng', 'young', 'trẻ'], ['质量', 'zhìliàng', 'quality', 'chất lượng'], ['相同', 'xiāngtóng', 'identical', 'giống hệt'], ['差不多', 'chàbuduō', 'almost the same', 'gần như nhau']],
    d: [['A', '你的手机跟我的一样吗?', 'Nǐ de shǒujī gēn wǒ de yíyàng ma?', 'Is your phone the same as mine?', 'Điện thoại của bạn giống của tôi không?'], ['B', '不一样,我的没有你的那么新。', 'Bù yíyàng, wǒ de méiyǒu nǐ de nàme xīn.', 'No, mine is not as new as yours.', 'Không, của tôi không mới như của bạn.'], ['A', '可是用起来差不多。', 'Kěshì yòng qǐlái chàbuduō.', 'But using them is about the same.', 'Nhưng dùng thì gần như nhau.']],
    pit: ['Adding 很 or a number after 没有 (没有他很高), and mixing 一样 with 比 (比他一样高). Pick one pattern.', 'Thêm 很 hoặc con số sau 没有 (没有他很高), và trộn 一样 với 比 (比他一样高). Chỉ chọn một mẫu.'],
    s: [['没有 = negative of 比.', '没有 = phủ định của 比.'], ['A 跟 B 一样 (+ adj) = equal.', 'A 跟 B 一样 (+ tính từ) = bằng nhau.'], ['不如 = inferior to.', '不如 = kém hơn.']],
    l: ['meiyou', 'yiyang', 'bijiao'],
    p: [['Say: “I am not as tall as my brother.”', 'Nói: “Tôi không cao bằng anh trai.”', '我没有我哥哥高。Wǒ méiyǒu wǒ gēge gāo.', '我没有我哥哥高。Wǒ méiyǒu wǒ gēge gāo.'],
        ['Say: “This bag is the same as that one.”', 'Nói: “Cái cặp này giống cái kia.”', '这个书包跟那个一样。Zhège shūbāo gēn nàge yíyàng.', '这个书包跟那个一样。Zhège shūbāo gēn nàge yíyàng.']] }),

  D(P + '2-3', '2.3 越来越, 越…越…, 最 and 比较', '2.3 越来越, 越…越…, 最 và 比较', 'Biến đổi theo thời gian, quan hệ tỉ lệ, cao nhất, tương đối.', {
    n: '2.3',
    g: [['Say “more and more” with 越来越', 'Nói “càng ngày càng” với 越来越'], ['Link two changes with 越…越…', 'Nối hai thay đổi bằng 越…越…'], ['Use 最 and 比较 for degree', 'Dùng 最 và 比较 cho mức độ']],
    b: [`<p>Three more degree patterns finish the comparison toolbox. <strong>越来越 + adjective</strong> = changing over time. <strong>越 A 越 B</strong> = the more A, the more B. <strong>最</strong> = the most; <strong>比较</strong> = fairly, relatively.</p>`,
        `<p>Ba mẫu mức độ nữa hoàn tất bộ công cụ so sánh. <strong>越来越 + tính từ</strong> = thay đổi theo thời gian. <strong>越 A 越 B</strong> = càng A càng B. <strong>最</strong> = nhất; <strong>比较</strong> = khá, tương đối.</p>`],
    gr: [{ h: ['越来越 and 越…越…', '越来越 và 越…越…'], t: ['越来越 needs no subject-comparison. In 越…越…, the two clauses often share a subject; 越 stays before the verbs/adjectives.', '越来越 không cần đối tượng so sánh. Trong 越…越…, hai vế thường chung chủ ngữ; 越 đứng trước động từ/tính từ.'],
           ex: [['天气越来越冷了。', 'Tiānqì yuè lái yuè lěng le.', 'The weather is getting colder and colder.', 'Thời tiết càng ngày càng lạnh.'], ['他的汉语越说越好。', 'Tā de Hànyǔ yuè shuō yuè hǎo.', 'The more he speaks, the better his Chinese gets.', 'Tiếng Trung của anh ấy càng nói càng tốt.'], ['雨越下越大。', 'Yǔ yuè xià yuè dà.', 'The rain falls harder and harder.', 'Mưa càng rơi càng to.']] },
         { h: ['最 and 比较', '最 và 比较'], t: ['最 + adjective/verb for the top of a group; 比较 softens a claim.', '最 + tính từ/động từ chỉ mức cao nhất trong nhóm; 比较 làm nhẹ lời khẳng định.'],
           ex: [['我们班他的汉语最好。', 'Wǒmen bān tā de Hànyǔ zuì hǎo.', 'His Chinese is the best in our class.', 'Trong lớp tiếng Trung của anh ấy giỏi nhất.'], ['这里的夏天比较热。', 'Zhèlǐ de xiàtiān bǐjiào rè.', 'Summers here are fairly hot.', 'Mùa hè ở đây khá nóng.'], ['我最喜欢吃面条。', 'Wǒ zuì xǐhuan chī miàntiáo.', 'I like noodles most.', 'Tôi thích ăn mì nhất.']] }],
    v: [['越来越', 'yuè lái yuè', 'more and more', 'càng ngày càng'], ['越', 'yuè', 'the more', 'càng'], ['最', 'zuì', 'most', 'nhất'], ['比较', 'bǐjiào', 'fairly, relatively', 'khá, tương đối'], ['变', 'biàn', 'to become', 'trở nên'], ['长', 'zhǎng', 'to grow', 'lớn lên, mọc'], ['瘦', 'shòu', 'thin', 'gầy'], ['舒服', 'shūfu', 'comfortable', 'thoải mái'], ['习惯', 'xíguàn', 'to be used to', 'quen'], ['城市', 'chéngshì', 'city', 'thành phố']],
    d: [['A', '你来这儿一年了,习惯了吗?', 'Nǐ lái zhèr yì nián le, xíguàn le ma?', 'You have been here a year; used to it?', 'Bạn đến đây một năm rồi, quen chưa?'], ['B', '习惯了,我越来越喜欢这个城市。', 'Xíguàn le, wǒ yuè lái yuè xǐhuan zhège chéngshì.', 'Yes, I like this city more and more.', 'Quen rồi, tôi càng ngày càng thích thành phố này.'], ['A', '汉语呢?', 'Hànyǔ ne?', 'And your Chinese?', 'Còn tiếng Trung?'], ['B', '越说越有意思。', 'Yuè shuō yuè yǒu yìsi.', 'The more I speak the more fun it is.', 'Càng nói càng thú vị.']],
    pit: ['Putting 很 before 越来越 or 了 inside it. Correct: 越来越好 (了 at the end). Also 最 + 很 is wrong.', 'Đặt 很 trước 越来越 hoặc chen 了 vào giữa. Đúng: 越来越好 (了 ở cuối câu). Cũng sai khi nói 最 + 很.'],
    s: [['越来越 + adj = changes over time.', '越来越 + tính từ = đổi theo thời gian.'], ['越A越B = proportional.', '越A越B = tỉ lệ thuận.'], ['最 = top; 比较 = fairly.', '最 = nhất; 比较 = khá.']],
    l: ['yue', 'bijiao', 'gram'],
    p: [['Say: “My Chinese is getting better and better.”', 'Nói: “Tiếng Trung của tôi càng ngày càng tốt.”', '我的汉语越来越好。Wǒ de Hànyǔ yuè lái yuè hǎo.', '我的汉语越来越好。Wǒ de Hànyǔ yuè lái yuè hǎo.'],
        ['Say: “The more I eat, the more I want to eat.”', 'Nói: “Càng ăn càng muốn ăn.”', '我越吃越想吃。Wǒ yuè chī yuè xiǎng chī.', '我越吃越想吃。Wǒ yuè chī yuè xiǎng chī.']] }),

  Q(P + 'quiz-2', 'Chapter 2 quiz', 'Quiz chương 2', [
    [['Which is correct?', 'Câu nào đúng?'], ['我比他很高。', '我比他高。', '我比他高很。', '我比很他高。'], 1, ['No 很 with 比.', 'Không dùng 很 với 比.']],
    [['“Three years older than me”:', '“Lớn hơn tôi ba tuổi”:'], ['比我大三岁', '比我三岁大', '大比我三岁', '比三岁我大'], 0, ['Difference follows the adjective.', 'Mức chênh đứng sau tính từ.']],
    [['Negative of A 比 B 高:', 'Phủ định của A 比 B 高:'], ['A 不一样 B 高', 'A 没有 B 高', 'A 比 B 没高', 'A 没比有 B 高'], 1, ['没有 negates 比.', '没有 phủ định 比.']],
    [['“The same as” is:', '“Giống như” là:'], ['跟…一样', '比…一样', '有…一样', '越…一样'], 0, ['跟…一样.', '跟…一样.']],
    [['“Getting hotter and hotter”:', '“Càng ngày càng nóng”:'], ['越来越热', '越热越来', '最热来', '比热越'], 0, ['越来越 + adj.', '越来越 + tính từ.']],
    [['“The more he practises, the better”:', '“Càng luyện càng tốt”:'], ['他越练越好。', '他练越好越。', '他越练好越。', '他很练越好。'], 0, ['越 A 越 B.', '越 A 越 B.']],
    [['Which means “fairly, relatively”?', 'Từ nào là “khá, tương đối”?'], ['最', '更', '比较', '一样'], 2, ['比较.', '比较.']],
    [['“Much cheaper than that shop”:', '“Rẻ hơn tiệm kia nhiều”:'], ['比那家便宜得多', '比那家得多便宜', '那家比便宜多得', '比那家多便宜得'], 0, ['adj + 得多.', 'tính từ + 得多.']],
  ]),
]));
// ===== Chương 3 =====
secs.push(SEC('Chapter 3 — Health, weather and seasons', 'Chương 3 — Sức khoẻ, thời tiết và bốn mùa',
  'Triệu chứng, khám bệnh, lời khuyên, thời tiết, 要…了, 快…了.', [
  D(P + '3-1', '3.1 Body and symptoms', '3.1 Cơ thể và triệu chứng', 'Từ vựng cơ thể, triệu chứng; mẫu 哪儿不舒服, 有点儿 vs 一点儿.', {
    n: '3.1',
    g: [['Name body parts and common illnesses', 'Gọi tên bộ phận cơ thể và bệnh thường gặp'], ['Describe symptoms with 疼, 发烧, 咳嗽', 'Mô tả triệu chứng với 疼, 发烧, 咳嗽'], ['Tell 有点儿 from 一点儿', 'Phân biệt 有点儿 và 一点儿']],
    b: [`<p>Symptoms are usually described as <strong>body part + 疼</strong> (hurts) or with the verb <strong>发</strong>/<strong>有</strong>: 发烧 (have a fever), 咳嗽 (cough). To say “I feel unwell” use <strong>不舒服</strong>. Notice two lookalikes: <strong>有点儿 + adjective</strong> (a bit too …, usually negative feeling) and <strong>adjective + 一点儿</strong> (a little more, a request or comparison).</p>`,
        `<p>Triệu chứng thường nói bằng <strong>bộ phận + 疼</strong> (đau) hoặc động từ <strong>发</strong>/<strong>有</strong>: 发烧 (bị sốt), 咳嗽 (ho). Nói “tôi thấy không khoẻ” dùng <strong>不舒服</strong>. Chú ý hai mẫu dễ lẫn: <strong>有点儿 + tính từ</strong> (hơi quá …, thường mang ý tiêu cực) và <strong>tính từ + 一点儿</strong> (thêm chút nữa, dùng khi nhờ vả hoặc so sánh).</p>`],
    gr: [{ h: ['Symptoms', 'Triệu chứng'], t: ['Pattern: subject + body part + 疼, or 我 + 发烧/咳嗽/感冒了. Duration with 了: 咳嗽了三天了.', 'Mẫu: chủ ngữ + bộ phận + 疼, hoặc 我 + 发烧/咳嗽/感冒了. Thời lượng với 了: 咳嗽了三天了.'],
           ex: [['我头疼,还有点儿发烧。', 'Wǒ tóu téng, hái yǒudiǎnr fāshāo.', 'I have a headache and a slight fever.', 'Tôi đau đầu, còn hơi sốt.'], ['他感冒了,一直咳嗽。', 'Tā gǎnmào le, yìzhí késou.', 'He has a cold and keeps coughing.', 'Anh ấy bị cảm, ho suốt.'], ['我嗓子很疼,不能说话。', 'Wǒ sǎngzi hěn téng, bù néng shuōhuà.', 'My throat hurts, I cannot talk.', 'Họng tôi rất đau, không nói được.']] },
         { h: ['有点儿 vs 一点儿', '有点儿 vs 一点儿'], t: ['有点儿 comes before an adjective/verb and expresses mild dissatisfaction. 一点儿 comes after an adjective in a request or comparison.', '有点儿 đứng trước tính từ/động từ, diễn tả chút không hài lòng. 一点儿 đứng sau tính từ trong câu nhờ hoặc so sánh.'],
           ex: [['今天有点儿冷。', 'Jīntiān yǒudiǎnr lěng.', 'It is a bit cold today (I dislike it).', 'Hôm nay hơi lạnh (tôi không thích).'], ['请说慢一点儿。', 'Qǐng shuō màn yìdiǎnr.', 'Please speak a little slower.', 'Xin nói chậm một chút.'], ['我的头有点儿晕。', 'Wǒ de tóu yǒudiǎnr yūn.', 'I feel a little dizzy.', 'Đầu tôi hơi choáng.']] }],
    v: [['头', 'tóu', 'head', 'đầu'], ['肚子', 'dùzi', 'belly, stomach', 'bụng'], ['嗓子', 'sǎngzi', 'throat', 'cổ họng'], ['眼睛', 'yǎnjing', 'eye', 'mắt'], ['疼', 'téng', 'to hurt', 'đau'], ['发烧', 'fāshāo', 'to have a fever', 'sốt'], ['咳嗽', 'késou', 'to cough', 'ho'], ['感冒', 'gǎnmào', 'cold; to catch a cold', 'cảm; bị cảm'], ['不舒服', 'bù shūfu', 'unwell', 'không khoẻ'], ['药', 'yào', 'medicine', 'thuốc']],
    d: [['A', '你怎么了?脸色不太好。', 'Nǐ zěnme le? Liǎnsè bú tài hǎo.', 'What is wrong? You look pale.', 'Bạn sao vậy? Sắc mặt không tốt.'], ['B', '我昨天晚上开始肚子疼。', 'Wǒ zuótiān wǎnshang kāishǐ dùzi téng.', 'My stomach has hurt since last night.', 'Từ tối qua tôi bắt đầu đau bụng.'], ['A', '还有别的不舒服吗?', 'Hái yǒu bié de bù shūfu ma?', 'Anything else?', 'Còn chỗ nào khó chịu nữa không?'], ['B', '有点儿发烧,也有点儿想吐。', 'Yǒudiǎnr fāshāo, yě yǒudiǎnr xiǎng tù.', 'A slight fever and a little nausea.', 'Hơi sốt, cũng hơi buồn nôn.']],
    pit: ['Using 一点儿 before adjectives (一点儿冷 is wrong; say 有点儿冷). Also saying 我是头疼 with 是.', 'Dùng 一点儿 trước tính từ (一点儿冷 là sai; nói 有点儿冷). Cũng sai khi nói 我是头疼 có 是.'],
    s: [['Body part + 疼 for pain.', 'Bộ phận + 疼 để nói đau.'], ['发烧, 咳嗽, 感冒 are the core symptom words.', '发烧, 咳嗽, 感冒 là từ triệu chứng cốt lõi.'], ['有点儿 + adj; adj + 一点儿.', '有点儿 + tính từ; tính từ + 一点儿.']],
    l: ['health', 'tcm', 'mdbg'],
    p: [['Say: “I have a headache and a cough.”', 'Nói: “Tôi đau đầu và ho.”', '我头疼,还咳嗽。Wǒ tóu téng, hái késou.', '我头疼,还咳嗽。Wǒ tóu téng, hái késou.'],
        ['Choose 有点儿 or 一点儿: 今天___热。', 'Chọn 有点儿 hay 一点儿: 今天___热。', '有点儿 (before the adjective).', '有点儿 (đứng trước tính từ).']] }),

  D(P + '3-2', '3.2 At the doctor: advice and instructions', '3.2 Đi khám: lời khuyên và dặn dò', 'Hội thoại bác sĩ; 应该, 最好, 别, 一天三次; 才 và 就.', {
    n: '3.2',
    g: [['Handle a clinic visit', 'Xử lý một buổi khám bệnh'], ['Give advice with 应该, 最好, 别', 'Đưa lời khuyên với 应该, 最好, 别'], ['Read a prescription line', 'Đọc dòng dặn dùng thuốc']],
    b: [`<p>A Chinese hospital visit follows a sequence: register (<strong>挂号</strong>), see the doctor, pay, get medicine. The doctor gives advice with <strong>应该</strong> (should), <strong>最好</strong> (had better) and <strong>别</strong> (do not). Dosage uses “一天 + 三次, 一次 + 两片”.</p>`,
        `<p>Đi bệnh viện ở Trung Quốc theo trình tự: đăng ký (<strong>挂号</strong>), gặp bác sĩ, thanh toán, lấy thuốc. Bác sĩ khuyên bằng <strong>应该</strong> (nên), <strong>最好</strong> (tốt nhất là) và <strong>别</strong> (đừng). Liều dùng theo mẫu “一天 + 三次, 一次 + 两片”.</p>`],
    gr: [{ h: ['Advice patterns', 'Mẫu lời khuyên'], t: ['应该 + V (should), 最好 + V (had better), 别 + V (do not), 要 + V (must, strong). Add 多 + V for “do more of”: 多喝水.', '应该 + V (nên), 最好 + V (tốt nhất là), 别 + V (đừng), 要 + V (phải, mạnh). Thêm 多 + V để “làm nhiều hơn”: 多喝水.'],
           ex: [['你应该多休息。', 'Nǐ yīnggāi duō xiūxi.', 'You should rest more.', 'Bạn nên nghỉ ngơi nhiều hơn.'], ['最好别吃太辣的东西。', 'Zuìhǎo bié chī tài là de dōngxi.', 'Better not eat anything too spicy.', 'Tốt nhất đừng ăn đồ quá cay.'], ['多喝水,少吃油腻的。', 'Duō hē shuǐ, shǎo chī yóunì de.', 'Drink more water, eat less greasy food.', 'Uống nhiều nước, ăn ít đồ dầu mỡ.']] },
         { h: ['Dosage and timing: 才 and 就', 'Liều dùng và thời gian: 才 và 就'], t: ['一天三次 = three times a day; 饭后 = after meals. 就 means early/quick, 才 means late/slow: 三天就好了 vs 三天才好.', '一天三次 = ba lần một ngày; 饭后 = sau bữa ăn. 就 chỉ sớm/nhanh, 才 chỉ muộn/chậm: 三天就好了 và 三天才好.'],
           ex: [['这种药一天三次,一次两片。', 'Zhè zhǒng yào yì tiān sān cì, yí cì liǎng piàn.', 'Take this medicine three times a day, two tablets each.', 'Thuốc này ngày ba lần, mỗi lần hai viên.'], ['饭后半小时吃药。', 'Fàn hòu bàn xiǎoshí chī yào.', 'Take it half an hour after meals.', 'Uống thuốc sau bữa ăn nửa tiếng.'], ['吃了药,两天就好了。', 'Chīle yào, liǎng tiān jiù hǎo le.', 'After the medicine you will be well in two days.', 'Uống thuốc, hai ngày là khỏi.']] }],
    v: [['挂号', 'guàhào', 'to register (hospital)', 'đăng ký khám'], ['医生', 'yīshēng', 'doctor', 'bác sĩ'], ['医院', 'yīyuàn', 'hospital', 'bệnh viện'], ['检查', 'jiǎnchá', 'examine, check', 'kiểm tra'], ['应该', 'yīnggāi', 'should', 'nên'], ['最好', 'zuìhǎo', 'had better', 'tốt nhất là'], ['休息', 'xiūxi', 'to rest', 'nghỉ ngơi'], ['注意', 'zhùyì', 'to pay attention', 'chú ý'], ['片', 'piàn', 'tablet; slice', 'viên; lát'], ['饭后', 'fàn hòu', 'after meals', 'sau bữa ăn']],
    d: [['医生', '你哪儿不舒服?', 'Nǐ nǎr bù shūfu?', 'Where does it hurt?', 'Bạn khó chịu ở đâu?'], ['病人', '我咳嗽了三天了,还发烧。', 'Wǒ késoule sān tiān le, hái fāshāo.', 'I have coughed for three days, and have a fever.', 'Tôi ho ba ngày rồi, còn sốt.'], ['医生', '先量一下体温。你感冒了。', 'Xiān liáng yíxià tǐwēn. Nǐ gǎnmào le.', 'Let me take your temperature. You have a cold.', 'Đo thân nhiệt trước. Bạn bị cảm.'], ['医生', '一天三次,饭后吃药。多喝水,别喝冷的。', 'Yì tiān sān cì, fàn hòu chī yào. Duō hē shuǐ, bié hē lěng de.', 'Three times a day after meals. Drink water, avoid cold drinks.', 'Ngày ba lần, sau ăn. Uống nhiều nước, đừng uống đồ lạnh.']],
    pit: ['Confusing 应该 (advice) with 会 (will, likelihood); and using 别 for yourself in statements (别 is a command: 我别去 is odd).', 'Lẫn 应该 (lời khuyên) với 会 (sẽ, khả năng); và dùng 别 cho chính mình trong câu kể (别 là câu cấm: 我别去 nghe lạ).'],
    s: [['Visit order: 挂号 → doctor → pay → medicine.', 'Thứ tự khám: 挂号 → bác sĩ → thanh toán → thuốc.'], ['应该 / 最好 / 别 give advice.', '应该 / 最好 / 别 để khuyên.'], ['就 = soon, 才 = only after a long time.', '就 = sớm, 才 = mãi mới.']],
    l: ['bie', 'cai', 'acu'],
    p: [['Say: “You had better not drink coffee.”', 'Nói: “Bạn tốt nhất đừng uống cà phê.”', '你最好别喝咖啡。Nǐ zuìhǎo bié hē kāfēi.', '你最好别喝咖啡。Nǐ zuìhǎo bié hē kāfēi.'],
        ['Read: 一天两次,一次一片。', 'Đọc nghĩa: 一天两次,一次一片。', 'Twice a day, one tablet each time.', 'Ngày hai lần, mỗi lần một viên.']] }),

  D(P + '3-3', '3.3 Weather, seasons and 要…了', '3.3 Thời tiết, bốn mùa và 要…了', 'Từ vựng thời tiết, bốn mùa, dự báo, 要/快/就要…了 sắp xảy ra.', {
    n: '3.3',
    g: [['Describe the weather and temperature', 'Mô tả thời tiết và nhiệt độ'], ['Talk about the four seasons', 'Nói về bốn mùa'], ['Say something is about to happen with 要…了', 'Nói việc sắp xảy ra với 要…了']],
    b: [`<p>Weather verbs in Chinese are often plain: 下雨 (fall rain), 刮风 (blow wind), 下雪 (fall snow). Temperature: 今天二十五度. For something about to happen use <strong>要…了, 快要…了, 就要…了</strong>. With a time word, only 就要 works.</p>`,
        `<p>Động từ thời tiết trong tiếng Trung khá đơn giản: 下雨 (mưa rơi), 刮风 (gió thổi), 下雪 (tuyết rơi). Nhiệt độ: 今天二十五度. Việc sắp xảy ra dùng <strong>要…了, 快要…了, 就要…了</strong>. Khi có từ chỉ thời điểm, chỉ dùng được 就要.</p>`],
    gr: [{ h: ['Weather and seasons', 'Thời tiết và mùa'], t: ['Ask: 今天天气怎么样? Seasons: 春 chūn, 夏 xià, 秋 qiū, 冬 dōng + 天. Most of China’s north has cold, dry winters; the south is humid.', 'Hỏi: 今天天气怎么样? Các mùa: 春 chūn, 夏 xià, 秋 qiū, 冬 dōng + 天. Miền bắc Trung Quốc đông lạnh khô; miền nam ẩm.'],
           ex: [['明天会下雨,气温十八度。', 'Míngtiān huì xià yǔ, qìwēn shíbā dù.', 'Tomorrow it will rain, 18 degrees.', 'Ngày mai sẽ mưa, nhiệt độ 18 độ.'], ['北方的冬天又冷又干。', 'Běifāng de dōngtiān yòu lěng yòu gān.', 'Winter in the north is cold and dry.', 'Mùa đông miền bắc vừa lạnh vừa khô.'], ['秋天不冷不热,最舒服。', 'Qiūtiān bù lěng bú rè, zuì shūfu.', 'Autumn is neither cold nor hot, most comfortable.', 'Mùa thu không lạnh không nóng, dễ chịu nhất.']] },
         { h: ['要…了 (about to happen)', '要…了 (sắp xảy ra)'], t: ['要/快要/就要 + V + 了. 就要…了 can take a time word: 明天就要放假了. 快…了 cannot.', '要/快要/就要 + V + 了. 就要…了 đi được với từ thời điểm: 明天就要放假了. 快…了 thì không.'],
           ex: [['要下雨了,快回家吧。', 'Yào xià yǔ le, kuài huí jiā ba.', 'It is about to rain, go home quickly.', 'Sắp mưa rồi, mau về nhà đi.'], ['春天快要到了。', 'Chūntiān kuàiyào dào le.', 'Spring is almost here.', 'Mùa xuân sắp đến rồi.'], ['下个星期我们就要考试了。', 'Xià ge xīngqī wǒmen jiùyào kǎoshì le.', 'Next week we will have the exam.', 'Tuần sau chúng ta sắp thi.']] }],
    v: [['天气', 'tiānqì', 'weather', 'thời tiết'], ['下雨', 'xià yǔ', 'to rain', 'mưa'], ['刮风', 'guā fēng', 'windy', 'có gió'], ['下雪', 'xià xuě', 'to snow', 'có tuyết'], ['气温', 'qìwēn', 'air temperature', 'nhiệt độ không khí'], ['度', 'dù', 'degree', 'độ'], ['春天', 'chūntiān', 'spring', 'mùa xuân'], ['夏天', 'xiàtiān', 'summer', 'mùa hè'], ['秋天', 'qiūtiān', 'autumn', 'mùa thu'], ['冬天', 'dōngtiān', 'winter', 'mùa đông']],
    d: [['A', '你看天气预报了吗?明天怎么样?', 'Nǐ kàn tiānqì yùbào le ma? Míngtiān zěnmeyàng?', 'Did you see the forecast? Tomorrow?', 'Bạn xem dự báo chưa? Ngày mai thế nào?'], ['B', '要下大雨,还刮风。', 'Yào xià dà yǔ, hái guā fēng.', 'Heavy rain and wind.', 'Sẽ mưa to, còn có gió.'], ['A', '那我们的旅游怎么办?', 'Nà wǒmen de lǚyóu zěnme bàn?', 'Then what about our trip?', 'Vậy chuyến du lịch của ta tính sao?'], ['B', '改到后天吧,后天就晴天了。', 'Gǎi dào hòutiān ba, hòutiān jiù qíngtiān le.', 'Move it to the day after tomorrow; it will be sunny.', 'Dời sang ngày kia, ngày kia là nắng rồi.']],
    pit: ['Using 快…了 with a specific time (快明天了 is wrong; use 明天就要…了). And saying 下了雨 for “it is raining” (use 下雨呢 or 在下雨).', 'Dùng 快…了 với thời điểm cụ thể (快明天了 sai; dùng 明天就要…了). Và nói 下了雨 để chỉ “đang mưa” (dùng 下雨呢 hoặc 在下雨).'],
    s: [['下雨, 刮风, 下雪 are verb-object weather words.', '下雨, 刮风, 下雪 là cụm động-tân chỉ thời tiết.'], ['Four seasons + 天.', 'Bốn mùa + 天.'], ['要/快要/就要…了 = about to.', '要/快要/就要…了 = sắp.']],
    l: ['clim', 'about', 'cal'],
    p: [['Say: “The summer is about to come.”', 'Nói: “Mùa hè sắp đến rồi.”', '夏天快要到了。Xiàtiān kuàiyào dào le.', '夏天快要到了。Xiàtiān kuàiyào dào le.'],
        ['Say: “It will snow tomorrow.”', 'Nói: “Ngày mai sẽ có tuyết.”', '明天会下雪。Míngtiān huì xià xuě.', '明天会下雪。Míngtiān huì xià xuě.']] }),

  Q(P + 'quiz-3', 'Chapter 3 quiz', 'Quiz chương 3', [
    [['“I have a headache.”', '“Tôi đau đầu.”'], ['我头疼。', '我疼头。', '我是头疼。', '我头疼了过。'], 0, ['Body part + 疼.', 'Bộ phận + 疼.']],
    [['“A bit cold” (complaining):', '“Hơi lạnh” (phàn nàn):'], ['一点儿冷', '有点儿冷', '冷有点儿', '冷一点儿了'], 1, ['有点儿 before adjective.', '有点儿 trước tính từ.']],
    [['“Please speak a little slower”:', '“Xin nói chậm một chút”:'], ['请说有点儿慢', '请说慢一点儿', '请有点儿说慢', '请慢说一点'], 1, ['adj + 一点儿 for requests.', 'tính từ + 一点儿 khi nhờ.']],
    [['“You should rest more”:', '“Bạn nên nghỉ ngơi nhiều hơn”:'], ['你应该多休息。', '你多应该休息。', '你应该休息多。', '你休息应该多。'], 0, ['应该 + 多 + V.', '应该 + 多 + V.']],
    [['Which is “three times a day”?', 'Câu nào là “ba lần một ngày”?'], ['三天一次', '一天三次', '一次三天', '三次一天'], 1, ['一天三次.', '一天三次.']],
    [['“It is about to rain”:', '“Sắp mưa rồi”:'], ['要下雨了', '下雨要了', '要了下雨', '下了要雨'], 0, ['要 + V + 了.', '要 + V + 了.']],
    [['Which can take a time word: “Tomorrow it is about to …”?', 'Mẫu nào đi với từ thời điểm?'], ['快…了', '就要…了', '快要…了', '都不行'], 1, ['Only 就要 allows a time word.', 'Chỉ 就要 đi được với từ thời điểm.']],
    [['Autumn in Chinese is:', 'Mùa thu tiếng Trung là:'], ['春天', '夏天', '秋天', '冬天'], 2, ['秋天.', '秋天.']],
  ]),
]));
// ===== Chương 4 =====
secs.push(SEC('Chapter 4 — Work, study and plans', 'Chương 4 — Công việc, học tập và kế hoạch',
  'Nghề nghiệp, phỏng vấn, câu liên động, kế hoạch tương lai, trình tự hành động.', [
  D(P + '4-1', '4.1 Jobs, workplace and interviews', '4.1 Nghề nghiệp, nơi làm việc và phỏng vấn', 'Từ vựng việc làm, giới thiệu bản thân, 是…的 nhấn mạnh.', {
    n: '4.1',
    g: [['Name common jobs and workplace words', 'Gọi tên nghề và từ nơi làm việc'], ['Introduce your experience in an interview', 'Giới thiệu kinh nghiệm khi phỏng vấn'], ['Use 是…的 to stress time, place, manner', 'Dùng 是…的 nhấn mạnh thời gian, nơi chốn, cách thức']],
    b: [`<p>At HSK 3 level you should be able to say where you work, what you do, how long, and what you studied. A useful structure is <strong>是…的</strong>: when an action is already in the past and you want to stress <em>when, where, how or with whom</em> it happened, put 是 before that detail and 的 at the end.</p>`,
        `<p>Ở mức HSK 3 bạn cần nói được mình làm ở đâu, làm gì, bao lâu, học ngành gì. Một cấu trúc rất hữu ích là <strong>是…的</strong>: khi hành động đã xảy ra và bạn muốn nhấn mạnh <em>lúc nào, ở đâu, bằng cách nào, với ai</em>, đặt 是 trước chi tiết đó và 的 ở cuối câu.</p>`],
    gr: [{ h: ['是…的 (stress a detail of a past event)', '是…的 (nhấn một chi tiết của việc đã xảy ra)'], t: ['The event itself is already known; the question is about its circumstances. 是 can be dropped in positive sentences; keep 不是…的 in negatives.', 'Sự việc đã được biết; câu hỏi nhắm vào hoàn cảnh. 是 có thể lược trong câu khẳng định; câu phủ định giữ 不是…的.'],
           ex: [['你是什么时候来的?', 'Nǐ shì shénme shíhou lái de?', 'When did you come?', 'Bạn đến lúc nào vậy?'], ['我是坐飞机来的。', 'Wǒ shì zuò fēijī lái de.', 'I came by plane.', 'Tôi đến bằng máy bay.'], ['他不是在北京学的汉语。', 'Tā bú shì zài Běijīng xué de Hànyǔ.', 'He did not learn Chinese in Beijing.', 'Anh ấy không học tiếng Trung ở Bắc Kinh.']] },
         { h: ['Talking about work', 'Nói về công việc'], t: ['Pattern: 在 + company + 工作; 做 + job; 当 + position. Years: 工作了三年.', 'Mẫu: 在 + công ty + 工作; 做 + nghề; 当 + chức vụ. Số năm: 工作了三年.'],
           ex: [['我在一家软件公司工作。', 'Wǒ zài yì jiā ruǎnjiàn gōngsī gōngzuò.', 'I work at a software company.', 'Tôi làm ở một công ty phần mềm.'], ['她想应聘经理助理。', 'Tā xiǎng yìngpìn jīnglǐ zhùlǐ.', 'She wants to apply for manager’s assistant.', 'Cô ấy muốn ứng tuyển trợ lý giám đốc.'], ['我已经有两年的工作经验了。', 'Wǒ yǐjīng yǒu liǎng nián de gōngzuò jīngyàn le.', 'I already have two years of experience.', 'Tôi đã có hai năm kinh nghiệm làm việc.']] }],
    v: [['公司', 'gōngsī', 'company', 'công ty'], ['工作', 'gōngzuò', 'job; to work', 'công việc; làm việc'], ['经理', 'jīnglǐ', 'manager', 'giám đốc, quản lý'], ['职员', 'zhíyuán', 'staff member', 'nhân viên'], ['面试', 'miànshì', 'interview', 'phỏng vấn'], ['应聘', 'yìngpìn', 'to apply for a job', 'ứng tuyển'], ['简历', 'jiǎnlì', 'résumé', 'sơ yếu lý lịch, CV'], ['经验', 'jīngyàn', 'experience', 'kinh nghiệm'], ['工资', 'gōngzī', 'salary', 'tiền lương'], ['专业', 'zhuānyè', 'major', 'chuyên ngành']],
    d: [['经理', '请先介绍一下你自己。', 'Qǐng xiān jièshào yíxià nǐ zìjǐ.', 'Please introduce yourself first.', 'Mời bạn giới thiệu bản thân trước.'], ['小王', '我叫王明,是越南河内人,大学学的是汉语专业。', 'Wǒ jiào Wáng Míng, shì Yuènán Hénèi rén, dàxué xué de shì Hànyǔ zhuānyè.', 'I am Wang Ming from Hanoi; I majored in Chinese.', 'Tôi là Vương Minh, người Hà Nội, học đại học chuyên ngành tiếng Trung.'], ['经理', '你有工作经验吗?', 'Nǐ yǒu gōngzuò jīngyàn ma?', 'Do you have work experience?', 'Bạn có kinh nghiệm làm việc không?'], ['小王', '有,我在一家公司做过一年翻译。', 'Yǒu, wǒ zài yì jiā gōngsī zuòguo yì nián fānyì.', 'Yes, I worked a year as a translator at a company.', 'Có, tôi từng làm phiên dịch một năm ở một công ty.']],
    pit: ['Using 是…的 for future events (it is for known past events), and putting 的 before the object in some patterns: with an object, 的 may come before it (我是昨天买的书) or at the end.', 'Dùng 是…的 cho việc tương lai (nó dành cho việc đã xảy ra); và đặt 的 sai vị trí khi có tân ngữ: 的 có thể đứng trước tân ngữ (我是昨天买的书) hoặc cuối câu.'],
    s: [['是…的 stresses when/where/how of a past action.', '是…的 nhấn mạnh lúc nào/ở đâu/thế nào của hành động đã xảy ra.'], ['在…工作, 做…, 应聘 are core job verbs.', '在…工作, 做…, 应聘 là động từ nghề nghiệp chính.'], ['Years of experience: 有…年的经验.', 'Số năm kinh nghiệm: 有…年的经验.']],
    l: ['gram', 'hsk3', 'mdbg'],
    p: [['Ask: “How did you come here?” (是…的)', 'Hỏi: “Bạn đến đây bằng cách nào?” (是…的)', '你是怎么来的? Nǐ shì zěnme lái de?', '你是怎么来的? Nǐ shì zěnme lái de?'],
        ['Say: “I work in a bank.”', 'Nói: “Tôi làm ở ngân hàng.”', '我在银行工作。Wǒ zài yínháng gōngzuò.', '我在银行工作。Wǒ zài yínháng gōngzuò.']] }),

  D(P + '4-2', '4.2 Serial-verb sentences', '4.2 Câu liên động', 'Hai động từ liền nhau: 去…买, 坐…去, 用…写, 有…可以; thứ tự theo hành động.', {
    n: '4.2',
    g: [['Chain two verbs under one subject', 'Nối hai động từ dưới một chủ ngữ'], ['Express purpose and means', 'Diễn đạt mục đích và phương tiện'], ['Get the verb order right', 'Đặt đúng thứ tự động từ']],
    b: [`<p>A <strong>serial-verb sentence</strong> has one subject and two or more verbs in <em>time order</em> with no connecting word. Three common types: (1) <strong>去/来 + V</strong> for purpose, (2) <strong>by means of</strong>: 坐/骑/用 + N + V, (3) <strong>有 + N + V</strong> (have something to do).</p>`,
        `<p><strong>Câu liên động</strong> có một chủ ngữ và hai hay nhiều động từ xếp theo <em>thứ tự thời gian</em>, không có liên từ. Ba kiểu hay gặp: (1) <strong>去/来 + V</strong> chỉ mục đích, (2) <strong>phương tiện</strong>: 坐/骑/用 + N + V, (3) <strong>有 + N + V</strong> (có việc để làm).</p>`],
    gr: [{ h: ['Purpose and means', 'Mục đích và phương tiện'], t: ['Order follows reality: you take the bus first, then go; you go first, then shop. 了 attaches to the last verb.', 'Thứ tự theo thực tế: lên xe buýt trước rồi mới đi; đi trước rồi mới mua. 了 gắn vào động từ cuối.'],
           ex: [['我去超市买东西。', 'Wǒ qù chāoshì mǎi dōngxi.', 'I go to the supermarket to buy things.', 'Tôi đi siêu thị mua đồ.'], ['他每天骑自行车上班。', 'Tā měi tiān qí zìxíngchē shàngbān.', 'He cycles to work every day.', 'Anh ấy ngày nào cũng đạp xe đi làm.'], ['请用汉语回答问题。', 'Qǐng yòng Hànyǔ huídá wèntí.', 'Please answer in Chinese.', 'Xin trả lời bằng tiếng Trung.']] },
         { h: ['有 + noun + verb', '有 + danh từ + động từ'], t: ['“有时间去玩” has 有 as the first verb and the thing as its object; the second verb says what that thing is for.', '“有时间去玩” có 有 là động từ đầu, danh từ là tân ngữ của nó; động từ sau nói danh từ ấy dùng để làm gì.'],
           ex: [['我明天有事儿要出去。', 'Wǒ míngtiān yǒu shìr yào chūqù.', 'I have something to do tomorrow, I need to go out.', 'Ngày mai tôi có việc phải ra ngoài.'], ['你有没有时间帮我一下?', 'Nǐ yǒu méiyǒu shíjiān bāng wǒ yíxià?', 'Do you have time to help me?', 'Bạn có thời gian giúp tôi một chút không?'], ['我们没有钱买房子。', 'Wǒmen méiyǒu qián mǎi fángzi.', 'We have no money to buy a house.', 'Chúng tôi không có tiền để mua nhà.']] }],
    v: [['超市', 'chāoshì', 'supermarket', 'siêu thị'], ['自行车', 'zìxíngchē', 'bicycle', 'xe đạp'], ['上班', 'shàngbān', 'to go to work', 'đi làm'], ['下班', 'xiàbān', 'to finish work', 'tan làm'], ['用', 'yòng', 'to use', 'dùng'], ['回答', 'huídá', 'to answer', 'trả lời'], ['问题', 'wèntí', 'question; problem', 'câu hỏi; vấn đề'], ['帮', 'bāng', 'to help', 'giúp'], ['事儿', 'shìr', 'matter, thing to do', 'việc'], ['房子', 'fángzi', 'house, flat', 'nhà, căn hộ']],
    d: [['A', '周末你有时间吗?', 'Zhōumò nǐ yǒu shíjiān ma?', 'Are you free this weekend?', 'Cuối tuần bạn rảnh không?'], ['B', '有,我想去商店买一件衣服。', 'Yǒu, wǒ xiǎng qù shāngdiàn mǎi yí jiàn yīfu.', 'Yes, I want to go to a shop to buy a garment.', 'Rảnh, tôi muốn đi cửa hàng mua một cái áo.'], ['A', '我陪你去吧,我们坐地铁去。', 'Wǒ péi nǐ qù ba, wǒmen zuò dìtiě qù.', 'I will go with you; let us take the metro.', 'Tôi đi cùng bạn nhé, ta đi tàu điện.']],
    pit: ['Inserting 然后/和 between the verbs (我去超市和买东西 is wrong) and reversing order (买东西去超市). Keep real-world sequence.', 'Chèn 然后/和 giữa hai động từ (我去超市和买东西 sai) và đảo thứ tự (买东西去超市). Giữ đúng thứ tự thực tế.'],
    s: [['One subject, verbs in time order.', 'Một chủ ngữ, động từ theo thứ tự thời gian.'], ['去/来 + V for purpose; 坐/用 + N + V for means.', '去/来 + V chỉ mục đích; 坐/用 + N + V chỉ phương tiện.'], ['有 + N + V = have something to do.', '有 + N + V = có việc để làm.']],
    l: ['serial', 'gram', 'mdbg'],
    p: [['Say: “I take the metro to school.”', 'Nói: “Tôi đi tàu điện đến trường.”', '我坐地铁去学校。Wǒ zuò dìtiě qù xuéxiào.', '我坐地铁去学校。Wǒ zuò dìtiě qù xuéxiào.'],
        ['Fix: 我去商店和买水果。', 'Sửa: 我去商店和买水果。', '我去商店买水果。 (no connecting word)', '我去商店买水果。 (bỏ liên từ)']] }),

  D(P + '4-3', '4.3 Plans: 打算, 先…再…, 一边…一边…', '4.3 Kế hoạch: 打算, 先…再…, 一边…一边…', 'Nói kế hoạch, trình tự, hành động đồng thời, mục đích 为了.', {
    n: '4.3',
    g: [['State plans with 打算 and 准备', 'Nêu kế hoạch với 打算 và 准备'], ['Order actions with 先…再…', 'Sắp xếp hành động với 先…再…'], ['Do two things at once with 一边…一边…', 'Làm hai việc cùng lúc với 一边…一边…']],
    b: [`<p>Plans use <strong>打算 / 准备 / 想 / 计划 + V</strong>. Sequences use <strong>先…然后/再…</strong> and <strong>…以后</strong>. Simultaneous actions use <strong>一边…一边…</strong>. Purpose uses <strong>为了 + purpose, clause</strong>.</p>`,
        `<p>Kế hoạch dùng <strong>打算 / 准备 / 想 / 计划 + V</strong>. Trình tự dùng <strong>先…然后/再…</strong> và <strong>…以后</strong>. Hành động đồng thời dùng <strong>一边…一边…</strong>. Mục đích dùng <strong>为了 + mục đích, vế câu</strong>.</p>`],
    gr: [{ h: ['Plans and order', 'Kế hoạch và trình tự'], t: ['打算 is a firmer plan than 想. After 以后 / 以前 the time clause comes first. 先 and 再 sit in front of the verbs.', '打算 chắc chắn hơn 想. Với 以后 / 以前, vế thời gian đứng trước. 先 và 再 đặt trước động từ.'],
           ex: [['毕业以后,我打算去中国工作。', 'Bìyè yǐhòu, wǒ dǎsuàn qù Zhōngguó gōngzuò.', 'After graduating I plan to work in China.', 'Sau khi tốt nghiệp tôi định sang Trung Quốc làm việc.'], ['我们先吃饭,再去看电影。', 'Wǒmen xiān chī fàn, zài qù kàn diànyǐng.', 'First we eat, then we see a film.', 'Ta ăn cơm trước, rồi đi xem phim.'], ['我准备下个月参加HSK考试。', 'Wǒ zhǔnbèi xià ge yuè cānjiā HSK kǎoshì.', 'I am preparing to take HSK next month.', 'Tôi định tháng sau thi HSK.']] },
         { h: ['一边…一边… and 为了', '一边…一边… và 为了'], t: ['一边 A 一边 B: both happen together, same subject. 为了 gives the goal first.', '一边 A 一边 B: hai việc diễn ra cùng lúc, cùng chủ ngữ. 为了 nêu mục tiêu trước.'],
           ex: [['他一边走路,一边听音乐。', 'Tā yìbiān zǒulù, yìbiān tīng yīnyuè.', 'He listens to music while walking.', 'Anh ấy vừa đi vừa nghe nhạc.'], ['为了学好汉语,她每天练习一小时。', 'Wèile xuéhǎo Hànyǔ, tā měi tiān liànxí yì xiǎoshí.', 'To learn Chinese well she practises an hour daily.', 'Để học tốt tiếng Trung, cô ấy luyện mỗi ngày một tiếng.'], ['我一回家就睡觉。', 'Wǒ yì huí jiā jiù shuìjiào.', 'As soon as I get home I sleep.', 'Tôi vừa về nhà là đi ngủ.']] }],
    v: [['打算', 'dǎsuàn', 'to plan', 'dự định'], ['计划', 'jìhuà', 'plan', 'kế hoạch'], ['毕业', 'bìyè', 'to graduate', 'tốt nghiệp'], ['参加', 'cānjiā', 'to take part in', 'tham gia'], ['考试', 'kǎoshì', 'exam', 'kỳ thi'], ['先', 'xiān', 'first', 'trước'], ['然后', 'ránhòu', 'then', 'sau đó'], ['再', 'zài', 'then, again', 'rồi lại, tiếp đó'], ['为了', 'wèile', 'in order to', 'để, vì mục đích'], ['努力', 'nǔlì', 'to work hard', 'cố gắng']],
    d: [['A', '你毕业以后打算做什么?', 'Nǐ bìyè yǐhòu dǎsuàn zuò shénme?', 'What do you plan after graduation?', 'Sau tốt nghiệp bạn định làm gì?'], ['B', '我想先工作两年,再去中国留学。', 'Wǒ xiǎng xiān gōngzuò liǎng nián, zài qù Zhōngguó liúxué.', 'First work two years, then study in China.', 'Tôi muốn đi làm hai năm trước rồi sang Trung Quốc du học.'], ['A', '为了这个计划你要做什么?', 'Wèile zhège jìhuà nǐ yào zuò shénme?', 'What must you do for this plan?', 'Để thực hiện kế hoạch này bạn cần làm gì?'], ['B', '我要一边工作,一边努力学汉语。', 'Wǒ yào yìbiān gōngzuò, yìbiān nǔlì xué Hànyǔ.', 'Work while studying hard.', 'Tôi phải vừa đi làm vừa chăm học tiếng Trung.']],
    pit: ['Using 然后 and 再 together without 先, and placing 先 after the verb. Also mixing 一边 with a state verb (一边是学生 is wrong; both parts must be actions).', 'Dùng 然后 và 再 mà không có 先, hoặc đặt 先 sau động từ. Cũng sai khi 一边 đi với động từ trạng thái (一边是学生); cả hai vế phải là hành động.'],
    s: [['打算/准备 + V states a plan.', '打算/准备 + V nêu kế hoạch.'], ['先…再… orders steps.', '先…再… sắp xếp các bước.'], ['一边…一边… = at the same time.', '一边…一边… = cùng lúc.']],
    l: ['xianzai', 'yibian', 'weile', 'yijiu'],
    p: [['Say: “I plan to study in China.”', 'Nói: “Tôi định đi du học Trung Quốc.”', '我打算去中国留学。Wǒ dǎsuàn qù Zhōngguó liúxué.', '我打算去中国留学。Wǒ dǎsuàn qù Zhōngguó liúxué.'],
        ['Say: “Wash your hands first, then eat.”', 'Nói: “Rửa tay trước rồi hãy ăn.”', '先洗手,再吃饭。Xiān xǐ shǒu, zài chī fàn.', '先洗手,再吃饭。Xiān xǐ shǒu, zài chī fàn.']] }),

  Q(P + 'quiz-4', 'Chapter 4 quiz', 'Quiz chương 4', [
    [['“When did you come?” (stress time)', '“Bạn đến lúc nào?” (nhấn thời gian)'], ['你是什么时候来的?', '你什么时候来了的?', '你来的是什么时候?', '你是来什么时候?'], 0, ['是…的.', '是…的.']],
    [['“I work at a company.”', '“Tôi làm ở một công ty.”'], ['我在公司工作。', '我工作在公司做。', '我公司在工作。', '我是公司工作。'], 0, ['在 + place + verb.', '在 + nơi + động từ.']],
    [['Which is a serial-verb sentence?', 'Câu nào là câu liên động?'], ['我去商店买东西。', '我和你是朋友。', '他很高。', '我们都是学生。'], 0, ['Two verbs, one subject, time order.', 'Hai động từ, một chủ ngữ, theo thứ tự thời gian.']],
    [['“Take the metro to work”:', '“Đi tàu điện đi làm”:'], ['坐地铁上班', '上班坐地铁在', '地铁坐上班', '上班地铁坐'], 0, ['Means before action.', 'Phương tiện đứng trước hành động.']],
    [['“First eat, then watch a film”:', '“Ăn trước rồi xem phim”:'], ['先吃饭,再看电影', '吃先饭,看再电影', '再吃饭,先看电影', '先再吃饭看电影'], 0, ['先…再….', '先…再….']],
    [['“Listen to music while walking”:', '“Vừa đi vừa nghe nhạc”:'], ['一边走路一边听音乐', '一边走路和听音乐', '边一走路边听', '又走路又一听'], 0, ['一边…一边….', '一边…一边….']],
    [['Which means “in order to”?', 'Từ nào nghĩa là “để”?'], ['因为', '为了', '虽然', '但是'], 1, ['为了.', '为了.']],
    [['“After graduating” is:', '“Sau khi tốt nghiệp” là:'], ['毕业以后', '以后毕业', '毕业以前', '毕业了前'], 0, ['Time clause + 以后.', 'Vế thời gian + 以后.']],
  ]),
]));
// ===== Chương 5 =====
secs.push(SEC('Chapter 5 — Travel and transport', 'Chương 5 — Du lịch và đi lại',
  'Đặt vé, khách sạn, sân bay, ga tàu, bổ ngữ xu hướng.', [
  D(P + '5-1', '5.1 Booking tickets and hotels', '5.1 Đặt vé và khách sạn', 'Từ vựng đặt chỗ, 订/预订, 从…到…, 离, 才 và 就 với thời gian.', {
    n: '5.1',
    g: [['Book a train/plane ticket and a hotel room', 'Đặt vé tàu/máy bay và phòng khách sạn'], ['Use 从…到… and 离', 'Dùng 从…到… và 离'], ['Talk about dates, prices, requests', 'Nói ngày, giá, yêu cầu']],
    b: [`<p>Travel Chinese is full of fixed patterns. To book: <strong>我想订一张…的票 / 订一个房间</strong>. Time span: <strong>从…到…</strong>. Distance between two places: <strong>A 离 B + (很) 远/近</strong>. In China, tickets for high-speed trains are usually booked in an app with an ID or passport number.</p>`,
        `<p>Tiếng Trung du lịch toàn mẫu câu cố định. Đặt chỗ: <strong>我想订一张…的票 / 订一个房间</strong>. Khoảng thời gian: <strong>从…到…</strong>. Khoảng cách giữa hai nơi: <strong>A 离 B + (很) 远/近</strong>. Ở Trung Quốc vé tàu cao tốc thường đặt qua ứng dụng bằng số căn cước hoặc hộ chiếu.</p>`],
    gr: [{ h: ['Booking patterns', 'Mẫu đặt chỗ'], t: ['Measure words: 一张票 (tickets), 一个房间 (rooms), 一晚 (nights). “Single/double” = 单人间 / 双人间.', 'Lượng từ: 一张票 (vé), 一个房间 (phòng), 一晚 (đêm). “Phòng đơn/đôi” = 单人间 / 双人间.'],
           ex: [['我想订两张去上海的火车票。', 'Wǒ xiǎng dìng liǎng zhāng qù Shànghǎi de huǒchēpiào.', 'I would like to book two train tickets to Shanghai.', 'Tôi muốn đặt hai vé tàu đi Thượng Hải.'], ['有没有双人间?一晚多少钱?', 'Yǒu méiyǒu shuāngrénjiān? Yì wǎn duōshao qián?', 'Do you have a double room? Price per night?', 'Có phòng đôi không? Một đêm bao nhiêu tiền?'], ['我从十号住到十五号。', 'Wǒ cóng shí hào zhù dào shíwǔ hào.', 'I will stay from the 10th to the 15th.', 'Tôi ở từ ngày 10 đến ngày 15.']] },
         { h: ['离 for distance and 才/就 for time', '离 cho khoảng cách và 才/就 cho thời gian'], t: ['A 离 B 很近 gives distance (not direction). 就 shows something is quick/early, 才 slow/late: 一个小时就到了 / 三个小时才到.', 'A 离 B 很近 nói khoảng cách (không phải hướng). 就 cho thấy nhanh/sớm, 才 chậm/muộn: 一个小时就到了 / 三个小时才到.'],
           ex: [['酒店离火车站很近。', 'Jiǔdiàn lí huǒchēzhàn hěn jìn.', 'The hotel is very close to the train station.', 'Khách sạn rất gần ga tàu.'], ['坐高铁两个小时就到了。', 'Zuò gāotiě liǎng ge xiǎoshí jiù dào le.', 'By high-speed rail it takes only two hours.', 'Đi tàu cao tốc chỉ hai tiếng là đến.'], ['坐火车十个小时才到。', 'Zuò huǒchē shí ge xiǎoshí cái dào.', 'By ordinary train it takes a full ten hours.', 'Đi tàu thường mười tiếng mới đến.']] }],
    v: [['订', 'dìng', 'to book', 'đặt trước'], ['票', 'piào', 'ticket', 'vé'], ['火车', 'huǒchē', 'train', 'tàu hoả'], ['高铁', 'gāotiě', 'high-speed rail', 'tàu cao tốc'], ['酒店', 'jiǔdiàn', 'hotel', 'khách sạn'], ['房间', 'fángjiān', 'room', 'phòng'], ['单人间', 'dānrénjiān', 'single room', 'phòng đơn'], ['双人间', 'shuāngrénjiān', 'double room', 'phòng đôi'], ['离', 'lí', 'away from', 'cách'], ['护照', 'hùzhào', 'passport', 'hộ chiếu']],
    d: [['客人', '你好,我想订一个房间。', 'Nǐ hǎo, wǒ xiǎng dìng yí ge fángjiān.', 'Hello, I would like to book a room.', 'Xin chào, tôi muốn đặt một phòng.'], ['前台', '您住几天?要单人间还是双人间?', 'Nín zhù jǐ tiān? Yào dānrénjiān háishi shuāngrénjiān?', 'How many days? Single or double?', 'Bạn ở mấy ngày? Phòng đơn hay đôi?'], ['客人', '住三天,双人间。离地铁站远不远?', 'Zhù sān tiān, shuāngrénjiān. Lí dìtiězhàn yuǎn bu yuǎn?', 'Three days, double. Is it far from the metro?', 'Ba ngày, phòng đôi. Có xa ga tàu điện không?'], ['前台', '不远,走路五分钟就到。请给我您的护照。', 'Bù yuǎn, zǒulù wǔ fēnzhōng jiù dào. Qǐng gěi wǒ nín de hùzhào.', 'Not far, 5 minutes on foot. Passport please.', 'Không xa, đi bộ năm phút là tới. Xin cho tôi hộ chiếu.']],
    pit: ['Writing 离 for direction (离北京向南 is wrong) and mixing 离 with 到 for distance. Use 离 for “how far”, 从…到 for a route or time span.', 'Dùng 离 để chỉ hướng (离北京向南 sai) và lẫn 离 với 到 khi nói khoảng cách. 离 là “cách bao xa”, 从…到 là tuyến đường hoặc khoảng thời gian.'],
    s: [['订 + 张/个 + noun for booking.', '订 + 张/个 + danh từ để đặt chỗ.'], ['A 离 B + far/near.', 'A 离 B + xa/gần.'], ['就 = soon/easy; 才 = late/hard.', '就 = sớm/dễ; 才 = muộn/khó.']],
    l: ['lidist', 'cai', 'hsr', 'tour'],
    p: [['Say: “I want to book a single room for two nights.”', 'Nói: “Tôi muốn đặt một phòng đơn hai đêm.”', '我想订一个单人间,住两晚。Wǒ xiǎng dìng yí ge dānrénjiān, zhù liǎng wǎn.', '我想订一个单人间,住两晚。Wǒ xiǎng dìng yí ge dānrénjiān, zhù liǎng wǎn.'],
        ['Say: “My home is far from school.”', 'Nói: “Nhà tôi cách trường xa.”', '我家离学校很远。Wǒ jiā lí xuéxiào hěn yuǎn.', '我家离学校很远。Wǒ jiā lí xuéxiào hěn yuǎn.']] }),

  D(P + '5-2', '5.2 At the airport and the station', '5.2 Ở sân bay và nhà ga', 'Thủ tục sân bay, bảng giờ, hành lý, hỏi đường nâng cao.', {
    n: '5.2',
    g: [['Follow airport procedure in Chinese', 'Làm thủ tục sân bay bằng tiếng Trung'], ['Read departure information', 'Đọc thông tin chuyến bay'], ['Ask for help politely', 'Nhờ giúp đỡ lịch sự']],
    b: [`<p>Airport order: <strong>办登机手续 → 托运行李 → 安检 → 登机</strong>. Boarding passes show 航班 (flight), 登机口 (gate), 起飞时间 (departure time). Polite requests use <strong>请问…</strong>, <strong>麻烦您…</strong> and <strong>能不能…</strong>. Large airports like Beijing Capital have several terminals, so check the terminal (<strong>航站楼</strong>).</p>`,
        `<p>Thứ tự ở sân bay: <strong>办登机手续 → 托运行李 → 安检 → 登机</strong>. Thẻ lên tàu bay ghi 航班 (chuyến bay), 登机口 (cổng), 起飞时间 (giờ cất cánh). Nhờ lịch sự dùng <strong>请问…</strong>, <strong>麻烦您…</strong> và <strong>能不能…</strong>. Sân bay lớn như Thủ đô Bắc Kinh có nhiều nhà ga, nên phải kiểm tra <strong>航站楼</strong> (terminal).</p>`],
    gr: [{ h: ['Polite requests', 'Lời nhờ lịch sự'], t: ['请问 opens a question; 麻烦您 + V asks a favour; 能不能 + V softens a request. Add 一下 to make the request light.', '请问 mở đầu câu hỏi; 麻烦您 + V nhờ vả; 能不能 + V làm lời nhờ nhẹ hơn. Thêm 一下 để nhẹ nhàng.'],
           ex: [['请问,去北京的航班在哪儿登机?', 'Qǐngwèn, qù Běijīng de hángbān zài nǎr dēngjī?', 'Excuse me, where do I board the Beijing flight?', 'Xin hỏi, chuyến bay đi Bắc Kinh lên máy bay ở đâu?'], ['麻烦您帮我看一下行李。', 'Máfan nín bāng wǒ kàn yíxià xíngli.', 'Could you please watch my luggage?', 'Phiền bạn trông giúp hành lý của tôi.'], ['我能不能换一个靠窗的座位?', 'Wǒ néng bu néng huàn yí ge kào chuāng de zuòwèi?', 'Can I switch to a window seat?', 'Tôi đổi sang chỗ cạnh cửa sổ được không?']] },
         { h: ['Delays and announcements', 'Hoãn chuyến và thông báo'], t: ['晚点 = delayed; 取消 = cancelled. Sentence pattern: 因为 + reason, 航班 + result. The announcement style is formal.', '晚点 = trễ; 取消 = huỷ. Mẫu câu: 因为 + lý do, 航班 + kết quả. Thông báo dùng văn phong trang trọng.'],
           ex: [['由于天气原因,航班晚点了。', 'Yóuyú tiānqì yuányīn, hángbān wǎndiǎn le.', 'Due to weather the flight is delayed.', 'Do thời tiết nên chuyến bay bị trễ.'], ['飞机十点起飞,九点开始登机。', 'Fēijī shí diǎn qǐfēi, jiǔ diǎn kāishǐ dēngjī.', 'Take-off at ten; boarding starts at nine.', 'Máy bay cất cánh lúc mười giờ, chín giờ bắt đầu lên máy bay.'], ['你的行李超重了。', 'Nǐ de xíngli chāozhòng le.', 'Your luggage is overweight.', 'Hành lý của bạn quá cân.']] }],
    v: [['机场', 'jīchǎng', 'airport', 'sân bay'], ['航班', 'hángbān', 'flight', 'chuyến bay'], ['登机', 'dēngjī', 'to board', 'lên máy bay'], ['登机牌', 'dēngjīpái', 'boarding pass', 'thẻ lên máy bay'], ['行李', 'xíngli', 'luggage', 'hành lý'], ['托运', 'tuōyùn', 'to check in (luggage)', 'ký gửi'], ['安检', 'ānjiǎn', 'security check', 'kiểm tra an ninh'], ['起飞', 'qǐfēi', 'to take off', 'cất cánh'], ['晚点', 'wǎndiǎn', 'to be late', 'trễ giờ'], ['座位', 'zuòwèi', 'seat', 'chỗ ngồi']],
    d: [['乘客', '你好,我要办登机手续。', 'Nǐ hǎo, wǒ yào bàn dēngjī shǒuxù.', 'Hello, I want to check in.', 'Xin chào, tôi muốn làm thủ tục.'], ['工作人员', '请把护照给我。有行李要托运吗?', 'Qǐng bǎ hùzhào gěi wǒ. Yǒu xíngli yào tuōyùn ma?', 'Passport please. Any luggage to check?', 'Xin đưa hộ chiếu. Có hành lý ký gửi không?'], ['乘客', '有一个箱子。我能不能要靠窗的座位?', 'Yǒu yí ge xiāngzi. Wǒ néng bu néng yào kào chuāng de zuòwèi?', 'One suitcase. A window seat please?', 'Có một vali. Cho tôi chỗ gần cửa sổ được không?'], ['工作人员', '可以。八号登机口,九点登机。', 'Kěyǐ. Bā hào dēngjīkǒu, jiǔ diǎn dēngjī.', 'Sure. Gate 8, boarding at nine.', 'Được. Cổng số 8, chín giờ lên máy bay.']],
    pit: ['Mixing 登机 (board) and 起飞 (take off), and saying 我坐飞机去登机 for “I go to board”. Also translating “missed the flight” as 错过 correctly: 我错过了航班, not 我没有赶到航班.', 'Lẫn 登机 (lên máy bay) và 起飞 (cất cánh); nói “lỡ chuyến bay” là 我错过了航班, đừng dịch word-for-word.'],
    s: [['Order: check-in → luggage → security → boarding.', 'Thứ tự: làm thủ tục → ký gửi → an ninh → lên máy bay.'], ['请问 / 麻烦您 / 能不能 for polite requests.', '请问 / 麻烦您 / 能不能 để nhờ lịch sự.'], ['晚点 and 取消 for delays and cancellations.', '晚点 và 取消 cho trễ và huỷ chuyến.']],
    l: ['pek', 'tour', 'mdbg'],
    p: [['Say: “Where is Gate 12?”', 'Nói: “Cổng số 12 ở đâu?”', '请问,十二号登机口在哪儿? Qǐngwèn, shí’èr hào dēngjīkǒu zài nǎr?', '请问,十二号登机口在哪儿? Qǐngwèn, shí’èr hào dēngjīkǒu zài nǎr?'],
        ['Ask politely: “Could you help me with this suitcase?”', 'Nhờ lịch sự: “Bạn giúp tôi chiếc vali này được không?”', '麻烦您帮我拿一下这个箱子。Máfan nín bāng wǒ ná yíxià zhège xiāngzi.', '麻烦您帮我拿一下这个箱子。Máfan nín bāng wǒ ná yíxià zhège xiāngzi.']] }),

  D(P + '5-3', '5.3 Direction complements: 上来, 下去, 进来, 出去…', '5.3 Bổ ngữ xu hướng: 上来, 下去, 进来, 出去…', 'Bổ ngữ xu hướng đơn và kép, nghĩa mở rộng 起来, 下去, tân ngữ chỉ nơi chốn.', {
    n: '5.3',
    g: [['Add 来/去 after a verb to show direction', 'Thêm 来/去 sau động từ để chỉ hướng'], ['Combine into 上来, 下去, 进来, 出去, 回来, 过去', 'Ghép thành 上来, 下去, 进来, 出去, 回来, 过去'], ['Know extended meanings of 起来 and 下去', 'Biết nghĩa mở rộng của 起来 và 下去']],
    b: [`<p>The speaker’s viewpoint decides <strong>来</strong> (towards the speaker) or <strong>去</strong> (away from the speaker). Add a directional verb first: 上 up, 下 down, 进 in, 出 out, 回 back, 过 across, 起 rise. Together: 上来, 下去, 进来, 出去, 回来, 过去, 起来. If the object is a place it goes <strong>between</strong> the two parts: 走进教室来.</p>`,
        `<p>Góc nhìn người nói quyết định <strong>来</strong> (về phía người nói) hay <strong>去</strong> (ra xa người nói). Thêm trước một động từ chỉ hướng: 上 lên, 下 xuống, 进 vào, 出 ra, 回 về, 过 sang, 起 dậy. Ghép: 上来, 下去, 进来, 出去, 回来, 过去, 起来. Tân ngữ chỉ nơi chốn đặt <strong>giữa</strong> hai phần: 走进教室来.</p>`],
    gr: [{ h: ['Simple and compound direction', 'Xu hướng đơn và kép'], t: ['Simple: V + 来/去 (拿来, 带去). Compound: V + 上/下/进/出/回/过 + 来/去. Place objects go in the middle.', 'Đơn: V + 来/去 (拿来, 带去). Kép: V + 上/下/进/出/回/过 + 来/去. Tân ngữ nơi chốn đặt ở giữa.'],
           ex: [['他从楼上走下来了。', 'Tā cóng lóu shàng zǒu xiàlái le.', 'He walked down from upstairs (towards me).', 'Anh ấy từ trên lầu đi xuống (về phía tôi).'], ['请进来坐吧。', 'Qǐng jìnlái zuò ba.', 'Please come in and sit.', 'Mời vào ngồi.'], ['他跑进教室去了。', 'Tā pǎo jìn jiàoshì qù le.', 'He ran into the classroom (away from me).', 'Cậu ấy chạy vào lớp (ra xa tôi).']] },
         { h: ['Extended meanings', 'Nghĩa mở rộng'], t: ['起来 = start/begin (笑起来), or “seems when” (看起来). 下去 = continue (说下去). 出来 = become clear (听出来).', '起来 = bắt đầu (笑起来), hoặc “trông có vẻ” (看起来). 下去 = tiếp tục (说下去). 出来 = nhận ra (听出来).'],
           ex: [['这个菜看起来很好吃。', 'Zhège cài kànqǐlái hěn hǎochī.', 'This dish looks delicious.', 'Món này trông rất ngon.'], ['你说下去,我在听。', 'Nǐ shuō xiàqù, wǒ zài tīng.', 'Go on, I am listening.', 'Bạn nói tiếp đi, tôi đang nghe.'], ['大家都笑起来了。', 'Dàjiā dōu xiào qǐlái le.', 'Everyone burst out laughing.', 'Mọi người đều bật cười.']] }],
    v: [['上来', 'shànglái', 'to come up', 'đi lên (về phía tôi)'], ['下去', 'xiàqù', 'to go down', 'đi xuống (ra xa)'], ['进来', 'jìnlái', 'to come in', 'vào đây'], ['出去', 'chūqù', 'to go out', 'ra ngoài'], ['回来', 'huílái', 'to come back', 'trở về'], ['过去', 'guòqù', 'to go over', 'đi sang'], ['起来', 'qǐlái', 'to get up; begin', 'đứng dậy; bắt đầu'], ['楼', 'lóu', 'building; floor', 'toà nhà; tầng'], ['跑', 'pǎo', 'to run', 'chạy'], ['带', 'dài', 'to bring, carry', 'mang theo']],
    d: [['A', '你在哪儿?快上来吧,我们在五楼。', 'Nǐ zài nǎr? Kuài shànglái ba, wǒmen zài wǔ lóu.', 'Where are you? Come up, we are on the 5th floor.', 'Bạn ở đâu? Lên đây đi, chúng tôi ở tầng 5.'], ['B', '我在楼下,马上走上去。', 'Wǒ zài lóu xià, mǎshàng zǒu shàngqù.', 'I am downstairs; walking up now.', 'Tôi ở dưới lầu, đi lên ngay.'], ['A', '你带雨伞来了吗?', 'Nǐ dài yǔsǎn lái le ma?', 'Did you bring an umbrella?', 'Bạn mang ô đến chưa?'], ['B', '带来了,放在车里了。', 'Dàilái le, fàng zài chē lǐ le.', 'Yes, I left it in the car.', 'Mang rồi, để trong xe.']],
    pit: ['Choosing 来/去 from the wrong viewpoint (the speaker’s position, not the mover’s), and putting a place after 来/去 (走进来教室 is wrong; use 走进教室来).', 'Chọn 来/去 theo sai góc nhìn (phải theo vị trí người nói), và đặt nơi chốn sau 来/去 (走进来教室 sai; dùng 走进教室来).'],
    s: [['来 towards the speaker; 去 away.', '来 về phía người nói; 去 ra xa.'], ['Place objects go between: V+进+place+来.', 'Nơi chốn ở giữa: V+进+nơi+来.'], ['起来 / 下去 / 出来 have extended meanings.', '起来 / 下去 / 出来 có nghĩa mở rộng.']],
    l: ['dircomp', 'qilai', 'compl'],
    p: [['Say: “Please come back.” (to you, speaker at home)', 'Nói: “Mời quay lại.” (người nói ở nhà)', '请回来。Qǐng huílái.', '请回来。Qǐng huílái.'],
        ['Say: “He walked into the room.” (speaker outside)', 'Nói: “Anh ấy đi vào phòng.” (người nói ở ngoài)', '他走进房间去了。Tā zǒu jìn fángjiān qù le.', '他走进房间去了。Tā zǒu jìn fángjiān qù le.']] }),

  Q(P + 'quiz-5', 'Chapter 5 quiz', 'Quiz chương 5', [
    [['“I want to book a train ticket.”', '“Tôi muốn đặt một vé tàu.”'], ['我想订一张火车票。', '我想订一个火车票。', '我想订票火车一张。', '我订想一张火车票。'], 0, ['张 for tickets.', '张 cho vé.']],
    [['“The hotel is near the station.”', '“Khách sạn gần ga.”'], ['酒店离火车站很近。', '酒店到火车站很近。', '酒店在火车站离近。', '酒店从火车站近。'], 0, ['A 离 B 近.', 'A 离 B 近.']],
    [['“From the 3rd to the 7th”:', '“Từ ngày 3 đến ngày 7”:'], ['从三号到七号', '三号从到七号', '到三号从七号', '从到三号七号'], 0, ['从…到….', '从…到….']],
    [['A fast journey (“only 2 hours”):', 'Hành trình nhanh (“chỉ 2 tiếng”):'], ['两个小时就到了', '两个小时才到了', '两个小时不到', '两小时到才'], 0, ['就 stresses quickness.', '就 nhấn mạnh nhanh.']],
    [['Which means “boarding pass”?', 'Từ nào là “thẻ lên máy bay”?'], ['登机牌', '机场', '托运', '安检'], 0, ['登机牌.', '登机牌.']],
    [['“Please come in” (speaker inside):', '“Mời vào” (người nói ở trong):'], ['请进来', '请进去', '请出来', '请上去'], 0, ['来 = toward the speaker.', '来 = về phía người nói.']],
    [['“He ran into the room (away)”:', '“Anh ấy chạy vào phòng (ra xa)”:'], ['他跑进房间去了', '他跑进去房间了', '他跑去进房间了', '他进跑房间去了'], 0, ['Place goes between.', 'Nơi chốn ở giữa.']],
    [['“Go on speaking” uses:', '“Cứ nói tiếp” dùng:'], ['说下去', '说起来', '说出来', '说回来'], 0, ['下去 = continue.', '下去 = tiếp tục.']],
  ]),
]));
// ===== Chương 6 =====
secs.push(SEC('Chapter 6 — Home, 把 and 被', 'Chương 6 — Nhà ở, câu 把 và 被',
  'Nhà cửa, đồ đạc, câu tồn hiện, câu chữ 把, câu bị động 被.', [
  D(P + '6-1', '6.1 Home and existential sentences', '6.1 Nhà ở và câu tồn hiện', 'Từ vựng nhà, đồ đạc; câu tồn hiện: nơi chốn + V着 + người/vật.', {
    n: '6.1',
    g: [['Name rooms and furniture', 'Gọi tên phòng và đồ đạc'], ['Describe where things are with existential sentences', 'Mô tả đồ vật ở đâu bằng câu tồn hiện'], ['Distinguish 在, 有, 是 for location', 'Phân biệt 在, 有, 是 khi nói vị trí']],
    b: [`<p>An <strong>existential sentence</strong> starts with a place and says what exists, appears or disappears there: <strong>place + 有/V着/V了 + person/thing</strong>. The place is the topic (no 在 before it); the thing that exists is new information, so it is usually indefinite (一张桌子, not 这张桌子).</p>`,
        `<p><strong>Câu tồn hiện</strong> mở đầu bằng nơi chốn và nói cái gì tồn tại, xuất hiện hay biến mất ở đó: <strong>nơi chốn + 有/V着/V了 + người/vật</strong>. Nơi chốn là chủ đề (không có 在 phía trước); vật tồn tại là thông tin mới nên thường không xác định (一张桌子, không phải 这张桌子).</p>`],
    gr: [{ h: ['Place + V着 + thing', 'Nơi chốn + V着 + vật'], t: ['Posture/placement verbs + 着 describe how things are put: 放着, 挂着, 摆着, 坐着, 躺着, 住着.', 'Động từ tư thế/đặt để + 着 mô tả cách đồ vật được bố trí: 放着, 挂着, 摆着, 坐着, 躺着, 住着.'],
           ex: [['桌子上放着一本书。', 'Zhuōzi shang fàngzhe yì běn shū.', 'A book lies on the table.', 'Trên bàn có đặt một quyển sách.'], ['墙上挂着一张地图。', 'Qiáng shang guàzhe yì zhāng dìtú.', 'A map hangs on the wall.', 'Trên tường treo một tấm bản đồ.'], ['楼上住着一位老师。', 'Lóu shàng zhùzhe yí wèi lǎoshī.', 'A teacher lives upstairs.', 'Trên lầu có một thầy giáo ở.']] },
         { h: ['在 vs 有 vs 是', '在 vs 有 vs 是'], t: ['Thing 在 place (thing is known). Place 有 thing (what is there, many things). Place 是 thing (identifies the only/main thing).', 'Vật 在 nơi chốn (vật đã biết). Nơi chốn 有 vật (có những gì ở đó, nhiều vật). Nơi chốn 是 vật (xác định vật chính/duy nhất).'],
           ex: [['我的书在桌子上。', 'Wǒ de shū zài zhuōzi shang.', 'My book is on the table.', 'Sách của tôi ở trên bàn.'], ['桌子上有书和杯子。', 'Zhuōzi shang yǒu shū hé bēizi.', 'There are books and a cup on the table.', 'Trên bàn có sách và cái cốc.'], ['我家对面是一个公园。', 'Wǒ jiā duìmiàn shì yí ge gōngyuán.', 'Opposite my home is a park.', 'Đối diện nhà tôi là một công viên.']] }],
    v: [['客厅', 'kètīng', 'living room', 'phòng khách'], ['卧室', 'wòshì', 'bedroom', 'phòng ngủ'], ['厨房', 'chúfáng', 'kitchen', 'bếp'], ['桌子', 'zhuōzi', 'table', 'cái bàn'], ['椅子', 'yǐzi', 'chair', 'cái ghế'], ['沙发', 'shāfā', 'sofa', 'ghế sô-pha'], ['空调', 'kōngtiáo', 'air conditioner', 'điều hoà'], ['墙', 'qiáng', 'wall', 'bức tường'], ['挂', 'guà', 'to hang', 'treo'], ['摆', 'bǎi', 'to place, arrange', 'bày, đặt']],
    d: [['A', '你的新家怎么样?', 'Nǐ de xīn jiā zěnmeyàng?', 'How is your new home?', 'Nhà mới của bạn thế nào?'], ['B', '不大,但是很舒服。客厅里摆着一个沙发。', 'Bú dà, dànshì hěn shūfu. Kètīng lǐ bǎizhe yí ge shāfā.', 'Small but cosy; a sofa is in the living room.', 'Không lớn nhưng thoải mái. Phòng khách bày một cái sô-pha.'], ['A', '卧室里呢?', 'Wòshì lǐ ne?', 'And the bedroom?', 'Còn phòng ngủ?'], ['B', '有一张床和一个小桌子,墙上挂着我们的照片。', 'Yǒu yì zhāng chuáng hé yí ge xiǎo zhuōzi, qiáng shang guàzhe wǒmen de zhàopiàn.', 'A bed and a small table; our photos hang on the wall.', 'Có một cái giường và một cái bàn nhỏ, trên tường treo ảnh của chúng tôi.']],
    pit: ['Putting 在 before the place in an existential sentence (在桌子上放着书 is wrong) and using a definite noun (这本书 instead of 一本书).', 'Thêm 在 trước nơi chốn trong câu tồn hiện (在桌子上放着书 sai) và dùng danh từ xác định (这本书 thay vì 一本书).'],
    s: [['Existential: place + V着/有 + thing.', 'Tồn hiện: nơi chốn + V着/有 + vật.'], ['No 在 before the topic place.', 'Không có 在 trước nơi chốn chủ đề.'], ['在 / 有 / 是 answer different questions.', '在 / 有 / 是 trả lời các câu hỏi khác nhau.']],
    l: ['exist', 'exw', 'sihe'],
    p: [['Say: “A picture hangs on the wall.”', 'Nói: “Trên tường treo một bức tranh.”', '墙上挂着一张画。Qiáng shang guàzhe yì zhāng huà.', '墙上挂着一张画。Qiáng shang guàzhe yì zhāng huà.'],
        ['Fix: 在冰箱里放着一瓶水。', 'Sửa: 在冰箱里放着一瓶水。', '冰箱里放着一瓶水。 (drop 在)', '冰箱里放着一瓶水。 (bỏ 在)']] }),

  D(P + '6-2', '6.2 The 把 sentence', '6.2 Câu chữ 把', 'Cấu trúc 把 + tân ngữ + V + thành phần khác; khi nào bắt buộc; phủ định.', {
    n: '6.2',
    g: [['Form a 把 sentence', 'Tạo câu chữ 把'], ['Know when 把 is needed', 'Biết khi nào cần dùng 把'], ['Place negatives and modals correctly', 'Đặt phủ định và năng nguyện đúng chỗ']],
    b: [`<p>The <strong>把</strong> sentence moves a definite object in front of the verb to say what you <em>do to it</em> and what happens to it: <strong>S + 把 + object + V + other element</strong> (result, direction, place, 了). The verb can never stand alone; it needs a result complement, 了, 一下, or a place.</p>`,
        `<p>Câu <strong>把</strong> đưa tân ngữ xác định lên trước động từ để nói bạn <em>làm gì với nó</em> và nó <em>bị ra sao</em>: <strong>S + 把 + tân ngữ + V + thành phần khác</strong> (kết quả, hướng, nơi chốn, 了). Động từ không bao giờ đứng trơ trọi; cần bổ ngữ kết quả, 了, 一下 hoặc nơi chốn.</p>`],
    gr: [{ h: ['Pattern', 'Mẫu câu'], t: ['The object must be definite or known (这本书, 我的作业). Typical verbs: disposal verbs like 放, 拿, 带, 洗, 写, 打开, 关上. Verbs of feeling or existence (喜欢, 是, 有) cannot be used.', 'Tân ngữ phải xác định (这本书, 我的作业). Động từ thường gặp: các động từ xử lý như 放, 拿, 带, 洗, 写, 打开, 关上. Không dùng với động từ cảm xúc hay tồn tại (喜欢, 是, 有).'],
           ex: [['请把门关上。', 'Qǐng bǎ mén guānshàng.', 'Please close the door.', 'Xin đóng cửa lại.'], ['我已经把作业写完了。', 'Wǒ yǐjīng bǎ zuòyè xiěwán le.', 'I have already finished writing the homework.', 'Tôi đã viết xong bài tập rồi.'], ['他把手机放在桌子上了。', 'Tā bǎ shǒujī fàng zài zhuōzi shang le.', 'He put the phone on the table.', 'Anh ấy để điện thoại lên bàn rồi.']] },
         { h: ['Negation and modals', 'Phủ định và năng nguyện'], t: ['Negatives, modals and time adverbs go BEFORE 把: 没把, 不把, 想把, 应该把, 已经把.', 'Phủ định, năng nguyện và phó từ thời gian đứng TRƯỚC 把: 没把, 不把, 想把, 应该把, 已经把.'],
           ex: [['我没把钥匙带来。', 'Wǒ méi bǎ yàoshi dàilái.', 'I did not bring the key.', 'Tôi không mang chìa khoá đến.'], ['你应该把药吃了。', 'Nǐ yīnggāi bǎ yào chī le.', 'You should take the medicine.', 'Bạn nên uống thuốc đi.'], ['别把水洒在地上。', 'Bié bǎ shuǐ sǎ zài dì shang.', 'Do not spill water on the floor.', 'Đừng làm đổ nước xuống sàn.']] }],
    v: [['把', 'bǎ', 'object marker', 'giới từ đưa tân ngữ lên trước'], ['关上', 'guānshàng', 'to close', 'đóng lại'], ['打开', 'dǎkāi', 'to open', 'mở ra'], ['放', 'fàng', 'to put', 'để, đặt'], ['洗', 'xǐ', 'to wash', 'rửa'], ['擦', 'cā', 'to wipe', 'lau'], ['收拾', 'shōushi', 'to tidy up', 'dọn dẹp'], ['钥匙', 'yàoshi', 'key', 'chìa khoá'], ['地', 'dì', 'floor, ground', 'sàn, đất'], ['洒', 'sǎ', 'to spill', 'làm đổ, rắc']],
    d: [['妈妈', '你把房间收拾了吗?', 'Nǐ bǎ fángjiān shōushi le ma?', 'Have you tidied your room?', 'Con dọn phòng chưa?'], ['孩子', '收拾了,我把衣服放进柜子里了。', 'Shōushi le, wǒ bǎ yīfu fàng jìn guìzi lǐ le.', 'Yes, I put the clothes in the wardrobe.', 'Dọn rồi, con cất quần áo vào tủ rồi.'], ['妈妈', '那你把书包拿过来,把作业给我看看。', 'Nà nǐ bǎ shūbāo ná guòlái, bǎ zuòyè gěi wǒ kànkan.', 'Then bring your bag and show me the homework.', 'Vậy mang cặp lại đây, đưa bài tập cho mẹ xem.']],
    pit: ['Using an indefinite object (把一本书), a bare verb (我把门关), putting 不/没 after 把, and using 把 with 喜欢 or 有.', 'Dùng tân ngữ không xác định (把一本书), động từ trơ trọi (我把门关), đặt 不/没 sau 把, và dùng 把 với 喜欢 hay 有.'],
    s: [['S + 把 + definite object + V + complement/了.', 'S + 把 + tân ngữ xác định + V + bổ ngữ/了.'], ['Negatives and modals come before 把.', 'Phủ định, năng nguyện đứng trước 把.'], ['Not with 喜欢 / 是 / 有.', 'Không dùng với 喜欢 / 是 / 有.']],
    l: ['ba', 'baw', 'gram'],
    p: [['Say: “Please put the book on the table.”', 'Nói: “Xin đặt quyển sách lên bàn.”', '请把书放在桌子上。Qǐng bǎ shū fàng zài zhuōzi shang.', '请把书放在桌子上。Qǐng bǎ shū fàng zài zhuōzi shang.'],
        ['Fix: 我把门不关。', 'Sửa: 我把门不关。', '我没把门关上。 / 我不把门关上。 (negative before 把; the verb needs a complement)', '我没把门关上。 / 我不把门关上。 (phủ định trước 把; động từ cần bổ ngữ)']] }),

  D(P + '6-3', '6.3 Passive: 被, 让, 叫', '6.3 Câu bị động: 被, 让, 叫', 'Bị động với 被/让/叫, nghĩa thường bất lợi, so sánh với 把.', {
    n: '6.3',
    g: [['Build a 被 sentence', 'Tạo câu 被'], ['Know 让 and 叫 as spoken variants', 'Biết 让 và 叫 là biến thể khẩu ngữ'], ['Convert between 把 and 被', 'Chuyển đổi qua lại giữa 把 và 被']],
    b: [`<p>The passive pattern is <strong>receiver + 被 (+ doer) + V + other element</strong>. It often reports something unwelcome (loss, damage), but also neutral events. In speech, <strong>让</strong> and <strong>叫</strong> replace 被, but then the doer must be named. 被 is also the one used in written style.</p>`,
        `<p>Mẫu bị động là <strong>người/vật chịu tác động + 被 (+ người làm) + V + thành phần khác</strong>. Thường kể việc không mong muốn (mất, hỏng), nhưng cũng có việc trung tính. Trong khẩu ngữ, <strong>让</strong> và <strong>叫</strong> thay cho 被 nhưng khi đó phải nêu người làm. 被 cũng là chữ dùng trong văn viết.</p>`],
    gr: [{ h: ['被 sentences', 'Câu 被'], t: ['As with 把, the verb needs a complement or 了. Negatives go before 被: 没被. Without a doer 被 is fine, but 让/叫 need one.', 'Như 把, động từ cần bổ ngữ hoặc 了. Phủ định đứng trước 被: 没被. Không nêu người làm thì 被 vẫn dùng được, nhưng 让/叫 thì phải có.'],
           ex: [['我的自行车被人偷走了。', 'Wǒ de zìxíngchē bèi rén tōuzǒu le.', 'My bicycle was stolen.', 'Xe đạp của tôi bị người ta lấy trộm rồi.'], ['杯子被他打破了。', 'Bēizi bèi tā dǎpò le.', 'The cup was broken by him.', 'Cái cốc bị anh ấy làm vỡ.'], ['我被老师批评了。', 'Wǒ bèi lǎoshī pīpíng le.', 'I was criticised by the teacher.', 'Tôi bị thầy giáo phê bình.']] },
         { h: ['把 ↔ 被', '把 ↔ 被'], t: ['Active with 把: doer + 把 + object + V. Passive with 被: object + 被 + doer + V. Same meaning, different focus.', 'Chủ động với 把: người làm + 把 + tân ngữ + V. Bị động với 被: tân ngữ + 被 + người làm + V. Cùng nghĩa, khác trọng tâm.'],
           ex: [['弟弟把我的书弄坏了。', 'Dìdi bǎ wǒ de shū nònghuài le.', 'My brother ruined my book.', 'Em trai làm hỏng sách của tôi.'], ['我的书被弟弟弄坏了。', 'Wǒ de shū bèi dìdi nònghuài le.', 'My book was ruined by my brother.', 'Sách của tôi bị em trai làm hỏng.'], ['手机让我忘在家里了。', 'Shǒujī ràng wǒ wàng zài jiā lǐ le.', 'The phone was left at home by me.', 'Điện thoại bị tôi để quên ở nhà.']] }],
    v: [['被', 'bèi', 'by (passive marker)', 'bị, được (bị động)'], ['让', 'ràng', 'by; to let', 'bị; để cho'], ['叫', 'jiào', 'by; to call', 'bị; gọi'], ['偷', 'tōu', 'to steal', 'trộm'], ['打破', 'dǎpò', 'to break', 'làm vỡ'], ['批评', 'pīpíng', 'to criticise', 'phê bình'], ['弄坏', 'nònghuài', 'to damage', 'làm hỏng'], ['表扬', 'biǎoyáng', 'to praise', 'khen'], ['忘', 'wàng', 'to forget', 'quên'], ['发现', 'fāxiàn', 'to discover', 'phát hiện']],
    d: [['A', '你的自行车呢?', 'Nǐ de zìxíngchē ne?', 'Where is your bike?', 'Xe đạp của bạn đâu?'], ['B', '别提了,被人偷走了。', 'Bié tí le, bèi rén tōuzǒu le.', 'Do not mention it, it was stolen.', 'Đừng nhắc nữa, bị trộm mất rồi.'], ['A', '你报警了吗?', 'Nǐ bàojǐng le ma?', 'Did you call the police?', 'Bạn báo công an chưa?'], ['B', '报了,警察说一定会把它找回来。', 'Bào le, jǐngchá shuō yídìng huì bǎ tā zhǎo huílái.', 'Yes, they say they will find it.', 'Báo rồi, công an nói chắc chắn sẽ tìm lại được.']],
    pit: ['Using 被 for everything (many Chinese passives are expressed by a plain sentence: 饭做好了) and putting the negative after 被. Also dropping the doer in 让/叫 sentences.', 'Dùng 被 cho mọi thứ (nhiều câu bị động trong tiếng Trung chỉ là câu thường: 饭做好了) và đặt phủ định sau 被. Cũng sai khi bỏ người làm trong câu 让/叫.'],
    s: [['被 = receiver + 被 + doer + V + complement.', '被 = vật chịu + 被 + người làm + V + bổ ngữ.'], ['让/叫 are spoken forms; doer required.', '让/叫 là khẩu ngữ; bắt buộc có người làm.'], ['Negative goes before 被.', 'Phủ định đứng trước 被.']],
    l: ['bei', 'ba', 'gram'],
    p: [['Say: “My phone was lost.” (被)', 'Nói: “Điện thoại của tôi bị mất.” (被)', '我的手机被弄丢了。Wǒ de shǒujī bèi nòngdiū le.', '我的手机被弄丢了。Wǒ de shǒujī bèi nòngdiū le.'],
        ['Convert to 被: 老师批评了我。', 'Chuyển sang 被: 老师批评了我。', '我被老师批评了。', '我被老师批评了。']] }),

  Q(P + 'quiz-6', 'Chapter 6 quiz', 'Quiz chương 6', [
    [['“A map hangs on the wall.”', '“Trên tường treo một tấm bản đồ.”'], ['墙上挂着一张地图。', '在墙上挂着地图一张。', '墙上是挂地图。', '墙挂着在上地图。'], 0, ['place + V着 + thing.', 'nơi chốn + V着 + vật.']],
    [['Which is NOT an existential sentence?', 'Câu nào KHÔNG phải câu tồn hiện?'], ['桌子上放着一本书。', '我的书在桌子上。', '楼上住着一位老师。', '墙上挂着一张画。'], 1, ['It starts with the thing, not the place.', 'Nó mở đầu bằng vật, không phải nơi chốn.']],
    [['“Please close the door.”', '“Xin đóng cửa.”'], ['请把门关上。', '请把关门。', '请关把门。', '请门把关上。'], 0, ['把 + object + V + complement.', '把 + tân ngữ + V + bổ ngữ.']],
    [['Correct negative:', 'Phủ định đúng:'], ['我把书没放好。', '我没把书放好。', '我把没书放好。', '我把书放没好。'], 1, ['Negative before 把.', 'Phủ định trước 把.']],
    [['Which verb cannot be used in 把?', 'Động từ nào không dùng được với 把?'], ['放', '洗', '喜欢', '关'], 2, ['Feeling verbs cannot take 把.', 'Động từ cảm xúc không dùng 把.']],
    [['“My bike was stolen.”', '“Xe đạp của tôi bị trộm.”'], ['我的自行车被偷走了。', '我的自行车偷走被了。', '被我的自行车偷走。', '我偷走被自行车。'], 0, ['receiver + 被 + V + complement.', 'vật chịu + 被 + V + bổ ngữ.']],
    [['In 让/叫 passives, the doer…', 'Trong câu bị động 让/叫, người làm…'], [['can be dropped','có thể bỏ'], ['must be present','bắt buộc có'], ['comes at the end','đứng cuối câu'], ['is marked by 把','được đánh dấu bằng 把']], 1, ['让/叫 need an agent.', '让/叫 cần người làm.']],
    [['Convert: 他打破了杯子。', 'Chuyển: 他打破了杯子。'], ['杯子被他打破了。', '他被杯子打破了。', '杯子打破被他。', '被杯子他打破了。'], 0, ['object + 被 + doer + V.', 'vật + 被 + người làm + V.']],
  ]),
]));
// ===== Chương 7 =====
secs.push(SEC('Chapter 7 — Hobbies, ability and complements', 'Chương 7 — Sở thích, khả năng và các bổ ngữ',
  'Bổ ngữ trạng thái 得, bổ ngữ khả năng, sở thích, 会/能/可以, 对…感兴趣.', [
  D(P + '7-1', '7.1 Degree complement with 得', '7.1 Bổ ngữ trạng thái với 得', 'V得 + adj: đánh giá cách thức, lặp động từ, so sánh với 比.', {
    n: '7.1',
    g: [['Describe how well/fast someone does something', 'Mô tả ai làm việc gì tốt/nhanh thế nào'], ['Repeat the verb when there is an object', 'Lặp động từ khi có tân ngữ'], ['Compare with 比 and 没有', 'So sánh với 比 và 没有']],
    b: [`<p>The <strong>degree complement</strong> evaluates the way an action is done: <strong>V + 得 + adjective</strong>. With an object, repeat the verb: <strong>V + O + V + 得 + adj</strong>, or drop the first V: <strong>O + V + 得 + adj</strong>. Do not confuse it with 的 (possession) and 地 (before verbs): 得 follows a verb.</p>`,
        `<p><strong>Bổ ngữ trạng thái</strong> đánh giá cách thức hành động: <strong>V + 得 + tính từ</strong>. Có tân ngữ thì lặp động từ: <strong>V + O + V + 得 + tính từ</strong>, hoặc bỏ động từ đầu: <strong>O + V + 得 + tính từ</strong>. Đừng lẫn với 的 (sở hữu) và 地 (đứng trước động từ): 得 đứng sau động từ.</p>`],
    gr: [{ h: ['Pattern and negation', 'Mẫu câu và phủ định'], t: ['Negate the adjective: 说得不好. Questions: 说得好不好? / 说得怎么样? Intensifiers: 很, 非常 go before the adjective.', 'Phủ định tính từ: 说得不好. Hỏi: 说得好不好? / 说得怎么样? Từ chỉ mức độ 很, 非常 đặt trước tính từ.'],
           ex: [['他跑得很快。', 'Tā pǎo de hěn kuài.', 'He runs very fast.', 'Anh ấy chạy rất nhanh.'], ['她说汉语说得很流利。', 'Tā shuō Hànyǔ shuō de hěn liúlì.', 'She speaks Chinese very fluently.', 'Cô ấy nói tiếng Trung rất lưu loát.'], ['我写字写得不太好。', 'Wǒ xiě zì xiě de bú tài hǎo.', 'I do not write characters very well.', 'Tôi viết chữ không giỏi lắm.']] },
         { h: ['Comparing degree complements', 'So sánh bổ ngữ trạng thái'], t: ['Put 比 before the adjective: V 得 + 比 + B + adj, or before V in the second clause. Use 没有 for “not as … as”.', 'Đặt 比 sau 得: V 得 + 比 + B + adj, hoặc trước V ở vế hai. Dùng 没有 cho “không … bằng”.'],
           ex: [['他唱得比我好。', 'Tā chàng de bǐ wǒ hǎo.', 'He sings better than I do.', 'Anh ấy hát hay hơn tôi.'], ['我游得没有他快。', 'Wǒ yóu de méiyǒu tā kuài.', 'I do not swim as fast as he does.', 'Tôi bơi không nhanh bằng anh ấy.'], ['你汉语说得真好!', 'Nǐ Hànyǔ shuō de zhēn hǎo!', 'Your Chinese is really good!', 'Bạn nói tiếng Trung giỏi thật!']] }],
    v: [['得', 'de', 'degree complement marker', 'từ nối bổ ngữ trạng thái'], ['流利', 'liúlì', 'fluent', 'lưu loát'], ['唱歌', 'chànggē', 'to sing', 'hát'], ['游泳', 'yóuyǒng', 'to swim', 'bơi'], ['跳舞', 'tiàowǔ', 'to dance', 'nhảy múa'], ['开车', 'kāichē', 'to drive', 'lái xe'], ['写', 'xiě', 'to write', 'viết'], ['快', 'kuài', 'fast', 'nhanh'], ['慢', 'màn', 'slow', 'chậm'], ['认真', 'rènzhēn', 'serious, careful', 'nghiêm túc, cẩn thận']],
    d: [['A', '你汉语说得真流利,学了多久?', 'Nǐ Hànyǔ shuō de zhēn liúlì, xuéle duō jiǔ?', 'Your Chinese is fluent, how long?', 'Bạn nói tiếng Trung lưu loát thật, học bao lâu rồi?'], ['B', '哪里哪里,我说得还不太好。', 'Nǎlǐ nǎlǐ, wǒ shuō de hái bú tài hǎo.', 'Not at all, mine is not very good yet.', 'Đâu có đâu có, tôi nói vẫn chưa tốt lắm.'], ['A', '你写字写得比我认真。', 'Nǐ xiě zì xiě de bǐ wǒ rènzhēn.', 'You write more carefully than me.', 'Bạn viết chữ cẩn thận hơn tôi.']],
    pit: ['Forgetting to repeat the verb (我说汉语得很好 is wrong), using 的 for 得, and adding a bare adjective without 很 in plain statements: 他跑得快 sounds like a comparison, so say 他跑得很快.', 'Quên lặp động từ (我说汉语得很好 sai), dùng 的 thay 得, và để tính từ trơ trọi mà không có 很 trong câu kể: 他跑得快 nghe như so sánh, nên nói 他跑得很快.'],
    s: [['V + 得 + adj evaluates how an action is done.', 'V + 得 + tính từ đánh giá cách làm.'], ['With object: V O V 得 adj.', 'Có tân ngữ: V O V 得 adj.'], ['Negate the adjective, not the verb.', 'Phủ định tính từ, không phủ định động từ.']],
    l: ['deg', 'compl', 'gram'],
    p: [['Say: “She dances very well.”', 'Nói: “Cô ấy nhảy rất đẹp.”', '她跳舞跳得很好。Tā tiàowǔ tiào de hěn hǎo.', '她跳舞跳得很好。Tā tiàowǔ tiào de hěn hǎo.'],
        ['Say: “I do not run as fast as him.”', 'Nói: “Tôi chạy không nhanh bằng anh ấy.”', '我跑得没有他快。Wǒ pǎo de méiyǒu tā kuài.', '我跑得没有他快。Wǒ pǎo de méiyǒu tā kuài.']] }),

  D(P + '7-2', '7.2 Potential complements: 看得懂 / 看不懂', '7.2 Bổ ngữ khả năng: 看得懂 / 看不懂', 'Chèn 得/不 vào bổ ngữ kết quả/xu hướng; so với 能; những cặp dùng nhiều.', {
    n: '7.2',
    g: [['Form potential complements from result complements', 'Tạo bổ ngữ khả năng từ bổ ngữ kết quả'], ['Distinguish 看不懂 from 不能看', 'Phân biệt 看不懂 và 不能看'], ['Use common set phrases', 'Dùng các cụm hay gặp']],
    b: [`<p>Insert <strong>得</strong> (can) or <strong>不</strong> (cannot) between the verb and its result/direction complement: 看懂 → <strong>看得懂 / 看不懂</strong>; 进来 → <strong>进得来 / 进不来</strong>. Potential complements express whether the result is <em>achievable</em> in the circumstances. The negative form is far more common than the positive.</p>`,
        `<p>Chèn <strong>得</strong> (có thể) hoặc <strong>不</strong> (không thể) vào giữa động từ và bổ ngữ kết quả/xu hướng: 看懂 → <strong>看得懂 / 看不懂</strong>; 进来 → <strong>进得来 / 进不来</strong>. Bổ ngữ khả năng cho biết kết quả có <em>đạt được</em> trong hoàn cảnh hay không. Dạng phủ định phổ biến hơn dạng khẳng định rất nhiều.</p>`],
    gr: [{ h: ['Pattern', 'Mẫu câu'], t: ['V + 得/不 + result. Question: V得V不 + result? or V得 + result + 吗? Not the same as 能/不能 (permission or general ability): 看不懂 is about outcome, 不能看 about permission.', 'V + 得/不 + kết quả. Hỏi: V得V不 + kết quả? hoặc V得 + kết quả + 吗? Khác với 能/不能 (cho phép hoặc năng lực chung): 看不懂 nói về kết quả, 不能看 nói về việc được phép.'],
           ex: [['这个字太小,我看不清楚。', 'Zhège zì tài xiǎo, wǒ kàn bu qīngchu.', 'This text is too small, I cannot see it clearly.', 'Chữ này nhỏ quá, tôi nhìn không rõ.'], ['你听得懂他的话吗?', 'Nǐ tīng de dǒng tā de huà ma?', 'Can you understand what he says?', 'Bạn nghe có hiểu anh ấy nói không?'], ['菜太多了,我们吃不完。', 'Cài tài duō le, wǒmen chī bu wán.', 'There is too much food, we cannot finish.', 'Đồ ăn nhiều quá, chúng ta ăn không hết.']] },
         { h: ['Set phrases worth memorising', 'Các cụm nên thuộc'], t: ['来得及 / 来不及 (in time / too late), 买得起 / 买不起 (can / cannot afford), 吃得下 / 吃不下 (can / cannot eat any more).', '来得及 / 来不及 (kịp / không kịp), 买得起 / 买不起 (đủ / không đủ tiền mua), 吃得下 / 吃不下 (ăn nổi / không ăn nổi).'],
           ex: [['别着急,还来得及。', 'Bié zháojí, hái láidejí.', 'Do not worry, there is still time.', 'Đừng lo, vẫn còn kịp.'], ['这么贵的车,我买不起。', 'Zhème guì de chē, wǒ mǎi bu qǐ.', 'I cannot afford such an expensive car.', 'Xe đắt thế này, tôi không mua nổi.'], ['我吃饱了,再也吃不下了。', 'Wǒ chībǎo le, zài yě chī bu xià le.', 'I am full, I cannot eat any more.', 'Tôi no rồi, không ăn thêm nổi nữa.']] }],
    v: [['得', 'de', 'can (in potential complement)', 'được (bổ ngữ khả năng)'], ['不', 'bu', 'cannot (in potential complement)', 'không được (bổ ngữ khả năng)'], ['来得及', 'láidejí', 'to be in time', 'kịp'], ['来不及', 'láibují', 'too late', 'không kịp'], ['买得起', 'mǎi de qǐ', 'can afford', 'mua nổi'], ['听不懂', 'tīng bu dǒng', 'cannot understand (by listening)', 'nghe không hiểu'], ['看不清', 'kàn bu qīng', 'cannot see clearly', 'nhìn không rõ'], ['吃不下', 'chī bu xià', 'cannot eat more', 'ăn không nổi'], ['记得住', 'jì de zhù', 'can remember', 'nhớ được'], ['找不到', 'zhǎo bu dào', 'cannot find', 'tìm không thấy']],
    d: [['A', '老师说得太快了,我听不懂。', 'Lǎoshī shuō de tài kuài le, wǒ tīng bu dǒng.', 'The teacher speaks too fast, I cannot follow.', 'Thầy nói nhanh quá, tôi nghe không hiểu.'], ['B', '那你问问他,看他能不能说慢一点儿。', 'Nà nǐ wènwen tā, kàn tā néng bu néng shuō màn yìdiǎnr.', 'Ask whether he can slow down.', 'Vậy bạn hỏi xem thầy nói chậm hơn được không.'], ['A', '这个生词我老记不住。', 'Zhège shēngcí wǒ lǎo jì bu zhù.', 'I can never remember this new word.', 'Từ mới này tôi cứ nhớ không nổi.'], ['B', '多写几遍就记得住了。', 'Duō xiě jǐ biàn jiù jì de zhù le.', 'Write it several times and you will.', 'Viết thêm vài lượt là nhớ được.']],
    pit: ['Using 不能 where 不 + complement is needed (我不能听懂 is wrong) and adding 了 to the potential form. Also keep the object after the complement: 看不懂这本书.', 'Dùng 不能 chỗ cần 不 + bổ ngữ (我不能听懂 sai) và thêm 了 vào dạng khả năng. Tân ngữ đứng sau bổ ngữ: 看不懂这本书.'],
    s: [['V得/不 + result expresses can/cannot reach the result.', 'V得/不 + kết quả: có/không đạt được kết quả.'], ['Negative is more common.', 'Dạng phủ định phổ biến hơn.'], ['Memorise 来得及, 买不起, 吃不下.', 'Thuộc 来得及, 买不起, 吃不下.']],
    l: ['pot', 'resc', 'mdbg'],
    p: [['Say: “I cannot find my key.”', 'Nói: “Tôi tìm không thấy chìa khoá.”', '我找不到我的钥匙。Wǒ zhǎo bu dào wǒ de yàoshi.', '我找不到我的钥匙。Wǒ zhǎo bu dào wǒ de yàoshi.'],
        ['Say: “Can you understand?” (listening)', 'Hỏi: “Bạn nghe có hiểu không?”', '你听得懂吗? Nǐ tīng de dǒng ma?', '你听得懂吗? Nǐ tīng de dǒng ma?']] }),

  D(P + '7-3', '7.3 Hobbies, ability and interest', '7.3 Sở thích, năng lực và hứng thú', 'Sở thích, 会/能/可以, 对…感兴趣, 又…又…, 比赛.', {
    n: '7.3',
    g: [['Talk about hobbies and sports', 'Nói về sở thích và thể thao'], ['Choose between 会, 能, 可以', 'Chọn giữa 会, 能, 可以'], ['Use 对…感兴趣 and 又…又…', 'Dùng 对…感兴趣 và 又…又…']],
    b: [`<p>Three “can” words: <strong>会</strong> = learned skill, <strong>能</strong> = physical ability or circumstance, <strong>可以</strong> = permission or possibility. To show interest, use <strong>对 + topic + 感兴趣</strong>. To list two qualities: <strong>又 A 又 B</strong>.</p>`,
        `<p>Ba từ “có thể”: <strong>会</strong> = kỹ năng đã học, <strong>能</strong> = năng lực/hoàn cảnh cho phép, <strong>可以</strong> = được phép hoặc có khả năng. Thể hiện hứng thú dùng <strong>对 + chủ đề + 感兴趣</strong>. Liệt kê hai tính chất: <strong>又 A 又 B</strong>.</p>`],
    gr: [{ h: ['会 / 能 / 可以', '会 / 能 / 可以'], t: ['会游泳 (I know how to swim); 今天不能游泳 (cannot today, e.g. ill); 这里可以游泳 (it is allowed here).', '会游泳 (biết bơi); 今天不能游泳 (hôm nay không bơi được, vd. đang ốm); 这里可以游泳 (ở đây được phép bơi).'],
           ex: [['我会打篮球,但是今天不能打。', 'Wǒ huì dǎ lánqiú, dànshì jīntiān bù néng dǎ.', 'I can play basketball but not today.', 'Tôi biết chơi bóng rổ nhưng hôm nay không chơi được.'], ['这里可以拍照吗?', 'Zhèlǐ kěyǐ pāizhào ma?', 'May I take photos here?', 'Ở đây chụp ảnh được không?'], ['他能喝三瓶啤酒。', 'Tā néng hē sān píng píjiǔ.', 'He is able to drink three bottles of beer.', 'Anh ấy uống được ba chai bia.']] },
         { h: ['对…感兴趣 and 又…又…', '对…感兴趣 và 又…又…'], t: ['Interest: 对 + noun + 很感兴趣 (adverb before 感). 又…又… joins two adjectives/verbs of the same subject.', 'Hứng thú: 对 + danh từ + 很感兴趣 (phó từ đứng trước 感). 又…又… nối hai tính từ/động từ cùng chủ ngữ.'],
           ex: [['我对中国历史很感兴趣。', 'Wǒ duì Zhōngguó lìshǐ hěn gǎn xìngqù.', 'I am very interested in Chinese history.', 'Tôi rất hứng thú với lịch sử Trung Quốc.'], ['这首歌又好听又好学。', 'Zhè shǒu gē yòu hǎotīng yòu hǎo xué.', 'This song is both nice and easy to learn.', 'Bài hát này vừa hay vừa dễ học.'], ['他又会唱歌又会跳舞。', 'Tā yòu huì chànggē yòu huì tiàowǔ.', 'He can both sing and dance.', 'Anh ấy vừa biết hát vừa biết nhảy.']] }],
    v: [['爱好', 'àihào', 'hobby', 'sở thích'], ['篮球', 'lánqiú', 'basketball', 'bóng rổ'], ['足球', 'zúqiú', 'football', 'bóng đá'], ['比赛', 'bǐsài', 'match, contest', 'trận đấu, cuộc thi'], ['音乐', 'yīnyuè', 'music', 'âm nhạc'], ['拍照', 'pāizhào', 'to take photos', 'chụp ảnh'], ['爬山', 'páshān', 'to climb mountains', 'leo núi'], ['感兴趣', 'gǎn xìngqù', 'interested', 'hứng thú'], ['历史', 'lìshǐ', 'history', 'lịch sử'], ['参加', 'cānjiā', 'to take part in', 'tham gia']],
    d: [['A', '你有什么爱好?', 'Nǐ yǒu shénme àihào?', 'What are your hobbies?', 'Bạn có sở thích gì?'], ['B', '我喜欢运动,会打篮球,也会游泳。', 'Wǒ xǐhuan yùndòng, huì dǎ lánqiú, yě huì yóuyǒng.', 'I like sports; I can play basketball and swim.', 'Tôi thích thể thao, biết chơi bóng rổ và bơi.'], ['A', '下个月学校有比赛,你想参加吗?', 'Xià ge yuè xuéxiào yǒu bǐsài, nǐ xiǎng cānjiā ma?', 'There is a contest next month, want to join?', 'Tháng sau trường có cuộc thi, bạn muốn tham gia không?'], ['B', '我对比赛很感兴趣,可是脚疼,现在不能练习。', 'Wǒ duì bǐsài hěn gǎn xìngqù, kěshì jiǎo téng, xiànzài bù néng liànxí.', 'Very interested, but my foot hurts and I cannot practise now.', 'Rất hứng thú nhưng chân đau, bây giờ không luyện tập được.']],
    pit: ['Using 能 for a learned skill (我能游泳 sounds like “I am able at this moment”) and writing 感兴趣对 or 对…有兴趣 with 很 in the wrong place (很对…感兴趣 is awkward).', 'Dùng 能 cho kỹ năng đã học (我能游泳 nghe như “lúc này tôi bơi được”) và đặt 很 sai chỗ (很对…感兴趣 nghe gượng).'],
    s: [['会 = learned skill; 能 = ability/circumstance; 可以 = permission.', '会 = kỹ năng; 能 = khả năng/hoàn cảnh; 可以 = cho phép.'], ['对…感兴趣 expresses interest.', '对…感兴趣 diễn đạt hứng thú.'], ['又 A 又 B lists two qualities.', '又 A 又 B liệt kê hai tính chất.']],
    l: ['gram', 'yoyo', 'wikib'],
    p: [['Choose 会/能/可以: “Can I sit here?”', 'Chọn 会/能/可以: “Tôi ngồi đây được không?”', '可以 (permission): 我可以坐这儿吗?', '可以 (cho phép): 我可以坐这儿吗?'],
        ['Say: “I am interested in music.”', 'Nói: “Tôi hứng thú với âm nhạc.”', '我对音乐感兴趣。Wǒ duì yīnyuè gǎn xìngqù.', '我对音乐感兴趣。Wǒ duì yīnyuè gǎn xìngqù.']] }),

  Q(P + 'quiz-7', 'Chapter 7 quiz', 'Quiz chương 7', [
    [['“He runs very fast.”', '“Anh ấy chạy rất nhanh.”'], ['他跑得很快。', '他很跑得快。', '他跑的很快。', '他得跑很快。'], 0, ['V + 得 + adj.', 'V + 得 + tính từ.']],
    [['“She speaks Chinese well.” (with object)', '“Cô ấy nói tiếng Trung giỏi.”'], ['她说汉语说得很好。', '她说得汉语很好。', '她汉语说很得好。', '她说汉语得很好。'], 0, ['Repeat the verb.', 'Lặp động từ.']],
    [['“I cannot understand (listening).”', '“Tôi nghe không hiểu.”'], ['我听不懂。', '我不能听懂。', '我不听懂。', '我听懂不。'], 0, ['V不+result.', 'V不+kết quả.']],
    [['“We cannot finish eating.”', '“Chúng ta ăn không hết.”'], ['我们吃不完。', '我们不吃完。', '我们吃完不。', '我们没吃不完。'], 0, ['吃不完.', '吃不完.']],
    [['“Cannot afford” is:', '“Không mua nổi” là:'], ['买不起', '买不了', '不买起', '买起不'], 0, ['买不起.', '买不起.']],
    [['Which word means permission?', 'Từ nào chỉ sự cho phép?'], ['会', '可以', '得', '比'], 1, ['可以.', '可以.']],
    [['A learned skill (swim):', 'Kỹ năng đã học (bơi):'], ['我会游泳。', '我可以会游泳。', '我得游泳。', '我很游泳。'], 0, ['会 + verb.', '会 + động từ.']],
    [['“Interested in history”:', '“Hứng thú với lịch sử”:'], ['对历史感兴趣', '历史对感兴趣', '感兴趣对历史', '对感兴趣历史'], 0, ['对 + noun + 感兴趣.', '对 + danh từ + 感兴趣.']],
  ]),
]));
// ===== Chương 8 =====
secs.push(SEC('Chapter 8 — Festivals and social life', 'Chương 8 — Lễ tết và giao tiếp xã hội',
  'Lễ tết Trung Hoa, lời chúc, mời và từ chối, điện thoại và WeChat.', [
  D(P + '8-1', '8.1 Chinese festivals and greetings', '8.1 Lễ tết Trung Hoa và lời chúc', 'Xuân Tiết, Nguyên tiêu, Thanh Minh, Đoan Ngọ, Trung thu; lời chúc; 把 và 被 trong kể chuyện.', {
    n: '8.1',
    g: [['Name the main festivals and their customs', 'Gọi tên các lễ tết chính và phong tục'], ['Use festival greetings', 'Dùng lời chúc theo lễ'], ['Tell a short festival story using earlier grammar', 'Kể chuyện lễ tết ngắn bằng ngữ pháp đã học']],
    b: [`<p>Festivals follow the <strong>lunar calendar</strong> (农历) except Qingming, which follows a solar term. Dates are given as month + day of the lunar calendar: 农历正月初一 (the first day of the first month). The Spring Festival is the most important and is followed by a week-long public holiday. Mid-Autumn has mooncakes; Dragon Boat has <em>zòngzi</em> and boat races.</p>`,
        `<p>Lễ tết theo <strong>âm lịch</strong> (农历), trừ Thanh Minh theo tiết khí dương lịch. Ngày ghi theo tháng và ngày âm: 农历正月初一 (mồng một tháng Giêng). Xuân Tiết là lễ quan trọng nhất và được nghỉ khoảng một tuần. Trung thu có bánh trung thu; Đoan Ngọ có bánh <em>zòngzi</em> và đua thuyền rồng.</p>`],
    gr: [{ h: ['Festival calendar and customs', 'Lịch lễ và phong tục'], t: ['春节 (1st of month 1), 元宵节 (15th of month 1), 清明节 (about 4–5 April), 端午节 (5th of month 5), 中秋节 (15th of month 8). Customs: 吃饺子, 放鞭炮, 发红包, 赏月, 吃月饼, 赛龙舟.', '春节 (mồng 1 tháng 1), 元宵节 (rằm tháng 1), 清明节 (khoảng 4–5/4), 端午节 (mồng 5 tháng 5), 中秋节 (rằm tháng 8). Phong tục: 吃饺子, 放鞭炮, 发红包, 赏月, 吃月饼, 赛龙舟.'],
           ex: [['春节的时候,全家人在一起吃饺子。', 'Chūnjié de shíhou, quánjiā rén zài yìqǐ chī jiǎozi.', 'At Spring Festival the whole family eats dumplings together.', 'Dịp Tết cả nhà quây quần ăn bánh sủi cảo.'], ['中秋节晚上,大家一边赏月,一边吃月饼。', 'Zhōngqiūjié wǎnshang, dàjiā yìbiān shǎngyuè, yìbiān chī yuèbing.', 'On Mid-Autumn night people admire the moon and eat mooncakes.', 'Đêm Trung thu mọi người vừa ngắm trăng vừa ăn bánh.'], ['长辈给孩子发红包。', 'Zhǎngbèi gěi háizi fā hóngbāo.', 'Elders give red envelopes to the children.', 'Người lớn lì xì cho trẻ con.']] },
         { h: ['Greetings', 'Lời chúc'], t: ['新年快乐 is general; 恭喜发财 is used among adults; 节日快乐 for any festival; 身体健康 for health; 万事如意 for “everything as you wish”.', '新年快乐 là chúc chung; 恭喜发财 dùng giữa người lớn; 节日快乐 cho mọi lễ; 身体健康 chúc sức khoẻ; 万事如意 là “mọi sự như ý”.'],
           ex: [['祝你新年快乐,身体健康!', 'Zhù nǐ xīnnián kuàilè, shēntǐ jiànkāng!', 'Happy New Year and good health!', 'Chúc bạn năm mới vui vẻ, sức khoẻ!'], ['祝你们中秋节快乐!', 'Zhù nǐmen Zhōngqiūjié kuàilè!', 'Happy Mid-Autumn Festival!', 'Chúc các bạn Trung thu vui vẻ!'], ['祝你万事如意!', 'Zhù nǐ wànshì rúyì!', 'May everything go as you wish!', 'Chúc bạn mọi sự như ý!']] }],
    v: [['春节', 'Chūnjié', 'Spring Festival (CNY)', 'Tết Xuân (Tết Nguyên đán)'], ['元宵节', 'Yuánxiāojié', 'Lantern Festival', 'Tết Nguyên tiêu'], ['清明节', 'Qīngmíngjié', 'Qingming (tomb-sweeping)', 'Tiết Thanh Minh'], ['端午节', 'Duānwǔjié', 'Dragon Boat Festival', 'Tết Đoan Ngọ'], ['中秋节', 'Zhōngqiūjié', 'Mid-Autumn Festival', 'Tết Trung thu'], ['饺子', 'jiǎozi', 'dumplings', 'sủi cảo'], ['月饼', 'yuèbing', 'mooncake', 'bánh trung thu'], ['红包', 'hóngbāo', 'red envelope', 'bao lì xì'], ['农历', 'nónglì', 'lunar calendar', 'âm lịch'], ['祝', 'zhù', 'to wish', 'chúc']],
    d: [['小明', '马上就要春节了,你回家吗?', 'Mǎshàng jiùyào Chūnjié le, nǐ huí jiā ma?', 'Spring Festival is coming, are you going home?', 'Sắp Tết rồi, bạn có về nhà không?'], ['小丽', '回,我们全家要一起吃年夜饭。', 'Huí, wǒmen quánjiā yào yìqǐ chī niányèfàn.', 'Yes, the whole family has a reunion dinner.', 'Có, cả nhà sẽ cùng ăn bữa cơm tất niên.'], ['小明', '你收到红包了吗?', 'Nǐ shōudào hóngbāo le ma?', 'Did you receive a red envelope?', 'Bạn nhận được lì xì chưa?'], ['小丽', '收到了,新年快乐!', 'Shōudào le, xīnnián kuàilè!', 'Yes! Happy New Year!', 'Nhận rồi, năm mới vui vẻ!']],
    pit: ['Translating “Happy New Year” with 年新快乐 or using 恭喜发财 to elders (use 身体健康 for elders). Also dates: say 农历 for lunar dates, not just 月 日.', 'Dịch “Chúc mừng năm mới” thành 年新快乐 hoặc dùng 恭喜发财 với người lớn tuổi (với người lớn tuổi nên chúc 身体健康). Ngày âm phải ghi 农历 rõ ràng.'],
    s: [['Most festivals follow the lunar calendar.', 'Đa số lễ theo âm lịch.'], ['Know one custom per festival.', 'Biết mỗi lễ một phong tục.'], ['祝你… is the basic wish pattern.', '祝你… là mẫu chúc cơ bản.']],
    l: ['cny', 'midau', 'dragon', 'holiday'],
    p: [['Say: “Happy Mid-Autumn Festival, enjoy the mooncakes!”', 'Nói: “Trung thu vui vẻ, chúc ăn bánh ngon!”', '中秋节快乐,多吃月饼! Zhōngqiūjié kuàilè, duō chī yuèbing!', '中秋节快乐,多吃月饼! Zhōngqiūjié kuàilè, duō chī yuèbing!'],
        ['What do people give children at Spring Festival?', 'Dịp Tết người lớn tặng trẻ con gì?', '红包 (red envelope).', '红包 (bao lì xì).']] }),

  D(P + '8-2', '8.2 Invitations, gifts and polite refusal', '8.2 Lời mời, quà tặng và từ chối khéo', 'Mời, nhận, từ chối lịch sự; 客气话; 如果…的话; 要是.', {
    n: '8.2',
    g: [['Invite, accept and decline politely', 'Mời, nhận lời và từ chối lịch sự'], ['Use courtesy expressions for gifts and visits', 'Dùng lời khách sáo khi tặng quà, thăm nhà'], ['Make polite conditionals with 如果/要是', 'Đặt câu điều kiện lịch sự với 如果/要是']],
    b: [`<p>Chinese politeness favours <strong>indirect refusal</strong>: say 不好意思 or 可能不行 and give a reason rather than a flat 不. For visits bring a small gift and use courtesy phrases such as <strong>不用客气</strong>, <strong>打扰了</strong>, <strong>随便坐</strong>. Conditionals: <strong>如果/要是 … 就 …</strong>.</p>`,
        `<p>Phép lịch sự của người Trung ưa <strong>từ chối gián tiếp</strong>: nói 不好意思 hoặc 可能不行 kèm lý do thay vì nói thẳng 不. Đi thăm nhà thì mang quà nhỏ và dùng lời khách sáo như <strong>不用客气</strong>, <strong>打扰了</strong>, <strong>随便坐</strong>. Câu điều kiện: <strong>如果/要是 … 就 …</strong>.</p>`],
    gr: [{ h: ['Invite and answer', 'Mời và đáp lời'], t: ['Invite: 请你来…; 你有时间吗? Accept: 好啊,我一定去. Decline gently: 不好意思,我那天有事,下次吧.', 'Mời: 请你来…; 你有时间吗? Nhận lời: 好啊,我一定去. Từ chối khéo: 不好意思,我那天有事,下次吧.'],
           ex: [['这个星期六是我的生日,请你来我家玩儿。', 'Zhège xīngqīliù shì wǒ de shēngrì, qǐng nǐ lái wǒ jiā wánr.', 'This Saturday is my birthday, please come to my place.', 'Thứ Bảy này là sinh nhật tôi, mời bạn đến nhà chơi.'], ['谢谢你的邀请,可是那天我要加班。', 'Xièxie nǐ de yāoqǐng, kěshì nàtiān wǒ yào jiābān.', 'Thanks for inviting me, but I have to work overtime that day.', 'Cảm ơn lời mời nhưng hôm đó tôi phải tăng ca.'], ['这是一点儿小礼物,请收下。', 'Zhè shì yìdiǎnr xiǎo lǐwù, qǐng shōuxià.', 'This is a small gift, please accept.', 'Đây là món quà nhỏ, xin nhận cho.']] },
         { h: ['如果 / 要是 … 就 …', '如果 / 要是 … 就 …'], t: ['如果 introduces a condition (more formal), 要是 is spoken; 的话 can close the clause. The result clause usually has 就.', '如果 mở vế điều kiện (trang trọng hơn), 要是 là khẩu ngữ; 的话 có thể khép vế câu. Vế kết quả thường có 就.'],
           ex: [['如果明天不下雨,我们就去爬山。', 'Rúguǒ míngtiān bú xià yǔ, wǒmen jiù qù páshān.', 'If it does not rain tomorrow we will climb the mountain.', 'Nếu ngày mai không mưa thì chúng ta đi leo núi.'], ['要是你有时间的话,就来吧。', 'Yàoshi nǐ yǒu shíjiān dehuà, jiù lái ba.', 'If you have time, come along.', 'Nếu bạn có thời gian thì cứ đến.'], ['你不舒服的话,就别去了。', 'Nǐ bù shūfu dehuà, jiù bié qù le.', 'If you are unwell, do not go.', 'Nếu bạn không khoẻ thì đừng đi nữa.']] }],
    v: [['邀请', 'yāoqǐng', 'to invite; invitation', 'mời; lời mời'], ['生日', 'shēngrì', 'birthday', 'sinh nhật'], ['礼物', 'lǐwù', 'gift', 'quà tặng'], ['收', 'shōu', 'to receive', 'nhận'], ['加班', 'jiābān', 'to work overtime', 'tăng ca'], ['不好意思', 'bù hǎoyìsi', 'sorry, embarrassed', 'ngại quá, xin lỗi'], ['客气', 'kèqi', 'polite, courteous', 'khách sáo'], ['打扰', 'dǎrǎo', 'to disturb', 'làm phiền'], ['如果', 'rúguǒ', 'if', 'nếu'], ['要是', 'yàoshi', 'if (spoken)', 'nếu như (khẩu ngữ)']],
    d: [['小李', '周末我们公司有聚会,你想来吗?', 'Zhōumò wǒmen gōngsī yǒu jùhuì, nǐ xiǎng lái ma?', 'Our company has a party at the weekend, want to come?', 'Cuối tuần công ty tôi có tiệc, bạn muốn đến không?'], ['小张', '谢谢你,不过周六我要去看爷爷。', 'Xièxie nǐ, búguò zhōuliù wǒ yào qù kàn yéye.', 'Thanks, but I am visiting grandpa on Saturday.', 'Cảm ơn, nhưng thứ Bảy tôi phải đi thăm ông.'], ['小李', '没关系,如果你周日有空,就来吧。', 'Méi guānxi, rúguǒ nǐ zhōurì yǒu kòng, jiù lái ba.', 'No problem, if you are free on Sunday, come then.', 'Không sao, nếu Chủ nhật bạn rảnh thì đến nhé.'], ['小张', '好的,谢谢你的邀请!', 'Hǎo de, xièxie nǐ de yāoqǐng!', 'OK, thanks for the invitation!', 'Được, cảm ơn lời mời của bạn!']],
    pit: ['Saying a blunt 我不去 to a host, and using 如果 without 就 in the result clause. Also confusing 邀请 (invite, verb) with 请 (spoken “please invite”): both fine, but 邀请 is more formal.', 'Nói thẳng 我不去 với chủ nhà, và dùng 如果 mà vế sau thiếu 就. Cũng hay lẫn 邀请 (mời, trang trọng) với 请 (mời, khẩu ngữ).'],
    s: [['Decline indirectly with a reason.', 'Từ chối gián tiếp kèm lý do.'], ['Courtesy phrases: 客气, 打扰, 不好意思.', 'Lời khách sáo: 客气, 打扰, 不好意思.'], ['如果/要是 … 就 …', '如果/要是 … 就 …']],
    l: ['ruguo', 'hongbao', 'gram'],
    p: [['Decline politely: “Sorry, I have an exam on Sunday.”', 'Từ chối lịch sự: “Xin lỗi, Chủ nhật tôi có thi.”', '不好意思,星期天我有考试。Bù hǎoyìsi, xīngqītiān wǒ yǒu kǎoshì.', '不好意思,星期天我有考试。Bù hǎoyìsi, xīngqītiān wǒ yǒu kǎoshì.'],
        ['Say: “If you are tired, rest.”', 'Nói: “Nếu bạn mệt thì nghỉ đi.”', '如果你累了,就休息吧。Rúguǒ nǐ lèi le, jiù xiūxi ba.', '如果你累了,就休息吧。Rúguǒ nǐ lèi le, jiù xiūxi ba.']] }),

  D(P + '8-3', '8.3 Phone calls and WeChat', '8.3 Gọi điện và WeChat', 'Gọi/nhận điện thoại, để lại lời nhắn, nhắn WeChat, số điện thoại, yāo.', {
    n: '8.3',
    g: [['Make and answer calls in Chinese', 'Gọi và nghe điện thoại bằng tiếng Trung'], ['Leave a message and arrange a time', 'Để lại lời nhắn và hẹn giờ'], ['Write short WeChat messages', 'Viết tin nhắn WeChat ngắn']],
    b: [`<p>A phone call opens with <strong>喂</strong> (wéi). To ask for someone: <strong>请问,…在吗?</strong>. To identify yourself: <strong>我是…</strong>. Numbers are read digit by digit; 1 is read <em>yāo</em>. In China most people message and pay with <strong>WeChat (微信)</strong>, so you must know voice messages (语音) and “add friend” (加好友).</p>`,
        `<p>Cuộc gọi mở đầu bằng <strong>喂</strong> (wéi). Hỏi người cần gặp: <strong>请问,…在吗?</strong>. Xưng danh: <strong>我是…</strong>. Số đọc từng chữ số; số 1 đọc <em>yāo</em>. Ở Trung Quốc phần lớn người dân nhắn tin và thanh toán bằng <strong>WeChat (微信)</strong>, nên cần biết tin nhắn thoại (语音) và “kết bạn” (加好友).</p>`],
    gr: [{ h: ['Phone patterns', 'Mẫu điện thoại'], t: ['Answering: 喂,你好. Asking: 请问,王老师在吗? Replacing: 他不在,你有什么事? Message: 请他给我回电话.', 'Nhận máy: 喂,你好. Hỏi: 请问,王老师在吗? Đáp: 他不在,你有什么事? Nhắn: 请他给我回电话.'],
           ex: [['喂,请问,小李在吗?', 'Wéi, qǐngwèn, Xiǎo Lǐ zài ma?', 'Hello, is Xiao Li there?', 'A lô, cho hỏi Tiểu Lý có đó không?'], ['他现在不在,要我告诉他什么吗?', 'Tā xiànzài bú zài, yào wǒ gàosu tā shénme ma?', 'He is out; shall I tell him anything?', 'Anh ấy không có đây, bạn có muốn nhắn gì không?'], ['我的电话号码是一三八,零零零零,一二三四。', 'Wǒ de diànhuà hàomǎ shì yāo sān bā, líng líng líng líng, yāo èr sān sì.', 'My number is 138-0000-1234.', 'Số điện thoại của tôi là 138-0000-1234.']] },
         { h: ['WeChat and short messages', 'WeChat và tin nhắn ngắn'], t: ['Common words: 发消息, 发语音, 加好友, 扫一扫, 转账. Messages drop pronouns and use particles 吧, 啊, 哦, 哈哈.', 'Từ thường gặp: 发消息, 发语音, 加好友, 扫一扫, 转账. Tin nhắn hay bỏ đại từ và dùng trợ từ 吧, 啊, 哦, 哈哈.'],
           ex: [['你到哪儿了?我在门口等你。', 'Nǐ dào nǎr le? Wǒ zài ménkǒu děng nǐ.', 'Where are you? I am waiting at the gate.', 'Bạn đến đâu rồi? Tôi đang đợi ở cổng.'], ['我马上到,再等我五分钟。', 'Wǒ mǎshàng dào, zài děng wǒ wǔ fēnzhōng.', 'I will be right there, wait 5 more minutes.', 'Tôi đến ngay, đợi tôi thêm năm phút.'], ['我们加个微信吧。', 'Wǒmen jiā ge Wēixìn ba.', 'Let us add each other on WeChat.', 'Ta kết bạn WeChat nhé.']] }],
    v: [['喂', 'wéi', 'hello (phone)', 'a lô'], ['电话', 'diànhuà', 'telephone', 'điện thoại'], ['号码', 'hàomǎ', 'number', 'số'], ['回电话', 'huí diànhuà', 'to call back', 'gọi lại'], ['告诉', 'gàosu', 'to tell', 'nói cho biết'], ['留言', 'liúyán', 'to leave a message', 'để lại lời nhắn'], ['微信', 'Wēixìn', 'WeChat', 'WeChat'], ['发消息', 'fā xiāoxi', 'to send a message', 'gửi tin nhắn'], ['扫一扫', 'sǎo yi sǎo', 'to scan (QR)', 'quét mã'], ['马上', 'mǎshàng', 'immediately', 'ngay lập tức']],
    d: [['A', '喂,你好,请问王经理在吗?', 'Wéi, nǐ hǎo, qǐngwèn Wáng jīnglǐ zài ma?', 'Hello, is Manager Wang in?', 'A lô, cho hỏi giám đốc Vương có đó không?'], ['B', '他在开会,你有什么事?', 'Tā zài kāihuì, nǐ yǒu shénme shì?', 'He is in a meeting; can I help?', 'Ông ấy đang họp, bạn có việc gì?'], ['A', '我是小张,请他开完会给我回电话。', 'Wǒ shì Xiǎo Zhāng, qǐng tā kāiwán huì gěi wǒ huí diànhuà.', 'I am Xiao Zhang; please ask him to call me back.', 'Tôi là Tiểu Trương, nhờ ông ấy họp xong gọi lại cho tôi.'], ['B', '好的,我会告诉他。', 'Hǎo de, wǒ huì gàosu tā.', 'OK, I will tell him.', 'Vâng, tôi sẽ nói lại với ông ấy.']],
    pit: ['Saying 我是小张 as 我叫是小张, reading 1 as yī in phone numbers (yāo is clearer), and forgetting 请 when asking someone to call back.', 'Nói 我叫是小张 sai, đọc số 1 là yī trong số điện thoại (yāo rõ hơn), và quên 请 khi nhờ gọi lại.'],
    s: [['喂 opens; 请问…在吗 asks; 我是… identifies.', '喂 mở đầu; 请问…在吗 hỏi; 我是… xưng danh.'], ['1 = yāo in phone numbers.', 'Số 1 = yāo khi đọc số điện thoại.'], ['WeChat: 发消息, 加好友, 扫一扫.', 'WeChat: 发消息, 加好友, 扫一扫.']],
    l: ['phone', 'wechat', 'alipay'],
    p: [['Say: “Please tell him to call me back.”', 'Nói: “Xin nhắn anh ấy gọi lại cho tôi.”', '请告诉他给我回电话。Qǐng gàosu tā gěi wǒ huí diànhuà.', '请告诉他给我回电话。Qǐng gàosu tā gěi wǒ huí diànhuà.'],
        ['How do you read 1 in a phone number?', 'Số 1 trong số điện thoại đọc thế nào?', 'yāo.', 'yāo.']] }),

  Q(P + 'quiz-8', 'Chapter 8 quiz', 'Quiz chương 8', [
    [['The Mid-Autumn food is:', 'Món của Trung thu là:'], ['饺子', '月饼', '粽子', '汤圆'], 1, ['Mooncakes.', 'Bánh trung thu.']],
    [['Dragon Boat Festival is:', 'Tết Đoan Ngọ là:'], ['春节', '端午节', '清明节', '中秋节'], 1, ['端午节.', '端午节.']],
    [['“Happy New Year”:', '“Chúc mừng năm mới”:'], ['新年快乐', '年新快乐', '新快乐年', '快乐新年的'], 0, ['新年快乐.', '新年快乐.']],
    [['What is given to children at the New Year?', 'Dịp năm mới tặng trẻ em gì?'], ['红包', '月饼', '礼貌', '飞机'], 0, ['红包.', '红包.']],
    [['A polite refusal would be:', 'Cách từ chối lịch sự là:'], ['不好意思,那天我有事。', '我不去。', '不行!', '我不想。'], 0, ['Give a reason.', 'Nêu lý do.']],
    [['“If it rains, we will not go.”', '“Nếu mưa thì chúng ta không đi.”'], ['如果下雨,我们就不去。', '如果下雨,我们不就去。', '下雨如果,我们就去不。', '如果下雨了,我们就去不。'], 0, ['如果 … 就 ….', '如果 … 就 ….']],
    [['Phone “hello”:', 'Xin chào khi nghe máy:'], ['喂', '再见', '谢谢', '对不起'], 0, ['喂.', '喂.']],
    [['Number 1 in phone numbers is read:', 'Số 1 trong số điện thoại đọc là:'], ['yī', 'yāo', 'qī', 'èr'], 1, ['yāo.', 'yāo.']],
  ]),
]));
// ===== Chương 9 =====
secs.push(SEC('Chapter 9 — Complex sentences and HSK 3 skills', 'Chương 9 — Câu phức và kỹ năng thi HSK 3',
  'Câu phức nguyên nhân, nhượng bộ, điều kiện, tăng tiến; kỹ năng viết và đọc theo HSK 3.', [
  D(P + '9-1', '9.1 Cause, concession and condition', '9.1 Nguyên nhân, nhượng bộ và điều kiện', '因为…所以…, 虽然…但是…, 只要…就…, 只有…才…, 即使/就算.', {
    n: '9.1',
    g: [['Link cause and effect', 'Nối nguyên nhân và kết quả'], ['Express contrast with 虽然…但是…', 'Diễn đạt đối lập với 虽然…但是…'], ['Express conditions with 只要…就…, 只有…才…', 'Diễn đạt điều kiện với 只要…就…, 只有…才…']],
    b: [`<p>Chinese complex sentences are built from <strong>paired connectors</strong>. The second connector introduces the main clause and is often an adverb (所以, 但是, 就, 才) that must stand <em>before the verb of the main clause</em>. English “because … so” is natural; Chinese keeps both 因为 and 所以. 虽然 and 但是 also appear together.</p>`,
        `<p>Câu phức tiếng Trung được xây từ <strong>cặp liên từ</strong>. Liên từ thứ hai mở vế chính và thường là phó từ (所以, 但是, 就, 才) phải đứng <em>trước động từ của vế chính</em>. Tiếng Anh nói “because … so” thì lạ, tiếng Trung giữ cả 因为 và 所以. 虽然 và 但是 cũng đi cùng nhau.</p>`],
    gr: [{ h: ['因为…所以… and 虽然…但是…', '因为…所以… và 虽然…但是…'], t: ['Both halves can be dropped in speech, but keep at least one. Subjects: if the same subject, place it before the first connector or after it. Do not mix 虽然 with 但是 + 可是 + 不过 together.', 'Trong khẩu ngữ có thể lược một vế, nhưng nên giữ ít nhất một liên từ. Cùng chủ ngữ thì đặt trước hoặc sau liên từ thứ nhất. Đừng chồng 但是 + 可是 + 不过.'],
           ex: [['因为下雨,所以比赛改到明天了。', 'Yīnwèi xià yǔ, suǒyǐ bǐsài gǎi dào míngtiān le.', 'Because it rained the match was moved to tomorrow.', 'Vì trời mưa nên trận đấu dời sang ngày mai.'], ['虽然他很忙,但是每天都锻炼身体。', 'Suīrán tā hěn máng, dànshì měi tiān dōu duànliàn shēntǐ.', 'Although he is busy he exercises every day.', 'Tuy anh ấy bận nhưng ngày nào cũng tập thể dục.'], ['这个菜虽然贵,可是很好吃。', 'Zhège cài suīrán guì, kěshì hěn hǎochī.', 'Though this dish is pricey, it is delicious.', 'Món này tuy đắt nhưng rất ngon.']] },
         { h: ['只要…就… and 只有…才…', '只要…就… và 只有…才…'], t: ['只要 = as long as (sufficient condition, followed by 就). 只有 = only if (necessary condition, followed by 才).', '只要 = chỉ cần (điều kiện đủ, theo sau là 就). 只有 = chỉ có … mới (điều kiện cần, theo sau là 才).'],
           ex: [['只要你努力,就能学好汉语。', 'Zhǐyào nǐ nǔlì, jiù néng xuéhǎo Hànyǔ.', 'As long as you work hard, you can learn Chinese well.', 'Chỉ cần bạn cố gắng là học tốt tiếng Trung.'], ['只有每天练习,才能说得流利。', 'Zhǐyǒu měi tiān liànxí, cái néng shuō de liúlì.', 'Only by practising daily can you speak fluently.', 'Chỉ có luyện mỗi ngày mới nói lưu loát được.'], ['就算下雨,我们也要去。', 'Jiùsuàn xià yǔ, wǒmen yě yào qù.', 'Even if it rains we will go.', 'Cho dù mưa chúng ta cũng đi.']] }],
    v: [['因为', 'yīnwèi', 'because', 'bởi vì'], ['所以', 'suǒyǐ', 'so, therefore', 'cho nên'], ['虽然', 'suīrán', 'although', 'tuy rằng'], ['但是', 'dànshì', 'but', 'nhưng'], ['可是', 'kěshì', 'but (spoken)', 'nhưng (khẩu ngữ)'], ['只要', 'zhǐyào', 'as long as', 'chỉ cần'], ['只有', 'zhǐyǒu', 'only if', 'chỉ có'], ['就算', 'jiùsuàn', 'even if', 'cho dù'], ['锻炼', 'duànliàn', 'to exercise', 'rèn luyện, tập thể dục'], ['原因', 'yuányīn', 'reason', 'nguyên nhân']],
    d: [['A', '你为什么没参加聚会?', 'Nǐ wèishénme méi cānjiā jùhuì?', 'Why did you not attend?', 'Sao bạn không tham gia tiệc?'], ['B', '因为我感冒了,所以在家休息。', 'Yīnwèi wǒ gǎnmào le, suǒyǐ zài jiā xiūxi.', 'I caught a cold so I rested at home.', 'Vì tôi bị cảm nên ở nhà nghỉ.'], ['A', '虽然你不能来,但是我们还想看看你。', 'Suīrán nǐ bù néng lái, dànshì wǒmen hái xiǎng kànkan nǐ.', 'Although you cannot come we still want to see you.', 'Tuy bạn không đến được nhưng chúng tôi vẫn muốn gặp bạn.'], ['B', '只要病好了,我就去看你们。', 'Zhǐyào bìng hǎo le, wǒ jiù qù kàn nǐmen.', 'As soon as I am well I will visit.', 'Chỉ cần khỏi bệnh là tôi sẽ đến thăm các bạn.']],
    pit: ['Placing 所以/但是 after the verb, or using 因为 and 所以 as if one were optional in written tests, and mixing 只要 with 才 (should be 就) or 只有 with 就 (should be 才).', 'Đặt 所以/但是 sau động từ, và dùng 只要 với 才 (phải là 就) hoặc 只有 với 就 (phải là 才).'],
    s: [['Paired connectors build the sentence.', 'Cặp liên từ dựng nên câu.'], ['虽然…但是…; 因为…所以….', '虽然…但是…; 因为…所以….'], ['只要…就…; 只有…才….', '只要…就…; 只有…才….']],
    l: ['yinwei', 'suiran', 'ruguo', 'gram'],
    p: [['Link: “Although it is cold, I like winter.”', 'Nối: “Tuy lạnh nhưng tôi thích mùa đông.”', '虽然很冷,但是我喜欢冬天。Suīrán hěn lěng, dànshì wǒ xǐhuan dōngtiān.', '虽然很冷,但是我喜欢冬天。Suīrán hěn lěng, dànshì wǒ xǐhuan dōngtiān.'],
        ['Which: ___你努力,___能成功 — 只要/就 or 只有/才?', 'Chọn: ___你努力,___能成功 — 只要/就 hay 只有/才?', 'Both can work: 只要…就 (sufficient) or 只有…才 (necessary); choose by meaning.', 'Cả hai đều được: 只要…就 (điều kiện đủ) hoặc 只有…才 (điều kiện cần); chọn theo ý.']] }),

  D(P + '9-2', '9.2 Addition, exception and sequence', '9.2 Tăng tiến, ngoại lệ và trình tự', '不但…而且…, 除了…以外, 一…就…, 先…然后…, 连…都…, 还是 vs 或者.', {
    n: '9.2',
    g: [['Add information with 不但…而且…', 'Thêm thông tin với 不但…而且…'], ['Express exceptions with 除了…以外', 'Diễn đạt ngoại lệ với 除了…以外'], ['Use 一…就…, 连…都… for effect', 'Dùng 一…就…, 连…都… để nhấn mạnh']],
    b: [`<p>These patterns make your speech sound like HSK 3. <strong>不但 A 而且 B</strong>: B is even better. <strong>除了 A 以外, 还/也 B</strong> (A included, others too) or <strong>都</strong> (A excluded). <strong>一 A 就 B</strong>: B follows A immediately. <strong>连 A 都 B</strong>: even A.</p>`,
        `<p>Những mẫu này làm lời nói của bạn nghe đúng mức HSK 3. <strong>不但 A 而且 B</strong>: B còn hơn A. <strong>除了 A 以外, 还/也 B</strong> (A và cả B nữa) hoặc <strong>都</strong> (trừ A ra). <strong>一 A 就 B</strong>: A vừa xong là B. <strong>连 A 都 B</strong>: đến cả A cũng.</p>`],
    gr: [{ h: ['不但…而且… and 除了…以外', '不但…而且… và 除了…以外'], t: ['If the two clauses have different subjects, 不但 goes before the first subject. 除了 can be followed by 还, 也 (in addition) or 都 (excluding).', 'Nếu hai vế khác chủ ngữ, 不但 đứng trước chủ ngữ thứ nhất. Sau 除了 là 还, 也 (thêm vào) hoặc 都 (loại trừ).'],
           ex: [['他不但会说汉语,而且会写汉字。', 'Tā búdàn huì shuō Hànyǔ, érqiě huì xiě Hànzì.', 'He can not only speak Chinese but also write characters.', 'Anh ấy không chỉ biết nói tiếng Trung mà còn biết viết chữ Hán.'], ['除了英语以外,我还会说汉语。', 'Chúle Yīngyǔ yǐwài, wǒ hái huì shuō Hànyǔ.', 'Besides English, I also speak Chinese.', 'Ngoài tiếng Anh, tôi còn biết nói tiếng Trung.'], ['除了他以外,大家都来了。', 'Chúle tā yǐwài, dàjiā dōu lái le.', 'Everyone came except him.', 'Trừ anh ấy ra, mọi người đều đến.']] },
         { h: ['一…就… and 连…都…', '一…就… và 连…都…'], t: ['一…就… means “as soon as” or a habitual link (一累就想睡). 连…都… stresses an extreme example.', '一…就… nghĩa là “vừa … là …” hoặc quan hệ quen thuộc (一累就想睡). 连…都… nhấn mạnh ví dụ cực đoan.'],
           ex: [['我一到家就给你打电话。', 'Wǒ yí dào jiā jiù gěi nǐ dǎ diànhuà.', 'As soon as I get home I will call you.', 'Tôi vừa về đến nhà là gọi cho bạn.'], ['他连自己的名字都不会写。', 'Tā lián zìjǐ de míngzi dōu bú huì xiě.', 'He cannot even write his own name.', 'Anh ấy đến tên mình cũng không biết viết.'], ['这个问题连老师都不知道。', 'Zhège wèntí lián lǎoshī dōu bù zhīdào.', 'Even the teacher does not know.', 'Câu hỏi này đến thầy giáo cũng không biết.']] }],
    v: [['不但', 'búdàn', 'not only', 'không chỉ'], ['而且', 'érqiě', 'but also', 'mà còn'], ['除了', 'chúle', 'except; besides', 'ngoài, trừ'], ['以外', 'yǐwài', 'outside, besides', 'ngoài ra'], ['一…就…', 'yī…jiù…', 'as soon as', 'vừa … là …'], ['连…都…', 'lián…dōu…', 'even …', 'ngay cả … cũng …'], ['或者', 'huòzhě', 'or (statements)', 'hoặc (câu kể)'], ['还是', 'háishi', 'or (questions)', 'hay là (câu hỏi)'], ['其他', 'qítā', 'other', 'khác'], ['自己', 'zìjǐ', 'oneself', 'bản thân']],
    d: [['A', '你们班的同学怎么样?', 'Nǐmen bān de tóngxué zěnmeyàng?', 'How are your classmates?', 'Bạn học trong lớp bạn thế nào?'], ['B', '他们不但聪明,而且很努力。', 'Tāmen búdàn cōngming, érqiě hěn nǔlì.', 'They are not only clever but diligent.', 'Họ không chỉ thông minh mà còn rất chăm chỉ.'], ['A', '你们除了汉语以外,还学什么?', 'Nǐmen chúle Hànyǔ yǐwài, hái xué shénme?', 'Besides Chinese, what else do you study?', 'Ngoài tiếng Trung các bạn còn học gì?'], ['B', '还学中国文化。一下课,我们就去练习口语。', 'Hái xué Zhōngguó wénhuà. Yí xiàkè, wǒmen jiù qù liànxí kǒuyǔ.', 'Chinese culture. As soon as class ends we go practise speaking.', 'Còn học văn hoá Trung Quốc. Vừa tan lớp là chúng tôi đi luyện nói.']],
    pit: ['Choosing 还是 for statements (use 或者) and using 还是 in questions in 或者 (opposite). Also forgetting 而且 or dropping 不但 when the subject changes.', 'Dùng 还是 cho câu kể (phải là 或者) và 或者 trong câu hỏi lựa chọn (phải là 还是). Cũng hay quên 而且 hoặc bỏ 不但 khi đổi chủ ngữ.'],
    s: [['不但…而且… = addition.', '不但…而且… = tăng tiến.'], ['除了…以外 + 还/也 or 都.', '除了…以外 + 还/也 hoặc 都.'], ['一…就… = immediate sequence.', '一…就… = nối tiếp ngay.']],
    l: ['budan', 'chule', 'yijiu', 'lian'],
    p: [['Say: “He is not only tall but also strong.”', 'Nói: “Anh ấy không chỉ cao mà còn khoẻ.”', '他不但很高,而且很强壮。Tā búdàn hěn gāo, érqiě hěn qiángzhuàng.', '他不但很高,而且很强壮。Tā búdàn hěn gāo, érqiě hěn qiángzhuàng.'],
        ['Say: “I go to sleep as soon as I get home.”', 'Nói: “Về nhà là tôi đi ngủ ngay.”', '我一到家就睡觉。Wǒ yí dào jiā jiù shuìjiào.', '我一到家就睡觉。Wǒ yí dào jiā jiù shuìjiào.']] }),

  D(P + '9-3', '9.3 Writing and exam skills for HSK 3', '9.3 Kỹ năng viết và thi HSK 3', 'Dạng đề HSK 3, sắp xếp câu, viết đoạn văn, ôn tập toàn khoá.', {
    n: '9.3',
    g: [['Know the HSK 3 exam parts', 'Biết các phần thi HSK 3'], ['Reorder words into correct sentences', 'Sắp xếp từ thành câu đúng'], ['Write a coherent short paragraph', 'Viết đoạn văn ngắn mạch lạc']],
    b: [`<p>HSK 3 tests listening, reading and writing (the old HSK 3 has about 80 questions over 90 minutes; check the current format on the official site). Writing includes <strong>reordering words</strong> and <strong>writing a missing character from pinyin</strong>. Use this sentence order skeleton: <strong>time → subject → adverb/location → verb → complement → object</strong>. Practise by reading the target sentence aloud.</p>`,
        `<p>HSK 3 thi nghe, đọc và viết (bản HSK 3 cũ có khoảng 80 câu trong 90 phút; hãy kiểm tra định dạng hiện hành trên trang chính thức). Phần viết gồm <strong>sắp xếp từ</strong> và <strong>viết chữ còn thiếu theo pinyin</strong>. Dùng khung trật tự: <strong>thời gian → chủ ngữ → phó từ/nơi chốn → động từ → bổ ngữ → tân ngữ</strong>. Luyện bằng cách đọc to câu đích.</p>`],
    gr: [{ h: ['Reordering words', 'Sắp xếp từ'], t: ['Find the verb, then attach complement, then place the time and subject. Example words: 妈妈 / 把 / 做好了 / 饭 / 已经. Answer: 妈妈已经把饭做好了.', 'Tìm động từ, rồi gắn bổ ngữ, sau đó đặt thời gian và chủ ngữ. Ví dụ từ: 妈妈 / 把 / 做好了 / 饭 / 已经. Đáp án: 妈妈已经把饭做好了.'],
           ex: [['我昨天在书店买了三本书。', 'Wǒ zuótiān zài shūdiàn mǎile sān běn shū.', 'Time, subject, place, verb, quantity, object.', 'Thời gian, chủ ngữ, nơi chốn, động từ, số lượng, tân ngữ.'], ['他比我跑得快。', 'Tā bǐ wǒ pǎo de kuài.', '比-comparison with degree complement.', 'So sánh 比 với bổ ngữ trạng thái.'], ['因为天气不好,所以飞机晚点了。', 'Yīnwèi tiānqì bù hǎo, suǒyǐ fēijī wǎndiǎn le.', 'Paired connector sentence.', 'Câu cặp liên từ.']] },
         { h: ['A model paragraph', 'Đoạn văn mẫu'], t: ['Aim for 8–10 sentences. Use connectors, one comparison, one aspect particle and one complement.', 'Hướng tới 8–10 câu. Dùng liên từ, một câu so sánh, một trợ từ thể và một bổ ngữ.'],
           ex: [['上个月我去了北京旅游,虽然天气比较冷,但是玩得很开心。', 'Shàng ge yuè wǒ qùle Běijīng lǚyóu, suīrán tiānqì bǐjiào lěng, dànshì wán de hěn kāixīn.', 'Last month I visited Beijing; though cold, I had a great time.', 'Tháng trước tôi đi Bắc Kinh du lịch, tuy trời khá lạnh nhưng chơi rất vui.'], ['我看了长城,还吃了北京烤鸭,味道比我想的好吃得多。', 'Wǒ kànle Chángchéng, hái chīle Běijīng kǎoyā, wèidào bǐ wǒ xiǎng de hǎochī de duō.', 'I saw the Great Wall and ate Peking duck, tastier than I thought.', 'Tôi đã xem Vạn Lý Trường Thành và ăn vịt quay Bắc Kinh, ngon hơn tôi nghĩ nhiều.'], ['如果有机会,我一定还要再去一次。', 'Rúguǒ yǒu jīhuì, wǒ yídìng hái yào zài qù yí cì.', 'If I get the chance I will definitely go again.', 'Nếu có cơ hội, tôi nhất định sẽ đi thêm lần nữa.']] }],
    v: [['听力', 'tīnglì', 'listening', 'nghe hiểu'], ['阅读', 'yuèdú', 'reading', 'đọc hiểu'], ['书写', 'shūxiě', 'writing', 'viết'], ['句子', 'jùzi', 'sentence', 'câu'], ['顺序', 'shùnxù', 'order', 'thứ tự'], ['段落', 'duànluò', 'paragraph', 'đoạn văn'], ['机会', 'jīhuì', 'chance', 'cơ hội'], ['开心', 'kāixīn', 'happy', 'vui vẻ'], ['味道', 'wèidào', 'taste', 'hương vị'], ['成绩', 'chéngjì', 'result, score', 'thành tích, điểm']],
    d: [['A', '你的HSK考得怎么样?', 'Nǐ de HSK kǎo de zěnmeyàng?', 'How was your HSK?', 'Bài thi HSK của bạn thế nào?'], ['B', '听力不错,但是阅读有点儿慢。', 'Tīnglì búcuò, dànshì yuèdú yǒudiǎnr màn.', 'Listening good but reading a bit slow.', 'Nghe khá tốt nhưng đọc hơi chậm.'], ['A', '多读几篇文章,速度就会越来越快。', 'Duō dú jǐ piān wénzhāng, sùdù jiù huì yuè lái yuè kuài.', 'Read more articles and you will get faster.', 'Đọc thêm vài bài, tốc độ sẽ càng ngày càng nhanh.']],
    pit: ['Memorising isolated words but not sentence order, and leaving 把/被 sentences without a complement. In reordering tasks always check the verb has a complement.', 'Chỉ học thuộc từ rời mà không học trật tự câu, và để câu 把/被 thiếu bổ ngữ. Khi sắp xếp từ luôn kiểm tra động từ có bổ ngữ.'],
    s: [['Use the order: time, subject, adverb, verb, complement, object.', 'Dùng trật tự: thời gian, chủ ngữ, phó từ, động từ, bổ ngữ, tân ngữ.'], ['Practise reordering and writing short paragraphs.', 'Luyện sắp xếp từ và viết đoạn ngắn.'], ['Review chapter patterns with the HSK 3 word list.', 'Ôn mẫu câu các chương cùng bảng từ HSK 3.']],
    l: ['hsk', 'hsk3', 'duchinese', 'wall'],
    p: [['Reorder: 我 / 已经 / 作业 / 把 / 写完了', 'Sắp xếp: 我 / 已经 / 作业 / 把 / 写完了', '我已经把作业写完了。', '我已经把作业写完了。'],
        ['Write 2 sentences about last weekend using 了 and 虽然…但是….', 'Viết 2 câu về cuối tuần trước dùng 了 và 虽然…但是….', 'Example: 上个周末我去了公园。虽然很累,但是很开心。', 'Ví dụ: 上个周末我去了公园。虽然很累,但是很开心。']] }),

  Q(P + 'quiz-9', 'Chapter 9 quiz', 'Quiz chương 9', [
    [['“Because it rained, the match was cancelled”:', '“Vì mưa nên trận đấu bị huỷ”:'], ['因为下雨,所以比赛取消了。', '因为下雨,但是比赛取消了。', '虽然下雨,所以比赛取消了。', '因为下雨,而且比赛取消了。'], 0, ['因为…所以….', '因为…所以….']],
    [['“Although busy, he …”:', '“Tuy bận nhưng anh ấy …”:'], ['虽然很忙,但是他…', '因为很忙,但是他…', '虽然很忙,所以他…', '如果很忙,但是他…'], 0, ['虽然…但是….', '虽然…但是….']],
    [['“As long as you try, you can …”:', '“Chỉ cần cố gắng là …”:'], ['只要努力,就能…', '只有努力,就能…', '只要努力,才能…', '要是努力,而且能…'], 0, ['只要…就….', '只要…就….']],
    [['“Only by practising can you …”:', '“Chỉ có luyện tập mới …”:'], ['只有练习,才能…', '只有练习,就能…', '只要练习,才能…', '不但练习,才能…'], 0, ['只有…才….', '只有…才….']],
    [['“Not only … but also …”:', '“Không chỉ … mà còn …”:'], ['不但…而且…', '虽然…而且…', '除了…而且…', '只要…而且…'], 0, ['不但…而且….', '不但…而且….']],
    [['“Everyone came except him”:', '“Trừ anh ấy mọi người đều đến”:'], ['除了他以外,大家都来了。', '除了他以外,大家还来了。', '除了他以外,大家不来了。', '他除了,大家都来了。'], 0, ['都 = excluding.', '都 = loại trừ.']],
    [['“As soon as I get home I call you”:', '“Vừa về nhà là gọi bạn”:'], ['我一到家就给你打电话。', '我一到家才给你打电话。', '我到一家就给你打电话。', '我一到家再给你打电话了。'], 0, ['一…就….', '一…就….']],
    [['Best word order for the sentence:', 'Trật tự đúng cho câu:'], ['我已经把作业写完了。', '我把已经作业写完了。', '已经我写完把作业了。', '我写完已经把作业了。'], 0, ['Adverb before 把.', 'Phó từ trước 把.']],
  ]),
]));

export default secs;
