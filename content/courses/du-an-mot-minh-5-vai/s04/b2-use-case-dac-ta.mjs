/**
 * 4.2 — Use case & đặc tả use case (dm5-4-2-use-case-dac-ta).
 * Nguồn chính phần khung hồ sơ: ngu-canh/sep490/03-Report3-SRS.md (khung 7 dòng, secondary actors, đánh số 4A/8E1, 10 lỗi thầy hay bắt).
 * Nguồn lịch sử/chuẩn đã kiểm: Alistair Cockburn — Writing Effective Use Cases (Addison-Wesley, 2000);
 * ISO/IEC/IEEE 29148:2018; U.S. SEC Release No. 70694 (2013) — Knight Capital Group 2012 ($440M loss);
 * OWASP Top 10:2021 — A04:2021 Insecure Design.
 * Không lặp lý thuyết cơ bản SWP391 2.1–2.2 hay SWR302 Ch4 — dẫn link và dạy cách vận hành thực chiến mũ C2 BA.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, ac, cs, ng, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L42 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.2', 'Chương 4 · Bài 4.2', `
<h2>${t('4.2 — Use Cases &amp; Use Case Specifications (The 7-Row Enterprise Standard)', '4.2 — Use case &amp; đặc tả use case (chuẩn bảng 7 dòng không bị thầy bắt lỗi)')}</h2>
<p class="lead">${t(
    'Once elicitation and your Q&amp;A List have settled <em>what the business needs</em>, hat C2 (BA) must turn those answers into a precise, step-by-step behavioral contract that C3 (Dev BE), C4 (Dev FE), and C5 (QA) can all build and test against without guessing. In SWP391, SEP490, and enterprise Basic Design, that contract is the <strong>Use Case &amp; Use Case Specification</strong>. Half of all lecturer deductions in Report 3 SRS come from poorly written Use Cases — this lesson gives you the exact step-by-step craft to get them right on the very first submission.',
    'Khi bước khơi gợi và Q&amp;A List đã chốt xong <em>nghiệp vụ cần gì</em>, mũ C2 (BA) phải chuyển các câu trả lời đó thành một bản hợp đồng hành vi rõ ràng từng bước để C3 (Dev BE), C4 (Dev FE) và C5 (QA) cùng xây và kiểm thử mà không phải tự đoán. Trong SWP391, SEP490 và tài liệu Basic Design ở doanh nghiệp, bản hợp đồng đó là <strong>Use Case &amp; Đặc tả Use Case (UC Specification)</strong>. Một nửa số lỗi thầy hay bắt trong Report 3 SRS nằm gọn ở phần này — bài này trang bị cho bạn quy trình từng bước để viết chuẩn ngay từ lần nộp đầu tiên.')}</p>

<h3>${t('Everyday picture: the airline boarding playbook — not just "fly the plane"', 'Liên tưởng đời thường: kịch bản lên máy bay — không phải chỉ ghi "cho khách lên tàu"')}</h3>
<p>${t(
    'An airline gate agent does not work from a sticky note saying "Let passengers board." They follow a structured operating script: <em>Precondition</em> (flight gate open, aircraft cleared), <em>Normal flow</em> (scan boarding pass → verify ID → green beep → passenger enters jet bridge), <em>Alternative flows</em> (step 2A: passenger requests wheelchair assistance; step 3A: seat upgraded at gate), <em>Exception flows</em> (step 2E1: boarding pass already scanned twice → alert security; step 2E2: scanner network down → switch to manual manifest), and <em>Postcondition</em> (passenger manifest count updated, gate sealed). That script IS a Use Case Specification: normal path for smooth days, alternative paths for valid choices, and exception paths so nobody panics when things break.',
    'Nhân viên cửa ra máy bay không làm việc dựa trên một tờ giấy nhớ ghi "Cho khách lên máy bay." Họ làm theo kịch bản chuẩn từng bước: <em>Tiền điều kiện</em> (cửa đã mở, tàu bay đã sẵn sàng), <em>Luồng chính</em> (quét thẻ lên tàu → đối chiếu giấy tờ → máy kêu bíp xanh → khách qua ống lồng), <em>Luồng thay thế</em> (bước 2A: khách cần xe lăn hỗ trợ; bước 3A: đổi hạng ghế ngay tại cửa), <em>Luồng ngoại lệ</em> (bước 2E1: thẻ đã bị quét lần thứ hai → báo an ninh; bước 2E2: máy quét mất mạng → chuyển sang danh sách dự phòng), và <em>Hậu điều kiện</em> (cập nhật tổng số khách lên tàu, đóng cửa). Kịch bản đó CHÍNH LÀ Đặc tả Use Case: luồng chính cho ngày đẹp trời, luồng thay thế cho các lựa chọn hợp lệ, và luồng ngoại lệ để không ai hoảng loạn khi có sự cố.')}</p>

<h3>${t('1. Definition &amp; Boundary: Main Workflow First, Use Case Second', '1. Định nghĩa &amp; ranh giới: Main Workflow trước, Use Case sau')}</h3>
<p>${t(
    'For textbook UML notation and actor-identification questions, review ',
    'Để ôn phần lý thuyết cơ bản về ký hiệu UML và cách tìm actor trên lớp, xem lại ')}${ac('software-development-project', 'swp391-2-1-elicitation-srs', t('SWP391 2.1 — Actors &amp; UC Diagrams', 'SWP391 2.1 — Actor &amp; Sơ đồ Use Case'))}, ${ac('software-development-project', 'swp391-2-2-use-case-backlog', t('SWP391 2.2 — Finding &amp; Naming Use Cases', 'SWP391 2.2 — Tìm và đặt tên Use Case'))}, ${t('and ', 'và ')}${ac('software-requirements', 'swr302-4-1-use-case-user-story', t('SWR302 4.1 — Use Cases &amp; User Stories', 'SWR302 4.1 — Use Case &amp; User Story'))}${t(
    '. Here is the practical distinction BA teams apply every day (aligned with Alistair Cockburn\'s <em>Writing Effective Use Cases</em>, 2000, and the SEP490 Report 3 guide):',
    '. Còn đây là quy tắc thực chiến mà các đội BA áp dụng hằng ngày (khớp với sách <em>Writing Effective Use Cases</em> của Alistair Cockburn, 2000 và hướng dẫn Report 3 SEP490):')}</p>
<ul>
<li>${t('<strong>Context Diagram (§1.1) &amp; Main Workflows (§1.2) come FIRST:</strong> Start with a single <strong>Context Diagram</strong> placing your system (<code>LabFlow AI</code>) at the center surrounded by all human actors and external systems — every arrow MUST label the <strong>data exchanged</strong> (e.g., <code>reservation request</code>, <code>confirmation &amp; QR token</code>), NEVER a function name! Next, draw 4–6 end-to-end <strong>Main Workflows</strong> (swimlanes showing how actors + <code>LabFlow</code> hand off work across stages) plus a numbered <strong>Detail Flow</strong> naming actors in each phase. Why? Jumping straight to 30 ovals misses handoffs between roles (e.g., forgetting what sits between "Student books" and "Lab Staff scans QR").', '<strong>Sơ đồ ngữ cảnh (§1.1) &amp; Main Workflows (§1.2) luôn đi TRƯỚC:</strong> Bắt đầu bằng một <strong>Context Diagram</strong> đặt hệ thống (<code>LabFlow AI</code>) ở giữa, xung quanh là mọi actor người và hệ thống ngoài — mỗi mũi tên PHẢI ghi <strong>dữ liệu trao đổi</strong> (vd <code>yêu cầu đặt lịch</code>, <code>xác nhận &amp; mã QR</code>), TUYỆT ĐỐI không ghi tên chức năng! Tiếp theo vẽ 4–6 <strong>Quy trình nghiệp vụ chính (Main Workflows)</strong> dạng làn bơi Swimlane (có làn <code>LabFlow</code>) kèm <strong>Detail Flow</strong> chia giai đoạn nêu rõ tên actor. Nếu nhảy thẳng vào 30 hình bầu dục UC, bạn rất dễ sót bước bàn giao giữa các vai.')}</li>
<li>${t('<strong>Standard SRS §1.3 &amp; §1.4.3 Tables:</strong> Lock three canonical tables before detailing any single UC: <code>§1.3.1 Actors</code> (<code># | Actor | Description</code>), <code>§1.3.2 Master UC List</code> (<code>ID | Use Case | Feature | Use Case Description</code>), and <code>§1.4.3 Non-UI Functions</code> (<code>Feature | System Function | Description</code> — for background jobs like <code>No-show Job</code> or <code>Email Outbox Sender</code>).', '<strong>Các bảng khung chuẩn SRS §1.3 &amp; §1.4.3:</strong> Khoá ba bảng chuẩn trước khi đặc tả từng UC lẻ: <code>§1.3.1 Actors</code> (<code># | Actor | Description</code>), <code>§1.3.2 Danh sách UC tổng</code> (<code>ID | Use Case | Feature | Use Case Description</code>), và <code>§1.4.3 Non-UI Functions</code> (<code>Feature | System Function | Description</code> — cho các job nền như <code>No-show Job</code> hay <code>Email Outbox Sender</code>).')}</li>
<li>${t('<strong>Primary vs. Secondary Actors &amp; 1 Diagram per Actor (§1.3.3 — top lecturer trap!):</strong> A <strong>Primary Actor</strong> initiates the UC to reach a goal (Student, Lab Manager, Timer). A <strong>Secondary Actor</strong> is an external service your system calls (Email Service, Payment Gateway, IoT Device, AI Model Service). <em>Two iron rules:</em> (1) Secondary actors MUST sit on the right of the UC Diagram WITH a connecting line to every UC that uses them; (2) create <strong>one UC Diagram per Actor</strong> (<code>1.3.3.x UCs for &lt;Actor&gt;</code>) with a <strong>2–4 sentence prose description below every figure</strong>.', '<strong>Primary vs. Secondary Actor &amp; Mỗi Actor một sơ đồ (§1.3.3 — bẫy thầy cực hay bắt!):</strong> <strong>Primary Actor</strong> khởi xướng UC (Student, Lab Manager, Timer). <strong>Secondary Actor</strong> là dịch vụ bên ngoài hệ thống gọi tới (Email Service, Cổng thanh toán, Thiết bị IoT, Dịch vụ AI). <em>Hai luật cứng:</em> (1) Secondary actor PHẢI đặt bên phải sơ đồ UC VÀ có đường nối tới đúng từng UC gọi nó; (2) vẽ <strong>mỗi Actor một sơ đồ UC riêng</strong> (<code>1.3.3.x UCs for &lt;Actor&gt;</code>) kèm <strong>đoạn mô tả 2–4 câu ngay dưới mỗi hình</strong>.')}</li>
<li>${t('<strong><code>«include»</code> vs. <code>«extend»</code> arrow direction (NO functional decomposition!):</strong> Use <code>«include»</code> ONLY when Base UC <em>always</em> invokes a genuine shared sub-behavior reused by multiple UCs (arrow points <strong>Base → Sub</strong>, e.g., <code>Create Reservation --«include»--&gt; Send Notification</code>, shared identically by Create, Cancel, and Approve — NEVER draw <code>«include»</code> for a single internal validation check like "Validate Availability", which is functional decomposition and belongs as a step + <code>BR-15</code>!). Use <code>«extend»</code> ONLY when Extension UC <em>optionally</em> branches in under a condition (arrow points <strong>Extension → Base</strong>, e.g., <code>Join Waitlist --«extend»--&gt; Create Reservation</code> only when the slot is full).', '<strong>Chiều mũi tên <code>«include»</code> và <code>«extend»</code> (CẤM phân rã chức năng vụn!):</strong> Chỉ dùng <code>«include»</code> khi UC gốc <em>luôn luôn</em> gọi một hành vi con dùng chung thật sự cho nhiều UC (mũi tên đi <strong>UC gốc → UC con</strong>, ví dụ <code>Create Reservation --«include»--&gt; Send Notification</code> dùng chung cho Tạo lịch, Huỷ lịch và Duyệt lịch — TUYỆT ĐỐI không vẽ <code>«include»</code> cho một bước kiểm tra lẻ như "Validate Availability" vì đó là lỗi phân rã chức năng, chỉ cần ghi bước kèm mã <code>BR-15</code>!). Chỉ dùng <code>«extend»</code> khi UC mở rộng <em>có thể</em> chen vào khi thoả điều kiện (mũi tên đi ngược <strong>UC mở rộng → UC gốc</strong>, ví dụ <code>Join Waitlist --«extend»--&gt; Create Reservation</code> chỉ xảy ra khi ca đã kín).')}</li>
<li>${t('<strong>One Name Everywhere:</strong> A Use Case is named <strong>Verb + Noun</strong> representing one complete user goal (<code>Create Reservation</code>, NOT <code>Reservation Page</code> and NOT <code>Click Submit Button</code>). Once locked in SRS §1.3.2, that EXACT name must match your WBS, SDS sequence diagram, Test Cases, User Guide, and RTM.', '<strong>Một tên duy nhất xuyên suốt:</strong> Use Case đặt tên theo dạng <strong>Động từ + Tân ngữ</strong> thể hiện một mục tiêu trọn vẹn (<code>Create Reservation</code>, KHÔNG đặt <code>Reservation Page</code> hay <code>Click Submit</code>). Một khi đã chốt ở SRS §1.3.2, tên ĐÓ phải giống hệt nhau trên WBS, sơ đồ tuần tự SDS, Test Case, User Guide và RTM.')}</li>
</ul>

<h4>${t('Worked Mini-Examples: Main Workflow Swimlane + 4-Phase Detail Flow (§1.2) &amp; Actor UC Diagram (§1.3.3)', 'Ví dụ mẫu gọn: Main Workflow Swimlane + Detail Flow 4 giai đoạn (§1.2) &amp; Sơ đồ UC theo Actor (§1.3.3)')}</h4>
${out(t(`1.2.1 LAB RESERVATION WORKFLOW — SWIMLANE (4 Lanes: always include a LabFlow lane!)
-------------------------------------------------------------------------------------
[Student/Lecturer] (1) Search catalog -> (2) Submit S22 wizard --------> (receive QR)
                          |                     |                            ^
[LabFlow]          (filter free slots) -> (check BR-04..06, BR-15)           |
                                            | [<=30 seats & no flagged eq.] -> CONFIRMED ---+
                                            | [>30 seats OR flagged eq.]    -> PENDING_APPROVAL
                                            v                                |
[Lab Manager]                      (3) Review S25 -> Approve / Reject -------+
                                                                             |
[Lab Staff]                                        (4) Scan QR on S28 -------+-> CHECKED_IN

DETAIL FLOW (4 numbered phases naming actors explicitly):
  1. Searching Phase (Student & LabFlow): Student searches by date, time, and capacity;
     LabFlow shows only open, available labs/equipment.
  2. Booking Phase (Student & LabFlow): Student submits S22; LabFlow confirms immediately
     or routes large labs / flagged equipment to PENDING_APPROVAL (or offers Waitlist if full).
  3. Approval Phase (Lab Manager & LabFlow): Lab Manager approves or rejects with a reason.
  4. Check-in Phase (Lab Staff & LabFlow): Lab Staff scans the student's QR within the window;
     otherwise Timer marks NO_SHOW and promotes the next waitlist entry.`, `1.2.1 QUY TRÌNH ĐẶT PHÒNG LAB — SWIMLANE (4 làn: luôn có làn LabFlow!)
-------------------------------------------------------------------------------------
[Student/Lecturer] (1) Tìm phòng trống -> (2) Gửi wizard S22 -----------> (nhận mã QR)
                          |                      |                            ^
[LabFlow]          (lọc lịch trống) ----> (kiểm BR-04..06, BR-15)             |
                                             | [<=30 chỗ & không TB cần duyệt] -> CONFIRMED -+
                                             | [>30 chỗ HOẶC TB cần duyệt]     -> PENDING_APPROVAL
                                             v                                |
[Lab Manager]                       (3) Soát S25 -> Duyệt / Từ chối ---------+
                                                                              |
[Lab Staff]                                         (4) Quét QR trên S28 -----+-> CHECKED_IN

DETAIL FLOW (4 giai đoạn đánh số nêu rõ tên actor — viết bằng tiếng Anh khi nộp SRS):
  1. Giai đoạn Tìm kiếm — Searching Phase (Student & LabFlow): Sinh viên tìm theo ngày,
     giờ và sức chứa; LabFlow chỉ hiện phòng/thiết bị đang mở và còn trống.
  2. Giai đoạn Đặt lịch — Booking Phase (Student & LabFlow): Sinh viên gửi form S22; LabFlow
     xác nhận ngay hoặc chuyển phòng lớn / thiết bị cần duyệt sang PENDING_APPROVAL (gợi ý Waitlist nếu kín).
  3. Giai đoạn Duyệt — Approval Phase (Lab Manager & LabFlow): Lab Manager duyệt hoặc từ chối kèm lý do.
  4. Giai đoạn Check-in — Check-in Phase (Lab Staff & LabFlow): Lab Staff quét mã QR trong cửa sổ
     check-in; nếu quá hạn, Timer đánh dấu NO_SHOW và đôn người đầu hàng đợi.`))}

${out(t(`1.3.3.2 UCs FOR STUDENT (PlantUML source + mandatory 2-4 sentence description!)
-------------------------------------------------------------------------------------
@startuml
left to right direction
actor Student
actor "Email Service" as Mail
rectangle "LabFlow AI" {
  usecase "Create Reservation" as UC12
  usecase "View My Reservations" as UC13
  usecase "Cancel Reservation" as UC14
  usecase "Join Waitlist" as UC15
}
Student --> UC12
Student --> UC13
Student --> UC14
UC15 .> UC12 : <<extend>>
UC12 --> Mail
UC14 --> Mail
@enduml

Figure 4: Use Case Diagram for Student.
Description (mandatory below every diagram!): Figure 4 illustrates the reservation Use Cases
initiated by Student within the LabFlow AI boundary. Students can create reservations, view
their booking list, and cancel eligible bookings; when a chosen slot is full, Join Waitlist
optionally extends Create Reservation. Email Service acts as a connected Secondary Actor to
deliver confirmation and cancellation emails.`, `1.3.3.2 SƠ ĐỒ UC CHO STUDENT (Mã nguồn PlantUML + đoạn mô tả 2-4 câu bắt buộc dưới hình!)
-------------------------------------------------------------------------------------
@startuml
left to right direction
actor Student
actor "Email Service" as Mail
rectangle "LabFlow AI" {
  usecase "Create Reservation" as UC12
  usecase "View My Reservations" as UC13
  usecase "Cancel Reservation" as UC14
  usecase "Join Waitlist" as UC15
}
Student --> UC12
Student --> UC13
Student --> UC14
UC15 .> UC12 : <<extend>>
UC12 --> Mail
UC14 --> Mail
@enduml

Figure 4: Use Case Diagram for Student (Sơ đồ Use Case cho Sinh viên).
Mô tả mẫu dưới hình (bắt buộc 2-4 câu — viết tiếng Anh khi nộp SRS):
  "Figure 4 illustrates the reservation Use Cases initiated by Student within the LabFlow AI
   boundary. Students can create reservations, view their bookings, and cancel eligible slots;
   when a slot is full, Join Waitlist optionally extends Create Reservation. Email Service is
   connected on the right as a Secondary Actor to send confirmation and cancellation emails."
  (Nghĩa: Hình 4 mô tả các UC đặt lịch của Sinh viên trong khung LabFlow AI: tạo, xem và huỷ
   lịch; khi ca kín, Join Waitlist mở rộng tuỳ chọn vào Create Reservation; Email Service nối
   bên phải làm Secondary Actor để gửi email xác nhận và huỷ lịch.)`))}

${cl('danger', `<p><strong>${t('Why explicit preconditions &amp; exception flows matter — Knight Capital Group (August 1, 2012, $440 million lost in 45 minutes):', 'Vì sao tiền điều kiện và luồng ngoại lệ phải viết rõ — Sự cố Knight Capital Group (01/08/2012, mất 440 triệu USD trong 45 phút):')}</strong> ${t(
    'As documented in <strong>U.S. SEC Release No. 70694 (2013)</strong>, when Knight Capital deployed a new order-routing feature, one of eight servers was missed during rollout, repurposing a retired flag that triggered an obsolete test routine on live market orders. In 45 minutes, the system executed millions of unintended trades and lost $440 million — nearly bankrupting the firm. While deployment hygiene was the trigger, the deeper behavioral failure was an unguarded system state with no explicit boundary checks or fail-safe exception stops. In every Use Case you write, your <strong>Preconditions</strong> and <strong>Exception Flows</strong> are the exact circuit breakers that keep edge states from turning into silent corruption.',
    'Theo hồ sơ chính thức <strong>U.S. SEC Release No. 70694 (2013)</strong>, khi Knight Capital triển khai tính năng định tuyến lệnh chứng khoán mới, một trong tám máy chủ bị sót bản cập nhật, khiến một cờ cấu hình cũ tái kích hoạt đoạn xử lý thử nghiệm bỏ hoang ngay trên lệnh giao dịch thật. Chỉ trong 45 phút, hệ thống khớp hàng triệu lệnh ngoài ý muốn, làm bốc hơi 440 triệu USD và đẩy công ty tới bờ vực phá sản. Dù lỗi deploy là ngòi nổ, căn nguyên hành vi nằm ở trạng thái hệ thống thiếu rào chắn tiền điều kiện và thiếu cơ chế dừng ngoại lệ an toàn. Trong mọi Use Case bạn viết, <strong>Preconditions</strong> và <strong>Exception Flows</strong> chính là cầu dao an toàn ngăn trạng thái lệch gây hỏng dữ liệu âm thầm.')}</p>`)}

<h3>${t('2. Step-by-Step: Writing a Bulletproof 7-Row Use Case Specification', '2. Từng bước viết Đặc tả Use Case chuẩn 7 dòng không tì vết')} ${mu('C2', en)}</h3>
<p>${t(
    'When textbook templates differ from your company or university template, <strong>the project template wins</strong>. In the FPT SEP490/SWP391 Report 3 standard, every Use Case Specification uses a <strong>7-row table</strong> (Row 1 has 4 cells: <code>Primary Actors | value | Secondary Actors | value</code>; Rows 2–7 span the content column). Follow these 6 strict drafting rules — every single rule directly blocks a classic lecturer deduction:',
    'Khi mẫu sách giáo khoa khác mẫu công ty hoặc mẫu trường, <strong>mẫu của dự án/thầy luôn thắng</strong>. Trong chuẩn Report 3 SEP490/SWP391, mỗi Đặc tả Use Case dùng đúng <strong>bảng 7 dòng</strong> (Dòng 1 có 4 ô: <code>Primary Actors | giá trị | Secondary Actors | giá trị</code>; Dòng 2–7 gộp ô nội dung). Tuân thủ đúng 6 luật soạn thảo sau — mỗi luật chặn thẳng một lỗi thầy hay trừ điểm nhất:')}</p>

<pre><code>${t(`  THE 6 GOLDEN RULES OF THE 7-ROW UC SPEC
  -------------------------------------------------------------------------
  1. SUBJECT NAME   : Always write "&lt;System Name&gt; ..." (e.g. "LabFlow validates..."),
                      NEVER generic "System ..." or "the app ...".
  2. BLACK-BOX ONLY : Describe external behavior (inputs, checks, states, outputs).
                      NO SQL queries, NO Java class names, NO React hooks!
  3. STEP NUMBERING : Normal Flow = 1, 2, 3... (alternating Actor &lt;-&gt; System).
                      Alternative = &lt;step&gt;A, &lt;step&gt;B (e.g. 4A, 4A.1 -&gt; Return to step 3 / Ends).
                      Exception   = &lt;step&gt;E1, &lt;step&gt;E2 (e.g. 8E1, 8E1.1 -&gt; Rollback / Ends).
                      Every referenced step number MUST EXIST and match that action!
  4. BR &amp; SM CODES  : Cite (BR-xx) at every validation/rule step, and (SM-xx) at
                      every displayed message step. Never leave rules unnamed.
  5. CLEAN POSTCOND : Postconditions describe ONLY resulting data/system state!
                      ZERO Business Rules, ZERO System Messages inside Postconditions!
  6. FULL COVERAGE  : Postconditions MUST cover Normal + EVERY Alternative/Exception
                      ending so they NEVER contradict an Alternative flow!`, `  6 LUẬT VÀNG CỦA ĐẶC TẢ USE CASE 7 DÒNG
  -------------------------------------------------------------------------
  1. TÊN CHỦ NGỮ    : Luôn viết "&lt;Tên Hệ Thống&gt; ..." (vd "LabFlow kiểm tra..."),
                      TUYỆT ĐỐI không viết chung "System ..." hay "ứng dụng ...".
  2. HỘP ĐEN        : Chỉ tả hành vi bên ngoài (đầu vào, kiểm tra, trạng thái, đầu ra).
                      KHÔNG viết câu lệnh SQL, tên lớp Java hay hook React!
  3. ĐÁNH SỐ BƯỚC   : Luồng chính = 1, 2, 3... (xen kẽ Actor &lt;-&gt; Hệ thống).
                      Luồng thay thế = &lt;bước&gt;A, &lt;bước&gt;B (vd 4A, 4A.1 -&gt; Quay lại bước 3 / Kết thúc).
                      Luồng ngoại lệ = &lt;bước&gt;E1, &lt;bước&gt;E2 (vd 8E1, 8E1.1 -&gt; Rollback / Kết thúc).
                      Mọi số bước tham chiếu PHẢI TỒN TẠI và khớp đúng thao tác!
  4. MÃ BR &amp; SM     : Gắn (BR-xx) ở mọi bước kiểm tra/luật, và (SM-xx) ở mọi bước
                      hiển thị thông báo. Không để luật hay câu lỗi trôi nổi không mã.
  5. POSTCOND SẠCH  : Hậu điều kiện CHỈ tả trạng thái dữ liệu/hệ thống sau khi xong!
                      0 mã Business Rule, 0 mã System Message trong Postconditions!
  6. PHỦ MỌI NHÁNH  : Postconditions PHẢI phủ Luồng chính + MỌI nhánh Alternative/Exception
                      để KHÔNG BAO GIỜ tự mâu thuẫn với một nhánh thay thế!`)}</code></pre>

<h3>${t('3. Reusable 7-Row UC Spec Template + Complete LabFlow Example (UC-12)', '3. Mẫu Đặc tả Use Case 7 dòng dùng lại được + Ví dụ hoàn chỉnh trên LabFlow (UC-12)')}</h3>
<p>${t('First, keep this <strong>reusable blank 7-row template</strong> in your project toolkit (works for any domain):', 'Trước hết, lưu sẵn <strong>khung trống bảng 7 dòng dùng lại được</strong> này vào bộ công cụ của bạn (áp cho mọi đề tài):')}</p>

${bang(
  [t('Row (Template)', 'Dòng (Khung mẫu)'), t('What to write (domain-independent rule)', 'Cần viết gì (luật tổng quát cho mọi đề tài)'), t('Instant C2 Self-Check', 'Tự kiểm nhanh dưới mũ C2')],
  [
    ['<strong>1. Primary / Secondary Actors</strong>', t('4 cells: <code>Primary Actors | &lt;Initiator&gt; | Secondary Actors | &lt;External service or None&gt;</code>', '4 ô: <code>Primary Actors | &lt;Người khởi xướng&gt; | Secondary Actors | &lt;Dịch vụ ngoài hoặc None&gt;</code>'), t('Does every Secondary Actor appear AND connect on the UC Diagram?', 'Mọi Secondary Actor đã xuất hiện VÀ có đường nối trên sơ đồ UC chưa?')],
    ['<strong>2. Description</strong>', t('1 short paragraph stating the user\'s goal (User Story form works cleanly: "As a…, I want…, so that…").', '1 đoạn ngắn nêu mục tiêu người dùng (viết dạng "Với tư cách…, tôi muốn…, để…" rất gọn).'), t('Goal-focused, NOT screen-layout description?', 'Tập trung vào mục tiêu, KHÔNG tả màu nút/giao diện?')],
    ['<strong>3. Preconditions</strong>', t('Numbered truths that MUST hold BEFORE Step 1 begins (authentication, role, entity existence/state).', 'Các điều kiện đánh số PHẢI đúng TRƯỚC Bước 1 (đăng nhập, vai trò, dữ liệu/trạng thái tồn tại).'), t('Only pre-existing state — no actions from Step 1?', 'Chỉ nêu trạng thái sẵn có — không nhét thao tác của Bước 1?')],
    ['<strong>4. Postconditions</strong>', t('Numbered data/system states AFTER the UC ends — covering Normal, Alternative endings, and Exception rollbacks.', 'Trạng thái dữ liệu/hệ thống đánh số SAU khi kết thúc — phủ Luồng chính, các nhánh thay thế và rollback ngoại lệ.'), t('ZERO BR-xx, ZERO SM-xx, ZERO contradictions with Alternatives?', '0 mã BR-xx, 0 mã SM-xx, 0 mâu thuẫn với Luồng thay thế?')],
    ['<strong>5. Normal Sequence/Flow</strong>', t('Step 1 (trigger) → Step N (success). Alternate Actor ↔ <code>&lt;System Name&gt;</code>; one action per step; cite <code>(BR-xx)</code> and <code>(SM-xx)</code>.', 'Bước 1 (kích hoạt) → Bước N (thành công). Xen kẽ Actor ↔ <code>&lt;Tên hệ thống&gt;</code>; mỗi bước 1 việc; gắn <code>(BR-xx)</code> và <code>(SM-xx)</code>.'), t('No "System ...", no SQL/Java class names, every validation cites a BR?', 'Không viết "System ...", không tên lớp Java/SQL, mọi bước kiểm đều có BR?')],
    ['<strong>6. Alternative Sequences/Flows</strong>', t('Valid alternate choices/branches: <code>4A. &lt;Title&gt;:</code> → <code>4A.1 …</code> → explicit end ("Return to step 3" or "The use case ends.").', 'Các nhánh hợp lệ khác: <code>4A. &lt;Tên nhánh&gt;:</code> → <code>4A.1 …</code> → ghi rõ kết thúc ("Quay lại bước 3" hoặc "Use case kết thúc.").'), t('Step prefix exists in Normal Flow and matches the branch point?', 'Số bước đầu nhánh có tồn tại trong Luồng chính và khớp đúng chỗ rẽ?')],
    ['<strong>7. Exception Flows</strong>', t('Error/failure/abuse paths: <code>8E1. &lt;Title&gt;:</code> → <code>8E1.1 …</code> (rollback, safe error message, retry/end).', 'Đường lỗi/sự cố/lạm dụng: <code>8E1. &lt;Tên lỗi&gt;:</code> → <code>8E1.1 …</code> (rollback, thông báo an toàn, thử lại hoặc kết thúc).'), t('Covers concurrency, external service down, and unauthorized abuse?', 'Đã phủ xung đột đồng thời, dịch vụ ngoài chết và lạm dụng quyền?')]
  ]
)}

<p>${t('Now see how that exact 7-row template comes alive on <strong>LabFlow AI — UC-12 Create Reservation</strong> (condensed from the SEP490 Report 3 guide; full booking workflow in ', 'Giờ xem đúng bảng 7 dòng đó chạy thật trên <strong>LabFlow AI — UC-12 Create Reservation</strong> (chắt lọc theo hướng dẫn Report 3 SEP490; luồng đặt lịch đầy đủ ở ')}${lf(t('Use cases &amp; Booking workflow', 'Use case và Luồng đặt phòng lab'))}${t('):', '):')}</p>

${bang(
  [t('Section', 'Mục'), t('LabFlow AI Worked Specification — UC-12 Create Reservation', 'Đặc tả mẫu LabFlow AI — UC-12 Tạo lượt đặt phòng lab')],
  [
    ['<strong>Primary / Secondary Actors</strong>', t('<strong>Primary:</strong> Student, Lecturer &nbsp;|&nbsp; <strong>Secondary:</strong> Email Service', '<strong>Primary:</strong> Student, Lecturer &nbsp;|&nbsp; <strong>Secondary:</strong> Email Service')],
    ['<strong>Description</strong>', t('As a Student or Lecturer, I want to reserve a lab or equipment for a time range so that I can use it without conflicting with other users.', 'Với tư cách Student hoặc Lecturer, tôi muốn đặt phòng lab hoặc thiết bị cho một khung giờ để sử dụng mà không trùng lịch với người khác.')],
    ['<strong>Preconditions</strong>', t('1. User is logged in to LabFlow as Student or Lecturer with status <code>ACTIVE</code>.<br>2. The selected lab or equipment exists and is bookable.', '1. Người dùng đã đăng nhập LabFlow với vai Student hoặc Lecturer và trạng thái <code>ACTIVE</code>.<br>2. Phòng lab hoặc thiết bị được chọn tồn tại và đang mở đặt.')],
    ['<strong>Postconditions</strong>', t('1. Normal flow (standard lab ≤ 30 seats and no equipment flagged <code>requires_approval</code>): a reservation exists with status <code>CONFIRMED</code>, a single-use QR check-in token is linked, an audit entry is recorded, and the time range is no longer free for that resource.<br>2. Alternative 9A (large lab &gt; 30 seats or equipment flagged <code>requires_approval</code>): a reservation exists with status <code>PENDING_APPROVAL</code>, no QR token is generated yet, an audit entry is recorded, and the request waits in the approval queue.<br>3. Alternative 4A (waitlist): no reservation is created; a waiting entry exists for that slot.<br>4. Alternative 3A &amp; Exceptions 8E1, 8E3: no reservation is created and availability is unchanged.<br>5. Exception 10E1: same as item 1 or 2; the email stays queued in outbox for retry.', '1. Luồng chính (phòng tiêu chuẩn ≤ 30 chỗ và không kèm thiết bị gắn cờ <code>requires_approval</code>): tồn tại một lượt đặt trạng thái <code>CONFIRMED</code>, gắn mã QR check-in dùng một lần, có dòng audit, và khung giờ đó không còn trống cho tài nguyên này.<br>2. Nhánh 9A (phòng lớn &gt; 30 chỗ hoặc có thiết bị gắn cờ <code>requires_approval</code>): tồn tại lượt đặt trạng thái <code>PENDING_APPROVAL</code>, chưa sinh mã QR, có dòng audit, và yêu cầu nằm trong hàng chờ duyệt.<br>3. Nhánh 4A (chọn waitlist): không tạo lượt đặt; tồn tại bản ghi chờ cho khung giờ đó.<br>4. Nhánh 3A &amp; Ngoại lệ 8E1, 8E3: không tạo lượt đặt và lịch trống giữ nguyên.<br>5. Ngoại lệ 10E1: kết quả dữ liệu như mục 1 hoặc 2; email nằm trong hàng đợi outbox để gửi lại.')],
    ['<strong>Normal Sequence/Flow</strong>', t('1. User clicks "Reserve" on Lab Detail.<br>2. LabFlow displays Create Reservation wizard step 1 ("Resource &amp; Time") pre-filled.<br>3. User picks date, start/end time, optional equipment, and clicks "Next".<br>4. LabFlow validates time &amp; quota (<code>BR-04</code>, <code>BR-05</code>) and checks slot is free (<code>BR-15</code>) and equipment is not under maintenance (<code>BR-11</code>).<br>5. LabFlow shows step 2 ("Details"); user enters purpose &amp; participants and clicks "Next".<br>6. LabFlow validates details (<code>BR-16</code>) and shows step 3 ("Review").<br>7. User clicks "Submit".<br>8. LabFlow saves the reservation in one atomic transaction; the database rejects any overlapping active reservation for the same resource (<code>BR-15</code>).<br>9. When the request does NOT require approval (lab capacity ≤ 30 seats AND no equipment flagged <code>requires_approval</code>, per <code>BR-06</code>), LabFlow sets status <code>CONFIRMED</code>, generates a single-use QR token, writes an audit entry (<code>BR-14</code>), and queues a confirmation email.<br>10. Email Service delivers the confirmation email.<br>11. LabFlow displays Reservation Detail with <code>SM-10</code>.', '1. Người dùng bấm "Reserve" trên màn Lab Detail.<br>2. LabFlow hiển thị bước 1 wizard Create Reservation ("Resource &amp; Time") đã điền sẵn phòng.<br>3. Người dùng chọn ngày, giờ bắt đầu/kết thúc, thiết bị kèm (tuỳ chọn) và bấm "Next".<br>4. LabFlow kiểm tra khung giờ &amp; hạn mức (<code>BR-04</code>, <code>BR-05</code>), kiểm tra slot còn trống (<code>BR-15</code>) và thiết bị không bảo trì (<code>BR-11</code>).<br>5. LabFlow hiện bước 2 ("Details"); người dùng nhập mục đích &amp; số người tham gia rồi bấm "Next".<br>6. LabFlow kiểm tra chi tiết (<code>BR-16</code>) và hiện bước 3 ("Review").<br>7. Người dùng bấm "Submit".<br>8. LabFlow lưu lượt đặt trong một transaction nguyên tử; CSDL từ chối mọi lượt đặt đang hiệu lực bị trùng giờ trên cùng tài nguyên (<code>BR-15</code>).<br>9. Khi lượt đặt KHÔNG thuộc diện cần duyệt (phòng ≤ 30 chỗ VÀ không có thiết bị gắn cờ <code>requires_approval</code> theo <code>BR-06</code>), LabFlow đặt trạng thái <code>CONFIRMED</code>, sinh mã QR dùng một lần, ghi dòng audit (<code>BR-14</code>) và xếp hàng email xác nhận.<br>10. Email Service gửi email xác nhận cho người dùng.<br>11. LabFlow mở màn Reservation Detail kèm thông báo <code>SM-10</code>.')],
    ['<strong>Alternative Sequences/Flows</strong>', t('<strong>3A. User cancels wizard:</strong> 3A.1 User clicks "Cancel". 3A.2 LabFlow discards inputs and returns to Lab Detail. Use case ends.<br><strong>4A. Slot is unavailable:</strong> 4A.1 LabFlow shows <code>SM-12</code> with up to 3 nearest free slots and "Join waitlist". 4A.2 If user picks another slot → return to step 4. 4A.3 If user clicks "Join waitlist" → perform <code>UC-15 Join Waitlist</code>; use case ends.<br><strong>9A. Request requires approval (lab capacity &gt; 30 seats OR equipment flagged <code>requires_approval</code>, per <code>BR-06</code>):</strong> 9A.1 LabFlow sets status <code>PENDING_APPROVAL</code> (no QR token), writes an audit entry (<code>BR-14</code>), and notifies the assigned Lab Manager / Lecturer (<code>BR-18</code>). 9A.2 Continue at step 10 with <code>SM-11</code> instead of <code>SM-10</code>.', '<strong>3A. Người dùng huỷ wizard:</strong> 3A.1 Người dùng bấm "Cancel". 3A.2 LabFlow huỷ dữ liệu đang nhập và quay lại Lab Detail. Use case kết thúc.<br><strong>4A. Khung giờ đã kín:</strong> 4A.1 LabFlow báo <code>SM-12</code> kèm tối đa 3 ca trống gần nhất và nút "Join waitlist". 4A.2 Nếu chọn ca gợi ý → quay lại bước 4. 4A.3 Nếu chọn "Join waitlist" → chạy <code>UC-15 Join Waitlist</code>; use case kết thúc.<br><strong>9A. Lượt đặt cần duyệt (phòng &gt; 30 chỗ HOẶC có thiết bị gắn cờ <code>requires_approval</code> theo <code>BR-06</code>):</strong> 9A.1 LabFlow đặt trạng thái <code>PENDING_APPROVAL</code> (chưa tạo QR), ghi dòng audit (<code>BR-14</code>) và thông báo Lab Manager / Lecturer phụ trách (<code>BR-18</code>). 9A.2 Tiếp tục bước 10 với <code>SM-11</code> thay cho <code>SM-10</code>.')],
    ['<strong>Exception Flows</strong>', t('<strong>8E1. Concurrent booking conflict:</strong> 8E1.1 Another overlapping reservation committed after step 4; DB rejects insert. 8E1.2 LabFlow rolls back and continues at 4A.1.<br><strong>8E2. Duplicate submission (double-click / network retry):</strong> 8E2.1 LabFlow detects identical idempotency key and returns the existing reservation without creating a second one. Continue at step 11.<br><strong>8E3. Database unavailable:</strong> 8E3.1 LabFlow rolls back, displays <code>SM-99</code>, keeps form input. Use case ends.<br><strong>10E1. Email Service unavailable:</strong> 10E1.1 LabFlow leaves email in outbox for retry; reservation stays valid. Continue at step 11.', '<strong>8E1. Xung đột đặt đồng thời:</strong> 8E1.1 Một lượt đặt trùng giờ khác vừa commit sau bước 4; CSDL từ chối ghi. 8E1.2 LabFlow rollback và chuyển sang 4A.1.<br><strong>8E2. Gửi trùng request (bấm đúp / mạng chậm thử lại):</strong> 8E2.1 LabFlow nhận diện khoá idempotency trùng và trả lại lượt đặt đã tạo, không tạo bản thứ hai. Tiếp tục bước 11.<br><strong>8E3. Mất kết nối CSDL:</strong> 8E3.1 LabFlow rollback, hiện <code>SM-99</code> và giữ lại dữ liệu trên form. Use case kết thúc.<br><strong>10E1. Email Service gặp sự cố:</strong> 10E1.1 LabFlow giữ email trong bảng outbox để gửi lại sau; lượt đặt vẫn hợp lệ. Tiếp tục bước 11.')]
  ]
)}

<h3>🕵️ ${t('The Hacker\'s Angle: State-Skipping &amp; Business Logic Bypass (OWASP A04:2021 Insecure Design)', 'Góc kẻ xấu: nhảy cóc bước &amp; qua mặt logic nghiệp vụ (OWASP A04:2021 Insecure Design)')}</h3>
<p>${t(
    'On the <strong>OWASP Top 10 (2021)</strong>, category <strong>A04:2021 Insecure Design</strong> specifically warns about missing control flows at the specification stage. Attackers do NOT click your wizard buttons in order! Suppose <code>UC-12</code> has Step 1 → Step 2 → Step 3 ("Review") → Submit, and the BA only checks availability at Step 4 without specifying re-validation at Step 8 ("Submit"). An attacker intercepts Step 7 with Burp Suite or <code>curl</code>, swaps the lab ID to a <code>CLOSED</code> lab or hazardous equipment they are not certified for, and submits directly. Similarly, in <code>UC-20 Approve Reservation</code>, if two Lab Managers click Approve/Reject on the same request at the same millisecond and you wrote no exception flow <code>6E2</code> (optimistic version conflict), the system corrupts audit history. <strong>BA defense:</strong> always re-state critical checks at the final commit step AND write explicit Exception Flows for race conditions, duplicate submits, and invalid state jumps.',
    'Trong bảng <strong>OWASP Top 10 (2021)</strong>, hạng mục <strong>A04:2021 Insecure Design (Thiết kế không an toàn)</strong> cảnh báo trực tiếp về việc thiếu luồng kiểm soát ngay từ khâu đặc tả. Kẻ tấn công KHÔNG bấm từng nút trên wizard theo đúng thứ tự! Giả sử <code>UC-12</code> có Bước 1 → Bước 2 → Bước 3 ("Review") → Submit, và BA chỉ ghi kiểm tra phòng trống ở Bước 4 mà quên ghi kiểm lại ở Bước 8 ("Submit"). Kẻ xấu chặn request ở Bước 7 bằng Burp Suite hoặc <code>curl</code>, đổi ID phòng sang phòng đang <code>CLOSED</code> hoặc thiết bị nguy hiểm chưa có chứng chỉ rồi gửi thẳng. Tương tự, ở <code>UC-20 Duyệt đặt lịch</code>, nếu hai Lab Manager cùng bấm Duyệt/Từ chối một yêu cầu trong cùng một mili-giây mà bạn không có luồng ngoại lệ <code>6E2</code> (xung đột phiên bản), lịch sử audit sẽ hỏng. <strong>Cách phòng từ mũ BA:</strong> luôn ghi rõ bước kiểm tra lại ngay tại thời điểm lưu giao dịch VÀ viết đủ Ngoại lệ cho tranh chấp đồng thời, gửi đúp và nhảy cóc trạng thái.')}</p>

<h3>${t('4. Top 6 Use Case Mistakes That Lose Marks — and Instant Fixes', '4. Sáu lỗi đặc tả Use Case khiến thầy trừ điểm nặng — và cách sửa ngay')}</h3>
<ul>
<li>${t('<strong>Writing "System displays..." instead of "LabFlow displays...":</strong> Direct deduction in SEP490 Report 3 reviews. Fix: run Ctrl+F for the word "System" across every UC before submitting.', '<strong>Viết "System displays..." thay vì "LabFlow displays...":</strong> Bị thầy bắt thẳng tay trong review Report 3. Cách sửa: bấm Ctrl+F tìm chữ "System" trên toàn bộ UC trước khi nộp.')}</li>
<li>${t('<strong>Stuffing Business Rules or System Messages into Postconditions:</strong> Writing "Postcondition: Show SM-10 and cancel must be &gt; 2h" mixes three different concepts. Fix: Postcondition ONLY describes stored data state ("Reservation status = CONFIRMED").', '<strong>Nhét Business Rule hoặc System Message vào Postcondition:</strong> Viết "Postcondition: Hiện SM-10 và phải huỷ trước 2h" là trộn ba khái niệm. Cách sửa: Postcondition CHỈ tả trạng thái dữ liệu sau khi xong ("Trạng thái lượt đặt = CONFIRMED").')}</li>
<li>${t('<strong>Contradictory Postconditions:</strong> Postcondition says "A reservation is ALWAYS created", while Alternative 3A says "User clicks Cancel and nothing is created." Fix: number Postconditions by outcome (1. Normal, 2. Alt 9A, 3. Cancel/Exception = no data created).', '<strong>Postcondition tự mâu thuẫn với Alternative Flow:</strong> Postcondition ghi "Lượt đặt LUÔN được tạo", trong khi nhánh 3A ghi "Người dùng bấm Cancel và không tạo gì". Cách sửa: đánh số Postcondition theo từng kiểu kết thúc (1. Luồng chính, 2. Nhánh 9A, 3. Huỷ/Ngoại lệ = không tạo dữ liệu).')}</li>
<li>${t('<strong>Broken step references (e.g., writing "6A" when Step 6 is not a branch point, or referencing Step 12 in an 11-step flow):</strong> Happens whenever you insert a new step in Normal Flow. Fix: re-verify every <code>nA</code> and <code>nE1</code> pointer as your final edit pass.', '<strong>Sai số bước tham chiếu (vd ghi nhánh "6A" nhưng Bước 6 không phải chỗ rẽ, hoặc trỏ về Bước 12 trong luồng chỉ có 11 bước):</strong> Rất hay xảy ra khi chèn thêm bước vào Normal Flow. Cách sửa: rà lại từng mã <code>nA</code>, <code>nE1</code> ở lượt soát cuối.')}</li>
<li>${t('<strong>Turning CRUD buttons into 4 tiny Use Cases or cramming 5 roles into 1 giant Use Case:</strong> "Click Save Button" is too small; "Manage Entire Lab System" is too big. Fix: use Alistair Cockburn\'s "coffee-break test" — one UC = one goal a user finishes in one sitting and then can go grab coffee.', '<strong>Xé nút bấm thành 4 UC vụn hoặc nhồi cả 5 vai vào 1 UC khổng lồ:</strong> "Bấm nút Lưu" quá nhỏ; "Quản lý toàn bộ hệ thống" quá to. Cách sửa: dùng phép thử "nghỉ uống cà phê" của Alistair Cockburn — một UC = một mục tiêu người dùng làm trọn trong một lượt ngồi rồi có thể đứng dậy đi uống cà phê.')}</li>
<li>${t('<strong>Forgetting Timer/Automated UCs:</strong> Background jobs (no-show marking, waitlist promotion, overdue reminders) still have flows, preconditions, and idempotency exceptions — assign them to Primary Actor <code>Timer</code> and list them in Non-UI Functions (SRS §1.4.3).', '<strong>Quên các UC chạy nền của Timer:</strong> Các job hẹn giờ (đánh dấu no-show, đôn waitlist, nhắc quá hạn) vẫn có luồng xử lý, tiền điều kiện và ngoại lệ chạy trùng — hãy gán Primary Actor là <code>Timer</code> và liệt kê trong Non-UI Functions (SRS §1.4.3).')}</li>
</ul>

${phongVan([
  [t('"What is the difference between an Alternative Flow and an Exception Flow in a Use Case?"', '"Alternative Flow và Exception Flow trong Use Case khác nhau ở đâu?"'), t('An Alternative Flow is a valid, expected variation of the business process where the user makes a different choice or hits a legitimate business branch (e.g., choosing to cancel the form, paying by voucher instead of card, or a large lab routing to approval). An Exception Flow handles an unexpected failure or broken condition that prevents normal completion (e.g., concurrent database conflict, network timeout to the email/payment gateway, or database down), requiring rollback or graceful fallback.', 'Alternative Flow là nhánh hợp lệ, nằm trong kịch bản nghiệp vụ bình thường khi người dùng chọn khác hoặc rẽ điều kiện nghiệp vụ (vd bấm Huỷ form, chọn vào waitlist khi ca kín, hoặc phòng lớn chuyển sang chờ duyệt). Exception Flow xử lý lỗi/sự cố khiến luồng không thể chạy tiếp bình thường (vd xung đột đồng thời ở DB, cổng email/thanh toán mất kết nối, DB sập), đòi hỏi rollback hoặc phương án dự phòng an toàn.')],
  [t('"Why should SQL queries and Java class names NEVER appear inside a Use Case Specification?"', '"Vì sao câu lệnh SQL và tên lớp Java TUYỆT ĐỐI không được xuất hiện trong Đặc tả Use Case?"'), t('Because SRS describes WHAT the system does from the outside (black box) so clients, BAs, developers, and QA share one language. Implementation choices (JPA, SQL, Redis) belong in SDS (Report 4); mixing them into SRS couples requirements to code and breaks the spec every time you refactor.', 'Vì SRS mô tả hệ thống làm CÁI GÌ nhìn từ bên ngoài (hộp đen) để khách hàng, BA, dev và QA nói cùng một ngôn ngữ. Lựa chọn kỹ thuật (JPA, SQL, Redis) thuộc về SDS (Report 4); trộn chúng vào SRS sẽ làm bản yêu cầu hỏng theo mỗi lần refactor code.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('On an e-commerce platform, your core UC is <code>UC-10 Place Order</code>: Primary Actor = Buyer, Secondary Actors = Payment Gateway (VNPay/Stripe) &amp; Shipping API. Normal flow locks stock atomically and creates split sub-orders; Alt <code>5A</code> applies a voucher; Exception <code>7E1</code> handles simultaneous stock exhaustion (last item bought by another buyer → rollback, suggest similar); Exception <code>8E1</code> handles Payment Gateway webhook timeout without double-charging (idempotency!).', 'Trên sàn TMĐT, UC lõi là <code>UC-10 Đặt đơn hàng</code>: Primary Actor = Người mua, Secondary Actors = Cổng thanh toán (VNPay/Stripe) &amp; API vận chuyển. Luồng chính giữ tồn kho nguyên tử và tách đơn con theo từng shop; Nhánh <code>5A</code> áp mã giảm giá; Ngoại lệ <code>7E1</code> xử lý hết hàng đồng thời (món cuối vừa bị người khác mua → rollback); Ngoại lệ <code>8E1</code> xử lý timeout webhook thanh toán mà không trừ tiền hai lần (idempotency!).')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('C2 owns SRS §1.2 Main Workflows + §1.3 Master UC List + UC Diagrams so every actor, Secondary Actor line, and UC name is frozen first. Then each of the 5 members writes the 7-row UC Specifications for their own 3–4 vertical-slice screens using the exact same template and submits them to C2 + C5 for cross-review before coding.', 'C2 giữ SRS §1.2 Main Workflows + §1.3 Danh sách UC tổng + Sơ đồ UC để khoá trước toàn bộ actor, đường nối Secondary Actor và tên UC. Sau đó mỗi người trong 5 thành viên tự viết Đặc tả UC 7 dòng cho đúng 3–4 màn hình miền dọc của mình theo chung một mẫu rồi gửi C2 + C5 soát chéo trước khi code.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('In formal V-model or Japanese outsourcing projects, 7-row UC specs map directly to <strong>Basic Design (BD) Functional Specs</strong> — every numbered step (<code>4A</code>, <code>8E1</code>) becomes a mandatory test condition in the client\'s System Test Specification, and omitting an exception path triggers a formal review rejection from the Japanese BrSE.', 'Ở dự án V-model hoặc outsourcing Nhật, Đặc tả UC 7 dòng tương đương trực tiếp với <strong>Basic Design (BD) Functional Spec</strong> — từng bước đánh số (<code>4A</code>, <code>8E1</code>) trở thành một điều kiện kiểm thử bắt buộc trong System Test Spec của khách, và bỏ sót nhánh ngoại lệ sẽ bị BrSE Nhật trả lại hồ sơ review ngay.')]
], en)}

${viecLabflow([
  [t('Under <strong>Sky Blue (C2 BA)</strong> on CT Work (<strong>LF #2</strong>), open <code>requirements</code> (or <code>spec</code>) and enter/verify the <strong>Master UC List</strong> for Iteration 1 + Iteration 2 core booking (at least 10 UCs) using exact <code>UC-xx</code> IDs and <code>Verb + Noun</code> names matching ', 'Dưới profile <strong>Xanh dương (C2 BA)</strong> trên CT Work (<strong>LF #2</strong>), mở trang <code>requirements</code> (hoặc <code>spec</code>) và nhập/đối chiếu <strong>Danh sách UC tổng</strong> cho Iteration 1 + lõi đặt lịch Iteration 2 (ít nhất 10 UC) dùng đúng mã <code>UC-xx</code> và tên dạng <code>Động từ + Tân ngữ</code> khớp với ')+lf(t('Use Cases &amp; 46 Screens', 'Use case và 46 màn hình'))+'.', t('Zero screen-named UCs ("Login Page"); every UC links to its Feature (<code>FE-xx</code>) and lists both Primary and Secondary Actors.', 'Không có UC nào đặt tên theo màn hình ("Trang Login"); mọi UC gắn mã Feature (<code>FE-xx</code>) và ghi rõ cả Primary lẫn Secondary Actor.')],
  [t('Draft TWO complete <strong>7-row Use Case Specifications</strong> in CT Work <code>requirements</code>/<code>docs</code>: one for <code>UC-12 Create Reservation</code> (adapt the structure in your own words to match your confirmed BRs) and one from scratch for <code>UC-14 Cancel Reservation</code> or <code>UC-20 Approve Reservation Request</code>.', 'Tự viết trọn vẹn HAI <strong>Đặc tả Use Case 7 dòng</strong> trên CT Work <code>requirements</code>/<code>docs</code>: một cho <code>UC-12 Create Reservation</code> (viết lại theo đúng BR bạn chốt) và một tự viết mới hoàn toàn cho <code>UC-14 Cancel Reservation</code> hoặc <code>UC-20 Approve Reservation Request</code>.'), t('Passes all 6 Golden Rules: uses "LabFlow" (0 occurrences of "System"), every Alternative/Exception step pointer exists, Postconditions contain 0 BR/SM codes and cover every ending, and ≥ 1 concurrency/abuse Exception Flow is specified.', 'Đạt trọn 6 Luật Vàng: dùng "LabFlow" (0 chữ "System"), mọi mã bước Alternative/Exception đều khớp bước thật, Postcondition có 0 mã BR/SM và phủ đủ mọi kết thúc, có ≥ 1 Exception Flow cho xung đột đồng thời hoặc lạm dụng.')]
], en)}

${thuatNgu([
  ['Main Workflow (Quy trình nghiệp vụ chính)', t('An end-to-end cross-role swimlane showing how multiple actors and the system collaborate across phases before drilling into single Use Cases.', 'Sơ đồ làn bơi đầu-cuối cho thấy nhiều actor và hệ thống phối hợp qua từng giai đoạn trước khi chẻ nhỏ thành từng Use Case.')],
  ['Primary / Secondary Actor (Tác nhân chính / phụ)', t('Primary actor initiates a Use Case to achieve a goal; Secondary actor is an external service/device called by the system to complete it.', 'Tác nhân chính khởi xướng UC để đạt mục tiêu; tác nhân phụ là dịch vụ/thiết bị bên ngoài được hệ thống gọi để hoàn thành UC.')],
  ['Normal / Alternative / Exception Flow', t('Main happy path / valid business variation branches (nA) / error, race, or failure handling paths (nE1).', 'Luồng chính thành công / các nhánh nghiệp vụ hợp lệ (nA) / luồng xử lý lỗi, tranh chấp hoặc sự cố (nE1).')],
  ['Precondition / Postcondition', t('Truths required before Step 1 starts / observable data states after any termination of the Use Case (no BRs or messages!).', 'Điều kiện phải đúng trước Bước 1 / trạng thái dữ liệu quan sát được sau mọi kiểu kết thúc UC (không chứa BR hay thông báo!).')],
  ['«include» vs. «extend»', t('Mandatory shared sub-behavior (Base → Sub) vs. optional conditional insertion (Extension → Base).', 'Hành vi con bắt buộc luôn chạy (Gốc → Con) so với nhánh chen thêm có điều kiện (Mở rộng → Gốc).')]
], en)}

${tomTat([
  t('Always map end-to-end Main Workflows (swimlanes) first, then lock the Master UC List and Actor-based UC Diagrams with Secondary Actors explicitly connected.', 'Luôn vẽ Main Workflows (swimlane) đầu-cuối trước, rồi khoá Danh sách UC tổng và Sơ đồ UC theo từng actor có nối đường rõ tới Secondary Actor.'),
  t('Follow the exact 7-row UC Specification template and 6 Golden Rules: system name ("LabFlow"), black-box steps, valid nA/nE1 step pointers, BR/SM tags, and contradiction-free data-only Postconditions.', 'Bám đúng khung Đặc tả UC 7 dòng và 6 Luật Vàng: gọi tên hệ thống ("LabFlow"), bước hộp đen, mã nA/nE1 trỏ đúng bước thật, gắn mã BR/SM, và Postcondition chỉ tả trạng thái dữ liệu không mâu thuẫn.'),
  t('Guard against OWASP A04 Insecure Design by specifying re-validation at commit steps plus explicit concurrency, duplicate-submit, and state-skipping Exception Flows.', 'Chặn lỗ hổng OWASP A04 Insecure Design bằng cách ghi rõ kiểm tra lại ở bước lưu giao dịch cùng các luồng ngoại lệ cho tranh chấp đồng thời, gửi đúp và nhảy cóc trạng thái.'),
  t('One UC name across SRS, WBS, SDS, Tests, and User Guide saves hours of painful rework before Final Defense.', 'Giữ duy nhất một tên UC xuyên suốt SRS, WBS, SDS, Test và User Guide giúp tiết kiệm hàng giờ sửa dây chuyền trước ngày bảo vệ.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-4-3-business-rule-du-lieu', t('4.3 — Business Rules, System Messages &amp; Data Constraints', '4.3 — Business rule, thông báo hệ thống &amp; ràng buộc dữ liệu'))}.</p>
`);
};

export default {
  title: '4.2 — Use Cases & Use Case Specifications (The 7-Row Standard)|||4.2 — Use case & đặc tả use case (chuẩn bảng 7 dòng)',
  slug: 'dm5-4-2-use-case-dac-ta',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cách viết Use Case & Đặc tả UC 7 dòng chuẩn doanh nghiệp/SEP490 dưới mũ C2 BA (không lặp SWP391 2.1–2.2): Main Workflow trước UC sau, Primary vs Secondary Actor, include/extend đúng chiều, bài học Knight Capital 2012 (SEC), 6 Luật Vàng chặn lỗi thầy hay bắt, ví dụ hoàn chỉnh UC-12 LabFlow, góc hacker OWASP A04 nhảy cóc trạng thái.',
  content: L42(true) + L42(false),
};
