/**
 * SSL101c · Mooc 4 (deck 'ssl4') — slide 22–43, học theo từng slide.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). File /tmp/ssl101c-text/ssl4.txt ghi "không có chữ" cho 60/64 slide —
 * KHÔNG dùng được. Toàn bộ 22 slide của dải này đã được ĐỌC THẲNG TỪ ẢNH
 * (/tmp/ssl101c-slides/ssl4/022.webp … 043.webp), từng chữ một.
 *
 * Nội dung THẬT của dải 22–43 (mục lục do người soạn lập sau khi đọc ảnh):
 *   22–24  2.4a Participating in Group Work — mục tiêu · proposals vs assertions · Summary
 *   25–28  3.2a (Part 2) Analysing Essay Questions — mục tiêu · HAI slide cùng
 *          tiêu đề "Essay questions – Understanding what to do" · Summary
 *   29–30  3.2b Understanding & Interpreting Reports and Proposals — mục tiêu · Summary
 *   31–32  3.3a Conducting Research for Essays — mục tiêu · Summary: Research
 *   33–34  3.3b Conducting Research for Reports & Proposals — mục tiêu · Summary
 *   35–37  3.4a Planning Essays — mục tiêu · Summary: Essays – Deductive arguments ·
 *          Summary: Planning Reports and Proposals (đặt SỚM, trước mục 3.4b)
 *   38–39  3.4b Planning Reports & Proposals — mục tiêu · Summary (LẶP LẠI slide 37)
 *   40–41  4.2a Drafting Essays — mục tiêu · Summary: Drafting Essays
 *   42–43  4.2c Coherence & Cohesion for Essays and Reports — mục tiêu · Summary
 *
 * ⚠️ BẨY LỚN 1 — slide 23 dạy "Proposals and ASSERTIONS in group work", nhưng
 * slide tóm tắt 24 lại viết "Two types of first actions: proposals and
 * ANNOUNCEMENTS". Hai chữ khác nhau cho cùng một cặp, cách nhau đúng một slide.
 * Giữ nguyên cả hai, đã nêu thẳng ở phần Bẫy.
 *
 * ⚠️ BẨY LỚN 2 — slide 26 và slide 27 IN CÙNG MỘT TIÊU ĐỀ "Essay questions –
 * Understanding what to do" nhưng nội dung khác hẳn (26 = phân tích đề; 27 =
 * khám phá đề).
 *
 * ⚠️ BẨY LỚN 3 — slide 37 và slide 39 là CÙNG MỘT SLIDE "Summary: Planning
 * Reports and Proposals". Bản ở slide 39 bị phóng to/tràn mép phải, chữ cuối
 * dòng bị cắt ("Discussion/Conclusio…", "Presentation of data –"). Slide 37 lại
 * nằm TRƯỚC slide mở đầu mục 3.4b (slide 38) — tức đặt sai chỗ.
 *
 * ⚠️ LẶP NGUYÊN KHỐI BULLET — slide 35 (3.4a) và slide 38 (3.4b) in BA gạch đầu
 * dòng GIỐNG HỆT nhau. Slide 42 (4.2c Coherence & Cohesion) chép lại BỐN gạch
 * đầu dòng của slide 40 (4.2a Drafting Essays), chỉ bỏ chữ "understand and" và
 * đổi "first essay draft" → "first draft" — nên mục tiêu của mục Mạch lạc &
 * Liên kết KHÔNG hề nhắc tới coherence hay cohesion.
 *
 * ⚠️ LỖI CHÍNH TẢ — slide 27 in "upacked" (đúng phải là "unpacked"); slide 41
 * in "Smith 2002" thiếu dấu phẩy trước năm.
 *
 * ⚠️ LỆCH NĂM NGUỒN TRÍCH giữa các slide: Greetham 2013 (s32, s41) ↔ Greetham
 * 2012 (s36) · Reinders et al. 2012 (s36) ↔ 2013 (s41) · Smith 2003 (s27) ↔
 * Smith 2002 (s41). Kiểu viết cũng lệch: "Nesi & Gardner" (s30, s37) ↔ "Nesi
 * and Gardner" (s34); "Brick et al., 2016" (s36, s41) ↔ "Brick, Herke & Wong,
 * 2016" (s37, s39).
 *
 * ⚠️ ĐÁNH SỐ MỤC NHẢY CÓC: 2.4a → 3.2a (không có 3.1) → 3.2b → 3.3a → 3.3b →
 * 3.4a → 3.4b → 4.2a → 4.2c (không có 4.1, không có 4.2b trong dải này).
 *
 * ⚠️ HAI TEMPLATE: slide mục tiêu (22, 25, 29, 31, 33, 35, 38, 40, 42) dùng dấu
 * chấm tròn "•", khiên logo Sydney ở góc DƯỚI PHẢI và một vạch dọc mảnh ở góc
 * trên trái. Slide nội dung/tóm tắt dùng gạch ngang "–" và khiên ở góc DƯỚI
 * TRÁI. Nhìn khiên là biết đang xem slide loại nào.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl4';

export default {
  title: '4.0b — Slide by slide: Group work, essay questions, research, planning, drafting, coherence & cohesion (slides 22–43)|||4.0b — Slide bài giảng: Làm việc nhóm, bóc đề, nghiên cứu, lập dàn ý, viết nháp, mạch lạc & liên kết (slide 22–43)',
  slug: 'ssl101c-4-0b-slides-de-bai-nghien-cuu-dan-y-mach-lac',
  type: 'DOCUMENT',
  description: 'Học theo từng slide 22 slide giữa của Mooc 4 (slide 22–43) — trọn vòng đời một bài viết ở đại học. Khép lại phần làm việc nhóm (proposal vs assertion), rồi đi hết bốn chặng: BÓC ĐỀ (key concepts + key terms: parameters, contexts, processes), NGHIÊN CỨU (luôn đến SAU khi đã hiểu đề và có ý riêng), LẬP DÀN Ý (lập luận diễn dịch cho bài luận; General–Specific–General và IMRD cho báo cáo nghiên cứu; Opening–Problem–Data–Processing–Closing cho báo cáo nghề nghiệp), VIẾT NHÁP (mở bài ≤ 10%, "a map, a microcosm & a marketing tool") và cuối cùng MẠCH LẠC & LIÊN KẾT (3 câu hỏi coherence, 4 công cụ cohesion). Kèm dàn ý thật có phân bổ số từ, đoạn PEEL mẫu, và một đoạn văn yếu được sửa từng chỗ.',
  content: [
    walkHead(D, 22, 43,
      'These 22 slides carry Mooc 4 from the end of group work through the entire life of a written assignment: interpret the question, research it, plan it, draft it, then make it coherent and cohesive. Watch for the deck bugs flagged along the way — a duplicated slide, two slides sharing a title, and a summary that renames a key term.',
      'Hai mươi hai slide này đưa Mooc 4 từ chỗ khép lại phần làm việc nhóm đi hết vòng đời một bài viết: bóc đề, nghiên cứu, lập dàn ý, viết nháp, rồi làm cho nó mạch lạc và liên kết. Để ý các lỗi của chính bộ deck được nêu dọc đường — một slide bị lặp, hai slide chung tiêu đề, và một slide tóm tắt đổi tên một thuật ngữ then chốt.'),
    walk(D, [
      [22, '2.4a Participating in Group Work (learning outcomes)',
        `<p class="y-chinh">🎯 A section-opening slide with only <strong>TWO learning outcomes</strong>: <strong>understand the purpose of group work for achieving mutual goals</strong> · <strong>use effective communication and leadership skills to move from group work to teamwork</strong>. Two, not three — almost every other objectives slide in this deck has three or four.</p>
<table>
<tr><th>Outcome</th><th>The key word</th><th>What it means in practice</th></tr>
<tr><td><strong>Understand the purpose of group work for achieving mutual goals</strong></td><td><em>mutual</em></td><td>The goal is shared, so it cannot be reached by one person working harder. The purpose is the shared outcome, not the division of labour</td></tr>
<tr><td><strong>Move from group work to teamwork</strong></td><td><em>move from … to</em></td><td>Group work is the starting state, teamwork is the destination. The vehicle is named on the slide: communication and leadership skills</td></tr>
</table>
<ul>
<li><strong>Group work and teamwork are NOT synonyms here.</strong> A group is several people assigned the same task; a team is a group that has built joint commitment. The slide treats the difference as a journey you have to make deliberately.</li>
<li><strong>Leadership appears even though nobody was appointed leader.</strong> That is the point of the whole section: in peer-to-peer university work, leadership is a behaviour anyone can supply, not a title someone holds.</li>
<li><strong>Applied at FPTU.</strong> An SWP391 team that only splits the work is a group. It becomes a team on the day someone says "our demo is in three weeks, let us agree now what done means" — that one sentence is both communication and leadership.</li>
</ul>
<p class="meo">💡 Count hook: this objectives slide has <strong>2</strong> bullets. Slides 25, 29, 31, 33, 35 and 38 have <strong>3</strong>; slides 40 and 42 have <strong>4</strong>. The MOOC exam loves asking how many.</p>
<p class="pitfall">⚠️ Section numbering jumps here. This is <strong>2.4a</strong>, and the very next objectives slide is <strong>3.2a (Part 2)</strong> — there is no 2.4b, 3.1 or 3.2a (Part 1) in the review deck. Do not assume the missing numbers were never taught; they were, in the MOOC videos.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu một mục, chỉ có <strong>HAI mục tiêu</strong>: <strong>hiểu MỤC ĐÍCH của làm việc nhóm để đạt các mục tiêu CHUNG</strong> · <strong>dùng kỹ năng giao tiếp và lãnh đạo hiệu quả để chuyển TỪ làm việc nhóm SANG làm việc đồng đội</strong>. Hai, không phải ba — gần như mọi slide mục tiêu khác trong deck này đều có ba hoặc bốn.</p>
<table>
<tr><th>Mục tiêu</th><th>Chữ then chốt</th><th>Nghĩa là gì trong thực tế</th></tr>
<tr><td><strong>Hiểu mục đích của group work để đạt mutual goals</strong></td><td><em>mutual</em> (chung)</td><td>Mục tiêu được CHIA SẺ, nên một người cày khoẻ hơn cũng không tới đích. Mục đích là kết quả chung, không phải việc chia phần</td></tr>
<tr><td><strong>Chuyển từ group work sang teamwork</strong></td><td><em>move from … to</em></td><td>Group work là trạng thái xuất phát, teamwork là đích đến. Phương tiện được gọi tên ngay trên slide: kỹ năng giao tiếp và lãnh đạo</td></tr>
</table>
<ul>
<li><strong>Group work và teamwork KHÔNG đồng nghĩa ở đây.</strong> Nhóm (group) là mấy người được giao chung một việc; đội (team) là cái nhóm đã dựng được cam kết chung. Slide coi khoảng cách đó là một đoạn đường bạn phải cố ý đi.</li>
<li><strong>Chữ "lãnh đạo" xuất hiện dù chẳng ai được bổ nhiệm làm nhóm trưởng.</strong> Đó chính là ý của cả mục: trong việc học ngang hàng, lãnh đạo là một HÀNH VI bất cứ ai cũng cung cấp được, không phải một CHỨC DANH ai đó nắm giữ.</li>
<li><strong>Áp dụng ở FPTU.</strong> Nhóm SWP391 chỉ biết chia việc thì vẫn là group. Nó thành team vào đúng ngày có người nói "ba tuần nữa demo rồi, giờ thống nhất luôn thế nào là XONG đi" — một câu đó vừa là giao tiếp vừa là lãnh đạo.</li>
</ul>
<p class="meo">💡 Mẹo đếm: slide mục tiêu này có <strong>2</strong> gạch đầu dòng. Slide 25, 29, 31, 33, 35 và 38 có <strong>3</strong>; slide 40 và 42 có <strong>4</strong>. Đề của MOOC rất thích hỏi "bao nhiêu".</p>
<p class="pitfall">⚠️ Đánh số mục NHẢY ngay tại đây. Slide này là <strong>2.4a</strong>, mà slide mục tiêu kế tiếp đã là <strong>3.2a (Part 2)</strong> — trong deck ôn tập không có 2.4b, không có 3.1, cũng không có 3.2a (Part 1). Đừng suy ra là những phần đó chưa từng được dạy; chúng có dạy, trong video của MOOC.</p>`],

      [23, 'Proposals and assertions in group work',
        `<p class="y-chinh">🎯 Three bullets that decide <strong>which speech act you use to start something in a group</strong>: <strong>assertions may be more appropriate for group leaders, such as managers in the workplace</strong> · <strong>proposals may be more appropriate in peer-peer group work at university</strong> · <strong>a possible exception is if the group has nominated a leader</strong>.</p>
<table>
<tr><th></th><th>Assertion</th><th>Proposal</th></tr>
<tr><td><strong>What it does</strong></td><td>States that something WILL happen</td><td>Puts something forward for the others to accept or refuse</td></tr>
<tr><td><strong>Who it fits</strong></td><td>Group leaders, managers in the workplace</td><td>Peer-to-peer group work at university</td></tr>
<tr><td><strong>Sounds like</strong></td><td>"We are using MySQL for this project."</td><td>"Shall we use MySQL for this project?" / "How about we use MySQL?"</td></tr>
<tr><td><strong>Reply it invites</strong></td><td>Compliance (or a confrontation to refuse)</td><td>Agreement, or a counter-proposal — refusing costs nothing socially</td></tr>
<tr><td><strong>Exception</strong></td><td colspan="2">If the group HAS nominated a leader, that leader may legitimately assert</td></tr>
</table>
<ul>
<li><strong>Authority is what licenses an assertion.</strong> A manager can assert because the structure gives them the right to. A classmate has no such right, so an assertion from them reads as bossiness even when the content is correct.</li>
<li><strong>The hedge "may be" is on the slide twice.</strong> This is a tendency, not a law. The MOOC is deliberately not saying assertions are forbidden at university.</li>
<li><strong>The exception is earned, not claimed.</strong> The wording is "if the group HAS NOMINATED a leader" — the group grants it. Declaring yourself leader does not unlock assertions.</li>
<li><strong>Applied at FPTU.</strong> Your SWP391 team usually has no formal leader in week 1, so propose. Once the team votes someone team lead in week 2, that person may assert schedules — and the rest of you still propose.</li>
</ul>
<p class="dap-an">✅ Practice: turn the assertion "I'll do the database, you two write the report" into a proposal. Answer: <em>"How about I take the database, and the two of you split the report? Does that match what you wanted to work on?"</em> — the content is identical; what changed is that refusal is now a legal move.</p>
<p class="pitfall">⚠️ Remember the word <strong>ASSERTIONS</strong> on this slide. The summary on slide 24 renames the pair "proposals and <strong>ANNOUNCEMENTS</strong>" — see the trap note there.</p>`,
        `<p class="y-chinh">🎯 Ba gạch đầu dòng quyết định <strong>bạn dùng hành vi ngôn ngữ nào để khởi xướng một việc trong nhóm</strong>: <strong>KHẲNG ĐỊNH (assertion) hợp hơn với người dẫn dắt nhóm, kiểu quản lý ở nơi làm việc</strong> · <strong>ĐỀ XUẤT (proposal) hợp hơn với làm việc nhóm ngang hàng ở đại học</strong> · <strong>một NGOẠI LỆ có thể có là khi nhóm ĐÃ bầu ra người dẫn dắt</strong>.</p>
<table>
<tr><th></th><th>Assertion (khẳng định)</th><th>Proposal (đề xuất)</th></tr>
<tr><td><strong>Nó làm gì</strong></td><td>Tuyên bố rằng một việc SẼ xảy ra</td><td>Đưa một việc ra để người khác nhận hoặc từ chối</td></tr>
<tr><td><strong>Hợp với ai</strong></td><td>Người dẫn dắt nhóm, quản lý nơi làm việc</td><td>Làm việc nhóm NGANG HÀNG ở đại học</td></tr>
<tr><td><strong>Nghe như</strong></td><td>"Dự án này mình dùng MySQL."</td><td>"Dự án này dùng MySQL nhé?" / "Hay là mình dùng MySQL?"</td></tr>
<tr><td><strong>Mời gọi phản hồi kiểu gì</strong></td><td>Tuân theo (muốn từ chối thì phải đối đầu)</td><td>Đồng ý, hoặc đề xuất ngược lại — từ chối không tốn gì về mặt quan hệ</td></tr>
<tr><td><strong>Ngoại lệ</strong></td><td colspan="2">Nếu nhóm ĐÃ bầu một người dẫn dắt, người đó có thể khẳng định một cách chính đáng</td></tr>
</table>
<ul>
<li><strong>Cái cho phép một assertion là THẨM QUYỀN.</strong> Quản lý khẳng định được vì cấu trúc tổ chức trao cho họ quyền đó. Bạn cùng lớp không có quyền ấy, nên một assertion từ họ nghe ra là hống hách kể cả khi nội dung đúng.</li>
<li><strong>Cụm rào đón "may be" xuất hiện HAI lần trên slide.</strong> Đây là xu hướng, không phải luật. MOOC cố tình không nói assertion bị cấm ở đại học.</li>
<li><strong>Ngoại lệ là thứ được TRAO, không phải thứ tự nhận.</strong> Chữ trên slide là "if the group HAS NOMINATED a leader" — nhóm trao cho. Tự phong mình làm trưởng nhóm thì không mở khoá được assertion.</li>
<li><strong>Áp dụng ở FPTU.</strong> Nhóm SWP391 tuần 1 thường chưa có trưởng nhóm chính thức, nên hãy ĐỀ XUẤT. Tuần 2 nhóm bầu ra team lead rồi thì người đó khẳng định lịch được — còn những người còn lại vẫn đề xuất.</li>
</ul>
<p class="dap-an">✅ Bài tập: đổi câu khẳng định "Tao làm database, hai đứa mày viết báo cáo" thành một đề xuất. Đáp án: <em>"Hay là tớ nhận phần database, còn hai cậu chia nhau báo cáo? Có đúng phần các cậu muốn làm không?"</em> — nội dung y hệt; thứ đã đổi là việc TỪ CHỐI bây giờ trở thành một nước đi hợp lệ.</p>
<p class="pitfall">⚠️ Nhớ kỹ chữ <strong>ASSERTIONS</strong> trên slide này. Slide tóm tắt 24 đổi tên cặp đó thành "proposals and <strong>ANNOUNCEMENTS</strong>" — xem ghi chú bẫy ở slide ấy.</p>`],

      [24, 'Summary: Participating in group work',
        `<p class="y-chinh">🎯 The section summary, in three bullets: <strong>Purpose: to practice working efficiently and cohesively in teams</strong> · <strong>group work is a joint activity; mutual goals are carried out through communication to establish joint commitment, done in projective pairs (Clark, 2005, 2006, 2012)</strong> · <strong>two types of first actions: proposals and announcements</strong>.</p>
<table>
<tr><th>Technical term</th><th>Definition to memorise</th><th>Example</th></tr>
<tr><td><strong>Joint activity</strong></td><td>An activity that only exists because two or more people are doing it together</td><td>A code review: one person cannot review their own pull request into a review</td></tr>
<tr><td><strong>Joint commitment</strong></td><td>The shared obligation created BY communication — not by the task list</td><td>"Sprint review Friday 7pm?" — "Yes" · now both of you are bound</td></tr>
<tr><td><strong>Projective pair</strong></td><td>A two-part unit where the FIRST action projects (makes relevant) a SECOND action from the other person</td><td>Proposal → acceptance/refusal · question → answer · offer → take-up</td></tr>
<tr><td><strong>First actions</strong></td><td>The opening half of a projective pair</td><td>Proposals · announcements (per this slide) / assertions (per slide 23)</td></tr>
</table>
<ul>
<li><strong>The whole model in one sentence:</strong> mutual goals → communication → joint commitment. Communication is the machinery in the middle; without it a shared goal produces nothing binding.</li>
<li><strong>"Projective pairs" is the one piece of technical vocabulary here</strong> and the one most likely to be tested by name. The word <em>projective</em> means the first action <em>projects</em> a second — it makes a specific reply expected, so silence is itself an answer.</li>
<li><strong>The citation is one author with three years: (Clark, 2005, 2006, 2012)</strong>, not three different authors. Count it as ONE source cited three times.</li>
<li><strong>Applied at FPTU.</strong> This is why a message in the group chat that nobody replies to has created no commitment at all. A projective pair needs its second half; "seen" is not acceptance.</li>
</ul>
<p class="pitfall">⚠️ <strong>The biggest trap in this range.</strong> Slide 23 is titled "Proposals and <strong>assertions</strong> in group work". This summary, one slide later, says the two types of first actions are "proposals and <strong>announcements</strong>". The deck uses two different words for the same slot and never reconciles them. In an exam, read the stem: if the question quotes the summary, answer <em>announcements</em>; if it quotes the group-work slide, answer <em>assertions</em>. Do not "fix" either one in your notes — learn both.</p>
<p class="meo">💡 Memory hook for the chain: <strong>MUTUAL goal → COMMUNICATION → JOINT commitment → PROJECTIVE pairs</strong>. Four terms, in that order.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt của mục, gói trong ba gạch đầu dòng: <strong>Mục đích: luyện làm việc hiệu quả và gắn kết trong đội</strong> · <strong>group work là một HOẠT ĐỘNG CHUNG; các mục tiêu chung được thực hiện thông qua GIAO TIẾP để thiết lập CAM KẾT CHUNG, làm qua các CẶP PHÓNG CHIẾU (Clark, 2005, 2006, 2012)</strong> · <strong>hai loại HÀNH ĐỘNG MỞ ĐẦU: proposals và announcements</strong>.</p>
<table>
<tr><th>Thuật ngữ</th><th>Định nghĩa phải thuộc</th><th>Ví dụ</th></tr>
<tr><td><strong>Joint activity</strong> (hoạt động chung)</td><td>Hoạt động chỉ tồn tại vì hai người trở lên cùng làm</td><td>Một buổi review code: một người không thể tự review pull request của chính mình thành một buổi review</td></tr>
<tr><td><strong>Joint commitment</strong> (cam kết chung)</td><td>Nghĩa vụ chung được tạo ra BỞI GIAO TIẾP — không phải bởi bảng chia việc</td><td>"Sprint review tối thứ Sáu 7h nhé?" — "Ừ" · giờ cả hai đã bị ràng buộc</td></tr>
<tr><td><strong>Projective pair</strong> (cặp phóng chiếu)</td><td>Đơn vị hai phần, trong đó hành động THỨ NHẤT phóng chiếu (làm cho trở nên bắt buộc) một hành động THỨ HAI từ phía người kia</td><td>Đề xuất → nhận/từ chối · câu hỏi → câu trả lời · mời → nhận lời</td></tr>
<tr><td><strong>First actions</strong> (hành động mở đầu)</td><td>Nửa đầu của một cặp phóng chiếu</td><td>Proposals · announcements (theo slide này) / assertions (theo slide 23)</td></tr>
</table>
<ul>
<li><strong>Cả mô hình gói trong một câu:</strong> mục tiêu chung → giao tiếp → cam kết chung. Giao tiếp là cỗ máy nằm ở giữa; thiếu nó thì một mục tiêu chung chẳng sinh ra ràng buộc nào.</li>
<li><strong>"Projective pairs" là mẩu thuật ngữ kỹ thuật duy nhất ở đây</strong> và cũng là thứ dễ bị hỏi đúng tên nhất. Chữ <em>projective</em> nghĩa là hành động đầu PHÓNG CHIẾU ra hành động thứ hai — nó làm cho một kiểu phản hồi trở thành thứ được chờ đợi, nên im lặng tự nó cũng là một câu trả lời.</li>
<li><strong>Trích dẫn là MỘT tác giả với BA năm: (Clark, 2005, 2006, 2012)</strong>, không phải ba tác giả khác nhau. Tính là MỘT nguồn được dẫn ba lần.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đây là lý do một tin nhắn trong nhóm chat mà không ai trả lời thì KHÔNG tạo ra cam kết nào hết. Cặp phóng chiếu cần nửa sau của nó; "đã xem" không phải là nhận lời.</li>
</ul>
<p class="pitfall">⚠️ <strong>Bẫy lớn nhất của cả dải này.</strong> Slide 23 mang tiêu đề "Proposals and <strong>assertions</strong> in group work". Slide tóm tắt này, ngay sau đó một slide, lại nói hai loại hành động mở đầu là "proposals and <strong>announcements</strong>". Deck dùng HAI chữ khác nhau cho cùng một ô và không bao giờ hoà giải chúng. Vào phòng thi, hãy đọc kỹ đề: đề trích slide tóm tắt thì chọn <em>announcements</em>; đề trích slide làm việc nhóm thì chọn <em>assertions</em>. Đừng "sửa lại" cái nào trong vở — học thuộc cả hai.</p>
<p class="meo">💡 Mẹo nhớ chuỗi: <strong>Mục tiêu CHUNG → GIAO TIẾP → CAM KẾT chung → CẶP phóng chiếu</strong>. Bốn thuật ngữ, đúng thứ tự đó.</p>`],

      [25, '3.2a (Part 2) Analysing Essay Questions (learning outcomes)',
        `<p class="y-chinh">🎯 Opening slide for the essay-question section, <strong>three outcomes</strong>: <strong>understand essay types in different fields and disciplines</strong> · <strong>interpret the purpose and rhetorical aims of each type</strong> · <strong>use effective questioning to further understand expectations</strong>.</p>
<table>
<tr><th>Outcome</th><th>The question it answers</th><th>At FPTU</th></tr>
<tr><td><strong>Essay types across fields</strong></td><td>What KIND of essay does my discipline write?</td><td>SSG104 wants a reflective/argumentative essay; SWP391 wants a technical report; MKT101 wants a case analysis. Three genres, three shapes</td></tr>
<tr><td><strong>Purpose and rhetorical aims</strong></td><td>What is this piece of writing trying to DO to its reader?</td><td>Persuade the marker your design is justified · inform them what you built · evaluate two options</td></tr>
<tr><td><strong>Effective questioning</strong></td><td>What does the lecturer actually expect that the prompt does not say?</td><td>Ask: how many sources? first person allowed? is the word count a limit or a target?</td></tr>
</table>
<ul>
<li><strong>"Rhetorical aim" is the exam word.</strong> It means the effect the text is designed to have on a reader — persuade, inform, evaluate, recommend. Two essays on the same topic with different rhetorical aims are different essays.</li>
<li><strong>The third outcome makes ASKING part of the skill.</strong> The MOOC treats questioning the lecturer as legitimate academic behaviour, not as an admission that you did not understand.</li>
<li><strong>Applied at FPTU.</strong> Before writing a single line, send one message to the lecturer with at most three specific questions. Specific questions get answered; "em chưa hiểu đề" usually does not.</li>
</ul>
<p class="pitfall">⚠️ Compare this slide with slide 29 (3.2b). Bullets <strong>2 and 3 are word-for-word identical</strong> on both slides; only bullet 1 differs — "understand essay types in different fields and disciplines" here, versus "understand essay and report types" there. That single line is the whole difference, and it is exactly what a distractor will swap.</p>
<p class="meo">💡 Note the odd label: <strong>3.2a (Part 2)</strong>. There is no "(Part 1)" slide anywhere in the review deck — it lives in the MOOC video only.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu mục về đề bài luận, <strong>ba mục tiêu</strong>: <strong>hiểu các LOẠI bài luận ở các lĩnh vực và ngành khác nhau</strong> · <strong>diễn giải MỤC ĐÍCH và MỤC TIÊU TU TỪ của từng loại</strong> · <strong>dùng việc ĐẶT CÂU HỎI hiệu quả để hiểu thêm kỳ vọng</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Nó trả lời câu hỏi nào</th><th>Ở FPTU</th></tr>
<tr><td><strong>Loại bài luận theo ngành</strong></td><td>Ngành của tôi viết KIỂU bài nào?</td><td>SSG104 đòi bài luận phản tư/lập luận; SWP391 đòi báo cáo kỹ thuật; MKT101 đòi phân tích tình huống. Ba thể loại, ba hình dạng</td></tr>
<tr><td><strong>Mục đích và mục tiêu tu từ</strong></td><td>Bài viết này định LÀM GÌ với người đọc?</td><td>Thuyết phục giảng viên rằng thiết kế của bạn có cơ sở · báo cho họ biết bạn đã làm gì · đánh giá hai phương án</td></tr>
<tr><td><strong>Đặt câu hỏi hiệu quả</strong></td><td>Giảng viên thật sự kỳ vọng gì mà đề bài không viết ra?</td><td>Hỏi: cần bao nhiêu nguồn? có được xưng "tôi" không? số từ là trần hay là đích?</td></tr>
</table>
<ul>
<li><strong>"Rhetorical aim" (mục tiêu tu từ) là chữ hay ra đề.</strong> Nó là tác động mà văn bản được thiết kế để gây ra cho người đọc — thuyết phục, thông tin, đánh giá, khuyến nghị. Hai bài luận cùng chủ đề mà khác mục tiêu tu từ là hai bài khác nhau.</li>
<li><strong>Mục tiêu thứ ba biến việc HỎI thành một phần của kỹ năng.</strong> MOOC coi việc hỏi lại giảng viên là hành vi học thuật chính đáng, không phải lời thú nhận rằng bạn không hiểu bài.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trước khi viết một dòng nào, gửi giảng viên MỘT tin nhắn với tối đa ba câu hỏi cụ thể. Câu hỏi cụ thể thì được trả lời; "em chưa hiểu đề" thì thường không.</li>
</ul>
<p class="pitfall">⚠️ So slide này với slide 29 (3.2b). Gạch đầu dòng <strong>2 và 3 giống nhau TỪNG CHỮ</strong> trên cả hai slide; chỉ gạch đầu dòng 1 khác — ở đây là "understand essay types in different fields and disciplines", còn bên kia là "understand essay and report types". Đúng một dòng đó là toàn bộ khác biệt, và đó chính là chỗ đáp án nhiễu sẽ tráo.</p>
<p class="meo">💡 Để ý cái nhãn kỳ lạ: <strong>3.2a (Part 2)</strong>. Không có slide "(Part 1)" nào trong cả deck ôn tập — nó chỉ nằm trong video của MOOC.</p>`],

      [26, 'Essay questions – Understanding what to do (analysing the prompt)',
        `<p class="y-chinh">🎯 How to take a prompt apart: <strong>highlight key concepts AND key terms</strong> · <strong>question concepts AND terms</strong> · <strong>key terms</strong> break down into <strong>parameters</strong> · <strong>contexts</strong> · <strong>processes</strong>. The word "AND" is capitalised twice on the slide — concepts and terms are two different jobs.</p>
<table>
<tr><th>Part of the prompt</th><th>What it is</th><th>What it controls</th></tr>
<tr><td><strong>Key concepts</strong></td><td>The subject matter — the ideas the essay is about</td><td>WHAT you read and write about</td></tr>
<tr><td><strong>Key terms → parameters</strong></td><td>The limits: word count, number of sources, date range, "two of the following"</td><td>HOW MUCH and HOW MANY</td></tr>
<tr><td><strong>Key terms → contexts</strong></td><td>The setting the answer must stay inside: a country, an industry, a period, a case</td><td>WHERE and WHEN it applies</td></tr>
<tr><td><strong>Key terms → processes</strong></td><td>The instruction verbs: discuss, compare, evaluate, describe, analyse</td><td>WHAT YOU DO with the content</td></tr>
</table>
<ul>
<li><strong>Most lost marks live in "parameters" and "contexts", not in "concepts".</strong> Students research the topic well and then answer about the wrong country, the wrong decade, or all four options when the prompt said two.</li>
<li><strong>"Question concepts AND terms" means doubting even the easy words.</strong> In "evaluate the impact of remote work on software team productivity in Vietnam since 2020", the word <em>productivity</em> is not self-evident — lines of code? story points? on-time delivery? You must define it, and your definition shapes the whole essay.</li>
<li><strong>This connects straight back to Mooc 2's instruction verbs.</strong> The "processes" slot is exactly where those verb families sit: the <strong>6</strong> description verbs and the <strong>8</strong> analysis verbs.</li>
<li><strong>Applied at FPTU.</strong> Print the prompt, then use three colours: concepts, parameters/contexts, process verbs. Anything left uncoloured is filler, and there is usually less of it than you think.</li>
</ul>
<p class="dap-an">✅ Worked dissection — <em>"Discuss the main challenges of applying Scrum in small Vietnamese software companies. Use at least five academic sources. 1500 words."</em> → <strong>Process:</strong> Discuss (present several sides, then a position). <strong>Concepts:</strong> challenges of applying Scrum. <strong>Contexts:</strong> small companies · Vietnam · software industry. <strong>Parameters:</strong> at least 5 academic sources · 1500 words · "main" challenges, so select the biggest few rather than listing everything.</p>
<p class="pitfall">⚠️ Carried over from Mooc 2 and still true here: <strong>"Describe" is classed with the ANALYSIS verbs, not with the description verbs.</strong> A prompt saying "describe" is asking for more than a picture. Keep that separation — it is one of the most-tested items in the whole subject.</p>`,
        `<p class="y-chinh">🎯 Cách bóc một đề bài ra: <strong>tô đậm KEY CONCEPTS VÀ KEY TERMS</strong> · <strong>CHẤT VẤN cả concepts VÀ terms</strong> · <strong>key terms</strong> lại chẻ thành <strong>parameters</strong> (giới hạn) · <strong>contexts</strong> (bối cảnh) · <strong>processes</strong> (việc phải làm). Chữ "AND" được VIẾT HOA hai lần trên slide — concepts và terms là hai việc khác nhau.</p>
<table>
<tr><th>Thành phần của đề</th><th>Nó là gì</th><th>Nó khống chế cái gì</th></tr>
<tr><td><strong>Key concepts</strong></td><td>Nội dung chuyên môn — những ý tưởng mà bài luận nói về</td><td>Bạn ĐỌC và VIẾT về cái gì</td></tr>
<tr><td><strong>Key terms → parameters</strong></td><td>Các giới hạn: số từ, số nguồn, khoảng thời gian, "chọn hai trong số sau"</td><td>BAO NHIÊU, MẤY CÁI</td></tr>
<tr><td><strong>Key terms → contexts</strong></td><td>Khung cảnh mà câu trả lời phải nằm trong: một quốc gia, một ngành, một giai đoạn, một tình huống</td><td>Ở ĐÂU và KHI NÀO thì áp dụng</td></tr>
<tr><td><strong>Key terms → processes</strong></td><td>Động từ chỉ dẫn: discuss, compare, evaluate, describe, analyse</td><td>Bạn LÀM GÌ với nội dung đó</td></tr>
</table>
<ul>
<li><strong>Phần lớn điểm mất nằm ở "parameters" và "contexts", không phải ở "concepts".</strong> Sinh viên nghiên cứu chủ đề rất tốt rồi trả lời nhầm quốc gia, nhầm thập kỷ, hoặc làm cả bốn phương án trong khi đề bảo chọn hai.</li>
<li><strong>"Chất vấn cả concepts VÀ terms" nghĩa là nghi ngờ cả những chữ tưởng dễ.</strong> Trong đề "đánh giá tác động của làm việc từ xa lên NĂNG SUẤT của đội phần mềm ở Việt Nam từ 2020", chữ <em>năng suất</em> không hề hiển nhiên — số dòng code? story point? giao đúng hạn? Bạn phải định nghĩa nó, và định nghĩa đó nhào nặn cả bài.</li>
<li><strong>Chỗ này nối thẳng về bộ động từ chỉ dẫn của Mooc 2.</strong> Ô "processes" đúng là chỗ các họ động từ đó ngồi: <strong>6</strong> động từ MÔ TẢ và <strong>8</strong> động từ PHÂN TÍCH.</li>
<li><strong>Áp dụng ở FPTU.</strong> In đề ra, dùng ba màu: concepts, parameters/contexts, động từ chỉ dẫn. Chữ nào không được tô màu là chữ độn — và thường nó ít hơn bạn tưởng.</li>
</ul>
<p class="dap-an">✅ Bóc đề mẫu — <em>"Discuss the main challenges of applying Scrum in small Vietnamese software companies. Use at least five academic sources. 1500 words."</em> → <strong>Process:</strong> Discuss (trình bày nhiều phía rồi chốt một lập trường). <strong>Concepts:</strong> các thách thức khi áp dụng Scrum. <strong>Contexts:</strong> công ty NHỎ · Việt Nam · ngành phần mềm. <strong>Parameters:</strong> tối thiểu 5 nguồn học thuật · 1500 từ · chữ "main" nghĩa là CHỌN vài cái lớn nhất chứ không liệt kê hết.</p>
<p class="pitfall">⚠️ Mang từ Mooc 2 sang và vẫn đúng ở đây: <strong>"Describe" được xếp vào nhóm động từ PHÂN TÍCH, không phải nhóm mô tả.</strong> Đề ghi "describe" là đang đòi nhiều hơn một bức tranh. Giữ chặt lằn ranh này — nó là một trong những mục bị hỏi nhiều nhất cả môn.</p>`],

      [27, 'Essay questions – Understanding what to do (exploring the prompt)',
        `<p class="y-chinh">🎯 The second half of the same job, opening with a quotation: <strong>"Even ordinary words like 'should' or 'must' need to be 'upacked' and defined by you" (Smith, 2003, p.48)</strong>. Then <strong>explore the question</strong> by: <strong>re-write in your own words</strong> · <strong>find synonyms or write longer explanations for key terms</strong> · <strong>question each part of the prompt</strong>.</p>
<table>
<tr><th>Move</th><th>How to do it</th><th>On a real prompt</th></tr>
<tr><td><strong>Re-write in your own words</strong></td><td>Say the whole prompt back without reusing its nouns</td><td>"They want me to weigh up why Scrum is hard for small firms here, and land on which difficulty matters most"</td></tr>
<tr><td><strong>Synonyms / longer explanations</strong></td><td>Replace each key term with a fuller phrase you can defend</td><td>"challenges" → obstacles that make adoption slower, more expensive, or incomplete</td></tr>
<tr><td><strong>Question each part</strong></td><td>Interrogate every chunk, including the modal verbs</td><td>Does "small" mean under 50 staff? Does "applying" include partial adoption? Does "Vietnamese" mean located here, or serving this market?</td></tr>
</table>
<ul>
<li><strong>Why 'should' and 'must' matter.</strong> They carry the strength of the claim you are being asked for. "What should companies do" invites a recommendation with room for exceptions; "what must companies do" asks you to argue something is necessary. Same sentence shape, different essays.</li>
<li><strong>Re-writing in your own words is a TEST, not a formality.</strong> If you cannot restate the prompt without its own vocabulary, you do not yet understand it — and no amount of reading will fix that, because you would not know what to read for.</li>
<li><strong>This is the step students skip under time pressure</strong>, and it is the cheapest one: fifteen minutes here saves a rewrite of 1500 words later.</li>
<li><strong>Applied at FPTU.</strong> Write your restatement at the top of the draft document and keep it there while you write. Every paragraph must be answerable to that sentence; the ones that are not are the ones to cut.</li>
</ul>
<p class="pitfall">⚠️ Two things to notice about this slide as an artefact. First, it carries <strong>exactly the same title as slide 26</strong> — "Essay questions – Understanding what to do" — with completely different content, so "the Understanding what to do slide" is ambiguous; always cite the slide number. Second, the quotation contains a typo: the deck prints <strong>'upacked'</strong> where the source says <em>unpacked</em>. Quote it as printed if the exam quotes it, and do not silently correct it in your notes.</p>
<p class="meo">💡 Source-year watch: this slide cites <strong>Smith, 2003</strong>. Slide 41 cites <strong>Smith 2002</strong> (and drops the comma). The deck is inconsistent about this author's year — do not spend memory deciding which is right.</p>`,
        `<p class="y-chinh">🎯 Nửa sau của cùng một việc, mở đầu bằng một trích dẫn: <strong>"Even ordinary words like 'should' or 'must' need to be 'upacked' and defined by you" (Smith, 2003, p.48)</strong> — ngay cả những chữ bình thường như "nên" hay "phải" cũng cần được BẠN mở gói ra và định nghĩa. Rồi <strong>khám phá đề bài</strong> bằng: <strong>viết lại bằng lời của mình</strong> · <strong>tìm từ đồng nghĩa hoặc viết giải thích dài hơn cho các key terms</strong> · <strong>chất vấn TỪNG PHẦN của đề</strong>.</p>
<table>
<tr><th>Nước đi</th><th>Làm thế nào</th><th>Trên một đề thật</th></tr>
<tr><td><strong>Viết lại bằng lời của mình</strong></td><td>Nói lại toàn bộ đề mà KHÔNG dùng lại danh từ của nó</td><td>"Họ muốn mình cân nhắc xem vì sao Scrum khó với công ty nhỏ ở đây, rồi chốt xem cái khó nào quan trọng nhất"</td></tr>
<tr><td><strong>Đồng nghĩa / giải thích dài hơn</strong></td><td>Thay mỗi key term bằng một cụm đầy đủ mà bạn bảo vệ được</td><td>"challenges" → những trở ngại khiến việc áp dụng chậm hơn, tốn hơn, hoặc dang dở</td></tr>
<tr><td><strong>Chất vấn từng phần</strong></td><td>Tra hỏi mọi mẩu, kể cả động từ tình thái</td><td>"Nhỏ" là dưới 50 người? "Áp dụng" có tính áp dụng một phần không? "Việt Nam" là đặt trụ sở ở đây, hay phục vụ thị trường này?</td></tr>
</table>
<ul>
<li><strong>Vì sao 'should' và 'must' quan trọng.</strong> Chúng mang theo ĐỘ MẠNH của khẳng định mà đề đang đòi. "Công ty NÊN làm gì" mời bạn khuyến nghị và chừa chỗ cho ngoại lệ; "công ty PHẢI làm gì" bắt bạn lập luận rằng điều đó là bắt buộc. Cùng một hình dạng câu, hai bài luận khác nhau.</li>
<li><strong>Viết lại bằng lời mình là một PHÉP KIỂM, không phải thủ tục.</strong> Nếu bạn không diễn đạt lại được đề mà không mượn từ vựng của nó, nghĩa là bạn chưa hiểu — và đọc thêm bao nhiêu cũng không chữa được, vì bạn có biết mình cần đọc gì đâu.</li>
<li><strong>Đây là bước sinh viên hay bỏ khi gấp</strong>, mà nó lại rẻ nhất: mười lăm phút ở đây tiết kiệm một lần viết lại 1500 từ về sau.</li>
<li><strong>Áp dụng ở FPTU.</strong> Viết câu diễn đạt lại ấy lên ĐẦU file nháp và để nguyên đó suốt lúc viết. Mọi đoạn văn đều phải chịu trách nhiệm trước câu đó; đoạn nào không chịu được chính là đoạn cần cắt.</li>
</ul>
<p class="pitfall">⚠️ Hai điều cần để ý về slide này với tư cách một hiện vật. Thứ nhất, nó mang <strong>ĐÚNG CÙNG TIÊU ĐỀ với slide 26</strong> — "Essay questions – Understanding what to do" — mà nội dung khác hẳn, nên nói "cái slide Understanding what to do" là nói mơ hồ; luôn dẫn theo SỐ slide. Thứ hai, trích dẫn có lỗi chính tả: deck in <strong>'upacked'</strong> trong khi nguồn viết <em>unpacked</em>. Đề trích thế nào thì trả lời thế ấy, và đừng lặng lẽ sửa lại trong vở.</p>
<p class="meo">💡 Canh năm nguồn: slide này ghi <strong>Smith, 2003</strong>. Slide 41 ghi <strong>Smith 2002</strong> (và mất dấu phẩy). Deck không nhất quán về năm của tác giả này — đừng tốn trí nhớ để phân xử xem cái nào đúng.</p>`],

      [28, 'Summary: Interpreting Essay Questions',
        `<p class="y-chinh">🎯 The whole section compressed to two moves: <strong>analyse the question!</strong> (→ <strong>key concepts</strong> · <strong>other terms, parameters, contexts, processes</strong>) and <strong>explore the question: what are you meant to do?</strong></p>
<table>
<tr><th>Stage</th><th>Slide it summarises</th><th>The output you should physically have</th></tr>
<tr><td><strong>Analyse</strong></td><td>Slide 26</td><td>A marked-up copy of the prompt: concepts circled, parameters/contexts/processes labelled</td></tr>
<tr><td><strong>Explore</strong></td><td>Slide 27</td><td>One paragraph in your own words saying what you are meant to do, plus a short list of questions for the lecturer</td></tr>
</table>
<ul>
<li><strong>The order is fixed and it matters.</strong> Analyse first (take the prompt apart), explore second (put it back together in your own language). Doing it the other way round means you paraphrase a prompt you have not yet dissected, and you will paraphrase away the parameters.</li>
<li><strong>Note the exclamation mark.</strong> "Analyse the question!" is the only exclamation mark in this whole range of slides — the MOOC is flagging the single most common cause of low marks: answering a question that was not asked.</li>
<li><strong>"Other terms" is doing quiet work here.</strong> On slide 26 the structure was key concepts versus key terms; the summary re-labels the second group as "other terms, parameters, contexts, processes", which flattens the hierarchy — on slide 26, parameters/contexts/processes were sub-items UNDER key terms.</li>
<li><strong>Applied at FPTU.</strong> Two artefacts before you research anything: the marked-up prompt, and the one-paragraph restatement. If a teammate cannot tell from those two what the report is about, you are not ready to start.</li>
</ul>
<p class="pitfall">⚠️ <strong>Do not revise from this summary alone.</strong> It drops the quotation about 'should' and 'must' entirely, drops "re-write in your own words / find synonyms / question each part", and drops the instruction "highlight … AND question …". A question about the three exploring techniques cannot be answered from this slide — only from slide 27.</p>
<p class="meo">💡 Two-word hook: <strong>ANALYSE → EXPLORE</strong>. Take apart, then put back in your own words.</p>`,
        `<p class="y-chinh">🎯 Cả mục nén lại còn hai nước đi: <strong>PHÂN TÍCH đề bài!</strong> (→ <strong>key concepts</strong> · <strong>other terms, parameters, contexts, processes</strong>) và <strong>KHÁM PHÁ đề bài: bạn được yêu cầu làm gì?</strong></p>
<table>
<tr><th>Chặng</th><th>Tóm tắt slide nào</th><th>Sản phẩm bạn phải cầm được trên tay</th></tr>
<tr><td><strong>Analyse</strong> (phân tích)</td><td>Slide 26</td><td>Một bản đề đã đánh dấu: khoanh concepts, dán nhãn parameters/contexts/processes</td></tr>
<tr><td><strong>Explore</strong> (khám phá)</td><td>Slide 27</td><td>Một đoạn văn bằng lời của mình nói rõ mình phải làm gì, kèm danh sách ngắn câu hỏi gửi giảng viên</td></tr>
</table>
<ul>
<li><strong>Thứ tự là cố định và nó quan trọng.</strong> Phân tích trước (bóc đề ra), khám phá sau (ráp lại bằng ngôn ngữ của mình). Làm ngược lại thì bạn đang diễn giải một đề chưa được mổ xẻ, và bạn sẽ diễn giải bay mất các parameters.</li>
<li><strong>Để ý dấu chấm than.</strong> "Analyse the question!" là dấu chấm than DUY NHẤT trong cả dải slide này — MOOC đang giơ cờ vào nguyên nhân mất điểm phổ biến nhất: trả lời một câu hỏi không ai hỏi.</li>
<li><strong>Cụm "other terms" ở đây làm một việc lặng lẽ.</strong> Slide 26 chia key concepts ĐỐI với key terms; slide tóm tắt lại gọi nhóm hai là "other terms, parameters, contexts, processes", tức làm phẳng thứ bậc — trong khi ở slide 26, parameters/contexts/processes là các mục CON NẰM DƯỚI key terms.</li>
<li><strong>Áp dụng ở FPTU.</strong> Hai hiện vật phải có trước khi nghiên cứu bất cứ thứ gì: bản đề đã đánh dấu, và đoạn diễn đạt lại. Nếu bạn cùng nhóm nhìn hai thứ đó mà không nói được báo cáo này về cái gì, thì bạn chưa sẵn sàng bắt đầu.</li>
</ul>
<p class="pitfall">⚠️ <strong>Đừng ôn chỉ bằng slide tóm tắt này.</strong> Nó bỏ hẳn trích dẫn về 'should' và 'must', bỏ "viết lại bằng lời mình / tìm từ đồng nghĩa / chất vấn từng phần", và bỏ luôn chỉ dẫn "tô đậm … VÀ chất vấn …". Một câu hỏi về ba kỹ thuật khám phá đề thì không thể trả lời từ slide này — chỉ từ slide 27.</p>
<p class="meo">💡 Mẹo hai chữ: <strong>PHÂN TÍCH → KHÁM PHÁ</strong>. Bóc ra, rồi ráp lại bằng lời của mình.</p>`],

      [29, '3.2b Understanding and Interpreting Reports and Proposals (learning outcomes)',
        `<p class="y-chinh">🎯 The report-side twin of slide 25, again <strong>three outcomes</strong>: <strong>understand essay and report types</strong> · <strong>interpret the purpose and rhetorical aims of each type</strong> · <strong>use effective questioning to further understand expectations</strong>.</p>
<table>
<tr><th></th><th>Slide 25 — 3.2a (essays)</th><th>Slide 29 — 3.2b (reports &amp; proposals)</th></tr>
<tr><td><strong>Bullet 1</strong></td><td>understand essay types <em>in different fields and disciplines</em></td><td>understand <em>essay AND REPORT</em> types</td></tr>
<tr><td><strong>Bullet 2</strong></td><td colspan="2">identical: interpret the purpose and rhetorical aims of each type</td></tr>
<tr><td><strong>Bullet 3</strong></td><td colspan="2">identical: use effective questioning to further understand expectations</td></tr>
</table>
<ul>
<li><strong>Essay versus report is a genre difference, not a difficulty difference.</strong> An essay is one continuous argument in prose; a report is a segmented document with headed sections, written for someone who will read parts of it out of order.</li>
<li><strong>A proposal is a report about something that has not happened yet.</strong> It argues that a future action is worth taking, so its centre of gravity is justification rather than findings.</li>
<li><strong>"Each type" now covers more ground.</strong> With reports in scope, rhetorical aims widen from persuade/inform/evaluate to include recommend — the aim that defines a proposal.</li>
<li><strong>Applied at FPTU.</strong> SWP391 hands you both genres in one semester: the report documents what the team built; the initial topic proposal argues the project is worth approving. Same content, different shape, different reader behaviour.</li>
</ul>
<p class="pitfall">⚠️ <strong>Two thirds of this slide is copied from slide 25.</strong> This deck repeats whole bullet blocks across differently-named sections, so recognising a bullet is not enough to identify which section it came from. Anchor on bullet 1 — it is the only one that changes.</p>
<p class="meo">💡 Sort it by scope: <strong>3.2a = essays only · 3.2b = essays AND reports</strong>. The b-section always widens, never replaces.</p>`,
        `<p class="y-chinh">🎯 Bản sinh đôi phía báo cáo của slide 25, lại <strong>ba mục tiêu</strong>: <strong>hiểu các loại BÀI LUẬN VÀ BÁO CÁO</strong> · <strong>diễn giải mục đích và mục tiêu tu từ của từng loại</strong> · <strong>dùng việc đặt câu hỏi hiệu quả để hiểu thêm kỳ vọng</strong>.</p>
<table>
<tr><th></th><th>Slide 25 — 3.2a (bài luận)</th><th>Slide 29 — 3.2b (báo cáo &amp; đề xuất)</th></tr>
<tr><td><strong>Gạch 1</strong></td><td>understand essay types <em>in different fields and disciplines</em></td><td>understand <em>essay AND REPORT</em> types</td></tr>
<tr><td><strong>Gạch 2</strong></td><td colspan="2">GIỐNG HỆT: interpret the purpose and rhetorical aims of each type</td></tr>
<tr><td><strong>Gạch 3</strong></td><td colspan="2">GIỐNG HỆT: use effective questioning to further understand expectations</td></tr>
</table>
<ul>
<li><strong>Bài luận với báo cáo khác nhau về THỂ LOẠI, không phải về độ khó.</strong> Bài luận là một mạch lập luận liền một hơi bằng văn xuôi; báo cáo là tài liệu chia khúc có tiêu đề mục, viết cho người sẽ đọc từng phần không theo thứ tự.</li>
<li><strong>Đề xuất (proposal) là một báo cáo về thứ CHƯA xảy ra.</strong> Nó lập luận rằng một hành động trong tương lai đáng làm, nên trọng tâm của nó là BIỆN MINH chứ không phải kết quả tìm được.</li>
<li><strong>"Each type" giờ phủ rộng hơn.</strong> Có báo cáo trong tầm rồi thì mục tiêu tu từ nới từ thuyết phục/thông tin/đánh giá ra thêm KHUYẾN NGHỊ — đúng cái mục tiêu định nghĩa một proposal.</li>
<li><strong>Áp dụng ở FPTU.</strong> SWP391 giao cho bạn cả hai thể loại trong một kỳ: báo cáo ghi lại thứ nhóm đã dựng; bản đề xuất đề tài lúc đầu lập luận rằng dự án đáng được duyệt. Cùng nội dung, khác hình dạng, khác cách người đọc hành xử.</li>
</ul>
<p class="pitfall">⚠️ <strong>Hai phần ba slide này được chép nguyên từ slide 25.</strong> Deck này lặp cả khối bullet giữa những mục mang tên khác nhau, nên NHẬN RA một gạch đầu dòng không đủ để biết nó thuộc mục nào. Hãy neo vào gạch 1 — đó là dòng duy nhất thay đổi.</p>
<p class="meo">💡 Phân loại theo phạm vi: <strong>3.2a = chỉ bài luận · 3.2b = bài luận VÀ báo cáo</strong>. Mục b luôn NỚI RỘNG, không bao giờ thay thế.</p>`],

      [30, 'Summary: Understanding and Interpreting Report Assignments',
        `<p class="y-chinh">🎯 Two report families plus one research step: <strong>professional reports</strong> (designed to acquaint you with writing in your field; imagined audience and real audience may have different expectations) · <strong>research reports</strong> (designed to help you learn research methods in your field) · <strong>researching your report's rhetorical situation</strong> (number of authors, structure, audience; ask your lecturer, or check question or outline). Citation: <strong>(Dannels, 2000; Nesi &amp; Gardner, 2012; Swales &amp; Feak, 2012)</strong>.</p>
<table>
<tr><th></th><th>Professional report</th><th>Research report</th></tr>
<tr><td><strong>Designed to teach you</strong></td><td>Writing in your field</td><td>Research methods in your field</td></tr>
<tr><td><strong>Models itself on</strong></td><td>A document a real workplace would produce</td><td>A journal article / scientific paper</td></tr>
<tr><td><strong>Audience problem</strong></td><td><strong>Imagined vs real audience differ</strong> — you write "for a client", but a lecturer marks it</td><td>Less acute: the imagined reader (a researcher) is close to the real one</td></tr>
<tr><td><strong>FPTU example</strong></td><td>SWP391 project documentation, a consulting-style recommendation for MKT101</td><td>A small empirical study with method and results sections</td></tr>
</table>
<ul>
<li><strong>"Imagined audience and real audience may have different expectations" is the sharpest idea on the slide.</strong> A professional report asks you to write as if for a company, while the person who grades it wants evidence that you learned something. When the two conflict, satisfy the rubric — but keep the professional surface.</li>
<li><strong>The three things to research about the rhetorical situation are concrete:</strong> number of authors (is it a solo or group document, and does it use "we"?), structure (which headed sections), audience (who is imagined).</li>
<li><strong>Two legitimate ways to find out, both on the slide:</strong> ask your lecturer, or check the question or outline. Nothing here says "guess" or "copy last year's".</li>
<li><strong>Applied at FPTU.</strong> Before writing an SWP391 document, settle three things in one message: who is the imagined reader, which sections are compulsory, and whether the team writes as "we" or impersonally. All three change the sentences you write.</li>
</ul>
<p class="pitfall">⚠️ The deck gives this summary <strong>no content slide of its own</strong> in the review deck — section 3.2b jumps straight from its objectives slide (29) to this summary (30). So everything here is examinable even though you never saw it built up. Learn the summary itself, word for word.</p>
<p class="meo">💡 Keep the two purposes apart with the word after "learn": <strong>professional = writing</strong> in your field · <strong>research = research METHODS</strong> in your field.</p>`,
        `<p class="y-chinh">🎯 Hai họ báo cáo cộng một bước nghiên cứu: <strong>professional reports</strong> (báo cáo nghề nghiệp — thiết kế để cho bạn LÀM QUEN với cách viết trong ngành; người đọc TƯỞNG TƯỢNG và người đọc THẬT có thể kỳ vọng khác nhau) · <strong>research reports</strong> (báo cáo nghiên cứu — thiết kế để giúp bạn HỌC PHƯƠNG PHÁP nghiên cứu của ngành) · <strong>nghiên cứu "tình huống tu từ" của báo cáo</strong> (số tác giả, cấu trúc, người đọc; hỏi giảng viên, hoặc xem lại đề bài hay đề cương). Trích dẫn: <strong>(Dannels, 2000; Nesi &amp; Gardner, 2012; Swales &amp; Feak, 2012)</strong>.</p>
<table>
<tr><th></th><th>Professional report</th><th>Research report</th></tr>
<tr><td><strong>Dạy bạn cái gì</strong></td><td>Cách VIẾT trong ngành</td><td>PHƯƠNG PHÁP NGHIÊN CỨU của ngành</td></tr>
<tr><td><strong>Lấy khuôn từ</strong></td><td>Một tài liệu mà nơi làm việc thật sẽ tạo ra</td><td>Một bài báo khoa học</td></tr>
<tr><td><strong>Vấn đề người đọc</strong></td><td><strong>Người đọc tưởng tượng KHÁC người đọc thật</strong> — bạn viết "cho khách hàng", nhưng giảng viên mới là người chấm</td><td>Nhẹ hơn: người đọc tưởng tượng (một nhà nghiên cứu) khá gần người đọc thật</td></tr>
<tr><td><strong>Ví dụ FPTU</strong></td><td>Tài liệu dự án SWP391, một bản khuyến nghị kiểu tư vấn cho MKT101</td><td>Một nghiên cứu thực nghiệm nhỏ có phần phương pháp và kết quả</td></tr>
</table>
<ul>
<li><strong>"Người đọc tưởng tượng và người đọc thật có thể kỳ vọng khác nhau" là ý sắc nhất trên slide.</strong> Báo cáo nghề nghiệp bắt bạn viết như thể gửi cho một công ty, trong khi người chấm điểm lại muốn thấy bằng chứng bạn đã học được gì. Hai thứ xung đột thì hãy chiều RUBRIC — nhưng giữ nguyên lớp vỏ nghề nghiệp.</li>
<li><strong>Ba thứ cần tra về tình huống tu từ đều rất cụ thể:</strong> số tác giả (tài liệu cá nhân hay nhóm, có xưng "chúng tôi" không?), cấu trúc (những mục có tiêu đề nào), người đọc (ai là người được tưởng tượng).</li>
<li><strong>Hai cách hợp lệ để biết, đều ghi trên slide:</strong> hỏi giảng viên, hoặc xem lại đề bài / đề cương. Không có chỗ nào nói "đoán" hay "chép của khoá trước".</li>
<li><strong>Áp dụng ở FPTU.</strong> Trước khi viết tài liệu SWP391, chốt ba thứ trong một tin nhắn: người đọc tưởng tượng là ai, mục nào bắt buộc, và nhóm xưng "chúng tôi" hay viết phi ngôi. Cả ba đều làm đổi từng câu bạn viết.</li>
</ul>
<p class="pitfall">⚠️ Trong deck ôn tập, slide tóm tắt này <strong>KHÔNG có slide nội dung nào đi trước</strong> — mục 3.2b nhảy thẳng từ slide mục tiêu (29) sang slide tóm tắt (30). Nghĩa là mọi thứ ở đây đều có thể ra đề dù bạn chưa từng thấy nó được dựng dần. Hãy học thuộc chính slide tóm tắt này, từng chữ.</p>
<p class="meo">💡 Giữ hai mục đích tách nhau bằng chữ đứng sau "học": <strong>professional = học VIẾT</strong> trong ngành · <strong>research = học PHƯƠNG PHÁP nghiên cứu</strong> của ngành.</p>`],

      [31, '3.3a Conducting Research for Essays (learning outcomes)',
        `<p class="y-chinh">🎯 Three outcomes for the research stage of an essay: <strong>conduct research to explore the essay topic</strong> · <strong>carry out informed planning of essays</strong> · <strong>focus and refine your research to build arguments</strong>.</p>
<table>
<tr><th>Outcome</th><th>Stage of research it names</th><th>What you produce</th></tr>
<tr><td><strong>Conduct research to explore</strong></td><td>WIDE — reading around the topic</td><td>A rough map: who says what, which debates exist</td></tr>
<tr><td><strong>Carry out informed planning</strong></td><td>MIDDLE — planning that is now based on what you read</td><td>An outline whose sections you can actually source</td></tr>
<tr><td><strong>Focus and refine to build arguments</strong></td><td>NARROW — reading for specific gaps</td><td>The two or three sources that make each claim stand up</td></tr>
</table>
<ul>
<li><strong>The word "informed" is the hinge of the middle bullet.</strong> Planning before any reading produces an outline you cannot fill; planning after exploratory reading produces one you can. The MOOC is putting a first pass of research BEFORE planning on purpose.</li>
<li><strong>Research is not one activity but three phases</strong> — explore, plan, refine — and they use libraries differently: browsing and skimming first, targeted database searching last.</li>
<li><strong>"Build arguments" is the end state.</strong> Research that does not end attached to a claim of yours is just reading; it will not earn marks on its own.</li>
<li><strong>Applied at FPTU.</strong> For a 1500-word essay, budget roughly: two hours exploring (skim 8–10 sources), one hour planning, then targeted searching only for the claims your outline cannot yet support.</li>
</ul>
<p class="meo">💡 Three-word hook: <strong>EXPLORE → PLAN → REFINE</strong>. Wide, then structure, then narrow.</p>
<p class="pitfall">⚠️ Slide 33 (3.3b) prints these same three bullets with two words swapped: "essay topic" becomes "written assignment topic", and "essays" becomes "written assignments". Bullet 3 is <strong>identical word for word</strong>. Anchor on the noun, not on the sentence shape.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu cho chặng nghiên cứu của bài luận: <strong>tiến hành nghiên cứu để KHÁM PHÁ chủ đề bài luận</strong> · <strong>lập kế hoạch bài luận một cách CÓ HIỂU BIẾT</strong> · <strong>TẬP TRUNG và TINH CHỈNH nghiên cứu để dựng lập luận</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Gọi tên giai đoạn nào</th><th>Bạn tạo ra cái gì</th></tr>
<tr><td><strong>Nghiên cứu để khám phá</strong></td><td>RỘNG — đọc quanh chủ đề</td><td>Một bản đồ thô: ai nói gì, đang có những tranh luận nào</td></tr>
<tr><td><strong>Lập kế hoạch có hiểu biết</strong></td><td>GIỮA — lập dàn ý dựa trên thứ vừa đọc</td><td>Một dàn ý mà từng mục bạn thật sự kiếm được nguồn</td></tr>
<tr><td><strong>Tập trung và tinh chỉnh để dựng lập luận</strong></td><td>HẸP — đọc để bịt các lỗ hổng cụ thể</td><td>Hai ba nguồn làm cho mỗi khẳng định đứng vững</td></tr>
</table>
<ul>
<li><strong>Chữ "informed" (có hiểu biết) là bản lề của gạch giữa.</strong> Lập dàn ý trước khi đọc gì thì ra một dàn ý không điền nổi; lập sau khi đọc khám phá thì ra một dàn ý điền được. MOOC CỐ Ý đặt một lượt nghiên cứu TRƯỚC bước lập kế hoạch.</li>
<li><strong>Nghiên cứu không phải một hoạt động mà là BA pha</strong> — khám phá, lập kế hoạch, tinh chỉnh — và mỗi pha dùng thư viện một kiểu: lướt và đọc nhanh trước, tra cơ sở dữ liệu có đích sau cùng.</li>
<li><strong>"Dựng lập luận" là trạng thái đích.</strong> Nghiên cứu mà cuối cùng không gắn được vào một khẳng định CỦA BẠN thì chỉ là đọc; tự nó không ăn điểm.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với bài luận 1500 từ, chia thời gian đại khái: hai giờ khám phá (lướt 8–10 nguồn), một giờ lập dàn ý, rồi chỉ tra có đích cho những khẳng định mà dàn ý chưa đỡ nổi.</li>
</ul>
<p class="meo">💡 Mẹo ba chữ: <strong>KHÁM PHÁ → LẬP DÀN Ý → TINH CHỈNH</strong>. Rộng, rồi cấu trúc, rồi hẹp.</p>
<p class="pitfall">⚠️ Slide 33 (3.3b) in đúng ba gạch này với hai chữ bị tráo: "essay topic" thành "written assignment topic", và "essays" thành "written assignments". Gạch thứ 3 <strong>giống hệt từng chữ</strong>. Hãy neo vào DANH TỪ, đừng neo vào hình dạng câu.</p>`],

      [32, 'Summary: Research',
        `<p class="y-chinh">🎯 The research summary, and the second bullet is the one to memorise: <strong>organise yourself &amp; make a plan</strong> · <strong>research always comes AFTER you have understood, analysed &amp; generated OWN ideas</strong> · <strong>we research in order to: support, explain or clarify certain points · add detail to or more accurately define specific ideas · research concepts, aspects, expert opinions or issues that we don't know · build and focus arguments</strong>. Citation: <strong>(Cottrell, 2013; Greetham, 2013; Sowton, 2008; Van Geyte, 2013)</strong>.</p>
<table>
<tr><th>The FOUR reasons we research</th><th>What it fixes</th><th>Example claim it rescues</th></tr>
<tr><td><strong>Support, explain or clarify certain points</strong></td><td>A claim of yours that a reader could doubt</td><td>"Small teams abandon Scrum ceremonies first" → needs a study saying so</td></tr>
<tr><td><strong>Add detail to or more accurately define specific ideas</strong></td><td>A term you used loosely</td><td>"Small company" → a source that defines it as under 50 employees</td></tr>
<tr><td><strong>Research concepts, aspects, expert opinions or issues that we don't know</strong></td><td>A genuine gap in your knowledge</td><td>You have never read anything on Scrum adoption in Vietnam — go and read</td></tr>
<tr><td><strong>Build and focus arguments</strong></td><td>An argument that is still vague</td><td>Reading three case studies turns "there are challenges" into "the binding challenge is the part-time product owner"</td></tr>
</table>
<ul>
<li><strong>"AFTER" is capitalised, and so is "OWN".</strong> The MOOC is attacking the most common student order: read everything first, then try to have an opinion. Done that way, your essay becomes a summary of other people's views with no position of your own.</li>
<li><strong>The correct order is: understand the question → analyse it → generate your own ideas → THEN research.</strong> That chain ties this slide back to slides 26–28: research is stage two, interpretation is stage one.</li>
<li><strong>Three of the four reasons are about STRENGTHENING what you already have;</strong> only the third ("issues that we don't know") is about filling a blank. That ratio is the point — research serves your argument, it does not replace it.</li>
<li><strong>Applied at FPTU.</strong> Write your own answer to the prompt in 200 rough words before opening a single source. Then research to support, define, fill and focus. The 200 words will be bad, and they will still be the spine of the essay.</li>
</ul>
<p class="dap-an">✅ Exam-style check: how many reasons "to research" does this slide list? <strong>Four.</strong> Support/explain/clarify · add detail or define · research what we don't know · build and focus arguments. A distractor will offer three by merging the first two.</p>
<p class="pitfall">⚠️ Citation watch: this slide prints <strong>Greetham, 2013</strong>. Slide 36 prints <strong>Greetham, 2012</strong> for the same author. The deck is not consistent; remember the author, not the year.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt phần nghiên cứu, và gạch thứ HAI mới là thứ phải thuộc: <strong>tự tổ chức &amp; lập kế hoạch</strong> · <strong>nghiên cứu LUÔN đến SAU khi bạn đã HIỂU, PHÂN TÍCH &amp; sinh ra ý tưởng CỦA CHÍNH MÌNH</strong> · <strong>chúng ta nghiên cứu để: hỗ trợ, giải thích hoặc làm rõ một số điểm · thêm chi tiết hoặc định nghĩa chính xác hơn những ý cụ thể · tìm hiểu khái niệm, khía cạnh, ý kiến chuyên gia hoặc vấn đề mà ta CHƯA biết · dựng và tập trung lập luận</strong>. Trích dẫn: <strong>(Cottrell, 2013; Greetham, 2013; Sowton, 2008; Van Geyte, 2013)</strong>.</p>
<table>
<tr><th>BỐN lý do để nghiên cứu</th><th>Nó chữa cái gì</th><th>Khẳng định mà nó cứu</th></tr>
<tr><td><strong>Hỗ trợ, giải thích hoặc làm rõ một số điểm</strong></td><td>Một khẳng định của bạn mà người đọc có thể nghi ngờ</td><td>"Đội nhỏ bỏ các nghi thức Scrum đầu tiên" → cần một nghiên cứu nói vậy</td></tr>
<tr><td><strong>Thêm chi tiết / định nghĩa chính xác hơn</strong></td><td>Một thuật ngữ bạn dùng lỏng lẻo</td><td>"Công ty nhỏ" → một nguồn định nghĩa là dưới 50 nhân sự</td></tr>
<tr><td><strong>Tìm hiểu thứ ta CHƯA biết</strong></td><td>Một lỗ hổng thật trong hiểu biết của bạn</td><td>Bạn chưa đọc gì về việc áp dụng Scrum ở Việt Nam — thì đi đọc</td></tr>
<tr><td><strong>Dựng và tập trung lập luận</strong></td><td>Một lập luận còn mơ hồ</td><td>Đọc ba tình huống thật biến "có nhiều thách thức" thành "thách thức chốt chặn là product owner kiêm nhiệm"</td></tr>
</table>
<ul>
<li><strong>Chữ "AFTER" được viết hoa, và "OWN" cũng vậy.</strong> MOOC đang đánh thẳng vào thứ tự phổ biến nhất của sinh viên: đọc hết đã, rồi mới cố có ý kiến. Làm vậy thì bài luận của bạn thành bản tóm tắt quan điểm người khác, không còn lập trường nào của mình.</li>
<li><strong>Thứ tự đúng là: hiểu đề → phân tích đề → sinh ý của mình → RỒI MỚI nghiên cứu.</strong> Chuỗi đó buộc slide này về lại slide 26–28: nghiên cứu là chặng hai, diễn giải đề là chặng một.</li>
<li><strong>Ba trong bốn lý do là để LÀM MẠNH thứ bạn đã có;</strong> chỉ lý do thứ ba ("thứ ta chưa biết") là để lấp chỗ trống. Chính tỉ lệ đó là thông điệp — nghiên cứu PHỤC VỤ lập luận của bạn, nó không thay thế lập luận.</li>
<li><strong>Áp dụng ở FPTU.</strong> Hãy viết câu trả lời của chính bạn cho đề, khoảng 200 từ thô, trước khi mở bất cứ nguồn nào. Rồi mới nghiên cứu để hỗ trợ, định nghĩa, lấp và tập trung. 200 từ đó sẽ dở, và nó vẫn là xương sống của cả bài.</li>
</ul>
<p class="dap-an">✅ Kiểm kiểu đề thi: slide này liệt kê BAO NHIÊU lý do "để nghiên cứu"? <strong>Bốn.</strong> Hỗ trợ/giải thích/làm rõ · thêm chi tiết hoặc định nghĩa · tìm thứ chưa biết · dựng và tập trung lập luận. Đáp án nhiễu sẽ đưa ra BA bằng cách gộp hai cái đầu.</p>
<p class="pitfall">⚠️ Canh trích dẫn: slide này in <strong>Greetham, 2013</strong>. Slide 36 in <strong>Greetham, 2012</strong> cho cùng tác giả. Deck không nhất quán; hãy nhớ TÊN tác giả, đừng nhớ năm.</p>`],

      [33, '3.3b Conducting Research for Reports & Proposals (learning outcomes)',
        `<p class="y-chinh">🎯 The report-side twin of slide 31: <strong>conduct research to explore the written assignment topic</strong> · <strong>carry out informed planning of written assignments</strong> · <strong>focus and refine your research to build arguments</strong>. Same three moves, wider noun.</p>
<table>
<tr><th>Bullet</th><th>Slide 31 (3.3a)</th><th>Slide 33 (3.3b)</th></tr>
<tr><td>1</td><td>explore the <em>essay</em> topic</td><td>explore the <em>written assignment</em> topic</td></tr>
<tr><td>2</td><td>informed planning of <em>essays</em></td><td>informed planning of <em>written assignments</em></td></tr>
<tr><td>3</td><td colspan="2">identical: focus and refine your research to build arguments</td></tr>
</table>
<ul>
<li><strong>"Written assignment" is the umbrella term</strong> covering essays, reports and proposals. When the deck widens from a- to b-sections it swaps this noun in and changes nothing else.</li>
<li><strong>The research phases do not change with genre, but the SOURCES do.</strong> An essay leans on academic literature; a professional report also draws on industry data, internal documents and interviews; a proposal adds cost and feasibility evidence.</li>
<li><strong>Bullet 3 surviving unchanged is a real claim, not laziness:</strong> every genre ends by focusing research onto arguments. A report full of data that argues nothing still fails.</li>
<li><strong>Applied at FPTU.</strong> For the SWP391 report, explore = read two similar systems' documentation; plan = fix the section list; refine = hunt the specific benchmark or standard you cite in the design justification.</li>
</ul>
<p class="pitfall">⚠️ This is the fourth place in the range where a whole bullet block is reused (25↔29, 31↔33, and later 35↔38, 40↔42). If an exam question quotes a bullet with no section label, check whether the wording says <em>essay</em> or <em>written assignment</em> — that is often the only thing distinguishing the two answer options.</p>
<p class="meo">💡 Rule of thumb for this deck: <strong>a = essays · b = reports &amp; proposals</strong>, and b-sections say "written assignments" where a-sections say "essays".</p>`,
        `<p class="y-chinh">🎯 Bản sinh đôi phía báo cáo của slide 31: <strong>nghiên cứu để khám phá chủ đề BÀI VIẾT</strong> · <strong>lập kế hoạch có hiểu biết cho CÁC BÀI VIẾT</strong> · <strong>tập trung và tinh chỉnh nghiên cứu để dựng lập luận</strong>. Cùng ba nước đi, danh từ rộng hơn.</p>
<table>
<tr><th>Gạch</th><th>Slide 31 (3.3a)</th><th>Slide 33 (3.3b)</th></tr>
<tr><td>1</td><td>khám phá chủ đề <em>bài luận</em></td><td>khám phá chủ đề <em>bài viết (written assignment)</em></td></tr>
<tr><td>2</td><td>lập kế hoạch <em>bài luận</em></td><td>lập kế hoạch <em>bài viết</em></td></tr>
<tr><td>3</td><td colspan="2">GIỐNG HỆT: focus and refine your research to build arguments</td></tr>
</table>
<ul>
<li><strong>"Written assignment" là từ ô dù</strong> phủ cả bài luận, báo cáo và đề xuất. Khi deck nới từ mục a sang mục b, nó tráo đúng danh từ này vào và không đổi gì khác.</li>
<li><strong>Các pha nghiên cứu không đổi theo thể loại, nhưng NGUỒN thì đổi.</strong> Bài luận dựa vào tài liệu học thuật; báo cáo nghề nghiệp còn lấy dữ liệu ngành, tài liệu nội bộ và phỏng vấn; đề xuất thêm bằng chứng về chi phí và tính khả thi.</li>
<li><strong>Việc gạch 3 sống sót nguyên vẹn là một khẳng định thật, không phải lười:</strong> mọi thể loại đều kết thúc bằng việc quy nghiên cứu về lập luận. Một báo cáo đầy dữ liệu mà không lập luận điều gì thì vẫn trượt.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với báo cáo SWP391: khám phá = đọc tài liệu của hai hệ thống tương tự; lập kế hoạch = chốt danh sách mục; tinh chỉnh = săn đúng cái benchmark hay chuẩn mà bạn sẽ trích trong phần biện minh thiết kế.</li>
</ul>
<p class="pitfall">⚠️ Đây là chỗ thứ TƯ trong dải có cả khối bullet bị dùng lại (25↔29, 31↔33, và sau đó 35↔38, 40↔42). Nếu đề trích một gạch đầu dòng mà không ghi tên mục, hãy soi xem chữ là <em>essay</em> hay <em>written assignment</em> — thường đó là thứ duy nhất phân biệt hai phương án.</p>
<p class="meo">💡 Luật bỏ túi cho deck này: <strong>a = bài luận · b = báo cáo &amp; đề xuất</strong>, và mục b nói "written assignments" ở chỗ mục a nói "essays".</p>`],

      [34, 'Summary: Conducting research for reports & proposals',
        `<p class="y-chinh">🎯 Where the research GOES inside each kind of report. <strong>Research reports:</strong> use original data along with primary and secondary sources · original data presented <strong>in the middle</strong>, other sources at the <strong>beginning and end</strong>. <strong>Professional reports:</strong> amount of research often <strong>lower</strong> than essays and research reports · research justifies or supports activities or solutions · research usually presented <strong>in the beginning</strong>. Citation: <strong>(Nesi and Gardner, 2012; Swales and Feak, 2012; Yeung, 2007)</strong>.</p>
<table>
<tr><th></th><th>Research report</th><th>Professional report</th></tr>
<tr><td><strong>How much research</strong></td><td>High — it is the point of the genre</td><td><strong>Often lower</strong> than essays and research reports</td></tr>
<tr><td><strong>What research is FOR</strong></td><td>To situate and interpret your own data</td><td>To <strong>justify or support</strong> activities or solutions</td></tr>
<tr><td><strong>Where other sources sit</strong></td><td><strong>Beginning and end</strong> (intro and discussion)</td><td><strong>Beginning</strong></td></tr>
<tr><td><strong>Where your own data sits</strong></td><td><strong>Middle</strong> (method and results)</td><td>Middle-to-end, as what you did and recommend</td></tr>
</table>
<ul>
<li><strong>The research report has a literature sandwich.</strong> Other people's work at both ends, your original data in the middle. That shape is the reason the IMRD structure on slide 37 exists: Introduction (others) – Methodology/Results (yours) – Discussion (others again, now in conversation with yours).</li>
<li><strong>"Often lower" is a comparison, not a licence.</strong> A professional report still cites; it just cites less, and earlier, because its job is to act rather than to establish knowledge.</li>
<li><strong>Primary versus secondary versus original.</strong> Original data is what YOU collected. Primary sources are first-hand records or reports of research. Secondary sources comment on or synthesise them. The slide requires original data <em>along with</em> both kinds — not instead of them.</li>
<li><strong>Applied at FPTU.</strong> Your SWP391 document is a professional report: put the literature and standards in the opening justification, then spend the body on what the team built and decided. A research-style report for a data or AI subject flips it: sources open and close, your measurements sit in the middle.</li>
</ul>
<p class="dap-an">✅ Quick check: in a <em>research</em> report, where does original data appear? <strong>In the middle</strong>, with other sources at the beginning and end. In a <em>professional</em> report, where is research usually presented? <strong>In the beginning.</strong> These two positions are the most examinable facts on the slide.</p>
<p class="pitfall">⚠️ Style watch: this slide writes <strong>"Nesi and Gardner"</strong> and <strong>"Swales and Feak"</strong> with the word "and", while slides 30 and 37 write them with an ampersand. Same authors, two house styles, one deck.</p>`,
        `<p class="y-chinh">🎯 Nghiên cứu ĐI VÀO CHỖ NÀO trong từng loại báo cáo. <strong>Báo cáo nghiên cứu:</strong> dùng dữ liệu GỐC cùng với nguồn sơ cấp và thứ cấp · dữ liệu gốc đặt ở <strong>GIỮA</strong>, các nguồn khác đặt ở <strong>ĐẦU và CUỐI</strong>. <strong>Báo cáo nghề nghiệp:</strong> lượng nghiên cứu thường <strong>ÍT HƠN</strong> bài luận và báo cáo nghiên cứu · nghiên cứu để <strong>biện minh hoặc hỗ trợ</strong> cho hoạt động hay giải pháp · nghiên cứu thường đặt ở <strong>ĐẦU</strong>. Trích dẫn: <strong>(Nesi and Gardner, 2012; Swales and Feak, 2012; Yeung, 2007)</strong>.</p>
<table>
<tr><th></th><th>Báo cáo nghiên cứu</th><th>Báo cáo nghề nghiệp</th></tr>
<tr><td><strong>Nghiên cứu nhiều hay ít</strong></td><td>Nhiều — đó là lý do tồn tại của thể loại</td><td><strong>Thường ÍT HƠN</strong> bài luận và báo cáo nghiên cứu</td></tr>
<tr><td><strong>Nghiên cứu ĐỂ LÀM GÌ</strong></td><td>Định vị và diễn giải dữ liệu của chính bạn</td><td><strong>Biện minh hoặc hỗ trợ</strong> cho hoạt động, giải pháp</td></tr>
<tr><td><strong>Nguồn của người khác nằm đâu</strong></td><td><strong>Đầu và cuối</strong> (mở đầu và bàn luận)</td><td><strong>Đầu</strong></td></tr>
<tr><td><strong>Dữ liệu của bạn nằm đâu</strong></td><td><strong>Giữa</strong> (phương pháp và kết quả)</td><td>Giữa tới cuối, dưới dạng bạn đã làm gì và khuyến nghị gì</td></tr>
</table>
<ul>
<li><strong>Báo cáo nghiên cứu có hình cái BÁNH KẸP tài liệu.</strong> Việc của người khác ở hai đầu, dữ liệu gốc của bạn ở giữa. Chính hình dạng đó đẻ ra cấu trúc IMRD ở slide 37: Introduction (người khác) – Methodology/Results (của bạn) – Discussion (lại người khác, giờ đối thoại với của bạn).</li>
<li><strong>"Thường ít hơn" là một so sánh, không phải giấy phép.</strong> Báo cáo nghề nghiệp vẫn trích dẫn; chỉ là trích ít hơn và trích SỚM hơn, vì việc của nó là HÀNH ĐỘNG chứ không phải thiết lập tri thức.</li>
<li><strong>Phân biệt sơ cấp – thứ cấp – dữ liệu gốc.</strong> Dữ liệu GỐC là thứ CHÍNH BẠN thu thập. Nguồn sơ cấp là ghi chép hoặc báo cáo nghiên cứu trực tiếp. Nguồn thứ cấp là thứ bình luận, tổng hợp lại chúng. Slide đòi dữ liệu gốc đi <em>CÙNG VỚI</em> cả hai loại kia — không phải thay cho chúng.</li>
<li><strong>Áp dụng ở FPTU.</strong> Tài liệu SWP391 của bạn là báo cáo nghề nghiệp: đặt tài liệu tham khảo và chuẩn kỹ thuật vào phần biện minh mở đầu, rồi dành thân bài cho thứ nhóm đã dựng và đã quyết. Báo cáo kiểu nghiên cứu cho môn dữ liệu hay AI thì lật ngược: nguồn mở và đóng, số đo của bạn nằm giữa.</li>
</ul>
<p class="dap-an">✅ Kiểm nhanh: trong báo cáo <em>nghiên cứu</em>, dữ liệu gốc xuất hiện ở đâu? <strong>Ở GIỮA</strong>, các nguồn khác ở đầu và cuối. Trong báo cáo <em>nghề nghiệp</em>, nghiên cứu thường được trình bày ở đâu? <strong>Ở ĐẦU.</strong> Hai vị trí này là hai dữ kiện dễ ra đề nhất trên slide.</p>
<p class="pitfall">⚠️ Canh kiểu viết: slide này ghi <strong>"Nesi and Gardner"</strong> và <strong>"Swales and Feak"</strong> bằng chữ "and", trong khi slide 30 và 37 ghi bằng dấu "&amp;". Cùng tác giả, hai kiểu trình bày, chung một deck.</p>`],

      [35, '3.4a Planning Essays (learning outcomes)',
        `<p class="y-chinh">🎯 Three outcomes for planning: <strong>understand different options to structure your arguments</strong> · <strong>create outlines for different types of written assignments</strong> · <strong>plan citations and evidence to be used in support of arguments</strong>.</p>
<table>
<tr><th>Outcome</th><th>The decision it forces</th><th>Concretely</th></tr>
<tr><td><strong>Options to structure arguments</strong></td><td>Which ORDER do my arguments go in?</td><td>Deductive (position first, then support — slide 36) or inductive (evidence first, position last)</td></tr>
<tr><td><strong>Create outlines per type</strong></td><td>Which SHAPE does this genre use?</td><td>Essay = Title/Intro/Body/Conclusion/References · research report = IMRD · professional report = Opening→Closing (slide 37)</td></tr>
<tr><td><strong>Plan citations and evidence</strong></td><td>WHICH source props up WHICH paragraph?</td><td>Write the source next to each outline point, before drafting</td></tr>
</table>
<ul>
<li><strong>The third outcome is the one students skip.</strong> Planning citations at outline time is what prevents the classic failure: a beautiful structure whose third body paragraph has nothing to cite, discovered at 11pm the night before.</li>
<li><strong>"Different options" means structure is a CHOICE, not a template.</strong> Deductive order suits an argumentative essay with a clear position; inductive order suits a piece that must bring a sceptical reader along before revealing the conclusion.</li>
<li><strong>An outline is a contract with yourself.</strong> Each line should be a claim, not a topic — "Scrum ceremonies" is a topic; "small teams drop ceremonies first because the product owner is part-time" is a claim you can actually write a paragraph about.</li>
<li><strong>Applied at FPTU.</strong> Make your outline a three-column table: claim · evidence/source · approximate word count. If a row has an empty middle column, you have found the paragraph that will fail.</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide 38 (3.4b) reprints these three bullets word for word — with no changes at all.</strong> This is the only bullet block in the range that is reused with zero edits, so nothing in the text tells you which section a quoted bullet came from. If the exam asks, use the section title: "Planning Essays" = 3.4a, "Planning Reports &amp; Proposals" = 3.4b.</p>
<p class="meo">💡 Three-word hook for planning: <strong>ORDER · SHAPE · SOURCES</strong>.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu cho khâu lập dàn ý: <strong>hiểu các PHƯƠNG ÁN khác nhau để sắp xếp lập luận</strong> · <strong>tạo DÀN Ý cho các loại bài viết khác nhau</strong> · <strong>lên kế hoạch cho TRÍCH DẪN và BẰNG CHỨNG dùng để đỡ lập luận</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Nó ép bạn quyết định gì</th><th>Cụ thể</th></tr>
<tr><td><strong>Phương án sắp xếp lập luận</strong></td><td>Các lập luận đi theo THỨ TỰ nào?</td><td>Diễn dịch (lập trường trước, dẫn chứng sau — slide 36) hay quy nạp (bằng chứng trước, lập trường cuối)</td></tr>
<tr><td><strong>Dàn ý theo từng thể loại</strong></td><td>Thể loại này dùng HÌNH DẠNG nào?</td><td>Bài luận = Title/Intro/Body/Conclusion/References · báo cáo nghiên cứu = IMRD · báo cáo nghề nghiệp = Opening→Closing (slide 37)</td></tr>
<tr><td><strong>Lên kế hoạch trích dẫn &amp; bằng chứng</strong></td><td>Nguồn NÀO đỡ cho đoạn NÀO?</td><td>Ghi tên nguồn ngay cạnh từng ý trong dàn ý, TRƯỚC khi viết nháp</td></tr>
</table>
<ul>
<li><strong>Mục tiêu thứ ba là cái sinh viên hay bỏ.</strong> Lên kế hoạch trích dẫn ngay lúc lập dàn ý chính là thứ chặn được thất bại kinh điển: một cấu trúc rất đẹp mà đoạn thân thứ ba chẳng có gì để trích, phát hiện ra lúc 11 giờ đêm hôm trước hạn nộp.</li>
<li><strong>"Different options" nghĩa là cấu trúc là một LỰA CHỌN, không phải cái khuôn.</strong> Thứ tự diễn dịch hợp bài lập luận có lập trường rõ; thứ tự quy nạp hợp bài phải dắt một người đọc hoài nghi đi cùng trước khi lộ ra kết luận.</li>
<li><strong>Dàn ý là một bản hợp đồng với chính mình.</strong> Mỗi dòng phải là một KHẲNG ĐỊNH, không phải một chủ đề — "các nghi thức Scrum" là chủ đề; "đội nhỏ bỏ nghi thức trước tiên vì product owner làm kiêm nhiệm" mới là khẳng định viết được hẳn một đoạn.</li>
<li><strong>Áp dụng ở FPTU.</strong> Hãy làm dàn ý thành bảng ba cột: khẳng định · bằng chứng/nguồn · số từ dự kiến. Dòng nào cột giữa để trống thì bạn vừa tìm ra cái đoạn sẽ hỏng.</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide 38 (3.4b) in lại đúng ba gạch này, từng chữ một — không sửa gì cả.</strong> Đây là khối bullet duy nhất trong dải bị dùng lại mà KHÔNG chỉnh một chữ, nên không có manh mối nào trong văn bản cho biết một gạch được trích thuộc mục nào. Đề hỏi thì hãy dùng TIÊU ĐỀ mục: "Planning Essays" = 3.4a, "Planning Reports &amp; Proposals" = 3.4b.</p>
<p class="meo">💡 Mẹo ba chữ cho khâu lập dàn ý: <strong>THỨ TỰ · HÌNH DẠNG · NGUỒN</strong>.</p>`],

      [36, 'Summary: Essays – Deductive arguments',
        `<p class="y-chinh">🎯 The deductive essay skeleton, top to bottom: <strong>Title</strong> · <strong>Intro</strong> (explain your position) · <strong>Body</strong> (<strong>least persuasive</strong> argument supporting position → <strong>persuasive</strong> argument supporting position → <strong>most persuasive</strong> argument supporting position) · <strong>Conclusion</strong> (restates your position, sometimes with adaptations) · <strong>References</strong>. Citation: <strong>(Brick et al., 2016; Cottrell, 2013; Greetham, 2012; Reinders et al., 2012; Thomson &amp; Droga, 2012)</strong>.</p>
<table>
<tr><th>Part</th><th>Job</th><th>Words in a 1500-word essay</th></tr>
<tr><td><strong>Title</strong></td><td>Names the position or the question</td><td>—</td></tr>
<tr><td><strong>Intro</strong></td><td>States the position up front — this is what makes it DEDUCTIVE</td><td>~150 (10%, per slide 41)</td></tr>
<tr><td><strong>Body 1 — least persuasive</strong></td><td>The weakest supporting argument goes FIRST</td><td>~350</td></tr>
<tr><td><strong>Body 2 — persuasive</strong></td><td>The middle-strength argument</td><td>~400</td></tr>
<tr><td><strong>Body 3 — most persuasive</strong></td><td>Your strongest argument, immediately before the conclusion</td><td>~450</td></tr>
<tr><td><strong>Conclusion</strong></td><td>Restates the position, sometimes with adaptations</td><td>~150</td></tr>
<tr><td><strong>References</strong></td><td>Full list — not counted in the word count</td><td>—</td></tr>
</table>
<ul>
<li><strong>Deductive = the position comes FIRST.</strong> The reader knows your answer from the introduction and spends the body watching you prove it. The inductive alternative withholds the position until the end; the slide only summarises the deductive one.</li>
<li><strong>The ascending order is the counter-intuitive bit.</strong> Weakest argument first, strongest last, so momentum builds into the conclusion. Students instinctively lead with their best point and then trail off.</li>
<li><strong>All three body arguments are "supporting position".</strong> This skeleton has no dedicated counter-argument section. If your prompt says "discuss" or "evaluate", you will need to fold opposing views into each paragraph rather than giving them their own.</li>
<li><strong>"Sometimes with adaptations" licenses honesty.</strong> A conclusion may restate the position slightly modified by what the body showed — that reads as thinking, not as inconsistency.</li>
</ul>
<p class="dap-an">✅ Worked outline for <em>"Discuss the main challenges of applying Scrum in small Vietnamese software companies" (1500 words)</em>. <strong>Intro (150):</strong> position — the binding constraint is not tooling but the part-time product owner. <strong>Body 1, least persuasive (350):</strong> lack of formal Scrum training slows adoption (true, but cheap to fix) — cite a training-effect study. <strong>Body 2 (400):</strong> small teams cannot afford dedicated Scrum Master time, so ceremonies decay — cite two case studies. <strong>Body 3, most persuasive (450):</strong> without an empowered product owner the backlog is never prioritised, which makes every other practice cosmetic — cite the strongest evidence you have. <strong>Conclusion (150):</strong> restate, adapted: training and ceremonies matter, but only after the product owner problem is solved.</p>
<p class="pitfall">⚠️ Citation trap: this slide prints <strong>Greetham, 2012</strong> and <strong>Reinders et al., 2012</strong>, while slide 41 prints <strong>Greetham, 2013</strong> and <strong>Reinders et al., 2013</strong> for the same authors. Two slides, four years, no explanation. Do not try to reconcile them — just do not answer a question from memory of the year alone.</p>`,
        `<p class="y-chinh">🎯 Bộ xương bài luận DIỄN DỊCH, từ trên xuống: <strong>Title</strong> (nhan đề) · <strong>Intro</strong> (nêu rõ lập trường của bạn) · <strong>Body</strong> (lập luận <strong>ÍT thuyết phục nhất</strong> đỡ cho lập trường → lập luận <strong>thuyết phục</strong> → lập luận <strong>THUYẾT PHỤC NHẤT</strong>) · <strong>Conclusion</strong> (nhắc lại lập trường, đôi khi CÓ ĐIỀU CHỈNH) · <strong>References</strong>. Trích dẫn: <strong>(Brick et al., 2016; Cottrell, 2013; Greetham, 2012; Reinders et al., 2012; Thomson &amp; Droga, 2012)</strong>.</p>
<table>
<tr><th>Phần</th><th>Việc của nó</th><th>Số từ trong bài 1500 từ</th></tr>
<tr><td><strong>Title</strong></td><td>Gọi tên lập trường hoặc câu hỏi</td><td>—</td></tr>
<tr><td><strong>Intro</strong></td><td>Nêu lập trường NGAY TỪ ĐẦU — chính điều này làm nó DIỄN DỊCH</td><td>~150 (10%, theo slide 41)</td></tr>
<tr><td><strong>Thân 1 — ít thuyết phục nhất</strong></td><td>Lập luận yếu nhất đi TRƯỚC</td><td>~350</td></tr>
<tr><td><strong>Thân 2 — thuyết phục</strong></td><td>Lập luận mạnh vừa</td><td>~400</td></tr>
<tr><td><strong>Thân 3 — thuyết phục nhất</strong></td><td>Lập luận mạnh nhất, đặt ngay trước kết luận</td><td>~450</td></tr>
<tr><td><strong>Conclusion</strong></td><td>Nhắc lại lập trường, đôi khi có điều chỉnh</td><td>~150</td></tr>
<tr><td><strong>References</strong></td><td>Danh mục đầy đủ — không tính vào số từ</td><td>—</td></tr>
</table>
<ul>
<li><strong>Diễn dịch = lập trường đi TRƯỚC.</strong> Người đọc biết câu trả lời của bạn ngay từ mở bài rồi dành cả thân bài để xem bạn chứng minh. Phương án quy nạp thì giấu lập trường tới cuối; slide này chỉ tóm tắt loại diễn dịch.</li>
<li><strong>Thứ tự TĂNG DẦN mới là chỗ phản trực giác.</strong> Lập luận yếu nhất trước, mạnh nhất sau cùng, để đà dồn vào kết luận. Sinh viên theo bản năng thì tung ý hay nhất lên đầu rồi đuối dần.</li>
<li><strong>Cả ba lập luận thân bài đều là "supporting position".</strong> Bộ xương này KHÔNG có mục dành riêng cho phản biện. Nếu đề ghi "discuss" hay "evaluate", bạn phải gấp quan điểm đối lập vào TRONG từng đoạn chứ không cho chúng một đoạn riêng.</li>
<li><strong>"Sometimes with adaptations" cho phép bạn thành thật.</strong> Kết luận có thể nhắc lại lập trường đã chỉnh nhẹ theo thứ thân bài vừa cho thấy — người chấm đọc ra đó là tư duy, không phải tiền hậu bất nhất.</li>
</ul>
<p class="dap-an">✅ Dàn ý thật cho đề <em>"Discuss the main challenges of applying Scrum in small Vietnamese software companies" (1500 từ)</em>. <strong>Mở bài (150):</strong> lập trường — nút thắt không nằm ở công cụ mà ở product owner kiêm nhiệm. <strong>Thân 1, ít thuyết phục nhất (350):</strong> thiếu đào tạo Scrum bài bản làm chậm việc áp dụng (đúng, nhưng dễ sửa) — trích một nghiên cứu về hiệu quả đào tạo. <strong>Thân 2 (400):</strong> đội nhỏ không kham nổi một Scrum Master toàn thời gian nên các nghi thức rữa dần — trích hai tình huống thật. <strong>Thân 3, thuyết phục nhất (450):</strong> không có product owner có thực quyền thì backlog không bao giờ được ưu tiên, khiến mọi thực hành khác chỉ còn là hình thức — trích bằng chứng mạnh nhất bạn có. <strong>Kết (150):</strong> nhắc lại có điều chỉnh: đào tạo và nghi thức đều quan trọng, nhưng chỉ sau khi giải xong bài toán product owner.</p>
<p class="pitfall">⚠️ Bẫy trích dẫn: slide này in <strong>Greetham, 2012</strong> và <strong>Reinders et al., 2012</strong>, còn slide 41 in <strong>Greetham, 2013</strong> và <strong>Reinders et al., 2013</strong> cho cùng những tác giả đó. Hai slide, bốn cái năm, không lời giải thích. Đừng cố hoà giải — chỉ cần đừng trả lời một câu hỏi chỉ dựa vào trí nhớ về năm.</p>`],

      [37, 'Summary: Planning Reports and Proposals',
        `<p class="y-chinh">🎯 Two report shapes, each given at two levels — the abstract movement, then the named sections. <strong>Research reports:</strong> <strong>General – Specific – General</strong> · <strong>Introduction – Methodology – Results – Discussion/Conclusion</strong>. <strong>Professional reports:</strong> <strong>General – Specific</strong> · <strong>Opening – Identification of problem – Presentation of data – Processing of data – Closing</strong>. Citation: <strong>(Brick, Herke &amp; Wong, 2016; Nesi &amp; Gardner, 2012)</strong>.</p>
<table>
<tr><th></th><th>Research report</th><th>Professional report</th></tr>
<tr><td><strong>Movement</strong></td><td>General – Specific – <strong>General</strong> (returns to the wide view)</td><td>General – Specific (<strong>does not return</strong>)</td></tr>
<tr><td><strong>Named sections</strong></td><td>4: Introduction · Methodology · Results · Discussion/Conclusion</td><td>5: Opening · Identification of problem · Presentation of data · Processing of data · Closing</td></tr>
<tr><td><strong>Shape</strong></td><td>Hourglass — wide, narrow, wide again</td><td>Funnel — wide then narrow</td></tr>
<tr><td><strong>Ends with</strong></td><td>Interpretation set back into the wider field</td><td>A closing that acts: what to do next</td></tr>
</table>
<ul>
<li><strong>Count the sections — this is prime exam material.</strong> Research report = <strong>4</strong> named sections (IMRD). Professional report = <strong>5</strong>. A distractor will give the professional report four sections by merging "Presentation of data" with "Processing of data".</li>
<li><strong>Presentation versus processing of data are deliberately separate.</strong> Presentation shows what was found; processing interprets it and draws consequences. Mixing them into one section is the most common weakness in student reports: tables with no reading of the tables.</li>
<li><strong>The third "General" is what distinguishes the two movements.</strong> A research report must return to the field — "what does this mean for what we knew?" A professional report ends inside the specific situation, with an action.</li>
<li><strong>Applied at FPTU.</strong> SWP391 documentation maps onto the professional five: Opening (context and scope) → Identification of problem (why this system) → Presentation of data (what was built, measured, tested) → Processing of data (what the results mean, what was traded off) → Closing (limitations, next steps).</li>
</ul>
<p class="pitfall">⚠️ <strong>This slide is in the wrong place.</strong> It summarises section 3.4b (Planning Reports &amp; Proposals), yet it appears BEFORE that section's opening slide (38). And it appears <strong>again</strong> as slide 39, immediately after. Treat 37 and 39 as one slide printed twice — see slide 39 for the difference between the two prints.</p>
<p class="meo">💡 Shape hook: research report = <strong>HOURGLASS</strong> (G–S–G, 4 sections). Professional report = <strong>FUNNEL</strong> (G–S, 5 sections).</p>`,
        `<p class="y-chinh">🎯 Hai hình dạng báo cáo, mỗi cái cho ở hai tầng — chuyển động trừu tượng, rồi tên các mục. <strong>Báo cáo nghiên cứu:</strong> <strong>Chung – Cụ thể – Chung</strong> · <strong>Introduction – Methodology – Results – Discussion/Conclusion</strong>. <strong>Báo cáo nghề nghiệp:</strong> <strong>Chung – Cụ thể</strong> · <strong>Opening – Identification of problem – Presentation of data – Processing of data – Closing</strong>. Trích dẫn: <strong>(Brick, Herke &amp; Wong, 2016; Nesi &amp; Gardner, 2012)</strong>.</p>
<table>
<tr><th></th><th>Báo cáo nghiên cứu</th><th>Báo cáo nghề nghiệp</th></tr>
<tr><td><strong>Chuyển động</strong></td><td>Chung – Cụ thể – <strong>Chung</strong> (quay lại tầm nhìn rộng)</td><td>Chung – Cụ thể (<strong>KHÔNG quay lại</strong>)</td></tr>
<tr><td><strong>Số mục có tên</strong></td><td>4: Introduction · Methodology · Results · Discussion/Conclusion</td><td>5: Opening · Identification of problem · Presentation of data · Processing of data · Closing</td></tr>
<tr><td><strong>Hình</strong></td><td>ĐỒNG HỒ CÁT — rộng, hẹp, rộng lại</td><td>PHỄU — rộng rồi hẹp</td></tr>
<tr><td><strong>Kết thúc bằng</strong></td><td>Diễn giải đặt trở lại vào bối cảnh ngành</td><td>Một phần kết có tính HÀNH ĐỘNG: làm gì tiếp</td></tr>
</table>
<ul>
<li><strong>Đếm số mục — đây là nguyên liệu ra đề hạng nhất.</strong> Báo cáo nghiên cứu = <strong>4</strong> mục có tên (IMRD). Báo cáo nghề nghiệp = <strong>5</strong>. Đáp án nhiễu sẽ cho báo cáo nghề nghiệp bốn mục bằng cách gộp "Presentation of data" với "Processing of data".</li>
<li><strong>Trình bày dữ liệu và XỬ LÝ dữ liệu được tách ra là CỐ Ý.</strong> Trình bày cho thấy tìm được gì; xử lý diễn giải nó và rút ra hệ quả. Nhập hai cái làm một là điểm yếu phổ biến nhất của báo cáo sinh viên: có bảng biểu mà không ai đọc bảng biểu đó ra thành lời.</li>
<li><strong>Chữ "Chung" thứ ba mới là thứ phân biệt hai chuyển động.</strong> Báo cáo nghiên cứu buộc phải quay về với ngành — "điều này có nghĩa gì với thứ ta đã biết?". Báo cáo nghề nghiệp kết thúc ngay trong tình huống cụ thể, bằng một hành động.</li>
<li><strong>Áp dụng ở FPTU.</strong> Tài liệu SWP391 khớp đúng bộ năm nghề nghiệp: Opening (bối cảnh, phạm vi) → Identification of problem (vì sao cần hệ thống này) → Presentation of data (đã dựng gì, đo gì, test gì) → Processing of data (kết quả nói lên điều gì, đã đánh đổi gì) → Closing (hạn chế, bước tiếp theo).</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide này đặt SAI CHỖ.</strong> Nó tóm tắt mục 3.4b (Planning Reports &amp; Proposals), thế mà lại xuất hiện TRƯỚC slide mở đầu của chính mục đó (slide 38). Và nó xuất hiện <strong>LẦN NỮA</strong> ở slide 39, ngay sau đấy. Hãy coi 37 và 39 là MỘT slide được in hai lượt — xem slide 39 để biết hai bản in khác nhau chỗ nào.</p>
<p class="meo">💡 Mẹo hình dạng: báo cáo nghiên cứu = <strong>ĐỒNG HỒ CÁT</strong> (Chung–Cụ thể–Chung, 4 mục). Báo cáo nghề nghiệp = <strong>PHỄU</strong> (Chung–Cụ thể, 5 mục).</p>`],

      [38, '3.4b Planning Reports & Proposals (learning outcomes)',
        `<p class="y-chinh">🎯 The opening slide of section 3.4b, and its three bullets are <strong>identical, word for word, to slide 35</strong>: <strong>understand different options to structure your arguments</strong> · <strong>create outlines for different types of written assignments</strong> · <strong>plan citations and evidence to be used in support of arguments</strong>. Only the section title changed.</p>
<table>
<tr><th>Bullet</th><th>Slide 35 (3.4a Planning Essays)</th><th>Slide 38 (3.4b Planning Reports &amp; Proposals)</th></tr>
<tr><td>1</td><td colspan="2">understand different options to structure your arguments — <strong>identical</strong></td></tr>
<tr><td>2</td><td colspan="2">create outlines for different types of written assignments — <strong>identical</strong></td></tr>
<tr><td>3</td><td colspan="2">plan citations and evidence to be used in support of arguments — <strong>identical</strong></td></tr>
</table>
<ul>
<li><strong>Why the repetition is defensible.</strong> Bullet 2 already said "different types of written assignments", so slide 35's objectives were never essay-specific in the first place; the deck simply reuses the general statement for the report section.</li>
<li><strong>What actually differs between 3.4a and 3.4b is the SUMMARY, not the objectives.</strong> 3.4a summarises into the deductive essay skeleton (slide 36); 3.4b summarises into the two report shapes (slides 37 and 39). Study the summaries as the real content of each section.</li>
<li><strong>Planning a proposal adds one thing the essay skeleton has no slot for: feasibility.</strong> A proposal must show the recommended action can actually be done — cost, time, risk — which lands inside "Processing of data" and "Closing".</li>
<li><strong>Applied at FPTU.</strong> Use the same three-column outline table for the SWP391 report as for an essay; only the row labels change, from body paragraphs to the five professional-report sections.</li>
</ul>
<p class="pitfall">⚠️ <strong>A bullet quoted on its own cannot be attributed to a section here.</strong> This is the strongest example in the whole range of the deck reusing content across differently-named sections. If an exam item quotes one of these three lines and asks which section, the honest answer is that both 3.4a and 3.4b print it — go by whatever else the stem gives you.</p>
<p class="meo">💡 Section map for 3.4: <strong>objectives are shared · summaries are not</strong>. 3.4a → deductive essay (Title/Intro/Body/Conclusion/References). 3.4b → research report (IMRD) and professional report (Opening→Closing).</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu mục 3.4b, và ba gạch đầu dòng của nó <strong>giống hệt slide 35, từng chữ một</strong>: <strong>hiểu các phương án khác nhau để sắp xếp lập luận</strong> · <strong>tạo dàn ý cho các loại bài viết khác nhau</strong> · <strong>lên kế hoạch trích dẫn và bằng chứng để đỡ lập luận</strong>. Chỉ có TIÊU ĐỀ MỤC là đổi.</p>
<table>
<tr><th>Gạch</th><th>Slide 35 (3.4a Planning Essays)</th><th>Slide 38 (3.4b Planning Reports &amp; Proposals)</th></tr>
<tr><td>1</td><td colspan="2">understand different options to structure your arguments — <strong>GIỐNG HỆT</strong></td></tr>
<tr><td>2</td><td colspan="2">create outlines for different types of written assignments — <strong>GIỐNG HỆT</strong></td></tr>
<tr><td>3</td><td colspan="2">plan citations and evidence to be used in support of arguments — <strong>GIỐNG HỆT</strong></td></tr>
</table>
<ul>
<li><strong>Vì sao việc lặp này còn biện hộ được.</strong> Gạch 2 vốn đã ghi "different types of written assignments", nên mục tiêu ở slide 35 ngay từ đầu đã không chỉ dành cho bài luận; deck đơn giản là dùng lại phát biểu tổng quát đó cho mục báo cáo.</li>
<li><strong>Thứ THẬT SỰ khác giữa 3.4a và 3.4b là SLIDE TÓM TẮT, không phải mục tiêu.</strong> 3.4a tóm vào bộ xương bài luận diễn dịch (slide 36); 3.4b tóm vào hai hình dạng báo cáo (slide 37 và 39). Hãy học slide tóm tắt như là nội dung thật của từng mục.</li>
<li><strong>Lập kế hoạch một bản đề xuất thêm một thứ mà bộ xương bài luận không có ô: TÍNH KHẢ THI.</strong> Đề xuất phải cho thấy hành động khuyến nghị làm được thật — chi phí, thời gian, rủi ro — và nó rơi vào "Processing of data" với "Closing".</li>
<li><strong>Áp dụng ở FPTU.</strong> Dùng đúng cái bảng dàn ý ba cột cho báo cáo SWP391 như cho bài luận; chỉ đổi nhãn dòng, từ các đoạn thân bài sang năm mục của báo cáo nghề nghiệp.</li>
</ul>
<p class="pitfall">⚠️ <strong>Một gạch đầu dòng trích riêng ra thì KHÔNG quy được về mục nào ở đây.</strong> Đây là ví dụ mạnh nhất trong cả dải về việc deck dùng lại nội dung giữa những mục mang tên khác nhau. Nếu đề trích một trong ba dòng này rồi hỏi thuộc mục nào, câu trả lời thành thật là CẢ 3.4a lẫn 3.4b đều in nó — hãy bám vào những gì còn lại trong đề.</p>
<p class="meo">💡 Bản đồ mục 3.4: <strong>mục tiêu thì dùng chung · tóm tắt thì không</strong>. 3.4a → bài luận diễn dịch (Title/Intro/Body/Conclusion/References). 3.4b → báo cáo nghiên cứu (IMRD) và báo cáo nghề nghiệp (Opening→Closing).</p>`],

      [39, 'Summary: Planning Reports and Proposals (repeat of slide 37, cropped)',
        `<p class="y-chinh">🎯 <strong>The same slide as 37, printed a second time</strong> — same title, same two report shapes, same citation (Brick, Herke &amp; Wong, 2016; Nesi &amp; Gardner, 2012). The only difference is physical: this print is zoomed in, so the right-hand ends of two lines run off the edge of the frame.</p>
<table>
<tr><th>Line</th><th>Slide 37 (complete)</th><th>Slide 39 (cropped)</th></tr>
<tr><td>Research report sections</td><td>Introduction – Methodology – Results – <strong>Discussion/Conclusion</strong></td><td>… Results – Discussion/<strong>Conclusio</strong> ← cut off</td></tr>
<tr><td>Professional report sections</td><td>Opening – Identification of problem – Presentation of data – Processing of data – Closing</td><td>… Presentation of data <strong>–</strong> ← cut off, continues on the next line</td></tr>
</table>
<ul>
<li><strong>Read the full version, not this one.</strong> If you only ever saw slide 39, you could reasonably believe the fourth IMRD section is called "Conclusio" or that "Processing of data" is missing. It is not — slide 37 shows the whole line.</li>
<li><strong>Why a duplicate matters for exam prep.</strong> A repeated slide makes a point look more central than it is when you count slide frequency, and it also means the section 3.4b has two summaries and no content slide of its own.</li>
<li><strong>The ordering problem is now visible.</strong> The deck runs: 3.4a objectives (35) → essay summary (36) → report summary (37) → 3.4b objectives (38) → report summary again (39). The first report summary sits one slide too early.</li>
<li><strong>Applied at FPTU.</strong> When you build your own revision notes from a deck, deduplicate first and count sections from the complete print. Counting from a cropped slide is how people memorise four professional-report sections instead of five.</li>
</ul>
<p class="dap-an">✅ From the complete version: research report = <strong>Introduction – Methodology – Results – Discussion/Conclusion</strong> (4). Professional report = <strong>Opening – Identification of problem – Presentation of data – Processing of data – Closing</strong> (5). Movements: <strong>General–Specific–General</strong> and <strong>General–Specific</strong>.</p>
<p class="pitfall">⚠️ Do not treat slides 37 and 39 as two different pieces of content in your notes. They are one. The extra frame is a production artefact of the review deck, not a second idea.</p>`,
        `<p class="y-chinh">🎯 <strong>Đúng slide 37, in lần thứ hai</strong> — cùng tiêu đề, cùng hai hình dạng báo cáo, cùng trích dẫn (Brick, Herke &amp; Wong, 2016; Nesi &amp; Gardner, 2012). Khác biệt duy nhất là vật lý: bản in này bị phóng to nên đuôi phải của hai dòng chạy tràn ra khỏi khung.</p>
<table>
<tr><th>Dòng</th><th>Slide 37 (đầy đủ)</th><th>Slide 39 (bị cắt)</th></tr>
<tr><td>Mục của báo cáo nghiên cứu</td><td>Introduction – Methodology – Results – <strong>Discussion/Conclusion</strong></td><td>… Results – Discussion/<strong>Conclusio</strong> ← cụt</td></tr>
<tr><td>Mục của báo cáo nghề nghiệp</td><td>Opening – Identification of problem – Presentation of data – Processing of data – Closing</td><td>… Presentation of data <strong>–</strong> ← cụt, phần còn lại rớt xuống dòng dưới</td></tr>
</table>
<ul>
<li><strong>Hãy đọc bản đầy đủ, đừng đọc bản này.</strong> Nếu bạn chỉ từng thấy slide 39, bạn hoàn toàn có thể tin rằng mục thứ tư của IMRD tên là "Conclusio", hoặc rằng "Processing of data" không tồn tại. Không phải vậy — slide 37 in trọn cả dòng.</li>
<li><strong>Vì sao một slide bị lặp lại quan trọng với việc ôn thi.</strong> Slide lặp làm một ý trông có vẻ trọng tâm hơn thực tế khi bạn đếm tần suất, và nó cũng khiến mục 3.4b có tới hai slide tóm tắt mà không có slide nội dung nào của riêng mình.</li>
<li><strong>Bây giờ vấn đề thứ tự hiện rõ.</strong> Deck chạy: mục tiêu 3.4a (35) → tóm tắt bài luận (36) → tóm tắt báo cáo (37) → mục tiêu 3.4b (38) → lại tóm tắt báo cáo (39). Cái tóm tắt báo cáo đầu tiên nằm sớm hơn chỗ của nó đúng một slide.</li>
<li><strong>Áp dụng ở FPTU.</strong> Khi bạn tự dựng vở ôn từ một bộ slide, hãy KHỬ TRÙNG LẶP trước, và đếm số mục từ bản in đầy đủ. Đếm từ một slide bị cắt chính là cách người ta thuộc BỐN mục báo cáo nghề nghiệp thay vì năm.</li>
</ul>
<p class="dap-an">✅ Lấy từ bản đầy đủ: báo cáo nghiên cứu = <strong>Introduction – Methodology – Results – Discussion/Conclusion</strong> (4 mục). Báo cáo nghề nghiệp = <strong>Opening – Identification of problem – Presentation of data – Processing of data – Closing</strong> (5 mục). Chuyển động: <strong>Chung–Cụ thể–Chung</strong> và <strong>Chung–Cụ thể</strong>.</p>
<p class="pitfall">⚠️ Đừng ghi slide 37 và 39 thành hai mẩu nội dung khác nhau trong vở. Chúng là MỘT. Cái khung thừa là lỗi dựng của deck ôn tập, không phải một ý thứ hai.</p>`],

      [40, '4.2a Drafting Essays (learning outcomes)',
        `<p class="y-chinh">🎯 The drafting section opens with <strong>FOUR outcomes</strong> — the objectives slides have grown from two to three to four: <strong>understand and use techniques for early drafting of essays</strong> · <strong>appropriately use academic language to compose different types of written assignments</strong> · <strong>synthesise researched sources and evidence with arguments</strong> · <strong>arrange early drafts into a complete first essay draft</strong>.</p>
<table>
<tr><th>Outcome</th><th>The skill underneath</th><th>What goes wrong without it</th></tr>
<tr><td><strong>Techniques for early drafting</strong></td><td>Getting words down before they are good</td><td>Staring at a blank page because sentence 1 must be perfect</td></tr>
<tr><td><strong>Appropriate academic language</strong></td><td>Register: hedging, precision, no slang, cautious claims</td><td>"Scrum is obviously the best" — a claim no evidence can carry</td></tr>
<tr><td><strong>Synthesise sources WITH arguments</strong></td><td>Weaving citation into your own sentence, not stacking quotes</td><td>Paragraphs that are 80% other people, with your voice only in the linking words</td></tr>
<tr><td><strong>Arrange early drafts into a complete first draft</strong></td><td>Assembly — the pieces were written out of order</td><td>A folder of fragments that never becomes a document</td></tr>
</table>
<ul>
<li><strong>"Early drafts" is plural on purpose.</strong> The model here is: write several partial drafts of different sections, then arrange them. That is why the last bullet exists as a separate skill.</li>
<li><strong>Synthesise means blend, not collect.</strong> The test: can a reader tell what YOUR claim is in each paragraph without reading the citations? If not, you have summarised rather than synthesised.</li>
<li><strong>Numbering note: this is 4.2a.</strong> There is no 4.1 slide in this range, and no 4.2b — the next objectives slide is 4.2c.</li>
<li><strong>Applied at FPTU.</strong> Start the SWP391 report from the section you know best (usually what you built), not from the introduction. The introduction is easiest to write LAST, when you know what it is introducing.</li>
</ul>
<p class="meo">💡 Objectives-count ladder in this range: slide 22 = <strong>2</strong>; slides 25, 29, 31, 33, 35, 38 = <strong>3</strong>; slides 40 and 42 = <strong>4</strong>.</p>
<p class="pitfall">⚠️ Slide 42 (4.2c Coherence &amp; Cohesion) reuses these four bullets almost exactly — it drops "understand and" from the first and shortens "first essay draft" to "first draft". So the coherence-and-cohesion section's objectives never mention coherence or cohesion at all. Learn that section from its summary (slide 43), not from its objectives.</p>`,
        `<p class="y-chinh">🎯 Mục viết nháp mở đầu bằng <strong>BỐN mục tiêu</strong> — các slide mục tiêu đã tăng dần từ hai lên ba lên bốn: <strong>hiểu và dùng các kỹ thuật viết nháp SỚM cho bài luận</strong> · <strong>dùng NGÔN NGỮ HỌC THUẬT một cách phù hợp để soạn các loại bài viết khác nhau</strong> · <strong>TỔNG HỢP nguồn đã nghiên cứu và bằng chứng VÀO lập luận</strong> · <strong>sắp xếp các bản nháp sớm thành một bản nháp đầu tiên HOÀN CHỈNH</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Kỹ năng nằm dưới</th><th>Không có nó thì hỏng gì</th></tr>
<tr><td><strong>Kỹ thuật viết nháp sớm</strong></td><td>Đưa chữ xuống giấy TRƯỚC khi nó hay</td><td>Ngồi nhìn trang trắng vì câu số 1 bắt buộc phải hoàn hảo</td></tr>
<tr><td><strong>Ngôn ngữ học thuật phù hợp</strong></td><td>Ngữ vực: rào đón, chính xác, không tiếng lóng, khẳng định thận trọng</td><td>"Scrum rõ ràng là tốt nhất" — một khẳng định không bằng chứng nào gánh nổi</td></tr>
<tr><td><strong>Tổng hợp nguồn VÀO lập luận</strong></td><td>Dệt trích dẫn vào câu của mình, không xếp chồng trích dẫn</td><td>Đoạn văn 80% là người khác, giọng bạn chỉ còn ở mấy từ nối</td></tr>
<tr><td><strong>Ghép nháp sớm thành bản nháp hoàn chỉnh</strong></td><td>LẮP RÁP — vì các mảnh được viết không theo thứ tự</td><td>Một thư mục đầy mảnh vụn mà chẳng bao giờ thành tài liệu</td></tr>
</table>
<ul>
<li><strong>"Early drafts" ở số NHIỀU là cố ý.</strong> Mô hình ở đây là: viết vài bản nháp một phần cho các mục khác nhau, rồi mới sắp xếp lại. Chính vì thế gạch cuối tồn tại như một kỹ năng riêng.</li>
<li><strong>Tổng hợp nghĩa là HOÀ, không phải GOM.</strong> Phép kiểm: người đọc có nhận ra KHẲNG ĐỊNH CỦA BẠN trong từng đoạn mà không cần đọc phần trích dẫn không? Không nhận ra thì bạn mới tóm tắt chứ chưa tổng hợp.</li>
<li><strong>Ghi chú đánh số: đây là 4.2a.</strong> Trong dải này không có slide 4.1 nào, cũng không có 4.2b — slide mục tiêu kế tiếp đã là 4.2c.</li>
<li><strong>Áp dụng ở FPTU.</strong> Hãy bắt đầu báo cáo SWP391 từ mục bạn nắm chắc nhất (thường là thứ nhóm đã dựng), đừng bắt đầu từ mở đầu. Phần mở đầu dễ viết nhất khi viết SAU CÙNG, lúc bạn đã biết mình đang mở đầu cho cái gì.</li>
</ul>
<p class="meo">💡 Thang đếm mục tiêu trong dải này: slide 22 = <strong>2</strong>; slide 25, 29, 31, 33, 35, 38 = <strong>3</strong>; slide 40 và 42 = <strong>4</strong>.</p>
<p class="pitfall">⚠️ Slide 42 (4.2c Coherence &amp; Cohesion) dùng lại gần như nguyên bốn gạch này — chỉ bỏ "understand and" ở dòng đầu và rút "first essay draft" thành "first draft". Nghĩa là mục Mạch lạc &amp; Liên kết có bộ mục tiêu KHÔNG hề nhắc tới mạch lạc hay liên kết. Hãy học mục đó từ slide tóm tắt (slide 43), đừng học từ slide mục tiêu.</p>`],

      [41, 'Summary: Drafting Essays',
        `<p class="y-chinh">🎯 The drafting summary, with the numbers and the metaphor you must keep: <strong>start where you feel the most comfortable</strong> · <strong>edit for language, style &amp; length</strong> — <strong>Introduction:</strong> no more than <strong>10%</strong>; <strong>a map, a microcosm &amp; a marketing tool (Sowton, 2012)</strong> · <strong>Body:</strong> a series of <strong>linked</strong> paragraphs that convey main arguments; <strong>integrated</strong> references · <strong>Conclusion:</strong> the last thing your audience reads; state how your arguments lead to your conclusion: <strong>answer</strong>. Citation: <strong>(Alexander et al., 2008; Brick et al., 2016; Cottrell, 2013; Greetham, 2013; Reinders et al., 2013; Sowton, 2012; Smith 2002)</strong>.</p>
<table>
<tr><th>The introduction is…</th><th>Meaning</th><th>One sentence that does it</th></tr>
<tr><td><strong>A map</strong></td><td>It tells the reader the route the essay will take</td><td>"This essay examines training, ceremony decay and product-owner authority in turn."</td></tr>
<tr><td><strong>A microcosm</strong></td><td>It is the whole essay in miniature — the argument already visible</td><td>"It argues that the product-owner constraint is the binding one."</td></tr>
<tr><td><strong>A marketing tool</strong></td><td>It must make the reader want to continue</td><td>"Most Scrum failures in small firms are blamed on discipline; the evidence points elsewhere."</td></tr>
</table>
<ul>
<li><strong>"No more than 10%" is a hard number to memorise.</strong> 1500 words → 150-word introduction, maximum. Longer introductions are the most common way students run out of room for the argument itself.</li>
<li><strong>"Start where you feel the most comfortable" is permission, not sloppiness.</strong> It directly serves the "early drafts, then arrange" model of slide 40 — you are allowed to write body paragraph 2 first.</li>
<li><strong>"Linked" and "integrated" are the two coherence words hiding in this slide</strong> — they anticipate section 4.2c exactly. Linked paragraphs = cohesion between paragraphs; integrated references = the citation lives inside your sentence, not bolted on after it.</li>
<li><strong>The conclusion must ANSWER.</strong> The slide ends with that single word after a colon. A conclusion that only summarises what was said is incomplete: it must state how the arguments lead to the answer.</li>
</ul>
<p class="dap-an">✅ Paragraph frame to use in the body — <strong>PEEL</strong>: <em>Point</em> (topic sentence stating the claim) · <em>Evidence</em> (the cited source or data) · <em>Explain</em> (why that evidence supports the claim) · <em>Link</em> (back to the position, or forward to the next paragraph). Worked example: <em>"The most binding constraint on Scrum in small firms is the availability of the product owner.</em> (Point) <em>In Nesi and Gardner's survey of small development teams, backlog reprioritisation happened less than monthly in a majority of cases.</em> (Evidence) <em>Because sprint planning depends on a currently ordered backlog, an absent owner does not merely slow one ceremony — it removes the input every other ceremony consumes.</em> (Explain) <em>Training and ceremony discipline, discussed above, therefore cannot compensate for it.</em> (Link)</p>
<p class="pitfall">⚠️ Two deck bugs on this one slide: the citation list prints <strong>"Smith 2002"</strong> with no comma before the year (and slide 27 says Smith, <strong>2003</strong>), and it prints <strong>Greetham, 2013 / Reinders et al., 2013</strong> where slide 36 printed <strong>2012</strong> for both. Learn the ideas; do not bet an answer on a year.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt khâu viết nháp, kèm con số và phép ẩn dụ bắt buộc phải nhớ: <strong>bắt đầu ở chỗ bạn thấy thoải mái nhất</strong> · <strong>biên tập về ngôn ngữ, văn phong &amp; độ dài</strong> — <strong>Mở bài:</strong> không quá <strong>10%</strong>; là <strong>một TẤM BẢN ĐỒ, một VŨ TRỤ THU NHỎ &amp; một CÔNG CỤ TIẾP THỊ (Sowton, 2012)</strong> · <strong>Thân bài:</strong> một chuỗi đoạn văn được <strong>LIÊN KẾT</strong> chuyển tải các lập luận chính; trích dẫn được <strong>TÍCH HỢP</strong> · <strong>Kết luận:</strong> là thứ CUỐI CÙNG người đọc đọc; nêu rõ các lập luận dẫn tới kết luận ra sao: <strong>TRẢ LỜI</strong>. Trích dẫn: <strong>(Alexander et al., 2008; Brick et al., 2016; Cottrell, 2013; Greetham, 2013; Reinders et al., 2013; Sowton, 2012; Smith 2002)</strong>.</p>
<table>
<tr><th>Mở bài là…</th><th>Nghĩa là gì</th><th>Một câu làm đúng việc đó</th></tr>
<tr><td><strong>Một tấm bản đồ</strong></td><td>Nó báo cho người đọc lộ trình bài viết sẽ đi</td><td>"Bài này lần lượt xem xét đào tạo, sự rữa của nghi thức, và thực quyền của product owner."</td></tr>
<tr><td><strong>Một vũ trụ thu nhỏ</strong></td><td>Nó là cả bài luận ở dạng tí hon — lập luận đã nhìn thấy được</td><td>"Bài lập luận rằng ràng buộc chốt chặn nằm ở product owner."</td></tr>
<tr><td><strong>Một công cụ tiếp thị</strong></td><td>Nó phải làm người đọc MUỐN đọc tiếp</td><td>"Phần lớn thất bại của Scrum ở công ty nhỏ bị đổ cho tính kỷ luật; bằng chứng lại chỉ sang chỗ khác."</td></tr>
</table>
<ul>
<li><strong>"Không quá 10%" là con số cứng phải thuộc.</strong> 1500 từ → mở bài TỐI ĐA 150 từ. Mở bài dài là cách phổ biến nhất khiến sinh viên hết chỗ cho chính phần lập luận.</li>
<li><strong>"Bắt đầu ở chỗ thoải mái nhất" là một sự CHO PHÉP, không phải luộm thuộm.</strong> Nó phục vụ thẳng mô hình "nháp từng mảnh rồi sắp xếp" của slide 40 — bạn được quyền viết đoạn thân số 2 trước tiên.</li>
<li><strong>"Linked" và "integrated" là hai chữ về liên kết đang nấp trong slide này</strong> — chúng báo trước đúng mục 4.2c. Đoạn văn được liên kết = cohesion giữa các đoạn; trích dẫn được tích hợp = trích dẫn nằm BÊN TRONG câu của bạn chứ không bị bắt vít vào sau.</li>
<li><strong>Kết luận phải TRẢ LỜI.</strong> Slide kết thúc bằng đúng chữ đó sau dấu hai chấm. Một kết luận chỉ tóm lại những gì đã nói là chưa xong việc: nó phải nêu các lập luận dẫn tới câu trả lời như thế nào.</li>
</ul>
<p class="dap-an">✅ Khung đoạn văn dùng cho thân bài — <strong>PEEL</strong>: <em>Point</em> (câu chủ đề nêu khẳng định) · <em>Evidence</em> (nguồn hoặc dữ liệu có trích) · <em>Explain</em> (vì sao bằng chứng đó đỡ được khẳng định) · <em>Link</em> (nối về lập trường, hoặc nối tới đoạn sau). Đoạn mẫu: <em>"Ràng buộc chốt chặn nhất của Scrum ở công ty nhỏ là mức độ sẵn có của product owner.</em> (Point) <em>Trong khảo sát của Nesi và Gardner trên các đội phát triển nhỏ, việc sắp lại thứ tự ưu tiên backlog diễn ra thưa hơn một tháng một lần ở đa số trường hợp.</em> (Evidence) <em>Vì sprint planning phụ thuộc vào một backlog đang được sắp thứ tự, một product owner vắng mặt không chỉ làm chậm một nghi thức — nó rút mất chính cái đầu vào mà mọi nghi thức khác tiêu thụ.</em> (Explain) <em>Do đó đào tạo và kỷ luật nghi thức, đã bàn ở trên, không thể bù đắp cho nó.</em> (Link)</p>
<p class="pitfall">⚠️ Hai lỗi của deck trên cùng một slide: danh sách trích dẫn in <strong>"Smith 2002"</strong> không có dấu phẩy trước năm (mà slide 27 lại ghi Smith, <strong>2003</strong>), và in <strong>Greetham, 2013 / Reinders et al., 2013</strong> trong khi slide 36 in <strong>2012</strong> cho cả hai. Hãy học Ý; đừng đặt cược một câu trả lời vào cái năm.</p>`],

      [42, '4.2c Coherence & Cohesion for Essays and Reports (learning outcomes)',
        `<p class="y-chinh">🎯 The objectives slide for the coherence-and-cohesion section — and its <strong>four bullets are lifted from slide 40</strong>: <strong>use techniques for early drafting of essays</strong> · <strong>appropriately use academic language to compose different types of written assignments</strong> · <strong>synthesise researched sources and evidence with arguments</strong> · <strong>arrange early drafts into a complete first draft</strong>. Not one of them contains the words <em>coherence</em> or <em>cohesion</em>.</p>
<table>
<tr><th>Bullet</th><th>Slide 40 (4.2a Drafting Essays)</th><th>Slide 42 (4.2c Coherence &amp; Cohesion)</th></tr>
<tr><td>1</td><td><strong>understand and</strong> use techniques for early drafting of essays</td><td>use techniques for early drafting of essays</td></tr>
<tr><td>2</td><td colspan="2">identical: appropriately use academic language to compose different types of written assignments</td></tr>
<tr><td>3</td><td colspan="2">identical: synthesise researched sources and evidence with arguments</td></tr>
<tr><td>4</td><td>arrange early drafts into a complete first <strong>essay</strong> draft</td><td>arrange early drafts into a complete first draft</td></tr>
</table>
<ul>
<li><strong>Two words deleted, one word deleted — that is the entire edit.</strong> "understand and" gone from bullet 1, "essay" gone from bullet 4. Everything else is a straight copy.</li>
<li><strong>Dropping "essay" from bullet 4 is the one meaningful change,</strong> and it fits the title: this section covers essays AND reports, so the draft being assembled is no longer necessarily an essay.</li>
<li><strong>The mismatch between title and objectives is the thing to notice.</strong> The title promises coherence and cohesion; the objectives describe drafting. The actual teaching content of the section lives entirely in the summary, slide 43.</li>
<li><strong>Applied at FPTU.</strong> Do not judge what a section teaches from its objectives slide in this deck. Read the summary slide first, then work backwards.</li>
</ul>
<p class="pitfall">⚠️ Numbering jumps again: <strong>4.2a → 4.2c</strong>. There is no 4.2b slide in this range. Do not assume the deck is complete, and do not assume "4.2c" means you missed something in your own notes.</p>
<p class="meo">💡 Tally of reused bullet blocks in slides 22–43: <strong>25↔29</strong> (2 of 3 identical) · <strong>31↔33</strong> (1 of 3 identical, 2 reworded) · <strong>35↔38</strong> (3 of 3 identical) · <strong>40↔42</strong> (2 of 4 identical, 2 trimmed). Four pairs — this is a structural feature of the deck, not an accident.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của mục Mạch lạc &amp; Liên kết — và <strong>bốn gạch đầu dòng của nó được bê từ slide 40 sang</strong>: <strong>dùng các kỹ thuật viết nháp sớm cho bài luận</strong> · <strong>dùng ngôn ngữ học thuật phù hợp để soạn các loại bài viết khác nhau</strong> · <strong>tổng hợp nguồn đã nghiên cứu và bằng chứng vào lập luận</strong> · <strong>sắp xếp các bản nháp sớm thành một bản nháp đầu hoàn chỉnh</strong>. Không một dòng nào chứa chữ <em>coherence</em> hay <em>cohesion</em>.</p>
<table>
<tr><th>Gạch</th><th>Slide 40 (4.2a Drafting Essays)</th><th>Slide 42 (4.2c Coherence &amp; Cohesion)</th></tr>
<tr><td>1</td><td><strong>understand and</strong> use techniques for early drafting of essays</td><td>use techniques for early drafting of essays</td></tr>
<tr><td>2</td><td colspan="2">GIỐNG HỆT: appropriately use academic language to compose different types of written assignments</td></tr>
<tr><td>3</td><td colspan="2">GIỐNG HỆT: synthesise researched sources and evidence with arguments</td></tr>
<tr><td>4</td><td>arrange early drafts into a complete first <strong>essay</strong> draft</td><td>arrange early drafts into a complete first draft</td></tr>
</table>
<ul>
<li><strong>Xoá hai chữ, xoá một chữ — đó là toàn bộ phần biên tập.</strong> Bỏ "understand and" ở gạch 1, bỏ "essay" ở gạch 4. Còn lại là chép thẳng.</li>
<li><strong>Việc bỏ chữ "essay" ở gạch 4 là thay đổi có ý nghĩa duy nhất,</strong> và nó khớp với tiêu đề: mục này phủ cả bài luận LẪN báo cáo, nên bản nháp đang được ráp lại không còn nhất thiết là bài luận nữa.</li>
<li><strong>Chỗ đáng để ý là sự LỆCH giữa tiêu đề và mục tiêu.</strong> Tiêu đề hứa mạch lạc và liên kết; mục tiêu lại mô tả việc viết nháp. Nội dung dạy thật của mục nằm trọn trong slide tóm tắt, tức slide 43.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với deck này, đừng đánh giá một mục dạy gì qua slide mục tiêu của nó. Hãy đọc slide TÓM TẮT trước, rồi lần ngược lại.</li>
</ul>
<p class="pitfall">⚠️ Đánh số lại nhảy: <strong>4.2a → 4.2c</strong>. Không có slide 4.2b nào trong dải này. Đừng cho rằng deck là đầy đủ, và cũng đừng tưởng "4.2c" nghĩa là vở của bạn bị thiếu bài.</p>
<p class="meo">💡 Kiểm kê các khối bullet bị dùng lại trong slide 22–43: <strong>25↔29</strong> (2/3 giống hệt) · <strong>31↔33</strong> (1/3 giống hệt, 2 dòng đổi chữ) · <strong>35↔38</strong> (3/3 giống hệt) · <strong>40↔42</strong> (2/4 giống hệt, 2 dòng bị cắt chữ). Bốn cặp — đây là ĐẶC TÍNH cấu trúc của deck, không phải tai nạn.</p>`],

      [43, 'Summary: Coherence and cohesion in essays and reports',
        `<p class="y-chinh">🎯 The definition slide of the whole section, and the cleanest pair of definitions in Mooc 4. <strong>Coherence: does your writing make SENSE?</strong> → <strong>does it answer the question?</strong> · <strong>is the language easy to follow?</strong> · <strong>does your text have a logical order?</strong> (three questions). <strong>Cohesion: does your writing work TOGETHER?</strong> → <strong>word chains</strong> · <strong>pronouns referring forwards and backwards</strong> · <strong>Theme-New structure</strong> · <strong>phrases for conjunction</strong> (four devices). Citation: <strong>(Halliday &amp; Hasan, 1976; Oshima &amp; Hogue, 1991; Sowton, 2012)</strong>.</p>
<table>
<tr><th></th><th>Coherence</th><th>Cohesion</th></tr>
<tr><td><strong>The slide's question</strong></td><td>Does your writing make <strong>sense</strong>?</td><td>Does your writing work <strong>together</strong>?</td></tr>
<tr><td><strong>Level it operates at</strong></td><td>The whole text — logic, order, relevance</td><td>Between sentences — the words that stitch them</td></tr>
<tr><td><strong>Number of sub-items</strong></td><td><strong>3</strong> questions</td><td><strong>4</strong> devices</td></tr>
<tr><td><strong>You lose it by</strong></td><td>Answering a different question, or jumping between ideas</td><td>Writing correct sentences that sit side by side with nothing linking them</td></tr>
<tr><td><strong>The four cohesion devices</strong></td><td colspan="2"><strong>Word chains</strong> (repeat the key term and its synonyms) · <strong>pronouns referring forwards and backwards</strong> (this, these, it — pointing to something identifiable) · <strong>Theme-New structure</strong> (start a sentence with old information, end it with the new) · <strong>phrases for conjunction</strong> (however, therefore, in contrast, as a result)</td></tr>
</table>
<ul>
<li><strong>A text can be cohesive and still incoherent.</strong> Stuffing "however" and "therefore" between unrelated sentences creates cohesion with no coherence — it is the classic symptom of an essay assembled from notes.</li>
<li><strong>Theme-New is the subtlest device and the most powerful.</strong> Each sentence should open with something the reader already has and close with what is new; the new end of one sentence becomes the familiar opening of the next. That chain is what makes a paragraph feel like it flows.</li>
<li><strong>"Pronouns referring forwards and backwards" warns about a real failure.</strong> A "this" with no identifiable referent is the single most common cohesion bug in student writing — write "this constraint", not a bare "this".</li>
<li><strong>Applied at FPTU.</strong> Proofread twice with different eyes: once for coherence (does every section answer the brief, in a sensible order?) and once for cohesion (read only the first and last sentence of each paragraph — do they hand off to each other?).</li>
</ul>
<p class="dap-an">✅ Weak paragraph → fixed. <strong>Weak:</strong> <em>"Scrum has many ceremonies. Small companies in Vietnam often have few staff. The product owner role is important. Backlogs need prioritising. Teams fail."</em> Five correct sentences, no links, no claim. <strong>Fixed:</strong> <em>"Scrum's ceremonies all assume one thing: a backlog that has already been prioritised.</em> [Point, and <em>backlog</em> is planted as a key term] <em>In small Vietnamese companies, however, that prioritisation depends on a product owner who is usually also doing another job.</em> [<em>however</em> = phrase for conjunction; <em>that prioritisation</em> = pronoun referring backwards; <em>prioritisation</em> = word chain] <em>Because this owner is part-time, the backlog is reordered rarely, and sprint planning therefore begins from a stale list.</em> [<em>this owner</em> = pronoun with a noun attached; <em>therefore</em> = conjunction; the new information at the end of sentence 2 — the part-time owner — opens sentence 3, which is <strong>Theme-New</strong>] <em>The result is not a discipline problem but a structural one.</em> [links back to the position]. Added: 1 word chain, 2 anchored pronouns, 2 conjunction phrases, 1 Theme-New hand-off — all four devices.</p>
<p class="pitfall">⚠️ Exam trap: <strong>coherence = 3 items, cohesion = 4 items.</strong> A distractor will swap the two definitions ("cohesion is whether your writing makes sense") or move "does it answer the question?" into the cohesion list. Memory hook: <strong>cOherence = Overall logic · cOhesion = cOnnectors</strong>; the longer list belongs to the smaller-scale idea.</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa của cả mục, và là cặp định nghĩa sạch nhất của Mooc 4. <strong>COHERENCE (mạch lạc): bài viết của bạn có CÓ NGHĨA không?</strong> → <strong>nó có trả lời đúng câu hỏi không?</strong> · <strong>ngôn ngữ có dễ theo dõi không?</strong> · <strong>văn bản có TRẬT TỰ LÔ-GIC không?</strong> (ba câu hỏi). <strong>COHESION (liên kết): các phần có ĂN KHỚP với nhau không?</strong> → <strong>chuỗi từ (word chains)</strong> · <strong>đại từ trỏ TỚI và trỏ LÙI</strong> · <strong>cấu trúc Theme-New (cũ trước – mới sau)</strong> · <strong>các cụm từ nối</strong> (bốn công cụ). Trích dẫn: <strong>(Halliday &amp; Hasan, 1976; Oshima &amp; Hogue, 1991; Sowton, 2012)</strong>.</p>
<table>
<tr><th></th><th>Coherence — Mạch lạc</th><th>Cohesion — Liên kết</th></tr>
<tr><td><strong>Câu hỏi trên slide</strong></td><td>Bài viết có <strong>CÓ NGHĨA</strong> không?</td><td>Các phần có <strong>ĂN KHỚP</strong> không?</td></tr>
<tr><td><strong>Hoạt động ở tầng nào</strong></td><td>TOÀN văn bản — lô-gic, trật tự, đúng trọng tâm</td><td>GIỮA các câu — những chữ khâu chúng lại</td></tr>
<tr><td><strong>Số mục con</strong></td><td><strong>3</strong> câu hỏi</td><td><strong>4</strong> công cụ</td></tr>
<tr><td><strong>Mất nó khi nào</strong></td><td>Trả lời nhầm câu hỏi, hoặc nhảy cóc giữa các ý</td><td>Viết những câu đúng ngữ pháp nằm cạnh nhau mà chẳng có gì nối</td></tr>
<tr><td><strong>Bốn công cụ liên kết</strong></td><td colspan="2"><strong>Chuỗi từ</strong> (lặp lại từ khoá và các từ đồng nghĩa của nó) · <strong>đại từ trỏ tới và trỏ lùi</strong> (this, these, it — phải trỏ vào thứ nhận diện được) · <strong>cấu trúc Theme-New</strong> (mở câu bằng thông tin CŨ, kết câu bằng thông tin MỚI) · <strong>cụm từ nối</strong> (however, therefore, in contrast, as a result)</td></tr>
</table>
<ul>
<li><strong>Một văn bản có thể LIÊN KẾT mà vẫn KHÔNG MẠCH LẠC.</strong> Nhét "however" với "therefore" vào giữa những câu chẳng liên quan thì tạo ra cohesion mà không có coherence — đó là triệu chứng kinh điển của bài luận ráp từ ghi chú rời.</li>
<li><strong>Theme-New là công cụ tinh vi nhất và mạnh nhất.</strong> Mỗi câu nên mở bằng thứ người đọc ĐÃ CÓ và đóng bằng thứ MỚI; cái đuôi mới của câu này trở thành cái đầu quen thuộc của câu sau. Chính chuỗi đó làm một đoạn văn có cảm giác TRÔI.</li>
<li><strong>"Đại từ trỏ tới và trỏ lùi" cảnh báo một lỗi có thật.</strong> Một chữ "this" không trỏ vào thứ gì nhận diện được là lỗi liên kết phổ biến nhất trong bài sinh viên — hãy viết "ràng buộc này", đừng viết trơ một chữ "này".</li>
<li><strong>Áp dụng ở FPTU.</strong> Soát bài HAI lượt bằng hai con mắt khác nhau: một lượt cho mạch lạc (mọi mục có trả lời đúng yêu cầu, theo một trật tự hợp lý không?) và một lượt cho liên kết (chỉ đọc câu đầu và câu cuối của từng đoạn — chúng có bàn giao cho nhau không?).</li>
</ul>
<p class="dap-an">✅ Đoạn văn YẾU → bản SỬA. <strong>Yếu:</strong> <em>"Scrum có nhiều nghi thức. Công ty nhỏ ở Việt Nam thường ít người. Vai trò product owner rất quan trọng. Backlog cần được ưu tiên. Các đội thất bại."</em> Năm câu đều đúng, không có mối nối nào, không có khẳng định nào. <strong>Bản sửa:</strong> <em>"Mọi nghi thức của Scrum đều giả định một điều: một backlog ĐÃ được sắp thứ tự ưu tiên.</em> [Point, và chữ <em>backlog</em> được cắm xuống làm từ khoá] <em>Ở các công ty nhỏ tại Việt Nam, TUY NHIÊN, việc sắp thứ tự ấy lại phụ thuộc vào một product owner thường kiêm luôn một công việc khác.</em> [<em>tuy nhiên</em> = cụm từ nối; <em>việc sắp thứ tự ấy</em> = đại từ trỏ LÙI; <em>sắp thứ tự ưu tiên</em> = chuỗi từ] <em>Vì product owner NÀY làm kiêm nhiệm, backlog hiếm khi được sắp lại, và do đó sprint planning bắt đầu từ một danh sách đã cũ.</em> [<em>product owner này</em> = đại từ có danh từ đi kèm; <em>do đó</em> = từ nối; thông tin mới ở cuối câu 2 — người kiêm nhiệm — mở đầu câu 3, đó chính là <strong>Theme-New</strong>] <em>Kết quả là một vấn đề cấu trúc, không phải vấn đề kỷ luật.</em> [nối ngược về lập trường]. Đã thêm: 1 chuỗi từ, 2 đại từ có neo, 2 cụm từ nối, 1 lần bàn giao Theme-New — đủ cả bốn công cụ.</p>
<p class="pitfall">⚠️ Bẫy đề thi: <strong>coherence = 3 mục, cohesion = 4 mục.</strong> Đáp án nhiễu sẽ tráo hai định nghĩa cho nhau ("cohesion là bài viết có có nghĩa hay không") hoặc đẩy "nó có trả lời đúng câu hỏi không?" sang danh sách cohesion. Mẹo nhớ: <strong>cOherence = Overall, lô-gic TỔNG THỂ · cOhesion = cOnnectors, các mối NỐI</strong>; danh sách DÀI hơn thuộc về khái niệm ở tầng NHỎ hơn.</p>`],

    ]),
  ].join('\n'),
};
