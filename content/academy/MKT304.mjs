/**
 * MKT304 — Integrated Marketing Communications (Truyền thông marketing tích hợp). Khối QTKD, kỳ 4.
 * Bám đề cương FLM sylID 14486 và giáo trình chính Belch & Belch — Advertising and Promotion:
 * An Integrated Marketing Communications Perspective (McGraw-Hill, 12th ed. 2021, ISBN 9781260570991),
 * đúng thứ tự chương đề cương: Ch1–2 (Ch3–4 nêu ngắn), Ch5–6, Ch7, Ch8–9, Ch10, Ch13, Ch19, Ch16, Ch17,
 * Ch14, Ch15, Ch20 (quy định quảng cáo & khuyến mại TẠI VIỆT NAM), Ch21, IMC tại Việt Nam, AI trong IMC,
 * hướng dẫn kế hoạch IMC nhóm. Đọc thêm miễn phí: OpenStax Principles of Marketing.
 * Song ngữ + ví dụ (số đã kiểm bằng máy; tình huống/thương hiệu là GIẢ ĐỊNH, không có số liệu chiến dịch
 * thật) + 3 bài tập + quiz cuối mỗi phần + câu hỏi thảo luận (diễn đạt lại, không chép đề cương).
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mkt304-0-1-overview', 'Course overview: one voice across every touch point|||Tổng quan: một tiếng nói trên mọi điểm tiếp xúc',
  'IMC là gì và vì sao “tích hợp”, sáu công cụ của phối thức xúc tiến, mô hình hoạch định IMC, chuẩn đầu ra (CLO), cách đánh giá của môn, lộ trình 9 phần theo đúng thứ tự chương Belch & Belch trong đề cương.',
  [[
    `<span class="eyebrow">MKT304 · Lesson 0.1 · Overview</span>
<h2>Integrated Marketing Communications</h2>
<p class="lead">A customer meets a brand through dozens of contacts — a video ad, a price tag, a sales assistant, a friend's review, a pack on the shelf, a news story. Integrated marketing communications (IMC) is the discipline of planning all of these contacts so that they work <strong>together</strong>, tell one consistent story and move the audience towards a measurable goal.</p>
<h3>What this course covers</h3>
<p>MKT304 follows the main textbook of the official syllabus — <strong>Belch &amp; Belch, <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em></strong> (McGraw-Hill, 12th edition) — chapter by chapter, in the teaching order the syllabus sets. You will learn how communication works in the consumer's mind, how to set objectives and budgets, how to build a creative strategy, how to plan media, and how to use each tool of the promotional mix: advertising, direct marketing, digital and interactive media, sales promotion, public relations and personal selling.</p>
<h3>Course learning outcomes (CLOs)</h3>
<table>
<tr><th>CLO</th><th>What you should be able to do</th><th>Where in this course</th></tr>
<tr><td>CLO1</td><td>Explain the role and practice of marketing and communications in an organization</td><td>Parts 1–2</td></tr>
<tr><td>CLO2</td><td>Use promotional skills to build an IMC strategy</td><td>Parts 3–7</td></tr>
<tr><td>CLO3</td><td>Build, analyse and evaluate IMC strategies and tactical plans, and measure their effectiveness</td><td>Parts 3, 5, 7 and 9 (exercises and the IMC plan)</td></tr>
<tr><td>CLO4</td><td>Apply AI in the marketing process, evaluate AI tools and handle their ethical risks critically</td><td>Part 9, lesson 9.2 (and AI notes throughout)</td></tr>
</table>
<h3>Roadmap (syllabus order)</h3>
<ol>
<li><strong>Part 1</strong> — Ch 1–4: what IMC is, its role in the marketing process, agencies and consumer behaviour.</li>
<li><strong>Part 2</strong> — Ch 5–6: the communication process, response hierarchies, source, message and channel factors.</li>
<li><strong>Part 3</strong> — Ch 7: objectives (DAGMAR) and budgeting — with Exercise 1.</li>
<li><strong>Part 4</strong> — Ch 8–9: creative strategy, from the big idea to execution and client approval.</li>
<li><strong>Part 5</strong> — Ch 10 and 13: media planning (reach, frequency, GRP, CPM) and support media — with Exercise 2.</li>
<li><strong>Part 6</strong> — Ch 19, 16, 17: international advertising, sales promotion, public relations.</li>
<li><strong>Part 7</strong> — Ch 14–15: direct marketing, the Internet and interactive media — with Exercise 3.</li>
<li><strong>Part 8</strong> — Ch 20–21: regulation of advertising and promotion <em>in Vietnam</em>; social, ethical and economic aspects.</li>
<li><strong>Part 9</strong> — IMC in Vietnam, AI in IMC, and a guide to the group IMC plan.</li>
</ol>
<h3>How you are assessed</h3>
<p>The syllabus combines a Coursera guided project on AI tools, participation, an essay test, two quizzes, an individual assignment, a <strong>group IMC plan with a creative product</strong> (the heaviest component) and a closed-book multiple-choice final exam. So this course gives you three things: concepts in exam-ready form, calculations you must be able to do by hand, and a structure for the group plan (lesson 9.3). The weights are listed in the Course materials section.</p>
<div class="callout"><span class="badge">One idea to keep</span> Integration does not mean running the same ad everywhere. It means every tool has a clear job, all jobs serve one objective, and the customer hears one brand voice. All brands and figures in this course are fictional or illustrative unless stated otherwise.</div>`,
    `<span class="eyebrow">MKT304 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông marketing tích hợp</h2>
<p class="lead">Khách hàng gặp một thương hiệu qua hàng chục lần tiếp xúc — một video quảng cáo, một nhãn giá, một nhân viên bán hàng, lời nhận xét của bạn bè, bao bì trên kệ, một bài báo. Truyền thông marketing tích hợp (IMC) là việc hoạch định tất cả những lần tiếp xúc đó để chúng <strong>phối hợp với nhau</strong>, kể một câu chuyện nhất quán và đưa công chúng tới một mục tiêu đo lường được.</p>
<h3>Môn học gồm những gì</h3>
<p>MKT304 bám theo giáo trình chính của đề cương — <strong>Belch &amp; Belch, <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em></strong> (McGraw-Hill, ấn bản 12) — từng chương, theo đúng thứ tự giảng dạy đề cương quy định. Bạn sẽ học truyền thông vận hành thế nào trong tâm trí người tiêu dùng, cách đặt mục tiêu và ngân sách, xây dựng chiến lược sáng tạo, lập kế hoạch truyền thông (media), và sử dụng từng công cụ của phối thức xúc tiến: quảng cáo, marketing trực tiếp, phương tiện số và tương tác, khuyến mại, quan hệ công chúng và bán hàng cá nhân.</p>
<h3>Chuẩn đầu ra của môn (CLO)</h3>
<table>
<tr><th>CLO</th><th>Bạn cần làm được</th><th>Học ở đâu</th></tr>
<tr><td>CLO1</td><td>Giải thích vai trò và thực hành marketing, truyền thông trong tổ chức</td><td>Phần 1–2</td></tr>
<tr><td>CLO2</td><td>Vận dụng kỹ năng xúc tiến để xây dựng chiến lược IMC</td><td>Phần 3–7</td></tr>
<tr><td>CLO3</td><td>Xây dựng, phân tích, đánh giá chiến lược và kế hoạch chiến thuật IMC, đo lường hiệu quả</td><td>Phần 3, 5, 7 và 9 (bài tập và kế hoạch IMC)</td></tr>
<tr><td>CLO4</td><td>Ứng dụng AI trong quy trình marketing, đánh giá công cụ AI và xử lý phê phán các rủi ro đạo đức</td><td>Phần 9, bài 9.2 (và các ghi chú về AI xuyên suốt)</td></tr>
</table>
<h3>Lộ trình (theo thứ tự đề cương)</h3>
<ol>
<li><strong>Phần 1</strong> — Ch 1–4: IMC là gì, vai trò trong quá trình marketing, agency và hành vi người tiêu dùng.</li>
<li><strong>Phần 2</strong> — Ch 5–6: quá trình truyền thông, các mô hình thứ bậc đáp ứng, yếu tố nguồn, thông điệp và kênh.</li>
<li><strong>Phần 3</strong> — Ch 7: mục tiêu (DAGMAR) và ngân sách — kèm Bài tập 1.</li>
<li><strong>Phần 4</strong> — Ch 8–9: chiến lược sáng tạo, từ ý tưởng lớn tới thực thi và khách hàng duyệt.</li>
<li><strong>Phần 5</strong> — Ch 10 và 13: hoạch định truyền thông (reach, frequency, GRP, CPM) và phương tiện hỗ trợ — kèm Bài tập 2.</li>
<li><strong>Phần 6</strong> — Ch 19, 16, 17: quảng cáo quốc tế, khuyến mại, quan hệ công chúng.</li>
<li><strong>Phần 7</strong> — Ch 14–15: marketing trực tiếp, Internet và phương tiện tương tác — kèm Bài tập 3.</li>
<li><strong>Phần 8</strong> — Ch 20–21: quy định về quảng cáo và khuyến mại <em>tại Việt Nam</em>; khía cạnh xã hội, đạo đức, kinh tế.</li>
<li><strong>Phần 9</strong> — IMC tại Việt Nam, AI trong IMC, và hướng dẫn kế hoạch IMC của nhóm.</li>
</ol>
<h3>Cách môn học đánh giá</h3>
<p>Đề cương kết hợp một dự án có hướng dẫn trên Coursera về công cụ AI, điểm tham gia, bài kiểm tra tự luận, hai bài quiz, một bài cá nhân, <strong>kế hoạch IMC của nhóm kèm sản phẩm sáng tạo</strong> (trọng số lớn nhất) và bài thi cuối kỳ trắc nghiệm đóng sách. Vì vậy khoá học này cho bạn ba thứ: khái niệm ở dạng sẵn sàng đi thi, các phép tính phải làm được bằng tay, và một khung cho kế hoạch nhóm (bài 9.3). Trọng số cụ thể nằm ở mục Tài liệu tham khảo.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Tích hợp không có nghĩa là chạy cùng một mẫu quảng cáo ở mọi nơi. Nó nghĩa là mỗi công cụ có một nhiệm vụ rõ ràng, mọi nhiệm vụ cùng phục vụ một mục tiêu, và khách hàng nghe thấy một tiếng nói thương hiệu duy nhất. Mọi thương hiệu và con số trong khoá học đều là giả định hoặc minh hoạ, trừ khi ghi rõ khác.</div>`,
  ]]);

const c1 = doc('mkt304-1-1-imc-introduction', '1.1 — Ch 1: An introduction to integrated marketing communications|||1.1 — Ch 1: Giới thiệu truyền thông marketing tích hợp',
  'Định nghĩa IMC (quan điểm 4As và quan điểm quá trình kinh doanh chiến lược), vì sao IMC trở nên quan trọng, sáu công cụ của phối thức xúc tiến, bốn loại điểm tiếp xúc, paid–owned–earned media, mô hình hoạch định IMC.',
  [[
    `<span class="eyebrow">MKT304 · Part 1 · Lesson 1.1</span>
<h2>Ch 1 — An introduction to IMC</h2>
<h3>From "one voice" to a business process</h3>
<p>Marketing creates value through exchange, using the marketing mix (product, price, place, promotion). <strong>Promotion</strong> is the coordination of all seller-initiated efforts to set up channels of information and persuasion to sell a product or promote an idea. For decades firms bought these efforts separately — one agency for advertising, another for promotions, another for PR — and the messages often contradicted each other.</p>
<p>An early definition of IMC from the American Association of Advertising Agencies (4As, 1989) stressed the <em>added value of a comprehensive plan</em> that evaluates the strategic role of each communication discipline and combines them for clarity, consistency and maximum impact. Later work, notably by Don Schultz, went further: IMC is a <strong>strategic business process</strong> used to plan, execute and evaluate coordinated, measurable, persuasive brand communication programmes over time, with customers, prospects, employees and other relevant audiences. The shift is from "make the ads look alike" to "manage every contact and measure the result".</p>
<h3>Why IMC became important</h3>
<ul>
<li><strong>Media and audience fragmentation</strong> — audiences are spread across many channels, platforms and screens.</li>
<li><strong>Digital and social media</strong> give consumers control: they skip ads, search, compare and publish their own opinions.</li>
<li><strong>Power shift to retailers</strong> and platforms, which demand trade and platform spending.</li>
<li><strong>Accountability</strong> — top management wants to know what each unit of spending returns.</li>
<li><strong>Data and technology</strong> make it possible to target, personalise and track responses.</li>
</ul>
<h3>The promotional mix</h3>
<table>
<tr><th>Tool</th><th>Essence</th><th>Main strength</th><th>Main limitation</th></tr>
<tr><td>Advertising</td><td>Paid, nonpersonal communication from an identified sponsor</td><td>Builds awareness and image at scale</td><td>Clutter, ad avoidance, indirect link to sales</td></tr>
<tr><td>Direct marketing</td><td>Communicating directly with targeted customers to get a response or transaction</td><td>Measurable, personalised</td><td>Needs accurate data; "junk" image</td></tr>
<tr><td>Digital / interactive marketing</td><td>Two-way communication through the Internet, social and mobile</td><td>Targeting, interaction, real-time data</td><td>Measurement disputes, brand-safety risks</td></tr>
<tr><td>Sales promotion</td><td>Extra value or incentives to consumers or the trade</td><td>Immediate sales response</td><td>Can erode brand image and margins</td></tr>
<tr><td>Publicity / public relations</td><td>Managing relations with publics; nonpaid news coverage</td><td>High credibility</td><td>Little control over content and timing</td></tr>
<tr><td>Personal selling</td><td>Person-to-person communication</td><td>Tailored, immediate feedback</td><td>High cost per contact</td></tr>
</table>
<h3>Touch points and paid, owned, earned media</h3>
<p>A contact point, or <strong>touch point</strong>, is any occasion on which a customer is exposed to the brand. A widely used classification (Tom Duncan) distinguishes <strong>company-created</strong> touch points (ads, websites, packaging), <strong>intrinsic</strong> ones that occur while buying or using the product (the store, the delivery, customer service), <strong>unexpected</strong> ones the firm does not control (a friend's comment, an online review, a news story) and <strong>customer-initiated</strong> ones (a customer calls the hotline or messages the brand). Media are also grouped by ownership: <strong>paid</strong> (bought ad space and time), <strong>owned</strong> (channels the brand controls — website, app, social pages, packaging) and <strong>earned</strong> (publicity, shares, reviews, word of mouth).</p>
<h3>The IMC planning model</h3>
<ol>
<li><strong>Review the marketing plan</strong> — situation, objectives, strategy.</li>
<li><strong>Analyse the promotional programme situation</strong> — internal (the firm, its resources, past programmes) and external (consumers, segments, competitors, environment).</li>
<li><strong>Analyse the communication process</strong> — how the target will respond; communication goals.</li>
<li><strong>Determine the budget</strong> — tentative total and allocation.</li>
<li><strong>Develop the IMC programme</strong> — for each tool: objectives, message strategy, media strategy.</li>
<li><strong>Integrate and implement</strong>, then <strong>monitor, evaluate and control</strong>.</li>
</ol>
<div class="callout"><span class="badge">Remember</span> The planning model is the skeleton of this whole course — and of your group IMC plan. Every later chapter fills in one of its boxes.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Why is "IMC is a business process" a stronger definition than "IMC means consistent ads"?</li>
<li>Pick a brand you know. List two touch points of each of Duncan's four types. Which ones does the brand control least?</li>
<li>Classify a brand's TikTok channel, a paid KOL video and a newspaper story about the brand as paid, owned or earned.</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 1 · Bài 1.1</span>
<h2>Ch 1 — Giới thiệu IMC</h2>
<h3>Từ "một tiếng nói" tới một quá trình kinh doanh</h3>
<p>Marketing tạo ra giá trị qua trao đổi, bằng marketing mix (sản phẩm, giá, phân phối, xúc tiến). <strong>Xúc tiến</strong> là sự phối hợp mọi nỗ lực do người bán khởi xướng nhằm thiết lập các kênh thông tin và thuyết phục để bán sản phẩm hoặc cổ vũ một ý tưởng. Suốt nhiều thập kỷ, doanh nghiệp mua các nỗ lực này tách rời — một agency lo quảng cáo, một đơn vị lo khuyến mại, một đơn vị khác lo PR — và các thông điệp thường mâu thuẫn nhau.</p>
<p>Định nghĩa ban đầu về IMC của Hiệp hội các Agency Quảng cáo Hoa Kỳ (4As, 1989) nhấn mạnh <em>giá trị gia tăng của một kế hoạch toàn diện</em>, đánh giá vai trò chiến lược của từng lĩnh vực truyền thông và kết hợp chúng để đạt sự rõ ràng, nhất quán và tác động tối đa. Các nghiên cứu sau đó, tiêu biểu là của Don Schultz, đi xa hơn: IMC là một <strong>quá trình kinh doanh chiến lược</strong> dùng để hoạch định, thực thi và đánh giá các chương trình truyền thông thương hiệu có phối hợp, đo lường được, có tính thuyết phục theo thời gian, với khách hàng, khách hàng tiềm năng, nhân viên và các nhóm công chúng liên quan khác. Sự chuyển dịch là từ "làm cho các quảng cáo trông giống nhau" sang "quản lý mọi điểm tiếp xúc và đo lường kết quả".</p>
<h3>Vì sao IMC trở nên quan trọng</h3>
<ul>
<li><strong>Phân mảnh phương tiện và công chúng</strong> — khán giả trải ra trên rất nhiều kênh, nền tảng và màn hình.</li>
<li><strong>Phương tiện số và mạng xã hội</strong> trao quyền kiểm soát cho người tiêu dùng: họ bỏ qua quảng cáo, tìm kiếm, so sánh và tự đăng ý kiến.</li>
<li><strong>Quyền lực dịch chuyển sang nhà bán lẻ</strong> và nền tảng, những bên đòi hỏi chi phí thương mại và chi phí nền tảng.</li>
<li><strong>Trách nhiệm giải trình</strong> — ban lãnh đạo muốn biết mỗi đồng chi ra mang lại gì.</li>
<li><strong>Dữ liệu và công nghệ</strong> cho phép nhắm chọn, cá nhân hoá và theo dõi phản hồi.</li>
</ul>
<h3>Phối thức xúc tiến (promotional mix)</h3>
<table>
<tr><th>Công cụ</th><th>Bản chất</th><th>Điểm mạnh chính</th><th>Hạn chế chính</th></tr>
<tr><td>Quảng cáo</td><td>Truyền thông phi cá nhân, trả phí, từ một nhà tài trợ được xác định</td><td>Xây dựng nhận biết và hình ảnh trên quy mô lớn</td><td>Nhiễu quảng cáo, người xem né tránh, liên hệ gián tiếp với doanh số</td></tr>
<tr><td>Marketing trực tiếp</td><td>Giao tiếp trực tiếp với khách hàng mục tiêu để có phản hồi hoặc giao dịch</td><td>Đo lường được, cá nhân hoá</td><td>Cần dữ liệu chính xác; hình ảnh "thư rác"</td></tr>
<tr><td>Marketing số / tương tác</td><td>Truyền thông hai chiều qua Internet, mạng xã hội, di động</td><td>Nhắm chọn, tương tác, dữ liệu thời gian thực</td><td>Tranh cãi về đo lường, rủi ro an toàn thương hiệu</td></tr>
<tr><td>Khuyến mại</td><td>Giá trị tăng thêm hoặc ưu đãi cho người tiêu dùng hay kênh thương mại</td><td>Phản ứng doanh số tức thì</td><td>Có thể bào mòn hình ảnh thương hiệu và biên lợi nhuận</td></tr>
<tr><td>Quan hệ công chúng / publicity</td><td>Quản lý quan hệ với các nhóm công chúng; tin tức không trả phí</td><td>Độ tin cậy cao</td><td>Ít kiểm soát nội dung và thời điểm</td></tr>
<tr><td>Bán hàng cá nhân</td><td>Giao tiếp trực tiếp giữa người với người</td><td>Điều chỉnh theo từng khách, phản hồi ngay</td><td>Chi phí mỗi lần tiếp xúc cao</td></tr>
</table>
<h3>Điểm tiếp xúc và paid, owned, earned media</h3>
<p><strong>Điểm tiếp xúc</strong> (touch point) là bất kỳ dịp nào khách hàng tiếp xúc với thương hiệu. Một cách phân loại được dùng rộng rãi (Tom Duncan) chia thành: điểm tiếp xúc <strong>do công ty tạo ra</strong> (quảng cáo, website, bao bì), điểm tiếp xúc <strong>nội tại</strong> xảy ra khi mua hoặc dùng sản phẩm (cửa hàng, giao hàng, chăm sóc khách hàng), điểm tiếp xúc <strong>ngoài dự kiến</strong> mà doanh nghiệp không kiểm soát (lời bạn bè, đánh giá trên mạng, một bài báo) và điểm tiếp xúc <strong>do khách hàng chủ động</strong> (khách gọi tổng đài hay nhắn tin cho thương hiệu). Phương tiện cũng được chia theo quyền sở hữu: <strong>paid</strong> (mua không gian, thời lượng quảng cáo), <strong>owned</strong> (kênh thương hiệu kiểm soát — website, ứng dụng, trang mạng xã hội, bao bì) và <strong>earned</strong> (publicity, lượt chia sẻ, đánh giá, truyền miệng).</p>
<h3>Mô hình hoạch định IMC</h3>
<ol>
<li><strong>Rà soát kế hoạch marketing</strong> — tình thế, mục tiêu, chiến lược.</li>
<li><strong>Phân tích tình thế chương trình xúc tiến</strong> — bên trong (doanh nghiệp, nguồn lực, các chương trình trước) và bên ngoài (người tiêu dùng, phân đoạn, đối thủ, môi trường).</li>
<li><strong>Phân tích quá trình truyền thông</strong> — công chúng mục tiêu sẽ phản ứng thế nào; mục tiêu truyền thông.</li>
<li><strong>Xác định ngân sách</strong> — tổng ngân sách dự kiến và cách phân bổ.</li>
<li><strong>Xây dựng chương trình IMC</strong> — với từng công cụ: mục tiêu, chiến lược thông điệp, chiến lược phương tiện.</li>
<li><strong>Tích hợp và triển khai</strong>, rồi <strong>theo dõi, đánh giá và kiểm soát</strong>.</li>
</ol>
<div class="callout"><span class="badge">Ghi nhớ</span> Mô hình hoạch định là bộ khung của toàn bộ môn học — và của kế hoạch IMC nhóm. Mỗi chương sau lấp đầy một ô trong mô hình này.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Vì sao định nghĩa "IMC là một quá trình kinh doanh" mạnh hơn định nghĩa "IMC là làm quảng cáo nhất quán"?</li>
<li>Chọn một thương hiệu bạn biết. Liệt kê hai điểm tiếp xúc cho mỗi loại trong bốn loại của Duncan. Thương hiệu kiểm soát loại nào ít nhất?</li>
<li>Phân loại kênh TikTok của thương hiệu, một video KOL được trả phí và một bài báo viết về thương hiệu vào paid, owned hay earned.</li>
</ol>`,
  ]]);

const c2 = doc('mkt304-1-2-imc-marketing-process', '1.2 — Ch 2: The role of IMC in the marketing process|||1.2 — Ch 2: Vai trò của IMC trong quá trình marketing',
  'Phân tích cơ hội và đối thủ, quá trình thị trường mục tiêu (phân đoạn theo nhân khẩu học so với tâm lý học), chiến lược chọn thị trường, các cách định vị và tái định vị, chương trình marketing và bao bì như một công cụ truyền thông.',
  [[
    `<span class="eyebrow">MKT304 · Part 1 · Lesson 1.2</span>
<h2>Ch 2 — The role of IMC in the marketing process</h2>
<p class="lead">Communication cannot rescue a weak marketing strategy. IMC starts from decisions made earlier: which market to serve, how to position the brand and what the rest of the marketing mix says.</p>
<h3>Marketing strategy and analysis</h3>
<ul>
<li><strong>Opportunity analysis</strong> — find markets whose needs are not well served, or where the firm has a competitive advantage.</li>
<li><strong>Competitive analysis</strong> — direct and indirect competitors, their strengths and the firm's sources of <strong>competitive advantage</strong> (product, price, service, image). Advertising itself can create an advantage through a distinctive image.</li>
<li><strong>Target market selection</strong> — the result of the target marketing process below.</li>
</ul>
<h3>The target marketing process</h3>
<p>Identify markets with unfulfilled needs → <strong>segment</strong> → <strong>select</strong> the target → <strong>position</strong> through the marketing mix.</p>
<table>
<tr><th>Segmentation base</th><th>Examples of variables</th><th>What it tells the communicator</th></tr>
<tr><td>Geographic</td><td>Region, city, urban/rural, climate</td><td>Where to place media and adapt language</td></tr>
<tr><td>Demographic</td><td>Age, gender, income, education, family life cycle</td><td>Who they are — easy to measure and to buy media against</td></tr>
<tr><td>Psychographic</td><td>Lifestyle, values, personality, activities, interests, opinions</td><td>Why they buy — tone, imagery, appeals</td></tr>
<tr><td>Behavioural</td><td>Usage rate, loyalty status, purchase occasion</td><td>How to talk to heavy vs light users, loyal vs switchers</td></tr>
<tr><td>Benefit</td><td>The main benefit sought (price, convenience, health, status)</td><td>Which promise to put at the centre of the message</td></tr>
</table>
<p><strong>Demographic vs psychographic.</strong> Two women aged 25 with the same income in the same city may share a demographic profile but live very different lives — one values adventure and new experiences, the other security and family routines. Demographics help you <em>find and reach</em> the segment; psychographics help you <em>speak to</em> it. Good plans combine both.</p>
<p>After segmenting, the firm chooses a coverage strategy: <strong>undifferentiated</strong> (one offer for the whole market), <strong>differentiated</strong> (separate offers and messages for several segments) or <strong>concentrated</strong> (one segment, served deeply).</p>
<h3>Positioning and repositioning</h3>
<p>Positioning is the art of fitting the product or brand to one or more segments so that it occupies a <strong>distinct place in the prospect's mind</strong> relative to competitors. Common approaches:</p>
<table>
<tr><th>Approach</th><th>Illustrative (fictional) example</th></tr>
<tr><td>Product attributes and benefits</td><td>A shampoo that "stops dandruff in two washes"</td></tr>
<tr><td>Price / quality</td><td>A premium rice brand priced high to signal quality</td></tr>
<tr><td>Use or application</td><td>A drink "for after-training recovery"</td></tr>
<tr><td>Product class</td><td>Plant-based milk positioned against dairy milk</td></tr>
<tr><td>Product user</td><td>A laptop "for students who code"</td></tr>
<tr><td>Competitor</td><td>A delivery app claiming faster service than the leader</td></tr>
<tr><td>Cultural symbols</td><td>A brand built around a mascot or a national symbol</td></tr>
</table>
<p><strong>Repositioning</strong> changes an existing position — usually because sales are declining, consumer preferences have shifted, a new opportunity appears or a competitor has taken the old position. It is slow and expensive, because old associations must be overwritten. A fictional instant-coffee brand long positioned as "cheap energy" might reposition as "the morning ritual of young office workers" by changing packaging, price tier, media and tone together.</p>
<h3>Developing the marketing programme</h3>
<ul>
<li><strong>Product</strong> — quality, features and <strong>branding</strong>. <strong>Packaging</strong> is a communication tool: at the shelf it is the last "ad" the buyer sees, it carries information and legal labelling, it attracts attention and it can itself be a reason to buy (convenient formats, gift packs).</li>
<li><strong>Price</strong> — the price communicates quality and must be consistent with the advertising: a luxury message with deep discounts confuses the position.</li>
<li><strong>Distribution</strong> — channel choice shapes the IMC mix: a <strong>push</strong> strategy promotes to the trade (allowances, sales force), a <strong>pull</strong> strategy promotes to consumers so they ask retailers for the brand.</li>
<li><strong>Promotion</strong> — the IMC programme itself, designed to support the position chosen.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> If a question asks for the "role of IMC", answer in two layers: IMC <em>implements</em> the positioning chosen in the marketing strategy, and IMC must be <em>consistent</em> with product, price and distribution decisions.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Describe one segment by demographics only, then add psychographics. How would the advertising change?</li>
<li>When should a brand reposition rather than launch a new brand?</li>
<li>Choose a package on a supermarket shelf. What does it communicate before you read a single word?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 1 · Bài 1.2</span>
<h2>Ch 2 — Vai trò của IMC trong quá trình marketing</h2>
<p class="lead">Truyền thông không thể cứu một chiến lược marketing yếu. IMC bắt đầu từ các quyết định đã có trước đó: phục vụ thị trường nào, định vị thương hiệu ra sao và phần còn lại của marketing mix đang nói gì.</p>
<h3>Chiến lược và phân tích marketing</h3>
<ul>
<li><strong>Phân tích cơ hội</strong> — tìm những thị trường mà nhu cầu chưa được đáp ứng tốt, hoặc nơi doanh nghiệp có lợi thế cạnh tranh.</li>
<li><strong>Phân tích cạnh tranh</strong> — đối thủ trực tiếp và gián tiếp, điểm mạnh của họ và nguồn <strong>lợi thế cạnh tranh</strong> của doanh nghiệp (sản phẩm, giá, dịch vụ, hình ảnh). Bản thân quảng cáo cũng có thể tạo lợi thế nhờ một hình ảnh khác biệt.</li>
<li><strong>Lựa chọn thị trường mục tiêu</strong> — kết quả của quá trình thị trường mục tiêu dưới đây.</li>
</ul>
<h3>Quá trình thị trường mục tiêu</h3>
<p>Xác định thị trường có nhu cầu chưa được đáp ứng → <strong>phân đoạn</strong> → <strong>chọn</strong> thị trường mục tiêu → <strong>định vị</strong> bằng marketing mix.</p>
<table>
<tr><th>Tiêu chí phân đoạn</th><th>Ví dụ biến số</th><th>Điều người làm truyền thông rút ra</th></tr>
<tr><td>Địa lý</td><td>Vùng miền, thành phố, thành thị/nông thôn, khí hậu</td><td>Đặt phương tiện ở đâu, điều chỉnh ngôn ngữ thế nào</td></tr>
<tr><td>Nhân khẩu học</td><td>Tuổi, giới tính, thu nhập, học vấn, giai đoạn vòng đời gia đình</td><td>Họ là ai — dễ đo và dễ mua phương tiện theo</td></tr>
<tr><td>Tâm lý học</td><td>Lối sống, giá trị, cá tính, hoạt động, sở thích, quan điểm</td><td>Vì sao họ mua — giọng điệu, hình ảnh, lời kêu gọi</td></tr>
<tr><td>Hành vi</td><td>Mức độ sử dụng, mức trung thành, dịp mua</td><td>Nói gì với người dùng nhiều và ít, người trung thành và người hay đổi</td></tr>
<tr><td>Lợi ích</td><td>Lợi ích chính được tìm kiếm (giá, tiện lợi, sức khoẻ, địa vị)</td><td>Đặt lời hứa nào vào trung tâm thông điệp</td></tr>
</table>
<p><strong>Nhân khẩu học và tâm lý học.</strong> Hai phụ nữ 25 tuổi, cùng thu nhập, cùng thành phố có thể giống nhau về nhân khẩu học nhưng sống rất khác nhau — một người coi trọng phiêu lưu và trải nghiệm mới, người kia coi trọng sự an toàn và nếp sinh hoạt gia đình. Nhân khẩu học giúp bạn <em>tìm thấy và tiếp cận</em> phân đoạn; tâm lý học giúp bạn <em>nói chuyện</em> với phân đoạn đó. Kế hoạch tốt kết hợp cả hai.</p>
<p>Sau khi phân đoạn, doanh nghiệp chọn chiến lược bao phủ: <strong>không phân biệt</strong> (một sản phẩm cho cả thị trường), <strong>phân biệt</strong> (sản phẩm và thông điệp riêng cho nhiều phân đoạn) hoặc <strong>tập trung</strong> (một phân đoạn, phục vụ thật sâu).</p>
<h3>Định vị và tái định vị</h3>
<p>Định vị là nghệ thuật làm cho sản phẩm hay thương hiệu khớp với một hoặc vài phân đoạn để nó chiếm <strong>một vị trí khác biệt trong tâm trí khách hàng tiềm năng</strong> so với đối thủ. Các cách định vị phổ biến:</p>
<table>
<tr><th>Cách định vị</th><th>Ví dụ minh hoạ (giả định)</th></tr>
<tr><td>Thuộc tính và lợi ích sản phẩm</td><td>Dầu gội "hết gàu sau hai lần gội"</td></tr>
<tr><td>Giá / chất lượng</td><td>Thương hiệu gạo cao cấp đặt giá cao để báo hiệu chất lượng</td></tr>
<tr><td>Công dụng hoặc cách dùng</td><td>Thức uống "phục hồi sau buổi tập"</td></tr>
<tr><td>Loại sản phẩm</td><td>Sữa thực vật định vị đối lập với sữa bò</td></tr>
<tr><td>Người sử dụng</td><td>Laptop "cho sinh viên lập trình"</td></tr>
<tr><td>Đối thủ cạnh tranh</td><td>Ứng dụng giao hàng tuyên bố nhanh hơn bên dẫn đầu</td></tr>
<tr><td>Biểu tượng văn hoá</td><td>Thương hiệu xây quanh một linh vật hoặc một biểu tượng dân tộc</td></tr>
</table>
<p><strong>Tái định vị</strong> là thay đổi một vị trí đã có — thường vì doanh số giảm, sở thích người tiêu dùng thay đổi, xuất hiện cơ hội mới hoặc đối thủ đã chiếm vị trí cũ. Việc này chậm và tốn kém vì phải xoá các liên tưởng cũ. Một thương hiệu cà phê hoà tan giả định lâu nay định vị là "tỉnh táo giá rẻ" có thể tái định vị thành "nghi thức buổi sáng của dân văn phòng trẻ" bằng cách đổi đồng thời bao bì, phân khúc giá, phương tiện và giọng điệu.</p>
<h3>Xây dựng chương trình marketing</h3>
<ul>
<li><strong>Sản phẩm</strong> — chất lượng, tính năng và <strong>thương hiệu</strong>. <strong>Bao bì</strong> là một công cụ truyền thông: trên kệ hàng, nó là "quảng cáo" cuối cùng người mua nhìn thấy; nó mang thông tin và nhãn theo quy định, thu hút sự chú ý và bản thân nó có thể là lý do để mua (quy cách tiện dụng, hộp quà).</li>
<li><strong>Giá</strong> — giá truyền đạt chất lượng và phải nhất quán với quảng cáo: thông điệp sang trọng đi kèm giảm giá sâu sẽ làm rối định vị.</li>
<li><strong>Phân phối</strong> — lựa chọn kênh định hình phối thức IMC: chiến lược <strong>đẩy</strong> xúc tiến với kênh thương mại (trợ cấp, lực lượng bán hàng), chiến lược <strong>kéo</strong> xúc tiến với người tiêu dùng để họ hỏi mua thương hiệu tại nhà bán lẻ.</li>
<li><strong>Xúc tiến</strong> — chính chương trình IMC, được thiết kế để hỗ trợ vị trí đã chọn.</li>
</ul>
<div class="callout"><span class="badge">Mẹo làm bài</span> Nếu câu hỏi hỏi về "vai trò của IMC", hãy trả lời hai lớp: IMC <em>thực thi</em> định vị đã chọn trong chiến lược marketing, và IMC phải <em>nhất quán</em> với các quyết định về sản phẩm, giá và phân phối.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Mô tả một phân đoạn chỉ bằng nhân khẩu học, rồi thêm tâm lý học. Quảng cáo sẽ thay đổi thế nào?</li>
<li>Khi nào một thương hiệu nên tái định vị thay vì tung ra thương hiệu mới?</li>
<li>Chọn một bao bì trên kệ siêu thị. Nó truyền đạt điều gì trước khi bạn đọc chữ nào?</li>
</ol>`,
  ]]);

const c3 = doc('mkt304-1-3-agencies-consumer-behavior', '1.3 — Ch 3–4: Organizing for IMC & perspectives on consumer behavior|||1.3 — Ch 3–4: Tổ chức cho IMC & các góc nhìn về hành vi người tiêu dùng',
  'Nêu ngắn Ch3 (các bên tham gia, cách tổ chức phía khách hàng, các loại agency, media specialist, hình thức trả phí agency) và Ch4 (quá trình quyết định mua, quá trình tâm lý, bất hoà nhận thức, học tập hành vi, ảnh hưởng môi trường) — liên hệ MKT201.',
  [[
    `<span class="eyebrow">MKT304 · Part 1 · Lesson 1.3</span>
<h2>Ch 3–4 — Who does IMC, and whom is it for?</h2>
<p class="lead">The syllabus covers these two chapters mainly through discussion questions. This lesson gives you the core map; consumer behaviour was studied in depth in MKT201.</p>
<h3>Ch 3 — Participants in the IMC process</h3>
<ul>
<li><strong>Advertiser (client)</strong> — owns the product and the budget and makes the final decisions.</li>
<li><strong>Advertising agencies</strong> — plan, create and often buy media for the client.</li>
<li><strong>Media organizations</strong> — sell time, space and audiences (TV stations, publishers, platforms).</li>
<li><strong>Specialized communication services</strong> — direct-marketing, sales-promotion, digital/interactive agencies and public relations firms.</li>
<li><strong>Collateral services</strong> — marketing research firms, production houses, consultants.</li>
</ul>
<h3>Organizing on the client side</h3>
<table>
<tr><th>System</th><th>How it works</th><th>Pros / cons</th></tr>
<tr><td>Centralized</td><td>One advertising or communications department serves the whole firm</td><td>Coordination and control / slower, less close to each brand</td></tr>
<tr><td>Decentralized (brand management)</td><td>Each brand manager runs the brand's full programme</td><td>Focus and speed / rivalry between brands, short-term thinking</td></tr>
<tr><td>In-house agency</td><td>The firm owns its own agency</td><td>Cost savings and control / less objectivity and fresh ideas</td></tr>
</table>
<h3>Types of agencies and how they are paid</h3>
<ul>
<li><strong>Full-service agency</strong> — account management, strategy/planning, creative, media, research and often production.</li>
<li><strong>Creative boutique</strong> — creative ideas and execution only.</li>
<li><strong>Media specialist companies</strong> — media planning and buying, often with large buying power and data tools.</li>
<li><strong>Compensation</strong> — the traditional <strong>commission system</strong> (historically 15% of media billings), <strong>fee</strong> arrangements (fixed fee or fee–commission combinations), <strong>cost-plus</strong> agreements, and <strong>incentive-based</strong> (pay-for-performance) systems tied to agreed results.</li>
<li><strong>Evaluating agencies</strong> — financial audits and qualitative reviews of performance; clients switch agencies for poor results, poor communication, changes in strategy or personnel conflicts.</li>
</ul>
<p>A continuing debate: should one agency provide <em>integrated</em> services, or should the client coordinate several specialists? One-stop agencies promise consistency; specialists offer depth. Either way, <strong>the client must own the integration</strong>.</p>
<h3>Ch 4 — The consumer decision-making process</h3>
<table>
<tr><th>Stage</th><th>Key ideas</th><th>IMC implication</th></tr>
<tr><td>Problem recognition</td><td>A gap between the actual and desired state (out of stock, dissatisfaction, new needs, new products)</td><td>Ads can create or remind people of the gap</td></tr>
<tr><td>Information search</td><td>Internal (memory) and external (friends, reviews, search, stores)</td><td>Be present where people search; build memory</td></tr>
<tr><td>Alternative evaluation</td><td>Evoked set; evaluative criteria; functional and psychosocial consequences</td><td>Get into the evoked set; stress the criteria you win on</td></tr>
<tr><td>Purchase decision</td><td>Intention becomes purchase; brand loyalty vs habit</td><td>Point-of-purchase materials, promotions, availability</td></tr>
<tr><td>Post-purchase evaluation</td><td>Satisfaction or <strong>cognitive dissonance</strong> (doubt after an important purchase)</td><td>Reassurance messages, follow-up, customer service</td></tr>
</table>
<p><strong>Psychological processes</strong> underlie each stage: <em>motivation</em> (e.g., Maslow's hierarchy), <em>perception</em> (selective exposure, attention, comprehension and retention — a message can be filtered out at any step), <em>attitude formation</em> (multi-attribute models) and <em>integration</em> (heuristics and decision rules). <strong>Behavioural learning</strong> offers another lens: <em>classical conditioning</em> pairs the brand with pleasant stimuli such as music; <em>operant conditioning</em> reinforces behaviour with rewards such as loyalty points. <strong>Environmental influences</strong> include culture and subculture, social class, reference groups and situational factors; <strong>cultural anthropology</strong> reminds marketers that products carry symbolic meanings shared within a culture.</p>
<div class="callout"><span class="badge">Link to MKT201</span> Everything you learned about involvement, perception and attitudes becomes a planning tool here: Part 2 turns it into communication models, Part 3 into objectives.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Would a fast-growing start-up be better served by a full-service agency, a creative boutique plus a media specialist, or an in-house team? Justify.</li>
<li>Why are clients moving from pure commission to fees and pay-for-performance?</li>
<li>After buying an expensive laptop a student feels doubt. Which stage is this, and what communication could reduce it?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 1 · Bài 1.3</span>
<h2>Ch 3–4 — Ai làm IMC, và làm cho ai?</h2>
<p class="lead">Đề cương học hai chương này chủ yếu qua câu hỏi thảo luận. Bài này đưa ra tấm bản đồ cốt lõi; hành vi người tiêu dùng đã được học sâu ở MKT201.</p>
<h3>Ch 3 — Các bên tham gia quá trình IMC</h3>
<ul>
<li><strong>Nhà quảng cáo (khách hàng)</strong> — sở hữu sản phẩm, ngân sách và ra quyết định cuối cùng.</li>
<li><strong>Agency quảng cáo</strong> — hoạch định, sáng tạo và thường mua phương tiện cho khách hàng.</li>
<li><strong>Tổ chức truyền thông</strong> — bán thời lượng, không gian và khán giả (đài truyền hình, nhà xuất bản, nền tảng).</li>
<li><strong>Dịch vụ truyền thông chuyên biệt</strong> — agency marketing trực tiếp, agency khuyến mại, agency số/tương tác và công ty quan hệ công chúng.</li>
<li><strong>Dịch vụ phụ trợ</strong> — công ty nghiên cứu thị trường, nhà sản xuất phim, đơn vị tư vấn.</li>
</ul>
<h3>Tổ chức phía khách hàng</h3>
<table>
<tr><th>Hệ thống</th><th>Cách vận hành</th><th>Ưu / nhược</th></tr>
<tr><td>Tập trung</td><td>Một phòng quảng cáo hay truyền thông phục vụ toàn doanh nghiệp</td><td>Phối hợp và kiểm soát / chậm hơn, ít sát từng thương hiệu</td></tr>
<tr><td>Phân quyền (quản trị thương hiệu)</td><td>Mỗi giám đốc thương hiệu điều hành toàn bộ chương trình của thương hiệu mình</td><td>Tập trung và nhanh / cạnh tranh nội bộ, tư duy ngắn hạn</td></tr>
<tr><td>Agency nội bộ (in-house)</td><td>Doanh nghiệp tự sở hữu agency</td><td>Tiết kiệm chi phí và kiểm soát / kém khách quan, ít ý tưởng mới</td></tr>
</table>
<h3>Các loại agency và cách trả phí</h3>
<ul>
<li><strong>Agency trọn gói (full-service)</strong> — quản lý khách hàng, chiến lược/hoạch định, sáng tạo, phương tiện, nghiên cứu và thường cả sản xuất.</li>
<li><strong>Creative boutique</strong> — chỉ làm ý tưởng và thực thi sáng tạo.</li>
<li><strong>Công ty chuyên về phương tiện (media specialist)</strong> — hoạch định và mua phương tiện, thường có sức mua lớn và công cụ dữ liệu.</li>
<li><strong>Trả phí</strong> — <strong>hệ thống hoa hồng</strong> truyền thống (trong lịch sử là 15% giá trị mua phương tiện), <strong>phí dịch vụ</strong> (phí cố định hoặc kết hợp phí – hoa hồng), hợp đồng <strong>chi phí cộng thêm</strong> (cost-plus), và hệ thống <strong>theo kết quả</strong> (trả theo hiệu quả) gắn với các kết quả đã thoả thuận.</li>
<li><strong>Đánh giá agency</strong> — kiểm toán tài chính và đánh giá định tính kết quả làm việc; khách hàng đổi agency vì kết quả kém, giao tiếp kém, thay đổi chiến lược hoặc xung đột nhân sự.</li>
</ul>
<p>Một tranh luận kéo dài: một agency nên cung cấp dịch vụ <em>tích hợp</em>, hay khách hàng tự điều phối nhiều đơn vị chuyên biệt? Agency một cửa hứa hẹn sự nhất quán; đơn vị chuyên biệt mang lại chiều sâu. Dù cách nào, <strong>khách hàng phải là người nắm việc tích hợp</strong>.</p>
<h3>Ch 4 — Quá trình ra quyết định của người tiêu dùng</h3>
<table>
<tr><th>Giai đoạn</th><th>Ý chính</th><th>Hàm ý cho IMC</th></tr>
<tr><td>Nhận biết vấn đề</td><td>Khoảng cách giữa trạng thái thực tế và mong muốn (hết hàng, không hài lòng, nhu cầu mới, sản phẩm mới)</td><td>Quảng cáo có thể tạo ra hoặc nhắc về khoảng cách đó</td></tr>
<tr><td>Tìm kiếm thông tin</td><td>Bên trong (trí nhớ) và bên ngoài (bạn bè, đánh giá, tìm kiếm, cửa hàng)</td><td>Có mặt ở nơi người ta tìm kiếm; xây dựng trí nhớ</td></tr>
<tr><td>Đánh giá phương án</td><td>Tập cân nhắc (evoked set); tiêu chí đánh giá; hệ quả chức năng và tâm lý – xã hội</td><td>Lọt vào tập cân nhắc; nhấn vào tiêu chí mình thắng</td></tr>
<tr><td>Quyết định mua</td><td>Ý định trở thành hành động mua; trung thành thương hiệu và thói quen</td><td>Vật phẩm tại điểm bán, khuyến mại, độ phủ hàng</td></tr>
<tr><td>Đánh giá sau mua</td><td>Hài lòng hoặc <strong>bất hoà nhận thức</strong> (băn khoăn sau một lần mua quan trọng)</td><td>Thông điệp trấn an, chăm sóc sau bán, dịch vụ khách hàng</td></tr>
</table>
<p><strong>Các quá trình tâm lý</strong> nằm dưới mỗi giai đoạn: <em>động cơ</em> (ví dụ tháp nhu cầu Maslow), <em>nhận thức</em> (tiếp xúc, chú ý, hiểu và ghi nhớ có chọn lọc — thông điệp có thể bị lọc bỏ ở bất kỳ bước nào), <em>hình thành thái độ</em> (mô hình đa thuộc tính) và <em>tích hợp</em> (lối tắt suy nghĩ và quy tắc quyết định). <strong>Học tập hành vi</strong> là một lăng kính khác: <em>điều kiện hoá cổ điển</em> ghép thương hiệu với kích thích dễ chịu như âm nhạc; <em>điều kiện hoá thao tác</em> củng cố hành vi bằng phần thưởng như điểm tích luỹ. <strong>Ảnh hưởng môi trường</strong> gồm văn hoá và nhánh văn hoá, tầng lớp xã hội, nhóm tham khảo và yếu tố tình huống; <strong>nhân học văn hoá</strong> nhắc người làm marketing rằng sản phẩm mang những ý nghĩa biểu tượng được chia sẻ trong một nền văn hoá.</p>
<div class="callout"><span class="badge">Liên hệ MKT201</span> Mọi điều bạn đã học về mức độ quan tâm, nhận thức và thái độ trở thành công cụ hoạch định ở đây: Phần 2 biến chúng thành các mô hình truyền thông, Phần 3 biến chúng thành mục tiêu.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Một start-up tăng trưởng nhanh nên dùng agency trọn gói, creative boutique cộng media specialist, hay đội nội bộ? Lập luận.</li>
<li>Vì sao khách hàng đang chuyển từ hoa hồng thuần tuý sang phí dịch vụ và trả theo kết quả?</li>
<li>Sau khi mua một chiếc laptop đắt tiền, một sinh viên thấy băn khoăn. Đây là giai đoạn nào, và truyền thông nào có thể giảm cảm giác đó?</li>
</ol>`,
  ]]);

const c1q = quiz('mkt304-quiz-1', 'Quiz 1 — Foundations of IMC|||Quiz 1 — Nền tảng IMC', [
  { id: 'q1', question: 'Which of the following is an example of owned media?|||Ví dụ nào sau đây là owned media?', options: ['A newspaper article a journalist wrote about the brand|||Một bài báo do nhà báo viết về thương hiệu', 'The brand’s own mobile app and fan page|||Ứng dụng di động và fanpage của chính thương hiệu', 'A pre-roll video ad the brand bought on a video platform|||Một quảng cáo video đầu clip thương hiệu mua trên nền tảng video', 'A customer’s unsolicited review on a forum|||Một đánh giá tự nguyện của khách hàng trên diễn đàn'], correctIndex: 1, explanation: 'Owned media are channels the brand controls. The article and the review are earned; the pre-roll ad is paid.|||Owned media là kênh thương hiệu kiểm soát. Bài báo và đánh giá là earned; quảng cáo đầu clip là paid.' },
  { id: 'q2', question: 'A sports drink is presented as the drink to take right after a gym session. This positioning is based on…|||Một thức uống thể thao được giới thiệu là thứ nên uống ngay sau buổi tập gym. Cách định vị này dựa trên…', options: ['price and quality|||giá và chất lượng', 'a competitor|||một đối thủ cạnh tranh', 'a cultural symbol|||một biểu tượng văn hoá', 'use or application|||công dụng hoặc cách dùng'], correctIndex: 3, explanation: 'The brand is linked to a specific usage occasion, which is positioning by use or application.|||Thương hiệu được gắn với một dịp sử dụng cụ thể, tức là định vị theo công dụng hoặc cách dùng.' },
  { id: 'q3', question: 'Under the traditional commission system, an advertising agency was paid…|||Theo hệ thống hoa hồng truyền thống, agency quảng cáo được trả…', options: ['a commission, historically 15%, on the media time and space it bought|||một khoản hoa hồng, trong lịch sử là 15%, trên giá trị thời lượng và không gian phương tiện đã mua', 'a fixed monthly salary paid by the media owners|||một khoản lương cố định hằng tháng do chủ phương tiện trả', 'a share of the client’s annual profit|||một phần lợi nhuận hằng năm của khách hàng', 'only a production fee for each finished ad|||chỉ một khoản phí sản xuất cho mỗi mẫu quảng cáo hoàn thành'], correctIndex: 0, explanation: 'The commission system tied agency income to media billings; fees and pay-for-performance systems grew as alternatives.|||Hệ thống hoa hồng gắn thu nhập của agency với giá trị mua phương tiện; phí dịch vụ và trả theo kết quả phát triển như các lựa chọn thay thế.' },
]);

const c4 = doc('mkt304-2-1-communication-process', '2.1 — Ch 5: The communication process & response models|||2.1 — Ch 5: Quá trình truyền thông & các mô hình đáp ứng',
  'Mô hình truyền thông cơ bản (nguồn, mã hoá, kênh, giải mã, người nhận, nhiễu, phản hồi), phân tích người nhận, bốn mô hình thứ bậc đáp ứng (AIDA, hierarchy of effects, chấp nhận đổi mới, xử lý thông tin), ba trật tự đáp ứng thay thế, phản ứng nhận thức và ELM.',
  [[
    `<span class="eyebrow">MKT304 · Part 2 · Lesson 2.1</span>
<h2>Ch 5 — The communication process</h2>
<h3>A basic model of communication</h3>
<pre><code class="language-text">SOURCE -> ENCODING -> MESSAGE via CHANNEL -> DECODING -> RECEIVER
                                                            |
            FEEDBACK  &lt;-------------  RESPONSE  &lt;------------
                     (NOISE can distort every step)</code></pre>
<ul>
<li><strong>Source</strong> — the person or organization with information to share (the brand, a spokesperson, an influencer).</li>
<li><strong>Encoding</strong> — putting thoughts into symbols: words, pictures, music. The meaning of signs is studied by <em>semiotics</em>.</li>
<li><strong>Channel</strong> — personal (sales staff, word of mouth) or nonpersonal (mass media, digital media).</li>
<li><strong>Decoding</strong> — the receiver turns symbols back into thought, filtered by their <strong>field of experience</strong>. The more the sender's and receiver's fields overlap, the better the communication.</li>
<li><strong>Noise</strong> — anything that distorts or interrupts the message: clutter, distraction, a bad translation.</li>
<li><strong>Response and feedback</strong> — what the receiver does and the part of it that returns to the sender (sales, clicks, comments, research results).</li>
</ul>
<p><strong>Analysing the receiver.</strong> The audience can be an individual (personal selling), a group (a buying centre), a specific market segment, or the mass market. The narrower the audience, the more the message can be tailored.</p>
<h3>Traditional response hierarchy models</h3>
<table>
<tr><th>Stage</th><th>AIDA</th><th>Hierarchy of effects (Lavidge &amp; Steiner)</th><th>Innovation adoption (Rogers)</th><th>Information processing (McGuire)</th></tr>
<tr><td>Cognitive</td><td>Attention</td><td>Awareness → Knowledge</td><td>Awareness</td><td>Presentation → Attention → Comprehension</td></tr>
<tr><td>Affective</td><td>Interest → Desire</td><td>Liking → Preference → Conviction</td><td>Interest → Evaluation</td><td>Yielding → Retention</td></tr>
<tr><td>Behavioural</td><td>Action</td><td>Purchase</td><td>Trial → Adoption</td><td>Behaviour</td></tr>
</table>
<p>All four assume the audience moves from <strong>thinking</strong> (cognitive) to <strong>feeling</strong> (affective) to <strong>doing</strong> (behavioural). Their value for planners: they show that a message can fail at different stages, that different stages need different objectives and tools (mass media for awareness, sampling for trial, personal selling or promotion for action), and they give intermediate measures before sales appear.</p>
<h3>Alternative response hierarchies</h3>
<table>
<tr><th>Order</th><th>Sequence</th><th>When it applies</th></tr>
<tr><td>Standard learning</td><td>Learn → Feel → Do</td><td>High involvement and clear differences between brands (a laptop, a university)</td></tr>
<tr><td>Dissonance / attribution</td><td>Do → Feel → Learn</td><td>High involvement but alternatives look alike; attitudes follow the purchase, so post-purchase reassurance matters</td></tr>
<tr><td>Low involvement</td><td>Learn → Do → Feel</td><td>Low involvement, small differences (snacks, detergent); repetition builds awareness, trial forms the attitude (Krugman's idea of passive learning from TV)</td></tr>
</table>
<h3>Cognitive processing of communications</h3>
<p>The <strong>cognitive response approach</strong> studies the thoughts people have while receiving a message:</p>
<ul>
<li><em>Product/message thoughts</em> — <strong>counterarguments</strong> (against the claim) and <strong>support arguments</strong> (agreeing).</li>
<li><em>Source-oriented thoughts</em> — <strong>source derogation</strong> ("she is only saying it for money") or <strong>source bolsters</strong>.</li>
<li><em>Ad execution thoughts</em> — reactions to the ad itself, which shape the <strong>attitude toward the ad (Aad)</strong> and can transfer to the brand.</li>
</ul>
<p>The <strong>elaboration likelihood model (ELM)</strong> of Petty and Cacioppo, studied in MKT201, explains when each kind of thought matters. When <strong>motivation and ability</strong> to process are high, persuasion follows the <strong>central route</strong>: the quality of arguments decides, and attitudes formed this way are more enduring. When they are low, persuasion follows the <strong>peripheral route</strong>: cues such as an attractive source, music or visuals decide, and attitude change is weaker and shorter-lived.</p>
<div class="callout"><span class="badge">Planning link</span> Response hierarchies become objectives in Ch 7 (DAGMAR); the ELM tells the creative team whether to lead with arguments or with cues.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Give an example of noise at the encoding stage and at the decoding stage.</li>
<li>Which response order fits a first-time buyer of a motorbike? Of a new flavour of instant noodles? Why?</li>
<li>Why do marketers still use hierarchy models even though consumers do not always follow the stages in order?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 2 · Bài 2.1</span>
<h2>Ch 5 — Quá trình truyền thông</h2>
<h3>Mô hình truyền thông cơ bản</h3>
<pre><code class="language-text">NGUỒN -> MÃ HOÁ -> THÔNG ĐIỆP qua KÊNH -> GIẢI MÃ -> NGƯỜI NHẬN
                                                         |
           PHẢN HỒI  &lt;-------------  ĐÁP ỨNG  &lt;-----------
                     (NHIỄU có thể làm sai lệch mọi bước)</code></pre>
<ul>
<li><strong>Nguồn</strong> — cá nhân hay tổ chức có thông tin muốn chia sẻ (thương hiệu, người phát ngôn, người có ảnh hưởng).</li>
<li><strong>Mã hoá</strong> — chuyển ý nghĩ thành biểu tượng: lời, hình ảnh, âm nhạc. Ý nghĩa của các ký hiệu được nghiên cứu bởi <em>ký hiệu học</em>.</li>
<li><strong>Kênh</strong> — cá nhân (nhân viên bán hàng, truyền miệng) hoặc phi cá nhân (phương tiện đại chúng, phương tiện số).</li>
<li><strong>Giải mã</strong> — người nhận chuyển biểu tượng ngược lại thành ý nghĩ, qua bộ lọc là <strong>vùng kinh nghiệm</strong> của họ. Vùng kinh nghiệm của người gửi và người nhận càng trùng nhau, truyền thông càng hiệu quả.</li>
<li><strong>Nhiễu</strong> — bất cứ thứ gì làm sai lệch hoặc gián đoạn thông điệp: nhiễu quảng cáo, sự xao nhãng, một bản dịch tồi.</li>
<li><strong>Đáp ứng và phản hồi</strong> — điều người nhận làm, và phần quay về với người gửi (doanh số, lượt nhấp, bình luận, kết quả nghiên cứu).</li>
</ul>
<p><strong>Phân tích người nhận.</strong> Công chúng có thể là một cá nhân (bán hàng cá nhân), một nhóm (trung tâm mua), một phân đoạn thị trường cụ thể hoặc thị trường đại chúng. Công chúng càng hẹp, thông điệp càng có thể được may đo.</p>
<h3>Các mô hình thứ bậc đáp ứng truyền thống</h3>
<table>
<tr><th>Giai đoạn</th><th>AIDA</th><th>Thứ bậc hiệu ứng (Lavidge &amp; Steiner)</th><th>Chấp nhận đổi mới (Rogers)</th><th>Xử lý thông tin (McGuire)</th></tr>
<tr><td>Nhận thức</td><td>Chú ý</td><td>Nhận biết → Hiểu biết</td><td>Nhận biết</td><td>Tiếp nhận → Chú ý → Thấu hiểu</td></tr>
<tr><td>Cảm xúc</td><td>Quan tâm → Mong muốn</td><td>Thích → Ưa chuộng → Tin chắc</td><td>Quan tâm → Đánh giá</td><td>Chấp thuận → Ghi nhớ</td></tr>
<tr><td>Hành vi</td><td>Hành động</td><td>Mua</td><td>Dùng thử → Chấp nhận</td><td>Hành vi</td></tr>
</table>
<p>Cả bốn mô hình đều giả định công chúng đi từ <strong>nghĩ</strong> (nhận thức) sang <strong>cảm</strong> (cảm xúc) rồi tới <strong>làm</strong> (hành vi). Giá trị với người hoạch định: chúng cho thấy thông điệp có thể thất bại ở những giai đoạn khác nhau, mỗi giai đoạn cần mục tiêu và công cụ khác nhau (phương tiện đại chúng cho nhận biết, phát mẫu thử cho dùng thử, bán hàng cá nhân hay khuyến mại cho hành động), và chúng cung cấp thước đo trung gian trước khi doanh số xuất hiện.</p>
<h3>Các trật tự đáp ứng thay thế</h3>
<table>
<tr><th>Trật tự</th><th>Chuỗi</th><th>Khi nào áp dụng</th></tr>
<tr><td>Học tập chuẩn</td><td>Học → Cảm → Làm</td><td>Mức độ quan tâm cao và các thương hiệu khác biệt rõ (laptop, trường đại học)</td></tr>
<tr><td>Bất hoà / quy kết</td><td>Làm → Cảm → Học</td><td>Quan tâm cao nhưng các lựa chọn trông giống nhau; thái độ hình thành sau khi mua, nên việc trấn an sau mua rất quan trọng</td></tr>
<tr><td>Quan tâm thấp</td><td>Học → Làm → Cảm</td><td>Quan tâm thấp, khác biệt nhỏ (bánh snack, bột giặt); lặp lại tạo nhận biết, dùng thử hình thành thái độ (ý tưởng của Krugman về học tập thụ động qua truyền hình)</td></tr>
</table>
<h3>Xử lý nhận thức đối với truyền thông</h3>
<p><strong>Cách tiếp cận phản ứng nhận thức</strong> nghiên cứu những ý nghĩ nảy ra khi người ta tiếp nhận thông điệp:</p>
<ul>
<li><em>Ý nghĩ về sản phẩm/thông điệp</em> — <strong>phản biện</strong> (chống lại tuyên bố) và <strong>ủng hộ</strong> (đồng tình).</li>
<li><em>Ý nghĩ về nguồn</em> — <strong>hạ thấp nguồn</strong> ("cô ấy nói vậy chỉ vì tiền") hoặc <strong>củng cố nguồn</strong>.</li>
<li><em>Ý nghĩ về cách thể hiện quảng cáo</em> — phản ứng với chính mẫu quảng cáo, định hình <strong>thái độ đối với quảng cáo (Aad)</strong> và có thể chuyển sang thương hiệu.</li>
</ul>
<p><strong>Mô hình khả năng đào sâu thông tin (ELM)</strong> của Petty và Cacioppo, đã học ở MKT201, giải thích khi nào loại ý nghĩ nào quan trọng. Khi <strong>động cơ và khả năng</strong> xử lý cao, thuyết phục đi theo <strong>đường trung tâm</strong>: chất lượng lập luận quyết định, và thái độ hình thành theo cách này bền hơn. Khi chúng thấp, thuyết phục đi theo <strong>đường ngoại vi</strong>: các tín hiệu như nguồn hấp dẫn, âm nhạc hay hình ảnh quyết định, và thay đổi thái độ yếu hơn, ngắn hơn.</p>
<div class="callout"><span class="badge">Liên kết hoạch định</span> Các mô hình thứ bậc trở thành mục tiêu ở Ch 7 (DAGMAR); ELM cho đội sáng tạo biết nên dẫn dắt bằng lập luận hay bằng tín hiệu.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Cho ví dụ về nhiễu ở bước mã hoá và ở bước giải mã.</li>
<li>Trật tự đáp ứng nào hợp với người lần đầu mua xe máy? Với một vị mì gói mới? Vì sao?</li>
<li>Vì sao người làm marketing vẫn dùng các mô hình thứ bậc dù người tiêu dùng không phải lúc nào cũng đi đúng thứ tự?</li>
</ol>`,
  ]]);

const c5 = doc('mkt304-2-2-source-message-channel', '2.2 — Ch 6: Source, message and channel factors|||2.2 — Ch 6: Yếu tố nguồn, thông điệp và kênh',
  'Ma trận thuyết phục (persuasion matrix), ba thuộc tính của nguồn theo Kelman (tin cậy, hấp dẫn, quyền lực), người nổi tiếng và mô hình chuyển giao ý nghĩa McCracken, cấu trúc và lời kêu gọi của thông điệp (so sánh, sợ hãi, hài hước), yếu tố kênh.',
  [[
    `<span class="eyebrow">MKT304 · Part 2 · Lesson 2.2</span>
<h2>Ch 6 — Source, message and channel factors</h2>
<h3>The persuasion matrix</h3>
<p>McGuire's persuasion matrix links what the communicator <strong>controls</strong> (independent variables) with the <strong>steps of the receiver's response</strong> (dependent variables). It helps diagnose where a campaign succeeds or fails.</p>
<table>
<tr><th>Independent variables — components you control</th><th>Dependent variables — steps of the response</th></tr>
<tr><td>Source (who says it)</td><td>Message presentation</td></tr>
<tr><td>Message (what is said and how)</td><td>Attention</td></tr>
<tr><td>Channel (which medium)</td><td>Comprehension</td></tr>
<tr><td>Receiver (whom it targets)</td><td>Yielding (agreement)</td></tr>
<tr><td>Destination (the behaviour sought)</td><td>Retention → Behaviour</td></tr>
</table>
<p>The two columns are the two axes of the matrix, not pairs: every component can affect every step, giving a 5 × 6 grid. Each cell is a question: does this <em>channel</em> get the message <em>presented</em>? Is this <em>message</em> <em>comprehended</em> by this receiver? For example, a complex technical message on a fast-scrolling feed may win attention but fail at comprehension.</p>
<h3>Source factors (Kelman's three processes)</h3>
<table>
<tr><th>Source attribute</th><th>Components</th><th>Process of influence</th></tr>
<tr><td>Credibility</td><td>Expertise, trustworthiness</td><td><strong>Internalization</strong> — the receiver adopts the view because it fits their own beliefs</td></tr>
<tr><td>Attractiveness</td><td>Similarity, familiarity, likability</td><td><strong>Identification</strong> — the receiver wants to be like, or relate to, the source</td></tr>
<tr><td>Power</td><td>Ability to reward or punish</td><td><strong>Compliance</strong> — outward acceptance to gain a reward or avoid a sanction</td></tr>
</table>
<p>Limits: a highly credible source helps most when the audience initially disagrees; the <strong>sleeper effect</strong> describes the finding that a message from a low-credibility source can become more persuasive over time as people forget the source.</p>
<h3>Celebrities and the meaning transfer model</h3>
<p>Celebrities attract attention and can transfer their image to the brand, but carry risks: they may <strong>overshadow the product</strong>, suffer <strong>overexposure</strong> by endorsing too many brands, lack credibility with the target audience, or damage the brand through <strong>negative publicity</strong>. Selection criteria include trustworthiness, expertise, match with the product and audience, likability, cost and risk. The same logic applies to KOLs and KOCs on social media, with the added duty to disclose paid content.</p>
<p><strong>McCracken's meaning transfer model</strong> explains why the fit matters:</p>
<pre><code class="language-text">Stage 1  CULTURE  -> CELEBRITY : roles and public image give the celebrity meanings
Stage 2  CELEBRITY -> PRODUCT  : the endorsement moves those meanings to the brand
Stage 3  PRODUCT  -> CONSUMER  : buying and using the brand lets consumers take the meanings on</code></pre>
<h3>Message factors</h3>
<ul>
<li><strong>Order of presentation</strong> — strongest arguments first (primacy) or last (recency); for low-interest audiences, lead with the key point.</li>
<li><strong>Conclusion drawing</strong> — state the conclusion explicitly for less knowledgeable audiences or complex issues; leave it open for involved, well-informed audiences who prefer to decide themselves.</li>
<li><strong>Message sidedness</strong> — one-sided messages work with audiences already favourable; <strong>two-sided</strong> messages (admitting a weakness) raise credibility with better-educated or sceptical audiences. <strong>Refutational</strong> appeals raise and then refute an opposing argument, "inoculating" the audience.</li>
<li><strong>Verbal vs visual</strong> — pictures aid recall and can carry meaning words cannot.</li>
<li><strong>Comparative advertising</strong> — naming competitors can help a new or small brand, but it is legally sensitive; in Vietnam, <em>direct</em> comparison with competitors' same-type products is restricted (see Part 8).</li>
<li><strong>Fear appeals</strong> — moderate fear plus a clear, doable solution tends to work best; too much fear triggers avoidance.</li>
<li><strong>Humour</strong> — wins attention and liking, but may distract from the message, wear out quickly and travel badly across cultures.</li>
</ul>
<h3>Channel factors</h3>
<p><strong>Personal</strong> channels allow feedback and tailoring; <strong>nonpersonal</strong> channels reach many people. Print is <em>self-paced</em> (readers control speed, good for detailed arguments); broadcast and video are <em>externally paced</em> (better for emotional, simple messages). The <strong>context</strong> in which an ad appears affects how it is received, and <strong>clutter</strong> lowers attention to every ad.</p>
<div class="callout"><span class="badge">Watch out</span> A celebrity is a source factor, not a strategy. If the celebrity's meanings do not match the positioning, the ad may be remembered and the brand forgotten.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Use the persuasion matrix to diagnose an ad that people remember but do not understand.</li>
<li>Through which Kelman process does a doctor in a toothpaste ad work? A popular singer?</li>
<li>When would you recommend a two-sided message for a new product?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 2 · Bài 2.2</span>
<h2>Ch 6 — Yếu tố nguồn, thông điệp và kênh</h2>
<h3>Ma trận thuyết phục</h3>
<p>Ma trận thuyết phục của McGuire nối những gì người truyền thông <strong>kiểm soát được</strong> (biến độc lập) với <strong>các bước đáp ứng của người nhận</strong> (biến phụ thuộc). Nó giúp chẩn đoán chiến dịch thành công hay thất bại ở đâu.</p>
<table>
<tr><th>Biến độc lập — thành phần kiểm soát được</th><th>Biến phụ thuộc — các bước đáp ứng</th></tr>
<tr><td>Nguồn (ai nói)</td><td>Thông điệp được đưa tới</td></tr>
<tr><td>Thông điệp (nói gì, nói thế nào)</td><td>Chú ý</td></tr>
<tr><td>Kênh (phương tiện nào)</td><td>Thấu hiểu</td></tr>
<tr><td>Người nhận (nhắm tới ai)</td><td>Chấp thuận (đồng ý)</td></tr>
<tr><td>Đích đến (hành vi mong muốn)</td><td>Ghi nhớ → Hành vi</td></tr>
</table>
<p>Hai cột là hai trục của ma trận, không phải từng cặp: mỗi thành phần đều có thể tác động tới mọi bước, tạo thành lưới 5 × 6. Mỗi ô là một câu hỏi: <em>kênh</em> này có đưa thông điệp <em>tới</em> người nhận không? <em>Thông điệp</em> này có được người nhận <em>hiểu</em> không? Ví dụ, một thông điệp kỹ thuật phức tạp trên bảng tin cuộn nhanh có thể giành được chú ý nhưng thất bại ở bước thấu hiểu.</p>
<h3>Yếu tố nguồn (ba quá trình của Kelman)</h3>
<table>
<tr><th>Thuộc tính nguồn</th><th>Thành phần</th><th>Quá trình ảnh hưởng</th></tr>
<tr><td>Độ tin cậy</td><td>Chuyên môn, sự đáng tin</td><td><strong>Nội hoá</strong> — người nhận chấp nhận quan điểm vì nó khớp với niềm tin của chính họ</td></tr>
<tr><td>Sức hấp dẫn</td><td>Sự tương đồng, quen thuộc, dễ mến</td><td><strong>Đồng nhất hoá</strong> — người nhận muốn giống, hoặc gắn mình với nguồn</td></tr>
<tr><td>Quyền lực</td><td>Khả năng thưởng hoặc phạt</td><td><strong>Tuân thủ</strong> — chấp nhận bề ngoài để được thưởng hoặc tránh bị phạt</td></tr>
</table>
<p>Giới hạn: nguồn có độ tin cậy cao giúp nhiều nhất khi công chúng ban đầu không đồng tình; <strong>hiệu ứng ngủ quên</strong> (sleeper effect) mô tả phát hiện rằng thông điệp từ nguồn kém tin cậy có thể trở nên thuyết phục hơn theo thời gian khi người ta quên mất nguồn.</p>
<h3>Người nổi tiếng và mô hình chuyển giao ý nghĩa</h3>
<p>Người nổi tiếng thu hút chú ý và có thể chuyển hình ảnh của mình sang thương hiệu, nhưng kèm rủi ro: họ có thể <strong>lấn át sản phẩm</strong>, bị <strong>xuất hiện quá nhiều</strong> khi đại diện cho quá nhiều thương hiệu, thiếu tin cậy với công chúng mục tiêu, hoặc gây hại cho thương hiệu vì <strong>tai tiếng</strong>. Tiêu chí chọn gồm sự đáng tin, chuyên môn, độ phù hợp với sản phẩm và công chúng, sự dễ mến, chi phí và rủi ro. Logic tương tự áp dụng cho KOL và KOC trên mạng xã hội, cộng thêm nghĩa vụ công khai nội dung được trả tiền.</p>
<p><strong>Mô hình chuyển giao ý nghĩa của McCracken</strong> giải thích vì sao sự phù hợp quan trọng:</p>
<pre><code class="language-text">Giai đoạn 1  VĂN HOÁ      -> NGƯỜI NỔI TIẾNG : vai diễn và hình ảnh công chúng tạo ý nghĩa cho người nổi tiếng
Giai đoạn 2  NGƯỜI NỔI TIẾNG -> SẢN PHẨM    : lời xác nhận chuyển các ý nghĩa đó sang thương hiệu
Giai đoạn 3  SẢN PHẨM     -> NGƯỜI TIÊU DÙNG : mua và dùng thương hiệu giúp người tiêu dùng nhận lấy các ý nghĩa ấy</code></pre>
<h3>Yếu tố thông điệp</h3>
<ul>
<li><strong>Thứ tự trình bày</strong> — lập luận mạnh nhất đặt đầu (hiệu ứng đầu tiên) hay cuối (hiệu ứng gần nhất); với công chúng ít quan tâm, hãy mở đầu bằng ý chính.</li>
<li><strong>Rút ra kết luận</strong> — nêu rõ kết luận với công chúng ít hiểu biết hoặc vấn đề phức tạp; để ngỏ với công chúng quan tâm cao, hiểu biết tốt, những người thích tự quyết.</li>
<li><strong>Thông điệp một chiều hay hai chiều</strong> — thông điệp một chiều hiệu quả với công chúng đã có thiện cảm; thông điệp <strong>hai chiều</strong> (thừa nhận một điểm yếu) tăng độ tin cậy với công chúng học vấn cao hoặc hoài nghi. Lời kêu gọi <strong>bác bỏ</strong> nêu rồi bác bỏ một lập luận đối lập, giúp "tiêm phòng" cho công chúng.</li>
<li><strong>Lời và hình</strong> — hình ảnh giúp ghi nhớ và mang được những ý nghĩa mà lời không nói hết.</li>
<li><strong>Quảng cáo so sánh</strong> — nêu tên đối thủ có thể giúp thương hiệu mới hoặc nhỏ, nhưng nhạy cảm về pháp lý; tại Việt Nam, việc so sánh <em>trực tiếp</em> với sản phẩm cùng loại của đối thủ bị hạn chế (xem Phần 8).</li>
<li><strong>Lời kêu gọi sợ hãi</strong> — mức sợ vừa phải kèm một giải pháp rõ ràng, làm được thường hiệu quả nhất; sợ quá mức khiến người xem né tránh.</li>
<li><strong>Hài hước</strong> — giành chú ý và thiện cảm, nhưng có thể làm xao nhãng thông điệp, nhanh nhàm và khó chuyển sang văn hoá khác.</li>
</ul>
<h3>Yếu tố kênh</h3>
<p>Kênh <strong>cá nhân</strong> cho phép phản hồi và may đo; kênh <strong>phi cá nhân</strong> tiếp cận nhiều người. Báo in là phương tiện <em>tự điều nhịp</em> (người đọc kiểm soát tốc độ, hợp với lập luận chi tiết); phát thanh, truyền hình và video là phương tiện <em>bị điều nhịp từ bên ngoài</em> (hợp với thông điệp cảm xúc, đơn giản). <strong>Bối cảnh</strong> nơi quảng cáo xuất hiện ảnh hưởng tới cách nó được tiếp nhận, và <strong>nhiễu quảng cáo</strong> làm giảm sự chú ý tới mọi quảng cáo.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Người nổi tiếng là một yếu tố nguồn, không phải một chiến lược. Nếu ý nghĩa người nổi tiếng mang theo không khớp với định vị, người xem có thể nhớ quảng cáo mà quên thương hiệu.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Dùng ma trận thuyết phục để chẩn đoán một quảng cáo được nhớ nhưng không được hiểu.</li>
<li>Một bác sĩ trong quảng cáo kem đánh răng tác động qua quá trình nào của Kelman? Một ca sĩ nổi tiếng thì sao?</li>
<li>Khi nào bạn đề xuất thông điệp hai chiều cho một sản phẩm mới?</li>
</ol>`,
  ]]);

const c5q = quiz('mkt304-quiz-2', 'Quiz 2 — Communication & persuasion|||Quiz 2 — Truyền thông & thuyết phục', [
  { id: 'q1', question: 'Which sequence is the hierarchy of effects model of Lavidge and Steiner?|||Chuỗi nào là mô hình thứ bậc hiệu ứng của Lavidge và Steiner?', options: ['Attention, interest, desire, action|||Chú ý, quan tâm, mong muốn, hành động', 'Awareness, interest, evaluation, trial, adoption|||Nhận biết, quan tâm, đánh giá, dùng thử, chấp nhận', 'Awareness, knowledge, liking, preference, conviction, purchase|||Nhận biết, hiểu biết, thích, ưa chuộng, tin chắc, mua', 'Presentation, attention, comprehension, yielding, retention, behavior|||Tiếp nhận, chú ý, thấu hiểu, chấp thuận, ghi nhớ, hành vi'], correctIndex: 2, explanation: 'The other options are AIDA, the innovation adoption model and McGuire’s information processing model.|||Các phương án còn lại là AIDA, mô hình chấp nhận đổi mới và mô hình xử lý thông tin của McGuire.' },
  { id: 'q2', question: 'According to the ELM, persuasion is most likely to follow the central route when…|||Theo ELM, thuyết phục dễ đi theo đường trung tâm nhất khi…', options: ['the receiver is highly motivated and able to process the message|||người nhận có động cơ cao và có khả năng xử lý thông điệp', 'the ad uses a famous celebrity and catchy music|||quảng cáo dùng người nổi tiếng và nhạc bắt tai', 'the receiver is distracted and has little time|||người nhận bị xao nhãng và có ít thời gian', 'the product is a low-involvement item bought out of habit|||sản phẩm thuộc loại quan tâm thấp, mua theo thói quen'], correctIndex: 0, explanation: 'High motivation and ability lead people to scrutinise arguments; celebrities and music are peripheral cues.|||Động cơ và khả năng cao khiến người ta xem xét kỹ lập luận; người nổi tiếng và âm nhạc là tín hiệu ngoại vi.' },
  { id: 'q3', question: 'In McCracken’s meaning transfer model, what moves from the celebrity to the product?|||Trong mô hình chuyển giao ý nghĩa của McCracken, điều gì được chuyển từ người nổi tiếng sang sản phẩm?', options: ['The celebrity’s legal liability for product defects|||Trách nhiệm pháp lý của người nổi tiếng đối với lỗi sản phẩm', 'The celebrity’s fee, which raises the retail price|||Thù lao của người nổi tiếng, làm tăng giá bán lẻ', 'The celebrity’s personal fan list for direct marketing|||Danh sách người hâm mộ của người nổi tiếng để làm marketing trực tiếp', 'Cultural meanings the celebrity has acquired, which consumers can then take on by using the product|||Những ý nghĩa văn hoá người nổi tiếng đã có, mà người tiêu dùng có thể nhận lấy khi dùng sản phẩm'], correctIndex: 3, explanation: 'Meanings flow from culture to the celebrity, from the celebrity to the product, and from the product to the consumer.|||Ý nghĩa đi từ văn hoá tới người nổi tiếng, từ người nổi tiếng tới sản phẩm, và từ sản phẩm tới người tiêu dùng.' },
]);

const c6 = doc('mkt304-3-1-objectives-dagmar', '3.1 — Ch 7: Setting IMC objectives & DAGMAR|||3.1 — Ch 7: Đặt mục tiêu IMC & DAGMAR',
  'Giá trị của mục tiêu, mục tiêu marketing và mục tiêu truyền thông, tranh luận về mục tiêu doanh số, tháp hiệu ứng truyền thông, cách tiếp cận DAGMAR (Colley) và bốn đặc điểm của mục tiêu tốt, các vấn đề khi đặt mục tiêu, mục tiêu cho IMC.',
  [[
    `<span class="eyebrow">MKT304 · Part 3 · Lesson 3.1</span>
<h2>Ch 7 — Setting objectives</h2>
<h3>Why objectives matter</h3>
<ul>
<li><strong>Communication and coordination</strong> — client, agency, media and PR teams work towards the same written goal.</li>
<li><strong>Planning and decision making</strong> — every choice (message, medium, budget) can be tested against the objective.</li>
<li><strong>Measurement and evaluation</strong> — without a benchmark and a target there is nothing to measure success against.</li>
</ul>
<h3>Marketing objectives vs communication objectives</h3>
<p><strong>Marketing objectives</strong> are stated in the marketing plan: sales volume, market share, profit, return on investment. <strong>Communication objectives</strong> are what the IMC programme itself must achieve in the audience's mind and behaviour: awareness, knowledge, image, attitudes, preference, purchase intention, trial.</p>
<h3>The sales-objective debate</h3>
<table>
<tr><th>Arguments for sales objectives</th><th>Arguments against</th></tr>
<tr><td>Top management thinks in sales and profit; spending must be justified in money terms</td><td>Sales depend on many factors — product, price, distribution, competitors, the economy — not only on communication</td></tr>
<tr><td>Some tools do produce measurable sales directly (direct-response ads, retail ads, promotions, e-commerce)</td><td><strong>Carryover effect</strong>: communication often works with a delay, so this period's sales may reflect last period's spending</td></tr>
<tr><td>Clear accountability</td><td>Sales objectives give little guidance to creative and media planners</td></tr>
</table>
<p>A practical conclusion: use sales or behavioural objectives where the link is direct and measurable, and communication objectives for tools whose effect is indirect or delayed.</p>
<h3>The communications effects pyramid</h3>
<p>Communication tasks can be stacked like a pyramid: the broad base is <strong>awareness</strong>, then <strong>knowledge/comprehension</strong>, <strong>liking</strong>, <strong>preference</strong>, <strong>trial</strong> and, at the narrow top, <strong>repeat purchase/loyalty</strong>. A new brand must build the lower levels first; an established brand may focus on the top. Illustrative (assumed) targets for a new brand after six months: awareness 80% of the target audience, knowledge 60%, liking 40%, preference 25%, trial 15%, repeat 8%.</p>
<h3>DAGMAR</h3>
<p>Russell Colley's 1961 report <em>Defining Advertising Goals for Measured Advertising Results</em> (DAGMAR) argued that advertising's job is a specific <strong>communication task</strong>, to be accomplished among a defined audience in a given time. The audience moves along a communications spectrum:</p>
<pre><code class="language-text">UNAWARENESS -> AWARENESS -> COMPREHENSION -> CONVICTION -> ACTION</code></pre>
<p>A DAGMAR objective has four characteristics:</p>
<table>
<tr><th>Characteristic</th><th>Meaning</th><th>In the example below</th></tr>
<tr><td>Concrete, measurable task</td><td>States exactly what must change and how it will be measured</td><td>Aided brand awareness, measured by survey</td></tr>
<tr><td>Target audience</td><td>Defines precisely who</td><td>18–24-year-olds in Ho Chi Minh City</td></tr>
<tr><td>Benchmark and degree of change</td><td>States the starting level and the target level</td><td>From 10% to 40%</td></tr>
<tr><td>Specified time period</td><td>Sets a deadline</td><td>Within 12 weeks of launch</td></tr>
</table>
<p><strong>Example (fictional):</strong> "Raise aided awareness of LumaTea among 18–24-year-olds in Ho Chi Minh City from 10% to 40% within 12 weeks of launch, measured by pre- and post-campaign surveys."</p>
<p><strong>Criticisms of DAGMAR:</strong> the hierarchy it relies on is not always followed; it sidesteps the sales question; measuring communication effects takes money and research; and critics argue that tightly written objectives can <strong>inhibit creativity</strong>. Its lasting contribution is the discipline of measurable, benchmarked objectives.</p>
<h3>Problems in setting objectives — and IMC objectives</h3>
<p>Many companies still write objectives that are really <em>tactics</em> ("run a TikTok campaign") or wishes ("increase awareness") with no benchmark, audience or deadline. In IMC, each tool gets objectives suited to what it can do: advertising — awareness and image; sales promotion — trial and repeat; PR — credibility and coverage; digital — engagement, leads and conversions; direct marketing — responses and orders. Together they must add up to the marketing objective.</p>
<div class="callout"><span class="badge">Exam tip</span> To test whether an objective follows DAGMAR, look for the four elements: what, who, from–to, by when. Missing any one makes it non-DAGMAR.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Rewrite "make more young people like our brand" as a DAGMAR objective.</li>
<li>For which kinds of firms are sales objectives appropriate? Why?</li>
<li>Does writing precise objectives limit creativity? Argue both sides.</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 3 · Bài 3.1</span>
<h2>Ch 7 — Đặt mục tiêu</h2>
<h3>Vì sao mục tiêu quan trọng</h3>
<ul>
<li><strong>Giao tiếp và phối hợp</strong> — khách hàng, agency, đội phương tiện và đội PR cùng hướng tới một mục tiêu đã viết ra.</li>
<li><strong>Hoạch định và ra quyết định</strong> — mọi lựa chọn (thông điệp, phương tiện, ngân sách) đều có thể được đối chiếu với mục tiêu.</li>
<li><strong>Đo lường và đánh giá</strong> — không có mức chuẩn và mức đích thì không có gì để đo thành công.</li>
</ul>
<h3>Mục tiêu marketing và mục tiêu truyền thông</h3>
<p><strong>Mục tiêu marketing</strong> được nêu trong kế hoạch marketing: sản lượng bán, thị phần, lợi nhuận, tỷ suất sinh lời trên vốn đầu tư. <strong>Mục tiêu truyền thông</strong> là điều chính chương trình IMC phải đạt được trong tâm trí và hành vi của công chúng: nhận biết, hiểu biết, hình ảnh, thái độ, ưa chuộng, ý định mua, dùng thử.</p>
<h3>Tranh luận về mục tiêu doanh số</h3>
<table>
<tr><th>Lập luận ủng hộ mục tiêu doanh số</th><th>Lập luận phản đối</th></tr>
<tr><td>Ban lãnh đạo nghĩ bằng doanh số và lợi nhuận; chi tiêu phải được biện minh bằng tiền</td><td>Doanh số phụ thuộc nhiều yếu tố — sản phẩm, giá, phân phối, đối thủ, nền kinh tế — không chỉ truyền thông</td></tr>
<tr><td>Một số công cụ tạo doanh số đo được trực tiếp (quảng cáo đáp ứng trực tiếp, quảng cáo bán lẻ, khuyến mại, thương mại điện tử)</td><td><strong>Hiệu ứng trễ</strong> (carryover): truyền thông thường tác động chậm, nên doanh số kỳ này có thể phản ánh chi tiêu kỳ trước</td></tr>
<tr><td>Trách nhiệm giải trình rõ ràng</td><td>Mục tiêu doanh số ít định hướng cho người làm sáng tạo và hoạch định phương tiện</td></tr>
</table>
<p>Kết luận thực tế: dùng mục tiêu doanh số hay hành vi khi mối liên hệ trực tiếp và đo được, và dùng mục tiêu truyền thông cho những công cụ có tác động gián tiếp hoặc chậm.</p>
<h3>Tháp hiệu ứng truyền thông</h3>
<p>Các nhiệm vụ truyền thông có thể xếp như một kim tự tháp: đáy rộng là <strong>nhận biết</strong>, rồi <strong>hiểu biết</strong>, <strong>yêu thích</strong>, <strong>ưa chuộng</strong>, <strong>dùng thử</strong> và ở đỉnh hẹp là <strong>mua lặp lại/trung thành</strong>. Thương hiệu mới phải xây các tầng dưới trước; thương hiệu đã vững có thể tập trung vào đỉnh. Mục tiêu minh hoạ (giả định) cho một thương hiệu mới sau sáu tháng: nhận biết 80% công chúng mục tiêu, hiểu biết 60%, yêu thích 40%, ưa chuộng 25%, dùng thử 15%, mua lặp lại 8%.</p>
<h3>DAGMAR</h3>
<p>Báo cáo năm 1961 của Russell Colley, <em>Defining Advertising Goals for Measured Advertising Results</em> (DAGMAR — Xác định mục tiêu quảng cáo để đo lường kết quả quảng cáo), lập luận rằng nhiệm vụ của quảng cáo là một <strong>nhiệm vụ truyền thông</strong> cụ thể, phải hoàn thành với một công chúng xác định trong một khoảng thời gian cho trước. Công chúng di chuyển dọc một phổ truyền thông:</p>
<pre><code class="language-text">CHƯA BIẾT -> NHẬN BIẾT -> THẤU HIỂU -> TIN CHẮC -> HÀNH ĐỘNG</code></pre>
<p>Một mục tiêu DAGMAR có bốn đặc điểm:</p>
<table>
<tr><th>Đặc điểm</th><th>Ý nghĩa</th><th>Trong ví dụ bên dưới</th></tr>
<tr><td>Nhiệm vụ cụ thể, đo được</td><td>Nêu chính xác điều gì phải thay đổi và đo bằng cách nào</td><td>Nhận biết thương hiệu có gợi ý, đo bằng khảo sát</td></tr>
<tr><td>Công chúng mục tiêu</td><td>Xác định chính xác là ai</td><td>Người 18–24 tuổi tại TP. Hồ Chí Minh</td></tr>
<tr><td>Mức chuẩn và mức thay đổi</td><td>Nêu mức xuất phát và mức đích</td><td>Từ 10% lên 40%</td></tr>
<tr><td>Thời hạn cụ thể</td><td>Đặt hạn chót</td><td>Trong 12 tuần kể từ khi ra mắt</td></tr>
</table>
<p><strong>Ví dụ (giả định):</strong> "Nâng mức nhận biết có gợi ý của LumaTea trong nhóm 18–24 tuổi tại TP. Hồ Chí Minh từ 10% lên 40% trong 12 tuần kể từ khi ra mắt, đo bằng khảo sát trước và sau chiến dịch."</p>
<p><strong>Phê phán DAGMAR:</strong> mô hình thứ bậc mà nó dựa vào không phải lúc nào cũng đúng; nó né câu hỏi về doanh số; đo hiệu ứng truyền thông tốn tiền và nghiên cứu; và những người phê phán cho rằng mục tiêu viết quá chặt có thể <strong>kìm hãm sáng tạo</strong>. Đóng góp bền vững của nó là kỷ luật đặt mục tiêu đo được, có mức chuẩn.</p>
<h3>Các vấn đề khi đặt mục tiêu — và mục tiêu IMC</h3>
<p>Nhiều công ty vẫn viết những mục tiêu thực chất là <em>chiến thuật</em> ("chạy một chiến dịch TikTok") hoặc mong muốn ("tăng nhận biết") không có mức chuẩn, công chúng hay thời hạn. Trong IMC, mỗi công cụ nhận mục tiêu phù hợp với khả năng của nó: quảng cáo — nhận biết và hình ảnh; khuyến mại — dùng thử và mua lặp lại; PR — độ tin cậy và mức phủ sóng báo chí; số — tương tác, khách hàng tiềm năng và chuyển đổi; marketing trực tiếp — phản hồi và đơn hàng. Cộng lại, chúng phải đạt được mục tiêu marketing.</p>
<div class="callout"><span class="badge">Mẹo làm bài</span> Để kiểm một mục tiêu có theo DAGMAR không, tìm bốn yếu tố: cái gì, ai, từ bao nhiêu lên bao nhiêu, tới khi nào. Thiếu một yếu tố là không đạt chuẩn DAGMAR.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Viết lại "làm cho nhiều bạn trẻ thích thương hiệu hơn" thành một mục tiêu DAGMAR.</li>
<li>Loại doanh nghiệp nào phù hợp với mục tiêu doanh số? Vì sao?</li>
<li>Viết mục tiêu chính xác có hạn chế sáng tạo không? Lập luận cả hai phía.</li>
</ol>`,
  ]]);

const c7 = doc('mkt304-3-2-budgeting', '3.2 — Ch 7: Establishing and allocating the budget|||3.2 — Ch 7: Lập và phân bổ ngân sách',
  'Phân tích biên và các đường đáp ứng doanh số (lõm, hình chữ S), các phương pháp từ trên xuống (khả năng chi trả, tuỳ ý, phần trăm doanh thu, ngang bằng cạnh tranh, ROI), phương pháp từ dưới lên (mục tiêu – nhiệm vụ, kế hoạch hoàn vốn, mô hình định lượng), share of voice, các yếu tố phân bổ ngân sách.',
  [[
    `<span class="eyebrow">MKT304 · Part 3 · Lesson 3.2</span>
<h2>Ch 7 — Establishing and allocating the budget</h2>
<h3>Theoretical approaches</h3>
<p><strong>Marginal analysis</strong> says: keep spending while each extra unit of promotion brings more gross margin than it costs; stop where marginal revenue equals marginal cost. It assumes sales are the objective and that the effect of each unit of spending can be measured — both rarely true. <strong>Sales response models</strong> describe the shape of the relationship:</p>
<ul>
<li><strong>Concave-downward</strong> — each extra unit of spending adds less than the previous one (diminishing returns).</li>
<li><strong>S-shaped</strong> — below a <em>threshold</em> spending has little effect; then sales respond strongly; finally the market saturates. Implication: a budget that is too small may be wasted entirely.</li>
</ul>
<h3>Top-down methods</h3>
<table>
<tr><th>Method</th><th>How it works</th><th>Strength</th><th>Weakness</th></tr>
<tr><td>Affordable</td><td>Spend what is left after other costs</td><td>Simple, safe for cash</td><td>No link to objectives; cuts promotion exactly when it may be needed</td></tr>
<tr><td>Arbitrary allocation</td><td>Management decides by feel</td><td>Fast</td><td>No theoretical basis at all</td></tr>
<tr><td>Percentage of sales</td><td>A fixed % of past or projected sales</td><td>Simple, ties spending to revenue, stable</td><td>Treats sales as the <em>cause</em> of promotion rather than its result; cuts spending when sales fall; ignores objectives</td></tr>
<tr><td>Competitive parity</td><td>Match competitors' spending or the industry average</td><td>Uses the "collective wisdom" of the industry; may avoid promotional wars</td><td>Competitors' objectives and efficiency differ; the data are often out of date</td></tr>
<tr><td>Return on investment (ROI)</td><td>Treat promotion as an investment and spend where returns are highest</td><td>Logical and accountable</td><td>Returns of communication are hard to measure, especially long-term brand effects</td></tr>
</table>
<h3>Build-up methods</h3>
<ul>
<li><strong>Objective-and-task</strong> — (1) define the communication objectives; (2) determine the specific tasks needed to reach them; (3) estimate the cost of each task; (4) sum the costs into the budget; (5) monitor and reevaluate. It is the method most consistent with DAGMAR and IMC, but it takes time and it is hard to know whether the chosen tasks are the right ones.</li>
<li><strong>Payout planning</strong> — for new products: project revenues and promotion costs over two or three years, accepting heavy spending and losses early to build share, recovered later.</li>
<li><strong>Quantitative models</strong> — statistical and econometric models (for example, marketing-mix modelling) that estimate how sales respond to each tool; powerful but data-hungry.</li>
</ul>
<h3>Worked numbers (illustrative)</h3>
<pre><code class="language-text">Percentage of sales: projected sales VND 80 billion x 5%   = VND 4 billion
Share of voice (SOV):  our spend 3 / category spend 20      = 15%
If our market share (SOM) is 12%: SOV 15% &gt; SOM 12%  ->  "excess share of voice" +3 points</code></pre>
<p>A widely cited industry guideline — not a law — is that brands whose share of voice exceeds their share of market tend to grow share, while brands spending below their share tend to lose it. It is a useful reality check on any budget, especially for new brands.</p>
<h3>Allocating the budget</h3>
<p>Once the total is set, it must be divided among IMC tools, markets and periods. Factors include: client and agency policies, <strong>market size and potential</strong> (see BDI/CDI in Ch 10), <strong>market share goals</strong> (share of voice), <strong>economies of scale</strong> in media buying, and organizational factors such as who controls the budget and internal politics between brands and departments.</p>
<div class="callout"><span class="badge">Remember</span> "We spend 5% of sales" answers the question "how much can we spend?". IMC asks a different question: "what must communication achieve, and what does that cost?"</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Why does the percentage-of-sales method tend to deepen a sales decline?</li>
<li>Explain the S-shaped response curve to a manager who wants to "test" a new brand with a tiny budget.</li>
<li>What makes the objective-and-task method hard to apply in practice, and how can you reduce that difficulty?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 3 · Bài 3.2</span>
<h2>Ch 7 — Lập và phân bổ ngân sách</h2>
<h3>Các cách tiếp cận lý thuyết</h3>
<p><strong>Phân tích biên</strong> cho rằng: tiếp tục chi khi mỗi đơn vị xúc tiến tăng thêm mang lại lợi nhuận gộp nhiều hơn chi phí của nó; dừng lại khi doanh thu biên bằng chi phí biên. Nó giả định doanh số là mục tiêu và tác động của từng đơn vị chi tiêu đo được — cả hai hiếm khi đúng. <strong>Các mô hình đáp ứng doanh số</strong> mô tả hình dạng của mối quan hệ:</p>
<ul>
<li><strong>Đường lõm</strong> — mỗi đơn vị chi thêm đóng góp ít hơn đơn vị trước (lợi suất giảm dần).</li>
<li><strong>Hình chữ S</strong> — dưới một <em>ngưỡng</em> thì chi tiêu gần như không tác dụng; sau đó doanh số phản ứng mạnh; cuối cùng thị trường bão hoà. Hàm ý: một ngân sách quá nhỏ có thể bị lãng phí hoàn toàn.</li>
</ul>
<h3>Các phương pháp từ trên xuống</h3>
<table>
<tr><th>Phương pháp</th><th>Cách làm</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr>
<tr><td>Theo khả năng chi trả</td><td>Chi phần còn lại sau các chi phí khác</td><td>Đơn giản, an toàn cho dòng tiền</td><td>Không gắn với mục tiêu; cắt xúc tiến đúng lúc có thể cần nhất</td></tr>
<tr><td>Phân bổ tuỳ ý</td><td>Ban lãnh đạo quyết theo cảm tính</td><td>Nhanh</td><td>Hoàn toàn không có cơ sở lý thuyết</td></tr>
<tr><td>Phần trăm doanh thu</td><td>Một tỷ lệ % cố định trên doanh thu quá khứ hoặc dự kiến</td><td>Đơn giản, gắn chi tiêu với doanh thu, ổn định</td><td>Coi doanh số là <em>nguyên nhân</em> của xúc tiến thay vì kết quả; cắt chi khi doanh số giảm; bỏ qua mục tiêu</td></tr>
<tr><td>Ngang bằng cạnh tranh</td><td>Chi bằng đối thủ hoặc bằng mức trung bình ngành</td><td>Dựa vào "trí khôn tập thể" của ngành; có thể tránh chiến tranh xúc tiến</td><td>Mục tiêu và hiệu quả của đối thủ khác mình; dữ liệu thường đã cũ</td></tr>
<tr><td>Tỷ suất sinh lời (ROI)</td><td>Coi xúc tiến là khoản đầu tư, chi vào nơi sinh lời cao nhất</td><td>Hợp lý, có trách nhiệm giải trình</td><td>Khó đo lợi ích của truyền thông, nhất là hiệu ứng thương hiệu dài hạn</td></tr>
</table>
<h3>Các phương pháp từ dưới lên</h3>
<ul>
<li><strong>Mục tiêu – nhiệm vụ</strong> — (1) xác định mục tiêu truyền thông; (2) xác định các nhiệm vụ cụ thể cần làm để đạt mục tiêu; (3) ước tính chi phí từng nhiệm vụ; (4) cộng lại thành ngân sách; (5) theo dõi và đánh giá lại. Đây là phương pháp nhất quán nhất với DAGMAR và IMC, nhưng tốn thời gian và khó biết các nhiệm vụ đã chọn có đúng không.</li>
<li><strong>Kế hoạch hoàn vốn (payout planning)</strong> — cho sản phẩm mới: dự báo doanh thu và chi phí xúc tiến trong hai, ba năm, chấp nhận chi mạnh và lỗ giai đoạn đầu để giành thị phần, thu hồi về sau.</li>
<li><strong>Mô hình định lượng</strong> — mô hình thống kê, kinh tế lượng (ví dụ mô hình marketing mix) ước lượng doanh số phản ứng thế nào với từng công cụ; mạnh nhưng đòi hỏi nhiều dữ liệu.</li>
</ul>
<h3>Ví dụ số (minh hoạ)</h3>
<pre><code class="language-text">Phần trăm doanh thu: doanh thu dự kiến 80 tỷ đồng x 5%          = 4 tỷ đồng
Share of voice (SOV): chi tiêu của ta 3 / chi tiêu cả ngành 20  = 15%
Nếu thị phần (SOM) của ta là 12%: SOV 15% &gt; SOM 12%  ->  "share of voice vượt trội" +3 điểm</code></pre>
<p>Một nguyên tắc kinh nghiệm được trích dẫn rộng rãi trong ngành — không phải định luật — là thương hiệu có share of voice cao hơn thị phần thường tăng thị phần, còn thương hiệu chi thấp hơn thị phần thường mất dần thị phần. Đây là phép kiểm thực tế hữu ích cho mọi ngân sách, nhất là với thương hiệu mới.</p>
<h3>Phân bổ ngân sách</h3>
<p>Khi đã có tổng ngân sách, cần chia cho các công cụ IMC, các thị trường và các thời kỳ. Các yếu tố gồm: chính sách của khách hàng và agency, <strong>quy mô và tiềm năng thị trường</strong> (xem BDI/CDI ở Ch 10), <strong>mục tiêu thị phần</strong> (share of voice), <strong>lợi thế kinh tế theo quy mô</strong> khi mua phương tiện, và yếu tố tổ chức như ai kiểm soát ngân sách và quan hệ nội bộ giữa các thương hiệu, phòng ban.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> "Chúng tôi chi 5% doanh thu" trả lời câu hỏi "có thể chi bao nhiêu?". IMC hỏi một câu khác: "truyền thông phải đạt được gì, và việc đó tốn bao nhiêu?"</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Vì sao phương pháp phần trăm doanh thu dễ làm doanh số sụt giảm sâu thêm?</li>
<li>Giải thích đường đáp ứng hình chữ S cho một nhà quản lý muốn "thử" thương hiệu mới với ngân sách rất nhỏ.</li>
<li>Điều gì khiến phương pháp mục tiêu – nhiệm vụ khó áp dụng trong thực tế, và làm sao giảm bớt khó khăn đó?</li>
</ol>`,
  ]]);

const c7e = doc('mkt304-3-3-exercise', 'Exercise 1 — objective-and-task budget vs rules of thumb|||Bài tập 1 — ngân sách mục tiêu – nhiệm vụ so với các quy tắc kinh nghiệm',
  'Bài tập: lập ngân sách theo mục tiêu – nhiệm vụ cho thương hiệu trà đóng chai giả định LumaTea, so với phương pháp phần trăm doanh thu và ngang bằng cạnh tranh, tính share of voice, cắt giảm khi ngân sách bị giới hạn; kèm lời giải.',
  [[
    `<span class="eyebrow">MKT304 · Part 3 · Exercise 1</span>
<h2>Exercise 1 — how much should LumaTea spend?</h2>
<div class="callout"><span class="badge">Problem</span> LumaTea (a fictional brand) will launch a bottled tea for 18–24-year-olds in Ho Chi Minh City. Projected first-year sales: VND 40,000 million. The industry's advertising-to-sales ratio is 6%. Three direct competitors spend VND 2,600, 3,200 and 2,600 million a year. Objectives: raise aided awareness in the target from 10% to 40% and reach 15% trial within the year. The team lists these tasks (VND million, illustrative): 10-week online video campaign 1,200; social media and KOC content 450; out-of-home near universities 600; sampling 60,000 bottles at 8,000 VND each including staff; PR launch event 250; trade support in convenience stores 500; pre/post awareness research 120. (a) Compute the objective-and-task budget with a 10% contingency, and express it as a % of sales. (b) Compute the budget under the percentage-of-sales and competitive-parity (average) methods. (c) Compute LumaTea's share of voice (SOV) under each budget, against the three competitors' total spending. (d) The CFO caps the budget at the competitive-parity level. Propose cuts and state the consequence for the objectives.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Sampling = 60,000 x 8,000 VND = VND 480 million
    Tasks: 1,200 + 450 + 600 + 480 + 250 + 500 + 120 = 3,600
    Contingency 10%:  3,600 x 0.10 = 360
    Objective-and-task budget      = 3,960   (VND million)
    As % of sales: 3,960 / 40,000  = 9.9%

(b) Percentage of sales: 40,000 x 6%                = 2,400
    Competitive parity: (2,600 + 3,200 + 2,600) / 3  = 2,800

(c) Competitors' total spending = 8,400
    SOV (objective-and-task) = 3,960 / (8,400 + 3,960) = 32.0%
    SOV (% of sales)         = 2,400 / (8,400 + 2,400) = 22.2%
    SOV (parity)             = 2,800 / (8,400 + 2,800) = 25.0%

(d) Cap = 2,800. Start from 3,960:
    remove contingency              -360  -> 3,600
    drop out-of-home                -600  -> 3,000
    cut online video to 8 weeks     -240  -> 2,760  (1,200 x 8/10 = 960)
    Within the cap, 40 left as a small reserve.</code></pre>
<p><strong>Why:</strong> the two rules of thumb produce 2,400–2,800 because they look at sales and competitors, not at what a <em>new</em> brand must achieve. A launch starts from 10% awareness, so it needs above-average share of voice — exactly the logic of payout planning. If the budget is capped, the honest response is not to keep the same objectives with fewer tasks, but to <strong>scale the objectives down</strong> (for example, 30% awareness instead of 40%) or extend the timeline. Cutting research would be a false saving: without the pre/post survey you cannot tell whether the objective was met.</p>`,
    `<span class="eyebrow">MKT304 · Phần 3 · Bài tập 1</span>
<h2>Bài tập 1 — LumaTea nên chi bao nhiêu?</h2>
<div class="callout"><span class="badge">Đề</span> LumaTea (thương hiệu giả định) sắp ra mắt trà đóng chai cho nhóm 18–24 tuổi tại TP. Hồ Chí Minh. Doanh thu năm đầu dự kiến: 40.000 triệu đồng. Tỷ lệ chi quảng cáo trên doanh thu của ngành là 6%. Ba đối thủ trực tiếp chi lần lượt 2.600, 3.200 và 2.600 triệu đồng mỗi năm. Mục tiêu: nâng nhận biết có gợi ý trong nhóm mục tiêu từ 10% lên 40% và đạt 15% dùng thử trong năm. Nhóm liệt kê các nhiệm vụ (triệu đồng, minh hoạ): chiến dịch video trực tuyến 10 tuần 1.200; nội dung mạng xã hội và KOC 450; quảng cáo ngoài trời gần các trường đại học 600; phát mẫu 60.000 chai với chi phí 8.000 đồng mỗi chai kể cả nhân sự; sự kiện PR ra mắt 250; hỗ trợ thương mại tại chuỗi cửa hàng tiện lợi 500; nghiên cứu nhận biết trước/sau 120. (a) Tính ngân sách mục tiêu – nhiệm vụ có 10% dự phòng, và biểu thị bằng % doanh thu. (b) Tính ngân sách theo phương pháp phần trăm doanh thu và ngang bằng cạnh tranh (mức trung bình). (c) Tính share of voice (SOV) của LumaTea theo từng ngân sách, so với tổng chi của ba đối thủ. (d) Giám đốc tài chính giới hạn ngân sách ở mức ngang bằng cạnh tranh. Đề xuất cắt giảm và nêu hệ quả với mục tiêu.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Phát mẫu = 60.000 x 8.000 đồng = 480 triệu đồng
    Nhiệm vụ: 1.200 + 450 + 600 + 480 + 250 + 500 + 120 = 3.600
    Dự phòng 10%:  3.600 x 0,10 = 360
    Ngân sách mục tiêu – nhiệm vụ   = 3.960   (triệu đồng)
    Tính theo % doanh thu: 3.960 / 40.000 = 9,9%

(b) Phần trăm doanh thu: 40.000 x 6%                  = 2.400
    Ngang bằng cạnh tranh: (2.600 + 3.200 + 2.600) / 3 = 2.800

(c) Tổng chi của đối thủ = 8.400
    SOV (mục tiêu – nhiệm vụ) = 3.960 / (8.400 + 3.960) = 32,0%
    SOV (% doanh thu)         = 2.400 / (8.400 + 2.400) = 22,2%
    SOV (ngang bằng)          = 2.800 / (8.400 + 2.800) = 25,0%

(d) Trần = 2.800. Bắt đầu từ 3.960:
    bỏ dự phòng                      -360  -> 3.600
    bỏ quảng cáo ngoài trời          -600  -> 3.000
    rút video trực tuyến còn 8 tuần  -240  -> 2.760  (1.200 x 8/10 = 960)
    Nằm trong trần, còn 40 làm dự trữ nhỏ.</code></pre>
<p><strong>Vì sao:</strong> hai quy tắc kinh nghiệm cho ra 2.400–2.800 vì chúng nhìn vào doanh thu và đối thủ, không nhìn vào điều một thương hiệu <em>mới</em> phải đạt được. Một thương hiệu ra mắt bắt đầu từ 10% nhận biết, nên cần share of voice cao hơn mức trung bình — đúng logic của kế hoạch hoàn vốn. Nếu ngân sách bị giới hạn, cách trung thực không phải là giữ nguyên mục tiêu với ít nhiệm vụ hơn, mà là <strong>hạ mục tiêu</strong> (ví dụ 30% nhận biết thay vì 40%) hoặc kéo dài thời gian. Cắt nghiên cứu là tiết kiệm giả: không có khảo sát trước/sau thì không biết mục tiêu có đạt hay không.</p>`,
  ]]);

const c7q = quiz('mkt304-quiz-3', 'Quiz 3 — Objectives & budgeting|||Quiz 3 — Mục tiêu & ngân sách', [
  { id: 'q1', question: 'Which objective best follows the DAGMAR approach?|||Mục tiêu nào theo đúng cách tiếp cận DAGMAR nhất?', options: ['Increase sales as much as possible this year|||Tăng doanh số nhiều nhất có thể trong năm nay', 'Make more people like our brand|||Làm cho nhiều người thích thương hiệu hơn', 'Raise aided awareness among female office workers aged 25-35 in Hanoi from 20% to 45% within six months|||Nâng nhận biết có gợi ý trong nhóm nữ nhân viên văn phòng 25–35 tuổi tại Hà Nội từ 20% lên 45% trong sáu tháng', 'Run a creative TikTok campaign that wins an award|||Chạy một chiến dịch TikTok sáng tạo đoạt giải'], correctIndex: 2, explanation: 'Only this option has a measurable task, a defined audience, a benchmark with a target, and a deadline.|||Chỉ phương án này có nhiệm vụ đo được, công chúng xác định, mức chuẩn kèm mức đích, và thời hạn.' },
  { id: 'q2', question: 'Projected sales are VND 50 billion and the firm budgets 4% of sales for promotion. The budget is…|||Doanh thu dự kiến 50 tỷ đồng và doanh nghiệp dành 4% doanh thu cho xúc tiến. Ngân sách là…', options: ['VND 0.2 billion|||0,2 tỷ đồng', 'VND 2 billion|||2 tỷ đồng', 'VND 12.5 billion|||12,5 tỷ đồng', 'VND 20 billion|||20 tỷ đồng'], correctIndex: 1, explanation: '50 x 4% = 2 billion.|||50 x 4% = 2 tỷ đồng.' },
  { id: 'q3', question: 'The main conceptual weakness of the percentage-of-sales method is that it…|||Điểm yếu cơ bản về mặt khái niệm của phương pháp phần trăm doanh thu là nó…', options: ['is too complex for small firms|||quá phức tạp với doanh nghiệp nhỏ', 'always produces a larger budget than competitors|||luôn cho ngân sách lớn hơn đối thủ', 'requires econometric data that firms rarely have|||đòi hỏi dữ liệu kinh tế lượng mà doanh nghiệp hiếm khi có', 'treats sales as the cause of promotion rather than its result|||coi doanh số là nguyên nhân của xúc tiến thay vì là kết quả của nó'], correctIndex: 3, explanation: 'Because spending follows sales, the budget falls when sales fall — even when more promotion may be needed.|||Vì chi tiêu đi theo doanh số, ngân sách giảm khi doanh số giảm — kể cả khi có thể cần xúc tiến nhiều hơn.' },
]);

const c8 = doc('mkt304-4-1-creative-planning', '4.1 — Ch 8: Creative strategy — planning and development|||4.1 — Ch 8: Chiến lược sáng tạo — hoạch định và phát triển',
  'Sáng tạo quảng cáo là gì (khác biệt + phù hợp), quá trình sáng tạo (Young, Wallas), vai trò account planning và nghiên cứu đầu vào, creative brief, bốn cách tìm ý tưởng lớn (USP, hình ảnh thương hiệu, kịch tính nội tại, định vị), chủ đề chiến dịch và slogan.',
  [[
    `<span class="eyebrow">MKT304 · Part 4 · Lesson 4.1</span>
<h2>Ch 8 — Creative strategy: planning and development</h2>
<h3>What is advertising creativity?</h3>
<p>Creativity is often reduced to "a clever ad". In advertising it has two dimensions that must appear together: <strong>divergence</strong> — the idea is novel, unexpected, different from what the audience has seen — and <strong>relevance</strong> — it is meaningful to the target audience and to the brand's objective. A divergent idea with no relevance is art that does not sell; a relevant idea with no divergence is invisible in the clutter. Debate continues between those who see creativity as the path to attention and memory, and those (often "hard-sell" advocates) who judge ads only by sales. IMC resolves it by judging creativity against the objectives set in Ch 7.</p>
<h3>The creative process</h3>
<table>
<tr><th>James Webb Young (five steps)</th><th>Graham Wallas (four stages)</th></tr>
<tr><td>1. Immersion — gather raw material and information</td><td>1. Preparation</td></tr>
<tr><td>2. Digestion — work the information over in the mind</td><td>(part of preparation)</td></tr>
<tr><td>3. Incubation — put the problem aside and let the unconscious work</td><td>2. Incubation</td></tr>
<tr><td>4. Illumination — the idea appears</td><td>3. Illumination</td></tr>
<tr><td>5. Reality or verification — shape the idea and test it against reality</td><td>4. Verification</td></tr>
</table>
<h3>Account planning and research inputs</h3>
<p>The <strong>account planner</strong> represents the consumer's voice in the agency: gathering insight and turning it into a brief. Inputs include <em>general preplanning</em> (background reading, trend reports, category data), <em>product-specific research</em> (what the product really does better, how people use it), <em>qualitative research</em> (focus groups, in-depth interviews, <strong>ethnographic research</strong> — observing people in their natural settings) and, later, research that evaluates and verifies creative work.</p>
<h3>The creative brief</h3>
<table>
<tr><th>Section</th><th>Question it answers</th></tr>
<tr><td>Basic problem or opportunity</td><td>Why are we advertising at all?</td></tr>
<tr><td>Communication objectives</td><td>What must the audience think, feel or do? (from Ch 7)</td></tr>
<tr><td>Target audience</td><td>Who exactly — including an insight into how they live and think</td></tr>
<tr><td>Major selling idea / key benefit</td><td>The single most important thing to say</td></tr>
<tr><td>Support</td><td>Why should they believe it? (reasons, proof)</td></tr>
<tr><td>Tone, mandatories and constraints</td><td>Brand voice, legal requirements, logo, budget, media</td></tr>
</table>
<h3>Four ways to find the big idea</h3>
<p>The <strong>big idea</strong> is the creative concept that attracts attention, gets a reaction and sets the brand apart. Four classic approaches:</p>
<ul>
<li><strong>Unique selling proposition (USP)</strong> — Rosser Reeves: each ad must make a specific benefit claim, the claim must be <em>unique</em> (competitors do not or cannot offer it) and it must be strong enough to move the mass audience. Works best when a real, sustainable product difference exists.</li>
<li><strong>Brand image</strong> — associated with David Ogilvy: when products are similar, build a distinctive image and personality that the target identifies with. Common in fashion, beverages and cosmetics.</li>
<li><strong>Inherent drama</strong> — associated with Leo Burnett: find the characteristic of the product that makes people buy it, and present it with warmth and emotion rather than exaggeration.</li>
<li><strong>Positioning</strong> — Al Ries and Jack Trout: build the idea around the place the brand should occupy in the consumer's mind relative to competitors.</li>
</ul>
<h3>Campaign themes, slogans and taglines</h3>
<p>A campaign is a set of interrelated messages sharing one <strong>theme</strong>. The <strong>slogan or tagline</strong> sums up the theme in a few memorable words and provides continuity across ads, media and years. Good slogans are short, easy to say, linked to the brand promise and legally usable (check trademark availability and, in Vietnam, avoid unsupported superlatives). A fictional example: a bike-sharing brand with the theme "the city is closer than you think" and the tagline "Ride closer."</p>
<div class="callout"><span class="badge">AI note</span> Generative AI can produce hundreds of slogans in seconds — it is strongest in the divergence phase. Relevance, legal checks and the final choice remain human jobs (lesson 9.2).</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Find an ad you remember strongly. Was it divergent, relevant, both? Did you remember the brand?</li>
<li>For a parity product such as bottled water, would you choose a USP or a brand-image approach? Why?</li>
<li>Write a one-page creative brief for a fictional brand of your choice.</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 4 · Bài 4.1</span>
<h2>Ch 8 — Chiến lược sáng tạo: hoạch định và phát triển</h2>
<h3>Sáng tạo trong quảng cáo là gì?</h3>
<p>Sáng tạo thường bị thu hẹp thành "một quảng cáo thông minh". Trong quảng cáo, nó có hai chiều phải xuất hiện cùng lúc: <strong>khác biệt</strong> — ý tưởng mới lạ, bất ngờ, khác với những gì công chúng đã thấy — và <strong>phù hợp</strong> — có ý nghĩa với công chúng mục tiêu và với mục tiêu của thương hiệu. Ý tưởng khác biệt mà không phù hợp là nghệ thuật không bán được hàng; ý tưởng phù hợp mà không khác biệt thì vô hình giữa nhiễu quảng cáo. Tranh luận vẫn tiếp diễn giữa những người coi sáng tạo là con đường tới sự chú ý và ghi nhớ, và những người (thường theo trường phái "bán hàng trực diện") chỉ đánh giá quảng cáo bằng doanh số. IMC giải quyết bằng cách đánh giá sáng tạo theo các mục tiêu đã đặt ở Ch 7.</p>
<h3>Quá trình sáng tạo</h3>
<table>
<tr><th>James Webb Young (năm bước)</th><th>Graham Wallas (bốn giai đoạn)</th></tr>
<tr><td>1. Đắm mình — thu thập nguyên liệu và thông tin</td><td>1. Chuẩn bị</td></tr>
<tr><td>2. Nghiền ngẫm — xử lý thông tin trong đầu</td><td>(thuộc giai đoạn chuẩn bị)</td></tr>
<tr><td>3. Ấp ủ — tạm gác vấn đề để vô thức làm việc</td><td>2. Ấp ủ</td></tr>
<tr><td>4. Bừng sáng — ý tưởng xuất hiện</td><td>3. Bừng sáng</td></tr>
<tr><td>5. Thực tế hoá hay kiểm chứng — định hình ý tưởng và thử nó với thực tế</td><td>4. Kiểm chứng</td></tr>
</table>
<h3>Account planning và nghiên cứu đầu vào</h3>
<p><strong>Account planner</strong> là tiếng nói của người tiêu dùng trong agency: thu thập insight và chuyển nó thành bản brief. Đầu vào gồm <em>nghiên cứu tổng quát trước hoạch định</em> (tài liệu nền, báo cáo xu hướng, dữ liệu ngành hàng), <em>nghiên cứu riêng về sản phẩm</em> (sản phẩm thực sự làm tốt hơn điều gì, người ta dùng nó thế nào), <em>nghiên cứu định tính</em> (nhóm tập trung, phỏng vấn sâu, <strong>nghiên cứu dân tộc học</strong> — quan sát con người trong môi trường tự nhiên của họ) và sau đó là nghiên cứu đánh giá, kiểm chứng sản phẩm sáng tạo.</p>
<h3>Creative brief</h3>
<table>
<tr><th>Mục</th><th>Câu hỏi nó trả lời</th></tr>
<tr><td>Vấn đề hoặc cơ hội cơ bản</td><td>Vì sao phải quảng cáo?</td></tr>
<tr><td>Mục tiêu truyền thông</td><td>Công chúng phải nghĩ, cảm hay làm gì? (từ Ch 7)</td></tr>
<tr><td>Công chúng mục tiêu</td><td>Chính xác là ai — kèm insight về cách họ sống và suy nghĩ</td></tr>
<tr><td>Ý tưởng bán hàng chính / lợi ích then chốt</td><td>Điều quan trọng nhất cần nói</td></tr>
<tr><td>Bằng chứng hỗ trợ</td><td>Vì sao họ nên tin? (lý do, bằng chứng)</td></tr>
<tr><td>Giọng điệu, yêu cầu bắt buộc và ràng buộc</td><td>Giọng thương hiệu, yêu cầu pháp lý, logo, ngân sách, phương tiện</td></tr>
</table>
<h3>Bốn cách tìm ý tưởng lớn</h3>
<p><strong>Ý tưởng lớn</strong> (big idea) là khái niệm sáng tạo thu hút chú ý, tạo phản ứng và làm thương hiệu khác biệt. Bốn cách tiếp cận kinh điển:</p>
<ul>
<li><strong>Lợi điểm bán hàng độc nhất (USP)</strong> — Rosser Reeves: mỗi quảng cáo phải đưa ra một tuyên bố lợi ích cụ thể, tuyên bố đó phải <em>độc nhất</em> (đối thủ không hoặc không thể đưa ra) và đủ mạnh để thúc đẩy công chúng đại chúng. Hiệu quả nhất khi có một khác biệt sản phẩm thật và bền vững.</li>
<li><strong>Hình ảnh thương hiệu</strong> — gắn với David Ogilvy: khi các sản phẩm giống nhau, hãy xây một hình ảnh và cá tính khác biệt mà công chúng mục tiêu thấy mình trong đó. Phổ biến ở thời trang, đồ uống, mỹ phẩm.</li>
<li><strong>Kịch tính nội tại</strong> — gắn với Leo Burnett: tìm đặc điểm của sản phẩm khiến người ta mua nó, và thể hiện bằng sự ấm áp, cảm xúc thay vì phóng đại.</li>
<li><strong>Định vị</strong> — Al Ries và Jack Trout: xây ý tưởng quanh vị trí mà thương hiệu cần chiếm trong tâm trí người tiêu dùng so với đối thủ.</li>
</ul>
<h3>Chủ đề chiến dịch, slogan và tagline</h3>
<p>Một chiến dịch là tập hợp các thông điệp liên kết với nhau, cùng một <strong>chủ đề</strong>. <strong>Slogan hay tagline</strong> gói chủ đề vào vài từ dễ nhớ và tạo sự liên tục qua các mẫu quảng cáo, phương tiện và năm tháng. Slogan tốt thì ngắn, dễ nói, gắn với lời hứa thương hiệu và dùng được về mặt pháp lý (kiểm tra khả năng đăng ký nhãn hiệu, và tại Việt Nam, tránh các từ so sánh nhất không có chứng minh). Ví dụ giả định: một thương hiệu xe đạp chia sẻ với chủ đề "thành phố gần hơn bạn nghĩ" và tagline "Đạp là tới."</p>
<div class="callout"><span class="badge">Ghi chú AI</span> AI tạo sinh có thể sinh hàng trăm slogan trong vài giây — nó mạnh nhất ở giai đoạn tạo sự khác biệt. Sự phù hợp, kiểm tra pháp lý và lựa chọn cuối cùng vẫn là việc của con người (bài 9.2).</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Tìm một quảng cáo bạn nhớ rất rõ. Nó khác biệt, phù hợp hay cả hai? Bạn có nhớ thương hiệu không?</li>
<li>Với một sản phẩm tương đồng như nước đóng chai, bạn chọn cách tiếp cận USP hay hình ảnh thương hiệu? Vì sao?</li>
<li>Viết một creative brief một trang cho một thương hiệu giả định do bạn chọn.</li>
</ol>`,
  ]]);

const c9 = doc('mkt304-4-2-creative-implementation', '4.2 — Ch 9: Creative strategy — implementation and evaluation|||4.2 — Ch 9: Chiến lược sáng tạo — thực thi và đánh giá',
  'Lời kêu gọi lý tính và cảm xúc, quảng cáo chuyển hoá (transformational), quảng cáo nhắc nhớ và teaser, 12 phong cách thực thi, chiến thuật sáng tạo cho báo in và video (tiêu đề, thân bài, hình ảnh, âm nhạc, sản xuất), cách khách hàng đánh giá và duyệt sản phẩm sáng tạo.',
  [[
    `<span class="eyebrow">MKT304 · Part 4 · Lesson 4.2</span>
<h2>Ch 9 — Creative strategy: implementation and evaluation</h2>
<h3>Appeals: what the message leans on</h3>
<table>
<tr><th>Type</th><th>Forms</th><th>Best when</th></tr>
<tr><td>Informational / rational</td><td>Feature, competitive advantage, favourable price, news, product popularity</td><td>High involvement; real, explainable differences</td></tr>
<tr><td>Emotional</td><td>Personal states (safety, joy, nostalgia, pride, fear) and social feelings (belonging, recognition, status)</td><td>Parity products; identity and image categories</td></tr>
<tr><td>Combined</td><td>A rational claim wrapped in an emotional story</td><td>Most real campaigns — people decide with both head and heart</td></tr>
</table>
<p><strong>Transformational advertising</strong> (William Wells) associates the experience of using the brand with psychological characteristics that would not normally be associated with it, so that the experience becomes richer, warmer or more exciting than an objective description would suggest. To work, it must make the experience richer <em>and</em> tie that experience tightly to the brand. Other appeals: <strong>reminder</strong> advertising (keep a known brand top of mind), <strong>teaser</strong> advertising (build curiosity before a launch without revealing the product) and ads based on <strong>user-generated content</strong>.</p>
<h3>Execution styles: how the message is presented</h3>
<table>
<tr><th>Style</th><th>What it looks like</th></tr>
<tr><td>Straight sell / factual</td><td>Plain presentation of product information</td></tr>
<tr><td>Scientific / technical evidence</td><td>Test results, research, endorsements from expert bodies</td></tr>
<tr><td>Demonstration</td><td>Shows the product working</td></tr>
<tr><td>Comparison</td><td>Compares with competitors (legally sensitive in Vietnam)</td></tr>
<tr><td>Testimonial</td><td>A satisfied user speaks for the brand</td></tr>
<tr><td>Slice of life</td><td>A short everyday story: a problem solved by the product</td></tr>
<tr><td>Animation</td><td>Animated characters or scenes</td></tr>
<tr><td>Personality symbol</td><td>A mascot or character that embodies the brand</td></tr>
<tr><td>Imagery</td><td>Visuals and mood rather than facts</td></tr>
<tr><td>Dramatization</td><td>A mini-drama building to the product as hero</td></tr>
<tr><td>Humour</td><td>Entertainment to win attention and liking</td></tr>
<tr><td>Combinations</td><td>For example, humour plus demonstration</td></tr>
</table>
<h3>Creative tactics</h3>
<p><strong>Print and static formats</strong> (press, posters, social images): the <strong>headline</strong> — <em>direct</em> (states the benefit) or <em>indirect</em> (provokes curiosity) — carries most of the load, because many readers see nothing else; <strong>subheads</strong> bridge to the <strong>body copy</strong>, which gives the argument; <strong>visual elements</strong> attract the eye; the <strong>layout</strong> arranges them into one path for the eye.</p>
<p><strong>Video and TV</strong>: the <strong>video</strong> (what is seen) and the <strong>audio</strong> (voice-over, dialogue, music, jingles, sound effects) must work together. Music can gain attention, set the mood, aid memory and create lasting brand associations (sonic branding). Production runs in three phases: <strong>preproduction</strong> (script, storyboard, casting, budget approval), <strong>production</strong> (the shoot) and <strong>postproduction</strong> (editing, sound, effects, versions for each medium). In digital media, assume the first seconds and a sound-off view: show the brand early.</p>
<h3>Client evaluation and approval</h3>
<p>Creative work may pass several levels of approval — brand manager, marketing director, sometimes top management and legal. Useful guidelines for evaluating it:</p>
<ol>
<li>Is it consistent with the brand's marketing and communication objectives?</li>
<li>Is it consistent with the creative strategy and the brief?</li>
<li>Is the approach appropriate for the target audience?</li>
<li>Does it communicate a clear and convincing message?</li>
<li>Does the execution overwhelm the message (people remember the joke, not the brand)?</li>
<li>Is it appropriate for the media environment in which it will appear?</li>
<li>Is it truthful, tasteful and legally compliant?</li>
</ol>
<div class="callout"><span class="badge">Watch out</span> "I don't like it" is not an evaluation. Clients should judge work against the brief and the target's viewpoint — not their personal taste — and give reasons the agency can act on.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Choose one product and sketch two ads for it: one rational, one transformational.</li>
<li>Why is the slice-of-life style so common in household products?</li>
<li>Use the seven guidelines to evaluate an ad that recently went viral. Would you approve it?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 4 · Bài 4.2</span>
<h2>Ch 9 — Chiến lược sáng tạo: thực thi và đánh giá</h2>
<h3>Lời kêu gọi: thông điệp dựa vào đâu</h3>
<table>
<tr><th>Loại</th><th>Hình thức</th><th>Phù hợp nhất khi</th></tr>
<tr><td>Thông tin / lý tính</td><td>Tính năng, lợi thế cạnh tranh, giá hời, tin tức, mức độ phổ biến của sản phẩm</td><td>Mức quan tâm cao; khác biệt có thật, giải thích được</td></tr>
<tr><td>Cảm xúc</td><td>Trạng thái cá nhân (an toàn, niềm vui, hoài niệm, tự hào, sợ hãi) và cảm xúc xã hội (được thuộc về, được công nhận, địa vị)</td><td>Sản phẩm tương đồng; ngành hàng gắn với bản sắc và hình ảnh</td></tr>
<tr><td>Kết hợp</td><td>Một tuyên bố lý tính gói trong một câu chuyện cảm xúc</td><td>Hầu hết chiến dịch thật — người ta quyết định bằng cả lý trí và cảm xúc</td></tr>
</table>
<p><strong>Quảng cáo chuyển hoá</strong> (transformational advertising — William Wells) gắn trải nghiệm dùng thương hiệu với những đặc điểm tâm lý vốn không thường gắn với nó, để trải nghiệm trở nên phong phú, ấm áp hay hào hứng hơn so với một mô tả khách quan. Muốn hiệu quả, nó phải làm trải nghiệm phong phú hơn <em>và</em> gắn chặt trải nghiệm đó với thương hiệu. Các lời kêu gọi khác: quảng cáo <strong>nhắc nhớ</strong> (giữ một thương hiệu quen thuộc luôn trong tâm trí), quảng cáo <strong>teaser</strong> (khơi tò mò trước khi ra mắt mà chưa lộ sản phẩm) và quảng cáo dựa trên <strong>nội dung do người dùng tạo ra</strong>.</p>
<h3>Phong cách thực thi: thông điệp được thể hiện thế nào</h3>
<table>
<tr><th>Phong cách</th><th>Biểu hiện</th></tr>
<tr><td>Bán hàng trực tiếp / dữ kiện</td><td>Trình bày đơn giản thông tin sản phẩm</td></tr>
<tr><td>Bằng chứng khoa học / kỹ thuật</td><td>Kết quả thử nghiệm, nghiên cứu, xác nhận của tổ chức chuyên môn</td></tr>
<tr><td>Trình diễn</td><td>Cho thấy sản phẩm hoạt động</td></tr>
<tr><td>So sánh</td><td>So với đối thủ (nhạy cảm về pháp lý tại Việt Nam)</td></tr>
<tr><td>Chứng thực</td><td>Một người dùng hài lòng nói thay cho thương hiệu</td></tr>
<tr><td>Lát cắt cuộc sống</td><td>Một câu chuyện đời thường ngắn: vấn đề được sản phẩm giải quyết</td></tr>
<tr><td>Hoạt hình</td><td>Nhân vật hoặc cảnh hoạt hình</td></tr>
<tr><td>Biểu tượng cá tính</td><td>Một linh vật hay nhân vật hiện thân của thương hiệu</td></tr>
<tr><td>Hình ảnh gợi cảm xúc</td><td>Hình ảnh và không khí thay vì dữ kiện</td></tr>
<tr><td>Kịch hoá</td><td>Một vở kịch ngắn dẫn tới sản phẩm như người hùng</td></tr>
<tr><td>Hài hước</td><td>Giải trí để giành chú ý và thiện cảm</td></tr>
<tr><td>Kết hợp</td><td>Ví dụ hài hước cộng trình diễn</td></tr>
</table>
<h3>Chiến thuật sáng tạo</h3>
<p><strong>Báo in và định dạng tĩnh</strong> (báo, poster, ảnh trên mạng xã hội): <strong>tiêu đề</strong> — <em>trực tiếp</em> (nêu lợi ích) hoặc <em>gián tiếp</em> (khơi tò mò) — gánh phần lớn nhiệm vụ, vì nhiều người đọc không xem gì khác; <strong>tiêu đề phụ</strong> dẫn sang <strong>thân bài</strong>, nơi đưa ra lập luận; <strong>yếu tố hình ảnh</strong> thu hút ánh nhìn; <strong>bố cục</strong> sắp xếp tất cả thành một đường đi duy nhất cho mắt.</p>
<p><strong>Video và truyền hình</strong>: phần <strong>hình</strong> (thứ được nhìn thấy) và phần <strong>tiếng</strong> (lời bình, lời thoại, nhạc, nhạc hiệu, hiệu ứng âm thanh) phải phối hợp với nhau. Âm nhạc có thể giành chú ý, tạo không khí, hỗ trợ ghi nhớ và tạo liên tưởng thương hiệu lâu dài (nhận diện âm thanh). Sản xuất gồm ba giai đoạn: <strong>tiền kỳ</strong> (kịch bản, storyboard, tuyển diễn viên, duyệt ngân sách), <strong>sản xuất</strong> (quay) và <strong>hậu kỳ</strong> (dựng, âm thanh, kỹ xảo, các phiên bản cho từng phương tiện). Trên phương tiện số, hãy giả định người xem chỉ xem vài giây đầu và tắt tiếng: cho thương hiệu xuất hiện sớm.</p>
<h3>Khách hàng đánh giá và duyệt</h3>
<p>Sản phẩm sáng tạo có thể qua nhiều cấp duyệt — giám đốc thương hiệu, giám đốc marketing, đôi khi ban lãnh đạo và bộ phận pháp lý. Các câu hỏi hữu ích để đánh giá:</p>
<ol>
<li>Có nhất quán với mục tiêu marketing và truyền thông của thương hiệu không?</li>
<li>Có nhất quán với chiến lược sáng tạo và bản brief không?</li>
<li>Cách tiếp cận có phù hợp với công chúng mục tiêu không?</li>
<li>Có truyền đạt một thông điệp rõ ràng và thuyết phục không?</li>
<li>Cách thể hiện có lấn át thông điệp không (người xem nhớ câu đùa mà quên thương hiệu)?</li>
<li>Có phù hợp với môi trường phương tiện nơi nó sẽ xuất hiện không?</li>
<li>Có trung thực, có văn hoá và tuân thủ pháp luật không?</li>
</ol>
<div class="callout"><span class="badge">Cẩn thận</span> "Tôi không thích" không phải là một đánh giá. Khách hàng nên đánh giá sản phẩm dựa trên brief và góc nhìn của công chúng mục tiêu — không phải sở thích cá nhân — và đưa ra lý do mà agency có thể hành động theo.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Chọn một sản phẩm và phác thảo hai quảng cáo: một lý tính, một chuyển hoá.</li>
<li>Vì sao phong cách lát cắt cuộc sống rất phổ biến ở hàng tiêu dùng gia đình?</li>
<li>Dùng bảy câu hỏi để đánh giá một quảng cáo vừa lan truyền mạnh. Bạn có duyệt nó không?</li>
</ol>`,
  ]]);

const c9q = quiz('mkt304-quiz-4', 'Quiz 4 — Creative strategy|||Quiz 4 — Chiến lược sáng tạo', [
  { id: 'q1', question: 'According to Rosser Reeves, a unique selling proposition must…|||Theo Rosser Reeves, một lợi điểm bán hàng độc nhất (USP) phải…', options: ['build an emotional image that consumers identify with|||xây dựng một hình ảnh cảm xúc mà người tiêu dùng thấy mình trong đó', 'make a specific benefit claim that competitors do not offer and that is strong enough to move the mass audience|||đưa ra một tuyên bố lợi ích cụ thể mà đối thủ không đưa ra và đủ mạnh để thúc đẩy công chúng đại chúng', 'use a celebrity to transfer cultural meanings|||dùng người nổi tiếng để chuyển giao ý nghĩa văn hoá', 'compare the brand directly with the market leader|||so sánh trực tiếp thương hiệu với bên dẫn đầu thị trường'], correctIndex: 1, explanation: 'Specific benefit, uniqueness and strength are the three conditions of a USP; the first option describes the brand-image approach.|||Lợi ích cụ thể, tính độc nhất và sức mạnh là ba điều kiện của USP; phương án đầu mô tả cách tiếp cận hình ảnh thương hiệu.' },
  { id: 'q2', question: 'An ad shows a young mother whose child spills juice on a white shirt; she uses the detergent and the stain is gone before school. This execution style is…|||Một quảng cáo cho thấy người mẹ trẻ có con làm đổ nước trái cây lên áo trắng; chị dùng bột giặt và vết bẩn biến mất trước giờ tới trường. Phong cách thực thi này là…', options: ['scientific or technical evidence|||bằng chứng khoa học hoặc kỹ thuật', 'personality symbol|||biểu tượng cá tính', 'imagery|||hình ảnh gợi cảm xúc', 'slice of life|||lát cắt cuộc sống'], correctIndex: 3, explanation: 'An everyday situation with a problem that the product solves is the classic slice-of-life format.|||Một tình huống đời thường có vấn đề được sản phẩm giải quyết là dạng lát cắt cuộc sống kinh điển.' },
  { id: 'q3', question: 'Transformational advertising works by…|||Quảng cáo chuyển hoá (transformational) hoạt động bằng cách…', options: ['making the experience of using the brand richer and warmer than an objective description would, and tying it to the brand|||làm cho trải nghiệm dùng thương hiệu phong phú, ấm áp hơn so với một mô tả khách quan, và gắn trải nghiệm đó với thương hiệu', 'listing technical features in a table|||liệt kê tính năng kỹ thuật trong một bảng', 'hiding the product until the launch date|||giấu sản phẩm cho tới ngày ra mắt', 'offering a discount coupon inside the ad|||kèm phiếu giảm giá ngay trong quảng cáo'], correctIndex: 0, explanation: 'Transformational ads change how the usage experience feels; hiding the product is a teaser, a coupon is sales promotion.|||Quảng cáo chuyển hoá thay đổi cảm nhận về trải nghiệm sử dụng; giấu sản phẩm là teaser, phiếu giảm giá là khuyến mại.' },
]);

const c10 = doc('mkt304-5-1-media-planning', '5.1 — Ch 10: Media planning and strategy|||5.1 — Ch 10: Hoạch định và chiến lược truyền thông',
  'Thuật ngữ hoạch định truyền thông (reach, frequency, GRP, TRP, effective reach/frequency, CPM, CPP, engagement), phân tích thị trường với chỉ số BDI/CDI, các quyết định chiến lược (media mix, bao phủ, lịch phát sóng continuity/flighting/pulsing, reach hay frequency), đặc điểm các phương tiện, đánh giá và theo dõi.',
  [[
    `<span class="eyebrow">MKT304 · Part 5 · Lesson 5.1</span>
<h2>Ch 10 — Media planning and strategy</h2>
<p class="lead">The best creative idea fails if the right people never see it, or see it once when it needed five exposures. Media planning decides <strong>where, when, how often and at what cost</strong> the message reaches the target.</p>
<h3>Key terms</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Media objectives / strategy</td><td>What the media plan must achieve, and the policies chosen to achieve it</td></tr>
<tr><td>Medium / media vehicle</td><td>A category (TV, social media) / a specific carrier (a named programme, a channel, an app)</td></tr>
<tr><td>Reach</td><td>Number or % of the target exposed at least once in a period</td></tr>
<tr><td>Coverage</td><td>Potential audience a medium could reach</td></tr>
<tr><td>Frequency</td><td>Average number of times those reached are exposed</td></tr>
<tr><td>Gross rating points (GRP)</td><td>Reach × average frequency — total weight of the plan; target rating points (TRP) count only the target audience</td></tr>
<tr><td>Effective reach / effective frequency</td><td>% of the target exposed enough times to have an effect / the number of exposures judged necessary</td></tr>
<tr><td>CPM</td><td>Cost per thousand exposures: cost × 1,000 / impressions</td></tr>
<tr><td>CPP (CPRP)</td><td>Cost per rating point: cost / rating points (GRP)</td></tr>
<tr><td>Engagement</td><td>How involved and attentive the audience is with the vehicle and the ad</td></tr>
</table>
<pre><code class="language-text">GRP = reach x average frequency      60% reach x 3.0 exposures  = 180 GRP
CPM = cost x 1,000 / impressions     VND 50 million / 2,000,000 = VND 25,000
CPP = cost / rating points           VND 90 million / 180 GRP   = VND 500,000 per point</code></pre>
<h3>Market analysis: to whom, where, when</h3>
<p>The planner defines the target precisely (demographics, psychographics, media habits) and analyses where sales potential lies, using two index numbers:</p>
<pre><code class="language-text">BDI = (% of brand's total sales in market / % of total population in market) x 100
CDI = (% of category's total sales in market / % of total population in market) x 100
Illustrative market A: 10% of population, 15% of brand sales, 8% of category sales
BDI = 15 / 10 x 100 = 150      CDI = 8 / 10 x 100 = 80</code></pre>
<table>
<tr><th></th><th>High CDI</th><th>Low CDI</th></tr>
<tr><td>High BDI</td><td>Good potential for brand and category — protect</td><td>Brand sells well, category is weak — monitor; maybe grow the category (market A)</td></tr>
<tr><td>Low BDI</td><td>Category strong, brand weak — opportunity if the brand's weakness can be fixed</td><td>Poor potential for both</td></tr>
</table>
<h3>Media strategy decisions</h3>
<ul>
<li><strong>Media mix</strong> — combining media lets each do what it does best (video for emotion, search for intent, OOH for local frequency).</li>
<li><strong>Target market coverage</strong> — minimise <em>waste coverage</em> (exposure to people outside the target) and avoid <em>underexposure</em>.</li>
<li><strong>Geographic coverage</strong> — where to weight spending (BDI/CDI).</li>
<li><strong>Scheduling</strong>:
<table>
<tr><th>Pattern</th><th>Description</th><th>Suits</th></tr>
<tr><td>Continuity</td><td>Steady advertising through the period</td><td>Products bought all year; strong reminder effect, but costly</td></tr>
<tr><td>Flighting</td><td>Bursts of advertising separated by periods of no advertising</td><td>Seasonal products, limited budgets; risk of forgetting between flights</td></tr>
<tr><td>Pulsing</td><td>A continuous base level plus heavier bursts at peak periods</td><td>Products sold all year with peaks (e.g., Tet, back-to-school)</td></tr>
</table></li>
<li><strong>Reach vs frequency</strong> — with a fixed budget you trade one against the other. A new launch favours reach; a complex message, a strong competitor or heavy clutter favours frequency. Joseph Ostrow grouped the factors into <strong>marketing</strong> (brand history, share, loyalty, purchase cycle), <strong>message</strong> (complexity, uniqueness, wearout, new vs continuing campaign) and <strong>media</strong> (clutter, editorial environment, attentiveness, number of media used). The "three exposures" idea associated with Herbert Krugman is a guideline, not a law.</li>
<li><strong>Creative aspects and mood</strong> — some creative needs a particular medium (a demonstration needs video) or context.</li>
<li><strong>Flexibility</strong> — the ability to react to opportunities, threats and changes in media availability.</li>
<li><strong>Budget considerations</strong> — compare vehicles on CPM and CPP, but adjust for waste coverage, the quality of the exposure (viewability, attention, engagement) and duplication between vehicles.</li>
</ul>
<h3>Characteristics of the main media</h3>
<table>
<tr><th>Medium</th><th>Strengths</th><th>Limitations</th></tr>
<tr><td>Television / online video</td><td>Sight, sound and motion; emotional impact; mass reach</td><td>High production cost; clutter; ad avoidance</td></tr>
<tr><td>Radio / audio</td><td>Low cost, local, frequency, reaches people on the move</td><td>No visuals; background listening</td></tr>
<tr><td>Magazines</td><td>Selectivity, reproduction quality, long life</td><td>Long lead times, limited reach</td></tr>
<tr><td>Newspapers</td><td>Local, timely, credible</td><td>Short life, declining print readership</td></tr>
<tr><td>Out-of-home</td><td>Local frequency, near point of purchase</td><td>Short messages, measurement problems</td></tr>
<tr><td>Digital / social / search</td><td>Targeting, interactivity, measurable response</td><td>Measurement disputes, fraud and brand-safety risks</td></tr>
</table>
<h3>Evaluation and follow-up</h3>
<p>After the campaign, compare delivered reach, frequency and GRP with the plan (post-buy analysis), check whether the media objectives were met, and feed the lessons into the next plan. Media specialist companies and programmatic tools (Ch 15) now do much of this in near real time.</p>
<div class="callout"><span class="badge">Remember</span> GRP measures weight, not effect. 300 GRP delivered as 100% reach × 3 is a very different plan from 30% reach × 10.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Why might a planner accept a higher CPM for one vehicle than for another?</li>
<li>For a Tet gift-box product, which scheduling pattern fits best? Why?</li>
<li>Interpret a market with BDI 60 and CDI 140.</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 5 · Bài 5.1</span>
<h2>Ch 10 — Hoạch định và chiến lược truyền thông</h2>
<p class="lead">Ý tưởng sáng tạo hay nhất cũng thất bại nếu đúng người không bao giờ thấy nó, hoặc chỉ thấy một lần trong khi cần năm lần tiếp xúc. Hoạch định truyền thông quyết định thông điệp tới công chúng mục tiêu <strong>ở đâu, khi nào, bao nhiêu lần và với chi phí bao nhiêu</strong>.</p>
<h3>Thuật ngữ then chốt</h3>
<table>
<tr><th>Thuật ngữ</th><th>Ý nghĩa</th></tr>
<tr><td>Mục tiêu / chiến lược truyền thông</td><td>Điều kế hoạch truyền thông phải đạt được, và các chính sách được chọn để đạt nó</td></tr>
<tr><td>Phương tiện / kênh cụ thể (vehicle)</td><td>Một loại (truyền hình, mạng xã hội) / một kênh mang cụ thể (một chương trình, một kênh, một ứng dụng)</td></tr>
<tr><td>Reach (độ phủ)</td><td>Số người hoặc % công chúng mục tiêu tiếp xúc ít nhất một lần trong một kỳ</td></tr>
<tr><td>Coverage (vùng phủ tiềm năng)</td><td>Khán giả tiềm năng mà một phương tiện có thể tiếp cận</td></tr>
<tr><td>Frequency (tần suất)</td><td>Số lần tiếp xúc trung bình của những người đã được tiếp cận</td></tr>
<tr><td>Tổng điểm rating (GRP)</td><td>Reach × tần suất trung bình — tổng trọng lượng của kế hoạch; TRP (target rating points) chỉ tính công chúng mục tiêu</td></tr>
<tr><td>Reach hiệu quả / tần suất hiệu quả</td><td>% công chúng mục tiêu tiếp xúc đủ số lần để có tác dụng / số lần tiếp xúc được coi là cần thiết</td></tr>
<tr><td>CPM</td><td>Chi phí cho một nghìn lần tiếp xúc: chi phí × 1.000 / số lần hiển thị</td></tr>
<tr><td>CPP (CPRP)</td><td>Chi phí cho một điểm rating: chi phí / số điểm rating (GRP)</td></tr>
<tr><td>Engagement (mức gắn kết)</td><td>Mức độ khán giả tham gia và chú ý tới kênh và quảng cáo</td></tr>
</table>
<pre><code class="language-text">GRP = reach x tần suất trung bình     reach 60% x 3,0 lần         = 180 GRP
CPM = chi phí x 1.000 / số hiển thị   50 triệu đồng / 2.000.000   = 25.000 đồng
CPP = chi phí / số điểm rating        90 triệu đồng / 180 GRP     = 500.000 đồng mỗi điểm</code></pre>
<h3>Phân tích thị trường: cho ai, ở đâu, khi nào</h3>
<p>Người hoạch định xác định chính xác công chúng mục tiêu (nhân khẩu học, tâm lý học, thói quen dùng phương tiện) và phân tích tiềm năng doanh số nằm ở đâu, bằng hai chỉ số:</p>
<pre><code class="language-text">BDI = (% doanh số của thương hiệu tại thị trường / % dân số tại thị trường) x 100
CDI = (% doanh số của ngành hàng tại thị trường / % dân số tại thị trường) x 100
Thị trường A (minh hoạ): 10% dân số, 15% doanh số thương hiệu, 8% doanh số ngành hàng
BDI = 15 / 10 x 100 = 150      CDI = 8 / 10 x 100 = 80</code></pre>
<table>
<tr><th></th><th>CDI cao</th><th>CDI thấp</th></tr>
<tr><td>BDI cao</td><td>Tiềm năng tốt cho cả thương hiệu và ngành hàng — bảo vệ</td><td>Thương hiệu bán tốt, ngành hàng yếu — theo dõi; có thể phát triển ngành hàng (thị trường A)</td></tr>
<tr><td>BDI thấp</td><td>Ngành hàng mạnh, thương hiệu yếu — cơ hội nếu khắc phục được điểm yếu của thương hiệu</td><td>Tiềm năng kém cho cả hai</td></tr>
</table>
<h3>Các quyết định chiến lược truyền thông</h3>
<ul>
<li><strong>Media mix</strong> — kết hợp phương tiện để mỗi loại làm điều nó làm tốt nhất (video cho cảm xúc, tìm kiếm cho ý định mua, quảng cáo ngoài trời cho tần suất tại chỗ).</li>
<li><strong>Bao phủ thị trường mục tiêu</strong> — giảm <em>phủ lãng phí</em> (tiếp xúc với người ngoài mục tiêu) và tránh <em>tiếp xúc không đủ</em>.</li>
<li><strong>Bao phủ địa lý</strong> — dồn chi tiêu vào đâu (BDI/CDI).</li>
<li><strong>Lịch phát sóng</strong>:
<table>
<tr><th>Mô hình</th><th>Mô tả</th><th>Phù hợp</th></tr>
<tr><td>Liên tục (continuity)</td><td>Quảng cáo đều đặn suốt kỳ</td><td>Sản phẩm mua quanh năm; nhắc nhớ mạnh nhưng tốn kém</td></tr>
<tr><td>Theo đợt (flighting)</td><td>Các đợt quảng cáo xen giữa những khoảng không quảng cáo</td><td>Sản phẩm theo mùa, ngân sách hạn chế; rủi ro bị quên giữa các đợt</td></tr>
<tr><td>Nhịp đập (pulsing)</td><td>Một mức nền liên tục cộng các đợt dồn mạnh vào mùa cao điểm</td><td>Sản phẩm bán quanh năm có mùa cao điểm (ví dụ Tết, mùa tựu trường)</td></tr>
</table></li>
<li><strong>Reach hay frequency</strong> — với ngân sách cố định, tăng cái này thì phải giảm cái kia. Ra mắt sản phẩm mới ưu tiên reach; thông điệp phức tạp, đối thủ mạnh hoặc nhiễu quảng cáo cao ưu tiên frequency. Joseph Ostrow nhóm các yếu tố thành <strong>marketing</strong> (lịch sử thương hiệu, thị phần, mức trung thành, chu kỳ mua), <strong>thông điệp</strong> (độ phức tạp, tính độc đáo, độ nhàm, chiến dịch mới hay tiếp nối) và <strong>phương tiện</strong> (nhiễu, môi trường nội dung, mức chú ý, số loại phương tiện dùng). Ý tưởng "ba lần tiếp xúc" gắn với Herbert Krugman là một nguyên tắc tham khảo, không phải định luật.</li>
<li><strong>Yếu tố sáng tạo và không khí</strong> — một số ý tưởng cần một phương tiện nhất định (trình diễn cần video) hoặc một bối cảnh nhất định.</li>
<li><strong>Tính linh hoạt</strong> — khả năng phản ứng với cơ hội, đe doạ và thay đổi về khả năng mua phương tiện.</li>
<li><strong>Cân nhắc ngân sách</strong> — so sánh các kênh bằng CPM và CPP, nhưng điều chỉnh theo phủ lãng phí, chất lượng lần tiếp xúc (khả năng hiển thị, sự chú ý, gắn kết) và sự trùng lặp giữa các kênh.</li>
</ul>
<h3>Đặc điểm các phương tiện chính</h3>
<table>
<tr><th>Phương tiện</th><th>Điểm mạnh</th><th>Hạn chế</th></tr>
<tr><td>Truyền hình / video trực tuyến</td><td>Hình, tiếng và chuyển động; tác động cảm xúc; phủ đại chúng</td><td>Chi phí sản xuất cao; nhiễu; người xem né tránh</td></tr>
<tr><td>Phát thanh / âm thanh</td><td>Chi phí thấp, địa phương, tần suất, tiếp cận người đang di chuyển</td><td>Không có hình; nghe như âm thanh nền</td></tr>
<tr><td>Tạp chí</td><td>Chọn lọc, chất lượng in, đời sống dài</td><td>Thời gian đặt chỗ dài, độ phủ hạn chế</td></tr>
<tr><td>Báo</td><td>Địa phương, kịp thời, đáng tin</td><td>Đời sống ngắn, lượng đọc báo in giảm</td></tr>
<tr><td>Ngoài trời</td><td>Tần suất tại chỗ, gần điểm mua</td><td>Thông điệp ngắn, khó đo lường</td></tr>
<tr><td>Số / mạng xã hội / tìm kiếm</td><td>Nhắm chọn, tương tác, đo được phản hồi</td><td>Tranh cãi về đo lường, rủi ro gian lận và an toàn thương hiệu</td></tr>
</table>
<h3>Đánh giá và theo dõi</h3>
<p>Sau chiến dịch, so reach, frequency và GRP thực tế với kế hoạch (phân tích sau khi mua), kiểm tra mục tiêu truyền thông có đạt không, và đưa bài học vào kế hoạch sau. Các công ty chuyên về phương tiện và công cụ programmatic (Ch 15) nay làm phần lớn việc này gần như theo thời gian thực.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> GRP đo trọng lượng, không đo hiệu quả. 300 GRP đạt được bằng reach 100% × 3 lần là một kế hoạch rất khác so với reach 30% × 10 lần.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Vì sao người hoạch định có thể chấp nhận CPM cao hơn ở kênh này so với kênh khác?</li>
<li>Với sản phẩm hộp quà Tết, mô hình lịch nào phù hợp nhất? Vì sao?</li>
<li>Diễn giải một thị trường có BDI 60 và CDI 140.</li>
</ol>`,
  ]]);

const c10e = doc('mkt304-5-2-exercise', 'Exercise 2 — media math: GRP, reach, frequency, CPM and CPP|||Bài tập 2 — toán truyền thông: GRP, reach, frequency, CPM và CPP',
  'Bài tập: lịch quảng cáo giả định trên ba kênh (truyền hình, video trực tuyến, mạng xã hội) cho LumaTea — tính GRP, tần suất trung bình, CPM, CPP từng kênh và toàn kế hoạch, so hiệu quả chi phí và phân tích việc chuyển ngân sách; kèm lời giải.',
  [[
    `<span class="eyebrow">MKT304 · Part 5 · Exercise 2</span>
<h2>Exercise 2 — is the LumaTea launch plan heavy enough?</h2>
<div class="callout"><span class="badge">Problem</span> Target audience: 2,000,000 people aged 18–24 in Ho Chi Minh City (illustrative). Four-week launch flight. (1) TV: 12 spots with an average target rating of 6, at VND 40 million per spot. (2) Online video: 3,000,000 on-target impressions at a CPM of VND 60,000. (3) Social feed ads: 4,000,000 on-target impressions at a CPM of VND 40,000. The planner's tool estimates reach of 45% (TV), 50% (online video), 40% (social) and a net, unduplicated reach of 70% for the whole plan. (a) Compute GRP, cost, CPM and CPP for each channel. (b) Compute total GRP, cost, blended CPM and CPP. (c) Compute average frequency per channel and for the plan. (d) The brand manager proposes moving 3 TV spots to online video at the same CPM. What happens to GRP? Would you do it?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) TV:     GRP  = 12 x 6 = 72
            cost = 12 x 40 = VND 480 million
            impressions = 72% x 2,000,000 = 1,440,000
            CPM  = 480,000,000 x 1,000 / 1,440,000 = VND 333,333
            CPP  = 480 / 72 = VND 6.67 million per point
    Video:  cost = 3,000,000 / 1,000 x 60,000 = VND 180 million
            GRP  = 3,000,000 / 2,000,000 x 100 = 150
            CPP  = 180 / 150 = VND 1.2 million
    Social: cost = 4,000,000 / 1,000 x 40,000 = VND 160 million
            GRP  = 4,000,000 / 2,000,000 x 100 = 200
            CPP  = 160 / 200 = VND 0.8 million

(b) Total GRP  = 72 + 150 + 200 = 422
    Total cost = 480 + 180 + 160 = VND 820 million
    Impressions = 1,440,000 + 3,000,000 + 4,000,000 = 8,440,000
    Blended CPM = 820,000,000 x 1,000 / 8,440,000 = VND 97,156
    Blended CPP = 820 / 422 = VND 1.94 million

(c) Average frequency = GRP / reach
    TV 72 / 45 = 1.6    Video 150 / 50 = 3.0    Social 200 / 40 = 5.0
    Plan 422 / 70 = 6.0

(d) 3 spots = 3 x 40 = VND 120 million
    TV loses 3 x 6 = 18 GRP
    Video gains 120,000,000 / 60,000 x 1,000 = 2,000,000 impressions = 100 GRP
    New total = 422 - 18 + 100 = 504 GRP</code></pre>
<p><strong>Why:</strong> on paper, digital is far cheaper per point, so the shift adds 82 GRP. But the comparison is not like for like: a TV exposure is usually full-screen with sound, while a digital impression may be scrolled past in a second; digital GRP assume every impression is on target and viewable. An average frequency of 6.0 also hides the distribution — social delivers 5.0 exposures to only 40% of the target, so heavy users may see the ad many times while others see it once. Before shifting, ask for viewability and attention data and for the frequency distribution (effective reach at 3+). A reasonable answer: move part of the budget, keep TV for launch reach, and cap frequency on social.</p>`,
    `<span class="eyebrow">MKT304 · Phần 5 · Bài tập 2</span>
<h2>Bài tập 2 — kế hoạch ra mắt LumaTea đã đủ "nặng" chưa?</h2>
<div class="callout"><span class="badge">Đề</span> Công chúng mục tiêu: 2.000.000 người 18–24 tuổi tại TP. Hồ Chí Minh (minh hoạ). Đợt ra mắt kéo dài bốn tuần. (1) Truyền hình: 12 spot với rating mục tiêu trung bình 6, giá 40 triệu đồng mỗi spot. (2) Video trực tuyến: 3.000.000 lượt hiển thị đúng mục tiêu với CPM 60.000 đồng. (3) Quảng cáo trên bảng tin mạng xã hội: 4.000.000 lượt hiển thị đúng mục tiêu với CPM 40.000 đồng. Công cụ của người hoạch định ước tính reach 45% (truyền hình), 50% (video trực tuyến), 40% (mạng xã hội) và reach ròng không trùng lặp của cả kế hoạch là 70%. (a) Tính GRP, chi phí, CPM và CPP của từng kênh. (b) Tính tổng GRP, tổng chi phí, CPM và CPP bình quân. (c) Tính tần suất trung bình của từng kênh và của cả kế hoạch. (d) Giám đốc thương hiệu đề xuất chuyển 3 spot truyền hình sang video trực tuyến với cùng CPM. GRP thay đổi thế nào? Bạn có làm vậy không?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Truyền hình: GRP = 12 x 6 = 72
                 chi phí = 12 x 40 = 480 triệu đồng
                 số hiển thị = 72% x 2.000.000 = 1.440.000
                 CPM = 480.000.000 x 1.000 / 1.440.000 = 333.333 đồng
                 CPP = 480 / 72 = 6,67 triệu đồng mỗi điểm
    Video:       chi phí = 3.000.000 / 1.000 x 60.000 = 180 triệu đồng
                 GRP = 3.000.000 / 2.000.000 x 100 = 150
                 CPP = 180 / 150 = 1,2 triệu đồng
    Mạng xã hội: chi phí = 4.000.000 / 1.000 x 40.000 = 160 triệu đồng
                 GRP = 4.000.000 / 2.000.000 x 100 = 200
                 CPP = 160 / 200 = 0,8 triệu đồng

(b) Tổng GRP     = 72 + 150 + 200 = 422
    Tổng chi phí = 480 + 180 + 160 = 820 triệu đồng
    Số hiển thị  = 1.440.000 + 3.000.000 + 4.000.000 = 8.440.000
    CPM bình quân = 820.000.000 x 1.000 / 8.440.000 = 97.156 đồng
    CPP bình quân = 820 / 422 = 1,94 triệu đồng

(c) Tần suất trung bình = GRP / reach
    Truyền hình 72 / 45 = 1,6   Video 150 / 50 = 3,0   Mạng xã hội 200 / 40 = 5,0
    Cả kế hoạch 422 / 70 = 6,0

(d) 3 spot = 3 x 40 = 120 triệu đồng
    Truyền hình mất 3 x 6 = 18 GRP
    Video thêm 120.000.000 / 60.000 x 1.000 = 2.000.000 lượt hiển thị = 100 GRP
    Tổng mới = 422 - 18 + 100 = 504 GRP</code></pre>
<p><strong>Vì sao:</strong> trên giấy, kênh số rẻ hơn nhiều tính theo mỗi điểm, nên việc chuyển thêm 82 GRP. Nhưng phép so sánh không tương đương: một lần tiếp xúc truyền hình thường chiếm trọn màn hình và có tiếng, còn một lượt hiển thị số có thể bị lướt qua trong một giây; GRP số giả định mọi lượt hiển thị đều đúng mục tiêu và nhìn thấy được. Tần suất trung bình 6,0 cũng che giấu sự phân bố — mạng xã hội cho 5,0 lần tiếp xúc nhưng chỉ tới 40% công chúng mục tiêu, nên người dùng nhiều có thể thấy quảng cáo rất nhiều lần trong khi người khác chỉ thấy một lần. Trước khi chuyển, hãy yêu cầu dữ liệu về khả năng hiển thị, mức chú ý và phân bố tần suất (reach hiệu quả ở mức 3+). Câu trả lời hợp lý: chuyển một phần ngân sách, giữ truyền hình để có reach lúc ra mắt, và giới hạn tần suất trên mạng xã hội.</p>`,
  ]]);

const c11 = doc('mkt304-5-3-support-media', '5.3 — Ch 13: Support media — out-of-home, promotional products, placement & branded entertainment|||5.3 — Ch 13: Phương tiện hỗ trợ — ngoài trời, quà tặng quảng cáo, product placement & branded entertainment',
  'Phương tiện hỗ trợ truyền thống (quảng cáo ngoài trời, quá cảnh, ngoài trời kỹ thuật số, quà tặng quảng cáo, quảng cáo tại điểm bán) và phi truyền thống (product placement, lồng ghép thương hiệu, branded entertainment, continuum của Hudson & Hudson), ưu nhược điểm và vấn đề đo lường, công khai.',
  [[
    `<span class="eyebrow">MKT304 · Part 5 · Lesson 5.3</span>
<h2>Ch 13 — Support media</h2>
<p class="lead">Support media reach people where mass media cannot, reinforce the main message, and often sit close to the moment of purchase. They are also called alternative or nontraditional media.</p>
<h3>Traditional support media</h3>
<p><strong>Out-of-home (OOH)</strong> covers billboards, street furniture (bus shelters, kiosks), <strong>transit</strong> advertising (inside and outside buses, stations, airports), place-based media (screens in lifts, malls, cinemas, campuses) and <strong>digital out-of-home</strong> (screens whose content can change by time of day or be bought programmatically).</p>
<table>
<tr><th>Strengths of OOH</th><th>Limitations of OOH</th></tr>
<tr><td>Wide local coverage and high frequency along daily routes</td><td>Very short messages — often under seven words</td></tr>
<tr><td>Geographic flexibility; near the point of purchase</td><td>Waste coverage; hard to target precisely</td></tr>
<tr><td>Large, creative formats; always on</td><td>Wearout; audience measurement is less precise</td></tr>
<tr><td>Low cost per exposure</td><td>Image problems (visual clutter) and local permits</td></tr>
</table>
<p><strong>Promotional products (specialty advertising)</strong> — useful items carrying the brand name, given free: pens, tote bags, calendars, water bottles, T-shirts. Strengths: selectivity, flexibility, repeated exposure each time the item is used, goodwill and good recall; limitations: image (cheap "junk"), saturation, and long lead times. <strong>In-store media</strong> — displays, shelf talkers, floor graphics, in-store screens and retail media on e-commerce platforms — reach shoppers at the moment of choice.</p>
<h3>Nontraditional support media: branded entertainment</h3>
<ul>
<li><strong>Product placement</strong> — the brand appears in a film, TV show, music video or game, paid or in exchange for products. Placements can be visual, verbal or integrated into the scene.</li>
<li><strong>Product integration</strong> — the brand becomes part of the storyline (characters use and talk about it).</li>
<li><strong>Branded entertainment / advertainment</strong> — content created or co-produced by the brand, such as a web series, a short film, a game or an event built around the brand.</li>
<li><strong>Content sponsorship</strong> and in-game advertising.</li>
</ul>
<p>Hudson and Hudson describe a <strong>continuum</strong>: at one end, <em>product placement</em> where the brand sits in the background with little integration; in the middle, <em>brand integration</em> where it plays a role in the plot; at the other end, <em>branded entertainment</em> where the content exists because of the brand and the brand is central to it.</p>
<pre><code class="language-text">PRODUCT PLACEMENT ---------- BRAND INTEGRATION ---------- BRANDED ENTERTAINMENT
brand in background          brand in the storyline        content built around the brand
low integration, low control                               high integration, high control, high cost</code></pre>
<table>
<tr><th>Advantages</th><th>Disadvantages</th></tr>
<tr><td>Exposure to audiences who skip ads; long life (reruns, streaming)</td><td>High cost and long production times</td></tr>
<tr><td>Source association — the brand borrows the programme's or star's image</td><td>Limited exposure time and lack of control over how the brand is shown</td></tr>
<tr><td>Supports other media; can be very memorable</td><td>Audience backlash if it feels forced or deceptive</td></tr>
<tr><td>Natural context of use</td><td>Clutter as placements multiply; hard to measure</td></tr>
</table>
<p><strong>Disclosure.</strong> Because placements blur the line between content and advertising, regulators and platforms increasingly require that paid brand content be identifiable as such. In Vietnam, advertising placed inside content is still subject to the advertising law — check the current rules (Part 8).</p>
<h3>Other support media</h3>
<p>Cinema advertising, in-flight media, guerrilla or ambient marketing (unexpected placements in public spaces), and events. <strong>Measuring</strong> support media is their common weakness: planners combine traffic or footfall estimates, recall surveys, QR-code scans, promo codes and geo-based lift studies.</p>
<div class="callout"><span class="badge">IMC link</span> Support media rarely carry a campaign alone. Their value is to add frequency, location and context to the big idea carried by the main media.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Design a digital OOH message that changes between morning and evening for a coffee brand.</li>
<li>Where on the Hudson continuum would you place a brand's own web drama? A logo on a table in a film?</li>
<li>Should product placement always be disclosed? Argue both sides.</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 5 · Bài 5.3</span>
<h2>Ch 13 — Phương tiện hỗ trợ</h2>
<p class="lead">Phương tiện hỗ trợ tiếp cận người ta ở những nơi phương tiện đại chúng không tới được, củng cố thông điệp chính, và thường nằm sát thời điểm mua. Chúng còn được gọi là phương tiện thay thế hay phương tiện phi truyền thống.</p>
<h3>Phương tiện hỗ trợ truyền thống</h3>
<p><strong>Quảng cáo ngoài trời (OOH)</strong> gồm biển quảng cáo tấm lớn, vật dụng đường phố (nhà chờ xe buýt, ki-ốt), quảng cáo <strong>trên phương tiện giao thông</strong> (trong và ngoài xe buýt, nhà ga, sân bay), phương tiện theo địa điểm (màn hình trong thang máy, trung tâm thương mại, rạp phim, trường học) và <strong>ngoài trời kỹ thuật số</strong> (màn hình có thể đổi nội dung theo giờ hoặc được mua theo phương thức programmatic).</p>
<table>
<tr><th>Điểm mạnh của OOH</th><th>Hạn chế của OOH</th></tr>
<tr><td>Phủ rộng tại địa phương và tần suất cao dọc lộ trình hằng ngày</td><td>Thông điệp rất ngắn — thường dưới bảy chữ</td></tr>
<tr><td>Linh hoạt địa lý; gần điểm mua</td><td>Phủ lãng phí; khó nhắm chọn chính xác</td></tr>
<tr><td>Định dạng lớn, sáng tạo; hiện diện liên tục</td><td>Nhanh nhàm; đo lường khán giả kém chính xác</td></tr>
<tr><td>Chi phí mỗi lần tiếp xúc thấp</td><td>Vấn đề hình ảnh (rối mắt đô thị) và giấy phép địa phương</td></tr>
</table>
<p><strong>Quà tặng quảng cáo (specialty advertising)</strong> — đồ dùng hữu ích mang tên thương hiệu, tặng miễn phí: bút, túi vải, lịch, bình nước, áo thun. Điểm mạnh: chọn lọc, linh hoạt, tiếp xúc lặp lại mỗi lần món đồ được dùng, thiện cảm và khả năng ghi nhớ tốt; hạn chế: hình ảnh ("đồ rẻ tiền"), bão hoà và thời gian chuẩn bị dài. <strong>Phương tiện tại điểm bán</strong> — kệ trưng bày, bảng nhỏ gắn kệ, decal sàn, màn hình trong cửa hàng và quảng cáo trên sàn thương mại điện tử (retail media) — tiếp cận người mua ngay lúc lựa chọn.</p>
<h3>Phương tiện hỗ trợ phi truyền thống: branded entertainment</h3>
<ul>
<li><strong>Product placement (đặt sản phẩm)</strong> — thương hiệu xuất hiện trong phim, chương trình truyền hình, MV hay trò chơi, có trả phí hoặc đổi bằng sản phẩm. Có thể xuất hiện bằng hình, bằng lời hoặc được lồng vào cảnh.</li>
<li><strong>Lồng ghép sản phẩm</strong> — thương hiệu trở thành một phần của mạch truyện (nhân vật dùng và nói về nó).</li>
<li><strong>Branded entertainment / advertainment</strong> — nội dung do thương hiệu tạo ra hoặc đồng sản xuất, như một web drama, phim ngắn, trò chơi hay sự kiện xây quanh thương hiệu.</li>
<li><strong>Tài trợ nội dung</strong> và quảng cáo trong trò chơi.</li>
</ul>
<p>Hudson và Hudson mô tả một <strong>dải liên tục</strong> (continuum): ở một đầu là <em>product placement</em>, thương hiệu nằm ở hậu cảnh, ít được lồng ghép; ở giữa là <em>lồng ghép thương hiệu</em>, thương hiệu có vai trò trong mạch truyện; ở đầu kia là <em>branded entertainment</em>, nội dung tồn tại vì thương hiệu và thương hiệu là trung tâm.</p>
<pre><code class="language-text">PRODUCT PLACEMENT ---------- LỒNG GHÉP THƯƠNG HIỆU ---------- BRANDED ENTERTAINMENT
thương hiệu ở hậu cảnh       thương hiệu trong mạch truyện      nội dung xây quanh thương hiệu
lồng ghép thấp, kiểm soát thấp                        lồng ghép cao, kiểm soát cao, chi phí cao</code></pre>
<table>
<tr><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td>Tiếp cận khán giả hay bỏ qua quảng cáo; đời sống dài (phát lại, xem trực tuyến)</td><td>Chi phí cao và thời gian sản xuất dài</td></tr>
<tr><td>Liên tưởng nguồn — thương hiệu mượn hình ảnh của chương trình hay ngôi sao</td><td>Thời gian xuất hiện ngắn và không kiểm soát được cách thương hiệu được thể hiện</td></tr>
<tr><td>Hỗ trợ phương tiện khác; có thể rất dễ nhớ</td><td>Khán giả phản ứng nếu thấy gượng ép hoặc lừa dối</td></tr>
<tr><td>Bối cảnh sử dụng tự nhiên</td><td>Nhiễu khi placement ngày càng nhiều; khó đo lường</td></tr>
</table>
<p><strong>Công khai.</strong> Vì placement làm mờ ranh giới giữa nội dung và quảng cáo, cơ quan quản lý và các nền tảng ngày càng yêu cầu nội dung thương hiệu trả phí phải nhận diện được là quảng cáo. Tại Việt Nam, quảng cáo lồng trong nội dung vẫn chịu sự điều chỉnh của pháp luật về quảng cáo — kiểm quy định đang có hiệu lực (Phần 8).</p>
<h3>Các phương tiện hỗ trợ khác</h3>
<p>Quảng cáo tại rạp chiếu phim, trên máy bay, guerrilla hay ambient marketing (xuất hiện bất ngờ ở không gian công cộng), và sự kiện. <strong>Đo lường</strong> là điểm yếu chung của phương tiện hỗ trợ: người hoạch định kết hợp ước tính lưu lượng người qua lại, khảo sát ghi nhớ, lượt quét mã QR, mã khuyến mại và nghiên cứu mức tăng theo vùng địa lý.</p>
<div class="callout"><span class="badge">Liên kết IMC</span> Phương tiện hỗ trợ hiếm khi tự gánh một chiến dịch. Giá trị của chúng là thêm tần suất, địa điểm và bối cảnh cho ý tưởng lớn mà phương tiện chính mang đi.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Thiết kế một thông điệp ngoài trời kỹ thuật số thay đổi giữa buổi sáng và buổi tối cho một thương hiệu cà phê.</li>
<li>Web drama của chính thương hiệu nằm ở đâu trên dải Hudson? Một logo trên mặt bàn trong phim thì sao?</li>
<li>Product placement có luôn phải được công khai không? Lập luận cả hai phía.</li>
</ol>`,
  ]]);

const c11q = quiz('mkt304-quiz-5', 'Quiz 5 — Media planning & support media|||Quiz 5 — Hoạch định truyền thông & phương tiện hỗ trợ', [
  { id: 'q1', question: 'A plan reaches 40% of the target with an average frequency of 3.5. Its GRP is…|||Một kế hoạch tiếp cận 40% công chúng mục tiêu với tần suất trung bình 3,5. GRP của nó là…', options: ['11.4|||11,4', '43.5|||43,5', '140|||140', '1,400|||1.400'], correctIndex: 2, explanation: 'GRP = reach x frequency = 40 x 3.5 = 140.|||GRP = reach x tần suất = 40 x 3,5 = 140.' },
  { id: 'q2', question: 'A brand keeps a low level of advertising all year and adds heavy bursts before Tet and back-to-school. This scheduling pattern is…|||Một thương hiệu duy trì mức quảng cáo thấp quanh năm và dồn mạnh trước Tết và mùa tựu trường. Mô hình lịch này là…', options: ['continuity|||liên tục (continuity)', 'flighting|||theo đợt (flighting)', 'roadblocking|||phủ kín khung giờ (roadblocking)', 'pulsing|||nhịp đập (pulsing)'], correctIndex: 3, explanation: 'Pulsing combines a continuous base with heavier bursts; flighting has periods with no advertising at all.|||Pulsing kết hợp mức nền liên tục với các đợt dồn mạnh; flighting có những khoảng hoàn toàn không quảng cáo.' },
  { id: 'q3', question: 'A beverage brand co-produces a web series whose plot is built around its cafe chain. On the Hudson and Hudson continuum this is closest to…|||Một thương hiệu đồ uống đồng sản xuất một web series có mạch truyện xây quanh chuỗi quán của mình. Trên dải liên tục của Hudson và Hudson, đây gần nhất với…', options: ['branded entertainment|||branded entertainment', 'simple product placement|||product placement đơn thuần', 'a promotional product|||quà tặng quảng cáo', 'transit advertising|||quảng cáo trên phương tiện giao thông'], correctIndex: 0, explanation: 'When the content exists because of the brand and the brand is central to it, it sits at the branded-entertainment end.|||Khi nội dung tồn tại vì thương hiệu và thương hiệu là trung tâm, nó nằm ở đầu branded entertainment.' },
]);

const c12 = doc('mkt304-6-1-international', '6.1 — Ch 19: International advertising and promotion|||6.1 — Ch 19: Quảng cáo và xúc tiến quốc tế',
  'Vì sao xúc tiến quốc tế quan trọng, bốn môi trường quốc tế (kinh tế, nhân khẩu, văn hoá, chính trị – pháp luật), tranh luận toàn cầu hoá và địa phương hoá (Levitt), “think globally, act locally”, các quyết định tổ chức, agency, sáng tạo, phương tiện và phối thức xúc tiến quốc tế.',
  [[
    `<span class="eyebrow">MKT304 · Part 6 · Lesson 6.1</span>
<h2>Ch 19 — International advertising and promotion</h2>
<h3>Why international IMC matters</h3>
<p>Domestic markets saturate, trade barriers fall, digital platforms cross borders and many brands — including Vietnamese brands of coffee, food, fashion and technology — now sell abroad. Selling abroad means communicating in environments that differ from home in ways that are easy to underestimate.</p>
<h3>The international environment</h3>
<table>
<tr><th>Environment</th><th>What differs</th><th>IMC consequence</th></tr>
<tr><td>Economic</td><td>Income, development level, media infrastructure, retail structure</td><td>Which media exist and what people can afford</td></tr>
<tr><td>Demographic</td><td>Age structure, household size, urbanisation</td><td>Target size and life-stage messages</td></tr>
<tr><td>Cultural</td><td>Language, values, religion, customs, colours, symbols, humour; high- vs low-context communication (Edward T. Hall); value dimensions (e.g., Hofstede)</td><td>Translation errors, offensive imagery, appeals that do not travel</td></tr>
<tr><td>Political / legal</td><td>Banned product categories, rules on comparative ads, advertising to children, pre-approval of content, language requirements, limits on promotions</td><td>An execution legal at home may be illegal abroad (Vietnam, for example, requires Vietnamese-language content with limited exceptions)</td></tr>
</table>
<p>In <strong>high-context</strong> cultures much meaning is carried by context, relationships and non-verbal cues, so indirect, image-rich messages work well; in <strong>low-context</strong> cultures meaning is carried by explicit words, so direct claims and detail are expected.</p>
<h3>Global vs localized advertising</h3>
<p>Theodore Levitt (1983) argued that technology was homogenising consumer needs worldwide, so firms should sell standardized products with standardized marketing. The debate continues:</p>
<table>
<tr><th>Case for standardization (global)</th><th>Case for localization</th></tr>
<tr><td>Economies of scale in production, creative and media</td><td>Needs, usage and purchase motives differ between countries</td></tr>
<tr><td>Consistent brand image for travelling and online consumers</td><td>Cultural differences in language, values and humour</td></tr>
<tr><td>A good idea can be exploited everywhere</td><td>Media availability and costs differ</td></tr>
<tr><td>Easier coordination and control</td><td>Legal restrictions differ</td></tr>
<tr><td>Global media and platforms make it possible</td><td>Local managers resist ideas "not invented here"</td></tr>
</table>
<p>Standardization fits best when needs are universal, when the brand appeals to <strong>global segments</strong> (teenagers, business travellers, luxury buyers) or when the product is "high-tech" or "high-touch". Most firms choose a middle path — <strong>"think globally, act locally"</strong>: a global strategy and big idea, adapted executions (language, casting, settings, offers). A related tactic is the <strong>prototype</strong> or pattern approach: one master campaign with guidelines that local teams adapt.</p>
<h3>Decision areas</h3>
<ul>
<li><strong>Organization</strong> — centralized (headquarters decides), decentralized (local subsidiaries decide) or a combination.</li>
<li><strong>Agency selection</strong> — an international agency network with local offices, a domestic agency with international partners, or local agencies in each market.</li>
<li><strong>Research</strong> — secondary data is uneven across countries; primary research may be needed and must be culturally valid.</li>
<li><strong>Creative decisions</strong> — how much to adapt; back-translation to catch errors; testing in each market.</li>
<li><strong>Media selection</strong> — availability, cost, coverage and measurement vary; global platforms coexist with strong local media.</li>
<li><strong>The international promotional mix</strong> — sales promotion rules (premiums, lucky draws, contests) differ widely; personal selling depends on local culture; PR must handle local media and stakeholders; digital must follow local data and platform rules.</li>
</ul>
<p><strong>Illustration (fictional):</strong> a Vietnamese specialty-coffee brand entering Japan might keep its global idea — "the courage of Vietnamese coffee" — while adapting the execution: more product detail and craftsmanship for a detail-oriented market, local packaging sizes, and no humour that depends on Vietnamese wordplay.</p>
<div class="callout"><span class="badge">Remember</span> Standardize what is strategic (positioning, brand identity, the big idea); localize what is executional (language, casting, offers, media) — and check the law in every market.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Which of your favourite brands advertise in the same way in every country? Why can they?</li>
<li>Give an example of an appeal that might work in a high-context culture but fail in a low-context one.</li>
<li>What would you have to check before running a Vietnamese promotion format in another country?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 6 · Bài 6.1</span>
<h2>Ch 19 — Quảng cáo và xúc tiến quốc tế</h2>
<h3>Vì sao IMC quốc tế quan trọng</h3>
<p>Thị trường nội địa bão hoà, rào cản thương mại giảm, nền tảng số vượt biên giới và nhiều thương hiệu — kể cả thương hiệu Việt Nam về cà phê, thực phẩm, thời trang, công nghệ — nay bán ra nước ngoài. Bán ra nước ngoài nghĩa là truyền thông trong những môi trường khác quê nhà theo những cách rất dễ bị đánh giá thấp.</p>
<h3>Môi trường quốc tế</h3>
<table>
<tr><th>Môi trường</th><th>Điểm khác biệt</th><th>Hệ quả với IMC</th></tr>
<tr><td>Kinh tế</td><td>Thu nhập, trình độ phát triển, hạ tầng truyền thông, cấu trúc bán lẻ</td><td>Phương tiện nào tồn tại và người dân mua được gì</td></tr>
<tr><td>Nhân khẩu học</td><td>Cơ cấu tuổi, quy mô hộ, đô thị hoá</td><td>Quy mô mục tiêu và thông điệp theo giai đoạn cuộc đời</td></tr>
<tr><td>Văn hoá</td><td>Ngôn ngữ, giá trị, tôn giáo, phong tục, màu sắc, biểu tượng, sự hài hước; giao tiếp ngữ cảnh cao và ngữ cảnh thấp (Edward T. Hall); các chiều giá trị (ví dụ Hofstede)</td><td>Lỗi dịch, hình ảnh gây phản cảm, lời kêu gọi không "đi" được sang nơi khác</td></tr>
<tr><td>Chính trị / pháp luật</td><td>Ngành hàng bị cấm quảng cáo, quy định về quảng cáo so sánh, quảng cáo nhắm trẻ em, duyệt trước nội dung, yêu cầu ngôn ngữ, giới hạn khuyến mại</td><td>Một cách thể hiện hợp pháp ở nước này có thể bất hợp pháp ở nước khác (ví dụ Việt Nam yêu cầu nội dung quảng cáo bằng tiếng Việt, trừ một số ngoại lệ)</td></tr>
</table>
<p>Ở nền văn hoá <strong>ngữ cảnh cao</strong>, phần lớn ý nghĩa nằm trong bối cảnh, quan hệ và tín hiệu phi ngôn ngữ, nên thông điệp gián tiếp, giàu hình ảnh hiệu quả; ở nền văn hoá <strong>ngữ cảnh thấp</strong>, ý nghĩa nằm trong lời nói rõ ràng, nên người ta chờ đợi tuyên bố trực tiếp và chi tiết.</p>
<h3>Quảng cáo toàn cầu hoá và địa phương hoá</h3>
<p>Theodore Levitt (1983) lập luận rằng công nghệ đang đồng nhất hoá nhu cầu người tiêu dùng trên toàn thế giới, nên doanh nghiệp nên bán sản phẩm chuẩn hoá với marketing chuẩn hoá. Tranh luận vẫn tiếp diễn:</p>
<table>
<tr><th>Lập luận cho chuẩn hoá (toàn cầu)</th><th>Lập luận cho địa phương hoá</th></tr>
<tr><td>Lợi thế kinh tế theo quy mô trong sản xuất, sáng tạo và phương tiện</td><td>Nhu cầu, cách dùng và động cơ mua khác nhau giữa các nước</td></tr>
<tr><td>Hình ảnh thương hiệu nhất quán cho người hay đi lại và người mua trực tuyến</td><td>Khác biệt văn hoá về ngôn ngữ, giá trị và sự hài hước</td></tr>
<tr><td>Một ý tưởng hay có thể khai thác ở mọi nơi</td><td>Khả năng có phương tiện và chi phí khác nhau</td></tr>
<tr><td>Dễ phối hợp và kiểm soát hơn</td><td>Quy định pháp luật khác nhau</td></tr>
<tr><td>Phương tiện và nền tảng toàn cầu cho phép làm vậy</td><td>Quản lý địa phương kháng cự ý tưởng "không phải do mình nghĩ ra"</td></tr>
</table>
<p>Chuẩn hoá phù hợp nhất khi nhu cầu mang tính phổ quát, khi thương hiệu nhắm tới <strong>phân đoạn toàn cầu</strong> (thanh thiếu niên, doanh nhân hay đi công tác, người mua hàng xa xỉ) hoặc khi sản phẩm thuộc loại "công nghệ cao" hay "cảm xúc cao". Phần lớn doanh nghiệp chọn con đường ở giữa — <strong>"nghĩ toàn cầu, hành động địa phương"</strong>: chiến lược và ý tưởng lớn toàn cầu, cách thể hiện được điều chỉnh (ngôn ngữ, diễn viên, bối cảnh, ưu đãi). Một chiến thuật liên quan là cách tiếp cận <strong>mẫu gốc</strong> (prototype/pattern): một chiến dịch gốc kèm hướng dẫn để đội địa phương điều chỉnh.</p>
<h3>Các lĩnh vực quyết định</h3>
<ul>
<li><strong>Tổ chức</strong> — tập trung (trụ sở chính quyết định), phân quyền (công ty con địa phương quyết định) hoặc kết hợp.</li>
<li><strong>Chọn agency</strong> — mạng lưới agency quốc tế có văn phòng địa phương, agency trong nước có đối tác quốc tế, hoặc agency địa phương ở từng thị trường.</li>
<li><strong>Nghiên cứu</strong> — dữ liệu thứ cấp không đồng đều giữa các nước; có thể cần nghiên cứu sơ cấp và phải phù hợp về văn hoá.</li>
<li><strong>Quyết định sáng tạo</strong> — điều chỉnh bao nhiêu; dịch ngược để bắt lỗi; thử nghiệm ở từng thị trường.</li>
<li><strong>Chọn phương tiện</strong> — khả năng có, chi phí, độ phủ và đo lường khác nhau; nền tảng toàn cầu tồn tại song song với phương tiện địa phương mạnh.</li>
<li><strong>Phối thức xúc tiến quốc tế</strong> — quy định về khuyến mại (quà tặng, bốc thăm may rủi, thi có thưởng) rất khác nhau; bán hàng cá nhân phụ thuộc văn hoá địa phương; PR phải làm việc với báo chí và các bên liên quan tại chỗ; hoạt động số phải theo quy định địa phương về dữ liệu và nền tảng.</li>
</ul>
<p><strong>Minh hoạ (giả định):</strong> một thương hiệu cà phê đặc sản Việt Nam vào Nhật Bản có thể giữ ý tưởng toàn cầu — "sự can đảm của cà phê Việt" — trong khi điều chỉnh cách thể hiện: nhiều chi tiết sản phẩm và tay nghề hơn cho một thị trường coi trọng chi tiết, quy cách bao bì địa phương, và bỏ kiểu hài hước dựa vào chơi chữ tiếng Việt.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Chuẩn hoá những gì mang tính chiến lược (định vị, bản sắc thương hiệu, ý tưởng lớn); địa phương hoá những gì mang tính thực thi (ngôn ngữ, diễn viên, ưu đãi, phương tiện) — và kiểm tra luật ở mọi thị trường.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Những thương hiệu bạn yêu thích nào quảng cáo giống nhau ở mọi nước? Vì sao họ làm được?</li>
<li>Cho ví dụ một lời kêu gọi có thể hiệu quả ở nền văn hoá ngữ cảnh cao nhưng thất bại ở nền văn hoá ngữ cảnh thấp.</li>
<li>Bạn phải kiểm tra gì trước khi đem một hình thức khuyến mại của Việt Nam sang nước khác?</li>
</ol>`,
  ]]);

const c13 = doc('mkt304-6-2-sales-promotion', '6.2 — Ch 16: Sales promotion|||6.2 — Ch 16: Khuyến mại (sales promotion)',
  'Khuyến mại là gì, vì sao tăng trưởng, khuyến mại xây dựng và không xây dựng thương hiệu (CFB/non-FB), các kỹ thuật hướng người tiêu dùng (mẫu thử, coupon, quà tặng, thi và bốc thăm, hoàn tiền, gói thưởng, giảm giá, khách hàng thân thiết, sự kiện) và hướng thương mại, chi phí coupon, phối hợp với quảng cáo, bẫy khuyến mại.',
  [[
    `<span class="eyebrow">MKT304 · Part 6 · Lesson 6.2</span>
<h2>Ch 16 — Sales promotion</h2>
<p class="lead">Sales promotion is a direct inducement that offers an extra value or incentive for the product to the sales force, distributors or the final consumer, with the primary objective of creating an immediate sale. It works on <em>behaviour now</em>, where advertising works on <em>minds over time</em>.</p>
<h3>Consumer-oriented vs trade-oriented</h3>
<p><strong>Consumer-oriented</strong> promotions target the end user and support a <strong>pull</strong> strategy; <strong>trade-oriented</strong> promotions target wholesalers and retailers and support a <strong>push</strong> strategy. Most brands need both.</p>
<h3>Why sales promotion has grown</h3>
<p>The growing power of retailers and platforms; declining brand loyalty and increased promotional sensitivity; brand proliferation; fragmentation of the consumer market; short-term focus and pressure for quick results; accountability (promotion results are easy to measure); competition; and advertising clutter.</p>
<h3>Franchise-building or not?</h3>
<p><strong>Consumer franchise-building (CFB)</strong> promotions communicate the brand's distinctive features and build brand equity (sampling that shows a real benefit, a loyalty programme built around the brand's values). <strong>Nonfranchise-building</strong> promotions only move volume through price (deep discounts, generic price-offs) and can train customers to wait for the next deal.</p>
<h3>Consumer-oriented techniques</h3>
<table>
<tr><th>Technique</th><th>Main use</th><th>Watch out for</th></tr>
<tr><td>Sampling</td><td>Trial of a new or improved product</td><td>Cost; only works if the product is clearly good</td></tr>
<tr><td>Couponing (paper or digital)</td><td>Trial, repeat, price discrimination</td><td>Low redemption; many redeemers would have bought anyway; fraud</td></tr>
<tr><td>Premiums (free with purchase, mail-in, self-liquidating)</td><td>Added value without cutting price</td><td>The gift can overshadow the product</td></tr>
<tr><td>Contests (skill) and sweepstakes (chance)</td><td>Excitement, involvement, database building</td><td>Legal rules; winners chosen by <em>chance</em> are regulated as lucky draws</td></tr>
<tr><td>Refunds and rebates</td><td>Reduce perceived risk of higher-priced items</td><td>Complex procedures annoy customers</td></tr>
<tr><td>Bonus packs</td><td>More product for the same price; load customers</td><td>May only reward existing users</td></tr>
<tr><td>Price-off deals</td><td>Quick volume, counter competitors</td><td>Erodes the reference price and image</td></tr>
<tr><td>Loyalty programmes</td><td>Repeat purchase, data, relationship</td><td>Costly to run; everyone copies them</td></tr>
<tr><td>Event marketing</td><td>Experience and engagement</td><td>Hard to measure; weather and logistics</td></tr>
</table>
<h3>The real cost of a coupon (illustrative numbers)</h3>
<pre><code class="language-text">Coupons distributed 500,000; distribution cost VND 150 million
Face value VND 10,000; handling VND 1,000 per coupon; redemption rate 4%
Redeemed = 500,000 x 4%                   = 20,000
Redemption cost = 20,000 x (10,000 + 1,000) = VND 220 million
Total cost = 150 + 220                    = VND 370 million
Cost per redeemed coupon = 370,000,000 / 20,000 = VND 18,500
If 60% of redeemers would have bought anyway, incremental buyers = 8,000
Cost per incremental buyer = 370,000,000 / 8,000 = VND 46,250</code></pre>
<h3>Trade-oriented techniques</h3>
<ul>
<li><strong>Objectives</strong>: gain distribution for new products, maintain trade support for established brands, build retail inventories, encourage retailers to display and promote the brand.</li>
<li><strong>Contests and incentives</strong> for distributors' and retailers' sales staff (including push money or "spiffs").</li>
<li><strong>Trade allowances</strong>: <em>buying allowances</em> (a discount on orders in a period), <em>promotional or display allowances</em> (payment for featuring or displaying the brand), <em>slotting allowances</em> (fees retailers charge to put a new product on the shelf). Problems: <strong>forward buying</strong> (stocking up at the deal price) and <strong>diverting</strong> (reselling deal stock to other areas).</li>
<li><strong>Displays and point-of-purchase materials</strong>, sales training programmes, trade shows.</li>
<li><strong>Cooperative advertising</strong>: horizontal (several retailers together), ingredient-sponsored (a component maker supports the final product's ads) and vertical (the manufacturer pays part of the retailer's ads for the brand).</li>
</ul>
<h3>Coordinating with advertising — and the promotion trap</h3>
<p>Budget allocation, consistent themes and timing must be coordinated: a promotion needs advertising to tell people about it, and the promotion's look must match the brand. Abuse of promotions leads to the <strong>sales promotion trap</strong>: if one brand promotes, it gains share; competitors respond; when everyone promotes, no brand gains share and all earn lower margins — like a prisoner's dilemma.</p>
<table>
<tr><th></th><th>Competitor does not promote</th><th>Competitor promotes</th></tr>
<tr><td>We do not promote</td><td>Both keep margins and shares</td><td>We lose share</td></tr>
<tr><td>We promote</td><td>We gain share (temporarily)</td><td>Shares unchanged, margins lower for both — the trap</td></tr>
</table>
<div class="callout"><span class="badge">Vietnam note</span> Commercial promotions (khuyến mại) in Vietnam are governed by the Commercial Law and its guiding decrees — forms, caps on value, notification and registration rules. See Part 8 and check the texts in force before designing any promotion.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Why are sweepstakes regulated more strictly than skill contests in many countries?</li>
<li>Design one CFB and one non-FB promotion for the same brand. Which would you run, and when?</li>
<li>How does the rise of e-commerce "double-day" sales change the sales promotion trap?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 6 · Bài 6.2</span>
<h2>Ch 16 — Khuyến mại</h2>
<p class="lead">Khuyến mại (sales promotion) là một kích thích trực tiếp mang lại giá trị hay ưu đãi tăng thêm cho sản phẩm, dành cho lực lượng bán hàng, nhà phân phối hoặc người tiêu dùng cuối cùng, với mục tiêu chính là tạo ra doanh số ngay lập tức. Nó tác động lên <em>hành vi ngay bây giờ</em>, còn quảng cáo tác động lên <em>tâm trí theo thời gian</em>.</p>
<h3>Hướng người tiêu dùng và hướng thương mại</h3>
<p>Khuyến mại <strong>hướng người tiêu dùng</strong> nhắm người dùng cuối và hỗ trợ chiến lược <strong>kéo</strong>; khuyến mại <strong>hướng thương mại</strong> nhắm nhà bán buôn, bán lẻ và hỗ trợ chiến lược <strong>đẩy</strong>. Hầu hết thương hiệu cần cả hai.</p>
<h3>Vì sao khuyến mại tăng trưởng</h3>
<p>Quyền lực ngày càng lớn của nhà bán lẻ và nền tảng; lòng trung thành thương hiệu giảm và mức nhạy cảm với khuyến mại tăng; sự bùng nổ số thương hiệu; thị trường tiêu dùng phân mảnh; tư duy ngắn hạn và áp lực có kết quả nhanh; trách nhiệm giải trình (kết quả khuyến mại dễ đo); cạnh tranh; và nhiễu quảng cáo.</p>
<h3>Có xây dựng thương hiệu hay không?</h3>
<p>Khuyến mại <strong>xây dựng thương hiệu (CFB — consumer franchise-building)</strong> truyền đạt đặc điểm khác biệt của thương hiệu và xây dựng giá trị thương hiệu (phát mẫu cho thấy lợi ích thật, chương trình khách hàng thân thiết xây quanh giá trị của thương hiệu). Khuyến mại <strong>không xây dựng thương hiệu</strong> chỉ đẩy sản lượng bằng giá (giảm giá sâu, giảm giá chung chung) và có thể "dạy" khách chờ đợt ưu đãi tiếp theo.</p>
<h3>Kỹ thuật hướng người tiêu dùng</h3>
<table>
<tr><th>Kỹ thuật</th><th>Công dụng chính</th><th>Cần cẩn thận</th></tr>
<tr><td>Phát mẫu thử</td><td>Dùng thử sản phẩm mới hoặc cải tiến</td><td>Chi phí; chỉ hiệu quả khi sản phẩm tốt rõ ràng</td></tr>
<tr><td>Coupon (giấy hoặc số)</td><td>Dùng thử, mua lại, phân biệt giá</td><td>Tỷ lệ sử dụng thấp; nhiều người dùng coupon vốn đã định mua; gian lận</td></tr>
<tr><td>Quà tặng (kèm khi mua, gửi thư nhận quà, tự hoàn vốn)</td><td>Tăng giá trị mà không giảm giá</td><td>Món quà có thể lấn át sản phẩm</td></tr>
<tr><td>Thi có thưởng (dựa vào kỹ năng) và bốc thăm (dựa vào may rủi)</td><td>Tạo hứng thú, tham gia, xây dựng cơ sở dữ liệu</td><td>Quy định pháp luật; chọn người thắng bằng <em>may rủi</em> bị quản lý như khuyến mại may rủi</td></tr>
<tr><td>Hoàn tiền</td><td>Giảm rủi ro cảm nhận với hàng giá cao</td><td>Thủ tục phức tạp gây khó chịu</td></tr>
<tr><td>Gói thưởng (bonus pack)</td><td>Nhiều sản phẩm hơn với cùng giá; tích trữ khách hàng</td><td>Có thể chỉ thưởng cho người đang dùng</td></tr>
<tr><td>Giảm giá trực tiếp</td><td>Tăng sản lượng nhanh, đối phó đối thủ</td><td>Bào mòn giá tham chiếu và hình ảnh</td></tr>
<tr><td>Chương trình khách hàng thân thiết</td><td>Mua lặp lại, dữ liệu, quan hệ</td><td>Tốn kém vận hành; ai cũng sao chép</td></tr>
<tr><td>Marketing sự kiện</td><td>Trải nghiệm và gắn kết</td><td>Khó đo; phụ thuộc thời tiết và hậu cần</td></tr>
</table>
<h3>Chi phí thật của một coupon (số liệu minh hoạ)</h3>
<pre><code class="language-text">Phát ra 500.000 coupon; chi phí phát hành 150 triệu đồng
Mệnh giá 10.000 đồng; phí xử lý 1.000 đồng mỗi coupon; tỷ lệ sử dụng 4%
Số coupon được dùng = 500.000 x 4%                 = 20.000
Chi phí quy đổi = 20.000 x (10.000 + 1.000)        = 220 triệu đồng
Tổng chi phí = 150 + 220                           = 370 triệu đồng
Chi phí mỗi coupon được dùng = 370.000.000 / 20.000 = 18.500 đồng
Nếu 60% người dùng coupon vốn đã định mua, số người mua tăng thêm = 8.000
Chi phí mỗi người mua tăng thêm = 370.000.000 / 8.000 = 46.250 đồng</code></pre>
<h3>Kỹ thuật hướng thương mại</h3>
<ul>
<li><strong>Mục tiêu</strong>: có được phân phối cho sản phẩm mới, duy trì sự hỗ trợ của kênh cho thương hiệu đã có, tăng tồn kho tại nhà bán lẻ, khuyến khích nhà bán lẻ trưng bày và quảng bá thương hiệu.</li>
<li><strong>Thi đua và thưởng</strong> cho nhân viên bán hàng của nhà phân phối, nhà bán lẻ (kể cả tiền thưởng theo sản phẩm — "push money").</li>
<li><strong>Trợ cấp thương mại</strong>: <em>trợ cấp mua hàng</em> (chiết khấu cho đơn đặt trong một kỳ), <em>trợ cấp quảng bá hay trưng bày</em> (trả tiền để nhà bán lẻ giới thiệu, trưng bày thương hiệu), <em>phí lên kệ</em> (slotting allowance — khoản nhà bán lẻ thu để đưa sản phẩm mới lên kệ). Vấn đề: <strong>mua trước</strong> (tích trữ hàng lúc có giá ưu đãi) và <strong>chuyển hàng</strong> (bán hàng ưu đãi sang khu vực khác).</li>
<li><strong>Kệ trưng bày và vật phẩm tại điểm bán</strong>, chương trình đào tạo bán hàng, hội chợ thương mại.</li>
<li><strong>Quảng cáo hợp tác</strong>: theo chiều ngang (nhiều nhà bán lẻ cùng làm), do nhà cung cấp thành phần tài trợ (nhà sản xuất linh kiện hỗ trợ quảng cáo sản phẩm cuối) và theo chiều dọc (nhà sản xuất trả một phần chi phí quảng cáo thương hiệu của nhà bán lẻ).</li>
</ul>
<h3>Phối hợp với quảng cáo — và bẫy khuyến mại</h3>
<p>Phân bổ ngân sách, chủ đề nhất quán và thời điểm phải được phối hợp: một chương trình khuyến mại cần quảng cáo để người ta biết tới, và hình thức của khuyến mại phải khớp với thương hiệu. Lạm dụng khuyến mại dẫn tới <strong>bẫy khuyến mại</strong>: nếu một thương hiệu khuyến mại, nó giành thị phần; đối thủ đáp trả; khi tất cả cùng khuyến mại, không ai tăng thị phần và tất cả có biên lợi nhuận thấp hơn — giống thế lưỡng nan của người tù.</p>
<table>
<tr><th></th><th>Đối thủ không khuyến mại</th><th>Đối thủ khuyến mại</th></tr>
<tr><td>Ta không khuyến mại</td><td>Cả hai giữ biên lợi nhuận và thị phần</td><td>Ta mất thị phần</td></tr>
<tr><td>Ta khuyến mại</td><td>Ta tăng thị phần (tạm thời)</td><td>Thị phần không đổi, biên lợi nhuận cả hai đều thấp hơn — cái bẫy</td></tr>
</table>
<div class="callout"><span class="badge">Lưu ý Việt Nam</span> Khuyến mại tại Việt Nam chịu sự điều chỉnh của Luật Thương mại và các nghị định hướng dẫn — hình thức, mức trần giá trị, thủ tục thông báo và đăng ký. Xem Phần 8 và kiểm văn bản đang có hiệu lực trước khi thiết kế bất kỳ chương trình nào.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Vì sao ở nhiều nước bốc thăm may rủi bị quản lý chặt hơn thi có thưởng dựa vào kỹ năng?</li>
<li>Thiết kế một chương trình CFB và một chương trình non-FB cho cùng một thương hiệu. Bạn sẽ chạy chương trình nào, khi nào?</li>
<li>Các đợt sale "ngày đôi" trên sàn thương mại điện tử làm thay đổi bẫy khuyến mại thế nào?</li>
</ol>`,
  ]]);

const c14 = doc('mkt304-6-3-public-relations', '6.3 — Ch 17: Public relations, publicity and corporate advertising|||6.3 — Ch 17: Quan hệ công chúng, publicity và quảng cáo doanh nghiệp',
  'PR truyền thống và marketing PR (MPR), quy trình PR (đánh giá thái độ công chúng, lập kế hoạch, triển khai), các nhóm công chúng nội bộ và bên ngoài, công cụ PR, ưu nhược điểm, đo lường PR (Barcelona Principles), publicity và quản trị khủng hoảng, quảng cáo doanh nghiệp (hình ảnh, advocacy, cause-related), tài trợ sự kiện.',
  [[
    `<span class="eyebrow">MKT304 · Part 6 · Lesson 6.3</span>
<h2>Ch 17 — Public relations, publicity and corporate advertising</h2>
<h3>Traditional PR and its new role</h3>
<p>Traditionally, public relations is the management function that evaluates public attitudes, identifies the policies and procedures of an organization with the public interest, and executes a programme to earn public understanding and acceptance. In IMC, PR also takes a <strong>marketing role</strong> — what Thomas Harris called marketing public relations (MPR): supporting product launches, building credibility, reaching opinion leaders and generating earned media. <strong>Publicity</strong> is narrower: news about the organization, product or person that is not paid for by the sponsor.</p>
<h3>The PR process</h3>
<ol>
<li><strong>Determine and evaluate public attitudes</strong> — research, social listening, stakeholder interviews.</li>
<li><strong>Establish a PR plan</strong> — situation, objectives, target publics, key messages, tactics, timeline, budget, evaluation.</li>
<li><strong>Develop and execute the programme</strong> — choose the relevant publics and the tools to reach them.</li>
</ol>
<table>
<tr><th>Internal publics</th><th>External publics</th></tr>
<tr><td>Employees, shareholders and investors, community members near the firm, suppliers and customers</td><td>The media, educators, civic and business groups, government, financial analysts and institutions</td></tr>
</table>
<p><strong>Tools</strong>: press releases, press conferences, exclusives, interviews, community involvement, events, websites and social media, reports and newsletters, and increasingly creators and influencers.</p>
<table>
<tr><th>Advantages of PR</th><th>Disadvantages</th></tr>
<tr><td>High credibility — the message comes through a third party</td><td>Lack of control over what is said, when and how</td></tr>
<tr><td>Low cost relative to paid media</td><td>Timing is not guaranteed</td></tr>
<tr><td>Avoids advertising clutter</td><td>The message may be distorted or shortened</td></tr>
<tr><td>Reaches specific groups and opinion leaders; builds image</td><td>Harder to integrate and to measure</td></tr>
</table>
<h3>Measuring PR</h3>
<p>Measures range from <em>outputs</em> (number and quality of media mentions, share of voice in coverage, sentiment, message penetration, reach of owned and earned posts) to <em>outcomes</em> (changes in awareness, attitudes and behaviour, measured by surveys or tracking). The industry's <strong>Barcelona Principles</strong> (AMEC, first issued in 2010) reject "advertising value equivalency" — pricing coverage as if it were bought advertising — as a measure of PR's value, and call for measuring outcomes.</p>
<h3>Publicity and crisis management</h3>
<p>Publicity is powerful because it is credible and newsworthy and spreads by word of mouth; it is dangerous because it cannot be controlled, and <strong>negative publicity</strong> spreads fastest on social media. Crisis guidelines: prepare a plan and spokespeople in advance; respond quickly; tell the truth; show concern for the people affected; take responsibility and act. A widely studied classic is the 1982 Tylenol case, in which Johnson &amp; Johnson recalled the product nationwide after a tampering incident, a response still taught as a model of putting consumer safety first.</p>
<h3>Corporate advertising</h3>
<ul>
<li><strong>Image advertising</strong> — builds the organization's overall image and reputation; includes <em>recruitment</em> advertising and communication aimed at <em>financial support</em> (investors).</li>
<li><strong>Event sponsorship</strong> — linking the firm to sports, music or cultural events; objectives include awareness, image transfer, hospitality and activation. Risks: poor fit and <em>ambush marketing</em> by competitors who associate themselves with the event without paying.</li>
<li><strong>Advocacy advertising</strong> — states the firm's position on a social, business or environmental issue; it can build respect but invites controversy and scrutiny.</li>
<li><strong>Cause-related marketing</strong> — links the firm or brand to a cause, often with purchases triggering donations; it must be genuine and transparent or it will be seen as exploitation ("cause-washing").</li>
</ul>
<p>Advantages of corporate advertising: a good vehicle for positioning the firm, it reaches selected publics, and it creates goodwill. Disadvantages: questionable effectiveness, critics see it as self-serving, and constituencies may be sceptical.</p>
<div class="callout"><span class="badge">Remember</span> PR earns attention; advertising buys it. In IMC, the strongest programmes design the paid, owned and earned parts to feed one another.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Why is publicity often more credible than advertising — and why is that also its weakness?</li>
<li>Draft three key messages and three tactics for a fictional food brand facing a false rumour on social media.</li>
<li>When does cause-related marketing help a brand, and when does it backfire?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 6 · Bài 6.3</span>
<h2>Ch 17 — Quan hệ công chúng, publicity và quảng cáo doanh nghiệp</h2>
<h3>PR truyền thống và vai trò mới</h3>
<p>Theo cách hiểu truyền thống, quan hệ công chúng là chức năng quản trị đánh giá thái độ của công chúng, gắn chính sách và thủ tục của tổ chức với lợi ích công chúng, và thực hiện một chương trình để giành được sự thấu hiểu, chấp nhận của công chúng. Trong IMC, PR còn đảm nhận <strong>vai trò marketing</strong> — điều Thomas Harris gọi là quan hệ công chúng marketing (MPR): hỗ trợ ra mắt sản phẩm, xây dựng độ tin cậy, tiếp cận người dẫn dắt dư luận và tạo ra earned media. <strong>Publicity</strong> hẹp hơn: tin tức về tổ chức, sản phẩm hay cá nhân mà nhà tài trợ không trả tiền.</p>
<h3>Quy trình PR</h3>
<ol>
<li><strong>Xác định và đánh giá thái độ công chúng</strong> — nghiên cứu, lắng nghe mạng xã hội, phỏng vấn các bên liên quan.</li>
<li><strong>Lập kế hoạch PR</strong> — tình thế, mục tiêu, nhóm công chúng mục tiêu, thông điệp chính, chiến thuật, tiến độ, ngân sách, đánh giá.</li>
<li><strong>Xây dựng và triển khai chương trình</strong> — chọn các nhóm công chúng liên quan và công cụ để tiếp cận họ.</li>
</ol>
<table>
<tr><th>Công chúng nội bộ</th><th>Công chúng bên ngoài</th></tr>
<tr><td>Nhân viên, cổ đông và nhà đầu tư, cộng đồng quanh doanh nghiệp, nhà cung cấp và khách hàng</td><td>Báo chí, giới giáo dục, các tổ chức dân sự và doanh nghiệp, chính quyền, nhà phân tích và tổ chức tài chính</td></tr>
</table>
<p><strong>Công cụ</strong>: thông cáo báo chí, họp báo, tin độc quyền, phỏng vấn, hoạt động cộng đồng, sự kiện, website và mạng xã hội, báo cáo và bản tin, và ngày càng nhiều nhà sáng tạo nội dung, người có ảnh hưởng.</p>
<table>
<tr><th>Ưu điểm của PR</th><th>Nhược điểm</th></tr>
<tr><td>Độ tin cậy cao — thông điệp đến qua bên thứ ba</td><td>Không kiểm soát được nói gì, khi nào, ra sao</td></tr>
<tr><td>Chi phí thấp so với phương tiện trả tiền</td><td>Không đảm bảo thời điểm</td></tr>
<tr><td>Tránh được nhiễu quảng cáo</td><td>Thông điệp có thể bị bóp méo hoặc cắt ngắn</td></tr>
<tr><td>Tiếp cận nhóm cụ thể và người dẫn dắt dư luận; xây dựng hình ảnh</td><td>Khó tích hợp và khó đo lường hơn</td></tr>
</table>
<h3>Đo lường PR</h3>
<p>Thước đo đi từ <em>đầu ra</em> (số lượng và chất lượng bài đưa tin, share of voice trên báo chí, sắc thái, mức độ thông điệp được truyền tải, độ phủ của bài đăng owned và earned) tới <em>kết quả</em> (thay đổi về nhận biết, thái độ, hành vi, đo bằng khảo sát hoặc theo dõi). <strong>Barcelona Principles</strong> của ngành (AMEC, ban hành lần đầu năm 2010) bác bỏ "giá trị tương đương quảng cáo" — định giá bài báo như thể đó là quảng cáo đã mua — như thước đo giá trị của PR, và kêu gọi đo lường kết quả.</p>
<h3>Publicity và quản trị khủng hoảng</h3>
<p>Publicity mạnh vì đáng tin, có giá trị tin tức và lan truyền bằng truyền miệng; nó nguy hiểm vì không kiểm soát được, và <strong>tin tức tiêu cực</strong> lan nhanh nhất trên mạng xã hội. Nguyên tắc xử lý khủng hoảng: chuẩn bị trước kế hoạch và người phát ngôn; phản hồi nhanh; nói sự thật; thể hiện sự quan tâm tới người bị ảnh hưởng; nhận trách nhiệm và hành động. Một ca kinh điển được nghiên cứu rộng rãi là vụ Tylenol năm 1982, khi Johnson &amp; Johnson thu hồi sản phẩm trên toàn quốc sau một vụ bị kẻ gian đầu độc sản phẩm, cách phản ứng đến nay vẫn được dạy như hình mẫu đặt an toàn người tiêu dùng lên trên hết.</p>
<h3>Quảng cáo doanh nghiệp</h3>
<ul>
<li><strong>Quảng cáo hình ảnh</strong> — xây dựng hình ảnh và danh tiếng chung của tổ chức; gồm quảng cáo <em>tuyển dụng</em> và truyền thông nhằm <em>hỗ trợ tài chính</em> (nhà đầu tư).</li>
<li><strong>Tài trợ sự kiện</strong> — gắn doanh nghiệp với sự kiện thể thao, âm nhạc, văn hoá; mục tiêu gồm nhận biết, chuyển giao hình ảnh, tiếp khách và kích hoạt. Rủi ro: không phù hợp và <em>ambush marketing</em> — đối thủ gắn mình với sự kiện mà không trả tiền tài trợ.</li>
<li><strong>Quảng cáo vận động (advocacy)</strong> — nêu quan điểm của doanh nghiệp về một vấn đề xã hội, kinh doanh hay môi trường; có thể tạo sự tôn trọng nhưng dễ gây tranh cãi và bị soi xét.</li>
<li><strong>Marketing gắn với mục đích xã hội (cause-related)</strong> — gắn doanh nghiệp hay thương hiệu với một mục đích xã hội, thường mỗi lần mua hàng sẽ kèm một khoản đóng góp; phải thật lòng và minh bạch, nếu không sẽ bị coi là lợi dụng ("cause-washing").</li>
</ul>
<p>Ưu điểm của quảng cáo doanh nghiệp: công cụ tốt để định vị doanh nghiệp, tiếp cận các nhóm công chúng chọn lọc, tạo thiện cảm. Nhược điểm: hiệu quả khó chứng minh, người phê phán coi là tự đề cao, và các nhóm công chúng có thể hoài nghi.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> PR giành được sự chú ý; quảng cáo mua sự chú ý. Trong IMC, chương trình mạnh nhất thiết kế các phần paid, owned và earned để chúng nuôi lẫn nhau.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Vì sao publicity thường đáng tin hơn quảng cáo — và vì sao đó cũng là điểm yếu của nó?</li>
<li>Soạn ba thông điệp chính và ba chiến thuật cho một thương hiệu thực phẩm giả định đang gặp tin đồn sai trên mạng xã hội.</li>
<li>Khi nào marketing gắn với mục đích xã hội giúp thương hiệu, và khi nào nó phản tác dụng?</li>
</ol>`,
  ]]);

const c14q = quiz('mkt304-quiz-6', 'Quiz 6 — International, sales promotion & PR|||Quiz 6 — Quốc tế, khuyến mại & PR', [
  { id: 'q1', question: 'Which is a main argument for standardized (global) advertising?|||Đâu là lập luận chính ủng hộ quảng cáo chuẩn hoá (toàn cầu)?', options: ['Consumer needs and purchase motives differ greatly between countries|||Nhu cầu và động cơ mua của người tiêu dùng rất khác nhau giữa các nước', 'Local managers know their markets best|||Quản lý địa phương hiểu thị trường của họ nhất', 'Economies of scale and a consistent brand image across markets|||Lợi thế kinh tế theo quy mô và hình ảnh thương hiệu nhất quán giữa các thị trường', 'Advertising laws differ from country to country|||Luật quảng cáo khác nhau giữa các nước'], correctIndex: 2, explanation: 'The other three options are arguments for localization.|||Ba phương án còn lại là lập luận ủng hộ địa phương hoá.' },
  { id: 'q2', question: 'What is the key difference between a sweepstakes and a contest?|||Điểm khác biệt then chốt giữa bốc thăm may rủi (sweepstakes) và thi có thưởng (contest) là gì?', options: ['A sweepstakes chooses winners by chance; a contest requires some skill or effort|||Bốc thăm chọn người thắng bằng may rủi; thi có thưởng đòi hỏi kỹ năng hoặc nỗ lực', 'A sweepstakes is trade-oriented; a contest is consumer-oriented|||Bốc thăm hướng thương mại; thi có thưởng hướng người tiêu dùng', 'A contest never offers prizes|||Thi có thưởng không bao giờ có giải thưởng', 'A sweepstakes requires purchase; a contest never does|||Bốc thăm bắt buộc mua hàng; thi có thưởng thì không bao giờ'], correctIndex: 0, explanation: 'The chance element is what defines a sweepstakes and why it is regulated more strictly.|||Yếu tố may rủi là điều định nghĩa bốc thăm và là lý do nó bị quản lý chặt hơn.' },
  { id: 'q3', question: 'An energy company runs an ad stating its position in favour of a new environmental policy. This is…|||Một công ty năng lượng chạy quảng cáo nêu quan điểm ủng hộ một chính sách môi trường mới. Đây là…', options: ['recruitment advertising|||quảng cáo tuyển dụng', 'a trade allowance|||một khoản trợ cấp thương mại', 'product placement|||product placement', 'advocacy advertising|||quảng cáo vận động (advocacy)'], correctIndex: 3, explanation: 'Advocacy advertising states the organization’s position on a social, business or environmental issue.|||Quảng cáo vận động nêu quan điểm của tổ chức về một vấn đề xã hội, kinh doanh hay môi trường.' },
]);

const c15 = doc('mkt304-7-1-direct-marketing', '7.1 — Ch 14: Direct marketing|||7.1 — Ch 14: Marketing trực tiếp',
  'Marketing trực tiếp là gì và vì sao tăng trưởng, vai trò trong IMC, cơ sở dữ liệu và RFM, các phương tiện đáp ứng trực tiếp (thư, catalogue, email, TV đáp ứng trực tiếp, infomercial, telemarketing, tin nhắn), bán hàng trực tiếp, đo hiệu quả bằng phễu (CPI, CPO, giá trị vòng đời), ưu nhược điểm.',
  [[
    `<span class="eyebrow">MKT304 · Part 7 · Lesson 7.1</span>
<h2>Ch 14 — Direct marketing</h2>
<p class="lead">Direct marketing is a system in which organizations communicate directly with target customers to generate a response or a transaction. Its defining feature is <strong>measurability</strong>: every piece has a call to action, so you can count what it produced.</p>
<h3>Why it has grown, and its role in IMC</h3>
<p>Growth drivers: consumer credit and digital payments, busy lifestyles that favour ordering from home, technology (Internet, mobile, CRM software) and cheaper data processing. In IMC, direct marketing works <em>with</em> other tools: advertising builds the brand that makes people open the email; PR creates interest that direct offers convert; sales promotion supplies the offer; personal selling follows up the leads.</p>
<h3>The direct marketing plan</h3>
<ol>
<li><strong>Objectives</strong> — usually a behavioural response (an order, a sign-up, a lead), sometimes information or image.</li>
<li><strong>Database</strong> — names, contact details, purchase history, preferences, gathered from company records, loyalty programmes, websites and apps, with consent. Uses: select the best prospects, stimulate repeat purchase, cross-sell. A classic scoring tool is <strong>RFM</strong>: <em>recency</em> (how recently the customer bought), <em>frequency</em> (how often) and <em>monetary value</em> (how much).</li>
<li><strong>Media</strong> — direct mail; catalogues; email; direct-response TV (short spots with a phone number, QR code or link); <strong>infomercials</strong> (programme-length commercials); direct-response print and radio; telemarketing and call centres; SMS and messaging apps.</li>
<li><strong>Approach</strong> — <em>one-step</em> (the medium obtains the order directly) or <em>two-step</em> (first generate interest or a lead, then convert through another contact).</li>
</ol>
<p><strong>Direct selling</strong> — personal presentation and sale in a non-retail setting (door-to-door, party plans, multilevel networks). Multilevel marketing is separately and strictly regulated in Vietnam; check the current rules.</p>
<h3>Evaluating effectiveness: the funnel (illustrative numbers)</h3>
<pre><code class="language-text">Mailing: 20,000 pieces x VND 15,000       = VND 300 million
Response rate 2.5%   -> 20,000 x 2.5%    = 500 inquiries
Conversion 30%       -> 500 x 30%        = 150 orders
Cost per inquiry (CPI) = 300,000,000 / 500 = VND 600,000
Cost per order (CPO)   = 300,000,000 / 150 = VND 2,000,000
Average order VND 3.5 million, margin 40% -> contribution VND 1.4 million per order
Contribution = 150 x 1.4 = VND 210 million  -> first-order loss VND 90 million
Break-even orders = 300 / 1.4 = 214.3, i.e. 215 orders</code></pre>
<p>A first-order loss is not automatically a failure: if customers buy again, the right yardstick is <strong>customer lifetime value (CLV)</strong> — the contribution a customer brings over the whole relationship — compared with the cost of acquiring them.</p>
<table>
<tr><th>Advantages</th><th>Disadvantages</th></tr>
<tr><td>Selective reach and segmentation</td><td>Image problem — "junk mail", spam, intrusive calls</td></tr>
<tr><td>Frequency and timing under the marketer's control</td><td>Accuracy of the database decays quickly</td></tr>
<tr><td>Personalization and creativity in format</td><td>Content support — the message competes with nothing to help it</td></tr>
<tr><td>Measurable, testable (A/B tests of offers and copy)</td><td>Rising costs; privacy concerns and data protection rules</td></tr>
</table>
<div class="callout"><span class="badge">Vietnam note</span> Collecting and using personal data for marketing requires a lawful basis — usually consent — under Vietnam's personal data protection rules, and unsolicited messages and calls are restricted. Check the regulations in force before building a campaign database.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Why is a high response rate not enough to judge a direct campaign?</li>
<li>Explain RFM to a small online shop owner in three sentences.</li>
<li>When would you choose a two-step approach over a one-step approach?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 7 · Bài 7.1</span>
<h2>Ch 14 — Marketing trực tiếp</h2>
<p class="lead">Marketing trực tiếp là hệ thống trong đó tổ chức giao tiếp trực tiếp với khách hàng mục tiêu để tạo ra phản hồi hoặc giao dịch. Đặc trưng của nó là <strong>đo lường được</strong>: mọi nội dung đều có lời kêu gọi hành động, nên bạn đếm được nó mang lại gì.</p>
<h3>Vì sao tăng trưởng, và vai trò trong IMC</h3>
<p>Động lực tăng trưởng: tín dụng tiêu dùng và thanh toán số, lối sống bận rộn khiến người ta thích đặt hàng tại nhà, công nghệ (Internet, di động, phần mềm CRM) và chi phí xử lý dữ liệu rẻ hơn. Trong IMC, marketing trực tiếp làm việc <em>cùng</em> các công cụ khác: quảng cáo xây dựng thương hiệu khiến người ta mở email; PR tạo sự quan tâm để ưu đãi trực tiếp chuyển thành đơn; khuyến mại cung cấp ưu đãi; bán hàng cá nhân theo đuổi khách hàng tiềm năng.</p>
<h3>Kế hoạch marketing trực tiếp</h3>
<ol>
<li><strong>Mục tiêu</strong> — thường là một phản hồi hành vi (đơn hàng, đăng ký, khách hàng tiềm năng), đôi khi là thông tin hoặc hình ảnh.</li>
<li><strong>Cơ sở dữ liệu</strong> — tên, thông tin liên hệ, lịch sử mua, sở thích, thu thập từ hồ sơ công ty, chương trình khách hàng thân thiết, website và ứng dụng, có sự đồng ý. Công dụng: chọn khách hàng tiềm năng tốt nhất, thúc đẩy mua lặp lại, bán chéo. Công cụ chấm điểm kinh điển là <strong>RFM</strong>: <em>recency</em> (lần mua gần nhất cách đây bao lâu), <em>frequency</em> (mua thường xuyên thế nào) và <em>monetary value</em> (chi bao nhiêu).</li>
<li><strong>Phương tiện</strong> — thư trực tiếp; catalogue; email; truyền hình đáp ứng trực tiếp (spot ngắn kèm số điện thoại, mã QR hoặc đường link); <strong>infomercial</strong> (quảng cáo dài bằng một chương trình); báo in và phát thanh đáp ứng trực tiếp; telemarketing và tổng đài; tin nhắn SMS và ứng dụng nhắn tin.</li>
<li><strong>Cách tiếp cận</strong> — <em>một bước</em> (phương tiện lấy đơn hàng trực tiếp) hoặc <em>hai bước</em> (trước hết tạo quan tâm hay khách hàng tiềm năng, rồi chuyển đổi qua một lần tiếp xúc khác).</li>
</ol>
<p><strong>Bán hàng trực tiếp</strong> — giới thiệu và bán tận nơi, ngoài cửa hàng (bán tới từng nhà, bán theo buổi gặp mặt, mạng lưới đa cấp). Kinh doanh theo phương thức đa cấp được quản lý riêng và chặt chẽ tại Việt Nam; kiểm quy định đang có hiệu lực.</p>
<h3>Đánh giá hiệu quả: phễu (số liệu minh hoạ)</h3>
<pre><code class="language-text">Gửi thư: 20.000 thư x 15.000 đồng         = 300 triệu đồng
Tỷ lệ phản hồi 2,5%  -> 20.000 x 2,5%    = 500 lượt hỏi
Tỷ lệ chuyển đổi 30% -> 500 x 30%        = 150 đơn hàng
Chi phí mỗi lượt hỏi (CPI) = 300.000.000 / 500 = 600.000 đồng
Chi phí mỗi đơn hàng (CPO) = 300.000.000 / 150 = 2.000.000 đồng
Giá trị đơn trung bình 3,5 triệu đồng, biên lợi nhuận 40% -> đóng góp 1,4 triệu đồng mỗi đơn
Tổng đóng góp = 150 x 1,4 = 210 triệu đồng  -> lỗ ở đơn đầu tiên 90 triệu đồng
Số đơn hoà vốn = 300 / 1,4 = 214,3, tức 215 đơn</code></pre>
<p>Lỗ ở đơn đầu tiên không tự động là thất bại: nếu khách hàng mua tiếp, thước đo đúng là <strong>giá trị vòng đời khách hàng (CLV)</strong> — phần đóng góp một khách hàng mang lại trong suốt mối quan hệ — so với chi phí để có được khách hàng đó.</p>
<table>
<tr><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td>Tiếp cận chọn lọc và phân đoạn</td><td>Vấn đề hình ảnh — "thư rác", spam, cuộc gọi làm phiền</td></tr>
<tr><td>Tần suất và thời điểm do người làm marketing kiểm soát</td><td>Độ chính xác của cơ sở dữ liệu giảm nhanh</td></tr>
<tr><td>Cá nhân hoá và sáng tạo về hình thức</td><td>Thiếu hỗ trợ nội dung — thông điệp không có gì đi kèm để trợ giúp</td></tr>
<tr><td>Đo được, thử nghiệm được (A/B test ưu đãi và lời văn)</td><td>Chi phí tăng; lo ngại quyền riêng tư và quy định bảo vệ dữ liệu</td></tr>
</table>
<div class="callout"><span class="badge">Lưu ý Việt Nam</span> Thu thập và sử dụng dữ liệu cá nhân cho marketing cần có cơ sở hợp pháp — thường là sự đồng ý — theo quy định về bảo vệ dữ liệu cá nhân của Việt Nam, và tin nhắn, cuộc gọi quảng cáo không được yêu cầu bị hạn chế. Kiểm văn bản đang có hiệu lực trước khi xây dựng cơ sở dữ liệu cho chiến dịch.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Vì sao tỷ lệ phản hồi cao chưa đủ để đánh giá một chiến dịch trực tiếp?</li>
<li>Giải thích RFM cho chủ một cửa hàng trực tuyến nhỏ trong ba câu.</li>
<li>Khi nào bạn chọn cách tiếp cận hai bước thay vì một bước?</li>
</ol>`,
  ]]);

const c16 = doc('mkt304-7-2-internet-interactive', '7.2 — Ch 15: The Internet and interactive media|||7.2 — Ch 15: Internet và phương tiện tương tác',
  'Internet trong IMC (mục tiêu, công cụ: website, tìm kiếm, hiển thị, native, video, mạng xã hội, influencer, email, di động), quản lý mạng xã hội, programmatic và đấu giá thời gian thực, các chỉ số Internet (CTR, CPC, CPM, CR, CPA, ROAS, engagement) có ví dụ số, các mô hình phân bổ chuyển đổi, ưu nhược điểm.',
  [[
    `<span class="eyebrow">MKT304 · Part 7 · Lesson 7.2</span>
<h2>Ch 15 — The Internet and interactive media</h2>
<h3>From broadcasting to interaction</h3>
<p>The Internet moved communication from one-way (Web 1.0: brochure-like websites) to two-way and many-to-many (Web 2.0: social networks, user content, reviews). Consumers now search, compare, comment, share and create. For IMC this means the brand no longer controls the conversation — but it can join it and measure it.</p>
<h3>Objectives the Internet can serve</h3>
<p>Disseminate information; create awareness; gather research information; build an image; stimulate trial; create buzz and engagement; gain consideration; sell (e-commerce, social commerce, livestream selling).</p>
<h3>The toolbox</h3>
<table>
<tr><th>Tool</th><th>What it does best</th></tr>
<tr><td>Website, app, content (owned)</td><td>Information, conversion, first-party data; supported by search engine optimization (SEO)</td></tr>
<tr><td>Paid search (SEM)</td><td>Catches people at the moment of intent; pay per click</td></tr>
<tr><td>Display, rich media, native ads</td><td>Visual reach across sites and apps; native ads match the look of surrounding content and must be labelled</td></tr>
<tr><td>Online video (in-stream, short-form)</td><td>Sight, sound and motion with targeting; skippable formats demand an early brand</td></tr>
<tr><td>Social media (paid and organic)</td><td>Targeting by interests and behaviour, sharing, community, social commerce</td></tr>
<tr><td>Influencers / KOLs / KOCs</td><td>Borrowed credibility and reach; paid content must be disclosed</td></tr>
<tr><td>Email and messaging</td><td>Retention, personalised offers, low cost</td></tr>
<tr><td>Mobile (apps, in-app, location-based)</td><td>Context and immediacy; privacy must be respected</td></tr>
</table>
<h3>Managing social media</h3>
<p>Listen before you speak (social listening); plan a content calendar around the big idea; manage the community (respond quickly and in the brand's voice); encourage and moderate user-generated content; prepare a social crisis protocol. Organic reach on most platforms is limited, so owned and earned content usually need paid support.</p>
<h3>Programmatic buying</h3>
<p><strong>Programmatic</strong> advertising automates the buying of ad impressions using software and data, often through <strong>real-time bidding (RTB)</strong>: when a page or app loads, advertisers' demand-side platforms bid in milliseconds for that impression, based on who the user appears to be. Benefits: efficiency, precise audience targeting, real-time optimization. Risks: ad fraud (bots), <strong>brand safety</strong> (ads next to harmful content), low <strong>viewability</strong>, lack of transparency in fees, and privacy concerns.</p>
<h3>Internet metrics (illustrative numbers)</h3>
<pre><code class="language-text">Impressions 500,000   Clicks 6,000   Spend VND 18 million   Orders 180   Average order VND 300,000
CTR  = clicks / impressions        = 6,000 / 500,000        = 1.2%
CPC  = spend / clicks              = 18,000,000 / 6,000     = VND 3,000
CPM  = spend x 1,000 / impressions = 18,000,000 / 500       = VND 36,000
CR   = orders / clicks             = 180 / 6,000            = 3.0%
CPA  = spend / orders              = 18,000,000 / 180      = VND 100,000
Revenue = 180 x 300,000 = VND 54 million
ROAS = revenue / ad spend          = 54 / 18                = 3.0</code></pre>
<p><strong>Engagement metrics</strong> — likes, comments, shares, saves, video completion rate, time spent — show interest, but they are not sales. <strong>ROAS</strong> measures revenue, not profit: a ROAS of 3.0 on a product with a 25% margin still loses money (each VND 1 of ads brings VND 3 of revenue but only VND 0.75 of gross margin).</p>
<h3>Attribution: who gets the credit?</h3>
<p>Customers often touch several channels before buying. <strong>Attribution models</strong> share the credit for a conversion: <em>last-click</em> (all credit to the final touch), <em>first-click</em>, <em>linear</em> (equal shares), <em>time-decay</em> (more to recent touches), <em>position-based</em> or U-shaped (for example 40% first, 40% last, 20% shared by the middle) and <em>data-driven</em> models. Each is a rule, not a measure of true cause; <strong>incrementality tests</strong> (holding out a control group or region) show what a channel really adds. Exercise 3 applies the models.</p>
<table>
<tr><th>Advantages of the Internet</th><th>Disadvantages</th></tr>
<tr><td>Target marketing and message tailoring</td><td>Measurement problems and disputed metrics</td></tr>
<tr><td>Interactivity and information access</td><td>Clutter and ad avoidance (ad blockers, skipping)</td></tr>
<tr><td>Sales potential and speed</td><td>Potential for deception, fake reviews and fraud</td></tr>
<tr><td>Creativity, exposure, cost efficiency</td><td>Privacy concerns; brand-safety risks</td></tr>
</table>
<div class="callout"><span class="badge">Watch out</span> The most measurable channel is not always the most valuable one. Search and email often sit at the end of journeys that video, social and PR started.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>A campaign has a high CTR but a low conversion rate. What might be wrong, and where?</li>
<li>Why do programmatic buyers worry about brand safety and viewability?</li>
<li>Should a brand judge influencer content by engagement, by sales, or by something else?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 7 · Bài 7.2</span>
<h2>Ch 15 — Internet và phương tiện tương tác</h2>
<h3>Từ phát sóng tới tương tác</h3>
<p>Internet đưa truyền thông từ một chiều (Web 1.0: website như tờ rơi) sang hai chiều và nhiều-với-nhiều (Web 2.0: mạng xã hội, nội dung người dùng, đánh giá). Người tiêu dùng nay tìm kiếm, so sánh, bình luận, chia sẻ và tự sáng tạo. Với IMC, điều này nghĩa là thương hiệu không còn kiểm soát cuộc trò chuyện — nhưng có thể tham gia và đo lường nó.</p>
<h3>Những mục tiêu Internet phục vụ được</h3>
<p>Phổ biến thông tin; tạo nhận biết; thu thập thông tin nghiên cứu; xây dựng hình ảnh; kích thích dùng thử; tạo tiếng vang và gắn kết; được đưa vào cân nhắc; bán hàng (thương mại điện tử, thương mại qua mạng xã hội, bán hàng qua livestream).</p>
<h3>Bộ công cụ</h3>
<table>
<tr><th>Công cụ</th><th>Làm tốt nhất điều gì</th></tr>
<tr><td>Website, ứng dụng, nội dung (owned)</td><td>Thông tin, chuyển đổi, dữ liệu bên thứ nhất; được hỗ trợ bởi tối ưu hoá công cụ tìm kiếm (SEO)</td></tr>
<tr><td>Quảng cáo tìm kiếm trả phí (SEM)</td><td>Bắt đúng lúc người ta có ý định; trả tiền theo lượt nhấp</td></tr>
<tr><td>Hiển thị, rich media, quảng cáo native</td><td>Phủ bằng hình ảnh trên các trang và ứng dụng; quảng cáo native có hình thức giống nội dung xung quanh và phải được gắn nhãn</td></tr>
<tr><td>Video trực tuyến (trong luồng, video ngắn)</td><td>Hình, tiếng, chuyển động kèm nhắm chọn; định dạng bỏ qua được đòi hỏi thương hiệu xuất hiện sớm</td></tr>
<tr><td>Mạng xã hội (trả phí và tự nhiên)</td><td>Nhắm chọn theo sở thích và hành vi, chia sẻ, cộng đồng, thương mại xã hội</td></tr>
<tr><td>Influencer / KOL / KOC</td><td>Mượn độ tin cậy và độ phủ; nội dung trả phí phải được công khai</td></tr>
<tr><td>Email và tin nhắn</td><td>Giữ chân khách, ưu đãi cá nhân hoá, chi phí thấp</td></tr>
<tr><td>Di động (ứng dụng, trong ứng dụng, theo vị trí)</td><td>Bối cảnh và tính tức thời; phải tôn trọng quyền riêng tư</td></tr>
</table>
<h3>Quản lý mạng xã hội</h3>
<p>Lắng nghe trước khi nói (social listening); lập lịch nội dung quanh ý tưởng lớn; quản lý cộng đồng (phản hồi nhanh, đúng giọng thương hiệu); khuyến khích và kiểm duyệt nội dung do người dùng tạo; chuẩn bị quy trình xử lý khủng hoảng trên mạng. Độ phủ tự nhiên trên hầu hết nền tảng rất hạn chế, nên nội dung owned và earned thường cần tiền quảng cáo hỗ trợ.</p>
<h3>Mua quảng cáo programmatic</h3>
<p>Quảng cáo <strong>programmatic</strong> tự động hoá việc mua lượt hiển thị bằng phần mềm và dữ liệu, thường qua <strong>đấu giá thời gian thực (RTB)</strong>: khi một trang hay ứng dụng tải, nền tảng phía mua (DSP) của các nhà quảng cáo đặt giá trong vài mili giây cho lượt hiển thị đó, dựa trên việc người dùng có vẻ là ai. Lợi ích: hiệu suất, nhắm chọn công chúng chính xác, tối ưu theo thời gian thực. Rủi ro: gian lận quảng cáo (bot), <strong>an toàn thương hiệu</strong> (quảng cáo nằm cạnh nội dung độc hại), <strong>khả năng hiển thị</strong> thấp, thiếu minh bạch về phí, và lo ngại quyền riêng tư.</p>
<h3>Chỉ số Internet (số liệu minh hoạ)</h3>
<pre><code class="language-text">Hiển thị 500.000   Nhấp 6.000   Chi 18 triệu đồng   Đơn hàng 180   Giá trị đơn trung bình 300.000 đồng
CTR  = nhấp / hiển thị            = 6.000 / 500.000        = 1,2%
CPC  = chi phí / nhấp             = 18.000.000 / 6.000     = 3.000 đồng
CPM  = chi phí x 1.000 / hiển thị = 18.000.000 / 500       = 36.000 đồng
CR   = đơn hàng / nhấp            = 180 / 6.000            = 3,0%
CPA  = chi phí / đơn hàng         = 18.000.000 / 180       = 100.000 đồng
Doanh thu = 180 x 300.000 = 54 triệu đồng
ROAS = doanh thu / chi quảng cáo  = 54 / 18                = 3,0</code></pre>
<p><strong>Chỉ số gắn kết</strong> — lượt thích, bình luận, chia sẻ, lưu, tỷ lệ xem hết video, thời gian xem — cho thấy sự quan tâm, nhưng chúng không phải doanh số. <strong>ROAS</strong> đo doanh thu, không đo lợi nhuận: ROAS 3,0 với sản phẩm có biên lợi nhuận 25% vẫn lỗ (mỗi 1 đồng quảng cáo mang về 3 đồng doanh thu nhưng chỉ 0,75 đồng lợi nhuận gộp).</p>
<h3>Phân bổ chuyển đổi: ai được ghi công?</h3>
<p>Khách hàng thường chạm nhiều kênh trước khi mua. <strong>Mô hình phân bổ</strong> (attribution) chia công cho một lượt chuyển đổi: <em>last-click</em> (toàn bộ cho điểm chạm cuối), <em>first-click</em>, <em>tuyến tính</em> (chia đều), <em>suy giảm theo thời gian</em> (điểm chạm gần hơn được nhiều hơn), <em>theo vị trí</em> hay hình chữ U (ví dụ 40% cho điểm đầu, 40% cho điểm cuối, 20% chia cho các điểm giữa) và mô hình <em>dựa trên dữ liệu</em>. Mỗi mô hình là một quy tắc, không phải thước đo nguyên nhân thật; <strong>thử nghiệm tăng thêm</strong> (giữ lại một nhóm hay vùng đối chứng) cho thấy một kênh thực sự đóng góp gì. Bài tập 3 áp dụng các mô hình này.</p>
<table>
<tr><th>Ưu điểm của Internet</th><th>Nhược điểm</th></tr>
<tr><td>Nhắm chọn thị trường và may đo thông điệp</td><td>Vấn đề đo lường và chỉ số gây tranh cãi</td></tr>
<tr><td>Tương tác và tiếp cận thông tin</td><td>Nhiễu và né tránh quảng cáo (chặn quảng cáo, bỏ qua)</td></tr>
<tr><td>Tiềm năng bán hàng và tốc độ</td><td>Nguy cơ lừa dối, đánh giá giả và gian lận</td></tr>
<tr><td>Sáng tạo, độ phủ, hiệu quả chi phí</td><td>Lo ngại quyền riêng tư; rủi ro an toàn thương hiệu</td></tr>
</table>
<div class="callout"><span class="badge">Cẩn thận</span> Kênh đo được rõ nhất không phải lúc nào cũng là kênh giá trị nhất. Tìm kiếm và email thường nằm ở cuối những hành trình mà video, mạng xã hội và PR đã khởi đầu.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Một chiến dịch có CTR cao nhưng tỷ lệ chuyển đổi thấp. Có thể sai ở đâu?</li>
<li>Vì sao người mua programmatic lo về an toàn thương hiệu và khả năng hiển thị?</li>
<li>Thương hiệu nên đánh giá nội dung influencer bằng mức gắn kết, bằng doanh số, hay bằng thứ khác?</li>
</ol>`,
  ]]);

const c16e = doc('mkt304-7-3-exercise', 'Exercise 3 — attribution and ROAS across four customer journeys|||Bài tập 3 — phân bổ chuyển đổi và ROAS qua bốn hành trình khách hàng',
  'Bài tập: bốn hành trình khách hàng giả định qua mạng xã hội, tìm kiếm, email và hiển thị; phân bổ chuyển đổi theo last-click, tuyến tính và theo vị trí (40/20/40), tính doanh thu và ROAS từng kênh, quyết định phân bổ ngân sách; kèm lời giải.',
  [[
    `<span class="eyebrow">MKT304 · Part 7 · Exercise 3</span>
<h2>Exercise 3 — which channel really earns its budget?</h2>
<div class="callout"><span class="badge">Problem</span> A fictional online skincare shop tracked 100 conversions in one month, all with an average order value of VND 800,000. They followed four journeys: J1 Social → Search → Email (40 conversions); J2 Display → Social → Search (30); J3 Search → Email (20); J4 Display → Email → Social → Search (10). Monthly spend (VND million): Social 12, Search 15, Email 3, Display 10. (a) Attribute the conversions to each channel under last-click, linear and position-based (40% first, 40% last, 20% shared equally by middle touches; a two-touch journey splits 50/50). (b) Compute attributed revenue and ROAS by channel under each model. (c) The manager wants to cut every channel with ROAS below 1.5 under last-click. What do you advise?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Attributed conversions
                 Social   Search   Email   Display   Total
    Last-click     0       40       60       0        100
      (Search = J2 30 + J4 10;  Email = J1 40 + J3 20)
    Linear       25.83    35.83    25.83    12.50     100
      (J1: 13.33 each; J2: 10 each; J3: 10 each; J4: 2.5 each)
    Position     23.00    34.00    27.00    16.00     100
      (J1: Social 16, Search 8, Email 16
       J2: Display 12, Social 6, Search 12
       J3: Search 10, Email 10
       J4: Display 4, Email 1, Social 1, Search 4)

(b) Revenue = conversions x VND 0.8 million;  ROAS = revenue / spend
                 Social   Search   Email   Display
    Spend          12       15       3       10       (total 40)
    Last-click   0.0/0.00  32.0/2.13  48.0/16.00  0.0/0.00
    Linear      20.67/1.72 28.67/1.91 20.67/6.89 10.00/1.00
    Position    18.40/1.53 27.20/1.81 21.60/7.20 12.80/1.28
    (each cell: revenue VND million / ROAS)
    Total revenue 80, total spend 40  ->  overall ROAS 2.0 under every model

(c) Under last-click, Social and Display show ROAS 0.00 and would be cut.</code></pre>
<p><strong>Why:</strong> last-click gives no credit to Social and Display, yet Display <em>starts</em> 40 of the 100 journeys (J2, J4) and Social starts 40 (J1) and appears in 80. Cutting them would likely shrink the flow of people who later search and open emails. Email's very high ROAS is partly an artefact: it is cheap and sits at the end of journeys, reaching people who already know the brand — it cannot be scaled up indefinitely. Note that the models only move credit around; total revenue and the overall ROAS of 2.0 never change. Advice: keep Social; keep Display but test it, because even under the kinder models its ROAS (1.00–1.28) is below the 2.0 average; run holdout or geo tests to measure incrementality before any large cut; and judge channels on profit, not revenue.</p>`,
    `<span class="eyebrow">MKT304 · Phần 7 · Bài tập 3</span>
<h2>Bài tập 3 — kênh nào thật sự xứng đáng với ngân sách?</h2>
<div class="callout"><span class="badge">Đề</span> Một cửa hàng mỹ phẩm trực tuyến giả định ghi nhận 100 lượt chuyển đổi trong một tháng, giá trị đơn trung bình đều là 800.000 đồng. Có bốn hành trình: J1 Mạng xã hội → Tìm kiếm → Email (40 chuyển đổi); J2 Hiển thị → Mạng xã hội → Tìm kiếm (30); J3 Tìm kiếm → Email (20); J4 Hiển thị → Email → Mạng xã hội → Tìm kiếm (10). Chi phí tháng (triệu đồng): Mạng xã hội 12, Tìm kiếm 15, Email 3, Hiển thị 10. (a) Phân bổ chuyển đổi cho từng kênh theo last-click, tuyến tính và theo vị trí (40% điểm đầu, 40% điểm cuối, 20% chia đều cho các điểm giữa; hành trình hai điểm chạm chia 50/50). (b) Tính doanh thu được phân bổ và ROAS từng kênh theo mỗi mô hình. (c) Người quản lý muốn cắt mọi kênh có ROAS dưới 1,5 theo last-click. Bạn khuyên gì?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Số chuyển đổi được phân bổ
                 MXH      Tìm kiếm  Email   Hiển thị  Tổng
    Last-click     0        40        60       0       100
      (Tìm kiếm = J2 30 + J4 10;  Email = J1 40 + J3 20)
    Tuyến tính   25,83    35,83     25,83    12,50     100
      (J1: mỗi kênh 13,33; J2: mỗi kênh 10; J3: mỗi kênh 10; J4: mỗi kênh 2,5)
    Theo vị trí  23,00    34,00     27,00    16,00     100
      (J1: MXH 16, Tìm kiếm 8, Email 16
       J2: Hiển thị 12, MXH 6, Tìm kiếm 12
       J3: Tìm kiếm 10, Email 10
       J4: Hiển thị 4, Email 1, MXH 1, Tìm kiếm 4)

(b) Doanh thu = số chuyển đổi x 0,8 triệu đồng;  ROAS = doanh thu / chi phí
                 MXH        Tìm kiếm    Email       Hiển thị
    Chi phí        12         15          3           10       (tổng 40)
    Last-click   0,0/0,00   32,0/2,13   48,0/16,00  0,0/0,00
    Tuyến tính  20,67/1,72  28,67/1,91  20,67/6,89  10,00/1,00
    Theo vị trí 18,40/1,53  27,20/1,81  21,60/7,20  12,80/1,28
    (mỗi ô: doanh thu triệu đồng / ROAS)
    Tổng doanh thu 80, tổng chi 40  ->  ROAS chung 2,0 theo mọi mô hình

(c) Theo last-click, Mạng xã hội và Hiển thị có ROAS 0,00 và sẽ bị cắt.</code></pre>
<p><strong>Vì sao:</strong> last-click không ghi công gì cho Mạng xã hội và Hiển thị, trong khi Hiển thị <em>mở đầu</em> 40 trong 100 hành trình (J2, J4) và Mạng xã hội mở đầu 40 (J1), có mặt trong 80. Cắt chúng nhiều khả năng sẽ làm cạn dòng người về sau tìm kiếm và mở email. ROAS rất cao của Email một phần là ảo: kênh này rẻ và nằm ở cuối hành trình, tiếp cận những người đã biết thương hiệu — không thể mở rộng vô hạn. Lưu ý các mô hình chỉ dịch chuyển công lao; tổng doanh thu và ROAS chung 2,0 không bao giờ đổi. Lời khuyên: giữ Mạng xã hội; giữ Hiển thị nhưng thử nghiệm, vì ngay cả theo các mô hình "rộng lượng" hơn, ROAS của nó (1,00–1,28) vẫn dưới mức trung bình 2,0; chạy thử nghiệm đối chứng hoặc theo vùng để đo phần tăng thêm trước khi cắt lớn; và đánh giá kênh bằng lợi nhuận, không phải doanh thu.</p>`,
  ]]);

const c16q = quiz('mkt304-quiz-7', 'Quiz 7 — Direct & digital|||Quiz 7 — Trực tiếp & số', [
  { id: 'q1', question: 'A direct-mail campaign costs VND 60 million and produces 400 orders. The cost per order is…|||Một chiến dịch thư trực tiếp tốn 60 triệu đồng và mang về 400 đơn hàng. Chi phí mỗi đơn hàng là…', options: ['VND 15,000|||15.000 đồng', 'VND 150,000|||150.000 đồng', 'VND 240,000|||240.000 đồng', 'VND 1,500,000|||1.500.000 đồng'], correctIndex: 1, explanation: 'CPO = 60,000,000 / 400 = VND 150,000.|||CPO = 60.000.000 / 400 = 150.000 đồng.' },
  { id: 'q2', question: 'An ad receives 2,400 clicks from 300,000 impressions. The click-through rate is…|||Một quảng cáo nhận 2.400 lượt nhấp từ 300.000 lượt hiển thị. Tỷ lệ nhấp (CTR) là…', options: ['8%|||8%', '0.08%|||0,08%', '125%|||125%', '0.8%|||0,8%'], correctIndex: 3, explanation: 'CTR = 2,400 / 300,000 = 0.008 = 0.8%.|||CTR = 2.400 / 300.000 = 0,008 = 0,8%.' },
  { id: 'q3', question: 'A journey Display, Social, Email, Search produced 10 conversions. Under a 40/20/40 position-based model, how many conversions go to Social?|||Hành trình Hiển thị, Mạng xã hội, Email, Tìm kiếm tạo ra 10 chuyển đổi. Theo mô hình theo vị trí 40/20/40, Mạng xã hội được bao nhiêu chuyển đổi?', options: ['1|||1', '2|||2', '2.5|||2,5', '4|||4'], correctIndex: 0, explanation: 'Social is a middle touch: the 20% middle share is split between two middle touches, so 10% of 10 = 1.|||Mạng xã hội là điểm chạm giữa: phần 20% chia cho hai điểm giữa, nên được 10% của 10 = 1.' },
]);

const c17 = doc('mkt304-8-1-regulation-vietnam', '8.1 — Ch 20: Regulation of advertising and promotion in Vietnam|||8.1 — Ch 20: Quy định về quảng cáo và khuyến mại tại Việt Nam',
  'Vì sao quản lý quảng cáo, tự quản và quản lý nhà nước, khung pháp lý Việt Nam (Luật Quảng cáo, Luật Thương mại về khuyến mại, cạnh tranh, bảo vệ người tiêu dùng, dữ liệu cá nhân), các cấm đoán và yêu cầu chính, quy tắc khuyến mại, phóng đại (puffery) và tuyên bố phải chứng minh, danh mục tự kiểm tuân thủ — có rào đón, phải kiểm văn bản đang có hiệu lực.',
  [[
    `<span class="eyebrow">MKT304 · Part 8 · Lesson 8.1</span>
<h2>Ch 20 — Regulation of advertising and promotion in Vietnam</h2>
<div class="callout"><span class="badge">Read this first</span> This lesson is general education, not legal advice. Vietnamese laws and decrees on advertising, promotion and data are amended from time to time. Before any real campaign, check the consolidated text currently in force on the national legal database (vbpl.vn) or the ministry's website, and ask a legal adviser when in doubt.</div>
<h3>Why advertising is regulated</h3>
<p>Advertising reaches millions of people who cannot check its claims; unfair ads harm consumers, honest competitors and public trust. Control comes from two sources: <strong>self-regulation</strong> — advertisers' own review, agency and media clearance, industry codes, and the ad policies of platforms such as Google, Meta and TikTok — and <strong>government regulation</strong>. Belch &amp; Belch describe the US system; the MKT304 syllabus requires the Vietnamese one.</p>
<h3>The legal framework (overview)</h3>
<table>
<tr><th>Area</th><th>Main source (check the current version)</th><th>Lead authority</th></tr>
<tr><td>Advertising in general</td><td>The Law on Advertising (enacted 2012, since amended) and its guiding decrees</td><td>Ministry of Culture, Sports and Tourism and provincial departments</td></tr>
<tr><td>Commercial promotion (khuyến mại)</td><td>The Commercial Law (2005) and guiding decrees on trade promotion</td><td>Ministry of Industry and Trade and provincial departments</td></tr>
<tr><td>Misleading information between competitors</td><td>The Competition Law (unfair competition practices)</td><td>Competition authority under the Ministry of Industry and Trade</td></tr>
<tr><td>Consumer protection</td><td>The Law on Protection of Consumer Rights (2023)</td><td>Ministry of Industry and Trade</td></tr>
<tr><td>Health-related products</td><td>Sector laws and decrees (medicines, food safety, cosmetics, medical devices)</td><td>Ministry of Health</td></tr>
<tr><td>Personal data in marketing</td><td>Vietnam's personal data protection rules</td><td>Check the current law and the competent authority</td></tr>
</table>
<h3>Key advertising rules</h3>
<ul>
<li><strong>Products that may not be advertised</strong> — for example tobacco, breast-milk substitutes for young children, prescription medicines to the general public, and alcoholic drinks above a statutory alcohol-strength threshold. Check the full current list.</li>
<li><strong>Prohibited content</strong> includes: false or misleading advertising; ads that discredit other organizations' products; <strong>direct comparison</strong> of your price, quality or effectiveness with other organizations' same-type products; using words such as "nhất", "duy nhất", "tốt nhất", "số một" (the most, the only, the best, number one) or similar <strong>without legal documents proving them</strong>; using a person's image, words or writing without their consent; content harmful to children or contrary to fine customs; infringing intellectual property.</li>
<li><strong>Language</strong> — advertising content must be in Vietnamese, with limited exceptions (for example trademarks and some proper names); rules also govern how foreign-language text may appear alongside it.</li>
<li><strong>Special products</strong> — medicines, health supplements, medical devices, cosmetics and other health-related categories face extra conditions; for several of them the ad content must be confirmed by, or notified to, the competent health authority before it runs. Health-supplement ads must state that the product is not a medicine and does not replace medical treatment.</li>
<li><strong>Online and influencer advertising</strong> — cross-border platforms, online content and people who promote products (influencers, KOLs) have been a focus of recent regulatory updates, including duties to verify what they promote and to make advertising recognisable. Check the provisions currently in force.</li>
</ul>
<h3>Key commercial promotion rules</h3>
<ul>
<li><strong>Forms</strong> recognised by the Commercial Law include free samples, gifts, discounts, purchase vouchers, contests and lucky draws, loyalty programmes and events.</li>
<li><strong>Transparency</strong> — the programme's duration, conditions, prize structure and value must be announced clearly and honoured.</li>
<li><strong>Caps</strong> — the guiding decree sets a ceiling on the value of promotional items and on the discount rate, commonly 50% of the product's price, with exceptions such as concentrated promotion programmes permitted by the authorities. Verify the current figures and exceptions.</li>
<li><strong>Procedures</strong> — most promotions must be notified to the industry and trade authority before they start; lucky-draw (chance-based) promotions need registration or approval, and unclaimed prize value is subject to rules on remittance to the state budget. Check the current procedure.</li>
<li><strong>Prohibitions</strong> include deceptive promotions, promoting goods that are banned or of poor quality, and restrictions on promoting or using certain products (such as alcohol and tobacco) as prizes.</li>
</ul>
<h3>Puffery vs claims that must be substantiated</h3>
<p>In the US tradition described by Belch &amp; Belch, <strong>puffery</strong> is subjective praise that no reasonable consumer takes as a factual promise ("a taste you'll love"); it is generally tolerated. An <strong>objective claim</strong> — a fact that can be true or false — must be <strong>substantiated</strong> with evidence before it is made. Vietnam's rule on superlatives means that many phrases treated as harmless puffery elsewhere need documentary proof here.</p>
<table>
<tr><th>Claim (fictional)</th><th>Type</th><th>What you need</th></tr>
<tr><td>"A fresh start to your day"</td><td>Puffery — subjective, not measurable</td><td>Nothing beyond honesty and taste</td></tr>
<tr><td>"Kills 99.9% of germs in 30 seconds"</td><td>Objective claim</td><td>Valid test results under stated conditions</td></tr>
<tr><td>"Vietnam's number 1 bottled tea"</td><td>Superlative</td><td>Legal documentary proof as required by the advertising law</td></tr>
<tr><td>"Cheaper than Brand X"</td><td>Direct comparison</td><td>Likely prohibited as a direct comparison — redesign the claim</td></tr>
</table>
<h3>A compliance checklist for every campaign</h3>
<ol>
<li>Is the product allowed to be advertised, and does it need content confirmation?</li>
<li>Can every factual claim, number and superlative be proved with documents?</li>
<li>Any direct comparison with competitors? Any use of real people's image or words without consent?</li>
<li>Is the content in Vietnamese as required, and is paid content recognisable as advertising?</li>
<li>For promotions: form, value cap, notification or registration, terms announced?</li>
<li>Personal data: consent and lawful use? Platform ad policies respected?</li>
</ol>
<h3>Review &amp; discussion</h3>
<ol>
<li>Why is a superlative claim riskier in Vietnam than in markets that tolerate puffery?</li>
<li>Redesign the claim "cheaper than Brand X" into a compliant message.</li>
<li>What should an influencer check before accepting a paid post for a health supplement?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 8 · Bài 8.1</span>
<h2>Ch 20 — Quy định về quảng cáo và khuyến mại tại Việt Nam</h2>
<div class="callout"><span class="badge">Đọc trước</span> Bài này mang tính giáo dục chung, không phải tư vấn pháp lý. Luật và nghị định của Việt Nam về quảng cáo, khuyến mại và dữ liệu được sửa đổi theo thời gian. Trước mọi chiến dịch thật, hãy kiểm văn bản hợp nhất đang có hiệu lực trên Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn) hoặc trang của bộ quản lý, và hỏi chuyên gia pháp lý khi còn băn khoăn.</div>
<h3>Vì sao phải quản lý quảng cáo</h3>
<p>Quảng cáo tới hàng triệu người không thể tự kiểm chứng tuyên bố của nó; quảng cáo không lành mạnh gây hại cho người tiêu dùng, cho đối thủ trung thực và cho lòng tin của xã hội. Sự kiểm soát đến từ hai nguồn: <strong>tự quản</strong> — nhà quảng cáo tự rà soát, agency và phương tiện kiểm duyệt, quy tắc ngành, và chính sách quảng cáo của các nền tảng như Google, Meta, TikTok — và <strong>quản lý nhà nước</strong>. Belch &amp; Belch mô tả hệ thống của Hoa Kỳ; đề cương MKT304 yêu cầu hệ thống của Việt Nam.</p>
<h3>Khung pháp lý (tổng quan)</h3>
<table>
<tr><th>Lĩnh vực</th><th>Nguồn chính (kiểm bản đang có hiệu lực)</th><th>Cơ quan chủ trì</th></tr>
<tr><td>Quảng cáo nói chung</td><td>Luật Quảng cáo (ban hành năm 2012, đã được sửa đổi) và các nghị định hướng dẫn</td><td>Bộ Văn hoá, Thể thao và Du lịch và các sở ở địa phương</td></tr>
<tr><td>Khuyến mại</td><td>Luật Thương mại (2005) và các nghị định hướng dẫn về xúc tiến thương mại</td><td>Bộ Công Thương và các sở ở địa phương</td></tr>
<tr><td>Thông tin gây nhầm lẫn giữa các đối thủ</td><td>Luật Cạnh tranh (hành vi cạnh tranh không lành mạnh)</td><td>Cơ quan cạnh tranh thuộc Bộ Công Thương</td></tr>
<tr><td>Bảo vệ người tiêu dùng</td><td>Luật Bảo vệ quyền lợi người tiêu dùng (2023)</td><td>Bộ Công Thương</td></tr>
<tr><td>Sản phẩm liên quan sức khoẻ</td><td>Luật và nghị định chuyên ngành (thuốc, an toàn thực phẩm, mỹ phẩm, trang thiết bị y tế)</td><td>Bộ Y tế</td></tr>
<tr><td>Dữ liệu cá nhân trong marketing</td><td>Quy định về bảo vệ dữ liệu cá nhân của Việt Nam</td><td>Kiểm luật hiện hành và cơ quan có thẩm quyền</td></tr>
</table>
<h3>Các quy định chính về quảng cáo</h3>
<ul>
<li><strong>Sản phẩm không được quảng cáo</strong> — ví dụ thuốc lá, sản phẩm thay thế sữa mẹ cho trẻ nhỏ, thuốc kê đơn (với công chúng), và đồ uống có cồn trên một ngưỡng nồng độ luật định. Kiểm danh mục đầy đủ đang áp dụng.</li>
<li><strong>Nội dung bị cấm</strong> gồm: quảng cáo sai sự thật hoặc gây nhầm lẫn; quảng cáo làm mất uy tín sản phẩm của tổ chức khác; <strong>so sánh trực tiếp</strong> giá cả, chất lượng, hiệu quả sản phẩm của mình với sản phẩm cùng loại của tổ chức, cá nhân khác; dùng các từ "nhất", "duy nhất", "tốt nhất", "số một" hoặc từ ngữ có ý nghĩa tương tự <strong>mà không có tài liệu hợp pháp chứng minh</strong>; dùng hình ảnh, lời nói, chữ viết của cá nhân khi chưa được đồng ý; nội dung gây hại cho trẻ em hoặc trái thuần phong mỹ tục; vi phạm quyền sở hữu trí tuệ.</li>
<li><strong>Ngôn ngữ</strong> — nội dung quảng cáo phải bằng tiếng Việt, trừ một số ngoại lệ (ví dụ nhãn hiệu và một số tên riêng); cũng có quy định về cách chữ nước ngoài được trình bày kèm theo.</li>
<li><strong>Sản phẩm đặc biệt</strong> — thuốc, thực phẩm bảo vệ sức khoẻ, trang thiết bị y tế, mỹ phẩm và các nhóm liên quan tới sức khoẻ khác phải đáp ứng thêm điều kiện; với một số nhóm, nội dung quảng cáo phải được cơ quan y tế có thẩm quyền xác nhận hoặc được thông báo trước khi chạy. Quảng cáo thực phẩm bảo vệ sức khoẻ phải có khuyến cáo rằng sản phẩm không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.</li>
<li><strong>Quảng cáo trực tuyến và người có ảnh hưởng</strong> — nền tảng xuyên biên giới, nội dung trên mạng và người chuyển tải sản phẩm quảng cáo (influencer, KOL) là trọng tâm của các lần cập nhật quy định gần đây, kể cả nghĩa vụ kiểm tra sản phẩm mình quảng bá và làm cho quảng cáo nhận diện được. Kiểm quy định đang có hiệu lực.</li>
</ul>
<h3>Các quy định chính về khuyến mại</h3>
<ul>
<li><strong>Hình thức</strong> được Luật Thương mại thừa nhận gồm hàng mẫu miễn phí, tặng quà, giảm giá, phiếu mua hàng, thi và bốc thăm may rủi, chương trình khách hàng thường xuyên, sự kiện.</li>
<li><strong>Minh bạch</strong> — thời gian, điều kiện, cơ cấu giải thưởng và giá trị của chương trình phải được công bố rõ và thực hiện đúng.</li>
<li><strong>Mức trần</strong> — nghị định hướng dẫn đặt trần cho giá trị hàng hoá dùng để khuyến mại và mức giảm giá, thường là 50% giá sản phẩm, với các ngoại lệ như chương trình khuyến mại tập trung được cơ quan có thẩm quyền cho phép. Kiểm lại con số và ngoại lệ hiện hành.</li>
<li><strong>Thủ tục</strong> — phần lớn chương trình khuyến mại phải thông báo với cơ quan quản lý công thương trước khi thực hiện; khuyến mại mang tính may rủi phải đăng ký hoặc được chấp thuận, và giá trị giải thưởng không có người trúng phải tuân theo quy định về trích nộp ngân sách nhà nước. Kiểm thủ tục hiện hành.</li>
<li><strong>Cấm đoán</strong> gồm khuyến mại gian dối, khuyến mại cho hàng hoá bị cấm hoặc kém chất lượng, và các hạn chế về khuyến mại hay dùng một số sản phẩm (như rượu, thuốc lá) làm giải thưởng.</li>
</ul>
<h3>Phóng đại (puffery) và tuyên bố phải chứng minh</h3>
<p>Theo truyền thống Hoa Kỳ được Belch &amp; Belch mô tả, <strong>puffery</strong> là lời khen chủ quan mà không người tiêu dùng bình thường nào coi là một cam kết thực tế ("hương vị bạn sẽ mê"); nó thường được chấp nhận. Một <strong>tuyên bố khách quan</strong> — một dữ kiện có thể đúng hoặc sai — phải được <strong>chứng minh</strong> bằng bằng chứng trước khi đưa ra. Quy định của Việt Nam về các từ so sánh nhất khiến nhiều cụm từ được coi là phóng đại vô hại ở nơi khác lại cần tài liệu chứng minh ở đây.</p>
<table>
<tr><th>Tuyên bố (giả định)</th><th>Loại</th><th>Cần gì</th></tr>
<tr><td>"Khởi đầu tươi mới cho ngày của bạn"</td><td>Puffery — chủ quan, không đo được</td><td>Không cần gì ngoài sự trung thực và có văn hoá</td></tr>
<tr><td>"Diệt 99,9% vi khuẩn trong 30 giây"</td><td>Tuyên bố khách quan</td><td>Kết quả thử nghiệm hợp lệ trong điều kiện được nêu</td></tr>
<tr><td>"Trà đóng chai số 1 Việt Nam"</td><td>So sánh nhất</td><td>Tài liệu hợp pháp chứng minh theo yêu cầu của pháp luật quảng cáo</td></tr>
<tr><td>"Rẻ hơn Nhãn hiệu X"</td><td>So sánh trực tiếp</td><td>Nhiều khả năng bị cấm vì là so sánh trực tiếp — thiết kế lại tuyên bố</td></tr>
</table>
<h3>Danh mục tự kiểm tuân thủ cho mọi chiến dịch</h3>
<ol>
<li>Sản phẩm có được phép quảng cáo không, có cần xác nhận nội dung không?</li>
<li>Mọi tuyên bố dữ kiện, con số và từ so sánh nhất có tài liệu chứng minh không?</li>
<li>Có so sánh trực tiếp với đối thủ không? Có dùng hình ảnh, lời nói của người thật khi chưa được đồng ý không?</li>
<li>Nội dung có bằng tiếng Việt theo yêu cầu, và nội dung trả phí có nhận diện được là quảng cáo không?</li>
<li>Với khuyến mại: hình thức, mức trần giá trị, thông báo hoặc đăng ký, thể lệ đã công bố chưa?</li>
<li>Dữ liệu cá nhân: có sự đồng ý và sử dụng hợp pháp không? Có tuân thủ chính sách quảng cáo của nền tảng không?</li>
</ol>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Vì sao tuyên bố so sánh nhất rủi ro hơn ở Việt Nam so với các thị trường chấp nhận puffery?</li>
<li>Thiết kế lại tuyên bố "rẻ hơn Nhãn hiệu X" thành một thông điệp tuân thủ.</li>
<li>Một influencer nên kiểm tra gì trước khi nhận đăng bài trả phí cho một thực phẩm bảo vệ sức khoẻ?</li>
</ol>`,
  ]]);

const c18 = doc('mkt304-8-2-social-ethical-economic', '8.2 — Ch 21: Social, ethical and economic aspects of advertising|||8.2 — Ch 21: Khía cạnh xã hội, đạo đức và kinh tế của quảng cáo',
  'Đạo đức và pháp luật, các vấn đề đạo đức (quảng cáo cho trẻ em, nội dung phản cảm, định kiến, thao túng, đánh giá giả, nhắm nhóm dễ tổn thương), tranh luận “tấm gương” (Pollay – Holbrook), tác động kinh tế và hai trường phái (quyền lực thị trường và thông tin), công cụ TARES.',
  [[
    `<span class="eyebrow">MKT304 · Part 8 · Lesson 8.2</span>
<h2>Ch 21 — Evaluating the social, ethical and economic aspects of advertising</h2>
<h3>Ethics is more than legality</h3>
<p><strong>Ethics</strong> are moral principles that guide individuals and organizations; an ad can be legal and still unethical. Because advertising is highly visible and persuasive by design, it attracts continual criticism — some fair, some exaggerated. Marketers need to understand the criticisms well enough to answer them honestly.</p>
<h3>Ethical issues in advertising</h3>
<ul>
<li><strong>Advertising to children</strong> — young children may not understand persuasive intent; concerns about food high in sugar and fat, toys, games and in-app purchases.</li>
<li><strong>Offensive or tasteless advertising</strong> — shock tactics, sexual appeals, insensitive humour; what offends differs across cultures and generations.</li>
<li><strong>Stereotyping</strong> — narrow portrayals of gender, age, ethnicity, body types or regions.</li>
<li><strong>Manipulation</strong> — fears about subliminal messages (research offers little evidence that they work, but the public concern persists) and, today, dark patterns and hyper-targeting.</li>
<li><strong>Deception and undisclosed persuasion</strong> — misleading claims, fake reviews, paid posts presented as independent opinion.</li>
<li><strong>Targeting vulnerable groups</strong> — people in debt, the sick, the elderly, addictive products.</li>
<li><strong>Materialism</strong> — does advertising teach people to measure happiness by possessions?</li>
<li><strong>Influence on media</strong> — advertisers may pressure media to avoid content that could hurt them.</li>
</ul>
<h3>Mirror or mould?</h3>
<p>A classic debate: Richard Pollay argued that advertising is a <strong>"distorted mirror"</strong> — it reflects only selected values (status, beauty, youth) and, by repeating them, reinforces them. Morris Holbrook replied that advertising mostly <strong>mirrors</strong> values already present in society and that its power to change deep values is overstated. The practical conclusion for IMC: even if one ad changes little, the combined weight of all ads matters, so each brand shares responsibility for the picture of life it shows.</p>
<h3>Economic effects of advertising</h3>
<table>
<tr><th>Question</th><th>Critics say</th><th>Defenders say</th></tr>
<tr><td>Consumer choice</td><td>Big brands crowd out small ones</td><td>Advertising helps new brands get known; differentiation widens choice</td></tr>
<tr><td>Competition</td><td>Large budgets are a barrier to entry</td><td>Advertising is how challengers attack leaders</td></tr>
<tr><td>Product costs and prices</td><td>Advertising adds cost that consumers pay</td><td>It creates economies of scale and lowers search costs; price advertising increases price competition</td></tr>
<tr><td>Information</td><td>Ads are persuasion, not information</td><td>Ads inform people about products, prices and features</td></tr>
</table>
<p>Mark Albion and Paul Farris summarised two schools of thought. In the <strong>"advertising = market power"</strong> view, advertising persuades, differentiates products, makes consumers less price-sensitive, raises barriers to entry and allows higher prices. In the <strong>"advertising = information"</strong> view, advertising informs, makes consumers more price-sensitive, lowers barriers to entry for newcomers and increases competition, leading to lower prices. Evidence supports each view in different markets; the effect depends on the product, the market and the content of the ads.</p>
<h3>A practical ethics tool: TARES</h3>
<p>Sherry Baker and David Martinson proposed the <strong>TARES</strong> test for persuasive communication:</p>
<table>
<tr><th>Letter</th><th>Question</th></tr>
<tr><td>T — Truthfulness</td><td>Is the message true, and does it avoid misleading impressions?</td></tr>
<tr><td>A — Authenticity</td><td>Would I feel comfortable being identified as its author? Does it serve a real need?</td></tr>
<tr><td>R — Respect</td><td>Does it respect the audience as people who can decide for themselves?</td></tr>
<tr><td>E — Equity</td><td>Is it fair to the audience, including the vulnerable?</td></tr>
<tr><td>S — Social responsibility</td><td>Is it responsible towards society as a whole?</td></tr>
</table>
<div class="callout"><span class="badge">AI link</span> Generative AI raises the same questions at scale — fake testimonials, deepfakes, biased images. Lesson 9.2 applies these principles to AI.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Is advertising to children ever acceptable? Under what conditions?</li>
<li>Apply TARES to an ad that uses fear to sell an insurance product.</li>
<li>In which markets would the "advertising = information" view be most convincing? Why?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 8 · Bài 8.2</span>
<h2>Ch 21 — Đánh giá khía cạnh xã hội, đạo đức và kinh tế của quảng cáo</h2>
<h3>Đạo đức rộng hơn pháp luật</h3>
<p><strong>Đạo đức</strong> là các nguyên tắc luân lý định hướng cá nhân và tổ chức; một quảng cáo có thể hợp pháp mà vẫn phi đạo đức. Vì quảng cáo rất dễ thấy và được thiết kế để thuyết phục, nó liên tục bị phê phán — có lời công bằng, có lời phóng đại. Người làm marketing cần hiểu các lời phê phán đủ rõ để trả lời một cách trung thực.</p>
<h3>Các vấn đề đạo đức trong quảng cáo</h3>
<ul>
<li><strong>Quảng cáo nhắm tới trẻ em</strong> — trẻ nhỏ có thể chưa hiểu ý đồ thuyết phục; lo ngại về thực phẩm nhiều đường và chất béo, đồ chơi, trò chơi và mua hàng trong ứng dụng.</li>
<li><strong>Quảng cáo phản cảm hoặc thiếu văn hoá</strong> — chiêu gây sốc, khai thác tình dục, hài hước vô duyên; điều gây phản cảm khác nhau giữa các nền văn hoá và thế hệ.</li>
<li><strong>Định kiến</strong> — khắc hoạ hẹp hòi về giới, tuổi, dân tộc, hình thể hay vùng miền.</li>
<li><strong>Thao túng</strong> — nỗi lo về thông điệp tiềm thức (nghiên cứu cho thấy ít bằng chứng rằng chúng hiệu quả, nhưng mối lo của công chúng vẫn còn) và ngày nay là thiết kế lừa người dùng (dark patterns) và nhắm chọn quá mức.</li>
<li><strong>Lừa dối và thuyết phục không công khai</strong> — tuyên bố gây nhầm lẫn, đánh giá giả, bài trả phí trình bày như ý kiến độc lập.</li>
<li><strong>Nhắm tới nhóm dễ tổn thương</strong> — người mắc nợ, người bệnh, người cao tuổi, sản phẩm gây nghiện.</li>
<li><strong>Chủ nghĩa vật chất</strong> — quảng cáo có dạy người ta đo hạnh phúc bằng của cải không?</li>
<li><strong>Ảnh hưởng tới truyền thông</strong> — nhà quảng cáo có thể gây áp lực để báo chí tránh nội dung bất lợi cho họ.</li>
</ul>
<h3>Tấm gương hay khuôn đúc?</h3>
<p>Một tranh luận kinh điển: Richard Pollay cho rằng quảng cáo là <strong>"tấm gương méo"</strong> — nó chỉ phản chiếu một số giá trị được chọn (địa vị, sắc đẹp, tuổi trẻ) và, bằng cách lặp lại, củng cố chúng. Morris Holbrook đáp rằng quảng cáo chủ yếu <strong>phản chiếu</strong> các giá trị đã có sẵn trong xã hội và sức mạnh thay đổi giá trị sâu xa của nó bị thổi phồng. Kết luận thực tế cho IMC: dù một quảng cáo riêng lẻ thay đổi được ít, sức nặng cộng dồn của mọi quảng cáo vẫn đáng kể, nên mỗi thương hiệu cùng chịu trách nhiệm về bức tranh cuộc sống mà nó thể hiện.</p>
<h3>Tác động kinh tế của quảng cáo</h3>
<table>
<tr><th>Câu hỏi</th><th>Người phê phán nói</th><th>Người bảo vệ nói</th></tr>
<tr><td>Lựa chọn của người tiêu dùng</td><td>Thương hiệu lớn chèn ép thương hiệu nhỏ</td><td>Quảng cáo giúp thương hiệu mới được biết đến; khác biệt hoá mở rộng lựa chọn</td></tr>
<tr><td>Cạnh tranh</td><td>Ngân sách lớn là rào cản gia nhập</td><td>Quảng cáo là cách kẻ thách thức tấn công bên dẫn đầu</td></tr>
<tr><td>Chi phí sản phẩm và giá</td><td>Quảng cáo cộng thêm chi phí mà người tiêu dùng phải trả</td><td>Nó tạo lợi thế kinh tế theo quy mô và giảm chi phí tìm kiếm; quảng cáo giá làm tăng cạnh tranh về giá</td></tr>
<tr><td>Thông tin</td><td>Quảng cáo là thuyết phục, không phải thông tin</td><td>Quảng cáo cho người ta biết về sản phẩm, giá và tính năng</td></tr>
</table>
<p>Mark Albion và Paul Farris tóm lược hai trường phái. Theo quan điểm <strong>"quảng cáo = quyền lực thị trường"</strong>, quảng cáo thuyết phục, khác biệt hoá sản phẩm, làm người tiêu dùng kém nhạy cảm với giá, dựng rào cản gia nhập và cho phép đặt giá cao hơn. Theo quan điểm <strong>"quảng cáo = thông tin"</strong>, quảng cáo cung cấp thông tin, làm người tiêu dùng nhạy cảm hơn với giá, hạ rào cản gia nhập cho người mới và tăng cạnh tranh, dẫn tới giá thấp hơn. Bằng chứng ủng hộ mỗi quan điểm ở những thị trường khác nhau; tác động phụ thuộc vào sản phẩm, thị trường và nội dung quảng cáo.</p>
<h3>Một công cụ đạo đức thực hành: TARES</h3>
<p>Sherry Baker và David Martinson đề xuất phép thử <strong>TARES</strong> cho truyền thông thuyết phục:</p>
<table>
<tr><th>Chữ cái</th><th>Câu hỏi</th></tr>
<tr><td>T — Trung thực (Truthfulness)</td><td>Thông điệp có đúng sự thật và tránh gây ấn tượng sai lệch không?</td></tr>
<tr><td>A — Chân thực (Authenticity)</td><td>Tôi có thấy thoải mái khi được nêu tên là tác giả không? Nó có phục vụ một nhu cầu thật không?</td></tr>
<tr><td>R — Tôn trọng (Respect)</td><td>Nó có tôn trọng công chúng như những người tự quyết định được không?</td></tr>
<tr><td>E — Công bằng (Equity)</td><td>Nó có công bằng với công chúng, kể cả nhóm dễ tổn thương không?</td></tr>
<tr><td>S — Trách nhiệm xã hội (Social responsibility)</td><td>Nó có trách nhiệm với xã hội nói chung không?</td></tr>
</table>
<div class="callout"><span class="badge">Liên kết AI</span> AI tạo sinh đặt ra đúng những câu hỏi này ở quy mô lớn — lời chứng thực giả, deepfake, hình ảnh thiên lệch. Bài 9.2 áp dụng các nguyên tắc này cho AI.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Quảng cáo nhắm tới trẻ em có bao giờ chấp nhận được không? Với điều kiện gì?</li>
<li>Áp dụng TARES cho một quảng cáo dùng nỗi sợ để bán sản phẩm bảo hiểm.</li>
<li>Ở thị trường nào quan điểm "quảng cáo = thông tin" thuyết phục nhất? Vì sao?</li>
</ol>`,
  ]]);

const c18q = quiz('mkt304-quiz-8', 'Quiz 8 — Regulation & ethics|||Quiz 8 — Quy định & đạo đức', [
  { id: 'q1', question: 'Under Vietnam’s advertising law, a claim such as “the number 1 bottled tea” may be used only if…|||Theo pháp luật quảng cáo Việt Nam, tuyên bố như “trà đóng chai số 1” chỉ được dùng khi…', options: ['the brand has advertised for more than one year|||thương hiệu đã quảng cáo hơn một năm', 'the claim is written in English|||tuyên bố được viết bằng tiếng Anh', 'the advertiser has legal documents proving it|||nhà quảng cáo có tài liệu hợp pháp chứng minh', 'the ad runs only on social media|||quảng cáo chỉ chạy trên mạng xã hội'], correctIndex: 2, explanation: 'Superlatives such as the best or number one require legal documentary proof; language or channel does not change this.|||Các từ so sánh nhất như tốt nhất, số một cần tài liệu hợp pháp chứng minh; ngôn ngữ hay kênh không thay đổi điều này.' },
  { id: 'q2', question: 'Which claim is the clearest example of puffery?|||Tuyên bố nào là ví dụ rõ nhất của puffery (phóng đại chủ quan)?', options: ['Contains 30% less sugar than our previous recipe|||Ít hơn 30% đường so với công thức cũ của chúng tôi', 'A fresh start to your day|||Khởi đầu tươi mới cho ngày của bạn', 'Kills 99.9% of germs in 30 seconds|||Diệt 99,9% vi khuẩn trong 30 giây', 'Cheaper than Brand X at every store|||Rẻ hơn Nhãn hiệu X ở mọi cửa hàng'], correctIndex: 1, explanation: 'Puffery is subjective and not measurable; the other three are objective claims that must be substantiated (and the last is a direct comparison).|||Puffery là chủ quan và không đo được; ba tuyên bố còn lại là tuyên bố khách quan phải chứng minh (và cái cuối là so sánh trực tiếp).' },
  { id: 'q3', question: 'In the “advertising = information” school of thought, advertising tends to…|||Theo trường phái “quảng cáo = thông tin”, quảng cáo có xu hướng…', options: ['make consumers less price-sensitive and raise prices|||làm người tiêu dùng kém nhạy cảm với giá và đẩy giá lên', 'create barriers that keep new firms out|||tạo rào cản ngăn doanh nghiệp mới gia nhập', 'reduce the number of brands consumers can choose from|||giảm số thương hiệu người tiêu dùng có thể chọn', 'make consumers more price-sensitive and increase competition|||làm người tiêu dùng nhạy cảm hơn với giá và tăng cạnh tranh'], correctIndex: 3, explanation: 'The first three options describe the “advertising = market power” school.|||Ba phương án đầu mô tả trường phái “quảng cáo = quyền lực thị trường”.' },
]);

const c19 = doc('mkt304-9-1-imc-vietnam', '9.1 — IMC in Vietnam: agencies, media landscape and trends|||9.1 — IMC tại Việt Nam: agency, bối cảnh truyền thông và xu hướng',
  'Các bên trong ngành truyền thông marketing Việt Nam (nhà quảng cáo, agency quảng cáo, media agency, công ty PR, agency số và KOL, nền tảng), vai trò của agency quảng cáo và agency PR, đặc điểm thị trường và xu hướng IMC trên thế giới và tại Việt Nam — định tính, không dùng số liệu bịa; nguồn dữ liệu cho bài nhóm.',
  [[
    `<span class="eyebrow">MKT304 · Part 9 · Lesson 9.1</span>
<h2>IMC in Vietnam</h2>
<p class="lead">This lesson applies the course to the Vietnamese market. It is deliberately qualitative: market sizes and shares change quickly and are often quoted without sources. For your group plan, find current figures in credible, cited sources — never in a slide deck without a source or in an AI chatbot's answer.</p>
<h3>Who does what</h3>
<table>
<tr><th>Player</th><th>Typical role</th></tr>
<tr><td>Advertisers</td><td>Local conglomerates and FMCG makers, multinational brands, banks and fintechs, e-commerce sellers and start-ups; many run strong in-house marketing and content teams</td></tr>
<tr><td>Advertising / creative agencies</td><td>Brand strategy, big ideas, campaign creative (TVCs, key visuals, digital content); both multinational networks and local independents operate</td></tr>
<tr><td>Media agencies / media specialists</td><td>Media planning and buying, programmatic trading, measurement</td></tr>
<tr><td>PR agencies</td><td>Media relations, events, crisis communication, corporate reputation, stakeholder relations</td></tr>
<tr><td>Digital, performance and social agencies</td><td>Social content, community management, search and performance advertising, e-commerce operations</td></tr>
<tr><td>KOL/KOC agencies and creator networks</td><td>Finding, contracting and managing influencers and creators; livestream selling</td></tr>
<tr><td>Platforms and media owners</td><td>Global platforms, local social and messaging apps, e-commerce marketplaces with retail media, TV and online publishers, OOH companies</td></tr>
<tr><td>Research and production</td><td>Market research, social listening, production houses, activation and event companies</td></tr>
</table>
<p><strong>Advertising agency vs PR agency.</strong> The advertising agency mostly works with <em>paid</em> and owned media and controls the message; the PR agency mostly works with <em>earned</em> media and relationships, where the message is shaped by third parties. In IMC they must share one brief and one calendar — for example, a launch in which PR creates news, the ad agency supplies the key visual and film, the media agency amplifies the best-performing pieces, and KOCs demonstrate the product.</p>
<h3>Distinctive features of the Vietnamese market (qualitative)</h3>
<ul>
<li><strong>Mobile-first, social-first</strong> — much discovery happens on social and short-video platforms and in messaging apps.</li>
<li><strong>Social commerce and livestream selling</strong> — the line between content, advertising and the shop is thin; creators sell directly.</li>
<li><strong>KOC reviews and word of mouth</strong> — ordinary users' reviews carry weight, but fake reviews and undisclosed paid posts damage trust.</li>
<li><strong>Seasonal peaks</strong> — Tet is the biggest communication season, with emotional family and homecoming themes; e-commerce "double-day" sales and mid-year and year-end sales create further peaks.</li>
<li><strong>Regional and urban–rural differences</strong> in taste, language and media use.</li>
<li><strong>A promotion-heavy culture</strong> — useful for trial, risky for brand equity (the sales promotion trap, Ch 16).</li>
</ul>
<h3>Trends in IMC — worldwide and in Vietnam</h3>
<ol>
<li><strong>Short-form video and the creator economy</strong> — brands work with many smaller creators rather than one celebrity.</li>
<li><strong>Retail media and commerce media</strong> — advertising sold by marketplaces and retailers, close to the purchase.</li>
<li><strong>First-party data and privacy</strong> — stricter data rules and platform changes push brands to build their own consented data.</li>
<li><strong>AI across the workflow</strong> — research, content, personalization and automated media buying (lesson 9.2).</li>
<li><strong>Measurement that goes beyond last-click</strong> — marketing-mix modelling and incrementality tests (Ex 3).</li>
<li><strong>Purpose and sustainability communication</strong> — with growing scrutiny of "greenwashing" claims that cannot be substantiated.</li>
<li><strong>Brand safety and trust</strong> — fighting fake news, fraud, fake reviews and deepfakes.</li>
</ol>
<h3>Where to find evidence for your plan</h3>
<p>The syllabus requires your group IMC plan to rest on real evidence: reports, articles, databases, official websites or your own primary data. Good sources include official statistics and ministry websites, company annual reports and official brand pages, reputable business media, platform insight portals (for example Think with Google), academic databases via Google Scholar, and your own survey or interviews. Always cite the source and date of every figure.</p>
<div class="callout"><span class="badge">Careers</span> Roles in the Vietnamese IMC industry include account executive/manager, strategic planner, copywriter, art director, media planner/buyer, PR executive, social media and content executive, performance marketer, KOL manager and brand manager on the client side.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Map one recent Tet campaign you saw onto paid, owned and earned media. Which agency types were probably involved?</li>
<li>How should a brand divide work between an ad agency and a PR agency for a product launch?</li>
<li>Which of the seven trends matters most for a small Vietnamese consumer brand? Why?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 9 · Bài 9.1</span>
<h2>IMC tại Việt Nam</h2>
<p class="lead">Bài này áp dụng môn học vào thị trường Việt Nam. Bài cố ý chỉ phân tích định tính: quy mô và thị phần thị trường thay đổi nhanh và thường được trích mà không có nguồn. Với kế hoạch nhóm, hãy tìm số liệu mới trong các nguồn đáng tin, có trích dẫn — đừng lấy từ một bộ slide không nguồn hay từ câu trả lời của chatbot AI.</p>
<h3>Ai làm gì</h3>
<table>
<tr><th>Bên tham gia</th><th>Vai trò điển hình</th></tr>
<tr><td>Nhà quảng cáo</td><td>Tập đoàn trong nước và nhà sản xuất hàng tiêu dùng nhanh, thương hiệu đa quốc gia, ngân hàng và fintech, người bán hàng trên sàn thương mại điện tử và start-up; nhiều bên có đội marketing và nội dung nội bộ mạnh</td></tr>
<tr><td>Agency quảng cáo / sáng tạo</td><td>Chiến lược thương hiệu, ý tưởng lớn, sáng tạo chiến dịch (TVC, key visual, nội dung số); có cả mạng lưới đa quốc gia lẫn agency độc lập trong nước</td></tr>
<tr><td>Media agency / công ty chuyên về phương tiện</td><td>Hoạch định và mua phương tiện, giao dịch programmatic, đo lường</td></tr>
<tr><td>Agency PR</td><td>Quan hệ báo chí, sự kiện, truyền thông khủng hoảng, danh tiếng doanh nghiệp, quan hệ với các bên liên quan</td></tr>
<tr><td>Agency số, hiệu suất và mạng xã hội</td><td>Nội dung mạng xã hội, quản lý cộng đồng, quảng cáo tìm kiếm và hiệu suất, vận hành thương mại điện tử</td></tr>
<tr><td>Agency KOL/KOC và mạng lưới nhà sáng tạo</td><td>Tìm, ký hợp đồng và quản lý người có ảnh hưởng, nhà sáng tạo nội dung; bán hàng qua livestream</td></tr>
<tr><td>Nền tảng và chủ phương tiện</td><td>Nền tảng toàn cầu, ứng dụng mạng xã hội và nhắn tin trong nước, sàn thương mại điện tử có retail media, truyền hình và báo điện tử, công ty quảng cáo ngoài trời</td></tr>
<tr><td>Nghiên cứu và sản xuất</td><td>Nghiên cứu thị trường, lắng nghe mạng xã hội, nhà sản xuất phim, công ty activation và sự kiện</td></tr>
</table>
<p><strong>Agency quảng cáo và agency PR.</strong> Agency quảng cáo chủ yếu làm với phương tiện <em>trả phí</em> và owned, và kiểm soát thông điệp; agency PR chủ yếu làm với phương tiện <em>earned</em> và các mối quan hệ, nơi thông điệp được bên thứ ba định hình. Trong IMC, hai bên phải dùng chung một brief và một lịch — ví dụ một đợt ra mắt trong đó PR tạo tin tức, agency quảng cáo cung cấp key visual và phim, media agency khuếch đại những nội dung hiệu quả nhất, và KOC trình diễn sản phẩm.</p>
<h3>Đặc điểm của thị trường Việt Nam (định tính)</h3>
<ul>
<li><strong>Di động trước, mạng xã hội trước</strong> — phần lớn việc khám phá diễn ra trên mạng xã hội, nền tảng video ngắn và ứng dụng nhắn tin.</li>
<li><strong>Thương mại xã hội và bán hàng livestream</strong> — ranh giới giữa nội dung, quảng cáo và cửa hàng rất mỏng; nhà sáng tạo bán hàng trực tiếp.</li>
<li><strong>Đánh giá của KOC và truyền miệng</strong> — đánh giá của người dùng bình thường có sức nặng, nhưng đánh giá giả và bài trả phí không công khai làm tổn hại lòng tin.</li>
<li><strong>Mùa cao điểm</strong> — Tết là mùa truyền thông lớn nhất, với chủ đề cảm xúc về gia đình, về nhà; các đợt sale "ngày đôi" trên sàn thương mại điện tử và sale giữa năm, cuối năm tạo thêm các đỉnh.</li>
<li><strong>Khác biệt vùng miền và thành thị – nông thôn</strong> về khẩu vị, ngôn ngữ và thói quen dùng phương tiện.</li>
<li><strong>Văn hoá chuộng khuyến mại</strong> — hữu ích để kích thích dùng thử, rủi ro cho giá trị thương hiệu (bẫy khuyến mại, Ch 16).</li>
</ul>
<h3>Xu hướng IMC — trên thế giới và tại Việt Nam</h3>
<ol>
<li><strong>Video ngắn và nền kinh tế nhà sáng tạo</strong> — thương hiệu làm việc với nhiều nhà sáng tạo nhỏ thay vì một người nổi tiếng.</li>
<li><strong>Retail media và commerce media</strong> — quảng cáo do sàn và nhà bán lẻ bán, sát điểm mua.</li>
<li><strong>Dữ liệu bên thứ nhất và quyền riêng tư</strong> — quy định dữ liệu chặt hơn và thay đổi của nền tảng buộc thương hiệu xây dựng dữ liệu riêng có sự đồng ý.</li>
<li><strong>AI trong toàn bộ quy trình</strong> — nghiên cứu, nội dung, cá nhân hoá và mua phương tiện tự động (bài 9.2).</li>
<li><strong>Đo lường vượt ra ngoài last-click</strong> — mô hình marketing mix và thử nghiệm tăng thêm (Bài tập 3).</li>
<li><strong>Truyền thông về mục đích và phát triển bền vững</strong> — cùng với sự soi xét ngày càng chặt đối với các tuyên bố "tẩy xanh" (greenwashing) không chứng minh được.</li>
<li><strong>An toàn thương hiệu và lòng tin</strong> — chống tin giả, gian lận, đánh giá giả và deepfake.</li>
</ol>
<h3>Tìm bằng chứng cho kế hoạch ở đâu</h3>
<p>Đề cương yêu cầu kế hoạch IMC của nhóm phải dựa trên bằng chứng thật: báo cáo, bài báo, cơ sở dữ liệu, website chính thức hoặc dữ liệu sơ cấp do nhóm tự thu. Nguồn tốt gồm số liệu thống kê chính thức và website của các bộ, báo cáo thường niên và trang chính thức của doanh nghiệp, báo chí kinh doanh uy tín, cổng insight của nền tảng (ví dụ Think with Google), cơ sở dữ liệu học thuật qua Google Scholar, và khảo sát hay phỏng vấn của chính nhóm. Luôn ghi nguồn và thời điểm của mọi con số.</p>
<div class="callout"><span class="badge">Nghề nghiệp</span> Các vị trí trong ngành IMC Việt Nam gồm account executive/manager, strategic planner, copywriter, art director, media planner/buyer, PR executive, chuyên viên mạng xã hội và nội dung, performance marketer, KOL manager và brand manager phía khách hàng.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Xếp một chiến dịch Tết gần đây bạn đã thấy vào paid, owned và earned media. Có lẽ những loại agency nào đã tham gia?</li>
<li>Thương hiệu nên chia việc giữa agency quảng cáo và agency PR thế nào cho một đợt ra mắt sản phẩm?</li>
<li>Xu hướng nào trong bảy xu hướng quan trọng nhất với một thương hiệu tiêu dùng nhỏ của Việt Nam? Vì sao?</li>
</ol>`,
  ]]);

const c20 = doc('mkt304-9-2-ai-in-imc', '9.2 — AI in IMC: ideation, customer journeys, copy and ethical risks|||9.2 — AI trong IMC: ý tưởng, hành trình khách hàng, nội dung và rủi ro đạo đức',
  'CLO4: AI ở từng bước của mô hình hoạch định IMC (nghiên cứu, hành trình khách hàng, brainstorm ý tưởng, headline/slogan, hiệu đính, thiết kế trình bày), khung viết prompt kèm ví dụ, tiêu chí đánh giá công cụ AI, rủi ro đạo đức (bản quyền, deepfake, minh bạch, thiên lệch, bịa đặt, dữ liệu) và quy trình có con người kiểm soát.',
  [[
    `<span class="eyebrow">MKT304 · Part 9 · Lesson 9.2</span>
<h2>AI in IMC</h2>
<p class="lead">The MKT304 syllabus explicitly integrates AI tools for brainstorming and editing — campaign ideas, customer journey maps, ad concepts, headlines, slogans, proofreading and presentation design — and requires you to evaluate AI tools and handle their ethical risks critically (CLO4).</p>
<h3>Where AI fits in the IMC planning model</h3>
<table>
<tr><th>Planning step</th><th>Useful AI tasks</th><th>Human must still…</th></tr>
<tr><td>Situation analysis</td><td>Summarise long reports; cluster open-ended survey answers; draft interview guides</td><td>Check every fact against the original source</td></tr>
<tr><td>Target and insight</td><td>Draft personas and <strong>customer journey maps</strong> (stages, touch points, pains, questions)</td><td>Validate with real customers and data</td></tr>
<tr><td>Creative strategy</td><td>Brainstorm many concepts, <strong>headlines and slogans</strong>; rewrite in different tones; storyboard ideas</td><td>Choose for relevance and brand fit; check originality and trademarks</td></tr>
<tr><td>Media and budget</td><td>Build scenario spreadsheets; explain metrics; draft flowcharts</td><td>Verify calculations and assumptions</td></tr>
<tr><td>Execution</td><td>Proofread, shorten, translate, adapt copy to formats; design presentation layouts; mock-up visuals</td><td>Final edit, legal review, brand approval</td></tr>
<tr><td>Evaluation</td><td>Summarise comments and reviews; draft reports</td><td>Interpret results; decide</td></tr>
</table>
<h3>Writing a useful prompt</h3>
<p>A reliable structure is: <strong>role</strong> → <strong>context</strong> (brand, audience, insight, objective) → <strong>task</strong> → <strong>constraints</strong> (length, tone, legal limits) → <strong>output format</strong> → examples, then iterate. Ask for several options with reasons, and ask the model to critique its own work.</p>
<pre><code class="language-text">Role: You are a senior copywriter at a Vietnamese creative agency.
Context: LumaTea (fictional) is a low-sugar bottled tea for students aged 18-24
in Ho Chi Minh City. Insight: they want a drink that keeps them going through
long study sessions without feeling heavy. Objective: raise awareness at launch.
Task: write 10 slogan options in Vietnamese and English.
Constraints: max 6 words; no superlatives such as "best" or "number 1";
no health claims; friendly, witty tone.
Format: a table with slogan, tone, and one-line rationale.
Then: pick the 3 strongest and explain the risks of each.</code></pre>
<h3>Evaluating AI tools</h3>
<table>
<tr><th>Criterion</th><th>Question to ask</th></tr>
<tr><td>Output quality and relevance</td><td>Does it produce usable, on-brief work in Vietnamese and English?</td></tr>
<tr><td>Accuracy</td><td>How often does it invent facts, sources or numbers (hallucinate)?</td></tr>
<tr><td>Control and brand voice</td><td>Can it follow a style guide consistently?</td></tr>
<tr><td>Data privacy and security</td><td>Where do inputs go? Are they used to train the model? May we enter client data?</td></tr>
<tr><td>Intellectual property and licence</td><td>May outputs be used commercially? Who owns them? Any indemnity?</td></tr>
<tr><td>Bias</td><td>Do generated images and texts stereotype people or regions?</td></tr>
<tr><td>Cost and workflow fit</td><td>Price, integration with existing tools, team skills needed</td></tr>
</table>
<p>Evaluate with a fixed test set (the same five briefs for every tool) and a scoring rubric rated by at least two people — the same logic as pre-testing ads.</p>
<h3>Ethical risks</h3>
<ul>
<li><strong>Copyright</strong> — rules on training data and on who owns AI output are unsettled; do not imitate protected works, living artists' distinctive styles or other brands' trademarks.</li>
<li><strong>Deepfakes and likeness</strong> — never generate a real person's face or voice without consent; in Vietnam, using an individual's image or words in advertising without consent is prohibited.</li>
<li><strong>Transparency</strong> — label AI-generated or AI-altered content where platform policies or law require it, and be honest with clients about how work was made.</li>
<li><strong>Bias and stereotyping</strong> — models reproduce patterns in their data; review outputs for gender, age, skin tone and regional stereotypes.</li>
<li><strong>Invented claims</strong> — AI may state "facts", statistics or sources that do not exist; every claim in an ad must be substantiated (Ch 20).</li>
<li><strong>Privacy</strong> — do not paste customer data or confidential client information into public tools.</li>
<li><strong>Sameness</strong> — if everyone prompts the same tools, creative work converges; divergence (Ch 8) still needs human insight.</li>
</ul>
<h3>A human-in-the-loop workflow</h3>
<pre><code class="language-text">Brief (human) -> Generate options (AI) -> Select and improve (human)
-> Fact, legal and brand check (human) -> Test with the audience -> Disclose where required</code></pre>
<div class="callout"><span class="badge">Syllabus note</span> The AI component of the course grade is completed through Coursera guided projects named in the syllabus: "ChatGPT for Beginners: Using AI for Market Research" and "Prompt Engineering Generative AI for Marketing &amp; Advertising". Search for them by title on Coursera.</div>
<h3>Review &amp; discussion</h3>
<ol>
<li>Use an AI tool to draft a customer journey map for a fictional brand. List three things it got wrong or assumed.</li>
<li>Compare two AI tools with the criteria table. Which would you let an agency use with client data?</li>
<li>Where would you draw the line between "AI-assisted" and "AI-generated" creative work, and should the audience be told?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 9 · Bài 9.2</span>
<h2>AI trong IMC</h2>
<p class="lead">Đề cương MKT304 tích hợp rõ ràng công cụ AI cho việc brainstorm và biên tập — ý tưởng chiến dịch, bản đồ hành trình khách hàng, concept quảng cáo, headline, slogan, hiệu đính và thiết kế trình bày — và yêu cầu bạn đánh giá công cụ AI, xử lý phê phán các rủi ro đạo đức của chúng (CLO4).</p>
<h3>AI nằm ở đâu trong mô hình hoạch định IMC</h3>
<table>
<tr><th>Bước hoạch định</th><th>Việc AI hỗ trợ tốt</th><th>Con người vẫn phải…</th></tr>
<tr><td>Phân tích tình thế</td><td>Tóm tắt báo cáo dài; gom nhóm câu trả lời mở trong khảo sát; soạn khung phỏng vấn</td><td>Kiểm mọi dữ kiện với nguồn gốc</td></tr>
<tr><td>Mục tiêu và insight</td><td>Phác thảo chân dung khách hàng và <strong>bản đồ hành trình khách hàng</strong> (giai đoạn, điểm tiếp xúc, nỗi đau, câu hỏi)</td><td>Kiểm chứng với khách hàng thật và dữ liệu</td></tr>
<tr><td>Chiến lược sáng tạo</td><td>Brainstorm nhiều concept, <strong>headline và slogan</strong>; viết lại theo nhiều giọng; phác ý tưởng storyboard</td><td>Chọn theo độ phù hợp và độ khớp thương hiệu; kiểm tính nguyên gốc và nhãn hiệu</td></tr>
<tr><td>Phương tiện và ngân sách</td><td>Dựng bảng tính kịch bản; giải thích chỉ số; phác lịch phát sóng</td><td>Kiểm phép tính và giả định</td></tr>
<tr><td>Thực thi</td><td>Hiệu đính, rút gọn, dịch, chuyển lời văn sang từng định dạng; thiết kế bố cục trình bày; dựng hình ảnh mẫu</td><td>Biên tập cuối, rà soát pháp lý, thương hiệu duyệt</td></tr>
<tr><td>Đánh giá</td><td>Tóm tắt bình luận và đánh giá; soạn báo cáo</td><td>Diễn giải kết quả; ra quyết định</td></tr>
</table>
<h3>Viết một prompt hữu ích</h3>
<p>Một cấu trúc đáng tin là: <strong>vai trò</strong> → <strong>bối cảnh</strong> (thương hiệu, công chúng, insight, mục tiêu) → <strong>nhiệm vụ</strong> → <strong>ràng buộc</strong> (độ dài, giọng điệu, giới hạn pháp lý) → <strong>định dạng đầu ra</strong> → ví dụ, rồi lặp lại để cải thiện. Yêu cầu nhiều phương án kèm lý do, và yêu cầu mô hình tự phê bình sản phẩm của nó.</p>
<pre><code class="language-text">Vai trò: Bạn là copywriter cấp cao tại một agency sáng tạo Việt Nam.
Bối cảnh: LumaTea (giả định) là trà đóng chai ít đường cho sinh viên 18-24 tuổi
tại TP. Hồ Chí Minh. Insight: họ muốn một thức uống giúp trụ vững qua những buổi
học dài mà không thấy nặng bụng. Mục tiêu: tăng nhận biết khi ra mắt.
Nhiệm vụ: viết 10 phương án slogan bằng tiếng Việt và tiếng Anh.
Ràng buộc: tối đa 6 từ; không dùng từ so sánh nhất như "tốt nhất" hay "số 1";
không tuyên bố về sức khoẻ; giọng thân thiện, dí dỏm.
Định dạng: bảng gồm slogan, giọng điệu và một dòng lý do.
Sau đó: chọn 3 phương án mạnh nhất và nêu rủi ro của từng phương án.</code></pre>
<h3>Đánh giá công cụ AI</h3>
<table>
<tr><th>Tiêu chí</th><th>Câu hỏi cần đặt</th></tr>
<tr><td>Chất lượng và độ phù hợp của đầu ra</td><td>Nó có tạo ra sản phẩm dùng được, đúng brief, bằng tiếng Việt và tiếng Anh không?</td></tr>
<tr><td>Độ chính xác</td><td>Nó bịa dữ kiện, nguồn hay con số (ảo giác) thường xuyên tới đâu?</td></tr>
<tr><td>Kiểm soát và giọng thương hiệu</td><td>Nó có theo được cẩm nang văn phong một cách nhất quán không?</td></tr>
<tr><td>Quyền riêng tư và bảo mật dữ liệu</td><td>Dữ liệu nhập vào đi đâu? Có bị dùng để huấn luyện mô hình không? Có được nhập dữ liệu của khách hàng không?</td></tr>
<tr><td>Sở hữu trí tuệ và giấy phép</td><td>Đầu ra có được dùng cho mục đích thương mại không? Ai sở hữu? Có cam kết bồi hoàn không?</td></tr>
<tr><td>Thiên lệch</td><td>Hình ảnh và văn bản sinh ra có rập khuôn định kiến về con người hay vùng miền không?</td></tr>
<tr><td>Chi phí và độ khớp quy trình</td><td>Giá, khả năng tích hợp với công cụ hiện có, kỹ năng đội ngũ cần có</td></tr>
</table>
<p>Đánh giá bằng một bộ đề thử cố định (cùng năm bản brief cho mọi công cụ) và một thang chấm điểm do ít nhất hai người chấm — cùng logic với việc thử nghiệm trước quảng cáo.</p>
<h3>Rủi ro đạo đức</h3>
<ul>
<li><strong>Bản quyền</strong> — quy định về dữ liệu huấn luyện và quyền sở hữu đầu ra AI chưa ngã ngũ; đừng bắt chước tác phẩm được bảo hộ, phong cách đặc trưng của nghệ sĩ đang sống hay nhãn hiệu của thương hiệu khác.</li>
<li><strong>Deepfake và hình ảnh cá nhân</strong> — không bao giờ tạo khuôn mặt hay giọng nói của người thật khi chưa được đồng ý; tại Việt Nam, dùng hình ảnh, lời nói của cá nhân trong quảng cáo khi chưa được đồng ý là bị cấm.</li>
<li><strong>Minh bạch</strong> — gắn nhãn nội dung do AI tạo hoặc chỉnh sửa khi chính sách nền tảng hay pháp luật yêu cầu, và trung thực với khách hàng về cách sản phẩm được làm ra.</li>
<li><strong>Thiên lệch và định kiến</strong> — mô hình tái tạo khuôn mẫu trong dữ liệu; rà soát đầu ra về định kiến giới, tuổi, màu da và vùng miền.</li>
<li><strong>Tuyên bố bịa đặt</strong> — AI có thể đưa ra "dữ kiện", số liệu hay nguồn không tồn tại; mọi tuyên bố trong quảng cáo phải được chứng minh (Ch 20).</li>
<li><strong>Quyền riêng tư</strong> — không dán dữ liệu khách hàng hay thông tin mật của khách hàng vào công cụ công cộng.</li>
<li><strong>Sự na ná</strong> — nếu ai cũng dùng cùng công cụ với prompt giống nhau, sản phẩm sáng tạo sẽ hội tụ; sự khác biệt (Ch 8) vẫn cần insight của con người.</li>
</ul>
<h3>Quy trình có con người kiểm soát</h3>
<pre><code class="language-text">Brief (con người) -> Sinh phương án (AI) -> Chọn và cải thiện (con người)
-> Kiểm dữ kiện, pháp lý, thương hiệu (con người) -> Thử với công chúng -> Công khai khi được yêu cầu</code></pre>
<div class="callout"><span class="badge">Theo đề cương</span> Phần điểm AI của môn được hoàn thành qua các dự án có hướng dẫn trên Coursera mà đề cương nêu tên: "ChatGPT for Beginners: Using AI for Market Research" và "Prompt Engineering Generative AI for Marketing &amp; Advertising". Tìm theo đúng tên trên Coursera.</div>
<h3>Ôn tập &amp; thảo luận</h3>
<ol>
<li>Dùng một công cụ AI để phác bản đồ hành trình khách hàng cho một thương hiệu giả định. Liệt kê ba điều nó sai hoặc tự giả định.</li>
<li>So sánh hai công cụ AI bằng bảng tiêu chí. Bạn cho phép agency dùng công cụ nào với dữ liệu khách hàng?</li>
<li>Bạn đặt ranh giới giữa sản phẩm sáng tạo "có AI hỗ trợ" và "do AI tạo ra" ở đâu, và có nên cho công chúng biết không?</li>
</ol>`,
  ]]);

const c21 = doc('mkt304-9-3-imc-plan', '9.3 — Group project guide: structuring an evidence-based IMC plan|||9.3 — Hướng dẫn bài nhóm: cấu trúc một kế hoạch IMC dựa trên bằng chứng',
  'Hướng dẫn kế hoạch IMC nhóm theo đề cương (tối đa 20 trang, thuyết trình, sản phẩm sáng tạo TVC/print ad/media kit): cấu trúc 12 mục gắn với từng chương, ma trận tích hợp theo hành trình khách hàng, bảng KPI, lỗi thường gặp, danh mục tự kiểm trước khi nộp.',
  [[
    `<span class="eyebrow">MKT304 · Part 9 · Lesson 9.3</span>
<h2>Group project guide — the evidence-based IMC plan</h2>
<p class="lead">The group project is the heaviest component of MKT304. The syllabus asks for an IMC plan built on real evidence (reports, articles, databases, official websites or primary data), of at most 20 pages, plus a presentation and a creative product such as a TVC, a print ad or a media kit. Follow your lecturer's brief first; this lesson gives a structure that maps every section to the course.</p>
<h3>A 12-section structure</h3>
<table>
<tr><th>#</th><th>Section</th><th>Content</th><th>Course link</th></tr>
<tr><td>1</td><td>Executive summary</td><td>One page: problem, objective, big idea, budget, expected results</td><td>—</td></tr>
<tr><td>2</td><td>Situation analysis</td><td>Company and brand, market, competitors (including their communication), consumers; every figure cited</td><td>Ch 1–4, 9.1</td></tr>
<tr><td>3</td><td>SWOT and the communication problem</td><td>What communication must solve — not what the product must fix</td><td>Ch 2</td></tr>
<tr><td>4</td><td>Target audience and insight</td><td>Demographics + psychographics + media habits; one sharp insight; customer journey map</td><td>Ch 2, 4, 5</td></tr>
<tr><td>5</td><td>Positioning</td><td>Positioning statement; the approach chosen</td><td>Ch 2</td></tr>
<tr><td>6</td><td>Objectives</td><td>Marketing objectives + DAGMAR communication objectives for each tool</td><td>Ch 7</td></tr>
<tr><td>7</td><td>Creative strategy</td><td>Creative brief, big idea, appeal, execution style, tagline; the creative product</td><td>Ch 8–9</td></tr>
<tr><td>8</td><td>Media plan</td><td>Channel roles, paid/owned/earned, schedule (flowchart), reach, frequency, GRP or impressions, CPM</td><td>Ch 10, 13, 15</td></tr>
<tr><td>9</td><td>Tool plans</td><td>Advertising, digital and social, sales promotion, PR and events, direct marketing, sponsorship — each with objective and tactic</td><td>Ch 13–17</td></tr>
<tr><td>10</td><td>Budget</td><td>Objective-and-task table, allocation by tool and month, contingency, cross-check with % of sales and share of voice</td><td>Ch 7</td></tr>
<tr><td>11</td><td>Measurement and control</td><td>KPI table, tools, timing, attribution approach</td><td>Ch 7, 15</td></tr>
<tr><td>12</td><td>Legal, ethical and AI statement; risks</td><td>Compliance checklist, promotion procedures, disclosure of AI use, risk plan</td><td>Ch 20–21, 9.2</td></tr>
</table>
<h3>The integration matrix</h3>
<p>Show that the tools work together by mapping them against the customer journey. Every cell should carry the same big idea in a form that suits the stage.</p>
<table>
<tr><th>Stage</th><th>Objective</th><th>Main tools</th><th>KPI</th></tr>
<tr><td>Awareness</td><td>Aided awareness from X% to Y%</td><td>Online video, OOH, PR launch</td><td>Reach, frequency, awareness survey</td></tr>
<tr><td>Consideration</td><td>Brand in the evoked set</td><td>Social content, KOC reviews, search</td><td>Engagement rate, search volume, consideration survey</td></tr>
<tr><td>Purchase</td><td>Trial</td><td>Sampling, in-store POP, e-commerce promotion</td><td>Trial rate, conversions, CPA</td></tr>
<tr><td>Loyalty</td><td>Repeat purchase</td><td>Loyalty programme, email/messaging</td><td>Repeat rate, CLV</td></tr>
<tr><td>Advocacy</td><td>Recommendation</td><td>User-generated content challenge, referral offer</td><td>Shares, reviews, referrals</td></tr>
</table>
<h3>Common mistakes</h3>
<ul>
<li>Objectives with no benchmark, audience or deadline — not DAGMAR.</li>
<li>A list of tactics with no strategy or big idea connecting them.</li>
<li>A budget that is not derived from tasks, or does not add up.</li>
<li>Creative that does not match the positioning or the target's insight.</li>
<li>Market figures without sources, or statistics copied from an AI answer without verification.</li>
<li>No legal check: superlatives, direct comparisons, promotion procedures.</li>
<li>No measurement plan — nobody could tell whether the plan worked.</li>
</ul>
<div class="callout"><span class="badge">Before you submit</span> (1) Every number has a source or is labelled as an assumption. (2) Every objective has a KPI, a method and a date. (3) The budget table adds up. (4) The creative product shows the big idea and tagline. (5) AI use is disclosed. (6) The plan fits the page limit.</div>
<h3>Self-check questions</h3>
<ol>
<li>Can you state your big idea in one sentence that a classmate from another group would remember?</li>
<li>If the budget were cut by a third, which tasks would you drop and which objectives would you lower?</li>
<li>Which section of your plan rests on the weakest evidence, and how can you strengthen it?</li>
</ol>`,
    `<span class="eyebrow">MKT304 · Phần 9 · Bài 9.3</span>
<h2>Hướng dẫn bài nhóm — kế hoạch IMC dựa trên bằng chứng</h2>
<p class="lead">Bài nhóm là thành phần có trọng số lớn nhất của MKT304. Đề cương yêu cầu một kế hoạch IMC dựa trên bằng chứng thật (báo cáo, bài báo, cơ sở dữ liệu, website chính thức hoặc dữ liệu sơ cấp), tối đa 20 trang, kèm bài thuyết trình và một sản phẩm sáng tạo như TVC, quảng cáo in hoặc media kit. Hãy làm theo yêu cầu của giảng viên trước tiên; bài này đưa ra một cấu trúc gắn mỗi mục với nội dung môn học.</p>
<h3>Cấu trúc 12 mục</h3>
<table>
<tr><th>#</th><th>Mục</th><th>Nội dung</th><th>Liên kết môn học</th></tr>
<tr><td>1</td><td>Tóm tắt điều hành</td><td>Một trang: vấn đề, mục tiêu, ý tưởng lớn, ngân sách, kết quả kỳ vọng</td><td>—</td></tr>
<tr><td>2</td><td>Phân tích tình thế</td><td>Doanh nghiệp và thương hiệu, thị trường, đối thủ (kể cả truyền thông của họ), người tiêu dùng; mọi con số đều có nguồn</td><td>Ch 1–4, 9.1</td></tr>
<tr><td>3</td><td>SWOT và vấn đề truyền thông</td><td>Truyền thông phải giải quyết điều gì — không phải điều sản phẩm phải sửa</td><td>Ch 2</td></tr>
<tr><td>4</td><td>Công chúng mục tiêu và insight</td><td>Nhân khẩu học + tâm lý học + thói quen dùng phương tiện; một insight sắc; bản đồ hành trình khách hàng</td><td>Ch 2, 4, 5</td></tr>
<tr><td>5</td><td>Định vị</td><td>Tuyên bố định vị; cách định vị được chọn</td><td>Ch 2</td></tr>
<tr><td>6</td><td>Mục tiêu</td><td>Mục tiêu marketing + mục tiêu truyền thông theo DAGMAR cho từng công cụ</td><td>Ch 7</td></tr>
<tr><td>7</td><td>Chiến lược sáng tạo</td><td>Creative brief, ý tưởng lớn, lời kêu gọi, phong cách thực thi, tagline; sản phẩm sáng tạo</td><td>Ch 8–9</td></tr>
<tr><td>8</td><td>Kế hoạch phương tiện</td><td>Vai trò từng kênh, paid/owned/earned, lịch (flowchart), reach, frequency, GRP hoặc lượt hiển thị, CPM</td><td>Ch 10, 13, 15</td></tr>
<tr><td>9</td><td>Kế hoạch từng công cụ</td><td>Quảng cáo, số và mạng xã hội, khuyến mại, PR và sự kiện, marketing trực tiếp, tài trợ — mỗi công cụ có mục tiêu và chiến thuật</td><td>Ch 13–17</td></tr>
<tr><td>10</td><td>Ngân sách</td><td>Bảng mục tiêu – nhiệm vụ, phân bổ theo công cụ và theo tháng, dự phòng, đối chiếu với % doanh thu và share of voice</td><td>Ch 7</td></tr>
<tr><td>11</td><td>Đo lường và kiểm soát</td><td>Bảng KPI, công cụ, thời điểm, cách phân bổ chuyển đổi</td><td>Ch 7, 15</td></tr>
<tr><td>12</td><td>Tuyên bố pháp lý, đạo đức và AI; rủi ro</td><td>Danh mục tuân thủ, thủ tục khuyến mại, công khai việc dùng AI, kế hoạch xử lý rủi ro</td><td>Ch 20–21, 9.2</td></tr>
</table>
<h3>Ma trận tích hợp</h3>
<p>Chứng minh các công cụ phối hợp với nhau bằng cách xếp chúng theo hành trình khách hàng. Mỗi ô phải mang cùng một ý tưởng lớn, ở dạng phù hợp với giai đoạn đó.</p>
<table>
<tr><th>Giai đoạn</th><th>Mục tiêu</th><th>Công cụ chính</th><th>KPI</th></tr>
<tr><td>Nhận biết</td><td>Nhận biết có gợi ý từ X% lên Y%</td><td>Video trực tuyến, quảng cáo ngoài trời, PR ra mắt</td><td>Reach, frequency, khảo sát nhận biết</td></tr>
<tr><td>Cân nhắc</td><td>Thương hiệu lọt vào tập cân nhắc</td><td>Nội dung mạng xã hội, đánh giá của KOC, tìm kiếm</td><td>Tỷ lệ gắn kết, lượng tìm kiếm, khảo sát cân nhắc</td></tr>
<tr><td>Mua</td><td>Dùng thử</td><td>Phát mẫu, vật phẩm tại điểm bán, khuyến mại trên sàn</td><td>Tỷ lệ dùng thử, chuyển đổi, CPA</td></tr>
<tr><td>Trung thành</td><td>Mua lặp lại</td><td>Chương trình khách hàng thân thiết, email/tin nhắn</td><td>Tỷ lệ mua lại, CLV</td></tr>
<tr><td>Ủng hộ</td><td>Giới thiệu</td><td>Thử thách nội dung do người dùng tạo, ưu đãi giới thiệu bạn bè</td><td>Lượt chia sẻ, đánh giá, lượt giới thiệu</td></tr>
</table>
<h3>Lỗi thường gặp</h3>
<ul>
<li>Mục tiêu không có mức chuẩn, công chúng hay thời hạn — không đạt chuẩn DAGMAR.</li>
<li>Một danh sách chiến thuật mà không có chiến lược hay ý tưởng lớn nối chúng lại.</li>
<li>Ngân sách không suy ra từ nhiệm vụ, hoặc cộng không khớp.</li>
<li>Sản phẩm sáng tạo không khớp với định vị hay insight của công chúng mục tiêu.</li>
<li>Số liệu thị trường không có nguồn, hoặc số liệu chép từ câu trả lời của AI mà không kiểm chứng.</li>
<li>Không rà soát pháp lý: từ so sánh nhất, so sánh trực tiếp, thủ tục khuyến mại.</li>
<li>Không có kế hoạch đo lường — không ai biết kế hoạch có hiệu quả hay không.</li>
</ul>
<div class="callout"><span class="badge">Trước khi nộp</span> (1) Mọi con số đều có nguồn hoặc được ghi rõ là giả định. (2) Mọi mục tiêu đều có KPI, cách đo và thời điểm. (3) Bảng ngân sách cộng khớp. (4) Sản phẩm sáng tạo thể hiện ý tưởng lớn và tagline. (5) Việc dùng AI được công khai. (6) Kế hoạch nằm trong giới hạn số trang.</div>
<h3>Câu hỏi tự kiểm</h3>
<ol>
<li>Bạn có nói được ý tưởng lớn của nhóm trong một câu mà bạn ở nhóm khác nghe xong vẫn nhớ không?</li>
<li>Nếu ngân sách bị cắt một phần ba, bạn bỏ nhiệm vụ nào và hạ mục tiêu nào?</li>
<li>Mục nào trong kế hoạch dựa trên bằng chứng yếu nhất, và làm sao củng cố nó?</li>
</ol>`,
  ]]);

const c21q = quiz('mkt304-quiz-9', 'Quiz 9 — IMC in Vietnam, AI & the IMC plan|||Quiz 9 — IMC tại Việt Nam, AI & kế hoạch IMC', [
  { id: 'q1', question: 'Which is the most responsible way to use a generative AI tool when writing ad copy?|||Đâu là cách dùng công cụ AI tạo sinh có trách nhiệm nhất khi viết lời quảng cáo?', options: ['Publish the first output directly to save time|||Đăng ngay phương án đầu tiên để tiết kiệm thời gian', 'Treat outputs as drafts, verify every factual claim and let a human approve the final copy|||Coi đầu ra là bản nháp, kiểm chứng mọi tuyên bố dữ kiện và để con người duyệt bản cuối', 'Ask the AI to invent statistics that make the product look stronger|||Yêu cầu AI bịa số liệu để sản phẩm trông mạnh hơn', 'Paste the full customer database into the tool for better personalization|||Dán toàn bộ cơ sở dữ liệu khách hàng vào công cụ để cá nhân hoá tốt hơn'], correctIndex: 1, explanation: 'AI output can contain invented facts; claims must be substantiated, and personal data must not be pasted into public tools.|||Đầu ra AI có thể chứa dữ kiện bịa; tuyên bố phải được chứng minh, và không được dán dữ liệu cá nhân vào công cụ công cộng.' },
  { id: 'q2', question: 'A brand wants to use AI to recreate a famous singer’s face and voice in an ad without asking her. The main problem is…|||Một thương hiệu muốn dùng AI tái tạo khuôn mặt và giọng một ca sĩ nổi tiếng trong quảng cáo mà không hỏi cô ấy. Vấn đề chính là…', options: ['it uses a person’s likeness without consent, which is unethical and prohibited in Vietnamese advertising|||nó dùng hình ảnh của một người khi chưa được đồng ý, vừa phi đạo đức vừa bị cấm trong quảng cáo tại Việt Nam', 'AI video is always lower quality than real footage|||video AI luôn kém chất lượng hơn cảnh quay thật', 'singers are never effective endorsers|||ca sĩ không bao giờ là người đại diện hiệu quả', 'the ad would have too high a CPM|||quảng cáo sẽ có CPM quá cao'], correctIndex: 0, explanation: 'Deepfaking a real person without consent violates their rights; Vietnamese advertising law prohibits using an individual’s image or words without consent.|||Deepfake một người thật khi chưa được đồng ý xâm phạm quyền của họ; pháp luật quảng cáo Việt Nam cấm dùng hình ảnh, lời nói của cá nhân khi chưa được đồng ý.' },
  { id: 'q3', question: 'In a well-built IMC plan, each objective should be linked to…|||Trong một kế hoạch IMC tốt, mỗi mục tiêu cần được gắn với…', options: ['the most popular social platform of the year|||nền tảng mạng xã hội phổ biến nhất năm', 'a celebrity endorser|||một người nổi tiếng đại diện', 'a KPI, a measurement method and a target date|||một KPI, một cách đo và một thời hạn', 'the largest possible discount|||mức giảm giá lớn nhất có thể'], correctIndex: 2, explanation: 'Without a KPI, a method and a deadline nobody can tell whether the objective was reached.|||Không có KPI, cách đo và thời hạn thì không ai biết mục tiêu có đạt hay không.' },
]);

const taiLieu = doc('mkt304-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MKT304 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning integrated marketing communications: the official syllabus and slides, the textbook, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official syllabus and lecture slides. Key facts from the syllabus:</p>
<ul>
<li><strong>Syllabus ID</strong>: sylID 14486 (decision 1028/QĐ-ĐHFPT, 21/08/2026); 3 credits; prerequisite MKT101 (or MKG101/MMK101).</li>
<li><strong>Main textbook</strong>: George E. Belch &amp; Michael A. Belch — <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em>, McGraw-Hill, 12th edition (2021, international student edition, ISBN 9781260570991); the syllabus also accepts the 9th edition (2012).</li>
<li><strong>Additional readings</strong> named in the syllabus: Ad Age, Harvard Business Review, BusinessWeek.</li>
<li><strong>Assessment</strong>: AI tool — Coursera guided projects 5% · participation 10% · essay test 10% · group project (IMC plan, presentation and creative product) 35% · individual assignment 10% · two quizzes 10% · final exam 20% (50 multiple-choice questions, 60 minutes, closed book).</li>
</ul>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Belch &amp; Belch — Advertising and Promotion: An IMC Perspective, 12th ed.</a> — McGraw Hill: the main textbook; search the title on the publisher's site. This course follows its chapters in syllabus order.</li>
<li><a href="https://openstax.org/details/books/principles-marketing" target="_blank" rel="noopener">Principles of Marketing</a> — OpenStax: a free, peer-reviewed open textbook; its promotion and IMC chapters are a good free companion.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — consumer and media insights, useful for situation analysis.</li>
<li><a href="https://blog.hubspot.com/marketing" target="_blank" rel="noopener">HubSpot Marketing Blog</a> — practical guides to content, social, email and campaign planning.</li>
<li><a href="https://www.ama.org/" target="_blank" rel="noopener">American Marketing Association</a> — definitions, articles and marketing news.</li>
<li><a href="https://hbr.org/" target="_blank" rel="noopener">Harvard Business Review</a> — articles on brands, advertising and marketing strategy (a reading named in the syllabus).</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">National database of legal documents (vbpl.vn)</a> — check the current texts of the advertising, commercial and consumer-protection laws (Part 8).</li>
<li><a href="https://moit.gov.vn/" target="_blank" rel="noopener">Ministry of Industry and Trade</a> — official information on commercial promotion rules.</li>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — search the two guided projects named in the syllabus: "ChatGPT for Beginners: Using AI for Market Research" and "Prompt Engineering Generative AI for Marketing &amp; Advertising".</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — free courses on search, video and measurement.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — inbound, content and social media marketing.</li>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — advertising insights and creative effectiveness.</li>
<li><a href="https://www.youtube.com/@GoogleAds" target="_blank" rel="noopener">Google Ads</a> — how search, video and performance campaigns work.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — short talks on brand and marketing strategy.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — search interest by topic, time and region, for situation analysis and seasonality.</li>
<li><a href="https://adstransparency.google.com/" target="_blank" rel="noopener">Google Ads Transparency Center</a> — see the ads competitors run, for competitive analysis.</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> — web and app measurement, conversions and attribution.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — budgets, media math (GRP, CPM, CPP) and attribution tables.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — customer journey maps, mood boards and campaign brainstorming.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — Parts 1–2: promotional mix, IMC planning model, response hierarchies, source–message–channel factors.</li>
<li><strong>Practise the numbers</strong> — redo Exercises 1–3 in a spreadsheet until you can compute budgets, GRP, CPM, CPP and ROAS by hand.</li>
<li><strong>Analyse real campaigns</strong> — pick one campaign a week; identify its objective, big idea, appeal, execution style, media mix and legal risks.</li>
<li><strong>Apply</strong> — build your group IMC plan with the 12-section structure (lesson 9.3) and test AI tools with the criteria in lesson 9.2.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. Lessons paraphrase standard IMC concepts and do not reproduce the textbook. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">MKT304 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học truyền thông marketing tích hợp: giáo trình &amp; slide chính thức, sách giáo trình, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương và slide bài giảng chính thức. Thông tin chính từ đề cương:</p>
<ul>
<li><strong>Mã đề cương</strong>: sylID 14486 (Quyết định 1028/QĐ-ĐHFPT, ngày 21/08/2026); 3 tín chỉ; tiên quyết MKT101 (hoặc MKG101/MMK101).</li>
<li><strong>Giáo trình chính</strong>: George E. Belch &amp; Michael A. Belch — <em>Advertising and Promotion: An Integrated Marketing Communications Perspective</em>, McGraw-Hill, ấn bản 12 (2021, bản quốc tế cho sinh viên, ISBN 9781260570991); đề cương cũng chấp nhận ấn bản 9 (2012).</li>
<li><strong>Tài liệu đọc thêm</strong> đề cương nêu: Ad Age, Harvard Business Review, BusinessWeek.</li>
<li><strong>Đánh giá</strong>: công cụ AI — dự án có hướng dẫn trên Coursera 5% · tham gia 10% · bài kiểm tra tự luận 10% · bài nhóm (kế hoạch IMC, thuyết trình và sản phẩm sáng tạo) 35% · bài cá nhân 10% · hai bài quiz 10% · thi cuối kỳ 20% (50 câu trắc nghiệm, 60 phút, đóng sách).</li>
</ul>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Belch &amp; Belch — Advertising and Promotion: An IMC Perspective, ấn bản 12</a> — McGraw Hill: giáo trình chính; tra tên sách trên trang nhà xuất bản. Khoá học này đi theo các chương của sách, đúng thứ tự đề cương.</li>
<li><a href="https://openstax.org/details/books/principles-marketing" target="_blank" rel="noopener">Principles of Marketing</a> — OpenStax: giáo trình mở miễn phí, có bình duyệt; các chương về xúc tiến và IMC là tài liệu đi kèm miễn phí rất tốt.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — insight về người tiêu dùng và phương tiện, hữu ích cho phân tích tình thế.</li>
<li><a href="https://blog.hubspot.com/marketing" target="_blank" rel="noopener">HubSpot Marketing Blog</a> — hướng dẫn thực hành về nội dung, mạng xã hội, email và lập kế hoạch chiến dịch.</li>
<li><a href="https://www.ama.org/" target="_blank" rel="noopener">American Marketing Association</a> — định nghĩa, bài viết và tin tức marketing.</li>
<li><a href="https://hbr.org/" target="_blank" rel="noopener">Harvard Business Review</a> — bài viết về thương hiệu, quảng cáo và chiến lược marketing (tài liệu đọc thêm đề cương nêu).</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">Cơ sở dữ liệu quốc gia về văn bản pháp luật (vbpl.vn)</a> — kiểm văn bản hiện hành của Luật Quảng cáo, Luật Thương mại, Luật Bảo vệ quyền lợi người tiêu dùng (Phần 8).</li>
<li><a href="https://moit.gov.vn/" target="_blank" rel="noopener">Bộ Công Thương</a> — thông tin chính thức về quy định khuyến mại.</li>
<li><a href="https://www.coursera.org/" target="_blank" rel="noopener">Coursera</a> — tìm hai dự án có hướng dẫn đề cương nêu tên: "ChatGPT for Beginners: Using AI for Market Research" và "Prompt Engineering Generative AI for Marketing &amp; Advertising".</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — khoá học miễn phí về tìm kiếm, video và đo lường.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — inbound marketing, nội dung và mạng xã hội.</li>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — insight quảng cáo và hiệu quả sáng tạo.</li>
<li><a href="https://www.youtube.com/@GoogleAds" target="_blank" rel="noopener">Google Ads</a> — cách chiến dịch tìm kiếm, video và hiệu suất vận hành.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — bài nói ngắn về chiến lược thương hiệu và marketing.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — mức quan tâm tìm kiếm theo chủ đề, thời gian và vùng, cho phân tích tình thế và tính mùa vụ.</li>
<li><a href="https://adstransparency.google.com/" target="_blank" rel="noopener">Google Ads Transparency Center</a> — xem quảng cáo đối thủ đang chạy, phục vụ phân tích cạnh tranh.</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> — đo lường website và ứng dụng, chuyển đổi và phân bổ chuyển đổi.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — ngân sách, toán truyền thông (GRP, CPM, CPP) và bảng phân bổ chuyển đổi.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bản đồ hành trình khách hàng, mood board và brainstorm chiến dịch.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — Phần 1–2: phối thức xúc tiến, mô hình hoạch định IMC, các mô hình thứ bậc đáp ứng, yếu tố nguồn – thông điệp – kênh.</li>
<li><strong>Luyện phần tính toán</strong> — làm lại Bài tập 1–3 trên bảng tính cho tới khi tự tính được ngân sách, GRP, CPM, CPP và ROAS bằng tay.</li>
<li><strong>Phân tích chiến dịch thật</strong> — mỗi tuần chọn một chiến dịch; xác định mục tiêu, ý tưởng lớn, lời kêu gọi, phong cách thực thi, media mix và rủi ro pháp lý.</li>
<li><strong>Vận dụng</strong> — dựng kế hoạch IMC của nhóm theo cấu trúc 12 mục (bài 9.3) và thử các công cụ AI bằng bảng tiêu chí ở bài 9.2.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Các bài giảng diễn đạt lại khái niệm IMC chuẩn, không sao chép giáo trình. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'MKT304',
    slug: 'mkt304-integrated-marketing-communications',
    title: 'Integrated Marketing Communications',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKT304.webp',
    shortDescription: 'IMC following Belch & Belch: promotional mix, communication models, DAGMAR objectives and budgets, creative strategy, media planning (GRP, CPM), digital, sales promotion, PR, Vietnamese ad law, ethics and AI. Bilingual, with exercises.|||IMC theo Belch & Belch: phối thức xúc tiến, mô hình truyền thông, mục tiêu DAGMAR và ngân sách, chiến lược sáng tạo, kế hoạch truyền thông (GRP, CPM), số, khuyến mại, PR, luật quảng cáo Việt Nam, đạo đức, AI. Song ngữ, có bài tập.',
    description: 'Môn <strong>MKT304 — Integrated Marketing Communications (Truyền thông marketing tích hợp)</strong> (khối Quản trị Kinh doanh, kỳ 4) dạy cách hoạch định mọi điểm tiếp xúc của thương hiệu thành <strong>một tiếng nói thống nhất, đo lường được</strong>. Bám đúng đề cương FLM (sylID 14486) và giáo trình chính <strong>Belch &amp; Belch — Advertising and Promotion: An Integrated Marketing Communications Perspective (ấn bản 12)</strong>, theo thứ tự chương của đề cương: <strong>IMC và vai trò trong marketing</strong> (Ch 1–4) → <strong>quá trình truyền thông, mô hình đáp ứng, nguồn – thông điệp – kênh</strong> (Ch 5–6) → <strong>mục tiêu DAGMAR và ngân sách</strong> (Ch 7) → <strong>chiến lược sáng tạo</strong> (Ch 8–9) → <strong>hoạch định truyền thông và phương tiện hỗ trợ</strong> (Ch 10, 13) → <strong>quảng cáo quốc tế, khuyến mại, PR</strong> (Ch 19, 16, 17) → <strong>marketing trực tiếp, Internet và phương tiện tương tác</strong> (Ch 14–15) → <strong>quy định quảng cáo và khuyến mại tại Việt Nam, đạo đức</strong> (Ch 20–21) → <strong>IMC tại Việt Nam, AI trong IMC và hướng dẫn kế hoạch IMC nhóm</strong>. Song ngữ Anh–Việt, ba bài tập tính toán có lời giải (ngân sách, GRP/CPM/CPP, phân bổ chuyển đổi và ROAS), quiz cuối mỗi phần và câu hỏi thảo luận; mọi thương hiệu và số liệu là giả định, đã kiểm bằng máy.',
    whatYouLearn: 'Giải thích IMC, phối thức xúc tiến, paid–owned–earned media và mô hình hoạch định IMC\nVận dụng phân đoạn, định vị, tái định vị và bao bì như công cụ truyền thông\nPhân tích quá trình truyền thông bằng các mô hình thứ bậc đáp ứng, ELM và ma trận thuyết phục\nViết mục tiêu theo DAGMAR và lập ngân sách bằng phương pháp mục tiêu – nhiệm vụ, đối chiếu share of voice\nXây dựng creative brief, ý tưởng lớn, lời kêu gọi, phong cách thực thi và đánh giá sản phẩm sáng tạo\nLập kế hoạch truyền thông và tính GRP, reach, frequency, CPM, CPP, CPA, ROAS, phân bổ chuyển đổi\nPhối hợp quảng cáo quốc tế, khuyến mại, PR, marketing trực tiếp và số trong tuân thủ luật quảng cáo, khuyến mại Việt Nam\nỨng dụng AI trong quy trình IMC, đánh giá công cụ AI và xử lý rủi ro đạo đức (bản quyền, deepfake, minh bạch, thiên lệch)',
    requirements: 'Đã học MKT101 — Marketing Principles (hoặc môn tương đương MKG101/MMK101) theo điều kiện tiên quyết của đề cương\nNên nắm kiến thức hành vi người tiêu dùng (MKT201) để liên hệ Ch 4–5\nBảng tính (Excel hoặc Google Sheets) cho bài toán ngân sách, truyền thông, phân bổ; một công cụ AI tạo sinh để thực hành phần AI',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'IMC là gì, CLO, cách đánh giá, lộ trình theo đề cương.', lessons: [intro] },
    { title: 'Part 1 — Foundations of IMC (Ch 1–4)|||Phần 1 — Nền tảng IMC (Ch 1–4)', description: 'Phối thức xúc tiến, điểm tiếp xúc, mô hình hoạch định, định vị, agency, hành vi người tiêu dùng.', lessons: [c1, c2, c3, c1q] },
    { title: 'Part 2 — Communication & persuasion (Ch 5–6)|||Phần 2 — Truyền thông & thuyết phục (Ch 5–6)', description: 'Mô hình truyền thông, thứ bậc đáp ứng, ELM, nguồn – thông điệp – kênh, ma trận thuyết phục.', lessons: [c4, c5, c5q] },
    { title: 'Part 3 — Objectives & budgeting (Ch 7)|||Phần 3 — Mục tiêu & ngân sách (Ch 7)', description: 'DAGMAR, mục tiêu truyền thông, các phương pháp ngân sách, share of voice, bài tập ngân sách.', lessons: [c6, c7, c7e, c7q] },
    { title: 'Part 4 — Creative strategy (Ch 8–9)|||Phần 4 — Chiến lược sáng tạo (Ch 8–9)', description: 'Big idea, USP, creative brief, lời kêu gọi, phong cách thực thi, đánh giá sáng tạo.', lessons: [c8, c9, c9q] },
    { title: 'Part 5 — Media planning & support media (Ch 10, 13)|||Phần 5 — Hoạch định truyền thông & phương tiện hỗ trợ (Ch 10, 13)', description: 'Reach, frequency, GRP, CPM, CPP, BDI/CDI, lịch phát sóng, OOH, product placement.', lessons: [c10, c10e, c11, c11q] },
    { title: 'Part 6 — International advertising, sales promotion & PR (Ch 19, 16, 17)|||Phần 6 — Quảng cáo quốc tế, khuyến mại & PR (Ch 19, 16, 17)', description: 'Toàn cầu hoá và địa phương hoá, khuyến mại người tiêu dùng và thương mại, PR, quảng cáo doanh nghiệp.', lessons: [c12, c13, c14, c14q] },
    { title: 'Part 7 — Direct marketing & interactive media (Ch 14–15)|||Phần 7 — Marketing trực tiếp & phương tiện tương tác (Ch 14–15)', description: 'Cơ sở dữ liệu, phễu, mạng xã hội, programmatic, chỉ số Internet, phân bổ chuyển đổi.', lessons: [c15, c16, c16e, c16q] },
    { title: 'Part 8 — Regulation, ethics & social aspects (Ch 20–21)|||Phần 8 — Quy định, đạo đức & khía cạnh xã hội (Ch 20–21)', description: 'Luật quảng cáo và khuyến mại Việt Nam, puffery, đạo đức quảng cáo, tác động kinh tế.', lessons: [c17, c18, c18q] },
    { title: 'Part 9 — IMC in Vietnam, AI & the IMC plan|||Phần 9 — IMC tại Việt Nam, AI & kế hoạch IMC', description: 'Agency và xu hướng tại Việt Nam, AI trong IMC, hướng dẫn kế hoạch IMC nhóm.', lessons: [c19, c20, c21, c21q] },
  ],
};
