/**
 * Buổi 2 · Bài 7 — Business Proposal (20 slide).
 *
 * Bám bộ slide "Session 2_..._Lesson 7_Business Proposal.pptx". Đây là bài
 * dạy CHÍNH cho Group Project 1 (proposal, 10% điểm) — syllabus hỏi CQ5.1
 * "các thành phần của một proposal" và CQ6.5 "executive summary", mà bản
 * Academy cũ chỉ có đúng một dòng về proposal và 0 lần nhắc executive summary.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's2-l7';

export const b2l7 = [
  walkHead(D, 1, 20,
    'This deck is the instruction sheet for the first graded part of your group project. The ten traditional categories on slide 7 are the outline you will be marked against.',
    'Bộ slide này chính là bản hướng dẫn cho phần tính điểm đầu tiên của dự án nhóm. Mười mục truyền thống ở slide 7 là dàn ý mà bài bạn sẽ bị chấm theo.'),

  slide(D, 1, 'Business Proposal',
    `<p class="y-chinh">🎯 Title slide for Lesson 7.</p>
     <p class="meo">💡 The syllabus runs the proposal across sessions 13–15 and 18–21: write it, then present it. This deck covers the writing half.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề Bài 7.</p>
     <p class="meo">💡 Syllabus trải phần proposal qua các buổi 13–15 và 18–21: viết trước, rồi thuyết trình. Bộ slide này lo nửa viết.</p>`),

  slide(D, 2, 'Learning objectives (3)',
    `<p class="y-chinh">🎯 Three objectives, all about the document itself.</p>
     <ol>
       <li>Describe the basic <strong>elements</strong> of a business proposal.</li>
       <li>Discuss the main <strong>goals</strong> of a business proposal.</li>
       <li>Identify effective <strong>strategies</strong> to use in one.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Ba mục tiêu, đều xoay quanh chính văn bản đó.</p>
     <ol>
       <li>Mô tả các <strong>thành phần</strong> cơ bản của một đề xuất kinh doanh.</li>
       <li>Bàn về các <strong>mục tiêu</strong> chính của một đề xuất kinh doanh.</li>
       <li>Chỉ ra các <strong>chiến lược</strong> hiệu quả khi viết nó.</li>
     </ol>`),

  slide(D, 3, 'Introduction — what a proposal is for',
    `<p class="y-chinh">🎯 The definition, and every word in it does work.</p>
     <p>Business proposals are documents designed to make a <strong>persuasive appeal</strong> to the audience to achieve a <strong>defined outcome</strong>, often proposing a solution to a problem.</p>
     <ul>
       <li><span class="nhan">Persuasive</span> — not a description, not a report. It asks for a decision.</li>
       <li><span class="nhan">Defined outcome</span> — you must know what "yes" looks like before you write.</li>
       <li><span class="nhan">Solution to a problem</span> — no problem, no proposal.</li>
     </ul>
     <p class="meo">💡 Test your group's draft with one question: what exactly is the reader being asked to approve? If nobody can answer in one sentence, the document is not yet a proposal.</p>`,
    `<p class="y-chinh">🎯 Định nghĩa, và từng chữ trong đó đều có việc để làm.</p>
     <p>Đề xuất kinh doanh là văn bản được thiết kế để <strong>thuyết phục</strong> người đọc nhằm đạt một <strong>kết quả đã xác định</strong>, thường là đề nghị một giải pháp cho một vấn đề.</p>
     <ul>
       <li><span class="nhan">Thuyết phục</span> — không phải mô tả, cũng không phải báo cáo. Nó xin một quyết định.</li>
       <li><span class="nhan">Kết quả đã xác định</span> — bạn phải biết "đồng ý" trông ra sao trước khi đặt bút.</li>
       <li><span class="nhan">Giải pháp cho một vấn đề</span> — không có vấn đề thì không có đề xuất.</li>
     </ul>
     <p class="meo">💡 Thử bản nháp của nhóm bằng một câu hỏi: rốt cuộc người đọc đang được đề nghị phê duyệt cái gì? Nếu không ai trả lời gọn trong một câu thì văn bản đó chưa phải đề xuất.</p>`),

  slide(D, 4, 'Common proposal elements — the four',
    `<p class="y-chinh">🎯 Four elements, each expanded on the following slides.</p>
     <ol>
       <li>The idea</li>
       <li>Traditional categories</li>
       <li>Ethos, pathos and logos</li>
       <li>Professional presentation</li>
     </ol>
     <p class="meo">💡 Only the second is about structure. The other three decide whether the structure gets read at all.</p>`,
    `<p class="y-chinh">🎯 Bốn thành phần, mỗi cái được khai triển ở các slide sau.</p>
     <ol>
       <li>Ý tưởng</li>
       <li>Các mục truyền thống</li>
       <li>Ethos, pathos và logos</li>
       <li>Trình bày chuyên nghiệp</li>
     </ol>
     <p class="meo">💡 Chỉ cái thứ hai nói về cấu trúc. Ba cái còn lại quyết định cấu trúc ấy có được đọc hay không.</p>`),

  slide(D, 5, 'The idea',
    `<p class="y-chinh">🎯 Effective proposals are built around a great idea or solution — and the slide asks three hard questions.</p>
     <ul>
       <li>What makes your idea different or unique?</li>
       <li>How can you meet the company's needs better than other vendors?</li>
       <li>What makes you so special?</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> the third question is not about enthusiasm. Answer it with evidence — experience, a working prototype, a named constraint you handle that others do not.</p>`,
    `<p class="y-chinh">🎯 Đề xuất hiệu quả dựng quanh một ý tưởng hoặc giải pháp tốt — và slide đặt ba câu hỏi khó.</p>
     <ul>
       <li>Ý tưởng của bạn khác biệt hay độc đáo ở chỗ nào?</li>
       <li>Bạn đáp ứng nhu cầu của công ty tốt hơn các nhà cung cấp khác ra sao?</li>
       <li>Bạn đặc biệt ở chỗ nào?</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> câu thứ ba không hỏi về sự nhiệt tình. Hãy trả lời bằng bằng chứng — kinh nghiệm, bản chạy thử, một ràng buộc cụ thể mà bạn xử lý được còn người khác thì không.</p>`),

  slide(D, 6, 'Traditional categories — the list of ten',
    `<p class="y-chinh">🎯 The ten sections of a standard proposal, in order.</p>
     <ol class="hai-cot">
       <li>Cover page</li>
       <li>Executive summary</li>
       <li>Background</li>
       <li>Proposal</li>
       <li>Market analysis</li>
       <li>Benefits</li>
       <li>Timeline</li>
       <li>Marketing plan</li>
       <li>Finance</li>
       <li>Conclusion</li>
     </ol>
     <p class="meo">💡 Learn this list as a list. "List the traditional categories of a business proposal" is the most predictable written-exam question in this whole session.</p>`,
    `<p class="y-chinh">🎯 Mười phần của một đề xuất chuẩn, theo thứ tự.</p>
     <ol class="hai-cot">
       <li>Trang bìa</li>
       <li>Tóm tắt cho lãnh đạo</li>
       <li>Bối cảnh</li>
       <li>Nội dung đề xuất</li>
       <li>Phân tích thị trường</li>
       <li>Lợi ích</li>
       <li>Tiến độ</li>
       <li>Kế hoạch marketing</li>
       <li>Tài chính</li>
       <li>Kết luận</li>
     </ol>
     <p class="meo">💡 Hãy học nguyên danh sách này. "Liệt kê các mục truyền thống của một đề xuất kinh doanh" là câu dễ đoán nhất của cả buổi học này khi thi viết.</p>`),

  slide(D, 7, 'Categories explained (1–5)',
    `<p class="y-chinh">🎯 The first five, with the deck's own wording.</p>
     <ul>
       <li><span class="nhan">Cover page</span> — title page with name, title, date, and a specific reference to the request for proposal if there is one.</li>
       <li><span class="nhan">Executive summary</span> — like an abstract in a report: one or two paragraphs on the product or service and how it <em>meets the requirements and exceeds expectations</em>.</li>
       <li><span class="nhan">Background</span> — the history of your product, service or company; consider focusing on the relationship between you and the potential buyer.</li>
       <li><span class="nhan">Proposal</span> — the idea. Who, what, where, when, why, how. Clear and concise, no wasted words, no exaggeration.</li>
       <li><span class="nhan">Market analysis</span> — what already exists in the marketplace, including competing products, and how your solution compares.</li>
     </ul>
     <p class="meo">💡 The executive summary is written last and read first. That is why it must survive alone: many readers read nothing else.</p>`,
    `<p class="y-chinh">🎯 Năm mục đầu, dùng đúng chữ của bộ slide.</p>
     <ul>
       <li><span class="nhan">Trang bìa</span> — trang tiêu đề có tên, chức danh, ngày tháng, và dẫn chiếu cụ thể tới thư mời thầu nếu có.</li>
       <li><span class="nhan">Tóm tắt cho lãnh đạo</span> — như phần tóm tắt của một báo cáo: một tới hai đoạn về sản phẩm/dịch vụ và cách nó <em>đáp ứng yêu cầu và vượt kỳ vọng</em>.</li>
       <li><span class="nhan">Bối cảnh</span> — lịch sử sản phẩm, dịch vụ hoặc công ty của bạn; nên tập trung vào quan hệ giữa bạn và bên mua tiềm năng.</li>
       <li><span class="nhan">Nội dung đề xuất</span> — chính ý tưởng. Ai, cái gì, ở đâu, khi nào, vì sao, thế nào. Rõ và gọn, không thừa chữ, không phóng đại.</li>
       <li><span class="nhan">Phân tích thị trường</span> — trên thị trường đang có gì, kể cả sản phẩm cạnh tranh, và giải pháp của bạn so ra sao.</li>
     </ul>
     <p class="meo">💡 Tóm tắt cho lãnh đạo viết sau cùng nhưng được đọc đầu tiên. Vì thế nó phải đứng vững một mình: nhiều người đọc mỗi phần đó rồi thôi.</p>`),

  slide(D, 8, 'Categories explained (6–10)',
    `<p class="y-chinh">🎯 The remaining five.</p>
     <ul>
       <li><span class="nhan">Benefits</span> — how the buyer benefits. Clear, concise, specific, with a comprehensive list of immediate, short-term and long-term benefits.</li>
       <li><span class="nhan">Timeline</span> — a clear presentation, often with visual aids, of the process start to finish, with <strong>specific dated benchmarks</strong>.</li>
       <li><span class="nhan">Marketing plan</span> — delivery is often the greatest challenge for web-based services: how will people learn about you? Needed whenever success requires an audience.</li>
       <li><span class="nhan">Finance</span> — initial costs, when revenue can be anticipated, when there is a return on investment. A one-off fixed cost may be enough; a repeated service needs costs across time.</li>
       <li><span class="nhan">Conclusion</span> — like a speech or essay, restate the main points, tie them with a common theme, make it memorable.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Chú ý chữ "dated":</strong> a timeline without dates is a wish list. Slide 3 of the continuation deck shows the milestone format expected.</p>`,
    `<p class="y-chinh">🎯 Năm mục còn lại.</p>
     <ul>
       <li><span class="nhan">Lợi ích</span> — bên mua được lợi gì. Rõ, gọn, cụ thể, kèm danh sách đầy đủ các lợi ích trước mắt, ngắn hạn và dài hạn.</li>
       <li><span class="nhan">Tiến độ</span> — trình bày rõ ràng, thường có hình minh hoạ, toàn bộ quá trình từ đầu tới cuối, với <strong>các mốc có ngày tháng cụ thể</strong>.</li>
       <li><span class="nhan">Kế hoạch marketing</span> — với dịch vụ trên nền web, khâu đưa tới người dùng thường là thách thức lớn nhất: làm sao người ta biết tới bạn? Cần có bất cứ khi nào thành công phụ thuộc vào người dùng.</li>
       <li><span class="nhan">Tài chính</span> — chi phí ban đầu, khi nào có doanh thu, khi nào hoàn vốn. Có thể chỉ là một khoản cố định một lần; nhưng dịch vụ lặp lại thì cần kế hoạch chi phí trải theo thời gian.</li>
       <li><span class="nhan">Kết luận</span> — như một bài nói hay bài luận: nhắc lại các ý chính, buộc chúng bằng một chủ đề chung, làm người đọc nhớ.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Để ý chữ "có ngày tháng":</strong> tiến độ không có ngày chỉ là danh sách ước muốn. Slide 3 của bộ tiếp theo cho thấy đúng định dạng mốc thời gian được mong đợi.</p>`),

  slide(D, 9, 'Ethos, pathos and logos',
    `<p class="y-chinh">🎯 The three classical appeals, and the slide says all three require your attention.</p>
     <ul>
       <li><span class="nhan">Ethos</span> — credibility.</li>
       <li><span class="nhan">Pathos</span> — passion and enthusiasm.</li>
       <li><span class="nhan">Logos</span> — logic or reason.</li>
     </ul>
     <p class="meo">💡 Map them onto your sections: background and references carry ethos, benefits carry pathos, market analysis and finance carry logos. A proposal that is all logos reads as cold; all pathos reads as empty.</p>`,
    `<p class="y-chinh">🎯 Ba phương thức thuyết phục cổ điển, và slide nói cả ba đều cần được chú ý.</p>
     <ul>
       <li><span class="nhan">Ethos</span> — độ tin cậy.</li>
       <li><span class="nhan">Pathos</span> — nhiệt huyết, cảm xúc.</li>
       <li><span class="nhan">Logos</span> — logic, lý lẽ.</li>
     </ul>
     <p class="meo">💡 Hãy chiếu chúng vào các mục: bối cảnh và tham chiếu gánh ethos, phần lợi ích gánh pathos, phân tích thị trường và tài chính gánh logos. Đề xuất toàn logos đọc lên lạnh lẽo; toàn pathos thì rỗng.</p>`),

  slide(D, 10, 'Professional',
    `<p class="y-chinh">🎯 The base requirement, stated bluntly.</p>
     <ul>
       <li>A professional document is a <strong>base requirement</strong>. If it is less than professional, you can count on prompt dismissal.</li>
       <li>No errors in spelling or grammar.</li>
       <li>All information concise, accurate, and clearly referenced when appropriate.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>"Prompt dismissal"</strong> means the reader stops — not that they mark you down slightly. Proofreading is not polish here; it is admission.</p>`,
    `<p class="y-chinh">🎯 Yêu cầu nền, nói thẳng không vòng vo.</p>
     <ul>
       <li>Văn bản chuyên nghiệp là <strong>yêu cầu nền</strong>. Kém hơn mức đó thì cầm chắc bị gạt đi ngay.</li>
       <li>Không lỗi chính tả, không lỗi ngữ pháp.</li>
       <li>Mọi thông tin phải gọn, chính xác, và dẫn nguồn rõ ràng khi cần.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>"Gạt đi ngay"</strong> nghĩa là người đọc dừng lại — chứ không phải trừ bạn vài điểm. Ở đây soát lỗi không phải khâu đánh bóng, nó là vé vào cửa.</p>`),

  slide(D, 11, 'Practice — choose the idea for the "Social initiative" project',
    `<p class="y-chinh">🎯 In-class task: decide the idea your team will work on, and make sure it is creative and groundbreaking.</p>
     <p class="meo">💡 Use the brainstorming loop from Lesson 5–6 slide 35: generate without judging, combine, and only then evaluate. Choosing the first idea anyone says is the failure mode this course keeps warning about.</p>`,
    `<p class="y-chinh">🎯 Việc trên lớp: chốt ý tưởng nhóm bạn sẽ làm, và phải là ý sáng tạo, đột phá.</p>
     <p class="meo">💡 Hãy dùng vòng brainstorming ở slide 35 Bài 5–6: sinh ý mà không phán xét, kết hợp, rồi mới đánh giá. Chọn luôn ý đầu tiên ai đó nói ra chính là kiểu hỏng mà môn này cảnh báo suốt.</p>`),

  slide(D, 12, '1. Cover page',
    `<p class="y-chinh">🎯 Title page with name, title, date, and a specific reference to the request for proposal if applicable.</p>
     <p class="meo">💡 "Specific reference" matters in real bids: the reader may be handling dozens of responses to the same request.</p>`,
    `<p class="y-chinh">🎯 Trang tiêu đề có tên, chức danh, ngày tháng, và dẫn chiếu cụ thể tới thư mời thầu nếu có.</p>
     <p class="meo">💡 "Dẫn chiếu cụ thể" rất quan trọng trong đấu thầu thật: người đọc có thể đang xử lý hàng chục hồ sơ trả lời cùng một lời mời.</p>`),

  slide(D, 13, 'Examples of cover pages',
    `<p class="y-chinh">🎯 Sample cover pages.</p>
     <p class="meo">💡 What to copy from them: a single clear title, the client's name, your team's name, a date. What not to copy: decoration that pushes the title off the visual centre.</p>`,
    `<p class="y-chinh">🎯 Các mẫu trang bìa.</p>
     <p class="meo">💡 Thứ nên học ở đó: một tiêu đề rõ ràng duy nhất, tên khách hàng, tên nhóm, ngày tháng. Thứ không nên bắt chước: trang trí làm tiêu đề bật khỏi trung tâm thị giác.</p>`),

  slide(D, 14, '2. Executive summary',
    `<p class="y-chinh">🎯 Like an abstract in a report — one or two paragraphs on the product or service and how it meets the requirements and exceeds expectations.</p>
     <p><span class="nhan">A workable four-sentence shape</span></p>
     <ol>
       <li>The problem, in the reader's own terms.</li>
       <li>Your solution, in one sentence.</li>
       <li>The main benefit, with a number if you have one.</li>
       <li>What you are asking for.</li>
     </ol>
     <p class="meo">💡 This is CQ6.5 in the syllabus. Be able to define it <em>and</em> write one.</p>`,
    `<p class="y-chinh">🎯 Giống phần tóm tắt của một báo cáo — một tới hai đoạn về sản phẩm/dịch vụ và cách nó đáp ứng yêu cầu, vượt kỳ vọng.</p>
     <p><span class="nhan">Một khung bốn câu dùng được</span></p>
     <ol>
       <li>Vấn đề, nói bằng chính ngôn ngữ của người đọc.</li>
       <li>Giải pháp của bạn, gói trong một câu.</li>
       <li>Lợi ích chính, kèm con số nếu có.</li>
       <li>Thứ bạn đang đề nghị.</li>
     </ol>
     <p class="meo">💡 Đây chính là CQ6.5 trong syllabus. Phải vừa định nghĩa được <em>vừa</em> viết được một bản.</p>`),

  slide(D, 15, '3. Background',
    `<p class="y-chinh">🎯 Discuss the history of your product, service or company — and consider focusing on the relationship between you and the potential buyer, or similar companies.</p>
     <p class="meo">💡 The advice hidden in "consider focusing on the relationship": background is not your autobiography, it is the part of your history that makes you credible <em>to this reader</em>.</p>`,
    `<p class="y-chinh">🎯 Trình bày lịch sử sản phẩm, dịch vụ hoặc công ty của bạn — và nên tập trung vào quan hệ giữa bạn với bên mua tiềm năng, hoặc với các công ty tương tự.</p>
     <p class="meo">💡 Lời khuyên giấu trong cụm "nên tập trung vào quan hệ": bối cảnh không phải bản tự truyện của bạn, mà là phần lịch sử khiến bạn đáng tin <em>với đúng người đọc này</em>.</p>`),

  slide(D, 16, '4. Proposal — who, what, where, when, why, how',
    `<p class="y-chinh">🎯 The core section, and the slide draws the six questions as a wheel.</p>
     <ul>
       <li>Make it clear and concise.</li>
       <li>Don't waste words.</li>
       <li>Don't exaggerate.</li>
       <li>Use clear, well-supported reasoning to demonstrate your product or service.</li>
     </ul>
     <p class="meo">💡 Checking trick: write the six questions down the margin of your draft and tick each one. A missing "when" or "how" is the most common gap.</p>`,
    `<p class="y-chinh">🎯 Phần lõi, và slide vẽ sáu câu hỏi thành một vòng tròn.</p>
     <ul>
       <li>Viết rõ và gọn.</li>
       <li>Đừng phí chữ.</li>
       <li>Đừng phóng đại.</li>
       <li>Dùng lập luận rõ ràng, có dẫn chứng để chứng minh sản phẩm hoặc dịch vụ.</li>
     </ul>
     <p class="meo">💡 Mẹo soát: viết sáu câu hỏi dọc lề bản nháp rồi tick từng cái. Thiếu "khi nào" hoặc "bằng cách nào" là lỗ hổng hay gặp nhất.</p>`),

  slide(D, 17, '5. Market analysis',
    `<p class="y-chinh">🎯 What currently exists in the marketplace, including competing products or services — and how does your solution compare?</p>
     <p class="meo">💡 Naming a real competitor raises credibility (ethos). Claiming there is no competition almost always means the search was not done.</p>`,
    `<p class="y-chinh">🎯 Trên thị trường hiện có gì, kể cả sản phẩm hoặc dịch vụ cạnh tranh — và giải pháp của bạn so với chúng ra sao?</p>
     <p class="meo">💡 Gọi tên một đối thủ có thật làm tăng độ tin cậy (ethos). Khẳng định "không có đối thủ nào" gần như luôn có nghĩa là chưa tìm kỹ.</p>`),

  slide(D, 18, '6. Benefits',
    `<p class="y-chinh">🎯 How will the potential buyer benefit?</p>
     <ul>
       <li>Clear, concise, specific, short.</li>
       <li>Provide a comprehensive list of immediate and long-term benefits.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phân biệt:</strong> a feature is what your solution <em>has</em>; a benefit is what the reader <em>gets</em>. "Mobile app" is a feature; "staff report faults without returning to the office" is a benefit.</p>`,
    `<p class="y-chinh">🎯 Bên mua tiềm năng được lợi gì?</p>
     <ul>
       <li>Rõ, gọn, cụ thể, ngắn.</li>
       <li>Đưa danh sách đầy đủ các lợi ích trước mắt và dài hạn.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phân biệt:</strong> tính năng là thứ giải pháp của bạn <em>có</em>; lợi ích là thứ người đọc <em>nhận được</em>. "Ứng dụng di động" là tính năng; "nhân viên báo sự cố mà không phải quay về văn phòng" mới là lợi ích.</p>`),

  slide(D, 19, "Let's start practicing — write a proposal in your group",
    `<p class="y-chinh">🎯 Small group of 5–7 members: write a proposal from your "Social initiative" idea.</p>
     <p class="meo">💡 Divide by section, not by sentence. Sections 1–6 are on this deck; 7–10 are on the continuation deck, which is why the practice comes in two passes.</p>`,
    `<p class="y-chinh">🎯 Nhóm nhỏ 5–7 người: viết một đề xuất từ ý tưởng "Sáng kiến xã hội" của nhóm.</p>
     <p class="meo">💡 Chia việc theo mục, đừng chia theo câu. Mục 1–6 nằm ở bộ slide này; mục 7–10 ở bộ tiếp theo, nên phần thực hành mới chia thành hai lượt.</p>`),

  slide(D, 20, 'End of part 1',
    `<p class="y-chinh">🎯 Self-check before the continuation deck.</p>
     <ol>
       <li>Can you list the ten traditional categories in order?</li>
       <li>Can you write an executive summary in four sentences?</li>
       <li>Can you tell a feature from a benefit?</li>
       <li>Which appeal does your market analysis serve — ethos, pathos or logos?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Tự kiểm trước khi sang bộ tiếp.</p>
     <ol>
       <li>Bạn liệt kê được mười mục truyền thống theo thứ tự chưa?</li>
       <li>Bạn viết được một executive summary trong bốn câu chưa?</li>
       <li>Bạn phân biệt được tính năng với lợi ích chưa?</li>
       <li>Phần phân tích thị trường của bạn phục vụ phương thức nào — ethos, pathos hay logos?</li>
     </ol>`),

  books([
    ['bcs', 'chương Business Proposals — elements and structure', 'chương Business Proposals — thành phần và cấu trúc'],
    ['bc7', 'chương về proposal và persuasive messages', 'chương về đề xuất và thông điệp thuyết phục'],
  ]),

  bi(
    `<h3>✅ This lesson is Group Project part 1</h3>
     <p>The syllabus runs "GP1 — instruct proposal" at session 15 and "GP2 — present proposal" at sessions 19–21, each worth 10% of the subject. Everything on this deck is the marking outline for that work.</p>`,
    `<h3>✅ Bài này chính là phần 1 của Dự án nhóm</h3>
     <p>Syllabus xếp "GP1 — hướng dẫn viết proposal" ở buổi 15 và "GP2 — thuyết trình proposal" ở buổi 19–21, mỗi phần 10% điểm môn. Toàn bộ bộ slide này là dàn ý chấm điểm cho phần việc đó.</p>`),
].join('\n');
