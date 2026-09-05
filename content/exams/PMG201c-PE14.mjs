export default {
  "course": {
    "courseCode": "PMG201c"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "WRITE",
      "code": "PE14",
      "title": "PMG201c – Final PE #2 (Summer 2024), Open Project Choice|||PMG201c – Final PE #2 (Summer 2024), Tự chọn dự án",
      "description": "PMG201c PE (WRITE), open-ended: project charter, Responsibility Assignment Matrix (RAM), QA/QC activities, phases/deliverables, cost estimation — AI-graded.|||PE PMG201c (viết), đề MỞ: charter dự án, bảng RAM, hoạt động QA/QC, giai đoạn/sản phẩm bàn giao, ước tính chi phí — chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>PMG201c – Final PE #2 (Summer 2024)</strong>. This is a written, open-ended project-management practical exam — you pick your own project. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p><div class=\"pe-system\"><b>Context (open-ended — this paper lets you pick your own project; the assumed project used in these sample answers is stated below):</b><p>Consider a project that you are working on, have worked on before, or one that is currently running around you. Pick a single project within your field of study at FU (for example, a software project for SE students). <br/><b>Assumed project for these sample answers: \"FU Textbook Exchange\" (TBX)</b> — a web marketplace where FU students list, browse, and arrange the exchange or sale of used textbooks among themselves.</p></div>|||<div class=\"pe-system\"><b>Bối cảnh (đề MỞ — bạn tự chọn dự án; dự án giả định dùng trong các câu trả lời mẫu dưới đây được nêu rõ):</b><p>Nghĩ về 1 dự án bạn đang làm, đã làm, hoặc đang diễn ra quanh bạn. Chọn 1 dự án trong ngành học tại FU (ví dụ: dự án phần mềm cho sinh viên SE). <br/><b>Dự án giả định dùng cho các câu trả lời mẫu: \"FU Textbook Exchange\" (TBX)</b> — chợ web nơi sinh viên FU đăng, tìm kiếm, và thu xếp trao đổi/bán sách giáo trình cũ cho nhau.</p></div></div><div class=\"ml-vi\"><p><strong>PMG201c – Final PE #2 (Summer 2024)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết, đề MỞ — bạn tự chọn dự án. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p><div class=\"pe-system\"><b>Context (open-ended — this paper lets you pick your own project; the assumed project used in these sample answers is stated below):</b><p>Consider a project that you are working on, have worked on before, or one that is currently running around you. Pick a single project within your field of study at FU (for example, a software project for SE students). <br/><b>Assumed project for these sample answers: \"FU Textbook Exchange\" (TBX)</b> — a web marketplace where FU students list, browse, and arrange the exchange or sale of used textbooks among themselves.</p></div>|||<div class=\"pe-system\"><b>Bối cảnh (đề MỞ — bạn tự chọn dự án; dự án giả định dùng trong các câu trả lời mẫu dưới đây được nêu rõ):</b><p>Nghĩ về 1 dự án bạn đang làm, đã làm, hoặc đang diễn ra quanh bạn. Chọn 1 dự án trong ngành học tại FU (ví dụ: dự án phần mềm cho sinh viên SE). <br/><b>Dự án giả định dùng cho các câu trả lời mẫu: \"FU Textbook Exchange\" (TBX)</b> — chợ web nơi sinh viên FU đăng, tìm kiếm, và thu xếp trao đổi/bán sách giáo trình cũ cho nhau.</p></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 1 (20%):</strong> provide the project name (title) and give a detailed description (answering what, why, how, etc.) in which you mention clearly its key characteristics: purpose/objectives, timeframe, customer/sponsor, project milestones, success criteria, and other project constraints (cost, resources, etc.).</p>|||<p><strong>Yêu cầu 1 (20%):</strong> nêu tên dự án và mô tả chi tiết (cái gì, tại sao, như thế nào), nêu rõ đặc điểm chính: mục đích/mục tiêu, thời gian, khách hàng/nhà tài trợ, mốc dự án, tiêu chí thành công, ràng buộc khác (chi phí, nguồn lực...).</p>",
          "sampleSolution": "<p><strong>Project title:</strong> FU Textbook Exchange (TBX).</p>\n     <p><strong>What/Why/How:</strong> TBX is a web marketplace where FU students post used textbooks they no longer need and browse/search for ones they do, arranging an exchange or a low-cost sale directly with another verified student. It exists because new textbooks are expensive and the current alternative — scattered, unmoderated Facebook groups — has no search, no trust signal, and no way to confirm the other party is really an FU student. It works via FU SSO login (so every user is a verified student), a searchable listing board by course code, and an in-app messaging feature to arrange the handoff.</p>\n     <p><strong>Purpose/Objectives:</strong> reduce textbook cost for students, reduce textbook waste through reuse, and provide a safe, verified-student-only marketplace to replace the unmoderated Facebook-group workaround.</p>\n     <p><strong>Timeframe:</strong> 6 months.</p>\n     <p><strong>Customer/Sponsor:</strong> FU Student Affairs Office.</p>\n     <p><strong>Project Milestones:</strong> Requirements gathering (4 weeks); System design (3 weeks); Development (10 weeks); Testing &amp; QA (4 weeks); Deployment &amp; launch (3 weeks).</p>\n     <p><strong>Success Criteria:</strong> platform used by at least 300 unique students in the first semester; at least 70% of listed textbooks marked \"exchanged/sold\" within 30 days of posting; user-reported successful-exchange satisfaction above 85% in a post-transaction survey.</p>\n     <p><strong>Other constraints:</strong> Cost — capped at $35,000. Resources — 1 project manager, 3 developers, 1 tester, 1 UI/UX designer. Technology — must integrate FU's SSO system for identity verification (a hard external dependency, not optional).</p>|||<p><strong>Tên dự án:</strong> FU Textbook Exchange (TBX).</p>\n     <p><strong>Cái gì/Tại sao/Như thế nào:</strong> TBX là chợ web nơi sinh viên FU đăng sách giáo trình cũ không dùng nữa và tìm/lọc sách cần mua, thu xếp trao đổi hoặc bán giá rẻ trực tiếp với sinh viên khác đã xác minh. Tồn tại vì sách giáo trình mới đắt và cách thay thế hiện tại — nhóm Facebook rời rạc, không kiểm duyệt — không có tìm kiếm, không có tín hiệu tin cậy, không xác nhận được người kia có thật là sinh viên FU. Hoạt động qua đăng nhập SSO FU (mọi người dùng đều đã xác minh sinh viên), bảng đăng tìm kiếm được theo mã môn học, và nhắn tin trong app để thu xếp trao tay.</p>\n     <p><strong>Mục đích/Mục tiêu:</strong> giảm chi phí sách cho sinh viên, giảm lãng phí sách qua tái sử dụng, và cung cấp chợ an toàn chỉ dành sinh viên đã xác minh thay cho giải pháp tạm Facebook không kiểm duyệt.</p>\n     <p><strong>Thời gian:</strong> 6 tháng.</p>\n     <p><strong>Khách hàng/Nhà tài trợ:</strong> Phòng Công tác Sinh viên FU.</p>\n     <p><strong>Mốc dự án:</strong> Thu thập yêu cầu (4 tuần); Thiết kế hệ thống (3 tuần); Phát triển (10 tuần); Kiểm thử &amp; QA (4 tuần); Triển khai &amp; ra mắt (3 tuần).</p>\n     <p><strong>Tiêu chí thành công:</strong> ít nhất 300 sinh viên duy nhất dùng nền tảng trong học kỳ đầu; ít nhất 70% sách đã đăng được đánh dấu \"đã trao đổi/bán\" trong 30 ngày kể từ lúc đăng; hài lòng người dùng với giao dịch thành công trên 85% trong khảo sát sau giao dịch.</p>\n     <p><strong>Ràng buộc khác:</strong> Chi phí — giới hạn 35.000$. Nguồn lực — 1 PM, 3 lập trình viên, 1 tester, 1 UI/UX designer. Công nghệ — bắt buộc tích hợp SSO của FU để xác minh danh tính (phụ thuộc ngoài cứng, không tuỳ chọn).</p>",
          "rubric": [
            {
              "id": "title_description",
              "criterion": "Gives a clear title and a description that genuinely answers what/why/how.|||Nêu tên rõ ràng và mô tả thực sự trả lời cái gì/tại sao/như thế nào.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "all_characteristics",
              "criterion": "Covers all 6 required characteristics: purpose/objectives, timeframe, customer/sponsor, milestones, success criteria, other constraints.|||Bao quát đủ 6 đặc điểm yêu cầu: mục đích/mục tiêu, thời gian, khách hàng/nhà tài trợ, mốc, tiêu chí thành công, ràng buộc khác.",
              "weight": 1,
              "maxScore": 1.2
            },
            {
              "id": "internal_consistency",
              "criterion": "Milestones, timeframe, and constraints are internally consistent with the stated project.|||Mốc, thời gian, và ràng buộc nhất quán với dự án đã nêu.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 2 (20%):</strong> create a Responsibility Assignment Matrix (RAM) with 10 work packages or activities that can be assigned to the team, and define the specific team members or roles who will complete each piece of work (R-Responsible, A-Accountable, C-Consult, or I-Inform).</p>|||<p><strong>Yêu cầu 2 (20%):</strong> xây bảng Phân công trách nhiệm (RAM) với 10 gói công việc/hoạt động gán cho nhóm, xác định vai trò/thành viên hoàn thành từng việc (R-Responsible, A-Accountable, C-Consult, I-Inform).</p>",
          "sampleSolution": "<table><tr><th>Work Package/Activity</th><th>Project Manager</th><th>Developers</th><th>Tester</th><th>UI/UX Designer</th><th>Database Admin</th></tr>\n     <tr><td>1. Requirements gathering</td><td>A</td><td>I</td><td>I</td><td>C</td><td>I</td></tr>\n     <tr><td>2. System design</td><td>A</td><td>C</td><td>I</td><td>R</td><td>C</td></tr>\n     <tr><td>3. Database schema design</td><td>I</td><td>C</td><td>I</td><td>I</td><td>R</td></tr>\n     <tr><td>4. Listing/search module development</td><td>I</td><td>R</td><td>I</td><td>C</td><td>C</td></tr>\n     <tr><td>5. In-app messaging module development</td><td>I</td><td>R</td><td>I</td><td>C</td><td>I</td></tr>\n     <tr><td>6. SSO integration development</td><td>A</td><td>R</td><td>I</td><td>I</td><td>C</td></tr>\n     <tr><td>7. Integration testing</td><td>I</td><td>C</td><td>R</td><td>I</td><td>I</td></tr>\n     <tr><td>8. User acceptance testing</td><td>C</td><td>I</td><td>R</td><td>C</td><td>I</td></tr>\n     <tr><td>9. Deployment</td><td>A</td><td>R</td><td>I</td><td>I</td><td>R</td></tr>\n     <tr><td>10. Post-launch support &amp; monitoring</td><td>A</td><td>C</td><td>I</td><td>I</td><td>C</td></tr></table>\n     <p><i>R=Responsible, A=Accountable, C=Consult, I=Inform. Every row has exactly one A, and no cell is left blank/ambiguous.</i></p>|||<table><tr><th>Gói công việc/Hoạt động</th><th>Project Manager</th><th>Lập trình viên</th><th>Tester</th><th>UI/UX Designer</th><th>Database Admin</th></tr>\n     <tr><td>1. Thu thập yêu cầu</td><td>A</td><td>I</td><td>I</td><td>C</td><td>I</td></tr>\n     <tr><td>2. Thiết kế hệ thống</td><td>A</td><td>C</td><td>I</td><td>R</td><td>C</td></tr>\n     <tr><td>3. Thiết kế schema database</td><td>I</td><td>C</td><td>I</td><td>I</td><td>R</td></tr>\n     <tr><td>4. Phát triển mô-đun đăng/tìm kiếm</td><td>I</td><td>R</td><td>I</td><td>C</td><td>C</td></tr>\n     <tr><td>5. Phát triển mô-đun nhắn tin trong app</td><td>I</td><td>R</td><td>I</td><td>C</td><td>I</td></tr>\n     <tr><td>6. Phát triển tích hợp SSO</td><td>A</td><td>R</td><td>I</td><td>I</td><td>C</td></tr>\n     <tr><td>7. Kiểm thử tích hợp</td><td>I</td><td>C</td><td>R</td><td>I</td><td>I</td></tr>\n     <tr><td>8. Kiểm thử chấp nhận người dùng (UAT)</td><td>C</td><td>I</td><td>R</td><td>C</td><td>I</td></tr>\n     <tr><td>9. Triển khai</td><td>A</td><td>R</td><td>I</td><td>I</td><td>R</td></tr>\n     <tr><td>10. Hỗ trợ &amp; giám sát sau ra mắt</td><td>A</td><td>C</td><td>I</td><td>I</td><td>C</td></tr></table>\n     <p><i>R=Chịu trách nhiệm thực hiện, A=Chịu trách nhiệm giải trình, C=Được tham vấn, I=Được thông báo. Mỗi dòng đúng 1 A, không ô nào để trống/mơ hồ.</i></p>",
          "rubric": [
            {
              "id": "ten_work_packages",
              "criterion": "Lists at least 10 distinct, realistic work packages/activities.|||Liệt kê ít nhất 10 gói công việc/hoạt động khác nhau, thực tế.",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "raci_assignment",
              "criterion": "Every work package has a full R/A/C/I assignment across team members/roles, with exactly one Accountable per row.|||Mỗi gói công việc có đủ gán R/A/C/I cho các vai trò, đúng 1 người Accountable mỗi dòng.",
              "weight": 1,
              "maxScore": 1.4
            },
            {
              "id": "realistic_roles",
              "criterion": "The roles/team members used match the resources stated in Request 1.|||Vai trò/thành viên dùng khớp nguồn lực đã nêu ở Yêu cầu 1.",
              "weight": 1,
              "maxScore": 0.2
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 3 (20%):</strong> define at least 5 quality assurance (QA) or quality control (QC) activities for the project. For each activity, classify it as QA or QC and clearly describe its purpose, when to perform it, and how to perform it.</p>|||<p><strong>Yêu cầu 3 (20%):</strong> xác định ít nhất 5 hoạt động đảm bảo chất lượng (QA) hoặc kiểm soát chất lượng (QC). Mỗi hoạt động phân loại QA/QC và mô tả rõ mục đích, khi nào làm, cách làm.</p>",
          "sampleSolution": "<p><strong>1. Code review (QA):</strong> purpose — ensure code quality and adherence to the team's coding standards before it reaches testing. When — during development, before each pull request is merged into the main branch. How — a peer developer reviews the diff against a checklist (naming conventions, error handling, SSO-security patterns) and approves or requests changes.</p>\n     <p><strong>2. Process/documentation audit (QA):</strong> purpose — ensure the project consistently follows its defined process and keeps documentation current. When — once at the end of each milestone. How — the project manager reviews process artifacts (requirements doc, design doc, test plan) against a checklist and logs any gaps.</p>\n     <p><strong>3. Unit testing (QC):</strong> purpose — validate that individual components (e.g. the listing-search filter, the messaging send function) work as intended in isolation. When — immediately after each module is coded, before it's merged. How — developers write and run automated unit tests covering normal and edge cases for their own module.</p>\n     <p><strong>4. Integration testing (QC):</strong> purpose — ensure the listing, messaging, and SSO modules work correctly together as one system. When — after all individual modules are developed and merged, during the Testing &amp; QA milestone. How — the tester executes test cases that specifically exercise cross-module flows (e.g. login via SSO → search a listing → send a message to the seller).</p>\n     <p><strong>5. User acceptance testing (QC):</strong> purpose — verify the system genuinely meets real student needs before launch. When — after integration testing passes, just before the Deployment milestone. How — a small group of real FU students uses the platform in a controlled pilot, following guided scenarios (list a book, search for a book, message a seller), with their feedback logged.</p>|||<p><strong>1. Code review (QA):</strong> mục đích — đảm bảo chất lượng mã và tuân thủ chuẩn code của nhóm trước khi vào kiểm thử. Khi nào — trong lúc phát triển, trước mỗi pull request được gộp vào nhánh chính. Cách làm — 1 lập trình viên khác review diff theo checklist (quy ước đặt tên, xử lý lỗi, mẫu bảo mật SSO) rồi duyệt hoặc yêu cầu sửa.</p>\n     <p><strong>2. Kiểm tra quy trình/tài liệu (QA):</strong> mục đích — đảm bảo dự án luôn tuân thủ quy trình đã định và tài liệu luôn được cập nhật. Khi nào — 1 lần vào cuối mỗi mốc. Cách làm — project manager review các tài liệu quy trình (yêu cầu, thiết kế, kế hoạch test) theo checklist và ghi lại lỗ hổng.</p>\n     <p><strong>3. Kiểm thử đơn vị (QC):</strong> mục đích — xác nhận từng thành phần riêng lẻ (lọc tìm kiếm đăng bài, hàm gửi tin nhắn) hoạt động đúng độc lập. Khi nào — ngay sau khi mỗi mô-đun được code, trước khi gộp nhánh. Cách làm — lập trình viên viết và chạy unit test tự động bao phủ trường hợp bình thường và biên cho mô-đun của mình.</p>\n     <p><strong>4. Kiểm thử tích hợp (QC):</strong> mục đích — đảm bảo mô-đun đăng bài, nhắn tin, và SSO hoạt động đúng cùng nhau như 1 hệ thống. Khi nào — sau khi mọi mô-đun đã phát triển và gộp xong, trong mốc Kiểm thử &amp; QA. Cách làm — tester chạy test case xuyên suốt luồng đa mô-đun (đăng nhập SSO → tìm sách → nhắn tin cho người bán).</p>\n     <p><strong>5. Kiểm thử chấp nhận người dùng (QC):</strong> mục đích — xác minh hệ thống thực sự đáp ứng nhu cầu sinh viên thật trước ra mắt. Khi nào — sau khi kiểm thử tích hợp đạt, ngay trước mốc Triển khai. Cách làm — 1 nhóm nhỏ sinh viên FU thật dùng nền tảng trong đợt thí điểm có kiểm soát, theo kịch bản hướng dẫn (đăng sách, tìm sách, nhắn người bán), ghi lại phản hồi.</p>",
          "rubric": [
            {
              "id": "five_activities",
              "criterion": "Defines at least 5 distinct QA/QC activities relevant to a software project.|||Xác định ít nhất 5 hoạt động QA/QC khác nhau, gắn với dự án phần mềm.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "correct_classification",
              "criterion": "Each activity is correctly classified as QA (process-focused, preventive) or QC (product-focused, inspection/testing).|||Mỗi hoạt động phân loại đúng QA (tập trung quy trình, phòng ngừa) hay QC (tập trung sản phẩm, kiểm tra/test).",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "purpose_when_how",
              "criterion": "Each activity states purpose, timing, and method clearly and specifically to this project.|||Mỗi hoạt động nêu rõ mục đích, thời điểm, cách làm, cụ thể gắn với dự án này.",
              "weight": 1,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 4 (20%):</strong> identify at least 4 project phases/iterations and 2 main deliverables in each phase/iteration. Provide the description for each identified deliverable about its content/purpose.</p>|||<p><strong>Yêu cầu 4 (20%):</strong> xác định ít nhất 4 giai đoạn/iteration dự án và 2 sản phẩm bàn giao chính mỗi giai đoạn. Mô tả nội dung/mục đích từng sản phẩm bàn giao.</p>",
          "sampleSolution": "<p><strong>Phase 1 — Initiation:</strong></p>\n     <ul><li>Deliverable 1: Project Charter — document stating TBX's purpose, sponsor, scope, and constraints; used to get formal go-ahead from the Student Affairs Office.</li>\n     <li>Deliverable 2: Initial Project Plan — high-level timeline, resource allocation, and milestone schedule for the 6-month run.</li></ul>\n     <p><strong>Phase 2 — Planning:</strong></p>\n     <ul><li>Deliverable 1: Requirements Specification — documents all functional (listing, search, messaging, SSO) and non-functional (performance, security) requirements.</li>\n     <li>Deliverable 2: System Design Document — the architecture blueprint, database schema, and UI wireframes that the dev team will build from.</li></ul>\n     <p><strong>Phase 3 — Execution:</strong></p>\n     <ul><li>Deliverable 1: Developed System Modules — the working listing/search, messaging, and SSO-integration modules, each independently coded and unit-tested.</li>\n     <li>Deliverable 2: Integrated System — all modules combined into one working application, ready for the Testing &amp; QA phase.</li></ul>\n     <p><strong>Phase 4 — Closure:</strong></p>\n     <ul><li>Deliverable 1: Deployment &amp; Launch Package — the production-deployed platform plus a launch communication sent to students.</li>\n     <li>Deliverable 2: Project Closure Report — final report summarizing what was delivered, lessons learned, and the post-launch support plan.</li></ul>|||<p><strong>Giai đoạn 1 — Khởi động:</strong></p>\n     <ul><li>Sản phẩm 1: Charter dự án — tài liệu nêu mục đích, nhà tài trợ, phạm vi, ràng buộc của TBX; dùng để xin phê duyệt chính thức từ Phòng Công tác Sinh viên.</li>\n     <li>Sản phẩm 2: Kế hoạch dự án ban đầu — lịch trình cấp cao, phân bổ nguồn lực, lịch mốc cho 6 tháng chạy.</li></ul>\n     <p><strong>Giai đoạn 2 — Lập kế hoạch:</strong></p>\n     <ul><li>Sản phẩm 1: Đặc tả yêu cầu — tài liệu mọi yêu cầu chức năng (đăng bài, tìm kiếm, nhắn tin, SSO) và phi chức năng (hiệu năng, bảo mật).</li>\n     <li>Sản phẩm 2: Tài liệu thiết kế hệ thống — bản thiết kế kiến trúc, schema database, wireframe UI để nhóm dev xây theo.</li></ul>\n     <p><strong>Giai đoạn 3 — Thực thi:</strong></p>\n     <ul><li>Sản phẩm 1: Các mô-đun hệ thống đã phát triển — mô-đun đăng/tìm kiếm, nhắn tin, tích hợp SSO hoạt động, mỗi cái code và unit-test độc lập.</li>\n     <li>Sản phẩm 2: Hệ thống đã tích hợp — mọi mô-đun gộp thành 1 ứng dụng hoạt động, sẵn sàng cho giai đoạn Kiểm thử &amp; QA.</li></ul>\n     <p><strong>Giai đoạn 4 — Kết thúc:</strong></p>\n     <ul><li>Sản phẩm 1: Gói triển khai &amp; ra mắt — nền tảng đã triển khai production cộng thông báo ra mắt gửi sinh viên.</li>\n     <li>Sản phẩm 2: Báo cáo kết thúc dự án — báo cáo cuối tóm tắt cái đã bàn giao, bài học kinh nghiệm, kế hoạch hỗ trợ sau ra mắt.</li></ul>",
          "rubric": [
            {
              "id": "four_phases",
              "criterion": "Identifies at least 4 distinct project phases/iterations.|||Xác định ít nhất 4 giai đoạn/iteration dự án khác nhau.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "two_deliverables_each",
              "criterion": "Each phase has at least 2 main deliverables.|||Mỗi giai đoạn có ít nhất 2 sản phẩm bàn giao chính.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "deliverable_descriptions",
              "criterion": "Each deliverable has a clear description of its content/purpose, specific to this project rather than generic.|||Mỗi sản phẩm bàn giao có mô tả nội dung/mục đích rõ ràng, cụ thể gắn dự án này, không chung chung.",
              "weight": 1,
              "maxScore": 0.7
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 5 (20%):</strong> provide at least 5 main cost items together with a description and an estimation for each cost item needed to complete the project. The estimation must be expressed in effort (man-days, man-hours).</p>|||<p><strong>Yêu cầu 5 (20%):</strong> nêu ít nhất 5 khoản chi phí chính kèm mô tả và ước tính công sức (man-day, man-hour) để hoàn thành dự án.</p>",
          "sampleSolution": "<p><strong>1. Development effort:</strong> time spent by the 3 developers writing and unit-testing the listing/search, messaging, and SSO-integration modules. Estimation: 220 man-days.</p>\n     <p><strong>2. Testing effort:</strong> time spent by the tester performing integration testing and coordinating UAT with pilot students. Estimation: 60 man-days.</p>\n     <p><strong>3. UI/UX design effort:</strong> time spent by the designer creating wireframes, the visual design, and refining the UI from usability feedback. Estimation: 40 man-days.</p>\n     <p><strong>4. Database design &amp; management:</strong> time spent designing the schema and managing the database through development and launch. Estimation: 25 man-days.</p>\n     <p><strong>5. Project management effort:</strong> time spent by the project manager coordinating the 6-month schedule, budget, and stakeholder communication across all 4 phases. Estimation: 35 man-days.</p>\n     <p><strong>6. Deployment &amp; post-launch support:</strong> time spent deploying to production and handling early user-reported issues in the first month after launch. Estimation: 15 man-days.</p>|||<p><strong>1. Công sức phát triển:</strong> thời gian 3 lập trình viên viết và unit-test mô-đun đăng/tìm kiếm, nhắn tin, tích hợp SSO. Ước tính: 220 man-day.</p>\n     <p><strong>2. Công sức kiểm thử:</strong> thời gian tester thực hiện kiểm thử tích hợp và điều phối UAT với sinh viên thí điểm. Ước tính: 60 man-day.</p>\n     <p><strong>3. Công sức thiết kế UI/UX:</strong> thời gian designer tạo wireframe, thiết kế trực quan, tinh chỉnh UI từ phản hồi khả dụng. Ước tính: 40 man-day.</p>\n     <p><strong>4. Thiết kế &amp; quản lý database:</strong> thời gian thiết kế schema và quản lý database xuyên suốt phát triển tới ra mắt. Ước tính: 25 man-day.</p>\n     <p><strong>5. Công sức quản lý dự án:</strong> thời gian project manager điều phối lịch 6 tháng, ngân sách, giao tiếp các bên qua đủ 4 giai đoạn. Ước tính: 35 man-day.</p>\n     <p><strong>6. Triển khai &amp; hỗ trợ sau ra mắt:</strong> thời gian triển khai production và xử lý sự cố người dùng báo cáo sớm trong tháng đầu sau ra mắt. Ước tính: 15 man-day.</p>",
          "rubric": [
            {
              "id": "five_items",
              "criterion": "Provides at least 5 distinct, realistic main cost items covering the whole project (not just development).|||Nêu ít nhất 5 khoản chi phí chính khác nhau, thực tế, bao quát cả dự án (không chỉ phát triển).",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "description_estimation",
              "criterion": "Each item has a specific description and an effort estimation in man-days/man-hours.|||Mỗi khoản có mô tả cụ thể và ước tính công sức bằng man-day/man-hour.",
              "weight": 1,
              "maxScore": 1
            }
          ]
        }
      ]
    }
  ]
};
