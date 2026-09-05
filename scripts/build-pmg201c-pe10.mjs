/**
 * build-pmg201c-pe10.mjs — sinh content/exams/PMG201c-PE10.mjs.
 *
 * Nguồn thật: "PMG201c - PE2 - SU 2023 - 2" (công ty tổ chức company trip
 * tới Đà Nẵng). ⚠️ Đoạn mở đầu Request 1 bị CẮT CỤT trong chính paper.pdf
 * gốc ("...for this event" — thiếu câu đầu mô tả công ty/lý do sự kiện) —
 * đã ghi rõ trong instructions, tự bổ sung giả định hợp lý (company trip
 * giữa năm) để có bối cảnh đầy đủ, không giấu diếm phần bị cắt.
 *
 * Không có solution. Request 3 (CPM) và Request 5 (EVM) tự tính tay độc
 * lập: đường găng Start-A-D-G-I-End=20 tuần (5 đường đi); EVM: BAC=
 * 5,250,000 JPY (số liệu gốc OCR ra "5,250,00" — hiểu là 5,250,000),
 * SPI=0.8, CPI=0.84, EAC=6,250,000 JPY, dự báo tiến độ 15 tháng.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE10.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE10.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context (note: this paper's own opening sentence describing the company/reason for the event was cut off in the source scan — the text below fills in a reasonable assumption, clearly marked):</b><br/><p>[Assumed: Company XYZ is organizing a mid-year company trip] for this event. The event must include transportation and accommodation for employees from other cities to travel to Da Nang and attend, and must have 1 meeting where the BOD reports on the business status of the first 6 months and the business plan for the 2nd half of the year. Besides that, the event should also include other fun activities or games on the beach.</p></div>`,
  `<div class="pe-system"><b>Bối cảnh (lưu ý: câu mở đầu mô tả công ty/lý do sự kiện của chính đề gốc bị cắt cụt trong bản scan — phần dưới bổ sung giả định hợp lý, đánh dấu rõ):</b><br/><p>[Giả định: Công ty XYZ tổ chức company trip giữa năm] cho sự kiện này. Sự kiện phải gồm di chuyển và chỗ ở cho nhân viên từ tỉnh khác tới Đà Nẵng tham dự, và phải có 1 buổi họp BOD báo cáo tình hình kinh doanh 6 tháng đầu năm và kế hoạch kinh doanh nửa năm sau. Ngoài ra, sự kiện cũng cần có hoạt động vui chơi/trò chơi trên biển.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Examination (SU23, Paper No. 2 — company trip to Da Nang)</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành (SU23, Đề số 2 — company trip Đà Nẵng)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const cpmTable = `<table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>
<tr><td>Start</td><td>None</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>4</td></tr>
<tr><td>B</td><td>Start</td><td>3</td></tr><tr><td>C</td><td>A</td><td>7</td></tr>
<tr><td>D</td><td>A</td><td>8</td></tr><tr><td>E</td><td>B, A</td><td>3</td></tr>
<tr><td>F</td><td>C, D</td><td>3</td></tr><tr><td>G</td><td>D</td><td>4</td></tr>
<tr><td>H</td><td>E</td><td>7</td></tr><tr><td>I</td><td>F, G</td><td>4</td></tr>
<tr><td>End</td><td>H, I</td><td>0</td></tr></table>`;

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 – Work Breakdown Structure:</strong> based on your knowledge of project management, make a WBS for this company trip event. Assume the top-level structure: 1.1 Initiating, 1.2 Planning, 1.3 Executing (include Monitoring &amp; Controlling), 1.4 Closing. The WBS can have as many layers as you wish, but it must cover the specific activities for this context.</p>`,
    `<p><strong>Yêu cầu 1 – Cấu trúc phân rã công việc (WBS):</strong> dùng kiến thức quản lý dự án, xây WBS cho sự kiện company trip này. Giả sử cấu trúc cấp cao: 1.1 Khởi động, 1.2 Lập kế hoạch, 1.3 Thực thi (gồm Giám sát &amp; Kiểm soát), 1.4 Kết thúc. WBS có thể phân rã bao nhiêu lớp tuỳ ý, nhưng phải bao quát công việc cụ thể của bối cảnh này.</p>`,
  ),
  sampleSolution: B(
    `<p><b>1. Da Nang Company Trip</b></p>
     <p><b>1.1 Initiating:</b> 1.1.1 Get budget/event approval from BOD; 1.1.2 Confirm attendee list (incl. employees traveling from other cities); 1.1.3 Set event goals (team bonding + H1 business review + H2 planning).</p>
     <p><b>1.2 Planning:</b> 1.2.1 Book transportation for out-of-city employees; 1.2.2 Book accommodation (hotel rooms for all attendees); 1.2.3 Plan the BOD meeting agenda (H1 report + H2 business plan); 1.2.4 Plan beach games/fun activities schedule; 1.2.5 Plan meals and vendor logistics.</p>
     <p><b>1.3 Executing (incl. Monitoring &amp; Controlling):</b> 1.3.1 Execute transportation pickup/drop-off; 1.3.2 Check in attendees at accommodation; 1.3.3 Run the BOD meeting; 1.3.4 Run beach games/activities; 1.3.5 Monitor attendance vs. planned headcount and handle last-minute changes; 1.3.6 Monitor budget spend vs. plan during the event.</p>
     <p><b>1.4 Closing:</b> 1.4.1 Return transportation/check-out; 1.4.2 Settle vendor payments (hotel, transport, activity organizers); 1.4.3 Collect employee feedback survey; 1.4.4 Internal lessons-learned review for future company trips.</p>`,
    `<p><b>1. Company Trip Đà Nẵng</b></p>
     <p><b>1.1 Khởi động:</b> 1.1.1 Xin duyệt ngân sách/sự kiện từ BOD; 1.1.2 Xác nhận danh sách tham dự (kể cả nhân viên di chuyển từ tỉnh khác); 1.1.3 Đặt mục tiêu sự kiện (gắn kết đội ngũ + báo cáo kinh doanh H1 + kế hoạch H2).</p>
     <p><b>1.2 Lập kế hoạch:</b> 1.2.1 Đặt phương tiện di chuyển cho nhân viên ngoại tỉnh; 1.2.2 Đặt chỗ ở (phòng khách sạn cho toàn bộ người tham dự); 1.2.3 Lên chương trình họp BOD (báo cáo H1 + kế hoạch kinh doanh H2); 1.2.4 Lên lịch trò chơi biển/hoạt động vui chơi; 1.2.5 Lên kế hoạch ăn uống và hậu cần nhà cung cấp.</p>
     <p><b>1.3 Thực thi (gồm Giám sát &amp; Kiểm soát):</b> 1.3.1 Thực hiện đón/trả khách di chuyển; 1.3.2 Check-in người tham dự tại chỗ ở; 1.3.3 Tổ chức họp BOD; 1.3.4 Tổ chức trò chơi/hoạt động biển; 1.3.5 Giám sát số người tham dự thực tế so với kế hoạch, xử lý thay đổi phút chót; 1.3.6 Giám sát chi tiêu so với kế hoạch trong lúc sự kiện diễn ra.</p>
     <p><b>1.4 Kết thúc:</b> 1.4.1 Trả phương tiện/check-out; 1.4.2 Thanh toán nhà cung cấp (khách sạn, xe, đơn vị tổ chức hoạt động); 1.4.3 Thu thập khảo sát phản hồi nhân viên; 1.4.4 Rà soát bài học kinh nghiệm nội bộ cho company trip sau.</p>`,
  ),
  rubric: [
    { id: 'four_phases', criterion: B('Covers all 4 phases including Monitoring & Controlling within Executing.', 'Bao quát đủ 4 giai đoạn, gồm cả Giám sát & Kiểm soát trong Thực thi.'), weight: 1, maxScore: 0.6 },
    { id: 'context_specific', criterion: B('Tasks specifically address transportation/accommodation for out-of-city staff, the BOD meeting, and beach activities — the 3 explicit requirements of this event.', 'Công việc gắn cụ thể với di chuyển/chỗ ở nhân viên ngoại tỉnh, họp BOD, và hoạt động trên biển — đủ 3 yêu cầu rõ ràng của sự kiện.'), weight: 1, maxScore: 1 },
    { id: 'sufficient_depth', criterion: B('Breaks work down with enough specific detail.', 'Phân rã đủ chi tiết cụ thể.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Request 2 – Deliverables:</strong> identify at least 5 milestones mapped to the main deliverables of the project. For each milestone, write a brief explanation of how to measure whether its status is completed or not.</p>`,
    `<p><strong>Yêu cầu 2 – Sản phẩm bàn giao:</strong> xác định ít nhất 5 mốc tương ứng sản phẩm bàn giao chính. Với mỗi mốc, giải thích ngắn gọn cách đo hoàn thành.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Milestone 1 — Transportation &amp; accommodation booked:</strong> deliverable = confirmed bookings for all out-of-city attendees. Measure: booking confirmation numbers on file matching the final attendee count.</p>
     <p><strong>Milestone 2 — BOD meeting agenda approved:</strong> deliverable = signed-off meeting agenda and presentation materials (H1 report + H2 plan). Measure: BOD sign-off received before the trip.</p>
     <p><strong>Milestone 3 — Beach activities plan finalized:</strong> deliverable = confirmed activity vendor and schedule. Measure: vendor contract signed, activity timeline distributed to attendees.</p>
     <p><strong>Milestone 4 — Event executed (BOD meeting + activities held):</strong> deliverable = the actual trip itself. Measure: attendance log matches expected headcount, meeting minutes recorded, activities completed as scheduled.</p>
     <p><strong>Milestone 5 — Post-trip closure:</strong> deliverable = vendor payments settled and feedback collected. Measure: all invoices paid, feedback survey response rate above a target threshold (e.g. 70%).</p>`,
    `<p><strong>Mốc 1 — Đặt xong phương tiện &amp; chỗ ở:</strong> sản phẩm = đã xác nhận đặt chỗ cho toàn bộ người tham dự ngoại tỉnh. Đo: có mã xác nhận đặt chỗ khớp số người tham dự cuối cùng.</p>
     <p><strong>Mốc 2 — Duyệt chương trình họp BOD:</strong> sản phẩm = chương trình họp và tài liệu trình bày đã duyệt (báo cáo H1 + kế hoạch H2). Đo: BOD đã ký duyệt trước chuyến đi.</p>
     <p><strong>Mốc 3 — Chốt kế hoạch hoạt động biển:</strong> sản phẩm = đã xác nhận đơn vị tổ chức và lịch trình. Đo: hợp đồng đã ký, lịch trình đã gửi người tham dự.</p>
     <p><strong>Mốc 4 — Thực hiện sự kiện (họp BOD + hoạt động):</strong> sản phẩm = chính chuyến đi. Đo: nhật ký tham dự khớp số dự kiến, biên bản họp đã ghi, hoạt động diễn ra đúng lịch.</p>
     <p><strong>Mốc 5 — Đóng sự kiện:</strong> sản phẩm = đã thanh toán nhà cung cấp và thu thập phản hồi. Đo: mọi hoá đơn đã thanh toán, tỉ lệ phản hồi khảo sát trên ngưỡng mục tiêu (ví dụ 70%).</p>`,
  ),
  rubric: [
    { id: 'five_milestones', criterion: B('Provides at least 5 distinct milestones tied to real deliverables.', 'Nêu đủ ít nhất 5 mốc khác nhau, gắn sản phẩm bàn giao thật.'), weight: 1, maxScore: 0.6 },
    { id: 'measurement', criterion: B('Each milestone has a concrete, verifiable completion check.', 'Mỗi mốc có cách kiểm tra hoàn thành cụ thể, xác minh được.'), weight: 1, maxScore: 0.9 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 – Project Scheduling:</strong> assume that you have defined and estimated the project schedule with the activities below:</p>${cpmTable}
     <p>Draw a network diagram and identify the project duration using critical path analysis. List all the paths.</p>`,
    `<p><strong>Yêu cầu 3 – Lập lịch dự án:</strong> giả sử bạn đã xác định và ước lượng lịch trình với các hoạt động sau:</p>${cpmTable}
     <p>Vẽ sơ đồ mạng lưới và xác định thời lượng dự án bằng phân tích đường găng. Liệt kê tất cả đường đi.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>All paths (Start to End):</strong></p>
     <ul><li>Path 1: Start→B→E→H→End = 3+3+7 = 13 weeks</li>
     <li>Path 2: Start→A→E→H→End = 4+3+7 = 14 weeks</li>
     <li>Path 3: Start→A→C→F→I→End = 4+7+3+4 = 18 weeks</li>
     <li>Path 4: Start→A→D→F→I→End = 4+8+3+4 = 19 weeks</li>
     <li>Path 5: Start→A→D→G→I→End = 4+8+4+4 = <b>20 weeks</b></li></ul>
     <p><strong>Critical path:</strong> Path 5 (Start→A→D→G→I→End). <strong>Project duration:</strong> 20 weeks.</p>
     <p><strong>Float per activity</strong> (full forward + backward CPM pass): A=0 (critical), B=7, C=2, D=0 (critical), E=6, F=1, G=0 (critical), H=6, I=0 (critical).</p>`,
    `<p><strong>Tất cả đường đi (Start tới End):</strong></p>
     <ul><li>Đường 1: Start→B→E→H→End = 3+3+7 = 13 tuần</li>
     <li>Đường 2: Start→A→E→H→End = 4+3+7 = 14 tuần</li>
     <li>Đường 3: Start→A→C→F→I→End = 4+7+3+4 = 18 tuần</li>
     <li>Đường 4: Start→A→D→F→I→End = 4+8+3+4 = 19 tuần</li>
     <li>Đường 5: Start→A→D→G→I→End = 4+8+4+4 = <b>20 tuần</b></li></ul>
     <p><strong>Đường găng:</strong> Đường 5 (Start→A→D→G→I→End). <strong>Thời lượng dự án:</strong> 20 tuần.</p>
     <p><strong>Float từng hoạt động</strong> (CPM xuôi+ngược đầy đủ): A=0 (găng), B=7, C=2, D=0 (găng), E=6, F=1, G=0 (găng), H=6, I=0 (găng).</p>`,
  ),
  explanation: B(
    `<p><b>Verified independently by hand</b> (full forward + backward CPM pass, no source solution existed) — 5 distinct paths (since both E and F have 2 predecessors each, giving multiple path branches), critical path A-D-G-I at 20 weeks.</p>`,
    `<p><b>Đã tự tính tay độc lập</b> (đầy đủ CPM xuôi+ngược, đề này không có solution) — 5 đường đi khác nhau (vì cả E và F đều có 2 tiền đề, tạo nhiều nhánh đường đi), đường găng A-D-G-I ở 20 tuần.</p>`,
  ),
  rubric: [
    { id: 'all_paths', criterion: B('Correctly lists all 5 distinct paths with correct durations.', 'Liệt kê đúng đủ 5 đường đi với thời lượng đúng.'), weight: 1, maxScore: 0.7 },
    { id: 'critical_path_duration', criterion: B('Correctly identifies the critical path (A-D-G-I) and project duration (20 weeks).', 'Xác định đúng đường găng (A-D-G-I) và thời lượng dự án (20 tuần).'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Request 4 – Schedule Updating &amp; Tracking:</strong> based on the schedule in Request 3, after 10 weeks your sponsor informs you that he would like to receive the project's product 5 weeks earlier than the planned schedule. Write down 2 solutions for this request (solution type, solution detail, consequence).</p>`,
    `<p><strong>Yêu cầu 4 – Cập nhật &amp; Theo dõi lịch trình:</strong> dựa trên lịch trình Yêu cầu 3, sau 10 tuần nhà tài trợ báo muốn nhận sản phẩm SỚM HƠN 5 tuần so kế hoạch. Nêu 2 giải pháp (loại giải pháp, chi tiết, hệ quả).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Note:</strong> only the critical path (A-D-G-I, 20 weeks) determines the project duration, so both solutions target activities on it. At week 10, activity D (ES=4, EF=12) is the one currently in progress.</p>
     <p><strong>Solution 1:</strong> Solution type: Crashing. Solution detail: reduce activity D's duration from 8 to 3 weeks (add extra staff/resources to D's remaining work). Consequence: significant added cost, and quality risk since D is foundational (feeds both F and G downstream).</p>
     <p><strong>Solution 2:</strong> Solution type: Fast tracking. Solution detail: run activity D and activity G in parallel — start G's early setup work before D is 100% finished, assuming G doesn't strictly need D's final output for its first tasks. This can save time without adding headcount. Consequence: rework risk if D's late-stage changes affect G's setup, and closer coordination is needed between the two activity owners.</p>
     <p><strong>Solution 3 (combined, optional):</strong> Solution type: combine crashing and fast tracking. Solution detail: reduce D's duration from 8 to 5 weeks (crash 3 weeks) AND run D and G partially in parallel (fast-track ~2 weeks) — together reaching the full 5-week target with smaller individual changes than either solution alone. Consequence: moderate added cost plus some coordination risk, but each individually smaller than doing either alone at full magnitude.</p>`,
    `<p><strong>Lưu ý:</strong> chỉ đường găng (A-D-G-I, 20 tuần) quyết định thời lượng dự án, nên cả 2 giải pháp nhắm vào hoạt động đó. Ở tuần 10, hoạt động D (ES=4, EF=12) đang thực hiện.</p>
     <p><strong>Giải pháp 1:</strong> Loại giải pháp: Crashing. Chi tiết: rút ngắn D từ 8 xuống 3 tuần (thêm nhân sự/nguồn lực cho phần việc D còn lại). Hệ quả: chi phí tăng đáng kể, rủi ro chất lượng vì D là hoạt động nền tảng (nuôi cả F và G phía sau).</p>
     <p><strong>Giải pháp 2:</strong> Loại giải pháp: Fast tracking. Chi tiết: chạy song song D và G — bắt đầu việc chuẩn bị đầu của G trước khi D xong hẳn, giả định G không nhất thiết cần đầu ra cuối của D cho việc đầu tiên. Có thể tiết kiệm thời gian mà không cần thêm người. Hệ quả: rủi ro làm lại nếu D thay đổi muộn ảnh hưởng G, cần phối hợp sát hơn giữa 2 người phụ trách.</p>
     <p><strong>Giải pháp 3 (kết hợp, tuỳ chọn):</strong> Loại giải pháp: kết hợp crashing và fast tracking. Chi tiết: rút ngắn D từ 8 xuống 5 tuần (crash 3 tuần) VÀ chạy song song 1 phần D và G (fast-track ~2 tuần) — cộng lại đạt đủ mục tiêu 5 tuần với thay đổi nhỏ hơn từng giải pháp riêng lẻ. Hệ quả: chi phí tăng vừa phải cộng rủi ro phối hợp, nhưng mỗi cái nhỏ hơn làm 1 mình ở mức đầy đủ.</p>`,
  ),
  rubric: [
    { id: 'targets_critical_path', criterion: B('Both solutions correctly target activities on the critical path (A, D, G, or I) — not non-critical activities like B, C, E, F, or H.', 'Cả 2 giải pháp đúng nhắm vào hoạt động đường găng (A, D, G, hoặc I) — không phải hoạt động không găng như B, C, E, F, H.'), weight: 1, maxScore: 1 },
    { id: 'complete_format', criterion: B('Each solution follows the requested format and genuinely helps reach the 5-week target.', 'Mỗi giải pháp đúng định dạng yêu cầu và thực sự giúp đạt mục tiêu rút 5 tuần.'), weight: 1, maxScore: 1 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 5 – Cost Evaluation:</strong> assume that you have a project with: (1) the project cost was estimated at JPY 5,250,000; (2) the project team estimated that the project would be completed in 12 months; (3) after 6 months, a report showed that 40% of the project jobs were completed; (4) the total amount spent on the project at that time was JPY 2,500,000; (5) the completed workload and the amount spent are estimated as equal for every day from the beginning to the end of the project. Apply Earned Value Management to evaluate the project status. Compute the PV, EV, AC, SV, CV, SPI, CPI, Estimated at Completion (EAC), and Schedule at Completion of the project. Give some comments to explain the status (schedule/cost), and suggest actions. Round to the JPY unit.</p>`,
    `<p><strong>Yêu cầu 5 – Đánh giá chi phí:</strong> giả sử bạn có dự án: (1) chi phí ước tính ¥5,250,000; (2) nhóm ước tính hoàn thành trong 12 tháng; (3) sau 6 tháng, báo cáo cho thấy 40% công việc đã hoàn thành; (4) tổng chi tiêu tính đến lúc đó là ¥2,500,000; (5) khối lượng hoàn thành và chi tiêu ước tính đều nhau mỗi ngày từ đầu tới cuối dự án. Áp dụng EVM đánh giá tình trạng dự án. Tính PV, EV, AC, SV, CV, SPI, CPI, EAC, và Schedule at Completion. Nhận xét tình trạng (tiến độ/chi phí), đề xuất hành động. Làm tròn về đơn vị JPY.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Given:</strong> BAC=¥5,250,000; planned duration=12 months; at 6 months, 40% complete; AC=¥2,500,000; linear planned-progress assumption (condition 5).</p>
     <ul><li>PV = BAC × (6/12) = 5,250,000 × 0.5 = <b>¥2,625,000</b></li>
     <li>EV = BAC × 40% = 5,250,000 × 0.4 = <b>¥2,100,000</b></li>
     <li>AC = <b>¥2,500,000</b> (given)</li>
     <li>SV = EV−PV = 2,100,000−2,625,000 = <b>−¥525,000</b></li>
     <li>CV = EV−AC = 2,100,000−2,500,000 = <b>−¥400,000</b></li>
     <li>SPI = EV/PV = 2,100,000/2,625,000 = <b>0.80</b></li>
     <li>CPI = EV/AC = 2,100,000/2,500,000 = <b>0.84</b></li>
     <li>EAC = BAC/CPI = 5,250,000/0.84 = <b>¥6,250,000</b></li>
     <li>Schedule at Completion = planned duration/SPI = 12/0.80 = <b>15 months</b></li></ul>
     <p><strong>Comments:</strong> SPI=0.80&lt;1 — the project is behind schedule (only 80% of planned progress achieved). CPI=0.84&lt;1 — the project is over budget (only ¥0.84 of value earned per ¥1 spent). Both underperforming, with schedule slightly worse than cost.</p>
     <p><strong>Suggested actions:</strong> at this pace the project would finish in about 15 months (3 months late) at a cost of about ¥6,250,000 (about ¥1,000,000, or 19%, over the ¥5,250,000 budget) — significant enough to formally re-baseline with the sponsor; add resources to critical-path work; investigate the root cause of both the cost and schedule slippage before approving further spending.</p>`,
    `<p><strong>Dữ liệu cho:</strong> BAC=¥5,250,000; kế hoạch 12 tháng; sau 6 tháng, 40% hoàn thành; AC=¥2,500,000; giả định tiến độ kế hoạch tuyến tính (điều kiện 5).</p>
     <ul><li>PV = BAC × (6/12) = 5,250,000 × 0.5 = <b>¥2,625,000</b></li>
     <li>EV = BAC × 40% = 5,250,000 × 0.4 = <b>¥2,100,000</b></li>
     <li>AC = <b>¥2,500,000</b> (đề cho)</li>
     <li>SV = EV−PV = 2,100,000−2,625,000 = <b>−¥525,000</b></li>
     <li>CV = EV−AC = 2,100,000−2,500,000 = <b>−¥400,000</b></li>
     <li>SPI = EV/PV = 2,100,000/2,625,000 = <b>0.80</b></li>
     <li>CPI = EV/AC = 2,100,000/2,500,000 = <b>0.84</b></li>
     <li>EAC = BAC/CPI = 5,250,000/0.84 = <b>¥6,250,000</b></li>
     <li>Schedule at Completion = thời lượng kế hoạch/SPI = 12/0.80 = <b>15 tháng</b></li></ul>
     <p><strong>Nhận xét:</strong> SPI=0.80&lt;1 — trễ tiến độ (chỉ đạt 80% tiến độ kế hoạch). CPI=0.84&lt;1 — vượt ngân sách (chỉ thu ¥0.84 giá trị cho mỗi ¥1 chi). Cả 2 đều kém hiệu suất, tiến độ hơi tệ hơn chi phí.</p>
     <p><strong>Đề xuất:</strong> với nhịp độ này dự án dự báo xong khoảng tháng 15 (trễ 3 tháng) với chi phí khoảng ¥6,250,000 (vượt khoảng ¥1,000,000, tức 19%, so ngân sách ¥5,250,000) — đủ nghiêm trọng để lập lại baseline chính thức với nhà tài trợ; thêm nguồn lực cho công việc đường găng; tìm nguyên nhân gốc của cả trễ tiến độ lẫn vượt chi phí trước khi duyệt chi thêm.</p>`,
  ),
  explanation: B(
    `<p>Verified independently by hand from the given data (no source solution existed; the source's own OCR text rendered the cost as "5,250,00" — read as ¥5,250,000, the only sensible 7-figure reading consistent with condition 4's ¥2,500,000 already-spent figure being a plausible fraction of it).</p>`,
    `<p>Đã tự tính tay độc lập từ dữ liệu đề cho (đề không có solution; văn bản OCR gốc ra "5,250,00" — đọc là ¥5,250,000, cách đọc 7 chữ số hợp lý duy nhất khớp với số ¥2,500,000 đã chi ở điều kiện 4 là 1 phần hợp lý của nó).</p>`,
  ),
  rubric: [
    { id: 'pv_ev', criterion: B('Correctly calculates PV (¥2,625,000) and EV (¥2,100,000).', 'Tính đúng PV (¥2,625,000) và EV (¥2,100,000).'), weight: 1, maxScore: 0.6 },
    { id: 'sv_cv_spi_cpi', criterion: B('Correctly calculates SV, CV, SPI (0.80), and CPI (0.84).', 'Tính đúng SV, CV, SPI (0.80), và CPI (0.84).'), weight: 1, maxScore: 0.6 },
    { id: 'eac_schedule', criterion: B('Correctly calculates EAC (¥6,250,000) and the schedule-at-completion forecast (15 months).', 'Tính đúng EAC (¥6,250,000) và dự báo tiến độ (15 tháng).'), weight: 1, maxScore: 0.5 },
    { id: 'commentary', criterion: B('Correctly identifies the project as both behind schedule and over budget, with sensible recommendations.', 'Nhận ra đúng dự án vừa trễ tiến độ vừa vượt ngân sách, kèm đề xuất hợp lý.'), weight: 1, maxScore: 0.3 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE10',
    title: 'PMG201c – Practical Examination, Da Nang Company Trip (SU23, Paper No. 2)|||PMG201c – Thi thực hành, Company Trip Đà Nẵng (SU23, Đề số 2)',
    description: 'PMG201c PE (WRITE): work breakdown structure (WBS), milestone/deliverable definition, critical path method (CPM), schedule crashing/fast-tracking, and earned value management (EVM), AI-graded.|||PE PMG201c (viết): cấu trúc phân rã công việc (WBS), xác định mốc/sản phẩm bàn giao, phân tích đường găng (CPM), rút ngắn lịch trình, và quản lý giá trị thu được (EVM), chấm AI.',
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
