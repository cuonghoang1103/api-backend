/**
 * 2.5 — Lab: backlog iteration 1 cho LabFlow (agl-2-5-lab). Soạn 24/11/2026, agent agt. Bài MỚI (thêm vào khung).
 * Ghép bốn script của chương (kiem-ticket, chia-viec, poker, du-bao, xuat-csv) thành một quy trình; ví dụ LF-31 chạy THẬT,
 * kể cả lần script bắt nhầm chữ "và" (out-kiem-lf31-dau.txt) — giữ làm bài học "người quyết, script chỉ nhắc".
 */
import { bang, cl, note, giai, out, ag, ac, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const MAU = `# LF-xx <Ai> <làm gì> <với cái gì>

Loại: Story · Epic: LF-Ex <mảng> · Điểm: ? · Màn hình: Sxx (<tên màn>) · Người nhận: Cx

## Vì sao
Là <vai>, tôi muốn <hành động>, để <lợi ích>. <Một câu bối cảnh: hiện nay làm thế nào, đau ở đâu.>

## Tiêu chí chấp nhận
- AC1: Given <dữ liệu cụ thể> When <một hành động> Then <kết quả nhìn thấy>
- AC2: Given … When … Then …   (unhappy case bám BR-xx)
- AC3: Given người không có quyền When mở màn / gọi API Then 403

## Ngoài phạm vi
<thứ cố ý không làm> (LF-yy)

## Ghi chú
Figma khung Sxx · BR-xx · dữ liệu thử`;

export const L25 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 2 · Lesson 2.5 · Lab', 'Chương 2 · Bài 2.5 · Lab', `
<h2>${t('2.5 — Lab: the iteration-1 backlog for LabFlow', '2.5 — Lab: backlog iteration 1 cho LabFlow')}</h2>
<p class="lead">${t(
    'This is the project milestone of chapter 2. At the end you have, in CT Work, a ready, balanced, estimated backlog for iteration 1: one story per screen, one owner per screen, criteria that turn into test cases, and a sprint you can start on Monday. It is the single most useful thing a leader can bring to the first planning meeting.',
    'Đây là mốc dự án của chương 2. Cuối bài bạn có trên CT Work một backlog iteration 1 đã sẵn sàng, cân bằng, đã ước lượng: mỗi màn một story, mỗi màn một người chủ, tiêu chí biến được thành test case, và một sprint bắt đầu được vào thứ Hai. Đó là thứ có ích nhất mà trưởng nhóm mang tới buổi planning đầu tiên.')}</p>
${cl('info', `<p><strong>🛠 ${t('Project milestone', 'Mốc dự án')}</strong> · ${t('Time: 3–4 hours (leader), plus one 45-minute poker session with the team. Tools: Node 22, the scripts of lessons 2.1–2.4 in one folder <code>~/lab2</code>, a CT Work account.', 'Thời gian: 3–4 giờ (trưởng nhóm), cộng một buổi poker 45 phút với cả nhóm. Công cụ: Node 22, các script của bài 2.1–2.4 trong một thư mục <code>~/lab2</code>, tài khoản CT Work.')}</p>`)}

<h3>${t('Step 1 — One ticket per screen of iteration 1', 'Bước 1 — Mỗi màn iteration 1 một ticket')}</h3>
<p>${t('Take the 15 iteration-1 screens from the table of lesson 2.2 (S01, S03–S08, S10, S11, S13, S14, S16–S19) and write one file per screen in <code>ticket/</code> from this template. The owner of each screen writes its ticket; the leader reviews.', 'Lấy 15 màn iteration 1 trong bảng bài 2.2 (S01, S03–S08, S10, S11, S13, S14, S16–S19) và viết mỗi màn một tệp trong <code>ticket/</code> theo mẫu này. Người chủ màn nào viết ticket màn đó; trưởng nhóm review.')}</p>
${out(MAU)}
${note(t('Write the unhappy cases from the business rules on the <a href="/projects/labflow-ai">LabFlow page</a> (BR-01 school e-mail domain for S01, BR-02 lock after 5 wrong passwords for S03, BR-03 one-time reset link for S04…). Every list screen also gets "no rows match" and "no permission" cases.', 'Viết unhappy case từ các luật nghiệp vụ trên <a href="/projects/labflow-ai">trang LabFlow</a> (BR-01 email tên miền trường cho S01, BR-02 khoá sau 5 lần sai mật khẩu cho S03, BR-03 link đặt lại dùng một lần cho S04…). Màn danh sách nào cũng thêm trường hợp "không dòng nào khớp" và "không có quyền".'))}

<h3>${t('Step 2 — Run the checker until everything is READY', 'Bước 2 — Chạy script soát tới khi mọi ticket SẴN SÀNG')}</h3>
<p>${t('Here is what happened with the S13 ticket written by C2 — the first run:', 'Đây là chuyện đã xảy ra với ticket S13 do C2 viết — lần chạy đầu:')}</p>
${out('$ node kiem-ticket.mjs ticket/LF-31.md\n' + RA.kiemLf31Dau)}
<p>${t('Is the script right? "danh sách toà nhà <strong>và</strong> phòng lab" joins two nouns of one list, not two jobs — a false alarm. But the title can be said without the "and" and becomes clearer, so C2 renames it rather than weakening the rule:', 'Script có đúng không? "danh sách toà nhà <strong>và</strong> phòng lab" nối hai danh từ của cùng một danh sách, không phải hai việc — báo nhầm. Nhưng tiêu đề nói được mà không cần "và" và còn rõ hơn, nên C2 đổi tên thay vì nới luật:')}</p>
${out(MA.lf31)}
${out('$ node kiem-ticket.mjs ticket/LF-31.md\n' + RA.kiemLf31)}
${cl('warn', `<p>${t('The checker is a reminder, not a judge. When it is wrong, a human decides: rename, or add the exception to the rule with a comment explaining why. Never let "the script passed" replace reading the ticket.', 'Script soát chỉ là lời nhắc, không phải quan toà. Khi nó sai, con người quyết: đổi tên, hoặc thêm ngoại lệ vào luật kèm chú thích vì sao. Đừng bao giờ để "script đã qua" thay cho việc đọc ticket.')}</p>`)}

<h3>${t('Step 3 — Check the balance of graded LOC', 'Bước 3 — Soát cân bằng LOC được chấm')}</h3>
<p>${t('Update the field/transaction counts in <code>chia-viec.mjs</code> with the real counts from your screen designs, run <code>node chia-viec.mjs theo-man</code>, and move whole screens until the iteration-1 spread is ≤ 90 LOC — or write down why you accept a larger one (lesson 2.2). Show the table to the team before planning: nobody should discover at the demo that they own 60 LOC.', 'Cập nhật số field/transaction trong <code>chia-viec.mjs</code> theo thiết kế màn thật, chạy <code>node chia-viec.mjs theo-man</code>, rồi chuyển nguyên màn tới khi chênh lệch iteration 1 ≤ 90 LOC — hoặc ghi lại vì sao chấp nhận chênh hơn (bài 2.2). Cho cả nhóm xem bảng trước planning: không ai được phát hiện ở buổi demo rằng mình chỉ có 60 LOC.')}</p>

<h3>${t('Step 4 — One planning-poker session', 'Bước 4 — Một buổi planning poker')}</h3>
<ol>
<li>${t('Agree the three reference stories (lesson 2.3). Iteration 1 has no finished work yet, so use stories everyone understands: a change-password form = 1, a list with search and paging = 3, a multi-step wizard = 8.', 'Chốt ba story mốc (bài 2.3). Iteration 1 chưa có việc nào xong, nên dùng story ai cũng hình dung được: form đổi mật khẩu = 1, danh sách có tìm và phân trang = 3, wizard nhiều bước = 8.')}</li>
<li>${t('Estimate all 15 tickets with simultaneous reveal; time-box 45 minutes. Anything you cannot size → a spike ticket of at most 4 hours (for example: QR labels on S17, e-mail verification on S01).', 'Ước lượng cả 15 ticket bằng lật cùng lúc; giới hạn 45 phút. Thứ nào không ước được → một ticket spike tối đa 4 giờ (vd nhãn QR ở S17, xác minh email ở S01).')}</li>
<li>${t('Anything at 13 → split with SPIDR before the sprint starts.', 'Thứ gì 13 điểm → cắt bằng SPIDR trước khi sprint bắt đầu.')}</li>
</ol>

<h3>${t('Step 5 — Decide how much to commit', 'Bước 5 — Quyết định cam kết bao nhiêu')}</h3>
<p>${t('There is no velocity yet. Commit the shared parts (S07 layout, S03 login) plus each member’s first screen as the Sprint Goal ("every role can log in and reach one working screen of their own"), and keep the rest of the 15 as "planned, not promised". At the end of week 1, measure points Done per week and from then on plan with', 'Chưa có velocity. Cam kết phần dùng chung (layout S07, đăng nhập S03) cộng màn đầu tiên của mỗi người làm Sprint Goal ("mọi vai đăng nhập được và vào được một màn của chính mình chạy thật"), phần còn lại trong 15 màn để "có kế hoạch, chưa hứa". Hết tuần 1, đo điểm Done mỗi tuần và từ đó lập kế hoạch bằng')} <code>du-bao.mjs</code> ${t('with weekly numbers (lesson 2.3).', 'với số liệu theo tuần (bài 2.3).')}</p>

<h3>${t('Step 6 — Import and start the sprint in CT Work', 'Bước 6 — Nhập và bắt đầu sprint trên CT Work')}</h3>
${out('$ node xuat-csv.mjs ticket/*.md > sprint.csv\n' + RA.xuatCsv)}
<p>${t('Import <code>sprint.csv</code> into project LF (lesson 2.4), set owners, put the committed tickets into sprint 1 with the Sprint Goal, and start it. Link the board in the team chat and in the Project Tracking sheet.', 'Nhập <code>sprint.csv</code> vào dự án LF (bài 2.4), gán người nhận, đưa các ticket đã cam kết vào sprint 1 kèm Sprint Goal, rồi bắt đầu sprint. Ghim đường dẫn bảng trong nhóm chat và trong sheet Project Tracking.')}</p>

<h3>✅ ${t('Done when', 'Đạt khi')}</h3>
${bang([t('Check', 'Soát'), t('Evidence', 'Bằng chứng')], [
    [t('15 screen tickets, all READY', '15 ticket màn hình, tất cả SẴN SÀNG'), t('<code>node kiem-ticket.mjs ticket/*.md</code> exits 0', '<code>node kiem-ticket.mjs ticket/*.md</code> thoát với mã 0')],
    [t('Every ticket has ≥ 1 unhappy case naming a BR-xx and a permission case', 'Ticket nào cũng có ≥ 1 unhappy case nêu BR-xx và một trường hợp phân quyền'), t('Read by the leader, not only by the script', 'Trưởng nhóm đọc, không chỉ script')],
    [t('Iteration-1 LOC spread ≤ 90 (or a written reason)', 'Chênh LOC iteration 1 ≤ 90 (hoặc có lý do ghi lại)'), t('Output of <code>chia-viec.mjs</code> shown at planning', 'Output <code>chia-viec.mjs</code> chiếu ở planning')],
    [t('Every ticket has points from poker; nothing above 8; unknowns became spikes', 'Ticket nào cũng có điểm từ poker; không gì trên 8; ẩn số thành spike'), t('Points column in CT Work', 'Cột điểm trên CT Work')],
    [t('Sprint 1 started with a one-sentence goal', 'Sprint 1 đã bắt đầu với mục tiêu một câu'), t('Sprint page in CT Work', 'Trang sprint trên CT Work')],
    [t('Each member owns 3–4 screens, full stack', 'Mỗi người giữ 3–4 màn, làm full-stack'), t('Owner column = PIC column of Project Tracking', 'Cột người nhận = cột PIC của Project Tracking')],
  ])}
${giai(t('Self-check: five questions a lecturer may ask at your first meeting', 'Tự kiểm: năm câu giảng viên có thể hỏi ở buổi gặp đầu tiên'), `<ol>
<li>${t('"Who owns S22, and what does S25 need from it?" — C1; the reservation table and the pending-list API agreed at planning (2.2).', '"Ai giữ S22, và S25 cần gì từ nó?" — C1; bảng reservation và API danh sách chờ duyệt đã chốt ở planning (2.2).')}</li>
<li>${t('"Why do you not have a back-end person?" — LOC is graded per screen per person and each of us must modify our own code at the demo; we share a skeleton and review each other’s back-end code instead.', '"Sao nhóm không có người chuyên back-end?" — LOC chấm theo màn theo người và mỗi người phải tự sửa code của mình lúc demo; thay vào đó nhóm dùng chung một bộ khung và review chéo phần back-end.')}</li>
<li>${t('"How do you know a screen is finished?" — its acceptance criteria pass, plus the team DoD (1.2).', '"Làm sao biết một màn đã xong?" — tiêu chí chấp nhận đạt, cộng DoD của nhóm (1.2).')}</li>
<li>${t('"How much will you finish this iteration?" — the committed goal for sure; the rest is planned, and from week 2 we forecast from measured weekly velocity.', '"Iteration này làm xong bao nhiêu?" — chắc chắn phần mục tiêu đã cam kết; phần còn lại có kế hoạch, từ tuần 2 dự báo theo velocity tuần đo được.')}</li>
<li>${t('"Where can I see progress?" — the CT Work board and burndown; the Project Tracking and weekly report are exported from it (', '"Thầy/cô xem tiến độ ở đâu?" — bảng và burndown trên CT Work; Project Tracking và báo cáo tuần được xuất từ đó (')}${ac('software-development-project', 'swp391-4-project-tracking-workbook', 'Academy SWP391 4.2')}).</li>
</ol>`)}
<p>${t('Next: ', 'Tiếp theo: ')}${ag('agl-2-6-quiz', t('2.6 — Chapter 2 quiz', '2.6 — Kiểm tra Chương 2'))} · ${ag('agl-3-1-quy-uoc', t('Chapter 3 — branches, commits and pull requests', 'Chương 3 — nhánh, commit và pull request'))}.</p>
`);
};

export default {
  title: '2.5 — Lab: the iteration-1 backlog for LabFlow|||2.5 — Lab: backlog iteration 1 cho LabFlow',
  slug: 'agl-2-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc dự án chương 2: mỗi màn iteration 1 một ticket theo mẫu, chạy script soát tới khi SẴN SÀNG (ví dụ thật LF-31: script báo nhầm chữ "và" — người quyết), soát cân bằng LOC, một buổi planning poker, quyết định cam kết khi chưa có velocity, nhập CSV và bắt đầu sprint 1 trên CT Work; bảng "Đạt khi" và năm câu giảng viên hay hỏi.',
  content: L25(true) + L25(false),
};
