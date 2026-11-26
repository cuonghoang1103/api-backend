/**
 * 4.5 — User story & tiêu chí chấp nhận (Given/When/Then) (dm5-4-5-user-story-ac).
 * Nguồn lịch sử/chuẩn đã kiểm: Bill Wake — "INVEST in Good Stories, and SMART Tasks" (2003);
 * Dan North — "Introducing BDD" (Better Software, 2006) (Given/When/Then);
 * Ron Jeffries — "Essential XP: Card, Conversation, Confirmation" (2001);
 * UK National Audit Office Memorandum on the BBC's Digital Media Initiative (January 2014) & UK House of Commons Public Accounts Committee Report HC 985 (April 2014) — BBC DMI, £98.4M written off.
 * Không lặp lý thuyết INVEST ở SWE201c 9.2 hay cách viết ticket chung ở agile-teamwork 2.1 — dẫn link và dạy cách nối UC/SRS ↔ User Story ↔ Thẻ CT Work + Negative Security AC.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, ac, cs, ng, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L45 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.5', 'Chương 4 · Bài 4.5', `
<h2>${t('4.5 — User Stories &amp; Testable Acceptance Criteria (Given/When/Then)', '4.5 — User story &amp; tiêu chí chấp nhận kiểm chứng được (Given/When/Then)')}</h2>
<p class="lead">${t(
    'A 60-page SRS Word document is great for formal baseline sign-off and university grading — but nobody codes directly from a 60-page Word file on a Tuesday morning. On your sprint board (CT Work / Jira), requirements travel as bite-sized <strong>User Stories</strong> backed by razor-sharp <strong>Given/When/Then Acceptance Criteria (AC)</strong>. This lesson teaches hat C2 (BA) how to slice Use Cases into vertical, INVEST-compliant User Stories (matching SWP391\'s vertical LOC rule!), write positive + unhappy + security Given/When/Then scenarios, and keep SRS and CT Work cards 100% synchronized.',
    'Một file Word SRS dài 60 trang rất cần để chốt đường cơ sở và nộp chấm điểm — nhưng sáng thứ Ba không ai ngồi mở file Word 60 trang ra để code từng dòng. Trên bảng công việc hằng ngày (CT Work / Jira), yêu cầu di chuyển dưới dạng những <strong>User Story</strong> vừa miếng đi kèm <strong>Tiêu chí chấp nhận (Acceptance Criteria — AC) dạng Given/When/Then</strong> sắc như dao. Bài này dạy mũ C2 (BA) cách cắt Use Case thành các User Story theo lát cắt dọc đạt chuẩn INVEST (khớp luật chấm LOC theo màn hình SWP391!), viết đủ kịch bản thành công + ca lỗi + bảo mật bằng Given/When/Then, và giữ SRS với thẻ CT Work khớp nhau 100%.')}</p>

<h3>${t('Everyday picture: the full restaurant recipe book vs. the kitchen order ticket', 'Liên tưởng đời thường: cuốn sách công thức nhà hàng khác tờ phiếu gọi món dán trên bếp')}</h3>
<p>${t(
    'A restaurant keeps a thick master binder of every dish, ingredient spec, and food-safety law in the manager\'s office (that is your <strong>Report 3 SRS</strong>). When a customer sits down, the chef does NOT read the 200-page binder — the kitchen printer spits out one crisp order ticket: <em>"Table 4: Medium-rare steak, NO peanuts (allergy!), hot plate, ready in 12 minutes"</em> (that is your <strong>User Story + Acceptance Criteria</strong> on CT Work). Notice two things: the ticket is small enough to finish in one sitting, and the quality inspector at the pass knows in 3 seconds whether the plate is Done or must go back to the pan!',
    'Một nhà hàng luôn giữ cuốn sổ quy chuẩn dày cộp ghi mọi món ăn, định lượng nguyên liệu và luật vệ sinh thực phẩm trong phòng quản lý (đó là <strong>Report 3 SRS</strong>). Khi khách ngồi vào bàn, đầu bếp KHÔNG ngồi lật cuốn sổ 200 trang — máy in bếp nhả ra một tờ phiếu gọn sắc: <em>"Bàn 4: Bít tết chín vừa, KHÔNG đậu phộng (dị ứng!), đĩa nóng, ra món trong 12 phút"</em> (đó chính là <strong>User Story + Acceptance Criteria</strong> trên thẻ CT Work). Để ý hai điều: tờ phiếu đủ nhỏ để nấu trọn trong một lượt, và người kiểm món ở cửa bếp nhìn 3 giây là biết ngay đĩa này Đạt hay phải trả lại chảo!')}</p>

<h3>${t('1. Use Case vs. User Story: Friends, Not Enemies', '1. Use Case và User Story: đồng đội phối hợp, không phải đối thủ loại nhau')}</h3>
<p>${t(
    'Students often ask: <em>"If I already wrote Use Cases in SRS, why do I still need User Stories &amp; Acceptance Criteria on CT Work?"</em> Because they serve two different moments in the same workflow! For foundational theory on INVEST, Story Mapping, and ticket writing, review ',
    'Sinh viên rất hay hỏi: <em>"Em đã viết Use Case trong SRS rồi, sao lên CT Work vẫn phải viết User Story &amp; Acceptance Criteria?"</em> Vì chúng phục vụ hai thời điểm khác nhau trong cùng một quy trình! Để ôn nền tảng INVEST, Story Mapping và cách viết ticket, xem thêm ')}${ac('introduction-to-software-engineering', 'swe201c-user-story-invest', t('SWE201c 9.2 — User Story &amp; INVEST', 'SWE201c 9.2 — User Story &amp; bộ tiêu chí INVEST'))}, ${cs('agile-teamwork', 'agl-2-1-ticket', t('Agile Teamwork 2.1 — Writing tickets anyone can pick up', 'Agile Teamwork 2.1 — Viết ticket ai cũng nhận làm được'))}, ${t('and ', 'và ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-2-1-ticket', t('Technical English 2.1 — Ticket &amp; Given/When/Then', 'Tiếng Anh kỹ thuật 2.1 — Ticket &amp; Given/When/Then'))}${t(
    '. Look at how they complement each other cleanly:',
    '. Nhìn bảng so sánh này để thấy hai thứ ăn khớp nhau ra sao:')}</p>

${bang(
  [t('Dimension', 'Khía cạnh'), t('Use Case Spec (Report 3 SRS)', 'Đặc tả Use Case (Report 3 SRS)'), t('User Story + AC (CT Work Card)', 'User Story + AC (Thẻ CT Work)')],
  [
    [t('<strong>Primary purpose</strong>', '<strong>Mục đích chính</strong>'), t('Complete system-level behavioral baseline for all flows, BRs, and audit/defense.', 'Đường cơ sở hành vi đầy đủ toàn hệ thống cho mọi luồng, BR và nộp/bảo vệ.'), t('Sprint-sized, vertical, deliverable slice C3/C4 build and C5 verifies in 1–3 days.', 'Lát cắt dọc vừa sức một sprint để C3/C4 code và C5 chốt Done trong 1–3 ngày.')],
    [t('<strong>Granularity</strong>', '<strong>Độ lớn</strong>'), t('Whole user goal end-to-end (may span 2–4 sprint stories).', 'Trọn một mục tiêu người dùng (có thể tách thành 2–4 story).'), t('1 vertical slice finishable in ≤ 2–3 days (Ron Jeffries\'s <em>3Cs: Card, Conversation, Confirmation</em>, 2001).', '1 lát cắt dọc làm xong trong ≤ 2–3 ngày (<em>3C: Card, Conversation, Confirmation</em> của Ron Jeffries, 2001).')],
    [t('<strong>How they link</strong>', '<strong>Cách nối với nhau</strong>'), t('Carries unique ID <code>UC-12</code>, <code>BR-04..06, BR-11, BR-14..16</code>, <code>SM-10..28</code>.', 'Mang mã gốc <code>UC-12</code>, <code>BR-04..06, BR-11, BR-14..16</code>, <code>SM-10..28</code>.'), t('Card title/body references <code>UC-12</code> &amp; <code>S22</code>; AC turns each Normal/Alt/Exception path into Pass/Fail Given/When/Then checks!', 'Thẻ trích dẫn <code>UC-12</code> &amp; <code>S22</code>; phần AC biến từng nhánh Normal/Alt/Exception thành kịch bản Given/When/Then chấm Đạt/Trượt!')]
  ]
)}

${cl('danger', `<p><strong>${t('Why vertical slicing matters — BBC Digital Media Initiative (DMI), 2008–2013 (£98.4 million written off):', 'Vì sao cắt lát dọc (vertical slice) sống còn — Dự án BBC Digital Media Initiative (DMI), 2008–2013 (mất trắng 98,4 triệu bảng Anh):')}</strong> ${t(
    'As documented in the <strong>UK National Audit Office Memorandum on the BBC\'s Digital Media Initiative (January 2014)</strong> and the <strong>UK House of Commons Public Accounts Committee Report HC 985 (April 2014)</strong>, the BBC wrote off £98.4 million after five years because the program lacked a single Senior Responsible Owner (SRO), suffered weak governance after bringing the Siemens contract in-house in 2009, lacked independent technical/architecture assurance, and pursued a giant "big-bang" delivery disconnected from journalists instead of delivering small, working end-to-end increments for early user validation. Never write big-bang horizontal "stories" like <em>"Build all 15 PostgreSQL tables"</em> or <em>"Build all React forms without backend"</em> — slice vertically so every story delivers real DB + API + UI + Tests that a user can click and verify early!',
    'Theo <strong>Bản ghi nhớ kiểm toán của Cơ quan Kiểm toán Quốc gia Anh về BBC Digital Media Initiative (NAO Memorandum, tháng 1/2014)</strong> và <strong>Báo cáo Ủy ban Tài khoản Công Hạ viện Anh (PAC Report HC 985, tháng 4/2014)</strong>, BBC phải xoá sổ 98,4 triệu bảng Anh sau năm năm vì thiếu người chịu trách nhiệm duy nhất (SRO), quản trị yếu sau khi đưa hợp đồng Siemens về tự làm năm 2009, thiếu thẩm định kiến trúc độc lập, và chạy theo lối giao nộp "big-bang" tách rời nhà báo thay vì cắt thành các phần nhỏ chạy thông đầu-cuối để người dùng kiểm chứng sớm. Đừng bao giờ viết "story" kiểu big-bang cắt ngang như <em>"Tạo toàn bộ 15 bảng PostgreSQL"</em> hay <em>"Dựng hết form React chưa nối API"</em> — luôn cắt theo lát cắt dọc để mỗi story ra đủ DB + API + UI + Test bấm chạy thật và kiểm chứng sớm!')}</p>`)}

<h3>${t('2. Step-by-Step: Turning a Use Case into Vertical INVEST Stories + Given/When/Then AC', '2. Từng bước biến Use Case thành User Story lát dọc chuẩn INVEST + AC Given/When/Then')} ${mu('C2', en)}</h3>
<ol>
<li>${t('<strong>Step 1 — Slice Vertically Using SPIDR (Spikes, Paths, Interfaces, Data, Rules — never horizontally by tech layer!):</strong> If a complex Use Case (like <code>UC-12 Create Reservation</code>, Complex 240 LOC) is too big for one 2-day ticket, split it vertically along Mike Cohn\'s 5 <strong>SPIDR</strong> levers: <strong>S</strong>pikes (short time-boxed research, e.g., Postgres exclusion constraint POC), <strong>P</strong>aths (instant confirm first, approval-required path second), <strong>I</strong>nterfaces (basic form first, calendar picker second), <strong>D</strong>ata (lab-only first, lab + equipment bundle second), or <strong>R</strong>ules (core overlap check first, quota/blackout second). Check Bill Wake\'s <strong>INVEST</strong> (2003): <em>Independent · Negotiable · Valuable · Estimable · Small · Testable</em>.', '<strong>Bước 1 — Cắt lát dọc theo SPIDR (Spikes, Paths, Interfaces, Data, Rules — tuyệt đối không cắt ngang theo tầng công nghệ!):</strong> Nếu một Use Case phức tạp (như <code>UC-12 Create Reservation</code>, mức C = 240 LOC) quá lớn cho một thẻ 2 ngày, hãy tách dọc bằng 5 đòn bẩy <strong>SPIDR</strong> của Mike Cohn: <strong>S</strong>pikes (thăm dò kỹ thuật ngắn có khung giờ, vd thử nghiệm exclusion constraint Postgres), <strong>P</strong>aths (luồng nhánh: xác nhận ngay trước, nhánh chờ duyệt sau), <strong>I</strong>nterfaces (giao diện đơn giản trước, lịch trực quan sau), <strong>D</strong>ata (dữ liệu: chỉ đặt phòng trước, đặt kèm thiết bị sau), hoặc <strong>R</strong>ules (luật: chống trùng lõi trước, hạn mức/blackout sau). Soát đủ 6 chữ <strong>INVEST</strong> của Bill Wake (2003): <em>Độc lập · Thương lượng được · Có giá trị · Ước lượng được · Nhỏ gọn · Kiểm thử được</em>.')}</li>
<li>${t('<strong>Step 2 — Write the 3-Line Story Header (Who / What / Why):</strong> <code>As a &lt;specific Actor&gt;, I want to &lt;clear action&gt;, so that &lt;measurable business value&gt;.</code> Never write <code>"As a user..."</code> when you mean <code>"As a Lab Manager..."</code> — vague actors hide permission bugs!', '<strong>Bước 2 — Viết phần đầu Story 3 dòng (Ai / Làm gì / Để làm gì):</strong> <code>Với tư cách &lt;Actor cụ thể&gt;, tôi muốn &lt;hành động rõ&gt;, để &lt;giá trị nghiệp vụ đo được&gt;.</code> Đừng bao giờ viết <code>"Với tư cách người dùng..."</code> khi thực chất chỉ có <code>"Lab Manager"</code> được làm — actor mơ hồ che giấu lỗi phân quyền!')}</li>
<li>${t('<strong>Step 3 — Write Acceptance Criteria in Gherkin Given/When/Then (Dan North, BDD 2006):</strong> Every scenario follows three exact clauses: <strong>Given</strong> (precondition / starting DB &amp; user state) · <strong>When</strong> (exact user action or API request) · <strong>Then</strong> (observable UI message <code>SM-xx</code> + DB/HTTP state + audit/side effect). For the link from BDD scenarios to automated tests, see ', '<strong>Bước 3 — Viết Tiêu chí chấp nhận theo cấu trúc Given/When/Then (Dan North, BDD 2006):</strong> Mỗi kịch bản gồm đúng ba vế: <strong>Given</strong> (tiền điều kiện / trạng thái DB &amp; người dùng ban đầu) · <strong>When</strong> (thao tác người dùng hoặc request API cụ thể) · <strong>Then</strong> (thông báo UI <code>SM-xx</code> + trạng thái DB/HTTP + audit quan sát được). Để nối từ BDD sang kiểm thử tự động, xem thêm ')}${ac('software-testing', 'swt301-tdd-bdd', t('SWT301 9.6 — TDD, ATDD &amp; BDD', 'SWT301 9.6 — TDD, ATDD &amp; BDD'))}.</li>
<li>${t('<strong>Step 4 — Use the Recommended "1 + 3 + 1" AC Design Checklist (Supporting Quality L2 Preparation):</strong> Remember LabFlow\'s LOC rule: stopping at happy path = Quality L1 (50% LOC), while L2 (75% LOC) requires unhappy cases — always confirm your lecturer\'s exact L2/L3 grading criteria. As a <strong>suggested AC design checklist</strong> (not an official SWP391 regulation, and writing 5 ACs alone does not automatically guarantee L2 without matching implementation and tests), aim for at least: <strong>1 Happy Path</strong> + <strong>3 Unhappy Paths</strong> (blank/whitespace input · boundary/invalid range · conflict/wrong state) + <strong>1 Security/Permission Abuse Path</strong> (wrong role or another user\'s ID → <code>403/404</code>) on every Req card.', '<strong>Bước 4 — Dùng checklist đề xuất "1 + 3 + 1" khi thiết kế AC (hỗ trợ chuẩn bị mục tiêu Quality L2):</strong> Nhớ luật LOC của LabFlow: dừng ở happy path = Quality L1 (50% LOC), còn L2 (75% LOC) yêu cầu có unhappy case — hãy xác nhận tiêu chí chấm L2/L3 cụ thể với giảng viên. Đây là <strong>checklist đề xuất để thiết kế AC</strong> (không phải quy định bắt buộc của SWP391, và bản thân 5 AC không tự bảo đảm màn hình đạt L2 nếu code và test chưa đáp ứng): gợi ý mỗi thẻ Req nên phủ tối thiểu <strong>1 Luồng chính (Happy)</strong> + <strong>3 Ca lỗi (Unhappy)</strong> (ô trống/toàn dấu cách · sai biên/ngoài miền · trùng lịch/sai trạng thái) + <strong>1 Ca bảo mật/lạm dụng quyền</strong> (sai role hoặc sửa ID người khác → <code>403/404</code>).')}</li>
</ol>

<h3>${t('3. Reusable CT Work User Story + AC Card Template (with LabFlow S22/UC-12 Example)', '3. Mẫu thẻ User Story + AC dùng lại được trên CT Work (kèm ví dụ LabFlow S22/UC-12)')}</h3>
<p>${t('Copy this exact card layout into every Req ticket on CT Work (works for any topic — just replace the bracketed domain details). Notice every single scenario tests ONE crisp trigger with ONE unambiguous outcome:', 'Chép nguyên khung thẻ này vào mọi thẻ Req trên CT Work (dùng cho mọi đề tài — chỉ thay nội dung trong ngoặc). Chú ý mỗi kịch bản chỉ kiểm ĐÚNG MỘT thao tác và MỘT kết quả rõ ràng không tự mâu thuẫn:')}</p>

${out(t(`CARD TITLE : [S22] Create Reservation (Instant Confirm & Conflict Guard)
LINKS      : UC-12 | BR-04, BR-05, BR-06, BR-11, BR-14, BR-15, BR-16 | Mockup: <Figma URL (Approved)>
HAT OWNER  : C1 (Vertical Slice) | Complex (240 LOC) | Target Quality: >= L2

USER STORY
  As a Student (role=STUDENT, status=ACTIVE),
  I want to book an available lab for a half-open 30-min-stepped time slot,
  so that my group is guaranteed conflict-free room access with a single-use QR pass.

ACCEPTANCE CRITERIA (Recommended 1+3+1+ Checklist: 1 Happy + 3 Unhappy + 2 Security)

  [AC-1 · Happy Path + Half-Open Boundary] Instant confirmation for standard lab (<= 30 seats)
    Given I am logged in as Student A (quota used this week: 2h / 6h)
      and "IoT Lab A102" (capacity 24, status ACTIVE) has an existing CONFIRMED slot [07:00, 09:00)
      and [09:00, 11:00) is free on 2026-10-20
    When  I submit S22 with date=2026-10-20, start=09:00, end=11:00, purpose="ESP32 sensor lab",
          participants=4 and a fresh Idempotency-Key
    Then  LabFlow returns HTTP 201 (adjacent half-open boundary [07:00,09:00) & [09:00,11:00) does NOT overlap, BR-04)
      and displays SM-10 ("Your reservation has been confirmed.")
      and DB stores 1 reservation (status=CONFIRMED), 1 active item, 1 unused QR token, 1 audit row (BR-14)
      and 1 confirmation email is queued in outbox.

  [AC-2 · Unhappy Input] Blank / whitespace-only purpose (BR-16)
    Given I am on step 2 of S22
    When  I enter "     " (spaces only) in txt_Purpose and click Next (or send it via API)
    Then  LabFlow blocks submission (HTTP 400 on API)
      and displays SM-26 ("Purpose is required and must be 10 to 255 characters.")
      and zero rows are inserted into DB.

  [AC-3 · Unhappy Boundary / Out-of-Range] Booking date beyond 14-day horizon (BR-05)
    Given today is 2026-10-20 and I am on step 1 of S22
    When  I choose dtp_Date=2026-11-04 (today + 15 days, outside [today, today+14d]) and click Next
    Then  LabFlow rejects the request (HTTP 400 on API)
      and displays SM-21 ("Date must be between today and 14 days from today.")
      and zero rows are inserted into DB.
    (Repeat the same boundary pattern for participants > capacity -> SM-28, and for proposed duration > 4h -> SM-23 once confirmed with your lecturer.)

  [AC-4 · Unhappy Conflict & Concurrency] 50 concurrent requests on the exact same slot (BR-15)
    Given "IoT Lab A102" is free on 2026-10-20 [13:00, 15:00)
    When  50 concurrent valid requests with distinct Idempotency-Keys hit POST /api/v1/reservations
          for "IoT Lab A102" [13:00, 15:00) simultaneously on PostgreSQL
    Then  EXACTLY 1 request returns HTTP 201 (CONFIRMED)
      and 49 requests return HTTP 409 with SM-12 + waitlist link (0 double bookings).
    (Also verify stale-tab equipment in MAINTENANCE -> HTTP 409 per BR-11.)

  [AC-5a · Security Abuse — Wrong Role (OWASP A01)] Lab Staff calls create booking API directly
    Given I am logged in as Lab Staff (blank cell on S22 Screen Authorization)
    When  I call POST /api/v1/reservations with a valid booking payload
    Then  LabFlow returns HTTP 403 Forbidden, creates 0 bookings, and logs the denied attempt.

  [AC-5b · Security Abuse — Forged Ownership / Extra Field (OWASP API1 BOLA)]
    Given I am logged in as Student A and reservation #99 belongs to Student B
    When  I call POST /api/v1/reservations/99/cancel (or send an unexpected "userId" field in S22 JSON
          rejected by strict DTO validation)
    Then  LabFlow returns HTTP 403/404 for cross-user access (or HTTP 400 for forbidden DTO field),
          leaves Student B's reservation unchanged, and creates 0 unauthorized changes.`, `TIÊU ĐỀ THẺ : [S22] Create Reservation (Xác nhận ngay & Chặn đặt trùng)
LIÊN KẾT    : UC-12 | BR-04, BR-05, BR-06, BR-11, BR-14, BR-15, BR-16 | Mockup: <Link Figma đã duyệt>
CHỦ LÁT CẮT : C1 (Vertical Slice) | Độ phức tạp C (240 LOC) | Mục tiêu chất lượng: >= L2

USER STORY
  Với tư cách Student (role=STUDENT, status=ACTIVE),
  tôi muốn đặt một phòng lab còn trống theo khung giờ nửa mở bước 30 phút,
  để nhóm tôi chắc chắn có phòng không trùng lịch kèm mã QR check-in dùng một lần.

TIÊU CHÍ CHẤP NHẬN — ACCEPTANCE CRITERIA (Checklist đề xuất 1+3+1+: 1 Happy + 3 Unhappy + 2 Bảo mật)

  [AC-1 · Luồng đẹp + Biên nửa mở] Xác nhận ngay cho phòng tiêu chuẩn (<= 30 chỗ)
    Given Tôi đã đăng nhập là Student A (đã dùng 2h / 6h tuần này)
      and "IoT Lab A102" (24 chỗ, ACTIVE) đã có ca CONFIRMED [07:00, 09:00)
      and khung [09:00, 11:00) ngày 2026-10-20 còn trống
    When  Tôi gửi S22 với date=2026-10-20, start=09:00, end=11:00, purpose="ESP32 sensor lab",
          participants=4 kèm Idempotency-Key mới
    Then  LabFlow trả HTTP 201 (ca liền kề [07:00,09:00) và [09:00,11:00) KHÔNG chồng lấn theo BR-04)
      and hiện SM-10 ("Your reservation has been confirmed.")
      and DB lưu 1 reservation (CONFIRMED), 1 active item, 1 QR chưa dùng, 1 dòng audit (BR-14)
      and xếp 1 email xác nhận vào hàng đợi outbox.

  [AC-2 · Lỗi đầu vào] Mục đích trống / chỉ toàn dấu cách (BR-16)
    Given Tôi đang ở bước 2 của màn S22
    When  Tôi nhập "     " (toàn dấu cách) vào txt_Purpose rồi bấm Next (hoặc gọi thẳng API)
    Then  LabFlow chặn gửi (HTTP 400 ở API)
      and hiện SM-26 ("Purpose is required and must be 10 to 255 characters.")
      and không chèn dòng nào vào DB.

  [AC-3 · Lỗi biên / Ngoài miền] Ngày đặt vượt trần 14 ngày tới (BR-05)
    Given Hôm nay là 2026-10-20 và tôi đang ở bước 1 của S22
    When  Tôi chọn dtp_Date=2026-11-04 (hôm nay + 15 ngày, vượt miền [hôm nay, +14 ngày]) rồi bấm Next
    Then  LabFlow từ chối (HTTP 400 ở API)
      and hiện SM-21 ("Date must be between today and 14 days from today.")
      and không chèn dòng nào vào DB.
    (Làm tương tự cho ca biên số người > sức chứa -> SM-28, và ca thời lượng đề xuất > 4h -> SM-23 sau khi đã chốt với giảng viên.)

  [AC-4 · Lỗi xung đột & Đồng thời] 50 request đồng thời vào đúng một ca (BR-15)
    Given "IoT Lab A102" đang trống khung [13:00, 15:00) ngày 2026-10-20
    When  50 request hợp lệ (khác Idempotency-Key) cùng bắn POST /api/v1/reservations
          vào "IoT Lab A102" [13:00, 15:00) song song trên PostgreSQL thật
    Then  ĐÚNG 1 request trả HTTP 201 (CONFIRMED)
      and 49 request trả HTTP 409 kèm SM-12 + link waitlist (0 lượt đặt trùng).
    (Kiểm thêm ca thiết bị vừa chuyển MAINTENANCE từ tab cũ -> HTTP 409 theo BR-11.)

  [AC-5a · Ca bảo mật — Sai vai trò (OWASP A01)] Lab Staff gọi thẳng API tạo đặt lịch
    Given Tôi đăng nhập bằng tài khoản Lab Staff (ô trống ở S22 trên Ma trận Phân quyền)
    When  Tôi gọi POST /api/v1/reservations với payload hợp lệ
    Then  LabFlow trả HTTP 403 Forbidden, tạo 0 lượt đặt, và ghi nhận vào audit log.

  [AC-5b · Ca bảo mật — Giả mạo sở hữu / Trường lạ (OWASP API1 BOLA)]
    Given Tôi đăng nhập là Student A và lượt đặt #99 thuộc về Student B
    When  Tôi gọi POST /api/v1/reservations/99/cancel (hoặc gửi thêm trường lạ "userId" trong JSON
          S22 bị DTO cấu hình chặn trường lạ)
    Then  LabFlow trả HTTP 403/404 cho hành vi xâm phạm đơn người khác (hoặc HTTP 400 cho trường lạ),
          giữ nguyên lượt đặt của Student B và không tạo bất kỳ thay đổi trái phép nào.`))}

<h3>🕵️ ${t('The Hacker\'s Angle: Evil User Stories (Abuse Criteria Inside Every Ticket)', 'Góc kẻ xấu: Viết "Evil User Story" ngay trong tiêu chí chấp nhận mỗi thẻ')}</h3>
<p>${t(
    'Security bugs happen when security is treated as a separate "Week 10 hardening task" instead of a per-story Acceptance Criterion. Professional DevSecOps teams attach at least ONE <strong>Negative / Evil Acceptance Criterion</strong> to every User Story: <em>"As a malicious logged-in Student, I try to pass another user\'s ID, replay a used QR code, or flood duplicate Submit clicks — and the system rejects me with 403/409 and leaves zero corrupted rows."</em> When that line sits right inside the CT Work card, C3 Dev BE writes the <code>@PreAuthorize</code> and ownership guard on Day 1, and C5 QA verifies it automatically before dragging the card to Done!',
    'Lỗ hổng bảo mật sinh ra khi người ta xem bảo mật là một "việc làm thêm ở Tuần 10" thay vì một Tiêu chí chấp nhận trên từng thẻ. Các đội DevSecOps chuyên nghiệp gắn ít nhất MỘT <strong>Tiêu chí chấp nhận phủ định (Evil AC)</strong> ngay vào mỗi User Story: <em>"Với tư cách sinh viên xấu tính đã đăng nhập, tôi thử truyền ID của người khác, quét lại mã QR đã dùng, hoặc spam bấm nút Submit — và hệ thống chặn bằng 403/409, không sinh dòng dữ liệu bẩn nào."</em> Khi dòng đó nằm ngay trên thẻ CT Work, C3 Dev BE viết luôn <code>@PreAuthorize</code> và kiểm tra quyền sở hữu từ Ngày 1, còn C5 QA kiểm chứng tự động trước khi kéo thẻ sang Done!')}</p>

<h3>${t('4. Common User Story &amp; AC Mistakes — and How to Avoid Them', '4. Lỗi hay gặp khi viết User Story &amp; AC — và cách tránh')}</h3>
<ul>
<li>${t('<strong>Writing vague, untestable AC ("UI looks clean and works smoothly"):</strong> C5 QA cannot write a Pass/Fail assertion from "smoothly". Fix: every <code>Then</code> clause must name an exact HTTP code, exact <code>SM-xx</code> string, exact DB state, or measurable number.', '<strong>Viết AC mơ hồ không kiểm được ("Giao diện đẹp, chạy mượt"):</strong> C5 QA không thể chấm Đạt/Trượt từ chữ "mượt". Cách tránh: mọi vế <code>Then</code> phải nêu rõ mã HTTP, mã <code>SM-xx</code>, trạng thái DB hoặc con số đo được.')}</li>
<li>${t('<strong>Horizontal tech-layer stories ("Create Reservation JPA Entity &amp; Repo"):</strong> Earns 0 user value and 0 SWP391 LOC until wired end-to-end. Fix: keep DB/API/UI/Test as <em>sub-tasks</em> inside ONE vertical Req story card.', '<strong>Viết story cắt ngang theo tầng kỹ thuật ("Tạo Entity &amp; Repo Reservation"):</strong> Không tạo giá trị cho người dùng và không ra điểm LOC SWP391 cho tới khi nối đủ đầu-cuối. Cách tránh: để DB/API/UI/Test làm <em>việc con (sub-task)</em> bên trong MỘT thẻ Req lát cắt dọc.')}</li>
<li>${t('<strong>Putting implementation details into AC ("Given React calls useMutation with Axios..."):</strong> Couples AC to libraries. Fix: describe observable behavior from the actor\'s &amp; API contract\'s perspective.', '<strong>Nhét tên thư viện code vào AC ("Cho trước React gọi useMutation bằng Axios..."):</strong> Trói AC vào thư viện. Cách tránh: chỉ tả hành vi quan sát được từ góc người dùng và hợp đồng API.')}</li>
<li>${t('<strong>AC contradicts SRS Business Rules:</strong> Story says "cancel within 1 hour" while SRS <code>BR-07</code> says "2 hours". Fix: cite <code>(BR-07)</code> in AC rather than repeating conflicting prose, and update both whenever a CR passes.', '<strong>AC đá nhau với Business Rule trong SRS:</strong> Thẻ ghi "huỷ trước 1 giờ" trong khi SRS <code>BR-07</code> ghi "2 giờ". Cách tránh: dẫn thẳng mã <code>(BR-07)</code> trong AC và cập nhật đồng bộ cả hai khi có CR.')}</li>
</ul>

${phongVan([
  [t('"How do you tell if a User Story is small enough for a sprint?"', '"Làm sao biết một User Story đã đủ nhỏ để đưa vào sprint chưa?"'), t('Check three signals: (1) one developer can finish the full vertical slice (DB + API + UI + tests) within 1–3 working days, (2) it has roughly 4–8 concrete Given/When/Then ACs rather than 25, and (3) it delivers one independently demoable outcome. If it has 15+ ACs or takes over a week, split it vertically by path or rule.', 'Kiểm ba dấu hiệu: (1) một dev làm trọn lát cắt dọc (DB + API + UI + test) trong 1–3 ngày làm việc, (2) có khoảng 4–8 AC Given/When/Then gọn gàng chứ không tới 25 cái, và (3) tạo ra một kết quả tự demo độc lập được. Nếu có hơn 15 AC hoặc mất trên một tuần, tách dọc theo luồng nhánh hoặc theo luật.')],
  [t('"What makes Given/When/Then Acceptance Criteria better than plain bullet points?"', '"Vì sao Acceptance Criteria dạng Given/When/Then tốt hơn gạch đầu dòng thường?"'), t('Plain bullets ("validate date", "handle conflict") hide preconditions and expected results. Given/When/Then forces explicit starting state, exact trigger, and verifiable outcome — so developers avoid edge-case bugs and QA can turn each scenario straight into a JUnit/Playwright test case.', 'Gạch đầu dòng thường ("validate ngày", "xử lý trùng") che giấu tiền điều kiện và kết quả mong đợi. Given/When/Then ép phải ghi rõ trạng thái đầu, thao tác kích hoạt và kết quả kiểm chứng được — giúp dev tránh lỗi biên và QA chuyển thẳng từng kịch bản thành test case JUnit/Playwright.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Split the huge epic "Order Checkout" into vertical INVEST stories: Story 1 = Single-seller COD checkout with atomic stock decrement (<code>AC-3</code>: 20 concurrent buyers for last 1 item → 1 success, 19 out-of-stock); Story 2 = Multi-seller cart split into sub-orders; Story 3 = Voucher application + cap; Story 4 = Online payment webhook idempotency (<code>AC-5</code>: duplicate gateway callback never double-marks paid).', 'Tách epic khổng lồ "Thanh toán đơn hàng" thành các story lát cắt dọc INVEST: Story 1 = Đặt hàng COD 1 shop kèm trừ tồn kho nguyên tử (<code>AC-3</code>: 20 người mua cùng lúc món cuối → 1 thành công, 19 hết hàng); Story 2 = Tách giỏ nhiều shop thành đơn con; Story 3 = Áp mã giảm giá + trần giảm; Story 4 = Idempotency webhook thanh toán (<code>AC-5</code>: callback gửi đúp không cộng tiền 2 lần).')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('During Sprint Planning, every member brings their 3–4 vertical Req cards ALREADY populated with the "1 + 3 + 1" Given/When/Then AC. C5 QA reads the AC aloud in 2 minutes per card — if any <code>Then</code> is vague, the card is NOT pulled into the sprint until fixed (Definition of Ready!).', 'Trong buổi Sprint Planning, mỗi bạn mang sẵn 3–4 thẻ Req lát cắt dọc ĐÃ điền đủ bộ AC "1 + 3 + 1" Given/When/Then. C5 QA đọc nhanh AC 2 phút mỗi thẻ — hễ vế <code>Then</code> nào mơ hồ thì thẻ CHƯA được kéo vào sprint tới khi viết rõ (Definition of Ready!).')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('In mature Agile/BDD teams (banking, aviation, SaaS), Given/When/Then ACs written by BA/PO in Jira are copied verbatim into Cucumber/SpecFlow <code>.feature</code> files so CI automatically executes the business specification against every Pull Request ("Living Documentation").', 'Ở các đội Agile/BDD chín muồi (ngân hàng, hàng không, SaaS), kịch bản Given/When/Then do BA/PO viết trên Jira được đưa thẳng vào file <code>.feature</code> của Cucumber/SpecFlow để CI tự chạy đặc tả nghiệp vụ trên từng Pull Request ("Tài liệu sống — Living Documentation").')]
], en)}

${viecLabflow([
  [t('Under <strong>Sky Blue (C2 BA)</strong> on CT Work (<strong>LF #2</strong>), pick <strong>3 real Req cards</strong> from your Iteration 1 &amp; Iteration 2 backlog (e.g., <code>S14 Lab Detail</code>, <code>S22 Create Reservation</code>, <code>S25 Approval Queue</code>) and rewrite their descriptions using the <strong>User Story + "1 + 3 + 1" Given/When/Then AC Template</strong>.', 'Dưới profile <strong>Xanh dương (C2 BA)</strong> trên CT Work (<strong>LF #2</strong>), chọn <strong>3 thẻ Req thật</strong> trong backlog Iteration 1 &amp; Iteration 2 (vd <code>S14 Chi tiết phòng lab</code>, <code>S22 Tạo đặt lịch</code>, <code>S25 Hàng chờ duyệt</code>) và viết lại mô tả thẻ theo đúng <strong>Mẫu User Story + Bộ AC "1 + 3 + 1" Given/When/Then</strong>.'), t('Every card cites exact <code>UC-xx</code>, <code>BR-xx</code>, <code>SM-xx</code>, approved mockup link, AND contains ≥ 1 Happy + ≥ 3 Unhappy + ≥ 1 Security Abuse Given/When/Then scenarios.', 'Mỗi thẻ dẫn đúng <code>UC-xx</code>, <code>BR-xx</code>, <code>SM-xx</code>, link mockup đã duyệt, VÀ đủ ≥ 1 Happy + ≥ 3 Unhappy + ≥ 1 Security Abuse dạng Given/When/Then.')],
  [t('Verify that all 3 cards pass all 6 <strong>INVEST</strong> checks — if any card has &gt; 10 AC scenarios or takes &gt; 3 days, split it into two linked vertical cards on CT Work.', 'Soát cả 3 thẻ theo đủ 6 chữ <strong>INVEST</strong> — nếu thẻ nào có &gt; 10 kịch bản AC hoặc ước lượng &gt; 3 ngày, tách thành hai thẻ lát cắt dọc có liên kết nhau trên CT Work.'), t('Zero horizontal tech-layer stories ("Build DB tables only"); every card produces a user-visible, C5-testable outcome.', 'Không có story cắt ngang theo tầng kỹ thuật ("Chỉ tạo bảng DB"); mọi thẻ đều ra kết quả người dùng thấy được và C5 kiểm được.')]
], en)}

${thuatNgu([
  ['INVEST', t('Bill Wake\'s 6 quality criteria for a good User Story: Independent, Negotiable, Valuable, Estimable, Small, Testable.', '6 tiêu chí của Bill Wake cho một User Story tốt: Độc lập, Thương lượng được, Có giá trị, Ước lượng được, Nhỏ gọn, Kiểm thử được.')],
  ['Vertical Slice (Lát cắt dọc)', t('A slim end-to-end feature slice spanning DB, Backend API, Frontend UI, and Tests that delivers verifiable user value.', 'Lát cắt tính năng mỏng chạy thông đầu-cuối từ DB, API Backend, UI Frontend tới Test, tạo ra giá trị kiểm chứng được.')],
  ['Given / When / Then (Gherkin BDD)', t('Structured Acceptance Criteria format naming starting state (Given), action/trigger (When), and observable outcome (Then).', 'Cấu trúc viết Tiêu chí chấp nhận gồm trạng thái đầu (Given), thao tác kích hoạt (When) và kết quả quan sát được (Then).')],
  ['Evil User Story / Security AC', t('An explicit negative Given/When/Then criterion proving unauthorized roles, forged IDs, or abuse payloads are safely rejected.', 'Tiêu chí Given/When/Then phủ định chứng minh sai vai trò, giả mạo ID hay payload tấn công đều bị chặn an toàn.')],
  ['Definition of Ready (DoR)', t('Entry checklist a story card must satisfy (clear AC, BRs, approved mockup, small size) before entering a Sprint.', 'Checklist đầu vào một thẻ phải đạt (AC rõ, đủ BR, mockup đã duyệt, đủ nhỏ) trước khi được kéo vào Sprint.')]
], en)}

${tomTat([
  t('Use Cases (SRS) hold the complete system baseline; User Stories + Given/When/Then AC (CT Work cards) deliver that baseline in 1–3 day vertical slices.', 'Use Case (SRS) giữ đường cơ sở toàn hệ thống; User Story + AC Given/When/Then (thẻ CT Work) triển khai đường cơ sở đó thành các lát cắt dọc 1–3 ngày.'),
  t('Always slice vertically (DB + API + UI + Test) — horizontal technical layers hide integration disasters (BBC DMI lesson) and earn 0 SWP391 LOC until connected.', 'Luôn cắt lát dọc (DB + API + UI + Test) — cắt ngang theo tầng che giấu thảm hoạ tích hợp (bài học BBC DMI) và nhận 0 điểm LOC SWP391 cho tới khi nối thông.'),
  t('Use the recommended "1 Happy + 3 Unhappy + 1 Security Abuse" Given/When/Then checklist on every Req card to systematically cover unhappy and OWASP abuse cases from Day 1 (confirm exact L2/L3 grading criteria with your lecturer).', 'Dùng checklist đề xuất "1 Happy + 3 Unhappy + 1 Bảo mật" dạng Given/When/Then trên mỗi thẻ Req để phủ bài bản ca lỗi và bảo mật OWASP từ Ngày 1 (xác nhận tiêu chí chấm L2/L3 cụ thể với giảng viên).'),
  t('Keep every CT Work card cross-referenced to its exact UC-xx, BR-xx, SM-xx, and approved mockup link so SRS and sprint execution never drift.', 'Gắn chặt mỗi thẻ CT Work với đúng mã UC-xx, BR-xx, SM-xx và link mockup đã duyệt để SRS và bảng sprint không bao giờ lệch pha.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-4-6-report3-srs-rtm', t('4.6 — Report 3 SRS by Iteration &amp; Bootstrapping the RTM', '4.6 — Report 3 SRS theo iteration &amp; khởi tạo ma trận truy vết RTM'))}.</p>
`);
};

export default {
  title: '4.5 — User Stories & Acceptance Criteria (Given/When/Then)|||4.5 — User story & tiêu chí chấp nhận (Given/When/Then)',
  slug: 'dm5-4-5-user-story-ac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cách nối đặc tả Use Case sang User Story lát cắt dọc chuẩn INVEST (SPIDR) và Tiêu chí chấp nhận Given/When/Then (BDD) trên CT Work: bài học BBC DMI (NAO Memorandum 01/2014 & PAC Report HC 985 04/2014), checklist đề xuất "1 Happy + 3 Unhappy + 1 Security Abuse" hỗ trợ phủ ca lỗi và bảo mật (xác nhận tiêu chí L2 với giảng viên), mẫu thẻ CT Work chuẩn dùng lại cho mọi đề tài.',
  content: L45(true) + L45(false),
};
