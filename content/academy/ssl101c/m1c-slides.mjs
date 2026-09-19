/**
 * SSL101c · Mooc 1 (deck 'ssl1') — slide 56–82, học theo từng slide.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). File /tmp/ssl101c-text/ssl1.txt gần như RỖNG — không dùng được. Toàn bộ
 * 27 slide trong dải này đã được ĐỌC THẲNG TỪ ẢNH
 * (/tmp/ssl101c-slides/ssl1/056.webp … 082.webp), từng chữ một.
 *
 * Nội dung THẬT của dải 56–82 (khác với phỏng đoán ban đầu "quản lý thông tin
 * + đạo văn + trích dẫn" ở chỗ có hẳn một khối lớn về ĐỌC HỌC THUẬT):
 *   56–57  3.3b Managing information: Folders  → 4C của cây thư mục
 *   58–63  3.4a Processing and Coding: Step 1 & 2 → quy trình đọc 3 bước
 *   64–71  3.4b Processing and Coding: Step 3 → 4 phase, ma trận tổng hợp
 *   72–77  4.1 Avoiding Plagiarism → 2 định nghĩa, 3 loại, cái gì phải trích
 *   78–82  4.2 Referencing and Attributing Sources → system/style, endnotes,
 *          footnotes (abbreviation & name-date), in-text citing
 *
 * ⚠️ Slide 74 dùng TEMPLATE KHÁC HẲN (nền trắng, font khác) — đây là slide
 * chèn thêm của FPTU/giảng viên, không thuộc bộ Sydney gốc. Đã nêu rõ trong bài
 * thay vì im lặng chép.
 *
 * ⚠️ Slide 63 và 71 đều mang ĐÚNG một tiêu đề "Summary: Purpose in Academic
 * Reading" nhưng tóm tắt hai phần khác nhau (63 = Step 1-3; 71 = 4 phase của
 * Step 3). Không phải lặp lỗi.
 *
 * ⚠️ Slide 58 và 64 in ĐÚNG hai bullet giống hệt nhau ("use strategies to
 * efficiently read…" / "select & prepare…") dù một cái là 3.4a một cái là 3.4b
 * — đó là lỗi của chính file gốc, hai phần có nội dung khác nhau hoàn toàn.
 *
 * Phần quote/paraphrase/summarise, APA·IEEE·Harvard, Mendeley/Zotero và ranh
 * giới dùng AI KHÔNG in trên slide 56–82 (4.3a bắt đầu ở slide 83). Bài này
 * vẫn dạy đủ vì đó là trọng tâm đề thi, và NÓI RÕ chỗ nào là slide, chỗ nào là
 * phần mở rộng.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl1';

export default {
  title: '1.0c — Slide by slide: Folders, purposeful academic reading, plagiarism and referencing systems (slides 56–82)|||1.0c — Slide bài giảng: Thư mục, đọc học thuật có mục đích, đạo văn & hệ trích dẫn (slide 56–82)',
  slug: 'ssl101c-1-0c-slides-quan-ly-thong-tin-trich-dan',
  type: 'DOCUMENT',
  description: 'Học theo từng slide 27 slide cuối của Mooc 1 (slide 56–82), khối nặng điểm thi nhất của cả SSL101c. Đi từ cách đặt tên file và dựng cây thư mục (4C: Clear · Concise · Consistent · Chronological), qua quy trình ĐỌC HỌC THUẬT 3 bước và 4 phase tổng hợp thông tin bằng ma trận tác giả × chủ đề, rồi tới hai định nghĩa đạo văn, ba loại đạo văn (kể cả tự đạo văn), sáu thứ bắt buộc phải trích nguồn, và cuối cùng là ba hệ trích dẫn Endnotes · Footnotes · In-text citing với ví dụ thật từ chính slide. Bổ sung phần đề thi hay hỏi mà slide chưa in: quote/paraphrase/summarise có ví dụ đủ ba bản, bảng so APA · IEEE · Harvard, các bước dùng Mendeley/Zotero, và ranh giới dùng AI thế nào là hợp lệ.',
  content: [
    walkHead(D, 56, 82,
      'These 27 slides close Mooc 1 and carry the heaviest share of the exam: organising information, reading academic sources with a purpose, plagiarism, and referencing systems.',
      'Đây là 27 slide khép lại Mooc 1 và là phần nặng điểm thi nhất: tổ chức thông tin, đọc nguồn học thuật có mục đích, đạo văn, và các hệ trích dẫn.'),
    walk(D, [

      [56, '3.3b Managing information: Folders',
        `<p class="y-chinh">🎯 A section-opening slide with two learning outcomes: <strong>use file-naming conventions to effectively label information</strong>, and <strong>use folder hierarchies to store information</strong>. Finding a source again is part of research, not admin.</p>
<ul>
<li><strong>Two separate skills, not one.</strong> <em>Naming</em> is about the label on a single file; <em>hierarchy</em> is about where that file sits. You can have perfect names inside a single chaotic folder, or a beautiful tree full of files called <code>Document1.docx</code>. The slide asks for both.</li>
<li><strong>Why the MOOC puts this next to plagiarism.</strong> Most unintentional plagiarism starts as a filing failure: you saved a downloaded PDF's text into your draft, lost track of which words were yours, and submitted it. Good naming is the cheapest anti-plagiarism tool you own.</li>
<li><strong>The convention that survives four years.</strong> <code>COURSE_Topic_Author_Year_vN</code> — for example <code>SSL101c_plagiarism_Greetham_2013_v2.pdf</code>. It sorts predictably, it is searchable by any of its parts, and it still tells you what the file is two semesters later.</li>
<li><strong>Applied at FPTU.</strong> You take 6–8 subjects a semester, each with slides, labs, assignments and reference PDFs. A flat <code>Downloads</code> folder is unusable by week 4. Build the tree in week 1, before there is anything in it — after week 6 nobody ever goes back and reorganises.</li>
<li><strong>Digital literacy, measured.</strong> Mooc 1 defines digital literacy as the ability to find, evaluate, manage and use information. Managing is the step students skip, and it is the one that costs hours later when an assignment asks "where did this figure come from?".</li>
</ul>
<p class="meo">💡 Exam hook: the slide number <strong>3.3b</strong> tells you this belongs to section 3.3 <em>Managing information</em>. Section 3.3a (earlier) covered evaluating and storing; 3.3b is the practical half — folders and file names.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu một mục, với hai mục tiêu học tập: <strong>dùng quy ước đặt tên file để dán nhãn thông tin hiệu quả</strong>, và <strong>dùng cây thư mục phân cấp để lưu trữ thông tin</strong>. Tìm lại được một nguồn cũng là một phần của nghiên cứu, không phải việc hành chính.</p>
<ul>
<li><strong>Hai kỹ năng RIÊNG, không phải một.</strong> <em>Đặt tên</em> nói về cái nhãn dán lên một file; <em>phân cấp</em> nói về chỗ file đó nằm. Bạn có thể đặt tên hoàn hảo mà ném hết vào một thư mục hỗn độn, hoặc dựng một cây rất đẹp nhưng bên trong toàn <code>Document1.docx</code>. Slide đòi CẢ HAI.</li>
<li><strong>Vì sao MOOC xếp phần này ngay cạnh đạo văn.</strong> Phần lớn đạo văn KHÔNG CỐ Ý bắt đầu từ một lỗi lưu trữ: bạn chép chữ trong PDF tải về vào bản nháp, rồi không còn nhớ đoạn nào là của mình, và nộp. Đặt tên tử tế là công cụ chống đạo văn rẻ nhất bạn có.</li>
<li><strong>Quy ước sống được bốn năm.</strong> <code>MAMON_ChuDe_TacGia_Nam_vN</code> — ví dụ <code>SSL101c_daovan_Greetham_2013_v2.pdf</code>. Nó sắp xếp đoán được, tìm được theo bất kỳ mảnh nào, và hai học kỳ sau vẫn tự khai nó là cái gì.</li>
<li><strong>Áp dụng ở FPTU.</strong> Mỗi kỳ bạn học 6–8 môn, môn nào cũng có slide, lab, assignment và PDF tham khảo. Thư mục <code>Downloads</code> phẳng lì thì tới tuần 4 là hết dùng được. Dựng cây ngay TUẦN 1, lúc còn chưa có gì trong đó — sau tuần 6 thì không ai quay lại sắp xếp nữa.</li>
<li><strong>Digital literacy, đo được.</strong> Mooc 1 định nghĩa năng lực số là khả năng TÌM · ĐÁNH GIÁ · QUẢN LÝ · SỬ DỤNG thông tin. "Quản lý" là bước sinh viên hay bỏ qua nhất, và là bước trả giá đắt nhất khi assignment hỏi "cái biểu đồ này lấy từ đâu?".</li>
</ul>
<p class="meo">💡 Mẹo thi: số hiệu <strong>3.3b</strong> cho biết slide thuộc mục 3.3 <em>Managing information</em>. Mục 3.3a (trước đó) nói về đánh giá và lưu trữ; 3.3b là nửa thực hành — thư mục và tên file.</p>`],

      [57, 'Summary: Folder Hierarchies — Clear, Concise, Consistent, Chronological',
        `<p class="y-chinh">🎯 The four rules for a folder hierarchy, and they all start with C — this is a <strong>memorise-the-list</strong> slide, exactly the shape a multiple-choice question likes.</p>
<table>
<tr><th>Rule</th><th>The slide's wording</th><th>What it looks like in practice</th></tr>
<tr><td><strong>Clear</strong></td><td>use course codes and obvious headings</td><td><code>SSL101c/</code>, not <code>English stuff/</code>. The course code is unambiguous and it is what the university itself uses</td></tr>
<tr><td><strong>Concise</strong></td><td>keep the names short</td><td><code>assignments/</code>, not <code>my assignments for this semester/</code>. Long names get truncated in file dialogs and break sync tools</td></tr>
<tr><td><strong>Consistent</strong></td><td>use the same format all the time</td><td>Pick <code>2026S1</code> or <code>Spring2026</code> — then never mix them. Mixed formats destroy alphabetical sorting</td></tr>
<tr><td><strong>Chronological</strong></td><td>organize according to semester and year</td><td>Top level is time: <code>2026-Spring/</code> → <code>SSL101c/</code> → <code>readings/</code></td></tr>
</table>
<ul>
<li><strong>Consistency beats cleverness.</strong> A mediocre convention applied every single time is worth more than a brilliant one applied half the time. The computer sorts by exact characters, so <code>Spring 2026</code> and <code>2026 Spring</code> land in completely different places.</li>
<li><strong>Chronological first, subject second.</strong> Time is the only dimension that never collides — you take SSL101c once, in one semester. Put year/semester at the top and the tree never needs restructuring.</li>
<li><strong>Dates inside file names go YYYY-MM-DD.</strong> <code>2026-03-15_draft.docx</code> sorts correctly by name; <code>15-3-2026</code> and <code>Mar15</code> do not. This is not on the slide but it is the single most useful consequence of "consistent".</li>
<li><strong>Where it pays off at FPTU.</strong> Group projects (SWP391, SWR302) where four people push files to one shared Drive. Agree on the convention in the first meeting or you will spend the last night before the deadline hunting for the newest version.</li>
</ul>
<p class="pitfall">⚠️ Trap: the four Cs describe a <strong>folder hierarchy</strong>, and slide 56 separately asked for <strong>file-naming conventions</strong>. A question may ask which of the four is about "organising by semester and year" — that is <em>Chronological</em>, not <em>Consistent</em>.</p>`,
        `<p class="y-chinh">🎯 Bốn quy tắc cho cây thư mục, và cả bốn đều bắt đầu bằng chữ C — đây là slide <strong>HỌC THUỘC DANH SÁCH</strong>, đúng dạng mà câu trắc nghiệm rất thích.</p>
<table>
<tr><th>Quy tắc</th><th>Chữ trên slide</th><th>Trông ra sao khi làm thật</th></tr>
<tr><td><strong>Clear — RÕ</strong></td><td>dùng mã môn và tiêu đề hiển nhiên</td><td><code>SSL101c/</code>, chứ không phải <code>mấy thứ tiếng Anh/</code>. Mã môn không thể hiểu nhầm, và chính trường cũng dùng nó</td></tr>
<tr><td><strong>Concise — GỌN</strong></td><td>giữ tên ngắn</td><td><code>assignments/</code>, chứ không phải <code>bài tập của tôi kỳ này/</code>. Tên dài bị cắt trong hộp thoại chọn file và làm hỏng công cụ đồng bộ</td></tr>
<tr><td><strong>Consistent — NHẤT QUÁN</strong></td><td>luôn dùng CÙNG một định dạng</td><td>Chọn <code>2026S1</code> hoặc <code>Spring2026</code> — rồi đừng bao giờ trộn. Trộn định dạng là phá nát thứ tự sắp xếp</td></tr>
<tr><td><strong>Chronological — THEO THỜI GIAN</strong></td><td>sắp theo học kỳ và năm</td><td>Tầng trên cùng là thời gian: <code>2026-Spring/</code> → <code>SSL101c/</code> → <code>readings/</code></td></tr>
</table>
<ul>
<li><strong>Nhất quán thắng thông minh.</strong> Một quy ước tầm thường mà áp dụng LẦN NÀO CŨNG THẾ thì giá trị hơn một quy ước tuyệt vời áp dụng được nửa số lần. Máy tính sắp xếp theo đúng từng ký tự, nên <code>Spring 2026</code> và <code>2026 Spring</code> rơi vào hai chỗ hoàn toàn khác nhau.</li>
<li><strong>Thời gian trước, môn học sau.</strong> Thời gian là chiều duy nhất không bao giờ đụng nhau — bạn học SSL101c đúng một lần, trong đúng một kỳ. Đặt năm/kỳ ở tầng trên cùng thì cây không bao giờ phải dựng lại.</li>
<li><strong>Ngày tháng trong tên file thì viết YYYY-MM-DD.</strong> <code>2026-03-15_draft.docx</code> sắp xếp đúng theo tên; <code>15-3-2026</code> và <code>15Thang3</code> thì không. Điều này không có trên slide nhưng là hệ quả hữu ích nhất của chữ "consistent".</li>
<li><strong>Nó ăn tiền ở đâu tại FPTU.</strong> Đồ án nhóm (SWP391, SWR302) khi bốn người cùng đẩy file lên một Drive chung. Thống nhất quy ước ngay buổi họp đầu, không thì đêm cuối trước hạn nộp sẽ ngồi mò xem bản nào mới nhất.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: bốn chữ C mô tả <strong>CÂY THƯ MỤC</strong>, còn slide 56 hỏi riêng về <strong>QUY ƯỚC ĐẶT TÊN FILE</strong>. Đề có thể hỏi cái nào nói về "sắp theo học kỳ và năm" — đó là <em>Chronological</em>, KHÔNG phải <em>Consistent</em>.</p>`],

      [58, '3.4a Processing and Coding: Step 1 and 2 (learning outcomes)',
        `<p class="y-chinh">🎯 Section 3.4 opens: <strong>use strategies to efficiently read &amp; understand relevant aspects of selected sources</strong>, and <strong>select &amp; prepare relevant information for assignments</strong>. Note the word <em>efficiently</em> — the whole section is about not reading everything.</p>
<ul>
<li><strong>"Processing and coding" is the technical name for what comes after searching.</strong> You already found sources (3.1–3.2) and stored them (3.3). Now you must turn a pile of PDFs into material you can actually write from. That conversion is what 3.4 teaches.</li>
<li><strong>"Relevant aspects of selected sources" — two filters stacked.</strong> First you select which sources; then, inside each one, which aspects. A 20-page journal article may contribute two sentences to your assignment, and that is normal.</li>
<li><strong>Why efficiency is a skill and not laziness.</strong> A research assignment may involve 15–30 sources. Reading each one cover to cover at academic speed is 40+ hours. The three-step process on the next slide brings it down to something a semester can hold.</li>
<li><strong>Applied at FPTU.</strong> For a capstone or a SWR302 report you are expected to cite real literature. The skill that decides whether you finish is triage — deciding in five minutes whether a paper is worth an hour.</li>
</ul>
<p class="pitfall">⚠️ Slide 64 (section 3.4b) prints these <strong>exact same two bullets</strong>. That is a duplication in the original deck, not a hint that 3.4a and 3.4b cover the same thing — 3.4a is Steps 1 and 2, 3.4b is Step 3.</p>`,
        `<p class="y-chinh">🎯 Mục 3.4 mở màn: <strong>dùng chiến lược để đọc và hiểu HIỆU QUẢ những khía cạnh liên quan của các nguồn đã chọn</strong>, và <strong>chọn lọc &amp; chuẩn bị thông tin liên quan cho bài tập</strong>. Để ý chữ <em>efficiently</em> — cả mục này nói về việc KHÔNG đọc hết mọi thứ.</p>
<ul>
<li><strong>"Processing and coding" là tên kỹ thuật của việc làm sau khi tìm xong.</strong> Bạn đã tìm được nguồn (3.1–3.2) và lưu chúng (3.3). Giờ phải biến một đống PDF thành vật liệu thật sự viết bài được. Chính cái chuyển hoá đó là thứ 3.4 dạy.</li>
<li><strong>"Relevant aspects of selected sources" — HAI bộ lọc chồng lên nhau.</strong> Trước hết chọn NGUỒN nào; sau đó, bên trong từng nguồn, chọn KHÍA CẠNH nào. Một bài báo 20 trang có thể chỉ góp hai câu vào bài của bạn, và như thế là bình thường.</li>
<li><strong>Vì sao "hiệu quả" là kỹ năng chứ không phải lười.</strong> Một bài nghiên cứu có thể dính tới 15–30 nguồn. Đọc hết từng cái từ đầu tới cuối ở tốc độ học thuật là hơn 40 giờ. Quy trình ba bước ở slide sau kéo nó về mức một học kỳ chứa nổi.</li>
<li><strong>Áp dụng ở FPTU.</strong> Với đồ án tốt nghiệp hay báo cáo SWR302, bạn buộc phải trích tài liệu thật. Kỹ năng quyết định bạn có xong hay không là PHÂN LOẠI NHANH — quyết trong năm phút xem một bài báo có đáng một giờ hay không.</li>
</ul>
<p class="pitfall">⚠️ Slide 64 (mục 3.4b) in <strong>ĐÚNG HAI BULLET Y HỆT</strong>. Đó là lỗi lặp của chính bộ slide gốc, không phải dấu hiệu 3.4a và 3.4b cùng nội dung — 3.4a là Bước 1 và 2, 3.4b là Bước 3.</p>`],

      [59, 'Purpose in Academic Reading — A Three Step Process',
        `<p class="y-chinh">🎯 The backbone of the whole section, and one of the most quotable slides in Mooc 1: reading an academic source is <strong>three passes with three different purposes</strong>, not one long read.</p>
<table>
<tr><th>Pass</th><th>Purpose (slide's words)</th><th>Question you are answering</th><th>What you read</th></tr>
<tr><td><strong>Step One</strong></td><td>Assess credibility and relevance · Understand main ideas</td><td>Is this worth my time at all?</td><td>Abstract, introduction, headings, conclusion</td></tr>
<tr><td><strong>Step Two</strong></td><td>Gain further understanding</td><td>What exactly does it say that I need?</td><td>The body — but only the relevant sections</td></tr>
<tr><td><strong>Step Three</strong></td><td>Make detailed notes</td><td>How does it fit into my argument?</td><td>Nothing new — you now extract and organise</td></tr>
</table>
<ul>
<li><strong>Each step has a decision at its end.</strong> Step One ends with keep-or-discard. Step Two ends with a set of marked passages. Step Three ends with a filled matrix you can write from. If a step does not produce its output, you did not do it.</li>
<li><strong>The order is not negotiable.</strong> Taking detailed notes (Step Three) on a source you have not yet judged credible (Step One) is the classic waste — you will discard the source and the notes together.</li>
<li><strong>"Purpose" is the load-bearing word in the title.</strong> The same article read for three different assignments yields three different sets of notes. You read <em>against a research question</em>, never in the abstract.</li>
<li><strong>It is the academic version of skim → scan → study.</strong> If you met SQ3R or a similar method in school, this is the same family, adapted to journal articles rather than textbooks.</li>
</ul>
<p class="meo">💡 Memorise this as <strong>JUDGE → UNDERSTAND → RECORD</strong>. Three verbs, in that order. Slide 63 summarises exactly this list, which is a strong signal that it is examinable.</p>`,
        `<p class="y-chinh">🎯 Xương sống của cả mục, và là một trong những slide dễ ra đề nhất Mooc 1: đọc một nguồn học thuật là <strong>BA LƯỢT với BA MỤC ĐÍCH khác nhau</strong>, không phải một lượt đọc dài.</p>
<table>
<tr><th>Lượt</th><th>Mục đích (chữ của slide)</th><th>Câu hỏi bạn đang trả lời</th><th>Đọc cái gì</th></tr>
<tr><td><strong>Step One</strong></td><td>Đánh giá độ tin cậy và mức liên quan · Nắm ý chính</td><td>Cái này có đáng thời gian của tôi không?</td><td>Tóm tắt, mở đầu, tiêu đề mục, kết luận</td></tr>
<tr><td><strong>Step Two</strong></td><td>Hiểu sâu thêm</td><td>Chính xác nó nói gì mà tôi cần?</td><td>Phần thân — nhưng CHỈ những mục liên quan</td></tr>
<tr><td><strong>Step Three</strong></td><td>Ghi chú chi tiết</td><td>Nó khớp vào lập luận của tôi ở đâu?</td><td>Không đọc gì mới — giờ là rút ra và sắp xếp</td></tr>
</table>
<ul>
<li><strong>Mỗi bước kết thúc bằng một QUYẾT ĐỊNH.</strong> Bước Một kết bằng giữ-hay-bỏ. Bước Hai kết bằng một tập đoạn đã đánh dấu. Bước Ba kết bằng một cái bảng điền đầy, viết bài được luôn. Bước nào không đẻ ra sản phẩm của nó thì bạn chưa làm bước đó.</li>
<li><strong>Thứ tự KHÔNG thương lượng.</strong> Ghi chú chi tiết (Bước Ba) cho một nguồn mà bạn còn chưa xét độ tin cậy (Bước Một) là kiểu phí công kinh điển — rồi bạn sẽ vứt cả nguồn lẫn ghi chú.</li>
<li><strong>"Purpose" là chữ chịu lực trong tiêu đề.</strong> Cùng một bài báo, đọc cho ba bài tập khác nhau sẽ ra ba tập ghi chú khác nhau. Bạn đọc <em>ĐỐI CHIẾU VỚI câu hỏi nghiên cứu</em>, không bao giờ đọc chung chung.</li>
<li><strong>Đây là bản học thuật của skim → scan → study.</strong> Nếu bạn từng gặp SQ3R hay phương pháp tương tự hồi phổ thông, đây cùng họ, được chỉnh cho bài báo khoa học thay vì sách giáo khoa.</li>
</ul>
<p class="meo">💡 Nhớ bằng <strong>XÉT → HIỂU → GHI</strong>. Ba động từ, đúng thứ tự đó. Slide 63 tóm tắt đúng y danh sách này — dấu hiệu rất mạnh rằng nó sẽ vào đề.</p>`],

      [60, 'Step One — read abstract, introduction, headings, conclusion; then decide',
        `<p class="y-chinh">🎯 Step One in full detail. <strong>Read carefully</strong>: Abstract · Introduction · Headings/subheadings · Conclusion. A brace on the slide joins all four to one instruction: <strong>circle or highlight relevant-sounding sources</strong>. Then: <strong>Decide: read further or put aside?</strong></p>
<table>
<tr><th>Part</th><th>What it tells you in 60 seconds</th></tr>
<tr><td><strong>Abstract</strong></td><td>The whole argument compressed: question, method, main finding. If the finding is irrelevant, stop here</td></tr>
<tr><td><strong>Introduction</strong></td><td>Why the authors did it and what gap they claim to fill — this is where you see whether their question overlaps yours</td></tr>
<tr><td><strong>Headings/subheadings</strong></td><td>The skeleton. Tells you which section (if any) you will need in Step Two</td></tr>
<tr><td><strong>Conclusion</strong></td><td>What they claim they showed, plus limitations. Often more honest than the abstract</td></tr>
</table>
<ul>
<li><strong>Notice what is NOT on the list: the body.</strong> Step One deliberately skips methods, results and discussion. Reading them now would cost 40 minutes to learn something the abstract told you in one.</li>
<li><strong>"Circle or highlight relevant-sounding sources" is a physical act.</strong> The slide wants a mark on the page, not a mental note. Marking is what makes Step Two fast — you return to marks, not to memory.</li>
<li><strong>The closing question is the point of the whole step.</strong> "Read further or put aside?" is a binary. Putting a source aside is a <em>successful</em> outcome of Step One, not a failure — most sources you find should end up aside.</li>
<li><strong>Credibility is judged here too.</strong> Who wrote it, when, who published it, is it peer-reviewed, is it cited. A source that is perfectly relevant but not credible is discarded at exactly this point.</li>
<li><strong>Applied at FPTU.</strong> Google Scholar gives you 40 hits. Step One on all 40 takes about an hour and leaves you 6 worth reading. That hour is the best-spent hour of the assignment.</li>
</ul>
<p class="pitfall">⚠️ Common exam confusion: Step One reads <strong>Abstract + Introduction + Headings + Conclusion</strong> — four things. Distractor answers usually swap "Conclusion" for "Results" or add "Methodology". The body belongs to Step Two.</p>`,
        `<p class="y-chinh">🎯 Bước Một, chi tiết đầy đủ. <strong>Đọc kỹ</strong>: Abstract · Introduction · Headings/subheadings · Conclusion. Trên slide có một dấu ngoặc nhọn gom cả bốn vào MỘT chỉ dẫn: <strong>khoanh tròn hoặc tô sáng những nguồn NGHE CÓ VẺ liên quan</strong>. Rồi: <strong>Quyết định: đọc tiếp hay để sang một bên?</strong></p>
<table>
<tr><th>Phần</th><th>Nó cho bạn biết gì trong 60 giây</th></tr>
<tr><td><strong>Abstract</strong></td><td>Toàn bộ lập luận nén lại: câu hỏi, phương pháp, phát hiện chính. Phát hiện không liên quan thì dừng ngay ở đây</td></tr>
<tr><td><strong>Introduction</strong></td><td>Vì sao tác giả làm và họ nhận là lấp khoảng trống nào — đây là chỗ bạn thấy câu hỏi của họ có chồng lên câu hỏi của bạn không</td></tr>
<tr><td><strong>Headings/subheadings</strong></td><td>Bộ xương. Cho biết mục nào (nếu có) bạn sẽ cần ở Bước Hai</td></tr>
<tr><td><strong>Conclusion</strong></td><td>Họ khẳng định đã chứng minh được gì, kèm hạn chế. Thường thật thà hơn cả abstract</td></tr>
</table>
<ul>
<li><strong>Để ý cái KHÔNG có trong danh sách: phần THÂN.</strong> Bước Một cố tình bỏ qua phương pháp, kết quả, thảo luận. Đọc chúng lúc này tốn 40 phút để biết một điều mà abstract đã nói trong một phút.</li>
<li><strong>"Khoanh hoặc tô sáng" là một hành động VẬT LÝ.</strong> Slide muốn có dấu trên trang giấy, không phải ghi nhớ trong đầu. Chính việc đánh dấu làm Bước Hai nhanh — bạn quay lại chỗ đánh dấu, chứ không quay lại trí nhớ.</li>
<li><strong>Câu hỏi khép lại mới là mục đích của cả bước.</strong> "Đọc tiếp hay để sang bên?" là nhị phân. Để một nguồn sang bên là kết quả <em>THÀNH CÔNG</em> của Bước Một, không phải thất bại — phần lớn nguồn bạn tìm thấy LẼ RA phải nằm sang bên.</li>
<li><strong>Độ tin cậy cũng xét ở đây.</strong> Ai viết, viết khi nào, ai xuất bản, có phản biện không, có được trích dẫn không. Một nguồn liên quan hoàn hảo nhưng không đáng tin thì bị loại đúng tại điểm này.</li>
<li><strong>Áp dụng ở FPTU.</strong> Google Scholar trả 40 kết quả. Làm Bước Một cho cả 40 mất khoảng một giờ và còn lại 6 cái đáng đọc. Đó là giờ đáng giá nhất của cả bài tập.</li>
</ul>
<p class="pitfall">⚠️ Chỗ hay nhầm trong đề: Bước Một đọc <strong>Abstract + Introduction + Headings + Conclusion</strong> — BỐN thứ. Đáp án nhiễu thường thay "Conclusion" bằng "Results" hoặc thêm "Methodology". Phần thân thuộc về Bước Hai.</p>`],

      [61, 'Step Two — the body, topic sentences, visual information, skip the rest',
        `<p class="y-chinh">🎯 Step Two, five instructions: <strong>Focus on the body of the source</strong> · <strong>Re-read headings and topic sentences</strong> · for relevant sections, <strong>read carefully</strong> and <strong>carefully examine visual information (graphs, tables etc.)</strong> · <strong>skip less-relevant or irrelevant sections</strong>.</p>
<ul>
<li><strong>Now — and only now — the body.</strong> Step One never opened it. This is the division of labour that makes the whole process efficient: you pay body-reading cost only for sources that earned it.</li>
<li><strong>"Re-read headings and topic sentences" is the navigation pass.</strong> The topic sentence is the first sentence of a paragraph and carries its claim. Reading only topic sentences gives you the argument's spine in a couple of minutes, and tells you which paragraphs deserve full attention.</li>
<li><strong>"Carefully examine visual information" is the instruction students most often skip.</strong> In an empirical paper the evidence <em>is</em> the figures and tables; the prose merely describes them. A table also gives you numbers you can cite precisely — which is what a grader rewards.</li>
<li><strong>"Skip" is an explicit permission.</strong> The slide licenses you to not read parts of an academic source. Skipping is a decision made <em>after</em> you looked at the heading, not avoidance.</li>
<li><strong>Applied at FPTU.</strong> In an IT paper the Related Work section is often the highest-value part for a student — it summarises a whole field and hands you a reading list. The mathematical proof section usually is not. Step Two is where you make that call.</li>
</ul>
<p class="meo">💡 Practical order for a journal article in Step Two: headings → topic sentences → figures and tables → then full prose of the 2–3 sections that survived. Most students do the reverse and run out of time in the methods section.</p>`,
        `<p class="y-chinh">🎯 Bước Hai, năm chỉ dẫn: <strong>Tập trung vào phần THÂN của nguồn</strong> · <strong>Đọc lại tiêu đề mục và câu chủ đề</strong> · với những mục liên quan thì <strong>đọc kỹ</strong> và <strong>xem xét kỹ thông tin trực quan (biểu đồ, bảng biểu…)</strong> · <strong>bỏ qua những mục ít liên quan hoặc không liên quan</strong>.</p>
<ul>
<li><strong>Bây giờ — và chỉ bây giờ — mới tới phần thân.</strong> Bước Một chưa hề mở nó ra. Chính sự phân công này làm cả quy trình hiệu quả: bạn chỉ trả cái giá đọc-phần-thân cho những nguồn đã xứng đáng.</li>
<li><strong>"Đọc lại tiêu đề mục và câu chủ đề" là lượt ĐỊNH VỊ.</strong> Câu chủ đề là câu đầu đoạn văn và mang luận điểm của đoạn đó. Chỉ đọc câu chủ đề là bạn có cột sống lập luận trong vài phút, và biết đoạn nào xứng đáng đọc đủ.</li>
<li><strong>"Xem kỹ thông tin trực quan" là chỉ dẫn sinh viên bỏ qua nhiều nhất.</strong> Trong một bài báo thực nghiệm, BẰNG CHỨNG chính LÀ hình và bảng; phần chữ chỉ mô tả lại chúng. Bảng còn cho bạn những con số trích dẫn được chính xác — đúng thứ người chấm cho điểm.</li>
<li><strong>"Skip" là một sự CHO PHÉP rành mạch.</strong> Slide cấp phép cho bạn KHÔNG đọc một số phần của nguồn học thuật. Bỏ qua là quyết định đưa ra <em>SAU KHI</em> đã nhìn tiêu đề mục, không phải né tránh.</li>
<li><strong>Áp dụng ở FPTU.</strong> Trong bài báo CNTT, mục Related Work thường là phần giá trị nhất với sinh viên — nó tóm tắt cả một lĩnh vực và đưa luôn cho bạn danh sách đọc. Mục chứng minh toán học thì thường không. Bước Hai là chỗ bạn ra quyết định đó.</li>
</ul>
<p class="meo">💡 Thứ tự thực dụng cho một bài báo ở Bước Hai: tiêu đề mục → câu chủ đề → hình và bảng → rồi mới đọc đủ chữ của 2–3 mục còn sống sót. Phần lớn sinh viên làm ngược lại và hết giờ ở mục phương pháp.</p>`],

      [62, 'After Step One and Step Two — two lists, and a loop',
        `<p class="y-chinh">🎯 The deliverable slide: after Steps One and Two you hold <strong>a refined list of relevant sources</strong>, <strong>a list of potentially relevant sources</strong>, and an instruction to <strong>repeat steps one and two for these sources if needed</strong>.</p>
<table>
<tr><th>List</th><th>What is in it</th><th>What you do with it</th></tr>
<tr><td><strong>Refined list of relevant sources</strong></td><td>Sources that survived both passes and clearly serve your research question</td><td>Go straight to Step Three — take detailed notes</td></tr>
<tr><td><strong>Potentially relevant sources</strong></td><td>Sources that might matter, depending on how your argument develops</td><td>Park them; re-run Steps One and Two later <em>if needed</em></td></tr>
</table>
<ul>
<li><strong>Three buckets, not two.</strong> The slide names two lists, but there is a silent third: the sources you discarded outright. Keep a one-line record of those too, or you will re-find and re-read them in three weeks.</li>
<li><strong>The loop is the most important word on the slide.</strong> "Repeat… if needed" makes this an <em>iterative</em> process. Research is not a pipeline you traverse once — as your argument sharpens, a source you parked may become central.</li>
<li><strong>Why "potentially relevant" deserves its own list.</strong> Relevance is judged against your research question, and that question keeps changing while you write. A binary keep/discard forces premature commitment; the middle bucket protects you from it.</li>
<li><strong>Applied at FPTU.</strong> On a capstone, your topic drifts between the proposal and the final report — guaranteed. The "potentially relevant" list is what stops that drift from costing you a fresh literature search in the last month.</li>
</ul>
<p class="pitfall">⚠️ Exam wording: the two lists come <strong>after Step Two</strong>, i.e. <em>before</em> Step Three. Note-taking has not happened yet at this point.</p>`,
        `<p class="y-chinh">🎯 Slide về SẢN PHẨM: sau Bước Một và Bước Hai bạn cầm trong tay <strong>một danh sách tinh lọc các nguồn LIÊN QUAN</strong>, <strong>một danh sách các nguồn CÓ THỂ liên quan</strong>, và một chỉ dẫn <strong>lặp lại bước một và hai cho những nguồn này nếu cần</strong>.</p>
<table>
<tr><th>Danh sách</th><th>Trong đó có gì</th><th>Bạn làm gì với nó</th></tr>
<tr><td><strong>Nguồn liên quan (đã tinh lọc)</strong></td><td>Những nguồn sống sót qua cả hai lượt và rõ ràng phục vụ câu hỏi nghiên cứu</td><td>Đi thẳng sang Bước Ba — ghi chú chi tiết</td></tr>
<tr><td><strong>Nguồn CÓ THỂ liên quan</strong></td><td>Những nguồn có lẽ sẽ cần, tuỳ lập luận của bạn phát triển ra sao</td><td>Gác lại; chạy lại Bước Một và Hai sau này <em>nếu cần</em></td></tr>
</table>
<ul>
<li><strong>BA rổ, không phải hai.</strong> Slide gọi tên hai danh sách, nhưng có một cái thứ ba ngầm: những nguồn bạn đã loại thẳng. Hãy ghi lại một dòng cho chúng nữa, không thì ba tuần sau bạn sẽ tìm lại và đọc lại đúng những thứ đó.</li>
<li><strong>Chữ "lặp" là chữ quan trọng nhất trên slide.</strong> "Repeat… if needed" biến đây thành quy trình LẶP. Nghiên cứu không phải đường ống đi qua một lần — lập luận sắc dần lên thì một nguồn bạn gác lại có thể thành trung tâm.</li>
<li><strong>Vì sao "có thể liên quan" xứng đáng một danh sách riêng.</strong> Mức liên quan được xét theo câu hỏi nghiên cứu, mà câu hỏi đó cứ đổi trong lúc bạn viết. Chỉ giữ-hoặc-bỏ là ép bạn cam kết quá sớm; cái rổ giữa bảo vệ bạn khỏi điều đó.</li>
<li><strong>Áp dụng ở FPTU.</strong> Làm đồ án tốt nghiệp, đề tài của bạn CHẮC CHẮN trôi giữa lúc bảo vệ đề cương và lúc nộp báo cáo. Danh sách "có thể liên quan" là thứ ngăn cú trôi đó bắt bạn tìm tài liệu lại từ đầu ở tháng cuối.</li>
</ul>
<p class="pitfall">⚠️ Cách hỏi trong đề: hai danh sách này có <strong>SAU Bước Hai</strong>, tức là TRƯỚC Bước Ba. Tại thời điểm này việc ghi chú chưa hề diễn ra.</p>`],

      [63, 'Summary: Purpose in Academic Reading (Steps One, Two, Three)',
        `<p class="y-chinh">🎯 A pure recall slide, repeating the Step One / Step Two / Step Three list from slide 59 word for word. When a MOOC repeats a list verbatim, that list is examinable — treat this as the answer key.</p>
<table>
<tr><th>Step</th><th>The two things to remember</th></tr>
<tr><td><strong>Step One</strong></td><td>Assess credibility and relevance · Understand main ideas</td></tr>
<tr><td><strong>Step Two</strong></td><td>Gain further understanding</td></tr>
<tr><td><strong>Step Three</strong></td><td>Make detailed notes</td></tr>
</table>
<ul>
<li><strong>Only Step One has two sub-points.</strong> That asymmetry is a gift for memorisation: 2-1-1. If an answer option gives Step Two two purposes, or moves "assess credibility" to Step Two, it is wrong.</li>
<li><strong>Note what is absent: nothing about writing.</strong> All three steps are about <em>reading and recording</em>. Writing the assignment is a later stage entirely (Mooc 2). Options that put "draft your argument" inside Step Three are distractors.</li>
<li><strong>"Understand main ideas" sits in Step One, not Step Two.</strong> This is the subtlest trap on the slide. Step One gets the <em>main</em> ideas (from abstract and conclusion); Step Two gets <em>further</em> understanding (from the body). Main ideas come first.</li>
<li><strong>How to revise from this slide.</strong> Cover the right column and reconstruct it. If you can produce the four phrases in order, you have the entire section 3.4a.</li>
</ul>
<p class="meo">💡 The deck contains a second slide also titled "Summary: Purpose in Academic Reading" (slide 71). They are <strong>not</strong> duplicates: this one summarises Steps 1–3, that one summarises the four Phases inside Step Three.</p>`,
        `<p class="y-chinh">🎯 Slide THUẦN ÔN LẠI, lặp nguyên văn danh sách Step One / Step Two / Step Three của slide 59. Khi một MOOC lặp lại một danh sách y nguyên từng chữ thì danh sách đó sẽ vào đề — hãy coi đây là đáp án chuẩn.</p>
<table>
<tr><th>Bước</th><th>Hai thứ phải nhớ</th></tr>
<tr><td><strong>Step One</strong></td><td>Đánh giá độ tin cậy và mức liên quan · Nắm ý chính</td></tr>
<tr><td><strong>Step Two</strong></td><td>Hiểu sâu thêm</td></tr>
<tr><td><strong>Step Three</strong></td><td>Ghi chú chi tiết</td></tr>
</table>
<ul>
<li><strong>Chỉ Bước Một có HAI ý con.</strong> Sự lệch đó là món quà cho việc học thuộc: 2-1-1. Đáp án nào cho Bước Hai hai mục đích, hoặc chuyển "đánh giá độ tin cậy" sang Bước Hai, thì sai.</li>
<li><strong>Để ý cái VẮNG MẶT: không có gì về VIẾT.</strong> Cả ba bước đều nói về <em>đọc và ghi</em>. Viết bài là một giai đoạn hoàn toàn sau này (Mooc 2). Phương án nào nhét "phác thảo lập luận" vào Bước Ba là nhiễu.</li>
<li><strong>"Nắm ý chính" nằm ở Bước MỘT, không phải Bước Hai.</strong> Đây là cái bẫy tinh vi nhất của slide. Bước Một lấy ý <em>CHÍNH</em> (từ abstract và kết luận); Bước Hai lấy hiểu biết <em>SÂU THÊM</em> (từ phần thân). Ý chính đến trước.</li>
<li><strong>Ôn từ slide này thế nào.</strong> Che cột bên phải và dựng lại. Nếu bạn đọc ra được bốn cụm từ đúng thứ tự thì bạn đã nắm trọn mục 3.4a.</li>
</ul>
<p class="meo">💡 Trong deck có MỘT slide nữa cũng mang tiêu đề "Summary: Purpose in Academic Reading" (slide 71). Chúng <strong>KHÔNG</strong> trùng nhau: cái này tóm tắt Bước 1–3, cái kia tóm tắt bốn Phase bên trong Bước Ba.</p>`],

      [64, '3.4b Processing and Coding: Step 3 (learning outcomes)',
        `<p class="y-chinh">🎯 Section 3.4b opens, and prints the <strong>identical two bullets</strong> as slide 58: use strategies to efficiently read &amp; understand relevant aspects of selected sources · select &amp; prepare relevant information for assignments. The heading, not the bullets, tells you what changed: this half is <strong>Step 3</strong>.</p>
<ul>
<li><strong>The duplication is in the original deck.</strong> Do not read meaning into it. What actually distinguishes 3.4b is everything that follows: Step Three, its four Phases, and the synthesis matrix.</li>
<li><strong>Of the two bullets, 3.4b delivers the second.</strong> "Select &amp; prepare relevant information <em>for assignments</em>" is exactly what Step Three does — it turns reading into writable material. 3.4a delivered the first bullet (read efficiently).</li>
<li><strong>Step Three is where most of the value is.</strong> Steps One and Two are filtering; Step Three is construction. A student who filters well but never builds the matrix still faces a blank page with 15 PDFs open.</li>
<li><strong>Applied at FPTU.</strong> This is the step that separates a report that merely lists sources ("Author A said…, Author B said…") from one that synthesises them ("Three studies agree on X but disagree on why"). Graders reward the second heavily.</li>
</ul>
<p class="pitfall">⚠️ If an exam question quotes one of these two bullets and asks which section it belongs to, both 3.4a and 3.4b are literally correct. Answer from the <em>step</em>: Steps 1–2 → 3.4a, Step 3 → 3.4b.</p>`,
        `<p class="y-chinh">🎯 Mục 3.4b mở màn, và in <strong>ĐÚNG HAI BULLET Y HỆT</strong> slide 58: dùng chiến lược để đọc và hiểu hiệu quả những khía cạnh liên quan · chọn lọc &amp; chuẩn bị thông tin liên quan cho bài tập. Chính TIÊU ĐỀ, chứ không phải bullet, mới cho biết cái gì đổi: nửa này là <strong>Bước 3</strong>.</p>
<ul>
<li><strong>Chuyện lặp là lỗi của bộ slide gốc.</strong> Đừng đọc ra ý nghĩa gì từ nó. Cái thật sự phân biệt 3.4b là toàn bộ những gì theo sau: Bước Ba, bốn Phase của nó, và ma trận tổng hợp.</li>
<li><strong>Trong hai bullet đó, 3.4b giao bullet THỨ HAI.</strong> "Chọn lọc &amp; chuẩn bị thông tin liên quan <em>CHO BÀI TẬP</em>" đúng là việc Bước Ba làm — nó biến việc đọc thành vật liệu viết được. 3.4a đã giao bullet thứ nhất (đọc hiệu quả).</li>
<li><strong>Bước Ba là nơi phần lớn giá trị nằm.</strong> Bước Một và Hai là LỌC; Bước Ba là DỰNG. Một sinh viên lọc rất giỏi mà không bao giờ dựng ma trận thì vẫn ngồi trước trang giấy trắng với 15 file PDF đang mở.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đây chính là bước tách một báo cáo chỉ liệt kê nguồn ("Tác giả A nói…, tác giả B nói…") khỏi một báo cáo TỔNG HỢP được ("Ba nghiên cứu cùng đồng ý về X nhưng bất đồng về nguyên nhân"). Người chấm cho điểm cái thứ hai rất nặng.</li>
</ul>
<p class="pitfall">⚠️ Nếu đề trích một trong hai bullet này và hỏi nó thuộc mục nào thì theo mặt chữ CẢ 3.4a lẫn 3.4b đều đúng. Hãy trả lời theo BƯỚC: Bước 1–2 → 3.4a, Bước 3 → 3.4b.</p>`],

      [65, 'Step Three — organise information, organise thinking, identify what the argument needs',
        `<p class="y-chinh">🎯 Three instructions that look similar but are not: <strong>organize information according to topic/research question</strong> · <strong>organize your thinking around your research question</strong> · <strong>identify the information needed to develop your arguments</strong>.</p>
<table>
<tr><th>Instruction</th><th>What is being organised</th><th>The test that it worked</th></tr>
<tr><td>Organize <strong>information</strong> according to topic/research question</td><td>The material — quotes, data, findings, grouped by theme</td><td>You can point to a theme and list every source that speaks to it</td></tr>
<tr><td>Organize your <strong>thinking</strong> around your research question</td><td>Your own position — what you now believe and why</td><td>You can state your answer to the research question in one sentence</td></tr>
<tr><td><strong>Identify the information needed</strong> to develop your arguments</td><td>The <em>gaps</em> — what you still do not have</td><td>You have a short list of things to go and find</td></tr>
</table>
<ul>
<li><strong>Bullet 1 and bullet 2 are the pair students collapse into one.</strong> Organising information is sorting other people's material. Organising thinking is forming your own view. Do only the first and you produce a summary, not an argument — the most common reason a literature review scores low.</li>
<li><strong>Bullet 3 turns reading back into searching.</strong> Once your themes exist you can see which ones are supported by one weak source and which by five strong ones. That is a targeted search, far cheaper than the broad one you started with.</li>
<li><strong>Everything orbits the research question.</strong> It appears in all three bullets. Without a stated question there is no criterion for "relevant" and organising is arbitrary.</li>
<li><strong>Applied at FPTU.</strong> Write your research question on one line at the top of the notes document and keep it visible. If you cannot say how a paragraph serves that line, the paragraph is not ready.</li>
</ul>
<p class="meo">💡 Three words to carry: <strong>MATERIAL → POSITION → GAPS</strong>. Slide 66 immediately turns these into a four-phase procedure you can actually execute.</p>`,
        `<p class="y-chinh">🎯 Ba chỉ dẫn trông na ná nhau nhưng KHÔNG giống nhau: <strong>sắp xếp thông tin theo chủ đề/câu hỏi nghiên cứu</strong> · <strong>sắp xếp SUY NGHĨ của bạn quanh câu hỏi nghiên cứu</strong> · <strong>xác định thông tin CẦN để phát triển lập luận</strong>.</p>
<table>
<tr><th>Chỉ dẫn</th><th>Đang sắp xếp cái gì</th><th>Dấu hiệu là đã làm được</th></tr>
<tr><td>Sắp xếp <strong>THÔNG TIN</strong> theo chủ đề/câu hỏi</td><td>Vật liệu — trích dẫn, số liệu, phát hiện, gom theo chủ đề</td><td>Bạn chỉ vào một chủ đề và kể ra được mọi nguồn nói về nó</td></tr>
<tr><td>Sắp xếp <strong>SUY NGHĨ</strong> quanh câu hỏi nghiên cứu</td><td>Lập trường của CHÍNH BẠN — giờ bạn tin gì và vì sao</td><td>Bạn nói được câu trả lời cho câu hỏi nghiên cứu trong MỘT câu</td></tr>
<tr><td><strong>Xác định thông tin CẦN</strong> để phát triển lập luận</td><td>Những <em>LỖ HỔNG</em> — thứ bạn còn thiếu</td><td>Bạn có một danh sách ngắn những thứ phải đi tìm tiếp</td></tr>
</table>
<ul>
<li><strong>Bullet 1 và bullet 2 là cặp sinh viên hay gộp làm một.</strong> Sắp xếp thông tin là phân loại vật liệu của người khác. Sắp xếp suy nghĩ là hình thành quan điểm của mình. Chỉ làm cái đầu thì bạn cho ra một bản TÓM TẮT chứ không phải một LẬP LUẬN — lý do phổ biến nhất khiến bài tổng quan tài liệu bị điểm thấp.</li>
<li><strong>Bullet 3 biến việc đọc trở lại thành việc tìm.</strong> Khi các chủ đề đã hiện ra, bạn thấy chủ đề nào chỉ có một nguồn yếu đỡ và chủ đề nào có năm nguồn mạnh. Đó là một cuộc tìm CÓ ĐÍCH, rẻ hơn nhiều so với cuộc tìm rộng lúc đầu.</li>
<li><strong>Mọi thứ đều xoay quanh câu hỏi nghiên cứu.</strong> Nó xuất hiện trong cả ba bullet. Không có câu hỏi phát biểu rõ ràng thì không có tiêu chí nào cho chữ "liên quan", và việc sắp xếp trở nên tuỳ tiện.</li>
<li><strong>Áp dụng ở FPTU.</strong> Viết câu hỏi nghiên cứu thành MỘT dòng ở đầu file ghi chú và luôn để nó trong tầm mắt. Đoạn văn nào bạn không nói được nó phục vụ dòng đó ra sao thì đoạn đó chưa xong.</li>
</ul>
<p class="meo">💡 Ba chữ mang theo: <strong>VẬT LIỆU → LẬP TRƯỜNG → LỖ HỔNG</strong>. Slide 66 lập tức biến chúng thành một quy trình bốn phase thực thi được.</p>`],

      [66, 'Step Three — Do: the four Phases',
        `<p class="y-chinh">🎯 Step Three, broken into an executable procedure. <strong>Phase 1</strong> — Develop categories of information · <strong>Phase 2</strong> — Track information and identify relevant sections · <strong>Phase 3</strong> — Categorize the information in the sections · <strong>Phase 4</strong> — Organize the information.</p>
<table>
<tr><th>Phase</th><th>Action</th><th>Output</th><th>Shown on slide</th></tr>
<tr><td><strong>1</strong></td><td>Develop categories of information</td><td>4–5 named themes</td><td>67</td></tr>
<tr><td><strong>2</strong></td><td>Track information and identify relevant sections</td><td>An empty matrix: sources down, categories across</td><td>68</td></tr>
<tr><td><strong>3</strong></td><td>Categorize the information in the sections</td><td>Highlighted passages tagged with a category</td><td>69</td></tr>
<tr><td><strong>4</strong></td><td>Organize the information</td><td>The matrix filled with quotes and page numbers</td><td>70</td></tr>
</table>
<ul>
<li><strong>The word "Do" at the top matters.</strong> Slide 65 was the intent; this slide is the execution. The MOOC is deliberately giving you a mechanical procedure so that "synthesise the literature" stops being vague advice.</li>
<li><strong>Categories come BEFORE reading for detail.</strong> Phase 1 builds the grid; Phases 2–4 fill it. Doing it the other way — read everything, then try to find themes in a mountain of notes — is exactly the method that produces an all-nighter.</li>
<li><strong>It is one method, repeated per source.</strong> Phases 2–4 run once for every source in your refined list. The categories from Phase 1 stay fixed (mostly) so that the columns line up and comparison becomes possible.</li>
<li><strong>Why the matrix is the whole trick.</strong> Reading down a column shows you what several authors say about <em>one</em> theme — which is what synthesis means. Reading across a row shows you what one author contributes overall.</li>
</ul>
<p class="meo">💡 Remember the four phases by their verbs: <strong>DEVELOP → TRACK → CATEGORIZE → ORGANIZE</strong>. Slide 71 repeats this list verbatim, so it is almost certainly examinable.</p>`,
        `<p class="y-chinh">🎯 Bước Ba, bẻ thành một quy trình chạy được. <strong>Phase 1</strong> — Dựng các nhóm thông tin · <strong>Phase 2</strong> — Theo dõi thông tin và xác định các mục liên quan · <strong>Phase 3</strong> — Phân nhóm thông tin trong các mục đó · <strong>Phase 4</strong> — Tổ chức thông tin.</p>
<table>
<tr><th>Phase</th><th>Hành động</th><th>Sản phẩm</th><th>Slide minh hoạ</th></tr>
<tr><td><strong>1</strong></td><td>Dựng các nhóm thông tin</td><td>4–5 chủ đề có tên</td><td>67</td></tr>
<tr><td><strong>2</strong></td><td>Theo dõi thông tin, xác định mục liên quan</td><td>Một ma trận rỗng: nguồn theo hàng, nhóm theo cột</td><td>68</td></tr>
<tr><td><strong>3</strong></td><td>Phân nhóm thông tin trong các mục</td><td>Đoạn văn được tô sáng và gắn nhãn nhóm</td><td>69</td></tr>
<tr><td><strong>4</strong></td><td>Tổ chức thông tin</td><td>Ma trận đã điền đầy trích dẫn kèm số trang</td><td>70</td></tr>
</table>
<ul>
<li><strong>Chữ "Do" ở trên đầu là có ý.</strong> Slide 65 là Ý ĐỊNH; slide này là THỰC THI. MOOC cố tình đưa cho bạn một quy trình cơ học để câu "hãy tổng hợp tài liệu" thôi là lời khuyên mơ hồ.</li>
<li><strong>Nhóm phải có TRƯỚC khi đọc chi tiết.</strong> Phase 1 dựng lưới; Phase 2–4 điền vào. Làm ngược lại — đọc hết rồi mới cố tìm chủ đề trong một núi ghi chú — đúng là cách sinh ra những đêm thức trắng.</li>
<li><strong>Đây là MỘT phương pháp, lặp cho từng nguồn.</strong> Phase 2–4 chạy một lượt cho mỗi nguồn trong danh sách tinh lọc. Các nhóm ở Phase 1 giữ nguyên (về cơ bản) để các cột thẳng hàng và việc so sánh trở nên khả thi.</li>
<li><strong>Vì sao cái ma trận mới là toàn bộ mẹo.</strong> Đọc xuống theo CỘT cho bạn thấy nhiều tác giả nói gì về <em>MỘT</em> chủ đề — đó chính là nghĩa của "tổng hợp". Đọc ngang theo HÀNG cho thấy một tác giả đóng góp tổng thể những gì.</li>
</ul>
<p class="meo">💡 Nhớ bốn phase theo động từ: <strong>DEVELOP → TRACK → CATEGORIZE → ORGANIZE</strong>. Slide 71 lặp lại danh sách này nguyên văn, nên gần như chắc chắn nó vào đề.</p>`],

      [67, 'Phase 1 — Develop categories of information (4–5 categories)',
        `<p class="y-chinh">🎯 Phase 1 in detail: develop <strong>4–5 categories</strong>. The slide's worked example, for a question about the causes and effects of a particular social issue, gives four: <strong>Description of the problem</strong> · <strong>Importance of the problem</strong> · <strong>Cause(s) of the problem</strong> · <strong>Effect(s) of the problem</strong>.</p>
<ul>
<li><strong>The number 4–5 is a real constraint, not decoration.</strong> Two or three categories are too coarse to structure an essay; eight or more produce a matrix too sparse to compare anything. Four to five columns is what a page — and a reader — can hold.</li>
<li><strong>The categories are a draft outline in disguise.</strong> Description → Importance → Causes → Effects is precisely the shape of the finished essay. Get Phase 1 right and the structure of your writing is already decided.</li>
<li><strong>They come from the research question, not from the sources.</strong> This is the direction students get backwards. You decide what you need to know, then go and see who supplies it. Deriving categories from whatever the first article happens to discuss just copies that article's structure — which, per slide 76, is itself something you would have to reference.</li>
<li><strong>Categories may be revised — early, not late.</strong> After two or three sources you may find a theme you did not anticipate. Adjust then. Changing categories after ten sources means re-reading ten sources.</li>
<li><strong>An IT version of the same example.</strong> Research question: "Should our team adopt microservices?" Categories: <em>Definition and variants</em> · <em>Performance implications</em> · <em>Operational cost</em> · <em>Team/organisational fit</em> · <em>Migration risk</em>. Five columns, and the report writes itself.</li>
</ul>
<p class="pitfall">⚠️ Notice that <em>Description</em> and <em>Importance</em> are separate categories. Describing a problem ("what it is") and justifying it ("why it matters") are different jobs, and conflating them is a standard reason introductions feel weak.</p>`,
        `<p class="y-chinh">🎯 Phase 1 chi tiết: dựng <strong>4–5 nhóm</strong>. Ví dụ mẫu trên slide, cho một câu hỏi về nguyên nhân và hệ quả của một vấn đề xã hội, đưa ra bốn nhóm: <strong>Mô tả vấn đề</strong> · <strong>Tầm quan trọng của vấn đề</strong> · <strong>Nguyên nhân</strong> · <strong>Hệ quả</strong>.</p>
<ul>
<li><strong>Con số 4–5 là ràng buộc THẬT, không phải trang trí.</strong> Hai ba nhóm thì quá thô để dựng bố cục bài; tám nhóm trở lên thì ma trận thưa quá, chẳng so sánh được gì. Bốn tới năm cột là mức một trang giấy — và một người đọc — chứa nổi.</li>
<li><strong>Các nhóm chính là DÀN Ý nháp trá hình.</strong> Mô tả → Tầm quan trọng → Nguyên nhân → Hệ quả đúng là hình dạng của bài viết hoàn chỉnh. Làm đúng Phase 1 thì cấu trúc bài viết đã được quyết xong.</li>
<li><strong>Nhóm sinh ra từ CÂU HỎI NGHIÊN CỨU, không phải từ các nguồn.</strong> Đây là chiều mà sinh viên hay làm ngược. Bạn quyết định mình cần biết gì, rồi mới đi xem ai cung cấp. Rút nhóm ra từ bất cứ thứ gì bài báo đầu tiên bàn tới chỉ là chép lại cấu trúc của bài báo đó — mà theo slide 76, chính cấu trúc ấy cũng là thứ bạn phải trích nguồn.</li>
<li><strong>Nhóm có thể sửa — SỚM, đừng muộn.</strong> Sau hai ba nguồn bạn có thể phát hiện một chủ đề không lường trước. Chỉnh ngay lúc đó. Đổi nhóm sau mười nguồn nghĩa là đọc lại mười nguồn.</li>
<li><strong>Bản CNTT của cùng ví dụ đó.</strong> Câu hỏi: "Nhóm mình có nên chuyển sang microservices không?". Nhóm: <em>Định nghĩa và các biến thể</em> · <em>Ảnh hưởng tới hiệu năng</em> · <em>Chi phí vận hành</em> · <em>Độ hợp với đội ngũ/tổ chức</em> · <em>Rủi ro khi chuyển đổi</em>. Năm cột, và bản báo cáo gần như tự viết ra.</li>
</ul>
<p class="pitfall">⚠️ Để ý <em>Mô tả</em> và <em>Tầm quan trọng</em> là HAI nhóm tách biệt. Mô tả một vấn đề ("nó là gì") và biện minh cho nó ("vì sao nó đáng quan tâm") là hai việc khác nhau, và gộp chúng lại là lý do kinh điển khiến phần mở bài nghe yếu.</p>`],

      [68, 'Phase 2 — the tracking matrix (Adapted from: Dovey, 2010)',
        `<p class="y-chinh">🎯 Phase 2 shows the tool itself: an <strong>empty grid</strong>. Columns are <strong>Category 1 … Category 4</strong> (the themes from Phase 1). Rows are sources, each labelled <strong>Author, Year, keywords</strong>. Credited on the slide as <strong>Adapted from: Dovey (2010)</strong>.</p>
<table>
<tr><th></th><th>Category 1</th><th>Category 2</th><th>Category 3</th><th>Category 4</th></tr>
<tr><td><strong>Author1, Year1, keywords1</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Author2, Year2, keywords2</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Author3, Year3, keywords3</strong></td><td></td><td></td><td></td><td></td></tr>
</table>
<ul>
<li><strong>Look at what the row label contains: Author, Year, keywords.</strong> Author and year are exactly the two elements an in-text citation needs (slide 82). The matrix is built so that citing is automatic later — you never have to go back and hunt for who said it.</li>
<li><strong>Empty cells are information.</strong> A column with only one filled cell means a theme almost nobody supports — either drop it or go find more sources. A row with one filled cell means a source that contributes little. The blanks do the triage for you.</li>
<li><strong>This is called a synthesis matrix.</strong> It is standard practice in literature reviews far beyond this MOOC; you will meet the same grid in your capstone methodology, under that name.</li>
<li><strong>Build it in a spreadsheet, not a document.</strong> Sheets or Excel let you sort by column, freeze the header row, and keep a cell's full quote without breaking the layout. Add one extra column: <em>page number</em>. You will need it for direct quotes and you will not remember it.</li>
<li><strong>The slide cites its own source.</strong> "Adapted from: Dovey (2010)" on a teaching slide is the MOOC practising what section 4.2 preaches — even a borrowed table layout gets attributed.</li>
</ul>
<p class="meo">💡 Add a final column called <strong>"My comment"</strong>, not on the original slide. Write what <em>you</em> think about that source in it. That is where "organize your thinking" (slide 65) actually happens, and it is the column your own voice comes from when you write.</p>`,
        `<p class="y-chinh">🎯 Phase 2 trưng ra chính CÔNG CỤ: một <strong>cái lưới rỗng</strong>. Cột là <strong>Category 1 … Category 4</strong> (các chủ đề từ Phase 1). Hàng là các nguồn, mỗi hàng ghi <strong>Tác giả, Năm, từ khoá</strong>. Slide ghi nguồn: <strong>Adapted from: Dovey (2010)</strong>.</p>
<table>
<tr><th></th><th>Nhóm 1</th><th>Nhóm 2</th><th>Nhóm 3</th><th>Nhóm 4</th></tr>
<tr><td><strong>Tác giả 1, Năm 1, từ khoá 1</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Tác giả 2, Năm 2, từ khoá 2</strong></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Tác giả 3, Năm 3, từ khoá 3</strong></td><td></td><td></td><td></td><td></td></tr>
</table>
<ul>
<li><strong>Nhìn kỹ nhãn hàng chứa gì: Tác giả, Năm, từ khoá.</strong> Tác giả và năm đúng là hai thành phần mà một trích dẫn trong bài cần (slide 82). Ma trận được dựng sao cho về sau việc trích dẫn thành tự động — bạn không bao giờ phải quay lại mò xem ai đã nói câu đó.</li>
<li><strong>Ô TRỐNG cũng là thông tin.</strong> Một cột chỉ có một ô được điền nghĩa là chủ đề đó gần như không ai đỡ — hoặc bỏ nó, hoặc đi tìm thêm nguồn. Một hàng chỉ có một ô được điền nghĩa là nguồn đó đóng góp ít. Chính những chỗ trống làm giúp bạn việc phân loại.</li>
<li><strong>Cái này tên là synthesis matrix (ma trận tổng hợp).</strong> Nó là chuẩn mực trong tổng quan tài liệu, vượt xa phạm vi MOOC này; bạn sẽ gặp lại đúng cái lưới đó trong phần phương pháp của đồ án tốt nghiệp, dưới đúng cái tên ấy.</li>
<li><strong>Dựng nó trong BẢNG TÍNH, đừng dựng trong file văn bản.</strong> Sheets hay Excel cho phép sắp xếp theo cột, ghim hàng tiêu đề, và chứa nguyên câu trích trong một ô mà không vỡ bố cục. Thêm một cột nữa: <em>SỐ TRANG</em>. Bạn sẽ cần nó cho trích dẫn nguyên văn và bạn sẽ không nhớ nổi.</li>
<li><strong>Slide tự ghi nguồn cho chính nó.</strong> Dòng "Adapted from: Dovey (2010)" trên một slide giảng dạy chính là MOOC đang làm đúng điều mục 4.2 rao giảng — kể cả một bố cục bảng đi mượn cũng phải ghi công.</li>
</ul>
<p class="meo">💡 Thêm một cột cuối tên <strong>"Nhận xét của tôi"</strong>, cột này KHÔNG có trên slide gốc. Viết vào đó điều <em>BẠN</em> nghĩ về nguồn ấy. Đó chính là chỗ "sắp xếp suy nghĩ" (slide 65) thật sự diễn ra, và là cột sinh ra giọng nói của riêng bạn khi viết bài.</p>`],

      [69, 'Phase 3 — categorize inside the source (Noda et al., 2013, p.1)',
        `<p class="y-chinh">🎯 Phase 3 shown as a real screenshot: a PDF of the Introduction of <strong>Noda et al. (2013), p.1</strong>, with one sentence <strong>highlighted</strong> and a PDF <strong>comment attached</strong> reading "<em>technical implications of AI</em>". The highlighted sentence is: "Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery."</p>
<ul>
<li><strong>The comment is the category label — that is the whole idea of "coding".</strong> Highlighting alone says "this matters"; the comment says <em>which of your 4–5 categories it belongs to</em>. Without the tag, highlights are just yellow.</li>
<li><strong>This is why the section is called Processing and <em>Coding</em>.</strong> "Coding" is a research term: attaching a category label to a piece of text. You are doing, at student scale, what qualitative researchers do with interview transcripts.</li>
<li><strong>Do it inside the PDF, not in a separate file.</strong> The comment lives next to the sentence, so the quote, its context and its page number stay welded together. This is exactly the discipline that prevents the accidental plagiarism described at slide 75.</li>
<li><strong>Tools that do this.</strong> Adobe Acrobat Reader, Preview on macOS, Zotero's built-in PDF reader (comments sync with the reference entry), Mendeley Reader. All free for the highlight-plus-note workflow.</li>
<li><strong>Note the page number is on the slide: "Noda et al. (2013) p.1".</strong> Capture it at the moment of highlighting. A direct quote without a page number is not a complete citation in APA or Harvard.</li>
</ul>
<p class="pitfall">⚠️ Careful with "steep learning curve" in that sentence — the authors list it as an <em>advantage</em>, meaning skills are acquired quickly. In everyday English people often use the phrase to mean the opposite ("hard to learn"). If you paraphrase it as "difficult to learn" you have misrepresented the source, which is a worse error than an awkward quote.</p>`,
        `<p class="y-chinh">🎯 Phase 3 trưng ra bằng một ảnh chụp màn hình thật: file PDF phần Introduction của <strong>Noda và cộng sự (2013), trang 1</strong>, với một câu được <strong>TÔ SÁNG</strong> và một <strong>chú thích PDF</strong> gắn kèm ghi "<em>technical implications of AI</em>". Câu được tô là: "Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery."</p>
<ul>
<li><strong>Cái chú thích chính là NHÃN NHÓM — đó là toàn bộ ý tưởng của chữ "coding".</strong> Tô sáng không thôi chỉ nói "chỗ này quan trọng"; chú thích mới nói <em>nó thuộc nhóm nào trong 4–5 nhóm của bạn</em>. Không có nhãn thì vệt tô chỉ là màu vàng.</li>
<li><strong>Đây là lý do mục này tên là Processing and <em>CODING</em>.</strong> "Coding" là thuật ngữ nghiên cứu: gắn nhãn phân loại vào một mẩu văn bản. Bạn đang làm, ở quy mô sinh viên, đúng việc mà nhà nghiên cứu định tính làm với bản gỡ băng phỏng vấn.</li>
<li><strong>Làm NGAY TRONG file PDF, đừng làm ở file riêng.</strong> Chú thích nằm cạnh câu văn, nên câu trích, ngữ cảnh và số trang dính liền nhau. Đây đúng là kỷ luật ngăn chặn kiểu đạo văn vô tình mô tả ở slide 75.</li>
<li><strong>Công cụ làm được việc này.</strong> Adobe Acrobat Reader, Preview trên macOS, trình đọc PDF tích hợp của Zotero (chú thích đồng bộ luôn với mục tài liệu), Mendeley Reader. Tất cả đều miễn phí cho việc tô sáng kèm ghi chú.</li>
<li><strong>Để ý số trang có ngay trên slide: "Noda et al. (2013) p.1".</strong> Hãy chộp nó ngay lúc tô sáng. Một trích dẫn nguyên văn mà thiếu số trang thì chưa phải trích dẫn đầy đủ theo APA hay Harvard.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận với cụm "steep learning curve" trong câu đó — tác giả liệt kê nó như một ƯU ĐIỂM, nghĩa là kỹ năng được tiếp thu NHANH. Trong tiếng Anh đời thường người ta lại hay dùng cụm này với nghĩa ngược lại ("khó học"). Nếu bạn diễn giải nó thành "khó học" thì bạn đã XUYÊN TẠC nguồn, lỗi này còn nặng hơn một câu trích vụng về.</p>`],

      [70, 'Phase 4 — the filled matrix (Examples from Noda et al., 2013, p.1)',
        `<p class="y-chinh">🎯 Phase 4: the same grid from Phase 2, now with <strong>real category names</strong> and <strong>one cell filled</strong>. Columns: <em>Definitions of key terms + examples</em> · <em>Social implications of AI</em> · <em>Technical implications of AI</em> · <em>Economic implications of AI</em>. Row: <em>Noda et al, 2013, robots and surgery</em>. The Technical column holds the quote, in quotation marks, ending "(p.1)".</p>
<table>
<tr><th></th><th>Definitions + examples</th><th>Social implications</th><th>Technical implications</th><th>Economic implications</th></tr>
<tr><td><strong>Noda et al, 2013, robots and surgery</strong></td><td></td><td></td><td>"Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery." (p.1)</td><td></td></tr>
</table>
<ul>
<li><strong>Look closely at how the cell is written: quotation marks + page number.</strong> That is the anti-plagiarism device of the entire workflow. Six weeks later you can still tell, at a glance, that these are Noda's words and not yours.</li>
<li><strong>The categories here are AI-flavoured versions of a standard set.</strong> Definitions · Social · Technical · Economic is a general-purpose frame you can reuse for almost any technology topic — and it maps neatly onto the ethics discussion in CSI106 chapter 12.</li>
<li><strong>One highlighted sentence produced exactly one cell.</strong> That is the correct ratio. A source that fills three or four cells is a major source; one that fills none should not be in your refined list.</li>
<li><strong>Three empty columns are not a problem.</strong> Noda et al. is a surgery paper; it says nothing about economics. When you write the Economic section you will draw on different rows. That is precisely what the matrix is for.</li>
<li><strong>Writing now means reading DOWN a column.</strong> Your "Technical implications" paragraph is written from everything in that column — several authors, compared. That is synthesis, and it is the difference between a B and an A on a literature review.</li>
</ul>
<p class="meo">💡 Keep every cell either (a) in quotation marks with a page number, or (b) in your own words with the author-year only. Never mix the two inside one cell. That single habit makes accidental plagiarism nearly impossible.</p>`,
        `<p class="y-chinh">🎯 Phase 4: vẫn cái lưới của Phase 2, giờ đã có <strong>tên nhóm THẬT</strong> và <strong>một ô được điền</strong>. Cột: <em>Định nghĩa thuật ngữ chính + ví dụ</em> · <em>Hệ quả xã hội của AI</em> · <em>Hệ quả kỹ thuật của AI</em> · <em>Hệ quả kinh tế của AI</em>. Hàng: <em>Noda et al, 2013, robots and surgery</em>. Cột Kỹ thuật chứa câu trích, đặt trong ngoặc kép, kết thúc bằng "(p.1)".</p>
<table>
<tr><th></th><th>Định nghĩa + ví dụ</th><th>Hệ quả xã hội</th><th>Hệ quả kỹ thuật</th><th>Hệ quả kinh tế</th></tr>
<tr><td><strong>Noda et al, 2013, robots and surgery</strong></td><td></td><td></td><td>"Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery." (p.1)</td><td></td></tr>
</table>
<ul>
<li><strong>Nhìn kỹ cách ô đó được viết: ngoặc kép + số trang.</strong> Đó là cơ chế chống đạo văn của cả quy trình. Sáu tuần sau bạn vẫn nhìn một cái là biết đây là chữ của Noda chứ không phải chữ của mình.</li>
<li><strong>Bộ nhóm ở đây là phiên bản "vị AI" của một bộ khung chuẩn.</strong> Định nghĩa · Xã hội · Kỹ thuật · Kinh tế là khung dùng chung cho gần như mọi đề tài công nghệ — và nó khớp gọn với phần bàn về đạo đức ở CSI106 chương 12.</li>
<li><strong>MỘT câu tô sáng đẻ ra ĐÚNG MỘT ô.</strong> Đó là tỉ lệ đúng. Nguồn nào điền được ba bốn ô là nguồn chủ lực; nguồn nào không điền nổi ô nào thì lẽ ra không nên nằm trong danh sách tinh lọc.</li>
<li><strong>Ba cột trống KHÔNG phải vấn đề.</strong> Noda và cộng sự là bài báo về phẫu thuật; nó không nói gì về kinh tế. Khi viết phần Kinh tế bạn sẽ lấy từ những HÀNG khác. Đó chính xác là công dụng của ma trận.</li>
<li><strong>Viết bài bây giờ nghĩa là đọc XUỐNG theo CỘT.</strong> Đoạn "Hệ quả kỹ thuật" của bạn được viết từ toàn bộ nội dung trong cột đó — nhiều tác giả, đặt cạnh nhau. Đó là TỔNG HỢP, và là khác biệt giữa điểm khá và điểm giỏi ở một bài tổng quan tài liệu.</li>
</ul>
<p class="meo">💡 Giữ mọi ô ở một trong hai dạng: (a) trong ngoặc kép kèm số trang, hoặc (b) bằng chữ của chính bạn, chỉ ghi tác giả-năm. TUYỆT ĐỐI không trộn hai dạng trong cùng một ô. Riêng thói quen đó thôi làm cho đạo văn vô tình gần như không thể xảy ra.</p>`],

      [71, 'Summary: Purpose in Academic Reading — the four Phases of Step Three',
        `<p class="y-chinh">🎯 The second summary slide with this title, and it recaps a different thing: the <strong>four Phases inside Step Three</strong> — Develop categories · Track information and identify relevant sections · Categorize the information in the sections · Organize the information.</p>
<table>
<tr><th>Phase</th><th>Verb</th><th>One-line meaning</th></tr>
<tr><td>1</td><td><strong>Develop</strong></td><td>Decide the 4–5 categories from your research question</td></tr>
<tr><td>2</td><td><strong>Track</strong></td><td>Build the source × category grid; find the relevant sections</td></tr>
<tr><td>3</td><td><strong>Categorize</strong></td><td>Highlight inside the source and tag each highlight with a category</td></tr>
<tr><td>4</td><td><strong>Organize</strong></td><td>Move the tagged material into the grid, quoted and paginated</td></tr>
</table>
<ul>
<li><strong>Phase 2 vs Phase 3 is the pair that gets confused.</strong> Phase 2 works at the level of <em>sections</em> ("which parts of this paper matter?"). Phase 3 works at the level of <em>sentences</em> ("this sentence belongs to Technical implications"). Coarse then fine.</li>
<li><strong>Phase 4 does not add new reading.</strong> It is pure transfer: from annotated PDF into the matrix. If you find yourself reading new material during Phase 4, you are really back in Step Two.</li>
<li><strong>Two slides, same title, different content.</strong> Slide 63 summarised Steps 1–3; this one summarises Phases 1–4. An exam question asking "what are the four phases" is asking about <em>Step Three only</em>.</li>
<li><strong>Revision drill.</strong> Say the three Steps, then the four Phases, then say which Step the Phases live inside. If you can do that from memory you own sections 3.4a and 3.4b entirely.</li>
</ul>
<p class="pitfall">⚠️ Do not mix the numbering. There are <strong>3 Steps</strong> (reading a source) and <strong>4 Phases</strong> (inside Step Three only). "Phase 1" is not "Step 1", and an answer option that treats them as the same list is wrong.</p>`,
        `<p class="y-chinh">🎯 Slide tóm tắt THỨ HAI mang cùng tiêu đề, và nó ôn lại một thứ KHÁC: <strong>bốn Phase bên trong Bước Ba</strong> — Dựng nhóm · Theo dõi thông tin và xác định mục liên quan · Phân nhóm thông tin trong các mục · Tổ chức thông tin.</p>
<table>
<tr><th>Phase</th><th>Động từ</th><th>Nghĩa một dòng</th></tr>
<tr><td>1</td><td><strong>Develop</strong></td><td>Quyết 4–5 nhóm, xuất phát từ câu hỏi nghiên cứu</td></tr>
<tr><td>2</td><td><strong>Track</strong></td><td>Dựng lưới nguồn × nhóm; tìm các mục liên quan</td></tr>
<tr><td>3</td><td><strong>Categorize</strong></td><td>Tô sáng bên trong nguồn và gắn nhãn nhóm cho từng vệt tô</td></tr>
<tr><td>4</td><td><strong>Organize</strong></td><td>Chuyển vật liệu đã gắn nhãn vào lưới, có ngoặc kép và số trang</td></tr>
</table>
<ul>
<li><strong>Phase 2 với Phase 3 là cặp hay bị lẫn.</strong> Phase 2 làm việc ở mức <em>MỤC</em> ("phần nào của bài báo này đáng quan tâm?"). Phase 3 làm ở mức <em>CÂU</em> ("câu này thuộc nhóm Hệ quả kỹ thuật"). Thô trước, mịn sau.</li>
<li><strong>Phase 4 KHÔNG đọc thêm gì mới.</strong> Nó thuần chuyển giao: từ PDF đã chú thích sang ma trận. Nếu bạn thấy mình đang đọc tài liệu mới trong Phase 4 thì thật ra bạn đang quay lại Bước Hai.</li>
<li><strong>Hai slide, cùng tiêu đề, khác nội dung.</strong> Slide 63 tóm tắt Bước 1–3; slide này tóm tắt Phase 1–4. Câu hỏi thi "bốn phase là gì" là hỏi về <em>RIÊNG Bước Ba</em>.</li>
<li><strong>Bài tập ôn.</strong> Đọc ra ba Bước, rồi bốn Phase, rồi nói bốn Phase nằm trong Bước nào. Làm được từ trí nhớ là bạn nắm trọn mục 3.4a và 3.4b.</li>
</ul>
<p class="pitfall">⚠️ Đừng trộn hai cách đánh số. Có <strong>3 Step</strong> (đọc một nguồn) và <strong>4 Phase</strong> (chỉ nằm trong Step Ba). "Phase 1" KHÔNG phải "Step 1", và phương án nào coi chúng là cùng một danh sách thì sai.</p>`],

      [72, '4.1 Avoiding Plagiarism (learning outcomes)',
        `<p class="y-chinh">🎯 A new module opens — module 4, and the highest-stakes one in Mooc 1. Two outcomes: <strong>understand definition of plagiarism</strong>, and <strong>understand the consequences of plagiarism in the academic context</strong>.</p>
<ul>
<li><strong>Definition first, consequences second — in that order, deliberately.</strong> You cannot avoid something you cannot recognise. Most students who plagiarise can recite that plagiarism is wrong; what they cannot do is identify it in their own draft.</li>
<li><strong>"In the academic context" is a real qualifier.</strong> Reusing a colleague's slide deck at work with a nod of thanks is normal; reusing a classmate's paragraph in an assignment is misconduct. The rules are stricter here because the university is certifying <em>your</em> ability, not the team's output.</li>
<li><strong>Consequences at FPTU, concretely.</strong> Zero on the assessment, a formal record, possible failure of the subject, and for repeat cases disciplinary action up to expulsion. Unlike a low mark, an academic-integrity record follows you.</li>
<li><strong>Why it is worth real effort here.</strong> Module 4 is the natural home of exam questions: definitions, categories, and a list of what must be referenced — all crisp, all testable. Sections 4.1 and 4.2 alone are likely worth several marks of the 60-minute paper.</li>
<li><strong>The module has three parts.</strong> 4.1 avoiding plagiarism (slides 72–77) · 4.2 referencing and attributing sources (78–82) · 4.3 incorporating sources — quoting, paraphrasing, summarising (from slide 83 on, outside this walkthrough's range but previewed here where it matters).</li>
</ul>
<p class="meo">💡 The practical rule that covers 95% of cases, and you can carry it into every exam question: <strong>if the idea or the words are not yours, name whose they are</strong>.</p>`,
        `<p class="y-chinh">🎯 Một module mới mở ra — module 4, và là module nhiều rủi ro nhất của Mooc 1. Hai mục tiêu: <strong>hiểu ĐỊNH NGHĨA đạo văn</strong>, và <strong>hiểu HẬU QUẢ của đạo văn trong bối cảnh học thuật</strong>.</p>
<ul>
<li><strong>Định nghĩa trước, hậu quả sau — thứ tự đó là CỐ Ý.</strong> Bạn không thể tránh thứ mình không nhận ra. Phần lớn sinh viên đạo văn đều đọc vanh vách rằng đạo văn là sai; thứ họ không làm được là NHẬN RA nó trong chính bản nháp của mình.</li>
<li><strong>"Trong bối cảnh học thuật" là một giới hạn THẬT.</strong> Dùng lại bộ slide của đồng nghiệp ở công ty kèm một lời cảm ơn là bình thường; dùng lại một đoạn của bạn cùng lớp trong bài tập là vi phạm. Luật ở đây chặt hơn vì trường đang xác nhận năng lực của <em>BẠN</em>, không phải sản phẩm của cả nhóm.</li>
<li><strong>Hậu quả ở FPTU, cụ thể.</strong> Điểm 0 cho bài đó, một hồ sơ chính thức, có thể trượt môn, và tái phạm thì bị kỷ luật tới mức buộc thôi học. Khác với một điểm số thấp, hồ sơ vi phạm liêm chính học thuật đi theo bạn.</li>
<li><strong>Vì sao chỗ này đáng bỏ công thật.</strong> Module 4 là mảnh đất tự nhiên của câu hỏi thi: định nghĩa, phân loại, và một danh sách những thứ phải trích nguồn — tất cả đều gọn và đều kiểm tra được. Riêng mục 4.1 và 4.2 nhiều khả năng chiếm vài điểm trong bài thi 60 phút.</li>
<li><strong>Module có ba phần.</strong> 4.1 tránh đạo văn (slide 72–77) · 4.2 trích dẫn và ghi công nguồn (78–82) · 4.3 đưa nguồn vào bài — quote, paraphrase, summarise (từ slide 83 trở đi, nằm ngoài dải này nhưng vẫn được giới thiệu trước ở chỗ cần thiết).</li>
</ul>
<p class="meo">💡 Quy tắc thực dụng phủ 95% tình huống, và mang thẳng được vào mọi câu hỏi thi: <strong>nếu ý tưởng hoặc câu chữ không phải của bạn thì hãy nêu tên người sở hữu nó</strong>.</p>`],

      [73, 'Definition 1 — Windschuttle & Elliot (1999)',
        `<p class="y-chinh">🎯 The formal definition, given as a direct quote: "<strong>Plagiarism is a failure to acknowledge that the ideas or information being presented derive from the work of others. It is a serious form of academic misconduct</strong>" (Windschuttle &amp; Elliot, 1999).</p>
<ul>
<li><strong>Take the first sentence apart — every word is doing work.</strong> "A <em>failure to acknowledge</em>" — the offence is an omission, not a theft. "Ideas <strong>or</strong> information" — not only words; a borrowed idea in your own sentences still needs a citation. "<em>Derive from</em>" — even indirect influence counts.</li>
<li><strong>The word "failure" removes intent from the definition.</strong> A failure can be accidental. This is the single most important consequence of the wording, and it is why slide 75 can list <em>unintentional</em> plagiarism as a real type. "I forgot" is an explanation, not a defence.</li>
<li><strong>The second sentence sets the severity: "a serious form of academic misconduct".</strong> Misconduct sits in the same family as exam cheating and falsifying data — not in the family of formatting errors.</li>
<li><strong>Note the slide is itself a demonstration.</strong> Quotation marks around the borrowed words, author names and year after them. The slide practises its own rule, and you should read it as a template.</li>
<li><strong>"Ideas or information" is where students get caught.</strong> Rewriting someone's argument entirely in your own words, with no citation, is plagiarism under this definition even though a text-matching tool may find zero overlap.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: plagiarism is defined here as a <strong>failure to acknowledge</strong>, NOT as "copying". An answer option saying "plagiarism means copying text word for word" is too narrow — copying with acknowledgement is a legitimate quotation, and borrowing an idea without copying any words is still plagiarism.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa chính thức, đưa ra dưới dạng trích dẫn nguyên văn: "<strong>Plagiarism is a failure to acknowledge that the ideas or information being presented derive from the work of others. It is a serious form of academic misconduct</strong>" — Đạo văn là việc KHÔNG GHI NHẬN rằng những ý tưởng hoặc thông tin đang được trình bày bắt nguồn từ công trình của người khác. Đó là một hình thức vi phạm học thuật nghiêm trọng (Windschuttle &amp; Elliot, 1999).</p>
<ul>
<li><strong>Tháo câu đầu ra — chữ nào cũng đang gánh việc.</strong> "A <em>failure to acknowledge</em>" — lỗi ở đây là một sự BỎ SÓT, không phải hành vi ăn cắp. "Ideas <strong>hoặc</strong> information" — không chỉ câu chữ; một ý tưởng đi mượn mà viết bằng câu của bạn thì vẫn phải trích nguồn. "<em>Derive from</em>" — kể cả ảnh hưởng gián tiếp cũng tính.</li>
<li><strong>Chữ "failure" GỠ BỎ yếu tố cố ý khỏi định nghĩa.</strong> Một sự bỏ sót có thể là vô tình. Đây là hệ quả quan trọng nhất của cách diễn đạt này, và là lý do slide 75 xếp được đạo văn <em>KHÔNG CỐ Ý</em> vào một loại thật sự. "Em quên" là một lời giải thích, không phải một lý lẽ bào chữa.</li>
<li><strong>Câu thứ hai định mức nghiêm trọng: "một hình thức vi phạm học thuật NGHIÊM TRỌNG".</strong> Misconduct nằm cùng họ với gian lận thi cử và nguỵ tạo số liệu — không nằm cùng họ với lỗi trình bày.</li>
<li><strong>Để ý chính slide này là một màn TRÌNH DIỄN.</strong> Ngoặc kép bao quanh chữ đi mượn, tên tác giả và năm đặt ngay sau. Slide tự làm đúng quy tắc của nó, và bạn nên đọc nó như một khuôn mẫu.</li>
<li><strong>"Ideas or information" là chỗ sinh viên bị bắt.</strong> Viết lại toàn bộ lập luận của người khác hoàn toàn bằng chữ của mình mà không trích nguồn thì theo định nghĩa này vẫn là đạo văn, dù công cụ quét trùng lặp có thể báo 0%.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: đạo văn ở đây được định nghĩa là <strong>KHÔNG GHI NHẬN</strong>, CHỨ KHÔNG PHẢI "sao chép". Phương án nào nói "đạo văn nghĩa là chép nguyên văn từng chữ" là quá hẹp — chép mà có ghi nhận thì là trích dẫn hợp lệ, còn mượn ý mà không chép chữ nào thì vẫn là đạo văn.</p>`],

      [74, 'Definition 2 — plagiarism as claiming others\' work as your own (inserted slide, white template)',
        `<p class="y-chinh">🎯 A second definition, in plainer language: "<strong>Plagiarism is using other people's work, things like other people's ideas, arguments and opinions, and claiming them as your own without giving proper credit to the people who thought of and created the information in the first place.</strong>"</p>
<table>
<tr><th></th><th>Slide 73 (Windschuttle &amp; Elliot)</th><th>Slide 74 (this one)</th></tr>
<tr><td><strong>Core verb</strong></td><td><em>Failure to acknowledge</em> — an omission</td><td><em>Claiming as your own</em> — an assertion</td></tr>
<tr><td><strong>What is borrowed</strong></td><td>Ideas or information</td><td>Ideas, arguments and opinions</td></tr>
<tr><td><strong>Tone</strong></td><td>Formal, quoted, attributed to a source</td><td>Explanatory, no citation given</td></tr>
<tr><td><strong>Covers unintentional?</strong></td><td>Yes — a failure can be accidental</td><td>Less clearly — "claiming" sounds deliberate</td></tr>
</table>
<ul>
<li><strong>Read the two definitions together, not as rivals.</strong> One describes what you failed to do (acknowledge); the other describes what you thereby did (claimed authorship). Both land on the same remedy: name your source.</li>
<li><strong>"Arguments and opinions" is the useful addition.</strong> An argument — a chain of reasoning — is exactly the kind of thing students borrow without noticing, because reproducing someone's logic leaves no matching words behind.</li>
<li><strong>This slide is visibly NOT from the Sydney deck.</strong> White background, different typeface, no university crest, no citation for the definition itself. It is an inserted teaching slide. Worth knowing so you are not thrown when the exam quotes the Windschuttle &amp; Elliot wording as "the" definition.</li>
<li><strong>"Proper credit" is the operational phrase.</strong> Not just any mention — credit in the form the discipline expects, which is what section 4.2 (slides 78–82) then specifies: a referencing system and a referencing style.</li>
</ul>
<p class="meo">💡 If an exam question asks for <em>the</em> definition of plagiarism, expect the Windschuttle &amp; Elliot phrasing — it is the one with a citation, the one quoted formally, and the one repeated in the MOOC's own materials.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa thứ hai, bằng ngôn ngữ đời hơn: "<strong>Đạo văn là việc sử dụng công trình của người khác — những thứ như ý tưởng, lập luận và quan điểm của họ — rồi nhận là của mình mà không ghi công đúng mực cho những người đã nghĩ ra và tạo ra thông tin đó ngay từ đầu.</strong>"</p>
<table>
<tr><th></th><th>Slide 73 (Windschuttle &amp; Elliot)</th><th>Slide 74 (cái này)</th></tr>
<tr><td><strong>Động từ lõi</strong></td><td><em>Không ghi nhận</em> — một sự BỎ SÓT</td><td><em>Nhận là của mình</em> — một sự KHẲNG ĐỊNH</td></tr>
<tr><td><strong>Cái gì bị mượn</strong></td><td>Ý tưởng hoặc thông tin</td><td>Ý tưởng, lập luận và quan điểm</td></tr>
<tr><td><strong>Giọng</strong></td><td>Trang trọng, có ngoặc kép, có ghi nguồn</td><td>Giải thích, không ghi nguồn nào</td></tr>
<tr><td><strong>Có phủ loại vô tình?</strong></td><td>Có — một sự bỏ sót có thể là vô tình</td><td>Kém rõ hơn — "nhận là của mình" nghe như cố ý</td></tr>
</table>
<ul>
<li><strong>Đọc hai định nghĩa CÙNG NHAU, đừng coi chúng đối chọi.</strong> Một cái mô tả việc bạn ĐÃ KHÔNG LÀM (ghi nhận); cái kia mô tả việc bạn VÌ THẾ ĐÃ LÀM (nhận quyền tác giả). Cả hai cùng dẫn về một cách chữa: nêu tên nguồn của bạn.</li>
<li><strong>"Lập luận và quan điểm" là phần bổ sung hữu ích.</strong> Một LẬP LUẬN — một chuỗi suy lý — đúng là thứ sinh viên hay mượn mà không nhận ra, vì tái tạo logic của người khác chẳng để lại chữ nào trùng nhau.</li>
<li><strong>Slide này NHÌN LÀ BIẾT không thuộc bộ Sydney.</strong> Nền trắng, font khác, không có huy hiệu trường, và bản thân định nghĩa cũng không ghi nguồn. Đây là slide chèn thêm của người dạy. Biết trước để không bối rối khi đề thi trích cách diễn đạt của Windschuttle &amp; Elliot như là "định nghĩa chuẩn".</li>
<li><strong>"Proper credit" — ghi công ĐÚNG MỰC — là cụm mang tính vận hành.</strong> Không phải nhắc tên qua loa, mà ghi công theo đúng hình thức ngành học đòi hỏi, chính là thứ mục 4.2 (slide 78–82) quy định sau đó: một hệ trích dẫn và một kiểu trích dẫn.</li>
</ul>
<p class="meo">💡 Nếu đề thi hỏi định nghĩa CHUẨN của đạo văn, hãy chờ cách diễn đạt của Windschuttle &amp; Elliot — đó là bản có ghi nguồn, được trích trang trọng, và được lặp lại trong chính tài liệu của MOOC.</p>`],

      [75, 'Types of Plagiarism — Unintentional, Intentional, Self-plagiarism',
        `<p class="y-chinh">🎯 Three types, and the third one surprises almost everyone: <strong>Unintentional</strong> · <strong>Intentional</strong> · <strong>Self-plagiarism</strong>. Memorise all three — this is the classic three-option multiple-choice slide.</p>
<table>
<tr><th>Type</th><th>What it looks like</th><th>Typical cause</th></tr>
<tr><td><strong>Unintentional</strong></td><td>Missing citation, a paraphrase too close to the original, a quote whose quotation marks were lost while note-taking</td><td>Poor note-taking and time pressure — not dishonesty</td></tr>
<tr><td><strong>Intentional</strong></td><td>Copying a passage knowingly, buying or commissioning an essay, submitting a friend's work, passing off AI output as your own</td><td>Deliberate deception</td></tr>
<tr><td><strong>Self-plagiarism</strong></td><td>Submitting your own earlier work — or a large part of it — for a second assessment without permission or citation</td><td>Believing "it is mine, so it cannot be plagiarism"</td></tr>
</table>
<ul>
<li><strong>Unintentional is still a breach.</strong> The definition on slide 73 says "failure to acknowledge" — no intent required. Intent affects the <em>penalty</em>, never whether the offence occurred. This is the number one thing students get wrong.</li>
<li><strong>Self-plagiarism explained.</strong> Each assessment asks for <em>new</em> work that demonstrates learning. Reusing your SSL101c essay for another subject claims credit twice for one effort, and it also breaks the record — the marker cannot tell what you learned this semester. If you genuinely need to build on earlier work, ask the lecturer first and cite your own earlier piece exactly as you would anyone else's.</li>
<li><strong>The paraphrase that is still plagiarism.</strong> Original (Noda et al., 2013, p.1): "Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery." A <em>bad</em> paraphrase: "Benefits of robot-aided surgery include better dexterity and precision, a steep learning curve, and telesurgery (Noda et al., 2013)." It swaps synonyms while keeping the exact sentence skeleton and the exact order — that is still the authors' sentence wearing a costume, and it counts as plagiarism even with the citation attached. A <em>good</em> paraphrase: "Noda et al. (2013) identify several benefits of operating with robotic assistance: surgeons gain finer control and greater precision, they acquire the necessary skills quickly, and procedures can be carried out remotely (p. 1)." Different structure, different vocabulary, meaning preserved, source named.</li>
<li><strong>Where AI sits.</strong> Using an AI assistant to explain a paper you are struggling with, to check grammar, or to suggest search terms is legitimate study support. Submitting text an AI wrote and putting your name on it is <strong>intentional plagiarism</strong> under this slide — it is other people's (or a model's) work claimed as your own. If your subject permits AI assistance, it will also require you to declare it; a rule that permits use without declaration is rare, so assume declaration is required. This is the same ethics territory as CSI106 chapter 12 (computer ethics and intellectual property).</li>
</ul>
<p class="pitfall">⚠️ Two traps in one slide. (1) "It was an accident" does not move the act outside the definition. (2) "It is my own writing" does not either — self-plagiarism is an explicitly named type here.</p>`,
        `<p class="y-chinh">🎯 Ba loại, và loại thứ ba làm gần như ai cũng bất ngờ: <strong>Unintentional</strong> (không cố ý) · <strong>Intentional</strong> (cố ý) · <strong>Self-plagiarism</strong> (TỰ đạo văn). Học thuộc cả ba — đây đúng là dạng slide ba lựa chọn kinh điển của trắc nghiệm.</p>
<table>
<tr><th>Loại</th><th>Trông ra sao</th><th>Nguyên nhân thường gặp</th></tr>
<tr><td><strong>Không cố ý</strong></td><td>Thiếu trích dẫn, diễn giải bám quá sát bản gốc, câu trích bị mất ngoặc kép trong lúc ghi chú</td><td>Ghi chú cẩu thả và sức ép thời gian — không phải gian dối</td></tr>
<tr><td><strong>Cố ý</strong></td><td>Cố tình chép một đoạn, mua/thuê người viết bài, nộp bài của bạn bè, lấy sản phẩm AI nhận là của mình</td><td>Lừa dối có chủ đích</td></tr>
<tr><td><strong>Tự đạo văn</strong></td><td>Nộp lại chính bài cũ của mình — hoặc một phần lớn của nó — cho một lần đánh giá thứ hai mà không xin phép, không trích dẫn</td><td>Tin rằng "của tôi thì sao gọi là đạo văn được"</td></tr>
</table>
<ul>
<li><strong>Không cố ý VẪN là vi phạm.</strong> Định nghĩa ở slide 73 nói "failure to acknowledge" — không đòi hỏi ý định. Ý định ảnh hưởng tới <em>MỨC PHẠT</em>, chứ không bao giờ ảnh hưởng tới việc hành vi có xảy ra hay không. Đây là điều sinh viên hiểu sai nhiều nhất.</li>
<li><strong>Tự đạo văn, giải thích cho rõ.</strong> Mỗi lần đánh giá đòi hỏi công sức MỚI thể hiện việc học. Dùng lại bài SSL101c cho môn khác là nhận công hai lần cho một lần làm, và nó còn phá hỏng chính bản ghi nhận — người chấm không biết kỳ này bạn học được gì. Nếu thật sự cần phát triển tiếp từ bài cũ, hãy HỎI GIẢNG VIÊN TRƯỚC và trích dẫn chính bài cũ của mình y như trích của bất kỳ ai khác.</li>
<li><strong>Bản diễn giải VẪN LÀ đạo văn.</strong> Bản gốc (Noda et al., 2013, tr.1): "Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery." Diễn giải <em>SAI</em>: "Lợi ích của phẫu thuật có robot hỗ trợ gồm khả năng thao tác tốt hơn và độ chính xác cao hơn, đường cong học tập dốc, và phẫu thuật từ xa (Noda et al., 2013)." Nó chỉ thay từ đồng nghĩa trong khi GIỮ NGUYÊN bộ khung câu và NGUYÊN thứ tự — vẫn là câu của tác giả khoác áo mới, và vẫn tính là đạo văn KỂ CẢ khi đã ghi trích dẫn. Diễn giải <em>ĐÚNG</em>: "Noda và cộng sự (2013) chỉ ra nhiều lợi ích của việc mổ với sự hỗ trợ của robot: bác sĩ điều khiển tinh hơn và chính xác hơn, họ tiếp thu kỹ năng cần thiết rất nhanh, và ca mổ có thể thực hiện từ xa (tr. 1)." Khác cấu trúc, khác từ vựng, GIỮ NGUYÊN nghĩa, có nêu nguồn.</li>
<li><strong>AI nằm ở đâu.</strong> Dùng trợ lý AI để giải thích một bài báo bạn đang vật lộn, để soát ngữ pháp, hay để gợi ý từ khoá tìm kiếm là hỗ trợ học tập hợp lệ. Nộp phần chữ do AI viết rồi ký tên mình vào là <strong>đạo văn CỐ Ý</strong> theo đúng slide này — đó là công trình của người khác (hoặc của một mô hình) được nhận là của mình. Nếu môn học cho phép dùng AI thì nó cũng sẽ yêu cầu bạn KHAI BÁO; quy định cho dùng mà không cần khai là rất hiếm, nên hãy mặc định là phải khai. Đây cùng một địa hạt đạo đức với CSI106 chương 12 (đạo đức máy tính và sở hữu trí tuệ).</li>
</ul>
<p class="pitfall">⚠️ Hai cái bẫy trong một slide. (1) "Em lỡ thôi" không đẩy hành vi ra ngoài định nghĩa. (2) "Chữ của chính em mà" cũng không — tự đạo văn được gọi tên rành mạch ở đây như một loại riêng.</p>`],

      [76, 'What needs to be referenced? (Greetham, 2013)',
        `<p class="y-chinh">🎯 The operational checklist — six items, ending with the rule that covers everything else: <strong>Distinctive ideas · Distinctive structure or organizing strategy · Information or data from a particular source · Verbatim phrase or passage · If it is not common knowledge · Whenever in doubt, cite it!</strong> (Greetham, 2013).</p>
<table>
<tr><th>Item</th><th>Example that must be cited</th><th>Why students miss it</th></tr>
<tr><td><strong>Distinctive ideas</strong></td><td>A specific author's interpretation or theory, even in your own words</td><td>No words match, so nothing "feels" copied</td></tr>
<tr><td><strong>Distinctive structure or organizing strategy</strong></td><td>Borrowing someone's four-part framework for analysing a problem</td><td>Almost nobody realises a <em>structure</em> can be owned</td></tr>
<tr><td><strong>Information or data from a particular source</strong></td><td>A statistic, a measurement, a survey result, a table</td><td>Numbers feel like neutral facts</td></tr>
<tr><td><strong>Verbatim phrase or passage</strong></td><td>Any run of the author's exact words — even a striking three-word phrase</td><td>Short quotes feel too small to matter</td></tr>
<tr><td><strong>If it is not common knowledge</strong></td><td>Anything a reader in your field would not already know</td><td>The boundary is genuinely fuzzy</td></tr>
<tr><td><strong>Whenever in doubt, cite it!</strong></td><td>The catch-all</td><td>—</td></tr>
</table>
<ul>
<li><strong>"Distinctive structure" is the item worth pausing on.</strong> If a paper analyses a technology under Social / Technical / Economic headings and you adopt exactly that framework, you cite it — even though not one of your sentences came from that paper. Slide 68 modelled this: the MOOC wrote "Adapted from: Dovey (2010)" under a <em>table layout</em>.</li>
<li><strong>Common knowledge, made concrete.</strong> Common knowledge is what an educated reader in your field already knows and could verify in many places: "Vietnam is in Southeast Asia", "HTTP is a request-response protocol", "the Earth orbits the Sun". Not common knowledge: "68% of Vietnamese SMEs adopted cloud services by 2024" — that number came from somewhere specific, so name it.</li>
<li><strong>The test for common knowledge.</strong> Could you find it, unattributed, in five independent general sources? If yes, it is probably common knowledge. If you first learned it from one particular source, cite that source.</li>
<li><strong>"Whenever in doubt, cite it!" is asymmetric risk, deliberately.</strong> The cost of an unnecessary citation is a slightly cluttered sentence. The cost of a missing one is a misconduct finding. The asymmetry is enormous, so the rule is one-directional.</li>
<li><strong>What does NOT need a citation.</strong> Your own analysis, your own conclusions, your own data from an experiment you ran, and genuine common knowledge. Everything else does.</li>
</ul>
<p class="meo">💡 Compress to five words: <strong>ideas · structure · data · words · not-common-knowledge</strong>. Then the sixth item, "when in doubt, cite", catches whatever the first five missed.</p>`,
        `<p class="y-chinh">🎯 Danh sách kiểm vận hành — sáu mục, kết bằng quy tắc phủ hết phần còn lại: <strong>Ý tưởng đặc thù · Cấu trúc hoặc chiến lược tổ chức đặc thù · Thông tin hoặc dữ liệu từ một nguồn cụ thể · Cụm từ hoặc đoạn văn nguyên văn · Nếu nó không phải kiến thức phổ thông · Hễ còn phân vân thì cứ trích!</strong> (Greetham, 2013).</p>
<table>
<tr><th>Mục</th><th>Ví dụ buộc phải trích</th><th>Vì sao sinh viên bỏ sót</th></tr>
<tr><td><strong>Ý tưởng đặc thù</strong></td><td>Cách diễn giải hay lý thuyết riêng của một tác giả, kể cả khi bạn viết bằng chữ của mình</td><td>Không chữ nào trùng, nên chẳng "cảm thấy" là chép</td></tr>
<tr><td><strong>Cấu trúc/chiến lược tổ chức đặc thù</strong></td><td>Mượn khung bốn phần của ai đó để phân tích một vấn đề</td><td>Gần như không ai nghĩ một CẤU TRÚC lại có chủ sở hữu</td></tr>
<tr><td><strong>Thông tin/dữ liệu từ nguồn cụ thể</strong></td><td>Một con số thống kê, một phép đo, kết quả khảo sát, một bảng số liệu</td><td>Con số cho cảm giác là sự thật trung tính</td></tr>
<tr><td><strong>Cụm từ/đoạn nguyên văn</strong></td><td>Bất kỳ chuỗi chữ đúng nguyên của tác giả — kể cả một cụm ba chữ đắt giá</td><td>Trích ngắn cho cảm giác nhỏ quá, không đáng kể</td></tr>
<tr><td><strong>Không phải kiến thức phổ thông</strong></td><td>Bất cứ thứ gì mà người đọc trong ngành của bạn chưa chắc đã biết sẵn</td><td>Ranh giới thật sự mờ</td></tr>
<tr><td><strong>Phân vân thì cứ trích!</strong></td><td>Cái lưới vét</td><td>—</td></tr>
</table>
<ul>
<li><strong>"Cấu trúc đặc thù" là mục đáng dừng lại.</strong> Nếu một bài báo phân tích một công nghệ theo các đề mục Xã hội / Kỹ thuật / Kinh tế và bạn bê nguyên khung đó, bạn PHẢI trích — dù không một câu nào của bạn lấy từ bài ấy. Slide 68 làm mẫu đúng chuyện này: MOOC ghi "Adapted from: Dovey (2010)" dưới một <em>BỐ CỤC BẢNG</em>.</li>
<li><strong>Kiến thức phổ thông, nói cho cụ thể.</strong> Kiến thức phổ thông là thứ người đọc có học trong ngành đã biết sẵn và kiểm chứng được ở rất nhiều nơi: "Việt Nam nằm ở Đông Nam Á", "HTTP là giao thức yêu cầu–phản hồi", "Trái Đất quay quanh Mặt Trời". KHÔNG phải kiến thức phổ thông: "68% doanh nghiệp vừa và nhỏ Việt Nam đã dùng dịch vụ đám mây tính tới 2024" — con số đó ra từ một chỗ cụ thể, nên phải nêu tên chỗ đó.</li>
<li><strong>Phép thử cho kiến thức phổ thông.</strong> Bạn có tìm được nó, không ghi nguồn, trong năm nguồn phổ thông độc lập nhau không? Nếu có thì nhiều khả năng là kiến thức phổ thông. Nếu bạn lần đầu biết nó từ MỘT nguồn cụ thể thì trích nguồn đó.</li>
<li><strong>"Phân vân thì cứ trích" là RỦI RO BẤT ĐỐI XỨNG, và đó là chủ ý.</strong> Cái giá của một trích dẫn thừa là một câu văn hơi rườm. Cái giá của một trích dẫn thiếu là một kết luận vi phạm liêm chính. Chênh lệch khổng lồ, nên quy tắc chỉ đi một chiều.</li>
<li><strong>Cái gì KHÔNG cần trích.</strong> Phân tích của chính bạn, kết luận của chính bạn, dữ liệu do chính bạn đo từ thí nghiệm mình chạy, và kiến thức phổ thông thật sự. Ngoài ra thì đều cần.</li>
</ul>
<p class="meo">💡 Nén lại còn năm chữ: <strong>ý tưởng · cấu trúc · dữ liệu · câu chữ · không-phổ-thông</strong>. Rồi mục thứ sáu, "phân vân thì trích", vét nốt những gì năm mục đầu để lọt.</p>`],

      [77, 'Summary: What needs to be referenced? — and the three ways to use a source',
        `<p class="y-chinh">🎯 A verbatim repeat of slide 76's six-item list (Greetham, 2013) — the MOOC's strongest signal that this list is examinable. Knowing <em>what</em> to reference, though, leaves one question open: <em>how</em> do you put the source into your sentence? There are exactly three legitimate ways.</p>
<table>
<tr><th></th><th>Quote (trích nguyên văn)</th><th>Paraphrase (diễn giải)</th><th>Summarise (tóm tắt)</th></tr>
<tr><td><strong>Words</strong></td><td>The author's exact words</td><td>Entirely your words</td><td>Entirely your words</td></tr>
<tr><td><strong>Length</strong></td><td>Same as original</td><td>About the same as original</td><td>Much shorter than original</td></tr>
<tr><td><strong>Scope</strong></td><td>One sentence or passage</td><td>One sentence or passage</td><td>A whole section, article or argument</td></tr>
<tr><td><strong>Marks needed</strong></td><td>Quotation marks + author + year + <strong>page</strong></td><td>Author + year (page recommended)</td><td>Author + year</td></tr>
<tr><td><strong>Use it when</strong></td><td>The exact wording matters — a definition, a memorable claim, a legal text</td><td>You need the detail but your own voice</td><td>You need only the overall position</td></tr>
</table>
<ul>
<li><strong>One passage, all three versions.</strong> Original (Noda et al., 2013, p. 1): "Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery."</li>
<li><strong>Quote.</strong> Noda et al. (2013) report that the "advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery" (p. 1). — exact words, quotation marks, page number.</li>
<li><strong>Paraphrase.</strong> According to Noda et al. (2013), robotic assistance benefits surgery in three distinct ways: it improves the surgeon's control and precision, the necessary skills are acquired rapidly, and operations become possible at a distance (p. 1). — same level of detail, new structure, new vocabulary, source named.</li>
<li><strong>Summarise.</strong> Robotic systems have been reported to make surgery more precise and to enable remote operation (Noda et al., 2013). — one clause, the overall claim only, no page number needed.</li>
<li><strong>All three require a citation.</strong> This is the single most common misconception in the whole module: students believe paraphrasing removes the obligation. It removes the quotation marks, nothing else. The idea is still Noda's.</li>
</ul>
<p class="pitfall">⚠️ Exam discriminator: <strong>only a direct quote takes quotation marks</strong>, and <strong>only a direct quote strictly requires a page number</strong>. A paraphrase in quotation marks is wrong; a quote without quotation marks is plagiarism even with the citation attached. Section 4.3a (from slide 83) develops this in full.</p>`,
        `<p class="y-chinh">🎯 Lặp NGUYÊN VĂN danh sách sáu mục của slide 76 (Greetham, 2013) — tín hiệu mạnh nhất mà MOOC có thể phát ra rằng danh sách này sẽ vào đề. Nhưng biết <em>CÁI GÌ</em> phải trích vẫn để ngỏ một câu hỏi: <em>LÀM SAO</em> đưa nguồn vào câu của mình? Có đúng BA cách hợp lệ.</p>
<table>
<tr><th></th><th>Quote — trích nguyên văn</th><th>Paraphrase — diễn giải</th><th>Summarise — tóm tắt</th></tr>
<tr><td><strong>Câu chữ</strong></td><td>Đúng chữ của tác giả</td><td>Hoàn toàn chữ của bạn</td><td>Hoàn toàn chữ của bạn</td></tr>
<tr><td><strong>Độ dài</strong></td><td>Bằng bản gốc</td><td>Xấp xỉ bản gốc</td><td>NGẮN HƠN NHIỀU so với bản gốc</td></tr>
<tr><td><strong>Phạm vi</strong></td><td>Một câu hoặc một đoạn</td><td>Một câu hoặc một đoạn</td><td>Cả một mục, một bài báo, một lập luận</td></tr>
<tr><td><strong>Dấu hiệu bắt buộc</strong></td><td>Ngoặc kép + tác giả + năm + <strong>SỐ TRANG</strong></td><td>Tác giả + năm (nên có số trang)</td><td>Tác giả + năm</td></tr>
<tr><td><strong>Dùng khi</strong></td><td>Chính câu chữ mới quan trọng — một định nghĩa, một khẳng định đắt, một văn bản luật</td><td>Bạn cần chi tiết nhưng muốn giọng của mình</td><td>Bạn chỉ cần lập trường tổng thể</td></tr>
</table>
<ul>
<li><strong>Một đoạn gốc, đủ cả ba bản.</strong> Bản gốc (Noda et al., 2013, tr. 1): "Advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery."</li>
<li><strong>Quote — trích nguyên văn.</strong> Noda và cộng sự (2013) cho biết "advantages of robot-assisted surgery include improved dexterity and accuracy, steep learning curve, and telesurgery" (tr. 1). — đúng chữ, có ngoặc kép, có số trang.</li>
<li><strong>Paraphrase — diễn giải.</strong> Theo Noda và cộng sự (2013), sự hỗ trợ của robot mang lại ba lợi ích rõ rệt cho phẫu thuật: nó cải thiện khả năng điều khiển và độ chính xác của bác sĩ, kỹ năng cần thiết được tiếp thu rất nhanh, và ca mổ có thể tiến hành từ xa (tr. 1). — cùng mức chi tiết, cấu trúc mới, từ vựng mới, có nêu nguồn.</li>
<li><strong>Summarise — tóm tắt.</strong> Các hệ thống robot được ghi nhận là làm phẫu thuật chính xác hơn và cho phép mổ từ xa (Noda và cộng sự, 2013). — một mệnh đề, chỉ giữ khẳng định tổng thể, không cần số trang.</li>
<li><strong>CẢ BA đều phải trích dẫn.</strong> Đây là hiểu lầm phổ biến nhất của cả module: sinh viên tin rằng diễn giải thì hết nghĩa vụ. Diễn giải chỉ bỏ được cặp ngoặc kép, không bỏ được gì khác. Ý tưởng vẫn là của Noda.</li>
</ul>
<p class="pitfall">⚠️ Điểm phân biệt trong đề: <strong>CHỈ trích nguyên văn mới có ngoặc kép</strong>, và <strong>CHỈ trích nguyên văn mới bắt buộc số trang</strong>. Một bản diễn giải mà đặt trong ngoặc kép là sai; một câu trích nguyên văn mà thiếu ngoặc kép là đạo văn, kể cả khi đã ghi trích dẫn. Mục 4.3a (từ slide 83) khai triển đầy đủ chuyện này.</p>`],

      [78, '4.2 Referencing and Attributing Sources (learning outcomes)',
        `<p class="y-chinh">🎯 Section 4.2 opens with two outcomes: <strong>understand how referencing helps to avoid plagiarism</strong>, and <strong>use referencing conventions to appropriately cite a variety of information sources</strong>.</p>
<ul>
<li><strong>The first outcome states the causal link explicitly.</strong> Referencing is not a bureaucratic ritual attached to writing — it is <em>the mechanism</em> by which you avoid plagiarism. Section 4.1 defined the offence; 4.2 hands you the remedy.</li>
<li><strong>"A variety of information sources" is a warning.</strong> Books, journal articles, book chapters, conference papers, websites, videos, datasets, standards, software, interviews — each has its own reference format. The variety is exactly why citation-management software exists (see slide 82).</li>
<li><strong>What referencing buys you, beyond staying out of trouble.</strong> It shows the reader how much you read; it lets them verify your claims; it places your work in a conversation; and it makes your own argument visible by contrast — everything uncited is understood to be yours.</li>
<li><strong>"Appropriately" carries the whole difficulty.</strong> Citing is easy; citing in the format your discipline expects, consistently, across thirty sources, is where the marks are lost.</li>
<li><strong>Applied at FPTU.</strong> Your subject outline or assignment brief names the required style. IT subjects commonly require <strong>IEEE</strong>; many social-science and business subjects require <strong>APA</strong>. Read the brief before you write, because converting an entire reference list by hand afterwards is miserable.</li>
</ul>
<p class="meo">💡 Frame it as a single sentence you can reproduce in the exam: <strong>referencing avoids plagiarism by making visible which words and ideas came from where</strong>.</p>`,
        `<p class="y-chinh">🎯 Mục 4.2 mở màn với hai mục tiêu: <strong>hiểu việc trích dẫn giúp tránh đạo văn như thế nào</strong>, và <strong>dùng các quy ước trích dẫn để trích dẫn ĐÚNG CÁCH nhiều loại nguồn thông tin khác nhau</strong>.</p>
<ul>
<li><strong>Mục tiêu thứ nhất nói thẳng quan hệ NHÂN QUẢ.</strong> Trích dẫn không phải nghi thức hành chính gắn thêm vào việc viết — nó chính LÀ CƠ CHẾ giúp bạn tránh đạo văn. Mục 4.1 định nghĩa hành vi vi phạm; 4.2 trao cho bạn cách chữa.</li>
<li><strong>"Nhiều loại nguồn thông tin khác nhau" là một lời cảnh báo.</strong> Sách, bài báo tạp chí, chương sách, bài hội thảo, website, video, bộ dữ liệu, tiêu chuẩn, phần mềm, phỏng vấn — mỗi loại một định dạng riêng. Chính sự đa dạng đó là lý do phần mềm quản lý trích dẫn tồn tại (xem slide 82).</li>
<li><strong>Trích dẫn mang lại gì ngoài việc khỏi rắc rối.</strong> Nó cho người đọc thấy bạn đã đọc bao nhiêu; cho họ kiểm chứng được khẳng định của bạn; đặt bài của bạn vào một cuộc đối thoại; và làm lập luận của CHÍNH BẠN hiện rõ lên nhờ tương phản — mọi thứ không ghi nguồn đều được hiểu là của bạn.</li>
<li><strong>Chữ "appropriately" gánh toàn bộ phần khó.</strong> Trích dẫn thì dễ; trích dẫn đúng định dạng ngành học đòi hỏi, NHẤT QUÁN, xuyên suốt ba mươi nguồn, mới là chỗ mất điểm.</li>
<li><strong>Áp dụng ở FPTU.</strong> Đề cương môn hoặc đề bài sẽ nêu kiểu trích dẫn bắt buộc. Các môn CNTT thường yêu cầu <strong>IEEE</strong>; nhiều môn khoa học xã hội và kinh doanh yêu cầu <strong>APA</strong>. Đọc đề bài TRƯỚC KHI viết, vì chuyển đổi cả danh mục tài liệu bằng tay sau đó là cực hình.</li>
</ul>
<p class="meo">💡 Đóng khung thành một câu bạn tái hiện được trong phòng thi: <strong>trích dẫn giúp tránh đạo văn bằng cách làm HIỆN RÕ chữ nào và ý nào đến từ đâu</strong>.</p>`],

      [79, 'Summary: Referencing System vs Referencing Style — and the three main systems',
        `<p class="y-chinh">🎯 The definitional slide of section 4.2, and the source of its favourite exam question. <strong>Referencing System</strong> = "any set of rules and guidelines for referencing". <strong>Referencing Style</strong> = "specific conventions, rules, and guidelines for referencing". <strong>The main types of referencing systems</strong> = <strong>Endnotes, Footnotes, In-text citing</strong>. (Adapted from: Greetham, 2013; Pears &amp; Shields, 2013.)</p>
<table>
<tr><th></th><th>System</th><th>Style</th></tr>
<tr><td><strong>Definition on the slide</strong></td><td>ANY set of rules and guidelines</td><td>SPECIFIC conventions, rules and guidelines</td></tr>
<tr><td><strong>Answers the question</strong></td><td><em>Where</em> does the citation go?</td><td><em>How exactly</em> is it punctuated and ordered?</td></tr>
<tr><td><strong>The three / the many</strong></td><td>Endnotes · Footnotes · In-text citing</td><td>APA · Harvard · IEEE · MLA · Chicago · Vancouver…</td></tr>
<tr><td><strong>Relationship</strong></td><td>The general category</td><td>A concrete implementation of a system</td></tr>
</table>
<ul>
<li><strong>System is the genus, style is the species.</strong> "In-text citing" is a system; APA is a style that uses it. "Footnotes" is a system; Chicago notes-bibliography is a style that uses it. Get this hierarchy right and the whole section falls into place.</li>
<li><strong>The three systems, by where the reader's eye goes.</strong> <em>Endnotes</em> — a superscript number sends you to a numbered list at the end. <em>Footnotes</em> — a superscript number sends you to the bottom of the same page. <em>In-text citing</em> — the citation is in the sentence itself, in brackets, and full details wait in a reference list.</li>
<li><strong>Which system each style uses.</strong> APA → in-text (author, date). Harvard → in-text (author, date). IEEE → in-text, but numeric: a bracketed number [1] that also indexes the reference list. Chicago → footnotes or endnotes, depending on variant.</li>
<li><strong>Applied at FPTU.</strong> IT subjects lean IEEE — numbered [1], [2] in the text, reference list in citation order, not alphabetical. That last detail catches people out: an IEEE reference list is ordered by <em>first appearance</em>, and an APA one is ordered <em>alphabetically by author</em>.</li>
<li><strong>The slide cites its own sources.</strong> "Adapted from: Greetham, 2013; Pears &amp; Shields, 2013" — again the deck modelling its own rule, and note the semicolon separating two sources inside one bracket.</li>
</ul>
<p class="pitfall">⚠️ The classic exam question here is a swap: "APA is a referencing <em>system</em>" — FALSE, APA is a <em>style</em>. The three systems are Endnotes, Footnotes and In-text citing, and nothing else. Learn those three as a closed set.</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa của mục 4.2, và là nguồn câu hỏi thi ưa thích nhất của mục này. <strong>Referencing System (HỆ trích dẫn)</strong> = "bất kỳ bộ quy tắc và hướng dẫn nào cho việc trích dẫn". <strong>Referencing Style (KIỂU trích dẫn)</strong> = "những quy ước, quy tắc và hướng dẫn CỤ THỂ cho việc trích dẫn". <strong>Các loại hệ trích dẫn chính</strong> = <strong>Endnotes, Footnotes, In-text citing</strong>. (Adapted from: Greetham, 2013; Pears &amp; Shields, 2013.)</p>
<table>
<tr><th></th><th>System — HỆ</th><th>Style — KIỂU</th></tr>
<tr><td><strong>Định nghĩa trên slide</strong></td><td>BẤT KỲ bộ quy tắc và hướng dẫn nào</td><td>Quy ước, quy tắc, hướng dẫn CỤ THỂ</td></tr>
<tr><td><strong>Trả lời câu hỏi</strong></td><td>Trích dẫn đặt Ở ĐÂU?</td><td>Đặt dấu và sắp thứ tự CHÍNH XÁC ra sao?</td></tr>
<tr><td><strong>Ba cái / rất nhiều cái</strong></td><td>Endnotes · Footnotes · In-text citing</td><td>APA · Harvard · IEEE · MLA · Chicago · Vancouver…</td></tr>
<tr><td><strong>Quan hệ</strong></td><td>Loại tổng quát</td><td>Một hiện thực hoá cụ thể của một hệ</td></tr>
</table>
<ul>
<li><strong>System là GIỐNG, style là LOÀI.</strong> "In-text citing" là một HỆ; APA là một KIỂU dùng hệ đó. "Footnotes" là một HỆ; Chicago (bản notes-bibliography) là một KIỂU dùng hệ đó. Nắm đúng thứ bậc này thì cả mục tự sắp vào chỗ.</li>
<li><strong>Ba hệ, phân biệt theo chỗ mắt người đọc chạy tới.</strong> <em>Endnotes</em> — một con số nhỏ trên cao dẫn bạn tới danh sách đánh số ở CUỐI BÀI. <em>Footnotes</em> — con số đó dẫn xuống CHÂN TRANG đang đọc. <em>In-text citing</em> — trích dẫn nằm ngay trong câu, trong ngoặc đơn, còn thông tin đầy đủ chờ ở danh mục tài liệu tham khảo.</li>
<li><strong>Kiểu nào dùng hệ nào.</strong> APA → in-text (tác giả, năm). Harvard → in-text (tác giả, năm). IEEE → in-text nhưng theo SỐ: một con số trong ngoặc vuông [1] đồng thời là chỉ mục vào danh mục tài liệu. Chicago → footnotes hoặc endnotes, tuỳ biến thể.</li>
<li><strong>Áp dụng ở FPTU.</strong> Các môn CNTT nghiêng về IEEE — đánh số [1], [2] trong bài, danh mục tài liệu xếp theo THỨ TỰ XUẤT HIỆN chứ không theo bảng chữ cái. Chi tiết cuối này hay làm người ta vấp: danh mục IEEE xếp theo <em>lần xuất hiện đầu tiên</em>, còn danh mục APA xếp theo <em>thứ tự chữ cái tên tác giả</em>.</li>
<li><strong>Slide tự ghi nguồn cho chính nó.</strong> "Adapted from: Greetham, 2013; Pears &amp; Shields, 2013" — lại một lần deck làm mẫu đúng quy tắc của mình, và để ý dấu chấm phẩy ngăn hai nguồn trong cùng một cặp ngoặc.</li>
</ul>
<p class="pitfall">⚠️ Câu hỏi thi kinh điển ở đây là một cú TRÁO: "APA là một <em>HỆ</em> trích dẫn" — SAI, APA là một <em>KIỂU</em>. Ba HỆ là Endnotes, Footnotes và In-text citing, không có cái nào khác. Học ba cái đó như một tập ĐÓNG.</p>`],

      [80, 'Endnotes Systems — Example Reference List (op. cit. · Ibid. · loc. cit.)',
        `<p class="y-chinh">🎯 A worked endnotes list, and the slide where three Latin abbreviations appear that most students have never met:</p>
<pre>1. J. Barrat, Our final invention: Artificial intelligence and the end of
   the human era (New York, St. Martin's Press, 2013), pg 105
2. Barrat, op. cit., pg 89
3. Ibid., pg 134
4. Ibid, loc. cit.</pre>
<table>
<tr><th>Abbreviation</th><th>From the Latin</th><th>Means</th><th>In this list</th></tr>
<tr><td><strong>op. cit.</strong></td><td><em>opere citato</em></td><td>in the work already cited (by this author), different page</td><td>Note 2 = Barrat's book again, p. 89</td></tr>
<tr><td><strong>Ibid.</strong></td><td><em>ibidem</em></td><td>in the same place — the <em>immediately preceding</em> note, different page</td><td>Note 3 = same book as note 2, p. 134</td></tr>
<tr><td><strong>loc. cit.</strong></td><td><em>loco citato</em></td><td>in the place already cited — same source AND same page</td><td>Note 4 = same book, still p. 134</td></tr>
</table>
<ul>
<li><strong>The first note is the only complete one.</strong> Author initial and surname, italicised title, place and publisher in brackets, year, page. Everything after it is shorthand that depends on note 1 existing.</li>
<li><strong>Ibid. vs op. cit. is the distinction to memorise.</strong> <em>Ibid.</em> refers to the note <strong>directly above</strong> it — it breaks if another source is inserted between them. <em>op. cit.</em> refers back to an earlier work by that author, with other notes possibly in between.</li>
<li><strong>loc. cit. adds "same page too".</strong> <em>Ibid., pg 134</em> gives a new page; <em>loc. cit.</em> gives no page because it is the same page as the previous note. That is the entire difference.</li>
<li><strong>Note the citation order: author FIRST NAME initial before surname.</strong> "J. Barrat" — this is the note-style order, and it is the opposite of a reference-list entry in APA ("Barrat, J."). Slide 82 shows the contrast directly.</li>
<li><strong>Reality check.</strong> Many modern styles now discourage op. cit. and loc. cit. because they force the reader to hunt backwards, and reference managers handle repetition automatically. You still need to <em>recognise</em> them — for the exam, and for reading older literature.</li>
</ul>
<p class="pitfall">⚠️ Exam-favourite: <strong>Ibid. = the note immediately before · op. cit. = an earlier work by the same author · loc. cit. = same source and same page</strong>. Options that define Ibid. as "any earlier note by the same author" are wrong — that is op. cit.</p>`,
        `<p class="y-chinh">🎯 Một danh sách endnotes làm mẫu, và là slide xuất hiện ba chữ viết tắt tiếng Latin mà phần lớn sinh viên chưa từng gặp:</p>
<pre>1. J. Barrat, Our final invention: Artificial intelligence and the end of
   the human era (New York, St. Martin's Press, 2013), pg 105
2. Barrat, op. cit., pg 89
3. Ibid., pg 134
4. Ibid, loc. cit.</pre>
<table>
<tr><th>Viết tắt</th><th>Gốc Latin</th><th>Nghĩa</th><th>Trong danh sách này</th></tr>
<tr><td><strong>op. cit.</strong></td><td><em>opere citato</em></td><td>trong công trình ĐÃ TRÍCH (của tác giả này), TRANG KHÁC</td><td>Ghi chú 2 = lại quyển của Barrat, tr. 89</td></tr>
<tr><td><strong>Ibid.</strong></td><td><em>ibidem</em></td><td>cùng chỗ đó — ghi chú <em>NGAY LIỀN TRƯỚC</em>, trang khác</td><td>Ghi chú 3 = cùng quyển với ghi chú 2, tr. 134</td></tr>
<tr><td><strong>loc. cit.</strong></td><td><em>loco citato</em></td><td>đúng chỗ đã trích — CÙNG nguồn VÀ CÙNG trang</td><td>Ghi chú 4 = cùng quyển, vẫn tr. 134</td></tr>
</table>
<ul>
<li><strong>Chỉ ghi chú ĐẦU TIÊN là đầy đủ.</strong> Chữ cái đầu tên và họ tác giả, tên sách in nghiêng, nơi xuất bản và nhà xuất bản trong ngoặc, năm, số trang. Mọi thứ sau đó là viết tắt, và chúng phụ thuộc vào việc ghi chú 1 tồn tại.</li>
<li><strong>Ibid. với op. cit. là cặp phải học thuộc.</strong> <em>Ibid.</em> trỏ tới ghi chú <strong>NGAY PHÍA TRÊN</strong> nó — chèn thêm một nguồn khác vào giữa là nó hỏng. <em>op. cit.</em> trỏ ngược về một công trình trước đó của tác giả ấy, ở giữa có thể có nhiều ghi chú khác.</li>
<li><strong>loc. cit. thêm ý "cùng cả TRANG".</strong> <em>Ibid., pg 134</em> đưa ra trang mới; <em>loc. cit.</em> không đưa trang nào vì nó trùng trang với ghi chú trước. Khác biệt chỉ có vậy.</li>
<li><strong>Để ý thứ tự tên: chữ cái đầu TÊN đứng TRƯỚC HỌ.</strong> "J. Barrat" — đây là thứ tự của kiểu ghi chú, và nó NGƯỢC với một mục trong danh mục tài liệu theo APA ("Barrat, J."). Slide 82 cho thấy sự tương phản đó trực tiếp.</li>
<li><strong>Kiểm lại với thực tế.</strong> Nhiều kiểu hiện đại nay khuyên KHÔNG dùng op. cit. và loc. cit. vì chúng bắt người đọc lần ngược lại, và phần mềm quản lý trích dẫn tự xử lý chuyện lặp. Bạn vẫn cần <em>NHẬN RA</em> chúng — để thi, và để đọc tài liệu cũ.</li>
</ul>
<p class="pitfall">⚠️ Món khoái khẩu của đề thi: <strong>Ibid. = ghi chú ngay liền trước · op. cit. = công trình trước đó của cùng tác giả · loc. cit. = cùng nguồn và cùng trang</strong>. Phương án nào định nghĩa Ibid. là "bất kỳ ghi chú trước đó của cùng tác giả" thì sai — đó là op. cit.</p>`],

      [81, 'Footnotes Systems — abbreviation system vs name-date system',
        `<p class="y-chinh">🎯 The same book, cited two different ways at the foot of the page. The slide shows both variants of the footnote system:</p>
<pre>Abbreviation system
  1. J. Barrat, Our final invention: Artificial intelligence and
     the end of the human era (New York, St. Martin's Press, 2013), pg 105
  2. Barrat, Our final invention, pg 34

Name-date system
  1. Barrat, 2013, pg 105
  2. Barrat, 2013, pg 34</pre>
<table>
<tr><th></th><th>Abbreviation system</th><th>Name-date system</th></tr>
<tr><td><strong>First note</strong></td><td>Full bibliographic detail</td><td>Already short: author, year, page</td></tr>
<tr><td><strong>Later notes</strong></td><td>Author + shortened title + page</td><td>Identical form every time</td></tr>
<tr><td><strong>Reader gets</strong></td><td>All the detail without leaving the page</td><td>A pointer; full details are in the reference list</td></tr>
<tr><td><strong>Cost</strong></td><td>Long footnotes, heavy page</td><td>Must consult the reference list for anything more</td></tr>
</table>
<ul>
<li><strong>Footnotes vs endnotes is only about POSITION.</strong> Both use superscript numbers in the text. Footnotes sit at the bottom of the same page; endnotes collect at the end of the document. Everything else about them can be identical — which is why the exam distinguishes them purely by location.</li>
<li><strong>The abbreviation system's second note uses a SHORTENED TITLE, not Latin.</strong> "Barrat, <em>Our final invention</em>, pg 34" — compare slide 80, where the second reference was "Barrat, op. cit., pg 89". Shortened titles are the modern preference because they stay readable when notes are reordered.</li>
<li><strong>The name-date system inside footnotes is a hybrid.</strong> It borrows the author-date content of in-text citing but puts it in a note rather than in the sentence. Useful when a discipline wants unbroken prose but also an author-date convention.</li>
<li><strong>Applied at FPTU.</strong> You will rarely be asked for footnotes in an IT subject — IEEE numeric dominates. Recognise the system for the exam; use what your assignment brief requires in practice.</li>
<li><strong>Word does this for you.</strong> References → Insert Footnote places the superscript and the note together and renumbers automatically when you insert one in the middle. Never type footnote numbers by hand.</li>
</ul>
<p class="meo">💡 Three systems, three one-word cues: <strong>Footnotes = bottom of page · Endnotes = end of document · In-text = inside the sentence</strong>. That is all the exam can ask about their difference.</p>`,
        `<p class="y-chinh">🎯 Cùng một quyển sách, trích theo hai cách khác nhau ở chân trang. Slide trưng ra cả hai biến thể của hệ footnotes:</p>
<pre>Abbreviation system — hệ viết tắt
  1. J. Barrat, Our final invention: Artificial intelligence and
     the end of the human era (New York, St. Martin's Press, 2013), pg 105
  2. Barrat, Our final invention, pg 34

Name-date system — hệ tên-năm
  1. Barrat, 2013, pg 105
  2. Barrat, 2013, pg 34</pre>
<table>
<tr><th></th><th>Hệ viết tắt</th><th>Hệ tên-năm</th></tr>
<tr><td><strong>Ghi chú đầu</strong></td><td>Đầy đủ thông tin thư mục</td><td>Đã ngắn sẵn: tác giả, năm, trang</td></tr>
<tr><td><strong>Ghi chú sau</strong></td><td>Tác giả + tên sách rút gọn + trang</td><td>Lần nào cũng đúng một dạng</td></tr>
<tr><td><strong>Người đọc nhận được</strong></td><td>Toàn bộ chi tiết mà không phải rời trang</td><td>Một con trỏ; chi tiết đầy đủ nằm ở danh mục</td></tr>
<tr><td><strong>Cái giá</strong></td><td>Chân trang dài, trang nặng</td><td>Muốn biết thêm phải tra danh mục tài liệu</td></tr>
</table>
<ul>
<li><strong>Footnotes với endnotes chỉ khác nhau ở VỊ TRÍ.</strong> Cả hai đều dùng số nhỏ trên cao trong bài. Footnotes nằm ở chân chính trang đó; endnotes gom về cuối tài liệu. Mọi thứ còn lại có thể giống hệt nhau — chính vì thế đề thi phân biệt chúng thuần theo vị trí.</li>
<li><strong>Ghi chú thứ hai của hệ viết tắt dùng TÊN SÁCH RÚT GỌN, không dùng tiếng Latin.</strong> "Barrat, <em>Our final invention</em>, pg 34" — so với slide 80, nơi lần trích thứ hai là "Barrat, op. cit., pg 89". Tên rút gọn được ưa dùng hơn ngày nay vì nó vẫn đọc được khi các ghi chú bị sắp xếp lại.</li>
<li><strong>Hệ tên-năm đặt trong footnotes là một thể LAI.</strong> Nó mượn nội dung tác giả-năm của in-text citing nhưng đặt vào ghi chú thay vì đặt trong câu. Hữu ích khi một ngành muốn dòng văn liền mạch mà vẫn theo quy ước tác giả-năm.</li>
<li><strong>Áp dụng ở FPTU.</strong> Bạn hiếm khi bị đòi footnotes trong môn CNTT — IEEE đánh số thống trị. Nhận diện hệ này để thi; còn khi làm bài thì theo đúng thứ đề bài yêu cầu.</li>
<li><strong>Word làm hộ bạn việc này.</strong> References → Insert Footnote đặt số trên cao và ghi chú cùng lúc, và tự đánh số lại khi bạn chèn thêm một cái vào giữa. Đừng bao giờ gõ số ghi chú bằng tay.</li>
</ul>
<p class="meo">💡 Ba hệ, ba cụm gợi nhớ một chữ: <strong>Footnotes = chân trang · Endnotes = cuối tài liệu · In-text = ngay trong câu</strong>. Đề thi chỉ có thể hỏi tới chừng đó về khác biệt giữa chúng.</p>`],

      [82, 'In-text Citing — Example References (and the styles that use it)',
        `<p class="y-chinh">🎯 The third and most common system, shown in both halves. <strong>Citation in the body of text</strong>: (Barrat, 2013, p. 105). <strong>Reference at the end of the text</strong>: Barrat, J. (2013). <em>Our final invention: Artificial intelligence and the end of the human era</em>. New York, NY: St. Martin's Press.</p>
<ul>
<li><strong>Two halves, one system — and both are compulsory.</strong> The in-text bracket is a pointer; the reference-list entry is the destination. A citation without its list entry is a dead link, and a list entry never cited in the text is padding. Every marker checks both directions.</li>
<li><strong>Compare the name order carefully.</strong> In the reference list: "Barrat, J." — surname first, so the list can be alphabetised. In the endnote on slide 80: "J. Barrat" — initial first. Same person, different position, different order. This is a favourite exam detail.</li>
<li><strong>Read the punctuation of the reference entry as a formula:</strong> Surname, Initial. (Year). <em>Title in italics</em>. Place: Publisher. That is APA shape, and it is what the slide shows.</li>
</ul>
<table>
<tr><th></th><th>APA (7th)</th><th>Harvard</th><th>IEEE</th></tr>
<tr><td><strong>In text</strong></td><td>(Noda et al., 2013, p. 1)</td><td>(Noda et al., 2013, p. 1)</td><td>[1]</td></tr>
<tr><td><strong>Journal article in the list</strong></td><td>Noda, Y., Ida, Y., &amp; Tanaka, S. (2013). Impact of robotic assistance on precision of vitreoretinal surgery. <em>PLoS ONE, 8</em>(1), e54116.</td><td>Noda, Y., Ida, Y. and Tanaka, S. (2013) 'Impact of robotic assistance on precision of vitreoretinal surgery', <em>PLoS ONE</em>, 8(1), e54116.</td><td>[1] Y. Noda, Y. Ida, and S. Tanaka, "Impact of robotic assistance on precision of vitreoretinal surgery," <em>PLoS ONE</em>, vol. 8, no. 1, p. e54116, 2013.</td></tr>
<tr><td><strong>List order</strong></td><td>Alphabetical by surname</td><td>Alphabetical by surname</td><td><strong>Order of first appearance</strong></td></tr>
<tr><td><strong>Title marks</strong></td><td>Article title plain, journal italic</td><td>Article title in single quotes, journal italic</td><td>Article title in double quotes, journal italic</td></tr>
<tr><td><strong>Common in</strong></td><td>Psychology, education, business</td><td>Business, social sciences (UK/AU)</td><td><strong>IT, engineering — your default at FPTU</strong></td></tr>
</table>
<ul>
<li><strong>Use a reference manager — Mendeley or Zotero, both free.</strong> The workflow, step by step: (1) install the desktop app and create an account; (2) add sources — drag a PDF in, or use the browser connector button on a Google Scholar / library page, and the metadata is filled in automatically; (3) <strong>check the imported metadata</strong>, because publisher pages frequently get the author order or the year wrong; (4) install the Word plugin (Zotero: Tools → Add-ons / Install Word Add-in; Mendeley: Tools → Install MS Word Plugin); (5) in Word, use the Zotero/Mendeley tab → <em>Add/Edit Citation</em>, type the author, pick the source — the in-text citation appears in the chosen style; (6) <em>Insert Bibliography</em> at the end, and the reference list builds and updates itself; (7) to switch the whole document from APA to IEEE, change the style in the plugin and every citation and the whole list reformat at once.</li>
<li><strong>Why this matters more than it sounds.</strong> Manual reference lists are where consistency dies — and inconsistency is precisely what the "appropriately" in slide 78 penalises. It also stores your PDFs and highlights, which is Phase 3 of slide 69 living in the same place as your citations.</li>
<li><strong>What the software cannot do.</strong> It cannot decide whether you should quote, paraphrase or summarise; it cannot tell whether your paraphrase is too close to the original; and it will happily produce a perfectly formatted citation for a source you never read. The judgement stays yours.</li>
</ul>
<p class="pitfall">⚠️ Two traps at once. (1) <strong>Page number:</strong> required for a direct quote, optional (but recommended) for a paraphrase, not used for a summary. (2) <strong>List order:</strong> APA and Harvard are alphabetical, IEEE is by order of first citation. Mixing those up is the most common formatting error in an IT report.</p>`,
        `<p class="y-chinh">🎯 Hệ thứ ba và phổ biến nhất, trưng ra cả hai nửa. <strong>Trích dẫn trong thân bài</strong>: (Barrat, 2013, p. 105). <strong>Tài liệu ở cuối bài</strong>: Barrat, J. (2013). <em>Our final invention: Artificial intelligence and the end of the human era</em>. New York, NY: St. Martin's Press.</p>
<ul>
<li><strong>Hai nửa, một hệ — và cả hai đều BẮT BUỘC.</strong> Cặp ngoặc trong bài là con trỏ; mục trong danh mục là đích đến. Một trích dẫn không có mục tương ứng là một liên kết chết, còn một mục chưa từng được trích trong bài là độn cho dày. Người chấm kiểm cả hai chiều.</li>
<li><strong>So kỹ thứ tự tên.</strong> Trong danh mục: "Barrat, J." — HỌ trước, để danh sách xếp được theo bảng chữ cái. Trong endnote ở slide 80: "J. Barrat" — chữ cái đầu tên trước. Cùng một người, khác vị trí, khác thứ tự. Đây là chi tiết đề thi rất thích.</li>
<li><strong>Đọc dấu câu của mục tài liệu như một công thức:</strong> Họ, Chữ cái đầu tên. (Năm). <em>Tên sách in nghiêng</em>. Nơi xuất bản: Nhà xuất bản. Đó là hình dạng APA, và đúng là thứ slide đang trưng.</li>
</ul>
<table>
<tr><th></th><th>APA (bản 7)</th><th>Harvard</th><th>IEEE</th></tr>
<tr><td><strong>Trong bài</strong></td><td>(Noda et al., 2013, p. 1)</td><td>(Noda et al., 2013, p. 1)</td><td>[1]</td></tr>
<tr><td><strong>Bài báo tạp chí trong danh mục</strong></td><td>Noda, Y., Ida, Y., &amp; Tanaka, S. (2013). Impact of robotic assistance on precision of vitreoretinal surgery. <em>PLoS ONE, 8</em>(1), e54116.</td><td>Noda, Y., Ida, Y. and Tanaka, S. (2013) 'Impact of robotic assistance on precision of vitreoretinal surgery', <em>PLoS ONE</em>, 8(1), e54116.</td><td>[1] Y. Noda, Y. Ida, and S. Tanaka, "Impact of robotic assistance on precision of vitreoretinal surgery," <em>PLoS ONE</em>, vol. 8, no. 1, p. e54116, 2013.</td></tr>
<tr><td><strong>Thứ tự danh mục</strong></td><td>Theo bảng chữ cái của HỌ</td><td>Theo bảng chữ cái của HỌ</td><td><strong>Theo thứ tự XUẤT HIỆN lần đầu</strong></td></tr>
<tr><td><strong>Dấu cho tên bài</strong></td><td>Tên bài để trần, tên tạp chí in nghiêng</td><td>Tên bài trong ngoặc đơn nháy, tạp chí in nghiêng</td><td>Tên bài trong ngoặc kép, tạp chí in nghiêng</td></tr>
<tr><td><strong>Hay dùng ở</strong></td><td>Tâm lý, giáo dục, kinh doanh</td><td>Kinh doanh, KHXH (Anh/Úc)</td><td><strong>CNTT, kỹ thuật — mặc định của bạn ở FPTU</strong></td></tr>
</table>
<ul>
<li><strong>Hãy dùng phần mềm quản lý trích dẫn — Mendeley hoặc Zotero, đều miễn phí.</strong> Quy trình từng bước: (1) cài ứng dụng máy tính và tạo tài khoản; (2) thêm tài liệu — kéo thả file PDF vào, hoặc bấm nút trình cắm trình duyệt ngay trên trang Google Scholar / thư viện, siêu dữ liệu tự điền; (3) <strong>KIỂM LẠI siêu dữ liệu vừa nhập</strong>, vì trang của nhà xuất bản rất hay sai thứ tự tác giả hoặc sai năm; (4) cài trình cắm cho Word (Zotero: Tools → Add-ons / Install Word Add-in; Mendeley: Tools → Install MS Word Plugin); (5) trong Word, mở tab Zotero/Mendeley → <em>Add/Edit Citation</em>, gõ tên tác giả, chọn nguồn — trích dẫn trong bài hiện ra đúng kiểu đã chọn; (6) <em>Insert Bibliography</em> ở cuối bài, danh mục tài liệu tự dựng và tự cập nhật; (7) muốn đổi cả tài liệu từ APA sang IEEE thì đổi kiểu trong trình cắm, mọi trích dẫn và cả danh mục tự định dạng lại một lượt.</li>
<li><strong>Vì sao chuyện này quan trọng hơn vẻ ngoài của nó.</strong> Danh mục tài liệu làm tay là nơi tính nhất quán chết — mà không nhất quán đúng là thứ chữ "appropriately" ở slide 78 trừ điểm. Nó còn lưu luôn file PDF và các vệt tô sáng của bạn, tức là Phase 3 của slide 69 sống chung một chỗ với trích dẫn.</li>
<li><strong>Cái phần mềm KHÔNG làm được.</strong> Nó không quyết hộ bạn nên trích nguyên văn, diễn giải hay tóm tắt; nó không biết bản diễn giải của bạn có bám quá sát bản gốc không; và nó sẵn sàng sinh ra một trích dẫn định dạng hoàn hảo cho một nguồn bạn chưa hề đọc. Phần phán đoán vẫn là của bạn.</li>
</ul>
<p class="pitfall">⚠️ Hai bẫy cùng lúc. (1) <strong>Số trang:</strong> BẮT BUỘC với trích nguyên văn, tuỳ chọn (nhưng nên có) với diễn giải, KHÔNG dùng với tóm tắt. (2) <strong>Thứ tự danh mục:</strong> APA và Harvard theo bảng chữ cái, IEEE theo thứ tự trích lần đầu. Lẫn hai cái này là lỗi định dạng phổ biến nhất trong báo cáo CNTT.</p>`],

    ]),
  ].join('\n'),
};
