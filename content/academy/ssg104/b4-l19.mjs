/**
 * Buổi 4 · Bài 19 — Writing a report (16 slide).
 *
 * Bám bộ "Session 4_..._Lesson 19_Report.pptx". Syllabus hỏi CQ14.5 về các
 * loại báo cáo; bản Academy cũ chỉ liệt kê các mục của báo cáo trong đúng một
 * dòng và không có mười tám loại báo cáo, không có bảng kiểm 14 điểm.
 * Đây cũng là tài liệu cho Group Project 3 (báo cáo cuối, 10%).
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's4-l19';

export const b4l19 = [
  walkHead(D, 1, 16,
    'Three lists: eighteen report types (slides 5–6, this is CQ14.5), the ten common elements (slide 8), and the fourteen-point quality checklist (slides 9–11) — which is effectively the rubric for your group report.',
    'Ba danh sách: mười tám loại báo cáo (slide 5–6, chính là CQ14.5), mười thành phần chung (slide 8), và bảng kiểm chất lượng mười bốn điểm (slide 9–11) — trên thực tế là phiếu chấm cho báo cáo nhóm của bạn.'),

  slide(D, 1, 'Writing a report — Session IV',
    `<p class="y-chinh">🎯 Title slide.</p>
     <p class="meo">💡 The syllabus puts the report at session 42 and the group project report at 43–44 and 54. This deck is the instruction sheet for the last graded piece of the project.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>
     <p class="meo">💡 Syllabus xếp phần báo cáo ở buổi 42, còn báo cáo dự án nhóm ở buổi 43–44 và 54. Bộ slide này là bản hướng dẫn cho phần tính điểm cuối cùng của dự án.</p>`),

  slide(D, 2, 'Chapter outline (2 parts)',
    `<p class="y-chinh">🎯 Two parts: what a report is, and the types of report.</p>`,
    `<p class="y-chinh">🎯 Hai phần: báo cáo là gì, và các loại báo cáo.</p>`),

  slide(D, 3, 'Learning objectives (3)',
    `<p class="y-chinh">🎯 Three objectives.</p>
     <ol>
       <li>Describe the main <strong>parts</strong> of a report.</li>
       <li>Understand the different <strong>types</strong> of reports.</li>
       <li><strong>Write</strong> a basic report.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Ba mục tiêu.</p>
     <ol>
       <li>Mô tả các <strong>phần</strong> chính của một báo cáo.</li>
       <li>Hiểu các <strong>loại</strong> báo cáo khác nhau.</li>
       <li><strong>Viết</strong> được một báo cáo cơ bản.</li>
     </ol>`),

  slide(D, 4, 'What is a report?',
    `<p class="y-chinh">🎯 Reports are documents designed to <strong>record and convey information to the reader</strong>.</p>
     <ul>
       <li>They are part of any business or organisation.</li>
       <li>From credit reports to police reports, they document <strong>specific information for specific audiences, goals or functions</strong>.</li>
     </ul>
     <p class="meo">💡 Contrast with the proposal from Lesson 7: a proposal argues for a decision, a report records what is or was. Mixing the two is why some student reports read as sales pitches.</p>`,
    `<p class="y-chinh">🎯 Báo cáo là văn bản được thiết kế để <strong>ghi lại và truyền đạt thông tin cho người đọc</strong>.</p>
     <ul>
       <li>Nó là một phần của mọi doanh nghiệp hay tổ chức.</li>
       <li>Từ báo cáo tín dụng tới báo cáo của cảnh sát, chúng ghi lại <strong>thông tin cụ thể cho người đọc cụ thể, mục tiêu hoặc chức năng cụ thể</strong>.</li>
     </ul>
     <p class="meo">💡 So với bản đề xuất ở Bài 7: đề xuất lập luận để xin một quyết định, còn báo cáo ghi lại cái đang là hoặc đã là. Lẫn hai thứ chính là lý do có những báo cáo của sinh viên đọc lên như bài chào hàng.</p>`),

  slide(D, 5, 'Types of reports — size and function',
    `<p class="y-chinh">🎯 Two general facts before the list.</p>
     <ul>
       <li>Reports come in all sizes, but are typically <strong>longer than a page and shorter than a book</strong>.</li>
       <li><strong>The type of report depends on its function.</strong></li>
     </ul>
     <p class="meo">💡 Second line is the one to remember: you do not choose a report type by length or by habit, you choose it by what the document has to do.</p>`,
    `<p class="y-chinh">🎯 Hai điều chung trước khi vào danh sách.</p>
     <ul>
       <li>Báo cáo có đủ kích cỡ, nhưng thường <strong>dài hơn một trang và ngắn hơn một cuốn sách</strong>.</li>
       <li><strong>Loại báo cáo phụ thuộc vào chức năng của nó.</strong></li>
     </ul>
     <p class="meo">💡 Câu thứ hai đáng nhớ: bạn không chọn loại báo cáo theo độ dài hay theo thói quen, bạn chọn theo việc mà văn bản đó phải làm.</p>`),

  slide(D, 6, 'Types of reports and their functions (1–10)',
    `<p class="y-chinh">🎯 The first ten of eighteen types — this is CQ14.5.</p>
     <ul class="hai-cot">
       <li>Laboratory report</li>
       <li>Research report</li>
       <li>Field study report</li>
       <li>Progress report</li>
       <li>Technical report</li>
       <li>Financial report</li>
       <li>Case study</li>
       <li>Needs assessment report</li>
       <li>Comparative advantage report</li>
       <li>Feasibility study</li>
     </ul>
     <p class="meo">💡 Three of these fit a student project directly: a progress report during the ten weeks, a feasibility study for the idea, and a needs assessment to justify that the problem exists.</p>`,
    `<p class="y-chinh">🎯 Mười loại đầu trong mười tám loại — chính là CQ14.5.</p>
     <ul class="hai-cot">
       <li>Báo cáo thí nghiệm</li>
       <li>Báo cáo nghiên cứu</li>
       <li>Báo cáo khảo sát thực địa</li>
       <li>Báo cáo tiến độ</li>
       <li>Báo cáo kỹ thuật</li>
       <li>Báo cáo tài chính</li>
       <li>Nghiên cứu tình huống</li>
       <li>Báo cáo đánh giá nhu cầu</li>
       <li>Báo cáo lợi thế so sánh</li>
       <li>Nghiên cứu khả thi</li>
     </ul>
     <p class="meo">💡 Ba loại trong đây hợp thẳng với dự án sinh viên: báo cáo tiến độ trong mười tuần, nghiên cứu khả thi cho ý tưởng, và báo cáo đánh giá nhu cầu để chứng minh vấn đề có thật.</p>`),

  slide(D, 7, 'Types of reports and their functions (11–18)',
    `<p class="y-chinh">🎯 The remaining eight.</p>
     <ul class="hai-cot">
       <li>Instruction manuals</li>
       <li>Compliance report</li>
       <li>Cost-benefit analysis report</li>
       <li>Decision report</li>
       <li>Benchmark report</li>
       <li>Examination report</li>
       <li>Physical description report</li>
       <li>Literature review</li>
     </ul>
     <p class="meo">💡 A literature review counts as a report type here — useful to know when a lecturer in another subject asks for "a report" on existing research.</p>`,
    `<p class="y-chinh">🎯 Tám loại còn lại.</p>
     <ul class="hai-cot">
       <li>Sách hướng dẫn sử dụng</li>
       <li>Báo cáo tuân thủ</li>
       <li>Báo cáo phân tích chi phí – lợi ích</li>
       <li>Báo cáo quyết định</li>
       <li>Báo cáo đối sánh (benchmark)</li>
       <li>Báo cáo kiểm tra</li>
       <li>Báo cáo mô tả hiện trạng</li>
       <li>Tổng quan tài liệu</li>
     </ul>
     <p class="meo">💡 Tổng quan tài liệu cũng được tính là một loại báo cáo ở đây — đáng biết khi giảng viên môn khác yêu cầu "một báo cáo" về các nghiên cứu đã có.</p>`),

  slide(D, 8, 'How are reports organized? The six key elements',
    `<p class="y-chinh">🎯 Reports are typically organised around six questions.</p>
     <ol>
       <li><span class="nhan">Whom</span> the report is about and/or prepared for.</li>
       <li><span class="nhan">What</span> was done, what problems were addressed, and the results — including conclusions and recommendations.</li>
       <li><span class="nhan">Where</span> the subject studied occurred.</li>
       <li><span class="nhan">When</span> it occurred.</li>
       <li><span class="nhan">Why</span> the report was written (its function) — including under what authority, for what reason, or by whose request.</li>
       <li><span class="nhan">How</span> the subject operated, functioned or was used.</li>
     </ol>
     <p class="meo">💡 Same six questions as the proposal and as professional writing. By now they should be the first thing you write down for any document.</p>`,
    `<p class="y-chinh">🎯 Báo cáo thường được tổ chức quanh sáu câu hỏi.</p>
     <ol>
       <li><span class="nhan">Về ai</span> và/hoặc soạn cho ai.</li>
       <li><span class="nhan">Đã làm gì</span>, đã xử lý vấn đề nào, và kết quả ra sao — gồm cả kết luận và khuyến nghị.</li>
       <li><span class="nhan">Ở đâu</span> — nơi diễn ra đối tượng nghiên cứu.</li>
       <li><span class="nhan">Khi nào</span> nó diễn ra.</li>
       <li><span class="nhan">Vì sao</span> báo cáo được viết (chức năng của nó) — gồm cả theo thẩm quyền nào, vì lý do gì, theo đề nghị của ai.</li>
       <li><span class="nhan">Bằng cách nào</span> đối tượng vận hành, hoạt động hoặc được sử dụng.</li>
     </ol>
     <p class="meo">💡 Vẫn sáu câu hỏi như ở bản đề xuất và ở bài viết chuyên nghiệp. Tới lúc này, chúng nên là thứ đầu tiên bạn viết ra cho bất kỳ văn bản nào.</p>`),

  slide(D, 9, 'Ten common elements of a report',
    `<p class="y-chinh">🎯 The structure of a full formal report.</p>
     <ol>
       <li><span class="nhan">Cover</span> — title and image.</li>
       <li><span class="nhan">Title fly</span> — title only.</li>
       <li><span class="nhan">Title page</span> — title, author, affiliation, date, and sometimes for whom it was prepared.</li>
       <li><span class="nhan">Table of contents</span> — main parts and their page numbers.</li>
       <li><span class="nhan">Abstract</span> — <em>informational</em>: topic, methods, data and results; <em>descriptive</em>: all of that <strong>without</strong> conclusions or recommendations.</li>
       <li><span class="nhan">Introduction</span> — introduces the topic.</li>
       <li><span class="nhan">Body</span> — background · methodology · results · analysis and recommendations.</li>
       <li><span class="nhan">Conclusion</span> — a concise presentation of findings.</li>
       <li><span class="nhan">References</span> — bibliography or works cited.</li>
       <li><span class="nhan">Appendix</span> — related supporting materials.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Phân biệt hai loại tóm tắt:</strong> informational vs descriptive differ by exactly one thing — whether conclusions are included. That distinction is a likely exam question.</p>`,
    `<p class="y-chinh">🎯 Cấu trúc của một báo cáo chính thức đầy đủ.</p>
     <ol>
       <li><span class="nhan">Bìa</span> — tiêu đề và hình ảnh.</li>
       <li><span class="nhan">Trang lót</span> — chỉ có tiêu đề.</li>
       <li><span class="nhan">Trang tiêu đề</span> — tiêu đề, tác giả, đơn vị, ngày tháng, đôi khi cả nơi nhận.</li>
       <li><span class="nhan">Mục lục</span> — các phần chính kèm số trang.</li>
       <li><span class="nhan">Tóm tắt</span> — loại <em>thông tin</em>: chủ đề, phương pháp, dữ liệu và kết quả; loại <em>mô tả</em>: tất cả những thứ đó <strong>nhưng không có</strong> kết luận hay khuyến nghị.</li>
       <li><span class="nhan">Mở đầu</span> — giới thiệu chủ đề.</li>
       <li><span class="nhan">Thân</span> — bối cảnh · phương pháp · kết quả · phân tích và khuyến nghị.</li>
       <li><span class="nhan">Kết luận</span> — trình bày cô đọng các phát hiện.</li>
       <li><span class="nhan">Tài liệu tham khảo</span> — thư mục hoặc danh mục trích dẫn.</li>
       <li><span class="nhan">Phụ lục</span> — tài liệu hỗ trợ liên quan.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Phân biệt hai loại tóm tắt:</strong> loại thông tin và loại mô tả khác nhau đúng một điểm — có kèm kết luận hay không. Chỗ phân biệt này dễ vào đề thi.</p>`),

  slide(D, 10, 'Quality checklist (1–5)',
    `<p class="y-chinh">🎯 Fourteen checks that a report fulfils its goals; the first five.</p>
     <ol>
       <li>The report considers the <strong>audience's needs</strong>.</li>
       <li>Format follows the <strong>function</strong> of the report.</li>
       <li>Format reflects institutional norms and expectations.</li>
       <li>Information is <strong>accurate, complete and documented</strong>.</li>
       <li>Information is easy to read.</li>
     </ol>
     <p class="meo">💡 Item 2 is the link back to slide 5: choose the type from the function, then let the type decide the format. Doing it in the other order produces reports that look right and answer nothing.</p>`,
    `<p class="y-chinh">🎯 Mười bốn điểm kiểm xem báo cáo có đạt mục tiêu không; năm điểm đầu.</p>
     <ol>
       <li>Báo cáo có tính tới <strong>nhu cầu của người đọc</strong>.</li>
       <li>Định dạng đi theo <strong>chức năng</strong> của báo cáo.</li>
       <li>Định dạng phản ánh chuẩn mực và kỳ vọng của tổ chức.</li>
       <li>Thông tin <strong>chính xác, đầy đủ và có dẫn nguồn</strong>.</li>
       <li>Thông tin dễ đọc.</li>
     </ol>
     <p class="meo">💡 Mục 2 nối về slide 5: chọn loại báo cáo theo chức năng, rồi để loại đó quyết định định dạng. Làm ngược thứ tự sẽ ra những báo cáo trông thì đúng mà chẳng trả lời được gì.</p>`),

  slide(D, 11, 'Quality checklist (6–10)',
    `<p class="y-chinh">🎯 Five checks, four of them about figures and tables.</p>
     <ol start="6">
       <li>Terms are clearly defined.</li>
       <li>Figures, tables and art <strong>support</strong> the written content.</li>
       <li>Figures, tables and art are clear and <strong>correctly labelled</strong>.</li>
       <li>Figures, tables and art are <strong>easily understood without text support</strong>.</li>
       <li>Words are easy to read — font, arrangement, organisation.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Item 9 là chuẩn cao nhất:</strong> a chart that only makes sense once you have read the paragraph above it has failed. The caption plus the axis labels must carry the point alone.</p>`,
    `<p class="y-chinh">🎯 Năm điểm kiểm, bốn trong số đó nói về hình và bảng.</p>
     <ol start="6">
       <li>Thuật ngữ được định nghĩa rõ ràng.</li>
       <li>Hình, bảng và minh hoạ <strong>hỗ trợ</strong> phần chữ.</li>
       <li>Hình, bảng và minh hoạ rõ ràng và <strong>ghi nhãn đúng</strong>.</li>
       <li>Hình, bảng và minh hoạ <strong>hiểu được ngay mà không cần đọc phần chữ</strong>.</li>
       <li>Chữ dễ đọc — phông chữ, cách sắp xếp, cách tổ chức.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Mục 9 là tiêu chuẩn cao nhất:</strong> biểu đồ chỉ hiểu được sau khi đã đọc đoạn văn bên trên là biểu đồ trượt. Riêng phần chú thích cộng nhãn trục phải tự gánh được ý.</p>`),

  slide(D, 12, 'Quality checklist (11–14)',
    `<p class="y-chinh">🎯 The last four, and the final two are unusual.</p>
     <ol start="11">
       <li>Results are clear and concise.</li>
       <li>Recommendations are <strong>reasonable and well-supported</strong>.</li>
       <li>The report represents <strong>your best effort</strong>.</li>
       <li>The report <strong>speaks for itself without your clarification or explanation</strong>.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Điểm 14 là phép thử thật:</strong> you will not be standing next to the reader. If the document needs you present to make sense, it is not finished — and in the group project the marker reads it without you.</p>`,
    `<p class="y-chinh">🎯 Bốn điểm cuối, và hai điểm chót khá đặc biệt.</p>
     <ol start="11">
       <li>Kết quả rõ ràng và cô đọng.</li>
       <li>Khuyến nghị <strong>hợp lý và có căn cứ vững</strong>.</li>
       <li>Báo cáo thể hiện <strong>nỗ lực tốt nhất của bạn</strong>.</li>
       <li>Báo cáo <strong>tự nói lên được, không cần bạn giải thích thêm</strong>.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Điểm 14 mới là phép thử thật:</strong> bạn sẽ không đứng cạnh người đọc. Nếu văn bản cần có bạn ở đó mới hiểu được thì nó chưa xong — và với dự án nhóm, người chấm đọc nó mà không có bạn.</p>`),

  slide(D, 13, 'Activity — design a survey for your project',
    `<p class="y-chinh">🎯 Design a survey to evaluate the effectiveness of the project your group is working on.</p>
     <p class="meo">💡 This is the evaluation survey the syllabus pairs with GP3 at sessions 43–44. Build it around the measurable gain idea from Lesson 15: decide in advance what result would count as the project having worked.</p>`,
    `<p class="y-chinh">🎯 Thiết kế một khảo sát để đánh giá hiệu quả dự án nhóm bạn đang làm.</p>
     <p class="meo">💡 Đây chính là khảo sát đánh giá mà syllabus ghép với GP3 ở buổi 43–44. Hãy dựng nó quanh ý "mức thu được đo lường được" ở Bài 15: quyết trước xem kết quả nào được tính là dự án đã có tác dụng.</p>`),

  slide(D, 14, 'Exercise 1 — review a real annual report',
    `<p class="y-chinh">🎯 Find an annual report for a business you want to learn about. Review it against this lesson, give examples, and compare with classmates.</p>
     <p class="meo">💡 Work through the ten elements on slide 9 and mark which ones the real report has. Most annual reports also carry sections this list does not mention — noticing that is the analysis.</p>`,
    `<p class="y-chinh">🎯 Tìm một báo cáo thường niên của doanh nghiệp bạn muốn tìm hiểu. Soi nó theo bài học này, nêu ví dụ, rồi so sánh với bạn học.</p>
     <p class="meo">💡 Hãy rà mười thành phần ở slide 9 và đánh dấu báo cáo thật có những mục nào. Phần lớn báo cáo thường niên còn có những mục mà danh sách này không nhắc tới — nhận ra điều đó mới là phần phân tích.</p>`),

  slide(D, 15, 'Exercise 2 — write a report on a business trend',
    `<p class="y-chinh">🎯 Write a report on a trend in business you have observed, and highlight at least the main finding.</p>
     <p><span class="nhan">The slide's own example</span> — from the rising cost of textbooks to the online approach to course content, textbooks are a significant issue for students. Draw on your own experience while bringing together sources that illustrate the trend.</p>
     <p class="meo">💡 "At least the main finding" is the minimum bar: a report that describes a trend without stating what it found is a summary, not a report.</p>`,
    `<p class="y-chinh">🎯 Viết một báo cáo về một xu hướng trong kinh doanh mà bạn quan sát được, và nêu bật ít nhất phát hiện chính.</p>
     <p><span class="nhan">Ví dụ ngay trên slide</span> — từ chuyện giá giáo trình tăng tới cách đưa nội dung môn học lên mạng, sách giáo trình là một vấn đề đáng kể với sinh viên. Hãy dùng chính trải nghiệm của bạn đồng thời gom các nguồn minh hoạ cho xu hướng đó.</p>
     <p class="meo">💡 "Ít nhất phát hiện chính" là mức sàn: báo cáo mô tả một xu hướng mà không nói mình phát hiện ra điều gì thì đó là bản tóm tắt, không phải báo cáo.</p>`),

  slide(D, 16, 'End of Session IV',
    `<p class="y-chinh">🎯 Session IV complete.</p>
     <ol>
       <li>Nonverbal delivery: eight types, and visual aids must be big, clear, simple, consistent (Lesson 14).</li>
       <li>Persuasion has eleven ethical limits and one thirty-second format (Lesson 15).</li>
       <li>Meetings are won before they start, and facilitation has eight failure modes (Lesson 16).</li>
       <li>Writing is a process of preparation plus three layers of revision (Lesson 17).</li>
       <li>Email, memo and letter serve different readers (Lesson 18).</li>
       <li>Reports record; their type follows their function; fourteen checks decide their quality (this lesson).</li>
     </ol>`,
    `<p class="y-chinh">🎯 Buổi IV hoàn tất.</p>
     <ol>
       <li>Trình bày phi ngôn ngữ: tám loại, và công cụ trực quan phải to, rõ, đơn giản, nhất quán (Bài 14).</li>
       <li>Thuyết phục có mười một giới hạn đạo đức và một khuôn ba mươi giây (Bài 15).</li>
       <li>Cuộc họp thắng thua trước khi bắt đầu, và việc điều hành có tám kiểu hỏng (Bài 16).</li>
       <li>Viết là quá trình chuẩn bị cộng ba tầng rà soát (Bài 17).</li>
       <li>Email, memo và thư phục vụ những người đọc khác nhau (Bài 18).</li>
       <li>Báo cáo ghi lại sự việc; loại của nó đi theo chức năng; mười bốn điểm kiểm quyết định chất lượng (bài này).</li>
     </ol>`),

  books([
    ['bcs', 'chương Report Writing — types, elements, checklist', 'chương Report Writing — các loại, thành phần, bảng kiểm'],
    ['bc7', 'chương về business reports', 'chương về báo cáo trong doanh nghiệp'],
  ]),

  bi(
    `<h3>✅ This is the rubric for your group report</h3>
     <p>Group Project part 3 is the report plus the evaluation survey, worth 10% of the subject. The fourteen-point checklist on slides 10–12 is the closest thing to a published marking scheme that this course gives you — check your draft against it line by line before submitting.</p>`,
    `<h3>✅ Đây chính là phiếu chấm cho báo cáo nhóm của bạn</h3>
     <p>Dự án nhóm phần 3 gồm báo cáo cộng khảo sát đánh giá, chiếm 10% điểm môn. Bảng kiểm mười bốn điểm ở slide 10–12 là thứ gần với một phiếu chấm công khai nhất mà môn này đưa cho bạn — hãy soi bản nháp theo từng dòng trước khi nộp.</p>`),
].join('\n');
