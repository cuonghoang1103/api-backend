/**
 * SSL101c · Mooc 4 (deck 'ssl4') — slide 44→64, hết deck.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). /tmp/ssl101c-text/ssl4.txt báo "không có chữ" cho CẢ 21 slide của đoạn
 * này — KHÔNG dùng được. Toàn bộ 21 ảnh 044–064 đã được ĐỌC THẲNG từ
 * /tmp/ssl101c-slides/ssl4/NNN.webp, chữ chép lại đúng từng dòng.
 *
 * ⚠️ NỘI DUNG THẬT của dải 44–64 (đọc ảnh rồi mới đặt tên, không đoán trước):
 *   · 44–48: KHÉP phần VIẾT — 4.3a hoàn thiện bài luận + tóm tắt; 4.3c hình
 *     minh hoạ trong bài viết + tóm tắt; và tóm tắt "Editing for language"
 *     (4.3b) đứng SAU tóm tắt của 4.3c
 *   · 49–50: 4.4a định dạng & soát bản in trước khi nộp + tóm tắt 7 mục
 *   · 51–54: 5.2a/5.2b hiểu–nghiên cứu–lập cấu trúc bài thuyết trình + 2 tóm tắt
 *   · 55–60: 5.3a/5.3b/5.3c chuẩn bị hình ảnh · viết kịch bản · luyện tập,
 *     mỗi mục một tóm tắt
 *   · 61–64: 5.4a/5.4b trình bày · tương tác khán giả & tìm phong cách riêng,
 *     mỗi mục một tóm tắt. Slide 64 khép Mooc 4.
 *
 * Đặc tính của chính file .pptx, đã đối chiếu đủ 21 ảnh — bài này nói thẳng,
 * KHÔNG giả vờ các slide lặp là nội dung mới:
 *   · LẶP NGUYÊN VĂN khối chuẩn đầu ra: 46 ≡ 44 · 53 ≡ 51 (chỉ đổi "&"→"and")
 *     · 57 ≡ 59 ≡ 55 · 63 ≡ 61 (ĐẢO thứ tự gạch 2↔3). 5/21 slide là bản lặp;
 *     khối lượng THẬT chỉ còn 16 trang (11 tóm tắt + 5 khối chuẩn đầu ra khác
 *     nhau).
 *   · ĐÁNH SỐ NHẢY CÓC: có 4.3a và 4.3c nhưng KHÔNG có slide chuẩn đầu ra của
 *     4.3b — chỉ còn mỗi tóm tắt "Editing for language" (48), lại đứng SAU tóm
 *     tắt của 4.3c. Dải này cũng nhảy thẳng từ 4.4a sang 5.2a (không có 5.1),
 *     và 4.4 chỉ có "a", không có 4.4b.
 *   · ĐỔI TÊN giữa slide chuẩn đầu ra và slide tóm tắt: 53 "Planning the
 *     Structure of Presentations" → 54 "Planning presentations" (cắt cụt);
 *     55 "Preparing Visual Aids" → 56 "Preparing Visual Aids for Presentations"
 *     (thêm chữ); 61 "Delivering Your Presentation" → 62 "Delivering engaging
 *     presentations"; 63 "Facilitating Audience Interaction & Finding Your
 *     Style" → 64 "Audience Engagement & Finding your Own Style".
 *   · LỆCH NĂM NGUỒN TRÍCH: Duarte 2010 (slide 54) ↔ Duarte 2008 (slide 56);
 *     Burke 2013 (50, 60, 62) ↔ Burke 2012 (64). Và "Reinders et al., 2008"
 *     (58, 60, 62) ↔ "Reinders, Moore & Lewis, 2008" (64).
 *   · TEMPLATE KHÁC: 44, 45, 48, 49, 50 KHÔNG có khiên logo Sydney (44 và 49
 *     còn có chân trang "Page 1"); từ 51 trở đi mới nhất quán có khiên.
 *   · VÊNH SỐ LƯỢNG: 44 nêu BỐN chuẩn đầu ra nhưng tóm tắt 45 chỉ gói BA đề
 *     mục; 51 nêu BỐN nhưng tóm tắt 52 chỉ có HAI đề mục.
 *   · LỖI CHÍNH TẢ/KHÔNG NHẤT QUÁN: tiêu đề 59 viết "Practising" (Anh-Anh)
 *     trong khi gạch đầu dòng của chính nó viết "practice ... delivery".
 * Giữ nguyên chữ trên slide, KHÔNG tự sửa — chỉ nêu ở phần Đáp án/Bẫy.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl4';

export default {
  title: '4.0c — Slide by slide: polishing essays, formatting, and presentations from research to Q&A (slides 44–64)|||4.0c — Slide bài giảng: hoàn thiện bài viết, định dạng & thuyết trình từ nghiên cứu tới hỏi đáp (slide 44–64)',
  slug: 'ssl101c-4-0c-slides-hoan-thien-bai-viet-va-thuyet-trinh',
  type: 'DOCUMENT',
  description: 'Đoạn cuối Mooc 4 của SSL101c (slide 44–64), đọc thẳng từ 21 ảnh slide gốc University of Sydney. Khép phần VIẾT (hoàn thiện bài luận, hình minh hoạ trong bài viết, biên tập ngôn ngữ, định dạng & soát bản trước khi nộp) rồi chạy trọn vòng THUYẾT TRÌNH: hiểu đề và nghiên cứu, lập cấu trúc, chuẩn bị hình ảnh, viết kịch bản, luyện tập, trình bày và xử lý câu hỏi khán giả. Có bảng tình huống hỏi–đáp cho buổi bảo vệ đồ án SWP391 và phần tổng kết cả Mooc 4.',
  content: [
    walkHead(D, 44, 64),
    walk(D, [

      [44, '4.3a Polishing and Refining Essays (module objectives — FOUR outcomes; template with no Sydney shield)',
        `<p class="y-chinh">🎯 Section 4.3 opens the <strong>polishing</strong> phase of written work, with exactly <strong>four</strong> outcomes printed on the slide: <strong>evaluate and refine text-level structures of argumentation in written assignments</strong> · <strong>evaluate and refine paragraphs and sentences</strong> · <strong>write effective titles for different types of written assignments</strong> · <strong>compose and incorporate visual aids to present complex information in written assignments</strong>.</p>
<table>
<tr><th>#</th><th>Outcome on the slide</th><th>Zoom level</th><th>Where the deck actually covers it</th></tr>
<tr><td>1</td><td>text-level structures of argumentation</td><td>Whole essay</td><td>Slide 45 — "Essay argument structure"</td></tr>
<tr><td>2</td><td>paragraphs and sentences</td><td>Paragraph / sentence</td><td>Slide 45 — "Paragraph argument structure"</td></tr>
<tr><td>3</td><td>effective titles</td><td>One line</td><td>Slide 45 — "Essay titles"</td></tr>
<tr><td>4</td><td>visual aids for complex information</td><td>Non-text</td><td>NOT on slide 45 — pushed to 4.3c (slides 46–47)</td></tr>
</table>
<ul>
<li><strong>The four outcomes are a zoom ladder, and the order is deliberate.</strong> You refine from the outside in: first does the whole argument hold, then do the paragraphs and sentences carry it, then does the title announce it, and finally do the visuals support it. Refining a sentence inside a paragraph you are about to delete is wasted work — that is the entire reason the ladder starts at text level.</li>
<li><strong>"Polishing" is a SEPARATE PASS, not something you do while drafting.</strong> Mooc 4 keeps writing (drafting) and refining (evaluating your own draft) in different sections on purpose. Trying to do both at once is why students stall on paragraph one for an hour.</li>
<li><strong>Note the verb pair "evaluate and refine".</strong> It appears in outcomes 1 and 2 — evaluate first (judge against a criterion), then refine (change it). A student who only rewrites, without first naming what was wrong, is doing half the task.</li>
<li><strong>Count mismatch to remember.</strong> This slide promises FOUR outcomes; its own summary (slide 45) delivers only THREE headings. The fourth lives in section 4.3c. If an exam option says "the summary of Polishing and Refining Essays covers four areas", that is not what the deck prints.</li>
<li><strong>FPTU application.</strong> Your SWP391 report: pass 1 — does the report answer the brief (structure)? pass 2 — is each section coherent (paragraphs)? pass 3 — is the title informative? pass 4 — do the diagrams earn their place? Four short passes beat one long anxious reread.</li>
</ul>
<p class="pitfall">⚠️ Deck quirk, verified: this exact four-bullet block is printed AGAIN, word for word, on slide 46 under the heading "4.3c Incorporating Visual Aids". Same objectives, different section label. Also note this slide uses a template with <strong>no Sydney shield</strong> and a "Page 1" footer — a sign of slides merged in from another file.</p>
<p class="meo">💡 Memory hook: <strong>TEXT → PARAGRAPH → TITLE → VISUAL</strong>. Four rungs, outside-in.</p>`,
        `<p class="y-chinh">🎯 Mục 4.3 mở màn giai đoạn <strong>hoàn thiện (polishing)</strong> bài viết, với đúng <strong>BỐN</strong> chuẩn đầu ra in trên slide: <strong>đánh giá và tinh chỉnh cấu trúc lập luận ở cấp độ toàn văn bản</strong> · <strong>đánh giá và tinh chỉnh đoạn văn và câu</strong> · <strong>viết tiêu đề hiệu quả cho các loại bài viết khác nhau</strong> · <strong>soạn và lồng ghép hình minh hoạ để trình bày thông tin phức tạp trong bài viết</strong>.</p>
<table>
<tr><th>#</th><th>Chuẩn đầu ra trên slide</th><th>Cấp độ phóng</th><th>Deck thật sự dạy ở đâu</th></tr>
<tr><td>1</td><td>cấu trúc lập luận cấp toàn văn bản</td><td>Cả bài</td><td>Slide 45 — "Essay argument structure"</td></tr>
<tr><td>2</td><td>đoạn văn và câu</td><td>Đoạn / câu</td><td>Slide 45 — "Paragraph argument structure"</td></tr>
<tr><td>3</td><td>tiêu đề hiệu quả</td><td>Một dòng</td><td>Slide 45 — "Essay titles"</td></tr>
<tr><td>4</td><td>hình minh hoạ cho thông tin phức tạp</td><td>Phi văn tự</td><td>KHÔNG có ở slide 45 — đẩy sang 4.3c (slide 46–47)</td></tr>
</table>
<ul>
<li><strong>Bốn chuẩn đầu ra là một cái THANG PHÓNG TO–THU NHỎ, và thứ tự là có chủ ý.</strong> Bạn tinh chỉnh từ ngoài vào trong: trước hết cả lập luận có đứng được không, rồi các đoạn và câu có chở nổi lập luận đó không, rồi tiêu đề có công bố đúng nội dung không, cuối cùng hình ảnh có đỡ được không. Gọt một câu nằm trong cái đoạn mà lát nữa bạn sẽ xoá là công toi — đó chính là lý do cái thang bắt đầu từ cấp toàn văn bản.</li>
<li><strong>"Hoàn thiện" là một LƯỢT RIÊNG, không phải thứ làm xen lúc đang viết nháp.</strong> Mooc 4 cố ý tách viết nháp và tinh chỉnh ra hai mục khác nhau. Cố làm cả hai cùng lúc chính là lý do sinh viên kẹt một tiếng ở đoạn đầu tiên.</li>
<li><strong>Để ý cặp động từ "evaluate and refine".</strong> Nó xuất hiện ở chuẩn 1 và 2 — ĐÁNH GIÁ trước (đối chiếu với một tiêu chí), rồi mới SỬA. Sinh viên chỉ viết lại mà không gọi tên được cái sai là mới làm một nửa việc.</li>
<li><strong>Vênh số lượng cần nhớ.</strong> Slide này hứa BỐN chuẩn đầu ra; nhưng slide tóm tắt của chính nó (slide 45) chỉ giao BA đề mục. Cái thứ tư nằm ở mục 4.3c. Phương án thi nào nói "phần tóm tắt Polishing and Refining Essays gồm bốn mảng" là không khớp chữ in trên deck.</li>
<li><strong>Áp vào FPTU.</strong> Báo cáo SWP391: lượt 1 — báo cáo có trả lời đúng đề bài không (cấu trúc)? lượt 2 — từng mục có mạch lạc không (đoạn)? lượt 3 — tiêu đề có nói được nội dung không? lượt 4 — các sơ đồ có đáng có mặt không? Bốn lượt ngắn hơn hẳn một lượt đọc lại dài trong lo lắng.</li>
</ul>
<p class="pitfall">⚠️ Đặc tính deck, đã kiểm: đúng khối bốn gạch đầu dòng này được in LẠI, y nguyên từng chữ, ở slide 46 dưới tiêu đề "4.3c Incorporating Visual Aids". Cùng chuẩn đầu ra, khác nhãn mục. Ngoài ra slide này dùng template <strong>KHÔNG có khiên logo Sydney</strong> và có chân trang "Page 1" — dấu hiệu slide được ghép vào từ file khác.</p>
<p class="meo">💡 Mẹo nhớ: <strong>TOÀN BÀI → ĐOẠN → TIÊU ĐỀ → HÌNH</strong>. Bốn bậc, từ ngoài vào trong.</p>`],

      [45, 'Summary: Polishing and Refining Essays — essay structure, paragraph structure, essay titles (Vogan, cited in Lacchia, 2015)',
        `<p class="y-chinh">🎯 The summary of 4.3, in <strong>three</strong> headings with two sub-points each: <strong>Essay argument structure</strong> (make sure you've answered the question · check introduction, conclusion &amp; topic sentences) · <strong>Paragraph argument structure</strong> (check for coherence &amp; cohesion · check supporting evidence for arguments) · <strong>Essay titles</strong> (Declarative, Engaging &amp; Focused — <em>Vogan, cited in Lacchia, 2015</em>).</p>
<table>
<tr><th>Heading</th><th>Check 1</th><th>Check 2</th><th>What a failure looks like</th></tr>
<tr><td>Essay argument structure</td><td>Have you answered the question?</td><td>Introduction, conclusion &amp; topic sentences</td><td>A well-written essay on a slightly different question</td></tr>
<tr><td>Paragraph argument structure</td><td>Coherence &amp; cohesion</td><td>Supporting evidence for arguments</td><td>True sentences that do not add up to a claim</td></tr>
<tr><td>Essay titles</td><td colspan="2">Declarative · Engaging · Focused</td><td>"Assignment 1 — final version.docx"</td></tr>
</table>
<ul>
<li><strong>"Make sure you've answered the question" is first for a reason.</strong> It is the single most common cause of a low mark on work that is otherwise fine. Read the question again with the finished draft beside it and point, physically, to where each part of the question is answered. If you cannot point, the mark is already lost no matter how good the prose is.</li>
<li><strong>Coherence vs cohesion — the classic exam pair.</strong> <em>Coherence</em> is whether the ideas make sense together (logic). <em>Cohesion</em> is whether the sentences are linked on the surface (however, therefore, this approach, pronouns). A paragraph can be cohesive and incoherent: every sentence glued to the next, going nowhere. Distinguishing these two is worth memorising word for word.</li>
<li><strong>Introduction, conclusion and topic sentences are checked TOGETHER.</strong> Read only those lines, in order, skipping everything else. If that skeleton reads as a complete, sensible argument, the essay has structure. If it reads as a list of topics, it does not. This is a five-minute test you can run on any draft.</li>
<li><strong>The title criteria are THREE: Declarative, Engaging, Focused.</strong> <em>Declarative</em> = it states a position or finding, not just a topic. <em>Engaging</em> = a reader has a reason to continue. <em>Focused</em> = it names the specific scope, not the whole field. The attribution is unusual — <strong>Vogan, cited in Lacchia, 2015</strong> — a secondary citation, which is itself an example of the referencing rules from Mooc 1.</li>
<li><strong>FPTU application.</strong> Title for a SWP391 report: "Web application" fails all three. "Reducing appointment no-shows in a clinic booking web app: a reminder-scheduling design" is declarative (it claims something), engaging (a real problem) and focused (one mechanism, one domain).</li>
</ul>
<p class="dap-an">✅ Quick exercise — which criterion does each title break? (a) "About databases" → not declarative, not focused. (b) "An exhaustive multi-perspective investigation into contemporary information systems" → not focused, barely engaging. (c) "Indexing strategy" → not declarative. A title passing all three: "Composite indexes cut report latency by half in our sales database".</p>
<p class="meo">💡 Three-word hook for titles: <strong>D-E-F — Declarative, Engaging, Focused</strong>. And for paragraphs: <strong>coherence = logic, cohesion = glue</strong>.</p>`,
        `<p class="y-chinh">🎯 Tóm tắt mục 4.3, gồm <strong>BA</strong> đề mục, mỗi đề mục hai ý con: <strong>Cấu trúc lập luận của cả bài</strong> (chắc chắn bạn đã TRẢ LỜI ĐÚNG CÂU HỎI · kiểm mở bài, kết bài &amp; câu chủ đề) · <strong>Cấu trúc lập luận của đoạn</strong> (kiểm tính mạch lạc &amp; tính liên kết · kiểm bằng chứng hỗ trợ cho lập luận) · <strong>Tiêu đề bài viết</strong> (Declarative, Engaging &amp; Focused — <em>Vogan, cited in Lacchia, 2015</em>).</p>
<table>
<tr><th>Đề mục</th><th>Phép kiểm 1</th><th>Phép kiểm 2</th><th>Hỏng thì trông thế nào</th></tr>
<tr><td>Cấu trúc lập luận cả bài</td><td>Đã trả lời câu hỏi chưa?</td><td>Mở bài, kết bài &amp; câu chủ đề</td><td>Một bài viết hay về một câu hỏi hơi khác</td></tr>
<tr><td>Cấu trúc lập luận của đoạn</td><td>Mạch lạc &amp; liên kết</td><td>Bằng chứng đỡ cho lập luận</td><td>Những câu đều đúng nhưng cộng lại không thành một luận điểm</td></tr>
<tr><td>Tiêu đề</td><td colspan="2">Declarative · Engaging · Focused</td><td>"Bài tập 1 — bản cuối.docx"</td></tr>
</table>
<ul>
<li><strong>"Đã trả lời đúng câu hỏi chưa" đứng đầu là có lý do.</strong> Đây là nguyên nhân số một khiến một bài viết vốn ổn bị điểm thấp. Hãy đọc lại đề bài với bản nháp đã xong đặt cạnh, rồi CHỈ TAY vào chỗ trả lời từng phần của đề. Không chỉ được tay thì điểm đã mất rồi, câu chữ hay tới đâu cũng vậy.</li>
<li><strong>Coherence và cohesion — cặp kinh điển hay ra đề.</strong> <em>Coherence</em> (mạch lạc) là các ý có hợp lý với nhau không — thuộc về LOGIC. <em>Cohesion</em> (liên kết) là các câu có được nối với nhau trên bề mặt không — "tuy nhiên", "do đó", "cách tiếp cận này", đại từ. Một đoạn hoàn toàn có thể LIÊN KẾT mà KHÔNG MẠCH LẠC: câu nào cũng dính câu kia, mà đi chẳng tới đâu. Phân biệt hai chữ này đáng học thuộc từng chữ.</li>
<li><strong>Mở bài, kết bài và câu chủ đề được kiểm CÙNG NHAU.</strong> Chỉ đọc đúng những dòng đó, theo thứ tự, bỏ qua mọi thứ còn lại. Nếu bộ xương đó đọc lên đã thành một lập luận trọn vẹn và hợp lý thì bài có cấu trúc. Nếu nó đọc lên như một danh sách chủ đề thì chưa. Đây là phép thử năm phút, chạy được trên bất kỳ bản nháp nào.</li>
<li><strong>Tiêu chí tiêu đề có BA: Declarative, Engaging, Focused.</strong> <em>Declarative</em> = nói ra một quan điểm/phát hiện, không chỉ nêu chủ đề. <em>Engaging</em> = người đọc có lý do để đọc tiếp. <em>Focused</em> = nêu đúng phạm vi cụ thể, không ôm cả ngành. Dòng nguồn ở đây khác thường — <strong>Vogan, cited in Lacchia, 2015</strong> — là một trích dẫn thứ cấp, mà bản thân nó lại là ví dụ sống cho luật trích dẫn đã học ở Mooc 1.</li>
<li><strong>Áp vào FPTU.</strong> Tiêu đề báo cáo SWP391: "Ứng dụng web" trượt cả ba. "Giảm tỉ lệ bỏ lịch hẹn trong ứng dụng đặt khám: thiết kế lịch nhắc tự động" thì declarative (có khẳng định), engaging (một vấn đề có thật) và focused (một cơ chế, một miền ứng dụng).</li>
</ul>
<p class="dap-an">✅ Bài tập nhanh — mỗi tiêu đề sau vi phạm tiêu chí nào? (a) "Về cơ sở dữ liệu" → không declarative, không focused. (b) "Một khảo sát đa chiều toàn diện về hệ thống thông tin đương đại" → không focused, cũng khó gọi là engaging. (c) "Chiến lược đánh chỉ mục" → không declarative. Tiêu đề qua cả ba: "Chỉ mục tổ hợp giảm một nửa độ trễ báo cáo trong CSDL bán hàng của nhóm".</p>
<p class="meo">💡 Ba chữ cho tiêu đề: <strong>D-E-F — Declarative, Engaging, Focused</strong>. Và cho đoạn văn: <strong>coherence = LOGIC, cohesion = KEO DÁN</strong>.</p>`],

      [46, '4.3c Incorporating Visual Aids in Written Assignments (objectives — the SAME four bullets as slide 44, verbatim)',
        `<p class="y-chinh">🎯 A heading change with no content change. The title is now <strong>4.3c Incorporating Visual Aids in Written Assignments</strong>, but the four bullets beneath it are <strong>identical, word for word</strong>, to slide 44's: evaluate and refine text-level structures of argumentation · evaluate and refine paragraphs and sentences · write effective titles · compose and incorporate visual aids to present complex information.</p>
<ul>
<li><strong>Say the honest thing: this slide adds no new information.</strong> In a 21-slide stretch, five slides are verbatim repeats of objectives already printed. Recognising a repeat instantly is a study skill — it frees the minutes you would otherwise spend hunting for a difference that does not exist.</li>
<li><strong>What the repeat DOES tell you is the section map.</strong> 4.3 is split into a, b and c, and all three share one objectives block. Only the fourth bullet ("compose and incorporate visual aids") belongs to 4.3c; the first three belong to 4.3a. The deck reuses the block rather than trimming it.</li>
<li><strong>Note the numbering gap.</strong> The deck shows 4.3a and 4.3c, but there is <strong>no objectives slide for 4.3b</strong> anywhere in this range — only its summary survives, two slides later (slide 48, "Editing for language"), and it is printed AFTER 4.3c's summary. Numbering jumps and order breaks are a feature of this deck, not a scanning error.</li>
<li><strong>The template changes back.</strong> Slide 44 had no Sydney shield; this one has the shield bottom-right. Within seven slides the deck switches template three times. Treat the shield as a hint about which source file a slide came from, nothing more.</li>
<li><strong>FPTU application.</strong> When revising, build your own index of the deck by SECTION, not by slide number: 4.3a = essay refinement, 4.3b = language editing, 4.3c = visual aids, 4.4a = formatting and proofreading. Then a repeated objectives page costs you two seconds instead of two minutes.</li>
</ul>
<table>
<tr><th>Slide</th><th>Heading</th><th>Bullets</th><th>Verdict</th></tr>
<tr><td>44</td><td>4.3a Polishing and Refining Essays</td><td>4 outcomes</td><td>First appearance</td></tr>
<tr><td>46</td><td>4.3c Incorporating Visual Aids</td><td>SAME 4 outcomes</td><td>Verbatim repeat</td></tr>
</table>
<p class="meo">💡 For the exam: the examinable content of section 4.3c is <strong>not on this slide</strong> — it is on slide 47. Learn 47, skim 46.</p>`,
        `<p class="y-chinh">🎯 Đổi tiêu đề mà KHÔNG đổi nội dung. Tiêu đề bây giờ là <strong>4.3c Incorporating Visual Aids in Written Assignments</strong>, nhưng bốn gạch đầu dòng bên dưới <strong>y hệt từng chữ</strong> với slide 44: đánh giá và tinh chỉnh cấu trúc lập luận cấp toàn văn bản · đánh giá và tinh chỉnh đoạn và câu · viết tiêu đề hiệu quả · soạn và lồng ghép hình minh hoạ cho thông tin phức tạp.</p>
<ul>
<li><strong>Nói thẳng: slide này KHÔNG thêm thông tin nào.</strong> Trong dải 21 slide, có NĂM slide là bản lặp nguyên văn của các khối chuẩn đầu ra đã in. Nhận ra bản lặp ngay lập tức cũng là một kỹ năng học — nó trả lại cho bạn những phút mà lẽ ra bạn sẽ ngồi soi tìm một khác biệt không hề tồn tại.</li>
<li><strong>Cái mà bản lặp CÓ nói cho bạn là BẢN ĐỒ MỤC.</strong> Mục 4.3 chia thành a, b, c và cả ba dùng chung một khối chuẩn đầu ra. Chỉ gạch thứ tư ("soạn và lồng ghép hình minh hoạ") thuộc về 4.3c; ba gạch đầu thuộc 4.3a. Deck chọn chép lại nguyên khối thay vì cắt bớt.</li>
<li><strong>Để ý chỗ ĐÁNH SỐ HỤT.</strong> Deck có 4.3a và 4.3c, nhưng <strong>không có slide chuẩn đầu ra nào cho 4.3b</strong> trong cả dải này — chỉ còn mỗi slide tóm tắt của nó, hai slide sau (slide 48, "Editing for language"), mà lại in SAU tóm tắt của 4.3c. Nhảy số và sai thứ tự là ĐẶC TÍNH của deck này, không phải lỗi quét ảnh.</li>
<li><strong>Template lại đổi về.</strong> Slide 44 không có khiên Sydney; slide này có khiên ở góc dưới phải. Trong bảy slide, deck đổi template ba lần. Hãy coi cái khiên chỉ là gợi ý slide đến từ file nguồn nào, không hơn.</li>
<li><strong>Áp vào FPTU.</strong> Lúc ôn, hãy tự lập mục lục deck theo MỤC chứ đừng theo số slide: 4.3a = tinh chỉnh bài luận, 4.3b = biên tập ngôn ngữ, 4.3c = hình minh hoạ, 4.4a = định dạng và soát bản. Khi đó một trang chuẩn đầu ra lặp lại chỉ tốn của bạn hai giây thay vì hai phút.</li>
</ul>
<table>
<tr><th>Slide</th><th>Tiêu đề</th><th>Gạch đầu dòng</th><th>Kết luận</th></tr>
<tr><td>44</td><td>4.3a Polishing and Refining Essays</td><td>4 chuẩn đầu ra</td><td>Lần xuất hiện đầu</td></tr>
<tr><td>46</td><td>4.3c Incorporating Visual Aids</td><td>Y HỆT 4 chuẩn đó</td><td>Lặp nguyên văn</td></tr>
</table>
<p class="meo">💡 Để thi: nội dung ra đề được của mục 4.3c <strong>KHÔNG nằm ở slide này</strong> — nó nằm ở slide 47. Học 47, lướt 46.</p>`],

      [47, 'Summary: Incorporating Visual Aids in Written Assignments — field, purpose, and visual-written relations',
        `<p class="y-chinh">🎯 Three headings, each with one rule: <strong>Visual aids in your academic field</strong> (use of visual aids will vary between fields) · <strong>Purpose of visual aid</strong> (most visual aids have predetermined purposes) · <strong>Visual-written relations</strong> (<em>visual aids must be referred to and explained in the text</em>). Note the deck prints <strong>no citation line</strong> on this slide.</p>
<table>
<tr><th>Heading</th><th>The rule</th><th>What it forbids</th></tr>
<tr><td>Visual aids in your academic field</td><td>Usage varies between fields</td><td>Assuming a chart style from one discipline is acceptable in another</td></tr>
<tr><td>Purpose of visual aid</td><td>Most have predetermined purposes</td><td>Picking a chart because it looks impressive</td></tr>
<tr><td>Visual-written relations</td><td>Must be referred to AND explained in the text</td><td>Dropping a figure in and moving on</td></tr>
</table>
<ul>
<li><strong>"Predetermined purposes" is the examinable phrase.</strong> A visual type already has a job: a line chart shows change over time, a bar chart compares quantities across categories, a pie chart shows parts of one whole, a flowchart shows a sequence, a table shows exact values. You choose the visual by naming the job first — not by browsing chart types.</li>
<li><strong>"Must be referred to AND explained" is two obligations, and students usually do only the first.</strong> <em>Referred to</em> = the body text says "Figure 3 shows…" so the reader knows when to look. <em>Explained</em> = the text states what the reader should conclude from it. A figure that appears without either is, for marking purposes, decoration.</li>
<li><strong>Numbering and captions are what make "referred to" possible.</strong> Number figures and tables in separate sequences (Figure 1, 2, 3 · Table 1, 2, 3), put the caption <em>below</em> a figure and <em>above</em> a table by common convention, and make the caption a sentence that can be understood alone.</li>
<li><strong>Every borrowed image needs a source — this connects straight back to Mooc 1.</strong> A chart you copied from a paper, a diagram from a blog, an icon from a site: each carries a licence. Cite it under the caption ("Source: Nguyen, 2023, p. 14" or "Source: Wikimedia Commons, CC BY-SA 4.0"). Copyright and Creative Commons were taught in Mooc 1 precisely so that this slide can assume them. An uncited figure is plagiarism just as an uncited sentence is.</li>
<li><strong>FPTU application.</strong> In a SWP391 report, an ER diagram you drew yourself still gets a number and a caption ("Figure 4. Entity-relationship model of the booking subsystem") and still gets discussed in the text. A screenshot of someone's architecture from Medium gets all of that PLUS a source line — or it should not be in the report.</li>
</ul>
<p class="dap-an">✅ Checklist to run on every figure before submitting: (1) Does it have a number? (2) Does it have a caption that stands alone? (3) Is it referred to by number in the text? (4) Does the text say what to conclude from it? (5) If it is not yours, is the source and licence given? (6) Is this visual type the right job for this data? Five "yes" plus a correct type = the figure earns its space.</p>
<p class="pitfall">⚠️ Trap: "the figure speaks for itself". The slide says the opposite — visuals <strong>must be explained in the text</strong>. In academic writing a self-explanatory figure is still an unexplained figure.</p>`,
        `<p class="y-chinh">🎯 Ba đề mục, mỗi đề mục một luật: <strong>Hình minh hoạ trong ngành học của bạn</strong> (cách dùng hình THAY ĐỔI theo ngành) · <strong>Mục đích của hình minh hoạ</strong> (phần lớn hình minh hoạ có mục đích ĐỊNH SẴN) · <strong>Quan hệ hình–chữ</strong> (<em>hình minh hoạ BẮT BUỘC phải được dẫn tới và được GIẢI THÍCH trong phần chữ</em>). Lưu ý: slide này <strong>không in dòng nguồn trích</strong> nào.</p>
<table>
<tr><th>Đề mục</th><th>Luật</th><th>Cấm điều gì</th></tr>
<tr><td>Hình trong ngành của bạn</td><td>Cách dùng khác nhau giữa các ngành</td><td>Tưởng kiểu biểu đồ của ngành này thì ngành kia cũng chấp nhận</td></tr>
<tr><td>Mục đích của hình</td><td>Phần lớn có mục đích định sẵn</td><td>Chọn biểu đồ vì nó trông "hoành tráng"</td></tr>
<tr><td>Quan hệ hình–chữ</td><td>Phải được DẪN TỚI và được GIẢI THÍCH trong chữ</td><td>Thả cái hình vào rồi đi tiếp</td></tr>
</table>
<ul>
<li><strong>"Predetermined purposes" (mục đích định sẵn) là cụm dễ ra đề nhất.</strong> Mỗi loại hình đã có sẵn một công việc: biểu đồ đường thể hiện THAY ĐỔI theo thời gian, biểu đồ cột SO SÁNH lượng giữa các nhóm, biểu đồ tròn thể hiện PHẦN của một tổng, lưu đồ thể hiện TRÌNH TỰ, bảng thể hiện GIÁ TRỊ CHÍNH XÁC. Bạn chọn hình bằng cách gọi tên công việc trước — không phải bằng cách lướt qua các kiểu biểu đồ.</li>
<li><strong>"Phải được dẫn tới VÀ được giải thích" là HAI nghĩa vụ, mà sinh viên thường chỉ làm cái đầu.</strong> <em>Dẫn tới</em> = trong bài có câu "Hình 3 cho thấy…" để người đọc biết lúc nào cần nhìn. <em>Giải thích</em> = phần chữ nói rõ người đọc nên rút ra kết luận gì từ nó. Một hình xuất hiện mà thiếu cả hai thì, dưới mắt người chấm, chỉ là trang trí.</li>
<li><strong>Đánh số và chú thích chính là thứ làm cho việc "dẫn tới" trở nên khả thi.</strong> Đánh số hình và bảng theo HAI dãy riêng (Hình 1, 2, 3 · Bảng 1, 2, 3); theo quy ước phổ biến, chú thích đặt DƯỚI hình và TRÊN bảng; và viết chú thích thành một câu đọc riêng vẫn hiểu được.</li>
<li><strong>Mọi hình đi mượn đều phải có NGUỒN — chỗ này nối thẳng về Mooc 1.</strong> Một biểu đồ chép từ bài báo, một sơ đồ lấy từ blog, một icon tải trên mạng: mỗi thứ đều mang một giấy phép. Ghi nguồn ngay dưới chú thích ("Nguồn: Nguyen, 2023, tr. 14" hoặc "Nguồn: Wikimedia Commons, CC BY-SA 4.0"). Bản quyền và Creative Commons được dạy ở Mooc 1 chính là để slide này được phép coi như bạn đã biết. Một cái hình không ghi nguồn là đạo văn y như một câu văn không ghi nguồn.</li>
<li><strong>Áp vào FPTU.</strong> Trong báo cáo SWP391, sơ đồ ER do chính bạn vẽ vẫn phải có số và chú thích ("Hình 4. Mô hình thực thể–quan hệ của phân hệ đặt lịch") và vẫn phải được bàn tới trong phần chữ. Ảnh chụp kiến trúc của người khác lấy trên Medium thì cần TẤT CẢ những thứ đó CỘNG thêm dòng nguồn — không thì đừng đưa vào báo cáo.</li>
</ul>
<p class="dap-an">✅ Checklist chạy trên MỌI hình trước khi nộp: (1) Đã có số chưa? (2) Chú thích đọc riêng có hiểu không? (3) Trong bài có dẫn tới nó theo số không? (4) Phần chữ có nói rút ra kết luận gì không? (5) Nếu không phải của mình, đã ghi nguồn và giấy phép chưa? (6) Loại hình này có đúng việc với dữ liệu này không? Năm chữ "rồi" cộng một loại hình đúng = cái hình xứng đáng chiếm chỗ.</p>
<p class="pitfall">⚠️ Bẫy: "hình tự nó đã nói rồi". Slide nói NGƯỢC LẠI — hình <strong>bắt buộc phải được giải thích trong phần chữ</strong>. Trong viết học thuật, một cái hình "tự nói" vẫn là một cái hình chưa được giải thích.</p>`],

      [48, 'Summary: Editing for language — SEVEN items (Greetham, 2013; Cottrell, 2013; Sowton, 2012); printed with NO objectives slide of its own',
        `<p class="y-chinh">🎯 The summary of section 4.3b, listing <strong>seven</strong> things to edit for: <strong>Informal language · Grammar · Irrelevant information · Long sentences · Complex vocabulary · Strong words · Coherence &amp; cohesion</strong>. Sources: <em>(Greetham, 2013; Cottrell, 2013; Sowton, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Item</th><th>What you are hunting for</th><th>The fix</th></tr>
<tr><td>1</td><td>Informal language</td><td>"a lot of", "stuff", "kind of", contractions, slang</td><td>Replace with the neutral academic equivalent</td></tr>
<tr><td>2</td><td>Grammar</td><td>Agreement, tense, articles, prepositions</td><td>Read aloud; check the patterns you personally get wrong</td></tr>
<tr><td>3</td><td>Irrelevant information</td><td>True sentences that do not serve the question</td><td>Delete — even if you liked writing them</td></tr>
<tr><td>4</td><td>Long sentences</td><td>Sentences you cannot read in one breath</td><td>Split at the conjunction; one idea per sentence</td></tr>
<tr><td>5</td><td>Complex vocabulary</td><td>Big words used to sound clever</td><td>Use the simplest accurate word</td></tr>
<tr><td>6</td><td>Strong words</td><td>"always", "never", "proves", "obviously"</td><td>Hedge it: "suggests", "in most cases", "may indicate"</td></tr>
<tr><td>7</td><td>Coherence &amp; cohesion</td><td>Ideas that do not follow; missing connectives</td><td>Reorder the ideas, then add the linking words</td></tr>
</table>
<ul>
<li><strong>Items 5 and 6 are the two most counter-intuitive, and therefore the most examinable.</strong> Students expect "academic" to mean "complicated and confident". The slide says the opposite: cut complex vocabulary, and soften strong words. Academic register is precise and cautious, not grand.</li>
<li><strong>"Strong words" means overclaiming, not emotive words.</strong> Writing "this proves that caching always improves performance" is a claim your evidence cannot support. "These measurements suggest that caching improved response time in this workload" is the same sentence made defensible. Hedging is not weakness; it is accuracy.</li>
<li><strong>"Irrelevant information" is the hardest edit because it costs you work you already did.</strong> The test is mechanical: for each paragraph, write in the margin which part of the question it answers. If you cannot, it goes — into a "cut" file if that makes it easier, but out of the draft.</li>
<li><strong>Item 7 repeats deliberately.</strong> Coherence &amp; cohesion already appeared on slide 45 under paragraph structure; here it returns as a language-editing target. The deck treats it as both a structural and a linguistic property — worth noting because an exam question could place it under either heading.</li>
<li><strong>FPTU application.</strong> Before submitting an assignment written in English, run seven separate quick passes rather than one "improve the writing" pass. Use Ctrl+F for your own habitual offenders: "a lot of", "very", "always", "obviously", "in order to". Two minutes per pass, fourteen minutes total, and the register changes visibly.</li>
</ul>
<p class="pitfall">⚠️ Deck quirk: <strong>section 4.3b has NO objectives slide in this deck</strong> — only this summary — and it is printed AFTER the summary of 4.3c (slide 47). So the on-screen order is 4.3a → 4.3c → 4.3b. Do not assume the deck order equals the teaching order.</p>
<p class="meo">💡 Count it: <strong>SEVEN</strong> items. Mnemonic by pairs — two about register (informal, complex), two about correctness (grammar, strong words), two about economy (irrelevant, long), one about flow (coherence &amp; cohesion).</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt của mục 4.3b, liệt kê <strong>BẢY</strong> thứ phải biên tập: <strong>Ngôn ngữ thân mật (Informal language) · Ngữ pháp · Thông tin không liên quan · Câu quá dài · Từ vựng rối rắm · Từ ngữ quá mạnh (Strong words) · Mạch lạc &amp; liên kết</strong>. Nguồn: <em>(Greetham, 2013; Cottrell, 2013; Sowton, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Mục</th><th>Bạn đang săn cái gì</th><th>Cách sửa</th></tr>
<tr><td>1</td><td>Ngôn ngữ thân mật</td><td>"a lot of", "stuff", "kind of", viết tắt kiểu don't, tiếng lóng</td><td>Thay bằng từ học thuật trung tính tương đương</td></tr>
<tr><td>2</td><td>Ngữ pháp</td><td>Hoà hợp chủ–vị, thì, mạo từ, giới từ</td><td>Đọc to lên; soi đúng những lỗi CHÍNH BẠN hay mắc</td></tr>
<tr><td>3</td><td>Thông tin không liên quan</td><td>Những câu đúng nhưng không phục vụ câu hỏi đề bài</td><td>Xoá — dù bạn đã rất thích lúc viết nó</td></tr>
<tr><td>4</td><td>Câu quá dài</td><td>Câu không đọc hết nổi trong một hơi</td><td>Cắt ở liên từ; mỗi câu một ý</td></tr>
<tr><td>5</td><td>Từ vựng rối rắm</td><td>Từ to dùng để nghe cho "trí tuệ"</td><td>Dùng từ đơn giản nhất mà vẫn chính xác</td></tr>
<tr><td>6</td><td>Từ ngữ quá mạnh</td><td>"always", "never", "proves", "obviously"</td><td>Rào lại: "suggests", "in most cases", "may indicate"</td></tr>
<tr><td>7</td><td>Mạch lạc &amp; liên kết</td><td>Ý không nối được; thiếu từ nối</td><td>Sắp lại thứ tự ý TRƯỚC, rồi mới thêm từ nối</td></tr>
</table>
<ul>
<li><strong>Mục 5 và 6 là hai mục phản trực giác nhất, nên cũng dễ ra đề nhất.</strong> Sinh viên hay tưởng "học thuật" nghĩa là "rối rắm và chắc nịch". Slide nói ngược lại: CẮT từ vựng rối rắm, và LÀM MỀM những từ quá mạnh. Văn phong học thuật là chính xác và thận trọng, không phải hoành tráng.</li>
<li><strong>"Strong words" nghĩa là NÓI QUÁ, không phải từ giàu cảm xúc.</strong> Viết "điều này CHỨNG MINH rằng cache LUÔN LUÔN cải thiện hiệu năng" là một khẳng định mà bằng chứng của bạn không đỡ nổi. "Các phép đo này GỢI Ý rằng cache đã cải thiện thời gian phản hồi TRONG tải công việc này" là đúng câu đó nhưng bảo vệ được. Rào câu không phải yếu đuối, đó là chính xác.</li>
<li><strong>"Thông tin không liên quan" là nhát cắt khó nhất vì nó lấy đi công sức bạn đã bỏ ra.</strong> Phép thử rất máy móc: với mỗi đoạn, ghi ra lề xem nó trả lời phần nào của đề bài. Ghi không ra thì đoạn đó phải đi — cho vào một file "đã cắt" nếu thấy đỡ tiếc, nhưng phải ra khỏi bản nháp.</li>
<li><strong>Mục 7 lặp lại là có chủ ý.</strong> Coherence &amp; cohesion đã xuất hiện ở slide 45 dưới đề mục cấu trúc đoạn; ở đây nó quay lại như một đối tượng BIÊN TẬP NGÔN NGỮ. Deck coi nó vừa là tính chất cấu trúc vừa là tính chất ngôn ngữ — đáng ghi nhớ, vì câu hỏi thi có thể xếp nó vào một trong hai chỗ.</li>
<li><strong>Áp vào FPTU.</strong> Trước khi nộp một bài viết bằng tiếng Anh, hãy chạy BẢY lượt ngắn riêng biệt thay vì một lượt "sửa văn cho hay". Dùng Ctrl+F săn đúng những tật của bạn: "a lot of", "very", "always", "obviously", "in order to". Hai phút một lượt, tổng mười bốn phút, và văn phong đổi thấy rõ.</li>
</ul>
<p class="pitfall">⚠️ Đặc tính deck: <strong>mục 4.3b KHÔNG có slide chuẩn đầu ra trong deck này</strong> — chỉ còn mỗi slide tóm tắt — và nó lại in SAU slide tóm tắt của 4.3c (slide 47). Tức là thứ tự trên màn hình là 4.3a → 4.3c → 4.3b. Đừng cho rằng thứ tự deck bằng thứ tự dạy.</p>
<p class="meo">💡 Đếm cho chắc: <strong>BẢY</strong> mục. Nhớ theo cặp — hai mục về văn phong (thân mật, rối rắm), hai mục về độ chuẩn xác (ngữ pháp, từ quá mạnh), hai mục về sự gọn (không liên quan, câu dài), một mục về mạch chảy (mạch lạc &amp; liên kết).</p>`],

      [49, '4.4a Formatting & Proofreading Written Assignments for Submission (objectives — THREE outcomes; "Page 1" template)',
        `<p class="y-chinh">🎯 The last written-work section opens with <strong>three</strong> outcomes: <strong>apply consistent formatting in written assignments</strong> · <strong>proofread written assignments effectively</strong> · <strong>finalise referencing style and accuracy in written assignments</strong>. This is the pass you run when the thinking is finished.</p>
<table>
<tr><th>Outcome</th><th>Key word</th><th>What it really tests</th></tr>
<tr><td>apply consistent formatting</td><td><strong>consistent</strong></td><td>Not beauty — sameness. One heading style, one font, one spacing, throughout</td></tr>
<tr><td>proofread effectively</td><td><strong>effectively</strong></td><td>A method, not a mood. Fresh eyes, slow reading, one error type at a time</td></tr>
<tr><td>finalise referencing style and accuracy</td><td><strong>accuracy</strong></td><td>Every in-text citation has a reference-list entry and vice versa</td></tr>
</table>
<ul>
<li><strong>"Consistent" is the whole of the first outcome.</strong> Markers rarely reward a beautiful layout, but they always notice three different heading sizes, two fonts and random line spacing — because inconsistency reads as carelessness, and carelessness casts doubt on the content. Pick one style and apply it everywhere, including in the parts you wrote at 2am.</li>
<li><strong>Proofreading is a different task from editing, and this deck separates them by a whole section.</strong> Editing (4.3b) changes what the text says; proofreading (4.4a) fixes what the text got wrong mechanically — typos, spacing, a missing full stop, a figure number that jumps from 3 to 5. Do not attempt them in the same pass.</li>
<li><strong>"Finalise referencing" is placed LAST on purpose.</strong> References only settle once the content stops moving. Finalising them early means redoing them after every cut. The word <em>accuracy</em> is the load-bearing one: a reference list that is beautifully formatted but does not match the in-text citations is still wrong.</li>
<li><strong>Three outcomes, three separate passes.</strong> Format pass, proofread pass, reference pass. Each is mechanical, each is fast, and each catches things the other two cannot. Trying to do all three at once guarantees you miss all three.</li>
<li><strong>FPTU application.</strong> For a SWP391 report: pass 1 — apply the template's heading styles and regenerate the table of contents; pass 2 — read the document backwards paragraph by paragraph (this breaks the meaning and exposes typos); pass 3 — check every citation against the reference list and every figure/table number against its in-text reference.</li>
</ul>
<p class="pitfall">⚠️ Template quirk: like slide 44, this slide has <strong>no Sydney shield</strong> and carries a "Page 1" footer instead — two of the three objectives slides in the written-work block came from a different source file. Content is unaffected; do not read meaning into it.</p>
<p class="meo">💡 Three words: <strong>CONSISTENT · EFFECTIVELY · ACCURACY</strong> — one adverb-or-adjective per outcome, and each names the criterion the marker applies.</p>`,
        `<p class="y-chinh">🎯 Mục cuối của phần bài viết mở màn với <strong>BA</strong> chuẩn đầu ra: <strong>áp dụng định dạng NHẤT QUÁN trong bài viết</strong> · <strong>soát bản (proofread) bài viết một cách HIỆU QUẢ</strong> · <strong>chốt lại kiểu trích dẫn và độ CHÍNH XÁC của phần tài liệu tham khảo</strong>. Đây là lượt bạn chạy khi phần suy nghĩ đã xong.</p>
<table>
<tr><th>Chuẩn đầu ra</th><th>Từ khoá</th><th>Thực chất kiểm cái gì</th></tr>
<tr><td>định dạng nhất quán</td><td><strong>nhất quán</strong></td><td>Không phải ĐẸP — mà là GIỐNG NHAU. Một kiểu tiêu đề, một font, một giãn dòng, xuyên suốt</td></tr>
<tr><td>soát bản hiệu quả</td><td><strong>hiệu quả</strong></td><td>Một PHƯƠNG PHÁP, không phải một tâm trạng. Mắt nghỉ, đọc chậm, mỗi lượt một loại lỗi</td></tr>
<tr><td>chốt trích dẫn, chính xác</td><td><strong>chính xác</strong></td><td>Mọi trích dẫn trong bài đều có mục trong danh mục và ngược lại</td></tr>
</table>
<ul>
<li><strong>"Nhất quán" là toàn bộ nội dung của chuẩn thứ nhất.</strong> Người chấm hiếm khi cộng điểm cho một bố cục đẹp, nhưng LUÔN nhìn thấy ba cỡ tiêu đề khác nhau, hai font và giãn dòng lộn xộn — vì thiếu nhất quán đọc lên thành cẩu thả, mà cẩu thả thì gieo nghi ngờ lên chính nội dung. Chọn một kiểu và áp khắp nơi, kể cả ở phần bạn viết lúc 2 giờ sáng.</li>
<li><strong>Soát bản là việc KHÁC biên tập, và deck này tách chúng ra hẳn một mục.</strong> Biên tập (4.3b) thay đổi bài viết NÓI GÌ; soát bản (4.4a) sửa những thứ SAI VỀ MẶT CƠ HỌC — lỗi gõ, thừa dấu cách, thiếu dấu chấm, số hình nhảy từ 3 sang 5. Đừng làm hai việc đó trong cùng một lượt.</li>
<li><strong>"Chốt tài liệu tham khảo" được đặt CUỐI là có chủ ý.</strong> Danh mục chỉ ổn định khi nội dung đã ngừng nhúc nhích. Chốt sớm nghĩa là làm lại sau mỗi nhát cắt. Chữ mang tải ở đây là <em>accuracy</em>: một danh mục trình bày rất đẹp mà không khớp với các trích dẫn trong bài thì vẫn là sai.</li>
<li><strong>Ba chuẩn đầu ra, ba lượt riêng.</strong> Lượt định dạng, lượt soát lỗi, lượt tài liệu tham khảo. Mỗi lượt đều máy móc, đều nhanh, và mỗi lượt bắt được thứ hai lượt kia không thấy. Làm cả ba cùng lúc thì chắc chắn trượt cả ba.</li>
<li><strong>Áp vào FPTU.</strong> Với báo cáo SWP391: lượt 1 — áp đúng heading style của template rồi cập nhật lại mục lục tự động; lượt 2 — đọc tài liệu NGƯỢC từ dưới lên theo từng đoạn (cách này phá mạch nghĩa nên lỗi gõ lộ ra); lượt 3 — đối chiếu từng trích dẫn với danh mục và từng số hình/bảng với chỗ dẫn nó trong bài.</li>
</ul>
<p class="pitfall">⚠️ Đặc tính template: giống slide 44, slide này <strong>không có khiên Sydney</strong> mà mang chân trang "Page 1" — hai trong ba slide chuẩn đầu ra của khối bài viết đến từ một file nguồn khác. Nội dung không bị ảnh hưởng; đừng suy diễn gì thêm.</p>
<p class="meo">💡 Ba chữ: <strong>NHẤT QUÁN · HIỆU QUẢ · CHÍNH XÁC</strong> — mỗi chuẩn đầu ra một tính từ, và mỗi tính từ gọi tên đúng tiêu chí người chấm sẽ áp dụng.</p>`],

      [50, 'Summary: Formatting & Proofreading Written Assignments for Submission — SEVEN checkpoints (Behrens & Rosen, 2010; Burke, 2013; Sowton, 2012)',
        `<p class="y-chinh">🎯 The pre-submission checklist, <strong>seven</strong> items: <strong>Paragraphs · Font &amp; line spacing · Images · Quotations · References · Grammar, spelling &amp; punctuation · Your details</strong>. Sources: <em>(Behrens &amp; Rosen, 2010; Burke, 2013; Sowton, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Checkpoint</th><th>What to verify</th></tr>
<tr><td>1</td><td>Paragraphs</td><td>One consistent method — either indent OR blank line, never both; no orphan one-sentence paragraphs</td></tr>
<tr><td>2</td><td>Font &amp; line spacing</td><td>One font family, the size the brief asks for, one spacing (often 1.5 or double), margins as specified</td></tr>
<tr><td>3</td><td>Images</td><td>Numbered, captioned, referred to in the text, readable at print size, source given if borrowed</td></tr>
<tr><td>4</td><td>Quotations</td><td>Short quotes in quotation marks inline; long quotes as an indented block without marks; page number present</td></tr>
<tr><td>5</td><td>References</td><td>One style throughout; every in-text citation appears in the list; every list entry is cited</td></tr>
<tr><td>6</td><td>Grammar, spelling &amp; punctuation</td><td>Spellcheck set to the right English variety; then a human pass, because spellcheck approves "form" for "from"</td></tr>
<tr><td>7</td><td>Your details</td><td>Name, student ID, subject code, tutor, date, word count — exactly as the brief demands</td></tr>
</table>
<ul>
<li><strong>Item 7 is last on the slide and first in real consequences.</strong> A perfect assignment submitted without a student ID or with the wrong subject code can be recorded against nobody. It takes twenty seconds and it is the cheapest mark-protection on the list.</li>
<li><strong>Item 4 hides a rule students lose marks on constantly: the page number.</strong> A direct quotation needs a locator (page or paragraph). Without it the citation is incomplete even if the author and year are right — and in some markers' rubrics that counts as a referencing error, not a formatting one.</li>
<li><strong>Item 6 is where automated tools mislead.</strong> A spellchecker set to US English will "correct" British spellings your course requires, and it never catches a real word in the wrong place. Run the tool, then read the text yourself — the deck says grammar, spelling <em>and</em> punctuation, three separate things.</li>
<li><strong>Item 3 links this checklist back to slide 47.</strong> Formatting an image is not just resizing it: the number, caption, in-text reference and source are part of "images done properly". The two slides are one rule split across two sections.</li>
<li><strong>FPTU application.</strong> Turn these seven into a literal checklist at the end of your report document, tick them, then delete the checklist before exporting the PDF. Also export to PDF and reopen it — fonts substitute, images shift, and a table that looked fine in the editor can break across two pages.</li>
</ul>
<p class="dap-an">✅ Two-minute final sweep before uploading: (1) filename follows the course convention; (2) PDF opens and pages are in order; (3) your details appear on page 1; (4) figures are all numbered in sequence with no gaps; (5) the reference list is alphabetical and complete; (6) the word count is within range; (7) you are uploading to the right assignment slot. Six of these seven are on the slide; the seventh (right slot) is the one nobody teaches and everybody eventually gets wrong.</p>
<p class="meo">💡 Count: <strong>SEVEN</strong> checkpoints here, and also SEVEN on slide 48. Two different sevens — 48 is about LANGUAGE, 50 is about PRESENTATION. Do not mix the two lists in the exam.</p>`,
        `<p class="y-chinh">🎯 Checklist trước khi nộp, <strong>BẢY</strong> mục: <strong>Đoạn văn · Font &amp; giãn dòng · Hình ảnh · Trích dẫn nguyên văn · Tài liệu tham khảo · Ngữ pháp, chính tả &amp; dấu câu · Thông tin cá nhân của bạn</strong>. Nguồn: <em>(Behrens &amp; Rosen, 2010; Burke, 2013; Sowton, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Mục kiểm</th><th>Kiểm cái gì</th></tr>
<tr><td>1</td><td>Đoạn văn</td><td>Một cách duy nhất — HOẶC thụt đầu dòng HOẶC cách một dòng trống, không dùng cả hai; không để đoạn mồ côi chỉ một câu</td></tr>
<tr><td>2</td><td>Font &amp; giãn dòng</td><td>Một họ font, đúng cỡ đề bài yêu cầu, một mức giãn dòng (thường 1,5 hoặc đôi), lề đúng quy định</td></tr>
<tr><td>3</td><td>Hình ảnh</td><td>Có số, có chú thích, được dẫn trong bài, đọc được ở cỡ in, có nguồn nếu đi mượn</td></tr>
<tr><td>4</td><td>Trích dẫn nguyên văn</td><td>Trích ngắn để trong ngoặc kép, chạy thẳng trong câu; trích dài tách thành khối thụt lề KHÔNG ngoặc kép; PHẢI có số trang</td></tr>
<tr><td>5</td><td>Tài liệu tham khảo</td><td>Một kiểu duy nhất xuyên suốt; mọi trích dẫn trong bài đều có trong danh mục; mọi mục trong danh mục đều được trích</td></tr>
<tr><td>6</td><td>Ngữ pháp, chính tả &amp; dấu câu</td><td>Đặt đúng biến thể tiếng Anh cho bộ kiểm chính tả; rồi ĐỌC BẰNG MẮT NGƯỜI, vì máy vẫn duyệt "form" thay cho "from"</td></tr>
<tr><td>7</td><td>Thông tin của bạn</td><td>Họ tên, mã sinh viên, mã môn, giảng viên, ngày, số từ — đúng như đề bài đòi</td></tr>
</table>
<ul>
<li><strong>Mục 7 đứng cuối slide nhưng đứng đầu về hậu quả thật.</strong> Một bài hoàn hảo mà nộp thiếu mã sinh viên hoặc ghi sai mã môn thì có thể không được ghi điểm cho ai cả. Nó tốn hai mươi giây và là cách bảo vệ điểm rẻ nhất trong cả danh sách.</li>
<li><strong>Mục 4 giấu một luật sinh viên mất điểm liên tục: SỐ TRANG.</strong> Trích dẫn nguyên văn phải có chỉ dẫn vị trí (trang hoặc đoạn). Thiếu nó thì trích dẫn vẫn là chưa đủ dù tên tác giả và năm đều đúng — và trong barem của nhiều người chấm, đó bị tính là lỗi trích dẫn chứ không phải lỗi trình bày.</li>
<li><strong>Mục 6 là chỗ công cụ tự động đánh lừa bạn.</strong> Bộ kiểm chính tả để ở tiếng Anh–Mỹ sẽ "sửa" giúp bạn những cách viết Anh–Anh mà môn học yêu cầu, và nó không bao giờ bắt được một từ đúng chính tả nằm sai chỗ. Chạy công cụ rồi tự đọc — slide ghi rõ ngữ pháp, chính tả <em>và</em> dấu câu, ba thứ riêng.</li>
<li><strong>Mục 3 nối checklist này về slide 47.</strong> Định dạng một cái hình không chỉ là chỉnh kích thước: số hình, chú thích, chỗ dẫn trong bài và nguồn đều thuộc về "làm hình cho đúng". Hai slide là MỘT luật bị chẻ đôi qua hai mục.</li>
<li><strong>Áp vào FPTU.</strong> Hãy biến bảy mục này thành một checklist gõ thẳng vào cuối file báo cáo, tick từng cái, rồi XOÁ checklist đi trước khi xuất PDF. Và nhớ xuất PDF rồi MỞ LẠI — font bị thay, ảnh xô lệch, và một cái bảng nhìn ổn trong trình soạn thảo hoàn toàn có thể vỡ làm hai trang.</li>
</ul>
<p class="dap-an">✅ Lượt quét cuối hai phút trước khi tải lên: (1) tên file đúng quy ước của môn; (2) PDF mở được và các trang đúng thứ tự; (3) thông tin cá nhân có ở trang 1; (4) các hình đánh số liên tục không hụt; (5) danh mục tham khảo xếp theo bảng chữ cái và đầy đủ; (6) số từ nằm trong khoảng cho phép; (7) bạn đang tải lên ĐÚNG ô nộp bài. Sáu trong bảy thứ này có trên slide; thứ bảy (đúng ô nộp) là thứ không ai dạy mà ai rồi cũng có lần làm sai.</p>
<p class="meo">💡 Đếm: <strong>BẢY</strong> mục ở đây, và cũng BẢY mục ở slide 48. Hai cái bảy KHÁC NHAU — 48 nói về NGÔN NGỮ, 50 nói về TRÌNH BÀY. Đừng trộn hai danh sách này trong phòng thi.</p>`],

      [51, '5.2a Understanding & Researching Presentations (objectives — FOUR outcomes; the deck jumps straight from 4.4 to 5.2)',
        `<p class="y-chinh">🎯 The presentation block begins. Four outcomes: <strong>interpret the purpose &amp; rhetorical aims of presentations</strong> · <strong>use effective questioning to further understand expectations</strong> · <strong>conduct research on your presentation topic</strong> · <strong>create &amp; refine your presentation structure</strong>.</p>
<table>
<tr><th>Outcome</th><th>The question it answers</th><th>Done badly, it looks like</th></tr>
<tr><td>interpret purpose &amp; rhetorical aims</td><td>What is this talk FOR — to inform, persuade, report, defend?</td><td>A talk that describes instead of arguing (or vice versa)</td></tr>
<tr><td>use effective questioning</td><td>What does the marker actually expect?</td><td>Guessing the brief and missing a graded requirement</td></tr>
<tr><td>conduct research</td><td>What do I need to know beyond my own opinion?</td><td>Twenty minutes of personal impressions with no sources</td></tr>
<tr><td>create &amp; refine structure</td><td>In what order will this land?</td><td>Slides in the order you happened to make them</td></tr>
</table>
<ul>
<li><strong>"Rhetorical aims" is the term to memorise.</strong> It means the effect the talk is meant to have on this audience — inform, persuade, demonstrate competence, provoke discussion. Two talks on identical content but different aims need different structures, different evidence and different endings. Naming the aim first is what makes the rest decidable.</li>
<li><strong>"Effective questioning" is an outcome, which surprises people.</strong> Asking your lecturer a precise question — "is the 15 minutes including Q&amp;A?", "are we marked on the demo or on the explanation?" — is treated here as a skill you are assessed on, not a sign of weakness. A vague "any tips?" gets you nothing; a specific question gets you the marking criteria.</li>
<li><strong>Research comes BEFORE structure, and structure is the last of the four.</strong> The order matters: you cannot sequence material you have not gathered. Students who open PowerPoint first are, in the deck's terms, doing outcome 4 before outcomes 1–3.</li>
<li><strong>"Create &amp; refine" repeats the evaluate-and-refine pattern from the writing block.</strong> Mooc 4's underlying claim is that speaking and writing are the same craft in different media: plan, draft, evaluate against a purpose, refine. That is why the presentation sections mirror the essay sections almost step for step.</li>
<li><strong>FPTU application.</strong> Before the SWP391 defence, write the four answers on one page: (1) aim = persuade the council that the system works AND that we understood why we built it that way; (2) questions to ask the supervisor = duration, whether a live demo is required, who presents which part; (3) research = the marking rubric, the requirement list, and the two or three references you will cite; (4) structure = the running order with minutes per section.</li>
</ul>
<p class="pitfall">⚠️ Numbering gap: this range jumps from <strong>4.4a straight to 5.2a</strong> — there is no 5.1 slide anywhere in slides 44–64, and 4.4 has only an "a" with no 4.4b. When revising, map the sections you actually have; do not assume a missing number means a missing exam topic.</p>
<p class="meo">💡 Four verbs in order: <strong>INTERPRET → ASK → RESEARCH → STRUCTURE</strong>. Structure is LAST.</p>`,
        `<p class="y-chinh">🎯 Khối thuyết trình bắt đầu. Bốn chuẩn đầu ra: <strong>diễn giải mục đích &amp; ý đồ tu từ (rhetorical aims) của bài thuyết trình</strong> · <strong>dùng câu hỏi hiệu quả để hiểu rõ hơn kỳ vọng</strong> · <strong>nghiên cứu về chủ đề thuyết trình của bạn</strong> · <strong>tạo &amp; tinh chỉnh cấu trúc bài thuyết trình</strong>.</p>
<table>
<tr><th>Chuẩn đầu ra</th><th>Nó trả lời câu hỏi nào</th><th>Làm dở thì trông thế nào</th></tr>
<tr><td>diễn giải mục đích &amp; ý đồ tu từ</td><td>Buổi nói này ĐỂ LÀM GÌ — thông tin, thuyết phục, báo cáo, bảo vệ?</td><td>Một bài MÔ TẢ trong khi cần LẬP LUẬN (hoặc ngược lại)</td></tr>
<tr><td>dùng câu hỏi hiệu quả</td><td>Người chấm thật sự kỳ vọng gì?</td><td>Đoán mò đề bài và bỏ sót một yêu cầu có chấm điểm</td></tr>
<tr><td>nghiên cứu</td><td>Tôi cần biết gì ngoài ý kiến của chính mình?</td><td>Hai mươi phút cảm nhận cá nhân, không một nguồn nào</td></tr>
<tr><td>tạo &amp; tinh chỉnh cấu trúc</td><td>Trình bày theo thứ tự nào thì "vào" được?</td><td>Slide xếp theo đúng thứ tự tình cờ bạn làm ra chúng</td></tr>
</table>
<ul>
<li><strong>"Rhetorical aims" là thuật ngữ phải thuộc.</strong> Nó là TÁC ĐỘNG mà buổi nói nhắm tới trên đúng khán giả này — cung cấp thông tin, thuyết phục, chứng minh năng lực, khơi mào tranh luận. Hai bài cùng nội dung nhưng khác ý đồ thì cần cấu trúc khác, bằng chứng khác và cái kết khác. Gọi tên ý đồ TRƯỚC chính là thứ khiến mọi lựa chọn sau đó quyết được.</li>
<li><strong>"Dùng câu hỏi hiệu quả" là một chuẩn đầu ra — điều này làm nhiều người bất ngờ.</strong> Hỏi giảng viên một câu chính xác — "15 phút đã gồm phần hỏi đáp chưa ạ?", "thầy chấm phần demo hay phần giải thích?" — ở đây được coi là KỸ NĂNG bị đánh giá, không phải dấu hiệu yếu kém. Một câu "thầy có lời khuyên gì không ạ?" thì không được gì; một câu hỏi cụ thể thì đổi được tiêu chí chấm.</li>
<li><strong>Nghiên cứu đứng TRƯỚC cấu trúc, và cấu trúc là chuẩn CUỐI trong bốn.</strong> Thứ tự này quan trọng: bạn không thể sắp xếp thứ mình chưa thu thập. Sinh viên mở PowerPoint đầu tiên, theo cách nói của deck, đang làm chuẩn 4 trước chuẩn 1–3.</li>
<li><strong>"Create &amp; refine" lặp lại đúng khuôn "evaluate and refine" của khối bài viết.</strong> Khẳng định ngầm của Mooc 4 là: NÓI và VIẾT là cùng một nghề trên hai phương tiện khác nhau — lập kế hoạch, làm nháp, đánh giá theo mục đích, tinh chỉnh. Vì thế các mục thuyết trình soi gương gần như từng bước với các mục bài luận.</li>
<li><strong>Áp vào FPTU.</strong> Trước buổi bảo vệ SWP391, viết bốn câu trả lời ra một trang: (1) ý đồ = thuyết phục hội đồng rằng hệ thống CHẠY ĐƯỢC VÀ rằng nhóm HIỂU vì sao làm như vậy; (2) câu cần hỏi giảng viên = thời lượng, có bắt buộc demo trực tiếp không, ai trình bày phần nào; (3) nghiên cứu = barem chấm, danh sách yêu cầu, và hai ba nguồn sẽ trích; (4) cấu trúc = thứ tự chạy kèm số phút cho từng phần.</li>
</ul>
<p class="pitfall">⚠️ Chỗ đánh số hụt: dải này nhảy từ <strong>4.4a thẳng sang 5.2a</strong> — trong cả slide 44–64 không có slide 5.1 nào, và 4.4 chỉ có "a", không có 4.4b. Lúc ôn, hãy lập bản đồ theo những mục THẬT SỰ CÓ; đừng cho rằng một số bị thiếu nghĩa là một chủ đề thi bị thiếu.</p>
<p class="meo">💡 Bốn động từ đúng thứ tự: <strong>DIỄN GIẢI → HỎI → NGHIÊN CỨU → DỰNG CẤU TRÚC</strong>. Cấu trúc đứng CUỐI.</p>`],

      [52, 'Summary: Understanding and Researching Presentations — the rhetorical situation: Media and Place (Cottrell, 2013; Dannels, 2000; Edwards, 2004 cited in Alexander et al., 2008)',
        `<p class="y-chinh">🎯 Two headings only. <strong>The rhetorical situation</strong>, broken into <strong>Media</strong> (face-to-face, one-way interaction; presentation slides; handouts; whiteboard) and <strong>Place</strong> (classrooms); and <strong>Research varies with purpose and structure; generally based on course materials</strong>. Sources: <em>(Cottrell, 2013; Dannels, 2000; Edwards, 2004 cited in Alexander et al., 2008)</em>.</p>
<table>
<tr><th>Element of the rhetorical situation</th><th>What the slide prints</th><th>What it implies for you</th></tr>
<tr><td>Media</td><td>Face-to-face, one-way interaction; presentation slides; handouts; whiteboard</td><td>You have FOUR channels, not one. Slides are only a quarter of the toolkit</td></tr>
<tr><td>Place</td><td>Classrooms</td><td>Small room, known audience, fixed time slot, projector that may fail</td></tr>
<tr><td>Research</td><td>Varies with purpose and structure; generally based on course materials</td><td>Start from the subject's own materials before hunting outside sources</td></tr>
</table>
<ul>
<li><strong>"One-way interaction" is the phrase most likely to be tested, and it is easy to misread.</strong> It describes the default flow of a classroom presentation: you speak, they listen. It does NOT mean interaction is forbidden — slide 64 is entirely about inviting it. Read it as "one-way unless you deliberately open it up".</li>
<li><strong>Four media, and students routinely use only one.</strong> Handouts carry the detail your slides should not; the whiteboard handles the unplanned diagram when a question needs it; your face and voice carry the persuasion. Planning which content goes to which medium is a real decision, not decoration.</li>
<li><strong>"Place: Classrooms" is not filler.</strong> It fixes the constraints: everybody can see you, everybody can see the clock, the back row can read at most about 24pt, and the equipment belongs to the room, not to you. Slide 62's first bullet ("make sure your technology works") follows directly from this line.</li>
<li><strong>"Generally based on course materials" is the most practical sentence in the block.</strong> For a university presentation, the expected evidence base is usually the lectures, the set readings and the prescribed textbook — not whatever a search engine surfaces. Citing the course reading tells the marker you engaged with the subject; citing a random blog suggests you did not.</li>
<li><strong>The citation chain here is itself a lesson.</strong> "<em>Edwards, 2004 cited in Alexander et al., 2008</em>" is a secondary source: Edwards is the original, Alexander is where the deck read it. The rule from Mooc 1 applies — you cite what you actually read, and you say so.</li>
</ul>
<p class="pitfall">⚠️ Count mismatch to notice: the objectives slide (51) promised <strong>FOUR</strong> outcomes; this summary covers only <strong>TWO</strong> headings (rhetorical situation, research). Structure — outcome 4 — is summarised separately on slide 54. The deck splits one section's outcomes across two summaries.</p>
<p class="meo">💡 Memory hook: the rhetorical situation here = <strong>MEDIA + PLACE</strong>, and media = <strong>face-to-face · slides · handouts · whiteboard</strong> (four).</p>`,
        `<p class="y-chinh">🎯 Chỉ hai đề mục. <strong>Tình huống tu từ (the rhetorical situation)</strong>, chẻ thành <strong>Media (phương tiện)</strong> — trực tiếp mặt đối mặt, tương tác MỘT CHIỀU; slide trình chiếu; tài liệu phát tay; bảng viết — và <strong>Place (nơi chốn)</strong> — lớp học; cùng với <strong>Nghiên cứu thay đổi theo mục đích và cấu trúc; nhìn chung dựa trên tài liệu môn học</strong>. Nguồn: <em>(Cottrell, 2013; Dannels, 2000; Edwards, 2004 cited in Alexander et al., 2008)</em>.</p>
<table>
<tr><th>Thành tố của tình huống tu từ</th><th>Chữ in trên slide</th><th>Hàm ý cho bạn</th></tr>
<tr><td>Phương tiện</td><td>Mặt đối mặt, tương tác một chiều; slide; tài liệu phát tay; bảng viết</td><td>Bạn có BỐN kênh, không phải một. Slide chỉ là một phần tư bộ đồ nghề</td></tr>
<tr><td>Nơi chốn</td><td>Lớp học</td><td>Phòng nhỏ, khán giả quen, khung giờ cố định, máy chiếu có thể hỏng</td></tr>
<tr><td>Nghiên cứu</td><td>Thay đổi theo mục đích và cấu trúc; nhìn chung dựa trên tài liệu môn học</td><td>Bắt đầu từ tài liệu của chính môn trước khi đi săn nguồn bên ngoài</td></tr>
</table>
<ul>
<li><strong>"One-way interaction" là cụm dễ ra đề nhất, và cũng dễ hiểu sai nhất.</strong> Nó mô tả DÒNG CHẢY MẶC ĐỊNH của một buổi thuyết trình trên lớp: bạn nói, họ nghe. Nó KHÔNG có nghĩa là cấm tương tác — cả slide 64 nói về việc chủ động mời tương tác. Hãy đọc là "một chiều TRỪ KHI bạn cố ý mở ra".</li>
<li><strong>Bốn phương tiện, mà sinh viên thường chỉ dùng một.</strong> Tài liệu phát tay chở phần chi tiết mà slide KHÔNG nên chở; bảng viết lo cái sơ đồ ngoài kế hoạch khi có câu hỏi cần tới; còn gương mặt và giọng nói của bạn mới là thứ chở sức thuyết phục. Quyết định nội dung nào đi kênh nào là một quyết định thật, không phải trang trí.</li>
<li><strong>"Place: Classrooms" không phải câu độn.</strong> Nó chốt các ràng buộc: ai cũng nhìn thấy bạn, ai cũng nhìn thấy đồng hồ, hàng ghế cuối đọc được cỡ chữ chừng 24pt trở lên, và thiết bị là của PHÒNG chứ không phải của bạn. Gạch đầu tiên của slide 62 ("bảo đảm thiết bị chạy được") ra thẳng từ dòng này.</li>
<li><strong>"Nhìn chung dựa trên tài liệu môn học" là câu thực dụng nhất của cả khối.</strong> Với thuyết trình ở đại học, nền bằng chứng được kỳ vọng thường là bài giảng, tài liệu bắt buộc đọc và giáo trình — không phải thứ đầu tiên máy tìm kiếm trả ra. Trích tài liệu của môn cho người chấm thấy bạn có học; trích một blog vu vơ thì gợi ý điều ngược lại.</li>
<li><strong>Bản thân chuỗi trích dẫn ở đây cũng là một bài học.</strong> "<em>Edwards, 2004 cited in Alexander et al., 2008</em>" là nguồn THỨ CẤP: Edwards là bản gốc, Alexander là chỗ deck đọc được nó. Luật từ Mooc 1 áp dụng — bạn trích thứ bạn THỰC SỰ ĐỌC, và bạn nói rõ điều đó.</li>
</ul>
<p class="pitfall">⚠️ Vênh số lượng cần để ý: slide chuẩn đầu ra (51) hứa <strong>BỐN</strong> mục tiêu; slide tóm tắt này chỉ gói <strong>HAI</strong> đề mục (tình huống tu từ, nghiên cứu). Phần cấu trúc — mục tiêu số 4 — được tóm tắt riêng ở slide 54. Deck chẻ chuẩn đầu ra của một mục ra làm hai slide tóm tắt.</p>
<p class="meo">💡 Mẹo nhớ: tình huống tu từ ở đây = <strong>PHƯƠNG TIỆN + NƠI CHỐN</strong>, và phương tiện = <strong>mặt đối mặt · slide · tài liệu phát tay · bảng viết</strong> (bốn thứ).</p>`],

      [53, '5.2b Planning the Structure of Presentations (objectives — SAME four bullets as 5.2a, with "&" changed to "and")',
        `<p class="y-chinh">🎯 New heading, recycled objectives. <strong>5.2b Planning the Structure of Presentations</strong> reprints slide 51's four bullets with one cosmetic edit: "purpose <strong>and</strong> rhetorical aims" and "create <strong>and</strong> refine" now spell out <em>and</em> where 5.2a used <em>&amp;</em>. Nothing else differs.</p>
<table>
<tr><th>Bullet</th><th>Slide 51 (5.2a)</th><th>Slide 53 (5.2b)</th></tr>
<tr><td>1</td><td>interpret the purpose <strong>&amp;</strong> rhetorical aims of presentations</td><td>interpret the purpose <strong>and</strong> rhetorical aims of presentations</td></tr>
<tr><td>2</td><td>use effective questioning to further understand expectations</td><td>identical</td></tr>
<tr><td>3</td><td>conduct research on your presentation topic</td><td>identical</td></tr>
<tr><td>4</td><td>create <strong>&amp;</strong> refine your presentation structure</td><td>create <strong>and</strong> refine your presentation structure</td></tr>
</table>
<ul>
<li><strong>Name the repetition and move on.</strong> This is the second of five verbatim (or near-verbatim) objectives repeats in slides 44–64. The ampersand change carries no meaning — it is a typing difference between two versions of the same file, not a content revision.</li>
<li><strong>The heading, however, IS new information.</strong> 5.2 splits into a (understanding &amp; researching) and b (planning the structure). Outcome 4 of the shared block — "create and refine your presentation structure" — is what 5.2b is actually about, and its real content lands on slide 54.</li>
<li><strong>Why a whole sub-section for structure alone.</strong> Because structure is where most student presentations fail: the content exists but arrives in an order the audience cannot follow. In speech, unlike writing, the audience cannot scroll back. Order is therefore load-bearing in a way it never is in an essay.</li>
<li><strong>Watch for the title drift ahead.</strong> This slide says "Planning the <em>Structure of</em> Presentations"; its own summary (slide 54) is titled only "Planning presentations". The deck shortens section titles between the objectives page and the summary page repeatedly in this range — see also 55→56, 61→62, 63→64.</li>
<li><strong>FPTU application.</strong> When you revise, do not re-read a repeated objectives slide. Instead, write its section number on a card and put the SUMMARY slide's content on the back. In this range that reduces 21 slides to 16 cards, of which 11 carry the substance.</li>
</ul>
<p class="meo">💡 Exam-safe fact: 5.2 has TWO sub-sections (a and b) sharing ONE four-item objectives block. If an option claims 5.2b has its own distinct objectives, the deck does not support it.</p>`,
        `<p class="y-chinh">🎯 Tiêu đề mới, chuẩn đầu ra tái chế. <strong>5.2b Planning the Structure of Presentations</strong> in lại đúng bốn gạch của slide 51, chỉ sửa một chi tiết hình thức: "purpose <strong>and</strong> rhetorical aims" và "create <strong>and</strong> refine" — chỗ mà 5.2a viết <em>&amp;</em>. Ngoài ra không khác gì.</p>
<table>
<tr><th>Gạch</th><th>Slide 51 (5.2a)</th><th>Slide 53 (5.2b)</th></tr>
<tr><td>1</td><td>interpret the purpose <strong>&amp;</strong> rhetorical aims of presentations</td><td>interpret the purpose <strong>and</strong> rhetorical aims of presentations</td></tr>
<tr><td>2</td><td>use effective questioning to further understand expectations</td><td>y hệt</td></tr>
<tr><td>3</td><td>conduct research on your presentation topic</td><td>y hệt</td></tr>
<tr><td>4</td><td>create <strong>&amp;</strong> refine your presentation structure</td><td>create <strong>and</strong> refine your presentation structure</td></tr>
</table>
<ul>
<li><strong>Gọi tên bản lặp rồi đi tiếp.</strong> Đây là bản lặp chuẩn đầu ra thứ HAI trong năm bản lặp (nguyên văn hoặc gần nguyên văn) của dải 44–64. Việc đổi dấu &amp; thành chữ "and" không mang nghĩa gì — đó là khác biệt lúc gõ giữa hai phiên bản của cùng một file, không phải một lần sửa nội dung.</li>
<li><strong>Nhưng TIÊU ĐỀ thì đúng là thông tin mới.</strong> Mục 5.2 chẻ thành a (hiểu &amp; nghiên cứu) và b (lập cấu trúc). Chuẩn đầu ra số 4 trong khối dùng chung — "tạo và tinh chỉnh cấu trúc bài thuyết trình" — chính là thứ 5.2b nói tới, và nội dung thật của nó nằm ở slide 54.</li>
<li><strong>Vì sao dành hẳn một tiểu mục chỉ cho cấu trúc.</strong> Vì cấu trúc là chỗ phần lớn bài thuyết trình của sinh viên hỏng: nội dung có đủ, nhưng đến theo một thứ tự khán giả không theo nổi. Trong lời nói, khác với chữ viết, khán giả KHÔNG cuộn ngược lại được. Vì thế thứ tự ở đây mang tải nặng theo cách nó không bao giờ mang trong một bài luận.</li>
<li><strong>Để ý hiện tượng TRÔI TIÊU ĐỀ phía trước.</strong> Slide này ghi "Planning the <em>Structure of</em> Presentations"; slide tóm tắt của chính nó (slide 54) chỉ còn "Planning presentations". Trong dải này, deck liên tục rút ngắn tên mục giữa trang chuẩn đầu ra và trang tóm tắt — xem thêm 55→56, 61→62, 63→64.</li>
<li><strong>Áp vào FPTU.</strong> Lúc ôn, đừng đọc lại một slide chuẩn đầu ra đã lặp. Thay vào đó, ghi số mục lên một tấm thẻ và chép nội dung slide TÓM TẮT vào mặt sau. Ở dải này, cách đó rút 21 slide xuống còn 16 thẻ, trong đó 11 thẻ chở phần cốt lõi.</li>
</ul>
<p class="meo">💡 Dữ kiện an toàn để thi: mục 5.2 có HAI tiểu mục (a và b) dùng CHUNG MỘT khối bốn chuẩn đầu ra. Phương án nào bảo 5.2b có chuẩn đầu ra riêng khác thì deck không đỡ cho điều đó.</p>`],

      [54, 'Summary: Planning presentations — plan before software, 3-part basic structure, FOUR specific structure options, storyboard (Anderson et al., 2004; Duarte, 2010; Morgan, 2011; Reynolds, 2012)',
        `<p class="y-chinh">🎯 The densest slide of the presentation block. <strong>Plan before software!</strong> · <strong>Basic structure: introduction, body, conclusion</strong> · <strong>Specific structure options: Chronological order · Narrative structure · Comparing points of view, or Residues approach · General to specific</strong> · <strong>Storyboard: don't use software!</strong> · <strong>Then create slides &amp; notes with presentation software &amp; review</strong>. Sources: <em>(Anderson et al., 2004; Duarte, 2010; Morgan, 2011; Reynolds, 2012)</em>.</p>
<table>
<tr><th>Structure option</th><th>When it fits</th><th>Example for a software project</th></tr>
<tr><td><strong>Chronological order</strong></td><td>The story IS the sequence</td><td>Sprint 1 → 2 → 3, what we learned at each stage</td></tr>
<tr><td><strong>Narrative structure</strong></td><td>You need the audience to care</td><td>A user who missed her appointment → why → what we built</td></tr>
<tr><td><strong>Comparing points of view / Residues approach</strong></td><td>Several options existed and you chose one</td><td>Three auth designs, eliminate two, the "residue" is the choice</td></tr>
<tr><td><strong>General to specific</strong></td><td>The audience needs context before detail</td><td>Clinic scheduling in general → our clinic → our module</td></tr>
</table>
<ul>
<li><strong>"Residues approach" is the term worth learning cold.</strong> You present the candidate options, eliminate each with a reason, and what remains — the residue — is your answer. It is extremely persuasive in a defence because the council watches you rule out the alternatives they were about to raise.</li>
<li><strong>The deck says "don't use software" TWICE, with two exclamation marks.</strong> Plan on paper, storyboard on paper, and only then open the software. The reason is mechanical: presentation software makes you think in slides, one idea per rectangle, and a talk built that way has no argument spine. Notice the order the slide prescribes: plan → storyboard → <em>then</em> create slides &amp; notes → review.</li>
<li><strong>Basic structure is THREE parts; specific options are FOUR.</strong> Two different counts on one slide — a classic multiple-choice trap. Introduction/body/conclusion = 3. Chronological/narrative/comparing-or-residues/general-to-specific = 4.</li>
<li><strong>"Comparing points of view, or Residues approach" is printed as ONE bullet.</strong> So the count is four, not five. If an exam option lists five specific structure options by separating those two, it has miscounted the slide.</li>
<li><strong>"&amp; review" at the end closes the loop.</strong> Making the slides is not the last step; reviewing them is. This mirrors "evaluate and refine" from the writing block exactly.</li>
</ul>
<p class="dap-an">✅ Worked plan for a 15-minute SWP391 defence (structure: general to specific, with a residues section). <strong>0:00–1:30 Introduction</strong> — the problem, who has it, what you built, and the running order (this is your signposting). <strong>1:30–4:00</strong> context and requirements. <strong>4:00–7:00</strong> architecture and the residues section: three design options, two eliminated with reasons, one remains. <strong>7:00–11:00</strong> live demo of the two or three flows that carry the marks — rehearsed, with a recorded video as backup. <strong>11:00–13:00</strong> testing, results, limitations stated honestly. <strong>13:00–14:00 Conclusion</strong> — restate what was built and what you would do next. <strong>14:00–15:00</strong> invite questions. Slide budget: roughly one slide per minute of speaking, so 12–15 slides plus a title slide — and no slide with more than about six lines or below 24pt.</p>
<p class="pitfall">⚠️ Citation drift to note: this slide prints <strong>Duarte, 2010</strong>, while slide 56 prints <strong>Duarte, 2008</strong> for the same author. The deck is inconsistent; do not "correct" either — just do not be surprised if an exam question quotes one of them.</p>
<p class="meo">💡 Golden rule from this slide, one line: <strong>paper first, software last, review after.</strong> And the slide rule that follows from it — the audience reads OR listens, never both: never read your slides aloud.</p>`,
        `<p class="y-chinh">🎯 Slide đặc nhất của khối thuyết trình. <strong>Lập kế hoạch TRƯỚC khi mở phần mềm!</strong> · <strong>Cấu trúc cơ bản: mở bài, thân bài, kết luận</strong> · <strong>Các lựa chọn cấu trúc cụ thể: Theo trình tự thời gian · Cấu trúc tự sự · So sánh các quan điểm, hay phương pháp Residues · Từ tổng quát tới cụ thể</strong> · <strong>Dựng storyboard: ĐỪNG dùng phần mềm!</strong> · <strong>Rồi mới tạo slide &amp; ghi chú bằng phần mềm và RÀ LẠI</strong>. Nguồn: <em>(Anderson et al., 2004; Duarte, 2010; Morgan, 2011; Reynolds, 2012)</em>.</p>
<table>
<tr><th>Kiểu cấu trúc</th><th>Hợp khi nào</th><th>Ví dụ cho một đồ án phần mềm</th></tr>
<tr><td><strong>Trình tự thời gian</strong></td><td>Bản thân câu chuyện LÀ trình tự</td><td>Sprint 1 → 2 → 3, mỗi chặng học được gì</td></tr>
<tr><td><strong>Tự sự (narrative)</strong></td><td>Cần khán giả THẤY QUAN TÂM</td><td>Một người bệnh lỡ lịch khám → vì sao → nhóm đã làm gì</td></tr>
<tr><td><strong>So sánh quan điểm / Residues</strong></td><td>Có nhiều phương án và bạn đã chọn một</td><td>Ba thiết kế xác thực, loại hai, "phần còn lại" chính là lựa chọn</td></tr>
<tr><td><strong>Tổng quát → cụ thể</strong></td><td>Khán giả cần bối cảnh trước chi tiết</td><td>Đặt lịch khám nói chung → phòng khám này → phân hệ của nhóm</td></tr>
</table>
<ul>
<li><strong>"Residues approach" là thuật ngữ đáng thuộc nằm lòng.</strong> Bạn trình bày các phương án ứng viên, loại từng cái kèm LÝ DO, và thứ còn lại — cái "cặn", residue — chính là câu trả lời của bạn. Nó cực kỳ thuyết phục trong buổi bảo vệ, vì hội đồng được nhìn bạn tự loại đúng những phương án họ sắp hỏi tới.</li>
<li><strong>Deck nói "đừng dùng phần mềm" tới HAI lần, với hai dấu chấm than.</strong> Lập kế hoạch trên giấy, dựng storyboard trên giấy, rồi mới mở phần mềm. Lý do rất cơ học: phần mềm trình chiếu ép bạn nghĩ theo SLIDE — mỗi ý một hình chữ nhật — và bài nói dựng kiểu đó không có xương sống lập luận. Để ý đúng thứ tự slide quy định: lập kế hoạch → storyboard → <em>rồi mới</em> tạo slide &amp; ghi chú → rà lại.</li>
<li><strong>Cấu trúc cơ bản có BA phần; lựa chọn cấu trúc cụ thể có BỐN.</strong> Hai con số khác nhau trên cùng một slide — bẫy trắc nghiệm kinh điển. Mở/thân/kết = 3. Thời gian/tự sự/so sánh-hay-residues/tổng quát-tới-cụ thể = 4.</li>
<li><strong>"Comparing points of view, or Residues approach" in thành MỘT gạch.</strong> Nên con số là BỐN, không phải năm. Phương án thi nào liệt kê năm kiểu cấu trúc bằng cách tách đôi mục đó ra là đã đếm sai slide.</li>
<li><strong>Chữ "&amp; review" ở cuối khép vòng lặp.</strong> Làm xong slide KHÔNG phải bước cuối; RÀ LẠI mới là bước cuối. Chỗ này soi gương chính xác với "evaluate and refine" của khối bài viết.</li>
</ul>
<p class="dap-an">✅ Kế hoạch mẫu cho buổi bảo vệ SWP391 15 phút (cấu trúc: tổng quát → cụ thể, có chèn một đoạn residues). <strong>0:00–1:30 Mở đầu</strong> — vấn đề, ai gặp nó, nhóm đã làm gì, và thứ tự trình bày (đây chính là signposting). <strong>1:30–4:00</strong> bối cảnh và yêu cầu. <strong>4:00–7:00</strong> kiến trúc và đoạn residues: ba phương án thiết kế, loại hai kèm lý do, còn lại một. <strong>7:00–11:00</strong> demo trực tiếp đúng hai ba luồng chở điểm — đã tập trước, và có sẵn video quay lại làm phương án dự phòng. <strong>11:00–13:00</strong> kiểm thử, kết quả, và nêu hạn chế một cách trung thực. <strong>13:00–14:00 Kết luận</strong> — nhắc lại đã làm được gì và bước tiếp theo sẽ là gì. <strong>14:00–15:00</strong> mời đặt câu hỏi. Ngân sách slide: xấp xỉ MỘT slide cho mỗi phút nói, tức 12–15 slide cộng slide bìa — và không slide nào quá khoảng sáu dòng hay cỡ chữ dưới 24pt.</p>
<p class="pitfall">⚠️ Lệch năm nguồn cần ghi nhận: slide này in <strong>Duarte, 2010</strong>, còn slide 56 in <strong>Duarte, 2008</strong> cho cùng tác giả. Deck không nhất quán; ĐỪNG tự "sửa" cái nào — chỉ cần đừng ngạc nhiên nếu đề thi trích một trong hai.</p>
<p class="meo">💡 Luật vàng rút từ slide này, một dòng: <strong>giấy trước, phần mềm sau, rà lại sau cùng.</strong> Và luật slide suy ra từ đó — khán giả HOẶC đọc HOẶC nghe, không bao giờ cùng lúc: ĐỪNG BAO GIỜ đọc slide thành tiếng.</p>`],

      [55, '5.3a Preparing Visual Aids (objectives — THREE outcomes shared by 5.3a, 5.3b and 5.3c)',
        `<p class="y-chinh">🎯 Section 5.3 opens with <strong>three</strong> outcomes that will be reprinted unchanged on slides 57 and 59: <strong>appropriately incorporate visual aids in presentations</strong> · <strong>write scripts and notes for presentations</strong> · <strong>use strategies to practice effective presentation delivery</strong>.</p>
<table>
<tr><th>Outcome</th><th>Sub-section that actually delivers it</th><th>Its summary slide</th></tr>
<tr><td>incorporate visual aids</td><td>5.3a Preparing Visual Aids</td><td>56</td></tr>
<tr><td>write scripts and notes</td><td>5.3b Writing Your Script</td><td>58</td></tr>
<tr><td>practise delivery</td><td>5.3c Practising Your Script</td><td>60</td></tr>
</table>
<ul>
<li><strong>The three outcomes map one-to-one onto 5.3a, 5.3b and 5.3c.</strong> That is the single most useful thing on this slide: the block is one objectives page serving three sub-sections, each of which takes exactly one outcome. Learn the mapping and the three repeats stop being confusing.</li>
<li><strong>"Appropriately" is doing real work in outcome 1.</strong> Not "use lots of visual aids" — use them appropriately, meaning the visual serves the point rather than decorating the slide. Slide 56 turns this into three stated purposes.</li>
<li><strong>Note "scripts AND notes" — two different artefacts.</strong> The script is the full text you write; the notes are what you actually hold on the day. Slide 58 ends with "Script → Notes!", making the transformation explicit. Writing a script and then reading it aloud is not the intended use.</li>
<li><strong>Spelling inconsistency worth noticing.</strong> The bullet says "practice effective presentation delivery" while the section heading on slide 59 says "<strong>Practising</strong> Your Script" — British English uses <em>practise</em> for the verb. The deck mixes conventions; the content is unaffected, and you should not "fix" the quoted wording in an answer.</li>
<li><strong>FPTU application.</strong> Treat the three outcomes as three evenings of work before a defence: evening 1 build the visuals, evening 2 write the script and cut it down to notes, evening 3 rehearse with a timer. Doing all three the night before is how teams end up reading slides aloud.</li>
</ul>
<p class="meo">💡 Three words for section 5.3: <strong>VISUALS · SCRIPT · PRACTICE</strong> — in that order, one per sub-section.</p>`,
        `<p class="y-chinh">🎯 Mục 5.3 mở màn với <strong>BA</strong> chuẩn đầu ra mà slide 57 và 59 sẽ in lại y nguyên: <strong>lồng ghép hình ảnh minh hoạ vào bài thuyết trình một cách PHÙ HỢP</strong> · <strong>viết kịch bản và ghi chú cho bài thuyết trình</strong> · <strong>dùng các chiến lược để LUYỆN trình bày hiệu quả</strong>.</p>
<table>
<tr><th>Chuẩn đầu ra</th><th>Tiểu mục thật sự dạy nó</th><th>Slide tóm tắt của nó</th></tr>
<tr><td>lồng ghép hình ảnh</td><td>5.3a Preparing Visual Aids</td><td>56</td></tr>
<tr><td>viết kịch bản và ghi chú</td><td>5.3b Writing Your Script</td><td>58</td></tr>
<tr><td>luyện trình bày</td><td>5.3c Practising Your Script</td><td>60</td></tr>
</table>
<ul>
<li><strong>Ba chuẩn đầu ra ánh xạ MỘT–MỘT vào 5.3a, 5.3b và 5.3c.</strong> Đó là thứ hữu ích nhất trên slide này: cả khối chỉ có MỘT trang chuẩn đầu ra phục vụ BA tiểu mục, mỗi tiểu mục nhận đúng một chuẩn. Thuộc cái ánh xạ này thì ba bản lặp hết gây rối.</li>
<li><strong>Chữ "appropriately" (phù hợp) đang làm việc thật ở chuẩn 1.</strong> Không phải "dùng thật nhiều hình" — mà dùng cho PHÙ HỢP, nghĩa là cái hình phục vụ luận điểm chứ không trang trí cho slide. Slide 56 biến ý này thành ba mục đích được nói rõ.</li>
<li><strong>Để ý "scripts AND notes" — HAI sản phẩm khác nhau.</strong> Kịch bản (script) là phần chữ đầy đủ bạn viết ra; ghi chú (notes) là thứ bạn thật sự cầm trên tay hôm đó. Slide 58 kết bằng "Script → Notes!", nói rõ phép biến đổi này. Viết một kịch bản rồi đứng đọc nó KHÔNG phải cách dùng đúng.</li>
<li><strong>Chỗ chính tả không nhất quán đáng ghi nhận.</strong> Gạch đầu dòng viết "practice effective presentation delivery" trong khi tiêu đề mục ở slide 59 viết "<strong>Practising</strong> Your Script" — tiếng Anh–Anh dùng <em>practise</em> cho động từ. Deck trộn hai quy ước; nội dung không bị ảnh hưởng, và bạn KHÔNG nên tự "sửa" chữ được trích trong bài làm.</li>
<li><strong>Áp vào FPTU.</strong> Hãy coi ba chuẩn đầu ra là BA BUỔI TỐI làm việc trước buổi bảo vệ: tối 1 dựng hình ảnh, tối 2 viết kịch bản rồi rút thành ghi chú, tối 3 tập với đồng hồ bấm giờ. Dồn cả ba vào đúng đêm hôm trước chính là cách các nhóm rơi vào cảnh đứng đọc slide.</li>
</ul>
<p class="meo">💡 Ba chữ cho mục 5.3: <strong>HÌNH ẢNH · KỊCH BẢN · LUYỆN TẬP</strong> — đúng thứ tự đó, mỗi chữ một tiểu mục.</p>`],

      [56, 'Summary: Preparing Visual Aids for Presentations — THREE purposes + four rules (Anderson et al., 2004; Duarte, 2008; Tufte, 2006)',
        `<p class="y-chinh">🎯 Five bullets. <strong>Purposes of visual aids: to make complex ideas clearer, to provide evidence, to entertain</strong> · <strong>Greater range of visual aids in presentations</strong> · <strong>Think carefully about the readability of text and images</strong> · <strong>Organise information within and across slides</strong> · <strong>Consider the purpose of information graphics</strong>. Sources: <em>(Anderson et al., 2004; Duarte, 2008; Tufte, 2006)</em>.</p>
<table>
<tr><th>Purpose (there are THREE)</th><th>What that visual looks like</th><th>Test it must pass</th></tr>
<tr><td>Make complex ideas clearer</td><td>Architecture diagram, flowchart, model</td><td>Could the audience follow this idea without it? If yes, cut it</td></tr>
<tr><td>Provide evidence</td><td>Chart of measurements, screenshot of a result, table of test outcomes</td><td>Does it show data you will cite out loud?</td></tr>
<tr><td>Entertain</td><td>A photo, a light image that holds attention</td><td>Does it hold attention without stealing it?</td></tr>
</table>
<ul>
<li><strong>Memorise the THREE purposes — clarify, evidence, entertain.</strong> "Entertain" surprises students and is therefore a favourite distractor: it IS on the slide, it is legitimate, and it is third. An option offering "to fill time" or "to reduce how much you have to say" is not on the slide.</li>
<li><strong>"Greater range … in presentations" is a comparison with WRITTEN work.</strong> In an essay you are largely limited to figures and tables; in a talk you can also use video, animation, physical objects, live demos and the whiteboard. The deck flags the wider palette because students carry essay habits into talks.</li>
<li><strong>"Readability" is a measurable constraint, not a matter of taste.</strong> Back-row rule: roughly 24pt minimum for body text, high contrast, no full-sentence paragraphs, and any screenshot you would have to zoom into should be cropped to the part that matters. If you must say "I know this is small", the slide has already failed.</li>
<li><strong>"Within and across slides" is two organisational levels.</strong> <em>Within</em>: one idea per slide, consistent position for titles, aligned elements. <em>Across</em>: a visible progression, so the audience knows where they are — section dividers, a repeated agenda marker, consistent colour meaning. Across-slide organisation is what makes a deck feel like an argument instead of a pile.</li>
<li><strong>"Consider the purpose of information graphics" echoes slide 47's "predetermined purposes".</strong> Same rule, two contexts: written assignments (47) and presentations (56). The citation of <strong>Tufte, 2006</strong> is the signal — Tufte is the standard reference for honest, low-clutter information design.</li>
</ul>
<p class="dap-an">✅ Applying it to the SWP391 defence deck: the architecture diagram = <em>clarify</em>; the response-time chart before/after caching and the test-coverage table = <em>evidence</em>; one photograph of the real clinic queue on the problem slide = <em>entertain</em> (it holds attention and it argues). Anything that does not fit one of the three purposes comes out of the deck.</p>
<p class="pitfall">⚠️ Two deck quirks on this one slide: the title gains words its objectives page did not have (55 "Preparing Visual Aids" → 56 "Preparing Visual Aids <strong>for Presentations</strong>"), and the citation reads <strong>Duarte, 2008</strong> where slide 54 read Duarte, 2010.</p>
<p class="meo">💡 Count carefully: <strong>THREE purposes</strong>, inside a <strong>five-bullet</strong> summary. Exam questions love asking for one number and offering the other.</p>`,
        `<p class="y-chinh">🎯 Năm gạch đầu dòng. <strong>Mục đích của hình minh hoạ: làm rõ ý phức tạp, cung cấp bằng chứng, GÂY THÍCH THÚ (entertain)</strong> · <strong>Dải hình minh hoạ trong thuyết trình RỘNG HƠN</strong> · <strong>Cân nhắc kỹ độ dễ đọc của chữ và ảnh</strong> · <strong>Tổ chức thông tin TRONG từng slide và XUYÊN các slide</strong> · <strong>Cân nhắc mục đích của đồ hoạ thông tin</strong>. Nguồn: <em>(Anderson et al., 2004; Duarte, 2008; Tufte, 2006)</em>.</p>
<table>
<tr><th>Mục đích (có BA)</th><th>Hình đó trông ra sao</th><th>Phép thử nó phải qua</th></tr>
<tr><td>Làm rõ ý phức tạp</td><td>Sơ đồ kiến trúc, lưu đồ, mô hình</td><td>Không có nó khán giả vẫn theo được ý này chứ? Nếu có thì CẮT</td></tr>
<tr><td>Cung cấp bằng chứng</td><td>Biểu đồ số đo, ảnh chụp kết quả, bảng kết quả kiểm thử</td><td>Nó có trưng ra dữ liệu mà bạn sẽ nói thành lời không?</td></tr>
<tr><td>Gây thích thú</td><td>Một tấm ảnh, một hình nhẹ giữ được sự chú ý</td><td>Nó giữ chú ý mà không CƯỚP mất chú ý chứ?</td></tr>
</table>
<ul>
<li><strong>Thuộc BA mục đích — làm rõ, bằng chứng, gây thích thú.</strong> Chữ "entertain" làm sinh viên bất ngờ nên rất hay được dùng làm phương án gây nhiễu: nó CÓ trên slide, nó chính đáng, và nó đứng thứ ba. Phương án nào ghi "để giết thời gian" hay "để phải nói ít đi" thì không có trên slide.</li>
<li><strong>"Dải rộng hơn… trong thuyết trình" là một phép SO SÁNH với bài VIẾT.</strong> Trong bài luận bạn gần như chỉ có hình và bảng; trong buổi nói bạn còn có video, hoạt hình, vật thật, demo trực tiếp và bảng viết. Deck nhấn cái bảng màu rộng hơn này vì sinh viên hay mang thói quen viết luận vào buổi nói.</li>
<li><strong>"Độ dễ đọc" là ràng buộc ĐO ĐƯỢC, không phải chuyện thẩm mỹ.</strong> Luật hàng ghế cuối: chữ nội dung tối thiểu cỡ 24pt, tương phản cao, không đoạn văn trọn câu, và mọi ảnh chụp màn hình mà bạn phải phóng to mới thấy thì phải CẮT lấy đúng phần quan trọng. Nếu bạn buộc phải nói "em biết là hơi nhỏ", cái slide đó đã hỏng rồi.</li>
<li><strong>"Trong và xuyên các slide" là HAI cấp tổ chức.</strong> <em>Trong</em>: mỗi slide một ý, tiêu đề luôn ở một vị trí, các khối căn thẳng hàng. <em>Xuyên</em>: có một tiến trình nhìn thấy được để khán giả biết mình đang ở đâu — slide phân đoạn, một dấu mốc chương trình lặp lại, màu sắc mang nghĩa nhất quán. Chính tổ chức XUYÊN slide làm cho một bộ slide giống một LẬP LUẬN thay vì một đống.</li>
<li><strong>"Cân nhắc mục đích của đồ hoạ thông tin" vọng lại đúng "predetermined purposes" của slide 47.</strong> Cùng một luật, hai bối cảnh: bài viết (47) và thuyết trình (56). Dòng trích <strong>Tufte, 2006</strong> là tín hiệu — Tufte là nguồn chuẩn về thiết kế thông tin trung thực, ít rườm rà.</li>
</ul>
<p class="dap-an">✅ Áp vào bộ slide bảo vệ SWP391: sơ đồ kiến trúc = <em>làm rõ</em>; biểu đồ thời gian phản hồi trước/sau khi cache và bảng độ phủ kiểm thử = <em>bằng chứng</em>; một tấm ảnh hàng người chờ khám thật ở slide nêu vấn đề = <em>gây thích thú</em> (nó vừa giữ chú ý vừa lập luận). Thứ gì không rơi vào một trong ba mục đích thì bỏ ra khỏi bộ slide.</p>
<p class="pitfall">⚠️ Hai đặc tính deck trên đúng một slide: tiêu đề DÀI RA so với trang chuẩn đầu ra của nó (55 "Preparing Visual Aids" → 56 "Preparing Visual Aids <strong>for Presentations</strong>"), và dòng trích ghi <strong>Duarte, 2008</strong> trong khi slide 54 ghi Duarte, 2010.</p>
<p class="meo">💡 Đếm cho kỹ: <strong>BA mục đích</strong>, nằm trong một slide tóm tắt <strong>NĂM gạch</strong>. Câu thi rất thích hỏi con số này rồi chìa ra con số kia.</p>`],

      [57, '5.3b Writing Your Script (objectives — the SAME three bullets as 5.3a, verbatim)',
        `<p class="y-chinh">🎯 Third repeat of the objectives block. Heading: <strong>5.3b Writing Your Script</strong>; bullets: <strong>appropriately incorporate visual aids in presentations · write scripts and notes for presentations · use strategies to practice effective presentation delivery</strong> — identical to slide 55, no edits at all.</p>
<ul>
<li><strong>State the count honestly: 5 of the 21 slides in this range are objectives repeats.</strong> Slides 46, 53, 57, 59 and 63. That is roughly a quarter of the deck carrying no new content, which means the real workload of slides 44–64 is about <strong>16 pages</strong>, not 21. Knowing that changes how you budget revision time.</li>
<li><strong>The only new fact here is the sub-section name.</strong> 5.3b = "Writing Your Script". Its substance is entirely on slide 58. Treat slide 57 as a divider.</li>
<li><strong>Why the script deserves its own sub-section.</strong> Because a talk is not an essay read aloud, and it is not improvisation either. Writing the script forces you to discover that a sentence which reads well takes twenty seconds to say — and twenty seconds times forty sentences is already over your time limit.</li>
<li><strong>Repeats are a signal about the source file, and they are worth interpreting, not ignoring.</strong> A deck that reuses one objectives block across three sub-sections was assembled from a course where the objectives were stated once per module, not once per lesson. That is why the summary slides, not the objectives slides, carry all the testable content in this deck.</li>
<li><strong>FPTU application.</strong> Build your revision notes from the eleven summary slides in this range (45, 47, 48, 50, 52, 54, 56, 58, 60, 62, 64). Those eleven contain essentially every fact, list and number the exam can ask about from slides 44–64.</li>
</ul>
<table>
<tr><th>Objectives slide</th><th>Heading</th><th>Status</th></tr>
<tr><td>55</td><td>5.3a Preparing Visual Aids</td><td>First appearance of the 3-bullet block</td></tr>
<tr><td>57</td><td>5.3b Writing Your Script</td><td>Verbatim repeat</td></tr>
<tr><td>59</td><td>5.3c Practising Your Script</td><td>Verbatim repeat</td></tr>
</table>
<p class="meo">💡 Rule of thumb for this deck: <strong>objectives pages tell you the MAP, summary pages tell you the CONTENT.</strong> Read maps once.</p>`,
        `<p class="y-chinh">🎯 Lần lặp thứ ba của khối chuẩn đầu ra. Tiêu đề: <strong>5.3b Writing Your Script</strong>; gạch đầu dòng: <strong>lồng ghép hình ảnh phù hợp · viết kịch bản và ghi chú · dùng chiến lược luyện trình bày hiệu quả</strong> — y hệt slide 55, không sửa một chữ nào.</p>
<ul>
<li><strong>Nói thẳng con số: 5 trong 21 slide của dải này là bản lặp chuẩn đầu ra.</strong> Đó là các slide 46, 53, 57, 59 và 63. Tức khoảng một phần tư deck không chở nội dung mới, nghĩa là khối lượng THẬT của slide 44–64 vào khoảng <strong>16 trang</strong>, không phải 21. Biết điều đó thì cách bạn chia thời gian ôn cũng đổi.</li>
<li><strong>Dữ kiện mới duy nhất ở đây là TÊN tiểu mục.</strong> 5.3b = "Writing Your Script". Phần thực chất của nó nằm trọn ở slide 58. Hãy coi slide 57 là tấm phân cách.</li>
<li><strong>Vì sao kịch bản xứng đáng có hẳn một tiểu mục.</strong> Vì một buổi nói KHÔNG phải một bài luận đọc lên, và cũng KHÔNG phải ứng khẩu. Viết kịch bản buộc bạn phát hiện ra rằng một câu đọc trên giấy rất xuôi thì nói ra mất hai mươi giây — và hai mươi giây nhân bốn mươi câu là đã vượt giờ.</li>
<li><strong>Các bản lặp là TÍN HIỆU về file nguồn, đáng diễn giải chứ không đáng lờ đi.</strong> Một deck dùng lại một khối chuẩn đầu ra cho ba tiểu mục là deck được lắp từ một khoá học nơi chuẩn đầu ra được nêu MỘT LẦN cho cả mô-đun, không phải mỗi bài một lần. Đó chính là lý do trong deck này, các slide TÓM TẮT — chứ không phải slide chuẩn đầu ra — mới chở toàn bộ nội dung ra đề được.</li>
<li><strong>Áp vào FPTU.</strong> Hãy dựng bộ ghi chú ôn thi từ MƯỜI MỘT slide tóm tắt của dải này (45, 47, 48, 50, 52, 54, 56, 58, 60, 62, 64). Mười một slide đó chứa gần như mọi dữ kiện, danh sách và con số mà đề thi có thể hỏi từ slide 44–64.</li>
</ul>
<table>
<tr><th>Slide chuẩn đầu ra</th><th>Tiêu đề</th><th>Tình trạng</th></tr>
<tr><td>55</td><td>5.3a Preparing Visual Aids</td><td>Lần đầu xuất hiện của khối 3 gạch</td></tr>
<tr><td>57</td><td>5.3b Writing Your Script</td><td>Lặp nguyên văn</td></tr>
<tr><td>59</td><td>5.3c Practising Your Script</td><td>Lặp nguyên văn</td></tr>
</table>
<p class="meo">💡 Quy tắc ngón tay cái cho deck này: <strong>trang chuẩn đầu ra cho bạn BẢN ĐỒ, trang tóm tắt cho bạn NỘI DUNG.</strong> Bản đồ chỉ cần đọc một lần.</p>`],

      [58, 'Summary: Writing your script — Language, Structure, References, and "Script → Notes!" (Reinders et al., 2008; Cottrell, 2013; Reynolds, 2012)',
        `<p class="y-chinh">🎯 Four headings. <strong>Language</strong> (balanced between academic &amp; informal · not complicated) · <strong>Structure</strong> (explicit &amp; clear · use signposting throughout) · <strong>References</strong> (Necessary!) · and the closing arrow <strong>Script → Notes!</strong>. Sources: <em>(Reinders et al., 2008; Cottrell, 2013; Reynolds, 2012)</em>.</p>
<table>
<tr><th>Heading</th><th>Rule on the slide</th><th>What it means in practice</th></tr>
<tr><td>Language</td><td>Balanced between academic &amp; informal; not complicated</td><td>Full academic vocabulary, spoken sentence length. Say "we found" not "it was ascertained"</td></tr>
<tr><td>Structure</td><td>Explicit &amp; clear; signposting throughout</td><td>Announce the plan, announce each transition, announce the end</td></tr>
<tr><td>References</td><td>Necessary!</td><td>Cite out loud: "as Tufte argues…", "the 2019 study by…"</td></tr>
<tr><td>Script → Notes</td><td>Necessary!</td><td>Write it in full, then compress to cues you can glance at</td></tr>
</table>
<ul>
<li><strong>"Balanced between academic and informal" is the single hardest instruction in the block, and the most examinable.</strong> Too academic and the audience cannot follow spoken subordinate clauses; too informal and you sound unprepared. The balance point: academic in TERMINOLOGY and evidence, informal in SENTENCE SHAPE — short sentences, active voice, real pronouns.</li>
<li><strong>Signposting is the spoken equivalent of headings, and it is non-optional here.</strong> "There are three parts to this: first the problem, then our design, then the results." "That was the problem; now the design." "So, to conclude." In an essay the reader sees the structure; in a talk they can only hear it, so you must say it out loud.</li>
<li><strong>"References — Necessary!" with an exclamation mark.</strong> Students routinely believe citation is a written-work rule only. The slide flatly contradicts that. Spoken citation is short: name, and year or work, plus why it matters. It costs three seconds and it is the difference between an informed talk and an opinionated one.</li>
<li><strong>"Script → Notes!" is the whole method in four characters.</strong> Write the full script, because writing exposes what you cannot actually say in the time. Then reduce it to notes — a few cue words per section, big enough to read at a glance — because reading a script aloud kills eye contact, flattens intonation and makes you unable to adapt. The script is a tool for preparing; the notes are the tool for delivering.</li>
<li><strong>FPTU application.</strong> For the SWP391 defence, write a full script (about 130–150 spoken words per minute, so roughly 2,000 words for 15 minutes), time it, cut 15%, then reduce each section to one index card with at most five cue phrases plus the exact opening sentence and the exact closing sentence written out in full — those two are the ones you most need to survive nerves.</li>
</ul>
<p class="dap-an">✅ Model signposting for the defence, in Vietnamese: mở đầu — "Bài trình bày của nhóm em gồm ba phần: vấn đề và yêu cầu, thiết kế hệ thống, và kết quả kiểm thử. Phần demo nằm ở cuối phần hai." Chuyển ý — "Đó là phần yêu cầu. Bây giờ em xin chuyển sang thiết kế." Kết — "Tóm lại, nhóm em đã xây dựng… và hướng phát triển tiếp theo là… Em xin hết phần trình bày, kính mời thầy cô đặt câu hỏi."</p>
<p class="meo">💡 Four items, and two of them end in an exclamation mark on the slide: <strong>References — Necessary!</strong> and <strong>Script → Notes!</strong> The deck only shouts twice; both are easy marks.</p>`,
        `<p class="y-chinh">🎯 Bốn đề mục. <strong>Ngôn ngữ</strong> (cân bằng giữa học thuật &amp; thân mật · không rối rắm) · <strong>Cấu trúc</strong> (tường minh &amp; rõ ràng · dùng SIGNPOSTING xuyên suốt) · <strong>Tài liệu tham khảo</strong> (Bắt buộc!) · và mũi tên khép lại <strong>Script → Notes!</strong> (Kịch bản → Ghi chú!). Nguồn: <em>(Reinders et al., 2008; Cottrell, 2013; Reynolds, 2012)</em>.</p>
<table>
<tr><th>Đề mục</th><th>Luật trên slide</th><th>Thực tế nghĩa là gì</th></tr>
<tr><td>Ngôn ngữ</td><td>Cân bằng học thuật &amp; thân mật; không rối rắm</td><td>Thuật ngữ học thuật đầy đủ, nhưng ĐỘ DÀI CÂU kiểu nói. Nói "nhóm em thấy rằng" chứ đừng "điều đó đã được xác lập"</td></tr>
<tr><td>Cấu trúc</td><td>Tường minh &amp; rõ; signposting xuyên suốt</td><td>Công bố dàn bài, công bố mỗi lần chuyển ý, công bố lúc kết</td></tr>
<tr><td>Tài liệu tham khảo</td><td>Bắt buộc!</td><td>Trích DẪN THÀNH LỜI: "như Tufte lập luận…", "nghiên cứu năm 2019 của…"</td></tr>
<tr><td>Kịch bản → Ghi chú</td><td>Bắt buộc!</td><td>Viết đầy đủ trước, rồi nén thành các từ khoá liếc mắt là thấy</td></tr>
</table>
<ul>
<li><strong>"Cân bằng giữa học thuật và thân mật" là chỉ dẫn khó nhất khối này, và cũng dễ ra đề nhất.</strong> Học thuật quá thì khán giả không theo nổi những mệnh đề phụ khi NGHE; thân mật quá thì nghe như chưa chuẩn bị. Điểm cân bằng: học thuật ở THUẬT NGỮ và BẰNG CHỨNG, thân mật ở HÌNH DẠNG CÂU — câu ngắn, chủ động, có đại từ thật.</li>
<li><strong>Signposting là bản nói của các tiêu đề trong bài viết, và ở đây nó KHÔNG phải tuỳ chọn.</strong> "Phần này gồm ba ý: trước hết là vấn đề, sau đó là thiết kế, cuối cùng là kết quả." "Đó là phần vấn đề; bây giờ sang thiết kế." "Vậy, tóm lại." Trong bài luận người đọc NHÌN THẤY cấu trúc; trong buổi nói họ chỉ NGHE được, nên bạn phải nói nó ra thành lời.</li>
<li><strong>"References — Necessary!" có dấu chấm than.</strong> Sinh viên thường đinh ninh trích dẫn chỉ là luật của bài viết. Slide bác thẳng điều đó. Trích dẫn khi nói rất ngắn: tên tác giả, năm hoặc tên công trình, và vì sao nó quan trọng. Nó tốn ba giây và là khác biệt giữa một bài nói CÓ CĂN CỨ với một bài nói chỉ toàn ý kiến.</li>
<li><strong>"Script → Notes!" gói cả phương pháp trong bốn ký tự.</strong> VIẾT kịch bản đầy đủ, vì chính việc viết mới lộ ra thứ bạn không kịp nói trong thời lượng. Rồi RÚT thành ghi chú — vài từ khoá cho mỗi phần, cỡ chữ đủ to để liếc một cái là thấy — vì đứng đọc kịch bản thì mất giao tiếp bằng mắt, giọng bẹt đi và bạn không còn ứng biến được. Kịch bản là công cụ để CHUẨN BỊ; ghi chú mới là công cụ để TRÌNH BÀY.</li>
<li><strong>Áp vào FPTU.</strong> Với buổi bảo vệ SWP391: viết kịch bản đầy đủ (tốc độ nói chừng 130–150 từ/phút, tức khoảng 2.000 từ cho 15 phút), bấm giờ đọc thử, cắt bớt 15%, rồi rút mỗi phần xuống MỘT tấm thẻ với tối đa năm cụm từ khoá — cộng với CÂU MỞ ĐẦU và CÂU KẾT viết nguyên văn, vì đúng hai câu đó là thứ bạn cần nhất để sống sót qua cơn hồi hộp.</li>
</ul>
<p class="dap-an">✅ Mẫu signposting cho buổi bảo vệ, bằng tiếng Việt: mở đầu — "Bài trình bày của nhóm em gồm ba phần: vấn đề và yêu cầu, thiết kế hệ thống, và kết quả kiểm thử. Phần demo nằm ở cuối phần hai." Chuyển ý — "Đó là phần yêu cầu. Bây giờ em xin chuyển sang thiết kế." Kết — "Tóm lại, nhóm em đã xây dựng… và hướng phát triển tiếp theo là… Em xin hết phần trình bày, kính mời thầy cô đặt câu hỏi."</p>
<p class="meo">💡 Bốn mục, và hai trong số đó kết thúc bằng dấu chấm than trên slide: <strong>References — Necessary!</strong> và <strong>Script → Notes!</strong> Cả deck chỉ "hét" hai lần; cả hai đều là điểm dễ ăn.</p>`],

      [59, '5.3c Practising Your Script (objectives — the SAME three bullets again; "Practising" in the title vs "practice" in the bullet)',
        `<p class="y-chinh">🎯 The third printing of the same three-bullet block, now under <strong>5.3c Practising Your Script</strong>. Bullets unchanged from slides 55 and 57: appropriately incorporate visual aids · write scripts and notes · use strategies to <em>practice</em> effective presentation delivery.</p>
<ul>
<li><strong>Spelling inconsistency, stated plainly and NOT corrected here.</strong> The heading uses the British verb form <strong>Practising</strong>; the bullet under it uses <strong>practice</strong>, which in British English is the noun. Both appear on the same slide. This is the deck's own inconsistency — quote it as printed, do not silently normalise it in an answer.</li>
<li><strong>Section 5.3 is now fully mapped: a = visual aids, b = script, c = practice.</strong> Three sub-sections, one shared objectives block, three separate summaries (56, 58, 60). That mapping is the examinable structure; the repeats are not.</li>
<li><strong>Practice is given equal billing with content, and that is the argument being made.</strong> Most students treat rehearsal as optional polish. By giving it a full sub-section with its own summary and its own five-source citation line, the deck asserts that delivery is a skill to be trained, not a personality you either have or lack.</li>
<li><strong>Three repeats of one block is the deck's clearest structural fingerprint.</strong> Combined with 46 and 63, the pattern is consistent: whenever a section splits into lettered sub-sections, the objectives page is duplicated for each letter. Once you know the pattern, you can predict where the real content is before you read a slide.</li>
<li><strong>FPTU application.</strong> Put rehearsal in the project schedule as a task with a name and an owner, the same way you schedule a code freeze. "Rehearsal 1: Thursday 19:00, full run with timer" is a task; "we'll practise sometime" is not, and it does not happen.</li>
</ul>
<table>
<tr><th>Sub-section</th><th>Its one outcome</th><th>Where the content is</th></tr>
<tr><td>5.3a</td><td>Visual aids</td><td>Slide 56</td></tr>
<tr><td>5.3b</td><td>Script &amp; notes</td><td>Slide 58</td></tr>
<tr><td>5.3c</td><td>Practice/delivery strategies</td><td>Slide 60</td></tr>
</table>
<p class="meo">💡 If an exam option distinguishes 5.3a, 5.3b and 5.3c <em>by their objectives</em>, it is wrong — all three print the same three objectives. They differ only by summary content.</p>`,
        `<p class="y-chinh">🎯 Lần in thứ ba của đúng khối ba gạch đó, giờ dưới tiêu đề <strong>5.3c Practising Your Script</strong>. Gạch đầu dòng không đổi so với slide 55 và 57: lồng ghép hình ảnh phù hợp · viết kịch bản và ghi chú · dùng chiến lược để <em>practice</em> trình bày hiệu quả.</p>
<ul>
<li><strong>Không nhất quán chính tả, nói thẳng và KHÔNG sửa ở đây.</strong> Tiêu đề dùng dạng động từ Anh–Anh <strong>Practising</strong>; gạch đầu dòng ngay dưới lại dùng <strong>practice</strong>, mà trong tiếng Anh–Anh đó là danh từ. Cả hai nằm trên cùng một slide. Đây là sự không nhất quán của CHÍNH deck — hãy trích đúng như in, đừng âm thầm chuẩn hoá nó trong bài làm.</li>
<li><strong>Mục 5.3 giờ đã được lập bản đồ đầy đủ: a = hình ảnh, b = kịch bản, c = luyện tập.</strong> Ba tiểu mục, một khối chuẩn đầu ra dùng chung, ba slide tóm tắt riêng (56, 58, 60). Cái ánh xạ đó mới là cấu trúc ra đề được; các bản lặp thì không.</li>
<li><strong>Luyện tập được xếp ngang hàng với nội dung, và đó chính là LUẬN ĐIỂM đang được nêu.</strong> Phần lớn sinh viên coi tập dượt là thứ đánh bóng tuỳ chọn. Bằng cách dành hẳn một tiểu mục có slide tóm tắt riêng và dòng trích nguồn tới năm tác giả, deck khẳng định rằng trình bày là một KỸ NĂNG phải rèn, không phải một tính cách mà bạn hoặc có hoặc không.</li>
<li><strong>Ba lần lặp một khối là dấu vân tay cấu trúc rõ nhất của deck.</strong> Cộng với slide 46 và 63, quy luật rất nhất quán: hễ một mục chẻ thành các tiểu mục a/b/c thì trang chuẩn đầu ra được nhân bản cho từng chữ cái. Biết quy luật rồi thì bạn đoán được nội dung thật nằm ở đâu TRƯỚC khi đọc slide.</li>
<li><strong>Áp vào FPTU.</strong> Hãy đưa buổi tập dượt vào lịch đồ án như một ĐẦU VIỆC có tên và có người chịu trách nhiệm, y như bạn lên lịch code freeze. "Tập lần 1: thứ Năm 19:00, chạy trọn bài có bấm giờ" là một đầu việc; "hôm nào đó tập nhé" thì không phải, và nó sẽ không xảy ra.</li>
</ul>
<table>
<tr><th>Tiểu mục</th><th>Chuẩn đầu ra duy nhất của nó</th><th>Nội dung nằm ở đâu</th></tr>
<tr><td>5.3a</td><td>Hình minh hoạ</td><td>Slide 56</td></tr>
<tr><td>5.3b</td><td>Kịch bản &amp; ghi chú</td><td>Slide 58</td></tr>
<tr><td>5.3c</td><td>Chiến lược luyện tập/trình bày</td><td>Slide 60</td></tr>
</table>
<p class="meo">💡 Phương án thi nào phân biệt 5.3a, 5.3b, 5.3c <em>bằng chuẩn đầu ra của chúng</em> thì SAI — cả ba in cùng ba chuẩn đầu ra. Chúng chỉ khác nhau ở nội dung slide tóm tắt.</p>`],

      [60, 'Summary: Practising your Script — intonation (2 techniques) and practice (4 strategies) (Anderson et al., 2004; Burke, 2013; Cottrell, 2013; Hewings, 2007; Reinders, et al., 2008)',
        `<p class="y-chinh">🎯 Two headings, six items in total. <strong>Using intonation</strong> — emphasise important words · use step-ups and step-downs. <strong>Practice</strong> — manage time · in front of friends and family · record yourself · put points and take-aways on small piece of paper. Sources: <em>(Anderson et al., 2004; Burke, 2013; Cottrell, 2013; Hewings, 2007; Reinders, et al., 2008)</em> — five sources, the longest citation line in this range.</p>
<table>
<tr><th>Heading</th><th>Item</th><th>How to actually do it</th></tr>
<tr><td rowspan="2">Using intonation (2)</td><td>Emphasise important words</td><td>Mark the one stressed word per sentence in your notes; everything else stays level</td></tr>
<tr><td>Use step-ups and step-downs</td><td>Pitch UP to open a new point or signal "more coming"; pitch DOWN to close one. A flat line reads as "reading aloud"</td></tr>
<tr><td rowspan="4">Practice (4)</td><td>Manage time</td><td>Rehearse with a visible timer; note the clock time each section must start</td></tr>
<tr><td>In front of friends and family</td><td>A non-expert audience catches the jargon you stopped noticing</td></tr>
<tr><td>Record yourself</td><td>Phone video. You will find filler words, speed, and where you look down</td></tr>
<tr><td>Put points and take-aways on small piece of paper</td><td>Small on purpose — it cannot hold a script, so it forces cues</td></tr>
</table>
<ul>
<li><strong>Count the two lists separately: intonation has TWO techniques, practice has FOUR strategies.</strong> A question asking "how many practice strategies does the deck list?" is answered by 4, not 6. The headings are what separate them.</li>
<li><strong>"Step-ups and step-downs" is the technical term and the likeliest vocabulary item.</strong> It means moving your pitch up or down at boundaries. For Vietnamese speakers this needs conscious attention: Vietnamese carries meaning in lexical tone, while English carries discourse meaning in sentence-level pitch movement — so intonation for signposting has to be practised deliberately, not assumed.</li>
<li><strong>"In front of friends and family" is not filler advice.</strong> A listener who does not know your project cannot follow the shortcuts you have stopped hearing yourself take. Their first question is usually the exact question the council will ask.</li>
<li><strong>"Record yourself" is the highest-yield item on the slide.</strong> Everything you would need an observer for is visible in a phone video: speed, filler words ("ờ", "kiểu như", "basically"), how long you face the screen instead of the audience, and whether you finished on time.</li>
<li><strong>"Small piece of paper" is a constraint, not an accident.</strong> A small card physically cannot hold a script, so it forces the Script → Notes transformation from slide 58. Big paper invites you to read. The two slides are one instruction delivered twice.</li>
</ul>
<p class="dap-an">✅ A four-session rehearsal plan for a SWP391 defence. <strong>Session 1 (alone, timer):</strong> full run, note where you exceed time; cut content, do not speak faster. <strong>Session 2 (recorded):</strong> watch it back with a pen — count fillers, mark every sentence where your pitch never moved. <strong>Session 3 (friends/family):</strong> full run plus five questions from them; anything they did not understand gets a plainer sentence. <strong>Session 4 (team, in the real room if possible):</strong> test the projector, the cable, the demo data and the handover between speakers — the handover is where teams lose the most time.</p>
<p class="pitfall">⚠️ What to do if you forget mid-sentence: stop, look at the card, and say one sentence out loud — "Em xin phép nhắc lại ý chính của phần này" — then continue from the cue. Silence for two seconds is invisible to the audience; panicking, apologising repeatedly, or reading the slide word for word is not. The deck's own answer to this is the small card: it exists precisely so there is somewhere to look.</p>
<p class="meo">💡 <strong>2 + 4</strong>. Intonation = emphasise + step up/down. Practice = time · people · record · card.</p>`,
        `<p class="y-chinh">🎯 Hai đề mục, tổng sáu mục. <strong>Dùng ngữ điệu (intonation)</strong> — nhấn những từ quan trọng · dùng bước lên và bước xuống cao độ (step-ups, step-downs). <strong>Luyện tập</strong> — quản lý thời gian · tập trước mặt bạn bè và người nhà · tự quay lại · ghi các ý chính và thông điệp đọng lại lên một MẨU GIẤY NHỎ. Nguồn: <em>(Anderson et al., 2004; Burke, 2013; Cottrell, 2013; Hewings, 2007; Reinders, et al., 2008)</em> — năm nguồn, dòng trích dài nhất dải này.</p>
<table>
<tr><th>Đề mục</th><th>Mục</th><th>Làm thật thì làm thế nào</th></tr>
<tr><td rowspan="2">Ngữ điệu (2)</td><td>Nhấn từ quan trọng</td><td>Đánh dấu ĐÚNG MỘT từ được nhấn trong mỗi câu trên tờ ghi chú; phần còn lại giữ phẳng</td></tr>
<tr><td>Bước lên / bước xuống cao độ</td><td>Cao độ ĐI LÊN để mở một ý mới hoặc báo "còn nữa"; ĐI XUỐNG để đóng một ý. Một đường phẳng nghe ra ngay là "đang đọc"</td></tr>
<tr><td rowspan="4">Luyện tập (4)</td><td>Quản lý thời gian</td><td>Tập với đồng hồ đặt trước mặt; ghi rõ mỗi phần phải bắt đầu ở phút thứ mấy</td></tr>
<tr><td>Trước mặt bạn bè, người nhà</td><td>Khán giả không chuyên bắt được đúng những chỗ nói tắt mà bạn đã hết nghe thấy</td></tr>
<tr><td>Tự quay lại</td><td>Quay bằng điện thoại. Bạn sẽ thấy từ đệm, tốc độ, và những lúc bạn cúi xuống</td></tr>
<tr><td>Ghi ý lên mẩu giấy NHỎ</td><td>Nhỏ là có chủ ý — nó không chứa nổi kịch bản, nên ép bạn chỉ ghi từ khoá</td></tr>
</table>
<ul>
<li><strong>Đếm hai danh sách RIÊNG: ngữ điệu có HAI kỹ thuật, luyện tập có BỐN chiến lược.</strong> Câu hỏi "deck liệt kê bao nhiêu chiến lược luyện tập?" trả lời là 4, không phải 6. Chính hai đề mục là thứ tách chúng ra.</li>
<li><strong>"Step-ups and step-downs" là thuật ngữ kỹ thuật và là mục từ vựng dễ ra đề nhất.</strong> Nó là việc đưa cao độ giọng lên hoặc xuống ở các ranh giới ý. Với người nói tiếng Việt, chỗ này cần chú ý có ý thức: tiếng Việt mang nghĩa ở THANH ĐIỆU của từ, còn tiếng Anh mang nghĩa diễn ngôn ở chuyển động cao độ CẢ CÂU — nên ngữ điệu để signposting phải tập có chủ đích, không thể mặc nhiên mà có.</li>
<li><strong>"Tập trước mặt bạn bè, người nhà" không phải lời khuyên cho có.</strong> Một người nghe không biết đồ án của bạn sẽ không theo nổi những chỗ bạn nói tắt mà chính bạn đã hết nghe ra. Câu hỏi đầu tiên của họ thường đúng là câu hội đồng sẽ hỏi.</li>
<li><strong>"Tự quay lại" là mục cho lợi ích cao nhất trên slide.</strong> Mọi thứ mà lẽ ra cần một người quan sát đều hiện ra trong một đoạn video điện thoại: tốc độ, từ đệm ("ờ", "kiểu như", "basically"), bạn quay mặt vào màn hình bao lâu thay vì nhìn khán giả, và bạn có kết đúng giờ không.</li>
<li><strong>"Mẩu giấy nhỏ" là một RÀNG BUỘC, không phải chi tiết ngẫu nhiên.</strong> Một tấm thẻ nhỏ về mặt vật lý không chứa nổi kịch bản, nên nó cưỡng chế đúng phép biến đổi Script → Notes ở slide 58. Giấy to thì mời gọi bạn đọc. Hai slide là MỘT chỉ dẫn được nói hai lần.</li>
</ul>
<p class="dap-an">✅ Kế hoạch tập bốn buổi cho bảo vệ SWP391. <strong>Buổi 1 (một mình, có đồng hồ):</strong> chạy trọn bài, ghi lại chỗ vượt giờ; rồi CẮT NỘI DUNG, đừng nói nhanh hơn. <strong>Buổi 2 (có quay lại):</strong> xem lại kèm cây bút — đếm từ đệm, đánh dấu mọi câu mà giọng bạn không hề nhấp nhô. <strong>Buổi 3 (bạn bè/người nhà):</strong> chạy trọn bài cộng năm câu hỏi từ họ; chỗ nào họ không hiểu thì viết lại thành câu đơn giản hơn. <strong>Buổi 4 (cả nhóm, ở đúng phòng thật nếu được):</strong> thử máy chiếu, dây cáp, dữ liệu demo và các đoạn CHUYỂN GIAO giữa người nói — chính chỗ chuyển giao là nơi các nhóm mất nhiều thời gian nhất.</p>
<p class="pitfall">⚠️ Quên bài giữa chừng thì làm gì: dừng lại, nhìn tấm thẻ, và nói ra một câu — "Em xin phép nhắc lại ý chính của phần này" — rồi đi tiếp từ từ khoá. Hai giây im lặng thì khán giả không nhận ra; hoảng loạn, xin lỗi liên tục, hay quay vào đọc nguyên chữ trên slide thì có. Câu trả lời của chính deck cho tình huống này là tấm thẻ nhỏ: nó tồn tại đúng để bạn có chỗ mà nhìn vào.</p>
<p class="meo">💡 <strong>2 + 4</strong>. Ngữ điệu = nhấn từ + lên/xuống cao độ. Luyện tập = thời gian · người nghe · quay lại · tấm thẻ.</p>`],

      [61, '5.4a Delivering Your Presentation (objectives — THREE outcomes: performance, personal style, fielding questions)',
        `<p class="y-chinh">🎯 The final section of Mooc 4 opens with <strong>three</strong> outcomes: <strong>use presentation strategies to deliver a polished performance</strong> · <strong>identify your personal presentation style</strong> · <strong>effectively and appropriately field questions from the audience</strong>.</p>
<table>
<tr><th>#</th><th>Outcome</th><th>Sub-section</th><th>Summary slide</th></tr>
<tr><td>1</td><td>deliver a polished performance</td><td>5.4a Delivering Your Presentation</td><td>62</td></tr>
<tr><td>2</td><td>identify your personal presentation style</td><td>5.4b Finding Your Style</td><td>64</td></tr>
<tr><td>3</td><td>field questions from the audience</td><td>5.4b Facilitating Audience Interaction</td><td>64</td></tr>
</table>
<ul>
<li><strong>"Polished performance" is the deck choosing a word deliberately.</strong> <em>Performance</em> admits that delivery is partly acting — voice, posture, timing, presence — and that these are rehearsable. It is the natural continuation of 5.3c: practice produces polish, and polish is visible.</li>
<li><strong>"Identify your personal presentation style" is the most liberating outcome in Mooc 4.</strong> The deck does not prescribe one correct manner. Some presenters are precise and calm, some are energetic, some are dryly funny. The instruction is to IDENTIFY yours — that is, to notice what works when you do it and build on it — not to imitate a TED speaker.</li>
<li><strong>"Effectively AND appropriately" — two adverbs, two different standards.</strong> <em>Effectively</em> = the questioner gets a real answer. <em>Appropriately</em> = the tone and the length fit the room; you do not argue with an examiner, you do not lecture a classmate, you do not spend four minutes on one question when five people are waiting.</li>
<li><strong>Fielding questions is a graded outcome, not an afterthought.</strong> At a defence the Q&amp;A is frequently where the marks separate teams, because a prepared talk shows preparation but the answers show understanding. Everything from slide 64 is preparation for exactly this.</li>
<li><strong>FPTU application.</strong> Split the three outcomes across the team before a defence: everyone rehearses delivery, but assign one person to own the demo, one to own the architecture questions and one to own the testing/limitations questions — so that when a question lands, the room sees a team that knows who answers, not three people looking at each other.</li>
</ul>
<p class="meo">💡 Three words: <strong>PERFORMANCE · STYLE · QUESTIONS</strong>. And note the order changes on slide 63 — the deck reprints these three bullets with items 2 and 3 swapped.</p>`,
        `<p class="y-chinh">🎯 Mục cuối cùng của Mooc 4 mở màn với <strong>BA</strong> chuẩn đầu ra: <strong>dùng các chiến lược trình bày để có một màn thể hiện CHỈN CHU (polished performance)</strong> · <strong>nhận diện PHONG CÁCH trình bày của riêng bạn</strong> · <strong>xử lý câu hỏi từ khán giả một cách HIỆU QUẢ và PHÙ HỢP</strong>.</p>
<table>
<tr><th>#</th><th>Chuẩn đầu ra</th><th>Tiểu mục</th><th>Slide tóm tắt</th></tr>
<tr><td>1</td><td>màn thể hiện chỉn chu</td><td>5.4a Delivering Your Presentation</td><td>62</td></tr>
<tr><td>2</td><td>nhận diện phong cách riêng</td><td>5.4b Finding Your Style</td><td>64</td></tr>
<tr><td>3</td><td>xử lý câu hỏi khán giả</td><td>5.4b Facilitating Audience Interaction</td><td>64</td></tr>
</table>
<ul>
<li><strong>"Polished performance" là chữ deck chọn có chủ đích.</strong> <em>Performance</em> (màn thể hiện) thừa nhận rằng trình bày có phần là DIỄN — giọng, tư thế, nhịp, sự hiện diện — và rằng những thứ đó TẬP ĐƯỢC. Đây là phần nối tự nhiên của 5.3c: luyện tập sinh ra sự chỉn chu, và sự chỉn chu thì nhìn thấy được.</li>
<li><strong>"Nhận diện phong cách trình bày của riêng bạn" là chuẩn đầu ra giải phóng nhất của cả Mooc 4.</strong> Deck KHÔNG kê ra một phong thái đúng duy nhất. Có người trình bày chính xác và điềm tĩnh, có người tràn năng lượng, có người hài hước kiểu tỉnh bơ. Yêu cầu là NHẬN DIỆN phong cách của bạn — tức để ý xem khi bạn làm gì thì hiệu quả, rồi bồi đắp thêm — chứ không phải bắt chước một diễn giả TED.</li>
<li><strong>"Effectively AND appropriately" — hai trạng từ, hai chuẩn khác nhau.</strong> <em>Hiệu quả</em> = người hỏi nhận được một câu trả lời thật. <em>Phù hợp</em> = giọng điệu và độ dài hợp với cái phòng đó; bạn không cãi nhau với giám khảo, không lên lớp bạn cùng lớp, và không dành bốn phút cho một câu trong khi năm người đang chờ.</li>
<li><strong>Xử lý câu hỏi là một chuẩn đầu ra CÓ CHẤM ĐIỂM, không phải chuyện thêm nếm.</strong> Ở buổi bảo vệ, phần hỏi đáp rất thường là chỗ phân loại các nhóm, vì bài nói đã chuẩn bị thì cho thấy sự CHUẨN BỊ, còn câu trả lời mới cho thấy sự HIỂU. Mọi thứ ở slide 64 là để chuẩn bị đúng cho việc này.</li>
<li><strong>Áp vào FPTU.</strong> Chia ba chuẩn đầu ra cho cả nhóm trước buổi bảo vệ: ai cũng tập trình bày, nhưng giao hẳn một người phụ trách demo, một người phụ trách các câu hỏi về kiến trúc, một người phụ trách câu hỏi về kiểm thử/hạn chế — để khi một câu hỏi rơi xuống, cả phòng thấy một nhóm BIẾT AI TRẢ LỜI, chứ không phải ba người nhìn nhau.</li>
</ul>
<p class="meo">💡 Ba chữ: <strong>THỂ HIỆN · PHONG CÁCH · CÂU HỎI</strong>. Và để ý thứ tự ĐỔI ở slide 63 — deck in lại đúng ba gạch này nhưng đảo mục 2 với mục 3.</p>`],

      [62, 'Summary: Delivering engaging presentations — SEVEN delivery rules (Burke, 2013; Cottrell, 2013; Reinders et al., 2008; Reynolds, 2012)',
        `<p class="y-chinh">🎯 Seven delivery rules, in this order: <strong>Make sure your technology works · Check pronunciation · Specify question time · Breathe · Engage your audience · Use the space · Act confident</strong>. Sources: <em>(Burke, 2013; Cottrell, 2013; Reinders et al., 2008; Reynolds, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Rule</th><th>When you do it</th><th>Concretely</th></tr>
<tr><td>1</td><td>Make sure your technology works</td><td>Before</td><td>Test projector, cable, adapter, sound, demo data, internet. Have the slides on a USB and a PDF copy</td></tr>
<tr><td>2</td><td>Check pronunciation</td><td>Before</td><td>Look up every technical term and name you will say out loud; say them ten times</td></tr>
<tr><td>3</td><td>Specify question time</td><td>Opening</td><td>Say when you will take questions — at the end, or as they come</td></tr>
<tr><td>4</td><td>Breathe</td><td>During</td><td>Slow breath before starting and at each section break; it also fixes speed</td></tr>
<tr><td>5</td><td>Engage your audience</td><td>During</td><td>Eye contact across the whole room, questions, a direct address</td></tr>
<tr><td>6</td><td>Use the space</td><td>During</td><td>Move with purpose at transitions; do not hide behind the laptop</td></tr>
<tr><td>7</td><td>Act confident</td><td>During</td><td>Posture, steady voice, no apologising for your own work</td></tr>
</table>
<ul>
<li><strong>Rule 1 comes first because it is the only failure that can end the presentation.</strong> It follows straight from slide 52's "Place: Classrooms" — the equipment is the room's, not yours. Arrive early, plug in, and have an offline fallback (exported PDF, recorded demo video).</li>
<li><strong>Rule 3 is the most underused, and it costs nothing.</strong> One sentence at the start — "Em sẽ trình bày khoảng 12 phút và xin nhận câu hỏi ở cuối" — prevents interruptions, sets the audience's expectations and gives you control of the clock. It also connects the talk to slide 64, which is entirely about that question period.</li>
<li><strong>Rule 7 says "ACT confident", not "be confident".</strong> This is an important and merciful distinction: the deck asks for the observable behaviours — stand straight, speak at a steady volume, do not apologise — because those are controllable even when you are nervous. Confidence often follows the behaviour rather than preceding it.</li>
<li><strong>Rule 2 matters more for a second-language presenter than the slide admits.</strong> One mispronounced key term repeated fifteen times distracts the audience every time. Check the words you will say most: the names of your technologies, the author names you cite, and any term central to your argument.</li>
<li><strong>Rules 4, 5, 6, 7 are all about the body, not the content.</strong> Four of seven rules concern presence. That ratio is itself the message: by the time you are delivering, the content is fixed; what remains under your control is how you occupy the room.</li>
</ul>
<p class="dap-an">✅ A defence-day timeline built from these seven: <strong>T-30 min</strong> — arrive, connect the laptop, test the projector and sound, open the demo and log in, put the PDF fallback on the desktop (rule 1). <strong>T-10</strong> — say the five hardest terms out loud (rule 2). <strong>T-1</strong> — two slow breaths (rule 4). <strong>0:00</strong> — name the running order and the question policy (rule 3). <strong>Throughout</strong> — look at all three parts of the room, move at each transition, stand straight, never apologise for the project (rules 5, 6, 7).</p>
<p class="pitfall">⚠️ Title drift: the objectives page (61) calls this section "<strong>Delivering Your Presentation</strong>"; this summary calls it "<strong>Delivering engaging presentations</strong>" — a different adjective and a plural. Same section; the deck is not consistent about its own names.</p>
<p class="meo">💡 Count: <strong>SEVEN</strong> — two "before" (technology, pronunciation), one "opening" (question time), four "during" (breathe, engage, space, confidence).</p>`,
        `<p class="y-chinh">🎯 Bảy luật trình bày, theo đúng thứ tự này: <strong>Bảo đảm thiết bị chạy được · Kiểm tra phát âm · Nói rõ thời điểm nhận câu hỏi · Thở · Kéo khán giả vào cuộc · Dùng không gian · Diễn ra vẻ tự tin</strong>. Nguồn: <em>(Burke, 2013; Cottrell, 2013; Reinders et al., 2008; Reynolds, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Luật</th><th>Làm lúc nào</th><th>Cụ thể là gì</th></tr>
<tr><td>1</td><td>Bảo đảm thiết bị chạy</td><td>Trước</td><td>Thử máy chiếu, dây, đầu chuyển, âm thanh, dữ liệu demo, mạng. Có slide trong USB và một bản PDF</td></tr>
<tr><td>2</td><td>Kiểm tra phát âm</td><td>Trước</td><td>Tra cách đọc MỌI thuật ngữ và tên riêng bạn sẽ nói; đọc to mười lần</td></tr>
<tr><td>3</td><td>Nói rõ thời điểm hỏi</td><td>Mở đầu</td><td>Nói trước là nhận câu hỏi ở cuối, hay nhận bất cứ lúc nào</td></tr>
<tr><td>4</td><td>Thở</td><td>Trong lúc nói</td><td>Hít thở chậm trước khi bắt đầu và ở mỗi lần chuyển phần; nó cũng chỉnh luôn tốc độ nói</td></tr>
<tr><td>5</td><td>Kéo khán giả vào cuộc</td><td>Trong lúc nói</td><td>Nhìn mắt khắp phòng, đặt câu hỏi, nói thẳng với người nghe</td></tr>
<tr><td>6</td><td>Dùng không gian</td><td>Trong lúc nói</td><td>Di chuyển có chủ đích ở các đoạn chuyển; đừng nấp sau cái laptop</td></tr>
<tr><td>7</td><td>Diễn ra vẻ tự tin</td><td>Trong lúc nói</td><td>Tư thế, giọng đều, KHÔNG xin lỗi cho chính sản phẩm của mình</td></tr>
</table>
<ul>
<li><strong>Luật 1 đứng đầu vì đó là hỏng hóc DUY NHẤT có thể chấm dứt buổi thuyết trình.</strong> Nó ra thẳng từ dòng "Place: Classrooms" ở slide 52 — thiết bị là của PHÒNG, không phải của bạn. Đến sớm, cắm máy, và luôn có phương án ngoại tuyến (PDF đã xuất, video demo đã quay sẵn).</li>
<li><strong>Luật 3 là luật ít được dùng nhất, mà lại không tốn gì.</strong> Một câu ở đầu — "Em sẽ trình bày khoảng 12 phút và xin nhận câu hỏi ở cuối ạ" — chặn được việc bị ngắt lời, đặt đúng kỳ vọng cho khán giả và trao lại cho bạn quyền kiểm soát đồng hồ. Nó cũng nối buổi nói sang slide 64, vốn nói trọn về đúng khoảng thời gian hỏi đáp đó.</li>
<li><strong>Luật 7 viết "ACT confident" — DIỄN ra vẻ tự tin, chứ không phải "hãy tự tin".</strong> Đây là một phân biệt quan trọng và nhân hậu: deck chỉ đòi các HÀNH VI QUAN SÁT ĐƯỢC — đứng thẳng, nói đều tiếng, đừng xin lỗi — vì đó là những thứ điều khiển được ngay cả khi đang run. Sự tự tin thường đến SAU hành vi chứ không đến trước.</li>
<li><strong>Luật 2 quan trọng với người nói ngoại ngữ hơn mức slide thừa nhận.</strong> Một thuật ngữ then chốt phát âm sai rồi lặp lại mười lăm lần thì lần nào cũng làm khán giả phân tâm. Hãy kiểm đúng những từ bạn sẽ nói nhiều nhất: tên công nghệ, tên tác giả bạn trích, và mọi thuật ngữ trung tâm của lập luận.</li>
<li><strong>Luật 4, 5, 6, 7 đều nói về CƠ THỂ, không nói về nội dung.</strong> Bốn trên bảy luật nói về sự hiện diện. Chính tỉ lệ đó là thông điệp: đến lúc bạn đứng nói thì nội dung đã chốt rồi; thứ còn nằm trong tay bạn là cách bạn CHIẾM LĨNH cái phòng.</li>
</ul>
<p class="dap-an">✅ Dòng thời gian ngày bảo vệ dựng từ bảy luật này: <strong>T-30 phút</strong> — tới nơi, cắm laptop, thử máy chiếu và âm thanh, mở demo và đăng nhập sẵn, để bản PDF dự phòng ngoài màn hình (luật 1). <strong>T-10</strong> — đọc to năm thuật ngữ khó nhất (luật 2). <strong>T-1</strong> — hai nhịp thở chậm (luật 4). <strong>0:00</strong> — công bố thứ tự trình bày và quy ước nhận câu hỏi (luật 3). <strong>Suốt buổi</strong> — nhìn đủ ba phía của phòng, di chuyển ở mỗi đoạn chuyển, đứng thẳng, và không bao giờ xin lỗi cho đồ án của mình (luật 5, 6, 7).</p>
<p class="pitfall">⚠️ Trôi tiêu đề: trang chuẩn đầu ra (61) gọi mục này là "<strong>Delivering Your Presentation</strong>"; slide tóm tắt này gọi nó là "<strong>Delivering engaging presentations</strong>" — thêm một tính từ và chuyển sang số nhiều. Cùng một mục; deck không nhất quán với chính tên gọi của nó.</p>
<p class="meo">💡 Đếm: <strong>BẢY</strong> — hai luật "trước" (thiết bị, phát âm), một luật "mở đầu" (thời điểm hỏi), bốn luật "trong lúc nói" (thở, kéo khán giả, không gian, tự tin).</p>`],

      [63, '5.4b Facilitating Audience Interaction & Finding Your Style (objectives — same three bullets as 5.4a, with items 2 and 3 SWAPPED)',
        `<p class="y-chinh">🎯 The fifth and last objectives repeat of this range — and the only one where the deck changes the ORDER. Heading: <strong>5.4b Facilitating Audience Interaction &amp; Finding Your Style</strong>. Bullets: <strong>use presentation strategies to deliver a polished performance · effectively and appropriately field questions from the audience · identify your personal presentation style</strong>.</p>
<table>
<tr><th>Position</th><th>Slide 61 (5.4a)</th><th>Slide 63 (5.4b)</th></tr>
<tr><td>1</td><td>deliver a polished performance</td><td>deliver a polished performance (same)</td></tr>
<tr><td>2</td><td>identify your personal presentation style</td><td><strong>field questions from the audience</strong></td></tr>
<tr><td>3</td><td>field questions from the audience</td><td><strong>identify your personal presentation style</strong></td></tr>
</table>
<ul>
<li><strong>The swap is not random — it matches the heading.</strong> 5.4b is "<em>Facilitating Audience Interaction</em> &amp; <em>Finding Your Style</em>", in that order, so the bullets have been reordered to run in the same order as the heading's two halves. It is the one repeat in this deck that was actually edited for a reason.</li>
<li><strong>Same three items, different sequence — a classic exam trap.</strong> If a question asks for "the order of the outcomes of section 5.4", the honest answer is that the deck prints two different orders on two slides. Remember the SET of three; be sceptical of any option that insists on one fixed sequence.</li>
<li><strong>"Facilitating" is a strong verb choice.</strong> Not "handling" questions, not "surviving" them — <em>facilitating</em> interaction means you actively create it. That reframes Q&amp;A from a threat into a part of the presentation you designed, which is exactly what slide 64's first and last bullets propose.</li>
<li><strong>This is the last objectives page in Mooc 4.</strong> After it, one summary slide closes the module. If you are building revision cards, 63 is a divider and 64 is the payload.</li>
<li><strong>FPTU application.</strong> Read the heading as a two-part job for the defence: (a) facilitate — decide in advance how you will invite questions and who will answer what; (b) find your style — after the defence, write three lines about what worked when you did it, and keep that note for the next one. Style is identified by observation over several talks, not chosen once.</li>
</ul>
<p class="meo">💡 Five objectives repeats in slides 44–64: <strong>46, 53, 57, 59, 63</strong>. Only 63 changed the order. Learn the five slide numbers and you can skip them all in revision.</p>`,
        `<p class="y-chinh">🎯 Bản lặp chuẩn đầu ra thứ năm và cũng là cuối cùng của dải này — và là bản duy nhất mà deck có đổi THỨ TỰ. Tiêu đề: <strong>5.4b Facilitating Audience Interaction &amp; Finding Your Style</strong>. Gạch đầu dòng: <strong>dùng chiến lược trình bày để có màn thể hiện chỉn chu · xử lý câu hỏi khán giả một cách hiệu quả và phù hợp · nhận diện phong cách trình bày của riêng bạn</strong>.</p>
<table>
<tr><th>Vị trí</th><th>Slide 61 (5.4a)</th><th>Slide 63 (5.4b)</th></tr>
<tr><td>1</td><td>màn thể hiện chỉn chu</td><td>màn thể hiện chỉn chu (như cũ)</td></tr>
<tr><td>2</td><td>nhận diện phong cách riêng</td><td><strong>xử lý câu hỏi khán giả</strong></td></tr>
<tr><td>3</td><td>xử lý câu hỏi khán giả</td><td><strong>nhận diện phong cách riêng</strong></td></tr>
</table>
<ul>
<li><strong>Cú đảo này KHÔNG ngẫu nhiên — nó khớp với tiêu đề.</strong> 5.4b là "<em>Facilitating Audience Interaction</em> &amp; <em>Finding Your Style</em>", theo đúng thứ tự đó, nên các gạch đầu dòng đã được sắp lại cho chạy cùng thứ tự với hai nửa của tiêu đề. Đây là bản lặp DUY NHẤT trong deck này thật sự được sửa vì một lý do.</li>
<li><strong>Cùng ba mục, khác trình tự — bẫy thi kinh điển.</strong> Nếu đề hỏi "thứ tự các chuẩn đầu ra của mục 5.4", câu trả lời trung thực là deck in HAI thứ tự khác nhau trên hai slide. Hãy nhớ TẬP HỢP ba mục; và hãy nghi ngờ mọi phương án khăng khăng có một trình tự cố định.</li>
<li><strong>"Facilitating" là một lựa chọn động từ mạnh.</strong> Không phải "xử lý" câu hỏi, cũng không phải "sống sót" qua chúng — <em>facilitating</em> nghĩa là bạn CHỦ ĐỘNG TẠO RA tương tác. Cách đóng khung đó biến phần hỏi đáp từ một mối đe doạ thành một phần bạn đã THIẾT KẾ của buổi nói — đúng điều mà gạch đầu và gạch cuối của slide 64 đề xuất.</li>
<li><strong>Đây là trang chuẩn đầu ra cuối cùng của Mooc 4.</strong> Sau nó, một slide tóm tắt khép lại cả mô-đun. Nếu bạn làm thẻ ôn tập, 63 là tấm phân cách còn 64 mới là phần hàng.</li>
<li><strong>Áp vào FPTU.</strong> Hãy đọc tiêu đề như một đầu việc hai phần cho buổi bảo vệ: (a) tạo tương tác — quyết định TRƯỚC là sẽ mời câu hỏi thế nào và ai trả lời phần nào; (b) tìm phong cách — sau buổi bảo vệ, viết ba dòng về những gì hiệu quả khi chính bạn làm, và giữ lại ghi chú đó cho lần sau. Phong cách được NHẬN DIỆN qua quan sát nhiều buổi, không phải chọn một lần.</li>
</ul>
<p class="meo">💡 Năm bản lặp chuẩn đầu ra trong slide 44–64: <strong>46, 53, 57, 59, 63</strong>. Chỉ 63 là đổi thứ tự. Thuộc năm số slide này thì lúc ôn bỏ qua được cả năm.</p>`],

      [64, 'Summary: Audience Engagement & Finding your Own Style — SIX strategies, and the close of Mooc 4 (Burke, 2012; Cottrell, 2013; Reinders, Moore & Lewis, 2008; Reynolds, 2012)',
        `<p class="y-chinh">🎯 The last slide of Mooc 4, and the most immediately useful: <strong>six</strong> strategies — <strong>Use quizzes or discussion questions to engage your audience · Plan responses to possible questions · Try not to be defensive · Ask for repetition or pause before answering · Throw a question back to the audience · Prepare controversial questions for discussion</strong>. Sources: <em>(Burke, 2012; Cottrell, 2013; Reinders, Moore &amp; Lewis, 2008; Reynolds, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Strategy</th><th>Before or during?</th><th>What it protects you from</th></tr>
<tr><td>1</td><td>Quizzes / discussion questions</td><td>Planned, used during</td><td>A silent room and a one-way monologue</td></tr>
<tr><td>2</td><td>Plan responses to possible questions</td><td>Before</td><td>Being surprised by the obvious question</td></tr>
<tr><td>3</td><td>Try not to be defensive</td><td>During</td><td>Turning a question into a conflict</td></tr>
<tr><td>4</td><td>Ask for repetition or pause before answering</td><td>During</td><td>Answering the wrong question, fast</td></tr>
<tr><td>5</td><td>Throw a question back to the audience</td><td>During</td><td>Carrying the whole discussion alone</td></tr>
<tr><td>6</td><td>Prepare controversial questions</td><td>Before</td><td>A discussion that never starts</td></tr>
</table>
<ul>
<li><strong>Strategies 2 and 6 are both preparation, and together they are the whole secret.</strong> Plan the answers to the questions you expect, and prepare the provocative questions you WANT asked. A defence where the council asks the question you hoped for is not luck — it is slide 64 executed properly.</li>
<li><strong>Strategy 4 buys you the two seconds that decide the answer.</strong> "Thầy/cô có thể nhắc lại giúp em phần sau của câu hỏi được không ạ?" or simply a pause with a nod. Both are legitimate and both are recommended on this slide; neither reads as weakness.</li>
<li><strong>Strategy 3 is the one students break most often.</strong> A question about a weakness is not an accusation; it is an invitation to show you understand your own system. "Đúng là chỗ này còn hạn chế" is a stronger sentence than any defence of an indefensible design.</li>
<li><strong>Strategy 5 is for peer audiences, and it needs judgement.</strong> Throwing a question back works in a seminar or classroom presentation. At a defence, throwing a question back to the examiners is inappropriate — there, "throw it back" means redirecting to the right teammate instead.</li>
<li><strong>Citation drift worth noting one last time.</strong> This slide prints <strong>Burke, 2012</strong> where slides 50, 60 and 62 print Burke, 2013; and it spells out <strong>Reinders, Moore &amp; Lewis, 2008</strong> where slides 58, 60 and 62 use "Reinders et al., 2008". Same works, inconsistent citation — a small live example of exactly what slide 49's "referencing accuracy" outcome is about.</li>
</ul>
<p class="dap-an">✅ <strong>Bảng tình huống hỏi–đáp cho buổi bảo vệ (câu trả lời mẫu bằng tiếng Việt).</strong></p>
<table>
<tr><th>Loại câu hỏi</th><th>Nguyên tắc</th><th>Câu trả lời mẫu</th></tr>
<tr><td><strong>1. Câu mình BIẾT</strong><br/>"Vì sao nhóm chọn PostgreSQL?"</td><td>Trả lời NGẮN, có cấu trúc: kết luận trước, lý do sau, dừng đúng lúc</td><td>"Dạ, nhóm em chọn PostgreSQL vì hai lý do chính. Thứ nhất, dữ liệu của bài toán có ràng buộc quan hệ chặt giữa lịch hẹn và bệnh nhân nên cần giao dịch ACID. Thứ hai, nhóm em cần truy vấn tổng hợp theo khoảng thời gian, và chỉ mục tổ hợp của PostgreSQL xử lý tốt. Nhóm em có cân nhắc MongoDB nhưng đã loại vì mô hình dữ liệu không phải dạng tài liệu ạ."</td></tr>
<tr><td><strong>2. Câu mình KHÔNG BIẾT</strong><br/>"Hệ thống chịu được bao nhiêu người dùng đồng thời?"</td><td>NÓI THẬT, rồi nêu thứ mình biết và cách mình sẽ tìm ra. Tuyệt đối không bịa số</td><td>"Dạ, chỗ này em chưa đo nên em xin phép không đưa ra con số. Nhóm em mới kiểm thử chức năng chứ chưa kiểm thử tải. Nếu đo, em sẽ dùng k6 hoặc JMeter, mô phỏng tăng dần số người dùng đồng thời và theo dõi thời gian phản hồi cùng số kết nối CSDL. Em xin ghi nhận và bổ sung trong báo cáo cuối ạ."</td></tr>
<tr><td><strong>3. Câu mang tính BẮT BẺ</strong><br/>"Cái này thì có gì mới, ngoài kia đầy rồi mà?"</td><td>KHÔNG phòng thủ. Thừa nhận phần đúng, rồi khoanh lại phạm vi đóng góp thật của mình</td><td>"Dạ thầy nói đúng ạ, bài toán đặt lịch thì đã có nhiều giải pháp. Đóng góp của nhóm em không nằm ở ý tưởng chung mà ở phần lịch nhắc thích ứng theo lịch sử bỏ hẹn của từng bệnh nhân — phần này em chưa thấy trong các hệ thống nhóm em khảo sát. Còn về mặt học phần, mục tiêu của nhóm em là hiện thực trọn vẹn quy trình từ phân tích tới kiểm thử ạ."</td></tr>
</table>
<p class="pitfall">⚠️ "Em chưa rõ chỗ này, em sẽ tìm hiểu thêm ạ" là một câu trả lời HỢP LỆ và luôn tốt hơn bịa. Hội đồng phân biệt được rất nhanh giữa một sinh viên biết giới hạn hiểu biết của mình và một sinh viên đang đoán — và chỉ có kiểu thứ hai mới bị hỏi tiếp cho tới lúc lộ ra. Câu trả lời tốt nhất luôn có ba phần: (1) thừa nhận chưa biết, (2) nói phần liền kề mà mình có biết, (3) nói mình sẽ tìm ra bằng cách nào.</p>
<p class="y-chinh">🎯 <strong>Khép lại Mooc 4 — ba phần nối thành một nghề.</strong> Mooc 4 "Communication Skills for University Success" đi qua ba chặng và chúng là MỘT mạch: (1) <em>giao tiếp ở môi trường đại học</em> — tham gia thảo luận, hiểu kỳ vọng, biết đặt câu hỏi đúng; (2) <em>VIẾT</em> — diễn giải đề bài, nghiên cứu, lập kế hoạch, viết, rồi hoàn thiện–biên tập–định dạng–soát bản (slide 44–50); (3) <em>NÓI</em> — hiểu mục đích, nghiên cứu, dựng cấu trúc, làm hình ảnh, viết kịch bản, luyện tập, trình bày và xử lý câu hỏi (slide 51–64). Cùng một chu trình lặp lại ở cả ba: <strong>hiểu mục đích → thu thập → dựng cấu trúc → tạo bản nháp → đánh giá và tinh chỉnh → bàn giao</strong>.</p>
<ul>
<li><strong>Dùng lại ở Mooc 5 (Capstone).</strong> Bài tổng kết của SSL101c đòi bạn kể lại ba điều học được và cách áp dụng — đúng khuôn "3 take-aways" xuất hiện ngay ở đầu deck này. Mọi thứ trong slide 44–64 là nguyên liệu trực tiếp cho nó.</li>
<li><strong>Dùng lại ở đồ án.</strong> SWP391, SWT301, Capstone: báo cáo là phần VIẾT, buổi bảo vệ là phần NÓI, và hội đồng chấm cả hai. Checklist slide 50 và bảng hỏi–đáp ở trên dùng được nguyên xi.</li>
<li><strong>Dùng lại khi đi làm.</strong> Sprint review, demo cho khách hàng, tài liệu thiết kế, phỏng vấn xin việc — tất cả đều là cùng hai kỹ năng này, chỉ đổi khán giả. "Plan responses to possible questions" trước một buổi phỏng vấn cũng đúng y như trước một buổi bảo vệ.</li>
<li><strong>Và cho bài thi cuối môn.</strong> Đề là TRẮC NGHIỆM 60 phút phủ cả năm Mooc, nên thứ được chấm là các DANH SÁCH và CON SỐ: 7 mục biên tập ngôn ngữ (48) · 7 mục định dạng (50) · 4 kiểu cấu trúc thuyết trình (54) · 3 mục đích của hình minh hoạ (56) · 7 luật trình bày (62) · 6 chiến lược tương tác (64). Sáu con số này là phần ra đề được của cả dải slide 44–64.</li>
</ul>
<p class="meo">💡 Một câu mang theo từ cả Mooc 4: <strong>viết và nói là cùng một nghề trên hai phương tiện</strong> — và ở cả hai, thứ phân biệt bài đạt với bài giỏi luôn là LƯỢT RÀ LẠI mà phần lớn người ta bỏ qua.</p>`,
        `<p class="y-chinh">🎯 Slide cuối cùng của Mooc 4, và cũng là slide dùng được ngay nhất: <strong>SÁU</strong> chiến lược — <strong>Dùng câu đố hoặc câu hỏi thảo luận để kéo khán giả vào cuộc · Chuẩn bị sẵn câu trả lời cho các câu hỏi có thể gặp · Cố gắng ĐỪNG phòng thủ · Xin nhắc lại câu hỏi, hoặc dừng một nhịp trước khi trả lời · Ném câu hỏi ngược lại cho khán giả · Chuẩn bị sẵn những câu hỏi gây tranh luận</strong>. Nguồn: <em>(Burke, 2012; Cottrell, 2013; Reinders, Moore &amp; Lewis, 2008; Reynolds, 2012)</em>.</p>
<table>
<tr><th>#</th><th>Chiến lược</th><th>Trước hay trong?</th><th>Nó bảo vệ bạn khỏi cái gì</th></tr>
<tr><td>1</td><td>Câu đố / câu hỏi thảo luận</td><td>Chuẩn bị trước, dùng trong buổi</td><td>Một căn phòng im lặng và một bài độc thoại một chiều</td></tr>
<tr><td>2</td><td>Chuẩn bị câu trả lời trước</td><td>Trước</td><td>Bị bất ngờ bởi đúng câu hỏi hiển nhiên nhất</td></tr>
<tr><td>3</td><td>Đừng phòng thủ</td><td>Trong buổi</td><td>Biến một câu hỏi thành một cuộc đối đầu</td></tr>
<tr><td>4</td><td>Xin nhắc lại / dừng một nhịp</td><td>Trong buổi</td><td>Trả lời nhanh vào một câu hỏi khác với câu được hỏi</td></tr>
<tr><td>5</td><td>Ném ngược câu hỏi cho khán giả</td><td>Trong buổi</td><td>Một mình gánh cả cuộc thảo luận</td></tr>
<tr><td>6</td><td>Chuẩn bị câu hỏi gây tranh luận</td><td>Trước</td><td>Một cuộc thảo luận không bao giờ bắt đầu</td></tr>
</table>
<ul>
<li><strong>Chiến lược 2 và 6 đều là CHUẨN BỊ, và gộp lại chúng chính là toàn bộ bí quyết.</strong> Lên sẵn câu trả lời cho những câu bạn dự đoán, và chuẩn bị sẵn những câu khiêu khích mà bạn MUỐN người ta hỏi. Một buổi bảo vệ mà hội đồng hỏi đúng câu bạn mong đợi thì không phải may — đó là slide 64 được thực hiện tử tế.</li>
<li><strong>Chiến lược 4 mua cho bạn đúng hai giây quyết định câu trả lời.</strong> "Dạ thầy/cô nhắc lại giúp em phần sau của câu hỏi được không ạ?" hoặc đơn giản là một nhịp dừng kèm cái gật đầu. Cả hai đều chính đáng và đều được slide này khuyến nghị; không cái nào bị đọc thành sự yếu kém.</li>
<li><strong>Chiến lược 3 là điều sinh viên vi phạm nhiều nhất.</strong> Một câu hỏi về điểm yếu KHÔNG phải một lời buộc tội; đó là lời mời để bạn cho thấy mình hiểu chính hệ thống của mình. "Dạ đúng là chỗ này còn hạn chế ạ" là một câu mạnh hơn mọi nỗ lực bảo vệ một thiết kế không bảo vệ nổi.</li>
<li><strong>Chiến lược 5 dành cho khán giả ngang hàng, và cần cân nhắc.</strong> Ném ngược câu hỏi thì hợp trong seminar hay buổi thuyết trình trên lớp. Ở buổi bảo vệ, ném ngược câu hỏi về phía hội đồng là KHÔNG phù hợp — ở đó, "ném ngược" nghĩa là chuyển sang đúng thành viên phụ trách phần đó trong nhóm.</li>
<li><strong>Lệch trích dẫn, ghi nhận lần cuối.</strong> Slide này in <strong>Burke, 2012</strong> trong khi slide 50, 60, 62 in Burke, 2013; và nó viết đầy đủ <strong>Reinders, Moore &amp; Lewis, 2008</strong> trong khi slide 58, 60, 62 dùng "Reinders et al., 2008". Cùng công trình, trích dẫn không nhất quán — một ví dụ sống rất nhỏ cho đúng cái chuẩn đầu ra "độ chính xác của tài liệu tham khảo" ở slide 49.</li>
</ul>
<p class="dap-an">✅ <strong>Bảng tình huống hỏi–đáp cho buổi bảo vệ đồ án.</strong></p>
<table>
<tr><th>Loại câu hỏi</th><th>Nguyên tắc</th><th>Câu trả lời mẫu</th></tr>
<tr><td><strong>1. Câu mình BIẾT</strong><br/>"Vì sao nhóm chọn PostgreSQL?"</td><td>Trả lời NGẮN, có cấu trúc: kết luận trước, lý do sau, và DỪNG đúng lúc</td><td>"Dạ, nhóm em chọn PostgreSQL vì hai lý do chính. Thứ nhất, dữ liệu của bài toán có ràng buộc quan hệ chặt giữa lịch hẹn và bệnh nhân nên cần giao dịch ACID. Thứ hai, nhóm em cần truy vấn tổng hợp theo khoảng thời gian, và chỉ mục tổ hợp của PostgreSQL xử lý tốt. Nhóm em có cân nhắc MongoDB nhưng đã loại vì mô hình dữ liệu không phải dạng tài liệu ạ."</td></tr>
<tr><td><strong>2. Câu mình KHÔNG BIẾT</strong><br/>"Hệ thống chịu được bao nhiêu người dùng đồng thời?"</td><td>NÓI THẬT, rồi nêu phần mình có biết và cách mình sẽ tìm ra. Tuyệt đối KHÔNG bịa số</td><td>"Dạ, chỗ này em chưa đo nên em xin phép không đưa ra con số. Nhóm em mới kiểm thử chức năng chứ chưa kiểm thử tải. Nếu đo, em sẽ dùng k6 hoặc JMeter, mô phỏng tăng dần số người dùng đồng thời và theo dõi thời gian phản hồi cùng số kết nối CSDL. Em xin ghi nhận và bổ sung trong báo cáo cuối ạ."</td></tr>
<tr><td><strong>3. Câu mang tính BẮT BẺ</strong><br/>"Cái này thì có gì mới, ngoài kia đầy rồi mà?"</td><td>KHÔNG phòng thủ. Thừa nhận phần đúng, rồi khoanh lại phạm vi đóng góp thật của nhóm</td><td>"Dạ thầy nói đúng ạ, bài toán đặt lịch thì đã có nhiều giải pháp. Đóng góp của nhóm em không nằm ở ý tưởng chung mà ở phần lịch nhắc thích ứng theo lịch sử bỏ hẹn của từng bệnh nhân — phần này em chưa thấy trong các hệ thống nhóm em khảo sát. Còn về mặt học phần, mục tiêu của nhóm em là hiện thực trọn vẹn quy trình từ phân tích tới kiểm thử ạ."</td></tr>
</table>
<p class="pitfall">⚠️ "Em chưa rõ chỗ này, em sẽ tìm hiểu thêm ạ" là một câu trả lời HỢP LỆ và luôn tốt hơn bịa. Hội đồng phân biệt rất nhanh giữa một sinh viên biết giới hạn hiểu biết của mình và một sinh viên đang đoán — và chỉ kiểu thứ hai mới bị hỏi tiếp cho tới lúc lộ ra. Câu trả lời tốt nhất luôn có ba phần: (1) thừa nhận chưa biết, (2) nói phần liền kề mà mình CÓ biết, (3) nói mình sẽ tìm ra bằng cách nào.</p>
<p class="y-chinh">🎯 <strong>Khép lại Mooc 4 — ba phần nối thành MỘT nghề.</strong> Mooc 4 "Communication Skills for University Success" đi qua ba chặng và chúng là một mạch liền: (1) <em>giao tiếp ở môi trường đại học</em> — tham gia thảo luận, hiểu kỳ vọng, biết đặt câu hỏi đúng; (2) <em>VIẾT</em> — diễn giải đề bài, nghiên cứu, lập kế hoạch, viết, rồi hoàn thiện – biên tập – định dạng – soát bản (slide 44–50); (3) <em>NÓI</em> — hiểu mục đích, nghiên cứu, dựng cấu trúc, làm hình ảnh, viết kịch bản, luyện tập, trình bày và xử lý câu hỏi (slide 51–64). Cùng một chu trình lặp lại ở cả ba: <strong>hiểu mục đích → thu thập → dựng cấu trúc → làm bản nháp → đánh giá và tinh chỉnh → bàn giao</strong>.</p>
<ul>
<li><strong>Dùng lại ở Mooc 5 (Capstone).</strong> Bài tổng kết của SSL101c đòi bạn kể ba điều học được và cách áp dụng — đúng khuôn "3 take-aways" xuất hiện ngay ở đầu chính deck này. Mọi thứ trong slide 44–64 là nguyên liệu trực tiếp cho nó.</li>
<li><strong>Dùng lại ở đồ án.</strong> SWP391, SWT301, Capstone: báo cáo là phần VIẾT, buổi bảo vệ là phần NÓI, và hội đồng chấm cả hai. Checklist slide 50 và bảng hỏi–đáp ở trên dùng được nguyên xi.</li>
<li><strong>Dùng lại khi đi làm.</strong> Sprint review, demo cho khách hàng, tài liệu thiết kế, phỏng vấn xin việc — đều là cùng hai kỹ năng ấy, chỉ đổi khán giả. "Chuẩn bị sẵn câu trả lời cho các câu hỏi có thể gặp" trước buổi phỏng vấn cũng đúng y như trước buổi bảo vệ.</li>
<li><strong>Và cho bài thi cuối môn.</strong> Đề là TRẮC NGHIỆM 60 phút phủ cả năm Mooc, nên thứ được chấm là các DANH SÁCH và CON SỐ: 7 mục biên tập ngôn ngữ (48) · 7 mục định dạng (50) · 4 kiểu cấu trúc thuyết trình (54) · 3 mục đích của hình minh hoạ (56) · 7 luật trình bày (62) · 6 chiến lược tương tác (64). Sáu con số này là phần ra đề được của cả dải slide 44–64.</li>
</ul>
<p class="meo">💡 Một câu mang theo từ cả Mooc 4: <strong>viết và nói là cùng một nghề trên hai phương tiện khác nhau</strong> — và ở cả hai, thứ phân biệt bài ĐẠT với bài GIỎI luôn là cái LƯỢT RÀ LẠI mà phần lớn người ta bỏ qua.</p>`],
    ]),
  ].join('\n'),
};
