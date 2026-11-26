/**
 * 1.7 — Lab: Cho một Req chạy trọn qua năm chiếc mũ trên CT Work (dm5-1-lab).
 * Bài thực hành tổng hợp Chương 1 trên dự án LF #2 (CT Work): dựng RACI 2 lớp + lịch time-box 6+1 + Nhật ký vai,
 * chạy thử trọn vòng 5 mũ (C2 Spec -> C3 BE Contract -> C4 FE 4-State -> nghỉ làm nguội -> C5 QA + AI Critic -> C1 Gate Check)
 * trên 1 Req thật của Iteration 1, kèm gợi ý từng bậc, thang chấm Rubric 10 điểm & bảng tự chấm điền được.
 */
import { bang, cl, note, thuatNgu, tomTat, giai, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L17 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 1 · Hands-on Lab', 'Chương 1 · Bài thực hành Lab', `
<h2>${t('1.7 — Lab: Run one Req end-to-end through all five hats on CT Work', '1.7 — Lab: Cho một Req chạy trọn qua năm chiếc mũ trên CT Work')}</h2>
<p class="lead">${t(
    'Reading about five hats is easy; feeling your own brain switch cleanly from BA to Dev BE to Dev FE to sceptical QA to disciplined PM — and actually catching real mistakes in your own work — is where the skill locks in. Before you write a single feature line in Week 1, this <strong>2.5–3 hour hands-on lab</strong> takes ONE real Iteration-1 requirement on CT Work (<strong>LF #2</strong>) and walks it through a complete <strong>five-hat dry run</strong>, locks your two-layer RACI and weekly time-box (reusing your Lesson 1.6 pages), enforces a real cooling-off gap + adversarial checklist, and grades your execution with a 10-point self-assessment rubric.',
    'Đọc lý thuyết về năm chiếc mũ rất dễ; tự tay cảm nhận bộ não mình chuyển mượt từ BA sang Dev BE, sang Dev FE, sang QA khó tính rồi sang PM kỷ luật — và thật sự bắt được lỗi trên chính bài làm của mình — mới là lúc kỹ năng ăn sâu vào máu. Trước khi gõ dòng code tính năng đầu tiên ở Tuần 1, bài <strong>lab thực hành 2,5–3 giờ</strong> này lấy ĐÚNG MỘT yêu cầu thật của Iteration 1 trên CT Work (<strong>LF #2</strong>) cho chạy thử trọn vòng <strong>năm chiếc mũ</strong>, chốt RACI hai lớp cùng lịch time-box tuần (dùng lại trang đã tạo ở Bài 1.6), chạy khoảng nghỉ làm nguội + checklist phản biện thật, và tự chấm bằng thang Rubric 10 điểm.')}</p>

<h3>${t('Everyday picture: a full dress rehearsal before opening night', 'Liên tưởng đời thường: buổi tổng duyệt có phục trang trước đêm công diễn')}</h3>
<p>${t(
    'No theatre troupe walks onto opening night having only read the script at a table. They run a full dress rehearsal: changing costumes backstage, testing every stage cue, checking whether the props actually fit through the side door. In this lab, you are running the <strong>dress rehearsal of your five-hat operating system</strong> on one single screen (<code>S14 Lab detail</code> or <code>S03 Login</code>) before the pressure of 46 screens hits in Weeks 2–10. Any friction in your browser profiles, RACI rules, review checklists, or Role Log shows up right here when fixing it takes five minutes.',
    'Không đoàn kịch nào bước thẳng ra đêm công diễn khi mới chỉ ngồi quanh bàn đọc kịch bản. Họ chạy tổng duyệt đầy đủ phục trang: thay đồ sau cánh gà, thử từng nhịp đèn sân khấu, kiểm xem đạo cụ có lọt qua cửa phụ không. Trong bài lab này, bạn đang chạy <strong>buổi tổng duyệt hệ điều hành năm chiếc mũ</strong> trên đúng một màn hình (<code>S14 Chi tiết phòng lab</code> hoặc <code>S03 Đăng nhập</code>) trước khi áp lực 46 màn hình ập tới ở Tuần 2–10. Mọi chỗ vướng ở profile trình duyệt, bảng RACI, checklist review hay Nhật ký vai sẽ lộ ra ngay lúc này khi sửa chỉ mất năm phút.')}</p>

<h3>${t('Pre-flight checklist &amp; time budget', 'Chuẩn bị trước khi làm &amp; phân bổ thời gian')}</h3>
<ul>
<li>${t('<strong>Time budget:</strong> <strong>2.5–3 hours (~150–180 min)</strong> split across <strong>TWO sessions</strong> (Session A: ~105–120 min for Tasks 1–3, or ~90 min if you already created the RACI/Time-Box tables in Lesson 1.6; mandatory cooling-off gap ≥ 1 hour, ideally overnight for SRS &amp; API contracts; Session B: ~55–60 min for Tasks 4–5). <em>Do NOT compress both sessions into one sitting — testing the cooling-off rule is part of the grade!</em>', '<strong>Quỹ thời gian:</strong> <strong>2,5–3 giờ (~150–180 phút)</strong> chia thành <strong>HAI phiên</strong> (Phiên A: ~105–120 phút làm Nhiệm vụ 1–3 — rút còn ~90 phút nếu bạn đã tạo sẵn bảng RACI/Time-Box ở Bài 1.6; bắt buộc nghỉ làm nguội tối thiểu 1 giờ, lý tưởng là qua đêm cho SRS &amp; hợp đồng API; Phiên B: ~55–60 phút làm Nhiệm vụ 4–5). <em>KHÔNG gộp hai phiên ngồi liền một mạch — kiểm chứng luật khoảng nghỉ là một phần của thang chấm!</em>')}</li>
<li>${t('<strong>Workspace ready:</strong> CT Work (<strong>LabFlow Studio · LF #2</strong>) open across your 5 colour-coded browser profiles from ', '<strong>Không gian sẵn sàng:</strong> CT Work (<strong>LabFlow Studio · LF #2</strong>) đã đăng nhập đủ 5 profile trình duyệt gắn màu từ ')}${dm('dm5-0-4-dung-cong-ty-mot-nguoi', t('Lesson 0.4', 'Bài 0.4'))}.</li>
<li>${t('<strong>Target Req card:</strong> Pick ONE real Iteration-1 Medium screen in LF #2 — recommended: <strong><code>S14 Lab detail</code></strong> (Create/Update lab) or <strong><code>S03 Login</code></strong> (Auth + 5-fail lockout). Do not pick a trivial static page like Home.', '<strong>Thẻ Req mục tiêu:</strong> Chọn ĐÚNG MỘT màn hình cỡ Medium của Iteration 1 trong LF #2 — khuyến nghị: <strong><code>S14 Chi tiết phòng lab</code></strong> (Tạo/Sửa lab) hoặc <strong><code>S03 Đăng nhập</code></strong> (Xác thực + khoá sau 5 lần sai). Đừng chọn trang tĩnh đơn giản như Home.')}</li>
</ul>

<h3>${t('Five-Hat Dry-Run Flow (how your 5 tasks interlock)', 'Sơ đồ chạy thử trọn vòng 5 mũ (cách 5 nhiệm vụ móc xích với nhau)')}</h3>
<pre><code>${t(`  SESSION A (Build &amp; Governance — ~105-120 min)
  +------------------------------------------------------------------------+
  | [Task 1 · C1 Purple]   Reuse/lock 2-Layer RACI + 6+1 Time-Box + Log    |
  |         |              (copy tables from Lesson 1.6 if starting fresh) |
  |         v                                                              |
  | [Task 2 · C2 Sky Blue] Write 8-Row Mini-Spec (Flow, Wireframe/SM-xx,   |
  |         |              BR/Q&amp;A, &gt;= 3 Unhappy + 1 Abuse Case, AC)        |
  |         v                                                              |
  | [Task 3 · C3 Green -&gt; C4 Amber]                                        |
  |         C3 posts API Contract + Backend Auth &amp; DB constraints          |
  |         C4 posts 4-State UI Plan mapped 1-to-1 to C3 error codes       |
  +-----------------------------------+------------------------------------+
                                      |
       ====== MANDATORY COOLING-OFF GAP (&gt;= 1h; overnight for SRS/API) ======
                                      |
  SESSION B (Adversarial Verification &amp; Gate — ~55-60 min)
  +-----------------------------------v------------------------------------+
  | [Task 4 · C5 Red]      Create 6 Test Cases in CT Work tests            |
  |         |              + Run 10-Pt Checklist &amp; AI Critic prompt        |
  |         |              + Log &gt;= 2 REAL gaps -&gt; C2/C3 fix by hand!      |
  |         v                                                              |
  | [Task 5 · C1 Purple]   Run 5-Row Governance Check + sum Role Log hrs   |
  |         |              + score Self-Assessment Rubric (target &gt;= 8/10) |
  +---------v--------------------------------------------------------------+
            ===&gt; GREEN LIGHT: CHAPTER 1 MASTERED · READY FOR CHAPTER 2!`, `  PHIÊN A (Quản trị, Đặc tả &amp; Hợp đồng — ~105-120 phút)
  +------------------------------------------------------------------------+
  | [Nhiệm vụ 1 · C1 Tím]    Dùng lại/khoá RACI 2 lớp + Time-Box + Role Log|
  |         |                (copy mẫu từ Bài 1.6 nếu chưa làm bài 1.6)    |
  |         v                                                              |
  | [Nhiệm vụ 2 · C2 Dương]  Viết Mini-Spec 8 dòng (Luồng chính, Wireframe |
  |         |                &amp; SM-xx, BR/Q&amp;A, &gt;= 3 Unhappy + 1 Abuse, AC)  |
  |         v                                                              |
  | [Nhiệm vụ 3 · C3 Lá -&gt; C4 Cam]                                         |
  |         C3 đăng Hợp đồng API + luật quyền backend &amp; ràng buộc DB       |
  |         C4 đăng Kế hoạch 4 trạng thái UI ánh xạ 1-1 mã lỗi của C3     |
  +-----------------------------------+------------------------------------+
                                      |
      ====== KHOẢNG NGHỈ BẮT BUỘC (&gt;= 1 giờ; khuyến nghị qua đêm) ======
                                      |
  PHIÊN B (Phản biện QA &amp; Chốt cổng C1 — ~55-60 phút)
  +-----------------------------------v------------------------------------+
  | [Nhiệm vụ 4 · C5 Đỏ]     Tạo 6 Test Case trong mục tests của CT Work   |
  |         |                + Chạy Checklist 10 điểm &amp; AI Người phản biện |
  |         |                + Bắt &gt;= 2 lỗi THẬT -&gt; C2/C3 tự tay sửa!      |
  |         v                                                              |
  | [Nhiệm vụ 5 · C1 Tím]    Chạy Checklist quản trị 5 dòng + cộng Role Log|
  |         |                + tự chấm Rubric 10 điểm (mục tiêu &gt;= 8/10)   |
  +---------v--------------------------------------------------------------+
            ===&gt; ĐÈN XANH: LÀM CHỦ CHƯƠNG 1 · SẴN SÀNG SANG CHƯƠNG 2!`)}</code></pre>

<h3>${t('Step-by-step lab tasks on CT Work (LF #2)', 'Hướng dẫn thực hành từng bước trên CT Work (LF #2)')}</h3>

<h4>${t('Task 1 — Reuse &amp; lock your Two-Layer RACI, Weekly Time-Box &amp; Role Log (25–30 min · Session A; ~15 min if reusing Lesson 1.6)', 'Nhiệm vụ 1 — Dùng lại &amp; khoá RACI hai lớp, Lịch tuần Time-Box &amp; Nhật ký vai (25–30 phút · Phiên A; ~15 phút nếu dùng lại Bài 1.6)')} ${mu('C1', en)}</h4>
<ol>
<li>${t('Open your <strong>Purple (C1)</strong> browser profile → CT Work <code>LF #2</code> → <code>docs</code>. <strong>Reuse</strong> the exact <code>01-RACI-and-Weekly-Timebox</code> page you created in ', 'Mở profile <strong>Tím (C1)</strong> → CT Work <code>LF #2</code> → <code>docs</code>. <strong>Dùng lại</strong> đúng trang <code>01-RACI-and-Weekly-Timebox</code> bạn đã tạo ở ')}${dm('dm5-1-6-raci-lich-tuan', t('Lesson 1.6', 'Bài 1.6'))}${t(' (do NOT create a duplicate; if you skipped Lesson 1.6\'s exercise, create it now and copy both RACI tables + the 6+1 time-box template from Lesson 1.6).', ' (KHÔNG tạo trang trùng; nếu trước đó bạn bỏ qua bài tập 1.6 thì tạo mới ngay lúc này và chép hai bảng RACI + khung time-box 6+1 từ Bài 1.6 sang).')}</li>
<li>${t('Audit both RACI layers: (a) <strong>Layer A</strong> (8 work packages × 5 hats C1–C5) — check mechanically that EVERY row has ≥ 1 <code>R</code>, EXACTLY ONE <code>A</code>, and no single hat holds &gt; 50% of <code>A</code>s (C1 holds 3/8 = 37.5%); (b) <strong>Layer B</strong> (Honest Report 2 PMP table with <em>Your Real Name + Student ID</em> and <em>Supervisor</em>).', 'Soát kỹ hai lớp RACI: (a) <strong>Lớp A</strong> (8 gói việc × 5 mũ C1–C5) — kiểm cơ học từng hàng có ≥ 1 <code>R</code>, ĐÚNG MỘT <code>A</code>, và không mũ nào ôm &gt; 50% chữ <code>A</code> (C1 giữ 3/8 = 37,5%); (b) <strong>Lớp B</strong> (bảng trung thực cho Report 2 PMP chỉ gồm cột <em>Tên thật + Mã SV</em> và <em>Supervisor</em>).')}</li>
<li>${t('Confirm the 6+1 weekly time-box matches YOUR real class/exam schedule for the next 7 days, with realistic weekly hours (18–26h), Day 7 protected, and overnight cooling-off gaps before every C5 block.', 'Xác nhận bảng time-box 6+1 khớp đúng lịch học/lịch thi thật của BẠN trong 7 ngày tới, ghi tổng giờ tuần thực tế (18–26 giờ), bảo vệ Ngày 7 và đánh dấu rõ khoảng nghỉ qua đêm trước mỗi khối C5.')}</li>
<li>${t('Open your existing <code>01-Role-Log-Week-1</code> from Lesson 1.6 (or create it if starting fresh here) and <strong>append</strong> a C1 row for this Task 1 block (continuing from Row #4 if you already logged 3 rows in Lesson 1.6, or starting at Row #1).', 'Mở trang <code>01-Role-Log-Week-1</code> đã có từ Bài 1.6 (hoặc tạo mới nếu bạn chưa làm) và <strong>ghi nối tiếp</strong> dòng C1 cho khối Nhiệm vụ 1 này (tiếp từ Dòng #4 nếu bạn đã có 3 dòng ở Bài 1.6, hoặc bắt đầu từ Dòng #1).')}</li>
</ol>

<h4>${t('Task 2 — Spec your chosen Iteration-1 Req under hat C2 (40–45 min · Session A)', 'Nhiệm vụ 2 — Đặc tả thẻ Req Iteration 1 đã chọn dưới mũ C2 (40–45 phút · Phiên A)')} ${mu('C2', en)}</h4>
<ol>
<li>${t('Close Purple C1 and switch to your <strong>Sky Blue (C2 BA)</strong> profile. Open your chosen Iteration-1 Req card (e.g., <code>S14 Lab detail</code> or <code>S03 Login</code>) on CT Work <code>board</code> / <code>backlog</code>.', 'Đóng cửa sổ Tím C1 và chuyển sang profile <strong>Xanh dương (C2 BA)</strong>. Mở thẻ Req Iteration 1 bạn chọn (vd <code>S14 Lab detail</code> hoặc <code>S03 Login</code>) trong <code>board</code> / <code>backlog</code> CT Work.')}</li>
<li>${t('Paste and fill the 8-row <strong>C2 Spec Mini-Card</strong> from ', 'Dán và điền trọn <strong>Mini-Spec 8 dòng của C2</strong> từ ')}${dm('dm5-1-2-ba', t('Lesson 1.2', 'Bài 1.2'))}${t(' into the card description: (1) ID &amp; Allowed/Forbidden Actors · (2) Precondition · (3) Normal Flow · (4) Wireframe, Data Fields &amp; SM-xx · (5) Numbered BR-xx &amp; Related Q&amp;A · (6) ≥ 3 Unhappy Cases + 1 Abuse Case (OWASP API1 BOLA check!) · (7) Postcondition (zero BRs mixed in!) · (8) Testable Given/When/Then AC.', ' vào mô tả thẻ: (1) Mã &amp; Actor được phép/bị cấm · (2) Precondition · (3) Luồng chính · (4) Wireframe, Trường dữ liệu &amp; mã SM-xx · (5) Mã BR-xx &amp; Q&amp;A liên quan · (6) ≥ 3 Unhappy Case + 1 Abuse Case (chặn OWASP API1 BOLA!) · (7) Postcondition (không trộn BR!) · (8) AC dạng Given/When/Then kiểm thử được.')}</li>
<li>${t('Double-check the text for banned "weasel words" (<em>fast, valid, reasonable, user-friendly, etc.</em>) and mark any unconfirmed number with <code>[PROPOSED — see Q&amp;A]</code>. Append your C2 row to <code>01-Role-Log-Week-1</code> + log work on the card.', 'Soát sạch từ mơ hồ bị cấm (<em>nhanh, hợp lệ, hợp lý, thân thiện, v.v.</em>) và đánh dấu mọi con số chưa chốt bằng <code>[ĐỀ XUẤT — xem Q&amp;A]</code>. Ghi nối tiếp dòng C2 vào <code>01-Role-Log-Week-1</code> + log work trên thẻ.')}</li>
</ol>

<h4>${t('Task 3 — Lock the BE–FE Contract Handshake under hats C3 &amp; C4 (40–45 min · Session A)', 'Nhiệm vụ 3 — Chốt cái bắt tay Hợp đồng BE–FE dưới mũ C3 &amp; C4 (40–45 phút · Phiên A)')} ${mu('C3', en)} ${mu('C4', en)}</h4>
<ol>
<li>${t('Switch to <strong>Green (C3 Dev BE)</strong> on that same card. Post a comment titled <code>[C3 BE Contract]</code> containing: HTTP Method + URL, Request JSON, 200/201 Response envelope, exact HTTP status + error codes for EVERY unhappy/abuse case C2 wrote (<code>400</code>, <code>401</code>, <code>403</code>, <code>409</code>, <code>422</code>), exact backend authorization rule (e.g., <code>@PreAuthorize</code> + ownership), and required DB constraints (e.g., <code>UNIQUE</code>, <code>CHECK</code>, <code>FK</code>).', 'Chuyển sang profile <strong>Xanh lá (C3 Dev BE)</strong> trên đúng thẻ đó. Đăng một bình luận tiêu đề <code>[C3 BE Contract]</code> gồm: Method + URL, Request JSON, vỏ phản hồi 200/201, mã HTTP + mã lỗi cho TỪNG unhappy/abuse case C2 đã viết (<code>400</code>, <code>401</code>, <code>403</code>, <code>409</code>, <code>422</code>), luật phân quyền backend cụ thể (vd <code>@PreAuthorize</code> + kiểm sở hữu) và các ràng buộc DB bắt buộc (vd <code>UNIQUE</code>, <code>CHECK</code>, <code>FK</code>).')}</li>
<li>${t('Switch to <strong>Amber (C4 Dev FE)</strong> on that same card. Post a comment titled <code>[C4 FE 4-State Plan]</code> listing: (1) Loading state (skeleton/disabled button), (2) Empty state, (3) Populated/Success state, (4) Error UI mapping EVERY error code from C3\'s comment to a human-readable message, plus client validation rules.', 'Chuyển sang profile <strong>Vàng cam (C4 Dev FE)</strong> trên cùng thẻ đó. Đăng bình luận tiêu đề <code>[C4 FE 4-State Plan]</code> liệt kê: (1) Trạng thái Đang tải (skeleton/khoá nút chống bấm đúp), (2) Trạng thái Rỗng, (3) Trạng thái Có dữ liệu/Thành công, (4) Bảng ánh xạ TỪNG mã lỗi của C3 sang thông báo thân thiện trên UI, kèm luật validate phía client.')}</li>
<li>${t('Append your C3 and C4 rows to <code>01-Role-Log-Week-1</code>. <strong>STOP HERE! Close CT Work and take your mandatory Cooling-Off Gap (minimum 1 hour; overnight strongly recommended for SRS &amp; API contracts) before Session B.</strong>', 'Ghi nối tiếp dòng C3 và C4 vào <code>01-Role-Log-Week-1</code>. <strong>DỪNG TẠI ĐÂY! Đóng CT Work và nghỉ làm nguội bắt buộc (tối thiểu 1 giờ; khuyến nghị qua đêm cho SRS &amp; hợp đồng API) trước khi sang Phiên B.</strong>')}</li>
</ol>

<h4>${t('Task 4 — Adversarial QA Critique &amp; Test Design under hat C5 (40–45 min · Session B)', 'Nhiệm vụ 4 — Phản biện QA &amp; Thiết kế Test dưới mũ C5 (40–45 phút · Phiên B)')} ${mu('C5', en)}</h4>
<ol>
<li>${t('After the cooling-off gap, open ONLY your <strong>Red (C5 QA)</strong> browser profile. Open CT Work <code>tests</code> and create <strong>6 structured test cases</strong> linked to your Req card using the 6-category C5 Matrix from ', 'Sau khoảng nghỉ làm nguội, CHỈ mở profile <strong>Đỏ (C5 QA)</strong>. Vào trang <code>tests</code> trên CT Work và tạo <strong>6 test case có cấu trúc</strong> liên kết tới thẻ Req của bạn theo đúng Ma trận 6 nhóm của C5 ở ')}${dm('dm5-1-4-qa-tester', t('Lesson 1.4', 'Bài 1.4'))}${t(' (TC-01 Happy, TC-02 Empty/Spaces, TC-03 Boundary/BR, TC-04 Conflict/Duplicate, TC-05 Security/Auth Bypass, TC-06 Adjacent Edge). Keep Preconditions strictly separate from Steps! <em>Tip for TC-04 &amp; TC-06:</em> if you picked <strong>S14</strong>, test two concurrent requests with the same <code>code</code> → <code>1×201 + 1×409</code> (TC-04) and <code>capacity = 1</code> succeeding (TC-06); if you picked <strong>S03</strong>, test 5th failed login locking the account for 15 min (TC-04) and 4 wrong passwords followed by the right one on attempt #5 still succeeding (TC-06).', ' (TC-01 Luồng chính, TC-02 Rỗng/Dấu cách, TC-03 Biên/BR, TC-04 Xung đột/Trùng, TC-05 Vượt quyền, TC-06 Biên sát hợp lệ). Tách rạch ròi Precondition khỏi Steps! <em>Gợi ý TC-04 &amp; TC-06:</em> nếu chọn <strong>S14</strong>, test hai request đồng thời cùng <code>code</code> → <code>1×201 + 1×409</code> (TC-04) và <code>capacity = 1</code> phải thành công (TC-06); nếu chọn <strong>S03</strong>, test sai lần 5 khoá tài khoản 15 phút (TC-04) và sai 4 lần liên tiếp rồi nhập đúng ở lần 5 vẫn đăng nhập được (TC-06).')}</li>
<li>${t('Open CT Work <code>reviews</code> (or comment directly on your Req card as C5) and apply the relevant lines of the <strong>10-Point Adversarial Checklist</strong> from ', 'Mở mục <code>reviews</code> trên CT Work (hoặc bình luận trực tiếp trên thẻ Req dưới tài khoản C5) và chấm theo các mục liên quan của <strong>Checklist phản biện 10 điểm</strong> ở ')}${dm('dm5-1-5-doi-mu', t('Lesson 1.5', 'Bài 1.5'))}${t('. Then run the <strong>Spec Critique AI Prompt</strong> (forbidding AI from rewriting your spec!) on your C2 + C3 text.', '. Sau đó chạy <strong>Prompt AI Phản biện Spec</strong> (cấm AI viết lại hộ!) lên nội dung C2 + C3 của bạn.')}</li>
<li>${t('Post at least <strong>2 concrete gaps/defects</strong> found (e.g., missing conflict status code, missing max string length, or unmapped 403 UI handling) as a C5 comment. Then switch briefly back to C2/C3/C4 to fix those gaps by hand, and confirm under C5 that the spec + contract are now clean! Append your C5 row to <code>01-Role-Log-Week-1</code>.', 'Đăng ít nhất <strong>2 lỗ hổng/thiếu sót thật</strong> bạn bắt được (vd quên mã lỗi xung đột, chưa ghi độ dài tối đa của trường chữ, hoặc C4 chưa xử lý khi nhận 403) dưới bình luận C5. Sau đó quay lại C2/C3/C4 tự tay sửa sạch, rồi xác nhận lại dưới C5 rằng spec + hợp đồng đã khớp! Ghi nối tiếp dòng C5 vào <code>01-Role-Log-Week-1</code>.')}</li>
</ol>

<h4>${t('Task 5 — C1 Governance Sign-Off, Role Log Tally &amp; Self-Score (15 min · Session B)', 'Nhiệm vụ 5 — Chốt cổng C1, Tổng kết Nhật ký vai &amp; Tự chấm Rubric (15 phút · Phiên B)')} ${mu('C1', en)}</h4>
<ol>
<li>${t('Switch to <strong>Purple (C1)</strong>. Open <code>01-Role-Log-Week-1</code> and add a 1-row summary at the bottom calculating total real minutes/hours spent per hat across all logged rows (covering all 5 hats C1–C5) and the actual cooling-off gap between Session A and Session B.', 'Chuyển sang <strong>Tím (C1)</strong>. Mở <code>01-Role-Log-Week-1</code> và thêm 1 dòng tổng kết cuối bảng tính tổng phút/giờ thật cho từng mũ qua tất cả các dòng đã ghi (đủ cả 5 mũ C1–C5) cùng đúng khoảng nghỉ làm nguội thực tế giữa Phiên A và Phiên B.')}</li>
<li>${t('Open <code>01-C1-Governance-Checklist</code> (from Lesson 1.1), verify the card now meets Definition of Ready (DoR) for Week 1 coding, and paste your filled <strong>10-Point Self-Assessment Rubric</strong> below into the bottom of <code>01-RACI-and-Weekly-Timebox</code>.', 'Mở <code>01-C1-Governance-Checklist</code> (từ Bài 1.1), xác nhận thẻ đã đạt Definition of Ready (DoR) để bắt đầu code ở Tuần 1, và dán <strong>Bảng tự chấm Rubric 10 điểm</strong> bên dưới (đã điền điểm thật) vào cuối trang <code>01-RACI-and-Weekly-Timebox</code>.')}</li>
</ol>

<h3>${t('Progressive hints (open one at a time if stuck)', 'Gợi ý từng bậc (chỉ mở từng mục khi vướng)')}</h3>
${giai(t('Hint 1 — Blank reusable C3/C4 Contract Template + Worked Example on another domain (E-commerce: Create Seller Store)', 'Gợi ý 1 — Khung trống Hợp đồng C3/C4 dùng lại được + Ví dụ trên miền khác (Sàn TMĐT: Tạo gian hàng)'), `
<p>${t('Remember the hand-coded mentor rule: we do NOT give a copy-paste contract for S14 or S03. Use the blank structure below, study how it looks on an <strong>E-commerce Marketplace ("Create Seller Store")</strong>, and then write your own contract for your LabFlow card from scratch:', 'Nhớ luật tự làm của khoá học: chúng ta KHÔNG đưa lời giải sẵn để chép cho S14 hay S03. Hãy dùng khung trống dưới đây, xem cách áp dụng trên một miền khác là <strong>Sàn thương mại điện tử ("Tạo gian hàng người bán")</strong>, rồi tự viết hợp đồng cho thẻ LabFlow của riêng bạn:')}</p>
${out(t(`=== BLANK TEMPLATE (copy & fill for any Req card) ===
[C3 BE Contract — <Screen ID & Action>]
<METHOD> /api/v1/<resource>  (Allowed: <ROLE> via @PreAuthorize + <ownership rule>; others -> 403)
Request Body: { "<field1>": <type/example>, "<field2>": <type/example> }
DB constraints: UNIQUE(<col>), CHECK(<rule>), FK(<col> -> <parent_table>.id)
Responses:
- 201 Created  : { "success": true,  "data":  { "id": ..., "<key>": ..., "status": "..." } }
- 400 Bad Req  : { "success": false, "error": { "code": "VALIDATION_ERROR", "fields": { ... } } }
- 401/403      : { "success": false, "error": { "code": "UNAUTHORIZED|FORBIDDEN", "message": "..." } }
- 409/422      : { "success": false, "error": { "code": "<DOMAIN_CODE>", "message": "..." } }

[C4 FE 4-State Plan — <Screen ID>]
1. Loading  : <Disable submit button + spinner/skeleton to prevent double-submit>
2. Empty    : <What displays when dropdown/list dependency has 0 items>
3. Populated: <Success toast/summary + navigation target>
4. Error    : <Map EVERY C3 HTTP/error code above 1-to-1 to exact UI feedback>

=== WORKED EXAMPLE (Different Domain: E-Commerce "Create Seller Store") ===
[C3 BE Contract — Create Seller Store]
POST /api/v1/stores  (Allowed: VERIFIED_SELLER via @PreAuthorize; Buyer/Guest -> 403/401)
Request Body: { "categoryId": 3, "slug": "green-tea-vn", "displayName": "Green Tea House", "maxDailyOrders": 50 }
DB constraints: UNIQUE(slug), CHECK(max_daily_orders > 0), FK(category_id -> categories.id)
Responses:
- 201 Created  : { "success": true,  "data":  { "id": 42, "slug": "green-tea-vn", "status": "ACTIVE" } }
- 400 Bad Req  : { "success": false, "error": { "code": "VALIDATION_ERROR", "fields": { "maxDailyOrders": "Must be > 0" } } }
- 403 Forbidden: { "success": false, "error": { "code": "FORBIDDEN", "message": "Verified Seller role required" } }
- 409 Conflict : { "success": false, "error": { "code": "STORE_SLUG_TAKEN", "message": "Store slug already exists" } }

[C4 FE 4-State Plan — Create Seller Store]
1. Loading  : Disable "Open Store" button + inline spinner while POST is pending (blocks double-click).
2. Empty    : Category selector shows "No active categories available — contact support" if list is empty.
3. Populated: Show toast "Store Green Tea House opened" + redirect to Seller Dashboard.
4. Error    : 400 -> inline error under invalid field; 409 -> red helper under slug input ("Slug already taken");
              403 -> Access Denied page; 500 -> non-blocking retry banner.`, `=== MẪU TRỐNG (chép & tự điền cho thẻ Req của bạn) ===
[C3 BE Contract — <Mã màn hình & Thao tác>]
<METHOD> /api/v1/<tài-nguyên>  (Được phép: <VAI> qua @PreAuthorize + <luật sở hữu>; vai khác -> 403)
Request Body: { "<trường1>": <kiểu/ví dụ>, "<trường2>": <kiểu/ví dụ> }
Ràng buộc DB: UNIQUE(<cột>), CHECK(<điều kiện>), FK(<cột> -> <bảng_cha>.id)
Phản hồi:
- 201 Created  : { "success": true,  "data":  { "id": ..., "<khoá>": ..., "status": "..." } }
- 400 Bad Req  : { "success": false, "error": { "code": "VALIDATION_ERROR", "fields": { ... } } }
- 401/403      : { "success": false, "error": { "code": "UNAUTHORIZED|FORBIDDEN", "message": "..." } }
- 409/422      : { "success": false, "error": { "code": "<MÃ_LỖI_NGHIỆP_VỤ>", "message": "..." } }

[C4 FE 4-State Plan — <Mã màn hình>]
1. Đang tải  : <Khoá nút Submit + spinner/skeleton chặn bấm đúp>
2. Rỗng      : <Hiện gì khi danh sách/dropdown phụ thuộc chưa có dữ liệu>
3. Có dữ liệu: <Toast/tóm tắt thành công + trang điều hướng tới>
4. Lỗi       : <Ánh xạ 1-1 TỪNG mã HTTP/mã lỗi của C3 sang phản hồi rõ trên UI>

=== VÍ DỤ MINH HOẠ TRÊN MIỀN KHÁC (Sàn TMĐT: "Tạo gian hàng người bán") ===
[C3 BE Contract — Tạo gian hàng]
POST /api/v1/stores  (Được phép: VERIFIED_SELLER qua @PreAuthorize; Buyer/Guest -> 403/401)
Request Body: { "categoryId": 3, "slug": "tra-xanh-vn", "displayName": "Tiệm Trà Xanh", "maxDailyOrders": 50 }
Ràng buộc DB: UNIQUE(slug), CHECK(max_daily_orders > 0), FK(category_id -> categories.id)
Phản hồi:
- 201 Created  : { "success": true,  "data":  { "id": 42, "slug": "tra-xanh-vn", "status": "ACTIVE" } }
- 400 Bad Req  : { "success": false, "error": { "code": "VALIDATION_ERROR", "fields": { "maxDailyOrders": "Phải > 0" } } }
- 403 Forbidden: { "success": false, "error": { "code": "FORBIDDEN", "message": "Chỉ Người bán đã xác minh mới được tạo gian hàng" } }
- 409 Conflict : { "success": false, "error": { "code": "STORE_SLUG_TAKEN", "message": "Đường dẫn gian hàng đã tồn tại" } }

[C4 FE 4-State Plan — Tạo gian hàng]
1. Đang tải  : Khoá nút "Mở gian hàng" + hiện spinner trong khi POST đang chạy (chặn bấm đúp).
2. Rỗng      : Ô chọn ngành hàng hiện "Chưa có ngành hàng hoạt động — liên hệ hỗ trợ" nếu danh sách rỗng.
3. Có dữ liệu: Hiện toast "Đã mở gian hàng Tiệm Trà Xanh" + chuyển sang trang quản lý gian hàng.
4. Lỗi       : 400 -> báo lỗi đỏ ngay dưới ô sai; 409 -> báo dưới ô slug ("Đường dẫn đã có người dùng");
               403 -> trang Không có quyền truy cập; 500 -> banner cho phép thử lại.`))}
`)}
${giai(t('Hint 2 — What if C5 cannot find any gaps in my own C2/C3 work?', 'Gợi ý 2 — Nếu C5 đọc lại bài của C2/C3 mà "không thấy lỗi nào" thì sao?'), `<p>${t('Almost every first draft has at least 2 real gaps! Check these 5 classic blind spots on your chosen screen: (1) What if a text field is only spaces <code>"   "</code> or 500 chars long? (2) What if a referenced parent ID does not exist in DB (clean <code>404</code>/<code>400</code> vs unhandled <code>500</code>)? (3) What if a read-only or lower-privilege role calls the write endpoint directly via <code>curl</code>? (4) What if two concurrent requests hit the same unique key or state transition at the exact same millisecond (DB constraint / atomic update → <code>409</code>)? (5) What happens to active child records or future sessions if this entity is deactivated/locked?', 'Hầu như bản nháp đầu tiên nào cũng sót ít nhất 2 lỗi thật! Hãy soi đúng 5 điểm mù kinh điển sau trên màn hình bạn chọn: (1) Nhập toàn dấu cách <code>"   "</code> hoặc 500 ký tự thì sao? (2) Truyền một mã cha tham chiếu không tồn tại trong DB thì trả <code>404</code>/<code>400</code> sạch sẽ hay nổ <code>500</code>? (3) Một vai chỉ có quyền xem (hoặc quyền thấp hơn) bắn thẳng endpoint ghi qua <code>curl</code> thì sao? (4) Hai request đồng thời đánh vào cùng một khoá duy nhất hoặc cùng một chuyển trạng thái trong 1 mili-giây (ràng buộc DB / cập nhật có điều kiện → <code>409</code>)? (5) Điều gì xảy ra với các bản ghi con hay lịch đang hoạt động khi đối tượng này bị khoá hoặc đóng?')}</p>`)}

<h3>${t('Grading Rubric (10 points) &amp; Fillable Self-Assessment Table', 'Thang chấm Rubric (10 điểm) &amp; Bảng tự chấm điền được')}</h3>
${bang(
  [t('Criterion', 'Tiêu chí'), t('Max', 'Tối đa'), t('Full marks when…', 'Đạt điểm tối đa khi…'), t('Your score', 'Tự chấm')],
  [
    [t('<strong>1. Two-Layer RACI &amp; Honesty</strong>', '<strong>1. RACI hai lớp &amp; Trung thực</strong>'), '2', t('Layer A (5 hats) has ≥ 1 R &amp; exactly 1 A per row (no hat &gt; 50% A); Layer B (Report 2) uses ONLY real Student + Supervisor columns.', 'Lớp A (5 mũ) có ≥ 1 R &amp; đúng 1 A mỗi hàng (không mũ nào &gt; 50% A); Lớp B (Report 2) CHỈ dùng cột Sinh viên thật + Supervisor.'), '___ / 2'],
    [t('<strong>2. C2 Spec Quality (DoR)</strong>', '<strong>2. Chất lượng Spec C2 (DoR)</strong>'), '2', t('8-row Mini-Spec complete on the Req card (including Normal Flow, Wireframe/Fields/SM-xx, BR-xx &amp; Q&amp;A); 0 vague weasel words; ≥ 3 unhappy cases + 1 OWASP API1 abuse case; BR not mixed into Postcondition.', 'Điền đủ Mini-Spec 8 dòng trên thẻ Req (có Luồng chính, Wireframe/Trường/SM-xx, BR-xx &amp; Q&amp;A); 0 từ mơ hồ; ≥ 3 unhappy case + 1 abuse case OWASP API1; không trộn BR vào Postcondition.'), '___ / 2'],
    [t('<strong>3. C3–C4 Contract Alignment</strong>', '<strong>3. Độ khớp Hợp đồng C3–C4</strong>'), '2', t('C3 lists exact HTTP status/error codes + backend auth + DB constraints; C4 covers all 4 UI states and maps EVERY C3 error code 1-to-1.', 'C3 ghi rõ mã HTTP/mã lỗi + phân quyền backend + ràng buộc DB; C4 đủ 4 trạng thái UI và ánh xạ 1-1 TỪNG mã lỗi của C3.'), '___ / 2'],
    [t('<strong>4. Real Cooling-Off &amp; C5 Adversarial Catch</strong>', '<strong>4. Khoảng nghỉ thật &amp; C5 bắt lỗi thật</strong>'), '2', t('Real gap ≥ 1h (ideally overnight) proved by timestamps; 6 structured test cases in CT Work <code>tests</code>; ≥ 2 real gaps caught via checklist + AI Critic (no AI rewrite) and fixed by hand.', 'Khoảng nghỉ thật ≥ 1 giờ (lý tưởng qua đêm) chứng minh bằng mốc giờ; đủ 6 test case trong <code>tests</code>; bắt ≥ 2 lỗi thật bằng checklist + AI phản biện (không để AI viết lại) và tự tay sửa.'), '___ / 2'],
    [t('<strong>5. Weekly Time-Box &amp; Honest Role Log</strong>', '<strong>5. Lịch Time-Box &amp; Nhật ký vai trung thực</strong>'), '2', t('6+1 schedule adapted to your real classes (Day 7 protected); <code>01-Role-Log-Week-1</code> (reused from Lesson 1.6 or created here) has ≥ 5 honest rows covering all 5 hats (C1–C5) with real minutes/hours + summary tally.', 'Lịch 6+1 khớp thời khoá biểu thật của bạn (bảo vệ Ngày 7); <code>01-Role-Log-Week-1</code> (dùng lại từ Bài 1.6 hoặc tạo tại đây) có ≥ 5 dòng trung thực phủ đủ cả 5 mũ (C1–C5) với phút/giờ thật + dòng tổng kết.'), '___ / 2'],
    [t('<strong>TOTAL</strong>', '<strong>TỔNG CỘNG</strong>'), '<strong>10</strong>', t('<strong>Pass:</strong> ≥ 8/10 AND zero honesty/separation violations (did not fake Layer B RACI, did not skip cooling-off gap, did not let AI rewrite your spec).', '<strong>Đạt:</strong> ≥ 8/10 VÀ không vi phạm trung thực/tách quyền (không bịa RACI Lớp B, không bỏ khoảng nghỉ, không để AI viết hộ spec).'), '<strong>___ / 10</strong>']
  ]
)}

${cl('tip', `<p><strong>${t('Extra challenge (optional — for aiming 9+ at defense)', 'Thử thách thêm (tuỳ chọn — dành cho mục tiêu bảo vệ 9+ điểm)')}</strong> — ${t('Repeat Tasks 2–4 on a <em>second</em>, harder core screen — <strong><code>S22 Create Reservation Wizard</code></strong> — specifically verifying how C3\'s PostgreSQL <code>EXCLUDE USING gist</code> constraint maps to C4\'s <code>409 Conflict → Join Waitlist</code> UI prompt and C5\'s 50-parallel-request concurrency test case.', 'Lặp lại Nhiệm vụ 2–4 cho một màn hình lõi khó hơn — <strong><code>S22 Wizard đặt phòng lab</code></strong> — đặc biệt soát xem ràng buộc <code>EXCLUDE USING gist</code> của PostgreSQL ở C3 ánh xạ sang hộp thoại <code>409 Conflict → Vào hàng chờ</code> ở C4 và ca test đồng thời 50 request ở C5 như thế nào.')}</p>`)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Run this exact 2.5–3 hour five-hat dry run on the core screen <strong>"Checkout &amp; Deduct Stock"</strong>: C2 writes BR for voucher expiry &amp; partial stock failure, C3 locks <code>409 OUT_OF_STOCK</code> + row-level DB lock, C4 maps the "Some items sold out — update cart" modal, C5 catches the negative-quantity &amp; double-submit bugs after an overnight gap.', 'Chạy đúng bài diễn tập 5 mũ 2,5–3 giờ này trên màn lõi <strong>"Thanh toán &amp; Trừ tồn kho"</strong>: C2 viết BR hạn voucher &amp; hết một phần hàng, C3 chốt mã <code>409 OUT_OF_STOCK</code> + khoá dòng trong DB, C4 ánh xạ hộp thoại "Một số món đã hết — cập nhật giỏ", C5 sau một đêm nghỉ bắt lỗi số lượng âm &amp; bấm đúp đặt đơn.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Turn this lab into a <strong>60-minute Sprint-0 Team Workshop</strong>: everyone picks 1 screen from their own vertical slice, writes their C2 Mini-Spec + C3/C4 Contract in 30 minutes, then swaps seats with a teammate for 20 minutes of live C5 Adversarial Critique — proving the team\'s review loop works before Week 2 starts.', 'Biến bài lab này thành <strong>Workshop Sprint-0 60 phút cho cả nhóm</strong>: mỗi người chọn 1 màn thuộc miền dọc của mình, viết Mini-Spec + Hợp đồng API trong 30 phút, rồi đổi ghế cho bạn kế bên phản biện kiểu C5 trong 20 phút — chứng minh vòng review của nhóm chạy trơn tru trước khi vào Tuần 2.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('In real Agile enterprise squads, this exact five-hat handshake is called a <strong>"Three Amigos" / Backlog Refinement session</strong> (PO/BA + Dev + QA reviewing a story together BEFORE Sprint Planning to lock edge cases, contracts, and test scenarios). Having run it solo across all five perspectives means you will immediately ask the sharpest questions in your first Three Amigos meeting at OJT.', 'Ở các squad Agile doanh nghiệp, đúng cái bắt tay năm mũ này chính là buổi <strong>"Three Amigos" / Backlog Refinement</strong> (PO/BA + Dev + QA cùng soi một story TRƯỚC Sprint Planning để khoá trường hợp biên, hợp đồng và kịch bản test). Đã tự chạy trọn cả năm góc nhìn một mình giúp bạn lập tức đặt được những câu hỏi sắc bén nhất ngay buổi Three Amigos đầu tiên ở kỳ OJT.')]
], en)}

${viecLabflow([
  [t('Complete all 5 Lab Tasks on CT Work (<strong>LF #2</strong>) across two separated sessions (respecting the ≥ 1h / overnight cooling-off gap) and record your final score (≥ 8/10) inside <code>01-RACI-and-Weekly-Timebox</code>.', 'Hoàn thành trọn 5 Nhiệm vụ Lab trên CT Work (<strong>LF #2</strong>) tách làm hai phiên (tuân thủ khoảng nghỉ làm nguội ≥ 1 giờ / qua đêm) và ghi tổng điểm tự chấm (≥ 8/10) vào cuối trang <code>01-RACI-and-Weekly-Timebox</code>.'), t('Your chosen Iteration-1 Req has C2 8-row Mini-Spec, C3 BE Contract, C4 4-State Plan, ≥ 2 real C5 review catches fixed by hand, 6 linked test cases in <code>tests</code>, and ≥ 5 honest Role Log rows covering all 5 hats (reusing your Lesson 1.6 doc), totalling ≥ 8/10 on the rubric.', 'Thẻ Req Iteration 1 bạn chọn có đủ Mini-Spec 8 dòng của C2, Hợp đồng BE C3, Kế hoạch 4 trạng thái C4, ≥ 2 lỗi thật do C5 bắt đã tự tay sửa, 6 test case liên kết trong <code>tests</code> và ≥ 5 dòng Nhật ký vai trung thực phủ đủ 5 mũ (dùng lại trang từ Bài 1.6), đạt ≥ 8/10 trên rubric.')]
], en)}

${thuatNgu([
  ['Five-Hat Dry Run (Diễn tập 5 mũ)', t('Walking one real requirement from C1 governance through C2 spec, C3/C4 contract, cooling-off gap, and C5 QA review before full-scale coding begins.', 'Cho một yêu cầu thật đi trọn từ quản trị C1 qua spec C2, hợp đồng C3/C4, khoảng nghỉ và phản biện C5 trước khi bước vào code hàng loạt.')],
  ['Three Amigos', t('Agile practice where BA/PO, Dev, and QA review a story together before coding to align on rules, contracts, and acceptance tests.', 'Thực hành Agile nơi BA/PO, Dev và QA cùng soi một story trước khi code để thống nhất luật, hợp đồng và test chấp nhận.')],
  ['Definition of Ready (DoR)', t('Checklist confirming a Req card has unambiguous spec, confirmed contract, and testable AC before developers start coding.', 'Checklist xác nhận thẻ Req đã có spec rõ, hợp đồng chốt và AC kiểm thử được trước khi lập trình viên bắt tay code.')]
], en)}

${tomTat([
  t('Never skip the dress rehearsal: running 1 real Req through all 5 hats on CT Work exposes process friction while it still costs only minutes to fix.', 'Đừng bỏ qua buổi tổng duyệt: cho 1 Req thật chạy trọn qua 5 mũ trên CT Work làm lộ mọi chỗ kẹt của quy trình khi sửa chỉ mất vài phút.'),
  t('Split the lab into Session A (build/spec) and Session B (C5 critique) with a real ≥ 1h/overnight cooling-off gap — never rubber-stamp in the same sitting.', 'Tách bài lab thành Phiên A (soạn spec/hợp đồng) và Phiên B (phản biện C5) có khoảng nghỉ thật ≥ 1 giờ/qua đêm — không bao giờ duyệt ngay trong cùng phiên.'),
  t('Score ≥ 8/10 on the rubric with zero honesty violations before taking Chapter 1 Quiz and entering Chapter 2 (Project Kickoff &amp; Planning).', 'Đạt ≥ 8/10 trên rubric và không vi phạm trung thực trước khi làm Kiểm tra Chương 1 và bước sang Chương 2 (Khởi động &amp; Lập kế hoạch).')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-1-quiz', t('1.8 — Chapter 1 Quiz', '1.8 — Kiểm tra Chương 1'))}.</p>
`);
};

export default {
  title: '1.7 — Lab: Run one Req end-to-end through all five hats on CT Work|||1.7 — Lab: Cho một Req chạy trọn qua năm chiếc mũ trên CT Work',
  slug: 'dm5-1-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab thực hành Chương 1 trên CT Work LF #2: dựng RACI 2 lớp + lịch time-box 6+1 + Nhật ký vai, chạy thử trọn vòng 5 mũ (C1->C2->C3->C4->nghỉ làm nguội->C5+AI phản biện->C1) trên 1 Req Iteration 1, gợi ý từng bậc, rubric 10 điểm và bảng tự chấm.',
  content: L17(true) + L17(false),
};
