/**
 * 4.7 — Review chéo yêu cầu: Dev hỏi "làm được không", QA hỏi "kiểm được không" (dm5-4-7-review-cheo-yeu-cau).
 * Nguồn lịch sử/chuẩn đã kiểm: Michael Fagan — "Design and Code Inspections to Reduce Errors in Program Development" (IBM Systems Journal, 1976);
 * Barry Boehm & Victor Basili — "Software Defect Reduction Top 10 List" (IEEE Computer, January 2001) (chi phí sửa lỗi sau phát hành cao gấp tới 100 lần so với giai đoạn yêu cầu/thiết kế);
 * Karl Wiegers & Joy Beatty — Software Requirements, 3rd ed. (2013) (Inspection & Ambiguity Checklist).
 * Không lặp lại lý thuyết Inspection của SWR302 Ch6 hay SWT301 Ch3 — dẫn link và dạy quy trình Review chéo 3 mũ (C3/C4 Dev + C5 QA + C1 PM) + AI Adversarial Reviewer trên CT Work.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, ac, cs, ng, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L47 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.7', 'Chương 4 · Bài 4.7', `
<h2>${t('4.7 — Cross-Role Requirement Review: Dev Asks "Is It Buildable?", QA Asks "Is It Testable?"', '4.7 — Review chéo yêu cầu: Dev hỏi "làm được không", QA hỏi "kiểm được không"')}</h2>
<p class="lead">${t(
    'Remember the iron law from Chapter 1 (',
    'Nhớ luật thép từ Chương 1 (')}${dm('dm5-1-5-doi-mu', t('1.5 — Hat Switching &amp; Separation of Duties', '1.5 — Luật đổi mũ &amp; tách quyền'))}${t(
    '): <strong>the author NEVER approves their own work</strong>. Even when you work solo, a requirement written under hat <strong>C2 (BA)</strong> is NOT ready for design or coding until you step away for a cooling-off break, put on hat <strong>C3/C4 (Dev)</strong> to interrogate <em>"Can we actually build this cleanly and safely?"</em>, put on hat <strong>C5 (QA)</strong> to interrogate <em>"Can I write deterministic Pass/Fail test cases from this without guessing?"</em>, and pass hat <strong>C1 (PM)</strong>\'s Definition of Ready gate. This single 20-minute cross-review saves days of painful rework.',
    '): <strong>người viết TUYỆT ĐỐI không tự duyệt bài của mình</strong>. Ngay cả khi làm một mình, một đặc tả viết dưới mũ <strong>C2 (BA)</strong> CHƯA sẵn sàng sang thiết kế hay code cho tới khi bạn nghỉ ngắt mạch, đội mũ <strong>C3/C4 (Dev)</strong> để tra vấn <em>"Liệu có code sạch và an toàn được không?"</em>, đội mũ <strong>C5 (QA)</strong> để tra vấn <em>"Có viết thẳng test case Đạt/Trượt mà không phải tự đoán không?"</em>, rồi qua cổng Definition of Ready của <strong>C1 (PM)</strong>. Đúng 20 phút review chéo này cứu bạn khỏi nhiều ngày đập đi viết lại.')}</p>

<h3>${t('Everyday picture: the Three Amigos checking the movie script before renting cameras', 'Liên tưởng đời thường: đạo diễn, quay phim và hậu kỳ cùng đọc kịch bản trước khi thuê máy quay')}</h3>
<p>${t(
    'Imagine a screenwriter hands in a script saying: <em>"Scene 12: The hero leaps effortlessly across a raging volcano at sunset while smiling."</em> Before renting helicopters and cameras, the <strong>Director (PM)</strong> checks budget and schedule, the <strong>Cinematographer &amp; Stunt Lead (Dev)</strong> ask <em>"Wait — is that real lava or CGI? What lighting? How do we keep the actor alive?"</em>, and the <strong>Continuity Supervisor (QA)</strong> asks <em>"In Scene 11 the hero broke his ankle — how is he jumping in Scene 12?"</em> Fixing Scene 12 on paper costs one pen stroke. Fixing it after shooting costs millions. In Agile software teams, that exact meeting is called the <strong>Three Amigos</strong> (BA/PO + Dev + QA) — and in your 1-person 5-hat company, you run it by rotating hats systematically.',
    'Tưởng tượng biên kịch nộp bản thảo ghi: <em>"Cảnh 12: Nhân vật chính nhẹ nhàng nhảy qua miệng núi lửa đang phun trào lúc hoàng hôn và mỉm cười."</em> Trước khi thuê trực thăng và máy quay, <strong>Đạo diễn (PM)</strong> soát ngân sách và lịch quay, <strong>Quay phim &amp; Chỉ đạo hành động (Dev)</strong> hỏi ngay <em>"Khoan — dung nham thật hay kỹ xảo CGI? Ánh sáng lấy kiểu gì? Bảo hiểm diễn viên ra sao?"</em>, còn <strong>Thư ký trường quay (QA)</strong> vặn lại <em>"Ở Cảnh 11 nhân vật chính mới gãy chân, sao sang Cảnh 12 nhảy phăng phăng vậy?"</em> Sửa Cảnh 12 trên giấy tốn một nét bút. Sửa sau khi quay xong tốn hàng triệu đô. Trong các đội Agile, cuộc họp đó gọi là <strong>Three Amigos (Bộ ba BA/PO + Dev + QA)</strong> — và trong công ty 1 người 5 vai, bạn chạy nó bằng cách xoay mũ có kỷ luật.')}</p>

<h3>${t('1. Why Requirement Reviews Have the Highest ROI in Software Engineering (Real Data)', '1. Vì sao review yêu cầu mang lại lợi tức cao nhất trong kỹ nghệ phần mềm (dẫn chứng thật)')}</h3>
<p>${t(
    'For the formal academic process of Static Reviews and Inspections, review ',
    'Để xem thêm phần lý thuyết quy trình Kiểm thử tĩnh (Static Review) và Inspection, xem lại ')}${ac('software-requirements', 'swr302-6-1-tham-dinh', t('SWR302 6.1 — Requirements Validation', 'SWR302 6.1 — Thẩm định yêu cầu'))} ${t('and ', 'và ')}${ac('software-testing', 'swt301-static-reviews', t('SWT301 3.2 — Static Review Process', 'SWT301 3.2 — Quy trình Review tĩnh'))}${t(
    '. Two classic peer-reviewed engineering papers prove why every serious company invests heavily in inspecting requirements before coding:',
    '. Hai công trình kỹ nghệ phần mềm kinh điển chứng minh vì sao mọi công ty nghiêm túc đều đầu tư mạnh cho khâu thẩm định yêu cầu trước khi code:')}</p>
<ul>
<li>${t('<strong>Michael Fagan (IBM Systems Journal, 1976):</strong> Pioneered formal Design and Code Inspections at IBM, demonstrating that structured checklist-based peer inspections catch <strong>60%+ of defects</strong> before a program ever executes, cutting total rework dramatically.', '<strong>Michael Fagan (IBM Systems Journal, 1976):</strong> Người khai sinh quy trình Inspection (thẩm định chính thức) tại IBM, chứng minh rằng soi chéo có checklist bắt được <strong>trên 60% lỗi</strong> ngay trước khi chương trình chạy thử, cắt giảm mạnh công sức làm lại.')}</li>
<li>${t('<strong>Barry Boehm &amp; Victor Basili ("Software Defect Reduction Top 10 List", <em>IEEE Computer</em>, Jan 2001):</strong> Documented that finding and fixing a software defect after delivery is often <strong>up to 100 times more expensive</strong> than finding and fixing it during the requirements and early design phases. Even on a solo student project, catching a missing <code>BR-15</code> (no-overlap) or <code>BR-07</code> (2h cancel cutoff) or contradictory Postcondition in 15 minutes during Chapter 4 saves 8+ hours of rewriting Flyway migrations, Spring services, React forms, and Unit/System tests in Chapter 8!', '<strong>Barry Boehm &amp; Victor Basili ("Software Defect Reduction Top 10 List", <em>IEEE Computer</em>, tháng 1/2001):</strong> Khẳng định việc phát hiện và sửa một lỗi phần mềm sau khi phát hành thường tốn kém gấp <strong>tới 100 lần</strong> so với bắt và sửa nó ngay ở giai đoạn yêu cầu và thiết kế sớm. Ngay cả trên đồ án làm một mình, bắt một lỗi thiếu <code>BR-15</code> (chống chồng giờ), thiếu <code>BR-07</code> (mốc huỷ 2 giờ) hay Postcondition mâu thuẫn trong 15 phút ở Chương 4 cứu bạn khỏi 8+ giờ sửa dây chuyền Flyway, Spring Service, form React và bộ test ở Chương 8!')}</li>
</ul>

<h3>${t('2. The 4-Step Solo Cross-Review Protocol on CT Work (Rotating All 5 Hats)', '2. Quy trình Review chéo 4 bước trên CT Work (xoay vòng đủ 5 chiếc mũ)')} ${mu('C2', en)} → ${mu('C3', en)} ${mu('C4', en)} → ${mu('C5', en)} → ${mu('C1', en)}</h3>

<pre><code>${t(`  [C2 · BA]     Finishes SRS slice / Req card (UC + BR + SM + Mockup + AC)
       |        Opens Review Session on CT Work reviews/ -&gt; marks "Ready for Review"
       |
  =====|======== COOLING-OFF BREAK (minimum 2 hours or overnight!) ========|=====
       v
  [C3/C4 · DEV] Feasibility &amp; Security Pass: "Can BE/DB/FE build this cleanly?"
       |        Checks: Concurrency, State Machine, API data, 5 UI states, STRIDE-lite
       v
  [C5 · QA]     Testability &amp; Consistency Pass: "Can I write Pass/Fail tests NOW?"
       |        Checks: Ambiguity words, Boundaries (EP/BVA), Exact SM-xx, 0 contradictions
       v
  [C1 · PM]     Definition of Ready Gate: Scope / LOC / MaxLOC / Effort fits Sprint?
       |
       +--&gt; [Issues found] -&gt; Log comments in CT Work reviews/ -&gt; C2 fixes -&gt; Re-verify
       +--&gt; [0 Blockers]   -&gt; Baseline Approved -&gt; READY FOR CHAPTER 5 (DESIGN)!`, `  [C2 · BA]     Viết xong lát cắt SRS / thẻ Req (UC + BR + SM + Mockup + AC)
       |        Mở phiên Review trên CT Work reviews/ -&gt; gắn trạng thái "Chờ Review"
       |
  =====|======== NGHỈ NGẮT MẠCH (tối thiểu 2 giờ hoặc qua đêm!) ===========|=====
       v
  [C3/C4 · DEV] Lượt soi Khả thi &amp; Bảo mật: "BE/DB/FE có làm sạch và an toàn được không?"
       |        Soi: Đồng thời, State Machine, nguồn dữ liệu API, 5 trạng thái UI, STRIDE-lite
       v
  [C5 · QA]     Lượt soi Kiểm thử được &amp; Nhất quán: "Có viết ngay test Đạt/Trượt được không?"
       |        Soi: Từ mơ hồ, Giá trị biên (EP/BVA), Mã SM-xx chính xác, 0 mâu thuẫn
       v
  [C1 · PM]     Cổng Definition of Ready: Phạm vi / LOC / MaxLOC / Công sức có vừa Sprint?
       |
       +--&gt; [Có lỗi]     -&gt; Ghi bình luận trên CT Work reviews/ -&gt; C2 sửa -&gt; Soát lại
       +--&gt; [0 lỗi chặn] -&gt; Chốt đường cơ sở -&gt; SẴN SÀNG SANG CHƯƠNG 5 (THIẾT KẾ)!`)}</code></pre>

<h3>${t('3. The Dual Interrogation Checklists: What Dev (C3/C4) &amp; QA (C5) Ask on EVERY Requirement', '3. Bộ câu hỏi tra vấn kép: Dev (C3/C4) và QA (C5) hỏi gì trên MỌI yêu cầu')}</h3>
<p>${t('Use this reusable <strong>8-question interrogation checklist</strong> on ANY project (combined with the 4 STRIDE-lite security questions below = <strong>12 total checks</strong>) — paste it directly into your CT Work <code>reviews</code> session:', 'Dùng <strong>bảng kiểm 8 câu hỏi tra vấn</strong> dùng lại được này cho MỌI dự án (cộng thêm 4 câu bảo mật STRIDE-lite ngay bên dưới là <strong>trọn 12 điểm kiểm</strong>) — dán thẳng vào phiên review trên trang <code>reviews</code> của CT Work:')}</p>

${bang(
  [t('Reviewer Hat', 'Mũ người soi'), t('Core Question', 'Câu hỏi xoáy cốt lõi'), t('What a PASS looks like', 'Đạt khi thấy gì'), t('Real LabFlow Defect Caught Before Coding', 'Lỗi LabFlow bắt được TRƯỚC khi code')],
  [
    [mu('C3', en) + ' (BE/DB)', t('<strong>1. Data &amp; Concurrency:</strong> Where does every input come from, and what if 2 users click simultaneously?', '<strong>1. Dữ liệu &amp; Đồng thời:</strong> Mọi dữ liệu lấy từ đâu, và 2 người bấm cùng lúc thì sao?'), t('Every field exists in Data Dictionary/ERD; atomic transaction &amp; DB constraint exception (<code>8E1</code>) specified.', 'Mọi trường có trong Data Dictionary/ERD; ghi rõ transaction nguyên tử &amp; ngoại lệ xung đột DB (<code>8E1</code>).'), t('Caught missing <code>idempotency_key</code> and missing <code>6E2</code> when two Lab Managers approve <code>S25</code> simultaneously!', 'Bắt lỗi thiếu <code>idempotency_key</code> và thiếu ngoại lệ <code>6E2</code> khi hai Lab Manager cùng duyệt một đơn trên <code>S25</code>!')],
    [mu('C3', en) + ' (BE/DB)', t('<strong>2. State Transitions:</strong> What happens if someone calls this action from an illegal previous state?', '<strong>2. Chuyển trạng thái:</strong> Điều gì xảy ra nếu ai đó gọi thao tác này từ trạng thái cũ không hợp lệ?'), t('Explicit Precondition states + HTTP 409 Exception Flow for invalid jumps.', 'Ghi rõ trạng thái Tiền điều kiện + luồng ngoại lệ HTTP 409 cho bước nhảy sai.'), t('Caught missing rule: can a user cancel a booking AFTER Lab Staff already scanned QR (<code>CHECKED_IN</code>)? → Added 409 guard!', 'Bắt lỗi thiếu luật: người dùng có được huỷ sau khi Lab Staff đã quét QR (<code>CHECKED_IN</code>) không? → Thêm chặn 409!')],
    [mu('C3', en) + ' (BE/DB)', t('<strong>3. External Dependencies:</strong> What if Email/Payment/AI/IoT is down or times out?', '<strong>3. Dịch vụ ngoài:</strong> Email/Thanh toán/AI/IoT sập hoặc timeout thì sao?'), t('Secondary Actor connected on UC diagram + explicit fallback/retry Exception Flow.', 'Secondary Actor có nối trên sơ đồ UC + có luồng ngoại lệ fallback/thử lại rõ ràng.'), t('Caught missing <code>10E1</code>: if MailTrap/SMTP fails, booking MUST still succeed via Outbox retry rather than rolling back!', 'Bắt thiếu <code>10E1</code>: nếu MailTrap/SMTP lỗi, lượt đặt VẪN phải thành công qua hàng đợi Outbox chứ không rollback!')],
    [mu('C4', en) + ' (FE)', t('<strong>4. All 5 UI States &amp; Pagination:</strong> Are Empty, Loading, Field Error, Conflict, and Server-side Search/Filter/Sort/Paging specified?', '<strong>4. Đủ 5 trạng thái UI &amp; Phân trang:</strong> Đã đặc tả Rỗng, Đang tải, Lỗi trường, Xung đột và Tìm/Lọc/Sắp/Phân trang server chưa?'), t('Mockup + §3 Field Description cover every button, loading lock, and exact <code>SM-xx</code> placement.', 'Mockup + bảng §3 phủ mọi nút, khoá nút lúc gửi và vị trí hiện đúng <code>SM-xx</code>.'), t('Caught <code>S23 My Reservations</code> mockup missing server-side paging &amp; filter controls required by SWP391 Policies!', 'Bắt màn <code>S23 Lịch của tôi</code> bị thiếu bộ lọc và phân trang phía server theo Policy SWP391!')],
    [mu('C5', en) + ' (QA)', t('<strong>5. Ambiguity Hunt ("Weasel Words"):</strong> Are there any fuzzy adjectives or open-ended words?', '<strong>5. Săn từ mơ hồ ("từ lươn lẹo"):</strong> Có tính từ cảm tính hay từ bỏ lửng nào không?'), t('Zero occurrences of <em>fast, easy, user-friendly, reasonable, valid, appropriate, several, etc., and/or</em>.', '0 lần xuất hiện các từ <em>nhanh, dễ dùng, thân thiện, hợp lý, hợp lệ, phù hợp, một vài, v.v.</em> không kèm số đo.'), t('Caught "Student cancels early enough" → forced C2 to pin exact <code>BR-07: now &lt;= start - 2h</code>!', 'Bắt câu "Sinh viên huỷ đủ sớm" → ép C2 khoá cứng <code>BR-07: now &lt;= start - 2h</code>!')],
    [mu('C5', en) + ' (QA)', t('<strong>6. Boundary &amp; Decision Coverage (EP/BVA):</strong> Can I calculate exact test values right now?', '<strong>6. Giá trị biên &amp; Phân vùng (EP/BVA):</strong> Có tính ngay được bộ giá trị test biên lúc này không?'), t('Inclusive vs. exclusive clearly stated (<code>&lt;</code> vs <code>&lt;=</code>, <code>[start, end)</code>, exact min/max lengths).', 'Rõ đóng hay mở (<code>&lt;</code> hay <code>&lt;=</code>, <code>[start, end)</code>, độ dài min/max chính xác).'), t('Caught "max 14 days ahead": is day 14 at 23:59 allowed or day 14 exact timestamp? → Clarified cleanly in <code>BR-05</code>!', 'Bắt câu "tối đa 14 ngày tới": tính tới 23:59 ngày thứ 14 hay đúng mốc giờ +14 ngày? → Chốt rõ trong <code>BR-05</code>!')],
    [mu('C5', en) + ' (QA)', t('<strong>7. Cross-Document Consistency:</strong> Do UC names, BRs, SMs, Postconditions, and AC match 100%?', '<strong>7. Nhất quán chéo tài liệu:</strong> Tên UC, mã BR, SM, Postcondition và AC có khớp 100% không?'), t('Zero orphan/ghost BR/SM codes; Postcondition never contradicts Alternative Flow; AC maps 1-to-1 to UC.', '0 mã BR/SM mồ côi/ma; Postcondition không đá Alternative Flow; AC khớp 1-1 với UC.'), t('Caught <code>S22</code> citing <code>BR-06 (40 seats)</code> in SRS while LabFlow map said <code>30 seats</code> → opened Q&amp;A to unify!', 'Bắt <code>S22</code> trong SRS ghi <code>BR-06 (40 chỗ)</code> còn bản đồ LabFlow ghi <code>30 chỗ</code> → mở Q&amp;A chốt về một số duy nhất!')],
    [mu('C1', en) + ' (PM)', t('<strong>8. Scope &amp; Definition of Ready:</strong> Is this Must-have in scope, approved by lecturer, and sized ≤ 3 days?', '<strong>8. Phạm vi &amp; DoR:</strong> Có thuộc phạm vi Must-have, đã duyệt mockup và vừa cỡ ≤ 3 ngày không?'), t('Fits Iteration MoSCoW + MaxLOC plan; Q&amp;A closed or explicitly flagged; mockup approved.', 'Khớp MoSCoW + MaxLOC của Iteration; Q&amp;A đã đóng hoặc gắn cờ rõ; mockup đã duyệt.'), t('Caught scope creep: "Auto-sync Google Calendar" snuck into <code>S22</code> AC → deferred to Backlog P2!', 'Bắt scope phình: "Tự đồng bộ Google Calendar" lọt vào AC của <code>S22</code> → đẩy về Backlog P2!')]
  ]
)}

<h3>🕵️ ${t('The Hacker\'s Angle: 5-Minute STRIDE-Lite Threat Inspection Before Writing Code', 'Góc kẻ xấu: 5 phút soi mối đe doạ kiểu STRIDE-lite ngay trong buổi review yêu cầu')}</h3>
<p>${t(
    'During your C3 + C5 review pass, spend literally <strong>5 minutes</strong> asking four adversarial questions on every Use Case (adapted from Microsoft\'s STRIDE threat model — zero extra tools needed):',
    'Trong lượt soi của mũ C3 + C5, dành đúng <strong>5 phút</strong> đặt bốn câu hỏi kiểu kẻ tấn công trên từng Use Case (rút gọn từ mô hình đe doạ STRIDE của Microsoft — không cần cài công cụ gì thêm):')}</p>
<ol>
<li>${t('<strong>Identity &amp; Ownership (Spoofing / Elevation):</strong> If User A edits the URL ID or JSON <code>userId</code> to User B\'s ID, or calls an Admin/Manager endpoint with a Student token, does the spec explicitly require HTTP <code>403/404</code>?', '<strong>Danh tính &amp; Sở hữu (Giả mạo / Leo thang quyền):</strong> Nếu User A sửa ID trên URL hay đổi <code>userId</code> trong JSON sang của User B, hoặc dùng token Student gọi API Admin/Manager, đặc tả có ghi rõ chặn HTTP <code>403/404</code> không?')}</li>
<li>${t('<strong>Tampering &amp; Replay:</strong> Can an attacker replay a single-use token (QR code, password-reset link), submit negative numbers, or forge a closed/maintenance resource ID?', '<strong>Sửa đổi &amp; Phát lại (Tampering / Replay):</strong> Kẻ xấu có thể quét lại mã QR / link reset mật khẩu đã dùng, gửi số âm, hoặc giả mạo ID tài nguyên đang bảo trì không?')}</li>
<li>${t('<strong>Repudiation (Audit Trail):</strong> If a Manager accidentally rejects a class booking or an Admin locks an account, does the spec mandate an append-only <code>audit_log</code> entry (who, when, before/after)?', '<strong>Chối bỏ trách nhiệm (Audit Log):</strong> Nếu Manager từ chối nhầm lịch lớp học hoặc Admin khoá nhầm tài khoản, đặc tả có bắt buộc ghi nhật ký <code>audit_log</code> chỉ thêm không sửa (ai, lúc nào, trước/sau) không?')}</li>
<li>${t('<strong>Information Disclosure &amp; Abuse:</strong> Does "Forgot Password" reveal whether an email exists? Does an error message expose SQL/stack traces? Does an AI endpoint leak private lab documents across roles?', '<strong>Rò rỉ thông tin &amp; Lạm dụng:</strong> Tính năng "Quên mật khẩu" có vô tình tiết lộ email nào có tài khoản không? Câu lỗi có làm lộ SQL/stack trace không? Endpoint AI có làm lộ tài liệu nội bộ sang vai không được phép không?')}</li>
</ol>

<h3>${t('4. Using AI as Your "Ruthless Adversarial Reviewer" (Without Breaking the Solo Rule!)', '4. Dùng AI làm "Kẻ phản biện khó tính" (mà KHÔNG vi phạm luật tự làm!)')}</h3>
<p>${t(
    'Remember our mentor law: AI must NEVER write your LabFlow code or invent your requirements from scratch. Where AI shines ethically and powerfully in Chapter 4 is acting as a <strong>hostile C3 Dev + C5 QA reviewer</strong> AFTER you write your own draft! Paste your own 7-row UC + BR + AC and run this exact prompt (adaptable to any project):',
    'Nhớ luật mentor của đồ án: AI KHÔNG viết hộ code LabFlow và không tự bịa yêu cầu từ đầu thay bạn. Chỗ AI phát huy sức mạnh chuẩn mực và cực kỳ đáng giá ở Chương 4 là đóng vai <strong>C3 Dev + C5 QA cực kỳ khó tính</strong> SAU KHI bạn đã tự viết bản nháp! Dán bản UC 7 dòng + BR + AC bạn tự viết và chạy đúng mẫu prompt sau (dùng cho mọi đề tài):')}</p>

${out(t(`PROMPT — ADVERSARIAL 2-HAT REQUIREMENT REVIEW (paste AFTER your own draft!)
---------------------------------------------------------------------------
Do NOT rewrite my specification for me. Act strictly as two skeptical reviewers
inspecting my draft for [Project Name] (UC-12 + BRs + S22 AC):

1. As a Senior Backend/Frontend Dev (C3/C4): list every missing edge case,
   concurrency race condition, illegal state transition, external-service failure,
   or missing UI state that would force me to guess while coding.
2. As a Senior QA Engineer (C5): flag every ambiguous word ("weasel word"),
   untestable AC, boundary gap (< vs <=), missing SM-xx code, or Postcondition
   contradiction against Alternative/Exception flows.

Output ONLY a numbered Defect Table: [ID | Hat | Location | Exact Flaw | Question I must answer].`, `PROMPT — AI PHẢN BIỆN YÊU CẦU 2 MŨ (chỉ dán SAU KHI bạn đã tự viết bản nháp!)
---------------------------------------------------------------------------
TUYỆT ĐỐI KHÔNG viết lại đặc tả hộ tôi. Hãy đóng đúng hai vai phản biện khó tính
soi bản nháp của tôi cho dự án [Tên dự án] (UC-12 + bảng BR + AC màn S22):

1. Dưới vai Senior Dev BE/FE (C3/C4): liệt kê mọi trường hợp biên bị thiếu,
   lỗi tranh chấp đồng thời (race condition), chuyển trạng thái bất hợp lệ,
   sự cố dịch vụ ngoài, hoặc trạng thái UI thiếu khiến dev phải tự đoán lúc code.
2. Dưới vai Senior QA (C5): chỉ ra mọi từ mơ hồ ("từ lươn lẹo"), AC không đo được,
   lỗ hổng biên (< hay <=), thiếu mã SM-xx, hoặc Postcondition mâu thuẫn với
   Alternative/Exception Flow.

CHỈ xuất ra một Bảng lỗi đánh số: [Mã | Mũ | Vị trí | Lỗi chính xác | Câu hỏi tôi phải tự trả lời].`))}

<h3>${t('5. Common Requirement Review Mistakes — and How to Avoid Them', '5. Lỗi hay gặp khi review yêu cầu — và cách tránh')}</h3>
<ul>
<li>${t('<strong>Reviewing 5 minutes after writing (Zero Cooling-Off):</strong> Your brain reads what you <em>intended</em> to write, not what is actually on the page ("author blindness"). Fix: wait at least 2 hours (ideally overnight) before switching from C2 to C3/C5.', '<strong>Vừa viết xong 5 phút đã tự review ngay (không nghỉ ngắt mạch):</strong> Não bạn sẽ đọc thứ bạn <em>định</em> viết chứ không đọc chữ thật trên trang ("mù chữ của tác giả"). Cách tránh: nghỉ tối thiểu 2 tiếng (tốt nhất để sáng hôm sau) mới đổi từ C2 sang C3/C5.')}</li>
<li>${t('<strong>Rubber-stamping ("LGTM — Looks Good To Me"):</strong> Approving a spec with 0 comments found almost always means you skimmed it! Fix: require yourself to find at least 3 concrete questions/improvements per complex UC (or prove why every one of the 8 checklist rows passed).', '<strong>Duyệt lấy lệ ("LGTM — Trông ổn rồi"):</strong> Duyệt một đặc tả mà không tìm ra nổi 1 nhận xét nào gần như chắc chắn là bạn chỉ đọc lướt! Cách tránh: tự đặt mục tiêu soi ra ít nhất 3 điểm cần làm rõ/cải thiện trên mỗi UC phức tạp (hoặc chứng minh từng dòng trong 8 mục checklist đều đạt).')}</li>
<li>${t('<strong>Arguing over coding style instead of requirement gaps:</strong> Turning a requirement review into a debate about Lombok vs. Records wastes the review slot. Fix: park technical design ideas in a separate "Ch.5 Design Notes" list and keep Chapter 4 focused strictly on WHAT &amp; RULES.', '<strong>Tranh cãi chuyện kỹ thuật code thay vì lỗi yêu cầu:</strong> Biến buổi review yêu cầu thành cuộc tranh luận nên dùng Lombok hay Java Record là lạc đề. Cách tránh: ghi tạm ý tưởng kỹ thuật sang mục "Ghi chú Thiết kế Ch.5" và giữ Chương 4 tập trung tuyệt đối vào CÁI GÌ &amp; LUẬT NGHIỆP VỤ.')}</li>
</ul>

${phongVan([
  [t('"As a Developer or QA, what do you look for when reviewing a BA\'s SRS before sprint kickoff?"', '"Là Dev hoặc QA, bạn soi những gì khi review SRS của BA trước khi bắt đầu sprint?"'), t('As a Dev, I look for feasibility, data availability, concurrency &amp; state-transition gaps, external failure fallbacks, and all 5 UI states. As a QA, I hunt ambiguous wording, unclear boundaries (&lt; vs &lt;=), missing error codes (SM-xx), Postcondition contradictions, and missing negative/security ACs — because every ambiguity left unfixed turns into a bug debate two weeks later.', 'Ở góc Dev, mình soi tính khả thi, nguồn dữ liệu, lỗ hổng đồng thời &amp; chuyển trạng thái, phương án khi dịch vụ ngoài lỗi và đủ 5 trạng thái UI. Ở góc QA, mình săn từ ngữ mơ hồ, biên chưa rõ (&lt; hay &lt;=), thiếu mã lỗi (SM-xx), Postcondition mâu thuẫn và thiếu AC phủ định/bảo mật — vì mọi điểm mờ bỏ qua hôm nay sẽ thành cuộc cãi vã bug hai tuần sau.')],
  [t('"How do you handle reviewing your own specs when working solo?"', '"Làm một mình thì bạn review đặc tả của chính mình thế nào cho khách quan?"'), t('Three safeguards: (1) mandatory cooling-off gap (minimum 2 hours / overnight) to break author blindness, (2) structured role-specific checklists (Dev Feasibility + QA Testability + STRIDE-lite security) logged as formal comments, and (3) running an adversarial AI prompt that only lists flaws and questions — never rewriting it for me — so I personally fix every defect.', 'Ba lớp bảo vệ: (1) nghỉ ngắt mạch bắt buộc (tối thiểu 2 tiếng hoặc qua đêm) để phá chứng mù tác giả, (2) dùng checklist tách riêng theo vai (Dev Khả thi + QA Kiểm thử được + bảo mật STRIDE-lite) ghi nhận xét chính thức, và (3) chạy prompt AI đóng vai phản biện chỉ liệt kê lỗ hổng và câu hỏi — không viết hộ — để chính mình sửa từng lỗi.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('On an e-commerce project, a 20-minute C3+C5 cross-review on <code>UC-10 Place Order</code> immediately catches catastrophic bugs before coding: Dev asks "What if Seller changes product price 1 second AFTER Buyer loaded Checkout?" (→ lock price snapshot on order item!); QA asks "What if voucher discount exceeds item subtotal?" (→ floor at 0 VND, never negative charge!); Security asks "Can Buyer edit <code>shippingFee=0</code> in the POST body?" (→ server recalculates totals from DB, never trusts client total!).', 'Trên sàn TMĐT, 20 phút review chéo C3+C5 trên <code>UC-10 Đặt đơn hàng</code> bắt ngay lỗi thảm hoạ trước khi code: Dev hỏi "Nếu Shop đổi giá 1 giây SAU khi Khách mở trang Thanh toán thì sao?" (→ chụp cứng giá tại thời điểm tạo đơn!); QA hỏi "Nếu mã giảm giá lớn hơn tiền hàng thì sao?" (→ chặn sàn 0 đồng, không bao giờ âm tiền!); Bảo mật hỏi "Khách sửa <code>shippingFee=0</code> trong JSON gửi lên thì sao?" (→ server luôn tính lại tổng tiền từ DB, tuyệt đối không tin số từ client!).')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Pair teammates in a cross-review ring before every iteration freeze: Member A writes spec for their 3 screens → Member B (Dev perspective) + Member C (QA perspective) inspect and post comments on CT Work <code>reviews</code> within 24 hours → Member A resolves every comment before C1 merges the SRS update. Every review comment becomes live evidence of real teamwork for the 20% Team grade!', 'Ghép vòng review chéo trước mỗi mốc chốt iteration: Bạn A viết đặc tả cho 3 màn của mình → Bạn B (góc Dev) + Bạn C (góc QA) soi và bình luận trên CT Work <code>reviews</code> trong 24 giờ → Bạn A sửa hết rồi C1 mới gộp vào bản SRS chính. Từng bình luận review đó chính là bằng chứng làm việc nhóm thật cho 20% điểm Team!')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Formal Requirement Inspection follows IEEE 1028 / Fagan Inspection with a Moderator, Author (BA), Dev Lead, QA Lead, and Scribe logging defects in a formal Review Record Excel sheet (Defect Type: Missing / Ambiguous / Incorrect / Inconsistent; Severity: Major / Minor) — specs cannot exit the Requirement Gate until 100% of Major defects are closed.', 'Thẩm định yêu cầu chính thức theo chuẩn IEEE 1028 / Fagan Inspection gồm Người điều phối, Tác giả (BA), Dev Lead, QA Lead và Thư ký ghi lỗi vào phiếu Review Record Excel (Loại lỗi: Thiếu / Mơ hồ / Sai / Mâu thuẫn; Mức độ: Major / Minor) — đặc tả không được qua cổng Yêu cầu khi còn bất kỳ lỗi Major nào chưa đóng.')]
], en)}

${viecLabflow([
  [t('Take a <strong>minimum 2-hour cooling-off break</strong> after writing your specs in Lessons 4.2–4.6. Then open CT Work (<strong>LF #2</strong>) → <code>reviews</code> and start a Requirement Review session for <code>UC-12 Create Reservation</code> + <code>S22</code> + <code>BR-04..06, BR-15..16</code>.', 'Nghỉ ngắt mạch <strong>tối thiểu 2 giờ</strong> sau khi hoàn thành đặc tả ở Bài 4.2–4.6. Sau đó mở CT Work (<strong>LF #2</strong>) → trang <code>reviews</code> và tạo phiên Review Yêu cầu cho <code>UC-12 Create Reservation</code> + <code>S22</code> + <code>BR-04..06, BR-15..16</code>.'), t('Review session exists on CT Work <code>reviews</code> linking the exact SRS doc / Req card.', 'Phiên review nằm trên trang <code>reviews</code> CT Work có gắn link tới đúng tài liệu SRS / thẻ Req.')],
  [t('Switch profiles through <strong>Green (C3 Dev BE)</strong>, <strong>Amber (C4 Dev FE)</strong>, and <strong>Red (C5 QA)</strong> and run the 8-question Dual Interrogation Checklist + 4 STRIDE-lite checks (plus optionally the Adversarial AI Reviewer prompt). Log every defect/question as comments under C3/C4/C5, then switch back to <strong>Sky Blue (C2 BA)</strong> to fix them and mark them Resolved!', 'Đổi profile lần lượt qua <strong>Xanh lá (C3 Dev BE)</strong>, <strong>Vàng cam (C4 Dev FE)</strong> và <strong>Đỏ (C5 QA)</strong> rồi chạy trọn Bộ câu hỏi tra vấn 8 dòng + 4 câu soi STRIDE-lite (có thể chạy thêm prompt AI phản biện). Ghi mọi lỗi/câu hỏi dạng bình luận dưới đúng tài khoản C3/C4/C5, sau đó đổi lại <strong>Xanh dương (C2 BA)</strong> để sửa dứt điểm và đánh dấu Đã xử lý!'), t('Either ≥ 4 real requirement defects caught &amp; resolved BEFORE coding (on your own draft or on the Practice Buggy Spec in Lab 4.8) OR complete pass evidence logged for every one of the 8 checklist rows + 4 STRIDE-lite checks on a clean draft, verified closed under C5/C1.', 'Bắt &amp; sửa ≥ 4 lỗi yêu cầu thật TRƯỚC khi code (trên bản nháp của bạn hoặc trên Đoạn nháp luyện bắt lỗi ở Lab 4.8) HOẶC ghi đủ bằng chứng kiểm đạt cho trọn 8 mục checklist + 4 câu STRIDE-lite trên bản nháp sạch, được C5/C1 xác nhận đóng.')]
], en)}

${thuatNgu([
  ['Three Amigos (Bộ ba BA + Dev + QA)', t('Collaborative pre-development review combining Business (WHAT), Development (HOW/Feasibility), and QA (Testability/Edge Cases) to eliminate ambiguity before coding.', 'Buổi soi chung trước khi code kết hợp Nghiệp vụ (CÁI GÌ), Phát triển (KHẢ THI) và QA (KIỂM THỬ ĐƯỢC) nhằm triệt tiêu sự mơ hồ.')],
  ['Fagan Inspection (Thẩm định Fagan)', t('Structured, checklist-driven peer inspection introduced by Michael Fagan (IBM, 1976) that catches 60%+ defects before code execution.', 'Quy trình thẩm định đồng cấp có cấu trúc và checklist do Michael Fagan đề xuất (IBM, 1976), bắt trên 60% lỗi trước khi chạy code.')],
  ['Author Blindness (Chứng mù tác giả)', t('Cognitive bias where writers read what they meant to say instead of the flaws actually written — broken by cooling-off breaks and role checklists.', 'Thiên kiến nhận thức khiến tác giả đọc ra ý mình định viết thay vì lỗi thật trên giấy — phá vỡ bằng nghỉ ngắt mạch và checklist theo vai.')],
  ['Weasel Words (Từ lươn lẹo / mơ hồ)', t('Unmeasurable qualifiers like "fast", "reasonable", "user-friendly", "valid", "etc." that hide missing requirements and cause test disputes.', 'Các từ không đo được như "nhanh", "hợp lý", "thân thiện", "hợp lệ", "v.v." che giấu yêu cầu thiếu và gây tranh cãi khi test.')],
  ['STRIDE-Lite Spec Review', t('A 5-minute adversarial security pass on requirements checking Identity/Ownership, Tampering/Replay, Auditability, and Information Disclosure before design.', 'Lượt soi bảo mật 5 phút trên đặc tả kiểm tra Danh tính/Sở hữu, Giả mạo/Phát lại, Audit và Rò rỉ thông tin ngay trước khâu thiết kế.')]
], en)}

${tomTat([
  t('Inspecting requirements before coding yields up to 100x rework savings (Boehm &amp; Basili, 2001) and catches 60%+ defects early (Fagan, 1976).', 'Review yêu cầu trước khi code tiết kiệm tới 100 lần công sửa lỗi sau phát hành (Boehm &amp; Basili, 2001) và bắt sớm trên 60% lỗi (Fagan, 1976).'),
  t('Always take a ≥ 2-hour cooling-off break after wearing hat C2, then rotate systematically through C3/C4 (Dev Feasibility), C5 (QA Testability &amp; Consistency), and C1 (PM Definition of Ready).', 'Luôn nghỉ ngắt mạch ≥ 2 giờ sau khi rời mũ C2, rồi xoay vòng lần lượt qua C3/C4 (Dev Khả thi), C5 (QA Kiểm được &amp; Nhất quán) và C1 (PM Definition of Ready).'),
  t('Spend 5 minutes on STRIDE-lite security questions during every requirement review to kill BOLA/IDOR, replay, and audit gaps before a single line of code is written.', 'Dành 5 phút cho 4 câu hỏi bảo mật STRIDE-lite trong mỗi buổi review yêu cầu để diệt sớm BOLA/IDOR, phát lại token và thiếu audit trước khi gõ một dòng code nào.'),
  t('Use AI as a hostile C3/C5 Defect Hunter on your OWN draft — never to replace your own thinking or write specs/code for you.', 'Dùng AI làm kẻ săn lỗi C3/C5 khó tính trên bản nháp BẠN TỰ VIẾT — không bao giờ dùng AI để nghĩ hộ hay viết hộ đặc tả/code.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-4-lab', t('4.8 — Lab: Build &amp; Cross-Review a Complete BA Requirements Pack on CT Work', '4.8 — Lab: Hoàn thiện &amp; Review chéo trọn bộ Yêu cầu trên CT Work'))}.</p>
`);
};

export default {
  title: '4.7 — Cross-Role Requirement Review: Dev "Buildable?", QA "Testable?"|||4.7 — Review chéo yêu cầu: Dev hỏi "làm được không", QA hỏi "kiểm được không"',
  slug: 'dm5-4-7-review-cheo-yeu-cau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quy trình Review chéo yêu cầu 4 bước trên CT Work reviews/ xoay đủ 5 mũ (C2 BA → Nghỉ ngắt mạch → C3/C4 Dev Khả thi → C5 QA Kiểm được → C1 PM DoR): dẫn chứng Fagan 1976 & Boehm/Basili 2001 (100x), bộ câu hỏi tra vấn 8 dòng, 5 phút bảo mật STRIDE-lite và mẫu prompt AI đóng vai phản biện.',
  content: L47(true) + L47(false),
};
