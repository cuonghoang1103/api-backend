/**
 * 11.1 — Khách Nhật (agl-11-1-khach-nhat). Soạn 24/11/2026, agent agl.
 * Chạy thật: scratchpad/agl/lab/ch11/lich-nhat.mjs (Node 22.22.2, ICU có lịch Nhật) — output RA.lichNhat.
 * Nguồn: Mizuho — báo cáo uỷ ban điều tra đặc biệt 15/06/2021 (thông cáo Mizuho + Reuters/nippon.com 15/06/2021);
 * Microsoft KB4469068 (chuẩn bị niên hiệu mới, Reiwa từ 01/05/2019); PPAP — Bộ trưởng số hoá Hirai Takuya tuyên bố bỏ ở cơ quan
 * chính phủ 11/2020 (ITmedia 12/2020, Hitachi bỏ trong tập đoàn 2021). Khung ngữ cảnh cao/thấp: E. T. Hall 1976; Erin Meyer — chỉ tóm tắt,
 * giảng chi tiết ở IBC201 2.1. ⛔ Không quy chụp: mọi bảng là "xu hướng thường gặp", luôn kèm "hỏi BrSE/PM về khách cụ thể".
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ac, ag, ng, vo, js, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L111 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 11 · Working with Japanese and American clients', 'Chương 11 · Làm việc với khách Nhật và khách Mỹ', `
<h2>${t('11.1 — Japanese clients: quality, detail, the indirect "no", hourensou, nemawashi', '11.1 — Khách Nhật: chất lượng, chi tiết, lời từ chối gián tiếp, hourensou, nemawashi')}</h2>
<p class="lead">${t(
    'In the first review meeting of your OJT, the Japanese customer looks at your proposal for a new search screen and says: "検討します — we will consider it." You write in the daily report "Customer is considering the proposal, expected OK". Two weeks later the BrSE asks why you are still waiting: everyone else in the room understood that sentence as a polite <em>no</em>. This lesson is about reading Japanese customers correctly — what they value, how they say no, how decisions are really made — so that your work is accepted the first time.',
    'Buổi review đầu tiên trong kỳ OJT, khách Nhật xem đề xuất màn hình tìm kiếm mới của bạn và nói: "検討します — chúng tôi sẽ xem xét." Bạn ghi vào báo cáo ngày "Khách đang xem xét đề xuất, dự kiến OK". Hai tuần sau BrSE hỏi sao bạn vẫn còn chờ: mọi người khác trong phòng đều hiểu câu đó là một lời <em>từ chối</em> lịch sự. Bài này dạy đọc đúng khách Nhật — họ coi trọng gì, từ chối ra sao, quyết định thật sự được đưa ra thế nào — để sản phẩm của bạn được nhận ngay lần đầu.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> You visit an elderly relative and offer to fix their TV. They say "Oh, don\'t trouble yourself, maybe another time." A Vietnamese grandchild knows that might mean "please don\'t touch it". You already read indirect speech at home — with Japanese customers you do the same, in a business setting and with a few new signals.',
    '<strong>Liên tưởng đời thường.</strong> Bạn về thăm ông bà, xin sửa giúp cái tivi. Ông bảo "Thôi cháu, để lần sau." Đứa cháu Việt hiểu câu đó có khi là "đừng đụng vào". Bạn vốn đã đọc lời nói gián tiếp ở nhà — với khách Nhật bạn làm y như vậy, trong bối cảnh công việc và thêm vài tín hiệu mới.'))}

${note(t(
    'Every table here describes <strong>common tendencies</strong>, not rules about every Japanese person. A young product owner at a Tokyo start-up may be more direct than your Vietnamese leader. Always ask your BrSE or PM: "How does <em>this</em> customer usually say no? Who really decides?" — they have worked with them for years.',
    'Mọi bảng ở đây mô tả <strong>xu hướng thường gặp</strong>, không phải luật cho mọi người Nhật. Một product owner trẻ ở start-up Tokyo có khi còn thẳng hơn leader Việt của bạn. Luôn hỏi BrSE hoặc PM: "Khách <em>này</em> thường từ chối thế nào? Ai thật sự quyết?" — họ đã làm với khách nhiều năm.'))}

<h3>${t('High-context and low-context communication', 'Giao tiếp ngữ cảnh cao và ngữ cảnh thấp')}</h3>
<p>${t(
    'The anthropologist Edward T. Hall (<em>Beyond Culture</em>, 1976) described cultures where much of the meaning lives in the <strong>context</strong> — relationship, tone, what is left unsaid — and cultures where the meaning is in the <strong>words</strong>. Erin Meyer\'s <em>The Culture Map</em> (2014) places Japan at the far high-context end and the United States at the far low-context end. Vietnamese communication is generally described as high-context too — closer to Japan than to the US. That is good news: you already have the instinct; you only need the vocabulary.',
    'Nhà nhân học Edward T. Hall (<em>Beyond Culture</em>, 1976) mô tả những nền văn hoá mà phần lớn ý nghĩa nằm ở <strong>ngữ cảnh</strong> — quan hệ, giọng điệu, điều không nói ra — và những nền văn hoá mà ý nghĩa nằm ở <strong>lời nói</strong>. Sách <em>The Culture Map</em> (2014) của Erin Meyer đặt Nhật ở tận cùng phía ngữ cảnh cao, Mỹ ở tận cùng phía ngữ cảnh thấp. Cách giao tiếp của người Việt thường cũng được xếp vào nhóm ngữ cảnh cao — gần Nhật hơn gần Mỹ. Đó là tin tốt: bạn đã có sẵn bản năng; chỉ cần thêm vốn từ.')}</p>
<p>${t('The eight scales of Meyer and the theory behind them are taught in ', 'Tám thang đo của Meyer và lý thuyết phía sau được giảng ở ')}${ac('ibc201-cross-cultural-management-and-negotiation', 'ibc201-2-1-communication-meyer', 'IBC201 2.1')}${t('. Here we only use what you need in a project.', '. Ở đây chỉ dùng phần bạn cần trong dự án.')}</p>

<h3>${t('What Japanese customers usually value', 'Khách Nhật thường coi trọng điều gì')}</h3>
${bang([t('Value', 'Giá trị'), t('What it looks like in a project', 'Trông thế nào trong dự án'), t('What you do', 'Bạn làm gì')], [
    [t('品質 <em>hinshitsu</em> — quality', '品質 <em>hinshitsu</em> — chất lượng'), t('Defects found by the customer are counted and reported upward on their side. A small bug in acceptance test can cost more trust than a week of delay.', 'Lỗi do khách tìm ra được đếm và báo cáo lên cấp trên phía họ. Một lỗi nhỏ ở test nghiệm thu có thể làm mất uy tín hơn trễ một tuần.'), t('Self-test hard before delivery; attach evidence (lesson 9.4); never deliver "probably works".', 'Tự test kỹ trước khi giao; đính kèm evidence (bài 9.4); không bao giờ giao "chắc là chạy".')],
    [t('細かさ — detail', '細かさ — sự chi tiết'), t('They notice a date written 2026/11/4 in one sheet and 2026/11/04 in another, a missing change-history row, a mix of full-width and half-width characters.', 'Họ để ý một ngày ghi 2026/11/4 ở sheet này và 2026/11/04 ở sheet kia, một dòng lịch sử sửa đổi bị thiếu, chữ toàn góc lẫn bán góc.'), t('Follow the document notation rules (表記ルール); run a self-check before sending (below).', 'Theo quy ước trình bày tài liệu (表記ルール); chạy tự soát trước khi gửi (bên dưới).')],
    [t('納期 <em>nōki</em> — the delivery date', '納期 <em>nōki</em> — hạn giao'), t('The date was promised upward on their side, sometimes to their own customer.', 'Ngày đó đã được hứa với cấp trên phía khách, có khi với chính khách của họ.'), t('Warn early, never on the due date (lesson 9.7).', 'Báo sớm, không bao giờ báo vào đúng ngày hạn (bài 9.7).')],
    [t('No surprises', 'Không bất ngờ'), t('Bad news is acceptable; <em>sudden</em> bad news is not.', 'Tin xấu chấp nhận được; tin xấu <em>đột ngột</em> thì không.'), t('Hourensou — report, contact, consult — continuously, not at the end.', 'Hourensou — báo cáo, liên lạc, thảo luận — liên tục, không đợi tới cuối.')],
    [t('Consensus — 根回し, 稟議', 'Đồng thuận — 根回し, 稟議'), t('Decisions are prepared before the meeting and approved by several people in turn; the meeting confirms.', 'Quyết định được chuẩn bị trước buổi họp và được nhiều người lần lượt duyệt; buổi họp chỉ xác nhận.'), t('Send material early; expect slower approvals; build that time into your estimate (lesson 9.6).', 'Gửi tài liệu sớm; chờ duyệt lâu hơn; tính khoảng thời gian đó vào ước lượng (bài 9.6).')],
  ])}
<p>${t('Hourensou itself — the daily report, the escalation path, what to do when you are going to be late — is taught in ', 'Bản thân hourensou — báo cáo ngày, đường báo cáo lên, làm gì khi sắp trễ — đã giảng ở ')}${ag('agl-9-7-bao-cao-hourensou', t('lesson 9.7', 'bài 9.7'))}${t('. This lesson adds the parts that are about <em>reading people</em>.', '. Bài này thêm phần về <em>đọc người</em>.')}</p>

<h3>${t('The indirect "no": phrases to recognise', 'Lời từ chối gián tiếp: các câu cần nhận ra')}</h3>
<p>${t(
    'You do not need fluent Japanese to work with Japanese customers — the BrSE translates. But these phrases appear in meetings, in Q&amp;A answers and in English translations, and misreading them sends a project in the wrong direction.',
    'Bạn không cần giỏi tiếng Nhật mới làm được với khách Nhật — đã có BrSE dịch. Nhưng những câu dưới đây xuất hiện trong họp, trong câu trả lời Q&amp;A và cả trong bản dịch tiếng Anh, và đọc sai chúng là đưa dự án đi sai hướng.')}</p>
${bang([t('They say', 'Khách nói'), t('Literally', 'Nghĩa đen'), t('Often means', 'Thường có nghĩa là'), t('Your next step', 'Bạn làm tiếp')], [
    ['検討します <em>kentō shimasu</em>', t('"We will consider it"', '"Chúng tôi sẽ xem xét"'), t('Often "no" or "not now", especially with no date attached', 'Thường là "không" hoặc "chưa", nhất là khi không kèm ngày nào'), t('Do not plan on it. Ask the BrSE; if needed, a closed question with a date: "Shall we keep the current design for this release?"', 'Đừng lập kế hoạch dựa trên nó. Hỏi BrSE; nếu cần, câu hỏi đóng có ngày: "Bản phát hành này giữ thiết kế hiện tại nhé?"')],
    ['前向きに検討します <em>maemuki ni</em>', t('"We will consider it positively"', '"Sẽ xem xét theo hướng tích cực"'), t('Real interest, still not a decision', 'Có quan tâm thật, nhưng vẫn chưa phải quyết định'), t('Record as Open in the Q&amp;A list with a follow-up date', 'Ghi trạng thái Open trong Q&amp;A list kèm ngày hỏi lại')],
    ['難しいです <em>muzukashii desu</em>', t('"It is difficult"', '"Khó"'), t('Usually "no"', 'Thường là "không"'), t('Do not reply "we can try harder". Offer an alternative, or drop it.', 'Đừng đáp "bọn em sẽ cố hơn". Đưa phương án khác, hoặc thôi.')],
    ['ちょっと… <em>chotto</em>', t('"A little…" (sentence left unfinished)', '"Hơi…" (câu bỏ lửng)'), t('"No" — the unfinished sentence <em>is</em> the answer', '"Không" — câu bỏ lửng <em>chính là</em> câu trả lời'), t('Stop pushing in the meeting; discuss with your BrSE afterwards', 'Dừng thuyết phục trong họp; bàn với BrSE sau đó')],
    ['〜していただけると助かります <em>…itadakeru to tasukarimasu</em>', t('"It would help us if you could…"', '"Nếu anh chị làm được… thì chúng tôi đỡ lắm"'), t('A request you are expected to do', 'Một yêu cầu bạn được mong là sẽ làm'), t('Treat as a task: put it in the minutes with an owner and a date — and check whether it is in scope (lesson 11.4)', 'Coi như một việc: ghi vào biên bản có người và hạn — và kiểm xem có trong phạm vi không (bài 11.4)')],
    ['念のため <em>nen no tame</em>', t('"Just to be sure"', '"Cho chắc"'), t('Please really check this; they have a doubt', 'Hãy kiểm thật kỹ chỗ này; họ đang nghi ngờ'), t('Check it and answer with evidence, not "it is fine"', 'Kiểm và trả lời kèm bằng chứng, không trả lời "ổn rồi ạ"')],
    ['はい <em>hai</em>', t('"Yes"', '"Vâng"'), t('Very often "I hear you", not "I agree"', 'Rất hay là "tôi đang nghe", không phải "tôi đồng ý"'), t('A nod and "hai" in a meeting is not approval. Approval is written (lesson 11.3).', 'Gật đầu và "hai" trong họp chưa phải là duyệt. Duyệt phải bằng văn bản (bài 11.3).')],
  ])}
${cl('tip', t(
    'The safest tool against all of this is the <strong>closed question with a proposal</strong>: "We assume the phone number is optional. Is that correct?" — one yes/no, nothing to read between the lines. How to write such questions in English is in ',
    'Công cụ an toàn nhất trước mọi chuyện này là <strong>câu hỏi đóng kèm đề xuất</strong>: "Chúng tôi giả định số điện thoại không bắt buộc. Như vậy có đúng không?" — một có/không, không còn gì để đoán. Cách viết câu như vậy bằng tiếng Anh ở ') + cs('tieng-anh-ky-thuat-di-lam', 'tak-5-2-cau-hoi-dong', t('Technical English 5.2', 'Tiếng Anh kỹ thuật 5.2')) + t('; the Q&amp;A list itself in ', '; bản thân Q&amp;A list ở ') + ag('agl-9-5-qa-cr', t('lesson 9.5', 'bài 9.5')) + '.')}

<h3>${t('Nemawashi: the meeting is decided before it starts', 'Nemawashi: buổi họp được quyết trước khi bắt đầu')}</h3>
<p>${t(
    '根回し (<em>nemawashi</em>) is a gardening word: digging around the roots of a tree before moving it. In a company it means talking to each stakeholder individually <em>before</em> the meeting, so that nobody is surprised and nobody has to object in public. The meeting then confirms what was already agreed. 稟議 (<em>ringi</em>) is the written version: a proposal document circulates and each manager stamps it in turn — which is why a "small" approval on the customer side can take a week.',
    '根回し (<em>nemawashi</em>) vốn là từ làm vườn: đào quanh rễ cây trước khi chuyển chỗ. Trong công ty, nó là nói chuyện riêng với từng người liên quan <em>trước</em> buổi họp, để không ai bất ngờ và không ai phải phản đối trước mặt mọi người. Buổi họp khi đó chỉ xác nhận điều đã thống nhất. 稟議 (<em>ringi</em>) là bản viết của nó: một tờ trình đi vòng và từng cấp quản lý lần lượt đóng dấu — vì thế một việc duyệt "nhỏ" phía khách có thể mất một tuần.')}</p>
${bang([t('At your level, nemawashi means…', 'Ở vị trí của bạn, nemawashi là…'), t('Example', 'Ví dụ')], [
    [t('Sending review material one working day early', 'Gửi tài liệu review trước một ngày làm việc'), t('DD diff + list of open points to the BrSE the day before the review, not in the meeting', 'Bản khác biệt DD + danh sách điểm còn mở gửi BrSE hôm trước buổi review, không đưa ra trong họp')],
    [t('Warning your leader before you raise a problem with the customer', 'Báo leader trước khi nêu vấn đề với khách'), t('"In tomorrow\'s meeting I want to say the import screen needs 2 more days — OK to raise?"', '"Trong họp mai em muốn nói màn hình import cần thêm 2 ngày — anh thấy nêu được không?"')],
    [t('Never contradicting your own team in front of the customer', 'Không bao giờ cãi lại chính đội mình trước mặt khách'), t('If you disagree with your PM\'s estimate, say it to the PM after the meeting', 'Không đồng ý ước lượng của PM thì nói với PM sau buổi họp')],
  ])}

<h3>${t('Detail you can check by machine: dates and full-width characters', 'Chi tiết kiểm được bằng máy: ngày tháng và chữ toàn góc')}</h3>
<p>${t(
    'Japanese documents mix two calendars — the Western year (西暦) and the era year (和暦, e.g. 令和8年 = 2026) — and two widths of characters: full-width (全角, the width of one kanji: ＡＢＣ１２３) and half-width (半角: ABC123, and the old half-width katakana ｶﾀｶﾅ). Each customer has a notation rule (表記ルール); a common one is "Latin letters and digits half-width, katakana full-width, no half-width spaces inside Japanese sentences". Breaking it is the kind of "small" mistake that makes a reviewer distrust the whole document. Both checks are a few lines of code:',
    'Tài liệu Nhật dùng lẫn hai lịch — năm dương lịch (西暦) và năm niên hiệu (和暦, ví dụ 令和8年 = 2026) — và hai độ rộng chữ: toàn góc (全角, rộng bằng một chữ Hán: ＡＢＣ１２３) và bán góc (半角: ABC123, cùng katakana bán góc kiểu cũ ｶﾀｶﾅ). Mỗi khách có quy ước trình bày (表記ルール); một kiểu hay gặp là "chữ Latin và chữ số dùng bán góc, katakana dùng toàn góc, không có dấu cách bán góc trong câu tiếng Nhật". Phạm quy ước là kiểu lỗi "nhỏ" khiến người review mất tin cả tài liệu. Cả hai việc kiểm chỉ vài dòng mã:')}</p>
${js(MA.lichNhat)}
<p>${t('Output on Node 22 (ICU ships the Japanese calendar):', 'Kết quả chạy trên Node 22 (ICU có sẵn lịch Nhật):')}</p>
${out('$ node lich-nhat.mjs\n' + RA.lichNhat)}
<ul>
<li>${t('The era changed between 30 April and 1 May 2019: 平成31年 → 令和元年 (元年 <em>gannen</em> = "first year", not "1年"). A system that hard-codes era names breaks on such a day.', 'Niên hiệu đổi giữa 30/4 và 1/5/2019: 平成31年 → 令和元年 (元年 <em>gannen</em> = "năm đầu", không viết "1年"). Hệ thống ghi cứng tên niên hiệu sẽ hỏng đúng ngày như thế.')}</li>
<li>${t('NFKC normalisation turns full-width ＩＤ１２３ into ID123 and half-width ﾛｸﾞｲﾝ into ログイン — the same normalisation that fixed the NFC/NFD bug in ', 'Chuẩn hoá NFKC đổi ＩＤ１２３ toàn góc thành ID123 và ﾛｸﾞｲﾝ bán góc thành ログイン — cùng họ chuẩn hoá đã sửa lỗi NFC/NFD ở ')}${ag('agl-9-8-lab', t('lab 9.8', 'lab 9.8'))}${t('. Use it to <em>suggest</em> fixes; the human decides, because a customer may deliberately keep a full-width code.', '. Dùng nó để <em>gợi ý</em> sửa; người quyết là con người, vì có khách cố ý giữ một mã toàn góc.')}</li>
<li>${t('Your rules may differ — copy the customer\'s 表記ルール into the LUAT array, do not invent your own.', 'Quy ước của bạn có thể khác — chép đúng 表記ルール của khách vào mảng LUAT, đừng tự nghĩ ra.')}</li>
</ul>

<h3>${t('A real case: a new era with one month\'s notice (2019)', 'Chuyện thật: niên hiệu mới, báo trước một tháng (2019)')}</h3>
<p>${t(
    'The name 令和 (Reiwa) was announced on 1 April 2019 and took effect on 1 May 2019. Microsoft shipped Windows and Office updates for months beforehand, including a test registry key so developers could try the new era before its name was known, and documented that the single-character ligature ㋿ was not available in the old Shift-JIS code page (MS932) (',
    'Tên 令和 (Reiwa) được công bố ngày 1/4/2019 và có hiệu lực từ 1/5/2019. Microsoft phát hành cập nhật Windows và Office suốt nhiều tháng trước đó, kể cả một khoá registry thử để lập trình viên chạy thử niên hiệu mới khi chưa biết tên, và ghi rõ ký tự gộp ㋿ không có trong bảng mã Shift-JIS cũ (MS932) (')}${ng('https://support.microsoft.com/help/4469068', 'Microsoft KB4469068')}${t('). Japanese customers remember this: a project that formats dates by hand, or stores "R8" as text, will be asked "what happens at the next era change?" in review. Use the platform\'s calendar (Intl in JavaScript, java.time.chrono.JapaneseDate in Java) and keep the Western date as the stored value.', '). Khách Nhật nhớ chuyện này: dự án tự ghép chuỗi ngày bằng tay, hay lưu "R8" dạng chữ, sẽ bị hỏi trong buổi review "đổi niên hiệu lần sau thì sao?". Hãy dùng lịch của nền tảng (Intl trong JavaScript, java.time.chrono.JapaneseDate trong Java) và luôn lưu ngày dương lịch làm giá trị gốc.')}</p>

<h3>${t('Before you send anything: the self-check (セルフチェック)', 'Trước khi gửi bất cứ thứ gì: tự soát (セルフチェック)')}</h3>
${bang(['#', t('Check', 'Kiểm'), t('Why', 'Vì sao')], [
    ['1', t('Cover sheet: document name, version, date, author; change-history (改訂履歴) row added', 'Trang bìa: tên tài liệu, phiên bản, ngày, người soạn; đã thêm dòng lịch sử sửa đổi (改訂履歴)'), t('The first thing a reviewer looks at', 'Thứ đầu tiên người review nhìn')],
    ['2', t('Same term everywhere (患者 vs 利用者, "patient" vs "user")', 'Một thuật ngữ thống nhất (患者 hay 利用者, "patient" hay "user")'), t('Mixed terms look like mixed requirements', 'Thuật ngữ lẫn lộn trông như yêu cầu lẫn lộn')],
    ['3', t('Notation rules: dates, widths, numbering (run the script)', 'Quy ước trình bày: ngày, độ rộng chữ, đánh số (chạy script)'), t('Cheap to fix before, expensive after', 'Sửa trước thì rẻ, sửa sau thì đắt')],
    ['4', t('Every Excel sheet: cursor at A1, zoom 100 %, first sheet selected', 'Mọi sheet Excel: con trỏ ở A1, zoom 100 %, chọn sẵn sheet đầu'), t('A common Japanese office habit; reviewers do notice', 'Thói quen văn phòng Nhật hay gặp; người review có để ý')],
    ['5', t('No hidden sheets, no internal comments, author metadata checked', 'Không sheet ẩn, không ghi chú nội bộ, đã soát metadata tác giả'), t('Lesson 10.2 showed hidden sheets are readable', 'Bài 10.2 đã cho thấy sheet ẩn vẫn đọc được')],
    ['6', t('Evidence attached and named per test case', 'Đã kèm evidence và đặt tên theo test case'), t('Lesson 9.4', 'Bài 9.4')],
  ])}

<h3>${t('Review comments (指摘) are a scoreboard', 'Ý kiến review (指摘) là một bảng điểm')}</h3>
<p>${t(
    'When the customer reviews your DD or test spec, they return a comment list (指摘一覧 <em>shiteki ichiran</em>). Each row is answered with what you changed (対応内容) and a status. Many Japanese projects count these comments per document and per page as a quality metric — so "fixing quietly" without updating the list, or answering "OK" without showing where it was fixed, both hurt.',
    'Khi khách review DD hay test spec của bạn, họ gửi lại danh sách ý kiến (指摘一覧 <em>shiteki ichiran</em>). Mỗi dòng được trả lời bằng nội dung đã sửa (対応内容) và trạng thái. Nhiều dự án Nhật đếm số ý kiến theo tài liệu và theo trang làm chỉ số chất lượng — nên "sửa lặng lẽ" mà không cập nhật danh sách, hay trả lời "OK" mà không chỉ chỗ đã sửa, đều gây hại.')}</p>
${bang(['No.', t('Location', 'Vị trí'), t('Comment (指摘内容)', 'Ý kiến (指摘内容)'), t('Response (対応内容)', 'Đã xử lý (対応内容)'), t('Status', 'Trạng thái')], [
    ['1', 'DD 3.2', t('Phone number: required or optional?', 'Số điện thoại: bắt buộc hay không?'), t('Changed to optional per Q&amp;A #12 (D-1). DD v1.2, sheet 3, row 18.', 'Đổi thành không bắt buộc theo Q&amp;A #12 (D-1). DD v1.2, sheet 3, dòng 18.'), t('Fixed — waiting for confirmation', 'Đã sửa — chờ xác nhận')],
    ['2', t('Test spec TC-02', 'Test spec TC-02'), t('Full-width "ＩＤ" in the step text', 'Chữ "ＩＤ" toàn góc trong bước test'), t('Fixed; notation script added to self-check, 0 remaining', 'Đã sửa; thêm script quy ước vào tự soát, còn 0 chỗ'), t('Closed', 'Đóng')],
  ])}

<h3>${t('A real case: when nobody says what needs to be said', 'Chuyện thật: khi không ai nói điều cần nói')}</h3>
<p>${t(
    'Between February and March 2021, Mizuho Bank — one of Japan\'s three mega-banks — suffered four system failures; in one of them ATMs swallowed thousands of customers\' cards. The special investigative committee\'s report of 15 June 2021 concluded the failures came less from defects in the system than from operations and management, and pointed at a corporate culture in which staff hesitated to speak up and simply did what they were told (',
    'Từ tháng 2 tới tháng 3/2021, ngân hàng Mizuho — một trong ba siêu ngân hàng của Nhật — gặp bốn sự cố hệ thống; một lần ATM nuốt thẻ của hàng nghìn khách. Báo cáo của uỷ ban điều tra đặc biệt ngày 15/6/2021 kết luận nguyên nhân ít nằm ở lỗi hệ thống mà nhiều ở vận hành và quản lý, và chỉ ra một văn hoá doanh nghiệp nơi nhân viên ngần ngại lên tiếng, chỉ làm điều được bảo (')}${ng('https://www.mizuhogroup.com/news/2021/06/20210615_3release_eng.html', t('Mizuho release', 'thông cáo Mizuho'))}, ${ng('https://www.nippon.com/en/news/reu20210615KCN2DR07H/', 'Reuters/nippon.com')}${t(
    '). The lesson for an offshore intern is not "Japanese companies are silent". It is the opposite: a culture of politeness <em>needs</em> people who raise problems early through the proper channel. Indirectness is about <em>how</em> you say it — privately, with data, with a proposal — never about <em>whether</em>.',
    '). Bài học cho thực tập sinh offshore không phải "công ty Nhật im lặng". Ngược lại: một nền văn hoá lịch sự <em>càng cần</em> người nêu vấn đề sớm qua đúng kênh. Sự gián tiếp là chuyện nói <em>thế nào</em> — nói riêng, có số liệu, có đề xuất — không bao giờ là chuyện <em>có nói hay không</em>.')}</p>

<h3>${t('Hacker\'s corner: the password-protected ZIP habit (PPAP)', 'Góc hacker: thói quen gửi ZIP có mật khẩu (PPAP)')}</h3>
<p>${t(
    'Many Japanese companies send documents as an encrypted ZIP attachment, then the password in a second e-mail a minute later — nicknamed PPAP. It feels safe, but both mails travel the same path, so anyone who can read one can read the other; and a mail gateway cannot open an encrypted ZIP to scan it for malware, which attackers exploit by sending malicious encrypted ZIPs that look exactly like business mail. In November 2020 Japan\'s digital-reform minister Hirai Takuya announced that central government offices would stop using it, and large companies such as Hitachi followed (',
    'Nhiều công ty Nhật gửi tài liệu dạng ZIP mã hoá đính kèm, rồi một phút sau gửi mật khẩu trong email thứ hai — được gọi đùa là PPAP. Trông thì an toàn, nhưng hai thư đi cùng một đường, ai đọc được thư này thì đọc được thư kia; và cổng thư không mở được ZIP mã hoá để quét mã độc — kẻ tấn công lợi dụng điều này, gửi ZIP mã hoá chứa mã độc trông y như thư công việc. Tháng 11/2020, Bộ trưởng cải cách số Hirai Takuya tuyên bố các cơ quan chính phủ trung ương ngừng dùng cách này, các tập đoàn như Hitachi làm theo (')}${ng('https://www.itmedia.co.jp/business/spv/2012/15/news007.html', 'ITmedia 12/2020')}, ${ng('https://www.hitachi.com/ja-jp/information/articles/2021/1008/', 'Hitachi 2021')}${t(
    '). What you do: follow the file-transfer method your project\'s security rules specify (often a managed file-sharing service); if a mail arrives with an encrypted ZIP you did not expect — even from a "customer" — check with the sender through another channel before opening it (lesson 10.6).',
    '). Bạn làm gì: gửi tệp đúng cách mà quy định an ninh của dự án chỉ định (thường là dịch vụ chia sẻ tệp có quản lý); nhận thư kèm ZIP mã hoá mà mình không chờ — kể cả từ "khách" — hãy xác minh với người gửi qua kênh khác trước khi mở (bài 10.6).')}</p>

<h3>${t('An OJT situation', 'Tình huống OJT')}</h3>
<p>${t(
    'Friday 16:30. The customer\'s Q&amp;A answer says: "Regarding the export button, 前向きに検討します. 念のため, please confirm the CSV encoding." Your leader is on leave. What do you write in the daily report?',
    'Thứ Sáu 16:30. Câu trả lời Q&amp;A của khách ghi: "Về nút xuất tệp, 前向きに検討します. 念のため, hãy xác nhận mã hoá ký tự của CSV." Leader của bạn nghỉ phép. Bạn ghi gì vào báo cáo ngày?')}</p>
${giai(t('A good answer', 'Một câu trả lời tốt'), `<ul>
<li>${t('Export button: <strong>not decided</strong> — Q&amp;A stays Open, follow-up date next Wednesday; no implementation started.', 'Nút xuất tệp: <strong>chưa quyết</strong> — Q&amp;A để Open, ngày hỏi lại thứ Tư tới; chưa làm gì.')}</li>
<li>${t('CSV encoding: treated as a real request — checked: current output is UTF-8 without BOM; Excel on Japanese Windows may show it garbled. Raised as Q&amp;A #15 with two options (UTF-8 with BOM / Shift_JIS) and a recommendation.', 'Mã hoá CSV: coi là yêu cầu thật — đã kiểm: tệp xuất hiện là UTF-8 không BOM; Excel trên Windows tiếng Nhật có thể hiện chữ lỗi. Đã nêu thành Q&amp;A #15 với hai phương án (UTF-8 có BOM / Shift_JIS) và một đề xuất.')}</li>
<li>${t('Informed the BrSE by chat; no reply needed before Monday.', 'Đã báo BrSE qua chat; không cần trả lời trước thứ Hai.')}</li>
</ul>`)}

<h3>${t('Exercise: what do they really mean?', 'Bài tập: thật ra họ muốn nói gì?')}</h3>
<ol>
<li>${t('"That approach is a little… (ちょっと…)"', '"Cách đó thì hơi… (ちょっと…)"')}</li>
<li>${t('"It would help us if you could add the screen ID to every page footer."', '"Nếu anh chị thêm được mã màn hình vào chân mỗi trang thì chúng tôi đỡ lắm."')}</li>
<li>${t('"Hai, hai" while you explain why the deadline must move.', '"Hai, hai" trong lúc bạn giải thích vì sao phải lùi hạn.')}</li>
<li>${t('"Just to be sure (念のため), was the test run on the staging database?"', '"Cho chắc (念のため), test đã chạy trên database staging chưa?"')}</li>
<li>${t('"We will consider it (検討します)" about a feature you proposed, with no date.', '"Chúng tôi sẽ xem xét (検討します)" về một tính năng bạn đề xuất, không kèm ngày.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('No. Stop, discuss alternatives with the BrSE after the meeting.', 'Không. Dừng lại, bàn phương án khác với BrSE sau họp.')}</li>
<li>${t('A request. Add to minutes with owner + date; check scope; if out of scope, it becomes a CR.', 'Một yêu cầu. Ghi biên bản có người + hạn; kiểm phạm vi; ngoài phạm vi thì thành CR.')}</li>
<li>${t('Only "I am listening". Get the new date confirmed in writing.', 'Chỉ là "tôi đang nghe". Phải xin xác nhận ngày mới bằng văn bản.')}</li>
<li>${t('They doubt it. Answer with evidence: environment, time, log or screenshot.', 'Họ đang nghi. Trả lời kèm bằng chứng: môi trường, giờ chạy, log hoặc ảnh chụp.')}</li>
<li>${t('Most likely no, for now. Do not build it; keep it Open with a follow-up, or close it after asking the BrSE.', 'Nhiều khả năng là chưa/không. Đừng làm; để Open có ngày hỏi lại, hoặc đóng sau khi hỏi BrSE.')}</li>
</ol>`)}

${phongVan([
    [t('Have you worked with Japanese customers? What is different?', 'Bạn từng làm với khách Nhật chưa? Khác ở đâu?'), t('Quality and detail of deliverables, no surprises, decisions by consensus. Concretely: I self-check documents with notation rules, report risks early through hourensou, and confirm decisions with closed questions in writing.', 'Chất lượng và độ chi tiết của sản phẩm, không bất ngờ, quyết định theo đồng thuận. Cụ thể: em tự soát tài liệu theo quy ước trình bày, báo rủi ro sớm theo hourensou, và chốt quyết định bằng câu hỏi đóng có văn bản.')],
    [t('The customer said "we will consider it". What do you do?', 'Khách nói "sẽ xem xét". Bạn làm gì?'), t('I do not treat it as approval. I keep the item open with a follow-up date and ask the BrSE how this customer usually means it; if a decision is needed I send a closed question with a proposed default.', 'Em không coi đó là đồng ý. Em để mục đó Open có ngày hỏi lại và hỏi BrSE khách này thường có ý gì; nếu cần quyết thì gửi câu hỏi đóng kèm phương án mặc định.')],
    [t('What is nemawashi and how would you use it as a junior?', 'Nemawashi là gì, là junior bạn dùng thế nào?'), t('Preparing agreement before a meeting. As a junior: send review material early, warn my leader before raising an issue with the customer, never contradict my team in front of the customer.', 'Chuẩn bị đồng thuận trước buổi họp. Là junior: gửi tài liệu review sớm, báo leader trước khi nêu vấn đề với khách, không cãi lại đội mình trước mặt khách.')],
    [t('How do you handle a review comment list with 30 comments?', 'Bạn xử lý danh sách 30 ý kiến review thế nào?'), t('Answer every row with what changed and where, fix the root cause (for example add a check to the self-check list so the same type does not return), and report the count honestly.', 'Trả lời từng dòng: sửa gì, ở đâu; sửa tận gốc (ví dụ thêm mục vào danh sách tự soát để lỗi cùng loại không quay lại), và báo số lượng trung thực.')],
  ], en)}

${thuatNgu([
    [t('High-/low-context', 'Ngữ cảnh cao/thấp'), t('Meaning carried mostly by context vs mostly by explicit words (Hall, 1976)', 'Ý nghĩa nằm chủ yếu ở ngữ cảnh / ở lời nói rõ ràng (Hall, 1976)')],
    ['根回し nemawashi', t('Building agreement individually before a meeting', 'Tạo đồng thuận với từng người trước buổi họp')],
    ['稟議 ringi', t('Written proposal approved by several managers in turn', 'Tờ trình được nhiều cấp lần lượt duyệt')],
    ['表記ルール', t('Document notation rules (dates, widths, terms)', 'Quy ước trình bày tài liệu (ngày, độ rộng chữ, thuật ngữ)')],
    ['全角 / 半角', t('Full-width / half-width characters', 'Chữ toàn góc / bán góc')],
    ['和暦 / 西暦', t('Japanese era year / Western year', 'Năm niên hiệu / năm dương lịch')],
    ['指摘一覧', t('Review comment list', 'Danh sách ý kiến review')],
    ['PPAP', t('Encrypted ZIP + password in a second e-mail — being phased out', 'ZIP mã hoá + mật khẩu ở thư thứ hai — đang bị bỏ dần')],
  ], en)}

${tomTat([
    t('Japanese customers usually value quality, detail, the promised date and no surprises; decisions are prepared by consensus.', 'Khách Nhật thường coi trọng chất lượng, chi tiết, đúng hạn đã hứa và không bất ngờ; quyết định được chuẩn bị bằng đồng thuận.'),
    t('"検討します", "難しいです", "ちょっと…" usually mean no; "はい" means "I hear you". Confirm with closed questions in writing.', '"検討します", "難しいです", "ちょっと…" thường là không; "はい" là "tôi đang nghe". Chốt bằng câu hỏi đóng có văn bản.'),
    t('Nemawashi at junior level: send material early, warn your leader first, never contradict your team in front of the customer.', 'Nemawashi ở mức junior: gửi tài liệu sớm, báo leader trước, không cãi đội mình trước mặt khách.'),
    t('Automate the detail checks (dates, full-/half-width); use the platform calendar, never hand-made era strings.', 'Tự động hoá phần kiểm chi tiết (ngày, toàn/bán góc); dùng lịch của nền tảng, không tự ghép chuỗi niên hiệu.'),
    t('Politeness is about how you raise a problem, never whether — Mizuho 2021.', 'Lịch sự là chuyện nêu vấn đề thế nào, không phải có nêu hay không — Mizuho 2021.'),
  ], en)}
<p>${t('Learning Japanese itself: ', 'Học tiếng Nhật: ')}${ac('elementary-japanese-1-a11', 'jpd113-chao-hoi-so', t('JPD113 — greetings', 'JPD113 — chào hỏi'))}. ${t('Next', 'Tiếp theo')}: ${ag('agl-11-2-khach-my', t('11.2 — American and European clients', '11.2 — Khách Mỹ và châu Âu'))}.</p>
`);
};
