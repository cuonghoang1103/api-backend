/**
 * 2.2 — Chia nhỏ công việc (agl-2-2-chia-nho). Soạn 24/11/2026, agent agt.
 * Lab: scratchpad/agt/lab/ch2/chia-viec.mjs chạy THẬT (Node 22.22.2) — qua ./_ma.mjs. Danh sách màn + vai theo /projects/labflow-ai;
 * số field/transaction là GIẢ ĐỊNH (ghi rõ trong bài). Bảng Level/LOC theo Academy SWP391 4.3 (sheet Refs).
 * Ranh giới: cách đếm field/transaction chi tiết ⇒ Academy swp391-4-complexity-loc-grade; WBS man-day ⇒ 9.6.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const BANG_SPIDR = (t) => bang([t('Slice', 'Lát'), t('SPIDR pattern', 'Kiểu SPIDR'), t('What the student can do after it', 'Sau lát này sinh viên làm được gì'), t('Points', 'Điểm')], [
  ['LF-39a', t('Paths — the simplest path', 'Paths — đường đơn giản nhất'), t('Book a <em>lab</em> for one slot, no device, no participants; status "Pending". Overlap check BR-04 on the server.', 'Đặt một <em>phòng lab</em> cho một khung giờ, không thiết bị, không người tham gia; trạng thái "Chờ duyệt". Kiểm trùng BR-04 ở máy chủ.'), '3'],
  ['LF-39b', t('Data — one more kind of thing', 'Data — thêm một loại dữ liệu'), t('Also pick devices of that lab; devices in MAINTENANCE are hidden and rejected by the API (BR-11).', 'Chọn thêm thiết bị của lab đó; thiết bị MAINTENANCE bị ẩn và API từ chối (BR-11).'), '2'],
  ['LF-39c', t('Rules — one more business rule', 'Rules — thêm một luật nghiệp vụ'), t('Quota: at most 6 hours per week and 14 days ahead (BR-05), with clear messages.', 'Hạn mức: tối đa 6 giờ/tuần và đặt trước tối đa 14 ngày (BR-05), có thông báo rõ.'), '2'],
  ['LF-39d', t('Interfaces — a richer UI', 'Interfaces — giao diện đầy đủ hơn'), t('The 4-step wizard: participants, purpose, review page, back/next keeping data.', 'Wizard 4 bước: người tham gia, mục đích, trang xem lại, quay lại/tiếp tục giữ dữ liệu.'), '3'],
]);

export const L22 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 2 · Lesson 2.2', 'Chương 2 · Bài 2.2', `
<h2>${t('2.2 — Breaking work down', '2.2 — Chia nhỏ công việc')}</h2>
<p class="lead">${t(
    'Lesson 1.3 showed that big cards have long, unpredictable cycle times. This lesson is about cutting them — and about the one decision that shapes your whole SWP391 semester: <strong>do you split the work by layer (front-end / back-end / database) or by screen?</strong> You will run a script on the real LabFlow screen list that counts each member’s graded LOC under both splits. The answer is not a matter of taste.',
    'Bài 1.3 cho thấy thẻ to có cycle time dài và khó đoán. Bài này dạy cách cắt chúng — và dạy một quyết định định hình cả học kỳ SWP391 của bạn: <strong>chia việc theo tầng (front-end / back-end / cơ sở dữ liệu) hay theo màn hình?</strong> Bạn sẽ chạy một script trên đúng danh sách màn hình LabFlow, đếm LOC được chấm của từng thành viên theo cả hai cách chia. Câu trả lời không phải chuyện sở thích.')}</p>

<h3>${t('Everyday picture: cooking for a party of twenty', 'Liên tưởng đời thường: nấu cỗ hai mươi người')}</h3>
<p>${t(
    'Five people cook for a party. Split by <em>step</em>: one washes everything, one cuts everything, one cooks everything, one plates everything. Nothing reaches the table until the last step of the last dish, the cook waits for the cutter all morning, and if the cutter is sick, no dish exists. Split by <em>dish</em>: each person makes their dish from raw to plate. Dishes arrive one by one, guests start eating early, a missing person costs one dish, and everyone can say "the fish is mine". SWP391 grades exactly like the guests: dish by dish, cook by cook.',
    'Năm người nấu cỗ. Chia theo <em>công đoạn</em>: một người rửa hết, một người thái hết, một người nấu hết, một người bày hết. Chưa món nào lên mâm cho tới công đoạn cuối của món cuối, người nấu ngồi chờ người thái cả buổi sáng, và người thái ốm thì không có món nào. Chia theo <em>món</em>: mỗi người làm món của mình từ sơ chế tới bày đĩa. Món lên lần lượt, khách ăn sớm, vắng một người thì thiếu một món, và ai cũng nói được "món cá là của mình". SWP391 chấm đúng như khách ăn cỗ: từng món, từng người nấu.')}</p>

<h3>${t('The hierarchy: epic → story → sub-task', 'Thứ bậc: epic → story → sub-task')}</h3>
${bang([t('Level', 'Cấp'), t('Size rule (LabFlow agreement)', 'Luật cỡ (thoả thuận LabFlow)'), t('Example', 'Ví dụ')], [
    ['Epic', t('A business area; spans iterations; not estimated in points.', 'Một mảng nghiệp vụ; kéo qua nhiều iteration; không ước lượng bằng điểm.'), 'LF-E2 Đặt lịch (S20–S26)'],
    ['Story', t('One screen or one slice of a screen; ≤ 5 points; one owner; finishable in ≤ 4 working days.', 'Một màn hình hoặc một lát của màn hình; ≤ 5 điểm; một người nhận; xong trong ≤ 4 ngày làm việc.'), t('LF-21 Student books a device for a time slot (S22)', 'LF-21 Sinh viên đặt lịch một thiết bị theo khung giờ (S22)')],
    ['Sub-task', t('A step inside the story, ≤ 1 day, done by the same owner.', 'Một bước trong story, ≤ 1 ngày, cùng người nhận làm.'), t('Entity + repository · API + validation · React form · tests · evidence', 'Entity + repository · API + kiểm tra dữ liệu · form React · test · evidence')],
  ])}
<p>${t('Notice the last column of the sub-task row: the owner of a story does <em>all</em> layers of it. That is a vertical slice.', 'Để ý cột cuối dòng sub-task: người nhận story làm <em>mọi</em> tầng của nó. Đó là lát cắt dọc.')}</p>

<h3>${t('Horizontal layers vs vertical slices', 'Tầng ngang và lát cắt dọc')}</h3>
${bang(['', t('By layer (FE / BE / DB)', 'Theo tầng (FE / BE / DB)'), t('By screen (vertical slice)', 'Theo màn hình (lát cắt dọc)')], [
    [t('First thing a user can try', 'Thứ đầu tiên người dùng thử được'), t('When every layer of a screen is done — often week 3 or later', 'Khi đủ mọi tầng của một màn — thường tuần 3 trở đi'), t('The first screen, end of week 1', 'Màn đầu tiên, cuối tuần 1')],
    [t('Waiting', 'Chờ nhau'), t('FE waits for API, API waits for tables', 'FE chờ API, API chờ bảng'), t('Only on shared parts (layout, login, schema)', 'Chỉ ở phần dùng chung (layout, đăng nhập, lược đồ)')],
    [t('Integration bugs', 'Lỗi ghép nối'), t('Found at the end, all at once', 'Lộ ở cuối, cùng một lúc'), t('Found per screen, by its owner', 'Lộ theo từng màn, do chủ màn tự gặp')],
    [t('Who answers "why does this screen fail?"', 'Ai trả lời "sao màn này lỗi?"'), t('Three people point at each other', 'Ba người chỉ vào nhau'), t('One owner', 'Một người chủ')],
    [t('SWP391 LOC', 'LOC SWP391'), t('One PIC per screen row ⇒ somebody gets 0', 'Một PIC mỗi dòng màn ⇒ có người được 0'), t('Each member owns their screens', 'Ai cũng sở hữu màn của mình')],
  ])}
<p>${t('Alistair Cockburn’s workshop "Elephant Carpaccio" trains exactly this skill: cut a feature into 15–20 thin vertical slices, each one demonstrable. The rest of the lesson shows the numbers for your project.', 'Bài tập "Elephant Carpaccio" (thái lát voi) của Alistair Cockburn luyện đúng kỹ năng này: cắt một tính năng thành 15–20 lát dọc mỏng, lát nào cũng demo được. Phần còn lại của bài cho bạn thấy con số với chính dự án của bạn.')}</p>

<h3>${t('Lab: count graded LOC per member under both splits', 'Lab: đếm LOC được chấm của từng người theo hai cách chia')}</h3>
<p>${t('The script below takes 28 LabFlow screens of iterations 1–2 (codes, names and owners from the', 'Script dưới đây lấy 28 màn hình LabFlow của iteration 1–2 (mã, tên, vai lấy từ')} <a href="/projects/labflow-ai">${t('LabFlow project page', 'trang dự án LabFlow')}</a>${t('), gives each a Level from fields OR transactions using the table of the Refs sheet (Level 1 = 60 … Level 7 = 240 LOC, step 30), assumes every screen reaches Quality L2 (75%) and sums per person. The field/transaction counts are assumptions for practice; on your project the lecturer confirms the level (', '), xếp Level cho từng màn theo field HOẶC transaction bằng bảng của sheet Refs (Level 1 = 60 … Level 7 = 240 LOC, bước 30), giả định mọi màn đạt Quality L2 (75%) rồi cộng theo từng người. Số field/transaction là giả định để luyện; ở dự án thật giảng viên chốt level (')}${ac('software-development-project', 'swp391-4-complexity-loc-grade', t('how to count — Academy SWP391 4.3', 'cách đếm — Academy SWP391 4.3'))}).</p>
${js(MA.chiaViec)}
<p>${t('Split by screen (the owners of the project page):', 'Chia theo màn hình (vai theo trang dự án):')}</p>
${out('$ node chia-viec.mjs theo-man\n' + RA.chiaTheoMan)}
<p>${t('Split by layer — C1, C2 do React, C3, C4 do Spring, C5 does the database and tests. The Product sheet has one PIC column, so the team writes the front-end person (what teams usually do):', 'Chia theo tầng — C1, C2 làm React, C3, C4 làm Spring, C5 làm cơ sở dữ liệu và test. Sheet Product chỉ có một cột PIC nên nhóm ghi người làm giao diện (điều các nhóm hay làm):')}</p>
${out('$ node chia-viec.mjs theo-tang\n' + RA.chiaTheoTang)}
${cl('danger', `<p><strong>${t('Read the second table as a lecturer would', 'Đọc bảng thứ hai như giảng viên đọc')}</strong>: ${t('three members with 0 LOC — LOC is 70% of every iteration grade and is checked by a live demo of <em>your</em> screen where you may be asked to change the code within 30 minutes. Writing C3 as PIC for half the rows does not help either: at the demo C3 must explain React code C1 wrote. And 56 hand-offs between people for 28 screens means 56 chances for "I am waiting for your API".', 'ba thành viên 0 LOC — trong khi LOC là 70% điểm mỗi iteration và được kiểm bằng demo trực tiếp màn hình <em>của bạn</em>, có thể bị yêu cầu sửa code trong 30 phút. Ghi C3 làm PIC cho nửa số dòng cũng không cứu được: ở buổi demo C3 phải giải thích code React do C1 viết. Còn 56 lần bàn giao giữa người với người cho 28 màn nghĩa là 56 cơ hội cho câu "mình đang chờ API của bạn".')}</p>`)}

<h3>${t('Balancing: move whole screens, not halves', 'Cân bằng: chuyển nguyên màn, không chia đôi màn')}</h3>
<p>${t('Iteration 1 is uneven: C2 has 450 planned LOC, C3 has 300. The fix is to move whole screens between neighbours in the domain — here C2 gives the opening-hours calendar S18 to C3 (who already owns the home page) and takes the light home page S08:', 'Iteration 1 đang lệch: C2 có 450 LOC kế hoạch, C3 có 300. Cách sửa là chuyển nguyên màn giữa những người gần miền nghiệp vụ — ở đây C2 nhường lịch mở cửa S18 cho C3 (người đang giữ trang chủ) và nhận trang chủ nhẹ S08:')}</p>
${out('$ node chia-viec.mjs theo-man S18=C3 S08=C2\n' + RA.chiaDoi.split('\n').filter((d) => !/^S\d\d /.test(d) && !d.startsWith('Mã ')).join('\n'))}
${note(t('Spread 150 → 30 LOC. Two rules for every move: (1) a screen keeps exactly one owner from spec to demo; (2) the shared parts — layout S07, login S03 — are rows of their own, owned by the leader and done first, because every other screen imports them.', 'Chênh lệch 150 → 30 LOC. Hai luật cho mọi lần chuyển: (1) một màn giữ đúng một người chủ từ đặc tả tới demo; (2) phần dùng chung — layout S07, đăng nhập S03 — là dòng riêng, do trưởng nhóm giữ và làm trước, vì mọi màn khác đều dùng chúng.'))}

<h3>${t('Splitting a screen that is too big: SPIDR', 'Cắt một màn quá to: SPIDR')}</h3>
<p>${t(
    'S22, the booking wizard, is Level 7 (16 fields, 7 transactions) and was estimated at 8 points — too big for one card. Mike Cohn’s five splitting patterns, <strong>SPIDR</strong>, give you a menu: <strong>S</strong>pike (research first), <strong>P</strong>aths (one path through the flow at a time), <strong>I</strong>nterfaces (simple UI first, rich UI later), <strong>D</strong>ata (one kind of data first), <strong>R</strong>ules (relax a business rule first, add it later) (',
    'S22, wizard đặt lịch, là Level 7 (16 field, 7 transaction) và được ước 8 điểm — quá to cho một thẻ. Năm kiểu cắt <strong>SPIDR</strong> của Mike Cohn cho bạn một thực đơn: <strong>S</strong>pike (nghiên cứu trước), <strong>P</strong>aths (mỗi lần một đường đi qua luồng), <strong>I</strong>nterfaces (giao diện đơn giản trước, đầy đủ sau), <strong>D</strong>ata (một loại dữ liệu trước), <strong>R</strong>ules (nới một luật nghiệp vụ trước, thêm sau) (')}${ng('https://www.mountaingoatsoftware.com/blog/five-simple-but-powerful-ways-to-split-user-stories', 'Mountain Goat Software')}).</p>
${BANG_SPIDR(t)}
<p>${t(
    'Four cards, 10 points instead of 8 — splitting usually <em>reveals</em> work rather than creating it. After LF-39a the lecturer can already book a lab in the demo; after each later slice something more works. All four cards still belong to <strong>one screen row (S22) and one owner (C1)</strong>: you split the work, not the ownership.',
    'Bốn thẻ, 10 điểm thay vì 8 — cắt nhỏ thường <em>làm lộ</em> việc chứ không đẻ thêm việc. Sau LF-39a giảng viên đã đặt được phòng lab trong buổi demo; sau mỗi lát tiếp theo lại thêm một thứ chạy được. Cả bốn thẻ vẫn thuộc <strong>một dòng màn hình (S22) và một người chủ (C1)</strong>: bạn chia việc, không chia quyền sở hữu.')}</p>
${cl('warn', `<p><strong>${t('Dependencies between screens', 'Phụ thuộc giữa các màn')}</strong>: ${t('S25 (approval queue, C2) needs reservations that S22 (C1) creates. Do not let C2 wait: in sprint planning, C1 and C2 agree the table <code>reservation</code> and the JSON of <code>GET /api/reservations?status=PENDING</code> in 15 minutes, write it into both tickets, and C2 seeds test rows until LF-39a is merged. Agreeing the contract first is what makes vertical slices parallel.', 'S25 (hàng duyệt, C2) cần lịch đặt mà S22 (C1) tạo ra. Đừng để C2 ngồi chờ: ở sprint planning, C1 và C2 chốt bảng <code>reservation</code> và JSON của <code>GET /api/reservations?status=PENDING</code> trong 15 phút, ghi vào cả hai ticket, rồi C2 tự chèn dữ liệu thử cho tới khi LF-39a được merge. Chốt hợp đồng trước là thứ làm cho các lát dọc chạy song song được.')}</p>`)}

<h3>${t('At work', 'Khi đi làm')}</h3>
<p>${t(
    'In companies you will meet specialist roles — a front-end developer, a back-end developer, a tester — and that is fine, because a company does not grade LOC per person. What stays the same is the <em>vertical story</em>: one story carries a front-end sub-task and a back-end sub-task for two people, and it is Done only when both are merged and tested together. Melvin Conway observed in 1968 that systems end up shaped like the communication structure of the teams that build them; teams split by layer produce systems whose layers do not fit. In outsourcing projects the screen list of the basic design document plays the role of your Project Tracking sheet: work is assigned and estimated per screen ID (',
    'Ở công ty bạn sẽ gặp vai chuyên biệt — dev front-end, dev back-end, tester — và điều đó không sao, vì công ty không chấm LOC theo từng người. Thứ giữ nguyên là <em>story dọc</em>: một story mang một sub-task front-end và một sub-task back-end cho hai người, và chỉ Done khi cả hai đã merge và test cùng nhau. Năm 1968 Melvin Conway nhận xét rằng hệ thống rốt cuộc mang hình dạng của cấu trúc giao tiếp giữa các đội làm ra nó; đội chia theo tầng làm ra hệ thống có các tầng không khớp nhau. Ở dự án outsourcing, danh sách màn hình của tài liệu thiết kế cơ bản đóng vai sheet Project Tracking của bạn: việc được giao và ước lượng theo mã màn hình (')}${ag('agl-9-3-tai-lieu-bd-dd', t('lesson 9.3', 'bài 9.3'))}, ${ag('agl-9-6-uoc-luong-man-day', t('9.6', '9.6'))}).</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
<li>${t('Iteration 2 is still uneven (C3 420, C5 300). Find a move that brings the spread to ≤ 30 and decide whether you would really make it.', 'Iteration 2 vẫn lệch (C3 420, C5 300). Tìm một lần chuyển đưa chênh lệch về ≤ 30 và quyết định bạn có thật sự làm vậy không.')}</li>
<li>${t('Split S30 Loan desk (15 fields, 7 transactions, Level 6) into 3–4 vertical slices with SPIDR. Each slice must be demonstrable.', 'Cắt S30 Quầy cho mượn (15 field, 7 transaction, Level 6) thành 3–4 lát dọc bằng SPIDR. Lát nào cũng phải demo được.')}</li>
<li>${t('C4 writes in the group chat: "Mình giỏi Spring, để mình làm hết API cho cả nhóm, các bạn lo giao diện cho nhanh." Write the leader’s reply (≤ 5 sentences).', 'C4 nhắn trong nhóm: "Mình giỏi Spring, để mình làm hết API cho cả nhóm, các bạn lo giao diện cho nhanh." Viết câu trả lời của trưởng nhóm (≤ 5 câu).')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<p>${t('1. Swapping S24 (C3, 180) with S34 (C5, 120):', '1. Đổi S24 (C3, 180) lấy S34 (C5, 120):')}</p>
${out('$ node chia-viec.mjs theo-man S24=C5 S34=C3\n' + RA.chiaDoiIt2.split('\n').filter((d) => !/^S\d\d /.test(d) && !d.startsWith('Mã ')).join('\n'))}
<p>${t('The numbers balance, but S24 (reservation detail/cancel) now sits with C5, whose domain is administration and maintenance, while C3 owns the rest of the reservation life-cycle (waitlist, check-in). A reasonable leader keeps the original split for iteration 2 and evens it out in iteration 3, where LOC of the whole project is counted — or makes the swap only if C5 volunteers. Numbers inform the decision; they do not make it.', 'Số liệu cân, nhưng S24 (chi tiết/huỷ lịch) giờ nằm ở C5, người có miền là quản trị và bảo trì, trong khi C3 giữ phần còn lại của vòng đời lịch đặt (hàng chờ, check-in). Một trưởng nhóm hợp lý sẽ giữ cách chia cũ cho iteration 2 và bù ở iteration 3, nơi LOC cả dự án được tính — hoặc chỉ đổi khi C5 tự nguyện. Con số giúp ra quyết định; nó không quyết định thay bạn.')}</p>
<p>${t('2. One split: (a) Paths — check out one device unit to a student who has an approved reservation, with due date (BR-12 default 3 days); (b) Data — find the student by code or by reservation QR; (c) Rules — refuse units that are MAINTENANCE/ON_LOAN (BR-11) and students locked by no-show points (BR-09); (d) Interfaces — record condition with photo and print the receipt. After (a) the demo already shows a loan.', '2. Một cách cắt: (a) Paths — cho một sinh viên có lịch đã duyệt mượn một đơn vị thiết bị, có hạn trả (BR-12 mặc định 3 ngày); (b) Data — tìm sinh viên theo mã hoặc theo QR của lịch đặt; (c) Rules — từ chối đơn vị đang MAINTENANCE/ON_LOAN (BR-11) và sinh viên bị khoá vì điểm phạt no-show (BR-09); (d) Interfaces — ghi tình trạng kèm ảnh và in phiếu. Sau (a) buổi demo đã cho thấy một lượt mượn.')}</p>
<p>${t('3. For example: "Thanks C4, having a strong Spring person helps a lot. But SWP391 grades LOC per screen per person, and at the demo each of us must change the code of our own screens — so everyone does their screens from database to UI. What would help most: you set up the Spring skeleton, the error format and one sample screen in sprint 0, and review the back-end part of everyone’s PR. Ok with you?" — acknowledge, give the reason (grading + demo), offer a role that uses the strength, ask for agreement.', '3. Ví dụ: "Cảm ơn C4, nhóm có người vững Spring là lợi lắm. Nhưng SWP391 chấm LOC theo màn của từng người, và lúc demo ai cũng phải tự sửa code màn của mình — nên mỗi người làm màn của mình từ DB tới giao diện. Cái giúp nhóm nhất: bạn dựng khung Spring, định dạng lỗi chung và một màn mẫu ở sprint 0, rồi review phần back-end trong PR của mọi người. Bạn thấy được không?" — ghi nhận, nêu lý do (cách chấm + demo), đề nghị một vai dùng đúng thế mạnh, hỏi đồng ý.')}</p>`)}

${phongVan([
    [t('"How would you split a large feature?"', '"Bạn chia một tính năng lớn thế nào?"'), t('Into thin vertical slices that each deliver something a user can try, using patterns like SPIDR (paths, data, rules, interfaces, spike). Agree interfaces between slices first so they can be built in parallel.', 'Thành các lát dọc mỏng, lát nào cũng đem lại thứ người dùng thử được, dùng các kiểu như SPIDR (đường đi, dữ liệu, luật, giao diện, spike). Chốt giao tiếp giữa các lát trước để làm song song được.')],
    [t('"Horizontal or vertical slicing — why?"', '"Cắt ngang hay cắt dọc — vì sao?"'), t('Vertical: earlier feedback, integration problems found per slice instead of at the end, one owner per behaviour, and progress you can demo. Horizontal work exists (shared infrastructure) but should be small and done first.', 'Dọc: phản hồi sớm hơn, lỗi ghép nối lộ theo từng lát thay vì dồn cuối, mỗi hành vi một người chủ, tiến độ demo được. Việc ngang vẫn có (hạ tầng dùng chung) nhưng nên nhỏ và làm trước.')],
    [t('"How did you divide work in your student team?"', '"Nhóm sinh viên của bạn chia việc thế nào?"'), t('By business area and screen, one owner per screen, full stack — because the course graded per screen and per person; shared layout and login owned by the leader and built first; dependencies handled by agreeing tables and API contracts at planning.', 'Theo mảng nghiệp vụ và màn hình, mỗi màn một người, làm full-stack — vì môn chấm theo màn và theo người; layout và đăng nhập dùng chung do trưởng nhóm giữ và làm trước; phụ thuộc xử lý bằng cách chốt bảng và hợp đồng API ở planning.')],
    [t('"What is Conway’s law?"', '"Định luật Conway là gì?"'), t('Organisations design systems that mirror their communication structure (Conway, 1968). Practical meaning: shape teams around the product slices you want, not around technical layers.', 'Tổ chức thiết kế hệ thống phản chiếu cấu trúc giao tiếp của chính nó (Conway, 1968). Nghĩa thực tế: tổ chức đội theo các lát sản phẩm mong muốn, không theo tầng kỹ thuật.')],
  ], en)}

${thuatNgu([
    [t('vertical slice', 'lát cắt dọc'), t('A thin piece of a feature through every layer, usable on its own.', 'Một miếng mỏng của tính năng xuyên qua mọi tầng, tự dùng được.')],
    [t('horizontal split', 'chia ngang (theo tầng)'), t('Dividing work by technical layer (UI / API / DB).', 'Chia việc theo tầng kỹ thuật (giao diện / API / CSDL).')],
    ['SPIDR', t('Spike, Paths, Interfaces, Data, Rules — story splitting patterns (Mike Cohn).', 'Spike, Paths, Interfaces, Data, Rules — các kiểu cắt story (Mike Cohn).')],
    ['PIC', t('Person in charge — the one owner of a screen row.', 'Người phụ trách — chủ duy nhất của một dòng màn hình.')],
    [t('Converted LOC', 'LOC quy đổi'), t('SWP391 size of a screen: Level LOC × Quality rate.', 'Cỡ màn hình ở SWP391: LOC theo Level × tỉ lệ Quality.')],
    [t('API contract', 'hợp đồng API'), t('Agreed request/response shape that lets two slices be built in parallel.', 'Dạng request/response đã chốt giúp hai lát làm song song.')],
    [t('Conway’s law', 'định luật Conway'), t('Systems mirror the communication structure of their builders.', 'Hệ thống phản chiếu cấu trúc giao tiếp của người làm ra nó.')],
  ], en)}

${tomTat([
    t('Epic (area) → story (one screen or slice, ≤ 5 points, one owner) → sub-task (≤ 1 day, same owner).', 'Epic (mảng) → story (một màn hoặc một lát, ≤ 5 điểm, một người) → sub-task (≤ 1 ngày, cùng người).'),
    t('On SWP391 split by screen, never by layer: the script shows 0 LOC for three members under a layer split.', 'Ở SWP391 chia theo màn hình, không bao giờ theo tầng: script cho thấy ba người 0 LOC khi chia theo tầng.'),
    t('Balance by moving whole screens between domain neighbours; shared parts are leader-owned rows done first.', 'Cân bằng bằng cách chuyển nguyên màn giữa người gần miền; phần dùng chung là dòng riêng của trưởng nhóm, làm trước.'),
    t('Cut big screens with SPIDR into demonstrable slices; split the work, not the ownership.', 'Cắt màn to bằng SPIDR thành các lát demo được; chia việc, không chia quyền sở hữu.'),
    t('Agree tables and API contracts at planning so dependent screens progress in parallel.', 'Chốt bảng và hợp đồng API ở planning để các màn phụ thuộc chạy song song.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-2-3-uoc-luong', t('2.3 — Estimation: story points and planning poker', '2.3 — Ước lượng: story point và planning poker'))}.</p>
`);
};

export default {
  title: '2.2 — Breaking work down|||2.2 — Chia nhỏ công việc',
  slug: 'agl-2-2-chia-nho',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Epic → story → sub-task với luật cỡ; tầng ngang và lát cắt dọc (liên tưởng nấu cỗ); lab chạy thật đếm LOC SWP391 từng người trên 28 màn LabFlow: chia theo tầng ⇒ 3 người 0 LOC và 56 lần bàn giao, chia theo màn ⇒ cân bằng bằng cách đổi nguyên màn; cắt màn to bằng SPIDR; chốt hợp đồng API cho màn phụ thuộc; định luật Conway khi đi làm.',
  content: L22(true) + L22(false),
};
