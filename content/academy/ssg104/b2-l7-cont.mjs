/**
 * Buổi 2 · Bài 7 (tiếp) — Business Proposal, mục 7–10 (18 slide).
 *
 * Bám bộ "Session 2_..._Lesson 7_Business Proposal (Cont.).pptx". Phần này
 * chứa mẫu mốc thời gian, hai bảng tài chính mẫu, và phân biệt proposal
 * solicited / unsolicited — cùng chỉ dẫn cuối: bản nháp không quá 2 trang và
 * KHÔNG dùng thông tin liên hệ thật.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's2-l7-cont';

export const b2l7c = [
  walkHead(D, 1, 18,
    'Sections 7–10 of the proposal, plus the two things the first deck did not cover: solicited vs unsolicited proposals, and the exact rules for the draft you must hand in.',
    'Mục 7–10 của bản đề xuất, cộng hai thứ bộ trước chưa có: đề xuất được mời so với đề xuất tự gửi, và quy định chính xác cho bản nháp bạn phải nộp.'),

  slide(D, 1, 'Business Proposal (cont.)',
    `<p class="y-chinh">🎯 Title slide. This deck picks up at category 7 of the ten listed in the first deck.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề. Bộ này nối tiếp từ mục số 7 trong mười mục đã liệt kê ở bộ trước.</p>`),

  slide(D, 2, '7. Timeline',
    `<p class="y-chinh">🎯 A clear presentation — often with visual aids — of the process from start to finish, with <strong>specific, dated benchmarks</strong> noted.</p>
     <p class="meo">💡 Three words carry the requirement: <em>specific</em>, <em>dated</em>, <em>benchmarks</em>. "Phase 2: development" fails all three; "May 2022: run focus groups" passes.</p>`,
    `<p class="y-chinh">🎯 Trình bày rõ ràng — thường kèm hình minh hoạ — toàn bộ quá trình từ đầu tới cuối, với <strong>các mốc cụ thể, có ngày tháng</strong>.</p>
     <p class="meo">💡 Ba chữ gánh toàn bộ yêu cầu: <em>cụ thể</em>, <em>có ngày</em>, <em>mốc</em>. "Giai đoạn 2: phát triển" trượt cả ba; "Tháng 5/2022: chạy phỏng vấn nhóm" thì đạt.</p>`),

  slide(D, 3, 'Sample of a milestone timeline',
    `<p class="y-chinh">🎯 A two-year timeline with six dated milestones, alternating above and below the line.</p>
     <ul>
       <li>Feb 2022 — draft blueprints</li>
       <li>May 2022 — run focus groups</li>
       <li>Oct 2022 — gather feedback</li>
       <li>Feb 2023 — test design</li>
       <li>Jul 2023 — launch design</li>
       <li>Dec 2023 — deliver to client</li>
     </ul>
     <p class="meo">💡 Copy the <em>shape</em>, not the dates: each milestone is a deliverable someone outside the team can verify, not an activity the team is busy with.</p>`,
    `<p class="y-chinh">🎯 Một dòng thời gian hai năm với sáu mốc có ngày, xen kẽ trên và dưới trục.</p>
     <ul>
       <li>02/2022 — phác thảo bản thiết kế</li>
       <li>05/2022 — chạy phỏng vấn nhóm</li>
       <li>10/2022 — thu thập phản hồi</li>
       <li>02/2023 — thử nghiệm thiết kế</li>
       <li>07/2023 — ra mắt thiết kế</li>
       <li>12/2023 — bàn giao cho khách hàng</li>
     </ul>
     <p class="meo">💡 Hãy chép cái <em>khuôn</em>, đừng chép ngày: mỗi mốc là một sản phẩm bàn giao mà người ngoài nhóm kiểm chứng được, không phải một việc nhóm đang bận làm.</p>`),

  slide(D, 4, '8. The marketing plan',
    `<p class="y-chinh">🎯 Delivery is often the greatest challenge for web-based services — how will people learn about you?</p>
     <ul>
       <li>If you are bidding on a gross lot of food-service supplies, this may not apply.</li>
       <li>But <strong>if an audience is required for success, you need a marketing plan</strong>.</li>
     </ul>
     <p class="meo">💡 The test for your own project: does the initiative fail if nobody hears about it? If yes, this section is not optional.</p>`,
    `<p class="y-chinh">🎯 Với dịch vụ trên nền web, khâu đưa tới người dùng thường là thách thức lớn nhất — làm sao người ta biết tới bạn?</p>
     <ul>
       <li>Nếu bạn đang đấu thầu một lô lớn vật tư dịch vụ ăn uống thì có thể không cần mục này.</li>
       <li>Nhưng <strong>nếu thành công phụ thuộc vào việc có người dùng, bạn buộc phải có kế hoạch marketing</strong>.</li>
     </ul>
     <p class="meo">💡 Phép thử cho chính dự án của bạn: sáng kiến này có thất bại nếu không ai biết tới nó không? Nếu có, mục này không phải tuỳ chọn.</p>`),

  slide(D, 5, "Let's practice — write the timeline and marketing plan",
    `<p class="y-chinh">🎯 In-class task: discuss and write the timeline and marketing plan of your project.</p>
     <p class="meo">💡 Do the timeline backwards from the delivery date. Forward planning fills the calendar; backward planning exposes the weeks you do not actually have.</p>`,
    `<p class="y-chinh">🎯 Việc trên lớp: thảo luận và viết phần tiến độ cùng kế hoạch marketing của dự án.</p>
     <p class="meo">💡 Hãy dựng tiến độ ngược từ ngày bàn giao. Lập xuôi thì lấp đầy lịch; lập ngược mới lòi ra những tuần bạn thực sự không có.</p>`),

  slide(D, 6, '9. Finance',
    `<p class="y-chinh">🎯 Three questions the finance section must answer.</p>
     <ul>
       <li>What are the <strong>initial costs</strong>?</li>
       <li>When can <strong>revenue</strong> be anticipated?</li>
       <li>When will there be a <strong>return on investment</strong>, if applicable?</li>
     </ul>
     <p>A proposal may involve a one-time fixed cost; but if the product or service is delivered more than once, an extended financial plan noting costs across time is required.</p>`,
    `<p class="y-chinh">🎯 Ba câu hỏi mà mục tài chính phải trả lời.</p>
     <ul>
       <li><strong>Chi phí ban đầu</strong> là bao nhiêu?</li>
       <li>Khi nào có thể trông đợi <strong>doanh thu</strong>?</li>
       <li>Khi nào <strong>hoàn vốn</strong>, nếu có?</li>
     </ul>
     <p>Một đề xuất có thể chỉ gồm khoản chi cố định một lần; nhưng nếu sản phẩm hay dịch vụ được giao nhiều lần thì phải có kế hoạch tài chính trải theo thời gian.</p>`),

  slide(D, 7, 'Sample financials — key metrics and revenue by year',
    `<p class="y-chinh">🎯 A four-year table plus a bar chart, and the pairing is the lesson.</p>
     <ul>
       <li>Columns: clients · orders · gross revenue · net revenue.</li>
       <li>2022: 10 clients, $10,000 gross, $7,000 net → 2025: 40 clients, $40,000 gross, $30,000 net.</li>
       <li>The chart repeats revenue by year so a reader sees the trend without reading the table.</li>
     </ul>
     <p class="meo">💡 Notice gross and net are both shown. A proposal that gives only gross revenue invites the first question a reviewer will ask.</p>`,
    `<p class="y-chinh">🎯 Một bảng bốn năm kèm biểu đồ cột, và chính sự đi cặp đó là bài học.</p>
     <ul>
       <li>Các cột: số khách hàng · số đơn · doanh thu gộp · doanh thu ròng.</li>
       <li>2022: 10 khách, 10.000 $ gộp, 7.000 $ ròng → 2025: 40 khách, 40.000 $ gộp, 30.000 $ ròng.</li>
       <li>Biểu đồ nhắc lại doanh thu theo năm để người đọc thấy xu hướng mà không cần đọc bảng.</li>
     </ul>
     <p class="meo">💡 Để ý cả gộp lẫn ròng đều được nêu. Bản đề xuất chỉ đưa doanh thu gộp là tự mời gọi đúng câu hỏi đầu tiên người duyệt sẽ hỏi.</p>`),

  slide(D, 8, 'Sample financials table — income, gross profit, expenses',
    `<p class="y-chinh">🎯 A three-year projection with an expense breakdown and a percentage column.</p>
     <ul>
       <li><span class="nhan">Income</span> — users 50,000 → 400,000 → 1,600,000; sales; average price per sale 75 → 80 → 90; revenue at 15%.</li>
       <li><span class="nhan">Expenses</span> — sales & marketing 70% · customer service 10% · product development 5% · research 2%.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ bảng này:</strong> total expenses exceed gross profit in year 1 (7,593,750 vs 5,625,000). That is normal for a launch year — but only if the proposal says so out loud. An unexplained loss reads as an arithmetic mistake.</p>`,
    `<p class="y-chinh">🎯 Dự phóng ba năm kèm bóc tách chi phí và một cột phần trăm.</p>
     <ul>
       <li><span class="nhan">Doanh thu</span> — người dùng 50.000 → 400.000 → 1.600.000; doanh số; giá trung bình mỗi đơn 75 → 80 → 90; doanh thu ở mức 15%.</li>
       <li><span class="nhan">Chi phí</span> — bán hàng & marketing 70% · chăm sóc khách hàng 10% · phát triển sản phẩm 5% · nghiên cứu 2%.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ bảng này:</strong> tổng chi phí năm 1 vượt lợi nhuận gộp (7.593.750 so với 5.625.000). Với năm đầu ra mắt thì đó là bình thường — nhưng chỉ khi bản đề xuất nói thẳng điều đó. Một khoản lỗ không giải thích sẽ bị đọc thành lỗi tính toán.</p>`),

  slide(D, 9, '10. Conclusion',
    `<p class="y-chinh">🎯 Like a speech or an essay.</p>
     <ul>
       <li>Restate your main points clearly.</li>
       <li>Tie them together with a common theme.</li>
       <li>Make your proposal <strong>memorable</strong>.</li>
     </ul>
     <p class="meo">💡 A conclusion that only summarises is half-done. The last line should say what happens next and who does it.</p>`,
    `<p class="y-chinh">🎯 Giống một bài nói hay một bài luận.</p>
     <ul>
       <li>Nhắc lại rõ ràng các ý chính.</li>
       <li>Buộc chúng lại bằng một chủ đề chung.</li>
       <li>Làm bản đề xuất <strong>đáng nhớ</strong>.</li>
     </ul>
     <p class="meo">💡 Kết luận chỉ tóm tắt thôi là mới xong một nửa. Câu cuối phải nói điều gì xảy ra tiếp theo và ai làm việc đó.</p>`),

  slide(D, 10, "Let's practice — finance and conclusion",
    `<p class="y-chinh">🎯 In-class task: discuss and compose the finance and conclusion sections of your project.</p>
     <p class="meo">💡 For a student social initiative, "finance" usually means volunteer hours, borrowed space and small material costs. State them anyway — a plan with no costs reads as a plan nobody has tested.</p>`,
    `<p class="y-chinh">🎯 Việc trên lớp: thảo luận và soạn mục tài chính cùng kết luận cho dự án.</p>
     <p class="meo">💡 Với một sáng kiến xã hội của sinh viên, "tài chính" thường là giờ công tình nguyện, chỗ mượn và vài khoản vật tư nhỏ. Vẫn cứ nêu ra — kế hoạch không có chi phí nào đọc lên giống kế hoạch chưa ai thử.</p>`),

  slide(D, 11, 'Ethos, pathos and logos — again, with a task',
    `<p class="y-chinh">🎯 The three appeals are repeated here because this deck turns them into an exercise.</p>
     <ul>
       <li>Ethos — credibility.</li>
       <li>Pathos — passion and enthusiasm.</li>
       <li>Logos — logic or reason.</li>
     </ul>
     <p><span class="nhan">Task</span> — create your own business logo.</p>
     <p class="meo">💡 Why a logo belongs in a rhetoric slide: a logo is pure ethos — it says "we are a real thing" before anyone reads a word.</p>`,
    `<p class="y-chinh">🎯 Ba phương thức thuyết phục được nhắc lại ở đây vì bộ slide này biến chúng thành bài tập.</p>
     <ul>
       <li>Ethos — độ tin cậy.</li>
       <li>Pathos — nhiệt huyết, cảm xúc.</li>
       <li>Logos — logic, lý lẽ.</li>
     </ul>
     <p><span class="nhan">Việc cần làm</span> — tự thiết kế logo doanh nghiệp của nhóm.</p>
     <p class="meo">💡 Vì sao cái logo lại nằm trong slide về tu từ: logo là ethos thuần tuý — nó nói "chúng tôi là một thực thể có thật" trước khi ai kịp đọc một chữ nào.</p>`),

  slide(D, 12, "Activity — create your team project's logo",
    `<p class="y-chinh">🎯 Graded in-class activity.</p>
     <p class="meo">💡 Keep it to two colours and a shape that survives at 2 cm wide. A logo that is unreadable on the cover page is working against the section it sits on.</p>`,
    `<p class="y-chinh">🎯 Hoạt động tính điểm trên lớp.</p>
     <p class="meo">💡 Giữ trong hai màu và một hình khối còn đọc được ở bề ngang 2 cm. Logo mờ tịt trên trang bìa là đang chống lại chính mục nó đứng trên.</p>`),

  slide(D, 13, 'Professional — the full checklist',
    `<p class="y-chinh">🎯 The professional requirement, now with one item the first deck did not have.</p>
     <ul>
       <li>No errors in spelling or grammar.</li>
       <li>Concise, accurate, clearly referenced.</li>
       <li><strong>Easy to find and clearly relevant, including contact information.</strong></li>
     </ul>
     <p class="meo">💡 The last item is about navigation: a reader who cannot find your contact details in five seconds cannot say yes to you.</p>`,
    `<p class="y-chinh">🎯 Yêu cầu chuyên nghiệp, giờ có thêm một mục mà bộ trước chưa nêu.</p>
     <ul>
       <li>Không lỗi chính tả, không lỗi ngữ pháp.</li>
       <li>Gọn, chính xác, dẫn nguồn rõ ràng.</li>
       <li><strong>Dễ tìm và rõ ràng liên quan, bao gồm cả thông tin liên hệ.</strong></li>
     </ul>
     <p class="meo">💡 Mục cuối nói về khả năng tra cứu: người đọc không tìm ra thông tin liên hệ của bạn trong năm giây thì không thể nói "đồng ý" với bạn.</p>`),

  slide(D, 14, 'Persuasive proposals — solicited vs unsolicited',
    `<p class="y-chinh">🎯 Two types, and they call for different writing.</p>
     <ul>
       <li><span class="nhan">Solicited</span> — you were asked to submit it. The request may be a direct verbal or written one.</li>
       <li><span class="nhan">Unsolicited</span> — the "cold calls" of business writing. They require a thorough understanding of the market, product and service, and their presentation is typically <strong>general rather than customer-specific</strong>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hệ quả khi viết:</strong> a solicited proposal answers the request point by point; an unsolicited one must first prove that a problem exists at all. Mixing the two is why cold proposals get ignored.</p>`,
    `<p class="y-chinh">🎯 Hai loại, và chúng đòi hai lối viết khác nhau.</p>
     <ul>
       <li><span class="nhan">Được mời</span> — bạn được yêu cầu nộp. Lời mời có thể bằng miệng hoặc bằng văn bản.</li>
       <li><span class="nhan">Tự gửi</span> — là kiểu "gọi điện chào hàng lạnh" của văn bản kinh doanh. Loại này đòi hiểu thật kỹ thị trường, sản phẩm và dịch vụ, và cách trình bày thường <strong>mang tính chung chung hơn là riêng cho một khách hàng</strong>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hệ quả khi viết:</strong> đề xuất được mời thì trả lời từng điểm trong lời mời; đề xuất tự gửi phải chứng minh trước hết là có tồn tại một vấn đề. Lẫn hai kiểu chính là lý do các đề xuất tự gửi bị bỏ qua.</p>`),

  slide(D, 15, 'Sample business proposal',
    `<p class="y-chinh">🎯 The deck points to a free worked example: the Writing Help Tools Center's sample business proposal.</p>
     <p class="meo">💡 Read a full example before writing your own. Reading the ten sections as a list teaches structure; reading them as one document teaches proportion — which section deserves half a page and which deserves two lines.</p>`,
    `<p class="y-chinh">🎯 Bộ slide dẫn tới một ví dụ hoàn chỉnh miễn phí: bản đề xuất mẫu của Writing Help Tools Center.</p>
     <p class="meo">💡 Hãy đọc trọn một ví dụ trước khi tự viết. Đọc mười mục dưới dạng danh sách thì học được cấu trúc; đọc chúng trong một văn bản liền mạch mới học được tỷ lệ — mục nào đáng nửa trang, mục nào chỉ đáng hai dòng.</p>`),

  slide(D, 16, 'Finalize your project proposal — the rules',
    `<p class="y-chinh">🎯 The submission rules, and the second one is a privacy instruction.</p>
     <ul>
       <li>Prepare a draft business proposal in <strong>no more than 2 pages</strong>.</li>
       <li><strong>Do not include actual contact information.</strong> Just as the sample names its employees after colours, your imaginary company should have contact details that do not link to a real business or to you as an individual.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ:</strong> the two-page limit and the fake-contact rule are not style advice — they are the conditions the work is accepted under.</p>`,
    `<p class="y-chinh">🎯 Quy định nộp bài, và điều thứ hai là một chỉ dẫn về quyền riêng tư.</p>
     <ul>
       <li>Chuẩn bị bản nháp đề xuất <strong>không quá 2 trang</strong>.</li>
       <li><strong>Không đưa thông tin liên hệ thật.</strong> Giống như bản mẫu đặt tên nhân viên theo tên màu sắc, công ty tưởng tượng của bạn phải có thông tin liên hệ không dẫn tới một doanh nghiệp có thật hay tới chính bạn.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ:</strong> giới hạn hai trang và quy định liên hệ giả không phải lời khuyên về văn phong — đó là điều kiện để bài được nhận.</p>`),

  slide(D, 17, 'Closing slide',
    `<p class="y-chinh">🎯 End of the proposal lesson.</p>
     <p><span class="nhan">Your proposal is ready when</span></p>
     <ol>
       <li>All ten sections exist and each earns its space.</li>
       <li>The timeline has dates, not phases.</li>
       <li>Costs are stated even if they are small.</li>
       <li>Ethos, pathos and logos are all present somewhere.</li>
       <li>It fits in two pages and contains no real contact details.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Kết bài về đề xuất.</p>
     <p><span class="nhan">Bản đề xuất của bạn sẵn sàng khi</span></p>
     <ol>
       <li>Đủ mười mục và mục nào cũng xứng với chỗ nó chiếm.</li>
       <li>Tiến độ có ngày tháng, không phải các "giai đoạn".</li>
       <li>Chi phí được nêu, kể cả khi nhỏ.</li>
       <li>Ethos, pathos và logos đều hiện diện ở đâu đó.</li>
       <li>Gói trong hai trang và không có thông tin liên hệ thật nào.</li>
     </ol>`),

  slide(D, 18, 'End of Lesson 7',
    `<p class="y-chinh">🎯 Final slide of the deck.</p>
     <p class="meo">💡 Next in the syllabus: session 16–17 critical thinking (Lesson 8), then sessions 19–21 where you present this proposal — that presentation is graded under Group Project part 2.</p>`,
    `<p class="y-chinh">🎯 Slide cuối của bộ này.</p>
     <p class="meo">💡 Tiếp theo trong syllabus: buổi 16–17 tư duy phản biện (Bài 8), rồi buổi 19–21 bạn thuyết trình chính bản đề xuất này — buổi thuyết trình đó được chấm vào Dự án nhóm phần 2.</p>`),

  books([
    ['bcs', 'chương Business Proposals — timeline, budget, conclusion', 'chương Business Proposals — tiến độ, ngân sách, kết luận'],
    ['bc7', 'chương về solicited và unsolicited proposals', 'chương về đề xuất được mời và đề xuất tự gửi'],
  ]),

  bi(
    `<h3>✅ Privacy rule worth repeating</h3>
     <p>The lecturer's own instruction on slide 16 — no real contact information in the draft — is the same rule this Academy follows when publishing slides: anything that identifies a real person or business is removed before the material goes online.</p>`,
    `<h3>✅ Một quy định về riêng tư đáng nhắc lại</h3>
     <p>Chỉ dẫn của chính giảng viên ở slide 16 — không dùng thông tin liên hệ thật trong bản nháp — cũng là quy tắc Academy áp dụng khi đăng slide: mọi thứ nhận diện được một con người hay doanh nghiệp có thật đều được gỡ trước khi tài liệu lên mạng.</p>`),
].join('\n');
