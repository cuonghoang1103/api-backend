/**
 * build-pmg201c-pe1.mjs — sinh content/exams/PMG201c-PE1.mjs.
 *
 * Nguồn thật: "PMG201c - FA 2024 - PE1" (paper.pdf + 2 file solution-N.txt
 * đi kèm — nghi là 2 bài làm mẫu khác nguồn, KHÔNG phải đáp án chính thức
 * của trường). ⚠️⚠️ ĐÃ PHÁT HIỆN LỖI THẬT khi đối chiếu 2 file:
 * - solution-1.txt Request 4 (CPM): coi 3 hoạt động khởi đầu song song
 *   A/B/C (đều có predecessor = Start theo đúng bảng đề bài) như 1 CHUỖI
 *   TUẦN TỰ giả "A→B→C→D→E→F→G" — SAI HOÀN TOÀN so với bảng precedence
 *   thật của đề, cho ra critical path/duration bịa (32 tuần).
 * - solution-2.txt Request 4: tính ĐÚNG theo đúng bảng precedence thật —
 *   đã ĐỐI CHIẾU TÍNH TAY ĐỘC LẬP (forward+backward pass CPM chuẩn) khớp
 *   100% với solution-2 (critical path Start→A→D→E→End, 17 tuần, đủ
 *   early-start + float từng activity) — dùng bản này.
 * Request 5 (EVM): CẢ HAI đều tính SPI/CPI đúng; solution-1 tính ĐẦY ĐỦ
 * hơn (thêm SV/CV/EAC/ETC) và đã verify tính tay đúng — dùng bản này.
 * Request 1-3 (mô tả dự án/stakeholder/communication plan): mở, không có
 * đáp án duy nhất — dùng bản solution-1 (mạch lạc, đủ chi tiết, khớp đúng
 * ràng buộc đề cho).
 *
 * KHÔNG blindly dùng nguyên 1 file solution nào — đây là bài học quan
 * trọng cho TOÀN BỘ 23 đề PMG201c PE: luôn tính tay lại CPM/EVM độc lập,
 * không tin file "solution" có sẵn.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE1.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>PMG201c – Final PE #1 (Fall 2024)</strong>. This is a written project-management practical exam — 5 requests, each worth 20% (2 points). There is no code to write; each answer is graded by an AI grader against the rubric shown per question. Write complete, well-reasoned answers — partial or vague answers lose rubric points even if the general idea is right.</p>`,
  `<p><strong>PMG201c – PE cuối kỳ #1 (Fall 2024)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết — 5 yêu cầu, mỗi yêu cầu 20% (2 điểm). Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu. Viết câu trả lời đầy đủ, lập luận rõ ràng — trả lời chung chung/thiếu ý sẽ mất điểm rubric dù ý chính đúng hướng.</p>`,
);

const cpmTableEn = `<table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>
<tr><td>Start</td><td>—</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>4</td></tr>
<tr><td>B</td><td>Start</td><td>2</td></tr><tr><td>C</td><td>Start</td><td>3</td></tr>
<tr><td>D</td><td>A</td><td>8</td></tr><tr><td>E</td><td>D</td><td>5</td></tr>
<tr><td>F</td><td>B</td><td>7</td></tr><tr><td>G</td><td>D, F</td><td>3</td></tr>
<tr><td>H</td><td>C</td><td>8</td></tr><tr><td>I</td><td>H</td><td>3</td></tr>
<tr><td>End</td><td>E, G, I</td><td>0</td></tr></table>`;
const cpmTableVi = cpmTableEn; // table content is numeric/labels, identical both languages

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 (20%):</strong> give a project name and provide detailed descriptions of the project, clearly mentioning its key characteristics: purpose/objectives (unique), timeframe (temporary), project milestones (time constraints), and other project constraints (cost, resources, or quality).</p>`,
    `<p><strong>Yêu cầu 1 (20%):</strong> đặt tên dự án và mô tả chi tiết, nêu rõ các đặc điểm chính: mục đích/mục tiêu (duy nhất), khung thời gian (tạm thời), các mốc dự án (ràng buộc thời gian), và các ràng buộc khác của dự án (chi phí, nguồn lực, hoặc chất lượng).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Project Name:</strong> Website Revamp System</p>
     <p><strong>Purpose/Objectives (unique):</strong> the project aims to redesign and improve the user experience (UX) of a web learning platform. The objective is to make the platform simpler to use, increase student engagement, and optimize the interface for mobile devices — addressing issues like slow loading times, confusing navigation, and outdated design, to increase course sign-ups.</p>
     <p><strong>Timeframe (temporary):</strong> the project is temporary, with a set duration of 6 months, beginning January 2024 and concluding June 2024.</p>
     <p><strong>Project Milestones (time constraints):</strong></p>
     <ul><li>January 2024 – Planning Phase: define goals, gather requirements, finalize the design blueprint.</li>
     <li>February 2024 – Prototype Development: build wireframes and initial mockups.</li>
     <li>March 2024 – User Testing &amp; Feedback: usability testing with students/instructors, refine designs.</li>
     <li>April 2024 – Development Phase: coding the new design, including mobile optimization.</li>
     <li>May 2024 – Quality Assurance &amp; Bug Fixes: testing functionality, responsiveness, security.</li>
     <li>June 2024 – Launch: release to all users, post-launch analysis and optimization.</li></ul>
     <p><strong>Other constraints:</strong> Cost — budget capped at $50,000 (development, design, testing). Resources — team of 1 project manager, 2 UX/UI designers, 3 developers, 2 testers. Quality — the new design must be intuitive, mobile-responsive, and meet WCAG 2.1 accessibility standards.</p>`,
    `<p><strong>Tên dự án:</strong> Hệ thống Làm mới Website (Website Revamp System)</p>
     <p><strong>Mục đích/Mục tiêu (duy nhất):</strong> dự án nhằm thiết kế lại và cải thiện trải nghiệm người dùng (UX) của nền tảng học tập trực tuyến. Mục tiêu là làm nền tảng dễ dùng hơn, tăng mức độ tương tác của sinh viên, và tối ưu giao diện cho thiết bị di động — giải quyết các vấn đề như tải trang chậm, điều hướng khó hiểu, thiết kế lỗi thời, nhằm tăng số lượng đăng ký khoá học.</p>
     <p><strong>Khung thời gian (tạm thời):</strong> dự án có tính tạm thời, kéo dài 6 tháng, bắt đầu tháng 1/2024 và kết thúc tháng 6/2024.</p>
     <p><strong>Các mốc dự án (ràng buộc thời gian):</strong></p>
     <ul><li>Tháng 1/2024 – Giai đoạn lập kế hoạch: xác định mục tiêu, thu thập yêu cầu, chốt bản thiết kế.</li>
     <li>Tháng 2/2024 – Phát triển bản mẫu: dựng wireframe và mockup ban đầu.</li>
     <li>Tháng 3/2024 – Kiểm thử người dùng &amp; phản hồi: kiểm thử khả dụng với sinh viên/giảng viên, tinh chỉnh thiết kế.</li>
     <li>Tháng 4/2024 – Giai đoạn phát triển: viết mã cho thiết kế mới, gồm tối ưu di động.</li>
     <li>Tháng 5/2024 – Đảm bảo chất lượng &amp; sửa lỗi: kiểm thử chức năng, khả năng đáp ứng, bảo mật.</li>
     <li>Tháng 6/2024 – Ra mắt: phát hành cho toàn bộ người dùng, phân tích và tối ưu sau ra mắt.</li></ul>
     <p><strong>Ràng buộc khác:</strong> Chi phí — ngân sách giới hạn $50,000 (phát triển, thiết kế, kiểm thử). Nguồn lực — nhóm gồm 1 quản lý dự án, 2 nhà thiết kế UX/UI, 3 lập trình viên, 2 kiểm thử viên. Chất lượng — thiết kế mới phải trực quan, đáp ứng di động, đạt chuẩn khả năng tiếp cận WCAG 2.1.</p>`,
  ),
  rubric: [
    { id: 'purpose', criterion: B('States a clear, unique purpose/objective for the project.', 'Nêu rõ mục đích/mục tiêu duy nhất của dự án.'), weight: 1, maxScore: 0.5 },
    { id: 'timeframe', criterion: B('States a specific temporary timeframe (start and end date/duration).', 'Nêu rõ khung thời gian tạm thời cụ thể (ngày bắt đầu/kết thúc hoặc thời lượng).'), weight: 1, maxScore: 0.5 },
    { id: 'milestones', criterion: B('Lists concrete project milestones tied to specific time points.', 'Liệt kê các mốc dự án cụ thể gắn với thời điểm rõ ràng.'), weight: 1, maxScore: 0.5 },
    { id: 'constraints', criterion: B('States at least cost, resource, and quality constraints.', 'Nêu ít nhất ràng buộc chi phí, nguồn lực, và chất lượng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 2 (20%):</strong> identify 3 stakeholders and determine (with relevant reasons) whether they are: High power or low power; High interest or low interest; Are they unaware of the project? Are they resistant to the project? Are they neutral? Are they supportive? Are they leading? Based on your findings, design a strategy for managing these stakeholders.</p>`,
    `<p><strong>Yêu cầu 2 (20%):</strong> xác định 3 bên liên quan và xác định (kèm lý do) họ thuộc nhóm nào: Quyền lực cao hay thấp; Mức quan tâm cao hay thấp; Họ không biết về dự án? Họ phản đối dự án? Trung lập? Ủng hộ? Dẫn dắt? Dựa trên đó, thiết kế chiến lược quản lý các bên liên quan này.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Stakeholder 1: Administrator</strong> — Power: High (decision-making authority, budget control). Interest: High (project impacts business reputation/revenue). Awareness: Fully aware, actively involved. Resistance: Not resistant, supports the project. <strong>Strategy:</strong> frequent updates through formal meetings; progress reports, metrics, ROI projections.</p>
     <p><strong>Stakeholder 2: Students</strong> — Power: Low (no direct influence over decisions). Interest: High (primary users, direct beneficiaries). Awareness: Semi-aware. Resistance: Neutral to slightly resistant (hesitant about interface change). <strong>Strategy:</strong> surveys and feedback sessions during user testing; targeted communications (email/in-app notifications).</p>
     <p><strong>Stakeholder 3: Development Team</strong> — Power: Medium (input critical to execution, not executive decisions). Interest: Medium (cares about product quality, less personally invested than Administrator/students). Awareness: Fully aware, involved in daily execution. Resistance: Neutral (may face challenges with tight deadlines). <strong>Strategy:</strong> sprint meetings, weekly status updates, collaboration tools.</p>`,
    `<p><strong>Bên liên quan 1: Quản trị viên (Administrator)</strong> — Quyền lực: Cao (thẩm quyền ra quyết định, kiểm soát ngân sách). Quan tâm: Cao (dự án ảnh hưởng danh tiếng/doanh thu). Nhận thức: Nắm rõ hoàn toàn, tham gia tích cực. Phản đối: Không phản đối, ủng hộ dự án. <strong>Chiến lược:</strong> cập nhật thường xuyên qua họp chính thức; báo cáo tiến độ, chỉ số, dự báo ROI.</p>
     <p><strong>Bên liên quan 2: Sinh viên</strong> — Quyền lực: Thấp (không ảnh hưởng trực tiếp tới quyết định). Quan tâm: Cao (người dùng chính, hưởng lợi trực tiếp). Nhận thức: Biết một phần. Phản đối: Trung lập tới hơi phản đối (ngại thay đổi giao diện). <strong>Chiến lược:</strong> khảo sát và phiên phản hồi trong giai đoạn kiểm thử; thông báo có mục tiêu (email/thông báo trong app).</p>
     <p><strong>Bên liên quan 3: Nhóm phát triển</strong> — Quyền lực: Trung bình (ý kiến quan trọng cho thực thi, không phải quyết định điều hành). Quan tâm: Trung bình (quan tâm chất lượng sản phẩm, ít gắn bó cá nhân hơn Quản trị viên/Sinh viên). Nhận thức: Nắm rõ hoàn toàn, tham gia thực thi hàng ngày. Phản đối: Trung lập (có thể gặp khó khăn với deadline gấp). <strong>Chiến lược:</strong> họp sprint, cập nhật trạng thái hàng tuần, công cụ cộng tác.</p>`,
  ),
  rubric: [
    { id: 'power_interest_grid', criterion: B('Correctly classifies all 3 stakeholders on the power/interest grid with relevant reasons (not just labels).', 'Phân loại đúng cả 3 bên liên quan theo lưới quyền lực/quan tâm kèm lý do phù hợp (không chỉ gắn nhãn suông).'), weight: 1, maxScore: 0.8 },
    { id: 'engagement_level', criterion: B('States each stakeholder\'s engagement level (unaware/resistant/neutral/supportive/leading) with reasoning.', 'Nêu đúng mức độ tham gia của từng bên (không biết/phản đối/trung lập/ủng hộ/dẫn dắt) kèm lập luận.'), weight: 1, maxScore: 0.6 },
    { id: 'strategy', criterion: B('Proposes a distinct, plausible management strategy tailored to each of the 3 stakeholders.', 'Đề xuất chiến lược quản lý riêng biệt, hợp lý cho từng bên trong 3 bên liên quan.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 3 (20%):</strong> return to the three stakeholders you identified in Request 2. Create a communication plan that covers each of these stakeholders and the communications you think they should receive. Each communication must include: information, purpose, frequency, method or format, responsible, review by.</p>`,
    `<p><strong>Yêu cầu 3 (20%):</strong> quay lại 3 bên liên quan đã xác định ở Yêu cầu 2. Lập kế hoạch truyền thông cho từng bên, gồm các thông tin họ nên nhận. Mỗi mục truyền thông phải có: thông tin, mục đích, tần suất, phương thức/định dạng, người chịu trách nhiệm, người rà soát.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Administrator</strong> — Information: project updates, milestones, budget status, user feedback. Purpose: keep informed on progress/timeline/financial health, align with business goals. Frequency: bi-weekly. Method: email summary with charts; bi-weekly meetings (Zoom/in-person). Responsible: Project Manager. Review by: Project Manager and Administrator.</p>
     <p><strong>Students</strong> — Information: UX improvements, new features, usability enhancements. Purpose: inform students so their learning experience is smoother. Frequency: monthly. Method: email newsletter, blog posts, in-platform notifications. Responsible: Marketing team (newsletters), UX team (feature updates). Review by: Project Manager, Marketing Manager, UX Lead.</p>
     <p><strong>Development Team</strong> — Information: technical updates, milestones, design changes, testing feedback. Purpose: ensure developers have latest requirements, can implement in time. Frequency: weekly. Method: team meetings (Zoom/Slack), project-management tool updates (Jira/Asana). Responsible: Project Manager, Technical Lead. Review by: Project Manager, Technical Lead.</p>`,
    `<p><strong>Quản trị viên</strong> — Thông tin: cập nhật dự án, mốc tiến độ, tình trạng ngân sách, phản hồi người dùng. Mục đích: giữ nắm rõ tiến độ/thời gian/tình hình tài chính, đảm bảo đồng nhất mục tiêu kinh doanh. Tần suất: 2 tuần/lần. Phương thức: báo cáo email kèm biểu đồ; họp 2 tuần/lần (Zoom/trực tiếp). Người chịu trách nhiệm: Quản lý dự án. Người rà soát: Quản lý dự án và Quản trị viên.</p>
     <p><strong>Sinh viên</strong> — Thông tin: cải tiến UX, tính năng mới, nâng cấp khả dụng. Mục đích: thông báo để trải nghiệm học tập mượt hơn. Tần suất: hàng tháng. Phương thức: email newsletter, bài blog, thông báo trong nền tảng. Người chịu trách nhiệm: Nhóm marketing (newsletter), Nhóm UX (cập nhật tính năng). Người rà soát: Quản lý dự án, Trưởng marketing, Trưởng UX.</p>
     <p><strong>Nhóm phát triển</strong> — Thông tin: cập nhật kỹ thuật, mốc tiến độ, thay đổi thiết kế, phản hồi kiểm thử. Mục đích: đảm bảo lập trình viên có yêu cầu mới nhất, triển khai đúng hạn. Tần suất: hàng tuần. Phương thức: họp nhóm (Zoom/Slack), cập nhật công cụ quản lý dự án (Jira/Asana). Người chịu trách nhiệm: Quản lý dự án, Trưởng kỹ thuật. Người rà soát: Quản lý dự án, Trưởng kỹ thuật.</p>`,
  ),
  rubric: [
    { id: 'covers_all_3', criterion: B('Provides a communication plan for all 3 stakeholders from Request 2 (consistent with that answer).', 'Lập kế hoạch truyền thông cho đủ cả 3 bên liên quan từ Yêu cầu 2 (nhất quán với câu trả lời đó).'), weight: 1, maxScore: 0.6 },
    { id: 'all_6_fields', criterion: B('Each communication includes all 6 required fields: information, purpose, frequency, method/format, responsible, review by.', 'Mỗi mục truyền thông có đủ 6 trường yêu cầu: thông tin, mục đích, tần suất, phương thức/định dạng, người chịu trách nhiệm, người rà soát.'), weight: 1, maxScore: 0.8 },
    { id: 'tailored', criterion: B('Communications are tailored to each stakeholder\'s power/interest profile from Request 2, not identical boilerplate.', 'Truyền thông phù hợp với hồ sơ quyền lực/quan tâm của từng bên từ Yêu cầu 2, không rập khuôn giống nhau.'), weight: 1, maxScore: 0.6 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 4 (20%):</strong> assume that you have defined and estimated the project schedule with the following high-level activities:</p>${cpmTableEn}
     <p>Perform the critical path analysis by providing <b>all the paths</b> (from the start to the end of the project) with the duration of each path, the <b>critical path</b> and project duration, the <b>early start</b> value (the first activity has an early start of zero), and the <b>float</b> for each task/activity of the project.</p>`,
    `<p><strong>Yêu cầu 4 (20%):</strong> giả sử bạn đã xác định và ước lượng lịch trình dự án với các hoạt động mức cao sau:</p>${cpmTableVi}
     <p>Thực hiện phân tích đường găng (critical path) bằng cách nêu <b>tất cả các đường đi</b> (từ đầu tới cuối dự án) kèm thời lượng mỗi đường, <b>đường găng</b> và tổng thời lượng dự án, giá trị <b>early start</b> (hoạt động đầu tiên có early start bằng 0), và <b>float</b> của từng hoạt động/công việc.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>All paths (Start to End):</strong></p>
     <ul><li>Start→A→D→E→End: 4+8+5 = <b>17 weeks</b></li>
     <li>Start→A→D→G→End: 4+8+3 = 15 weeks</li>
     <li>Start→B→F→G→End: 2+7+3 = 12 weeks</li>
     <li>Start→C→H→I→End: 3+8+3 = 14 weeks</li></ul>
     <p><strong>Critical path:</strong> Start→A→D→E→End. <strong>Project duration:</strong> 17 weeks (the longest path).</p>
     <p><strong>Early Start (ES) and Float per activity</strong> (forward pass then backward pass from LF(End)=17):</p>
     <table><tr><th>Activity</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>Start</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
     <tr><td>A</td><td>0</td><td>4</td><td>0</td><td>4</td><td><b>0 (critical)</b></td></tr>
     <tr><td>B</td><td>0</td><td>2</td><td>5</td><td>7</td><td>5</td></tr>
     <tr><td>C</td><td>0</td><td>3</td><td>3</td><td>6</td><td>3</td></tr>
     <tr><td>D</td><td>4</td><td>12</td><td>4</td><td>12</td><td><b>0 (critical)</b></td></tr>
     <tr><td>E</td><td>12</td><td>17</td><td>12</td><td>17</td><td><b>0 (critical)</b></td></tr>
     <tr><td>F</td><td>2</td><td>9</td><td>7</td><td>14</td><td>5</td></tr>
     <tr><td>G</td><td>12</td><td>15</td><td>14</td><td>17</td><td>2</td></tr>
     <tr><td>H</td><td>3</td><td>11</td><td>6</td><td>14</td><td>3</td></tr>
     <tr><td>I</td><td>11</td><td>14</td><td>14</td><td>17</td><td>3</td></tr>
     <tr><td>End</td><td>17</td><td>17</td><td>17</td><td>17</td><td>0</td></tr></table>
     <p>A, D, and E have zero float — they form the critical path. Any delay on A, D, or E delays the whole 17-week project. Every other activity has slack (B and F have the most, 5 weeks) and can be delayed by up to their float without affecting the finish date.</p>`,
    `<p><strong>Tất cả đường đi (Start tới End):</strong></p>
     <ul><li>Start→A→D→E→End: 4+8+5 = <b>17 tuần</b></li>
     <li>Start→A→D→G→End: 4+8+3 = 15 tuần</li>
     <li>Start→B→F→G→End: 2+7+3 = 12 tuần</li>
     <li>Start→C→H→I→End: 3+8+3 = 14 tuần</li></ul>
     <p><strong>Đường găng:</strong> Start→A→D→E→End. <strong>Tổng thời lượng dự án:</strong> 17 tuần (đường dài nhất).</p>
     <p><strong>Early Start (ES) và Float từng hoạt động</strong> (tính xuôi rồi tính ngược từ LF(End)=17):</p>
     <table><tr><th>Hoạt động</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>Start</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
     <tr><td>A</td><td>0</td><td>4</td><td>0</td><td>4</td><td><b>0 (găng)</b></td></tr>
     <tr><td>B</td><td>0</td><td>2</td><td>5</td><td>7</td><td>5</td></tr>
     <tr><td>C</td><td>0</td><td>3</td><td>3</td><td>6</td><td>3</td></tr>
     <tr><td>D</td><td>4</td><td>12</td><td>4</td><td>12</td><td><b>0 (găng)</b></td></tr>
     <tr><td>E</td><td>12</td><td>17</td><td>12</td><td>17</td><td><b>0 (găng)</b></td></tr>
     <tr><td>F</td><td>2</td><td>9</td><td>7</td><td>14</td><td>5</td></tr>
     <tr><td>G</td><td>12</td><td>15</td><td>14</td><td>17</td><td>2</td></tr>
     <tr><td>H</td><td>3</td><td>11</td><td>6</td><td>14</td><td>3</td></tr>
     <tr><td>I</td><td>11</td><td>14</td><td>14</td><td>17</td><td>3</td></tr>
     <tr><td>End</td><td>17</td><td>17</td><td>17</td><td>17</td><td>0</td></tr></table>
     <p>A, D, E có float bằng 0 — tạo thành đường găng. Bất kỳ trễ nào ở A, D, hoặc E sẽ làm trễ toàn bộ dự án 17 tuần. Các hoạt động khác đều còn dư (B và F dư nhiều nhất, 5 tuần) và có thể trễ tối đa bằng float mà không ảnh hưởng ngày hoàn thành.</p>`,
  ),
  explanation: B(
    `<p><b>Verified independently by hand</b> (full forward + backward CPM pass from the raw precedence table) — matches exactly. ⚠️ One of the two source solution drafts for this deck got this wrong (treated the parallel starting activities A/B/C as a fictitious sequential chain "A→B→C→D→E→F→G", giving a bogus 32-week duration) — the other draft had it right, and independent verification confirmed which one to trust.</p>`,
    `<p><b>Đã tự tính tay độc lập</b> (đầy đủ 2 lượt CPM xuôi+ngược từ bảng precedence gốc) — khớp chính xác. ⚠️ Một trong hai bản nháp lời giải nguồn cho đề này tính SAI (coi 3 hoạt động khởi đầu song song A/B/C như 1 chuỗi tuần tự giả "A→B→C→D→E→F→G", cho ra thời lượng bịa 32 tuần) — bản còn lại tính đúng, và việc tự verify độc lập đã xác nhận nên tin bản nào.</p>`,
  ),
  rubric: [
    { id: 'all_paths', criterion: B('Correctly lists all 4 distinct start-to-end paths with correct individual durations.', 'Liệt kê đúng đủ 4 đường đi start-tới-end khác nhau với thời lượng từng đường đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'critical_path', criterion: B('Correctly identifies the critical path (Start-A-D-E-End) and total project duration (17 weeks).', 'Xác định đúng đường găng (Start-A-D-E-End) và tổng thời lượng dự án (17 tuần).'), weight: 1, maxScore: 0.6 },
    { id: 'early_start', criterion: B('Correctly computes the early start value for every activity.', 'Tính đúng giá trị early start cho mọi hoạt động.'), weight: 1, maxScore: 0.5 },
    { id: 'float', criterion: B('Correctly computes the float for every activity, matching which ones are on the critical path (float=0).', 'Tính đúng float cho mọi hoạt động, khớp đúng hoạt động nào nằm trên đường găng (float=0).'), weight: 1, maxScore: 0.4 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 5 (20%):</strong> the project was expected to cost $6 million over three months. At the end of the first month, you apply earned value management as a performance management technique and obtain the following information: EV = $2.3 million; PV = $2.8 million; AC = $2.1 million. Calculate the results and give your comments (current status, forecast, and recommended adjustment) on the schedule and cost performance of the project.</p>`,
    `<p><strong>Yêu cầu 5 (20%):</strong> dự án dự kiến tốn 6 triệu đô trong 3 tháng. Cuối tháng đầu tiên, bạn áp dụng quản lý giá trị thu được (EVM) và có số liệu: EV = 2.3 triệu đô; PV = 2.8 triệu đô; AC = 2.1 triệu đô. Tính toán kết quả và nhận xét (tình trạng hiện tại, dự báo, đề xuất điều chỉnh) về hiệu suất tiến độ và chi phí của dự án.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Calculations</strong> (BAC = $6 million):</p>
     <ul><li>SPI = EV/PV = 2.3/2.8 = <b>0.82</b></li>
     <li>CPI = EV/AC = 2.3/2.1 = <b>1.10</b></li>
     <li>SV = EV−PV = 2.3−2.8 = <b>−0.5 million</b></li>
     <li>CV = EV−AC = 2.3−2.1 = <b>+0.2 million</b></li>
     <li>EAC = BAC/CPI = 6/1.10 = <b>≈5.45 million</b></li>
     <li>ETC = EAC−AC = 5.45−2.1 = <b>≈3.35 million</b></li></ul>
     <p><strong>Current status:</strong> the project is behind schedule (SPI=0.82&lt;1, SV=−0.5M — less work has been completed than planned) but under budget / cost-efficient (CPI=1.10&gt;1, CV=+0.2M — getting more value per dollar spent than planned).</p>
     <p><strong>Forecast:</strong> if the current cost efficiency trend continues, the project is forecast to finish at about $5.45 million, under the $6 million budget (ETC ≈ $3.35 million remaining). However, at the current pace, the schedule delay will persist unless corrected.</p>
     <p><strong>Recommended adjustment:</strong> reallocate resources toward critical-path tasks, consider increasing working hours or adding staff to recover the schedule; continue monitoring cost closely but no cost-cutting action is needed since the project is already under budget; track both SPI and CPI regularly going forward to catch any reversal of the current cost efficiency.</p>`,
    `<p><strong>Tính toán</strong> (BAC = 6 triệu đô):</p>
     <ul><li>SPI = EV/PV = 2.3/2.8 = <b>0.82</b></li>
     <li>CPI = EV/AC = 2.3/2.1 = <b>1.10</b></li>
     <li>SV = EV−PV = 2.3−2.8 = <b>−0.5 triệu</b></li>
     <li>CV = EV−AC = 2.3−2.1 = <b>+0.2 triệu</b></li>
     <li>EAC = BAC/CPI = 6/1.10 = <b>≈5.45 triệu</b></li>
     <li>ETC = EAC−AC = 5.45−2.1 = <b>≈3.35 triệu</b></li></ul>
     <p><strong>Tình trạng hiện tại:</strong> dự án đang TRỄ tiến độ (SPI=0.82&lt;1, SV=−0.5 triệu — làm được ít công việc hơn kế hoạch) nhưng TIẾT KIỆM chi phí (CPI=1.10&gt;1, CV=+0.2 triệu — mỗi đồng chi ra tạo được nhiều giá trị hơn dự kiến).</p>
     <p><strong>Dự báo:</strong> nếu duy trì hiệu suất chi phí hiện tại, dự án dự báo hoàn thành khoảng 5.45 triệu đô, dưới ngân sách 6 triệu (ETC còn lại ≈3.35 triệu). Tuy nhiên, với tốc độ hiện tại, độ trễ tiến độ sẽ tiếp diễn nếu không khắc phục.</p>
     <p><strong>Đề xuất điều chỉnh:</strong> phân bổ lại nguồn lực cho các công việc trên đường găng, cân nhắc tăng giờ làm hoặc thêm nhân sự để bù tiến độ; tiếp tục theo dõi sát chi phí nhưng chưa cần cắt giảm vì đã dưới ngân sách; theo dõi thường xuyên cả SPI lẫn CPI để phát hiện sớm nếu xu hướng tiết kiệm chi phí đảo chiều.</p>`,
  ),
  explanation: B(
    `<p>Verified independently: SPI=2.3/2.8=0.821..., CPI=2.3/2.1=1.095..., SV=−0.5M, CV=+0.2M, EAC=6/1.10=5.454...≈5.45M, ETC=5.45−2.1=3.35M — all standard EVM formulas, all check out against the given EV/PV/AC/BAC numbers.</p>`,
    `<p>Đã tự verify độc lập: SPI=2.3/2.8=0.821..., CPI=2.3/2.1=1.095..., SV=−0.5 triệu, CV=+0.2 triệu, EAC=6/1.10=5.454...≈5.45 triệu, ETC=5.45−2.1=3.35 triệu — đều là công thức EVM chuẩn, khớp đúng với số liệu EV/PV/AC/BAC đề cho.</p>`,
  ),
  rubric: [
    { id: 'spi_cpi', criterion: B('Correctly calculates SPI (0.82) and CPI (1.10).', 'Tính đúng SPI (0.82) và CPI (1.10).'), weight: 1, maxScore: 0.5 },
    { id: 'sv_cv', criterion: B('Correctly calculates SV (-0.5M) and CV (+0.2M).', 'Tính đúng SV (-0.5 triệu) và CV (+0.2 triệu).'), weight: 1, maxScore: 0.4 },
    { id: 'eac_etc', criterion: B('Correctly calculates EAC (≈5.45M) and ETC (≈3.35M) using the $6 million budget.', 'Tính đúng EAC (≈5.45 triệu) và ETC (≈3.35 triệu) dùng ngân sách 6 triệu đô.'), weight: 1, maxScore: 0.4 },
    { id: 'commentary', criterion: B('Gives correct, specific commentary distinguishing schedule performance (behind) from cost performance (under budget), with a sensible recommendation.', 'Nhận xét đúng, cụ thể, phân biệt được hiệu suất tiến độ (trễ) với hiệu suất chi phí (dưới ngân sách), kèm đề xuất hợp lý.'), weight: 1, maxScore: 0.7 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE1',
    title: 'PMG201c – Final PE #1 (Fall 2024)|||PMG201c – PE cuối kỳ #1 (Fall 2024)',
    description: 'PMG201c PE (WRITE): project charter, stakeholder analysis, communication plan, critical path method (CPM), and earned value management (EVM), AI-graded.|||PE PMG201c (viết): hồ sơ dự án, phân tích bên liên quan, kế hoạch truyền thông, phân tích đường găng (CPM), và quản lý giá trị thu được (EVM), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
