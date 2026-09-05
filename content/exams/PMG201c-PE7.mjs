export default {
  "course": {
    "courseCode": "PMG201c"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "WRITE",
      "code": "PE7",
      "title": "PMG201c – Final Practice Examination #1 (Spring 2024)|||PMG201c – Thi thực hành thử #1 (Spring 2024)",
      "description": "PMG201c PE (WRITE, open-ended project choice): project charter, organization structure, risk register, critical path method (CPM) with schedule recovery, and earned value management (EVM), AI-graded.|||PE PMG201c (viết, tự chọn dự án): hồ sơ dự án, cấu trúc tổ chức, sổ rủi ro, phân tích đường găng (CPM) kèm phục hồi tiến độ, và quản lý giá trị thu được (EVM), chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>PMG201c – Final Practice Examination #1 (Spring 2024)</strong>. This is a written project-management practical exam. There is no code to write; each answer is graded by an AI grader against the rubric shown per question.</p>\n   <p>This paper is open-ended: \"think about projects you are currently involved in, have been involved in before, or that are being carried out around you. Choose one project in your studying fields at FU (i.e. software project for SE), then provide solutions/answers based on your understanding of the project and assumptions.\" The sample answers below use a chosen example project — a <b>Student Course Registration System</b> for a university — consistently across Requests 1-3.</p></div><div class=\"ml-vi\"><p><strong>PMG201c – Thi thực hành thử #1 (Spring 2024)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết. Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>\n   <p>Đề này MỞ: \"nghĩ về dự án bạn đang tham gia, đã từng tham gia, hoặc đang diễn ra xung quanh bạn. Chọn 1 dự án trong lĩnh vực học tại FU (ví dụ dự án phần mềm cho SE), rồi trả lời dựa trên hiểu biết của bạn về dự án và các giả định.\" Lời giải mẫu dưới đây dùng 1 dự án ví dụ — <b>Hệ thống Đăng ký Học phần Sinh viên</b> cho 1 trường đại học — nhất quán xuyên suốt Yêu cầu 1-3.</p></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 1:</strong> describe the selected project in detail, clearly presenting its key characteristics: project title, project purpose/objectives (unique), project timeframe (temporary), customer/sponsor (clearly defined), project milestones (time constraints), and other project constraints (cost, resources).</p>|||<p><strong>Yêu cầu 1:</strong> mô tả chi tiết dự án đã chọn, nêu rõ đặc điểm chính: tên dự án, mục đích/mục tiêu (duy nhất), khung thời gian (tạm thời), khách hàng/nhà tài trợ (rõ ràng), mốc dự án (ràng buộc thời gian), và các ràng buộc khác (chi phí, nguồn lực).</p>",
          "sampleSolution": "<p><strong>Project Title:</strong> Student Course Registration System (SCRS)</p>\n     <p><strong>Purpose/Objectives (unique):</strong> replace the university's manual/paper-based course registration process with an online system that lets students register for courses, check seat availability in real time, and receive automated conflict warnings (e.g. schedule clashes, prerequisite not met) — reducing registration errors and administrative workload.</p>\n     <p><strong>Timeframe (temporary):</strong> 5-month project, targeting completion before the next academic term's registration window opens.</p>\n     <p><strong>Customer/Sponsor:</strong> the university's Academic Affairs Office, represented by the Registrar, who owns the requirements and final approval.</p>\n     <p><strong>Project Milestones:</strong> Month 1 — requirements finalized with Academic Affairs; Month 2 — course-catalog and seat-availability backend complete; Month 3 — registration UI and conflict-detection logic complete; Month 4 — pilot testing with one department; Month 5 — university-wide rollout before the registration window.</p>\n     <p><strong>Other constraints:</strong> Cost — capped at $60,000. Resources — 1 PM, 3 developers, 1 QA, 1 business analyst liaising with Academic Affairs. Quality — must handle peak concurrent load during the registration rush (thousands of students registering within the first hour).</p>|||<p><strong>Tên dự án:</strong> Hệ thống Đăng ký Học phần Sinh viên (SCRS)</p>\n     <p><strong>Mục đích/Mục tiêu (duy nhất):</strong> thay thế quy trình đăng ký học phần thủ công/giấy tờ của trường bằng hệ thống online cho phép sinh viên đăng ký học phần, xem số chỗ còn trống theo thời gian thực, và nhận cảnh báo xung đột tự động (ví dụ trùng lịch, chưa đủ điều kiện tiên quyết) — giảm lỗi đăng ký và khối lượng công việc hành chính.</p>\n     <p><strong>Khung thời gian (tạm thời):</strong> dự án 5 tháng, hướng tới hoàn thành trước khi kỳ đăng ký học kỳ tiếp theo mở.</p>\n     <p><strong>Khách hàng/Nhà tài trợ:</strong> Phòng Đào tạo của trường, đại diện là Trưởng phòng Đào tạo, là người sở hữu yêu cầu và duyệt cuối cùng.</p>\n     <p><strong>Mốc dự án:</strong> Tháng 1 — chốt yêu cầu với Phòng Đào tạo; Tháng 2 — hoàn thành backend danh mục môn/chỗ trống; Tháng 3 — hoàn thành UI đăng ký và logic phát hiện xung đột; Tháng 4 — kiểm thử thí điểm với 1 khoa; Tháng 5 — triển khai toàn trường trước kỳ đăng ký.</p>\n     <p><strong>Ràng buộc khác:</strong> Chi phí — giới hạn $60,000. Nguồn lực — 1 PM, 3 lập trình viên, 1 QA, 1 chuyên viên phân tích nghiệp vụ làm việc với Phòng Đào tạo. Chất lượng — phải chịu được tải đồng thời đỉnh điểm lúc cao trào đăng ký (hàng nghìn sinh viên đăng ký trong giờ đầu tiên).</p>",
          "rubric": [
            {
              "id": "purpose_timeframe",
              "criterion": "States a clear unique purpose and a specific temporary timeframe.|||Nêu rõ mục đích duy nhất và khung thời gian tạm thời cụ thể.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "sponsor",
              "criterion": "Clearly identifies a specific customer/sponsor.|||Xác định rõ khách hàng/nhà tài trợ cụ thể.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "milestones_constraints",
              "criterion": "States concrete milestones and at least cost/resource constraints.|||Nêu mốc cụ thể và ít nhất ràng buộc chi phí/nguồn lực.",
              "weight": 1,
              "maxScore": 1
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 1.5,
          "prompt": "<p><strong>Request 2:</strong> state what type of organization you think the project is using, and what type of organization you think it should or should have used, along with the reasons for this. Provide relevant reasons for your answers.</p>|||<p><strong>Yêu cầu 2:</strong> nêu loại cấu trúc tổ chức bạn nghĩ dự án đang dùng, và loại nào lẽ ra nên dùng, kèm lý do?</p>",
          "sampleSolution": "<p><strong>Current/assumed structure:</strong> a balanced matrix — the university IT department likely runs multiple concurrent projects, so developers/QA split time across projects while a PM coordinates, but functional managers retain significant authority over staffing.</p>\n     <p><strong>Recommended structure:</strong> a <b>strong matrix</b>. Reasons: (1) the hard deadline (before the registration window opens) demands a PM with real authority to prioritize this project's needs over other IT-department work when conflicts arise; (2) the project needs sustained, focused attention from a small dedicated core team (not people constantly pulled onto other university IT tickets) to hit peak-load quality requirements; (3) unlike a fully projectized structure, a strong matrix still lets specialists (e.g. a security reviewer) be shared with other university IT projects when not needed full-time on SCRS, which fits a university IT department's typical resource constraints better than standing up a fully separate team.</p>|||<p><strong>Cấu trúc hiện tại/giả định:</strong> ma trận cân bằng — phòng IT trường thường chạy nhiều dự án cùng lúc, nên lập trình viên/QA chia thời gian cho nhiều dự án, PM điều phối nhưng trưởng bộ phận chức năng vẫn có thẩm quyền đáng kể về nhân sự.</p>\n     <p><strong>Cấu trúc nên dùng:</strong> <b>ma trận mạnh</b>. Lý do: (1) hạn cứng (trước kỳ đăng ký mở) đòi hỏi PM có thẩm quyền thật để ưu tiên nhu cầu dự án này hơn việc IT khác khi có xung đột; (2) dự án cần sự tập trung liên tục từ 1 nhóm lõi chuyên trách nhỏ (không bị kéo sang việc IT khác liên tục) để đạt yêu cầu chất lượng lúc tải đỉnh; (3) khác với cấu trúc dự án hoá hoàn toàn, ma trận mạnh vẫn cho phép chuyên gia (ví dụ người rà bảo mật) được chia sẻ với dự án IT khác khi không cần toàn thời gian cho SCRS, phù hợp hơn với ràng buộc nguồn lực điển hình của phòng IT trường so với lập hẳn 1 nhóm riêng biệt.</p>",
          "rubric": [
            {
              "id": "current_and_recommended",
              "criterion": "States both a plausible current structure and a specific recommended type.|||Nêu cả cấu trúc hiện tại hợp lý lẫn loại đề xuất cụ thể.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "reasoning",
              "criterion": "Gives specific, project-relevant reasons tied to the actual project characteristics (deadline, team focus, resource sharing).|||Nêu lý do cụ thể gắn với đặc điểm thật của dự án (hạn định, tập trung nhóm, chia sẻ nguồn lực).",
              "weight": 1,
              "maxScore": 0.8
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 1.5,
          "prompt": "<p><strong>Request 3:</strong> identify at least 3 significant risks that you believe the project faces. For each risk, estimate how likely it is to occur (the probability) and the impact if it does occur. Create your own scoring system for probability and impact. Define a response for each of these risks.</p>|||<p><strong>Yêu cầu 3:</strong> xác định ít nhất 3 rủi ro đáng kể. Với mỗi rủi ro, ước lượng khả năng xảy ra và tác động nếu xảy ra. Tự tạo hệ thống chấm điểm. Định nghĩa phản ứng cho từng rủi ro.</p>",
          "sampleSolution": "<p><strong>Scoring system:</strong> Probability and Impact each scored 1 (Low) – 2 (Medium) – 3 (High); Risk Score = Probability × Impact.</p>\n     <p><strong>Risk 1 — Peak-load failure during registration rush:</strong> Probability: 3 (High — thousands of students hit the system in the first hour). Impact: 3 (High — a crash during registration is highly visible and disruptive). Score: 9. <b>Response:</b> load-test at 3x expected peak volume before rollout; use auto-scaling cloud infrastructure; have a rollback/paper-fallback plan ready.</p>\n     <p><strong>Risk 2 — Incorrect conflict-detection logic (schedule clashes, prerequisites):</strong> Probability: 2 (Medium — complex business rules from Academic Affairs). Impact: 3 (High — wrong registrations cascade into real academic problems). Score: 6. <b>Response:</b> dedicate a QA pass specifically to conflict-rule test cases, reviewed and signed off by Academic Affairs before pilot.</p>\n     <p><strong>Risk 3 — Late/incomplete requirements from Academic Affairs:</strong> Probability: 2 (Medium — a non-technical stakeholder defining detailed business rules). Impact: 2 (Medium — delays design, not necessarily catastrophic if caught early). Score: 4. <b>Response:</b> lock requirements formally at the end of Month 1 with a signed sign-off; any later changes go through a change-request process rather than silently expanding scope.</p>\n     <p><strong>Risk 4 — Low student trust in the new system after past manual-process errors:</strong> Probability: 1 (Low — assuming manual issues were more about workload than active mistrust). Impact: 2 (Medium — could cause students to still call the registrar directly, undermining the efficiency goal). Score: 2. <b>Response:</b> clear communication campaign before launch, plus a visible help/support channel during the first registration cycle.</p>|||<p><strong>Hệ thống chấm điểm:</strong> Probability và Impact mỗi cái chấm 1 (Thấp) – 2 (Trung bình) – 3 (Cao); Điểm rủi ro = Probability × Impact.</p>\n     <p><strong>Rủi ro 1 — Hệ thống lỗi lúc cao trào đăng ký:</strong> Probability: 3 (Cao — hàng nghìn sinh viên vào hệ thống giờ đầu). Impact: 3 (Cao — sập lúc đăng ký rất dễ thấy và gây rối). Điểm: 9. <b>Phản ứng:</b> load-test ở mức 3 lần tải đỉnh dự kiến trước khi triển khai; dùng hạ tầng cloud auto-scale; có kế hoạch rollback/phương án giấy dự phòng.</p>\n     <p><strong>Rủi ro 2 — Logic phát hiện xung đột sai (trùng lịch, tiên quyết):</strong> Probability: 2 (Trung bình — quy tắc nghiệp vụ phức tạp từ Phòng Đào tạo). Impact: 3 (Cao — đăng ký sai kéo theo vấn đề học vụ thật). Điểm: 6. <b>Phản ứng:</b> dành 1 đợt QA riêng cho test case quy tắc xung đột, Phòng Đào tạo rà soát và ký duyệt trước thí điểm.</p>\n     <p><strong>Rủi ro 3 — Yêu cầu từ Phòng Đào tạo trễ/thiếu:</strong> Probability: 2 (Trung bình — bên liên quan phi kỹ thuật định nghĩa quy tắc nghiệp vụ chi tiết). Impact: 2 (Trung bình — làm chậm thiết kế, không thảm hoạ nếu phát hiện sớm). Điểm: 4. <b>Phản ứng:</b> chốt yêu cầu chính thức cuối tháng 1 có ký duyệt; thay đổi sau đó phải qua quy trình yêu cầu thay đổi thay vì âm thầm mở rộng phạm vi.</p>\n     <p><strong>Rủi ro 4 — Sinh viên thiếu tin tưởng hệ thống mới sau lỗi quy trình thủ công cũ:</strong> Probability: 1 (Thấp — giả định vấn đề cũ chủ yếu do khối lượng công việc chứ không phải mất niềm tin chủ động). Impact: 2 (Trung bình — có thể khiến sinh viên vẫn gọi thẳng phòng đào tạo, làm giảm hiệu quả). Điểm: 2. <b>Phản ứng:</b> chiến dịch truyền thông rõ ràng trước ra mắt, cùng kênh hỗ trợ rõ ràng trong đợt đăng ký đầu tiên.</p>",
          "rubric": [
            {
              "id": "three_risks",
              "criterion": "Identifies at least 3 distinct, plausible risks specific to this project.|||Xác định đủ ít nhất 3 rủi ro khác nhau, hợp lý, gắn với dự án.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "own_scoring_system",
              "criterion": "Defines its own explicit probability/impact scoring system and applies it consistently.|||Tự định nghĩa hệ thống chấm điểm probability/impact rõ ràng, áp dụng nhất quán.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "response",
              "criterion": "Gives a specific, actionable response for each risk.|||Nêu phản ứng cụ thể, khả thi cho từng rủi ro.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2.5,
          "prompt": "<p><strong>Request 4:</strong> assume that you have defined and estimated the project schedule with the following high-level activities:</p><table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>\n<tr><td>Start</td><td>—</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>3</td></tr>\n<tr><td>B</td><td>A</td><td>5</td></tr><tr><td>C</td><td>B</td><td>2</td></tr>\n<tr><td>D</td><td>B</td><td>3</td></tr><tr><td>E</td><td>B</td><td>5</td></tr>\n<tr><td>F</td><td>C</td><td>3</td></tr><tr><td>G</td><td>D</td><td>5</td></tr>\n<tr><td>H</td><td>D, E</td><td>4</td></tr><tr><td>I</td><td>F, G</td><td>3</td></tr>\n<tr><td>End</td><td>H, I</td><td>0</td></tr></table>\n     <p>a) Apply the critical path analysis technique to determine the minimum duration required to complete this project.</p>\n     <p>b) In the 8th week, while executing activity B, you find that you need to speed up the project schedule to recover a 3-week delay. Define 2 solutions, with relevant explanation and assumptions (if needed), to achieve this recovery (how it would help and difficulties/impacts to the project).</p>|||<p><strong>Yêu cầu 4:</strong> giả sử bạn đã xác định và ước lượng lịch trình với các hoạt động sau:</p><table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>\n<tr><td>Start</td><td>—</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>3</td></tr>\n<tr><td>B</td><td>A</td><td>5</td></tr><tr><td>C</td><td>B</td><td>2</td></tr>\n<tr><td>D</td><td>B</td><td>3</td></tr><tr><td>E</td><td>B</td><td>5</td></tr>\n<tr><td>F</td><td>C</td><td>3</td></tr><tr><td>G</td><td>D</td><td>5</td></tr>\n<tr><td>H</td><td>D, E</td><td>4</td></tr><tr><td>I</td><td>F, G</td><td>3</td></tr>\n<tr><td>End</td><td>H, I</td><td>0</td></tr></table>\n     <p>a) Dùng phân tích đường găng để xác định thời lượng tối thiểu cần để hoàn thành dự án.</p>\n     <p>b) Ở tuần thứ 8, đang thực hiện hoạt động B, bạn phát hiện cần đẩy nhanh lịch trình để bù lại độ trễ 3 tuần. Nêu 2 giải pháp, kèm giải thích và giả định (nếu cần), để đạt được sự phục hồi này (giúp ích ra sao và khó khăn/ảnh hưởng tới dự án).</p>",
          "sampleSolution": "<p><strong>a) Critical path analysis:</strong></p>\n     <ul><li>Start→A→B→C→F→I→End: 3+5+2+3+3 = 16 weeks</li>\n     <li>Start→A→B→D→G→I→End: 3+5+3+5+3 = <b>19 weeks</b></li>\n     <li>Start→A→B→D→H→End: 3+5+3+4 = 15 weeks</li>\n     <li>Start→A→B→E→H→End: 3+5+5+4 = 17 weeks</li></ul>\n     <p><strong>Minimum duration:</strong> 19 weeks (Start→A→B→D→G→I→End, the critical path — A, B, D, G, I all have 0 float).</p>\n     <p><strong>b) Recovering a 3-week delay while executing B (week 8):</strong> B is on the critical path (0 float), so a 3-week delay here directly delays the whole 19-week project unless corrected.</p>\n     <ul><li><b>Solution 1 — Crash B directly:</b> add extra developers/resources to B's remaining work to finish it faster than planned. Helps: claws back time on the exact activity causing the delay. Difficulty: B is a foundational activity feeding D, E, C — rushing it risks quality issues that surface later in D/G/I, and adding people to an in-progress task has ramp-up overhead (Brooks's-law risk).</li>\n     <li><b>Solution 2 — Crash a later critical-path activity (G, 5 weeks) once B finishes:</b> add resources to G specifically to recover the 3 weeks further down the same critical path. Helps: recovers the delay without disrupting B's team while it's mid-task. Difficulty: G doesn't start until D finishes (D itself depends on B), so this solution's benefit is delayed and depends on D also staying on schedule — it only works if B's own delay doesn't cascade further into D.</li></ul>|||<p><strong>a) Phân tích đường găng:</strong></p>\n     <ul><li>Start→A→B→C→F→I→End: 3+5+2+3+3 = 16 tuần</li>\n     <li>Start→A→B→D→G→I→End: 3+5+3+5+3 = <b>19 tuần</b></li>\n     <li>Start→A→B→D→H→End: 3+5+3+4 = 15 tuần</li>\n     <li>Start→A→B→E→H→End: 3+5+5+4 = 17 tuần</li></ul>\n     <p><strong>Thời lượng tối thiểu:</strong> 19 tuần (Start→A→B→D→G→I→End, đường găng — A, B, D, G, I đều float=0).</p>\n     <p><strong>b) Phục hồi độ trễ 3 tuần khi đang thực hiện B (tuần 8):</strong> B nằm trên đường găng (float=0), nên trễ 3 tuần ở đây trực tiếp trễ cả dự án 19 tuần nếu không khắc phục.</p>\n     <ul><li><b>Giải pháp 1 — Crash trực tiếp B:</b> thêm lập trình viên/nguồn lực cho phần việc B còn lại để xong nhanh hơn kế hoạch. Giúp ích: lấy lại thời gian trực tiếp từ đúng hoạt động gây trễ. Khó khăn: B là hoạt động nền tảng nuôi D, E, C — làm vội có thể gây vấn đề chất lượng lộ ra sau ở D/G/I, và thêm người vào việc đang dở có chi phí làm quen (rủi ro theo luật Brooks).</li>\n     <li><b>Giải pháp 2 — Crash 1 hoạt động đường găng phía sau (G, 5 tuần) sau khi B xong:</b> thêm nguồn lực riêng cho G để bù 3 tuần ở phía sau cùng đường găng. Giúp ích: phục hồi độ trễ mà không xáo trộn nhóm đang làm B giữa chừng. Khó khăn: G chỉ bắt đầu sau khi D xong (D lại phụ thuộc B), nên lợi ích của giải pháp này bị trì hoãn và phụ thuộc việc D cũng giữ đúng tiến độ — chỉ hiệu quả nếu độ trễ của B không lan tiếp sang D.</li></ul>",
          "explanation": "<p><b>Verified independently by hand</b> (full forward + backward CPM pass, no source solution existed) — 4 distinct paths, critical path A-B-D-G-I at 19 weeks.</p>|||<p><b>Đã tự tính tay độc lập</b> (đầy đủ CPM xuôi+ngược, đề này không có solution để đối chiếu) — 4 đường đi khác nhau, đường găng A-B-D-G-I ở 19 tuần.</p>",
          "rubric": [
            {
              "id": "critical_path",
              "criterion": "Correctly determines the minimum duration (19 weeks) via critical path analysis.|||Xác định đúng thời lượng tối thiểu (19 tuần) qua phân tích đường găng.",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "two_solutions",
              "criterion": "Proposes 2 distinct, technically sound recovery solutions targeting critical-path activities, each with benefit and difficulty/impact discussed.|||Đề xuất đủ 2 giải pháp phục hồi khác nhau, nhắm đúng hoạt động đường găng, mỗi cái có bàn về lợi ích và khó khăn/ảnh hưởng.",
              "weight": 1,
              "maxScore": 1.5
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2.5,
          "prompt": "<p><strong>Request 5:</strong> your project team has completed a workload equivalent to $3,000 and has spent $4,000 to date. Assume that you were budgeted $5,000 for the work scheduled. At the start, the team has estimated a project budget of $9,000 and the project needs 12 months to finish. Calculate the required figures, show your calculations, comment on the project's current status, and give the forecasts to complete the project in terms of cost and schedule.</p>|||<p><strong>Yêu cầu 5:</strong> nhóm dự án đã hoàn thành khối lượng công việc tương đương $3,000 và đã chi $4,000 tính đến nay. Giả sử ngân sách cho công việc đã lên lịch là $5,000. Ban đầu, nhóm ước lượng ngân sách dự án $9,000, dự án cần 12 tháng để hoàn thành. Tính các chỉ số cần thiết, trình bày cách tính, nhận xét tình trạng hiện tại, và đưa ra dự báo hoàn thành về chi phí và tiến độ.</p>",
          "sampleSolution": "<p><strong>Given:</strong> EV = $3,000; AC = $4,000; PV = $5,000; BAC = $9,000; planned duration = 12 months.</p>\n     <p><strong>Calculations:</strong></p>\n     <ul><li>SPI = EV/PV = 3,000/5,000 = <b>0.6</b></li>\n     <li>CPI = EV/AC = 3,000/4,000 = <b>0.75</b></li>\n     <li>SV = EV−PV = 3,000−5,000 = <b>−$2,000</b></li>\n     <li>CV = EV−AC = 3,000−4,000 = <b>−$1,000</b></li>\n     <li>EAC = BAC/CPI = 9,000/0.75 = <b>$12,000</b></li>\n     <li>ETC = EAC−AC = 12,000−4,000 = <b>$8,000</b></li>\n     <li>Schedule forecast = planned duration/SPI = 12/0.6 = <b>20 months</b></li></ul>\n     <p><strong>Current status:</strong> the project is both behind schedule (SPI=0.6, only 60% of planned progress achieved) and over budget (CPI=0.75, only $0.75 of value earned per $1 spent) — a significant double-underperformance.</p>\n     <p><strong>Forecasts:</strong> at this pace, the project is forecast to cost $12,000 instead of the $9,000 originally budgeted (a $3,000, or 33%, overrun), and to take about 20 months instead of the planned 12 months (8 months late). This is a serious enough gap to warrant formally re-baselining with the sponsor rather than continuing on the current trajectory unaddressed.</p>|||<p><strong>Dữ liệu cho:</strong> EV = $3,000; AC = $4,000; PV = $5,000; BAC = $9,000; thời lượng kế hoạch = 12 tháng.</p>\n     <p><strong>Tính toán:</strong></p>\n     <ul><li>SPI = EV/PV = 3,000/5,000 = <b>0.6</b></li>\n     <li>CPI = EV/AC = 3,000/4,000 = <b>0.75</b></li>\n     <li>SV = EV−PV = 3,000−5,000 = <b>−$2,000</b></li>\n     <li>CV = EV−AC = 3,000−4,000 = <b>−$1,000</b></li>\n     <li>EAC = BAC/CPI = 9,000/0.75 = <b>$12,000</b></li>\n     <li>ETC = EAC−AC = 12,000−4,000 = <b>$8,000</b></li>\n     <li>Dự báo tiến độ = thời lượng kế hoạch/SPI = 12/0.6 = <b>20 tháng</b></li></ul>\n     <p><strong>Tình trạng hiện tại:</strong> dự án VỪA trễ tiến độ (SPI=0.6, chỉ đạt 60% tiến độ kế hoạch) VỪA vượt ngân sách (CPI=0.75, chỉ thu $0.75 giá trị cho mỗi $1 chi) — kém hiệu suất kép đáng kể.</p>\n     <p><strong>Dự báo:</strong> với nhịp độ này, dự án dự báo tốn $12,000 thay vì $9,000 ngân sách gốc (vượt $3,000, tức 33%), và mất khoảng 20 tháng thay vì 12 tháng kế hoạch (trễ 8 tháng). Đây là khoảng lệch đủ nghiêm trọng để cần lập lại baseline chính thức với nhà tài trợ thay vì tiếp tục theo quỹ đạo hiện tại mà không xử lý.</p>",
          "explanation": "<p>Verified independently by hand from the given data (no source solution existed) — all standard EVM formulas applied: SPI=0.6, CPI=0.75, EAC=$12,000, schedule forecast=20 months.</p>|||<p>Đã tự tính tay độc lập từ dữ liệu đề cho (không có solution để đối chiếu) — áp dụng đúng công thức EVM chuẩn: SPI=0.6, CPI=0.75, EAC=$12,000, dự báo tiến độ=20 tháng.</p>",
          "rubric": [
            {
              "id": "spi_cpi",
              "criterion": "Correctly calculates SPI (0.6) and CPI (0.75).|||Tính đúng SPI (0.6) và CPI (0.75).",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "sv_cv",
              "criterion": "Correctly calculates SV (-$2,000) and CV (-$1,000).|||Tính đúng SV (-$2,000) và CV (-$1,000).",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "eac_schedule_forecast",
              "criterion": "Correctly calculates EAC ($12,000) and the schedule forecast (20 months).|||Tính đúng EAC ($12,000) và dự báo tiến độ (20 tháng).",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "commentary",
              "criterion": "Correctly identifies the project as both over budget and behind schedule, with a sensible recommendation.|||Nhận ra đúng dự án vừa vượt ngân sách vừa trễ tiến độ, kèm đề xuất hợp lý.",
              "weight": 1,
              "maxScore": 0.7
            }
          ]
        }
      ]
    }
  ]
};
