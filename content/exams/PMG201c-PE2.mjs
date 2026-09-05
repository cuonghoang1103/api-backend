export default {
  "course": {
    "courseCode": "PMG201c"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "WRITE",
      "code": "PE2",
      "title": "PMG201c – Final PE #2 (Fall 2024)|||PMG201c – PE cuối kỳ #2 (Fall 2024)",
      "description": "PMG201c PE (WRITE): project charter, organization structure analysis, risk register, critical path method (CPM) with schedule compression, and earned value management (EVM), AI-graded.|||PE PMG201c (viết): hồ sơ dự án, phân tích cấu trúc tổ chức, sổ rủi ro, phân tích đường găng (CPM) kèm rút ngắn lịch trình, và quản lý giá trị thu được (EVM), chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>PMG201c – Final PE #2 (Fall 2024)</strong>. This is a written project-management practical exam — 5 requests, each worth 20% (2 points). There is no code to write; each answer is graded by an AI grader against the rubric shown per question. Write complete, well-reasoned answers — partial or vague answers lose rubric points even if the general idea is right.</p></div><div class=\"ml-vi\"><p><strong>PMG201c – PE cuối kỳ #2 (Fall 2024)</strong>. Đây là bài thi thực hành quản lý dự án dạng viết — 5 yêu cầu, mỗi yêu cầu 20% (2 điểm). Không có mã nguồn cần viết; mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu. Viết câu trả lời đầy đủ, lập luận rõ ràng — trả lời chung chung/thiếu ý sẽ mất điểm rubric dù ý chính đúng hướng.</p></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 1 (20%):</strong> provide the project name and give a detailed description of the project, clearly covering its key characteristics: purpose/objectives (unique), customer/sponsor (clearly defined), success criteria, and other project constraints (cost, resources, or quality).</p>|||<p><strong>Yêu cầu 1 (20%):</strong> đặt tên dự án và mô tả chi tiết, nêu rõ các đặc điểm chính: mục đích/mục tiêu (duy nhất), khách hàng/nhà tài trợ (xác định rõ ràng), tiêu chí thành công, và các ràng buộc khác (chi phí, nguồn lực, hoặc chất lượng).</p>",
          "sampleSolution": "<p><strong>Project Name:</strong> Hospital Patient Management System (HPMS)</p>\n     <p><strong>Purpose/Objectives (unique):</strong> digitize patient records, appointment scheduling, and billing for a mid-size hospital, replacing paper-based records to reduce transcription errors and improve coordination of patient care across departments.</p>\n     <p><strong>Customer/Sponsor:</strong> the hospital's Chief Medical Officer (CMO), acting on behalf of the Board of Directors, is the project sponsor and final approval authority.</p>\n     <p><strong>Success criteria:</strong> system fully live within 6 months; at least 95% of clinical staff trained and actively using it within the first month post-launch; patient record retrieval time reduced from ~15 minutes to under 2 minutes; zero critical data-loss incidents during migration from paper records.</p>\n     <p><strong>Other constraints:</strong> Cost — budget capped at $500,000. Resources — team of 1 project manager, 4 developers, 2 QA engineers, 1 business analyst, and a part-time hospital IT liaison. Quality — the system must comply with healthcare data-privacy regulations and guarantee 99.9% uptime after launch.</p>|||<p><strong>Tên dự án:</strong> Hệ thống Quản lý Bệnh nhân Bệnh viện (HPMS)</p>\n     <p><strong>Mục đích/Mục tiêu (duy nhất):</strong> số hoá hồ sơ bệnh nhân, lịch hẹn khám, và hoá đơn cho 1 bệnh viện quy mô vừa, thay thế hồ sơ giấy nhằm giảm lỗi sao chép và cải thiện phối hợp chăm sóc bệnh nhân giữa các khoa.</p>\n     <p><strong>Khách hàng/Nhà tài trợ:</strong> Giám đốc Y khoa (CMO) của bệnh viện, thay mặt Hội đồng quản trị, là nhà tài trợ dự án và người có thẩm quyền phê duyệt cuối cùng.</p>\n     <p><strong>Tiêu chí thành công:</strong> hệ thống vận hành đầy đủ trong 6 tháng; ít nhất 95% nhân viên y tế được đào tạo và dùng thực tế trong tháng đầu sau ra mắt; thời gian tra cứu hồ sơ bệnh nhân giảm từ ~15 phút xuống dưới 2 phút; không có sự cố mất dữ liệu nghiêm trọng nào khi chuyển đổi từ hồ sơ giấy.</p>\n     <p><strong>Ràng buộc khác:</strong> Chi phí — ngân sách giới hạn $500,000. Nguồn lực — nhóm gồm 1 quản lý dự án, 4 lập trình viên, 2 kỹ sư QA, 1 chuyên viên phân tích nghiệp vụ, và 1 đầu mối IT bệnh viện bán thời gian. Chất lượng — hệ thống phải tuân thủ quy định bảo mật dữ liệu y tế và đảm bảo uptime 99.9% sau ra mắt.</p>",
          "rubric": [
            {
              "id": "purpose",
              "criterion": "States a clear, unique purpose/objective.|||Nêu rõ mục đích/mục tiêu duy nhất.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "sponsor",
              "criterion": "Clearly identifies a specific customer/sponsor.|||Xác định rõ ràng 1 khách hàng/nhà tài trợ cụ thể.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "success_criteria",
              "criterion": "States concrete, measurable success criteria.|||Nêu tiêu chí thành công cụ thể, đo lường được.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "constraints",
              "criterion": "States at least cost, resource, and quality constraints.|||Nêu ít nhất ràng buộc chi phí, nguồn lực, và chất lượng.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 2 (20%):</strong> what type of organization do you think the project is using, and what type of organization do you think should apply or should have applied, along with the reasons for this? Provide relevant reasons for your answers.</p>|||<p><strong>Yêu cầu 2 (20%):</strong> bạn nghĩ dự án đang dùng loại cấu trúc tổ chức nào, và loại nào nên áp dụng (hoặc lẽ ra nên áp dụng), kèm lý do? Nêu lý do phù hợp cho câu trả lời.</p>",
          "sampleSolution": "<p><strong>Current/assumed structure:</strong> a weak/functional matrix — the project team members (developers, QA, BA) most likely still report primarily to their functional department heads, with the project manager having limited formal authority, only coordinating across departments.</p>\n     <p><strong>Recommended structure:</strong> a <b>strong matrix, or ideally a projectized structure</b> for the duration of the project. Reasons: (1) the project directly affects patient safety and involves sensitive healthcare data, so it needs fast, unambiguous decision-making — a PM with real authority over the dedicated team avoids the delays typical of functional silos; (2) the 6-month deadline is tight and requires full-time dedicated staff rather than people splitting time across multiple functional obligations; (3) the cross-functional nature (developers + hospital domain experts + compliance) benefits from a single point of accountability (the PM) rather than needing sign-off from multiple functional managers on every decision.</p>|||<p><strong>Cấu trúc hiện tại/giả định:</strong> ma trận yếu/theo chức năng — các thành viên nhóm (lập trình viên, QA, BA) nhiều khả năng vẫn báo cáo chính cho trưởng bộ phận chức năng của họ, quản lý dự án có thẩm quyền hạn chế, chỉ điều phối liên phòng ban.</p>\n     <p><strong>Cấu trúc nên áp dụng:</strong> <b>ma trận mạnh, hoặc lý tưởng là cấu trúc dự án hoá (projectized)</b> trong suốt thời gian dự án. Lý do: (1) dự án ảnh hưởng trực tiếp tới an toàn bệnh nhân và dữ liệu y tế nhạy cảm, cần ra quyết định nhanh, rõ ràng — PM có thẩm quyền thật với nhóm chuyên trách tránh được sự chậm trễ điển hình của cơ cấu chức năng cô lập; (2) hạn 6 tháng khá gấp, cần nhân sự chuyên trách toàn thời gian thay vì phải chia sẻ thời gian cho nhiều nghĩa vụ chức năng khác; (3) tính chất liên phòng ban (lập trình viên + chuyên gia nghiệp vụ bệnh viện + tuân thủ) hưởng lợi từ 1 đầu mối trách nhiệm duy nhất (PM) thay vì cần phê duyệt từ nhiều trưởng phòng chức năng cho mỗi quyết định.</p>",
          "rubric": [
            {
              "id": "current_type",
              "criterion": "States a plausible current/assumed organization type with reasoning.|||Nêu loại cấu trúc tổ chức hiện tại/giả định hợp lý kèm lý do.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "recommended_type",
              "criterion": "Recommends a specific organization type (functional/weak matrix/balanced matrix/strong matrix/projectized).|||Đề xuất đúng 1 loại cấu trúc cụ thể (chức năng/ma trận yếu/ma trận cân bằng/ma trận mạnh/dự án hoá).",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "reasoning",
              "criterion": "Gives specific, project-relevant reasons for the recommendation (tied to this project's actual characteristics, not generic).|||Nêu lý do cụ thể, gắn với đặc điểm THẬT của dự án này (không chung chung).",
              "weight": 1,
              "maxScore": 0.8
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 3 (20%):</strong> identify at least 3 significant risks that you think the project faces. For each risk, determine how likely you think it is to occur (the probability) and the impact if it does occur. Create your own scoring system for probability and impact. You might use High-Medium-Low; you might use numeric values or you might use percentages. Define a response for each of these risks.</p>|||<p><strong>Yêu cầu 3 (20%):</strong> xác định ít nhất 3 rủi ro đáng kể mà dự án có thể gặp. Với mỗi rủi ro, xác định khả năng xảy ra (probability) và mức ảnh hưởng (impact) nếu xảy ra. Tự tạo hệ thống chấm điểm cho probability và impact — có thể dùng Cao-Trung bình-Thấp; giá trị số; hoặc phần trăm. Định nghĩa phản ứng (response) cho từng rủi ro.</p>",
          "sampleSolution": "<p><strong>Scoring system:</strong> Probability and Impact each scored 1 (Low) – 2 (Medium) – 3 (High); Risk Score = Probability × Impact (range 1-9; ≥6 = high priority, 3-4 = medium, 1-2 = low).</p>\n     <p><strong>Risk 1 — Data migration errors:</strong> existing paper/legacy records may be incomplete, illegible, or corrupted when digitized. Probability: 2 (Medium, ~50%). Impact: 3 (High — could cause patient-safety incidents from missing/wrong data). Risk Score: 6 (high priority). <b>Response:</b> phased migration department by department, double-entry verification for a sample of records, and a parallel-run period (old + new system side by side) before full cutover.</p>\n     <p><strong>Risk 2 — Staff resistance/low adoption:</strong> hospital staff, especially senior doctors used to paper workflows, resist the new digital system. Probability: 3 (High, ~70%). Impact: 2 (Medium — slows full utilization but doesn't block launch). Risk Score: 6 (high priority). <b>Response:</b> early stakeholder involvement in design, hands-on training workshops, and recruiting a few respected \"physician champions\" to model adoption.</p>\n     <p><strong>Risk 3 — Regulatory/compliance failure:</strong> the system fails to meet healthcare data-privacy requirements at launch. Probability: 1 (Low, ~20%). Impact: 3 (Very High — legal liability, forced shutdown). Risk Score: 3 (medium priority, but severe if it happens). <b>Response:</b> engage the compliance/legal team from the design phase, commission a third-party security audit before go-live, and build privacy-by-design into the architecture from day one.</p>|||<p><strong>Hệ thống chấm điểm:</strong> Probability và Impact mỗi cái chấm 1 (Thấp) – 2 (Trung bình) – 3 (Cao); Điểm rủi ro = Probability × Impact (khoảng 1-9; ≥6 = ưu tiên cao, 3-4 = trung bình, 1-2 = thấp).</p>\n     <p><strong>Rủi ro 1 — Lỗi di chuyển dữ liệu:</strong> hồ sơ giấy/cũ có thể thiếu, khó đọc, hoặc sai lệch khi số hoá. Probability: 2 (Trung bình, ~50%). Impact: 3 (Cao — có thể gây sự cố an toàn bệnh nhân do dữ liệu thiếu/sai). Điểm rủi ro: 6 (ưu tiên cao). <b>Phản ứng:</b> di chuyển theo từng khoa, kiểm tra chéo (double-entry) mẫu hồ sơ, và giai đoạn chạy song song (hệ cũ + mới) trước khi chuyển hẳn.</p>\n     <p><strong>Rủi ro 2 — Nhân viên kháng cự/tiếp nhận kém:</strong> nhân viên bệnh viện, nhất là bác sĩ lâu năm quen quy trình giấy, kháng cự hệ thống số mới. Probability: 3 (Cao, ~70%). Impact: 2 (Trung bình — làm chậm sử dụng đầy đủ nhưng không chặn ra mắt). Điểm rủi ro: 6 (ưu tiên cao). <b>Phản ứng:</b> mời nhân viên tham gia sớm vào thiết kế, tổ chức đào tạo thực hành, và tuyển vài \"bác sĩ tiên phong\" được tin tưởng để làm gương.</p>\n     <p><strong>Rủi ro 3 — Không đạt tuân thủ pháp lý:</strong> hệ thống không đáp ứng yêu cầu bảo mật dữ liệu y tế khi ra mắt. Probability: 1 (Thấp, ~20%). Impact: 3 (Rất cao — trách nhiệm pháp lý, buộc dừng hệ thống). Điểm rủi ro: 3 (ưu tiên trung bình, nhưng nghiêm trọng nếu xảy ra). <b>Phản ứng:</b> mời đội pháp lý/tuân thủ tham gia từ giai đoạn thiết kế, thuê kiểm toán bảo mật bên thứ 3 trước khi ra mắt, và thiết kế bảo mật ngay từ đầu (privacy-by-design).</p>",
          "rubric": [
            {
              "id": "three_risks",
              "criterion": "Identifies at least 3 distinct, plausible, project-relevant risks.|||Xác định đủ ít nhất 3 rủi ro khác nhau, hợp lý, gắn với dự án.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "own_scoring",
              "criterion": "Defines its own explicit probability/impact scoring system (as requested) and applies it consistently to every risk.|||Tự định nghĩa rõ hệ thống chấm điểm probability/impact (theo yêu cầu) và áp dụng nhất quán cho mọi rủi ro.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "response",
              "criterion": "Gives a specific, actionable response/mitigation for each risk.|||Nêu phản ứng/giảm thiểu cụ thể, khả thi cho từng rủi ro.",
              "weight": 1,
              "maxScore": 0.7
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 4 (20%):</strong> you have defined and estimated a project schedule with the following activities:</p><table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>\n<tr><td>Start</td><td>—</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>4</td></tr>\n<tr><td>B</td><td>A, D</td><td>3</td></tr><tr><td>C</td><td>B</td><td>2</td></tr>\n<tr><td>D</td><td>Start</td><td>5</td></tr><tr><td>E</td><td>D</td><td>4</td></tr>\n<tr><td>F</td><td>E</td><td>2</td></tr><tr><td>G</td><td>C, F</td><td>6</td></tr>\n<tr><td>H</td><td>D</td><td>5</td></tr><tr><td>I</td><td>H</td><td>9</td></tr>\n<tr><td>End</td><td>G, I</td><td>0</td></tr></table>\n     <p>Perform the critical path analysis to:</p>\n     <ul><li>Provide <b>all the paths</b> (from the start to the end of the project) with the duration of each.</li>\n     <li>Specify at least 3 solutions (with detailed explanation) to shorten this schedule by 3 weeks.</li></ul>|||<p><strong>Yêu cầu 4 (20%):</strong> bạn đã xác định và ước lượng lịch trình dự án với các hoạt động sau:</p><table><tr><th>Activity</th><th>Preceding Activity</th><th>Duration (weeks)</th></tr>\n<tr><td>Start</td><td>—</td><td>0</td></tr><tr><td>A</td><td>Start</td><td>4</td></tr>\n<tr><td>B</td><td>A, D</td><td>3</td></tr><tr><td>C</td><td>B</td><td>2</td></tr>\n<tr><td>D</td><td>Start</td><td>5</td></tr><tr><td>E</td><td>D</td><td>4</td></tr>\n<tr><td>F</td><td>E</td><td>2</td></tr><tr><td>G</td><td>C, F</td><td>6</td></tr>\n<tr><td>H</td><td>D</td><td>5</td></tr><tr><td>I</td><td>H</td><td>9</td></tr>\n<tr><td>End</td><td>G, I</td><td>0</td></tr></table>\n     <p>Thực hiện phân tích đường găng để:</p>\n     <ul><li>Nêu <b>tất cả các đường đi</b> (từ đầu tới cuối dự án) kèm thời lượng mỗi đường.</li>\n     <li>Nêu ít nhất 3 giải pháp (kèm giải thích chi tiết) để rút ngắn lịch trình 3 tuần.</li></ul>",
          "sampleSolution": "<p><strong>All paths (Start to End):</strong></p>\n     <ul><li>Start→A→B→C→G→End: 4+3+2+6 = 15 weeks</li>\n     <li>Start→D→B→C→G→End: 5+3+2+6 = 16 weeks</li>\n     <li>Start→D→E→F→G→End: 5+4+2+6 = <b>17 weeks</b></li>\n     <li>Start→D→H→I→End: 5+5+9 = <b>19 weeks (critical path)</b></li></ul>\n     <p><strong>Project duration:</strong> 19 weeks (Start→D→H→I→End). D, H, I have zero float; every other activity has positive float (A=4, B=3, C=3, E=2, F=2, G=2).</p>\n     <p><strong>⚠️ Key trap:</strong> the critical path is 19 weeks, but the SECOND-longest path (Start→D→E→F→G→End) is 17 weeks with only 2 weeks of float. If you shorten only the critical path by 3 weeks (19→16) without touching this second path, it becomes the NEW critical path at 17 weeks — the target of 16 weeks is NOT actually achieved. Any valid solution must account for this.</p>\n     <p><strong>Solution 1 — Crash the shared bottleneck, activity D, by 3 weeks (5→2):</strong> D precedes B, E, and H — it is the ONE activity common to every single path in the network. Cutting D by 3 weeks (e.g. adding more resources/overtime to D's work) reduces ALL FOUR paths by exactly 3 weeks at once: 15→12, 16→13, 17→14, 19→16. The new critical path becomes 16 weeks, hitting the target with a single, efficient change and no risk of a new bottleneck emerging.</p>\n     <p><strong>Solution 2 — Crash H by 1 week and I by 2 weeks (critical path), AND crash G by 1 week (second-longest path):</strong> cutting H (5→4) and I (9→7) reduces the critical path by 3 (19→16). But this alone leaves the second path at 17 weeks — so G must also be crashed by at least 1 week (6→5), bringing that path to 16 as well. This spreads the crashing cost/risk across 3 smaller activities instead of overloading one.</p>\n     <p><strong>Solution 3 — Fast-track by overlapping H and I, and overlapping E and F:</strong> instead of waiting for H to fully finish, start the first ~3 weeks of I's work once H is well underway (overlap), cutting the effective H→I duration by 3 weeks without adding resources. Since this alone doesn't touch the second-longest path, also overlap E and F by at least 1 week on that path. Trade-off: higher coordination/rework risk since downstream work starts before its input is fully finalized.</p>|||<p><strong>Tất cả đường đi (Start tới End):</strong></p>\n     <ul><li>Start→A→B→C→G→End: 4+3+2+6 = 15 tuần</li>\n     <li>Start→D→B→C→G→End: 5+3+2+6 = 16 tuần</li>\n     <li>Start→D→E→F→G→End: 5+4+2+6 = <b>17 tuần</b></li>\n     <li>Start→D→H→I→End: 5+5+9 = <b>19 tuần (đường găng)</b></li></ul>\n     <p><strong>Tổng thời lượng dự án:</strong> 19 tuần (Start→D→H→I→End). D, H, I có float bằng 0; mọi hoạt động khác có float dương (A=4, B=3, C=3, E=2, F=2, G=2).</p>\n     <p><strong>⚠️ Bẫy quan trọng:</strong> đường găng là 19 tuần, nhưng đường DÀI THỨ HAI (Start→D→E→F→G→End) là 17 tuần, float chỉ 2. Nếu chỉ rút ngắn đường găng 3 tuần (19→16) mà không đụng tới đường thứ hai này, nó sẽ trở thành đường găng MỚI ở 17 tuần — mục tiêu 16 tuần KHÔNG đạt được thật. Mọi giải pháp hợp lệ phải xử lý cả điều này.</p>\n     <p><strong>Giải pháp 1 — Rút ngắn hoạt động chung D 3 tuần (5→2):</strong> D là tiền đề của B, E, và H — là hoạt động DUY NHẤT chung cho MỌI đường đi trong mạng lưới. Cắt D 3 tuần (ví dụ thêm nguồn lực/tăng ca cho D) làm giảm ĐỦ CẢ 4 đường cùng lúc 3 tuần: 15→12, 16→13, 17→14, 19→16. Đường găng mới thành 16 tuần, đạt mục tiêu chỉ với 1 thay đổi hiệu quả, không rủi ro phát sinh đường găng mới.</p>\n     <p><strong>Giải pháp 2 — Rút H 1 tuần và I 2 tuần (đường găng), VÀ rút G 1 tuần (đường thứ 2):</strong> cắt H (5→4) và I (9→7) giảm đường găng 3 tuần (19→16). Nhưng riêng việc này để đường thứ 2 còn 17 tuần — nên phải cắt thêm G ít nhất 1 tuần (6→5), đưa đường đó về 16 luôn. Cách này chia nhỏ chi phí/rủi ro cắt giảm ra 3 hoạt động thay vì dồn vào 1.</p>\n     <p><strong>Giải pháp 3 — Rút ngắn bằng chồng lấn (fast-track) H và I, và chồng lấn E và F:</strong> thay vì đợi H xong hẳn, bắt đầu ~3 tuần đầu của I khi H đã làm được phần lớn (chồng lấn), giảm thời lượng thực tế H→I đi 3 tuần mà không cần thêm nguồn lực. Vì riêng cách này không đụng đường thứ 2, cần chồng lấn thêm E và F ít nhất 1 tuần trên đường đó. Đánh đổi: rủi ro phối hợp/làm lại cao hơn vì công việc sau bắt đầu trước khi đầu vào hoàn tất.</p>",
          "explanation": "<p><b>Verified independently by hand</b> (full forward + backward CPM pass from the raw precedence table, no source solution existed for this deck to check against) — 4 distinct paths, critical path Start-D-H-I-End at 19 weeks, float per activity all recomputed and cross-checked against the path durations.</p>|||<p><b>Đã tự tính tay độc lập</b> (đầy đủ CPM xuôi+ngược từ bảng precedence gốc, đề này không có file solution nào để đối chiếu) — 4 đường đi khác nhau, đường găng Start-D-H-I-End ở 19 tuần, float từng hoạt động đều tính lại và đối chiếu chéo với thời lượng từng đường.</p>",
          "rubric": [
            {
              "id": "all_paths",
              "criterion": "Correctly lists all 4 distinct start-to-end paths with correct individual durations.|||Liệt kê đúng đủ 4 đường đi khác nhau với thời lượng từng đường đúng.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "critical_path",
              "criterion": "Correctly identifies the critical path (Start-D-H-I-End) and total duration (19 weeks).|||Xác định đúng đường găng (Start-D-H-I-End) và tổng thời lượng (19 tuần).",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "near_critical_awareness",
              "criterion": "Recognizes that shortening only the original critical path by 3 weeks is not sufficient, because the second-longest path (17 weeks) would become the new bottleneck unless it is also addressed.|||Nhận ra chỉ rút ngắn đường găng gốc 3 tuần là chưa đủ, vì đường dài thứ 2 (17 tuần) sẽ thành đường găng mới nếu không xử lý cùng.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "three_valid_solutions",
              "criterion": "Proposes at least 3 distinct, technically sound schedule-compression solutions (crashing and/or fast-tracking) that genuinely achieve a 3-week reduction.|||Đề xuất đủ ít nhất 3 giải pháp rút ngắn lịch trình khác nhau, kỹ thuật hợp lý (crashing và/hoặc fast-tracking), thực sự đạt rút ngắn 3 tuần.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "WRITE",
          "points": 2,
          "prompt": "<p><strong>Request 5 (20%):</strong> assuming your project was reported with the following status: AC = $120,000; PV = $125,000; CV = -$10,000. Calculate and provide your comments (current status, forecast and recommended adjustment) on the schedule and cost performance of the project.</p>|||<p><strong>Yêu cầu 5 (20%):</strong> giả sử dự án được báo cáo với tình trạng: AC = 120,000$; PV = 125,000$; CV = -10,000$. Tính toán và nhận xét (tình trạng hiện tại, dự báo, đề xuất điều chỉnh) về hiệu suất tiến độ và chi phí của dự án.</p>",
          "sampleSolution": "<p><strong>Step 1 — derive EV from CV:</strong> CV = EV − AC → EV = CV + AC = −10,000 + 120,000 = <b>$110,000</b>.</p>\n     <p><strong>Calculations:</strong></p>\n     <ul><li>SV = EV − PV = 110,000 − 125,000 = <b>−$15,000</b></li>\n     <li>SPI = EV/PV = 110,000/125,000 = <b>0.88</b></li>\n     <li>CPI = EV/AC = 110,000/120,000 ≈ <b>0.92</b></li></ul>\n     <p><strong>Current status:</strong> the project is BOTH behind schedule (SPI=0.88&lt;1, SV=−$15,000 — less work completed than planned) AND over budget (CPI≈0.92&lt;1 — spending more than the value of work actually completed). This is a worse situation than a project that is only behind schedule OR only over budget — both dimensions need correction.</p>\n     <p><strong>Forecast:</strong> no total budget (BAC) was given in this request, so an absolute dollar EAC can't be computed — but the CPI of 0.92 means that, at the current cost efficiency, every dollar of remaining budgeted work will actually cost about $1/0.92 ≈ $1.09, i.e. roughly 9% more than planned if this trend continues.</p>\n     <p><strong>Recommended adjustment:</strong> investigate the root cause of the cost overrun (scope creep? underestimated task costs? inefficient work?) before approving more spending; reallocate resources toward the critical-path tasks to recover schedule; increase monitoring frequency (weekly instead of monthly) until both SPI and CPI trend back toward 1.0; consider a formal change request or re-baseline if the overrun is due to a scope change rather than inefficiency.</p>|||<p><strong>Bước 1 — suy ra EV từ CV:</strong> CV = EV − AC → EV = CV + AC = −10,000 + 120,000 = <b>110,000$</b>.</p>\n     <p><strong>Tính toán:</strong></p>\n     <ul><li>SV = EV − PV = 110,000 − 125,000 = <b>−15,000$</b></li>\n     <li>SPI = EV/PV = 110,000/125,000 = <b>0.88</b></li>\n     <li>CPI = EV/AC = 110,000/120,000 ≈ <b>0.92</b></li></ul>\n     <p><strong>Tình trạng hiện tại:</strong> dự án VỪA trễ tiến độ (SPI=0.88&lt;1, SV=−15,000$ — làm được ít việc hơn kế hoạch) VỪA vượt ngân sách (CPI≈0.92&lt;1 — chi nhiều hơn giá trị công việc thực làm được). Đây là tình huống XẤU HƠN dự án chỉ trễ tiến độ HOẶC chỉ vượt ngân sách — cả 2 chiều đều cần khắc phục.</p>\n     <p><strong>Dự báo:</strong> câu này không cho tổng ngân sách (BAC), nên không tính được EAC tuyệt đối bằng đô la — nhưng CPI=0.92 nghĩa là, với hiệu suất chi phí hiện tại, mỗi đồng công việc còn lại trong ngân sách sẽ tốn thực tế khoảng 1$/0.92 ≈ 1.09$, tức nhiều hơn ~9% so với kế hoạch nếu xu hướng này tiếp diễn.</p>\n     <p><strong>Đề xuất điều chỉnh:</strong> tìm nguyên nhân gốc của việc vượt chi phí (mở rộng phạm vi? ước lượng chi phí công việc thấp? làm việc kém hiệu quả?) trước khi duyệt thêm chi tiêu; phân bổ lại nguồn lực cho công việc trên đường găng để bù tiến độ; tăng tần suất theo dõi (hàng tuần thay vì hàng tháng) tới khi cả SPI và CPI trở lại gần 1.0; cân nhắc yêu cầu thay đổi chính thức hoặc lập lại baseline nếu vượt chi phí do thay đổi phạm vi chứ không phải kém hiệu quả.</p>",
          "explanation": "<p>Verified independently: since CV = EV − AC is given directly (−10,000) along with AC (120,000), EV must be derived first (EV = CV + AC = 110,000) before SV/SPI/CPI can be computed — a step easy to miss if a student tries to use the standard formulas directly without noticing EV isn't given. All formulas check out: SV=−15,000, SPI=0.88, CPI≈0.92.</p>|||<p>Đã tự verify độc lập: vì đề cho CV = EV − AC trực tiếp (−10,000) cùng AC (120,000), phải suy ra EV trước (EV = CV + AC = 110,000) mới tính được SV/SPI/CPI — bước này dễ bị bỏ sót nếu học viên áp công thức chuẩn ngay mà không để ý EV không được cho sẵn. Mọi công thức đều khớp: SV=−15,000, SPI=0.88, CPI≈0.92.</p>",
          "rubric": [
            {
              "id": "derive_ev",
              "criterion": "Correctly derives EV = $110,000 from the given CV and AC (CV = EV - AC).|||Suy ra đúng EV = 110,000$ từ CV và AC đã cho (CV = EV - AC).",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "sv_spi_cpi",
              "criterion": "Correctly calculates SV (-$15,000), SPI (0.88), and CPI (≈0.92).|||Tính đúng SV (-15,000$), SPI (0.88), và CPI (≈0.92).",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "commentary",
              "criterion": "Correctly identifies the project is BOTH behind schedule AND over budget, with a sensible, specific recommendation.|||Nhận ra đúng dự án VỪA trễ tiến độ VỪA vượt ngân sách, kèm đề xuất cụ thể hợp lý.",
              "weight": 1,
              "maxScore": 0.8
            }
          ]
        }
      ]
    }
  ]
};
