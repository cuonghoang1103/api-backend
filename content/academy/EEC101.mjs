/**
 * EEC101 — Introduction to E-Commerce (Nhập môn thương mại điện tử). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám ĐỀ CƯƠNG FLM sylID 13733 (QĐ 1318/QĐ-ĐHFPT, 27/11/2025): 12 chương theo sách chính DUY NHẤT
 * Laudon & Traver — E-commerce 2023–2024: Business, Technology, Society (Pearson, 18th Global Edition, 2023).
 * 7 phần: Ch1–2 nền tảng & mô hình kinh doanh · Ch3–4 hạ tầng & xây dựng hiện diện · Ch5 bảo mật & thanh toán ·
 * Ch6–7 marketing (+ thực hành AI tạo sinh) · Ch8 đạo đức & luật · Ch9–11 bán lẻ, dịch vụ, truyền thông, cộng đồng ·
 * Ch12 B2B + hướng dẫn dự án Go-to-Market 4 giai đoạn. Song ngữ; số liệu là GIẢ ĐỊNH, đã kiểm bằng máy;
 * không có số liệu thị trường thật; mọi mức phí/hoa hồng là giả định.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('eec101-0-1-overview', 'Course overview: e-commerce as business, technology and society|||Tổng quan: TMĐT là kinh doanh, công nghệ và xã hội',
  'Thương mại điện tử là gì, ba lăng kính kinh doanh – công nghệ – xã hội của giáo trình Laudon & Traver, 12 chương chia thành 7 phần, cách môn được đánh giá, và cách học hiệu quả.',
  [[
    `<span class="eyebrow">EEC101 · Lesson 0.1 · Overview</span>
<h2>Introduction to E-Commerce</h2>
<p class="lead">E-commerce is not just "selling on a website". It is a new way of creating and capturing value that depends on three things at once: a <strong>business</strong> model that can make money, a <strong>technology</strong> platform that works and is secure, and a <strong>society</strong> — laws, ethics, consumer trust — that allows it to operate. This course, built on the official FPTU syllabus, studies all three.</p>
<h3>Three lenses on every topic</h3>
<table>
<tr><th>Lens</th><th>Typical question</th><th>Where you meet it</th></tr>
<tr><td>Business</td><td>How does this firm create value for customers and earn revenue? Can it survive competition?</td><td>Ch 1–2, 6–7, 9–12</td></tr>
<tr><td>Technology</td><td>What infrastructure, software and security does it need? What does it cost to build and run?</td><td>Ch 3–5</td></tr>
<tr><td>Society</td><td>Whose privacy, property and safety are affected? Which laws apply? Is it fair?</td><td>Ch 8, and throughout</td></tr>
</table>
<h3>Roadmap: twelve chapters in seven parts</h3>
<ol>
<li><strong>Foundations</strong> — Ch 1 introduction to e-commerce; Ch 2 business models and strategy.</li>
<li><strong>Infrastructure and building a presence</strong> — Ch 3 the Internet, the Web and mobile apps; Ch 4 planning and building websites and apps.</li>
<li><strong>Security and payment systems</strong> — Ch 5.</li>
<li><strong>Marketing</strong> — Ch 6 marketing and advertising; Ch 7 social, mobile and local marketing; plus an AI lab on building a launch concept with generative AI.</li>
<li><strong>Ethics and law</strong> — Ch 8 privacy, intellectual property, governance and public safety.</li>
<li><strong>E-commerce in action</strong> — Ch 9 retail and services; Ch 10 online media; Ch 11 online communities.</li>
<li><strong>B2B e-commerce</strong> — Ch 12 supply chains and collaborative commerce; plus a guide to the Go-to-Market group project.</li>
</ol>
<h3>How the course is assessed (from the syllabus)</h3>
<table>
<tr><th>Component</th><th>Weight</th><th>What it asks of you</th></tr>
<tr><td>Group project — E-commerce Go-to-Market Strategy</td><td>30%</td><td>Take a physical product online in four stages (see lesson 7.3)</td></tr>
<tr><td>Individual assignment — memo</td><td>15%</td><td>A 500–700-word memo in 90 minutes: an integrated digital strategy and ethics audit</td></tr>
<tr><td>Participation</td><td>10%</td><td>Class activities and discussion</td></tr>
<tr><td>Progress quiz (Chapters 1–5)</td><td>15%</td><td>30 multiple-choice questions</td></tr>
<tr><td>Final exam</td><td>30%</td><td>50 multiple-choice questions, 60 minutes, closed book</td></tr>
</table>
<h3>How to study this course</h3>
<ul>
<li><strong>Learn the vocabulary precisely.</strong> Multiple-choice exams test definitions: the eight unique features, the eight elements of a business model, the six dimensions of security, the B2B marketplace types.</li>
<li><strong>Always ask "how does it make money?"</strong> Every chapter returns to value proposition and revenue model.</li>
<li><strong>Do the numbers.</strong> Conversion rate, cost per click, customer acquisition cost and break-even revenue are simple arithmetic, and they decide whether an online business is viable. All figures in this course are illustrative (assumed) and have been checked.</li>
<li><strong>Connect to Vietnam carefully.</strong> We point to Vietnamese rules where they matter (personal data, consumer protection, e-commerce regulation), always with the advice to check the text currently in force.</li>
</ul>
<div class="callout"><span class="badge">Scope</span> This is an introductory survey. Later courses in the programme (for example PSE301, EAI201, ESM301 and EDC301) go deeper into specific areas; here the goal is a sound, connected map of the whole field.</div>`,
    `<span class="eyebrow">EEC101 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn thương mại điện tử</h2>
<p class="lead">Thương mại điện tử (TMĐT) không chỉ là "bán hàng trên website". Đó là một cách mới để tạo ra và thu về giá trị, phụ thuộc đồng thời vào ba thứ: một mô hình <strong>kinh doanh</strong> kiếm được tiền, một nền tảng <strong>công nghệ</strong> vận hành tốt và an toàn, và một <strong>xã hội</strong> — pháp luật, đạo đức, niềm tin của người tiêu dùng — cho phép nó hoạt động. Môn học này, xây theo đề cương chính thức của ĐH FPT, nghiên cứu cả ba.</p>
<h3>Ba lăng kính cho mọi chủ đề</h3>
<table>
<tr><th>Lăng kính</th><th>Câu hỏi điển hình</th><th>Gặp ở đâu</th></tr>
<tr><td>Kinh doanh</td><td>Doanh nghiệp này tạo giá trị cho khách hàng và tạo doanh thu thế nào? Có sống sót được trước cạnh tranh không?</td><td>Ch 1–2, 6–7, 9–12</td></tr>
<tr><td>Công nghệ</td><td>Cần hạ tầng, phần mềm và bảo mật gì? Xây dựng và vận hành tốn bao nhiêu?</td><td>Ch 3–5</td></tr>
<tr><td>Xã hội</td><td>Quyền riêng tư, tài sản và sự an toàn của ai bị ảnh hưởng? Luật nào áp dụng? Có công bằng không?</td><td>Ch 8, và xuyên suốt</td></tr>
</table>
<h3>Lộ trình: mười hai chương trong bảy phần</h3>
<ol>
<li><strong>Nền tảng</strong> — Ch 1 nhập môn TMĐT; Ch 2 mô hình kinh doanh và chiến lược.</li>
<li><strong>Hạ tầng và xây dựng sự hiện diện</strong> — Ch 3 Internet, Web và ứng dụng di động; Ch 4 lập kế hoạch và xây dựng website, ứng dụng.</li>
<li><strong>Bảo mật và hệ thống thanh toán</strong> — Ch 5.</li>
<li><strong>Marketing</strong> — Ch 6 marketing và quảng cáo; Ch 7 marketing mạng xã hội, di động và địa phương; kèm một bài thực hành dùng AI tạo sinh để xây concept ra mắt sản phẩm.</li>
<li><strong>Đạo đức và pháp luật</strong> — Ch 8 quyền riêng tư, sở hữu trí tuệ, quản trị Internet và an toàn công cộng.</li>
<li><strong>TMĐT trong thực tiễn</strong> — Ch 9 bán lẻ và dịch vụ; Ch 10 truyền thông trực tuyến; Ch 11 cộng đồng trực tuyến.</li>
<li><strong>TMĐT B2B</strong> — Ch 12 chuỗi cung ứng và thương mại cộng tác; kèm hướng dẫn dự án nhóm Go-to-Market.</li>
</ol>
<h3>Cách môn học được đánh giá (theo đề cương)</h3>
<table>
<tr><th>Thành phần</th><th>Trọng số</th><th>Yêu cầu</th></tr>
<tr><td>Dự án nhóm — Chiến lược Go-to-Market TMĐT</td><td>30%</td><td>Đưa một sản phẩm hữu hình lên kênh trực tuyến theo bốn giai đoạn (xem bài 7.3)</td></tr>
<tr><td>Bài cá nhân — memo</td><td>15%</td><td>Memo 500–700 từ viết trong 90 phút: chiến lược số tích hợp và đánh giá đạo đức</td></tr>
<tr><td>Tham gia</td><td>10%</td><td>Hoạt động và thảo luận trên lớp</td></tr>
<tr><td>Quiz giữa kỳ (Chương 1–5)</td><td>15%</td><td>30 câu trắc nghiệm</td></tr>
<tr><td>Thi cuối kỳ</td><td>30%</td><td>50 câu trắc nghiệm, 60 phút, không dùng tài liệu</td></tr>
</table>
<h3>Cách học môn này</h3>
<ul>
<li><strong>Học thuật ngữ thật chính xác.</strong> Đề trắc nghiệm hỏi định nghĩa: tám đặc trưng độc đáo, tám yếu tố của mô hình kinh doanh, sáu chiều của bảo mật, các loại sàn B2B.</li>
<li><strong>Luôn hỏi "kiếm tiền bằng cách nào?"</strong> Chương nào cũng quay về tuyên bố giá trị và mô hình doanh thu.</li>
<li><strong>Tự làm các phép tính.</strong> Tỷ lệ chuyển đổi, chi phí mỗi lượt nhấp, chi phí thu hút khách hàng và doanh thu hoà vốn chỉ là số học đơn giản, nhưng quyết định một doanh nghiệp trực tuyến có khả thi hay không. Mọi số liệu trong môn là minh hoạ (giả định) và đã được kiểm tra.</li>
<li><strong>Liên hệ Việt Nam một cách thận trọng.</strong> Chúng ta dẫn tới quy định Việt Nam ở những chỗ quan trọng (dữ liệu cá nhân, bảo vệ người tiêu dùng, quy định về TMĐT), luôn kèm lời khuyên kiểm tra văn bản đang có hiệu lực.</li>
</ul>
<div class="callout"><span class="badge">Phạm vi</span> Đây là môn khảo sát nhập môn. Các môn sau trong chương trình (ví dụ PSE301, EAI201, ESM301 và EDC301) sẽ đi sâu vào từng mảng; ở đây mục tiêu là một tấm bản đồ đúng và liên kết của toàn bộ lĩnh vực.</div>`,
  ]]);

const p11 = doc('eec101-1-1-introduction', '1.1 — Ch 1 · Introduction to e-commerce: the eight unique features|||1.1 — Ch 1 · Nhập môn TMĐT: tám đặc trưng độc đáo',
  'Định nghĩa TMĐT và kinh doanh điện tử, Internet – Web – nền tảng di động, tám đặc trưng độc đáo của công nghệ TMĐT, sáu loại TMĐT (B2C, B2B, C2C, di động, mạng xã hội, địa phương), lược sử ba giai đoạn và vì sao phải nhìn TMĐT qua nhiều ngành học.',
  [[
    `<span class="eyebrow">EEC101 · Part 1 · Lesson 1.1</span>
<h2>Introduction to e-commerce: the eight unique features</h2>
<h3>Definitions that the exam expects</h3>
<ul>
<li><strong>E-commerce</strong> is the use of the Internet, the Web and mobile apps and browsers running on mobile devices to transact business — more precisely, <em>digitally enabled commercial transactions</em> between and among organizations and individuals. A commercial transaction involves an <strong>exchange of value</strong> (usually money) across organizational or individual boundaries in return for products or services.</li>
<li><strong>E-business</strong> is the digital enabling of transactions and processes <em>within</em> a firm, involving information systems under the firm's control (for example an online inventory system). When value is exchanged with an outside party, e-business becomes e-commerce.</li>
<li>The <strong>Internet</strong> is the worldwide network of computer networks built on common standards; the <strong>Web</strong> is one of its most popular services, giving access to billions of pages; the <strong>mobile platform</strong> (smartphones, tablets and their apps) is now the main way many people reach both.</li>
</ul>
<h3>The eight unique features of e-commerce technology</h3>
<table>
<tr><th>Feature</th><th>Meaning</th><th>Business significance</th></tr>
<tr><td>Ubiquity</td><td>Available just about everywhere, at all times — at work, at home, on a phone</td><td>The marketplace becomes a <em>marketspace</em> beyond physical and temporal limits; lower shopping (transaction) costs for consumers</td></tr>
<tr><td>Global reach</td><td>Reaches across national boundaries</td><td>The potential market size is roughly the online population of the world</td></tr>
<tr><td>Universal standards</td><td>One set of technical standards (the Internet standards) shared worldwide</td><td>Lower market-entry costs for merchants and lower search costs for consumers</td></tr>
<tr><td>Richness</td><td>Video, audio and text messages are possible</td><td>Rich marketing messages combined with interaction at scale</td></tr>
<tr><td>Interactivity</td><td>Two-way communication between merchant and consumer</td><td>Consumers become co-participants in delivering the product</td></tr>
<tr><td>Information density</td><td>More, cheaper, higher-quality information for all parties</td><td>Price and cost transparency; merchants can also practise <em>price discrimination</em> and segmentation</td></tr>
<tr><td>Personalization / customization</td><td>Messages and products tailored to individuals</td><td>Marketing based on each person's name, interests and past purchases</td></tr>
<tr><td>Social technology</td><td>User-generated content and social networks</td><td>A many-to-many communication model: users create and share content, not just receive it</td></tr>
</table>
<h3>Types of e-commerce</h3>
<p>The textbook classifies e-commerce mainly by the nature of the market relationship — who sells to whom — and by the technology platform used:</p>
<ul>
<li><strong>B2C</strong> (business-to-consumer) — online businesses sell to individual consumers; the type most people meet.</li>
<li><strong>B2B</strong> (business-to-business) — businesses sell to other businesses; the largest type by value (Ch 12).</li>
<li><strong>C2C</strong> (consumer-to-consumer) — consumers sell to each other with the help of a market maker (a marketplace or classifieds platform).</li>
<li><strong>Mobile e-commerce (m-commerce)</strong> — transactions on smartphones and tablets over cellular or Wi-Fi networks.</li>
<li><strong>Social e-commerce</strong> — commerce enabled by social networks and online social relationships.</li>
<li><strong>Local e-commerce</strong> — commerce focused on engaging consumers based on their current geographic location (restaurants, services nearby).</li>
</ul>
<p>The types overlap: ordering a nearby meal through a phone app after seeing a friend's post is mobile, social <em>and</em> local.</p>
<h3>A brief history in three periods</h3>
<table>
<tr><th>Period</th><th>Character</th></tr>
<tr><td>Invention (1995–2000)</td><td>Technology-driven, heavy venture capital, first-mover race; early visions of "friction-free" markets and disintermediation largely did not come true</td></tr>
<tr><td>Consolidation (2001–2006)</td><td>Business-driven after the dot-com crash; emphasis on sound business models and profits; established retailers moved online</td></tr>
<tr><td>Reinvention (2007–present)</td><td>Audience-driven: social networks, the mobile platform and local services; on-demand services and a creator economy</td></tr>
</table>
<h3>Why many disciplines</h3>
<p>Technical approaches (computer science, operations research, information systems) and behavioural approaches (economics, marketing, management, sociology, law) each explain part of e-commerce. The course deliberately mixes them — the three lenses of business, technology and society.</p>
<div class="callout"><span class="badge">Exam tip</span> Do not confuse <em>richness</em> (how complex and rich a message can be) with <em>information density</em> (how much information is available to all market participants, and at what cost). Both are classic multiple-choice traps.</div>`,
    `<span class="eyebrow">EEC101 · Phần 1 · Bài 1.1</span>
<h2>Nhập môn TMĐT: tám đặc trưng độc đáo</h2>
<h3>Những định nghĩa đề thi đòi hỏi</h3>
<ul>
<li><strong>Thương mại điện tử</strong> là việc dùng Internet, Web, ứng dụng và trình duyệt trên thiết bị di động để tiến hành giao dịch kinh doanh — chính xác hơn, là <em>các giao dịch thương mại được thực hiện bằng phương tiện số</em> giữa các tổ chức và cá nhân. Một giao dịch thương mại bao gồm việc <strong>trao đổi giá trị</strong> (thường là tiền) vượt qua ranh giới của tổ chức hoặc cá nhân để đổi lấy sản phẩm hay dịch vụ.</li>
<li><strong>Kinh doanh điện tử (e-business)</strong> là việc số hoá các giao dịch và quy trình <em>bên trong</em> doanh nghiệp, dùng các hệ thống thông tin do doanh nghiệp kiểm soát (ví dụ hệ thống quản lý tồn kho trực tuyến). Khi có trao đổi giá trị với bên ngoài, e-business trở thành e-commerce.</li>
<li><strong>Internet</strong> là mạng toàn cầu của các mạng máy tính dựa trên chuẩn chung; <strong>Web</strong> là một trong những dịch vụ phổ biến nhất của Internet, cho phép truy cập hàng tỷ trang; <strong>nền tảng di động</strong> (điện thoại thông minh, máy tính bảng và ứng dụng) nay là cách chính để nhiều người tiếp cận cả hai.</li>
</ul>
<h3>Tám đặc trưng độc đáo của công nghệ TMĐT</h3>
<table>
<tr><th>Đặc trưng</th><th>Ý nghĩa</th><th>Tầm quan trọng với kinh doanh</th></tr>
<tr><td>Tính phổ biến khắp nơi (ubiquity)</td><td>Có mặt gần như ở mọi nơi, mọi lúc — ở cơ quan, ở nhà, trên điện thoại</td><td>Chợ truyền thống thành <em>không gian thị trường</em> (marketspace) vượt giới hạn vật lý và thời gian; giảm chi phí giao dịch mua sắm cho người tiêu dùng</td></tr>
<tr><td>Phạm vi toàn cầu (global reach)</td><td>Vươn qua biên giới quốc gia</td><td>Quy mô thị trường tiềm năng xấp xỉ dân số trực tuyến của thế giới</td></tr>
<tr><td>Tiêu chuẩn chung (universal standards)</td><td>Một bộ chuẩn kỹ thuật (chuẩn Internet) dùng chung toàn cầu</td><td>Giảm chi phí gia nhập thị trường cho người bán và chi phí tìm kiếm cho người mua</td></tr>
<tr><td>Tính phong phú (richness)</td><td>Có thể truyền thông điệp video, âm thanh, văn bản</td><td>Thông điệp marketing phong phú kết hợp với tương tác trên quy mô lớn</td></tr>
<tr><td>Tính tương tác (interactivity)</td><td>Giao tiếp hai chiều giữa người bán và người mua</td><td>Người tiêu dùng trở thành người cùng tham gia vào việc cung cấp sản phẩm</td></tr>
<tr><td>Mật độ thông tin (information density)</td><td>Nhiều thông tin hơn, rẻ hơn, chất lượng hơn cho mọi bên</td><td>Minh bạch về giá và chi phí; người bán cũng có thể <em>phân biệt giá</em> và phân khúc</td></tr>
<tr><td>Cá nhân hoá / tuỳ biến</td><td>Thông điệp và sản phẩm được may đo cho từng người</td><td>Marketing dựa trên tên, sở thích, lịch sử mua hàng của từng người</td></tr>
<tr><td>Công nghệ xã hội (social technology)</td><td>Nội dung do người dùng tạo và mạng xã hội</td><td>Mô hình truyền thông nhiều-tới-nhiều: người dùng tạo và chia sẻ nội dung, không chỉ tiếp nhận</td></tr>
</table>
<h3>Các loại TMĐT</h3>
<p>Giáo trình phân loại TMĐT chủ yếu theo bản chất quan hệ thị trường — ai bán cho ai — và theo nền tảng công nghệ được dùng:</p>
<ul>
<li><strong>B2C</strong> (doanh nghiệp – người tiêu dùng) — doanh nghiệp trực tuyến bán cho người tiêu dùng cá nhân; loại mà đa số mọi người gặp.</li>
<li><strong>B2B</strong> (doanh nghiệp – doanh nghiệp) — doanh nghiệp bán cho doanh nghiệp; loại lớn nhất xét theo giá trị (Ch 12).</li>
<li><strong>C2C</strong> (người tiêu dùng – người tiêu dùng) — người tiêu dùng bán cho nhau nhờ một bên tạo lập thị trường (sàn giao dịch hoặc nền tảng rao vặt).</li>
<li><strong>TMĐT di động (m-commerce)</strong> — giao dịch trên điện thoại thông minh, máy tính bảng qua mạng di động hoặc Wi-Fi.</li>
<li><strong>TMĐT mạng xã hội (social e-commerce)</strong> — thương mại được hỗ trợ bởi mạng xã hội và các mối quan hệ xã hội trực tuyến.</li>
<li><strong>TMĐT địa phương (local e-commerce)</strong> — thương mại tập trung vào việc tiếp cận người tiêu dùng theo vị trí địa lý hiện tại của họ (quán ăn, dịch vụ gần đó).</li>
</ul>
<p>Các loại này chồng lấn nhau: đặt một bữa ăn gần nhà qua ứng dụng điện thoại sau khi thấy bài đăng của bạn bè vừa là di động, vừa là mạng xã hội, <em>vừa là</em> địa phương.</p>
<h3>Lược sử qua ba giai đoạn</h3>
<table>
<tr><th>Giai đoạn</th><th>Đặc điểm</th></tr>
<tr><td>Phát minh (1995–2000)</td><td>Dẫn dắt bởi công nghệ, vốn mạo hiểm dồi dào, cuộc đua giành lợi thế đi đầu; những viễn cảnh ban đầu về thị trường "không ma sát" và loại bỏ trung gian phần lớn không thành hiện thực</td></tr>
<tr><td>Củng cố (2001–2006)</td><td>Dẫn dắt bởi kinh doanh sau khi bong bóng dot-com vỡ; chú trọng mô hình kinh doanh vững và lợi nhuận; các nhà bán lẻ truyền thống lên mạng</td></tr>
<tr><td>Tái tạo (2007–nay)</td><td>Dẫn dắt bởi khán giả: mạng xã hội, nền tảng di động và dịch vụ địa phương; dịch vụ theo yêu cầu và nền kinh tế nhà sáng tạo</td></tr>
</table>
<h3>Vì sao cần nhiều ngành học</h3>
<p>Cách tiếp cận kỹ thuật (khoa học máy tính, vận trù học, hệ thống thông tin) và cách tiếp cận hành vi (kinh tế học, marketing, quản trị, xã hội học, luật) mỗi bên giải thích một phần của TMĐT. Môn học cố ý kết hợp chúng — ba lăng kính kinh doanh, công nghệ, xã hội.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Đừng nhầm <em>tính phong phú</em> (thông điệp có thể phức tạp, giàu nội dung đến đâu) với <em>mật độ thông tin</em> (lượng thông tin sẵn có cho mọi bên trên thị trường và chi phí để có nó). Cả hai là bẫy trắc nghiệm kinh điển.</div>`,
  ]]);

const p12 = doc('eec101-1-2-business-models', '1.2 — Ch 2 · The eight elements of a business model|||1.2 — Ch 2 · Tám yếu tố của mô hình kinh doanh',
  'Mô hình kinh doanh và kế hoạch kinh doanh, tám yếu tố (tuyên bố giá trị, mô hình doanh thu, cơ hội thị trường, môi trường cạnh tranh, lợi thế cạnh tranh, chiến lược thị trường, phát triển tổ chức, đội ngũ quản lý), năm mô hình doanh thu chính và các nguồn huy động vốn cho startup.',
  [[
    `<span class="eyebrow">EEC101 · Part 1 · Lesson 1.2</span>
<h2>The eight elements of a business model</h2>
<p class="lead">A <strong>business model</strong> is a set of planned activities designed to result in a profit in a marketplace. A <strong>business plan</strong> is the document that describes it; an <strong>e-commerce business model</strong> aims to use and leverage the unique features of the Internet, the Web and the mobile platform.</p>
<h3>The eight key elements</h3>
<table>
<tr><th>Element</th><th>Key question</th></tr>
<tr><td>1. Value proposition</td><td>Why should the customer buy from you? (personalization, lower search and price-discovery costs, convenience, selection, speed of delivery)</td></tr>
<tr><td>2. Revenue model</td><td>How will you earn revenue, generate profits and a return on invested capital?</td></tr>
<tr><td>3. Market opportunity</td><td>What marketspace do you intend to serve and how big is it? (the <em>realistic</em> part you can win, not the whole market)</td></tr>
<tr><td>4. Competitive environment</td><td>Who else occupies your intended marketspace — direct competitors and indirect substitutes?</td></tr>
<tr><td>5. Competitive advantage</td><td>What special advantages does your firm bring to the marketspace?</td></tr>
<tr><td>6. Market strategy</td><td>How do you plan to promote your products or services to attract your target audience?</td></tr>
<tr><td>7. Organizational development</td><td>What organizational structures and roles are needed to carry out the plan?</td></tr>
<tr><td>8. Management team</td><td>What kinds of experiences and backgrounds should the company's leaders have?</td></tr>
</table>
<h3>Five major revenue models</h3>
<table>
<tr><th>Model</th><th>How money is earned</th></tr>
<tr><td>Advertising</td><td>The firm provides content or services and charges advertisers for displaying ads to its audience</td></tr>
<tr><td>Subscription</td><td>Users pay a recurring fee for access to content or services; <em>freemium</em> gives a basic tier free and charges for premium features</td></tr>
<tr><td>Transaction fee</td><td>The firm takes a fee (or commission) for enabling or executing a transaction</td></tr>
<tr><td>Sales</td><td>The firm sells goods, content or services directly to customers</td></tr>
<tr><td>Affiliate</td><td>The firm steers business to an affiliate and receives a referral fee or a percentage of the resulting sales</td></tr>
</table>
<p>Many firms combine several models — a marketplace may earn transaction fees from sellers, advertising from sponsored listings and subscription fees from a premium membership.</p>
<h3>Competitive advantage — the textbook vocabulary</h3>
<ul>
<li>An <strong>asymmetry</strong> exists when one participant has more resources (financial backing, knowledge, information or power) than others.</li>
<li><strong>First-mover advantage</strong> goes to a firm that is first into a marketplace with a useful product; it often fails without <strong>complementary resources</strong> (brand, financing, logistics) to sustain it.</li>
<li>An <strong>unfair competitive advantage</strong> is based on a factor that other firms cannot purchase (a patent, an exclusive supplier, a famous brand).</li>
<li>A <strong>perfect market</strong> has no competitive advantages or asymmetries, because all firms have equal access to all factors of production.</li>
<li><strong>Leverage</strong> is using your competitive advantage to achieve more advantage in surrounding markets.</li>
</ul>
<h3>Raising capital</h3>
<p>Start-ups typically move from <strong>seed capital</strong> (founders' savings, family and friends) to <strong>incubators</strong> and <strong>accelerators</strong> (small funding plus mentoring), <strong>crowdfunding</strong> (many small contributions through an online platform), <strong>angel investors</strong> (wealthy individuals investing their own money) and <strong>venture capital</strong> (funds investing larger amounts in exchange for equity and control rights). Each step usually gives up more ownership in exchange for more money.</p>
<div class="callout"><span class="badge">Remember</span> The value proposition and the revenue model are the two most important elements — but a plan that is weak on market strategy or management team rarely gets funded. Investors read all eight.</div>`,
    `<span class="eyebrow">EEC101 · Phần 1 · Bài 1.2</span>
<h2>Tám yếu tố của mô hình kinh doanh</h2>
<p class="lead"><strong>Mô hình kinh doanh</strong> là tập hợp các hoạt động được hoạch định nhằm tạo ra lợi nhuận trên một thị trường. <strong>Kế hoạch kinh doanh</strong> là văn bản mô tả mô hình đó; <strong>mô hình kinh doanh TMĐT</strong> hướng tới việc sử dụng và khai thác các đặc trưng độc đáo của Internet, Web và nền tảng di động.</p>
<h3>Tám yếu tố then chốt</h3>
<table>
<tr><th>Yếu tố</th><th>Câu hỏi then chốt</th></tr>
<tr><td>1. Tuyên bố giá trị (value proposition)</td><td>Vì sao khách hàng nên mua của bạn? (cá nhân hoá, giảm chi phí tìm kiếm và dò giá, tiện lợi, nhiều lựa chọn, giao nhanh)</td></tr>
<tr><td>2. Mô hình doanh thu (revenue model)</td><td>Bạn sẽ tạo doanh thu, lợi nhuận và tỷ suất sinh lời trên vốn đầu tư bằng cách nào?</td></tr>
<tr><td>3. Cơ hội thị trường (market opportunity)</td><td>Bạn định phục vụ không gian thị trường nào và nó lớn tới đâu? (phần <em>thực tế</em> bạn giành được, không phải toàn bộ thị trường)</td></tr>
<tr><td>4. Môi trường cạnh tranh (competitive environment)</td><td>Ai khác đang có mặt trong không gian thị trường đó — đối thủ trực tiếp và sản phẩm thay thế gián tiếp?</td></tr>
<tr><td>5. Lợi thế cạnh tranh (competitive advantage)</td><td>Doanh nghiệp bạn mang lại lợi thế đặc biệt gì cho không gian thị trường đó?</td></tr>
<tr><td>6. Chiến lược thị trường (market strategy)</td><td>Bạn định quảng bá sản phẩm, dịch vụ thế nào để thu hút khách hàng mục tiêu?</td></tr>
<tr><td>7. Phát triển tổ chức (organizational development)</td><td>Cần cơ cấu tổ chức và vai trò nào để thực hiện kế hoạch?</td></tr>
<tr><td>8. Đội ngũ quản lý (management team)</td><td>Lãnh đạo công ty cần có kinh nghiệm và nền tảng gì?</td></tr>
</table>
<h3>Năm mô hình doanh thu chính</h3>
<table>
<tr><th>Mô hình</th><th>Cách kiếm tiền</th></tr>
<tr><td>Quảng cáo</td><td>Doanh nghiệp cung cấp nội dung hoặc dịch vụ và thu phí nhà quảng cáo để hiển thị quảng cáo tới khán giả của mình</td></tr>
<tr><td>Thuê bao</td><td>Người dùng trả phí định kỳ để truy cập nội dung, dịch vụ; <em>freemium</em> cho dùng miễn phí gói cơ bản và thu phí tính năng cao cấp</td></tr>
<tr><td>Phí giao dịch</td><td>Doanh nghiệp thu một khoản phí (hoặc hoa hồng) vì đã tạo điều kiện hay thực hiện giao dịch</td></tr>
<tr><td>Bán hàng</td><td>Doanh nghiệp bán hàng hoá, nội dung, dịch vụ trực tiếp cho khách hàng</td></tr>
<tr><td>Liên kết (affiliate)</td><td>Doanh nghiệp dẫn khách tới một đối tác liên kết và nhận phí giới thiệu hoặc một tỷ lệ phần trăm trên doanh số phát sinh</td></tr>
</table>
<p>Nhiều doanh nghiệp kết hợp nhiều mô hình — một sàn có thể thu phí giao dịch từ người bán, thu quảng cáo từ tin tài trợ và thu phí thuê bao từ gói thành viên cao cấp.</p>
<h3>Lợi thế cạnh tranh — thuật ngữ của giáo trình</h3>
<ul>
<li><strong>Bất cân xứng (asymmetry)</strong> tồn tại khi một bên tham gia có nhiều nguồn lực hơn các bên khác (tài chính, hiểu biết, thông tin hoặc quyền lực).</li>
<li><strong>Lợi thế người đi đầu (first-mover advantage)</strong> thuộc về doanh nghiệp vào thị trường đầu tiên với một sản phẩm hữu ích; lợi thế này thường thất bại nếu thiếu <strong>nguồn lực bổ trợ</strong> (thương hiệu, tài chính, logistics) để duy trì.</li>
<li><strong>Lợi thế cạnh tranh không công bằng (unfair competitive advantage)</strong> dựa trên một yếu tố mà doanh nghiệp khác không mua được (bằng sáng chế, nhà cung cấp độc quyền, thương hiệu nổi tiếng).</li>
<li><strong>Thị trường hoàn hảo</strong> không có lợi thế cạnh tranh hay bất cân xứng nào, vì mọi doanh nghiệp đều tiếp cận như nhau mọi yếu tố sản xuất.</li>
<li><strong>Đòn bẩy (leverage)</strong> là dùng lợi thế cạnh tranh sẵn có để giành thêm lợi thế ở các thị trường xung quanh.</li>
</ul>
<h3>Huy động vốn</h3>
<p>Startup thường đi từ <strong>vốn hạt giống</strong> (tiền tiết kiệm của nhà sáng lập, gia đình và bạn bè) tới <strong>vườn ươm</strong> và <strong>chương trình tăng tốc</strong> (khoản tài trợ nhỏ kèm cố vấn), <strong>gọi vốn cộng đồng</strong> (nhiều khoản đóng góp nhỏ qua nền tảng trực tuyến), <strong>nhà đầu tư thiên thần</strong> (cá nhân giàu có đầu tư tiền của chính mình) và <strong>quỹ đầu tư mạo hiểm</strong> (đầu tư số tiền lớn hơn để đổi lấy cổ phần và quyền kiểm soát). Mỗi bước thường nhường thêm quyền sở hữu để đổi lấy nhiều tiền hơn.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Tuyên bố giá trị và mô hình doanh thu là hai yếu tố quan trọng nhất — nhưng một kế hoạch yếu ở chiến lược thị trường hay đội ngũ quản lý hiếm khi gọi được vốn. Nhà đầu tư đọc cả tám yếu tố.</div>`,
  ]]);

const p13 = doc('eec101-1-3-b2c-b2b-strategy', '1.3 — Ch 2 · B2C and B2B models; how e-commerce changes strategy|||1.3 — Ch 2 · Mô hình B2C, B2B; TMĐT thay đổi chiến lược thế nào',
  'Bảy mô hình kinh doanh B2C chính, các mô hình B2B (sàn: nhà phân phối điện tử, mua sắm điện tử, sàn giao dịch, liên minh ngành; mạng công nghiệp riêng), và TMĐT thay đổi cấu trúc ngành (năm lực lượng cạnh tranh), chuỗi giá trị, mạng giá trị và chiến lược kinh doanh ra sao.',
  [[
    `<span class="eyebrow">EEC101 · Part 1 · Lesson 1.3</span>
<h2>B2C and B2B models; how e-commerce changes strategy</h2>
<h3>Major B2C business models</h3>
<table>
<tr><th>Model</th><th>What it does</th><th>Main revenue model(s)</th></tr>
<tr><td>E-tailer</td><td>Online version of a retail store: virtual merchants (online only), omnichannel (bricks-and-clicks), catalog merchants, manufacturer-direct</td><td>Sales</td></tr>
<tr><td>Community provider</td><td>Creates an online environment (a social network) where people with similar interests communicate and share content</td><td>Advertising, subscription, affiliate</td></tr>
<tr><td>Content provider</td><td>Distributes information and entertainment — news, music, video, e-books</td><td>Advertising, subscription, sales of digital goods</td></tr>
<tr><td>Portal</td><td>Offers a gateway: search plus content and services in one place (horizontal or vertical)</td><td>Advertising, tenancy fees, subscription</td></tr>
<tr><td>Transaction broker</td><td>Processes online transactions for consumers — travel booking, online brokerage, job sites</td><td>Transaction fees</td></tr>
<tr><td>Market creator</td><td>Builds a digital environment where buyers and sellers meet, discover prices and transact (marketplaces, auctions, on-demand service platforms)</td><td>Transaction fees, commissions</td></tr>
<tr><td>Service provider</td><td>Provides online services — storage, software, photo sharing, booking tools</td><td>Sales of services, subscription, advertising</td></tr>
</table>
<h3>Major B2B business models</h3>
<ul>
<li><strong>Net marketplaces</strong> bring many buyers and sellers together: an <strong>e-distributor</strong> (one company's catalog serving many buyers), an <strong>e-procurement</strong> firm (software and services that let buyers manage purchasing from many suppliers), an <strong>exchange</strong> (an independent, often vertical market for spot purchases) and an <strong>industry consortium</strong> (an industry-owned vertical marketplace).</li>
<li>A <strong>private industrial network</strong> is a digital network run by one large firm to coordinate its own suppliers and partners — the most common form of B2B e-commerce (details in Ch 12).</li>
</ul>
<h3>How e-commerce changes business</h3>
<p><strong>Industry structure.</strong> E-commerce can change the five competitive forces of an industry: rivalry among existing competitors, the threat of substitute products, the barriers to entry, the bargaining power of suppliers and the bargaining power of buyers. Often it <em>lowers</em> barriers to entry and <em>raises</em> buyers' power (because prices are easy to compare), making industries more competitive.</p>
<p><strong>Value chains.</strong> An <strong>industry value chain</strong> is the set of firms from raw materials to final consumer; e-commerce can shorten it (manufacturers selling direct, <em>disintermediation</em>) or add new intermediaries (marketplaces, comparison sites — <em>reintermediation</em>). A <strong>firm value chain</strong> is the set of activities a firm performs to create products (inbound logistics, operations, outbound logistics, sales and marketing, after-sales service, plus support activities); e-commerce can make each activity more efficient. A <strong>firm value web</strong> is a networked system that coordinates the value chains of several firms — suppliers, partners and customers — as one system.</p>
<p><strong>Business strategy.</strong> A strategy is a set of plans for achieving superior long-term returns on capital. The generic options:</p>
<table>
<tr><th>Strategy</th><th>E-commerce example of the idea</th></tr>
<tr><td>Differentiation</td><td>Make the product or service unique — exclusive designs, a better return policy</td></tr>
<tr><td>Cost competition</td><td>Offer the lowest price thanks to a more efficient process (automated warehouses, no stores)</td></tr>
<tr><td>Scope</td><td>Compete in all markets around the world, rather than only local or national markets</td></tr>
<tr><td>Focus / market niche</td><td>Serve a narrow market segment or product segment better than anyone</td></tr>
<tr><td>Customer intimacy</td><td>Build strong ties with customers, which raise their switching costs (personalized recommendations, loyalty programmes)</td></tr>
</table>
<p>Finally, e-commerce is a source of <strong>disruption</strong>: new firms with simpler, cheaper technologies can start at the low end of a market, improve, and eventually displace incumbents that focused on their best customers.</p>
<div class="callout"><span class="badge">Common confusion</span> A <em>market creator</em> does not own the goods — it earns a fee for bringing buyers and sellers together. An <em>e-tailer</em> buys (or makes) the goods and earns a margin on sales. The same company can run both models side by side.</div>`,
    `<span class="eyebrow">EEC101 · Phần 1 · Bài 1.3</span>
<h2>Mô hình B2C, B2B; TMĐT thay đổi chiến lược thế nào</h2>
<h3>Các mô hình kinh doanh B2C chính</h3>
<table>
<tr><th>Mô hình</th><th>Hoạt động</th><th>Mô hình doanh thu chính</th></tr>
<tr><td>Nhà bán lẻ điện tử (e-tailer)</td><td>Phiên bản trực tuyến của cửa hàng bán lẻ: nhà bán lẻ thuần trực tuyến, đa kênh (vừa cửa hàng vừa trực tuyến), bán qua catalog, nhà sản xuất bán trực tiếp</td><td>Bán hàng</td></tr>
<tr><td>Nhà cung cấp cộng đồng</td><td>Tạo môi trường trực tuyến (mạng xã hội) để những người cùng sở thích giao lưu, chia sẻ nội dung</td><td>Quảng cáo, thuê bao, liên kết</td></tr>
<tr><td>Nhà cung cấp nội dung</td><td>Phân phối thông tin và giải trí — tin tức, âm nhạc, video, sách điện tử</td><td>Quảng cáo, thuê bao, bán hàng hoá số</td></tr>
<tr><td>Cổng thông tin (portal)</td><td>Làm cửa ngõ: tìm kiếm cùng nội dung và dịch vụ ở một nơi (chiều ngang hoặc chiều dọc)</td><td>Quảng cáo, phí thuê chỗ, thuê bao</td></tr>
<tr><td>Môi giới giao dịch</td><td>Xử lý giao dịch trực tuyến cho người tiêu dùng — đặt vé du lịch, môi giới chứng khoán trực tuyến, trang việc làm</td><td>Phí giao dịch</td></tr>
<tr><td>Nhà tạo lập thị trường (market creator)</td><td>Xây môi trường số để người mua và người bán gặp nhau, xác lập giá và giao dịch (sàn, đấu giá, nền tảng dịch vụ theo yêu cầu)</td><td>Phí giao dịch, hoa hồng</td></tr>
<tr><td>Nhà cung cấp dịch vụ</td><td>Cung cấp dịch vụ trực tuyến — lưu trữ, phần mềm, chia sẻ ảnh, công cụ đặt lịch</td><td>Bán dịch vụ, thuê bao, quảng cáo</td></tr>
</table>
<h3>Các mô hình kinh doanh B2B chính</h3>
<ul>
<li><strong>Sàn thương mại mạng (net marketplace)</strong> tập hợp nhiều người mua và người bán: <strong>nhà phân phối điện tử</strong> (catalog của một công ty phục vụ nhiều người mua), doanh nghiệp <strong>mua sắm điện tử</strong> (phần mềm và dịch vụ giúp người mua quản lý việc mua từ nhiều nhà cung cấp), <strong>sàn giao dịch</strong> (thị trường độc lập, thường theo chiều dọc, cho mua giao ngay) và <strong>liên minh ngành</strong> (sàn chiều dọc do các doanh nghiệp trong ngành sở hữu).</li>
<li><strong>Mạng công nghiệp riêng (private industrial network)</strong> là mạng số do một doanh nghiệp lớn vận hành để điều phối nhà cung cấp và đối tác của chính mình — hình thức TMĐT B2B phổ biến nhất (chi tiết ở Ch 12).</li>
</ul>
<h3>TMĐT thay đổi kinh doanh thế nào</h3>
<p><strong>Cấu trúc ngành.</strong> TMĐT có thể làm thay đổi năm lực lượng cạnh tranh của một ngành: cạnh tranh giữa các đối thủ hiện tại, đe doạ từ sản phẩm thay thế, rào cản gia nhập, quyền thương lượng của nhà cung cấp và quyền thương lượng của người mua. Thường thì nó <em>hạ thấp</em> rào cản gia nhập và <em>tăng</em> quyền lực của người mua (vì so sánh giá dễ dàng), khiến ngành cạnh tranh gay gắt hơn.</p>
<p><strong>Chuỗi giá trị.</strong> <strong>Chuỗi giá trị ngành</strong> là tập hợp các doanh nghiệp từ nguyên liệu thô tới người tiêu dùng cuối cùng; TMĐT có thể rút ngắn nó (nhà sản xuất bán trực tiếp — <em>loại bỏ trung gian</em>) hoặc thêm trung gian mới (sàn, trang so sánh giá — <em>tái trung gian hoá</em>). <strong>Chuỗi giá trị doanh nghiệp</strong> là tập hợp các hoạt động doanh nghiệp thực hiện để tạo sản phẩm (logistics đầu vào, vận hành, logistics đầu ra, bán hàng và marketing, dịch vụ sau bán, cùng các hoạt động hỗ trợ); TMĐT có thể làm từng hoạt động hiệu quả hơn. <strong>Mạng giá trị doanh nghiệp</strong> là một hệ thống kết nối điều phối chuỗi giá trị của nhiều doanh nghiệp — nhà cung cấp, đối tác và khách hàng — như một hệ thống duy nhất.</p>
<p><strong>Chiến lược kinh doanh.</strong> Chiến lược là tập hợp kế hoạch nhằm đạt tỷ suất sinh lời dài hạn vượt trội trên vốn. Các lựa chọn chung:</p>
<table>
<tr><th>Chiến lược</th><th>Ví dụ ý tưởng trong TMĐT</th></tr>
<tr><td>Khác biệt hoá</td><td>Làm sản phẩm hay dịch vụ trở nên độc đáo — thiết kế độc quyền, chính sách đổi trả tốt hơn</td></tr>
<tr><td>Cạnh tranh về chi phí</td><td>Bán giá thấp nhất nhờ quy trình hiệu quả hơn (kho tự động, không cần cửa hàng)</td></tr>
<tr><td>Phạm vi</td><td>Cạnh tranh trên mọi thị trường toàn cầu thay vì chỉ thị trường địa phương hay quốc gia</td></tr>
<tr><td>Tập trung / thị trường ngách</td><td>Phục vụ một phân khúc thị trường hay dòng sản phẩm hẹp tốt hơn bất kỳ ai</td></tr>
<tr><td>Gắn bó mật thiết với khách hàng</td><td>Xây mối liên kết bền chặt với khách hàng, làm tăng chi phí chuyển đổi của họ (gợi ý cá nhân hoá, chương trình khách hàng thân thiết)</td></tr>
</table>
<p>Cuối cùng, TMĐT là nguồn gốc của <strong>sự đột phá (disruption)</strong>: doanh nghiệp mới với công nghệ đơn giản, rẻ hơn có thể bắt đầu ở phân khúc thấp của thị trường, cải tiến dần, và cuối cùng thay thế những doanh nghiệp đương nhiệm vốn chỉ chăm chút nhóm khách hàng tốt nhất của mình.</p>
<div class="callout"><span class="badge">Hay nhầm</span> <em>Nhà tạo lập thị trường</em> không sở hữu hàng hoá — nó thu phí vì kết nối người mua với người bán. <em>Nhà bán lẻ điện tử</em> mua (hoặc sản xuất) hàng và hưởng biên lợi nhuận trên doanh số. Cùng một công ty có thể chạy song song cả hai mô hình.</div>`,
  ]]);

const p1e = doc('eec101-1-4-exercise', 'Exercise 1 — a business model for a fictional startup|||Bài tập 1 — mô hình kinh doanh cho một startup giả định',
  'Bài tập: điền tám yếu tố của mô hình kinh doanh cho startup trà thủ công giả định, xếp loại mô hình B2C, so sánh mô hình doanh thu bán lẻ từng lần với thuê bao hằng tháng bằng lợi nhuận gộp trên mỗi khách hàng; kèm lời giải.',
  [[
    `<span class="eyebrow">EEC101 · Part 1 · Exercise</span>
<h2>Exercise 1 — TraXanh Box: which business model, which revenue model?</h2>
<div class="callout"><span class="badge">Problem</span> TraXanh Box (a fictional case, illustrative numbers) is a start-up of three students that sources craft teas from small farms in the northern highlands and sells them online to young urban office workers. (a) Describe the start-up with the eight elements of a business model. (b) Which B2C business model is it? (c) Compare two revenue models using gross profit per customer: <strong>Option A — sales</strong>: single boxes at VND 250,000, gross margin 40%, a customer buys on average 2 boxes in total; <strong>Option B — subscription</strong>: VND 199,000 a month, gross margin 35%, monthly churn 20% (so a subscriber stays on average 1 / 0.20 = 5 months). (d) Name one risk that the numbers do not show.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Eight elements
  1 Value proposition     curated, traceable craft teas delivered to the office;
                          discovery of a new tea each month, no need to search
  2 Revenue model         sales and/or subscription (see c); later affiliate
                          fees from tea-ware partners
  3 Market opportunity    urban office workers who buy premium drinks online —
                          the realistic share TraXanh can reach, not "all tea drinkers"
  4 Competitive env.      direct: other online tea shops, marketplace sellers;
                          indirect: coffee chains, bottled tea
  5 Competitive advantage exclusive sourcing agreements with small farms
                          (hard to copy), founders' knowledge of tea
  6 Market strategy       short-video content on tea origins, office sampling,
                          referral codes
  7 Organizational dev.   sourcing and quality, content and marketing,
                          operations and customer service; outsource delivery
  8 Management team       founders cover sourcing and marketing; need an
                          adviser with retail or logistics experience

(b) An e-tailer (a virtual merchant selling its own curated products),
    not a market creator — TraXanh buys the tea and earns a margin.

(c) Gross profit per customer
    A  2 x 250,000 x 40%          = 200,000
    B  5 x 199,000 x 35%          = 348,250
    Difference B − A              = 148,250 in favour of subscription

(d) Subscription only wins if churn really stays at 20% a month;
    if churn rose to 40%, average life = 1 / 0.40 = 2.5 months and
    B = 2.5 x 199,000 x 35% = 174,125 &lt; 200,000.</code></pre>
<p><strong>Why:</strong> the eight elements force you to answer the questions an investor will ask; the revenue model then turns the value proposition into money. Subscription earns more per customer here because a recurring relationship multiplies small monthly margins — but only if the value proposition (a new tea every month) keeps customers from cancelling. That is why subscription businesses watch churn as closely as sales.</p>`,
    `<span class="eyebrow">EEC101 · Phần 1 · Bài tập</span>
<h2>Bài tập 1 — TraXanh Box: mô hình kinh doanh nào, mô hình doanh thu nào?</h2>
<div class="callout"><span class="badge">Đề</span> TraXanh Box (tình huống giả định, số liệu minh hoạ giả định) là startup của ba sinh viên, thu mua trà thủ công từ các nông hộ nhỏ vùng cao phía Bắc và bán trực tuyến cho nhân viên văn phòng trẻ ở đô thị. (a) Mô tả startup theo tám yếu tố của mô hình kinh doanh. (b) Đây là mô hình kinh doanh B2C nào? (c) So sánh hai mô hình doanh thu bằng lợi nhuận gộp trên mỗi khách hàng: <strong>Phương án A — bán hàng</strong>: hộp lẻ 250.000 đồng, biên lợi nhuận gộp 40%, trung bình mỗi khách mua tổng cộng 2 hộp; <strong>Phương án B — thuê bao</strong>: 199.000 đồng/tháng, biên lợi nhuận gộp 35%, tỷ lệ huỷ hằng tháng 20% (nên trung bình một thuê bao kéo dài 1 / 0,20 = 5 tháng). (d) Nêu một rủi ro mà các con số không cho thấy.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Tám yếu tố
  1 Tuyên bố giá trị      trà thủ công chọn lọc, truy xuất được nguồn gốc, giao
                          tới văn phòng; mỗi tháng khám phá một loại trà mới,
                          không cần tự tìm
  2 Mô hình doanh thu     bán hàng và/hoặc thuê bao (xem c); sau này thêm phí
                          liên kết từ đối tác dụng cụ pha trà
  3 Cơ hội thị trường     nhân viên văn phòng đô thị mua đồ uống cao cấp trực
                          tuyến — phần thực tế TraXanh tiếp cận được, không phải
                          "mọi người uống trà"
  4 Môi trường cạnh tranh trực tiếp: các shop trà trực tuyến khác, người bán trên
                          sàn; gián tiếp: chuỗi cà phê, trà đóng chai
  5 Lợi thế cạnh tranh    thoả thuận thu mua độc quyền với nông hộ nhỏ (khó sao
                          chép), hiểu biết về trà của nhà sáng lập
  6 Chiến lược thị trường video ngắn kể nguồn gốc trà, cho dùng thử tại văn phòng,
                          mã giới thiệu
  7 Phát triển tổ chức    thu mua và chất lượng, nội dung và marketing, vận hành
                          và chăm sóc khách hàng; thuê ngoài giao hàng
  8 Đội ngũ quản lý       nhà sáng lập lo thu mua và marketing; cần một cố vấn có
                          kinh nghiệm bán lẻ hoặc logistics

(b) Nhà bán lẻ điện tử (bán lẻ thuần trực tuyến các sản phẩm tự tuyển chọn),
    không phải nhà tạo lập thị trường — TraXanh mua trà và hưởng biên lợi nhuận.

(c) Lợi nhuận gộp trên mỗi khách hàng
    A  2 x 250.000 x 40%          = 200.000
    B  5 x 199.000 x 35%          = 348.250
    Chênh lệch B − A              = 148.250, nghiêng về thuê bao

(d) Thuê bao chỉ thắng nếu tỷ lệ huỷ thật sự giữ ở 20%/tháng;
    nếu tăng lên 40%, thời gian trung bình = 1 / 0,40 = 2,5 tháng và
    B = 2,5 x 199.000 x 35% = 174.125 &lt; 200.000.</code></pre>
<p><strong>Vì sao:</strong> tám yếu tố buộc bạn trả lời đúng những câu hỏi nhà đầu tư sẽ hỏi; mô hình doanh thu sau đó biến tuyên bố giá trị thành tiền. Ở đây thuê bao thu được nhiều hơn trên mỗi khách vì quan hệ định kỳ nhân các khoản lãi nhỏ hằng tháng lên — nhưng chỉ khi tuyên bố giá trị (mỗi tháng một loại trà mới) giữ được khách không huỷ. Vì thế doanh nghiệp thuê bao theo dõi tỷ lệ huỷ sát sao như theo dõi doanh số.</p>`,
  ]]);

const p1q = quiz('eec101-quiz-1', 'Quiz 1 — Ch 1–2: foundations and business models|||Quiz 1 — Ch 1–2: nền tảng và mô hình kinh doanh', [
  { id: 'q1', question: 'Which unique feature of e-commerce technology refers to the fact that one set of technical standards is shared by all nations around the world?|||Đặc trưng độc đáo nào của công nghệ TMĐT nói rằng một bộ chuẩn kỹ thuật được mọi quốc gia trên thế giới dùng chung?', options: ['Ubiquity|||Tính phổ biến khắp nơi', 'Richness|||Tính phong phú', 'Universal standards|||Tiêu chuẩn chung', 'Information density|||Mật độ thông tin'], correctIndex: 2, explanation: 'Universal standards lower market-entry costs for merchants and search costs for consumers. Ubiquity is about being available everywhere, at all times.|||Tiêu chuẩn chung làm giảm chi phí gia nhập thị trường cho người bán và chi phí tìm kiếm cho người mua. Tính phổ biến khắp nơi nói về việc có mặt ở mọi nơi, mọi lúc.' },
  { id: 'q2', question: 'A platform earns a commission each time a buyer and a seller complete a deal on it, without owning the goods. Its business model is best described as…|||Một nền tảng thu hoa hồng mỗi khi người mua và người bán hoàn tất giao dịch trên đó, mà không sở hữu hàng hoá. Mô hình kinh doanh của nó đúng nhất là…', options: ['a market creator|||nhà tạo lập thị trường', 'an e-tailer|||nhà bán lẻ điện tử', 'a content provider|||nhà cung cấp nội dung', 'a community provider|||nhà cung cấp cộng đồng'], correctIndex: 0, explanation: 'Market creators build a digital environment where buyers and sellers meet and earn transaction fees; e-tailers own the goods and earn a margin on sales.|||Nhà tạo lập thị trường xây môi trường số cho người mua và người bán gặp nhau và thu phí giao dịch; nhà bán lẻ điện tử sở hữu hàng và hưởng biên lợi nhuận trên doanh số.' },
  { id: 'q3', question: 'Among the eight elements of a business model, which one answers the question “Why should the customer buy from you?”|||Trong tám yếu tố của mô hình kinh doanh, yếu tố nào trả lời câu hỏi “Vì sao khách hàng nên mua của bạn?”', options: ['Market opportunity|||Cơ hội thị trường', 'Competitive environment|||Môi trường cạnh tranh', 'Revenue model|||Mô hình doanh thu', 'Value proposition|||Tuyên bố giá trị'], correctIndex: 3, explanation: 'The value proposition defines how the product or service fulfils customer needs; the revenue model explains how the firm will earn money from it.|||Tuyên bố giá trị xác định sản phẩm, dịch vụ đáp ứng nhu cầu khách hàng thế nào; mô hình doanh thu giải thích doanh nghiệp kiếm tiền từ đó ra sao.' },
]);

const p21 = doc('eec101-2-1-internet-technology', '2.1 — Ch 3 · The Internet: technology foundations|||2.1 — Ch 3 · Internet: nền tảng công nghệ',
  'Chuyển mạch gói, bộ giao thức TCP/IP và bốn tầng, địa chỉ IP (IPv4, IPv6), tên miền, DNS và URL, mô hình khách/chủ, nền tảng di động, điện toán đám mây (IaaS, PaaS, SaaS; công cộng, riêng, lai) và các giao thức khác.',
  [[
    `<span class="eyebrow">EEC101 · Part 2 · Lesson 2.1</span>
<h2>The Internet: technology foundations</h2>
<p class="lead">Every online order — from tapping "Buy" to the confirmation page — rides on a small number of ideas designed decades ago. A manager does not need to configure them, but must understand them to judge costs, risks and vendors.</p>
<h3>Three building blocks</h3>
<ol>
<li><strong>Packet switching.</strong> Messages are split into small <strong>packets</strong>, each labelled with its origin and destination, sent along whatever path is available and reassembled at the destination. Routers decide the path. Because no dedicated circuit is reserved, the network's capacity is shared efficiently — the opposite of an old telephone call, which held a whole circuit.</li>
<li><strong>TCP/IP.</strong> A <strong>protocol</strong> is a set of rules for formatting, ordering and error-checking data. <strong>TCP</strong> (Transmission Control Protocol) establishes the connection, splits data into packets and makes sure they arrive complete and in order; <strong>IP</strong> (Internet Protocol) provides the addressing scheme and delivers the packets.</li>
<li><strong>Client/server computing.</strong> Powerful <strong>servers</strong> store web pages, databases and applications; <strong>clients</strong> (laptops, phones) request them. Today much of the server side lives in the cloud.</li>
</ol>
<h3>The four layers of TCP/IP</h3>
<table>
<tr><th>Layer</th><th>Role</th><th>Examples</th></tr>
<tr><td>Application</td><td>Services that users and programs see</td><td>HTTP/HTTPS, SMTP, IMAP, FTP, DNS</td></tr>
<tr><td>Transport</td><td>Communication between applications; packet ordering and acknowledgment</td><td>TCP (reliable), UDP (fast, no guarantee)</td></tr>
<tr><td>Internet</td><td>Addressing, packaging and routing of packets</td><td>IP</td></tr>
<tr><td>Network interface</td><td>Placing packets on and receiving them from the physical network</td><td>Ethernet, Wi-Fi, cellular</td></tr>
</table>
<h3>Addresses and names</h3>
<pre><code>IPv4 address   32 bits, written as four numbers 0–255     e.g. 203.0.113.25
               2^32  = 4,294,967,296  (about 4.3 billion addresses — not enough)
IPv6 address   128 bits, written in hexadecimal groups
               2^128 ≈ 3.4 x 10^38 addresses
Domain name    www.example.com   — the human-readable name
DNS            the Domain Name System translates the name into an IP address
URL            https://www.example.com/products/tea?id=12
               protocol  + domain name + path + parameters</code></pre>
<h3>The mobile platform and the cloud</h3>
<p>Smartphones and tablets are now the main access device for many users, which is why sites are designed "mobile first" (Ch 4). <strong>Cloud computing</strong> is a model in which firms and individuals obtain computing power and software over the Internet instead of buying and installing it on their own machines:</p>
<table>
<tr><th>Service model</th><th>What the customer rents</th></tr>
<tr><td>IaaS — infrastructure as a service</td><td>Processing, storage and networking; the customer manages its own software</td></tr>
<tr><td>PaaS — platform as a service</td><td>A development and hosting platform on which the customer builds its own applications</td></tr>
<tr><td>SaaS — software as a service</td><td>Ready-made software used through a browser or app, for example a hosted online-store platform</td></tr>
</table>
<p>Clouds can be <strong>public</strong> (shared, run by a provider), <strong>private</strong> (dedicated to one organization) or <strong>hybrid</strong> (a mix — sensitive systems private, the rest public). For e-commerce firms the cloud turns large up-front hardware costs into pay-as-you-go operating costs and makes it easier to cope with traffic peaks, at the price of dependence on the provider and new security and privacy questions.</p>
<h3>Other protocols worth knowing</h3>
<p><strong>HTTP</strong> transfers web pages; <strong>SMTP</strong> sends e-mail and <strong>IMAP/POP3</strong> retrieve it; <strong>FTP</strong> transfers files; <strong>TLS</strong> secures communications (Ch 5). Utility programs such as <em>ping</em> and <em>traceroute</em> test connections.</p>
<div class="callout"><span class="badge">Manager’s view</span> When a site feels slow, the cause can sit at any layer — the user's mobile connection, the route across networks, the DNS lookup or the server. Knowing the layers helps you ask the right vendor the right question.</div>`,
    `<span class="eyebrow">EEC101 · Phần 2 · Bài 2.1</span>
<h2>Internet: nền tảng công nghệ</h2>
<p class="lead">Mỗi đơn hàng trực tuyến — từ lúc bấm "Mua" tới trang xác nhận — đều chạy trên một số ít ý tưởng được thiết kế từ nhiều thập kỷ trước. Nhà quản lý không cần tự cấu hình chúng, nhưng phải hiểu chúng để đánh giá chi phí, rủi ro và nhà cung cấp.</p>
<h3>Ba khối nền tảng</h3>
<ol>
<li><strong>Chuyển mạch gói (packet switching).</strong> Thông điệp được chia thành các <strong>gói</strong> nhỏ, mỗi gói ghi rõ nơi gửi và nơi nhận, đi theo bất kỳ đường nào đang trống và được ghép lại ở đích. Bộ định tuyến (router) quyết định đường đi. Vì không giữ riêng một mạch nào, dung lượng mạng được chia sẻ hiệu quả — ngược với cuộc gọi điện thoại kiểu cũ vốn chiếm trọn một mạch.</li>
<li><strong>TCP/IP.</strong> <strong>Giao thức</strong> là bộ quy tắc về định dạng, sắp thứ tự và kiểm tra lỗi dữ liệu. <strong>TCP</strong> (giao thức điều khiển truyền vận) thiết lập kết nối, chia dữ liệu thành gói và bảo đảm chúng tới đủ và đúng thứ tự; <strong>IP</strong> (giao thức Internet) cung cấp hệ thống địa chỉ và chuyển các gói đi.</li>
<li><strong>Mô hình khách/chủ (client/server).</strong> Các <strong>máy chủ</strong> mạnh lưu trang web, cơ sở dữ liệu và ứng dụng; <strong>máy khách</strong> (máy tính xách tay, điện thoại) gửi yêu cầu tới chúng. Ngày nay phần lớn phía máy chủ nằm trên đám mây.</li>
</ol>
<h3>Bốn tầng của TCP/IP</h3>
<table>
<tr><th>Tầng</th><th>Vai trò</th><th>Ví dụ</th></tr>
<tr><td>Ứng dụng</td><td>Các dịch vụ mà người dùng và chương trình nhìn thấy</td><td>HTTP/HTTPS, SMTP, IMAP, FTP, DNS</td></tr>
<tr><td>Giao vận</td><td>Truyền thông giữa các ứng dụng; sắp thứ tự và xác nhận gói</td><td>TCP (tin cậy), UDP (nhanh, không bảo đảm)</td></tr>
<tr><td>Internet</td><td>Đánh địa chỉ, đóng gói và định tuyến gói tin</td><td>IP</td></tr>
<tr><td>Giao diện mạng</td><td>Đưa gói lên và nhận gói từ mạng vật lý</td><td>Ethernet, Wi-Fi, mạng di động</td></tr>
</table>
<h3>Địa chỉ và tên</h3>
<pre><code>Địa chỉ IPv4   32 bit, viết thành bốn số 0–255             vd 203.0.113.25
               2^32  = 4.294.967.296  (khoảng 4,3 tỷ địa chỉ — không đủ)
Địa chỉ IPv6   128 bit, viết thành các nhóm số thập lục phân
               2^128 ≈ 3,4 x 10^38 địa chỉ
Tên miền       www.example.com   — tên dễ đọc với con người
DNS            hệ thống tên miền dịch tên miền thành địa chỉ IP
URL            https://www.example.com/products/tea?id=12
               giao thức + tên miền + đường dẫn + tham số</code></pre>
<h3>Nền tảng di động và đám mây</h3>
<p>Điện thoại thông minh và máy tính bảng nay là thiết bị truy cập chính của nhiều người dùng, vì vậy website được thiết kế theo hướng "ưu tiên di động" (Ch 4). <strong>Điện toán đám mây</strong> là mô hình trong đó doanh nghiệp và cá nhân nhận năng lực tính toán và phần mềm qua Internet thay vì tự mua và cài trên máy của mình:</p>
<table>
<tr><th>Mô hình dịch vụ</th><th>Khách hàng thuê gì</th></tr>
<tr><td>IaaS — hạ tầng như một dịch vụ</td><td>Năng lực xử lý, lưu trữ và mạng; khách hàng tự quản lý phần mềm của mình</td></tr>
<tr><td>PaaS — nền tảng như một dịch vụ</td><td>Một nền tảng phát triển và vận hành, trên đó khách hàng tự xây ứng dụng</td></tr>
<tr><td>SaaS — phần mềm như một dịch vụ</td><td>Phần mềm làm sẵn, dùng qua trình duyệt hoặc ứng dụng, ví dụ một nền tảng cửa hàng trực tuyến được lưu trữ sẵn</td></tr>
</table>
<p>Đám mây có thể là <strong>công cộng</strong> (dùng chung, do nhà cung cấp vận hành), <strong>riêng</strong> (dành cho một tổ chức) hoặc <strong>lai</strong> (kết hợp — hệ thống nhạy cảm để riêng, phần còn lại dùng công cộng). Với doanh nghiệp TMĐT, đám mây biến chi phí phần cứng lớn ban đầu thành chi phí vận hành trả theo mức dùng và giúp dễ chịu được các đợt cao điểm truy cập, đổi lại là sự phụ thuộc vào nhà cung cấp cùng những câu hỏi mới về bảo mật và quyền riêng tư.</p>
<h3>Các giao thức khác nên biết</h3>
<p><strong>HTTP</strong> truyền trang web; <strong>SMTP</strong> gửi e-mail còn <strong>IMAP/POP3</strong> nhận e-mail; <strong>FTP</strong> truyền tệp; <strong>TLS</strong> bảo mật đường truyền (Ch 5). Các chương trình tiện ích như <em>ping</em> và <em>traceroute</em> dùng để kiểm tra kết nối.</p>
<div class="callout"><span class="badge">Góc nhìn nhà quản lý</span> Khi website chậm, nguyên nhân có thể nằm ở bất kỳ tầng nào — kết nối di động của người dùng, tuyến đường qua các mạng, bước tra DNS hay máy chủ. Hiểu các tầng giúp bạn hỏi đúng nhà cung cấp đúng câu hỏi.</div>`,
  ]]);

const p22 = doc('eec101-2-2-web-mobile', '2.2 — Ch 3 · Infrastructure, access, the Web and mobile apps|||2.2 — Ch 3 · Hạ tầng, truy cập, Web và ứng dụng di động',
  'Xương sống Internet, điểm trao đổi lưu lượng, các cấp ISP, truy cập băng rộng và di động, Internet vạn vật, ai quản trị Internet; Web: siêu văn bản, HTTP, HTML, máy chủ và trình duyệt; các tính năng và dịch vụ (truyền thông, tìm kiếm, streaming, Web 2.0, VR/AR, trợ lý thông minh); ứng dụng di động.',
  [[
    `<span class="eyebrow">EEC101 · Part 2 · Lesson 2.2</span>
<h2>Infrastructure, access, the Web and mobile apps</h2>
<h3>Internet infrastructure and access</h3>
<ul>
<li>The <strong>Internet backbone</strong> is a set of high-bandwidth fibre-optic networks owned by large carriers (Tier 1 providers) that connect with each other at <strong>Internet exchange points (IXPs)</strong>.</li>
<li><strong>Internet service providers (ISPs)</strong> sell access to firms and households; regional (Tier 2) and local (Tier 3) ISPs buy capacity from larger ones. <strong>Campus and corporate networks</strong> (local area networks) connect users inside an organization.</li>
<li><strong>Fixed broadband</strong> reaches homes by DSL over telephone lines, cable, fibre to the home and satellite. <strong>Mobile access</strong> uses cellular networks (4G, 5G) and <strong>Wi-Fi</strong> hotspots.</li>
<li>The <strong>Internet of Things (IoT)</strong> connects sensors and everyday devices (watches, cars, home appliances) to the Internet, creating new data — and new security problems (Ch 5).</li>
</ul>
<p><strong>Who governs the Internet?</strong> No single body. Technical coordination is shared by organizations such as <strong>ICANN</strong> (domain names and IP address allocation), the <strong>IETF</strong> (Internet protocols) and the <strong>W3C</strong> (Web standards such as HTML), while national governments regulate access and content within their borders (Ch 8).</p>
<h3>The Web</h3>
<p>The Web was developed at CERN around 1989–1991 by Tim Berners-Lee as a system for sharing linked documents. Its core pieces:</p>
<table>
<tr><th>Piece</th><th>What it does</th></tr>
<tr><td>Hypertext</td><td>Documents contain links to other documents, anywhere on the Internet</td></tr>
<tr><td>HTTP / HTTPS</td><td>The request–response protocol between browser and web server; HTTPS adds TLS encryption</td></tr>
<tr><td>URL</td><td>The address of each resource</td></tr>
<tr><td>HTML (with CSS and JavaScript)</td><td>HTML marks up the structure of a page; CSS controls its appearance; JavaScript adds behaviour</td></tr>
<tr><td>Web server software</td><td>Receives HTTP requests and returns pages, often generated on the fly from databases</td></tr>
<tr><td>Web browser</td><td>The client program that displays pages and runs their scripts</td></tr>
</table>
<h3>Features and services of the Internet and the Web</h3>
<ul>
<li><strong>Communication tools</strong> — e-mail, messaging apps, online forums, Voice over IP, video conferencing.</li>
<li><strong>Search engines</strong> — crawl the Web, index pages and rank results; they are also the largest advertising platforms (Ch 6).</li>
<li><strong>Downloadable and streaming media</strong> — music, video and podcasts delivered on demand (Ch 10).</li>
<li><strong>Web 2.0 applications</strong> — social networks, blogs and wikis built on user-generated content (Ch 11).</li>
<li><strong>Virtual and augmented reality</strong> and immersive "metaverse" environments — for example trying furniture in your own room through a phone camera.</li>
<li><strong>Artificial intelligence and intelligent assistants</strong> — voice assistants, chatbots and recommendation systems; generative AI now drafts text, images and code (lesson 4.4).</li>
</ul>
<h3>Mobile apps</h3>
<p>Two operating systems dominate smartphones — Apple's iOS and Google's Android — and each has its own <strong>app store</strong>, which reviews apps and usually takes a share of paid app and in-app revenue. For an e-commerce firm, an app offers speed, access to device features (camera, location, notifications) and a permanent icon on the customer's home screen, but it must be installed and maintained for each platform. Lesson 2.3 compares apps with mobile websites.</p>
<div class="callout"><span class="badge">Key distinction</span> The Internet is the network; the Web is one service that runs on it. E-mail, messaging and streaming apps also use the Internet without being "the Web".</div>`,
    `<span class="eyebrow">EEC101 · Phần 2 · Bài 2.2</span>
<h2>Hạ tầng, truy cập, Web và ứng dụng di động</h2>
<h3>Hạ tầng và truy cập Internet</h3>
<ul>
<li><strong>Xương sống Internet</strong> là tập hợp các mạng cáp quang băng thông cao do các nhà mạng lớn (nhà cung cấp cấp 1) sở hữu, kết nối với nhau tại các <strong>điểm trao đổi lưu lượng Internet (IXP)</strong>.</li>
<li><strong>Nhà cung cấp dịch vụ Internet (ISP)</strong> bán quyền truy cập cho doanh nghiệp và hộ gia đình; ISP khu vực (cấp 2) và địa phương (cấp 3) mua dung lượng từ ISP lớn hơn. <strong>Mạng khuôn viên và mạng doanh nghiệp</strong> (mạng cục bộ) kết nối người dùng trong một tổ chức.</li>
<li><strong>Băng rộng cố định</strong> tới hộ gia đình qua DSL trên đường dây điện thoại, cáp truyền hình, cáp quang tới nhà và vệ tinh. <strong>Truy cập di động</strong> dùng mạng di động (4G, 5G) và điểm phát <strong>Wi-Fi</strong>.</li>
<li><strong>Internet vạn vật (IoT)</strong> kết nối cảm biến và thiết bị thường ngày (đồng hồ, ô tô, đồ gia dụng) với Internet, tạo ra dữ liệu mới — và vấn đề bảo mật mới (Ch 5).</li>
</ul>
<p><strong>Ai quản trị Internet?</strong> Không có một cơ quan duy nhất. Việc điều phối kỹ thuật được chia sẻ giữa các tổ chức như <strong>ICANN</strong> (tên miền và phân bổ địa chỉ IP), <strong>IETF</strong> (các giao thức Internet) và <strong>W3C</strong> (chuẩn Web như HTML), trong khi chính phủ các nước quản lý truy cập và nội dung trong lãnh thổ của mình (Ch 8).</p>
<h3>Web</h3>
<p>Web được Tim Berners-Lee phát triển tại CERN khoảng năm 1989–1991 như một hệ thống chia sẻ tài liệu liên kết với nhau. Các thành phần cốt lõi:</p>
<table>
<tr><th>Thành phần</th><th>Chức năng</th></tr>
<tr><td>Siêu văn bản (hypertext)</td><td>Tài liệu chứa liên kết tới tài liệu khác ở bất kỳ đâu trên Internet</td></tr>
<tr><td>HTTP / HTTPS</td><td>Giao thức yêu cầu – phản hồi giữa trình duyệt và máy chủ web; HTTPS thêm mã hoá TLS</td></tr>
<tr><td>URL</td><td>Địa chỉ của từng tài nguyên</td></tr>
<tr><td>HTML (cùng CSS và JavaScript)</td><td>HTML đánh dấu cấu trúc trang; CSS quy định giao diện; JavaScript thêm hành vi</td></tr>
<tr><td>Phần mềm máy chủ web</td><td>Nhận yêu cầu HTTP và trả về trang, thường được sinh ra tức thời từ cơ sở dữ liệu</td></tr>
<tr><td>Trình duyệt web</td><td>Chương trình phía khách hiển thị trang và chạy các đoạn mã của trang</td></tr>
</table>
<h3>Tính năng và dịch vụ của Internet và Web</h3>
<ul>
<li><strong>Công cụ giao tiếp</strong> — e-mail, ứng dụng nhắn tin, diễn đàn trực tuyến, gọi thoại qua IP, hội nghị truyền hình.</li>
<li><strong>Công cụ tìm kiếm</strong> — thu thập dữ liệu Web, lập chỉ mục trang và xếp hạng kết quả; đồng thời là những nền tảng quảng cáo lớn nhất (Ch 6).</li>
<li><strong>Nội dung tải về và phát trực tuyến</strong> — nhạc, video, podcast theo yêu cầu (Ch 10).</li>
<li><strong>Ứng dụng Web 2.0</strong> — mạng xã hội, blog và wiki dựa trên nội dung do người dùng tạo (Ch 11).</li>
<li><strong>Thực tế ảo và thực tế tăng cường</strong> cùng môi trường nhập vai "metaverse" — ví dụ thử đặt đồ nội thất vào chính căn phòng của mình qua camera điện thoại.</li>
<li><strong>Trí tuệ nhân tạo và trợ lý thông minh</strong> — trợ lý giọng nói, chatbot và hệ thống gợi ý; AI tạo sinh nay còn soạn văn bản, hình ảnh và mã (bài 4.4).</li>
</ul>
<h3>Ứng dụng di động</h3>
<p>Hai hệ điều hành chiếm lĩnh điện thoại thông minh — iOS của Apple và Android của Google — và mỗi bên có <strong>kho ứng dụng</strong> riêng, nơi duyệt ứng dụng và thường thu một phần doanh thu từ ứng dụng trả phí và mua hàng trong ứng dụng. Với doanh nghiệp TMĐT, ứng dụng mang lại tốc độ, quyền dùng tính năng của thiết bị (camera, vị trí, thông báo đẩy) và một biểu tượng thường trực trên màn hình của khách, nhưng phải được cài đặt và bảo trì cho từng nền tảng. Bài 2.3 so sánh ứng dụng với website di động.</p>
<div class="callout"><span class="badge">Phân biệt then chốt</span> Internet là mạng; Web là một dịch vụ chạy trên mạng đó. E-mail, ứng dụng nhắn tin và ứng dụng phát trực tuyến cũng dùng Internet mà không phải là "Web".</div>`,
  ]]);

const p23 = doc('eec101-2-3-building-presence', '2.3 — Ch 4 · Building an e-commerce presence|||2.3 — Ch 4 · Xây dựng sự hiện diện TMĐT',
  'Hình dung sự hiện diện TMĐT (ý tưởng, mô hình doanh thu, khách hàng mục tiêu, nội dung, SWOT, bản đồ hiện diện, mốc thời gian, ngân sách), vòng đời phát triển hệ thống (SDLC) và các phương pháp thay thế, tự xây hay thuê ngoài, chọn phần mềm và phần cứng, thiết kế và SEO, website di động, ứng dụng web di động, ứng dụng gốc.',
  [[
    `<span class="eyebrow">EEC101 · Part 2 · Lesson 2.3</span>
<h2>Building an e-commerce presence</h2>
<h3>Step 1 — imagine it before you build it</h3>
<p>Planning starts with business questions, not software: What is the <strong>idea</strong> (the vision and mission)? Where is the <strong>money</strong> (business and revenue model)? Who and where is the <strong>target audience</strong>? What does the <strong>marketplace</strong> look like (size, competitors, trends)? Where does the <strong>content</strong> come from (static and dynamic content, user reviews)? A <strong>SWOT analysis</strong> (strengths, weaknesses, opportunities, threats) checks the plan against reality. The result is an <strong>e-commerce presence map</strong> covering four platform types — websites, e-mail, social media and offline media — with a <strong>timeline of milestones</strong> and a <strong>budget</strong>. Over time, the share of spending on hardware and software has fallen, while design, content, marketing and ongoing maintenance take a larger share.</p>
<h3>Step 2 — a systematic approach: the systems development life cycle (SDLC)</h3>
<table>
<tr><th>Phase</th><th>Key outputs</th></tr>
<tr><td>Systems analysis / planning</td><td>Business objectives (e.g. "display goods", "take payment") translated into <em>system functionalities</em> and <em>information requirements</em></td></tr>
<tr><td>Systems design</td><td><em>Logical design</em> (data flows, processing functions, databases) and <em>physical design</em> (specific hardware, software, telecommunications)</td></tr>
<tr><td>Building the system</td><td>Build in-house or <strong>outsource</strong>; host in-house, use a <strong>hosting</strong> provider, or <strong>co-locate</strong> your own servers in a vendor's facility</td></tr>
<tr><td>Testing</td><td><em>Unit</em> testing (each module), <em>system</em> testing (the whole site), <em>acceptance</em> testing (by business owners); <strong>A/B testing</strong> compares two versions of a page with real users; <strong>multivariate testing</strong> tests many elements at once</td></tr>
<tr><td>Implementation, maintenance and optimization</td><td>Ongoing updates, security patches, analytics; speed tuning of page content, page generation and page delivery (for example through a content delivery network)</td></tr>
</table>
<p>Alternatives to the classic "waterfall" SDLC include <strong>prototyping</strong>, <strong>agile development</strong> (short iterations with frequent releases), <strong>DevOps</strong> (development and operations working as one team with automated releases), <strong>component-based development</strong> and <strong>web services / microservices</strong> (small independent services connected through APIs).</p>
<h3>Choosing software</h3>
<ul>
<li>A <strong>simple</strong> (two-tier) architecture has a web server and a database server; a <strong>multi-tier</strong> architecture adds application servers, payment and inventory systems, often legacy systems.</li>
<li>Core functions of <strong>e-commerce merchant server software</strong>: an <strong>online catalog</strong>, a <strong>shopping cart</strong> and <strong>payment (credit card) processing</strong>; plus content management, site management and analytics tools.</li>
<li>Options range from <strong>SaaS e-commerce platforms</strong> (fast and cheap to start, monthly fee, less control), through <strong>open-source</strong> platforms (free licence, you pay for hosting and developers) to <strong>custom</strong> builds (maximum control and cost).</li>
</ul>
<h3>Choosing hardware</h3>
<p>Size the platform to demand: the number of <em>simultaneous users</em>, their profile (browsing or buying), static versus dynamic content and security processing. When demand grows, a site can <strong>scale vertically</strong> (more powerful individual servers), <strong>scale horizontally</strong> (more servers sharing the load) or improve its processing architecture (separating tasks onto specialized servers). Cloud hosting makes horizontal scaling easy for peak days such as big sale events.</p>
<h3>Other tools: design, SEO, personalization, policies</h3>
<p>Successful e-commerce sites are <em>functional</em> (pages work, load quickly), <em>informational</em> (easy to find company and product information), <em>easy to use</em>, have <em>redundant navigation</em>, make <em>purchase easy</em> (one or two clicks), work in all browsers, use simple graphics and legible text. <strong>Search engine optimization</strong> helps pages rank in organic results. <strong>Personalization</strong> tools tailor content to each visitor. An <strong>information policy set</strong> includes a privacy policy and accessibility rules for users with disabilities.</p>
<h3>Mobile presence: three options</h3>
<table>
<tr><th>Option</th><th>Strengths</th><th>Weaknesses</th></tr>
<tr><td>Mobile website (responsive or adaptive design)</td><td>One site for all devices; found by search engines; cheapest</td><td>Limited use of device features</td></tr>
<tr><td>Mobile web app (including progressive web apps)</td><td>App-like experience in the browser; no store approval</td><td>Fewer device features than native apps on some platforms</td></tr>
<tr><td>Native app</td><td>Fastest; full access to camera, location, notifications; icon on the home screen</td><td>Most expensive; built and maintained per platform; users must install it</td></tr>
</table>
<p><strong>Responsive web design</strong> adjusts the layout automatically to the screen size using flexible grids; <strong>adaptive web design</strong> detects the device on the server and delivers a version made for it. Most firms start "mobile first" with a responsive site and add an app only when repeat customers justify it.</p>
<div class="callout"><span class="badge">Lesson from practice</span> Many website projects go wrong for business reasons rather than technical ones — above all, unclear objectives in the planning phase. Write down what the site must do for the business before choosing any platform.</div>`,
    `<span class="eyebrow">EEC101 · Phần 2 · Bài 2.3</span>
<h2>Xây dựng sự hiện diện TMĐT</h2>
<h3>Bước 1 — hình dung trước khi xây</h3>
<p>Lập kế hoạch bắt đầu từ câu hỏi kinh doanh, không phải từ phần mềm: <strong>Ý tưởng</strong> là gì (tầm nhìn và sứ mệnh)? <strong>Tiền</strong> đến từ đâu (mô hình kinh doanh và doanh thu)? <strong>Khách hàng mục tiêu</strong> là ai, ở đâu? <strong>Thị trường</strong> ra sao (quy mô, đối thủ, xu hướng)? <strong>Nội dung</strong> lấy từ đâu (nội dung tĩnh, động, đánh giá của người dùng)? <strong>Phân tích SWOT</strong> (điểm mạnh, điểm yếu, cơ hội, thách thức) đối chiếu kế hoạch với thực tế. Kết quả là một <strong>bản đồ hiện diện TMĐT</strong> gồm bốn loại nền tảng — website, e-mail, mạng xã hội và truyền thông ngoại tuyến — kèm <strong>lịch trình các mốc</strong> và <strong>ngân sách</strong>. Theo thời gian, tỷ trọng chi cho phần cứng và phần mềm giảm dần, còn thiết kế, nội dung, marketing và bảo trì liên tục chiếm phần lớn hơn.</p>
<h3>Bước 2 — cách tiếp cận có hệ thống: vòng đời phát triển hệ thống (SDLC)</h3>
<table>
<tr><th>Giai đoạn</th><th>Đầu ra chính</th></tr>
<tr><td>Phân tích hệ thống / lập kế hoạch</td><td>Mục tiêu kinh doanh (vd "trưng bày hàng", "nhận thanh toán") được chuyển thành <em>chức năng hệ thống</em> và <em>yêu cầu thông tin</em></td></tr>
<tr><td>Thiết kế hệ thống</td><td><em>Thiết kế logic</em> (luồng dữ liệu, chức năng xử lý, cơ sở dữ liệu) và <em>thiết kế vật lý</em> (phần cứng, phần mềm, viễn thông cụ thể)</td></tr>
<tr><td>Xây dựng hệ thống</td><td>Tự xây hoặc <strong>thuê ngoài</strong>; tự vận hành máy chủ, dùng nhà cung cấp <strong>lưu trữ (hosting)</strong>, hoặc <strong>đặt chỗ (co-location)</strong> máy chủ của mình tại cơ sở của nhà cung cấp</td></tr>
<tr><td>Kiểm thử</td><td>Kiểm thử <em>đơn vị</em> (từng mô-đun), kiểm thử <em>hệ thống</em> (toàn bộ website), kiểm thử <em>chấp nhận</em> (do chủ doanh nghiệp); <strong>kiểm thử A/B</strong> so sánh hai phiên bản trang với người dùng thật; <strong>kiểm thử đa biến</strong> thử nhiều yếu tố cùng lúc</td></tr>
<tr><td>Triển khai, bảo trì và tối ưu</td><td>Cập nhật liên tục, vá bảo mật, phân tích số liệu; tăng tốc nội dung trang, khâu sinh trang và khâu phân phối trang (ví dụ qua mạng phân phối nội dung CDN)</td></tr>
</table>
<p>Các phương pháp thay thế cho SDLC "thác nước" cổ điển gồm <strong>làm mẫu thử (prototyping)</strong>, <strong>phát triển linh hoạt (agile)</strong> (vòng lặp ngắn, phát hành thường xuyên), <strong>DevOps</strong> (phát triển và vận hành làm việc như một đội với quy trình phát hành tự động), <strong>phát triển dựa trên thành phần</strong> và <strong>dịch vụ web / vi dịch vụ</strong> (các dịch vụ nhỏ độc lập kết nối qua API).</p>
<h3>Chọn phần mềm</h3>
<ul>
<li>Kiến trúc <strong>đơn giản</strong> (hai tầng) có một máy chủ web và một máy chủ cơ sở dữ liệu; kiến trúc <strong>nhiều tầng</strong> thêm máy chủ ứng dụng, hệ thống thanh toán, tồn kho, thường cả hệ thống cũ sẵn có.</li>
<li>Chức năng cốt lõi của <strong>phần mềm máy chủ bán hàng TMĐT</strong>: <strong>catalog trực tuyến</strong>, <strong>giỏ hàng</strong> và <strong>xử lý thanh toán (thẻ)</strong>; cộng thêm công cụ quản lý nội dung, quản lý website và phân tích số liệu.</li>
<li>Lựa chọn trải từ <strong>nền tảng TMĐT dạng SaaS</strong> (khởi đầu nhanh và rẻ, phí hằng tháng, ít quyền kiểm soát), qua nền tảng <strong>mã nguồn mở</strong> (miễn phí bản quyền, trả tiền lưu trữ và lập trình viên), tới <strong>tự xây theo yêu cầu</strong> (kiểm soát và chi phí đều tối đa).</li>
</ul>
<h3>Chọn phần cứng</h3>
<p>Định cỡ nền tảng theo nhu cầu: số <em>người dùng đồng thời</em>, đặc điểm của họ (xem hay mua), nội dung tĩnh hay động và khối lượng xử lý bảo mật. Khi nhu cầu tăng, website có thể <strong>mở rộng theo chiều dọc</strong> (máy chủ riêng lẻ mạnh hơn), <strong>mở rộng theo chiều ngang</strong> (thêm nhiều máy chủ chia tải) hoặc cải thiện kiến trúc xử lý (tách tác vụ sang các máy chủ chuyên dụng). Lưu trữ đám mây giúp mở rộng chiều ngang dễ dàng cho những ngày cao điểm như các đợt khuyến mãi lớn.</p>
<h3>Công cụ khác: thiết kế, SEO, cá nhân hoá, chính sách</h3>
<p>Website TMĐT thành công thì <em>vận hành tốt</em> (trang hoạt động, tải nhanh), <em>đủ thông tin</em> (dễ tìm thông tin công ty và sản phẩm), <em>dễ dùng</em>, có <em>điều hướng dự phòng</em>, <em>mua hàng dễ</em> (một hai cú nhấp), chạy được trên mọi trình duyệt, đồ hoạ đơn giản và chữ dễ đọc. <strong>Tối ưu hoá công cụ tìm kiếm (SEO)</strong> giúp trang lên thứ hạng trong kết quả tự nhiên. Công cụ <strong>cá nhân hoá</strong> may đo nội dung cho từng khách truy cập. <strong>Bộ chính sách thông tin</strong> gồm chính sách quyền riêng tư và quy tắc hỗ trợ tiếp cận cho người khuyết tật.</p>
<h3>Hiện diện trên di động: ba lựa chọn</h3>
<table>
<tr><th>Lựa chọn</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr>
<tr><td>Website di động (thiết kế đáp ứng hoặc thích ứng)</td><td>Một website cho mọi thiết bị; công cụ tìm kiếm tìm thấy được; rẻ nhất</td><td>Dùng hạn chế các tính năng của thiết bị</td></tr>
<tr><td>Ứng dụng web di động (kể cả ứng dụng web tiến bộ PWA)</td><td>Trải nghiệm gần giống ứng dụng ngay trong trình duyệt; không cần kho duyệt</td><td>Trên một số nền tảng dùng được ít tính năng thiết bị hơn ứng dụng gốc</td></tr>
<tr><td>Ứng dụng gốc (native app)</td><td>Nhanh nhất; truy cập đầy đủ camera, vị trí, thông báo; có biểu tượng trên màn hình chính</td><td>Đắt nhất; xây và bảo trì riêng cho từng nền tảng; người dùng phải cài đặt</td></tr>
</table>
<p><strong>Thiết kế web đáp ứng (responsive)</strong> tự điều chỉnh bố cục theo kích thước màn hình bằng lưới linh hoạt; <strong>thiết kế web thích ứng (adaptive)</strong> nhận diện thiết bị ở phía máy chủ và gửi phiên bản làm riêng cho thiết bị đó. Đa số doanh nghiệp bắt đầu theo hướng "ưu tiên di động" với một website đáp ứng và chỉ làm thêm ứng dụng khi lượng khách mua lại đủ lớn để xứng đáng.</p>
<div class="callout"><span class="badge">Bài học thực tế</span> Nhiều dự án website hỏng vì lý do kinh doanh hơn là kỹ thuật — trước hết là mục tiêu mơ hồ từ giai đoạn lập kế hoạch. Hãy viết ra website phải làm gì cho doanh nghiệp trước khi chọn bất kỳ nền tảng nào.</div>`,
  ]]);

const p2e = doc('eec101-2-4-exercise', 'Exercise 2 — marketplace or own website? a break-even analysis|||Bài tập 2 — bán trên sàn hay website riêng? phân tích hoà vốn',
  'Bài tập: so sánh chi phí bán trên sàn (hoa hồng + phí thanh toán theo % giả định) với website riêng (chi phí cố định tháng + phí cổng thanh toán giả định), tìm doanh thu hoà vốn giữa hai phương án, tính lại khi website phải tự mua lưu lượng truy cập, và các yếu tố định tính; kèm lời giải.',
  [[
    `<span class="eyebrow">EEC101 · Part 2 · Exercise</span>
<h2>Exercise 2 — marketplace or own website?</h2>
<div class="callout"><span class="badge">Problem</span> Moc Leather (a fictional case; every fee below is an assumption, not any real platform's price list) sells handmade leather goods. <strong>Option M — sell on a marketplace</strong>: commission 12% of revenue plus a payment fee of 2% of revenue, no fixed cost. <strong>Option W — own website on a SaaS platform</strong>: fixed cost VND 15,000,000 a month (platform plan, apps, domain, part-time staff) plus a payment-gateway fee of 2.5% of revenue. (a) Find the monthly revenue at which the two options cost the same. (b) Compare total selling costs at revenues of VND 100 million and VND 200 million. (c) Unlike the marketplace, the website brings no traffic of its own: suppose Moc must spend an extra 8% of revenue on ads to attract visitors. Recompute the break-even revenue. (d) List qualitative factors.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Cost M = (12% + 2%) x R = 0.14 R
    Cost W = 15,000,000 + 0.025 R
    Break-even: 0.14 R = 15,000,000 + 0.025 R
                0.115 R = 15,000,000
                R ≈ VND 130,434,783 a month

(b) Revenue          Cost M          Cost W
    100,000,000      14,000,000      17,500,000   -> marketplace cheaper
    200,000,000      28,000,000      20,000,000   -> website cheaper

(c) Cost W' = 15,000,000 + (2.5% + 8%) x R = 15,000,000 + 0.105 R
    0.14 R = 15,000,000 + 0.105 R  ->  0.035 R = 15,000,000
    R ≈ VND 428,571,429 a month
    Check at 200 million: M 28,000,000 vs W' 36,000,000 -> marketplace cheaper
    Check at 500 million: M 70,000,000 vs W' 67,500,000 -> website cheaper

(d) Qualitative factors
    For the website: customer data and relationship belong to Moc; full brand
      control; no marketplace rules or sudden fee changes; no price comparison
      next to competitors on the same page
    For the marketplace: built-in traffic and buyer trust; payment, logistics
      and dispute handling already integrated; fast start with no tech skills
    Many sellers run both: marketplace for reach, website for loyal customers</code></pre>
<p><strong>Why:</strong> a marketplace turns selling costs into a pure variable cost, so it is cheaper at low volumes; a website has a fixed cost but a lower variable rate, so it wins once revenue is high enough. Part (c) shows the trap in a naive comparison: the marketplace's commission also pays for <em>traffic</em>. Once you count the cost of attracting visitors yourself, the break-even revenue more than triples. Always compare options on the <em>full</em> cost of acquiring and serving a customer.</p>`,
    `<span class="eyebrow">EEC101 · Phần 2 · Bài tập</span>
<h2>Bài tập 2 — bán trên sàn hay website riêng?</h2>
<div class="callout"><span class="badge">Đề</span> Mộc Leather (tình huống giả định; mọi mức phí dưới đây là giả định, không phải bảng giá của bất kỳ nền tảng thật nào) bán đồ da thủ công. <strong>Phương án M — bán trên sàn</strong>: hoa hồng 12% doanh thu cộng phí thanh toán 2% doanh thu, không có chi phí cố định. <strong>Phương án W — website riêng trên nền tảng SaaS</strong>: chi phí cố định 15.000.000 đồng/tháng (gói nền tảng, ứng dụng, tên miền, nhân sự bán thời gian) cộng phí cổng thanh toán 2,5% doanh thu. (a) Tìm doanh thu hằng tháng mà tại đó hai phương án tốn chi phí như nhau. (b) So sánh tổng chi phí bán hàng ở mức doanh thu 100 triệu và 200 triệu đồng. (c) Khác với sàn, website không tự có lượng truy cập: giả sử Mộc phải chi thêm 8% doanh thu cho quảng cáo để thu hút khách. Tính lại doanh thu hoà vốn. (d) Liệt kê các yếu tố định tính.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Chi phí M = (12% + 2%) x R = 0,14 R
    Chi phí W = 15.000.000 + 0,025 R
    Hoà vốn: 0,14 R = 15.000.000 + 0,025 R
             0,115 R = 15.000.000
             R ≈ 130.434.783 đồng/tháng

(b) Doanh thu        Chi phí M       Chi phí W
    100.000.000      14.000.000      17.500.000   -> sàn rẻ hơn
    200.000.000      28.000.000      20.000.000   -> website rẻ hơn

(c) Chi phí W' = 15.000.000 + (2,5% + 8%) x R = 15.000.000 + 0,105 R
    0,14 R = 15.000.000 + 0,105 R  ->  0,035 R = 15.000.000
    R ≈ 428.571.429 đồng/tháng
    Kiểm tra ở 200 triệu: M 28.000.000 so với W' 36.000.000 -> sàn rẻ hơn
    Kiểm tra ở 500 triệu: M 70.000.000 so với W' 67.500.000 -> website rẻ hơn

(d) Yếu tố định tính
    Nghiêng về website: dữ liệu và quan hệ khách hàng thuộc về Mộc; toàn quyền
      kiểm soát thương hiệu; không lệ thuộc quy định sàn hay việc đổi phí đột
      ngột; không bị so giá cạnh đối thủ trên cùng một trang
    Nghiêng về sàn: sẵn lượng truy cập và niềm tin của người mua; thanh toán,
      logistics và xử lý khiếu nại đã tích hợp; khởi đầu nhanh, không cần kỹ năng
      công nghệ
    Nhiều người bán chạy cả hai: sàn để tiếp cận, website cho khách trung thành</code></pre>
<p><strong>Vì sao:</strong> sàn biến chi phí bán hàng thành chi phí biến đổi thuần tuý, nên rẻ hơn khi sản lượng thấp; website có chi phí cố định nhưng tỷ lệ biến đổi thấp hơn, nên thắng khi doanh thu đủ cao. Câu (c) cho thấy cái bẫy của phép so sánh ngây thơ: hoa hồng của sàn còn trả cho cả <em>lượng truy cập</em>. Khi tính thêm chi phí tự thu hút khách, doanh thu hoà vốn tăng hơn gấp ba. Luôn so sánh các phương án trên <em>toàn bộ</em> chi phí để có và phục vụ một khách hàng.</p>`,
  ]]);

const p2q = quiz('eec101-quiz-2', 'Quiz 2 — Ch 3–4: infrastructure and building a presence|||Quiz 2 — Ch 3–4: hạ tầng và xây dựng sự hiện diện', [
  { id: 'q1', question: 'Which system translates a domain name such as www.example.com into a numeric IP address?|||Hệ thống nào dịch một tên miền như www.example.com thành địa chỉ IP dạng số?', options: ['HTTP|||HTTP', 'DNS|||DNS', 'HTML|||HTML', 'TLS|||TLS'], correctIndex: 1, explanation: 'The Domain Name System maps names to IP addresses. HTTP transfers pages, HTML marks up pages and TLS encrypts connections.|||Hệ thống tên miền DNS ánh xạ tên sang địa chỉ IP. HTTP truyền trang, HTML đánh dấu cấu trúc trang, còn TLS mã hoá kết nối.' },
  { id: 'q2', question: 'A retailer rents a ready-made online-store platform that it uses through a browser for a monthly fee. This cloud service model is…|||Một nhà bán lẻ thuê một nền tảng cửa hàng trực tuyến làm sẵn, dùng qua trình duyệt với phí hằng tháng. Mô hình dịch vụ đám mây này là…', options: ['IaaS|||IaaS', 'PaaS|||PaaS', 'a private cloud|||đám mây riêng', 'SaaS|||SaaS'], correctIndex: 3, explanation: 'Software as a service delivers finished software over the Internet. IaaS rents raw infrastructure and PaaS rents a platform for building your own applications.|||Phần mềm như một dịch vụ cung cấp phần mềm hoàn chỉnh qua Internet. IaaS cho thuê hạ tầng thô, PaaS cho thuê nền tảng để tự xây ứng dụng.' },
  { id: 'q3', question: 'Adding more servers that share the load of a busy e-commerce site is called…|||Thêm nhiều máy chủ để cùng chia tải cho một website TMĐT đông khách được gọi là…', options: ['horizontal scaling|||mở rộng theo chiều ngang', 'vertical scaling|||mở rộng theo chiều dọc', 'acceptance testing|||kiểm thử chấp nhận', 'co-location|||đặt chỗ máy chủ (co-location)'], correctIndex: 0, explanation: 'Horizontal scaling adds servers; vertical scaling makes each server more powerful. Co-location is a hosting arrangement, not a scaling method.|||Mở rộng chiều ngang là thêm máy chủ; mở rộng chiều dọc là làm từng máy chủ mạnh hơn. Co-location là một hình thức lưu trữ, không phải cách mở rộng.' },
]);

const p31 = doc('eec101-3-1-security-threats', '3.1 — Ch 5 · The security environment and threats|||3.1 — Ch 5 · Môi trường bảo mật và các mối đe doạ',
  'Sáu chiều của bảo mật TMĐT (toàn vẹn, chống chối bỏ, xác thực, bí mật, quyền riêng tư, sẵn sàng) nhìn từ phía khách hàng và người bán, mâu thuẫn giữa bảo mật và các giá trị khác, ba điểm dễ bị tấn công, và các mối đe doạ chính: mã độc, phishing, hack, rò rỉ dữ liệu, gian lận thẻ, giả mạo, nghe lén, DoS/DDoS, người trong nội bộ, phần mềm lỗi, rủi ro trên mạng xã hội, di động, đám mây, IoT.',
  [[
    `<span class="eyebrow">EEC101 · Part 3 · Lesson 3.1</span>
<h2>The security environment and threats</h2>
<p class="lead">No online shop can be made perfectly secure. Security is about managing risk to an acceptable level at an acceptable cost — and about keeping customers' trust, without which there is no e-commerce.</p>
<h3>The six dimensions of e-commerce security</h3>
<table>
<tr><th>Dimension</th><th>Definition</th><th>Customer's question</th><th>Merchant's question</th></tr>
<tr><td>Integrity</td><td>Information shown or transmitted has not been altered by an unauthorized party</td><td>Has my order or payment been changed in transit?</td><td>Has our site's content or price list been altered?</td></tr>
<tr><td>Nonrepudiation</td><td>Participants cannot deny their online actions</td><td>Can the shop deny it received my order?</td><td>Can a customer deny placing an order?</td></tr>
<tr><td>Authenticity</td><td>The identity of the person or entity you deal with can be verified</td><td>Is this really the shop, not a fake site?</td><td>Is this customer who they claim to be?</td></tr>
<tr><td>Confidentiality</td><td>Messages and data are available only to those authorized to see them</td><td>Can anyone else read my messages?</td><td>Are our business data and messages seen only by authorized people?</td></tr>
<tr><td>Privacy</td><td>The ability to control the use of information about oneself</td><td>How will the shop use my personal data?</td><td>How do we use customer data lawfully, and protect it?</td></tr>
<tr><td>Availability</td><td>The site continues to function as intended</td><td>Can I reach the site when I need it?</td><td>Is the site up, especially at peak times?</td></tr>
</table>
<p>Security has costs and trade-offs: more security steps can make a site harder to use (the <em>ease-of-use</em> tension), and anonymity that protects users can also shelter criminals (the <em>public safety</em> tension).</p>
<h3>Where attacks happen</h3>
<p>A typical transaction has three vulnerable points: the <strong>client</strong> (the customer's device), the <strong>server</strong> (the merchant's systems) and the <strong>communications pipeline</strong> between them.</p>
<h3>The main threats</h3>
<table>
<tr><th>Threat</th><th>What it is</th></tr>
<tr><td>Malicious code (malware)</td><td>Viruses (attach to other programs), worms (spread by themselves between computers), ransomware (encrypts files and demands payment), Trojan horses (appear benign but carry a hidden payload), backdoors, and bots that form remote-controlled <strong>botnets</strong></td></tr>
<tr><td>Potentially unwanted programs</td><td>Adware, browser parasites and spyware installed without clear consent</td></tr>
<tr><td>Phishing and social engineering</td><td>Deceptive online attempts to obtain confidential information by exploiting human trust — fake bank e-mails, fake delivery messages, business e-mail compromise</td></tr>
<tr><td>Hacking, cybervandalism, hacktivism</td><td>Unauthorized access to systems; deliberately defacing or disrupting sites; attacks for political purposes</td></tr>
<tr><td>Data breaches</td><td>Organizations lose control of corporate information, often customers' personal data</td></tr>
<tr><td>Credit card fraud and identity fraud</td><td>Using stolen card data or someone's personal data to obtain goods, credit or money</td></tr>
<tr><td>Spoofing, pharming, spam sites</td><td>Hiding one's true identity or impersonating someone; redirecting a link to a fake site; sites set up only to attract clicks and ads</td></tr>
<tr><td>Sniffing and man-in-the-middle attacks</td><td>Eavesdropping on network traffic; secretly intercepting and possibly altering communications</td></tr>
<tr><td>Denial of service (DoS, DDoS)</td><td>Flooding a site with useless traffic so real customers cannot reach it; DDoS uses many computers (often a botnet)</td></tr>
<tr><td>Insider attacks</td><td>Employees or contractors misusing their access — a significant source of losses, because insiders already have access</td></tr>
<tr><td>Poorly designed software</td><td>Bugs that attackers exploit; a <em>zero-day</em> vulnerability is one not yet known to the vendor</td></tr>
<tr><td>Platform-specific issues</td><td>Fake profiles and scams on social networks; malicious apps and SMS phishing on mobile; misconfigured cloud storage; weak default passwords on IoT devices</td></tr>
</table>
<div class="callout"><span class="badge">Manager’s takeaway</span> Many serious incidents start with a person, not a machine: a click on a phishing link, a shared password, an over-privileged employee account. Technology alone is never the whole answer — lesson 3.2 adds policies and procedures.</div>`,
    `<span class="eyebrow">EEC101 · Phần 3 · Bài 3.1</span>
<h2>Môi trường bảo mật và các mối đe doạ</h2>
<p class="lead">Không shop trực tuyến nào có thể an toàn tuyệt đối. Bảo mật là quản trị rủi ro xuống mức chấp nhận được với chi phí chấp nhận được — và là giữ niềm tin của khách hàng, thứ mà thiếu nó thì không có TMĐT.</p>
<h3>Sáu chiều của bảo mật TMĐT</h3>
<table>
<tr><th>Chiều</th><th>Định nghĩa</th><th>Câu hỏi của khách hàng</th><th>Câu hỏi của người bán</th></tr>
<tr><td>Tính toàn vẹn (integrity)</td><td>Thông tin hiển thị hay truyền đi không bị bên không có thẩm quyền sửa đổi</td><td>Đơn hàng hay khoản thanh toán của tôi có bị sửa trên đường truyền không?</td><td>Nội dung hay bảng giá trên website có bị sửa không?</td></tr>
<tr><td>Chống chối bỏ (nonrepudiation)</td><td>Các bên không thể chối các hành động trực tuyến của mình</td><td>Shop có thể chối là chưa nhận đơn của tôi không?</td><td>Khách có thể chối là mình không đặt hàng không?</td></tr>
<tr><td>Tính xác thực (authenticity)</td><td>Xác minh được danh tính của người hay tổ chức mình đang giao dịch</td><td>Đây có thật là shop, hay một trang giả?</td><td>Khách này có đúng là người họ tự nhận không?</td></tr>
<tr><td>Tính bí mật (confidentiality)</td><td>Thông điệp và dữ liệu chỉ những người có thẩm quyền mới xem được</td><td>Người khác có đọc được tin nhắn của tôi không?</td><td>Dữ liệu và thông điệp kinh doanh có chỉ người có thẩm quyền xem không?</td></tr>
<tr><td>Quyền riêng tư (privacy)</td><td>Khả năng kiểm soát việc sử dụng thông tin về chính mình</td><td>Shop sẽ dùng dữ liệu cá nhân của tôi thế nào?</td><td>Dùng dữ liệu khách hàng thế nào cho đúng luật, và bảo vệ nó ra sao?</td></tr>
<tr><td>Tính sẵn sàng (availability)</td><td>Website tiếp tục vận hành đúng như dự định</td><td>Tôi có vào được website khi cần không?</td><td>Website có chạy không, nhất là lúc cao điểm?</td></tr>
</table>
<p>Bảo mật có chi phí và sự đánh đổi: thêm bước bảo mật có thể làm website khó dùng hơn (mâu thuẫn với <em>tính dễ sử dụng</em>), còn sự ẩn danh bảo vệ người dùng cũng có thể che chở tội phạm (mâu thuẫn với <em>an toàn công cộng</em>).</p>
<h3>Tấn công xảy ra ở đâu</h3>
<p>Một giao dịch điển hình có ba điểm dễ bị tấn công: <strong>máy khách</strong> (thiết bị của khách hàng), <strong>máy chủ</strong> (hệ thống của người bán) và <strong>đường truyền</strong> giữa hai bên.</p>
<h3>Các mối đe doạ chính</h3>
<table>
<tr><th>Mối đe doạ</th><th>Bản chất</th></tr>
<tr><td>Mã độc (malware)</td><td>Virus (bám vào chương trình khác), sâu (tự lây lan giữa các máy), mã độc tống tiền ransomware (mã hoá tệp và đòi tiền chuộc), Trojan (trông vô hại nhưng mang phần độc hại ẩn), cửa hậu (backdoor), và bot tạo thành các <strong>mạng botnet</strong> điều khiển từ xa</td></tr>
<tr><td>Chương trình không mong muốn</td><td>Phần mềm quảng cáo, ký sinh trình duyệt và phần mềm gián điệp được cài mà không có sự đồng ý rõ ràng</td></tr>
<tr><td>Lừa đảo phishing và thủ đoạn phi kỹ thuật</td><td>Các mưu toan trực tuyến lừa lấy thông tin bí mật bằng cách khai thác lòng tin của con người — e-mail giả ngân hàng, tin nhắn giả đơn vị giao hàng, chiếm quyền e-mail doanh nghiệp</td></tr>
<tr><td>Hack, phá hoại mạng, tấn công vì mục đích chính trị</td><td>Truy cập trái phép vào hệ thống; cố ý bôi xấu hay làm gián đoạn website; tấn công vì mục đích chính trị (hacktivism)</td></tr>
<tr><td>Rò rỉ dữ liệu (data breach)</td><td>Tổ chức mất quyền kiểm soát thông tin, thường là dữ liệu cá nhân của khách hàng</td></tr>
<tr><td>Gian lận thẻ và gian lận danh tính</td><td>Dùng dữ liệu thẻ bị đánh cắp hoặc dữ liệu cá nhân của người khác để lấy hàng hoá, tín dụng hay tiền</td></tr>
<tr><td>Giả mạo (spoofing), pharming, trang rác</td><td>Che giấu danh tính thật hoặc mạo danh người khác; chuyển hướng đường dẫn tới trang giả; trang lập ra chỉ để câu nhấp và quảng cáo</td></tr>
<tr><td>Nghe lén (sniffing) và tấn công xen giữa (man-in-the-middle)</td><td>Nghe trộm lưu lượng mạng; bí mật chặn và có thể sửa nội dung liên lạc</td></tr>
<tr><td>Từ chối dịch vụ (DoS, DDoS)</td><td>Làm ngập website bằng lưu lượng vô ích để khách thật không vào được; DDoS dùng rất nhiều máy (thường là một botnet)</td></tr>
<tr><td>Tấn công từ nội bộ</td><td>Nhân viên hoặc nhà thầu lạm dụng quyền truy cập — nguồn thiệt hại đáng kể, vì người trong nội bộ vốn đã có quyền truy cập</td></tr>
<tr><td>Phần mềm thiết kế kém</td><td>Lỗi bị kẻ tấn công khai thác; lỗ hổng <em>zero-day</em> là lỗ hổng nhà sản xuất chưa biết tới</td></tr>
<tr><td>Vấn đề riêng của từng nền tảng</td><td>Hồ sơ giả và lừa đảo trên mạng xã hội; ứng dụng độc hại và tin nhắn SMS lừa đảo trên di động; kho lưu trữ đám mây cấu hình sai; mật khẩu mặc định yếu trên thiết bị IoT</td></tr>
</table>
<div class="callout"><span class="badge">Điều nhà quản lý cần nhớ</span> Nhiều sự cố nghiêm trọng bắt đầu từ con người chứ không phải máy móc: một cú nhấp vào đường dẫn lừa đảo, một mật khẩu dùng chung, một tài khoản nhân viên được cấp quá nhiều quyền. Riêng công nghệ không bao giờ là toàn bộ lời giải — bài 3.2 bổ sung chính sách và quy trình.</div>`,
  ]]);

const p32 = doc('eec101-3-2-security-solutions', '3.2 — Ch 5 · Technology solutions, policies and laws|||3.2 — Ch 5 · Giải pháp công nghệ, chính sách và luật',
  'Mã hoá khoá đối xứng và khoá công khai, hàm băm và chữ ký số, phong bì số, chứng thư số và PKI, TLS/HTTPS, VPN, tường lửa, máy chủ proxy, hệ thống phát hiện/ngăn chặn xâm nhập; kế hoạch bảo mật năm bước, xác thực đa yếu tố, vai trò của luật; các chiến lược phi kỹ thuật để giảm rủi ro và xây niềm tin.',
  [[
    `<span class="eyebrow">EEC101 · Part 3 · Lesson 3.2</span>
<h2>Technology solutions, policies and laws</h2>
<h3>Protecting communications: encryption</h3>
<p><strong>Encryption</strong> transforms plain text into cipher text that only the sender and receiver can read. It supports four of the six dimensions: integrity, nonrepudiation, authenticity and confidentiality.</p>
<table>
<tr><th>Technique</th><th>How it works</th><th>Limitation or purpose</th></tr>
<tr><td>Symmetric key</td><td>Sender and receiver use the <em>same</em> secret key</td><td>Fast, but the key must be shared securely, and every pair of partners needs its own key</td></tr>
<tr><td>Public key (asymmetric)</td><td>Each party has a mathematically related pair: a <em>public</em> key anyone can use to encrypt, and a <em>private</em> key only the owner uses to decrypt</td><td>Solves key distribution; slower</td></tr>
<tr><td>Hash digest + digital signature</td><td>A hash function produces a fixed-length digest of the message; the sender encrypts the digest with his <em>private</em> key; the receiver decrypts it with the sender's <em>public</em> key and compares digests</td><td>Proves integrity (any change alters the digest), authenticity and nonrepudiation</td></tr>
<tr><td>Digital envelope</td><td>The message is encrypted with a fast symmetric key, and that key is encrypted with the receiver's public key</td><td>Combines the speed of symmetric with the safety of public-key encryption</td></tr>
<tr><td>Digital certificate + PKI</td><td>A trusted third party, the <strong>certification authority (CA)</strong>, issues a certificate binding an identity to a public key; the whole system of CAs and procedures is the <strong>public key infrastructure</strong></td><td>Lets browsers verify they are talking to the real site; it depends on the CA's own security and on users' private keys being protected</td></tr>
</table>
<h3>Securing channels and networks</h3>
<ul>
<li><strong>TLS</strong> (Transport Layer Security, the successor to SSL) creates an encrypted, authenticated session between browser and server; a site using it shows <strong>HTTPS</strong>. It protects data <em>in transit</em>, not data stored on a poorly protected server.</li>
<li>A <strong>virtual private network (VPN)</strong> lets remote users reach a private network securely over the Internet; Wi-Fi networks use protocols such as WPA2/WPA3.</li>
<li><strong>Firewalls</strong> filter traffic between a private network and the Internet by rules (packet filtering, application gateways); <strong>proxy servers</strong> handle Internet traffic on behalf of internal users; <strong>intrusion detection and prevention systems</strong> watch for suspicious patterns and can block them.</li>
<li>On servers and clients: keep operating systems and applications updated, and use anti-malware software.</li>
</ul>
<h3>Policies, procedures and people</h3>
<p>The textbook's five steps for a <strong>security plan</strong>:</p>
<ol>
<li><strong>Risk assessment</strong> — list information assets, the threats to them and the probability and cost of each.</li>
<li><strong>Security policy</strong> — ranked risks, acceptable-risk targets and the means to achieve them.</li>
<li><strong>Implementation plan</strong> — the actions, tools and people that turn the policy into practice.</li>
<li><strong>Security organization</strong> — a responsible team that trains users, maintains <strong>access controls</strong> (who may use which systems), <strong>authentication</strong> procedures (passwords, <strong>multi-factor authentication</strong>, biometrics, security tokens) and <strong>authorization</strong> policies.</li>
<li><strong>Security audit</strong> — routine review of access logs and tests, including tests by outside experts.</li>
</ol>
<h3>The role of laws and industry standards</h3>
<p>Laws criminalize attacks, require firms to protect personal data and often to notify breaches; international cooperation is needed because attackers cross borders. Card-payment firms must meet the industry's <strong>PCI DSS</strong> standard. In Vietnam, laws on network information security and on cybersecurity, and the rules on personal data protection (Ch 8), set duties for businesses — check the texts currently in force, since this area is being actively revised.</p>
<h3>Non-technical strategies that build trust (the managerial view)</h3>
<ul>
<li>Collect only the data you need, and delete what you no longer need — data you do not hold cannot leak.</li>
<li>Train staff against phishing; give each account only the access its job requires.</li>
<li>Vet vendors (hosting, payment, delivery apps) and write security duties into contracts.</li>
<li>Prepare an incident response plan: who decides, how customers and authorities are informed.</li>
<li>Show trust signals honestly: clear return and privacy policies, verified contact details, reputable payment options.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> Which key signs? The sender's <em>private</em> key creates the digital signature; anyone uses the sender's <em>public</em> key to verify it. To keep a message confidential, you encrypt it with the <em>receiver's</em> public key.</div>`,
    `<span class="eyebrow">EEC101 · Phần 3 · Bài 3.2</span>
<h2>Giải pháp công nghệ, chính sách và luật</h2>
<h3>Bảo vệ thông tin liên lạc: mã hoá</h3>
<p><strong>Mã hoá</strong> biến văn bản thường thành văn bản mật mà chỉ người gửi và người nhận đọc được. Nó hỗ trợ bốn trong sáu chiều bảo mật: toàn vẹn, chống chối bỏ, xác thực và bí mật.</p>
<table>
<tr><th>Kỹ thuật</th><th>Cách hoạt động</th><th>Hạn chế hoặc mục đích</th></tr>
<tr><td>Khoá đối xứng</td><td>Người gửi và người nhận dùng <em>cùng một</em> khoá bí mật</td><td>Nhanh, nhưng phải chia sẻ khoá an toàn, và mỗi cặp đối tác cần một khoá riêng</td></tr>
<tr><td>Khoá công khai (bất đối xứng)</td><td>Mỗi bên có một cặp khoá liên quan về toán học: khoá <em>công khai</em> ai cũng dùng được để mã hoá, và khoá <em>bí mật</em> chỉ chủ sở hữu dùng để giải mã</td><td>Giải quyết việc phân phối khoá; chậm hơn</td></tr>
<tr><td>Bản tóm lược băm + chữ ký số</td><td>Hàm băm tạo ra bản tóm lược có độ dài cố định của thông điệp; người gửi mã hoá bản tóm lược bằng khoá <em>bí mật</em> của mình; người nhận giải mã bằng khoá <em>công khai</em> của người gửi rồi so hai bản tóm lược</td><td>Chứng minh tính toàn vẹn (sửa bất kỳ chỗ nào cũng làm bản tóm lược thay đổi), tính xác thực và chống chối bỏ</td></tr>
<tr><td>Phong bì số</td><td>Thông điệp được mã hoá bằng một khoá đối xứng nhanh, rồi khoá đó được mã hoá bằng khoá công khai của người nhận</td><td>Kết hợp tốc độ của mã hoá đối xứng với độ an toàn của mã hoá khoá công khai</td></tr>
<tr><td>Chứng thư số + PKI</td><td>Một bên thứ ba tin cậy, <strong>tổ chức chứng thực (CA)</strong>, cấp chứng thư gắn một danh tính với một khoá công khai; toàn bộ hệ thống CA và quy trình là <strong>hạ tầng khoá công khai (PKI)</strong></td><td>Giúp trình duyệt xác minh đang nói chuyện với website thật; phụ thuộc vào độ an toàn của chính CA và việc người dùng giữ kín khoá bí mật</td></tr>
</table>
<h3>Bảo vệ kênh truyền và mạng</h3>
<ul>
<li><strong>TLS</strong> (bảo mật tầng giao vận, kế thừa SSL) tạo phiên làm việc được mã hoá và xác thực giữa trình duyệt và máy chủ; website dùng nó hiển thị <strong>HTTPS</strong>. TLS bảo vệ dữ liệu <em>trên đường truyền</em>, không bảo vệ dữ liệu nằm trên một máy chủ được bảo vệ kém.</li>
<li><strong>Mạng riêng ảo (VPN)</strong> cho người dùng từ xa truy cập an toàn vào mạng nội bộ qua Internet; mạng Wi-Fi dùng các giao thức như WPA2/WPA3.</li>
<li><strong>Tường lửa</strong> lọc lưu lượng giữa mạng nội bộ và Internet theo quy tắc (lọc gói, cổng ứng dụng); <strong>máy chủ proxy</strong> thay mặt người dùng nội bộ xử lý lưu lượng Internet; <strong>hệ thống phát hiện và ngăn chặn xâm nhập</strong> theo dõi các dấu hiệu đáng ngờ và có thể chặn chúng.</li>
<li>Trên máy chủ và máy khách: cập nhật hệ điều hành và ứng dụng, dùng phần mềm chống mã độc.</li>
</ul>
<h3>Chính sách, quy trình và con người</h3>
<p>Năm bước lập <strong>kế hoạch bảo mật</strong> theo giáo trình:</p>
<ol>
<li><strong>Đánh giá rủi ro</strong> — liệt kê tài sản thông tin, các mối đe doạ, xác suất và thiệt hại của từng mối.</li>
<li><strong>Chính sách bảo mật</strong> — xếp hạng rủi ro, mức rủi ro chấp nhận được và phương tiện để đạt được.</li>
<li><strong>Kế hoạch triển khai</strong> — hành động, công cụ và con người để đưa chính sách vào thực tế.</li>
<li><strong>Tổ chức bảo mật</strong> — một nhóm chịu trách nhiệm đào tạo người dùng, duy trì <strong>kiểm soát truy cập</strong> (ai được dùng hệ thống nào), quy trình <strong>xác thực</strong> (mật khẩu, <strong>xác thực đa yếu tố</strong>, sinh trắc học, thiết bị bảo mật) và chính sách <strong>phân quyền</strong>.</li>
<li><strong>Kiểm toán bảo mật</strong> — rà soát định kỳ nhật ký truy cập và các phép thử, kể cả thử nghiệm do chuyên gia bên ngoài thực hiện.</li>
</ol>
<h3>Vai trò của luật và chuẩn ngành</h3>
<p>Luật hình sự hoá các hành vi tấn công, buộc doanh nghiệp bảo vệ dữ liệu cá nhân và thường phải thông báo khi bị rò rỉ; cần hợp tác quốc tế vì kẻ tấn công vượt biên giới. Doanh nghiệp nhận thanh toán thẻ phải đáp ứng chuẩn ngành <strong>PCI DSS</strong>. Ở Việt Nam, các luật về an toàn thông tin mạng và an ninh mạng, cùng quy định bảo vệ dữ liệu cá nhân (Ch 8), đặt ra nghĩa vụ cho doanh nghiệp — hãy kiểm văn bản đang có hiệu lực, vì lĩnh vực này đang được sửa đổi tích cực.</p>
<h3>Chiến lược phi kỹ thuật để xây niềm tin (góc nhìn quản trị)</h3>
<ul>
<li>Chỉ thu thập dữ liệu cần thiết và xoá dữ liệu không còn cần — dữ liệu bạn không giữ thì không thể rò rỉ.</li>
<li>Đào tạo nhân viên nhận diện phishing; mỗi tài khoản chỉ được cấp quyền đúng với công việc.</li>
<li>Thẩm định nhà cung cấp (lưu trữ, thanh toán, ứng dụng giao hàng) và ghi nghĩa vụ bảo mật vào hợp đồng.</li>
<li>Chuẩn bị kế hoạch ứng phó sự cố: ai quyết định, thông báo cho khách hàng và cơ quan chức năng thế nào.</li>
<li>Thể hiện tín hiệu tin cậy một cách trung thực: chính sách đổi trả và quyền riêng tư rõ ràng, thông tin liên hệ xác thực, phương thức thanh toán uy tín.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> Khoá nào dùng để ký? Khoá <em>bí mật</em> của người gửi tạo ra chữ ký số; ai cũng dùng khoá <em>công khai</em> của người gửi để kiểm tra nó. Muốn giữ bí mật thông điệp, bạn mã hoá bằng khoá công khai của <em>người nhận</em>.</div>`,
  ]]);

const p33 = doc('eec101-3-3-payment-systems', '3.3 — Ch 5 · E-commerce payment systems|||3.3 — Ch 5 · Hệ thống thanh toán TMĐT',
  'Quy trình một giao dịch thẻ trực tuyến (tài khoản người bán, cổng thanh toán, mạng thẻ, ngân hàng phát hành), hạn chế của thanh toán thẻ, ví điện tử và thanh toán di động (NFC, ví của cửa hàng, chuyển tiền P2P), mua trước trả sau (BNPL), blockchain và tiền mã hoá (nêu ngắn), thanh toán hoá đơn điện tử; bối cảnh Việt Nam: QR liên ngân hàng VietQR và COD — phân tích định tính.',
  [[
    `<span class="eyebrow">EEC101 · Part 3 · Lesson 3.3</span>
<h2>E-commerce payment systems</h2>
<h3>How an online card payment works</h3>
<ol>
<li>The customer enters card details (or uses a saved card or wallet) at checkout; the data travel over TLS.</li>
<li>The merchant's <strong>payment gateway</strong> (a service that connects the shop to the payment networks) forwards the request to a <strong>payment processor</strong>.</li>
<li>The request goes through the <strong>card network</strong> to the customer's <strong>issuing bank</strong>, which checks the balance or credit line and approves or declines.</li>
<li>The approval returns to the merchant in seconds; later the money is settled into the merchant's <strong>merchant account</strong> at its <strong>acquiring bank</strong>, minus fees.</li>
</ol>
<p><strong>Limitations of online card payments:</strong> <em>security</em> (card-not-present transactions are easier to commit fraud with), <em>merchant risk</em> (customers can dispute charges, creating <strong>chargebacks</strong>), <em>cost</em> (merchants pay a percentage fee on every transaction) and <em>social equity</em> (not everyone has a card, especially young people and the unbanked). Merchants that handle card data must follow <strong>PCI DSS</strong>, which is one reason many small shops let the gateway store card data instead of storing it themselves.</p>
<h3>Alternative and mobile payment systems</h3>
<table>
<tr><th>System</th><th>How it works</th><th>Why it matters</th></tr>
<tr><td>Online stored-value or wallet accounts</td><td>The customer links a bank account or card to an online payment account and pays with a login</td><td>The merchant never sees card data; faster checkout</td></tr>
<tr><td>Universal proximity mobile wallets</td><td>A phone (or watch) pays at a terminal using NFC and a <em>token</em> instead of the real card number</td><td>Convenience plus security: a stolen token is of little use</td></tr>
<tr><td>Branded store wallets and apps</td><td>A retailer's own app stores payment and loyalty data</td><td>Builds loyalty and gives the retailer data</td></tr>
<tr><td>P2P mobile payment apps</td><td>Individuals send money to each other by phone number or QR</td><td>Also used by small sellers, especially in social commerce</td></tr>
<tr><td>Buy now, pay later (BNPL)</td><td>The purchase is split into instalments, often interest-free for the customer; the merchant pays a fee</td><td>Raises conversion and order value, but can push young consumers into debt — a regulatory and ethical concern</td></tr>
<tr><td>Blockchain and cryptocurrencies</td><td>A <strong>blockchain</strong> is a distributed ledger shared by many computers, where records are hard to alter; cryptocurrencies are digital assets recorded on it</td><td>Promising for traceability (for example in supply chains); as payment, prices are volatile and legal status differs by country</td></tr>
<tr><td>Electronic billing presentment and payment (EBPP)</td><td>Bills are delivered and paid online (utilities, telecom, tuition)</td><td>Lower cost of billing and collection</td></tr>
</table>
<h3>The Vietnamese context — a qualitative view</h3>
<ul>
<li><strong>QR payments.</strong> Paying by scanning a QR code with a banking or wallet app is widespread. The common interbank QR standard known as <strong>VietQR</strong> lets a single code receive transfers from many banks' apps. For merchants it is cheap and instant; the risks are fake or swapped QR codes and manual reconciliation of transfers with orders (dynamic QR codes that embed the order amount and reference reduce both).</li>
<li><strong>Cash on delivery (COD).</strong> Still common because it lowers the customer's perceived risk: pay only after seeing the goods. For merchants it has costs: cash handling by the carrier, slower cash collection, and <em>failed deliveries</em> when customers refuse parcels — the merchant pays shipping both ways and the goods are tied up. Tactics: confirm orders by phone or message, offer a small incentive for prepayment, limit COD for high-value or first-time orders.</li>
<li><strong>Crypto-assets</strong> are not a lawful means of payment in Vietnam; the legal framework for digital assets is evolving, so check the documents currently in force before any use.</li>
</ul>
<div class="callout"><span class="badge">Think like a manager</span> Choosing payment methods is a trade-off between conversion (offer what customers trust), cost (fees, failed deliveries) and risk (fraud, chargebacks). The best mix differs by product, price level and customer segment — test it, do not copy it.</div>`,
    `<span class="eyebrow">EEC101 · Phần 3 · Bài 3.3</span>
<h2>Hệ thống thanh toán TMĐT</h2>
<h3>Một giao dịch thẻ trực tuyến diễn ra thế nào</h3>
<ol>
<li>Khách nhập thông tin thẻ (hoặc dùng thẻ đã lưu, ví điện tử) ở bước thanh toán; dữ liệu đi qua TLS.</li>
<li><strong>Cổng thanh toán</strong> của người bán (dịch vụ kết nối shop với các mạng thanh toán) chuyển yêu cầu tới <strong>đơn vị xử lý thanh toán</strong>.</li>
<li>Yêu cầu đi qua <strong>mạng thẻ</strong> tới <strong>ngân hàng phát hành</strong> thẻ của khách, nơi kiểm tra số dư hoặc hạn mức tín dụng rồi chấp thuận hay từ chối.</li>
<li>Kết quả chấp thuận quay về người bán trong vài giây; sau đó tiền được quyết toán vào <strong>tài khoản người bán</strong> tại <strong>ngân hàng thanh toán (acquiring bank)</strong>, sau khi trừ phí.</li>
</ol>
<p><strong>Hạn chế của thanh toán thẻ trực tuyến:</strong> <em>bảo mật</em> (giao dịch không xuất trình thẻ dễ bị gian lận hơn), <em>rủi ro cho người bán</em> (khách có thể khiếu nại khoản thanh toán, tạo ra <strong>bồi hoàn — chargeback</strong>), <em>chi phí</em> (người bán trả phí theo tỷ lệ phần trăm trên mỗi giao dịch) và <em>công bằng xã hội</em> (không phải ai cũng có thẻ, nhất là người trẻ và người chưa có tài khoản ngân hàng). Người bán xử lý dữ liệu thẻ phải tuân thủ <strong>PCI DSS</strong>, một lý do khiến nhiều shop nhỏ để cổng thanh toán lưu dữ liệu thẻ thay vì tự lưu.</p>
<h3>Các hệ thống thanh toán thay thế và di động</h3>
<table>
<tr><th>Hệ thống</th><th>Cách hoạt động</th><th>Vì sao quan trọng</th></tr>
<tr><td>Tài khoản ví, tài khoản lưu giá trị trực tuyến</td><td>Khách liên kết tài khoản ngân hàng hoặc thẻ với một tài khoản thanh toán trực tuyến và trả tiền bằng đăng nhập</td><td>Người bán không bao giờ thấy dữ liệu thẻ; thanh toán nhanh hơn</td></tr>
<tr><td>Ví di động thanh toán tiếp xúc gần đa năng</td><td>Điện thoại (hoặc đồng hồ) thanh toán tại máy POS bằng NFC và một <em>mã token</em> thay cho số thẻ thật</td><td>Tiện lợi và an toàn: token bị lộ gần như vô dụng</td></tr>
<tr><td>Ví và ứng dụng mang thương hiệu cửa hàng</td><td>Ứng dụng riêng của nhà bán lẻ lưu dữ liệu thanh toán và tích điểm</td><td>Xây lòng trung thành và mang lại dữ liệu cho nhà bán lẻ</td></tr>
<tr><td>Ứng dụng chuyển tiền P2P</td><td>Cá nhân chuyển tiền cho nhau bằng số điện thoại hoặc mã QR</td><td>Cũng được người bán nhỏ dùng nhiều, nhất là trong TMĐT mạng xã hội</td></tr>
<tr><td>Mua trước trả sau (BNPL)</td><td>Khoản mua được chia thành nhiều kỳ, thường không lãi với khách; người bán trả phí</td><td>Tăng tỷ lệ chuyển đổi và giá trị đơn, nhưng có thể đẩy người tiêu dùng trẻ vào nợ nần — mối lo về quản lý và đạo đức</td></tr>
<tr><td>Blockchain và tiền mã hoá</td><td><strong>Blockchain</strong> là sổ cái phân tán được nhiều máy tính cùng lưu, trong đó bản ghi rất khó sửa; tiền mã hoá là tài sản số được ghi trên đó</td><td>Hứa hẹn cho truy xuất nguồn gốc (ví dụ trong chuỗi cung ứng); khi dùng để thanh toán thì giá biến động mạnh và địa vị pháp lý khác nhau tuỳ quốc gia</td></tr>
<tr><td>Xuất trình và thanh toán hoá đơn điện tử (EBPP)</td><td>Hoá đơn được gửi và thanh toán trực tuyến (điện, nước, viễn thông, học phí)</td><td>Giảm chi phí lập hoá đơn và thu tiền</td></tr>
</table>
<h3>Bối cảnh Việt Nam — nhìn định tính</h3>
<ul>
<li><strong>Thanh toán QR.</strong> Trả tiền bằng cách quét mã QR với ứng dụng ngân hàng hoặc ví rất phổ biến. Chuẩn QR liên ngân hàng chung có tên <strong>VietQR</strong> cho phép một mã duy nhất nhận chuyển khoản từ ứng dụng của nhiều ngân hàng. Với người bán, cách này rẻ và tức thời; rủi ro là mã QR giả hoặc bị tráo, và việc đối soát thủ công khoản chuyển với đơn hàng (mã QR động chứa sẵn số tiền và mã đơn giúp giảm cả hai rủi ro).</li>
<li><strong>Thanh toán khi nhận hàng (COD).</strong> Vẫn phổ biến vì làm giảm rủi ro mà khách cảm nhận: xem hàng rồi mới trả tiền. Với người bán, COD có chi phí: đơn vị vận chuyển phải xử lý tiền mặt, tiền về chậm hơn, và <em>giao hàng thất bại</em> khi khách từ chối nhận — người bán chịu phí vận chuyển hai chiều và hàng bị giam. Cách xử lý: xác nhận đơn qua điện thoại hoặc tin nhắn, ưu đãi nhỏ cho khách trả trước, hạn chế COD với đơn giá trị cao hoặc khách mua lần đầu.</li>
<li><strong>Tài sản mã hoá</strong> không phải là phương tiện thanh toán hợp pháp ở Việt Nam; khung pháp lý cho tài sản số đang thay đổi, vì vậy hãy kiểm văn bản đang có hiệu lực trước khi sử dụng dưới bất kỳ hình thức nào.</li>
</ul>
<div class="callout"><span class="badge">Tư duy nhà quản lý</span> Chọn phương thức thanh toán là đánh đổi giữa tỷ lệ chuyển đổi (có phương thức khách tin), chi phí (phí, giao hàng thất bại) và rủi ro (gian lận, bồi hoàn). Tổ hợp tốt nhất khác nhau theo sản phẩm, mức giá và phân khúc khách hàng — hãy thử nghiệm, đừng sao chép.</div>`,
  ]]);

const p3q = quiz('eec101-quiz-3', 'Quiz 3 — Ch 5: security and payments|||Quiz 3 — Ch 5: bảo mật và thanh toán', [
  { id: 'q1', question: 'A customer claims she never placed an order that was in fact placed from her account. Which dimension of e-commerce security is at issue?|||Một khách hàng khẳng định chưa từng đặt một đơn hàng mà thực tế đã được đặt từ tài khoản của cô. Chiều bảo mật TMĐT nào đang được nói tới?', options: ['Availability|||Tính sẵn sàng', 'Confidentiality|||Tính bí mật', 'Integrity|||Tính toàn vẹn', 'Nonrepudiation|||Chống chối bỏ'], correctIndex: 3, explanation: 'Nonrepudiation is the ability to ensure that participants do not deny their online actions. Integrity concerns unauthorized changes to information.|||Chống chối bỏ là khả năng bảo đảm các bên không thể chối các hành động trực tuyến của mình. Tính toàn vẹn nói về việc thông tin bị sửa trái phép.' },
  { id: 'q2', question: 'To create a digital signature, the sender encrypts the hash digest of the message with…|||Để tạo chữ ký số, người gửi mã hoá bản tóm lược băm của thông điệp bằng…', options: ['the receiver’s public key|||khoá công khai của người nhận', 'the sender’s private key|||khoá bí mật của người gửi', 'the sender’s public key|||khoá công khai của người gửi', 'a symmetric key shared in advance|||một khoá đối xứng đã chia sẻ trước'], correctIndex: 1, explanation: 'Only the sender holds the private key, so a digest that decrypts correctly with the sender’s public key proves who signed it and that the message was not changed.|||Chỉ người gửi giữ khoá bí mật, nên một bản tóm lược giải mã đúng bằng khoá công khai của người gửi chứng minh ai đã ký và thông điệp không bị sửa.' },
  { id: 'q3', question: 'Which statement about cash on delivery (COD) is correct from the merchant’s point of view?|||Nhận định nào về thanh toán khi nhận hàng (COD) là đúng từ góc nhìn người bán?', options: ['It removes all delivery costs for the merchant|||Nó xoá mọi chi phí giao hàng cho người bán', 'It gives the merchant its cash faster than card payments|||Nó giúp người bán nhận tiền nhanh hơn thanh toán thẻ', 'It lowers customers’ perceived risk, but refused parcels create costs such as two-way shipping|||Nó giảm rủi ro khách cảm nhận, nhưng đơn bị từ chối nhận gây chi phí như phí vận chuyển hai chiều', 'It is only allowed for cross-border orders|||Nó chỉ được dùng cho đơn hàng xuyên biên giới'], correctIndex: 2, explanation: 'COD builds customer trust but slows cash collection and exposes the merchant to failed deliveries.|||COD tạo niềm tin cho khách nhưng làm tiền về chậm và khiến người bán chịu rủi ro giao hàng thất bại.' },
]);

const p41 = doc('eec101-4-1-online-consumer-tools', '4.1 — Ch 6 · The online consumer and digital marketing tools|||4.1 — Ch 6 · Người tiêu dùng trực tuyến và công cụ marketing số',
  'Mô hình hành vi người tiêu dùng trực tuyến, năm bước quyết định mua, người xem và người mua, niềm tin và cơ hội chủ nghĩa; website như nền tảng marketing, marketing trên công cụ tìm kiếm, quảng cáo hiển thị, quảng cáo tự nhiên, content marketing, e-mail, affiliate, lan truyền, tạo khách hàng tiềm năng; giữ chân khách hàng, chiến lược giá trực tuyến và marketing đuôi dài.',
  [[
    `<span class="eyebrow">EEC101 · Part 4 · Lesson 4.1</span>
<h2>The online consumer and digital marketing tools</h2>
<h3>How online consumers decide</h3>
<p>Online buying follows the same general model of consumer behaviour as offline buying — background factors (culture, social groups, psychology) and marketing stimuli shape attitudes and intentions — plus two online-specific elements: the <strong>features of the website or app</strong> and the <strong>clickstream behaviour</strong> (the sequence of pages and actions a user takes), which firms can observe in detail.</p>
<table>
<tr><th>Stage of the purchasing decision</th><th>Online marketing that fits it</th></tr>
<tr><td>1. Awareness of need</td><td>Display, video and social ads; influencer content</td></tr>
<tr><td>2. Search for more information</td><td>Search engine marketing, content marketing, reviews</td></tr>
<tr><td>3. Evaluation of alternatives</td><td>Comparison pages, recommendation engines, user ratings</td></tr>
<tr><td>4. Actual purchase decision</td><td>Promotions, easy checkout, trusted payment options, retargeting</td></tr>
<tr><td>5. Post-purchase contact with the firm</td><td>E-mail, loyalty programmes, customer service, community</td></tr>
</table>
<p>Not every visitor buys: <strong>browsers</strong> look, <strong>buyers</strong> purchase — and many research online and buy offline or the reverse. Reasons for not buying online include lack of trust, worries about security and returns, delivery costs and the wish to touch and feel the product. Online markets suffer from <strong>information asymmetry</strong>: the seller knows more about the product than the buyer, which creates room for <em>opportunism</em>. Firms that build <strong>trust</strong> (brand, reviews, clear policies, reliable delivery) and <strong>utility</strong> (low prices, convenience, speed) win.</p>
<h3>The website as the marketing platform</h3>
<p>Everything starts with the firm's own site or app: a memorable <strong>domain name</strong>, <strong>search engine optimization</strong> so it can be found, and <strong>functionality</strong> that makes browsing and buying easy. Paid and social channels bring visitors; the site must convert them.</p>
<h3>Traditional online marketing and advertising tools</h3>
<table>
<tr><th>Tool</th><th>What it is</th></tr>
<tr><td>Search engine marketing</td><td><strong>Keyword (paid search) advertising</strong> — ads next to search results, usually paid per click; <strong>network keyword (context) advertising</strong> — ads placed on partner sites by the search firm; and <strong>SEO</strong> — improving the ranking of pages in organic (unpaid) results</td></tr>
<tr><td>Display advertising</td><td>Banner ads, rich-media ads (with animation or interaction), video ads, sponsorships; bought directly or through <strong>ad networks</strong> and <strong>ad exchanges</strong> (lesson 4.2). Issues: <em>ad fraud</em> (fake clicks and impressions), <em>viewability</em> (ads that are never actually seen) and <em>ad blocking</em></td></tr>
<tr><td>Native advertising and content marketing</td><td>Ads that look like the editorial content around them (they must be labelled as sponsored); content marketing creates useful articles, videos or guides that promote the brand indirectly</td></tr>
<tr><td>E-mail marketing</td><td>Direct e-mail to customers who have given permission; cheap and measurable, but unsolicited <strong>spam</strong> is illegal in many countries and ruins reputation</td></tr>
<tr><td>Affiliate marketing</td><td>Other sites (or creators) send customers to the firm and earn a commission on resulting sales</td></tr>
<tr><td>Viral marketing</td><td>Getting customers to pass the message on to friends and family</td></tr>
<tr><td>Lead generation marketing</td><td>Collecting contact details of potential customers (for example through a free guide) to follow up later</td></tr>
</table>
<h3>Strategies for customer retention</h3>
<ul>
<li><strong>Personalization and one-to-one marketing</strong> — segmenting down to the individual, based on name, interests and past purchases.</li>
<li><strong>Interest-based (behavioural) advertising</strong> — using a person's online behaviour to target ads; <strong>retargeting</strong> shows ads to people who visited a site but did not buy.</li>
<li><strong>Customization and customer co-production</strong> — letting customers design or configure the product.</li>
<li><strong>Customer service</strong> — FAQs, live chat, chatbots, fast answers on social media.</li>
</ul>
<h3>Online pricing strategies</h3>
<p><strong>Free and freemium</strong> (give away a basic version to build an audience), <strong>versioning</strong> (several versions at different prices for different segments), <strong>bundling</strong> (several products for one price), and <strong>dynamic pricing</strong> (prices that change with demand, time or customer) including <strong>flash sales</strong>. The Internet also enables <strong>long tail marketing</strong>: because shelf space is unlimited, a firm can earn significant revenue from many niche products that each sell in small quantities.</p>
<div class="callout"><span class="badge">Remember</span> Match the tool to the stage of the purchasing decision. Paid search captures people who are already looking; display and social create awareness; e-mail and loyalty programmes keep customers after the first purchase.</div>`,
    `<span class="eyebrow">EEC101 · Phần 4 · Bài 4.1</span>
<h2>Người tiêu dùng trực tuyến và công cụ marketing số</h2>
<h3>Người tiêu dùng trực tuyến ra quyết định thế nào</h3>
<p>Mua sắm trực tuyến theo cùng mô hình hành vi người tiêu dùng chung như mua sắm ngoại tuyến — các yếu tố nền (văn hoá, nhóm xã hội, tâm lý) và tác nhân marketing định hình thái độ và ý định — cộng thêm hai yếu tố riêng của môi trường trực tuyến: <strong>đặc điểm của website hay ứng dụng</strong> và <strong>hành vi luồng nhấp (clickstream)</strong> (chuỗi trang và thao tác người dùng thực hiện), mà doanh nghiệp có thể quan sát rất chi tiết.</p>
<table>
<tr><th>Bước của quyết định mua</th><th>Hoạt động marketing trực tuyến phù hợp</th></tr>
<tr><td>1. Nhận biết nhu cầu</td><td>Quảng cáo hiển thị, video, mạng xã hội; nội dung của người có ảnh hưởng</td></tr>
<tr><td>2. Tìm kiếm thêm thông tin</td><td>Marketing trên công cụ tìm kiếm, content marketing, đánh giá của khách</td></tr>
<tr><td>3. Đánh giá các phương án</td><td>Trang so sánh, hệ thống gợi ý, điểm đánh giá của người dùng</td></tr>
<tr><td>4. Quyết định mua</td><td>Khuyến mãi, thanh toán dễ, phương thức thanh toán tin cậy, quảng cáo nhắm lại</td></tr>
<tr><td>5. Liên hệ với doanh nghiệp sau mua</td><td>E-mail, chương trình khách hàng thân thiết, chăm sóc khách hàng, cộng đồng</td></tr>
</table>
<p>Không phải khách truy cập nào cũng mua: <strong>người xem (browser)</strong> chỉ xem, <strong>người mua (buyer)</strong> thì mua — và nhiều người tìm hiểu trực tuyến rồi mua ngoại tuyến hoặc ngược lại. Lý do không mua trực tuyến gồm thiếu niềm tin, lo ngại về bảo mật và đổi trả, phí giao hàng, và mong muốn được sờ, xem tận tay sản phẩm. Thị trường trực tuyến chịu <strong>bất cân xứng thông tin</strong>: người bán biết về sản phẩm nhiều hơn người mua, tạo chỗ cho <em>hành vi cơ hội</em>. Doanh nghiệp xây được <strong>niềm tin</strong> (thương hiệu, đánh giá, chính sách rõ ràng, giao hàng tin cậy) và <strong>lợi ích</strong> (giá thấp, tiện lợi, nhanh) sẽ thắng.</p>
<h3>Website là nền tảng marketing</h3>
<p>Mọi thứ bắt đầu từ website hay ứng dụng của chính doanh nghiệp: một <strong>tên miền</strong> dễ nhớ, <strong>tối ưu hoá công cụ tìm kiếm</strong> để được tìm thấy, và <strong>chức năng</strong> giúp xem và mua dễ dàng. Kênh trả phí và mạng xã hội mang khách tới; website phải chuyển đổi được họ.</p>
<h3>Các công cụ marketing và quảng cáo trực tuyến truyền thống</h3>
<table>
<tr><th>Công cụ</th><th>Bản chất</th></tr>
<tr><td>Marketing trên công cụ tìm kiếm</td><td><strong>Quảng cáo từ khoá (tìm kiếm trả phí)</strong> — quảng cáo cạnh kết quả tìm kiếm, thường trả theo lượt nhấp; <strong>quảng cáo từ khoá trên mạng lưới (theo ngữ cảnh)</strong> — quảng cáo được công ty tìm kiếm đặt trên các website đối tác; và <strong>SEO</strong> — cải thiện thứ hạng trang trong kết quả tự nhiên (không trả phí)</td></tr>
<tr><td>Quảng cáo hiển thị</td><td>Banner, quảng cáo đa phương tiện (có chuyển động hoặc tương tác), quảng cáo video, tài trợ; mua trực tiếp hoặc qua <strong>mạng quảng cáo</strong> và <strong>sàn giao dịch quảng cáo</strong> (bài 4.2). Vấn đề: <em>gian lận quảng cáo</em> (lượt nhấp và hiển thị giả), <em>khả năng được nhìn thấy</em> (quảng cáo không bao giờ thực sự được xem) và <em>chặn quảng cáo</em></td></tr>
<tr><td>Quảng cáo tự nhiên (native) và content marketing</td><td>Quảng cáo trông giống nội dung biên tập xung quanh (phải được gắn nhãn là nội dung tài trợ); content marketing tạo bài viết, video, hướng dẫn hữu ích để quảng bá thương hiệu một cách gián tiếp</td></tr>
<tr><td>E-mail marketing</td><td>Gửi e-mail trực tiếp cho khách hàng đã cho phép; rẻ và đo được, nhưng <strong>thư rác (spam)</strong> gửi khi chưa được đồng ý là trái luật ở nhiều nước và huỷ hoại uy tín</td></tr>
<tr><td>Marketing liên kết (affiliate)</td><td>Các website khác (hoặc nhà sáng tạo nội dung) dẫn khách tới doanh nghiệp và hưởng hoa hồng trên doanh số phát sinh</td></tr>
<tr><td>Marketing lan truyền (viral)</td><td>Khiến khách hàng tự chuyển thông điệp tới bạn bè, người thân</td></tr>
<tr><td>Marketing tạo khách hàng tiềm năng (lead generation)</td><td>Thu thông tin liên hệ của khách hàng tiềm năng (ví dụ qua một tài liệu miễn phí) để tiếp cận sau</td></tr>
</table>
<h3>Chiến lược giữ chân khách hàng</h3>
<ul>
<li><strong>Cá nhân hoá và marketing một-một</strong> — phân khúc tới từng cá nhân dựa trên tên, sở thích, lịch sử mua.</li>
<li><strong>Quảng cáo theo sở thích (nhắm mục tiêu theo hành vi)</strong> — dùng hành vi trực tuyến của một người để nhắm quảng cáo; <strong>quảng cáo nhắm lại (retargeting)</strong> hiển thị quảng cáo cho người đã vào website mà chưa mua.</li>
<li><strong>Tuỳ biến và khách hàng cùng sản xuất</strong> — cho khách tự thiết kế hoặc cấu hình sản phẩm.</li>
<li><strong>Chăm sóc khách hàng</strong> — câu hỏi thường gặp, chat trực tuyến, chatbot, trả lời nhanh trên mạng xã hội.</li>
</ul>
<h3>Chiến lược giá trực tuyến</h3>
<p><strong>Miễn phí và freemium</strong> (cho không bản cơ bản để xây tệp khách), <strong>phân phiên bản (versioning)</strong> (nhiều phiên bản với giá khác nhau cho các phân khúc khác nhau), <strong>bán theo gói (bundling)</strong> (nhiều sản phẩm một giá), và <strong>định giá động</strong> (giá thay đổi theo cầu, thời điểm hoặc khách hàng), kể cả <strong>bán chớp nhoáng (flash sale)</strong>. Internet còn cho phép <strong>marketing đuôi dài (long tail)</strong>: vì "kệ hàng" là vô hạn, doanh nghiệp có thể thu doanh thu đáng kể từ rất nhiều sản phẩm ngách mà mỗi loại chỉ bán được số lượng nhỏ.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Chọn công cụ theo bước của quyết định mua. Quảng cáo tìm kiếm bắt được người đang tìm; quảng cáo hiển thị và mạng xã hội tạo nhận biết; e-mail và chương trình thân thiết giữ khách sau lần mua đầu.</div>`,
  ]]);

const p42 = doc('eec101-4-2-martech-metrics', '4.2 — Ch 6 · Marketing technologies, metrics and programmatic ads|||4.2 — Ch 6 · Công nghệ marketing, chỉ số đo lường và quảng cáo programmatic',
  'Nhật ký giao dịch web, cookie bên thứ nhất và thứ ba, pixel theo dõi, dấu vân tay thiết bị, cơ sở dữ liệu, kho dữ liệu, khai phá dữ liệu, dữ liệu lớn, tự động hoá marketing và CRM; từ điển chỉ số (CTR, tỷ lệ chuyển đổi, bỏ giỏ hàng, giữ chân…), mô hình giá CPM – CPC – CPA, ROAS và ROI qua ví dụ số; tình huống quảng cáo programmatic và đấu giá thời gian thực.',
  [[
    `<span class="eyebrow">EEC101 · Part 4 · Lesson 4.2</span>
<h2>Marketing technologies, metrics and programmatic ads</h2>
<h3>The technologies behind online marketing</h3>
<ul>
<li><strong>Web transaction logs</strong> record every request a user makes to a site — the raw clickstream.</li>
<li><strong>Cookies</strong> are small text files a site places on the user's browser. <em>First-party</em> cookies come from the site you visit (keeping you logged in, remembering your cart); <em>third-party</em> cookies come from other firms (ad networks) and track you across sites. <strong>Web beacons</strong> (tracking pixels) are tiny invisible images that report when a page or e-mail is opened; <strong>device fingerprinting</strong> identifies a device by its unique configuration even without cookies.</li>
<li><strong>Databases</strong> store customer records; a <strong>data warehouse</strong> collects a firm's transactional and customer data in one place for analysis; <strong>data mining</strong> finds patterns (which products are bought together, which customers are likely to leave).</li>
<li><strong>Big data</strong> — data sets so large, fast and varied that they need new tools (distributed processing, machine learning) to analyse.</li>
<li><strong>Marketing automation and CRM systems</strong> track every contact with each customer and automate campaigns (a reminder e-mail when a cart is abandoned).</li>
</ul>
<p>Several browsers now block third-party cookies by default and privacy laws require consent for tracking (Ch 8), so marketers increasingly rely on <strong>first-party data</strong> — what customers share directly with the firm.</p>
<h3>The metrics lexicon</h3>
<table>
<tr><th>Metric</th><th>Definition</th></tr>
<tr><td>Impressions</td><td>Number of times an ad is served</td></tr>
<tr><td>Click-through rate (CTR)</td><td>Clicks / impressions</td></tr>
<tr><td>View-through rate</td><td>Share of people who saw an ad without clicking but visited the site later</td></tr>
<tr><td>Unique visitors · page views · stickiness</td><td>Distinct visitors in a period · pages loaded · average time spent on the site</td></tr>
<tr><td>Conversion rate</td><td>Share of visitors who buy (orders / visitors)</td></tr>
<tr><td>Cart conversion · abandonment rate</td><td>Share of carts that become orders · share of shoppers who start a cart or checkout but leave</td></tr>
<tr><td>Retention rate · attrition rate</td><td>Share of customers who return and buy again · share who stop buying</td></tr>
<tr><td>E-mail: open rate, click-through rate, bounce-back rate</td><td>Opened / delivered · clicked / delivered · e-mails that could not be delivered</td></tr>
<tr><td>Video: completion rate</td><td>Share of viewers who watch to the end</td></tr>
</table>
<h3>How advertising is priced — and a worked example</h3>
<p><strong>CPM</strong> = cost per thousand impressions; <strong>CPC</strong> = cost per click; <strong>CPA</strong> = cost per action (for example per purchase). <strong>ROAS</strong> (return on ad spend) = revenue / ad cost; <strong>ROI</strong> = (profit generated − cost) / cost.</p>
<pre><code>Display campaign for a fictional shop (illustrative numbers, VND)
Impressions            400,000     bought at CPM 50,000
Ad cost                400,000 / 1,000 x 50,000     = 20,000,000
Clicks                 400,000 x CTR 1.2%           = 4,800
Effective CPC          20,000,000 / 4,800           ≈ 4,167
Orders                 4,800 x conversion rate 2.5% = 120
CPA                    20,000,000 / 120             ≈ 166,667
Revenue                120 x AOV 350,000            = 42,000,000
ROAS                   42,000,000 / 20,000,000      = 2.1
Gross profit           42,000,000 x gross margin 40% = 16,800,000
ROI                    (16,800,000 − 20,000,000) / 20,000,000 = −16%
Break-even ROAS        1 / gross margin = 1 / 0.40  = 2.5</code></pre>
<p>A ROAS of 2.1 sounds good — every VND 1 of ads brings VND 2.1 of sales — but with a 40% gross margin the campaign loses money on the first purchase. It can still be worth running if the new customers buy again (customer lifetime value, Exercise 3), which is why metrics must be read together, never alone.</p>
<h3>Case: programmatic advertising and real-time bidding</h3>
<p><strong>Programmatic advertising</strong> buys and sells display ads automatically through software. In <strong>real-time bidding (RTB)</strong>, when a user opens a page, the publisher's system sends a bid request (page, ad slot, anonymized user data) to an <strong>ad exchange</strong>; advertisers' demand-side platforms bid in an automated auction, the winner's ad is shown — all within a fraction of a second. Benefits: precise targeting, efficiency and scale. Problems: ad fraud by bots, ads appearing next to harmful content (<em>brand safety</em>), low viewability, lack of transparency about who takes which share of the money, and privacy concerns about the personal data flowing through bid requests.</p>
<div class="callout"><span class="badge">Exam tip</span> CTR is clicks divided by impressions; conversion rate is orders divided by visitors. Do not divide orders by impressions and call it conversion.</div>`,
    `<span class="eyebrow">EEC101 · Phần 4 · Bài 4.2</span>
<h2>Công nghệ marketing, chỉ số đo lường và quảng cáo programmatic</h2>
<h3>Các công nghệ đứng sau marketing trực tuyến</h3>
<ul>
<li><strong>Nhật ký giao dịch web</strong> ghi lại mọi yêu cầu người dùng gửi tới website — dữ liệu luồng nhấp thô.</li>
<li><strong>Cookie</strong> là tệp văn bản nhỏ mà website đặt vào trình duyệt của người dùng. Cookie <em>bên thứ nhất</em> đến từ chính website bạn truy cập (giữ trạng thái đăng nhập, nhớ giỏ hàng); cookie <em>bên thứ ba</em> đến từ doanh nghiệp khác (mạng quảng cáo) và theo dõi bạn qua nhiều website. <strong>Web beacon</strong> (pixel theo dõi) là ảnh cực nhỏ vô hình báo về khi một trang hay e-mail được mở; <strong>dấu vân tay thiết bị</strong> nhận diện thiết bị qua cấu hình đặc thù của nó, kể cả khi không có cookie.</li>
<li><strong>Cơ sở dữ liệu</strong> lưu hồ sơ khách hàng; <strong>kho dữ liệu</strong> gom dữ liệu giao dịch và khách hàng của doanh nghiệp về một chỗ để phân tích; <strong>khai phá dữ liệu</strong> tìm ra quy luật (sản phẩm nào hay được mua cùng nhau, khách nào có khả năng rời bỏ).</li>
<li><strong>Dữ liệu lớn</strong> — tập dữ liệu lớn, nhanh và đa dạng đến mức cần công cụ mới (xử lý phân tán, học máy) để phân tích.</li>
<li><strong>Hệ thống tự động hoá marketing và CRM</strong> theo dõi mọi lần tiếp xúc với từng khách hàng và tự động hoá chiến dịch (e-mail nhắc khi khách bỏ giỏ hàng).</li>
</ul>
<p>Nhiều trình duyệt nay chặn cookie bên thứ ba theo mặc định và luật về quyền riêng tư đòi hỏi sự đồng ý khi theo dõi (Ch 8), nên người làm marketing ngày càng dựa vào <strong>dữ liệu bên thứ nhất</strong> — thông tin khách hàng chia sẻ trực tiếp với doanh nghiệp.</p>
<h3>Từ điển chỉ số</h3>
<table>
<tr><th>Chỉ số</th><th>Định nghĩa</th></tr>
<tr><td>Lượt hiển thị (impressions)</td><td>Số lần quảng cáo được phân phát</td></tr>
<tr><td>Tỷ lệ nhấp (CTR)</td><td>Lượt nhấp / lượt hiển thị</td></tr>
<tr><td>Tỷ lệ xem rồi truy cập (view-through rate)</td><td>Tỷ lệ người đã xem quảng cáo mà không nhấp nhưng sau đó vào website</td></tr>
<tr><td>Khách truy cập duy nhất · lượt xem trang · độ kết dính</td><td>Số khách khác nhau trong một kỳ · số trang được tải · thời gian trung bình ở lại website</td></tr>
<tr><td>Tỷ lệ chuyển đổi (conversion rate)</td><td>Tỷ lệ khách truy cập mua hàng (số đơn / số khách truy cập)</td></tr>
<tr><td>Chuyển đổi giỏ hàng · tỷ lệ bỏ giỏ hàng</td><td>Tỷ lệ giỏ hàng thành đơn · tỷ lệ người đã tạo giỏ hoặc bắt đầu thanh toán nhưng bỏ đi</td></tr>
<tr><td>Tỷ lệ giữ chân · tỷ lệ rời bỏ</td><td>Tỷ lệ khách quay lại mua tiếp · tỷ lệ khách ngừng mua</td></tr>
<tr><td>E-mail: tỷ lệ mở, tỷ lệ nhấp, tỷ lệ thư bị trả lại</td><td>Số thư mở / số thư gửi tới · số nhấp / số thư gửi tới · số thư không gửi được</td></tr>
<tr><td>Video: tỷ lệ xem hết</td><td>Tỷ lệ người xem tới cuối</td></tr>
</table>
<h3>Quảng cáo được định giá thế nào — và một ví dụ số</h3>
<p><strong>CPM</strong> = chi phí cho mỗi nghìn lượt hiển thị; <strong>CPC</strong> = chi phí mỗi lượt nhấp; <strong>CPA</strong> = chi phí mỗi hành động (ví dụ mỗi đơn mua). <strong>ROAS</strong> (doanh thu trên chi phí quảng cáo) = doanh thu / chi phí quảng cáo; <strong>ROI</strong> = (lợi nhuận tạo ra − chi phí) / chi phí.</p>
<pre><code>Chiến dịch hiển thị của một shop giả định (số liệu minh hoạ, đồng)
Lượt hiển thị          400.000     mua theo CPM 50.000
Chi phí quảng cáo      400.000 / 1.000 x 50.000     = 20.000.000
Lượt nhấp              400.000 x CTR 1,2%           = 4.800
CPC thực tế            20.000.000 / 4.800           ≈ 4.167
Số đơn                 4.800 x tỷ lệ chuyển đổi 2,5% = 120
CPA                    20.000.000 / 120             ≈ 166.667
Doanh thu              120 x giá trị đơn TB 350.000 = 42.000.000
ROAS                   42.000.000 / 20.000.000      = 2,1
Lợi nhuận gộp          42.000.000 x biên gộp 40%    = 16.800.000
ROI                    (16.800.000 − 20.000.000) / 20.000.000 = −16%
ROAS hoà vốn           1 / biên gộp = 1 / 0,40      = 2,5</code></pre>
<p>ROAS 2,1 nghe có vẻ tốt — mỗi 1 đồng quảng cáo mang về 2,1 đồng doanh số — nhưng với biên lợi nhuận gộp 40%, chiến dịch lỗ ngay ở lần mua đầu. Nó vẫn có thể đáng chạy nếu khách mới quay lại mua tiếp (giá trị vòng đời khách hàng, Bài tập 3), vì vậy phải đọc các chỉ số cùng nhau, không bao giờ đọc riêng lẻ.</p>
<h3>Tình huống: quảng cáo programmatic và đấu giá thời gian thực</h3>
<p><strong>Quảng cáo programmatic</strong> mua bán quảng cáo hiển thị một cách tự động bằng phần mềm. Trong <strong>đấu giá thời gian thực (RTB)</strong>, khi người dùng mở một trang, hệ thống của nhà xuất bản gửi yêu cầu đặt giá (trang, vị trí quảng cáo, dữ liệu người dùng đã ẩn danh) tới một <strong>sàn giao dịch quảng cáo</strong>; nền tảng phía cầu của các nhà quảng cáo trả giá trong một phiên đấu giá tự động, quảng cáo của bên thắng được hiển thị — tất cả trong chưa tới một giây. Lợi ích: nhắm mục tiêu chính xác, hiệu quả và quy mô lớn. Vấn đề: gian lận quảng cáo bằng bot, quảng cáo xuất hiện cạnh nội dung độc hại (<em>an toàn thương hiệu</em>), khả năng được nhìn thấy thấp, thiếu minh bạch về việc ai hưởng phần nào trong số tiền, và lo ngại về quyền riêng tư đối với dữ liệu cá nhân chạy qua các yêu cầu đặt giá.</p>
<div class="callout"><span class="badge">Mẹo thi</span> CTR là số nhấp chia cho số lượt hiển thị; tỷ lệ chuyển đổi là số đơn chia cho số khách truy cập. Đừng lấy số đơn chia cho số lượt hiển thị rồi gọi đó là tỷ lệ chuyển đổi.</div>`,
  ]]);

const p43 = doc('eec101-4-3-social-mobile-local', '4.3 — Ch 7 · Social, mobile and local marketing|||4.3 — Ch 7 · Marketing mạng xã hội, di động và địa phương',
  'Mối liên kết xã hội – di động – địa phương, quy trình marketing mạng xã hội năm bước (thu hút người theo dõi, gắn kết, khuếch đại, cộng đồng, sức mạnh thương hiệu và doanh số) cùng chỉ số đo, các nền tảng, người có ảnh hưởng, mặt trái; marketing di động (tính năng, công cụ, đo lường); marketing địa phương và theo vị trí (GPS, beacon, geo-fencing, nhắm theo vị trí); tình huống giả định xây thương hiệu quốc tế bằng mạng xã hội.',
  [[
    `<span class="eyebrow">EEC101 · Part 4 · Lesson 4.3</span>
<h2>Social, mobile and local marketing</h2>
<p class="lead">Three shifts change marketing at once: from one-way messages to <strong>conversations</strong> (social), from the desktop to the <strong>phone in the pocket</strong> (mobile), and from "anyone, anywhere" to "this person, <strong>right here, right now</strong>" (local). Together they form the social–mobile–local nexus: most social activity happens on phones, and phones know where people are.</p>
<h3>Social marketing: a five-step process</h3>
<table>
<tr><th>Step</th><th>Goal</th><th>Example measures</th></tr>
<tr><td>1. Fan acquisition</td><td>Attract people to your page, profile or channel</td><td>Reach, impressions, new followers</td></tr>
<tr><td>2. Engagement</td><td>Get them to interact with your content</td><td>Comments, reactions, time spent, video views</td></tr>
<tr><td>3. Amplification</td><td>Get them to share your content with their friends</td><td>Shares, reach of shared posts</td></tr>
<tr><td>4. Community</td><td>Create a stable group of fans who talk to each other and to the brand</td><td>Active members, repeat engagement, user-generated content</td></tr>
<tr><td>5. Brand strength and sales</td><td>Turn relationships into brand awareness and revenue</td><td>Sentiment, conversions and sales from social channels</td></tr>
</table>
<h3>Platforms and tools</h3>
<ul>
<li>Large social networks offer <strong>brand pages</strong>, <strong>targeted ads</strong> (by demographics, interests, behaviour), groups and in-app shops; <strong>short-video</strong> platforms reward entertaining, authentic content and creators; <strong>image and inspiration</strong> platforms suit fashion, food and home products; professional networks suit <strong>B2B</strong>.</li>
<li><strong>Social commerce</strong> lets users buy without leaving the platform — including <strong>livestream selling</strong>, where a host demonstrates products and takes orders in real time.</li>
<li><strong>Influencer marketing</strong> pays creators — from celebrities to "micro" creators and ordinary customers who review products — to present the brand. Paid partnerships must be clearly disclosed to followers.</li>
<li><strong>The downside:</strong> the brand loses control of the conversation; negative comments spread fast; ads may appear next to harmful content; platforms change their algorithms and rules without notice.</li>
</ul>
<h3>Mobile marketing</h3>
<p>Phones are personal, always on and location-aware, and people spend much of their mobile time <strong>inside apps</strong>. Tools include mobile search ads, mobile display and video ads, in-app ads, SMS and <strong>push notifications</strong>, and the firm's own app. Measures: app installs and cost per install, active users, time in app, mobile conversion rate. Design rule: small screens and short attention spans demand fast pages, one-tap payment and short content.</p>
<h3>Local and location-based mobile marketing</h3>
<table>
<tr><th>Technology</th><th>Use</th></tr>
<tr><td>GPS, cell-tower and Wi-Fi location</td><td>Know roughly where the device is — outdoors (GPS) or indoors (Wi-Fi)</td></tr>
<tr><td>Bluetooth low energy beacons</td><td>Very precise indoor location, for example a shelf in a store</td></tr>
<tr><td>Geo-fencing</td><td>A virtual boundary around a place; entering it can trigger a message or offer</td></tr>
<tr><td>Geo-targeting</td><td>Sending ads based on a user's location (a city, a district, "within 2 km")</td></tr>
</table>
<p><strong>Geo-aware</strong> marketing targets people based on their general location; <strong>proximity marketing</strong> targets people very close to a store (with beacons or geo-fences). Local search ("near me"), map listings with reviews, and location-based offers bring people into physical stores. Measures include store visits, calls, requests for directions and offer redemptions. Location data is sensitive: users must give consent, and many are uncomfortable with being tracked.</p>
<h3>Case (fictional): taking a Vietnamese brand abroad through social marketing</h3>
<p>LaNa Silk, a fictional Hoi An workshop making silk scarves, wants foreign customers. <em>Fan acquisition:</em> short videos of weaving, targeted to people interested in sustainable fashion in two selected countries. <em>Engagement:</em> "choose next season's pattern" polls. <em>Amplification:</em> a hashtag challenge showing ten ways to tie a scarf. <em>Community:</em> a group for customers who share photos. <em>Sales:</em> links to the website and a cross-border marketplace store. Critical questions: Does the story travel across cultures? Can the workshop fulfil international orders and returns? Are influencer posts disclosed?</p>
<div class="callout"><span class="badge">Watch out</span> Followers and likes are not sales. Always connect social metrics to the later steps of the process — amplification, community and, finally, brand strength and revenue.</div>`,
    `<span class="eyebrow">EEC101 · Phần 4 · Bài 4.3</span>
<h2>Marketing mạng xã hội, di động và địa phương</h2>
<p class="lead">Ba chuyển dịch thay đổi marketing cùng lúc: từ thông điệp một chiều sang <strong>đối thoại</strong> (mạng xã hội), từ máy tính để bàn sang <strong>chiếc điện thoại trong túi</strong> (di động), và từ "bất kỳ ai, ở đâu cũng được" sang "đúng người này, <strong>ngay tại đây, ngay lúc này</strong>" (địa phương). Gộp lại, chúng tạo thành mối liên kết xã hội – di động – địa phương: phần lớn hoạt động mạng xã hội diễn ra trên điện thoại, và điện thoại biết người dùng đang ở đâu.</p>
<h3>Marketing mạng xã hội: quy trình năm bước</h3>
<table>
<tr><th>Bước</th><th>Mục tiêu</th><th>Ví dụ chỉ số đo</th></tr>
<tr><td>1. Thu hút người theo dõi (fan acquisition)</td><td>Kéo mọi người tới trang, hồ sơ hay kênh của bạn</td><td>Lượt tiếp cận, lượt hiển thị, người theo dõi mới</td></tr>
<tr><td>2. Gắn kết (engagement)</td><td>Khiến họ tương tác với nội dung của bạn</td><td>Bình luận, cảm xúc, thời gian xem, lượt xem video</td></tr>
<tr><td>3. Khuếch đại (amplification)</td><td>Khiến họ chia sẻ nội dung với bạn bè</td><td>Lượt chia sẻ, lượt tiếp cận của bài được chia sẻ</td></tr>
<tr><td>4. Cộng đồng (community)</td><td>Tạo một nhóm người hâm mộ ổn định trò chuyện với nhau và với thương hiệu</td><td>Thành viên tích cực, tương tác lặp lại, nội dung do người dùng tạo</td></tr>
<tr><td>5. Sức mạnh thương hiệu và doanh số</td><td>Biến quan hệ thành nhận biết thương hiệu và doanh thu</td><td>Thiện cảm, chuyển đổi và doanh số từ kênh mạng xã hội</td></tr>
</table>
<h3>Nền tảng và công cụ</h3>
<ul>
<li>Các mạng xã hội lớn cung cấp <strong>trang thương hiệu</strong>, <strong>quảng cáo nhắm mục tiêu</strong> (theo nhân khẩu học, sở thích, hành vi), nhóm và cửa hàng trong ứng dụng; nền tảng <strong>video ngắn</strong> ưu ái nội dung giải trí, chân thực và nhà sáng tạo; nền tảng <strong>hình ảnh và cảm hứng</strong> hợp với thời trang, ẩm thực, đồ gia dụng; mạng nghề nghiệp hợp với <strong>B2B</strong>.</li>
<li><strong>Thương mại mạng xã hội</strong> cho người dùng mua mà không rời nền tảng — kể cả <strong>bán hàng qua livestream</strong>, khi người dẫn trình diễn sản phẩm và chốt đơn theo thời gian thực.</li>
<li><strong>Marketing người có ảnh hưởng</strong> trả tiền cho nhà sáng tạo — từ người nổi tiếng tới nhà sáng tạo "vi mô" và khách hàng bình thường đánh giá sản phẩm — để giới thiệu thương hiệu. Hợp tác có trả phí phải được công khai rõ cho người theo dõi.</li>
<li><strong>Mặt trái:</strong> thương hiệu mất quyền kiểm soát cuộc trò chuyện; bình luận tiêu cực lan nhanh; quảng cáo có thể hiện cạnh nội dung độc hại; nền tảng đổi thuật toán và quy định mà không báo trước.</li>
</ul>
<h3>Marketing di động</h3>
<p>Điện thoại mang tính cá nhân, luôn bật và biết vị trí, và người dùng dành phần lớn thời gian trên di động <strong>bên trong ứng dụng</strong>. Công cụ gồm quảng cáo tìm kiếm trên di động, quảng cáo hiển thị và video trên di động, quảng cáo trong ứng dụng, SMS và <strong>thông báo đẩy</strong>, cùng ứng dụng riêng của doanh nghiệp. Chỉ số đo: lượt cài ứng dụng và chi phí mỗi lượt cài, người dùng hoạt động, thời gian trong ứng dụng, tỷ lệ chuyển đổi trên di động. Nguyên tắc thiết kế: màn hình nhỏ và sự chú ý ngắn đòi hỏi trang tải nhanh, thanh toán một chạm và nội dung ngắn.</p>
<h3>Marketing địa phương và theo vị trí trên di động</h3>
<table>
<tr><th>Công nghệ</th><th>Ứng dụng</th></tr>
<tr><td>Định vị GPS, trạm phát sóng và Wi-Fi</td><td>Biết gần đúng thiết bị đang ở đâu — ngoài trời (GPS) hoặc trong nhà (Wi-Fi)</td></tr>
<tr><td>Beacon Bluetooth năng lượng thấp</td><td>Định vị trong nhà rất chính xác, ví dụ tới một kệ hàng trong cửa hàng</td></tr>
<tr><td>Hàng rào địa lý (geo-fencing)</td><td>Một ranh giới ảo quanh một địa điểm; đi vào vùng đó có thể kích hoạt tin nhắn hay ưu đãi</td></tr>
<tr><td>Nhắm mục tiêu theo vị trí (geo-targeting)</td><td>Gửi quảng cáo dựa trên vị trí người dùng (một thành phố, một quận, "trong bán kính 2 km")</td></tr>
</table>
<p>Marketing <strong>nhận biết vị trí (geo-aware)</strong> nhắm tới người dùng theo vị trí chung của họ; <strong>marketing tiệm cận (proximity)</strong> nhắm tới người đang ở rất gần cửa hàng (bằng beacon hoặc hàng rào địa lý). Tìm kiếm địa phương ("gần tôi"), danh sách trên bản đồ kèm đánh giá, và ưu đãi theo vị trí đưa khách tới cửa hàng thật. Chỉ số đo gồm lượt ghé cửa hàng, cuộc gọi, yêu cầu chỉ đường và số ưu đãi được dùng. Dữ liệu vị trí là dữ liệu nhạy cảm: người dùng phải đồng ý, và nhiều người không thoải mái khi bị theo dõi.</p>
<h3>Tình huống (giả định): đưa một thương hiệu Việt ra nước ngoài bằng marketing mạng xã hội</h3>
<p>LaNa Silk, một xưởng giả định ở Hội An làm khăn lụa, muốn có khách nước ngoài. <em>Thu hút người theo dõi:</em> video ngắn về quá trình dệt, nhắm tới người quan tâm thời trang bền vững ở hai quốc gia được chọn. <em>Gắn kết:</em> bình chọn "chọn hoa văn cho mùa tới". <em>Khuếch đại:</em> thử thách hashtag mười cách thắt khăn. <em>Cộng đồng:</em> một nhóm cho khách hàng chia sẻ ảnh. <em>Doanh số:</em> đường dẫn tới website và gian hàng trên một sàn xuyên biên giới. Câu hỏi phản biện: câu chuyện có vượt qua được khác biệt văn hoá không? Xưởng có đáp ứng được đơn quốc tế và đổi trả không? Bài đăng của người có ảnh hưởng có được công khai là hợp tác không?</p>
<div class="callout"><span class="badge">Cẩn thận</span> Người theo dõi và lượt thích không phải là doanh số. Luôn nối các chỉ số mạng xã hội với các bước sau của quy trình — khuếch đại, cộng đồng và cuối cùng là sức mạnh thương hiệu và doanh thu.</div>`,
  ]]);

const p44 = doc('eec101-4-4-ai-launch-lab', '4.4 — Ch 6–7 · AI lab: a launch concept with generative AI|||4.4 — Ch 6–7 · Thực hành AI: concept ra mắt sản phẩm với AI tạo sinh',
  'Thực hành theo đề cương: dùng AI tạo sinh để phác thảo concept marketing ra mắt một sản phẩm trên sàn và chiến lược tiếp cận khách hàng mạng xã hội – di động – địa phương; quy trình bốn bước có con người kiểm soát, mẫu câu lệnh, bảng tiêu chí đánh giá phê phán, và các vấn đề đạo đức của AI tạo sinh (bịa đặt, bản quyền, thiên kiến, quyền riêng tư, deepfake, minh bạch).',
  [[
    `<span class="eyebrow">EEC101 · Part 4 · Lesson 4.4 · AI lab</span>
<h2>AI lab: a launch concept with generative AI</h2>
<p class="lead">The syllabus asks you to use AI to build a marketing concept for launching a product on an e-commerce platform and a social–mobile–local strategy for reaching customers — and to judge the result critically. Generative AI is a fast drafting partner; it is not a source of truth, and the responsibility for what is published stays with you.</p>
<h3>A four-step workflow with a human in control</h3>
<ol>
<li><strong>Brief with facts you own.</strong> Product, price range, target segment, channel (marketplace store, own site), budget, brand tone and constraints. Never paste customers' personal data or confidential company data into a public AI tool.</li>
<li><strong>Generate options, not answers.</strong> Ask for several positioning statements, key messages, a launch calendar and a social–mobile–local plan; ask the AI to state its assumptions.</li>
<li><strong>Verify and edit.</strong> Check every factual claim, number and legal point yourself; check images and texts for copyright and likeness problems; remove biased or stereotyped content; adapt to the brand.</li>
<li><strong>Test small, then scale.</strong> Turn the best ideas into two or three versions and A/B test them with real (small) budgets; let data, not the AI's confidence, decide.</li>
</ol>
<h3>A sample brief (prompt)</h3>
<pre><code class="language-text">Role: you are a digital marketing assistant for a small Vietnamese brand.
Product: TraXanh craft tea box (fictional), price VND 199,000-250,000.
Target: office workers aged 22-35 in large cities who buy online on their phones.
Channel: a store on a large e-commerce marketplace plus short-video social media.
Budget: modest; no celebrity endorsements.
Tasks:
1. Propose 3 positioning statements and the value proposition behind each.
2. Write a 4-week launch plan: marketplace listing, launch promotion,
   short-video content, influencer (micro-creator) collaboration.
3. Propose a social-mobile-local plan: which platforms, which formats,
   push notifications, geo-targeted offers near office buildings.
4. Suggest 5 metrics to judge the launch.
Rules: list your assumptions; do not invent statistics, awards or health claims;
mark any claim that needs evidence.</code></pre>
<h3>Critical evaluation checklist</h3>
<table>
<tr><th>Criterion</th><th>What to look for in the AI output</th></tr>
<tr><td>Accuracy</td><td>Invented statistics, fake awards, "best-selling" or "No. 1" claims without evidence — AI can <strong>hallucinate</strong> confidently</td></tr>
<tr><td>Legality</td><td>Health or quality claims that need proof; comparative claims about competitors; missing disclosure of paid partnerships; consumer-protection and advertising rules (check the texts in force)</td></tr>
<tr><td>Intellectual property</td><td>Generated images or slogans too close to existing brands, artworks or real people's likeness</td></tr>
<tr><td>Bias and inclusion</td><td>Stereotypes about gender, age or regions; messages that exclude part of the target market</td></tr>
<tr><td>Privacy</td><td>Tactics that rely on tracking without consent or on sensitive data (precise location, health)</td></tr>
<tr><td>Fit and feasibility</td><td>Does the plan match the budget, the brand and the team's real capacity to deliver?</td></tr>
</table>
<h3>Ethics of generative AI in marketing</h3>
<p>Beyond hallucination, the main concerns are: <strong>copyright</strong> (training data and outputs that reproduce protected works), <strong>bias</strong> (models repeat patterns in their data), <strong>privacy</strong> (what happens to data you enter), <strong>deepfakes and deception</strong> (synthetic voices or faces of real people, fake reviews), <strong>transparency</strong> (should customers be told that content or a chat agent is AI-generated?), and wider effects on jobs and the environment. The free Coursera course named in the syllabus, <em>Generative AI: Impact, Considerations, and Ethical Issues</em>, covers these themes in more depth (see the resource hub).</p>
<div class="callout"><span class="badge">Rule of thumb</span> Use AI to widen your options and speed up drafting; never to replace verification. If you would not sign your name under a claim, do not publish it — whoever wrote the first draft.</div>`,
    `<span class="eyebrow">EEC101 · Phần 4 · Bài 4.4 · Thực hành AI</span>
<h2>Thực hành AI: concept ra mắt sản phẩm với AI tạo sinh</h2>
<p class="lead">Đề cương yêu cầu bạn dùng AI để xây concept marketing ra mắt một sản phẩm trên nền tảng TMĐT và chiến lược mạng xã hội – di động – địa phương để tiếp cận khách hàng — rồi đánh giá kết quả một cách phản biện. AI tạo sinh là trợ thủ phác thảo nhanh; nó không phải nguồn sự thật, và trách nhiệm với những gì được đăng tải vẫn thuộc về bạn.</p>
<h3>Quy trình bốn bước, con người nắm quyền kiểm soát</h3>
<ol>
<li><strong>Viết brief bằng dữ kiện của chính bạn.</strong> Sản phẩm, khoảng giá, phân khúc mục tiêu, kênh (gian hàng trên sàn, website riêng), ngân sách, giọng thương hiệu và các ràng buộc. Không bao giờ dán dữ liệu cá nhân của khách hàng hay dữ liệu mật của công ty vào công cụ AI công cộng.</li>
<li><strong>Tạo phương án, không phải đáp án.</strong> Yêu cầu nhiều tuyên bố định vị, thông điệp chính, lịch ra mắt và kế hoạch xã hội – di động – địa phương; yêu cầu AI nêu rõ các giả định của nó.</li>
<li><strong>Kiểm chứng và biên tập.</strong> Tự kiểm mọi nhận định, con số và điểm pháp lý; kiểm hình ảnh và văn bản về bản quyền và hình ảnh cá nhân; loại bỏ nội dung thiên kiến hay rập khuôn; điều chỉnh cho hợp thương hiệu.</li>
<li><strong>Thử nhỏ rồi mới mở rộng.</strong> Biến những ý tưởng tốt nhất thành hai ba phiên bản và kiểm thử A/B với ngân sách thật (nhỏ); để dữ liệu quyết định, chứ không phải sự tự tin của AI.</li>
</ol>
<h3>Một brief mẫu (câu lệnh)</h3>
<pre><code class="language-text">Vai trò: bạn là trợ lý marketing số cho một thương hiệu nhỏ của Việt Nam.
Sản phẩm: hộp trà thủ công TraXanh (giả định), giá 199.000-250.000 đồng.
Mục tiêu: nhân viên văn phòng 22-35 tuổi ở thành phố lớn, mua sắm trên điện thoại.
Kênh: gian hàng trên một sàn TMĐT lớn cùng mạng xã hội video ngắn.
Ngân sách: khiêm tốn; không dùng người nổi tiếng.
Nhiệm vụ:
1. Đề xuất 3 tuyên bố định vị và tuyên bố giá trị đằng sau mỗi cái.
2. Viết kế hoạch ra mắt 4 tuần: đăng sản phẩm trên sàn, khuyến mãi ra mắt,
   nội dung video ngắn, hợp tác với nhà sáng tạo vi mô.
3. Đề xuất kế hoạch xã hội - di động - địa phương: nền tảng nào, định dạng nào,
   thông báo đẩy, ưu đãi nhắm theo vị trí quanh các toà văn phòng.
4. Gợi ý 5 chỉ số để đánh giá đợt ra mắt.
Quy tắc: liệt kê giả định; không bịa số liệu thống kê, giải thưởng hay công dụng
sức khoẻ; đánh dấu mọi nhận định cần bằng chứng.</code></pre>
<h3>Bảng kiểm đánh giá phản biện</h3>
<table>
<tr><th>Tiêu chí</th><th>Cần soi gì trong kết quả của AI</th></tr>
<tr><td>Chính xác</td><td>Số liệu bịa, giải thưởng giả, nhận định "bán chạy nhất" hay "số 1" không có bằng chứng — AI có thể <strong>bịa đặt (hallucinate)</strong> một cách rất tự tin</td></tr>
<tr><td>Hợp pháp</td><td>Công dụng sức khoẻ hay chất lượng cần chứng minh; so sánh với đối thủ; thiếu công khai hợp tác có trả phí; quy định về bảo vệ người tiêu dùng và quảng cáo (kiểm văn bản đang có hiệu lực)</td></tr>
<tr><td>Sở hữu trí tuệ</td><td>Hình ảnh hay khẩu hiệu do AI tạo quá giống thương hiệu, tác phẩm có sẵn hoặc hình ảnh của người thật</td></tr>
<tr><td>Thiên kiến và hoà nhập</td><td>Định kiến về giới, tuổi hay vùng miền; thông điệp loại trừ một phần thị trường mục tiêu</td></tr>
<tr><td>Quyền riêng tư</td><td>Chiến thuật dựa vào theo dõi không có sự đồng ý hoặc dữ liệu nhạy cảm (vị trí chính xác, sức khoẻ)</td></tr>
<tr><td>Phù hợp và khả thi</td><td>Kế hoạch có khớp ngân sách, thương hiệu và năng lực thực hiện thật của đội không?</td></tr>
</table>
<h3>Đạo đức của AI tạo sinh trong marketing</h3>
<p>Ngoài chuyện bịa đặt, các mối lo chính là: <strong>bản quyền</strong> (dữ liệu huấn luyện và kết quả tái tạo tác phẩm được bảo hộ), <strong>thiên kiến</strong> (mô hình lặp lại khuôn mẫu trong dữ liệu), <strong>quyền riêng tư</strong> (dữ liệu bạn nhập vào sẽ đi đâu), <strong>deepfake và lừa dối</strong> (giọng nói, khuôn mặt tổng hợp của người thật, đánh giá giả), <strong>minh bạch</strong> (có nên cho khách hàng biết nội dung hay nhân viên chat là do AI tạo?), và tác động rộng hơn tới việc làm và môi trường. Khoá học miễn phí trên Coursera được nêu trong đề cương, <em>Generative AI: Impact, Considerations, and Ethical Issues</em>, đi sâu hơn vào các chủ đề này (xem trung tâm tài liệu).</p>
<div class="callout"><span class="badge">Quy tắc nhớ nhanh</span> Dùng AI để mở rộng phương án và tăng tốc phác thảo; không bao giờ để thay việc kiểm chứng. Nếu bạn không dám ký tên dưới một nhận định, đừng đăng nó — dù ai viết bản nháp đầu tiên.</div>`,
  ]]);

const p4q = quiz('eec101-quiz-4', 'Quiz 4 — Ch 6–7: marketing and advertising|||Quiz 4 — Ch 6–7: marketing và quảng cáo', [
  { id: 'q1', question: 'An ad is shown 200,000 times and receives 3,000 clicks. What is its click-through rate (CTR)?|||Một quảng cáo được hiển thị 200.000 lần và nhận 3.000 lượt nhấp. Tỷ lệ nhấp (CTR) là bao nhiêu?', options: ['0.15%|||0,15%', '1.5%|||1,5%', '6.7%|||6,7%', '15%|||15%'], correctIndex: 1, explanation: 'CTR = clicks / impressions = 3,000 / 200,000 = 1.5%.|||CTR = lượt nhấp / lượt hiển thị = 3.000 / 200.000 = 1,5%.' },
  { id: 'q2', question: 'In the social marketing process, which step comes right after engagement?|||Trong quy trình marketing mạng xã hội, bước nào đứng ngay sau gắn kết?', options: ['Fan acquisition|||Thu hút người theo dõi', 'Brand strength and sales|||Sức mạnh thương hiệu và doanh số', 'Amplification|||Khuếch đại', 'Community|||Cộng đồng'], correctIndex: 2, explanation: 'The order is fan acquisition, engagement, amplification, community, then brand strength and sales.|||Thứ tự là thu hút người theo dõi, gắn kết, khuếch đại, cộng đồng, rồi sức mạnh thương hiệu và doanh số.' },
  { id: 'q3', question: 'A campaign has a ROAS of 2.0 and the products sold have a gross margin of 40%. On the first purchase alone, the campaign…|||Một chiến dịch có ROAS 2,0 và sản phẩm bán ra có biên lợi nhuận gộp 40%. Chỉ tính lần mua đầu, chiến dịch…', options: ['makes a profit, because ROAS is above 1|||có lãi, vì ROAS lớn hơn 1', 'breaks even exactly|||hoà vốn đúng bằng', 'makes a profit of 100%|||lãi 100%', 'loses money, because break-even ROAS is 1 / 0.40 = 2.5|||lỗ, vì ROAS hoà vốn là 1 / 0,40 = 2,5'], correctIndex: 3, explanation: 'Each VND 1 of ads brings VND 2 of sales and VND 0.80 of gross profit, less than the VND 1 spent (ROI = −20%).|||Mỗi 1 đồng quảng cáo mang về 2 đồng doanh số và 0,80 đồng lợi nhuận gộp, ít hơn 1 đồng đã chi (ROI = −20%).' },
]);

const p51 = doc('eec101-5-1-ethics-privacy', '5.1 — Ch 8 · Ethical dilemmas and privacy rights|||5.1 — Ch 8 · Tình huống đạo đức và quyền riêng tư',
  'Bốn chiều đạo đức của TMĐT (quyền thông tin, quyền tài sản, quản trị, an toàn và phúc lợi công cộng), trách nhiệm – giải trình – trách nhiệm pháp lý – thủ tục hợp lệ, năm bước phân tích tình huống khó xử, tám nguyên tắc đạo đức ứng viên; quyền riêng tư: thông tin nhận dạng cá nhân, lập hồ sơ, nhắm mục tiêu theo hành vi, dữ liệu vị trí, opt-in/opt-out, nguyên tắc thông tin công bằng, GDPR và Nghị định 13/2023/NĐ-CP của Việt Nam (có rào).',
  [[
    `<span class="eyebrow">EEC101 · Part 5 · Lesson 5.1</span>
<h2>Ethical dilemmas and privacy rights</h2>
<h3>A model for organizing the issues</h3>
<p>New technology creates situations that existing laws and social norms have not yet settled. The textbook groups the ethical, social and political issues of e-commerce into four <strong>moral dimensions</strong>:</p>
<table>
<tr><th>Dimension</th><th>Central question</th></tr>
<tr><td>Information rights</td><td>What rights do individuals have to control their own personal information?</td></tr>
<tr><td>Property rights</td><td>How can intellectual property be protected when perfect copies cost almost nothing?</td></tr>
<tr><td>Governance</td><td>Should the Internet and e-commerce be subject to public law — and whose law?</td></tr>
<tr><td>Public safety and welfare</td><td>How do we protect children, ensure fair access and limit harmful content?</td></tr>
</table>
<h3>Basic ethical concepts</h3>
<ul>
<li><strong>Responsibility</strong> — as free moral agents, individuals and organizations accept the costs, duties and obligations of their decisions.</li>
<li><strong>Accountability</strong> — they can be held to account for the consequences of their actions.</li>
<li><strong>Liability</strong> — laws permit individuals to recover damages done to them by others.</li>
<li><strong>Due process</strong> — laws are known and understood, and there is the ability to appeal to higher authorities to ensure they are applied correctly.</li>
</ul>
<h3>Analysing an ethical dilemma in five steps</h3>
<ol>
<li>Identify and clearly describe the facts.</li>
<li>Define the conflict or dilemma and identify the higher-order values involved (privacy, freedom, fairness).</li>
<li>Identify the stakeholders.</li>
<li>Identify the options that you can reasonably take.</li>
<li>Identify the potential consequences of each option.</li>
</ol>
<h3>Candidate ethical principles</h3>
<table>
<tr><th>Principle</th><th>In one line</th></tr>
<tr><td>The Golden Rule</td><td>Do unto others as you would have them do unto you</td></tr>
<tr><td>Universalism</td><td>If an action is not right for all situations, it is not right for any</td></tr>
<tr><td>Slippery slope</td><td>If an action cannot be repeated over and over, it is not right at all</td></tr>
<tr><td>Collective utilitarian principle</td><td>Take the action that achieves the greater value for all of society</td></tr>
<tr><td>Risk aversion</td><td>Take the action that produces the least harm or the least potential cost</td></tr>
<tr><td>No free lunch</td><td>Assume that virtually all tangible and intangible objects are owned by someone else</td></tr>
<tr><td>The New York Times test</td><td>Would you be comfortable if your decision appeared on the front page of a newspaper?</td></tr>
<tr><td>The social contract rule</td><td>Would you like to live in a society where this principle is a general rule?</td></tr>
</table>
<h3>Privacy and information rights</h3>
<p><strong>Privacy</strong> is the moral right of individuals to be left alone, free from surveillance or interference; <strong>information privacy</strong> includes the right to control what information is collected about you and how it is used. E-commerce sites collect <strong>personally identifiable information (PII)</strong> — name, phone, address, ID numbers — and <strong>anonymous information</strong> such as browsing behaviour, which can often be re-linked to a person. Key practices raising concern: <strong>profiling</strong> (building digital images of consumers from their online behaviour), <strong>behavioural targeting and retargeting</strong>, collection through social networks and mobile apps (including <strong>location data</strong>), and government access to data.</p>
<ul>
<li><strong>Opt-in</strong> requires an affirmative action by the consumer before data are collected or used; <strong>opt-out</strong> means data are used unless the consumer takes action to stop it. Opt-in is more protective.</li>
<li>The US FTC's <strong>fair information practice principles</strong>: notice/awareness, choice/consent, access/participation, security and enforcement. US privacy law is a patchwork of sector rules and state laws rather than one comprehensive law.</li>
<li>The EU's <strong>General Data Protection Regulation (GDPR)</strong> is a comprehensive law: a lawful basis (often explicit consent) for processing, data minimization, rights of access, rectification and erasure (the "right to be forgotten"), data portability, breach notification and large fines; it applies to foreign firms that process EU residents' data.</li>
</ul>
<h3>The Vietnamese connection (check the texts in force)</h3>
<p>Vietnam's <strong>Decree 13/2023/ND-CP on personal data protection</strong> introduced a general framework: it distinguishes <em>basic</em> from <em>sensitive</em> personal data (sensitive data, such as health, precise location or financial data, get stricter protection); consent must be voluntary and clearly expressed — silence or non-response is not consent; data subjects have rights such as to be informed, to give and withdraw consent, to access, to request deletion and to object; businesses that process data carry duties including impact assessments. Vietnam has since adopted a Law on Personal Data Protection that raises these rules to the level of a statute. Because this area is changing, always check which documents are currently in force on the national legal database before advising a business.</p>
<p>Technical tools also help individuals: privacy settings, blocking third-party cookies, private browsing, ad blockers and encrypted messaging.</p>
<div class="callout"><span class="badge">Apply it</span> A shop wants to send push offers when customers walk past its store. Use the five steps: facts (location tracking), values (privacy vs convenience), stakeholders (customers, shop, app provider), options (opt-in with clear explanation; no tracking; opt-out by default), consequences. Risk aversion and the newspaper test both point to <em>explicit opt-in</em>.</div>`,
    `<span class="eyebrow">EEC101 · Phần 5 · Bài 5.1</span>
<h2>Tình huống đạo đức và quyền riêng tư</h2>
<h3>Một mô hình để sắp xếp các vấn đề</h3>
<p>Công nghệ mới tạo ra những tình huống mà luật và chuẩn mực xã hội hiện có chưa kịp giải quyết. Giáo trình gom các vấn đề đạo đức, xã hội và chính trị của TMĐT thành bốn <strong>chiều đạo đức</strong>:</p>
<table>
<tr><th>Chiều</th><th>Câu hỏi trung tâm</th></tr>
<tr><td>Quyền thông tin</td><td>Cá nhân có quyền gì trong việc kiểm soát thông tin cá nhân của mình?</td></tr>
<tr><td>Quyền tài sản</td><td>Làm sao bảo hộ sở hữu trí tuệ khi bản sao hoàn hảo gần như không tốn chi phí?</td></tr>
<tr><td>Quản trị</td><td>Internet và TMĐT có nên chịu sự điều chỉnh của luật công — và luật của ai?</td></tr>
<tr><td>An toàn và phúc lợi công cộng</td><td>Làm sao bảo vệ trẻ em, bảo đảm tiếp cận công bằng và hạn chế nội dung có hại?</td></tr>
</table>
<h3>Các khái niệm đạo đức cơ bản</h3>
<ul>
<li><strong>Trách nhiệm (responsibility)</strong> — là chủ thể đạo đức tự do, cá nhân và tổ chức chấp nhận chi phí, bổn phận và nghĩa vụ từ quyết định của mình.</li>
<li><strong>Trách nhiệm giải trình (accountability)</strong> — họ có thể bị buộc phải chịu trách nhiệm về hậu quả hành động của mình.</li>
<li><strong>Trách nhiệm pháp lý (liability)</strong> — luật cho phép cá nhân đòi bồi thường thiệt hại do người khác gây ra.</li>
<li><strong>Thủ tục hợp lệ (due process)</strong> — luật được công bố và hiểu rõ, và có thể khiếu nại lên cấp cao hơn để bảo đảm luật được áp dụng đúng.</li>
</ul>
<h3>Phân tích một tình huống đạo đức khó xử qua năm bước</h3>
<ol>
<li>Xác định và mô tả rõ các dữ kiện.</li>
<li>Xác định xung đột hay tình thế khó xử và các giá trị bậc cao liên quan (quyền riêng tư, tự do, công bằng).</li>
<li>Xác định các bên liên quan.</li>
<li>Xác định các phương án có thể thực hiện một cách hợp lý.</li>
<li>Xác định hậu quả tiềm tàng của từng phương án.</li>
</ol>
<h3>Các nguyên tắc đạo đức ứng viên</h3>
<table>
<tr><th>Nguyên tắc</th><th>Tóm tắt một dòng</th></tr>
<tr><td>Quy tắc vàng</td><td>Hãy đối xử với người khác như bạn muốn được đối xử</td></tr>
<tr><td>Tính phổ quát</td><td>Nếu một hành động không đúng trong mọi tình huống thì nó không đúng trong tình huống nào cả</td></tr>
<tr><td>Dốc trượt</td><td>Nếu một hành động không thể lặp đi lặp lại thì nó hoàn toàn không đúng</td></tr>
<tr><td>Nguyên tắc vị lợi tập thể</td><td>Chọn hành động đạt giá trị lớn hơn cho toàn xã hội</td></tr>
<tr><td>Né tránh rủi ro</td><td>Chọn hành động gây ít tổn hại nhất hoặc ít chi phí tiềm tàng nhất</td></tr>
<tr><td>Không có bữa trưa miễn phí</td><td>Giả định rằng hầu hết mọi vật hữu hình và vô hình đều thuộc sở hữu của ai đó</td></tr>
<tr><td>Phép thử New York Times</td><td>Bạn có thấy thoải mái nếu quyết định của mình lên trang nhất một tờ báo không?</td></tr>
<tr><td>Quy tắc khế ước xã hội</td><td>Bạn có muốn sống trong một xã hội mà nguyên tắc này là quy tắc chung không?</td></tr>
</table>
<h3>Quyền riêng tư và quyền thông tin</h3>
<p><strong>Quyền riêng tư</strong> là quyền đạo đức của cá nhân được để yên, không bị giám sát hay can thiệp; <strong>quyền riêng tư thông tin</strong> bao gồm quyền kiểm soát thông tin nào về mình được thu thập và được dùng ra sao. Website TMĐT thu thập <strong>thông tin nhận dạng cá nhân (PII)</strong> — tên, số điện thoại, địa chỉ, số giấy tờ — và <strong>thông tin ẩn danh</strong> như hành vi duyệt web, vốn thường có thể nối ngược lại với một người cụ thể. Các hoạt động đáng lo ngại: <strong>lập hồ sơ (profiling)</strong> (dựng hình ảnh số của người tiêu dùng từ hành vi trực tuyến), <strong>nhắm mục tiêu theo hành vi và nhắm lại</strong>, thu thập qua mạng xã hội và ứng dụng di động (kể cả <strong>dữ liệu vị trí</strong>), và việc cơ quan nhà nước tiếp cận dữ liệu.</p>
<ul>
<li><strong>Opt-in (chủ động đồng ý)</strong> đòi hỏi người tiêu dùng phải có hành động khẳng định trước khi dữ liệu được thu thập hay sử dụng; <strong>opt-out (chủ động từ chối)</strong> nghĩa là dữ liệu được dùng trừ khi người tiêu dùng hành động để dừng lại. Opt-in bảo vệ tốt hơn.</li>
<li><strong>Các nguyên tắc thực hành thông tin công bằng</strong> của FTC (Mỹ): thông báo/nhận biết, lựa chọn/đồng ý, truy cập/tham gia, bảo mật và thực thi. Luật về quyền riêng tư của Mỹ là tấm chắp vá các quy định theo ngành và luật bang, không phải một đạo luật toàn diện.</li>
<li><strong>Quy định chung về bảo vệ dữ liệu (GDPR)</strong> của EU là luật toàn diện: cần căn cứ hợp pháp (thường là sự đồng ý rõ ràng) để xử lý dữ liệu, tối thiểu hoá dữ liệu, quyền truy cập, chỉnh sửa và xoá ("quyền được lãng quên"), quyền mang dữ liệu đi, thông báo khi rò rỉ và mức phạt lớn; áp dụng cả với doanh nghiệp nước ngoài xử lý dữ liệu của cư dân EU.</li>
</ul>
<h3>Liên hệ Việt Nam (kiểm văn bản đang có hiệu lực)</h3>
<p><strong>Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân</strong> của Việt Nam đưa ra một khung chung: phân biệt dữ liệu cá nhân <em>cơ bản</em> với dữ liệu cá nhân <em>nhạy cảm</em> (dữ liệu nhạy cảm như sức khoẻ, vị trí chính xác hay tài chính được bảo vệ chặt hơn); sự đồng ý phải tự nguyện và được thể hiện rõ ràng — im lặng hay không phản hồi không được coi là đồng ý; chủ thể dữ liệu có các quyền như được biết, đồng ý và rút lại sự đồng ý, truy cập, yêu cầu xoá và phản đối xử lý; doanh nghiệp xử lý dữ liệu có các nghĩa vụ, kể cả đánh giá tác động. Sau đó Việt Nam đã ban hành Luật Bảo vệ dữ liệu cá nhân, nâng các quy định này lên tầm luật. Vì lĩnh vực này đang thay đổi, luôn kiểm tra văn bản nào đang có hiệu lực trên cơ sở dữ liệu pháp luật quốc gia trước khi tư vấn cho doanh nghiệp.</p>
<p>Công cụ kỹ thuật cũng giúp cá nhân tự bảo vệ: cài đặt quyền riêng tư, chặn cookie bên thứ ba, duyệt web riêng tư, chặn quảng cáo và nhắn tin mã hoá.</p>
<div class="callout"><span class="badge">Vận dụng</span> Một shop muốn gửi ưu đãi đẩy khi khách đi ngang cửa hàng. Dùng năm bước: dữ kiện (theo dõi vị trí), giá trị (quyền riêng tư và sự tiện lợi), các bên liên quan (khách hàng, shop, nhà cung cấp ứng dụng), phương án (opt-in kèm giải thích rõ; không theo dõi; mặc định theo dõi và cho opt-out), hậu quả. Nguyên tắc né tránh rủi ro và phép thử trang nhất báo đều chỉ về <em>opt-in rõ ràng</em>.</div>`,
  ]]);

const p52 = doc('eec101-5-2-ip-governance-safety', '5.2 — Ch 8 · Intellectual property, governance and public safety|||5.2 — Ch 8 · Sở hữu trí tuệ, quản trị Internet và an toàn công cộng',
  'Bốn loại quyền sở hữu trí tuệ (quyền tác giả, sáng chế, nhãn hiệu, bí mật kinh doanh), sử dụng hợp lý, cơ chế thông báo – gỡ bỏ, chiếm dụng tên miền, liên kết sâu và framing; quản trị Internet, kiểm soát nội dung, thuế, trung lập mạng, chống độc quyền; an toàn và phúc lợi công cộng; tình huống "Big Tech có quá lớn?"; cách viết memo cá nhân đánh giá chiến lược số và đạo đức.',
  [[
    `<span class="eyebrow">EEC101 · Part 5 · Lesson 5.2</span>
<h2>Intellectual property, governance and public safety</h2>
<h3>Intellectual property rights</h3>
<table>
<tr><th>Type</th><th>What it protects</th><th>E-commerce issues</th></tr>
<tr><td>Copyright</td><td>The <em>expression</em> of ideas (texts, images, music, software), not the ideas themselves, for a limited time</td><td>Copying product photos and descriptions; pirated content; <strong>fair use</strong> (US) allows limited uses such as criticism, teaching or news reporting</td></tr>
<tr><td>Patent</td><td>An invention — a new, non-obvious, useful machine, product or process — with an exclusive right for a limited period</td><td>Controversy over patents on software and business methods</td></tr>
<tr><td>Trademark</td><td>Marks, symbols and names that identify goods and distinguish them from competitors</td><td>Counterfeits on marketplaces; <strong>cybersquatting</strong> (registering a domain name that uses someone's trademark in bad faith, to sell it or divert traffic); typosquatting; using competitors' trademarks as ad keywords</td></tr>
<tr><td>Trade secret</td><td>Valuable business information kept confidential (formulas, customer lists, algorithms)</td><td>Leaks by employees or partners; hacking</td></tr>
</table>
<p>Two platform-era issues: <strong>notice-and-takedown</strong> — in the US, the Digital Millennium Copyright Act gives online service providers a "safe harbour" from liability if they remove infringing material promptly after being notified; and <strong>linking, deep linking and framing</strong> — linking to pages deep inside another site, or displaying another site's content inside your own frame, may raise trademark or copyright disputes. In Vietnam, intellectual property is governed by the Law on Intellectual Property (amended several times) — check the current text.</p>
<h3>Governance</h3>
<ul>
<li><strong>Who governs?</strong> The Internet began as a largely self-governing technical system, but today national governments assert control: they filter or block content, require data to be stored locally or demand the removal of unlawful material. Laws differ from country to country, so a single website may be legal in one place and illegal in another.</li>
<li><strong>Taxation.</strong> Tax authorities increasingly expect online sellers and platforms to declare, collect or withhold taxes on online sales, including cross-border digital services — rules change often, so check the current regulations.</li>
<li><strong>Net neutrality</strong> — the principle that Internet service providers should treat all traffic equally, without charging content providers more for faster delivery or blocking some services.</li>
<li><strong>Antitrust and competition</strong> — how to prevent dominant platforms from abusing their position.</li>
</ul>
<h3>Public safety and welfare</h3>
<p>Protecting children (age verification, limits on data collection from minors), restricting online sales of dangerous or regulated goods (tobacco, drugs, weapons) and online gambling, moderating harmful content, fighting <strong>misinformation</strong>, fraud and <strong>fake reviews</strong>. In Vietnam, the Law on Protection of Consumers' Rights (2023) and the rules on e-commerce set duties for platforms and online sellers, such as providing accurate information about goods and sellers and handling complaints — check the texts in force.</p>
<h3>Case: are Big Tech firms "too big"?</h3>
<table>
<tr><th>Arguments for tougher action</th><th>Arguments against</th></tr>
<tr><td>Network effects and data advantages make dominant platforms hard to challenge; they can favour their own products on their platforms (<em>self-preferencing</em>); acquiring young rivals may remove future competition; control over what billions of people see raises political concerns</td><td>Many services are free or cheap for consumers; scale funds innovation and security; markets change fast and today's giants can be displaced; breaking firms up may reduce quality and convenience</td></tr>
</table>
<p>Regulators in several jurisdictions have responded with competition cases and new rules for large "gatekeeper" platforms. The analytical question for managers: how would each option affect small sellers who depend on these platforms?</p>
<h3>Applying this: the individual memo</h3>
<p>The individual assignment is a 500–700-word memo written in 90 minutes, an <em>integrated digital strategy and ethics audit</em>. A reliable structure:</p>
<ol>
<li><strong>Context</strong> (2–3 sentences) — the firm, its product and goal.</li>
<li><strong>Strategy</strong> — how it uses targeting and personalization and social–mobile–local channels (Ch 6–7).</li>
<li><strong>Ethics audit</strong> — the privacy risks, using the five-step analysis and at least two ethical principles; legal points to check (consent, sensitive data, disclosure of paid content).</li>
<li><strong>Recommendations</strong> — three concrete, feasible changes (for example switch to opt-in, minimize data, label sponsored content), each with its expected effect.</li>
</ol>
<div class="callout"><span class="badge">Exam tip</span> Copyright protects the <em>expression</em>, patents protect the <em>invention</em>, trademarks protect the <em>identifying mark</em>. A question that describes a domain name registered in bad faith is about cybersquatting — a trademark issue.</div>`,
    `<span class="eyebrow">EEC101 · Phần 5 · Bài 5.2</span>
<h2>Sở hữu trí tuệ, quản trị Internet và an toàn công cộng</h2>
<h3>Quyền sở hữu trí tuệ</h3>
<table>
<tr><th>Loại</th><th>Bảo hộ gì</th><th>Vấn đề trong TMĐT</th></tr>
<tr><td>Quyền tác giả (copyright)</td><td><em>Hình thức thể hiện</em> của ý tưởng (văn bản, hình ảnh, âm nhạc, phần mềm), không phải bản thân ý tưởng, trong một thời hạn nhất định</td><td>Sao chép ảnh và mô tả sản phẩm; nội dung vi phạm bản quyền; <strong>sử dụng hợp lý (fair use)</strong> (Mỹ) cho phép một số cách dùng hạn chế như phê bình, giảng dạy, đưa tin</td></tr>
<tr><td>Sáng chế (patent)</td><td>Một sáng chế — máy móc, sản phẩm hay quy trình mới, không hiển nhiên, hữu ích — với độc quyền trong thời hạn nhất định</td><td>Tranh cãi về sáng chế cho phần mềm và phương pháp kinh doanh</td></tr>
<tr><td>Nhãn hiệu (trademark)</td><td>Dấu hiệu, biểu tượng, tên gọi dùng để nhận diện hàng hoá và phân biệt với đối thủ</td><td>Hàng giả trên sàn; <strong>chiếm dụng tên miền (cybersquatting)</strong> (đăng ký tên miền chứa nhãn hiệu của người khác với ý đồ xấu, để bán lại hoặc chuyển hướng lưu lượng); đăng ký tên miền gõ nhầm (typosquatting); dùng nhãn hiệu của đối thủ làm từ khoá quảng cáo</td></tr>
<tr><td>Bí mật kinh doanh (trade secret)</td><td>Thông tin kinh doanh có giá trị được giữ bí mật (công thức, danh sách khách hàng, thuật toán)</td><td>Rò rỉ qua nhân viên hoặc đối tác; bị tấn công mạng</td></tr>
</table>
<p>Hai vấn đề của thời đại nền tảng: <strong>thông báo – gỡ bỏ (notice-and-takedown)</strong> — ở Mỹ, Đạo luật Bản quyền Thiên niên kỷ Kỹ thuật số (DMCA) cho nhà cung cấp dịch vụ trực tuyến một "bến an toàn" miễn trách nhiệm nếu gỡ nội dung vi phạm kịp thời sau khi được thông báo; và <strong>liên kết, liên kết sâu và đóng khung (framing)</strong> — liên kết tới trang nằm sâu trong website khác, hoặc hiển thị nội dung của website khác trong khung của mình, có thể gây tranh chấp về nhãn hiệu hay quyền tác giả. Ở Việt Nam, sở hữu trí tuệ được điều chỉnh bởi Luật Sở hữu trí tuệ (đã sửa đổi nhiều lần) — hãy kiểm văn bản hiện hành.</p>
<h3>Quản trị Internet</h3>
<ul>
<li><strong>Ai quản trị?</strong> Internet khởi đầu như một hệ thống kỹ thuật phần lớn tự quản, nhưng nay chính phủ các nước khẳng định quyền kiểm soát: lọc hoặc chặn nội dung, yêu cầu lưu trữ dữ liệu trong nước hay buộc gỡ nội dung trái pháp luật. Luật mỗi nước một khác, nên cùng một website có thể hợp pháp ở nơi này và bất hợp pháp ở nơi khác.</li>
<li><strong>Thuế.</strong> Cơ quan thuế ngày càng yêu cầu người bán trực tuyến và nền tảng kê khai, thu hộ hoặc khấu trừ thuế trên doanh số trực tuyến, kể cả dịch vụ số xuyên biên giới — quy định thay đổi thường xuyên, hãy kiểm quy định hiện hành.</li>
<li><strong>Trung lập mạng (net neutrality)</strong> — nguyên tắc nhà cung cấp dịch vụ Internet phải đối xử bình đẳng với mọi lưu lượng, không thu thêm tiền của nhà cung cấp nội dung để truyền nhanh hơn hay chặn một số dịch vụ.</li>
<li><strong>Chống độc quyền và cạnh tranh</strong> — làm sao ngăn nền tảng thống lĩnh lạm dụng vị thế.</li>
</ul>
<h3>An toàn và phúc lợi công cộng</h3>
<p>Bảo vệ trẻ em (xác minh độ tuổi, hạn chế thu thập dữ liệu của trẻ vị thành niên), hạn chế bán trực tuyến hàng nguy hiểm hay hàng bị kiểm soát (thuốc lá, thuốc, vũ khí) và cờ bạc trực tuyến, kiểm duyệt nội dung có hại, chống <strong>thông tin sai lệch</strong>, lừa đảo và <strong>đánh giá giả</strong>. Ở Việt Nam, Luật Bảo vệ quyền lợi người tiêu dùng (2023) và các quy định về TMĐT đặt ra nghĩa vụ cho nền tảng và người bán trực tuyến, như cung cấp thông tin chính xác về hàng hoá và người bán, giải quyết khiếu nại — hãy kiểm văn bản đang có hiệu lực.</p>
<h3>Tình huống: các công ty Big Tech có "quá lớn"?</h3>
<table>
<tr><th>Lập luận ủng hộ can thiệp mạnh hơn</th><th>Lập luận phản đối</th></tr>
<tr><td>Hiệu ứng mạng và lợi thế dữ liệu khiến nền tảng thống lĩnh rất khó bị thách thức; họ có thể ưu tiên sản phẩm của chính mình trên nền tảng (<em>tự ưu tiên</em>); thâu tóm đối thủ non trẻ có thể triệt tiêu cạnh tranh tương lai; quyền kiểm soát những gì hàng tỷ người nhìn thấy làm dấy lên lo ngại chính trị</td><td>Nhiều dịch vụ miễn phí hoặc rẻ cho người tiêu dùng; quy mô lớn tài trợ cho đổi mới và bảo mật; thị trường thay đổi nhanh và gã khổng lồ hôm nay có thể bị thay thế; chia tách doanh nghiệp có thể làm giảm chất lượng và sự tiện lợi</td></tr>
</table>
<p>Cơ quan quản lý ở nhiều nơi đã phản ứng bằng các vụ kiện cạnh tranh và quy định mới cho các nền tảng "gác cổng" lớn. Câu hỏi phân tích cho nhà quản lý: mỗi phương án sẽ ảnh hưởng thế nào tới những người bán nhỏ đang phụ thuộc vào các nền tảng này?</p>
<h3>Vận dụng: memo cá nhân</h3>
<p>Bài cá nhân là một memo 500–700 từ viết trong 90 phút, <em>chiến lược số tích hợp và đánh giá đạo đức</em>. Một cấu trúc chắc chắn:</p>
<ol>
<li><strong>Bối cảnh</strong> (2–3 câu) — doanh nghiệp, sản phẩm và mục tiêu.</li>
<li><strong>Chiến lược</strong> — doanh nghiệp dùng nhắm mục tiêu, cá nhân hoá và các kênh xã hội – di động – địa phương thế nào (Ch 6–7).</li>
<li><strong>Đánh giá đạo đức</strong> — các rủi ro về quyền riêng tư, dùng năm bước phân tích và ít nhất hai nguyên tắc đạo đức; các điểm pháp lý cần kiểm (sự đồng ý, dữ liệu nhạy cảm, công khai nội dung có trả phí).</li>
<li><strong>Khuyến nghị</strong> — ba thay đổi cụ thể, khả thi (ví dụ chuyển sang opt-in, tối thiểu hoá dữ liệu, gắn nhãn nội dung tài trợ), mỗi thay đổi kèm tác động dự kiến.</li>
</ol>
<div class="callout"><span class="badge">Mẹo thi</span> Quyền tác giả bảo hộ <em>hình thức thể hiện</em>, sáng chế bảo hộ <em>giải pháp kỹ thuật</em>, nhãn hiệu bảo hộ <em>dấu hiệu nhận diện</em>. Câu hỏi mô tả một tên miền đăng ký với ý đồ xấu là nói về chiếm dụng tên miền — một vấn đề nhãn hiệu.</div>`,
  ]]);

const p5q = quiz('eec101-quiz-5', 'Quiz 5 — Ch 8: ethics and law|||Quiz 5 — Ch 8: đạo đức và pháp luật', [
  { id: 'q1', question: 'A shop only collects a customer’s location data after the customer ticks a box that clearly explains the purpose. This approach is called…|||Một shop chỉ thu dữ liệu vị trí của khách sau khi khách đánh dấu vào ô giải thích rõ mục đích. Cách làm này gọi là…', options: ['opt-out|||opt-out (chủ động từ chối)', 'opt-in|||opt-in (chủ động đồng ý)', 'profiling|||lập hồ sơ', 'fair use|||sử dụng hợp lý'], correctIndex: 1, explanation: 'Opt-in requires an affirmative action by the consumer before data are collected; under opt-out, data are used unless the consumer acts to stop it.|||Opt-in đòi hỏi người tiêu dùng hành động khẳng định trước khi dữ liệu được thu; với opt-out, dữ liệu được dùng trừ khi người tiêu dùng hành động để dừng.' },
  { id: 'q2', question: 'Someone registers a domain name containing a famous brand name in bad faith, hoping to sell it to the brand owner. This is…|||Một người đăng ký tên miền chứa tên một thương hiệu nổi tiếng với ý đồ xấu, mong bán lại cho chủ thương hiệu. Đây là…', options: ['cybersquatting|||chiếm dụng tên miền (cybersquatting)', 'framing|||đóng khung (framing)', 'a trade secret violation|||vi phạm bí mật kinh doanh', 'net neutrality|||trung lập mạng'], correctIndex: 0, explanation: 'Cybersquatting is a trademark issue: using another’s mark in a domain name in bad faith.|||Chiếm dụng tên miền là vấn đề nhãn hiệu: dùng nhãn hiệu của người khác trong tên miền với ý đồ xấu.' },
  { id: 'q3', question: 'Which ethical principle says: take the action that produces the least harm or the least potential cost?|||Nguyên tắc đạo đức nào nói: chọn hành động gây ít tổn hại nhất hoặc ít chi phí tiềm tàng nhất?', options: ['The Golden Rule|||Quy tắc vàng', 'The slippery slope|||Dốc trượt', 'Collective utilitarian principle|||Nguyên tắc vị lợi tập thể', 'Risk aversion|||Né tránh rủi ro'], correctIndex: 3, explanation: 'Risk aversion minimizes harm and potential cost; the utilitarian principle maximizes value for society as a whole.|||Né tránh rủi ro giảm thiểu tổn hại và chi phí tiềm tàng; nguyên tắc vị lợi tập thể tối đa hoá giá trị cho toàn xã hội.' },
]);

const p61 = doc('eec101-6-1-retail-viability', '6.1 — Ch 9 · Viability analysis and online retail models|||6.1 — Ch 9 · Phân tích tính khả thi và mô hình bán lẻ trực tuyến',
  'Phân tích tính khả thi của doanh nghiệp trực tuyến: phân tích chiến lược (rào cản gia nhập, quyền lực nhà cung cấp và khách hàng, sản phẩm thay thế, chuỗi giá trị, năng lực cốt lõi) và phân tích tài chính (biên gộp, biên hoạt động, biên ròng, vốn lưu động) có ví dụ số; ngành bán lẻ ngoại tuyến và trực tuyến; bốn mô hình bán lẻ trực tuyến và thách thức của từng mô hình.',
  [[
    `<span class="eyebrow">EEC101 · Part 6 · Lesson 6.1</span>
<h2>Viability analysis and online retail models</h2>
<h3>Is this online business viable? Two analyses</h3>
<p>The textbook assesses the viability of an online firm — its ability to survive and prosper — with a <strong>strategic analysis</strong> and a <strong>financial analysis</strong>.</p>
<table>
<tr><th>Strategic analysis looks at</th><th>Question</th></tr>
<tr><td>Barriers to entry</td><td>Can new competitors enter easily (low capital, no licences)?</td></tr>
<tr><td>Power of suppliers and of customers</td><td>Can suppliers raise prices? Can customers switch at no cost?</td></tr>
<tr><td>Substitutes</td><td>What else satisfies the same need?</td></tr>
<tr><td>Industry value chain and nature of competition</td><td>Where does the firm sit, and is competition based on price, quality or service?</td></tr>
<tr><td>Firm value chain, core competencies, synergies</td><td>What does the firm do better than others, and do its businesses reinforce each other?</td></tr>
<tr><td>Technology, social and legal challenges</td><td>Does it have the technology to scale? Are there legal risks (tax, product safety, privacy)?</td></tr>
</table>
<p>The financial analysis reads the income statement and balance sheet:</p>
<pre><code>Fictional online retailer, one year (illustrative, VND billion)
Revenue                          120
Cost of sales                    (84)
Gross profit                      36    gross margin      36 / 120 = 30%
Operating expenses               (33)   marketing 15, technology 8, general 10
Operating income                   3    operating margin   3 / 120 = 2.5%
Interest and tax                  (1)
Net income                         2    net margin         2 / 120 ≈ 1.7%
Balance sheet check: current assets − current liabilities = working capital</code></pre>
<p>Revenue growth is not enough: what matters is whether gross margin covers operating expenses as the firm grows. Marketing is often the largest operating expense for an online retailer — which is why customer acquisition cost is central (Exercise 3). Working capital shows whether the firm can pay its short-term bills.</p>
<h3>The retail industry, offline and online</h3>
<p>Retail is a very large, highly competitive industry with low margins. Early visions of online retail promised huge savings from disintermediation and unlimited reach; in reality, customer acquisition, delivery and returns proved costly, and many pure online retailers failed. Today the dominant pattern is <strong>omnichannel</strong>: customers move freely between stores, websites, apps and social media, and expect the same prices, stock and service everywhere.</p>
<h3>Online retail business models</h3>
<table>
<tr><th>Model</th><th>Description</th><th>Main challenges</th></tr>
<tr><td>Virtual merchant</td><td>Single-channel firm that earns all its revenue online</td><td>Building a brand from zero; high marketing costs; thin margins; logistics and returns</td></tr>
<tr><td>Omnichannel merchant (bricks-and-clicks)</td><td>A retailer with physical stores that also sells online</td><td>Integrating stock, prices and data across channels; avoiding channel conflict; changing store culture</td></tr>
<tr><td>Catalog merchant</td><td>Firm that sold by printed catalog and moved online</td><td>Replacing catalog costs with online marketing; competing with pure online players</td></tr>
<tr><td>Manufacturer-direct (direct-to-consumer)</td><td>A manufacturer sells directly to consumers online, bypassing retailers</td><td><strong>Channel conflict</strong> with existing retailers; building consumer-facing marketing and service skills; handling small orders</td></tr>
</table>
<h3>Common themes of success</h3>
<ul>
<li>Efficient fulfilment and returns — logistics is where many online retailers win or lose.</li>
<li>Low customer acquisition cost relative to customer value (repeat purchases).</li>
<li>Rich, trustworthy product information and reviews; easy checkout on mobile.</li>
<li>Personalization and data used to manage assortment, pricing and inventory.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Online retail is not a cheap way to sell; it is a <em>different cost structure</em>. Rent and store staff are replaced by marketing, technology, delivery and returns — and those costs can be just as high.</div>`,
    `<span class="eyebrow">EEC101 · Phần 6 · Bài 6.1</span>
<h2>Phân tích tính khả thi và mô hình bán lẻ trực tuyến</h2>
<h3>Doanh nghiệp trực tuyến này có khả thi không? Hai phép phân tích</h3>
<p>Giáo trình đánh giá tính khả thi của một doanh nghiệp trực tuyến — khả năng tồn tại và phát triển — bằng <strong>phân tích chiến lược</strong> và <strong>phân tích tài chính</strong>.</p>
<table>
<tr><th>Phân tích chiến lược xem xét</th><th>Câu hỏi</th></tr>
<tr><td>Rào cản gia nhập</td><td>Đối thủ mới có dễ gia nhập không (ít vốn, không cần giấy phép)?</td></tr>
<tr><td>Quyền lực của nhà cung cấp và khách hàng</td><td>Nhà cung cấp có thể tăng giá không? Khách có thể chuyển sang nơi khác mà không tốn gì không?</td></tr>
<tr><td>Sản phẩm thay thế</td><td>Còn gì khác đáp ứng cùng nhu cầu?</td></tr>
<tr><td>Chuỗi giá trị ngành và bản chất cạnh tranh</td><td>Doanh nghiệp đứng ở đâu, và cạnh tranh dựa trên giá, chất lượng hay dịch vụ?</td></tr>
<tr><td>Chuỗi giá trị doanh nghiệp, năng lực cốt lõi, cộng hưởng</td><td>Doanh nghiệp làm gì tốt hơn người khác, và các mảng kinh doanh có hỗ trợ lẫn nhau không?</td></tr>
<tr><td>Thách thức công nghệ, xã hội và pháp lý</td><td>Có đủ công nghệ để mở rộng không? Có rủi ro pháp lý không (thuế, an toàn sản phẩm, quyền riêng tư)?</td></tr>
</table>
<p>Phân tích tài chính đọc báo cáo kết quả kinh doanh và bảng cân đối kế toán:</p>
<pre><code>Nhà bán lẻ trực tuyến giả định, một năm (số liệu minh hoạ, tỷ đồng)
Doanh thu                        120
Giá vốn hàng bán                 (84)
Lợi nhuận gộp                     36    biên gộp          36 / 120 = 30%
Chi phí hoạt động                (33)   marketing 15, công nghệ 8, quản lý chung 10
Lợi nhuận hoạt động                3    biên hoạt động     3 / 120 = 2,5%
Lãi vay và thuế                   (1)
Lợi nhuận ròng                     2    biên ròng          2 / 120 ≈ 1,7%
Kiểm bảng cân đối: tài sản ngắn hạn − nợ ngắn hạn = vốn lưu động</code></pre>
<p>Tăng trưởng doanh thu là chưa đủ: điều quan trọng là lợi nhuận gộp có trang trải được chi phí hoạt động khi doanh nghiệp lớn lên hay không. Marketing thường là chi phí hoạt động lớn nhất của nhà bán lẻ trực tuyến — vì thế chi phí thu hút khách hàng là trung tâm (Bài tập 3). Vốn lưu động cho biết doanh nghiệp có trả được các khoản phải trả ngắn hạn không.</p>
<h3>Ngành bán lẻ, ngoại tuyến và trực tuyến</h3>
<p>Bán lẻ là ngành rất lớn, cạnh tranh gay gắt và biên lợi nhuận thấp. Những viễn cảnh ban đầu về bán lẻ trực tuyến hứa hẹn tiết kiệm lớn nhờ loại bỏ trung gian và tầm với vô hạn; thực tế, chi phí thu hút khách, giao hàng và đổi trả rất tốn kém, và nhiều nhà bán lẻ thuần trực tuyến đã thất bại. Ngày nay mô hình chủ đạo là <strong>đa kênh hợp nhất (omnichannel)</strong>: khách hàng di chuyển tự do giữa cửa hàng, website, ứng dụng và mạng xã hội, và kỳ vọng giá, tồn kho, dịch vụ như nhau ở mọi nơi.</p>
<h3>Các mô hình kinh doanh bán lẻ trực tuyến</h3>
<table>
<tr><th>Mô hình</th><th>Mô tả</th><th>Thách thức chính</th></tr>
<tr><td>Nhà bán lẻ thuần trực tuyến (virtual merchant)</td><td>Doanh nghiệp một kênh, toàn bộ doanh thu đến từ trực tuyến</td><td>Xây thương hiệu từ con số không; chi phí marketing cao; biên lợi nhuận mỏng; logistics và đổi trả</td></tr>
<tr><td>Nhà bán lẻ đa kênh (bricks-and-clicks)</td><td>Nhà bán lẻ có cửa hàng thật đồng thời bán trực tuyến</td><td>Hợp nhất tồn kho, giá và dữ liệu giữa các kênh; tránh xung đột kênh; thay đổi văn hoá cửa hàng</td></tr>
<tr><td>Nhà bán hàng qua catalog</td><td>Doanh nghiệp từng bán qua catalog in và chuyển lên trực tuyến</td><td>Thay chi phí catalog bằng marketing trực tuyến; cạnh tranh với doanh nghiệp thuần trực tuyến</td></tr>
<tr><td>Nhà sản xuất bán trực tiếp (direct-to-consumer)</td><td>Nhà sản xuất bán thẳng cho người tiêu dùng qua mạng, bỏ qua nhà bán lẻ</td><td><strong>Xung đột kênh</strong> với nhà bán lẻ hiện có; xây kỹ năng marketing và dịch vụ hướng tới người tiêu dùng; xử lý đơn hàng nhỏ lẻ</td></tr>
</table>
<h3>Những điểm chung của thành công</h3>
<ul>
<li>Hoàn tất đơn hàng và đổi trả hiệu quả — logistics là nơi nhiều nhà bán lẻ trực tuyến thắng hoặc thua.</li>
<li>Chi phí thu hút khách thấp so với giá trị khách hàng mang lại (mua lặp lại).</li>
<li>Thông tin sản phẩm và đánh giá phong phú, đáng tin; thanh toán dễ trên di động.</li>
<li>Cá nhân hoá và dữ liệu được dùng để quản lý danh mục hàng, giá và tồn kho.</li>
</ul>
<div class="callout"><span class="badge">Ý then chốt</span> Bán lẻ trực tuyến không phải cách bán hàng rẻ; nó là một <em>cơ cấu chi phí khác</em>. Tiền thuê mặt bằng và nhân viên cửa hàng được thay bằng marketing, công nghệ, giao hàng và đổi trả — và các chi phí đó có thể cao không kém.</div>`,
  ]]);

const p62 = doc('eec101-6-2-online-services', '6.2 — Ch 9 · Online services: finance, travel, careers, on-demand|||6.2 — Ch 9 · Dịch vụ trực tuyến: tài chính, du lịch, tuyển dụng, theo yêu cầu',
  'Ngành dịch vụ ngoại tuyến và trực tuyến (dịch vụ môi giới giao dịch và dịch vụ trực tiếp), dịch vụ tài chính trực tuyến và fintech (ngân hàng, môi giới, bảo hiểm, bất động sản), du lịch trực tuyến, tuyển dụng trực tuyến, các công ty dịch vụ theo yêu cầu (kinh tế chia sẻ) cùng lợi ích và vấn đề: niềm tin, an toàn, quy định, quyền lợi người lao động.',
  [[
    `<span class="eyebrow">EEC101 · Part 6 · Lesson 6.2</span>
<h2>Online services: finance, travel, careers, on-demand</h2>
<h3>Why services move online so easily</h3>
<p>Services are <strong>knowledge- and information-intensive</strong>: much of their value is information (a price, a schedule, a balance, a match between a job and a candidate). The textbook distinguishes <strong>transaction brokering</strong> services (the firm acts as an intermediary that facilitates a transaction — travel booking, stock trading) from <strong>hands-on</strong> services (a professional or worker must act directly — a doctor, a driver, a cleaner). The first kind can be fully delivered online; the second can be <em>arranged</em> online.</p>
<h3>Online financial services</h3>
<ul>
<li><strong>Fintech</strong> firms use technology to offer financial services, often competing with or partnering with banks: digital banking, payments and wallets, lending, personal finance tools.</li>
<li><strong>Online banking and brokerage</strong> — customers open accounts, transfer money and trade securities from apps; the key assets are trust, security and regulation.</li>
<li><strong>Insurance</strong> — comparison sites and direct online sales of simple policies; complex products still involve advice.</li>
<li><strong>Real estate</strong> — listings, virtual tours and price information online; the transaction itself usually remains hands-on.</li>
</ul>
<h3>Online travel services</h3>
<p>Travel suits e-commerce because it is information-rich, compared on price, and needs no physical delivery. Players include <strong>online travel agencies</strong> (booking flights, hotels and packages and earning commissions or margins), <strong>suppliers selling direct</strong> (airlines and hotels pushing their own sites to avoid commissions) and <strong>metasearch</strong> sites that compare prices across many sellers. Reviews and user photos strongly influence choices — and fake reviews are a real risk.</p>
<h3>Online career services</h3>
<p>Job boards and recruitment platforms reduce search costs for both sides: employers reach many candidates cheaply; job seekers see many openings and can apply instantly. Revenue comes from employers (listing fees, subscriptions, access to candidate databases) and sometimes from premium candidate services. Algorithms and AI screening speed up matching, but raise questions of fairness and bias in hiring.</p>
<h3>On-demand service companies</h3>
<p>On-demand service firms — sometimes called the <strong>sharing economy</strong> — use platforms and mobile apps to match people who need a service (a ride, a meal delivered, a room for a night, a repair) with independent providers who offer it, often using their own assets (cars, homes, time). The platform earns a fee or commission on each transaction.</p>
<table>
<tr><th>Benefits</th><th>Problems</th></tr>
<tr><td>Consumers: convenience, lower prices, more choice. Providers: flexible income, use of idle assets. Platforms: scale with few assets of their own</td><td>Trust and safety (ratings help but are imperfect); status and protection of workers (employees or independent contractors?); competition with regulated industries (taxis, hotels); local effects (traffic, housing); privacy of location data</td></tr>
</table>
<div class="callout"><span class="badge">Pattern</span> Every successful online service business removes an information problem: it makes prices visible, matches supply and demand faster, or builds trust between strangers through ratings and guarantees.</div>`,
    `<span class="eyebrow">EEC101 · Phần 6 · Bài 6.2</span>
<h2>Dịch vụ trực tuyến: tài chính, du lịch, tuyển dụng, theo yêu cầu</h2>
<h3>Vì sao dịch vụ lên mạng dễ đến vậy</h3>
<p>Dịch vụ <strong>thâm dụng tri thức và thông tin</strong>: phần lớn giá trị của chúng là thông tin (một mức giá, một lịch trình, một số dư, một sự ghép nối giữa việc làm và ứng viên). Giáo trình phân biệt dịch vụ <strong>môi giới giao dịch</strong> (doanh nghiệp làm trung gian tạo điều kiện cho giao dịch — đặt vé du lịch, giao dịch chứng khoán) với dịch vụ <strong>trực tiếp</strong> (một chuyên gia hay người lao động phải trực tiếp làm — bác sĩ, tài xế, người dọn dẹp). Loại thứ nhất có thể cung cấp hoàn toàn qua mạng; loại thứ hai có thể được <em>sắp xếp</em> qua mạng.</p>
<h3>Dịch vụ tài chính trực tuyến</h3>
<ul>
<li>Doanh nghiệp <strong>fintech</strong> dùng công nghệ để cung cấp dịch vụ tài chính, thường cạnh tranh hoặc hợp tác với ngân hàng: ngân hàng số, thanh toán và ví, cho vay, công cụ quản lý tài chính cá nhân.</li>
<li><strong>Ngân hàng và môi giới trực tuyến</strong> — khách mở tài khoản, chuyển tiền và giao dịch chứng khoán trên ứng dụng; tài sản then chốt là niềm tin, bảo mật và sự quản lý của nhà nước.</li>
<li><strong>Bảo hiểm</strong> — trang so sánh và bán trực tuyến trực tiếp các hợp đồng đơn giản; sản phẩm phức tạp vẫn cần tư vấn.</li>
<li><strong>Bất động sản</strong> — tin đăng, tham quan ảo và thông tin giá trên mạng; bản thân giao dịch thường vẫn diễn ra trực tiếp.</li>
</ul>
<h3>Dịch vụ du lịch trực tuyến</h3>
<p>Du lịch rất hợp với TMĐT vì giàu thông tin, được so sánh theo giá và không cần giao hàng vật lý. Các bên tham gia gồm <strong>đại lý du lịch trực tuyến</strong> (đặt vé máy bay, khách sạn, tour trọn gói và hưởng hoa hồng hoặc chênh lệch), <strong>nhà cung cấp bán trực tiếp</strong> (hãng hàng không, khách sạn đẩy khách về website riêng để tránh hoa hồng) và các trang <strong>tìm kiếm tổng hợp (metasearch)</strong> so sánh giá của nhiều người bán. Đánh giá và ảnh của người dùng ảnh hưởng mạnh tới lựa chọn — và đánh giá giả là một rủi ro có thật.</p>
<h3>Dịch vụ tuyển dụng trực tuyến</h3>
<p>Trang việc làm và nền tảng tuyển dụng giảm chi phí tìm kiếm cho cả hai phía: nhà tuyển dụng tiếp cận nhiều ứng viên với chi phí thấp; người tìm việc thấy nhiều vị trí và ứng tuyển ngay. Doanh thu đến từ nhà tuyển dụng (phí đăng tin, thuê bao, quyền truy cập cơ sở dữ liệu ứng viên) và đôi khi từ dịch vụ cao cấp cho ứng viên. Thuật toán và AI sàng lọc giúp ghép nối nhanh hơn, nhưng đặt ra câu hỏi về công bằng và thiên kiến trong tuyển dụng.</p>
<h3>Các công ty dịch vụ theo yêu cầu</h3>
<p>Doanh nghiệp dịch vụ theo yêu cầu — đôi khi gọi là <strong>kinh tế chia sẻ</strong> — dùng nền tảng và ứng dụng di động để ghép người cần dịch vụ (một chuyến xe, một bữa ăn giao tận nơi, một phòng nghỉ qua đêm, một lần sửa chữa) với người cung cấp độc lập, thường dùng tài sản của chính họ (xe, nhà, thời gian). Nền tảng thu phí hoặc hoa hồng trên mỗi giao dịch.</p>
<table>
<tr><th>Lợi ích</th><th>Vấn đề</th></tr>
<tr><td>Người tiêu dùng: tiện lợi, giá thấp hơn, nhiều lựa chọn hơn. Người cung cấp: thu nhập linh hoạt, tận dụng tài sản nhàn rỗi. Nền tảng: mở rộng quy mô mà sở hữu ít tài sản</td><td>Niềm tin và an toàn (chấm điểm có ích nhưng không hoàn hảo); địa vị và sự bảo vệ người lao động (nhân viên hay nhà thầu độc lập?); cạnh tranh với các ngành chịu quản lý (taxi, khách sạn); tác động địa phương (giao thông, nhà ở); quyền riêng tư của dữ liệu vị trí</td></tr>
</table>
<div class="callout"><span class="badge">Quy luật</span> Mọi doanh nghiệp dịch vụ trực tuyến thành công đều gỡ bỏ một vấn đề thông tin: làm giá cả minh bạch, ghép cung với cầu nhanh hơn, hoặc tạo niềm tin giữa những người lạ bằng điểm đánh giá và cam kết bảo đảm.</div>`,
  ]]);

const p63 = doc('eec101-6-3-online-media', '6.3 — Ch 10 · Online media: content, publishing, entertainment, creators|||6.3 — Ch 10 · Truyền thông trực tuyến: nội dung, xuất bản, giải trí, nhà sáng tạo',
  'Nội dung trực tuyến: miễn phí hay trả phí, hội tụ truyền thông (công nghệ, nội dung, ngành), mô hình doanh thu nội dung, quản lý quyền số (DRM) và khu vườn có tường bao; xuất bản trực tuyến (báo, sách điện tử với mô hình bán sỉ và mô hình đại lý, tạp chí); giải trí trực tuyến (truyền hình và video, phim, âm nhạc, trò chơi); nền kinh tế nhà sáng tạo và nội dung do người dùng tạo.',
  [[
    `<span class="eyebrow">EEC101 · Part 6 · Lesson 6.3</span>
<h2>Online media: content, publishing, entertainment, creators</h2>
<h3>Online content: the big questions</h3>
<ul>
<li><strong>Free or fee?</strong> Consumers are used to free content, yet producing quality content is expensive. Publishers mix advertising with paid access.</li>
<li><strong>Media convergence</strong> has three forms: <em>technological</em> (one device — the phone — plays text, audio and video), <em>content</em> (the same story is designed, produced and distributed across many formats) and <em>industry</em> (media, telecom and technology firms merge or compete in each other's markets).</li>
<li><strong>Revenue models</strong> for content: advertising, subscription, pay-per-view or per download, and freemium tiers.</li>
<li><strong>Digital rights management (DRM)</strong> — technology that controls how digital content can be copied and used; a <strong>walled garden</strong> is an ecosystem where content bought on one platform works only on that platform's devices and apps.</li>
</ul>
<h3>Online publishing</h3>
<table>
<tr><th>Segment</th><th>Key points</th></tr>
<tr><td>Newspapers</td><td>Print advertising declined as readers moved online; models include free ad-supported sites, <strong>hard paywalls</strong> (subscribe to read) and <strong>metered or freemium</strong> paywalls (some free articles, then pay); platforms and search engines control much of the traffic</td></tr>
<tr><td>E-books</td><td>Under the <strong>wholesale model</strong>, the retailer buys from the publisher at a wholesale price and sets the retail price; under the <strong>agency model</strong>, the publisher sets the retail price and the retailer acts as an agent earning a commission. Self-publishing lets authors sell directly through platforms</td></tr>
<tr><td>Magazines</td><td>Digital editions, apps and subscription bundles; strong niche and special-interest communities</td></tr>
</table>
<h3>Online entertainment</h3>
<ul>
<li><strong>Television and premium video</strong> — streaming services delivered "over the top" of the Internet, with subscription and ad-supported tiers; many viewers cut or never buy traditional pay-TV.</li>
<li><strong>Movies</strong> — digital rental and purchase, and premieres on streaming services alongside cinema windows.</li>
<li><strong>Music</strong> — streaming has replaced downloads and physical sales as the main format; the debate is over how fairly royalties are shared with artists.</li>
<li><strong>Games</strong> — mobile, console and PC games, free-to-play with in-game purchases, and e-sports as a spectator entertainment.</li>
</ul>
<h3>Creators and user-generated content</h3>
<p>The <strong>creator economy</strong> is made up of individuals who build audiences on platforms and earn money from them. Their revenue streams: a share of platform advertising revenue, subscriptions and memberships, tips and virtual gifts, brand deals and affiliate links, merchandise, and — increasingly — selling products through livestreams and in-platform shops. <strong>User-generated content</strong> (reviews, videos, posts by ordinary users) is both a free source of content for platforms and a powerful influence on buying decisions.</p>
<table>
<tr><th>Opportunities for brands and creators</th><th>Risks</th></tr>
<tr><td>Authentic reach to niche audiences; content that sells; low entry cost</td><td>Dependence on platform algorithms and rules; copyright infringement in remixes; undisclosed paid promotion; misinformation; creator burnout</td></tr>
</table>
<div class="callout"><span class="badge">Connect</span> Media firms face the same question as retailers in lesson 6.1: can revenue per user cover the cost of acquiring and serving that user? For content, the costs are production and rights; the levers are subscriptions, advertising and bundling.</div>`,
    `<span class="eyebrow">EEC101 · Phần 6 · Bài 6.3</span>
<h2>Truyền thông trực tuyến: nội dung, xuất bản, giải trí, nhà sáng tạo</h2>
<h3>Nội dung trực tuyến: những câu hỏi lớn</h3>
<ul>
<li><strong>Miễn phí hay trả phí?</strong> Người tiêu dùng đã quen với nội dung miễn phí, trong khi làm nội dung chất lượng rất tốn kém. Nhà xuất bản kết hợp quảng cáo với truy cập trả phí.</li>
<li><strong>Hội tụ truyền thông</strong> có ba dạng: <em>công nghệ</em> (một thiết bị — điện thoại — phát được chữ, âm thanh và video), <em>nội dung</em> (cùng một câu chuyện được thiết kế, sản xuất và phân phối qua nhiều định dạng) và <em>ngành</em> (doanh nghiệp truyền thông, viễn thông và công nghệ sáp nhập hoặc cạnh tranh trên thị trường của nhau).</li>
<li><strong>Mô hình doanh thu</strong> của nội dung: quảng cáo, thuê bao, trả theo lượt xem hoặc lượt tải, và các gói freemium.</li>
<li><strong>Quản lý quyền số (DRM)</strong> — công nghệ kiểm soát việc nội dung số được sao chép và sử dụng thế nào; <strong>khu vườn có tường bao (walled garden)</strong> là hệ sinh thái mà nội dung mua trên một nền tảng chỉ dùng được trên thiết bị và ứng dụng của nền tảng đó.</li>
</ul>
<h3>Xuất bản trực tuyến</h3>
<table>
<tr><th>Mảng</th><th>Điểm chính</th></tr>
<tr><td>Báo chí</td><td>Quảng cáo trên báo in giảm khi độc giả chuyển lên mạng; các mô hình gồm trang miễn phí sống bằng quảng cáo, <strong>tường phí cứng</strong> (phải đăng ký mới được đọc) và tường phí <strong>theo hạn mức hoặc freemium</strong> (được đọc miễn phí một số bài, sau đó trả phí); nền tảng và công cụ tìm kiếm nắm phần lớn lưu lượng truy cập</td></tr>
<tr><td>Sách điện tử</td><td>Theo <strong>mô hình bán sỉ</strong>, nhà bán lẻ mua của nhà xuất bản theo giá sỉ và tự đặt giá bán lẻ; theo <strong>mô hình đại lý</strong>, nhà xuất bản đặt giá bán lẻ và nhà bán lẻ làm đại lý hưởng hoa hồng. Tự xuất bản cho phép tác giả bán trực tiếp qua các nền tảng</td></tr>
<tr><td>Tạp chí</td><td>Ấn bản số, ứng dụng và gói thuê bao; cộng đồng ngách và chuyên đề mạnh</td></tr>
</table>
<h3>Giải trí trực tuyến</h3>
<ul>
<li><strong>Truyền hình và video cao cấp</strong> — dịch vụ phát trực tuyến truyền "vượt trên" Internet (OTT), với gói thuê bao và gói có quảng cáo; nhiều người xem cắt bỏ hoặc chưa từng mua truyền hình trả tiền truyền thống.</li>
<li><strong>Phim</strong> — thuê và mua bản số, và công chiếu trên dịch vụ phát trực tuyến song song với khung chiếu rạp.</li>
<li><strong>Âm nhạc</strong> — phát trực tuyến đã thay tải về và đĩa vật lý thành định dạng chính; tranh luận xoay quanh việc chia tiền bản quyền cho nghệ sĩ có công bằng không.</li>
<li><strong>Trò chơi</strong> — game di động, console và PC, chơi miễn phí có mua vật phẩm trong game, và thể thao điện tử như một loại hình giải trí để xem.</li>
</ul>
<h3>Nhà sáng tạo và nội dung do người dùng tạo</h3>
<p><strong>Nền kinh tế nhà sáng tạo</strong> gồm những cá nhân xây dựng khán giả trên các nền tảng và kiếm tiền từ đó. Nguồn thu của họ: phần chia doanh thu quảng cáo của nền tảng, thuê bao và hội viên, tiền ủng hộ và quà tặng ảo, hợp đồng với nhãn hàng và đường dẫn liên kết, bán hàng lưu niệm, và — ngày càng nhiều — bán sản phẩm qua livestream và cửa hàng trong nền tảng. <strong>Nội dung do người dùng tạo</strong> (đánh giá, video, bài đăng của người dùng bình thường) vừa là nguồn nội dung miễn phí cho nền tảng, vừa ảnh hưởng mạnh tới quyết định mua.</p>
<table>
<tr><th>Cơ hội cho thương hiệu và nhà sáng tạo</th><th>Rủi ro</th></tr>
<tr><td>Tiếp cận chân thực tới khán giả ngách; nội dung bán được hàng; chi phí gia nhập thấp</td><td>Phụ thuộc vào thuật toán và quy định của nền tảng; vi phạm bản quyền khi phối lại nội dung; quảng bá có trả phí mà không công khai; thông tin sai lệch; nhà sáng tạo kiệt sức</td></tr>
</table>
<div class="callout"><span class="badge">Liên hệ</span> Doanh nghiệp truyền thông đối mặt cùng câu hỏi như nhà bán lẻ ở bài 6.1: doanh thu trên mỗi người dùng có trang trải được chi phí để có và phục vụ người dùng đó không? Với nội dung, chi phí là sản xuất và bản quyền; đòn bẩy là thuê bao, quảng cáo và bán theo gói.</div>`,
  ]]);

const p64 = doc('eec101-6-4-online-communities', '6.4 — Ch 11 · Online communities: social networks, auctions, portals|||6.4 — Ch 11 · Cộng đồng trực tuyến: mạng xã hội, đấu giá, cổng thông tin',
  'Mạng xã hội và cộng đồng trực tuyến: định nghĩa, các loại (chung, thực hành, sở thích, ái hữu, được tài trợ) và mô hình kinh doanh; đấu giá trực tuyến: lợi ích và chi phí, các loại (kiểu Anh, kiểu Hà Lan trên Internet, tự đặt giá, đấu giá xu) với ví dụ số, khi nào nên dùng đấu giá, hành vi và gian lận; cổng thông tin chiều ngang và chiều dọc cùng mô hình doanh thu.',
  [[
    `<span class="eyebrow">EEC101 · Part 6 · Lesson 6.4</span>
<h2>Online communities: social networks, auctions, portals</h2>
<h3>Social networks and online communities</h3>
<p>A <strong>social network</strong> involves a group of people, shared social interaction, common ties among members, and people who share an area for some period of time. Online, the "area" is a platform. Types of social networks and their business models:</p>
<table>
<tr><th>Type</th><th>Description</th><th>Typical revenue</th></tr>
<tr><td>General community</td><td>Meet and interact with general audiences, organized around general topics</td><td>Advertising, subscriptions</td></tr>
<tr><td>Practice network</td><td>Members focused on a shared practice, profession or skill</td><td>Advertising, subscriptions, donations</td></tr>
<tr><td>Interest-based</td><td>Members share a common interest (a hobby, a game)</td><td>Advertising, affiliate sales</td></tr>
<tr><td>Affinity community</td><td>Members self-identify with a group (age, region, religion, gender)</td><td>Advertising, sales of products</td></tr>
<tr><td>Sponsored community</td><td>Created by a firm, government or non-profit for its own purposes (a brand's customer community)</td><td>Supports the sponsor's goals — loyalty, service, research</td></tr>
</table>
<p>Core technologies include profiles, news feeds ranked by algorithms, groups, messaging, search, and tools for photos, video and livestreams. Communities are valuable to firms because members create content for free, and because <strong>network effects</strong> (each new member adds value for others) make large communities hard to leave.</p>
<h3>Online auctions</h3>
<table>
<tr><th>Benefits</th><th>Costs and risks</th></tr>
<tr><td>Liquidity (buyers and sellers find each other), price discovery, price transparency, market efficiency, lower transaction costs, consumer aggregation, network effects</td><td>Delayed consumption (waiting for the auction to end and for delivery), monitoring costs (time spent watching bids), equipment costs, trust risks (fraud), fulfilment costs (packing, shipping, insurance)</td></tr>
</table>
<p><strong>Auction types:</strong> an <strong>English auction</strong> has ascending bids and the highest bidder wins; a <strong>Dutch Internet auction</strong> sells several identical items — the highest bidders win and all pay the lowest winning bid; <strong>name your own price</strong> auctions let buyers state a price that sellers may accept; <strong>penny (bidding-fee) auctions</strong> charge a fee for every bid.</p>
<pre><code>Dutch Internet auction — 3 identical items, bids (illustrative, VND thousand)
A 520   B 500   C 480   D 450   E 400
Winners: A, B, C (the three highest)
Each pays the lowest winning bid = 480   ->  seller receives 3 x 480 = 1,440</code></pre>
<p><strong>When to use auctions:</strong> for rare or unique items and goods whose value is hard to set, at the end of a product's life cycle (clearing excess stock), or when a seller can avoid <em>channel conflict</em> with its regular retailers. Design decisions include auction type, starting price, bid increments, length, number of items, price allocation rule and open or closed (sealed) bidding.</p>
<p><strong>Behaviour and fraud:</strong> <em>herd behaviour</em> (bidding on items that already have many bids), <strong>winner's regret</strong> (the feeling after winning that you paid too much), the <strong>seller's lament</strong> (the seller never knows how much the winner would really have paid), the <strong>loser's lament</strong> (the feeling of having bid too cautiously and lost), <strong>bid sniping</strong> (bidding in the last seconds), and fraud such as <strong>shill bidding</strong> (fake bids placed by or for the seller to push the price up) and non-delivery.</p>
<h3>Portals</h3>
<p>Portals began as gateways to the Web and grew around search engines. <strong>General-purpose (horizontal) portals</strong> try to attract a very large general audience with search, news, e-mail and entertainment. <strong>Vertical market portals (vortals)</strong> serve a focused audience — an <em>affinity group</em> (such as parents) or a <em>focused-content</em> topic (such as sport or finance). Revenue models: general advertising, <strong>tenancy deals</strong> (fixed fees for a guaranteed placement), subscription fees, commissions on sales, and applications and games.</p>
<div class="callout"><span class="badge">Exam tip</span> In a Dutch Internet auction all winners pay the same price — the <em>lowest</em> winning bid — not their own bids. In an English auction the single winner pays his own, highest bid.</div>`,
    `<span class="eyebrow">EEC101 · Phần 6 · Bài 6.4</span>
<h2>Cộng đồng trực tuyến: mạng xã hội, đấu giá, cổng thông tin</h2>
<h3>Mạng xã hội và cộng đồng trực tuyến</h3>
<p>Một <strong>mạng xã hội</strong> gồm một nhóm người, sự tương tác xã hội chung, mối liên kết chung giữa các thành viên, và những người cùng chia sẻ một không gian trong một khoảng thời gian. Trên mạng, "không gian" đó là một nền tảng. Các loại mạng xã hội và mô hình kinh doanh:</p>
<table>
<tr><th>Loại</th><th>Mô tả</th><th>Doanh thu điển hình</th></tr>
<tr><td>Cộng đồng chung</td><td>Gặp gỡ, tương tác với công chúng rộng, xoay quanh các chủ đề chung</td><td>Quảng cáo, thuê bao</td></tr>
<tr><td>Mạng thực hành</td><td>Thành viên tập trung vào một hoạt động, nghề nghiệp hay kỹ năng chung</td><td>Quảng cáo, thuê bao, quyên góp</td></tr>
<tr><td>Theo sở thích</td><td>Thành viên có chung một sở thích (một thú chơi, một trò chơi)</td><td>Quảng cáo, bán hàng liên kết</td></tr>
<tr><td>Cộng đồng ái hữu</td><td>Thành viên tự nhận mình thuộc một nhóm (tuổi, vùng miền, tôn giáo, giới)</td><td>Quảng cáo, bán sản phẩm</td></tr>
<tr><td>Cộng đồng được tài trợ</td><td>Do doanh nghiệp, cơ quan nhà nước hay tổ chức phi lợi nhuận lập ra cho mục đích riêng (cộng đồng khách hàng của một thương hiệu)</td><td>Phục vụ mục tiêu của bên tài trợ — lòng trung thành, chăm sóc khách hàng, nghiên cứu</td></tr>
</table>
<p>Công nghệ cốt lõi gồm hồ sơ cá nhân, bảng tin được thuật toán xếp hạng, nhóm, nhắn tin, tìm kiếm và công cụ ảnh, video, livestream. Cộng đồng có giá trị với doanh nghiệp vì thành viên tạo nội dung miễn phí, và vì <strong>hiệu ứng mạng</strong> (mỗi thành viên mới làm tăng giá trị cho người khác) khiến cộng đồng lớn rất khó rời bỏ.</p>
<h3>Đấu giá trực tuyến</h3>
<table>
<tr><th>Lợi ích</th><th>Chi phí và rủi ro</th></tr>
<tr><td>Tính thanh khoản (người mua và người bán tìm thấy nhau), khám phá giá, minh bạch giá, hiệu quả thị trường, giảm chi phí giao dịch, gom người tiêu dùng, hiệu ứng mạng</td><td>Trì hoãn tiêu dùng (chờ phiên kết thúc và chờ giao hàng), chi phí theo dõi (thời gian canh giá), chi phí thiết bị, rủi ro niềm tin (gian lận), chi phí hoàn tất đơn (đóng gói, vận chuyển, bảo hiểm)</td></tr>
</table>
<p><strong>Các loại đấu giá:</strong> <strong>đấu giá kiểu Anh</strong> có giá trả tăng dần và người trả cao nhất thắng; <strong>đấu giá kiểu Hà Lan trên Internet</strong> bán nhiều món giống hệt nhau — những người trả cao nhất thắng và tất cả trả bằng mức giá thắng thấp nhất; đấu giá <strong>tự đặt giá (name your own price)</strong> cho người mua nêu mức giá mà người bán có thể chấp nhận; <strong>đấu giá xu (trả phí mỗi lần đặt giá)</strong> thu phí cho mỗi lần trả giá.</p>
<pre><code>Đấu giá kiểu Hà Lan trên Internet — 3 món giống nhau, giá đặt (minh hoạ, nghìn đồng)
A 520   B 500   C 480   D 450   E 400
Người thắng: A, B, C (ba người trả cao nhất)
Mỗi người trả mức giá thắng thấp nhất = 480   ->  người bán nhận 3 x 480 = 1.440</code></pre>
<p><strong>Khi nào nên dùng đấu giá:</strong> với món hàng hiếm, độc nhất và hàng khó định giá, ở cuối vòng đời sản phẩm (xả hàng tồn), hoặc khi người bán cần tránh <em>xung đột kênh</em> với các nhà bán lẻ thường xuyên của mình. Các quyết định thiết kế gồm loại đấu giá, giá khởi điểm, bước giá, thời lượng, số món, quy tắc phân bổ giá và đấu giá công khai hay kín.</p>
<p><strong>Hành vi và gian lận:</strong> <em>hành vi bầy đàn</em> (trả giá cho món đã có nhiều người trả), <strong>sự hối tiếc của người thắng</strong> (cảm giác sau khi thắng rằng mình đã trả quá cao), <strong>nỗi tiếc của người bán</strong> (người bán không bao giờ biết người thắng thật ra sẵn sàng trả bao nhiêu), <strong>nỗi tiếc của người thua</strong> (cảm giác đã trả giá quá thận trọng nên để tuột), <strong>bắn tỉa giá (bid sniping)</strong> (trả giá vào những giây cuối), và gian lận như <strong>trả giá mồi (shill bidding)</strong> (giá giả do người bán hoặc người thay mặt người bán đặt để đẩy giá lên) và không giao hàng.</p>
<h3>Cổng thông tin</h3>
<p>Cổng thông tin khởi đầu là cửa ngõ vào Web và lớn lên quanh công cụ tìm kiếm. <strong>Cổng đa năng (chiều ngang)</strong> cố thu hút một lượng khán giả chung rất lớn bằng tìm kiếm, tin tức, e-mail và giải trí. <strong>Cổng thị trường chiều dọc (vortal)</strong> phục vụ khán giả tập trung — một <em>nhóm ái hữu</em> (như cha mẹ) hoặc một chủ đề <em>nội dung chuyên biệt</em> (như thể thao, tài chính). Mô hình doanh thu: quảng cáo chung, <strong>hợp đồng thuê chỗ (tenancy deal)</strong> (phí cố định cho vị trí được bảo đảm), phí thuê bao, hoa hồng trên doanh số, và ứng dụng, trò chơi.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Trong đấu giá kiểu Hà Lan trên Internet, mọi người thắng trả cùng một giá — mức giá thắng <em>thấp nhất</em> — chứ không phải giá mình đặt. Trong đấu giá kiểu Anh, người thắng duy nhất trả đúng giá cao nhất mình đã đặt.</div>`,
  ]]);

const p6e = doc('eec101-6-5-exercise', 'Exercise 3 — unit economics and viability of an online shop|||Bài tập 3 — kinh tế đơn vị và tính khả thi của một shop online',
  'Bài tập: từ lượt truy cập, tỷ lệ chuyển đổi, giá trị đơn trung bình, biên lợi nhuận gộp, chi phí biến đổi mỗi đơn, chi phí marketing và tỷ lệ mua lại, tính doanh thu, lợi nhuận đóng góp mỗi đơn, CAC, CLV đơn giản, tỷ số CLV/CAC, lãi lỗ tháng, điểm hoà vốn theo số đơn và tỷ lệ chuyển đổi, rồi đánh giá các đòn bẩy cải thiện; kèm lời giải.',
  [[
    `<span class="eyebrow">EEC101 · Part 6 · Exercise</span>
<h2>Exercise 3 — is Moc Leather's online shop viable?</h2>
<div class="callout"><span class="badge">Problem</span> Moc Leather's own website (a fictional case, illustrative monthly numbers): 50,000 visits; conversion rate 1.8%; average order value (AOV) VND 420,000; gross margin 45%. Variable costs per order: shipping subsidy VND 25,000, payment fee 2% of AOV, packaging VND 6,600. Marketing spend VND 90,000,000 a month; 70% of orders come from first-time customers. Fixed costs (staff, platform, rent) VND 60,000,000 a month. After each order, a customer has a 35% probability of ordering again. (a) Compute orders, revenue and contribution per order. (b) Compute the customer acquisition cost (CAC). (c) Compute a simple customer lifetime value (CLV) and the CLV/CAC ratio. (d) Compute the monthly operating result and the break-even number of orders and conversion rate. (e) Recommend improvements and test one combined scenario: AOV VND 500,000 through bundles, repeat probability 50%, CAC 20% lower through better targeting.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Orders                = 50,000 x 1.8%              = 900
    Revenue               = 900 x 420,000              = 378,000,000
    Gross profit / order  = 420,000 x 45%              = 189,000
    Variable cost / order = 25,000 + 2% x 420,000 + 6,600
                          = 25,000 + 8,400 + 6,600     = 40,000
    Contribution / order  = 189,000 − 40,000           = 149,000

(b) New customers         = 900 x 70%                  = 630
    CAC                   = 90,000,000 / 630           ≈ 142,857

(c) Expected orders per customer = 1 / (1 − 0.35)      ≈ 1.538
    CLV (contribution, undiscounted) = 149,000 / 0.65 ≈ 229,231
    CLV / CAC             = 229,231 / 142,857          ≈ 1.60

(d) Total contribution    = 900 x 149,000              = 134,100,000
    − marketing                                          (90,000,000)
    − fixed costs                                        (60,000,000)
    Operating result                                   = −15,900,000
    Break-even orders     = (60,000,000 + 90,000,000) / 149,000 ≈ 1,006.7 -> 1,007
    Break-even conversion = 1,007 / 50,000              ≈ 2.01%

(e) Combined scenario
    Contribution / order  = 500,000 x 45% − (25,000 + 10,000 + 6,600) = 183,400
    Expected orders       = 1 / (1 − 0.50)             = 2
    CLV                   = 183,400 x 2                = 366,800
    CAC                   = 142,857 x 0.8              ≈ 114,286
    CLV / CAC             = 366,800 / 114,286          ≈ 3.21</code></pre>
<p><strong>Why:</strong> each order is profitable on its own (VND 149,000 of contribution), yet the shop loses money because acquiring customers is expensive and they rarely come back: a CLV/CAC of about 1.6 means every VND 1 spent on acquisition returns only about VND 1.6 of contribution over the customer's life, before fixed costs. Many practitioners use a CLV/CAC of about 3 as a rough health benchmark (a rule of thumb, not a law). The levers are exactly the ones in Chapters 6 and 9: raise order value (bundles, free-shipping thresholds), improve retention (e-mail, loyalty, service) and lower CAC (better targeting, referrals, content). Conversion rate also matters: raising it from 1.8% to about 2.01% alone would reach break-even. Note that this CLV ignores discounting and time — a simplification suitable for an introductory analysis.</p>`,
    `<span class="eyebrow">EEC101 · Phần 6 · Bài tập</span>
<h2>Bài tập 3 — shop online của Mộc Leather có khả thi không?</h2>
<div class="callout"><span class="badge">Đề</span> Website riêng của Mộc Leather (tình huống giả định, số liệu minh hoạ theo tháng): 50.000 lượt truy cập; tỷ lệ chuyển đổi 1,8%; giá trị đơn trung bình (AOV) 420.000 đồng; biên lợi nhuận gộp 45%. Chi phí biến đổi mỗi đơn: hỗ trợ phí vận chuyển 25.000 đồng, phí thanh toán 2% AOV, đóng gói 6.600 đồng. Chi marketing 90.000.000 đồng/tháng; 70% đơn đến từ khách mua lần đầu. Chi phí cố định (nhân sự, nền tảng, thuê mặt bằng) 60.000.000 đồng/tháng. Sau mỗi đơn, khách có xác suất 35% đặt tiếp. (a) Tính số đơn, doanh thu và lợi nhuận đóng góp mỗi đơn. (b) Tính chi phí thu hút một khách hàng (CAC). (c) Tính giá trị vòng đời khách hàng (CLV) đơn giản và tỷ số CLV/CAC. (d) Tính kết quả kinh doanh tháng, số đơn và tỷ lệ chuyển đổi hoà vốn. (e) Đề xuất cải thiện và thử một kịch bản kết hợp: AOV 500.000 đồng nhờ bán theo combo, xác suất mua lại 50%, CAC giảm 20% nhờ nhắm mục tiêu tốt hơn.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Số đơn                = 50.000 x 1,8%              = 900
    Doanh thu             = 900 x 420.000              = 378.000.000
    Lợi nhuận gộp / đơn   = 420.000 x 45%              = 189.000
    Chi phí biến đổi / đơn = 25.000 + 2% x 420.000 + 6.600
                          = 25.000 + 8.400 + 6.600     = 40.000
    Lợi nhuận đóng góp / đơn = 189.000 − 40.000        = 149.000

(b) Khách hàng mới        = 900 x 70%                  = 630
    CAC                   = 90.000.000 / 630           ≈ 142.857

(c) Số đơn kỳ vọng mỗi khách = 1 / (1 − 0,35)          ≈ 1,538
    CLV (theo lợi nhuận đóng góp, không chiết khấu) = 149.000 / 0,65 ≈ 229.231
    CLV / CAC             = 229.231 / 142.857          ≈ 1,60

(d) Tổng lợi nhuận đóng góp = 900 x 149.000            = 134.100.000
    − marketing                                          (90.000.000)
    − chi phí cố định                                    (60.000.000)
    Kết quả kinh doanh                                 = −15.900.000
    Số đơn hoà vốn        = (60.000.000 + 90.000.000) / 149.000 ≈ 1.006,7 -> 1.007
    Tỷ lệ chuyển đổi hoà vốn = 1.007 / 50.000          ≈ 2,01%

(e) Kịch bản kết hợp
    Lợi nhuận đóng góp / đơn = 500.000 x 45% − (25.000 + 10.000 + 6.600) = 183.400
    Số đơn kỳ vọng        = 1 / (1 − 0,50)             = 2
    CLV                   = 183.400 x 2                = 366.800
    CAC                   = 142.857 x 0,8              ≈ 114.286
    CLV / CAC             = 366.800 / 114.286          ≈ 3,21</code></pre>
<p><strong>Vì sao:</strong> từng đơn hàng đều có lãi (149.000 đồng lợi nhuận đóng góp), nhưng shop vẫn lỗ vì thu hút khách tốn kém mà khách lại ít quay lại: CLV/CAC khoảng 1,6 nghĩa là mỗi 1 đồng chi để có khách chỉ mang về khoảng 1,6 đồng lợi nhuận đóng góp trong suốt vòng đời khách, trước khi trừ chi phí cố định. Nhiều người làm nghề dùng mức CLV/CAC khoảng 3 làm ngưỡng tham khảo sức khoẻ (một quy tắc kinh nghiệm, không phải định luật). Các đòn bẩy chính là những gì đã học ở Chương 6 và 9: tăng giá trị đơn (combo, ngưỡng miễn phí vận chuyển), tăng giữ chân (e-mail, chương trình thân thiết, dịch vụ) và giảm CAC (nhắm mục tiêu tốt hơn, giới thiệu, nội dung). Tỷ lệ chuyển đổi cũng quan trọng: chỉ riêng việc nâng từ 1,8% lên khoảng 2,01% đã đủ hoà vốn. Lưu ý CLV ở đây bỏ qua chiết khấu và yếu tố thời gian — một cách đơn giản hoá phù hợp với phân tích nhập môn.</p>`,
  ]]);

const p6q = quiz('eec101-quiz-6', 'Quiz 6 — Ch 9–11: retail, services, media, communities|||Quiz 6 — Ch 9–11: bán lẻ, dịch vụ, truyền thông, cộng đồng', [
  { id: 'q1', question: 'A Dutch Internet auction sells 2 identical items. Bids are 300, 280, 250 and 200. What does each winner pay?|||Một phiên đấu giá kiểu Hà Lan trên Internet bán 2 món giống nhau. Các mức giá đặt là 300, 280, 250 và 200. Mỗi người thắng trả bao nhiêu?', options: ['300 and 280 respectively|||lần lượt 300 và 280', '280 each|||mỗi người 280', '250 each|||mỗi người 250', '300 each|||mỗi người 300'], correctIndex: 1, explanation: 'The two highest bidders (300 and 280) win, and all winners pay the lowest winning bid, 280.|||Hai người trả cao nhất (300 và 280) thắng, và mọi người thắng trả bằng mức giá thắng thấp nhất là 280.' },
  { id: 'q2', question: 'Contribution per order is VND 100,000, a customer places on average 2 orders, and CAC is VND 80,000. What is the CLV/CAC ratio?|||Lợi nhuận đóng góp mỗi đơn là 100.000 đồng, mỗi khách trung bình đặt 2 đơn, CAC là 80.000 đồng. Tỷ số CLV/CAC bằng bao nhiêu?', options: ['0.8|||0,8', '1.25|||1,25', '2.5|||2,5', '4.0|||4,0'], correctIndex: 2, explanation: 'CLV = 100,000 x 2 = 200,000; 200,000 / 80,000 = 2.5.|||CLV = 100.000 x 2 = 200.000; 200.000 / 80.000 = 2,5.' },
  { id: 'q3', question: 'A manufacturer starts selling directly to consumers online. Which challenge is most specific to this manufacturer-direct model?|||Một nhà sản xuất bắt đầu bán trực tiếp cho người tiêu dùng qua mạng. Thách thức nào đặc trưng nhất cho mô hình nhà sản xuất bán trực tiếp này?', options: ['Channel conflict with its existing retailers|||Xung đột kênh với các nhà bán lẻ hiện có', 'Having no product to sell|||Không có sản phẩm để bán', 'Being unable to accept online payments|||Không thể nhận thanh toán trực tuyến', 'Being forced to use auctions|||Bị buộc phải dùng đấu giá'], correctIndex: 0, explanation: 'Selling direct competes with the retailers that still carry the manufacturer’s products, creating channel conflict.|||Bán trực tiếp cạnh tranh với chính các nhà bán lẻ vẫn đang bán sản phẩm của nhà sản xuất, gây xung đột kênh.' },
]);

const p71 = doc('eec101-7-1-b2b-supply-chain', '7.1 — Ch 12 · B2B e-commerce, procurement and the supply chain|||7.1 — Ch 12 · TMĐT B2B, quy trình mua sắm và chuỗi cung ứng',
  'Thương mại B2B và TMĐT B2B, quá trình phát triển (hệ thống nhận đơn tự động, EDI, website B2B, sàn, mạng riêng), lợi ích tiềm năng; quy trình mua sắm bảy bước, hàng trực tiếp và hàng gián tiếp (MRO), mua theo hợp đồng và mua giao ngay, chuỗi cung ứng nhiều cấp; xu hướng quản trị chuỗi cung ứng (tinh giản, thích ứng, có trách nhiệm, bền vững, di động, đám mây, blockchain) và thương mại cộng tác.',
  [[
    `<span class="eyebrow">EEC101 · Part 7 · Lesson 7.1</span>
<h2>B2B e-commerce, procurement and the supply chain</h2>
<h3>What B2B e-commerce is</h3>
<p><strong>B2B commerce</strong> is all types of trade between firms; <strong>B2B e-commerce</strong> is the part of it enabled by the Internet and mobile devices. By value it is by far the largest type of e-commerce, although consumers rarely see it.</p>
<table>
<tr><th>Stage in its evolution</th><th>What it added</th></tr>
<tr><td>Automated order entry systems</td><td>Telephone-modem and later networked systems that let customers place orders with one supplier</td></tr>
<tr><td>Electronic data interchange (EDI)</td><td>A standard for sharing business documents (orders, invoices, shipping notices) computer-to-computer between firms; still widely used</td></tr>
<tr><td>B2B e-commerce websites</td><td>Online catalogs through which one supplier sells to many business buyers</td></tr>
<tr><td>Net marketplaces</td><td>Online markets bringing many buyers and sellers together (lesson 7.2)</td></tr>
<tr><td>Private industrial networks</td><td>Networks run by one large firm to coordinate its suppliers and partners (lesson 7.2)</td></tr>
</table>
<p><strong>Potential benefits:</strong> lower administrative costs; lower search costs for buyers; reduced inventory costs through more competition and faster information; lower transaction costs (fewer paper documents and errors); more production flexibility (just-in-time delivery of parts); better quality through closer cooperation; shorter product cycle times; more opportunities for collaboration; greater price transparency; and more visibility and real-time information sharing across the supply chain.</p>
<h3>The procurement process</h3>
<p>Firms buy through a seven-step process: <strong>search</strong> for suppliers → <strong>qualify</strong> sellers and products → <strong>negotiate</strong> prices, credit terms, quality and delivery → issue a <strong>purchase order</strong> → receive the <strong>invoice</strong> → <strong>shipping</strong> of the product → <strong>remit payment</strong>. Each step creates documents and costs that e-commerce can reduce.</p>
<table>
<tr><th>Distinction</th><th>Meaning</th></tr>
<tr><td>Direct goods vs indirect goods</td><td><strong>Direct goods</strong> are integrally involved in production (steel for a car maker, fabric for a garment factory); <strong>indirect goods</strong> are everything else, often called <strong>MRO</strong> — maintenance, repair and operations (office supplies, cleaning products, spare parts)</td></tr>
<tr><td>Contract purchasing vs spot purchasing</td><td><strong>Contract purchasing</strong> is based on long-term written agreements with fixed terms; <strong>spot purchasing</strong> meets immediate needs in larger marketplaces with many suppliers</td></tr>
</table>
<p>A firm's <strong>supply chain</strong> is the series of firms and processes that produce and deliver its products. It is <strong>multi-tier</strong>: Tier 1 suppliers deliver directly to the firm, Tier 2 suppliers deliver to Tier 1, and so on — so a problem far upstream can stop production. Many firms still depend on <strong>legacy systems</strong> and enterprise resource planning (ERP) systems that must be connected to new e-commerce tools.</p>
<h3>Trends in supply chain management</h3>
<ul>
<li><strong>Supply chain simplification</strong> — fewer, closer suppliers; just-in-time and lean production to cut inventory.</li>
<li><strong>Adaptive (resilient) supply chains</strong> — after pandemics, natural disasters and trade disruptions exposed the risks of long, lean chains, firms diversify suppliers and locations and keep safety stock.</li>
<li><strong>Accountable supply chains</strong> — responsibility for labour conditions and human rights at suppliers.</li>
<li><strong>Sustainable supply chains</strong> — reducing environmental impact across the chain.</li>
<li><strong>Technology</strong> — EDI, mobile B2B apps, cloud-based supply chain systems, RFID and IoT sensors for tracking, and blockchain for shared, tamper-resistant records.</li>
<li><strong>Collaborative commerce</strong> — using technology to let firms collaborate on design, development, forecasting and inventory management over the whole product life cycle, going far beyond simple buying and selling.</li>
</ul>
<div class="callout"><span class="badge">Connect to your project</span> Stage 4 of the Go-to-Market project asks how your product reaches customers and how you handle stock and returns. Even a small online shop has a supply chain: your suppliers, your packaging, your carriers.</div>`,
    `<span class="eyebrow">EEC101 · Phần 7 · Bài 7.1</span>
<h2>TMĐT B2B, quy trình mua sắm và chuỗi cung ứng</h2>
<h3>TMĐT B2B là gì</h3>
<p><strong>Thương mại B2B</strong> là mọi hình thức trao đổi mua bán giữa các doanh nghiệp; <strong>TMĐT B2B</strong> là phần thương mại B2B được thực hiện nhờ Internet và thiết bị di động. Xét theo giá trị, đây là loại TMĐT lớn nhất, dù người tiêu dùng hiếm khi nhìn thấy.</p>
<table>
<tr><th>Giai đoạn phát triển</th><th>Điều được bổ sung</th></tr>
<tr><td>Hệ thống nhận đơn tự động</td><td>Hệ thống qua modem điện thoại rồi qua mạng cho phép khách đặt hàng với một nhà cung cấp</td></tr>
<tr><td>Trao đổi dữ liệu điện tử (EDI)</td><td>Chuẩn chia sẻ chứng từ kinh doanh (đơn đặt hàng, hoá đơn, thông báo giao hàng) giữa máy tính của các doanh nghiệp; đến nay vẫn được dùng rộng rãi</td></tr>
<tr><td>Website TMĐT B2B</td><td>Catalog trực tuyến qua đó một nhà cung cấp bán cho nhiều người mua là doanh nghiệp</td></tr>
<tr><td>Sàn thương mại mạng</td><td>Thị trường trực tuyến tập hợp nhiều người mua và người bán (bài 7.2)</td></tr>
<tr><td>Mạng công nghiệp riêng</td><td>Mạng do một doanh nghiệp lớn vận hành để điều phối nhà cung cấp và đối tác (bài 7.2)</td></tr>
</table>
<p><strong>Lợi ích tiềm năng:</strong> giảm chi phí hành chính; giảm chi phí tìm kiếm cho người mua; giảm chi phí tồn kho nhờ cạnh tranh nhiều hơn và thông tin nhanh hơn; giảm chi phí giao dịch (ít giấy tờ và sai sót hơn); sản xuất linh hoạt hơn (giao linh kiện đúng lúc); chất lượng tốt hơn nhờ hợp tác chặt chẽ; rút ngắn chu kỳ sản phẩm; nhiều cơ hội hợp tác hơn; minh bạch giá hơn; và tăng khả năng quan sát, chia sẻ thông tin thời gian thực trên toàn chuỗi cung ứng.</p>
<h3>Quy trình mua sắm</h3>
<p>Doanh nghiệp mua hàng qua quy trình bảy bước: <strong>tìm kiếm</strong> nhà cung cấp → <strong>đánh giá, sàng lọc</strong> người bán và sản phẩm → <strong>đàm phán</strong> giá, điều kiện tín dụng, chất lượng và giao hàng → phát hành <strong>đơn đặt hàng</strong> → nhận <strong>hoá đơn</strong> → <strong>vận chuyển</strong> sản phẩm → <strong>thanh toán</strong>. Mỗi bước tạo ra chứng từ và chi phí mà TMĐT có thể cắt giảm.</p>
<table>
<tr><th>Phân biệt</th><th>Ý nghĩa</th></tr>
<tr><td>Hàng trực tiếp và hàng gián tiếp</td><td><strong>Hàng trực tiếp</strong> gắn liền với quá trình sản xuất (thép cho nhà sản xuất ô tô, vải cho xưởng may); <strong>hàng gián tiếp</strong> là mọi thứ còn lại, thường gọi là <strong>MRO</strong> — bảo trì, sửa chữa và vận hành (văn phòng phẩm, chất tẩy rửa, phụ tùng thay thế)</td></tr>
<tr><td>Mua theo hợp đồng và mua giao ngay</td><td><strong>Mua theo hợp đồng</strong> dựa trên thoả thuận dài hạn bằng văn bản với điều kiện cố định; <strong>mua giao ngay</strong> đáp ứng nhu cầu tức thời trên các thị trường lớn có nhiều nhà cung cấp</td></tr>
</table>
<p><strong>Chuỗi cung ứng</strong> của doanh nghiệp là chuỗi các doanh nghiệp và quy trình sản xuất, giao sản phẩm của nó. Chuỗi này có <strong>nhiều cấp</strong>: nhà cung cấp cấp 1 giao trực tiếp cho doanh nghiệp, nhà cung cấp cấp 2 giao cho cấp 1, và cứ thế — nên một sự cố ở tận thượng nguồn có thể làm dừng sản xuất. Nhiều doanh nghiệp vẫn phụ thuộc vào <strong>hệ thống cũ</strong> và hệ thống hoạch định nguồn lực doanh nghiệp (ERP), phải được kết nối với công cụ TMĐT mới.</p>
<h3>Xu hướng quản trị chuỗi cung ứng</h3>
<ul>
<li><strong>Tinh giản chuỗi cung ứng</strong> — ít nhà cung cấp hơn nhưng gắn bó hơn; sản xuất đúng lúc (JIT) và sản xuất tinh gọn để giảm tồn kho.</li>
<li><strong>Chuỗi cung ứng thích ứng (có sức chống chịu)</strong> — sau khi đại dịch, thiên tai và gián đoạn thương mại bộc lộ rủi ro của chuỗi dài và tinh gọn, doanh nghiệp đa dạng hoá nhà cung cấp, địa điểm và giữ tồn kho an toàn.</li>
<li><strong>Chuỗi cung ứng có trách nhiệm</strong> — chịu trách nhiệm về điều kiện lao động và quyền con người ở nhà cung cấp.</li>
<li><strong>Chuỗi cung ứng bền vững</strong> — giảm tác động môi trường trên toàn chuỗi.</li>
<li><strong>Công nghệ</strong> — EDI, ứng dụng B2B trên di động, hệ thống chuỗi cung ứng trên đám mây, RFID và cảm biến IoT để theo dõi, blockchain cho hồ sơ dùng chung khó bị sửa.</li>
<li><strong>Thương mại cộng tác</strong> — dùng công nghệ để các doanh nghiệp hợp tác trong thiết kế, phát triển, dự báo và quản lý tồn kho suốt vòng đời sản phẩm, vượt xa việc mua bán đơn thuần.</li>
</ul>
<div class="callout"><span class="badge">Liên hệ dự án</span> Giai đoạn 4 của dự án Go-to-Market hỏi sản phẩm của bạn tới tay khách thế nào và bạn xử lý tồn kho, đổi trả ra sao. Ngay cả một shop online nhỏ cũng có chuỗi cung ứng: nhà cung cấp, bao bì, đơn vị vận chuyển của bạn.</div>`,
  ]]);

const p72 = doc('eec101-7-2-b2b-marketplaces', '7.2 — Ch 12 · B2B marketplaces and private B2B networks|||7.2 — Ch 12 · Sàn B2B và mạng B2B riêng',
  'Đặc điểm của sàn B2B (thiên về bên bán, bên mua hay trung lập; sở hữu; cơ chế giá; chiều ngang hay chiều dọc), bốn loại sàn (nhà phân phối điện tử, mua sắm điện tử, sàn giao dịch, liên minh ngành) so sánh trong một bảng; mạng công nghiệp riêng: mục tiêu, hoạch định – dự báo – bổ sung hàng hợp tác (CPFR), khả năng quan sát chuỗi cầu, phối hợp marketing và thiết kế, rào cản triển khai.',
  [[
    `<span class="eyebrow">EEC101 · Part 7 · Lesson 7.2</span>
<h2>B2B marketplaces and private B2B networks</h2>
<h3>Characteristics of B2B marketplaces</h3>
<table>
<tr><th>Characteristic</th><th>Options</th></tr>
<tr><td>Bias</td><td>Sell-side (favours sellers), buy-side (favours buyers) or neutral</td></tr>
<tr><td>Ownership</td><td>Industry-owned or independent third party</td></tr>
<tr><td>Pricing mechanism</td><td>Fixed-price catalogs, auctions, bid/ask, requests for proposal or quotation (RFP/RFQ)</td></tr>
<tr><td>Scope / focus</td><td><strong>Horizontal</strong> (goods used by firms in many industries, such as office supplies) or <strong>vertical</strong> (goods for one industry, such as steel or chemicals)</td></tr>
<tr><td>Value creation and access</td><td>Who benefits most; open to all or by invitation only</td></tr>
</table>
<h3>Four types of B2B marketplace</h3>
<table>
<tr><th>Type</th><th>Ownership and bias</th><th>What is traded, how</th><th>Relationship</th></tr>
<tr><td>E-distributor</td><td>Independently owned; sell-side (one firm's catalog)</td><td>Mainly indirect goods (MRO), fixed catalog prices; spot purchases; horizontal</td><td>One seller to many buyers</td></tr>
<tr><td>E-procurement</td><td>Independent third party offering software and services to buyers</td><td>Indirect goods and services (MRO); catalogs of many suppliers integrated for the buyer; horizontal</td><td>Many to many, organized around the buyer</td></tr>
<tr><td>Exchange</td><td>Independent, neutral</td><td>Direct goods, spot purchases, dynamic pricing; usually vertical</td><td>Many sellers to many buyers</td></tr>
<tr><td>Industry consortium</td><td>Owned by major firms in the industry; buy-side bias</td><td>Direct goods, contract purchasing; vertical</td><td>Many suppliers to a few large buyers</td></tr>
</table>
<p>Many independent exchanges have struggled because established suppliers dislike markets that push prices down through open competition — a reminder that a B2B marketplace must create value for <em>both</em> sides.</p>
<h3>Private industrial networks (private B2B networks)</h3>
<p>A <strong>private industrial network</strong> is a digital network, usually owned by a single large firm, that coordinates the flow of communication and business processes among the firms in its value chain. It is the most common form of B2B e-commerce because it supports long-term relationships rather than one-off transactions.</p>
<ul>
<li><strong>Objectives:</strong> efficient purchasing and selling across the value chain; industry-level resource planning; greater <strong>supply chain visibility</strong> (knowing stock and orders at partners in real time); closer buyer–supplier relationships; global operations; reducing risk by preventing imbalances of supply and demand.</li>
<li><strong>Collaborative resource planning, forecasting and replenishment (CPFR):</strong> partners share sales data and forecasts so that suppliers can plan production and replenish stock before it runs out.</li>
<li><strong>Demand chain visibility:</strong> everyone in the chain sees what end customers are buying, which reduces over- and under-stocking along the chain.</li>
<li><strong>Marketing coordination and product design:</strong> suppliers take part in designing new products and planning promotions.</li>
<li><strong>Barriers:</strong> partners must share sensitive data and trust each other; integrating different information systems is costly; the owning firm's power can make suppliers dependent.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> Remember the pairs: <em>e-distributor</em> = one seller, many buyers, MRO, fixed prices; <em>industry consortium</em> = industry-owned, direct goods, contract purchasing; <em>exchange</em> = neutral, spot, dynamic prices; <em>private industrial network</em> = one large firm coordinating its own value chain.</div>`,
    `<span class="eyebrow">EEC101 · Phần 7 · Bài 7.2</span>
<h2>Sàn B2B và mạng B2B riêng</h2>
<h3>Đặc điểm của sàn B2B</h3>
<table>
<tr><th>Đặc điểm</th><th>Các lựa chọn</th></tr>
<tr><td>Thiên hướng</td><td>Thiên về bên bán, thiên về bên mua hoặc trung lập</td></tr>
<tr><td>Sở hữu</td><td>Do các doanh nghiệp trong ngành sở hữu hoặc do bên thứ ba độc lập</td></tr>
<tr><td>Cơ chế giá</td><td>Catalog giá cố định, đấu giá, chào mua/chào bán, yêu cầu đề xuất hay báo giá (RFP/RFQ)</td></tr>
<tr><td>Phạm vi / trọng tâm</td><td><strong>Chiều ngang</strong> (hàng hoá doanh nghiệp ở nhiều ngành cùng dùng, như văn phòng phẩm) hoặc <strong>chiều dọc</strong> (hàng hoá cho một ngành, như thép hay hoá chất)</td></tr>
<tr><td>Tạo giá trị và quyền truy cập</td><td>Ai hưởng lợi nhiều nhất; mở cho mọi người hay chỉ theo lời mời</td></tr>
</table>
<h3>Bốn loại sàn B2B</h3>
<table>
<tr><th>Loại</th><th>Sở hữu và thiên hướng</th><th>Giao dịch gì, thế nào</th><th>Quan hệ</th></tr>
<tr><td>Nhà phân phối điện tử (e-distributor)</td><td>Sở hữu độc lập; thiên về bên bán (catalog của một doanh nghiệp)</td><td>Chủ yếu hàng gián tiếp (MRO), giá catalog cố định; mua giao ngay; chiều ngang</td><td>Một người bán tới nhiều người mua</td></tr>
<tr><td>Mua sắm điện tử (e-procurement)</td><td>Bên thứ ba độc lập cung cấp phần mềm và dịch vụ cho người mua</td><td>Hàng hoá và dịch vụ gián tiếp (MRO); catalog của nhiều nhà cung cấp được tích hợp cho người mua; chiều ngang</td><td>Nhiều – nhiều, tổ chức xoay quanh người mua</td></tr>
<tr><td>Sàn giao dịch (exchange)</td><td>Độc lập, trung lập</td><td>Hàng trực tiếp, mua giao ngay, giá động; thường theo chiều dọc</td><td>Nhiều người bán tới nhiều người mua</td></tr>
<tr><td>Liên minh ngành (industry consortium)</td><td>Do các doanh nghiệp lớn trong ngành sở hữu; thiên về bên mua</td><td>Hàng trực tiếp, mua theo hợp đồng; chiều dọc</td><td>Nhiều nhà cung cấp tới một số ít người mua lớn</td></tr>
</table>
<p>Nhiều sàn giao dịch độc lập gặp khó khăn vì các nhà cung cấp lâu năm không thích thị trường ép giá xuống bằng cạnh tranh công khai — lời nhắc rằng sàn B2B phải tạo giá trị cho <em>cả hai</em> phía.</p>
<h3>Mạng công nghiệp riêng (mạng B2B riêng)</h3>
<p><strong>Mạng công nghiệp riêng</strong> là mạng số, thường do một doanh nghiệp lớn sở hữu, điều phối luồng thông tin và quy trình kinh doanh giữa các doanh nghiệp trong chuỗi giá trị của nó. Đây là hình thức TMĐT B2B phổ biến nhất vì nó hỗ trợ quan hệ dài hạn thay vì giao dịch một lần.</p>
<ul>
<li><strong>Mục tiêu:</strong> mua và bán hiệu quả trên toàn chuỗi giá trị; hoạch định nguồn lực ở cấp ngành; tăng <strong>khả năng quan sát chuỗi cung ứng</strong> (biết tồn kho và đơn hàng ở đối tác theo thời gian thực); quan hệ người mua – nhà cung cấp chặt chẽ hơn; vận hành toàn cầu; giảm rủi ro bằng cách ngăn mất cân đối cung cầu.</li>
<li><strong>Hoạch định nguồn lực, dự báo và bổ sung hàng hợp tác (CPFR):</strong> các đối tác chia sẻ dữ liệu bán hàng và dự báo để nhà cung cấp lên kế hoạch sản xuất và bổ sung hàng trước khi hết.</li>
<li><strong>Khả năng quan sát chuỗi cầu:</strong> mọi bên trong chuỗi thấy khách hàng cuối đang mua gì, giúp giảm thừa và thiếu hàng dọc theo chuỗi.</li>
<li><strong>Phối hợp marketing và thiết kế sản phẩm:</strong> nhà cung cấp tham gia thiết kế sản phẩm mới và lên kế hoạch khuyến mãi.</li>
<li><strong>Rào cản:</strong> các đối tác phải chia sẻ dữ liệu nhạy cảm và tin nhau; tích hợp các hệ thống thông tin khác nhau rất tốn kém; quyền lực của doanh nghiệp sở hữu có thể khiến nhà cung cấp bị lệ thuộc.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> Nhớ theo cặp: <em>nhà phân phối điện tử</em> = một người bán, nhiều người mua, MRO, giá cố định; <em>liên minh ngành</em> = do ngành sở hữu, hàng trực tiếp, mua theo hợp đồng; <em>sàn giao dịch</em> = trung lập, giao ngay, giá động; <em>mạng công nghiệp riêng</em> = một doanh nghiệp lớn điều phối chuỗi giá trị của chính mình.</div>`,
  ]]);

const p73 = doc('eec101-7-3-gtm-project-guide', '7.3 — Project guide: Go-to-Market strategy in four stages|||7.3 — Hướng dẫn dự án: chiến lược Go-to-Market bốn giai đoạn',
  'Hướng dẫn cấu trúc dự án nhóm E-commerce Go-to-Market Strategy (30%): đưa một sản phẩm hữu hình lên kênh trực tuyến qua bốn giai đoạn — chọn sản phẩm và mô hình kinh doanh; chọn nền tảng và hạ tầng; marketing số và thu hút khách; vận hành sau bán và giữ chân khách — kèm câu hỏi, công cụ, sản phẩm đầu ra của từng giai đoạn, bảng kiểm và lỗi hay gặp.',
  [[
    `<span class="eyebrow">EEC101 · Part 7 · Lesson 7.3 · Project guide</span>
<h2>Go-to-Market strategy in four stages</h2>
<p class="lead">The group project (30%) asks your team to take a <strong>physical product</strong> online. It is the whole course in one document: each stage uses specific chapters. This guide gives a structure; your lecturer's brief on FLM decides the exact requirements.</p>
<h3>Stage 1 — Product and business model (Ch 1–2, 9)</h3>
<ul>
<li><strong>Choose a product that suits e-commerce:</strong> clear specifications, reasonable value for its weight and size, low fragility, a gross margin large enough to pay for delivery and marketing, and a customer segment that already buys online.</li>
<li>Describe the <strong>eight elements</strong> of the business model; state the value proposition in one sentence.</li>
<li>Choose the <strong>revenue model</strong> (sales, subscription, or a mix) and estimate simple unit economics: price, gross margin, variable cost per order.</li>
<li><em>Output:</em> a one-page business model and a unit-economics table with every assumption labelled.</li>
</ul>
<h3>Stage 2 — Platform and infrastructure (Ch 3–5)</h3>
<ul>
<li>Decide where to sell: marketplace store, own website (SaaS or open source), social commerce — or a combination. Use the break-even logic of Exercise 2, including the cost of traffic.</li>
<li>Draw an <strong>e-commerce presence map</strong> (website, e-mail, social media, offline) and a timeline of milestones.</li>
<li>Choose <strong>payment methods</strong> (cards, wallets, QR, COD) and explain the trade-off between conversion, cost and risk.</li>
<li>Plan <strong>security and trust</strong>: HTTPS, account security, privacy policy, return policy, trusted payment options.</li>
<li>Evaluate the customer experience of the chosen platform: mobile usability, page speed, ease of purchase.</li>
<li><em>Output:</em> a platform decision with reasons, a presence map and a checkout/payment design.</li>
</ul>
<h3>Stage 3 — Digital marketing and customer acquisition (Ch 6–7)</h3>
<ul>
<li>Map the <strong>purchasing decision</strong> of your target customers to channels: search, social, influencers, e-mail, social–mobile–local tactics.</li>
<li>Build the launch concept with generative AI <em>and</em> show your critical review of it (lesson 4.4): what you kept, changed and rejected, and why.</li>
<li>Set a budget and target metrics: CTR, conversion rate, CAC, ROAS against the break-even ROAS.</li>
<li>Check legal and ethical points: disclosure of paid content, consent for data and location tracking, truthful claims.</li>
<li><em>Output:</em> a 4–8-week launch plan with budget, channel mix and KPI table.</li>
</ul>
<h3>Stage 4 — Post-sale operations and retention (Ch 5, 8, 9, 12)</h3>
<ul>
<li><strong>Fulfilment:</strong> suppliers, stock levels, packaging, delivery partners, handling of COD and failed deliveries, returns and refunds.</li>
<li><strong>Customer service:</strong> response channels and times, complaint handling in line with consumer-protection rules (check the texts in force).</li>
<li><strong>Retention:</strong> e-mail and messaging flows, loyalty programme, community; targets for repeat-purchase rate and CLV/CAC (Exercise 3).</li>
<li><strong>Data and ethics:</strong> what customer data you keep, why, for how long, and how it is protected.</li>
<li><em>Output:</em> an operations flow from order to delivery to repeat purchase, and a retention plan.</li>
</ul>
<h3>Quality checklist before you submit</h3>
<table>
<tr><th>Check</th><th>Why it matters</th></tr>
<tr><td>Every number has a source or is marked as an assumption</td><td>Markers reward honest, traceable reasoning, not impressive figures</td></tr>
<tr><td>The four stages tell one consistent story</td><td>The channel in Stage 3 must fit the platform in Stage 2 and the margin in Stage 1</td></tr>
<tr><td>Unit economics include delivery, payment fees and marketing</td><td>The most common reason an online plan is not viable</td></tr>
<tr><td>AI use is disclosed and critically evaluated</td><td>The syllabus assesses judgment, not just output</td></tr>
<tr><td>Legal and ethical checks are explicit</td><td>CLO5: compliance and responsibility are part of the grade</td></tr>
</table>
<div class="callout"><span class="badge">Common mistakes</span> Choosing a product with a margin too thin to pay for delivery; assuming a marketplace brings free customers with no competition; copying a big brand's marketing without its budget; and forgetting returns. Test your plan with the numbers before polishing the slides.</div>`,
    `<span class="eyebrow">EEC101 · Phần 7 · Bài 7.3 · Hướng dẫn dự án</span>
<h2>Chiến lược Go-to-Market bốn giai đoạn</h2>
<p class="lead">Dự án nhóm (30%) yêu cầu nhóm bạn đưa một <strong>sản phẩm hữu hình</strong> lên kênh trực tuyến. Đó là toàn bộ môn học gói trong một tài liệu: mỗi giai đoạn dùng những chương cụ thể. Hướng dẫn này đưa ra một cấu trúc; yêu cầu chính xác do đề bài của giảng viên trên FLM quyết định.</p>
<h3>Giai đoạn 1 — Sản phẩm và mô hình kinh doanh (Ch 1–2, 9)</h3>
<ul>
<li><strong>Chọn sản phẩm hợp với TMĐT:</strong> thông số rõ ràng, giá trị hợp lý so với khối lượng và kích thước, ít dễ vỡ, biên lợi nhuận gộp đủ lớn để trả phí giao hàng và marketing, và phân khúc khách hàng vốn đã quen mua trực tuyến.</li>
<li>Mô tả <strong>tám yếu tố</strong> của mô hình kinh doanh; phát biểu tuyên bố giá trị trong một câu.</li>
<li>Chọn <strong>mô hình doanh thu</strong> (bán hàng, thuê bao hoặc kết hợp) và ước tính kinh tế đơn vị đơn giản: giá bán, biên gộp, chi phí biến đổi mỗi đơn.</li>
<li><em>Đầu ra:</em> một trang mô hình kinh doanh và một bảng kinh tế đơn vị, mọi giả định đều được ghi rõ.</li>
</ul>
<h3>Giai đoạn 2 — Nền tảng và hạ tầng (Ch 3–5)</h3>
<ul>
<li>Quyết định bán ở đâu: gian hàng trên sàn, website riêng (SaaS hoặc mã nguồn mở), thương mại mạng xã hội — hoặc kết hợp. Dùng lập luận hoà vốn của Bài tập 2, kể cả chi phí lưu lượng truy cập.</li>
<li>Vẽ <strong>bản đồ hiện diện TMĐT</strong> (website, e-mail, mạng xã hội, ngoại tuyến) và lịch trình các mốc.</li>
<li>Chọn <strong>phương thức thanh toán</strong> (thẻ, ví, QR, COD) và giải thích sự đánh đổi giữa chuyển đổi, chi phí và rủi ro.</li>
<li>Lên kế hoạch <strong>bảo mật và niềm tin</strong>: HTTPS, bảo mật tài khoản, chính sách quyền riêng tư, chính sách đổi trả, phương thức thanh toán tin cậy.</li>
<li>Đánh giá trải nghiệm khách hàng trên nền tảng đã chọn: dễ dùng trên di động, tốc độ tải trang, mua hàng dễ dàng.</li>
<li><em>Đầu ra:</em> quyết định nền tảng kèm lý do, bản đồ hiện diện và thiết kế bước thanh toán.</li>
</ul>
<h3>Giai đoạn 3 — Marketing số và thu hút khách hàng (Ch 6–7)</h3>
<ul>
<li>Nối <strong>quá trình quyết định mua</strong> của khách hàng mục tiêu với các kênh: tìm kiếm, mạng xã hội, người có ảnh hưởng, e-mail, chiến thuật xã hội – di động – địa phương.</li>
<li>Xây concept ra mắt với AI tạo sinh <em>và</em> trình bày phần đánh giá phản biện của nhóm (bài 4.4): giữ gì, sửa gì, loại gì, vì sao.</li>
<li>Đặt ngân sách và chỉ số mục tiêu: CTR, tỷ lệ chuyển đổi, CAC, ROAS so với ROAS hoà vốn.</li>
<li>Kiểm các điểm pháp lý và đạo đức: công khai nội dung có trả phí, sự đồng ý khi thu dữ liệu và theo dõi vị trí, nhận định trung thực.</li>
<li><em>Đầu ra:</em> kế hoạch ra mắt 4–8 tuần kèm ngân sách, tổ hợp kênh và bảng KPI.</li>
</ul>
<h3>Giai đoạn 4 — Vận hành sau bán và giữ chân khách hàng (Ch 5, 8, 9, 12)</h3>
<ul>
<li><strong>Hoàn tất đơn hàng:</strong> nhà cung cấp, mức tồn kho, bao bì, đối tác giao hàng, xử lý COD và giao hàng thất bại, đổi trả và hoàn tiền.</li>
<li><strong>Chăm sóc khách hàng:</strong> kênh và thời gian phản hồi, giải quyết khiếu nại phù hợp quy định bảo vệ người tiêu dùng (kiểm văn bản đang có hiệu lực).</li>
<li><strong>Giữ chân:</strong> luồng e-mail và tin nhắn, chương trình khách hàng thân thiết, cộng đồng; mục tiêu cho tỷ lệ mua lại và CLV/CAC (Bài tập 3).</li>
<li><strong>Dữ liệu và đạo đức:</strong> giữ dữ liệu khách hàng nào, vì sao, trong bao lâu và bảo vệ ra sao.</li>
<li><em>Đầu ra:</em> sơ đồ vận hành từ đặt hàng tới giao hàng tới mua lại, và kế hoạch giữ chân khách.</li>
</ul>
<h3>Bảng kiểm chất lượng trước khi nộp</h3>
<table>
<tr><th>Kiểm tra</th><th>Vì sao quan trọng</th></tr>
<tr><td>Mọi con số đều có nguồn hoặc được ghi là giả định</td><td>Người chấm đánh giá cao lập luận trung thực, truy được nguồn, không phải con số ấn tượng</td></tr>
<tr><td>Bốn giai đoạn kể một câu chuyện nhất quán</td><td>Kênh ở Giai đoạn 3 phải khớp nền tảng ở Giai đoạn 2 và biên lợi nhuận ở Giai đoạn 1</td></tr>
<tr><td>Kinh tế đơn vị đã tính giao hàng, phí thanh toán và marketing</td><td>Lý do phổ biến nhất khiến một kế hoạch trực tuyến không khả thi</td></tr>
<tr><td>Việc dùng AI được công khai và đánh giá phản biện</td><td>Đề cương chấm khả năng phán đoán, không chỉ sản phẩm đầu ra</td></tr>
<tr><td>Các bước kiểm pháp lý và đạo đức được trình bày rõ</td><td>CLO5: tuân thủ và trách nhiệm là một phần của điểm</td></tr>
</table>
<div class="callout"><span class="badge">Lỗi hay gặp</span> Chọn sản phẩm có biên lợi nhuận quá mỏng để trả phí giao hàng; cho rằng sàn mang lại khách miễn phí mà không có cạnh tranh; sao chép marketing của thương hiệu lớn mà không có ngân sách như họ; và quên chuyện đổi trả. Hãy thử kế hoạch bằng các con số trước khi trau chuốt slide.</div>`,
  ]]);

const p7q = quiz('eec101-quiz-7', 'Quiz 7 — Ch 12: B2B e-commerce|||Quiz 7 — Ch 12: TMĐT B2B', [
  { id: 'q1', question: 'Office supplies, cleaning products and spare parts bought by a factory are examples of…|||Văn phòng phẩm, chất tẩy rửa và phụ tùng thay thế mà một nhà máy mua là ví dụ về…', options: ['direct goods|||hàng trực tiếp', 'contract purchasing|||mua theo hợp đồng', 'indirect goods (MRO)|||hàng gián tiếp (MRO)', 'an industry consortium|||một liên minh ngành'], correctIndex: 2, explanation: 'Indirect goods are not integrally involved in production; they are often called MRO — maintenance, repair and operations.|||Hàng gián tiếp không gắn liền với quá trình sản xuất; thường được gọi là MRO — bảo trì, sửa chữa và vận hành.' },
  { id: 'q2', question: 'Which B2B marketplace is industry-owned, vertical, and used mainly for contract purchasing of direct goods?|||Loại sàn B2B nào do ngành sở hữu, theo chiều dọc và chủ yếu dùng để mua hàng trực tiếp theo hợp đồng?', options: ['E-distributor|||Nhà phân phối điện tử', 'Industry consortium|||Liên minh ngành', 'E-procurement|||Mua sắm điện tử', 'Exchange|||Sàn giao dịch'], correctIndex: 1, explanation: 'Industry consortia are owned by major firms in an industry and have a buy-side bias; exchanges are independent and focus on spot purchases.|||Liên minh ngành do các doanh nghiệp lớn trong ngành sở hữu và thiên về bên mua; sàn giao dịch thì độc lập và tập trung vào mua giao ngay.' },
  { id: 'q3', question: 'A large retailer shares its sales data and forecasts with suppliers so they can replenish stock before it runs out. This practice, typical of private industrial networks, is called…|||Một nhà bán lẻ lớn chia sẻ dữ liệu bán hàng và dự báo với nhà cung cấp để họ bổ sung hàng trước khi hết. Cách làm này, đặc trưng của mạng công nghiệp riêng, được gọi là…', options: ['spot purchasing|||mua giao ngay', 'bid sniping|||bắn tỉa giá', 'disintermediation|||loại bỏ trung gian', 'collaborative resource planning, forecasting and replenishment (CPFR)|||hoạch định nguồn lực, dự báo và bổ sung hàng hợp tác (CPFR)'], correctIndex: 3, explanation: 'CPFR lets partners plan production and replenishment together using shared data.|||CPFR giúp các đối tác cùng lên kế hoạch sản xuất và bổ sung hàng dựa trên dữ liệu chia sẻ.' },
]);

const taiLieu = doc('eec101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EEC101 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for studying e-commerce as business, technology and society: the official syllabus and slides, the textbook, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official EEC101 syllabus (sylID 13733, approved by Decision 1318/QĐ-ĐHFPT of 27/11/2025) and the lecture slides. Key facts from the syllabus:</p>
<ul>
<li>3 credits. The course surveys the digital marketplace through three lenses — business, technology and society — and includes AI practice: building a marketing concept for a product launch on an e-commerce platform and a social, mobile and local customer-outreach strategy.</li>
<li>One main textbook only: Kenneth C. Laudon &amp; Carol Guercio Traver — <em>E-commerce 2023–2024: Business, Technology, Society</em>, 18th Global Edition (Pearson). All twelve chapters are covered, in order, by this course.</li>
<li>Tools named in the syllabus: Vietnamese legal documents, and the Coursera course <em>Generative AI: Impact, Considerations, and Ethical Issues</em>.</li>
</ul>
<table>
<tr><th>Assessment component</th><th>Weight</th></tr>
<tr><td>Group project — E-commerce Go-to-Market Strategy (4 stages)</td><td>30%</td></tr>
<tr><td>Individual assignment — memo, 500–700 words in 90 minutes: integrated digital strategy and ethics audit</td><td>15%</td></tr>
<tr><td>Participation</td><td>10%</td></tr>
<tr><td>Progress quiz — 30 questions on Chapters 1–5</td><td>15%</td></tr>
<tr><td>Final exam — 50 multiple-choice questions, 60 minutes, closed book</td><td>30%</td></tr>
</table>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/e-commerce-20232024-business-technology-society-global-edition/P200000010016/9781292745329" target="_blank" rel="noopener">E-commerce 2023–2024: Business, Technology, Society, Global Edition (18th edition)</a> — Kenneth C. Laudon &amp; Carol Guercio Traver (Pearson) — the main textbook; its twelve chapters are the twelve chapters of this course.</li>
<li><a href="https://openstax.org/details/books/principles-marketing" target="_blank" rel="noopener">Principles of Marketing</a> — OpenStax — free and peer-reviewed; Chapter 16 (direct, online, social media and mobile marketing), Chapter 18 (retailing and wholesaling) and Chapter 4 (business markets) support Parts 4, 6 and 7.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.coursera.org/learn/generative-ai-ethical-considerations-and-implications" target="_blank" rel="noopener">Generative AI: Impact, Considerations, and Ethical Issues (Coursera)</a> — the course named in the syllabus; supports lesson 4.4.</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — the national database of Vietnamese legal documents: check every Vietnamese rule on e-commerce, personal data and consumer protection here before relying on it.</li>
<li><a href="https://idea.gov.vn/" target="_blank" rel="noopener">E-commerce and Digital Economy Agency (Ministry of Industry and Trade)</a> — the Vietnamese state agency for e-commerce: policies, guidance and notices.</li>
<li><a href="https://www.vecom.vn/" target="_blank" rel="noopener">Vietnam E-commerce Association (VECOM)</a> — the industry association, with reports on e-business in Vietnam.</li>
<li><a href="https://www.wto.org/english/tratop_e/ecom_e/ecom_e.htm" target="_blank" rel="noopener">WTO — Electronic commerce</a> and <a href="https://uncitral.un.org/en/texts/ecommerce/modellaw/electronic_commerce" target="_blank" rel="noopener">UNCITRAL Model Law on Electronic Commerce</a> — the international framework for trade and electronic transactions.</li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener">MDN Web Docs — HTTP</a> — a clear, free reference for how the Web works (Part 2).</li>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council</a> and <a href="https://owasp.org/" target="_blank" rel="noopener">OWASP</a> — card-data security standards and the best-known web application security guidance (Part 3).</li>
<li><a href="https://commission.europa.eu/law/law-topic/data-protection_en" target="_blank" rel="noopener">European Commission — Data protection</a> — the official explanation of the GDPR (Part 5).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CrashCourse" target="_blank" rel="noopener">CrashCourse</a> — short series, including computer science episodes on how the Internet works.</li>
<li><a href="https://www.youtube.com/@GoogleAds" target="_blank" rel="noopener">Google Ads</a> — official tutorials on search and display advertising, bidding and measurement.</li>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — content, e-mail and social media marketing explained step by step.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — talks on digital strategy, platforms and data ethics.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — rebuild the three exercises (break-even, unit economics, CLV/CAC) as a model you can change.</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> and <a href="https://search.google.com/search-console/about" target="_blank" rel="noopener">Google Search Console</a> — measure traffic, conversion and search visibility.</li>
<li><a href="https://pagespeed.web.dev/" target="_blank" rel="noopener">PageSpeed Insights</a> — test the speed and mobile experience of any e-commerce site (CLO3).</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — check interest in your product idea over time and by region.</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — free courses and certifications in digital advertising and analytics.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — draw the presence map, customer journey and operations flow for the group project.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (progress quiz, Ch 1–5)</strong> — Parts 1–3: learn the definitions exactly — eight unique features, eight business-model elements, TCP/IP layers, cloud models, six security dimensions, digital signatures.</li>
<li><strong>Practise the numbers</strong> — redo Exercises 1–3 in a spreadsheet, then change one assumption at a time (fee, conversion, repeat rate) and watch the result.</li>
<li><strong>Analyse a real site</strong> — pick an online shop you use: identify its business and revenue model, test it with PageSpeed Insights, list its payment options and trust signals, and read its privacy policy against Part 5.</li>
<li><strong>Apply (final exam and project)</strong> — draft your Go-to-Market plan with the four stages of lesson 7.3, and revise Parts 4–7 with the quizzes.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">EEC101 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học TMĐT như kinh doanh, công nghệ và xã hội: đề cương &amp; slide chính thức, giáo trình, tài liệu chính thống miễn phí, kênh video, công cụ và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương chính thức của EEC101 (sylID 13733, ban hành theo Quyết định 1318/QĐ-ĐHFPT ngày 27/11/2025) và slide bài giảng. Thông tin chính từ đề cương:</p>
<ul>
<li>3 tín chỉ. Môn học khảo sát thị trường số qua ba lăng kính — kinh doanh, công nghệ và xã hội — và có phần thực hành AI: xây concept marketing ra mắt một sản phẩm trên nền tảng TMĐT và chiến lược tiếp cận khách hàng qua mạng xã hội, di động và địa phương.</li>
<li>Chỉ một sách chính: Kenneth C. Laudon &amp; Carol Guercio Traver — <em>E-commerce 2023–2024: Business, Technology, Society</em>, ấn bản 18, Global Edition (Pearson). Cả mười hai chương đều được môn học này bám theo, đúng thứ tự.</li>
<li>Công cụ đề cương nêu: văn bản pháp luật Việt Nam, và khoá học Coursera <em>Generative AI: Impact, Considerations, and Ethical Issues</em>.</li>
</ul>
<table>
<tr><th>Thành phần đánh giá</th><th>Trọng số</th></tr>
<tr><td>Dự án nhóm — Chiến lược Go-to-Market TMĐT (4 giai đoạn)</td><td>30%</td></tr>
<tr><td>Bài cá nhân — memo 500–700 từ trong 90 phút: chiến lược số tích hợp và đánh giá đạo đức</td><td>15%</td></tr>
<tr><td>Tham gia</td><td>10%</td></tr>
<tr><td>Quiz giữa kỳ — 30 câu, Chương 1–5</td><td>15%</td></tr>
<tr><td>Thi cuối kỳ — 50 câu trắc nghiệm, 60 phút, không dùng tài liệu</td><td>30%</td></tr>
</table>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/e-commerce-20232024-business-technology-society-global-edition/P200000010016/9781292745329" target="_blank" rel="noopener">E-commerce 2023–2024: Business, Technology, Society, Global Edition (ấn bản 18)</a> — Kenneth C. Laudon &amp; Carol Guercio Traver (Pearson) — giáo trình chính; mười hai chương của sách là mười hai chương của môn học này.</li>
<li><a href="https://openstax.org/details/books/principles-marketing" target="_blank" rel="noopener">Principles of Marketing</a> — OpenStax — miễn phí, có bình duyệt; Chương 16 (marketing trực tiếp, trực tuyến, mạng xã hội và di động), Chương 18 (bán lẻ và bán buôn) và Chương 4 (thị trường doanh nghiệp) hỗ trợ Phần 4, 6 và 7.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.coursera.org/learn/generative-ai-ethical-considerations-and-implications" target="_blank" rel="noopener">Generative AI: Impact, Considerations, and Ethical Issues (Coursera)</a> — khoá học đề cương nêu tên; hỗ trợ bài 4.4.</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — cơ sở dữ liệu quốc gia về văn bản pháp luật: kiểm mọi quy định Việt Nam về TMĐT, dữ liệu cá nhân và bảo vệ người tiêu dùng tại đây trước khi dựa vào.</li>
<li><a href="https://idea.gov.vn/" target="_blank" rel="noopener">Cục Thương mại điện tử và Kinh tế số (Bộ Công Thương)</a> — cơ quan nhà nước về TMĐT: chính sách, hướng dẫn và thông báo.</li>
<li><a href="https://www.vecom.vn/" target="_blank" rel="noopener">Hiệp hội Thương mại điện tử Việt Nam (VECOM)</a> — hiệp hội ngành, có các báo cáo về kinh doanh điện tử ở Việt Nam.</li>
<li><a href="https://www.wto.org/english/tratop_e/ecom_e/ecom_e.htm" target="_blank" rel="noopener">WTO — Thương mại điện tử</a> và <a href="https://uncitral.un.org/en/texts/ecommerce/modellaw/electronic_commerce" target="_blank" rel="noopener">Luật mẫu của UNCITRAL về thương mại điện tử</a> — khung quốc tế cho thương mại và giao dịch điện tử.</li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP" target="_blank" rel="noopener">MDN Web Docs — HTTP</a> — tài liệu tra cứu miễn phí, rõ ràng về cách Web hoạt động (Phần 2).</li>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council</a> và <a href="https://owasp.org/" target="_blank" rel="noopener">OWASP</a> — chuẩn bảo mật dữ liệu thẻ và hướng dẫn bảo mật ứng dụng web nổi tiếng nhất (Phần 3).</li>
<li><a href="https://commission.europa.eu/law/law-topic/data-protection_en" target="_blank" rel="noopener">Uỷ ban châu Âu — Bảo vệ dữ liệu</a> — giải thích chính thức về GDPR (Phần 5).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CrashCourse" target="_blank" rel="noopener">CrashCourse</a> — các loạt bài ngắn, gồm những tập khoa học máy tính về cách Internet hoạt động.</li>
<li><a href="https://www.youtube.com/@GoogleAds" target="_blank" rel="noopener">Google Ads</a> — hướng dẫn chính thức về quảng cáo tìm kiếm và hiển thị, đặt giá thầu và đo lường.</li>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — giải thích từng bước về content, e-mail và marketing mạng xã hội.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — các bài nói về chiến lược số, nền tảng và đạo đức dữ liệu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — dựng lại ba bài tập (hoà vốn, kinh tế đơn vị, CLV/CAC) thành mô hình có thể thay đổi giả định.</li>
<li><a href="https://analytics.google.com/" target="_blank" rel="noopener">Google Analytics</a> và <a href="https://search.google.com/search-console/about" target="_blank" rel="noopener">Google Search Console</a> — đo lưu lượng, chuyển đổi và mức hiển thị trên tìm kiếm.</li>
<li><a href="https://pagespeed.web.dev/" target="_blank" rel="noopener">PageSpeed Insights</a> — kiểm tốc độ và trải nghiệm di động của bất kỳ website TMĐT nào (CLO3).</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — xem mức quan tâm tới ý tưởng sản phẩm của bạn theo thời gian và khu vực.</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — khoá học và chứng chỉ miễn phí về quảng cáo số và phân tích dữ liệu.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — vẽ bản đồ hiện diện, hành trình khách hàng và sơ đồ vận hành cho dự án nhóm.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (quiz giữa kỳ, Ch 1–5)</strong> — Phần 1–3: học chính xác các định nghĩa — tám đặc trưng độc đáo, tám yếu tố mô hình kinh doanh, các tầng TCP/IP, mô hình đám mây, sáu chiều bảo mật, chữ ký số.</li>
<li><strong>Luyện các con số</strong> — làm lại Bài tập 1–3 trên bảng tính, rồi đổi từng giả định một (phí, tỷ lệ chuyển đổi, tỷ lệ mua lại) và quan sát kết quả.</li>
<li><strong>Phân tích một website thật</strong> — chọn một shop online bạn hay dùng: xác định mô hình kinh doanh và mô hình doanh thu, kiểm bằng PageSpeed Insights, liệt kê phương thức thanh toán và tín hiệu tin cậy, đọc chính sách quyền riêng tư và đối chiếu với Phần 5.</li>
<li><strong>Vận dụng (thi cuối kỳ và dự án)</strong> — phác thảo kế hoạch Go-to-Market theo bốn giai đoạn của bài 7.3, và ôn Phần 4–7 bằng các bài quiz.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'EEC101',
    slug: 'eec101-introduction-to-e-commerce',
    title: 'Introduction to E-Commerce',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EEC101.webp',
    shortDescription: 'E-commerce as business, technology and society, following Laudon & Traver’s 12 chapters: business models, Internet infrastructure, security and payments, digital marketing, ethics and law, retail, media, B2B. Bilingual, with exercises and quizzes.|||TMĐT qua ba lăng kính kinh doanh, công nghệ, xã hội theo 12 chương Laudon & Traver: mô hình kinh doanh, hạ tầng, bảo mật, thanh toán, marketing số, đạo đức, pháp luật, bán lẻ, B2B. Song ngữ, có bài tập, quiz.',
    description: 'Môn <strong>EEC101 — Introduction to E-Commerce (Nhập môn thương mại điện tử)</strong> (khối Quản trị Kinh doanh, kỳ 3) bám đúng đề cương FLM (sylID 13733) và <strong>giáo trình chính duy nhất</strong> Laudon &amp; Traver — <em>E-commerce 2023–2024: Business, Technology, Society</em> (Pearson, ấn bản 18, Global Edition): cả <strong>12 chương, đúng thứ tự</strong>, chia thành 7 phần. <strong>Nền tảng</strong> (tám đặc trưng độc đáo, các loại TMĐT, tám yếu tố mô hình kinh doanh, mô hình B2C và B2B) → <strong>hạ tầng và xây dựng sự hiện diện</strong> (TCP/IP, DNS, đám mây, Web, ứng dụng di động, SDLC, website đáp ứng) → <strong>bảo mật và thanh toán</strong> (sáu chiều bảo mật, mã hoá, chữ ký số, TLS, ví điện tử, BNPL, QR và COD ở Việt Nam) → <strong>marketing</strong> (hành vi người tiêu dùng trực tuyến, công cụ và chỉ số CTR, CPC, CPA, ROAS, quảng cáo programmatic, marketing xã hội – di động – địa phương, thực hành AI tạo sinh có đánh giá phản biện) → <strong>đạo đức và pháp luật</strong> (quyền riêng tư, GDPR, Nghị định 13/2023/NĐ-CP, sở hữu trí tuệ, quản trị Internet) → <strong>bán lẻ, dịch vụ, truyền thông và cộng đồng trực tuyến</strong> → <strong>TMĐT B2B</strong> (mua sắm, chuỗi cung ứng, sàn B2B, mạng công nghiệp riêng) và hướng dẫn dự án Go-to-Market bốn giai đoạn. Song ngữ Anh–Việt, tình huống và số liệu giả định đã kiểm bằng máy, ba bài tập kèm lời giải, quiz trắc nghiệm cuối mỗi phần.',
    whatYouLearn: 'Giải thích TMĐT, tám đặc trưng độc đáo của công nghệ TMĐT, các loại TMĐT và lược sử phát triển\nPhân tích mô hình kinh doanh theo tám yếu tố, phân biệt các mô hình B2C, B2B và mô hình doanh thu để giải thích cách tạo giá trị và lợi thế cạnh tranh\nMô tả hạ tầng Internet, Web, đám mây, nền tảng di động và quy trình xây dựng website, ứng dụng TMĐT\nPhân tích rủi ro bảo mật và hệ thống thanh toán, đề xuất chiến lược phi kỹ thuật giảm rủi ro và xây niềm tin\nVận dụng công cụ và chỉ số marketing số, marketing xã hội – di động – địa phương, và dùng AI tạo sinh có đánh giá phản biện\nĐánh giá tính khả thi thương mại, kinh tế đơn vị và trải nghiệm khách hàng của một website hay nền tảng TMĐT\nNhận diện vấn đề đạo đức, quyền riêng tư, sở hữu trí tuệ, quản trị Internet và ý thức tuân thủ pháp luật trong thương mại số\nGiải thích bán lẻ, dịch vụ, truyền thông, cộng đồng trực tuyến và TMĐT B2B, chuỗi cung ứng; lập chiến lược Go-to-Market bốn giai đoạn',
    requirements: 'Nên học trước MKT101 — Marketing Principles (khái niệm marketing cơ bản)\nSố học phần trăm và bảng tính (Excel, Google Sheets) để làm bài tập\nĐọc hiểu tiếng Anh chuyên ngành ở mức cơ bản (giáo trình Laudon & Traver bằng tiếng Anh)',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Ba lăng kính kinh doanh – công nghệ – xã hội, lộ trình 12 chương, cách đánh giá.', lessons: [intro] },
    { title: 'Part 1 — Foundations and business models (Ch 1–2)|||Phần 1 — Nền tảng và mô hình kinh doanh (Ch 1–2)', description: 'Tám đặc trưng độc đáo, các loại TMĐT, tám yếu tố mô hình kinh doanh, B2C, B2B, chiến lược.', lessons: [p11, p12, p13, p1e, p1q] },
    { title: 'Part 2 — Infrastructure and building a presence (Ch 3–4)|||Phần 2 — Hạ tầng và xây dựng sự hiện diện (Ch 3–4)', description: 'TCP/IP, DNS, đám mây, Web, ứng dụng di động, SDLC, phần mềm, phần cứng, sàn hay website riêng.', lessons: [p21, p22, p23, p2e, p2q] },
    { title: 'Part 3 — Security and payment systems (Ch 5)|||Phần 3 — Bảo mật và hệ thống thanh toán (Ch 5)', description: 'Sáu chiều bảo mật, mối đe doạ, mã hoá, chữ ký số, TLS, kế hoạch bảo mật, thẻ, ví, BNPL, QR, COD.', lessons: [p31, p32, p33, p3q] },
    { title: 'Part 4 — Marketing and advertising (Ch 6–7)|||Phần 4 — Marketing và quảng cáo (Ch 6–7)', description: 'Người tiêu dùng trực tuyến, công cụ, chỉ số, programmatic, xã hội – di động – địa phương, thực hành AI.', lessons: [p41, p42, p43, p44, p4q] },
    { title: 'Part 5 — Ethics and law (Ch 8)|||Phần 5 — Đạo đức và pháp luật (Ch 8)', description: 'Bốn chiều đạo đức, quyền riêng tư, GDPR, Nghị định 13/2023, sở hữu trí tuệ, quản trị Internet, Big Tech.', lessons: [p51, p52, p5q] },
    { title: 'Part 6 — Retail, services, media and communities (Ch 9–11)|||Phần 6 — Bán lẻ, dịch vụ, truyền thông và cộng đồng (Ch 9–11)', description: 'Tính khả thi, mô hình bán lẻ, dịch vụ trực tuyến, nội dung số, nhà sáng tạo, mạng xã hội, đấu giá, cổng thông tin.', lessons: [p61, p62, p63, p64, p6e, p6q] },
    { title: 'Part 7 — B2B e-commerce and the Go-to-Market project (Ch 12)|||Phần 7 — TMĐT B2B và dự án Go-to-Market (Ch 12)', description: 'Mua sắm, chuỗi cung ứng, thương mại cộng tác, sàn B2B, mạng công nghiệp riêng, hướng dẫn dự án nhóm.', lessons: [p71, p72, p73, p7q] },
  ],
};
