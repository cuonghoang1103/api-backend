/**
 * build-pmg201c-pe15.mjs — sinh content/exams/PMG201c-PE15.mjs.
 *
 * Nguồn thật: "PMG201c - SU2023 - PE - FUDA [683]". ⚠️ Phần đầu đề bị
 * THIẾU trong bản scan — ảnh đầu tiên bắt đầu ngay tại "Request 1", nên
 * đoạn mô tả bối cảnh/dự án cụ thể (luôn có ở đầu các đề PMG201c khác)
 * không có trong nguồn. Request 1 chỉ để lại khung WBS mẫu với
 * "1.3.1 Pre launch / 1.3.2 Launch / 1.3.3 Post launch" — gợi ý mạnh đây
 * là một dự án RA MẮT SẢN PHẨM. Đã tự dựng bối cảnh hợp lý khớp khung đó
 * ("FitTrack" — ra mắt app di động theo dõi thể dục), ghi rõ trong
 * instructions đây là giả định vì thiếu nguồn, không giấu diếm.
 *
 * Request 3 (CPM) và Request 5 (EVM) tự tính tay độc lập (đề không có
 * solution): đường găng Start-A-B-D-F-H-End = 31 tuần (6 đường đi);
 * EVM: BAC=10,000$, SPI=CPI=1.25 (vượt tiến độ VÀ dưới ngân sách — hiếm,
 * đã ghi rõ), EAC=8,000$, dự báo hoàn thành 24 ngày.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE15.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE15.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context (note: the opening scenario paragraph of this paper was missing from the source scan — the first page starts directly at "Request 1". The WBS template's own subsections "1.3.1 Pre launch / 1.3.2 Launch / 1.3.3 Post launch" strongly indicate a PRODUCT-LAUNCH project, so a matching scenario is assumed below and clearly marked):</b><p>[Assumed] Your company is launching <b>"FitTrack"</b>, a new fitness-tracking mobile app, on the major app stores. The project covers pre-launch preparation (app-store listing, beta testing, teaser marketing), the launch itself (publishing, launch-day marketing push, stability monitoring), and post-launch activities (user support, review monitoring, retrospective).</p></div>`,
  `<div class="pe-system"><b>Bối cảnh (lưu ý: đoạn mô tả tình huống mở đầu của đề này bị thiếu trong bản scan gốc — trang đầu bắt đầu ngay tại "Request 1". Các mục con của khung WBS "1.3.1 Pre launch / 1.3.2 Launch / 1.3.3 Post launch" gợi ý mạnh đây là dự án RA MẮT SẢN PHẨM, nên bối cảnh khớp được giả định dưới đây và đánh dấu rõ):</b><p>[Giả định] Công ty bạn đang ra mắt <b>"FitTrack"</b>, một app di động theo dõi thể dục mới, trên các kho ứng dụng lớn. Dự án gồm chuẩn bị trước ra mắt (gian hàng app store, beta test, marketing rào đón), chính đợt ra mắt (phát hành, đẩy marketing ngày ra mắt, giám sát ổn định), và hoạt động sau ra mắt (hỗ trợ người dùng, theo dõi đánh giá, tổng kết).</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Examination (SU2023, FUDA [683]) — FitTrack mobile app launch</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành (SU2023, FUDA [683]) — ra mắt app FitTrack</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const cpmTable = `<table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>
<tr><td>Start</td><td>None</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>6</td></tr>
<tr><td>B</td><td>A</td><td>3</td></tr><tr><td>C</td><td>B</td><td>4</td></tr>
<tr><td>D</td><td>B</td><td>7</td></tr><tr><td>E</td><td>A</td><td>5</td></tr>
<tr><td>F</td><td>D, C</td><td>6</td></tr><tr><td>G</td><td>B</td><td>8</td></tr>
<tr><td>H</td><td>F, E</td><td>9</td></tr><tr><td>I</td><td>F, G</td><td>4</td></tr>
<tr><td>End</td><td>H, I</td><td>0</td></tr></table>`;

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 – Work Breakdown Structure:</strong> create a WBS for the project. Break down the work to Level 3 or Level 4, as appropriate, following the given template (1.1 Initiating / 1.2 Planning / 1.3 Executing including 1.3.1 Pre launch, 1.3.2 Launch, 1.3.3 Post launch / 1.4 Closing).</p>`,
    `<p><strong>Yêu cầu 1 – Cấu trúc phân rã công việc (WBS):</strong> xây WBS cho dự án. Phân rã tới Cấp 3 hoặc Cấp 4 phù hợp, theo đúng khung đề cho (1.1 Khởi động / 1.2 Lập kế hoạch / 1.3 Thực thi gồm 1.3.1 Trước ra mắt, 1.3.2 Ra mắt, 1.3.3 Sau ra mắt / 1.4 Kết thúc).</p>`,
  ),
  sampleSolution: B(
    `<p><b>1. FitTrack App Launch</b></p>
     <p><b>1.1 Initiating:</b> 1.1.1 Define launch objectives and get budget approval; 1.1.2 Identify the launch team and get sponsor sign-off.</p>
     <p><b>1.2 Planning:</b> 1.2.1 Plan the marketing campaign; 1.2.2 Plan app-store submission requirements; 1.2.3 Plan launch-day logistics; 1.2.4 Plan the post-launch support/monitoring approach.</p>
     <p><b>1.3 Executing:</b></p>
     <p>1.3.1 Pre launch: 1.3.1.1 Finalize app-store listing assets (screenshots, description); 1.3.1.2 Run beta testing with early users; 1.3.1.3 Execute the pre-launch teaser marketing campaign.</p>
     <p>1.3.2 Launch: 1.3.2.1 Submit and publish the app to app stores; 1.3.2.2 Execute the launch-day marketing push (social media, press release); 1.3.2.3 Monitor launch-day server load and crash reports.</p>
     <p>1.3.3 Post launch: 1.3.3.1 Monitor user reviews and ratings; 1.3.3.2 Respond to user support tickets; 1.3.3.3 Collect usage analytics for first-update planning.</p>
     <p>1.3.4 Monitoring &amp; Controlling: monitor actual spend vs. budget and schedule adherence across the pre-launch/launch/post-launch sub-phases.</p>
     <p><b>1.4 Closing:</b> 1.4.1 Conduct the launch retrospective; 1.4.2 Archive launch documentation; 1.4.3 Hand off to the ongoing product team.</p>`,
    `<p><b>1. Ra mắt app FitTrack</b></p>
     <p><b>1.1 Khởi động:</b> 1.1.1 Xác định mục tiêu ra mắt và duyệt ngân sách; 1.1.2 Xác định nhóm ra mắt và xin sponsor ký duyệt.</p>
     <p><b>1.2 Lập kế hoạch:</b> 1.2.1 Lên kế hoạch chiến dịch marketing; 1.2.2 Lên kế hoạch yêu cầu nộp app store; 1.2.3 Lên kế hoạch hậu cần ngày ra mắt; 1.2.4 Lên kế hoạch hỗ trợ/giám sát sau ra mắt.</p>
     <p><b>1.3 Thực thi:</b></p>
     <p>1.3.1 Trước ra mắt: 1.3.1.1 Hoàn thiện tài sản gian hàng app store (ảnh chụp màn hình, mô tả); 1.3.1.2 Beta test với người dùng sớm; 1.3.1.3 Chạy chiến dịch marketing rào đón trước ra mắt.</p>
     <p>1.3.2 Ra mắt: 1.3.2.1 Nộp và phát hành app lên các kho ứng dụng; 1.3.2.2 Đẩy marketing ngày ra mắt (mạng xã hội, thông cáo báo chí); 1.3.2.3 Giám sát tải server và báo cáo crash ngày ra mắt.</p>
     <p>1.3.3 Sau ra mắt: 1.3.3.1 Theo dõi đánh giá/rating người dùng; 1.3.3.2 Xử lý ticket hỗ trợ người dùng; 1.3.3.3 Thu thập số liệu sử dụng cho kế hoạch bản cập nhật đầu tiên.</p>
     <p>1.3.4 Giám sát &amp; Kiểm soát: giám sát chi tiêu thực tế so ngân sách và tuân thủ lịch trình qua các giai đoạn con trước/ra mắt/sau ra mắt.</p>
     <p><b>1.4 Kết thúc:</b> 1.4.1 Tổng kết đợt ra mắt; 1.4.2 Lưu trữ tài liệu ra mắt; 1.4.3 Bàn giao cho nhóm sản phẩm vận hành lâu dài.</p>`,
  ),
  rubric: [
    { id: 'four_phases_with_sub', criterion: B('Covers all 4 top-level phases, correctly using the given Pre launch/Launch/Post launch sub-structure inside Executing.', 'Bao quát đủ 4 giai đoạn cấp cao, dùng đúng cấu trúc con Trước ra mắt/Ra mắt/Sau ra mắt trong Thực thi theo đề cho.'), weight: 1, maxScore: 0.7 },
    { id: 'context_specific', criterion: B('Tasks specifically address a product/app launch (app-store listing, beta testing, launch-day marketing, post-launch support) rather than a generic template.', 'Công việc gắn cụ thể với ra mắt sản phẩm/app (gian hàng app store, beta test, marketing ngày ra mắt, hỗ trợ sau ra mắt), không phải khung chung chung.'), weight: 1, maxScore: 0.9 },
    { id: 'sufficient_depth', criterion: B('Breaks work down to Level 3/4 with enough specific detail.', 'Phân rã tới Cấp 3/4 đủ chi tiết cụ thể.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Request 2 – Deliverables:</strong> list at least five milestones mapped to the main deliverables for the project. For each milestone, provide a short explanation of how to determine whether its status is completed or not.</p>`,
    `<p><strong>Yêu cầu 2 – Sản phẩm bàn giao:</strong> liệt kê ít nhất 5 mốc tương ứng sản phẩm bàn giao chính. Với mỗi mốc, giải thích ngắn gọn cách xác định đã hoàn thành hay chưa.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Milestone 1 — Pre-launch readiness complete:</strong> deliverable = app-store listing assets and beta test finished. Completed when: the app-store listing is approved by the store review team AND feedback has been collected from at least 50 beta testers.</p>
     <p><strong>Milestone 2 — App published live:</strong> deliverable = the app itself, publicly available. Completed when: the app-store developer dashboard shows status "Live" on all target stores.</p>
     <p><strong>Milestone 3 — Launch-day marketing executed:</strong> deliverable = the launch-day campaign. Completed when: the marketing checklist is fully checked off and the press release has been confirmed published.</p>
     <p><strong>Milestone 4 — First-week post-launch stability confirmed:</strong> deliverable = a stable, monitored app in production. Completed when: crash-rate and server-uptime analytics for the first 7 days are within the pre-agreed target thresholds.</p>
     <p><strong>Milestone 5 — Post-launch support &amp; retrospective complete:</strong> deliverable = closed support backlog + retrospective report. Completed when: the initial support-ticket backlog is cleared to zero AND the retrospective document is signed off by the project sponsor.</p>`,
    `<p><strong>Mốc 1 — Sẵn sàng trước ra mắt:</strong> sản phẩm = tài sản gian hàng app store và beta test xong. Hoàn thành khi: gian hàng app store được đội duyệt của kho ứng dụng chấp thuận VÀ đã thu thập phản hồi từ ít nhất 50 người beta test.</p>
     <p><strong>Mốc 2 — App phát hành chính thức:</strong> sản phẩm = chính app, công khai. Hoàn thành khi: bảng điều khiển nhà phát triển app store hiện trạng thái "Live" trên mọi kho mục tiêu.</p>
     <p><strong>Mốc 3 — Marketing ngày ra mắt đã thực hiện:</strong> sản phẩm = chiến dịch ngày ra mắt. Hoàn thành khi: checklist marketing đã đánh dấu đủ và thông cáo báo chí đã xác nhận phát hành.</p>
     <p><strong>Mốc 4 — Xác nhận ổn định tuần đầu sau ra mắt:</strong> sản phẩm = app ổn định, được giám sát trên production. Hoàn thành khi: số liệu tỉ lệ crash và uptime server 7 ngày đầu nằm trong ngưỡng mục tiêu đã thống nhất trước.</p>
     <p><strong>Mốc 5 — Hỗ trợ sau ra mắt &amp; tổng kết xong:</strong> sản phẩm = backlog hỗ trợ đã đóng + báo cáo tổng kết. Hoàn thành khi: backlog ticket hỗ trợ ban đầu về 0 VÀ tài liệu tổng kết đã được sponsor dự án ký duyệt.</p>`,
  ),
  rubric: [
    { id: 'five_milestones', criterion: B('Provides at least 5 distinct milestones tied to real deliverables of a product launch.', 'Nêu đủ ít nhất 5 mốc khác nhau, gắn sản phẩm bàn giao thật của 1 đợt ra mắt sản phẩm.'), weight: 1, maxScore: 0.6 },
    { id: 'measurement', criterion: B('Each milestone has a concrete, verifiable completion check.', 'Mỗi mốc có cách kiểm tra hoàn thành cụ thể, xác minh được.'), weight: 1, maxScore: 0.9 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 – Project Scheduling:</strong> assume that the project schedule has been defined and estimated with the activities below:</p>${cpmTable}
     <p>Draw a network diagram and find the project duration by applying critical path analysis. You must determine the duration in the appropriate time unit. List all the paths on the diagram to get the full score.</p>`,
    `<p><strong>Yêu cầu 3 – Lập lịch dự án:</strong> giả sử lịch trình dự án đã được xác định và ước lượng với các hoạt động sau:</p>${cpmTable}
     <p>Vẽ sơ đồ mạng lưới và tìm thời lượng dự án bằng phân tích đường găng. Xác định thời lượng đúng đơn vị thời gian. Liệt kê đủ mọi đường đi để được điểm tối đa.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>All paths (Start to End):</strong></p>
     <ul><li>Path 1: Start→A→E→H→End = 6+5+9 = 20 weeks</li>
     <li>Path 2: Start→A→B→G→I→End = 6+3+8+4 = 21 weeks</li>
     <li>Path 3: Start→A→B→C→F→I→End = 6+3+4+6+4 = 23 weeks</li>
     <li>Path 4: Start→A→B→D→F→I→End = 6+3+7+6+4 = 26 weeks</li>
     <li>Path 5: Start→A→B→C→F→H→End = 6+3+4+6+9 = 28 weeks</li>
     <li>Path 6: Start→A→B→D→F→H→End = 6+3+7+6+9 = <b>31 weeks</b></li></ul>
     <p><strong>Critical path:</strong> Path 6 (Start→A→B→D→F→H→End). <strong>Project duration:</strong> 31 weeks.</p>
     <p><strong>Float per activity</strong> (full forward + backward CPM pass): A=0 (critical), B=0 (critical), C=3, D=0 (critical), E=11, F=0 (critical), G=10, H=0 (critical), I=5.</p>`,
    `<p><strong>Tất cả đường đi (Start tới End):</strong></p>
     <ul><li>Đường 1: Start→A→E→H→End = 6+5+9 = 20 tuần</li>
     <li>Đường 2: Start→A→B→G→I→End = 6+3+8+4 = 21 tuần</li>
     <li>Đường 3: Start→A→B→C→F→I→End = 6+3+4+6+4 = 23 tuần</li>
     <li>Đường 4: Start→A→B→D→F→I→End = 6+3+7+6+4 = 26 tuần</li>
     <li>Đường 5: Start→A→B→C→F→H→End = 6+3+4+6+9 = 28 tuần</li>
     <li>Đường 6: Start→A→B→D→F→H→End = 6+3+7+6+9 = <b>31 tuần</b></li></ul>
     <p><strong>Đường găng:</strong> Đường 6 (Start→A→B→D→F→H→End). <strong>Thời lượng dự án:</strong> 31 tuần.</p>
     <p><strong>Float từng hoạt động</strong> (CPM xuôi+ngược đầy đủ): A=0 (găng), B=0 (găng), C=3, D=0 (găng), E=11, F=0 (găng), G=10, H=0 (găng), I=5.</p>`,
  ),
  explanation: B(
    `<p>Verified independently by hand (full forward + backward CPM pass, no source solution existed) — 6 distinct paths, critical path A-B-D-F-H at 31 weeks.</p>`,
    `<p>Đã tự tính tay độc lập (đầy đủ CPM xuôi+ngược, đề này không có solution) — 6 đường đi khác nhau, đường găng A-B-D-F-H ở 31 tuần.</p>`,
  ),
  rubric: [
    { id: 'all_paths', criterion: B('Correctly lists all 6 distinct paths with correct durations.', 'Liệt kê đúng đủ 6 đường đi với thời lượng đúng.'), weight: 1, maxScore: 0.7 },
    { id: 'critical_path_duration', criterion: B('Correctly identifies the critical path (A-B-D-F-H) and project duration (31 weeks).', 'Xác định đúng đường găng (A-B-D-F-H) và thời lượng dự án (31 tuần).'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Request 4 – Schedule Updating &amp; Tracking:</strong> based on the schedule in Request 3, after 3 weeks your sponsor informs you that he would like to receive the product of your project 5 weeks earlier than the planned schedule. Define at least 4 solutions, set the priority order for them, and include a relevant explanation of how each one helps your project to be developed faster so it can be accomplished on time.</p>`,
    `<p><strong>Yêu cầu 4 – Cập nhật &amp; Theo dõi lịch trình:</strong> dựa trên lịch trình Yêu cầu 3, sau 3 tuần nhà tài trợ báo muốn nhận sản phẩm SỚM HƠN 5 tuần so kế hoạch. Nêu ít nhất 4 giải pháp, xếp thứ tự ưu tiên, giải thích cách mỗi giải pháp giúp rút ngắn để hoàn thành đúng hạn.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Note:</strong> only the critical path (A-B-D-F-H, 31 weeks) determines the project duration, so all 4 solutions target activities on it. At week 3, activity A (ES=0, EF=6) is currently in progress. Ordered from lowest-cost/lowest-risk to highest, following standard schedule-compression practice (fast-track before crash):</p>
     <p><strong>Priority 1 — Fast-track D &amp; F:</strong> begin F's early tasks that don't strictly depend on D's fully-finished output while D is still finishing. Saves an estimated 2 weeks. Helps because it overlaps two large sequential critical-path activities (7+6=13 weeks combined) at very low added cost, though it carries some rework risk if D's late-stage changes affect F's early work.</p>
     <p><strong>Priority 2 — Fast-track A &amp; B:</strong> start B's initial planning/setup during A's final week rather than waiting for A to fully close out. Saves an estimated 1 week. Very low cost, minimal risk since A and B are both early, well-understood activities.</p>
     <p><strong>Priority 3 — Crash H:</strong> add extra resources to activity H, reducing it from 9 to 7 weeks. Saves an estimated 2 weeks. Higher cost (added labor/overtime), but H is the last critical activity before End, so there's little downstream work left to be disrupted by the added resources.</p>
     <p><strong>Priority 4 (contingency) — Crash D further:</strong> if solutions 1-3 above (which already total the full 5-week target: 2+1+2=5) underperform in practice, add resources to D itself to shave further weeks directly, as a backup lever.</p>`,
    `<p><strong>Lưu ý:</strong> chỉ đường găng (A-B-D-F-H, 31 tuần) quyết định thời lượng dự án, nên cả 4 giải pháp nhắm vào hoạt động đó. Ở tuần 3, hoạt động A (ES=0, EF=6) đang thực hiện. Xếp từ chi phí/rủi ro thấp nhất tới cao nhất, theo thực hành chuẩn rút ngắn lịch trình (fast-track trước, crash sau):</p>
     <p><strong>Ưu tiên 1 — Fast-track D &amp; F:</strong> bắt đầu việc đầu của F không phụ thuộc chặt vào đầu ra hoàn tất của D trong lúc D còn đang hoàn tất. Ước tính tiết kiệm 2 tuần. Giúp vì chồng lấn 2 hoạt động đường găng tuần tự lớn (7+6=13 tuần cộng lại) với chi phí tăng rất thấp, dù có rủi ro làm lại nếu D thay đổi muộn ảnh hưởng phần đầu của F.</p>
     <p><strong>Ưu tiên 2 — Fast-track A &amp; B:</strong> bắt đầu lập kế hoạch/chuẩn bị ban đầu của B trong tuần cuối của A thay vì đợi A xong hẳn. Ước tính tiết kiệm 1 tuần. Chi phí rất thấp, rủi ro tối thiểu vì cả A và B đều là hoạt động sớm, đã hiểu rõ.</p>
     <p><strong>Ưu tiên 3 — Crash H:</strong> thêm nguồn lực cho H, rút từ 9 xuống 7 tuần. Ước tính tiết kiệm 2 tuần. Chi phí cao hơn (thêm nhân công/tăng ca), nhưng H là hoạt động găng cuối trước End, nên còn ít việc phía sau bị ảnh hưởng bởi nguồn lực thêm vào.</p>
     <p><strong>Ưu tiên 4 (dự phòng) — Crash D thêm:</strong> nếu 3 giải pháp trên (đã cộng đủ mục tiêu 5 tuần: 2+1+2=5) không đạt như tính toán thực tế, thêm nguồn lực cho chính D để rút thêm trực tiếp, làm đòn bẩy dự phòng.</p>`,
  ),
  rubric: [
    { id: 'targets_critical_path', criterion: B('All 4 solutions correctly target activities on the critical path (A, B, D, F, or H) — not non-critical activities like C, E, G, or I.', 'Cả 4 giải pháp đúng nhắm vào hoạt động đường găng (A, B, D, F, hoặc H) — không phải hoạt động không găng như C, E, G, I.'), weight: 1, maxScore: 0.8 },
    { id: 'priority_and_explanation', criterion: B('Solutions are given a sensible priority order (e.g. lower-cost/lower-risk first) with a clear, specific explanation of how each helps reach the 5-week target.', 'Giải pháp có thứ tự ưu tiên hợp lý (VD chi phí/rủi ro thấp trước), giải thích rõ cách mỗi giải pháp giúp đạt mục tiêu rút 5 tuần.'), weight: 1, maxScore: 0.7 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 5 – Cost Evaluation:</strong> a senior project manager asks you to give him your estimation about the status of a project while training you as a junior project manager. He gives you: (1) the cost of the project was estimated at ten thousand USD ($10,000); (2) he planned that a team can complete the project in 30 days; (3) after 6 days, he got a report that 25% of the project jobs were completed; (4) the total spend for the project at that time was two thousand USD ($2,000); (5) he planned the completion workload and amount of spend equally for every day from the beginning to the end of the project. Use Earned Value Management to check the project status. Compute the PV, EV, AC, SV, CV, SPI, CPI, Estimated at Completion (EAC), and Estimate of Completion (schedule, in the appropriate time unit). Give some comments to explain the status (schedule/cost). Round results to 2 digits.</p>`,
    `<p><strong>Yêu cầu 5 – Đánh giá chi phí:</strong> một PM cấp cao nhờ bạn ước tính tình trạng dự án trong lúc đào tạo bạn làm PM tập sự. Ông cho biết: (1) chi phí dự án ước tính 10.000 USD; (2) kế hoạch nhóm hoàn thành trong 30 ngày; (3) sau 6 ngày, báo cáo cho thấy 25% công việc hoàn thành; (4) tổng chi tại thời điểm đó là 2.000 USD; (5) khối lượng hoàn thành kế hoạch và mức chi đều nhau mỗi ngày từ đầu tới cuối dự án. Dùng EVM kiểm tra tình trạng dự án. Tính PV, EV, AC, SV, CV, SPI, CPI, EAC, và Estimate of Completion (tiến độ, đúng đơn vị thời gian). Nhận xét tình trạng (tiến độ/chi phí). Làm tròn 2 chữ số.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Given:</strong> BAC=$10,000; planned duration=30 days; at 6 days, 25% complete; AC=$2,000; linear planned-progress assumption (condition 5).</p>
     <ul><li>PV = BAC × (6/30) = 10,000 × 0.20 = <b>$2,000.00</b></li>
     <li>EV = BAC × 25% = 10,000 × 0.25 = <b>$2,500.00</b></li>
     <li>AC = <b>$2,000.00</b> (given)</li>
     <li>SV = EV−PV = 2,500−2,000 = <b>+$500.00</b></li>
     <li>CV = EV−AC = 2,500−2,000 = <b>+$500.00</b></li>
     <li>SPI = EV/PV = 2,500/2,000 = <b>1.25</b></li>
     <li>CPI = EV/AC = 2,500/2,000 = <b>1.25</b></li>
     <li>EAC = BAC/CPI = 10,000/1.25 = <b>$8,000.00</b></li>
     <li>ETC = EAC−AC = 8,000−2,000 = <b>$6,000.00</b></li>
     <li>Estimate of Completion (schedule) = planned duration/SPI = 30/1.25 = <b>24.00 days</b></li></ul>
     <p><strong>Comments:</strong> SPI=1.25&gt;1 — the project is ahead of schedule (more work completed than planned at this point). CPI=1.25&gt;1 — the project is under budget (more value earned per dollar spent than planned). Both indicators are positive, which is the less common but favorable case: at this pace the project would finish in about 24 days (6 days early) at a cost of about $8,000 (about $2,000, or 20%, under the original $10,000 budget). This strong an over-performance this early (day 6 of 30) is worth double-checking — it may reflect a genuinely efficient team, or it may mean the original 30-day/$10,000 estimate itself was conservative; either way, it's worth revisiting the baseline before assuming this rate holds for the rest of the project.</p>`,
    `<p><strong>Dữ liệu cho:</strong> BAC=10.000$; kế hoạch 30 ngày; sau 6 ngày, 25% hoàn thành; AC=2.000$; giả định tiến độ kế hoạch tuyến tính (điều kiện 5).</p>
     <ul><li>PV = BAC × (6/30) = 10.000 × 0,20 = <b>2.000,00$</b></li>
     <li>EV = BAC × 25% = 10.000 × 0,25 = <b>2.500,00$</b></li>
     <li>AC = <b>2.000,00$</b> (đề cho)</li>
     <li>SV = EV−PV = 2.500−2.000 = <b>+500,00$</b></li>
     <li>CV = EV−AC = 2.500−2.000 = <b>+500,00$</b></li>
     <li>SPI = EV/PV = 2.500/2.000 = <b>1,25</b></li>
     <li>CPI = EV/AC = 2.500/2.000 = <b>1,25</b></li>
     <li>EAC = BAC/CPI = 10.000/1,25 = <b>8.000,00$</b></li>
     <li>ETC = EAC−AC = 8.000−2.000 = <b>6.000,00$</b></li>
     <li>Estimate of Completion (tiến độ) = thời lượng kế hoạch/SPI = 30/1,25 = <b>24,00 ngày</b></li></ul>
     <p><strong>Nhận xét:</strong> SPI=1,25&gt;1 — vượt tiến độ (hoàn thành nhiều việc hơn kế hoạch tại thời điểm này). CPI=1,25&gt;1 — dưới ngân sách (thu nhiều giá trị hơn mỗi đồng chi so kế hoạch). Cả 2 chỉ số đều tích cực, đây là trường hợp ít gặp hơn nhưng thuận lợi: với nhịp độ này dự án dự báo xong khoảng 24 ngày (sớm 6 ngày) với chi phí khoảng 8.000$ (thấp hơn khoảng 2.000$, tức 20%, so ngân sách gốc 10.000$). Vượt hiệu suất mạnh thế này ngay từ sớm (ngày 6/30) đáng để kiểm tra lại — có thể do nhóm thực sự hiệu quả, hoặc ước tính gốc 30 ngày/10.000$ vốn đã bảo thủ; dù lý do gì cũng nên xem lại baseline trước khi giả định nhịp độ này giữ nguyên cho phần còn lại dự án.</p>`,
  ),
  explanation: B(
    `<p>Verified independently by hand from the given data (no source solution existed). Both SPI and CPI landing on exactly the same value (1.25) is a direct consequence of PV and AC both equaling $2,000 in this specific dataset — flagged explicitly as a data coincidence, not a general EVM property.</p>`,
    `<p>Đã tự tính tay độc lập từ dữ liệu đề cho (đề không có solution). SPI và CPI trùng đúng 1 giá trị (1,25) là hệ quả trực tiếp của việc PV và AC đều bằng 2.000$ trong đúng bộ dữ liệu này — đã ghi rõ đây là trùng hợp dữ liệu, không phải tính chất chung của EVM.</p>`,
  ),
  rubric: [
    { id: 'pv_ev', criterion: B('Correctly calculates PV ($2,000.00) and EV ($2,500.00).', 'Tính đúng PV (2.000,00$) và EV (2.500,00$).'), weight: 1, maxScore: 0.6 },
    { id: 'sv_cv_spi_cpi', criterion: B('Correctly calculates SV, CV, SPI (1.25), and CPI (1.25).', 'Tính đúng SV, CV, SPI (1,25), và CPI (1,25).'), weight: 1, maxScore: 0.6 },
    { id: 'eac_schedule', criterion: B('Correctly calculates EAC ($8,000.00) and the schedule Estimate of Completion (24.00 days), both rounded to 2 digits.', 'Tính đúng EAC (8.000,00$) và Estimate of Completion tiến độ (24,00 ngày), đều làm tròn 2 chữ số.'), weight: 1, maxScore: 0.5 },
    { id: 'commentary', criterion: B('Correctly identifies the project as both ahead of schedule and under budget, with sensible commentary.', 'Nhận ra đúng dự án vừa vượt tiến độ vừa dưới ngân sách, kèm nhận xét hợp lý.'), weight: 1, maxScore: 0.3 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE15',
    title: 'PMG201c – Practical Exam (SU2023, FUDA 683), FitTrack Mobile App Launch|||PMG201c – Thi thực hành (SU2023, FUDA 683), Ra mắt app FitTrack',
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
