/**
 * 4.4 — Screen flow, wireframe/mockup & duyệt mockup (dm5-4-4-screen-flow-wireframe).
 * Nguồn chính phần hồ sơ: ngu-canh/sep490/03-Report3-SRS.md (1.4.1 Screens Flow, 1.4.2 Screen Authorization, 3. UI Specifications 4 phần + tiền tố txt_/btn_/cbo_...).
 * Nguồn lịch sử/chuẩn đã kiểm: U.S. District Court SDNY ruling — In re Citibank August 11, 2020 Wire Transfers (2021) ($900M Revlon accidental wire via confusing UI);
 * OWASP Top 10:2021 — A01:2021 Broken Access Control.
 * Không lặp kỹ thuật dùng Figma chi tiết ở ux-ui-for-developers Ch3–Ch4 — dẫn link và dạy quy trình BA dựng + khoá + xin duyệt mockup trên CT Work.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, ac, cs, ng, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L44 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.4', 'Chương 4 · Bài 4.4', `
<h2>${t('4.4 — Screen Flow, Wireframes/Mockups, UI Field Specs &amp; Formal Mockup Sign-off', '4.4 — Screen flow, wireframe/mockup, đặc tả trường UI &amp; quy trình duyệt mockup')}</h2>
<p class="lead">${t(
    'Two people can read the exact same 3-page Use Case and picture two completely different screens in their heads. The only way to kill visual misunderstanding before burning 40 hours of React and Spring Boot code is to draw the <strong>Screen Flow</strong>, lock the <strong>Screen Authorization Matrix</strong>, sketch clean <strong>Wireframes/Mockups</strong> covering all 5 UI states, write the <strong>4-Part UI Field Specification</strong>, and get explicit <strong>Mockup Approval</strong> from your lecturer/client BEFORE a single UI component is coded.',
    'Hai người cùng đọc một bản Đặc tả Use Case dài 3 trang vẫn có thể hình dung ra hai màn hình khác hẳn nhau trong đầu. Cách duy nhất để diệt sạch hiểu lầm trực quan trước khi đốt 40 giờ code React và Spring Boot là vẽ <strong>Luồng màn hình (Screen Flow)</strong>, khoá <strong>Ma trận Phân quyền Màn hình (Screen Authorization)</strong>, phác <strong>Wireframe/Mockup</strong> phủ đủ 5 trạng thái giao diện, viết <strong>Đặc tả Trường UI 4 phần</strong>, và xin <strong>Duyệt Mockup chính thức</strong> từ giảng viên/khách hàng TRƯỚC KHI gõ dòng code giao diện đầu tiên.')}</p>

<h3>${t('Everyday picture: the house blueprint walk-through before pouring concrete', 'Liên tưởng đời thường: chốt bản vẽ phối cảnh trước khi đổ bê tông')}</h3>
<p>${t(
    'Moving a kitchen wall on an architect\'s sketch takes 30 seconds with an eraser. Moving that same wall after the bricks and concrete are poured costs a fortune and delays move-in day by a month. Wireframes and mockups are your software blueprint. In SWP391/SEP490, the lecturer rule is blunt: <em>"Wireframe confirmed by the lecturer BEFORE coding."</em> When you show a rough Figma wireframe in Week 2 and the lecturer says "Add an approval-reason box and merge Create/Edit into one form", you fix it in 5 minutes — instead of ripping apart 6 React files and 2 DTOs the night before Iteration 1 submission.',
    'Dời một bức tường bếp trên bản vẽ kiến trúc chỉ tốn 30 giây dùng cục tẩy. Dời đúng bức tường đó sau khi đã xây gạch đổ bê tông tốn cả đống tiền và trễ ngày dọn vào nhà cả tháng. Wireframe và mockup chính là bản vẽ kiến trúc phần mềm của bạn. Trong SWP391/SEP490, luật thầy rất rõ: <em>"Wireframe phải được giảng viên xác nhận TRƯỚC khi code."</em> Khi bạn đưa wireframe Figma ngay Tuần 2 và thầy góp ý "Thêm ô lý do từ chối và gộp form Create/Update làm một", bạn sửa trong 5 phút — thay vì phải đập đi viết lại 6 file React và 2 DTO ngay đêm trước hạn nộp Iteration 1.')}</p>

<h3>${t('1. Why Bad UI Specs &amp; Confusing Mockups Cost Real Billions', '1. Vì sao đặc tả UI cẩu thả và màn hình rối rắm gây thiệt hại thật hàng trăm triệu USD')}</h3>
<p>${t(
    'For hands-on Figma mechanics (Auto Layout, components, prototypes, and 5 UI states), see ',
    'Để học kỹ thao tác dựng Figma (Auto Layout, component, prototype và 5 trạng thái giao diện), xem thêm ')}${cs('ux-ui-for-developers', 'uxui-3-2-luong', t('UX/UI 3.2 — User flows &amp; task flows', 'UX/UI 3.2 — Luồng người dùng &amp; luồng tác vụ'))}, ${cs('ux-ui-for-developers', 'uxui-3-3-trang-thai', t('UX/UI 3.3 — Designing all 5 UI states', 'UX/UI 3.3 — Thiết kế đủ 5 trạng thái UI'))}, ${t('and ', 'và ')}${cs('ux-ui-for-developers', 'uxui-4-1-phac-thao', t('UX/UI 4.1 — Low-fidelity wireframes', 'UX/UI 4.1 — Phác thảo &amp; wireframe'))}${t(
    '. Here we focus on the BA deliverables that bridge Figma straight into Report 3 SRS and C4 Dev FE.',
    '. Ở đây ta tập trung vào các sản phẩm bàn giao của mũ C2 BA nối thẳng từ Figma sang Report 3 SRS và C4 Dev FE.')}</p>

${cl('danger', `<p><strong>${t('Real-world failure — Citibank\'s $900 Million Accidental Wire Transfer to Revlon Lenders (August 11, 2020):', 'Sự cố thật — Citibank bấm nhầm chuyển khoản 900 triệu USD cho chủ nợ của Revlon (11/08/2020):')}</strong> ${t(
    'In August 2020, Citibank intended to wire $7.8 million in interest payments to Revlon\'s lenders. Instead, operators accidentally wired nearly <strong>$900 million</strong> of Citibank\'s own funds. As detailed in the U.S. District Court (SDNY) ruling <em>In re Citibank August 11, 2020 Wire Transfers</em> (2021), the banking software (Flexcube) had an unintuitive legacy screen where sending only interest required checking THREE obscure wash-account checkboxes ("Principal", "Front", "Fund") simultaneously — checking only "Principal" silently defaulted to paying the entire principal loan, with no clear human-readable confirmation summary showing "$900,000,000 leaving Citibank"! That single UX/mockup failure turned into years of high-stakes federal litigation. Lesson for hat C2: <em>every destructive or high-stakes action needs an unambiguous Review step or Confirmation dialog specified right on the wireframe.</em>',
    'Tháng 8/2020, Citibank chỉ định chuyển 7,8 triệu USD tiền lãi cho các chủ nợ của Revlon. Thay vào đó, nhân viên thao tác bấm nhầm chuyển đi gần <strong>900 triệu USD</strong> tiền gốc của chính Citibank. Theo hồ sơ phán quyết của Toà án Liên bang Mỹ (SDNY, <em>In re Citibank August 11, 2020 Wire Transfers</em>, 2021), màn hình phần mềm ngân hàng (Flexcube) thiết kế cực kỳ khó hiểu: muốn chỉ trả lãi phải tick cùng lúc BA ô tài khoản trung gian mờ mịt ("Principal", "Front", "Fund") — nếu chỉ tick mỗi "Principal", hệ thống mặc định chuyển toàn bộ tiền gốc mà KHÔNG hiện hộp xác nhận dễ đọc kiểu "Bạn sắp chuyển 900.000.000 USD"! Lỗi thiết kế màn hình đó kéo ngân hàng vào vụ kiện tụng liên bang kéo dài nhiều năm. Bài học cho mũ C2: <em>mọi thao tác huỷ/xoá/duyệt quan trọng phải có bước Review hoặc hộp thoại Xác nhận viết rõ ngay trên wireframe.</em>')}</p>`)}

<h3>${t('2. The 5-Step Screen &amp; Mockup Pipeline (General Process for Any Project)', '2. Quy trình 5 bước Screen Flow → Mockup → Duyệt (tổng quát cho mọi đề tài)')} ${mu('C2', en)}</h3>

<pre><code>${t(`  [Step 1] SCREEN FLOW        Map how each Role navigates from Home/Login to every screen
        |                     (exact Screen IDs &amp; transition triggers; zero dead-end screens!)
        v
  [Step 2] SCREEN AUTH MATRIX Build Screen x Role table (X = allowed, blank = backend 403!)
        |                     Add footnotes where two roles share a screen with different scopes
        v
  [Step 3] WIREFRAME / MOCKUP Sketch Low-Fi first -&gt; clean Figma Mockup covering ALL 5 states:
        |                     Ideal | Empty | Loading | Validation Error | Permission/Server Error
        v
  [Step 4] 4-PART UI SPEC     Write SRS §3: Figure + "Allows actor to" + "Can also" +
        |                     2-column Field Description table (txt_/cbo_/dtp_/num_/btn_/lnk_ + BR/SM!)
        v
  [Step 5] FORMAL SIGN-OFF    Upload mockup + approval link on CT Work requirements/wiegers -&gt;
                              Lecturer/Client confirms BEFORE C4 Dev FE writes 1 line of React!`, `  [Bước 1] LUỒNG MÀN HÌNH     Vẽ đường đi của từng Vai từ Home/Login tới mọi màn hình
        |                     (đúng mã màn &amp; thao tác chuyển; 0 màn cụt đường!)
        v
  [Bước 2] MA TRẬN PHÂN QUYỀN Lập bảng Màn hình x Vai trò (X = được phép, trống = chặn 403 Backend!)
        |                     Ghi chú rõ nếu hai vai chung một màn nhưng khác phạm vi (vd S25)
        v
  [Bước 3] WIREFRAME / MOCKUP Phác Low-Fi trước -&gt; dựng Figma sạch phủ ĐỦ 5 trạng thái:
        |                     Lý tưởng | Rỗng | Đang tải | Lỗi tại chỗ | Lỗi quyền/xung đột Server
        v
  [Bước 4] ĐẶC TẢ UI 4 PHẦN   Viết SRS §3: Ảnh Figure + "Allows actor to" + "Can also" +
        |                     Bảng 2 cột Field Name | Description (txt_/cbo_/dtp_/num_/btn_/lnk_ + BR/SM!)
        v
  [Bước 5] DUYỆT CHÍNH THỨC   Gắn mockup + link duyệt lên CT Work requirements/wiegers -&gt;
                              GV/Khách xác nhận TRƯỚC KHI C4 Dev FE viết dòng React đầu tiên!`)}</code></pre>

<ol>
<li>${t('<strong>Step 1 — Draw the Screen Flow (SRS §1.4.1):</strong> Group navigation paths by role starting from <code>Home</code> / <code>Login</code>. Every box represents ONE screen whose name matches SRS §1.4.2 and §3 word-for-word. Every arrow carries the user trigger (<code>click "Reserve"</code>, <code>409 conflict → "Join Waitlist"</code>, <code>click "Cancel"</code>). Check for orphan screens (unreachable) and dead-end screens (no Back/Home path).', '<strong>Bước 1 — Vẽ Luồng màn hình (Screen Flow — SRS §1.4.1):</strong> Gom luồng điều hướng theo từng vai trò bắt đầu từ <code>Home</code> / <code>Login</code>. Mỗi hộp là MỘT màn hình mang tên khớp từng chữ với bảng §1.4.2 và mục §3. Mỗi mũi tên ghi thao tác kích hoạt (<code>bấm "Reserve"</code>, <code>lỗi 409 → "Join Waitlist"</code>, <code>bấm "Cancel"</code>). Soát kỹ để không có màn mồ côi (không tới được) hay màn cụt đường (không có nút quay lại).')}</li>
<li>${t('<strong>Step 2 — Lock the Screen Authorization Matrix (SRS §1.4.2):</strong> Build a crisp grid with every screen as a row and every actor role as a column. Mark allowed access with <code>X</code> and leave forbidden cells blank. If two roles access the same screen with different scope (e.g., on LabFlow <code>S25 Approval Queue</code>, Lecturer approves only their own student group while Lab Manager approves the whole lab), add a footnote below the table and create an explicit <code>BR-xx</code>.', '<strong>Bước 2 — Khoá Ma trận Phân quyền Màn hình (Screen Authorization — SRS §1.4.2):</strong> Lập bảng rõ ràng với mỗi màn hình một dòng và mỗi vai một cột. Ô được phép đánh <code>X</code>, ô bị cấm để trống. Nếu hai vai cùng vào một màn nhưng phạm vi thao tác khác nhau (vd ở LabFlow màn <code>S25 Approval Queue</code>, Lecturer chỉ duyệt nhóm của mình còn Lab Manager duyệt cả phòng lab), ghi chú ngay dưới bảng và tách thành mã <code>BR-xx</code>.')}</li>
<li>${t('<strong>Step 3 — Sketch Wireframes &amp; Figma Mockups Covering ALL 5 UI States:</strong> First sketch low-fidelity boxes (paper, Excalidraw, or CT Work mockup) to nail layout &amp; fields in 10 minutes — don\'t waste 3 hours picking gradients before the fields are approved! Then refine in Figma (matching the SEP490 lecturer requirement) and explicitly annotate the <strong>5 UI States</strong>: (1) <em>Ideal</em> (normal populated data), (2) <em>Empty</em> (<code>SM-01 No records found</code> + call to action), (3) <em>Loading</em> (skeleton/spinner, disabled Submit button to prevent double-click!), (4) <em>Inline Validation Error</em> (exact <code>SM-xx</code> under each field), and (5) <em>Conflict / Server Error</em> (e.g., 409 slot taken → offer Waitlist). Remember SWP391 Policy: <strong>Create / Update / View should share ONE reusable form</strong> and <strong>every list screen needs Search + Filter + Sort + Paging</strong>.', '<strong>Bước 3 — Vẽ Wireframe &amp; Mockup Figma phủ đủ 5 trạng thái giao diện:</strong> Phác thảo khung dây (low-fi trên giấy, Excalidraw hoặc CT Work mockup) trong 10 phút để chốt bố cục &amp; trường nhập trước — đừng đốt 3 tiếng chỉnh màu gradient khi trường còn chưa duyệt! Rồi dựng sạch trên Figma (đúng yêu cầu giảng viên SEP490) và ghi chú đủ <strong>5 Trạng thái UI</strong>: (1) <em>Lý tưởng</em> (đủ dữ liệu), (2) <em>Rỗng</em> (<code>SM-01 No records found</code> + nút gợi ý), (3) <em>Đang tải</em> (skeleton/spinner, khoá nút Submit chống bấm đúp!), (4) <em>Lỗi nhập liệu tại chỗ</em> (đúng mã <code>SM-xx</code> dưới từng ô), và (5) <em>Xung đột / Lỗi server</em> (vd lỗi 409 trùng ca → gợi ý Waitlist). Nhớ Policy SWP391: <strong>Create / Update / View nên dùng chung MỘT form</strong> và <strong>mọi màn danh sách phải có Tìm kiếm + Lọc + Sắp xếp + Phân trang</strong>.')}</li>
<li>${t('<strong>Step 4 — Write the 4-Part UI Specification (SRS §3) with Standardized Field Prefixes:</strong> Never drop a naked Figma screenshot into Word and move on! Every screen in Report 3 §3 MUST contain 4 parts: (a) <em>Mockup image + Figure caption</em>, (b) <em>"This screen allows the &lt;actor&gt; to:"</em> (main actions), (c) <em>"On the screen, s/he can also:"</em> (secondary navigation/filters/cancel), and (d) <em>Field Description table</em> (<code>Field Name | Description</code>) using consistent prefixes (<code>txt_</code>, <code>txa_</code>, <code>num_</code>, <code>cbo_</code>, <code>dtp_</code>, <code>chk_</code>, <code>rdo_</code>, <code>upl_</code>, <code>tbl_</code>, <code>lbl_</code>, <code>btn_</code>, <code>lnk_</code>) documenting requiredness, length/range, default, <code>BR-xx</code>, and <code>SM-xx</code>.', '<strong>Bước 4 — Viết Đặc tả UI 4 phần (SRS §3) với tiền tố chuẩn hoá:</strong> Tuyệt đối không dán mỗi ảnh chụp Figma trần trùi trụi vào Word rồi bỏ qua! Mỗi màn trong Report 3 §3 PHẢI có đủ 4 phần: (a) <em>Ảnh mockup + chú thích Figure</em>, (b) <em>"This screen allows the &lt;actor&gt; to:"</em> (thao tác chính), (c) <em>"On the screen, s/he can also:"</em> (thao tác phụ/lọc/huỷ), và (d) <em>Bảng Field Description</em> (<code>Field Name | Description</code>) dùng tiền tố thống nhất (<code>txt_</code>, <code>txa_</code>, <code>num_</code>, <code>cbo_</code>, <code>dtp_</code>, <code>chk_</code>, <code>rdo_</code>, <code>upl_</code>, <code>tbl_</code>, <code>lbl_</code>, <code>btn_</code>, <code>lnk_</code>) ghi đủ bắt buộc, độ dài/miền, mặc định, <code>BR-xx</code> và <code>SM-xx</code>.')}</li>
<li>${t('<strong>Step 5 — Formal Mockup Approval Before Coding:</strong> Upload your mockup images or Figma view-only link into CT Work <code>requirements</code> / <code>wiegers</code> (which includes mockup + approval-link tracking) AND attach the link to the exact <code>Req</code> card. Ask your lecturer/client to review and sign off ("Mockup Approved — Date"). Under hat C4 (Dev FE), treat an unapproved mockup as a hard <strong>Definition of Ready blocker</strong> — do not write React pages for unconfirmed screens!', '<strong>Bước 5 — Xin Duyệt Mockup chính thức trước khi code:</strong> Gắn ảnh mockup hoặc đường link Figma (chế độ xem/nhận xét) vào CT Work <code>requirements</code> / <code>wiegers</code> (nơi có tính năng mockup + link duyệt mockup) VÀ dán link thẳng vào thẻ <code>Req</code> tương ứng. Mời giảng viên/khách xem và xác nhận ("Đã duyệt Mockup — Ngày"). Dưới mũ C4 (Dev FE), coi mockup chưa duyệt là một rào chắn <strong>Definition of Ready</strong> — không code màn React khi màn chưa được chốt!')}</li>
</ol>

<h3>${t('3. Worked Example on LabFlow AI: ASCII Low-Fi Blueprint + Reusable UI Field Spec Table (S22 Create Reservation)', '3. Ví dụ trên LabFlow AI: Phác thảo Low-Fi ASCII + Bảng đặc tả trường UI dùng lại được (S22 Tạo đặt lịch)')}</h3>
<p>${t('Before opening Figma, hat C2 can validate screen structure in 3 minutes with a plain-text wireframe like this (linking to LabFlow\'s full Screen Flow &amp; Authorization in ', 'Trước khi mở Figma, mũ C2 có thể chốt bố cục màn hình chỉ trong 3 phút bằng phác thảo khung chữ như sau (xem đầy đủ Screen Flow &amp; Phân quyền màn hình của LabFlow tại ')}${lf(t('Screen Flow &amp; Screen Authorization', 'Screen flow và Bảng phân quyền màn hình'))}${t('):', '):')}</p>

${out(t(`+------------------------------------------------------------------------+
| [LabFlow AI]  Dashboard > Labs > IoT Lab A102 > Create Reservation     |
+------------------------------------------------------------------------+
|  (1) Resource & Time  --->  (2) Details  --->  (3) Review & Submit     |
+------------------------------------------------------------------------+
|  Lab *          : [ cbo_Lab: IoT Lab A102 (Capacity: 30)          v ]  |
|  Date *         : [ dtp_Date: 2026-10-20                          # ]  |
|                     (err: SM-20 required / SM-21 today..+14d BR-05)    |
|  Start / End *  : [ cbo_StartTime: 09:00 v ] - [ cbo_EndTime: 11:00 v] |
|                     (30m steps, half-open [start,end) BR-04; 30m-4h prop)|
|  Availability   : [ lbl_Availability:  ● AVAILABLE (or 409 -> link) ]  |
|                     (If busy -> SM-12 + [lnk_JoinWaitlist] -> UC-15)   |
|  Equipment (opt): [ cbo_Equipment: Oscilloscope #04, Kit ESP32 #02  ]  |
|                     (! Warning badge if requires approval BR-06/11)    |
+------------------------------------------------------------------------+
|  [ btn_Cancel ]   [ btn_Back ]                         [ btn_Next -> ] |
+------------------------------------------------------------------------+
|  UI STATES NOTE: Empty/Closed Lab -> disable Next + banner; Loading -> |
|  spinner on lbl_Availability; Step 3 btn_Submit disabled in-flight!    |
+------------------------------------------------------------------------+`, `+------------------------------------------------------------------------+
| [LabFlow AI]  Dashboard > Labs > IoT Lab A102 > Create Reservation     |
+------------------------------------------------------------------------+
|  (1) Phòng & Giờ      --->  (2) Chi tiết --->  (3) Xem lại & Gửi       |
+------------------------------------------------------------------------+
|  Phòng lab *    : [ cbo_Lab: IoT Lab A102 (Sức chứa: 30)          v ]  |
|  Ngày đặt *     : [ dtp_Date: 2026-10-20                          # ]  |
|                     (lỗi: SM-20 trống / SM-21 hôm nay..+14 ngày BR-05) |
|  Giờ BĐ / KT *  : [ cbo_StartTime: 09:00 v ] - [ cbo_EndTime: 11:00 v] |
|                     (bước 30p, nửa mở [start,end) BR-04; 30p-4h đề xuất)|
|  Trạng thái ca  : [ lbl_Availability:  ● CÒN TRỐNG (hoặc 409 -> link)] |
|                     (Nếu kín -> SM-12 + [lnk_JoinWaitlist] -> UC-15)   |
|  Thiết bị (tuỳ) : [ cbo_Equipment: Oscilloscope #04, Kit ESP32 #02  ]  |
|                     (! Biểu tượng cảnh báo nếu cần duyệt BR-06/11)     |
+------------------------------------------------------------------------+
|  [ btn_Cancel ]   [ btn_Back ]                         [ btn_Next -> ] |
+------------------------------------------------------------------------+
|  GHI CHÚ 5 TRẠNG THÁI UI: Phòng rỗng/đóng -> khoá Next + banner;       |
|  Đang tải -> spinner ở lbl_Availability; Bước 3 khoá btn_Submit khi gửi|
+------------------------------------------------------------------------+`))}

<p>${t('Now write the complete <strong>4-Part SRS §3 UI Specification</strong> for <code>3.4.2 Create Reservation (S22)</code> following the exact SEP490 template (mandatory <strong>2-column</strong> table <code>Field Name | Description</code> — every single control on the wireframe gets its own row!):', 'Bây giờ viết trọn vẹn <strong>Đặc tả UI 4 phần chuẩn SRS §3</strong> cho mục <code>3.4.2 Create Reservation (S22)</code> đúng khung mẫu SEP490 (bắt buộc đúng bảng <strong>2 cột</strong> <code>Field Name | Description</code> — mọi điều khiển trên wireframe đều có một dòng riêng, không gộp, không bỏ sót!):')}</p>

<div class="callout info">
<p><strong>${t('Part (1) — Figure caption:', 'Phần (1) — Chú thích hình mockup:')}</strong> <em>Figure 21: Create Reservation screen (step 1 Resource &amp; Time)</em></p>
<p><strong>${t('Part (2) — Main actions (write in English in SRS):', 'Phần (2) — Thao tác chính (nộp SRS viết tiếng Anh, kèm nghĩa):')}</strong><br>
<code>This screen allows the Student or Lecturer to:</code></p>
<ul>
<li>${t('<strong>Choose resource and time:</strong> select a lab, a date, and a time range, and optionally add bookable equipment items.', '<strong>Choose resource and time</strong> <em>(Chọn tài nguyên và khung giờ)</em>: select a lab, a date, and a time range, and optionally add bookable equipment items.')}</li>
<li>${t('<strong>Check availability:</strong> see immediately whether the selected slot is free or conflicting.', '<strong>Check availability</strong> <em>(Kiểm tra lịch trống)</em>: see immediately whether the selected slot is free or conflicting.')}</li>
<li>${t('<strong>Submit the reservation:</strong> enter purpose and participants, review the summary, and submit the request.', '<strong>Submit the reservation</strong> <em>(Gửi yêu cầu đặt lịch)</em>: enter purpose and participants, review the summary, and submit the request.')}</li>
</ul>
<p><strong>${t('Part (3) — Secondary actions:', 'Phần (3) — Thao tác phụ:')}</strong><br>
<code>On the screen, s/he can also:</code></p>
<ul>
<li>${t('Join the waitlist when the selected slot is fully booked.', 'Join the waitlist when the selected slot is fully booked <em>(Vào hàng đợi khi ca đã kín)</em>.')}</li>
<li>${t('Go back to the previous wizard step or cancel and return to Lab Detail.', 'Go back to the previous wizard step or cancel and return to Lab Detail <em>(Quay lại bước trước hoặc huỷ để về chi tiết phòng lab)</em>.')}</li>
</ul>
<p><strong>${t('Part (4) — Field Description (exact 2-column SRS §3 table):', 'Phần (4) — Bảng Field Description (đúng 2 cột bắt buộc SRS §3):')}</strong></p>
</div>

${bang(
  ['Field Name', 'Description'],
  [
    ['<code>cbo_Lab</code>', t('Dropdown, required. Lists active bookable labs sorted by building and name. Default: the lab opened from Lab Detail. Changing the lab refreshes <code>cbo_Equipment</code> and <code>lbl_Availability</code>.', 'Dropdown, bắt buộc. Liệt kê các phòng lab đang mở đặt, xếp theo toà nhà và tên. Mặc định: phòng mở từ Lab Detail. Đổi phòng sẽ tự tải lại <code>cbo_Equipment</code> và <code>lbl_Availability</code>.')],
    ['<code>dtp_Date</code>', t('Date picker, required. Allowed range: from today to 14 days ahead (<code>BR-05</code>), excluding closed/blackout days (<code>BR-04</code>). Errors: <code>SM-20</code> (empty), <code>SM-21</code> (out of range).', 'Ô chọn ngày, bắt buộc. Miền hợp lệ: từ hôm nay đến +14 ngày (<code>BR-05</code>), loại trừ ngày đóng cửa/blackout (<code>BR-04</code>). Lỗi: <code>SM-20</code> (trống), <code>SM-21</code> (ngoài hạn).')],
    ['<code>cbo_StartTime</code>', t('Dropdown, required. 30-minute increments within the lab\'s operating hours (<code>BR-04</code>). Error: <code>SM-22</code> (outside operating hours).', 'Dropdown, bắt buộc. Bước 30 phút nằm trong giờ mở cửa của phòng lab (<code>BR-04</code>). Lỗi: <code>SM-22</code> (ngoài giờ hoạt động).')],
    ['<code>cbo_EndTime</code>', t('Dropdown, required. Must be later than <code>cbo_StartTime</code>; half-open interval <code>[start, end)</code> in 30-minute steps (<code>BR-04</code>; 30m–4h duration limit <code>[PROPOSED]</code> pending lecturer confirmation). Error: <code>SM-23</code> (invalid duration).', 'Dropdown, bắt buộc. Phải sau <code>cbo_StartTime</code>; khoảng nửa mở <code>[start, end)</code> theo bước 30 phút (<code>BR-04</code>; giới hạn dài 30 phút–4 giờ là <code>[ĐỀ XUẤT]</code> chờ xác nhận với giảng viên). Lỗi: <code>SM-23</code> (sai thời lượng).')],
    ['<code>cbo_Equipment</code>', t('Multi-select dropdown, optional. Lists only <code>AVAILABLE</code> bookable equipment belonging to the selected lab (<code>BR-11</code>); items flagged <code>requires_approval</code> show a warning badge (<code>BR-06</code>).', 'Dropdown chọn nhiều, tuỳ chọn. Chỉ liệt kê thiết bị trạng thái <code>AVAILABLE</code> của phòng đang chọn (<code>BR-11</code>); thiết bị gắn cờ cần duyệt hiển thị nhãn cảnh báo (<code>BR-06</code>).')],
    ['<code>lbl_Availability</code>', t('Read-only status badge. Auto-refreshes (showing a loading spinner) on lab/date/time change to display Available or Busy (<code>BR-15</code>). If Busy, displays <code>SM-12</code> and up to 3 nearest free slots.', 'Nhãn chỉ đọc. Tự kiểm tra lại (hiện spinner khi đang tải) mỗi khi đổi phòng/ngày/giờ để báo Còn trống hoặc Đã kín (<code>BR-15</code>). Nếu kín, hiện <code>SM-12</code> và tối đa 3 ca trống gần nhất.')],
    ['<code>txt_Purpose</code>', t('Textbox (Step 2), required. Trimmed length 10–255 characters; whitespace-only input rejected (<code>BR-16</code>). Error: <code>SM-26</code>.', 'Ô nhập một dòng (Bước 2), bắt buộc. Sau khi trim dài 10–255 ký tự; chặn chuỗi chỉ toàn dấu cách (<code>BR-16</code>). Lỗi: <code>SM-26</code>.')],
    ['<code>num_Participants</code>', t('Number input (Step 2), required. Integer from <code>1</code> to the selected lab\'s capacity (<code>BR-16</code>). Error: <code>SM-28</code>.', 'Ô số (Bước 2), bắt buộc. Số nguyên từ <code>1</code> đến sức chứa của phòng lab đang chọn (<code>BR-16</code>). Lỗi: <code>SM-28</code>.')],
    ['<code>lnk_JoinWaitlist</code>', t('Action link. Shown only when <code>lbl_Availability</code> is Busy (<code>SM-12</code>); opens the Join Waitlist dialog (<code>UC-15</code>, <code>BR-10</code>).', 'Liên kết hành động. Chỉ hiển thị khi <code>lbl_Availability</code> báo Đã kín (<code>SM-12</code>); mở hộp thoại Vào hàng đợi (<code>UC-15</code>, <code>BR-10</code>).')],
    ['<code>btn_Back</code>', t('Secondary button (Steps 2–3). Returns to the previous wizard step while preserving all entered inputs.', 'Nút phụ (Bước 2–3). Quay lại bước trước của wizard và giữ nguyên toàn bộ dữ liệu đã nhập.')],
    ['<code>btn_Next</code>', t('Primary button (Steps 1–2). Validates the current step against <code>BR-04..05, BR-11, BR-15..16</code> and advances to the next step; disabled when the selected lab is closed.', 'Nút chính (Bước 1–2). Kiểm tra toàn bộ trường của bước hiện tại theo <code>BR-04..05, BR-11, BR-15..16</code> rồi chuyển bước tiếp theo; vô hiệu hoá nếu phòng đang đóng.')],
    ['<code>btn_Submit</code>', t('Primary button (Step 3). Disabled while request is in-flight (Loading state); sends <code>Idempotency-Key</code> header and executes <code>UC-12</code> step 7 → <code>SM-10</code>, <code>SM-11</code>, or <code>SM-12</code>.', 'Nút chính (Bước 3). Tự khoá trong lúc đang gửi (trạng thái Đang tải); gửi kèm header <code>Idempotency-Key</code> và chạy <code>UC-12</code> bước 7 → <code>SM-10</code>, <code>SM-11</code> hoặc <code>SM-12</code>.')],
    ['<code>btn_Cancel</code>', t('Secondary button (all steps). If form has unsaved edits, prompts a confirmation dialog before discarding inputs and executing <code>UC-12 3A</code> to return to Lab Detail.', 'Nút phụ (mọi bước). Nếu đã nhập dữ liệu, hiện hộp xác nhận trước khi huỷ và chạy <code>UC-12 3A</code> quay về màn Lab Detail.')]
  ]
)}

<h3>🕵️ ${t('The Hacker\'s Angle: The "Hidden Button" Illusion (OWASP A01:2021 Broken Access Control)', 'Góc kẻ xấu: Ảo giác "ẩn nút trên giao diện là bảo mật rồi" (OWASP A01:2021 Broken Access Control)')}</h3>
<p>${t(
    'Every semester, dozens of student teams proudly point to their Screen Authorization table and say, "Students cannot open Admin Settings because we hid the Settings link from the Student sidebar!" That is <strong>#1 on the OWASP Top 10 (2021): A01 Broken Access Control</strong>. Hiding a button in Figma or React is ONLY user experience — any attacker simply types <code>/admin/settings</code> in the browser bar or fires <code>PUT /api/v1/settings</code> with their Student JWT in <code>curl</code>. <strong>Mandatory BA rule for hat C2:</strong> write a bold red note directly under your SRS §1.4.2 Screen Authorization table: <em>"Every blank cell in this matrix MUST be enforced on the Backend API (HTTP 403 Forbidden) and tested by C5 QA — hiding menu links in React is UX only, NEVER a security boundary."</em> See ',
    'Học kỳ nào cũng có hàng chục nhóm sinh viên tự hào chỉ vào bảng Screen Authorization và nói: "Sinh viên không vào được Admin Settings vì nhóm em đã ẩn mục Settings trên thanh menu của Sinh viên rồi!" Đó chính là <strong>lỗ hổng số 1 bảng OWASP Top 10 (2021): A01 Broken Access Control</strong>. Ẩn nút trên Figma hay React CHỈ là trải nghiệm người dùng — kẻ tấn công chỉ cần gõ thẳng <code>/admin/settings</code> lên thanh địa chỉ hoặc bắn <code>PUT /api/v1/settings</code> bằng JWT của Sinh viên qua <code>curl</code>. <strong>Luật bắt buộc cho mũ C2:</strong> ghi rõ một dòng lưu ý ngay dưới bảng Phân quyền màn hình SRS §1.4.2: <em>"Mọi ô trống trong ma trận này PHẢI được chặn ở Backend API (HTTP 403 Forbidden) và kiểm chứng bởi C5 QA — ẩn menu ở React chỉ là UX, KHÔNG phải rào chắn bảo mật."</em> Xem thêm ')}${cs('api-design', 'api-6-2-phan-quyen', t('API Design 6.2 — Authorization &amp; BOLA', 'API Design 6.2 — Phân quyền &amp; BOLA'))}${t('.', '.')}</p>

<h3>${t('4. Common Screen Flow &amp; Mockup Mistakes — and How to Avoid Them', '4. Lỗi hay gặp ở Screen Flow &amp; Mockup — và cách tránh')}</h3>
<ul>
<li>${t('<strong>Drawing high-fidelity pixel art before confirming fields:</strong> Spending 6 hours tweaking shadows in Figma only for the lecturer to drop the screen. Fix: approve low-fi wireframes first, polish Figma only after layout is confirmed.', '<strong>Ngồi vẽ Figma bóng bẩy trước khi chốt trường dữ liệu:</strong> Mất 6 tiếng chỉnh đổ bóng rồi giảng viên bảo bỏ bớt màn hình đó. Cách tránh: chốt wireframe thô trước, chỉ trau chuốt Figma khi bố cục đã được gật.')}</li>
<li>${t('<strong>Forgetting buttons, links, and table pagination in Field Description:</strong> Documenting only textboxes while omitting <code>btn_Submit</code>, <code>lnk_JoinWaitlist</code>, or table search/filter/sort/paging controls. Fix: walk the mockup top-to-bottom, left-to-right and tick off EVERY interactive element.', '<strong>Bỏ quên nút bấm, liên kết và thanh phân trang trong bảng Field Description:</strong> Chỉ tả các ô nhập mà quên <code>btn_Submit</code>, <code>lnk_JoinWaitlist</code> hay bộ tìm kiếm/lọc/phân trang của bảng. Cách tránh: rà mockup từ trên xuống dưới, trái sang phải và gạch từng phần tử tương tác.')}</li>
<li>${t('<strong>Screen names drifting across documents:</strong> Calling it <code>Book Lab</code> in Screen Flow, <code>New Reservation</code> in Screen Authorization, and <code>Create Booking</code> in §3. Fix: copy-paste exact Screen IDs + Names from ONE master list.', '<strong>Tên màn hình mỗi chỗ một kiểu:</strong> Ở Screen Flow gọi <code>Book Lab</code>, ở bảng Phân quyền gọi <code>New Reservation</code>, sang mục §3 lại gọi <code>Create Booking</code>. Cách tránh: chép dán đúng Mã + Tên màn hình từ MỘT danh sách chuẩn duy nhất.')}</li>
<li>${t('<strong>Using real student names/emails/phones in mockup screenshots:</strong> Violates privacy hygiene. Fix: always populate Figma mockups with obvious fake seed data (<code>student1@demo.local</code>, <code>Lab IoT A102</code>).', '<strong>Dùng tên/email/số điện thoại thật của bạn bè trong ảnh mockup:</strong> Vi phạm vệ sinh dữ liệu cá nhân. Cách tránh: luôn điền dữ liệu mẫu giả rõ ràng (<code>student1@demo.local</code>, <code>Lab IoT A102</code>).')}</li>
</ul>

${phongVan([
  [t('"Why do we create low-fidelity wireframes before high-fidelity Figma mockups or React code?"', '"Vì sao nên phác wireframe độ trung thực thấp trước khi làm mockup Figma đẹp hoặc code React?"'), t('Low-fi wireframes keep feedback focused on structure, missing fields, workflow friction, and edge states instead of colors and fonts. Changing a layout on a wireframe takes minutes; changing it after React + API integration takes days.', 'Wireframe thô giúp khách hàng và đội tập trung góp ý vào bố cục, trường thiếu, luồng thao tác và trạng thái lỗi thay vì tranh cãi màu sắc hay font chữ. Sửa bố cục trên wireframe tốn vài phút; sửa sau khi đã nối React + API tốn cả ngày.')],
  [t('"A designer hands you a beautiful Figma screen, but it only shows the happy populated state. What do you ask before coding?"', '"Designer đưa bạn một màn Figma rất đẹp nhưng chỉ vẽ đúng trạng thái có đủ dữ liệu. Trước khi code bạn sẽ hỏi gì?"'), t('I ask for the other four states: Empty state (what shows when the list has 0 items?), Loading state (skeleton/spinner and submit-button lock?), Validation Error state (where do field-level SM-xx messages appear?), and Permission/Conflict Error state (403/409/500 fallback). Plus responsive mobile behavior if Lab Staff use phones.', 'Mình sẽ hỏi thêm bốn trạng thái còn lại: Trạng thái rỗng (0 bản ghi hiện gì?), Trạng thái đang tải (skeleton/spinner và khoá nút gửi ra sao?), Trạng thái lỗi nhập liệu (lỗi SM-xx hiện ở đâu dưới từng ô?), và Trạng thái lỗi quyền/xung đột (403/409/500 xử lý thế nào?). Cộng thêm hiển thị mobile nếu nhân viên dùng điện thoại.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Your Screen Flow splits cleanly into 3 portals: Buyer Storefront (Search → Product Detail → Cart → Multi-Seller Checkout → Order Tracking → Return Request), Seller Center (Shop Inventory → Order Fulfillment → Payout Statement), and Admin Console (Seller KYC Approval → Dispute Mediation → Commission Settings). Your Checkout mockup MUST show the multi-seller split summary and voucher breakdown before the "Pay" button — avoiding Citibank-style accidental charges!', 'Screen Flow chia gọn thành 3 cổng: Cổng Người mua (Tìm kiếm → Chi tiết SP → Giỏ hàng → Thanh toán tách nhiều shop → Theo dõi đơn → Trả hàng), Cổng Người bán (Kho hàng → Xử lý đơn → Đối soát giải ngân), và Cổng Admin (Duyệt KYC shop → Xử lý khiếu nại → Cấu hình hoa hồng). Mockup Thanh toán PHẢI hiển thị bảng tách đơn từng shop và tổng giảm giá rõ ràng trước nút "Thanh toán" — tránh bấm nhầm kiểu Citibank!')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('C2 creates ONE shared Figma file with a locked Common Layout frame (Header + Role Sidebar + Pagination DataTable component) so all 5 teammates duplicate the exact same design shell for their own 3–4 vertical screens — eliminating the notorious "5 screens look like 5 different websites" penalty at Final Defense.', 'C2 tạo DUY NHẤT MỘT file Figma chung có sẵn khung Layout chuẩn (Header + Sidebar theo role + bảng DataTable phân trang) để cả 5 bạn nhân bản cùng một vỏ thiết kế cho 3–4 màn hình của mình — triệt tiêu hẳn lỗi "5 màn hình trông như 5 trang web khác nhau" lúc bảo vệ.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Dedicated UI/UX designers produce clickable Figma prototypes with Design Tokens, BAs write the Screen Transition Diagram and Item Definition Excel sheet (each field numbered <code>#1..#25</code> mapped to red callout bubbles on the mockup!), and the Client PO signs an official Prototype Freeze before Frontend sprint kickoff. See ', 'UI/UX designer chuyên trách dựng Figma prototype kèm Design Token, BA viết Sơ đồ chuyển màn hình và bảng Item Definition Excel (đánh số đỏ <code>#1..#25</code> lên ảnh mockup khớp từng dòng bảng!), và PO khách ký chốt Prototype Freeze trước khi Frontend bắt đầu sprint. Xem thêm ')+cs('agile-teamwork', 'agl-7-3-designer', t('Agile Teamwork 7.3 — Developers &amp; Designers', 'Agile Teamwork 7.3 — Lập trình viên và Designer'))+'.']
], en)}

${viecLabflow([
  [t('Under <strong>Sky Blue (C2 BA)</strong> on CT Work (<strong>LF #2</strong>), open <code>requirements</code> (or <code>wiegers</code>) and verify the <strong>Screen Authorization Matrix</strong> for all Iteration-1 + core Iteration-2 screens (at least 15 screens × 6 roles), adding the explicit backend-403 security note underneath.', 'Dưới profile <strong>Xanh dương (C2 BA)</strong> trên CT Work (<strong>LF #2</strong>), mở <code>requirements</code> (hoặc <code>wiegers</code>) và soát <strong>Ma trận Phân quyền Màn hình</strong> cho toàn bộ màn Iteration 1 + lõi Iteration 2 (ít nhất 15 màn × 6 vai), kèm dòng ghi chú bắt buộc chặn 403 ở Backend ngay bên dưới.'), t('Every screen name matches <code>S01..S47</code> in LabFlow Map; every shared screen with different scope (like <code>S25</code>) has an explicit footnote &amp; BR link.', 'Mọi tên màn hình khớp mã <code>S01..S47</code> trên Bản đồ LabFlow; mọi màn dùng chung khác phạm vi (như <code>S25</code>) có ghi chú và mã BR rõ ràng.')],
  [t('Draw a clean wireframe/mockup (Figma or ASCII + Figma draft) for <strong>2 core screens</strong> (<code>S22 Create Reservation</code> and <code>S25 Approval Queue</code>) annotating all 5 UI states, upload/link them in CT Work <code>requirements</code>/<code>wiegers</code> (mockup + approval link) AND write their full 4-part UI Field Description tables using standard prefixes (<code>txt_/cbo_/dtp_/btn_/lnk_</code>).', 'Vẽ wireframe/mockup rõ ràng (Figma hoặc phác thảo ASCII + bản Figma) cho <strong>2 màn lõi</strong> (<code>S22 Tạo đặt lịch</code> và <code>S25 Hàng chờ duyệt</code>) ghi chú đủ 5 trạng thái UI, tải/gắn link vào mục mockup &amp; duyệt mockup trên CT Work <code>requirements</code>/<code>wiegers</code> VÀ viết đủ bảng Field Description 4 phần theo tiền tố chuẩn (<code>txt_/cbo_/dtp_/btn_/lnk_</code>).'), t('Mockups contain only fake seed data, cover all 5 UI states, have an approval link attached to their Req cards, and every button/field maps to a <code>BR-xx</code> and <code>SM-xx</code>.', 'Mockup chỉ dùng dữ liệu giả, đủ 5 trạng thái UI, có link duyệt gắn lên thẻ Req, và mọi nút/ô đều nối đúng mã <code>BR-xx</code> và <code>SM-xx</code>.')]
], en)}

${thuatNgu([
  ['Screen Flow (Luồng màn hình)', t('A navigation diagram showing how each user role moves from screen to screen and what triggers each transition.', 'Sơ đồ điều hướng cho thấy mỗi vai người dùng đi từ màn hình nào sang màn nào và thao tác gì kích hoạt chuyển màn.')],
  ['Screen Authorization Matrix (Ma trận phân quyền màn hình)', t('A Screen × Role grid defining allowed access (X) vs. forbidden access (backend 403) across the entire system.', 'Bảng Màn hình × Vai trò quy định ai được truy cập (X) và ai bị chặn ở Backend (403) trên toàn hệ thống.')],
  ['Low-Fidelity Wireframe vs. Mockup', t('Fast structural skeleton focusing on layout, fields, and states vs. refined visual layout (e.g., Figma) ready for formal sign-off.', 'Khung dây nhanh tập trung bố cục, trường dữ liệu và trạng thái so với bản thiết kế trực quan sạch (vd Figma) để xin duyệt chính thức.')],
  ['The 5 UI States (5 trạng thái giao diện)', t('Ideal (populated), Empty, Loading (with submit lock), Inline Validation Error, and Conflict/Server Error — all 5 must be designed.', 'Lý tưởng (có dữ liệu), Rỗng, Đang tải (kèm khoá nút gửi), Lỗi nhập liệu tại chỗ và Lỗi xung đột/server — cả 5 đều phải được thiết kế.')],
  ['Field Prefix Convention (Quy ước tiền tố trường)', t('Standard naming prefixes in SRS §3 (txt_, txa_, num_, cbo_, dtp_, chk_, rdo_, upl_, tbl_, lbl_, btn_, lnk_) keeping BA, FE, and QA aligned.', 'Quy ước đặt tên nhất quán trong SRS §3 (txt_, txa_, num_, cbo_, dtp_, chk_, rdo_, upl_, tbl_, lbl_, btn_, lnk_) giúp BA, FE và QA nhìn cùng một tên.')]
], en)}

${tomTat([
  t('Lock the Screen Flow (SRS §1.4.1) and Screen Authorization Matrix (SRS §1.4.2) before sketching individual screens so no orphan screens or permission gaps slip through.', 'Khoá Screen Flow (SRS §1.4.1) và Ma trận Phân quyền Màn hình (SRS §1.4.2) trước khi vẽ từng màn để không sót màn mồ côi hay lỗ hổng quyền.'),
  t('Sketch low-fidelity wireframes first to confirm structure fast, then refine in Figma covering all 5 UI states and get formal lecturer/client approval BEFORE C4 codes.', 'Phác wireframe thô trước để chốt bố cục nhanh, sau đó dựng Figma đủ 5 trạng thái UI và xin duyệt chính thức từ thầy/khách TRƯỚC khi C4 bắt đầu code.'),
  t('Write all 4 parts of SRS §3 UI Specifications with consistent field prefixes, documenting every single button, link, validation rule (BR-xx), and specific error message (SM-xx).', 'Viết đủ 4 phần Đặc tả UI SRS §3 với tiền tố trường đồng nhất, liệt kê mọi nút bấm, liên kết, luật kiểm tra (BR-xx) và mã lỗi cụ thể (SM-xx).'),
  t('Remember OWASP A01: hiding a menu or button on the mockup is UX only — every blank cell in Screen Authorization MUST return HTTP 403 at the backend API.', 'Nhớ OWASP A01: ẩn menu hay nút trên mockup chỉ là UX — mọi ô trống trên Ma trận Phân quyền PHẢI bị chặn bằng HTTP 403 ở Backend API.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-4-5-user-story-ac', t('4.5 — User Stories &amp; Acceptance Criteria (Given/When/Then)', '4.5 — User story &amp; tiêu chí chấp nhận (Given/When/Then)'))}.</p>
`);
};

export default {
  title: '4.4 — Screen Flow, Wireframes/Mockups & Mockup Sign-off|||4.4 — Screen flow, wireframe/mockup & duyệt mockup',
  slug: 'dm5-4-4-screen-flow-wireframe',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quy trình 5 bước từ Screen Flow (SRS §1.4.1) và Ma trận Phân quyền (SRS §1.4.2) tới Wireframe/Figma đủ 5 trạng thái UI, Đặc tả trường UI 4 phần (tiền tố txt_/cbo_/dtp_/btn_) và Duyệt Mockup trên CT Work; bài học Citibank 900 triệu USD (2020), góc hacker OWASP A01 ảo giác ẩn nút.',
  content: L44(true) + L44(false),
};
