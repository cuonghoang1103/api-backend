/**
 * SSL101c · Mooc 4 (deck 'ssl4') — slide 1–21, học theo từng slide.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). File /tmp/ssl101c-text/ssl4.txt CHỈ có chữ ở slide 1–4; từ slide 5 trở đi
 * nó ghi "(không có chữ — slide ảnh/sơ đồ)". Toàn bộ 21 slide trong dải này đã
 * được ĐỌC THẲNG TỪ ẢNH (/tmp/ssl101c-slides/ssl4/001.webp … 021.webp).
 *
 * Nội dung THẬT của dải 1–21:
 *   1–4    Khung buổi ôn TRỰC TIẾP (bìa · 4 phần của Mooc 4 · câu hỏi "3
 *          take-aways" · Q&A) — template KHÁC, không có huy hiệu Sydney
 *   5–6    2.1a Introduction to Rhetorical Situations + Summary (Lunsford
 *          2013, tr. 48; SÁU yếu tố)
 *   7–12   2.1b Contexts of Communication at University: Lectures ·
 *          Tutorials/recitations · Seminars · Assessments + Summary
 *   13–14  2.1c University Course Outlines + Summary: Course Outlines (8 mục)
 *   15–19  2.3a Participating in Lectures, Seminars & Tutorials: Outline
 *          format · Cornell method · Note-taking in lectures + Summary
 *   20–21  2.3b Participating in Online Forums + "Purpose" (Q&A forums)
 *
 * ⚠️ NHỮNG CHỖ LỆCH CÓ THẬT TRÊN SLIDE (giữ nguyên, chỉ nêu trong bài):
 *   · slide 5 (2.1a) và slide 13 (2.1c) in BA MỤC TIÊU Y HỆT NHAU, từng chữ.
 *   · slide 15 (2.3a) và slide 20 (2.3b) in HAI MỤC TIÊU Y HỆT NHAU, chỉ khác
 *     "and" ↔ "&".
 *   · slide 6 liệt kê SÁU yếu tố của tình huống tu từ, nhưng slide 8–11 chỉ
 *     dùng NĂM (rụng "Social and political influences").
 *   · tiêu đề mục 2.3a nói "Lectures, Seminars, & Tutorials" còn hai mục tiêu
 *     ngay dưới lại nói "lectures, tutorials, and online discussion forums" —
 *     seminar biến mất khỏi mục tiêu, forum biến mất khỏi tiêu đề.
 *   · slide tóm tắt 19 BỎ RƠI toàn bộ phần ghi chép (Outline format, Cornell,
 *     Note-taking in lectures) đã dạy ở slide 16–18.
 *   · KHÔNG có mục 2.2 nào trong dải này: deck nhảy thẳng 2.1c → 2.3a.
 *   · slide 21 "Purpose" chỉ có MỘT loại forum (Question & answer forums); vế
 *     đối (discussion forums) không xuất hiện — slide 22 đã là 2.4a Group Work.
 *   · slide 16 in "i.Sub-point 1" DÍNH LIỀN, thiếu dấu cách sau "i.".
 *
 * ⚠️ HAI KIỂU CHÂN TRANG trong cùng một dải: phần lớn slide mang huy hiệu
 * Sydney, riêng slide 13 ("Page 1"), 14 và 21 (dòng chữ nhỏ "The University of
 * Sydney"), 20 (chân trang bị cắt cụt) thì không — dấu vết của hai lượt xuất
 * file khác nhau.
 *
 * Ba tình huống đối lập (email giảng viên · tin nhắn nhóm · bảo vệ đồ án),
 * bảng so tutorial ↔ seminar, ví dụ ghi chép Outline/Cornell đã điền thật, và
 * checklist đăng bài forum là PHẦN MỞ RỘNG do bài này dựng thêm cho FPTU,
 * KHÔNG in trên slide — đã nói rõ ngay tại chỗ.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl4';

export default {
  title: '4.0a — Slide by slide: Rhetorical situations, course outlines, lectures & online forums (slides 1–21)|||4.0a — Slide bài giảng: Tình huống tu từ, đề cương môn học, bài giảng & diễn đàn (slide 1–21)',
  slug: 'ssl101c-4-0a-slides-tinh-huong-tu-tu-de-cuong-mon-hoc-ghi-chep-dien-dan',
  type: 'DOCUMENT',
  description: 'Học theo từng slide 21 slide mở đầu của Mooc 4 (slide 1–21). Đi từ khung buổi ôn trực tiếp, qua khái niệm "tình huống tu từ" (rhetorical situation) với sáu yếu tố của Lunsford, rồi áp khung đó vào bốn bối cảnh giao tiếp ở đại học (lecture · tutorial · seminar · assessment), đọc đề cương môn học như một bản hợp đồng, và kết ở kỹ năng ghi chép (Outline format, Cornell) cùng cách tham gia diễn đàn hỏi–đáp. Nêu thẳng các chỗ deck lặp nguyên khối, đếm lệch số yếu tố và slide tóm tắt bỏ rơi nội dung.',
  content: [
    walkHead(D, 1, 21,
      'These 21 slides open Mooc 4. They install one framework — the rhetorical situation — and then run it across every place you have to speak or write at university.',
      'Đây là 21 slide mở màn Mooc 4. Chúng cài đặt MỘT khung duy nhất — tình huống tu từ — rồi đem khung đó chạy qua mọi nơi bạn phải nói hoặc viết ở đại học.'),
    walk(D, [

      [1, 'Communication Skills for University Success (cover)',
        `<p class="y-chinh">🎯 The cover of Mooc 4, the fourth of the five MOOCs you must complete before you are allowed to sit the SSL101c exam: <strong>Communication Skills for University Success</strong>.</p>
<ul>
<li><strong>This is a different template from the rest of the deck.</strong> Black Arial on flat red, centred, no accent bar, and — decisively — <em>no University of Sydney crest</em>. From slide 5 onwards the crest appears and the font changes. Slides 1–4 were added on top of the Sydney originals to frame a live review session; they are not part of the MOOC itself.</li>
<li><strong>Why that matters for revision.</strong> Anything that appears only on slides 1–4 is session furniture, not examinable content. The examinable material starts at slide 5 with "2.1a".</li>
<li><strong>The name of the module is the syllabus.</strong> Mooc 1 was learning, Mooc 2 problem solving, Mooc 3 information. Mooc 4 is <em>communication</em> — everything here is about getting an idea out of your head and into someone else's, in a form that person accepts.</li>
<li><strong>"University success" is not a slogan here.</strong> The whole module rests on one claim: the same idea, expressed in the wrong register for the wrong audience, scores badly. Communication is assessed, not assumed.</li>
<li><strong>Applied at FPTU.</strong> You already live this. The identical sentence "em chưa làm xong phần này" lands very differently in a Zalo group at 11pm, in an email to a lecturer, and in front of a defence panel. Mooc 4 gives you the vocabulary to explain <em>why</em>, and a procedure to choose the right version on purpose.</li>
</ul>
<p class="meo">💡 Fix the order once: Mooc 1 learning · Mooc 2 problem solving · Mooc 3 information · Mooc 4 <strong>communication</strong> · Mooc 5 the capstone. Exam questions that name a Mooc number expect you to know which skill sits in which slot.</p>
<p class="pitfall">⚠️ Do not read "Q&amp;A" on slide 4 as the end of the deck. It is slide 4 of 64 — the review-session frame sits in <em>front</em> of the content, not behind it.</p>`,
        `<p class="y-chinh">🎯 Bìa của Mooc 4, MOOC thứ tư trong năm MOOC bắt buộc phải xong trước khi được vào phòng thi SSL101c: <strong>Communication Skills for University Success</strong> — Kỹ năng giao tiếp để thành công ở đại học.</p>
<ul>
<li><strong>Đây là template KHÁC hẳn phần còn lại của deck.</strong> Chữ Arial đen đậm trên nền đỏ phẳng, căn giữa, không có thanh dọc trang trí, và quan trọng nhất — <em>không có huy hiệu University of Sydney</em>. Từ slide 5 trở đi huy hiệu xuất hiện và font đổi hẳn. Slide 1–4 là phần được CHÈN THÊM lên trên bộ gốc Sydney để dựng khung cho một buổi ôn trực tiếp; chúng không thuộc MOOC.</li>
<li><strong>Vì sao điều đó quan trọng khi ôn.</strong> Thứ gì chỉ xuất hiện ở slide 1–4 là "đồ đạc của buổi học", không phải nội dung thi. Nội dung thi bắt đầu từ slide 5 với mục "2.1a".</li>
<li><strong>Tên module chính là đề cương.</strong> Mooc 1 là học tập, Mooc 2 là giải quyết vấn đề, Mooc 3 là thông tin. Mooc 4 là <em>giao tiếp</em> — mọi thứ ở đây xoay quanh việc đưa một ý từ đầu bạn sang đầu người khác, dưới dạng mà người đó CHẤP NHẬN.</li>
<li><strong>"University success" ở đây không phải khẩu hiệu.</strong> Cả module dựa trên một khẳng định: cùng một ý, diễn đạt sai giọng cho sai đối tượng, thì bị điểm thấp. Giao tiếp là thứ ĐƯỢC CHẤM, không phải thứ mặc nhiên có.</li>
<li><strong>Áp dụng ở FPTU.</strong> Bạn đã sống với chuyện này rồi. Cùng một câu "em chưa làm xong phần này" rơi vào nhóm Zalo lúc 11 giờ đêm, rơi vào email gửi giảng viên, và rơi trước hội đồng bảo vệ — ba kết cục khác nhau hoàn toàn. Mooc 4 cho bạn từ vựng để giải thích VÌ SAO, và một quy trình để chọn đúng phiên bản một cách có chủ đích.</li>
</ul>
<p class="meo">💡 Chốt thứ tự một lần cho xong: Mooc 1 học tập · Mooc 2 giải quyết vấn đề · Mooc 3 thông tin · Mooc 4 <strong>giao tiếp</strong> · Mooc 5 tổng kết. Câu hỏi nào gọi tên số hiệu Mooc là đang kiểm tra bạn nhớ kỹ năng nào nằm ở ô nào.</p>
<p class="pitfall">⚠️ Đừng đọc chữ "Q&amp;A" ở slide 4 thành "hết deck". Đó là slide 4 trên tổng số 64 — khung buổi ôn nằm PHÍA TRƯỚC nội dung, không phải phía sau.</p>`],

      [2, 'Communication Skills for University Success — the four parts of Mooc 4',
        `<p class="y-chinh">🎯 The map of the entire module in <strong>four</strong> bullets, and the single most useful slide in the deck for orienting yourself: Participating · Interpreting/Researching/Planning · Writing · Presenting.</p>
<table>
<tr><th>#</th><th>The slide's exact wording</th><th>What that part actually teaches</th><th>Where it lives in the deck</th></tr>
<tr><td>1</td><td>Participating in University Discussion Contexts</td><td>Rhetorical situations; lectures, tutorials, seminars, forums, group work</td><td>slides 5–~30 (this lesson covers 5–21)</td></tr>
<tr><td>2</td><td>Interpreting, Researching &amp; Planning Written Assignments</td><td>Reading the question, finding sources, building an outline — <em>before</em> writing</td><td>the middle of the deck</td></tr>
<tr><td>3</td><td>Writing Effective &amp; Concise Written Assignments</td><td>Drafting, cohesion, editing, formatting, proofreading</td><td>after part 2</td></tr>
<tr><td>4</td><td>Giving Persuasive &amp; Engaging Presentations</td><td>Speaking to an audience: structure, delivery, visuals</td><td>the end of the deck</td></tr>
</table>
<ul>
<li><strong>The order is the workflow of one assignment.</strong> You discuss it, you plan it, you write it, you present it. That is not a coincidence — the module is built as a single pipeline, and each part hands off to the next.</li>
<li><strong>Parts 2 and 3 both say "Written Assignments" — and they are not the same part.</strong> Part 2 stops before you write a sentence; part 3 starts at the first sentence. Splitting planning from drafting is the deliberate teaching point, because students collapse them and start typing paragraph one with no plan.</li>
<li><strong>Only part 4 is spoken.</strong> Parts 1 and 4 are both oral, but part 1 is <em>dialogue</em> (you respond to others) and part 4 is <em>monologue</em> (you hold the floor). Different skills, different slides.</li>
<li><strong>Applied at FPTU.</strong> An SWP391 capstone runs exactly these four in order: weekly meetings with the supervisor (part 1) → reading the requirement and planning the report (part 2) → writing the report (part 3) → the defence in front of the panel (part 4). If one of the four is where you always lose marks, you now know which section of this deck to reread.</li>
</ul>
<p class="meo">💡 Count hook: <strong>4 parts</strong>, and only ONE of them (the second) has three verbs in its own title — "Interpreting, Researching &amp; Planning". If an exam option offers a fifth part such as "Managing your time", it is imported from Mooc 1, not Mooc 4.</p>
<p class="pitfall">⚠️ Do not swap parts 2 and 3. "Interpreting, Researching &amp; Planning" comes BEFORE "Writing". A question asking which comes first in the module is testing exactly this.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của cả module gói trong <strong>BỐN</strong> gạch đầu dòng, và là slide hữu ích nhất deck để định vị bản thân: Tham gia · Hiểu đề–tra cứu–lập kế hoạch · Viết · Thuyết trình.</p>
<table>
<tr><th>#</th><th>Nguyên văn trên slide</th><th>Phần đó thật sự dạy gì</th><th>Nằm ở đâu trong deck</th></tr>
<tr><td>1</td><td>Participating in University Discussion Contexts</td><td>Tình huống tu từ; lecture, tutorial, seminar, forum, làm việc nhóm</td><td>slide 5–~30 (bài này lo 5–21)</td></tr>
<tr><td>2</td><td>Interpreting, Researching &amp; Planning Written Assignments</td><td>Đọc hiểu đề, tìm nguồn, dựng dàn ý — <em>TRƯỚC KHI</em> viết</td><td>giữa deck</td></tr>
<tr><td>3</td><td>Writing Effective &amp; Concise Written Assignments</td><td>Viết nháp, mạch lạc, biên tập, định dạng, soát lỗi</td><td>sau phần 2</td></tr>
<tr><td>4</td><td>Giving Persuasive &amp; Engaging Presentations</td><td>Nói trước đám đông: bố cục, cách trình bày, hình ảnh</td><td>cuối deck</td></tr>
</table>
<ul>
<li><strong>Thứ tự này chính là quy trình làm MỘT bài tập.</strong> Bàn về nó, lên kế hoạch cho nó, viết nó, trình bày nó. Không phải ngẫu nhiên — module được dựng như một dây chuyền, phần trước giao việc cho phần sau.</li>
<li><strong>Phần 2 và phần 3 đều nói "Written Assignments" — và chúng KHÔNG phải một.</strong> Phần 2 dừng lại trước khi bạn viết câu đầu tiên; phần 3 bắt đầu từ đúng câu đó. Tách kế hoạch khỏi bản nháp là điểm dạy có chủ đích, vì sinh viên hay gộp hai thứ rồi gõ thẳng đoạn 1 mà không có dàn ý nào.</li>
<li><strong>Chỉ phần 4 là nói.</strong> Phần 1 và phần 4 đều bằng miệng, nhưng phần 1 là <em>đối thoại</em> (bạn đáp lại người khác), phần 4 là <em>độc thoại</em> (bạn giữ sân khấu). Kỹ năng khác nhau, slide khác nhau.</li>
<li><strong>Áp dụng ở FPTU.</strong> Một đồ án SWP391 chạy đúng bốn bước này theo đúng thứ tự: họp hằng tuần với giảng viên hướng dẫn (phần 1) → đọc yêu cầu và lập kế hoạch viết báo cáo (phần 2) → viết báo cáo (phần 3) → bảo vệ trước hội đồng (phần 4). Nếu có một trong bốn chỗ bạn luôn mất điểm, giờ bạn biết phải đọc lại đoạn nào của deck.</li>
</ul>
<p class="meo">💡 Mẹo đếm: <strong>4 phần</strong>, và chỉ DUY NHẤT một phần (phần hai) có ba động từ trong chính tiêu đề của nó — "Interpreting, Researching &amp; Planning". Đáp án nào thêm phần thứ năm kiểu "Quản lý thời gian" là nhập lậu từ Mooc 1, không phải Mooc 4.</p>
<p class="pitfall">⚠️ Đừng đảo phần 2 với phần 3. "Interpreting, Researching &amp; Planning" đứng TRƯỚC "Writing". Câu hỏi nào hỏi cái nào đến trước trong module là đang kiểm tra đúng chỗ này.</p>`],

      [3, 'Describe 3 "take-aways" that you have from the course',
        `<p class="y-chinh">🎯 The reflection prompt of the live session, in two sentences: name <strong>three</strong> things from the course that you will actually use in your university study or another part of your life.</p>
<ul>
<li><strong>The second sentence is the real instruction.</strong> "That is, what are 3 things that you have learnt in this course that you will use or apply…" — the test of a take-away is not "did I find it interesting" but "will I <em>do</em> something differently". An answer with no changed behaviour is a summary, not a take-away.</li>
<li><strong>Three is a deliberate number.</strong> One is luck, ten is a list nobody acts on. Three is small enough to remember on the way out of the room and large enough to cover more than one part of the module.</li>
<li><strong>"or another aspect of your life" widens it on purpose.</strong> Communication skills are not university-only; the slide explicitly invites you to claim a take-away that applies at work, in a club, or at home.</li>
<li><strong>Applied at FPTU.</strong> Do this at the end of every course, not just SSL101c: three sentences in your notes app, each starting with a verb. It takes ninety seconds and it is the only part of a course that survives the semester.</li>
</ul>
<p class="dap-an">✅ Đáp án — three model take-aways from Mooc 4, written the way the slide asks (each is a behaviour, not a topic): <strong>(1)</strong> Before I send anything — email, forum post, report — I will name the author, the audience and the purpose in one line, and change the register to match; that is the rhetorical situation from slide 6. <strong>(2)</strong> I will stop treating a lecture and a tutorial as the same event: I take Cornell-style notes with questions in the left column during the lecture, and I bring those questions to the tutorial instead of sitting silent. <strong>(3)</strong> I will read the course outline in week 1 and copy the marking criteria and assessment dates into my calendar, because slide 14 says those are in there and I have never once looked.</p>
<p class="meo">💡 If this appears as an exam item, the countable fact is simply <strong>3</strong> take-aways — and the criterion is <em>use or apply</em>, not "found interesting" or "remembered".</p>
<p class="pitfall">⚠️ This slide belongs to the added review-session frame (slides 1–4), not to the Sydney MOOC. Its wording will not be examined as MOOC content — but the number 3 and the "apply it" criterion are cheap marks if they do appear.</p>`,
        `<p class="y-chinh">🎯 Câu hỏi suy ngẫm của buổi ôn, gói trong hai câu: hãy nêu <strong>BA</strong> thứ từ khoá học mà bạn sẽ thật sự dùng trong việc học ở đại học hoặc trong một mảng khác của đời sống.</p>
<ul>
<li><strong>Câu thứ hai mới là chỉ dẫn thật.</strong> "That is, what are 3 things that you have learnt in this course that you will use or apply…" — phép thử của một "take-away" không phải "tôi thấy hay" mà là "tôi sẽ LÀM khác đi ở chỗ nào". Câu trả lời không có hành vi nào đổi thì là bản tóm tắt, không phải take-away.</li>
<li><strong>Con số ba là cố ý.</strong> Một thì là may rủi, mười thì thành danh sách không ai làm. Ba đủ nhỏ để nhớ lúc bước ra khỏi phòng, và đủ lớn để phủ hơn một phần của module.</li>
<li><strong>Cụm "or another aspect of your life" mở rộng có chủ đích.</strong> Kỹ năng giao tiếp không chỉ dùng trong trường; slide mời bạn nhận một take-away áp dụng ở chỗ làm, ở câu lạc bộ, hay ở nhà.</li>
<li><strong>Áp dụng ở FPTU.</strong> Làm việc này ở cuối MỌI môn, không riêng SSL101c: ba câu trong app ghi chú, mỗi câu bắt đầu bằng một động từ. Tốn chín mươi giây, và đó là phần duy nhất của một môn học sống sót qua học kỳ.</li>
</ul>
<p class="dap-an">✅ Đáp án — ba take-away mẫu từ Mooc 4, viết đúng kiểu slide đòi (mỗi cái là một HÀNH VI, không phải một chủ đề): <strong>(1)</strong> Trước khi gửi bất cứ thứ gì — email, bài đăng forum, báo cáo — tôi sẽ viết ra một dòng gồm người viết · người nhận · mục đích, rồi chỉnh giọng văn cho khớp; đó là tình huống tu từ ở slide 6. <strong>(2)</strong> Tôi thôi coi lecture và tutorial là cùng một buổi: trong lecture tôi ghi kiểu Cornell với cột trái là câu hỏi, rồi mang đúng những câu hỏi đó vào tutorial thay vì ngồi im. <strong>(3)</strong> Tôi sẽ đọc đề cương môn học ngay tuần 1 và chép tiêu chí chấm cùng lịch nộp bài vào lịch cá nhân, vì slide 14 nói những thứ đó nằm sẵn trong đó mà tôi chưa mở ra lần nào.</p>
<p class="meo">💡 Nếu vào đề, dữ kiện đếm được chỉ là <strong>3</strong> take-away — và tiêu chuẩn là <em>use or apply</em> (dùng hoặc áp dụng), chứ không phải "thấy hay" hay "nhớ được".</p>
<p class="pitfall">⚠️ Slide này thuộc khung buổi ôn được chèn thêm (slide 1–4), không thuộc MOOC gốc của Sydney. Câu chữ của nó sẽ không bị hỏi như nội dung MOOC — nhưng con số 3 và tiêu chuẩn "áp dụng được" là điểm rẻ nếu chẳng may có hỏi.</p>`],

      [4, 'Q&A',
        `<p class="y-chinh">🎯 Two letters and an ampersand on an otherwise empty slide: the session hands the floor back to the students. There is no content here to memorise — but there is a skill being modelled.</p>
<ul>
<li><strong>A blank Q&amp;A slide is itself a rhetorical move.</strong> It changes the author from "lecturer" to "students" and the media from one-way to two-way — exactly the shift slides 8–11 will teach formally. The presenter is demonstrating the framework before naming it.</li>
<li><strong>Q&amp;A is the cheapest marks in any course, and the least used.</strong> The person who asks "I did not follow the part about X" gets a private tutorial in front of everyone; the person who stays quiet pays for it in the exam.</li>
<li><strong>How to ask so you get a usable answer.</strong> State what you understood first, then where it broke: "I follow that the rhetorical situation has six elements, but I cannot tell how Place differs from Media in an online course." A located question gets a located answer; "em không hiểu bài" gets a repeat of the lecture.</li>
<li><strong>Applied at FPTU.</strong> The end-of-class Q&amp;A, the EduNext forum and the supervisor's office hours are the same rhetorical situation with different media. Write your two questions down <em>during</em> the class — slide 18 will say exactly this — because by the time Q&amp;A arrives you will have forgotten them.</li>
</ul>
<p class="dap-an">✅ Đáp án — three questions actually worth asking at the end of a Mooc 4 session: (1) "The summary slide lists six elements of the rhetorical situation but the four analysis slides only use five — which one is dropped, and is it examinable?" (2) "Is a seminar at this university the same thing as a tutorial, since the two slides look almost identical?" (3) "Where in our course outline do I find the marking criteria?" Each names a specific slide or document, so each has a specific answer.</p>
<p class="meo">💡 Slides 1–4 are the only slides in the whole 64 with no Sydney crest and no section number. That two-part signature — no crest, no "2.x" — is how you tell session furniture from MOOC content at a glance.</p>
<p class="pitfall">⚠️ Slide 4 is <strong>not</strong> the end of the deck. The MOOC content starts on the very next slide with "2.1a". Anyone who revises by flicking to the last slide of a section will miss 60 slides.</p>`,
        `<p class="y-chinh">🎯 Hai chữ cái và một dấu &amp; trên một slide trống trơn: buổi học trả sân lại cho sinh viên. Không có nội dung nào để học thuộc ở đây — nhưng có một kỹ năng đang được làm mẫu.</p>
<ul>
<li><strong>Một slide Q&amp;A trống bản thân nó là một nước đi tu từ.</strong> Nó đổi "người nói" từ giảng viên sang sinh viên, và đổi "phương tiện" từ một chiều sang hai chiều — đúng cái chuyển dịch mà slide 8–11 sắp dạy một cách chính thức. Người trình bày đang biểu diễn cái khung trước khi gọi tên nó.</li>
<li><strong>Q&amp;A là điểm rẻ nhất trong mọi môn học, và cũng là thứ ít ai dùng nhất.</strong> Người hỏi "chỗ X em chưa theo kịp" được dạy kèm riêng ngay trước mặt cả lớp; người ngồi im thì trả giá trong phòng thi.</li>
<li><strong>Hỏi thế nào để nhận được câu trả lời dùng được.</strong> Nói cái mình ĐÃ hiểu trước, rồi chỉ chỗ gãy: "Em hiểu tình huống tu từ có sáu yếu tố, nhưng em chưa phân biệt được Place khác Media thế nào trong một môn học online." Câu hỏi có toạ độ thì nhận câu trả lời có toạ độ; "em không hiểu bài" thì nhận lại nguyên bài giảng.</li>
<li><strong>Áp dụng ở FPTU.</strong> Phần hỏi đáp cuối buổi, diễn đàn EduNext và giờ tiếp sinh viên của giảng viên hướng dẫn là CÙNG một tình huống tu từ với ba phương tiện khác nhau. Hãy viết hai câu hỏi của bạn ra ngay TRONG giờ học — slide 18 sẽ nói đúng điều này — vì đến lúc Q&amp;A thì bạn đã quên sạch.</li>
</ul>
<p class="dap-an">✅ Đáp án — ba câu hỏi thật sự đáng hỏi ở cuối một buổi Mooc 4: (1) "Slide tóm tắt liệt kê sáu yếu tố của tình huống tu từ nhưng bốn slide phân tích chỉ dùng năm — yếu tố nào bị rụng, và nó có vào thi không?" (2) "Seminar ở trường mình có phải chính là tutorial không, vì hai slide trông gần như y hệt?" (3) "Tiêu chí chấm nằm ở chỗ nào trong đề cương môn học của chúng em?" Mỗi câu đều gọi tên một slide hoặc một tài liệu cụ thể, nên mỗi câu đều có một đáp án cụ thể.</p>
<p class="meo">💡 Slide 1–4 là những slide DUY NHẤT trong cả 64 slide không có huy hiệu Sydney và không có số hiệu mục. Chữ ký hai phần đó — không huy hiệu, không "2.x" — là cách nhìn một cái là biết đâu là đồ đạc buổi học, đâu là nội dung MOOC.</p>
<p class="pitfall">⚠️ Slide 4 <strong>KHÔNG</strong> phải slide cuối deck. Nội dung MOOC bắt đầu ngay ở slide kế tiếp với mục "2.1a". Ai ôn bài bằng cách lật tới slide cuối của một mục sẽ bỏ sót 60 slide.</p>`],

      [5, '2.1a Introduction to Rhetorical Situations (objectives)',
        `<p class="y-chinh">🎯 The first section-objectives slide of the MOOC proper, and the first appearance of the term the whole module is built on: <strong>the rhetorical situation</strong>. Three objectives, no content yet.</p>
<table>
<tr><th>#</th><th>The slide's objective (verbatim)</th><th>What it commits the section to</th></tr>
<tr><td>1</td><td>understand the 'rhetorical situation' as a framework for analysing shifting expectations for communication in different contexts</td><td>Give you the framework itself — and notice the word <em>shifting</em>: expectations move, they are not fixed</td></tr>
<tr><td>2</td><td>analyse rhetorical situations and expectations for communication in different parts of university courses</td><td>Apply the framework to lectures, tutorials, seminars, assessments</td></tr>
<tr><td>3</td><td>interpret course outlines and learning objectives to understand the contexts and expectations of communication at university</td><td>Read the course outline as evidence of what is expected of you</td></tr>
</table>
<ul>
<li><strong>"Rhetorical" does not mean empty or manipulative here.</strong> In everyday English "that's just rhetoric" is an insult. In this module rhetoric is the neutral, technical study of how communication is shaped by its circumstances. Strip the insult out of the word or the whole section reads wrong.</li>
<li><strong>The key word is "shifting".</strong> The framework does not tell you what good communication is in general — there is no such thing. It tells you the expectations <em>move</em> when the circumstances move, and gives you the dials to check.</li>
<li><strong>Objective 3 looks administrative and is not.</strong> Reading a course outline is presented as an act of <em>interpretation</em>: the document is evidence about what your lecturers expect, and most students never read it as such.</li>
<li><strong>Applied at FPTU.</strong> Three objectives = three things you must be able to do after slides 5–14: define the rhetorical situation and list its elements; analyse a lecture / tutorial / seminar / assessment with it; and pull the expectations out of your own syllabus on FAP.</li>
</ul>
<p class="meo">💡 Count hook: 2.1a has <strong>THREE</strong> objectives, 2.1b has <strong>FOUR</strong>, 2.1c has <strong>THREE</strong> again. Only 2.1b adds the extra one about "rhetorical aims and purposes of different texts".</p>
<p class="pitfall">⚠️ Slide 5 (2.1a) and slide 13 (2.1c) print <strong>the same three objectives, word for word</strong>. That is not a printing error and it is the deck's habit — objectives slides repeat wholesale. Never identify a section by its objectives alone; identify it by the "2.x" number in the heading.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu đầu tiên của phần MOOC thật sự, và cũng là lần đầu xuất hiện thuật ngữ mà cả module dựng lên quanh nó: <strong>rhetorical situation</strong> — tình huống tu từ. Ba mục tiêu, chưa có nội dung.</p>
<table>
<tr><th>#</th><th>Mục tiêu trên slide (nguyên văn)</th><th>Nó cam kết phần này sẽ làm gì</th></tr>
<tr><td>1</td><td>understand the 'rhetorical situation' as a framework for analysing shifting expectations for communication in different contexts</td><td>Trao cho bạn chính cái khung — và để ý chữ <em>shifting</em>: kỳ vọng DỊCH CHUYỂN, không cố định</td></tr>
<tr><td>2</td><td>analyse rhetorical situations and expectations for communication in different parts of university courses</td><td>Đem khung đó áp vào lecture, tutorial, seminar, bài đánh giá</td></tr>
<tr><td>3</td><td>interpret course outlines and learning objectives to understand the contexts and expectations of communication at university</td><td>Đọc đề cương môn học như BẰNG CHỨNG về thứ người ta kỳ vọng ở bạn</td></tr>
</table>
<ul>
<li><strong>Chữ "rhetorical" ở đây KHÔNG mang nghĩa sáo rỗng hay mị dân.</strong> Trong tiếng Anh đời thường, "that's just rhetoric" là một lời chê. Trong module này, tu từ học là ngành nghiên cứu trung tính, mang tính kỹ thuật, về việc giao tiếp bị hoàn cảnh nhào nặn ra sao. Gỡ sắc thái chê bai khỏi từ này, không thì cả phần đọc sẽ lệch.</li>
<li><strong>Từ khoá là "shifting" (dịch chuyển).</strong> Cái khung không nói cho bạn thế nào là giao tiếp tốt nói chung — không có thứ đó. Nó nói rằng kỳ vọng DI CHUYỂN khi hoàn cảnh di chuyển, và đưa cho bạn các nút vặn để kiểm.</li>
<li><strong>Mục tiêu 3 trông như việc hành chính nhưng không phải.</strong> Đọc đề cương môn học được trình bày như một hành vi DIỄN GIẢI: tài liệu đó là bằng chứng về thứ giảng viên kỳ vọng ở bạn, mà phần lớn sinh viên chưa từng đọc nó theo kiểu ấy.</li>
<li><strong>Áp dụng ở FPTU.</strong> Ba mục tiêu = ba việc bạn phải làm được sau slide 5–14: định nghĩa tình huống tu từ và kể tên các yếu tố; phân tích một lecture / tutorial / seminar / bài đánh giá bằng nó; và rút ra các kỳ vọng từ chính syllabus của bạn trên FAP.</li>
</ul>
<p class="meo">💡 Mẹo đếm: 2.1a có <strong>BA</strong> mục tiêu, 2.1b có <strong>BỐN</strong>, 2.1c lại <strong>BA</strong>. Chỉ mỗi 2.1b thêm một mục tiêu về "rhetorical aims and purposes of different texts".</p>
<p class="pitfall">⚠️ Slide 5 (2.1a) và slide 13 (2.1c) in <strong>CÙNG BA MỤC TIÊU, y hệt từng chữ</strong>. Đó không phải lỗi in và là thói quen của deck này — slide mục tiêu bị lặp nguyên khối. Đừng bao giờ nhận dạng một mục chỉ bằng mục tiêu của nó; hãy nhận dạng bằng con số "2.x" trên tiêu đề.</p>`],
      [6, 'Summary: Introduction to rhetorical situations — the definition and the six elements',
        `<p class="y-chinh">🎯 The single most examinable slide in this whole range: the definition — "the full set of circumstances surrounding any communication" (Lunsford, 2013, p. 48) — and <strong>SIX</strong> elements of the rhetorical situation.</p>
<table>
<tr><th>#</th><th>Element (verbatim)</th><th>The question it answers</th><th>What changes if you get it wrong</th></tr>
<tr><td>1</td><td>Author</td><td>Who is producing this? In what role?</td><td>You write as a friend when you are writing as a student</td></tr>
<tr><td>2</td><td>Audience</td><td>Who receives it? What do they already know?</td><td>You explain what they know and skip what they don't</td></tr>
<tr><td>3</td><td>Place</td><td>Where does it happen? Lecture theatre, classroom, forum, exam hall</td><td>You use classroom volume in a 400-seat theatre</td></tr>
<tr><td>4</td><td>Purpose</td><td>What is it for? Inform, practise, debate, demonstrate learning</td><td>You debate when you were asked to demonstrate</td></tr>
<tr><td>5</td><td>Social and political influences</td><td>What power relations and norms surround it?</td><td>You address a professor the way you address a classmate</td></tr>
<tr><td>6</td><td>Media</td><td>Through what channel? Spoken, written, slides, multimodal</td><td>You write an essay paragraph into a chat box</td></tr>
</table>
<p class="nhan">Beyond the slide — the same message, three rhetorical situations. The deck gives the dials but never turns them. Take one content: <em>"I will be two days late with my part of the group project."</em></p>
<table>
<tr><th>Dial</th><th>Email to the lecturer</th><th>Message to a teammate</th><th>Statement to the defence panel</th></tr>
<tr><td>Author</td><td>A student, formally, by full name and student ID</td><td>A peer, first name, equal standing</td><td>A team representative speaking for the group</td></tr>
<tr><td>Audience</td><td>One person with authority over your mark</td><td>One person whose own work is blocked by yours</td><td>Several assessors, plus your teammates listening</td></tr>
<tr><td>Place / Media</td><td>Institutional email, written, permanent, searchable</td><td>Chat app, written, informal, disposable</td><td>Spoken, in a room, with slides, unrepeatable</td></tr>
<tr><td>Purpose</td><td>Request — an extension or advice</td><td>Coordinate — unblock them, re-plan the week</td><td>Account — show the delay was managed, not hidden</td></tr>
<tr><td>Social/political</td><td>High power distance; politeness is not optional</td><td>Low power distance; over-formality sounds sarcastic</td><td>High stakes, public; blaming a teammate is fatal</td></tr>
<tr><td>What you actually write</td><td>"Dear Mr Tuan, I am writing about the SWP391 report due 12 May. My section will be two days late because… I have already agreed a revised plan with my group and attach it. Could I confirm whether…"</td><td>"Tui trễ phần auth 2 ngày nhé, đang kẹt cái token. Mai tui push nhánh tạm để ông ráp trước, khỏi đợi."</td><td>"We hit an integration issue in week 9 that delayed the auth module by two days. We re-planned, reallocated the testing task, and delivered on the revised schedule — the impact on scope was nil."</td></tr>
</table>
<ul>
<li><strong>The content is identical; only the situation moved.</strong> That is the entire thesis of Mooc 4, and this table is the proof. Nobody would send version 2 to the panel — yet students routinely send version 2's register in an email and version 1's register in a chat, and both land badly.</li>
<li><strong>Element 5 is the one students skip, and the one that costs most.</strong> "Social and political influences" is the power relations in the room. It is why an email to a lecturer opens with a greeting and a chat message does not.</li>
<li><strong>Place and Media are not the same element.</strong> Place is <em>where</em>; Media is <em>through what channel</em>. An online seminar has place = your bedroom, media = video call. Confusing the two is the most common slip on this slide.</li>
<li><strong>Applied at FPTU.</strong> Make it a pre-send reflex: one line, six words — author, audience, place, purpose, influences, media — before you hit send on anything that gets marked, read by a lecturer, or seen by more than two people.</li>
</ul>
<p class="meo">💡 Memory hook: <strong>AAPP-SM</strong> — Author, Audience, Place, Purpose, Social/political, Media. Or in Vietnamese order: AI viết · CHO AI · Ở ĐÂU · ĐỂ LÀM GÌ · QUAN HỆ QUYỀN LỰC · QUA KÊNH NÀO. <strong>Six</strong>, and the odd one out (the only multi-word one) is number 5.</p>
<p class="pitfall">⚠️⚠️ Trap of this whole lesson: this summary lists <strong>SIX</strong> elements, but slides 8, 9, 10 and 11 analyse the four university contexts with only <strong>FIVE</strong> — they silently drop "Social and political influences". If a question asks how many elements the rhetorical situation has, the answer from slide 6 is <strong>six</strong>; if it asks which heading the Lectures/Tutorials/Seminars/Assessments slides use, the answer is the <strong>five</strong> without social/political. Learn both counts.</p>`,
        `<p class="y-chinh">🎯 Slide dễ vào đề nhất trong cả dải này: định nghĩa — "the full set of circumstances surrounding any communication" (toàn bộ hoàn cảnh bao quanh một hành vi giao tiếp) theo Lunsford, 2013, tr. 48 — và <strong>SÁU</strong> yếu tố của tình huống tu từ.</p>
<table>
<tr><th>#</th><th>Yếu tố (nguyên văn)</th><th>Nó trả lời câu hỏi nào</th><th>Sai nó thì hỏng chuyện gì</th></tr>
<tr><td>1</td><td>Author</td><td>Ai đang tạo ra thông điệp? Với vai trò gì?</td><td>Bạn viết với tư cách bạn bè trong khi đang là sinh viên</td></tr>
<tr><td>2</td><td>Audience</td><td>Ai nhận? Họ đã biết sẵn những gì?</td><td>Bạn giải thích thứ họ biết và bỏ qua thứ họ chưa biết</td></tr>
<tr><td>3</td><td>Place</td><td>Diễn ra ở đâu? Giảng đường, lớp học, forum, phòng thi</td><td>Bạn nói giọng lớp 30 người trong hội trường 400 chỗ</td></tr>
<tr><td>4</td><td>Purpose</td><td>Để làm gì? Cung cấp thông tin, luyện tập, tranh luận, chứng minh đã học</td><td>Bạn tranh luận trong khi người ta bảo hãy chứng minh</td></tr>
<tr><td>5</td><td>Social and political influences</td><td>Quan hệ quyền lực và chuẩn mực nào bao quanh nó?</td><td>Bạn nói với giáo sư đúng kiểu nói với bạn cùng lớp</td></tr>
<tr><td>6</td><td>Media</td><td>Qua kênh nào? Nói, viết, slide, đa phương thức</td><td>Bạn nhét nguyên một đoạn văn tiểu luận vào khung chat</td></tr>
</table>
<p class="nhan">Phần MỞ RỘNG ngoài slide — cùng một thông điệp, ba tình huống tu từ. Slide đưa các nút vặn nhưng không hề vặn thử. Lấy một nội dung: <em>"Phần việc của tôi trong đồ án nhóm sẽ trễ hai ngày."</em></p>
<table>
<tr><th>Nút vặn</th><th>Email gửi giảng viên</th><th>Tin nhắn cho bạn cùng nhóm</th><th>Phát biểu trước hội đồng bảo vệ</th></tr>
<tr><td>Author</td><td>Một sinh viên, trang trọng, ghi rõ họ tên và MSSV</td><td>Một người ngang hàng, gọi tên, bình đẳng</td><td>Người đại diện nhóm, nói thay cả nhóm</td></tr>
<tr><td>Audience</td><td>Một người có quyền trên điểm số của bạn</td><td>Một người đang bị việc của bạn chặn lại</td><td>Nhiều giám khảo, cộng cả nhóm bạn đang nghe</td></tr>
<tr><td>Place / Media</td><td>Email của trường, dạng viết, lưu vĩnh viễn, tìm lại được</td><td>App chat, dạng viết, thân mật, dùng xong bỏ</td><td>Nói miệng, trong phòng, có slide, không làm lại được</td></tr>
<tr><td>Purpose</td><td>ĐỀ NGHỊ — xin gia hạn hoặc xin lời khuyên</td><td>PHỐI HỢP — gỡ chốt cho bạn ấy, sắp lại kế hoạch tuần</td><td>GIẢI TRÌNH — cho thấy việc trễ đã được quản lý, không bị giấu</td></tr>
<tr><td>Xã hội/quyền lực</td><td>Khoảng cách quyền lực cao; lịch sự là bắt buộc</td><td>Khoảng cách thấp; trang trọng quá nghe như mỉa mai</td><td>Rủi ro cao, công khai; đổ lỗi cho đồng đội là tự sát</td></tr>
<tr><td>Thứ bạn thật sự viết ra</td><td>"Kính gửi thầy Tuấn, em viết thư này về báo cáo SWP391 hạn 12/5. Phần của em sẽ trễ hai ngày vì… Nhóm em đã thống nhất kế hoạch điều chỉnh, em đính kèm ở dưới. Em xin phép hỏi thầy liệu…"</td><td>"Tui trễ phần auth 2 ngày nhé, đang kẹt cái token. Mai tui push nhánh tạm để ông ráp trước, khỏi đợi."</td><td>"Ở tuần 9 nhóm gặp sự cố tích hợp làm module xác thực chậm hai ngày. Nhóm đã lập lại kế hoạch, chuyển việc kiểm thử sang thành viên khác và bàn giao đúng lịch điều chỉnh — phạm vi sản phẩm không bị cắt."</td></tr>
</table>
<ul>
<li><strong>Nội dung y hệt nhau; chỉ có TÌNH HUỐNG dịch chuyển.</strong> Đó là toàn bộ luận điểm của Mooc 4, và bảng này là bằng chứng. Không ai đem bản số 2 ra đọc trước hội đồng — vậy mà sinh viên vẫn thường xuyên gửi giọng của bản 2 vào email và giọng của bản 1 vào chat, cả hai đều rơi hỏng.</li>
<li><strong>Yếu tố 5 là thứ sinh viên hay bỏ qua, và cũng là thứ đắt nhất.</strong> "Social and political influences" chính là quan hệ quyền lực trong phòng. Nó là lý do email gửi giảng viên phải mở bằng lời chào còn tin nhắn chat thì không.</li>
<li><strong>Place và Media KHÔNG phải một.</strong> Place là Ở ĐÂU; Media là QUA KÊNH NÀO. Một buổi seminar online có place = phòng ngủ của bạn, media = cuộc gọi video. Lẫn hai cái này là lỗi phổ biến nhất ở slide này.</li>
<li><strong>Áp dụng ở FPTU.</strong> Biến nó thành phản xạ trước khi gửi: một dòng, sáu chữ — ai viết, cho ai, ở đâu, để làm gì, quan hệ thế nào, qua kênh nào — trước khi bấm gửi bất cứ thứ gì bị chấm điểm, bị giảng viên đọc, hoặc có hơn hai người thấy.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>AAPP-SM</strong> — Author, Audience, Place, Purpose, Social/political, Media. Hoặc theo tiếng Việt: AI viết · CHO AI · Ở ĐÂU · ĐỂ LÀM GÌ · QUAN HỆ QUYỀN LỰC · QUA KÊNH NÀO. <strong>Sáu cái</strong>, và cái lẻ loi (cái duy nhất gồm nhiều từ) là số 5.</p>
<p class="pitfall">⚠️⚠️ Bẫy lớn nhất của cả bài này: slide tóm tắt liệt kê <strong>SÁU</strong> yếu tố, nhưng slide 8, 9, 10 và 11 phân tích bốn bối cảnh ở đại học chỉ bằng <strong>NĂM</strong> — chúng âm thầm rụng mất "Social and political influences". Hỏi "tình huống tu từ có mấy yếu tố" thì đáp án theo slide 6 là <strong>sáu</strong>; hỏi "bốn slide Lectures/Tutorials/Seminars/Assessments dùng những đề mục nào" thì đáp án là <strong>năm</strong> cái, không có social/political. Phải thuộc CẢ HAI con số.</p>`],

      [7, '2.1b Contexts of Communication at University (objectives)',
        `<p class="y-chinh">🎯 The second section of 2.1, and the only objectives slide in this range with <strong>FOUR</strong> bullets instead of three — the extra one is about <em>texts</em>.</p>
<table>
<tr><th>#</th><th>Objective</th><th>Same as 2.1a?</th></tr>
<tr><td>1</td><td>understand the 'rhetorical situation' as a framework for analysing shifting expectations for communication in different contexts</td><td>Identical</td></tr>
<tr><td>2</td><td>analyse rhetorical situations at university</td><td><strong>Shortened</strong> — 2.1a said "…and expectations for communication in different parts of university courses"</td></tr>
<tr><td>3</td><td>understand the rhetorical aims and purposes of different texts and their impact on communication</td><td><strong>NEW</strong> — appears only here</td></tr>
<tr><td>4</td><td>interpret course outlines and learning objectives to understand the contexts and expectations of communication at university</td><td>Identical</td></tr>
</table>
<ul>
<li><strong>Objective 3 is the reason this section exists.</strong> A lecture, a tutorial and an assessment are not just different rooms — they are different <em>text types</em> with different aims. The next four slides (8–11) each answer objective 3 for one context.</li>
<li><strong>Objective 2 shrank, and that is a signal, not sloppiness.</strong> 2.1a promised analysis of "different parts of university courses"; 2.1b just says "at university". The section widens from course-internal contexts to university life generally, then narrows again in 2.1c to the course outline document.</li>
<li><strong>Three of the four bullets are recycled.</strong> The deck's objectives slides are largely copy-paste with one bullet swapped. Once you see that, these slides cost you ten seconds each instead of two minutes.</li>
<li><strong>Applied at FPTU.</strong> Objective 3 in practice: before you open your mouth in any FPTU session, ask "what kind of text is this event?" A lecture is a broadcast — take notes, do not debate. A tutorial is a workshop — bring problems. A seminar is a debate — bring a position. An assessment is a performance — bring evidence.</li>
</ul>
<p class="meo">💡 The marker for 2.1b is the phrase <strong>"rhetorical aims and purposes of different texts"</strong>. It appears on this slide and nowhere else in the range — so if an exam item quotes it, the answer is 2.1b, not 2.1a or 2.1c.</p>
<p class="pitfall">⚠️ Do not count these four bullets as "the four contexts". The four contexts (Lectures, Tutorials, Seminars, Assessments) are on slides 8–11 and listed on slide 12. These are objectives, and the number matching is a coincidence the exam can exploit.</p>`,
        `<p class="y-chinh">🎯 Mục thứ hai của 2.1, và là slide mục tiêu DUY NHẤT trong dải này có <strong>BỐN</strong> gạch đầu dòng thay vì ba — cái thêm vào nói về <em>các loại văn bản</em>.</p>
<table>
<tr><th>#</th><th>Mục tiêu</th><th>Có giống 2.1a không?</th></tr>
<tr><td>1</td><td>understand the 'rhetorical situation' as a framework for analysing shifting expectations for communication in different contexts</td><td>Y HỆT</td></tr>
<tr><td>2</td><td>analyse rhetorical situations at university</td><td><strong>BỊ RÚT NGẮN</strong> — 2.1a viết "…and expectations for communication in different parts of university courses"</td></tr>
<tr><td>3</td><td>understand the rhetorical aims and purposes of different texts and their impact on communication</td><td><strong>MỚI</strong> — chỉ xuất hiện ở đây</td></tr>
<tr><td>4</td><td>interpret course outlines and learning objectives to understand the contexts and expectations of communication at university</td><td>Y HỆT</td></tr>
</table>
<ul>
<li><strong>Mục tiêu 3 chính là lý do tồn tại của mục này.</strong> Lecture, tutorial và bài đánh giá không chỉ là ba cái phòng khác nhau — chúng là ba LOẠI VĂN BẢN khác nhau với ba mục đích khác nhau. Bốn slide kế tiếp (8–11) mỗi cái trả lời mục tiêu 3 cho một bối cảnh.</li>
<li><strong>Mục tiêu 2 bị co lại, và đó là tín hiệu chứ không phải cẩu thả.</strong> 2.1a hứa phân tích "các phần khác nhau của môn học"; 2.1b chỉ nói "ở đại học". Phạm vi mở rộng từ bên trong môn học ra đời sống đại học nói chung, rồi ở 2.1c lại thu hẹp về đúng một tài liệu: đề cương môn học.</li>
<li><strong>Ba trên bốn gạch đầu dòng là hàng tái chế.</strong> Các slide mục tiêu của deck này chủ yếu là chép dán rồi đổi một dòng. Nhận ra điều đó thì mỗi slide loại này chỉ tốn mười giây thay vì hai phút.</li>
<li><strong>Áp dụng ở FPTU.</strong> Mục tiêu 3 trong thực tế: trước khi mở miệng ở bất kỳ buổi nào, hãy hỏi "buổi này là loại văn bản gì?". Lecture là phát sóng một chiều — ghi chép, đừng tranh luận. Tutorial là xưởng thực hành — mang bài tập và chỗ vướng tới. Seminar là tranh luận — mang một quan điểm tới. Bài đánh giá là màn trình diễn — mang bằng chứng tới.</li>
</ul>
<p class="meo">💡 Dấu nhận biết 2.1b là cụm <strong>"rhetorical aims and purposes of different texts"</strong>. Nó chỉ có ở slide này và không ở đâu khác trong dải — nên đề thi trích câu đó thì đáp án là 2.1b, không phải 2.1a hay 2.1c.</p>
<p class="pitfall">⚠️ Đừng đếm bốn gạch đầu dòng này thành "bốn bối cảnh". Bốn bối cảnh (Lectures, Tutorials, Seminars, Assessments) nằm ở slide 8–11 và được liệt kê ở slide 12. Đây là MỤC TIÊU, và việc trùng con số bốn là trùng hợp mà đề thi hoàn toàn có thể lợi dụng.</p>`],

      [8, 'Lectures — the rhetorical situation of a lecture',
        `<p class="y-chinh">🎯 The framework's first real application. A lecture, analysed with <strong>five</strong> headings (Author · Audience · Place · Purpose · Media), and the defining fact is buried in the last one: <em>one-way interaction</em>.</p>
<table>
<tr><th>Element</th><th>The slide's answer (verbatim)</th><th>What it means for you in the room</th></tr>
<tr><td>Author</td><td>Course lecturer (professor, associate professor, senior lecturer, etc)</td><td>ONE author, and a senior one. You are not a co-author here</td></tr>
<tr><td>Audience</td><td>All students enrolled in the course</td><td>Hundreds of people. Nothing is addressed to you personally</td></tr>
<tr><td>Place</td><td>Large lecture theatres or auditoriums; classrooms</td><td>Physical distance from the speaker; you may not be able to interrupt</td></tr>
<tr><td>Purpose</td><td>Providing key information about the weekly topic (Brick, Herke, &amp; Wong, 2016)</td><td><strong>KEY</strong> information — the frame, not every detail. The detail is in the readings</td></tr>
<tr><td>Media</td><td>Face-to-face, <strong>one-way interaction</strong>; presentation slides; handouts; whiteboard</td><td>Information flows lecturer → students. Your job is to receive well</td></tr>
</table>
<ul>
<li><strong>"One-way interaction" is the examinable phrase.</strong> It appears under Media, for lectures, and for no other context in this range. Tutorials and seminars both say "face-to-face interaction" with no direction — because they are two-way.</li>
<li><strong>"Key information about the weekly topic" tells you what a lecture is for.</strong> It is a map, not the territory. A student who treats the lecture as the complete content and skips the readings has misread the purpose — and the deck cites Brick, Herke &amp; Wong (2016) for exactly this claim.</li>
<li><strong>Author is singular and senior; audience is plural and junior.</strong> That asymmetry is the "social and political influences" element at work — even though this slide does not print that heading.</li>
<li><strong>Media is a list of four, not one.</strong> Face-to-face one-way interaction, slides, handouts, whiteboard. A lecture is already multimodal; the slides are only one channel of four.</li>
<li><strong>Applied at FPTU.</strong> Because a lecture is one-way, the highest-value thing you can do in it is not "understand everything live" — it is to <em>capture the frame and record your questions</em>. Slide 18 will say this explicitly. Save the questions for the tutorial, which is two-way and exists for them.</li>
</ul>
<p class="meo">💡 Lecture = the only context with a named academic RANK in the Author line ("professor, associate professor, senior lecturer"). If a question shows you an Author line with ranks in it, it is the Lectures slide.</p>
<p class="pitfall">⚠️ Note that this slide uses <strong>five</strong> headings, not the six from slide 6 — "Social and political influences" is absent. Slides 9, 10 and 11 do exactly the same. So the correct answer to "which elements are used to analyse the four university contexts?" is the five-item list, even though the framework itself has six.</p>`,
        `<p class="y-chinh">🎯 Lần áp dụng thật đầu tiên của cái khung. Một buổi lecture, phân tích bằng <strong>NĂM</strong> đề mục (Author · Audience · Place · Purpose · Media), và sự thật quyết định nằm giấu ở mục cuối: <em>tương tác MỘT CHIỀU</em>.</p>
<table>
<tr><th>Yếu tố</th><th>Câu trả lời của slide (nguyên văn)</th><th>Nghĩa là gì với bạn khi ngồi trong phòng</th></tr>
<tr><td>Author</td><td>Course lecturer (professor, associate professor, senior lecturer, etc)</td><td>MỘT người viết, và là người có thứ bậc cao. Bạn không phải đồng tác giả ở đây</td></tr>
<tr><td>Audience</td><td>All students enrolled in the course</td><td>Hàng trăm người. Không câu nào nhắm riêng vào bạn</td></tr>
<tr><td>Place</td><td>Large lecture theatres or auditoriums; classrooms</td><td>Khoảng cách vật lý với người nói; có khi bạn không cắt ngang được</td></tr>
<tr><td>Purpose</td><td>Providing key information about the weekly topic (Brick, Herke, &amp; Wong, 2016)</td><td>Thông tin <strong>CỐT LÕI</strong> — cái khung, không phải mọi chi tiết. Chi tiết nằm trong tài liệu đọc</td></tr>
<tr><td>Media</td><td>Face-to-face, <strong>one-way interaction</strong>; presentation slides; handouts; whiteboard</td><td>Thông tin chảy từ giảng viên → sinh viên. Việc của bạn là NHẬN cho giỏi</td></tr>
</table>
<ul>
<li><strong>Cụm "one-way interaction" là chỗ vào đề.</strong> Nó nằm ở mục Media, chỉ dành cho lecture, và không có ở bối cảnh nào khác trong dải này. Tutorial và seminar đều ghi "face-to-face interaction" không kèm chiều — vì chúng hai chiều.</li>
<li><strong>"Key information about the weekly topic" nói cho bạn biết lecture để làm gì.</strong> Nó là tấm bản đồ, không phải vùng đất. Sinh viên coi lecture là toàn bộ nội dung rồi bỏ tài liệu đọc là đã hiểu sai MỤC ĐÍCH — và deck dẫn Brick, Herke &amp; Wong (2016) đúng cho khẳng định này.</li>
<li><strong>Author là số ít và ở trên; audience là số nhiều và ở dưới.</strong> Sự bất đối xứng đó chính là yếu tố "social and political influences" đang hoạt động — dù slide này không in cái đề mục ấy ra.</li>
<li><strong>Media là một danh sách BỐN thứ, không phải một.</strong> Tương tác trực tiếp một chiều, slide, tài liệu phát tay, bảng trắng. Một buổi lecture đã là đa phương thức sẵn; bộ slide chỉ là một trong bốn kênh.</li>
<li><strong>Áp dụng ở FPTU.</strong> Vì lecture là một chiều, việc giá trị nhất bạn làm được trong đó KHÔNG phải "hiểu hết ngay tại chỗ" — mà là <em>chộp lấy cái khung và ghi lại câu hỏi của mình</em>. Slide 18 sẽ nói thẳng điều này. Để dành câu hỏi cho buổi tutorial, vốn hai chiều và sinh ra chính vì chúng.</li>
</ul>
<p class="meo">💡 Lecture = bối cảnh DUY NHẤT có học hàm học vị nằm ngay trong dòng Author ("professor, associate professor, senior lecturer"). Đề mà cho bạn thấy một dòng Author có chức danh học thuật thì đó là slide Lectures.</p>
<p class="pitfall">⚠️ Để ý slide này dùng <strong>NĂM</strong> đề mục, không phải sáu như slide 6 — "Social and political influences" vắng mặt. Slide 9, 10 và 11 cũng y như vậy. Nên đáp án đúng cho câu "dùng những yếu tố nào để phân tích bốn bối cảnh ở đại học?" là danh sách NĂM mục, dù bản thân cái khung có sáu.</p>`],

      [9, 'Tutorials or recitations — the rhetorical situation of a tutorial',
        `<p class="y-chinh">🎯 The same five headings, and every single line flips: the author is now <strong>"Tutor/TA and students"</strong> — you have become a co-author of the event.</p>
<table>
<tr><th>Element</th><th>The slide's answer (verbatim)</th><th>The flip from Lectures</th></tr>
<tr><td>Author</td><td>Tutor/TA and students</td><td>From one senior author to a shared authorship including YOU</td></tr>
<tr><td>Audience</td><td>Students and tutor/TA</td><td>Author and audience are the same people — that is what two-way means</td></tr>
<tr><td>Place</td><td>Classroom</td><td>Small room, not an auditorium. Silence is now visible</td></tr>
<tr><td>Purpose</td><td>Practicing and extending lecture content through discussion and problem sets</td><td>From <em>providing</em> information to <em>practising and extending</em> it</td></tr>
<tr><td>Media</td><td>Face-to-face interaction; whiteboard; handouts</td><td>"Interaction" with NO "one-way"; no presentation slides in the list</td></tr>
</table>
<ul>
<li><strong>"Tutor/TA" tells you the author is not the lecturer.</strong> A teaching assistant or tutor — often a postgraduate — runs it. The power distance is lower than a lecture, which is precisely why it is safe to be wrong out loud here.</li>
<li><strong>The Purpose line names two activities: discussion AND problem sets.</strong> Not one. A tutorial where nobody has attempted the problem set has lost half its purpose before it starts.</li>
<li><strong>"Practicing and extending lecture content" makes the tutorial dependent on the lecture.</strong> You cannot extend content you never received. That is the structural argument for attending the lecture even when slides are posted.</li>
<li><strong>Note the missing media.</strong> Lectures listed presentation slides; tutorials do not. The tutorial is not a second lecture with a smaller audience — it is a workshop.</li>
<li><strong>Applied at FPTU.</strong> Arrive with three things: the problem set attempted (even wrongly), the two questions you wrote during the lecture, and one sentence you are prepared to say out loud. "Em nghĩ đáp án là B vì…, nhưng em không chắc chỗ…" is a perfect tutorial utterance: it shows work, locates the gap, and invites correction.</li>
</ul>
<p class="meo">💡 Fast discriminator: <strong>only in Tutorials and Seminars do students appear on the Author line</strong>. In Lectures the author is the lecturer alone; in Assessments the author is the students alone. Author line = the whole question, most of the time.</p>
<p class="pitfall">⚠️ "Recitation" is the North American name for a tutorial, printed here as a synonym — it is NOT a fifth context. The four contexts are Lectures, Tutorials/recitations, Seminars, Assessments (confirmed on slide 12).</p>`,
        `<p class="y-chinh">🎯 Vẫn năm đề mục đó, và từng dòng một đều lật ngược: người tạo ra buổi học giờ là <strong>"Tutor/TA and students"</strong> — bạn đã trở thành đồng tác giả của sự kiện.</p>
<table>
<tr><th>Yếu tố</th><th>Câu trả lời của slide (nguyên văn)</th><th>Lật ngược so với Lectures ở chỗ nào</th></tr>
<tr><td>Author</td><td>Tutor/TA and students</td><td>Từ một tác giả cấp cao sang quyền tác giả CHIA SẺ, có cả BẠN</td></tr>
<tr><td>Audience</td><td>Students and tutor/TA</td><td>Người nói và người nghe là cùng một nhóm người — "hai chiều" nghĩa là vậy</td></tr>
<tr><td>Place</td><td>Classroom</td><td>Phòng nhỏ, không phải hội trường. Im lặng giờ đây bị nhìn thấy</td></tr>
<tr><td>Purpose</td><td>Practicing and extending lecture content through discussion and problem sets</td><td>Từ <em>CUNG CẤP</em> thông tin sang <em>LUYỆN TẬP và MỞ RỘNG</em> nó</td></tr>
<tr><td>Media</td><td>Face-to-face interaction; whiteboard; handouts</td><td>Có "interaction" nhưng KHÔNG có "one-way"; và không có slide trình chiếu</td></tr>
</table>
<ul>
<li><strong>"Tutor/TA" cho biết người chủ trì KHÔNG phải giảng viên chính.</strong> Một trợ giảng hoặc tutor — thường là học viên sau đại học — đứng lớp. Khoảng cách quyền lực thấp hơn lecture, và đó chính là lý do ở đây nói sai ra miệng vẫn an toàn.</li>
<li><strong>Dòng Purpose gọi tên HAI hoạt động: thảo luận VÀ bộ bài tập.</strong> Không phải một. Một buổi tutorial mà không ai đụng vào bộ bài tập thì đã mất nửa mục đích trước khi bắt đầu.</li>
<li><strong>"Practicing and extending lecture content" khiến tutorial PHỤ THUỘC vào lecture.</strong> Bạn không thể mở rộng thứ mình chưa từng nhận. Đó là lập luận cấu trúc cho việc vẫn phải dự lecture dù slide đã được đăng.</li>
<li><strong>Chú ý thứ BỊ THIẾU ở phần media.</strong> Lecture có liệt kê slide trình chiếu; tutorial thì không. Tutorial không phải một buổi lecture thứ hai với ít người nghe hơn — nó là một xưởng thực hành.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đến lớp mang theo ba thứ: bộ bài tập đã thử làm (dù sai), hai câu hỏi bạn viết trong buổi lecture, và một câu bạn sẵn sàng nói ra miệng. "Em nghĩ đáp án là B vì…, nhưng em không chắc chỗ…" là một câu phát biểu tutorial hoàn hảo: nó cho thấy có làm, định vị được chỗ vướng, và mời người khác sửa.</li>
</ul>
<p class="meo">💡 Cách phân biệt nhanh: <strong>chỉ Tutorials và Seminars mới có sinh viên trên dòng Author</strong>. Lectures thì tác giả chỉ có giảng viên; Assessments thì tác giả chỉ có sinh viên. Nhìn dòng Author là ra đáp án, phần lớn trường hợp.</p>
<p class="pitfall">⚠️ "Recitation" là tên gọi kiểu Bắc Mỹ của tutorial, in ở đây như một từ đồng nghĩa — nó KHÔNG phải bối cảnh thứ năm. Bốn bối cảnh là Lectures, Tutorials/recitations, Seminars, Assessments (slide 12 xác nhận).</p>`],

      [10, 'Seminars — the rhetorical situation of a seminar',
        `<p class="y-chinh">🎯 The hardest slide in the range to keep separate from the previous one. A seminar looks almost identical to a tutorial — and the two differences are the whole point: the author is the <strong>lecturer</strong> (not a tutor/TA), and the purpose is <strong>debate</strong> (not practice).</p>
<table>
<tr><th>Element</th><th>Tutorials or recitations (slide 9)</th><th>Seminars (slide 10)</th></tr>
<tr><td>Author</td><td>Tutor/TA and students</td><td><strong>Lecturer</strong> and students</td></tr>
<tr><td>Audience</td><td>Students and tutor/TA</td><td>Students and <strong>lecturer</strong></td></tr>
<tr><td>Place</td><td>Classroom</td><td>Classroom — <em>identical</em></td></tr>
<tr><td>Purpose</td><td>Practicing and extending lecture content through discussion and <strong>problem sets</strong></td><td>Discussing <strong>readings</strong> and questions; <strong>engaging in debate</strong></td></tr>
<tr><td>Media</td><td>Face-to-face interaction; whiteboard; handouts</td><td>Face-to-face interaction; whiteboard; handouts; <strong>readings</strong></td></tr>
</table>
<ul>
<li><strong>Three lines differ, two are identical.</strong> Place is word-for-word the same; Media differs by exactly one item ("readings"). Author/Audience swap tutor→lecturer. Purpose is the real difference.</li>
<li><strong>Problem sets versus readings is the cleanest discriminator.</strong> A tutorial is built around <em>tasks with answers</em>; a seminar is built around <em>texts with arguments</em>. That is why "readings" appears in the seminar's media list and not the tutorial's.</li>
<li><strong>"Engaging in debate" appears nowhere else in the whole range.</strong> Only seminars ask you to hold a position and defend it. In a tutorial being wrong is a step; in a seminar having no view at all is the failure.</li>
<li><strong>The lecturer being present raises the stakes.</strong> Same room as a tutorial, higher power distance — the "social and political influences" element again, invisible on the slide but felt by everyone in the room.</li>
<li><strong>Applied at FPTU.</strong> FPTU labels most small-group sessions "lab", "workshop" or "tutorial", so true seminars are rarer — but a specialisation course discussion of a research paper, or a review session where the lecturer asks "do you agree with this architecture?", is a seminar by this definition. Prepare differently: read in detail and arrive with a <em>position plus two observations</em>, not just questions (slide 19 says exactly this).</li>
</ul>
<p class="meo">💡 Two-word memory hook: <strong>tutorial = problems, seminar = readings</strong>. And the person in the room: <strong>tutorial = TA, seminar = lecturer</strong>. Any exam item contrasting these two is asking one of those two pairs.</p>
<p class="pitfall">⚠️ Both slides print "Place: Classroom" and both print "Face-to-face interaction; whiteboard; handouts". Place and most of Media are USELESS for telling them apart — a question that gives you only those two lines is unanswerable on purpose, and the answer will hinge on Author or Purpose.</p>`,
        `<p class="y-chinh">🎯 Slide khó giữ tách bạch nhất trong cả dải. Seminar trông gần như y hệt tutorial — và hai chỗ khác nhau chính là toàn bộ vấn đề: người chủ trì là <strong>giảng viên</strong> (không phải tutor/TA), và mục đích là <strong>TRANH LUẬN</strong> (không phải luyện tập).</p>
<table>
<tr><th>Yếu tố</th><th>Tutorials or recitations (slide 9)</th><th>Seminars (slide 10)</th></tr>
<tr><td>Author</td><td>Tutor/TA and students</td><td><strong>Lecturer</strong> and students</td></tr>
<tr><td>Audience</td><td>Students and tutor/TA</td><td>Students and <strong>lecturer</strong></td></tr>
<tr><td>Place</td><td>Classroom</td><td>Classroom — <em>y hệt</em></td></tr>
<tr><td>Purpose</td><td>Practicing and extending lecture content through discussion and <strong>problem sets</strong></td><td>Discussing <strong>readings</strong> and questions; <strong>engaging in debate</strong></td></tr>
<tr><td>Media</td><td>Face-to-face interaction; whiteboard; handouts</td><td>Face-to-face interaction; whiteboard; handouts; <strong>readings</strong></td></tr>
</table>
<ul>
<li><strong>Ba dòng khác nhau, hai dòng y hệt.</strong> Place giống nhau từng chữ; Media chỉ khác đúng một mục ("readings"). Author/Audience đổi tutor→lecturer. Purpose mới là khác biệt thật.</li>
<li><strong>Bài tập so với tài liệu đọc là cách phân biệt sạch nhất.</strong> Tutorial dựng quanh <em>những nhiệm vụ có đáp án</em>; seminar dựng quanh <em>những văn bản có lập luận</em>. Đó là vì sao "readings" xuất hiện trong danh sách media của seminar mà không có ở tutorial.</li>
<li><strong>Cụm "engaging in debate" không xuất hiện ở bất kỳ đâu khác trong cả dải.</strong> Chỉ seminar mới yêu cầu bạn giữ một lập trường và bảo vệ nó. Ở tutorial, sai là một bước đi; ở seminar, KHÔNG có quan điểm nào mới là thất bại.</li>
<li><strong>Giảng viên có mặt làm rủi ro tăng lên.</strong> Cùng cái phòng như tutorial, nhưng khoảng cách quyền lực cao hơn — lại là yếu tố "social and political influences", vô hình trên slide nhưng ai ngồi trong phòng cũng cảm được.</li>
<li><strong>Áp dụng ở FPTU.</strong> FPTU gọi phần lớn buổi nhóm nhỏ là "lab", "workshop" hay "tutorial", nên seminar đúng nghĩa hiếm hơn — nhưng một buổi bàn về bài báo khoa học ở môn chuyên ngành, hay buổi review mà giảng viên hỏi "các em có đồng ý với kiến trúc này không?", chính là seminar theo định nghĩa này. Chuẩn bị khác đi: đọc kỹ và đến với <em>một lập trường cộng hai nhận xét</em>, không chỉ mang câu hỏi (slide 19 nói đúng điều đó).</li>
</ul>
<p class="meo">💡 Mẹo nhớ hai chữ: <strong>tutorial = bài tập, seminar = bài đọc</strong>. Và người có mặt trong phòng: <strong>tutorial = TA, seminar = giảng viên</strong>. Câu hỏi nào đem hai cái này ra so là đang hỏi một trong hai cặp đó.</p>
<p class="pitfall">⚠️ Cả hai slide đều in "Place: Classroom" và đều in "Face-to-face interaction; whiteboard; handouts". Place và phần lớn Media là VÔ DỤNG để phân biệt — câu hỏi nào chỉ đưa cho bạn hai dòng đó là cố ý không giải được, và đáp án sẽ nằm ở Author hoặc Purpose.</p>`],

      [11, 'Assessments — the rhetorical situation where the student is the author',
        `<p class="y-chinh">🎯 The flip that matters most for your marks: in an assessment <strong>you are the Author</strong> and the staff are the Audience. Three of the five lines answer "Variable", and that is itself the lesson.</p>
<table>
<tr><th>Element</th><th>The slide's answer (verbatim)</th><th>Why it is written that way</th></tr>
<tr><td>Author</td><td><strong>Students</strong></td><td>The only context in the four where staff are NOT an author</td></tr>
<tr><td>Audience</td><td>Lecturer and/or tutors</td><td>The person who marks you. "and/or" — you may not know which</td></tr>
<tr><td>Place</td><td><strong>Variable</strong></td><td>Exam hall, home, lab, online — the assessment defines it</td></tr>
<tr><td>Purpose</td><td>Demonstrating learning through responses to set tasks</td><td>Not to inform, not to debate — to <em>demonstrate</em>. Evidence, not opinion</td></tr>
<tr><td>Media</td><td><strong>Variable</strong>; may be spoken, written, or multimodal</td><td>Essay, presentation, poster, code, viva — you must check which</td></tr>
</table>
<ul>
<li><strong>"Demonstrating learning" is the most important phrase on the slide.</strong> An assessment is not a place to express yourself or to explore. It is a place to <em>show</em> that specific learning happened, against criteria someone wrote down in advance. That reframing alone lifts marks.</li>
<li><strong>Three "Variable"s is a warning, not vagueness.</strong> Place, Media and (partly) Audience change from task to task, so the slide refuses to generalise — and hands you the job. Where do you find the actual values? The course outline. That is why 2.1c comes next.</li>
<li><strong>"Responses to set tasks" means the task sets the shape.</strong> Answering a different question well scores zero. This is the hinge to Mooc 4 part 2, "Interpreting… Written Assignments".</li>
<li><strong>You are now the author — so every element from slide 6 becomes yours to control.</strong> Register, structure, evidence, format: nobody else is producing this text.</li>
<li><strong>Applied at FPTU.</strong> Before any FPTU assessment, fill in the three variables yourself, in writing: Place (phòng thi / ở nhà / lab), Media (bài viết / thuyết trình / code + báo cáo), Audience (giảng viên môn / hội đồng / cả hai). All three are in the syllabus on FAP, and getting the Media wrong — writing an essay when a demo was required — is the single most expensive mistake in this table.</li>
</ul>
<p class="meo">💡 Author line across the four contexts, in order: <strong>lecturer · tutor+students · lecturer+students · students</strong>. Learn that one column and you can rebuild most of slides 8–11 from memory.</p>
<p class="pitfall">⚠️ Do not read "Variable" as "does not matter". It means "the answer exists but is not on this slide" — and an exam option claiming assessments have no fixed place or media is repeating the slide correctly, while an option claiming assessments are always written is wrong ("may be spoken, written, or multimodal").</p>`,
        `<p class="y-chinh">🎯 Cú lật quan trọng nhất với điểm số của bạn: trong một bài đánh giá, <strong>BẠN là Author</strong> còn giảng viên là Audience. Ba trên năm dòng trả lời "Variable" (thay đổi), và chính điều đó là bài học.</p>
<table>
<tr><th>Yếu tố</th><th>Câu trả lời của slide (nguyên văn)</th><th>Vì sao lại viết như vậy</th></tr>
<tr><td>Author</td><td><strong>Students</strong></td><td>Bối cảnh DUY NHẤT trong bốn cái mà giảng viên KHÔNG phải tác giả</td></tr>
<tr><td>Audience</td><td>Lecturer and/or tutors</td><td>Người chấm bạn. Chữ "and/or" — có khi bạn không biết là ai</td></tr>
<tr><td>Place</td><td><strong>Variable</strong></td><td>Phòng thi, ở nhà, phòng lab, trực tuyến — bài đánh giá quy định</td></tr>
<tr><td>Purpose</td><td>Demonstrating learning through responses to set tasks</td><td>Không phải để cung cấp thông tin, không phải để tranh luận — mà để <em>CHỨNG MINH</em>. Bằng chứng, không phải ý kiến</td></tr>
<tr><td>Media</td><td><strong>Variable</strong>; may be spoken, written, or multimodal</td><td>Tiểu luận, thuyết trình, poster, code, vấn đáp — bạn phải tự kiểm là cái nào</td></tr>
</table>
<ul>
<li><strong>"Demonstrating learning" là cụm quan trọng nhất trên slide.</strong> Bài đánh giá không phải chỗ để bộc lộ bản thân hay để khám phá. Nó là chỗ để <em>TRƯNG RA</em> rằng một sự học cụ thể đã diễn ra, đối chiếu với các tiêu chí ai đó đã viết sẵn từ trước. Chỉ riêng việc định khung lại như thế đã nâng điểm.</li>
<li><strong>Ba chữ "Variable" là một lời cảnh báo, không phải sự mơ hồ.</strong> Place, Media và (phần nào) Audience đổi theo từng bài, nên slide từ chối khái quát hoá — và giao việc lại cho bạn. Tìm giá trị thật ở đâu? Đề cương môn học. Đó là lý do 2.1c đến ngay sau.</li>
<li><strong>"Responses to set tasks" nghĩa là ĐỀ BÀI quy định hình dạng.</strong> Trả lời hay cho một câu hỏi khác thì được không điểm. Đây là bản lề nối sang phần 2 của Mooc 4, "Interpreting… Written Assignments".</li>
<li><strong>Giờ bạn là tác giả — nên mọi yếu tố ở slide 6 trở thành thứ bạn phải điều khiển.</strong> Giọng văn, bố cục, bằng chứng, định dạng: không còn ai khác tạo ra văn bản này.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trước mỗi bài đánh giá, tự điền ba biến số đó ra giấy: Place (phòng thi / ở nhà / lab), Media (bài viết / thuyết trình / code kèm báo cáo), Audience (giảng viên môn / hội đồng / cả hai). Cả ba đều nằm trong syllabus trên FAP, và sai ở Media — viết tiểu luận trong khi người ta đòi demo — là sai lầm đắt nhất trong bảng này.</li>
</ul>
<p class="meo">💡 Dòng Author qua bốn bối cảnh, theo thứ tự: <strong>giảng viên · tutor+sinh viên · giảng viên+sinh viên · sinh viên</strong>. Thuộc đúng một cột đó là dựng lại được gần hết slide 8–11 từ trí nhớ.</p>
<p class="pitfall">⚠️ Đừng đọc "Variable" thành "không quan trọng". Nó nghĩa là "câu trả lời có tồn tại nhưng không nằm trên slide này" — và đáp án nào nói bài đánh giá không có nơi chốn hay phương tiện cố định là đang chép đúng slide, còn đáp án nào nói bài đánh giá luôn ở dạng viết là SAI ("may be spoken, written, or multimodal").</p>`],

      [12, 'Summary: Rhetorical situations at university — 3 components, 4 situations',
        `<p class="y-chinh">🎯 The section's closing summary, and a slide built entirely out of countable lists: one claim, <strong>3</strong> components of a course, <strong>4</strong> common rhetorical situations.</p>
<table>
<tr><th>Block</th><th>The slide's items (verbatim)</th><th>Count</th></tr>
<tr><td>Opening claim</td><td>University courses focus on particular topics within an academic field</td><td>1 sentence</td></tr>
<tr><td>Components of courses</td><td>Unit of study outline or syllabus · Readings · Team of people who run the course</td><td><strong>3</strong></td></tr>
<tr><td>Common rhetorical situations in courses</td><td>Lectures · Tutorials or recitations · Seminars · Assessments</td><td><strong>4</strong></td></tr>
</table>
<ul>
<li><strong>The three components answer "what IS a course?"</strong> A document, a body of texts, and a group of people. Not a timetable, not a room — the deck's answer is deliberately non-obvious and very examinable.</li>
<li><strong>"Team of people who run the course" is plural on purpose.</strong> Lecturer, tutors, coordinators, administrators. The person who can fix your problem is often not the person who lectures you — knowing the team is knowing where to go for help.</li>
<li><strong>The four situations are exactly slides 8, 9, 10 and 11, in that order.</strong> This slide is the index; those four are the entries. If you can name the four and reconstruct each Author line, you own the section.</li>
<li><strong>"Common" is doing quiet work.</strong> The deck does not claim these are the only four — labs, field trips, online forums and group work all exist (forums get their own section at slide 20). But these four are the examinable set for 2.1b.</li>
<li><strong>Applied at FPTU.</strong> Map the three components onto your own course this week: the syllabus on FAP (component 1), the textbook and slide decks (component 2), and the actual names of your lecturer, lab assistant and academic advisor (component 3). Most students cannot name component 3 — and that is exactly who you email when something goes wrong.</li>
</ul>
<p class="meo">💡 Count hook for this slide: <strong>3 then 4</strong>. Three components (document · readings · people), four situations (lecture · tutorial · seminar · assessment). Both lists are short, both are quoted verbatim in exam options.</p>
<p class="pitfall">⚠️ This summary keeps "Tutorials <em>or recitations</em>" as one item — so the answer to "how many common rhetorical situations does the deck list?" is <strong>4</strong>, not 5. And note that online forums, taught at slides 20–21, are NOT on this list: the summary belongs to 2.1b only.</p>`,
        `<p class="y-chinh">🎯 Slide khép mục, và là slide dựng hoàn toàn bằng những danh sách đếm được: một khẳng định, <strong>3</strong> thành phần của một môn học, <strong>4</strong> tình huống tu từ thường gặp.</p>
<table>
<tr><th>Khối</th><th>Các mục trên slide (nguyên văn)</th><th>Số lượng</th></tr>
<tr><td>Khẳng định mở đầu</td><td>University courses focus on particular topics within an academic field</td><td>1 câu</td></tr>
<tr><td>Components of courses</td><td>Unit of study outline or syllabus · Readings · Team of people who run the course</td><td><strong>3</strong></td></tr>
<tr><td>Common rhetorical situations in courses</td><td>Lectures · Tutorials or recitations · Seminars · Assessments</td><td><strong>4</strong></td></tr>
</table>
<ul>
<li><strong>Ba thành phần trả lời câu hỏi "một môn học LÀ gì?"</strong> Một tài liệu, một khối văn bản, và một nhóm người. Không phải thời khoá biểu, không phải cái phòng — câu trả lời của deck cố ý không hiển nhiên và rất dễ vào đề.</li>
<li><strong>"Team of people who run the course" để số nhiều là có chủ đích.</strong> Giảng viên, trợ giảng, người điều phối, nhân viên hành chính. Người giải quyết được vấn đề của bạn thường KHÔNG phải người đứng giảng — biết đội ngũ là biết đi đâu để được giúp.</li>
<li><strong>Bốn tình huống chính là slide 8, 9, 10 và 11, đúng thứ tự đó.</strong> Slide này là mục lục; bốn slide kia là các mục. Gọi được tên bốn cái và dựng lại được dòng Author của từng cái thì bạn đã nắm chắc phần này.</li>
<li><strong>Chữ "common" (thường gặp) đang lặng lẽ làm việc.</strong> Deck không khẳng định chỉ có bốn — lab, đi thực tế, diễn đàn trực tuyến và làm việc nhóm đều tồn tại (diễn đàn có mục riêng ở slide 20). Nhưng bốn cái này là bộ vào đề của mục 2.1b.</li>
<li><strong>Áp dụng ở FPTU.</strong> Ngay tuần này, ánh xạ ba thành phần vào môn bạn đang học: syllabus trên FAP (thành phần 1), giáo trình và bộ slide (thành phần 2), và tên thật của giảng viên, trợ giảng phòng lab, cố vấn học tập của bạn (thành phần 3). Phần lớn sinh viên không gọi được tên thành phần 3 — mà đó đúng là những người bạn phải email khi có chuyện.</li>
</ul>
<p class="meo">💡 Mẹo đếm cho slide này: <strong>3 rồi 4</strong>. Ba thành phần (tài liệu · bài đọc · con người), bốn tình huống (lecture · tutorial · seminar · bài đánh giá). Cả hai danh sách đều ngắn, và cả hai đều bị trích nguyên văn vào các phương án trả lời.</p>
<p class="pitfall">⚠️ Slide tóm tắt này giữ "Tutorials <em>or recitations</em>" là MỘT mục — nên đáp án cho câu "deck liệt kê mấy tình huống tu từ thường gặp?" là <strong>4</strong>, không phải 5. Và để ý: diễn đàn trực tuyến, được dạy ở slide 20–21, KHÔNG có trong danh sách này — bản tóm tắt chỉ thuộc về mục 2.1b.</p>`],

      [13, '2.1c University Course Outlines & Contexts of Communication (objectives — identical to 2.1a)',
        `<p class="y-chinh">🎯 The third and last section of 2.1 — and its three objectives are <strong>word-for-word identical to slide 5 (2.1a)</strong>. Only the heading tells you where you are.</p>
<ul>
<li><strong>The repeat is real and it is the deck's biggest structural trap.</strong> Compare them yourself: "understand the 'rhetorical situation' as a framework…", "analyse rhetorical situations and expectations for communication in different parts of university courses", "interpret course outlines and learning objectives…". Three for three, same order, same wording. Slide 7 (2.1b) is the only one of the trio that differs.</li>
<li><strong>What the heading adds is everything.</strong> "University Course Outlines &amp; Contexts of Communication" narrows the section onto one document — the course outline — which was objective 3 all along. The section finally does what the objectives had been promising since slide 5.</li>
<li><strong>This slide also uses a different footer.</strong> No Sydney crest; instead a small "Page 1" in the bottom-right corner. Slides 14, 20 and 21 also drop the crest. It is a sign these slides came from a different export batch — cosmetic, but it is a reliable way to spot which slides were re-made.</li>
<li><strong>There is no section 2.2 in this deck range.</strong> The numbering jumps 2.1c → 2.3a (slide 15). Whatever 2.2 covered in the MOOC did not make it into this review deck, so do not go hunting for it in these 21 slides.</li>
<li><strong>Applied at FPTU.</strong> Treat the repeat as a free revision prompt: if you cannot recite the three objectives by now, you have seen them twice and learned them zero times. Say them out loud before moving on — framework, analyse, interpret the outline.</li>
</ul>
<p class="meo">💡 Identify sections by the <strong>"2.x" number in the heading</strong>, never by the bullets underneath. In this deck the bullets are recycled and the number is not.</p>
<p class="pitfall">⚠️ Exam trap built on this: a question quotes three objectives and asks which section they belong to. Both 2.1a and 2.1c are correct by content — so the question must give you the heading, and if it does not, look for the answer option that names the <em>document</em> (course outline), since that is what 2.1c is actually about.</p>`,
        `<p class="y-chinh">🎯 Mục thứ ba và cuối cùng của 2.1 — và ba mục tiêu của nó <strong>Y HỆT TỪNG CHỮ slide 5 (2.1a)</strong>. Chỉ có dòng tiêu đề cho biết bạn đang ở đâu.</p>
<ul>
<li><strong>Chỗ lặp này là thật và là cái bẫy cấu trúc lớn nhất của deck.</strong> Tự so đi: "understand the 'rhetorical situation' as a framework…", "analyse rhetorical situations and expectations for communication in different parts of university courses", "interpret course outlines and learning objectives…". Ba trên ba, cùng thứ tự, cùng câu chữ. Slide 7 (2.1b) là cái duy nhất trong bộ ba có khác.</li>
<li><strong>Thứ mà TIÊU ĐỀ thêm vào mới là tất cả.</strong> "University Course Outlines &amp; Contexts of Communication" thu hẹp mục này về đúng MỘT tài liệu — đề cương môn học — vốn đã là mục tiêu số 3 từ đầu. Đến đây mục học mới thật sự làm cái điều mà các mục tiêu hứa từ slide 5.</li>
<li><strong>Slide này còn dùng chân trang khác.</strong> Không có huy hiệu Sydney; thay vào đó là dòng chữ nhỏ "Page 1" ở góc dưới phải. Slide 14, 20 và 21 cũng mất huy hiệu. Đó là dấu vết cho thấy nhóm slide này ra từ một lượt xuất file khác — chỉ là hình thức, nhưng là cách đáng tin để nhận ra slide nào đã bị làm lại.</li>
<li><strong>KHÔNG có mục 2.2 nào trong dải slide này.</strong> Đánh số nhảy thẳng 2.1c → 2.3a (slide 15). Mục 2.2 dạy gì trong MOOC thì đã không lọt vào bộ slide ôn tập này, nên đừng đi tìm nó trong 21 slide.</li>
<li><strong>Áp dụng ở FPTU.</strong> Coi chỗ lặp này là một lời nhắc ôn miễn phí: nếu tới giờ bạn vẫn chưa đọc thuộc ba mục tiêu, thì bạn đã nhìn chúng hai lần và học được không lần nào. Đọc to lên rồi hẵng đi tiếp — hiểu cái khung, phân tích tình huống, diễn giải đề cương.</li>
</ul>
<p class="meo">💡 Nhận dạng mục học bằng <strong>con số "2.x" trên tiêu đề</strong>, đừng bao giờ bằng mấy gạch đầu dòng bên dưới. Trong deck này, gạch đầu dòng là hàng tái chế còn con số thì không.</p>
<p class="pitfall">⚠️ Bẫy đề dựng trên chỗ này: câu hỏi trích ba mục tiêu rồi hỏi chúng thuộc mục nào. Cả 2.1a lẫn 2.1c đều đúng xét theo nội dung — nên đề buộc phải cho bạn dòng tiêu đề, còn nếu không cho thì hãy tìm phương án nào gọi tên cái <em>TÀI LIỆU</em> (course outline), vì đó mới là thứ 2.1c thật sự bàn tới.</p>`],

      [14, 'Summary: Course Outlines — the AKA, and the eight things inside',
        `<p class="y-chinh">🎯 A pure checklist slide and one of the highest-value slides in the range for real life: two alternative names for the document, then <strong>EIGHT</strong> things it contains.</p>
<table>
<tr><th>#</th><th>What the outline contains (verbatim)</th><th>What you actually do with it</th><th>Where it lives at FPTU</th></tr>
<tr><td>1</td><td>Key learning objectives</td><td>Read them as the exam blueprint — they say what you must be able to DO</td><td>Syllabus on FAP, section "Learning outcomes" (LO1, LO2…)</td></tr>
<tr><td>2</td><td>Dates &amp; times of lectures &amp; tutorials</td><td>Into your calendar in week 1, not week 5</td><td>FAP timetable</td></tr>
<tr><td>3</td><td>Where to go for help</td><td>Names and channels BEFORE you need them</td><td>Lecturer email, academic advisor, học vụ</td></tr>
<tr><td>4</td><td>Websites</td><td>The platforms the course actually runs on</td><td>FAP · EduNext · Coursera for this very course</td></tr>
<tr><td>5</td><td>Assessments</td><td>Weights and formats — the "Variable" fields from slide 11 get their values here</td><td>Syllabus "Assessment structure" (% per component)</td></tr>
<tr><td>6</td><td>Expectations</td><td>Attendance, participation, academic honesty rules</td><td>Attendance rule, plagiarism policy</td></tr>
<tr><td>7</td><td>Marking criteria</td><td>The rubric you will be graded against — read it before writing, not after</td><td>Assignment brief / rubric</td></tr>
<tr><td>8</td><td>Special considerations</td><td>What to do when illness or emergency hits a deadline</td><td>Thủ tục xin hoãn / phúc khảo ở phòng học vụ</td></tr>
</table>
<ul>
<li><strong>The AKA line is examinable on its own.</strong> "AKA: unit of study outline, syllabus document" — the same object has three names across universities. Sydney says "unit of study outline"; FPTU says "syllabus"; the deck says "course outline". A question that switches the name is testing whether you noticed.</li>
<li><strong>Items 1, 5 and 7 are the marks-bearing three.</strong> Objectives tell you what is tested, assessments tell you the weights, marking criteria tell you how each mark is awarded. If you read only three of the eight, read those.</li>
<li><strong>Item 8 is the one nobody reads until it is too late.</strong> "Special considerations" is the formal route when something genuinely goes wrong. Knowing the procedure exists — and its deadline — before you get sick is the whole point of reading it in week 1.</li>
<li><strong>This slide is what makes objective 3 concrete.</strong> Since slide 5 the deck has said "interpret course outlines"; here it finally says what is inside one to interpret.</li>
<li><strong>Applied at FPTU — a 15-minute week-1 ritual.</strong> Open the syllabus, and copy four things into one note: the LO list, the assessment table with weights, the marking rubric link, and the name + email of the person you contact for problems. That note answers 90% of the questions you will otherwise ask in the group chat all semester.</li>
</ul>
<p class="meo">💡 Count hook: <strong>2 alternative names + 8 contents</strong>. And the order on the slide is not random — it runs from the abstract (objectives) through the practical (dates, help, websites) to the consequential (assessments, expectations, criteria, special considerations).</p>
<p class="pitfall">⚠️ "Expectations" (item 6) and "Marking criteria" (item 7) are two SEPARATE items on this slide. Expectations are behavioural (turn up, do not plagiarise); marking criteria are the rubric your work is scored against. Merging them into one gives you seven items and the wrong count.</p>`,
        `<p class="y-chinh">🎯 Một slide checklist thuần tuý và là một trong những slide giá trị nhất dải này cho đời sống thật: hai tên gọi thay thế của tài liệu, rồi <strong>TÁM</strong> thứ nằm bên trong nó.</p>
<table>
<tr><th>#</th><th>Đề cương chứa gì (nguyên văn)</th><th>Bạn làm gì với nó</th><th>Ở FPTU nó nằm đâu</th></tr>
<tr><td>1</td><td>Key learning objectives</td><td>Đọc như bản thiết kế đề thi — nó nói bạn phải LÀM ĐƯỢC gì</td><td>Syllabus trên FAP, mục "Learning outcomes" (LO1, LO2…)</td></tr>
<tr><td>2</td><td>Dates &amp; times of lectures &amp; tutorials</td><td>Nhập lịch ngay tuần 1, không phải tuần 5</td><td>Thời khoá biểu trên FAP</td></tr>
<tr><td>3</td><td>Where to go for help</td><td>Biết tên người và kênh liên hệ TRƯỚC khi cần tới</td><td>Email giảng viên, cố vấn học tập, phòng học vụ</td></tr>
<tr><td>4</td><td>Websites</td><td>Những nền tảng môn học thật sự chạy trên đó</td><td>FAP · EduNext · Coursera cho chính môn này</td></tr>
<tr><td>5</td><td>Assessments</td><td>Trọng số và hình thức — mấy ô "Variable" ở slide 11 được điền giá trị tại đây</td><td>Mục "Assessment structure" trong syllabus (% từng đầu điểm)</td></tr>
<tr><td>6</td><td>Expectations</td><td>Quy định điểm danh, mức tham gia, liêm chính học thuật</td><td>Quy định vắng, quy định đạo văn</td></tr>
<tr><td>7</td><td>Marking criteria</td><td>Cái rubric bạn sẽ bị chấm theo — đọc TRƯỚC khi viết, không phải sau</td><td>Đề bài / bảng rubric</td></tr>
<tr><td>8</td><td>Special considerations</td><td>Phải làm gì khi ốm đau hoặc sự cố rơi trúng hạn nộp</td><td>Thủ tục xin hoãn / phúc khảo ở phòng học vụ</td></tr>
</table>
<ul>
<li><strong>Riêng dòng AKA đã đủ vào đề.</strong> "AKA: unit of study outline, syllabus document" — cùng một vật có ba tên tuỳ trường. Sydney gọi "unit of study outline"; FPTU gọi "syllabus"; deck gọi "course outline". Câu hỏi nào đổi tên gọi là đang thử xem bạn có để ý không.</li>
<li><strong>Mục 1, 5 và 7 là ba mục gánh điểm.</strong> Mục tiêu nói cái gì bị kiểm tra, assessments nói trọng số, marking criteria nói từng điểm được cho thế nào. Nếu chỉ đọc ba trên tám mục, hãy đọc ba mục đó.</li>
<li><strong>Mục 8 là mục không ai đọc cho tới khi đã muộn.</strong> "Special considerations" là con đường chính thức khi có chuyện thật sự xảy ra. Biết thủ tục đó tồn tại — và biết hạn của nó — TRƯỚC khi bạn ốm, đó mới là lý do phải đọc đề cương ngay tuần 1.</li>
<li><strong>Slide này là thứ làm mục tiêu 3 trở nên cụ thể.</strong> Từ slide 5 deck đã nói "interpret course outlines"; tới đây nó mới nói bên trong một cái đề cương có gì để mà diễn giải.</li>
<li><strong>Áp dụng ở FPTU — nghi thức 15 phút của tuần 1.</strong> Mở syllabus ra, chép bốn thứ vào MỘT ghi chú: danh sách LO, bảng đầu điểm kèm trọng số, đường dẫn rubric, và tên + email người bạn sẽ liên hệ khi có vấn đề. Ghi chú đó trả lời 90% những câu mà cả kỳ bạn sẽ đi hỏi trong nhóm chat.</li>
</ul>
<p class="meo">💡 Mẹo đếm: <strong>2 tên gọi thay thế + 8 nội dung</strong>. Và thứ tự trên slide không ngẫu nhiên — nó chạy từ trừu tượng (mục tiêu) qua thực dụng (lịch, chỗ xin giúp, website) tới hệ trọng (đầu điểm, kỳ vọng, tiêu chí chấm, trường hợp đặc biệt).</p>
<p class="pitfall">⚠️ "Expectations" (mục 6) và "Marking criteria" (mục 7) là HAI mục RIÊNG trên slide này. Expectations thuộc về hành vi (đi học, không đạo văn); marking criteria là rubric để chấm bài bạn. Gộp hai cái làm một thì ra bảy mục và sai con số.</p>`],

      [15, '2.3a Participating in Lectures, Seminars, & Tutorials (objectives)',
        `<p class="y-chinh">🎯 A new section opens — and the numbering jumps straight from 2.1c to <strong>2.3a</strong>. Two objectives, and both of them quietly contradict the heading.</p>
<table>
<tr><th>#</th><th>Objective (verbatim)</th><th>What it promises</th></tr>
<tr><td>1</td><td>understand the purpose and components of lectures, tutorials, and <strong>online discussion forums</strong></td><td>Purpose + components — three venues named</td></tr>
<tr><td>2</td><td>effectively use readings, course materials, <strong>note-taking</strong>, and communicative strategies in lectures, tutorials, and online forums</td><td>Four tools you must deploy — note-taking is the one slides 16–18 develop</td></tr>
</table>
<ul>
<li><strong>The heading and the objectives disagree, and both are printed on the same slide.</strong> The heading says "Lectures, <em>Seminars</em>, &amp; Tutorials"; the objectives say "lectures, tutorials, and online discussion <em>forums</em>". Seminars are in the title but not the objectives; forums are in the objectives but not the title. Nothing is wrong with your reading — the slide really says both.</li>
<li><strong>Which one wins? Both, in different places.</strong> The summary at slide 19 covers <em>lectures, seminars and tutorials</em> (following the heading), while forums get their own section at 2.3b (slide 20). So the objectives were written across both sections and pasted here.</li>
<li><strong>Objective 2 names four tools in one line:</strong> readings · course materials · note-taking · communicative strategies. Slides 16, 17 and 18 develop the third one; the others are asserted and never expanded in this range.</li>
<li><strong>Section 2.1 was about ANALYSING these contexts; 2.3 is about PARTICIPATING in them.</strong> Same four rooms, different verb. That is the clean way to keep the two sections apart in your head.</li>
<li><strong>Applied at FPTU.</strong> Objective 2 is a to-do list you can audit yourself against right now: do you actually do the readings before class? do you open the posted materials? do you take notes in a structured format? do you say anything out loud? Most students score 1 or 2 out of 4, and slides 16–19 tell you how to fix the third and fourth.</li>
</ul>
<p class="meo">💡 Numbering hook: <strong>2.1 = analyse · 2.3 = participate</strong>. And there is no 2.2 anywhere in slides 1–21 — the jump is real, not a page you skipped.</p>
<p class="pitfall">⚠️ Slide 15 (2.3a) and slide 20 (2.3b) print <strong>the same two objectives</strong>, differing only in "and" versus "&amp;". That is the second wholesale repeat in this range (the first was 2.1a ↔ 2.1c). Identify by the heading, never by the bullets.</p>`,
        `<p class="y-chinh">🎯 Một mục mới mở ra — và số hiệu nhảy thẳng từ 2.1c sang <strong>2.3a</strong>. Hai mục tiêu, và cả hai đều lặng lẽ mâu thuẫn với chính tiêu đề.</p>
<table>
<tr><th>#</th><th>Mục tiêu (nguyên văn)</th><th>Nó hứa gì</th></tr>
<tr><td>1</td><td>understand the purpose and components of lectures, tutorials, and <strong>online discussion forums</strong></td><td>Mục đích + thành phần — ba nơi được gọi tên</td></tr>
<tr><td>2</td><td>effectively use readings, course materials, <strong>note-taking</strong>, and communicative strategies in lectures, tutorials, and online forums</td><td>Bốn công cụ phải triển khai — ghi chép là cái mà slide 16–18 khai triển</td></tr>
</table>
<ul>
<li><strong>Tiêu đề và mục tiêu nói ngược nhau, mà cả hai in trên CÙNG một slide.</strong> Tiêu đề ghi "Lectures, <em>Seminars</em>, &amp; Tutorials"; mục tiêu ghi "lectures, tutorials, and online discussion <em>forums</em>". Seminar có trong tiêu đề mà không có trong mục tiêu; forum có trong mục tiêu mà không có trong tiêu đề. Bạn không đọc nhầm — slide đúng là nói cả hai.</li>
<li><strong>Vậy cái nào thắng? Cả hai, ở hai chỗ khác nhau.</strong> Slide tóm tắt 19 bao <em>lecture, seminar và tutorial</em> (theo tiêu đề), còn forum được cấp mục riêng ở 2.3b (slide 20). Tức là hai mục tiêu này được viết cho CẢ HAI mục rồi dán vào đây.</li>
<li><strong>Mục tiêu 2 gọi tên bốn công cụ trong một dòng:</strong> tài liệu đọc · học liệu của môn · ghi chép · chiến lược giao tiếp. Slide 16, 17 và 18 khai triển cái thứ ba; ba cái còn lại chỉ được nêu mà không mở rộng trong dải này.</li>
<li><strong>Mục 2.1 là PHÂN TÍCH các bối cảnh này; mục 2.3 là THAM GIA vào chúng.</strong> Cùng bốn cái phòng, khác động từ. Đó là cách sạch nhất để giữ hai mục tách nhau trong đầu.</li>
<li><strong>Áp dụng ở FPTU.</strong> Mục tiêu 2 là một danh sách việc mà bạn có thể tự soi ngay lúc này: bạn có thật sự đọc tài liệu trước buổi học không? có mở học liệu đã đăng không? có ghi chép theo một khuôn nào không? có nói ra miệng câu nào không? Phần lớn sinh viên được 1 hoặc 2 trên 4, và slide 16–19 chỉ cách vá cái thứ ba với thứ tư.</li>
</ul>
<p class="meo">💡 Mẹo nhớ số hiệu: <strong>2.1 = phân tích · 2.3 = tham gia</strong>. Và không có 2.2 ở bất cứ đâu trong slide 1–21 — cú nhảy là có thật, không phải bạn lỡ trang nào.</p>
<p class="pitfall">⚠️ Slide 15 (2.3a) và slide 20 (2.3b) in <strong>CÙNG HAI MỤC TIÊU</strong>, chỉ khác "and" với "&amp;". Đó là chỗ lặp nguyên khối thứ hai trong dải này (chỗ thứ nhất là 2.1a ↔ 2.1c). Nhận dạng bằng tiêu đề, đừng bao giờ bằng gạch đầu dòng.</p>`],

      [16, 'Outline format for note-taking (Aish & Tomlinson, 2013)',
        `<p class="y-chinh">🎯 The first of two named note-taking systems: the <strong>outline format</strong> — numbered main points, lettered sub-points, roman-numbered sub-sub-points, cited to Aish &amp; Tomlinson (2013).</p>
<table>
<tr><th>Level</th><th>Marker on the slide</th><th>What goes there</th></tr>
<tr><td>1</td><td>1. 2. 3.</td><td>Main points — the sections of the lecture</td></tr>
<tr><td>2</td><td>a. b.</td><td>Sub-points — the claims inside a section</td></tr>
<tr><td>3</td><td>i. ii.</td><td>Sub-sub-points — evidence, examples, formulas</td></tr>
</table>
<p class="nhan">Beyond the slide — the same skeleton filled with real content, because the slide only shows the empty shape. A lecture on the rhetorical situation, taken in outline format:</p>
<pre>1. Rhetorical situation = full set of circumstances (Lunsford 2013, p.48)
   a. Six elements
      i. Author, Audience, Place, Purpose
      ii. Social/political influences, Media
   b. Expectations SHIFT with context — no universal "good writing"
2. Four university contexts
   a. Lecture — one-way, lecturer is author
   b. Tutorial — two-way, TA + students, problem sets
   c. Seminar — two-way, lecturer + students, readings + debate
   d. Assessment — STUDENT is author, purpose = demonstrate learning
3. Course outline = where the "Variable" fields get their values
   ??? is the rubric always published in advance? → ask in tutorial</pre>
<ul>
<li><strong>Indentation carries the meaning.</strong> The format encodes hierarchy visually, so a glance at your own notes six weeks later tells you what was a main claim and what was a supporting example — information that flat prose notes lose completely.</li>
<li><strong>It suits lectures with a clear structure.</strong> If the lecturer says "there are three things", outline format writes itself. If the lecture rambles, this format fights you — which is exactly why the next slide offers a second one.</li>
<li><strong>Main points 2 and 3 on the slide have no sub-points.</strong> That is honest: not every section generates sub-points, and you are not required to fill every level.</li>
<li><strong>Mark your own gaps inside the outline.</strong> The "???" line in the example above is not part of Aish &amp; Tomlinson — it is the habit that turns notes into tutorial questions, which is slide 18's third bullet.</li>
<li><strong>Applied at FPTU.</strong> Outline format is the natural fit for technical lectures: "1. TCP handshake / a. SYN / b. SYN-ACK / c. ACK". Type it straight into a plain note; the numbering survives copy-paste into anything, unlike a hand-drawn mind map.</li>
</ul>
<p class="meo">💡 Three levels, three different markers: <strong>number → letter → roman numeral</strong> (1 → a → i). If an exam option shows all three levels using numbers, it is not the outline format as printed here.</p>
<p class="pitfall">⚠️ Two oddities printed on the slide itself, left as they are: the third-level items are labelled "Sub-point 1" and "Sub-point 2" — the <em>same labels</em> as the second level, which makes the picture confusing; and "i.Sub-point 1" is printed with <strong>no space after "i."</strong>. Both are slide typography, not part of the method.</p>`,
        `<p class="y-chinh">🎯 Cái đầu tiên trong hai hệ ghi chép được gọi tên: <strong>outline format</strong> — ý chính đánh số, ý phụ đánh chữ cái, ý phụ của ý phụ đánh số La Mã, trích Aish &amp; Tomlinson (2013).</p>
<table>
<tr><th>Cấp</th><th>Ký hiệu trên slide</th><th>Chỗ đó ghi gì</th></tr>
<tr><td>1</td><td>1. 2. 3.</td><td>Ý chính — các phần của buổi giảng</td></tr>
<tr><td>2</td><td>a. b.</td><td>Ý phụ — các luận điểm bên trong một phần</td></tr>
<tr><td>3</td><td>i. ii.</td><td>Ý phụ của ý phụ — bằng chứng, ví dụ, công thức</td></tr>
</table>
<p class="nhan">Phần MỞ RỘNG ngoài slide — vẫn bộ xương đó nhưng đã điền nội dung thật, vì slide chỉ cho thấy cái khuôn rỗng. Một buổi giảng về tình huống tu từ, ghi theo outline format:</p>
<pre>1. Tình huống tu từ = toàn bộ hoàn cảnh bao quanh (Lunsford 2013, tr.48)
   a. Sáu yếu tố
      i. Author, Audience, Place, Purpose
      ii. Social/political influences, Media
   b. Kỳ vọng DỊCH CHUYỂN theo bối cảnh — không có "viết hay" phổ quát
2. Bốn bối cảnh ở đại học
   a. Lecture — một chiều, tác giả là giảng viên
   b. Tutorial — hai chiều, TA + sinh viên, bộ bài tập
   c. Seminar — hai chiều, giảng viên + sinh viên, bài đọc + tranh luận
   d. Assessment — SINH VIÊN là tác giả, mục đích = chứng minh đã học
3. Đề cương môn học = nơi mấy ô "Variable" được điền giá trị
   ??? rubric có luôn được công bố trước không? → hỏi ở buổi tutorial</pre>
<ul>
<li><strong>Chính khoảng thụt đầu dòng gánh ý nghĩa.</strong> Khuôn này mã hoá thứ bậc bằng thị giác, nên sáu tuần sau liếc vào ghi chép của chính mình là biết ngay đâu là luận điểm chính, đâu là ví dụ minh hoạ — thông tin mà ghi chép dạng văn xuôi làm mất sạch.</li>
<li><strong>Nó hợp với những buổi giảng có cấu trúc rõ.</strong> Giảng viên nói "có ba điều" thì outline tự viết ra. Buổi giảng lan man thì khuôn này chống lại bạn — và đó chính là lý do slide kế tiếp đưa ra một khuôn thứ hai.</li>
<li><strong>Ý chính 2 và 3 trên slide không có ý phụ nào.</strong> Đó là sự trung thực: không phải phần nào cũng sinh ra ý phụ, và bạn không bắt buộc phải điền đủ mọi cấp.</li>
<li><strong>Đánh dấu chỗ mình hổng ngay trong dàn ý.</strong> Dòng "???" trong ví dụ trên không thuộc Aish &amp; Tomlinson — nó là thói quen biến ghi chép thành câu hỏi cho buổi tutorial, đúng gạch đầu dòng thứ ba của slide 18.</li>
<li><strong>Áp dụng ở FPTU.</strong> Outline format hợp tự nhiên với các buổi giảng kỹ thuật: "1. Bắt tay TCP / a. SYN / b. SYN-ACK / c. ACK". Gõ thẳng vào ghi chú văn bản thuần; cách đánh số sống sót qua mọi lần chép dán, khác hẳn sơ đồ tư duy vẽ tay.</li>
</ul>
<p class="meo">💡 Ba cấp, ba loại ký hiệu khác nhau: <strong>số → chữ cái → số La Mã</strong> (1 → a → i). Đáp án nào cho cả ba cấp đều dùng số thì không phải outline format như in ở đây.</p>
<p class="pitfall">⚠️ Hai chỗ kỳ cục in trên chính slide, giữ nguyên không sửa: các mục cấp ba được đặt nhãn "Sub-point 1" và "Sub-point 2" — <em>trùng nhãn</em> với cấp hai, làm hình vẽ rối; và dòng "i.Sub-point 1" in <strong>THIẾU DẤU CÁCH sau "i."</strong>. Cả hai là lỗi trình bày của slide, không phải một phần của phương pháp.</p>`],

      [17, 'Cornell method for note-taking (Aish & Tomlinson, 2013)',
        `<p class="y-chinh">🎯 The second named system, and the opposite shape: a <strong>two-column table</strong> — a narrow left column for the main idea as a key word or phrase, a wide right column for the definition, explanation, formula, key questions for analysis, examples, etc.</p>
<table>
<tr><th>Column</th><th>The slide's wording (verbatim)</th><th>What actually goes in it</th></tr>
<tr><td>Left (narrow)</td><td>Main Idea 1 / Main Idea 2 (key word or phrase)</td><td>ONE term per row. The cue you will read first when revising</td></tr>
<tr><td>Right (wide)</td><td>Definition, explanation, formula, key questions for analysis, examples, etc.</td><td>Everything else — five kinds of content named on the slide</td></tr>
</table>
<p class="nhan">Beyond the slide — the same table filled in, on this very lesson's content:</p>
<table>
<tr><th>Main idea (key word)</th><th>Definition · explanation · questions · examples</th></tr>
<tr><td>Rhetorical situation</td><td>"the full set of circumstances surrounding any communication" (Lunsford 2013, p.48). Six elements: Author · Audience · Place · Purpose · Social+political · Media. Q: why do slides 8–11 only use five?</td></tr>
<tr><td>One-way interaction</td><td>Media line of the Lectures slide only. Info flows lecturer → students. Ex: 400-seat theatre. Q: does a recorded lecture change this?</td></tr>
<tr><td>Demonstrating learning</td><td>Purpose of assessments. Not inform, not debate — show evidence against criteria. Ex: SWP391 defence. Q: where is the rubric published?</td></tr>
</table>
<ul>
<li><strong>The left column is what makes it a revision tool, not just a record.</strong> Cover the right column and the key words become self-test prompts. That is the whole reason the method exists, and no other format on these slides does it.</li>
<li><strong>The right column is a list of five content types, not one.</strong> Definition · explanation · formula · key questions for analysis · examples. "Key questions" being in there means the method expects you to write your own questions as you go — the same habit slide 18 asks for.</li>
<li><strong>Outline versus Cornell: hierarchy versus retrieval.</strong> Outline format captures <em>structure</em> (what sits under what); Cornell captures <em>cues</em> (what triggers what). Use outline when the lecture is well organised, Cornell when you know you will need to self-test later.</li>
<li><strong>Applied at FPTU.</strong> Cornell is unbeatable for definition-heavy, multiple-choice-assessed courses — which is exactly what SSL101c is. Make one Cornell sheet per Mooc, one row per named concept, and revise by covering the right column. For a 60-minute multiple-choice exam across five Moocs, that sheet <em>is</em> your revision.</li>
</ul>
<p class="meo">💡 Cornell = <strong>2 columns</strong>; outline format = <strong>3 levels</strong>. Both are cited to Aish &amp; Tomlinson (2013) — the same source for both methods, which is itself a cheap exam fact.</p>
<p class="pitfall">⚠️ The real Cornell method taught elsewhere has <strong>three</strong> zones (cue column, note-taking area, and a summary strip along the bottom). The slide prints only <strong>two</strong> columns and no summary strip. Answer from the slide: two columns. If you have met the three-zone version before, do not "correct" the exam with it.</p>`,
        `<p class="y-chinh">🎯 Hệ thứ hai được gọi tên, và có hình dạng ngược hẳn: một <strong>bảng HAI CỘT</strong> — cột trái hẹp ghi ý chính dưới dạng từ khoá hoặc cụm từ, cột phải rộng ghi định nghĩa, giải thích, công thức, câu hỏi phân tích then chốt, ví dụ, v.v.</p>
<table>
<tr><th>Cột</th><th>Chữ trên slide (nguyên văn)</th><th>Thật ra ghi gì vào đó</th></tr>
<tr><td>Trái (hẹp)</td><td>Main Idea 1 / Main Idea 2 (key word or phrase)</td><td>MỘT thuật ngữ mỗi dòng. Đây là cái mồi bạn sẽ đọc trước tiên khi ôn</td></tr>
<tr><td>Phải (rộng)</td><td>Definition, explanation, formula, key questions for analysis, examples, etc.</td><td>Mọi thứ còn lại — slide gọi tên NĂM loại nội dung</td></tr>
</table>
<p class="nhan">Phần MỞ RỘNG ngoài slide — vẫn bảng đó nhưng đã điền, bằng chính nội dung của bài này:</p>
<table>
<tr><th>Ý chính (từ khoá)</th><th>Định nghĩa · giải thích · câu hỏi · ví dụ</th></tr>
<tr><td>Rhetorical situation</td><td>"the full set of circumstances surrounding any communication" (Lunsford 2013, tr.48). Sáu yếu tố: Author · Audience · Place · Purpose · Social+political · Media. Hỏi: sao slide 8–11 chỉ dùng năm?</td></tr>
<tr><td>One-way interaction</td><td>Chỉ có ở dòng Media của slide Lectures. Thông tin chảy giảng viên → sinh viên. Vd: giảng đường 400 chỗ. Hỏi: lecture có ghi hình thì điều này đổi không?</td></tr>
<tr><td>Demonstrating learning</td><td>Mục đích của bài đánh giá. Không phải cung cấp tin, không phải tranh luận — mà trưng bằng chứng đối chiếu tiêu chí. Vd: bảo vệ SWP391. Hỏi: rubric công bố ở đâu?</td></tr>
</table>
<ul>
<li><strong>Cột trái mới là thứ biến nó thành công cụ ÔN TẬP, không chỉ là bản ghi.</strong> Che cột phải đi thì các từ khoá trở thành đề tự kiểm. Đó là toàn bộ lý do phương pháp này tồn tại, và không khuôn nào khác trong bộ slide làm được.</li>
<li><strong>Cột phải là một danh sách NĂM loại nội dung, không phải một.</strong> Định nghĩa · giải thích · công thức · câu hỏi phân tích then chốt · ví dụ. Việc "câu hỏi" nằm trong đó nghĩa là phương pháp này CHỜ ĐỢI bạn tự viết câu hỏi trong lúc ghi — đúng thói quen slide 18 đòi hỏi.</li>
<li><strong>Outline so với Cornell: thứ bậc so với gợi nhớ.</strong> Outline format bắt lấy <em>CẤU TRÚC</em> (cái gì nằm dưới cái gì); Cornell bắt lấy <em>ĐẦU MỐI</em> (cái gì gọi ra cái gì). Dùng outline khi buổi giảng có tổ chức tốt, dùng Cornell khi bạn biết sau này mình sẽ phải tự kiểm.</li>
<li><strong>Áp dụng ở FPTU.</strong> Cornell vô đối với những môn nặng định nghĩa và thi trắc nghiệm — tức là đúng SSL101c. Làm một tờ Cornell cho mỗi Mooc, mỗi khái niệm được gọi tên là một dòng, và ôn bằng cách che cột phải. Với một bài thi trắc nghiệm 60 phút phủ cả năm Mooc, tờ giấy đó <em>chính là</em> cách ôn của bạn.</li>
</ul>
<p class="meo">💡 Cornell = <strong>2 cột</strong>; outline format = <strong>3 cấp</strong>. Cả hai đều trích Aish &amp; Tomlinson (2013) — cùng MỘT nguồn cho cả hai phương pháp, bản thân đó đã là một dữ kiện dễ ăn điểm.</p>
<p class="pitfall">⚠️ Phương pháp Cornell thật, dạy ở nơi khác, có <strong>BA</strong> vùng (cột gợi nhớ, vùng ghi chép, và một dải tóm tắt chạy dọc dưới đáy). Slide này chỉ in <strong>HAI</strong> cột và không có dải tóm tắt. Hãy trả lời theo SLIDE: hai cột. Nếu bạn từng gặp bản ba vùng ở đâu đó thì đừng đem nó đi "sửa" đề thi.</p>`],

      [18, 'Note-taking in lectures — four rules',
        `<p class="y-chinh">🎯 The practical rules that sit on top of the two formats: <strong>four</strong> bullets, three of them carrying a citation, and together they define what a lecture is actually for.</p>
<table>
<tr><th>#</th><th>The rule (verbatim)</th><th>Citation</th><th>Why it is there</th></tr>
<tr><td>1</td><td>Take notes on main ideas, processes, arguments, and formulas</td><td>Reinders, Moore, &amp; Lewis, 2008</td><td>FOUR things to capture — and transcription is not one of them</td></tr>
<tr><td>2</td><td>Try using different styles of note-taking</td><td>Aish &amp; Tomlinson, 2013</td><td>Why slides 16 and 17 gave you two formats, not one</td></tr>
<tr><td>3</td><td>Write down any questions you have for the tutorial or seminar</td><td>—</td><td>The bridge from one-way (lecture) to two-way (tutorial/seminar)</td></tr>
<tr><td>4</td><td>Use lecture materials as a supplement to your own notes and attendance</td><td>—</td><td>Posted slides are a SUPPLEMENT, not a substitute</td></tr>
</table>
<ul>
<li><strong>Rule 1 names exactly four targets: main ideas · processes · arguments · formulas.</strong> Notice what is absent — words, sentences, everything the lecturer said. The instruction is to capture <em>structure and reasoning</em>, not speech. A student typing every sentence is following no rule on this slide.</li>
<li><strong>Rule 3 is the most actionable line in the whole lesson.</strong> The lecture is one-way (slide 8) and the tutorial is two-way (slide 9); a written question is the object you carry from one to the other. Without it you arrive at the tutorial with nothing to say and leave with nothing gained.</li>
<li><strong>Rule 4 settles the "slides are posted, why attend?" argument.</strong> The deck's answer: posted materials supplement <em>your notes AND your attendance</em> — both are assumed to exist. Slides are somebody else's summary of their own talk; they do not contain what you did not understand.</li>
<li><strong>Rule 2 is permission to be inconsistent.</strong> Different lectures, different formats. Trying Cornell in a maths lecture and outline in a theory lecture is not indecision, it is the instruction.</li>
<li><strong>Applied at FPTU.</strong> Concrete routine for one FPTU lecture: page split Cornell-style, left column for terms, right for explanation; every time you lose the thread, write a "?" line instead of panicking; at the end, circle the two best "?" lines and bring them to the lab or tutorial. Two questions per week, twelve weeks — that is twenty-four gaps closed that would otherwise have surfaced in the exam.</li>
</ul>
<p class="meo">💡 Count hook: rule 1 lists <strong>four</strong> things to capture, and the slide itself has <strong>four</strong> rules. Two different fours — do not merge them. And three separate sources appear in this area: Reinders/Moore/Lewis 2008, Aish &amp; Tomlinson 2013, Brick/Herke/Wong 2016.</p>
<p class="pitfall">⚠️ Rule 4 is frequently misremembered as "you do not need to attend if materials are posted" — it says the exact opposite. The words are "as a <em>supplement</em> to your own notes <em>and attendance</em>".</p>`,
        `<p class="y-chinh">🎯 Những quy tắc thực hành nằm trên hai cái khuôn kia: <strong>BỐN</strong> gạch đầu dòng, ba trong số đó có trích nguồn, và gộp lại chúng định nghĩa buổi lecture thật sự để làm gì.</p>
<table>
<tr><th>#</th><th>Quy tắc (nguyên văn)</th><th>Trích nguồn</th><th>Vì sao có nó</th></tr>
<tr><td>1</td><td>Take notes on main ideas, processes, arguments, and formulas</td><td>Reinders, Moore, &amp; Lewis, 2008</td><td>BỐN thứ phải chộp lấy — và chép nguyên văn không nằm trong số đó</td></tr>
<tr><td>2</td><td>Try using different styles of note-taking</td><td>Aish &amp; Tomlinson, 2013</td><td>Lý do slide 16 và 17 cho bạn hai khuôn chứ không phải một</td></tr>
<tr><td>3</td><td>Write down any questions you have for the tutorial or seminar</td><td>—</td><td>Cây cầu nối từ một chiều (lecture) sang hai chiều (tutorial/seminar)</td></tr>
<tr><td>4</td><td>Use lecture materials as a supplement to your own notes and attendance</td><td>—</td><td>Slide được đăng là thứ BỔ SUNG, không phải thứ THAY THẾ</td></tr>
</table>
<ul>
<li><strong>Quy tắc 1 gọi tên đúng bốn đích ngắm: ý chính · quy trình · lập luận · công thức.</strong> Hãy để ý cái VẮNG MẶT — từ ngữ, câu cú, mọi thứ giảng viên đã nói. Chỉ dẫn là chộp lấy <em>cấu trúc và lập luận</em>, không phải lời nói. Sinh viên gõ lại từng câu là đang không theo quy tắc nào trên slide này.</li>
<li><strong>Quy tắc 3 là dòng hành động được nhất trong cả bài.</strong> Lecture là một chiều (slide 8) còn tutorial là hai chiều (slide 9); một câu hỏi đã viết ra chính là VẬT bạn mang từ bên này sang bên kia. Không có nó thì bạn tới tutorial không có gì để nói và ra về không được gì.</li>
<li><strong>Quy tắc 4 kết thúc cuộc tranh cãi "slide đăng rồi, đi học làm gì?".</strong> Câu trả lời của deck: học liệu đăng lên là thứ bổ sung cho <em>ghi chép của BẠN VÀ việc bạn có mặt</em> — cả hai đều được mặc định là đã có. Slide là bản tóm tắt của người khác về chính bài nói của họ; nó không chứa thứ mà bạn chưa hiểu.</li>
<li><strong>Quy tắc 2 là lời cho phép được thiếu nhất quán.</strong> Buổi giảng khác nhau, khuôn ghi khác nhau. Thử Cornell ở buổi toán và outline ở buổi lý thuyết không phải là do dự, đó là làm đúng chỉ dẫn.</li>
<li><strong>Áp dụng ở FPTU.</strong> Thói quen cụ thể cho một buổi lecture: chia đôi trang kiểu Cornell, cột trái ghi thuật ngữ, cột phải ghi giải thích; mỗi lần tuột mạch thì viết một dòng "?" thay vì hoảng; cuối buổi khoanh hai dòng "?" đáng nhất và mang tới buổi lab hoặc tutorial. Hai câu mỗi tuần, mười hai tuần — là hai mươi bốn lỗ hổng được vá mà lẽ ra chúng sẽ nổi lên trong phòng thi.</li>
</ul>
<p class="meo">💡 Mẹo đếm: quy tắc 1 liệt kê <strong>bốn</strong> thứ phải ghi, và bản thân slide có <strong>bốn</strong> quy tắc. Hai con số bốn khác nhau — đừng gộp. Và có ba nguồn riêng biệt xuất hiện quanh khu vực này: Reinders/Moore/Lewis 2008, Aish &amp; Tomlinson 2013, Brick/Herke/Wong 2016.</p>
<p class="pitfall">⚠️ Quy tắc 4 rất hay bị nhớ nhầm thành "slide đăng rồi thì không cần đi học" — nó nói ngược lại đúng một trăm phần trăm. Nguyên văn là "as a <em>supplement</em> to your own notes <em>and attendance</em>".</p>`],

      [19, 'Summary: Participating in lectures, seminars, & tutorials — preparation vs participation',
        `<p class="y-chinh">🎯 The section's closing summary, and the cleanest grid in the deck: <strong>three</strong> contexts × <strong>two</strong> headings (Preparation · Participation) = six instructions.</p>
<table>
<tr><th>Context</th><th>Preparation</th><th>Participation</th></tr>
<tr><td><strong>Lectures</strong></td><td>Review readings <em>before and after</em> the lecture</td><td>Take notes and ask questions, <em>if appropriate</em></td></tr>
<tr><td><strong>Seminars</strong></td><td>Read <em>in detail</em>; prepare questions and observations (Brick, Herke, &amp; Wong, 2016)</td><td>Actively participate in discussions; set <em>small, achievable personal goals</em> to build your confidence</td></tr>
<tr><td><strong>Tutorials</strong></td><td>Keep up with course content; be aware of <em>your areas of difficulty</em></td><td>Complete activities and problem sets; ask questions</td></tr>
</table>
<ul>
<li><strong>Every row has exactly two lines, and the pair is the teaching point.</strong> Preparation happens before the room; participation happens inside it. A student who only ever does the second half is improvising, and a student who only does the first half is invisible.</li>
<li><strong>"if appropriate" appears only under Lectures.</strong> That hedge is the one-way nature of a lecture showing up again — in a 400-seat theatre, interrupting may genuinely not be appropriate. Under seminars and tutorials there is no hedge: participation is unconditional.</li>
<li><strong>"Small, achievable personal goals to build your confidence" is the only advice on this slide aimed at fear rather than technique.</strong> It is deliberately concrete: not "be confident" but "set a goal small enough to hit". One sentence per seminar is a legitimate goal; two next week.</li>
<li><strong>The three preparations are three different verbs.</strong> Lectures: <em>review</em> (light, both sides of the class). Seminars: <em>read in detail</em> and arrive with questions AND observations. Tutorials: <em>keep up</em> and diagnose your own weak spots. Only the seminar row demands depth.</li>
<li><strong>Applied at FPTU.</strong> Turn the middle cell into this week's plan. Seminar-type session: read the paper, write one observation ("the paper assumes X but our project cannot") and one question. Tutorial-type session: attempt the problem set and mark the two you could not do — "be aware of your areas of difficulty" means <em>name them</em>, not feel bad about them. Personal goal: speak once, in any language, before the halfway break.</li>
</ul>
<p class="meo">💡 Grid hook: <strong>3 contexts × 2 headings = 6 cells</strong>, and the heading pair is always <em>Preparation then Participation</em>, in that order, for all three. The one word that breaks the pattern is "if appropriate", and it sits in the Lectures row.</p>
<p class="pitfall">⚠️⚠️ This summary <strong>drops everything slides 16–18 taught</strong>. Outline format, the Cornell method and the four note-taking rules do not appear anywhere on it — "take notes" is the only trace, and it is four words long. Anyone who revises 2.3a from the summary slide alone will walk into the exam not knowing Aish &amp; Tomlinson or the two note formats. Revise from slides 16–18, not from slide 19. Note also that <strong>online forums are missing here too</strong> despite being named in the section's own objectives — they come next, in 2.3b.</p>`,
        `<p class="y-chinh">🎯 Slide khép mục, và là cái lưới gọn nhất deck: <strong>BA</strong> bối cảnh × <strong>HAI</strong> đề mục (Preparation · Participation) = sáu chỉ dẫn.</p>
<table>
<tr><th>Bối cảnh</th><th>Preparation (chuẩn bị)</th><th>Participation (tham gia)</th></tr>
<tr><td><strong>Lectures</strong></td><td>Xem lại tài liệu đọc <em>TRƯỚC VÀ SAU</em> buổi giảng</td><td>Ghi chép và đặt câu hỏi, <em>nếu phù hợp</em></td></tr>
<tr><td><strong>Seminars</strong></td><td>Đọc <em>KỸ</em>; chuẩn bị sẵn câu hỏi và nhận xét (Brick, Herke, &amp; Wong, 2016)</td><td>Tham gia thảo luận chủ động; đặt <em>mục tiêu cá nhân nhỏ, làm được</em> để xây dựng sự tự tin</td></tr>
<tr><td><strong>Tutorials</strong></td><td>Theo kịp nội dung môn học; biết rõ <em>những chỗ mình đang yếu</em></td><td>Làm xong hoạt động và bộ bài tập; đặt câu hỏi</td></tr>
</table>
<ul>
<li><strong>Mỗi hàng có đúng hai dòng, và chính CẶP đó là điểm dạy.</strong> Chuẩn bị xảy ra trước khi vào phòng; tham gia xảy ra bên trong phòng. Sinh viên chỉ làm nửa sau là đang ứng biến, còn sinh viên chỉ làm nửa đầu thì vô hình.</li>
<li><strong>Cụm "if appropriate" chỉ xuất hiện ở hàng Lectures.</strong> Cái rào đón đó chính là tính MỘT CHIỀU của lecture lộ ra lần nữa — trong giảng đường 400 chỗ, cắt ngang có thể thật sự không phù hợp. Ở hàng seminar và tutorial không có rào đón nào: tham gia là vô điều kiện.</li>
<li><strong>"Small, achievable personal goals to build your confidence" là lời khuyên DUY NHẤT trên slide nhắm vào nỗi sợ chứ không vào kỹ thuật.</strong> Nó cố ý cụ thể: không phải "hãy tự tin lên" mà là "đặt mục tiêu nhỏ đủ để đạt được". Một câu phát biểu mỗi buổi seminar là mục tiêu hợp lệ; tuần sau lên hai câu.</li>
<li><strong>Ba phần chuẩn bị là ba động từ khác nhau.</strong> Lecture: <em>xem lại</em> (nhẹ, cả hai đầu buổi học). Seminar: <em>đọc kỹ</em> và đến với CẢ câu hỏi LẪN nhận xét. Tutorial: <em>theo kịp</em> và tự chẩn đoán chỗ yếu. Chỉ hàng seminar đòi chiều sâu.</li>
<li><strong>Áp dụng ở FPTU.</strong> Biến ô giữa thành kế hoạch tuần này. Buổi kiểu seminar: đọc bài báo, viết một nhận xét ("bài này giả định X nhưng đồ án của nhóm mình không làm thế được") và một câu hỏi. Buổi kiểu tutorial: thử làm bộ bài tập và đánh dấu hai câu không làm được — "be aware of your areas of difficulty" nghĩa là <em>GỌI TÊN</em> chúng ra, không phải ngồi buồn vì chúng. Mục tiêu cá nhân: nói một lần, bằng bất cứ thứ tiếng nào, trước giờ giải lao.</li>
</ul>
<p class="meo">💡 Mẹo nhớ lưới: <strong>3 bối cảnh × 2 đề mục = 6 ô</strong>, và cặp đề mục luôn là <em>Preparation rồi Participation</em>, đúng thứ tự đó, cho cả ba hàng. Chữ duy nhất phá vỡ khuôn mẫu là "if appropriate", và nó nằm ở hàng Lectures.</p>
<p class="pitfall">⚠️⚠️ Slide tóm tắt này <strong>BỎ RƠI toàn bộ thứ slide 16–18 đã dạy</strong>. Outline format, phương pháp Cornell và bốn quy tắc ghi chép không xuất hiện ở bất cứ đâu trên đó — "take notes" là dấu vết duy nhất, dài đúng hai chữ. Ai ôn mục 2.3a chỉ bằng slide tóm tắt sẽ bước vào phòng thi mà không biết Aish &amp; Tomlinson lẫn hai khuôn ghi chép. Hãy ôn từ slide 16–18, đừng ôn từ slide 19. Cũng để ý: <strong>diễn đàn trực tuyến cũng vắng mặt ở đây</strong> dù được gọi tên ngay trong mục tiêu của chính mục này — chúng nằm ở ngay sau, mục 2.3b.</p>`],

      [20, '2.3b Participating in Online Forums (objectives — identical to 2.3a)',
        `<p class="y-chinh">🎯 A new section for the one context the previous summary left out — online forums. And its <strong>two objectives are the same two as slide 15</strong>, differing only by "and" becoming "&amp;".</p>
<table>
<tr><th>#</th><th>Slide 15 (2.3a)</th><th>Slide 20 (2.3b)</th></tr>
<tr><td>1</td><td>understand the purpose <strong>and</strong> components of lectures, tutorials, <strong>and</strong> online discussion forums</td><td>understand the purpose <strong>&amp;</strong> components of lectures, tutorials, <strong>&amp;</strong> online discussion forums</td></tr>
<tr><td>2</td><td>…note-taking, <strong>and</strong> communicative strategies in lectures, tutorials, <strong>and</strong> online forums</td><td>…note-taking, <strong>&amp;</strong> communicative strategies in lectures, tutorials, <strong>&amp;</strong> online forums</td></tr>
</table>
<ul>
<li><strong>The difference is purely typographic.</strong> Nothing conceptual was added when the section changed. This is the second wholesale repeat in the range, after 2.1a ↔ 2.1c, and it confirms the pattern: in this deck, objectives slides are boilerplate.</li>
<li><strong>Now the mismatch on slide 15 makes sense.</strong> Slide 15's heading named seminars while its objectives named forums — because these objectives were written to cover 2.3a and 2.3b together, then pasted onto both. The forum half of them is delivered here.</li>
<li><strong>"Online discussion forums" is the only context in this whole range that is written, asynchronous and permanent.</strong> Lectures, tutorials and seminars are all spoken and live. That is the real reason forums need their own section: every element of the rhetorical situation shifts at once — media, place, and the fact that your words stay up.</li>
<li><strong>This slide also has the truncated footer.</strong> No crest, and the page label at bottom-right is cut off mid-word. Same export batch as slides 13, 14 and 21.</li>
<li><strong>Applied at FPTU.</strong> Your forums are EduNext threads, the Coursera discussion boards for this very MOOC, and any class Facebook/Discord group your lecturer reads. Asynchronous means you get something no live context gives you: <em>time to edit before you speak</em>. Permanent means you must use it.</li>
</ul>
<p class="meo">💡 Both repeated objective pairs in this range follow the same rule: <strong>the heading is the only reliable identifier</strong>. 2.1a ↔ 2.1c are identical; 2.3a ↔ 2.3b are identical but for ampersands.</p>
<p class="pitfall">⚠️ Do not conclude from the repeat that 2.3a and 2.3b teach the same thing. They share objectives and share nothing else: 2.3a delivered note-taking (slides 16–18), 2.3b delivers forums (slide 21 onwards). Identical objectives, disjoint content.</p>`,
        `<p class="y-chinh">🎯 Một mục mới cho đúng cái bối cảnh mà slide tóm tắt vừa rồi bỏ quên — diễn đàn trực tuyến. Và <strong>hai mục tiêu của nó y hệt hai mục tiêu ở slide 15</strong>, chỉ khác mỗi chữ "and" đổi thành "&amp;".</p>
<table>
<tr><th>#</th><th>Slide 15 (2.3a)</th><th>Slide 20 (2.3b)</th></tr>
<tr><td>1</td><td>understand the purpose <strong>and</strong> components of lectures, tutorials, <strong>and</strong> online discussion forums</td><td>understand the purpose <strong>&amp;</strong> components of lectures, tutorials, <strong>&amp;</strong> online discussion forums</td></tr>
<tr><td>2</td><td>…note-taking, <strong>and</strong> communicative strategies in lectures, tutorials, <strong>and</strong> online forums</td><td>…note-taking, <strong>&amp;</strong> communicative strategies in lectures, tutorials, <strong>&amp;</strong> online forums</td></tr>
</table>
<ul>
<li><strong>Khác biệt thuần tuý là chuyện chữ nghĩa.</strong> Không có khái niệm nào được thêm vào khi đổi mục. Đây là chỗ lặp nguyên khối thứ hai trong dải, sau 2.1a ↔ 2.1c, và nó xác nhận quy luật: trong deck này, slide mục tiêu là hàng khuôn mẫu.</li>
<li><strong>Đến đây thì chỗ lệch ở slide 15 mới có lời giải.</strong> Tiêu đề slide 15 gọi tên seminar còn mục tiêu lại gọi tên forum — vì bộ mục tiêu này được viết để bao CẢ 2.3a LẪN 2.3b, rồi dán lên cả hai. Nửa phần forum của chúng được giao ở đây.</li>
<li><strong>"Online discussion forums" là bối cảnh DUY NHẤT trong cả dải này mang tính viết, bất đồng bộ và lưu vĩnh viễn.</strong> Lecture, tutorial và seminar đều là nói và diễn ra trực tiếp. Đó mới là lý do thật khiến forum cần mục riêng: mọi yếu tố của tình huống tu từ dịch chuyển cùng lúc — phương tiện, nơi chốn, và chuyện lời bạn viết còn nằm đó mãi.</li>
<li><strong>Slide này cũng mang chân trang bị cụt.</strong> Không huy hiệu, và nhãn số trang ở góc dưới phải bị cắt giữa chừng. Cùng lượt xuất file với slide 13, 14 và 21.</li>
<li><strong>Áp dụng ở FPTU.</strong> Diễn đàn của bạn là các luồng EduNext, khu thảo luận trên Coursera của chính MOOC này, và mọi nhóm Facebook/Discord lớp mà giảng viên có đọc. Bất đồng bộ nghĩa là bạn có được thứ mà không bối cảnh trực tiếp nào cho: <em>thời gian để sửa trước khi nói</em>. Lưu vĩnh viễn nghĩa là bạn BẮT BUỘC phải dùng thời gian đó.</li>
</ul>
<p class="meo">💡 Cả hai cặp mục tiêu bị lặp trong dải này đều theo cùng một luật: <strong>tiêu đề là dấu hiệu nhận dạng đáng tin duy nhất</strong>. 2.1a ↔ 2.1c giống hệt; 2.3a ↔ 2.3b giống hệt trừ mấy dấu &amp;.</p>
<p class="pitfall">⚠️ Đừng từ chỗ lặp mà kết luận 2.3a và 2.3b dạy cùng một thứ. Chúng dùng chung mục tiêu và không dùng chung gì khác: 2.3a giao phần ghi chép (slide 16–18), 2.3b giao phần diễn đàn (từ slide 21 trở đi). Mục tiêu trùng khít, nội dung rời nhau hoàn toàn.</p>`],

      [21, 'Purpose — Question & answer forums (Adapted from Cottrell & Morris, 2012)',
        `<p class="y-chinh">🎯 The last slide of this lesson, and it describes <strong>one</strong> kind of forum: the <em>Question &amp; answer forum</em>, with <strong>five</strong> characteristics, adapted from Cottrell &amp; Morris (2012).</p>
<table>
<tr><th>#</th><th>Characteristic (verbatim)</th><th>What it tells you to do</th></tr>
<tr><td>1</td><td>Administrative questions</td><td>Deadlines, room changes, submission formats — logistics, not content</td></tr>
<tr><td>2</td><td>Frequently asked questions (FAQs)</td><td><strong>Search before you post.</strong> If it is frequently asked, your answer is already there</td></tr>
<tr><td>3</td><td>Straightforward</td><td>There is a right answer. This is not the place for opinion</td></tr>
<tr><td>4</td><td>Answered in 1–2 posts</td><td>One question, one reply, done. A long thread here means it was the wrong forum</td></tr>
<tr><td>5</td><td>Informal language</td><td>Register is relaxed — but "informal" is not "careless"</td></tr>
</table>
<p class="nhan">Beyond the slide — a five-line check before you post anything to an FPTU forum. The deck describes the forum type but never says how to write into it.</p>
<table>
<tr><th>Check</th><th>Ask yourself</th><th>Fail = do this instead</th></tr>
<tr><td>1. Already answered?</td><td>Did I search the thread and the syllabus first?</td><td>Read the answer; post nothing</td></tr>
<tr><td>2. Right forum?</td><td>Is this admin/straightforward (Q&amp;A) or is it an argument?</td><td>An argument belongs in a discussion thread, not a Q&amp;A one</td></tr>
<tr><td>3. Answerable?</td><td>Does my post name the course, the task, and exactly where I am stuck?</td><td>Rewrite: "SWP391, report section 3 — the template says X, the rubric says Y, which applies?"</td></tr>
<tr><td>4. Self-contained?</td><td>Can a reader answer without opening anything I did not include?</td><td>Paste the error text or quote the sentence</td></tr>
<tr><td>5. Permanent-safe?</td><td>Am I fine with my lecturer reading this next year?</td><td>Remove the complaint, remove the name of the teammate, keep the question</td></tr>
</table>
<ul>
<li><strong>Characteristic 2 is really an instruction in disguise.</strong> "FAQs" does not just describe the content — it tells you the norm of the venue: search first, post second. Ignoring it is the most common way students annoy a forum.</li>
<li><strong>"Answered in 1–2 posts" is a countable exam fact and a useful diagnostic.</strong> If your question needs a five-post back-and-forth, it was never a Q&amp;A question — it belongs in a discussion thread or in office hours.</li>
<li><strong>"Informal language" is the single element of the rhetorical situation that shifts here.</strong> Author, audience and purpose are all still institutional; only the register drops. That is a precise, non-obvious claim — and it is why a Q&amp;A post does not need "Dear Professor" but still needs a clear sentence.</li>
<li><strong>The slide's heading is just "Purpose".</strong> It is the Purpose element of the rhetorical situation, applied to forums — the same analysis slides 8–11 ran on physical contexts, now run on an online one. The framework from slide 6 has not gone away; it has moved online.</li>
<li><strong>Applied at FPTU.</strong> EduNext has exactly this split in practice: threads where the lecturer posts logistics and answers once, and threads where a discussion runs for days. Post admin questions in the first, arguments in the second, and never post "thầy ơi deadline khi nào ạ" without opening the syllabus — that is characteristic 2, verbatim.</li>
</ul>
<p class="meo">💡 Count hook for the last slide: <strong>5 characteristics</strong> of a Q&amp;A forum, and the one with a number inside it is "answered in <strong>1–2 posts</strong>". Sources to keep apart in this range: Lunsford 2013 (definition) · Brick, Herke &amp; Wong 2016 (lecture purpose, seminar prep) · Aish &amp; Tomlinson 2013 (both note formats) · Reinders, Moore &amp; Lewis 2008 (what to note) · Cottrell &amp; Morris 2012 (forums).</p>
<p class="pitfall">⚠️ This slide lists only ONE forum type, and the pairing it obviously implies — a <em>discussion</em> forum, with complex questions, long threads and formal language — <strong>never appears</strong>: slide 22 is already "2.4a Participating in Group Work". So if an exam item asks you to contrast Q&amp;A forums with discussion forums, the contrast is not printed in this deck; answer from the five characteristics you do have, and do not invent a second column that the slides never showed. Note also the footer here: small "The University of Sydney" text, no crest — the same odd batch as slides 13, 14 and 20.</p>`,
        `<p class="y-chinh">🎯 Slide cuối của bài này, và nó mô tả <strong>MỘT</strong> loại diễn đàn: <em>Question &amp; answer forum</em> — diễn đàn hỏi–đáp, với <strong>NĂM</strong> đặc điểm, phỏng theo Cottrell &amp; Morris (2012).</p>
<table>
<tr><th>#</th><th>Đặc điểm (nguyên văn)</th><th>Nó bảo bạn làm gì</th></tr>
<tr><td>1</td><td>Administrative questions</td><td>Hạn nộp, đổi phòng, định dạng nộp bài — chuyện hậu cần, không phải nội dung</td></tr>
<tr><td>2</td><td>Frequently asked questions (FAQs)</td><td><strong>TÌM trước khi ĐĂNG.</strong> Nếu nó được hỏi thường xuyên thì đáp án đã nằm sẵn ở đó</td></tr>
<tr><td>3</td><td>Straightforward</td><td>Có một đáp án đúng. Đây không phải chỗ để nêu quan điểm</td></tr>
<tr><td>4</td><td>Answered in 1–2 posts</td><td>Một câu hỏi, một câu trả lời, xong. Luồng dài ở đây nghĩa là bạn vào nhầm diễn đàn</td></tr>
<tr><td>5</td><td>Informal language</td><td>Giọng văn thoải mái — nhưng "thân mật" không phải "cẩu thả"</td></tr>
</table>
<p class="nhan">Phần MỞ RỘNG ngoài slide — năm dòng tự kiểm trước khi đăng bất cứ gì lên diễn đàn FPTU. Slide mô tả loại diễn đàn nhưng không hề nói cách viết vào đó.</p>
<table>
<tr><th>Kiểm</th><th>Tự hỏi</th><th>Trượt = làm cái này thay vào</th></tr>
<tr><td>1. Đã có đáp án chưa?</td><td>Mình đã tìm trong luồng và trong syllabus chưa?</td><td>Đọc đáp án; không đăng gì cả</td></tr>
<tr><td>2. Đúng diễn đàn chưa?</td><td>Đây là chuyện hành chính/đơn nghĩa (Q&amp;A) hay là một cuộc tranh luận?</td><td>Tranh luận thì thuộc luồng thảo luận, không phải luồng hỏi–đáp</td></tr>
<tr><td>3. Trả lời được không?</td><td>Bài đăng của mình có nêu tên môn, tên bài, và chính xác chỗ mình kẹt không?</td><td>Viết lại: "SWP391, mục 3 của báo cáo — template ghi X, rubric ghi Y, cái nào áp dụng ạ?"</td></tr>
<tr><td>4. Tự đủ chưa?</td><td>Người đọc trả lời được mà không cần mở thêm thứ gì mình chưa đính kèm chứ?</td><td>Dán nguyên văn lỗi hoặc trích đúng câu đó vào</td></tr>
<tr><td>5. Chịu được vĩnh viễn không?</td><td>Sang năm giảng viên đọc lại cái này mình có ổn không?</td><td>Bỏ câu than phiền, bỏ tên bạn cùng nhóm, giữ lại câu hỏi</td></tr>
</table>
<ul>
<li><strong>Đặc điểm 2 thật ra là một mệnh lệnh đội lốt mô tả.</strong> "FAQs" không chỉ tả nội dung — nó nói cho bạn chuẩn mực của nơi này: tìm trước, đăng sau. Phớt lờ nó là cách phổ biến nhất khiến sinh viên làm phiền một diễn đàn.</li>
<li><strong>"Answered in 1–2 posts" vừa là dữ kiện đếm được để vào đề vừa là một phép chẩn đoán hữu ích.</strong> Nếu câu hỏi của bạn cần năm lượt qua lại thì nó chưa bao giờ là câu hỏi Q&amp;A — nó thuộc về luồng thảo luận hoặc giờ tiếp sinh viên.</li>
<li><strong>"Informal language" là yếu tố DUY NHẤT của tình huống tu từ dịch chuyển ở đây.</strong> Người viết, người nhận và mục đích vẫn mang tính thiết chế; chỉ mỗi giọng văn hạ xuống. Đó là một khẳng định chính xác và không hiển nhiên — và là lý do một bài đăng Q&amp;A không cần "Kính thưa giáo sư" nhưng vẫn cần một câu rõ nghĩa.</li>
<li><strong>Tiêu đề slide chỉ vỏn vẹn "Purpose".</strong> Đó là yếu tố Purpose của tình huống tu từ, áp vào diễn đàn — đúng phép phân tích mà slide 8–11 đã chạy trên các bối cảnh vật lý, giờ chạy trên một bối cảnh trực tuyến. Cái khung ở slide 6 chưa hề biến mất; nó chỉ chuyển lên mạng.</li>
<li><strong>Áp dụng ở FPTU.</strong> EduNext trong thực tế có đúng sự phân đôi này: những luồng mà giảng viên đăng thông báo hậu cần rồi trả lời một lần, và những luồng thảo luận chạy suốt mấy ngày. Đăng câu hỏi hành chính vào loại thứ nhất, tranh luận vào loại thứ hai, và đừng bao giờ đăng "thầy ơi deadline khi nào ạ" mà chưa mở syllabus — đó chính là đặc điểm 2, nguyên văn.</li>
</ul>
<p class="meo">💡 Mẹo đếm cho slide cuối: <strong>5 đặc điểm</strong> của diễn đàn hỏi–đáp, và cái duy nhất có con số bên trong là "answered in <strong>1–2 posts</strong>". Các nguồn phải giữ tách bạch trong dải này: Lunsford 2013 (định nghĩa) · Brick, Herke &amp; Wong 2016 (mục đích lecture, chuẩn bị seminar) · Aish &amp; Tomlinson 2013 (cả hai khuôn ghi chép) · Reinders, Moore &amp; Lewis 2008 (ghi cái gì) · Cottrell &amp; Morris 2012 (diễn đàn).</p>
<p class="pitfall">⚠️ Slide này chỉ liệt kê MỘT loại diễn đàn, và cái vế đối mà nó hiển nhiên gợi ra — diễn đàn <em>thảo luận</em>, với câu hỏi phức tạp, luồng dài và ngôn ngữ trang trọng — <strong>KHÔNG BAO GIỜ xuất hiện</strong>: slide 22 đã là "2.4a Participating in Group Work". Nên nếu đề bắt bạn so sánh diễn đàn hỏi–đáp với diễn đàn thảo luận thì phép so đó KHÔNG được in trong bộ slide này; hãy trả lời bằng đúng năm đặc điểm bạn đang có, và đừng bịa ra cột thứ hai mà slide chưa từng cho thấy. Cũng để ý chân trang ở đây: dòng chữ nhỏ "The University of Sydney", không huy hiệu — cùng lượt xuất file kỳ lạ với slide 13, 14 và 20.</p>`],

    ]),
  ].join('\n'),
};
