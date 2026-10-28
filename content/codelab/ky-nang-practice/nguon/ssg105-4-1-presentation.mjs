/**
 * Kỹ năng nghề · 🎤 4.1 — Cấu trúc một bài nói kỹ thuật 3 phút (gắn bài SSG105 4.1 Presentations).
 * Dữ liệu thật: SWT301 SportShop module A (Lab 2: 113 UTCID 93P/20F · Lab 3: 22 ca 16P/6F, 3 round) — ~/Documents/SWT301-SportShop.
 */
import { moDun, sapXep, tracNghiem, phanLoai, TN } from './_chung.mjs';

const P1 = sapXep({
  tieuDe: 'Talk 1 — Order the blocks of a 3-minute technical talk',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p>A short technical talk (a lab defence, a sprint demo, an OJT stand-up update) has the same skeleton: <b>hook → context → what I did → results with numbers → the bug worth telling → lessons → close</b>. The listener first needs a reason to listen, then just enough context, then proof. Put the seven blocks in order — first the generic skeleton, then the real blocks of the SportShop Lab 2+3 talk.</p>',
    vi: '<p>Một bài nói kỹ thuật ngắn (bảo vệ lab, demo sprint, cập nhật khi OJT) có chung bộ khung: <b>câu mở gây chú ý → bối cảnh → mình đã làm gì → kết quả có số → lỗi đáng kể nhất → bài học → câu chốt</b>. Người nghe cần một lý do để nghe trước, rồi vừa đủ bối cảnh, rồi bằng chứng. Sắp bảy khối — trước là bộ khung chung, sau là các khối thật của bài trình bày Lab 2+3 SportShop.</p>',
  },
  cau: [
    {
      en: 'Generic skeleton of a 3-minute talk', vi: 'Bộ khung chung của bài nói 3 phút',
      dung: ['Hook — a problem, a number or a question', 'Context — what system, which part is mine', 'What I did — method and tools', 'Results — with numbers', 'The bug worth telling — one story', 'Lessons — what I would do again / differently', 'Close — one-sentence takeaway, then invite questions'],
      giai: ['Problem first, proof in the middle, takeaway last. Context is short: one or two sentences.', 'Vấn đề trước, bằng chứng ở giữa, điều mang về ở cuối. Bối cảnh ngắn: một hai câu.'],
    },
    {
      en: 'The SportShop Lab 2+3 talk (module A — Authentication & Account)', vi: 'Bài nói Lab 2+3 SportShop (module A — Xác thực & Tài khoản)',
      dung: [
        '“With one hidden form field, any logged-in user could change ANOTHER account’s password — our integration tests caught it.”',
        'SportShop: Java Servlet/JSP on Tomcat 10 + SQL Server; I own module A (Login, Register, Profile, ChangePassword, AuthFilter, UserDAO).',
        'Lab 2: 113 unit tests with Mockito (no database). Lab 3: 22 integration cases through the real API with Postman/Newman on a test database, 3 rounds.',
        'Unit 93 pass / 20 fail (82.3%); integration 16 pass / 6 fail (72.7%) in all 3 rounds; line coverage 99.3%, branch 93.5%.',
        'SS-28: UpdateProfileServlet takes the username from the form and UserDAO updates WHERE USER_name = ? — IT17 proves it.',
        'Expected results come from the spec; we never change an expected value to match buggy code; validate on the server, not only in JavaScript.',
        '“Every fail on our sheet is a real defect with a ticket — the next step is fixing SS-28 first. I’m happy to take questions.”',
      ],
      giai: ['Hook (SS-28 as a story) → context (system + my module) → method (Lab 2/Lab 3) → numbers → the bug with file and line → lessons → takeaway + questions.', 'Mở (SS-28 kể như chuyện) → bối cảnh (hệ thống + module của mình) → cách làm (Lab 2/Lab 3) → số liệu → lỗi kèm tệp và dòng → bài học → câu chốt + mời hỏi.'],
    },
  ],
  goiY: ['Câu đầu phải khiến người nghe muốn nghe tiếp — không phải lời chào hay tên đề tài.', 'Số liệu đứng TRƯỚC câu chuyện lỗi: người nghe cần biết quy mô rồi mới nghe ví dụ.'],
  loiHayGap: ['Mở bằng "Em xin chào cô và các bạn, hôm nay em xin trình bày…" — mất 10 giây đầu, lúc người nghe tập trung nhất.', 'Đặt bài học trước kết quả — chưa có bằng chứng thì bài học nghe như khẩu hiệu.', 'Kết bằng "Em xin hết" không có câu chốt — người nghe không biết phải nhớ gì.'],
  giaiThich: { en: '<p>Both questions follow the same skeleton. Notice that the SportShop hook IS the bug story compressed to one sentence — the talk opens and closes on the same idea.</p>', vi: '<p>Hai câu theo cùng bộ khung. Để ý câu mở SportShop CHÍNH là câu chuyện lỗi nén còn một câu — bài nói mở và kết cùng một ý.</p>' },
  thuatNgu: [TN.hook, TN.takeaway, TN.signpost],
  khaiNiem: ['talk structure', 'hook', 'takeaway'],
});

const P2 = tracNghiem({
  tieuDe: 'Talk 2 — Pick the strongest opening line',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p>The first 10 seconds decide whether the room listens. A strong opening is a <b>problem, a surprising number, or a question</b> that the rest of the talk answers. Greetings and “today I will present…” can come after the hook, in one short sentence, or be skipped. Pick the strongest opening for each situation.</p>',
    vi: '<p>10 giây đầu quyết định cả phòng có nghe hay không. Câu mở mạnh là <b>một vấn đề, một con số bất ngờ, hoặc một câu hỏi</b> mà phần còn lại trả lời. Lời chào và "hôm nay em xin trình bày…" có thể đặt sau câu mở, một câu ngắn, hoặc bỏ. Chọn câu mở mạnh nhất cho từng tình huống.</p>',
  },
  cau: [
    { en: 'SWT301 Lab 3 defence (integration tests of module A).', vi: 'Bảo vệ Lab 3 SWT301 (kiểm thử tích hợp module A).', lc: [['a', '“Good morning teacher and friends, my name is Cuong, today I present Lab 3.”'], ['b', '“6 of our 22 integration cases fail — and every one of them is a real bug a customer could hit.”'], ['c', '“Integration testing is a very important level of testing.”'], ['d', '“Sorry, our slides are not finished yet, but…”']], dap: 'b', giai: ['A number plus a consequence. (a) wastes the hook, (c) is a definition nobody needs, (d) apologises before giving value.', 'Con số kèm hệ quả. (a) phí câu mở, (c) là định nghĩa không ai cần, (d) xin lỗi trước khi đưa ra giá trị.'] },
    { en: 'Sprint demo of a new search feature to the product owner.', vi: 'Demo sprint tính năng tìm kiếm mới cho product owner.', lc: [['a', '“Last sprint, finding an order took 4 clicks and 20 seconds. Watch this.”'], ['b', '“We used Elasticsearch 8 with a custom analyzer.”'], ['c', '“This sprint we did a lot of work.”'], ['d', '“Let me first explain our folder structure.”']], dap: 'a', giai: ['The PO cares about the user problem and the before/after. Tools come later, if asked.', 'PO quan tâm vấn đề của người dùng và trước/sau. Công cụ để sau, nếu được hỏi.'] },
    { en: 'OJT weekly update to your mentor (2 minutes).', vi: 'Cập nhật tuần OJT với mentor (2 phút).', lc: [['a', '“This week was quite busy.”'], ['b', '“Short version: login API is done and tested, payment is blocked on the sandbox key — I need your help with that.”'], ['c', '“On Monday I opened VS Code, then…”'], ['d', '“I have nothing special to report.”']], dap: 'b', giai: ['Bottom line first: status + the one thing you need. A day-by-day diary hides the blocker.', 'Kết luận trước: tình trạng + điều mình cần. Kể từng ngày làm chìm điểm tắc.'] },
    { en: 'Lab 2 (unit tests) — the room has already heard 4 groups present the same lab.', vi: 'Lab 2 (unit test) — cả phòng đã nghe 4 nhóm trình bày cùng lab.', lc: [['a', '“Unit testing tests units.”'], ['b', '“Our 113 tests never touch a database — so why did 20 of them fail?”'], ['c', '“Like the other groups, we also did unit tests.”'], ['d', '“I will read the slide now.”']], dap: 'b', giai: ['A question the talk answers (the 20 fails are real defects in the code). It also tells the room what is DIFFERENT about your work.', 'Một câu hỏi mà bài nói trả lời (20 ca fail là lỗi thật của code). Nó cũng cho cả phòng biết bài của bạn KHÁC ở đâu.'] },
  ],
  goiY: ['Câu mở tốt chứa một con số hoặc một vấn đề cụ thể.', 'Hỏi: nếu người nghe chỉ nghe câu này, họ có muốn nghe tiếp không?'],
  loiHayGap: ['Mở bằng định nghĩa sách giáo khoa.', 'Xin lỗi trước ("slide chưa đẹp", "em chưa chuẩn bị kỹ") — tự hạ giá trị trước khi bắt đầu.'],
  thuatNgu: [TN.hook, TN.bluf],
  khaiNiem: ['hook', 'opening'],
});

const P3 = tracNghiem({
  tieuDe: 'Talk 3 — Slide headlines that state the conclusion',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p>A topic label (“Test results”) makes the audience work out the message themselves. An <b>assertion headline</b> is a short sentence that states the conclusion of the slide (“16 of 22 integration cases pass — the 6 fails are real defects”). The body of the slide is then the evidence for that sentence. Choose the best headline for each slide.</p>',
    vi: '<p>Nhãn chủ đề ("Test results") bắt người nghe tự rút ra thông điệp. <b>Tiêu đề khẳng định</b> là một câu ngắn nói kết luận của slide ("16/22 ca tích hợp đạt — 6 ca fail là lỗi thật"). Thân slide là bằng chứng cho câu đó. Chọn tiêu đề tốt nhất cho từng slide.</p>',
  },
  cau: [
    { en: 'A slide with the Lab 3 table: 22 cases, 3 rounds, 16 P / 6 F every round.', vi: 'Slide bảng Lab 3: 22 ca, 3 round, mỗi round 16 P / 6 F.', lc: [['a', 'Test results'], ['b', 'Integration: 16/22 pass in all 3 rounds — the 6 fails are real defects, not flaky tests'], ['c', 'Results of the integration testing of module A of SportShop in Lab 3'], ['d', 'Round 1, Round 2, Round 3']], dap: 'b', giai: ['States the number AND what it means (stable across rounds ⇒ not flaky).', 'Nói con số VÀ ý nghĩa (ổn định qua các round ⇒ không chập chờn).'] },
    { en: 'A slide with JaCoCo coverage: lines 99.3%, branches 93.5%; the 8 missed branches are in UserDAO.', vi: 'Slide độ phủ JaCoCo: dòng 99,3%, nhánh 93,5%; 8 nhánh thiếu nằm ở UserDAO.', lc: [['a', 'Coverage'], ['b', 'JaCoCo report'], ['c', 'Coverage is high: 99.3% lines, 93.5% branches — the 8 missed branches cannot be reached'], ['d', 'We tried our best on coverage']], dap: 'c', giai: ['Answers the question the teacher will ask (“why not 100%?”) before it is asked.', 'Trả lời trước câu cô sẽ hỏi ("sao không 100%?").'] },
    { en: 'A slide showing AuthFilter.java line 45 and the failing test.', vi: 'Slide chiếu AuthFilter.java dòng 45 và ca test fail.', lc: [['a', 'AuthFilter'], ['b', 'Code'], ['c', 'A guest opening /dashboard gets HTTP 500: AuthFilter calls getRole() on a null account (SS-19)'], ['d', 'Bug']], dap: 'c', giai: ['Who is hurt, what they see, the cause and the ticket — in one line.', 'Ai bị ảnh hưởng, thấy gì, nguyên nhân và mã lỗi — trong một dòng.'] },
    { en: 'A slide comparing three test levels (unit / integration / system) for module A.', vi: 'Slide so sánh ba cấp test (unit / integration / system) cho module A.', lc: [['a', 'Three levels'], ['b', 'One bug, three levels: SS-19 shows up as a unit fail, IT10 and the RL02 screenshot'], ['c', 'Testing levels in ISTQB'], ['d', 'Unit vs Integration vs System']], dap: 'b', giai: ['Turns a textbook comparison into YOUR evidence chain.', 'Biến một phép so sánh sách vở thành chuỗi bằng chứng của BẠN.'] },
    { en: 'A slide listing lessons learned.', vi: 'Slide bài học rút ra.', lc: [['a', 'Lessons learned'], ['b', 'Conclusion'], ['c', 'Validate on the server: IT05 bypassed the JavaScript-only password rule with one direct POST'], ['d', 'Thank you']], dap: 'c', giai: ['A lesson tied to your own evidence is believable. Check before you say it: the claim must match your table.', 'Bài học gắn với số của chính mình mới đáng tin. Kiểm trước khi nói: câu phải khớp bảng.'] },
  ],
  goiY: ['Tiêu đề tốt là một CÂU, có động từ, có con số khi slide có số.', 'Đọc mỗi tiêu đề và tự hỏi: "rồi sao?" — nếu vẫn phải hỏi thì chưa phải kết luận.'],
  loiHayGap: ['Dùng tên chủ đề làm tiêu đề ("Results", "Coverage").', 'Tiêu đề dài hai dòng, chép lại cả nội dung slide.', 'Tiêu đề khẳng định điều bảng không chứng minh được.'],
  giaiThich: { en: '<p>Tip for tonight: read only your slide headlines aloud, in order. If that alone tells the story, the deck works.</p>', vi: '<p>Mẹo tối nay: đọc to chỉ các tiêu đề slide theo thứ tự. Nếu chỉ vậy đã kể đủ câu chuyện thì bộ slide ổn.</p>' },
  thuatNgu: [TN.headline, TN.evidence],
  khaiNiem: ['assertion headline', 'slide design'],
});

const P4 = tracNghiem({
  tieuDe: 'Talk 4 — Close strongly and handle the clock',
  doKho: 'MEDIUM', phut: 7,
  moTa: {
    en: '<p>The last 15 seconds are what people remember, and the clock is what teachers grade without saying so. A strong close repeats the one idea (the takeaway) and opens the floor. When time runs short you cut <b>detail</b>, never the results or the close. Choose the best move in each situation.</p>',
    vi: '<p>15 giây cuối là thứ người nghe nhớ, còn đồng hồ là thứ thầy cô chấm mà không nói ra. Kết mạnh là nhắc lại một ý (điều mang về) rồi mời hỏi. Khi thiếu giờ thì cắt <b>chi tiết</b>, không bao giờ cắt kết quả hay câu chốt. Chọn cách làm tốt nhất cho mỗi tình huống.</p>',
  },
  cau: [
    { en: 'Which closing line is best?', vi: 'Câu kết nào tốt nhất?', lc: [['a', '“That’s all, thank you.”'], ['b', '“So: every fail on our sheet is a real defect with a ticket, and SS-28 must be fixed first. Questions?”'], ['c', '“I hope you enjoyed my presentation.”'], ['d', '“I think that’s it… any questions? No? OK.”']], dap: 'b', giai: ['Takeaway + priority + invitation. “Thank you” is fine AFTER the takeaway, not instead of it.', 'Điều mang về + ưu tiên + mời hỏi. "Cảm ơn" được, nhưng SAU câu chốt, không thay nó.'] },
    { en: 'You are at 2:30 of a 3:00 slot and still on the method slide. What do you do?', vi: 'Đang ở 2:30 trên 3:00 mà vẫn ở slide phương pháp. Làm gì?', lc: [['a', 'Speak faster to fit everything.'], ['b', 'Skip to the results slide, give the two numbers and the takeaway in 30 seconds.'], ['c', 'Continue normally and go over time — content matters more.'], ['d', 'Stop and say you ran out of time.']], dap: 'b', giai: ['Results and close are what is graded; method details can come back in Q&A.', 'Kết quả và câu chốt là thứ được chấm; chi tiết phương pháp có thể quay lại khi hỏi đáp.'] },
    { en: 'How do you make sure a 3-minute talk really fits in 3 minutes?', vi: 'Làm sao chắc bài nói 3 phút vừa đúng 3 phút?', lc: [['a', 'Count slides: 1 minute per slide.'], ['b', 'Write the script, keep it ≤ 390 words (≈ 130 words per minute), then rehearse aloud with a timer and a recording.'], ['c', 'Rehearse silently in your head.'], ['d', 'Improvise — scripts sound robotic.']], dap: 'b', giai: ['Silent rehearsal is ~30% faster than speaking aloud. Only an out-loud, timed run is real data.', 'Tập thầm nhanh hơn nói to ~30%. Chỉ lần nói to có bấm giờ mới là số liệu thật.'] },
    { en: 'In a team talk, the speaker before you runs 1 minute over. Your part is 2 minutes.', vi: 'Trong bài nhóm, người trước bạn lố 1 phút. Phần bạn có 2 phút.', lc: [['a', 'Give your full 2 minutes anyway.'], ['b', 'Deliver your 1-minute version: headline, the key number, your one bug — prepared in advance.'], ['c', 'Complain to the teammate on stage.'], ['d', 'Skip your part.']], dap: 'b', giai: ['Prepare a short version of your part before the day; the slot belongs to the team, not to one speaker.', 'Chuẩn bị sẵn bản rút gọn trước buổi; khung giờ là của cả nhóm, không của một người.'] },
  ],
  goiY: ['Thiếu giờ ⇒ cắt chi tiết, giữ kết quả + câu chốt.', 'Câu chốt = một câu người nghe có thể nhắc lại.'],
  loiHayGap: ['Kết bằng "Em xin hết ạ" và im lặng.', 'Nói nhanh hơn để nhồi cho đủ — người nghe bỏ cuộc trước.', 'Không có bản rút gọn cho phần của mình trong bài nhóm.'],
  thuatNgu: [TN.takeaway, TN.timebox, TN.wpm],
  khaiNiem: ['closing', 'time management'],
});

const P5 = phanLoai({
  tieuDe: 'Talk 5 — Signposts: which block does each sentence open?',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>Signposts are the short sentences that tell the listener where they are in the talk. Without them, a listener who drifted for five seconds is lost for the rest. Match each sentence (from a real rehearsal of the SportShop talk) to the block it opens.</p>',
    vi: '<p>Câu chuyển ý là những câu ngắn cho người nghe biết đang ở đâu trong bài. Thiếu chúng, người nghe lơ đãng 5 giây là lạc tới hết bài. Ghép mỗi câu (từ một lần tập bài SportShop) với khối mà nó mở ra.</p>',
  },
  cot: 'Block',
  luaChon: ['Context', 'What I did', 'Results', 'The bug', 'Lessons', 'Close'],
  hang: [
    ['“First, where this happens: SportShop’s login and account module, which I own.”', 'Context', '“Trước hết, chuyện xảy ra ở đâu: module đăng nhập và tài khoản của SportShop, phần em phụ trách.”'],
    ['“To find these problems I tested at two levels.”', 'What I did', '“Để tìm các vấn đề này em kiểm ở hai cấp.”'],
    ['“So what did the numbers say?”', 'Results', '“Vậy các con số nói gì?”'],
    ['“Let me show you the one fail that worried me most.”', 'The bug', '“Em xin chỉ ca fail khiến em lo nhất.”'],
    ['“If I did this lab again, I would do two things differently.”', 'Lessons', '“Nếu làm lại lab này, em sẽ làm khác hai điều.”'],
    ['“If you remember one thing from this talk…”', 'Close', '“Nếu chỉ nhớ một điều từ bài này…”'],
    ['“Here is the evidence: the database row before and after IT17.”', 'The bug', '“Đây là bằng chứng: dòng dữ liệu trước và sau IT17.”'],
    ['“Across three rounds the picture did not change.”', 'Results', '“Qua ba round, bức tranh không đổi.”'],
  ],
  giaiBang: ['A signpost names the next block or asks the question the next block answers.', 'Câu chuyển ý gọi tên khối tiếp theo hoặc đặt câu hỏi mà khối đó trả lời.'],
  goiY: ['Câu hỏi "Vậy các con số nói gì?" mở phần kết quả.', '"Bằng chứng" của một lỗi cụ thể vẫn thuộc khối lỗi.'],
  loiHayGap: ['Dùng mãi một câu chuyển "Tiếp theo là…" — người nghe không biết phần sau quan trọng ra sao.', 'Nhầm câu chuyển sang bài học với câu chốt cuối.'],
  giaiThich: '<p>Context · What I did · Results · The bug · Lessons · Close · The bug · Results.</p>',
  thuatNgu: [TN.signpost],
  khaiNiem: ['signposting'],
});

export default moDun({
  slug: 'ssg105-4-1-presentation',
  ten: '4.1 A 3-minute technical talk: structure, hook, headlines, close',
  moTaModule: 'Bộ khung bài nói kỹ thuật 3 phút (mở → bối cảnh → làm gì → số liệu → lỗi → bài học → chốt) trên bài Lab 2+3 SportShop thật, câu mở mạnh, tiêu đề slide nói kết luận, kết bài và giữ giờ, câu chuyển ý.',
  de: [P1, P2, P3, P4, P5],
});
