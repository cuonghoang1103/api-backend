/**
 * 1.5 — Luật đổi mũ & tách quyền: người làm không tự duyệt (dm5-1-5-doi-mu).
 * Slug KHỚP chính xác với KE-HOACH.md và liên kết đã trỏ sẵn từ s00/b2-bat-dau-2.mjs!
 * Nguồn đã kiểm: Barings Bank collapse (1995 — Bank of England Board of Banking Supervision Report);
 * WHO Surgical Safety Checklist (Haynes et al., NEJM 2009 / Atul Gawande "The Checklist Manifesto", 2009);
 * SmartBear / Cisco Code Review Study (Jason Cohen, 2006 — <= 200-400 LOC / <= 60 min).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, ac, cs, ng, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L15 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 1 · Lesson 1.5', 'Chương 1 · Bài 1.5', `
<h2>${t('1.5 — Hat-switching rules &amp; separation of duties: the author never self-approves', '1.5 — Luật đổi mũ &amp; tách quyền: người làm không tự duyệt')}</h2>
<p class="lead">${t(
    'This is the hardest and most important lesson in Chapter 1 — and the secret weapon that turns a solo student project from "just one person hacking alone" into a genuine 5-role engineering discipline. Anyone can create five accounts on CT Work; very few people can stop their own brain from forgiving its own bugs. This lesson teaches you <strong>Separation of Duties (SoD)</strong>, the four mechanical rules of hat-switching (cooling-off gap, cross-hat review matrix, adversarial checklists, and using AI strictly as a critic without letting it write your code), and why these exact habits are prized in real software companies.',
    'Đây là bài khó nhất và quan trọng nhất của Chương 1 — cũng là vũ khí bí mật biến một đồ án làm một mình từ "tự cày lẻ loi" thành kỷ luật kỹ thuật 5 vai thật sự. Ai cũng có thể tạo năm tài khoản trên CT Work; rất ít người ngăn được bộ não của chính mình tự tha thứ cho lỗi của mình. Bài này dạy bạn nguyên tắc <strong>Tách biệt nhiệm vụ (Separation of Duties — SoD)</strong>, bốn luật cơ học để đổi mũ thật sự hiệu quả (khoảng nghỉ làm nguội, ma trận review chéo giữa các vai, checklist phản biện và dùng AI đúng vai "người phản biện" chứ không viết hộ code), cùng lý do vì sao doanh nghiệp cực kỳ coi trọng thói quen này.')}</p>

<h3>${t('Everyday picture: why the person who counts the cash register cannot also audit the ledger', 'Liên tưởng đời thường: vì sao người cầm két tiền không được tự ký sổ kiểm toán')}</h3>
<p>${t(
    'In every bank, supermarket, or restaurant, the cashier who collects money during the shift is NEVER the sole person who audits the daily ledger and approves write-offs. Not because every cashier is a thief — but because human eyes skip over their own mistakes, and unchecked power makes shortcuts irresistible when tired or under deadline pressure. Software engineering works identically: <strong>the person who wrote the spec, the code, or the migration must NEVER be the sole unchecked approver of their own output.</strong>',
    'Ở mọi ngân hàng, siêu thị hay nhà hàng, thu ngân cầm két tiền trong ca KHÔNG BAO GIỜ là người duy nhất tự kiểm toán sổ cuối ngày rồi tự ký duyệt khoản lệch. Không phải vì ai cũng gian dối — mà vì mắt người tự lướt qua lỗi của chính mình, và quyền lực không có chốt chặn khiến đường tắt trở nên quá hấp dẫn khi đang mệt hoặc sát hạn. Kỹ nghệ phần mềm y hệt như vậy: <strong>người viết đặc tả, viết code hay viết migration KHÔNG BAO GIỜ được là người duy nhất tự ký duyệt sản phẩm của chính mình.</strong>')}</p>

<h3>${t('1. Why Separation of Duties exists — three verified real-world evidence points', '1. Vì sao nguyên tắc Tách quyền tồn tại — ba bằng chứng thật có nguồn')}</h3>
<ul>
<li>${t('<strong>Barings Bank Collapse (1995 — Bank of England Board of Banking Supervision Report):</strong> Nick Leeson was simultaneously head of trading (front office — executing trades) AND head of settlements/accounting (back office — checking and reconciling his own trades). With zero separation of duties, £827 million in losses stayed hidden in error account "88888" until the 233-year-old British bank collapsed overnight. In software, letting the author push straight to <code>main</code> and drag their own card to <code>Done</code> is a miniature version of the exact same structural flaw.', '<strong>Sự sụp đổ của Ngân hàng Barings (1995 — Báo cáo Uỷ ban Giám sát Ngân hàng Trung ương Anh):</strong> Nick Leeson đồng thời giữ chức trưởng bộ phận giao dịch (front office — trực tiếp đặt lệnh) VÀ trưởng bộ phận thanh toán/kế toán (back office — tự kiểm tra và đối soát chính lệnh của mình). Không có tách biệt nhiệm vụ, khoản lỗ 827 triệu bảng Anh bị giấu kín trong tài khoản lỗi "88888" cho tới khi ngân hàng 233 năm tuổi của Anh sụp đổ chỉ sau một đêm. Trong phần mềm, để tác giả push thẳng lên <code>main</code> và tự kéo thẻ mình sang <code>Done</code> là phiên bản thu nhỏ của đúng lỗ hổng cấu trúc đó.')}</li>
<li>${t('<strong>WHO Surgical Safety Checklist (Haynes et al., <em>New England Journal of Medicine</em>, 2009 / Atul Gawande, <em>The Checklist Manifesto</em>):</strong> Across eight hospitals worldwide, introducing a structured 19-item pause-and-verify checklist reduced major surgical complications from 11.0% to 7.0% and inpatient deaths from 1.5% to 0.8% — even among veteran surgeons. Memory fails under stress; written checklists catch what experts forget.', '<strong>Checklist An toàn Phẫu thuật của WHO (Haynes và cộng sự, tạp chí <em>NEJM</em>, 2009 / Atul Gawande, <em>The Checklist Manifesto</em>):</strong> Tại tám bệnh viện trên toàn cầu, chỉ cần đưa vào một checklist 19 mục buộc cả kíp mổ dừng lại rà soát đã giảm tỷ lệ biến chứng nặng từ 11,0% xuống 7,0% và tỷ lệ tử vong từ 1,5% xuống 0,8% — ngay cả với các bác sĩ phẫu thuật kỳ cựu. Trí nhớ luôn phản bội khi căng thẳng; checklist viết ra giấy bắt lại thứ chuyên gia dễ quên.')}</li>
<li>${t('<strong>SmartBear / Cisco Code Review Study (Jason Cohen, 2006):</strong> Reviewing more than 200–400 lines of code at once or reviewing continuously for more than 60 minutes causes defect detection rates to drop sharply. Small PRs + time-boxed reviews catch far more bugs than midnight marathon reviews.', '<strong>Nghiên cứu Code Review tại Cisco / SmartBear (Jason Cohen, 2006):</strong> Review quá 200–400 dòng code trong một lần hoặc soi liên tục quá 60 phút khiến tỷ lệ bắt được lỗi tụt dốc thảm hại. PR nhỏ + phiên review giới hạn thời gian bắt được nhiều lỗi hơn hẳn những buổi soát thâu đêm.')}</li>
</ul>

<h3>${t('2. The Four Mechanical Rules of Hat-Switching (how to separate duties inside ONE brain)', '2. Bốn luật cơ học của việc đổi mũ (cách tách quyền ngay bên trong MỘT bộ não)')}</h3>
<p>${t('Willpower alone ("I promise to be strict with myself!") fails by Week 2. Instead, enforce four concrete physical and temporal mechanisms:', 'Chỉ dùng ý chí ("em hứa sẽ tự nghiêm khắc với bản thân!") sẽ gãy ngay ở Tuần 2. Thay vào đó, hãy khoá bằng bốn cơ chế vật lý và thời gian cụ thể:')}</p>

<pre><code>${t(`  [Author Hat: C3 Dev BE / C4 Dev FE]
        |  1. Finish small PR (&lt;= 300 LOC) + CI green + move card to "In Review"
        v
  ======+======  COOLING-OFF GAP (Min 1h: small cards | Overnight: SRS, API, BE PR)  ======+
        |  2. Close green/amber browser profile &amp; IDE; let confirmation bias fade          |
        v                                                                                  |
  [Reviewer Hat: C5 QA or C2 BA or C1 Maintainer]                                          |
        |  3. Open DIFFERENT colour browser profile (e.g., Red C5)                         |
        |  4. Run written Adversarial Checklist line by line (NO skipping!)                |
        |  5. Ask AI Critic to attack the diff / spec (NEVER to rewrite code!)             |
        |  6. Log real Defects/comments on CT Work &amp; PR                                    |
        +--- If ANY check fails ---&gt; Return card to "In Progress" (Author fixes) ----------+
        |
        +--- If ALL checks pass + Evidence attached ---&gt; C1 merges &amp; moves to Done`, `  [Mũ Tác giả: C3 Dev BE / C4 Dev FE]
        |  1. Xong PR nhỏ (&lt;= 300 LOC) + CI xanh + chuyển thẻ sang "In Review"
        v
  ======+======  KHOẢNG NGHỈ (Tối thiểu 1 giờ: thẻ nhỏ | Qua đêm: SRS, API, PR BE)  ======+
        |  2. Đóng profile xanh lá/vàng cam &amp; IDE; để thiên kiến xác nhận nguội đi         |
        v                                                                                  |
  [Mũ Phản biện: C5 QA hoặc C2 BA hoặc C1 Maintainer]                                      |
        |  3. Mở profile trình duyệt KHÁC MÀU (vd Đỏ C5)                                   |
        |  4. Chạy Checklist phản biện bằng văn bản từng dòng (KHÔNG bỏ qua!)              |
        |  5. Nhờ AI Người phản biện soi diff / spec (CẤM viết hộ code!)                   |
        |  6. Ghi Defect/nhận xét thật trên CT Work &amp; PR                                   |
        +--- Nếu BẤT KỲ mục nào trượt ---&gt; Trả thẻ về "In Progress" (Tác giả sửa) --------+
        |
        +--- Nếu ĐẠT HẾT + đủ Evidence ---&gt; C1 merge &amp; kéo thẻ sang Done`)}</code></pre>

<ol>
<li>${t('<strong>Rule 1 — Mandatory Cooling-Off Gap (The Sleep Test):</strong> Never review or QA-approve an artifact in the same session you created it. Standard rule: <strong>minimum 1 hour + a completely different activity</strong> for small/routine cards, and <strong>overnight</strong> for high-impact artifacts (<strong>SRS/Specs, API Contracts, and Backend PRs</strong>). You will be shocked how obvious a missing null-check or ambiguous BR looks the next morning.', '<strong>Luật 1 — Khoảng nghỉ làm nguội bắt buộc (Bài test qua đêm):</strong> Không bao giờ tự review hay ký duyệt QA cho sản phẩm ngay trong phiên vừa tạo ra nó. Quy tắc thống nhất: <strong>tối thiểu 1 giờ + chuyển hẳn sang một việc khác</strong> cho thẻ nhỏ/thường ngày, và <strong>qua đêm</strong> cho các sản phẩm rủi ro cao (<strong>SRS/Spec, Hợp đồng API và PR Backend</strong>). Sáng hôm sau mở lại, bạn sẽ bất ngờ thấy lỗi thiếu kiểm null hay câu BR mơ hồ lộ ra rõ mồn một.')}</li>
<li>${t('<strong>Rule 2 — Cross-Hat Review Matrix (Author Hat ≠ Approver Hat):</strong> Every deliverable has a designated creator hat and a DIFFERENT reviewer hat, logged under its separate colour-coded CT Work account (recall the 5 profiles from ', '<strong>Luật 2 — Ma trận Review chéo giữa các vai (Mũ làm ≠ Mũ duyệt):</strong> Mọi sản phẩm đều có một mũ tạo ra và một mũ KHÁC kiểm duyệt, đăng nhập đúng tài khoản CT Work gắn màu riêng (nhớ 5 profile từ ')}${dm('dm5-0-4-dung-cong-ty-mot-nguoi', t('Lesson 0.4', 'Bài 0.4'))}${t('). Even if you own a vertical slice under C1, C5 still runs the QA pass before C1 signs off the gate.', '). Kể cả khi bạn tự làm một lát dọc dưới mũ C1, mũ C5 vẫn phải chạy bài kiểm QA trước khi C1 chốt cổng.')}</li>
<li>${t('<strong>Rule 3 — Adversarial Checklist (Hunt for Failures, Not Confirmation):</strong> Read your diff or spec with a checklist designed to find <em>missing</em> things (missing backend auth, missing unhappy cases, hardcoded config, missing migration rollback). Tick every box with actual proof, not memory.', '<strong>Luật 3 — Checklist phản biện (Đi săn chỗ hỏng, không đi tìm sự đồng tình):</strong> Đọc diff hoặc spec kèm checklist chuyên soi những thứ <em>bị thiếu</em> (thiếu kiểm quyền backend, thiếu unhappy case, hard-code cấu hình, thiếu migration sạch). Tích từng ô bằng bằng chứng thật, không tích theo trí nhớ.')}</li>
<li>${t('<strong>Rule 4 — AI as "Adversarial Critic", NEVER as Ghostwriter:</strong> Remember the 100% hand-coded rule (', '<strong>Luật 4 — Dùng AI làm "Người phản biện", TUYỆT ĐỐI không làm người viết hộ:</strong> Nhớ luật tự code tay 100% (')}${dm('dm5-0-2-bat-dau-2', t('Lesson 0.2', 'Bài 0.2'))}${t('). When you wear a reviewer hat, paste your spec, diff, or test cases to AI and command it to <strong>attack your work like a strict senior reviewer or defense examiner</strong> — listing bugs, edge cases, and questions WITHOUT outputting ready-to-paste replacement code. Then YOU diagnose and hand-code every fix yourself.', '). Khi đội mũ reviewer, đưa spec, diff hoặc test case cho AI và ra lệnh nó <strong>tấn công bài làm của bạn như senior khó tính hoặc hội đồng bảo vệ</strong> — chỉ ra lỗi, trường hợp biên và câu hỏi vặn mà KHÔNG xuất ra đoạn code sửa sẵn để copy. Sau đó CHÍNH BẠN tự chẩn đoán và tự gõ tay mọi bản vá.')}</li>
</ol>

<h3>${t('3. Reusable Cross-Hat Review Matrix (blank structure + LabFlow mapping)', '3. Ma trận Review chéo giữa 5 vai (khung dùng lại được + ánh xạ LabFlow)')}</h3>
<p>${t('For general team code review etiquette and culture, see ', 'Về văn hoá và cách viết nhận xét code review trong nhóm thật, xem thêm ')}${cs('agile-teamwork', 'agl-4-1-muc-dich', 'Agile Teamwork 4.1')} ${t('and ', 'và ')}${cs('agile-teamwork', 'agl-4-4-checklist', 'Agile Teamwork 4.4')}${t('. Below is the exact <strong>Cross-Hat Separation of Duties Matrix</strong> you can reuse on any solo 5-role project or map to 5 real teammates:', '. Dưới đây là <strong>Ma trận Tách quyền &amp; Review chéo giữa các vai</strong> bạn dùng lại được cho mọi dự án một mình 5 vai hoặc gán thẳng cho 5 thành viên thật:')}</p>

${bang(
  [t('Artifact / Stage', 'Sản phẩm / Khâu'), t('Creator Hat', 'Mũ thực hiện'), t('Mandatory Reviewer Hat(s)', 'Mũ phản biện bắt buộc'), t('Cooling-off &amp; Core Question Reviewer Must Ask', 'Khoảng nghỉ &amp; Câu hỏi cốt lõi người duyệt phải vặn')],
  [
    [t('<strong>Project Plan, Scope, Weekly Report</strong>', '<strong>Kế hoạch, Phạm vi, Weekly Report</strong>'), `${mu('C1', en)}`, `${mu('C2', en)} + ${mu('C5', en)}`, t('≥ 1h (small/routine) · "Does effort fit real hours? Are P0/P1/P2 honest? Do numbers match CT Work board?"', '≥ 1 giờ (thẻ nhỏ/định kỳ) · "Effort có vừa quỹ giờ thật không? P0/P1/P2 trung thực không? Số liệu khớp bảng CT Work chưa?"')],
    [t('<strong>SRS, Use Cases, BR-xx, Wireframe</strong>', '<strong>SRS, Use Case, BR-xx, Wireframe</strong>'), `${mu('C2', en)}`, `${mu('C3', en)} + ${mu('C5', en)}`, t('Overnight (min 1h for minor edits) · C3 asks: "Is this buildable &amp; data-consistent?" · C5 asks: "Is every AC &amp; unhappy case testable?"', 'Qua đêm (tối thiểu 1 giờ cho sửa nhỏ) · C3 hỏi: "Có làm được &amp; nhất quán dữ liệu không?" · C5 hỏi: "Mọi AC &amp; unhappy case có test được không?"')],
    [t('<strong>ERD, API Contract, Backend PR</strong>', '<strong>ERD, Hợp đồng API, PR Backend</strong>'), `${mu('C3', en)}`, `${mu('C4', en)} + ${mu('C5', en)}`, t('Overnight · C4 asks: "Does JSON/error envelope match UI?" · C5 asks: "Can I bypass auth or trigger a race condition?"', 'Qua đêm · C4 hỏi: "JSON/mã lỗi khớp UI chưa?" · C5 hỏi: "Có vượt quyền hay tạo race condition được không?"')],
    [t('<strong>Frontend PR (React UI)</strong>', '<strong>PR Frontend (Giao diện React)</strong>'), `${mu('C4', en)}`, `${mu('C2', en)} + ${mu('C5', en)}`, t('≥ 1h (overnight for complex flows) · C2 asks: "Does UI match approved wireframe &amp; SM-xx?" · C5 asks: "Do Loading/Empty/Error/Double-click states hold?"', '≥ 1 giờ (qua đêm cho luồng phức tạp) · C2 hỏi: "UI khớp wireframe &amp; mã SM-xx chưa?" · C5 hỏi: "Đủ trạng thái Loading/Rỗng/Lỗi/Chặn bấm đúp chưa?"')],
    [t('<strong>Test Cases, Defect Log, Release Package</strong>', '<strong>Test Case, Defect Log, Gói phát hành</strong>'), `${mu('C5', en)}`, `${mu('C1', en)} + ${mu('C2', en)}`, t('≥ 1h (overnight before major gate) · C1 asks: "Is tag + DB script + Evidence complete?" · C2 asks: "Does every UC in RTM have test coverage?"', '≥ 1 giờ (qua đêm trước mốc gate lớn) · C1 hỏi: "Tag + script DB + Evidence đủ chưa?" · C2 hỏi: "Mọi UC trong RTM đã có test phủ chưa?"')]
  ]
)}

<h3>${t('4. Fillable 10-Point Adversarial Self-Review Checklist (use before EVERY merge/Done)', '4. Checklist phản biện 10 điểm điền được (dùng trước MỌI lần merge/Done)')}</h3>
<p>${t('Paste this checklist into your PR template or CT Work <code>reviews</code> session. If even ONE item fails, reject your own PR and switch back to the Author hat:', 'Dán checklist này vào mẫu PR hoặc phiên <code>reviews</code> trên CT Work. Chỉ cần MỘT dòng chưa đạt, tự bấm Request Changes và quay lại mũ Tác giả sửa:')}</p>

${out(t(`[Cross-Hat Review Record — Card: LF-___ | Author Hat: C_ | Reviewer Hat: C_ | Gap: ___ hrs]
[ ] 1. Scope Match     : Changes touch ONLY this card's requirement; no unrelated drive-by edits.
[ ] 2. Diff Size       : PR <= 300-400 lines (or explicitly split); readable in <= 45 minutes.
[ ] 3. Spec & BR Sync  : Behaviour matches BR-xx & SM-xx; if rule changed, SRS updated same day.
[ ] 4. Backend Auth    : Every endpoint checks JWT + role + ownership on server (not UI-only).
[ ] 5. Unhappy Cases   : Empty/spaces, boundary, invalid state, and duplicate submit handled cleanly.
[ ] 6. Data Integrity  : Migration runs on fresh DB; constraints enforce truth; no hard-delete of history.
[ ] 7. UI 4-State Check: Loading, Empty, Error (mapped from BE codes), and Populated all verified.
[ ] 8. Clean Code/Sec  : Zero secrets, zero debug logs, zero hardcoded URLs/BR numbers, CI green.
[ ] 9. Real Evidence   : Screenshot / test output / curl log attached to CT Work card.
[ ] 10. AI Critique Log: Ran Adversarial Critic prompt (no AI code copy-paste); recorded findings.
Verdict: [ ] APPROVED (ready for C1 merge)   [ ] CHANGES REQUESTED (logged Defect/comment)`, `[Biên bản Review chéo — Thẻ: LF-___ | Mũ Tác giả: C_ | Mũ Reviewer: C_ | Khoảng nghỉ: ___ giờ]
[ ] 1. Đúng phạm vi    : Code CHỈ chạm đúng yêu cầu của thẻ này; không sửa lan man ngoài lề.
[ ] 2. Cỡ Diff vừa phải: PR <= 300-400 dòng (hoặc đã tách rõ); đọc soát trọn trong <= 45 phút.
[ ] 3. Khớp Spec & BR  : Hành vi đúng BR-xx & SM-xx; nếu đổi luật, đã cập nhật SRS trong ngày.
[ ] 4. Quyền ở Backend : Mọi endpoint đều kiểm JWT + role + chủ sở hữu ở server (không chỉ ẩn UI).
[ ] 5. Đủ Unhappy Case : Xử lý sạch rỗng/dấu cách, giá trị biên, sai trạng thái và bấm gửi đúp.
[ ] 6. Toàn vẹn dữ liệu: Migration chạy sạch trên DB mới; constraint bảo vệ sự thật; không xoá cứng lịch sử.
[ ] 7. Đủ 4 trạng thái : Đã kiểm Đang tải, Rỗng, Lỗi (ánh xạ đúng mã BE) và Có dữ liệu trên UI.
[ ] 8. Code sạch & An ninh: Không secret, không log rác, không hard-code URL/con số BR, CI xanh.
[ ] 9. Bằng chứng thật : Đã gắn ảnh chụp / output test / log curl vào thẻ CT Work.
[ ] 10. Nhật ký AI soi : Đã chạy prompt AI Người phản biện (không chép code AI); đã ghi phát hiện.
Kết luận: [ ] ĐẠT (sẵn sàng để C1 merge)   [ ] YÊU CẦU SỬA (đã ghi Defect/nhận xét)`))}
${note(t(
  '<strong>How to protect <code>main</code> on GitHub with ONE solo account:</strong> GitHub forbids approving your own Pull Request, so do NOT tick <em>"Require approvals"</em> in solo mode — otherwise you lock yourself out of merging. Instead, enable <strong>"Require a pull request before merging" + "Require status checks to pass" (CI) + "Do not allow bypassing"</strong> on <code>main</code>. Record the C5 review verdict and this 10-point checklist directly on CT Work (<code>reviews</code> or the Req card) before merging. When you later work in a 5-person team (SEP490), turn <em>"Require 1 approval"</em> back on.',
  '<strong>Cách khoá nhánh <code>main</code> trên GitHub khi làm một mình (1 tài khoản):</strong> GitHub không cho phép một tài khoản tự bấm Approve PR của chính mình, nên khi làm solo <em>KHÔNG tích "Require approvals"</em> kẻo tự khoá cứng không merge được. Thay vào đó, bật <strong>"Require a pull request before merging" + "Require status checks to pass" (CI) + "Do not allow bypassing"</strong> cho <code>main</code>. Việc review dưới mũ C5 cùng biên bản checklist 10 điểm này được ghi lại trên CT Work (mục <code>reviews</code> hoặc trên thẻ Req) trước khi merge. Sang đồ án nhóm thật 5 người (SEP490), bạn bật lại <em>"Require 1 approval"</em>.'
))}

<h3>${t('5. Exact "AI Adversarial Critic" Prompts (zero code generation!)', '5. Bộ câu lệnh "AI Người phản biện" chuẩn (tuyệt đối không để AI viết hộ code!)')}</h3>
<p>${t('Use these three reusable prompt frames in CT Work Ask AI or your mentor chat — notice how every prompt explicitly forbids writing solution code:', 'Dùng ba khung câu lệnh dùng lại được này trong Ask AI của CT Work hoặc cửa sổ mentor — để ý câu nào cũng cấm rõ AI viết hộ code giải pháp:')}</p>

${bang(
  [t('Review Situation', 'Tình huống review'), t('Prompt frame (copy &amp; fill brackets)', 'Khung prompt (chép &amp; điền phần trong ngoặc)')],
  [
    [t('<strong>Spec Critique</strong><br>(C5 attacking C2)', '<strong>Phản biện Spec</strong><br>(C5 soi C2)'), t('<em>"Act as a strict QA Lead &amp; FPT SWP391 examiner. Read my spec for [Screen/UC] below. List ONLY: (1) vague words, (2) missing unhappy/abuse cases, (3) rules contradicting [BR-xx]. Do NOT rewrite the spec for me — give me a numbered defect list so I fix it myself."</em>', '<em>"Hãy đóng vai QA Lead khó tính và giảng viên chấm SWP391. Đọc đặc tả [Màn hình/UC] bên dưới. Chỉ liệt kê: (1) từ mơ hồ, (2) unhappy/abuse case còn thiếu, (3) luật mâu thuẫn [BR-xx]. KHÔNG viết lại đặc tả hộ tôi — chỉ xuất danh sách lỗi đánh số để tôi tự sửa."</em>')],
    [t('<strong>Code Diff Attack</strong><br>(C5/C1 attacking C3/C4)', '<strong>Soi Diff Code</strong><br>(C5/C1 soi C3/C4)'), t('<em>"Act as a senior security &amp; backend reviewer. Inspect this git diff for [Card ID]. Point out potential bugs in authorization, validation, transactions, timezone, or edge cases by file and line number. STRICT RULE: Do NOT write fixed code; ask guiding questions so I hand-code every fix."</em>', '<em>"Hãy đóng vai senior reviewer bảo mật &amp; backend. Soi đoạn git diff cho [Mã thẻ]. Chỉ ra nguy cơ lỗi về phân quyền, validate, transaction, múi giờ hoặc trường hợp biên theo đúng tên file và số dòng. LUẬT CỨNG: KHÔNG viết code sửa sẵn; hãy đặt câu hỏi gợi ý để tôi tự gõ tay."</em>')],
    [t('<strong>Defense Interrogation</strong><br>(Panel attacking all 5 hats)', '<strong>Hỏi vặn Bảo vệ</strong><br>(Hội đồng soi cả 5 vai)'), t('<em>"Act as a 2-lecturer SWP391 defense panel. Based on my design for [Feature], ask me 5 tough follow-up questions targeting [C2 BA / C3 BE / C5 QA] one at a time, and grade each of my answers brutally against real evidence."</em>', '<em>"Hãy đóng vai hội đồng bảo vệ SWP391 gồm 2 giảng viên. Dựa trên thiết kế [Tính năng], hỏi tôi từng câu một trong 5 câu vặn sâu vào mũ [C2 BA / C3 BE / C5 QA], và chấm thật gắt từng câu trả lời dựa trên bằng chứng thực tế."</em>')]
  ]
)}

<h3>🕵️ ${t('The security &amp; audit angle: why "Rubber-Stamping" breaks compliance (SOX, ISO 27001)', 'Góc bảo mật &amp; kiểm toán: vì sao "duyệt cho có" (Rubber-Stamping) vi phạm chuẩn doanh nghiệp')}</h3>
<p>${t(
    'In regulated industries — banking, healthcare, and enterprise outsourcing certified under <strong>ISO/IEC 27001</strong> or U.S. <strong>Sarbanes-Oxley (SOX)</strong> — Separation of Duties is a legally audited control: the developer who commits code to production CANNOT be the sole approver who deploys it. Attackers (or compromised developer laptops) love repos with weak review rules because one stolen SSH key can silently slip a backdoor straight into <code>main</code>. Practicing strict hat separation, GitHub branch protection, and written review records on LabFlow builds the exact muscle memory enterprise security audits demand.',
    'Ở các ngành chịu kiểm toán chặt — ngân hàng, y tế và các công ty outsourcing đạt chuẩn <strong>ISO/IEC 27001</strong> hay luật <strong>Sarbanes-Oxley (SOX)</strong> của Mỹ — Tách biệt nhiệm vụ (SoD) là chốt kiểm soát bắt buộc: lập trình viên commit code lên production KHÔNG ĐƯỢC là người duy nhất duyệt triển khai nó. Kẻ tấn công (hoặc máy dev bị nhiễm mã độc) cực thích các kho code duyệt qua loa vì chỉ cần trộm một SSH key là âm thầm cài cửa hậu thẳng vào <code>main</code>. Luyện tách mũ nghiêm túc, bảo vệ nhánh GitHub và lưu biên bản review trên LabFlow rèn đúng phản xạ mà kiểm toán bảo mật doanh nghiệp yêu cầu.')}</p>

<h3>${t('6. Four hat-switching traps — and how to stay honest', '6. Bốn cái bẫy khi đổi mũ — và cách giữ kỷ luật thật')}</h3>
<ul>
<li>${t('<strong>"Fake 30-second switch":</strong> Committing at 22:00 under C3, switching browser tab at 22:01 to C5, clicking Approve without running a single test. Fix: enforce the <strong>≥ 1-hour gap</strong> and require at least 1 real command output/screenshot in Evidence.', '<strong>"Đổi mũ giả 30 giây":</strong> 22:00 vừa commit dưới C3, 22:01 nhảy sang tab C5 bấm Approve mà chẳng chạy test nào. Cách sửa: giữ cứng <strong>khoảng nghỉ ≥ 1 giờ</strong> và bắt buộc gắn ít nhất 1 ảnh/output chạy thật vào Evidence.')}</li>
<li>${t('<strong>Mega-PRs (1,500 lines at once):</strong> Nobody — not even you tomorrow morning — can seriously review 1,500 lines. Keep PRs ≤ 300–400 lines per vertical sub-task.', '<strong>PR khổng lồ (1.500 dòng một cục):</strong> Không ai — kể cả chính bạn sáng mai — review nghiêm túc nổi 1.500 dòng. Giữ mỗi PR ≤ 300–400 dòng cho từng việc con.')}</li>
<li>${t('<strong>Letting AI "just fix this one small bug":</strong> One small copy-paste breaks your mental model; three weeks later you cannot explain that method to the defense panel. Always read the AI\'s critique, close the chat, and type the fix from understanding.', '<strong>Tặc lưỡi để AI "sửa hộ đúng một lỗi nhỏ này thôi":</strong> Một lần copy-paste nhỏ làm gãy mô hình hiểu trong đầu bạn; ba tuần sau bạn đứng hình khi hội đồng hỏi hàm đó. Luôn đọc phản biện của AI, gấp cửa sổ chat lại và tự gõ bản sửa từ sự hiểu thật.')}</li>
<li>${t('<strong>Skipping C5 review on "tiny" config/SQL changes:</strong> Tiny 2-line changes (a missing <code>WHERE</code> clause, a wrong env var, a timezone flag) cause some of the worst production outages. Every PR goes through the checklist.', '<strong>Bỏ qua review C5 cho các sửa "nhỏ xíu" ở config/SQL:</strong> Chính những thay đổi 2 dòng (thiếu mệnh đề <code>WHERE</code>, nhầm biến môi trường, sai múi giờ) lại hay gây sập hệ thống nặng nhất. Mọi PR đều đi qua checklist.')}</li>
</ul>

${phongVan([
  [t('"Since you practiced a solo 5-role project, how did you ensure your code and specs were objectively reviewed?"', '"Vì bạn tự luyện đồ án một mình 5 vai, làm sao bạn bảo đảm code và tài liệu được review khách quan?"'), t('I enforced four guardrails instead of relying on willpower: (1) a mandatory cooling-off gap (usually overnight) before switching from Author hat to Reviewer hat, (2) a written 10-point adversarial checklist targeting auth, unhappy cases, and DB integrity, (3) an AI adversarial critic strictly forbidden from writing code, and (4) server-side GitHub branch protection + CI + CT Work Done rules requiring real Evidence on every card.', 'Em khoá bằng bốn hàng rào thay vì dựa vào ý chí: (1) khoảng nghỉ làm nguội bắt buộc (thường qua đêm) trước khi đổi từ mũ Tác giả sang mũ Reviewer, (2) checklist phản biện 10 điểm bằng văn bản chuyên soi quyền, unhappy case và toàn vẹn DB, (3) dùng AI làm người phản biện bị cấm tuyệt đối viết code hộ, và (4) bảo vệ nhánh GitHub phía server + CI + Done rules CT Work đòi Evidence thật trên từng thẻ.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('On an e-commerce project, Separation of Duties shines on money flows: C3 writes the refund/commission calculation, sleeps on it, and next morning C5 attacks the PR with the 10-point checklist (rounding errors on VND/USD, double-refund webhook replay, seller A triggering refund on seller B\'s order) before C1 merges.', 'Trên sàn TMĐT, Tách biệt nhiệm vụ phát huy sức mạnh rõ nhất ở luồng tiền: C3 viết hàm tính hoàn tiền/chiết khấu, để qua đêm, sáng hôm sau C5 đánh vào PR bằng checklist 10 điểm (lỗi làm tròn tiền, gửi lặp webhook hoàn tiền hai lần, shop A kích hoàn tiền đơn của shop B) trước khi C1 merge.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Separation of duties becomes effortless and genuine: GitHub Branch Protection requires <strong>1 approval from a different teammate</strong>, rotating reviewers weekly (see ', 'Tách quyền trở nên tự nhiên và triệt để: Branch Protection trên GitHub yêu cầu <strong>1 lượt duyệt từ một bạn KHÁC</strong>, xoay vòng người review hằng tuần (xem ')+cs('agile-teamwork', 'agl-4-1-muc-dich', 'Agile Teamwork 4.1')+t('), and nobody drags their own card to <code>Done</code> — only the cross-tester does.', '), và không ai tự kéo thẻ của mình sang <code>Done</code> — chỉ người test chéo mới được kéo.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Formal SoD is built into tooling and compliance: <code>CODEOWNERS</code> enforces senior/security sign-off on sensitive paths (auth, payments, DB migrations), Dev cannot deploy to Production (only CI/CD + Release Manager / DevOps after QA Sign-Off), and every approval is audited for ISO 27001 / CMMI Level 3–5.', 'SoD chính thức được ép bằng công cụ và kiểm toán: file <code>CODEOWNERS</code> bắt buộc senior/bảo mật duyệt các thư mục nhạy cảm (auth, thanh toán, migration DB), Dev không có quyền deploy thẳng lên Production (chỉ CI/CD + Release Manager / DevOps chạy sau khi có QA Sign-Off), và mọi lượt duyệt đều lưu vết cho kiểm toán ISO 27001 / CMMI.')]
], en)}

${viecLabflow([
  [t('Wait at least <strong>1 hour</strong> (or overnight) after completing Lessons 1.2–1.3. Then open your <strong>Red (C5 QA)</strong> profile on CT Work (<strong>LF #2</strong>), open <code>reviews</code> (or your chosen Iteration-1 Req card), and run the <strong>10-Point Adversarial Self-Review Checklist</strong> + the <strong>Spec Critique AI prompt</strong> on your own C2 spec and C3 API contract.', 'Chờ tối thiểu <strong>1 giờ</strong> (hoặc để qua đêm) sau khi xong Bài 1.2–1.3. Sau đó mở profile <strong>Đỏ (C5 QA)</strong> trên CT Work (<strong>LF #2</strong>), mở mục <code>reviews</code> (hoặc chính thẻ Req Iteration 1 bạn đã viết), và chạy <strong>Checklist phản biện 10 điểm</strong> + <strong>prompt AI Phản biện Spec</strong> lên chính spec C2 và hợp đồng API C3 của bạn.'), t('You uncover and log at least <strong>2 real gaps/improvements</strong> as C5 comments (e.g., a missing boundary rule or auth check), then switch back to C2/C3 to fix them by hand.', 'Bạn tự bắt và ghi nhận ít nhất <strong>2 lỗ hổng/điểm thiếu có thật</strong> dưới bình luận C5 (vd thiếu luật biên hoặc kiểm quyền), rồi quay lại mũ C2/C3 tự tay sửa.')]
], en)}

${thuatNgu([
  ['Separation of Duties (SoD — Tách biệt nhiệm vụ)', t('Control principle ensuring no single person/role both executes an action and independently approves/audits it.', 'Nguyên tắc kiểm soát bảo đảm không một người/vai nào vừa tự làm vừa độc lập duyệt/kiểm toán chính việc đó.')],
  ['Cooling-Off Gap (Khoảng nghỉ làm nguội)', t('Mandatory wait (≥ 1 hour, ideally overnight) between authoring and reviewing your own work so confirmation bias fades.', 'Khoảng chờ bắt buộc (≥ 1 giờ, lý tưởng là qua đêm) giữa lúc tạo sản phẩm và lúc tự review để giảm thiên kiến xác nhận.')],
  ['Rubber-Stamping (Duyệt cho có)', t('Approving a PR or card superficially ("LGTM") without checking requirements, edge cases, or security.', 'Bấm duyệt PR hay kéo thẻ qua loa ("LGTM") mà không kiểm yêu cầu, trường hợp biên hay bảo mật.')],
  ['Adversarial Critic (Người phản biện)', t('Reviewing (or instructing AI) specifically to expose weaknesses, ambiguities, and failure modes — without ghostwriting the fix.', 'Cách review (hoặc giao vai cho AI) chuyên đi tìm điểm yếu, chỗ mơ hồ và ca hỏng — không viết hộ lời giải.')],
  ['CODEOWNERS', t('A repository file (GitHub/GitLab) that automatically assigns required reviewers whenever sensitive directories change.', 'Tệp cấu hình trong kho GitHub/GitLab tự động chỉ định người bắt buộc duyệt mỗi khi thư mục nhạy cảm bị sửa.')]
], en)}

${tomTat([
  t('Never self-approve immediately: Barings Bank (1995) shows what happens when execution and auditing sit in one unchecked hand.', 'Không bao giờ tự duyệt ngay lập tức: vụ Ngân hàng Barings (1995) cho thấy hậu quả khi thực thi và kiểm soát nằm trong một tay không chốt chặn.'),
  t('Enforce 4 mechanical hat-switching rules: Cooling-Off Gap (≥ 1h / overnight), Cross-Hat Review Matrix, 10-Point Adversarial Checklist, and AI strictly as Critic (zero ghostwriting).', 'Khoá bốn luật cơ học khi đổi mũ: Khoảng nghỉ làm nguội (≥ 1 giờ / qua đêm), Ma trận Review chéo giữa vai, Checklist phản biện 10 điểm và AI chỉ làm Người phản biện (cấm viết hộ).'),
  t('Keep PRs small (≤ 300–400 LOC) so your reviewer hat stays sharp — Cisco/SmartBear data shows giant reviews miss bugs.', 'Giữ PR nhỏ (≤ 300–400 dòng) để mũ reviewer đủ tỉnh táo — nghiên cứu Cisco/SmartBear chứng minh review quá to sẽ lọt lỗi.'),
  t('Finding 2 real gaps in your own work under C5 is a victory, not a failure — it prevents Leakage on defense day.', 'Tự bắt được 2 lỗi thật trên chính bài của mình dưới mũ C5 là chiến thắng, không phải thất bại — nó chặn Leakage ngay trước ngày bảo vệ.')
], en)}
<p>${t('Cross-references: ', 'Đọc thêm: ')}${ac('software-testing', 'swt301-static-reviews', 'SWT301 3.2 — Static reviews &amp; roles')} · ${cs('agile-teamwork', 'agl-4-4-checklist', 'Agile Teamwork 4.4 — Review checklist')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-1-6-raci-lich-tuan', t('1.6 — LabFlow RACI, Weekly Time-Box &amp; Role Log', '1.6 — RACI cho LabFlow, lịch tuần công ty một người &amp; nhật ký vai'))}.</p>
`);
};

export default {
  title: '1.5 — Hat-switching rules & separation of duties: the author never self-approves|||1.5 — Luật đổi mũ & tách quyền: người làm không tự duyệt',
  slug: 'dm5-1-5-doi-mu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nguyên tắc Tách biệt nhiệm vụ (SoD) qua bài học Ngân hàng Barings (1995), WHO Checklist (NEJM 2009) và nghiên cứu Cisco/SmartBear; 4 luật cơ học đổi mũ (khoảng nghỉ làm nguội, ma trận review chéo 5 vai, checklist phản biện 10 điểm điền được, 3 khung prompt AI phản biện không viết hộ code).',
  content: L15(true) + L15(false),
};
