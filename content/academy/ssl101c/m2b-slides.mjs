/**
 * SSL101c · Mooc 2 (deck 'ssl2') — slide 26–51, học theo từng slide.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). File /tmp/ssl101c-text/ssl2.txt gần như RỖNG — không dùng được. Toàn bộ
 * 26 slide trong dải này đã được ĐỌC THẲNG TỪ ẢNH
 * (/tmp/ssl101c-slides/ssl2/026.webp … 051.webp), từng chữ một.
 *
 * Nội dung THẬT của dải 26–51 (KHÁC hẳn phỏng đoán ban đầu "sinh ý tưởng &
 * đánh giá phương án" — dải này là phần MÔ HÌNH + HIỂU ĐỀ BÀI):
 *   26–29  Khép mục 2.4a: ba mô hình giải quyết vấn đề (Dewey 5 bước ·
 *          Liedtka & Ogilvie 4 chữ W · Summary 4 bước U-S-E-E)
 *   30–31  2.4b The Problem-Solving Process — 3 mục tiêu + danh sách 4 mục
 *   32–36  3.1a Understanding the Problem — chiến lược, "real problem",
 *          truyện con gấu xám, slide tóm tắt
 *   37–41  3.1b Strategies… + 3.1c Check your marking criteria + rubric thật
 *   42–48  3.2a Starting With What You Know — de Bono, Whimbey & Lochhead
 *   49–51  3.3a Using Specialised Knowledge — "Experts can", 5 nguồn ngoài
 *
 * ⚠️ BA CẶP DỄ LẪN trong chính bộ slide này, đã nêu rõ trong bài:
 *   · slide 27 và 28 CÙNG tiêu đề "Liedtka & Ogilvie's Design Thinking
 *     Process" — 27 chỉ in 4 cái tên, 28 in kèm định nghĩa.
 *   · slide 29 "Summary: Problem Solving Process" và slide 31 "The
 *     Problem-Solving Process" là HAI DANH SÁCH BỐN MỤC KHÁC NHAU.
 *   · slide 32 (3.1a) và slide 37 (3.1b) in ĐÚNG BỐN BULLET Y HỆT nhau dù
 *     mang hai số hiệu mục khác nhau.
 *
 * ⚠️ Slide 40/41 dùng TEMPLATE KHÁC (bảng rubric trắng-hồng, font khác) — đây
 * là rubric thật của một assignment ngành sư phạm, chèn vào làm ví dụ. Slide 41
 * là bản phóng to chỉ còn tiêu chí thứ nhất; bộ slide KHÔNG có bản phóng to
 * tương ứng cho tiêu chí thứ hai.
 *
 * Ma trận quyết định có trọng số (slide 28) và bộ ý tưởng brainstorm/mind map
 * (slide 44) là PHẦN MỞ RỘNG do bài này dựng thêm cho một tình huống FPTU thật,
 * KHÔNG in trên slide — đã nói rõ ngay tại chỗ.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl2';

export default {
  title: '2.0b — Slide by slide: Problem-solving models, understanding the problem, and starting with what you know (slides 26–51)|||2.0b — Slide bài giảng: Các mô hình giải quyết vấn đề, hiểu đúng đề bài & bắt đầu từ cái mình đã biết (slide 26–51)',
  slug: 'ssl101c-2-0b-slides-mo-hinh-hieu-van-de-bat-dau-tu-cai-da-biet',
  type: 'DOCUMENT',
  description: 'Học theo từng slide 26 slide giữa của Mooc 2 (slide 26–51). Đi từ ba mô hình giải quyết vấn đề dễ lẫn nhau (Dewey 5 bước · Liedtka & Ogilvie bốn chữ W · Understand-Strategise-Execute-Evaluate), qua mục 2.4b và 3.1 về việc HIỂU ĐÚNG đề bài — bốn chiến lược hình dung vấn đề, truyện con gấu xám dạy cách tìm "vấn đề thật", và việc đọc marking rubric như một phần của hiểu đề — rồi tới 3.2a "bắt đầu từ cái mình đã biết" (mind map, concept map, brainstorming, đoán có căn cứ) và 3.3a kiến thức chuyên ngành: chuyên gia làm được bốn việc gì, và năm loại nguồn ngoài được phép mượn. Có ma trận quyết định có trọng số và bộ ý tưởng brainstorm chạy trọn vẹn trên một tình huống SWP391 thật.',
  content: [
    walkHead(D, 26, 51,
      'These 26 slides close the "models" part of Mooc 2 and open the real engine of the module: understanding a problem before touching it, and starting from what you already know.',
      'Đây là 26 slide khép lại phần "mô hình" của Mooc 2 và mở ra phần lõi thật sự: hiểu vấn đề TRƯỚC KHI động vào nó, và bắt đầu từ chính cái bạn đã biết.'),
    walk(D, [

      [26, "Dewey's Reflective Thinking Process",
        `<p class="y-chinh">🎯 The first of three competing models in this deck, and the only one with <strong>FIVE</strong> steps: John Dewey's reflective thinking process, cited from <em>Dewey, 1910, p. 72</em> (see also Beebe &amp; Masterson, 2015, p. 271).</p>
<table>
<tr><th>#</th><th>The slide's exact wording</th><th>What it actually asks you to do</th></tr>
<tr><td>1</td><td>Identify the "felt difficulty or concern"</td><td>Notice that something is wrong — before you can name it. Dewey starts with a <em>feeling</em>, not a definition</td></tr>
<tr><td>2</td><td>Think about the "location and definition" of the problem</td><td>WHERE is it, and WHAT exactly is it? Two questions, one step</td></tr>
<tr><td>3</td><td>Ask what the possible solutions to the felt difficulty are</td><td>Generate options — plural. This is the divergent step</td></tr>
<tr><td>4</td><td>Decide what the logical reasons to support that solution are</td><td>Justify the chosen option with reasoning, not preference</td></tr>
<tr><td>5</td><td>Determine what additional testing and observation need to be done to confirm the validity of the solution</td><td>Test it. A solution you have not checked is still a hypothesis</td></tr>
</table>
<ul>
<li><strong>Why Dewey begins with a feeling.</strong> Most real problems announce themselves as discomfort long before anyone can state them: the group chat goes quiet, a deadline "feels" tight. Dewey treats that unease as legitimate data — step 1 is to <em>admit</em> it, not to solve it.</li>
<li><strong>Step 2 is the whole reason this model is famous.</strong> "Location AND definition" separates two things students merge: <em>where</em> the trouble sits (which person, which module, which week) and <em>what</em> it is. Mislocate it and every later step aims at the wrong target.</li>
<li><strong>Steps 4 and 5 are two different kinds of checking.</strong> Step 4 is checking by <em>reasoning</em> (does the logic hold?); step 5 is checking by <em>evidence</em> (does it work when tried?). An answer that passes step 4 but never reaches step 5 is an opinion.</li>
<li><strong>Applied at FPTU.</strong> Your SWP391 group is two weeks behind and one member has not submitted their part. Step 1: the felt difficulty is "we will not make the deadline". Step 2: located in the integration module, defined as "the auth API was never written, so three other tasks are blocked" — which is a very different problem from "one member is lazy". Step 3: reassign / cut scope / escalate to the supervisor. Step 4: the reasons — reassigning costs 3 people 2 nights, escalating costs nothing and buys an official extension. Step 5: test by asking the supervisor this week, not by hoping.</li>
<li><strong>It is a 1910 model and it still wins.</strong> Every later process on the next slides is a rewording of these five moves. Learn Dewey properly and the other two cost you five minutes each.</li>
</ul>
<p class="meo">💡 Count-the-items hook: <strong>Dewey = 5</strong>, Liedtka &amp; Ogilvie = 4, Summary = 4. Dewey is the only odd one out, and it is the only model whose steps are written as <em>quoted phrases</em> ("felt difficulty", "location and definition").</p>
<p class="pitfall">⚠️ Trap: step 3 says "possible solutions" (plural) but step 4 says "that solution" (singular) — the model silently assumes you chose one between 3 and 4. Exam options that put "choose the best solution" as a separate numbered Dewey step are wrong: there are five steps, not six.</p>`,
        `<p class="y-chinh">🎯 Cái đầu tiên trong BA mô hình cạnh tranh nhau của bộ slide này, và là mô hình DUY NHẤT có <strong>NĂM</strong> bước: quy trình tư duy phản tỉnh của John Dewey, trích từ <em>Dewey, 1910, tr. 72</em> (xem thêm Beebe &amp; Masterson, 2015, tr. 271).</p>
<table>
<tr><th>#</th><th>Nguyên văn trên slide</th><th>Thật ra nó bảo bạn làm gì</th></tr>
<tr><td>1</td><td>Identify the "felt difficulty or concern"</td><td>Nhận ra là có gì đó không ổn — TRƯỚC khi gọi được tên nó. Dewey khởi đầu bằng một CẢM GIÁC, không phải một định nghĩa</td></tr>
<tr><td>2</td><td>Think about the "location and definition" of the problem</td><td>Nó nằm Ở ĐÂU, và nó chính xác LÀ GÌ? Hai câu hỏi, gộp trong một bước</td></tr>
<tr><td>3</td><td>Ask what the possible solutions to the felt difficulty are</td><td>Sinh ra các phương án — số NHIỀU. Đây là bước phân kỳ</td></tr>
<tr><td>4</td><td>Decide what the logical reasons to support that solution are</td><td>Biện hộ cho phương án đã chọn bằng LÝ LẼ, không phải bằng sở thích</td></tr>
<tr><td>5</td><td>Determine what additional testing and observation need to be done to confirm the validity of the solution</td><td>Đem đi thử. Một giải pháp chưa kiểm chứng thì vẫn chỉ là giả thuyết</td></tr>
</table>
<ul>
<li><strong>Vì sao Dewey bắt đầu bằng một cảm giác.</strong> Phần lớn vấn đề thật xuất hiện dưới dạng khó chịu rất lâu trước khi có ai phát biểu được nó: nhóm chat im bặt, deadline "thấy" gấp. Dewey coi cảm giác bất an đó là DỮ LIỆU hợp lệ — bước 1 là THỪA NHẬN nó, chưa phải giải nó.</li>
<li><strong>Bước 2 mới là lý do mô hình này nổi tiếng.</strong> "Location AND definition" tách đôi hai thứ sinh viên hay gộp làm một: vấn đề NẰM ĐÂU (người nào, module nào, tuần nào) và vấn đề LÀ GÌ. Định vị sai thì mọi bước sau đều bắn trượt.</li>
<li><strong>Bước 4 và bước 5 là hai kiểu kiểm tra khác nhau.</strong> Bước 4 kiểm bằng LẬP LUẬN (logic có đứng vững không?); bước 5 kiểm bằng BẰNG CHỨNG (đem thử có chạy không?). Một câu trả lời qua được bước 4 mà không bao giờ tới bước 5 thì chỉ là ý kiến cá nhân.</li>
<li><strong>Áp dụng ở FPTU.</strong> Nhóm SWP391 của bạn trễ hai tuần, một thành viên không nộp phần việc. Bước 1: cảm giác khó khăn là "chúng ta sẽ không kịp hạn". Bước 2: định vị ở khâu tích hợp, định nghĩa là "API đăng nhập chưa từng được viết nên ba task khác bị chặn" — đó là vấn đề KHÁC HẲN so với "một bạn lười". Bước 3: chia lại việc / cắt phạm vi / báo giảng viên hướng dẫn. Bước 4: lý lẽ — chia lại việc tốn 3 người 2 đêm, báo giảng viên tốn 0 đồng và đổi lấy một lần gia hạn chính thức. Bước 5: kiểm bằng cách HỎI giảng viên ngay tuần này, không phải bằng cách hy vọng.</li>
<li><strong>Mô hình từ 1910 mà vẫn thắng.</strong> Mọi quy trình ở các slide sau đều là cách diễn đạt lại năm nước đi này. Học Dewey cho chắc thì hai mô hình kia mỗi cái chỉ tốn năm phút.</li>
</ul>
<p class="meo">💡 Mẹo nhớ SỐ LƯỢNG: <strong>Dewey = 5</strong>, Liedtka &amp; Ogilvie = 4, Summary = 4. Dewey là cái lẻ loi duy nhất, và cũng là mô hình duy nhất viết các bước dưới dạng CỤM TỪ ĐẶT TRONG NGOẶC KÉP ("felt difficulty", "location and definition").</p>
<p class="pitfall">⚠️ Bẫy: bước 3 nói "possible solutions" (số nhiều) nhưng bước 4 lại nói "that solution" (số ít) — mô hình ngầm giả định bạn đã CHỌN một cái giữa 3 và 4. Đáp án nào tách "chọn giải pháp tốt nhất" thành một bước riêng của Dewey là SAI: có năm bước, không phải sáu.</p>`],

      [27, "Liedtka & Ogilvie's Design Thinking Process (the four names)",
        `<p class="y-chinh">🎯 The second model, stripped to four names only: <strong>What Is · What If · What Wows · What Works</strong> (Liedtka &amp; Ogilvie, 2011). No explanations on this slide — they arrive on the next one, which carries the <em>same title</em>.</p>
<ul>
<li><strong>All four start with "What".</strong> That is the memorisation gift of this model, and it is almost certainly why the MOOC chose it. If an exam option offers "Why Is" or "How Works", it is a distractor by construction.</li>
<li><strong>The order is a shape, not a list.</strong> What Is looks backwards at reality; What If opens outwards; What Wows narrows back down; What Works commits. Wide-narrow — the classic divergent/convergent rhythm.</li>
<li><strong>Design thinking vs Dewey.</strong> Dewey is a thinking process for one mind. Design thinking came out of business and product practice, so it assumes a team, a user, and something that gets built. Same skeleton, different context.</li>
<li><strong>Why two slides for one list.</strong> The deck shows the bare names first so you try to guess the meanings, then reveals them. Treat this slide as a self-test: cover the next one and say what each W does.</li>
<li><strong>Applied at FPTU.</strong> Your SWP391 rescue: <em>What Is</em> = we are 2 weeks late and the auth API does not exist; <em>What If</em> = every option we can name; <em>What Wows</em> = the two options that actually fix it cleanly; <em>What Works</em> = the one we execute this week.</li>
</ul>
<p class="pitfall">⚠️ Slides 27 and 28 carry <strong>exactly the same title</strong>. They are not a printing error and they are not interchangeable: 27 is the bare list, 28 adds the definition after each dash. When revising, work from 28.</p>`,
        `<p class="y-chinh">🎯 Mô hình thứ hai, lược còn đúng bốn cái tên: <strong>What Is · What If · What Wows · What Works</strong> (Liedtka &amp; Ogilvie, 2011). Slide này KHÔNG giải thích gì — phần giải thích nằm ở slide kế tiếp, mà slide đó lại mang <em>đúng cùng một tiêu đề</em>.</p>
<ul>
<li><strong>Cả bốn đều bắt đầu bằng "What".</strong> Đó là món quà cho việc học thuộc, và gần như chắc chắn là lý do MOOC chọn mô hình này. Đáp án nào đưa ra "Why Is" hay "How Works" thì là nhiễu do người ra đề bịa thêm.</li>
<li><strong>Thứ tự là một HÌNH DẠNG, không phải một danh sách.</strong> What Is nhìn ngược về thực tại; What If mở toang ra; What Wows thu hẹp lại; What Works chốt. Rộng rồi hẹp — đúng nhịp phân kỳ/hội tụ kinh điển.</li>
<li><strong>Design thinking khác Dewey ở đâu.</strong> Dewey là quy trình tư duy cho MỘT cái đầu. Design thinking sinh ra từ môi trường kinh doanh và làm sản phẩm, nên nó mặc định có một ĐỘI, có NGƯỜI DÙNG, và có thứ được đem đi làm ra thật. Cùng bộ xương, khác bối cảnh.</li>
<li><strong>Vì sao một danh sách lại tốn hai slide.</strong> Bộ slide cố tình hiện tên trần trước để bạn tự đoán nghĩa, rồi mới lật đáp án. Hãy dùng slide này làm một bài tự kiểm: che slide sau lại và nói xem mỗi chữ W làm gì.</li>
<li><strong>Áp dụng ở FPTU.</strong> Cứu nhóm SWP391: <em>What Is</em> = đang trễ 2 tuần và API đăng nhập chưa tồn tại; <em>What If</em> = mọi phương án gọi tên được; <em>What Wows</em> = hai phương án thật sự xử gọn; <em>What Works</em> = cái mà tuần này bắt tay làm.</li>
</ul>
<p class="pitfall">⚠️ Slide 27 và 28 mang <strong>ĐÚNG CÙNG MỘT TIÊU ĐỀ</strong>. Đây không phải lỗi in và hai slide KHÔNG thay thế nhau được: 27 là danh sách trần, 28 thêm định nghĩa sau mỗi dấu gạch. Lúc ôn thì học từ slide 28.</p>`],

      [28, "Liedtka & Ogilvie's Design Thinking Process (with definitions)",
        `<p class="y-chinh">🎯 The same four W's, now each with the slide's own definition — and this is the version that gets examined.</p>
<table>
<tr><th>Stage</th><th>The slide's definition (verbatim)</th><th>The move</th></tr>
<tr><td><strong>What Is</strong></td><td>defining the initial state and the goal state and any block in-between in order to understand the problem</td><td>Three things, not one: start · goal · blocks</td></tr>
<tr><td><strong>What If</strong></td><td>generate as many possible solutions or alternatives as you can</td><td>Quantity first. No judging yet</td></tr>
<tr><td><strong>What Wows</strong></td><td>cull the solutions down to the ones that solve the problem in a nice, clean way</td><td>Cut. "Cull" is deliberately brutal</td></tr>
<tr><td><strong>What Works</strong></td><td>create or implement the solution</td><td>Build it. Thinking stops, doing starts</td></tr>
</table>
<p class="nhan">Beyond the slide — a weighted decision matrix for "What Wows". The deck says "cull" but never shows HOW. Here is the tool, run on the SWP391 case. First a <strong>gate</strong>: any option that breaks academic regulations is removed <em>before</em> scoring, not given a low score — so "pay someone outside to write it" never enters the table.</p>
<table>
<tr><th>Option</th><th>Meets deadline (×3)</th><th>Expected mark (×3)</th><th>Fair + sustainable for the team (×2)</th><th>We learn something (×1)</th><th>Total /45</th></tr>
<tr><td>A — split the missing member's work among the other three</td><td>4</td><td>3</td><td>2</td><td>3</td><td><strong>28</strong></td></tr>
<tr><td>B — cut scope: drop two optional features, document the cut</td><td>5</td><td>3</td><td>4</td><td>2</td><td><strong>34</strong></td></tr>
<tr><td>C — tell the supervisor this week and ask for a re-plan</td><td>4</td><td>4</td><td>4</td><td>4</td><td><strong>36</strong> ✅</td></tr>
</table>
<ul>
<li><strong>Why weights matter more than scores.</strong> Option B beats C on "meets deadline", yet loses overall, because deadline and mark are weighted equally and C wins the mark. Change the weights and the answer changes — which is exactly the point: the matrix makes your priorities visible instead of leaving them as a gut feeling.</li>
<li><strong>"Nice, clean way" is doing real work in that definition.</strong> A solution that technically closes the gap by burning three people for two nights is not clean. What Wows filters for <em>elegance</em>, not just feasibility.</li>
<li><strong>What Is asks for THREE things.</strong> Initial state, goal state, and the blocks in between. Students routinely give only the goal ("we need to submit") and skip the blocks — which is where the actual problem lives.</li>
<li><strong>Applied at FPTU.</strong> Run the matrix in the group meeting, on the shared screen, with everyone scoring. Disagreement over a number is a disagreement about priorities made visible — and it is settled in ten minutes instead of festering for a week.</li>
</ul>
<p class="meo">💡 Remember the pairs: <strong>Is</strong> and <strong>If</strong> are the two-letter ones and come first (understand, then generate); <strong>Wows</strong> and <strong>Works</strong> are the longer ones and come last (narrow, then build).</p>
<p class="pitfall">⚠️ "What Wows" is the CULLING step, not the "wow the client with a presentation" step. It is the easiest of the four to misread, and therefore the most likely to be tested.</p>`,
        `<p class="y-chinh">🎯 Vẫn bốn chữ W đó, nhưng giờ mỗi cái kèm định nghĩa của chính slide — và đây mới là bản sẽ vào đề.</p>
<table>
<tr><th>Giai đoạn</th><th>Định nghĩa trên slide (nguyên văn)</th><th>Nước đi</th></tr>
<tr><td><strong>What Is</strong></td><td>defining the initial state and the goal state and any block in-between in order to understand the problem</td><td>BA thứ chứ không phải một: điểm xuất phát · đích · các vật cản ở giữa</td></tr>
<tr><td><strong>What If</strong></td><td>generate as many possible solutions or alternatives as you can</td><td>Ưu tiên SỐ LƯỢNG. Chưa phán xét gì cả</td></tr>
<tr><td><strong>What Wows</strong></td><td>cull the solutions down to the ones that solve the problem in a nice, clean way</td><td>CẮT. Chữ "cull" (tỉa bỏ) cố ý tàn nhẫn</td></tr>
<tr><td><strong>What Works</strong></td><td>create or implement the solution</td><td>Làm ra nó. Hết nghĩ, bắt đầu làm</td></tr>
</table>
<p class="nhan">Phần MỞ RỘNG ngoài slide — ma trận quyết định có trọng số cho bước "What Wows". Slide bảo "cull" nhưng không hề chỉ CÁCH cull. Đây là công cụ đó, chạy trên đúng ca SWP391. Trước hết là một <strong>CỬA LOẠI</strong>: phương án nào vi phạm quy chế học thuật thì bị gạt ra TRƯỚC khi chấm điểm, chứ không phải cho điểm thấp — nên "thuê người ngoài viết hộ" không bao giờ được bước vào bảng.</p>
<table>
<tr><th>Phương án</th><th>Kịp hạn (×3)</th><th>Điểm dự kiến (×3)</th><th>Công bằng &amp; bền sức cho nhóm (×2)</th><th>Học được gì (×1)</th><th>Tổng /45</th></tr>
<tr><td>A — chia phần việc của bạn vắng cho ba người còn lại</td><td>4</td><td>3</td><td>2</td><td>3</td><td><strong>28</strong></td></tr>
<tr><td>B — cắt phạm vi: bỏ hai chức năng phụ, ghi rõ trong báo cáo</td><td>5</td><td>3</td><td>4</td><td>2</td><td><strong>34</strong></td></tr>
<tr><td>C — báo giảng viên hướng dẫn ngay tuần này và xin lập lại kế hoạch</td><td>4</td><td>4</td><td>4</td><td>4</td><td><strong>36</strong> ✅</td></tr>
</table>
<ul>
<li><strong>Trọng số quan trọng hơn điểm chấm.</strong> Phương án B thắng C ở cột "kịp hạn", vậy mà thua chung cuộc, vì hạn nộp và điểm số có trọng số BẰNG NHAU còn C thắng ở cột điểm. Đổi trọng số thì đáp án đổi theo — và đó chính là điểm mấu chốt: ma trận làm cho THỨ TỰ ƯU TIÊN của bạn hiện ra thành chữ, thay vì nằm lẩn trong cảm tính.</li>
<li><strong>Cụm "nice, clean way" trong định nghĩa đang gánh việc thật.</strong> Một giải pháp về mặt kỹ thuật thì lấp được lỗ hổng nhưng phải đốt ba người trong hai đêm thì KHÔNG sạch. What Wows lọc theo sự THANH THOÁT, không chỉ theo tính khả thi.</li>
<li><strong>What Is đòi BA thứ.</strong> Trạng thái ban đầu, trạng thái đích, và các vật cản ở giữa. Sinh viên thường chỉ nêu mỗi cái đích ("phải nộp được bài") rồi bỏ qua vật cản — mà vấn đề thật thì sống đúng ở chỗ vật cản.</li>
<li><strong>Áp dụng ở FPTU.</strong> Chạy ma trận ngay trong buổi họp nhóm, chiếu lên màn hình chung, ai cũng chấm. Cãi nhau về một con số chính là bất đồng về thứ tự ưu tiên được phơi ra — và nó được giải quyết trong mười phút thay vì âm ỉ cả tuần.</li>
</ul>
<p class="meo">💡 Nhớ theo cặp: <strong>Is</strong> và <strong>If</strong> là hai chữ ngắn hai ký tự, đứng trước (hiểu, rồi sinh ý tưởng); <strong>Wows</strong> và <strong>Works</strong> là hai chữ dài, đứng sau (thu hẹp, rồi làm ra).</p>
<p class="pitfall">⚠️ "What Wows" là bước TỈA BỎ BỚT, KHÔNG phải bước "làm khách hàng trầm trồ bằng bài thuyết trình". Đây là chữ dễ hiểu sai nhất trong bốn chữ, nên cũng là chữ dễ bị hỏi nhất.</p>`],

      [29, 'Summary: Problem Solving Process — Understand · Strategise · Execute · Evaluate',
        `<p class="y-chinh">🎯 The MOOC's own four-step model, and the one you should default to when a question says "the problem-solving process" without naming an author: <strong>1. Understand · 2. Strategise · 3. Execute · 4. Evaluate</strong>.</p>
<table>
<tr><th>Step</th><th>Question it answers</th><th>Maps onto Dewey</th><th>Maps onto Design Thinking</th></tr>
<tr><td><strong>1. Understand</strong></td><td>What is really being asked?</td><td>Steps 1–2 (felt difficulty, location &amp; definition)</td><td>What Is</td></tr>
<tr><td><strong>2. Strategise</strong></td><td>Which approach, out of which options?</td><td>Steps 3–4 (possible solutions, logical reasons)</td><td>What If + What Wows</td></tr>
<tr><td><strong>3. Execute</strong></td><td>Do it — actually produce the answer</td><td>(implicit)</td><td>What Works</td></tr>
<tr><td><strong>4. Evaluate</strong></td><td>Did it work? What would I change?</td><td>Step 5 (testing and observation)</td><td>(implicit — loops back)</td></tr>
</table>
<ul>
<li><strong>This is the spine of the whole module.</strong> Sections 3.1 (Understanding), 3.2 (Starting with what you know) and 3.3 (Specialised knowledge) are all expansions of step 1 and step 2. Slide 32 onwards is literally "Understand", enlarged.</li>
<li><strong>Execute is only one step out of four.</strong> Three quarters of the model happens before or after you write anything. That ratio is the message: students who go straight to Execute are doing 25&nbsp;% of the process.</li>
<li><strong>Evaluate is not optional politeness.</strong> It is what converts one solved problem into a reusable strategy. Skip it and next semester's identical problem costs you the same effort all over again.</li>
<li><strong>Applied at FPTU.</strong> On a PE (Practical Exam): Understand = read the spec and the marking criteria; Strategise = pick the data structure and sketch the flow on paper; Execute = code it; Evaluate = run the sample tests and check the criteria list again before submitting. Most lost marks come from skipping steps 1 and 4, never from step 3.</li>
<li><strong>Verbs, all four.</strong> Understand-Strategise-Execute-Evaluate are commands. If an answer option turns one into a noun ("Evaluation of the strategy"), it is paraphrasing a different slide.</li>
</ul>
<p class="meo">💡 Initials <strong>U · S · E · E</strong> — "USE&nbsp;E". Four steps, and the only one that is not obviously about thinking is Execute, sitting third.</p>
<p class="pitfall">⚠️⚠️ <strong>The single biggest confusion in this slide range.</strong> Slide 31 is titled "The Problem-Solving Process" and also has four numbered items — but they are <em>completely different words</em> (What is the problem · hypothesis · different strategies · feedback loop). Do not merge the two lists. Slide 29 = Understand/Strategise/Execute/Evaluate. Slide 31 = the other one.</p>`,
        `<p class="y-chinh">🎯 Mô hình bốn bước của chính MOOC này, và là mô hình bạn nên mặc định dùng khi đề nói "quy trình giải quyết vấn đề" mà không nêu tên tác giả nào: <strong>1. Understand · 2. Strategise · 3. Execute · 4. Evaluate</strong>.</p>
<table>
<tr><th>Bước</th><th>Trả lời câu hỏi gì</th><th>Ứng với Dewey</th><th>Ứng với Design Thinking</th></tr>
<tr><td><strong>1. Understand — HIỂU</strong></td><td>Người ta thật sự hỏi cái gì?</td><td>Bước 1–2 (cảm giác khó khăn, định vị &amp; định nghĩa)</td><td>What Is</td></tr>
<tr><td><strong>2. Strategise — LẬP CHIẾN LƯỢC</strong></td><td>Đi đường nào, chọn trong những đường nào?</td><td>Bước 3–4 (các phương án, lý lẽ logic)</td><td>What If + What Wows</td></tr>
<tr><td><strong>3. Execute — THỰC THI</strong></td><td>Làm đi — đẻ ra câu trả lời thật</td><td>(ngầm)</td><td>What Works</td></tr>
<tr><td><strong>4. Evaluate — ĐÁNH GIÁ</strong></td><td>Có ăn thua không? Lần sau sửa gì?</td><td>Bước 5 (thử nghiệm và quan sát)</td><td>(ngầm — vòng lặp quay lại)</td></tr>
</table>
<ul>
<li><strong>Đây là xương sống của cả Mooc.</strong> Các mục 3.1 (Hiểu vấn đề), 3.2 (Bắt đầu từ cái đã biết) và 3.3 (Kiến thức chuyên ngành) đều là phần phóng to của bước 1 và bước 2. Từ slide 32 trở đi chính là chữ "Understand" được nở ra.</li>
<li><strong>Execute chỉ là MỘT trong BỐN bước.</strong> Ba phần tư mô hình diễn ra trước hoặc sau lúc bạn viết ra bất cứ thứ gì. Tỷ lệ đó chính là thông điệp: sinh viên lao thẳng vào Execute là đang làm 25&nbsp;% quy trình.</li>
<li><strong>Evaluate không phải phép lịch sự cho có.</strong> Nó là thứ biến MỘT vấn đề đã giải thành MỘT chiến lược dùng lại được. Bỏ nó thì học kỳ sau gặp đúng vấn đề đó, bạn lại tốn đúng ngần ấy công.</li>
<li><strong>Áp dụng ở FPTU.</strong> Vào phòng thi PE: Understand = đọc đề VÀ đọc tiêu chí chấm; Strategise = chọn cấu trúc dữ liệu và phác luồng ra giấy; Execute = gõ code; Evaluate = chạy test mẫu và soi lại danh sách tiêu chí trước khi nộp. Điểm mất hầu hết đến từ việc bỏ bước 1 và bước 4, gần như không bao giờ từ bước 3.</li>
<li><strong>Cả bốn đều là ĐỘNG TỪ.</strong> Understand-Strategise-Execute-Evaluate là bốn mệnh lệnh. Đáp án nào biến một cái thành danh từ ("Evaluation of the strategy") là đang nhại một slide khác.</li>
</ul>
<p class="meo">💡 Chữ đầu <strong>U · S · E · E</strong> — đọc là "USE E". Bốn bước, và cái duy nhất không hiển nhiên là chuyện tư duy chính là Execute, nằm ở vị trí thứ ba.</p>
<p class="pitfall">⚠️⚠️ <strong>Chỗ dễ lẫn nhất trong cả dải này.</strong> Slide 31 mang tiêu đề "The Problem-Solving Process" và cũng có bốn mục đánh số — nhưng <em>chữ nghĩa khác hoàn toàn</em> (Vấn đề là gì · giả thuyết · nhiều chiến lược · vòng lặp phản hồi). ĐỪNG gộp hai danh sách. Slide 29 = Understand/Strategise/Execute/Evaluate. Slide 31 = cái kia.</p>`],

      [30, '2.4b The Problem-Solving Process (learning outcomes)',
        `<p class="y-chinh">🎯 A section-opening slide with three learning outcomes, and every one of them is about <strong>defining</strong>, not solving: <strong>articulate the importance of accurately defining a problem</strong> · <strong>describe the four-step process of defining a problem</strong> · <strong>apply and evaluate the four-step process</strong>.</p>
<ul>
<li><strong>Read outcome 1 twice: "accurately defining".</strong> The MOOC is asserting that a badly defined problem cannot be rescued by good solving. This is the thesis the grizzly-bear story on slide 34 is there to prove.</li>
<li><strong>Outcome 2 names "the four-step process of DEFINING a problem".</strong> Note the wording: four steps of <em>defining</em>, not four steps of solving. Slide 31 delivers that list.</li>
<li><strong>Outcome 3 stacks two verbs: apply AND evaluate.</strong> Knowing the four steps is not the outcome; using them on a real problem and then judging how well they worked is. That is Bloom-level thinking, and it is why this MOOC is a 3-credit subject rather than a quiz.</li>
<li><strong>Why "articulate" appears at all.</strong> You are expected to be able to <em>explain to someone else</em> why definition matters — in a group meeting, in a report's problem statement, in a capstone defence. Skills you cannot articulate do not survive teamwork.</li>
<li><strong>Applied at FPTU.</strong> Every SWP391/SWR302 report opens with a "Problem statement" section. Graders read that section to decide whether the rest of the document is aimed at anything. A vague statement discounts the whole report before they reach your code.</li>
</ul>
<p class="meo">💡 Section numbering is a free map: <strong>2.4b</strong> means module 2, section 4, second half. Section 2.4a was the models (Dewey, design thinking); 2.4b is the process itself. Chapter 3 then expands each step.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu một mục, ba mục tiêu học tập, và cả ba đều nói về việc <strong>ĐỊNH NGHĨA</strong> chứ không phải giải: <strong>articulate the importance of accurately defining a problem</strong> · <strong>describe the four-step process of defining a problem</strong> · <strong>apply and evaluate the four-step process</strong>.</p>
<ul>
<li><strong>Đọc mục tiêu 1 hai lần: "accurately defining".</strong> MOOC đang khẳng định rằng một vấn đề bị định nghĩa sai thì tài giải mấy cũng không cứu nổi. Đây chính là luận điểm mà truyện con gấu xám ở slide 34 sinh ra để chứng minh.</li>
<li><strong>Mục tiêu 2 gọi tên "quy trình bốn bước của việc ĐỊNH NGHĨA vấn đề".</strong> Để ý chữ nghĩa: bốn bước của việc <em>định nghĩa</em>, không phải bốn bước của việc GIẢI. Slide 31 sẽ đưa ra đúng danh sách đó.</li>
<li><strong>Mục tiêu 3 chồng hai động từ: apply VÀ evaluate.</strong> Biết bốn bước chưa phải là mục tiêu; đem dùng trên một vấn đề thật rồi tự phán xem nó chạy tốt tới đâu mới là mục tiêu. Đó là tư duy bậc cao, và là lý do môn này là 3 tín chỉ chứ không phải một bài kiểm tra nhỏ.</li>
<li><strong>Vì sao lại có chữ "articulate".</strong> Bạn được kỳ vọng <em>giải thích được cho người khác</em> vì sao việc định nghĩa lại quan trọng — trong buổi họp nhóm, trong mục problem statement của báo cáo, trong buổi bảo vệ đồ án. Kỹ năng nào không nói ra được thì không sống nổi trong làm việc nhóm.</li>
<li><strong>Áp dụng ở FPTU.</strong> Mọi báo cáo SWP391/SWR302 đều mở đầu bằng mục "Problem statement". Người chấm đọc đúng mục đó để quyết xem phần còn lại của tài liệu có nhắm vào cái gì không. Một phát biểu mơ hồ làm cả báo cáo bị trừ điểm từ trước khi họ chạm tới code của bạn.</li>
</ul>
<p class="meo">💡 Số hiệu mục là một tấm bản đồ cho không: <strong>2.4b</strong> nghĩa là mô-đun 2, mục 4, nửa sau. Mục 2.4a là phần mô hình (Dewey, design thinking); 2.4b là bản thân quy trình. Sang chương 3 thì từng bước được nở rộng ra.</p>`],

      [31, 'The Problem-Solving Process (four numbered items — NOT the same list as slide 29)',
        `<p class="y-chinh">🎯 A second four-item list under an almost identical title, and its items are completely different words: <strong>1. What is the problem you're trying to solve? · 2. Make a hypothesis and test it. · 3. Use different strategies and compare the results · 4. Problem solving as an ongoing feedback loop</strong>.</p>
<table>
<tr><th>#</th><th>Item</th><th>What it adds that slide 29 did not say</th></tr>
<tr><td>1</td><td>What is the problem you're trying to solve?</td><td>The definition step, written as a <em>question you ask yourself</em></td></tr>
<tr><td>2</td><td>Make a hypothesis and test it.</td><td>Introduces the word <strong>hypothesis</strong> — a guess you commit to and then check</td></tr>
<tr><td>3</td><td>Use different strategies and compare the results</td><td><strong>Plural</strong> strategies, and an explicit comparison. Not in the USEE list at all</td></tr>
<tr><td>4</td><td>Problem solving as an ongoing feedback loop</td><td>The process is a <strong>loop</strong>, not a line. This is the item most likely to be examined</td></tr>
</table>
<ul>
<li><strong>Item 4 is the only one that is not an instruction.</strong> It is a statement about the shape of the whole thing: you never "finish" — the output of evaluation becomes the input of the next round. Notice it is phrased as a noun phrase, which is a small signal that it is a framing item, not a step you perform.</li>
<li><strong>Item 3 is quietly demanding.</strong> "Use different strategies AND compare" means solving the same problem more than one way on purpose. In a maths or algorithms subject that is exactly how you catch your own error: two methods agreeing is evidence; one method is a hope.</li>
<li><strong>Item 2 borrows from science.</strong> A hypothesis is not a random guess — it is a specific, checkable claim. Slide 45 will return to this and warn that guessing <em>without</em> the checking is what poor problem solvers do.</li>
<li><strong>Applied at FPTU.</strong> SWP391 again: (1) the problem is a blocked auth API, not a lazy teammate; (2) hypothesis — "if we stub the auth API today, the other three tasks unblock", test it in one afternoon; (3) compare with the alternative of waiting for the real implementation; (4) the retro after the sprint feeds the next sprint's plan — that is the loop.</li>
<li><strong>Two lists, one exam.</strong> You must be able to reproduce both. They are compatible — 31 is a more research-flavoured restatement — but the wording is what gets tested, and the wording is different.</li>
</ul>
<p class="pitfall">⚠️⚠️ Highest-risk confusion in this range. <strong>Slide 29</strong> = Understand · Strategise · Execute · Evaluate. <strong>Slide 31</strong> = problem? · hypothesis · different strategies · feedback loop. Both have four items; both are titled "…Problem Solving Process". A multiple-choice question will happily mix items from the two.</p>
<p class="meo">💡 Tell them apart by grammar: slide 29's items are <strong>single verbs</strong>; slide 31's items are <strong>sentences</strong>, one of which is a question and one of which is not an instruction at all.</p>`,
        `<p class="y-chinh">🎯 Một danh sách bốn mục THỨ HAI dưới cái tiêu đề gần y hệt, và chữ nghĩa thì khác hoàn toàn: <strong>1. What is the problem you're trying to solve? · 2. Make a hypothesis and test it. · 3. Use different strategies and compare the results · 4. Problem solving as an ongoing feedback loop</strong>.</p>
<table>
<tr><th>#</th><th>Mục</th><th>Nó thêm gì mà slide 29 không nói</th></tr>
<tr><td>1</td><td>Vấn đề bạn đang cố giải là gì?</td><td>Bước định nghĩa, viết dưới dạng một <em>câu hỏi bạn tự hỏi mình</em></td></tr>
<tr><td>2</td><td>Đặt một giả thuyết rồi đem thử.</td><td>Đưa vào chữ <strong>GIẢ THUYẾT</strong> — một phỏng đoán mà bạn cam kết rồi đi kiểm</td></tr>
<tr><td>3</td><td>Dùng nhiều chiến lược khác nhau và so kết quả</td><td><strong>SỐ NHIỀU</strong> chiến lược, và một phép SO SÁNH rành mạch. Danh sách USEE hoàn toàn không có ý này</td></tr>
<tr><td>4</td><td>Giải quyết vấn đề như một vòng lặp phản hồi liên tục</td><td>Quy trình là một <strong>VÒNG</strong>, không phải một đường thẳng. Đây là mục dễ vào đề nhất</td></tr>
</table>
<ul>
<li><strong>Mục 4 là mục duy nhất KHÔNG phải một mệnh lệnh.</strong> Nó là một phát biểu về hình dạng của toàn bộ sự việc: bạn không bao giờ "xong" — đầu ra của bước đánh giá trở thành đầu vào của vòng sau. Để ý nó được viết dưới dạng CỤM DANH TỪ, một tín hiệu nhỏ rằng đây là câu đóng khung, không phải một bước để thực hiện.</li>
<li><strong>Mục 3 đòi hỏi âm thầm mà nặng.</strong> "Dùng nhiều chiến lược VÀ so sánh" nghĩa là CỐ Ý giải cùng một bài theo hơn một cách. Trong môn toán hay giải thuật thì đó đúng là cách bắt lỗi của chính mình: hai cách cho cùng kết quả là BẰNG CHỨNG; một cách chỉ là HY VỌNG.</li>
<li><strong>Mục 2 mượn từ khoa học.</strong> Giả thuyết không phải phỏng đoán bừa — nó là một khẳng định cụ thể, kiểm được. Slide 45 sẽ quay lại chuyện này và cảnh báo rằng đoán mà KHÔNG kiểm chính là thói của người giải vấn đề kém.</li>
<li><strong>Áp dụng ở FPTU.</strong> Vẫn SWP391: (1) vấn đề là API đăng nhập đang chặn đường, không phải "thằng bạn lười"; (2) giả thuyết — "nếu hôm nay dựng tạm một bản giả của API thì ba task kia thông", đem thử trong một buổi chiều; (3) so với phương án ngồi chờ bản thật; (4) buổi rút kinh nghiệm sau sprint nuôi kế hoạch của sprint sau — đó là cái vòng.</li>
<li><strong>Hai danh sách, một bài thi.</strong> Bạn phải tái hiện được CẢ HAI. Chúng không mâu thuẫn — 31 là cách phát biểu lại đậm mùi nghiên cứu hơn — nhưng thứ bị hỏi là CHỮ, mà chữ thì khác nhau.</li>
</ul>
<p class="pitfall">⚠️⚠️ Chỗ dễ lẫn rủi ro cao nhất trong dải này. <strong>Slide 29</strong> = Understand · Strategise · Execute · Evaluate. <strong>Slide 31</strong> = vấn đề là gì? · giả thuyết · nhiều chiến lược · vòng lặp phản hồi. Cả hai đều bốn mục; cả hai đều mang tên "…Problem Solving Process". Câu trắc nghiệm sẽ rất vui lòng trộn mục của danh sách này sang danh sách kia.</p>
<p class="meo">💡 Phân biệt bằng NGỮ PHÁP: mục của slide 29 là <strong>ĐỘNG TỪ ĐƠN</strong>; mục của slide 31 là <strong>CÂU TRỌN VẸN</strong>, trong đó có một câu hỏi và một câu hoàn toàn không phải mệnh lệnh.</p>`],

      [32, '3.1a Understanding the Problem (learning outcomes)',
        `<p class="y-chinh">🎯 Chapter 3 opens by enlarging step 1 of the USEE model. Four outcomes: <strong>recognise the importance of understanding the problem</strong> · <strong>identify key terms, units, elements or parts of a problem</strong> · <strong>clarify the goal of the problem</strong> · <strong>recognise strategies to help visualise a problem</strong>.</p>
<table>
<tr><th>Outcome</th><th>The concrete act it names</th><th>Where it shows up later</th></tr>
<tr><td>recognise the importance</td><td>Believe that reading slowly is not wasted time</td><td>The grizzly bear story, slides 34–35</td></tr>
<tr><td>identify key terms, units, elements or parts</td><td>Underline the nouns and the units of measurement</td><td>"Focus on the units of measurement", slide 33</td></tr>
<tr><td>clarify the goal</td><td>State what a finished answer looks like</td><td>3.1c marking criteria, slides 38–41</td></tr>
<tr><td>recognise strategies to visualise</td><td>Draw it</td><td>"Visualise the problem" / "Draw a representation", slide 33</td></tr>
</table>
<ul>
<li><strong>Four nouns in one bullet: terms, units, elements, parts.</strong> They are not synonyms. <em>Terms</em> are the words; <em>units</em> are what things are measured in; <em>elements</em> are the given quantities or objects; <em>parts</em> are the sub-questions hiding inside one question. A question asking "which of these is NOT listed" is easy money if you know all four.</li>
<li><strong>"Units" is the technical half of this slide.</strong> In engineering and finance problems, half the errors are unit errors — hours vs days, VND vs USD, MB vs Mb. The MOOC names units explicitly because they are the cheapest error to prevent and the most expensive to discover late.</li>
<li><strong>"Clarify the GOAL" is separate from "identify the terms".</strong> You can understand every word in an exam question and still not know what a finished answer looks like. Goal-clarifying is asking: what will be on the page when I am done?</li>
<li><strong>Applied at FPTU.</strong> An assignment brief saying "design and evaluate a solution" has TWO parts — design and evaluate — and students routinely deliver only the first. Splitting the brief into its parts, on paper, before starting, is this outcome in action.</li>
<li><strong>Why understanding gets a whole chapter.</strong> Everything downstream inherits the error. Time spent here is the highest-leverage time in the whole process, which is exactly what the next few slides are built to convince you of.</li>
</ul>
<p class="pitfall">⚠️ These <strong>exact four bullets are printed again on slide 37</strong> under the different heading "3.1b Strategies for Understanding and Beginning the Problem". That is a duplication in the original deck — 3.1a and 3.1b are different sections, even though their outcome lists were copy-pasted.</p>`,
        `<p class="y-chinh">🎯 Chương 3 mở màn bằng cách phóng to bước 1 của mô hình USEE. Bốn mục tiêu: <strong>recognise the importance of understanding the problem</strong> · <strong>identify key terms, units, elements or parts of a problem</strong> · <strong>clarify the goal of the problem</strong> · <strong>recognise strategies to help visualise a problem</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Hành động cụ thể mà nó gọi tên</th><th>Nó hiện ra ở đâu về sau</th></tr>
<tr><td>nhận ra tầm quan trọng</td><td>Tin rằng đọc chậm KHÔNG phải phí thời gian</td><td>Truyện con gấu xám, slide 34–35</td></tr>
<tr><td>nhận diện thuật ngữ, đơn vị, thành tố, bộ phận</td><td>Gạch chân các danh từ và các đơn vị đo</td><td>"Focus on the units of measurement", slide 33</td></tr>
<tr><td>làm rõ mục tiêu</td><td>Phát biểu xem một câu trả lời HOÀN CHỈNH trông ra sao</td><td>3.1c tiêu chí chấm, slide 38–41</td></tr>
<tr><td>biết các chiến lược hình dung</td><td>VẼ nó ra</td><td>"Visualise the problem" / "Draw a representation", slide 33</td></tr>
</table>
<ul>
<li><strong>Bốn danh từ trong MỘT bullet: terms, units, elements, parts.</strong> Chúng KHÔNG đồng nghĩa. <em>Terms</em> là các từ ngữ; <em>units</em> là đơn vị đo; <em>elements</em> là các đại lượng/đối tượng đề cho; <em>parts</em> là các câu hỏi con nấp bên trong một câu hỏi. Câu hỏi kiểu "cái nào KHÔNG được liệt kê" là điểm cho không nếu bạn thuộc cả bốn.</li>
<li><strong>"Units" là nửa kỹ thuật của slide này.</strong> Trong bài toán kỹ thuật và tài chính, một nửa số lỗi là lỗi ĐƠN VỊ — giờ với ngày, VNĐ với USD, MB với Mb. MOOC gọi tên đơn vị một cách rành mạch vì đó là loại lỗi rẻ nhất để phòng và đắt nhất khi phát hiện muộn.</li>
<li><strong>"Làm rõ MỤC TIÊU" là việc RIÊNG so với "nhận diện thuật ngữ".</strong> Bạn có thể hiểu từng chữ trong đề thi mà vẫn không biết một bài làm xong thì trông thế nào. Làm rõ mục tiêu là tự hỏi: khi tôi làm xong thì trên tờ giấy sẽ có những gì?</li>
<li><strong>Áp dụng ở FPTU.</strong> Một đề bài ghi "design and evaluate a solution" có HAI phần — thiết kế VÀ đánh giá — và sinh viên rất hay chỉ nộp phần đầu. Tách đề ra thành từng bộ phận, ghi lên giấy, trước khi bắt tay làm, chính là mục tiêu này đang chạy.</li>
<li><strong>Vì sao "hiểu vấn đề" được hẳn một chương.</strong> Mọi thứ phía sau đều THỪA KẾ cái sai của nó. Thời gian bỏ ra ở đây có đòn bẩy cao nhất trong cả quy trình, và đó chính là điều mấy slide kế tiếp sinh ra để thuyết phục bạn.</li>
</ul>
<p class="pitfall">⚠️ <strong>Đúng bốn bullet này được in LẠI ở slide 37</strong> dưới một tiêu đề khác: "3.1b Strategies for Understanding and Beginning the Problem". Đó là lỗi lặp của chính bộ slide gốc — 3.1a và 3.1b là hai mục khác nhau, dù danh sách mục tiêu bị chép nguyên sang.</p>`],

      [33, 'Example strategies (four ways to get a grip on a problem)',
        `<p class="y-chinh">🎯 Four named strategies for understanding a problem: <strong>Visualise the problem · Draw a representation · Focus on the units of measurement · Define key words or phrases</strong>. Memorise the count: <strong>four</strong>.</p>
<table>
<tr><th>Strategy</th><th>What you physically do</th><th>Worked example</th></tr>
<tr><td><strong>Visualise the problem</strong></td><td>Build the picture in your head first — who, where, what is moving</td><td>"Two trains leave…" → see the track before you touch algebra</td></tr>
<tr><td><strong>Draw a representation</strong></td><td>Put it on paper: diagram, table, timeline, flowchart</td><td>SWP391: draw the 6 remaining tasks on a two-week timeline — the blockage becomes obvious in 30 seconds</td></tr>
<tr><td><strong>Focus on the units of measurement</strong></td><td>Write the unit next to every number, and check both sides match</td><td>"2 weeks behind" — behind on WHAT unit? Story points? Calendar days? Features? The answer changes the plan</td></tr>
<tr><td><strong>Define key words or phrases</strong></td><td>Write your own one-line definition of each loaded term</td><td>"Late" = past the supervisor's checkpoint, not past our internal wish-date</td></tr>
</table>
<ul>
<li><strong>Visualise and Draw are listed separately on purpose.</strong> Visualising is internal, drawing is external. The slide wants both because the drawing is what you can show a teammate, a supervisor, or yourself at 2 a.m. when the mental picture has evaporated.</li>
<li><strong>Drawing is how you find the parts you missed.</strong> A diagram has to be complete to be drawable — the moment you cannot draw an arrow, you have found a piece of the problem you do not actually understand.</li>
<li><strong>"Define key words" is the anti-argument tool.</strong> Half of all group disagreements are two people using one word for two things. Writing the definition down ends the argument in one line.</li>
<li><strong>Applied at FPTU.</strong> In a PE or a lab, spending three minutes drawing the data flow before coding is not lost time — it is the only cheap moment to notice that the spec has two outputs, not one. After you start typing, that discovery costs an hour.</li>
<li><strong>These four reappear verbatim on slide 36.</strong> When a MOOC repeats a list word for word inside four slides, treat it as the answer key.</li>
</ul>
<p class="meo">💡 Two are visual (Visualise, Draw), two are verbal/numeric (Units, Key words). Remembering the 2+2 split makes the count of four impossible to lose.</p>`,
        `<p class="y-chinh">🎯 Bốn chiến lược có tên để nắm được một vấn đề: <strong>Visualise the problem · Draw a representation · Focus on the units of measurement · Define key words or phrases</strong>. Thuộc lấy con số: <strong>BỐN</strong>.</p>
<table>
<tr><th>Chiến lược</th><th>Bạn làm gì bằng tay bằng mắt</th><th>Ví dụ chạy thật</th></tr>
<tr><td><strong>Visualise — HÌNH DUNG</strong></td><td>Dựng bức tranh trong đầu trước — ai, ở đâu, cái gì đang chuyển động</td><td>"Hai đoàn tàu khởi hành…" → thấy đường ray trước khi động vào đại số</td></tr>
<tr><td><strong>Draw a representation — VẼ RA</strong></td><td>Đặt lên giấy: sơ đồ, bảng, trục thời gian, lưu đồ</td><td>SWP391: vẽ 6 task còn lại lên một trục hai tuần — chỗ tắc hiện ra trong 30 giây</td></tr>
<tr><td><strong>Focus on the units — SOI ĐƠN VỊ</strong></td><td>Ghi đơn vị bên cạnh MỌI con số, và kiểm hai vế có khớp đơn vị không</td><td>"Trễ 2 tuần" — trễ theo ĐƠN VỊ nào? Story point? Ngày lịch? Số chức năng? Đáp án khác nhau thì kế hoạch khác nhau</td></tr>
<tr><td><strong>Define key words — ĐỊNH NGHĨA TỪ KHOÁ</strong></td><td>Tự viết một dòng định nghĩa cho từng từ nặng nghĩa</td><td>"Trễ" = quá mốc kiểm tra của giảng viên, chứ không phải quá cái hạn tự nghĩ ra trong nhóm</td></tr>
</table>
<ul>
<li><strong>Visualise và Draw được tách riêng là có chủ đích.</strong> Hình dung là việc BÊN TRONG, vẽ là việc BÊN NGOÀI. Slide đòi cả hai vì bản vẽ mới là thứ bạn đưa được cho đồng đội, cho giảng viên, và cho chính bạn lúc 2 giờ sáng khi bức tranh trong đầu đã bay sạch.</li>
<li><strong>Vẽ là cách tìm ra những mảnh bạn bỏ sót.</strong> Muốn vẽ được thì sơ đồ phải đầy đủ — đúng cái khoảnh khắc bạn không vẽ nổi một mũi tên là lúc bạn tìm ra một mảnh của vấn đề mà mình thật sự chưa hiểu.</li>
<li><strong>"Định nghĩa từ khoá" là công cụ CHỐNG CÃI NHAU.</strong> Một nửa số bất đồng trong nhóm là hai người dùng một từ cho hai thứ khác nhau. Viết định nghĩa ra là kết thúc cuộc cãi bằng một dòng.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trong phòng thi PE hay buổi lab, bỏ ba phút vẽ luồng dữ liệu trước khi gõ code KHÔNG phải thời gian mất đi — đó là khoảnh khắc rẻ tiền duy nhất để nhận ra đề có HAI đầu ra chứ không phải một. Sau khi đã gõ thì phát hiện đó tốn một tiếng.</li>
<li><strong>Bốn cái này xuất hiện lại NGUYÊN VĂN ở slide 36.</strong> Khi một MOOC lặp lại một danh sách từng chữ trong phạm vi bốn slide thì hãy coi đó là đáp án chuẩn.</li>
</ul>
<p class="meo">💡 Hai cái thuộc về hình ảnh (Visualise, Draw), hai cái thuộc về chữ và số (Units, Key words). Nhớ cái kiểu chia 2+2 đó thì không thể quên con số BỐN.</p>`],

      [34, 'What is the "real problem"? (Fogler & LeBlanc, 1995) — the grizzly bear story',
        `<p class="y-chinh">🎯 A full-slide story, quoted from Falconer (n.d.) in Fogler &amp; LeBlanc, 1995, p. 1. It exists to make one point unforgettable: <strong>the problem you think you are solving is often not the problem you are actually in</strong>.</p>
<ul>
<li><strong>The story, in short.</strong> A student and his professor are backpacking in Alaska. A grizzly bear starts chasing them from a distance. They both run, but it is clear the bear will eventually catch up. The student stops, takes off his backpack, gets out his running shoes and starts putting them on. The professor says: "You can't outrun the bear, even in running shoes!" The student replies: "I don't need to outrun the bear; I only need to outrun you!"</li>
<li><strong>The professor's mistake is a definition mistake, not a maths mistake.</strong> His reasoning is flawless given his definition of the problem ("survive the bear" = "be faster than the bear"). The definition is what is wrong. This is the whole thesis of section 2.4b in one anecdote.</li>
<li><strong>Stopping to put shoes on looks irrational.</strong> Under the wrong problem definition, the right action looks insane. That is the practical warning: when a teammate's action looks stupid, check whether they are solving a different problem before you correct them.</li>
<li><strong>The joke is dark on purpose.</strong> The "solution" is morally awful, and the deck does not defend it — the point is analytical, not ethical: it demonstrates that a redefinition can turn an impossible problem into an easy one.</li>
</ul>
<p class="dap-an">✅ Answer to "what is the real problem?": it is <strong>not</strong> "how do we outrun the bear" (impossible). It is "how do I avoid being the one the bear catches" — a relative problem, not an absolute one. The winning move is available only once the problem is restated. Slide 35 confirms this in the deck's own words.</p>
<p class="meo">💡 Exam-ready one-liner: the story is about <strong>redefining the goal state</strong>. Link it to "What Is" on slide 28 — defining the initial state, the goal state and the blocks — and to Dewey's step 2, "location and definition".</p>`,
        `<p class="y-chinh">🎯 Một slide chỉ có truyện, trích từ Falconer (n.d.) trong Fogler &amp; LeBlanc, 1995, tr. 1. Nó tồn tại để đóng đinh đúng một điều: <strong>cái vấn đề bạn tưởng mình đang giải thường không phải cái vấn đề bạn đang thật sự mắc vào</strong>.</p>
<ul>
<li><strong>Tóm tắt truyện.</strong> Một sinh viên và ông giáo sư đi phượt ở Alaska. Một con gấu xám từ xa bắt đầu đuổi theo. Cả hai cùng chạy, nhưng rõ ràng là trước sau gì con gấu cũng đuổi kịp. Cậu sinh viên dừng lại, cởi ba lô, lấy đôi giày chạy ra và bắt đầu xỏ vào. Ông giáo sư nói: "Cậu không chạy thắng con gấu được đâu, đi giày chạy cũng thế!" Cậu sinh viên đáp: "Em đâu cần chạy thắng con gấu; em chỉ cần chạy thắng thầy thôi!"</li>
<li><strong>Cái sai của ông giáo sư là sai ở ĐỊNH NGHĨA, không phải sai ở phép tính.</strong> Lập luận của ông hoàn hảo NẾU nhận định nghĩa vấn đề của ông ("sống sót trước con gấu" = "chạy nhanh hơn con gấu"). Cái sai nằm ở chính định nghĩa. Đây là toàn bộ luận điểm của mục 2.4b gói trong một mẩu chuyện.</li>
<li><strong>Việc dừng lại xỏ giày trông rất phi lý.</strong> Dưới một định nghĩa vấn đề SAI, hành động ĐÚNG trông như điên. Đó là lời cảnh báo thực dụng: khi một đồng đội làm việc gì trông có vẻ ngu, hãy kiểm xem họ có đang giải một vấn đề KHÁC không, trước khi bạn đi sửa lưng họ.</li>
<li><strong>Truyện cố ý đen tối.</strong> Cái "giải pháp" đó tệ về mặt đạo đức, và bộ slide không bênh nó — luận điểm ở đây là PHÂN TÍCH chứ không phải đạo đức: nó chứng minh rằng một phép định nghĩa lại có thể biến bài toán bất khả thi thành bài toán dễ.</li>
</ul>
<p class="dap-an">✅ Trả lời câu "vấn đề thật là gì?": nó <strong>KHÔNG</strong> phải "làm sao chạy nhanh hơn con gấu" (bất khả thi). Nó là "làm sao để tôi không phải là người bị gấu bắt" — một bài toán TƯƠNG ĐỐI, không phải tuyệt đối. Nước đi thắng cuộc chỉ xuất hiện SAU KHI phát biểu lại vấn đề. Slide 35 xác nhận đúng như vậy bằng chính chữ của bộ slide.</p>
<p class="meo">💡 Câu chốt để đi thi: truyện này nói về việc <strong>ĐỊNH NGHĨA LẠI TRẠNG THÁI ĐÍCH</strong>. Nối nó với "What Is" ở slide 28 — xác định trạng thái đầu, trạng thái đích và các vật cản — và với bước 2 của Dewey, "location and definition".</p>`],

      [35, '"The Case of the Hungry Grizzly Bear" — the deck states the real problem',
        `<p class="y-chinh">🎯 The answer slide. The <strong>"real problem"</strong> is spelled out in exactly two sub-points: <strong>Student needs to outrun his professor</strong>, and <strong>The bear will stop running once he has caught one person</strong>.</p>
<table>
<tr><th>Stated problem</th><th>Real problem</th><th>What changed</th></tr>
<tr><td>Outrun the bear</td><td>Outrun the professor</td><td>The <strong>competitor</strong> changed — from an impossible opponent to a beatable one</td></tr>
<tr><td>Escape a threat that pursues forever</td><td>Survive a threat that <strong>stops after one catch</strong></td><td>A hidden <strong>assumption about the system</strong> was made explicit</td></tr>
</table>
<ul>
<li><strong>The second bullet is the load-bearing one, and it is the one students forget.</strong> The redefinition only works because of a fact about the bear: it stops after catching one person. Without that fact, "outrun the professor" buys nothing. <em>A redefinition is only valid if it rests on a true premise about the situation.</em></li>
<li><strong>So the method is: hunt for the hidden assumption.</strong> The professor assumed the bear must be outrun. The student noticed the actual stopping condition of the system. In engineering terms, he read the specification instead of the folklore.</li>
<li><strong>This is why "understanding" gets ten slides.</strong> The difference between the two framings is not effort, intelligence or speed — it is thirty seconds of noticing. Every one of the four strategies on slide 33 exists to force that noticing.</li>
<li><strong>Applied at FPTU.</strong> "We must finish all 12 features by Friday" — is that the real problem? Check the stopping condition: the rubric may award marks for 8 well-documented features and none for 12 half-working ones. The real problem may be "maximise marks", and that is a beatable problem. Reading the marking criteria (slides 38–41) is exactly how you find the bear's stopping condition.</li>
<li><strong>Careful with the analogy in group work.</strong> "Outrun your teammate" is the wrong lesson to carry into SWP391 — the bear metaphor is about <em>re-reading the system's rules</em>, not about sacrificing the person next to you.</li>
</ul>
<p class="dap-an">✅ Exam-safe formulation: the real problem = <strong>the student needs to outrun the professor, because the bear stops once it has caught one person</strong>. Both halves, or the answer is incomplete.</p>
<p class="pitfall">⚠️ A tempting wrong answer is "the real problem is that they should not have been hiking in bear country" — that is prevention, a different problem entirely, and it is not what the slide says.</p>`,
        `<p class="y-chinh">🎯 Slide đáp án. <strong>"Vấn đề thật"</strong> được nói thẳng bằng đúng hai gạch đầu dòng: <strong>Student needs to outrun his professor</strong>, và <strong>The bear will stop running once he has caught one person</strong>.</p>
<table>
<tr><th>Vấn đề như đề phát biểu</th><th>Vấn đề THẬT</th><th>Cái gì đã đổi</th></tr>
<tr><td>Chạy nhanh hơn con gấu</td><td>Chạy nhanh hơn ông giáo sư</td><td><strong>ĐỐI THỦ</strong> đổi — từ một đối thủ bất khả thắng sang một đối thủ thắng được</td></tr>
<tr><td>Thoát một mối đe doạ đuổi mãi không thôi</td><td>Sống sót trước một mối đe doạ <strong>DỪNG LẠI sau khi bắt được một người</strong></td><td>Một <strong>GIẢ ĐỊNH ẨN về hệ thống</strong> được lôi ra thành chữ</td></tr>
</table>
<ul>
<li><strong>Gạch đầu dòng thứ HAI mới là cái chịu lực, và là cái sinh viên hay quên.</strong> Phép định nghĩa lại chỉ chạy được NHỜ một sự thật về con gấu: nó dừng sau khi bắt được một người. Không có sự thật đó thì "chạy nhanh hơn ông thầy" chẳng mua được gì. <em>Một phép định nghĩa lại chỉ hợp lệ khi nó tựa trên một tiền đề ĐÚNG về tình huống.</em></li>
<li><strong>Vậy phương pháp là: ĐI SĂN GIẢ ĐỊNH ẨN.</strong> Ông giáo sư giả định rằng buộc phải chạy thắng con gấu. Cậu sinh viên nhìn ra ĐIỀU KIỆN DỪNG thật sự của hệ thống. Nói theo ngôn ngữ kỹ thuật: cậu ta đọc bản đặc tả thay vì đọc truyền thuyết.</li>
<li><strong>Đây là lý do "hiểu vấn đề" được hẳn mười slide.</strong> Khoảng cách giữa hai cách đóng khung không nằm ở nỗ lực, trí thông minh hay tốc độ — nó nằm ở ba mươi giây NHÌN RA. Cả bốn chiến lược ở slide 33 tồn tại để ép cái "nhìn ra" đó xảy ra.</li>
<li><strong>Áp dụng ở FPTU.</strong> "Phải xong đủ 12 chức năng trước thứ Sáu" — đó có phải vấn đề thật không? Hãy kiểm điều kiện dừng: rubric có thể cho điểm với 8 chức năng chạy tốt và có tài liệu, và cho 0 với 12 chức năng nửa vời. Vấn đề thật có thể là "tối đa hoá điểm", và đó là bài toán thắng được. Đọc tiêu chí chấm (slide 38–41) chính là cách bạn tìm ra điều kiện dừng của con gấu.</li>
<li><strong>Cẩn thận khi bê phép so sánh này vào làm nhóm.</strong> "Chạy nhanh hơn đồng đội" là bài học SAI để mang vào SWP391 — ẩn dụ con gấu nói về việc <em>đọc lại luật chơi của hệ thống</em>, không phải về việc hi sinh người bên cạnh.</li>
</ul>
<p class="dap-an">✅ Cách phát biểu an toàn cho bài thi: vấn đề thật = <strong>cậu sinh viên cần chạy nhanh hơn ông giáo sư, BỞI VÌ con gấu sẽ dừng lại khi đã bắt được một người</strong>. Phải đủ cả hai vế, thiếu một vế là chưa trọn đáp án.</p>
<p class="pitfall">⚠️ Một đáp án sai rất mời gọi là "vấn đề thật là đáng lẽ họ không nên đi bộ đường dài ở vùng có gấu" — đó là PHÒNG NGỪA, một vấn đề hoàn toàn khác, và không phải điều slide nói.</p>`],

      [36, 'Summary: Understanding the Problem (3 moves + the 4 strategies)',
        `<p class="y-chinh">🎯 The section summary, and it has a two-level shape you must reproduce exactly: <strong>three moves</strong>, and then the <strong>four example strategies</strong> nested under the fourth bullet (Fogler &amp; LeBlanc, 1995).</p>
<table>
<tr><th>Level</th><th>Item</th><th>What it means</th></tr>
<tr><td>Move 1</td><td>Define the terms of the problem</td><td>The vocabulary — every loaded word gets your own one-line definition</td></tr>
<tr><td>Move 2</td><td>Define what the problem is asking you to do</td><td>The task verb — describe? compare? design AND evaluate?</td></tr>
<tr><td>Move 3</td><td>Identify the "real problem"</td><td>The grizzly-bear move — check the framing before you accept it</td></tr>
<tr><td>Move 4</td><td>Example Strategies:</td><td>A container, not a move — it holds the four below</td></tr>
<tr><td>— strategy</td><td>Visualise the problem</td><td>See it internally</td></tr>
<tr><td>— strategy</td><td>Draw a representation</td><td>Put it on paper</td></tr>
<tr><td>— strategy</td><td>Focus on the units of measurement</td><td>Units next to every number</td></tr>
<tr><td>— strategy</td><td>Define key words or phrases</td><td>Your own definitions, written down</td></tr>
</table>
<ul>
<li><strong>Count carefully: 3 + 4, not 7 and not 4.</strong> "Example Strategies" is a heading, so the flat bullet count on the slide is four, but only three of them are actions. This is precisely the shape multiple-choice questions exploit.</li>
<li><strong>Move 1 and Move 2 are different jobs.</strong> Defining the terms is about the <em>nouns</em>; defining what it asks you to do is about the <em>verb</em>. You can nail every term and still answer the wrong instruction — the classic way to lose marks on an otherwise good essay.</li>
<li><strong>Move 3 is the only one that questions the question.</strong> Moves 1 and 2 accept the problem as given and clarify it; move 3 asks whether the given framing is even right. Keep that hierarchy straight.</li>
<li><strong>Applied at FPTU.</strong> Before a written exam answer: circle the task verb (move 2), define any term the question loads (move 1), then ask once whether the obvious reading is the intended one (move 3). Ninety seconds, and it is the difference between a 6 and an 8.</li>
<li><strong>Note the citation.</strong> The whole summary is attributed to Fogler &amp; LeBlanc, 1995 — the same source as the bear. If a question asks who the "real problem" idea comes from, that is the name.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>terms → task → truth</strong> (define the terms, define the task, then test whether it is the real problem), and under them the 4 strategies from slide 33 unchanged.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt của mục, và nó có cấu trúc HAI TẦNG mà bạn phải tái hiện cho đúng: <strong>BA nước đi</strong>, rồi <strong>BỐN chiến lược ví dụ</strong> lồng dưới gạch đầu dòng thứ tư (Fogler &amp; LeBlanc, 1995).</p>
<table>
<tr><th>Tầng</th><th>Mục</th><th>Nghĩa là gì</th></tr>
<tr><td>Nước 1</td><td>Define the terms of the problem</td><td>Từ vựng — mỗi từ nặng nghĩa được bạn viết cho một dòng định nghĩa</td></tr>
<tr><td>Nước 2</td><td>Define what the problem is asking you to do</td><td>ĐỘNG TỪ nhiệm vụ — mô tả? so sánh? thiết kế VÀ đánh giá?</td></tr>
<tr><td>Nước 3</td><td>Identify the "real problem"</td><td>Nước đi con gấu xám — kiểm cách đóng khung trước khi chấp nhận nó</td></tr>
<tr><td>Mục 4</td><td>Example Strategies:</td><td>Một cái VỎ, không phải một nước đi — nó chứa bốn cái dưới đây</td></tr>
<tr><td>— chiến lược</td><td>Visualise the problem</td><td>Thấy nó trong đầu</td></tr>
<tr><td>— chiến lược</td><td>Draw a representation</td><td>Đưa lên giấy</td></tr>
<tr><td>— chiến lược</td><td>Focus on the units of measurement</td><td>Đơn vị ghi cạnh mọi con số</td></tr>
<tr><td>— chiến lược</td><td>Define key words or phrases</td><td>Định nghĩa của chính bạn, viết ra</td></tr>
</table>
<ul>
<li><strong>Đếm cho kỹ: 3 + 4, không phải 7 và cũng không phải 4.</strong> "Example Strategies" là một tiêu đề, nên số gạch đầu dòng phẳng trên slide là BỐN, nhưng chỉ BA trong số đó là hành động. Đây đúng là cái hình dạng mà câu trắc nghiệm hay khai thác.</li>
<li><strong>Nước 1 và nước 2 là hai việc khác nhau.</strong> Định nghĩa thuật ngữ là chuyện của DANH TỪ; định nghĩa "đề bảo làm gì" là chuyện của ĐỘNG TỪ. Bạn có thể hiểu đúng từng thuật ngữ mà vẫn trả lời sai mệnh lệnh — cách mất điểm kinh điển với một bài luận vốn dĩ khá.</li>
<li><strong>Nước 3 là nước duy nhất CHẤT VẤN chính câu hỏi.</strong> Nước 1 và 2 chấp nhận đề như nó có rồi làm rõ ra; nước 3 hỏi xem cách đóng khung đó có đúng không. Giữ cho đúng thứ bậc này.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trước khi viết câu trả lời tự luận: khoanh động từ nhiệm vụ (nước 2), định nghĩa mọi thuật ngữ đề nhét vào (nước 1), rồi tự hỏi một lần xem cách hiểu hiển nhiên có phải cách người ra đề muốn không (nước 3). Chín mươi giây, và đó là khoảng cách giữa điểm 6 và điểm 8.</li>
<li><strong>Để ý phần trích dẫn.</strong> Cả slide tóm tắt được ghi nguồn Fogler &amp; LeBlanc, 1995 — cùng nguồn với truyện con gấu. Đề mà hỏi ý tưởng "real problem" đến từ ai thì đó là cái tên cần nhớ.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>từ ngữ → nhiệm vụ → sự thật</strong> (định nghĩa thuật ngữ, định nghĩa nhiệm vụ, rồi kiểm xem có phải vấn đề thật không), và nằm dưới là 4 chiến lược y nguyên từ slide 33.</p>`],

      [37, '3.1b Strategies for Understanding and Beginning the Problem (same four bullets as 3.1a)',
        `<p class="y-chinh">🎯 A new section heading — <strong>3.1b Strategies for Understanding and Beginning the Problem</strong> — printed above the <strong>exact same four learning outcomes as slide 32</strong>: recognise the importance of understanding the problem · identify key terms, units, elements or parts of a problem · clarify the goal of the problem · recognise strategies to help visualise a problem.</p>
<ul>
<li><strong>This is a duplication in the original deck, not a hint.</strong> The outcome list was copy-pasted from 3.1a. Do not conclude that 3.1a and 3.1b teach the same thing — the section titles differ, and the title is where the real information is.</li>
<li><strong>What the new title actually adds: the word "Beginning".</strong> 3.1a was about <em>understanding</em>; 3.1b is about understanding <em>and getting started</em>. The gap between "I understand the problem" and "I have written the first line" is its own skill, and it is where procrastination lives.</li>
<li><strong>"Beginning" is the antidote to blank-page paralysis.</strong> You do not need a full plan to start — you need one defensible first move: a diagram, a definition, a stub function, a paragraph of the problem statement. Section 3.2 ("Start with what you know") is the direct continuation of this idea.</li>
<li><strong>Why noticing the duplication matters for the exam.</strong> If you revise only from slide 32 and assume 37 is the same, you will miss nothing on the bullets — but you will miss the section name, and section names are what the MOOC's quiz headings are built from.</li>
<li><strong>Applied at FPTU.</strong> An assignment sits untouched for a week not because it is hard but because there is no obvious first move. Define one: "tonight I only write the problem statement and draw the ERD". Beginning is a task you can finish, and finishing one task restarts the whole project.</li>
</ul>
<p class="pitfall">⚠️ Exam wording trap: the four bullets belong to <strong>both</strong> 3.1a and 3.1b in this deck. If a question asks "which section covers identifying key terms", either number is defensible — but the safer reading is 3.1a, where the list appears first and where the body slides (33–36) follow it.</p>`,
        `<p class="y-chinh">🎯 Một tiêu đề mục MỚI — <strong>3.1b Strategies for Understanding and Beginning the Problem</strong> — in phía trên <strong>ĐÚNG BỐN mục tiêu học tập y hệt slide 32</strong>: recognise the importance of understanding the problem · identify key terms, units, elements or parts of a problem · clarify the goal of the problem · recognise strategies to help visualise a problem.</p>
<ul>
<li><strong>Đây là lỗi lặp của bộ slide gốc, không phải một tín hiệu.</strong> Danh sách mục tiêu bị chép nguyên từ 3.1a sang. ĐỪNG kết luận 3.1a và 3.1b dạy cùng một thứ — tên mục khác nhau, và tên mục mới là chỗ chứa thông tin thật.</li>
<li><strong>Cái mà tiêu đề mới thật sự thêm vào: chữ "Beginning".</strong> 3.1a nói về việc HIỂU; 3.1b nói về hiểu VÀ BẮT ĐẦU. Khoảng cách giữa "tôi hiểu vấn đề rồi" và "tôi đã viết dòng đầu tiên" là một kỹ năng riêng, và đó là nơi sự trì hoãn cư trú.</li>
<li><strong>"Bắt đầu" là thuốc giải cho nỗi tê liệt trước trang giấy trắng.</strong> Bạn không cần một kế hoạch đầy đủ mới bắt đầu được — bạn cần MỘT nước đi đầu tiên biện hộ được: một sơ đồ, một định nghĩa, một hàm rỗng, một đoạn phát biểu vấn đề. Mục 3.2 ("Bắt đầu từ cái mình đã biết") chính là phần nối tiếp trực tiếp của ý này.</li>
<li><strong>Vì sao việc phát hiện ra chỗ lặp lại có ích cho bài thi.</strong> Nếu bạn chỉ ôn từ slide 32 và mặc định 37 giống hệt, bạn sẽ không mất gì về mặt bullet — nhưng sẽ mất cái TÊN MỤC, mà đề trắc nghiệm của MOOC thì được dựng từ chính các tên mục đó.</li>
<li><strong>Áp dụng ở FPTU.</strong> Một bài tập nằm im cả tuần không phải vì nó khó mà vì không có nước đi đầu tiên hiển nhiên nào. Hãy tự định nghĩa lấy một cái: "tối nay tôi chỉ viết phần phát biểu vấn đề và vẽ ERD". "Bắt đầu" là một nhiệm vụ LÀM XONG ĐƯỢC, và làm xong một nhiệm vụ là khởi động lại cả đồ án.</li>
</ul>
<p class="pitfall">⚠️ Bẫy chữ nghĩa trong đề: bốn bullet này thuộc về <strong>CẢ HAI</strong> mục 3.1a và 3.1b trong bộ slide. Nếu đề hỏi "mục nào nói về nhận diện thuật ngữ", cả hai số đều bênh được — nhưng cách đọc an toàn hơn là 3.1a, nơi danh sách xuất hiện TRƯỚC và nơi các slide thân bài (33–36) nối tiếp ngay sau nó.</p>`],

      [38, '3.1c Check your marking criteria',
        `<p class="y-chinh">🎯 A short section heading with only two outcomes, and both are recycled from the 3.1a list: <strong>identify key terms, units, elements or parts of a problem</strong> · <strong>clarify the goal of the problem</strong>. The new idea is in the <em>title</em>: the marking criteria are part of the problem statement.</p>
<ul>
<li><strong>Why exactly these two outcomes were kept.</strong> A marking rubric is literally a list of the assessor's key terms and an explicit statement of the goal. Reading the rubric <em>is</em> doing outcomes 2 and 3 of section 3.1 — the deck is not repeating itself here, it is pointing at where the answers are already written down.</li>
<li><strong>The rubric is the only place the goal state is stated by the person who decides.</strong> Your own reading of the task is a guess about what the marker wants. The rubric is not a guess. Preferring your interpretation over the rubric is the academic equivalent of the professor insisting you must outrun the bear.</li>
<li><strong>Note what is NOT among the outcomes: "recognise the importance" and "visualise".</strong> 3.1c is deliberately narrower than 3.1a — two outcomes, not four. If a question asks how many learning outcomes 3.1c lists, the answer is <strong>two</strong>.</li>
<li><strong>Applied at FPTU.</strong> Every assignment on the LMS ships with a grading table. Before writing anything, copy that table into your document as headings, then write under each heading. You cannot then forget a criterion, and the marker finds every criterion where they expect it.</li>
<li><strong>It also tells you where NOT to spend effort.</strong> If "user interface polish" carries 5&nbsp;% and "test coverage" carries 25&nbsp;%, the rubric has just told you which all-nighter is worth pulling. Understanding the problem includes understanding how it is scored.</li>
</ul>
<p class="meo">💡 Section map for 3.1: <strong>a</strong> = understanding, <strong>b</strong> = understanding + beginning, <strong>c</strong> = marking criteria. Three sub-sections, and only 3.1c is about someone else's definition of success.</p>`,
        `<p class="y-chinh">🎯 Một tiêu đề mục ngắn chỉ có HAI mục tiêu, và cả hai đều lấy lại từ danh sách 3.1a: <strong>identify key terms, units, elements or parts of a problem</strong> · <strong>clarify the goal of the problem</strong>. Ý mới nằm ở chính cái <em>TIÊU ĐỀ</em>: tiêu chí chấm là MỘT PHẦN của đề bài.</p>
<ul>
<li><strong>Vì sao đúng hai mục tiêu này được giữ lại.</strong> Một bảng tiêu chí chấm, theo nghĩa đen, chính là danh sách thuật ngữ then chốt của người chấm cộng với lời phát biểu rành mạch về mục tiêu. Đọc rubric CHÍNH LÀ đang làm mục tiêu 2 và 3 của mục 3.1 — bộ slide không tự lặp lại ở đây, nó đang chỉ tay vào chỗ mà đáp án đã được viết sẵn.</li>
<li><strong>Rubric là nơi DUY NHẤT mà trạng thái đích được phát biểu bởi chính người quyết định.</strong> Cách bạn hiểu đề chỉ là một phỏng đoán về điều người chấm muốn. Rubric thì không phải phỏng đoán. Ưu tiên cách hiểu của mình hơn rubric là phiên bản học thuật của ông giáo sư khăng khăng rằng phải chạy nhanh hơn con gấu.</li>
<li><strong>Để ý cái KHÔNG có trong mục tiêu: "nhận ra tầm quan trọng" và "hình dung".</strong> 3.1c cố ý hẹp hơn 3.1a — HAI mục tiêu chứ không phải bốn. Đề mà hỏi 3.1c liệt kê bao nhiêu mục tiêu học tập thì đáp án là <strong>HAI</strong>.</li>
<li><strong>Áp dụng ở FPTU.</strong> Mọi assignment trên LMS đều kèm một bảng chấm điểm. Trước khi viết bất cứ dòng nào, hãy chép bảng đó vào tài liệu của bạn làm các TIÊU ĐỀ MỤC, rồi viết dưới từng tiêu đề. Như vậy bạn không thể quên một tiêu chí nào, và người chấm tìm thấy từng tiêu chí đúng ở chỗ họ mong đợi.</li>
<li><strong>Nó cũng cho biết chỗ nào KHÔNG nên đổ sức.</strong> Nếu "giao diện đẹp" chiếm 5&nbsp;% còn "độ phủ kiểm thử" chiếm 25&nbsp;% thì rubric vừa nói cho bạn biết nên thức đêm vì cái nào. Hiểu vấn đề bao gồm cả hiểu cách người ta chấm nó.</li>
</ul>
<p class="meo">💡 Bản đồ mục 3.1: <strong>a</strong> = hiểu vấn đề, <strong>b</strong> = hiểu + bắt đầu, <strong>c</strong> = tiêu chí chấm. Ba tiểu mục, và chỉ 3.1c là nói về định nghĩa THÀNH CÔNG của người khác.</p>`],

      [39, 'Marking rubric — what it is and the instruction that closes it',
        `<p class="y-chinh">🎯 Four bullets defining a rubric, ending with the only sentence in this whole section that carries an exclamation mark: <strong>Set of criteria used to assess item · Creates consistency of marking · Helps you understand the question · Always check the marking criteria!</strong></p>
<table>
<tr><th>Bullet</th><th>Who it serves</th><th>Consequence for you</th></tr>
<tr><td>Set of criteria used to assess item</td><td>Definition</td><td>It is a list, and lists can be turned into a checklist</td></tr>
<tr><td>Creates consistency of marking</td><td>The <strong>marker</strong></td><td>Different markers, same standard — so gaming a particular marker's taste does not work</td></tr>
<tr><td>Helps you understand the question</td><td><strong>You</strong></td><td>The rubric is a second, more precise statement of the task</td></tr>
<tr><td>Always check the marking criteria!</td><td>An instruction</td><td>Before starting, mid-way, and before submitting — three times, not once</td></tr>
</table>
<ul>
<li><strong>Bullet 2 and bullet 3 are the two audiences of one document.</strong> A rubric exists for fairness (the marker's side) and for clarity (your side). Most students only ever think of the first and therefore treat the rubric as bureaucracy instead of as instructions.</li>
<li><strong>"Helps you understand the question" is the exam-relevant line.</strong> It places the rubric squarely inside section 3.1 — <em>understanding the problem</em> — rather than inside some later section about submission. That placement is the point of slides 38–41.</li>
<li><strong>Consistency cuts both ways.</strong> Because the rubric standardises marking, an excellent piece of work that ignores a criterion still loses those marks. The rubric protects you from an unfair marker and gives you no protection at all against your own omissions.</li>
<li><strong>Applied at FPTU.</strong> Check the criteria three times: at the start (to plan the sections), at the halfway point (to catch a criterion you have not touched while there is still time), and in the last hour (as a submission checklist). The third check routinely finds 5–10 marks lying on the floor.</li>
<li><strong>Why the exclamation mark matters.</strong> Nothing else in this deck is shouted. When a MOOC raises its voice once, that sentence tends to become a quiz item.</li>
</ul>
<p class="meo">💡 Count: <strong>four</strong> bullets — one definition, one benefit for the marker, one benefit for you, one command.</p>`,
        `<p class="y-chinh">🎯 Bốn gạch đầu dòng định nghĩa rubric, khép lại bằng câu DUY NHẤT trong cả mục này mang dấu chấm than: <strong>Set of criteria used to assess item · Creates consistency of marking · Helps you understand the question · Always check the marking criteria!</strong></p>
<table>
<tr><th>Gạch đầu dòng</th><th>Phục vụ ai</th><th>Hệ quả với bạn</th></tr>
<tr><td>Bộ tiêu chí dùng để đánh giá bài làm</td><td>Định nghĩa</td><td>Nó là một DANH SÁCH, mà danh sách thì biến thành checklist được</td></tr>
<tr><td>Tạo ra sự nhất quán khi chấm</td><td><strong>NGƯỜI CHẤM</strong></td><td>Người chấm khác nhau, cùng một chuẩn — nên chiều theo gu của một thầy cụ thể là vô ích</td></tr>
<tr><td>Giúp BẠN hiểu câu hỏi</td><td><strong>BẠN</strong></td><td>Rubric là bản phát biểu THỨ HAI, chính xác hơn, của nhiệm vụ</td></tr>
<tr><td>Luôn luôn kiểm tra tiêu chí chấm!</td><td>Một mệnh lệnh</td><td>Trước khi bắt đầu, giữa chừng, và trước khi nộp — BA lần, không phải một</td></tr>
</table>
<ul>
<li><strong>Gạch 2 và gạch 3 là hai đối tượng phục vụ của cùng một tài liệu.</strong> Rubric tồn tại vì sự CÔNG BẰNG (phía người chấm) và vì sự RÕ RÀNG (phía bạn). Phần lớn sinh viên chỉ nghĩ tới cái thứ nhất nên coi rubric là thủ tục hành chính thay vì coi nó là bản hướng dẫn.</li>
<li><strong>"Giúp bạn hiểu câu hỏi" mới là dòng dính tới đề thi.</strong> Nó đặt rubric nằm gọn bên trong mục 3.1 — <em>hiểu vấn đề</em> — chứ không phải trong một mục nào đó về chuyện nộp bài. Chính chỗ đặt đó là ý nghĩa của các slide 38–41.</li>
<li><strong>Tính nhất quán cắt cả hai phía.</strong> Vì rubric chuẩn hoá việc chấm, một bài xuất sắc mà bỏ qua một tiêu chí thì vẫn mất đúng số điểm của tiêu chí đó. Rubric bảo vệ bạn khỏi một người chấm thiên vị, và không bảo vệ bạn chút nào khỏi chính sự bỏ sót của mình.</li>
<li><strong>Áp dụng ở FPTU.</strong> Kiểm tiêu chí ba lần: lúc bắt đầu (để chia mục), lúc đi được nửa đường (để bắt một tiêu chí chưa đụng tới khi vẫn còn kịp), và trong một giờ cuối (như một checklist nộp bài). Lần kiểm thứ ba thường nhặt được 5–10 điểm đang nằm lăn lóc dưới sàn.</li>
<li><strong>Vì sao dấu chấm than lại đáng chú ý.</strong> Không có chỗ nào khác trong bộ slide này lên giọng. Khi một MOOC quát lên đúng một lần, câu đó thường trở thành một câu hỏi trắc nghiệm.</li>
</ul>
<p class="meo">💡 Đếm: <strong>BỐN</strong> gạch — một định nghĩa, một lợi ích cho người chấm, một lợi ích cho bạn, một mệnh lệnh.</p>`],

      [40, 'A real marking rubric — two assessment criteria and their descriptors',
        `<p class="y-chinh">🎯 A real rubric, shown as a white-and-pink table on a different template from the rest of the deck, with the note <strong>"You can also find the rubric attached to this lesson as a reading."</strong> Two columns: <strong>Assessment criteria</strong> and <strong>Descriptors</strong>. Two rows.</p>
<table>
<tr><th>Assessment criterion</th><th>Descriptors, as printed</th></tr>
<tr><td><strong>Organisation and understanding of task</strong></td><td>1. Overall, the assignment demonstrates a clear understanding of the purpose. 2. Within each section, the assignment is coherent and logical.</td></tr>
<tr><td><strong>Subject/discipline content &amp; knowledge</strong></td><td>1. The assignment demonstrates an understanding of curriculum design in secondary educational contexts. 2. The assignment demonstrates: sufficient breadth and depth in the design and sequencing of units; sufficient knowledge of effective formative and summative assessment strategies for secondary learners; an understanding of motivational strategies for secondary learners; acknowledgement and incorporation of national and state guidelines into the curriculum; awareness of education policies related to students from lower socioeconomic groups, disabled students, students with learning difficulties, and any other relevant groups. 3. Referencing: The assignment uses the recommended referencing style, and effectively integrates ideas and quotations from sources.</td></tr>
</table>
<ul>
<li><strong>The content is from a teacher-education assignment — that is not the point.</strong> You are not expected to know curriculum design. You are being shown the <em>shape</em> of a rubric: a small number of named criteria, each unpacked into numbered descriptors.</li>
<li><strong>Criterion 1 is about the whole and the parts.</strong> Descriptor 1 judges the assignment "overall"; descriptor 2 judges it "within each section". A document can be globally coherent and locally rambling, or vice versa — the rubric scores both.</li>
<li><strong>Criterion 2 hides an enormous checklist.</strong> Its descriptor 2 alone contains five separate sub-requirements. Any of the five, left out, costs marks — and none of them is visible from the assignment title. This is the concrete proof of "the rubric helps you understand the question".</li>
<li><strong>Referencing sits INSIDE the content criterion, not in a separate one.</strong> Worth noticing: citation quality is not a tidy-up chore at the end, it is scored as part of subject knowledge. That is exactly how FPTU report rubrics treat it too.</li>
<li><strong>Applied at FPTU.</strong> Do the arithmetic on a real rubric before planning your time. If criterion 2 unpacks into five sub-points and criterion 1 into two, then roughly five-sevenths of the effort belongs to criterion 2 — regardless of which part you personally find more fun.</li>
</ul>
<p class="meo">💡 The transferable structure: <strong>criterion → numbered descriptors → sub-bullets</strong>. Turn every level into a heading in your own draft and the rubric becomes your outline.</p>`,
        `<p class="y-chinh">🎯 Một rubric THẬT, trình bày dưới dạng bảng trắng-hồng trên một template khác hẳn phần còn lại của bộ slide, kèm dòng ghi chú <strong>"You can also find the rubric attached to this lesson as a reading."</strong> Hai cột: <strong>Assessment criteria</strong> và <strong>Descriptors</strong>. Hai hàng.</p>
<table>
<tr><th>Tiêu chí đánh giá</th><th>Mô tả, đúng như in trên slide</th></tr>
<tr><td><strong>Organisation and understanding of task</strong> — Tổ chức bài và hiểu nhiệm vụ</td><td>1. Nhìn tổng thể, bài làm thể hiện sự hiểu rõ về MỤC ĐÍCH. 2. Trong TỪNG PHẦN, bài làm mạch lạc và hợp logic.</td></tr>
<tr><td><strong>Subject/discipline content &amp; knowledge</strong> — Nội dung và kiến thức chuyên ngành</td><td>1. Bài làm thể hiện sự hiểu biết về thiết kế chương trình học ở bậc trung học. 2. Bài làm thể hiện: đủ rộng và đủ sâu trong việc thiết kế và sắp xếp trình tự các đơn vị bài học; đủ hiểu biết về các chiến lược đánh giá quá trình và đánh giá tổng kết cho người học bậc trung học; hiểu biết về các chiến lược tạo động lực cho người học bậc trung học; có ghi nhận và tích hợp các hướng dẫn cấp quốc gia và cấp bang vào chương trình; có nhận thức về các chính sách giáo dục liên quan tới học sinh thuộc nhóm kinh tế - xã hội thấp, học sinh khuyết tật, học sinh gặp khó khăn trong học tập và mọi nhóm liên quan khác. 3. Trích dẫn: bài làm dùng đúng kiểu trích dẫn được khuyến nghị, và tích hợp hiệu quả ý tưởng cùng trích dẫn nguyên văn từ các nguồn.</td></tr>
</table>
<ul>
<li><strong>Nội dung lấy từ một assignment ngành sư phạm — nhưng đó KHÔNG phải điều cần để ý.</strong> Bạn không bị đòi hỏi phải biết thiết kế chương trình học. Bạn đang được cho xem cái <em>HÌNH DẠNG</em> của một rubric: vài tiêu chí có tên, mỗi tiêu chí được bung ra thành các mô tả đánh số.</li>
<li><strong>Tiêu chí 1 xét cả CÁI TOÀN THỂ lẫn CÁC BỘ PHẬN.</strong> Mô tả 1 chấm bài "nhìn tổng thể"; mô tả 2 chấm "trong từng phần". Một tài liệu có thể mạch lạc ở tầm tổng thể mà lan man ở từng đoạn, hoặc ngược lại — rubric chấm cả hai.</li>
<li><strong>Tiêu chí 2 giấu một checklist khổng lồ.</strong> Riêng mô tả số 2 của nó đã chứa NĂM yêu cầu con tách bạch. Thiếu bất kỳ cái nào trong năm cũng mất điểm — và không cái nào nhìn ra được từ tên đề bài. Đây là bằng chứng cụ thể cho câu "rubric giúp bạn hiểu câu hỏi".</li>
<li><strong>Trích dẫn nằm BÊN TRONG tiêu chí nội dung, không phải một tiêu chí riêng.</strong> Đáng để ý: chất lượng trích dẫn không phải việc dọn dẹp lúc cuối, nó được chấm như một phần của kiến thức chuyên ngành. Rubric báo cáo ở FPTU cũng xử đúng như vậy.</li>
<li><strong>Áp dụng ở FPTU.</strong> Hãy làm phép tính trên một rubric thật TRƯỚC khi lên kế hoạch thời gian. Nếu tiêu chí 2 bung ra thành năm ý con còn tiêu chí 1 chỉ hai, thì đại khái năm phần bảy công sức thuộc về tiêu chí 2 — bất kể phần nào bạn thấy vui hơn.</li>
</ul>
<p class="meo">💡 Cấu trúc chuyển giao được: <strong>tiêu chí → các mô tả đánh số → các ý con</strong>. Biến mọi tầng thành tiêu đề mục trong bản nháp của bạn, thế là rubric trở thành dàn ý của bạn.</p>`],

      [41, 'The same rubric, zoomed to criterion 1 only',
        `<p class="y-chinh">🎯 The identical table as slide 40, but showing <strong>only the first criterion</strong> — "Organisation and understanding of task" — at a readable size. The header line is the same: "You can also find the rubric attached to this lesson as a reading."</p>
<table>
<tr><th>Assessment criterion</th><th>Descriptors</th></tr>
<tr><td><strong>Organisation and understanding of task</strong></td><td>1. Overall, the assignment demonstrates a clear understanding of the purpose.<br />2. Within each section, the assignment is coherent and logical.</td></tr>
</table>
<ul>
<li><strong>This is a presentation zoom, not new content.</strong> Slide 40 showed the whole rubric and was unreadable at the back of a room; slide 41 enlarges the first row. Note that the deck contains <strong>no matching zoom for the second criterion</strong> — the build stops after one row.</li>
<li><strong>Why criterion 1 got the zoom.</strong> It is the only criterion that is <em>discipline-independent</em>. "Clear understanding of the purpose" and "coherent and logical within each section" apply to an essay in education, a report in software engineering, and your SSL101c reflection alike. It is the row the MOOC actually wants you to study.</li>
<li><strong>"Understanding of task" is a marked criterion in its own right.</strong> Read that again: you are given marks, explicitly, for having understood the question. Section 3.1 is not a study tip — it is a line item on the rubric.</li>
<li><strong>Two descriptors = two different failures.</strong> Failing descriptor 1 means you answered the wrong question well. Failing descriptor 2 means you answered the right question in an order nobody can follow. They need different fixes: descriptor 1 is fixed before writing, descriptor 2 is fixed by restructuring.</li>
<li><strong>Applied at FPTU.</strong> For a SWR302 report, "coherent and logical within each section" is usually the cheapest marks available: consistent heading levels, one idea per section, a one-line summary opening each chapter. No extra research, real marks.</li>
</ul>
<p class="pitfall">⚠️ Do not read slide 41 as a shortened rubric. The full rubric is on slide 40; 41 is a zoom. In an exam, "how many assessment criteria does the example rubric have?" → <strong>two</strong>.</p>`,
        `<p class="y-chinh">🎯 Vẫn đúng cái bảng của slide 40, nhưng chỉ hiện <strong>tiêu chí THỨ NHẤT</strong> — "Organisation and understanding of task" — ở cỡ chữ đọc được. Dòng tiêu đề vẫn y nguyên: "You can also find the rubric attached to this lesson as a reading."</p>
<table>
<tr><th>Tiêu chí đánh giá</th><th>Mô tả</th></tr>
<tr><td><strong>Organisation and understanding of task</strong></td><td>1. Nhìn tổng thể, bài làm thể hiện sự hiểu rõ về mục đích.<br />2. Trong từng phần, bài làm mạch lạc và hợp logic.</td></tr>
</table>
<ul>
<li><strong>Đây là một bước PHÓNG TO khi trình chiếu, không phải nội dung mới.</strong> Slide 40 hiện cả rubric và ngồi cuối phòng thì không đọc nổi; slide 41 phóng to hàng đầu tiên. Lưu ý là bộ slide <strong>KHÔNG có bản phóng to tương ứng cho tiêu chí thứ hai</strong> — chuỗi hiệu ứng dừng lại sau một hàng.</li>
<li><strong>Vì sao tiêu chí 1 được phóng to.</strong> Nó là tiêu chí DUY NHẤT <em>không phụ thuộc ngành</em>. "Hiểu rõ mục đích" và "mạch lạc, hợp logic trong từng phần" đúng cho một bài luận sư phạm, một báo cáo kỹ thuật phần mềm, và cả bài thu hoạch SSL101c của bạn như nhau. Đó là hàng mà MOOC thật sự muốn bạn học.</li>
<li><strong>"Hiểu nhiệm vụ" bản thân nó là một tiêu chí ĐƯỢC CHẤM ĐIỂM.</strong> Đọc lại câu đó: bạn được cho điểm, một cách rành mạch, vì đã hiểu đúng câu hỏi. Mục 3.1 không phải một mẹo học — nó là một dòng trong bảng điểm.</li>
<li><strong>Hai mô tả = hai kiểu hỏng khác nhau.</strong> Hỏng mô tả 1 nghĩa là bạn trả lời rất hay cho một câu hỏi SAI. Hỏng mô tả 2 nghĩa là bạn trả lời đúng câu hỏi nhưng theo một trình tự không ai theo nổi. Hai cái cần hai cách sửa: mô tả 1 sửa TRƯỚC khi viết, mô tả 2 sửa bằng cách tái cấu trúc.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với báo cáo SWR302, "mạch lạc và hợp logic trong từng phần" thường là số điểm rẻ nhất đang có sẵn: cấp độ tiêu đề nhất quán, mỗi mục một ý, mở đầu mỗi chương bằng một dòng tóm tắt. Không cần nghiên cứu thêm gì, mà điểm là thật.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc slide 41 như một rubric rút gọn. Rubric đầy đủ nằm ở slide 40; 41 chỉ là bản phóng to. Vào phòng thi, "rubric ví dụ có mấy tiêu chí đánh giá?" → <strong>HAI</strong>.</p>`],

      [42, '3.2a Starting With What You Know (learning outcomes)',
        `<p class="y-chinh">🎯 A new section with three outcomes: <strong>recognise the importance of starting with what you know</strong> · <strong>identify strategies for brainstorming and mind-mapping a problem</strong> · <strong>articulate the strategy of guessing, approximating and hypothesising solutions to problems</strong>.</p>
<table>
<tr><th>Outcome</th><th>The named techniques</th><th>Delivered on</th></tr>
<tr><td>importance of starting with what you know</td><td>—</td><td>Slides 43–44</td></tr>
<tr><td>strategies for brainstorming and mind-mapping</td><td><strong>brainstorming · mind-mapping</strong> (concept maps appear on slide 44)</td><td>Slide 44</td></tr>
<tr><td>guessing, approximating and hypothesising</td><td><strong>three</strong> words, three different things</td><td>Slide 45</td></tr>
</table>
<ul>
<li><strong>Outcome 3 lists three verbs, and they are not synonyms.</strong> <em>Guessing</em> = a first answer with no working; <em>approximating</em> = a deliberately rough answer of the right order of magnitude; <em>hypothesising</em> = a specific claim you intend to test. A question asking which three are named will offer "estimating" or "predicting" as distractors — the slide says guessing, approximating, hypothesising.</li>
<li><strong>This section is the cure for the blank page.</strong> Section 3.1 ended with "understand the problem"; a student who understands the problem and still cannot begin needs somewhere to put the first mark. "What do I already know?" is always answerable, which is exactly why it is the recommended opening move.</li>
<li><strong>"Starting with what you know" is not lowering your ambitions.</strong> It is a claim about where knowledge lives: you have more relevant material in your head and your notes than you can recall on demand, and brainstorming/mind-mapping are retrieval tools, not creativity tricks.</li>
<li><strong>Applied at FPTU.</strong> Facing a PE question you think you cannot do: write down every related thing you do know — the data structure the course covered, the two library functions you remember, the shape of the expected output. Partial credit is real, and the act of listing usually unlocks the method.</li>
<li><strong>Where this sits in the USEE model.</strong> Section 3.1 was <em>Understand</em>; 3.2 is the first half of <em>Strategise</em> — generating candidate approaches out of your existing knowledge before reaching for outside sources (which is 3.3).</li>
</ul>
<p class="meo">💡 Count check for this section: <strong>three</strong> outcomes, and outcome 3 itself contains <strong>three</strong> named strategies. 3 and 3.</p>`,
        `<p class="y-chinh">🎯 Một mục mới với ba mục tiêu: <strong>recognise the importance of starting with what you know</strong> · <strong>identify strategies for brainstorming and mind-mapping a problem</strong> · <strong>articulate the strategy of guessing, approximating and hypothesising solutions to problems</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Kỹ thuật được gọi tên</th><th>Giao ở slide</th></tr>
<tr><td>tầm quan trọng của việc bắt đầu từ cái mình đã biết</td><td>—</td><td>Slide 43–44</td></tr>
<tr><td>chiến lược brainstorming và mind-mapping</td><td><strong>brainstorming · mind-mapping</strong> (concept map xuất hiện ở slide 44)</td><td>Slide 44</td></tr>
<tr><td>guessing, approximating và hypothesising</td><td><strong>BA</strong> chữ, ba thứ khác nhau</td><td>Slide 45</td></tr>
</table>
<ul>
<li><strong>Mục tiêu 3 liệt kê ba động từ, và chúng KHÔNG đồng nghĩa.</strong> <em>Guessing</em> = một câu trả lời đầu tiên không kèm lời giải; <em>approximating</em> = một câu trả lời cố ý thô nhưng đúng bậc độ lớn; <em>hypothesising</em> = một khẳng định cụ thể mà bạn ĐỊNH ĐEM ĐI KIỂM. Đề hỏi ba cái nào được gọi tên sẽ tung ra "estimating" hay "predicting" làm nhiễu — slide nói guessing, approximating, hypothesising.</li>
<li><strong>Mục này là thuốc chữa bệnh trang giấy trắng.</strong> Mục 3.1 kết thúc ở "hãy hiểu vấn đề"; một sinh viên đã hiểu vấn đề mà vẫn không bắt đầu được thì cần một chỗ để đặt nét bút đầu tiên. Câu "mình đã biết sẵn cái gì?" thì LÚC NÀO CŨNG trả lời được, và đó đúng là lý do nó được chọn làm nước mở màn.</li>
<li><strong>"Bắt đầu từ cái mình đã biết" KHÔNG phải là hạ thấp tham vọng.</strong> Nó là một khẳng định về chỗ kiến thức trú ngụ: trong đầu bạn và trong vở bạn có nhiều vật liệu liên quan hơn lượng bạn nhớ ra được khi bị hỏi, và brainstorming/mind map là công cụ TRUY XUẤT chứ không phải mẹo sáng tạo.</li>
<li><strong>Áp dụng ở FPTU.</strong> Vào phòng PE gặp câu bạn nghĩ mình chịu: hãy viết ra mọi thứ liên quan mà bạn CÓ biết — cấu trúc dữ liệu môn đã dạy, hai hàm thư viện còn nhớ, hình dạng của đầu ra mong đợi. Điểm thành phần là có thật, và chính hành động liệt kê thường mở ra cách làm.</li>
<li><strong>Nó nằm đâu trong mô hình USEE.</strong> Mục 3.1 là <em>Understand</em>; 3.2 là nửa đầu của <em>Strategise</em> — sinh ra các hướng tiếp cận từ vốn có sẵn TRƯỚC KHI với tay ra nguồn bên ngoài (đó là 3.3).</li>
</ul>
<p class="meo">💡 Kiểm số lượng của mục này: <strong>BA</strong> mục tiêu, và bản thân mục tiêu 3 chứa <strong>BA</strong> chiến lược có tên. 3 và 3.</p>`],

      [43, 'Start With What You Know — specialised knowledge, and what lecturers will and will not ask',
        `<p class="y-chinh">🎯 Three claims, the first one quoted: problem solving skills <strong>"often depend on specialized knowledge in a discipline"</strong> (Bransford &amp; Stein, 1993, p. 4) · <strong>move from knowledge-lean to knowledge-rich problem solvers</strong> · <strong>lecturers will rarely ask you to do a problem using information and strategies they haven't addressed in the course or prerequisite courses</strong>.</p>
<table>
<tr><th>Term</th><th>Meaning</th><th>Example</th></tr>
<tr><td><strong>Knowledge-lean</strong></td><td>Solving with general reasoning only, because you have little domain content</td><td>A puzzle anyone can attempt: riddles, logic games, "how many ping-pong balls fit in a bus"</td></tr>
<tr><td><strong>Knowledge-rich</strong></td><td>Solving by recognising the problem type and applying domain content</td><td>Seeing "this is a deadlock" or "this is a normalisation problem" and reaching for the known method</td></tr>
</table>
<ul>
<li><strong>The third bullet is the most practically useful sentence in the whole deck.</strong> If a problem looks unsolvable, the tool needed is almost certainly one you have already been taught — in this course or a prerequisite. That converts "I have no idea" into a search over a finite, known list.</li>
<li><strong>Note the hedge: "rarely", not "never".</strong> Some assessments deliberately test transfer to unfamiliar situations. The claim is about the <em>tools</em>, not the situations: new context, known method.</li>
<li><strong>"Move from lean to rich" is a description of your degree.</strong> First-year you solve mostly knowledge-lean; by capstone you should recognise problem types on sight. That shift is what the four years buy, and it only happens if you keep the content, not just pass the exams.</li>
<li><strong>Why the quote is worth memorising.</strong> Bransford &amp; Stein, 1993, p. 4 — the MOOC returns to this exact quotation on slide 48, which makes it one of the most repeated lines in Mooc 2 and therefore highly examinable.</li>
<li><strong>Applied at FPTU.</strong> Stuck on a DBI202 query? List the SQL constructs the course has covered and test each against the question — GROUP BY, HAVING, subquery, JOIN, window function. The answer is inside that list by construction. The same move works for a SWP391 design problem: list the patterns the course taught and ask which fits.</li>
</ul>
<p class="pitfall">⚠️ Careful: slide 48's summary reprints bullets 1 and 3 but <strong>drops "move from knowledge-lean to knowledge-rich"</strong>. If you revise only from the summary you will not have met that pair of terms — and they are the most quizzable vocabulary on this slide.</p>`,
        `<p class="y-chinh">🎯 Ba khẳng định, cái đầu tiên là trích dẫn: kỹ năng giải quyết vấn đề <strong>"often depend on specialized knowledge in a discipline"</strong> (Bransford &amp; Stein, 1993, tr. 4) · <strong>đi từ người giải vấn đề NGHÈO kiến thức sang người GIÀU kiến thức</strong> · <strong>giảng viên hiếm khi bắt bạn giải một bài bằng thông tin và chiến lược mà họ chưa dạy trong môn này hoặc các môn tiên quyết</strong>.</p>
<table>
<tr><th>Thuật ngữ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><strong>Knowledge-lean</strong> — nghèo kiến thức</td><td>Giải chỉ bằng suy luận chung chung, vì không có mấy nội dung chuyên ngành</td><td>Câu đố ai cũng thử được: câu đố mẹo, trò logic, "một chiếc xe buýt chứa được bao nhiêu quả bóng bàn"</td></tr>
<tr><td><strong>Knowledge-rich</strong> — giàu kiến thức</td><td>Giải bằng cách NHẬN RA DẠNG bài rồi áp nội dung chuyên ngành vào</td><td>Nhìn ra "đây là deadlock" hay "đây là bài chuẩn hoá" rồi với tay lấy đúng phương pháp đã biết</td></tr>
</table>
<ul>
<li><strong>Gạch thứ ba là câu hữu dụng nhất trong cả bộ slide.</strong> Nếu một bài trông có vẻ không giải nổi thì công cụ cần dùng gần như chắc chắn là công cụ bạn ĐÃ được dạy — trong chính môn này hoặc môn tiên quyết. Điều đó biến "em chịu, không có ý tưởng gì" thành một phép TÌM KIẾM trên một danh sách hữu hạn và đã biết.</li>
<li><strong>Để ý chữ rào đón: "rarely" (hiếm khi), không phải "never".</strong> Một số bài đánh giá cố ý kiểm tra khả năng chuyển giao sang tình huống lạ. Khẳng định này nói về CÔNG CỤ, không nói về tình huống: bối cảnh mới, phương pháp cũ.</li>
<li><strong>"Đi từ nghèo sang giàu kiến thức" là mô tả chính tấm bằng của bạn.</strong> Năm nhất bạn giải chủ yếu theo kiểu nghèo kiến thức; tới đồ án tốt nghiệp thì phải nhìn phát ra ngay dạng bài. Cú dịch chuyển đó là thứ bốn năm học mua về, và nó chỉ xảy ra nếu bạn GIỮ LẠI nội dung chứ không chỉ qua môn.</li>
<li><strong>Vì sao câu trích đáng học thuộc.</strong> Bransford &amp; Stein, 1993, tr. 4 — MOOC quay lại đúng câu trích này ở slide 48, khiến nó thành một trong những dòng được lặp nhiều nhất Mooc 2 và do đó rất dễ vào đề.</li>
<li><strong>Áp dụng ở FPTU.</strong> Bí một câu truy vấn DBI202? Liệt kê những cấu trúc SQL mà môn đã dạy rồi thử từng cái với đề — GROUP BY, HAVING, truy vấn con, JOIN, hàm cửa sổ. Theo cách dựng đề thì đáp án nằm TRONG danh sách đó. Nước đi y hệt dùng được cho bài thiết kế SWP391: liệt kê các mẫu thiết kế môn đã dạy rồi hỏi cái nào khớp.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận: slide tóm tắt 48 in lại gạch 1 và gạch 3 nhưng <strong>BỎ HẲN "move from knowledge-lean to knowledge-rich"</strong>. Nếu chỉ ôn từ slide tóm tắt thì bạn sẽ chưa từng gặp cặp thuật ngữ đó — mà đó lại là từ vựng dễ ra đề nhất của slide này.</p>`],

      [44, 'Start With What You Know — "What do I know?" (de Bono), and the three mapping tools',
        `<p class="y-chinh">🎯 The practical half: ask <strong>"What do I know?"</strong>, described by the slide with a quote — <strong>"[Describe] what… [you] see as accurately as possible"</strong> (de Bono, 2004, p. 93) — then <strong>start with what is obvious</strong>, using <strong>mind maps, concept-maps, brainstorming</strong>.</p>
<table>
<tr><th>Tool</th><th>Shape</th><th>Best for</th></tr>
<tr><td><strong>Mind map</strong></td><td>One central idea, branches radiating out</td><td>Emptying your head about ONE topic, fast</td></tr>
<tr><td><strong>Concept map</strong></td><td>Many nodes joined by <em>labelled</em> arrows ("causes", "requires")</td><td>Showing RELATIONSHIPS, not just items</td></tr>
<tr><td><strong>Brainstorming</strong></td><td>A flat list, no judging during generation</td><td>Volume of options, especially in a group</td></tr>
</table>
<p class="nhan">Beyond the slide — the tools actually run on the SWP391 case. Brainstorm (10 raw ideas, nothing judged): 1) stub the auth API today so the other three tasks unblock · 2) reassign the missing member's tasks to the three of us · 3) email the supervisor this week and ask for a re-plan · 4) cut the two optional features and say so in the report · 5) pair-program the hard module over the weekend · 6) reuse the auth code from last semester's lab (and cite it) · 7) move the daily check-in to 21:00 so everyone actually attends · 8) ask the missing member directly what is blocking them · 9) demo what works instead of what is complete · 10) freeze all new feature requests until the deadline. A mind map of the same case: centre = "2 weeks behind", branches = PEOPLE (who is blocked, who is missing, who has slack) · SCOPE (must-have, nice-to-have, droppable) · TIME (checkpoints left, exam week collision) · RULES (rubric, regulations, supervisor's checkpoint). A concept map adds the labelled arrows: "missing auth API → blocks → 3 tasks"; "cutting scope → reduces → mark on criterion 2"; "telling supervisor → unlocks → official re-plan".</p>
<ul>
<li><strong>"Start with what is obvious" is the rule that makes it work.</strong> Nobody freezes over the obvious. Writing down five things everyone already knows is what breaks the paralysis, and item six is usually the one nobody had said out loud.</li>
<li><strong>de Bono's word is DESCRIBE, not analyse.</strong> The instruction is to state what you see as accurately as possible — no interpretation yet. Mixing description and judgement is precisely what stops a brainstorm: the moment someone says "that won't work", generation ends.</li>
<li><strong>Mind map and concept map are NOT the same thing</strong>, and this deck names both. Mind map = one centre, unlabelled branches. Concept map = many concepts, labelled links. If an exam offers them as alternatives, the labelled-relationships one is the concept map.</li>
<li><strong>Applied at FPTU.</strong> Ten minutes of group brainstorm with one rule — no evaluation until the timer ends — produces more usable options than an hour of discussion, because discussion evaluates each idea as it arrives and kills the awkward ones first. The awkward ones are where the good options hide.</li>
<li><strong>Then, and only then, cull.</strong> Generation (this slide) feeds the weighted matrix from slide 28. Ten raw ideas collapse to three real options, and three options collapse to one decision.</li>
</ul>
<p class="meo">💡 The slide names <strong>three</strong> tools: mind maps · concept-maps · brainstorming. Outcome 2 on slide 42 named only two (brainstorming and mind-mapping) — concept maps appear here for the first time.</p>`,
        `<p class="y-chinh">🎯 Nửa thực hành: hãy hỏi <strong>"Mình đã biết gì?"</strong>, được slide mô tả bằng một câu trích — <strong>"[Describe] what… [you] see as accurately as possible"</strong> (de Bono, 2004, tr. 93) — rồi <strong>bắt đầu từ cái hiển nhiên</strong>, bằng <strong>mind map, concept map, brainstorming</strong>.</p>
<table>
<tr><th>Công cụ</th><th>Hình dạng</th><th>Hợp nhất với việc gì</th></tr>
<tr><td><strong>Mind map</strong> — sơ đồ tư duy</td><td>Một ý ở giữa, các nhánh toả ra</td><td>Dốc sạch đầu về MỘT chủ đề, thật nhanh</td></tr>
<tr><td><strong>Concept map</strong> — sơ đồ khái niệm</td><td>Nhiều nút nối nhau bằng mũi tên CÓ NHÃN ("gây ra", "đòi hỏi")</td><td>Cho thấy QUAN HỆ, không chỉ liệt kê</td></tr>
<tr><td><strong>Brainstorming</strong> — động não</td><td>Một danh sách phẳng, KHÔNG phán xét trong lúc sinh ý</td><td>Số lượng phương án, nhất là khi làm theo nhóm</td></tr>
</table>
<p class="nhan">Phần MỞ RỘNG ngoài slide — ba công cụ chạy thật trên ca SWP391. Brainstorm (10 ý thô, chưa phán xét gì): 1) dựng bản giả (stub) của API đăng nhập ngay hôm nay để ba task kia thông · 2) chia task của bạn vắng cho ba người còn lại · 3) email giảng viên hướng dẫn tuần này xin lập lại kế hoạch · 4) cắt hai chức năng phụ và ghi rõ trong báo cáo · 5) lập trình cặp cho module khó vào cuối tuần · 6) dùng lại mã đăng nhập từ bài lab kỳ trước (và ghi nguồn) · 7) dời buổi điểm danh tiến độ sang 21:00 để ai cũng dự thật · 8) hỏi thẳng bạn đang vắng xem cái gì đang chặn bạn ấy · 9) demo phần chạy được thay vì phần hoàn chỉnh · 10) đóng băng mọi yêu cầu chức năng mới cho tới hạn nộp. Mind map cho cùng ca đó: giữa = "trễ 2 tuần", các nhánh = NGƯỜI (ai đang bị chặn, ai đang vắng, ai còn dư sức) · PHẠM VI (bắt buộc, nên có, bỏ được) · THỜI GIAN (còn mấy mốc, có đụng tuần thi không) · LUẬT (rubric, quy chế, mốc kiểm tra của giảng viên). Concept map thì thêm mũi tên có nhãn: "thiếu API đăng nhập → CHẶN → 3 task"; "cắt phạm vi → LÀM GIẢM → điểm tiêu chí 2"; "báo giảng viên → MỞ RA → lần lập lại kế hoạch chính thức".</p>
<ul>
<li><strong>"Bắt đầu từ cái hiển nhiên" mới là quy tắc khiến nó chạy được.</strong> Không ai đứng hình trước cái hiển nhiên. Viết ra năm điều ai cũng đã biết chính là thứ phá vỡ sự tê liệt, và ý thứ sáu thường là ý chưa ai từng nói thành lời.</li>
<li><strong>Chữ của de Bono là MÔ TẢ, không phải phân tích.</strong> Chỉ dẫn là hãy phát biểu điều bạn NHÌN THẤY chính xác nhất có thể — chưa diễn giải gì. Trộn mô tả với phán xét đúng là thứ giết một buổi brainstorm: khoảnh khắc có người nói "cái đó không ăn thua đâu" là lúc việc sinh ý dừng lại.</li>
<li><strong>Mind map và concept map KHÔNG phải một thứ</strong>, và bộ slide này gọi tên cả hai. Mind map = một tâm, nhánh không nhãn. Concept map = nhiều khái niệm, liên kết CÓ NHÃN. Nếu đề đưa hai cái ra làm phương án, cái có quan hệ được dán nhãn là concept map.</li>
<li><strong>Áp dụng ở FPTU.</strong> Mười phút brainstorm nhóm với đúng MỘT luật — không đánh giá cho tới khi hết giờ — đẻ ra nhiều phương án dùng được hơn một tiếng thảo luận, vì thảo luận thì đánh giá từng ý ngay lúc nó vừa ra đời và giết những ý gai góc trước tiên. Mà những ý gai góc lại là chỗ các phương án hay ẩn náu.</li>
<li><strong>Sau đó, và chỉ sau đó, mới TỈA.</strong> Việc sinh ý (slide này) nuôi cho ma trận có trọng số ở slide 28. Mười ý thô co lại thành ba phương án thật, và ba phương án co lại thành một quyết định.</li>
</ul>
<p class="meo">💡 Slide này gọi tên <strong>BA</strong> công cụ: mind map · concept map · brainstorming. Còn mục tiêu 2 ở slide 42 chỉ gọi tên HAI (brainstorming và mind-mapping) — concept map xuất hiện lần đầu ở đây.</p>`],

      [45, 'Justify your ideas — show the path, work back through your notes, guess responsibly',
        `<p class="y-chinh">🎯 A continuation slide with no title of its own, headed simply <strong>Justify your ideas</strong>, with four sub-points: <strong>show solution paths as well as the solution/goal</strong> · <strong>work back through course notes, textbooks or lectures for reference</strong> · a quote from Whimbey &amp; Lochhead · <strong>educated guesses, hypotheses or approximations can be very useful initial strategies</strong>.</p>
<ul>
<li><strong>"Show solution paths as well as the solution" is a marks instruction.</strong> In almost every quantitative subject the working carries most of the credit. A correct final number with no path can score less than a wrong number with a clear method — because the rubric is marking the reasoning, not the arithmetic.</li>
<li><strong>"Work back through course notes, textbooks or lectures" is the same claim as slide 43, made operational.</strong> If the tools are all things you have been taught, then your notes are a finite lookup table for the missing tool. Three named places: notes, textbooks, lectures.</li>
<li><strong>The quote, in full:</strong> <em>"Poor problem solvers tend to jump to conclusions and guess answers without going through all the steps needed to make sure that the answers are accurate"</em> (Whimbey &amp; Lochhead, 1999, p. 26). Note what is being criticised: not guessing — <strong>guessing without the checking steps</strong>.</li>
<li><strong>Which is why the last bullet is not a contradiction.</strong> "Educated guesses, hypotheses or approximations can be very useful INITIAL strategies" — the word <em>initial</em> does all the work. A guess is a legitimate place to start and an illegitimate place to stop.</li>
<li><strong>Applied at FPTU.</strong> In a maths or physics exam, write the assumption line ("assume the list is already sorted; check this after"), keep going, then verify. In code, that is exactly what a stub or a mock is: a stated approximation you commit to now and replace later. Writing the assumption down is what turns a guess into a hypothesis.</li>
<li><strong>Applied to SWP391.</strong> "If we stub the auth API, three tasks unblock" is a hypothesis with a one-afternoon test. "It'll be fine, we'll catch up" is a guess with no test — and it is exactly the behaviour Whimbey &amp; Lochhead describe.</li>
</ul>
<p class="meo">💡 Three words worth separating in your head: <strong>guess</strong> (no working) → <strong>approximation</strong> (roughly right, knowingly imprecise) → <strong>hypothesis</strong> (specific and testable). The MOOC accepts all three as <em>starting</em> moves; only the last one is also an <em>ending</em> move.</p>
<p class="pitfall">⚠️ Common misreading: that this slide is anti-guessing. It is not. It is anti-<em>unchecked</em> guessing. Exam options that say "never guess" contradict the slide's own final bullet.</p>`,
        `<p class="y-chinh">🎯 Một slide nối tiếp không có tiêu đề riêng, mở đầu đơn giản bằng <strong>Justify your ideas</strong> (biện hộ cho ý tưởng của bạn), với bốn ý con: <strong>trình ra ĐƯỜNG ĐI của lời giải chứ không chỉ kết quả/mục tiêu</strong> · <strong>lần ngược lại vở ghi, giáo trình hoặc bài giảng để tra cứu</strong> · một câu trích của Whimbey &amp; Lochhead · <strong>phỏng đoán có căn cứ, giả thuyết hoặc phép xấp xỉ có thể là chiến lược KHỞI ĐẦU rất hữu ích</strong>.</p>
<ul>
<li><strong>"Trình ra đường đi chứ không chỉ kết quả" là một chỉ dẫn về ĐIỂM SỐ.</strong> Ở gần như mọi môn định lượng, phần trình bày mới gánh phần lớn điểm. Một con số cuối cùng đúng mà không có lời giải có thể được ít điểm hơn một con số sai kèm phương pháp rõ ràng — vì rubric đang chấm LẬP LUẬN, không chấm phép tính.</li>
<li><strong>"Lần ngược lại vở ghi, giáo trình hoặc bài giảng" chính là khẳng định ở slide 43, nhưng đã thành thao tác.</strong> Nếu mọi công cụ đều là thứ bạn đã được dạy thì vở của bạn là một bảng tra HỮU HẠN cho cái công cụ đang thiếu. Ba nơi được gọi tên: vở ghi, giáo trình, bài giảng.</li>
<li><strong>Nguyên văn câu trích:</strong> <em>"Poor problem solvers tend to jump to conclusions and guess answers without going through all the steps needed to make sure that the answers are accurate"</em> (Whimbey &amp; Lochhead, 1999, tr. 26). Để ý cái bị phê phán: KHÔNG phải việc đoán — mà là <strong>đoán rồi bỏ qua các bước kiểm</strong>.</li>
<li><strong>Chính vì thế gạch cuối cùng không hề mâu thuẫn.</strong> "Phỏng đoán có căn cứ, giả thuyết hoặc xấp xỉ có thể là chiến lược KHỞI ĐẦU rất hữu ích" — chữ <em>khởi đầu</em> gánh toàn bộ ý nghĩa. Một phỏng đoán là chỗ BẮT ĐẦU hợp lệ và là chỗ DỪNG LẠI không hợp lệ.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trong bài thi toán hay lý, hãy viết hẳn dòng giả định ("giả sử danh sách đã được sắp; kiểm lại sau"), đi tiếp, rồi quay về kiểm. Trong lập trình thì đó đúng là stub hay mock: một phép xấp xỉ được tuyên bố rõ, dùng tạm bây giờ và thay sau. Chính việc VIẾT giả định ra là thứ biến một phỏng đoán thành một giả thuyết.</li>
<li><strong>Áp vào SWP391.</strong> "Nếu dựng stub cho API đăng nhập thì ba task thông" là một giả thuyết có phép kiểm gói trong một buổi chiều. "Kệ đi, rồi sẽ đuổi kịp thôi" là một phỏng đoán không có phép kiểm nào — và đó chính xác là cái hành vi mà Whimbey &amp; Lochhead mô tả.</li>
</ul>
<p class="meo">💡 Ba chữ đáng tách bạch trong đầu: <strong>guess</strong> (không có lời giải) → <strong>approximation</strong> (đúng đại khái, biết rõ là không chính xác) → <strong>hypothesis</strong> (cụ thể và kiểm được). MOOC chấp nhận cả ba làm nước đi KHỞI ĐẦU; chỉ cái cuối cùng mới đồng thời là nước đi KẾT THÚC.</p>
<p class="pitfall">⚠️ Cách hiểu sai thường gặp: cho rằng slide này chống lại việc đoán. Không phải. Nó chống lại việc đoán mà KHÔNG KIỂM. Đáp án nào nói "không bao giờ được đoán" là mâu thuẫn với chính gạch cuối của slide.</p>`],

      [46, 'Be prepared to change your ideas',
        `<p class="y-chinh">🎯 Two sub-points under the heading <strong>Be prepared to change your ideas</strong>: <strong>a large part of academic study is the ability to change your ideas based on research and critical thought</strong>, and <strong>your knowledge of a subject will both grow and change</strong>.</p>
<ul>
<li><strong>Read the qualifier: change based on RESEARCH and CRITICAL THOUGHT.</strong> Not based on who spoke loudest in the meeting, not based on fatigue. The slide is licensing revision, not surrender. Changing your mind for a reason is scholarship; changing it under pressure is something else.</li>
<li><strong>"Both grow AND change" is two different things.</strong> Growing = you know more than before. Changing = some of what you knew was wrong and has been replaced. Students accept the first easily and resent the second — but the second is where actual learning shows.</li>
<li><strong>Why this slide sits between "justify" and "evaluate".</strong> Slide 45 told you to commit to an idea and defend it; slide 47 will tell you to judge your strategy. This one prevents the obvious failure mode in between: defending an idea so well that you cannot abandon it. That is the sunk-cost trap, and it is the most expensive bias in group projects.</li>
<li><strong>Applied at FPTU.</strong> Week 6 of SWP391: the architecture you chose in week 2 is clearly wrong. Changing it costs three days. Not changing it costs the rest of the semester. The bias to protect is the one that whispers "we've already put so much work into this" — the work already spent is gone either way, and it should not vote.</li>
<li><strong>Applied to your own draft.</strong> If your literature review changed your mind about the thesis, say so in the report. A report that documents a changed position reads as evidence of thinking; one that never wavers reads as evidence of not having looked.</li>
</ul>
<p class="meo">💡 Pair this with slide 31's fourth item, "problem solving as an ongoing feedback loop". Being willing to change your ideas is what makes a loop a loop instead of a circle you keep walking.</p>`,
        `<p class="y-chinh">🎯 Hai ý con dưới tiêu đề <strong>Be prepared to change your ideas</strong> (hãy sẵn sàng thay đổi ý của mình): <strong>một phần lớn của việc học ở đại học chính là khả năng thay đổi ý tưởng dựa trên nghiên cứu và tư duy phản biện</strong>, và <strong>kiến thức của bạn về một môn sẽ vừa LỚN LÊN vừa THAY ĐỔI</strong>.</p>
<ul>
<li><strong>Đọc kỹ vế điều kiện: thay đổi dựa trên NGHIÊN CỨU và TƯ DUY PHẢN BIỆN.</strong> Không phải dựa vào ai nói to nhất trong buổi họp, không phải dựa vào cơn mệt. Slide đang cấp phép cho việc XÉT LẠI, không phải cho việc đầu hàng. Đổi ý vì một lý do là học thuật; đổi ý vì bị ép là chuyện khác.</li>
<li><strong>"Vừa lớn lên VÀ vừa thay đổi" là hai chuyện khác nhau.</strong> Lớn lên = bạn biết nhiều hơn trước. Thay đổi = một phần thứ bạn từng biết là SAI và đã bị thay thế. Sinh viên chấp nhận vế đầu rất dễ và ấm ức với vế sau — nhưng vế sau mới là chỗ việc học thật sự lộ ra.</li>
<li><strong>Vì sao slide này nằm giữa "biện hộ" và "đánh giá".</strong> Slide 45 bảo bạn cam kết với một ý và bảo vệ nó; slide 47 sẽ bảo bạn phán xét chiến lược của mình. Slide này chặn đúng cái kiểu hỏng nằm ở giữa: bảo vệ một ý tưởng giỏi tới mức không còn bỏ nổi nó. Đó là bẫy chi phí chìm, và là thiên kiến đắt tiền nhất trong đồ án nhóm.</li>
<li><strong>Áp dụng ở FPTU.</strong> Tuần 6 của SWP391: kiến trúc bạn chọn từ tuần 2 rõ ràng là sai. Đổi nó tốn ba ngày. Không đổi nó tốn cả phần còn lại của học kỳ. Cái thiên kiến cần đề phòng là cái thì thầm rằng "mình đã đổ bao nhiêu công vào đây rồi" — công đã bỏ ra thì đằng nào cũng mất rồi, và nó KHÔNG có quyền bỏ phiếu.</li>
<li><strong>Áp vào chính bản nháp của bạn.</strong> Nếu phần tổng quan tài liệu làm bạn đổi ý về luận điểm, hãy NÓI RA điều đó trong báo cáo. Một báo cáo ghi lại một lập trường đã thay đổi đọc như bằng chứng của việc có suy nghĩ; một báo cáo không hề lung lay đọc như bằng chứng của việc chưa hề nhìn.</li>
</ul>
<p class="meo">💡 Ghép slide này với mục thứ tư của slide 31, "giải quyết vấn đề như một vòng lặp phản hồi liên tục". Chính sự sẵn lòng đổi ý mới làm cho cái vòng là VÒNG LẶP chứ không phải một đường tròn bạn cứ đi mãi.</p>`],

      [47, 'Evaluate the strategy — pick and choose which strategies you use and when',
        `<p class="y-chinh">🎯 Two sub-points under <strong>Evaluate the strategy</strong>: <strong>guessing an answer or writing down everything you know can be confusing</strong>, and <strong>pick and choose which strategies you use and when</strong>.</p>
<ul>
<li><strong>This slide audits the two techniques the section just recommended.</strong> Slide 44 said write down what you know; slide 45 said an educated guess is a useful start. Slide 47 adds the limit: <em>both can backfire</em>. A MOOC that criticises its own advice two slides later is telling you the advice is conditional, and "conditional" is exactly what the exam will test.</li>
<li><strong>Why "writing down everything you know" can hurt.</strong> An undifferentiated dump has no signal. Forty facts with no priority is harder to act on than five relevant ones — you have moved the problem from "I don't know anything" to "I can't see anything", which is not obviously progress.</li>
<li><strong>"Pick and choose … and when" adds a TIME dimension.</strong> It is not only which tool, it is at which moment. Brainstorming belongs at the start; a decision matrix belongs after you have candidates; checking the rubric belongs at the start AND the end. The right tool at the wrong moment is a wasted hour.</li>
<li><strong>This is metacognition — thinking about your own thinking.</strong> The skill is not owning many strategies; it is noticing, mid-task, that the current one is not producing and switching. That noticing is what slide 50 will call one of the things experts can do.</li>
</ul>
<table>
<tr><th>Situation</th><th>Right strategy</th><th>Wrong strategy here</th></tr>
<tr><td>Blank page, no idea where to begin</td><td>Brainstorm / mind map — start with the obvious</td><td>A decision matrix (nothing to score yet)</td></tr>
<tr><td>Ten candidate options, group disagreeing</td><td>Weighted decision matrix (slide 28)</td><td>More brainstorming — you already have enough</td></tr>
<tr><td>Problem statement feels slippery</td><td>Define key terms · identify the "real problem"</td><td>Guessing an answer — you would be guessing at the wrong question</td></tr>
<tr><td>Two hours before submission</td><td>Check the marking criteria as a checklist</td><td>Rethinking the approach — too late to be useful</td></tr>
</table>
<p class="meo">💡 One-line version: <strong>which strategy, and when</strong>. Two dimensions, and the "when" is the one students forget.</p>
<p class="pitfall">⚠️ This slide has no title of its own on screen — it is a continuation of the "Start With What You Know" sequence that began on slide 43. Do not file "evaluate the strategy" under section 3.3; it belongs to 3.2a, and slide 48's summary confirms it.</p>`,
        `<p class="y-chinh">🎯 Hai ý con dưới đề mục <strong>Evaluate the strategy</strong> (đánh giá chiến lược): <strong>đoán đại một đáp án hoặc viết ra tất tần tật những gì mình biết đều CÓ THỂ gây rối</strong>, và <strong>hãy chọn lọc xem dùng chiến lược nào và dùng LÚC NÀO</strong>.</p>
<ul>
<li><strong>Slide này đi soát lại chính hai kỹ thuật mà mục vừa khuyên dùng.</strong> Slide 44 bảo hãy viết ra cái mình biết; slide 45 bảo một phỏng đoán có căn cứ là khởi đầu hữu ích. Slide 47 thêm cái giới hạn: <em>cả hai đều có thể phản tác dụng</em>. Một MOOC phê bình lời khuyên của chính nó sau hai slide là đang báo cho bạn biết lời khuyên đó CÓ ĐIỀU KIỆN, mà "có điều kiện" đúng là thứ đề thi sẽ hỏi.</li>
<li><strong>Vì sao "viết ra tất cả những gì mình biết" lại có hại.</strong> Một đống đổ ra không phân loại thì không có tín hiệu nào. Bốn mươi dữ kiện không có thứ tự ưu tiên khó hành động hơn năm dữ kiện liên quan — bạn vừa dời vấn đề từ "tôi chẳng biết gì" sang "tôi chẳng nhìn ra gì", và đó chưa chắc là tiến bộ.</li>
<li><strong>"Chọn lọc … và LÚC NÀO" thêm vào chiều THỜI GIAN.</strong> Không chỉ là dùng công cụ nào, mà là dùng ở thời điểm nào. Brainstorm thuộc về lúc mở màn; ma trận quyết định thuộc về lúc đã có các ứng viên; đọc rubric thuộc về CẢ lúc mở màn LẪN lúc kết thúc. Đúng công cụ mà sai thời điểm là một tiếng đồng hồ đổ đi.</li>
<li><strong>Đây là SIÊU NHẬN THỨC — nghĩ về chính cách mình đang nghĩ.</strong> Kỹ năng không nằm ở chỗ sở hữu nhiều chiến lược; nó nằm ở chỗ nhận ra GIỮA CHỪNG rằng cái đang dùng không đẻ ra kết quả và đổi sang cái khác. Chính cái "nhận ra" đó là điều mà slide 50 sẽ gọi là một trong những việc chuyên gia làm được.</li>
</ul>
<table>
<tr><th>Tình huống</th><th>Chiến lược ĐÚNG</th><th>Chiến lược SAI ở đây</th></tr>
<tr><td>Trang giấy trắng, không biết bắt đầu từ đâu</td><td>Brainstorm / mind map — bắt đầu từ cái hiển nhiên</td><td>Ma trận quyết định (đã có gì đâu mà chấm)</td></tr>
<tr><td>Mười phương án ứng viên, nhóm đang cãi nhau</td><td>Ma trận quyết định có trọng số (slide 28)</td><td>Brainstorm tiếp — đã đủ ý rồi</td></tr>
<tr><td>Phát biểu vấn đề nghe trơn tuột, mơ hồ</td><td>Định nghĩa từ khoá · tìm "vấn đề thật"</td><td>Đoán đại một đáp án — sẽ là đoán cho một câu hỏi sai</td></tr>
<tr><td>Còn hai tiếng nữa tới hạn nộp</td><td>Soi tiêu chí chấm như một checklist</td><td>Nghĩ lại cách tiếp cận — muộn quá rồi, không còn tác dụng</td></tr>
</table>
<p class="meo">💡 Bản một dòng: <strong>chiến lược nào, và lúc nào</strong>. Hai chiều, và chiều "lúc nào" là chiều sinh viên hay quên.</p>
<p class="pitfall">⚠️ Slide này không có tiêu đề riêng trên màn hình — nó là phần nối tiếp của chuỗi "Start With What You Know" bắt đầu từ slide 43. ĐỪNG xếp "evaluate the strategy" vào mục 3.3; nó thuộc 3.2a, và slide tóm tắt 48 xác nhận điều đó.</p>`],

      [48, 'Summary: Start With What You Know (five bullets — and two things it drops)',
        `<p class="y-chinh">🎯 The section summary, <strong>five</strong> bullets: the Bransford &amp; Stein quote · "lecturers will rarely ask…" · <strong>Justify your ideas</strong> · <strong>Be prepared to change your ideas</strong> · <strong>Evaluate the strategy</strong>.</p>
<table>
<tr><th>#</th><th>Summary bullet</th><th>Came from</th></tr>
<tr><td>1</td><td>Problem solving skills "often depend on specialised knowledge in a discipline" (Bransford &amp; Stein, 1993, p. 4)</td><td>Slide 43, bullet 1</td></tr>
<tr><td>2</td><td>Lecturers will rarely ask you to do a problem using information and strategies they haven't addressed in the course or prerequisite courses</td><td>Slide 43, bullet 3</td></tr>
<tr><td>3</td><td>Justify your ideas</td><td>Slide 45</td></tr>
<tr><td>4</td><td>Be prepared to change your ideas</td><td>Slide 46</td></tr>
<tr><td>5</td><td>Evaluate the strategy</td><td>Slide 47</td></tr>
</table>
<ul>
<li><strong>Two things the summary silently drops.</strong> "Move from knowledge-lean to knowledge-rich problem solvers" (slide 43) and the whole <strong>"What do I know?" / mind maps, concept-maps, brainstorming</strong> block (slide 44) do not appear. Revise only from this slide and you lose the section's two most distinctive pieces of vocabulary.</li>
<li><strong>Bullets 3–5 are the three verbs that close the section.</strong> Justify → Change → Evaluate. Notice the sequence is deliberately uncomfortable: commit hard, then be willing to abandon, then judge the method itself. That is the honest shape of academic work.</li>
<li><strong>Spelling note.</strong> Slide 43 printed "specialized" (American spelling, as in the original quote); this summary prints "specialised". Same quotation, same source — the deck is inconsistent, not citing two things.</li>
<li><strong>Why the Bransford &amp; Stein quote gets top billing twice.</strong> It is the premise the entire section rests on: if problem solving depends on domain knowledge, then starting from what you know is not a fallback, it is the method. Expect it in the exam.</li>
<li><strong>Applied at FPTU.</strong> Use these five as a pre-submission self-check on any assignment: Did I use what the course taught? Did I show the path? Did I let the evidence change my position? Did I ask whether my approach was the right one? Four questions, five minutes, and they catch the criticisms a marker would make.</li>
</ul>
<p class="meo">💡 Count-the-items hook for this section: outcomes = <strong>3</strong> (slide 42), summary bullets = <strong>5</strong> (this slide), mapping tools named = <strong>3</strong> (slide 44). Three numbers, all small, all askable.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt của mục, <strong>NĂM</strong> gạch đầu dòng: câu trích Bransford &amp; Stein · "giảng viên hiếm khi bắt bạn…" · <strong>Justify your ideas</strong> · <strong>Be prepared to change your ideas</strong> · <strong>Evaluate the strategy</strong>.</p>
<table>
<tr><th>#</th><th>Gạch trong slide tóm tắt</th><th>Đến từ đâu</th></tr>
<tr><td>1</td><td>Kỹ năng giải quyết vấn đề "often depend on specialised knowledge in a discipline" (Bransford &amp; Stein, 1993, tr. 4)</td><td>Slide 43, gạch 1</td></tr>
<tr><td>2</td><td>Giảng viên hiếm khi bắt bạn giải một bài bằng thông tin và chiến lược mà họ chưa dạy trong môn hoặc môn tiên quyết</td><td>Slide 43, gạch 3</td></tr>
<tr><td>3</td><td>Justify your ideas — biện hộ cho ý tưởng của bạn</td><td>Slide 45</td></tr>
<tr><td>4</td><td>Be prepared to change your ideas — sẵn sàng đổi ý</td><td>Slide 46</td></tr>
<tr><td>5</td><td>Evaluate the strategy — đánh giá chiến lược</td><td>Slide 47</td></tr>
</table>
<ul>
<li><strong>Hai thứ mà slide tóm tắt lặng lẽ BỎ RƠI.</strong> "Move from knowledge-lean to knowledge-rich problem solvers" (slide 43) và cả khối <strong>"What do I know?" / mind map, concept map, brainstorming</strong> (slide 44) đều không xuất hiện. Chỉ ôn từ slide này là mất đúng hai mảng từ vựng đặc trưng nhất của cả mục.</li>
<li><strong>Gạch 3–5 là ba động từ khép lại mục này.</strong> Biện hộ → Đổi ý → Đánh giá. Để ý trình tự cố ý gây khó chịu: cam kết cho chắc, rồi sẵn sàng vứt bỏ, rồi phán xét chính phương pháp. Đó là hình dạng thật thà của công việc học thuật.</li>
<li><strong>Ghi chú về chính tả.</strong> Slide 43 in "specialized" (lối viết Mỹ, đúng như nguyên bản trích dẫn); slide tóm tắt này in "specialised". Cùng một câu trích, cùng một nguồn — bộ slide không nhất quán chứ không phải đang dẫn hai thứ khác nhau.</li>
<li><strong>Vì sao câu trích Bransford &amp; Stein được đặt lên đầu tới hai lần.</strong> Nó là TIỀN ĐỀ mà cả mục dựa lên: nếu giải quyết vấn đề phụ thuộc vào kiến thức chuyên ngành, thì bắt đầu từ cái mình đã biết không phải phương án dự phòng, nó LÀ phương pháp. Hãy chờ gặp nó trong đề.</li>
<li><strong>Áp dụng ở FPTU.</strong> Dùng năm mục này làm bảng tự kiểm trước khi nộp bất kỳ bài nào: Mình đã dùng đúng thứ môn học dạy chưa? Mình đã trình ra đường đi chưa? Mình có để bằng chứng làm đổi lập trường của mình không? Mình có tự hỏi cách tiếp cận này có đúng không? Bốn câu hỏi, năm phút, và chúng bắt được đúng những lời phê mà người chấm sẽ viết.</li>
</ul>
<p class="meo">💡 Mẹo nhớ SỐ LƯỢNG cho mục này: mục tiêu = <strong>3</strong> (slide 42), gạch tóm tắt = <strong>5</strong> (slide này), công cụ lập sơ đồ được gọi tên = <strong>3</strong> (slide 44). Ba con số, đều nhỏ, đều hỏi được.</p>`],

      [49, '3.3a Using Specialised Knowledge (learning outcomes)',
        `<p class="y-chinh">🎯 The last section in this range, four outcomes, and three of them begin with the same verb: <strong>recognise the place of research &amp; evidence in problem-solving</strong> · <strong>recognise the utility of applying a formula in problem-solving</strong> · <strong>recognise the utility of applying a theory when problem-solving</strong> · <strong>identify ways to justify a particular formula, theory or outside tool</strong>.</p>
<table>
<tr><th>Outcome</th><th>The object being applied</th><th>Why it is listed separately</th></tr>
<tr><td>place of research &amp; evidence</td><td>Findings from outside</td><td>The general case: someone has already studied this</td></tr>
<tr><td>utility of applying a <strong>formula</strong></td><td>A computational rule</td><td>Gives an answer directly, but only if the conditions hold</td></tr>
<tr><td>utility of applying a <strong>theory</strong></td><td>An explanatory framework</td><td>Does not compute anything — it tells you what to look at</td></tr>
<tr><td>ways to <strong>justify</strong> a formula, theory or outside tool</td><td>Your choice of the above</td><td>The only outcome that is about DEFENDING, not using</td></tr>
</table>
<ul>
<li><strong>Formula vs theory is the distinction to hold.</strong> A formula produces a number; a theory produces a way of seeing. Applying a formula without the theory behind it is how you get an answer that is arithmetically perfect and conceptually meaningless.</li>
<li><strong>Outcome 4 is the academic one.</strong> Anyone can plug numbers into a formula. The university skill is saying <em>why this formula, for this situation</em> — which conditions it assumes and why they hold here. That justification is what separates a pass from a distinction in almost every report rubric.</li>
<li><strong>"Outside tool" quietly widens the scope.</strong> Beyond formulas and theories, you may bring in software, instruments, frameworks, libraries. Same obligation: justify the choice.</li>
<li><strong>How 3.3 relates to 3.2.</strong> Section 3.2 said start with what you already know. Section 3.3 says: when your own knowledge runs out, reach for the discipline's. The order matters — going to outside sources first means you never find out what you already had.</li>
<li><strong>Applied at FPTU.</strong> Choosing a library for SWP391 is exactly outcome 4. "We used JWT" is not an answer; "we used JWT because the app is stateless across three services and session storage would need shared state we do not have" is. Write the second sentence in the report — it is a marked criterion.</li>
</ul>
<p class="meo">💡 Structure hook: <strong>three "recognise" + one "identify"</strong>. The odd verb out is the one about justification, and it is the one an exam is most likely to single out.</p>`,
        `<p class="y-chinh">🎯 Mục cuối cùng của dải này, bốn mục tiêu, và ba trong số đó mở đầu bằng cùng một động từ: <strong>recognise the place of research &amp; evidence in problem-solving</strong> · <strong>recognise the utility of applying a formula in problem-solving</strong> · <strong>recognise the utility of applying a theory when problem-solving</strong> · <strong>identify ways to justify a particular formula, theory or outside tool</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Thứ được đem áp dụng</th><th>Vì sao nó được liệt kê riêng</th></tr>
<tr><td>vị trí của nghiên cứu &amp; bằng chứng</td><td>Kết quả từ bên ngoài</td><td>Trường hợp tổng quát: đã có người nghiên cứu chuyện này rồi</td></tr>
<tr><td>tính hữu dụng của việc áp một <strong>CÔNG THỨC</strong></td><td>Một quy tắc tính toán</td><td>Cho ra đáp án ngay, nhưng chỉ khi các điều kiện thoả mãn</td></tr>
<tr><td>tính hữu dụng của việc áp một <strong>LÝ THUYẾT</strong></td><td>Một khung giải thích</td><td>Nó không tính ra cái gì cả — nó bảo bạn phải NHÌN vào đâu</td></tr>
<tr><td>các cách <strong>BIỆN HỘ</strong> cho một công thức, lý thuyết hay công cụ bên ngoài</td><td>Chính lựa chọn của bạn ở ba dòng trên</td><td>Mục tiêu DUY NHẤT nói về việc BẢO VỆ, không phải việc dùng</td></tr>
</table>
<ul>
<li><strong>Công thức khác lý thuyết — đây là chỗ cần giữ chắc.</strong> Công thức đẻ ra một con số; lý thuyết đẻ ra một cách nhìn. Áp công thức mà không có lý thuyết đứng sau chính là cách bạn có một đáp án hoàn hảo về số học và vô nghĩa về khái niệm.</li>
<li><strong>Mục tiêu 4 mới là mục tiêu mang tính ĐẠI HỌC.</strong> Ai cũng cắm số vào công thức được. Kỹ năng của bậc đại học là nói được <em>vì sao dùng công thức NÀY, cho tình huống NÀY</em> — nó giả định những điều kiện gì và vì sao ở đây các điều kiện đó đúng. Chính phần biện hộ đó phân cách điểm qua môn với điểm giỏi ở gần như mọi rubric báo cáo.</li>
<li><strong>Cụm "outside tool" lặng lẽ mở rộng phạm vi.</strong> Ngoài công thức và lý thuyết, bạn có thể mang vào phần mềm, thiết bị đo, framework, thư viện. Nghĩa vụ vẫn thế: biện hộ cho lựa chọn.</li>
<li><strong>3.3 quan hệ với 3.2 thế nào.</strong> Mục 3.2 nói hãy bắt đầu từ cái bạn đã biết. Mục 3.3 nói: khi vốn của bạn cạn thì với tay sang vốn của NGÀNH. Thứ tự này quan trọng — chạy ra nguồn ngoài trước nghĩa là bạn không bao giờ biết mình vốn đã có sẵn cái gì.</li>
<li><strong>Áp dụng ở FPTU.</strong> Chọn thư viện cho SWP391 chính xác là mục tiêu 4. "Nhóm em dùng JWT" không phải một câu trả lời; "nhóm em dùng JWT vì ứng dụng không giữ trạng thái trên ba dịch vụ, mà lưu session sẽ cần một kho dùng chung mà hệ thống không có" thì mới là. Hãy viết câu thứ hai vào báo cáo — đó là một tiêu chí được chấm điểm.</li>
</ul>
<p class="meo">💡 Mẹo nhớ cấu trúc: <strong>BA chữ "recognise" + MỘT chữ "identify"</strong>. Cái động từ lạc loài là cái nói về biện hộ, và đó cũng là cái đề thi dễ lôi ra hỏi riêng nhất.</p>`],

      [50, 'Experts can — four things expertise buys you (Chi, 2006; Chi, Glaser and Farr, 1988)',
        `<p class="y-chinh">🎯 Four capabilities that distinguish experts from novices: <strong>See the 'deep structure' of problems · Detect their own errors · Choose the best strategy · Solve problems faster</strong> (Chi, 2006; Chi, Glaser and Farr, 1988).</p>
<table>
<tr><th>Expert capability</th><th>What the novice does instead</th><th>Concrete example</th></tr>
<tr><td><strong>See the "deep structure"</strong></td><td>Sorts problems by surface features — the story, the wording, the numbers</td><td>A novice sees "a problem about trains" and "a problem about pipes"; an expert sees two rate problems with the same equation</td></tr>
<tr><td><strong>Detect their own errors</strong></td><td>Only finds out when the marks come back</td><td>An expert coder feels the off-by-one before running the test; a novice waits for the red output</td></tr>
<tr><td><strong>Choose the best strategy</strong></td><td>Uses the first method that comes to mind, or the most recently taught one</td><td>Recognising that recursion is cleaner here and a loop is cheaper there</td></tr>
<tr><td><strong>Solve problems faster</strong></td><td>Speed comes only from rushing</td><td>The expert's speed is a <em>result</em> of the first three, never a separate skill</td></tr>
</table>
<ul>
<li><strong>The ORDER of this list is its argument.</strong> Speed is listed last because it is the consequence, not the cause. Trying to get fast without the first three just produces confident wrong answers, quickly.</li>
<li><strong>"Deep structure" is the phrase to remember, in quotation marks.</strong> The deck marks it as a technical term. Surface structure = what the problem is dressed up as; deep structure = the underlying type. Transfer of learning happens at the deep level, which is why you can solve a problem you have never seen in a domain you know.</li>
<li><strong>"Detect their own errors" is the one that is trainable this week.</strong> It is checking, made into a habit: re-read the question after answering, re-derive the number by a second method, run the edge case. Slide 31's item 3 ("use different strategies and compare the results") is the mechanism.</li>
<li><strong>Expertise here is domain-specific, not general.</strong> An expert in algorithms is a novice in accounting. This is the same claim as Bransford &amp; Stein on slide 43 — which is exactly why the deck puts "Experts can" inside the <em>Specialised Knowledge</em> section.</li>
<li><strong>Applied at FPTU.</strong> After every PE or lab, spend ten minutes labelling the problem type ("this was a two-pointer", "this was a many-to-many join"). Building that library of types is literally how the first capability is acquired — and it is the only one of the four you can practise deliberately.</li>
</ul>
<p class="meo">💡 Count: <strong>four</strong> capabilities. Remember them as three abilities plus one by-product: <em>see deep · self-check · choose well</em> → therefore <em>fast</em>.</p>`,
        `<p class="y-chinh">🎯 Bốn năng lực phân biệt chuyên gia với người mới: <strong>Nhìn ra "cấu trúc sâu" của bài toán · Tự phát hiện lỗi của chính mình · Chọn được chiến lược tốt nhất · Giải nhanh hơn</strong> (Chi, 2006; Chi, Glaser and Farr, 1988).</p>
<table>
<tr><th>Năng lực của chuyên gia</th><th>Người mới làm gì thay vào đó</th><th>Ví dụ cụ thể</th></tr>
<tr><td><strong>Nhìn ra "cấu trúc sâu"</strong></td><td>Phân loại bài theo vẻ bề ngoài — câu chuyện, cách hành văn, các con số</td><td>Người mới thấy "bài về tàu hoả" và "bài về đường ống"; chuyên gia thấy hai bài toán tốc độ cùng một phương trình</td></tr>
<tr><td><strong>Tự phát hiện lỗi của mình</strong></td><td>Chỉ biết khi bảng điểm trả về</td><td>Người viết code giỏi CẢM thấy lỗi lệch-một trước khi chạy test; người mới ngồi chờ dòng chữ đỏ</td></tr>
<tr><td><strong>Chọn chiến lược tốt nhất</strong></td><td>Dùng phương pháp đầu tiên nảy ra trong đầu, hoặc cái vừa học gần nhất</td><td>Nhận ra ở đây đệ quy gọn hơn, còn ở kia vòng lặp rẻ hơn</td></tr>
<tr><td><strong>Giải nhanh hơn</strong></td><td>Tưởng nhanh chỉ đến từ việc làm vội</td><td>Tốc độ của chuyên gia là <em>HỆ QUẢ</em> của ba điều trên, không bao giờ là một kỹ năng riêng</td></tr>
</table>
<ul>
<li><strong>THỨ TỰ của danh sách này chính là lập luận của nó.</strong> Tốc độ được xếp cuối vì nó là hệ quả, không phải nguyên nhân. Cố nhanh mà thiếu ba cái đầu thì chỉ đẻ ra những câu trả lời sai đầy tự tin, một cách nhanh chóng.</li>
<li><strong>"Deep structure" là cụm phải nhớ, kèm cả cặp nháy.</strong> Bộ slide đánh dấu nó như một thuật ngữ kỹ thuật. Cấu trúc bề mặt = cái vỏ mà bài toán khoác lên; cấu trúc sâu = DẠNG bài nằm bên dưới. Sự chuyển giao việc học xảy ra ở tầng sâu, và đó là lý do bạn giải được một bài chưa từng gặp trong một lĩnh vực bạn nắm.</li>
<li><strong>"Tự phát hiện lỗi" là cái RÈN ĐƯỢC NGAY TUẦN NÀY.</strong> Nó là việc kiểm tra, biến thành thói quen: đọc lại đề sau khi trả lời, dựng lại con số bằng một cách thứ hai, chạy thử trường hợp biên. Mục 3 của slide 31 ("dùng nhiều chiến lược và so kết quả") chính là cơ chế của nó.</li>
<li><strong>Chuyên môn ở đây gắn với LĨNH VỰC, không phải chung chung.</strong> Một chuyên gia giải thuật là một người mới trong kế toán. Đây đúng là khẳng định của Bransford &amp; Stein ở slide 43 — và cũng đúng là lý do bộ slide đặt "Experts can" nằm trong mục <em>Specialised Knowledge</em>.</li>
<li><strong>Áp dụng ở FPTU.</strong> Sau mỗi buổi PE hay lab, bỏ mười phút dán nhãn DẠNG bài ("cái này là hai con trỏ", "cái này là join nhiều-nhiều"). Xây cái thư viện dạng bài đó chính là cách năng lực thứ nhất được hình thành — và đó cũng là cái duy nhất trong bốn cái mà bạn luyện có chủ đích được.</li>
</ul>
<p class="meo">💡 Đếm: <strong>BỐN</strong> năng lực. Nhớ theo kiểu ba khả năng cộng một sản phẩm phụ: <em>nhìn sâu · tự kiểm · chọn khéo</em> → cho nên <em>nhanh</em>.</p>`],

      [51, 'Specialised Knowledge — routine problems, and the five kinds of outside source',
        `<p class="y-chinh">🎯 The closing slide of this range: specialised knowledge is <strong>important for solving routine problems in particular fields</strong>, and you <strong>draw upon outside sources</strong> — named as <strong>Formulas · Experiments · Reports · Case Studies · Theories</strong>. Five, and the count is very askable.</p>
<table>
<tr><th>Outside source</th><th>What it gives you</th><th>Where you meet it at FPTU</th></tr>
<tr><td><strong>Formulas</strong></td><td>A direct computation, valid under stated conditions</td><td>Big-O bounds, statistics, finance, physics</td></tr>
<tr><td><strong>Experiments</strong></td><td>Evidence produced on purpose, under control</td><td>A benchmark you run yourself; an A/B test; a lab measurement</td></tr>
<tr><td><strong>Reports</strong></td><td>Findings compiled by an organisation or industry</td><td>Industry whitepapers, standards documents, government statistics</td></tr>
<tr><td><strong>Case Studies</strong></td><td>One situation described in depth — what happened and why</td><td>How a company migrated to microservices; a failed project post-mortem</td></tr>
<tr><td><strong>Theories</strong></td><td>An explanatory framework that tells you what matters</td><td>Normalisation theory, queueing theory, the design-thinking models on slides 26–29</td></tr>
</table>
<ul>
<li><strong>"ROUTINE problems in PARTICULAR fields" is a careful, limited claim.</strong> Specialised knowledge is for problems the field has met before. It is not a claim that domain knowledge solves novel problems by itself — those need the understanding and strategy work of sections 3.1 and 3.2 as well.</li>
<li><strong>The five sources sit on a ladder of generality.</strong> A formula is the most compressed and the most conditional; a theory is the most general and the least directly usable; experiments, reports and case studies sit in between, trading specificity for transferability. Knowing where a source sits tells you how far you may carry its conclusion.</li>
<li><strong>Case studies are the odd one out and the most misused.</strong> One case is evidence about one case. It is superb for generating hypotheses and for illustrating a mechanism, and weak as proof — a distinction Mooc 1's work on evaluating sources was training you for.</li>
<li><strong>Every one of the five must be cited.</strong> The moment you draw on an outside source you are in referencing territory (Mooc 1, sections 4.1–4.2). Using a formula from a textbook without attribution is the same category of error as quoting a sentence without quotation marks.</li>
<li><strong>Applied at FPTU.</strong> For a SWR302 or capstone report, deliberately aim to include more than one kind: a theory to frame the problem, a report or case study for context, and your own experiment (a benchmark, a user test) for evidence. A report resting on a single kind of source reads thin no matter how long it is.</li>
<li><strong>Closing the range.</strong> Slides 26–51 took you from three competing models of problem solving, through defining the problem accurately and reading the rubric, to starting from your own knowledge and then borrowing the discipline's. Everything after this builds on that sequence.</li>
</ul>
<p class="meo">💡 Count-the-items recap for the whole range — <strong>Dewey 5 · design thinking 4 · USEE 4 · slide 31's list 4 · understanding strategies 4 · rubric criteria 2 · section 3.2 outcomes 3 · section 3.2 summary 5 · experts 4 · outside sources 5</strong>. If you can produce those ten numbers, you can reconstruct the whole range.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại dải này: kiến thức chuyên ngành <strong>quan trọng cho việc giải các bài toán THƯỜNG QUY trong những lĩnh vực cụ thể</strong>, và bạn <strong>mượn từ các nguồn bên ngoài</strong> — được gọi tên là <strong>Formulas · Experiments · Reports · Case Studies · Theories</strong>. NĂM cái, và con số này rất dễ bị hỏi.</p>
<table>
<tr><th>Nguồn bên ngoài</th><th>Nó cho bạn cái gì</th><th>Gặp ở đâu tại FPTU</th></tr>
<tr><td><strong>Formulas — công thức</strong></td><td>Một phép tính trực tiếp, đúng trong những điều kiện đã nêu</td><td>Cận Big-O, thống kê, tài chính, vật lý</td></tr>
<tr><td><strong>Experiments — thí nghiệm</strong></td><td>Bằng chứng do chính mình tạo ra có chủ đích, trong điều kiện kiểm soát</td><td>Một phép đo hiệu năng bạn tự chạy; một thử nghiệm A/B; một phép đo trong phòng lab</td></tr>
<tr><td><strong>Reports — báo cáo</strong></td><td>Kết quả được một tổ chức hay cả ngành tổng hợp lại</td><td>Whitepaper của ngành, tài liệu tiêu chuẩn, số liệu nhà nước</td></tr>
<tr><td><strong>Case Studies — nghiên cứu tình huống</strong></td><td>MỘT tình huống được mô tả thật sâu — chuyện gì đã xảy ra và vì sao</td><td>Một công ty chuyển sang microservices ra sao; biên bản mổ xẻ một dự án thất bại</td></tr>
<tr><td><strong>Theories — lý thuyết</strong></td><td>Một khung giải thích nói cho bạn biết cái gì mới đáng quan tâm</td><td>Lý thuyết chuẩn hoá CSDL, lý thuyết hàng đợi, chính các mô hình ở slide 26–29</td></tr>
</table>
<ul>
<li><strong>"Bài toán THƯỜNG QUY trong những lĩnh vực CỤ THỂ" là một khẳng định thận trọng và có giới hạn.</strong> Kiến thức chuyên ngành dành cho những bài mà lĩnh vực đó đã từng gặp. Nó KHÔNG khẳng định rằng riêng kiến thức chuyên ngành giải được bài toán mới lạ — những bài đó còn cần phần hiểu vấn đề và lập chiến lược của mục 3.1 và 3.2 nữa.</li>
<li><strong>Năm nguồn này nằm trên một cái thang từ cụ thể tới tổng quát.</strong> Công thức là thứ nén chặt nhất và cũng nhiều điều kiện kèm theo nhất; lý thuyết là thứ tổng quát nhất và khó dùng trực tiếp nhất; thí nghiệm, báo cáo và case study nằm ở giữa, đánh đổi tính cụ thể lấy tính áp dụng rộng. Biết một nguồn đứng ở đâu trên thang đó là biết được phép mang kết luận của nó đi xa tới đâu.</li>
<li><strong>Case study là cái lạc loài và cũng là cái bị dùng sai nhiều nhất.</strong> Một tình huống là bằng chứng về đúng một tình huống. Nó tuyệt vời để SINH RA giả thuyết và để minh hoạ một cơ chế, nhưng YẾU khi làm bằng chứng chứng minh — đúng cái phân biệt mà phần đánh giá nguồn của Mooc 1 rèn cho bạn.</li>
<li><strong>Cả năm loại đều PHẢI ghi nguồn.</strong> Ngay khoảnh khắc bạn mượn một nguồn bên ngoài là bạn đã bước vào địa hạt trích dẫn (Mooc 1, mục 4.1–4.2). Dùng một công thức trong giáo trình mà không ghi nguồn cùng loại lỗi với việc chép một câu văn mà không đóng ngoặc kép.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với báo cáo SWR302 hay đồ án tốt nghiệp, hãy CỐ Ý dùng nhiều hơn một loại: một lý thuyết để đóng khung vấn đề, một báo cáo hoặc case study để có bối cảnh, và một thí nghiệm của chính bạn (một phép đo hiệu năng, một buổi thử với người dùng) để có bằng chứng. Một báo cáo chỉ dựa trên một loại nguồn thì đọc vẫn mỏng, dài bao nhiêu cũng vậy.</li>
<li><strong>Khép lại cả dải.</strong> Slide 26–51 đưa bạn từ ba mô hình giải quyết vấn đề cạnh tranh nhau, qua việc định nghĩa vấn đề cho chính xác và đọc rubric, tới việc bắt đầu từ vốn của chính mình rồi mới mượn vốn của ngành. Mọi thứ phía sau đều dựng trên trình tự đó.</li>
</ul>
<p class="meo">💡 Ôn lại SỐ LƯỢNG của cả dải — <strong>Dewey 5 · design thinking 4 · USEE 4 · danh sách slide 31 là 4 · chiến lược hiểu vấn đề 4 · tiêu chí rubric 2 · mục tiêu mục 3.2 là 3 · tóm tắt mục 3.2 là 5 · chuyên gia 4 · nguồn bên ngoài 5</strong>. Tái hiện được mười con số đó là dựng lại được cả dải slide.</p>`],

    ]),
  ].join('\n'),
};
