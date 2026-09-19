# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_package import build
import json, io as _io
IMG = json.load(_io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img_blocks.json'), encoding='utf-8'))['tp1']

HDR = """/**
 * SWR302 · Worked requirements package for assignment topic TP1 — the Campus
 * Academic and Registration System (CARS) of the fictional Northern Regional
 * University.
 *
 * All eight deliverables in full. The documents are in English (that is what is
 * submitted); the guidance around each one is bilingual.
 *
 * Generated from the source Markdown by scratchpad/tp1.py — edit the Markdown,
 * regenerate, do not hand-edit this file.
 */
"""
def L(title, slug, desc, en, vi, file, preview=False, extra=''):
    return dict(title=title, slug=slug, desc=desc, en=en, vi=vi, file=file, preview=preview, html='', extra=extra)
E = lambda t: f'<span class="eyebrow">Worked package · TP1 · {t}</span>'
V = lambda t: f'<span class="eyebrow">Bộ tài liệu mẫu · TP1 · {t}</span>'

lessons = [
 L('W1.1 — Deliverable 1: Vision & Scope (full document)|||W1.1 — Deliverable 1: Vision & Scope (tài liệu đầy đủ)',
   'swr302-tp1-goi-01-vision-scope',
   'Vision & Scope hoàn chỉnh cho CARS theo template Chapter 5: 6 nỗi đau có định lượng, 6 business objective baseline–target–deadline, 6 rủi ro, 14 feature, 3 bản phát hành, 8 loại trừ, hồ sơ 8 stakeholder và bảng ưu tiên dự án.',
   E('Deliverable 1')+'''
<h2>Vision &amp; Scope — the complete document</h2>
<p class="lead">TP1 gives you a brief with <strong>no numbers in it</strong>. This document shows what to do about that: every baseline in §1.3 is invented, and every one is declared as an assumption in §1.7 so a grader can see it was a decision rather than an accident.</p>
<p>Four things worth stealing:</p>
<ul>
<li><strong>§1.2 quantifies each of the six pains separately.</strong> The brief mentions prerequisites, overrides, tuition checks, cancellations and visibility in a single paragraph; separating them is what makes six measurable objectives possible instead of one vague one.</li>
<li><strong>§1.3 objectives include a "zero" target twice.</strong> Zero outages, zero incorrect enrollments. A target of zero is only credible when you also say how it is measured — §1.4 does.</li>
<li><strong>§2.4 exclusions name the systems a reader would assume are included</strong> — the LMS, the finance system, the timetable system, admissions. Each one is a scope argument settled in advance.</li>
<li><strong>§3.3 explains why this project cannot be piloted.</strong> Sections are shared across faculties, so a partial rollout would split one section's capacity across two systems. Recognising that a phased rollout is <em>impossible</em>, and substituting a rehearsal window, is the kind of judgement the deployment section is for.</li>
</ul>''',
   V('Deliverable 1')+'''
<h2>Vision &amp; Scope — tài liệu hoàn chỉnh</h2>
<p class="lead">TP1 cho bạn một đề bài <strong>không có con số nào</strong>. Tài liệu này cho thấy phải xử lý điều đó ra sao: mọi baseline ở §1.3 đều do nhóm tự đặt, và mọi cái đều được khai thành giả định ở §1.7 để người chấm thấy đó là một quyết định chứ không phải sự tình cờ.</p>
<p>Bốn thứ đáng "mượn":</p>
<ul>
<li><strong>§1.2 định lượng RIÊNG từng nỗi đau trong sáu cái.</strong> Đề gộp môn tiên quyết, vượt sĩ số, đối chiếu học phí, huỷ lớp và thiếu minh bạch vào một đoạn; tách chúng ra mới có được sáu mục tiêu đo được thay vì một mục tiêu mơ hồ.</li>
<li><strong>§1.3 có tới hai mục tiêu đặt đích bằng "không".</strong> Không sập lần nào, không có lượt ghi danh sai. Đích bằng không chỉ đáng tin khi bạn đồng thời nói rõ đo nó ra sao — §1.4 làm việc đó.</li>
<li><strong>§2.4 phần loại trừ gọi đích danh những hệ thống người đọc dễ tưởng là có</strong> — LMS, hệ thống tài chính, hệ thống thời khoá biểu, tuyển sinh. Mỗi cái là một tranh cãi phạm vi được dập tắt từ trước.</li>
<li><strong>§3.3 giải thích vì sao dự án này KHÔNG thể triển khai thí điểm.</strong> Các lớp dùng chung giữa các khoa, nên triển khai một phần sẽ chia sĩ số của cùng một lớp cho hai hệ thống. Nhận ra rằng triển khai theo giai đoạn là <em>bất khả</em>, rồi thay bằng một buổi tổng duyệt, đúng là loại phán đoán mà mục triển khai sinh ra để chứa.</li>
</ul>''',
   '01-Vision-and-Scope.md', preview=True),

 L('W1.2 — Deliverable 2: 14 use case specifications (full)|||W1.2 — Deliverable 2: 14 đặc tả use case (đầy đủ)',
   'swr302-tp1-goi-02-use-cases',
   'Trọn 14 đặc tả use case theo template 15 dòng của Chapter 8, cộng bảng actor, danh sách use case và bảng quan hệ include/extend. UC-03 có tới 7 ngoại lệ — nhiều nhất trong cả hai bộ tài liệu mẫu.',
   E('Deliverable 2')+'''
<h2>Fourteen use cases, and one that carries the whole system</h2>
<p class="lead">Read <strong>UC-03 Register for a course section</strong> first. It has <strong>seven exceptions</strong> — more than any use case in either worked package — and that is not padding. Seven independent things can refuse an enrollment, and the brief's central complaint is that the legacy system checked none of them at the moment the student clicked.</p>
<p>Three details a grader looks for, all visible in UC-03:</p>
<ul>
<li><strong>POST-1 forbids a half-finished state.</strong> "The student is enrolled and a seat is consumed, <em>or</em> no state has changed at all." Seven checks and a capacity claim must succeed or fail together.</li>
<li><strong>Exception 3.0.E6 states a policy, not a mechanism.</strong> When the finance system does not answer, CARS <em>refuses</em> rather than assuming eligibility — a decision taken with the Finance Officer, recorded in Other Information with the reason.</li>
<li><strong>Frequency of use is a real number.</strong> 67,000 enrollments a semester, 85% inside 72 hours, bursts of ~180 attempts per second. That number is what later justifies the performance quality attributes in the SRS.</li>
</ul>
<div class="callout ok"><strong>Also worth reading: UC-07, flow 7.4 and exception 7.0.E3.</strong> A waitlisted student who is temporarily ineligible keeps their queue position, and a seat declined for a timetable clash is held for one hour before passing on. Neither rule is obvious; both came from the Student Union representative, and together they are what makes a waitlist <em>fair</em> rather than merely automatic.</div>''',
   V('Deliverable 2')+'''
<h2>Mười bốn use case, và một cái gánh cả hệ thống</h2>
<p class="lead">Hãy đọc <strong>UC-03 Đăng ký lớp học phần</strong> trước. Nó có <strong>bảy ngoại lệ</strong> — nhiều hơn mọi use case trong cả hai bộ tài liệu mẫu — và đó không phải độn thêm. Có bảy thứ độc lập có thể từ chối một lượt ghi danh, mà than phiền trung tâm của đề bài chính là hệ thống cũ không kiểm cái nào ngay lúc sinh viên bấm.</p>
<p>Ba chi tiết người chấm tìm, đều thấy được trong UC-03:</p>
<ul>
<li><strong>POST-1 cấm trạng thái dở dang.</strong> "Sinh viên được ghi danh và một chỗ bị chiếm, <em>hoặc</em> không có gì thay đổi." Bảy phép kiểm và một lượt chiếm chỗ phải cùng thành công hoặc cùng thất bại.</li>
<li><strong>Ngoại lệ 3.0.E6 phát biểu một CHÍNH SÁCH, không phải một cơ chế.</strong> Khi hệ thống tài chính không trả lời, CARS <em>từ chối</em> chứ không giả định là đủ điều kiện — quyết định này lấy từ Cán bộ Tài chính, và được ghi kèm lý do ở mục Other Information.</li>
<li><strong>Tần suất dùng là con số thật.</strong> 67.000 lượt ghi danh mỗi kỳ, 85% nằm trong 72 giờ, có lúc bùng lên ~180 lượt/giây. Chính con số đó sau này biện minh cho các thuộc tính chất lượng về hiệu năng trong SRS.</li>
</ul>
<div class="callout ok"><strong>Cũng đáng đọc: UC-07, luồng 7.4 và ngoại lệ 7.0.E3.</strong> Sinh viên trong danh sách chờ tạm thời không đủ điều kiện thì vẫn GIỮ vị trí, và một chỗ bị từ chối vì trùng giờ sẽ được giữ lại một tiếng trước khi chuyển cho người kế. Cả hai luật đều không hiển nhiên; cả hai đều đến từ đại diện Hội sinh viên, và cùng nhau chúng làm danh sách chờ trở nên <em>công bằng</em> chứ không chỉ là tự động.</div>''',
   '02-Use-Cases.md', extra=IMG['uc']),

 L('W1.3 — Deliverable 3: 20 business rules, all five types|||W1.3 — Deliverable 3: 20 business rule, đủ năm loại',
   'swr302-tp1-goi-03-business-rules',
   'Catalog 20 rule đủ năm loại, đánh dấu tĩnh/động, nguồn từng rule — bảy rule đến từ ĐỌC TÀI LIỆU Quy chế học vụ chứ không từ phỏng vấn. Kèm vấn đề "catalog year" và ma trận truy vết.',
   E('Deliverable 3')+'''
<h2>Twenty rules — and seven of them nobody mentioned</h2>
<p class="lead">The discovery table in §4 is the part to study. <strong>Seven of the twenty rules came from reading the Academic Regulations</strong>, not from any interview. Nobody mentioned them because everybody assumed they were obvious.</p>
<div class="callout warn"><strong>The lesson generalises.</strong> In a regulated organisation — a university, a bank, a hospital — read the regulations <em>before</em> the first interview. Otherwise you spend the interview being told things you could have read, and you still miss the rules nobody thinks to say out loud. This is the exact opposite of TP2, where the rules existed only as staff habits and document analysis would have found nothing.</div>
<h3>The catalog-year problem</h3>
<p>Read §2.2 carefully. Twelve rules are dynamic, and three of them — BR-02, BR-04, BR-13 — must additionally be <strong>versioned by catalog year</strong>: a student is assessed against the regulations in force when they matriculated. A configuration model that simply overwrites the current value would silently re-assess every existing student against new rules. That is wrong, and under Academic Regulations §9.1 it is not permitted.</p>
<p>Most teams never notice this. Spotting it is worth more than any other single observation in the TP1 topic, because it changes the data model (SRS §4.1), a constraint (CO-6) and a data dictionary entry (Catalog Year).</p>''',
   V('Deliverable 3')+'''
<h2>Hai mươi rule — và bảy cái không ai nhắc tới</h2>
<p class="lead">Bảng khám phá ở §4 mới là phần đáng học. <strong>Bảy trong hai mươi rule đến từ việc ĐỌC Quy chế học vụ</strong>, không từ buổi phỏng vấn nào. Không ai nhắc tới chúng vì ai cũng cho rằng chúng hiển nhiên.</p>
<div class="callout warn"><strong>Bài học này áp dụng rộng.</strong> Trong một tổ chức có quy chế — trường đại học, ngân hàng, bệnh viện — hãy đọc quy chế <em>trước</em> buổi phỏng vấn đầu tiên. Nếu không, bạn tốn cả buổi để nghe những thứ lẽ ra đọc được, mà vẫn bỏ sót những luật chẳng ai nghĩ tới việc nói ra. Đây đúng là điều ngược lại với TP2, nơi các rule chỉ tồn tại dưới dạng thói quen của nhân viên và đọc tài liệu sẽ chẳng tìm ra gì.</div>
<h3>Vấn đề "catalog year"</h3>
<p>Hãy đọc kỹ §2.2. Mười hai rule là động, và ba trong số đó — BR-02, BR-04, BR-13 — còn phải được <strong>đánh phiên bản theo catalog year</strong>: sinh viên được đánh giá theo quy chế có hiệu lực lúc họ nhập học. Một mô hình cấu hình chỉ ghi đè giá trị hiện tại sẽ âm thầm đánh giá lại mọi sinh viên đang học theo luật mới. Điều đó vừa sai, vừa không được phép theo Quy chế §9.1.</p>
<p>Phần lớn nhóm không bao giờ nhận ra điều này. Phát hiện được nó đáng giá hơn bất kỳ nhận xét đơn lẻ nào khác trong đề TP1, vì nó làm thay đổi mô hình dữ liệu (SRS §4.1), một ràng buộc (CO-6) và một mục data dictionary (Catalog Year).</p>''',
   '03-Business-Rules.md'),

 L('W1.4 — Deliverable 4: the SRS, all sections (109 requirements)|||W1.4 — Deliverable 4: SRS đầy đủ mọi mục (109 yêu cầu)',
   'swr302-tp1-goi-04-srs',
   'SRS hoàn chỉnh theo template Chapter 10: 14 nhóm tính năng với 109 functional requirement, 15 thuộc tính chất lượng Planguage (tải đỉnh 6.000 phiên đồng thời, 0 chỗ bị cấp trùng), yêu cầu dữ liệu, 8 giao tiếp, glossary, TBD list và ma trận truy vết.',
   E('Deliverable 4')+'''
<h2>The SRS — where load stops being a feeling and becomes a number</h2>
<p class="lead">Three parts repay close reading.</p>
<ul>
<li><strong>§6.1 QA-1 through QA-4.</strong> The brief's first complaint is "severe system slowdowns and frequent crashes". That is not a requirement. QA-1 turns it into: 4,200 concurrent sessions must be sustained with 95th-percentile response ≤ 2 s, measured at a rehearsal window, planned for 6,000. <strong>QA-4 is the one to copy</strong> — zero seats issued twice or lost, measured by daily reconciliation <em>and</em> fault-injection at peak concurrency. A double-issued seat is discovered by a student arriving at a full classroom.</li>
<li><strong>§2.5, the callout.</strong> "If A2 is wrong, Release 1.0 is wrong." Naming the assumption the whole specification rests on, and saying what happens if it fails, is the difference between an analyst and a typist.</li>
<li><strong>Appendix C, TBD-5.</strong> Marked <strong>"blocks the BO-2 commitment"</strong>. An open item that blocks an objective should say so — a TBD list that does not distinguish the dangerous item from the cosmetic one is just a to-do list.</li>
</ul>
<div class="callout ok"><strong>Notice CO-6 and QA-15 together.</strong> The Academic Regulations are revised annually by committee. CO-6 requires every catalog-year version to be retained; QA-15 requires a regulation change to be applied in ≤ 3 days with no code change. A system that needs a release to absorb the annual revision is out of date within a year of going live — so a maintainability attribute here is a business requirement, not an engineering preference.</div>''',
   V('Deliverable 4')+'''
<h2>SRS — nơi "tải nặng" thôi là cảm giác và trở thành con số</h2>
<p class="lead">Ba phần đáng đọc kỹ.</p>
<ul>
<li><strong>§6.1, từ QA-1 tới QA-4.</strong> Than phiền đầu tiên của đề là "hệ thống chậm nghiêm trọng và sập thường xuyên". Đó không phải một yêu cầu. QA-1 biến nó thành: phải chịu được 4.200 phiên đồng thời với phân vị 95 ≤ 2 giây, đo tại buổi tổng duyệt, nhắm tới 6.000. <strong>QA-4 là cái đáng chép</strong> — không chỗ nào bị cấp hai lần hay mất đi, đo bằng đối soát hằng ngày <em>và</em> tiêm lỗi ở mức đồng thời cao nhất. Một chỗ bị cấp trùng sẽ được phát hiện bởi một sinh viên bước vào phòng học đã đầy.</li>
<li><strong>§2.5, khung nhấn mạnh.</strong> "Nếu A2 sai thì bản 1.0 sai." Gọi tên đúng cái giả định mà cả bản đặc tả đang đứng lên, và nói rõ chuyện gì xảy ra nếu nó sụp, là khác biệt giữa một analyst và một người đánh máy.</li>
<li><strong>Phụ lục C, mục TBD-5.</strong> Được đánh dấu <strong>"chặn cam kết BO-2"</strong>. Một mục còn mở mà đang chặn một mục tiêu thì phải nói ra — một danh sách TBD không phân biệt được cái nguy hiểm với cái trang trí thì chỉ là danh sách việc vặt.</li>
</ul>
<div class="callout ok"><strong>Hãy để ý CO-6 và QA-15 cùng nhau.</strong> Quy chế học vụ được uỷ ban sửa hằng năm. CO-6 buộc giữ lại mọi phiên bản theo catalog year; QA-15 buộc một thay đổi quy chế phải áp dụng được trong ≤ 3 ngày mà không sửa mã. Một hệ thống cần ra bản mới để hấp thụ lần sửa quy chế hằng năm sẽ lỗi thời trong vòng một năm sau khi lên — nên ở đây một thuộc tính về khả năng bảo trì chính là yêu cầu nghiệp vụ, không phải sở thích kỹ thuật.</div>''',
   '04-SRS.md'),

 L('W1.5 — Deliverable 5: data dictionary, 91 entries|||W1.5 — Deliverable 5: data dictionary, 91 mục',
   'swr302-tp1-goi-05-data-dictionary',
   'Data dictionary đầy đủ theo Chapter 13: 91 mục theo bảng chữ cái, đúng ký pháp, mọi phần tử trong cấu trúc có mục riêng. Ghi chú giải thích vì sao Catalog Year, NeedsReview và Queue Position phải tồn tại.',
   E('Deliverable 5')+'''
<h2>91 entries, and four that carry an argument</h2>
<p class="lead">Section 3 is where a data dictionary stops being clerical. Four entries exist for reasons worth understanding:</p>
<ul>
<li><strong>Catalog Year</strong> — the most consequential entry and the easiest to omit. Without it, every annual curriculum revision silently re-assesses every existing student.</li>
<li><strong>Group Status includes NeedsReview</strong> — the three obvious values (Satisfied, InProgress, Outstanding) force the engine to guess when it cannot evaluate a requirement. A degree audit that guesses is the failure that produced the complaint to the Rector.</li>
<li><strong>Queue Position is stored, not computed</strong> — computing it from Joined At would be equivalent, until a student is skipped for ineligibility (UC-07 flow 7.4) and must keep their place. Storing it makes the fairness rule expressible.</li>
<li><strong>Financial Standing carries Retrieved At</strong> — CARS does not own this data, so it shows the age rather than hiding it.</li>
</ul>
<div class="pitfall"><strong>The check a grader actually runs:</strong> pick a structure at random and follow every name inside it. <code>Ship To Address</code> in TP2, <code>Section</code> here — Section Identifier, Course Code, Semester Code, Lecturer Name, Published Capacity, Minimum Viable Enrollment, Section Status and Meeting Pattern all have their own alphabetical entries, and Meeting Pattern's four components do too.</div>''',
   V('Deliverable 5')+'''
<h2>91 mục, và bốn mục mang theo một lập luận</h2>
<p class="lead">Mục 3 là chỗ data dictionary thôi là việc bàn giấy. Bốn mục tồn tại vì những lý do đáng hiểu:</p>
<ul>
<li><strong>Catalog Year</strong> — mục hệ trọng nhất và dễ bỏ sót nhất. Thiếu nó, mỗi lần sửa chương trình hằng năm sẽ âm thầm đánh giá lại mọi sinh viên đang học.</li>
<li><strong>Group Status có giá trị NeedsReview</strong> — ba giá trị hiển nhiên (Satisfied, InProgress, Outstanding) buộc bộ máy phải ĐOÁN khi không đánh giá được một yêu cầu. Một degree audit biết đoán chính là thất bại đã dẫn tới đơn thư gửi Hiệu trưởng.</li>
<li><strong>Queue Position được LƯU, không phải tính ra</strong> — tính từ Joined At thì tương đương, cho tới khi một sinh viên bị bỏ qua vì tạm không đủ điều kiện (UC-07 luồng 7.4) và phải giữ nguyên chỗ. Lưu lại mới diễn đạt được luật công bằng đó.</li>
<li><strong>Financial Standing có Retrieved At</strong> — CARS không sở hữu dữ liệu này, nên nó hiện tuổi của số liệu thay vì giấu đi.</li>
</ul>
<div class="pitfall"><strong>Phép kiểm người chấm thật sự chạy:</strong> bốc ngẫu nhiên một cấu trúc rồi dò từng cái tên bên trong. <code>Ship To Address</code> ở TP2, <code>Section</code> ở đây — Section Identifier, Course Code, Semester Code, Lecturer Name, Published Capacity, Minimum Viable Enrollment, Section Status và Meeting Pattern đều có mục riêng theo bảng chữ cái, và bốn thành phần của Meeting Pattern cũng vậy.</div>''',
   '05-Data-Dictionary.md'),

 L('W1.6 — Deliverable 6: mock-ups and how the three were chosen|||W1.6 — Deliverable 6: mock-up và cách chọn ba use case',
   'swr302-tp1-goi-06-mockups',
   'Ba mock-up cho use case phức tạp nhất, bảng xếp hạng để chọn, quyết định thiết kế mỗi mock-up đem đi hỏi, và năm câu hỏi nó sinh ra để chốt — trong đó một câu để mở thành TBD.',
   E('Deliverable 6')+'''
<h2>Three mock-ups, all of them showing something going wrong</h2>
<p class="lead">All three screens here show a <strong>failure or an unresolved state</strong> — a refused registration, a breached deadline, a requirement the system cannot evaluate. That is deliberate. A mock-up set with only happy paths proves nothing about whether the design survives reality, and reality is where this project's complaints came from.</p>
<ul>
<li><strong>M1</strong> shows the full check table on a refusal, including the checks that were <em>not</em> run because the request stopped earlier. The legacy system said "prerequisite not met" and generated an advising enquiry every time.</li>
<li><strong>M2</strong> puts the 48-hour breach on screen and states that the system will not decide for the Department Head. That sentence is the resolution of the hardest disagreement in elicitation.</li>
<li><strong>M3</strong> shows a degree audit admitting it cannot evaluate one requirement group, and naming who to ask.</li>
</ul>
<div class="callout ok"><strong>§4 is the part most teams skip.</strong> Five questions the mock-ups were built to settle, four with answers and one left open as <strong>TBD-6</strong> — whether a Department Head should see a student's GPA on the override screen. The Registrar wants legal advice. Recording that is better than inventing a privacy position nobody has taken.</div>''',
   V('Deliverable 6')+'''
<h2>Ba mock-up, cả ba đều cho thấy một thứ đang hỏng</h2>
<p class="lead">Cả ba màn hình ở đây đều thể hiện một <strong>trạng thái hỏng hoặc chưa giải quyết</strong> — một lượt đăng ký bị từ chối, một hạn chót bị vỡ, một yêu cầu hệ thống không đánh giá nổi. Đó là cố ý. Một bộ mock-up chỉ có luồng thuận thì không chứng minh được thiết kế chịu nổi thực tế, mà thực tế mới là nơi sinh ra những than phiền của dự án này.</p>
<ul>
<li><strong>M1</strong> hiện đủ bảng các phép kiểm khi từ chối, kể cả những phép <em>chưa</em> chạy vì yêu cầu đã dừng sớm hơn. Hệ thống cũ chỉ nói "chưa đạt môn tiên quyết" và lần nào cũng đẻ ra một lượt hỏi cố vấn.</li>
<li><strong>M2</strong> đưa việc vỡ hạn 48 giờ lên màn hình và nói rõ hệ thống sẽ KHÔNG quyết thay Trưởng bộ môn. Câu đó chính là lời giải cho bất đồng khó nhất trong quá trình elicitation.</li>
<li><strong>M3</strong> cho thấy một degree audit thừa nhận nó không đánh giá được một nhóm yêu cầu, và chỉ rõ phải hỏi ai.</li>
</ul>
<div class="callout ok"><strong>§4 là phần phần lớn nhóm bỏ qua.</strong> Năm câu hỏi mà mock-up được dựng lên để chốt, bốn câu có đáp án và một câu để mở thành <strong>TBD-6</strong> — Trưởng bộ môn có nên thấy GPA của sinh viên trên màn hình duyệt vượt sĩ số không. Phòng Đào tạo muốn hỏi ý kiến pháp lý. Ghi nhận điều đó tốt hơn là bịa ra một lập trường về quyền riêng tư mà chưa ai đưa ra.</div>''',
   '06-Mockups.md', extra=IMG['mock']),

 L('W1.7 — Deliverable 7: prioritization, and why the ranking was overruled|||W1.7 — Deliverable 7: xếp ưu tiên, và vì sao thứ hạng bị bác',
   'swr302-tp1-goi-07-prioritization',
   'Bảng value/cost/risk Chapter 16 với trọng số có biện minh, mục bắt buộc tách riêng, thứ hạng thật của 13 feature — và lập luận vì sao ba feature giá trị NHẤT lại xếp hạng 9, 12, 13.',
   E('Deliverable 7')+'''
<h2>The three most valuable features rank 9th, 12th and 13th</h2>
<p class="lead">This is the sharpest example of the point in either package. <strong>FE-4, FE-5 and FE-9 carry the three highest Value % scores in the whole table</strong> — 10.19, 9.06 and 9.43. The model knows they are the most valuable things in the project. It ranks them 9th, 12th and 13th anyway, because they are also the most expensive and the riskiest.</p>
<p>Meanwhile FE-12 (registration window administration) wins on being cheap, safe and unavoidable — not on being important.</p>
<h3>Why the release plan overrules it</h3>
<ul>
<li><strong>The model cannot see the business case.</strong> Only FE-4 and FE-5 deliver BO-2 and BO-4 — the 880 staff-hours a semester that justified the funding. A Release 1.0 built from the top of the ranking would open a registration window beautifully and still check every prerequisite by hand.</li>
<li><strong>The model treats risk as a reason to defer.</strong> FE-5's risk is entirely the finance vendor (RI-1). Deferring it does not reduce that risk — it discovers it later, with less time to route around it.</li>
<li><strong>The model cannot see dependency.</strong> FE-10 ranks 6th and is worthless without FE-5, whose data it displays.</li>
</ul>
<div class="callout ok"><strong>The sensitivity row that turns this into action.</strong> Lower FE-5's risk from 8 to 4 — that is, the vendor confirms an API — and FE-5 rises from rank 12 to rank 5. The worksheet has just converted "we should chase the finance vendor" into "resolving RI-1 moves our fourth-most-valuable feature up seven places." That is what a prioritization model is actually for.</div>''',
   V('Deliverable 7')+'''
<h2>Ba feature giá trị nhất lại xếp hạng 9, 12 và 13</h2>
<p class="lead">Đây là ví dụ sắc nhất cho luận điểm này trong cả hai bộ tài liệu. <strong>FE-4, FE-5 và FE-9 mang ba điểm Value % cao nhất toàn bảng</strong> — 10,19; 9,06 và 9,43. Mô hình BIẾT chúng là những thứ giá trị nhất dự án. Nó vẫn xếp chúng hạng 9, 12 và 13, vì chúng đồng thời đắt nhất và rủi ro nhất.</p>
<p>Trong khi đó FE-12 (quản trị khung đăng ký) thắng nhờ rẻ, an toàn và không thể không có — chứ không phải nhờ quan trọng.</p>
<h3>Vì sao kế hoạch phát hành bác nó</h3>
<ul>
<li><strong>Mô hình không nhìn thấy bài toán kinh doanh.</strong> Chỉ FE-4 và FE-5 tạo ra BO-2 và BO-4 — tức 880 giờ công mỗi kỳ, thứ đã biện minh cho khoản đầu tư. Một bản 1.0 xây từ đầu bảng xếp hạng sẽ mở khung đăng ký rất mượt mà vẫn kiểm từng môn tiên quyết bằng tay.</li>
<li><strong>Mô hình coi rủi ro là lý do để hoãn.</strong> Rủi ro của FE-5 hoàn toàn nằm ở nhà cung cấp hệ thống tài chính (RI-1). Hoãn nó không làm rủi ro giảm — chỉ làm ta phát hiện muộn hơn, lúc còn ít thời gian để lách.</li>
<li><strong>Mô hình không nhìn thấy phụ thuộc.</strong> FE-10 xếp hạng 6 và vô giá trị nếu thiếu FE-5, vì nó chỉ hiển thị dữ liệu FE-5 lấy về.</li>
</ul>
<div class="callout ok"><strong>Dòng phân tích độ nhạy biến việc này thành hành động.</strong> Hạ rủi ro của FE-5 từ 8 xuống 4 — tức nhà cung cấp xác nhận có API — thì FE-5 nhảy từ hạng 12 lên hạng 5. Bảng tính vừa biến "nên đi hỏi nhà cung cấp tài chính" thành "giải quyết RI-1 đẩy feature giá trị thứ tư của chúng ta lên bảy bậc". Đó mới là việc mà một mô hình xếp ưu tiên sinh ra để làm.</div>''',
   '07-Prioritization-Analysis.md'),

 L('W1.8 — Deliverable 8: BA budget and headcount, three ways|||W1.8 — Deliverable 8: ngân sách và số BA, ba cách tính',
   'swr302-tp1-goi-08-estimation',
   'Công cụ ước lượng Chapter 19 với đầu vào lấy từ chính tài liệu nhóm, ba phương pháp cho 2,04 / 1,67 / 1,59 BA — lần này chúng gần nhau, và lý do vì sao sự đồng thuận đó vừa đáng tin vừa chưa đủ.',
   E('Deliverable 8')+'''
<h2>Three answers that nearly agree — and why that is not the end of it</h2>
<table>
<thead><tr><th>Method</th><th>BAs</th><th>Requirements-phase budget</th></tr></thead>
<tbody>
<tr><td>A — 15% of total project budget</td><td>2.04</td><td>USD 143,000</td></tr>
<tr><td>B — 6 developers per BA</td><td>1.67</td><td>USD 117,000</td></tr>
<tr><td>C — Activity-based, 893 hours</td><td>1.59</td><td>USD 112,000</td></tr>
</tbody>
</table>
<p>Unlike TP2, where the three methods spread from 1.71 to 2.25 for opposite reasons, here they land within 0.45 of each other. <strong>That is a finding, not a coincidence:</strong> CARS is a mid-sized system with only five interfacing systems and none of them large, so the three methods — which measure quite different things — happen to agree.</p>
<div class="callout warn"><strong>Agreement raises confidence in the number, but does not make it complete.</strong> All three methods price artifacts and headcount. None of them prices the two things this project's own risk register says will consume analyst time: <strong>RI-2</strong>, the curriculum-rule data audit, and <strong>TBD-5</strong>, finding out which programmes cannot be expressed as machine-evaluable rules at all.</div>
<h3>The commitment, and the honesty in §5</h3>
<p>Two BAs at USD 143,000 — method A's figure, because it is the only one with headroom for the curriculum-rule audit that assumption A2 makes a precondition of Release 1.0.</p>
<p>Then §5 undercuts its own argument, deliberately. At a local blended rate of USD 45/hour, method A jumps from 2.04 to 5.66 while B and C do not move at all — so the "headroom" used to justify the second BA is an artefact of a US rate. <strong>The document says so, and re-grounds the justification on RI-2 and TBD-5 instead.</strong> Noticing that your own supporting argument is rate-dependent, and saying it out loud, is worth more marks than an estimate that looks tidy.</p>''',
   V('Deliverable 8')+'''
<h2>Ba đáp số gần trùng nhau — và vì sao thế vẫn chưa xong chuyện</h2>
<table>
<thead><tr><th>Cách</th><th>Số BA</th><th>Ngân sách giai đoạn yêu cầu</th></tr></thead>
<tbody>
<tr><td>A — 15% tổng ngân sách dự án</td><td>2,04</td><td>143.000 USD</td></tr>
<tr><td>B — 6 lập trình viên một BA</td><td>1,67</td><td>117.000 USD</td></tr>
<tr><td>C — Theo hoạt động, 893 giờ</td><td>1,59</td><td>112.000 USD</td></tr>
</tbody>
</table>
<p>Khác với TP2, nơi ba cách trải từ 1,71 đến 2,25 vì những lý do trái ngược nhau, ở đây chúng nằm trong khoảng cách 0,45. <strong>Đó là một phát hiện, không phải trùng hợp:</strong> CARS là hệ thống cỡ vừa, chỉ có năm hệ thống giao tiếp và không cái nào lớn, nên ba cách — vốn đo những thứ khá khác nhau — tình cờ gặp nhau.</p>
<div class="callout warn"><strong>Đồng thuận làm tăng độ tin cậy của con số, nhưng không làm nó đầy đủ.</strong> Cả ba cách đều định giá sản phẩm làm ra và nhân sự. Không cách nào định giá hai thứ mà chính sổ rủi ro của dự án nói là sẽ ngốn thời gian analyst: <strong>RI-2</strong>, cuộc rà dữ liệu quy tắc chương trình, và <strong>TBD-5</strong>, việc tìm ra những ngành nào không thể diễn đạt thành luật máy đọc được.</div>
<h3>Cam kết, và sự trung thực ở §5</h3>
<p>Hai BA với 143.000 USD — lấy theo cách A, vì đó là cách duy nhất còn dư chỗ cho cuộc rà quy tắc chương trình mà giả định A2 biến thành điều kiện tiên quyết của bản 1.0.</p>
<p>Rồi §5 tự đánh sập lập luận của chính mình, một cách có chủ ý. Với giá BA nội địa 45 USD/giờ, cách A nhảy từ 2,04 lên 5,66 trong khi B và C không nhúc nhích — vậy cái "phần dư" dùng để biện minh cho BA thứ hai chỉ là sản phẩm phụ của một mức giá Mỹ. <strong>Tài liệu nói thẳng điều đó, rồi neo lại lập luận vào RI-2 và TBD-5.</strong> Nhận ra rằng chính luận cứ của mình phụ thuộc vào mức giá, và nói ra, đáng điểm hơn một bản ước lượng trông gọn gàng.</p>''',
   '08-Estimation-Analysis.md'),
]

build('TP1', 'content/academy/swr302/_md/en/tp1',
      'content/academy/swr302/package-tp1.mjs',
      'Worked package — TP1: Campus Academic & Registration (CARS)|||Bộ tài liệu mẫu — TP1: Học vụ & Đăng ký môn (CARS)',
      'Trọn bộ 8 deliverable của một bài Assignment làm trên đề TP1, cho hệ thống CARS của trường đại học giả định Northern Regional University. Tài liệu giữ nguyên tiếng Anh như khi nộp; phần dẫn giải mỗi tài liệu là song ngữ. Đọc kèm mục Assignment và bộ TP2 để so sánh hai cách xử lý khác nhau của cùng một khuôn.',
      HDR, lessons, root_vi='content/academy/swr302/_md/vi/tp1')
