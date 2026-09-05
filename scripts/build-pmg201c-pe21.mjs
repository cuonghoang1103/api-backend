/**
 * build-pmg201c-pe21.mjs — sinh content/exams/PMG201c-PE21.mjs.
 *
 * Nguồn thật: "PMG201c - SU26 - PEHCM" ("PMG201c - Practical Exam", ảnh
 * 001.webp, kênh tin tức số cộng đồng đại học). ⚠️ Đề này có bối cảnh và
 * cấu trúc Request GIỐNG HỆT "PMG201c - FA25 - PE2" (đã dựng ở PE12) —
 * chỉ khác câu mở đầu diễn đạt lại ("The local media lacks coverage of
 * events relevant to..." thay vì "Local media outlets do not cover
 * events that matter to...", cùng ý nghĩa) và không ghi rõ kỳ/số Request
 * trong tiêu đề gốc. Đây là cùng 1 đề thi được tái sử dụng cho kỳ thi
 * SU26 tại campus HCM — nên tái dùng nguyên nội dung câu trả lời đã kiểm
 * chứng ở PE12 (dự án "Campus Pulse"), chỉ đổi tiêu đề/mã đề. Không có
 * solution. Không có CPM/EVM số học — Request 4 chỉ yêu cầu XÁC ĐỊNH
 * quan hệ trình tự (FS/SS/SF/FF), không tính ES/EF/LS/LF hay đường găng.
 * Trọng số gốc: Req1=20%, Req2=20%, Req3=30%, Req4=30% → 2/2/3/3 (10đ).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE21.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE21.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context:</b><p>The local media lacks coverage of events relevant to the university community. Your project is to establish a digital news channel (e.g., a weekly podcast or video series) focused exclusively on this niche. The project requires producing and distributing at least one high-quality piece of content per week and reaching a milestone of <b>500 unique subscribers/followers</b>. The continuous production cycle must be maintained for a <b>three-month period</b>. The total budget for promotional boosting and equipment is strictly <b>$500</b>, with the budget constraint that all software used for editing and production must be free or open-source. For quality, the content must maintain a high level of journalistic integrity, defined by receiving <b>zero verifiable complaints of factual inaccuracy</b> and ensuring that <b>95% of viewers/listeners complete the content</b> (low drop-off rate).</p></div>`,
  `<div class="pe-system"><b>Bối cảnh:</b><p>Truyền thông địa phương thiếu tin tức về sự kiện liên quan tới cộng đồng đại học. Dự án của bạn là xây một kênh tin tức số (ví dụ: podcast hoặc series video hằng tuần) chuyên biệt cho mảng này. Dự án yêu cầu sản xuất và phát hành ít nhất 1 nội dung chất lượng cao mỗi tuần và đạt mốc <b>500 người theo dõi/đăng ký duy nhất</b>. Chu kỳ sản xuất liên tục phải duy trì trong <b>3 tháng</b>. Ngân sách cho quảng bá và thiết bị bị giới hạn nghiêm ngặt ở <b>500 USD</b>, với ràng buộc mọi phần mềm biên tập/sản xuất phải miễn phí hoặc mã nguồn mở. Về chất lượng, nội dung phải giữ tính chính trực báo chí cao, định nghĩa bằng <b>zero khiếu nại xác minh được về sai lệch sự thật</b> và đảm bảo <b>95% người xem/nghe hoàn thành nội dung</b> (tỉ lệ bỏ giữa chừng thấp).</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Exam (Summer 2026, HCM Campus) — university-community digital news channel</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành (Summer 2026, HCM Campus) — kênh tin tức số cộng đồng đại học</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 (20%):</strong> write a narrative charter statement that covers: (1) Project name; (2) Justifications (purpose &amp; reasons to implement this project); (3) Project constraints, in terms of scope, time, cost/budget, and quality.</p>`,
    `<p><strong>Yêu cầu 1 (20%):</strong> viết bản charter dạng tường thuật gồm: (1) Tên dự án; (2) Lý do (mục đích &amp; lý do thực hiện); (3) Ràng buộc dự án theo phạm vi, thời gian, chi phí/ngân sách, chất lượng.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Project name:</strong> "Campus Pulse" — Weekly Digital News Channel for University-Community Events.</p>
     <p><strong>2. Justifications:</strong> local media outlets do not cover events that matter specifically to the university community, leaving a real information gap. This project fills that gap with a dedicated, niche digital news channel (podcast/video), building both community awareness and a track record that could later attract sponsorship or official university backing — but only if it can first prove sustained weekly production and real audience traction within a bounded 3-month trial.</p>
     <p><strong>3. Project constraints:</strong></p>
     <ul><li><b>Scope:</b> producing and distributing a weekly podcast/video series exclusively about university-community events — no general local news, no other formats beyond what's needed to hit the objectives below.</li>
     <li><b>Time:</b> a continuous 3-month production cycle with zero missed weekly releases.</li>
     <li><b>Cost/Budget:</b> total spend on promotional boosting and equipment strictly capped at $500; all editing/production software must be free or open-source (no paid licenses, regardless of budget headroom).</li>
     <li><b>Quality:</b> must reach 500 unique subscribers/followers; must maintain journalistic integrity — zero verifiable factual-inaccuracy complaints — and a 95% content-completion rate (low drop-off).</li></ul>`,
    `<p><strong>1. Tên dự án:</strong> "Campus Pulse" — Kênh tin tức số hằng tuần cho sự kiện cộng đồng đại học.</p>
     <p><strong>2. Lý do:</strong> truyền thông địa phương không đưa tin về sự kiện quan trọng riêng với cộng đồng đại học, để lại khoảng trống thông tin thật sự. Dự án lấp khoảng trống đó bằng một kênh tin tức số ngách chuyên biệt (podcast/video), xây dựng nhận thức cộng đồng và một hồ sơ thành tích có thể sau này thu hút tài trợ hoặc hậu thuẫn chính thức từ trường — nhưng chỉ khi trước tiên chứng minh được khả năng sản xuất hằng tuần liên tục và sức hút khán giả thật trong đợt thử nghiệm 3 tháng có giới hạn.</p>
     <p><strong>3. Ràng buộc dự án:</strong></p>
     <ul><li><b>Phạm vi:</b> sản xuất và phát hành podcast/video hằng tuần chuyên biệt về sự kiện cộng đồng đại học — không tin tức địa phương tổng quát, không định dạng khác ngoài cái cần cho mục tiêu dưới đây.</li>
     <li><b>Thời gian:</b> chu kỳ sản xuất liên tục 3 tháng, không bỏ tuần nào.</li>
     <li><b>Chi phí/Ngân sách:</b> tổng chi cho quảng bá và thiết bị giới hạn nghiêm ngặt 500$; toàn bộ phần mềm biên tập/sản xuất phải miễn phí hoặc mã nguồn mở (không license trả phí dù còn dư ngân sách).</li>
     <li><b>Chất lượng:</b> phải đạt 500 người theo dõi/đăng ký duy nhất; phải giữ tính chính trực báo chí — zero khiếu nại xác minh được về sai lệch sự thật — và tỉ lệ hoàn thành nội dung 95% (bỏ giữa chừng thấp).</li></ul>`,
  ),
  rubric: [
    { id: 'project_name', criterion: B('Gives a clear, specific project name.', 'Đặt tên dự án rõ ràng, cụ thể.'), weight: 1, maxScore: 0.3 },
    { id: 'justifications', criterion: B('Explains a coherent purpose tied to the information gap and the value of proving traction, not just restating the task.', 'Giải thích lý do mạch lạc, gắn với khoảng trống thông tin và giá trị chứng minh sức hút, không chỉ chép lại đề.'), weight: 1, maxScore: 0.7 },
    { id: 'constraints_all4', criterion: B('Covers all 4 constraint dimensions with the specific numbers from the case (3 months, $500, free/open-source software, 500 subscribers, zero complaints, 95% completion).', 'Bao quát đủ 4 ràng buộc với đúng số liệu đề cho (3 tháng, 500$, phần mềm miễn phí/mã nguồn mở, 500 người theo dõi, zero khiếu nại, 95% hoàn thành).'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 2 (20%):</strong> define measurable project objectives and related success criteria — list at least two project objectives and explain how each one of those objectives will be measured.</p>`,
    `<p><strong>Yêu cầu 2 (20%):</strong> xác định mục tiêu dự án đo được và tiêu chí thành công liên quan — nêu ít nhất 2 mục tiêu và giải thích cách đo từng mục tiêu.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Objective 1 — Reach 500 unique subscribers/followers within 3 months.</strong> Measurement: track unique subscriber/follower count across all distribution platforms (e.g. YouTube, Spotify, Instagram) via each platform's native analytics dashboard, reconciled into one count monthly; success = combined unique count ≥ 500 by month 3.</p>
     <p><strong>Objective 2 — Maintain a zero-missed-week weekly publishing cadence for 12 consecutive weeks.</strong> Measurement: a publishing log/content calendar checked off after each release; success = 12/12 weeks published on schedule, with any slip counted as a failure of this objective regardless of eventual catch-up.</p>
     <p><strong>Objective 3 — Maintain journalistic integrity with zero verifiable factual-inaccuracy complaints.</strong> Measurement: a complaint-tracking log reviewing every viewer/listener complaint received; each is investigated and classified as "verified inaccuracy" or not; success = zero complaints classified as verified across the full 3 months.</p>
     <p><strong>Objective 4 — Achieve a 95% content-completion rate (low drop-off).</strong> Measurement: platform analytics reporting average percentage of each episode watched/listened to before the viewer/listener stops; success = the rolling average across all published episodes stays at or above 95%.</p>`,
    `<p><strong>Mục tiêu 1 — Đạt 500 người theo dõi/đăng ký duy nhất trong 3 tháng.</strong> Đo: theo dõi số người theo dõi duy nhất trên mọi nền tảng phát hành (YouTube, Spotify, Instagram...) qua bảng phân tích riêng từng nền tảng, gộp lại thành 1 con số mỗi tháng; thành công = tổng số duy nhất ≥ 500 vào tháng thứ 3.</p>
     <p><strong>Mục tiêu 2 — Giữ nhịp phát hành hằng tuần không bỏ tuần nào trong 12 tuần liên tục.</strong> Đo: nhật ký phát hành/lịch nội dung đánh dấu sau mỗi lần phát hành; thành công = 12/12 tuần phát hành đúng lịch, bất kỳ lần trễ nào tính là thất bại mục tiêu này bất kể có bù sau đó hay không.</p>
     <p><strong>Mục tiêu 3 — Giữ tính chính trực báo chí với zero khiếu nại xác minh được về sai lệch sự thật.</strong> Đo: nhật ký theo dõi khiếu nại xem xét mọi khiếu nại từ người xem/nghe; mỗi khiếu nại được điều tra và phân loại "xác minh sai lệch" hay không; thành công = zero khiếu nại được phân loại xác minh trong suốt 3 tháng.</p>
     <p><strong>Mục tiêu 4 — Đạt tỉ lệ hoàn thành nội dung 95% (bỏ giữa chừng thấp).</strong> Đo: phân tích nền tảng báo cáo phần trăm trung bình mỗi tập được xem/nghe trước khi dừng; thành công = trung bình trượt trên toàn bộ tập đã phát hành duy trì từ 95% trở lên.</p>`,
  ),
  rubric: [
    { id: 'two_objectives', criterion: B('Provides at least 2 objectives, each specific and directly tied to the case constraints (not vague/generic).', 'Nêu đủ ít nhất 2 mục tiêu, mỗi cái cụ thể và gắn trực tiếp ràng buộc đề (không mơ hồ/chung chung).'), weight: 1, maxScore: 0.9 },
    { id: 'measurement_method', criterion: B('Each objective has a genuinely measurable success criterion with a stated measurement method/instrument.', 'Mỗi mục tiêu có tiêu chí thành công đo được thật, kèm phương pháp/công cụ đo cụ thể.'), weight: 1, maxScore: 1.1 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 (30%):</strong> describe the RACI chart in which you: (1) define at least three project roles; (2) list out at least ten tasks, activities, or deliverables; (3) for each task/activity/deliverable, list out the responsibilities of the project roles (R/A/C/I).</p>`,
    `<p><strong>Yêu cầu 3 (30%):</strong> mô tả bảng RACI: (1) xác định ít nhất 3 vai trò dự án; (2) liệt kê ít nhất 10 nhiệm vụ/hoạt động/sản phẩm bàn giao; (3) với mỗi nhiệm vụ, nêu trách nhiệm từng vai trò (R/A/C/I).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Roles:</strong> Project Lead (PL), Content Editor (CE), Student Reporter/Host (SR), Social Media Manager (SM).</p>
     <table><tr><th>Task/Activity/Deliverable</th><th>PL</th><th>CE</th><th>SR</th><th>SM</th></tr>
     <tr><td>1. Weekly topic/story selection</td><td>A</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>2. Interview/research for the episode</td><td>I</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>3. Recording audio/video</td><td>I</td><td>I</td><td>R</td><td>I</td></tr>
     <tr><td>4. Editing the episode</td><td>I</td><td>R</td><td>C</td><td>I</td></tr>
     <tr><td>5. Fact-checking content</td><td>A</td><td>R</td><td>C</td><td>I</td></tr>
     <tr><td>6. Publishing the episode</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>7. Social-media promotion post</td><td>I</td><td>I</td><td>C</td><td>R</td></tr>
     <tr><td>8. Subscriber-growth tracking/reporting</td><td>A</td><td>I</td><td>I</td><td>R</td></tr>
     <tr><td>9. Complaint/feedback monitoring</td><td>A</td><td>C</td><td>I</td><td>R</td></tr>
     <tr><td>10. Monthly progress review meeting</td><td>R</td><td>C</td><td>C</td><td>C</td></tr>
     <tr><td>11. Budget &amp; free/open-source software compliance tracking</td><td>R</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>12. Content calendar planning</td><td>A</td><td>R</td><td>C</td><td>C</td></tr></table>
     <p><i>R=Responsible, A=Accountable, C=Consulted, I=Informed. Note each task has exactly one A, and no cell is left ambiguous.</i></p>`,
    `<p><strong>Vai trò:</strong> Project Lead (PL), Content Editor (CE), Student Reporter/Host (SR), Social Media Manager (SM).</p>
     <table><tr><th>Nhiệm vụ/Hoạt động/Sản phẩm</th><th>PL</th><th>CE</th><th>SR</th><th>SM</th></tr>
     <tr><td>1. Chọn chủ đề/câu chuyện hằng tuần</td><td>A</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>2. Phỏng vấn/nghiên cứu cho tập</td><td>I</td><td>C</td><td>R</td><td>I</td></tr>
     <tr><td>3. Ghi hình/ghi âm</td><td>I</td><td>I</td><td>R</td><td>I</td></tr>
     <tr><td>4. Biên tập tập nội dung</td><td>I</td><td>R</td><td>C</td><td>I</td></tr>
     <tr><td>5. Kiểm chứng nội dung</td><td>A</td><td>R</td><td>C</td><td>I</td></tr>
     <tr><td>6. Phát hành tập</td><td>A</td><td>R</td><td>I</td><td>C</td></tr>
     <tr><td>7. Đăng quảng bá mạng xã hội</td><td>I</td><td>I</td><td>C</td><td>R</td></tr>
     <tr><td>8. Theo dõi/báo cáo tăng trưởng người theo dõi</td><td>A</td><td>I</td><td>I</td><td>R</td></tr>
     <tr><td>9. Theo dõi khiếu nại/phản hồi</td><td>A</td><td>C</td><td>I</td><td>R</td></tr>
     <tr><td>10. Họp review tiến độ hằng tháng</td><td>R</td><td>C</td><td>C</td><td>C</td></tr>
     <tr><td>11. Theo dõi ngân sách &amp; tuân thủ phần mềm miễn phí/mã nguồn mở</td><td>R</td><td>I</td><td>I</td><td>I</td></tr>
     <tr><td>12. Lập lịch nội dung</td><td>A</td><td>R</td><td>C</td><td>C</td></tr></table>
     <p><i>R=Chịu trách nhiệm thực hiện, A=Chịu trách nhiệm giải trình, C=Được tham vấn, I=Được thông báo. Mỗi nhiệm vụ có đúng 1 A, không ô nào mơ hồ.</i></p>`,
  ),
  rubric: [
    { id: 'three_roles', criterion: B('Defines at least 3 clear, distinct project roles relevant to producing a weekly news channel.', 'Xác định ít nhất 3 vai trò dự án rõ ràng, khác nhau, gắn với sản xuất kênh tin tức hằng tuần.'), weight: 1, maxScore: 0.6 },
    { id: 'ten_tasks', criterion: B('Lists at least 10 distinct, realistic tasks/activities/deliverables.', 'Liệt kê ít nhất 10 nhiệm vụ/hoạt động/sản phẩm khác nhau, thực tế.'), weight: 1, maxScore: 1 },
    { id: 'raci_assignment', criterion: B('Each task has a full RACI assignment across all roles, with exactly one Accountable per task and no ambiguous/missing cells.', 'Mỗi nhiệm vụ có đủ gán RACI cho mọi vai trò, đúng 1 người Accountable mỗi nhiệm vụ, không ô nào mơ hồ/thiếu.'), weight: 1, maxScore: 1.4 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 4 (30%):</strong> provide at least three main project milestones that will be used to mark project progress. Select one project milestone that you know the best, then determine at least ten activities and their sequences with relevant relationships (FS, SS, SF, FF) among them to complete that milestone.</p>`,
    `<p><strong>Yêu cầu 4 (30%):</strong> nêu ít nhất 3 mốc dự án chính dùng để đánh dấu tiến độ. Chọn 1 mốc bạn hiểu rõ nhất, rồi xác định ít nhất 10 hoạt động và trình tự của chúng với quan hệ phù hợp (FS, SS, SF, FF) để hoàn thành mốc đó.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Three main milestones:</strong></p>
     <ol><li>Month 1 complete — first 4 weekly episodes published, initial subscriber base established.</li>
     <li>Month 2 complete — 8 cumulative episodes published, subscriber growth trend confirmed toward the 500 target.</li>
     <li>Month 3 complete (project end) — 12 cumulative episodes published, 500-subscriber target evaluated, zero-complaint and 95%-completion quality targets evaluated over the full run.</li></ol>
     <p><strong>Selected milestone: "Month 1 complete."</strong> Activities and sequencing:</p>
     <ol><li>A1 — Select topic/story for episode 1. (start of the chain)</li>
     <li>A2 — Recruit/confirm interview subjects. Relationship: <b>FS</b> after A1 (can't book interviews before the topic is picked).</li>
     <li>A3 — Conduct background research. Relationship: <b>SS</b> with A2 (research can start the moment interview outreach begins, running in parallel).</li>
     <li>A4 — Record audio/video. Relationship: <b>FS</b> after A2 AND A3 (recording needs both the confirmed interview and finished research).</li>
     <li>A5 — Rough-cut edit. Relationship: <b>FS</b> after A4.</li>
     <li>A6 — Fact-check the draft content. Relationship: <b>SS</b> with A5 (fact-checking starts as soon as the rough cut begins, working from the same raw footage).</li>
     <li>A7 — Final edit incorporating fact-check corrections. Relationship: <b>FS</b> after both A5 and A6.</li>
     <li>A8 — Prepare episode metadata/thumbnail/description. Relationship: <b>SS</b> with A7 (can be prepared while final edit is being finished).</li>
     <li>A9 — Publish the episode. Relationship: <b>FS</b> after both A7 and A8.</li>
     <li>A10 — Post social-media promotion. Relationship: <b>SS</b> with A9 (promo goes out the moment the episode is live).</li>
     <li>A11 — Monitor first-week subscriber count and feedback/complaints. Relationship: <b>FS</b> after A9.</li>
     <li>A12 — Repeat the full A1-A11 cycle for episodes 2, 3, 4. Relationship: <b>FF</b> with A11 of episode 4's cycle (Milestone "Month 1 complete" finishes only once episode 4's monitoring step is done).</li></ol>
     <p><i>Note: no genuine Start-to-Finish (SF) relationship is used here — SF is inherently rare/artificial in real scheduling (it means a successor can't finish until a predecessor starts), and forcing one into this workflow would misrepresent the actual dependencies rather than reflect them accurately.</i></p>`,
    `<p><strong>3 mốc dự án chính:</strong></p>
     <ol><li>Hoàn thành tháng 1 — 4 tập đầu phát hành, đã có nền tảng người theo dõi ban đầu.</li>
     <li>Hoàn thành tháng 2 — tổng 8 tập phát hành, xác nhận xu hướng tăng trưởng hướng tới mục tiêu 500.</li>
     <li>Hoàn thành tháng 3 (kết thúc dự án) — tổng 12 tập phát hành, đánh giá mục tiêu 500 người theo dõi, đánh giá mục tiêu chất lượng zero khiếu nại và 95% hoàn thành trên toàn bộ đợt chạy.</li></ol>
     <p><strong>Mốc được chọn: "Hoàn thành tháng 1".</strong> Hoạt động và trình tự:</p>
     <ol><li>A1 — Chọn chủ đề/câu chuyện tập 1. (đầu chuỗi)</li>
     <li>A2 — Mời/xác nhận đối tượng phỏng vấn. Quan hệ: <b>FS</b> sau A1 (không thể đặt phỏng vấn trước khi chọn chủ đề).</li>
     <li>A3 — Nghiên cứu nền. Quan hệ: <b>SS</b> với A2 (nghiên cứu bắt đầu ngay khi liên hệ phỏng vấn, chạy song song).</li>
     <li>A4 — Ghi âm/ghi hình. Quan hệ: <b>FS</b> sau cả A2 và A3 (cần cả phỏng vấn đã xác nhận lẫn nghiên cứu xong).</li>
     <li>A5 — Dựng thô. Quan hệ: <b>FS</b> sau A4.</li>
     <li>A6 — Kiểm chứng bản nháp. Quan hệ: <b>SS</b> với A5 (kiểm chứng bắt đầu ngay khi dựng thô bắt đầu, cùng làm trên footage gốc).</li>
     <li>A7 — Biên tập cuối, gộp sửa từ kiểm chứng. Quan hệ: <b>FS</b> sau cả A5 và A6.</li>
     <li>A8 — Chuẩn bị metadata/thumbnail/mô tả tập. Quan hệ: <b>SS</b> với A7 (chuẩn bị song song lúc biên tập cuối đang hoàn tất).</li>
     <li>A9 — Phát hành tập. Quan hệ: <b>FS</b> sau cả A7 và A8.</li>
     <li>A10 — Đăng quảng bá mạng xã hội. Quan hệ: <b>SS</b> với A9 (quảng bá đăng ngay khi tập lên sóng).</li>
     <li>A11 — Theo dõi số người theo dõi tuần đầu và phản hồi/khiếu nại. Quan hệ: <b>FS</b> sau A9.</li>
     <li>A12 — Lặp lại chu trình A1-A11 cho tập 2, 3, 4. Quan hệ: <b>FF</b> với A11 của chu trình tập 4 (mốc "Hoàn thành tháng 1" chỉ xong khi bước theo dõi của tập 4 hoàn tất).</li></ol>
     <p><i>Lưu ý: không dùng quan hệ Start-to-Finish (SF) thật ở đây — SF vốn hiếm/máy móc trong lập lịch thực tế (nghĩa là hoạt động sau không thể xong cho tới khi hoạt động trước bắt đầu), ép dùng 1 cái vào quy trình này sẽ phản ánh sai phụ thuộc thật thay vì đúng.</i></p>`,
  ),
  explanation: B(
    `<p>No source solution existed for this request. Sequencing was reasoned from first principles of a realistic weekly content-production workflow, using FS/SS/FF where each genuinely applies and explicitly declining to fabricate an SF relationship, since none of the real dependencies in this workflow are Start-to-Finish in nature.</p>`,
    `<p>Đề này không có solution nguồn cho yêu cầu này. Trình tự được suy luận từ nguyên lý gốc của quy trình sản xuất nội dung hằng tuần thực tế, dùng FS/SS/FF ở đúng chỗ áp dụng thật và cố tình không bịa ra quan hệ SF, vì không có phụ thuộc thật nào trong quy trình này mang bản chất Start-to-Finish.</p>`,
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
    code: 'PE21',
    title: 'PMG201c – Practical Exam 2 (Summer 2026, HCM Campus), University-Community News Channel|||PMG201c – Thi thực hành 2 (Summer 2026, HCM Campus), Kênh tin tức cộng đồng đại học',
    description: 'PMG201c PE (WRITE): project charter, measurable objectives, RACI chart, milestone activity sequencing (FS/SS/SF/FF) — no CPM/EVM numeric analysis in this paper, AI-graded.|||PE PMG201c (viết): charter dự án, mục tiêu đo được, bảng RACI, trình tự hoạt động theo mốc (FS/SS/SF/FF) — đề này không có phân tích số CPM/EVM, chấm AI.',
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
