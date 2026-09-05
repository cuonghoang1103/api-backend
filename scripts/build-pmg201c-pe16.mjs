/**
 * build-pmg201c-pe16.mjs — sinh content/exams/PMG201c-PE16.mjs.
 *
 * Nguồn thật: "PMG201c - SU2023 - PE - FUDA [684]" ("Practical Exam 1
 * (PMG201c)", dự án New HR Web Application — NHRS — cho Ronald Company).
 * Không có solution số (chỉ có "Sample answer" là KHUNG mẫu trống, không
 * phải đáp án). Request 3 ghi rõ "the first activity has an early start
 * of 1" — quy ước ES bắt đầu từ 1 (không phải 0); đã kiểm chứng: EF mỗi
 * hoạt động không đổi giữa 2 quy ước, chỉ ES lệch +1, nên thời lượng dự
 * án (39 tuần) và đường găng không đổi dù quy ước nào — nhưng bảng
 * ES/EF/LS/LF trình bày đúng theo quy ước "ES đầu = 1" đề yêu cầu.
 *
 * CPM: đường găng Start-A-B-D-E-F-H-End = 39 tuần (6 đường đi). EVM
 * (Request 5): BAC=100M VND, SPI=1.20 (vượt tiến độ), CPI=1.00 (đúng
 * ngân sách — trùng hợp vì EV=AC=40M) — đã ghi rõ là trùng hợp dữ liệu.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PMG201c-PE16.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PMG201c-PE16.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const projectContext = B(
  `<div class="pe-system"><b>Context:</b><p>You serve as the Project Manager for the New HR Web Application (NHRS) project. This system is being built to bring Digital Transformation to the HR operations of Ronald Company. Its key features are: (1) User registration and password forgot; (2) Import CV from TopCV and LinkedIn system; (3) Job Posting; (4) Apply for job; (5) Interview scheduling &amp; management. You will go through the full development life cycle, following the processes and stages described in PMBOK.</p></div>`,
  `<div class="pe-system"><b>Bối cảnh:</b><p>Bạn là Project Manager của dự án New HR Web Application (NHRS). Hệ thống này xây để mang chuyển đổi số cho vận hành HR của Ronald Company. Tính năng chính: (1) Đăng ký người dùng và quên mật khẩu; (2) Nhập CV từ hệ thống TopCV và LinkedIn; (3) Đăng tin tuyển dụng; (4) Ứng tuyển; (5) Lên lịch &amp; quản lý phỏng vấn. Bạn sẽ đi qua đầy đủ vòng đời phát triển, theo các quy trình và giai đoạn mô tả trong PMBOK.</p></div>`,
);

const instructions = ML(
  `<p><strong>PMG201c – Practical Exam 1 (SU2023, FUDA [684]) — New HR Web Application (NHRS)</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>PMG201c – Thi thực hành 1 (SU2023, FUDA [684]) — New HR Web Application (NHRS)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const cpmTable = `<table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>
<tr><td>Start</td><td>-</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>10</td></tr>
<tr><td>B</td><td>A</td><td>1</td></tr><tr><td>C</td><td>A</td><td>5</td></tr>
<tr><td>D</td><td>B</td><td>7</td></tr><tr><td>E</td><td>C, D</td><td>6</td></tr>
<tr><td>F</td><td>E</td><td>5</td></tr><tr><td>G</td><td>E</td><td>1</td></tr>
<tr><td>H</td><td>G, F</td><td>10</td></tr><tr><td>I</td><td>G</td><td>2</td></tr>
<tr><td>End</td><td>H, I</td><td>0</td></tr></table>`;

const q1 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 1 – Work Breakdown Structure:</strong> create a WBS for the project that covers both management and engineering work. Decompose the work/scope down to level 3 or 4, following the given template (1. Initiating / 2. Planning / 3. Execution, Monitoring &amp; Controlling / 4. Closing).</p>`,
    `<p><strong>Yêu cầu 1 – Cấu trúc phân rã công việc (WBS):</strong> xây WBS bao quát cả công việc quản lý lẫn kỹ thuật. Phân rã tới cấp 3 hoặc 4, theo đúng khung đề cho (1. Khởi động / 2. Lập kế hoạch / 3. Thực thi, Giám sát &amp; Kiểm soát / 4. Kết thúc).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>1. Initiating:</strong> 1.1 Develop project charter (NHRS goals, Ronald Company Director as sponsor); 1.2 Identify stakeholders (HR team, IT department, job candidates, the Director); 1.3 Define the high-level scope of the 5 key features.</p>
     <p><strong>2. Planning:</strong> 2.1 Requirements specification for each feature (registration/password-reset, CV import, job posting, apply-for-job, interview scheduling); 2.2 System architecture &amp; tech-stack design; 2.3 Database design (users, CVs, job postings, applications, interview schedules); 2.4 UI/UX wireframes; 2.5 Test plan; 2.6 Risk &amp; resource plan.</p>
     <p><strong>3. Execution, Monitoring &amp; Controlling:</strong> 3.1 Develop the user registration &amp; password-forgot module; 3.2 Develop the CV-import integration with TopCV/LinkedIn; 3.3 Develop the job-posting module; 3.4 Develop the apply-for-job module; 3.5 Develop the interview scheduling &amp; management module; 3.6 Conduct unit/integration testing; 3.7 Conduct UAT with the HR team; 3.8 Monitor schedule/budget progress against the plan.</p>
     <p><strong>4. Closing:</strong> 4.1 Deploy to production; 4.2 Conduct user training for HR staff; 4.3 Write the project closure report &amp; lessons learned; 4.4 Hand over to the support team.</p>`,
    `<p><strong>1. Khởi động:</strong> 1.1 Xây charter dự án (mục tiêu NHRS, Giám đốc Ronald Company là sponsor); 1.2 Xác định các bên liên quan (nhóm HR, phòng IT, ứng viên, Giám đốc); 1.3 Xác định phạm vi cấp cao của 5 tính năng chính.</p>
     <p><strong>2. Lập kế hoạch:</strong> 2.1 Đặc tả yêu cầu từng tính năng (đăng ký/quên mật khẩu, nhập CV, đăng tin, ứng tuyển, lên lịch phỏng vấn); 2.2 Thiết kế kiến trúc hệ thống &amp; công nghệ; 2.3 Thiết kế database (người dùng, CV, tin tuyển dụng, đơn ứng tuyển, lịch phỏng vấn); 2.4 Wireframe UI/UX; 2.5 Kế hoạch kiểm thử; 2.6 Kế hoạch rủi ro &amp; nguồn lực.</p>
     <p><strong>3. Thực thi, Giám sát &amp; Kiểm soát:</strong> 3.1 Phát triển mô-đun đăng ký &amp; quên mật khẩu; 3.2 Phát triển tích hợp nhập CV với TopCV/LinkedIn; 3.3 Phát triển mô-đun đăng tin tuyển dụng; 3.4 Phát triển mô-đun ứng tuyển; 3.5 Phát triển mô-đun lên lịch &amp; quản lý phỏng vấn; 3.6 Kiểm thử đơn vị/tích hợp; 3.7 Thực hiện UAT với nhóm HR; 3.8 Giám sát tiến độ/ngân sách so kế hoạch.</p>
     <p><strong>4. Kết thúc:</strong> 4.1 Triển khai production; 4.2 Đào tạo nhân sự HR; 4.3 Viết báo cáo kết thúc dự án &amp; bài học kinh nghiệm; 4.4 Bàn giao cho nhóm hỗ trợ.</p>`,
  ),
  rubric: [
    { id: 'four_phases', criterion: B('Covers all 4 top-level phases exactly as templated (Initiating/Planning/Execution-Monitoring&Controlling/Closing).', 'Bao quát đủ 4 giai đoạn cấp cao đúng khung đề (Khởi động/Lập kế hoạch/Thực thi-Giám sát&Kiểm soát/Kết thúc).'), weight: 1, maxScore: 0.5 },
    { id: 'both_mgmt_and_eng', criterion: B('Includes BOTH management work (charter, stakeholders, risk/resource plan) AND engineering work (each of the 5 NHRS features individually), as explicitly required.', 'Có cả công việc quản lý (charter, bên liên quan, kế hoạch rủi ro/nguồn lực) LẪN công việc kỹ thuật (từng tính năng NHRS riêng lẻ), đúng yêu cầu rõ ràng của đề.'), weight: 1, maxScore: 1.1 },
    { id: 'sufficient_depth', criterion: B('Breaks work down to level 3/4 with enough specific detail.', 'Phân rã tới cấp 3/4 đủ chi tiết cụ thể.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Request 2 – Milestone &amp; Deliverable:</strong> using your WBS, identify at least 5 milestones for the project. For each milestone, provide a short description, list at least 2 deliverables that correspond to the milestone, and propose your estimated duration.</p>`,
    `<p><strong>Yêu cầu 2 – Mốc &amp; Sản phẩm bàn giao:</strong> dựa trên WBS của bạn, xác định ít nhất 5 mốc dự án. Mỗi mốc có mô tả ngắn, ít nhất 2 sản phẩm bàn giao tương ứng, và đề xuất thời lượng ước tính.</p>`,
  ),
  sampleSolution: B(
    `<table><tr><th>Milestone</th><th>Description</th><th>Deliverables</th><th>Estimated Duration</th></tr>
     <tr><td>Initiation</td><td>Kickoff and charter approval</td><td>Project charter; Stakeholder register</td><td>1 week</td></tr>
     <tr><td>Planning</td><td>Complete requirements &amp; design</td><td>Requirements specification; System design document + DB schema</td><td>3 weeks</td></tr>
     <tr><td>Execution 1</td><td>Release v1.0 with registration &amp; CV-import features</td><td>Registration/password-reset module; CV-import module</td><td>6 weeks</td></tr>
     <tr><td>Execution 2</td><td>Release v2.0 with job-posting &amp; apply features</td><td>Job-posting module; Apply-for-job module</td><td>6 weeks</td></tr>
     <tr><td>Execution 3</td><td>Release v3.0 with interview scheduling + full testing</td><td>Interview scheduling module; UAT sign-off report</td><td>5 weeks</td></tr>
     <tr><td>Closing</td><td>Deploy &amp; handover</td><td>Production deployment confirmation; Training materials + closure report</td><td>2 weeks</td></tr></table>`,
    `<table><tr><th>Mốc</th><th>Mô tả</th><th>Sản phẩm bàn giao</th><th>Thời lượng ước tính</th></tr>
     <tr><td>Khởi động</td><td>Kickoff và duyệt charter</td><td>Charter dự án; Sổ bên liên quan</td><td>1 tuần</td></tr>
     <tr><td>Lập kế hoạch</td><td>Hoàn tất yêu cầu &amp; thiết kế</td><td>Đặc tả yêu cầu; Tài liệu thiết kế hệ thống + schema DB</td><td>3 tuần</td></tr>
     <tr><td>Thực thi 1</td><td>Ra bản v1.0 với tính năng đăng ký &amp; nhập CV</td><td>Mô-đun đăng ký/quên mật khẩu; Mô-đun nhập CV</td><td>6 tuần</td></tr>
     <tr><td>Thực thi 2</td><td>Ra bản v2.0 với tính năng đăng tin &amp; ứng tuyển</td><td>Mô-đun đăng tin; Mô-đun ứng tuyển</td><td>6 tuần</td></tr>
     <tr><td>Thực thi 3</td><td>Ra bản v3.0 với lên lịch phỏng vấn + kiểm thử toàn diện</td><td>Mô-đun lên lịch phỏng vấn; Báo cáo UAT ký duyệt</td><td>5 tuần</td></tr>
     <tr><td>Kết thúc</td><td>Triển khai &amp; bàn giao</td><td>Xác nhận triển khai production; Tài liệu đào tạo + báo cáo kết thúc</td><td>2 tuần</td></tr></table>`,
  ),
  rubric: [
    { id: 'five_milestones', criterion: B('Identifies at least 5 milestones consistent with the WBS in Request 1.', 'Xác định ít nhất 5 mốc, nhất quán với WBS Yêu cầu 1.'), weight: 1, maxScore: 0.6 },
    { id: 'two_deliverables_each', criterion: B('Each milestone has at least 2 corresponding deliverables and an estimated duration.', 'Mỗi mốc có ít nhất 2 sản phẩm bàn giao tương ứng và thời lượng ước tính.'), weight: 1, maxScore: 0.9 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 3,
  prompt: B(
    `<p><strong>Request 3 – Project Scheduling:</strong> assume that the project activities have been defined and estimated as shown below:</p>${cpmTable}
     <p>Produce a critical path analysis report that includes: (1) all the paths from project start to end, with the duration of each path; (2) the critical path and the total project duration; (3) the Early Start, Early Finish, Late Start, Late Finish, and Float of each activity (the first activity has an early start of 1).</p>`,
    `<p><strong>Yêu cầu 3 – Lập lịch dự án:</strong> giả sử các hoạt động dự án đã xác định và ước lượng như sau:</p>${cpmTable}
     <p>Lập báo cáo phân tích đường găng gồm: (1) mọi đường đi từ đầu tới cuối dự án, kèm thời lượng mỗi đường; (2) đường găng và tổng thời lượng dự án; (3) Early Start, Early Finish, Late Start, Late Finish, và Float của mỗi hoạt động (hoạt động đầu tiên có early start = 1).</p>`,
  ),
  sampleSolution: B(
    `<p><strong>All paths (Start to End):</strong></p>
     <ul><li>Path 1: Start→A→C→E→G→I→End = 10+5+6+1+2 = 24 weeks</li>
     <li>Path 2: Start→A→B→D→E→G→I→End = 10+1+7+6+1+2 = 27 weeks</li>
     <li>Path 3: Start→A→C→E→G→H→End = 10+5+6+1+10 = 32 weeks</li>
     <li>Path 4: Start→A→B→D→E→G→H→End = 10+1+7+6+1+10 = 35 weeks</li>
     <li>Path 5: Start→A→C→E→F→H→End = 10+5+6+5+10 = 36 weeks</li>
     <li>Path 6: Start→A→B→D→E→F→H→End = 10+1+7+6+5+10 = <b>39 weeks</b></li></ul>
     <p><strong>Critical path:</strong> Path 6 (Start→A→B→D→E→F→H→End). <strong>Project duration:</strong> 39 weeks.</p>
     <p><strong>ES/EF/LS/LF/Float per activity</strong> (using the required convention where the first activity's Early Start = 1, so EF = ES + duration − 1, and each successor's ES = the max EF among its predecessors + 1):</p>
     <table><tr><th>Activity</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>A</td><td>1</td><td>10</td><td>1</td><td>10</td><td>0 (critical)</td></tr>
     <tr><td>B</td><td>11</td><td>11</td><td>11</td><td>11</td><td>0 (critical)</td></tr>
     <tr><td>C</td><td>11</td><td>15</td><td>14</td><td>18</td><td>3</td></tr>
     <tr><td>D</td><td>12</td><td>18</td><td>12</td><td>18</td><td>0 (critical)</td></tr>
     <tr><td>E</td><td>19</td><td>24</td><td>19</td><td>24</td><td>0 (critical)</td></tr>
     <tr><td>F</td><td>25</td><td>29</td><td>25</td><td>29</td><td>0 (critical)</td></tr>
     <tr><td>G</td><td>25</td><td>25</td><td>29</td><td>29</td><td>4</td></tr>
     <tr><td>H</td><td>30</td><td>39</td><td>30</td><td>39</td><td>0 (critical)</td></tr>
     <tr><td>I</td><td>26</td><td>27</td><td>38</td><td>39</td><td>12</td></tr></table>`,
    `<p><strong>Tất cả đường đi (Start tới End):</strong></p>
     <ul><li>Đường 1: Start→A→C→E→G→I→End = 10+5+6+1+2 = 24 tuần</li>
     <li>Đường 2: Start→A→B→D→E→G→I→End = 10+1+7+6+1+2 = 27 tuần</li>
     <li>Đường 3: Start→A→C→E→G→H→End = 10+5+6+1+10 = 32 tuần</li>
     <li>Đường 4: Start→A→B→D→E→G→H→End = 10+1+7+6+1+10 = 35 tuần</li>
     <li>Đường 5: Start→A→C→E→F→H→End = 10+5+6+5+10 = 36 tuần</li>
     <li>Đường 6: Start→A→B→D→E→F→H→End = 10+1+7+6+5+10 = <b>39 tuần</b></li></ul>
     <p><strong>Đường găng:</strong> Đường 6 (Start→A→B→D→E→F→H→End). <strong>Thời lượng dự án:</strong> 39 tuần.</p>
     <p><strong>ES/EF/LS/LF/Float từng hoạt động</strong> (theo đúng quy ước đề yêu cầu: hoạt động đầu Early Start = 1, nên EF = ES + thời lượng − 1, và ES của hoạt động sau = EF lớn nhất trong các tiền đề + 1):</p>
     <table><tr><th>Hoạt động</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Float</th></tr>
     <tr><td>A</td><td>1</td><td>10</td><td>1</td><td>10</td><td>0 (găng)</td></tr>
     <tr><td>B</td><td>11</td><td>11</td><td>11</td><td>11</td><td>0 (găng)</td></tr>
     <tr><td>C</td><td>11</td><td>15</td><td>14</td><td>18</td><td>3</td></tr>
     <tr><td>D</td><td>12</td><td>18</td><td>12</td><td>18</td><td>0 (găng)</td></tr>
     <tr><td>E</td><td>19</td><td>24</td><td>19</td><td>24</td><td>0 (găng)</td></tr>
     <tr><td>F</td><td>25</td><td>29</td><td>25</td><td>29</td><td>0 (găng)</td></tr>
     <tr><td>G</td><td>25</td><td>25</td><td>29</td><td>29</td><td>4</td></tr>
     <tr><td>H</td><td>30</td><td>39</td><td>30</td><td>39</td><td>0 (găng)</td></tr>
     <tr><td>I</td><td>26</td><td>27</td><td>38</td><td>39</td><td>12</td></tr></table>`,
  ),
  explanation: B(
    `<p>Verified independently by hand (full forward + backward CPM pass, no source solution existed). Confirmed that switching between the standard 0-based ES convention and the paper's requested "first ES=1" convention shifts every ES/LS value by exactly +1 while leaving every EF/LF value (and therefore the critical path and 39-week total duration) unchanged — so the 1-based table above is the correctly-requested format, not a different answer.</p>`,
    `<p>Đã tự tính tay độc lập (đầy đủ CPM xuôi+ngược, đề này không có solution). Đã kiểm chứng: đổi giữa quy ước ES chuẩn bắt đầu từ 0 và quy ước đề yêu cầu "ES đầu = 1" chỉ dịch mọi giá trị ES/LS thêm đúng +1, còn mọi giá trị EF/LF (và do đó đường găng cùng tổng thời lượng 39 tuần) không đổi — nên bảng theo quy ước 1 ở trên đúng định dạng đề yêu cầu, không phải một đáp án khác.</p>`,
  ),
  rubric: [
    { id: 'all_paths', criterion: B('Correctly lists all 6 distinct paths with correct durations.', 'Liệt kê đúng đủ 6 đường đi với thời lượng đúng.'), weight: 1, maxScore: 0.6 },
    { id: 'critical_path_duration', criterion: B('Correctly identifies the critical path (A-B-D-E-F-H) and project duration (39 weeks).', 'Xác định đúng đường găng (A-B-D-E-F-H) và thời lượng dự án (39 tuần).'), weight: 1, maxScore: 0.5 },
    { id: 'es_ef_ls_lf_float', criterion: B('Correctly computes ES, EF, LS, LF, and float for every activity using the ES=1 convention specified in the paper.', 'Tính đúng ES, EF, LS, LF, và float cho mọi hoạt động theo đúng quy ước ES=1 đề yêu cầu.'), weight: 1, maxScore: 0.9 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Request 4 – Schedule Adjusting:</strong> after 15 weeks, your sponsor asks you to accelerate and complete the project 5 weeks earlier. Define 2 solutions with relevant explanations to achieve that (how each one helps, the difficulties, and the impacts on the project). You may state your assumptions for the explanations if needed.</p>`,
    `<p><strong>Yêu cầu 4 – Điều chỉnh lịch trình:</strong> sau 15 tuần, nhà tài trợ yêu cầu đẩy nhanh và hoàn thành dự án SỚM HƠN 5 tuần. Nêu 2 giải pháp kèm giải thích (cách giúp, khó khăn, tác động lên dự án). Có thể nêu giả định nếu cần.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Status at week 15</strong> (using the ES=1 convention from Request 3): A (1-10) and B (11-11) are already finished; C (11-15) is just finishing; D (12-18, on the critical path) is in progress with 3 weeks remaining. E, F, G, H, I have not started yet.</p>
     <p><strong>Solution 1 — Crash activity H:</strong> H is the largest remaining critical-path activity (10 weeks, not starting until week 30) — add a second team/extra resources to cut it from 10 to 5 weeks, saving the full 5 weeks needed in a single move. How it helps: H alone carries the entire 5-week gap, so no other activity needs to change. Difficulties: requires hiring/reassigning skilled staff and onboarding them onto NHRS before week 30 — a real risk if qualified people aren't available in time. Impacts: increased budget (extra staffing cost) and a moderate quality risk if the new team isn't fully ramped up, though the 15 weeks of lead time before H starts helps mitigate that.</p>
     <p><strong>Solution 2 — Fast-track D and E (assumption: E's work can be split into a portion that only needs C's output and a portion that needs D's output too):</strong> start the C-dependent part of E as soon as C finishes (week 15) instead of waiting for D to also finish (week 18), potentially saving up to 3 weeks. How it helps: overlaps two sequential critical-path activities without adding cost. Difficulties: depends on E actually being splittable this way — if it isn't, this solution saves nothing; also carries rework risk if D's late-stage output changes something E's early-started portion already used. Impacts: no direct budget increase, but tighter coordination is needed between D's and E's owners, and this solution alone (3 weeks) doesn't fully close the 5-week gap, so it would need to be combined with a smaller crash elsewhere (e.g. 2 weeks off F) to reach the full target — making Solution 1 the more self-sufficient choice if only one can be picked.</p>`,
    `<p><strong>Tình trạng tại tuần 15</strong> (theo quy ước ES=1 ở Yêu cầu 3): A (1-10) và B (11-11) đã xong; C (11-15) vừa xong; D (12-18, thuộc đường găng) đang thực hiện, còn 3 tuần. E, F, G, H, I chưa bắt đầu.</p>
     <p><strong>Giải pháp 1 — Crash hoạt động H:</strong> H là hoạt động đường găng còn lại lớn nhất (10 tuần, chưa bắt đầu tới tuần 30) — thêm nhóm thứ 2/nguồn lực để rút từ 10 xuống 5 tuần, tiết kiệm đủ 5 tuần cần thiết trong 1 bước. Cách giúp: H một mình mang toàn bộ khoảng cách 5 tuần, không hoạt động nào khác cần đổi. Khó khăn: cần tuyển/điều chuyển nhân sự có kỹ năng và onboard vào NHRS trước tuần 30 — rủi ro thật nếu không có người phù hợp kịp lúc. Tác động: tăng ngân sách (chi phí nhân sự thêm) và rủi ro chất lượng vừa phải nếu nhóm mới chưa quen việc, dù 15 tuần đệm trước khi H bắt đầu giúp giảm rủi ro đó.</p>
     <p><strong>Giải pháp 2 — Fast-track D và E (giả định: công việc của E có thể tách thành phần chỉ cần đầu ra của C và phần cần cả đầu ra của D):</strong> bắt đầu phần E phụ thuộc C ngay khi C xong (tuần 15) thay vì đợi D cũng xong (tuần 18), có thể tiết kiệm tới 3 tuần. Cách giúp: chồng lấn 2 hoạt động đường găng tuần tự mà không tăng chi phí. Khó khăn: phụ thuộc việc E thực sự tách được như vậy — nếu không, giải pháp này không tiết kiệm gì; còn có rủi ro làm lại nếu đầu ra muộn của D thay đổi thứ phần E đã bắt đầu dùng. Tác động: không tăng ngân sách trực tiếp, nhưng cần phối hợp sát hơn giữa người phụ trách D và E, và riêng giải pháp này (3 tuần) chưa đủ đóng khoảng cách 5 tuần, cần kết hợp thêm crash nhỏ ở chỗ khác (VD giảm 2 tuần ở F) để đạt đủ mục tiêu — khiến Giải pháp 1 tự đủ hơn nếu chỉ được chọn 1.</p>`,
  ),
  rubric: [
    { id: 'targets_critical_path', criterion: B('Both solutions correctly target activities on the critical path (A, B, D, E, F, or H) — not non-critical activities like C, G, or I.', 'Cả 2 giải pháp đúng nhắm vào hoạt động đường găng (A, B, D, E, F, hoặc H) — không phải hoạt động không găng như C, G, I.'), weight: 1, maxScore: 0.7 },
    { id: 'how_difficulties_impacts', criterion: B('Each solution explains how it helps, the difficulties involved, and the impacts on the project, consistent with the week-15 status.', 'Mỗi giải pháp giải thích cách giúp, khó khăn, và tác động, nhất quán với tình trạng tuần 15.'), weight: 1, maxScore: 0.8 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Request 5 – Performance Analysis:</strong> you are the PM of a project with a budget of 100M VND and a duration of 12 weeks. After 4 weeks, you review the records and find that you have spent 40M VND while 40% of the work has been completed. Perform an Earned Value Analysis and provide your comments: current status (above/behind schedule? under/over budget?), forecast, and recommend adjustments.</p>`,
    `<p><strong>Yêu cầu 5 – Phân tích hiệu suất:</strong> bạn là PM của dự án ngân sách 100M VND, thời lượng 12 tuần. Sau 4 tuần, ghi nhận đã chi 40M VND trong khi 40% công việc đã hoàn thành. Thực hiện phân tích EVM và nhận xét: tình trạng hiện tại (vượt/trễ tiến độ? dưới/vượt ngân sách?), dự báo, và đề xuất điều chỉnh.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Given:</strong> BAC=100M VND; planned duration=12 weeks; at 4 weeks, 40% complete; AC=40M VND.</p>
     <ul><li>PV = BAC × (4/12) = 100 × (1/3) = <b>33.33M VND</b></li>
     <li>EV = BAC × 40% = 100 × 0.40 = <b>40.00M VND</b></li>
     <li>AC = <b>40.00M VND</b> (given)</li>
     <li>SV = EV−PV = 40.00−33.33 = <b>+6.67M VND</b></li>
     <li>CV = EV−AC = 40.00−40.00 = <b>0.00M VND</b></li>
     <li>SPI = EV/PV = 40/33.33 = <b>1.20</b></li>
     <li>CPI = EV/AC = 40/40 = <b>1.00</b></li>
     <li>EAC = BAC/CPI = 100/1.00 = <b>100.00M VND</b></li>
     <li>ETC = EAC−AC = 100−40 = <b>60.00M VND</b></li>
     <li>Schedule forecast = planned duration/SPI = 12/1.20 = <b>10.00 weeks</b></li></ul>
     <p><strong>Current status:</strong> ahead of schedule (SPI=1.20 &gt; 1, more work done than planned at this point) and exactly on budget (CPI=1.00, cost variance is zero — the amount spent so far exactly matches the value earned).</p>
     <p><strong>Forecast:</strong> at this pace, the project is forecast to finish in about 10 weeks (2 weeks early) for the same 100M VND total budget — no cost overrun projected.</p>
     <p><strong>Recommended adjustments:</strong> no corrective action is strictly required since cost performance is exactly on plan; however, (1) validate that the reported "40% complete" is an objective measure (e.g. tied to completed deliverables) rather than an optimistic self-estimate, since percent-complete self-reporting is a common source of EVM distortion; (2) if the ahead-of-schedule pace holds, consider whether resources freed up early could be reallocated to de-risk later, harder milestones rather than simply idled.</p>`,
    `<p><strong>Dữ liệu cho:</strong> BAC=100M VND; kế hoạch 12 tuần; sau 4 tuần, 40% hoàn thành; AC=40M VND.</p>
     <ul><li>PV = BAC × (4/12) = 100 × (1/3) = <b>33,33M VND</b></li>
     <li>EV = BAC × 40% = 100 × 0,40 = <b>40,00M VND</b></li>
     <li>AC = <b>40,00M VND</b> (đề cho)</li>
     <li>SV = EV−PV = 40,00−33,33 = <b>+6,67M VND</b></li>
     <li>CV = EV−AC = 40,00−40,00 = <b>0,00M VND</b></li>
     <li>SPI = EV/PV = 40/33,33 = <b>1,20</b></li>
     <li>CPI = EV/AC = 40/40 = <b>1,00</b></li>
     <li>EAC = BAC/CPI = 100/1,00 = <b>100,00M VND</b></li>
     <li>ETC = EAC−AC = 100−40 = <b>60,00M VND</b></li>
     <li>Dự báo tiến độ = thời lượng kế hoạch/SPI = 12/1,20 = <b>10,00 tuần</b></li></ul>
     <p><strong>Tình trạng hiện tại:</strong> vượt tiến độ (SPI=1,20 &gt; 1, làm nhiều việc hơn kế hoạch tại thời điểm này) và đúng ngân sách (CPI=1,00, chênh lệch chi phí bằng 0 — số đã chi khớp đúng giá trị đã thu).</p>
     <p><strong>Dự báo:</strong> với nhịp độ này, dự án dự báo xong khoảng 10 tuần (sớm 2 tuần) với cùng tổng ngân sách 100M VND — không dự báo vượt chi phí.</p>
     <p><strong>Đề xuất điều chỉnh:</strong> không bắt buộc phải hành động sửa chữa vì hiệu suất chi phí đúng kế hoạch; tuy nhiên (1) xác minh con số "40% hoàn thành" báo cáo là đo khách quan (VD gắn với sản phẩm bàn giao đã xong) chứ không phải tự ước tính lạc quan, vì tự báo cáo % hoàn thành là nguồn sai lệch EVM phổ biến; (2) nếu nhịp vượt tiến độ này giữ nguyên, cân nhắc dùng nguồn lực rảnh sớm để giảm rủi ro cho các mốc khó hơn về sau thay vì để không.</p>`,
  ),
  explanation: B(
    `<p>Verified independently by hand from the given data (no source solution existed). CV landing on exactly 0 is a direct consequence of EV and AC both equaling 40M in this specific dataset — a data coincidence, not a general EVM property.</p>`,
    `<p>Đã tự tính tay độc lập từ dữ liệu đề cho (đề không có solution). CV bằng đúng 0 là hệ quả trực tiếp của EV và AC đều bằng 40M trong đúng bộ dữ liệu này — trùng hợp dữ liệu, không phải tính chất chung của EVM.</p>`,
  ),
  rubric: [
    { id: 'pv_ev_ac', criterion: B('Correctly calculates PV (33.33M) and EV (40.00M).', 'Tính đúng PV (33,33M) và EV (40,00M).'), weight: 1, maxScore: 0.5 },
    { id: 'sv_cv_spi_cpi', criterion: B('Correctly calculates SV, CV (0), SPI (1.20), and CPI (1.00).', 'Tính đúng SV, CV (0), SPI (1,20), và CPI (1,00).'), weight: 1, maxScore: 0.6 },
    { id: 'eac_schedule_forecast', criterion: B('Correctly calculates EAC (100M) and the schedule forecast (10 weeks).', 'Tính đúng EAC (100M) và dự báo tiến độ (10 tuần).'), weight: 1, maxScore: 0.5 },
    { id: 'status_forecast_recommend', criterion: B('Correctly states current status (ahead of schedule, exactly on budget), gives a coherent forecast, and a sensible recommendation.', 'Nêu đúng tình trạng hiện tại (vượt tiến độ, đúng ngân sách), dự báo mạch lạc, đề xuất hợp lý.'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'PMG201c' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE16',
    title: 'PMG201c – Practical Exam 1 (SU2023, FUDA 684), New HR Web Application (NHRS)|||PMG201c – Thi thực hành 1 (SU2023, FUDA 684), New HR Web Application (NHRS)',
    description: 'PMG201c PE (WRITE): WBS (management + engineering), milestones/deliverables, critical path method with ES=1 convention, schedule acceleration, and earned value analysis, AI-graded.|||PE PMG201c (viết): WBS (quản lý + kỹ thuật), mốc/sản phẩm bàn giao, phân tích đường găng theo quy ước ES=1, đẩy nhanh lịch trình, và phân tích EVM, chấm AI.',
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
