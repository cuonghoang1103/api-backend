# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_package import build
import json, io as _io
IMG = json.load(_io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img_blocks.json'), encoding='utf-8'))['tp2']

HDR = """/**
 * SWR302 · Worked requirements package for assignment topic TP2 — the Order
 * Management and Fulfillment System (OMFS) of the fictional Nova Retail Group.
 *
 * All eight deliverables in full, so a student can read a complete, internally
 * consistent package rather than fragments. The documents themselves are in
 * English (that is what is submitted); the guidance around each one is bilingual.
 *
 * Generated from the source Markdown by scratchpad/tp2.py — edit the Markdown,
 * regenerate, do not hand-edit this file.
 */
"""

def L(n, slug, title, desc, en, vi, file=None, preview=False, html='', extra=''):
    return dict(title=title, slug=slug, desc=desc, en=en, vi=vi, file=file, preview=preview, html=html, extra=extra)

E = lambda t: f'<span class="eyebrow">Worked package · TP2 · {t}</span>'
V = lambda t: f'<span class="eyebrow">Bộ tài liệu mẫu · TP2 · {t}</span>'

lessons = [
 L(1,'swr302-tp2-goi-01-vision-scope',
   'W2.1 — Deliverable 1: Vision & Scope (full document)|||W2.1 — Deliverable 1: Vision & Scope (tài liệu đầy đủ)',
   'Tài liệu Vision & Scope hoàn chỉnh cho OMFS theo template Chapter 5: 6 business objective có baseline–target–deadline, thước đo thành công kèm nguồn dữ liệu, vision statement theo mẫu Moore, 6 rủi ro, 14 feature, 3 bản phát hành, 8 loại trừ, hồ sơ 9 stakeholder, bảng ưu tiên dự án.',
   E('Deliverable 1')+'''
<h2>Vision &amp; Scope — the complete document</h2>
<p class="lead">This is the whole deliverable, not an extract. Read it once for content, then a second time asking a different question: <strong>where does each number come from?</strong> Every baseline in §1.3 is either measured or declared as an assumption in §1.7 — nothing is left floating.</p>
<p>Four things in here are worth stealing for your own topic:</p>
<ul>
<li><strong>§1.3 objectives are a table, not prose.</strong> Baseline → target → deadline, one row each. Prose hides missing numbers; a table exposes them.</li>
<li><strong>§1.4 metrics name their data source.</strong> "Oversell rate" is useless until you say it is computed from OMFS order and exception records, weekly. Without that nobody can ever prove the project worked.</li>
<li><strong>§2.4 exclusions are not empty.</strong> Eight of them, each a thing a reader would otherwise assume was included. This is the section graders open first.</li>
<li><strong>§3.2 makes a trade-off.</strong> Schedule is the driver, so features and quality become degrees of freedom. Marking every dimension a driver would prove no decision was made.</li>
</ul>''',
   V('Deliverable 1')+'''
<h2>Vision &amp; Scope — tài liệu hoàn chỉnh</h2>
<p class="lead">Đây là trọn vẹn deliverable, không phải trích đoạn. Hãy đọc lượt đầu lấy nội dung, rồi đọc lượt hai với một câu hỏi khác: <strong>mỗi con số ở đây từ đâu ra?</strong> Mọi baseline ở §1.3 đều hoặc là đo được, hoặc được khai là giả định ở §1.7 — không có con số nào lơ lửng.</p>
<p>Bốn thứ trong đây đáng "mượn" cho đề tài của bạn:</p>
<ul>
<li><strong>§1.3 mục tiêu là BẢNG, không phải văn xuôi.</strong> Baseline → đích → hạn chót, mỗi dòng một cái. Văn xuôi giấu được con số thiếu; bảng thì phơi ra.</li>
<li><strong>§1.4 thước đo có gọi tên nguồn dữ liệu.</strong> "Tỉ lệ bán vượt" vô dụng cho tới khi bạn nói nó được tính từ bản ghi đơn hàng và ngoại lệ của OMFS, hàng tuần. Thiếu điều đó thì chẳng ai chứng minh được dự án đã thành công.</li>
<li><strong>§2.4 phần loại trừ KHÔNG để trống.</strong> Tám mục, mỗi mục là thứ người đọc dễ mặc định là có. Đây là mục người chấm mở ra đầu tiên.</li>
<li><strong>§3.2 có một sự đánh đổi thật.</strong> Lịch là driver, nên tính năng và chất lượng thành degree of freedom. Đánh mọi chiều là driver tức là chứng minh chưa quyết định gì.</li>
</ul>''',
   file='01-Vision-and-Scope.md', preview=True),

 L(2,'swr302-tp2-goi-02-use-cases',
   'W2.2 — Deliverable 2: 14 use case specifications (full)|||W2.2 — Deliverable 2: 14 đặc tả use case (đầy đủ)',
   'Trọn 14 đặc tả use case theo template 15 dòng của Chapter 8, cộng danh sách use case, bảng actor và bảng quan hệ include/extend. Mỗi use case đều có ít nhất một exception — chỗ nhóm yếu hay bỏ trống.',
   E('Deliverable 2')+'''
<h2>Fourteen use cases, written out in full</h2>
<p class="lead">The brief asks for at least ten. There are fourteen here for a reason: deliverable 7 asks you to <em>prioritize</em>, and a list in which everything is mandatory cannot be prioritized.</p>
<p>Read UC-03 <em>Reserve inventory</em> first. It is the use case that actually solves the problem in the brief, and it shows the three things a grader looks for:</p>
<ul>
<li><strong>A postcondition that forbids a half-finished state.</strong> POST-1 says every line is reserved or none is. That single sentence is what makes the use case implementable.</li>
<li><strong>Exceptions, plural.</strong> Four of them, including a concurrency conflict. A use case with only a happy path describes a world that does not exist.</li>
<li><strong>Business rules by ID only.</strong> BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 — never the rule text. Copying rule text into three documents guarantees they disagree by Week 8.</li>
</ul>
<div class="callout warn"><strong>Notice the flow numbering.</strong> Normal flow is <code>X.0</code>, alternatives are <code>X.Y</code>, exceptions are <code>X.Y.EZ</code>. It is the Chapter 8 convention and it is free marks — an exception numbered <code>3.0.E2</code> tells the reader exactly where in the normal flow it can occur.</div>''',
   V('Deliverable 2')+'''
<h2>Mười bốn use case, viết đủ</h2>
<p class="lead">Đề chỉ đòi ít nhất mười. Ở đây có mười bốn vì một lý do: deliverable 7 bắt bạn <em>xếp ưu tiên</em>, mà một danh sách toàn thứ bắt buộc thì không xếp ưu tiên được.</p>
<p>Hãy đọc UC-03 <em>Giữ chỗ tồn kho</em> trước. Đó là use case thực sự giải quyết vấn đề trong đề, và nó thể hiện đúng ba thứ người chấm tìm:</p>
<ul>
<li><strong>Postcondition cấm trạng thái dở dang.</strong> POST-1 nói mọi dòng đều được giữ chỗ hoặc không dòng nào cả. Đúng một câu đó làm use case này hiện thực được.</li>
<li><strong>Ngoại lệ, số nhiều.</strong> Bốn cái, kể cả tranh chấp đồng thời. Use case chỉ có luồng thuận là mô tả một thế giới không tồn tại.</li>
<li><strong>Business rule chỉ ghi ID.</strong> BR-01, BR-02, BR-04, BR-07, BR-08, BR-17 — không bao giờ ghi nội dung rule. Chép nội dung rule vào ba tài liệu là bảo đảm tới tuần 8 chúng mâu thuẫn nhau.</li>
</ul>
<div class="callout warn"><strong>Để ý cách đánh số luồng.</strong> Luồng chính là <code>X.0</code>, thay thế là <code>X.Y</code>, ngoại lệ là <code>X.Y.EZ</code>. Đó là quy ước chương 8 và là điểm cho không — một ngoại lệ đánh số <code>3.0.E2</code> nói với người đọc chính xác nó xảy ra ở đâu trong luồng chính.</div>''',
   file='02-Use-Cases.md', extra=IMG['uc']),

 L(3,'swr302-tp2-goi-03-business-rules',
   'W2.3 — Deliverable 3: 20 business rules, all five types|||W2.3 — Deliverable 3: 20 business rule, đủ năm loại',
   'Catalog 20 business rule phân loại đủ năm loại của Chapter 9, đánh dấu tĩnh/động, ghi nguồn từng rule, bảng những rule CỐ Ý không đưa vào phần mềm, cách khám phá rule, và ma trận truy vết rule → use case → requirement.',
   E('Deliverable 3')+'''
<h2>Twenty rules, and three things most teams miss</h2>
<p class="lead">The table itself is easy. The marks are in the three sections around it.</p>
<ul>
<li><strong>§2.2 — what "dynamic" costs you.</strong> Fourteen of the twenty rules are dynamic, so their values must be configurable by a named business role. A team that hard-codes a 30-day return window has guaranteed a code change the first time marketing runs a 45-day holiday promotion.</li>
<li><strong>§3 — rules deliberately NOT enforced in software.</strong> Four of them, with reasons. Recording what you decided <em>not</em> to build stops it being re-argued in a later release, and it proves you distinguished a business rule from a system requirement.</li>
<li><strong>§5 — traceability, and a check that was actually run.</strong> Every rule maps to a use case and a requirement, and the document states that a rule with no enforcing use case would be a gap. That is an assertion the grader can test in thirty seconds.</li>
</ul>
<div class="callout ok"><strong>BR-07 is the rule that does the work.</strong> "ATP = on-hand − reserved − damaged − safety stock" is a <em>computation</em>, not a constraint. Teams that write only "inventory must be accurate" have named the symptom; this names the mechanism.</div>''',
   V('Deliverable 3')+'''
<h2>Hai mươi rule, và ba thứ phần lớn nhóm bỏ sót</h2>
<p class="lead">Bản thân cái bảng thì dễ. Điểm nằm ở ba mục bao quanh nó.</p>
<ul>
<li><strong>§2.2 — "động" khiến bạn tốn gì.</strong> Mười bốn trong hai mươi rule là động, nên giá trị của chúng phải cấu hình được bởi một vai nghiệp vụ cụ thể. Nhóm nhúng cứng cửa sổ trả hàng 30 ngày là đã bảo đảm sẽ phải sửa mã ngay lần đầu marketing chạy khuyến mãi 45 ngày dịp lễ.</li>
<li><strong>§3 — những rule CỐ Ý không đưa vào phần mềm.</strong> Bốn cái, có lý do. Ghi lại thứ bạn quyết định <em>không</em> làm sẽ chặn nó bị đem ra cãi lại ở bản sau, và chứng minh bạn phân biệt được business rule với system requirement.</li>
<li><strong>§5 — truy vết, và một phép kiểm ĐÃ CHẠY THẬT.</strong> Mọi rule đều ánh xạ tới một use case và một requirement, và tài liệu nói rõ rule không có use case nào thực thi là một lỗ hổng. Đó là khẳng định người chấm kiểm được trong ba mươi giây.</li>
</ul>
<div class="callout ok"><strong>BR-07 mới là rule làm việc thật.</strong> "ATP = tồn thực − đã giữ chỗ − hỏng − tồn an toàn" là một <em>computation</em>, không phải constraint. Nhóm chỉ viết "tồn kho phải chính xác" là mới gọi tên triệu chứng; câu này gọi tên cơ chế.</div>''',
   file='03-Business-Rules.md'),

 L(4,'swr302-tp2-goi-04-srs',
   'W2.4 — Deliverable 4: the SRS, all sections (101 requirements)|||W2.4 — Deliverable 4: SRS đầy đủ mọi mục (101 yêu cầu)',
   'SRS hoàn chỉnh theo template Chapter 10: 14 nhóm tính năng với 101 functional requirement dùng "shall", 18 thuộc tính chất lượng viết bằng Planguage có SCALE/METER/MUST/PLAN, yêu cầu dữ liệu, 10 giao tiếp phần mềm, i18n, glossary, danh sách TBD và ma trận truy vết.',
   E('Deliverable 4')+'''
<h2>The SRS — the document that integrates everything else</h2>
<p class="lead">This is long, and it is meant to be. It is where use cases, business rules, data and quality all have to agree with each other. Three parts repay close reading:</p>
<ul>
<li><strong>§3 — 101 functional requirements.</strong> Every one uses <em>shall</em>, names one actor and one observable behaviour, and cites the rule it enforces. Pick any sentence at random and try to write a pass/fail test from it; if you can, it is a requirement.</li>
<li><strong>§6 — quality attributes in Planguage.</strong> SCALE says what is measured, METER says how, MUST is the level below which the release is unacceptable, PLAN is the target. "The system shall be fast" is an opinion; QA-2 says ≤ 0.8 s at the 95th percentile on the deployed handheld, measured on device. Only one of those can be tested.</li>
<li><strong>Appendix C — the TBD list.</strong> Five open items, each with an owner and a date. An SRS with no open items at Week 8 is not finished; it is unexamined. Showing a tracked TBD list is requirements <em>management</em>, which is CLO9.</li>
</ul>
<div class="callout warn"><strong>Read §2.5 and notice the sentence in the callout:</strong> "If A3 is wrong, this SRS is wrong." Naming the assumption your whole specification rests on — and saying out loud what happens if it fails — is what separates an analyst from a typist.</div>''',
   V('Deliverable 4')+'''
<h2>SRS — tài liệu tích hợp mọi thứ còn lại</h2>
<p class="lead">Nó dài, và phải dài. Đây là nơi use case, business rule, dữ liệu và chất lượng buộc phải khớp nhau. Ba phần đáng đọc kỹ:</p>
<ul>
<li><strong>§3 — 101 functional requirement.</strong> Mỗi câu dùng <em>shall</em>, gọi tên một actor và một hành vi quan sát được, và trỏ rule nó thực thi. Hãy bốc ngẫu nhiên một câu và thử viết một ca kiểm thử đạt/trượt từ nó; viết được thì đó là requirement.</li>
<li><strong>§6 — thuộc tính chất lượng viết bằng Planguage.</strong> SCALE nói đo cái gì, METER nói đo thế nào, MUST là mức dưới đó thì không phát hành được, PLAN là đích nhắm. "Hệ thống phải nhanh" là ý kiến; QA-2 nói ≤ 0,8 giây ở phân vị 95 trên đúng máy cầm tay đang dùng, đo ngay trên máy. Chỉ một trong hai cái đó kiểm được.</li>
<li><strong>Phụ lục C — danh sách TBD.</strong> Năm mục mở, mỗi mục có người phụ trách và ngày. Một SRS không còn mục mở nào ở tuần 8 không phải là đã xong, mà là chưa ai soi. Trình ra danh sách TBD có theo dõi chính là <em>quản lý</em> yêu cầu, tức CLO9.</li>
</ul>
<div class="callout warn"><strong>Hãy đọc §2.5 và để ý câu trong khung:</strong> "Nếu A3 sai thì SRS này sai." Gọi tên đúng cái giả định mà cả bản đặc tả đang đứng lên — và nói thẳng chuyện gì xảy ra nếu nó sụp — là thứ tách một analyst khỏi một người đánh máy.</div>''',
   file='04-SRS.md'),

 L(5,'swr302-tp2-goi-05-data-dictionary',
   'W2.5 — Deliverable 5: data dictionary, 110 entries|||W2.5 — Deliverable 5: data dictionary, 110 mục',
   'Data dictionary đầy đủ theo hướng dẫn Chapter 13: 110 mục xếp theo bảng chữ cái, dùng đúng ký pháp +, ( ), { }, min:max, [ a | b ], mọi phần tử trong cấu trúc đều có mục riêng, cột Values trỏ business rule thay vì chép lại.',
   E('Deliverable 5')+'''
<h2>110 entries, and the rule that is actually checked</h2>
<p class="lead">A data dictionary looks like clerical work and is graded like engineering. One check matters more than the rest: <strong>every element named inside a structure must have its own entry.</strong> Graders verify it by picking a structure at random and following each name.</p>
<p>Look at <code>Ship To Address</code>: it is composed of Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number, and all seven appear separately, alphabetically, elsewhere in the table. <code>Phone Number</code> is itself a structure — <code>"+84" + Subscriber Number</code> — so Subscriber Number has an entry too.</p>
<div class="callout ok"><strong>Two conventions worth copying.</strong> First, structures leave <em>Length</em> and <em>Values</em> blank; those columns apply to primitives only. Second, the <em>Values</em> column <strong>cites</strong> the governing business rule (<code>computed per BR-07</code>) instead of repeating it — same discipline as the use cases.</div>
<div class="pitfall"><strong>Build it while you write use cases, not afterwards.</strong> Every noun in a use case flow — "promised delivery date", "override reason", "inspection outcome" — is a candidate entry. Harvesting them at the end means reading everything twice.</div>''',
   V('Deliverable 5')+'''
<h2>110 mục, và cái luật thật sự bị kiểm</h2>
<p class="lead">Data dictionary trông như việc bàn giấy nhưng lại được chấm như việc kỹ thuật. Một phép kiểm quan trọng hơn cả: <strong>mọi phần tử được gọi tên bên trong một cấu trúc đều phải có mục riêng.</strong> Người chấm xác minh bằng cách bốc ngẫu nhiên một cấu trúc rồi dò từng cái tên.</p>
<p>Hãy nhìn <code>Ship To Address</code>: nó gồm Recipient Name + Street Address + Ward + District + Province + Postcode + Phone Number, và cả bảy đều xuất hiện riêng, theo bảng chữ cái, ở chỗ khác trong bảng. Bản thân <code>Phone Number</code> lại là một cấu trúc — <code>"+84" + Subscriber Number</code> — nên Subscriber Number cũng có mục riêng.</p>
<div class="callout ok"><strong>Hai quy ước đáng chép.</strong> Thứ nhất, cấu trúc thì để trống <em>Length</em> và <em>Values</em>; hai cột đó chỉ dành cho phần tử nguyên thuỷ. Thứ hai, cột <em>Values</em> <strong>trỏ</strong> tới business rule chi phối (<code>tính theo BR-07</code>) chứ không chép lại — cùng một kỷ luật với use case.</div>
<div class="pitfall"><strong>Hãy dựng nó TRONG LÚC viết use case, đừng để sau.</strong> Mỗi danh từ trong luồng use case — "ngày hứa giao", "lý do ghi đè", "kết quả kiểm tra" — là một mục ứng viên. Gom lại vào phút cuối nghĩa là phải đọc lại tất cả lần hai.</div>''',
   file='05-Data-Dictionary.md'),

 L(6,'swr302-tp2-goi-06-mockups',
   'W2.6 — Deliverable 6: mock-ups and how the three were chosen|||W2.6 — Deliverable 6: mock-up và cách chọn ba use case',
   'Năm mock-up cho các use case phức tạp nhất, cách xếp hạng để chọn ba cái, quyết định thiết kế mà mỗi mock-up đem đi hỏi stakeholder, và năm câu hỏi nó được sinh ra để chốt.',
   E('Deliverable 6')+'''
<h2>Mock-ups that ask a question</h2>
<p class="lead">Chapter 15 is blunt about this: a mock-up exists to make a stakeholder say "no, that is not what I meant". It is not a picture of a finished product, and a polished one actively harms you — stakeholders discuss colour instead of behaviour, and management believes you are nearly done.</p>
<p>Two things in this deliverable are worth copying into your own:</p>
<ul>
<li><strong>The selection table.</strong> "Complex" is defined as alternative flows + exceptions + actors, and every candidate is scored. Choosing the three that are easiest to draw is the obvious temptation; this shows the work instead.</li>
<li><strong>Two of the five mock-ups show a FAILURE state.</strong> M1b is a routing attempt that hit the split limit; M4 is a tracking page whose carrier has gone silent for 46 hours. A mock-up set with no failure state proves nothing about whether the design handles reality.</li>
</ul>
<div class="callout ok"><strong>§4 is the part most teams skip.</strong> Five questions the mock-ups were built to settle, each with the stakeholder's answer — and one left open as TBD-4 because the brand team has not approved the wording. Inventing an answer would have been worse than recording that there is not one yet.</div>''',
   V('Deliverable 6')+'''
<h2>Mock-up để ĐẶT một câu hỏi</h2>
<p class="lead">Chương 15 nói thẳng: mock-up sinh ra để khiến một stakeholder nói "không, ý tôi không phải vậy". Nó không phải bức ảnh của sản phẩm hoàn thiện, và làm nó bóng bẩy còn hại — stakeholder sẽ bàn về màu sắc thay vì hành vi, còn quản lý thì tưởng bạn sắp xong.</p>
<p>Hai thứ trong deliverable này đáng chép sang bài của bạn:</p>
<ul>
<li><strong>Bảng chọn.</strong> "Phức tạp" được định nghĩa là số luồng thay thế + số ngoại lệ + số actor, và mọi ứng viên đều được chấm. Chọn ba cái dễ vẽ nhất là cám dỗ hiển nhiên; cái bảng này cho thấy bạn đã làm việc thật.</li>
<li><strong>Hai trong năm mock-up thể hiện trạng thái HỎNG.</strong> M1b là một lượt định tuyến chạm trần tách đơn; M4 là trang tra cứu mà hãng vận chuyển đã im lặng 46 giờ. Một bộ mock-up không có trạng thái hỏng thì không chứng minh được gì về việc thiết kế có chịu nổi thực tế hay không.</li>
</ul>
<div class="callout ok"><strong>§4 là phần phần lớn nhóm bỏ qua.</strong> Năm câu hỏi mà mock-up được dựng lên để chốt, mỗi câu kèm câu trả lời của stakeholder — và một câu để mở thành TBD-4 vì đội thương hiệu chưa duyệt cách diễn đạt. Bịa ra một câu trả lời còn tệ hơn là ghi nhận rằng chưa có.</div>''',
   file='06-Mockups.md', extra=IMG['mock']),

 L(7,'swr302-tp2-goi-07-prioritization',
   'W2.7 — Deliverable 7: prioritization, and why the ranking was overruled|||W2.7 — Deliverable 7: xếp ưu tiên, và vì sao thứ hạng bị bác',
   'Bảng value/cost/risk của Chapter 16 với trọng số có biện minh, các mục bắt buộc tách riêng không chấm, thứ hạng thật của 13 feature, và — phần quan trọng nhất — lập luận vì sao kế hoạch phát hành không theo thứ hạng đó.',
   E('Deliverable 7')+'''
<h2>The ranking says one thing, the release plan says another</h2>
<p class="lead">This is the deliverable where the marks are not in the spreadsheet. Anyone can type thirteen rows of numbers. The analysis is in §5, where the ranking and the release plan openly disagree and someone has to explain which one wins.</p>
<p>The model ranks <strong>FE-10 self-service tracking first</strong> — cheap, low risk, solid value. Release 1.0 ships FE-3, FE-4 and FE-5 instead, which sit at ranks 6, 8 and 10. Both are right, for reasons the model cannot see:</p>
<ul>
<li>The model has <strong>no concept of dependency</strong>. Showing a customer an order status that is wrong, because stock was oversold, is worse than showing them nothing. FE-10 only delivers value once status is trustworthy.</li>
<li>The model has <strong>no concept of the business case</strong>. BO-1 and BO-2 are what the sponsor funded, and only FE-3, FE-4 and FE-5 deliver them.</li>
</ul>
<div class="callout ok"><strong>Where the worksheet IS decisive:</strong> deciding what to drop when the release runs late. Rank order says defer FE-7 first — the most expensive item in Release 1.0 that is not FE-3 or FE-5, and the warehouse can live with printed slips for one more release. That is a real answer to a real question.</div>
<div class="pitfall"><strong>Note §3 — what was excluded from scoring.</strong> Wiegers says explicitly not to score features that must be included regardless. FE-1 order ingestion is not a candidate for prioritization; nothing else can run without it. A worksheet where a mandatory feature ranks low shows the tool was used without being read.</div>''',
   V('Deliverable 7')+'''
<h2>Thứ hạng nói một đằng, kế hoạch phát hành nói một nẻo</h2>
<p class="lead">Đây là deliverable mà điểm KHÔNG nằm trong bảng tính. Ai cũng gõ được mười ba dòng số. Phần phân tích nằm ở §5, nơi thứ hạng và kế hoạch phát hành công khai mâu thuẫn và phải có người giải thích bên nào thắng.</p>
<p>Mô hình xếp <strong>FE-10 tra cứu tự phục vụ hạng nhất</strong> — rẻ, ít rủi ro, giá trị chắc. Bản 1.0 lại ship FE-3, FE-4 và FE-5, những cái nằm ở hạng 6, 8 và 10. Cả hai đều đúng, vì những lý do mô hình không nhìn thấy:</p>
<ul>
<li>Mô hình <strong>không có khái niệm phụ thuộc</strong>. Cho khách xem một trạng thái đơn hàng sai, vì hàng đã bị bán vượt, còn tệ hơn là không cho xem gì. FE-10 chỉ tạo ra giá trị khi trạng thái đã đáng tin.</li>
<li>Mô hình <strong>không có khái niệm bài toán kinh doanh</strong>. BO-1 và BO-2 mới là thứ nhà tài trợ bỏ tiền, và chỉ FE-3, FE-4, FE-5 tạo ra chúng.</li>
</ul>
<div class="callout ok"><strong>Chỗ bảng ưu tiên THỰC SỰ quyết định:</strong> chọn bỏ cái gì khi bản phát hành trễ. Thứ hạng nói hoãn FE-7 trước — món đắt nhất trong bản 1.0 mà không phải FE-3 hay FE-5, và kho có thể sống với phiếu in thêm một bản nữa. Đó là câu trả lời thật cho một câu hỏi thật.</div>
<div class="pitfall"><strong>Để ý §3 — cái gì bị loại khỏi việc chấm.</strong> Wiegers nói thẳng là đừng chấm những tính năng buộc phải có. FE-1 tiếp nhận đơn không phải ứng viên xếp ưu tiên; không có nó thì chẳng thứ gì chạy được. Một bảng mà tính năng bắt buộc lại xếp hạng thấp cho thấy công cụ được dùng mà không được đọc.</div>''',
   file='07-Prioritization-Analysis.md'),

 L(8,'swr302-tp2-goi-08-estimation',
   'W2.8 — Deliverable 8: BA budget and headcount, three ways|||W2.8 — Deliverable 8: ngân sách và số BA, ba cách tính',
   'Công cụ ước lượng Chapter 19 với đầu vào lấy từ chính tài liệu của nhóm, ba phương pháp cho ba đáp số (2,25 / 2,00 / 1,71 BA), lý do phương pháp theo hoạt động lại thấp nhất, con số được cam kết, và điều gì sẽ khiến đổi ý.',
   E('Deliverable 8')+'''
<h2>Three answers, and the one that was committed to</h2>
<p class="lead">The tool estimates the number of BAs and the BA budget three independent ways. They disagree — and the disagreement <em>is</em> the deliverable. Reporting three numbers without explaining the gap is filling in a spreadsheet, not estimating.</p>
<table>
<thead><tr><th>Method</th><th>BAs</th><th>Requirements-phase budget</th></tr></thead>
<tbody>
<tr><td>A — 15% of total project budget</td><td>2.25</td><td>USD 180,000</td></tr>
<tr><td>B — 6 developers per BA</td><td>2.00</td><td>USD 160,000</td></tr>
<tr><td>C — Activity-based, 1,097 hours</td><td><strong>1.71</strong></td><td>USD 137,000</td></tr>
</tbody>
</table>
<p><strong>The surprise worth explaining:</strong> method C came out <em>lowest</em>, not highest. OMFS has modest artifact counts — 14 use cases, 20 screens — but twelve interfacing systems, and the activity model prices use cases and screens heavily while pricing conversations not at all. It contains no line for the four elicitation sessions, the peer inspections or the change control that runs to release.</p>
<div class="callout ok"><strong>The commitment, and the trigger.</strong> Two BAs at USD 160,000 — rounding C up to absorb the work it does not price. Then, stated in advance: escalate to 2.25 if three or more TBD items are still open at Week 10. Saying what would change your mind <em>before</em> it happens is the difference between an estimate and a guess.</div>
<div class="pitfall"><strong>§5 exposes what method A actually measures.</strong> At a local blended rate of USD 45/hour instead of the tool's USD 125, method A jumps from 2.25 BAs to 6.25 while B and C do not move at all. Method A measures how many analyst-hours 15% of the budget happens to buy — not how much analysis the project needs.</div>''',
   V('Deliverable 8')+'''
<h2>Ba đáp số, và cái được cam kết</h2>
<p class="lead">Công cụ ước tính số BA và ngân sách BA bằng ba cách độc lập. Chúng không khớp nhau — và chính sự không khớp đó <em>là</em> phần bài làm. Báo ba con số mà không giải thích khoảng chênh là điền bảng tính, không phải ước lượng.</p>
<table>
<thead><tr><th>Cách</th><th>Số BA</th><th>Ngân sách giai đoạn yêu cầu</th></tr></thead>
<tbody>
<tr><td>A — 15% tổng ngân sách dự án</td><td>2,25</td><td>180.000 USD</td></tr>
<tr><td>B — 6 lập trình viên một BA</td><td>2,00</td><td>160.000 USD</td></tr>
<tr><td>C — Theo hoạt động, 1.097 giờ</td><td><strong>1,71</strong></td><td>137.000 USD</td></tr>
</tbody>
</table>
<p><strong>Điều bất ngờ đáng giải thích:</strong> cách C ra <em>thấp nhất</em>, không phải cao nhất. OMFS có số sản phẩm khiêm tốn — 14 use case, 20 màn hình — nhưng tới mười hai hệ thống giao tiếp, mà mô hình hoạt động định giá use case và màn hình rất nặng còn các cuộc trao đổi thì không tính đồng nào. Nó không có dòng nào cho bốn buổi elicitation, các lượt review chéo hay việc kiểm soát thay đổi chạy tới lúc phát hành.</p>
<div class="callout ok"><strong>Cam kết, và cái ngưỡng kích hoạt.</strong> Hai BA với 160.000 USD — làm tròn C lên để hấp thụ phần việc nó không định giá. Rồi nói trước: nâng lên 2,25 nếu tới tuần 10 danh sách TBD vẫn còn từ ba mục trở lên. Nói ra điều gì sẽ khiến mình đổi ý <em>trước khi</em> nó xảy ra chính là khác biệt giữa một ước lượng và một phỏng đoán.</div>
<div class="pitfall"><strong>§5 phơi ra thứ mà cách A thật sự đo.</strong> Với giá BA nội địa 45 USD/giờ thay vì 125 USD của công cụ, cách A nhảy từ 2,25 BA lên 6,25 trong khi B và C không nhúc nhích. Cách A đo xem 15% ngân sách mua được bao nhiêu giờ công analyst — chứ không đo dự án cần bao nhiêu phân tích.</div>''',
   file='08-Estimation-Analysis.md'),
]

build('TP2', 'content/academy/swr302/_md/en/tp2',
      'content/academy/swr302/package-tp2.mjs',
      'Worked package — TP2: E-Commerce Order Management (OMFS)|||Bộ tài liệu mẫu — TP2: Quản lý đơn hàng TMĐT (OMFS)',
      'Trọn bộ 8 deliverable của một bài Assignment làm trên đề TP2, cho hệ thống OMFS của công ty giả định Nova Retail Group. Tài liệu giữ nguyên tiếng Anh như khi nộp; phần dẫn giải mỗi tài liệu là song ngữ. Đọc kèm mục Assignment để biết vì sao mỗi phần được viết như vậy.',
      HDR, lessons, root_vi='content/academy/swr302/_md/vi/tp2')
