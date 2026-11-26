/**
 * Chương 8 — Iteration 2: luồng lõi & thay đổi giữa chừng (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 5 bài kiến thức (8.1–8.5), 1 bài Lab điều phối Iteration 2 trên CT Work LF #2 (8.6, dm5-8-lab)
 * và bài kiểm tra 10 câu tình huống (8.7, dm5-8-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s08/b1-uu-tien-luong-loi-rui-ro.mjs';
import B2 from './s08/b2-tich-hop-be-fe-hop-dong-cors.mjs';
import B3 from './s08/b3-change-request-giua-iteration.mjs';
import B4 from './s08/b4-no-ky-thuat-ghi-do-tra.mjs';
import B5 from './s08/b5-nghen-vai-can-tai-wip-cat-pham-vi.mjs';
import B6 from './s08/b6-lab.mjs';

const QUIZ8 = [
  Q('dm5-8-q1',
    'At the start of Iteration 2 (SWP-M2, Weeks 4–8), why does Risk-First Sequencing (Boehm 1988) put LabFlow\'s concurrent booking engine (S22) and Gate G1 (07/11) in Wave 1 ahead of easy settings/UI screens?|||Khi mở màn Iteration 2 (SWP-M2, Tuần 4–8), vì sao nguyên tắc Xếp Thứ Tự Rủi-Ro-Đi-Trước (Boehm 1988) đặt lõi đặt lịch đồng thời (S22) và Gate G1 (07/11) vào Đợt 1 (P0) trước các màn cài đặt/UI dễ làm?',
    [
      'Because easy settings screens cannot be written in React until Week 8|||Vì các màn cài đặt dễ không viết được bằng React trước Tuần 8',
      'Retiring the highest technical risk and core transactional invariant FIRST exposes schema/concurrency flaws while weeks of schedule remain, while low-risk Wave 3 (P2) screens act as safe buffer if time runs tight|||Tiêu diệt rủi ro kỹ thuật cao nhất và bất biến giao dịch lõi TRƯỚC TIÊN giúp lộ sớm lỗi schema/đồng thời khi còn nhiều tuần xử lý, trong khi các màn Đợt 3 (P2) rủi ro thấp làm vùng đệm an toàn nếu lịch bị căng',
      'Because Wave 3 screens give zero LOC credit in SWP391|||Vì các màn Đợt 3 không được tính điểm LOC trong SWP391',
      'So that you can skip writing unit tests for Wave 1 later|||Để sau đó bạn có thể bỏ qua việc viết unit test cho Đợt 1',
    ],
    1,
    'Building and proving the riskiest core engine first prevents last-minute architectural collapse before Demo Day (Barry Boehm\'s Spiral Model, 1988). Lesson 8.1.|||Xây và kiểm chứng lõi rủi ro cao nhất trước giúp tránh sập kiến trúc phút chót trước ngày Demo (Mô hình Xoắn ốc của Barry Boehm, 1988). Bài 8.1.'),

  Q('dm5-8-q2',
    'A developer protects against double-booking using only <code>if (!repo.existsOverlap(labId, start, end)) repo.save(...)</code> in Java and tests it by clicking quickly in two browser tabs. What security/engineering vulnerability still remains?|||Một lập trình viên chỉ chống đặt trùng bằng câu lệnh <code>if (!repo.existsOverlap(labId, start, end)) repo.save(...)</code> trong Java rồi tự test bằng cách bấm nhanh hai tab trình duyệt. Lỗ hổng kỹ thuật/bảo mật nào vẫn còn nguyên?',
    [
      'A TOCTOU Race Condition (CWE-362): two concurrent requests arriving almost simultaneously both pass the if-check and insert duplicate bookings — fix via PostgreSQL <code>btree_gist</code> + exclusion constraint (SQLSTATE <code>23P01 → 409</code>) + unique <code>Idempotency-Key</code> and prove with a 50-thread Testcontainers PostgreSQL test|||Lỗ hổng tranh chấp TOCTOU (CWE-362): hai request đồng thời đến gần như cùng lúc sẽ cùng vượt qua câu if và chèn hai lịch trùng — phải chặn bằng <code>btree_gist</code> + exclusion constraint PostgreSQL (SQLSTATE <code>23P01 → 409</code>) + <code>Idempotency-Key</code> duy nhất và chứng minh bằng test 50 luồng trên Testcontainers PostgreSQL',
      'None — Java if-statements are automatically atomic across database connections|||Không còn lỗ hổng nào — câu lệnh if trong Java tự động nguyên tử trên mọi kết nối CSDL',
      'Only a minor CSS layout bug in Chrome|||Chỉ là một lỗi bố cục CSS nhỏ trên Chrome',
      'A Git merge conflict on application.yml|||Một xung đột merge Git trên file application.yml',
    ],
    0,
    'Manual clicks in two tabs rarely overlap closely enough, whereas CWE-362 race conditions happen when two requests arrive almost simultaneously and both pass the if-check; only database-level constraints + atomic conditional updates + real PostgreSQL concurrency tests guarantee the invariant. Lesson 8.1.|||Tự bấm tay hai tab khó chạm sát thời điểm, trong khi tranh chấp CWE-362 xảy ra khi hai request đến gần như cùng lúc và cùng vượt qua câu if; chỉ ràng buộc cấp CSDL + cập nhật nguyên tử có điều kiện + test đồng thời PostgreSQL thật mới bảo đảm bất biến. Bài 8.1.'),

  Q('dm5-8-q3',
    'Your React app passes all MSW mock tests, and Spring Boot works in Postman, yet submitting S22 in the browser fails with a CORS error on the custom <code>Idempotency-Key</code> header. What is the SAFE, enterprise fix?|||Ứng dụng React qua sạch mọi test mock MSW, còn Spring Boot chạy ngon trên Postman, nhưng khi bấm gửi S22 trên trình duyệt lại bị lỗi CORS với header tuỳ chỉnh <code>Idempotency-Key</code>. Cách sửa AN TOÀN chuẩn doanh nghiệp là gì?',
    [
      'Set <code>allowedOriginPatterns("*")</code> together with <code>allowCredentials(true)</code> in Spring Security so every origin works forever|||Đặt <code>allowedOriginPatterns("*")</code> kèm <code>allowCredentials(true)</code> trong Spring Security để mọi nguồn đều chạy vĩnh viễn',
      'Remove the <code>Idempotency-Key</code> header completely so no preflight runs|||Xoá bỏ hoàn toàn header <code>Idempotency-Key</code> để trình duyệt khỏi gửi preflight',
      'Use Vite dev reverse proxy locally (same origin), and for cross-origin staging/prod configure an explicit Spring Security <code>CorsConfigurationSource</code> allowlist permitting the exact origin and <code>Idempotency-Key</code> header (with OPTIONS permitted before JWT auth)|||Dùng Vite dev reverse proxy ở máy cá nhân (cùng origin), còn ở staging/prod khác origin thì khai báo danh sách trắng rõ ràng trong <code>CorsConfigurationSource</code> cho phép đúng origin và header <code>Idempotency-Key</code> (cho OPTIONS đi qua trước kiểm JWT)',
      'Move the POST body parameters into URL query strings to bypass CORS|||Chuyển toàn bộ dữ liệu thân POST lên tham số URL để vượt qua CORS',
    ],
    2,
    'Wildcard CORS with credentials is an OWASP API8:2023 security misconfiguration (especially dangerous when auth relies on cross-site SameSite=None cookies or reflected-origin APIs); use Vite dev proxy locally, an explicit allowlist in staging/prod, and HttpOnly + SameSite=Lax/Strict cookies. Lesson 8.2.|||Mở CORS dấu sao kèm credentials là lỗi cấu hình bảo mật OWASP API8:2023 (đặc biệt nguy hiểm khi xác thực dùng cookie SameSite=None hoặc API phản chiếu Origin); hãy dùng Vite dev proxy ở máy dev, danh sách trắng rõ ràng ở staging/prod và cookie HttpOnly + SameSite=Lax/Strict. Bài 8.2.'),

  Q('dm5-8-q4',
    'During live BE–FE integration, React expects <code>startAt</code> (ISO-8601 UTC) as frozen in <code>docs/openapi.yaml</code>, but the Spring Boot endpoint returns <code>start_time</code> in naive local string format causing a 7-hour shift. Who owns the fix and where must it be fixed?|||Khi tích hợp BE–FE thật, React đọc trường <code>startAt</code> (ISO-8601 UTC) đúng như bản <code>docs/openapi.yaml</code> đã khoá, nhưng API Spring Boot lại trả <code>start_time</code> dạng chuỗi giờ địa phương không múi giờ làm lệch 7 tiếng. Ai chịu trách nhiệm và phải sửa ở đâu?',
    [
      'Dev FE (C4) should write a hack subtracting 7 hours and reading <code>start_time</code> in React|||Dev FE (C4) nên viết đoạn chữa cháy trừ đi 7 tiếng và đọc <code>start_time</code> ngay trong React',
      'Dev BE (C3) owns the fix because the backend violated the frozen OpenAPI contract — update the DTO/serialization to <code>startAt</code> ISO-8601 UTC (<code>Instant</code>/<code>timestamptz</code>) and add a contract test so drift never recurs|||Dev BE (C3) chịu trách nhiệm sửa vì backend đã vi phạm hợp đồng OpenAPI đã khoá — sửa DTO/tuần tự hoá về đúng <code>startAt</code> ISO-8601 UTC (<code>Instant</code>/<code>timestamptz</code>) và thêm test hợp đồng để không tái diễn',
      'Delete <code>docs/openapi.yaml</code> so there is no mismatch|||Xoá file <code>docs/openapi.yaml</code> đi cho hết lệch',
      'Leave it as-is and warn users in Vietnam to mentally add 7 hours|||Để nguyên và nhắc người dùng Việt Nam tự cộng nhẩm 7 tiếng',
    ],
    1,
    'Never hack around a contract violation in the consuming layer — fix the side that diverged from the frozen OpenAPI spec (lesson of NASA Mars Climate Orbiter 1999). Lesson 8.2.|||Không bao giờ vá tạm lỗi vi phạm hợp đồng ở phía gọi API — hãy sửa đúng bên đi lệch khỏi OpenAPI đã khoá (bài học NASA Mars Climate Orbiter 1999). Bài 8.2.'),

  Q('dm5-8-q5',
    'Mid-Iteration 2, your lecturer casually asks in one sentence: "Shorten check-in window from 15 to 10 minutes AND build a full safety-quiz subsystem before booking hazardous gear." What is the FIRST professional move under hats C2 + C1?|||Giữa Iteration 2, giảng viên nói gọn một câu: "Sửa cửa sổ check-in từ 15 xuống 10 phút VÀ làm thêm hẳn phân hệ thi quiz an toàn trước khi đặt thiết bị nguy hiểm." Bước đi chuyên nghiệp ĐẦU TIÊN dưới mũ C2 + C1 là gì?',
    [
      'Say "Yes sir!" immediately and pull two all-nighters to code both without touching SRS|||Gật đầu "Dạ vâng!" ngay lập tức rồi thức trắng hai đêm code cả hai mà không đụng tới SRS',
      'Bluntly say "No, scope is frozen" and refuse even the 10-minute config tweak|||Từ chối thẳng "Không được ạ, phạm vi đã khoá" và bác bỏ luôn cả việc chỉnh cấu hình 10 phút',
      'Pause coding, log and SPLIT the bundled request in CT Work <code>changes</code> into atomic <code>CR-01a</code> (cheap ~1h config rule) and <code>CR-01b</code> (heavy ~24h subsystem), run a 6-dimension Impact Analysis, and present clear trade-off options|||Dừng tay chưa code vội, ghi và CHẺ yêu cầu gộp trên trang <code>changes</code> CT Work thành <code>CR-01a</code> nguyên tử (luật cấu hình nhẹ ~1 giờ) và <code>CR-01b</code> (phân hệ nặng ~24 giờ), chạy Phân tích ảnh hưởng 6 chiều và trình các phương án đánh đổi rõ ràng',
      'Quietly code only the 10-minute rule and pretend you never heard the quiz request|||Âm thầm chỉ code luật 10 phút và giả vờ như chưa từng nghe yêu cầu làm quiz',
    ],
    2,
    'Splitting bundled requests into atomic CRs + running 6-dimension Impact Analysis lets you say Yes to cheap high-value tweaks while negotiating heavy scope cleanly (avoiding Denver Airport 1994 scope creep). Lesson 8.3.|||Chẻ yêu cầu gộp thành CR nguyên tử + chạy Phân tích ảnh hưởng 6 chiều giúp bạn nhận gọn các chỉnh sửa rẻ-giá-trị-cao trong khi đàm phán phần nặng minh bạch (tránh vỡ phạm vi kiểu Sân bay Denver 1994). Bài 8.3.'),

  Q('dm5-8-q6',
    'After the lecturer approves <code>CR-01a</code> (BR-08 check-in window 15 → 10 min), when and how must you run the 5-Point Baseline Sync?|||Sau khi giảng viên duyệt <code>CR-01a</code> (cửa sổ check-in BR-08 từ 15 → 10 phút), bạn phải chạy Đồng bộ nền 5 điểm khi nào và gồm những gì?',
    [
      'Wait until Week 20 Final Report to update documents all at once|||Chờ tới Tuần 20 làm Report 7 rồi sửa hết tài liệu một thể',
      'Update spec first and complete all 5 points BEFORE merging the CR PR: (1) CT Work <code>changes</code>/<code>approvals</code> + Task, (2) SRS <code>Record of Changes</code> (citing CR ID + approval date) &amp; BR-08 (+ SDS if changed), (3) Project Tracking <code>Q&amp;A</code>/<code>Issues</code>/<code>WBS</code>, (4) <code>RTM</code>, and (5) <code>Weekly Report</code>|||Cập nhật đặc tả trước và hoàn tất đủ 5 điểm TRƯỚC KHI merge PR của CR: (1) CT Work <code>changes</code>/<code>approvals</code> + Thẻ thực thi, (2) SRS <code>Record of Changes</code> (ghi mã CR + ngày duyệt) &amp; BR-08 (+ SDS nếu đổi), (3) Project Tracking <code>Q&amp;A</code>/<code>Issues</code>/<code>WBS</code>, (4) <code>RTM</code>, và (5) <code>Weekly Report</code>',
      'Only update the Java code because examiners never read SRS Business Rules|||Chỉ sửa code Java vì hội đồng không bao giờ đọc mục Business Rules trong SRS',
      'Delete BR-08 from SRS so there is no conflict|||Xoá luôn BR-08 khỏi SRS cho khỏi mâu thuẫn',
    ],
    1,
    'Code always follows the updated specification; completing all 5 baseline points (CT Work, SRS Record of Changes, Project Tracking, RTM, Weekly Report) before merging the CR PR prevents defense contradictions and unreviewed security holes. Lesson 8.3.|||Code luôn đi theo đặc tả đã cập nhật; hoàn tất đủ 5 điểm nền (CT Work, SRS Record of Changes, Project Tracking, RTM, Weekly Report) trước khi merge PR của CR giúp tránh mâu thuẫn khi bảo vệ và lỗ hổng bảo mật không được review. Bài 8.3.'),

  Q('dm5-8-q7',
    'Under Martin Fowler\'s Technical Debt Quadrant and the Equifax (2017, CVE-2017-5638) lesson, which shortcut is <strong>STRICTLY FORBIDDEN</strong> to defer as "Technical Debt for next sprint"?|||Theo Góc Phần Tư Nợ Kỹ Thuật của Martin Fowler và bài học Equifax (2017, CVE-2017-5638), đường tắt nào <strong>BỊ CẤM TUYỆT ĐỐI</strong> không được khất sang "Nợ kỹ thuật sprint sau"?',
    [
      'Temporarily keeping the 3-step <code>S22</code> wizard in one working 350-line React file (while reading <code>BR-04/05</code> from <code>S19</code> API) with a logged <code>TD-01</code> card scheduled for Week 7\'s 15% debt slot|||Tạm giữ wizard 3 bước <code>S22</code> trong một file React 350 dòng đang chạy tốt (vẫn đọc <code>BR-04/05</code> từ API <code>S19</code>) kèm thẻ <code>TD-01</code> hẹn tách gọn trong quỹ 15% nợ Tuần 7',
      'Leaving <code>@PermitAll</code> on an Admin/Staff endpoint, keeping <code>ddl-auto=update</code>, or leaving a known critical dependency CVE unpatched ("will fix in Iteration 3")|||Để tạm <code>@PermitAll</code> trên API Admin/Staff, bật <code>ddl-auto=update</code>, hoặc bỏ mặc thư viện dính lỗ hổng CVE nghiêm trọng ("để Iteration 3 sửa")',
      'Temporarily duplicating a small <code>tstzrange</code> date-validation helper across two screens while logging <code>TD-03</code> for next week\'s 15% debt slot|||Tạm lặp một hàm kiểm tra khoảng giờ <code>tstzrange</code> nhỏ ở hai màn hình kèm ghi thẻ <code>TD-03</code> hẹn trả trong quỹ 15% nợ tuần sau',
      'Using a clean synchronous MailTrap call temporarily while building the <code>N4</code> Outbox worker next week (logged as <code>TD-02</code>)|||Dùng tạm lời gọi MailTrap đồng bộ trong khi tuần sau dựng worker Outbox <code>N4</code> (đã ghi <code>TD-02</code>)',
    ],
    1,
    'Security Debt and Data-Integrity Debt are high-interest toxic P0 flaws — NEVER deferrable (Equifax 2017 exposed ~145–147M people\'s data via an unpatched Struts CVE). Lesson 8.4.|||Nợ Bảo Mật và Nợ Toàn Vẹn Dữ Liệu là lỗi độc hại mức P0 — TUYỆT ĐỐI không được khất (Equifax 2017 lộ dữ liệu khoảng 145–147 triệu người do chậm vá lỗ hổng Struts CVE). Bài 8.4.'),

  Q('dm5-8-q8',
    'On CT Work in Week 7, 5 PRs are piled up waiting in <code>In Review (3_Done)</code> (C5 QA bottleneck, exceeding the WIP ≤ 2 per-column limit) while 2 more cards sit in <code>2_Doing</code>. Applying Goldratt\'s Theory of Constraints and Little\'s Law, what should you do FIRST?|||Trên CT Work ở Tuần 7, 5 PR đang ùn ứ chờ ở cột <code>In Review (3_Done)</code> (điểm nghẽn C5 QA, vượt trần WIP ≤ 2 mỗi cột) trong khi 2 thẻ khác vẫn ở <code>2_Doing</code>. Áp dụng Lý thuyết Điểm Nghẽn của Goldratt và Định luật Little, bạn phải làm gì TRƯỚC TIÊN?',
    [
      'Open 2 more Dev BE branches immediately so Dev velocity stays high|||Mở ngay thêm 2 nhánh Dev BE để giữ vận tốc code luôn cao',
      'Tell C5 QA to skip unhappy-case and 403 security tests so all 5 cards turn Closed in 30 minutes|||Bảo mũ C5 QA bỏ qua test unhappy case và test bảo mật 403 để cả 5 thẻ sang Closed trong 30 phút',
      'Enforce "Stop Starting, Start Finishing": FREEZE new coding/branches in <code>2_Doing</code> immediately, run a dedicated C5 QA Clearing Blitz to verify &amp; merge the 5 queued PRs properly to Quality L2 until <code>In Review (3_Done)</code> drops to target <code>≤ 1</code>|||Ép luật "Dừng mở mới, lo dứt điểm": ĐÓNG BĂNG code/nhánh mới ở <code>2_Doing</code> ngay lập tức, chạy Chiến dịch Gỡ Nghẽn C5 QA để kiểm chứng và merge sạch 5 PR đang chờ đạt Quality L2 cho tới khi <code>In Review (3_Done)</code> hạ về mục tiêu <code>≤ 1</code>',
      'Pull two 2 a.m. all-nighters coding even faster on all 7 cards in parallel|||Thức trắng hai đêm tới 2 giờ sáng để code nhanh hơn nữa trên cả 7 thẻ song song',
    ],
    2,
    'Optimizing upstream Dev while QA is jammed only inflates WIP and Lead Time (Little\'s Law); freezing 2_Doing and elevating the bottleneck clears Done output cleanly down to target ≤ 1 without sacrificing security. Lesson 8.5.|||Tối ưu Dev phía trên khi QA đang tắc chỉ làm phình WIP và tăng Lead Time (Định luật Little); đóng băng 2_Doing và dồn lực gỡ điểm nghẽn giúp hạ hàng chờ về mục tiêu ≤ 1 mà không hy sinh bảo mật. Bài 8.5.'),

  Q('dm5-8-q9',
    'With 7 days left before <code>SWP-M2</code> and a genuine hour shortfall even after WIP rebalancing, which choice follows the 4-Rung Controlled Scope Cut Ladder?|||Còn 7 ngày tới mốc <code>SWP-M2</code> và sau khi cân tải WIP quỹ giờ vẫn thiếu thật, lựa chọn nào tuân đúng Thang Cắt Phạm Vi 4 Nấc có kiểm soát?',
    [
      'Keep all 12 screens by dropping unhappy-case validation and concurrency tests so every screen hits L1|||Giữ nguyên cả 12 màn bằng cách bỏ hết validate unhappy case và test đồng thời để màn nào cũng đạt L1',
      'Cut Rung 1–2 items first (e.g., Kanban drag-and-drop polish on S35, defer Wave 3/P2 screen S12 or secondary Iter 2 item S32/S34 to Iter 3), update CT Work + Project Tracking WBS/Issues, notify the lecturer honestly, and protect Quality L2 + Gate G1 + RBAC + sleep|||Cắt Nấc 1–2 trước (vd bỏ hiệu ứng kéo-thả trên S35, dời màn Đợt 3/P2 S12 hoặc mục phụ Iter 2 như S32/S34 sang Iter 3), cập nhật CT Work + Project Tracking WBS/Issues, báo giảng viên trung thực và giữ cứng Quality L2 + Gate G1 + RBAC + giấc ngủ',
      'Silently drop S24 Cancel Reservation without telling anyone or updating Tracking|||Âm thầm bỏ màn S24 Huỷ đặt lịch mà không báo ai hay cập nhật Tracking',
      'Skip sleep for 4 nights straight (violating Brooks\'s Law solo corollary)|||Bỏ ngủ 4 đêm liên tiếp (vi phạm hệ quả Định luật Brooks khi làm một mình)',
    ],
    1,
    'Trimming low-priority P2/Wave 3 or secondary Iter 2 scope transparently protects core Sprint Goal, Quality L2 (75%+ LOC), security invariants, and sustainable engineering stamina. Lesson 8.5.|||Cắt minh bạch phần P2/Đợt 3 hoặc mục phụ Iter 2 ưu tiên thấp giúp bảo vệ Sprint Goal lõi, Quality L2 (75%+ LOC), bất biến bảo mật và sức bền kỹ thuật. Bài 8.5.'),

  Q('dm5-8-q10',
    'Before passing the Chapter 8 Lab Rubric, your audit script outputs: <code>backend/ReservationService.java:42: // TODO: check quota later</code> and <code>CorsConfig.java:18: allowedOriginPatterns("*")</code>. Can you pass the lab right now?|||Trước khi tự chấm Rubric Lab Chương 8, lệnh quét của bạn in ra: <code>backend/ReservationService.java:42: // TODO: check quota later</code> và <code>CorsConfig.java:18: allowedOriginPatterns("*")</code>. Bạn có được tính Đạt bài lab ngay lúc này không?',
    [
      'Yes, as long as your self-score adds up to 8/10 on other items|||Có, miễn là các mục khác bạn tự cộng đủ 8/10',
      'NO — both lines are red-line violations of Lab 8.6 (an orphan TODO missing a <code>TD-xx</code> ticket on a core BR-05 rule, AND a wildcard CORS security misconfiguration); both must be fixed before passing|||KHÔNG — cả hai dòng đều vi phạm lằn ranh đỏ của Lab 8.6 (một TODO mồ côi thiếu mã <code>TD-xx</code> ngay trên luật lõi BR-05, VÀ cấu hình CORS dấu sao kém an toàn); phải sửa sạch cả hai trước khi tính Đạt',
      'Only the CORS line matters; orphan TODOs are fine if nobody reads the code|||Chỉ dòng CORS quan trọng; TODO mồ côi không sao nếu không ai đọc code',
      'Just hide the audit script output from your lab report|||Chỉ cần giấu kết quả lệnh quét khỏi báo cáo lab là xong',
    ],
    1,
    'Zero orphan TODOs and zero toxic security shortcuts are explicit red-line pass criteria in Lesson 8.4 &amp; Lab 8.6.|||0 TODO mồ côi và 0 đường tắt bảo mật độc hại là tiêu chí lằn ranh đỏ bắt buộc ở Bài 8.4 &amp; Lab 8.6.'),
];

export default {
  title: 'Chapter 8 — Iteration 2: Core Flows & Mid-Flight Changes|||Chương 8 — Iteration 2: luồng lõi & thay đổi giữa chừng',
  description: 'Điều phối Iteration 2 (SWP-M2, Tuần 4–8) khi dự án vào vùng giông gió thật: xếp thứ tự Rủi-Ro-Đi-Trước (3 đợt ưu tiên P0/P1/P2, Gate G1 07/11 với btree_gist + Testcontainers 2/10/50 chống đặt trùng & phòng TOCTOU CWE-362), sổ tay tích hợp BE–FE 5 phút (hợp đồng OpenAPI, mock, CORS/Auth an toàn OWASP API8), xử lý Change Request giữa vòng với Phân tích ảnh hưởng 6 chiều & đồng bộ nền 5 điểm, quản trị Nợ Kỹ Thuật 4 bước (Góc Fowler, bài học Netscape 6 & cấm khất Nợ Bảo Mật kiểu Equifax 2017), gỡ nghẽn cổ chai vai trò bằng WIP ≤ 2/cột & Thang Cắt Phạm Vi 4 nấc, kèm Lab thực chiến CT Work LF #2 và Kiểm tra 10 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    {
      title: '8.7 — Chapter 8 Quiz|||8.7 — Kiểm tra Chương 8',
      slug: 'dm5-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu hỏi tình huống bao trọn Chương 8: Xếp thứ tự Rủi-Ro-Đi-Trước (Boehm Spiral 1988) & phòng TOCTOU CWE-362 (btree_gist/23P01), chẩn đoán hợp đồng BE–FE & CORS an toàn (Mars Climate Orbiter 1999 & OWASP API8), chẻ Change Request + Phân tích ảnh hưởng 6 chiều + Đồng bộ nền 5 điểm (Sân bay Denver 1994), Góc Phần Tư Nợ Kỹ Thuật Fowler & bài học Equifax (2017), Lý thuyết Điểm Nghẽn Goldratt + Định luật Little + Thang Cắt Phạm Vi 4 nấc và lằn ranh đỏ Lab 8.6.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>8.7 — Check your mastery of Iteration 2: Core Flows &amp; Mid-Flight Changes</h2>
<p class="lead">Ten scenario-based questions covering Lessons 8.1–8.6. Aim for at least 8/10 before advancing to Chapter 9 (Testing Like a QA Team). Every explanation points straight back to the exact lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>8.7 — Kiểm tra độ nắm vững Iteration 2: Luồng lõi &amp; Thay đổi giữa chừng</h2>
<p class="lead">Mười câu hỏi tình huống bao trọn Bài 8.1–8.6. Hãy đặt mục tiêu đạt tối thiểu 8/10 trước khi bước sang Chương 9 (Kiểm thử như một đội QA). Mỗi giải thích đều trỏ thẳng về bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ8 },
    },
  ],
};
