/**
 * build-pmg201c-pe17.mjs — sinh content/exams/PMG201c-PE17.mjs.
 *
 * Nguồn thật: "PMG201c - SU25 - PE - 1" ("PMG201c - Practical Exam 1
 * (Summer 2025)"), đề MỞ — chọn 1 dự án từ môn học/hoạt động đại học,
 * hoặc dự án của người quen. Không có solution. Cùng khung Request như
 * PE11/PE12 (charter/mục tiêu/RACI/rủi ro) nhưng bối cảnh riêng: "FU
 * Career Fair" (hội chợ việc làm thường niên tại trường) — khác các dự
 * án phần mềm đã dùng ở PE13/PE14/PE16.
 *
 * Trọng số gốc: Req1=20%, Req2=20%, Req3=30%, Req4=30% → 2/2/3/3 (10đ).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE17.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE17.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context (open-ended — pick a project from university training subjects or university activities; the assumed project used in these sample answers is stated below):</b><p>Pick a project from the university training subjects or university activities that you are currently working on, have worked on in the past, or a relevant project from a friend/relative that you know about. <br/><b>Assumed project for these sample answers: "FU Career Fair 2025"</b> — an on-campus career fair connecting FU students directly with employers, organized by the Student Affairs Office/Career Center.</p></div>`,
  `<div class="pe-system"><b>Bối cảnh (đề MỞ — chọn 1 dự án từ môn học/hoạt động đại học; dự án giả định dùng trong các câu trả lời mẫu dưới đây được nêu rõ):</b><p>Chọn 1 dự án từ môn học hoặc hoạt động đại học bạn đang/đã làm, hoặc dự án của người quen bạn biết rõ. <br/><b>Dự án giả định dùng cho các câu trả lời mẫu: "FU Career Fair 2025"</b> — hội chợ việc làm tại trường kết nối trực tiếp sinh viên FU với nhà tuyển dụng, do Phòng Công tác Sinh viên/Career Center tổ chức.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Exam 1 (Summer 2025)</strong>. This is a written, open-ended project-management practical exam — you pick your own project. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành 1 (Summer 2025)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết, đề MỞ — bạn tự chọn dự án. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 (20%):</strong> write a narrative charter statement covering: (1) Project name; (2) Project purpose or justification (reasons to implement this project); (3) High level requirements — describe in broad terms what you want the project to do or provide; provide at least two of these.</p>`,
    `<p><strong>Yêu cầu 1 (20%):</strong> viết bản charter dạng tường thuật gồm: (1) Tên dự án; (2) Mục đích/lý do thực hiện; (3) Yêu cầu cấp cao — mô tả tổng quát dự án cần làm/cung cấp gì; nêu ít nhất 2 yêu cầu.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Project name:</strong> FU Career Fair 2025.</p>
     <p><strong>2. Purpose/justification:</strong> students need direct, in-person access to employers beyond what an online internship portal can offer — face-to-face impressions, on-the-spot interviews, and networking that build both placement rates and FU's employer relationships. An annual on-campus fair complements the existing digital process with something it structurally cannot replace.</p>
     <p><strong>3. High-level requirements:</strong></p>
     <ul><li>The event must host at least 30 participating employer booths on campus in a single day.</li>
     <li>The event must provide an on-site resume-review and mock-interview service staffed by Career Center volunteers, available to any attending student.</li></ul>`,
    `<p><strong>1. Tên dự án:</strong> FU Career Fair 2025.</p>
     <p><strong>2. Mục đích/lý do:</strong> sinh viên cần tiếp cận trực tiếp, gặp mặt nhà tuyển dụng vượt ngoài những gì cổng thực tập online cung cấp được — ấn tượng trực tiếp, phỏng vấn tại chỗ, kết nối xây cả tỉ lệ bố trí lẫn quan hệ nhà tuyển dụng của FU. Hội chợ thường niên tại trường bổ sung cho quy trình số hiện có bằng thứ nó không thể thay thế về mặt cấu trúc.</p>
     <p><strong>3. Yêu cầu cấp cao:</strong></p>
     <ul><li>Sự kiện phải có ít nhất 30 gian hàng nhà tuyển dụng tham gia tại trường trong 1 ngày.</li>
     <li>Sự kiện phải cung cấp dịch vụ review CV và phỏng vấn thử tại chỗ do tình nguyện viên Career Center phụ trách, mở cho mọi sinh viên tham dự.</li></ul>`,
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
    `<p><strong>Request 2 (20%):</strong> define measurable project objectives and their related success criteria — provide at least two project objectives and explain how each one of those objectives will be measured.</p>`,
    `<p><strong>Yêu cầu 2 (20%):</strong> xác định mục tiêu dự án đo được và tiêu chí thành công liên quan — nêu ít nhất 2 mục tiêu và giải thích cách đo từng mục tiêu.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Objective 1 — Attract at least 1,000 student attendees on the event day.</strong> Measurement: door check-in scans of student ID cards, counted live and totaled at end of day; success = total scans ≥ 1,000.</p>
     <p><strong>Objective 2 — Secure participation commitments from at least 30 employers.</strong> Measurement: signed employer-participation agreements tracked in a shared spreadsheet as they come in; success = 30 signed agreements confirmed by the registration deadline (2 weeks before the event).</p>
     <p><strong>Objective 3 — Deliver at least 50 completed on-the-spot mock-interview or resume-review sessions.</strong> Measurement: a sign-up/booking log at the Career Center booth, each session checked off when completed; success = 50 completed sessions logged by end of the event day.</p>`,
    `<p><strong>Mục tiêu 1 — Thu hút ít nhất 1.000 sinh viên tham dự trong ngày sự kiện.</strong> Đo: quét thẻ sinh viên check-in tại cửa, đếm trực tiếp và tổng hợp cuối ngày; thành công = tổng lượt quét ≥ 1.000.</p>
     <p><strong>Mục tiêu 2 — Đảm bảo cam kết tham gia từ ít nhất 30 nhà tuyển dụng.</strong> Đo: thoả thuận tham gia đã ký của nhà tuyển dụng theo dõi trong bảng tính dùng chung khi nhận được; thành công = 30 thoả thuận đã ký xác nhận trước hạn đăng ký (2 tuần trước sự kiện).</p>
     <p><strong>Mục tiêu 3 — Thực hiện ít nhất 50 buổi phỏng vấn thử/review CV tại chỗ hoàn thành.</strong> Đo: nhật ký đăng ký/đặt chỗ tại gian Career Center, mỗi buổi đánh dấu khi hoàn thành; thành công = 50 buổi hoàn thành ghi nhận tới cuối ngày sự kiện.</p>`,
  ),
  rubric: [
    { id: 'two_objectives', criterion: B('Provides at least 2 objectives, each specific and directly tied to the project.', 'Nêu đủ ít nhất 2 mục tiêu, mỗi cái cụ thể và gắn trực tiếp dự án.'), weight: 1, maxScore: 0.9 },
    { id: 'measurement_method', criterion: B('Each objective has a genuinely measurable success criterion with a stated measurement method.', 'Mỗi mục tiêu có tiêu chí thành công đo được thật, kèm phương pháp đo cụ thể.'), weight: 1, maxScore: 1.1 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 (30%):</strong> describe the RACI chart, in which you: (1) define at least three project roles; (2) list out at least ten tasks, activities, or deliverables; (3) for each task/activity/deliverable, list out the responsibilities of the project roles.</p>`,
    `<p><strong>Yêu cầu 3 (30%):</strong> mô tả bảng RACI: (1) xác định ít nhất 3 vai trò dự án; (2) liệt kê ít nhất 10 nhiệm vụ/hoạt động/sản phẩm bàn giao; (3) với mỗi nhiệm vụ, nêu trách nhiệm từng vai trò.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Roles:</strong> Event Coordinator (EC), Career Center Staff (CCS), Student Volunteers (SV), Marketing/Communications Lead (ML).</p>
     <table><tr><th>Task/Activity/Deliverable</th><th>EC</th><th>CCS</th><th>SV</th><th>ML</th></tr>
     <tr><td>1. Secure event venue booking</td><td>A</td><td>C</td><td>I</td><td>I</td></tr>
     <tr><td>2. Recruit/confirm employer participation</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>3. Design event floor plan/booth layout</td><td>R</td><td>C</td><td>I</td><td>I</td></tr>
     <tr><td>4. Promote the event to students</td><td>I</td><td>C</td><td>C</td><td>R</td></tr>
     <tr><td>5. Recruit and train student volunteers</td><td>A</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>6. Coordinate resume-review/mock-interview stations</td><td>I</td><td>R</td><td>C</td><td>I</td></tr>
     <tr><td>7. Set up check-in/registration system</td><td>A</td><td>I</td><td>R</td><td>I</td></tr>
     <tr><td>8. Produce signage &amp; event materials</td><td>I</td><td>I</td><td>C</td><td>R</td></tr>
     <tr><td>9. Run day-of event logistics</td><td>R</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>10. Post-event survey &amp; follow-up report</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>11. Track event budget</td><td>R</td><td>I</td><td>I</td><td>I</td></tr></table>
     <p><i>R=Responsible, A=Accountable, C=Consulted, I=Informed. Every row has exactly one A, and no cell is left ambiguous.</i></p>`,
    `<p><strong>Vai trò:</strong> Event Coordinator (EC), Career Center Staff (CCS), Sinh viên tình nguyện (SV), Marketing/Communications Lead (ML).</p>
     <table><tr><th>Nhiệm vụ/Hoạt động/Sản phẩm</th><th>EC</th><th>CCS</th><th>SV</th><th>ML</th></tr>
     <tr><td>1. Đặt địa điểm sự kiện</td><td>A</td><td>C</td><td>I</td><td>I</td></tr>
     <tr><td>2. Mời/xác nhận nhà tuyển dụng tham gia</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>3. Thiết kế sơ đồ mặt bằng/gian hàng</td><td>R</td><td>C</td><td>I</td><td>I</td></tr>
     <tr><td>4. Quảng bá sự kiện tới sinh viên</td><td>I</td><td>C</td><td>C</td><td>R</td></tr>
     <tr><td>5. Tuyển &amp; đào tạo sinh viên tình nguyện</td><td>A</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>6. Điều phối gian review CV/phỏng vấn thử</td><td>I</td><td>R</td><td>C</td><td>I</td></tr>
     <tr><td>7. Thiết lập hệ thống check-in/đăng ký</td><td>A</td><td>I</td><td>R</td><td>I</td></tr>
     <tr><td>8. Chuẩn bị biển hiệu &amp; tài liệu sự kiện</td><td>I</td><td>I</td><td>C</td><td>R</td></tr>
     <tr><td>9. Vận hành hậu cần ngày sự kiện</td><td>R</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>10. Khảo sát &amp; báo cáo sau sự kiện</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>11. Theo dõi ngân sách sự kiện</td><td>R</td><td>I</td><td>I</td><td>I</td></tr></table>
     <p><i>R=Chịu trách nhiệm thực hiện, A=Chịu trách nhiệm giải trình, C=Được tham vấn, I=Được thông báo. Mỗi dòng đúng 1 A, không ô nào mơ hồ.</i></p>`,
  ),
  rubric: [
    { id: 'three_roles', criterion: B('Defines at least 3 clear, distinct project roles relevant to organizing an on-campus career fair.', 'Xác định ít nhất 3 vai trò dự án rõ ràng, khác nhau, gắn với tổ chức hội chợ việc làm tại trường.'), weight: 1, maxScore: 0.6 },
    { id: 'ten_tasks', criterion: B('Lists at least 10 distinct, realistic tasks/activities/deliverables.', 'Liệt kê ít nhất 10 nhiệm vụ/hoạt động/sản phẩm khác nhau, thực tế.'), weight: 1, maxScore: 1 },
    { id: 'raci_assignment', criterion: B('Each task has a full RACI assignment across all roles, with exactly one Accountable per task and no ambiguous/missing cells.', 'Mỗi nhiệm vụ có đủ gán RACI cho mọi vai trò, đúng 1 người Accountable mỗi nhiệm vụ, không ô nào mơ hồ/thiếu.'), weight: 1, maxScore: 1.4 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 4 (30%):</strong> identify three project risks by listing the risk title/name, description, possible impacts (in terms of scope or quality, time, and cost), and relevant risk response plans (mitigation, contingency).</p>`,
    `<p><strong>Yêu cầu 4 (30%):</strong> xác định 3 rủi ro dự án, nêu tên/tiêu đề rủi ro, mô tả, tác động khả dĩ (phạm vi/chất lượng, thời gian, chi phí), và kế hoạch ứng phó (giảm thiểu, dự phòng).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Risk 1 — Low employer turnout:</strong> description: fewer employers than targeted commit to attending, leaving booths empty or the floor plan half-used. Impacts — Scope/Quality: directly breaches the "≥30 booths" requirement and weakens the student experience. Time: none directly. Cost: marketing and logistics spend already committed becomes partly wasted relative to the smaller turnout.<br/>Response: Mitigation — start employer outreach early with an early-bird incentive (discounted or free booth fee for the first 20 confirmed). Contingency — if turnout is still short close to the deadline, activate the FU alumni network to backfill booths with alumni-run companies.</p>
     <p><strong>Risk 2 — Venue unavailable or double-booked:</strong> description: the planned campus venue becomes unavailable on the target date due to a scheduling conflict. Impacts — Scope/Quality: none directly if resolved in time. Time: could force the event date to shift, disrupting the whole downstream schedule (marketing, employer confirmations). Cost: potential rebooking fees or wasted printed materials referencing the old date.<br/>Response: Mitigation — confirm the venue booking with a signed agreement as early as possible in planning. Contingency — have a pre-identified backup venue on campus ready to activate immediately if the primary falls through.</p>
     <p><strong>Risk 3 — Low student attendance:</strong> description: fewer than the targeted 1,000 students show up, despite employer turnout being fine. Impacts — Scope/Quality: directly breaches the attendance success criterion and undermines the value employers were promised. Time: none directly. Cost: none directly, though it risks damaging employer relationships for future years (a longer-term cost).<br/>Response: Mitigation — promote through multiple channels well in advance (social media, faculty class announcements, the LMS). Contingency — if early sign-up numbers trend low, add a same-day incentive (e.g. a raffle/giveaway for check-in) to boost walk-in attendance.</p>`,
    `<p><strong>Rủi ro 1 — Ít nhà tuyển dụng tham gia:</strong> mô tả: số nhà tuyển dụng cam kết tham gia ít hơn mục tiêu, để lại gian hàng trống hoặc sơ đồ mặt bằng chỉ dùng một nửa. Tác động — Phạm vi/Chất lượng: vi phạm trực tiếp yêu cầu "≥30 gian hàng" và làm yếu trải nghiệm sinh viên. Thời gian: không trực tiếp. Chi phí: chi marketing và hậu cần đã cam kết trở nên lãng phí một phần so với lượng tham gia nhỏ hơn.<br/>Ứng phó: Giảm thiểu — bắt đầu tiếp cận nhà tuyển dụng sớm với ưu đãi đăng ký sớm (giảm/miễn phí gian hàng cho 20 đơn vị xác nhận đầu tiên). Dự phòng — nếu gần hạn vẫn thiếu, kích hoạt mạng lưới cựu sinh viên FU để lấp đầy gian hàng bằng công ty do cựu sinh viên điều hành.</p>
     <p><strong>Rủi ro 2 — Địa điểm không sẵn sàng/trùng lịch:</strong> mô tả: địa điểm dự kiến trong trường không còn trống đúng ngày do trùng lịch. Tác động — Phạm vi/Chất lượng: không trực tiếp nếu xử lý kịp. Thời gian: có thể buộc dời ngày sự kiện, xáo trộn toàn bộ lịch phía sau (marketing, xác nhận nhà tuyển dụng). Chi phí: có thể phát sinh phí đặt lại chỗ hoặc lãng phí tài liệu in đã ghi ngày cũ.<br/>Ứng phó: Giảm thiểu — xác nhận đặt địa điểm bằng thoả thuận ký sớm nhất trong giai đoạn lập kế hoạch. Dự phòng — có sẵn địa điểm dự phòng trong trường, sẵn sàng kích hoạt ngay nếu địa điểm chính hỏng.</p>
     <p><strong>Rủi ro 3 — Ít sinh viên tham dự:</strong> mô tả: số sinh viên tới ít hơn mục tiêu 1.000, dù nhà tuyển dụng tham gia đủ. Tác động — Phạm vi/Chất lượng: vi phạm trực tiếp tiêu chí thành công về tham dự và làm giảm giá trị đã hứa với nhà tuyển dụng. Thời gian: không trực tiếp. Chi phí: không trực tiếp, nhưng có rủi ro hại quan hệ nhà tuyển dụng cho các năm sau (chi phí dài hạn).<br/>Ứng phó: Giảm thiểu — quảng bá qua nhiều kênh từ sớm (mạng xã hội, thông báo lớp học, LMS). Dự phòng — nếu số đăng ký sớm có xu hướng thấp, thêm ưu đãi ngay trong ngày (rút thăm trúng thưởng khi check-in) để tăng lượng khách vãng lai.</p>`,
  ),
  rubric: [
    { id: 'three_risks', criterion: B('Identifies 3 distinct, realistic risks with clear titles and descriptions.', 'Xác định 3 rủi ro khác nhau, thực tế, có tiêu đề và mô tả rõ.'), weight: 1, maxScore: 0.9 },
    { id: 'impact_dimensions', criterion: B('Each risk correctly analyzes impact across scope/quality, time, and cost (stating clearly when an impact is genuinely "none" for a dimension, not omitting it).', 'Mỗi rủi ro phân tích đúng tác động theo phạm vi/chất lượng, thời gian, và chi phí (nêu rõ khi thực sự "không có" tác động ở 1 chiều, không bỏ qua).'), weight: 1, maxScore: 1.2 },
    { id: 'response_plans', criterion: B('Each risk has both a mitigation plan and a contingency plan, both specific to the case, not generic.', 'Mỗi rủi ro có cả kế hoạch giảm thiểu và dự phòng, cụ thể theo tình huống đề, không chung chung.'), weight: 1, maxScore: 0.9 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE17',
    title: 'PMG201c – Practical Exam 1 (Summer 2025), Open Project Choice|||PMG201c – Thi thực hành 1 (Summer 2025), Tự chọn dự án',
    description: 'PMG201c PE (WRITE), open-ended: project charter, measurable objectives, RACI chart, risk register — AI-graded.|||PE PMG201c (viết), đề MỞ: charter dự án, mục tiêu đo được, bảng RACI, sổ rủi ro — chấm AI.',
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
