/**
 * 2.1 — Viết ticket ai cũng nhận làm được (agl-2-1-ticket). Soạn 24/11/2026, agent agt.
 * Lab: scratchpad/agt/lab/ch2/kiem-ticket.mjs + ticket/*.md chạy THẬT (Node 22.22.2) — qua ./_ma.mjs (tệp SINH).
 * Ranh giới: viết yêu cầu/use case/user story bài bản ⇒ Academy SWR302 ch8; bug report chi tiết ⇒ 7.1; Q&A với khách ⇒ 9.5.
 * Màn hình + luật nghiệp vụ BR-xx lấy đúng trang /projects/labflow-ai (S22, BR-04/05/11).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L21 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 2 · Lesson 2.1', 'Chương 2 · Bài 2.1', `
<h2>${t('2.1 — Writing tickets people can pick up', '2.1 — Viết ticket ai cũng nhận làm được')}</h2>
<p class="lead">${t(
    'A ticket is a small contract between the person who needs something and the person who builds it. When it is vague, the builder spends a day guessing, the reviewer argues about what "done" means, and the lecturer at the demo finds the case nobody wrote down. In this lesson you take one real LabFlow ticket from "Làm chức năng đặt lịch" (13 points, no criteria) to a ticket any teammate can pick up on a Monday evening and finish by Thursday — and you write a script that checks tickets against your team’s rules, so the leader does not have to.',
    'Ticket là một hợp đồng nhỏ giữa người cần một thứ và người làm ra thứ đó. Ticket mơ hồ thì người làm mất một ngày đoán, người review cãi nhau thế nào là "xong", còn giảng viên ở buổi demo tìm ra đúng trường hợp không ai ghi lại. Bài này đưa một ticket LabFlow thật từ "Làm chức năng đặt lịch" (13 điểm, không tiêu chí) thành ticket mà bất kỳ thành viên nào cũng nhận được vào tối thứ Hai và xong trước thứ Năm — và bạn viết một script soát ticket theo luật của nhóm, để trưởng nhóm khỏi phải soát tay.')}</p>

<h3>${t('Everyday picture: calling an electrician', 'Liên tưởng đời thường: gọi thợ điện')}</h3>
<p>${t(
    '"Come fix the electricity" gets you a technician who arrives without the right parts and charges for two visits. "The socket in the second-floor bedroom has had no power since last night; the breaker did not trip; the other rooms are fine; I need it working before Saturday" gets the job done in one visit. The second message has a <em>place</em> (which screen), a <em>symptom you can check</em> (acceptance criteria), <em>what is not the problem</em> (out of scope) and a <em>deadline</em> (sprint). That is a ticket.',
    '"Anh qua sửa điện giúp em" thì thợ tới không mang đúng đồ và tính tiền hai lần đi. "Ổ cắm phòng ngủ tầng 2 mất điện từ tối qua, aptomat không nhảy, các phòng khác vẫn bình thường, em cần dùng được trước thứ Bảy" thì một lần là xong. Tin nhắn thứ hai có <em>chỗ</em> (màn hình nào), <em>triệu chứng kiểm được</em> (tiêu chí chấp nhận), <em>cái gì không phải vấn đề</em> (ngoài phạm vi) và <em>hạn</em> (sprint). Đó chính là một ticket.')}</p>

<h3>${t('Ticket types — and who writes them', 'Các loại ticket — và ai viết')}</h3>
${bang([t('Type', 'Loại'), t('What it is', 'Là gì'), t('LabFlow example', 'Ví dụ LabFlow'), t('Usually written by', 'Thường do ai viết')], [
    ['Epic', t('A big goal that spans several sprints; never worked on directly.', 'Mục tiêu lớn kéo dài nhiều sprint; không ai làm trực tiếp.'), 'LF-E2 Đặt lịch', t('Leader / PO', 'Trưởng nhóm / PO')],
    ['Story', t('A slice of value for a user, finishable in one sprint.', 'Một lát giá trị cho người dùng, xong được trong một sprint.'), t('LF-21 Student books a device for a time slot', 'LF-21 Sinh viên đặt lịch một thiết bị theo khung giờ'), t('Leader / PO, refined with the team', 'Trưởng nhóm / PO, cả nhóm làm mịn')],
    ['Task', t('Technical work with no direct user value (but needed).', 'Việc kỹ thuật không có giá trị trực tiếp cho người dùng (nhưng cần).'), t('LF-12 Set up CI that runs the tests on every PR', 'LF-12 Dựng CI chạy test mỗi PR'), t('Any member', 'Bất kỳ ai')],
    ['Bug', t('Something that worked differently from an accepted criterion.', 'Thứ chạy khác với một tiêu chí đã chấp nhận.'), t('LF-58 Booking 09:00–10:30 accepted although 10:00–11:00 is taken', 'LF-58 Đặt 09:00–10:30 vẫn được dù 10:00–11:00 đã có người'), t('Whoever finds it (lesson 7.1)', 'Ai phát hiện thì viết (bài 7.1)')],
    ['Spike', t('Time-boxed research to answer a question before estimating.', 'Nghiên cứu có giới hạn thời gian để trả lời một câu hỏi trước khi ước lượng.'), t('LF-30 Can the browser camera read QR codes on iOS Safari? (max 4 hours)', 'LF-30 Camera trình duyệt đọc QR trên Safari iOS được không? (tối đa 4 giờ)'), t('The person who raised the doubt', 'Người nêu nghi ngờ')],
    ['Sub-task', t('A checklist item inside a story (API, UI, test…).', 'Một mục việc bên trong story (API, giao diện, test…).'), t('LF-21.3 Unit test for the overlap check', 'LF-21.3 Unit test cho hàm kiểm trùng giờ'), t('The person doing the story', 'Người làm story đó')],
  ])}
${note(t('On SWP391 a <strong>Story usually equals one screen row</strong> of the Project Tracking sheet (one screen, one PIC). Keep that mapping and the tracking sheet almost fills itself — lesson 2.2 explains why the split must follow screens.', 'Ở SWP391 một <strong>Story thường ứng với một dòng màn hình</strong> trong sheet Project Tracking (một màn, một PIC). Giữ được ánh xạ đó thì sheet theo dõi gần như tự điền — bài 2.2 giải thích vì sao phải chia theo màn hình.'))}

<h3>${t('Anatomy of a ticket worth picking up', 'Giải phẫu một ticket đáng nhận')}</h3>
${bang([t('Part', 'Phần'), t('Rule', 'Luật'), t('Why', 'Vì sao')], [
    [t('Title', 'Tiêu đề'), t('Who does what, 10–70 characters, one thing only (no "and").', 'Ai làm gì, 10–70 ký tự, chỉ một việc (không "và").'), t('The title is all you see on the board and in the burndown.', 'Trên bảng và burndown bạn chỉ thấy tiêu đề.')],
    [t('Why (user story)', 'Vì sao (user story)'), t('"As a … I want … so that …" plus one sentence of context.', '"Là … tôi muốn … để …" cộng một câu bối cảnh.'), t('The builder makes dozens of small decisions; the "so that" decides them.', 'Người làm phải tự quyết hàng chục chi tiết nhỏ; vế "để…" quyết giúp họ.')],
    [t('Acceptance criteria', 'Tiêu chí chấp nhận'), t('Given/When/Then with concrete data; at least one unhappy case tied to a business rule.', 'Given/When/Then với dữ liệu cụ thể; ít nhất một unhappy case bám vào một luật nghiệp vụ.'), t('They become the test cases and the demo script.', 'Chúng thành test case và kịch bản demo.')],
    [t('Out of scope', 'Ngoài phạm vi'), t('What this ticket deliberately does not do, with links to the tickets that do.', 'Thứ ticket này cố ý không làm, kèm liên kết tới ticket làm nó.'), t('Stops scope creep inside a PR; protects the estimate.', 'Chặn phạm vi phình ngay trong PR; giữ ước lượng đứng vững.')],
    [t('Notes / links', 'Ghi chú / liên kết'), t('Figma frame, business rule IDs, test data.', 'Khung Figma, mã luật nghiệp vụ, dữ liệu thử.'), t('Nobody should have to ask "where is the design?".', 'Không ai phải hỏi "thiết kế ở đâu?".')],
    [t('Estimate, screen, assignee', 'Ước lượng, màn hình, người nhận'), t('Points from planning (lesson 2.3), screen code, one owner.', 'Điểm từ planning (bài 2.3), mã màn hình, một người nhận.'), t('Planning, tracking and LOC all hang on these three fields.', 'Planning, theo dõi và LOC đều treo vào ba trường này.')],
  ])}
<p>${t(
    'The "As a… I want… so that…" template comes from the Connextra team in London (2001); the checklist <strong>INVEST</strong> — Independent, Negotiable, Valuable, Estimable, Small, Testable — was proposed by Bill Wake in 2003 (',
    'Mẫu "Là… tôi muốn… để…" xuất phát từ đội Connextra ở London (2001); checklist <strong>INVEST</strong> — Độc lập, Thương lượng được, Có giá trị, Ước lượng được, Nhỏ, Kiểm thử được — do Bill Wake đề xuất năm 2003 (')}${ng('https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/', 'xp123.com')}). ${t('How to <em>find</em> the stories (use cases vs user stories, elicitation) is the job of the requirements course — ', 'Cách <em>tìm ra</em> story (use case với user story, khai thác yêu cầu) là việc của môn yêu cầu phần mềm — ')}${ac('software-requirements', 'swr302-4-3-ch8-usage-centric', t('Academy SWR302 4.3 — use cases vs user stories', 'Academy SWR302 4.3 — use case và user story'))}. ${t('This lesson is about writing them so a teammate can build one.', 'Bài này lo phần viết sao cho một thành viên làm được.')}</p>

<h3>${t('Acceptance criteria: Given / When / Then', 'Tiêu chí chấp nhận: Given / When / Then')}</h3>
<p>${t(
    'Dan North introduced the Given/When/Then form in "Introducing BDD" (2006); it later became the Gherkin language of Cucumber. Its value for a student team is simple: <strong>Given</strong> forces you to state the starting data, <strong>When</strong> is one action, <strong>Then</strong> is something a tester can see. Four habits make criteria useful:',
    'Dan North đưa ra dạng Given/When/Then trong bài "Introducing BDD" (2006); về sau nó thành ngôn ngữ Gherkin của Cucumber. Với nhóm sinh viên, giá trị của nó rất đơn giản: <strong>Given</strong> buộc bạn nói dữ liệu ban đầu, <strong>When</strong> là một hành động, <strong>Then</strong> là thứ tester nhìn thấy được. Bốn thói quen làm tiêu chí có ích:')} ${ng('https://dannorth.net/introducing-bdd/', 'dannorth.net')}</p>
<ol>
<li>${t('<strong>Concrete data</strong> — "TB-07, 09:00–11:00 on 15/03", not "a device at some time". Concrete data finds edge cases: 09:00–10:30 against 10:00–11:00 overlaps, 09:00–10:00 against 10:00–11:00 does not (BR-04 says slots are half-open).', '<strong>Dữ liệu cụ thể</strong> — "TB-07, 09:00–11:00 ngày 15/03", không phải "một thiết bị lúc nào đó". Dữ liệu cụ thể lôi ra trường hợp biên: 09:00–10:30 với 10:00–11:00 là trùng, 09:00–10:00 với 10:00–11:00 thì không (BR-04 nói khung giờ nửa mở).')}</li>
<li>${t('<strong>One behaviour per criterion</strong> — if a criterion has two Thens about different things, it is two criteria.', '<strong>Mỗi tiêu chí một hành vi</strong> — tiêu chí có hai Then về hai chuyện khác nhau thì là hai tiêu chí.')}</li>
<li>${t('<strong>Unhappy cases come from business rules</strong> — each BR-xx touching the screen gives at least one criterion. On SWP391 this is worth money: a screen with only happy cases is graded at Quality L1 = 50% of its LOC, with unhappy cases L2 = 75% (', '<strong>Unhappy case lấy từ luật nghiệp vụ</strong> — mỗi BR-xx chạm vào màn hình cho ít nhất một tiêu chí. Ở SWP391 điều này ra điểm: màn chỉ có happy case được chấm Quality L1 = 50% LOC, có unhappy case thì L2 = 75% (')}${ac('software-development-project', 'swp391-4-complexity-loc-grade', 'Academy SWP391 4.3')}).</li>
<li>${t('<strong>Measurable words only</strong> — "fast", "beautiful", "user-friendly" cannot be tested. Say "the list loads in under 2 s with 500 rows" or leave it out.', '<strong>Chỉ dùng từ đo được</strong> — "nhanh", "đẹp", "thân thiện" không test được. Viết "danh sách tải dưới 2 giây với 500 dòng" hoặc bỏ đi.')}</li>
</ol>

<h3>${t('The same ticket, three versions', 'Cùng một ticket, ba phiên bản')}</h3>
<p>${t('Version 1 — what most first sprints look like:', 'Bản 1 — sprint đầu tiên của hầu hết các nhóm trông như vầy:')}</p>
${out(MA.lf21v1)}
<p>${t('Version 2 — better, but it still bundles three people’s work (booking, approval, email) into one 13-point card, has no unhappy case and grades the UI as "friendly":', 'Bản 2 — khá hơn, nhưng vẫn gói việc của ba người (đặt, duyệt, email) vào một thẻ 13 điểm, không có unhappy case và chấm giao diện là "thân thiện":')}</p>
${out(MA.lf21v2)}
<p>${t('Version 3 — one screen (S22), one owner, four criteria of which three are unhappy cases tied to BR-04, BR-05 and BR-11, and an explicit out-of-scope line that sends approval and email to their own tickets:', 'Bản 3 — một màn hình (S22), một người nhận, bốn tiêu chí trong đó ba là unhappy case bám BR-04, BR-05, BR-11, và một dòng ngoài phạm vi đẩy việc duyệt và email sang ticket riêng:')}</p>
${out(MA.lf21v3)}
${cl('danger', `<p><strong>🕵️ ${t('Hacker’s corner — why AC4 mentions the API', 'Góc hacker — vì sao AC4 nhắc tới API')}</strong>: ${t('a criterion that only says "the Book button is disabled" is satisfied by a front-end that hides the button — and anyone can still call <code>POST /api/reservations</code> with curl or the browser console. Broken access control and missing server-side checks are the number-one risk in the', 'một tiêu chí chỉ ghi "nút Đặt bị khoá" sẽ được thoả bởi giao diện ẩn nút — trong khi ai cũng gọi được <code>POST /api/reservations</code> bằng curl hay console trình duyệt. Kiểm soát truy cập hỏng và thiếu kiểm tra phía máy chủ là rủi ro số một trong')} ${ng('https://owasp.org/Top10/A01_2021-Broken_Access_Control/', 'OWASP Top 10:2021 (A01)')}. ${t('Write the rule as a server behaviour ("the API returns 409") and the reviewer will look for it in the Spring service, not just in React.', 'Viết luật thành hành vi của máy chủ ("API trả 409") thì người review sẽ tìm nó trong service Spring, không chỉ trong React.')}</p>`)}

<h3>${t('Definition of Ready — your team’s gate into the sprint', 'Definition of Ready — cửa vào sprint của nhóm bạn')}</h3>
<p>${t(
    'The Scrum Guide 2020 does not define a "Definition of Ready"; it only says that items which can be Done within one sprint "are deemed ready for selection in a Sprint Planning event", usually after refinement. Many teams therefore write their own short checklist. Keep it short — a DoR with fifteen items becomes a wall that stops all work. The eleven rules in the script below are LabFlow’s; change the list for your team.',
    'Scrum Guide 2020 không định nghĩa "Definition of Ready"; nó chỉ nói các mục làm Done được trong một sprint thì "được coi là sẵn sàng để chọn ở Sprint Planning", thường là sau khi làm mịn. Vì vậy nhiều đội tự viết một checklist ngắn. Giữ cho nó ngắn — DoR mười lăm mục thành bức tường chặn mọi việc. Mười một luật trong script dưới đây là của LabFlow; đổi danh sách cho nhóm bạn.')}</p>

<h3>${t('Lab: a ticket checker your team can run', 'Lab: script soát ticket cho cả nhóm')}</h3>
<p>${t('Tickets live as Markdown files during refinement (easy to review in a PR, easy to paste into CT Work). The checker reads each file, applies the rules, prints ✅/❌ and exits with code 1 if any ticket is not ready — so the same script can run in CI.', 'Trong lúc làm mịn, ticket nằm dưới dạng tệp Markdown (dễ review trong PR, dễ dán vào CT Work). Script đọc từng tệp, áp luật, in ✅/❌ và thoát với mã 1 nếu có ticket chưa sẵn sàng — nên cùng script đó chạy được trong CI.')}</p>
${js(MA.kiemTicket)}
<p>${t('Real output (Node 22.22.2):', 'Output thật (Node 22.22.2):')}</p>
${out('$ node kiem-ticket.mjs ticket/LF-21-v1.md ticket/LF-21-v2.md ticket/LF-21-v3.md\n' + RA.kiemTicket)}
<p>${t('Version 2 passes six rules, so it <em>looks</em> finished — the script catches the five things a tired leader misses at 23:00: two "and"s in the title, no unhappy case, an unmeasurable word, no out-of-scope line, and 13 points.', 'Bản 2 qua sáu luật nên <em>trông</em> như đã xong — script bắt đúng năm thứ mà trưởng nhóm mệt mỏi lúc 23 giờ hay bỏ sót: hai chữ "và" trong tiêu đề, không có unhappy case, một từ không đo được, không có dòng ngoài phạm vi, và 13 điểm.')}</p>
${cl('warn', `<p><strong>${t('A bug worth knowing: <code>\\b</code> does not understand Vietnamese', 'Một lỗi nên biết: <code>\\b</code> không hiểu tiếng Việt')}</strong>. ${t('The first version of the script used <code>/\\b(đẹp|…)\\b/</code> and never caught "đẹp". In JavaScript, <code>\\b</code> is a boundary between ASCII word characters [A-Za-z0-9_] and the rest; "đ" is not one of them, so there is no boundary before it. The fix is a Unicode-aware look-around with the <code>u</code> flag:', 'Bản đầu của script dùng <code>/\\b(đẹp|…)\\b/</code> và không bao giờ bắt được "đẹp". Trong JavaScript, <code>\\b</code> là ranh giới giữa ký tự chữ ASCII [A-Za-z0-9_] và phần còn lại; "đ" không thuộc nhóm đó nên trước nó không có ranh giới. Cách sửa là nhìn quanh theo Unicode với cờ <code>u</code>:')}</p>
${out(`$ node -e 'console.log(/\\bđẹp\\b/i.test("giao diện đẹp"), /(?<!\\p{L})đẹp(?!\\p{L})/iu.test("giao diện đẹp"), /(?<!\\p{L})tốt(?!\\p{L})/iu.test("tốt nghiệp"))'\n` + RA.bAscii)}
<p>${t('The third value is the honest limit of any word list: "tốt nghiệp" (graduation) is flagged as the vague word "tốt". The script is a helper for the leader, not a judge.', 'Giá trị thứ ba là giới hạn thật của mọi danh sách từ: "tốt nghiệp" bị bắt nhầm thành từ mơ hồ "tốt". Script là trợ thủ cho trưởng nhóm, không phải quan toà.')}</p>`)}

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'At an outsourcing company the ticket often arrives already written — by the customer, in Jira, Redmine or Backlog, sometimes in Japanese, sometimes as a row in an Excel design document. You will rarely be allowed to rewrite it, but you will be expected to <em>read it like the checker does</em>: find the missing unhappy case, the unmeasurable word, the "and" that hides a second feature, and turn each one into a question on the Q&amp;A list (',
    'Ở công ty outsourcing, ticket thường tới khi đã viết sẵn — do khách viết, trên Jira, Redmine hay Backlog, có khi bằng tiếng Nhật, có khi là một dòng trong tài liệu thiết kế Excel. Bạn hiếm khi được viết lại nó, nhưng được kỳ vọng <em>đọc nó như script soát</em>: tìm unhappy case còn thiếu, từ không đo được, chữ "và" giấu một tính năng thứ hai, rồi biến mỗi chỗ thành một câu hỏi trong Q&amp;A list (')}${ag('agl-9-5-qa-cr', t('lesson 9.5', 'bài 9.5'))}). ${t('The ticket is also the written record of scope: when the customer later says "of course approval was included", the out-of-scope line is what turns the conversation into a change request instead of an unpaid weekend.', 'Ticket cũng là bằng chứng bằng chữ về phạm vi: khi khách nói "tất nhiên phải có phần duyệt chứ", dòng ngoài phạm vi là thứ biến cuộc nói chuyện thành change request thay vì một cuối tuần làm không công.')}</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
<li>${t('Rewrite this ticket so the checker says READY. Use BR-xx from the', 'Viết lại ticket này để script báo SẴN SÀNG. Dùng BR-xx trên')} <a href="/projects/labflow-ai">${t('LabFlow project page', 'trang dự án LabFlow')}</a>.
${out(MA.lf27v1)}</li>
<li>${t('Add a 12th rule: every ticket of type Story must mention at least one business rule <code>BR-\\d+</code> or say "không có luật". Which of the two ready tickets fails?', 'Thêm luật thứ 12: mọi ticket loại Story phải nhắc ít nhất một luật nghiệp vụ <code>BR-\\d+</code> hoặc ghi "không có luật". Trong hai ticket đã sẵn sàng, cái nào trượt?')}</li>
<li>${t('Write two more acceptance criteria for LF-21 at the boundary of BR-04: 09:00–10:00 against an existing 10:00–11:00, and a slot of 09:00–09:45.', 'Viết thêm hai tiêu chí cho LF-21 ở biên của BR-04: 09:00–10:00 khi đã có 10:00–11:00, và khung 09:00–09:45.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<p>${t('1. One version that passes:', '1. Một bản đạt:')}</p>
${out(MA.lf27v2)}
${out('$ node kiem-ticket.mjs ticket/LF-27-v1.md ticket/LF-27-v2.md\n' + RA.kiemLf27)}
<p>${t('Notice AC2 and AC4: an email job that runs again after a restart, or a mail server that fails, are the two bugs reminder features always ship with. Writing them as criteria is cheaper than finding them in the demo.', 'Để ý AC2 và AC4: tác vụ email chạy lại sau khi khởi động lại máy chủ, và máy chủ email trả lỗi, là hai lỗi mà tính năng nhắc nhở nào cũng mang theo. Viết chúng thành tiêu chí rẻ hơn nhiều so với để buổi demo tìm ra.')}</p>
<p>${t('2. Add to the <code>LUAT</code> array:', '2. Thêm vào mảng <code>LUAT</code>:')}</p>
${js(`['Story nhắc luật BR-xx (hoặc "không có luật")', (t) => !/Loại:\\s*Story/i.test(t.md) || /BR-\\d+|không có luật/i.test(t.md)],`)}
<p>${t('LF-27 fails: it is a Story and names no rule. That is a real gap — "remind 24 hours before" is a business rule the lecturer may want to change, so it deserves an ID (for example BR-15) in the SRS.', 'LF-27 trượt: nó là Story và không nêu luật nào. Đó là một lỗ hổng thật — "nhắc trước 24 giờ" là luật nghiệp vụ mà giảng viên có thể muốn đổi, nên nó xứng đáng có mã (vd BR-15) trong SRS.')}</p>
<p>${t('3. "AC5: Given TB-07 has a booking 10:00–11:00 on 15/03 When a student books 09:00–10:00 the same day Then the booking is created (half-open slots touch but do not overlap)." · "AC6: Given TB-07 is free When a student picks 09:00–09:45 Then the Book button is disabled with \'Slots are multiples of 30 minutes\' and the API returns 400."', '3. "AC5: Given TB-07 có lịch 10:00–11:00 ngày 15/03 When sinh viên đặt 09:00–10:00 cùng ngày Then lịch được tạo (khung nửa mở chạm nhau nhưng không trùng)." · "AC6: Given TB-07 còn trống When sinh viên chọn 09:00–09:45 Then nút Đặt bị khoá kèm \'Khung giờ là bội số 30 phút\' và API trả 400."')}</p>`)}

${phongVan([
    [t('"What makes a good user story?"', '"Thế nào là một user story tốt?"'), t('INVEST: independent, negotiable, valuable, estimable, small, testable. In practice: one user-visible behaviour, a clear "so that", acceptance criteria with concrete data including the unhappy cases, and small enough to finish in a few days.', 'INVEST: độc lập, thương lượng được, có giá trị, ước lượng được, nhỏ, kiểm thử được. Thực tế: một hành vi người dùng nhìn thấy, vế "để…" rõ, tiêu chí chấp nhận có dữ liệu cụ thể kể cả unhappy case, và đủ nhỏ để xong trong vài ngày.')],
    [t('"What is the difference between acceptance criteria and the Definition of Done?"', '"Tiêu chí chấp nhận khác Definition of Done thế nào?"'), t('Acceptance criteria are specific to one item (what this feature must do). The DoD applies to every item (reviewed, tested, merged, deployed to the demo server). A ticket is done when both hold.', 'Tiêu chí chấp nhận là riêng của một mục (tính năng này phải làm gì). DoD áp cho mọi mục (đã review, đã test, đã merge, đã lên máy demo). Một ticket xong khi cả hai cùng đúng.')],
    [t('"You receive a ticket that is unclear. What do you do?"', '"Bạn nhận một ticket không rõ ràng. Bạn làm gì?"'), t('Do not guess silently. List the concrete questions (with a proposed answer for each), ask the author or BA in writing, record the answer in the ticket, and if the answer changes scope, raise it so the estimate and sprint plan are updated.', 'Không lặng lẽ đoán. Liệt kê câu hỏi cụ thể (mỗi câu kèm một đề xuất trả lời), hỏi người viết hoặc BA bằng văn bản, ghi câu trả lời vào ticket, và nếu câu trả lời đổi phạm vi thì nêu ra để cập nhật ước lượng và kế hoạch sprint.')],
    [t('"Why write \'out of scope\' in a ticket?"', '"Sao phải ghi \'ngoài phạm vi\' trong ticket?"'), t('It protects the estimate and the review: the implementer knows where to stop, the reviewer does not ask for extras, and the customer conversation about additions becomes an explicit new ticket or change request.', 'Nó giữ ước lượng và việc review: người làm biết dừng ở đâu, người review không đòi thêm, còn cuộc nói chuyện với khách về phần thêm trở thành một ticket mới hay change request rõ ràng.')],
  ], en)}

${thuatNgu([
    ['ticket / issue', t('One unit of tracked work with an ID (LF-21).', 'Một đơn vị công việc được theo dõi, có mã (LF-21).')],
    ['epic', t('Large goal grouping many stories.', 'Mục tiêu lớn gom nhiều story.')],
    ['user story', t('"As a … I want … so that …" — a slice of user value.', '"Là … tôi muốn … để …" — một lát giá trị cho người dùng.')],
    ['spike', t('Time-boxed research ticket.', 'Ticket nghiên cứu có giới hạn thời gian.')],
    [t('acceptance criteria (AC)', 'tiêu chí chấp nhận (AC)'), t('Item-specific, testable conditions for "done".', 'Điều kiện kiểm được, riêng của một mục, để coi là "xong".')],
    ['Given/When/Then', t('AC format: starting state / action / observable result.', 'Dạng AC: trạng thái đầu / hành động / kết quả nhìn thấy.')],
    ['INVEST', t('Independent, Negotiable, Valuable, Estimable, Small, Testable.', 'Độc lập, Thương lượng được, Có giá trị, Ước lượng được, Nhỏ, Kiểm thử được.')],
    ['Definition of Ready', t('Team checklist for an item to enter a sprint (not in the Scrum Guide).', 'Checklist của nhóm để một mục được vào sprint (không có trong Scrum Guide).')],
    [t('business rule (BR)', 'luật nghiệp vụ (BR)'), t('A numbered rule of the domain (BR-04 half-open slots).', 'Một luật có đánh số của miền nghiệp vụ (BR-04 khung nửa mở).')],
    [t('out of scope', 'ngoài phạm vi'), t('What the ticket deliberately excludes.', 'Thứ ticket cố ý không làm.')],
  ], en)}

${tomTat([
    t('A ticket is a contract: title, why, acceptance criteria, out of scope, links, estimate, screen, owner.', 'Ticket là hợp đồng: tiêu đề, vì sao, tiêu chí chấp nhận, ngoài phạm vi, liên kết, ước lượng, màn hình, người nhận.'),
    t('Given/When/Then with concrete data; every business rule on the screen gives at least one unhappy case (SWP391: L1 50% → L2 75%).', 'Given/When/Then với dữ liệu cụ thể; mỗi luật nghiệp vụ trên màn cho ít nhất một unhappy case (SWP391: L1 50% → L2 75%).'),
    t('Write security rules as server behaviour, not just a disabled button (OWASP A01).', 'Viết luật bảo mật thành hành vi máy chủ, không chỉ là nút bị khoá (OWASP A01).'),
    t('A short team Definition of Ready, checked by a script, keeps 13-point "do everything" tickets out of the sprint.', 'Một Definition of Ready ngắn của nhóm, được script soát, giữ ticket 13 điểm "làm tất cả" ở ngoài sprint.'),
    t('At work you read customer tickets the same way and turn each gap into a Q&amp;A question.', 'Đi làm, bạn đọc ticket của khách theo đúng cách đó và biến mỗi lỗ hổng thành một câu hỏi Q&amp;A.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-2-2-chia-nho', t('2.2 — Breaking work down', '2.2 — Chia nhỏ công việc'))}.</p>
`);
};

export default {
  title: '2.1 — Writing tickets people can pick up|||2.1 — Viết ticket ai cũng nhận làm được',
  slug: 'agl-2-1-ticket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Các loại ticket (Epic, Story, Task, Bug, Spike, Sub-task) và ai viết; giải phẫu ticket đáng nhận; tiêu chí Given/When/Then có dữ liệu cụ thể, unhappy case bám luật nghiệp vụ (SWP391 L1 → L2); góc hacker OWASP A01; Definition of Ready; lab script soát ticket chạy thật (bản 1 → bản 3 của LF-21, lỗi \\b với tiếng Việt); đọc ticket của khách khi đi làm.',
  content: L21(true) + L21(false),
};
