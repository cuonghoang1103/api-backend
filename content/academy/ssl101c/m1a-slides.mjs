/**
 * SSL101c · Mooc 1 (Introduction to Information & Digital Literacy for
 * University Success) — học theo từng slide, phần slide 1–27 của deck 'ssl1'.
 *
 * ⚠️ BỘ SLIDE NÀY LÀ ẢNH. 101/109 slide của deck không có một ký tự nào trong
 * lớp text của .pptx (nền đỏ, bản gốc University of Sydney được dựng thành ảnh
 * toàn trang). File /tmp/ssl101c-text/ssl1.txt gần như rỗng và KHÔNG dùng được
 * làm nguồn. Toàn bộ 27 slide trong bài này đã được ĐỌC THẲNG TỪ ẢNH
 * /tmp/ssl101c-slides/ssl1/001..027.webp.
 *
 * Ghi chú đối chiếu (chỗ lớp chữ và ảnh KHÔNG khớp — không im lặng chép):
 *   · slide 25: lớp text của .pptx còn sót dòng "List part of a journal
 *     article", nhưng ẢNH slide 25 là trang tiêu đề "2.1b Primary, Secondary
 *     and Tertiary Sources". Lấy theo ẢNH.
 *   · slide 13 và slide 14 là HAI slide GIỐNG HỆT NHAU ("Information Literacy",
 *     7 gạch đầu dòng, cùng nguồn Bundy 2004) — lặp trong chính file gốc.
 *   · slide 7 viết SAI chính tả "Enviroment" (thiếu chữ n) trên sơ đồ ba vòng
 *     tròn. Giữ nguyên chữ của slide, có chú thích.
 *   · slide 20 liệt kê 5 dạng academic misconduct nhưng trong khoảng 1–27 chỉ
 *     có slide "giá trị bị vi phạm" cho Cheating (21) và Facilitation (22).
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl1';

export default {
  title: '1.0a — Slide by slide: Academic culture, information literacy, integrity and the scholarly record (slides 1–27)|||1.0a — Slide bài giảng: Văn hoá học thuật, năng lực thông tin, liêm chính & khởi đầu hồ sơ học thuật (slide 1–27)',
  slug: 'ssl101c-1-0a-slides-van-hoa-hoc-thuat-liem-chinh',
  type: 'DOCUMENT',
  description: '27 slide đầu của Mooc 1 (SSL101c), đọc thẳng từ ảnh slide gốc University of Sydney. Đi từ cấu trúc khoá học Coursera, định nghĩa văn hoá học thuật (Brick, 2014) và mô hình ba vòng tròn giá trị → hành vi → môi trường, qua 10 giá trị học thuật và bảy bước của information literacy (Bundy, 2004), tới trọng tâm dễ ra đề nhất: liêm chính học thuật với 5 giá trị trung tâm (Honesty · Trust · Fairness · Respect · Responsibility) và 5 dạng academic misconduct, rồi mở sang phân biệt Information ≠ Knowledge và hai loại hồ sơ Cultural Record / Scholarly Record. Mỗi slide đều quy về tình huống thật ở FPTU: tìm tài liệu cho SWP391, trích dẫn trong báo cáo, dùng AI thế nào là hợp lệ.',
  content: [
    walkHead(D, 1, 27),
    walk(D, [

      [1, 'Recall — Write down at least 1 key word about the spec 1 that you still remember',
        `<p class="y-chinh">🎯 A plain white warm-up slide with one instruction: <strong>write down at least one key word about specialization 1 that you still remember</strong>. It is a retrieval-practice exercise, and it is the first thing the review deck does on purpose.</p>
<ul>
<li><strong>"Spec 1" = Specialization 1</strong>, i.e. this whole Coursera specialization "Academic Skills for University Success" from the University of Sydney, of which Mooc 1 is the first of five courses. The slide is asking you to dig out what survived from your own reading, before the lecturer shows you anything.</li>
<li><strong>Why a review deck opens with recall, not a summary.</strong> Reading a summary feels productive and teaches almost nothing; <em>retrieving</em> a word from an empty page is what moves it into long-term memory. The effect has a name — the testing effect — and SSL101c is graded by <strong>one 60-minute multiple-choice exam covering all five MOOCs</strong>, so retrieval is exactly the skill being trained.</li>
<li><strong>What it is worth at FPTU.</strong> Do this for real for every subject, not just SSL101c: close the slide deck, write the three words you remember from the last session, then open and check. Five minutes per subject per week beats a whole night of re-reading before the PE.</li>
<li><strong>The key words that should surface here</strong> (they are the backbone of the next 26 slides): <em>academic culture</em>, <em>information literacy</em>, <em>digital literacy</em>, <em>academic integrity</em>, <em>plagiarism</em>, <em>referencing</em>, <em>the scholarly record</em>.</li>
<li><strong>Exam relevance.</strong> Nothing on this slide is examinable content by itself — but the vocabulary it is fishing for is exactly what the MCQs test, and almost every question is a definition-matching question.</li>
</ul>
<p class="dap-an">✅ A good answer here is any one of: academic culture · academic integrity · information literacy · plagiarism · referencing · critical thinking · scholarly record. If you could not produce even one, that is the diagnosis: re-watch Mooc 1 module 1 before going on.</p>
<p class="meo">💡 Memory hook for the whole of Mooc 1 in four words: <strong>CULTURE → LITERACY → INTEGRITY → SOURCES</strong>. Slides 5–11 are culture, 12–14 literacy, 16–22 integrity, 23–27 sources. Every slide in this lesson sits in one of those four boxes.</p>`,
        `<p class="y-chinh">🎯 Một slide trắng khởi động với đúng một yêu cầu: <strong>viết ra ít nhất MỘT từ khoá về specialization 1 mà bạn còn nhớ</strong>. Đây là bài tập "gọi lại từ trí nhớ" (retrieval practice), và deck ôn tập mở đầu bằng nó là CÓ CHỦ ĐÍCH.</p>
<ul>
<li><strong>"Spec 1" = Specialization 1</strong>, tức trọn bộ chuyên đề Coursera "Academic Skills for University Success" của University of Sydney, mà Mooc 1 là khoá đầu trong năm khoá. Slide bắt bạn moi ra thứ còn sót lại trong đầu mình, TRƯỚC khi giảng viên chiếu bất cứ thứ gì.</li>
<li><strong>Vì sao deck ôn tập mở bằng "recall" chứ không mở bằng tóm tắt.</strong> Đọc tóm tắt cho cảm giác đang học mà gần như không vào đầu; <em>tự moi ra</em> một từ trên trang giấy trắng mới là thứ đẩy kiến thức vào trí nhớ dài hạn. Hiện tượng này có tên: testing effect. Mà SSL101c chấm bằng <strong>MỘT bài trắc nghiệm 60 phút phủ cả 5 MOOC</strong> — nên "gọi lại" chính là kỹ năng đang được luyện.</li>
<li><strong>Áp dụng ở FPTU.</strong> Làm thật với mọi môn, không riêng SSL101c: đóng slide lại, viết ba từ còn nhớ của buổi trước, rồi mở ra đối chiếu. Mỗi môn 5 phút mỗi tuần ăn đứt một đêm cày lại slide trước kỳ PE.</li>
<li><strong>Những từ khoá ĐÁNG hiện ra ở đây</strong> (chính là xương sống của 26 slide sau): <em>academic culture</em> (văn hoá học thuật), <em>information literacy</em>, <em>digital literacy</em>, <em>academic integrity</em> (liêm chính học thuật), <em>plagiarism</em> (đạo văn), <em>referencing</em> (trích dẫn), <em>the scholarly record</em>.</li>
<li><strong>Liên quan tới đề thi.</strong> Bản thân slide này không có nội dung để ra đề — nhưng đúng cái vốn từ mà nó đang câu ra lại là thứ đề trắc nghiệm hỏi, và gần như mọi câu đều là dạng ghép định nghĩa.</li>
</ul>
<p class="dap-an">✅ Câu trả lời tốt ở đây là bất kỳ từ nào trong: academic culture · academic integrity · information literacy · plagiarism · referencing · critical thinking · scholarly record. Nếu bạn không nặn ra nổi một từ nào thì đó chính là chẩn đoán: xem lại Mooc 1 module 1 rồi hãy đi tiếp.</p>
<p class="meo">💡 Mẹo nhớ cả Mooc 1 bằng bốn chữ: <strong>VĂN HOÁ → NĂNG LỰC → LIÊM CHÍNH → NGUỒN</strong>. Slide 5–11 là văn hoá, 12–14 là năng lực thông tin, 16–22 là liêm chính, 23–27 là nguồn tin. Mọi slide trong bài này đều nằm trong một trong bốn ô đó.</p>`],

      [2, 'Reflection — three questions about what you liked, what was hardest, what you want to explore',
        `<p class="y-chinh">🎯 The second warm-up slide, three reflection questions: <strong>which idea did you like most? which did you find most challenging? which do you want to discover more about?</strong> Together with slide 1 this is a complete "recall then reflect" opening.</p>
<table>
<tr><th>Question on the slide</th><th>What it is really measuring</th><th>What to do with your answer</th></tr>
<tr><td>Which idea/knowledge do you <strong>like the most</strong>?</td><td>Intrinsic motivation — the hook that will keep you going through 5 MOOCs</td><td>Make it the angle of your discussion-board posts; you write better about what interests you</td></tr>
<tr><td>Which do you find <strong>the most challenging</strong>?</td><td>Your actual weak point, self-diagnosed</td><td>This is your revision list. It is almost always "referencing" or "evaluating sources"</td></tr>
<tr><td>Which do you <strong>want to discover more</strong>?</td><td>Curiosity — the seed of <em>independent learning</em> (slide 9)</td><td>Turn it into a real search question; Mooc 1 module 3 teaches how</td></tr>
</table>
<ul>
<li><strong>Reflection is not filler, it is one of the assessed academic values.</strong> Slide 9 lists <em>independent learning</em> and <em>critical thinking</em> as core expectations. You cannot learn independently without first knowing what you do not know — which is what question 2 is for.</li>
<li><strong>Why this matters for the SSL101c grade specifically.</strong> The subject is 100% one on-campus MCQ exam, but you can only sit it once you hold certificates for <strong>all five MOOCs</strong>, and finishing every MOOC before the deadline earns <strong>+1 bonus point</strong>. Question 2 ("what is hardest") is what tells you which MOOC will slow you down — plan it first, not last.</li>
<li><strong>Do it in writing, not in your head.</strong> An unrecorded reflection evaporates by the next morning. One line per question in a note app, dated, is enough; after five MOOCs you have a map of your own weak spots.</li>
</ul>
<p class="meo">💡 Exam-flavoured hook: the three questions map onto <strong>affective · diagnostic · exploratory</strong> reflection. If a question ever asks what the purpose of a reflection activity is, the safe answer is "to identify gaps in one's own understanding and direct further learning" — never "to be graded".</p>`,
        `<p class="y-chinh">🎯 Slide khởi động thứ hai, ba câu hỏi phản tư: <strong>ý tưởng nào bạn THÍCH nhất? ý tưởng nào bạn thấy KHÓ nhất? ý tưởng nào bạn MUỐN tìm hiểu thêm?</strong> Cùng với slide 1, đây là một cặp mở đầu trọn vẹn: gọi lại rồi soi lại.</p>
<table>
<tr><th>Câu hỏi trên slide</th><th>Nó thật sự đo cái gì</th><th>Làm gì với câu trả lời</th></tr>
<tr><td>Ý tưởng bạn <strong>thích nhất</strong>?</td><td>Động lực bên trong — cái móc kéo bạn qua hết 5 MOOC</td><td>Lấy nó làm góc nhìn cho bài đăng diễn đàn; viết về thứ mình thích bao giờ cũng hay hơn</td></tr>
<tr><td>Ý tưởng bạn thấy <strong>khó nhất</strong>?</td><td>Điểm yếu THẬT, do chính bạn tự chẩn</td><td>Đây là danh sách ôn tập. Gần như luôn là "trích dẫn" hoặc "đánh giá nguồn tin"</td></tr>
<tr><td>Ý tưởng bạn <strong>muốn đào sâu</strong>?</td><td>Sự tò mò — hạt giống của <em>independent learning</em> (slide 9)</td><td>Biến nó thành một câu hỏi tìm kiếm thật; Mooc 1 module 3 dạy cách làm</td></tr>
</table>
<ul>
<li><strong>Phản tư không phải phần độn, nó là một trong các giá trị học thuật được kỳ vọng.</strong> Slide 9 kể thẳng <em>independent learning</em> (tự học) và <em>critical thinking</em> (tư duy phản biện) là kỳ vọng cốt lõi. Không thể tự học nếu chưa biết mình đang KHÔNG biết cái gì — câu hỏi số 2 sinh ra để trả lời đúng chuyện đó.</li>
<li><strong>Vì sao riêng với SSL101c điều này rất thiết thực.</strong> Môn chấm 100% bằng một bài trắc nghiệm tại trường, nhưng bạn chỉ được thi khi đã có chứng chỉ của <strong>cả 5 MOOC</strong>, và hoàn thành mọi MOOC trước hạn được <strong>cộng 1 điểm thưởng</strong>. Câu "cái gì khó nhất" chính là thứ cho bạn biết MOOC nào sẽ làm bạn chậm — xếp nó làm TRƯỚC, đừng để cuối.</li>
<li><strong>Viết ra, đừng nghĩ trong đầu.</strong> Phản tư không ghi lại thì sáng hôm sau bay sạch. Mỗi câu một dòng trong app ghi chú, có ngày tháng, là đủ; qua 5 MOOC bạn có nguyên một bản đồ điểm yếu của chính mình.</li>
</ul>
<p class="meo">💡 Mẹo kiểu đề thi: ba câu hỏi ứng với ba kiểu phản tư <strong>cảm xúc · chẩn đoán · khám phá</strong>. Nếu đề hỏi mục đích của hoạt động reflection là gì, đáp án an toàn luôn là "để nhận ra lỗ hổng trong hiểu biết của chính mình và định hướng việc học tiếp theo" — KHÔNG BAO GIỜ là "để được chấm điểm".</p>`],

      [3, 'Summary: Welcome and Course Information — course structure, non-assessed activities, assessments',
        `<p class="y-chinh">🎯 The first red University of Sydney slide, and the administrative map of the whole MOOC: <strong>6 modules over 6 weeks · 1 module = 4 lessons · 1 lesson = 1 hour of study</strong>, plus what is assessed and what is not.</p>
<table>
<tr><th>Block</th><th>What the slide says</th></tr>
<tr><td><strong>Course structure</strong></td><td>6 modules &gt; 6 weeks · 1 module &gt; 4 lessons · 1 lesson &gt; 1 hour of study</td></tr>
<tr><td><strong>Non-assessed activities</strong></td><td>In-video questions &amp; polls · Short quizzes after each lesson</td></tr>
<tr><td><strong>Assessments</strong></td><td>Longer quizzes at the end of each module · Discussion board posts — <strong>at least 2 posts per week</strong> · Final summative assignment</td></tr>
</table>
<ul>
<li><strong>Do the arithmetic, it is the point of the slide.</strong> 6 modules × 4 lessons × 1 hour = <strong>24 hours of study</strong> spread over 6 weeks, i.e. about 4 hours a week. That is the honest cost of one MOOC — and you have five of them to certificate before you are allowed to sit the SSL101c exam.</li>
<li><strong>Know which activities are graded and which are not.</strong> In-video questions and post-lesson quizzes are <em>practice</em>: get them wrong freely, that is what they are for. End-of-module quizzes, discussion posts and the final assignment are what the Coursera certificate actually depends on.</li>
<li><strong>"At least 2 posts per week" is the line students miss.</strong> It is a participation floor, not a suggestion, and it is the most common reason a MOOC certificate does not arrive on time — which at FPTU costs you the <strong>+1 bonus point</strong> and, if it drags, the right to sit the exam at all.</li>
<li><strong>Map it onto an FPTU term.</strong> A term is 10 weeks; five MOOCs at 4 hours a week will not fit into the last fortnight. Put two fixed SSL101c slots in your weekly calendar from week 1 (for example Tuesday and Saturday evening) and treat them like a lab slot you cannot skip.</li>
<li><strong>Note the vocabulary the slide teaches in passing.</strong> <em>Non-assessed</em> = formative (for learning); <em>assessed</em> = summative (for grading). That pair comes back throughout the specialization.</li>
</ul>
<p class="pitfall">⚠️ Careful: this slide describes the structure of the <strong>Coursera MOOC</strong>, not the FPTU subject. The FPTU grading is different and much blunter: <strong>TE = 100%</strong> of the subject, pass requires TE ≥ 4 and FR = min(10, TE + Bonus) ≥ 5. The MOOC quizzes give you no FPTU marks at all — they give you the <em>certificate</em>, which is the ticket to the exam room.</p>`,
        `<p class="y-chinh">🎯 Slide đỏ đầu tiên của University of Sydney, và là bản đồ hành chính của cả MOOC: <strong>6 module trong 6 tuần · 1 module = 4 bài học · 1 bài học = 1 giờ học</strong>, kèm rõ cái gì có chấm, cái gì không.</p>
<table>
<tr><th>Khối</th><th>Slide ghi gì</th></tr>
<tr><td><strong>Cấu trúc khoá học</strong></td><td>6 module &gt; 6 tuần · 1 module &gt; 4 bài · 1 bài &gt; 1 giờ học</td></tr>
<tr><td><strong>Hoạt động KHÔNG chấm điểm</strong></td><td>Câu hỏi &amp; thăm dò trong video · Quiz ngắn sau mỗi bài</td></tr>
<tr><td><strong>Phần CÓ chấm điểm</strong></td><td>Quiz dài cuối mỗi module · Bài đăng diễn đàn — <strong>tối thiểu 2 bài mỗi tuần</strong> · Bài tập tổng kết cuối khoá</td></tr>
</table>
<ul>
<li><strong>Làm phép nhân đi, đó mới là ý của slide.</strong> 6 module × 4 bài × 1 giờ = <strong>24 giờ học</strong> trải trong 6 tuần, tức khoảng 4 giờ/tuần. Đó là cái giá thật của MỘT MOOC — mà bạn phải lấy chứng chỉ NĂM cái mới được thi SSL101c.</li>
<li><strong>Phân biệt cái nào chấm, cái nào không.</strong> Câu hỏi trong video và quiz sau bài là để <em>luyện</em>: sai thoải mái, chúng sinh ra để bạn sai. Quiz cuối module, bài đăng diễn đàn và bài tập cuối khoá mới là thứ quyết định có chứng chỉ Coursera hay không.</li>
<li><strong>"Tối thiểu 2 bài đăng mỗi tuần" là dòng sinh viên hay bỏ sót.</strong> Đó là mức sàn tham gia, không phải gợi ý, và là nguyên nhân phổ biến nhất khiến chứng chỉ MOOC về trễ — mà ở FPTU thì trễ là mất <strong>1 điểm thưởng</strong>, kéo dài nữa thì mất luôn quyền vào phòng thi.</li>
<li><strong>Quy về một kỳ ở FPTU.</strong> Một kỳ 10 tuần; năm MOOC × 4 giờ/tuần KHÔNG nhét vừa hai tuần cuối. Từ tuần 1 hãy đặt hai khung giờ SSL101c cố định trong lịch tuần (ví dụ tối thứ Ba và tối thứ Bảy) và coi như một slot lab không được nghỉ.</li>
<li><strong>Để ý cặp từ vựng slide dạy kèm.</strong> <em>Non-assessed</em> = formative (để học); <em>assessed</em> = summative (để chấm). Cặp này quay lại suốt cả specialization.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận: slide này mô tả cấu trúc của <strong>khoá Coursera</strong>, KHÔNG phải cách tính điểm môn ở FPTU. Ở FPTU thô hơn nhiều: <strong>TE = 100%</strong> điểm môn, qua môn khi TE ≥ 4 và FR = min(10, TE + Bonus) ≥ 5. Quiz trên Coursera không cho bạn điểm FPTU nào cả — nó cho bạn CHỨNG CHỈ, mà chứng chỉ mới là vé vào phòng thi.</p>`],

      [4, '1.1b Introduction to the Example Essay Question — learning objectives, assessment requirements, participation',
        `<p class="y-chinh">🎯 A lesson-objective slide for section <strong>1.1b</strong>. Three objectives: <strong>understand the learning objectives &amp; structure of the course · understand assessment requirements · understand the expectations for participation</strong>.</p>
<ul>
<li><strong>Read the red objective slides as the exam blueprint.</strong> Every lesson in this MOOC opens with one, and the verbs on it ("understand the definition of…", "identify…", "demonstrate awareness of…") are literally the things the MCQ exam can ask. When you revise, turn each bullet into a question and answer it aloud — that is free exam practice.</li>
<li><strong>Why an "example essay question" at all.</strong> The MOOC threads one running example essay through all six modules: you watch a real information need turn into a search, into sources, into a referenced piece of writing. It is the spine that connects otherwise abstract skills.</li>
<li><strong>Objective 1 — structure.</strong> Already delivered by slide 3 (6 modules / 4 lessons / 1 hour). Knowing the shape of a course before you start is itself an academic skill: it tells you where you are and how much is left.</li>
<li><strong>Objective 2 — assessment requirements.</strong> Also slide 3. At FPTU add one layer: <em>the MOOC's assessment gets you the certificate; the certificate gets you into the SSL101c exam; the exam is the whole grade.</em> Three links in a chain, and breaking any one of them costs the subject.</li>
<li><strong>Objective 3 — participation.</strong> The two-posts-per-week rule. Notice that a university treats <em>participation</em> as an expectation rather than a favour — slide 8's phrase "knowledge is a collective enterprise" is the reason why.</li>
<li><strong>Apply it at FPTU right now.</strong> Your FLM syllabus page for every subject has exactly this structure — objectives, assessment weights, participation rules. Most students never open it. Read it in week 1 of every subject and you will never be surprised by an assessment again.</li>
</ul>
<p class="meo">💡 Trick for the MCQ: objective-slide wording is the safest phrasing for an answer. If you must choose between "understand the definition of academic culture" and a fancier-sounding option, the plain slide wording is usually correct.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của tiểu mục <strong>1.1b</strong>. Ba mục tiêu: <strong>hiểu mục tiêu học tập &amp; cấu trúc khoá học · hiểu yêu cầu đánh giá · hiểu kỳ vọng về sự tham gia</strong>.</p>
<ul>
<li><strong>Hãy đọc các slide mục tiêu màu đỏ như BẢN ĐỒ ĐỀ THI.</strong> Mỗi bài trong MOOC đều mở bằng một slide như thế, và các động từ trên đó ("understand the definition of…", "identify…", "demonstrate awareness of…") đúng là thứ đề trắc nghiệm có thể hỏi. Khi ôn, hãy biến từng gạch đầu dòng thành một câu hỏi rồi tự trả lời thành tiếng — đó là luyện đề miễn phí.</li>
<li><strong>Vì sao lại có "example essay question".</strong> MOOC này xâu một bài luận mẫu xuyên suốt cả sáu module: bạn xem một nhu cầu thông tin có thật biến thành lệnh tìm kiếm, thành nguồn tài liệu, rồi thành một bài viết có trích dẫn. Nó là cái xương sống nối các kỹ năng vốn rất trừu tượng.</li>
<li><strong>Mục tiêu 1 — cấu trúc.</strong> Slide 3 đã trả xong (6 module / 4 bài / 1 giờ). Biết hình dáng một khoá học TRƯỚC khi bắt đầu tự nó đã là một kỹ năng học thuật: nó cho bạn biết mình đang ở đâu và còn bao nhiêu.</li>
<li><strong>Mục tiêu 2 — yêu cầu đánh giá.</strong> Cũng ở slide 3. Ở FPTU thêm một tầng nữa: <em>đánh giá của MOOC cho bạn chứng chỉ; chứng chỉ cho bạn vào phòng thi SSL101c; bài thi là toàn bộ điểm môn.</em> Ba mắt xích, đứt mắt nào cũng mất môn.</li>
<li><strong>Mục tiêu 3 — sự tham gia.</strong> Chính là luật 2 bài đăng/tuần. Để ý: đại học coi <em>tham gia</em> là KỲ VỌNG chứ không phải ân huệ — câu "tri thức là một sự nghiệp tập thể" ở slide 8 chính là lý do.</li>
<li><strong>Áp dụng ở FPTU ngay hôm nay.</strong> Trang syllabus trên FLM của MỌI môn đều có đúng cấu trúc này — mục tiêu, trọng số đánh giá, quy định tham gia. Phần lớn sinh viên không bao giờ mở ra. Đọc nó ở tuần 1 của từng môn thì bạn sẽ không bao giờ còn bị bất ngờ vì một đầu điểm nào nữa.</li>
</ul>
<p class="meo">💡 Mẹo làm trắc nghiệm: chữ trên slide mục tiêu là cách diễn đạt an toàn nhất cho đáp án. Phải chọn giữa "understand the definition of academic culture" và một phương án nghe kêu hơn thì cứ chọn đúng câu chữ mộc của slide.</p>`],

      [5, '1.2a Introduction to Academic Culture — definition, information & digital literacy, core values',
        `<p class="y-chinh">🎯 Objective slide for lesson <strong>1.2a</strong>, and it names the three things you must be able to state after this block: <strong>the definition of academic culture · the definition of information &amp; digital literacy within it · its core values &amp; expectations</strong>.</p>
<ul>
<li><strong>This is the single most exam-dense slide of the first twenty.</strong> All three bullets are "understand the definition of…" — and definition questions are the bread and butter of a 60-minute MCQ paper. Slides 6, 7, 8, 9, 13 supply the three definitions this slide promises.</li>
<li><strong>Why culture comes before skills.</strong> You cannot be told <em>how</em> to reference until you accept <em>why</em> a community that values "discovery and sharing of knowledge" (slide 8) must be able to trace every idea to its owner. Teaching the values first makes the rules stop feeling arbitrary.</li>
<li><strong>Culture here means the unwritten rules.</strong> Everyone is told the written rules (deadlines, word counts). What separates a comfortable student from a lost one is the <em>unwritten</em> layer: that you are expected to disagree with a source, that a lecturer is a facilitator and not an oracle, that "I found it on the internet" is not an answer.</li>
<li><strong>The FPTU version of the same shock.</strong> Students arriving from a Vietnamese high school usually meet three surprises at once: nobody dictates notes, the assignment asks for <em>your</em> argument, and copying a friend's code is not "helping" but misconduct. All three are academic culture, not rules of one teacher.</li>
<li><strong>Keep the three bullets as a checklist.</strong> After slide 14 you should be able to answer, in one sentence each, "what is academic culture?", "what is information literacy?", "name three academic values". If you cannot, you are not ready for the module quiz.</li>
</ul>
<p class="meo">💡 Remember the pairing <strong>1.2a = culture, 1.2b = literacy</strong>. The deck repeats the literacy bullet in both objective slides (slides 5 and 12), which is a hint that the examiners consider it the hinge of the module.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của bài <strong>1.2a</strong>, và nó gọi tên ba thứ bạn phải phát biểu được sau khối này: <strong>định nghĩa văn hoá học thuật · định nghĩa năng lực thông tin &amp; năng lực số trong văn hoá đó · các giá trị cốt lõi &amp; kỳ vọng của nó</strong>.</p>
<ul>
<li><strong>Đây là slide "đặc" điểm thi nhất trong hai chục slide đầu.</strong> Cả ba gạch đầu dòng đều là "hiểu ĐỊNH NGHĨA của…" — mà câu hỏi định nghĩa là món chính của một đề trắc nghiệm 60 phút. Slide 6, 7, 8, 9, 13 sẽ lần lượt cấp đúng ba định nghĩa mà slide này hứa.</li>
<li><strong>Vì sao dạy VĂN HOÁ trước KỸ NĂNG.</strong> Không thể bảo bạn <em>cách</em> trích dẫn khi bạn chưa chấp nhận <em>vì sao</em> một cộng đồng lấy "khám phá và chia sẻ tri thức" (slide 8) làm sứ mệnh thì buộc phải truy được mỗi ý tưởng về đúng chủ của nó. Dạy giá trị trước làm cho các luật lệ thôi có vẻ tuỳ tiện.</li>
<li><strong>"Văn hoá" ở đây nghĩa là các luật BẤT THÀNH VĂN.</strong> Luật thành văn (hạn nộp, số từ) thì ai cũng được phổ biến. Thứ phân biệt một sinh viên thoải mái với một sinh viên lạc lõng là tầng <em>bất thành văn</em>: rằng bạn được kỳ vọng phản bác một tài liệu, rằng giảng viên là người dẫn dắt chứ không phải nhà tiên tri, rằng "em thấy trên mạng" không phải một câu trả lời.</li>
<li><strong>Bản FPTU của cùng cú sốc đó.</strong> Sinh viên từ trường phổ thông Việt Nam lên thường gặp ba bất ngờ cùng lúc: không ai đọc cho chép, đề bài đòi lập luận <em>của chính bạn</em>, và chép code của bạn cùng lớp không phải "giúp nhau" mà là gian lận học thuật. Cả ba đều là văn hoá học thuật, không phải luật riêng của một thầy.</li>
<li><strong>Giữ ba gạch đầu dòng này làm checklist.</strong> Sau slide 14 bạn phải trả lời được, mỗi câu một dòng: "văn hoá học thuật là gì?", "information literacy là gì?", "kể ba giá trị học thuật". Chưa được thì chưa nên làm quiz cuối module.</li>
</ul>
<p class="meo">💡 Nhớ cặp <strong>1.2a = văn hoá, 1.2b = năng lực</strong>. Deck lặp lại gạch đầu dòng về literacy ở CẢ HAI slide mục tiêu (slide 5 và 12) — dấu hiệu cho thấy người ra đề coi đó là bản lề của module.</p>`],

      [6, '"Academic culture refers to the attitudes, values and ways of behaving shared by people who work or study in universities" (Brick, 2014, p.2)',
        `<p class="y-chinh">🎯 <strong>The definition slide — memorise this one verbatim.</strong> "Academic culture refers to the <strong>attitudes, values and ways of behaving</strong> that are <strong>shared</strong> by people who <strong>work or study in universities</strong>, for example, <strong>lecturers, researchers and students</strong>." (Brick, 2014, p.2)</p>
<table>
<tr><th>Part of the definition</th><th>What it rules in / out</th></tr>
<tr><td><strong>attitudes, values and ways of behaving</strong></td><td>Three layers, not one — an inner belief layer and an outer behaviour layer. Slide 7 draws exactly this</td></tr>
<tr><td><strong>shared</strong></td><td>It is collective. A single lecturer's preference is not academic culture; a norm everyone in the community holds is</td></tr>
<tr><td><strong>work or study in universities</strong></td><td>It is tied to the institution, which is why it can differ from workplace culture or school culture</td></tr>
<tr><td><strong>lecturers, researchers and students</strong></td><td>Students are <em>inside</em> the culture, not visitors to it. You are a junior member of a research community, not a customer</td></tr>
</table>
<ul>
<li><strong>The citation on the slide is itself a lesson.</strong> "(Brick, 2014, p.2)" with a page number is exactly what slide 19 will demand of you: when you use someone's words, name them. The slide is modelling the behaviour it teaches — notice that it never just asserts the definition.</li>
<li><strong>Why "attitudes" comes first.</strong> Attitude is the hardest part to copy and the easiest to spot. A student with the right attitude asks "where did this claim come from?"; one without asks "is this in the exam?".</li>
<li><strong>At FPTU this is not abstract.</strong> Academic culture is why your SWP391 report needs references, why the lecturer answers a question with another question, why you must defend your work at the demo rather than just submit it, and why "the team did it" is not an acceptable account of your own contribution.</li>
<li><strong>Cross-course link.</strong> CSI106 chapter 12 covers computer ethics and intellectual property from the technical/legal side; this is the same territory from the community side. Ethics says "you may not take it"; academic culture says "we are a community that traces ideas to their owners".</li>
</ul>
<p class="pitfall">⚠️ Classic MCQ trap: academic culture is NOT "the rules of a particular university" and NOT "the country's national culture". It is the <em>shared</em> attitudes, values and behaviours of people who work or study in universities — shared across institutions and across borders. A question that offers "the specific regulations of your faculty" is offering the wrong answer.</p>`,
        `<p class="y-chinh">🎯 <strong>Slide ĐỊNH NGHĨA — học thuộc nguyên văn câu này.</strong> "Academic culture refers to the <strong>attitudes, values and ways of behaving</strong> that are <strong>shared</strong> by people who <strong>work or study in universities</strong>, for example, <strong>lecturers, researchers and students</strong>." (Brick, 2014, p.2) — Văn hoá học thuật là những <strong>thái độ, giá trị và cách hành xử</strong> được <strong>CHIA SẺ CHUNG</strong> bởi những người làm việc hoặc học tập trong trường đại học: giảng viên, nhà nghiên cứu và sinh viên.</p>
<table>
<tr><th>Bộ phận của định nghĩa</th><th>Nó nhận vào / loại ra điều gì</th></tr>
<tr><td><strong>thái độ, giá trị, cách hành xử</strong></td><td>BA tầng chứ không phải một — một tầng niềm tin bên trong và một tầng hành vi bên ngoài. Slide 7 vẽ đúng điều này</td></tr>
<tr><td><strong>được chia sẻ chung</strong></td><td>Nó mang tính TẬP THỂ. Sở thích riêng của một giảng viên không phải văn hoá học thuật; một chuẩn mực cả cộng đồng cùng giữ thì mới là</td></tr>
<tr><td><strong>làm việc hoặc học trong đại học</strong></td><td>Nó gắn với thiết chế đại học, nên có thể khác văn hoá công sở hay văn hoá trường phổ thông</td></tr>
<tr><td><strong>giảng viên, nhà nghiên cứu và sinh viên</strong></td><td>Sinh viên nằm BÊN TRONG nền văn hoá đó, không phải khách ghé thăm. Bạn là thành viên tập sự của một cộng đồng nghiên cứu, không phải khách hàng</td></tr>
</table>
<ul>
<li><strong>Chính cái trích dẫn trên slide đã là một bài học.</strong> "(Brick, 2014, p.2)" có cả số trang — đúng thứ mà slide 19 sẽ đòi ở bạn: dùng chữ của ai thì gọi tên người đó. Slide đang LÀM MẪU chính hành vi nó dạy; để ý là nó không hề phán suông một định nghĩa.</li>
<li><strong>Vì sao "thái độ" đứng đầu.</strong> Thái độ là phần khó bắt chước nhất và dễ nhận ra nhất. Sinh viên có thái độ đúng sẽ hỏi "khẳng định này lấy ở đâu ra?"; người không có thì hỏi "cái này có thi không thầy?".</li>
<li><strong>Ở FPTU chuyện này không hề trừu tượng.</strong> Văn hoá học thuật là lý do báo cáo SWP391 của bạn phải có tài liệu tham khảo, lý do giảng viên trả lời câu hỏi bằng một câu hỏi khác, lý do bạn phải BẢO VỆ được sản phẩm lúc demo chứ không chỉ nộp, và lý do "nhóm em làm" không phải một lời khai hợp lệ về phần đóng góp của chính bạn.</li>
<li><strong>Nối sang môn khác.</strong> CSI106 chương 12 bàn đạo đức máy tính và sở hữu trí tuệ từ phía kỹ thuật/pháp lý; đây là cùng địa hạt đó nhìn từ phía cộng đồng. Đạo đức nói "anh không được lấy"; văn hoá học thuật nói "chúng ta là cộng đồng truy nguồn mọi ý tưởng về đúng chủ của nó".</li>
</ul>
<p class="pitfall">⚠️ Bẫy trắc nghiệm kinh điển: văn hoá học thuật KHÔNG PHẢI "nội quy của một trường đại học cụ thể" và KHÔNG PHẢI "văn hoá dân tộc". Nó là thái độ, giá trị và hành vi được <em>chia sẻ chung</em> giữa những người làm việc/học tập trong đại học — chung giữa các trường và xuyên biên giới. Phương án nào đưa ra "quy định riêng của khoa bạn" là phương án sai.</p>`],

      [7, 'Three nested circles — Core values, beliefs → Behaviors → Enviroment [sic]',
        `<p class="y-chinh">🎯 A diagram with no prose: three blue concentric circles labelled, from the inside out, <strong>Core values, beliefs → Behaviors → Enviroment</strong>. It is slide 6's definition turned into a picture of cause and effect.</p>
<table>
<tr><th>Ring</th><th>What it holds</th><th>Academic example</th><th>Visible to others?</th></tr>
<tr><td>Inner — <strong>Core values, beliefs</strong></td><td>What the community believes is true and right</td><td>"Knowledge is provisional and belongs to whoever produced it"</td><td>No — invisible</td></tr>
<tr><td>Middle — <strong>Behaviors</strong></td><td>What people actually do because of those beliefs</td><td>Citing sources, peer review, defending a claim with evidence</td><td>Yes — observable</td></tr>
<tr><td>Outer — <strong>Enviroment</strong></td><td>The structures those behaviours build and live in</td><td>Libraries, journals, referencing styles, integrity policies, Turnitin</td><td>Yes — physical/institutional</td></tr>
</table>
<ul>
<li><strong>Read it inside-out, that is the argument.</strong> Values cause behaviours; behaviours harden into an environment. Referencing systems exist because the community first believed that ideas have owners — not the other way round.</li>
<li><strong>The practical payoff of reading it that way.</strong> Rules learned as pure environment (outer ring) are forgettable and feel like bureaucracy. The same rule traced back to its value is stable knowledge. "Why APA?" is unanswerable at the outer ring; at the inner ring it is obvious.</li>
<li><strong>It also explains culture shock.</strong> A newcomer sees only the outer ring — the forms, the deadlines, the plagiarism checker — and mistakes the whole culture for paperwork. Mooc 1 spends its first module dragging you inward to the centre.</li>
<li><strong>FPTU version of the three rings.</strong> Inner: your work must be your own. Middle: you write your own code and cite your sources. Outer: the FLM submission page, the plagiarism check, the disciplinary regulations. Students who only ever meet the outer ring end up gaming it; students who understand the inner ring never need to.</li>
</ul>
<p class="pitfall">⚠️ The slide spells the outer ring <strong>"Enviroment"</strong> — a typo for <em>Environment</em> in the original University of Sydney deck. Quoted here as it appears; do not copy the spelling into your own work.</p>
<p class="meo">💡 Memory hook: <strong>BELIEVE → BEHAVE → BUILD</strong>. Three Bs, inside out. If an MCQ asks which layer "citing your sources" belongs to, it is the middle ring (a behaviour), while "the referencing style guide" is the outer ring (the environment).</p>`,
        `<p class="y-chinh">🎯 Một sơ đồ không có chữ giảng: ba vòng tròn xanh đồng tâm, từ trong ra ngoài là <strong>Core values, beliefs (giá trị &amp; niềm tin cốt lõi) → Behaviors (hành vi) → Enviroment (môi trường)</strong>. Đây chính là định nghĩa ở slide 6 được vẽ thành một chuỗi nhân quả.</p>
<table>
<tr><th>Vòng</th><th>Chứa cái gì</th><th>Ví dụ trong học thuật</th><th>Người ngoài nhìn thấy?</th></tr>
<tr><td>Trong cùng — <strong>Giá trị, niềm tin</strong></td><td>Cộng đồng tin điều gì là đúng và nên</td><td>"Tri thức là tạm thời và thuộc về người tạo ra nó"</td><td>Không — vô hình</td></tr>
<tr><td>Giữa — <strong>Hành vi</strong></td><td>Người ta THỰC SỰ làm gì vì tin như vậy</td><td>Trích dẫn nguồn, bình duyệt, bảo vệ luận điểm bằng bằng chứng</td><td>Có — quan sát được</td></tr>
<tr><td>Ngoài cùng — <strong>Môi trường</strong></td><td>Các thiết chế do hành vi đó dựng lên và sống trong đó</td><td>Thư viện, tạp chí khoa học, chuẩn trích dẫn, quy chế liêm chính, Turnitin</td><td>Có — vật chất/thiết chế</td></tr>
</table>
<ul>
<li><strong>Đọc từ TRONG ra, đó mới là lập luận.</strong> Giá trị sinh ra hành vi; hành vi đóng rắn lại thành môi trường. Hệ thống trích dẫn tồn tại VÌ cộng đồng tin trước rằng ý tưởng có chủ — chứ không phải ngược lại.</li>
<li><strong>Lợi ích thiết thực của cách đọc đó.</strong> Luật học thuộc như một mảnh môi trường (vòng ngoài) thì dễ quên và có mùi thủ tục hành chính. Cũng luật đó truy về giá trị của nó thì thành kiến thức bền. Hỏi "sao phải APA?" ở vòng ngoài là không trả lời được; ở vòng trong thì hiển nhiên.</li>
<li><strong>Nó cũng giải thích cú sốc văn hoá.</strong> Người mới chỉ thấy vòng ngoài — biểu mẫu, hạn nộp, máy quét đạo văn — rồi tưởng cả nền văn hoá là giấy tờ. Module 1 của Mooc 1 dành trọn thời lượng để kéo bạn vào tâm.</li>
<li><strong>Ba vòng phiên bản FPTU.</strong> Trong: bài của bạn phải do bạn làm. Giữa: bạn tự viết code và có dẫn nguồn. Ngoài: trang nộp bài FLM, phần mềm kiểm trùng, quy chế kỷ luật. Sinh viên chỉ gặp vòng ngoài sẽ tìm cách lách nó; sinh viên hiểu vòng trong thì chẳng cần lách bao giờ.</li>
</ul>
<p class="pitfall">⚠️ Slide viết vòng ngoài là <strong>"Enviroment"</strong> — LỖI CHÍNH TẢ của <em>Environment</em> trong chính deck gốc University of Sydney. Chép lại y nguyên ở đây để trung thực với slide; đừng mang lỗi đó vào bài của bạn.</p>
<p class="meo">💡 Mẹo nhớ: <strong>TIN → LÀM → DỰNG</strong>, từ trong ra ngoài. Đề hỏi "trích dẫn nguồn" thuộc tầng nào thì đó là vòng GIỮA (một hành vi), còn "cẩm nang chuẩn trích dẫn" là vòng NGOÀI (môi trường).</p>`],

      [8, 'Core values (1) — core mission, contingent knowledge, scholarly rigor, collective enterprise',
        `<p class="y-chinh">🎯 The first of two "Core values" slides. Four values, and each one is a sentence you can be asked to recognise: <strong>core mission = discovery and sharing of knowledge · the contingent nature of knowledge · the importance of scholarly rigor and being able to explain to others · knowledge is a collective enterprise, enhanced by different perspectives</strong>.</p>
<table>
<tr><th>Value on the slide</th><th>What it means in practice</th><th>A real situation at FPTU</th></tr>
<tr><td><strong>Core mission: discovery and sharing of knowledge</strong></td><td>A university exists to <em>find out</em> and <em>pass on</em>, not merely to certify</td><td>Your SWP391 report is expected to add something and be readable by the next team — not just to earn a mark and be deleted</td></tr>
<tr><td><strong>Contingent nature of knowledge</strong></td><td>What we "know" is provisional — true given current evidence, open to revision</td><td>A 2015 paper on mobile UX is not wrong, it is <em>dated</em>; you check whether anything newer overturned it before citing it</td></tr>
<tr><td><strong>Scholarly rigor + ability to explain to others</strong></td><td>Being right privately is not enough; you must show the working</td><td>At the capstone defence, "it works on my machine" fails; the panel wants the method, the data and the limitations</td></tr>
<tr><td><strong>Collective enterprise, many perspectives</strong></td><td>Understanding improves when different viewpoints are brought together</td><td>A group where everyone agrees instantly produces a worse report than one that argues and then reconciles</td></tr>
</table>
<ul>
<li><strong>"Contingent" is the word most likely to be tested and least likely to be understood.</strong> It does not mean "uncertain" in a sloppy way and it certainly does not mean "anyone's opinion is as good as anyone's". It means knowledge is <em>held on current evidence and revisable when better evidence arrives</em>. That is why academic writing hedges — "suggests", "indicates", "the data support" — instead of "proves".</li>
<li><strong>Rigor and explanation are one value, not two.</strong> The slide joins them with "and the need to be able to explain to others" on purpose: a result nobody else can follow cannot be checked, and an unchecked result does not enter the shared record.</li>
<li><strong>The collective-enterprise value is the justification for two rules you already meet.</strong> It is why the MOOC demands two discussion posts a week, and it is why referencing is compulsory: a collective enterprise only works if every contribution keeps its label.</li>
</ul>
<p class="meo">💡 Four-word hook for this slide: <strong>DISCOVER · PROVISIONAL · RIGOROUS · TOGETHER</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide "Core values" thứ nhất trong hai slide. Bốn giá trị, mỗi cái là một câu bạn có thể bị hỏi nhận diện: <strong>sứ mệnh cốt lõi = khám phá và chia sẻ tri thức · bản chất TẠM THỜI (contingent) của tri thức · tầm quan trọng của sự chặt chẽ học thuật và khả năng GIẢI THÍCH cho người khác · tri thức là một sự nghiệp TẬP THỂ, được nâng lên nhờ nhiều góc nhìn khác nhau</strong>.</p>
<table>
<tr><th>Giá trị trên slide</th><th>Nghĩa trong thực hành</th><th>Tình huống thật ở FPTU</th></tr>
<tr><td><strong>Sứ mệnh: khám phá &amp; chia sẻ tri thức</strong></td><td>Đại học tồn tại để <em>TÌM RA</em> và <em>TRUYỀN LẠI</em>, không phải chỉ để cấp bằng</td><td>Báo cáo SWP391 được kỳ vọng có đóng góp và nhóm sau đọc hiểu được — không phải chỉ lấy điểm rồi xoá</td></tr>
<tr><td><strong>Bản chất tạm thời của tri thức</strong></td><td>Cái ta "biết" là tạm thời — đúng với bằng chứng hiện có, sẵn sàng bị sửa</td><td>Một bài 2015 về UX di động không SAI, nó CŨ; trước khi trích bạn phải xem có gì mới lật lại nó chưa</td></tr>
<tr><td><strong>Chặt chẽ + giải thích được cho người khác</strong></td><td>Đúng một mình chưa đủ; phải trình ra được đường đi nước bước</td><td>Ở buổi bảo vệ đồ án, "máy em chạy được" là trượt; hội đồng hỏi phương pháp, dữ liệu và giới hạn</td></tr>
<tr><td><strong>Sự nghiệp tập thể, nhiều góc nhìn</strong></td><td>Hiểu biết tốt lên khi các góc nhìn khác nhau được đặt cạnh nhau</td><td>Nhóm mà ai cũng gật ngay cho ra báo cáo dở hơn nhóm cãi nhau rồi mới chốt</td></tr>
</table>
<ul>
<li><strong>"Contingent" là từ dễ bị hỏi nhất và dễ hiểu sai nhất.</strong> Nó KHÔNG có nghĩa "mơ hồ", và càng không có nghĩa "ý ai cũng như ý ai". Nó nghĩa là tri thức <em>được giữ dựa trên bằng chứng hiện có và sẽ được sửa khi có bằng chứng tốt hơn</em>. Đó là lý do văn phong học thuật hay rào đón — "suggests", "indicates", "dữ liệu ủng hộ" — thay vì "chứng minh dứt khoát".</li>
<li><strong>Chặt chẽ và giải thích là MỘT giá trị, không phải hai.</strong> Slide cố tình nối bằng "and the need to be able to explain to others": một kết quả không ai theo được thì không ai kiểm được, mà đã không kiểm được thì không vào được kho tri thức chung.</li>
<li><strong>Giá trị "tập thể" là lý do biện minh cho hai luật bạn đã gặp.</strong> Nó là lý do MOOC bắt đăng 2 bài diễn đàn mỗi tuần, và là lý do trích dẫn là bắt buộc: một sự nghiệp tập thể chỉ chạy được nếu mỗi đóng góp vẫn còn nguyên cái nhãn tên.</li>
</ul>
<p class="meo">💡 Mẹo bốn từ cho slide này: <strong>KHÁM PHÁ · TẠM THỜI · CHẶT CHẼ · CÙNG NHAU</strong>.</p>`],

      [9, 'Core values (2) — cite where ideas came from, independent learning, critical thinking, assessment',
        `<p class="y-chinh">🎯 The second "Core values" slide moves from the community's beliefs to <strong>what is expected of you as a student</strong>: say where ideas came from · learn independently (lecturers are <em>facilitators</em>) · think critically · in assessment, speak from your own point of view.</p>
<table>
<tr><th>Expectation</th><th>The slide's words</th><th>What failing it looks like</th></tr>
<tr><td><strong>Attribution</strong></td><td>"It's always very important to talk about where those ideas came from"</td><td>A paragraph of solid analysis with no citation — indistinguishable from plagiarism</td></tr>
<tr><td><strong>Independent learning</strong></td><td>"Students are expected to work on their own, to research → Lecturers are facilitators"</td><td>Waiting to be told the answer; asking "will this be on the exam" instead of reading</td></tr>
<tr><td><strong>Critical thinking</strong></td><td>"Can we improve it? Can we discover new knowledge?"</td><td>Summarising three sources without ever saying which is stronger and why</td></tr>
<tr><td><strong>Assessment</strong></td><td>"Talk about it from your own point of view and express your thoughts on what the question is asking"</td><td>Reciting the textbook back; answering the question you wish had been asked</td></tr>
</table>
<ul>
<li><strong>"Lecturers are facilitators" is the single biggest adjustment from high school.</strong> The lecturer's job is to point at the territory, set the problem and judge the result — not to transfer a finished body of notes into your notebook. The reading list is not decoration.</li>
<li><strong>Critical thinking here has a precise, examinable shape.</strong> The slide phrases it as two questions: <em>can we improve it?</em> and <em>can we discover new knowledge?</em> That is evaluation plus creation. Merely understanding a source is not critical thinking; judging it and building past it is.</li>
<li><strong>The assessment bullet is the practical instruction.</strong> Notice it says two things: give <em>your own</em> view, and address <em>what the question is asking</em>. Most lost marks come from failing the second — a beautiful essay answering a different question scores badly.</li>
<li><strong>Apply it to a real FPTU task.</strong> For an SWP391 literature section: do not list five tools. Say which two matter for your problem, why the other three do not, cite each claim, and state what your project adds. That single paragraph exercises all four expectations at once.</li>
<li><strong>The attribution bullet is where the integrity block (slides 16–22) begins.</strong> Read it as the value; read slides 19–20 as what happens when you ignore it.</li>
</ul>
<p class="pitfall">⚠️ Do not confuse <em>independent learning</em> with <em>working alone and never asking</em>. Independent learning means you take responsibility for finding out — using the library, the lecturer's office hours and your peers. Refusing to ask for help is not independence; it is just slower.</p>`,
        `<p class="y-chinh">🎯 Slide "Core values" thứ hai chuyển từ niềm tin của cộng đồng sang <strong>những gì được kỳ vọng ở BẠN với tư cách sinh viên</strong>: nói rõ ý tưởng từ đâu ra · tự học (giảng viên là <em>người dẫn dắt</em>) · tư duy phản biện · khi làm bài đánh giá thì nói bằng góc nhìn của chính mình.</p>
<table>
<tr><th>Kỳ vọng</th><th>Chữ của slide</th><th>Trượt kỳ vọng đó trông như thế nào</th></tr>
<tr><td><strong>Ghi công nguồn</strong></td><td>"Luôn rất quan trọng khi nói ra những ý tưởng đó đến từ đâu"</td><td>Một đoạn phân tích chắc tay mà không có trích dẫn nào — không phân biệt được với đạo văn</td></tr>
<tr><td><strong>Tự học</strong></td><td>"Sinh viên được kỳ vọng tự làm việc, tự nghiên cứu → Giảng viên là người dẫn dắt"</td><td>Ngồi chờ được cho đáp án; hỏi "cái này có thi không" thay vì đi đọc</td></tr>
<tr><td><strong>Tư duy phản biện</strong></td><td>"Có cải tiến được không? Có khám phá được tri thức mới không?"</td><td>Tóm tắt ba tài liệu mà không hề nói cái nào mạnh hơn và vì sao</td></tr>
<tr><td><strong>Bài đánh giá</strong></td><td>"Phải nói được từ góc nhìn của chính bạn và bày tỏ suy nghĩ về việc đề đang hỏi gì"</td><td>Chép lại giáo trình; trả lời cái đề mà bạn ƯỚC nó hỏi</td></tr>
</table>
<ul>
<li><strong>"Giảng viên là facilitator" là cú điều chỉnh lớn nhất so với phổ thông.</strong> Việc của giảng viên là chỉ ra địa hình, đặt bài toán và phán xét kết quả — không phải chuyển một tập vở hoàn chỉnh sang vở của bạn. Danh mục tài liệu tham khảo không phải để trang trí.</li>
<li><strong>Tư duy phản biện ở đây có hình dạng rất cụ thể, ra đề được.</strong> Slide diễn đạt nó thành hai câu hỏi: <em>cải tiến được không?</em> và <em>khám phá cái mới được không?</em> Tức là ĐÁNH GIÁ cộng SÁNG TẠO. Chỉ hiểu một tài liệu thì chưa phải phản biện; phán xét nó rồi đi xa hơn nó mới là.</li>
<li><strong>Gạch đầu dòng về assessment mới là chỉ dẫn thực hành.</strong> Để ý nó nói HAI điều: nêu quan điểm <em>của chính bạn</em>, và bám <em>đúng cái đề đang hỏi</em>. Phần lớn điểm mất đi là vì trượt vế thứ hai — một bài viết đẹp trả lời một câu hỏi khác thì vẫn điểm thấp.</li>
<li><strong>Đem áp vào một việc thật ở FPTU.</strong> Với phần khảo sát tài liệu của SWP391: đừng liệt kê năm công cụ. Hãy nói hai cái nào có liên quan tới bài toán của bạn, vì sao ba cái kia không, mỗi khẳng định có dẫn nguồn, và dự án của bạn thêm được gì. Một đoạn văn đó luyện cùng lúc cả bốn kỳ vọng.</li>
<li><strong>Gạch đầu dòng ghi công nguồn chính là chỗ khối liêm chính (slide 16–22) bắt đầu.</strong> Đọc nó như GIÁ TRỊ; đọc slide 19–20 như hậu quả khi phớt lờ giá trị đó.</li>
</ul>
<p class="pitfall">⚠️ Đừng nhầm <em>tự học</em> với <em>làm một mình và không bao giờ hỏi</em>. Tự học nghĩa là bạn CHỊU TRÁCH NHIỆM đi tìm ra — dùng thư viện, giờ tiếp sinh viên của giảng viên, và bạn cùng lớp. Không chịu hỏi không phải độc lập; nó chỉ là chậm hơn.</p>`],

      [10, 'Academic Culture infographic (1) — existing knowledge & skills entering the ten academic values',
        `<p class="y-chinh">🎯 An infographic, no body text: a student stands at the mouth of a corridor labelled <strong>Academic Culture</strong>. Behind him, a dark circle reads <strong>EXISTING KNOWLEDGE &amp; SKILLS</strong>; ahead, an orange circle reads <strong>ACADEMIC SKILLS FOR UNIVERSITY SUCCESS SPECIALIZATION</strong>, and beyond it ten lines fan out under the heading <strong>ACADEMIC VALUES</strong>.</p>
<table>
<tr><th>#</th><th>The ten academic values on the lines</th><th>Where this specialization teaches it</th></tr>
<tr><td>1</td><td>Research &amp; Inquiry</td><td>Mooc 1 — identifying an information need</td></tr>
<tr><td>2</td><td>Research Skills</td><td>Mooc 1–2 — search strategies, evaluating sources</td></tr>
<tr><td>3</td><td>Lifelong Learning</td><td>The whole specialization; the reflection habit of slide 2</td></tr>
<tr><td>4</td><td>Intellectual Autonomy</td><td>"Independent learning" from slide 9</td></tr>
<tr><td>5</td><td>Problem Solving</td><td>The running example essay question</td></tr>
<tr><td>6</td><td>Critical Thinking</td><td>Slide 9; evaluating sources in Mooc 2</td></tr>
<tr><td>7</td><td>Creativity &amp; Innovation</td><td>"Can we discover new knowledge?"</td></tr>
<tr><td>8</td><td>Information &amp; Digital Literacy</td><td>Slides 12–14 — the core of Mooc 1</td></tr>
<tr><td>9</td><td>Ethical, Social &amp; Professional Understanding</td><td>Slides 16–22 — academic integrity</td></tr>
<tr><td>10</td><td>Communication</td><td>Discussion posts, the final assignment, referencing</td></tr>
</table>
<ul>
<li><strong>Read the direction of travel.</strong> You do not arrive empty. You arrive with <em>existing knowledge and skills</em>, and the specialization is the passage that converts them into the ten values the academic community recognises. Nothing you already know is discarded; it is re-framed.</li>
<li><strong>The ten are values, not modules.</strong> They are not ten separate things to learn one by one — they overlap heavily. Information &amp; Digital Literacy (8) is how you exercise Research Skills (2), and both are useless without Critical Thinking (6).</li>
<li><strong>Two of the ten are the whole of SSL101c Mooc 1.</strong> <em>Information &amp; Digital Literacy</em> and <em>Ethical, Social &amp; Professional Understanding</em> — the title of Mooc 1 names the first, and slides 16–22 deliver the second. If you remember only two of the ten for the exam, remember those two.</li>
<li><strong>FPTU already grades most of this list, under other names.</strong> "Intellectual autonomy" is what the self-study hours in your syllabus assume; "communication" is the defence presentation; "problem solving" is the capstone. The infographic is a map of the graduate attributes your programme is built to produce.</li>
</ul>
<p class="meo">💡 If you must memorise the ten, group them: <strong>3 about finding out</strong> (Research &amp; Inquiry, Research Skills, Information &amp; Digital Literacy) · <strong>3 about thinking</strong> (Critical Thinking, Problem Solving, Creativity &amp; Innovation) · <strong>4 about being a member of the community</strong> (Intellectual Autonomy, Lifelong Learning, Ethical/Social/Professional Understanding, Communication).</p>`,
        `<p class="y-chinh">🎯 Một infographic, không có chữ giảng: một sinh viên đứng ở cửa một hành lang mang tên <strong>Academic Culture</strong>. Sau lưng cậu ta là vòng tròn đen <strong>EXISTING KNOWLEDGE &amp; SKILLS</strong> (kiến thức &amp; kỹ năng sẵn có); phía trước là vòng tròn cam <strong>ACADEMIC SKILLS FOR UNIVERSITY SUCCESS SPECIALIZATION</strong>, và xa hơn là mười đường toả ra dưới tiêu đề <strong>ACADEMIC VALUES</strong>.</p>
<table>
<tr><th>#</th><th>Mười giá trị học thuật trên các đường</th><th>Specialization dạy nó ở đâu</th></tr>
<tr><td>1</td><td>Research &amp; Inquiry — Nghiên cứu &amp; truy vấn</td><td>Mooc 1 — xác định nhu cầu thông tin</td></tr>
<tr><td>2</td><td>Research Skills — Kỹ năng nghiên cứu</td><td>Mooc 1–2 — chiến lược tìm kiếm, đánh giá nguồn</td></tr>
<tr><td>3</td><td>Lifelong Learning — Học tập suốt đời</td><td>Cả specialization; thói quen phản tư ở slide 2</td></tr>
<tr><td>4</td><td>Intellectual Autonomy — Tự chủ trí tuệ</td><td>Chính là "independent learning" ở slide 9</td></tr>
<tr><td>5</td><td>Problem Solving — Giải quyết vấn đề</td><td>Bài luận mẫu xuyên suốt</td></tr>
<tr><td>6</td><td>Critical Thinking — Tư duy phản biện</td><td>Slide 9; đánh giá nguồn tin ở Mooc 2</td></tr>
<tr><td>7</td><td>Creativity &amp; Innovation — Sáng tạo &amp; đổi mới</td><td>"Có khám phá được tri thức mới không?"</td></tr>
<tr><td>8</td><td>Information &amp; Digital Literacy — Năng lực thông tin &amp; số</td><td>Slide 12–14 — lõi của Mooc 1</td></tr>
<tr><td>9</td><td>Ethical, Social &amp; Professional Understanding</td><td>Slide 16–22 — liêm chính học thuật</td></tr>
<tr><td>10</td><td>Communication — Giao tiếp</td><td>Bài đăng diễn đàn, bài cuối khoá, trích dẫn</td></tr>
</table>
<ul>
<li><strong>Đọc theo CHIỀU đi.</strong> Bạn không đến tay trắng. Bạn đến với <em>kiến thức và kỹ năng sẵn có</em>, và specialization là cái hành lang biến chúng thành mười giá trị mà cộng đồng học thuật công nhận. Không có gì bạn đã biết bị vứt đi; nó được đặt lại khung.</li>
<li><strong>Mười cái này là GIÁ TRỊ, không phải mười module.</strong> Chúng không phải mười thứ học lần lượt — chúng chồng lấn rất nhiều. Năng lực thông tin &amp; số (8) là CÁCH bạn thực thi kỹ năng nghiên cứu (2), và cả hai vô dụng nếu thiếu tư duy phản biện (6).</li>
<li><strong>Hai trong mười cái chính là toàn bộ Mooc 1 của SSL101c.</strong> <em>Information &amp; Digital Literacy</em> và <em>Ethical, Social &amp; Professional Understanding</em> — nhan đề Mooc 1 gọi tên cái thứ nhất, slide 16–22 giao cái thứ hai. Nếu chỉ nhớ nổi hai trong mười để đi thi, hãy nhớ đúng hai cái đó.</li>
<li><strong>FPTU vốn đã chấm gần hết danh sách này, dưới tên khác.</strong> "Tự chủ trí tuệ" là thứ mà số giờ tự học trong syllabus mặc định bạn có; "giao tiếp" là buổi bảo vệ; "giải quyết vấn đề" là đồ án tốt nghiệp. Infographic này là bản đồ các phẩm chất đầu ra mà chương trình của bạn được thiết kế để tạo ra.</li>
</ul>
<p class="meo">💡 Phải thuộc cả mười thì hãy gom nhóm: <strong>3 cái về TÌM RA</strong> (Research &amp; Inquiry, Research Skills, Information &amp; Digital Literacy) · <strong>3 cái về NGHĨ</strong> (Critical Thinking, Problem Solving, Creativity &amp; Innovation) · <strong>4 cái về LÀM THÀNH VIÊN cộng đồng</strong> (Intellectual Autonomy, Lifelong Learning, Ethical/Social/Professional Understanding, Communication).</p>`],

      [11, 'Academic Culture infographic (2) — the same corridor with the graduate at the far end',
        `<p class="y-chinh">🎯 The same infographic, zoomed out to show the <strong>whole journey</strong>. On the left the student now has <strong>"???"</strong> floating over his head; on the right, at the far end of the corridor, stands the same person in a <strong>graduation gown and mortarboard</strong>, smiling. The ten academic values run between them.</p>
<ul>
<li><strong>The two additions carry the entire message.</strong> The "???" is the newcomer's state: existing knowledge and skills, but no idea what this place expects. The graduate is the output. Everything in the middle — the ten values, this specialization, SSL101c itself — is the mechanism that connects the two.</li>
<li><strong>What actually changes along the corridor is not the person's knowledge but their <em>practices</em>.</strong> The graduate is not merely someone who knows more; they are someone who can find information, judge it, use it ethically and explain the result. That is why a skills subject sits in your first term rather than a content subject.</li>
<li><strong>Read the "???" honestly, because it is you.</strong> First-term confusion at FPTU — not knowing how much reading is enough, whether you may quote a blog, how to start a report — is the normal, expected state. The corridor is designed for people who start confused.</li>
<li><strong>The corridor has a length, and at FPTU it has a deadline.</strong> Five MOOCs, certificates for all five, then one 60-minute exam. Plot the corridor on a calendar in week 1, and finishing early is also what earns the <strong>+1 bonus point</strong>.</li>
<li><strong>Honest note on this slide:</strong> it is a picture, not new content. The values listed are identical to slide 10; nothing is added except the before/after framing. Do not hunt for an eleventh value here.</li>
</ul>
<p class="meo">💡 One-sentence version of the whole culture block (slides 5–11): <strong>university turns existing knowledge into academic practice by teaching ten shared values, of which information literacy and integrity are the two this MOOC delivers.</strong></p>`,
        `<p class="y-chinh">🎯 Vẫn infographic đó, thu xa ra để thấy <strong>TRỌN hành trình</strong>. Bên trái, cậu sinh viên giờ có thêm <strong>"???"</strong> lơ lửng trên đầu; bên phải, ở cuối hành lang, chính cậu ta đứng trong <strong>áo cử nhân và mũ tốt nghiệp</strong>, đang cười. Mười giá trị học thuật chạy giữa hai đầu đó.</p>
<ul>
<li><strong>Hai chi tiết thêm vào mang trọn thông điệp.</strong> Dấu "???" là trạng thái người mới: có kiến thức và kỹ năng sẵn, nhưng không biết chốn này kỳ vọng gì ở mình. Người tốt nghiệp là đầu ra. Mọi thứ ở giữa — mười giá trị, cái specialization này, và chính môn SSL101c — là cơ chế nối hai đầu ấy.</li>
<li><strong>Thứ thật sự đổi dọc hành lang không phải LƯỢNG kiến thức mà là <em>CÁCH LÀM</em>.</strong> Người tốt nghiệp không đơn giản là người biết nhiều hơn; đó là người TÌM được thông tin, PHÁN XÉT được nó, DÙNG nó có đạo đức và GIẢI THÍCH được kết quả. Đó là lý do một môn kỹ năng được xếp vào kỳ đầu chứ không phải một môn nội dung.</li>
<li><strong>Hãy đọc dấu "???" một cách thành thật, vì đó là bạn.</strong> Bối rối kỳ đầu ở FPTU — không biết đọc bao nhiêu là đủ, có được trích một bài blog không, mở đầu báo cáo thế nào — là trạng thái BÌNH THƯỜNG và được dự liệu. Cái hành lang này được thiết kế cho người bắt đầu trong bối rối.</li>
<li><strong>Hành lang có độ dài, và ở FPTU nó có hạn chót.</strong> Năm MOOC, chứng chỉ đủ cả năm, rồi một bài thi 60 phút. Hãy vẽ cái hành lang đó lên lịch ngay tuần 1; xong sớm cũng chính là thứ mang về <strong>1 điểm thưởng</strong>.</li>
<li><strong>Ghi chú thành thật về slide này:</strong> nó là một BỨC TRANH, không phải nội dung mới. Danh sách giá trị y hệt slide 10; không thêm gì ngoài khung "trước/sau". Đừng đi tìm giá trị thứ mười một ở đây.</li>
</ul>
<p class="meo">💡 Cả khối văn hoá (slide 5–11) gói trong một câu: <strong>đại học biến kiến thức sẵn có thành thực hành học thuật bằng cách dạy mười giá trị chung, trong đó năng lực thông tin và liêm chính là hai giá trị mà MOOC này giao tận tay.</strong></p>`],

      [12, '1.2b Introduction to Information & Digital Literacy — objectives',
        `<p class="y-chinh">🎯 Objective slide for lesson <strong>1.2b</strong>, with two bullets: <strong>understand the definition of information &amp; digital literacy in academic culture</strong>, and <strong>understand the core values &amp; expectations of academic culture</strong>. The title of the whole MOOC is in this slide's title — this is the hinge of Mooc 1.</p>
<table>
<tr><th></th><th>Information literacy</th><th>Digital literacy</th></tr>
<tr><td><strong>About</strong></td><td>The <em>information</em> itself: finding it, judging it, using it</td><td>The <em>digital tools and environments</em> the information lives in</td></tr>
<tr><td><strong>Typical skill</strong></td><td>Deciding whether a 2013 survey is still good evidence</td><td>Using a database's filters, managing files, spotting a phishing page</td></tr>
<tr><td><strong>Would survive without computers?</strong></td><td>Yes — it worked in a paper library too</td><td>No — it is defined by the digital medium</td></tr>
<tr><td><strong>Overlap</strong></td><td colspan="2">Huge, and growing. Almost all academic information is now digital, so the two are taught together — but they are <strong>not synonyms</strong></td></tr>
</table>
<ul>
<li><strong>This is the distinction most likely to appear as a trick MCQ.</strong> Being good with technology is not information literacy. A student who can drive five apps fluently and still cannot tell a peer-reviewed article from a content-farm page is digitally literate and information-illiterate at the same time.</li>
<li><strong>Why the phrase "in academic culture" is in the bullet.</strong> These literacies are being defined <em>for academic purposes</em>, not generally. Evaluating a source for a university essay has a stricter bar than evaluating one for a personal decision.</li>
<li><strong>The second bullet is a deliberate repeat of slide 5.</strong> The deck is telling you that values and literacy are one lesson: you evaluate and cite information the way you do <em>because</em> of the values on slides 8–9.</li>
<li><strong>FPTU application.</strong> Your programme assumes digital literacy (you will pick up the LMS, Git, an IDE quickly). What it teaches more slowly, and what actually separates reports, is information literacy: whether the sources behind your claims hold up.</li>
</ul>
<p class="meo">💡 One-line separator: <strong>digital literacy = can you operate it · information literacy = should you believe it.</strong></p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của bài <strong>1.2b</strong>, hai gạch đầu dòng: <strong>hiểu định nghĩa năng lực thông tin &amp; năng lực số trong văn hoá học thuật</strong>, và <strong>hiểu các giá trị cốt lõi &amp; kỳ vọng của văn hoá học thuật</strong>. Nhan đề của cả MOOC nằm trong tiêu đề slide này — đây là bản lề của Mooc 1.</p>
<table>
<tr><th></th><th>Information literacy (năng lực thông tin)</th><th>Digital literacy (năng lực số)</th></tr>
<tr><td><strong>Nói về</strong></td><td>Chính THÔNG TIN: tìm, phán xét, sử dụng</td><td>CÔNG CỤ và MÔI TRƯỜNG SỐ nơi thông tin đang nằm</td></tr>
<tr><td><strong>Kỹ năng tiêu biểu</strong></td><td>Quyết định xem một khảo sát năm 2013 còn là bằng chứng tốt không</td><td>Dùng bộ lọc của một cơ sở dữ liệu, quản lý tệp, nhận ra trang lừa đảo</td></tr>
<tr><td><strong>Không có máy tính có tồn tại không?</strong></td><td>CÓ — thư viện giấy vẫn cần nó</td><td>KHÔNG — nó được định nghĩa bởi chính môi trường số</td></tr>
<tr><td><strong>Chồng lấn</strong></td><td colspan="2">Rất lớn và đang lớn thêm. Gần như mọi thông tin học thuật giờ đều là số, nên hai thứ được dạy chung — nhưng chúng <strong>KHÔNG đồng nghĩa</strong></td></tr>
</table>
<ul>
<li><strong>Đây là chỗ phân biệt dễ thành câu bẫy nhất trong đề trắc nghiệm.</strong> Giỏi công nghệ KHÔNG PHẢI là năng lực thông tin. Một sinh viên xài năm cái app trơn tru mà vẫn không phân biệt nổi bài báo bình duyệt với một trang nội dung rác thì đang đồng thời có năng lực SỐ và mù năng lực THÔNG TIN.</li>
<li><strong>Vì sao có cụm "in academic culture" trong gạch đầu dòng.</strong> Hai năng lực này đang được định nghĩa <em>cho mục đích học thuật</em>, không phải chung chung. Đánh giá một nguồn cho bài luận đại học có tiêu chuẩn khắt khe hơn đánh giá cho một quyết định cá nhân.</li>
<li><strong>Gạch đầu dòng thứ hai là cú LẶP CÓ CHỦ Ý so với slide 5.</strong> Deck đang nói với bạn rằng giá trị và năng lực là MỘT bài: bạn đánh giá và trích dẫn thông tin theo cách đó <em>VÌ</em> những giá trị ở slide 8–9.</li>
<li><strong>Áp dụng ở FPTU.</strong> Chương trình mặc định bạn có năng lực số (LMS, Git, IDE bạn sẽ bắt kịp rất nhanh). Thứ nó dạy chậm hơn, và cũng là thứ thật sự phân loại các bài báo cáo, là năng lực thông tin: các nguồn đứng sau khẳng định của bạn có đứng vững không.</li>
</ul>
<p class="meo">💡 Câu phân biệt một dòng: <strong>năng lực SỐ = bạn có dùng được nó không · năng lực THÔNG TIN = bạn có nên tin nó không.</strong></p>`],

      [13, 'Information Literacy — the seven-step list (Adapted from: Bundy, 2004)',
        `<p class="y-chinh">🎯 <strong>The list to memorise for the exam.</strong> Information literacy is the ability to: <strong>identify an information need · access information · search for information · evaluate information · select information · use information · store information</strong> (Adapted from: Bundy, 2004).</p>
<table>
<tr><th>#</th><th>Step</th><th>What it involves</th><th>Doing it for an SWP391 report</th></tr>
<tr><td>1</td><td><strong>Identify an information need</strong></td><td>Turn a vague task into a precise question; know what you do not know</td><td>Not "find stuff about chat apps" but "what latency do users tolerate in a mobile chat UI?"</td></tr>
<tr><td>2</td><td><strong>Access information</strong></td><td>Know what you are entitled to reach and how to get in</td><td>Log in to the FPTU library / IEEE / ACM instead of stopping at a paywall</td></tr>
<tr><td>3</td><td><strong>Search for information</strong></td><td>Build a strategy: keywords, synonyms, Boolean operators, filters</td><td>("mobile chat" OR messaging) AND latency AND "user experience", 2019–2026</td></tr>
<tr><td>4</td><td><strong>Evaluate information</strong></td><td>Judge authority, accuracy, currency, purpose, evidence</td><td>Peer-reviewed study vs a vendor's blog post promoting its own SDK</td></tr>
<tr><td>5</td><td><strong>Select information</strong></td><td>Choose the few that answer <em>your</em> question and discard the rest</td><td>From 40 hits keep 6; being unable to discard is its own failure</td></tr>
<tr><td>6</td><td><strong>Use information</strong></td><td>Integrate, paraphrase, argue with it — and <strong>cite it</strong></td><td>Quote with a reference; never paste a paragraph unmarked</td></tr>
<tr><td>7</td><td><strong>Store information</strong></td><td>Keep it findable, with its metadata, for reuse</td><td>Zotero/Mendeley from day one; a folder of unnamed PDFs is not storage</td></tr>
</table>
<ul>
<li><strong>Note the order, and note that step 1 is not searching.</strong> Most students start at step 3 and wonder why the results are useless. An unclear need produces an unclear query produces an unusable pile. Mooc 1's later modules build directly on steps 1 and 3.</li>
<li><strong>Steps 4 and 5 are different and both are examinable.</strong> <em>Evaluate</em> asks "is this any good?" — a property of the source. <em>Select</em> asks "do I need this?" — a relation between the source and your question. A source can be excellent and still be the wrong one.</li>
<li><strong>Step 6 is where information literacy and academic integrity meet.</strong> "Use information" in an academic context always includes attribution. Slides 19–20 are the consequences of doing step 6 badly.</li>
<li><strong>Step 7 is the one everyone skips and later regrets.</strong> Storing means keeping the source <em>with</em> its details — author, year, title, journal, page, URL, date accessed — because at 11pm before the deadline you will need the page number and you will not find it again.</li>
</ul>
<p class="meo">💡 Mnemonic in order: <strong>I A S E S U S</strong> — "<em>I Always Search, Evaluate, Select, Use, Store</em>". Identify · Access · Search · Evaluate · Select · Use · Store.</p>`,
        `<p class="y-chinh">🎯 <strong>Danh sách phải thuộc để đi thi.</strong> Năng lực thông tin là khả năng: <strong>xác định nhu cầu thông tin · tiếp cận thông tin · tìm kiếm thông tin · đánh giá thông tin · chọn lọc thông tin · sử dụng thông tin · lưu trữ thông tin</strong> (Adapted from: Bundy, 2004).</p>
<table>
<tr><th>#</th><th>Bước</th><th>Gồm những gì</th><th>Làm cho báo cáo SWP391</th></tr>
<tr><td>1</td><td><strong>Xác định nhu cầu thông tin</strong></td><td>Biến một nhiệm vụ mơ hồ thành câu hỏi chính xác; biết mình chưa biết gì</td><td>Không phải "tìm cái gì đó về app chat" mà "người dùng chịu được độ trễ bao nhiêu trên giao diện chat di động?"</td></tr>
<tr><td>2</td><td><strong>Tiếp cận thông tin</strong></td><td>Biết mình có quyền vào đâu và vào bằng cách nào</td><td>Đăng nhập thư viện FPTU / IEEE / ACM thay vì dừng lại trước một bức tường trả phí</td></tr>
<tr><td>3</td><td><strong>Tìm kiếm thông tin</strong></td><td>Dựng chiến lược: từ khoá, từ đồng nghĩa, toán tử Boolean, bộ lọc</td><td>("mobile chat" OR messaging) AND latency AND "user experience", lọc 2019–2026</td></tr>
<tr><td>4</td><td><strong>Đánh giá thông tin</strong></td><td>Xét thẩm quyền, độ chính xác, tính cập nhật, mục đích, bằng chứng</td><td>Một nghiên cứu bình duyệt so với bài blog của hãng đang quảng cáo SDK của chính họ</td></tr>
<tr><td>5</td><td><strong>Chọn lọc thông tin</strong></td><td>Giữ vài cái trả lời đúng câu hỏi <em>của bạn</em>, bỏ phần còn lại</td><td>Từ 40 kết quả giữ 6; không bỏ được cũng là một dạng thất bại</td></tr>
<tr><td>6</td><td><strong>Sử dụng thông tin</strong></td><td>Tích hợp, diễn đạt lại, tranh luận với nó — và <strong>DẪN NGUỒN</strong></td><td>Trích thì kèm tài liệu tham khảo; không bao giờ dán một đoạn mà không đánh dấu</td></tr>
<tr><td>7</td><td><strong>Lưu trữ thông tin</strong></td><td>Giữ sao cho tìm lại được, kèm siêu dữ liệu, để dùng lại</td><td>Dùng Zotero/Mendeley ngay từ ngày đầu; một thư mục PDF không tên không phải là lưu trữ</td></tr>
</table>
<ul>
<li><strong>Để ý THỨ TỰ, và để ý bước 1 không phải là tìm kiếm.</strong> Phần lớn sinh viên nhảy thẳng vào bước 3 rồi thắc mắc sao kết quả vô dụng. Nhu cầu mờ sinh ra truy vấn mờ sinh ra một đống không xài được. Các module sau của Mooc 1 xây thẳng trên bước 1 và bước 3.</li>
<li><strong>Bước 4 và 5 KHÁC nhau và cả hai đều ra đề được.</strong> <em>Đánh giá</em> hỏi "cái này có tốt không?" — thuộc tính của NGUỒN. <em>Chọn lọc</em> hỏi "tôi có cần cái này không?" — quan hệ giữa nguồn và CÂU HỎI của bạn. Một nguồn có thể xuất sắc mà vẫn là nguồn sai.</li>
<li><strong>Bước 6 là chỗ năng lực thông tin gặp liêm chính học thuật.</strong> "Sử dụng thông tin" trong bối cảnh học thuật LUÔN bao gồm ghi công nguồn. Slide 19–20 chính là hậu quả của việc làm ẩu bước 6.</li>
<li><strong>Bước 7 là bước ai cũng bỏ qua rồi ai cũng hối.</strong> Lưu trữ nghĩa là giữ nguồn KÈM thông tin của nó — tác giả, năm, tên bài, tạp chí, số trang, URL, ngày truy cập — vì 11 giờ đêm trước hạn nộp bạn sẽ cần đúng cái số trang đó và sẽ không tìm lại được.</li>
</ul>
<p class="meo">💡 Mẹo nhớ đúng thứ tự: <strong>XÁC – TIẾP – TÌM – ĐÁNH – CHỌN – DÙNG – LƯU</strong> (Xác định · Tiếp cận · Tìm kiếm · Đánh giá · Chọn lọc · Sử dụng · Lưu trữ). Bảy bước, bắt đầu bằng "xác", kết bằng "lưu".</p>`],

      [14, 'Information Literacy — the same seven-step list repeated',
        `<p class="y-chinh">🎯 <strong>This slide is an exact duplicate of slide 13</strong> — same title, same seven bullets, same citation "(Adapted from: Bundy, 2004)". Reported honestly: the repetition is in the original deck, not an error in this lesson, and there is no eighth step hiding here.</p>
<ul>
<li><strong>Do not go looking for a difference.</strong> Both slides read: identify an information need · access · search · evaluate · select · use · store. If you find yourself trying to spot what changed, stop — nothing did.</li>
<li><strong>Use the repeat as free revision.</strong> Before reading on, close your eyes and list the seven in order. Anything you cannot produce is what you will lose a mark on, because a "which of the following is NOT a component of information literacy" question is the most predictable item this MOOC can generate.</li>
<li><strong>How such a question is usually built.</strong> The wrong option is a plausible neighbour that is not on Bundy's list — for example "<em>publish</em> information", "<em>memorise</em> information", "<em>purchase</em> information" or "<em>translate</em> information". Learn the seven exactly and every distractor becomes visible.</li>
<li><strong>The second most likely question is about order.</strong> "Which comes first?" → <em>identify an information need</em>. "Which comes last?" → <em>store information</em>. "What immediately follows evaluate?" → <em>select</em>.</li>
<li><strong>Why repetition is defensible teaching.</strong> Spaced repetition is how lists survive; the deck is a review deck, and a review deck that shows its key list twice is doing its job. Treat it the way you should treat your own revision: the list should reappear on day 1, day 3 and day 7, not once.</li>
</ul>
<p class="dap-an">✅ Self-check before moving on: the seven components in order are <strong>identify need · access · search · evaluate · select · use · store</strong>. Seven — not six, not eight.</p>`,
        `<p class="y-chinh">🎯 <strong>Slide này TRÙNG HỆT slide 13</strong> — cùng tiêu đề, cùng bảy gạch đầu dòng, cùng nguồn "(Adapted from: Bundy, 2004)". Báo cáo thành thật: cú lặp nằm trong chính deck gốc, không phải lỗi của bài giảng này, và cũng không có bước thứ tám nào giấu ở đây.</p>
<ul>
<li><strong>Đừng đi tìm chỗ khác nhau.</strong> Cả hai slide đều ghi: xác định nhu cầu thông tin · tiếp cận · tìm kiếm · đánh giá · chọn lọc · sử dụng · lưu trữ. Nếu bạn đang căng mắt soi xem đổi cái gì thì dừng lại — không đổi gì cả.</li>
<li><strong>Tận dụng cú lặp làm bài ôn miễn phí.</strong> Trước khi đọc tiếp, nhắm mắt kể lại bảy bước theo đúng thứ tự. Bước nào bạn không nặn ra được chính là bước bạn sẽ mất điểm, vì câu "cái nào sau đây KHÔNG phải một thành phần của information literacy" là dạng câu dễ đoán nhất mà MOOC này có thể sinh ra.</li>
<li><strong>Câu hỏi kiểu đó thường được dựng thế nào.</strong> Phương án sai là một "hàng xóm" nghe rất hợp lý nhưng không nằm trong danh sách của Bundy — ví dụ "<em>xuất bản</em> thông tin", "<em>học thuộc</em> thông tin", "<em>mua</em> thông tin" hay "<em>dịch</em> thông tin". Thuộc chính xác bảy bước thì mọi mồi nhử đều lộ.</li>
<li><strong>Dạng câu hỏi khả năng cao thứ nhì là về THỨ TỰ.</strong> "Bước nào đầu tiên?" → <em>xác định nhu cầu thông tin</em>. "Bước nào cuối cùng?" → <em>lưu trữ</em>. "Ngay sau đánh giá là gì?" → <em>chọn lọc</em>.</li>
<li><strong>Vì sao lặp lại là cách dạy có lý.</strong> Lặp lại giãn cách là cách các danh sách sống sót; đây là deck ÔN TẬP, mà deck ôn tập chiếu danh sách then chốt hai lần là đang làm đúng việc. Hãy đối xử với việc ôn của bạn y như vậy: danh sách này nên xuất hiện lại ở ngày 1, ngày 3 và ngày 7, chứ không phải một lần.</li>
</ul>
<p class="dap-an">✅ Tự kiểm trước khi đi tiếp: bảy thành phần theo đúng thứ tự là <strong>xác định nhu cầu · tiếp cận · tìm kiếm · đánh giá · chọn lọc · sử dụng · lưu trữ</strong>. BẢY — không phải sáu, không phải tám.</p>`],

      [15, '1.3 Survival Skills for University — gain insight into key skills for success at university',
        `<p class="y-chinh">🎯 A one-line objective slide opening lesson <strong>1.3</strong>: <strong>gain insight into key skills for success at university</strong>. It is the bridge between the abstract values block (5–11) and the concrete integrity block (16–22).</p>
<ul>
<li><strong>"Survival skills" is a deliberate register shift.</strong> After ten slides of values and literacies, the MOOC pauses to say: here is what actually gets you through the week. Not another framework — the practical habits.</li>
<li><strong>What the lesson covers in the MOOC</strong> (the video, not this title card): time management, note-taking, reading strategically rather than exhaustively, using academic support services, and asking for help before a deadline instead of after it.</li>
<li><strong>The highest-value survival skill at FPTU is time-blocking against a 10-week term.</strong> Every subject front-loads reading and back-loads assessment, so weeks 7–10 collide. Put deadlines for <em>all</em> subjects on one calendar in week 1 and the collisions become visible while they are still fixable.</li>
<li><strong>Second: read for a purpose, not from page one.</strong> Nobody reads every assigned page. Read the abstract, then the conclusion, then decide whether the middle is worth it — which is exactly the "select information" step of slide 13 applied to your own reading time.</li>
<li><strong>Third: use the support that already exists.</strong> Office hours, the library's research help, the academic-writing resources on FLM. Using them is <em>independent learning</em> (slide 9), not an admission of weakness.</li>
<li><strong>Honest note on this slide:</strong> it is a title card with a single objective and no content of its own. The substance is in the MOOC videos for section 1.3; nothing else is claimed here, and this lesson does not invent a list the slide does not contain.</li>
</ul>
<p class="meo">💡 Hook: the three survival skills that predict the grade are <strong>plan early · read selectively · ask early</strong>. All three are about acting <em>before</em> the deadline, which is the one thing you cannot do retroactively.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu một dòng, mở bài <strong>1.3</strong>: <strong>có được hiểu biết về những kỹ năng then chốt để thành công ở đại học</strong>. Nó là cây cầu giữa khối giá trị trừu tượng (5–11) và khối liêm chính rất cụ thể (16–22).</p>
<ul>
<li><strong>"Survival skills" (kỹ năng sinh tồn) là một cú đổi giọng có chủ ý.</strong> Sau mười slide giá trị và năng lực, MOOC dừng lại để nói: đây mới là thứ giúp bạn qua được một tuần. Không phải thêm một khung lý thuyết — mà là thói quen thực hành.</li>
<li><strong>Bài học này trong MOOC bàn gì</strong> (ở video, không phải ở tấm bìa này): quản lý thời gian, ghi chép, đọc có chiến lược thay vì đọc hết, dùng các dịch vụ hỗ trợ học tập, và hỏi TRƯỚC hạn nộp chứ không phải sau.</li>
<li><strong>Kỹ năng sinh tồn giá trị nhất ở FPTU là chia khung thời gian theo một kỳ 10 tuần.</strong> Môn nào cũng dồn đọc vào đầu kỳ và dồn đánh giá vào cuối kỳ, nên tuần 7–10 đụng nhau hết. Đưa deadline của <em>TẤT CẢ</em> các môn lên MỘT cái lịch ngay tuần 1 thì các cú đụng độ hiện ra lúc còn cứu được.</li>
<li><strong>Thứ hai: đọc có mục đích, đừng đọc từ trang một.</strong> Không ai đọc hết mọi trang được giao. Đọc tóm tắt, rồi kết luận, rồi mới quyết định phần giữa có đáng không — chính là bước "chọn lọc thông tin" ở slide 13 áp lên chính quỹ thời gian đọc của bạn.</li>
<li><strong>Thứ ba: dùng những hỗ trợ vốn đã có sẵn.</strong> Giờ tiếp sinh viên, hỗ trợ tra cứu của thư viện, tài nguyên viết học thuật trên FLM. Dùng chúng chính là <em>tự học</em> (slide 9), không phải thú nhận yếu kém.</li>
<li><strong>Ghi chú thành thật về slide này:</strong> nó là một tấm bìa với đúng một mục tiêu, tự nó không có nội dung. Phần thịt nằm ở video mục 1.3 của MOOC; ở đây không khẳng định gì thêm, và bài giảng này không bịa ra một danh sách mà slide không có.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: ba kỹ năng sinh tồn dự báo điểm số là <strong>lên kế hoạch sớm · đọc có chọn lọc · hỏi sớm</strong>. Cả ba đều là hành động <em>TRƯỚC</em> hạn nộp — thứ duy nhất không thể làm bù về sau.</p>`],

      [16, '1.4 Academic Integrity — objectives: definition, and ethical issues around access and use of information',
        `<p class="y-chinh">🎯 Objective slide for lesson <strong>1.4</strong>, and the start of the most heavily examined block of Mooc 1. Two objectives: <strong>understand the definition of academic integrity</strong>, and <strong>demonstrate awareness of ethical issues related to academic integrity surrounding the access and use of information</strong>.</p>
<ul>
<li><strong>Read the two verbs — they are different levels.</strong> "Understand the definition" is recall (slide 17 gives it). "<em>Demonstrate awareness</em> of ethical issues" is application: you are expected to recognise misconduct in a described <em>situation</em>, not just define a word. Expect scenario questions in the exam, not only definitions.</li>
<li><strong>Note the exact scope: "surrounding the <em>access</em> and <em>use</em> of information".</strong> Integrity here is not a general lecture on being a good person — it is specifically about how you get hold of information and what you then do with it. That maps onto steps 2 and 6 of the information-literacy list (slide 13).</li>
<li><strong>Why this block sits inside an information-literacy MOOC at all.</strong> Because the two are inseparable: the moment you use someone else's information, you owe them attribution. Skill without integrity is just faster plagiarism.</li>
<li><strong>At FPTU this block has direct disciplinary weight.</strong> Academic misconduct is handled by regulation, not by your lecturer's mood: outcomes range from zero on the assessment, to zero for the subject, to a disciplinary record. Nothing in slides 17–22 is theoretical.</li>
<li><strong>The specific 2020s version of the same issue: AI.</strong> "Access and use of information" now includes generative AI output. The value has not changed — undeclared use of something you did not produce is misconduct — but the surface has. Slide 20 is the right place to think it through, and each course's own AI rules on FLM are the authority.</li>
<li><strong>Cross-course link.</strong> CSI106 chapter 12 (computer ethics, intellectual property, copyright) is the legal/technical companion to this block. Same behaviour, two frames: the law calls it infringement, the university calls it misconduct — and you can be caught by both for one act.</li>
</ul>
<p class="meo">💡 Structure of the block ahead: <strong>17 = what integrity is · 18 = the five values · 19 = the one rule · 20 = the five kinds of misconduct · 21–22 = which values each breaks.</strong> Learn it in that shape and it holds together.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của bài <strong>1.4</strong>, và là chỗ bắt đầu khối bị hỏi nhiều nhất của Mooc 1. Hai mục tiêu: <strong>hiểu định nghĩa liêm chính học thuật</strong>, và <strong>thể hiện được nhận thức về các vấn đề đạo đức liên quan tới liêm chính học thuật xoay quanh việc TIẾP CẬN và SỬ DỤNG thông tin</strong>.</p>
<ul>
<li><strong>Đọc kỹ hai động từ — chúng ở hai cấp khác nhau.</strong> "Hiểu định nghĩa" là ghi nhớ (slide 17 cấp cho). "<em>Thể hiện nhận thức</em> về các vấn đề đạo đức" là VẬN DỤNG: bạn được kỳ vọng nhận ra hành vi sai trong một <em>TÌNH HUỐNG</em> được mô tả, chứ không chỉ định nghĩa một từ. Hãy chờ câu hỏi tình huống trong đề thi, không riêng câu định nghĩa.</li>
<li><strong>Để ý phạm vi chính xác: "xoay quanh việc <em>tiếp cận</em> và <em>sử dụng</em> thông tin".</strong> Liêm chính ở đây không phải bài giảng chung chung về làm người tử tế — nó nói riêng về cách bạn lấy được thông tin và sau đó làm gì với nó. Đúng bằng bước 2 và bước 6 trong danh sách năng lực thông tin (slide 13).</li>
<li><strong>Vì sao khối này lại nằm trong một MOOC về năng lực thông tin.</strong> Vì hai thứ không tách rời: khoảnh khắc bạn dùng thông tin của người khác là bạn nợ họ một lời ghi công. Kỹ năng mà thiếu liêm chính thì chỉ là đạo văn NHANH HƠN.</li>
<li><strong>Ở FPTU khối này có sức nặng kỷ luật trực tiếp.</strong> Gian lận học thuật được xử theo QUY CHẾ, không theo tâm trạng của giảng viên: hậu quả trải từ 0 điểm đầu điểm đó, tới 0 điểm cả môn, tới một hồ sơ kỷ luật. Không có gì trong slide 17–22 là lý thuyết suông.</li>
<li><strong>Phiên bản thập niên 2020 của cùng vấn đề: AI.</strong> "Tiếp cận và sử dụng thông tin" bây giờ bao gồm cả kết quả do AI sinh ra. Giá trị thì không đổi — dùng thứ không do mình tạo ra mà không khai báo là gian lận — nhưng bề mặt thì đổi. Slide 20 là chỗ hợp lý để nghĩ cho hết, còn quy định AI RIÊNG của từng môn trên FLM mới là thẩm quyền cuối cùng.</li>
<li><strong>Nối sang môn khác.</strong> CSI106 chương 12 (đạo đức máy tính, sở hữu trí tuệ, bản quyền) là người anh em pháp lý/kỹ thuật của khối này. Cùng một hành vi, hai khung nhìn: luật gọi là xâm phạm bản quyền, nhà trường gọi là gian lận học thuật — và một hành vi có thể dính CẢ HAI.</li>
</ul>
<p class="meo">💡 Cấu trúc khối sắp tới: <strong>17 = liêm chính là gì · 18 = năm giá trị · 19 = một luật duy nhất · 20 = năm dạng vi phạm · 21–22 = mỗi dạng phá vỡ giá trị nào.</strong> Học theo đúng hình dạng đó thì nó dính vào nhau chắc.</p>`],

      [17, 'Academic Integrity — "behaving honestly, ethically and responsibly within the academic context"',
        `<p class="y-chinh">🎯 <strong>The definition slide of the integrity block — learn this sentence.</strong> Academic integrity "refers to <strong>behaving honestly, ethically and responsibly within the academic context, in relation to the scholarly work that you produce</strong>." The slide also restates the two objectives from slide 16.</p>
<table>
<tr><th>Element of the definition</th><th>What it commits you to</th><th>Broken when…</th></tr>
<tr><td><strong>honestly</strong></td><td>Your work represents what you actually did and actually found</td><td>You invent a survey result, or present someone's paragraph as yours</td></tr>
<tr><td><strong>ethically</strong></td><td>You respect others' rights and the community's rules while working</td><td>You take a classmate's file from a shared drive without asking</td></tr>
<tr><td><strong>responsibly</strong></td><td>You own the consequences, including in group work</td><td>You sign off a group report you never checked, containing copied text</td></tr>
<tr><td><strong>within the academic context</strong></td><td>It applies to study, not just to research careers</td><td>People assume "it's only a class exercise, not a real paper"</td></tr>
<tr><td><strong>in relation to the scholarly work you produce</strong></td><td>Every artefact: essays, code, slides, lab reports, posts</td><td>People assume integrity only covers written essays</td></tr>
</table>
<ul>
<li><strong>It is defined as a BEHAVIOUR, not a feeling.</strong> "Behaving honestly" — not "believing in honesty". That is the middle ring of slide 7 again: the community judges what you do, and it judges the artefact you submit.</li>
<li><strong>The three adverbs map neatly onto the five values of slide 18.</strong> <em>Honestly</em> → Honesty and Trust; <em>ethically</em> → Fairness and Respect; <em>responsibly</em> → Responsibility. Learn them as one system and neither list needs rote memorisation.</li>
<li><strong>"Scholarly work that you produce" includes code.</strong> For a computing student this is the most important clarification in the whole block. A program submitted for assessment is scholarly work: copied code without attribution is plagiarism in exactly the same sense as copied prose.</li>
<li><strong>Integrity is positive, misconduct is its absence.</strong> The slide defines what to <em>do</em>; slide 20 lists what happens when it is missing. In an MCQ, options phrased as "not cheating" are weaker than options phrased as "behaving honestly, ethically and responsibly".</li>
<li><strong>Everyday FPTU test that works.</strong> Before submitting, ask: <em>could I explain every line of this to the lecturer, right now, and say where it came from?</em> If yes, you have integrity. If any part makes you hesitate, that part is the problem — deal with it before submitting, not after.</li>
</ul>
<p class="pitfall">⚠️ Common misreading: academic integrity is not only about exams. It covers assignments, lab reports, group projects, discussion posts, code, and how you obtained your sources in the first place. Restricting it to "not cheating in the exam room" is the mistake the definition is worded to prevent.</p>`,
        `<p class="y-chinh">🎯 <strong>Slide định nghĩa của khối liêm chính — thuộc câu này.</strong> Liêm chính học thuật "là <strong>hành xử TRUNG THỰC, CÓ ĐẠO ĐỨC và CÓ TRÁCH NHIỆM trong bối cảnh học thuật, đối với công trình học thuật mà chính bạn tạo ra</strong>". Slide cũng nhắc lại hai mục tiêu của slide 16.</p>
<table>
<tr><th>Thành phần định nghĩa</th><th>Nó buộc bạn điều gì</th><th>Bị phá khi…</th></tr>
<tr><td><strong>trung thực</strong></td><td>Bài của bạn phản ánh đúng thứ bạn đã làm và đã tìm thấy</td><td>Bạn bịa một kết quả khảo sát, hoặc trình đoạn văn của người khác như của mình</td></tr>
<tr><td><strong>có đạo đức</strong></td><td>Bạn tôn trọng quyền của người khác và luật của cộng đồng trong lúc làm</td><td>Bạn lấy file của bạn cùng lớp trên ổ đĩa chung mà không hỏi</td></tr>
<tr><td><strong>có trách nhiệm</strong></td><td>Bạn nhận lấy hậu quả, kể cả trong bài nhóm</td><td>Bạn ký duyệt một báo cáo nhóm mình chưa hề đọc, bên trong có đoạn chép</td></tr>
<tr><td><strong>trong bối cảnh học thuật</strong></td><td>Áp dụng cho việc HỌC, không riêng nghề nghiên cứu</td><td>Có người nghĩ "bài tập trên lớp thôi mà, có phải bài báo thật đâu"</td></tr>
<tr><td><strong>với công trình bạn tạo ra</strong></td><td>MỌI sản phẩm: tiểu luận, MÃ NGUỒN, slide, báo cáo lab, bài đăng</td><td>Có người nghĩ liêm chính chỉ dính tới bài luận viết tay</td></tr>
</table>
<ul>
<li><strong>Nó được định nghĩa là HÀNH VI, không phải cảm xúc.</strong> "Hành xử trung thực" — chứ không phải "tin vào sự trung thực". Đó lại đúng là vòng GIỮA của slide 7: cộng đồng phán xét thứ bạn LÀM, và phán xét sản phẩm bạn nộp.</li>
<li><strong>Ba trạng từ khớp gọn với năm giá trị ở slide 18.</strong> <em>Trung thực</em> → Honesty và Trust; <em>có đạo đức</em> → Fairness và Respect; <em>có trách nhiệm</em> → Responsibility. Học như MỘT hệ thống thì không danh sách nào cần học vẹt.</li>
<li><strong>"Công trình học thuật bạn tạo ra" BAO GỒM CẢ MÃ NGUỒN.</strong> Với sinh viên CNTT đây là làm rõ quan trọng nhất của cả khối. Một chương trình nộp để chấm điểm là công trình học thuật: code chép về mà không ghi nguồn là đạo văn theo đúng nghĩa như chép văn.</li>
<li><strong>Liêm chính là khái niệm DƯƠNG, còn misconduct là sự VẮNG MẶT của nó.</strong> Slide định nghĩa điều PHẢI làm; slide 20 liệt kê chuyện xảy ra khi nó thiếu. Trong trắc nghiệm, phương án diễn đạt kiểu "không gian lận" yếu hơn phương án diễn đạt kiểu "hành xử trung thực, có đạo đức, có trách nhiệm".</li>
<li><strong>Phép thử hằng ngày ở FPTU, dùng được thật.</strong> Trước khi nộp, tự hỏi: <em>mình có giải thích được từng dòng trong này cho giảng viên, ngay bây giờ, và nói được nó từ đâu ra không?</em> Nếu có, bạn có liêm chính. Chỗ nào làm bạn chần chừ thì chính chỗ đó là vấn đề — xử nó TRƯỚC khi nộp, đừng sau.</li>
</ul>
<p class="pitfall">⚠️ Hiểu sai phổ biến: liêm chính học thuật KHÔNG chỉ là chuyện phòng thi. Nó phủ cả bài tập, báo cáo lab, đồ án nhóm, bài đăng diễn đàn, mã nguồn, và cả cách bạn kiếm được nguồn tài liệu ngay từ đầu. Thu hẹp nó thành "không quay cóp trong phòng thi" chính là lỗi mà câu định nghĩa được viết ra để ngăn.</p>`],

      [18, 'Central Values — Honesty, Trust, Fairness, Respect, Responsibility + the courage to act on them (ICAI, 2014, p.16)',
        `<p class="y-chinh">🎯 <strong>The five central values of academic integrity, plus a sixth thing that is not a value but a condition.</strong> On the left: <strong>Honesty · Trust · Fairness · Respect · Responsibility</strong>. In the middle a large plus sign. On the right: "<strong>…the courage to act on them even in the face of adversity.</strong>" (International Centre for Academic Integrity, 2014, p.16)</p>
<table>
<tr><th>Value</th><th>What it means here</th><th>A real FPTU situation</th></tr>
<tr><td><strong>Honesty</strong></td><td>Say what is true about your work, your data and your sources</td><td>Your report says the test ran on 20 users because it ran on 20, not on 4</td></tr>
<tr><td><strong>Trust</strong></td><td>The community can rely on submitted work being genuine, so it need not police everything</td><td>The lecturer accepts your results without re-running them — that only works if nobody fakes them</td></tr>
<tr><td><strong>Fairness</strong></td><td>Everyone is assessed on the same terms; nobody gets an unearned advantage</td><td>You got 7 by working; someone who copied got 9 — that is the harm, and it is done to you</td></tr>
<tr><td><strong>Respect</strong></td><td>Respect for others' ideas and for the process, shown by attribution</td><td>Citing the author whose algorithm you adapted, instead of quietly absorbing it</td></tr>
<tr><td><strong>Responsibility</strong></td><td>You answer for your own work — and do not enable others' misconduct</td><td>Saying no when a friend asks for your assignment file "just to look at"</td></tr>
</table>
<ul>
<li><strong>The plus sign is the whole point of the slide's layout.</strong> Values alone are not integrity: <strong>five values + the courage to act on them under pressure</strong>. Everyone holds the five when nothing is at stake. They are tested at 2am before a deadline, when a friend sends a file, when the group is behind.</li>
<li><strong>"Even in the face of adversity" names the realistic case.</strong> Adversity is exactly the deadline, the difficult course, the pressure from a group, the fear of failing. The definition assumes you will be under pressure — that is when it applies.</li>
<li><strong>Fairness is the value students most often fail to feel.</strong> Plagiarism is usually experienced as "a victimless shortcut". It is not: it steals a place in a ranked distribution from the person who did the work. If you have ever been annoyed at a free-rider in a group, you have already felt this value.</li>
<li><strong>Responsibility runs in two directions.</strong> Not only "do not cheat" but "do not help someone else cheat" — which is why slide 20 makes <em>facilitation</em> a separate category of misconduct in its own right.</li>
<li><strong>Cite the source properly if you quote this.</strong> The five values are from the International Centre for Academic Integrity (ICAI), 2014, p.16 — a real organisation, a real page reference, printed on the slide precisely because the slide practises what it preaches.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>H-T-F-R-R</strong>, or remember it as a sentence — "<em>Honest people are Trusted, treated Fairly, shown Respect, and take Responsibility</em>". And the exam-critical extra: <strong>+ courage</strong>. A question asking "how many central values does ICAI identify?" wants <strong>five</strong>; courage is listed as what you need in addition, not as a sixth value.</p>`,
        `<p class="y-chinh">🎯 <strong>Năm giá trị trung tâm của liêm chính học thuật, cộng một thứ thứ sáu không phải giá trị mà là ĐIỀU KIỆN.</strong> Bên trái: <strong>Honesty (Trung thực) · Trust (Tin cậy) · Fairness (Công bằng) · Respect (Tôn trọng) · Responsibility (Trách nhiệm)</strong>. Ở giữa là một dấu CỘNG lớn. Bên phải: "<strong>…the courage to act on them even in the face of adversity</strong>" — lòng can đảm hành động theo chúng ngay cả khi gặp nghịch cảnh. (International Centre for Academic Integrity, 2014, p.16)</p>
<table>
<tr><th>Giá trị</th><th>Nghĩa ở đây</th><th>Tình huống thật ở FPTU</th></tr>
<tr><td><strong>Honesty — Trung thực</strong></td><td>Nói đúng sự thật về công việc, dữ liệu và nguồn của mình</td><td>Báo cáo ghi thử nghiệm trên 20 người vì nó chạy trên 20, không phải 4</td></tr>
<tr><td><strong>Trust — Tin cậy</strong></td><td>Cộng đồng tin bài nộp là thật, nên không phải đi canh gác mọi thứ</td><td>Giảng viên nhận kết quả của bạn mà không chạy lại — chỉ chạy được nếu không ai làm giả</td></tr>
<tr><td><strong>Fairness — Công bằng</strong></td><td>Mọi người được đánh giá trên cùng một điều kiện; không ai có lợi thế không do mình tạo ra</td><td>Bạn cày được 7; kẻ chép được 9 — đó chính là thiệt hại, và nó giáng lên BẠN</td></tr>
<tr><td><strong>Respect — Tôn trọng</strong></td><td>Tôn trọng ý tưởng của người khác và tôn trọng quy trình, thể hiện bằng việc ghi nguồn</td><td>Dẫn tên tác giả có thuật toán mà bạn phỏng theo, thay vì âm thầm nuốt gọn</td></tr>
<tr><td><strong>Responsibility — Trách nhiệm</strong></td><td>Bạn chịu trách nhiệm cho bài của mình — và không tiếp tay cho vi phạm của người khác</td><td>Nói KHÔNG khi bạn thân xin file bài tập "để xem thôi mà"</td></tr>
</table>
<ul>
<li><strong>Dấu cộng chính là toàn bộ ý của cách bố trí slide.</strong> Chỉ có giá trị thì chưa phải liêm chính: <strong>năm giá trị + lòng can đảm hành động theo chúng khi bị ép</strong>. Ai cũng giữ được năm giá trị khi chẳng mất gì. Chúng bị thử lúc 2 giờ sáng trước hạn nộp, lúc bạn thân gửi file, lúc cả nhóm đang trễ tiến độ.</li>
<li><strong>"Ngay cả khi gặp nghịch cảnh" gọi đúng tên trường hợp thực tế.</strong> Nghịch cảnh chính là cái deadline, môn khó, áp lực từ nhóm, nỗi sợ trượt. Định nghĩa MẶC ĐỊNH rằng bạn sẽ bị ép — và đó chính là lúc nó có hiệu lực.</li>
<li><strong>Công bằng là giá trị sinh viên ít cảm nhận được nhất.</strong> Đạo văn thường được trải nghiệm như "một lối tắt không có nạn nhân". Không phải: nó cướp một vị trí trong bảng xếp hạng từ tay người đã thật sự làm. Nếu bạn từng bực vì một người ngồi không trong nhóm, bạn đã cảm nhận được giá trị này rồi.</li>
<li><strong>Trách nhiệm chạy theo HAI chiều.</strong> Không chỉ "đừng gian lận" mà còn "đừng giúp người khác gian lận" — đó là lý do slide 20 tách <em>facilitation</em> (tiếp tay) thành một hạng mục vi phạm riêng.</li>
<li><strong>Trích dẫn cho đúng nếu bạn dùng lại.</strong> Năm giá trị này là của International Centre for Academic Integrity (ICAI), 2014, p.16 — tổ chức có thật, số trang có thật, in trên slide đúng vì slide đang làm điều nó dạy.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>H-T-F-R-R</strong>, hoặc nhớ thành một câu — "<em>người Trung thực thì được Tin cậy, được đối xử Công bằng, được Tôn trọng, và biết nhận Trách nhiệm</em>". Và phần cực quan trọng cho đề thi: <strong>+ lòng can đảm</strong>. Câu hỏi "ICAI nêu bao nhiêu giá trị trung tâm?" muốn đáp án <strong>NĂM</strong>; can đảm được nêu như thứ CẦN THÊM, không phải giá trị thứ sáu.</p>`],

      [19, 'All the work you produce must be your own work — and you must reference others appropriately',
        `<p class="y-chinh">🎯 A plain white slide with one sentence, and it is the operational rule of the whole integrity block: "<strong>All the work you produce must be your own work and when you refer to the work of others, you need to reference their work and ideas appropriately.</strong>"</p>
<ul>
<li><strong>Two clauses, and the second one is what makes the first workable.</strong> "All your own work" does not mean "never use anyone else's". Academic work is built on other people's work — that is the collective enterprise of slide 8. The rule is: <em>use freely, attribute always</em>.</li>
<li><strong>"Their work <em>and ideas</em>" is the half students miss.</strong> You must reference not just quoted words but borrowed <strong>ideas</strong>: a framework, a classification, an argument, an approach — even when every word is your own. Paraphrasing removes the quotation marks, not the citation.</li>
<li><strong>"Appropriately" means to the standard your course requires.</strong> The style (APA, IEEE, Harvard) varies by discipline and by subject; what never varies is that a reader must be able to find the exact source you used. For computing subjects at FPTU, IEEE numbered style is the common one — check the assignment brief, and be consistent.</li>
<li><strong>The three-part test for whether you need a citation.</strong> (1) Is it your own original thought, produced by you? (2) Is it common knowledge in the field — the kind of fact any textbook states without a source? (3) If neither, cite it. When you are unsure, cite: an unnecessary citation costs nothing, a missing one is misconduct.</li>
<li><strong>Applied to code, which is where it bites computing students.</strong> A snippet from Stack Overflow, a function from a blog, a model from a tutorial, an AI-generated block — all of these are "the work of others". A comment naming the source above the block, plus whatever your subject's brief requires, is the minimum. Silently pasting is exactly the behaviour this sentence forbids.</li>
<li><strong>Group work does not dissolve the rule.</strong> "All the work you produce" still means your contribution is yours. A group report needs internal clarity about who wrote what, and it still needs references for everything taken from outside the group.</li>
</ul>
<p class="dap-an">✅ Quick test: you read three papers, formed your own conclusion, and wrote it in your own words. Do you cite? <strong>Yes</strong> — the conclusion is yours, but the evidence supporting it is theirs, and each supporting claim needs its source.</p>
<p class="pitfall">⚠️ The most common honest mistake: changing the words of a source and thinking that makes it yours. Paraphrasing without a citation is still plagiarism — the <em>idea</em> was borrowed. The words change; the debt does not.</p>`,
        `<p class="y-chinh">🎯 Một slide trắng với đúng một câu, và đó là LUẬT VẬN HÀNH của cả khối liêm chính: "<strong>Toàn bộ công trình bạn tạo ra phải là của chính bạn, và khi bạn nhắc tới công trình của người khác, bạn phải dẫn nguồn công trình và ý tưởng của họ một cách phù hợp.</strong>"</p>
<ul>
<li><strong>Hai vế, và vế thứ hai mới làm cho vế thứ nhất khả thi.</strong> "Tất cả là của chính bạn" KHÔNG có nghĩa "không bao giờ dùng của ai". Công trình học thuật được xây trên công trình của người khác — chính là "sự nghiệp tập thể" ở slide 8. Luật là: <em>dùng thoải mái, ghi nguồn luôn luôn</em>.</li>
<li><strong>"công trình <em>VÀ Ý TƯỞNG</em> của họ" là nửa vế sinh viên hay bỏ sót.</strong> Bạn phải dẫn nguồn không chỉ cho chữ trích nguyên văn mà cho cả <strong>Ý TƯỞNG</strong> đi mượn: một khung phân tích, một cách phân loại, một lập luận, một hướng tiếp cận — kể cả khi từng chữ đều do bạn viết. Diễn đạt lại thì bỏ được dấu ngoặc kép, KHÔNG bỏ được lời dẫn nguồn.</li>
<li><strong>"Phù hợp" nghĩa là theo chuẩn mà môn học của bạn yêu cầu.</strong> Kiểu trích (APA, IEEE, Harvard) thay đổi theo ngành và theo môn; thứ không bao giờ đổi là người đọc phải tìm lại được đúng cái nguồn bạn đã dùng. Với các môn CNTT ở FPTU, kiểu IEEE đánh số là phổ biến — hãy xem đề bài, và giữ NHẤT QUÁN.</li>
<li><strong>Phép thử ba bước xem có cần trích dẫn không.</strong> (1) Đây có phải suy nghĩ gốc do chính bạn nghĩ ra không? (2) Đây có phải kiến thức phổ thông của ngành — loại sự kiện mà sách giáo khoa nào cũng nêu mà không cần nguồn? (3) Không thuộc cả hai thì DẪN NGUỒN. Phân vân thì cứ dẫn: một trích dẫn thừa không mất gì, một trích dẫn thiếu là gian lận.</li>
<li><strong>Áp vào MÃ NGUỒN, chỗ này mới cắn sinh viên CNTT.</strong> Một đoạn từ Stack Overflow, một hàm từ blog, một model từ tutorial, một khối do AI sinh ra — tất cả đều là "công trình của người khác". Một dòng chú thích ghi rõ nguồn ngay trên khối đó, cộng với bất cứ thứ gì đề bài môn bạn yêu cầu, là mức tối thiểu. Dán im lặng chính là hành vi mà câu này cấm.</li>
<li><strong>Làm nhóm không xoá được luật này.</strong> "Công trình bạn tạo ra" vẫn có nghĩa phần của bạn là của bạn. Báo cáo nhóm cần rõ ràng bên trong về ai viết phần nào, và vẫn cần dẫn nguồn cho mọi thứ lấy từ ngoài nhóm.</li>
</ul>
<p class="dap-an">✅ Thử nhanh: bạn đọc ba bài báo, tự rút ra kết luận của mình, và viết bằng lời của mình. Có phải dẫn nguồn không? <strong>CÓ</strong> — kết luận là của bạn, nhưng bằng chứng chống đỡ nó là của họ, và mỗi khẳng định chống đỡ đều cần nguồn của nó.</p>
<p class="pitfall">⚠️ Lỗi "thành thật" phổ biến nhất: đổi chữ của một nguồn rồi tưởng thế là thành của mình. Diễn đạt lại mà không dẫn nguồn VẪN LÀ ĐẠO VĂN — cái đi mượn là <em>Ý TƯỞNG</em>. Chữ thì đổi; món nợ thì không.</p>`],

      [20, 'Academic Misconduct — the five categories',
        `<p class="y-chinh">🎯 <strong>The list that the exam will test.</strong> Academic misconduct comes in five forms: <strong>Plagiarism · Self-plagiarism (re-submission) · Cheating · Fabrication or falsification of data or results · Facilitation of academic misconduct of another</strong>.</p>
<table>
<tr><th>Form</th><th>What it is</th><th>Concrete example</th><th>Values broken (slide 18)</th></tr>
<tr><td><strong>Plagiarism</strong></td><td>Presenting someone else's work, words or ideas as your own, without attribution</td><td>Pasting three paragraphs from a blog into your report; copying a classmate's function</td><td>Honesty, Trust, Fairness, Respect</td></tr>
<tr><td><strong>Self-plagiarism (re-submission)</strong></td><td>Submitting your <em>own</em> previous work again for new credit, without permission</td><td>Handing in your last term's essay, or reusing your PRJ301 module for SWP391, as if newly produced</td><td>Honesty, Fairness</td></tr>
<tr><td><strong>Cheating</strong></td><td>Gaining an unfair advantage in an assessment by breaking its rules</td><td>Notes in the exam, a second person sitting it, unauthorised tools, sharing answers during a test</td><td>Honesty, Fairness, Respect</td></tr>
<tr><td><strong>Fabrication or falsification of data/results</strong></td><td>Inventing data (fabrication) or altering real data (falsification)</td><td>"Surveyed 50 users" when you surveyed 6; deleting the runs that contradict your conclusion</td><td>Honesty, Trust</td></tr>
<tr><td><strong>Facilitation of another's misconduct</strong></td><td>Helping someone else commit any of the above</td><td>Sending your file "just as a reference"; writing a friend's code; letting someone copy in the exam</td><td>Honesty, Trust, Fairness, Respect, Responsibility</td></tr>
</table>
<ul>
<li><strong>Self-plagiarism is the one that surprises people, so expect it in the exam.</strong> The intuition "it's my own work, how can I steal from myself?" is wrong: assessment credits <em>new</em> work for <em>this</em> task. Re-submitting claims credit twice for one effort, which is unfair to everyone doing the work twice. If you want to build on your own earlier work, declare it and get permission.</li>
<li><strong>Fabrication vs falsification — a two-word distinction worth knowing.</strong> <em>Fabrication</em> = making data up from nothing. <em>Falsification</em> = changing or selectively deleting real data. Both are on the slide as one category, but an MCQ may ask you to tell them apart.</li>
<li><strong>Facilitation makes the helper equally liable.</strong> "I only gave him the file, he copied it" is not a defence — it is the definition of the fifth category. This is the single most common way a good student at FPTU ends up in a disciplinary process: they never cheated, they lent a file.</li>
<li><strong>Where generative AI sits.</strong> There is no "AI" row because the categories are about behaviour, not tools. Using AI where it is prohibited, or passing AI output off as your own writing, is <em>plagiarism</em> and, in an exam context, <em>cheating</em>; inventing a citation an AI produced is <em>fabrication</em>. Where AI is permitted, use it and declare it as your subject's brief requires. <strong>The rule that decides is the one in the assignment brief on FLM</strong> — check it per subject, never assume.</li>
<li><strong>Consequences at FPTU are regulated, not negotiable.</strong> Depending on severity: zero for the assessment, zero for the subject, a disciplinary record, and for the worst cases suspension. And because SSL101c is 100% one exam, a misconduct finding there costs the whole subject.</li>
</ul>
<p class="meo">💡 Mnemonic for the five: <strong>P-S-C-F-F</strong> — "<em>Plagiarism, Self-plagiarism, Cheating, Fabrication, Facilitation</em>". Two are about taking others' work (plagiarism, facilitation), one about reusing your own (self-plagiarism), one about the assessment rules (cheating), one about the data (fabrication).</p>`,
        `<p class="y-chinh">🎯 <strong>Danh sách mà đề thi sẽ hỏi.</strong> Gian lận học thuật có năm dạng: <strong>Plagiarism (đạo văn) · Self-plagiarism (tự đạo văn — nộp lại bài cũ) · Cheating (gian lận thi cử) · Fabrication hoặc falsification of data/results (bịa hoặc bóp méo dữ liệu, kết quả) · Facilitation of academic misconduct of another (tiếp tay cho vi phạm của người khác)</strong>.</p>
<table>
<tr><th>Dạng</th><th>Là gì</th><th>Ví dụ cụ thể</th><th>Phá vỡ giá trị nào (slide 18)</th></tr>
<tr><td><strong>Đạo văn</strong></td><td>Trình công trình, câu chữ hoặc ý tưởng của người khác như của mình, không dẫn nguồn</td><td>Dán ba đoạn từ blog vào báo cáo; chép một hàm của bạn cùng lớp</td><td>Trung thực, Tin cậy, Công bằng, Tôn trọng</td></tr>
<tr><td><strong>Tự đạo văn (nộp lại)</strong></td><td>Nộp lại chính công trình CŨ của MÌNH để lấy điểm mới, không xin phép</td><td>Nộp lại tiểu luận kỳ trước, hoặc dùng lại module PRJ301 cho SWP391 như thể vừa làm</td><td>Trung thực, Công bằng</td></tr>
<tr><td><strong>Gian lận thi cử</strong></td><td>Giành lợi thế không công bằng trong một đầu điểm bằng cách phá luật của nó</td><td>Mang phao vào phòng thi, thi hộ, dùng công cụ không được phép, chuyền đáp án</td><td>Trung thực, Công bằng, Tôn trọng</td></tr>
<tr><td><strong>Bịa / bóp méo dữ liệu</strong></td><td>Bịa ra dữ liệu (fabrication) hoặc sửa dữ liệu thật (falsification)</td><td>"Khảo sát 50 người dùng" trong khi khảo sát 6; xoá các lần chạy trái với kết luận của mình</td><td>Trung thực, Tin cậy</td></tr>
<tr><td><strong>Tiếp tay cho vi phạm của người khác</strong></td><td>Giúp người khác thực hiện bất kỳ dạng nào ở trên</td><td>Gửi file "cho tham khảo thôi"; viết code hộ bạn; để người khác chép trong phòng thi</td><td>Trung thực, Tin cậy, Công bằng, Tôn trọng, Trách nhiệm</td></tr>
</table>
<ul>
<li><strong>Tự đạo văn là dạng làm người ta ngạc nhiên nhất, nên hãy chờ nó trong đề.</strong> Cảm giác "bài của tôi mà, sao tôi ăn cắp của chính tôi được?" là SAI: việc chấm điểm trả công cho công trình <em>MỚI</em> dành cho <em>nhiệm vụ NÀY</em>. Nộp lại là đòi công hai lần cho một lần làm, bất công với tất cả những người làm hai lần. Muốn xây tiếp trên công trình cũ của mình thì phải KHAI BÁO và xin phép.</li>
<li><strong>Fabrication so với falsification — một phân biệt hai chữ đáng biết.</strong> <em>Fabrication</em> = bịa dữ liệu từ hư không. <em>Falsification</em> = sửa hoặc cắt chọn dữ liệu thật. Slide gộp làm một hạng mục, nhưng đề trắc nghiệm có thể bắt bạn phân biệt.</li>
<li><strong>Tiếp tay khiến người GIÚP chịu trách nhiệm ngang bằng.</strong> "Em chỉ đưa file thôi, bạn ấy tự chép" KHÔNG phải lời bào chữa — đó đúng là định nghĩa của hạng mục thứ năm. Đây là cách phổ biến nhất khiến một sinh viên tử tế ở FPTU dính quy trình kỷ luật: họ chưa từng gian lận, họ chỉ cho mượn file.</li>
<li><strong>AI sinh nội dung nằm ở đâu.</strong> Không có dòng "AI" vì các hạng mục nói về HÀNH VI chứ không về công cụ. Dùng AI ở nơi bị cấm, hoặc trình kết quả AI như bài viết của mình, là <em>đạo văn</em> và trong bối cảnh thi là <em>gian lận</em>; đưa vào một trích dẫn do AI bịa ra là <em>fabrication</em>. Ở nơi AI được phép thì dùng và KHAI BÁO theo đúng yêu cầu của đề bài. <strong>Luật quyết định là luật trong đề bài trên FLM</strong> — kiểm theo từng môn, đừng bao giờ đoán.</li>
<li><strong>Hậu quả ở FPTU theo quy chế, không thương lượng.</strong> Tuỳ mức độ: 0 điểm đầu điểm đó, 0 điểm cả môn, một hồ sơ kỷ luật, nặng nhất là đình chỉ. Và vì SSL101c chấm 100% bằng một bài thi, một kết luận gian lận ở đó là mất trắng cả môn.</li>
</ul>
<p class="meo">💡 Mẹo nhớ năm dạng: <strong>Đ-T-G-B-T</strong> — "<em>Đạo văn, Tự đạo văn, Gian lận, Bịa dữ liệu, Tiếp tay</em>". Hai dạng về lấy của người khác (đạo văn, tiếp tay), một về dùng lại của chính mình (tự đạo văn), một về phá luật của kỳ đánh giá (gian lận), một về dữ liệu (bịa/bóp méo).</p>`],

      [21, 'Cheating — dishonest, unfair, disrespectful',
        `<p class="y-chinh">🎯 A short slide that does one job: it maps <strong>cheating</strong> back onto the central values of slide 18. Cheating is <strong>Dishonest · Unfair · Disrespectful</strong> — three of the five values, named as violations.</p>
<table>
<tr><th>Value broken</th><th>Who is harmed, and how</th></tr>
<tr><td><strong>Dishonest</strong> (breaks Honesty)</td><td>The grade claims you know something you do not. The record of your learning becomes false</td></tr>
<tr><td><strong>Unfair</strong> (breaks Fairness)</td><td>Classmates who followed the rules are ranked below you. In a graded cohort this is a direct transfer of advantage from them to you</td></tr>
<tr><td><strong>Disrespectful</strong> (breaks Respect)</td><td>It treats the assessment, the lecturer's work designing it, and the other students as obstacles rather than as a shared process</td></tr>
</table>
<ul>
<li><strong>Why the deck bothers to do this mapping.</strong> A rule you merely obey is fragile under pressure; a rule you can decompose into who is harmed is stable. This slide is the antidote to "everyone does it, nobody is hurt".</li>
<li><strong>Note which two values are NOT listed: Trust and Responsibility.</strong> Compare slide 22, where facilitation breaks all five. That contrast is the whole reason the deck gives cheating and facilitation separate slides — and it is exactly the kind of fine distinction an MCQ can be built on.</li>
<li><strong>What counts as cheating is defined by the assessment's own rules, not by your intent.</strong> A calculator is fine in one exam and cheating in another; a discussion with a friend is encouraged for one assignment and prohibited for another. Read the rules of <em>each</em> assessment; "I didn't know" is not a defence but it is very often the truth, and it is avoidable.</li>
<li><strong>The SSL101c-specific case.</strong> Your whole grade is a 60-minute on-campus MCQ exam. The temptations there are the classic ones — a phone, a note, a neighbour's screen — and the cost of being caught is not a lower mark but the subject. There is no coursework to fall back on.</li>
<li><strong>The honest alternative when you are unprepared.</strong> Sit it, score what you score, and retake. A resit costs time and money. A misconduct record costs both plus your standing, and it does not expire when the term does.</li>
</ul>
<p class="meo">💡 Exam hook: <strong>cheating = 3 values broken (Honesty, Fairness, Respect)</strong>; <strong>facilitation = all 5</strong>. If a question asks which form of misconduct breaches every central value, the answer is facilitation, not cheating.</p>`,
        `<p class="y-chinh">🎯 Một slide ngắn làm đúng một việc: nó ánh xạ <strong>gian lận (cheating)</strong> ngược về các giá trị trung tâm ở slide 18. Gian lận là <strong>Dishonest (bất trung thực) · Unfair (bất công) · Disrespectful (thiếu tôn trọng)</strong> — ba trong năm giá trị, gọi tên dưới dạng vi phạm.</p>
<table>
<tr><th>Giá trị bị phá</th><th>Ai chịu thiệt, và thiệt thế nào</th></tr>
<tr><td><strong>Bất trung thực</strong> (phá Honesty)</td><td>Điểm số tuyên bố bạn biết một thứ bạn không biết. Hồ sơ học tập của bạn trở thành giả</td></tr>
<tr><td><strong>Bất công</strong> (phá Fairness)</td><td>Bạn cùng lớp theo luật bị xếp dưới bạn. Trong một lớp có xếp hạng, đó là một cú chuyển lợi thế trực tiếp từ họ sang bạn</td></tr>
<tr><td><strong>Thiếu tôn trọng</strong> (phá Respect)</td><td>Nó coi kỳ đánh giá, công sức ra đề của giảng viên, và các sinh viên khác là chướng ngại chứ không phải một quy trình chung</td></tr>
</table>
<ul>
<li><strong>Vì sao deck mất công làm phép ánh xạ này.</strong> Một luật mà bạn chỉ TUÂN THEO thì rất mong manh khi bị ép; một luật mà bạn phân tích được ra "ai chịu thiệt" thì bền. Slide này là thuốc giải cho câu "ai chả thế, có hại ai đâu".</li>
<li><strong>Để ý HAI giá trị KHÔNG được liệt kê: Trust và Responsibility.</strong> So với slide 22, nơi tiếp tay phá đủ CẢ NĂM. Chính sự tương phản đó là lý do deck tách cheating và facilitation thành hai slide riêng — và đúng là loại phân biệt tinh vi mà một câu trắc nghiệm có thể dựng lên.</li>
<li><strong>Cái gì bị tính là gian lận do LUẬT của chính kỳ đánh giá quyết định, không do ý định của bạn.</strong> Máy tính bỏ túi được phép ở kỳ thi này và là gian lận ở kỳ thi khác; trao đổi với bạn được khuyến khích ở bài này và bị cấm ở bài kia. Hãy đọc luật của <em>TỪNG</em> đầu điểm; "em không biết" không phải lời bào chữa, nhưng rất thường là sự thật — và là thứ tránh được.</li>
<li><strong>Trường hợp riêng của SSL101c.</strong> Toàn bộ điểm môn là một bài trắc nghiệm 60 phút tại trường. Cám dỗ ở đó là những thứ kinh điển — cái điện thoại, mảnh giấy, màn hình người bên cạnh — và cái giá khi bị bắt không phải điểm thấp hơn mà là MẤT MÔN. Không có đầu điểm quá trình nào để đỡ.</li>
<li><strong>Lựa chọn trung thực khi chưa kịp ôn.</strong> Cứ thi, được bao nhiêu chịu bấy nhiêu, rồi học lại/thi lại. Thi lại tốn thời gian và tiền. Một hồ sơ kỷ luật tốn cả hai cộng thêm uy tín, và nó không hết hạn khi kỳ học kết thúc.</li>
</ul>
<p class="meo">💡 Mẹo cho đề thi: <strong>cheating = phá 3 giá trị (Trung thực, Công bằng, Tôn trọng)</strong>; <strong>facilitation = phá đủ 5</strong>. Câu hỏi "dạng vi phạm nào phá vỡ MỌI giá trị trung tâm?" có đáp án là TIẾP TAY, không phải gian lận.</p>`],

      [22, 'Facilitation of Academic Misconduct — dishonest, untrustworthy, unfair, disrespectful, irresponsible',
        `<p class="y-chinh">🎯 The parallel slide for <strong>facilitation</strong>, and the contrast with slide 21 is the point: facilitation is <strong>Dishonest · Untrustworthy · Unfair · Disrespectful · Irresponsible</strong> — <strong>all five</strong> central values broken, two more than cheating.</p>
<table>
<tr><th></th><th>Cheating (slide 21)</th><th>Facilitation (slide 22)</th></tr>
<tr><td>Dishonest</td><td>✔</td><td>✔</td></tr>
<tr><td>Untrustworthy</td><td>—</td><td><strong>✔</strong></td></tr>
<tr><td>Unfair</td><td>✔</td><td>✔</td></tr>
<tr><td>Disrespectful</td><td>✔</td><td>✔</td></tr>
<tr><td>Irresponsible</td><td>—</td><td><strong>✔</strong></td></tr>
<tr><td><strong>Total</strong></td><td>3 of 5</td><td><strong>5 of 5</strong></td></tr>
</table>
<ul>
<li><strong>Why facilitation scores worse than cheating on the values.</strong> The two extra breaches are the informative ones. <em>Untrustworthy</em>: the helper was trusted with something (a file, access, a position) and used that trust to damage the system. <em>Irresponsible</em>: they took an action whose consequences fall on somebody else — the person they "helped" now carries a misconduct record too.</li>
<li><strong>The "I was just being kind" defence, examined.</strong> Facilitation almost always comes from friendship, not malice — which is exactly why it is dangerous. Helping a friend cheat sets them up to be caught, denies them the learning, and exposes both of you. It is help that harms.</li>
<li><strong>Where the line actually is at FPTU.</strong> Explaining a concept until your friend understands it: fine, and it is the collective enterprise of slide 8. Debugging together on a whiteboard: usually fine — check the brief. Sending your source file or your report before the deadline: facilitation, regardless of what they promise to do with it. If in doubt, teach the method, never hand over the artefact.</li>
<li><strong>Group projects need an explicit line.</strong> Collaboration is required; identical individual submissions are not collaboration. Agree in the first meeting what is shared (design, decisions, test data) and what each person must write alone, and write it down in your team charter.</li>
<li><strong>The practical rule that survives pressure.</strong> Never send a file you would not be willing to have both names on. That single rule removes almost every facilitation case, including the ones that happen at 1am out of tiredness rather than intent.</li>
</ul>
<p class="dap-an">✅ Question: a classmate asks for your completed assignment "only to see the format". What do you do? <strong>Send them the assignment brief, a published example, or a blank template — never your submitted file.</strong> If they later copy it, the five value-breaches on this slide are yours as well as theirs.</p>
<p class="pitfall">⚠️ Exam-trap pair: cheating breaks <strong>three</strong> values, facilitation breaks <strong>five</strong>. The two extra ones are <em>Untrustworthy</em> and <em>Irresponsible</em>. If you remember one numerical fact from the integrity block, make it this one.</p>`,
        `<p class="y-chinh">🎯 Slide song song dành cho <strong>tiếp tay (facilitation)</strong>, và sự tương phản với slide 21 chính là điểm mấu chốt: tiếp tay là <strong>Dishonest · Untrustworthy · Unfair · Disrespectful · Irresponsible</strong> — phá vỡ <strong>CẢ NĂM</strong> giá trị trung tâm, nhiều hơn gian lận hai cái.</p>
<table>
<tr><th></th><th>Cheating (slide 21)</th><th>Facilitation (slide 22)</th></tr>
<tr><td>Bất trung thực</td><td>✔</td><td>✔</td></tr>
<tr><td>Không đáng tin cậy</td><td>—</td><td><strong>✔</strong></td></tr>
<tr><td>Bất công</td><td>✔</td><td>✔</td></tr>
<tr><td>Thiếu tôn trọng</td><td>✔</td><td>✔</td></tr>
<tr><td>Vô trách nhiệm</td><td>—</td><td><strong>✔</strong></td></tr>
<tr><td><strong>Tổng</strong></td><td>3/5</td><td><strong>5/5</strong></td></tr>
</table>
<ul>
<li><strong>Vì sao tiếp tay bị chấm nặng hơn gian lận trên thang giá trị.</strong> Hai vi phạm thêm mới là phần có thông tin. <em>Không đáng tin cậy</em>: người giúp đã được giao một thứ gì đó (file, quyền truy cập, một vị trí) và dùng chính sự tin cậy ấy để làm hỏng hệ thống. <em>Vô trách nhiệm</em>: họ làm một việc mà hậu quả rơi lên ĐẦU NGƯỜI KHÁC — người được "giúp" giờ cũng mang một hồ sơ vi phạm.</li>
<li><strong>Soi kỹ lời bào chữa "em chỉ tốt bụng thôi".</strong> Tiếp tay gần như luôn xuất phát từ tình bạn chứ không phải ác ý — và đó đúng là lý do nó nguy hiểm. Giúp bạn gian lận là dọn đường cho bạn ấy bị bắt, tước của bạn ấy phần học được, và phơi cả hai ra. Đó là kiểu giúp gây hại.</li>
<li><strong>Ranh giới thật sự nằm ở đâu tại FPTU.</strong> Giải thích một khái niệm cho tới khi bạn mình hiểu: được, và đó chính là sự nghiệp tập thể ở slide 8. Cùng nhau dò lỗi trên bảng: thường là được — kiểm lại đề bài. Gửi file mã nguồn hay bản báo cáo của mình trước hạn nộp: TIẾP TAY, bất kể họ hứa sẽ làm gì với nó. Phân vân thì hãy DẠY CÁCH LÀM, đừng bao giờ trao SẢN PHẨM.</li>
<li><strong>Đồ án nhóm cần một ranh giới được nói ra.</strong> Hợp tác là bắt buộc; nộp bài cá nhân giống hệt nhau thì không phải hợp tác. Ngay buổi họp đầu hãy thống nhất cái gì dùng chung (thiết kế, quyết định, dữ liệu kiểm thử) và phần nào mỗi người phải tự viết, rồi ghi vào biên bản nhóm.</li>
<li><strong>Quy tắc thực dụng sống sót được dưới áp lực.</strong> Đừng bao giờ gửi đi một file mà bạn không sẵn lòng để cả hai cái tên cùng đứng trên đó. Chỉ một quy tắc ấy đã dọn sạch gần như mọi ca tiếp tay, kể cả những ca xảy ra lúc 1 giờ sáng vì mệt chứ không phải vì cố ý.</li>
</ul>
<p class="dap-an">✅ Câu hỏi: một bạn cùng lớp xin bài tập đã hoàn thành của bạn "chỉ để xem cái format thôi". Bạn làm gì? <strong>Gửi cho bạn ấy ĐỀ BÀI, một ví dụ đã công bố, hoặc một biểu mẫu trống — tuyệt đối không gửi file bài nộp của bạn.</strong> Nếu sau đó bạn ấy chép, năm vi phạm giá trị trên slide này là của BẠN chứ không riêng của bạn ấy.</p>
<p class="pitfall">⚠️ Cặp bẫy đề thi: gian lận phá <strong>BA</strong> giá trị, tiếp tay phá <strong>NĂM</strong>. Hai cái thêm vào là <em>Untrustworthy</em> và <em>Irresponsible</em>. Nếu chỉ nhớ nổi một con số từ khối liêm chính, hãy nhớ con số này.</p>`],

      [23, '2.1a The Scholarly and Cultural Record — objectives: categories of information, discipline-specific kinds, common sources',
        `<p class="y-chinh">🎯 Module 2 opens. Objective slide for lesson <strong>2.1a</strong>, three bullets: <strong>understand different categories of information · identify the kinds of information specific to different disciplines · identify common information sources for university students</strong>.</p>
<ul>
<li><strong>The subject has changed.</strong> Module 1 was about <em>you</em> — the culture you are entering, the values you are expected to hold. Module 2 is about <em>the material</em> — what information exists, how it is categorised, and where students get it. The integrity block was the bridge: you now know the rules, so you can be shown the sources.</li>
<li><strong>These same three bullets reappear on slides 25 and 26</strong> in different orders, because 2.1a, 2.1b and 2.1c are three lessons of one lesson-group sharing one set of objectives. Do not read the repetition as new content.</li>
<li><strong>"Categories of information" is the examinable phrase.</strong> Two category systems are coming: <em>Cultural Record vs Scholarly Record</em> (slide 24), and <em>Primary vs Secondary vs Tertiary sources</em> (slide 25). They are different cuts through the same material and MCQs like to mix them up.</li>
<li><strong>Why "specific to different disciplines" matters at FPTU.</strong> Evidence does not look the same everywhere. In software engineering the strongest sources are often conference papers (IEEE, ACM) and standards documents; in a business subject they are journal articles, industry reports and statistical yearbooks; in a language subject they are corpora and dictionaries. Bringing a business-style source into a technical report, or vice versa, reads as not knowing the field.</li>
<li><strong>"Common information sources for university students" is the practical bullet.</strong> Slide 27–28 answers it with three: textbooks, course notes, scholarly journal articles. Notice what is absent from that list — a general web search — and think about why.</li>
</ul>
<p class="meo">💡 Set up the map before the details: <strong>slide 24 splits information into two RECORDS; slide 25 splits sources into three LEVELS; slide 26 says both vary by discipline; slide 27–28 names the three everyday sources.</strong> Four slides, four distinct ideas.</p>`,
        `<p class="y-chinh">🎯 Module 2 mở ra. Slide mục tiêu của bài <strong>2.1a</strong>, ba gạch đầu dòng: <strong>hiểu các loại thông tin khác nhau · nhận diện các kiểu thông tin ĐẶC THÙ cho từng ngành · nhận diện các nguồn thông tin phổ biến của sinh viên đại học</strong>.</p>
<ul>
<li><strong>Chủ đề đã đổi.</strong> Module 1 nói về <em>BẠN</em> — nền văn hoá bạn đang bước vào, các giá trị bạn được kỳ vọng nắm giữ. Module 2 nói về <em>VẬT LIỆU</em> — thông tin gồm những gì, phân loại ra sao, và sinh viên lấy nó ở đâu. Khối liêm chính là cây cầu: giờ bạn đã biết luật, nên mới được chỉ cho các nguồn.</li>
<li><strong>Đúng ba gạch đầu dòng này lặp lại ở slide 25 và 26</strong> với thứ tự khác nhau, vì 2.1a, 2.1b và 2.1c là ba bài trong cùng một cụm dùng chung một bộ mục tiêu. Đừng đọc cú lặp như nội dung mới.</li>
<li><strong>"Categories of information" là cụm sẽ bị hỏi.</strong> Sắp có HAI hệ phân loại: <em>Cultural Record so với Scholarly Record</em> (slide 24), và <em>nguồn Sơ cấp / Thứ cấp / Tam cấp</em> (slide 25). Đó là hai lát cắt KHÁC NHAU trên cùng khối vật liệu, và đề trắc nghiệm rất thích trộn lẫn hai cái.</li>
<li><strong>Vì sao "đặc thù theo ngành" quan trọng ở FPTU.</strong> Bằng chứng không giống nhau ở mọi nơi. Trong kỹ thuật phần mềm, nguồn mạnh nhất thường là bài hội nghị (IEEE, ACM) và tài liệu tiêu chuẩn; trong một môn kinh doanh thì là bài tạp chí, báo cáo ngành và niên giám thống kê; trong một môn ngôn ngữ thì là kho ngữ liệu và từ điển. Mang một nguồn kiểu kinh doanh vào báo cáo kỹ thuật, hay ngược lại, đọc lên là biết chưa nắm ngành.</li>
<li><strong>"Nguồn thông tin phổ biến của sinh viên" là gạch đầu dòng thực dụng nhất.</strong> Slide 27–28 trả lời bằng ba cái: giáo trình, ghi chép/tài liệu môn học, và bài báo khoa học. Để ý thứ VẮNG MẶT trong danh sách đó — tìm kiếm web chung chung — và nghĩ xem vì sao.</li>
</ul>
<p class="meo">💡 Dựng bản đồ trước khi vào chi tiết: <strong>slide 24 chia thông tin thành HAI LOẠI HỒ SƠ; slide 25 chia nguồn thành BA CẤP; slide 26 nói cả hai đều thay đổi theo ngành; slide 27–28 gọi tên BA nguồn hằng ngày.</strong> Bốn slide, bốn ý riêng biệt.</p>`],

      [24, 'Summary: The Scholarly and Cultural Record — Information ≠ Knowledge, and the two kinds of information at university',
        `<p class="y-chinh">🎯 <strong>A dense, highly examinable summary slide.</strong> Three claims: <strong>Information ≠ Knowledge · Knowledge is your understanding of information · At university there are two kinds of information — the Cultural Record and the Scholarly Record</strong> (Adapted from: Schiltz et al., 2007; Koltay et al., 2016; Lavoie et al., 2014).</p>
<table>
<tr><th></th><th>Information</th><th>Knowledge</th></tr>
<tr><td><strong>What it is</strong></td><td>The recorded material that exists outside you</td><td>Your <em>understanding</em> of that material</td></tr>
<tr><td><strong>Where it lives</strong></td><td>In articles, books, datasets, archives</td><td>In a person</td></tr>
<tr><td><strong>Can it be transferred?</strong></td><td>Yes — copy the file</td><td>No — it must be rebuilt by each person who learns</td></tr>
<tr><td><strong>Consequence</strong></td><td>Downloading 40 PDFs gains you information</td><td>…and zero knowledge until you read and understand them</td></tr>
</table>
<table>
<tr><th></th><th>The Cultural Record</th><th>The Scholarly Record</th></tr>
<tr><td><strong>What it holds</strong></td><td>What a society produces and records about itself — its creative, journalistic, governmental and everyday output</td><td>What the research community produces and verifies — the accumulated, checked output of scholarship</td></tr>
<tr><td><strong>Examples</strong></td><td>Novels, films, newspapers, photographs, government records, letters, social media, music</td><td>Journal articles, conference papers, monographs, theses, datasets, review articles</td></tr>
<tr><td><strong>Quality control</strong></td><td>None inherent — a newspaper is not peer reviewed</td><td>Peer review, editorial process, replication, citation</td></tr>
<tr><td><strong>Typical use</strong></td><td>Often the <strong>object</strong> of study — the evidence you analyse</td><td>Often the <strong>lens</strong> — the scholarship you argue with and cite</td></tr>
</table>
<ul>
<li><strong>The Information ≠ Knowledge line is the one to carry into the exam.</strong> It sounds like a slogan; it is a definition. Knowledge is defined here as <em>your understanding of information</em> — i.e. it is personal, built, and cannot be bought or downloaded.</li>
<li><strong>The practical consequence is brutal and worth accepting early.</strong> Collecting is not learning. A folder of 40 saved articles, a phone full of lecture photos, a Drive of last year's answers — all information, no knowledge. The transformation only happens through reading, writing and explaining.</li>
<li><strong>Do not rank the two records as "serious vs unserious".</strong> A 1975 newspaper is not lesser than a 2020 article — it is a different <em>kind</em> of source used for a different purpose. Which one is appropriate depends on your question, not on prestige.</li>
<li><strong>Both records exist in a computing project.</strong> For an FPTU app about local commerce: the Scholarly Record gives you the HCI papers on checkout usability; the Cultural Record gives you the app-store reviews, the forum threads and the news coverage that show how people actually behave. A report using only one of the two is usually missing half its argument.</li>
<li><strong>Three citations on one slide is itself a demonstration.</strong> "(Adapted from: Schiltz et al., 2007; Koltay et al., 2016; Lavoie et al., 2014)" shows a synthesised idea attributed to all its sources — exactly what slide 19 asks of you.</li>
</ul>
<p class="meo">💡 Hook: <strong>information is outside you, knowledge is inside you</strong>; <strong>the Cultural Record is what society records, the Scholarly Record is what scholarship verifies.</strong></p>`,
        `<p class="y-chinh">🎯 <strong>Một slide tổng kết đặc và rất dễ ra đề.</strong> Ba khẳng định: <strong>Thông tin ≠ Tri thức · Tri thức là SỰ HIỂU của bạn về thông tin · Ở đại học có HAI loại thông tin — the Cultural Record (hồ sơ văn hoá) và the Scholarly Record (hồ sơ học thuật)</strong> (Adapted from: Schiltz et al., 2007; Koltay et al., 2016; Lavoie et al., 2014).</p>
<table>
<tr><th></th><th>Information — Thông tin</th><th>Knowledge — Tri thức</th></tr>
<tr><td><strong>Là gì</strong></td><td>Vật liệu đã được ghi lại, tồn tại BÊN NGOÀI bạn</td><td><em>SỰ HIỂU</em> của bạn về vật liệu đó</td></tr>
<tr><td><strong>Nằm ở đâu</strong></td><td>Trong bài báo, sách, tập dữ liệu, kho lưu trữ</td><td>Trong một CON NGƯỜI</td></tr>
<tr><td><strong>Chuyển giao được không?</strong></td><td>Được — chép file là xong</td><td>KHÔNG — mỗi người học phải tự dựng lại từ đầu</td></tr>
<tr><td><strong>Hệ quả</strong></td><td>Tải 40 file PDF là bạn có thêm thông tin</td><td>…và KHÔNG có thêm chút tri thức nào cho tới khi bạn đọc và hiểu chúng</td></tr>
</table>
<table>
<tr><th></th><th>The Cultural Record — hồ sơ văn hoá</th><th>The Scholarly Record — hồ sơ học thuật</th></tr>
<tr><td><strong>Chứa gì</strong></td><td>Thứ một xã hội tạo ra và ghi lại về chính nó — sản phẩm sáng tạo, báo chí, hành chính, đời sống hằng ngày</td><td>Thứ cộng đồng nghiên cứu tạo ra và kiểm chứng — sản phẩm học thuật đã tích luỹ và được soát</td></tr>
<tr><td><strong>Ví dụ</strong></td><td>Tiểu thuyết, phim, báo chí, ảnh, hồ sơ nhà nước, thư từ, mạng xã hội, âm nhạc</td><td>Bài tạp chí, bài hội nghị, chuyên khảo, luận văn, tập dữ liệu, bài tổng quan</td></tr>
<tr><td><strong>Kiểm soát chất lượng</strong></td><td>Không có sẵn — một tờ báo không được bình duyệt</td><td>Bình duyệt (peer review), quy trình biên tập, lặp lại kiểm chứng, trích dẫn</td></tr>
<tr><td><strong>Thường dùng làm gì</strong></td><td>Thường là <strong>ĐỐI TƯỢNG</strong> nghiên cứu — bằng chứng bạn đem ra phân tích</td><td>Thường là <strong>LĂNG KÍNH</strong> — phần học thuật bạn tranh luận cùng và trích dẫn</td></tr>
</table>
<ul>
<li><strong>Dòng "Thông tin ≠ Tri thức" là thứ phải mang vào phòng thi.</strong> Nghe như khẩu hiệu; nó là ĐỊNH NGHĨA. Tri thức ở đây được định nghĩa là <em>sự hiểu của BẠN về thông tin</em> — tức là nó mang tính cá nhân, phải tự dựng, và không mua hay tải về được.</li>
<li><strong>Hệ quả thực tế rất phũ và nên chấp nhận sớm.</strong> Thu gom không phải là học. Một thư mục 40 bài đã lưu, một điện thoại đầy ảnh chụp slide, một Drive đựng bài giải năm ngoái — tất cả là thông tin, không có tri thức. Cú chuyển hoá chỉ xảy ra qua ĐỌC, VIẾT và GIẢI THÍCH LẠI.</li>
<li><strong>Đừng xếp hạng hai loại hồ sơ theo kiểu "nghiêm túc / không nghiêm túc".</strong> Một tờ báo năm 1975 không hề thấp kém hơn một bài báo 2020 — nó là một <em>LOẠI</em> nguồn khác, dùng cho mục đích khác. Cái nào phù hợp là do CÂU HỎI của bạn quyết định, không do danh giá.</li>
<li><strong>Cả hai loại hồ sơ đều có mặt trong một đồ án CNTT.</strong> Với một app FPTU về thương mại địa phương: Scholarly Record cho bạn các bài HCI về tính dùng được của luồng thanh toán; Cultural Record cho bạn đánh giá trên chợ ứng dụng, các luồng thảo luận trên diễn đàn và tin tức cho thấy người ta THỰC SỰ hành xử ra sao. Báo cáo chỉ dùng một trong hai thường thiếu mất nửa lập luận.</li>
<li><strong>Ba trích dẫn trên một slide tự nó là một màn trình diễn.</strong> "(Adapted from: Schiltz et al., 2007; Koltay et al., 2016; Lavoie et al., 2014)" cho thấy một ý tổng hợp được ghi công cho TẤT CẢ nguồn của nó — đúng thứ slide 19 đòi ở bạn.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>thông tin ở NGOÀI bạn, tri thức ở TRONG bạn</strong>; <strong>Cultural Record là thứ XÃ HỘI ghi lại, Scholarly Record là thứ HỌC THUẬT kiểm chứng.</strong></p>`],

      [25, '2.1b Primary, Secondary and Tertiary Sources — objectives',
        `<p class="y-chinh">🎯 Objective slide for lesson <strong>2.1b</strong>, whose title names the second classification system of this module: <strong>Primary, Secondary and Tertiary Sources</strong>. The three objective bullets are the same as slide 23.</p>
<table>
<tr><th>Level</th><th>What it is</th><th>Examples (general)</th><th>Examples in a computing project</th></tr>
<tr><td><strong>Primary</strong></td><td>Original, first-hand material — evidence created at the time, or the raw output of research</td><td>Diaries, letters, photographs, interview transcripts, original datasets, the original research article reporting an experiment</td><td>Your own usability test logs; the original paper proposing an algorithm; the actual source code or standard</td></tr>
<tr><td><strong>Secondary</strong></td><td>Something that <em>analyses, interprets or comments on</em> primary material</td><td>Review articles, textbooks discussing research, critiques, biographies, most news analysis</td><td>A survey paper comparing ten algorithms; a textbook chapter explaining a protocol</td></tr>
<tr><td><strong>Tertiary</strong></td><td>Material that <em>compiles, indexes or summarises</em> the other two so you can find them</td><td>Encyclopaedias, dictionaries, bibliographies, indexes, databases, handbooks, Wikipedia</td><td>Wikipedia; the ACM Digital Library index; a glossary of terms</td></tr>
</table>
<ul>
<li><strong>The levels describe DISTANCE FROM THE EVENT, not quality.</strong> A primary source is not automatically better. For "what did this experiment actually find?" you need the primary paper; for "what is the state of the field?" a good secondary review saves you a month.</li>
<li><strong>The same item can change level with the question.</strong> A 1990 newspaper article is a <em>secondary</em> source about the event it reports, but a <em>primary</em> source about how the press in 1990 framed that event. This shape-shifting is a favourite MCQ topic — the level depends on your research question, not on the object alone.</li>
<li><strong>Tertiary sources are for orientation, not for citing.</strong> Wikipedia is excellent for getting the vocabulary, the key names and the references at the bottom of the page. Following those references to the primary and secondary sources is the correct move; citing Wikipedia itself in an FPTU report is not.</li>
<li><strong>How this connects to slide 24.</strong> Two different cuts: Cultural/Scholarly Record asks <em>who produced it and under what quality control</em>; Primary/Secondary/Tertiary asks <em>how far it is from the original evidence</em>. Both records contain all three levels — an encyclopaedia of film (tertiary, cultural) and a review of HCI literature (secondary, scholarly).</li>
<li><strong>Practical routine for an assignment.</strong> Start tertiary to learn the words, move to secondary to see the landscape and the debates, finish primary for the claims you will actually cite. Reverse that order and you will drown on day one.</li>
</ul>
<p class="pitfall">⚠️ Source note: the .pptx text layer of this slide still contains a leftover line, "List part of a journal article", which does not appear on the rendered slide at all — the visible slide is the 2.1b title card shown above. That leftover belongs to the journal-article activity later in the deck; it is reported here rather than silently copied.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của bài <strong>2.1b</strong>, mà tiêu đề gọi tên hệ phân loại thứ hai của module này: <strong>nguồn Sơ cấp, Thứ cấp và Tam cấp</strong>. Ba gạch đầu dòng mục tiêu y hệt slide 23.</p>
<table>
<tr><th>Cấp</th><th>Là gì</th><th>Ví dụ chung</th><th>Ví dụ trong một đồ án CNTT</th></tr>
<tr><td><strong>Primary — sơ cấp</strong></td><td>Vật liệu GỐC, trực tiếp — bằng chứng tạo ra ngay tại thời điểm đó, hoặc sản phẩm thô của nghiên cứu</td><td>Nhật ký, thư từ, ảnh, bản gỡ băng phỏng vấn, tập dữ liệu gốc, chính bài báo gốc công bố một thí nghiệm</td><td>Nhật ký phiên kiểm thử người dùng do bạn chạy; bài báo gốc đề xuất một thuật toán; chính mã nguồn hoặc văn bản tiêu chuẩn</td></tr>
<tr><td><strong>Secondary — thứ cấp</strong></td><td>Thứ <em>PHÂN TÍCH, DIỄN GIẢI hoặc BÌNH LUẬN</em> về vật liệu sơ cấp</td><td>Bài tổng quan, giáo trình bàn về nghiên cứu, bài phê bình, tiểu sử, phần lớn bài phân tích thời sự</td><td>Một bài khảo sát so sánh mười thuật toán; một chương giáo trình giải thích một giao thức</td></tr>
<tr><td><strong>Tertiary — tam cấp</strong></td><td>Vật liệu <em>TẬP HỢP, LẬP CHỈ MỤC hoặc TÓM LƯỢC</em> hai loại kia để bạn TÌM ra chúng</td><td>Bách khoa thư, từ điển, thư mục, chỉ mục, cơ sở dữ liệu, sổ tay, Wikipedia</td><td>Wikipedia; chỉ mục của ACM Digital Library; một bảng thuật ngữ</td></tr>
</table>
<ul>
<li><strong>Ba cấp mô tả KHOẢNG CÁCH TỚI SỰ KIỆN, không phải CHẤT LƯỢNG.</strong> Nguồn sơ cấp không tự động tốt hơn. Muốn biết "thí nghiệm đó thật sự tìm ra gì?" thì cần bài gốc; muốn biết "cả lĩnh vực đang đứng ở đâu?" thì một bài tổng quan thứ cấp tốt tiết kiệm cho bạn cả tháng.</li>
<li><strong>Cùng một tài liệu có thể ĐỔI CẤP theo câu hỏi.</strong> Một bài báo năm 1990 là nguồn <em>thứ cấp</em> về sự kiện nó tường thuật, nhưng là nguồn <em>sơ cấp</em> về cách báo chí năm 1990 khung hoá sự kiện đó. Đặc tính biến hình này là chủ đề ưa thích của đề trắc nghiệm — cấp phụ thuộc vào CÂU HỎI nghiên cứu của bạn, không phải vào riêng vật thể đó.</li>
<li><strong>Nguồn tam cấp để ĐỊNH HƯỚNG, không để TRÍCH DẪN.</strong> Wikipedia tuyệt vời cho việc lấy đúng từ vựng, các tên tuổi then chốt và danh mục tài liệu ở cuối trang. Lần theo các tài liệu đó về tới nguồn sơ cấp và thứ cấp mới là nước đi đúng; còn trích dẫn chính Wikipedia trong một báo cáo ở FPTU thì không.</li>
<li><strong>Nó nối với slide 24 thế nào.</strong> Hai lát cắt khác nhau: Cultural/Scholarly hỏi <em>AI tạo ra và có kiểm soát chất lượng gì</em>; Primary/Secondary/Tertiary hỏi <em>nó cách bằng chứng gốc bao xa</em>. Cả hai loại hồ sơ đều chứa đủ ba cấp — một bách khoa thư về điện ảnh (tam cấp, văn hoá) và một bài tổng quan tài liệu HCI (thứ cấp, học thuật).</li>
<li><strong>Quy trình thực dụng cho một bài tập.</strong> Bắt đầu ở TAM CẤP để học từ vựng, chuyển sang THỨ CẤP để thấy địa hình và các tranh luận, kết ở SƠ CẤP cho những khẳng định bạn sẽ thật sự trích. Làm ngược thứ tự đó thì ngày đầu tiên đã chết đuối.</li>
</ul>
<p class="pitfall">⚠️ Ghi chú về nguồn: lớp text của .pptx ở slide này còn sót một dòng "List part of a journal article", trong khi ẢNH slide hoàn toàn không có dòng đó — slide nhìn thấy được chính là tấm bìa 2.1b ở trên. Dòng sót đó thuộc về hoạt động "các phần của một bài báo khoa học" ở phía sau deck; nêu ra ở đây thay vì chép im lặng.</p>`],

      [26, '2.1c Discipline Specific Information — objectives',
        `<p class="y-chinh">🎯 Objective slide for lesson <strong>2.1c</strong>, with the same two bullets in reversed order: <strong>identify common information sources for university students</strong>, and <strong>identify the kinds of information specific to different disciplines</strong>. The lesson's point is that <em>what counts as good evidence depends on the discipline</em>.</p>
<table>
<tr><th>Discipline</th><th>Where the field's best evidence lives</th><th>What "current" means there</th></tr>
<tr><td><strong>Software engineering / CS</strong></td><td>Conference proceedings (IEEE, ACM), standards (RFC, ISO), technical documentation, some journals</td><td>Very short — a 6-year-old framework comparison may be obsolete</td></tr>
<tr><td><strong>Business / management</strong></td><td>Journal articles, industry and consultancy reports, statistical yearbooks, company filings</td><td>Medium — theory ages slowly, market data ages fast</td></tr>
<tr><td><strong>Law</strong></td><td>Legislation, case reports, official gazettes, commentary</td><td>Binary — a repealed provision is not "old", it is void</td></tr>
<tr><td><strong>Humanities / languages</strong></td><td>Monographs, primary texts, corpora, dictionaries, archives</td><td>Long — a 1960s monograph can still be the standard work</td></tr>
<tr><td><strong>Health / life sciences</strong></td><td>Peer-reviewed journals, systematic reviews, clinical trial registries</td><td>Short, and hierarchy-driven — a systematic review outranks a single study</td></tr>
</table>
<ul>
<li><strong>The exam-relevant generalisation.</strong> Different disciplines produce, value and date information differently. A source type that is authoritative in one field can be marginal in another — which is why "identify the kinds of information specific to different disciplines" is an objective in its own right.</li>
<li><strong>Note the reversal of the CS field specifically.</strong> In most disciplines the journal article is the gold standard and conferences are secondary. In computer science it is often the opposite: top-tier conferences (with full peer review) are where new work appears first and carries the most weight. If you cite CS work as though it were a life-sciences field, you will look at the wrong venues.</li>
<li><strong>Currency is discipline-relative, and this is where students go wrong.</strong> "Only use sources from the last 5 years" is good advice for a framework comparison and bad advice for a definition, a classic algorithm or a foundational theory. The original paper on a technique stays citable forever.</li>
<li><strong>How to find your discipline's norms without asking.</strong> Open two or three recent papers in your area and read their reference lists: what venues do they cite, how old are the references, what proportion are conferences vs journals vs standards? That is the field's answer, written down, and it takes fifteen minutes.</li>
<li><strong>At FPTU this is concrete.</strong> An SWP391 or capstone report that cites only blog posts and a YouTube tutorial will be marked down not for dishonesty but for not knowing where its own field keeps its evidence. The FPTU library's database access is the intended route.</li>
</ul>
<p class="meo">💡 Hook: <strong>ask not "is this a good source?" but "is this a good source IN THIS FIELD, for THIS question?"</strong> Both qualifiers are required.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của bài <strong>2.1c</strong>, vẫn hai gạch đầu dòng cũ nhưng đảo thứ tự: <strong>nhận diện các nguồn thông tin phổ biến của sinh viên đại học</strong>, và <strong>nhận diện các kiểu thông tin đặc thù cho từng ngành</strong>. Ý của bài là: <em>cái gì được tính là bằng chứng tốt phụ thuộc vào NGÀNH</em>.</p>
<table>
<tr><th>Ngành</th><th>Bằng chứng tốt nhất của ngành nằm ở đâu</th><th>"Cập nhật" ở đó nghĩa là gì</th></tr>
<tr><td><strong>Kỹ thuật phần mềm / CNTT</strong></td><td>Kỷ yếu hội nghị (IEEE, ACM), tiêu chuẩn (RFC, ISO), tài liệu kỹ thuật, một số tạp chí</td><td>Rất ngắn — một bài so sánh framework 6 năm tuổi có thể đã lỗi thời</td></tr>
<tr><td><strong>Kinh doanh / quản trị</strong></td><td>Bài tạp chí, báo cáo ngành và báo cáo tư vấn, niên giám thống kê, hồ sơ doanh nghiệp</td><td>Vừa — lý thuyết già chậm, số liệu thị trường già rất nhanh</td></tr>
<tr><td><strong>Luật</strong></td><td>Văn bản pháp luật, bản án, công báo, bình luận khoa học</td><td>Nhị phân — một điều khoản đã bãi bỏ không phải "cũ", nó VÔ HIỆU</td></tr>
<tr><td><strong>Khoa học xã hội / ngôn ngữ</strong></td><td>Chuyên khảo, văn bản gốc, kho ngữ liệu, từ điển, kho lưu trữ</td><td>Dài — một chuyên khảo thập niên 1960 vẫn có thể là công trình chuẩn</td></tr>
<tr><td><strong>Y – sinh</strong></td><td>Tạp chí bình duyệt, tổng quan hệ thống, đăng ký thử nghiệm lâm sàng</td><td>Ngắn, và theo THỨ BẬC — một tổng quan hệ thống đứng trên một nghiên cứu đơn lẻ</td></tr>
</table>
<ul>
<li><strong>Điều khái quát đáng nhớ để thi.</strong> Các ngành khác nhau SẢN XUẤT, ĐỊNH GIÁ và LÀM CŨ thông tin theo cách khác nhau. Một loại nguồn có thẩm quyền ở ngành này có thể bên lề ở ngành khác — đó là lý do "nhận diện kiểu thông tin đặc thù theo ngành" được đặt thành một mục tiêu riêng.</li>
<li><strong>Để ý ngành CNTT bị ĐẢO NGƯỢC.</strong> Ở phần lớn ngành, bài tạp chí là chuẩn vàng còn hội nghị là thứ yếu. Trong khoa học máy tính thì thường ngược lại: các hội nghị hàng đầu (có bình duyệt đầy đủ) là nơi công trình mới xuất hiện trước và có sức nặng nhất. Trích dẫn công trình CNTT như thể đó là ngành y sinh thì bạn sẽ đi tìm nhầm chỗ.</li>
<li><strong>Tính cập nhật là tương đối theo ngành, và đây là chỗ sinh viên hay sai.</strong> "Chỉ dùng nguồn trong 5 năm gần đây" là lời khuyên TỐT cho một bài so sánh framework và TỆ cho một định nghĩa, một thuật toán kinh điển hay một lý thuyết nền. Bài báo gốc của một kỹ thuật thì trích dẫn được mãi mãi.</li>
<li><strong>Cách tự tìm ra chuẩn mực của ngành mình mà không cần hỏi ai.</strong> Mở hai ba bài báo gần đây trong lĩnh vực của bạn và ĐỌC DANH MỤC TÀI LIỆU của họ: họ trích những hội nghị/tạp chí nào, tài liệu cũ bao nhiêu năm, tỉ lệ hội nghị so với tạp chí so với tiêu chuẩn là bao nhiêu? Đó chính là câu trả lời của ngành, đã viết sẵn ra giấy, và mất mười lăm phút.</li>
<li><strong>Ở FPTU chuyện này rất cụ thể.</strong> Một báo cáo SWP391 hay đồ án tốt nghiệp chỉ trích blog và một video YouTube sẽ bị trừ điểm — không phải vì thiếu trung thực mà vì không biết ngành của chính mình cất bằng chứng ở đâu. Quyền truy cập cơ sở dữ liệu qua thư viện FPTU chính là con đường được thiết kế sẵn cho bạn.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>đừng hỏi "nguồn này có tốt không?" mà hỏi "nguồn này có tốt TRONG NGÀNH NÀY, cho CÂU HỎI NÀY không?"</strong> Cần đủ cả hai vế bổ nghĩa.</p>`],

      [27, '2.2a Common information sources at University — kinds of information used in courses, and the characteristics of journal articles',
        `<p class="y-chinh">🎯 Objective slide for lesson <strong>2.2a</strong>, and it narrows the focus for the rest of the module: <strong>understand the different kinds of information used in university courses</strong>, and <strong>understand the characteristics of journal articles</strong>.</p>
<ul>
<li><strong>The second bullet is the one that earns the most marks later.</strong> The whole rest of Mooc 1 module 2 is about the scholarly journal article: what it is, why it is peer reviewed, and what its parts are (abstract, introduction, method, results, discussion, conclusion, references). Everything after this slide builds on it.</li>
<li><strong>The answer to bullet 1 is on the very next slide</strong> (slide 28, outside this lesson's range): information at university comes in many types, varies between fields and between subjects within a field, and there are <strong>three main types common to all fields — textbooks, course notes, and scholarly journal articles</strong>. This slide is the door; that is the room.</li>
<li><strong>Why the journal article gets special treatment.</strong> Of the three common types, it is the only one that is <em>peer reviewed</em> — checked by independent experts before publication. Textbooks are edited and course notes are your lecturer's synthesis; only the journal article carries the community's formal quality control. That is why it anchors the Scholarly Record of slide 24.</li>
<li><strong>Know the parts before you need them.</strong> Read a research paper in this order, not front to back: <em>abstract</em> (is this relevant at all?) → <em>conclusion</em> (what did they find?) → <em>method</em> (do I believe how they found it?) → <em>results</em> → the rest only if it is still worth it. That is the "select information" step of slide 13 applied to a single paper, and it is the single most time-saving habit in this MOOC.</li>
<li><strong>FPTU application, immediately.</strong> For your next report, get one real journal or conference paper through the library, apply the reading order above, and cite it properly. One properly used scholarly source changes how a report reads more than ten blog links.</li>
<li><strong>Where this lesson stops.</strong> Slide 27 is the end of this walkthrough's range; slides 28 onwards (Information at University, then the anatomy of a journal article and the activity "list the parts of a journal article") continue in the next lesson of this series.</li>
</ul>
<p class="meo">💡 Closing hook for slides 1–27, in one line: <strong>academic culture gives you the values → information literacy gives you the seven steps → integrity gives you the five values and five violations → the scholarly record gives you the material, of which the peer-reviewed journal article is the gold standard.</strong></p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của bài <strong>2.2a</strong>, và nó thu hẹp tiêu điểm cho cả phần còn lại của module: <strong>hiểu các loại thông tin khác nhau được dùng trong các môn học ở đại học</strong>, và <strong>hiểu các đặc điểm của bài báo khoa học (journal article)</strong>.</p>
<ul>
<li><strong>Gạch đầu dòng thứ hai mới là thứ về sau ăn nhiều điểm nhất.</strong> Toàn bộ phần còn lại của module 2 Mooc 1 nói về bài báo khoa học: nó là gì, vì sao được bình duyệt, và gồm những phần nào (abstract, introduction, method, results, discussion, conclusion, references). Mọi thứ sau slide này đều xây trên đó.</li>
<li><strong>Câu trả lời cho gạch đầu dòng thứ nhất nằm ngay ở slide kế tiếp</strong> (slide 28, ngoài phạm vi bài này): thông tin ở đại học có rất nhiều loại, thay đổi giữa các ngành và giữa các môn trong cùng một ngành, và có <strong>BA loại chính chung cho mọi ngành — giáo trình (textbooks), tài liệu/ghi chép môn học (course notes), và bài báo khoa học (scholarly journal articles)</strong>. Slide này là cái cửa; slide kia là căn phòng.</li>
<li><strong>Vì sao bài báo khoa học được đối xử đặc biệt.</strong> Trong ba loại phổ biến, nó là loại DUY NHẤT được <em>bình duyệt</em> — chuyên gia độc lập soát trước khi công bố. Giáo trình thì được biên tập, tài liệu môn học là bản tổng hợp của chính giảng viên bạn; chỉ bài báo khoa học mang theo cơ chế kiểm soát chất lượng CHÍNH THỨC của cộng đồng. Đó là lý do nó neo giữ cái Scholarly Record ở slide 24.</li>
<li><strong>Biết các phần TRƯỚC khi cần tới chúng.</strong> Hãy đọc một bài nghiên cứu theo thứ tự này, đừng đọc từ đầu tới cuối: <em>abstract</em> (bài này có liên quan gì không?) → <em>conclusion</em> (họ tìm ra gì?) → <em>method</em> (mình có tin cách họ tìm ra không?) → <em>results</em> → phần còn lại chỉ đọc nếu vẫn đáng. Đó chính là bước "chọn lọc thông tin" của slide 13 áp lên một bài báo đơn lẻ, và là thói quen tiết kiệm thời gian nhất trong cả MOOC này.</li>
<li><strong>Áp dụng ở FPTU, ngay lập tức.</strong> Cho báo cáo sắp tới, hãy lấy MỘT bài tạp chí hoặc hội nghị thật qua thư viện, áp dụng đúng thứ tự đọc ở trên, và trích dẫn cho đúng chuẩn. Một nguồn học thuật dùng đúng cách thay đổi cách bài báo cáo của bạn được đọc nhiều hơn mười cái link blog.</li>
<li><strong>Bài giảng này dừng ở đâu.</strong> Slide 27 là điểm cuối của phạm vi bài này; từ slide 28 trở đi (Information at University, rồi giải phẫu một bài báo khoa học và hoạt động "liệt kê các phần của một bài báo") sẽ tiếp tục ở bài kế của loạt này.</li>
</ul>
<p class="meo">💡 Câu chốt cho slide 1–27, gói trong một dòng: <strong>văn hoá học thuật cho bạn CÁC GIÁ TRỊ → năng lực thông tin cho bạn BẢY BƯỚC → liêm chính cho bạn NĂM GIÁ TRỊ và NĂM DẠNG VI PHẠM → hồ sơ học thuật cho bạn VẬT LIỆU, trong đó bài báo khoa học đã bình duyệt là chuẩn vàng.</strong></p>`],

    ]),
  ].join('\n'),
};
