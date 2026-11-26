/**
 * Chương 4 — Yêu cầu (mũ BA) (khoá "Đồ án một mình đóng 5 vai" — du-an-mot-minh-5-vai).
 * Gồm 7 bài kiến thức (4.1–4.7), 1 bài Lab thực hành trên CT Work LF #2 (4.8, dm5-4-lab) và bài kiểm tra 12 câu (4.9, dm5-4-quiz).
 */
import { Q } from './_chung.mjs';
import B1 from './s04/b1-khoi-goi-yeu-cau.mjs';
import B2 from './s04/b2-use-case-dac-ta.mjs';
import B3 from './s04/b3-business-rule-du-lieu.mjs';
import B4 from './s04/b4-screen-flow-wireframe.mjs';
import B5 from './s04/b5-user-story-ac.mjs';
import B6 from './s04/b6-report3-srs-rtm.mjs';
import B7 from './s04/b7-review-cheo-yeu-cau.mjs';
import B8 from './s04/b8-lab.mjs';

const QUIZ4 = [
  Q('dm5-4-q1',
    'You need your lecturer/client to confirm the lab cancellation rule before writing SRS v1.0. Which Q&amp;A entry follows enterprise BA best practice?|||Bạn cần giảng viên/khách hàng chốt luật huỷ phòng lab trước khi viết SRS v1.0. Dòng Q&amp;A nào đúng chuẩn BA doanh nghiệp?',
    [
      '"How should cancellation work? Please explain in detail."|||"Tính năng huỷ lịch hoạt động thế nào ạ? Nhờ thầy giải thích chi tiết."',
      '"We propose allowing free cancellation up to 2 hours before start time (stored in Admin Settings S19); within 2 hours, cancel is blocked with SM-13. Please confirm 2 hours or specify your preferred cutoff."|||"Nhóm đề xuất cho huỷ miễn phí trước giờ bắt đầu 2 giờ (cấu hình ở S19); trong vòng 2 giờ thì chặn và báo SM-13. Nhờ thầy xác nhận 2 giờ hoặc cho mốc mong muốn."',
      'Do not ask — silently hard-code 24 hours in Java and wait for Final Defense|||Không cần hỏi — cứ tự viết cứng 24 giờ trong Java rồi đợi tới buổi Bảo vệ',
      'Send 5 separate informal chat messages from 5 accounts without logging a Q&amp;A ID|||Nhắn 5 tin rời rạc từ 5 tài khoản mà không ghi mã Q&amp;A vào sổ'
    ],
    1,
    'A closed question with a concrete proposed default gets fast written sign-off, proves domain understanding, and traces straight into BR-07. Lesson 4.1.|||Câu hỏi đóng kèm đề xuất cụ thể giúp nhận xác nhận bằng văn bản nhanh, chứng tỏ nắm nghiệp vụ và truy vết thẳng sang BR-07. Bài 4.1.'),

  Q('dm5-4-q2',
    'When is a row in your Q&amp;A List truly considered "Closed"?|||Khi nào một dòng trong bảng Q&amp;A List mới thật sự được coi là "Đã đóng (Closed)"?',
    [
      'The moment you send the question email|||Ngay lúc bạn bấm gửi email hỏi',
      'The moment the lecturer nods verbally in class without writing anything down|||Ngay lúc giảng viên gật đầu miệng trên lớp mà chưa ghi chép gì',
      'Only after the confirmed answer is recorded in writing, copied into the official BR-xx / UC-xx / Scope document, AND the resulting trace ID is linked back in the Q&amp;A row|||Chỉ sau khi câu trả lời đã chốt được ghi bằng văn bản, cập nhật vào đúng BR-xx / UC-xx / Phạm vi chính thức VÀ gắn ngược mã truy vết đó vào dòng Q&amp;A',
      'At Week 20 right before zipping Report 7|||Ở Tuần 20 ngay trước lúc nén Report 7'
    ],
    2,
    'Verbal nods vanish in 3 weeks; closing a Q&amp;A requires updating the actual BR/UC artifact and recording the trace ID. Lesson 4.1.|||Cái gật đầu miệng sẽ bị quên sau 3 tuần; đóng Q&amp;A phải cập nhật vào đúng BR/UC và gắn mã truy vết. Bài 4.1.'),

  Q('dm5-4-q3',
    'Spot the classic Report 3 SRS error in this Use Case line: "Postcondition: System displays SM-10 and users cannot cancel within 2 hours (BR-07)."|||Tìm các lỗi Report 3 SRS kinh điển trong dòng Use Case sau: "Postcondition: System displays SM-10 and users cannot cancel within 2 hours (BR-07)."',
    [
      'Nothing is wrong — it is concise and helpful|||Không có lỗi gì — câu viết ngắn gọn và dễ hiểu',
      'Three errors at once: uses generic "System" instead of "LabFlow", puts a System Message (SM-10) in Postcondition, AND puts a Business Rule (BR-07) in Postcondition instead of describing resulting data state only|||Dính liền ba lỗi: viết chung "System" thay vì "LabFlow", nhét System Message (SM-10) vào Postcondition, VÀ nhét Business Rule (BR-07) vào Postcondition thay vì chỉ mô tả trạng thái dữ liệu sau kết thúc',
      'Only one error: missing an SQL INSERT query inside Postcondition|||Chỉ một lỗi: thiếu câu lệnh SQL INSERT trong Postcondition',
      'Only one error: BR-07 should be written in Vietnamese|||Chỉ một lỗi: mã BR-07 phải viết bằng tiếng Việt'
    ],
    1,
    'SEP490/SWP391 Report 3 rules: always write "LabFlow", keep Postconditions strictly to resulting data state across all endings, with ZERO BR-xx or SM-xx mixed in. Lesson 4.2.|||Luật Report 3 SEP490/SWP391: luôn dùng tên "LabFlow", Postcondition chỉ mô tả trạng thái dữ liệu sau mọi kiểu kết thúc, tuyệt đối không trộn BR-xx hay SM-xx. Bài 4.2.'),

  Q('dm5-4-q4',
    'In a Use Case Diagram for LabFlow AI, how must "Email Service" and "Join Waitlist" (optional when slot is full) be drawn relative to "Create Reservation"?|||Trong sơ đồ Use Case của LabFlow AI, "Email Service" và "Join Waitlist" (tuỳ chọn khi ca kín) phải vẽ thế nào so với "Create Reservation"?',
    [
      'Leave Email Service outside with no line; draw Create Reservation --«include»--&gt; Join Waitlist|||Đặt Email Service bên ngoài không cần đường nối; vẽ Create Reservation --«include»--&gt; Join Waitlist',
      'Place Email Service on the right as a Secondary Actor WITH a connecting line to Create Reservation; draw dashed arrow Join Waitlist --«extend»--&gt; Create Reservation (pointing from Extension to Base)|||Đặt Email Service bên phải làm Secondary Actor CÓ đường nối tới Create Reservation; vẽ mũi tên nét đứt Join Waitlist --«extend»--&gt; Create Reservation (từ UC mở rộng trỏ về UC gốc)',
      'Merge Email Service and Student into one Primary Actor|||Gộp Email Service và Student làm một Primary Actor',
      'Draw Create Reservation --«extend»--&gt; Join Waitlist (Base pointing to Extension)|||Vẽ Create Reservation --«extend»--&gt; Join Waitlist (UC gốc trỏ sang UC mở rộng)'
    ],
    1,
    'Secondary actors MUST connect to every UC that invokes them, and «extend» always points FROM the conditional extension UC TO the base UC. Lesson 4.2.|||Secondary actor PHẢI nối tới từng UC gọi nó, còn «extend» luôn có mũi tên đi TỪ UC mở rộng có điều kiện TỚI UC gốc. Bài 4.2.'),

  Q('dm5-4-q5',
    'What is the core BA &amp; Business-Rule lesson from the 2024 Moffatt v. Air Canada tribunal ruling (2024 BCCRT 149) for LabFlow AI?|||Bài học cốt lõi về BA &amp; Business Rule từ phán quyết Moffatt kiện Air Canada năm 2024 (2024 BCCRT 149) dành cho LabFlow AI là gì?',
    [
      'Never display error messages on a website|||Không bao giờ được hiện thông báo lỗi trên website',
      'Business Rules must be enforced deterministically in Backend/DB code (and AI features must have explicit no-answer/citation rules like BR-33) — never rely on prose or an LLM to enforce policies|||Business Rule phải được thực thi tất định ở Backend/DB (và tính năng AI phải có luật không-bịa/trích dẫn rõ như BR-33) — không bao giờ phó mặc luật nghiệp vụ cho văn xuôi hay LLM',
      'AI chatbots are legally exempt from company rules|||Chatbot AI được miễn trừ pháp lý khỏi quy định công ty',
      'Only airlines need Business Rule catalogs|||Chỉ hãng hàng không mới cần bảng Business Rule'
    ],
    1,
    'Air Canada was held liable when its chatbot invented a rule contradicting actual policy; deterministic rule enforcement and explicit AI no-answer guardrails (BR-33) prevent this. Lesson 4.3.|||Air Canada phải chịu trách nhiệm khi chatbot tự bịa luật trái chính sách thật; thực thi luật tất định ở code/DB và luật không-bịa (BR-33) chặn đứng rủi ro này. Bài 4.3.'),

  Q('dm5-4-q6',
    'Which Non-Functional Requirement (NFR) is written properly in measurable Planguage format for Report 3 §4?|||Yêu cầu phi chức năng (NFR) nào dưới đây được viết đúng chuẩn Planguage đo được cho Report 3 §4?',
    [
      '"LabFlow must be super fast, secure, and very user-friendly for all students."|||"LabFlow phải siêu nhanh, bảo mật và rất thân thiện với mọi sinh viên."',
      'Ambition: prevent double-bookings under load · Scale: CONFIRMED count from 50 parallel requests on one slot (Testcontainers Postgres) · Goal: exactly 1 CONFIRMED &amp; 49 HTTP 409 · Minimum (Fail): ≥ 2 CONFIRMED|||Ambition: chặn đặt trùng dưới tải · Scale: số lượt CONFIRMED từ 50 request song song cùng một ca (Testcontainers Postgres) · Goal: đúng 1 CONFIRMED &amp; 49 HTTP 409 · Minimum (Fail): ≥ 2 CONFIRMED',
      '"Use Redis cache and React memo everywhere."|||"Dùng Redis cache và React memo ở mọi nơi."',
      '"Response time should usually feel instant."|||"Thời gian phản hồi nhìn chung phải có cảm giác tức thì."'
    ],
    1,
    'Planguage requires Ambition, Scale (unit/method), Goal, and Minimum (Fail) — making NFRs objectively measurable in Report 5. Lesson 4.3.|||Planguage bắt buộc đủ Ambition, Scale (đơn vị/cách đo), Goal và Minimum (Fail) để Report 5 đo được bằng số thật. Bài 4.3.'),

  Q('dm5-4-q7',
    'In SRS §1.4.2 Screen Authorization, the cell for (Admin Settings S19, Student) is blank. Your React frontend hides the "Settings" sidebar link for Students. Is this security requirement satisfied?|||Trong bảng Phân quyền màn hình SRS §1.4.2, ô (Admin Settings S19, Student) để trống. Frontend React của bạn đã ẩn mục "Settings" trên menu của Student. Yêu cầu bảo mật này đã đạt chưa?',
    [
      'Yes — if a Student cannot see the button, they cannot open it|||Rồi — sinh viên không thấy nút thì không thể mở được',
      'No — hiding UI buttons is UX only (OWASP A01 Broken Access Control); every blank cell MUST also be enforced on Backend APIs returning HTTP 403 Forbidden and tested by C5 QA|||Chưa — ẩn nút trên UI chỉ là UX (OWASP A01 Broken Access Control); mọi ô trống PHẢI bị chặn cứng ở Backend API trả HTTP 403 Forbidden và được C5 QA kiểm chứng',
      'Yes — as long as the React route uses a gray disabled button|||Rồi — miễn là giao diện React tô xám nút đó đi',
      'No — you must delete the Admin Settings screen completely|||Chưa — phải xoá bỏ hoàn toàn màn Admin Settings'
    ],
    1,
    'Attackers bypass React menus with curl/Burp in seconds; Screen Authorization blank cells are Backend 403 contracts, not just UI hiding. Lesson 4.4.|||Kẻ tấn công vượt menu React bằng curl/Burp trong vài giây; ô trống trên Ma trận Phân quyền là hợp đồng chặn 403 ở Backend chứ không chỉ ẩn UI. Bài 4.4.'),

  Q('dm5-4-q8',
    'What are the 5 UI States every wireframe/mockup must account for BEFORE C4 Dev FE starts coding a screen?|||5 Trạng thái giao diện (UI States) mà mọi wireframe/mockup phải tính đủ TRƯỚC KHI C4 Dev FE bắt đầu code một màn hình là gì?',
    [
      'Red, Blue, Green, Yellow, and Dark Mode|||Đỏ, Xanh dương, Xanh lá, Vàng và Dark Mode',
      'Ideal (populated), Empty (SM-01), Loading (with disabled Submit), Inline Validation Error (field-level SM-xx), and Conflict/Server Error (409/403/500)|||Lý tưởng (có dữ liệu), Rỗng (SM-01), Đang tải (kèm khoá nút Submit), Lỗi nhập liệu tại chỗ (SM-xx theo từng trường) và Lỗi xung đột/Server (409/403/500)',
      'Desktop, Tablet, TV, Smartwatch, and Print|||Desktop, Tablet, TV, Smartwatch và Bản in',
      'Login, Register, Logout, Forgot Password, and Home|||Login, Register, Logout, Quên mật khẩu và Trang chủ'
    ],
    1,
    'Designing all 5 states upfront prevents Citibank-style UX confusion, double-submit bugs, blank crash screens, and missing error layouts. Lesson 4.4.|||Thiết kế đủ 5 trạng thái ngay từ đầu chặn nhầm lẫn UX kiểu Citibank, lỗi bấm đúp Submit, màn trắng khi lỗi và thiếu chỗ hiện thông báo. Bài 4.4.'),

  Q('dm5-4-q9',
    'To systematically cover unhappy cases (supporting Quality L2 preparation — confirm exact grading criteria with your lecturer) AND catch OWASP bugs early on every LabFlow Req card, which recommended Given/When/Then AC checklist should hat C2 use?|||Để phủ bài bản các ca lỗi (hỗ trợ chuẩn bị mục tiêu Quality L2 — xác nhận tiêu chí chấm cụ thể với giảng viên) VÀ chặn lỗ hổng OWASP sớm trên mỗi thẻ Req LabFlow, mũ C2 nên dùng checklist thiết kế AC Given/When/Then đề xuất nào?',
    [
      '1 Happy Path only ("User submits form and sees success")|||Chỉ cần 1 Happy Path ("Người dùng gửi form và thấy thành công")',
      'Only technical sub-tasks ("Create SQL table", "Write JPA Repo")|||Chỉ cần các việc con kỹ thuật ("Tạo bảng SQL", "Viết JPA Repo")',
      'The recommended "1 + 3 + 1" AC checklist: ≥ 1 Happy Path + ≥ 3 Unhappy Paths (blank/whitespace, boundary/range, conflict/wrong state) + ≥ 1 Security/Permission Abuse Path (wrong role or forged ID → 403/404)|||Checklist AC đề xuất "1 + 3 + 1": ≥ 1 Happy Path + ≥ 3 Unhappy Path (trống/dấu cách, giá trị biên, trùng/sai trạng thái) + ≥ 1 Ca bảo mật/lạm dụng quyền (sai role hoặc giả ID → 403/404)',
      'A 1-sentence note saying "Follow SRS"|||Một câu ngắn ghi "Làm theo SRS"'
    ],
    2,
    'The "1 + 3 + 1" Given/When/Then list is a recommended AC design checklist (not a SWP391 rule or automatic L2 guarantee) that helps build happy, unhappy, and Evil security scenarios into every ticket from Day 1; always confirm L2 criteria with your lecturer. Lesson 4.5.|||Bộ "1 + 3 + 1" Given/When/Then là checklist đề xuất để thiết kế AC (không phải quy định SWP391 hay bảo đảm tự động đạt L2), giúp đưa đủ kịch bản đẹp, ca lỗi và bảo mật vào từng thẻ từ Ngày 1; luôn xác nhận tiêu chí chấm L2 với giảng viên. Bài 4.5.'),

  Q('dm5-4-q10',
    'In Report 3 SRS §1.5 Conceptual ERD, your teammate suggests creating two separate tables — <code>students</code> and <code>lab_staff</code> — with duplicate email/password columns because they have different permissions. What does the SEP490 Report 3 rule say?|||Trong ERD khái niệm Report 3 SRS §1.5, đồng đội gợi ý tách thành hai bảng riêng — <code>students</code> và <code>lab_staff</code> — lặp lại các cột email/mật khẩu chỉ vì họ khác quyền. Quy tắc Report 3 SEP490 nói gì?',
    [
      'Great idea — create 6 separate tables for all 6 actors|||Ý hay — tạo luôn 6 bảng riêng cho cả 6 actor',
      'Wrong — do NOT split User and Staff into separate tables solely because of different roles; keep ONE unified <code>users</code> table linked to <code>roles</code> / <code>user_roles</code>|||Sai — KHÔNG tách bảng User và Staff thành các bảng riêng chỉ vì khác vai trò; giữ MỘT bảng <code>users</code> thống nhất nối với <code>roles</code> / <code>user_roles</code>',
      'Do not include User in the ERD at all|||Không cần vẽ bảng User trong ERD',
      'Store all roles as a comma-separated string inside the Labs table|||Lưu hết vai trò thành chuỗi cách nhau dấu phẩy trong bảng Labs'
    ],
    1,
    'A top Report 3/4 lecturer trap: derive entities from Normal Flow nouns and never split User/Staff tables just for roles. Lessons 4.3 &amp; 4.6.|||Một trong những lỗi thầy hay bắt nhất ở Report 3/4: rút thực thể từ danh từ Normal Flow và không tách bảng User/Staff chỉ vì khác vai trò. Bài 4.3 &amp; 4.6.'),

  Q('dm5-4-q11',
    'Where should you place your Requirement Traceability Matrix (RTM), when should you create it, and what does a blank <code>SDS §</code> cell mean on a row whose Status is <code>Coded</code>?|||Bạn nên đặt Ma trận truy vết yêu cầu (RTM) ở đâu, khởi tạo khi nào, và một ô <code>SDS §</code> để trống trên dòng có Status là <code>Coded</code> có ý nghĩa gì?',
    [
      'Insert RTM between Sheet 2 and Sheet 3 of Project Tracking in Week 20; blank SDS § is fine|||Chèn RTM vào giữa Sheet 2 và Sheet 3 của Project Tracking ở Tuần 20; ô SDS § trống không sao',
      'Add sheet <code>RTM</code> at the VERY END of <code>Project Tracking.xlsx</code> right after SRS v0.9 (leaving the 6 template sheets untouched); a blank <code>SDS §</code> on a <code>Coded</code> row is a RED defect (missing design diagram before Package submission)|||Thêm sheet <code>RTM</code> ở CUỐI file <code>Project Tracking.xlsx</code> ngay sau SRS v0.9 (giữ nguyên 6 sheet mẫu); ô <code>SDS §</code> trống trên dòng đã <code>Coded</code> là lỗi ĐỎ (thiếu sơ đồ thiết kế trước khi nộp Package)',
      'Delete Sheet 5 (Defects) and rename it RTM|||Xoá Sheet 5 (Defects) đi và đổi tên thành RTM',
      'Only track NFRs and skip Use Cases and Business Rules|||Chỉ theo dõi NFR, bỏ qua Use Case và Business Rule'
    ],
    1,
    'Starting RTM at SRS v0.9 and placing it as the last sheet catches missing SDS diagrams and missing tests automatically via COUNTIFS before submission. Lesson 4.6.|||Dựng RTM ngay từ SRS v0.9 ở sheet cuối cùng giúp tự động bắt lỗi thiếu sơ đồ SDS và thiếu test bằng COUNTIFS trước khi nộp. Bài 4.6.'),

  Q('dm5-4-q12',
    'You just finished drafting UC-12 and S22 AC under hat C2 (BA) at 21:00. Under the Solo Cross-Review Protocol (Lesson 4.7), what is the RIGHT way to validate your spec before starting Chapter 5 Design?|||Bạn vừa viết xong nháp UC-12 và AC cho S22 dưới mũ C2 (BA) lúc 21:00. Theo Quy trình Review chéo Solo (Bài 4.7), cách ĐÚNG để thẩm định đặc tả trước khi vào Thiết kế Chương 5 là gì?',
    [
      'Immediately mark it Approved at 21:02 under C2 while it is still fresh in your mind|||Duyệt ngay lúc 21:02 dưới mũ C2 cho nóng hổi kẻo quên',
      'Ask AI to silently rewrite the entire SRS document from scratch and submit without reading|||Bảo AI viết lại toàn bộ file SRS từ đầu rồi đem nộp luôn không cần đọc',
      'Take a cooling-off break (≥ 2h or overnight), switch to C3/C4 (Dev Feasibility + STRIDE-lite) and C5 (QA Testability/Weasel Words/Boundaries) in CT Work <code>reviews</code> — optionally using AI ONLY as a defect-listing adversary — fix every found defect under C2, then pass C1 DoR|||Nghỉ ngắt mạch (≥ 2 giờ hoặc qua đêm), đổi sang C3/C4 (Dev Khả thi + STRIDE-lite) và C5 (QA Kiểm được/Từ mơ hồ/Biên) trên trang <code>reviews</code> CT Work — tuỳ chọn cho AI CHỈ đóng vai liệt kê lỗ hổng — sửa hết dưới mũ C2 rồi qua cổng DoR của C1',
      'Skip requirement review completely and catch requirement bugs during Final Presentation|||Bỏ hẳn bước review yêu cầu và để tới buổi Bảo vệ cuối rồi sửa sau'
    ],
    2,
    'Cooling-off breaks author blindness; rotating C3/C4 + C5 + C1 with checklists (and AI strictly as a defect hunter) catches defects at 1/100th the post-release cost (Boehm &amp; Basili, 2001). Lesson 4.7.|||Nghỉ ngắt mạch phá chứng mù tác giả; xoay mũ C3/C4 + C5 + C1 có checklist (và AI chỉ liệt kê lỗi) bắt lỗi với chi phí rẻ hơn tới 100 lần so với sau phát hành (Boehm &amp; Basili, 2001). Bài 4.7.')
];

export default {
  title: 'Chapter 4 — Requirements Engineering (BA Hat)|||Chương 4 — Yêu cầu (mũ BA)',
  description: 'Trọn bộ quy trình Phân tích & Đặc tả Yêu cầu chuẩn doanh nghiệp và SEP490/SWP391 dưới mũ C2 BA trên CT Work (LF #2): Khơi gợi yêu cầu & Sổ Q&A câu hỏi đóng (bài học FBI VCF 170 triệu USD); Main Workflow & Đặc tả Use Case 7 dòng 6 Luật Vàng (bài học Knight Capital 2012, OWASP A04); Business Rules 5 loại song ngữ, System Messages riêng từng tham số, Data Dictionary & NFR Planguage (bài học Air Canada 2024, OWASP API6); Screen Flow, Ma trận phân quyền chặn 403 Backend, Wireframe/Figma 5 trạng thái UI & Duyệt Mockup (bài học Citibank 900 triệu USD); User Story lát cắt dọc INVEST + AC Given/When/Then "1+3+1" (bài học BBC DMI); Report 3 SRS tăng dần v0.9→v1.2 + khởi tạo RTM 3 bảng có COUNTIFS (bài học truy vết Boeing 737 MAX); Review chéo 3 mũ Dev Khả thi / QA Kiểm được + STRIDE-lite (Fagan 1976 & Boehm/Basili 2001); Lab trọn gói BA trên CT Work và Kiểm tra 12 câu.',
  lessons: [
    B1,
    B2,
    B3,
    B4,
    B5,
    B6,
    B7,
    B8,
    {
      title: '4.9 — Chapter 4 Quiz|||4.9 — Kiểm tra Chương 4',
      slug: 'dm5-4-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu hỏi tình huống bao trọn Chương 4: Q&A câu hỏi đóng & tiêu chí đóng Q&A, 6 Luật Vàng Đặc tả UC 7 dòng, Secondary Actor & chiều mũi tên «extend», bài học Air Canada 2024 & BR-33, NFR Planguage đo được, ảo giác ẩn nút OWASP A01, 5 trạng thái UI, checklist AC đề xuất "1+3+1" Given/When/Then, lỗi tách bảng User/Staff trong ERD, khởi tạo RTM 3 bảng với COUNTIFS và quy trình Review chéo 3 mũ có nghỉ ngắt mạch.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>4.9 — Check your mastery of Requirements Engineering (BA Hat)</h2>
<p class="lead">Twelve scenario-based questions covering Lessons 4.1–4.8. Aim for at least 10/12 before switching to the Dev Lead / Architect hat in Chapter 5 (System Architecture, ERD, OpenAPI &amp; Report 4 SDS). Every explanation points directly to the lesson to review.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>4.9 — Kiểm tra độ nắm vững Phân tích Yêu cầu (mũ BA)</h2>
<p class="lead">Mười hai câu hỏi tình huống bao trọn Bài 4.1–4.8. Hãy đặt mục tiêu đạt tối thiểu 10/12 trước khi đổi sang mũ Dev Lead / Kiến trúc sư ở Chương 5 (Kiến trúc hệ thống, ERD, OpenAPI &amp; Report 4 SDS). Mỗi lời giải đều chỉ rõ bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ4 },
    },
  ],
};
