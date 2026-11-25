/**
 * Chương 2 — Ticket và ước lượng (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s02/; ./s02/_ma.mjs là tệp SINH (mã lab + output thật, Node 22.22.2) bởi scratchpad/agt/lab/ch2/tao-ma.mjs.
 * Slug + title 4 bài cũ GIỮ NGUYÊN theo khung (agl-2-1 … agl-2-4); thêm agl-2-5-lab và agl-2-6-quiz (đã thêm vào khung trong ../agile-teamwork.mjs).
 */
import { Q } from './_chung.mjs';
import B1 from './s02/b1-ticket.mjs';
import B2 from './s02/b2-chia-nho.mjs';
import B3 from './s02/b3-uoc-luong.mjs';
import B4 from './s02/b4-ct-work.mjs';
import B5 from './s02/b5-lab.mjs';

const QUIZ2 = [
  Q('agl2-1', 'Which acceptance criterion is testable?|||Tiêu chí chấp nhận nào kiểm thử được?', [
    'The booking page is fast and user-friendly|||Trang đặt lịch nhanh và thân thiện',
    'Given TB-07 has a booking 10:00–11:00 When another student books 09:00–10:30 the same day Then the system refuses with "Time slot overlaps" and creates nothing|||Given TB-07 có lịch 10:00–11:00 When sinh viên khác đặt 09:00–10:30 cùng ngày Then hệ thống từ chối với "Khung giờ bị trùng" và không tạo gì',
    'Booking works correctly in all cases|||Đặt lịch chạy đúng trong mọi trường hợp',
    'The developer tests booking carefully|||Lập trình viên test kỹ phần đặt lịch',
  ], 1, 'Concrete data, one action, an observable result. Lesson 2.1.|||Dữ liệu cụ thể, một hành động, một kết quả nhìn thấy được. Bài 2.1.'),
  Q('agl2-2', 'An AC says only "the Book button is disabled for devices under maintenance". What is the risk?|||Một AC chỉ ghi "nút Đặt bị khoá với thiết bị đang bảo trì". Rủi ro là gì?', [
    'None — the button cannot be clicked|||Không có — không bấm được nút',
    'The rule may exist only in the UI; anyone can still call the booking API directly|||Luật có thể chỉ nằm ở giao diện; ai cũng vẫn gọi thẳng API đặt lịch được',
    'The button colour may be wrong|||Màu nút có thể sai',
    'The ticket becomes too big|||Ticket trở nên quá to',
  ], 1, 'Write rules as server behaviour (the API returns 409). Broken access control is OWASP Top 10:2021 A01. Lesson 2.1.|||Viết luật thành hành vi máy chủ (API trả 409). Kiểm soát truy cập hỏng là OWASP Top 10:2021 A01. Bài 2.1.'),
  Q('agl2-3', 'What does the Scrum Guide 2020 say about a "Definition of Ready"?|||Scrum Guide 2020 nói gì về "Definition of Ready"?', [
    'It is one of the three Scrum artifacts|||Nó là một trong ba sản phẩm của Scrum',
    'It does not define one; items that can be Done within one sprint are "ready for selection", and teams may add their own checklist|||Không định nghĩa; mục làm Done được trong một sprint thì "sẵn sàng để chọn", còn các đội có thể tự thêm checklist',
    'It must contain at least 15 items|||Nó phải có ít nhất 15 mục',
    'It replaces the Definition of Done|||Nó thay cho Definition of Done',
  ], 1, 'DoR is a team agreement, not part of Scrum; keep it short. Lesson 2.1.|||DoR là thoả thuận của nhóm, không thuộc Scrum; giữ nó ngắn. Bài 2.1.'),
  Q('agl2-4', 'In lesson 2.2 the team splits LabFlow by layer (two React, two Spring, one DB/test). What did the script show?|||Ở bài 2.2 nhóm chia LabFlow theo tầng (hai React, hai Spring, một DB/test). Script cho thấy gì?', [
    'The same LOC per person as splitting by screen|||LOC mỗi người như khi chia theo màn',
    'Three members with 0 graded LOC and 56 hand-offs for 28 screens|||Ba thành viên 0 LOC được chấm và 56 lần bàn giao cho 28 màn',
    'Faster delivery because specialists work in parallel|||Giao nhanh hơn vì người chuyên làm song song',
    'Higher Quality level for every screen|||Mọi màn đạt mức Quality cao hơn',
  ], 1, 'SWP391 has one PIC per screen row; split by screen, full stack. Lesson 2.2.|||SWP391 mỗi dòng màn một PIC; chia theo màn, làm full-stack. Bài 2.2.'),
  Q('agl2-5', 'S22 (booking wizard) is estimated at 8 points. Which split is a vertical slice?|||S22 (wizard đặt lịch) được ước 8 điểm. Cách cắt nào là lát dọc?', [
    'LF-39a: all database tables; LF-39b: all APIs; LF-39c: all React pages|||LF-39a: mọi bảng CSDL; LF-39b: mọi API; LF-39c: mọi trang React',
    'LF-39a: book a lab for one slot end to end with the overlap check; later slices add devices, quota rules and the full wizard|||LF-39a: đặt một phòng lab cho một khung giờ từ đầu tới cuối có kiểm trùng; các lát sau thêm thiết bị, luật hạn mức và wizard đầy đủ',
    'Give each of the four wizard steps to a different member|||Giao mỗi bước trong bốn bước wizard cho một thành viên khác nhau',
    'Do not split; estimate it as 13|||Không cắt; ước lại thành 13',
  ], 1, 'SPIDR: Paths, then Data, Rules, Interfaces — each slice demonstrable, same owner. Lesson 2.2.|||SPIDR: Paths, rồi Data, Rules, Interfaces — lát nào cũng demo được, cùng một người chủ. Bài 2.2.'),
  Q('agl2-6', 'Why is the leader told never to say their estimate first?|||Vì sao trưởng nhóm được dặn đừng bao giờ nói con số của mình trước?', [
    'The leader is always wrong|||Trưởng nhóm luôn sai',
    'It anchors the others, so the member who knows a hidden risk drifts towards the leader and the disagreement never shows|||Nó neo những người khác, người biết rủi ro ẩn bị kéo về phía trưởng nhóm và bất đồng không bao giờ lộ ra',
    'Scrum forbids leaders from estimating|||Scrum cấm trưởng nhóm ước lượng',
    'It makes the meeting longer|||Nó làm buổi họp dài hơn',
  ], 1, '200 simulated sessions: hidden risks surfaced 1.38/3 when anchored vs 2.92/3 with simultaneous reveal. Lesson 2.3.|||200 buổi mô phỏng: rủi ro ẩn lộ 1,38/3 khi bị neo so với 2,92/3 khi lật cùng lúc. Bài 2.3.'),
  Q('agl2-7', 'A ticket of 5 points is 90% done at the end of the sprint. How much does it add to velocity?|||Một ticket 5 điểm làm được 90% khi hết sprint. Nó cộng bao nhiêu vào velocity?', [
    '4.5|||4,5', '5|||5', '0|||0', 'Half: 2.5|||Một nửa: 2,5',
  ], 2, 'Velocity counts only items that met the Definition of Done. Lesson 2.3.|||Velocity chỉ đếm mục đã đạt Definition of Done. Bài 2.3.'),
  Q('agl2-8', 'Velocity history 14, 21, 17, 12; 96 points left; 5 sprints. What is the honest answer?|||Lịch sử velocity 14, 21, 17, 12; còn 96 điểm; còn 5 sprint. Câu trả lời trung thực là gì?', [
    '"We will finish: 96 ÷ 16 is about 6, close enough"|||"Kịp: 96 ÷ 16 khoảng 6, gần đủ"',
    '"About 3% chance for all 96; about 90% for 70 points — let us agree which 70"|||"Khả năng xong cả 96 chỉ khoảng 3%; với 70 điểm khoảng 90% — mình chốt 70 điểm nào"',
    '"We will work weekends, so 100%"|||"Bọn em làm cả cuối tuần nên 100%"',
    '"Estimates are useless, we cannot say"|||"Ước lượng vô dụng, không nói được"',
  ], 1, 'Monte Carlo over past velocity: range + probability + the scope lever. Lesson 2.3.|||Monte Carlo trên velocity quá khứ: khoảng + xác suất + cần gạt phạm vi. Bài 2.3.'),
  Q('agl2-9', 'S28 (QR check-in) is Level 3 for SWP391 grading but the team estimates it at 8 points. Is that a contradiction?|||S28 (QR check-in) là Level 3 khi chấm SWP391 nhưng nhóm ước 8 điểm. Có mâu thuẫn không?', [
    'Yes — points must equal the Level|||Có — điểm phải bằng Level',
    'No — Level sizes the screen for grading, points size the effort including uncertainty (the camera); both go on the ticket|||Không — Level định cỡ màn để chấm, điểm định công sức kể cả độ không chắc (camera); cả hai cùng nằm trên ticket',
    'Yes — the Level must be raised to 7|||Có — phải nâng Level lên 7',
    'No — points are hours|||Không — điểm là giờ',
  ], 1, 'Points are for planning, Levels for grading. Lesson 2.3.|||Điểm để lập kế hoạch, Level để chấm. Bài 2.3.'),
  Q('agl2-10', 'Before importing tickets into CT Work, which step from the lab protects the backlog?|||Trước khi nhập ticket vào CT Work, bước nào trong lab bảo vệ backlog?', [
    'Importing every Markdown file, ready or not|||Nhập mọi tệp Markdown, sẵn sàng hay chưa',
    'Exporting only tickets that pass the team checker, then reading the CSV back with a real parser|||Chỉ xuất ticket qua được script soát của nhóm, rồi đọc lại CSV bằng bộ phân tích thật',
    'Pasting the API token into the group chat so everyone can import|||Dán token API vào nhóm chat để ai cũng nhập được',
    'Letting the AI helper write all criteria and applying them without review|||Để trợ lý AI viết mọi tiêu chí rồi áp dụng không cần review',
  ], 1, 'The Definition of Ready is enforced before import; tokens stay private; AI only proposes. Lessons 2.4–2.5.|||Definition of Ready được áp trước khi nhập; token giữ riêng; AI chỉ đề xuất. Bài 2.4–2.5.'),
];

export default {
  title: 'Chapter 2 — Tickets and estimation|||Chương 2 — Ticket và ước lượng',
  description: 'Từ user story tới việc làm được trong vài ngày: ticket có tiêu chí Given/When/Then bám luật nghiệp vụ và script soát Definition of Ready chạy thật; chia theo màn hình/lát dọc với đếm LOC SWP391 từng người (chia theo tầng ⇒ 3 người 0 LOC); story point, planning poker mô phỏng 200 buổi, velocity và dự báo Monte Carlo; vận hành trên CT Work; lab backlog iteration 1 cho LabFlow.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra Chương 2',
      slug: 'agl-2-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: tiêu chí kiểm thử được, luật phải nằm ở máy chủ, Definition of Ready trong Scrum Guide, chia theo tầng hay theo màn, lát cắt dọc, hiệu ứng mỏ neo, velocity chỉ đếm Done, dự báo có xác suất, điểm khác Level LOC, nhập ticket an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the tickets, scripts and numbers of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các ticket, script và con số trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ2 },
    },
  ],
};
