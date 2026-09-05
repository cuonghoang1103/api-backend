/**
 * build-pmg201c-pe18.mjs — sinh content/exams/PMG201c-PE18.mjs.
 *
 * Nguồn thật: "PMG201c - SU25 - PE - 2 - Retake" ("PMG201c - Practical
 * Exam 2 (Summer 2025)"), đề MỞ — chọn 1 dự án từ môn học/hoạt động đại
 * học. Không có solution. Cùng khung Request như PE10/PE1 (charter/chi
 * phí/kế hoạch giao tiếp/trình tự hoạt động theo mốc) nhưng bối cảnh
 * riêng: "FU InterClass Sports Tournament" (giải thể thao liên lớp) —
 * khác mọi dự án đã dùng ở các PE trước.
 *
 * Trọng số gốc: Req1=20%, Req2=20%, Req3=30%, Req4=30% → 2/2/3/3 (10đ).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE18.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE18.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context (open-ended — pick a project from university training subjects or university activities; the assumed project used in these sample answers is stated below):</b><p>Pick a project from the university training subjects or university activities that you are currently working on, have worked on in the past, or a relevant project from your friend/relative that you know. <br/><b>Assumed project for these sample answers: "FU InterClass Sports Tournament 2025"</b> — a 2-week inter-class sports tournament across multiple sports, organized by the Student Affairs Office/student sports club.</p></div>`,
  `<div class="pe-system"><b>Bối cảnh (đề MỞ — chọn 1 dự án từ môn học/hoạt động đại học; dự án giả định dùng trong các câu trả lời mẫu dưới đây được nêu rõ):</b><p>Chọn 1 dự án từ môn học hoặc hoạt động đại học bạn đang/đã làm, hoặc dự án của người quen bạn biết rõ. <br/><b>Dự án giả định dùng cho các câu trả lời mẫu: "FU InterClass Sports Tournament 2025"</b> — giải thể thao liên lớp 2 tuần qua nhiều môn, do Phòng Công tác Sinh viên/câu lạc bộ thể thao sinh viên tổ chức.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Exam 2 (Summer 2025)</strong>. This is a written, open-ended project-management practical exam — you pick your own project. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành 2 (Summer 2025)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết, đề MỞ — bạn tự chọn dự án. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 (20%):</strong> create a narrative charter statement that includes: (1) Project name; (2) Project purpose or justification (reasons to implement this project); (3) High level requirements — describe in broad terms what you want the project to do or to provide; provide at least two of these.</p>`,
    `<p><strong>Yêu cầu 1 (20%):</strong> viết bản charter dạng tường thuật gồm: (1) Tên dự án; (2) Mục đích/lý do thực hiện; (3) Yêu cầu cấp cao — mô tả tổng quát dự án cần làm/cung cấp gì; nêu ít nhất 2 yêu cầu.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Project name:</strong> FU InterClass Sports Tournament 2025.</p>
     <p><strong>2. Purpose/justification:</strong> students spend most of campus time on academics with few structured outlets for physical activity and cross-class bonding. A well-organized, multi-sport inter-class tournament gives students a healthy extracurricular outlet, strengthens class identity/spirit, and builds the student sports club's track record for securing bigger budgets in future years.</p>
     <p><strong>3. High-level requirements:</strong></p>
     <ul><li>Organize round-robin group-stage matches followed by a knockout stage, across at least 5 sports (football, badminton, volleyball, table tennis, e-sports), among class teams, over a 2-week window.</li>
     <li>Provide live scoring/bracket updates accessible online so students can follow standings without being physically present at every match.</li></ul>`,
    `<p><strong>1. Tên dự án:</strong> FU InterClass Sports Tournament 2025.</p>
     <p><strong>2. Mục đích/lý do:</strong> sinh viên dành phần lớn thời gian ở trường cho học thuật, ít có kênh hoạt động thể chất và gắn kết liên lớp có cấu trúc. Một giải đấu liên lớp đa môn tổ chức tốt cho sinh viên kênh ngoại khoá lành mạnh, củng cố tinh thần/bản sắc lớp, và xây thành tích cho câu lạc bộ thể thao sinh viên để xin ngân sách lớn hơn các năm sau.</p>
     <p><strong>3. Yêu cầu cấp cao:</strong></p>
     <ul><li>Tổ chức vòng bảng round-robin rồi vòng loại trực tiếp, qua ít nhất 5 môn (bóng đá, cầu lông, bóng chuyền, bóng bàn, e-sports), giữa các đội lớp, trong 2 tuần.</li>
     <li>Cung cấp cập nhật điểm số/bảng đấu trực tiếp truy cập online để sinh viên theo dõi bảng xếp hạng mà không cần có mặt trực tiếp mọi trận.</li></ul>`,
  ),
  rubric: [
    { id: 'project_name', criterion: B('Gives a clear, specific project name.', 'Đặt tên dự án rõ ràng, cụ thể.'), weight: 1, maxScore: 0.3 },
    { id: 'justification', criterion: B('Explains a coherent purpose/justification, not just restating the task.', 'Giải thích lý do mạch lạc, không chỉ chép lại đề.'), weight: 1, maxScore: 0.7 },
    { id: 'two_requirements', criterion: B('Provides at least 2 broad, high-level requirements describing what the project must do/provide.', 'Nêu ít nhất 2 yêu cầu cấp cao, mô tả tổng quát dự án cần làm/cung cấp gì.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 2 (20%):</strong> list at least five main cost/budget items for the project. For each cost item, provide: name, description, estimation, how to estimate (method/basis for estimation), and person in charge.</p>`,
    `<p><strong>Yêu cầu 2 (20%):</strong> liệt kê ít nhất 5 khoản chi phí/ngân sách chính. Mỗi khoản gồm: tên, mô tả, ước tính, cách ước tính (phương pháp/căn cứ), người phụ trách.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Venue/court rental</strong> — description: renting off-campus courts/fields for sports FU's own facilities can't fully cover across the 2-week window. Estimation: $800. How to estimate: external sports complex's published per-hour rate × estimated hours needed across all sports. Person in charge: Logistics Lead.</p>
     <p><strong>2. Referee/officiating fees</strong> — description: paying qualified referees to officiate each match fairly. Estimation: $600. How to estimate: number of scheduled matches × the standard per-match referee rate. Person in charge: Sports Coordinator.</p>
     <p><strong>3. Equipment &amp; supplies</strong> — description: balls, nets, scoreboards, and first-aid kits needed across all 5 sports. Estimation: $400. How to estimate: itemized quote gathered from a sports-equipment supplier. Person in charge: Logistics Lead.</p>
     <p><strong>4. Prizes &amp; trophies</strong> — description: trophies/medals for winning teams and MVP awards per sport. Estimation: $300. How to estimate: vendor catalog quote for the planned number of awards. Person in charge: Event Coordinator.</p>
     <p><strong>5. Marketing &amp; signage</strong> — description: banners, social-media promotion, and printed match schedules. Estimation: $150. How to estimate: print-shop quote for banners/schedules plus a fixed social-media boost budget. Person in charge: Marketing Lead.</p>
     <p><strong>6. Medical/first-aid staffing</strong> — description: on-site first-aid staff to cover injury risk during physical matches. Estimation: $250. How to estimate: the staffing agency's per-day rate × number of event days requiring coverage. Person in charge: Safety Officer.</p>`,
    `<p><strong>1. Thuê địa điểm/sân bãi</strong> — mô tả: thuê sân/bãi ngoài trường cho các môn cơ sở vật chất trường không đủ đáp ứng suốt 2 tuần. Ước tính: 800$. Cách ước tính: giá theo giờ công bố của khu thể thao ngoài × số giờ ước tính cần cho mọi môn. Người phụ trách: Logistics Lead.</p>
     <p><strong>2. Phí trọng tài</strong> — mô tả: trả trọng tài đủ chuyên môn điều hành công bằng từng trận. Ước tính: 600$. Cách ước tính: số trận đã lên lịch × mức phí trọng tài chuẩn mỗi trận. Người phụ trách: Sports Coordinator.</p>
     <p><strong>3. Thiết bị &amp; vật tư</strong> — mô tả: bóng, lưới, bảng điểm, túi sơ cứu cần cho cả 5 môn. Ước tính: 400$. Cách ước tính: báo giá chi tiết từ nhà cung cấp thiết bị thể thao. Người phụ trách: Logistics Lead.</p>
     <p><strong>4. Giải thưởng &amp; cúp</strong> — mô tả: cúp/huy chương cho đội thắng và giải MVP mỗi môn. Ước tính: 300$. Cách ước tính: báo giá catalogue nhà cung cấp theo số giải dự kiến. Người phụ trách: Event Coordinator.</p>
     <p><strong>5. Marketing &amp; biển hiệu</strong> — mô tả: băng rôn, quảng bá mạng xã hội, lịch thi đấu in. Ước tính: 150$. Cách ước tính: báo giá xưởng in băng rôn/lịch cộng ngân sách boost mạng xã hội cố định. Người phụ trách: Marketing Lead.</p>
     <p><strong>6. Nhân sự y tế/sơ cứu</strong> — mô tả: nhân viên sơ cứu tại chỗ phòng rủi ro chấn thương trong các trận vận động mạnh. Ước tính: 250$. Cách ước tính: giá theo ngày của đơn vị nhân sự × số ngày sự kiện cần bao phủ. Người phụ trách: Safety Officer.</p>`,
  ),
  rubric: [
    { id: 'five_items', criterion: B('Lists at least 5 distinct, realistic cost items relevant to a multi-sport tournament.', 'Nêu đủ ít nhất 5 khoản chi phí khác nhau, thực tế, gắn với giải đấu đa môn.'), weight: 1, maxScore: 0.7 },
    { id: 'complete_fields', criterion: B('Each item includes name, description, estimation, a stated estimating method, and person in charge — all 5 required fields.', 'Mỗi khoản có đủ 5 mục yêu cầu: tên, mô tả, ước tính, cách ước tính, người phụ trách.'), weight: 1, maxScore: 1.3 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 (30%):</strong> build a communication plan for the project in which you: (1) define at least three stakeholders (one project-internal, one organization-internal, and one external stakeholder); (2) create a communication plan for those stakeholders that includes: information to communicate, purpose, frequency, method or format, and responsible party.</p>`,
    `<p><strong>Yêu cầu 3 (30%):</strong> xây kế hoạch giao tiếp: (1) xác định ít nhất 3 bên liên quan (1 nội bộ dự án, 1 nội bộ tổ chức, 1 bên ngoài); (2) tạo kế hoạch giao tiếp gồm: thông tin cần truyền đạt, mục đích, tần suất, phương thức/định dạng, người phụ trách.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Stakeholder 1 — Team captains (project-internal):</strong></p>
     <ul><li>Information: match schedule and live bracket/standings updates. Purpose: ensure teams show up on time and know exactly where they stand. Frequency: daily during the 2-week tournament. Method/format: a shared group-chat app. Responsible: Sports Coordinator.</li></ul>
     <p><strong>Stakeholder 2 — Student Affairs Office/sponsor (organization-internal):</strong></p>
     <ul><li>Information: weekly progress report — registration numbers, budget spend to date, any incident reports (injuries, disputes). Purpose: keep the sponsor informed and secure continued support (e.g. approving the venue booking, releasing budget). Frequency: weekly. Method/format: a written status report plus a short review meeting. Responsible: Event Coordinator.</li></ul>
     <p><strong>Stakeholder 3 — External venue/equipment vendor (external):</strong></p>
     <ul><li>Information: booking confirmations and any schedule changes affecting court/field access. Purpose: keep logistics running smoothly and avoid last-minute access conflicts. Frequency: at initial booking and ad hoc whenever a schedule change is needed. Method/format: email, with a phone call for anything urgent. Responsible: Logistics Lead.</li></ul>`,
    `<p><strong>Bên liên quan 1 — Đội trưởng các lớp (nội bộ dự án):</strong></p>
     <ul><li>Thông tin: lịch thi đấu và cập nhật bảng đấu/xếp hạng trực tiếp. Mục đích: đảm bảo các đội có mặt đúng giờ và biết rõ vị trí của mình. Tần suất: hằng ngày suốt 2 tuần giải đấu. Phương thức/định dạng: nhóm chat chung. Người phụ trách: Sports Coordinator.</li></ul>
     <p><strong>Bên liên quan 2 — Phòng Công tác Sinh viên/nhà tài trợ (nội bộ tổ chức):</strong></p>
     <ul><li>Thông tin: báo cáo tiến độ hằng tuần — số đăng ký, chi tiêu ngân sách tới hiện tại, báo cáo sự cố (chấn thương, tranh chấp). Mục đích: giữ nhà tài trợ nắm thông tin và duy trì hỗ trợ (VD duyệt đặt địa điểm, giải ngân). Tần suất: hằng tuần. Phương thức/định dạng: báo cáo văn bản + họp review ngắn. Người phụ trách: Event Coordinator.</li></ul>
     <p><strong>Bên liên quan 3 — Nhà cung cấp địa điểm/thiết bị bên ngoài (bên ngoài):</strong></p>
     <ul><li>Thông tin: xác nhận đặt chỗ và thay đổi lịch ảnh hưởng quyền dùng sân/bãi. Mục đích: giữ hậu cần trơn tru, tránh xung đột truy cập phút chót. Tần suất: lúc đặt ban đầu và bất kỳ khi cần đổi lịch. Phương thức/định dạng: email, gọi điện với việc khẩn. Người phụ trách: Logistics Lead.</li></ul>`,
  ),
  rubric: [
    { id: 'three_stakeholder_types', criterion: B('Correctly identifies exactly the 3 required stakeholder categories: project-internal, organization-internal, external.', 'Xác định đúng đủ 3 loại bên liên quan yêu cầu: nội bộ dự án, nội bộ tổ chức, bên ngoài.'), weight: 1, maxScore: 1 },
    { id: 'complete_comm_fields', criterion: B('Each stakeholder\'s communication plan includes all 5 required fields: information, purpose, frequency, method/format, responsible.', 'Kế hoạch giao tiếp mỗi bên có đủ 5 mục yêu cầu: thông tin, mục đích, tần suất, phương thức/định dạng, người phụ trách.'), weight: 1, maxScore: 1.5 },
    { id: 'context_relevance', criterion: B('Communications are genuinely relevant to this sports-tournament project, not generic filler.', 'Nội dung giao tiếp thực sự gắn với dự án giải đấu thể thao này, không chung chung.'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 4 (30%):</strong> give at least three main project milestones; choose one of those milestones and determine at least ten activities with their sequences/relationships (FS, SS, SF, FF) to complete that milestone.</p>`,
    `<p><strong>Yêu cầu 4 (30%):</strong> nêu ít nhất 3 mốc dự án chính; chọn 1 mốc và xác định ít nhất 10 hoạt động với trình tự/quan hệ (FS, SS, SF, FF) để hoàn thành mốc đó.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Three main milestones:</strong></p>
     <ol><li>Registration &amp; team formation complete — every participating class has submitted a roster for each of the 5 sports.</li>
     <li>Group-stage (round-robin) matches complete — every team has played every scheduled group match across all sports.</li>
     <li>Knockout stage, finals &amp; closing ceremony complete (project end) — champions decided, awards given, event closed out.</li></ol>
     <p><strong>Selected milestone: "Group-stage (round-robin) matches complete."</strong> Activities and sequencing:</p>
     <ol><li>A1 — Finalize the match schedule/bracket. (start of the chain)</li>
     <li>A2 — Confirm court/field bookings for all group-stage dates. Relationship: <b>FS</b> after A1 (bookings depend on knowing the final schedule).</li>
     <li>A3 — Confirm referees assigned per match. Relationship: <b>SS</b> with A2 (referee assignment can start the moment the schedule is final, in parallel with booking confirmation).</li>
     <li>A4 — Publish the schedule to team captains. Relationship: <b>FS</b> after both A2 and A3 (don't publish until both venue and referees are actually confirmed).</li>
     <li>A5 — Play round-1 matches. Relationship: <b>FS</b> after A4.</li>
     <li>A6 — Update the live scoring/bracket system with round-1 results. Relationship: <b>SS</b> with A5 (scores get entered as each match finishes, running alongside the round itself).</li>
     <li>A7 — Play round-2 matches. Relationship: <b>FS</b> after both A5 and A6 (round 2 needs round 1 finished and its results properly recorded, since some seeding may depend on it).</li>
     <li>A8 — Update the scoring/bracket system for round 2. Relationship: <b>SS</b> with A7.</li>
     <li>A9 — Play round-3 (final round-robin) matches. Relationship: <b>FS</b> after both A7 and A8.</li>
     <li>A10 — Update the scoring/bracket system for round 3. Relationship: <b>SS</b> with A9.</li>
     <li>A11 — Compile final group-stage standings. Relationship: <b>FS</b> after both A9 and A10.</li>
     <li>A12 — Resolve any match disputes/protests. Relationship: <b>FF</b> with A11 (the milestone only finishes once any open disputes are closed, together with the standings compilation, not strictly before or after it).</li></ol>
     <p><i>Note: no genuine Start-to-Finish (SF) relationship is used, as none of this workflow's real dependencies are Start-to-Finish in nature — SF is rare in practice, and forcing one in would misrepresent the actual dependency rather than reflect it.</i></p>`,
    `<p><strong>3 mốc dự án chính:</strong></p>
     <ol><li>Đăng ký &amp; lập đội xong — mọi lớp tham gia đã nộp danh sách đội cho cả 5 môn.</li>
     <li>Vòng bảng (round-robin) xong — mọi đội đã đấu hết trận vòng bảng đã lên lịch ở mọi môn.</li>
     <li>Vòng loại trực tiếp, chung kết &amp; lễ bế mạc xong (kết thúc dự án) — đã có nhà vô địch, trao giải, kết thúc sự kiện.</li></ol>
     <p><strong>Mốc được chọn: "Vòng bảng (round-robin) xong".</strong> Hoạt động và trình tự:</p>
     <ol><li>A1 — Chốt lịch thi đấu/bảng đấu. (đầu chuỗi)</li>
     <li>A2 — Xác nhận đặt sân/bãi cho mọi ngày vòng bảng. Quan hệ: <b>FS</b> sau A1 (đặt chỗ phụ thuộc lịch cuối cùng đã biết).</li>
     <li>A3 — Xác nhận trọng tài phân công từng trận. Quan hệ: <b>SS</b> với A2 (phân công trọng tài bắt đầu ngay khi lịch chốt, song song đặt sân).</li>
     <li>A4 — Công bố lịch cho đội trưởng các lớp. Quan hệ: <b>FS</b> sau cả A2 và A3 (chưa công bố khi sân và trọng tài chưa thực sự xác nhận).</li>
     <li>A5 — Đấu trận vòng 1. Quan hệ: <b>FS</b> sau A4.</li>
     <li>A6 — Cập nhật hệ thống điểm/bảng đấu trực tiếp với kết quả vòng 1. Quan hệ: <b>SS</b> với A5 (điểm nhập ngay khi mỗi trận xong, chạy song song với vòng đấu).</li>
     <li>A7 — Đấu trận vòng 2. Quan hệ: <b>FS</b> sau cả A5 và A6 (vòng 2 cần vòng 1 xong và kết quả đã ghi đúng, vì hạt giống có thể phụ thuộc nó).</li>
     <li>A8 — Cập nhật hệ thống điểm/bảng đấu vòng 2. Quan hệ: <b>SS</b> với A7.</li>
     <li>A9 — Đấu trận vòng 3 (vòng bảng cuối). Quan hệ: <b>FS</b> sau cả A7 và A8.</li>
     <li>A10 — Cập nhật hệ thống điểm/bảng đấu vòng 3. Quan hệ: <b>SS</b> với A9.</li>
     <li>A11 — Tổng hợp bảng xếp hạng vòng bảng cuối cùng. Quan hệ: <b>FS</b> sau cả A9 và A10.</li>
     <li>A12 — Giải quyết khiếu nại/tranh chấp trận đấu (nếu có). Quan hệ: <b>FF</b> với A11 (mốc chỉ xong khi mọi tranh chấp còn mở đã đóng, cùng lúc với tổng hợp bảng xếp hạng, không nhất thiết trước hay sau).</li></ol>
     <p><i>Lưu ý: không dùng quan hệ Start-to-Finish (SF) thật vì không có phụ thuộc thật nào của quy trình này mang bản chất Start-to-Finish — SF vốn hiếm trong thực tế, ép dùng sẽ phản ánh sai phụ thuộc thay vì đúng.</i></p>`,
  ),
  explanation: B(
    `<p>No source solution existed for this request. Sequencing was reasoned from first principles of a realistic multi-round tournament workflow, using FS/SS/FF where each genuinely applies and explicitly declining to fabricate an SF relationship.</p>`,
    `<p>Đề này không có solution nguồn cho yêu cầu này. Trình tự được suy luận từ nguyên lý gốc của quy trình giải đấu nhiều vòng thực tế, dùng FS/SS/FF ở đúng chỗ áp dụng thật và cố tình không bịa ra quan hệ SF.</p>`,
  ),
  rubric: [
    { id: 'three_milestones', criterion: B('Provides at least 3 distinct, meaningful project milestones.', 'Nêu ít nhất 3 mốc dự án khác nhau, có ý nghĩa.'), weight: 1, maxScore: 0.6 },
    { id: 'ten_activities', criterion: B('Determines at least 10 distinct, realistic activities to complete the chosen milestone.', 'Xác định ít nhất 10 hoạt động khác nhau, thực tế để hoàn thành mốc đã chọn.'), weight: 1, maxScore: 1 },
    { id: 'sequencing_relationships', criterion: B('Each activity has a stated, logically correct sequencing relationship (FS/SS/SF/FF) that genuinely reflects real dependency — not force-fit or contradictory.', 'Mỗi hoạt động có quan hệ trình tự (FS/SS/SF/FF) nêu rõ, đúng logic, phản ánh đúng phụ thuộc thật — không gượng ép hay mâu thuẫn.'), weight: 1, maxScore: 1.4 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE18',
    title: 'PMG201c – Practical Exam 2 (Summer 2025, Retake), Open Project Choice|||PMG201c – Thi thực hành 2 (Summer 2025, Retake), Tự chọn dự án',
    description: 'PMG201c PE (WRITE), open-ended: project charter, cost/budget items, communication plan, milestone activity sequencing (FS/SS/SF/FF) — AI-graded.|||PE PMG201c (viết), đề MỞ: charter dự án, khoản mục chi phí/ngân sách, kế hoạch giao tiếp, trình tự hoạt động theo mốc (FS/SS/SF/FF) — chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
