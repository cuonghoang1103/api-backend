/**
 * SSL101c · Mooc 1 (deck 'ssl1') — slide 28–55, học theo từng slide.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). Lớp text của .pptx gần như RỖNG — /tmp/ssl101c-text/ssl1.txt KHÔNG dùng
 * được. Toàn bộ 28 slide dưới đây đã được ĐỌC THẲNG TỪ ẢNH
 * /tmp/ssl101c-slides/ssl1/028.webp … 055.webp, từng cái một, không suy đoán.
 *
 * NỘI DUNG THẬT của khoảng 28–55 (khác với phỏng đoán ban đầu "tìm & đánh giá"):
 *   · 28–31  Các loại thông tin ở đại học: giáo trình · tài liệu môn · bài báo
 *   · 32–33  Đặc điểm của bài báo khoa học (bình duyệt, mạng lưới tri thức)
 *   · 34     2.3 Accessing Information (slide mục tiêu, không có nội dung)
 *   · 35–41  2.4a Xác định nhu cầu thông tin — QUY TRÌNH 5 BƯỚC + tóm tắt
 *   · 42–43  2.4b Dựng chiến lược tìm · 2.4c Ghi lại và đánh giá chiến lược
 *   · 44–45  3.1a Đánh giá thông tin + 6 tiêu chí Purpose/Author/Audience/
 *            Objectivity/Accuracy/Currency
 *   · 46–47  3.1b Đánh giá tài nguyên WEB + 4 tiêu chí Publisher/Purpose/
 *            Aesthetics and Style/Referencing
 *   · 48–49  3.1c Đánh giá Wikipedia + bảng kiểm 6 ô (Scholarly Purpose…)
 *   · 50–53  3.2a/3.2b Xác lập mức liên quan + 4 câu hỏi
 *   · 54–55  3.3a Quản lý thông tin: đặt tên tệp + quy ước YYYYMMDD
 *
 * Chỗ deck gốc LẶP / THIẾU — nêu thẳng, không im lặng chép, không tự sửa slide:
 *   · slide 34 (2.3 Accessing Information) chỉ có hai dòng mục tiêu, phần nội
 *     dung của mục 2.3 KHÔNG có trong bản review này.
 *   · slide 42 (2.4b) và slide 35 (2.4a) có BA dòng mục tiêu GIỐNG HỆT nhau.
 *   · slide 50 (3.2a) và slide 52 (3.2b) có BA dòng mục tiêu GIỐNG HỆT nhau.
 *   · slide 51 và slide 53 là CÙNG bốn câu hỏi, chỉ khác thứ tự và cách bày.
 *   · slide 46 (3.1b) và slide 48 (3.1c) có BA dòng mục tiêu GIỐNG HỆT nhau.
 *   · slide 49 đổi "Purpose" thành "Scholarly Purpose" và "Author" thành
 *     "Authority" so với slide 45 — khác chữ thật trên ảnh, không phải gõ nhầm.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl1';

export default {
  title: '1.0b — Slide by slide: Types of information, search strategy, evaluating sources and managing files (slides 28–55)|||1.0b — Slide bài giảng: Các loại thông tin, chiến lược tìm, đánh giá nguồn & quản lý tệp (slide 28–55)',
  slug: 'ssl101c-1-0b-slides-loai-thong-tin-tim-danh-gia-nguon',
  type: 'DOCUMENT',
  description: 'Phần giữa của Mooc 1 (28 slide, đọc thẳng từ ảnh slide gốc University of Sydney). Đi từ BA loại thông tin chung cho mọi ngành (giáo trình · tài liệu môn · bài báo bình duyệt), qua quy trình NĂM BƯỚC xác định nhu cầu thông tin và dựng chiến lược tìm (bẻ nhỏ đề · kiểm kho đã có · tìm lỗ hổng · nghĩ từ đồng nghĩa · ghép từ khoá), tới ba bộ tiêu chí đánh giá dễ lẫn nhau (6 tiêu chí cho nguồn học thuật, 4 tiêu chí cho web, bảng kiểm riêng cho Wikipedia), rồi bốn câu hỏi xác lập mức liên quan và kết bằng quy ước đặt tên tệp YYYYMMDD. Bài dạy thêm toán tử Boolean, dấu nháy kép, ký tự đại diện và bộ lọc — thứ slide gốc chỉ gợi bằng dấu cộng — kèm truy vấn gõ được ngay trên Google Scholar cho SWP391/SWR302.',
  content: [
    walkHead(D, 28, 55),
    walk(D, [

      [28, 'Information at University — many types, three common to all fields',
        `<p class="y-chinh">🎯 University does not run on one kind of "information". The slide says there are <strong>many different types</strong>, that they <strong>vary between fields and between subjects within fields</strong>, and that exactly <strong>three types are common to all fields</strong>: textbooks, course notes, and scholarly journal articles.</p>
<table>
<tr><th>Type</th><th>Who writes it</th><th>What it is for</th></tr>
<tr><td><strong>Textbooks</strong></td><td>Established academics, for students</td><td>The settled, broad knowledge of a subject</td></tr>
<tr><td><strong>Course notes</strong></td><td>Your own lecturer, for your own cohort</td><td>Knowledge shaped to <em>this</em> course</td></tr>
<tr><td><strong>Scholarly journal articles</strong></td><td>Academics, for academics</td><td>New research, argued and peer reviewed</td></tr>
</table>
<ul>
<li><strong>Read "vary" on two levels, because the slide states two.</strong> Between <em>fields</em> — Software Engineering leans on conference papers and standards, Law leans on cases and statutes, Medicine on clinical trials. And between <em>subjects within a field</em> — a database subject cites vendor documentation happily, a research-methods subject would not.</li>
<li><strong>Why the three-way split matters more than it looks.</strong> The type of source you cite is itself a claim about how much weight your statement deserves. Citing a textbook says "this is settled". Citing a journal article says "this is current, contested, evidenced". Citing course notes says "this is what we were taught" — which carries almost no weight outside the classroom.</li>
<li><strong>Applying it at FPTU.</strong> For a SWP391 or SWR302 report: use textbooks to define terms in Chapter 1, use journal or conference papers for the "related work" and for any claim about effectiveness, and use course notes only to remind yourself what the marker expects — never as a citation in the reference list.</li>
<li><strong>This is the map for slides 29–33.</strong> Slide 29 unpacks textbooks, slide 30 course notes, slide 31 summarises, slides 32–33 give journal articles a whole section of their own — which tells you which of the three the course thinks is hardest.</li>
</ul>
<p class="meo">💡 Remember the number <strong>three</strong>, and the order the slide uses: textbook → course notes → journal article. It runs from <em>most general</em> to <em>most specific to your class</em> to <em>most specialised</em>. A multiple-choice item that lists four "types common to all fields" has one distractor in it.</p>
<p class="pitfall">⚠️ Common confusion: "common to all fields" does <strong>not</strong> mean "the only types". Websites, reports, standards, datasets and newspapers all exist — they are simply not common to every field. Do not pick an answer saying university information consists of exactly three types.</p>`,
        `<p class="y-chinh">🎯 Đại học không chạy bằng một loại "thông tin" duy nhất. Slide nói có <strong>RẤT NHIỀU loại</strong>, rằng chúng <strong>khác nhau giữa các ngành và khác nhau giữa các môn trong cùng một ngành</strong>, và có đúng <strong>BA loại chung cho mọi ngành</strong>: giáo trình (textbooks), tài liệu môn học (course notes), và bài báo khoa học bình duyệt (scholarly journal articles).</p>
<table>
<tr><th>Loại</th><th>Ai viết</th><th>Dùng để làm gì</th></tr>
<tr><td><strong>Giáo trình</strong></td><td>Học giả có tên tuổi, viết cho SINH VIÊN</td><td>Kiến thức nền đã ổn định của một môn</td></tr>
<tr><td><strong>Tài liệu môn</strong></td><td>Chính giảng viên của bạn, cho lớp bạn</td><td>Kiến thức được nắn cho ĐÚNG môn này</td></tr>
<tr><td><strong>Bài báo khoa học</strong></td><td>Học giả viết cho HỌC GIẢ</td><td>Nghiên cứu mới, có lập luận, có bình duyệt</td></tr>
</table>
<ul>
<li><strong>Đọc chữ "khác nhau" ở HAI tầng, vì slide nói hai tầng.</strong> Giữa các <em>ngành</em> — Kỹ thuật phần mềm dựa vào bài hội nghị và tiêu chuẩn, Luật dựa vào án lệ và văn bản luật, Y dựa vào thử nghiệm lâm sàng. Và giữa các <em>môn trong cùng ngành</em> — môn cơ sở dữ liệu trích tài liệu hãng thoải mái, môn phương pháp nghiên cứu thì không.</li>
<li><strong>Vì sao chia ba lại quan trọng hơn vẻ ngoài của nó.</strong> Loại nguồn bạn trích DẪN chính là một tuyên bố về sức nặng câu bạn viết. Trích giáo trình nghĩa là "chuyện này đã ngã ngũ". Trích bài báo nghĩa là "chuyện này đang mới, đang tranh luận, có bằng chứng". Trích tài liệu môn nghĩa là "thầy dạy vậy" — gần như không có sức nặng nào ngoài lớp học.</li>
<li><strong>Áp vào FPTU.</strong> Với báo cáo SWP391 hay SWR302: dùng giáo trình để định nghĩa thuật ngữ ở Chương 1, dùng bài báo/bài hội nghị cho phần "công trình liên quan" và cho mọi khẳng định về hiệu quả, còn tài liệu môn chỉ để bạn nhớ giảng viên chấm cái gì — đừng bao giờ đưa nó vào danh mục tài liệu tham khảo.</li>
<li><strong>Đây là BẢN ĐỒ của slide 29–33.</strong> Slide 29 mở giáo trình, slide 30 mở tài liệu môn, slide 31 tóm tắt, slide 32–33 dành hẳn một mục riêng cho bài báo — tức là môn học coi loại thứ ba mới là loại khó nhất.</li>
</ul>
<p class="meo">💡 Nhớ con số <strong>BA</strong>, và nhớ đúng thứ tự slide dùng: giáo trình → tài liệu môn → bài báo. Nó chạy từ <em>tổng quát nhất</em> → <em>riêng cho lớp bạn nhất</em> → <em>chuyên sâu nhất</em>. Câu trắc nghiệm nào liệt kê BỐN "loại chung cho mọi ngành" thì trong đó có một mồi nhử.</p>
<p class="pitfall">⚠️ Chỗ hay hiểu nhầm: "chung cho mọi ngành" KHÔNG có nghĩa "chỉ có ba loại này". Website, báo cáo, tiêu chuẩn, bộ dữ liệu, báo chí đều tồn tại — chúng chỉ không chung cho MỌI ngành thôi. Đừng chọn đáp án nói thông tin ở đại học gồm đúng ba loại.</p>`],

      [29, 'Textbooks — broad and basic knowledge, unproblematic, authoritative',
        `<p class="y-chinh">🎯 The slide defines a textbook by a quotation: it carries <strong>"the broad and basic knowledge of what a subject is about" (Brick, 2011, p. 78)</strong>, and adds two adjectives that are doing real work — <strong>unproblematic</strong> and <strong>authoritative</strong>.</p>
<table>
<tr><th>The slide's word</th><th>What it actually means</th><th>Consequence for you</th></tr>
<tr><td><strong>Broad and basic</strong></td><td>Wide coverage, introductory depth</td><td>Great for orientation, thin for an argument</td></tr>
<tr><td><strong>Unproblematic</strong></td><td>Presents knowledge that is no longer disputed</td><td>You will not find the current debate here</td></tr>
<tr><td><strong>Authoritative</strong></td><td>Written by recognised experts, edited, revised</td><td>Safe to cite for definitions</td></tr>
</table>
<ul>
<li><strong>"Unproblematic" is the trickiest word on the slide.</strong> It does not mean "easy" and it does not mean "perfect". It means the book presents its content as <em>settled</em> — the arguments, the rejected alternatives and the open questions have been edited out. That is a feature when you are learning and a limitation when you are researching.</li>
<li><strong>What the slide says textbooks are used for.</strong> Weekly readings; covering <em>specific vocabulary, equations, practice questions, and overviews of theories</em>. That list is exactly what a first-year student needs and exactly what a literature review does not.</li>
<li><strong>The last bullet is about your teacher, not the book.</strong> "Lecturers and tutors will give you information when to read them, how to interpret them, and to question it." Three separate jobs — <em>when</em>, <em>how</em>, and <em>question</em>. The course expects you to question even the authoritative source; that is the difference between school reading and university reading.</li>
<li><strong>At FPTU.</strong> A textbook is where you get the definition of "regression testing" for SWT301 or "coupling and cohesion" for SWP391 — and it is where you should stop. The moment your sentence claims something is <em>better</em>, <em>faster</em>, or <em>more effective</em>, you need a study, not a textbook.</li>
</ul>
<p class="meo">💡 Three-word hook for the exam: textbook = <strong>broad · basic · settled</strong>. Journal article = <strong>narrow · new · argued</strong>. Almost every "which source would you use" question is decided by that contrast alone.</p>
<p class="pitfall">⚠️ Trap: "authoritative" appears on both slide 29 (textbooks) and slide 33 (journal articles), so it cannot be the feature that distinguishes them. The distinguishing words are <strong>unproblematic</strong> (textbook) versus <strong>peer review</strong> and <strong>presents new research</strong> (article).</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa giáo trình bằng một câu trích: nó mang <strong>"kiến thức rộng và cơ bản về việc một môn học nói về cái gì" (Brick, 2011, tr. 78)</strong>, kèm hai tính từ đang làm việc thật — <strong>unproblematic</strong> (không gợn vấn đề) và <strong>authoritative</strong> (có thẩm quyền).</p>
<table>
<tr><th>Chữ trên slide</th><th>Nghĩa thật</th><th>Hệ quả cho bạn</th></tr>
<tr><td><strong>Rộng và cơ bản</strong></td><td>Phủ rộng, nhưng chiều sâu ở mức nhập môn</td><td>Tốt để định hướng, mỏng để lập luận</td></tr>
<tr><td><strong>Không gợn vấn đề</strong></td><td>Trình bày phần kiến thức đã hết tranh cãi</td><td>Ở đây bạn KHÔNG thấy tranh luận đang diễn ra</td></tr>
<tr><td><strong>Có thẩm quyền</strong></td><td>Do chuyên gia được công nhận viết, có biên tập, tái bản</td><td>Trích an toàn cho ĐỊNH NGHĨA</td></tr>
</table>
<ul>
<li><strong>"Unproblematic" là chữ khó nhất trên slide.</strong> Nó KHÔNG nghĩa là "dễ", cũng KHÔNG nghĩa là "hoàn hảo". Nó nghĩa là sách trình bày nội dung như thứ đã <em>ngã ngũ</em> — các lập luận, các phương án bị bác bỏ và các câu hỏi còn mở đã bị biên tập bỏ đi. Đó là ưu điểm khi bạn đang HỌC và là giới hạn khi bạn đang NGHIÊN CỨU.</li>
<li><strong>Slide nói giáo trình dùng để làm gì.</strong> Bài đọc hằng tuần; phủ <em>thuật ngữ chuyên môn, công thức, câu hỏi luyện tập, và tổng quan các lý thuyết</em>. Danh sách đó đúng là thứ sinh viên năm nhất cần, và đúng là thứ một bài tổng quan tài liệu KHÔNG cần.</li>
<li><strong>Gạch đầu dòng cuối nói về THẦY CÔ, không nói về sách.</strong> "Giảng viên và trợ giảng sẽ cho bạn biết khi nào đọc, đọc thế nào, và phải chất vấn nó." Ba việc tách bạch — <em>khi nào</em>, <em>thế nào</em>, và <em>chất vấn</em>. Môn học đòi bạn chất vấn cả nguồn có thẩm quyền; đó chính là khác biệt giữa đọc kiểu phổ thông và đọc kiểu đại học.</li>
<li><strong>Ở FPTU.</strong> Giáo trình là nơi bạn lấy định nghĩa "kiểm thử hồi quy" cho SWT301 hay "coupling và cohesion" cho SWP391 — và cũng là nơi bạn nên DỪNG. Ngay khi câu văn của bạn khẳng định cái gì đó <em>tốt hơn</em>, <em>nhanh hơn</em>, <em>hiệu quả hơn</em>, bạn cần một nghiên cứu chứ không phải giáo trình.</li>
</ul>
<p class="meo">💡 Móc nhớ ba chữ cho phòng thi: giáo trình = <strong>rộng · cơ bản · đã ngã ngũ</strong>. Bài báo = <strong>hẹp · mới · có lập luận</strong>. Gần như mọi câu "nên dùng nguồn nào" chỉ cần thế tương phản này là quyết được.</p>
<p class="pitfall">⚠️ Bẫy: chữ "authoritative" xuất hiện ở CẢ slide 29 (giáo trình) lẫn slide 33 (bài báo), nên nó KHÔNG thể là đặc điểm phân biệt hai loại. Chữ phân biệt là <strong>unproblematic</strong> (giáo trình) so với <strong>peer review</strong> và <strong>present new research</strong> (bài báo).</p>`],

      [30, 'Course Notes — specific to your course, subject knowledge',
        `<p class="y-chinh">🎯 Course notes are the narrowest of the three types: the slide describes them as <strong>specific to your course</strong> and as carrying <strong>subject knowledge</strong>, used for <strong>weekly readings</strong>, with lecturers and tutors telling you <strong>when, where and how to use them</strong>.</p>
<ul>
<li><strong>"Specific to your course" is both the value and the limit.</strong> The value: nobody else has selected, ordered and trimmed the material for exactly your syllabus and your assessment. The limit: the material carries no authority outside that room, because it was never reviewed by anyone but the person who wrote it.</li>
<li><strong>Note the extra word compared with slide 29.</strong> For textbooks the slide said <em>when</em> and <em>how</em> and <em>question it</em>. For course notes it says <em>when</em>, <strong>where</strong>, and <em>how to use them</em> — "where" appears because course notes live scattered across an LMS, a slide deck, a handout and a recording, and half the problem is knowing which copy is current.</li>
<li><strong>What they are actually best at.</strong> Telling you the <em>scope</em> of what will be assessed, the <em>vocabulary the marker expects</em>, and the <em>worked examples</em> in the form your course uses. That is scaffolding for your own reading, not evidence for your argument.</li>
<li><strong>At FPTU this is very concrete.</strong> The lecturer's slides on the LMS, the lab handouts, the sample solutions — all course notes. Use them to work out what a rubric means; then go to the textbook for the definition and to a journal article for the evidence. In a report's reference list, a lecture slide is close to worthless.</li>
<li><strong>The honest exception.</strong> If an assignment explicitly says "as covered in the lecture", then the course notes <em>are</em> the authority for that assignment — because the assessor defined them as such. Authority is always relative to the audience, which is the whole point of slide 45.</li>
</ul>
<p class="meo">💡 Line the three up by <strong>audience</strong> and they never blur again: textbook → written for <em>students</em>; course notes → written for <em>your class</em>; journal article → written for <em>academics</em>. Slide 31 states that last one in exactly those words.</p>
<p class="pitfall">⚠️ Do not confuse <em>course notes</em> (material the teacher gives you) with <em>your own notes</em> (what you write in class). The slide is talking about the first. Your own notes are a study tool and are never a citable source at all.</p>`,
        `<p class="y-chinh">🎯 Tài liệu môn học là loại HẸP nhất trong ba loại: slide mô tả chúng là <strong>riêng cho môn của bạn</strong> và mang <strong>kiến thức chuyên môn</strong>, dùng cho <strong>bài đọc hằng tuần</strong>, và giảng viên/trợ giảng sẽ nói cho bạn biết <strong>khi nào, ở đâu và dùng thế nào</strong>.</p>
<ul>
<li><strong>"Riêng cho môn của bạn" vừa là giá trị vừa là giới hạn.</strong> Giá trị: không ai khác chọn lọc, sắp xếp và cắt gọt tài liệu đúng theo syllabus và đúng theo bài kiểm tra của bạn. Giới hạn: tài liệu đó không mang thẩm quyền nào ngoài căn phòng ấy, vì nó chưa từng được ai ngoài người soạn xem lại.</li>
<li><strong>Để ý chữ THÊM so với slide 29.</strong> Với giáo trình, slide nói <em>khi nào</em>, <em>thế nào</em>, và <em>chất vấn nó</em>. Với tài liệu môn, slide nói <em>khi nào</em>, <strong>Ở ĐÂU</strong>, và <em>dùng thế nào</em> — chữ "ở đâu" xuất hiện vì tài liệu môn nằm rải rác trên LMS, trong bộ slide, trong tờ phát tay và trong bản ghi hình, mà một nửa vấn đề là biết bản nào mới nhất.</li>
<li><strong>Chúng giỏi nhất ở việc gì.</strong> Cho bạn biết <em>PHẠM VI</em> sẽ bị kiểm tra, <em>thuật ngữ người chấm mong thấy</em>, và <em>ví dụ mẫu</em> theo đúng dạng môn bạn dùng. Đó là giàn giáo cho việc đọc của bạn, không phải bằng chứng cho lập luận của bạn.</li>
<li><strong>Ở FPTU chuyện này rất cụ thể.</strong> Slide của giảng viên trên LMS, tờ hướng dẫn lab, bài giải mẫu — tất cả là tài liệu môn. Dùng chúng để hiểu rubric muốn gì; rồi sang giáo trình lấy định nghĩa, sang bài báo lấy bằng chứng. Trong danh mục tham khảo của một báo cáo, một slide bài giảng gần như vô giá trị.</li>
<li><strong>Ngoại lệ thành thật.</strong> Nếu đề bài ghi rõ "theo đúng nội dung đã học trên lớp" thì tài liệu môn CHÍNH LÀ thẩm quyền cho bài đó — vì người chấm đã định nghĩa nó như vậy. Thẩm quyền luôn tương đối với NGƯỜI ĐỌC, và đó đúng là ý chính của slide 45.</li>
</ul>
<p class="meo">💡 Xếp ba loại theo <strong>ĐỐI TƯỢNG ĐỌC</strong> thì chúng không lẫn nữa: giáo trình → viết cho <em>sinh viên</em>; tài liệu môn → viết cho <em>lớp bạn</em>; bài báo → viết cho <em>giới học thuật</em>. Slide 31 nói câu cuối bằng đúng những chữ đó.</p>
<p class="pitfall">⚠️ Đừng lẫn <em>course notes</em> (tài liệu thầy cô đưa) với <em>vở ghi của bạn</em> (thứ bạn chép trên lớp). Slide đang nói về cái thứ nhất. Vở ghi của bạn là công cụ ôn tập, và nó chưa bao giờ là một nguồn trích dẫn được.</p>`],

      [31, 'Summary: Information at University — the three types on one page',
        `<p class="y-chinh">🎯 The recap slide, and it adds <strong>one new line that was not on any earlier slide</strong>: scholarly journal articles are <strong>"written by academics for academics"</strong>. That single phrase is the answer to more exam questions than anything else in this block.</p>
<table>
<tr><th>Type</th><th>The summary slide's defining phrase</th></tr>
<tr><td>Textbooks</td><td>"the broad and basic knowledge of what a subject is about" (Brick, 2011, p. 78)</td></tr>
<tr><td>Course notes</td><td>Specific to your course · Subject knowledge</td></tr>
<tr><td>Scholarly journal articles</td><td><strong>Written by academics for academics</strong></td></tr>
</table>
<ul>
<li><strong>Why "for academics" changes how you read.</strong> The author assumes you already know the field's vocabulary, the standard methods, and the prior studies. Nothing is explained from scratch. That is why a journal article feels impossible on first contact and why slide 33 exists to tell you what to expect.</li>
<li><strong>The summary keeps the two-level "vary" claim.</strong> Many different types · vary between fields and between subjects within fields · three main types common to all fields. If the exam asks you to complete one of these three statements, they are worth memorising verbatim — they are short.</li>
<li><strong>Read the indentation as a structure, not decoration.</strong> Level 1 = the three claims about information in general; level 2 = the three types; level 3 = the defining phrase of each type. A summary slide in this deck always mirrors the section it closes, so it doubles as a checklist of what you should be able to say.</li>
<li><strong>Practice the discrimination now, not in the exam room.</strong> "A source that presents findings from a study the author conducted, reviewed by other experts before publication" → journal article. "A source that gives the standard definition and practice questions" → textbook. "A source that tells you which chapters are examinable" → course notes.</li>
</ul>
<p class="dap-an">✅ Self-check: which of the three would you cite for the sentence "Pair programming reduces defect density in student projects"? <strong>A journal article.</strong> The sentence makes an empirical, contestable claim about effect — textbooks and course notes have no evidence behind them to support it.</p>
<p class="meo">💡 Compress the whole block into one line to carry into the exam: <strong>students ← textbook · your class ← course notes · academics ← journal article</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt, và nó thêm <strong>MỘT dòng mới chưa slide nào trước đó nói</strong>: bài báo khoa học là thứ <strong>"do học giả viết cho học giả"</strong>. Chỉ một cụm đó thôi đã trả lời được nhiều câu thi hơn bất cứ thứ gì khác trong khối này.</p>
<table>
<tr><th>Loại</th><th>Cụm định nghĩa trên slide tóm tắt</th></tr>
<tr><td>Giáo trình</td><td>"kiến thức rộng và cơ bản về việc một môn nói về cái gì" (Brick, 2011, tr. 78)</td></tr>
<tr><td>Tài liệu môn</td><td>Riêng cho môn của bạn · Kiến thức chuyên môn</td></tr>
<tr><td>Bài báo khoa học</td><td><strong>Do học giả viết cho học giả</strong></td></tr>
</table>
<ul>
<li><strong>Vì sao "viết cho học giả" đổi cả cách bạn đọc.</strong> Tác giả MẶC ĐỊNH bạn đã biết thuật ngữ của ngành, các phương pháp chuẩn, và các nghiên cứu trước. Không có gì được giảng lại từ đầu. Đó là lý do bài báo đọc lần đầu thấy bất khả, và là lý do slide 33 tồn tại để báo trước cho bạn biết sẽ gặp gì.</li>
<li><strong>Slide tóm tắt giữ nguyên khẳng định "khác nhau" hai tầng.</strong> Rất nhiều loại · khác nhau giữa các ngành và giữa các môn trong một ngành · ba loại chính chung cho mọi ngành. Nếu đề thi bắt điền nốt một trong ba câu này thì nên thuộc nguyên văn — chúng ngắn.</li>
<li><strong>Đọc các mức thụt đầu dòng như một CẤU TRÚC, không phải trang trí.</strong> Mức 1 = ba khẳng định về thông tin nói chung; mức 2 = ba loại; mức 3 = cụm định nghĩa của từng loại. Slide tóm tắt trong deck này luôn soi gương đúng mục nó đóng lại, nên nó kiêm luôn bảng kiểm "mình nói lại được chưa".</li>
<li><strong>Luyện phân biệt ngay bây giờ, đừng để tới phòng thi.</strong> "Nguồn trình bày kết quả một nghiên cứu do chính tác giả thực hiện, được chuyên gia khác xem xét trước khi công bố" → bài báo. "Nguồn cho định nghĩa chuẩn và câu hỏi luyện tập" → giáo trình. "Nguồn cho biết chương nào sẽ thi" → tài liệu môn.</li>
</ul>
<p class="dap-an">✅ Tự kiểm: câu "Lập trình cặp làm giảm mật độ lỗi trong đồ án sinh viên" thì bạn trích loại nào? <strong>Bài báo khoa học.</strong> Câu đó đưa ra một khẳng định THỰC NGHIỆM, có thể bị phản bác, về HIỆU QUẢ — giáo trình và tài liệu môn không có bằng chứng nào đứng sau để đỡ cho nó.</p>
<p class="meo">💡 Nén cả khối này thành một dòng mang vào phòng thi: <strong>sinh viên ← giáo trình · lớp bạn ← tài liệu môn · học giả ← bài báo</strong>.</p>`],

      [32, '2.2b Characteristics of Journal Articles — learning outcomes',
        `<p class="y-chinh">🎯 A section-objective slide. It names two outcomes: <strong>understand the different kinds of information used in university courses</strong>, and <strong>understand the characteristics of journal articles</strong>. The "b" in 2.2b tells you this is the second half of a section whose first half you have just seen.</p>
<ul>
<li><strong>Objective slides are not filler — they are the exam blueprint.</strong> This course is assessed by a single 60-minute multiple-choice paper covering all five MOOCs. The verbs on these slides ("understand", later "apply criteria") are what the question writer worked from. Treat each bullet as a question you must be able to answer aloud.</li>
<li><strong>Notice the first bullet repeats section 2.2a.</strong> The course is deliberately carrying "kinds of information" forward into the journal-article section, because journal articles are one of those kinds — the hardest one. The repetition is a signal of weight, not an editing slip.</li>
<li><strong>"Characteristics" is the operative word.</strong> The course does not ask you to <em>read</em> or <em>write</em> a journal article here; it asks you to recognise one and to know what makes it different from other sources. That is a recognition task, and recognition tasks are exactly what multiple choice tests.</li>
<li><strong>Where this lands at FPTU.</strong> Every capstone-style subject (SWP391, SWR302, the graduation project) requires a related-work section built from journal and conference papers. The skill being taught here is the one you will use when your supervisor says "find three papers on this".</li>
</ul>
<p class="nhan">📐 Reading a paper efficiently — not on this slide, but it is the practical skill the next slide assumes. Read in this order, stopping as soon as the paper proves irrelevant: <strong>title → abstract → conclusion → figures and tables → introduction → method</strong>. Most papers are rejected at the abstract; you should never read a paper front-to-back on first contact.</p>
<table>
<tr><th>IMRaD section</th><th>What it answers</th><th>Read it when</th></tr>
<tr><td><strong>I</strong>ntroduction</td><td>Why the question matters, what was known</td><td>The paper survived the abstract</td></tr>
<tr><td><strong>M</strong>ethod</td><td>What exactly they did</td><td>You need to judge or replicate</td></tr>
<tr><td><strong>R</strong>esults</td><td>What they found (figures, tables)</td><td>Third — the numbers are the claim</td></tr>
<tr><td><strong>a</strong>nd <strong>D</strong>iscussion</td><td>What it means, limitations</td><td>Second — right after the abstract</td></tr>
</table>
<p class="meo">💡 Learn the acronym <strong>IMRaD</strong>. It is the standard skeleton of an empirical paper across almost every field, and knowing it turns "this article is impenetrable" into "I know which part of it I need".</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của mục. Nó nêu hai kết quả cần đạt: <strong>hiểu các loại thông tin dùng trong các môn ở đại học</strong>, và <strong>hiểu đặc điểm của bài báo khoa học</strong>. Chữ "b" trong 2.2b cho biết đây là nửa sau của một mục mà nửa đầu bạn vừa xem xong.</p>
<ul>
<li><strong>Slide mục tiêu không phải slide độn — nó là BẢN THIẾT KẾ ĐỀ THI.</strong> Môn này chấm bằng đúng một bài trắc nghiệm 60 phút phủ cả năm MOOC. Những động từ trên các slide này ("hiểu", sau đó là "áp dụng tiêu chí") chính là thứ người ra đề bám vào. Hãy coi mỗi gạch đầu dòng là một câu hỏi bạn phải nói thành lời được.</li>
<li><strong>Để ý gạch đầu dòng thứ nhất LẶP LẠI mục 2.2a.</strong> Môn học cố ý mang "các loại thông tin" sang tiếp mục bài báo, vì bài báo chính là một trong các loại đó — loại khó nhất. Chuyện lặp là dấu hiệu của TRỌNG SỐ, không phải lỗi biên tập.</li>
<li><strong>Chữ then chốt là "đặc điểm" (characteristics).</strong> Ở đây môn học không bắt bạn <em>đọc</em> hay <em>viết</em> một bài báo; nó bắt bạn NHẬN RA một bài báo và biết điều gì làm nó khác các nguồn khác. Đó là bài toán nhận diện, mà trắc nghiệm thì kiểm đúng khả năng nhận diện.</li>
<li><strong>Chỗ này rơi vào đâu ở FPTU.</strong> Mọi môn dạng đồ án (SWP391, SWR302, khoá luận) đều đòi một mục "công trình liên quan" dựng từ bài báo tạp chí và bài hội nghị. Kỹ năng đang dạy ở đây đúng là kỹ năng bạn dùng khi giảng viên hướng dẫn nói "tìm cho thầy ba bài về chuyện này".</li>
</ul>
<p class="nhan">📐 Đọc một bài báo cho nhanh — slide không ghi, nhưng đây là kỹ năng thực dụng mà slide sau mặc định bạn có. Đọc theo thứ tự này, dừng ngay khi thấy bài không liên quan: <strong>tiêu đề → tóm tắt (abstract) → kết luận → hình và bảng → mở đầu → phương pháp</strong>. Phần lớn bài bị loại ngay ở abstract; đừng bao giờ đọc một bài báo từ đầu đến cuối ngay lần đầu.</p>
<table>
<tr><th>Phần IMRaD</th><th>Nó trả lời gì</th><th>Đọc khi nào</th></tr>
<tr><td><strong>I</strong>ntroduction — Mở đầu</td><td>Vì sao câu hỏi này đáng hỏi, trước đó đã biết gì</td><td>Khi bài đã qua được vòng abstract</td></tr>
<tr><td><strong>M</strong>ethod — Phương pháp</td><td>Họ đã làm CHÍNH XÁC những gì</td><td>Khi cần thẩm định hoặc làm lại</td></tr>
<tr><td><strong>R</strong>esults — Kết quả</td><td>Họ tìm ra gì (hình, bảng)</td><td>Thứ ba — con số mới là khẳng định</td></tr>
<tr><td><strong>a</strong>nd <strong>D</strong>iscussion — Bàn luận</td><td>Nghĩa là gì, hạn chế ra sao</td><td>Thứ hai — ngay sau abstract</td></tr>
</table>
<p class="meo">💡 Thuộc chữ viết tắt <strong>IMRaD</strong>. Đó là bộ xương chuẩn của một bài báo thực nghiệm ở gần như mọi ngành, và biết nó thì "bài này đọc không nổi" biến thành "mình biết mình cần phần nào".</p>`],

      [33, 'Journal Articles — expert authors, peer review, and the web of knowledge',
        `<p class="y-chinh">🎯 Six characteristics, and the last one is the one students never guess: <strong>expert authors · critique work · present new research · peer review process · authoritative and credible · articles are not independent — they form part of the web of knowledge</strong>.</p>
<table>
<tr><th>Characteristic</th><th>What it means in practice</th></tr>
<tr><td><strong>Expert authors</strong></td><td>Written by researchers active in that field, with an institutional affiliation</td></tr>
<tr><td><strong>Critique work</strong></td><td>They argue against, qualify or extend what others published</td></tr>
<tr><td><strong>Present new research</strong></td><td>They report something not previously published</td></tr>
<tr><td><strong>Peer review process</strong></td><td>Other experts read and judge it <em>before</em> publication</td></tr>
<tr><td><strong>Authoritative and credible</strong></td><td>Consequence of the four above (Blake &amp; Bly, 1993; Nwagwu &amp; Onyancha, 2015)</td></tr>
<tr><td><strong>Part of the web of knowledge</strong></td><td>Each article cites earlier ones and is cited by later ones (Alexander, Argent, &amp; Spencer, 2008)</td></tr>
</table>
<ul>
<li><strong>Peer review is the mechanism; credibility is the result.</strong> Keep that causal order straight — the exam likes to reverse it. Peer review means named experts in the same field read the manuscript before publication and could reject it. It does not mean the article is true; it means it passed a filter.</li>
<li><strong>"Articles are not independent" is the most useful sentence on the slide.</strong> Every paper's reference list is a map <em>backwards</em> in time, and its citation count is a map <em>forwards</em>. Find one good paper and you have found a doorway to twenty more. This is called citation chaining, and it is faster than any keyword search.</li>
<li><strong>Turn it into a method you can use today.</strong> On Google Scholar, open one relevant paper, then (1) mine its reference list for the foundational works, and (2) click "Cited by" to see who built on it since. Two clicks give you both directions of the web.</li>
<li><strong>How to check peer review in ten seconds.</strong> Look for a journal or conference name, volume/issue/page numbers, and a DOI. Check the publisher (IEEE, ACM, Springer, Elsevier, MDPI…). A PDF sitting on somebody's personal site with none of those is a preprint or a draft, not a reviewed article.</li>
<li><strong>At FPTU.</strong> For an SWP391 related-work section, one well-chosen paper plus its reference list plus its "Cited by" list is usually enough to build the whole section — and it beats reading twenty random search hits.</li>
</ul>
<p class="meo">💡 Mnemonic for the six: <strong>E-C-P-P-A-W</strong> — <em>Experts Critique, Present, Peer-review, are Authoritative, and Weave</em>. The last letter is the one worth the most, because it is the one that gives you a working search technique.</p>
<p class="pitfall">⚠️ Two traps. (1) <strong>Peer-reviewed is not the same as "on a database"</strong> — Scopus and Google Scholar both index non-reviewed material. (2) <strong>Peer review does not mean error-free</strong>; retractions exist. The slide says authoritative and credible, not correct.</p>`,
        `<p class="y-chinh">🎯 Sáu đặc điểm, và cái cuối cùng là cái sinh viên không bao giờ đoán ra: <strong>tác giả là chuyên gia · phản biện công trình khác · trình bày nghiên cứu MỚI · có quy trình bình duyệt · có thẩm quyền và đáng tin · bài báo KHÔNG đứng độc lập — chúng là một phần của mạng lưới tri thức</strong>.</p>
<table>
<tr><th>Đặc điểm</th><th>Nghĩa trong thực tế</th></tr>
<tr><td><strong>Tác giả chuyên gia</strong></td><td>Người đang nghiên cứu trong ngành đó, có nơi công tác rõ ràng</td></tr>
<tr><td><strong>Phản biện công trình khác</strong></td><td>Họ tranh luận lại, giới hạn lại hoặc mở rộng cái người trước công bố</td></tr>
<tr><td><strong>Trình bày nghiên cứu mới</strong></td><td>Báo cáo thứ chưa từng được công bố</td></tr>
<tr><td><strong>Quy trình bình duyệt</strong></td><td>Chuyên gia khác đọc và phán xét <em>TRƯỚC KHI</em> công bố</td></tr>
<tr><td><strong>Có thẩm quyền, đáng tin</strong></td><td>HỆ QUẢ của bốn điều trên (Blake &amp; Bly, 1993; Nwagwu &amp; Onyancha, 2015)</td></tr>
<tr><td><strong>Một phần của mạng tri thức</strong></td><td>Mỗi bài trích bài trước và bị bài sau trích lại (Alexander, Argent, &amp; Spencer, 2008)</td></tr>
</table>
<ul>
<li><strong>Bình duyệt là CƠ CHẾ; độ tin cậy là KẾT QUẢ.</strong> Giữ đúng chiều nhân quả đó — đề thi thích đảo ngược nó. Bình duyệt nghĩa là các chuyên gia cùng ngành đọc bản thảo trước khi công bố và có quyền từ chối. Nó KHÔNG nghĩa là bài báo đúng; nó nghĩa là bài báo đã qua một cái lọc.</li>
<li><strong>"Bài báo không đứng độc lập" là câu hữu dụng nhất trên slide.</strong> Danh mục tham khảo của mỗi bài là một tấm bản đồ đi <em>LÙI</em> thời gian, còn số lượt trích dẫn nó là bản đồ đi <em>TỚI</em>. Tìm được một bài tốt là bạn đã có cửa vào hai mươi bài khác. Kỹ thuật này gọi là truy vết trích dẫn (citation chaining), và nó nhanh hơn mọi phép tìm bằng từ khoá.</li>
<li><strong>Biến nó thành thao tác dùng được ngay hôm nay.</strong> Trên Google Scholar, mở một bài đúng chủ đề, rồi (1) đào danh mục tham khảo của nó để lấy các công trình nền, và (2) bấm "Cited by" để xem ai đã xây tiếp lên nó. Hai cú bấm cho bạn cả hai chiều của mạng lưới.</li>
<li><strong>Cách kiểm bình duyệt trong mười giây.</strong> Tìm tên tạp chí hoặc hội nghị, số tập/số kỳ/số trang, và mã DOI. Xem nhà xuất bản (IEEE, ACM, Springer, Elsevier, MDPI…). Một file PDF nằm trên trang cá nhân của ai đó mà không có mấy thứ trên thì là bản tiền ấn (preprint) hoặc bản nháp, không phải bài đã bình duyệt.</li>
<li><strong>Ở FPTU.</strong> Với mục "công trình liên quan" của SWP391, một bài được chọn khéo cộng danh mục tham khảo của nó cộng danh sách "Cited by" thường đủ dựng trọn cả mục — và nó ăn đứt việc đọc hai mươi kết quả tìm ngẫu nhiên.</li>
</ul>
<p class="meo">💡 Mẹo nhớ sáu ý: <strong>CHUYÊN — PHẢN — MỚI — DUYỆT — TIN — MẠNG</strong>. Chữ cuối đáng giá nhất, vì nó là chữ trao cho bạn một kỹ thuật tìm kiếm dùng được thật.</p>
<p class="pitfall">⚠️ Hai bẫy. (1) <strong>"Đã bình duyệt" KHÁC "có trên cơ sở dữ liệu"</strong> — Scopus và Google Scholar đều lập chỉ mục cả tài liệu chưa bình duyệt. (2) <strong>Bình duyệt KHÔNG nghĩa là không có lỗi</strong>; vẫn có bài bị rút. Slide viết "có thẩm quyền và đáng tin", không viết "đúng".</p>`],

      [34, '2.3 Accessing Information — learning outcomes (objectives only)',
        `<p class="y-chinh">🎯 A short objectives slide for section 2.3: <strong>know where to look for information from various sources</strong>, and <strong>find &amp; use information in a variety of modes</strong>. In this review deck the section body is not reproduced — only these two outcomes appear.</p>
<ul>
<li><strong>Say plainly what is on the image and what is not.</strong> The slide carries a heading and two bullets, nothing else. There is no list of databases, no diagram, no example. Anything more specific about section 2.3 must come from the MOOC itself on Coursera, not from this deck.</li>
<li><strong>"Various sources" is the first outcome, and it is a mapping task.</strong> Library catalogue, subject databases, Google Scholar, institutional repositories, standards bodies, government statistics, company documentation — each answers a different kind of question, and knowing which door to knock on is most of the skill.</li>
<li><strong>"A variety of modes" is the second, and it is about format.</strong> Text, video, podcast, dataset, code repository, interactive documentation. A concept you cannot get from a paper is often clear in a recorded conference talk by the same author.</li>
<li><strong>Applied at FPTU, the mapping looks like this.</strong> Definitions → textbook or library catalogue. Evidence for an effect → IEEE Xplore, ACM DL, Google Scholar. How an API actually behaves → the vendor's own documentation. How many people use something → an industry survey, clearly labelled as such.</li>
<li><strong>Why this section sits here in the sequence.</strong> Slides 28–33 told you <em>what kinds</em> of information exist. Section 2.3 asks <em>where</em> they live. Section 2.4, starting on the next slide, asks <em>how</em> to go and get them. What → where → how.</li>
</ul>
<p class="meo">💡 If an exam item quotes "find and use information in a variety of modes", it is testing that you know <strong>mode = format</strong> (text, video, data), not <strong>source = place</strong> (library, database, web). The two outcomes on this slide are the two halves of that distinction.</p>
<p class="pitfall">⚠️ Do not invent content for this slide from the section title. The review deck genuinely stops at the objectives here — treat 2.3 as a signpost, and get its detail from the Coursera module.</p>`,
        `<p class="y-chinh">🎯 Một slide mục tiêu ngắn cho mục 2.3: <strong>biết tìm thông tin ở đâu, từ nhiều nguồn khác nhau</strong>, và <strong>tìm &amp; dùng thông tin ở nhiều dạng thức khác nhau</strong>. Trong bộ slide ôn tập này, phần THÂN của mục 2.3 không được đưa vào — chỉ có đúng hai dòng mục tiêu.</p>
<ul>
<li><strong>Nói thẳng ảnh có gì và không có gì.</strong> Slide chỉ có một tiêu đề và hai gạch đầu dòng, hết. Không có danh sách cơ sở dữ liệu, không sơ đồ, không ví dụ. Mọi thứ cụ thể hơn về mục 2.3 phải lấy từ chính MOOC trên Coursera, không lấy từ deck này.</li>
<li><strong>"Nhiều nguồn khác nhau" là mục tiêu thứ nhất, và đó là bài toán LẬP BẢN ĐỒ.</strong> Mục lục thư viện, cơ sở dữ liệu chuyên ngành, Google Scholar, kho lưu trữ của trường, tổ chức tiêu chuẩn, thống kê nhà nước, tài liệu hãng — mỗi chỗ trả lời một loại câu hỏi khác nhau, và biết gõ cửa nào chính là phần lớn kỹ năng.</li>
<li><strong>"Nhiều dạng thức" là mục tiêu thứ hai, và nó nói về ĐỊNH DẠNG.</strong> Văn bản, video, podcast, bộ dữ liệu, kho mã nguồn, tài liệu tương tác. Một khái niệm bạn không lấy được từ bài báo thì thường sáng ra trong bản ghi hình buổi báo cáo hội nghị của chính tác giả đó.</li>
<li><strong>Áp vào FPTU, tấm bản đồ trông như sau.</strong> Định nghĩa → giáo trình hoặc mục lục thư viện. Bằng chứng về một hiệu quả → IEEE Xplore, ACM DL, Google Scholar. API thật sự hành xử ra sao → tài liệu chính chủ của hãng. Bao nhiêu người đang dùng → khảo sát ngành, và phải ghi rõ đó là khảo sát ngành.</li>
<li><strong>Vì sao mục này nằm đúng chỗ này trong mạch.</strong> Slide 28–33 cho bạn biết có những <em>LOẠI</em> thông tin nào. Mục 2.3 hỏi chúng <em>Ở ĐÂU</em>. Mục 2.4, bắt đầu ở slide sau, hỏi <em>LÀM SAO</em> đi lấy về. Cái gì → ở đâu → làm sao.</li>
</ul>
<p class="meo">💡 Câu thi nào trích cụm "find and use information in a variety of modes" là đang kiểm bạn có biết <strong>mode = định dạng</strong> (chữ, video, dữ liệu) chứ không phải <strong>source = nơi chốn</strong> (thư viện, CSDL, web) hay không. Hai mục tiêu trên slide chính là hai nửa của phân biệt đó.</p>
<p class="pitfall">⚠️ Đừng bịa nội dung cho slide này từ cái tên mục. Bộ slide ôn tập dừng thật ở phần mục tiêu — hãy coi 2.3 là biển chỉ đường, và lấy chi tiết từ module trên Coursera.</p>`],

      [35, '2.4a Defining an information need — learning outcomes',
        `<p class="y-chinh">🎯 The objectives for the most practical section of Mooc 1. Three outcomes: <strong>define an information need</strong> · <strong>use search terms &amp; develop a search strategy</strong> · <strong>apply strategies to document &amp; evaluate the information search process</strong>.</p>
<ul>
<li><strong>Read the three as a pipeline, because that is what slides 36–41 deliver.</strong> First you turn a vague assignment into a specific gap (the "information need"). Then you turn that gap into words a database will accept (search terms and strategy). Then you keep a record of what you did and judge whether it worked. Section 2.4 is split as a → b → c across slides 35, 42 and 43 for exactly those three stages.</li>
<li><strong>"Information need" is a term of art, so define it precisely.</strong> It is the gap between what you already know and what your task requires you to know. It is not "the topic" and it is not "the question" — it is the <em>difference</em> between the two, which is why step 2 (what you have) must come before step 3 (what you need).</li>
<li><strong>Why students skip this and pay for it.</strong> The natural instinct is to type the assignment title into Google and start reading. That produces hundreds of hits none of which are aimed at your actual gap, so you read a lot and write nothing. The five steps exist to stop that.</li>
<li><strong>At FPTU this pays off fastest on big-report subjects.</strong> SWP391, SWR302 and the graduation project all start from a loose brief. Half a page of step-1-to-step-5 planning before opening a browser typically saves several evenings of aimless reading.</li>
<li><strong>The third outcome is the one nobody does.</strong> Documenting the search — which terms, which database, which date, how many hits — is what lets you re-run it later, hand it to a teammate, and show a marker your process. Slide 43 comes back to it.</li>
</ul>
<p class="meo">💡 Three words for the three outcomes: <strong>NEED → TERMS → RECORD</strong>. Every question about section 2.4 lands in one of those three boxes.</p>
<p class="pitfall">⚠️ These three bullets appear <strong>again, word for word, on slide 42</strong> (2.4b). That is a repetition in the original deck, not two different lists. Do not waste memory trying to tell them apart.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu của mục THỰC DỤNG nhất trong Mooc 1. Ba kết quả: <strong>xác định một nhu cầu thông tin</strong> · <strong>dùng từ khoá tìm kiếm &amp; dựng một chiến lược tìm</strong> · <strong>áp dụng các cách để GHI LẠI &amp; ĐÁNH GIÁ quá trình tìm tin</strong>.</p>
<ul>
<li><strong>Đọc ba dòng như một DÂY CHUYỀN, vì slide 36–41 giao đúng như vậy.</strong> Trước hết biến một đề bài mơ hồ thành một lỗ hổng cụ thể ("nhu cầu thông tin"). Rồi biến lỗ hổng đó thành những chữ mà cơ sở dữ liệu chịu nhận (từ khoá và chiến lược). Rồi ghi lại việc mình đã làm và phán xem nó có ăn thua không. Mục 2.4 chia a → b → c ở slide 35, 42 và 43 đúng theo ba chặng đó.</li>
<li><strong>"Nhu cầu thông tin" là một thuật ngữ, nên định nghĩa cho chặt.</strong> Đó là KHOẢNG CÁCH giữa cái bạn đã biết và cái nhiệm vụ đòi bạn phải biết. Nó không phải "chủ đề", cũng không phải "câu hỏi" — nó là <em>HIỆU</em> của hai thứ đó, và chính vì thế bước 2 (bạn đang có gì) phải đứng trước bước 3 (bạn cần gì).</li>
<li><strong>Vì sao sinh viên bỏ qua bước này và phải trả giá.</strong> Bản năng là gõ nguyên tên đề bài vào Google rồi đọc. Cách đó cho ra hàng trăm kết quả mà không cái nào nhắm vào đúng lỗ hổng của bạn, nên bạn đọc rất nhiều mà không viết được gì. Năm bước sinh ra để chặn đúng chuyện đó.</li>
<li><strong>Ở FPTU nó có lãi nhanh nhất ở các môn làm báo cáo lớn.</strong> SWP391, SWR302 và khoá luận đều khởi đầu từ một đề bài lỏng. Nửa trang lập kế hoạch theo bước 1→5 trước khi mở trình duyệt thường tiết kiệm được vài buổi tối đọc lan man.</li>
<li><strong>Kết quả thứ ba là thứ không ai làm.</strong> Ghi lại quá trình tìm — từ khoá nào, cơ sở dữ liệu nào, ngày nào, ra bao nhiêu kết quả — chính là thứ cho phép bạn chạy lại sau này, bàn giao cho đồng đội, và chứng minh quy trình với người chấm. Slide 43 quay lại chuyện này.</li>
</ul>
<p class="meo">💡 Ba chữ cho ba kết quả: <strong>NHU CẦU → TỪ KHOÁ → GHI LẠI</strong>. Mọi câu hỏi về mục 2.4 đều rơi vào một trong ba ô đó.</p>
<p class="pitfall">⚠️ Ba gạch đầu dòng này xuất hiện <strong>LẠI, NGUYÊN VĂN, ở slide 42</strong> (2.4b). Đó là chỗ lặp của deck gốc, không phải hai danh sách khác nhau. Đừng phí trí nhớ để cố phân biệt chúng.</p>`],

      [36, 'Step 1: Break down into sub-topics — the worked example question',
        `<p class="y-chinh">🎯 Step 1 of five, and the slide gives you the assignment question that the next four slides will work on: <em>"Discuss the implications of artificial intelligence doing traditionally human tasks from technical, social and economic perspectives."</em> (Adapted from Windschuttle &amp; Elliott, 1999).</p>
<ul>
<li><strong>Breaking down means finding the question's own structure.</strong> This one hands you three sub-topics explicitly — <strong>technical</strong>, <strong>social</strong>, <strong>economic</strong> — plus an instruction verb (<em>discuss</em>), a subject (<em>artificial intelligence</em>), and a scope limit (<em>doing traditionally human tasks</em>). Five components, all visible in one sentence.</li>
<li><strong>The three perspectives become your section headings.</strong> That is the practical payoff: before you have read a single source, you already know the essay has three body sections, and you know that a source about AI ethics with nothing on economics only fills one of them.</li>
<li><strong>Watch the instruction verb, it sets the work.</strong> "Discuss" means present and weigh more than one position — it is not "describe" (just report) and not "evaluate" (judge against criteria). Getting the verb wrong is one of the most common ways to lose marks on an otherwise well-researched report.</li>
<li><strong>Do not lose the scope limit.</strong> "Traditionally human tasks" excludes a huge amount of AI writing — chip design, model architecture, training efficiency. A source can be about AI and still be out of scope. Writing the limit down at step 1 saves you from reading it.</li>
</ul>
<table>
<tr><th>Component</th><th>In this question</th><th>What it decides</th></tr>
<tr><td>Instruction verb</td><td>Discuss</td><td>What you must <em>do</em> with the evidence</td></tr>
<tr><td>Subject</td><td>Artificial intelligence</td><td>The main search concept</td></tr>
<tr><td>Scope limit</td><td>doing traditionally human tasks</td><td>What to exclude</td></tr>
<tr><td>Sub-topics</td><td>technical · social · economic</td><td>Your section headings</td></tr>
</table>
<p class="dap-an">✅ Worked for FPTU: "Evaluate the effectiveness of automated regression testing in small Agile teams." → verb = <strong>evaluate</strong> (judge against criteria, so you must state the criteria); subject = <strong>automated regression testing</strong>; scope = <strong>small Agile teams</strong>; sub-topics = whatever criteria you choose, e.g. defect detection · time cost · maintenance burden.</p>
<p class="meo">💡 Do step 1 with a pen on the printed question: circle the verb, underline the subject, box the scope limit, number the sub-topics. It takes ninety seconds and it is the highest-return ninety seconds in the whole process.</p>`,
        `<p class="y-chinh">🎯 Bước 1 trong năm, và slide đưa luôn đề bài mà bốn slide sau sẽ làm việc trên đó: <em>"Bàn luận về những hệ quả của việc trí tuệ nhân tạo làm các công việc vốn dành cho con người, từ góc độ kỹ thuật, xã hội và kinh tế."</em> (Phỏng theo Windschuttle &amp; Elliott, 1999).</p>
<ul>
<li><strong>"Bẻ nhỏ" nghĩa là tìm ra CẤU TRÚC có sẵn của chính câu hỏi.</strong> Câu này trao thẳng cho bạn ba tiểu chủ đề — <strong>kỹ thuật</strong>, <strong>xã hội</strong>, <strong>kinh tế</strong> — cộng thêm một động từ mệnh lệnh (<em>bàn luận</em>), một đối tượng (<em>trí tuệ nhân tạo</em>), và một giới hạn phạm vi (<em>làm các việc vốn của con người</em>). Năm thành phần, đều nhìn thấy trong đúng một câu.</li>
<li><strong>Ba góc độ đó trở thành TIÊU ĐỀ MỤC của bạn.</strong> Đó là cái lợi thực dụng: chưa đọc lấy một nguồn nào, bạn đã biết bài có ba phần thân, và biết rằng một nguồn nói về đạo đức AI mà không có chữ nào về kinh tế thì chỉ lấp được một phần.</li>
<li><strong>Canh kỹ động từ mệnh lệnh, nó quyết định khối lượng việc.</strong> "Discuss" (bàn luận) nghĩa là trình bày và cân nhắc NHIỀU HƠN MỘT quan điểm — nó không phải "describe" (chỉ thuật lại) và không phải "evaluate" (phán xét theo tiêu chí). Hiểu sai động từ là một trong những cách mất điểm phổ biến nhất, kể cả khi bạn đã tìm tài liệu rất tốt.</li>
<li><strong>Đừng làm rơi mất giới hạn phạm vi.</strong> "Các việc vốn của con người" loại bỏ một lượng khổng lồ bài viết về AI — thiết kế chip, kiến trúc mô hình, hiệu suất huấn luyện. Một nguồn có thể nói về AI mà vẫn NGOÀI phạm vi. Ghi cái giới hạn ra giấy ở bước 1 giúp bạn khỏi phải đọc nó.</li>
</ul>
<table>
<tr><th>Thành phần</th><th>Trong câu hỏi này</th><th>Nó quyết định gì</th></tr>
<tr><td>Động từ mệnh lệnh</td><td>Bàn luận (discuss)</td><td>Bạn phải <em>LÀM GÌ</em> với bằng chứng</td></tr>
<tr><td>Đối tượng</td><td>Trí tuệ nhân tạo</td><td>Khái niệm tìm kiếm chính</td></tr>
<tr><td>Giới hạn phạm vi</td><td>làm các việc vốn của con người</td><td>Cái gì bị LOẠI RA</td></tr>
<tr><td>Tiểu chủ đề</td><td>kỹ thuật · xã hội · kinh tế</td><td>Tiêu đề các mục của bạn</td></tr>
</table>
<p class="dap-an">✅ Làm thử cho FPTU: "Đánh giá hiệu quả của kiểm thử hồi quy tự động trong các nhóm Agile nhỏ." → động từ = <strong>đánh giá</strong> (phán theo tiêu chí, nên bạn BẮT BUỘC phải nêu tiêu chí); đối tượng = <strong>kiểm thử hồi quy tự động</strong>; phạm vi = <strong>nhóm Agile nhỏ</strong>; tiểu chủ đề = chính các tiêu chí bạn chọn, ví dụ khả năng bắt lỗi · chi phí thời gian · gánh nặng bảo trì.</p>
<p class="meo">💡 Làm bước 1 bằng bút trên đề in ra: khoanh tròn động từ, gạch chân đối tượng, đóng khung giới hạn, đánh số các tiểu chủ đề. Mất chín mươi giây, và đó là chín mươi giây lãi nhất trong cả quy trình.</p>`],

      [37, 'Step 2: What information do you have already?',
        `<p class="y-chinh">🎯 Before searching, inventory what you already hold. The slide asks you to go heading by heading and answer two questions — <strong>"What do you know about this topic?"</strong> and <strong>"What examples can you think of?"</strong> — then to <strong>assess the relevance of course materials, especially weekly readings</strong> (Van Geyte, 2013).</p>
<ul>
<li><strong>"Each of the headings" means the sub-topics from step 1.</strong> You do not inventory the essay as a whole; you inventory <em>technical</em>, then <em>social</em>, then <em>economic</em>, separately. Doing it separately is what makes the empty boxes visible, and the empty boxes are the whole point.</li>
<li><strong>The second question — examples — is the underrated one.</strong> Knowing a concept and being able to name a concrete case are different things, and an essay built only from concepts reads as hollow. If you can define "automation displacing labour" but cannot name one occupation and one study, you have a gap even though you feel informed.</li>
<li><strong>Why the slide singles out weekly readings.</strong> They were chosen by the person who will mark you, which makes them the highest-value sources you own, and they cost nothing to search. A source your lecturer set is one the marker already accepts as appropriate.</li>
<li><strong>Do it in writing, not in your head.</strong> A three-column table — heading · what I know · examples I can name — takes ten minutes and produces step 3 for free, because step 3 is simply the empty cells of that table.</li>
<li><strong>This step protects you from a real failure mode.</strong> Search first and you will happily collect sources for the sub-topic you already know best, because those are the words you can think of. The inventory forces attention onto the part you cannot yet talk about.</li>
</ul>
<p class="dap-an">✅ Worked on the slide's own question, social sub-topic: <em>I know</em> that automation changes which skills are valued and raises questions of fairness in who is displaced. <em>Examples I can name</em> — none with a source. ⇒ that is a genuine information need, and it is far more specific than "I need to read about AI and society".</p>
<p class="meo">💡 One-line version of step 2: <strong>list what you can already say WITHOUT looking anything up</strong>. Whatever you cannot say is the search list, and it will be much shorter and much sharper than the assignment title.</p>
<p class="pitfall">⚠️ Do not confuse step 2 with step 3. Step 2 is an <em>inventory of what you have</em>; step 3 is the <em>diagnosis of what is missing</em>. The exam can ask which step comes first — and "have" always comes before "need", because you cannot name a gap in a list you have not written.</p>`,
        `<p class="y-chinh">🎯 Trước khi tìm, hãy KIỂM KHO những gì bạn đã có. Slide bảo bạn đi từng tiêu đề một và trả lời hai câu — <strong>"Bạn biết gì về chủ đề này?"</strong> và <strong>"Bạn nghĩ ra được ví dụ nào?"</strong> — rồi <strong>đánh giá mức liên quan của tài liệu môn học, nhất là các bài đọc hằng tuần</strong> (Van Geyte, 2013).</p>
<ul>
<li><strong>"Từng tiêu đề" nghĩa là các tiểu chủ đề của bước 1.</strong> Bạn không kiểm kho cả bài; bạn kiểm <em>kỹ thuật</em>, rồi <em>xã hội</em>, rồi <em>kinh tế</em>, TÁCH RIÊNG. Chính việc tách riêng mới làm lộ ra các ô trống, mà các ô trống mới là mục đích.</li>
<li><strong>Câu hỏi thứ hai — ví dụ — là câu bị coi nhẹ oan.</strong> Biết một khái niệm và gọi tên được một trường hợp cụ thể là hai chuyện khác nhau, và bài viết chỉ toàn khái niệm thì đọc rỗng. Nếu bạn định nghĩa được "tự động hoá thay thế lao động" mà không nêu nổi MỘT nghề và MỘT nghiên cứu, thì bạn đang có lỗ hổng dù cảm giác là mình đã biết.</li>
<li><strong>Vì sao slide gọi riêng bài đọc hằng tuần ra.</strong> Chúng do chính người sẽ chấm bạn chọn, nên chúng là những nguồn giá trị nhất bạn đang sở hữu, và tìm chúng thì không mất công gì. Nguồn do giảng viên giao là nguồn mà người chấm đã mặc nhiên công nhận là phù hợp.</li>
<li><strong>Làm BẰNG CHỮ, đừng làm trong đầu.</strong> Một bảng ba cột — tiêu đề · mình biết gì · ví dụ gọi tên được — mất mười phút và cho không bạn bước 3, vì bước 3 chính là các ô trống của bảng đó.</li>
<li><strong>Bước này chắn cho bạn một kiểu hỏng rất thật.</strong> Tìm trước thì bạn sẽ vui vẻ gom tài liệu cho đúng cái tiểu chủ đề bạn vốn rành nhất, bởi đó là những chữ bạn nghĩ ra được. Bảng kiểm kho ép sự chú ý về phía phần bạn chưa nói nổi.</li>
</ul>
<p class="dap-an">✅ Làm thử trên chính câu hỏi của slide, tiểu chủ đề xã hội: <em>Mình biết</em> rằng tự động hoá làm đổi kỹ năng nào được coi trọng và đặt ra câu hỏi công bằng về việc ai bị thay thế. <em>Ví dụ gọi tên được</em> — không có cái nào kèm nguồn. ⇒ đó là một nhu cầu thông tin THẬT, và nó cụ thể hơn nhiều so với "mình cần đọc về AI và xã hội".</p>
<p class="meo">💡 Bản một dòng của bước 2: <strong>liệt kê những gì bạn nói được NGAY mà KHÔNG cần tra cứu</strong>. Phần bạn không nói được chính là danh sách cần tìm, và nó sẽ ngắn hơn, sắc hơn cái tên đề bài rất nhiều.</p>
<p class="pitfall">⚠️ Đừng lẫn bước 2 với bước 3. Bước 2 là <em>kiểm kê thứ bạn ĐANG CÓ</em>; bước 3 là <em>chẩn đoán thứ còn THIẾU</em>. Đề thi có thể hỏi bước nào trước — và "đang có" luôn trước "còn thiếu", vì bạn không thể chỉ ra lỗ hổng trên một danh sách chưa viết ra.</p>`],

      [38, 'Step 3: What information do you need?',
        `<p class="y-chinh">🎯 The diagnosis step. Three instructions: <strong>look for gaps in your notes or places where additional evidence is needed</strong> · <strong>consider the types of sources you should cite in your field and for this topic</strong> · <strong>think about where you can find this information</strong>.</p>
<table>
<tr><th>The slide's instruction</th><th>It answers</th><th>Output you should write down</th></tr>
<tr><td>Look for gaps / where evidence is needed</td><td><em>What</em> is missing</td><td>A list of specific unanswered questions</td></tr>
<tr><td>Consider the types of sources for your field and topic</td><td><em>What kind</em> of source will count</td><td>e.g. peer-reviewed study, standard, dataset</td></tr>
<tr><td>Think about where you can find it</td><td><em>Where</em> to look</td><td>e.g. IEEE Xplore, Scholar, library catalogue</td></tr>
</table>
<ul>
<li><strong>Two different gaps, and the slide names both.</strong> A gap in your <em>notes</em> is something you do not know. A place where <em>additional evidence is needed</em> is something you do know but cannot yet prove. The second kind is the one that sinks reports: an assertion with no citation behind it.</li>
<li><strong>"Types of sources … in your field" is slide 28 coming back to work.</strong> This is why the deck spent four slides on textbooks, course notes and journal articles: at step 3 you must decide, before searching, which type your claim requires. Deciding afterwards means taking whatever the search engine happened to return.</li>
<li><strong>Turn every gap into a question, not a topic.</strong> "AI and jobs" is a topic and it returns everything. "Which occupations have measurable employment change attributable to AI adoption since 2015?" is a question, and it tells you immediately whether a hit is useful.</li>
<li><strong>At FPTU, step 3 is what your supervisor is really asking for.</strong> When they say "your related-work section is thin", they mean claims without evidence — exactly the second kind of gap. Listing those claims first turns a vague criticism into a concrete search list.</li>
</ul>
<p class="dap-an">✅ Worked example, continuing the AI question: gap = "no named occupation with data" → source type needed = <strong>peer-reviewed empirical study or official labour statistics</strong> (not a news article, not a blog) → where = <strong>Google Scholar + a national statistics office</strong>. Three lines, and the search is now fully specified.</p>
<p class="meo">💡 Step 3 has three outputs and they map to three questions: <strong>WHAT is missing · WHAT KIND of source counts · WHERE to look</strong>. If you can say all three out loud, you are ready for step 4.</p>
<p class="pitfall">⚠️ Skipping the middle instruction is the classic mistake. If you do not decide the <em>type</em> of source first, you will end up citing a Medium post for a claim that needed a study — and by then you have already read it and it feels like a waste to throw away.</p>`,
        `<p class="y-chinh">🎯 Bước CHẨN ĐOÁN. Ba chỉ dẫn: <strong>tìm các lỗ hổng trong ghi chép của bạn hoặc những chỗ cần thêm bằng chứng</strong> · <strong>cân nhắc những LOẠI nguồn bạn nên trích trong ngành của mình và cho chủ đề này</strong> · <strong>nghĩ xem có thể tìm thông tin đó ở đâu</strong>.</p>
<table>
<tr><th>Chỉ dẫn trên slide</th><th>Nó trả lời</th><th>Đầu ra bạn phải viết ra</th></tr>
<tr><td>Tìm lỗ hổng / chỗ cần thêm bằng chứng</td><td><em>CÁI GÌ</em> còn thiếu</td><td>Danh sách các câu hỏi cụ thể chưa có lời đáp</td></tr>
<tr><td>Cân nhắc loại nguồn theo ngành và chủ đề</td><td><em>LOẠI</em> nguồn nào mới được tính</td><td>ví dụ: nghiên cứu bình duyệt, tiêu chuẩn, bộ dữ liệu</td></tr>
<tr><td>Nghĩ xem tìm ở đâu</td><td><em>Ở ĐÂU</em> mà tìm</td><td>ví dụ: IEEE Xplore, Scholar, mục lục thư viện</td></tr>
</table>
<ul>
<li><strong>HAI loại lỗ hổng khác nhau, và slide gọi tên cả hai.</strong> Lỗ hổng trong <em>ghi chép</em> là thứ bạn KHÔNG BIẾT. Chỗ <em>cần thêm bằng chứng</em> là thứ bạn có biết nhưng chưa chứng minh được. Loại thứ hai mới là thứ nhấn chìm các báo cáo: một khẳng định không có trích dẫn nào đứng sau.</li>
<li><strong>"Loại nguồn… trong ngành của bạn" là slide 28 quay lại làm việc.</strong> Đó là lý do deck bỏ ra bốn slide cho giáo trình, tài liệu môn và bài báo: ở bước 3 bạn phải quyết, TRƯỚC khi tìm, rằng khẳng định của mình cần loại nguồn nào. Quyết sau nghĩa là lấy bừa thứ mà máy tìm kiếm tình cờ trả về.</li>
<li><strong>Biến mọi lỗ hổng thành một CÂU HỎI, không phải một chủ đề.</strong> "AI và việc làm" là chủ đề và nó trả về tất cả mọi thứ. "Những nghề nào có mức thay đổi việc làm đo được, quy được cho việc áp dụng AI từ 2015?" là câu hỏi, và nó cho bạn biết ngay một kết quả có dùng được không.</li>
<li><strong>Ở FPTU, bước 3 mới là thứ giảng viên hướng dẫn thật sự đang đòi.</strong> Khi thầy nói "phần công trình liên quan của em mỏng", ý là các khẳng định không có bằng chứng — đúng loại lỗ hổng thứ hai. Liệt kê các khẳng định đó ra trước là biến một lời chê mơ hồ thành một danh sách cần tìm cụ thể.</li>
</ul>
<p class="dap-an">✅ Ví dụ làm tiếp câu hỏi về AI: lỗ hổng = "chưa có nghề nào gọi tên được kèm số liệu" → loại nguồn cần = <strong>nghiên cứu thực nghiệm đã bình duyệt hoặc thống kê lao động chính thức</strong> (không phải bài báo chí, không phải blog) → ở đâu = <strong>Google Scholar + cơ quan thống kê quốc gia</strong>. Ba dòng, và phép tìm giờ đã được đặc tả đầy đủ.</p>
<p class="meo">💡 Bước 3 có ba đầu ra ứng với ba câu hỏi: <strong>THIẾU cái gì · LOẠI nguồn nào được tính · TÌM ở đâu</strong>. Nói to được cả ba là bạn sẵn sàng cho bước 4.</p>
<p class="pitfall">⚠️ Bỏ qua chỉ dẫn GIỮA là sai lầm kinh điển. Không quyết <em>LOẠI</em> nguồn trước thì bạn sẽ kết thúc bằng việc trích một bài Medium cho một khẳng định vốn cần một nghiên cứu — và tới lúc đó bạn đã đọc nó rồi, vứt đi thấy tiếc.</p>`],

      [39, 'Step 4: Develop a set of search terms by thinking of synonyms',
        `<p class="y-chinh">🎯 Databases match <em>words</em>, not <em>ideas</em>. So for every key term in the question, the slide builds a row of synonyms (Stebbins, 2006) — six concepts, each with alternatives, drawn straight from the AI question of slide 36.</p>
<table>
<tr><th>Key term from the question</th><th>Synonyms the slide lists</th></tr>
<tr><td>artificial intelligence</td><td>robot, machine learning</td></tr>
<tr><td>human tasks</td><td>jobs, activities, employment</td></tr>
<tr><td>implications</td><td>positive/negative effects, changes</td></tr>
<tr><td>technical</td><td>technology, ICT, software, hardware</td></tr>
<tr><td>social</td><td>society, community</td></tr>
<tr><td>economic</td><td>economy, financial, employment, unemployment</td></tr>
</table>
<ul>
<li><strong>Why synonyms are not optional.</strong> An author who wrote about the same phenomenon in 2016 may never use your word once. Search only "artificial intelligence" and you silently lose every paper that said "machine learning" or "automation" — and you will never know what you missed, because a search engine does not report what it failed to find.</li>
<li><strong>Read the table as rows and columns, because that is how you will use it.</strong> Terms <em>within</em> a row are alternatives — join them with <strong>OR</strong>. Terms <em>across</em> rows are different concepts you want simultaneously — join them with <strong>AND</strong>. That single rule converts this table into a working query, which is exactly what slide 40 does.</li>
<li><strong>Notice "employment" appears in two rows.</strong> It is a synonym for both <em>human tasks</em> and <em>economic</em>. That is normal and it is a hint that those two sub-topics will overlap in your results — plan to sort that overlap, not to be surprised by it.</li>
<li><strong>Where to get synonyms when you are stuck.</strong> The keywords listed under a paper's abstract; the subject headings a database attaches to a record; the vocabulary in your textbook's index. Do not invent them — harvest them from sources that already exist in that field.</li>
</ul>
<p class="dap-an">✅ Built for an FPTU topic: "automated testing" → automated testing OR test automation OR automated regression testing OR CI testing. "small team" → small team OR startup OR SME OR "small and medium enterprise". Two rows, ready to be combined on the next slide.</p>
<p class="meo">💡 Remember the shape: <strong>rows = OR, columns = AND</strong>. Every search strategy you will ever write is that one table, filled in.</p>
<p class="pitfall">⚠️ Do not treat the slide's synonyms as equivalents. "Robot" is <em>not</em> a synonym for artificial intelligence in a technical sense — a robot is embodied hardware, AI may be pure software. For searching they are usefully close; in your writing, using them interchangeably is an error.</p>`,
        `<p class="y-chinh">🎯 Cơ sở dữ liệu khớp <em>CHỮ</em>, không khớp <em>Ý</em>. Nên với mỗi từ khoá trong đề bài, slide dựng một hàng từ đồng nghĩa (Stebbins, 2006) — sáu khái niệm, mỗi cái kèm các lựa chọn thay thế, lấy thẳng từ câu hỏi về AI ở slide 36.</p>
<table>
<tr><th>Từ khoá trong đề</th><th>Từ đồng nghĩa slide liệt kê</th></tr>
<tr><td>artificial intelligence</td><td>robot, machine learning</td></tr>
<tr><td>human tasks</td><td>jobs, activities, employment</td></tr>
<tr><td>implications</td><td>positive/negative effects, changes</td></tr>
<tr><td>technical</td><td>technology, ICT, software, hardware</td></tr>
<tr><td>social</td><td>society, community</td></tr>
<tr><td>economic</td><td>economy, financial, employment, unemployment</td></tr>
</table>
<ul>
<li><strong>Vì sao từ đồng nghĩa KHÔNG phải tuỳ chọn.</strong> Một tác giả viết về đúng hiện tượng đó năm 2016 có thể không dùng chữ của bạn lấy một lần. Chỉ tìm "artificial intelligence" là bạn âm thầm mất sạch mọi bài viết "machine learning" hay "automation" — và bạn sẽ không bao giờ biết mình mất gì, vì máy tìm kiếm không báo cáo những thứ nó KHÔNG tìm được.</li>
<li><strong>Đọc bảng theo HÀNG và CỘT, vì bạn sẽ dùng nó đúng như thế.</strong> Các từ <em>TRONG một hàng</em> là lựa chọn thay thế nhau — nối bằng <strong>OR</strong>. Các từ <em>KHÁC hàng</em> là những khái niệm khác nhau mà bạn muốn có ĐỒNG THỜI — nối bằng <strong>AND</strong>. Đúng một quy tắc đó biến bảng này thành một truy vấn chạy được, và slide 40 làm chính việc ấy.</li>
<li><strong>Để ý chữ "employment" nằm ở HAI hàng.</strong> Nó vừa là đồng nghĩa của <em>human tasks</em> vừa của <em>economic</em>. Chuyện đó bình thường, và nó báo trước rằng hai tiểu chủ đề ấy sẽ chồng lấn trong kết quả — hãy tính trước để phân loại chỗ chồng lấn đó, đừng để bị bất ngờ.</li>
<li><strong>Lấy từ đồng nghĩa ở đâu khi bí.</strong> Mục keywords dưới abstract của một bài báo; các đề mục chủ đề mà cơ sở dữ liệu gán cho bản ghi; bảng tra cứu cuối giáo trình. Đừng bịa ra — hãy THU HOẠCH từ những nguồn đã có sẵn trong ngành đó.</li>
</ul>
<p class="dap-an">✅ Dựng cho một đề tài FPTU: "kiểm thử tự động" → automated testing OR test automation OR automated regression testing OR CI testing. "nhóm nhỏ" → small team OR startup OR SME OR "small and medium enterprise". Hai hàng, sẵn sàng để ghép ở slide sau.</p>
<p class="meo">💡 Nhớ đúng hình dạng: <strong>hàng = OR, cột = AND</strong>. Mọi chiến lược tìm kiếm bạn sẽ viết trong đời đều là đúng cái bảng này, điền vào.</p>
<p class="pitfall">⚠️ Đừng coi các từ đồng nghĩa trên slide là TƯƠNG ĐƯƠNG. "Robot" KHÔNG phải đồng nghĩa của trí tuệ nhân tạo về mặt kỹ thuật — robot là phần cứng có thân xác, AI có thể thuần phần mềm. Để TÌM thì chúng gần nhau một cách hữu ích; nhưng khi VIẾT mà dùng lẫn lộn là sai.</p>`],

      [40, 'Step 5: Combine search terms to enter into databases and search engines',
        `<p class="y-chinh">🎯 The final step turns the synonym table into queries. The slide shows three, written with a plus sign: <strong>"robots + positive effects"</strong>, <strong>"robots + jobs"</strong>, <strong>"artificial intelligence + unemployment"</strong> (Van Geyte, 2013).</p>
<ul>
<li><strong>The "+" on the slide means AND.</strong> It is shorthand for "both concepts must appear". Real databases spell it <code>AND</code>, and Google Scholar treats a space as AND. Say it out loud as "robots AND jobs" and the logic is unmistakable.</li>
<li><strong>Three operators carry almost all the power.</strong> <code>AND</code> narrows (both must appear) · <code>OR</code> widens (either will do, use it for the synonyms of one row) · <code>NOT</code> excludes (drop a meaning you keep hitting). Too many results ⇒ add AND. Too few ⇒ add OR. Wrong results ⇒ add NOT.</li>
<li><strong>Brackets and quotes are what make a multi-row table work.</strong> Quotes force an exact phrase — <code>"machine learning"</code> without them is two separate words. Brackets group the OR-row so it is not torn apart by the AND. The wildcard <code>*</code> catches word endings: <code>employ*</code> matches employ, employment, employee, employers.</li>
<li><strong>Filters are the fourth lever and the cheapest one.</strong> Year range (last 5 years for a technology claim), document type (article, review, conference paper), language, and peer-reviewed-only. One date filter usually removes more noise than an hour of rewording.</li>
</ul>
<pre>(&quot;artificial intelligence&quot; OR &quot;machine learning&quot; OR robot*)
AND (job* OR employ* OR occupation*)
AND (impact OR effect OR implication*)
NOT medical</pre>
<p class="dap-an">✅ Type-it-today version for SWP391/SWR302, on Google Scholar: <code>("test automation" OR "automated regression testing") AND ("agile" OR "scrum") AND (defect* OR "code quality")</code> — then set the year filter to 2019 onward and sort by relevance. Google Scholar also accepts <code>author:</code> and <code>source:</code> prefixes, and its "Cited by" link gives you the forward half of the web of knowledge from slide 33.</p>
<table>
<tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
<tr><td>Thousands of hits, mostly irrelevant</td><td>Concepts too broad, no AND</td><td>Add a concept with AND; add quotes; add a year filter</td></tr>
<tr><td>Almost no hits</td><td>Only one wording tried</td><td>Add the synonym row with OR; try a wildcard</td></tr>
<tr><td>Right words, wrong field</td><td>Term is ambiguous</td><td>NOT the other field, or add a discipline term with AND</td></tr>
</table>
<p class="meo">💡 The whole of step 5 in one line: <strong>OR inside a concept, AND between concepts, quotes for phrases, NOT for the meaning you keep hitting by accident.</strong></p>
<p class="pitfall">⚠️ The slide's plus-sign notation is a teaching shorthand, not a standard. Typing <code>+</code> in Google no longer forces a term (that was removed years ago), and most library databases will simply treat it as punctuation. Learn the words <code>AND OR NOT</code> — those work everywhere.</p>`,
        `<p class="y-chinh">🎯 Bước cuối biến bảng từ đồng nghĩa thành TRUY VẤN. Slide đưa ba cái, viết bằng dấu cộng: <strong>'robots + positive effects'</strong>, <strong>'robots + jobs'</strong>, <strong>'artificial intelligence + unemployment'</strong> (Van Geyte, 2013).</p>
<ul>
<li><strong>Dấu "+" trên slide nghĩa là AND.</strong> Nó là lối viết tắt cho "cả hai khái niệm đều phải xuất hiện". Cơ sở dữ liệu thật viết là <code>AND</code>, còn Google Scholar coi dấu cách là AND. Đọc to thành "robots AND jobs" là logic hiện ra ngay.</li>
<li><strong>Ba toán tử gánh gần hết sức mạnh.</strong> <code>AND</code> THU HẸP (cả hai phải có) · <code>OR</code> MỞ RỘNG (có cái nào cũng được, dùng cho các từ đồng nghĩa của một hàng) · <code>NOT</code> LOẠI TRỪ (bỏ một nghĩa cứ dội vào mãi). Quá nhiều kết quả ⇒ thêm AND. Quá ít ⇒ thêm OR. Sai hướng ⇒ thêm NOT.</li>
<li><strong>Dấu ngoặc và dấu nháy kép mới là thứ làm bảng nhiều hàng chạy được.</strong> Dấu nháy kép ép tìm ĐÚNG CỤM — <code>"machine learning"</code> mà bỏ nháy thì thành hai từ rời. Dấu ngoặc gom hàng OR lại để nó không bị AND xé toạc. Ký tự đại diện <code>*</code> bắt phần đuôi từ: <code>employ*</code> khớp employ, employment, employee, employers.</li>
<li><strong>Bộ lọc là cần gạt thứ tư và là cái rẻ nhất.</strong> Khoảng năm (5 năm gần nhất cho một khẳng định về công nghệ), loại tài liệu (bài báo, bài tổng quan, bài hội nghị), ngôn ngữ, và chỉ-lấy-bài-bình-duyệt. Một cái lọc theo năm thường dọn được nhiều nhiễu hơn cả tiếng đồng hồ ngồi đổi chữ.</li>
</ul>
<pre>(&quot;artificial intelligence&quot; OR &quot;machine learning&quot; OR robot*)
AND (job* OR employ* OR occupation*)
AND (impact OR effect OR implication*)
NOT medical</pre>
<p class="dap-an">✅ Bản gõ-được-ngay cho SWP391/SWR302, trên Google Scholar: <code>("test automation" OR "automated regression testing") AND ("agile" OR "scrum") AND (defect* OR "code quality")</code> — rồi đặt bộ lọc năm từ 2019 trở đi và sắp theo mức liên quan. Google Scholar còn nhận tiền tố <code>author:</code> và <code>source:</code>, và cái link "Cited by" của nó cho bạn nửa ĐI TỚI của mạng lưới tri thức ở slide 33.</p>
<table>
<tr><th>Triệu chứng</th><th>Nguyên nhân</th><th>Cách chữa</th></tr>
<tr><td>Hàng nghìn kết quả, phần lớn lạc đề</td><td>Khái niệm quá rộng, thiếu AND</td><td>Thêm một khái niệm bằng AND; thêm nháy kép; lọc theo năm</td></tr>
<tr><td>Gần như không có kết quả</td><td>Mới thử đúng một cách diễn đạt</td><td>Thêm hàng từ đồng nghĩa bằng OR; thử ký tự đại diện</td></tr>
<tr><td>Đúng chữ, sai ngành</td><td>Thuật ngữ đa nghĩa</td><td>NOT ngành kia, hoặc AND thêm một từ thuộc ngành mình</td></tr>
</table>
<p class="meo">💡 Trọn bước 5 trong một dòng: <strong>OR bên trong một khái niệm, AND giữa các khái niệm, nháy kép cho cụm từ, NOT cho cái nghĩa cứ vô tình dội vào.</strong></p>
<p class="pitfall">⚠️ Lối viết dấu cộng của slide là quy ước DẠY HỌC, không phải chuẩn. Gõ <code>+</code> vào Google không còn ép từ khoá nữa (tính năng đó đã bỏ nhiều năm trước), và phần lớn CSDL thư viện chỉ coi nó là dấu câu. Hãy học ba chữ <code>AND OR NOT</code> — chúng chạy ở mọi nơi.</p>`],

      [41, 'Summary: Defining an Information Need by Analyzing Questions — the five steps',
        `<p class="y-chinh">🎯 The five steps on one page, with the full citation trail: <strong>break down into sub-topics → what information do you have already? → what information do you need? → develop a set of search terms by thinking of synonyms → combine search terms to enter into databases and search engines</strong> (Stebbins, 2006; Van Geyte, 2013; Windschuttle &amp; Elliott, 1999).</p>
<table>
<tr><th>Step</th><th>Question it answers</th><th>What you produce</th></tr>
<tr><td>1 Break down</td><td>What is the question really asking?</td><td>Sub-topics, verb, scope limit</td></tr>
<tr><td>2 What you have</td><td>What can I already say?</td><td>An inventory per sub-topic</td></tr>
<tr><td>3 What you need</td><td>What is missing, what kind, from where?</td><td>A list of specific questions</td></tr>
<tr><td>4 Search terms</td><td>What words will the database recognise?</td><td>A synonym table</td></tr>
<tr><td>5 Combine</td><td>How do the words go together?</td><td>Boolean queries to run</td></tr>
</table>
<ul>
<li><strong>The order is the examinable part.</strong> Notice that steps 1–3 involve no searching at all. Three of five steps happen before you open a browser, which is precisely the habit the course is trying to build. An exam item asking "what is the first step" is asking whether you learned that.</li>
<li><strong>Each step consumes the previous one's output.</strong> Sub-topics (1) become the headings you inventory (2); the empty cells (2) become the gaps (3); the gaps (3) become the key terms you find synonyms for (4); the synonym rows (4) become the OR groups you AND together (5). Nothing in the chain is decorative.</li>
<li><strong>It is a loop, not a line.</strong> Run the queries, look at what comes back, and you will discover a better synonym or a sub-topic you missed — go back to step 4 or step 1. Slide 43 makes this explicit by asking you to <em>evaluate</em> the strategy.</li>
<li><strong>Do it once properly and it becomes automatic.</strong> The first time this takes thirty minutes on paper. By your third report it is five minutes in your head, and the difference in the quality of what you find is very visible.</li>
</ul>
<p class="dap-an">✅ Self-test without looking: name the five steps in order. If you can only produce four, the one people drop is almost always <strong>step 2 (what you already have)</strong> — because it feels like it is not doing anything, when it is the step that makes step 3 possible.</p>
<p class="meo">💡 Five words to carry in: <strong>BREAK · HAVE · NEED · SYNONYMS · COMBINE</strong>. Rhythm it as 3 steps of thinking, then 2 steps of wording.</p>`,
        `<p class="y-chinh">🎯 Năm bước gói trong một trang, kèm đủ dấu vết trích dẫn: <strong>bẻ nhỏ thành tiểu chủ đề → bạn đã có sẵn thông tin gì? → bạn cần thông tin gì? → dựng bộ từ khoá bằng cách nghĩ từ đồng nghĩa → ghép từ khoá để gõ vào cơ sở dữ liệu và máy tìm kiếm</strong> (Stebbins, 2006; Van Geyte, 2013; Windschuttle &amp; Elliott, 1999).</p>
<table>
<tr><th>Bước</th><th>Nó trả lời câu hỏi nào</th><th>Bạn tạo ra cái gì</th></tr>
<tr><td>1 Bẻ nhỏ</td><td>Đề bài thật ra đang hỏi gì?</td><td>Tiểu chủ đề, động từ, giới hạn phạm vi</td></tr>
<tr><td>2 Đang có gì</td><td>Mình nói được sẵn những gì?</td><td>Bảng kiểm kho theo từng tiểu chủ đề</td></tr>
<tr><td>3 Cần gì</td><td>Thiếu gì, loại nào, lấy ở đâu?</td><td>Danh sách câu hỏi cụ thể</td></tr>
<tr><td>4 Từ khoá</td><td>CSDL nhận ra những chữ nào?</td><td>Bảng từ đồng nghĩa</td></tr>
<tr><td>5 Ghép</td><td>Các chữ ghép với nhau ra sao?</td><td>Truy vấn Boolean để chạy</td></tr>
</table>
<ul>
<li><strong>THỨ TỰ mới là phần đi thi.</strong> Để ý bước 1–3 KHÔNG hề có thao tác tìm kiếm nào. Ba trên năm bước xảy ra trước khi bạn mở trình duyệt, và đó chính xác là thói quen môn học muốn tạo. Câu thi hỏi "bước đầu tiên là gì" là đang kiểm bạn có học được điều đó không.</li>
<li><strong>Mỗi bước ĂN đầu ra của bước trước.</strong> Tiểu chủ đề (1) thành các tiêu đề để kiểm kho (2); các ô trống (2) thành lỗ hổng (3); lỗ hổng (3) thành các từ khoá cần tìm đồng nghĩa (4); các hàng đồng nghĩa (4) thành các nhóm OR để AND lại (5). Không mắt xích nào là trang trí.</li>
<li><strong>Đó là một VÒNG LẶP, không phải đường thẳng.</strong> Chạy truy vấn, nhìn cái trả về, bạn sẽ phát hiện một từ đồng nghĩa hay hơn hoặc một tiểu chủ đề bị sót — quay lại bước 4 hoặc bước 1. Slide 43 nói thẳng chuyện này khi bắt bạn <em>ĐÁNH GIÁ</em> chiến lược.</li>
<li><strong>Làm tử tế một lần là thành phản xạ.</strong> Lần đầu mất ba mươi phút trên giấy. Tới báo cáo thứ ba thì mất năm phút trong đầu, và chênh lệch về chất lượng thứ bạn tìm được thì thấy rất rõ.</li>
</ul>
<p class="dap-an">✅ Tự kiểm không nhìn: kể năm bước theo đúng thứ tự. Nếu chỉ ra được bốn, thì bước bị rơi gần như luôn là <strong>bước 2 (cái mình đang có)</strong> — vì nó có cảm giác chẳng làm gì cả, trong khi nó chính là bước khiến bước 3 khả thi.</p>
<p class="meo">💡 Năm chữ mang vào phòng thi: <strong>BẺ · CÓ · CẦN · ĐỒNG NGHĨA · GHÉP</strong>. Đọc theo nhịp 3 bước NGHĨ, rồi 2 bước CHỮ.</p>`],

      [42, '2.4b Developing a Search Strategy — learning outcomes (identical to 2.4a)',
        `<p class="y-chinh">🎯 The objectives slide for section 2.4b. Read the image carefully: the three bullets are <strong>word for word the same as slide 35</strong> — define an information need · use search terms &amp; develop a search strategy · apply strategies to document &amp; evaluate the information search process.</p>
<ul>
<li><strong>Say the repetition out loud rather than pretending it is new.</strong> Sections 2.4a, 2.4b and 2.4c share one set of outcomes because they are three stages of one skill. The heading changes (Defining an information need → Developing a Search Strategy → Documenting and evaluating); the outcomes do not.</li>
<li><strong>What "search strategy" actually names.</strong> Not a single query — a <em>documented plan</em>: the concepts, the synonyms for each, how they combine, which databases you will use, and which filters you will apply. A strategy can be handed to somebody else and re-run; a query typed and forgotten cannot.</li>
<li><strong>A usable template, since the slide gives none.</strong> One table with four columns — concept · synonyms (OR) · database · filters — plus a line for the final combined string. That table <em>is</em> your search strategy, and it is also what slide 43 asks you to document.</li>
<li><strong>Refining is part of the strategy, not a sign it failed.</strong> Run it, then adjust: too broad ⇒ add a concept with AND or tighten the date range; too narrow ⇒ add synonyms with OR, drop your least essential concept, or try a wildcard. Expect two or three rounds.</li>
<li><strong>At FPTU.</strong> Put this table in an appendix of your SWP391 or SWR302 report. It takes half a page, it demonstrates a method rather than a lucky find, and when a teammate needs to extend your related-work section they can re-run your searches instead of starting over.</li>
</ul>
<table>
<tr><th>Concept</th><th>Synonyms (join with OR)</th><th>Where</th><th>Filters</th></tr>
<tr><td>test automation</td><td>"test automation" OR "automated testing" OR "automated regression testing"</td><td>IEEE Xplore, Scholar</td><td>2019+, conference/journal</td></tr>
<tr><td>agile team</td><td>agile OR scrum OR "small team"</td><td>same</td><td>English</td></tr>
<tr><td>outcome</td><td>defect* OR "code quality" OR "release frequency"</td><td>same</td><td>—</td></tr>
</table>
<p class="meo">💡 Distinguish the three by their <strong>output</strong>, since the bullets will not help you: 2.4a produces a <em>need</em>, 2.4b produces a <em>plan</em>, 2.4c produces a <em>record plus a judgement</em>.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của mục 2.4b. Đọc kỹ ảnh: ba gạch đầu dòng <strong>GIỐNG NGUYÊN VĂN slide 35</strong> — xác định nhu cầu thông tin · dùng từ khoá &amp; dựng chiến lược tìm · áp dụng cách ghi lại &amp; đánh giá quá trình tìm tin.</p>
<ul>
<li><strong>Nói thẳng ra chỗ lặp thay vì giả vờ đó là nội dung mới.</strong> Mục 2.4a, 2.4b và 2.4c dùng chung MỘT bộ mục tiêu vì chúng là ba chặng của cùng một kỹ năng. Tiêu đề thì đổi (Xác định nhu cầu → Dựng chiến lược tìm → Ghi lại và đánh giá); mục tiêu thì không.</li>
<li><strong>"Chiến lược tìm" thật ra gọi tên cái gì.</strong> Không phải một truy vấn đơn lẻ — mà là một <em>KẾ HOẠCH CÓ GHI LẠI</em>: các khái niệm, từ đồng nghĩa của từng khái niệm, cách ghép chúng, sẽ dùng cơ sở dữ liệu nào, và áp bộ lọc nào. Một chiến lược có thể đưa cho người khác chạy lại; một truy vấn gõ xong rồi quên thì không.</li>
<li><strong>Một khuôn mẫu dùng được, vì slide không cho cái nào.</strong> Một bảng bốn cột — khái niệm · từ đồng nghĩa (OR) · cơ sở dữ liệu · bộ lọc — cộng một dòng ghi chuỗi truy vấn cuối cùng. Cái bảng đó CHÍNH LÀ chiến lược tìm của bạn, và cũng chính là thứ slide 43 bắt bạn ghi lại.</li>
<li><strong>Tinh chỉnh là MỘT PHẦN của chiến lược, không phải dấu hiệu thất bại.</strong> Chạy rồi chỉnh: quá rộng ⇒ thêm một khái niệm bằng AND hoặc siết khoảng năm; quá hẹp ⇒ thêm từ đồng nghĩa bằng OR, bỏ khái niệm ít thiết yếu nhất, hoặc thử ký tự đại diện. Hãy tính trước hai ba vòng.</li>
<li><strong>Ở FPTU.</strong> Đưa cái bảng này vào phụ lục báo cáo SWP391 hay SWR302. Nó chiếm nửa trang, nó chứng minh một PHƯƠNG PHÁP chứ không phải may mắn vớ được, và khi đồng đội cần mở rộng phần công trình liên quan thì họ chạy lại được thay vì làm lại từ đầu.</li>
</ul>
<table>
<tr><th>Khái niệm</th><th>Từ đồng nghĩa (nối bằng OR)</th><th>Tìm ở đâu</th><th>Bộ lọc</th></tr>
<tr><td>kiểm thử tự động</td><td>"test automation" OR "automated testing" OR "automated regression testing"</td><td>IEEE Xplore, Scholar</td><td>2019 trở đi, bài hội nghị/tạp chí</td></tr>
<tr><td>nhóm agile</td><td>agile OR scrum OR "small team"</td><td>như trên</td><td>tiếng Anh</td></tr>
<tr><td>kết quả cần đo</td><td>defect* OR "code quality" OR "release frequency"</td><td>như trên</td><td>—</td></tr>
</table>
<p class="meo">💡 Phân biệt ba mục bằng <strong>ĐẦU RA</strong>, vì mấy gạch đầu dòng không giúp được: 2.4a cho ra một <em>NHU CẦU</em>, 2.4b cho ra một <em>KẾ HOẠCH</em>, 2.4c cho ra một <em>BẢN GHI kèm một PHÁN XÉT</em>.</p>`],

      [43, '2.4c Documenting and evaluating the search strategy — the fourth bullet appears',
        `<p class="y-chinh">🎯 Almost the same objectives list as 2.4a and 2.4b, with one real change: the third bullet is trimmed to <strong>"apply strategies to document the information search process"</strong> and a <strong>fourth bullet is added — "evaluate the search strategy"</strong>. Documenting and evaluating are finally separated into two jobs.</p>
<table>
<tr><th>Job</th><th>Question it answers</th><th>Evidence it produces</th></tr>
<tr><td><strong>Document</strong></td><td>What exactly did I do?</td><td>Terms, database, date, filters, hit count</td></tr>
<tr><td><strong>Evaluate</strong></td><td>Did it work, and how do I know?</td><td>A judgement plus the change you made</td></tr>
</table>
<ul>
<li><strong>Documenting is boring and it is the step that saves you.</strong> Record for each search: the exact query string, the database, the date, the filters, and how many results came back. Three weeks later, when you need one more source or a teammate takes over, that record is the difference between five minutes and an afternoon.</li>
<li><strong>Evaluating needs criteria, so use these four.</strong> <em>Precision</em> — what share of the first twenty hits are actually usable? <em>Recall</em> — did the papers you already knew about turn up in the results? <em>Coverage</em> — is every sub-topic from step 1 represented? <em>Currency</em> — is the newest useful hit recent enough for this claim?</li>
<li><strong>The recall test is the sharpest one and it is free.</strong> Take two sources you already know are relevant and check whether your query finds them. If it does not, your terms are wrong — and you have learned that before wasting hours trusting a broken search.</li>
<li><strong>Coverage catches the failure nobody notices.</strong> You will naturally collect most heavily for the sub-topic you understand best. Tick off your step-1 headings against what you found; an empty heading is a search still to run, not a topic that has no literature.</li>
<li><strong>At FPTU.</strong> A documented search log in an appendix is one of the cheapest ways to look methodical in a capstone report, and supervisors notice it — it converts "I found some papers" into "I ran a defined process".</li>
</ul>
<p class="dap-an">✅ What one logged line looks like: <code>2026-09-19 · Google Scholar · ("test automation" OR "automated regression testing") AND (agile OR scrum) · 2019+ · 412 hits · first 20 scanned · 6 kept · note: "scrum" adds little, most hits say "agile"</code>. That last note is the evaluation, and it is what changes the next search.</p>
<p class="meo">💡 Four checks in four words: <strong>precision · recall · coverage · currency</strong>. Two are about the results, two are about your own question.</p>
<p class="pitfall">⚠️ Do not treat "no results" as an answer about the world. It is almost always an answer about your wording — a missing synonym, a phrase in quotes that nobody writes that way, or a filter set too tight. Change one thing at a time so you know which change did the work.</p>`,
        `<p class="y-chinh">🎯 Gần như cùng danh sách mục tiêu với 2.4a và 2.4b, nhưng có MỘT thay đổi thật: gạch thứ ba rút gọn thành <strong>"áp dụng cách để GHI LẠI quá trình tìm tin"</strong> và <strong>thêm gạch thứ TƯ — "ĐÁNH GIÁ chiến lược tìm"</strong>. Ghi lại và đánh giá rốt cuộc được tách thành hai việc.</p>
<table>
<tr><th>Việc</th><th>Trả lời câu hỏi</th><th>Bằng chứng nó tạo ra</th></tr>
<tr><td><strong>Ghi lại</strong></td><td>Mình đã làm CHÍNH XÁC những gì?</td><td>Từ khoá, CSDL, ngày, bộ lọc, số kết quả</td></tr>
<tr><td><strong>Đánh giá</strong></td><td>Có ăn thua không, và căn cứ vào đâu?</td><td>Một phán xét kèm thay đổi bạn đã làm</td></tr>
</table>
<ul>
<li><strong>Ghi lại thì chán, và đó là bước cứu bạn.</strong> Với mỗi lần tìm hãy ghi: chuỗi truy vấn chính xác, cơ sở dữ liệu, ngày, bộ lọc, và ra bao nhiêu kết quả. Ba tuần sau, khi bạn cần thêm một nguồn hoặc đồng đội tiếp quản, bản ghi đó là khác biệt giữa năm phút và cả buổi chiều.</li>
<li><strong>Đánh giá thì cần TIÊU CHÍ, nên dùng bốn cái này.</strong> <em>Độ chính xác (precision)</em> — trong hai mươi kết quả đầu, bao nhiêu phần trăm dùng được thật? <em>Độ bao phủ ngược (recall)</em> — những bài bạn vốn đã biết có hiện ra trong kết quả không? <em>Phủ đủ (coverage)</em> — mọi tiểu chủ đề của bước 1 đều có đại diện chưa? <em>Tính mới (currency)</em> — kết quả dùng được mới nhất có đủ mới cho khẳng định này không?</li>
<li><strong>Phép thử recall sắc nhất và không tốn gì.</strong> Lấy hai nguồn bạn ĐÃ BIẾT là đúng chủ đề và xem truy vấn của bạn có tìm ra chúng không. Không ra thì từ khoá của bạn sai — và bạn biết điều đó TRƯỚC khi phí hàng giờ tin vào một phép tìm hỏng.</li>
<li><strong>Phủ đủ bắt được cái hỏng không ai để ý.</strong> Bạn sẽ tự nhiên gom nhiều nhất cho tiểu chủ đề mình hiểu rõ nhất. Hãy tick các tiêu đề của bước 1 đối chiếu với thứ tìm được; một tiêu đề trống là một phép tìm CHƯA CHẠY, không phải một chủ đề không có tài liệu.</li>
<li><strong>Ở FPTU.</strong> Một nhật ký tìm kiếm trong phụ lục là cách rẻ nhất để báo cáo đồ án trông có phương pháp, và giảng viên hướng dẫn nhận ra ngay — nó biến "em có tìm được mấy bài" thành "em chạy một quy trình đã định nghĩa".</li>
</ul>
<p class="dap-an">✅ Một dòng nhật ký trông như thế này: <code>2026-09-19 · Google Scholar · ("test automation" OR "automated regression testing") AND (agile OR scrum) · từ 2019 · 412 kết quả · quét 20 đầu · giữ 6 · ghi chú: "scrum" thêm được rất ít, phần lớn kết quả dùng chữ "agile"</code>. Ghi chú cuối đó chính là phần ĐÁNH GIÁ, và nó là thứ làm đổi phép tìm kế tiếp.</p>
<p class="meo">💡 Bốn phép kiểm trong bốn chữ: <strong>chính xác · tìm lại được · phủ đủ · đủ mới</strong>. Hai cái nói về KẾT QUẢ, hai cái nói về CÂU HỎI của chính bạn.</p>
<p class="pitfall">⚠️ Đừng coi "không có kết quả" là một câu trả lời về THẾ GIỚI. Nó gần như luôn là câu trả lời về CÁCH BẠN VIẾT — thiếu một từ đồng nghĩa, một cụm để trong nháy kép mà chẳng ai viết như thế, hoặc bộ lọc siết quá chặt. Đổi MỘT thứ mỗi lần để biết thay đổi nào có tác dụng.</p>`],

      [44, '3.1a Critically Evaluating Information — learning outcomes',
        `<p class="y-chinh">🎯 Module 3 opens and the task changes: you have found sources, now you must judge them. Three outcomes — <strong>identify the factors that make a source credible</strong> · <strong>apply criteria to evaluate the credibility of sources for an academic context</strong> · <strong>apply criteria to evaluate the credibility of web sources</strong>.</p>
<ul>
<li><strong>Two different verbs, and the gap between them is where marks are lost.</strong> "Identify" is recognition — you can list the factors. "Apply" is judgement — given a real source, you can say which criteria it passes and which it fails. The course explicitly wants the second, and so does the exam.</li>
<li><strong>"For an academic context" is a limit, not a decoration.</strong> Credibility is always relative to a purpose. A company blog post can be a perfectly credible source about that company's own product, and a worthless source for a claim about the industry. Never ask "is this source good?" — ask "good for what claim, in front of which audience?"</li>
<li><strong>The split into general sources (3.1a) and web sources (3.1b) is deliberate.</strong> A journal article arrives with its credibility partly pre-established by peer review; a web page arrives with nothing at all, so you need a different checklist. Slides 45 and 47 give you two different lists for exactly this reason.</li>
<li><strong>This connects straight to CSI106 chapter 12.</strong> That chapter covers ethics, privacy and information misuse; this section covers judging what you read. They meet at the same point — as an IT professional you both consume information you must evaluate and produce information others will evaluate.</li>
<li><strong>Why it matters more now than five years ago.</strong> Generative AI produces fluent text with plausible-looking citations that may not exist. The only defence is the habit this section teaches: check the author, check the publisher, check that the cited source actually says what is claimed.</li>
</ul>
<p class="meo">💡 Fix one sentence in your head: <strong>credibility is a property of the source-claim-audience triple, never of the source alone.</strong> It disposes of a surprising number of multiple-choice options.</p>
<p class="pitfall">⚠️ Careful with the wording across this section. Slide 44 (3.1a) says <strong>credible / credibility</strong>; slides 46 and 48 (3.1b, 3.1c) say <strong>reliable / reliability</strong>. The deck uses them for the same idea, but if an exam item quotes one word exactly, match it to the right sub-section.</p>`,
        `<p class="y-chinh">🎯 Module 3 mở màn và nhiệm vụ đổi: bạn đã TÌM được nguồn, giờ phải PHÁN XÉT chúng. Ba mục tiêu — <strong>nhận ra các yếu tố làm một nguồn đáng tin</strong> · <strong>áp dụng tiêu chí để đánh giá độ tin cậy của nguồn trong bối cảnh học thuật</strong> · <strong>áp dụng tiêu chí để đánh giá độ tin cậy của các nguồn WEB</strong>.</p>
<ul>
<li><strong>Hai động từ khác nhau, và khoảng cách giữa chúng là chỗ mất điểm.</strong> "Nhận ra" là NHẬN DIỆN — bạn kể được các yếu tố. "Áp dụng" là PHÁN XÉT — đưa một nguồn thật, bạn nói được nó đạt tiêu chí nào và trượt tiêu chí nào. Môn học đòi rõ ràng cái thứ hai, và đề thi cũng vậy.</li>
<li><strong>"Trong bối cảnh học thuật" là một GIỚI HẠN, không phải trang trí.</strong> Độ tin cậy luôn tương đối với MỤC ĐÍCH. Một bài blog của công ty có thể là nguồn hoàn toàn đáng tin về chính sản phẩm của công ty đó, và là nguồn vô giá trị cho một khẳng định về cả ngành. Đừng bao giờ hỏi "nguồn này có tốt không" — hãy hỏi "tốt cho KHẲNG ĐỊNH nào, trước NGƯỜI ĐỌC nào".</li>
<li><strong>Việc tách nguồn nói chung (3.1a) và nguồn web (3.1b) là CỐ Ý.</strong> Một bài báo khoa học đến tay bạn với độ tin cậy đã được bình duyệt dựng sẵn một phần; một trang web đến tay bạn với con số không, nên cần một bảng kiểm khác. Slide 45 và 47 cho bạn hai danh sách khác nhau đúng vì lý do này.</li>
<li><strong>Chỗ này nối thẳng sang CSI106 chương 12.</strong> Chương đó nói về đạo đức, quyền riêng tư và lạm dụng thông tin; mục này nói về phán xét thứ bạn đọc. Chúng gặp nhau ở cùng một điểm — làm nghề CNTT thì bạn vừa TIÊU THỤ thông tin phải tự đánh giá, vừa TẠO RA thông tin cho người khác đánh giá.</li>
<li><strong>Vì sao bây giờ nó quan trọng hơn năm năm trước.</strong> AI sinh ngữ tạo ra văn trôi chảy kèm những trích dẫn trông rất thật mà có thể không tồn tại. Phòng thủ duy nhất là đúng cái thói quen mục này dạy: kiểm tác giả, kiểm nhà xuất bản, kiểm xem nguồn được trích có thật sự nói điều đang được gán cho nó không.</li>
</ul>
<p class="meo">💡 Ghim một câu trong đầu: <strong>độ tin cậy là tính chất của BỘ BA nguồn–khẳng định–người đọc, không bao giờ của riêng cái nguồn.</strong> Câu đó loại được nhiều phương án trắc nghiệm hơn bạn tưởng.</p>
<p class="pitfall">⚠️ Cẩn thận cách dùng chữ trong mục này. Slide 44 (3.1a) viết <strong>credible / credibility</strong> (đáng tin); slide 46 và 48 (3.1b, 3.1c) viết <strong>reliable / reliability</strong> (tin cậy). Deck dùng chúng cho cùng một ý, nhưng nếu câu thi trích đúng một chữ thì hãy khớp nó về đúng tiểu mục.</p>`],

      [45, 'Summary: Critically Evaluating Information — the six criteria',
        `<p class="y-chinh">🎯 The core checklist of Module 3, and the single most examinable list in this block: <strong>Purpose · Author · Audience · Objectivity · Accuracy · Currency</strong>.</p>
<table>
<tr><th>Criterion</th><th>The question to ask</th><th>Warning sign</th></tr>
<tr><td><strong>Purpose</strong></td><td>Why was this written — to inform, persuade, sell, entertain?</td><td>Any call to action, or a product at the end</td></tr>
<tr><td><strong>Author</strong></td><td>Who wrote it, what are their qualifications and affiliation?</td><td>No name at all, or a name with no traceable expertise</td></tr>
<tr><td><strong>Audience</strong></td><td>Who was it written for — scholars, students, the public, customers?</td><td>Level far below what your claim needs</td></tr>
<tr><td><strong>Objectivity</strong></td><td>Is there bias, a funder, an interest being served?</td><td>One-sided language, undisclosed sponsorship</td></tr>
<tr><td><strong>Accuracy</strong></td><td>Is it evidenced, referenced, checkable?</td><td>Numbers with no source; claims with no citation</td></tr>
<tr><td><strong>Currency</strong></td><td>How recent, and does recency matter here?</td><td>Broken links; a 2011 claim about technology</td></tr>
</table>
<ul>
<li><strong>Currency is relative to the field, not absolute.</strong> A 2010 paper on sorting algorithms is fine; a 2010 paper on mobile framework performance is archaeology. In fast-moving IT topics, treat five years as the default horizon and justify anything older.</li>
<li><strong>Accuracy is the only criterion you verify by leaving the source.</strong> The other five you can assess from the document itself. Accuracy means following a citation and checking that the cited work really says what is claimed — the single most effective check there is, and the one almost nobody performs.</li>
<li><strong>Objectivity does not mean "no opinion".</strong> Scholarly work argues a position; that is its job. The question is whether the position is supported by evidence and whether competing positions are acknowledged — and whether there is an undisclosed interest behind it.</li>
</ul>
<p class="nhan">📐 The six applied to three real sources, scored one by one:</p>
<table>
<tr><th>Criterion</th><th>Peer-reviewed IEEE paper</th><th>Wikipedia article</th><th>A company engineering blog</th></tr>
<tr><td>Purpose</td><td>✅ Report research</td><td>⚠️ Summarise, tertiary</td><td>⚠️ Inform <em>and</em> market</td></tr>
<tr><td>Author</td><td>✅ Named, affiliated</td><td>❌ Pseudonymous, collective</td><td>⚠️ Named, employed by the vendor</td></tr>
<tr><td>Audience</td><td>✅ Academics</td><td>⚠️ General public</td><td>⚠️ Practitioners and customers</td></tr>
<tr><td>Objectivity</td><td>✅ Declares funding, limitations</td><td>⚠️ Policy requires neutrality, not guaranteed</td><td>❌ Interested in its own product</td></tr>
<tr><td>Accuracy</td><td>✅ Referenced, peer reviewed</td><td>⚠️ Referenced but unreviewed; check the footnotes</td><td>⚠️ Often real data, rarely independent</td></tr>
<tr><td>Currency</td><td>⚠️ Depends on the year</td><td>✅ Edited continuously</td><td>✅ Usually recent</td></tr>
</table>
<p class="dap-an">✅ Verdict: cite the <strong>IEEE paper</strong>. Use <strong>Wikipedia</strong> to orient yourself and to mine its reference list — then cite those references, never the article. Cite the <strong>company blog</strong> only for facts about that company's own system, and say in your sentence that it is the vendor's own account.</p>
<p class="meo">💡 You may have met <strong>CRAAP</strong> (Currency · Relevance · Authority · Accuracy · Purpose) elsewhere. It is the same family of ideas, but this course examines <em>its own</em> six. Learn Purpose–Author–Audience–Objectivity–Accuracy–Currency; treat CRAAP as a cousin, not a substitute.</p>`,
        `<p class="y-chinh">🎯 Bảng kiểm cốt lõi của Module 3, và là danh sách dễ ra đề nhất trong cả khối này: <strong>Purpose (mục đích) · Author (tác giả) · Audience (đối tượng) · Objectivity (tính khách quan) · Accuracy (độ chính xác) · Currency (tính mới)</strong>.</p>
<table>
<tr><th>Tiêu chí</th><th>Câu phải hỏi</th><th>Dấu hiệu cảnh báo</th></tr>
<tr><td><strong>Mục đích</strong></td><td>Viết ra để làm gì — thông tin, thuyết phục, bán hàng, giải trí?</td><td>Có lời kêu gọi hành động, hoặc một sản phẩm ở cuối bài</td></tr>
<tr><td><strong>Tác giả</strong></td><td>Ai viết, chuyên môn và nơi công tác ra sao?</td><td>Không có tên, hoặc có tên mà không truy được chuyên môn</td></tr>
<tr><td><strong>Đối tượng</strong></td><td>Viết cho ai — học giả, sinh viên, đại chúng, khách hàng?</td><td>Mức độ thấp hơn nhiều so với khẳng định bạn cần</td></tr>
<tr><td><strong>Khách quan</strong></td><td>Có thiên lệch không, ai tài trợ, ai được lợi?</td><td>Ngôn ngữ một chiều, tài trợ không công khai</td></tr>
<tr><td><strong>Chính xác</strong></td><td>Có bằng chứng, có trích dẫn, kiểm lại được không?</td><td>Con số không nguồn; khẳng định không trích dẫn</td></tr>
<tr><td><strong>Tính mới</strong></td><td>Mới cỡ nào, và ở đây độ mới có quan trọng không?</td><td>Link chết; một khẳng định năm 2011 về công nghệ</td></tr>
</table>
<ul>
<li><strong>Tính mới là TƯƠNG ĐỐI theo ngành, không tuyệt đối.</strong> Một bài 2010 về thuật toán sắp xếp thì vẫn tốt; một bài 2010 về hiệu năng framework di động thì là khảo cổ. Với chủ đề CNTT chuyển động nhanh, hãy lấy mốc mặc định năm năm và phải biện minh nếu dùng cái cũ hơn.</li>
<li><strong>Chính xác là tiêu chí DUY NHẤT bạn phải RỜI KHỎI nguồn mới kiểm được.</strong> Năm cái kia bạn đánh giá được ngay trong chính tài liệu. "Chính xác" nghĩa là lần theo một trích dẫn và kiểm xem công trình được trích có thật sự nói điều đang bị gán cho nó — phép kiểm hiệu quả nhất từng có, và là phép kiểm gần như không ai làm.</li>
<li><strong>Khách quan KHÔNG nghĩa là "không có quan điểm".</strong> Công trình học thuật thì phải bảo vệ một quan điểm; đó là việc của nó. Câu hỏi là quan điểm ấy có được bằng chứng đỡ không, có thừa nhận các quan điểm đối lập không — và có lợi ích nào không được công khai đứng sau không.</li>
</ul>
<p class="nhan">📐 Sáu tiêu chí áp vào ba nguồn THẬT, chấm từng cái:</p>
<table>
<tr><th>Tiêu chí</th><th>Bài IEEE đã bình duyệt</th><th>Bài Wikipedia</th><th>Blog kỹ thuật của một công ty</th></tr>
<tr><td>Mục đích</td><td>✅ Báo cáo nghiên cứu</td><td>⚠️ Tóm lược, nguồn cấp ba</td><td>⚠️ Vừa thông tin <em>vừa</em> tiếp thị</td></tr>
<tr><td>Tác giả</td><td>✅ Có tên, có nơi công tác</td><td>❌ Bút danh, tập thể</td><td>⚠️ Có tên, nhưng ăn lương của hãng</td></tr>
<tr><td>Đối tượng</td><td>✅ Giới học thuật</td><td>⚠️ Công chúng</td><td>⚠️ Người làm nghề và khách hàng</td></tr>
<tr><td>Khách quan</td><td>✅ Khai nguồn tài trợ, nêu hạn chế</td><td>⚠️ Quy định đòi trung lập, nhưng không bảo đảm</td><td>❌ Có lợi ích trong chính sản phẩm của mình</td></tr>
<tr><td>Chính xác</td><td>✅ Có trích dẫn, đã bình duyệt</td><td>⚠️ Có chú thích nhưng chưa bình duyệt; phải soi chú thích</td><td>⚠️ Số liệu thường thật, nhưng hiếm khi độc lập</td></tr>
<tr><td>Tính mới</td><td>⚠️ Tuỳ năm công bố</td><td>✅ Được sửa liên tục</td><td>✅ Thường khá mới</td></tr>
</table>
<p class="dap-an">✅ Kết luận: trích <strong>bài IEEE</strong>. Dùng <strong>Wikipedia</strong> để định hướng và để đào danh mục tham khảo của nó — rồi trích chính các tài liệu đó, đừng trích bài Wikipedia. Trích <strong>blog công ty</strong> chỉ cho các sự kiện về chính hệ thống của công ty ấy, và phải ghi ngay trong câu rằng đây là lời của chính nhà cung cấp.</p>
<p class="meo">💡 Bạn có thể đã gặp <strong>CRAAP</strong> (Currency · Relevance · Authority · Accuracy · Purpose) ở nơi khác. Cùng một họ ý tưởng, nhưng môn này thi <em>SÁU tiêu chí của CHÍNH NÓ</em>. Hãy thuộc Purpose–Author–Audience–Objectivity–Accuracy–Currency; coi CRAAP là họ hàng, không phải bản thay thế.</p>`],

      [46, '3.1b Critically Evaluating Web Resources — learning outcomes',
        `<p class="y-chinh">🎯 The objectives for the web-specific sub-section. The three bullets are the same shape as slide 44 but with one word changed throughout — <strong>reliable / reliability</strong> instead of credible / credibility: identify the factors that make a source reliable · apply criteria to evaluate the reliability of sources · apply criteria to evaluate the reliability of <strong>web</strong> sources.</p>
<ul>
<li><strong>Why the web needs its own sub-section at all.</strong> Everything else you evaluate arrives through a filter — a publisher, an editor, a peer-review panel, a library that chose to buy it. A web page has passed through none of those. You are the entire quality-control process, which is why the course spends three sub-sections (3.1b web, 3.1c Wikipedia) on it.</li>
<li><strong>Web pages fail differently from articles.</strong> No author at all is common. No date at all is common. The "About" page may be the only clue to who is behind it. Content changes silently after you cite it — which is exactly why web citations require an <em>accessed on</em> date.</li>
<li><strong>Two fast checks worth doing every time.</strong> (1) Read the domain: who owns it, and is the content on their own site or a subdomain someone else controls? (2) Read <em>laterally</em> — leave the page and search for what other sources say about this organisation, instead of judging it by how polished it looks.</li>
<li><strong>Not all web sources are weak, and the slide does not say they are.</strong> A standards body, a government statistics office, a university repository and an official API documentation site are all web sources and all appropriate — for the right claim. The point is that the web is a <em>delivery channel</em>, not a source type.</li>
<li><strong>At FPTU.</strong> Vendor documentation is the correct source for "how does this framework behave"; it is the wrong source for "which framework is better". Keep those two kinds of sentences apart in your report and most source problems disappear.</li>
</ul>
<p class="meo">💡 Remember the asymmetry: for a journal article, someone filtered it <em>before</em> you. For a web page, you are the filter. That one sentence explains why two different checklists exist.</p>
<p class="pitfall">⚠️ These three bullets are also <strong>identical to slide 48 (3.1c Wikipedia)</strong>. Three sub-sections, one objectives list — recognise the pattern in this deck instead of hunting for a difference that is not there.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu cho tiểu mục riêng về WEB. Ba gạch đầu dòng cùng hình dạng với slide 44 nhưng đổi một chữ xuyên suốt — <strong>reliable / reliability</strong> (tin cậy) thay cho credible / credibility: nhận ra các yếu tố làm một nguồn tin cậy · áp dụng tiêu chí đánh giá độ tin cậy của nguồn · áp dụng tiêu chí đánh giá độ tin cậy của nguồn <strong>WEB</strong>.</p>
<ul>
<li><strong>Vì sao web phải có tiểu mục riêng.</strong> Mọi thứ khác bạn đánh giá đều đến qua một CÁI LỌC — một nhà xuất bản, một biên tập viên, một hội đồng bình duyệt, một thư viện đã chọn mua nó. Một trang web thì không qua cái nào cả. BẠN chính là toàn bộ quy trình kiểm soát chất lượng, và đó là lý do môn học dành hẳn ba tiểu mục (3.1b web, 3.1c Wikipedia) cho nó.</li>
<li><strong>Trang web hỏng theo kiểu KHÁC bài báo.</strong> Không có tác giả nào cả là chuyện thường. Không có ngày tháng nào cả là chuyện thường. Trang "About" có khi là manh mối duy nhất về người đứng sau. Nội dung đổi âm thầm sau khi bạn đã trích — chính vì thế trích dẫn web bắt buộc phải kèm ngày TRUY CẬP.</li>
<li><strong>Hai phép kiểm nhanh nên làm mọi lần.</strong> (1) Đọc tên miền: ai sở hữu, và nội dung nằm trên site của chính họ hay trên một tên miền con do người khác kiểm soát? (2) Đọc <em>NGANG</em> — rời khỏi trang đó và đi tìm xem các nguồn khác nói gì về tổ chức này, thay vì phán xét nó qua việc nó trông chỉn chu tới đâu.</li>
<li><strong>Không phải nguồn web nào cũng yếu, và slide không nói vậy.</strong> Một tổ chức tiêu chuẩn, một cơ quan thống kê nhà nước, một kho lưu trữ của đại học, một trang tài liệu API chính chủ — đều là nguồn web và đều phù hợp, cho ĐÚNG loại khẳng định. Ý ở đây là web là một <em>KÊNH PHÂN PHỐI</em>, không phải một LOẠI nguồn.</li>
<li><strong>Ở FPTU.</strong> Tài liệu của hãng là nguồn ĐÚNG cho câu "framework này hành xử thế nào"; nó là nguồn SAI cho câu "framework nào tốt hơn". Giữ hai loại câu đó tách bạch trong báo cáo thì phần lớn rắc rối về nguồn tự biến mất.</li>
</ul>
<p class="meo">💡 Nhớ chỗ BẤT ĐỐI XỨNG: với bài báo, đã có người lọc giúp bạn TRƯỚC. Với trang web, bạn LÀ cái lọc. Đúng một câu đó giải thích vì sao tồn tại hai bảng kiểm khác nhau.</p>
<p class="pitfall">⚠️ Ba gạch đầu dòng này cũng <strong>GIỐNG HỆT slide 48 (3.1c Wikipedia)</strong>. Ba tiểu mục dùng chung một danh sách mục tiêu — hãy nhận ra khuôn mẫu của deck này thay vì đi săn một khác biệt không hề tồn tại.</p>`],

      [47, 'Summary: Criteria for Web Resources — Publisher, Purpose, Aesthetics and Style, Referencing',
        `<p class="y-chinh">🎯 A <strong>different and shorter list</strong> from slide 45 — four criteria, specific to web resources: <strong>Publisher · Purpose · Aesthetics and Style · Referencing</strong>. Learn this one as its own list; do not merge it with the six.</p>
<table>
<tr><th>Criterion</th><th>What to look at</th><th>Passes</th><th>Fails</th></tr>
<tr><td><strong>Publisher</strong></td><td>Who runs the site — domain, "About", ownership</td><td>University, government, standards body, established org</td><td>Anonymous, unclear ownership, personal page with no credentials</td></tr>
<tr><td><strong>Purpose</strong></td><td>Why the site exists</td><td>Inform, educate, publish data</td><td>Sell, campaign, farm advertising clicks</td></tr>
<tr><td><strong>Aesthetics and Style</strong></td><td>Design, upkeep, register of the writing</td><td>Maintained, no dead links, professional and restrained</td><td>Broken links, heavy ads, sensational or emotive tone</td></tr>
<tr><td><strong>Referencing</strong></td><td>Does the page cite sources you can follow?</td><td>Links and citations you can verify</td><td>Bare claims, numbers with no origin</td></tr>
</table>
<ul>
<li><strong>Why "Publisher" replaces "Author" here.</strong> Web pages very often have no named author, so the organisation behind the site becomes the unit of accountability. If you cannot identify the publisher of a web page, you cannot evaluate it at all — that is the first check, not the last.</li>
<li><strong>"Aesthetics and Style" is the criterion students most often misread.</strong> It does not mean "pretty means true" — a marketing page is beautiful and a government statistics table is ugly. It means: is the site <em>maintained</em>, and is the writing in a <em>register appropriate to informing</em> rather than to persuading or provoking? Dead links and sensational headlines are the real signals.</li>
<li><strong>"Referencing" is the strongest of the four.</strong> A page that cites checkable sources exposes itself to correction; a page that asserts figures with no origin is asking for trust it has not earned. It is also the criterion that connects back to Accuracy on slide 45.</li>
<li><strong>Use them in order and you stop early.</strong> Publisher → Purpose → Referencing → Aesthetics. Most unsuitable pages are eliminated by the first two, which is why they are worth doing first.</li>
</ul>
<p class="dap-an">✅ Applying the four to a real pair. A university library "how to search" guide: Publisher ✅ university · Purpose ✅ educate · Aesthetics ✅ maintained, plain · Referencing ⚠️ often unreferenced (it is instructional). ⇒ trustworthy for method, not citable as evidence. A listicle titled "10 best JavaScript frameworks 2026": Publisher ❌ unclear · Purpose ❌ advertising · Aesthetics ❌ ad-heavy · Referencing ❌ none. ⇒ do not use.</p>
<p class="meo">💡 Memory hook: <strong>P-P-A-R</strong> — <em>Publisher, Purpose, Aesthetics, Referencing</em>. Note that <strong>Purpose is the only criterion that appears on BOTH lists</strong> (slide 45 and slide 47); that overlap is the most reliable anchor you have for telling the two apart.</p>
<p class="pitfall">⚠️ The likeliest trap in this whole lesson: mixing the <strong>six</strong> criteria for sources in general (Purpose · Author · Audience · Objectivity · Accuracy · Currency, slide 45) with the <strong>four</strong> for web resources (Publisher · Purpose · Aesthetics and Style · Referencing, slide 47). Different counts, different words, one shared item. Memorise both counts: <strong>6 and 4</strong>.</p>`,
        `<p class="y-chinh">🎯 Một danh sách <strong>KHÁC và NGẮN HƠN</strong> so với slide 45 — bốn tiêu chí, riêng cho tài nguyên web: <strong>Publisher (nhà xuất bản/chủ trang) · Purpose (mục đích) · Aesthetics and Style (thẩm mỹ và văn phong) · Referencing (trích dẫn nguồn)</strong>. Học nó như một danh sách RIÊNG; đừng trộn vào bộ sáu.</p>
<table>
<tr><th>Tiêu chí</th><th>Nhìn vào cái gì</th><th>Đạt</th><th>Trượt</th></tr>
<tr><td><strong>Chủ trang</strong></td><td>Ai vận hành site — tên miền, trang "About", chủ sở hữu</td><td>Đại học, cơ quan nhà nước, tổ chức tiêu chuẩn, tổ chức có tên tuổi</td><td>Ẩn danh, không rõ ai sở hữu, trang cá nhân không có chuyên môn</td></tr>
<tr><td><strong>Mục đích</strong></td><td>Site tồn tại để làm gì</td><td>Cung cấp thông tin, giáo dục, công bố dữ liệu</td><td>Bán hàng, vận động, câu quảng cáo</td></tr>
<tr><td><strong>Thẩm mỹ &amp; văn phong</strong></td><td>Thiết kế, mức bảo trì, giọng văn</td><td>Được bảo trì, không link chết, chuyên nghiệp và tiết chế</td><td>Link chết, quảng cáo dày đặc, giọng giật gân hoặc kích động</td></tr>
<tr><td><strong>Trích dẫn nguồn</strong></td><td>Trang có dẫn nguồn lần theo được không?</td><td>Có link và trích dẫn kiểm lại được</td><td>Khẳng định trơ trọi, con số không rõ từ đâu</td></tr>
</table>
<ul>
<li><strong>Vì sao ở đây "Chủ trang" thay chỗ "Tác giả".</strong> Trang web rất thường không có tác giả đứng tên, nên TỔ CHỨC đứng sau site trở thành đơn vị chịu trách nhiệm. Không xác định được chủ trang thì bạn không đánh giá được gì cả — đó là phép kiểm ĐẦU TIÊN, không phải cuối cùng.</li>
<li><strong>"Thẩm mỹ và văn phong" là tiêu chí sinh viên hiểu sai nhiều nhất.</strong> Nó KHÔNG có nghĩa "đẹp thì đúng" — một trang tiếp thị thì đẹp còn một bảng thống kê nhà nước thì xấu. Nó có nghĩa: site có được <em>BẢO TRÌ</em> không, và văn có ở <em>giọng phù hợp với việc CUNG CẤP THÔNG TIN</em> chứ không phải để thuyết phục hay kích động? Link chết và tít giật gân mới là tín hiệu thật.</li>
<li><strong>"Trích dẫn nguồn" là tiêu chí MẠNH nhất trong bốn cái.</strong> Trang nào dẫn nguồn kiểm lại được là trang tự phơi mình ra cho việc bị đính chính; trang nào phán số liệu mà không rõ từ đâu là đang đòi một sự tin tưởng nó chưa kiếm được. Nó cũng là tiêu chí nối ngược về "Accuracy" ở slide 45.</li>
<li><strong>Dùng theo THỨ TỰ thì bạn dừng sớm được.</strong> Chủ trang → Mục đích → Trích dẫn → Thẩm mỹ. Phần lớn trang không dùng được đã bị loại bởi hai tiêu chí đầu, nên chúng đáng làm trước.</li>
</ul>
<p class="dap-an">✅ Áp bốn tiêu chí vào một cặp thật. Trang hướng dẫn "cách tìm tài liệu" của thư viện một trường đại học: Chủ trang ✅ đại học · Mục đích ✅ giáo dục · Thẩm mỹ ✅ được bảo trì, giản dị · Trích dẫn ⚠️ thường không dẫn nguồn (vì nó là tài liệu hướng dẫn). ⇒ đáng tin về PHƯƠNG PHÁP, không trích được làm BẰNG CHỨNG. Một bài "10 framework JavaScript tốt nhất 2026": Chủ trang ❌ không rõ · Mục đích ❌ quảng cáo · Thẩm mỹ ❌ đầy banner · Trích dẫn ❌ không có. ⇒ không dùng.</p>
<p class="meo">💡 Móc nhớ: <strong>CHỦ — MỤC — THẨM — DẪN</strong>. Và để ý <strong>Purpose là tiêu chí DUY NHẤT có mặt ở CẢ HAI danh sách</strong> (slide 45 và slide 47); chỗ trùng đó là cái neo đáng tin nhất để bạn phân biệt hai bộ.</p>
<p class="pitfall">⚠️ Bẫy dễ dính nhất trong cả bài này: trộn <strong>SÁU</strong> tiêu chí cho nguồn nói chung (Purpose · Author · Audience · Objectivity · Accuracy · Currency, slide 45) với <strong>BỐN</strong> tiêu chí cho tài nguyên web (Publisher · Purpose · Aesthetics and Style · Referencing, slide 47). Khác số lượng, khác chữ, chung đúng một mục. Thuộc luôn hai con số: <strong>6 và 4</strong>.</p>`],

      [48, '3.1c Critically Evaluating Wikipedia — learning outcomes',
        `<p class="y-chinh">🎯 Wikipedia gets a sub-section of its own. The objectives are again identical to slide 46 — identify the factors that make a source reliable, and apply criteria to sources and to web sources — but the subject is now the one website every student actually uses.</p>
<ul>
<li><strong>Why it earns its own sub-section.</strong> Wikipedia is where nearly every research task really begins, and it breaks the standard checklist in an interesting way: it has no identifiable author, yet it is heavily referenced, continuously revised and openly corrected. It is the hard case, which is what makes it a good teaching case.</li>
<li><strong>The academic rule, stated plainly.</strong> Wikipedia is a <strong>tertiary source</strong> — it summarises what secondary sources say. Tertiary sources are for orientation, not for citation. In an academic report you do not cite it; you use it and then cite what it cites.</li>
<li><strong>How to use it well, in three moves.</strong> (1) Read the lead paragraph to get the vocabulary of the field — which gives you the synonyms for step 4 of the search process. (2) Go straight to the reference list at the bottom and follow the peer-reviewed items. (3) Check the "View history" and "Talk" tabs: a page edited hundreds of times by many accounts, with a calm talk page, is in far better shape than a stub edited twice.</li>
<li><strong>Its real weaknesses.</strong> Coverage is uneven — flagship topics are excellent, obscure ones can be wrong for years. Vandalism is usually caught in minutes but you may read during those minutes. Bias follows the interests of whoever edits, and the Vietnamese-language edition is far thinner than the English one on most technical topics.</li>
<li><strong>Connect to CSI106 chapter 12.</strong> That chapter's discussion of information ethics and openness is the other side of this coin: Wikipedia is the largest working experiment in open, collectively produced knowledge, with all the governance problems that implies.</li>
</ul>
<p class="dap-an">✅ The rule to remember for the exam and for real work: <strong>Wikipedia is an excellent starting point and an unacceptable ending point.</strong> Use it for vocabulary and for its references; cite the references.</p>
<p class="meo">💡 The single most productive habit in this entire lesson: scroll straight past the article body to the <em>References</em> section. That is where the citable sources are, and it takes five seconds.</p>`,
        `<p class="y-chinh">🎯 Wikipedia được dành hẳn một tiểu mục. Mục tiêu lại giống hệt slide 46 — nhận ra các yếu tố làm một nguồn tin cậy, và áp dụng tiêu chí cho nguồn nói chung lẫn nguồn web — nhưng đối tượng lần này là đúng cái website mà sinh viên nào cũng thật sự dùng.</p>
<ul>
<li><strong>Vì sao nó xứng có tiểu mục riêng.</strong> Wikipedia là nơi gần như mọi nhiệm vụ tra cứu THẬT SỰ bắt đầu, và nó phá bảng kiểm chuẩn theo một cách thú vị: nó không có tác giả xác định được, vậy mà lại dẫn nguồn rất dày, được sửa liên tục và được đính chính công khai. Nó là CA KHÓ, mà ca khó thì dạy được nhiều.</li>
<li><strong>Quy tắc học thuật, nói thẳng.</strong> Wikipedia là <strong>nguồn CẤP BA (tertiary source)</strong> — nó tóm lược lại những gì nguồn cấp hai nói. Nguồn cấp ba dùng để ĐỊNH HƯỚNG, không dùng để TRÍCH DẪN. Trong báo cáo học thuật, bạn không trích nó; bạn dùng nó rồi trích thứ mà nó trích.</li>
<li><strong>Cách dùng cho khéo, gồm ba nước.</strong> (1) Đọc đoạn mở đầu để nắm THUẬT NGỮ của ngành — chính là các từ đồng nghĩa cho bước 4 của quy trình tìm kiếm. (2) Xuống thẳng danh mục tham khảo ở cuối và lần theo các mục đã bình duyệt. (3) Xem tab "View history" và "Talk": một trang bị sửa hàng trăm lần bởi nhiều tài khoản, với trang thảo luận bình thản, thì ở trạng thái tốt hơn hẳn một bài sơ khai mới sửa hai lần.</li>
<li><strong>Điểm yếu thật của nó.</strong> Độ phủ không đều — chủ đề lớn thì xuất sắc, chủ đề hẻo lánh có thể sai suốt nhiều năm. Phá hoại thường bị bắt trong vài phút, nhưng bạn có thể đang đọc đúng mấy phút đó. Thiên lệch đi theo mối quan tâm của người chịu sửa bài, và bản tiếng Việt mỏng hơn bản tiếng Anh rất nhiều ở hầu hết chủ đề kỹ thuật.</li>
<li><strong>Nối sang CSI106 chương 12.</strong> Phần bàn về đạo đức thông tin và tính mở ở chương đó là mặt kia của đồng xu này: Wikipedia là thí nghiệm lớn nhất đang chạy về tri thức mở do tập thể tạo ra, kèm theo mọi bài toán quản trị mà điều đó kéo theo.</li>
</ul>
<p class="dap-an">✅ Quy tắc cần nhớ cho cả phòng thi lẫn việc thật: <strong>Wikipedia là điểm KHỞI HÀNH tuyệt vời và là điểm ĐẾN không chấp nhận được.</strong> Dùng nó để lấy thuật ngữ và lấy danh mục tham khảo; rồi trích chính các tài liệu đó.</p>
<p class="meo">💡 Thói quen hiệu quả nhất trong cả bài học này: cuộn thẳng qua phần thân bài xuống mục <em>References</em>. Nguồn trích dẫn được nằm ở đó, và việc này tốn năm giây.</p>`],

      [49, 'Critically Evaluating Wikipedia — the six-box checklist',
        `<p class="y-chinh">🎯 A checklist slide: six empty tick-boxes labelled <strong>Scholarly Purpose · Authority · Audience · Objectivity · Accuracy · Currency</strong>. It is the slide-45 list with <strong>two words changed</strong>, and the changes are not accidental.</p>
<table>
<tr><th>Slide 45 (sources in general)</th><th>Slide 49 (Wikipedia)</th><th>Why the change matters</th></tr>
<tr><td>Purpose</td><td><strong>Scholarly</strong> Purpose</td><td>Not just "why was it written" but "was it written for scholarship at all"</td></tr>
<tr><td>Author</td><td><strong>Authority</strong></td><td>Wikipedia has no identifiable author — you must ask about authority instead</td></tr>
<tr><td>Audience · Objectivity · Accuracy · Currency</td><td>identical</td><td>These four transfer unchanged</td></tr>
</table>
<ul>
<li><strong>Tick the boxes for Wikipedia honestly and the verdict follows.</strong> Scholarly Purpose ❌ — it is a general encyclopaedia, written for everyone. Authority ❌ — anonymous, collectively edited, no credential requirement. Audience ⚠️ — the general public, below academic level. Objectivity ⚠️ — policy demands a neutral point of view, which is a goal, not a guarantee. Accuracy ⚠️ — well-referenced on major topics, unreviewed. Currency ✅ — often the most up-to-date thing you will find.</li>
<li><strong>Two clear fails and one clear pass is exactly the right answer.</strong> It explains both halves of the rule: the two fails are why you must not cite it, the currency pass and the references are why it is genuinely useful.</li>
<li><strong>"Authority" is a broader question than "Author".</strong> Ask: who is accountable if this is wrong? For a journal article, named authors and a journal. For Wikipedia, nobody in particular — which is precisely what the tick-box is testing.</li>
<li><strong>The empty boxes are an instruction.</strong> The slide is asking you to <em>perform</em> the evaluation, not to read a verdict. Do it on a page you actually use for a subject — pick the Wikipedia article for a topic in SWP391 and tick all six honestly. It takes two minutes and it makes the criteria stick.</li>
</ul>
<p class="dap-an">✅ Worked verdict: Wikipedia fails <strong>Scholarly Purpose</strong> and <strong>Authority</strong>, is mixed on Audience, Objectivity and Accuracy, and passes <strong>Currency</strong>. ⇒ excellent for orientation and for harvesting references, never a citation in an academic report.</p>
<p class="meo">💡 Guard against a false memory: the general list says <strong>Author</strong>, the Wikipedia list says <strong>Authority</strong>, and the Wikipedia list says <strong>Scholarly</strong> Purpose. Same six positions, two different labels — that is exactly the kind of near-identical pair a multiple-choice paper likes.</p>
<p class="pitfall">⚠️ You now hold three distinct evaluation lists: <strong>6</strong> for sources in general (slide 45), <strong>4</strong> for web resources (slide 47), <strong>6</strong> for Wikipedia with two relabelled items (slide 49). Keep them apart by their heading, not by their feel.</p>`,
        `<p class="y-chinh">🎯 Một slide BẢNG KIỂM: sáu ô tick còn trống, gắn nhãn <strong>Scholarly Purpose · Authority · Audience · Objectivity · Accuracy · Currency</strong>. Đó là danh sách của slide 45 với <strong>HAI chữ bị đổi</strong>, và hai chỗ đổi đó không phải vô tình.</p>
<table>
<tr><th>Slide 45 (nguồn nói chung)</th><th>Slide 49 (Wikipedia)</th><th>Vì sao chỗ đổi có ý nghĩa</th></tr>
<tr><td>Purpose</td><td><strong>Scholarly</strong> Purpose</td><td>Không chỉ hỏi "viết để làm gì" mà hỏi "có viết cho HỌC THUẬT không"</td></tr>
<tr><td>Author</td><td><strong>Authority</strong></td><td>Wikipedia không có tác giả xác định được — phải hỏi về THẨM QUYỀN thay vì tác giả</td></tr>
<tr><td>Audience · Objectivity · Accuracy · Currency</td><td>giữ nguyên</td><td>Bốn cái này chuyển sang y nguyên</td></tr>
</table>
<ul>
<li><strong>Tick trung thực cho Wikipedia thì kết luận tự hiện ra.</strong> Scholarly Purpose ❌ — nó là bách khoa toàn thư phổ thông, viết cho tất cả mọi người. Authority ❌ — ẩn danh, sửa tập thể, không đòi bằng cấp. Audience ⚠️ — công chúng, dưới mức học thuật. Objectivity ⚠️ — quy định đòi quan điểm trung lập, đó là MỤC TIÊU chứ không phải BẢO ĐẢM. Accuracy ⚠️ — dẫn nguồn tốt ở các chủ đề lớn, nhưng chưa bình duyệt. Currency ✅ — thường là thứ mới nhất bạn tìm được.</li>
<li><strong>Hai cái trượt rõ và một cái đạt rõ chính là đáp án đúng.</strong> Nó giải thích cả hai nửa của quy tắc: hai cái trượt là lý do bạn KHÔNG được trích, còn cái đạt về tính mới cộng danh mục tham khảo là lý do nó hữu ích thật.</li>
<li><strong>"Authority" là câu hỏi RỘNG hơn "Author".</strong> Hãy hỏi: nếu chỗ này sai thì AI chịu trách nhiệm? Với bài báo khoa học là các tác giả đứng tên cộng tạp chí. Với Wikipedia là không ai cụ thể cả — và đó chính xác là thứ cái ô tick đang kiểm.</li>
<li><strong>Các ô TRỐNG là một MỆNH LỆNH.</strong> Slide đang bảo bạn <em>THỰC HIỆN</em> phép đánh giá, không phải đọc một kết luận. Hãy làm trên một trang bạn thật sự dùng cho một môn — chọn bài Wikipedia về một chủ đề trong SWP391 rồi tick trung thực cả sáu ô. Mất hai phút và làm các tiêu chí dính vào đầu.</li>
</ul>
<p class="dap-an">✅ Kết luận đã chấm: Wikipedia TRƯỢT <strong>Scholarly Purpose</strong> và <strong>Authority</strong>, nửa vời ở Audience, Objectivity và Accuracy, và ĐẠT <strong>Currency</strong>. ⇒ tuyệt vời để định hướng và để thu hoạch danh mục tham khảo, không bao giờ là một trích dẫn trong báo cáo học thuật.</p>
<p class="meo">💡 Đề phòng trí nhớ đánh lừa: danh sách chung ghi <strong>Author</strong>, danh sách Wikipedia ghi <strong>Authority</strong>, và danh sách Wikipedia ghi <strong>Scholarly</strong> Purpose. Cùng sáu vị trí, hai nhãn khác nhau — đúng kiểu cặp gần-giống-hệt mà đề trắc nghiệm rất thích.</p>
<p class="pitfall">⚠️ Giờ bạn đang giữ BA danh sách đánh giá khác nhau: <strong>6</strong> cho nguồn nói chung (slide 45), <strong>4</strong> cho tài nguyên web (slide 47), <strong>6</strong> cho Wikipedia với hai mục đổi nhãn (slide 49). Hãy phân biệt chúng bằng TIÊU ĐỀ, đừng phân biệt bằng cảm giác.</p>`],

      [50, '3.2a Establishing Relevance — learning outcomes',
        `<p class="y-chinh">🎯 A new criterion enters, and it is separate from credibility: <strong>relevance</strong>. Three outcomes — understand criteria to evaluate relevance · <strong>scan &amp; skim</strong> search results to evaluate relevance to the research topic/question · apply criteria to evaluate relevance.</p>
<table>
<tr><th></th><th>Credibility (3.1)</th><th>Relevance (3.2)</th></tr>
<tr><td>Question asked</td><td>Can I trust this?</td><td>Do I need this?</td></tr>
<tr><td>Property of</td><td>The source</td><td>The source <em>and your question</em></td></tr>
<tr><td>Judged by</td><td>Purpose, Author, Audience, Objectivity, Accuracy, Currency</td><td>The four questions on slide 51</td></tr>
<tr><td>If it fails</td><td>Do not cite it</td><td>Do not read it</td></tr>
</table>
<ul>
<li><strong>The two are independent, and both are needed.</strong> A brilliant peer-reviewed paper about something adjacent is credible and irrelevant. A perfectly on-topic blog post is relevant and not credible. A source must pass both tests before it earns a place in your report.</li>
<li><strong>Relevance is the cheaper test, so run it first.</strong> You can judge relevance from a title, an abstract and a glance at the headings — thirty seconds. Judging credibility properly takes several minutes. Filtering by relevance first means you only spend the expensive test on candidates worth it.</li>
<li><strong>Scan and skim are two different techniques and the slide names both.</strong> <em>Scanning</em> is hunting for a specific thing — your key term, a number, a name — letting your eye run down the page. <em>Skimming</em> is getting the gist fast — title, abstract, headings, first sentence of each paragraph, conclusion. Scan to find, skim to decide.</li>
<li><strong>Applied to a result list.</strong> Skim the title and abstract of each hit: does it address your sub-topic, at your level, with the kind of evidence you need? Most results die here, and that is the point. Only the survivors deserve the download.</li>
</ul>
<p class="meo">💡 One line: <strong>credibility = can I trust it · relevance = do I need it</strong>. Test relevance first because it is faster.</p>
<p class="pitfall">⚠️ The three bullets on this slide are <strong>word for word identical to slide 52 (3.2b)</strong>, just as 2.4a/2.4b were. Note the repetition once and move on.</p>`,
        `<p class="y-chinh">🎯 Một tiêu chí MỚI xuất hiện, và nó TÁCH BIỆT với độ tin cậy: <strong>mức liên quan (relevance)</strong>. Ba mục tiêu — hiểu các tiêu chí đánh giá mức liên quan · <strong>đọc lướt tìm (scan) &amp; đọc lướt nắm ý (skim)</strong> kết quả tìm kiếm để đánh giá mức liên quan với chủ đề/câu hỏi nghiên cứu · áp dụng tiêu chí để đánh giá mức liên quan.</p>
<table>
<tr><th></th><th>Độ tin cậy (3.1)</th><th>Mức liên quan (3.2)</th></tr>
<tr><td>Câu hỏi đặt ra</td><td>Mình có tin được cái này không?</td><td>Mình có CẦN cái này không?</td></tr>
<tr><td>Là tính chất của</td><td>Bản thân cái nguồn</td><td>Cái nguồn <em>VÀ câu hỏi của bạn</em></td></tr>
<tr><td>Phán bằng</td><td>Purpose, Author, Audience, Objectivity, Accuracy, Currency</td><td>Bốn câu hỏi ở slide 51</td></tr>
<tr><td>Nếu trượt</td><td>Đừng TRÍCH nó</td><td>Đừng ĐỌC nó</td></tr>
</table>
<ul>
<li><strong>Hai thứ ĐỘC LẬP với nhau, và cần cả hai.</strong> Một bài bình duyệt xuất sắc về một chủ đề lân cận thì đáng tin mà không liên quan. Một bài blog đúng chóc chủ đề thì liên quan mà không đáng tin. Một nguồn phải qua CẢ HAI phép thử mới có chỗ trong báo cáo của bạn.</li>
<li><strong>Mức liên quan là phép thử RẺ hơn, nên chạy nó TRƯỚC.</strong> Bạn phán được mức liên quan từ tiêu đề, abstract và một cái liếc vào các đề mục — ba mươi giây. Phán độ tin cậy cho tử tế thì mất vài phút. Lọc theo mức liên quan trước nghĩa là bạn chỉ tiêu phép thử đắt tiền lên những ứng viên xứng đáng.</li>
<li><strong>Scan và skim là HAI kỹ thuật khác nhau và slide gọi tên cả hai.</strong> <em>Scan</em> là SĂN một thứ cụ thể — từ khoá của bạn, một con số, một cái tên — cho mắt chạy dọc trang. <em>Skim</em> là nắm ý chính thật nhanh — tiêu đề, abstract, các đề mục, câu đầu của mỗi đoạn, kết luận. Scan để TÌM, skim để QUYẾT.</li>
<li><strong>Áp vào một danh sách kết quả.</strong> Skim tiêu đề và abstract từng kết quả: nó có chạm đúng tiểu chủ đề của bạn, ở đúng mức độ của bạn, với đúng loại bằng chứng bạn cần không? Phần lớn kết quả chết ở đây, và đó chính là mục đích. Chỉ những cái sống sót mới đáng tải về.</li>
</ul>
<p class="meo">💡 Một dòng: <strong>tin cậy = có tin được không · liên quan = có cần không</strong>. Thử mức liên quan trước vì nó nhanh hơn.</p>
<p class="pitfall">⚠️ Ba gạch đầu dòng trên slide này <strong>GIỐNG NGUYÊN VĂN slide 52 (3.2b)</strong>, y như cặp 2.4a/2.4b trước đó. Ghi nhận chỗ lặp một lần rồi đi tiếp.</p>`],

      [51, 'Summary: Establishing Relevance — the four questions',
        `<p class="y-chinh">🎯 Four questions, and they are the whole of section 3.2: <strong>Is the information related to your topic or your question? · Does the source meet the needs of your assignment? · Is the information source written at an appropriate level? · Is the information appropriately explored?</strong></p>
<table>
<tr><th>Question</th><th>It is really asking</th><th>How to check in seconds</th></tr>
<tr><td>Related to your topic or question?</td><td>Subject match</td><td>Title and abstract, key terms present</td></tr>
<tr><td>Meets the needs of your assignment?</td><td>Task match — the verb and the source type required</td><td>Does it supply evidence, or only opinion?</td></tr>
<tr><td>Written at an appropriate level?</td><td>Audience match</td><td>Too popular to cite? Too specialised to understand?</td></tr>
<tr><td>Appropriately explored?</td><td>Depth match</td><td>Is the topic treated in depth, or mentioned in passing?</td></tr>
</table>
<ul>
<li><strong>Question 1 and question 4 are not the same, and this is the pair people confuse.</strong> A forty-page paper on machine learning that mentions employment in one sentence <em>is related</em> to your topic and <em>has not explored it</em>. Relatedness is about subject; exploration is about depth.</li>
<li><strong>Question 2 quietly drags in the assignment brief.</strong> "The needs of your assignment" means the instruction verb from step 1 and the source types from step 3. If the assignment says <em>evaluate</em>, an opinion piece with no evidence does not meet the need no matter how on-topic it is.</li>
<li><strong>Question 3 cuts in two directions.</strong> Too popular — a newspaper summary of a study — and it is below the level your report needs. Too specialised — a mathematical treatment four courses ahead of you — and you cannot use it responsibly. Cite what you can actually read and defend.</li>
<li><strong>At FPTU, question 4 is the usual reason a related-work section reads thin.</strong> Ten sources that each mention your topic once produce ten shallow sentences. Three sources that each explore it produce an argument. Prefer depth over count.</li>
</ul>
<p class="dap-an">✅ Apply all four to a real case. You are writing SWR302 on requirements traceability and you find a 2013 industry white paper that devotes two pages to it. Related? ✅ Needs of the assignment? ⚠️ — it is vendor-produced, so use it for practice description, not for effectiveness claims. Appropriate level? ✅ practitioner level, readable. Appropriately explored? ✅ two dedicated pages. ⇒ usable, with its role stated explicitly in your sentence.</p>
<p class="meo">💡 Four words for the four questions: <strong>TOPIC · TASK · LEVEL · DEPTH</strong>. Slide 53 asks the same four in a different order — the order carries no meaning, so learn the four words, not their sequence.</p>`,
        `<p class="y-chinh">🎯 Bốn câu hỏi, và chúng là TOÀN BỘ mục 3.2: <strong>Thông tin này có liên quan tới chủ đề hoặc câu hỏi của bạn không? · Nguồn này có đáp ứng yêu cầu của bài tập không? · Nguồn thông tin có được viết ở mức độ phù hợp không? · Thông tin có được khai thác đủ sâu không?</strong></p>
<table>
<tr><th>Câu hỏi</th><th>Thật ra đang hỏi gì</th><th>Kiểm trong vài giây thế nào</th></tr>
<tr><td>Có liên quan tới chủ đề/câu hỏi?</td><td>Khớp về CHỦ ĐỀ</td><td>Tiêu đề và abstract, có mặt các từ khoá</td></tr>
<tr><td>Có đáp ứng yêu cầu bài tập?</td><td>Khớp về NHIỆM VỤ — động từ đề bài và loại nguồn cần</td><td>Nó cung cấp BẰNG CHỨNG hay chỉ có ý kiến?</td></tr>
<tr><td>Viết ở mức độ phù hợp?</td><td>Khớp về ĐỐI TƯỢNG</td><td>Phổ thông quá nên không trích được? Chuyên sâu quá nên không hiểu?</td></tr>
<tr><td>Khai thác đủ sâu?</td><td>Khớp về CHIỀU SÂU</td><td>Chủ đề được bàn kỹ hay chỉ nhắc lướt qua?</td></tr>
</table>
<ul>
<li><strong>Câu 1 và câu 4 KHÁC NHAU, và đây đúng là cặp người ta hay lẫn.</strong> Một bài bốn mươi trang về học máy mà nhắc tới việc làm đúng một câu thì <em>CÓ liên quan</em> tới chủ đề của bạn và <em>KHÔNG khai thác</em> nó. Liên quan là chuyện CHỦ ĐỀ; khai thác là chuyện CHIỀU SÂU.</li>
<li><strong>Câu 2 lặng lẽ kéo cả đề bài vào.</strong> "Yêu cầu của bài tập" nghĩa là động từ mệnh lệnh ở bước 1 và loại nguồn ở bước 3. Nếu đề bảo <em>đánh giá</em> thì một bài bình luận không có bằng chứng sẽ không đáp ứng yêu cầu, dù nó đúng chủ đề tới đâu.</li>
<li><strong>Câu 3 cắt theo HAI chiều.</strong> Phổ thông quá — một bài báo chí tóm tắt lại một nghiên cứu — thì dưới mức báo cáo của bạn cần. Chuyên sâu quá — một xử lý toán học vượt bốn môn so với trình độ hiện tại — thì bạn không dùng nó một cách có trách nhiệm được. Hãy trích thứ bạn thật sự đọc được và bảo vệ được.</li>
<li><strong>Ở FPTU, câu 4 là lý do thường gặp khiến phần công trình liên quan đọc mỏng.</strong> Mười nguồn mà mỗi cái chỉ nhắc chủ đề của bạn một lần thì cho ra mười câu nông. Ba nguồn mà mỗi cái khai thác nó thì cho ra một LẬP LUẬN. Ưu tiên chiều sâu hơn số lượng.</li>
</ul>
<p class="dap-an">✅ Áp đủ bốn câu vào một ca thật. Bạn viết SWR302 về truy vết yêu cầu (requirements traceability) và tìm được một white paper ngành năm 2013 dành hai trang cho nó. Liên quan? ✅ Đáp ứng yêu cầu bài? ⚠️ — do hãng sản xuất, nên dùng để MÔ TẢ THỰC HÀNH, không dùng cho khẳng định về hiệu quả. Mức độ phù hợp? ✅ mức người làm nghề, đọc được. Khai thác đủ sâu? ✅ hai trang dành riêng. ⇒ dùng được, miễn là nêu rõ vai trò của nó ngay trong câu văn.</p>
<p class="meo">💡 Bốn chữ cho bốn câu hỏi: <strong>CHỦ ĐỀ · NHIỆM VỤ · MỨC ĐỘ · CHIỀU SÂU</strong>. Slide 53 hỏi đúng bốn câu ấy theo thứ tự khác — thứ tự không mang ý nghĩa gì, nên hãy thuộc bốn chữ chứ đừng thuộc trình tự.</p>`],

      [52, '3.2b Establishing Relevance — learning outcomes (identical to 3.2a)',
        `<p class="y-chinh">🎯 The objectives slide for 3.2b, and the three bullets are <strong>identical to slide 50</strong>: understand criteria to evaluate relevance · scan &amp; skim search results to evaluate relevance to the research topic/question · apply criteria to evaluate relevance.</p>
<ul>
<li><strong>State the repetition, then use the slide for something useful.</strong> There is no new content on the image. The productive thing to do here is to practise the technique the middle bullet names, because "scan and skim" is the only genuinely physical skill in this module.</li>
<li><strong>How to skim a result list properly.</strong> Give each hit twenty seconds: read the title, read the first and last sentence of the abstract, glance at the year and the venue. Decide keep / discard / maybe, and move on. Do not open tabs — deciding later is how you end up with forty tabs and no notes.</li>
<li><strong>How to skim a paper you kept.</strong> Abstract → conclusion → figures and tables → headings → first sentence of each paragraph in the section you care about. You will know within three minutes whether it is worth a full read, and most are not.</li>
<li><strong>How to scan.</strong> Open the PDF and use find (Ctrl+F) for your key term and its synonyms. Where the term clusters is where the relevant discussion is. This directly answers question 4 of slide 51 — one mention means "not explored", a dozen in one section means "explored".</li>
<li><strong>Why this matters for time, which is the real constraint.</strong> Forty hits at full reading speed is a week you do not have. Forty hits skimmed at twenty seconds each is fourteen minutes, and it leaves you with the five that deserve real attention.</li>
</ul>
<p class="dap-an">✅ Quick decision rule for a search result: keep it if (1) the key terms appear in the <em>title or abstract</em>, (2) the venue and year fit, and (3) the abstract states a <em>finding</em>, not just a topic. Fail any one ⇒ discard without guilt.</p>
<p class="meo">💡 <strong>Scan = Ctrl+F for a specific thing. Skim = structured tour for the gist.</strong> If an exam item defines one of them, that distinction is the answer.</p>
<p class="pitfall">⚠️ Skimming is not the same as reading badly. It is a deliberate technique with a fixed route (abstract → conclusion → figures → headings) and a decision at the end. Drifting through a paper front to back while tired is neither skimming nor reading.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của 3.2b, và ba gạch đầu dòng <strong>GIỐNG HỆT slide 50</strong>: hiểu tiêu chí đánh giá mức liên quan · scan &amp; skim kết quả tìm kiếm để đánh giá mức liên quan với chủ đề/câu hỏi · áp dụng tiêu chí để đánh giá mức liên quan.</p>
<ul>
<li><strong>Nói thẳng chỗ lặp, rồi dùng slide này vào việc có ích.</strong> Trên ảnh không có nội dung mới. Việc đáng làm ở đây là LUYỆN đúng kỹ thuật mà gạch đầu dòng giữa gọi tên, vì "scan và skim" là kỹ năng THAO TÁC thật sự duy nhất trong module này.</li>
<li><strong>Skim một danh sách kết quả cho đúng cách.</strong> Cho mỗi kết quả HAI MƯƠI giây: đọc tiêu đề, đọc câu đầu và câu cuối của abstract, liếc năm công bố và nơi công bố. Quyết GIỮ / BỎ / CÓ THỂ, rồi đi tiếp. Đừng mở tab — để quyết sau chính là cách bạn kết thúc với bốn mươi tab và không ghi chú nào.</li>
<li><strong>Skim một bài đã giữ lại.</strong> Abstract → kết luận → hình và bảng → các đề mục → câu đầu mỗi đoạn trong phần bạn quan tâm. Trong ba phút bạn biết nó có đáng đọc kỹ không, và phần lớn là không.</li>
<li><strong>Scan thế nào.</strong> Mở PDF và dùng tìm kiếm (Ctrl+F) với từ khoá của bạn và các từ đồng nghĩa. Chỗ nào từ khoá TỤM LẠI là chỗ có phần bàn luận liên quan. Việc này trả lời thẳng câu hỏi 4 của slide 51 — nhắc một lần nghĩa là "chưa khai thác", chục lần trong cùng một mục nghĩa là "có khai thác".</li>
<li><strong>Vì sao chuyện này quan trọng về THỜI GIAN, thứ ràng buộc thật sự.</strong> Bốn mươi kết quả đọc với tốc độ đọc kỹ là một tuần bạn không có. Bốn mươi kết quả skim hai mươi giây mỗi cái là mười bốn phút, và nó để lại cho bạn năm cái xứng đáng được chú ý thật.</li>
</ul>
<p class="dap-an">✅ Quy tắc quyết nhanh cho một kết quả tìm kiếm: GIỮ nếu (1) từ khoá xuất hiện trong <em>tiêu đề hoặc abstract</em>, (2) nơi công bố và năm phù hợp, và (3) abstract nêu một <em>KẾT QUẢ TÌM ĐƯỢC</em> chứ không chỉ nêu chủ đề. Trượt bất kỳ điều nào ⇒ bỏ, không cần áy náy.</p>
<p class="meo">💡 <strong>Scan = Ctrl+F tìm một thứ cụ thể. Skim = đi một vòng có lộ trình để nắm ý.</strong> Câu thi nào định nghĩa một trong hai thì phân biệt đó chính là đáp án.</p>
<p class="pitfall">⚠️ Skim KHÔNG phải là đọc ẩu. Nó là một kỹ thuật có chủ đích với lộ trình cố định (abstract → kết luận → hình → đề mục) và một QUYẾT ĐỊNH ở cuối. Lướt mắt từ đầu đến cuối một bài báo trong lúc buồn ngủ thì không phải skim, cũng không phải đọc.</p>`],

      [53, 'Establishing Relevance — the four-box checklist',
        `<p class="y-chinh">🎯 The same four relevance questions as slide 51, rendered as <strong>four empty tick-boxes</strong>, in a different order: <em>Does the source meet the needs of your assignment? · Is the information source written at an appropriate level? · Is the information appropriately explored? · Is the information related to your topic or question?</em></p>
<ul>
<li><strong>The reordering carries no meaning — check the two slides against each other and you will see it.</strong> Slide 51 starts with "related to your topic"; slide 53 ends with it. Same four items. Learn the four ideas; never learn them as a numbered sequence, because the deck itself does not keep one.</li>
<li><strong>The empty boxes mean this is a tool to use, not a list to read.</strong> Print it, or copy the four lines into your notes, and run every source you download through it. Four ticks in thirty seconds, and the "maybe" pile stops growing.</li>
<li><strong>Combine it with the credibility checklist into one pass.</strong> Relevance first (4 boxes, fast) — discard anything that fails. Then credibility (6 boxes, slower) on the survivors. Two filters in the right order is the whole of information literacy in practice.</li>
<li><strong>Write the verdict down next to the source.</strong> "Kept — explores traceability over two pages, vendor-produced so use for practice description only." Three months later, that one line is the difference between rereading the paper and just using it.</li>
</ul>
<table>
<tr><th>Source</th><th>Assignment needs</th><th>Level</th><th>Explored</th><th>Related</th><th>Verdict</th></tr>
<tr><td>Peer-reviewed study on exactly your question</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>Keep, cite</td></tr>
<tr><td>Newspaper report about that same study</td><td>❌ secondhand</td><td>❌ popular</td><td>⚠️</td><td>✅</td><td>Discard, find the study</td></tr>
<tr><td>Long paper that mentions your topic once</td><td>⚠️</td><td>✅</td><td>❌</td><td>✅</td><td>Discard — related but not explored</td></tr>
<tr><td>Vendor white paper with two dedicated pages</td><td>⚠️</td><td>✅</td><td>✅</td><td>✅</td><td>Keep, label as vendor-produced</td></tr>
</table>
<p class="meo">💡 Row three of that table is the exam's favourite case. <strong>Related ≠ explored.</strong> If you remember only one thing from section 3.2, remember that a source can be perfectly on-topic and still be useless because it never goes into the topic.</p>
<p class="pitfall">⚠️ Count carefully under pressure: relevance has <strong>4</strong> questions (slides 51 and 53), general credibility has <strong>6</strong> criteria (slide 45), web resources have <strong>4</strong> criteria (slide 47), Wikipedia has <strong>6</strong> boxes (slide 49). Two fours and two sixes — and the two fours are completely different lists.</p>`,
        `<p class="y-chinh">🎯 Vẫn bốn câu hỏi về mức liên quan như slide 51, nhưng trình bày thành <strong>BỐN ô tick trống</strong>, và theo thứ tự KHÁC: <em>Nguồn này có đáp ứng yêu cầu của bài tập không? · Nguồn thông tin có được viết ở mức độ phù hợp không? · Thông tin có được khai thác đủ sâu không? · Thông tin có liên quan tới chủ đề hoặc câu hỏi của bạn không?</em></p>
<ul>
<li><strong>Việc đảo thứ tự KHÔNG mang ý nghĩa gì — đối chiếu hai slide là thấy.</strong> Slide 51 mở đầu bằng "liên quan tới chủ đề"; slide 53 kết thúc bằng câu đó. Cùng bốn mục. Hãy học bốn Ý; đừng bao giờ học chúng như một trình tự đánh số, vì chính deck cũng không giữ trình tự nào.</li>
<li><strong>Các ô trống nghĩa là đây là CÔNG CỤ để dùng, không phải danh sách để đọc.</strong> In nó ra, hoặc chép bốn dòng vào vở, rồi cho mọi nguồn bạn tải về chạy qua nó. Bốn dấu tick trong ba mươi giây, và đống "để tính sau" ngừng phình ra.</li>
<li><strong>Gộp nó với bảng kiểm độ tin cậy thành một lượt.</strong> Mức liên quan trước (4 ô, nhanh) — trượt thì loại ngay. Rồi độ tin cậy (6 ô, chậm hơn) cho những cái sống sót. Hai cái lọc theo đúng thứ tự chính là toàn bộ năng lực thông tin trong thực hành.</li>
<li><strong>Ghi kết luận ra ngay cạnh cái nguồn.</strong> "Giữ — khai thác truy vết yêu cầu trong hai trang, do hãng viết nên chỉ dùng để mô tả thực hành." Ba tháng sau, đúng một dòng đó là khác biệt giữa việc phải đọc lại cả bài và việc dùng được ngay.</li>
</ul>
<table>
<tr><th>Nguồn</th><th>Đáp ứng bài</th><th>Mức độ</th><th>Khai thác</th><th>Liên quan</th><th>Kết luận</th></tr>
<tr><td>Nghiên cứu bình duyệt đúng chóc câu hỏi của bạn</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>Giữ, trích dẫn</td></tr>
<tr><td>Bài báo chí tường thuật lại chính nghiên cứu đó</td><td>❌ qua tay</td><td>❌ phổ thông</td><td>⚠️</td><td>✅</td><td>Bỏ, đi tìm bản nghiên cứu gốc</td></tr>
<tr><td>Bài dài nhưng chỉ nhắc chủ đề của bạn một lần</td><td>⚠️</td><td>✅</td><td>❌</td><td>✅</td><td>Bỏ — liên quan nhưng không khai thác</td></tr>
<tr><td>White paper của hãng, có hai trang dành riêng</td><td>⚠️</td><td>✅</td><td>✅</td><td>✅</td><td>Giữ, ghi rõ là tài liệu của hãng</td></tr>
</table>
<p class="meo">💡 Hàng thứ ba của bảng đó là ca đề thi thích nhất. <strong>Liên quan ≠ khai thác.</strong> Nếu chỉ nhớ được một điều từ mục 3.2, hãy nhớ rằng một nguồn có thể đúng chủ đề hoàn hảo mà vẫn vô dụng vì nó không hề đi vào chủ đề đó.</p>
<p class="pitfall">⚠️ Đếm cho kỹ lúc căng thẳng: mức liên quan có <strong>4</strong> câu hỏi (slide 51 và 53), độ tin cậy chung có <strong>6</strong> tiêu chí (slide 45), tài nguyên web có <strong>4</strong> tiêu chí (slide 47), Wikipedia có <strong>6</strong> ô (slide 49). Hai cái bốn và hai cái sáu — và hai cái BỐN là hai danh sách hoàn toàn khác nhau.</p>`],

      [54, '3.3a Managing information: Files — learning outcomes',
        `<p class="y-chinh">🎯 The last skill in this block, and the most immediately practical: <strong>use file-naming conventions to effectively label information</strong>, and <strong>use folder hierarchies to store information</strong>.</p>
<ul>
<li><strong>Why a study-skills course bothers with filenames.</strong> Everything earlier in this lesson produces files — PDFs you downloaded, notes you wrote, drafts you revised. A search strategy is worthless if you cannot find the paper you already read three weeks ago. Managing information is the step that makes all the previous steps compound instead of evaporate.</li>
<li><strong>Two mechanisms, and they solve different problems.</strong> A <em>naming convention</em> makes a file identifiable and sortable on sight. A <em>folder hierarchy</em> makes a set of files navigable. You need both: perfect names in one giant folder still means scrolling, and perfect folders full of "Document1.docx" still means opening everything.</li>
<li><strong>A hierarchy that works for a semester.</strong> <code>Semester / Subject code / Assignment / (sources · drafts · final)</code>. Three or four levels is right — deeper and you stop putting things away, shallower and you cannot find them. Keep the source PDFs separate from your own writing; they have different lifetimes.</li>
<li><strong>Two habits worth more than the convention itself.</strong> (1) Name a file the moment you save it, never "later" — later never comes and it becomes <code>paper(3).pdf</code>. (2) Keep one plain-text or spreadsheet file per assignment as the index: filename, what it is, why you kept it. That index is also the search log from slide 43.</li>
<li><strong>At FPTU this is a team problem, not a personal one.</strong> SWP391 and SWR302 are group subjects with a shared drive. Agree the convention in week one and write it in the repository README; without that, four people invent four schemes and the fifth person cannot find anything.</li>
</ul>
<p class="meo">💡 Test of a good filename: could a teammate tell what the file is, and which version, <strong>without opening it</strong>? If not, the name is not doing its job.</p>
<p class="pitfall">⚠️ Two traps that bite later. Avoid spaces and accented characters in filenames that will live in a Git repository or a build path — they break tools quietly. And never encode version as "final", "final2", "final_real": use a date, which sorts and never lies.</p>`,
        `<p class="y-chinh">🎯 Kỹ năng cuối của khối này, và là kỹ năng dùng được ngay nhất: <strong>dùng quy ước đặt tên tệp để gắn nhãn thông tin cho hiệu quả</strong>, và <strong>dùng cây thư mục để lưu trữ thông tin</strong>.</p>
<ul>
<li><strong>Vì sao một môn kỹ năng học tập lại bận tâm chuyện tên file.</strong> Mọi thứ phía trước trong bài này đều SINH RA FILE — các PDF bạn tải, ghi chú bạn viết, các bản nháp bạn sửa. Một chiến lược tìm kiếm là vô giá trị nếu bạn không tìm lại nổi bài báo chính mình đã đọc ba tuần trước. Quản lý thông tin là bước khiến mọi bước trước CỘNG DỒN thay vì bốc hơi.</li>
<li><strong>Hai cơ chế, và chúng giải hai bài toán khác nhau.</strong> <em>Quy ước đặt tên</em> làm một file nhận ra được và sắp xếp được chỉ bằng mắt. <em>Cây thư mục</em> làm một TẬP file đi lại được. Cần cả hai: tên hoàn hảo mà nhét hết vào một thư mục khổng lồ thì vẫn phải cuộn, còn thư mục hoàn hảo mà toàn "Document1.docx" thì vẫn phải mở từng cái.</li>
<li><strong>Một cây thư mục chạy được cho cả học kỳ.</strong> <code>Học kỳ / Mã môn / Bài tập / (nguồn · bản nháp · bản nộp)</code>. Ba hoặc bốn tầng là vừa — sâu hơn thì bạn sẽ lười cất đồ, nông hơn thì bạn không tìm ra. Để PDF nguồn TÁCH khỏi bài viết của chính bạn; hai thứ đó có vòng đời khác nhau.</li>
<li><strong>Hai thói quen còn giá trị hơn cả bản thân quy ước.</strong> (1) Đặt tên file NGAY lúc lưu, đừng bao giờ "để lát nữa" — lát nữa không bao giờ tới và nó thành <code>paper(3).pdf</code>. (2) Giữ một file văn bản thuần hoặc bảng tính cho mỗi bài tập làm MỤC LỤC: tên file, nó là gì, vì sao giữ. Cái mục lục đó cũng chính là nhật ký tìm kiếm ở slide 43.</li>
<li><strong>Ở FPTU đây là bài toán của NHÓM, không phải của cá nhân.</strong> SWP391 và SWR302 là môn làm nhóm với ổ đĩa dùng chung. Hãy thống nhất quy ước ngay tuần đầu và ghi nó vào README của repo; không có bước đó thì bốn người nghĩ ra bốn kiểu và người thứ năm không tìm thấy gì cả.</li>
</ul>
<p class="meo">💡 Phép thử một cái tên file tốt: đồng đội có nói được đây là file gì, bản nào, <strong>mà KHÔNG cần mở ra</strong> không? Không được thì cái tên đang không làm việc của nó.</p>
<p class="pitfall">⚠️ Hai cái bẫy cắn về sau. Tránh dấu cách và ký tự có dấu trong tên file sẽ nằm trong repo Git hoặc trong đường dẫn build — chúng làm hỏng công cụ một cách âm thầm. Và đừng bao giờ mã hoá phiên bản bằng "final", "final2", "final_that": hãy dùng NGÀY, nó vừa sắp xếp được vừa không nói dối.</p>`],

      [55, 'Summary: File Naming — clear, concise, consistent, and YYYYMMDD',
        `<p class="y-chinh">🎯 The closing slide gives a concrete convention: <strong>be clear, concise and consistent</strong> · for <strong>references</strong> use <code>Author surname_Year_Keywords</code> · for <strong>your own material</strong>, put the date first written as <strong>YYYYMMDD</strong> and include the <strong>Course Code and key words</strong>.</p>
<table>
<tr><th>What the file is</th><th>Pattern from the slide</th><th>Example</th></tr>
<tr><td>A source you downloaded</td><td><code>Surname_Year_Keywords</code></td><td><code>Nwagwu_2015_peer-review-bibliometrics.pdf</code></td></tr>
<tr><td>Something you wrote</td><td><code>YYYYMMDD_CourseCode_keywords</code></td><td><code>20260919_SSL101c_mooc1-notes.docx</code></td></tr>
<tr><td>A draft being revised</td><td>same, new date each version</td><td><code>20260921_SWR302_srs-draft.docx</code></td></tr>
</table>
<ul>
<li><strong>Why YYYYMMDD specifically, and this is the exam-worthy detail.</strong> It is the only date format that sorts <em>chronologically</em> when sorted <em>alphabetically</em>. <code>20260919</code> sorts after <code>20260301</code> automatically, while <code>19-09-2026</code> sorts next to every other 19th and <code>Sep 19</code> sorts under S. One format choice does all your version ordering for free.</li>
<li><strong>Why references get the author first and your own files get the date first.</strong> You look for a source by <em>who wrote it</em> — that is how citations work, and it makes your source folder sort into the same order as your reference list. You look for your own work by <em>when</em> — you want the newest draft. Different primary key, different first field.</li>
<li><strong>"Consistent" is the load-bearing word of the three.</strong> Clear and concise are nice; consistent is what makes a folder sortable and searchable. A convention followed imperfectly by you, or differently by each teammate, delivers none of the benefit. Pick one and never deviate.</li>
<li><strong>Including the course code is more useful than it looks.</strong> Files migrate — into a shared drive, into a backup, into next semester's folder. The course code survives the move; the folder it used to sit in does not.</li>
<li><strong>How this closes the loop of the whole lesson.</strong> Slides 28–33 told you what kinds of information exist; 35–43 how to find them and record the search; 44–53 how to judge them; 54–55 how to keep what survived. Find · judge · keep — and the keeping is the step that makes the work reusable next semester.</li>
</ul>
<p class="dap-an">✅ Name these two correctly. (1) A 2015 paper by Nwagwu and Onyancha on scholarly publishing ⇒ <code>Nwagwu_2015_scholarly-publishing.pdf</code>. (2) Your SWR302 requirements draft written on 21 September 2026 ⇒ <code>20260921_SWR302_requirements-draft.docx</code>.</p>
<p class="meo">💡 Three Cs and one number format: <strong>Clear · Concise · Consistent · YYYYMMDD</strong>. If a question asks which date format to use in a filename, the answer is the one that sorts correctly.</p>
<p class="pitfall">⚠️ Do not swap the two patterns. <strong>Sources → author first</strong> (you search by who wrote it). <strong>Your own files → date first</strong> (you search by how recent). Putting the date first on a downloaded paper destroys the alphabetical-by-author ordering that makes a source folder usable.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại đưa ra một quy ước rất cụ thể: <strong>rõ ràng, ngắn gọn và NHẤT QUÁN</strong> · với <strong>tài liệu tham khảo</strong> dùng <code>Họ tác giả_Năm_Từ khoá</code> · với <strong>tài liệu của chính bạn</strong>, để NGÀY lên đầu viết theo dạng <strong>YYYYMMDD</strong> và kèm <strong>Mã môn và từ khoá</strong>.</p>
<table>
<tr><th>File là cái gì</th><th>Khuôn trên slide</th><th>Ví dụ</th></tr>
<tr><td>Một nguồn bạn tải về</td><td><code>Họ_Năm_Từkhoá</code></td><td><code>Nwagwu_2015_peer-review-bibliometrics.pdf</code></td></tr>
<tr><td>Thứ bạn tự viết</td><td><code>YYYYMMDD_Mãmôn_từkhoá</code></td><td><code>20260919_SSL101c_mooc1-ghichu.docx</code></td></tr>
<tr><td>Bản nháp đang sửa</td><td>y như trên, mỗi phiên bản một ngày mới</td><td><code>20260921_SWR302_srs-nhap.docx</code></td></tr>
</table>
<ul>
<li><strong>Vì sao phải là YYYYMMDD, và đây là chi tiết đáng ra đề.</strong> Đó là dạng ngày DUY NHẤT mà khi sắp xếp theo <em>bảng chữ cái</em> thì nó sắp đúng theo <em>thời gian</em>. <code>20260919</code> tự động đứng sau <code>20260301</code>, trong khi <code>19-09-2026</code> thì nằm cạnh mọi ngày 19 khác, còn <code>Sep 19</code> thì xếp vào chữ S. Một lựa chọn định dạng làm không công toàn bộ việc sắp thứ tự phiên bản cho bạn.</li>
<li><strong>Vì sao tài liệu tham khảo để TÁC GIẢ trước còn file của bạn để NGÀY trước.</strong> Bạn tìm một nguồn theo <em>AI viết</em> — trích dẫn vận hành như vậy, và nó làm thư mục nguồn của bạn sắp đúng thứ tự với danh mục tham khảo. Bạn tìm bài của chính mình theo <em>KHI NÀO</em> — bạn muốn bản nháp mới nhất. Khoá chính khác nhau thì trường đứng đầu khác nhau.</li>
<li><strong>"Nhất quán" là chữ chịu lực trong bộ ba.</strong> Rõ ràng và ngắn gọn thì tốt; nhất quán mới là thứ làm một thư mục sắp được và tìm được. Một quy ước mà chính bạn theo lúc được lúc không, hoặc mỗi đồng đội theo một kiểu, thì chẳng đem lại lợi ích nào. Chọn một kiểu và không bao giờ lệch.</li>
<li><strong>Đưa mã môn vào hữu ích hơn vẻ ngoài của nó.</strong> File thì di cư — sang ổ đĩa chung, vào bản sao lưu, vào thư mục học kỳ sau. Mã môn sống sót qua các cuộc di chuyển đó; cái thư mục nó từng nằm trong thì không.</li>
<li><strong>Chỗ này khép vòng cả bài học.</strong> Slide 28–33 nói có những LOẠI thông tin nào; 35–43 nói TÌM chúng và GHI LẠI phép tìm ra sao; 44–53 nói PHÁN XÉT chúng thế nào; 54–55 nói GIỮ lại thứ đã sống sót ra sao. Tìm · phán · giữ — và chính bước "giữ" mới làm công sức của bạn dùng lại được vào học kỳ sau.</li>
</ul>
<p class="dap-an">✅ Đặt tên đúng cho hai thứ này. (1) Một bài năm 2015 của Nwagwu và Onyancha về xuất bản học thuật ⇒ <code>Nwagwu_2015_scholarly-publishing.pdf</code>. (2) Bản nháp đặc tả yêu cầu SWR302 của bạn viết ngày 21/09/2026 ⇒ <code>20260921_SWR302_requirements-draft.docx</code>.</p>
<p class="meo">💡 Ba chữ C và một dạng số: <strong>Clear · Concise · Consistent · YYYYMMDD</strong>. Câu nào hỏi nên dùng dạng ngày nào trong tên file thì đáp án là dạng sắp xếp ĐÚNG.</p>
<p class="pitfall">⚠️ Đừng đảo hai khuôn cho nhau. <strong>Nguồn → tác giả trước</strong> (bạn tìm theo ai viết). <strong>File của bạn → ngày trước</strong> (bạn tìm theo mức mới). Để ngày lên đầu một bài báo tải về là phá luôn thứ tự alphabet theo tác giả, thứ làm cho thư mục nguồn dùng được.</p>`],
    ]),
  ].join('\n'),
};

