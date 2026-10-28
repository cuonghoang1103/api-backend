/**
 * Kỹ năng nghề · 🎤 4.4 — Bảo vệ & hỏi đáp: khung PREP, nói "em chưa biết" trung thực, chiến lược theo loại câu hỏi,
 * kỹ thuật thi nói (dùng cho JPD123 thi nói T6 30/10 — phần tiếng Nhật có bộ riêng).
 * Câu hỏi thật: ~/Documents/SWT301-SportShop/bao-cao/ON-TAP-REVIEW.md mục 7.
 */
import { moDun, sapXep, tracNghiem, phanLoai, TN } from './_chung.mjs';

const Q1 = sapXep({
  tieuDe: 'Defence 1 — Put the PREP answer in order',
  doKho: 'EASY', phut: 7,
  moTa: {
    en: '<p><b>PREP</b> = <b>P</b>oint (answer in one sentence) → <b>R</b>eason (why) → <b>E</b>xample (your evidence: a number, a file, a case id) → <b>P</b>oint again (one sentence that closes). It keeps a nervous answer short and makes the first sentence the answer — committees stop listening to answers that start with background. Order the four sentences of each answer.</p>',
    vi: '<p><b>PREP</b> = <b>P</b>oint (trả lời bằng một câu) → <b>R</b>eason (vì sao) → <b>E</b>xample (bằng chứng: một con số, một tệp, một mã ca) → <b>P</b>oint lần nữa (một câu chốt). Nó giữ câu trả lời lúc run ngắn gọn và đặt câu trả lời ở câu ĐẦU — hội đồng thôi nghe những câu bắt đầu bằng bối cảnh. Sắp bốn câu của mỗi câu trả lời.</p>',
  },
  cau: [
    {
      en: '“So many tests fail — are your tests wrong?”', vi: '"Nhiều test fail thế — có phải test của em sai không?"',
      dung: ['No — each fail is a real defect in SportShop, not a test mistake.', 'Expected results come from the requirements, and we never change an expected value to match buggy code.', 'For example IT10 fails because AuthFilter.java line 45 calls getRole() on a null account — ticket SS-19.', 'So the 6 fails are 6 tickets the developers must fix.'],
      giai: ['Point first; the reason is the rule you followed; the example is a case id + file + ticket; the last sentence restates the point.', 'Ý chính trước; lý do là quy tắc mình theo; ví dụ là mã ca + tệp + mã lỗi; câu cuối nhắc lại ý chính.'],
    },
    {
      en: '“Why are all three rounds 16 pass / 6 fail?”', vi: '"Sao cả ba round đều 16 đạt / 6 fail?"',
      dung: ['Because the code did not change between rounds — our job was to find and report defects, not fix them.', 'Round 2 re-ran after logging the bugs, and round 3 re-ran on a freshly loaded database.', 'Identical results on a clean database show the fails are stable and not caused by dirty data.', 'So three equal rounds are evidence of reliable tests, not of copying.'],
      giai: ['The reason sentence explains what each round was for; the example is the clean-database round.', 'Câu lý do giải thích mỗi round để làm gì; ví dụ là round chạy trên CSDL sạch.'],
    },
    {
      en: '“Why validate on the server if the page already checks in JavaScript?”', vi: '"Sao phải kiểm ở server khi trang đã kiểm bằng JavaScript?"',
      dung: ['Because JavaScript checks can be skipped completely.', 'Anyone can send the HTTP request directly, without the page.', 'IT05 posts the 7-character password “Sport@1” straight to /signup and the row is stored — ticket SS-22.', 'So the server must enforce every rule itself.'],
      giai: ['Here the evidence is a case that bypasses the page with one request.', 'Ở đây bằng chứng là một ca vượt trang chỉ bằng một request.'],
    },
  ],
  goiY: ['Câu nào trả lời thẳng "có/không/vì…" thì là Point.', 'Câu có mã ca/tệp/con số là Example; câu bắt đầu "So…" là Point cuối.'],
  loiHayGap: ['Bắt đầu bằng bối cảnh dài rồi mới trả lời.', 'Thiếu ví dụ — câu trả lời nghe như học thuộc.', 'Quên câu chốt, câu trả lời lửng lơ.'],
  thuatNgu: [TN.prep, TN.qa, TN.evidence],
  khaiNiem: ['PREP', 'Q&A'],
});

const Q2 = tracNghiem({
  tieuDe: 'Defence 2 — Choose the best answer to committee questions',
  doKho: 'MEDIUM', phut: 10,
  moTa: {
    en: '<p>Six questions the SWT301 committee really asks about module A. For each, pick the answer that is <b>correct, short, starts with the point and carries evidence</b>. The wrong options are the classic traps: rambling background, defending instead of answering, inventing facts, blaming teammates.</p>',
    vi: '<p>Sáu câu hội đồng SWT301 thật sự hay hỏi về module A. Mỗi câu, chọn câu trả lời <b>đúng, ngắn, nói ý chính trước và có bằng chứng</b>. Phương án sai là các bẫy kinh điển: kể bối cảnh lan man, chống chế thay vì trả lời, bịa, đổ lỗi cho bạn.</p>',
  },
  cau: [
    { en: '“What is a mock and why did you need mockConstruction?”', vi: '"Mock là gì, sao cần mockConstruction?"', lc: [['a', '“A mock is a fake dependency so a unit test runs without Tomcat or a database. I needed mockConstruction because the servlets call new UserDAO() inside, so I cannot pass a fake in — LoginServletTest shows it.”'], ['b', '“Mockito is a very popular framework created in 2008…”'], ['c', '“The teacher’s sample used it, so I used it.”'], ['d', '“It makes the tests pass.”']], dap: 'a', giai: ['Definition in one clause, the reason specific to THIS code, a file to open.', 'Định nghĩa một vế, lý do riêng cho CHÍNH code này, một tệp để mở.'] },
    { en: '“Did you reach 100 test cases per KLOC?”', vi: '"Em có đạt 100 ca/KLOC không?"', lc: [['a', '“I think so, I wrote a lot of tests.”'], ['b', '“Yes. The module has 389 lines, so at least 39 cases are needed — the template rounds up per function to 47 — and I have 113, about 290 per KLOC.”'], ['c', '“KLOC means thousand lines of code.”'], ['d', '“That rule is not important.”']], dap: 'b', giai: ['Yes/no first, then the arithmetic the teacher can check.', 'Có/không trước, rồi phép tính cô kiểm lại được.'] },
    { en: '“Why is UserDAO not at 100% branch coverage?”', vi: '"Sao UserDAO chưa 100% độ phủ nhánh?"', lc: [['a', '“We ran out of time.”'], ['b', '“The 8 missing branches cannot be reached: 6 are null checks the compiler adds for try-with-resources, 2 are an if (rs != null) that is always true. The coverage file lists them.”'], ['c', '“100% coverage is impossible in general.”'], ['d', '“The tool is wrong.”']], dap: 'b', giai: ['A precise reason plus where to verify it. Never claim the tool is wrong without proof.', 'Lý do chính xác + chỗ kiểm chứng. Đừng nói công cụ sai khi không có bằng chứng.'] },
    { en: '“Which bug is the most serious, and how would you fix it?”', vi: '"Lỗi nào nghiêm trọng nhất, sửa thế nào?"', lc: [['a', '“SS-28: a logged-in user can change another account’s password, because UpdateProfileServlet trusts the username from the form and UserDAO updates by name. Fix: take the identity from the session and update WHERE User_id = ?.”'], ['b', '“All bugs are equally serious.”'], ['c', '“The 500 errors, because they look bad.”'], ['d', '“I am a tester, fixing is not my job.”']], dap: 'a', giai: ['Severity = user harm. Name it, the cause in one line, the fix in one line.', 'Mức nghiêm trọng = tác hại cho người dùng. Gọi tên, nguyên nhân một dòng, cách sửa một dòng.'] },
    { en: '“Why did you only test module A?”', vi: '"Sao em chỉ test module A?"', lc: [['a', '“Because the others were lazy.”'], ['b', '“I own module A and completed all three labs for it. Modules B–E belong to other members; I have not received their parts.”'], ['c', '“Module A is the only important one.”'], ['d', '“I also tested B to E.” (you did not)']], dap: 'b', giai: ['Short, factual, no blame, no invention.', 'Ngắn, đúng sự thật, không đổ lỗi, không bịa.'] },
    { en: '“The plan says another member runs round 2. Who ran it?”', vi: '"Kế hoạch ghi bạn khác chạy round 2. Ai chạy?"', lc: [['a', '“They did.” (they did not)'], ['b', '“I ran all three rounds and recorded my own name as tester; the member planned for round 2 could not do it, and the sheet and ticket SS-18 note that. To limit bias, cases were written from requirements before running and every step has a log or screenshot.”'], ['c', '“It does not matter who ran it.”'], ['d', '“I do not remember.”']], dap: 'b', giai: ['The honest record plus how bias was reduced — this answer gains marks instead of losing them.', 'Ghi chép trung thực + cách giảm thiên lệch — câu này được cộng chứ không bị trừ.'] },
  ],
  goiY: ['Câu đúng luôn trả lời ngay ở câu đầu và có một bằng chứng (số, tệp, mã ca).', 'Loại ngay phương án đổ lỗi hoặc bịa.'],
  loiHayGap: ['Trả lời bằng định nghĩa sách khi câu hỏi hỏi về CODE CỦA BẠN.', 'Ghi tên người khác vào lần chạy họ không làm.', 'Nói "công cụ sai" để né câu hỏi độ phủ.'],
  thuatNgu: [TN.prep, { en: 'mock', vi: 'đối tượng giả thay phần phụ thuộc' }, { en: 'KLOC', vi: 'nghìn dòng mã' }],
  khaiNiem: ['defence answers'],
});

const Q3 = tracNghiem({
  tieuDe: 'Defence 3 — “I don’t know” said honestly (and usefully)',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>Every committee eventually asks something you have not checked. Bluffing is the worst option: one invented fact makes every correct answer suspect. A good “I don’t know” has three parts: <b>what you do know</b>, <b>what you have not checked</b>, and <b>how and when you would check it</b>. Choose the best response.</p>',
    vi: '<p>Hội đồng nào rồi cũng hỏi điều bạn chưa kiểm. Chém là phương án tệ nhất: một điều bịa làm mọi câu đúng khác bị nghi. Câu "em chưa biết" tốt có ba phần: <b>điều mình biết chắc</b>, <b>điều mình chưa kiểm</b>, và <b>sẽ kiểm thế nào, khi nào</b>. Chọn cách trả lời tốt nhất.</p>',
  },
  cau: [
    { en: '“Would your tests still pass on MySQL instead of SQL Server?”', vi: '"Test của em có chạy được trên MySQL thay SQL Server không?"', lc: [['a', '“Yes, definitely.”'], ['b', '“I have not run them on MySQL. The unit tests use no database, so they would not change; the integration tests use SQL Server-specific setup, so I would expect the reset script to need changes. I can try it with a MySQL container.”'], ['c', '“That is not in the lab requirements.”'], ['d', 'Silence']], dap: 'b', giai: ['Known part, unknown part, a concrete way to find out.', 'Phần biết, phần chưa biết, cách cụ thể để biết.'] },
    { en: '“How many requests per second can the login handle?”', vi: '"Đăng nhập chịu được bao nhiêu request mỗi giây?"', lc: [['a', '“About a thousand.” (never measured)'], ['b', '“We did not do performance testing — it was outside Lab 2–4. To answer it I would run a load test, for example k6 or JMeter, against the test server.”'], ['c', '“Performance does not matter for a student project.”'], ['d', '“Very fast.”']], dap: 'b', giai: ['Say the scope honestly and name the method. Never invent a number.', 'Nói thẳng phạm vi và nêu phương pháp. Không bao giờ bịa con số.'] },
    { en: 'You realise mid-answer that what you just said is wrong.', vi: 'Đang trả lời thì nhận ra điều mình vừa nói sai.', lc: [['a', 'Continue and hope nobody noticed'], ['b', '“Let me correct myself: it is 16 pass, not 17 — the slide is right.”'], ['c', 'Change the topic'], ['d', 'Apologise for a whole minute']], dap: 'b', giai: ['A one-line correction raises trust.', 'Sửa một câu làm tăng độ tin cậy.'] },
    { en: 'Which sentence is the best template for an honest “I don’t know”?', vi: 'Câu mẫu nào tốt nhất cho "em chưa biết" trung thực?', lc: [['a', '“I don’t know.”'], ['b', '“I haven’t checked that yet. What I know is …; I’ll check … and send you the result by …”'], ['c', '“Nobody knows that.”'], ['d', '“Can we skip this question?”']], dap: 'b', giai: ['Vietnamese version: “Em chưa kiểm phần này. Điều em chắc là …; em sẽ kiểm … và gửi cô trước …”.', 'Bản tiếng Việt: "Em chưa kiểm phần này. Điều em chắc là …; em sẽ kiểm … và gửi cô trước …".'] },
  ],
  goiY: ['Câu tốt luôn có ba phần: biết gì – chưa kiểm gì – sẽ kiểm thế nào.', 'Không có con số đo thật ⇒ không nói con số.'],
  loiHayGap: ['Bịa con số cho khỏi im lặng.', 'Gạt câu hỏi ("không nằm trong yêu cầu") nghe như né tránh.'],
  thuatNgu: [TN.qa, { en: 'bluff', vi: 'chém, nói bừa cho qua' }, { en: 'follow-up', vi: 'việc làm tiếp sau buổi (kiểm rồi gửi kết quả)' }],
  khaiNiem: ['honesty in Q&A'],
});

const CL = ['Answer directly with PREP', 'Clarify the question first', 'Split it and answer part by part', 'Correct the premise politely, then answer', 'Admit, then promise a follow-up with a time'];
const Q4 = phanLoai({
  tieuDe: 'Defence 4 — Which strategy fits each kind of question?',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>Not every question should be answered the same way. A vague question needs clarifying, a double question needs splitting, a question built on a wrong fact needs a polite correction first, and a question beyond what you checked needs an honest follow-up. Pick the strategy for each question.</p>',
    vi: '<p>Không phải câu nào cũng trả lời một kiểu. Câu mơ hồ cần hỏi lại, câu hỏi kép cần tách, câu dựa trên một sự thật sai cần đính chính lịch sự trước, câu vượt quá phần đã kiểm cần hẹn trả lời sau. Chọn chiến lược cho từng câu.</p>',
  },
  cotCau: 'Question',
  cot: 'Strategy',
  luaChon: CL,
  hang: [
    ['“Is it good?”', CL[1], '“Nó có tốt không?”'],
    ['“Why did you choose Postman, and what would you automate next?”', CL[2], '“Sao chọn Postman, và em sẽ tự động hoá gì tiếp?”'],
    ['“Since your unit tests use the real database, aren’t they slow?”', CL[3], '“Unit test của em dùng CSDL thật thì có chậm không?” (thật ra không dùng)'],
    ['“What is the difference between coverage and successful coverage?”', CL[0], '“Coverage khác successful coverage thế nào?”'],
    ['“Does your login resist SQL injection with Unicode payloads?”', CL[4], '“Đăng nhập có chống SQL injection với payload Unicode không?” (chưa kiểm)'],
    ['“Why did IT17 fail?”', CL[0], '“Sao IT17 fail?”'],
  ],
  giaiBang: ['Vague → clarify; double → split; wrong premise → correct first (“Actually the unit tests use no database…”); unchecked → admit + follow-up; clear and known → PREP.', 'Mơ hồ → hỏi lại; kép → tách; tiền đề sai → đính chính trước ("Thật ra unit test không dùng CSDL…"); chưa kiểm → nhận + hẹn; rõ và biết → PREP.'],
  goiY: ['Câu có chữ "and" nối hai câu hỏi ⇒ tách.', 'Câu dựa trên điều sai về bài của bạn ⇒ đính chính trước.'],
  loiHayGap: ['Trả lời câu có tiền đề sai mà không đính chính — vô tình nhận một điều sai về bài mình.', 'Trả lời câu mơ hồ theo ý mình, lạc đề.'],
  giaiThich: '<p>Clarify · Split · Correct the premise · PREP · Admit + follow-up · PREP.</p>',
  thuatNgu: [TN.qa, { en: 'premise', vi: 'tiền đề — điều câu hỏi mặc nhiên coi là đúng' }, { en: 'clarify', vi: 'hỏi lại cho rõ' }],
  khaiNiem: ['question handling'],
});

const Q5 = tracNghiem({
  tieuDe: 'Defence 5 — Oral exam technique (any language)',
  doKho: 'EASY', phut: 5,
  moTa: {
    en: '<p>The same habits work in an oral language exam (e.g. JPD123 speaking on Friday — the Japanese content itself is in the separate Dekiru practice): answer in a <b>frame</b> (answer first, then one reason or detail), <b>speak slower</b> than feels natural, and finish with a clear closing sentence instead of trailing off. Choose the best habit for each moment.</p>',
    vi: '<p>Các thói quen này dùng được cả khi thi nói ngoại ngữ (vd thi nói JPD123 thứ Sáu — nội dung tiếng Nhật nằm ở bộ luyện Dekiru riêng): trả lời theo <b>khung</b> (câu trả lời trước, rồi một lý do/chi tiết), <b>nói chậm</b> hơn cảm giác tự nhiên, và kết bằng một câu chốt rõ thay vì bỏ lửng. Chọn thói quen tốt nhất cho từng lúc.</p>',
  },
  cau: [
    { en: 'The examiner asks a question you did not fully catch.', vi: 'Giám khảo hỏi một câu bạn nghe chưa rõ.', lc: [['a', 'Guess and answer something'], ['b', 'Politely ask them to repeat it, in the exam language'], ['c', 'Stay silent'], ['d', 'Switch to Vietnamese']], dap: 'b', giai: ['Asking to repeat is a normal, graded skill; guessing wrong costs more.', 'Xin nhắc lại là kỹ năng bình thường, còn được chấm; đoán sai mất điểm hơn.'] },
    { en: 'How do you structure a 20-second answer?', vi: 'Cấu trúc câu trả lời 20 giây thế nào?', lc: [['a', 'Answer first, then one reason or detail, then stop cleanly'], ['b', 'Say every word you know about the topic'], ['c', 'One word only'], ['d', 'Start with a long apology for your level']], dap: 'a', giai: ['Answer + one detail = complete, checkable, short.', 'Trả lời + một chi tiết = đủ, kiểm được, ngắn.'] },
    { en: 'You are nervous and speaking fast.', vi: 'Bạn run và nói nhanh.', lc: [['a', 'Pause, breathe out, restart the sentence slower'], ['b', 'Speak even faster to finish'], ['c', 'Laugh it off and skip the sentence'], ['d', 'Whisper']], dap: 'a', giai: ['A one-second pause sounds confident to the listener, not weak.', 'Ngừng một giây nghe tự tin chứ không yếu.'] },
    { en: 'The evening before the exam, the most useful practice is…', vi: 'Tối trước buổi thi, cách luyện có ích nhất là…', lc: [['a', 'Reading the textbook silently once more'], ['b', 'Answering likely questions OUT LOUD, recording yourself, and listening back once'], ['c', 'Learning new vocabulary from a new chapter'], ['d', 'Nothing']], dap: 'b', giai: ['Speaking is a motor skill: only out-loud, recorded practice shows your real speed and gaps.', 'Nói là kỹ năng vận động: chỉ luyện nói to có ghi âm mới thấy tốc độ và chỗ hổng thật.'] },
  ],
  goiY: ['Trả lời trước, chi tiết sau, dừng gọn.', 'Run ⇒ ngừng, thở ra, nói lại chậm hơn.'],
  loiHayGap: ['Học thêm bài mới tối trước thi thay vì luyện nói to bài đã học.', 'Xin lỗi về trình độ trước khi trả lời.'],
  thuatNgu: [TN.prep, { en: 'speaking pace', vi: 'tốc độ nói' }],
  khaiNiem: ['oral exam'],
});

export default moDun({
  slug: 'ssg105-4-4-qa-prep',
  ten: '4.4 Defence and Q&A: PREP, honest “I don’t know”, question strategies',
  moTaModule: 'Sắp câu trả lời theo khung PREP cho câu hỏi thật của hội đồng SWT301, chọn câu trả lời tốt nhất (ngắn, đúng, có bằng chứng, không đổ lỗi/bịa), nói "em chưa biết" trung thực có hẹn, chọn chiến lược theo loại câu hỏi, kỹ thuật thi nói.',
  baiHoc: 'ssg105-4-1-presentation',
  de: [Q1, Q2, Q3, Q4, Q5],
});
