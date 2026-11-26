/**
 * 11.4 — Rubric tự chấm & buổi tổng duyệt (dm5-11-4-rubric-tong-duyet).
 * Nguồn chính: ngu-canh/sep490/10-Thuyet-trinh-va-Bao-ve.md §4.3, §6, §7 và ngu-canh/labflow-ai.md (mục Luật chấm SWP391 & Chuẩn bị bảo vệ).
 * KHÔNG lặp nguyên bảng 22 lỗi 1-phút của SWP391 P.5 hay Moc 5 (tóm 1–2 câu + dẫn link);
 * tập trung vào: phân biệt rạch ròi thang chấm SWP391 (20/40/20/20, cổng ≥ 5) với SEP490 (hỏi thầy thang thật, không mặc định gộp),
 * bảng Rubric tự chấm 10 điểm có mốc phân tầng 5–6 / 7 / 8–9 điểm, quy trình Tổng duyệt 3 vòng R1–R3 có số liệu sửa lỗi (Defect),
 * bằng chứng sức mạnh của checklist từ y khoa (WHO Surgical Safety Checklist — Haynes et al., NEJM 2009 · Atul Gawande 2009),
 * bảng kiểm ngày D−1 và ngày D, cùng góc "cờ đỏ chết người" trước hội đồng.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L114 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 11 · Lesson 11.4', 'Chương 11 · Bài 11.4', `
<h2>${t('11.4 — Self-Grading Rubric &amp; The 3-Round Dress Rehearsal (R1–R3)', '11.4 — Rubric tự chấm &amp; buổi tổng duyệt')}</h2>
<p class="lead">${t(
    'Most students walk into their defense with only a vague feeling — "I think our app works pretty well" — and discover <em>inside the grading room</em> that their slides run 7 minutes over time, their screen names disagree with Report 7, or a single missing evidence tab drops their score from 8.5 to 6.5. Top engineering teams never guess their score on game day: they grade themselves ruthlessly under hat ',
    'Đa số sinh viên bước vào phòng bảo vệ với một cảm giác mơ hồ — "chắc app mình chạy ổn rồi" — rồi mới ngã ngửa <em>ngay trước mặt hội đồng</em> khi slide lố 7 phút, tên màn hình lệch Report 7, hoặc loay hoay không mở nổi bằng chứng khiến điểm tụt từ 8,5 xuống 6,5. Những đội kỹ thuật giỏi không bao giờ đoán mò điểm vào ngày thi: họ tự chấm khắt khe dưới mũ ')}${mu('C5', en)}${t(
    ' using a structured <strong>10-Point Practice Self-Grading Rubric</strong> and run a structured <strong>3-Round Dress Rehearsal (R1 → R2 → R3)</strong> backed by a D−1 / Day-D pre-flight checklist.',
    ' bằng <strong>Rubric tự chấm luyện tập 10 điểm</strong> và chạy đủ <strong>3 vòng Tổng duyệt (R1 → R2 → R3)</strong> kèm bảng kiểm tiền bay D−1 và Ngày D.')}</p>

<h3>${t('Everyday picture: why a 19-item surgical checklist cut deaths nearly in half', 'Liên tưởng đời thường: vì sao bảng kiểm 19 dòng trong phòng mổ giảm gần một nửa ca tử vong')}</h3>
<p>${t(
    'In 2007–2008, the World Health Organization tested a simple 19-item <strong>Surgical Safety Checklist</strong> across eight hospitals worldwide (published by <strong>Haynes et al., <em>New England Journal of Medicine</em>, January 2009</strong>; popularized by surgeon <strong>Atul Gawande in <em>The Checklist Manifesto</em>, 2009</strong>). Even veteran surgeons skipped tiny routine checks under stress — and adding a mandatory pre-flight checklist reduced major surgical complications from 11.0% to 7.0% and inpatient deaths from 1.5% to 0.8%. Defense day puts your brain under the exact same adrenaline pressure: a written rubric and 3 staged rehearsals catch "stupid" 1-point leaks while you still have calm daylight to fix them.',
    'Giai đoạn 2007–2008, Tổ chức Y tế Thế giới (WHO) thử nghiệm một <strong>Bảng kiểm An toàn Phẫu thuật</strong> vỏn vẹn 19 dòng tại 8 bệnh viện toàn cầu (công bố bởi <strong>Haynes và cộng sự, <em>New England Journal of Medicine</em>, tháng 1/2009</strong>; được bác sĩ <strong>Atul Gawande</strong> kể lại trong cuốn <em>The Checklist Manifesto</em>, 2009). Ngay cả bác sĩ mổ lão luyện vẫn bỏ sót thao tác cơ bản khi căng thẳng — và chỉ nhờ bảng kiểm bắt buộc, tỉ lệ biến chứng lớn giảm từ 11,0% xuống 7,0%, tử vong nội viện giảm từ 1,5% xuống 0,8%. Ngày bảo vệ đặt não bạn dưới áp lực adrenaline y hệt vậy: một bảng rubric rõ ràng và 3 vòng tổng duyệt có chủ đích sẽ bắt sạch những lỗi mất 1–2 điểm oan uổng trước khi bước vào phòng chấm.')}</p>

<p>${t(
    'Note on avoiding duplication: for the 1-minute per-deliverable pre-mortem table and the 5-person team rehearsal milestone in SWP391, review ',
    'Lưu ý không trùng lặp: để xem bảng tự soát 1 phút cho từng deliverable và mốc tổng duyệt nhóm 5 người của SWP391, hãy xem lại ')}${ac('software-development-project', 'swp391-p-5-loi-mat-diem', 'SWP391 P.5 — Nhóm mất điểm ở đâu')}${t(' and ', ' và ')}${ac('software-development-project', 'swp391-moc-5', 'SWP391 Mốc 5 — Tổng duyệt Final Presentation')}${t(
    '. Below we define one unified <strong>5–6 vs. 7 vs. 8–9 practice self-grading rubric</strong> (reused identically in Lab 11.6), separate SWP391 vs. SEP490 grading rules cleanly, and lay out the <strong>solo 3-round rehearsal protocol (R1–R3)</strong>.',
    '. Dưới đây ta dùng một <strong>Rubric tự chấm luyện tập thống nhất</strong> (dùng lại y hệt ở Lab 11.6) phân tầng 5–6 · 7 · 8–9 điểm, tách rạch ròi luật chấm SWP391 với SEP490 và triển khai <strong>quy trình tổng duyệt 3 vòng R1–R3 cho người làm một mình</strong>.')}</p>

<h3>${t('1. Know Your Exact Grading Structure First — SWP391 vs. SEP490', '1. Nắm chắc thang điểm thật TRƯỚC khi tự chấm — phân biệt SWP391 với SEP490')}</h3>
<ul>
<li>${t('<strong>SWP391 Final Presentation (40% of course grade, pass gate ≥ 5/10 independent of iteration OG):</strong> Two examiners (not your class lecturer) evaluate your <code>iter3</code> release across four weights: <strong>Team Working 20%</strong> · <strong>Software Product / Implementation 40%</strong> · <strong>Requirement Analysis 20%</strong> · <strong>Software Design 20%</strong>. Always double-check your semester\'s current syllabus with your lecturer.', '<strong>Final Presentation SWP391 (40% điểm môn, cổng qua môn riêng ≥ 5/10 độc lập với điểm các iteration):</strong> Hai giảng viên khác (không phải GV lớp) chấm bản <code>iter3</code> theo bốn trọng số: <strong>Làm việc nhóm 20%</strong> · <strong>Sản phẩm &amp; Cài đặt 40%</strong> · <strong>Phân tích yêu cầu 20%</strong> · <strong>Thiết kế phần mềm 20%</strong>. Luôn kiểm lại syllabus học kỳ hiện tại với GV lớp.')}</li>
<li>${t('<strong>SEP490 Capstone Defense:</strong> ⚠️ <strong>Do NOT blindly assume SWP391\'s 20/40/20/20 weights apply to SEP490!</strong> Capstone committee composition, exact duration, language, and rubric weights vary by department and semester — ask your supervisor right at Week 19. However, every strong capstone committee grades the exact same <strong>5 universal engineering pillars</strong> below — plus research evaluation rigor (baselines, datasets, error margins) for v2 AI/IoT.', '<strong>Bảo vệ đồ án tốt nghiệp SEP490:</strong> ⚠️ <strong>KHÔNG mặc định áp trọng số 20/40/20/20 của SWP391 sang SEP490!</strong> Thành phần hội đồng, thời lượng, ngôn ngữ và trọng số điểm SEP490 có thể đổi theo từng kỳ/bộ môn — phải hỏi GV hướng dẫn ngay từ Tuần 19. Tuy nhiên, mọi hội đồng tốt nghiệp đều xoay quanh <strong>5 trụ cột kỹ thuật phổ quát</strong> dưới đây — cộng thêm độ chặt đánh giá nghiên cứu (baseline, tập eval, sai số) cho trụ AI/IoT v2.')}</li>
</ul>

<h4>${t('Unified 10-Point Self-Grading Rubric (Author-Defined Practice Scale — NOT an Official School Scale)', 'Bảng Rubric tự chấm 10 điểm thống nhất (Thang tự đặt để luyện tập — KHÔNG phải thang chấm chính thức của trường)')}</h4>
<p>${t('This single 10-point rubric is used across both Lesson 11.4 and Lab 11.6. Its weights are <strong>course practice weights</strong> (NOT an official university scale), mapped transparently to SWP391\'s <code>Team 20% / Product 40% / Requirement 20% / Design 20%</code> so you can self-diagnose without confusing it with your department\'s actual sheet:', 'Bảng Rubric 10 điểm duy nhất này dùng chung cho cả Bài 11.4 và Lab 11.6. Đây là <strong>thang tự đặt của khoá để luyện tập, KHÔNG phải thang chấm chính thức của trường</strong>, có cột quy đổi minh bạch sang bốn nhóm <code>Team 20% / Product 40% / Requirement 20% / Design 20%</code> của SWP391:')}</p>
${bang(
  [t('Pillar (Owner Hat)', 'Trụ cột (Mũ kiểm)'), t('SWP391 Mapping', 'Quy đổi SWP391'), t('5–6 pts (Bare Pass)', '5–6 điểm (Vừa qua)'), t('7 pts (Solid)', '7 điểm (Khá)'), t('8–9+ pts (Distinction Target)', '8–9+ điểm (Mục tiêu xuất sắc)'), t('Self Score', 'Tự chấm')],
  [
    [t('<strong>1. Requirement, Report 7 &amp; RTM (2 pts)</strong><br>', '<strong>1. Yêu cầu, Report 7 &amp; RTM (2 đ)</strong><br>') + `${mu('C2', en)}`, t('Requirement<br>(20%)', 'Requirement<br>(20%)'), t('Use cases listed, some missing alt/exception flows; several unconfirmed rules.', 'Có danh sách UC nhưng thiếu luồng thay thế/ngoại lệ; nhiều luật tự bịa chưa hỏi GV.'), t('Clean SRS/RDS, confirmed BR-xx, screen flow matches UI, honest Limitations.', 'SRS/RDS sạch, BR-xx có xác nhận, screen flow khớp UI, Limitations trung thực.'), t('100% parity across SRS ↔ UI ↔ Slide ↔ Report 7 (0/6 dossier traps); bidirectional <strong>RTM has 0 gaps</strong>; every BR traces to Q&amp;A card + automated test.', 'Khớp 100% SRS ↔ UI ↔ Slide ↔ Report 7 (0/6 bẫy hồ sơ); <strong>RTM hai chiều 0 lỗ hổng</strong>; mọi BR truy ra thẻ Q&amp;A + test tự động.'), '___ / 2'],
    [t('<strong>2. Architecture &amp; Design (2 pts)</strong><br>', '<strong>2. Kiến trúc &amp; Thiết kế (2 đ)</strong><br>') + `${mu('C3', en)}`, t('Design<br>(20%)', 'Design<br>(20%)'), t('Basic CRUD schema; diagrams partially stale vs. real code; "we chose it because popular".', 'Schema CRUD cơ bản; sơ đồ lệch một phần so với code; giải thích kiểu "vì phổ biến".'), t('ERD matches Flyway SQL, clean package boundaries, every coded UC has Class + Sequence diagram.', 'ERD khớp Flyway SQL, ranh giới package sạch, mọi UC đã code có đủ Class + Sequence.'), t('Documented <strong>ADR trade-offs</strong> (Modular Monolith, pgvector, MQTT), DB-level concurrency invariant (<code>EXCLUDE USING gist</code>), clean state machines enforced at backend.', 'Có <strong>ADR nêu rõ đánh đổi</strong> (Modular Monolith, pgvector, MQTT), ràng buộc chống trùng tại DB (<code>EXCLUDE USING gist</code>), state machine ép chặt ở backend.'), '___ / 2'],
    [t('<strong>3. Live Product, Demo, Plan B &amp; Code Ownership (2.5 pts)</strong><br>', '<strong>3. Sản phẩm sống, Demo, Plan B &amp; Làm chủ code (2,5 đ)</strong><br>') + `${mu('C4', en)}`, t('Product<br>(25% of 40%)', 'Product<br>(25% trong 40%)'), t('Happy path runs; crashes on empty input or needs manual DB tweak; slow to explain code.', 'Chạy được đường đúng; nhập rỗng lỗi hoặc phải sửa tay DB; lúng túng khi mở code.'), t('Clean tagged build, 1-command DB seed, happy + unhappy paths pass, explains own code cleanly.', 'Chạy từ tag sạch, 1 lệnh reset DB, đường đúng + đường lỗi đều chạy, giải thích code rõ.'), t('Live <strong>failure paths</strong> (≥ 2 live failures) + passes <strong>3-min live code edit</strong> across BE/FE/test cleanly + offline Plan-B video (SSD &amp; USB) switching in ≤ 30s with honest pre-recorded disclosure.', 'Demo sống <strong>đường lỗi</strong> (≥ 2 ca lỗi thật) + qua bài <strong>sửa code sống 3 phút</strong> đủ BE/FE/test + video Plan B offline (SSD &amp; USB) chuyển ≤ 30 giây kèm nói rõ bản quay sẵn.'), '___ / 2.5'],
    [t('<strong>4. Verification, Test Metrics &amp; Research Rigor (1.5 pts)</strong><br>', '<strong>4. Kiểm thử, Số đo &amp; Nghiên cứu (1,5 đ)</strong><br>') + `${mu('C5', en)}`, t('Product<br>(15% of 40%)', 'Product<br>(15% trong 40%)'), t('Manual happy-path test list only; vague claims ("fast", "accurate").', 'Chỉ có danh sách bấm tay happy path; tuyên bố mơ hồ ("nhanh", "chính xác").'), t('4 test levels documented (UT/IT/ST/UAT), Round 1→3 defects closed, JaCoCo report openable.', 'Đủ 4 cấp test (UT/IT/ST/UAT), lỗi Round 1→3 đã đóng, mở được báo cáo JaCoCo.'), t('Reproducible 1-command concurrency + security + AI/IoT evals with dataset version, sample size <code>n</code>, rule baseline comparison, and honest limits.', 'Chạy lại bằng 1 lệnh test concurrency + bảo mật + eval AI/IoT kèm version dataset, cỡ mẫu <code>n</code>, so với rule baseline và giới hạn trung thực.'), '___ / 1.5'],
    [t('<strong>5. Process, R1–R3 Delivery, Q&amp;A &amp; Integrity (2 pts)</strong><br>', '<strong>5. Quy trình, Tổng duyệt R1–R3, Q&amp;A &amp; Trung thực (2 đ)</strong><br>') + `${mu('C1', en)}`, t('Team Working<br>(20%)', 'Team Working<br>(20%)'), t('Overruns time limit; reads slides aloud; defensive or evasive about AI/solo work.', 'Lố giờ; đọc nguyên văn slide; vòng vo khi bị hỏi về dùng AI hay làm một mình.'), t('On time (≤ 15 min), clean Assertion–Evidence slides, honest Tracking/Weekly/AI logs.', 'Đúng giờ (≤ 15 phút), slide Khẳng định–Bằng chứng rõ, Tracking/Weekly/AI log đầy đủ.'), t('R2 recorded (Demo ≤ 5:15, total ≤ 14:30), R3 personal hotspot, 40s <strong>PREP reflex</strong> opening proof from 6-tab cockpit in ≤ 10s, transparent solo 5-hat &amp; AI disclosure, 0/8 red flags.', 'Ghi hình R2 (Demo ≤ 5:15, tổng ≤ 14:30), R3 hotspot riêng, phản xạ <strong>PREP 40 giây</strong> mở bằng chứng 6 tab ≤ 10 giây, minh bạch 1 người 5 vai &amp; AI, 0/8 cờ đỏ.'), '___ / 2']
  ]
)}

<h3>${t('2. The 3-Round Solo Dress Rehearsal Protocol (R1 → R2 → R3)', '2. Quy trình Tổng duyệt 3 vòng cho người làm một mình (R1 → R2 → R3)')}</h3>
<p>${t('Never try to fix slides, timing, Q&amp;A, and hardware in one chaotic rehearsal on the night before defense! Split rehearsal into <strong>three purpose-built rounds</strong> anchored relative to your <strong>actual Defense Day D</strong> (scheduled by your department — NOT necessarily the report submission day!), treating every glitch caught as a real <code>Defect</code> ticket on CT Work:', 'Đừng bao giờ gom sửa slide, bấm giờ, luyện hỏi đáp và thử phần cứng vào một buổi tập hỗn loạn đêm trước ngày thi! Tách tổng duyệt thành <strong>ba vòng chuyên biệt</strong> neo theo <strong>Ngày bảo vệ thật D</strong> (do bộ môn xếp — KHÔNG nhất thiết trùng ngày nộp hồ sơ!), và mọi lỗi bắt được đều mở thẻ <code>Defect</code> thật trên CT Work để xử lý dứt điểm:')}</p>

<pre><code>  THE 3-ROUND DRESS REHEARSAL FUNNEL (Anchored Relative to True Defense Day D)
  ======================================================================================
  [ROUND 1 — CONTENT &amp; PARITY]  Hat: C2 + C5
    Goal:  Verify EVERY slide claim matches Report 7 AND runs on the final Git tag + clean DB.
    Check: Zero ghost screens? Every number has source/footer? Failure paths actually trigger?
    Exit:  Log every discrepancy as a CT Work Defect -&gt; fix slides/docs/seed -&gt; freeze Slide v1.1.
                                         |
                                         v
  [ROUND 2 — TIMED + ADVERSARIAL Q&amp;A]  Hat: C1 + C5 (RECORD VIDEO!)
    Goal:  Full 15-min timed run + 10 randomized panel questions (2 per hat) + 3-min live edit.
    How:   Ask a classmate/friend OR use CT Work AI Defense Practice to throw surprise questions.
           Record your own screen + audio, watch back and mark every "umm / &gt;40s / no evidence" spot!
    Exit:  Demo starts &lt;= 5:15; total &lt;= 14:30; 100% answers &lt;= 40s with &lt;= 10s cockpit proof.
                                         |
                                         v
  [ROUND 3 — REAL-WORLD CONDITIONS (TRUE D-1)]  Hat: C3 + C4 + C5
    Goal:  Exact laptop, exact HDMI adapter, PERSONAL 4G/5G HOTSPOT (NO home Wi-Fi!),
           real ESP32 + power bank + demo phone HTTPS QR + intentional failure drill!
    Test:  Deliberately kill AI gateway (Step 6) AND practice switching to offline Plan-B video
           in &lt;= 30 seconds from USB/SSD (announcing clearly it is pre-recorded).
    Exit:  D-1 Pre-Flight Checklist 100% GREEN -&gt; SLEEP 8 HOURS!</code></pre>

${bang(
  [t('Rehearsal Round', 'Vòng tổng duyệt'), t('SWP391 Schedule (10-Week Track)', 'Lịch SWP391 (Lộ trình 10 tuần)'), t('SEP490 Schedule (20-Week Track)', 'Lịch SEP490 (Lộ trình 20 tuần)')],
  [
    [t('<strong>R1 — Content &amp; Parity</strong>', '<strong>R1 — Nội dung &amp; Khớp số</strong>'), t('<strong>Week 9</strong> (after feature freeze; verify Template7 slides &amp; 3 core flows against iter3 candidate)', '<strong>Tuần 9</strong> (sau feature freeze; đối chiếu slide Template7 &amp; 3 luồng lõi trên bản chuẩn bị iter3)'), t('<strong>Day 136</strong> (Wed, Week 20 — right after Report 7 is frozen on Days 134–135)', '<strong>Ngày 136</strong> (T4, Tuần 20 — ngay sau khi chốt Report 7 ở Ngày 134–135)')],
    [t('<strong>R2 — Timed + Q&amp;A</strong>', '<strong>R2 — Bấm giờ + Hỏi vặn</strong>'), t('<strong>Week 10</strong> (timed 15′ run + ask another group/friend to grill Q&amp;A)', '<strong>Tuần 10</strong> (chạy bấm giờ 15′ + nhờ nhóm khác/bạn hỏi vặn)') , t('<strong>Day 137</strong> (Thu, Week 20 — full recorded run + 5-hat Q&amp;A; re-run shortened R2 if D is later)', '<strong>Ngày 137</strong> (T5, Tuần 20 — chạy ghi hình đủ + Q&amp;A 5 mũ; chạy lại R2 rút gọn nếu ngày D xa hơn)')],
    [t('<strong>R3 — Real Conditions</strong>', '<strong>R3 — Điều kiện thật</strong>'), t('<strong>True D−1</strong> (day before SWP-Final ~19/12, on exact demo laptop + hotspot)', '<strong>Đúng D−1</strong> (trước ngày bảo vệ SWP-Final ~19/12, trên đúng laptop + hotspot thật)'), t('<strong>Day 138 or True D−1</strong> (Day 139 is dossier submission; if department schedules Defense Day D later, move R3 to true D−1!)', '<strong>Ngày 138 hoặc đúng D−1</strong> (Ngày 139 là hạn nộp hồ sơ; nếu bộ môn xếp ngày bảo vệ D muộn hơn thì dời R3 về đúng D−1!)')]
  ]
)}

<h3>${t('3. The D−1 &amp; Day-D Pre-Flight Checklist (Zero Surprises in the Room)', '3. Bảng kiểm Tiền bay Ngày D−1 &amp; Ngày D (Không còn bất ngờ trong phòng chấm)')}</h3>
${out(`[D-1 EVENING — FREEZE & PACK]
[ ] Final Git tag checked out cleanly (git status = clean); ZERO merges after tag!
[ ] 1-command DB restore tested on EMPTY database; all 6 demo role accounts log in cleanly
[ ] Plan-B offline backup video (timestamped) verified on BOTH laptop SSD and physical USB
[ ] Presentation.pptx + Presentation.pdf opened & checked on a second machine
[ ] (SEP490 v2) ESP32 + sensors + cables + power bank packed; simulator verified locally
[ ] Personal 4G/5G hotspot tested with MQTT + demo smartphone HTTPS QR scan
[ ] AI gateway reachable AND exact fallback toggle tested cleanly
[ ] 6-Tab Evidence Cockpit bookmarked (Report 7 PDF, Tracking+RTM, CT Work, IDE, Test/Eval, GitHub)

[DAY D — 30 MINUTES BEFORE SLOT]
[ ] Arrive early -> test projector HDMI + resolution + charger plugged in + hotspot active
[ ] docker compose up -> /actuator/health = UP; pre-stage browser profiles + MailTrap + terminal
[ ] Turn ON Do Not Disturb (kill chat/OS updates/popups); close .env and personal tabs
[ ] Print/open 1-page Run-Sheet + notebook & pen to jot examiner questions during Q&A

[AFTER DEFENSE — CLOSING THE LOOP]
[ ] Log every examiner question + weak answer in final Weekly Report / Retrospective (feeds Ch. 12!)`)}

<h3>🕵️ ${t('The red-flag audit: 8 Common Score-Killers Examiners Spot Immediately', 'Góc cảnh báo đỏ: 8 "cờ đỏ" thường gặp khiến điểm tụt mạnh trước hội đồng')}</h3>
<p>${t('Before signing off Round 3, check your entire presentation against these 8 common red-flag warnings (compiled from defense checklists and practical guidance, not formal statistics) — triggering even ONE can sharply pull down an otherwise strong project:', 'Trước khi chốt Vòng 3, soi toàn bộ bài bảo vệ qua 8 cờ đỏ thường gặp (kinh nghiệm và gợi ý chuẩn bị bảo vệ, không phải số liệu thống kê) — dính dù chỉ MỘT lỗi cũng có thể làm tụt điểm mạnh dù sản phẩm tốt:')}</p>
<ol>
<li>${t('<strong>Slide promises features that do not exist in the tagged build</strong> (or ERD drawn by hand differs from Flyway migrations).', '<strong>Slide vẽ tính năng/màn hình chưa làm trong bản tag</strong> (hoặc ERD vẽ tay lệch với file migration thật).')}</li>
<li>${t('<strong>Unverifiable claims:</strong> "90% coverage", "AI 95% accurate", "CI/CD pipeline" with no openable report, sample size <code>n</code>, or commit hash.', '<strong>Tuyên bố không có bằng chứng:</strong> "coverage 90%", "AI chính xác 95%", "có CI/CD" mà không mở được báo cáo, cỡ mẫu <code>n</code> hay commit.')}</li>
<li>${t('<strong>"Research" with zero baseline comparison:</strong> Claiming an ML anomaly detector works without comparing precision/recall/F1 against a simple rule baseline on the same data split.', '<strong>Gọi là "nghiên cứu" nhưng không có baseline so sánh:</strong> Khoe model phát hiện bất thường mà không so precision/recall/F1 với rule baseline trên cùng tập dữ liệu.')}</li>
<li>${t('<strong>Editing DB rows by hand mid-demo</strong> or typing long fake forms live while the clock ticks down.', '<strong>Sửa tay dữ liệu DB giữa buổi demo</strong> hoặc vừa demo vừa gõ từng dòng form dài làm cháy giờ.')}</li>
<li>${t('<strong>Demoing from an unmerged local branch</strong> instead of the submitted release tag.', '<strong>Demo từ nhánh local chưa merge</strong> thay vì đúng bản tag đã nộp.')}</li>
<li>${t('<strong>IoT/AI demo totally dependent on auditorium Wi-Fi</strong> with zero hotspot, simulator, or 30-second Plan-B video.', '<strong>Demo IoT/AI phụ thuộc hoàn toàn vào Wi-Fi hội trường</strong> mà không có hotspot riêng, simulator hay video Plan B 30 giây.')}</li>
<li>${t('<strong>Blurring "already built" with "future work"</strong> so examiners feel misled about real scope.', '<strong>Nói mập mờ giữa thứ "đã làm xong" và "hướng phát triển"</strong> khiến hội đồng thấy bị đánh tráo khái niệm.')}</li>
<li>${t('<strong>Leaving classic Report 1–6 errors inside Report 7</strong> (wrong UC template, missing Sequence diagrams, missing 4 test levels) that examiners spot when flipping the PDF during Q&amp;A.', '<strong>Để lọt các lỗi cũ của Report 1–6 vào Report 7</strong> (UC sai khung, thiếu Sequence diagram, thiếu 4 cấp test) để hội đồng lật PDF ra bắt ngay lúc hỏi đáp.')}</li>
</ol>

${phongVan([
  [t('"How do you verify a product release is truly ready for a high-stakes stakeholder review or Go-Live?"', '"Bạn làm thế nào để chắc chắn một bản phát hành thật sự sẵn sàng trước buổi duyệt quan trọng với khách hàng hay ngày Go-Live?"'), t('I rely on checklists and staged dry runs instead of gut feeling: first a content/parity check reconciling docs with the frozen release tag, second a timed run-through with adversarial Q&A recorded for self-critique, and third a realistic environment rehearsal on the exact network/hardware with an explicit 30-second fallback plan — logging every gap as a tracked defect until zero red flags remain.', 'Em dựa vào bảng kiểm và diễn tập theo vòng thay vì cảm tính: vòng một đối soát nội dung và số liệu giữa tài liệu với bản tag đã chốt, vòng hai chạy bấm giờ kèm hỏi vặn ghi hình lại để tự soi lỗ hổng, và vòng ba chạy trên đúng hạ tầng/mạng thật kèm phương án dự phòng 30 giây — ghi mọi lỗi thành thẻ defect xử lý sạch trước giờ G.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Run R1–R3 on your marketplace: R1 verifies checkout/refund rules match Report 7 &amp; RTM; R2 times your 15-min slot + grills you on overselling race conditions &amp; Seller BOLA; R3 tests the live sandbox payment callback over your personal 4G hotspot + verifies your 30-second Plan-B video if the sandbox API throttles.', 'Chạy R1–R3 cho sàn TMĐT: R1 đối soát luật thanh toán/hoàn tiền khớp Report 7 &amp; RTM; R2 bấm giờ 15 phút + luyện hỏi xoáy về tranh chấp tồn kho &amp; lỗ hổng BOLA giữa các shop; R3 chạy thử webhook thanh toán sandbox qua hotspot 4G cá nhân + kiểm video Plan B 30 giây phòng cổng sandbox bị giới hạn.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('R1–R3 are even MORE critical with 5 speakers: R1 ensures nobody contradicts another teammate\'s numbers; R2 times handoffs between all 5 speakers (target &lt; 5 seconds per handoff!) and exposes any silent/unprepared member 48 hours early; R3 runs all 5 slices on ONE shared presentation laptop with zero cable swaps.', 'R1–R3 còn sống còn hơn với nhóm 5 người: R1 bảo đảm năm người không nói số liệu đá nhau; R2 bấm giờ chuyển mic giữa năm người (dưới 5 giây/lượt!) và phát hiện sớm thành viên nào chưa nắm code trước 48 giờ; R3 chạy cả năm phần trên CÙNG MỘT laptop thuyết trình không đổi cáp.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Major enterprise launches run formal <strong>Go-Live Dress Rehearsals</strong> and <strong>Executive Dry Runs</strong> (often 2–3 rehearsals before a Steering Committee or Tier-1 client demo), scoring readiness against a strict Go/No-Go checklist inspired by aviation and surgical safety checklists so no avoidable outage happens in front of C-level executives.', 'Các dự án lớn chạy <strong>Go-Live Dress Rehearsal</strong> và <strong>Executive Dry Run</strong> (thường 2–3 vòng tập trước buổi báo cáo Ban lãnh đạo hoặc khách hàng Tier-1), chấm sẵn sàng theo bảng Go/No-Go chặt chẽ lấy cảm hứng từ bảng kiểm hàng không/y khoa để không bao giờ xảy ra lỗi ngớ ngẩn trước lãnh đạo cấp cao.')]
], en)}

${viecLabflow([
  [t('Under hat <strong>C5</strong>, score your current LabFlow defense package honestly on the <strong>5-Pillar 10-Point Self-Grading Rubric</strong> AND check all <strong>8 Red Flags</strong> inside a CT Work doc <code>11-Defense-Rubric-Rehearsal</code>.', 'Dưới mũ <strong>C5</strong>, chấm thẳng tay gói bảo vệ LabFlow hiện tại theo <strong>Rubric tự chấm 5 trụ cột (10 điểm)</strong> VÀ rà đủ <strong>8 Cờ đỏ</strong> trong một trang CT Work <code>11-Defense-Rubric-Rehearsal</code>.'), t('Every criterion below 80% of its max score has a concrete CT Work <code>Defect</code> card assigned with a fix deadline before R3.', 'Mọi tiêu chí dưới 80% điểm tối đa đều có thẻ <code>Defect</code> cụ thể trên CT Work kèm hạn sửa xong trước R3.')],
  [t('Schedule and run all three rehearsal rounds (<strong>R1 Content → R2 Timed + Recorded Q&amp;A → R3 Real Hotspot/Hardware + 30s Plan-B Switch</strong>) and complete the D−1 Pre-Flight Checklist.', 'Lên lịch và chạy đủ 3 vòng tổng duyệt (<strong>R1 Nội dung → R2 Bấm giờ + Ghi hình Q&amp;A → R3 Hotspot/Phần cứng thật + Chuyển Plan B 30 giây</strong>) và tích sạch Bảng kiểm D−1.'), t('R2 video proves Demo starts ≤ 5:15, total ≤ 14:30, all Q&amp;A ≤ 40s with opened evidence, and R3 passes 100% of D−1 checks on personal hotspot.', 'Video R2 chứng minh Demo bắt đầu ≤ 5:15, tổng ≤ 14:30, mọi câu Q&amp;A ≤ 40 giây có mở bằng chứng, và R3 qua 100% bảng kiểm D−1 trên hotspot riêng.')]
], en)}

${thuatNgu([
  ['Self-Grading Rubric', t('Structured criterion-by-criterion scoring matrix allowing you to diagnose 6-point vs. 8–9-point gaps objectively before real examiners score you.', 'Bảng chấm điểm có cấu trúc theo từng tiêu chí giúp tự chẩn đoán khoảng cách giữa mức 6 điểm và 8–9 điểm trước khi hội đồng thật chấm.')],
  ['3-Round Dress Rehearsal (R1–R3)', t('Staged preparation funnel: R1 Content &amp; Parity → R2 Timed Run &amp; Adversarial Q&amp;A (recorded) → R3 Real-World Hardware/Network &amp; Plan-B Conditions.', 'Phễu tổng duyệt 3 vòng: R1 Nội dung &amp; Khớp số → R2 Bấm giờ &amp; Hỏi vặn (có ghi hình) → R3 Điều kiện phần cứng/mạng thật &amp; thử Plan B.')],
  ['Pre-Flight Checklist', t('Mandatory D−1 / Day-D verification list (inspired by aviation &amp; WHO Surgical Safety Checklist) preventing high-stress human omissions.', 'Bảng kiểm bắt buộc ngày D−1 và Ngày D (lấy cảm hứng từ hàng không &amp; Bảng kiểm phẫu thuật WHO) nhằm chặn sai sót do áp lực tâm lý.')],
  ['Baseline Comparison (So sánh với Baseline)', t('Evaluating an advanced/ML feature against a simple rule-based benchmark on the exact same dataset split so performance claims are scientifically valid.', 'Đánh giá một tính năng nâng cao/ML so với mức nền đơn giản (rule-based) trên cùng tập dữ liệu chia để kết luận cải thiện có cơ sở khoa học.')]
], en)}

${tomTat([
  t('Distinguish SWP391\'s 20/40/20/20 rubric (pass ≥ 5/10) from SEP490\'s semester-specific capstone rubric (always verify weights/duration with your supervisor by Week 19).', 'Phân biệt rạch ròi thang 20/40/20/20 của SWP391 (qua môn ≥ 5/10) với thang chấm SEP490 theo học kỳ (luôn hỏi GV từ Tuần 19).'),
  t('Grade yourself honestly on the 5-pillar 10-point rubric to pinpoint exact gaps separating 6–7 points from 8–9+ distinction.', 'Tự chấm khắt khe trên Rubric 5 trụ cột (10 điểm) để nhìn rõ khoảng cách giữa mức 6–7 và mức 8–9+ điểm.'),
  t('Run 3 dedicated rehearsal rounds — R1 Content, R2 Timed + Recorded Q&amp;A, R3 Real Hotspot/Hardware + 30s Plan-B switch — logging every stumble as a real CT Work Defect.', 'Chạy đủ 3 vòng tổng duyệt chuyên biệt — R1 Nội dung, R2 Bấm giờ + Ghi hình Q&amp;A, R3 Hotspot/Phần cứng thật + thử Plan B 30 giây — ghi mọi lỗi thành Defect trên CT Work.'),
  t('Eliminate all 8 defense red flags and finish the D−1 Pre-Flight Checklist early so you walk into Day D rested and calm.', 'Triệt tiêu sạch 8 cờ đỏ hội đồng và hoàn tất Bảng kiểm D−1 từ sớm để bước vào Ngày D tỉnh táo, bình tĩnh.')
], en)}
<p>${t('Cross-references: ', 'Đọc thêm: ')}${ac('software-development-project', 'swp391-0-6-chong-truot-diem-cao', 'SWP391 0.8 — Vì sao nhóm mất điểm & cách đạt điểm cao')} · ${ac('software-development-project', 'swp391-p-5-loi-mat-diem', 'SWP391 P.5 — Nhóm mất điểm ở đâu')} · ${ac('software-development-project', 'swp391-moc-5', 'SWP391 Mốc 5 — Tổng duyệt Final Presentation')} · ${lf('Chuẩn bị bảo vệ — LabFlow AI')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-11-5-trung-thuc-5-vai-ai', t('11.5 — Speaking Honestly About "1 Person, 5 Roles" & AI Assistance', '11.5 — Nói thật về "một người 5 vai" và phần AI hỗ trợ'))}.</p>
`);
};

export default {
  title: '11.4 — Self-Grading Rubric & The 3-Round Dress Rehearsal (R1–R3)|||11.4 — Rubric tự chấm & buổi tổng duyệt',
  slug: 'dm5-11-4-rubric-tong-duyet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Phân biệt thang chấm SWP391 với SEP490, bảng Rubric tự chấm 5 trụ cột (10 điểm) tách rõ mốc 6 · 7 · 8–9 điểm, quy trình Tổng duyệt 3 vòng R1–R3 có ghi hình, Bảng kiểm Tiền bay D−1/Ngày D (bài học WHO Checklist — Haynes et al., NEJM 2009) và 8 cờ đỏ chết người trước hội đồng.',
  content: L114(true) + L114(false),
};
