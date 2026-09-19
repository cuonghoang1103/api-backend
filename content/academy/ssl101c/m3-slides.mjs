/**
 * SSL101c · Mooc 3 (deck 'ssl3') — TOÀN BỘ 15 slide, học theo từng slide.
 *
 * ⚠️ NGUỒN: khác bốn deck kia (gần như không có lớp chữ), deck này CÓ lớp text ở
 * 12/15 slide — /tmp/ssl101c-text/ssl3.txt. Nhưng bảng, poster và sơ đồ chỉ nằm
 * trong ẢNH, nên cả 15 ảnh /tmp/ssl101c-slides/ssl3/001.webp … 015.webp đều đã
 * được ĐỌC THẲNG, từng cái một. Ba slide mà file text ghi "(không có chữ)" —
 * 10, 13, 14 — hoá ra là ba slide CHỮ DÀY NHẤT của cả deck (một infographic
 * tiếng Việt và 28 mẫu câu hỏi phản biện); chúng chỉ là ẢNH DÁN nên trình trích
 * chữ không thấy. Đây là ví dụ sống cho bài học "grep không thấy ≠ không có".
 *
 * NỘI DUNG THẬT 15 slide:
 *   · 1      Bìa nâu-vàng "Critical Thinking Skills for University Success"
 *   · 2      Slide "?" — Describe 3 "take-aways" that you have from the course
 *   · 3      Learning outcome — ẢNH CHỤP outline MOOC 3 với BẢY learning outcome
 *   · 4      What is the Weather today? — tình huống áo mưa/áo khoác
 *   · 5      (KHÔNG tiêu đề) Định nghĩa tư duy phản biện
 *   · 6      (KHÔNG tiêu đề) NĂM câu hỏi phản biện về nguồn tin
 *   · 7      Critical Thinking — vì sao cần ở đại học (2 gạch đầu dòng)
 *   · 8      Importance of Critical Thinking — BỐN lợi ích
 *   · 9      5W1H Method — poster "6 critical questions" (critical thinking asylum, 2009)
 *   · 10     Infographic TIẾNG VIỆT "PHƯƠNG PHÁP 5W1H" (ảnh dán, không phải USyd)
 *   · 11     Slide ngăn nâu "Survival skills for university"
 *   · 12     21st Century skills — MƯỜI HAI kỹ năng
 *   · 13     Ảnh dán: mẫu câu hỏi phản biện số 1–16
 *   · 14     Ảnh dán: mẫu câu hỏi phản biện số 17–28
 *   · 15     Tình huống đạo đức học thuật: Mohammed và giáo sư
 *
 * Chỗ deck gốc LẶP / LỆCH / SAI CHÍNH TẢ — nêu thẳng, KHÔNG tự sửa:
 *   · Slide 2 hỏi "ba điều rút ra TỪ KHOÁ HỌC" nhưng lại đứng ở vị trí thứ HAI,
 *     trước khi dạy bất cứ nội dung nào. Đây là slide đóng khoá bị đặt ở đầu.
 *   · Slide 3 là ẢNH CHỤP MÀN HÌNH của một tài liệu khác (phông chữ, màu cam
 *     khác hẳn mẫu slide), không phải nội dung gõ vào slide.
 *   · Slide 5 và 6 KHÔNG có tiêu đề — chữ bắt đầu ngay dưới hai gạch trang trí.
 *   · Slide 9 tiêu đề ghi "5W1H Method" trong khi chính poster bên trong ghi
 *     "6 critical questions" (5W + 1H = 6, không mâu thuẫn nhưng dễ làm rối số).
 *   · Slide 9 (Anh) và slide 10 (Việt) cùng dạy 5W1H nhưng THỨ TỰ KHÁC NHAU:
 *     9 = who · what · where · when · why · how; 10 = What · When · Where ·
 *     Why · Who · How. Đừng học theo thứ tự, học theo BỘ SÁU.
 *   · Slide 6 có NĂM câu hỏi, slide 9 có SÁU câu hỏi — hai danh sách khác nhau,
 *     rất dễ bị tráo số trong đề trắc nghiệm.
 *   · Slide 13 câu 15 thiếu giới từ: "What solutions could you suggest the
 *     problem of …?" (thiếu "to"/"for"). Slide 14 câu 27 cũng lủng củng:
 *     "How do they work separately and together and different ways?".
 *   · Slide 10 là ảnh tiếng Việt do giảng viên chèn thêm, không thuộc bộ gốc
 *     University of Sydney — deck này là deck TRỘN NGUỒN.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl3';

export default {
  title: '3.0 — Slide by slide: Critical thinking, 5W1H, fallacies, bias and Toulmin (slides 1–15)|||3.0 — Slide bài giảng: Tư duy phản biện, 5W1H, nguỵ biện, thiên kiến và mô hình Toulmin (slide 1–15)',
  slug: 'ssl101c-3-0-slides-tu-duy-phan-bien-5w1h-nguy-bien-thien-kien-toulmin',
  type: 'DOCUMENT',
  description: 'Toàn bộ 15 slide của Mooc 3 (Critical Thinking Skills for University Success), đọc thẳng từ ảnh slide gốc. Đi từ tình huống "hôm nay trời thế nào" tới định nghĩa tư duy phản biện, năm câu hỏi tra nguồn, bốn lợi ích, bộ 5W1H (bản tiếng Anh và bản tiếng Việt lệch thứ tự nhau), mười hai kỹ năng thế kỷ 21, 28 mẫu câu hỏi phản biện, và khép lại bằng tình huống đạo đức học thuật của Mohammed. Bổ sung ngoài slide những phần đề thi chắc chắn hỏi: diễn dịch/quy nạp/bỏ qua, hợp lệ (valid) so với đúng đắn (sound), bảng mười nguỵ biện phổ biến kèm ví dụ đời sinh viên, bốn thiên kiến nhận thức, và mô hình lập luận Toulmin dựng trọn trên một luận điểm thật.',
  content: [
    walkHead(D, 1, 15),
    walk(D, [

      [1, 'Cover — Critical Thinking Skills for University Success (The University of Sydney)',
        `<p class="y-chinh">🎯 The cover of the whole module: <strong>Critical Thinking Skills for University Success</strong>, <em>by The University of Sydney</em>, set in cream type on the deck's gold-brown background with an ornate border. Remember that background — it comes back exactly once, on slide 11, where it marks a section break.</p>
<ul>
<li><strong>Fifteen slides for a whole MOOC — read that as a warning, not a relief.</strong> MOOC 1's review deck runs to 109 slides and MOOC 2's to 101; MOOC 3 gets 15. The review deck is a <em>skeleton</em>, so anything the exam asks that is not on these 15 slides has to come from the Coursera videos. That is why this lesson marks clearly which parts are <strong>on the slide</strong> and which are <strong>added beyond the slide</strong>.</li>
<li><strong>What MOOC 3 is about.</strong> MOOC 1 was information literacy (finding and judging sources), MOOC 2 was problem solving and creativity. MOOC 3 is <em>critical thinking and argumentation</em>: how to question what you are told, how an argument is built, how to spot bad reasoning and hidden bias, and how to back a claim with evidence.</li>
<li><strong>How SSL101c is assessed, and what follows from it.</strong> 100% of the subject mark is one 60-minute multiple-choice paper sat at FPTU, covering all five MOOCs; you must hold the certificate for all five before you may sit it, and finishing every MOOC before the deadline earns one bonus mark. So the reading goal is not "get the gist" — it is <em>remember exact names and exact counts</em>.</li>
<li><strong>The counts that matter in this deck.</strong> <strong>3</strong> take-aways (slide 2) · <strong>7</strong> learning outcomes (slide 3) · <strong>5</strong> source questions (slide 6) · <strong>2</strong> reasons to use it at university (slide 7) · <strong>4</strong> importances (slide 8) · <strong>6</strong> questions in 5W1H (slides 9–10) · <strong>12</strong> 21st-century skills (slide 12) · <strong>28</strong> critical question stems (slides 13–14).</li>
<li><strong>The deck is a mixed-source deck, and that shows.</strong> Slide 3 is a screenshot of another document, slides 9, 13 and 14 are pasted posters in a different typeface, and slide 10 is an infographic in Vietnamese added by the lecturer. Only slides 1, 2, 4–8, 11, 12 and 15 are typed into the Sydney template itself.</li>
<li><strong>The route through the 15 slides.</strong> 1–3 framing and outcomes → 4–6 one everyday scenario that defines critical thinking → 7–8 why it matters → 9–10 the 5W1H questioning tool → 11–12 the skills it sits inside → 13–14 the question bank you actually use → 15 an ethics case that forces you to apply all of it.</li>
</ul>
<p class="meo">💡 The fastest way to tell this deck apart from the other four: MOOC 3's template is <strong>gold-brown with an ornate frame</strong>, while MOOC 2's is the red Sydney template. If you open a file and see red, you are in the wrong MOOC.</p>`,
        `<p class="y-chinh">🎯 Bìa của cả module: <strong>Critical Thinking Skills for University Success</strong>, <em>by The University of Sydney</em> — chữ kem trên nền nâu-vàng có viền hoa văn. Hãy nhớ cái nền đó: nó quay lại đúng MỘT lần nữa, ở slide 11, nơi nó đánh dấu một mốc chia phần.</p>
<ul>
<li><strong>Mười lăm slide cho cả một MOOC — hãy đọc con số đó như lời cảnh báo, không phải lời an ủi.</strong> Deck ôn tập MOOC 1 dài 109 slide, MOOC 2 dài 101 slide; MOOC 3 chỉ có 15. Deck này là một BỘ XƯƠNG, nên bất cứ thứ gì đề thi hỏi mà không nằm trên 15 slide này đều phải lấy từ video Coursera. Vì thế bài giảng dưới đây luôn ghi rõ chỗ nào là <strong>NỘI DUNG SLIDE</strong>, chỗ nào là <strong>BỔ SUNG NGOÀI SLIDE</strong>.</li>
<li><strong>MOOC 3 nói về cái gì.</strong> MOOC 1 là năng lực thông tin (tìm và đánh giá nguồn), MOOC 2 là giải quyết vấn đề và sáng tạo. MOOC 3 là <em>tư duy phản biện và lập luận</em>: cách chất vấn thứ người ta nói với bạn, một lập luận được dựng ra sao, làm sao nhận ra suy luận hỏng và thiên kiến ẩn, và làm sao chống lưng cho một luận điểm bằng bằng chứng.</li>
<li><strong>SSL101c chấm điểm thế nào, và kéo theo điều gì.</strong> 100% điểm môn nằm ở MỘT bài trắc nghiệm 60 phút thi tại trường, phủ cả năm MOOC; phải có chứng chỉ đủ năm MOOC mới được thi, và hoàn thành mọi MOOC trước hạn thì được cộng 1 điểm thưởng. Vậy mục tiêu khi đọc không phải "nắm ý chung" — mà là <em>nhớ đúng TÊN và đúng SỐ LƯỢNG</em>.</li>
<li><strong>Những con số của deck này.</strong> <strong>3</strong> điều rút ra (slide 2) · <strong>7</strong> chuẩn đầu ra (slide 3) · <strong>5</strong> câu hỏi về nguồn (slide 6) · <strong>2</strong> lý do dùng ở đại học (slide 7) · <strong>4</strong> tầm quan trọng (slide 8) · <strong>6</strong> câu hỏi trong 5W1H (slide 9–10) · <strong>12</strong> kỹ năng thế kỷ 21 (slide 12) · <strong>28</strong> mẫu câu hỏi phản biện (slide 13–14).</li>
<li><strong>Đây là deck TRỘN NGUỒN, và điều đó hiện rõ.</strong> Slide 3 là ảnh chụp màn hình một tài liệu khác, slide 9, 13 và 14 là poster dán vào với phông chữ khác hẳn, còn slide 10 là infographic TIẾNG VIỆT do giảng viên chèn thêm. Chỉ slide 1, 2, 4–8, 11, 12 và 15 là gõ thẳng vào mẫu slide của Sydney.</li>
<li><strong>Lộ trình 15 slide.</strong> 1–3 khung và chuẩn đầu ra → 4–6 một tình huống đời thường dùng để định nghĩa tư duy phản biện → 7–8 vì sao nó quan trọng → 9–10 công cụ chất vấn 5W1H → 11–12 bộ kỹ năng mà nó nằm trong → 13–14 kho câu hỏi bạn thật sự dùng → 15 một tình huống đạo đức buộc bạn áp dụng tất cả.</li>
</ul>
<p class="meo">💡 Cách nhanh nhất phân biệt deck này với bốn deck kia: mẫu slide MOOC 3 là <strong>NÂU-VÀNG có khung hoa văn</strong>, còn MOOC 2 là mẫu ĐỎ của Sydney. Mở file ra thấy màu đỏ là bạn đang ở nhầm MOOC.</p>`],

      [2, 'The "?" slide — Describe 3 "take-aways" that you have from the course',
        `<p class="y-chinh">🎯 A single large orange <strong>?</strong> over two lines of text: <em>"Describe 3 'take-aways' that you have from the course. That is, what are 3 things that you have learnt in this course that you will use or apply to your university study or another aspect of your life?"</em> It is a <strong>reflection</strong> prompt — and it is sitting at position 2, before a single idea has been taught.</p>
<ul>
<li><strong>Note the misplacement out loud, because it tells you what the slide is for.</strong> "Take-aways <em>from the course</em>" is a closing question; whoever assembled this review deck put the closing slide near the front. Treat it as the frame to read the next thirteen slides through: <em>which three things here am I actually going to use?</em></li>
<li><strong>What a "take-away" is, technically.</strong> Not a summary and not a fact — it is a <strong>transferable</strong> point: something that changes what you <em>do</em>. "Critical thinking has four benefits" is a fact. "Before I quote a source I will ask the five questions on slide 6" is a take-away, because it names a behaviour and a trigger.</li>
<li><strong>This is also the module's first piece of reflective thinking, which slide 8 will call "crucial for self-reflection".</strong> Reflection is the half of critical thinking you turn on yourself: not "was that source biased?" but "was <em>I</em> biased when I picked that source?"</li>
<li><strong>The standard shape of a reflective answer (beyond the slide).</strong> Use Gibbs or the simpler <em>What? · So what? · Now what?</em>: <strong>What</strong> happened or what did I learn → <strong>So what</strong> does it mean, why does it matter to me → <strong>Now what</strong> will I do differently, by when. A take-away that has no "now what" is not finished.</li>
<li><strong>At FPTU this is a graded genre, not a warm-up.</strong> Reflection paragraphs appear in OJT reports, in the SWP391/SWR302 retrospective sections, and in the "lessons learnt" of nearly every capstone document. The marker is looking for specific, checkable change — dates, behaviours, artefacts — not for enthusiasm.</li>
</ul>
<table>
<tr><th>Weak take-away</th><th>Strong take-away (same idea, rewritten)</th></tr>
<tr><td>"I learnt that critical thinking is important."</td><td>"Before citing a web source I will run the five questions on slide 6, starting with the SWR302 report due in week 7."</td></tr>
<tr><td>"I will think more carefully."</td><td>"When a teammate proposes a design, I will ask '5W1H — what evidence, compared with what?' instead of agreeing to keep the peace."</td></tr>
<tr><td>"5W1H is a useful method."</td><td>"I will put the six 5W1H questions at the top of my reading notes template so every article gets questioned the same way."</td></tr>
</table>
<p class="dap-an">✅ Three model take-aways for this MOOC: (1) <strong>Critical thinking is questioning my first thought</strong> — so I will treat my first answer as a draft, not a conclusion (slide 5). (2) <strong>Who said it matters as much as what was said</strong> — so I will check authority and personal interest before I quote (slides 6, 9). (3) <strong>A claim without evidence is only an opinion</strong> — so every claim in my reports gets a cited source attached (slide 3, outcome 5).</p>
<p class="meo">💡 Exam-friendly count: the slide asks for <strong>three</strong>, and it asks you to apply them to <em>"your university study or another aspect of your life"</em> — the transfer beyond the classroom is part of the question, not decoration.</p>`,
        `<p class="y-chinh">🎯 Một dấu <strong>?</strong> cam lớn nằm trên hai dòng chữ: <em>"Describe 3 'take-aways' that you have from the course. That is, what are 3 things that you have learnt in this course that you will use or apply to your university study or another aspect of your life?"</em> — Hãy mô tả BA điều bạn rút ra từ khoá học, tức ba thứ bạn đã học được và sẽ dùng cho việc học đại học hoặc một mặt khác của đời sống. Đây là câu hỏi <strong>PHẢN TƯ</strong> — và nó đang đứng ở vị trí thứ 2, trước khi dạy bất cứ ý nào.</p>
<ul>
<li><strong>Hãy gọi tên chỗ đặt nhầm này, vì nó cho biết slide dùng để làm gì.</strong> "Điều rút ra <em>TỪ KHOÁ HỌC</em>" là câu hỏi đóng khoá; người ghép deck ôn tập đã đặt slide kết thúc lên gần đầu. Hãy coi nó như cái KHUNG để đọc mười ba slide còn lại: <em>trong đống này, ba thứ nào tôi sẽ thật sự dùng?</em></li>
<li><strong>"Take-away" về mặt kỹ thuật là gì.</strong> Không phải bản tóm tắt, cũng không phải một sự kiện — nó là một điểm <strong>CHUYỂN GIAO ĐƯỢC</strong>: thứ làm đổi việc bạn LÀM. "Tư duy phản biện có bốn lợi ích" là một sự kiện. "Trước khi trích một nguồn, tôi sẽ hỏi năm câu ở slide 6" mới là take-away, vì nó nêu rõ một HÀNH VI và một MỐC KÍCH HOẠT.</li>
<li><strong>Đây cũng là mảnh tư duy phản tư đầu tiên của module, thứ mà slide 8 sẽ gọi là "crucial for self-reflection".</strong> Phản tư là nửa phần bạn quay ngược tư duy phản biện vào chính mình: không phải "nguồn đó có thiên lệch không?" mà là "<em>TÔI</em> có thiên lệch khi chọn nguồn đó không?"</li>
<li><strong>Hình dạng chuẩn của một câu trả lời phản tư (bổ sung ngoài slide).</strong> Dùng Gibbs, hoặc gọn hơn là <em>What? · So what? · Now what?</em>: <strong>Cái gì</strong> đã xảy ra / tôi học được gì → <strong>Thì sao</strong>, nó có nghĩa gì với tôi → <strong>Giờ thì sao</strong>, tôi sẽ làm khác đi điều gì, trước khi nào. Một take-away không có phần "giờ thì sao" là chưa viết xong.</li>
<li><strong>Ở FPTU đây là một thể loại ĐƯỢC CHẤM ĐIỂM, không phải bài khởi động.</strong> Đoạn phản tư xuất hiện trong báo cáo OJT, trong phần retrospective của SWP391/SWR302, và trong mục "bài học rút ra" của gần như mọi tài liệu đồ án. Người chấm tìm sự thay đổi CỤ THỂ, KIỂM ĐƯỢC — mốc thời gian, hành vi, sản phẩm — chứ không tìm sự hào hứng.</li>
</ul>
<table>
<tr><th>Take-away YẾU</th><th>Take-away MẠNH (cùng ý, viết lại)</th></tr>
<tr><td>"Em học được rằng tư duy phản biện rất quan trọng."</td><td>"Trước khi trích một nguồn web, em sẽ chạy năm câu hỏi ở slide 6, bắt đầu từ báo cáo SWR302 nộp tuần 7."</td></tr>
<tr><td>"Em sẽ suy nghĩ kỹ hơn."</td><td>"Khi một thành viên đề xuất thiết kế, em sẽ hỏi theo 5W1H — bằng chứng đâu, so với cái gì — thay vì gật cho êm chuyện."</td></tr>
<tr><td>"5W1H là một phương pháp hữu ích."</td><td>"Em sẽ đặt sáu câu 5W1H lên đầu mẫu ghi chú đọc tài liệu, để bài nào cũng bị chất vấn như nhau."</td></tr>
</table>
<p class="dap-an">✅ Ba take-away mẫu cho MOOC này: (1) <strong>Tư duy phản biện là chất vấn ý nghĩ ĐẦU TIÊN của mình</strong> — nên em sẽ coi câu trả lời đầu tiên là bản nháp, không phải kết luận (slide 5). (2) <strong>AI nói quan trọng ngang với NÓI GÌ</strong> — nên em sẽ kiểm tư cách chuyên môn và lợi ích cá nhân trước khi trích (slide 6, 9). (3) <strong>Một khẳng định không có bằng chứng chỉ là một ý kiến</strong> — nên mọi khẳng định trong báo cáo của em đều phải gắn nguồn (slide 3, chuẩn đầu ra 5).</p>
<p class="meo">💡 Con số cần nhớ cho trắc nghiệm: slide hỏi <strong>BA</strong> điều, và nó yêu cầu áp dụng vào <em>"việc học đại học HOẶC một mặt khác của đời sống"</em> — phần chuyển giao ra ngoài lớp học là một phần của câu hỏi, không phải chữ trang trí.</p>`],

      [3, 'Learning outcome — the seven MOOC 3 outcomes (a pasted screenshot)',
        `<p class="y-chinh">🎯 Title <strong>"Learning outcome"</strong> (singular, though there are seven), and under it a <strong>pasted screenshot</strong> of another document: an orange heading <em>"MOOC 3 – Critical Thinking / Outline of topics"</em>, then <em>Learning Outcomes</em> and seven bullets in a completely different typeface from the rest of the deck.</p>
<table>
<tr><th>#</th><th>The outcome, as written on the screenshot</th><th>Where this deck delivers it</th></tr>
<tr><td>1</td><td>Use critical thinking and argumentation in university contexts to improve academic results</td><td>Slides 4–7</td></tr>
<tr><td>2</td><td>Understand the importance and function of critical thinking in academic culture</td><td>Slide 8</td></tr>
<tr><td>3</td><td>Use a variety of thinking tools to improve critical thinking</td><td>Slides 9–10 (5W1H), 13–14</td></tr>
<tr><td>4</td><td>Identify types of argument, and bias within arguments, in order to better evaluate the strength of arguments</td><td>Barely on the slides — see the added sections on slides 7–10</td></tr>
<tr><td>5</td><td>Use evidence to support claims in arguments</td><td>Slide 6, and the Toulmin section added on slide 13</td></tr>
<tr><td>6</td><td>Apply critical thinking and argumentation to real world problems and issues</td><td>Slide 15 (the Mohammed case)</td></tr>
<tr><td>7</td><td>Demonstrate critical thinking in communication in academic contexts</td><td>Slides 13–14, plus critical writing added on slide 14</td></tr>
</table>
<ul>
<li><strong>Seven outcomes, and the count is exam-sized.</strong> If a question asks how many learning outcomes MOOC 3 declares, the answer from this slide is <strong>7</strong>. Do not let the singular title "Learning outcome" talk you into "1".</li>
<li><strong>Read outcome 4 twice — it is the one the slides do not really cover.</strong> "Types of argument" and "bias within arguments" are named here and then never taught in the 15 slides. That is precisely why this lesson adds deduction/induction/abduction (slide 8), valid vs sound (slide 7), fallacies (slide 9) and cognitive bias (slide 10). The exam draws on the MOOC, not on the deck.</li>
<li><strong>Two words recur across the seven: "critical thinking" and "argumentation".</strong> The pairing is the whole module in miniature — thinking is the private half, argumentation is the public half where your thinking has to survive someone else reading it.</li>
<li><strong>Outcome 5 is the link back to MOOC 1.</strong> "Use evidence to support claims" only works if the evidence itself survives source evaluation — the authority, currency and purpose checks from MOOC 1. A well-argued essay built on a random blog fails outcome 5 no matter how tidy the logic.</li>
<li><strong>Outcome verbs form a rising ladder.</strong> <em>Understand</em> → <em>identify</em> → <em>use</em> → <em>apply</em> → <em>demonstrate</em>. That is Bloom's order, and it predicts the exam: most items sit at understand/identify (define this, name that, which is an example of), a few at apply (given this scenario, what should X do — see slide 15).</li>
</ul>
<p class="pitfall">⚠️ This slide is a screenshot of an external document, not deck content, so its wording can differ slightly from the Coursera page. If an exam option quotes an outcome with different wording, judge by the idea, not by the exact string.</p>`,
        `<p class="y-chinh">🎯 Tiêu đề <strong>"Learning outcome"</strong> (số ÍT, dù bên dưới có bảy cái), và dưới nó là một <strong>ẢNH CHỤP MÀN HÌNH</strong> của tài liệu khác: dòng cam <em>"MOOC 3 – Critical Thinking / Outline of topics"</em>, rồi <em>Learning Outcomes</em> và bảy gạch đầu dòng với phông chữ khác hẳn phần còn lại của deck.</p>
<table>
<tr><th>#</th><th>Chuẩn đầu ra, đúng chữ trên ảnh</th><th>Deck này trả nó ở đâu</th></tr>
<tr><td>1</td><td>Dùng tư duy phản biện và lập luận trong bối cảnh đại học để cải thiện kết quả học tập</td><td>Slide 4–7</td></tr>
<tr><td>2</td><td>Hiểu tầm quan trọng và chức năng của tư duy phản biện trong văn hoá học thuật</td><td>Slide 8</td></tr>
<tr><td>3</td><td>Dùng nhiều công cụ tư duy khác nhau để nâng cao tư duy phản biện</td><td>Slide 9–10 (5W1H), 13–14</td></tr>
<tr><td>4</td><td>Nhận diện CÁC LOẠI lập luận, và THIÊN KIẾN bên trong lập luận, để đánh giá độ mạnh của lập luận tốt hơn</td><td>Gần như KHÔNG có trên slide — xem các mục bổ sung ở slide 7–10</td></tr>
<tr><td>5</td><td>Dùng bằng chứng để chống lưng cho khẳng định trong lập luận</td><td>Slide 6, và mục Toulmin bổ sung ở slide 13</td></tr>
<tr><td>6</td><td>Áp dụng tư duy phản biện và lập luận vào vấn đề, sự việc ngoài đời thật</td><td>Slide 15 (tình huống Mohammed)</td></tr>
<tr><td>7</td><td>Thể hiện tư duy phản biện trong giao tiếp ở bối cảnh học thuật</td><td>Slide 13–14, cộng phần viết phản biện bổ sung ở slide 14</td></tr>
</table>
<ul>
<li><strong>BẢY chuẩn đầu ra, và con số này đúng cỡ đề thi.</strong> Nếu bị hỏi MOOC 3 công bố bao nhiêu learning outcome, đáp án theo slide này là <strong>7</strong>. Đừng để tiêu đề số ít "Learning outcome" dụ bạn chọn "1".</li>
<li><strong>Đọc chuẩn đầu ra số 4 hai lần — đó là cái mà slide KHÔNG thật sự dạy.</strong> "Các loại lập luận" và "thiên kiến trong lập luận" được nêu tên ở đây rồi không bao giờ xuất hiện lại trong 15 slide. Chính vì thế bài này bổ sung diễn dịch/quy nạp/bỏ qua (slide 8), hợp lệ so với đúng đắn (slide 7), nguỵ biện (slide 9) và thiên kiến nhận thức (slide 10). Đề thi lấy từ MOOC, không lấy từ deck.</li>
<li><strong>Hai chữ lặp đi lặp lại suốt bảy dòng: "critical thinking" và "argumentation".</strong> Cặp đôi đó chính là cả module thu nhỏ — TƯ DUY là nửa riêng tư, LẬP LUẬN là nửa công khai, nơi suy nghĩ của bạn phải sống sót khi người khác đọc.</li>
<li><strong>Chuẩn đầu ra 5 là cầu nối ngược về MOOC 1.</strong> "Dùng bằng chứng để chống lưng khẳng định" chỉ có tác dụng nếu bản thân bằng chứng sống sót qua khâu đánh giá nguồn — kiểm tư cách chuyên môn, tính cập nhật và mục đích như MOOC 1 dạy. Một tiểu luận lập luận chặt mà dựng trên một blog vô danh thì vẫn trượt chuẩn 5, logic gọn tới mấy cũng vậy.</li>
<li><strong>Động từ của bảy chuẩn tạo thành một cái thang.</strong> <em>Hiểu</em> → <em>nhận diện</em> → <em>dùng</em> → <em>áp dụng</em> → <em>thể hiện</em>. Đó là trật tự Bloom, và nó dự báo đề thi: phần lớn câu nằm ở mức hiểu/nhận diện (định nghĩa cái này, kể tên cái kia, cái nào là ví dụ của…), một số ít ở mức áp dụng (cho tình huống này, X nên làm gì — xem slide 15).</li>
</ul>
<p class="pitfall">⚠️ Slide này là ảnh chụp một tài liệu bên ngoài, không phải nội dung gõ vào deck, nên chữ có thể lệch chút so với trang Coursera. Nếu phương án thi trích một chuẩn đầu ra với câu chữ khác, hãy phán theo Ý, đừng phán theo chuỗi ký tự.</p>`],

      [4, 'What is the Weather today? — the coat scenario that sets up the whole module',
        `<p class="y-chinh">🎯 One scenario, three sentences: <em>"Today, the weather forecast says it will rain. Your mom tells you to wear a coat to school. What will you do?"</em> Nothing is explained yet — the slide is deliberately an <strong>open question</strong>, and the next two slides are its answer.</p>
<ul>
<li><strong>Why an everyday example and not an academic one.</strong> Because critical thinking is easiest to see where the stakes are tiny and the reasoning is fast. You already do it with weather; the module's job is to make the same moves conscious and repeatable when the topic is a research paper you cannot judge by feel.</li>
<li><strong>Count the claims hidden in three short sentences.</strong> There is a <em>forecast</em> (a probabilistic claim from an institution), an <em>instruction</em> (from a person with authority and an interest in you), and a <em>decision</em> you must make under uncertainty. Source, motive and action — the same three things you will weigh in slide 15's ethics case.</li>
<li><strong>The trap is that "obey" and "ignore" are both uncritical.</strong> Wearing the coat because mom said so is deference; refusing because you dislike being told is reactance. Both skip the step that matters — <em>asking what would make either choice right</em>. Critical thinking is not scepticism-by-default; it is judgement.</li>
<li><strong>Beyond the slide: fast thinking vs slow thinking.</strong> Psychology calls the instant answer <em>System 1</em> — cheap, automatic, usually good enough — and the deliberate check <em>System 2</em> — slow, effortful, and the one you have to switch on. Slide 5 is going to define critical thinking as exactly that switch: "questioning our first thoughts".</li>
<li><strong>The question is a decision under uncertainty, so a good answer is conditional, not absolute.</strong> "Yes" and "no" are both worse than "if it is forecast for the afternoon and I come home at 5, then yes; if it is a 10-minute morning shower and I have a hood, then no." Naming the condition is the thinking.</li>
<li><strong>At FPTU the same shape appears every week.</strong> A senior says "don't use that library, it's bad"; a Stack Overflow answer with 800 upvotes says do X; your team lead says ship without tests because the deadline is Friday. Same structure: a claim, a source with a motive, a decision you own.</li>
</ul>
<p class="dap-an">✅ What will you do? The critical answer is: <strong>neither obey nor refuse yet — ask first.</strong> When is the rain forecast for, how heavy, how confident is the forecast, how long am I outside, what does the coat cost me (carrying it all day), and what does being wrong cost me each way? Slide 6 lists exactly this kind of question, and slide 5 says why.</p>
<p class="meo">💡 Remember the scenario as the deck's <strong>three-slide arc</strong>: slide 4 asks, slide 5 defines, slide 6 supplies the questions. Exam items about "the weather/coat example" are testing whether you know it illustrates <em>questioning your first thought</em>, not whether coats are useful.</p>`,
        `<p class="y-chinh">🎯 Một tình huống, ba câu: <em>"Hôm nay dự báo thời tiết nói trời sẽ mưa. Mẹ bảo bạn mặc áo khoác đi học. Bạn sẽ làm gì?"</em> Chưa giải thích gì cả — slide cố tình để một <strong>CÂU HỎI MỞ</strong>, và hai slide kế tiếp chính là câu trả lời của nó.</p>
<ul>
<li><strong>Vì sao lấy ví dụ đời thường chứ không lấy ví dụ học thuật.</strong> Vì tư duy phản biện dễ nhìn thấy nhất ở chỗ mất mát nhỏ và suy nghĩ diễn ra nhanh. Bạn vốn đã làm điều đó với thời tiết; việc của module là biến đúng những nước đi ấy thành CÓ Ý THỨC và LẶP LẠI ĐƯỢC khi chủ đề là một bài báo khoa học mà bạn không thể phán bằng cảm giác.</li>
<li><strong>Đếm thử số khẳng định giấu trong ba câu ngắn.</strong> Có một <em>DỰ BÁO</em> (khẳng định xác suất, từ một tổ chức), một <em>MỆNH LỆNH</em> (từ một người có uy quyền và có lợi ích gắn với bạn), và một <em>QUYẾT ĐỊNH</em> bạn phải ra trong điều kiện không chắc chắn. Nguồn, động cơ và hành động — đúng ba thứ bạn sẽ phải cân ở tình huống đạo đức slide 15.</li>
<li><strong>Cái bẫy là: "nghe lời" và "phớt lờ" ĐỀU là không phản biện.</strong> Mặc áo vì mẹ bảo là phục tùng; không mặc vì ghét bị sai bảo là phản ứng ngược. Cả hai đều bỏ qua bước quan trọng — <em>hỏi xem điều gì sẽ làm cho lựa chọn nào là đúng</em>. Tư duy phản biện không phải hoài nghi mặc định; nó là PHÁN ĐOÁN.</li>
<li><strong>Bổ sung ngoài slide: tư duy nhanh và tư duy chậm.</strong> Tâm lý học gọi câu trả lời tức thì là <em>Hệ 1</em> — rẻ, tự động, thường là đủ dùng — và bước kiểm có chủ ý là <em>Hệ 2</em> — chậm, tốn sức, và là cái bạn phải chủ động bật lên. Slide 5 sắp định nghĩa tư duy phản biện đúng bằng cái công tắc đó: "chất vấn ý nghĩ đầu tiên của chúng ta".</li>
<li><strong>Đây là quyết định trong điều kiện bất định, nên câu trả lời tốt phải CÓ ĐIỀU KIỆN, không phải tuyệt đối.</strong> "Có" và "không" đều tệ hơn "nếu dự báo mưa buổi chiều và 5 giờ em mới về thì mặc; nếu chỉ là cơn mưa rào 10 phút buổi sáng và áo em có mũ thì thôi." Nêu được ĐIỀU KIỆN chính là phần tư duy.</li>
<li><strong>Ở FPTU cùng một hình dạng đó xuất hiện mỗi tuần.</strong> Một anh khoá trên bảo "đừng dùng thư viện đó, dở lắm"; một câu trả lời Stack Overflow 800 upvote bảo làm cách X; nhóm trưởng bảo cứ ship không cần test vì thứ Sáu tới hạn. Cùng cấu trúc: một khẳng định, một nguồn có động cơ, và một quyết định thuộc về bạn.</li>
</ul>
<p class="dap-an">✅ Bạn sẽ làm gì? Câu trả lời phản biện là: <strong>chưa nghe lời cũng chưa từ chối — HỎI trước đã.</strong> Mưa lúc mấy giờ, mưa to cỡ nào, dự báo chắc tới đâu, mình ở ngoài trời bao lâu, mặc áo tốn gì (vác cả ngày), và sai mỗi chiều thì mất gì? Slide 6 liệt kê đúng loại câu hỏi này, còn slide 5 nói vì sao.</p>
<p class="meo">💡 Nhớ tình huống này như <strong>cung ba slide</strong> của deck: slide 4 HỎI, slide 5 ĐỊNH NGHĨA, slide 6 CUNG CẤP BỘ CÂU HỎI. Câu thi về "ví dụ áo khoác/thời tiết" là đang kiểm bạn có biết nó minh hoạ cho <em>việc chất vấn ý nghĩ đầu tiên</em> hay không, chứ không hỏi áo khoác có ích không.</p>`],

      [5, 'No title — the definition: critical thinking is questioning our first thoughts',
        `<p class="y-chinh">🎯 A slide with <strong>no title at all</strong> — text starts straight under the two decorative rules. Two paragraphs: the everyday answer, then the definition. <em>"You might decide to wear a coat to school because the weather forecast says it will rain."</em> · <em>"Critical thinking is about questioning our first thoughts and reaching a more balanced and thoughtful judgement about the information we're seeing, hearing and reading."</em></p>
<table>
<tr><th>Phrase in the definition</th><th>What it actually commits you to</th></tr>
<tr><td><strong>questioning our first thoughts</strong></td><td>The target is <em>your own</em> initial reaction, not only other people's claims</td></tr>
<tr><td><strong>reaching a … judgement</strong></td><td>You must still <strong>decide</strong>. Endless doubting is not critical thinking</td></tr>
<tr><td><strong>more balanced</strong></td><td>Weigh both sides; "more" is comparative, so it is a direction, not a state</td></tr>
<tr><td><strong>thoughtful</strong></td><td>Deliberate and effortful — the slow system, not the fast one</td></tr>
<tr><td><strong>seeing, hearing and reading</strong></td><td>All three input channels: images and video, speech, and text</td></tr>
</table>
<ul>
<li><strong>Memorise the definition close to word-for-word — this is the single most quotable line in the deck.</strong> A multiple-choice paper loves definitions with distinctive phrasing, and "questioning our first thoughts" plus "balanced and thoughtful judgement" is distinctive.</li>
<li><strong>The first paragraph is not filler; it is the "before" picture.</strong> "You might decide to wear a coat <em>because the forecast says it will rain</em>" is a complete little argument — premise (forecast) → conclusion (wear the coat) — and it is perfectly reasonable. Critical thinking does not say it is wrong; it says <em>do not stop there</em>.</li>
<li><strong>Note what the definition does NOT say.</strong> It never says "criticise", "disagree", or "find flaws". Critical here means <em>evaluative</em>, from Greek <em>kritikos</em> (able to judge), not "negative". Students who think critical thinking means attacking things write hostile essays and lose marks.</li>
<li><strong>"Seeing, hearing and reading" is a deliberate list of three.</strong> It rules out the common belief that critical thinking is only for written sources. A lecture you hear, a TikTok you watch and a textbook you read are all in scope — and the hardest one is video, where production quality feels like credibility.</li>
<li><strong>The word "balanced" carries the fairness requirement.</strong> To reach a balanced judgement you have to give the side you dislike its strongest form. If your essay's counter-argument is a weak version nobody holds, you have built a straw man (slide 9) and your "balance" is decorative.</li>
<li><strong>At FPTU the definition maps onto a habit you can run in 30 seconds.</strong> Read the requirement → write your first answer → ask "what would have to be true for this to be wrong?" → adjust → commit. The last step is compulsory; a report that lists considerations without concluding scores badly in SWP391 exactly because it never reached a judgement.</li>
</ul>
<p class="pitfall">⚠️ Two things this deck leaves untitled — slides 5 and 6 — are the two that carry the definition and the checklist. Do not skip them when revising just because they have no heading to catch your eye.</p>
<p class="meo">💡 Compress the definition to four beats: <strong>question the first thought → weigh both sides → judge → about what I see, hear AND read</strong>.</p>`,
        `<p class="y-chinh">🎯 Một slide <strong>KHÔNG CÓ TIÊU ĐỀ</strong> — chữ bắt đầu ngay dưới hai gạch trang trí. Hai đoạn: câu trả lời đời thường, rồi định nghĩa. <em>"Bạn có thể quyết định mặc áo khoác đi học VÌ dự báo nói trời sẽ mưa."</em> · <em>"Tư duy phản biện là việc CHẤT VẤN những ý nghĩ ĐẦU TIÊN của chúng ta và đi tới một PHÁN ĐOÁN cân bằng hơn, chín chắn hơn về thông tin mà chúng ta đang NHÌN, NGHE và ĐỌC."</em></p>
<table>
<tr><th>Cụm từ trong định nghĩa</th><th>Nó thật sự buộc bạn làm gì</th></tr>
<tr><td><strong>chất vấn ý nghĩ đầu tiên của ta</strong></td><td>Đối tượng là phản ứng ban đầu của <em>CHÍNH BẠN</em>, không chỉ là khẳng định của người khác</td></tr>
<tr><td><strong>đi tới một PHÁN ĐOÁN</strong></td><td>Bạn vẫn phải <strong>QUYẾT</strong>. Hoài nghi triền miên KHÔNG phải tư duy phản biện</td></tr>
<tr><td><strong>cân bằng HƠN</strong></td><td>Cân cả hai phía; chữ "hơn" là so sánh, nên đây là một HƯỚNG ĐI, không phải một trạng thái</td></tr>
<tr><td><strong>chín chắn / có suy nghĩ</strong></td><td>Có chủ ý và tốn sức — hệ tư duy CHẬM, không phải hệ nhanh</td></tr>
<tr><td><strong>nhìn, nghe và đọc</strong></td><td>Cả BA kênh đầu vào: hình ảnh và video, lời nói, và văn bản</td></tr>
</table>
<ul>
<li><strong>Thuộc định nghĩa này gần như từng chữ — đây là câu đáng trích nhất cả deck.</strong> Đề trắc nghiệm rất thích định nghĩa có cách diễn đạt đặc trưng, mà "chất vấn ý nghĩ đầu tiên" cộng "phán đoán cân bằng và chín chắn" thì rất đặc trưng.</li>
<li><strong>Đoạn đầu không phải chữ độn; nó là bức ảnh "TRƯỚC KHI".</strong> "Bạn mặc áo khoác <em>VÌ dự báo nói trời mưa</em>" đã là một lập luận hoàn chỉnh cỡ nhỏ — tiền đề (dự báo) → kết luận (mặc áo) — và nó hoàn toàn hợp lý. Tư duy phản biện không bảo nó sai; nó bảo <em>đừng DỪNG ở đó</em>.</li>
<li><strong>Để ý thứ định nghĩa KHÔNG nói.</strong> Nó không hề nói "chỉ trích", "phản đối" hay "bới lỗi". Chữ "critical" ở đây nghĩa là <em>ĐÁNH GIÁ ĐƯỢC</em>, gốc Hy Lạp <em>kritikos</em> (có khả năng phán xét), không phải "tiêu cực". Sinh viên nghĩ tư duy phản biện là đi công kích thì viết tiểu luận đầy giọng gây hấn và mất điểm.</li>
<li><strong>"Nhìn, nghe và đọc" là một danh sách BA có chủ ý.</strong> Nó loại bỏ niềm tin phổ biến rằng tư duy phản biện chỉ dành cho nguồn viết. Một bài giảng bạn NGHE, một TikTok bạn XEM và một giáo trình bạn ĐỌC đều nằm trong phạm vi — và khó nhất là video, nơi chất lượng sản xuất dễ bị nhầm thành độ tin cậy.</li>
<li><strong>Chữ "cân bằng" gánh yêu cầu CÔNG BẰNG.</strong> Muốn có phán đoán cân bằng, bạn phải trình bày phía mình không thích ở dạng MẠNH NHẤT của nó. Nếu phần phản biện trong bài của bạn là một phiên bản yếu xìu chẳng ai giữ, bạn đã dựng người rơm (slide 9) và cái "cân bằng" kia chỉ là trang trí.</li>
<li><strong>Ở FPTU, định nghĩa này quy về một thói quen chạy trong 30 giây.</strong> Đọc yêu cầu → viết câu trả lời đầu tiên → hỏi "điều gì phải đúng thì câu này mới SAI?" → điều chỉnh → CHỐT. Bước cuối là bắt buộc; một báo cáo liệt kê đủ cân nhắc mà không kết luận thì bị chấm thấp ở SWP391 chính vì nó chưa bao giờ đi tới một phán đoán.</li>
</ul>
<p class="pitfall">⚠️ Hai slide duy nhất của deck không có tiêu đề — slide 5 và 6 — lại chính là hai slide mang định nghĩa và bộ câu hỏi. Đừng vì chúng không có dòng tiêu đề bắt mắt mà lướt qua khi ôn.</p>
<p class="meo">💡 Nén định nghĩa thành bốn nhịp: <strong>chất vấn ý nghĩ đầu → cân cả hai phía → PHÁN ĐOÁN → về thứ mình NHÌN, NGHE VÀ ĐỌC</strong>.</p>`],

      [6, 'No title — the five questions critical thinking asks',
        `<p class="y-chinh">🎯 Still untitled. First the scenario is finished — <em>"Before you decide whether to wear a coat to school, =&gt; ask what time it is forecast to rain, how heavy the rain is expected to be and so on."</em> — then the checklist: <em>"Critical thinking asks these types of questions:"</em> followed by <strong>five</strong> questions marked with "+" signs.</p>
<table>
<tr><th>#</th><th>The question (slide wording)</th><th>What it is really testing</th></tr>
<tr><td>1</td><td>Who said or wrote it?</td><td><strong>Source identity</strong> — can the claim even be traced to someone?</td></tr>
<tr><td>2</td><td>Is the information reliable?</td><td><strong>Reliability</strong> — accuracy, consistency, whether others confirm it</td></tr>
<tr><td>3</td><td>Is there evidence or proof to support it?</td><td><strong>Evidence</strong> — is this a claim or an assertion?</td></tr>
<tr><td>4</td><td>Is the person qualified to speak about the topic?</td><td><strong>Authority / expertise</strong> — qualified <em>on this topic</em>, not in general</td></tr>
<tr><td>5</td><td>Does the person have a personal interest in the topic</td><td><strong>Motive / conflict of interest</strong> — who gains if you believe it?</td></tr>
</table>
<ul>
<li><strong>Five questions — burn the number in.</strong> Slide 9 will give you a <em>six</em>-question tool (5W1H) that looks similar and is not the same list. A multiple-choice item that swaps "five" for "six", or mixes items from the two lists, is the easiest trap in this deck.</li>
<li><strong>Questions 4 and 5 are the pair students collapse.</strong> <em>Qualified</em> is about competence; <em>personal interest</em> is about motive. A cardiologist really is qualified to talk about heart drugs — and may also be paid by the company that makes one. Both checks must pass, and failing either does not make the claim false, only unsafe to accept unchecked.</li>
<li><strong>Question 3 draws the line between an assertion and a claim.</strong> "Microservices scale better" with nothing attached is an assertion. With a benchmark, a case study or a cited paper attached it becomes a claim you can argue about. Learning outcome 5 ("use evidence to support claims") lives entirely in this bullet.</li>
<li><strong>This is MOOC 1 arriving inside MOOC 3.</strong> MOOC 1 taught source evaluation — authority, accuracy, currency, purpose. Here the same tests reappear as a thinking habit rather than a library skill. If you met CRAAP or a similar checklist in MOOC 1, map it onto these five and revise them together; exam questions cross between the MOOCs freely.</li>
<li><strong>Notice the last bullet has no question mark on the slide.</strong> "Does the person have a personal interest in the topic" ends bare. It is a typo in the original — flagged here rather than silently corrected, because the exam quotes the slide.</li>
<li><strong>Run the five on something from your own week at FPTU.</strong> A YouTube tutorial says "never use ORM, always write raw SQL". Who? An anonymous channel. Reliable? No benchmarks, no version numbers. Evidence? One toy example. Qualified? Unknown, no track record shown. Personal interest? The video sells a paid SQL course. Five fails — not proof the advice is wrong, but proof you must not repeat it in a report as if it were established.</li>
</ul>
<p class="dap-an">✅ Apply them to the coat: Who said it — the national meteorological service (traceable). Reliable — forecasts are probabilistic, roughly 80% accurate one day ahead. Evidence — radar and models, published. Qualified — yes, that is their field. Personal interest — none in whether you personally get wet. Conclusion: a trustworthy source, so take the forecast seriously, and ask the <em>timing and intensity</em> questions the slide suggests rather than re-litigating the source.</p>
<p class="meo">💡 Mnemonic for the five: <strong>AI · TIN · CHỨNG · CHUYÊN · LỢI</strong> — who said it, is it reliable, is there evidence, are they qualified, do they have an interest.</p>`,
        `<p class="y-chinh">🎯 Vẫn không có tiêu đề. Trước hết tình huống được khép lại — <em>"Trước khi quyết định có mặc áo khoác đi học hay không, =&gt; hãy hỏi dự báo mưa vào lúc mấy giờ, mưa được dự đoán to cỡ nào, v.v."</em> — rồi tới bộ kiểm: <em>"Tư duy phản biện hỏi những loại câu hỏi sau:"</em> kèm <strong>NĂM</strong> câu đánh dấu bằng dấu "+".</p>
<table>
<tr><th>#</th><th>Câu hỏi (đúng chữ slide)</th><th>Nó thật ra đang kiểm cái gì</th></tr>
<tr><td>1</td><td>Who said or wrote it? — Ai nói hoặc viết ra?</td><td><strong>DANH TÍNH NGUỒN</strong> — khẳng định này có truy được về ai không?</td></tr>
<tr><td>2</td><td>Is the information reliable? — Thông tin có đáng tin không?</td><td><strong>ĐỘ TIN CẬY</strong> — chính xác, nhất quán, có ai khác xác nhận không</td></tr>
<tr><td>3</td><td>Is there evidence or proof to support it? — Có bằng chứng chống lưng không?</td><td><strong>BẰNG CHỨNG</strong> — đây là một luận điểm hay chỉ là một lời phán?</td></tr>
<tr><td>4</td><td>Is the person qualified to speak about the topic? — Người đó có đủ chuyên môn về chủ đề này không?</td><td><strong>UY TÍN CHUYÊN MÔN</strong> — đủ chuyên môn <em>VỀ ĐÚNG CHỦ ĐỀ NÀY</em>, không phải giỏi chung chung</td></tr>
<tr><td>5</td><td>Does the person have a personal interest in the topic — Người đó có lợi ích cá nhân trong chuyện này không</td><td><strong>ĐỘNG CƠ / XUNG ĐỘT LỢI ÍCH</strong> — ai được lợi nếu bạn tin?</td></tr>
</table>
<ul>
<li><strong>NĂM câu — khắc con số vào đầu.</strong> Slide 9 sẽ đưa cho bạn một công cụ <em>SÁU</em> câu (5W1H) trông na ná mà KHÔNG phải cùng một danh sách. Một câu trắc nghiệm tráo "năm" thành "sáu", hoặc trộn mục của hai danh sách, là cái bẫy dễ dính nhất trong deck này.</li>
<li><strong>Câu 4 và 5 là cặp sinh viên hay gộp làm một.</strong> <em>Đủ chuyên môn</em> nói về NĂNG LỰC; <em>lợi ích cá nhân</em> nói về ĐỘNG CƠ. Một bác sĩ tim mạch thật sự đủ chuyên môn nói về thuốc tim — và cũng có thể đang nhận tiền của hãng làm ra một loại thuốc đó. Cả hai phép kiểm đều phải qua, và trượt một cái không làm khẳng định thành SAI, chỉ làm nó thành KHÔNG AN TOÀN để tin ngay.</li>
<li><strong>Câu 3 vạch ranh giới giữa LỜI PHÁN và LUẬN ĐIỂM.</strong> "Microservices mở rộng tốt hơn" mà không kèm gì cả là lời phán. Kèm một phép đo, một case study hay một bài báo được trích thì nó thành luận điểm có thể tranh luận. Chuẩn đầu ra 5 ("dùng bằng chứng chống lưng cho khẳng định") nằm trọn trong gạch đầu dòng này.</li>
<li><strong>Đây là MOOC 1 quay lại bên trong MOOC 3.</strong> MOOC 1 dạy đánh giá nguồn — uy tín, độ chính xác, tính cập nhật, mục đích. Ở đây đúng những phép kiểm ấy trở lại dưới dạng một THÓI QUEN TƯ DUY chứ không còn là kỹ năng thư viện. Nếu bạn đã gặp CRAAP hay bộ kiểm tương tự ở MOOC 1, hãy ánh xạ nó vào năm câu này và ôn chung; đề thi nhảy qua lại giữa các MOOC rất thoải mái.</li>
<li><strong>Để ý gạch cuối cùng KHÔNG có dấu hỏi trên slide.</strong> "Does the person have a personal interest in the topic" kết thúc trống trơn. Đó là lỗi của bản gốc — nêu ra ở đây chứ không lặng lẽ sửa, vì đề thi trích theo slide.</li>
<li><strong>Chạy thử năm câu trên một thứ trong tuần học của bạn ở FPTU.</strong> Một video YouTube bảo "đừng bao giờ dùng ORM, luôn viết SQL thuần". Ai nói? Một kênh ẩn danh. Đáng tin? Không có phép đo, không có số phiên bản. Bằng chứng? Đúng một ví dụ đồ chơi. Chuyên môn? Không rõ, không trưng hồ sơ. Lợi ích cá nhân? Video bán một khoá SQL có phí. Trượt cả năm — không chứng minh lời khuyên đó sai, nhưng chứng minh bạn KHÔNG được chép nó vào báo cáo như một điều đã được xác lập.</li>
</ul>
<p class="dap-an">✅ Áp năm câu vào chuyện áo khoác: Ai nói — cơ quan khí tượng quốc gia (truy được). Đáng tin — dự báo là xác suất, độ chính xác cỡ 80% cho hôm sau. Bằng chứng — radar và mô hình, có công bố. Chuyên môn — có, đúng ngành của họ. Lợi ích cá nhân — không, họ chẳng được gì từ việc bạn ướt hay khô. Kết luận: nguồn đáng tin, nên hãy coi trọng dự báo, và đi hỏi <em>GIỜ MƯA và ĐỘ TO</em> như slide gợi ý thay vì cãi lại độ tin cậy của nguồn.</p>
<p class="meo">💡 Mẹo nhớ năm câu: <strong>AI · TIN · CHỨNG · CHUYÊN · LỢI</strong> — ai nói, có đáng tin, có bằng chứng, có chuyên môn, có lợi ích.</p>`],

      [7, 'Critical Thinking — why you need it at university (and: valid vs sound)',
        `<p class="y-chinh">🎯 Title in bold brown, <strong>Critical Thinking</strong>. The question <em>"Why do you need to use Critical thinking at university?"</em>, then the answer: <em>"Critical thinking is about questioning and learning with an open mind."</em> plus <strong>two</strong> "+" bullets: <em>Able to judge the quality of an argument and draw cautious yet evidence-based conclusions</em> · <em>Free from personal or societal bias</em>.</p>
<ul>
<li><strong>Two bullets, two different skills — and the exam treats them separately.</strong> Bullet 1 is about the <em>argument in front of you</em> (is it any good?). Bullet 2 is about <em>you</em> (am I judging it fairly?). Outward-facing and inward-facing. Slide 8's "crucial for self-reflection" is bullet 2 growing up.</li>
<li><strong>"Cautious yet evidence-based" is a carefully balanced phrase.</strong> <em>Cautious</em> means do not overclaim — prefer "the data suggest" to "this proves". <em>Evidence-based</em> means do not under-claim either — having weighed the evidence you must still conclude. Hedging everything is as bad as asserting everything.</li>
<li><strong>"Open mind" is not "no opinions".</strong> An open mind means your position is <em>revisable by evidence</em>. Someone who will change their view for nothing is closed; someone who has no view at all has not thought.</li>
</ul>
<p class="nhan">📌 Beyond the slide — the two words the exam loves: <strong>VALID</strong> and <strong>SOUND</strong></p>
<ul>
<li><strong>An argument = premises + a conclusion.</strong> Premises are the reasons offered; the conclusion is what they are offered for. Nothing else counts as an argument — a series of assertions with no conclusion is a description, and a conclusion with no premises is an opinion.</li>
<li><strong>VALID is about the FORM.</strong> An argument is valid when, <em>if</em> the premises were true, the conclusion would have to be true. Validity says nothing about whether the premises actually are true.</li>
<li><strong>SOUND is about form AND facts.</strong> An argument is sound when it is valid <em>and</em> all its premises are actually true. Sound is strictly stronger: every sound argument is valid, but not every valid argument is sound.</li>
</ul>
<table>
<tr><th>Argument</th><th>Valid?</th><th>Sound?</th><th>Why</th></tr>
<tr><td>All cats are mammals · Tom is a cat · ∴ Tom is a mammal</td><td>Yes</td><td>Yes</td><td>Form works, premises true</td></tr>
<tr><td>All birds can fly · A penguin is a bird · ∴ a penguin can fly</td><td><strong>Yes</strong></td><td><strong>No</strong></td><td>Perfect form, but premise 1 is false</td></tr>
<tr><td>Some students are late · Nam is a student · ∴ Nam is late</td><td>No</td><td>No</td><td>"Some" does not license the jump</td></tr>
<tr><td>It is raining now (looking out of the window) · ∴ it is raining</td><td>Yes</td><td>Yes</td><td>Trivially both</td></tr>
</table>
<p class="dap-an">✅ A valid but NOT sound argument, in student life: <em>"Every subject with a 60-minute multiple-choice final can be passed by memorising the slides. SSL101c has a 60-minute multiple-choice final. Therefore SSL101c can be passed by memorising the slides."</em> The form is watertight — but premise 1 is false (MOOC 3's deck is 15 slides and the exam draws on the whole MOOC), so the argument is valid and unsound, and acting on it costs you the subject.</p>
<p class="pitfall">⚠️ The classic exam trap: "A valid argument always has a true conclusion." <strong>False.</strong> Validity only promises the conclusion follows <em>if</em> the premises are true. Feed a valid form with a false premise and you get a false conclusion with a perfectly clean logical bill of health.</p>
<p class="meo">💡 Two words, one sentence: <strong>valid = the shape is right · sound = the shape is right AND the facts are right</strong>. In Vietnamese exams they appear as "hợp lệ" and "đúng đắn/vững chắc" — sound is the stronger one.</p>`,
        `<p class="y-chinh">🎯 Tiêu đề in đậm màu nâu, <strong>Critical Thinking</strong>. Câu hỏi <em>"Vì sao bạn cần dùng tư duy phản biện ở đại học?"</em>, rồi câu trả lời: <em>"Tư duy phản biện là việc chất vấn và học hỏi với một TÂM TRÍ CỞI MỞ."</em> cộng <strong>HAI</strong> gạch "+": <em>Có khả năng phán xét CHẤT LƯỢNG của một lập luận và rút ra kết luận THẬN TRỌNG nhưng DỰA TRÊN BẰNG CHỨNG</em> · <em>Thoát khỏi thiên kiến cá nhân hoặc xã hội</em>.</p>
<ul>
<li><strong>Hai gạch, hai kỹ năng khác nhau — và đề thi tách chúng ra.</strong> Gạch 1 nói về <em>lập luận đang nằm trước mặt bạn</em> (nó có tốt không?). Gạch 2 nói về <em>chính bạn</em> (mình có đang phán công bằng không?). Một hướng ra ngoài, một hướng vào trong. Câu "crucial for self-reflection" ở slide 8 chính là gạch 2 lớn lên.</li>
<li><strong>"Thận trọng nhưng dựa trên bằng chứng" là một cụm cân rất kỹ.</strong> <em>Thận trọng</em> nghĩa là đừng nói quá — nên viết "dữ liệu cho thấy" thay vì "điều này chứng minh". <em>Dựa trên bằng chứng</em> nghĩa là cũng đừng nói thiếu — cân xong bằng chứng thì bạn vẫn phải KẾT LUẬN. Rào đón mọi thứ cũng tệ ngang với khẳng định mọi thứ.</li>
<li><strong>"Tâm trí cởi mở" KHÔNG phải "không có quan điểm".</strong> Cởi mở nghĩa là quan điểm của bạn <em>SỬA ĐƯỢC BẰNG BẰNG CHỨNG</em>. Người không đổi quan điểm vì bất cứ điều gì là người đóng; người chẳng có quan điểm nào thì chưa hề suy nghĩ.</li>
</ul>
<p class="nhan">📌 Bổ sung ngoài slide — hai chữ đề thi rất thích: <strong>HỢP LỆ (valid)</strong> và <strong>ĐÚNG ĐẮN (sound)</strong></p>
<ul>
<li><strong>Một lập luận = các TIỀN ĐỀ + một KẾT LUẬN.</strong> Tiền đề là những lý do đưa ra; kết luận là thứ chúng được đưa ra để chống lưng. Ngoài ra không có gì được tính là lập luận — một chuỗi lời phán không có kết luận là bài MÔ TẢ, còn một kết luận không có tiền đề là một Ý KIẾN.</li>
<li><strong>HỢP LỆ nói về HÌNH THỨC.</strong> Một lập luận hợp lệ khi: <em>NẾU</em> các tiền đề đúng thì kết luận BẮT BUỘC phải đúng. Tính hợp lệ không nói gì về chuyện tiền đề có thật sự đúng hay không.</li>
<li><strong>ĐÚNG ĐẮN nói về HÌNH THỨC VÀ SỰ THẬT.</strong> Một lập luận đúng đắn khi nó hợp lệ <em>VÀ</em> mọi tiền đề của nó đều thật sự đúng. Đúng đắn mạnh hơn hẳn: mọi lập luận đúng đắn đều hợp lệ, nhưng không phải lập luận hợp lệ nào cũng đúng đắn.</li>
</ul>
<table>
<tr><th>Lập luận</th><th>Hợp lệ?</th><th>Đúng đắn?</th><th>Vì sao</th></tr>
<tr><td>Mọi con mèo là động vật có vú · Tom là mèo · ⇒ Tom là động vật có vú</td><td>Có</td><td>Có</td><td>Hình thức chuẩn, tiền đề đúng</td></tr>
<tr><td>Mọi loài chim đều bay được · Chim cánh cụt là chim · ⇒ chim cánh cụt bay được</td><td><strong>CÓ</strong></td><td><strong>KHÔNG</strong></td><td>Hình thức hoàn hảo, nhưng tiền đề 1 SAI</td></tr>
<tr><td>Một số sinh viên đi trễ · Nam là sinh viên · ⇒ Nam đi trễ</td><td>Không</td><td>Không</td><td>Chữ "một số" không cho phép bước nhảy đó</td></tr>
<tr><td>Bây giờ trời đang mưa (nhìn ra cửa sổ) · ⇒ trời đang mưa</td><td>Có</td><td>Có</td><td>Cả hai, một cách tầm thường</td></tr>
</table>
<p class="dap-an">✅ Một lập luận HỢP LỆ nhưng KHÔNG ĐÚNG ĐẮN, lấy ngay từ đời sinh viên: <em>"Mọi môn thi cuối kỳ trắc nghiệm 60 phút đều qua được bằng cách học thuộc slide. SSL101c thi cuối kỳ trắc nghiệm 60 phút. Vậy SSL101c qua được bằng cách học thuộc slide."</em> Hình thức kín như bưng — nhưng tiền đề 1 SAI (deck MOOC 3 chỉ có 15 slide còn đề thi lấy từ cả MOOC), nên lập luận này hợp lệ mà không đúng đắn, và làm theo nó thì mất môn.</p>
<p class="pitfall">⚠️ Bẫy kinh điển của đề thi: "Một lập luận hợp lệ thì luôn có kết luận đúng." <strong>SAI.</strong> Tính hợp lệ chỉ hứa rằng kết luận theo sau <em>NẾU</em> tiền đề đúng. Nhét một tiền đề sai vào một hình thức hợp lệ thì bạn có một kết luận SAI với giấy chứng nhận logic sạch bong.</p>
<p class="meo">💡 Hai chữ, một câu: <strong>hợp lệ = KHUNG đúng · đúng đắn = KHUNG đúng VÀ SỰ THẬT cũng đúng</strong>. Nhớ chiều bao hàm: đúng đắn ⇒ hợp lệ, chiều ngược lại thì không.</p>`],

      [8, 'Importance of Critical Thinking — four benefits (and: deduction, induction, abduction)',
        `<p class="y-chinh">🎯 Four lines, widely spaced, no bullet marks: <strong>Enhances language and presentation skills</strong> · <strong>Promotes creativity</strong> · <strong>Crucial for self-reflection</strong> · <strong>Foundation of science and democracy</strong>. Four — count them, because "how many benefits does the slide list?" is exactly the kind of item a 60-minute paper is made of.</p>
<table>
<tr><th>Benefit</th><th>The mechanism behind it</th><th>Where you feel it at FPTU</th></tr>
<tr><td><strong>Enhances language and presentation skills</strong></td><td>To defend a claim you must say precisely what you mean — vague thinking survives in vague sentences only</td><td>Defending an SWP391 design in front of a panel; writing an abstract that says something</td></tr>
<tr><td><strong>Promotes creativity</strong></td><td>Questioning assumptions frees the option space; most "no solution" situations are really unexamined constraints</td><td>"We must use MySQL" — says who? The assumption was never checked</td></tr>
<tr><td><strong>Crucial for self-reflection</strong></td><td>It turns the same evaluation you apply to others onto your own reasoning and motives</td><td>OJT reports, retrospectives, the slide-2 take-aways</td></tr>
<tr><td><strong>Foundation of science and democracy</strong></td><td>Both systems work by public reasons that anyone may check and overturn with evidence</td><td>Peer review, code review, and voting on anything in a team</td></tr>
</table>
<ul>
<li><strong>Benefit 1 is counter-intuitive and therefore examinable.</strong> You would expect thinking and speaking to be separate skills. The claim is that they are joined: the discipline of making an argument survivable forces precision, structure and signposting, which is the same thing a good presentation has.</li>
<li><strong>Benefit 2 corrects the most common misconception in the module.</strong> People imagine critical thinking as the enemy of creativity — one destroys, the other builds. The slide says the opposite, and MOOC 2 agreed: creative options appear when a fixed assumption is questioned. Expect a "critical thinking limits creativity — true or false?" item. The answer is <strong>false</strong>.</li>
<li><strong>Benefit 4 is the biggest claim on the slide, and it is meant literally.</strong> Science works because claims are testable and can be overturned by evidence; democracy works because decisions must be justified publicly and can be revised. Both collapse the moment "because I said so" is accepted. That is also the exact failure in slide 15's case, where a professor answers a data error with "that is just how science is".</li>
</ul>
<p class="nhan">📌 Beyond the slide — the three kinds of reasoning behind "foundation of science": <strong>deduction · induction · abduction</strong></p>
<table>
<tr><th></th><th>Deductive (diễn dịch)</th><th>Inductive (quy nạp)</th><th>Abductive (bỏ qua / suy luận tới lời giải thích tốt nhất)</th></tr>
<tr><td>Direction</td><td>General rule → specific case</td><td>Specific cases → general rule</td><td>Observation → the best explanation for it</td></tr>
<tr><td>If premises are true…</td><td>Conclusion is <strong>guaranteed</strong></td><td>Conclusion is <strong>probable</strong></td><td>Conclusion is <strong>plausible</strong>, and beatable by a better explanation</td></tr>
<tr><td>Judged by</td><td>Valid / invalid</td><td>Strong / weak</td><td>Best available / not best</td></tr>
<tr><td>Example</td><td>All PRF192 students must pass the PE · Lan is a PRF192 student · ∴ Lan must pass the PE</td><td>The last 40 builds after 6pm failed · ∴ builds after 6pm tend to fail</td><td>The build fails only after 6pm · the nightly job locks the DB at 6pm · ∴ the job is probably the cause</td></tr>
<tr><td>Typical home</td><td>Maths, logic, law, database rules</td><td>Empirical science, statistics, testing</td><td>Diagnosis, debugging, detective work, medicine</td></tr>
</table>
<ul>
<li><strong>Adding a premise can destroy an inductive argument but never a deductive one.</strong> "Every swan I have seen is white" dies the day a black swan walks past; "all humans are mortal, Socrates is human" cannot be damaged by new observations. That property — <em>defeasibility</em> — is the cleanest way to tell induction from deduction.</li>
<li><strong>Debugging is abduction, and naming it changes how you do it.</strong> The best explanation is provisional: you must list rival explanations and rule them out, not stop at the first story that fits. A bug "explained" by one plausible story and never tested is abduction done badly.</li>
</ul>
<p class="dap-an">✅ Classify quickly: (a) "Three classmates who skipped lectures failed, so skipping lectures causes failure" → <strong>inductive</strong>, and weak (tiny sample, plus a causal leap — see slide 9). (b) "Every student with under 80% attendance is barred; Minh has 70%; so Minh is barred" → <strong>deductive</strong>, valid. (c) "The server is slow only when the report job runs, so the job is likely the cause" → <strong>abductive</strong>, and it must beat rival explanations before you act.</p>
<p class="meo">💡 Three words: deduction <strong>guarantees</strong>, induction <strong>generalises</strong>, abduction <strong>explains</strong>. And the four slide benefits in four words: <strong>ngôn ngữ · sáng tạo · phản tư · khoa học và dân chủ</strong>.</p>`,
        `<p class="y-chinh">🎯 Bốn dòng, giãn cách rộng, không có dấu đầu dòng: <strong>Enhances language and presentation skills</strong> (nâng kỹ năng ngôn ngữ và thuyết trình) · <strong>Promotes creativity</strong> (thúc đẩy sáng tạo) · <strong>Crucial for self-reflection</strong> (thiết yếu cho tự phản tư) · <strong>Foundation of science and democracy</strong> (nền tảng của khoa học và dân chủ). BỐN — hãy đếm, vì "slide liệt kê bao nhiêu lợi ích?" đúng là loại câu làm nên một bài thi 60 phút.</p>
<table>
<tr><th>Lợi ích</th><th>Cơ chế phía sau</th><th>Bạn thấy nó ở đâu tại FPTU</th></tr>
<tr><td><strong>Nâng kỹ năng ngôn ngữ và thuyết trình</strong></td><td>Muốn bảo vệ một luận điểm, bạn buộc phải nói CHÍNH XÁC điều mình nghĩ — tư duy mơ hồ chỉ sống được trong câu văn mơ hồ</td><td>Bảo vệ thiết kế SWP391 trước hội đồng; viết một abstract thật sự nói được điều gì đó</td></tr>
<tr><td><strong>Thúc đẩy sáng tạo</strong></td><td>Chất vấn giả định làm bung không gian lựa chọn; phần lớn tình huống "bó tay" thật ra là những ràng buộc chưa ai kiểm lại</td><td>"Bắt buộc phải dùng MySQL" — ai bảo thế? Giả định đó chưa từng được kiểm</td></tr>
<tr><td><strong>Thiết yếu cho tự phản tư</strong></td><td>Nó quay chính phép đánh giá bạn dùng với người khác vào lập luận và động cơ của bản thân</td><td>Báo cáo OJT, retrospective, và ba take-away ở slide 2</td></tr>
<tr><td><strong>Nền tảng của khoa học và dân chủ</strong></td><td>Cả hai hệ thống chạy bằng những LÝ DO CÔNG KHAI mà ai cũng kiểm được và lật được bằng bằng chứng</td><td>Bình duyệt, review code, và mọi lần biểu quyết trong nhóm</td></tr>
</table>
<ul>
<li><strong>Lợi ích 1 đi ngược trực giác nên rất dễ bị hỏi.</strong> Bạn sẽ tưởng tư duy và diễn đạt là hai kỹ năng rời nhau. Slide khẳng định chúng dính nhau: kỷ luật làm cho một lập luận sống sót được ép bạn phải chính xác, có cấu trúc và có dẫn dắt — đúng những thứ làm nên một bài thuyết trình tốt.</li>
<li><strong>Lợi ích 2 sửa hiểu lầm phổ biến nhất của module.</strong> Người ta hình dung tư duy phản biện là kẻ thù của sáng tạo — một bên phá, một bên xây. Slide nói ngược lại, và MOOC 2 cũng đồng ý: phương án sáng tạo xuất hiện ĐÚNG LÚC một giả định cố định bị chất vấn. Hãy chờ câu "tư duy phản biện làm hạn chế sáng tạo — đúng hay sai?". Đáp án là <strong>SAI</strong>.</li>
<li><strong>Lợi ích 4 là khẳng định lớn nhất trên slide, và nó được nói theo nghĩa đen.</strong> Khoa học chạy được vì mọi khẳng định đều kiểm được và lật được bằng bằng chứng; dân chủ chạy được vì mọi quyết định phải được biện minh công khai và sửa được. Cả hai sụp đổ ngay khoảnh khắc "vì tôi nói thế" được chấp nhận. Đó cũng đúng là chỗ hỏng trong tình huống slide 15, nơi một giáo sư trả lời một lỗi dữ liệu bằng câu "khoa học nó vậy đó".</li>
</ul>
<p class="nhan">📌 Bổ sung ngoài slide — ba kiểu suy luận nằm sau chữ "nền tảng của khoa học": <strong>diễn dịch · quy nạp · bỏ qua</strong></p>
<table>
<tr><th></th><th>Diễn dịch (deductive)</th><th>Quy nạp (inductive)</th><th>Bỏ qua / suy tới lời giải thích tốt nhất (abductive)</th></tr>
<tr><td>Chiều đi</td><td>Quy tắc chung → trường hợp cụ thể</td><td>Các trường hợp cụ thể → quy tắc chung</td><td>Quan sát → lời giải thích tốt nhất cho nó</td></tr>
<tr><td>Nếu tiền đề đúng thì…</td><td>Kết luận được <strong>BẢO ĐẢM</strong></td><td>Kết luận chỉ <strong>CÓ XÁC SUẤT</strong></td><td>Kết luận <strong>HỢP LÝ</strong>, và bị đánh bại bởi lời giải thích tốt hơn</td></tr>
<tr><td>Được phán bằng</td><td>Hợp lệ / không hợp lệ</td><td>Mạnh / yếu</td><td>Tốt nhất hiện có / chưa phải tốt nhất</td></tr>
<tr><td>Ví dụ</td><td>Mọi sinh viên PRF192 phải qua bài PE · Lan là sinh viên PRF192 · ⇒ Lan phải qua bài PE</td><td>40 lần build sau 18h gần nhất đều hỏng · ⇒ build sau 18h có xu hướng hỏng</td><td>Build chỉ hỏng sau 18h · job chạy đêm khoá CSDL lúc 18h · ⇒ nhiều khả năng job đó là nguyên nhân</td></tr>
<tr><td>Hay gặp ở</td><td>Toán, logic, luật, ràng buộc CSDL</td><td>Khoa học thực nghiệm, thống kê, kiểm thử</td><td>Chẩn đoán, gỡ lỗi, điều tra, y học</td></tr>
</table>
<ul>
<li><strong>Thêm một tiền đề có thể GIẾT một lập luận quy nạp nhưng không bao giờ giết được lập luận diễn dịch.</strong> "Mọi con thiên nga tôi từng thấy đều trắng" chết vào ngày một con thiên nga đen đi ngang; còn "mọi người đều phải chết, Socrates là người" thì không quan sát mới nào làm sứt mẻ được. Tính chất đó — <em>có thể bị bác</em> — là cách sạch nhất để phân biệt quy nạp với diễn dịch.</li>
<li><strong>Gỡ lỗi chính là suy luận BỎ QUA, và gọi đúng tên nó làm đổi cách bạn gỡ.</strong> Lời giải thích tốt nhất luôn là tạm thời: bạn phải liệt kê các giải thích ĐỐI THỦ và loại chúng, chứ không dừng lại ở câu chuyện đầu tiên nghe lọt tai. Một con bug được "giải thích" bằng một câu chuyện hợp lý mà chưa ai kiểm là suy luận bỏ qua làm ẩu.</li>
</ul>
<p class="dap-an">✅ Phân loại nhanh: (a) "Ba bạn cùng lớp bỏ tiết đều rớt, vậy bỏ tiết gây ra rớt môn" → <strong>quy nạp</strong>, và yếu (mẫu bé xíu, cộng thêm một bước nhảy nhân quả — xem slide 9). (b) "Mọi sinh viên dưới 80% chuyên cần bị cấm thi; Minh 70%; vậy Minh bị cấm thi" → <strong>diễn dịch</strong>, hợp lệ. (c) "Server chỉ chậm khi job báo cáo chạy, vậy nhiều khả năng job là nguyên nhân" → <strong>bỏ qua</strong>, và nó phải thắng được các giải thích đối thủ trước khi bạn ra tay.</p>
<p class="meo">💡 Ba chữ: diễn dịch <strong>BẢO ĐẢM</strong>, quy nạp <strong>KHÁI QUÁT</strong>, bỏ qua <strong>GIẢI THÍCH</strong>. Và bốn lợi ích của slide gói trong bốn từ: <strong>ngôn ngữ · sáng tạo · phản tư · khoa học và dân chủ</strong>.</p>`],

      [9, '5W1H Method — the "6 critical questions" poster (and: ten common fallacies)',
        `<p class="y-chinh">🎯 Title <strong>"5W1H Method"</strong> over a pasted colour poster headed <em>"6 critical questions — things to think about when someone has something to say"</em> (critical thinking asylum, Copyright © 2009). Six coloured bands: <strong>who · what · where · when · why · how</strong>, each with two or three sub-questions.</p>
<table>
<tr><th>Question</th><th>The poster's own sub-questions</th></tr>
<tr><td><strong>Who</strong> said it?</td><td>Someone you know? Someone famous? Someone in authority? <em>Should it matter who said it?</em></td></tr>
<tr><td><strong>What</strong> did they say?</td><td>Did they give facts or opinions? Did they give all the facts? Did they leave something out?</td></tr>
<tr><td><strong>Where</strong> did they say it?</td><td>Was it in public or in private? Did other people have a chance to talk about the other side?</td></tr>
<tr><td><strong>When</strong> did they say it?</td><td>Before, after, or during an important event?</td></tr>
<tr><td><strong>Why</strong> did they say it?</td><td>Did they explain their opinions? Were they trying to make someone look good or bad?</td></tr>
<tr><td><strong>How</strong> did they say it?</td><td>Were they happy, sad, angry, or didn't care? Did they write it or speak it? Could you understand it?</td></tr>
</table>
<ul>
<li><strong>Six questions, and the title calls it 5W1H: five W-words plus How.</strong> No contradiction, but the numbers "5" and "6" sit on the same slide, so read exam options carefully — the method has <strong>six</strong> questions in total.</li>
<li><strong>"Should it matter who said it?" is the sharpest line on the poster.</strong> It cuts both ways: dismissing a claim because of who said it is <em>ad hominem</em>; accepting one because of who said it is <em>appeal to authority</em>. Source matters for deciding how much checking is needed — it never settles truth by itself.</li>
<li><strong>"Did they leave something out?" is the hardest question to ask, because absence is invisible.</strong> A report that shows only the months where the numbers looked good is not lying about any single figure. Look for the missing comparison, the missing time range, the missing control group.</li>
<li><strong>"When" is the timing question that catches spin.</strong> A statement made <em>after</em> results are known, or <em>during</em> a crisis, carries different weight from the same words said in advance. In a project retrospective, "I always said that architecture was wrong" is worth checking against the meeting notes.</li>
<li><strong>Compared with slide 6's five questions, 5W1H covers the message and the setting, not just the source.</strong> Slide 6 asks mostly <em>who and how reliable</em>; 5W1H adds <em>what was left out</em>, <em>where it was said</em>, <em>when</em> and <em>in what tone</em>. Keep the two lists separate in memory: 5 questions (slide 6) vs 6 questions (slide 9).</li>
</ul>
<p class="nhan">📌 Beyond the slide — the fallacies you must be able to name (learning outcome 4). A <strong>fallacy</strong> is an argument that <em>looks</em> like it supports its conclusion but does not.</p>
<table>
<tr><th>Fallacy</th><th>The move it makes</th><th>Student-life example</th></tr>
<tr><td><strong>Ad hominem</strong> (công kích cá nhân)</td><td>Attacks the person instead of the argument</td><td>"Your refactor plan is rubbish — you failed PRF192 last term."</td></tr>
<tr><td><strong>Straw man</strong> (người rơm)</td><td>Refutes a weakened, distorted version of the claim</td><td>"You want code review? So you think nobody in this team can be trusted."</td></tr>
<tr><td><strong>False dilemma</strong> (lưỡng nan giả)</td><td>Offers two options when more exist</td><td>"Either we ship tonight without tests, or we fail the subject."</td></tr>
<tr><td><strong>Bandwagon</strong> (vin vào số đông)</td><td>Treats popularity as proof</td><td>"Everyone in class uses this framework, so it is the right choice."</td></tr>
<tr><td><strong>Appeal to authority</strong> (vin vào uy tín)</td><td>Cites a figure whose authority does not cover the claim, or cites authority instead of evidence</td><td>"A famous CEO tweeted that ORMs are dead, so we drop Prisma."</td></tr>
<tr><td><strong>Circular reasoning</strong> (lập luận vòng tròn)</td><td>The conclusion is smuggled in as a premise</td><td>"This design is best because no better design exists."</td></tr>
<tr><td><strong>Slippery slope</strong> (dốc trượt)</td><td>Claims one small step must lead to an extreme end, with no link shown</td><td>"If we allow one deadline extension, nobody will ever submit on time again."</td></tr>
<tr><td><strong>False cause</strong> (nhân quả giả)</td><td>Treats sequence or correlation as causation</td><td>"Grades rose after we bought new monitors, so the monitors raised grades."</td></tr>
<tr><td><strong>Hasty generalisation</strong> (khái quát vội)</td><td>Generalises from a sample far too small or unrepresentative</td><td>"Two seniors said the OJT company is bad, so all its interns suffer."</td></tr>
<tr><td><strong>Equivocation</strong> (lập lờ nước đôi)</td><td>One word shifts meaning mid-argument</td><td>"Tests prove the code is correct" — a passing <em>test suite</em> is not a mathematical <em>proof</em>.</td></tr>
</table>
<p class="dap-an">✅ Name the fallacy: (a) "Don't listen to her about the schedule, she's only a second-year." → <strong>ad hominem</strong>. (b) "Either you memorise every slide or you fail." → <strong>false dilemma</strong>. (c) "Attendance went up the week we changed the room, so the room did it." → <strong>false cause</strong>. (d) "Everyone stayed up all night before the PE, so it must work." → <strong>bandwagon</strong> (plus survivorship bias — see slide 10).</p>
<p class="pitfall">⚠️ Spotting a fallacy does <strong>not</strong> prove the conclusion false. "You argued badly" and "you are wrong" are different findings. Treating a bad argument as a refuted conclusion is itself a fallacy (the fallacy fallacy) — and in an essay it reads as point-scoring, which costs marks.</p>`,
        `<p class="y-chinh">🎯 Tiêu đề <strong>"5W1H Method"</strong> nằm trên một poster màu dán vào, tựa đề <em>"6 critical questions — things to think about when someone has something to say"</em> (critical thinking asylum, Copyright © 2009). Sáu dải màu: <strong>who · what · where · when · why · how</strong>, mỗi dải kèm hai ba câu hỏi con.</p>
<table>
<tr><th>Câu hỏi</th><th>Câu hỏi con đúng theo poster</th></tr>
<tr><td><strong>Who</strong> — AI nói?</td><td>Người bạn quen? Người nổi tiếng? Người có chức quyền? <em>Chuyện AI nói có nên quan trọng không?</em></td></tr>
<tr><td><strong>What</strong> — họ nói GÌ?</td><td>Họ đưa sự kiện hay ý kiến? Họ đưa ĐỦ sự kiện chưa? Họ có bỏ sót gì không?</td></tr>
<tr><td><strong>Where</strong> — họ nói Ở ĐÂU?</td><td>Nói công khai hay riêng tư? Người khác có cơ hội nói phía bên kia không?</td></tr>
<tr><td><strong>When</strong> — họ nói KHI NÀO?</td><td>Trước, sau, hay trong lúc một sự kiện quan trọng?</td></tr>
<tr><td><strong>Why</strong> — TẠI SAO họ nói?</td><td>Họ có giải thích quan điểm không? Họ có đang cố làm ai đó đẹp lên hay xấu đi?</td></tr>
<tr><td><strong>How</strong> — họ nói NHƯ THẾ NÀO?</td><td>Vui, buồn, giận, hay bất cần? Họ viết ra hay nói miệng? Bạn có hiểu được không?</td></tr>
</table>
<ul>
<li><strong>Sáu câu hỏi, mà tiêu đề gọi là 5W1H: năm chữ W cộng chữ How.</strong> Không mâu thuẫn, nhưng con số "5" và "6" nằm cùng một slide, nên hãy đọc kỹ phương án thi — phương pháp này có tổng cộng <strong>SÁU</strong> câu hỏi.</li>
<li><strong>"Chuyện AI nói có nên quan trọng không?" là dòng sắc nhất trên poster.</strong> Nó cắt cả hai chiều: gạt một khẳng định VÌ ai nói là <em>công kích cá nhân</em>; chấp nhận một khẳng định VÌ ai nói là <em>vin vào uy tín</em>. Nguồn quan trọng ở chỗ quyết định bạn phải kiểm kỹ tới đâu — nó không bao giờ tự mình phán được đúng sai.</li>
<li><strong>"Họ có bỏ sót gì không?" là câu khó hỏi nhất, vì thứ VẮNG MẶT thì vô hình.</strong> Một báo cáo chỉ trưng những tháng có số đẹp thì không nói dối ở bất kỳ con số nào cả. Hãy tìm phép SO SÁNH bị thiếu, KHOẢNG THỜI GIAN bị cắt, NHÓM ĐỐI CHỨNG bị bỏ.</li>
<li><strong>"When" là câu hỏi về THỜI ĐIỂM, và nó bắt được trò xoay chuyện.</strong> Một phát biểu đưa ra <em>SAU</em> khi đã biết kết quả, hoặc <em>TRONG</em> lúc khủng hoảng, có sức nặng khác hẳn cũng chừng ấy chữ nói TRƯỚC. Trong buổi retrospective, câu "tôi đã bảo kiến trúc đó sai ngay từ đầu mà" rất đáng đem đối chiếu với biên bản họp.</li>
<li><strong>So với năm câu ở slide 6, 5W1H phủ cả THÔNG ĐIỆP và BỐI CẢNH chứ không chỉ NGUỒN.</strong> Slide 6 hỏi chủ yếu <em>ai và có đáng tin không</em>; 5W1H thêm <em>họ bỏ sót gì</em>, <em>nói ở đâu</em>, <em>nói khi nào</em> và <em>bằng giọng gì</em>. Giữ hai danh sách tách bạch trong đầu: 5 câu (slide 6) và 6 câu (slide 9).</li>
</ul>
<p class="nhan">📌 Bổ sung ngoài slide — những nguỵ biện bạn phải gọi được tên (chuẩn đầu ra 4). <strong>Nguỵ biện</strong> là lập luận <em>TRÔNG như</em> chống lưng được cho kết luận của nó nhưng thật ra thì không.</p>
<table>
<tr><th>Nguỵ biện</th><th>Nước đi của nó</th><th>Ví dụ trong đời sinh viên</th></tr>
<tr><td><strong>Công kích cá nhân</strong> (ad hominem)</td><td>Đánh vào NGƯỜI thay vì đánh vào LẬP LUẬN</td><td>"Kế hoạch refactor của mày vứt đi — kỳ trước mày rớt PRF192 mà."</td></tr>
<tr><td><strong>Người rơm</strong> (straw man)</td><td>Bác bỏ một phiên bản đã bị bóp méo cho yếu đi</td><td>"Mày đòi review code à? Vậy ra mày nghĩ cả nhóm này không ai đáng tin chứ gì."</td></tr>
<tr><td><strong>Lưỡng nan giả</strong> (false dilemma)</td><td>Bày ra hai lựa chọn trong khi còn nhiều lựa chọn khác</td><td>"Hoặc tối nay ship không test, hoặc cả nhóm rớt môn."</td></tr>
<tr><td><strong>Vin vào số đông</strong> (bandwagon)</td><td>Coi sự phổ biến là bằng chứng</td><td>"Cả lớp đều dùng framework này, vậy nó là lựa chọn đúng."</td></tr>
<tr><td><strong>Vin vào uy tín</strong> (appeal to authority)</td><td>Dẫn một nhân vật mà uy tín không phủ tới chủ đề đó, hoặc lấy uy tín THAY cho bằng chứng</td><td>"Một CEO nổi tiếng tweet rằng ORM đã chết, vậy bỏ Prisma đi."</td></tr>
<tr><td><strong>Lập luận vòng tròn</strong> (circular reasoning)</td><td>Tuồn chính kết luận vào làm tiền đề</td><td>"Thiết kế này tốt nhất vì không có thiết kế nào tốt hơn."</td></tr>
<tr><td><strong>Dốc trượt</strong> (slippery slope)</td><td>Khẳng định một bước nhỏ tất yếu dẫn tới một kết cục cực đoan, không chứng minh mắt xích</td><td>"Cho gia hạn một lần là từ nay chẳng đứa nào nộp đúng hạn nữa."</td></tr>
<tr><td><strong>Nhân quả giả</strong> (false cause)</td><td>Coi thứ tự trước-sau hoặc tương quan là quan hệ nhân quả</td><td>"Điểm tăng sau khi mua màn hình mới, vậy màn hình làm điểm tăng."</td></tr>
<tr><td><strong>Khái quát vội</strong> (hasty generalisation)</td><td>Khái quát từ mẫu quá nhỏ hoặc không đại diện</td><td>"Hai anh khoá trên bảo công ty OJT đó tệ, vậy thực tập sinh nào vào đó cũng khổ."</td></tr>
<tr><td><strong>Lập lờ nước đôi</strong> (equivocation)</td><td>Một từ đổi nghĩa giữa chừng lập luận</td><td>"Test đã CHỨNG MINH code đúng" — một bộ test PASS không phải một phép CHỨNG MINH toán học.</td></tr>
</table>
<p class="dap-an">✅ Gọi tên nguỵ biện: (a) "Đừng nghe nó nói chuyện tiến độ, nó mới năm hai thôi." → <strong>công kích cá nhân</strong>. (b) "Hoặc học thuộc từng slide, hoặc rớt." → <strong>lưỡng nan giả</strong>. (c) "Chuyên cần tăng đúng tuần đổi phòng, vậy cái phòng làm nên chuyện." → <strong>nhân quả giả</strong>. (d) "Ai cũng thức trắng đêm trước PE, chắc chắn cách đó hiệu quả." → <strong>vin vào số đông</strong> (cộng thêm thiên kiến sống sót — xem slide 10).</p>
<p class="pitfall">⚠️ Bắt được một nguỵ biện <strong>KHÔNG</strong> chứng minh kết luận là sai. "Anh lập luận dở" và "anh sai" là hai kết luận khác nhau. Coi một lập luận hỏng là một kết luận đã bị bác bỏ thì chính điều đó lại là một nguỵ biện (nguỵ biện về nguỵ biện) — và trong bài viết nó đọc lên như kiểu ăn thua đủ, làm mất điểm.</p>`],

      [10, '5W1H in Vietnamese — a pasted infographic (and: the four cognitive biases)',
        `<p class="y-chinh">🎯 A full-page cartoon infographic in <strong>Vietnamese</strong>, headed <em>"PHƯƠNG PHÁP 5W1H"</em>, with six orange boxes and blue arrows: <strong>What? (Cái gì?) · When? (Khi nào) · Where? (Ở đâu) · Why? (Tại sao) · Who? (Ai) · How? (Như thế nào)</strong>. No Sydney branding — this one was added by the lecturer, and it is the only Vietnamese slide in the deck.</p>
<table>
<tr><th>Box</th><th>The infographic's own sub-questions (Vietnamese original)</th></tr>
<tr><td><strong>What? (Cái gì?)</strong></td><td>Cái đó là gì? · Nó đề cập đến vấn đề gì?</td></tr>
<tr><td><strong>When? (Khi nào)</strong></td><td>Khái niệm này có từ khi nào? · Chuyện này bắt đầu từ bao giờ?</td></tr>
<tr><td><strong>Where? (Ở đâu)</strong></td><td>Sự kiện này diễn ra ở đâu? · Sách này mua ở chỗ nào?</td></tr>
<tr><td><strong>Why? (Tại sao)</strong></td><td>Tại sao nó thất bại? · Tại sao lại sắp xếp như vậy?</td></tr>
<tr><td><strong>Who? (Ai)</strong></td><td>Ai đã nghiên cứu vấn đề này? · Ai phụ trách dự án này?</td></tr>
<tr><td><strong>How? (Như thế nào)</strong></td><td>Dự án này sẽ tiêu tốn bao nhiêu? · Chiến dịch sẽ bắt đầu thế nào?</td></tr>
</table>
<ul>
<li><strong>Same six questions as slide 9, different order — and that is the point worth noticing.</strong> Slide 9 runs <em>who · what · where · when · why · how</em>; this one runs <em>What · When · Where · Why · Who · How</em>. Learn the <strong>set of six</strong>, never the sequence, because two slides in the same deck disagree about the sequence.</li>
<li><strong>The two versions also aim at different things.</strong> Slide 9's poster interrogates <em>a speaker</em> ("when someone has something to say"). This one interrogates <em>a topic or project</em> — who is responsible, how much will it cost, when did it start. Same six words, one used for evaluating claims, the other for scoping work.</li>
<li><strong>Which makes it the natural bridge to project work.</strong> Run these six at the start of any SWP391/SWR302 document and most of the "we misunderstood the requirement" failures disappear before they happen: what exactly, for whom, by when, where deployed, why this way, how measured.</li>
<li><strong>Be honest about provenance.</strong> The style, the language and the cartoon art say this is not University of Sydney material. That does not make it wrong — but by the module's own rule (slide 6, question 1: who said or wrote it?), an uncredited pasted image is a source you cannot check. Applying the slide's method to the slide itself is a fair exercise.</li>
</ul>
<p class="nhan">📌 Beyond the slide — <strong>cognitive bias</strong>, the second bullet of slide 7 and half of learning outcome 4. A bias is not a bad argument; it is a systematic tilt in how you gather and weigh evidence, and it operates before any argument gets written.</p>
<table>
<tr><th>Bias</th><th>What it does</th><th>A real example you can check</th></tr>
<tr><td><strong>Confirmation bias</strong> (thiên kiến xác nhận)</td><td>You search for, notice and remember evidence that fits what you already believe, and skim past the rest</td><td>You decided the bug is in the frontend, so you read frontend logs for two hours and never open the server log — which has the answer on line 3.</td></tr>
<tr><td><strong>Anchoring</strong> (thiên kiến neo)</td><td>The first number or idea you meet drags every later judgement toward it</td><td>A teammate estimates "about 3 days" for a task. Every later estimate in the meeting lands at 2–4 days, although nobody has broken the task down.</td></tr>
<tr><td><strong>Survivorship bias</strong> (thiên kiến sống sót)</td><td>You study only the cases that made it through, because the failures are invisible</td><td>"Dropping out worked for famous founders." The ones who dropped out and failed did not get interviewed. Same error: "everyone who crammed all night passed" — you never meet the ones who crammed and failed.</td></tr>
<tr><td><strong>Dunning-Kruger effect</strong></td><td>With little skill you cannot see what you are missing, so confidence outruns competence; with real expertise, confidence often drops</td><td>After one HTML tutorial a student rewrites the team's layout in an afternoon "because it is easy" and breaks responsive behaviour on every page.</td></tr>
</table>
<ul>
<li><strong>Bias and fallacy are not the same thing, and the exam can ask you to separate them.</strong> A <em>fallacy</em> is a defect in the argument on the page; a <em>bias</em> is a defect in the thinker, upstream of the page. You fix a fallacy by rewriting; you fix a bias by changing your process — asking someone to disagree, estimating before hearing someone else's number, going looking for the failures.</li>
<li><strong>The countermeasure that works for all four is the same: go looking for what would prove you wrong.</strong> Write down, before you research, what evidence would change your mind. If nothing would, you are not investigating — you are collecting ammunition.</li>
</ul>
<p class="dap-an">✅ Name the bias: (a) You only quote the three papers that support your thesis and leave out the two that do not → <strong>confirmation bias</strong>. (b) The whole team plans around the first deadline someone said out loud → <strong>anchoring</strong>. (c) "Every startup in this magazine succeeded without a business plan" → <strong>survivorship bias</strong>. (d) A first-year insists the senior's architecture is "obviously over-engineered" after one course → <strong>Dunning-Kruger</strong>.</p>
<p class="meo">💡 Memory hook: the six questions are a <strong>set</strong>, not a sequence (slides 9 and 10 order them differently); the four biases are <strong>xác nhận · neo · sống sót · Dunning-Kruger</strong>.</p>`,
        `<p class="y-chinh">🎯 Một infographic vẽ tay chiếm trọn trang, <strong>TIẾNG VIỆT</strong>, tựa đề <em>"PHƯƠNG PHÁP 5W1H"</em>, sáu ô cam và các mũi tên xanh: <strong>What? (Cái gì?) · When? (Khi nào) · Where? (Ở đâu) · Why? (Tại sao) · Who? (Ai) · How? (Như thế nào)</strong>. Không có nhận diện của Sydney — slide này do giảng viên chèn thêm, và là slide tiếng Việt DUY NHẤT của cả deck.</p>
<table>
<tr><th>Ô</th><th>Câu hỏi con đúng theo infographic</th></tr>
<tr><td><strong>What? (Cái gì?)</strong></td><td>Cái đó là gì? · Nó đề cập đến vấn đề gì?</td></tr>
<tr><td><strong>When? (Khi nào)</strong></td><td>Khái niệm này có từ khi nào? · Chuyện này bắt đầu từ bao giờ?</td></tr>
<tr><td><strong>Where? (Ở đâu)</strong></td><td>Sự kiện này diễn ra ở đâu? · Sách này mua ở chỗ nào?</td></tr>
<tr><td><strong>Why? (Tại sao)</strong></td><td>Tại sao nó thất bại? · Tại sao lại sắp xếp như vậy?</td></tr>
<tr><td><strong>Who? (Ai)</strong></td><td>Ai đã nghiên cứu vấn đề này? · Ai phụ trách dự án này?</td></tr>
<tr><td><strong>How? (Như thế nào)</strong></td><td>Dự án này sẽ tiêu tốn bao nhiêu? · Chiến dịch sẽ bắt đầu thế nào?</td></tr>
</table>
<ul>
<li><strong>Vẫn sáu câu hỏi như slide 9, nhưng THỨ TỰ KHÁC — và đó mới là điều đáng để ý.</strong> Slide 9 chạy <em>who · what · where · when · why · how</em>; slide này chạy <em>What · When · Where · Why · Who · How</em>. Hãy thuộc <strong>BỘ SÁU</strong>, đừng bao giờ thuộc thứ tự, vì hai slide trong cùng một deck đã không thống nhất về thứ tự.</li>
<li><strong>Hai phiên bản còn nhắm vào hai thứ khác nhau.</strong> Poster slide 9 tra vấn <em>MỘT NGƯỜI NÓI</em> ("khi ai đó có điều muốn nói"). Cái này tra vấn <em>MỘT CHỦ ĐỀ hay MỘT DỰ ÁN</em> — ai chịu trách nhiệm, tốn bao nhiêu, bắt đầu từ bao giờ. Cùng sáu chữ, một bên dùng để đánh giá khẳng định, một bên dùng để khoanh phạm vi công việc.</li>
<li><strong>Nhờ vậy nó thành cây cầu tự nhiên sang việc làm đồ án.</strong> Chạy sáu câu này ở đầu mọi tài liệu SWP391/SWR302 thì phần lớn thất bại kiểu "cả nhóm hiểu sai yêu cầu" biến mất trước khi kịp xảy ra: chính xác là cái gì, cho ai, hạn khi nào, triển khai ở đâu, tại sao chọn cách này, đo bằng gì.</li>
<li><strong>Hãy sòng phẳng về XUẤT XỨ.</strong> Phong cách, ngôn ngữ và nét vẽ đều nói rằng đây không phải tài liệu của University of Sydney. Điều đó không làm nó sai — nhưng theo đúng luật của chính module (slide 6, câu 1: ai nói hoặc viết ra?), một ảnh dán không ghi nguồn là một nguồn bạn không kiểm được. Đem phương pháp của slide áp ngược vào chính slide là một bài tập hoàn toàn chính đáng.</li>
</ul>
<p class="nhan">📌 Bổ sung ngoài slide — <strong>THIÊN KIẾN NHẬN THỨC</strong>, tức gạch thứ hai của slide 7 và một nửa chuẩn đầu ra 4. Thiên kiến không phải lập luận hỏng; nó là một ĐỘ NGHIÊNG CÓ HỆ THỐNG trong cách bạn thu thập và cân bằng chứng, và nó hoạt động TRƯỚC khi bất kỳ lập luận nào được viết ra.</p>
<table>
<tr><th>Thiên kiến</th><th>Nó làm gì</th><th>Một ví dụ thật, kiểm được</th></tr>
<tr><td><strong>Thiên kiến xác nhận</strong> (confirmation bias)</td><td>Bạn đi tìm, để ý và nhớ những bằng chứng KHỚP với điều mình vốn đã tin, còn lại thì lướt qua</td><td>Bạn đã kết luận bug nằm ở frontend, nên đọc log frontend suốt hai tiếng và không hề mở log server — nơi câu trả lời nằm ngay dòng thứ 3.</td></tr>
<tr><td><strong>Thiên kiến neo</strong> (anchoring)</td><td>Con số hay ý tưởng ĐẦU TIÊN bạn gặp kéo mọi phán đoán sau đó về phía nó</td><td>Một bạn ước lượng "khoảng 3 ngày" cho một task. Mọi ước lượng sau đó trong buổi họp đều rơi vào 2–4 ngày, dù chưa ai bóc tách task ra cả.</td></tr>
<tr><td><strong>Thiên kiến sống sót</strong> (survivorship bias)</td><td>Bạn chỉ khảo sát những trường hợp đã ĐI QUA ĐƯỢC, vì những ca thất bại thì vô hình</td><td>"Bỏ học mà vẫn thành công đấy thôi." Những người bỏ học rồi thất bại thì không ai đi phỏng vấn. Cùng một lỗi: "ai thức trắng đêm cũng qua PE" — bạn không bao giờ gặp những người thức trắng rồi rớt.</td></tr>
<tr><td><strong>Hiệu ứng Dunning-Kruger</strong></td><td>Khi kỹ năng còn ít, bạn không thấy được thứ mình đang thiếu, nên sự tự tin vượt xa năng lực; khi thật sự giỏi thì tự tin lại thường giảm</td><td>Sau một khoá HTML, một sinh viên viết lại layout của cả nhóm trong một buổi chiều "vì nó dễ mà" và làm hỏng responsive trên mọi trang.</td></tr>
</table>
<ul>
<li><strong>Thiên kiến và nguỵ biện KHÔNG phải một thứ, và đề thi có thể bắt bạn tách chúng ra.</strong> <em>Nguỵ biện</em> là khiếm khuyết nằm trong lập luận trên giấy; <em>thiên kiến</em> là khiếm khuyết nằm trong người nghĩ, ở phía thượng nguồn của tờ giấy. Sửa nguỵ biện bằng cách viết lại; sửa thiên kiến bằng cách đổi QUY TRÌNH — nhờ người khác phản đối, tự ước lượng trước khi nghe con số của người kia, chủ động đi tìm những ca thất bại.</li>
<li><strong>Thuốc giải cho cả bốn là một: đi tìm thứ sẽ chứng minh bạn SAI.</strong> Trước khi tra cứu, hãy viết ra: bằng chứng nào sẽ làm tôi đổi ý? Nếu không có bằng chứng nào làm bạn đổi ý, thì bạn không đang điều tra — bạn đang gom đạn.</li>
</ul>
<p class="dap-an">✅ Gọi tên thiên kiến: (a) Bạn chỉ trích ba bài báo ủng hộ luận điểm của mình và bỏ hai bài phản bác → <strong>thiên kiến xác nhận</strong>. (b) Cả nhóm lên kế hoạch xoay quanh cái hạn đầu tiên có người nói ra miệng → <strong>thiên kiến neo</strong>. (c) "Mọi startup trong tạp chí này đều thành công dù không có kế hoạch kinh doanh" → <strong>thiên kiến sống sót</strong>. (d) Một sinh viên năm nhất quả quyết kiến trúc của anh khoá trên "rõ ràng là làm quá" sau đúng một môn học → <strong>Dunning-Kruger</strong>.</p>
<p class="meo">💡 Móc nhớ: sáu câu hỏi là một <strong>TẬP HỢP</strong>, không phải một TRÌNH TỰ (slide 9 và 10 xếp khác nhau); bốn thiên kiến là <strong>xác nhận · neo · sống sót · Dunning-Kruger</strong>.</p>`],

      [11, 'Survival skills for university — the section break (and: systems thinking)',
        `<p class="y-chinh">🎯 The gold-brown divider returns, this time reading <strong>"Survival skills for university"</strong>. No content of its own — it exists to say that the deck has stopped describing critical thinking and is about to place it among the other skills a university student needs (slide 12).</p>
<ul>
<li><strong>Two brown slides in the deck: slide 1 and slide 11.</strong> Slide 1 opens; slide 11 splits the module into halves. Everything before it defines and demonstrates critical thinking; everything after it is context, tools and application. If a question asks about the deck's structure, that split is the answer.</li>
<li><strong>The word "survival" is doing real work.</strong> Not "excellence", not "advantage" — <em>survival</em>. The framing is that a student who cannot question, cannot collaborate and cannot judge a source will drown, not merely score lower. Against a 100%-exam subject taken across five MOOCs, that framing is fair.</li>
<li><strong>What changes between high school and university, concretely.</strong> The reading list is not "the truth", it is a set of sources that disagree with each other. Teachers ask for a position, not a recall. Nobody tells you when to start. Assessment rewards justification rather than correctness alone. Critical thinking is the skill that handles all four changes at once.</li>
</ul>
<p class="nhan">📌 Beyond the slide — <strong>systems thinking</strong>, the skill critical thinking turns into once the problem has more than one moving part. Named in the MOOC, absent from these 15 slides.</p>
<table>
<tr><th>Critical thinking asks…</th><th>Systems thinking adds…</th></tr>
<tr><td>Is this claim well supported?</td><td>What else changes if I act on it?</td></tr>
<tr><td>What caused this?</td><td>What <em>loop</em> keeps it happening?</td></tr>
<tr><td>Is this source reliable?</td><td>Who benefits from the system staying as it is?</td></tr>
<tr><td>Is this the right answer?</td><td>Is this the right <strong>boundary</strong> — did I draw the problem too small?</td></tr>
</table>
<ul>
<li><strong>Its core moves are three.</strong> (1) <em>Widen the boundary</em> — the cause is often outside the box you drew. (2) <em>Look for feedback loops</em> — reinforcing loops make things run away, balancing loops make them resist change. (3) <em>Expect delay</em> — effects arrive late, which is exactly why people conclude "it did not work" and stop.</li>
<li><strong>The SWP391 loop, drawn honestly.</strong> Behind schedule → skip code review to save time → more defects reach integration → more rework → further behind. That is a reinforcing loop, and the "obvious" fix (skip more review) feeds it. The leverage point is upstream — cut scope, not quality — which you only see once you draw the loop instead of the symptom.</li>
<li><strong>A second loop, for study habits.</strong> Fall behind in a subject → attend less because lectures no longer make sense → fall further behind. Same shape. Naming it as a loop tells you the intervention must break a link (catch up on one specific week), not increase effort in general.</li>
<li><strong>Where it meets the module's other tools.</strong> 5W1H gets you the facts; systems thinking asks how those facts feed each other. Together they stop the two classic failures: acting on an unchecked claim, and fixing a symptom while the loop that produces it keeps running.</li>
</ul>
<p class="meo">💡 Remember the divider by its colour: <strong>brown = a new part starts</strong>. And remember the pairing — critical thinking judges <em>one claim</em>, systems thinking judges <em>how claims and actions feed each other</em>.</p>`,
        `<p class="y-chinh">🎯 Slide ngăn nền nâu-vàng trở lại, lần này ghi <strong>"Survival skills for university"</strong> — Kỹ năng sinh tồn ở đại học. Bản thân nó không có nội dung; nó tồn tại để báo rằng deck đã ngừng mô tả tư duy phản biện và sắp đặt nó vào giữa những kỹ năng khác mà một sinh viên cần (slide 12).</p>
<ul>
<li><strong>Cả deck có hai slide nâu: slide 1 và slide 11.</strong> Slide 1 mở màn; slide 11 chẻ module làm hai nửa. Mọi thứ trước nó là ĐỊNH NGHĨA và MINH HOẠ tư duy phản biện; mọi thứ sau nó là BỐI CẢNH, CÔNG CỤ và ÁP DỤNG. Nếu bị hỏi về cấu trúc deck, chỗ chẻ đó chính là câu trả lời.</li>
<li><strong>Chữ "sinh tồn" có sức nặng thật.</strong> Không phải "xuất sắc", không phải "lợi thế" — mà là <em>SINH TỒN</em>. Cách đặt vấn đề ở đây là: một sinh viên không biết chất vấn, không biết hợp tác và không phán được nguồn thì sẽ CHÌM, chứ không phải chỉ điểm thấp hơn. Với một môn 100% điểm nằm ở một bài thi phủ năm MOOC, cách nói đó là công bằng.</li>
<li><strong>Cấp ba và đại học khác nhau ở đâu, nói cho cụ thể.</strong> Danh mục tài liệu không phải "chân lý", nó là một tập nguồn CÃI NHAU. Thầy cô đòi một LẬP TRƯỜNG, không đòi học thuộc. Không ai nhắc bạn lúc nào phải bắt đầu. Bài chấm thưởng cho phần BIỆN MINH chứ không chỉ cho đáp án đúng. Tư duy phản biện là kỹ năng xử lý cùng lúc cả bốn thay đổi đó.</li>
</ul>
<p class="nhan">📌 Bổ sung ngoài slide — <strong>TƯ DUY HỆ THỐNG</strong>, thứ mà tư duy phản biện biến thành khi vấn đề có nhiều bộ phận chuyển động. Có tên trong MOOC, vắng mặt trong 15 slide này.</p>
<table>
<tr><th>Tư duy phản biện hỏi…</th><th>Tư duy hệ thống hỏi thêm…</th></tr>
<tr><td>Khẳng định này có được chống lưng tốt không?</td><td>Nếu tôi hành động theo nó thì còn thứ gì khác đổi theo?</td></tr>
<tr><td>Cái gì đã gây ra chuyện này?</td><td><em>VÒNG LẶP</em> nào đang giữ cho nó tiếp tục xảy ra?</td></tr>
<tr><td>Nguồn này có đáng tin không?</td><td>AI ĐƯỢC LỢI khi hệ thống cứ giữ nguyên như vậy?</td></tr>
<tr><td>Đây có phải câu trả lời đúng không?</td><td>Đây có phải <strong>RANH GIỚI</strong> đúng không — tôi có khoanh vấn đề nhỏ quá không?</td></tr>
</table>
<ul>
<li><strong>Ba nước đi cốt lõi của nó.</strong> (1) <em>Nới ranh giới</em> — nguyên nhân thường nằm NGOÀI cái khung bạn vẽ. (2) <em>Tìm vòng phản hồi</em> — vòng khuếch đại làm mọi thứ chạy tuột tay, vòng cân bằng làm mọi thứ chống lại thay đổi. (3) <em>Lường trước ĐỘ TRỄ</em> — hệ quả tới muộn, và đó đúng là lý do người ta kết luận "làm vậy không ăn thua" rồi bỏ cuộc.</li>
<li><strong>Vòng lặp SWP391, vẽ ra cho thật lòng.</strong> Trễ tiến độ → bỏ review code cho nhanh → nhiều lỗi lọt xuống tích hợp hơn → làm lại nhiều hơn → càng trễ. Đó là vòng KHUẾCH ĐẠI, và cách sửa "hiển nhiên" (bỏ review nhiều hơn nữa) chính là thứ nuôi nó. Điểm bẩy nằm ở thượng nguồn — CẮT PHẠM VI chứ không cắt chất lượng — và bạn chỉ thấy điều đó khi vẽ VÒNG LẶP thay vì nhìn TRIỆU CHỨNG.</li>
<li><strong>Một vòng lặp thứ hai, cho thói quen học.</strong> Tụt lại ở một môn → đi học ít hơn vì lên lớp không hiểu gì → càng tụt lại. Cùng một hình dạng. Gọi nó là vòng lặp cho biết can thiệp phải PHÁ MỘT MẮT XÍCH (học bù đúng một tuần cụ thể), chứ không phải "cố gắng nhiều hơn" chung chung.</li>
<li><strong>Nó gặp các công cụ khác của module ở đâu.</strong> 5W1H lấy cho bạn các SỰ KIỆN; tư duy hệ thống hỏi các sự kiện đó NUÔI NHAU thế nào. Ghép lại, chúng chặn hai thất bại kinh điển: hành động theo một khẳng định chưa kiểm, và vá triệu chứng trong khi vòng lặp sinh ra nó vẫn đang chạy.</li>
</ul>
<p class="meo">💡 Nhớ slide ngăn bằng MÀU: <strong>nâu = bắt đầu một phần mới</strong>. Và nhớ cặp đôi — tư duy phản biện phán <em>MỘT khẳng định</em>, tư duy hệ thống phán <em>cách các khẳng định và hành động nuôi nhau</em>.</p>`],

      [12, '21st Century skills — the list of twelve',
        `<p class="y-chinh">🎯 A bare list of <strong>twelve</strong> skills, critical thinking first: <strong>Critical thinking · Creativity · Collaboration · Communication · Information literacy · Media literacy · Technology literacy · Flexibility · Leadership · Initiative · Productivity · Social skills</strong>.</p>
<table>
<tr><th>Group</th><th>Skills (in slide order)</th><th>What the group is for</th></tr>
<tr><td><strong>The 4 C's</strong> — learning skills</td><td>Critical thinking · Creativity · Collaboration · Communication</td><td>How you think and how you work with other minds</td></tr>
<tr><td><strong>The 3 literacies</strong> — digital skills</td><td>Information literacy · Media literacy · Technology literacy</td><td>How you handle information, the channels carrying it, and the tools</td></tr>
<tr><td><strong>The 5 life skills</strong></td><td>Flexibility · Leadership · Initiative · Productivity · Social skills</td><td>How you conduct yourself over long stretches of work</td></tr>
</table>
<ul>
<li><strong>4 + 3 + 5 = 12, and that arithmetic is the whole mnemonic.</strong> The slide shows a flat list with no grouping, but the list is the standard "21st century skills" framework, and grouping it is the only realistic way to recall twelve items under exam pressure.</li>
<li><strong>Critical thinking is listed FIRST, and that is not accidental.</strong> It is the skill this MOOC teaches, and it is also the one the other eleven depend on: collaboration without it becomes agreeing with whoever is loudest; media literacy without it is just knowing how platforms work.</li>
<li><strong>The three literacies are three different questions, and students merge them.</strong> <em>Information</em> literacy = can I find, judge and cite a source (MOOC 1). <em>Media</em> literacy = do I understand how the channel shapes the message — who funds it, what an algorithm promoted, what a thumbnail is doing. <em>Technology</em> literacy = can I actually operate the tools. Three, not one.</li>
<li><strong>Flexibility and initiative are the two most commonly under-rated.</strong> <em>Flexibility</em> is changing your approach when evidence says the approach is failing — the behavioural face of slide 7's "open mind". <em>Initiative</em> is starting without being told, and it is the single most visible difference between students in an OJT placement.</li>
<li><strong>Map the twelve onto FPTU deliverables and the list stops being abstract.</strong> Collaboration and leadership are graded inside SWP391 group work; communication and critical thinking are graded in every report defence; information and media literacy are exactly what a plagiarism check and a reference list test; productivity is what a sprint burndown measures.</li>
<li><strong>Beyond the slide — where this list comes from.</strong> It is the widely used "21st century skills" grouping (the 4 C's of learning, the three literacies, life skills), promoted since the 2000s by employers and curriculum bodies. The deck gives no citation, so if an exam item attributes it to a named author, judge by the content of the list rather than the attribution.</li>
</ul>
<p class="dap-an">✅ Quick check: which group does each belong to? (a) Media literacy → <strong>literacies</strong>. (b) Initiative → <strong>life skills</strong>. (c) Communication → <strong>4 C's</strong>. (d) Flexibility → <strong>life skills</strong>. (e) Creativity → <strong>4 C's</strong>. Note that "problem solving" is NOT on this slide's list, even though MOOC 2 was entirely about it — do not add items that are not there.</p>
<p class="meo">💡 Recall as <strong>4 C · 3 literacy · 5 life = 12</strong>, and remember the first C is critical thinking. If an option says "ten skills" or "eight skills", the slide says twelve.</p>`,
        `<p class="y-chinh">🎯 Một danh sách trơ trụi gồm <strong>MƯỜI HAI</strong> kỹ năng, tư duy phản biện đứng đầu: <strong>Critical thinking · Creativity · Collaboration · Communication · Information literacy · Media literacy · Technology literacy · Flexibility · Leadership · Initiative · Productivity · Social skills</strong>.</p>
<table>
<tr><th>Nhóm</th><th>Kỹ năng (theo đúng thứ tự slide)</th><th>Nhóm đó để làm gì</th></tr>
<tr><td><strong>Bốn chữ C</strong> — kỹ năng học tập</td><td>Tư duy phản biện · Sáng tạo · Hợp tác · Giao tiếp</td><td>Cách bạn suy nghĩ và cách bạn làm việc với đầu óc người khác</td></tr>
<tr><td><strong>Ba năng lực đọc-hiểu</strong> — kỹ năng số</td><td>Năng lực thông tin · Năng lực truyền thông · Năng lực công nghệ</td><td>Cách bạn xử lý thông tin, các kênh chuyển tải nó, và các công cụ</td></tr>
<tr><td><strong>Năm kỹ năng sống</strong></td><td>Linh hoạt · Lãnh đạo · Chủ động · Năng suất · Kỹ năng xã hội</td><td>Cách bạn tự vận hành mình qua những chặng làm việc dài</td></tr>
</table>
<ul>
<li><strong>4 + 3 + 5 = 12, và phép tính đó chính là toàn bộ mẹo nhớ.</strong> Slide trưng một danh sách phẳng không chia nhóm, nhưng đây là khung "21st century skills" chuẩn, và chia nhóm là cách thực tế duy nhất để nhớ nổi mười hai mục dưới áp lực phòng thi.</li>
<li><strong>Tư duy phản biện được xếp ĐẦU TIÊN, và đó không phải ngẫu nhiên.</strong> Nó là kỹ năng mà MOOC này dạy, và cũng là thứ mười một kỹ năng kia dựa vào: hợp tác mà thiếu nó thì thành gật theo người nói to nhất; năng lực truyền thông mà thiếu nó thì chỉ là biết nền tảng chạy ra sao.</li>
<li><strong>Ba năng lực đọc-hiểu là ba câu hỏi khác nhau, và sinh viên hay gộp làm một.</strong> Năng lực <em>THÔNG TIN</em> = tôi có tìm, phán và trích được nguồn không (MOOC 1). Năng lực <em>TRUYỀN THÔNG</em> = tôi có hiểu cái KÊNH đang nhào nặn thông điệp thế nào không — ai tài trợ, thuật toán đẩy cái gì lên, tấm thumbnail đang làm gì. Năng lực <em>CÔNG NGHỆ</em> = tôi có thật sự dùng được công cụ không. Ba, không phải một.</li>
<li><strong>Linh hoạt và chủ động là hai thứ bị đánh giá thấp nhất.</strong> <em>Linh hoạt</em> là đổi cách làm khi bằng chứng nói cách làm đó đang hỏng — bộ mặt hành vi của "tâm trí cởi mở" ở slide 7. <em>Chủ động</em> là bắt tay vào việc mà không cần ai bảo, và đó là khác biệt dễ thấy nhất giữa các sinh viên trong kỳ OJT.</li>
<li><strong>Ánh xạ mười hai mục vào sản phẩm phải nộp ở FPTU thì danh sách hết trừu tượng.</strong> Hợp tác và lãnh đạo được chấm ngay trong phần làm nhóm SWP391; giao tiếp và tư duy phản biện được chấm ở mọi buổi bảo vệ báo cáo; năng lực thông tin và truyền thông đúng là thứ mà phần kiểm đạo văn và danh mục tài liệu tham khảo đang đo; năng suất là thứ biểu đồ burndown của sprint đo.</li>
<li><strong>Bổ sung ngoài slide — danh sách này từ đâu ra.</strong> Đây là cách nhóm "21st century skills" được dùng rộng rãi (bốn chữ C của học tập, ba năng lực đọc-hiểu, các kỹ năng sống), được giới tuyển dụng và các cơ quan chương trình đẩy mạnh từ những năm 2000. Deck không ghi nguồn, nên nếu đề thi gán nó cho một tác giả cụ thể, hãy phán theo NỘI DUNG danh sách chứ đừng phán theo tên người.</li>
</ul>
<p class="dap-an">✅ Kiểm nhanh: mỗi cái thuộc nhóm nào? (a) Năng lực truyền thông → <strong>nhóm đọc-hiểu</strong>. (b) Chủ động → <strong>kỹ năng sống</strong>. (c) Giao tiếp → <strong>bốn chữ C</strong>. (d) Linh hoạt → <strong>kỹ năng sống</strong>. (e) Sáng tạo → <strong>bốn chữ C</strong>. Để ý: "giải quyết vấn đề" KHÔNG có trong danh sách của slide này, dù cả MOOC 2 nói về đúng chuyện đó — đừng thêm mục không có trên slide.</p>
<p class="meo">💡 Nhớ thành <strong>4 C · 3 năng lực · 5 kỹ năng sống = 12</strong>, và nhớ chữ C đầu tiên là tư duy phản biện. Phương án nào nói "mười kỹ năng" hay "tám kỹ năng" thì sai — slide ghi mười hai.</p>`],

      [13, 'Critical question stems 1–16 (and: the Toulmin model of argument)',
        `<p class="y-chinh">🎯 A pasted page of numbered question stems — <strong>1 to 16</strong> — in teal type with an orange cloud in the margin. These are not questions about critical thinking; they are the questions you <em>ask with</em> it, written with blanks so you can drop any topic in.</p>
<table>
<tr><th>#</th><th>Stem (slide wording)</th><th>What it forces</th></tr>
<tr><td>1</td><td>What evidence can you present for/against …?</td><td>Evidence, both directions</td></tr>
<tr><td>2</td><td>How does … contrast with …?</td><td>Comparison</td></tr>
<tr><td>3</td><td>How could you outline or concept map …? Explain your response with examples.</td><td>Structure</td></tr>
<tr><td>4</td><td>Why is … significant? Explain your reasoning.</td><td>Significance + reasoning</td></tr>
<tr><td>5</td><td>What are the advantages and disadvantages of …?</td><td>Trade-off</td></tr>
<tr><td>6</td><td>What is the point or 'big idea' of …?</td><td>Main claim</td></tr>
<tr><td>7</td><td>How could you judge the accuracy of …?</td><td>Criteria for accuracy</td></tr>
<tr><td>8</td><td>What are the differences between … and …?</td><td>Distinction</td></tr>
<tr><td>9</td><td>How is … related to …?</td><td>Connection</td></tr>
<tr><td>10</td><td>What ideas could you add to … and how would these ideas change it?</td><td>Extension</td></tr>
<tr><td>11</td><td>Describe … from the perspective of ….</td><td>Perspective-taking</td></tr>
<tr><td>12</td><td>What do you think about …? Explain your reasoning.</td><td>Position + justification</td></tr>
<tr><td>13</td><td>When might … be most useful and why?</td><td>Conditions of use</td></tr>
<tr><td>14</td><td>How could you create or design a new …? Explain your thinking.</td><td>Creation</td></tr>
<tr><td>15</td><td>What solutions could you suggest the problem of …? Which might be most effective and why?</td><td>Solutions + ranking</td></tr>
<tr><td>16</td><td>What might happen if you combined … and …?</td><td>Synthesis</td></tr>
</table>
<ul>
<li><strong>Look at how many stems end with "and why" or "explain your reasoning" — 3, 4, 12, 13, 14, 15.</strong> Six of sixteen demand justification explicitly. That is the module's thesis in the shape of a question bank: an answer without a reason does not count.</li>
<li><strong>Number 1 is the master stem, and it is deliberately two-directional.</strong> "For <em>and against</em>" builds the balance slide 5 asked for. If you can only produce evidence for your own side, you have not researched the question, you have defended a conclusion.</li>
<li><strong>Stem 11 is the empathy move, and it is the hardest to fake.</strong> "Describe X from the perspective of Y" forces you to state a position you may not hold, in its strongest form — the direct antidote to the straw man.</li>
<li><strong>Beyond the slide: use these as a reading protocol, not a quiz.</strong> Pick three stems, answer them in writing for every paper you read, and keep the answers. By week 5 you have a comparison table nobody else in the class has.</li>
<li><strong>Two things to notice about the page itself.</strong> It is a pasted image (different typeface, its own numbering) and stem 15 has a grammar slip — "suggest <em>the problem</em>" is missing "to" or "for". Both are the original's, left uncorrected here.</li>
</ul>
<p class="nhan">📌 Beyond the slide — <strong>the Toulmin model</strong>, the standard way to build the answer to stem 1. Six parts, three of them essential.</p>
<table>
<tr><th>Part</th><th>Question it answers</th><th>Worked example</th></tr>
<tr><td><strong>Claim</strong> (essential)</td><td>What am I asking you to accept?</td><td>IT students should learn Git in their first year.</td></tr>
<tr><td><strong>Grounds / evidence</strong> (essential)</td><td>What facts support it?</td><td>Every SWP391/SWR302 team submits through a repository; job ads for junior roles list Git; teams that branch and review lose less work to overwrites.</td></tr>
<tr><td><strong>Warrant</strong> (essential)</td><td>Why does that evidence support that claim?</td><td>A skill that is required by later coursework and by employers is worth learning before it is needed under deadline pressure.</td></tr>
<tr><td><strong>Backing</strong></td><td>What supports the warrant itself?</td><td>Learning a tool while a graded project is burning costs both the tool and the project — the same reason typing is taught before essays.</td></tr>
<tr><td><strong>Qualifier</strong></td><td>How strong is the claim?</td><td><em>Most</em> IT students, and the basics — commit, branch, merge, pull request — not advanced rebasing.</td></tr>
<tr><td><strong>Rebuttal</strong></td><td>When would it not hold?</td><td>Unless first-year courses are single-file exercises with no collaboration, in which case Git adds load without payoff.</td></tr>
</table>
<ul>
<li><strong>The warrant is the part students omit, and it is where marks are lost.</strong> Claim plus evidence with no warrant reads as "here is a fact, here is my opinion, please connect them yourself". Say the connecting principle out loud — that sentence is usually the best sentence in the paragraph.</li>
<li><strong>A qualifier makes an argument stronger, not weaker.</strong> "All students must…" is refuted by one counter-example; "most first-year IT students, for the basics…" survives, and matches slide 7's "cautious yet evidence-based".</li>
<li><strong>Including the rebuttal is what distinguishes an academic argument from a persuasive one.</strong> You name the conditions under which you would be wrong, then show they do not apply here. That is the same habit as writing down in advance what evidence would change your mind (slide 10).</li>
</ul>
<p class="meo">💡 Three words you must be able to produce on demand: <strong>claim · grounds · warrant</strong>. Add qualifier and rebuttal and your paragraph is already at report standard.</p>`,
        `<p class="y-chinh">🎯 Một trang dán gồm các mẫu câu hỏi đánh số — <strong>từ 1 tới 16</strong> — chữ xanh lam pha lục, có đám mây cam ở lề. Đây không phải câu hỏi VỀ tư duy phản biện; đây là những câu hỏi bạn ĐẶT RA BẰNG tư duy phản biện, viết sẵn chỗ trống để nhét chủ đề nào vào cũng được.</p>
<table>
<tr><th>#</th><th>Mẫu câu (đúng chữ slide)</th><th>Nó ép bạn làm gì</th></tr>
<tr><td>1</td><td>What evidence can you present for/against …? — Bạn đưa ra được bằng chứng nào ủng hộ/phản đối …?</td><td>Bằng chứng, CẢ HAI CHIỀU</td></tr>
<tr><td>2</td><td>How does … contrast with …? — … tương phản với … ra sao?</td><td>So sánh</td></tr>
<tr><td>3</td><td>How could you outline or concept map …? Explain your response with examples.</td><td>Cấu trúc hoá</td></tr>
<tr><td>4</td><td>Why is … significant? Explain your reasoning. — Vì sao … là quan trọng?</td><td>Tầm quan trọng + lý lẽ</td></tr>
<tr><td>5</td><td>What are the advantages and disadvantages of …?</td><td>Đánh đổi</td></tr>
<tr><td>6</td><td>What is the point or 'big idea' of …? — Ý chính của … là gì?</td><td>Luận điểm chính</td></tr>
<tr><td>7</td><td>How could you judge the accuracy of …?</td><td>Tiêu chí đánh giá độ chính xác</td></tr>
<tr><td>8</td><td>What are the differences between … and …?</td><td>Phân biệt</td></tr>
<tr><td>9</td><td>How is … related to …?</td><td>Liên hệ</td></tr>
<tr><td>10</td><td>What ideas could you add to … and how would these ideas change it?</td><td>Mở rộng</td></tr>
<tr><td>11</td><td>Describe … from the perspective of …. — Hãy mô tả … từ góc nhìn của ….</td><td>Đặt mình vào góc nhìn khác</td></tr>
<tr><td>12</td><td>What do you think about …? Explain your reasoning.</td><td>Lập trường + biện minh</td></tr>
<tr><td>13</td><td>When might … be most useful and why?</td><td>Điều kiện sử dụng</td></tr>
<tr><td>14</td><td>How could you create or design a new …? Explain your thinking.</td><td>Sáng tạo</td></tr>
<tr><td>15</td><td>What solutions could you suggest the problem of …? Which might be most effective and why?</td><td>Giải pháp + xếp hạng</td></tr>
<tr><td>16</td><td>What might happen if you combined … and …?</td><td>Tổng hợp</td></tr>
</table>
<ul>
<li><strong>Hãy đếm xem bao nhiêu mẫu câu kết thúc bằng "and why" hoặc "explain your reasoning" — số 3, 4, 12, 13, 14, 15.</strong> Sáu trên mười sáu câu đòi biện minh một cách công khai. Đó chính là luận đề của cả module, khoác hình dạng một kho câu hỏi: một câu trả lời không kèm lý do thì không được tính.</li>
<li><strong>Câu số 1 là mẫu câu gốc, và nó CỐ Ý hai chiều.</strong> "Ủng hộ <em>VÀ phản đối</em>" chính là cái cân bằng mà slide 5 đòi. Nếu bạn chỉ moi ra được bằng chứng cho phe mình, bạn chưa nghiên cứu câu hỏi — bạn đang bào chữa cho một kết luận.</li>
<li><strong>Mẫu 11 là nước đi đồng cảm, và khó giả vờ nhất.</strong> "Mô tả X từ góc nhìn của Y" ép bạn phát biểu một lập trường có thể bạn không giữ, ở dạng MẠNH NHẤT của nó — thuốc giải trực tiếp cho nguỵ biện người rơm.</li>
<li><strong>Bổ sung ngoài slide: dùng chúng như một QUY TRÌNH ĐỌC, không phải một bài kiểm tra.</strong> Chọn ba mẫu câu, trả lời chúng bằng chữ viết cho mọi bài báo bạn đọc, và giữ lại câu trả lời. Tới tuần 5 bạn có một bảng đối chiếu mà không ai trong lớp có.</li>
<li><strong>Hai điều đáng để ý về chính trang này.</strong> Nó là ảnh dán (phông chữ khác, đánh số riêng) và mẫu câu 15 sai ngữ pháp — "suggest <em>the problem</em>" thiếu "to" hoặc "for". Cả hai là lỗi của bản gốc, ở đây để nguyên không sửa.</li>
</ul>
<p class="nhan">📌 Bổ sung ngoài slide — <strong>MÔ HÌNH TOULMIN</strong>, cách chuẩn để dựng câu trả lời cho mẫu câu số 1. Sáu thành phần, ba trong đó là bắt buộc.</p>
<table>
<tr><th>Thành phần</th><th>Trả lời câu hỏi nào</th><th>Ví dụ dựng trọn</th></tr>
<tr><td><strong>Luận điểm</strong> (claim — bắt buộc)</td><td>Tôi đang đề nghị bạn chấp nhận điều gì?</td><td>Sinh viên CNTT nên học Git ngay từ năm nhất.</td></tr>
<tr><td><strong>Bằng chứng</strong> (grounds — bắt buộc)</td><td>Sự kiện nào chống lưng cho nó?</td><td>Mọi nhóm SWP391/SWR302 đều nộp bài qua một repository; tin tuyển dụng vị trí junior đều liệt kê Git; nhóm biết tạo nhánh và review mất ít công vì ghi đè hơn hẳn.</td></tr>
<tr><td><strong>Lập luận nối</strong> (warrant — bắt buộc)</td><td>Vì sao bằng chứng đó lại chống lưng được cho luận điểm đó?</td><td>Một kỹ năng mà các môn về sau và nhà tuyển dụng đều đòi thì đáng học TRƯỚC khi bị cần tới trong lúc chạy deadline.</td></tr>
<tr><td><strong>Chống đỡ</strong> (backing)</td><td>Cái gì chống lưng cho chính lập luận nối?</td><td>Học một công cụ trong lúc đồ án đang cháy thì hỏng cả công cụ lẫn đồ án — cùng một lý do người ta dạy gõ phím trước khi bắt viết luận.</td></tr>
<tr><td><strong>Giới hạn</strong> (qualifier)</td><td>Luận điểm mạnh tới mức nào?</td><td><em>PHẦN LỚN</em> sinh viên CNTT, và chỉ phần căn bản — commit, branch, merge, pull request — không phải rebase nâng cao.</td></tr>
<tr><td><strong>Ngoại lệ</strong> (rebuttal)</td><td>Khi nào thì nó KHÔNG đúng?</td><td>Trừ khi các môn năm nhất chỉ là bài tập một file, không làm chung, khi đó Git chỉ thêm gánh nặng mà không đem lại gì.</td></tr>
</table>
<ul>
<li><strong>Lập luận nối là phần sinh viên hay bỏ, và đó là chỗ mất điểm.</strong> Luận điểm cộng bằng chứng mà thiếu lập luận nối thì đọc lên thành "đây là một sự kiện, đây là ý kiến của tôi, mời anh tự nối giúp". Hãy nói THÀNH LỜI cái nguyên tắc nối ấy — câu đó thường là câu hay nhất của cả đoạn.</li>
<li><strong>Có giới hạn làm lập luận MẠNH lên chứ không yếu đi.</strong> "Mọi sinh viên đều phải…" bị một phản ví dụ hạ gục; "phần lớn sinh viên CNTT năm nhất, ở mức căn bản…" thì sống sót, và khớp đúng với "thận trọng nhưng dựa trên bằng chứng" của slide 7.</li>
<li><strong>Có phần ngoại lệ mới là thứ phân biệt lập luận HỌC THUẬT với lập luận THUYẾT PHỤC.</strong> Bạn nêu rõ điều kiện nào thì mình sai, rồi chỉ ra rằng điều kiện đó không xảy ra ở đây. Đó cũng chính là thói quen viết trước xem bằng chứng nào sẽ làm mình đổi ý (slide 10).</li>
</ul>
<p class="meo">💡 Ba chữ phải bật ra được bất cứ lúc nào: <strong>luận điểm · bằng chứng · lập luận nối</strong>. Thêm giới hạn và ngoại lệ là đoạn văn của bạn đã đạt chuẩn báo cáo.</p>`],

      [14, 'Critical question stems 17–28 (and: critical writing, argument chains, criteria)',
        `<p class="y-chinh">🎯 The second pasted page, stems <strong>17 to 28</strong>, same typeface and cloud. Where 1–16 leaned on evidence and comparison, this page leans on <strong>judgement, priority and criteria</strong> — the analytical end of the bank.</p>
<table>
<tr><th>#</th><th>Stem (slide wording)</th><th>What it forces</th></tr>
<tr><td>17</td><td>Do you agree that …? Why or why not?</td><td>Take a position</td></tr>
<tr><td>18</td><td>What information would you need to make a decision about …?</td><td>Name the missing evidence</td></tr>
<tr><td>19</td><td>How could you prioritize …?</td><td>Ranking</td></tr>
<tr><td>20</td><td>How is … an example of …?</td><td>Instance of a category</td></tr>
<tr><td>21</td><td>What are the most important parts or features of …?</td><td>Decomposition</td></tr>
<tr><td>22</td><td>Which details of … are most important and why?</td><td>Selection + reason</td></tr>
<tr><td>23</td><td>What patterns do you notice in …?</td><td>Pattern finding (induction)</td></tr>
<tr><td>24</td><td>How could you classify … into a more/less general category?</td><td>Classification</td></tr>
<tr><td>25</td><td>What makes … important?</td><td>Value</td></tr>
<tr><td>26</td><td>What criteria could you use to assess …?</td><td><strong>Criteria</strong> — the key stem on this page</td></tr>
<tr><td>27</td><td>How could … and … function together? How do they work separately and together and different ways?</td><td>Interaction</td></tr>
<tr><td>28</td><td>Where is … most/least …? Explain your reasoning.</td><td>Extremes + reasoning</td></tr>
</table>
<ul>
<li><strong>Stem 26 is the one to memorise: "What criteria could you use to assess …?"</strong> Naming your criteria <em>before</em> you judge is what separates evaluation from preference. "This framework is better" is a preference; "judged on learning curve, community size and LTS support, this framework is better on two of three" is an evaluation.</li>
<li><strong>Stem 18 is the missing-information stem, and it is the most useful one in real work.</strong> Most bad decisions are not wrong reasoning over the available facts; they are decisions made without asking what fact was missing. It is also the polite way to challenge a senior: not "you are wrong", but "what would we need to know to be sure?"</li>
<li><strong>Stem 23 is induction in disguise.</strong> "What patterns do you notice" is exactly the cases-to-rule move from slide 8 — so it carries induction's risk, namely a pattern seen in too small a sample. Pair it with stem 1 (evidence for and against) and you have a check built in.</li>
<li><strong>Stem 27 is garbled on the slide.</strong> "How do they work separately and together and different ways?" is not a grammatical sentence. It is the original's error; the intended question is plainly "how do they work separately, together, and in different ways?"</li>
</ul>
<p class="nhan">📌 Beyond the slide — <strong>descriptive vs critical writing</strong>, and how arguments join into chains. This is learning outcome 7, and it is where the module cashes out on paper.</p>
<table>
<tr><th>Descriptive writing does…</th><th>Critical writing does…</th></tr>
<tr><td>States what happened, what a source says</td><td>States what it <em>means</em> and what follows</td></tr>
<tr><td>Lists sources one after another</td><td>Sets sources against each other and says who is more convincing, and why</td></tr>
<tr><td>Explains the method</td><td>Justifies why that method suits <em>this</em> question</td></tr>
<tr><td>Reports results</td><td>Weighs results against the claim, including the results that do not fit</td></tr>
<tr><td>Earns the pass marks</td><td>Earns the marks above the pass</td></tr>
</table>
<ul>
<li><strong>The practical test on your own paragraph: count the sentences that only report.</strong> If more than about half of a "discussion" section could be written by someone who had not thought about the topic, it is description wearing a discussion heading.</li>
<li><strong>Arguments join in three shapes, and knowing them fixes muddled paragraphs.</strong> <em>Serial / chain</em>: A supports B, B supports C — strong, but it breaks entirely if one link fails. <em>Convergent</em>: three independent reasons all support the same conclusion — losing one weakens but does not break it. <em>Divergent</em>: one reason supports several conclusions. Most good report paragraphs are convergent; most fragile ones are long serial chains.</li>
<li><strong>Every chain has a weakest link, so find it before your reader does.</strong> Write your argument as numbered steps and ask which step a reasonable person would refuse. That step is where your evidence must go, and it is what stem 18 is really asking.</li>
<li><strong>At FPTU this is the difference between a 6 and an 8 on a report.</strong> An SWR302 test plan that lists techniques is descriptive; one that says "we chose boundary-value analysis over exhaustive testing because the input space is 10^6 and the defect history clusters at limits" is critical — claim, grounds, warrant, in one sentence.</li>
</ul>
<p class="dap-an">✅ Apply stem 26 to a real choice — "which database for the capstone?" Criteria first: (1) team's existing skill, (2) hosting cost, (3) transaction needs, (4) ecosystem and docs, (5) how it will be marked. Only then score the options. Choosing first and listing reasons afterwards is rationalisation, and markers recognise it.</p>
<p class="meo">💡 Two counts for the exam: this page holds stems <strong>17–28</strong>, so the bank is <strong>28</strong> stems in total across slides 13 and 14. And one sentence to keep: <strong>description says WHAT, critical writing says SO WHAT and HOW DO I KNOW</strong>.</p>`,
        `<p class="y-chinh">🎯 Trang dán thứ hai, mẫu câu <strong>17 tới 28</strong>, cùng phông chữ và đám mây. Nếu 1–16 nghiêng về bằng chứng và so sánh, thì trang này nghiêng về <strong>PHÁN ĐOÁN, ƯU TIÊN và TIÊU CHÍ</strong> — đầu phân tích của kho câu hỏi.</p>
<table>
<tr><th>#</th><th>Mẫu câu (đúng chữ slide)</th><th>Nó ép bạn làm gì</th></tr>
<tr><td>17</td><td>Do you agree that …? Why or why not? — Bạn có đồng ý rằng …? Vì sao có/không?</td><td>Chọn một lập trường</td></tr>
<tr><td>18</td><td>What information would you need to make a decision about …? — Bạn cần THÔNG TIN GÌ để quyết định về …?</td><td>Gọi tên bằng chứng còn THIẾU</td></tr>
<tr><td>19</td><td>How could you prioritize …?</td><td>Xếp thứ tự ưu tiên</td></tr>
<tr><td>20</td><td>How is … an example of …?</td><td>Trường hợp của một loại</td></tr>
<tr><td>21</td><td>What are the most important parts or features of …?</td><td>Bóc tách</td></tr>
<tr><td>22</td><td>Which details of … are most important and why?</td><td>Chọn lọc + lý do</td></tr>
<tr><td>23</td><td>What patterns do you notice in …?</td><td>Tìm quy luật (quy nạp)</td></tr>
<tr><td>24</td><td>How could you classify … into a more/less general category?</td><td>Phân loại</td></tr>
<tr><td>25</td><td>What makes … important?</td><td>Giá trị</td></tr>
<tr><td>26</td><td>What criteria could you use to assess …? — Bạn dùng TIÊU CHÍ nào để đánh giá …?</td><td><strong>TIÊU CHÍ</strong> — mẫu câu then chốt của trang này</td></tr>
<tr><td>27</td><td>How could … and … function together? How do they work separately and together and different ways?</td><td>Tương tác</td></tr>
<tr><td>28</td><td>Where is … most/least …? Explain your reasoning.</td><td>Cực trị + lý lẽ</td></tr>
</table>
<ul>
<li><strong>Mẫu câu 26 là cái phải thuộc: "Bạn dùng tiêu chí nào để đánh giá …?"</strong> Nêu tiêu chí TRƯỚC khi phán là thứ phân biệt ĐÁNH GIÁ với SỞ THÍCH. "Framework này tốt hơn" là sở thích; "xét theo độ dốc học, quy mô cộng đồng và hỗ trợ LTS, framework này thắng ở hai trên ba tiêu chí" mới là đánh giá.</li>
<li><strong>Mẫu 18 là câu về thông tin còn thiếu, và nó hữu dụng nhất trong công việc thật.</strong> Phần lớn quyết định tồi không phải do suy luận sai trên dữ kiện đang có; chúng là những quyết định đưa ra mà không ai hỏi dữ kiện nào đang thiếu. Đây cũng là cách lịch sự để phản biện người đi trước: không phải "anh sai", mà "mình cần biết thêm gì để chắc chắn?"</li>
<li><strong>Mẫu 23 là quy nạp trá hình.</strong> "Bạn thấy quy luật gì" chính là nước đi từ-trường-hợp-tới-quy-tắc của slide 8 — nên nó mang theo rủi ro của quy nạp: một quy luật nhìn thấy trên mẫu quá nhỏ. Ghép nó với mẫu 1 (bằng chứng cả hai chiều) là đã có sẵn một cái chốt kiểm.</li>
<li><strong>Mẫu 27 bị lủng củng ngay trên slide.</strong> "How do they work separately and together and different ways?" không phải một câu đúng ngữ pháp. Đó là lỗi của bản gốc; câu định hỏi rõ ràng là "chúng hoạt động riêng rẽ, hoạt động cùng nhau, và theo những cách khác nhau ra sao?"</li>
</ul>
<p class="nhan">📌 Bổ sung ngoài slide — <strong>VIẾT MÔ TẢ so với VIẾT PHẢN BIỆN</strong>, và cách các lập luận nối thành CHUỖI. Đây là chuẩn đầu ra 7, và là chỗ module quy đổi ra giấy trắng mực đen.</p>
<table>
<tr><th>Viết MÔ TẢ thì…</th><th>Viết PHẢN BIỆN thì…</th></tr>
<tr><td>Kể chuyện gì đã xảy ra, nguồn nói gì</td><td>Nói điều đó <em>CÓ NGHĨA GÌ</em> và kéo theo điều gì</td></tr>
<tr><td>Liệt kê nguồn nọ nối nguồn kia</td><td>Đặt các nguồn ĐỐI MẶT nhau và nói ai thuyết phục hơn, vì sao</td></tr>
<tr><td>Giải thích phương pháp</td><td>Biện minh vì sao phương pháp đó hợp với <em>CÂU HỎI NÀY</em></td></tr>
<tr><td>Báo cáo kết quả</td><td>Cân kết quả với luận điểm, kể cả những kết quả KHÔNG khớp</td></tr>
<tr><td>Kiếm được điểm qua môn</td><td>Kiếm được phần điểm nằm TRÊN mức qua môn</td></tr>
</table>
<ul>
<li><strong>Phép thử thực dụng trên đoạn văn của chính bạn: đếm số câu chỉ thuần TƯỜNG THUẬT.</strong> Nếu quá nửa phần "thảo luận" có thể do một người chưa từng nghĩ về chủ đề viết ra, thì đó là bài mô tả đang đội cái tiêu đề thảo luận.</li>
<li><strong>Lập luận nối nhau theo ba hình dạng, và biết chúng thì chữa được những đoạn văn rối.</strong> <em>Chuỗi nối tiếp</em>: A chống lưng B, B chống lưng C — mạnh, nhưng gãy sạch nếu một mắt xích hỏng. <em>Hội tụ</em>: ba lý do ĐỘC LẬP cùng chống lưng một kết luận — mất một cái thì yếu đi chứ không gãy. <em>Phân kỳ</em>: một lý do chống lưng cho nhiều kết luận. Phần lớn đoạn báo cáo TỐT là hội tụ; phần lớn đoạn MONG MANH là những chuỗi nối tiếp dài.</li>
<li><strong>Chuỗi nào cũng có mắt xích yếu nhất, hãy tìm nó trước khi người đọc tìm ra.</strong> Viết lập luận của bạn thành các bước đánh số rồi hỏi: một người tỉnh táo sẽ từ chối bước nào? Bước đó chính là chỗ bằng chứng phải đổ vào, và cũng chính là thứ mẫu câu 18 đang hỏi.</li>
<li><strong>Ở FPTU đây là khác biệt giữa điểm 6 và điểm 8 của một bài báo cáo.</strong> Một bản test plan SWR302 liệt kê các kỹ thuật là MÔ TẢ; một bản viết "chúng tôi chọn phân tích giá trị biên thay vì kiểm thử vét cạn vì không gian đầu vào cỡ 10^6 và lịch sử lỗi dồn ở các biên" là PHẢN BIỆN — luận điểm, bằng chứng, lập luận nối, gói trong một câu.</li>
</ul>
<p class="dap-an">✅ Áp mẫu câu 26 vào một lựa chọn thật — "chọn CSDL nào cho đồ án tốt nghiệp?" Nêu tiêu chí trước đã: (1) kỹ năng sẵn có của nhóm, (2) chi phí hosting, (3) nhu cầu giao dịch, (4) hệ sinh thái và tài liệu, (5) môn này sẽ chấm theo gì. Chấm điểm các phương án SAU đó. Chọn trước rồi liệt kê lý do sau là HỢP LÝ HOÁ, và người chấm nhận ra ngay.</p>
<p class="meo">💡 Hai con số cho phòng thi: trang này chứa mẫu câu <strong>17–28</strong>, nên cả kho là <strong>28</strong> mẫu câu trải trên slide 13 và 14. Và một câu để mang theo: <strong>mô tả nói CÁI GÌ, phản biện nói THÌ SAO và LÀM SAO TÔI BIẾT</strong>.</p>`],

      [15, 'The Mohammed case — applying critical thinking to academic integrity',
        `<p class="y-chinh">🎯 The closing slide, and the only full case study in the deck. Mohammed, a third-year epidemiology undergraduate, replicates a famous professor's experiment, finds a <strong>small calculation error</strong>, and when he fixes it the results change so much that <em>the conclusion is no longer correct</em>. He re-checks both his own work and the original several times, same answer. The paper has been <strong>cited many times</strong>. He raises it with the professor, who says not to worry, that <em>"is just how science is"</em>, and does nothing. <strong>What should Mohammed do now?</strong></p>
<table>
<tr><th>Element of the case</th><th>Why the deck put it there</th></tr>
<tr><td>He <strong>re-checks multiple times</strong></td><td>Removes the easy answer "maybe you made the mistake" — the evidence has been tested</td></tr>
<tr><td>The professor is <strong>highly regarded</strong></td><td>Sets authority against evidence — slide 6 question 4 versus slide 6 question 3</td></tr>
<tr><td>The paper is <strong>widely cited</strong></td><td>The error propagates: other people's work now rests on it. This is the systems-thinking part</td></tr>
<tr><td>The professor <strong>does nothing</strong></td><td>Turns a scientific question into an ethical one — inaction is itself a decision</td></tr>
<tr><td>Mohammed is a <strong>student under him</strong></td><td>Power asymmetry: the person who can fix it is also the person who grades him</td></tr>
</table>
<ul>
<li><strong>Run the five questions from slide 6 on the professor's reply.</strong> Who said it — an expert, yes. Reliable — the statement "that is just how science is" is not a finding, it is a dismissal. Evidence — none offered; he did not dispute a single number. Qualified — highly, which is exactly why the non-answer is telling. Personal interest — <em>yes, and it is direct</em>: his reputation and his citation count are at stake. Question 5 is the one that decides this case.</li>
<li><strong>Separate the three questions that are tangled together.</strong> (1) <em>Is the calculation wrong?</em> — factual, already checked, and checkable by others. (2) <em>Does the conclusion fail?</em> — technical, and it follows from (1). (3) <em>What should be done?</em> — ethical, and it does not follow from either. Most students answer (3) with feelings; the module wants (3) answered with reasons and procedure.</li>
<li><strong>"That is just how science is" is the claim to attack, and slide 8 hands you the weapon.</strong> Critical thinking is the <em>foundation of science</em> precisely because science is the practice of correcting published error. If errors that change conclusions may stand uncorrected, the thing being defended is not science but a reputation.</li>
<li><strong>Watch for the fallacies on both sides of this case.</strong> The professor's reply is close to an <em>appeal to authority</em> plus an <em>appeal to common practice</em> ("everybody's results are a bit like this"). And Mohammed must avoid <em>ad hominem</em>: the conclusion "the paper's result does not hold" must rest on the arithmetic, never on the professor's character or motive.</li>
<li><strong>What a defensible course of action looks like.</strong> Document everything — the original data, both calculations, dates, and a written record of the conversation. Ask a third party to replicate the arithmetic independently, so it is no longer his word against a professor's. Put the concern to the professor <em>in writing</em>, politely, offering that he may have missed something. If there is still no action, escalate through the formal route — research integrity office, department head, or the journal's correction process — not to social media, and not to fellow students as gossip. Keep the framing on the <em>calculation</em>, never on the person.</li>
<li><strong>The qualifier matters here too.</strong> The honest claim is "my recalculation, checked N times, changes the result, and I cannot reproduce the published figure" — not "the professor falsified data". Error and misconduct are different accusations with different evidence requirements, and conflating them is both unfair and tactically fatal.</li>
</ul>
<p class="dap-an">✅ What should Mohammed do? <strong>Escalate, in writing, through the formal integrity channel, after independent verification — while keeping the claim strictly about the calculation.</strong> Doing nothing is not neutral: the paper is already cited, so silence lets the error spread into other people's work. That is the module's whole point arriving in one decision — evidence over authority, a judgement actually reached (slide 5), cautious but evidence-based (slide 7), and real-world application (learning outcome 6).</p>
<p class="pitfall">⚠️ The trap answer is "respect the professor and drop it" — it feels like humility, and it is the <em>appeal to authority</em> the deck spent fifteen slides arming you against. The opposite trap is "expose him publicly", which skips verification and due process, turns an error into an accusation, and will not survive scrutiny either.</p>
<p class="meo">💡 Link outward: this is CSI106's professional-ethics chapter met inside SSL101c, and it is the same duty that makes you disclose a known defect before a release in SWP391/SWR302. Same rule in three subjects — <strong>a known error you can fix and hide is a decision, not an accident</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại deck, và là tình huống đầy đủ DUY NHẤT của cả bộ. Mohammed, sinh viên năm ba ngành dịch tễ học, làm lại thí nghiệm của một giáo sư nổi tiếng, phát hiện một <strong>lỗi tính toán nhỏ</strong>, và khi sửa lỗi đó thì kết quả đổi nhiều tới mức <em>kết luận không còn đúng nữa</em>. Cậu kiểm lại cả bài gốc lẫn bài của mình nhiều lần, vẫn ra cùng một kết quả. Bài báo đã <strong>được trích dẫn rất nhiều lần</strong>. Cậu mang chuyện đó tới gặp giáo sư; ông bảo đừng bận tâm, rằng <em>"khoa học nó vậy đó"</em>, rồi không làm gì cả. <strong>Bây giờ Mohammed nên làm gì?</strong></p>
<table>
<tr><th>Chi tiết của tình huống</th><th>Vì sao deck đặt nó vào đó</th></tr>
<tr><td>Cậu <strong>kiểm lại nhiều lần</strong></td><td>Loại bỏ câu trả lời dễ dãi "có khi em tính sai đấy" — bằng chứng đã được thử đi thử lại</td></tr>
<tr><td>Giáo sư <strong>rất được kính nể</strong></td><td>Đặt UY TÍN đối đầu với BẰNG CHỨNG — câu 4 của slide 6 chọi câu 3 của slide 6</td></tr>
<tr><td>Bài báo <strong>được trích rất nhiều</strong></td><td>Lỗi LAN RA: công trình của người khác giờ đang dựng trên nó. Đây là phần tư duy hệ thống</td></tr>
<tr><td>Giáo sư <strong>không làm gì cả</strong></td><td>Biến một câu hỏi khoa học thành câu hỏi ĐẠO ĐỨC — không hành động tự nó đã là một quyết định</td></tr>
<tr><td>Mohammed là <strong>sinh viên do ông hướng dẫn</strong></td><td>Bất đối xứng quyền lực: người có thể sửa chuyện này cũng chính là người chấm điểm cậu</td></tr>
</table>
<ul>
<li><strong>Chạy năm câu hỏi của slide 6 lên chính câu trả lời của giáo sư.</strong> Ai nói — một chuyên gia, đúng. Đáng tin — câu "khoa học nó vậy đó" không phải một phát hiện, nó là một cái gạt đi. Bằng chứng — không đưa ra gì cả; ông không phản bác lấy một con số. Chuyên môn — rất cao, và chính vì thế câu trả lời trống rỗng kia mới đáng nói. Lợi ích cá nhân — <em>CÓ, và trực tiếp</em>: danh tiếng và số lượt trích dẫn của ông đang bị đặt lên bàn. Câu số 5 là câu quyết định tình huống này.</li>
<li><strong>Tách ba câu hỏi đang bện vào nhau.</strong> (1) <em>Phép tính có sai không?</em> — thuộc về SỰ KIỆN, đã kiểm, và người khác cũng kiểm được. (2) <em>Kết luận có sụp không?</em> — thuộc về KỸ THUẬT, và nó suy ra từ (1). (3) <em>Nên làm gì?</em> — thuộc về ĐẠO ĐỨC, và nó KHÔNG suy ra từ hai câu kia. Phần lớn sinh viên trả lời (3) bằng cảm xúc; module đòi trả lời (3) bằng lý lẽ và quy trình.</li>
<li><strong>"Khoa học nó vậy đó" chính là khẳng định cần công phá, và slide 8 đã trao sẵn vũ khí.</strong> Tư duy phản biện là <em>NỀN TẢNG CỦA KHOA HỌC</em> đúng ở chỗ khoa học là công việc SỬA những sai sót đã công bố. Nếu những sai sót làm đổi cả kết luận mà vẫn được phép nằm yên, thì thứ đang được bảo vệ không phải khoa học, mà là một danh tiếng.</li>
<li><strong>Canh nguỵ biện ở CẢ HAI phía của tình huống.</strong> Câu trả lời của giáo sư gần với <em>vin vào uy tín</em> cộng <em>vin vào thông lệ</em> ("kết quả của ai chẳng lệch chút đỉnh"). Và Mohammed phải tránh <em>công kích cá nhân</em>: kết luận "kết quả của bài báo không đứng vững" phải dựa trên PHÉP TÍNH, không bao giờ dựa trên nhân cách hay động cơ của giáo sư.</li>
<li><strong>Một cách hành xử BẢO VỆ ĐƯỢC trông như thế nào.</strong> Lưu lại mọi thứ — dữ liệu gốc, cả hai phép tính, ngày tháng, và một bản ghi bằng chữ về cuộc trao đổi. Nhờ một BÊN THỨ BA độc lập tính lại, để chuyện không còn là lời của cậu chọi lời một giáo sư. Nêu lại mối lo với giáo sư <em>BẰNG VĂN BẢN</em>, lịch sự, để ngỏ khả năng chính mình bỏ sót điều gì. Nếu vẫn không ai làm gì, đi tiếp theo đường CHÍNH THỨC — bộ phận liêm chính học thuật, trưởng bộ môn, hoặc quy trình đính chính của tạp chí — chứ không lên mạng xã hội, cũng không kể như chuyện phiếm với bạn cùng lớp. Giữ khung câu chuyện ở <em>PHÉP TÍNH</em>, tuyệt đối không ở CON NGƯỜI.</li>
<li><strong>Phần GIỚI HẠN cũng quan trọng ở đây.</strong> Khẳng định trung thực là "phép tính lại của tôi, đã kiểm N lần, làm đổi kết quả, và tôi không tái tạo được con số đã công bố" — chứ không phải "giáo sư nguỵ tạo dữ liệu". SAI SÓT và GIAN LẬN là hai lời buộc tội khác nhau với yêu cầu bằng chứng khác nhau, và gộp chúng vừa bất công vừa tự sát về mặt chiến thuật.</li>
</ul>
<p class="dap-an">✅ Mohammed nên làm gì? <strong>Đưa vụ việc lên cấp cao hơn, BẰNG VĂN BẢN, qua kênh liêm chính chính thức, SAU khi đã có người độc lập xác nhận — và giữ khẳng định gói gọn trong phép tính.</strong> Không làm gì KHÔNG phải là trung lập: bài báo đã được trích dẫn, nên im lặng là để sai sót lan vào công trình của người khác. Đó là toàn bộ ý của module đọng lại trong một quyết định — bằng chứng thắng uy tín, một phán đoán được THẬT SỰ đưa ra (slide 5), thận trọng nhưng dựa trên bằng chứng (slide 7), và áp dụng vào đời thật (chuẩn đầu ra 6).</p>
<p class="pitfall">⚠️ Đáp án bẫy là "tôn trọng thầy và cho qua đi" — nó trông giống sự khiêm nhường, và nó chính là <em>nguỵ biện vin vào uy tín</em> mà deck đã dành mười lăm slide để trang bị cho bạn chống lại. Bẫy ngược lại là "bóc phốt công khai", vốn bỏ qua khâu xác minh và quy trình chính thức, biến một sai sót thành một lời buộc tội, và cũng sẽ không sống nổi khi bị soi.</p>
<p class="meo">💡 Nối ra ngoài: đây chính là chương đạo đức nghề nghiệp của CSI106 gặp lại bên trong SSL101c, và cũng là bổn phận buộc bạn phải khai báo một lỗi đã biết trước khi phát hành trong SWP391/SWR302. Cùng một luật ở ba môn — <strong>một lỗi bạn đã biết, sửa được mà giấu đi, là một QUYẾT ĐỊNH chứ không phải một tai nạn</strong>.</p>`],

    ]),
  ].join('\n'),
};
