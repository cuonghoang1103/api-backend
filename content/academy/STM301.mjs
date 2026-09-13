/**
 * STM301 — Strategic Management (Quản trị chiến lược). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám cấu trúc giáo trình quản trị chiến lược chuẩn quốc tế: Fred R. David & Forest R. David —
 * Strategic Management: Concepts and Cases (khung ba giai đoạn: nhập liệu – kết hợp – quyết định);
 * Thompson, Peteraf, Gamble & Strickland — Crafting & Executing Strategy; Hill, Schilling & Jones —
 * Strategic Management: Theory. Nội dung: quá trình quản trị chiến lược, tầm nhìn – sứ mệnh – mục tiêu,
 * phân tích bên ngoài (PESTEL, năm lực lượng, nhóm chiến lược, vòng đời ngành, EFE, CPM), phân tích bên
 * trong (nguồn lực, VRIO, chuỗi giá trị, năng lực cốt lõi, IFE), chiến lược cấp kinh doanh / công ty /
 * quốc tế, công cụ lựa chọn (SWOT/TOWS, SPACE, BCG, IE, ma trận chiến lược chính, QSPM), thực thi, đánh
 * giá – kiểm soát, thẻ điểm cân bằng, quản trị công ty và đạo đức. MGT103 đã giới thiệu SWOT/BCG/Porter
 * ở mức nhập môn — môn này đi sâu vào công cụ định lượng của David và thực thi.
 * Song ngữ + ví dụ số (đã kiểm bằng máy; tình huống và số liệu là GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('stm301-0-1-overview', 'Course overview: what strategic management is|||Tổng quan: quản trị chiến lược là gì',
  'Chiến lược và quản trị chiến lược, lợi thế cạnh tranh, ba giai đoạn hoạch định – thực thi – đánh giá, ba cấp chiến lược, chiến lược dự định và chiến lược nảy sinh, môn này đi sâu hơn MGT103 ở đâu, lộ trình môn.',
  [[
    `<span class="eyebrow">STM301 · Lesson 0.1 · Overview</span>
<h2>Strategic Management</h2>
<p class="lead">Why do some firms in the same industry earn persistently higher returns than their rivals? Strategic management tries to answer that question — and to turn the answer into decisions that managers can formulate, implement and evaluate.</p>
<h3>Strategy, strategic management and competitive advantage</h3>
<p>A <strong>strategy</strong> is a set of related actions that managers take to reach long-term objectives and to improve the firm's performance relative to rivals. <strong>Strategic management</strong> is the art and science of formulating, implementing and evaluating cross-functional decisions that enable an organization to achieve its objectives. Its central purpose is to build and sustain a <strong>competitive advantage</strong>: something the firm does especially well compared with rivals, which shows up as profitability above the industry average over a long period.</p>
<h3>The three stages of the process</h3>
<table>
<tr><th>Stage</th><th>Key activities</th><th>Tools in this course</th></tr>
<tr><td>Strategy formulation</td><td>Develop a vision and mission, identify external opportunities and threats, determine internal strengths and weaknesses, set long-term objectives, generate and choose strategies</td><td>PESTEL, five forces, EFE, CPM, VRIO, value chain, IFE, SWOT/TOWS, SPACE, BCG, IE, QSPM</td></tr>
<tr><td>Strategy implementation</td><td>Set annual objectives, devise policies, allocate resources, match structure and culture to the strategy, lead change</td><td>Organizational structure, the 7-S framework, EPS/EBIT analysis</td></tr>
<tr><td>Strategy evaluation</td><td>Review the underlying bases of the strategy, measure performance, take corrective action</td><td>Rumelt's four criteria, the balanced scorecard</td></tr>
</table>
<p>The process is a loop, not a line: evaluation feeds new information back into formulation.</p>
<h3>Levels of strategy</h3>
<ul>
<li><strong>Corporate level</strong> — in which businesses and markets should we compete? (integration, diversification, acquisitions, alliances, international expansion)</li>
<li><strong>Business level</strong> — how do we compete within one industry? (cost leadership, differentiation, focus, blue ocean)</li>
<li><strong>Functional level</strong> — how do marketing, operations, finance, HR and R&amp;D support the chosen strategy?</li>
</ul>
<h3>Intended and emergent strategy</h3>
<p>Not every strategy is planned in advance. Following Henry Mintzberg, the <em>intended</em> strategy on paper is partly realized as a <em>deliberate</em> strategy and partly abandoned, while <em>emergent</em> strategies grow out of unplanned responses to events. The <em>realized</em> strategy combines both. Good strategic management therefore joins rigorous analysis with learning from what actually happens.</p>
<h3>How this course goes beyond MGT103</h3>
<p>MGT103 introduced SWOT, the BCG matrix and Porter's ideas at an introductory level. STM301 goes deeper in two directions: it uses the <strong>quantitative matrices</strong> of Fred David's framework — EFE, CPM, IFE, SPACE, IE and QSPM — to turn judgments into weighted scores that can be discussed and challenged, and it spends a full part on <strong>implementation and control</strong>, where many sound strategies fail.</p>
<h3>Roadmap</h3>
<p>Part 1: vision, mission, objectives and the external assessment · Part 2: the internal assessment · Part 3: business-, corporate- and international-level strategies · Part 4: matching tools (SWOT/TOWS, SPACE, BCG, IE, grand strategy) · Part 5: choosing with the QSPM, implementation, evaluation, governance and ethics. All cases are fictional and all numbers illustrative; every calculation has been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> A strategy is a set of choices about what to do <em>and what not to do</em>. A plan that tries to be everything to everyone is not yet a strategy.</div>`,
    `<span class="eyebrow">STM301 · Bài 0.1 · Tổng quan</span>
<h2>Quản trị chiến lược</h2>
<p class="lead">Vì sao trong cùng một ngành, có doanh nghiệp liên tục đạt lợi nhuận cao hơn đối thủ? Quản trị chiến lược tìm câu trả lời cho câu hỏi đó — và biến câu trả lời thành những quyết định mà nhà quản trị có thể hoạch định, thực thi và đánh giá.</p>
<h3>Chiến lược, quản trị chiến lược và lợi thế cạnh tranh</h3>
<p><strong>Chiến lược</strong> là tập hợp các hành động có liên hệ với nhau mà nhà quản trị thực hiện để đạt mục tiêu dài hạn và cải thiện kết quả của doanh nghiệp so với đối thủ. <strong>Quản trị chiến lược</strong> là nghệ thuật và khoa học của việc hoạch định, thực thi và đánh giá các quyết định liên chức năng giúp tổ chức đạt được mục tiêu. Mục đích trung tâm của nó là xây dựng và duy trì <strong>lợi thế cạnh tranh</strong>: điều mà doanh nghiệp làm đặc biệt tốt so với đối thủ, thể hiện thành khả năng sinh lời cao hơn mức trung bình ngành trong thời gian dài.</p>
<h3>Ba giai đoạn của quá trình</h3>
<table>
<tr><th>Giai đoạn</th><th>Hoạt động chính</th><th>Công cụ trong môn học</th></tr>
<tr><td>Hoạch định chiến lược</td><td>Xây dựng tầm nhìn và sứ mệnh, nhận diện cơ hội và nguy cơ bên ngoài, xác định điểm mạnh và điểm yếu bên trong, đặt mục tiêu dài hạn, hình thành và lựa chọn chiến lược</td><td>PESTEL, năm lực lượng, EFE, CPM, VRIO, chuỗi giá trị, IFE, SWOT/TOWS, SPACE, BCG, IE, QSPM</td></tr>
<tr><td>Thực thi chiến lược</td><td>Đặt mục tiêu hằng năm, xây dựng chính sách, phân bổ nguồn lực, điều chỉnh cơ cấu và văn hoá cho phù hợp với chiến lược, dẫn dắt thay đổi</td><td>Cơ cấu tổ chức, mô hình 7-S, phân tích EPS/EBIT</td></tr>
<tr><td>Đánh giá chiến lược</td><td>Rà soát các cơ sở nền tảng của chiến lược, đo lường kết quả, thực hiện hành động điều chỉnh</td><td>Bốn tiêu chí của Rumelt, thẻ điểm cân bằng</td></tr>
</table>
<p>Quá trình này là một vòng lặp chứ không phải một đường thẳng: kết quả đánh giá đưa thông tin mới trở lại giai đoạn hoạch định.</p>
<h3>Các cấp chiến lược</h3>
<ul>
<li><strong>Cấp công ty</strong> — nên cạnh tranh trong những ngành kinh doanh và thị trường nào? (hội nhập, đa dạng hoá, mua lại, liên minh, mở rộng quốc tế)</li>
<li><strong>Cấp kinh doanh</strong> — cạnh tranh thế nào trong một ngành? (dẫn đầu chi phí, khác biệt hoá, tập trung, đại dương xanh)</li>
<li><strong>Cấp chức năng</strong> — marketing, vận hành, tài chính, nhân sự và R&amp;D hỗ trợ chiến lược đã chọn ra sao?</li>
</ul>
<h3>Chiến lược dự định và chiến lược nảy sinh</h3>
<p>Không phải chiến lược nào cũng được lên kế hoạch từ trước. Theo Henry Mintzberg, chiến lược <em>dự định</em> trên giấy một phần được hiện thực hoá thành chiến lược <em>có chủ đích</em>, một phần bị bỏ dở, trong khi các chiến lược <em>nảy sinh</em> hình thành từ những phản ứng không định trước trước các sự kiện. Chiến lược <em>thực tế</em> là sự kết hợp của cả hai. Vì vậy, quản trị chiến lược tốt kết hợp phân tích chặt chẽ với việc học hỏi từ những gì thực sự diễn ra.</p>
<h3>Môn này đi xa hơn MGT103 ở đâu</h3>
<p>MGT103 đã giới thiệu SWOT, ma trận BCG và các ý tưởng của Porter ở mức nhập môn. STM301 đi sâu theo hai hướng: dùng các <strong>ma trận định lượng</strong> trong khung của Fred David — EFE, CPM, IFE, SPACE, IE và QSPM — để biến nhận định chủ quan thành điểm số có trọng số có thể thảo luận và phản biện, và dành trọn một phần cho <strong>thực thi và kiểm soát</strong>, nơi nhiều chiến lược đúng đắn vẫn thất bại.</p>
<h3>Lộ trình</h3>
<p>Phần 1: tầm nhìn, sứ mệnh, mục tiêu và đánh giá môi trường bên ngoài · Phần 2: đánh giá nội bộ · Phần 3: chiến lược cấp kinh doanh, cấp công ty và quốc tế · Phần 4: công cụ kết hợp (SWOT/TOWS, SPACE, BCG, IE, ma trận chiến lược chính) · Phần 5: lựa chọn bằng QSPM, thực thi, đánh giá, quản trị công ty và đạo đức. Mọi tình huống đều là giả định và mọi số liệu đều là số minh hoạ; mọi phép tính đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Chiến lược là tập hợp những lựa chọn về việc sẽ làm <em>và việc sẽ không làm</em>. Một kế hoạch cố gắng làm mọi thứ cho mọi người thì chưa phải là chiến lược.</div>`,
  ]]);

const c1 = doc('stm301-1-1-vision-mission-objectives', '1.1 — Vision, mission & long-term objectives|||1.1 — Tầm nhìn, sứ mệnh & mục tiêu dài hạn',
  'Phân biệt tầm nhìn, sứ mệnh và giá trị cốt lõi; chín thành phần của một bản tuyên bố sứ mệnh theo David, có ví dụ gắn nhãn từng thành phần; tiêu chí của sứ mệnh tốt; mục tiêu dài hạn: SMART, mục tiêu tài chính và mục tiêu chiến lược, hệ thống mục tiêu.',
  [[
    `<span class="eyebrow">STM301 · Part 1 · Lesson 1.1</span>
<h2>Vision, mission &amp; long-term objectives</h2>
<p class="lead">Every strategic plan starts by answering two questions: "What do we want to become?" (vision) and "What is our business?" (mission). Only then can objectives and strategies be judged as right or wrong.</p>
<h3>Vision, mission and values</h3>
<table>
<tr><th>Statement</th><th>Question it answers</th><th>Characteristics</th></tr>
<tr><td>Vision</td><td>What do we want to become?</td><td>Short (often one sentence), future-oriented, inspiring; sets a direction for the long term</td></tr>
<tr><td>Mission</td><td>What is our business — whom do we serve, with what, and how?</td><td>Enduring statement of purpose that distinguishes the firm from others of its type; broader in scope and more specific than the vision</td></tr>
<tr><td>Core values</td><td>How will we behave on the way?</td><td>A few principles (integrity, customer focus…) that guide decisions and culture</td></tr>
</table>
<h3>Nine components of a mission statement (David)</h3>
<ol>
<li><strong>Customers</strong> — who are the firm's customers?</li>
<li><strong>Products or services</strong> — what are the major offerings?</li>
<li><strong>Markets</strong> — where, geographically, does the firm compete?</li>
<li><strong>Technology</strong> — is the firm technologically current?</li>
<li><strong>Concern for survival, growth and profitability</strong> — is the firm committed to financial soundness?</li>
<li><strong>Philosophy</strong> — what are its basic beliefs, values and ethical priorities?</li>
<li><strong>Self-concept</strong> — what is its distinctive competence or major competitive advantage?</li>
<li><strong>Concern for public image</strong> — is it responsive to social, community and environmental concerns?</li>
<li><strong>Concern for employees</strong> — are employees a valuable asset?</li>
</ol>
<p>An illustrative mission for a fictional chain, Moc Lan Coffee, with each component tagged:</p>
<pre><code class="language-text">Moc Lan Coffee serves young urban professionals and students (1)
handcrafted coffee drinks and light meals (2) in stores and by delivery
in Vietnam's major cities (3), supported by our own central roastery and
membership app (4). We grow profitably so that we can keep investing (5),
guided by honesty and fair dealing with coffee farmers (6). Our edge is
Vietnamese-origin beans roasted fresh every day (7). We source responsibly
and cut single-use plastic (8), and we train and promote our baristas
from within (9).</code></pre>
<h3>What makes a mission statement effective</h3>
<ul>
<li><strong>Broad but not vague</strong> — wide enough to allow creative growth, narrow enough to rule out some options.</li>
<li><strong>Customer-oriented</strong> — it describes the needs satisfied ("helping people stay connected"), not only the product ("we sell phones").</li>
<li><strong>Enduring and motivating</strong> — it should not change every year and should give employees a reason to care.</li>
<li><strong>Reconciles stakeholders</strong> — shareholders, employees, customers, suppliers, communities and government often want different things; the mission states the priorities.</li>
</ul>
<h3>Long-term objectives</h3>
<p>Objectives turn the mission into measurable results, usually for a horizon longer than one year (often two to five years). They should be <strong>SMART</strong> — specific, measurable, achievable, relevant and time-bound — and also consistent with each other and clearly prioritized.</p>
<table>
<tr><th>Type</th><th>Focus</th><th>Illustrative example (Moc Lan)</th></tr>
<tr><td>Financial objectives</td><td>Revenue growth, profitability, return on investment, cash flow</td><td>Raise same-store sales (stores open at least 12 months) by 5% a year for the next three years</td></tr>
<tr><td>Strategic objectives</td><td>Market position, customer satisfaction, quality, innovation, reputation</td><td>Reach a top-two customer-satisfaction score among coffee chains in our cities within three years</td></tr>
</table>
<p>A balance matters: pursuing only short-term financial targets tends to erode the strategic position that produces future profits. Long-term objectives are later broken into <strong>annual objectives</strong> for each division and function (Part 5).</p>
<div class="callout"><span class="badge">Watch out</span> "Maximize profit" or "be the best" is not an objective: it has no number, no deadline and no owner, so nobody can tell whether it has been achieved.</div>`,
    `<span class="eyebrow">STM301 · Phần 1 · Bài 1.1</span>
<h2>Tầm nhìn, sứ mệnh &amp; mục tiêu dài hạn</h2>
<p class="lead">Mọi kế hoạch chiến lược đều bắt đầu bằng hai câu hỏi: "Chúng ta muốn trở thành gì?" (tầm nhìn) và "Chúng ta kinh doanh cái gì?" (sứ mệnh). Chỉ khi trả lời xong mới có thể đánh giá mục tiêu và chiến lược là đúng hay sai.</p>
<h3>Tầm nhìn, sứ mệnh và giá trị cốt lõi</h3>
<table>
<tr><th>Tuyên bố</th><th>Câu hỏi trả lời</th><th>Đặc điểm</th></tr>
<tr><td>Tầm nhìn</td><td>Chúng ta muốn trở thành gì?</td><td>Ngắn gọn (thường một câu), hướng tới tương lai, truyền cảm hứng; định hướng dài hạn</td></tr>
<tr><td>Sứ mệnh</td><td>Chúng ta kinh doanh cái gì — phục vụ ai, bằng gì, và bằng cách nào?</td><td>Tuyên bố lâu dài về mục đích, phân biệt doanh nghiệp với các doanh nghiệp cùng loại; phạm vi rộng hơn và cụ thể hơn tầm nhìn</td></tr>
<tr><td>Giá trị cốt lõi</td><td>Chúng ta sẽ hành xử thế nào trên đường đi?</td><td>Vài nguyên tắc (chính trực, hướng tới khách hàng…) dẫn dắt quyết định và văn hoá</td></tr>
</table>
<h3>Chín thành phần của bản tuyên bố sứ mệnh (David)</h3>
<ol>
<li><strong>Khách hàng</strong> — khách hàng của doanh nghiệp là ai?</li>
<li><strong>Sản phẩm hoặc dịch vụ</strong> — sản phẩm, dịch vụ chủ yếu là gì?</li>
<li><strong>Thị trường</strong> — doanh nghiệp cạnh tranh ở khu vực địa lý nào?</li>
<li><strong>Công nghệ</strong> — doanh nghiệp có theo kịp công nghệ không?</li>
<li><strong>Quan tâm tới sự tồn tại, tăng trưởng và khả năng sinh lời</strong> — doanh nghiệp có cam kết về sự lành mạnh tài chính không?</li>
<li><strong>Triết lý</strong> — niềm tin cơ bản, giá trị và ưu tiên đạo đức là gì?</li>
<li><strong>Tự đánh giá về mình</strong> — năng lực khác biệt hay lợi thế cạnh tranh chủ yếu là gì?</li>
<li><strong>Quan tâm tới hình ảnh cộng đồng</strong> — doanh nghiệp có đáp ứng các mối quan tâm xã hội, cộng đồng và môi trường không?</li>
<li><strong>Quan tâm tới nhân viên</strong> — nhân viên có được coi là tài sản quý không?</li>
</ol>
<p>Một bản sứ mệnh minh hoạ của chuỗi giả định Cà phê Mộc Lan, có gắn số từng thành phần:</p>
<pre><code class="language-text">Cà phê Mộc Lan phục vụ người trẻ đi làm và sinh viên ở đô thị (1)
đồ uống cà phê pha thủ công và món ăn nhẹ (2) tại cửa hàng và qua giao hàng
ở các thành phố lớn của Việt Nam (3), dựa trên xưởng rang trung tâm và ứng dụng
thành viên của riêng mình (4). Chúng tôi tăng trưởng có lãi để tiếp tục đầu tư (5),
lấy trung thực và sự công bằng với người trồng cà phê làm kim chỉ nam (6). Lợi thế
của chúng tôi là hạt cà phê nguồn gốc Việt Nam được rang mới mỗi ngày (7). Chúng tôi
thu mua có trách nhiệm và cắt giảm nhựa dùng một lần (8), đào tạo và đề bạt
nhân viên pha chế từ chính đội ngũ của mình (9).</code></pre>
<h3>Thế nào là một bản sứ mệnh hiệu quả</h3>
<ul>
<li><strong>Rộng nhưng không mơ hồ</strong> — đủ rộng để tăng trưởng sáng tạo, đủ hẹp để loại bỏ một số hướng đi.</li>
<li><strong>Hướng tới khách hàng</strong> — mô tả nhu cầu được thoả mãn ("giúp mọi người luôn kết nối"), chứ không chỉ mô tả sản phẩm ("chúng tôi bán điện thoại").</li>
<li><strong>Lâu dài và tạo động lực</strong> — không thay đổi hằng năm, và cho nhân viên một lý do để gắn bó.</li>
<li><strong>Dung hoà các bên liên quan</strong> — cổ đông, nhân viên, khách hàng, nhà cung cấp, cộng đồng và nhà nước thường mong muốn những điều khác nhau; sứ mệnh nêu rõ thứ tự ưu tiên.</li>
</ul>
<h3>Mục tiêu dài hạn</h3>
<p>Mục tiêu biến sứ mệnh thành kết quả đo lường được, thường cho khoảng thời gian dài hơn một năm (hay gặp là hai đến năm năm). Mục tiêu cần đạt chuẩn <strong>SMART</strong> — cụ thể, đo lường được, khả thi, phù hợp và có thời hạn — đồng thời nhất quán với nhau và có thứ tự ưu tiên rõ ràng.</p>
<table>
<tr><th>Loại</th><th>Trọng tâm</th><th>Ví dụ minh hoạ (Mộc Lan)</th></tr>
<tr><td>Mục tiêu tài chính</td><td>Tăng trưởng doanh thu, khả năng sinh lời, tỷ suất lợi nhuận trên vốn đầu tư, dòng tiền</td><td>Tăng doanh số cửa hàng hiện hữu (same-store sales — chỉ tính các cửa hàng đã hoạt động từ 12 tháng trở lên) 5% mỗi năm trong ba năm tới</td></tr>
<tr><td>Mục tiêu chiến lược</td><td>Vị thế thị trường, sự hài lòng của khách hàng, chất lượng, đổi mới, danh tiếng</td><td>Lọt vào nhóm hai chuỗi cà phê có điểm hài lòng khách hàng cao nhất tại các thành phố đang hoạt động trong vòng ba năm</td></tr>
</table>
<p>Cần giữ cân bằng: chỉ theo đuổi chỉ tiêu tài chính ngắn hạn thường làm xói mòn vị thế chiến lược vốn là nguồn tạo ra lợi nhuận tương lai. Mục tiêu dài hạn sau đó được chia nhỏ thành <strong>mục tiêu hằng năm</strong> cho từng bộ phận và chức năng (Phần 5).</p>
<div class="callout"><span class="badge">Cẩn thận</span> "Tối đa hoá lợi nhuận" hay "trở thành số một" không phải là mục tiêu: không có con số, không có thời hạn, không có người chịu trách nhiệm, nên không ai biết được đã đạt hay chưa.</div>`,
  ]]);

const c2 = doc('stm301-1-2-external-industry-analysis', '1.2 — The external assessment: PESTEL, five forces, strategic groups & life cycle|||1.2 — Đánh giá bên ngoài: PESTEL, năm lực lượng, nhóm chiến lược & vòng đời ngành',
  'Môi trường vĩ mô theo PESTEL; mô hình năm lực lượng cạnh tranh của Porter và các yếu tố quyết định sức mạnh từng lực lượng; nhóm chiến lược và bản đồ nhóm chiến lược; vòng đời ngành năm giai đoạn; yếu tố thành công then chốt và động lực thay đổi của ngành.',
  [[
    `<span class="eyebrow">STM301 · Part 1 · Lesson 1.2</span>
<h2>The external assessment</h2>
<p class="lead">The purpose of an external audit is to build a short, actionable list of <strong>opportunities</strong> that could benefit the firm and <strong>threats</strong> it should avoid. These are trends and events largely beyond the control of any single firm.</p>
<h3>The macro-environment: PESTEL</h3>
<table>
<tr><th>Force</th><th>Typical variables</th></tr>
<tr><td>Political</td><td>Government stability, trade policy, tax policy, public investment priorities</td></tr>
<tr><td>Economic</td><td>GDP growth, interest rates, inflation, exchange rates, disposable income</td></tr>
<tr><td>Social</td><td>Demographics, urbanization, lifestyles, attitudes to health and work</td></tr>
<tr><td>Technological</td><td>Digital platforms, automation, new materials, speed of product obsolescence</td></tr>
<tr><td>Environmental</td><td>Climate risk, resource scarcity, waste and emissions expectations</td></tr>
<tr><td>Legal</td><td>Competition, consumer-protection, labour, data-protection and product-safety rules</td></tr>
</table>
<p>David groups the same ground into economic; social, cultural, demographic and natural environment; political, governmental and legal; technological; and competitive forces. The label matters less than asking, for each trend: <em>does it change demand, costs or competition in our industry?</em></p>
<h3>The industry: Porter's five forces</h3>
<p>Porter's model explains why average profitability differs between industries. The stronger the forces, the lower the profit potential.</p>
<table>
<tr><th>Force</th><th>Stronger (worse for incumbents) when…</th></tr>
<tr><td>Rivalry among existing firms</td><td>Many equally sized rivals, slow industry growth, high fixed costs, little differentiation, high exit barriers</td></tr>
<tr><td>Threat of new entrants</td><td>Weak entry barriers: few economies of scale, low capital needs, easy access to distribution, weak brand loyalty, permissive regulation</td></tr>
<tr><td>Threat of substitutes</td><td>Products from other industries meet the same need at an attractive price–performance ratio and switching is cheap</td></tr>
<tr><td>Bargaining power of suppliers</td><td>Few suppliers, no good substitute inputs, high switching costs, credible threat of forward integration</td></tr>
<tr><td>Bargaining power of buyers</td><td>Concentrated buyers or large purchase volumes, standardized products, low switching costs, price-sensitive buyers, threat of backward integration</td></tr>
</table>
<p>Hill and colleagues also stress <strong>complementors</strong> — firms whose products add value to yours (for example, app developers for a smartphone platform) — which can strengthen demand for the whole industry.</p>
<h3>Strategic groups</h3>
<p>A <strong>strategic group</strong> is a set of firms in an industry that follow similar strategies — similar price and quality levels, channels, product breadth or geographic coverage. A <em>strategic group map</em> plots firms on two such dimensions (bubble size = revenue share). Your closest rivals are usually in your own group; moving to another group is limited by <strong>mobility barriers</strong> (brand, scale, distribution, know-how).</p>
<h3>The industry life cycle</h3>
<table>
<tr><th>Stage</th><th>Typical conditions</th><th>Strategic emphasis</th></tr>
<tr><td>Embryonic</td><td>New technology, low demand, high prices, few firms</td><td>Build demand, develop the product</td></tr>
<tr><td>Growth</td><td>Demand rises fast, rivalry is low, entry is attractive</td><td>Capture share, expand capacity and distribution</td></tr>
<tr><td>Shakeout</td><td>Growth slows, excess capacity appears, rivalry intensifies</td><td>Cut costs, build loyalty; weak firms exit</td></tr>
<tr><td>Mature</td><td>Market saturated, high entry barriers, price competition</td><td>Efficiency, differentiation, defend share</td></tr>
<tr><td>Decline</td><td>Demand falls because of substitutes, demographics or technology</td><td>Leadership, niche, harvest or divest</td></tr>
</table>
<h3>From analysis to a list of factors</h3>
<p>The audit ends by naming the industry's <strong>key success factors</strong> (what every firm must do well to win, used in the CPM in lesson 1.3), its <strong>driving forces</strong> (the few trends most likely to change the industry's structure, such as technological change or entry of major firms) and a prioritized list of opportunities and threats (the input for the EFE matrix).</p>
<div class="callout"><span class="badge">Common mistake</span> A threat is an external trend, not a weakness of the firm. "Our stores are old" is internal (lesson 2.2); "rents in city centres are rising" is external.</div>`,
    `<span class="eyebrow">STM301 · Phần 1 · Bài 1.2</span>
<h2>Đánh giá môi trường bên ngoài</h2>
<p class="lead">Mục đích của việc rà soát bên ngoài là lập một danh sách ngắn, dùng được ngay, gồm các <strong>cơ hội</strong> có thể mang lại lợi ích cho doanh nghiệp và các <strong>nguy cơ</strong> cần tránh. Đây là những xu hướng và sự kiện phần lớn nằm ngoài tầm kiểm soát của một doanh nghiệp đơn lẻ.</p>
<h3>Môi trường vĩ mô: PESTEL</h3>
<table>
<tr><th>Lực lượng</th><th>Biến số điển hình</th></tr>
<tr><td>Chính trị</td><td>Ổn định chính trị, chính sách thương mại, chính sách thuế, ưu tiên đầu tư công</td></tr>
<tr><td>Kinh tế</td><td>Tăng trưởng GDP, lãi suất, lạm phát, tỷ giá, thu nhập khả dụng</td></tr>
<tr><td>Xã hội</td><td>Nhân khẩu học, đô thị hoá, lối sống, thái độ đối với sức khoẻ và công việc</td></tr>
<tr><td>Công nghệ</td><td>Nền tảng số, tự động hoá, vật liệu mới, tốc độ sản phẩm lỗi thời</td></tr>
<tr><td>Môi trường</td><td>Rủi ro khí hậu, khan hiếm tài nguyên, kỳ vọng về chất thải và phát thải</td></tr>
<tr><td>Pháp lý</td><td>Quy định về cạnh tranh, bảo vệ người tiêu dùng, lao động, bảo vệ dữ liệu và an toàn sản phẩm</td></tr>
</table>
<p>David chia cùng phạm vi đó thành: lực lượng kinh tế; xã hội, văn hoá, nhân khẩu và môi trường tự nhiên; chính trị, chính phủ và pháp luật; công nghệ; và lực lượng cạnh tranh. Tên gọi không quan trọng bằng việc hỏi với mỗi xu hướng: <em>nó có làm thay đổi cầu, chi phí hay cạnh tranh trong ngành của mình không?</em></p>
<h3>Ngành: mô hình năm lực lượng của Porter</h3>
<p>Mô hình của Porter giải thích vì sao khả năng sinh lời trung bình khác nhau giữa các ngành. Các lực lượng càng mạnh thì tiềm năng lợi nhuận càng thấp.</p>
<table>
<tr><th>Lực lượng</th><th>Mạnh hơn (bất lợi cho doanh nghiệp hiện hữu) khi…</th></tr>
<tr><td>Cạnh tranh giữa các doanh nghiệp hiện hữu</td><td>Nhiều đối thủ ngang sức, ngành tăng trưởng chậm, chi phí cố định cao, ít khác biệt hoá, rào cản rút lui cao</td></tr>
<tr><td>Nguy cơ từ đối thủ tiềm ẩn</td><td>Rào cản gia nhập yếu: lợi thế kinh tế nhờ quy mô thấp, cần ít vốn, dễ tiếp cận kênh phân phối, lòng trung thành thương hiệu yếu, quy định lỏng</td></tr>
<tr><td>Nguy cơ từ sản phẩm thay thế</td><td>Sản phẩm của ngành khác đáp ứng cùng nhu cầu với tương quan giá – công dụng hấp dẫn và chi phí chuyển đổi thấp</td></tr>
<tr><td>Quyền lực thương lượng của nhà cung cấp</td><td>Ít nhà cung cấp, không có đầu vào thay thế tốt, chi phí chuyển đổi cao, có khả năng hội nhập về phía trước</td></tr>
<tr><td>Quyền lực thương lượng của người mua</td><td>Người mua tập trung hoặc mua khối lượng lớn, sản phẩm tiêu chuẩn hoá, chi phí chuyển đổi thấp, người mua nhạy cảm về giá, có khả năng hội nhập về phía sau</td></tr>
</table>
<p>Hill và cộng sự còn nhấn mạnh vai trò của <strong>doanh nghiệp bổ trợ</strong> — những doanh nghiệp có sản phẩm làm tăng giá trị cho sản phẩm của bạn (ví dụ nhà phát triển ứng dụng cho một nền tảng điện thoại thông minh) — có thể làm tăng cầu cho cả ngành.</p>
<h3>Nhóm chiến lược</h3>
<p><strong>Nhóm chiến lược</strong> là tập hợp các doanh nghiệp trong một ngành theo đuổi chiến lược tương tự nhau — mức giá và chất lượng, kênh phân phối, độ rộng danh mục sản phẩm hay phạm vi địa lý tương tự. <em>Bản đồ nhóm chiến lược</em> đặt các doanh nghiệp lên hai trục như vậy (kích thước bong bóng = tỷ trọng doanh thu). Đối thủ gần nhất thường nằm trong chính nhóm của bạn; việc chuyển sang nhóm khác bị giới hạn bởi <strong>rào cản di chuyển</strong> (thương hiệu, quy mô, phân phối, bí quyết).</p>
<h3>Vòng đời ngành</h3>
<table>
<tr><th>Giai đoạn</th><th>Đặc điểm điển hình</th><th>Trọng tâm chiến lược</th></tr>
<tr><td>Phôi thai</td><td>Công nghệ mới, cầu thấp, giá cao, ít doanh nghiệp</td><td>Tạo cầu, hoàn thiện sản phẩm</td></tr>
<tr><td>Tăng trưởng</td><td>Cầu tăng nhanh, cạnh tranh thấp, gia nhập hấp dẫn</td><td>Giành thị phần, mở rộng công suất và phân phối</td></tr>
<tr><td>Sàng lọc</td><td>Tăng trưởng chậm lại, xuất hiện dư thừa công suất, cạnh tranh gay gắt hơn</td><td>Cắt giảm chi phí, xây dựng lòng trung thành; doanh nghiệp yếu rút lui</td></tr>
<tr><td>Bão hoà</td><td>Thị trường bão hoà, rào cản gia nhập cao, cạnh tranh về giá</td><td>Hiệu quả, khác biệt hoá, bảo vệ thị phần</td></tr>
<tr><td>Suy thoái</td><td>Cầu giảm do sản phẩm thay thế, nhân khẩu học hoặc công nghệ</td><td>Dẫn đầu, thị trường ngách, thu hoạch hoặc rút lui</td></tr>
</table>
<h3>Từ phân tích tới danh sách yếu tố</h3>
<p>Việc rà soát kết thúc bằng việc nêu rõ các <strong>yếu tố thành công then chốt</strong> của ngành (điều mọi doanh nghiệp phải làm tốt để thắng, dùng cho ma trận CPM ở bài 1.3), các <strong>động lực thay đổi</strong> (vài xu hướng có khả năng làm thay đổi cấu trúc ngành nhiều nhất, như thay đổi công nghệ hay sự gia nhập của các doanh nghiệp lớn) và một danh sách cơ hội, nguy cơ đã xếp thứ tự ưu tiên (đầu vào cho ma trận EFE).</p>
<div class="callout"><span class="badge">Lỗi hay gặp</span> Nguy cơ là xu hướng bên ngoài, không phải điểm yếu của doanh nghiệp. "Cửa hàng của chúng ta đã cũ" là yếu tố bên trong (bài 2.2); "giá thuê mặt bằng ở trung tâm thành phố đang tăng" mới là yếu tố bên ngoài.</div>`,
  ]]);

const c3 = doc('stm301-1-3-efe-cpm', '1.3 — The EFE matrix & the competitive profile matrix (CPM)|||1.3 — Ma trận EFE & ma trận hình ảnh cạnh tranh (CPM)',
  'Năm bước lập ma trận đánh giá các yếu tố bên ngoài (EFE): trọng số cộng bằng 1,00, điểm phân loại 1–4, tổng điểm có trọng số và cách diễn giải quanh mức 2,5; ma trận hình ảnh cạnh tranh (CPM) so sánh ba doanh nghiệp theo yếu tố thành công then chốt; ví dụ số Cà phê Mộc Lan (giả định).',
  [[
    `<span class="eyebrow">STM301 · Part 1 · Lesson 1.3</span>
<h2>The EFE matrix &amp; the competitive profile matrix</h2>
<p class="lead">The External Factor Evaluation (EFE) matrix summarizes the external audit in one number: how well the firm's current strategies respond to the opportunities and threats it faces.</p>
<h3>Five steps to build an EFE matrix</h3>
<ol>
<li>List the key external factors from the audit — opportunities first, then threats. A full matrix usually has 10–20 factors; be specific and, where possible, quantitative.</li>
<li>Assign each factor a <strong>weight</strong> from 0.00 (not important) to 1.00 (very important) for success <em>in the industry</em>. The weights must sum to <strong>1.00</strong>. Weights are industry-based.</li>
<li>Assign each factor a <strong>rating</strong> from 1 to 4 for how effectively the firm's current strategies respond to it: 4 = superior, 3 = above average, 2 = average, 1 = poor. Ratings are company-based, and both opportunities and threats can receive any rating.</li>
<li>Multiply weight × rating to get a <strong>weighted score</strong>.</li>
<li>Add the weighted scores to get the <strong>total weighted score</strong>.</li>
</ol>
<p>Whatever the number of factors, the total ranges from 1.0 to 4.0, with <strong>2.5 as the average</strong>. A total of 4.0 means the firm responds outstandingly to its environment; 1.0 means its strategies neither capitalize on opportunities nor avoid threats.</p>
<h3>Worked example — Moc Lan Coffee (fictional, illustrative numbers)</h3>
<pre><code class="language-text">Key external factor                                   Weight  Rating  Weighted
Opportunities
O1 Rising urban spending on out-of-home coffee          0.12      3      0.36
O2 Fast growth of food-delivery apps                    0.10      4      0.40
O3 Demand for specialty, local-origin coffee            0.08      2      0.16
O4 Office workers want fast takeaway                    0.08      3      0.24
O5 Trade agreements open export for packaged coffee     0.07      1      0.07
Threats
T1 Intense rivalry from domestic and foreign chains     0.15      2      0.30
T2 Rising rents in city centres                         0.12      2      0.24
T3 Volatile green-coffee bean prices                    0.10      3      0.30
T4 Low customer switching costs                         0.10      2      0.20
T5 Stricter food-safety inspections                     0.08      3      0.24
TOTAL                                                   1.00             2.51</code></pre>
<p><strong>Reading it:</strong> 2.51 is only just above the 2.5 average. Moc Lan exploits delivery apps well (O2: 0.40) but barely responds to export opportunities (O5, rating 1), and its answer to the heaviest threat — rivalry, weight 0.15 — is merely average. To compare the two groups, divide each group's weighted total by its share of the weight: opportunities carry 0.45 of the weight and score 1.23 (average rating 1.23 / 0.45 ≈ 2.73), threats carry 0.55 and score 1.28 (average rating 1.28 / 0.55 ≈ 2.33). Moc Lan therefore responds better to opportunities than to threats, and with a total of only 2.51 it is not yet turning its environment to advantage.</p>
<h3>The competitive profile matrix (CPM)</h3>
<p>The CPM compares the firm with its major competitors on the industry's <strong>critical success factors</strong>. Weights are the same for every firm and sum to 1.00; ratings are 4 = major strength, 3 = minor strength, 2 = minor weakness, 1 = major weakness.</p>
<pre><code class="language-text">Critical success factor   Weight | Moc Lan     | Rival A     | Rival B
                                 | Rtg  Score  | Rtg  Score  | Rtg  Score
Brand reputation           0.20  |  4   0.80   |  3   0.60   |  2   0.40
Product quality            0.15  |  3   0.45   |  4   0.60   |  2   0.30
Price competitiveness      0.15  |  2   0.30   |  1   0.15   |  4   0.60
Store location network     0.20  |  2   0.40   |  4   0.80   |  3   0.60
Digital &amp; delivery         0.15  |  4   0.60   |  3   0.45   |  2   0.30
Financial position         0.15  |  3   0.45   |  4   0.60   |  2   0.30
TOTAL                      1.00  |      3.00   |      3.20   |      2.50</code></pre>
<p>Rival A (3.20) is the strongest overall, mainly through its store network and finances; Moc Lan (3.00) leads on brand and digital; Rival B (2.50) competes on price. The CPM shows where Moc Lan must defend (brand, digital) and where it must catch up (locations).</p>
<h3>EFE vs CPM</h3>
<ul>
<li>The EFE factors are external trends; CPM factors mix internal and external issues (brand, finances, price).</li>
<li>The CPM rates <em>several firms</em> on the same factors, so it is a benchmarking tool; the EFE rates one firm's responses.</li>
<li>The numbers are not precise measurements. Their value lies in forcing the team to agree what matters most and to justify every rating.</li>
</ul>
<div class="callout"><span class="badge">Check yourself</span> Weights describe the <em>industry</em> (how much the factor matters to anyone competing there); ratings describe <em>the firm</em>. Mixing the two is the most common error in EFE and CPM work.</div>`,
    `<span class="eyebrow">STM301 · Phần 1 · Bài 1.3</span>
<h2>Ma trận EFE &amp; ma trận hình ảnh cạnh tranh</h2>
<p class="lead">Ma trận đánh giá các yếu tố bên ngoài (EFE) tóm tắt kết quả rà soát bên ngoài trong một con số: các chiến lược hiện tại của doanh nghiệp phản ứng tốt tới đâu trước những cơ hội và nguy cơ mà nó đối mặt.</p>
<h3>Năm bước lập ma trận EFE</h3>
<ol>
<li>Liệt kê các yếu tố bên ngoài then chốt rút ra từ việc rà soát — cơ hội trước, nguy cơ sau. Một ma trận đầy đủ thường có 10–20 yếu tố; viết cụ thể và định lượng khi có thể.</li>
<li>Gán cho mỗi yếu tố một <strong>trọng số</strong> từ 0,00 (không quan trọng) đến 1,00 (rất quan trọng) đối với thành công <em>trong ngành</em>. Tổng các trọng số phải bằng <strong>1,00</strong>. Trọng số phản ánh ngành.</li>
<li>Cho mỗi yếu tố một <strong>điểm phân loại</strong> từ 1 đến 4 thể hiện mức độ hiệu quả của các chiến lược hiện tại khi phản ứng với yếu tố đó: 4 = vượt trội, 3 = trên trung bình, 2 = trung bình, 1 = kém. Điểm phân loại phản ánh doanh nghiệp, và cả cơ hội lẫn nguy cơ đều có thể nhận bất kỳ mức điểm nào.</li>
<li>Nhân trọng số × điểm phân loại để có <strong>điểm có trọng số</strong>.</li>
<li>Cộng các điểm có trọng số để có <strong>tổng điểm có trọng số</strong>.</li>
</ol>
<p>Dù có bao nhiêu yếu tố, tổng điểm luôn nằm trong khoảng 1,0 đến 4,0, với <strong>2,5 là mức trung bình</strong>. Tổng 4,0 nghĩa là doanh nghiệp phản ứng xuất sắc với môi trường; 1,0 nghĩa là chiến lược của doanh nghiệp vừa không tận dụng được cơ hội vừa không né tránh được nguy cơ.</p>
<h3>Ví dụ — Cà phê Mộc Lan (giả định, số liệu minh hoạ)</h3>
<pre><code class="language-text">Yếu tố bên ngoài then chốt                            Trọng số  Phân loại  Điểm TS
Cơ hội
O1 Chi tiêu cho cà phê ngoài gia đình ở đô thị tăng      0,12        3       0,36
O2 Ứng dụng giao đồ ăn tăng trưởng nhanh                 0,10        4       0,40
O3 Nhu cầu cà phê đặc sản, nguồn gốc địa phương          0,08        2       0,16
O4 Dân văn phòng cần mua mang đi nhanh                   0,08        3       0,24
O5 Hiệp định thương mại mở cửa xuất khẩu cà phê đóng gói 0,07        1       0,07
Nguy cơ
T1 Cạnh tranh gay gắt từ chuỗi trong nước và nước ngoài  0,15        2       0,30
T2 Giá thuê mặt bằng trung tâm thành phố tăng            0,12        2       0,24
T3 Giá cà phê nhân biến động mạnh                        0,10        3       0,30
T4 Chi phí chuyển đổi của khách hàng thấp                0,10        2       0,20
T5 Kiểm tra an toàn thực phẩm chặt chẽ hơn               0,08        3       0,24
TỔNG                                                     1,00                2,51</code></pre>
<p><strong>Cách đọc:</strong> 2,51 chỉ nhỉnh hơn mức trung bình 2,5 một chút. Mộc Lan khai thác ứng dụng giao hàng tốt (O2: 0,40) nhưng gần như chưa phản ứng với cơ hội xuất khẩu (O5, điểm 1), và cách ứng phó với nguy cơ nặng nhất — cạnh tranh, trọng số 0,15 — chỉ ở mức trung bình. Muốn so hai nhóm, hãy chia tổng điểm có trọng số của mỗi nhóm cho tổng trọng số của nhóm đó: nhóm cơ hội chiếm 0,45 trọng số và đạt 1,23 (điểm phân loại bình quân 1,23 / 0,45 ≈ 2,73), nhóm nguy cơ chiếm 0,55 và đạt 1,28 (bình quân 1,28 / 0,55 ≈ 2,33). Như vậy Mộc Lan phản ứng với cơ hội tốt hơn với nguy cơ, và với tổng chỉ 2,51, doanh nghiệp chưa biến được môi trường thành lợi thế.</p>
<h3>Ma trận hình ảnh cạnh tranh (CPM)</h3>
<p>CPM so sánh doanh nghiệp với các đối thủ chính theo các <strong>yếu tố thành công then chốt</strong> của ngành. Trọng số giống nhau cho mọi doanh nghiệp và cộng bằng 1,00; điểm phân loại: 4 = điểm mạnh lớn, 3 = điểm mạnh nhỏ, 2 = điểm yếu nhỏ, 1 = điểm yếu lớn.</p>
<pre><code class="language-text">Yếu tố thành công then chốt  Trọng số | Mộc Lan    | Đối thủ A  | Đối thủ B
                                      | PL   Điểm  | PL   Điểm  | PL   Điểm
Uy tín thương hiệu             0,20   |  4   0,80  |  3   0,60  |  2   0,40
Chất lượng sản phẩm            0,15   |  3   0,45  |  4   0,60  |  2   0,30
Khả năng cạnh tranh về giá     0,15   |  2   0,30  |  1   0,15  |  4   0,60
Mạng lưới vị trí cửa hàng      0,20   |  2   0,40  |  4   0,80  |  3   0,60
Năng lực số &amp; giao hàng        0,15   |  4   0,60  |  3   0,45  |  2   0,30
Tình hình tài chính            0,15   |  3   0,45  |  4   0,60  |  2   0,30
TỔNG                           1,00   |      3,00  |      3,20  |      2,50</code></pre>
<p>Đối thủ A (3,20) mạnh nhất về tổng thể, chủ yếu nhờ mạng lưới cửa hàng và tài chính; Mộc Lan (3,00) dẫn đầu về thương hiệu và năng lực số; Đối thủ B (2,50) cạnh tranh bằng giá. CPM cho thấy Mộc Lan phải giữ vững ở đâu (thương hiệu, năng lực số) và phải bắt kịp ở đâu (vị trí cửa hàng).</p>
<h3>So sánh EFE và CPM</h3>
<ul>
<li>Yếu tố trong EFE là xu hướng bên ngoài; yếu tố trong CPM gồm cả vấn đề bên trong lẫn bên ngoài (thương hiệu, tài chính, giá).</li>
<li>CPM chấm <em>nhiều doanh nghiệp</em> trên cùng các yếu tố nên là công cụ so sánh chuẩn; EFE chấm cách phản ứng của một doanh nghiệp.</li>
<li>Các con số không phải phép đo chính xác. Giá trị của chúng nằm ở chỗ buộc cả nhóm phải thống nhất điều gì quan trọng nhất và phải lý giải từng điểm số.</li>
</ul>
<div class="callout"><span class="badge">Tự kiểm tra</span> Trọng số mô tả <em>ngành</em> (yếu tố quan trọng tới đâu với bất kỳ ai cạnh tranh ở đó); điểm phân loại mô tả <em>doanh nghiệp</em>. Lẫn lộn hai thứ này là lỗi phổ biến nhất khi lập EFE và CPM.</div>`,
  ]]);

const q1 = quiz('stm301-quiz-1', 'Quiz 1 — Direction & the external assessment|||Quiz 1 — Định hướng & đánh giá bên ngoài', [
  { id: 'q1', question: 'In an EFE matrix, a rating of 4 for a factor means that…|||Trong ma trận EFE, điểm phân loại 4 cho một yếu tố nghĩa là…', options: ['the factor is the most important one in the industry|||yếu tố đó quan trọng nhất trong ngành', 'the factor is an opportunity rather than a threat|||yếu tố đó là cơ hội chứ không phải nguy cơ', 'the firm’s current strategies respond to the factor in a superior way|||các chiến lược hiện tại của doanh nghiệp phản ứng với yếu tố đó ở mức vượt trội', 'the factor will certainly happen within four years|||yếu tố đó chắc chắn xảy ra trong vòng bốn năm'], correctIndex: 2, explanation: 'Importance to the industry is captured by the weight; the 1–4 rating measures how well this firm responds, and both opportunities and threats can receive any rating.|||Mức quan trọng đối với ngành được thể hiện bằng trọng số; điểm 1–4 đo doanh nghiệp này phản ứng tốt tới đâu, và cả cơ hội lẫn nguy cơ đều có thể nhận bất kỳ mức điểm nào.' },
  { id: 'q2', question: 'According to the five forces model, the bargaining power of buyers is strongest when…|||Theo mô hình năm lực lượng, quyền lực thương lượng của người mua mạnh nhất khi…', options: ['buyers are concentrated, products are standardized and switching costs are low|||người mua tập trung, sản phẩm tiêu chuẩn hoá và chi phí chuyển đổi thấp', 'buyers are many and small and the product is highly differentiated|||người mua đông và nhỏ lẻ, sản phẩm được khác biệt hoá cao', 'buyers face high switching costs|||người mua chịu chi phí chuyển đổi cao', 'the industry has very few substitutes and strong brands|||ngành có rất ít sản phẩm thay thế và thương hiệu mạnh'], correctIndex: 0, explanation: 'Concentration, standardized products and cheap switching let buyers play sellers against each other; the other options all weaken buyers.|||Sự tập trung, sản phẩm tiêu chuẩn hoá và chuyển đổi rẻ giúp người mua ép các bên bán cạnh tranh nhau; các phương án còn lại đều làm người mua yếu đi.' },
  { id: 'q3', question: 'In a CPM, three factors have weights 0.40, 0.35 and 0.25, and a firm is rated 3, 2 and 4 on them. Its total weighted score is…|||Trong một CPM, ba yếu tố có trọng số 0,40; 0,35 và 0,25, doanh nghiệp được chấm 3, 2 và 4. Tổng điểm có trọng số là…', options: ['3.00|||3,00', '2.90|||2,90', '9.00|||9,00', '2.50|||2,50'], correctIndex: 1, explanation: '0.40 x 3 + 0.35 x 2 + 0.25 x 4 = 1.20 + 0.70 + 1.00 = 2.90. The value 3.00 is the unweighted average of the ratings.|||0,40 x 3 + 0,35 x 2 + 0,25 x 4 = 1,20 + 0,70 + 1,00 = 2,90. Giá trị 3,00 là trung bình không trọng số của các điểm.' },
]);

const c4 = doc('stm301-2-1-resources-vrio', '2.1 — Resources, capabilities, VRIO & core competencies|||2.1 — Nguồn lực, năng lực, VRIO & năng lực cốt lõi',
  'Quan điểm dựa trên nguồn lực (RBV) so với quan điểm tổ chức ngành; nguồn lực hữu hình, vô hình và năng lực; khung VRIO và bốn hệ quả cạnh tranh; rào cản bắt chước; năng lực cốt lõi và năng lực khác biệt; bốn khối xây dựng lợi thế cạnh tranh; ví dụ VRIO của Cà phê Mộc Lan (giả định).',
  [[
    `<span class="eyebrow">STM301 · Part 2 · Lesson 2.1</span>
<h2>Resources, capabilities, VRIO &amp; core competencies</h2>
<p class="lead">Two firms facing the same industry forces can perform very differently. The internal assessment asks why: which of the firm's resources and capabilities can support a competitive advantage — and for how long?</p>
<h3>Two views of where advantage comes from</h3>
<ul>
<li>The <strong>industrial organization (I/O) view</strong>, associated with Porter, holds that external factors — industry structure and the firm's position in it — explain most of performance.</li>
<li>The <strong>resource-based view (RBV)</strong> holds that internal resources and capabilities matter more for building a <em>sustained</em> advantage. Strategists need both views: the external audit shows what is worth winning, the internal audit shows what the firm can win with.</li>
</ul>
<h3>Resources and capabilities</h3>
<table>
<tr><th>Category</th><th>Examples (Moc Lan Coffee, fictional)</th></tr>
<tr><td>Tangible resources — physical, financial</td><td>Central roastery, store equipment, cash reserves</td></tr>
<tr><td>Intangible resources — reputation, knowledge, relationships</td><td>Brand, membership database, relations with coffee farmers</td></tr>
<tr><td>Human resources</td><td>Trained baristas, product developers</td></tr>
<tr><td>Capabilities — skills in combining resources</td><td>Opening a new store profitably in 90 days, designing seasonal menus</td></tr>
</table>
<h3>The VRIO framework</h3>
<p>A resource or capability supports an advantage only if it passes four questions (Barney):</p>
<ul>
<li><strong>Value</strong> — does it let the firm exploit an opportunity or neutralize a threat?</li>
<li><strong>Rarity</strong> — is it controlled by only a few competitors?</li>
<li><strong>Imitability</strong> — is it costly for others to imitate or substitute?</li>
<li><strong>Organization</strong> — is the firm organized (structure, systems, policies) to capture its value?</li>
</ul>
<table>
<tr><th>Valuable?</th><th>Rare?</th><th>Costly to imitate?</th><th>Competitive implication</th></tr>
<tr><td>No</td><td>—</td><td>—</td><td>Competitive disadvantage</td></tr>
<tr><td>Yes</td><td>No</td><td>—</td><td>Competitive parity</td></tr>
<tr><td>Yes</td><td>Yes</td><td>No</td><td>Temporary competitive advantage</td></tr>
<tr><td>Yes</td><td>Yes</td><td>Yes</td><td>Sustained competitive advantage — if the firm is organized to exploit it</td></tr>
</table>
<p>Organization works like a switch: without the right structure and systems, even a valuable, rare and hard-to-imitate resource leaves its advantage unexploited.</p>
<h3>Why some resources are hard to imitate</h3>
<ul>
<li><strong>Unique historical conditions (path dependence)</strong> — a reputation built over many years cannot be bought in one.</li>
<li><strong>Causal ambiguity</strong> — rivals cannot tell exactly which combination of routines creates the result.</li>
<li><strong>Social complexity</strong> — culture, teamwork and trust with suppliers are hard to copy.</li>
<li><strong>Legal protection</strong> — patents, trademarks and exclusive contracts.</li>
</ul>
<h3>VRIO applied — Moc Lan (illustrative judgments)</h3>
<table>
<tr><th>Resource / capability</th><th>V</th><th>R</th><th>I</th><th>Implication</th></tr>
<tr><td>Brand reputation in its home cities</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Sustained advantage (organization in place: brand team, standards)</td></tr>
<tr><td>Large, loyal membership base</td><td>Yes</td><td>Yes</td><td>No</td><td>Temporary advantage — rivals can build their own</td></tr>
<tr><td>Central roastery</td><td>Yes</td><td>Yes</td><td>No</td><td>Temporary advantage — equipment can be bought</td></tr>
<tr><td>Membership app software</td><td>Yes</td><td>No</td><td>—</td><td>Parity — every chain has one</td></tr>
</table>
<h3>Core competencies and distinctive competencies</h3>
<p>A <strong>core competence</strong> (Prahalad &amp; Hamel) is a collective learning of the organization that (1) gives access to a wide variety of markets, (2) contributes significantly to the benefits customers perceive and (3) is difficult for competitors to imitate. When a competence is performed better than rivals it becomes a <strong>distinctive competence</strong>. Hill and colleagues summarize the generic building blocks of advantage as superior <strong>efficiency</strong>, <strong>quality</strong>, <strong>innovation</strong> and <strong>customer responsiveness</strong>.</p>
<div class="callout"><span class="badge">Key lesson</span> Being good at something is not enough. Ask "good compared with whom, and for how long?" — a strength that every rival also has only buys parity.</div>`,
    `<span class="eyebrow">STM301 · Phần 2 · Bài 2.1</span>
<h2>Nguồn lực, năng lực, VRIO &amp; năng lực cốt lõi</h2>
<p class="lead">Hai doanh nghiệp chịu cùng các lực lượng ngành vẫn có thể đạt kết quả rất khác nhau. Đánh giá nội bộ đặt câu hỏi vì sao: nguồn lực và năng lực nào của doanh nghiệp có thể tạo nên lợi thế cạnh tranh — và giữ được bao lâu?</p>
<h3>Hai quan điểm về nguồn gốc lợi thế</h3>
<ul>
<li><strong>Quan điểm tổ chức ngành (I/O)</strong>, gắn với Porter, cho rằng các yếu tố bên ngoài — cấu trúc ngành và vị trí của doanh nghiệp trong ngành — giải thích phần lớn kết quả kinh doanh.</li>
<li><strong>Quan điểm dựa trên nguồn lực (RBV)</strong> cho rằng nguồn lực và năng lực bên trong quan trọng hơn trong việc xây dựng lợi thế <em>bền vững</em>. Nhà chiến lược cần cả hai: rà soát bên ngoài cho biết điều gì đáng giành, rà soát bên trong cho biết doanh nghiệp có thể giành bằng gì.</li>
</ul>
<h3>Nguồn lực và năng lực</h3>
<table>
<tr><th>Nhóm</th><th>Ví dụ (Cà phê Mộc Lan, giả định)</th></tr>
<tr><td>Nguồn lực hữu hình — vật chất, tài chính</td><td>Xưởng rang trung tâm, thiết bị cửa hàng, tiền mặt dự trữ</td></tr>
<tr><td>Nguồn lực vô hình — danh tiếng, tri thức, quan hệ</td><td>Thương hiệu, cơ sở dữ liệu thành viên, quan hệ với người trồng cà phê</td></tr>
<tr><td>Nguồn nhân lực</td><td>Nhân viên pha chế được đào tạo, người phát triển sản phẩm</td></tr>
<tr><td>Năng lực — kỹ năng kết hợp các nguồn lực</td><td>Mở một cửa hàng mới có lãi trong 90 ngày, thiết kế thực đơn theo mùa</td></tr>
</table>
<h3>Khung VRIO</h3>
<p>Một nguồn lực hay năng lực chỉ tạo nên lợi thế nếu vượt qua bốn câu hỏi (Barney):</p>
<ul>
<li><strong>Giá trị</strong> — nó có giúp doanh nghiệp khai thác cơ hội hoặc hoá giải nguy cơ không?</li>
<li><strong>Hiếm</strong> — nó có chỉ nằm trong tay số ít đối thủ không?</li>
<li><strong>Khó bắt chước</strong> — đối thủ có tốn kém khi bắt chước hoặc thay thế nó không?</li>
<li><strong>Tổ chức</strong> — doanh nghiệp có được tổ chức (cơ cấu, hệ thống, chính sách) để khai thác giá trị của nó không?</li>
</ul>
<table>
<tr><th>Có giá trị?</th><th>Hiếm?</th><th>Khó bắt chước?</th><th>Hệ quả cạnh tranh</th></tr>
<tr><td>Không</td><td>—</td><td>—</td><td>Bất lợi cạnh tranh</td></tr>
<tr><td>Có</td><td>Không</td><td>—</td><td>Cân bằng cạnh tranh</td></tr>
<tr><td>Có</td><td>Có</td><td>Không</td><td>Lợi thế cạnh tranh tạm thời</td></tr>
<tr><td>Có</td><td>Có</td><td>Có</td><td>Lợi thế cạnh tranh bền vững — nếu doanh nghiệp được tổ chức để khai thác nó</td></tr>
</table>
<p>Yếu tố tổ chức hoạt động như một công tắc: thiếu cơ cấu và hệ thống phù hợp, ngay cả nguồn lực có giá trị, hiếm và khó bắt chước cũng để lợi thế của nó nằm im không được khai thác.</p>
<h3>Vì sao có những nguồn lực khó bắt chước</h3>
<ul>
<li><strong>Điều kiện lịch sử độc nhất (phụ thuộc lộ trình)</strong> — danh tiếng xây trong nhiều năm không thể mua trong một năm.</li>
<li><strong>Sự mơ hồ về nhân quả</strong> — đối thủ không biết chính xác tổ hợp quy trình nào tạo ra kết quả.</li>
<li><strong>Sự phức tạp xã hội</strong> — văn hoá, tinh thần làm việc nhóm và niềm tin với nhà cung cấp rất khó sao chép.</li>
<li><strong>Bảo hộ pháp lý</strong> — bằng sáng chế, nhãn hiệu và hợp đồng độc quyền.</li>
</ul>
<h3>Áp dụng VRIO — Mộc Lan (nhận định minh hoạ)</h3>
<table>
<tr><th>Nguồn lực / năng lực</th><th>V</th><th>R</th><th>I</th><th>Hệ quả</th></tr>
<tr><td>Uy tín thương hiệu tại các thành phố đang hoạt động</td><td>Có</td><td>Có</td><td>Có</td><td>Lợi thế bền vững (đã có tổ chức: đội thương hiệu, bộ tiêu chuẩn)</td></tr>
<tr><td>Tập thành viên lớn và trung thành</td><td>Có</td><td>Có</td><td>Không</td><td>Lợi thế tạm thời — đối thủ có thể tự xây dựng</td></tr>
<tr><td>Xưởng rang trung tâm</td><td>Có</td><td>Có</td><td>Không</td><td>Lợi thế tạm thời — thiết bị có thể mua được</td></tr>
<tr><td>Phần mềm ứng dụng thành viên</td><td>Có</td><td>Không</td><td>—</td><td>Cân bằng — chuỗi nào cũng có</td></tr>
</table>
<h3>Năng lực cốt lõi và năng lực khác biệt</h3>
<p><strong>Năng lực cốt lõi</strong> (Prahalad &amp; Hamel) là sự học hỏi tập thể của tổ chức, (1) mở ra khả năng tiếp cận nhiều thị trường, (2) đóng góp đáng kể vào lợi ích mà khách hàng cảm nhận và (3) khó bị đối thủ bắt chước. Khi một năng lực được thực hiện tốt hơn đối thủ, nó trở thành <strong>năng lực khác biệt</strong>. Hill và cộng sự tóm tắt các khối xây dựng chung của lợi thế là <strong>hiệu quả</strong>, <strong>chất lượng</strong>, <strong>đổi mới</strong> và <strong>khả năng đáp ứng khách hàng</strong> vượt trội.</p>
<div class="callout"><span class="badge">Bài học chính</span> Giỏi một việc là chưa đủ. Hãy hỏi "giỏi hơn ai, và giữ được bao lâu?" — một điểm mạnh mà đối thủ nào cũng có chỉ mang lại thế cân bằng.</div>`,
  ]]);

const c5 = doc('stm301-2-2-value-chain-ife', '2.2 — The value chain, functional analysis & the IFE matrix|||2.2 — Chuỗi giá trị, phân tích chức năng & ma trận IFE',
  'Chuỗi giá trị của Porter (năm hoạt động chính, bốn hoạt động hỗ trợ) và các bước phân tích; rà soát nội bộ theo lĩnh vực chức năng; so sánh chuẩn; năm bước lập ma trận đánh giá các yếu tố bên trong (IFE) với quy tắc điểm 3–4 cho điểm mạnh, 1–2 cho điểm yếu; ví dụ số Cà phê Mộc Lan (giả định).',
  [[
    `<span class="eyebrow">STM301 · Part 2 · Lesson 2.2</span>
<h2>The value chain, functional analysis &amp; the IFE matrix</h2>
<h3>Porter's value chain</h3>
<p>The value chain breaks the firm into the activities it performs to design, produce, sell, deliver and support its product. <strong>Margin</strong> is the difference between the value customers pay for and the total cost of these activities.</p>
<table>
<tr><th>Primary activities</th><th>Support activities</th></tr>
<tr><td>Inbound logistics — receiving, storing, handling inputs</td><td>Firm infrastructure — general management, planning, finance, legal, quality systems</td></tr>
<tr><td>Operations — turning inputs into the product</td><td>Human resource management — recruiting, training, rewarding</td></tr>
<tr><td>Outbound logistics — delivering the product to buyers</td><td>Technology development — R&amp;D, process and IT improvements</td></tr>
<tr><td>Marketing and sales — informing and persuading buyers</td><td>Procurement — purchasing inputs across all activities</td></tr>
<tr><td>Service — installation, repair, after-sales support</td><td></td></tr>
</table>
<p><strong>Value chain analysis</strong> proceeds in three steps: identify the activities, estimate the cost of each, and look for ways to lower cost or raise differentiation in each activity and in the <em>linkages</em> between them (for instance, better procurement of beans reduces waste in operations). Comparing activities with rivals or best-in-class firms is called <strong>benchmarking</strong>.</p>
<h3>Functional analysis (the internal audit)</h3>
<table>
<tr><th>Functional area</th><th>Sample audit questions</th></tr>
<tr><td>Management</td><td>Are planning, organizing, motivating, staffing and controlling done well?</td></tr>
<tr><td>Marketing</td><td>Are markets segmented effectively? Is market share and brand strength improving?</td></tr>
<tr><td>Finance and accounting</td><td>What do liquidity, leverage, activity and profitability ratios show? Can the firm raise capital?</td></tr>
<tr><td>Production / operations</td><td>Are capacity, quality, inventory and cost under control?</td></tr>
<tr><td>Research and development</td><td>Does R&amp;D produce products and processes the market values?</td></tr>
<tr><td>Management information systems</td><td>Do managers get timely, accurate information for decisions?</td></tr>
</table>
<h3>Five steps to build an IFE matrix</h3>
<ol>
<li>List the key internal factors — strengths first, then weaknesses; usually 10–20, as specific as possible.</li>
<li>Assign weights from 0.00 to 1.00 by importance to success in the industry; they must sum to <strong>1.00</strong>.</li>
<li>Assign ratings: <strong>4 = major strength, 3 = minor strength, 2 = minor weakness, 1 = major weakness</strong>. Strengths therefore receive 3 or 4 and weaknesses 1 or 2.</li>
<li>Multiply weight × rating for each factor.</li>
<li>Sum the weighted scores. The total ranges from 1.0 to 4.0 with 2.5 as the average; totals well below 2.5 characterize an internally weak organization, totals well above 2.5 an internally strong one.</li>
</ol>
<h3>Worked example — Moc Lan Coffee (fictional, illustrative numbers)</h3>
<pre><code class="language-text">Key internal factor                                   Weight  Rating  Weighted
Strengths
S1 Strong brand recognition in home cities              0.15      4      0.60
S2 Large, loyal membership base on the app              0.10      4      0.40
S3 Efficient central roastery                           0.10      3      0.30
S4 Staff turnover lower than industry norm              0.07      3      0.21
S5 Healthy cash position, little debt                   0.08      3      0.24
Weaknesses
W1 Slow new-product development                         0.12      1      0.12
W2 Store network concentrated in two cities             0.12      2      0.24
W3 Weak cost control at store level                     0.10      1      0.10
W4 Outdated point-of-sale and data systems              0.08      2      0.16
W5 Dependence on a single bean supplier                 0.08      2      0.16
TOTAL                                                   1.00             2.53</code></pre>
<p>A total of 2.53 is only marginally above the 2.5 average: strong brand and loyalty (weighted scores 0.60 and 0.40) are offset by two major weaknesses rated 1 — slow product development (W1) and weak store cost control (W3). Together with the EFE total of 2.51, these numbers will position Moc Lan in the IE matrix in Part 4.</p>
<div class="callout"><span class="badge">Tip</span> Write factors so that someone else could verify them: "staff turnover 18% versus an industry norm of 30%" is better than "good people". Vague factors produce ratings that nobody can challenge.</div>`,
    `<span class="eyebrow">STM301 · Phần 2 · Bài 2.2</span>
<h2>Chuỗi giá trị, phân tích chức năng &amp; ma trận IFE</h2>
<h3>Chuỗi giá trị của Porter</h3>
<p>Chuỗi giá trị chia doanh nghiệp thành các hoạt động mà nó thực hiện để thiết kế, sản xuất, bán, giao và hỗ trợ sản phẩm. <strong>Biên lợi nhuận</strong> là chênh lệch giữa giá trị khách hàng sẵn sàng trả và tổng chi phí của các hoạt động đó.</p>
<table>
<tr><th>Hoạt động chính</th><th>Hoạt động hỗ trợ</th></tr>
<tr><td>Hậu cần đầu vào — tiếp nhận, lưu kho, xử lý đầu vào</td><td>Cơ sở hạ tầng doanh nghiệp — quản lý chung, hoạch định, tài chính, pháp chế, hệ thống chất lượng</td></tr>
<tr><td>Vận hành — biến đầu vào thành sản phẩm</td><td>Quản trị nguồn nhân lực — tuyển dụng, đào tạo, đãi ngộ</td></tr>
<tr><td>Hậu cần đầu ra — đưa sản phẩm tới người mua</td><td>Phát triển công nghệ — R&amp;D, cải tiến quy trình và công nghệ thông tin</td></tr>
<tr><td>Marketing và bán hàng — thông tin và thuyết phục người mua</td><td>Thu mua — mua đầu vào cho mọi hoạt động</td></tr>
<tr><td>Dịch vụ — lắp đặt, sửa chữa, hỗ trợ sau bán</td><td></td></tr>
</table>
<p><strong>Phân tích chuỗi giá trị</strong> gồm ba bước: xác định các hoạt động, ước tính chi phí của từng hoạt động, và tìm cách giảm chi phí hoặc tăng khác biệt hoá ở từng hoạt động cũng như ở các <em>mối liên kết</em> giữa chúng (ví dụ, thu mua hạt cà phê tốt hơn giúp giảm hao hụt ở khâu vận hành). So sánh các hoạt động với đối thủ hoặc doanh nghiệp làm tốt nhất gọi là <strong>so sánh chuẩn (benchmarking)</strong>.</p>
<h3>Phân tích chức năng (rà soát nội bộ)</h3>
<table>
<tr><th>Lĩnh vực chức năng</th><th>Câu hỏi rà soát mẫu</th></tr>
<tr><td>Quản trị</td><td>Hoạch định, tổ chức, động viên, bố trí nhân sự và kiểm soát có được làm tốt không?</td></tr>
<tr><td>Marketing</td><td>Thị trường có được phân khúc hiệu quả không? Thị phần và sức mạnh thương hiệu có đang cải thiện?</td></tr>
<tr><td>Tài chính và kế toán</td><td>Các tỷ số thanh khoản, đòn bẩy, hoạt động và sinh lời cho thấy gì? Doanh nghiệp có huy động được vốn không?</td></tr>
<tr><td>Sản xuất / vận hành</td><td>Công suất, chất lượng, tồn kho và chi phí có được kiểm soát không?</td></tr>
<tr><td>Nghiên cứu và phát triển</td><td>R&amp;D có tạo ra sản phẩm và quy trình mà thị trường đánh giá cao không?</td></tr>
<tr><td>Hệ thống thông tin quản lý</td><td>Nhà quản trị có nhận được thông tin kịp thời, chính xác để ra quyết định không?</td></tr>
</table>
<h3>Năm bước lập ma trận IFE</h3>
<ol>
<li>Liệt kê các yếu tố bên trong then chốt — điểm mạnh trước, điểm yếu sau; thường 10–20 yếu tố, càng cụ thể càng tốt.</li>
<li>Gán trọng số từ 0,00 đến 1,00 theo mức quan trọng đối với thành công trong ngành; tổng phải bằng <strong>1,00</strong>.</li>
<li>Cho điểm phân loại: <strong>4 = điểm mạnh lớn, 3 = điểm mạnh nhỏ, 2 = điểm yếu nhỏ, 1 = điểm yếu lớn</strong>. Vì vậy điểm mạnh nhận 3 hoặc 4, điểm yếu nhận 1 hoặc 2.</li>
<li>Nhân trọng số × điểm phân loại cho từng yếu tố.</li>
<li>Cộng các điểm có trọng số. Tổng nằm trong khoảng 1,0 đến 4,0, với 2,5 là mức trung bình; tổng thấp hơn hẳn 2,5 cho thấy nội bộ yếu, cao hơn hẳn 2,5 cho thấy nội bộ mạnh.</li>
</ol>
<h3>Ví dụ — Cà phê Mộc Lan (giả định, số liệu minh hoạ)</h3>
<pre><code class="language-text">Yếu tố bên trong then chốt                            Trọng số  Phân loại  Điểm TS
Điểm mạnh
S1 Thương hiệu được nhận biết mạnh ở các thành phố        0,15        4       0,60
S2 Tập thành viên lớn, trung thành trên ứng dụng          0,10        4       0,40
S3 Xưởng rang trung tâm hiệu quả                          0,10        3       0,30
S4 Tỷ lệ nghỉ việc thấp hơn mức chung của ngành           0,07        3       0,21
S5 Tiền mặt dồi dào, ít nợ                                0,08        3       0,24
Điểm yếu
W1 Phát triển sản phẩm mới chậm                           0,12        1       0,12
W2 Mạng lưới cửa hàng dồn ở hai thành phố                 0,12        2       0,24
W3 Kiểm soát chi phí ở cấp cửa hàng yếu                   0,10        1       0,10
W4 Hệ thống bán hàng và dữ liệu lạc hậu                   0,08        2       0,16
W5 Phụ thuộc một nhà cung cấp hạt cà phê                  0,08        2       0,16
TỔNG                                                      1,00                2,53</code></pre>
<p>Tổng 2,53 chỉ nhỉnh hơn mức trung bình 2,5 một chút: thương hiệu mạnh và khách hàng trung thành (điểm có trọng số 0,60 và 0,40) bị bù trừ bởi hai điểm yếu lớn nhận điểm 1 — phát triển sản phẩm chậm (W1) và kiểm soát chi phí cửa hàng yếu (W3). Cùng với tổng EFE 2,51, các con số này sẽ định vị Mộc Lan trên ma trận IE ở Phần 4.</p>
<div class="callout"><span class="badge">Mẹo</span> Viết yếu tố sao cho người khác kiểm chứng được: "tỷ lệ nghỉ việc 18% so với mức chung của ngành 30%" tốt hơn "nhân sự giỏi". Yếu tố mơ hồ dẫn tới điểm số không ai phản biện được.</div>`,
  ]]);

const c5e = doc('stm301-2-3-exercise', 'Exercise 1 — EFE and IFE matrices for GreenBike|||Bài tập 1 — ma trận EFE và IFE của GreenBike',
  'Bài tập: kiểm tra trọng số và quy tắc chấm điểm, tính điểm có trọng số và tổng điểm của ma trận EFE và IFE cho doanh nghiệp xe đạp điện giả định GreenBike, diễn giải kết quả quanh mức 2,5 và chọn vấn đề ưu tiên; kèm lời giải.',
  [[
    `<span class="eyebrow">STM301 · Part 2 · Exercise</span>
<h2>Exercise 1 — how well is GreenBike positioned?</h2>
<div class="callout"><span class="badge">Problem</span> GreenBike is a fictional e-bike maker; all data are illustrative. Its planning team proposes the factors below (weight / rating).<br><strong>EFE.</strong> O1 government incentives for low-emission vehicles 0.14 / 3 · O2 higher fuel prices make e-bikes cheaper to run 0.12 / 3 · O3 students and young workers want affordable mobility 0.10 / 4 · O4 growth of online sales channels 0.08 / 2 · T1 low-price imported e-bikes 0.18 / 2 · T2 large motorbike makers entering the e-bike segment 0.16 / 1 · T3 public concern about battery fires 0.12 / 2 · T4 volatile prices of lithium battery cells 0.10 / 3.<br><strong>IFE.</strong> S1 in-house battery-pack design with a clean safety record 0.16 / 4 · S2 dealer network of 120 stores in the north 0.12 / 3 · S3 competitive prices in the mid-range 0.10 / 3 · S4 young, capable R&amp;D team 0.08 / 3 · W1 weak brand awareness in the south 0.14 / 1 · W2 after-sales service slower than rivals 0.14 / 2 · W3 heavy dependence on imported battery cells from suppliers whose quality GreenBike cannot fully control 0.14 / 1 · W4 limited financial resources (cash and borrowing capacity) 0.12 / 2.<br>(a) Check both sets of weights and the IFE rating rule. (b) Compute every weighted score and both totals. (c) Interpret each total. (d) Which two factors deserve management's attention first?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) EFE weights: 0.14 + 0.12 + 0.10 + 0.08 = 0.44 (opportunities)
                 0.18 + 0.16 + 0.12 + 0.10 = 0.56 (threats)      total 1.00 ✓
    IFE weights: 0.16 + 0.12 + 0.10 + 0.08 = 0.46 (strengths)
                 0.14 + 0.14 + 0.14 + 0.12 = 0.54 (weaknesses)   total 1.00 ✓
    IFE rule: strengths rated 3–4, weaknesses rated 1–2 ✓

(b) EFE                           IFE
    O1 0.14 x 3 = 0.42            S1 0.16 x 4 = 0.64
    O2 0.12 x 3 = 0.36            S2 0.12 x 3 = 0.36
    O3 0.10 x 4 = 0.40            S3 0.10 x 3 = 0.30
    O4 0.08 x 2 = 0.16            S4 0.08 x 3 = 0.24
    T1 0.18 x 2 = 0.36            W1 0.14 x 1 = 0.14
    T2 0.16 x 1 = 0.16            W2 0.14 x 2 = 0.28
    T3 0.12 x 2 = 0.24            W3 0.14 x 1 = 0.14
    T4 0.10 x 3 = 0.30            W4 0.12 x 2 = 0.24
    EFE total = 2.40              IFE total = 2.34

(c) EFE 2.40 &lt; 2.5 → responds slightly below average to its environment
    (opportunities 1.34 on 0.44 of the weight, average rating ≈ 3.05;
    threats 1.06 on 0.56 of the weight, average rating ≈ 1.89: it seizes
    opportunities far better than it defends against threats).
    IFE 2.34 &lt; 2.5 → internally somewhat weak: weaknesses carry 0.54 of the
    weight and two of them are rated 1.

(d) T2 — second-heaviest external factor (0.16) with the poorest response (1).
    W3 — heavy weakness (0.14, rated 1) that also magnifies T3 and T4.
    Gap = weight x (4 − rating): T2 0.16 x 3 = 0.48, the largest on the
    EFE side; on the IFE side W1 and W3 tie at 0.14 x 3 = 0.42.</code></pre>
<p><strong>Why:</strong> the totals tell you <em>whether</em> GreenBike is above or below average; the individual rows tell you <em>where</em> to act. A factor with a large weight and a low rating is the costliest gap, measured as weight × (4 − rating). W1 and W3 tie on that measure; W3 wins the tie because the same cause (imported cells of uncontrolled quality) sits behind two threats — battery-fire concerns (T3) and volatile cell prices (T4). Keep these numbers: in lesson 4.2 the totals 2.40 and 2.34 place GreenBike on the IE matrix, and Exercise 3 reuses all sixteen factors in a QSPM.</p>`,
    `<span class="eyebrow">STM301 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — GreenBike đang ở vị thế nào?</h2>
<div class="callout"><span class="badge">Đề</span> GreenBike là một doanh nghiệp sản xuất xe đạp điện giả định; mọi dữ liệu là số minh hoạ. Nhóm hoạch định đề xuất các yếu tố sau (trọng số / điểm phân loại).<br><strong>EFE.</strong> O1 nhà nước khuyến khích phương tiện phát thải thấp 0,14 / 3 · O2 giá nhiên liệu tăng khiến xe đạp điện rẻ hơn khi sử dụng 0,12 / 3 · O3 sinh viên và người trẻ đi làm cần phương tiện giá phải chăng 0,10 / 4 · O4 kênh bán hàng trực tuyến tăng trưởng 0,08 / 2 · T1 xe đạp điện nhập khẩu giá rẻ 0,18 / 2 · T2 các hãng xe máy lớn gia nhập phân khúc xe đạp điện 0,16 / 1 · T3 dư luận lo ngại cháy pin 0,12 / 2 · T4 giá cell pin lithium biến động 0,10 / 3.<br><strong>IFE.</strong> S1 tự thiết kế bộ pin, hồ sơ an toàn tốt 0,16 / 4 · S2 mạng lưới 120 đại lý ở miền Bắc 0,12 / 3 · S3 giá cạnh tranh ở phân khúc tầm trung 0,10 / 3 · S4 đội R&amp;D trẻ, có năng lực 0,08 / 3 · W1 mức nhận biết thương hiệu ở miền Nam yếu 0,14 / 1 · W2 dịch vụ sau bán chậm hơn đối thủ 0,14 / 2 · W3 phụ thuộc nhiều vào cell pin nhập khẩu từ các nhà cung cấp mà GreenBike không kiểm soát được hoàn toàn chất lượng 0,14 / 1 · W4 nguồn lực tài chính hạn chế (tiền mặt và khả năng vay) 0,12 / 2.<br>(a) Kiểm tra hai bộ trọng số và quy tắc chấm điểm IFE. (b) Tính mọi điểm có trọng số và hai tổng điểm. (c) Diễn giải từng tổng điểm. (d) Hai yếu tố nào cần ban lãnh đạo ưu tiên xử lý trước?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Trọng số EFE: 0,14 + 0,12 + 0,10 + 0,08 = 0,44 (cơ hội)
                  0,18 + 0,16 + 0,12 + 0,10 = 0,56 (nguy cơ)       tổng 1,00 ✓
    Trọng số IFE: 0,16 + 0,12 + 0,10 + 0,08 = 0,46 (điểm mạnh)
                  0,14 + 0,14 + 0,14 + 0,12 = 0,54 (điểm yếu)      tổng 1,00 ✓
    Quy tắc IFE: điểm mạnh chấm 3–4, điểm yếu chấm 1–2 ✓

(b) EFE                           IFE
    O1 0,14 x 3 = 0,42            S1 0,16 x 4 = 0,64
    O2 0,12 x 3 = 0,36            S2 0,12 x 3 = 0,36
    O3 0,10 x 4 = 0,40            S3 0,10 x 3 = 0,30
    O4 0,08 x 2 = 0,16            S4 0,08 x 3 = 0,24
    T1 0,18 x 2 = 0,36            W1 0,14 x 1 = 0,14
    T2 0,16 x 1 = 0,16            W2 0,14 x 2 = 0,28
    T3 0,12 x 2 = 0,24            W3 0,14 x 1 = 0,14
    T4 0,10 x 3 = 0,30            W4 0,12 x 2 = 0,24
    Tổng EFE = 2,40               Tổng IFE = 2,34

(c) EFE 2,40 &lt; 2,5 → phản ứng với môi trường hơi dưới mức trung bình
    (nhóm cơ hội 1,34 trên 0,44 trọng số, điểm bình quân ≈ 3,05;
    nhóm nguy cơ 1,06 trên 0,56 trọng số, điểm bình quân ≈ 1,89: doanh
    nghiệp tận dụng cơ hội tốt hơn hẳn so với phòng thủ trước nguy cơ).
    IFE 2,34 &lt; 2,5 → nội bộ hơi yếu: điểm yếu chiếm 0,54 tổng trọng số
    và hai trong số đó bị chấm 1.

(d) T2 — yếu tố bên ngoài nặng thứ hai (0,16) nhưng được ứng phó kém nhất (1).
    W3 — điểm yếu nặng (0,14, chấm 1) và còn khuếch đại T3, T4.
    Khoảng trống = trọng số x (4 − điểm): T2 0,16 x 3 = 0,48, lớn nhất phía
    EFE; phía IFE, W1 và W3 hoà nhau ở 0,14 x 3 = 0,42.</code></pre>
<p><strong>Vì sao:</strong> tổng điểm cho biết GreenBike <em>có</em> ở trên hay dưới mức trung bình hay không; từng dòng cho biết phải hành động <em>ở đâu</em>. Yếu tố có trọng số lớn mà điểm phân loại thấp là khoảng trống đắt giá nhất, đo bằng trọng số × (4 − điểm). W1 và W3 hoà nhau theo cách đo này; chọn W3 vì cùng một nguyên nhân (cell pin nhập khẩu, chất lượng không kiểm soát được hoàn toàn) nằm sau hai nguy cơ — dư luận lo ngại cháy pin (T3) và giá cell biến động (T4). Hãy giữ lại các con số này: ở bài 4.2, hai tổng 2,40 và 2,34 sẽ định vị GreenBike trên ma trận IE, và Bài tập 3 dùng lại toàn bộ mười sáu yếu tố trong một QSPM.</p>`,
  ]]);

const q2 = quiz('stm301-quiz-2', 'Quiz 2 — The internal assessment|||Quiz 2 — Đánh giá nội bộ', [
  { id: 'q1', question: 'Under the VRIO framework, a resource that is valuable and rare but easy for rivals to imitate gives…|||Theo khung VRIO, một nguồn lực có giá trị và hiếm nhưng đối thủ dễ bắt chước mang lại…', options: ['a competitive disadvantage|||bất lợi cạnh tranh', 'a sustained competitive advantage|||lợi thế cạnh tranh bền vững', 'competitive parity|||cân bằng cạnh tranh', 'a temporary competitive advantage|||lợi thế cạnh tranh tạm thời'], correctIndex: 3, explanation: 'Being valuable and rare creates an advantage, but because rivals can copy it the advantage lasts only until they do.|||Có giá trị và hiếm tạo ra lợi thế, nhưng vì đối thủ sao chép được nên lợi thế chỉ kéo dài tới khi họ làm theo.' },
  { id: 'q2', question: 'In David’s IFE matrix, a minor weakness receives a rating of…|||Trong ma trận IFE của David, một điểm yếu nhỏ nhận điểm phân loại…', options: ['2|||2', '1|||1', '3|||3', '0|||0'], correctIndex: 0, explanation: 'IFE ratings: 1 = major weakness, 2 = minor weakness, 3 = minor strength, 4 = major strength.|||Điểm IFE: 1 = điểm yếu lớn, 2 = điểm yếu nhỏ, 3 = điểm mạnh nhỏ, 4 = điểm mạnh lớn.' },
  { id: 'q3', question: 'Which of the following is a support activity in Porter’s value chain?|||Hoạt động nào sau đây là hoạt động hỗ trợ trong chuỗi giá trị của Porter?', options: ['Inbound logistics|||Hậu cần đầu vào', 'Marketing and sales|||Marketing và bán hàng', 'Human resource management|||Quản trị nguồn nhân lực', 'After-sales service|||Dịch vụ sau bán'], correctIndex: 2, explanation: 'The four support activities are firm infrastructure, human resource management, technology development and procurement; the other three options are primary activities.|||Bốn hoạt động hỗ trợ là cơ sở hạ tầng doanh nghiệp, quản trị nguồn nhân lực, phát triển công nghệ và thu mua; ba phương án còn lại là hoạt động chính.' },
]);

const c6 = doc('stm301-3-1-business-level-blue-ocean', '3.1 — Business-level strategy: generic strategies & blue ocean|||3.1 — Chiến lược cấp kinh doanh: chiến lược cạnh tranh tổng quát & đại dương xanh',
  'Các chiến lược cạnh tranh tổng quát của Porter (dẫn đầu chi phí, khác biệt hoá, tập trung) và chiến lược nhà cung cấp chi phí tốt nhất; điều kiện áp dụng và rủi ro; kẹt ở giữa; lợi thế và bất lợi của người đi đầu; chiến lược đại dương xanh: đổi mới giá trị, sơ đồ chiến lược, khung bốn hành động và lưới ERRC.',
  [[
    `<span class="eyebrow">STM301 · Part 3 · Lesson 3.1</span>
<h2>Business-level strategy: generic strategies &amp; blue ocean</h2>
<p class="lead">Business-level strategy answers one question: <em>how will this business beat its rivals in this industry?</em> Porter's answer is that a firm must choose its source of advantage — lower cost or differentiation — and its competitive scope — broad or narrow.</p>
<h3>Porter's generic strategies (with Thompson's best-cost variant)</h3>
<table>
<tr><th>Strategy</th><th>How advantage is created</th><th>Works best when…</th><th>Main risks</th></tr>
<tr><td>Cost leadership (broad)</td><td>Lowest cost in the industry through economies of scale, learning effects, high capacity use, lean design, efficient supply chains</td><td>Price competition is intense, products are standardized, buyers are price-sensitive and switch easily</td><td>Technological change wipes out the cost edge; rivals imitate; cutting cost so hard that the product falls below what buyers accept</td></tr>
<tr><td>Differentiation (broad)</td><td>Unique attributes buyers value — quality, features, service, design, brand — for which they pay a premium</td><td>Buyer needs are diverse, there are many ways to differentiate, few rivals follow the same approach</td><td>Premium grows larger than buyers will pay; imitation; differentiating on things buyers do not value</td></tr>
<tr><td>Focus (cost or differentiation)</td><td>Serving a narrow niche — a segment, region or product line — better than broad competitors</td><td>The niche is large enough to be profitable and big rivals are not interested in it</td><td>The niche shrinks; broad rivals or new focusers enter it</td></tr>
<tr><td>Best-cost provider</td><td>Good-to-excellent attributes at a lower cost than differentiators, i.e. more value for money</td><td>Buyers are value-conscious and want quality without paying the full premium</td><td>Being squeezed between low-cost leaders and high-end differentiators</td></tr>
</table>
<p>Porter warned that a firm trying to be all things to all people risks being <strong>stuck in the middle</strong>: higher costs than the cost leader, less distinctiveness than the differentiator, and below-average profits. Later work (the best-cost strategy, value innovation) shows that low cost and differentiation can be combined — but only through a deliberate design, not by drifting.</p>
<h3>Timing: first movers and late movers</h3>
<p>Moving first can secure scarce resources (prime store locations, key suppliers), build reputation and lock in customers. But pioneers also bear the cost of educating the market and of mistakes, while late movers can imitate proven designs more cheaply. First-mover advantage is real only when it can be defended.</p>
<h3>Blue ocean strategy</h3>
<p>W. Chan Kim and Renée Mauborgne distinguish <strong>red oceans</strong> — existing industries where firms fight over a fixed pool of demand — from <strong>blue oceans</strong> — uncontested market space where demand is created rather than fought over. The core idea is <strong>value innovation</strong>: pursuing differentiation and low cost at the same time by redesigning what the industry offers.</p>
<table>
<tr><th>Red ocean</th><th>Blue ocean</th></tr>
<tr><td>Compete in existing market space</td><td>Create uncontested market space</td></tr>
<tr><td>Beat the competition</td><td>Make the competition irrelevant</td></tr>
<tr><td>Exploit existing demand</td><td>Create and capture new demand</td></tr>
<tr><td>Make the value–cost trade-off</td><td>Break the value–cost trade-off</td></tr>
</table>
<p>Two tools support it. The <strong>strategy canvas</strong> plots the factors an industry competes on (horizontal axis) against the level offered (vertical axis); each firm's line is its <em>value curve</em>. The <strong>four actions framework</strong> asks which factors to <strong>eliminate</strong>, <strong>reduce</strong>, <strong>raise</strong> and <strong>create</strong>; the answers are recorded in an <strong>ERRC grid</strong>.</p>
<pre><code class="language-text">ERRC grid — a "quiet study café" format for Moc Lan (fictional idea)
Eliminate : table service, a long food menu
Reduce    : decoration spending, number of drink variants
Raise     : seating comfort, Wi-Fi reliability, opening hours
Create    : bookable quiet study pods, a monthly study pass</code></pre>
<p>The new value curve departs from the industry's: less of what students do not value, much more of what they do, and something no rival offers.</p>
<div class="callout"><span class="badge">Remember</span> A generic strategy is a commitment that shapes every activity in the value chain. If operations, marketing and HR each pursue a different logic, the firm drifts into the middle.</div>`,
    `<span class="eyebrow">STM301 · Phần 3 · Bài 3.1</span>
<h2>Chiến lược cấp kinh doanh: chiến lược cạnh tranh tổng quát &amp; đại dương xanh</h2>
<p class="lead">Chiến lược cấp kinh doanh trả lời một câu hỏi: <em>đơn vị kinh doanh này sẽ đánh bại đối thủ trong ngành bằng cách nào?</em> Câu trả lời của Porter là doanh nghiệp phải chọn nguồn lợi thế — chi phí thấp hơn hay khác biệt hoá — và phạm vi cạnh tranh — rộng hay hẹp.</p>
<h3>Các chiến lược tổng quát của Porter (và biến thể chi phí tốt nhất của Thompson)</h3>
<table>
<tr><th>Chiến lược</th><th>Cách tạo lợi thế</th><th>Hiệu quả nhất khi…</th><th>Rủi ro chính</th></tr>
<tr><td>Dẫn đầu chi phí (phạm vi rộng)</td><td>Chi phí thấp nhất ngành nhờ lợi thế kinh tế theo quy mô, hiệu ứng học hỏi, sử dụng công suất cao, thiết kế tinh gọn, chuỗi cung ứng hiệu quả</td><td>Cạnh tranh giá gay gắt, sản phẩm tiêu chuẩn hoá, người mua nhạy cảm về giá và dễ chuyển đổi</td><td>Thay đổi công nghệ xoá bỏ lợi thế chi phí; đối thủ bắt chước; cắt giảm quá mức khiến sản phẩm dưới mức người mua chấp nhận</td></tr>
<tr><td>Khác biệt hoá (phạm vi rộng)</td><td>Thuộc tính độc đáo được người mua đánh giá cao — chất lượng, tính năng, dịch vụ, thiết kế, thương hiệu — và sẵn sàng trả giá cao hơn</td><td>Nhu cầu người mua đa dạng, có nhiều cách khác biệt hoá, ít đối thủ đi cùng hướng</td><td>Mức giá cao vượt quá mức người mua chịu trả; bị bắt chước; khác biệt hoá ở những điểm người mua không coi trọng</td></tr>
<tr><td>Tập trung (chi phí hoặc khác biệt hoá)</td><td>Phục vụ một thị trường ngách — một phân khúc, vùng địa lý hay dòng sản phẩm — tốt hơn các đối thủ phạm vi rộng</td><td>Thị trường ngách đủ lớn để có lãi và các đối thủ lớn không quan tâm</td><td>Thị trường ngách thu hẹp; đối thủ phạm vi rộng hoặc doanh nghiệp tập trung khác xâm nhập</td></tr>
<tr><td>Nhà cung cấp chi phí tốt nhất</td><td>Thuộc tính từ tốt tới xuất sắc với chi phí thấp hơn các doanh nghiệp khác biệt hoá, tức giá trị cao hơn so với số tiền bỏ ra</td><td>Người mua coi trọng giá trị, muốn chất lượng mà không phải trả toàn bộ phần giá cao</td><td>Bị kẹp giữa doanh nghiệp dẫn đầu chi phí và doanh nghiệp khác biệt hoá cao cấp</td></tr>
</table>
<p>Porter cảnh báo rằng doanh nghiệp cố gắng làm mọi thứ cho mọi người có nguy cơ bị <strong>kẹt ở giữa</strong>: chi phí cao hơn doanh nghiệp dẫn đầu chi phí, kém khác biệt hơn doanh nghiệp khác biệt hoá, và lợi nhuận dưới mức trung bình. Các nghiên cứu sau này (chiến lược chi phí tốt nhất, đổi mới giá trị) cho thấy có thể kết hợp chi phí thấp và khác biệt hoá — nhưng chỉ bằng một thiết kế có chủ đích, không phải bằng cách trôi dạt.</p>
<h3>Thời điểm: người đi đầu và người theo sau</h3>
<p>Đi đầu có thể giúp chiếm được nguồn lực khan hiếm (vị trí cửa hàng đẹp, nhà cung cấp chủ chốt), xây dựng danh tiếng và giữ chân khách hàng. Nhưng người tiên phong cũng gánh chi phí giáo dục thị trường và chi phí sai lầm, trong khi người theo sau có thể bắt chước các thiết kế đã được kiểm chứng với chi phí thấp hơn. Lợi thế người đi đầu chỉ có thật khi bảo vệ được.</p>
<h3>Chiến lược đại dương xanh</h3>
<p>W. Chan Kim và Renée Mauborgne phân biệt <strong>đại dương đỏ</strong> — các ngành hiện hữu nơi doanh nghiệp tranh giành một lượng cầu cố định — với <strong>đại dương xanh</strong> — khoảng thị trường chưa có cạnh tranh, nơi cầu được tạo ra thay vì bị tranh giành. Ý tưởng cốt lõi là <strong>đổi mới giá trị</strong>: đồng thời theo đuổi khác biệt hoá và chi phí thấp bằng cách thiết kế lại những gì ngành đang cung cấp.</p>
<table>
<tr><th>Đại dương đỏ</th><th>Đại dương xanh</th></tr>
<tr><td>Cạnh tranh trong khoảng thị trường hiện có</td><td>Tạo ra khoảng thị trường chưa có cạnh tranh</td></tr>
<tr><td>Đánh bại đối thủ</td><td>Khiến cạnh tranh trở nên không còn quan trọng</td></tr>
<tr><td>Khai thác nhu cầu hiện có</td><td>Tạo ra và nắm bắt nhu cầu mới</td></tr>
<tr><td>Chấp nhận đánh đổi giữa giá trị và chi phí</td><td>Phá vỡ sự đánh đổi giữa giá trị và chi phí</td></tr>
</table>
<p>Có hai công cụ hỗ trợ. <strong>Sơ đồ chiến lược</strong> thể hiện các yếu tố mà ngành cạnh tranh (trục ngang) và mức độ cung cấp (trục dọc); đường của mỗi doanh nghiệp là <em>đường giá trị</em> của nó. <strong>Khung bốn hành động</strong> đặt câu hỏi nên <strong>loại bỏ</strong>, <strong>cắt giảm</strong>, <strong>gia tăng</strong> và <strong>tạo mới</strong> những yếu tố nào; câu trả lời được ghi vào <strong>lưới ERRC</strong>.</p>
<pre><code class="language-text">Lưới ERRC — mô hình "quán cà phê học yên tĩnh" của Mộc Lan (ý tưởng giả định)
Loại bỏ   : phục vụ tại bàn, thực đơn đồ ăn dài
Cắt giảm  : chi phí trang trí, số biến thể đồ uống
Gia tăng  : độ thoải mái của chỗ ngồi, độ ổn định Wi-Fi, giờ mở cửa
Tạo mới   : buồng học yên tĩnh đặt trước được, vé học theo tháng</code></pre>
<p>Đường giá trị mới tách khỏi đường của ngành: ít hơn ở những thứ sinh viên không coi trọng, nhiều hơn hẳn ở những thứ họ coi trọng, và có thứ chưa đối thủ nào cung cấp.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Chiến lược tổng quát là một cam kết định hình mọi hoạt động trong chuỗi giá trị. Nếu vận hành, marketing và nhân sự mỗi bên theo một logic khác nhau, doanh nghiệp sẽ trôi dần vào vùng kẹt ở giữa.</div>`,
  ]]);

const c7 = doc('stm301-3-2-corporate-level', '3.2 — Corporate-level strategy: integration, diversification, M&A & alliances|||3.2 — Chiến lược cấp công ty: hội nhập, đa dạng hoá, M&A & liên minh',
  'Mười một loại chiến lược theo David (hội nhập dọc thuận chiều, ngược chiều, hội nhập ngang; thâm nhập, phát triển thị trường, phát triển sản phẩm; đa dạng hoá liên quan và không liên quan; thu hẹp, cắt bỏ, thanh lý); ưu nhược điểm của hội nhập dọc; ba phép thử đa dạng hoá của Porter; sáp nhập và mua lại (động cơ, lý do thất bại, phép tính phần bù); liên minh chiến lược và liên doanh.',
  [[
    `<span class="eyebrow">STM301 · Part 3 · Lesson 3.2</span>
<h2>Corporate-level strategy: integration, diversification, M&amp;A &amp; alliances</h2>
<p class="lead">Corporate-level strategy decides the scope of the firm: which activities in the industry value chain it performs, which products and markets it serves, and whether it grows by itself, by buying others or by partnering.</p>
<h3>Types of strategies (David), with coffee-chain illustrations</h3>
<table>
<tr><th>Group</th><th>Strategy</th><th>Definition</th><th>Illustration (Moc Lan, fictional)</th></tr>
<tr><td rowspan="3">Integration</td><td>Forward integration</td><td>Gaining ownership or more control over distributors or retailers</td><td>A coffee roaster opens its own cafés</td></tr>
<tr><td>Backward integration</td><td>Gaining ownership or more control over suppliers</td><td>Moc Lan buys a bean-processing plant</td></tr>
<tr><td>Horizontal integration</td><td>Gaining ownership or more control over competitors</td><td>Moc Lan acquires a rival regional chain</td></tr>
<tr><td rowspan="3">Intensive</td><td>Market penetration</td><td>More share for present products in present markets through greater marketing effort</td><td>Loyalty campaigns in its two cities</td></tr>
<tr><td>Market development</td><td>Introducing present products into new geographic areas</td><td>Opening stores in two new cities</td></tr>
<tr><td>Product development</td><td>Improving present products or developing new ones</td><td>Launching bottled ready-to-drink coffee</td></tr>
<tr><td rowspan="2">Diversification</td><td>Related</td><td>Adding new but related businesses (shared value-chain fit)</td><td>Opening a chain of bakery-cafés that sell to consumers (sharing brand, sites and procurement)</td></tr>
<tr><td>Unrelated</td><td>Adding new, unrelated businesses</td><td>Buying an office-rental company</td></tr>
<tr><td rowspan="3">Defensive</td><td>Retrenchment</td><td>Regrouping through cost and asset reduction to reverse declining sales and profits</td><td>Closing loss-making stores</td></tr>
<tr><td>Divestiture</td><td>Selling a division or part of the organization</td><td>Selling the bakery business</td></tr>
<tr><td>Liquidation</td><td>Selling all of the firm's assets, in parts, for their tangible worth</td><td>A last resort when nothing else works</td></tr>
</table>
<p>The boundaries between types are not always sharp. A bakery that mainly supplies Moc Lan's own stores would be <em>backward integration</em> (control over a supplier), not diversification. A bottled ready-to-drink coffee sold in supermarkets reaches a new channel and new competitors, so it sits on the border with related diversification; this course treats it as product development because it extends the existing brand and roastery. When you classify a move, state the reason.</p>
<h3>Vertical integration: benefits and costs</h3>
<p>Integrating backward or forward can secure supply, protect quality, capture margins and protect proprietary know-how. It also raises fixed costs, reduces flexibility when technology or demand changes, and makes it hard to balance capacity across stages. <strong>Strategic outsourcing</strong> — letting specialists perform non-core activities — is often the better alternative.</p>
<h3>Diversification: Porter's three tests</h3>
<ol>
<li><strong>Attractiveness test</strong> — the industry entered must be structurally attractive (five forces).</li>
<li><strong>Cost-of-entry test</strong> — entering must not cost so much that it absorbs all future profits.</li>
<li><strong>Better-off test</strong> — the new unit or the existing businesses must gain a competitive advantage from being together.</li>
</ol>
<p>Related diversification can pass the third test through <strong>synergy</strong>: sharing activities (economies of scope) and transferring skills. Unrelated diversification must rely on superior financial or general-management skill, which is harder to sustain.</p>
<h3>Mergers and acquisitions</h3>
<p>In a <strong>merger</strong> two firms of comparable size combine as equals; in an <strong>acquisition</strong> one firm buys another, in a friendly deal or a <strong>hostile takeover</strong>. (Vietnam's Law on Enterprises uses narrower legal terms: <em>hợp nhất</em> — two or more companies combine into a new company and cease to exist — and <em>sáp nhập</em> — one or more companies are absorbed into another existing company; check the text in force.) M&amp;A offers speed, access to capabilities and markets, scale economies and less rivalry. Yet many acquisitions fail to create value, commonly because of integration problems (clashing cultures and systems), overpaying, overestimating synergies and weak pre-acquisition screening (due diligence).</p>
<pre><code class="language-text">Illustrative premium test (VND billion, assumed)
Target's market value before the bid           400
Acquirer pays a 30% premium: 400 x 1.30      = 520
Premium paid: 520 − 400                      = 120
Expected integration costs                   =  20
→ the deal creates value for the acquirer only if the present value
  of synergies exceeds 120 + 20 = 140</code></pre>
<h3>Strategic alliances and joint ventures</h3>
<p>A <strong>strategic alliance</strong> is a cooperative agreement between firms that stay independent; a <strong>joint venture</strong> creates a separate firm owned by the partners. Alliances share costs and risks, give access to partners' capabilities or local knowledge and allow faster entry. The costs: shared control, possible leakage of know-how to a future rival, and conflicts when partners' goals diverge. Clear governance and exit clauses matter as much as the business case.</p>
<div class="callout"><span class="badge">Key question</span> For every corporate move, ask Porter's better-off test first: what will this combination do that neither business could do alone? If the answer is only "grow bigger", the premium paid is likely to be lost.</div>`,
    `<span class="eyebrow">STM301 · Phần 3 · Bài 3.2</span>
<h2>Chiến lược cấp công ty: hội nhập, đa dạng hoá, M&amp;A &amp; liên minh</h2>
<p class="lead">Chiến lược cấp công ty quyết định phạm vi của doanh nghiệp: thực hiện những hoạt động nào trong chuỗi giá trị của ngành, phục vụ sản phẩm và thị trường nào, và tăng trưởng bằng sức mình, bằng cách mua lại hay bằng hợp tác.</p>
<h3>Các loại chiến lược (David), minh hoạ bằng chuỗi cà phê</h3>
<table>
<tr><th>Nhóm</th><th>Chiến lược</th><th>Định nghĩa</th><th>Minh hoạ (Mộc Lan, giả định)</th></tr>
<tr><td rowspan="3">Hội nhập</td><td>Hội nhập về phía trước (dọc thuận chiều)</td><td>Giành quyền sở hữu hoặc tăng kiểm soát đối với nhà phân phối, nhà bán lẻ</td><td>Một nhà rang cà phê mở quán cà phê của riêng mình</td></tr>
<tr><td>Hội nhập về phía sau (dọc ngược chiều)</td><td>Giành quyền sở hữu hoặc tăng kiểm soát đối với nhà cung cấp</td><td>Mộc Lan mua một nhà máy chế biến hạt cà phê</td></tr>
<tr><td>Hội nhập ngang</td><td>Giành quyền sở hữu hoặc tăng kiểm soát đối với đối thủ cạnh tranh</td><td>Mộc Lan mua lại một chuỗi đối thủ trong vùng</td></tr>
<tr><td rowspan="3">Chuyên sâu</td><td>Thâm nhập thị trường</td><td>Tăng thị phần cho sản phẩm hiện có ở thị trường hiện có bằng nỗ lực marketing lớn hơn</td><td>Chiến dịch khách hàng thân thiết tại hai thành phố đang có</td></tr>
<tr><td>Phát triển thị trường</td><td>Đưa sản phẩm hiện có vào khu vực địa lý mới</td><td>Mở cửa hàng ở hai thành phố mới</td></tr>
<tr><td>Phát triển sản phẩm</td><td>Cải tiến sản phẩm hiện có hoặc phát triển sản phẩm mới</td><td>Ra mắt cà phê đóng chai uống liền</td></tr>
<tr><td rowspan="2">Đa dạng hoá</td><td>Có liên quan</td><td>Thêm ngành kinh doanh mới nhưng có liên quan (phù hợp về chuỗi giá trị)</td><td>Mở chuỗi tiệm bánh bán cho người tiêu dùng (dùng chung thương hiệu, mặt bằng, thu mua)</td></tr>
<tr><td>Không liên quan</td><td>Thêm ngành kinh doanh mới, không liên quan</td><td>Mua một công ty cho thuê văn phòng</td></tr>
<tr><td rowspan="3">Phòng thủ</td><td>Thu hẹp</td><td>Tái tổ chức bằng cách cắt giảm chi phí và tài sản để đảo ngược đà giảm doanh số và lợi nhuận</td><td>Đóng các cửa hàng thua lỗ</td></tr>
<tr><td>Cắt bỏ (thoái vốn)</td><td>Bán một bộ phận hay một phần của tổ chức</td><td>Bán mảng tiệm bánh</td></tr>
<tr><td>Thanh lý</td><td>Bán toàn bộ tài sản của doanh nghiệp theo từng phần với giá trị hữu hình của chúng</td><td>Giải pháp cuối cùng khi không còn cách nào khác</td></tr>
</table>
<p>Ranh giới giữa các loại không phải lúc nào cũng rõ. Một tiệm bánh chủ yếu cung cấp cho chính các cửa hàng của Mộc Lan là <em>hội nhập về phía sau</em> (kiểm soát nhà cung cấp), không phải đa dạng hoá. Cà phê đóng chai uống liền bán ở siêu thị đi vào một kênh mới và gặp đối thủ mới, nên nằm ở ranh giới với đa dạng hoá có liên quan; môn này xếp nó vào phát triển sản phẩm vì nó mở rộng từ thương hiệu và xưởng rang sẵn có. Khi phân loại một động thái, hãy nêu rõ lý do.</p>
<h3>Hội nhập dọc: lợi ích và chi phí</h3>
<p>Hội nhập về phía sau hay phía trước có thể đảm bảo nguồn cung, bảo vệ chất lượng, giữ lại phần biên lợi nhuận và bảo vệ bí quyết độc quyền. Nhưng nó cũng làm tăng chi phí cố định, giảm tính linh hoạt khi công nghệ hay nhu cầu thay đổi, và gây khó khăn cho việc cân đối công suất giữa các khâu. <strong>Thuê ngoài chiến lược</strong> — để các nhà chuyên môn đảm nhận hoạt động không cốt lõi — thường là lựa chọn tốt hơn.</p>
<h3>Đa dạng hoá: ba phép thử của Porter</h3>
<ol>
<li><strong>Phép thử mức hấp dẫn</strong> — ngành gia nhập phải hấp dẫn về mặt cấu trúc (năm lực lượng).</li>
<li><strong>Phép thử chi phí gia nhập</strong> — chi phí gia nhập không được lớn tới mức nuốt hết lợi nhuận tương lai.</li>
<li><strong>Phép thử tốt hơn</strong> — đơn vị mới hoặc các đơn vị hiện có phải có thêm lợi thế cạnh tranh nhờ ở cùng nhau.</li>
</ol>
<p>Đa dạng hoá có liên quan có thể vượt phép thử thứ ba nhờ <strong>cộng hưởng</strong>: dùng chung hoạt động (lợi thế kinh tế theo phạm vi) và chuyển giao kỹ năng. Đa dạng hoá không liên quan phải dựa vào năng lực tài chính hoặc năng lực quản trị chung vượt trội, vốn khó duy trì hơn.</p>
<h3>Sáp nhập và mua lại</h3>
<p>Trong một thương vụ <strong>hợp nhất</strong> (merger theo nghĩa của David), hai doanh nghiệp quy mô tương đương kết hợp ngang hàng thành một; trong <strong>mua lại</strong>, một doanh nghiệp mua doanh nghiệp khác, theo thoả thuận thân thiện hoặc bằng <strong>thâu tóm thù địch</strong>. (Luật Doanh nghiệp dùng thuật ngữ pháp lý hẹp hơn: <em>hợp nhất</em> là hai hay nhiều công ty hợp thành một công ty mới, các công ty cũ chấm dứt tồn tại; <em>sáp nhập</em> là một hay nhiều công ty nhập vào một công ty khác đang tồn tại — hãy kiểm văn bản đang có hiệu lực. Cụm "mua bán và sáp nhập (M&amp;A)" vẫn là tên gọi chung.) M&amp;A mang lại tốc độ, khả năng tiếp cận năng lực và thị trường, lợi thế kinh tế theo quy mô và giảm cạnh tranh. Tuy vậy, nhiều thương vụ mua lại không tạo ra giá trị, thường vì khó khăn khi hợp nhất (xung đột văn hoá và hệ thống), trả giá quá cao, đánh giá quá cao hiệu ứng cộng hưởng và sàng lọc trước thương vụ (thẩm định) sơ sài.</p>
<pre><code class="language-text">Phép thử phần bù minh hoạ (tỷ đồng, giả định)
Giá trị thị trường của mục tiêu trước khi chào mua   400
Bên mua trả phần bù 30%: 400 x 1,30               = 520
Phần bù đã trả: 520 − 400                         = 120
Chi phí hợp nhất dự kiến                          =  20
→ thương vụ chỉ tạo giá trị cho bên mua nếu giá trị hiện tại
  của hiệu ứng cộng hưởng lớn hơn 120 + 20 = 140</code></pre>
<h3>Liên minh chiến lược và liên doanh</h3>
<p><strong>Liên minh chiến lược</strong> là thoả thuận hợp tác giữa các doanh nghiệp vẫn giữ tính độc lập; <strong>liên doanh</strong> tạo ra một doanh nghiệp riêng do các bên cùng sở hữu. Liên minh giúp chia sẻ chi phí và rủi ro, tiếp cận năng lực hoặc hiểu biết thị trường địa phương của đối tác và gia nhập nhanh hơn. Cái giá phải trả: quyền kiểm soát bị chia sẻ, bí quyết có thể rò rỉ sang một đối thủ tương lai, và xung đột khi mục tiêu của các bên khác nhau. Cơ chế quản trị và điều khoản rút lui rõ ràng quan trọng không kém phương án kinh doanh.</p>
<div class="callout"><span class="badge">Câu hỏi then chốt</span> Với mọi động thái cấp công ty, hãy áp dụng phép thử tốt hơn của Porter trước tiên: sự kết hợp này làm được điều gì mà từng đơn vị riêng lẻ không làm được? Nếu câu trả lời chỉ là "to hơn", phần bù đã trả nhiều khả năng sẽ mất trắng.</div>`,
  ]]);

const c8 = doc('stm301-3-3-international-strategy', '3.3 — International strategy & entry modes|||3.3 — Chiến lược quốc tế & phương thức thâm nhập',
  'Vì sao doanh nghiệp mở rộng ra quốc tế; mô hình kim cương của Porter; áp lực giảm chi phí và áp lực đáp ứng địa phương dẫn tới bốn chiến lược (quốc tế, đa nội địa/địa phương hoá, tiêu chuẩn hoá toàn cầu, xuyên quốc gia); năm phương thức thâm nhập với ưu nhược điểm; các rủi ro khi kinh doanh quốc tế.',
  [[
    `<span class="eyebrow">STM301 · Part 3 · Lesson 3.3</span>
<h2>International strategy &amp; entry modes</h2>
<h3>Why expand abroad?</h3>
<ul>
<li><strong>Larger markets</strong> for products and core competencies developed at home.</li>
<li><strong>Economies of scale</strong> — spreading fixed costs such as R&amp;D and brand building over more units.</li>
<li><strong>Location economies</strong> — performing each value-chain activity where it is cheapest or best.</li>
<li><strong>Learning</strong> — ideas and skills developed in one country can be transferred to others.</li>
</ul>
<h3>Where national advantage comes from: Porter's diamond</h3>
<p>Porter's diamond explains why some countries produce internationally competitive firms in certain industries through four interacting conditions: <strong>factor conditions</strong> (skilled labour, infrastructure), <strong>demand conditions</strong> (demanding home customers), <strong>related and supporting industries</strong> (strong local suppliers) and <strong>firm strategy, structure and rivalry</strong> (intense domestic competition). Government policy and chance influence all four.</p>
<h3>Two pressures, four strategies</h3>
<p>Following Hill and colleagues, the choice depends on two pressures: <strong>for cost reductions</strong> (strong when products are commodity-like and price competition is fierce) and <strong>for local responsiveness</strong> (strong when tastes, distribution channels, regulations or infrastructure differ across countries).</p>
<table>
<tr><th></th><th>Low pressure for local responsiveness</th><th>High pressure for local responsiveness</th></tr>
<tr><td><strong>High pressure for cost reductions</strong></td><td><strong>Global standardization</strong> — standardized product, activities concentrated in a few optimal locations to reap scale and learning economies</td><td><strong>Transnational</strong> — pursue low cost, local adaptation and global learning at once; hardest to manage</td></tr>
<tr><td><strong>Low pressure for cost reductions</strong></td><td><strong>International</strong> — sell home-developed products abroad with little adaptation; product development kept at home</td><td><strong>Localization (multidomestic)</strong> — adapt products and marketing to each national market, accepting higher costs</td></tr>
</table>
<h3>Entry modes</h3>
<table>
<tr><th>Mode</th><th>Advantages</th><th>Disadvantages</th></tr>
<tr><td>Exporting</td><td>Low investment, location and scale economies at home</td><td>Transport costs, trade barriers, dependence on local agents</td></tr>
<tr><td>Licensing</td><td>Low cost and risk; licensee bears the investment</td><td>Little control over quality and technology; licensee may become a competitor</td></tr>
<tr><td>Franchising</td><td>Fast growth with low capital; widely used in services</td><td>Hard to control quality in distant markets; profits shared</td></tr>
<tr><td>Joint venture</td><td>Partner's local knowledge and contacts; shared costs and political risk</td><td>Shared control; risk of losing technology; conflicts over goals</td></tr>
<tr><td>Wholly owned subsidiary (greenfield or acquisition)</td><td>Full control of technology and operations; all profits retained</td><td>Highest cost and risk; slow to build (greenfield) or hard to integrate (acquisition)</td></tr>
</table>
<p>Entry modes move from low commitment and low control (exporting) to high commitment and high control (wholly owned subsidiaries). Firms often start with exporting or partners and deepen their commitment as they learn the market.</p>
<h3>Risks of operating abroad</h3>
<p>Political and regulatory risk, economic and currency risk, and <strong>cultural distance</strong>, which affects negotiation, management practice and consumer tastes. For a Vietnamese firm, trade agreements can lower tariffs and open markets, but rules of origin, standards and non-tariff requirements still have to be met — check the current texts of each agreement before relying on them.</p>
<div class="callout"><span class="badge">Common mistake</span> Assuming that what wins at home will win abroad unchanged. Test the pressure for local responsiveness first; it decides how much of the home strategy can travel.</div>`,
    `<span class="eyebrow">STM301 · Phần 3 · Bài 3.3</span>
<h2>Chiến lược quốc tế &amp; phương thức thâm nhập</h2>
<h3>Vì sao mở rộng ra nước ngoài?</h3>
<ul>
<li><strong>Thị trường lớn hơn</strong> cho sản phẩm và năng lực cốt lõi đã phát triển trong nước.</li>
<li><strong>Lợi thế kinh tế theo quy mô</strong> — phân bổ chi phí cố định như R&amp;D và xây dựng thương hiệu cho nhiều đơn vị sản phẩm hơn.</li>
<li><strong>Lợi thế kinh tế theo địa điểm</strong> — thực hiện mỗi hoạt động trong chuỗi giá trị ở nơi rẻ nhất hoặc tốt nhất.</li>
<li><strong>Học hỏi</strong> — ý tưởng và kỹ năng phát triển ở một nước có thể chuyển sang nước khác.</li>
</ul>
<h3>Lợi thế quốc gia đến từ đâu: mô hình kim cương của Porter</h3>
<p>Mô hình kim cương của Porter giải thích vì sao một số quốc gia tạo ra các doanh nghiệp có năng lực cạnh tranh quốc tế trong những ngành nhất định, thông qua bốn điều kiện tương tác với nhau: <strong>điều kiện yếu tố sản xuất</strong> (lao động lành nghề, hạ tầng), <strong>điều kiện cầu</strong> (khách hàng trong nước khó tính), <strong>các ngành liên quan và hỗ trợ</strong> (nhà cung cấp nội địa mạnh) và <strong>chiến lược, cơ cấu và cạnh tranh của doanh nghiệp</strong> (cạnh tranh trong nước gay gắt). Chính sách của nhà nước và yếu tố cơ hội tác động lên cả bốn điều kiện.</p>
<h3>Hai áp lực, bốn chiến lược</h3>
<p>Theo Hill và cộng sự, lựa chọn phụ thuộc vào hai áp lực: <strong>áp lực giảm chi phí</strong> (mạnh khi sản phẩm mang tính hàng hoá thông thường và cạnh tranh giá gay gắt) và <strong>áp lực đáp ứng địa phương</strong> (mạnh khi thị hiếu, kênh phân phối, quy định hay hạ tầng khác nhau giữa các nước).</p>
<table>
<tr><th></th><th>Áp lực đáp ứng địa phương thấp</th><th>Áp lực đáp ứng địa phương cao</th></tr>
<tr><td><strong>Áp lực giảm chi phí cao</strong></td><td><strong>Tiêu chuẩn hoá toàn cầu</strong> — sản phẩm tiêu chuẩn, hoạt động tập trung ở một vài địa điểm tối ưu để khai thác lợi thế quy mô và học hỏi</td><td><strong>Xuyên quốc gia</strong> — cùng lúc theo đuổi chi phí thấp, thích ứng địa phương và học hỏi toàn cầu; khó quản lý nhất</td></tr>
<tr><td><strong>Áp lực giảm chi phí thấp</strong></td><td><strong>Quốc tế</strong> — bán ra nước ngoài sản phẩm phát triển trong nước, ít điều chỉnh; phát triển sản phẩm vẫn đặt ở trong nước</td><td><strong>Địa phương hoá (đa nội địa)</strong> — điều chỉnh sản phẩm và marketing cho từng thị trường quốc gia, chấp nhận chi phí cao hơn</td></tr>
</table>
<h3>Phương thức thâm nhập</h3>
<table>
<tr><th>Phương thức</th><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td>Xuất khẩu</td><td>Đầu tư thấp, khai thác lợi thế địa điểm và quy mô ở trong nước</td><td>Chi phí vận chuyển, rào cản thương mại, phụ thuộc đại lý địa phương</td></tr>
<tr><td>Cấp phép (licensing)</td><td>Chi phí và rủi ro thấp; bên nhận phép chịu vốn đầu tư</td><td>Ít kiểm soát chất lượng và công nghệ; bên nhận phép có thể thành đối thủ</td></tr>
<tr><td>Nhượng quyền thương mại</td><td>Tăng trưởng nhanh với ít vốn; phổ biến trong ngành dịch vụ</td><td>Khó kiểm soát chất lượng ở thị trường xa; phải chia lợi nhuận</td></tr>
<tr><td>Liên doanh</td><td>Có hiểu biết và quan hệ địa phương của đối tác; chia sẻ chi phí và rủi ro chính trị</td><td>Kiểm soát bị chia sẻ; nguy cơ mất công nghệ; xung đột về mục tiêu</td></tr>
<tr><td>Công ty con sở hữu toàn bộ (đầu tư mới hoặc mua lại)</td><td>Toàn quyền kiểm soát công nghệ và hoạt động; giữ toàn bộ lợi nhuận</td><td>Chi phí và rủi ro cao nhất; xây dựng chậm (đầu tư mới) hoặc khó hợp nhất (mua lại)</td></tr>
</table>
<p>Các phương thức đi từ cam kết thấp, kiểm soát thấp (xuất khẩu) tới cam kết cao, kiểm soát cao (công ty con sở hữu toàn bộ). Doanh nghiệp thường bắt đầu bằng xuất khẩu hoặc hợp tác với đối tác rồi tăng dần mức cam kết khi đã hiểu thị trường.</p>
<h3>Rủi ro khi hoạt động ở nước ngoài</h3>
<p>Rủi ro chính trị và pháp lý, rủi ro kinh tế và tỷ giá, và <strong>khoảng cách văn hoá</strong>, vốn ảnh hưởng tới đàm phán, cách quản lý và thị hiếu người tiêu dùng. Với doanh nghiệp Việt Nam, các hiệp định thương mại có thể giảm thuế quan và mở cửa thị trường, nhưng vẫn phải đáp ứng quy tắc xuất xứ, tiêu chuẩn và các yêu cầu phi thuế quan — hãy kiểm văn bản đang có hiệu lực của từng hiệp định trước khi dựa vào.</p>
<div class="callout"><span class="badge">Lỗi hay gặp</span> Cho rằng cách thắng ở trong nước sẽ thắng ở nước ngoài mà không cần thay đổi. Hãy kiểm tra áp lực đáp ứng địa phương trước; nó quyết định bao nhiêu phần của chiến lược trong nước có thể mang ra ngoài.</div>`,
  ]]);

const q3 = quiz('stm301-quiz-3', 'Quiz 3 — Types of strategy|||Quiz 3 — Các loại chiến lược', [
  { id: 'q1', question: 'A coffee roaster that opens its own chain of cafes is pursuing…|||Một nhà rang cà phê mở chuỗi quán cà phê của riêng mình đang theo đuổi…', options: ['backward integration|||hội nhập về phía sau', 'forward integration|||hội nhập về phía trước', 'horizontal integration|||hội nhập ngang', 'unrelated diversification|||đa dạng hoá không liên quan'], correctIndex: 1, explanation: 'The roaster gains control over the retail stage closer to the final customer, which is forward integration.|||Nhà rang giành quyền kiểm soát khâu bán lẻ gần khách hàng cuối cùng hơn, tức là hội nhập về phía trước.' },
  { id: 'q2', question: 'The four actions framework of blue ocean strategy asks which factors to…|||Khung bốn hành động của chiến lược đại dương xanh đặt câu hỏi nên … những yếu tố nào?', options: ['plan, organize, lead and control|||hoạch định, tổ chức, lãnh đạo và kiểm soát', 'price, promote, place and produce|||định giá, xúc tiến, phân phối và sản xuất', 'buy, build, borrow and bundle|||mua, tự xây, vay mượn và đóng gói', 'eliminate, reduce, raise and create|||loại bỏ, cắt giảm, gia tăng và tạo mới'], correctIndex: 3, explanation: 'Eliminate, reduce, raise and create form the ERRC grid used to draw a new value curve.|||Loại bỏ, cắt giảm, gia tăng và tạo mới tạo thành lưới ERRC dùng để vẽ đường giá trị mới.' },
  { id: 'q3', question: 'A firm faces high pressure for cost reductions and low pressure for local responsiveness. Which international strategy fits best?|||Một doanh nghiệp chịu áp lực giảm chi phí cao và áp lực đáp ứng địa phương thấp. Chiến lược quốc tế nào phù hợp nhất?', options: ['Global standardization|||Tiêu chuẩn hoá toàn cầu', 'Localization|||Địa phương hoá', 'International|||Quốc tế', 'Transnational|||Xuyên quốc gia'], correctIndex: 0, explanation: 'With little need to adapt and strong cost pressure, a standardized product made in a few optimal locations captures scale and learning economies.|||Khi ít cần điều chỉnh và áp lực chi phí mạnh, sản phẩm tiêu chuẩn sản xuất ở vài địa điểm tối ưu giúp khai thác lợi thế quy mô và học hỏi.' },
]);

const c9 = doc('stm301-4-1-tows-space', '4.1 — The matching stage: TOWS matrix & SPACE matrix|||4.1 — Giai đoạn kết hợp: ma trận TOWS & ma trận SPACE',
  'Khung ba giai đoạn hình thành chiến lược của David (nhập liệu – kết hợp – quyết định); từ danh sách SWOT tới ma trận TOWS với bốn nhóm chiến lược SO, WO, ST, WT và ví dụ Cà phê Mộc Lan; ma trận vị trí chiến lược và đánh giá hành động (SPACE): bốn trục, thang điểm, cách tính vectơ hướng và bốn góc phần tư, ví dụ số (giả định).',
  [[
    `<span class="eyebrow">STM301 · Part 4 · Lesson 4.1</span>
<h2>The matching stage: TOWS matrix &amp; SPACE matrix</h2>
<p class="lead">Lists of factors do not choose a strategy. The matching stage pairs internal factors with external ones to generate a set of <em>feasible alternative strategies</em>.</p>
<h3>David's three-stage formulation framework</h3>
<table>
<tr><th>Stage</th><th>Purpose</th><th>Tools</th></tr>
<tr><td>1. Input stage</td><td>Summarize the information needed</td><td>EFE, IFE, CPM</td></tr>
<tr><td>2. Matching stage</td><td>Generate feasible alternative strategies</td><td>SWOT/TOWS, SPACE, BCG, IE, grand strategy matrix</td></tr>
<tr><td>3. Decision stage</td><td>Objectively rank the alternatives</td><td>QSPM</td></tr>
</table>
<h3>From SWOT to the TOWS matrix</h3>
<p>MGT103 used SWOT as four lists. The <strong>TOWS matrix</strong> goes one step further: it crosses the lists to produce four types of strategies.</p>
<table>
<tr><th></th><th>Strengths (S)</th><th>Weaknesses (W)</th></tr>
<tr><td><strong>Opportunities (O)</strong></td><td><strong>SO strategies</strong> — use internal strengths to take advantage of external opportunities</td><td><strong>WO strategies</strong> — improve internal weaknesses by taking advantage of external opportunities</td></tr>
<tr><td><strong>Threats (T)</strong></td><td><strong>ST strategies</strong> — use strengths to avoid or reduce the impact of external threats</td><td><strong>WT strategies</strong> — defensive tactics that reduce weaknesses and avoid threats</td></tr>
</table>
<p>Good practice: write each strategy in specific, actionable terms and put the factor codes behind it, for example "(S1, O2)", so that the logic can be traced and challenged. Not every pair produces a sensible strategy, and a strategy often draws on several factors.</p>
<pre><code class="language-text">TOWS — Moc Lan Coffee (fictional; codes from lessons 1.3 and 2.2)
SO  Open small takeaway kiosks in office districts, promoted through
    the app and delivery platforms (S1, S2, O2, O4)  → market penetration
WO  Set up a menu-innovation team that uses app data to launch seasonal
    products every quarter (W1, W4, O2, O3)          → product development
ST  Use the strong cash position to sign longer bean contracts with two
    more suppliers (S5, T3)                          → functional (procurement)
WT  Close or relocate the least profitable high-rent stores and tighten
    store cost control (W3, T2)                      → retrenchment</code></pre>
<h3>The SPACE matrix</h3>
<p>The Strategic Position and Action Evaluation (SPACE) matrix places a firm in one of four quadrants — aggressive, conservative, defensive or competitive — using two internal dimensions, <strong>financial position (FP)</strong> and <strong>competitive position (CP)</strong>, and two external dimensions, <strong>stability position (SP)</strong> and <strong>industry position (IP)</strong>. (Older editions call them financial strength, competitive advantage, environmental stability and industry strength.)</p>
<ol>
<li>Choose variables for each dimension — e.g. FP: return on investment, leverage, liquidity, cash flow; SP: rate of inflation, technological change, demand variability, price range of competing products, competitive pressure; CP: market share, product quality, customer loyalty, technological know-how, control over suppliers; IP: growth potential, profit potential, financial stability, ease of entry, resource utilization.</li>
<li>Rate FP and IP variables from <strong>+1 (worst) to +7 (best)</strong>; rate SP and CP variables from <strong>−1 (best) to −7 (worst)</strong>.</li>
<li>Average each dimension.</li>
<li>Compute the directional vector: <strong>x = CP + IP</strong>, <strong>y = FP + SP</strong>. The quadrant of (x, y) indicates the strategic posture.</li>
</ol>
<pre><code class="language-text">SPACE — Moc Lan Coffee (illustrative ratings)
FP: ROI +5, leverage +5, liquidity +4, cash flow +5          avg = 19/4 = +4.75
SP: tech change −2, inflation −3, demand variability −3,
    price range of rivals −5, competitive pressure −6       avg = −19/5 = −3.80
CP: market share −3, quality −2, loyalty −2,
    know-how −4, control over suppliers −5                  avg = −16/5 = −3.20
IP: growth potential +6, financial stability +4, ease of
    entry +3, resource utilization +5, profit potential +5  avg = 23/5 = +4.60
x = CP + IP = −3.20 + 4.60 = +1.40
y = FP + SP = +4.75 − 3.80 = +0.95   → upper right: AGGRESSIVE quadrant</code></pre>
<table>
<tr><th>Quadrant</th><th>Meaning</th><th>Strategies usually considered</th></tr>
<tr><td>Aggressive (x &gt; 0, y &gt; 0)</td><td>Strong finances in an attractive, fairly stable industry</td><td>Market penetration, market development, product development, integration, diversification</td></tr>
<tr><td>Conservative (x &lt; 0, y &gt; 0)</td><td>Financially sound but competitively weak: stay close to basic competencies</td><td>Market penetration, market development, product development, related diversification</td></tr>
<tr><td>Defensive (x &lt; 0, y &lt; 0)</td><td>Fix internal weaknesses and avoid threats</td><td>Retrenchment, divestiture, liquidation, related diversification</td></tr>
<tr><td>Competitive (x &gt; 0, y &lt; 0)</td><td>Competitive advantage in an attractive but unstable industry; finances are the constraint</td><td>Integration, market penetration, market development, product development</td></tr>
</table>
<div class="callout"><span class="badge">Watch the signs</span> SP and CP are rated on negative scales where −1 is <em>best</em>. A frequent error is to rate them as if −7 were good, which flips the vector into the wrong quadrant.</div>`,
    `<span class="eyebrow">STM301 · Phần 4 · Bài 4.1</span>
<h2>Giai đoạn kết hợp: ma trận TOWS &amp; ma trận SPACE</h2>
<p class="lead">Danh sách yếu tố không tự chọn ra chiến lược. Giai đoạn kết hợp ghép các yếu tố bên trong với các yếu tố bên ngoài để tạo ra một tập <em>chiến lược thay thế khả thi</em>.</p>
<h3>Khung ba giai đoạn hình thành chiến lược của David</h3>
<table>
<tr><th>Giai đoạn</th><th>Mục đích</th><th>Công cụ</th></tr>
<tr><td>1. Giai đoạn nhập liệu</td><td>Tóm tắt thông tin cần thiết</td><td>EFE, IFE, CPM</td></tr>
<tr><td>2. Giai đoạn kết hợp</td><td>Hình thành các chiến lược thay thế khả thi</td><td>SWOT/TOWS, SPACE, BCG, IE, ma trận chiến lược chính</td></tr>
<tr><td>3. Giai đoạn quyết định</td><td>Xếp hạng khách quan các phương án</td><td>QSPM</td></tr>
</table>
<h3>Từ SWOT tới ma trận TOWS</h3>
<p>MGT103 dùng SWOT như bốn danh sách. <strong>Ma trận TOWS</strong> tiến thêm một bước: ghép chéo các danh sách để tạo ra bốn nhóm chiến lược.</p>
<table>
<tr><th></th><th>Điểm mạnh (S)</th><th>Điểm yếu (W)</th></tr>
<tr><td><strong>Cơ hội (O)</strong></td><td><strong>Chiến lược SO</strong> — dùng điểm mạnh bên trong để tận dụng cơ hội bên ngoài</td><td><strong>Chiến lược WO</strong> — khắc phục điểm yếu bên trong bằng cách tận dụng cơ hội bên ngoài</td></tr>
<tr><td><strong>Nguy cơ (T)</strong></td><td><strong>Chiến lược ST</strong> — dùng điểm mạnh để né tránh hoặc giảm tác động của nguy cơ bên ngoài</td><td><strong>Chiến lược WT</strong> — chiến thuật phòng thủ nhằm giảm điểm yếu và né tránh nguy cơ</td></tr>
</table>
<p>Thực hành tốt: viết mỗi chiến lược một cách cụ thể, hành động được, và ghi mã yếu tố phía sau, ví dụ "(S1, O2)", để có thể lần theo và phản biện logic. Không phải cặp nào cũng tạo ra chiến lược hợp lý, và một chiến lược thường dựa trên nhiều yếu tố.</p>
<pre><code class="language-text">TOWS — Cà phê Mộc Lan (giả định; mã từ bài 1.3 và 2.2)
SO  Mở ki-ốt bán mang đi nhỏ ở các khu văn phòng, quảng bá qua ứng dụng
    và nền tảng giao hàng (S1, S2, O2, O4)             → thâm nhập thị trường
WO  Lập nhóm đổi mới thực đơn, dùng dữ liệu ứng dụng để ra sản phẩm
    theo mùa mỗi quý (W1, W4, O2, O3)                  → phát triển sản phẩm
ST  Dùng lượng tiền mặt dồi dào để ký hợp đồng hạt dài hạn với thêm
    hai nhà cung cấp (S5, T3)                          → cấp chức năng (thu mua)
WT  Đóng hoặc dời các cửa hàng giá thuê cao, lãi thấp nhất và siết
    kiểm soát chi phí cửa hàng (W3, T2)                → thu hẹp</code></pre>
<h3>Ma trận SPACE</h3>
<p>Ma trận vị trí chiến lược và đánh giá hành động (SPACE) xếp doanh nghiệp vào một trong bốn góc phần tư — tấn công, thận trọng, phòng thủ hoặc cạnh tranh — dựa trên hai chiều bên trong là <strong>vị thế tài chính (FP)</strong> và <strong>vị thế cạnh tranh (CP)</strong>, và hai chiều bên ngoài là <strong>vị thế ổn định (SP)</strong> và <strong>vị thế ngành (IP)</strong>. (Các ấn bản cũ gọi là sức mạnh tài chính, lợi thế cạnh tranh, sự ổn định của môi trường và sức mạnh của ngành.)</p>
<ol>
<li>Chọn biến cho mỗi chiều — ví dụ FP: tỷ suất lợi nhuận trên vốn đầu tư, đòn bẩy, thanh khoản, dòng tiền; SP: tỷ lệ lạm phát, thay đổi công nghệ, biến động của cầu, biên độ giá của sản phẩm cạnh tranh, áp lực cạnh tranh; CP: thị phần, chất lượng sản phẩm, lòng trung thành của khách hàng, bí quyết công nghệ, khả năng kiểm soát nhà cung cấp; IP: tiềm năng tăng trưởng, tiềm năng lợi nhuận, sự ổn định tài chính, mức dễ gia nhập, hiệu quả sử dụng nguồn lực.</li>
<li>Chấm biến FP và IP từ <strong>+1 (tệ nhất) tới +7 (tốt nhất)</strong>; chấm biến SP và CP từ <strong>−1 (tốt nhất) tới −7 (tệ nhất)</strong>.</li>
<li>Tính điểm trung bình của từng chiều.</li>
<li>Tính vectơ hướng: <strong>x = CP + IP</strong>, <strong>y = FP + SP</strong>. Góc phần tư chứa điểm (x, y) cho biết tư thế chiến lược.</li>
</ol>
<pre><code class="language-text">SPACE — Cà phê Mộc Lan (điểm minh hoạ)
FP: ROI +5, đòn bẩy +5, thanh khoản +4, dòng tiền +5            TB = 19/4 = +4,75
SP: thay đổi công nghệ −2, lạm phát −3, biến động cầu −3,
    biên độ giá đối thủ −5, áp lực cạnh tranh −6               TB = −19/5 = −3,80
CP: thị phần −3, chất lượng −2, lòng trung thành −2,
    bí quyết −4, kiểm soát nhà cung cấp −5                     TB = −16/5 = −3,20
IP: tiềm năng tăng trưởng +6, ổn định tài chính +4, mức dễ
    gia nhập +3, hiệu quả nguồn lực +5, tiềm năng lợi nhuận +5 TB = 23/5 = +4,60
x = CP + IP = −3,20 + 4,60 = +1,40
y = FP + SP = +4,75 − 3,80 = +0,95   → phía trên bên phải: góc TẤN CÔNG</code></pre>
<table>
<tr><th>Góc phần tư</th><th>Ý nghĩa</th><th>Chiến lược thường cân nhắc</th></tr>
<tr><td>Tấn công (x &gt; 0, y &gt; 0)</td><td>Tài chính mạnh trong một ngành hấp dẫn, tương đối ổn định</td><td>Thâm nhập thị trường, phát triển thị trường, phát triển sản phẩm, hội nhập, đa dạng hoá</td></tr>
<tr><td>Thận trọng (x &lt; 0, y &gt; 0)</td><td>Tài chính lành mạnh nhưng yếu về cạnh tranh: bám sát năng lực cơ bản</td><td>Thâm nhập thị trường, phát triển thị trường, phát triển sản phẩm, đa dạng hoá có liên quan</td></tr>
<tr><td>Phòng thủ (x &lt; 0, y &lt; 0)</td><td>Khắc phục điểm yếu bên trong và né tránh nguy cơ</td><td>Thu hẹp, cắt bỏ, thanh lý, đa dạng hoá có liên quan</td></tr>
<tr><td>Cạnh tranh (x &gt; 0, y &lt; 0)</td><td>Có lợi thế cạnh tranh trong một ngành hấp dẫn nhưng bất ổn; tài chính là điểm nghẽn</td><td>Hội nhập, thâm nhập thị trường, phát triển thị trường, phát triển sản phẩm</td></tr>
</table>
<div class="callout"><span class="badge">Chú ý dấu</span> SP và CP được chấm trên thang âm, trong đó −1 là <em>tốt nhất</em>. Lỗi hay gặp là chấm như thể −7 là tốt, khiến vectơ lật sang sai góc phần tư.</div>`,
  ]]);

const c10 = doc('stm301-4-2-bcg-ie-grand', '4.2 — Portfolio tools: BCG matrix, IE matrix & grand strategy matrix|||4.2 — Công cụ danh mục: ma trận BCG, ma trận IE & ma trận chiến lược chính',
  'Ma trận BCG theo cách trình bày của David (thị phần tương đối, mốc 0,50 và 0% so với mốc 1,0 và 10% của BCG gốc) có ví dụ số bốn đơn vị kinh doanh; ma trận bên trong – bên ngoài (IE) chín ô và ba nhóm chiến lược, định vị Mộc Lan và GreenBike; ma trận chiến lược chính bốn góc phần tư; khi các công cụ cho tín hiệu khác nhau.',
  [[
    `<span class="eyebrow">STM301 · Part 4 · Lesson 4.2</span>
<h2>Portfolio tools: BCG, IE &amp; grand strategy matrices</h2>
<h3>The BCG matrix, more precisely</h3>
<p>For a firm with several divisions, the Boston Consulting Group matrix plots each division by <strong>relative market share position</strong> (x-axis) — the division's own share divided by the share of the <em>largest rival</em> in that industry — and <strong>industry growth rate</strong> (y-axis). Circle size shows the division's share of corporate revenue. The cut-offs are conventions: the original BCG chart used a relative share of 1.0 and roughly 10% growth; David's version sets the midpoints at <strong>0.50</strong> and <strong>0%</strong> (growth axis from −20% to +20%). Always state which one you use.</p>
<pre><code class="language-text">Kappa Group (fictional), David's cut-offs 0.50 and 0%
Division          Revenue  Own share  Largest rival  Relative share  Growth  Revenue %  Quadrant
A Coffee chain       600      18%          12%       18/12 = 1.50     +8%     46.2%     Star
B Packaged coffee    300      10%          25%       10/25 = 0.40     −2%     23.1%     Dog
C Bakery             250      15%          20%       15/20 = 0.75     −3%     19.2%     Cash cow
D Juice bars         150       4%          16%        4/16 = 0.25    +12%     11.5%     Question mark
Total              1,300                                                     100.0%</code></pre>
<table>
<tr><th>Quadrant</th><th>Strategies usually considered (David)</th></tr>
<tr><td>Question marks (low share, high growth)</td><td>Intensive strategies — market penetration, market development, product development — or divestiture</td></tr>
<tr><td>Stars (high share, high growth)</td><td>Integration (forward, backward, horizontal), market penetration, market development, product development</td></tr>
<tr><td>Cash cows (high share, low growth)</td><td>Product development or related diversification to keep them strong; retrenchment or divestiture if they weaken</td></tr>
<tr><td>Dogs (low share, low growth)</td><td>Retrenchment, divestiture or liquidation</td></tr>
</table>
<p>With the classic cut-offs (1.0 and 10%), division A would be a cash cow and C a dog — the same data, a different story. The BCG matrix also ignores factors other than share and growth, so it is a starting point, not a verdict.</p>
<h3>The internal–external (IE) matrix</h3>
<p>The IE matrix places a firm or division by its <strong>IFE total</strong> on the x-axis (3.0–4.0 strong, 2.0–2.99 average, 1.0–1.99 weak, read from left to right) and its <strong>EFE total</strong> on the y-axis (3.0–4.0 high, 2.0–2.99 medium, 1.0–1.99 low, from top to bottom).</p>
<pre><code class="language-text">                       IFE total
                 Strong      Average     Weak
                 3.0–4.0     2.0–2.99    1.0–1.99
EFE  High 3.0–4.0    I          II          III
     Medium 2.0–2.99 IV         V           VI
     Low 1.0–1.99    VII        VIII        IX

Grow and build ........ cells I, II, IV    (intensive or integrative strategies)
Hold and maintain ..... cells III, V, VII  (market penetration, product development)
Harvest or divest ..... cells VI, VIII, IX

Moc Lan:   IFE 2.53, EFE 2.51 → cell V → hold and maintain
GreenBike: IFE 2.34, EFE 2.40 → cell V → hold and maintain</code></pre>
<h3>The grand strategy matrix</h3>
<table>
<tr><th>Quadrant</th><th>Situation</th><th>Strategies usually considered</th></tr>
<tr><td>I</td><td>Rapid market growth, strong competitive position</td><td>Market development, market penetration, product development, integration, related diversification</td></tr>
<tr><td>II</td><td>Rapid market growth, weak competitive position</td><td>Intensive strategies first; horizontal integration; divestiture or liquidation if no advantage can be built</td></tr>
<tr><td>III</td><td>Slow market growth, weak competitive position</td><td>Retrenchment, diversification, divestiture, liquidation</td></tr>
<tr><td>IV</td><td>Slow market growth, strong competitive position</td><td>Diversification (related or unrelated), joint ventures</td></tr>
</table>
<h3>When the tools disagree</h3>
<p>For Moc Lan, SPACE points to an <em>aggressive</em> posture, while the IE matrix says <em>hold and maintain</em>. That is not a contradiction to hide: the two tools draw on different inputs. SPACE uses its own variables — here Moc Lan's financial position (+4.75) and industry position (+4.60) score high — while the IE matrix uses the EFE and IFE totals, both close to the 2.5 average. Matching tools generate options; they do not decide. Moc Lan therefore carries two alternatives to the decision stage — <strong>market development</strong> (supported by SPACE) and <strong>product development</strong> (supported by IE; the TOWS matrix proposed it as seasonal menu innovation, while the QSPM tests another form of it, a bottled ready-to-drink line) — and ranks them with the QSPM in lesson 5.1.</p>
<div class="callout"><span class="badge">Remember</span> Every matching tool is only as good as its inputs. If the EFE and IFE were rushed, the IE cell is meaningless; if the market is defined badly, so is the BCG position.</div>`,
    `<span class="eyebrow">STM301 · Phần 4 · Bài 4.2</span>
<h2>Công cụ danh mục: ma trận BCG, IE &amp; ma trận chiến lược chính</h2>
<h3>Ma trận BCG, nói cho chính xác</h3>
<p>Với doanh nghiệp có nhiều đơn vị kinh doanh, ma trận của Boston Consulting Group đặt mỗi đơn vị theo <strong>thị phần tương đối</strong> (trục hoành) — thị phần của chính đơn vị chia cho thị phần của <em>đối thủ lớn nhất</em> trong ngành đó — và <strong>tốc độ tăng trưởng của ngành</strong> (trục tung). Kích thước vòng tròn thể hiện tỷ trọng doanh thu của đơn vị trong toàn công ty. Các mốc chia là quy ước: biểu đồ BCG gốc dùng thị phần tương đối 1,0 và tăng trưởng khoảng 10%; cách trình bày của David đặt điểm giữa ở <strong>0,50</strong> và <strong>0%</strong> (trục tăng trưởng từ −20% tới +20%). Luôn nói rõ mình dùng mốc nào.</p>
<pre><code class="language-text">Tập đoàn Kappa (giả định), mốc của David 0,50 và 0%
Đơn vị               Doanh thu  Thị phần  Đối thủ lớn nhất  Thị phần tương đối  Tăng trưởng  % doanh thu  Ô
A Chuỗi cà phê          600       18%          12%          18/12 = 1,50         +8%        46,2%     Ngôi sao
B Cà phê đóng gói       300       10%          25%          10/25 = 0,40         −2%        23,1%     Con chó
C Tiệm bánh             250       15%          20%          15/20 = 0,75         −3%        19,2%     Bò sữa
D Quầy nước ép          150        4%          16%           4/16 = 0,25        +12%        11,5%     Dấu hỏi
Tổng                  1.300                                                                100,0%</code></pre>
<table>
<tr><th>Ô</th><th>Chiến lược thường cân nhắc (David)</th></tr>
<tr><td>Dấu hỏi (thị phần thấp, tăng trưởng cao)</td><td>Chiến lược chuyên sâu — thâm nhập thị trường, phát triển thị trường, phát triển sản phẩm — hoặc cắt bỏ</td></tr>
<tr><td>Ngôi sao (thị phần cao, tăng trưởng cao)</td><td>Hội nhập (về phía trước, về phía sau, ngang), thâm nhập thị trường, phát triển thị trường, phát triển sản phẩm</td></tr>
<tr><td>Bò sữa (thị phần cao, tăng trưởng thấp)</td><td>Phát triển sản phẩm hoặc đa dạng hoá có liên quan để giữ sức mạnh; thu hẹp hoặc cắt bỏ nếu suy yếu</td></tr>
<tr><td>Con chó (thị phần thấp, tăng trưởng thấp)</td><td>Thu hẹp, cắt bỏ hoặc thanh lý</td></tr>
</table>
<p>Với mốc cổ điển (1,0 và 10%), đơn vị A sẽ là bò sữa và C là con chó — cùng dữ liệu, một câu chuyện khác. Ma trận BCG cũng bỏ qua mọi yếu tố ngoài thị phần và tăng trưởng, nên nó là điểm khởi đầu, không phải phán quyết.</p>
<h3>Ma trận bên trong – bên ngoài (IE)</h3>
<p>Ma trận IE đặt doanh nghiệp hoặc đơn vị theo <strong>tổng điểm IFE</strong> trên trục hoành (3,0–4,0 mạnh, 2,0–2,99 trung bình, 1,0–1,99 yếu, đọc từ trái sang phải) và <strong>tổng điểm EFE</strong> trên trục tung (3,0–4,0 cao, 2,0–2,99 trung bình, 1,0–1,99 thấp, từ trên xuống dưới).</p>
<pre><code class="language-text">                         Tổng IFE
                     Mạnh        Trung bình   Yếu
                     3,0–4,0     2,0–2,99     1,0–1,99
EFE  Cao 3,0–4,0        I           II           III
     TB  2,0–2,99       IV          V            VI
     Thấp 1,0–1,99      VII         VIII         IX

Phát triển và xây dựng .. ô I, II, IV    (chiến lược chuyên sâu hoặc hội nhập)
Giữ vững và duy trì ..... ô III, V, VII  (thâm nhập thị trường, phát triển sản phẩm)
Thu hoạch hoặc rút lui .. ô VI, VIII, IX

Mộc Lan:   IFE 2,53, EFE 2,51 → ô V → giữ vững và duy trì
GreenBike: IFE 2,34, EFE 2,40 → ô V → giữ vững và duy trì</code></pre>
<h3>Ma trận chiến lược chính</h3>
<table>
<tr><th>Góc phần tư</th><th>Tình huống</th><th>Chiến lược thường cân nhắc</th></tr>
<tr><td>I</td><td>Thị trường tăng trưởng nhanh, vị thế cạnh tranh mạnh</td><td>Phát triển thị trường, thâm nhập thị trường, phát triển sản phẩm, hội nhập, đa dạng hoá có liên quan</td></tr>
<tr><td>II</td><td>Thị trường tăng trưởng nhanh, vị thế cạnh tranh yếu</td><td>Ưu tiên chiến lược chuyên sâu; hội nhập ngang; cắt bỏ hoặc thanh lý nếu không xây dựng được lợi thế</td></tr>
<tr><td>III</td><td>Thị trường tăng trưởng chậm, vị thế cạnh tranh yếu</td><td>Thu hẹp, đa dạng hoá, cắt bỏ, thanh lý</td></tr>
<tr><td>IV</td><td>Thị trường tăng trưởng chậm, vị thế cạnh tranh mạnh</td><td>Đa dạng hoá (có liên quan hoặc không liên quan), liên doanh</td></tr>
</table>
<h3>Khi các công cụ không thống nhất</h3>
<p>Với Mộc Lan, SPACE chỉ ra tư thế <em>tấn công</em>, còn ma trận IE nói <em>giữ vững và duy trì</em>. Đó không phải mâu thuẫn cần che giấu: hai công cụ dùng đầu vào khác nhau. SPACE dùng bộ biến riêng — ở đây vị thế tài chính (+4,75) và vị thế ngành (+4,60) của Mộc Lan được chấm cao — còn ma trận IE dùng tổng điểm EFE và IFE, cả hai đều sát mức trung bình 2,5. Công cụ kết hợp tạo ra phương án; chúng không ra quyết định. Vì vậy Mộc Lan đưa hai phương án vào giai đoạn quyết định — <strong>phát triển thị trường</strong> (được SPACE ủng hộ) và <strong>phát triển sản phẩm</strong> (được IE ủng hộ; ma trận TOWS đề xuất nó dưới dạng đổi mới thực đơn theo mùa, còn QSPM xét một hình thức khác của nó là dòng cà phê đóng chai uống liền) — rồi xếp hạng chúng bằng QSPM ở bài 5.1.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Công cụ kết hợp nào cũng chỉ tốt bằng dữ liệu đầu vào của nó. Nếu EFE và IFE được làm qua loa thì ô IE vô nghĩa; nếu thị trường được xác định sai thì vị trí trên BCG cũng vậy.</div>`,
  ]]);

const c10e = doc('stm301-4-3-exercise', 'Exercise 2 — from SWOT to a TOWS matrix for GreenBike|||Bài tập 2 — từ SWOT tới ma trận TOWS của GreenBike',
  'Bài tập: từ danh sách SWOT của GreenBike (giả định, lấy từ Bài tập 1) dựng ma trận TOWS với đủ bốn nhóm chiến lược SO, WO, ST, WT, ghi mã yếu tố làm căn cứ, gọi tên loại chiến lược và chọn hai phương án loại trừ nhau đưa sang QSPM; kèm lời giải.',
  [[
    `<span class="eyebrow">STM301 · Part 4 · Exercise</span>
<h2>Exercise 2 — turning GreenBike's SWOT into strategies</h2>
<div class="callout"><span class="badge">Problem</span> Use GreenBike's factors from Exercise 1 (fictional case). Strengths: S1 in-house battery-pack design, clean safety record · S2 120 dealers in the north · S3 competitive mid-range prices · S4 capable R&amp;D team. Weaknesses: W1 weak brand in the south · W2 slow after-sales service · W3 dependence on imported battery cells of uncontrolled quality · W4 limited financial resources. Opportunities: O1 incentives for low-emission vehicles · O2 higher fuel prices · O3 young people want affordable mobility · O4 growth of online sales. Threats: T1 cheap imported e-bikes · T2 large motorbike makers entering · T3 public concern about battery fires · T4 volatile cell prices. (a) Build a TOWS matrix with at least one specific strategy in each of the four cells, citing factor codes. (b) Name the type of each strategy (Part 3). (c) Management can fund only one major move this year because of W4. Choose two mutually exclusive alternatives to rank in Exercise 3.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a)(b) TOWS matrix — GreenBike

SO  Launch a lower-priced student model built on the in-house
    battery design, sold through northern dealers and campus
    pop-up stores (S1, S2, S3, O3)                → product development
    Campaign on the safety record, linked to low-emission
    incentives and fuel savings (S1, O1, O2)      → market penetration

WO  Enter the south through online sales plus a few partner dealers,
    riding on demand for affordable mobility (W1, O3, O4)
                                                  → market development
    Online booking for maintenance to shorten waiting time (W2, O4)
                                                  → functional (service)

ST  Differentiate from cheap imports and new entrants with
    independent battery-safety certification and a longer battery
    warranty (S1, S4, T1, T2, T3)                 → differentiation

WT  Form a joint venture with a battery-cell supplier to secure
    cells of controlled quality at stable prices, sharing the
    investment (W3, W4, T3, T4)
                                                  → backward integration via JV

(c) Alternatives for the QSPM:
    A = market development into the south (WO)
    B = backward integration through a battery-cell JV (WT)</code></pre>
<p><strong>Why:</strong> the TOWS matrix is a generator, not a selector — it forces every idea to answer a specific factor, and the codes make weak logic visible. Several strategies are compatible (the safety campaign can run alongside either A or B), but A and B compete for the same scarce capital (W4), so they are true alternatives. Note that the IE matrix put GreenBike in cell V (hold and maintain), which favours penetration and product development; carrying A and B forward anyway is legitimate because they address the heaviest gaps found in Exercise 1 — but the QSPM must now justify the choice.</p>`,
    `<span class="eyebrow">STM301 · Phần 4 · Bài tập</span>
<h2>Bài tập 2 — biến SWOT của GreenBike thành chiến lược</h2>
<div class="callout"><span class="badge">Đề</span> Dùng các yếu tố của GreenBike từ Bài tập 1 (tình huống giả định). Điểm mạnh: S1 tự thiết kế bộ pin, hồ sơ an toàn tốt · S2 120 đại lý ở miền Bắc · S3 giá tầm trung cạnh tranh · S4 đội R&amp;D có năng lực. Điểm yếu: W1 thương hiệu yếu ở miền Nam · W2 dịch vụ sau bán chậm · W3 phụ thuộc cell pin nhập khẩu chưa kiểm soát được chất lượng · W4 nguồn lực tài chính hạn chế. Cơ hội: O1 khuyến khích phương tiện phát thải thấp · O2 giá nhiên liệu tăng · O3 người trẻ cần phương tiện giá phải chăng · O4 bán hàng trực tuyến tăng trưởng. Nguy cơ: T1 xe đạp điện nhập khẩu giá rẻ · T2 các hãng xe máy lớn gia nhập · T3 dư luận lo ngại cháy pin · T4 giá cell pin biến động. (a) Dựng ma trận TOWS với ít nhất một chiến lược cụ thể ở mỗi ô trong bốn ô, ghi mã yếu tố làm căn cứ. (b) Gọi tên loại của từng chiến lược (Phần 3). (c) Vì W4, năm nay ban lãnh đạo chỉ cấp vốn được cho một động thái lớn. Chọn hai phương án loại trừ nhau để xếp hạng ở Bài tập 3.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a)(b) Ma trận TOWS — GreenBike

SO  Ra mẫu xe giá thấp hơn cho sinh viên dựa trên thiết kế pin tự
    phát triển, bán qua đại lý miền Bắc và điểm bán lưu động
    ở các trường đại học (S1, S2, S3, O3)         → phát triển sản phẩm
    Chiến dịch truyền thông về hồ sơ an toàn, gắn với khuyến khích
    phát thải thấp và tiết kiệm nhiên liệu (S1, O1, O2) → thâm nhập thị trường

WO  Vào miền Nam qua bán hàng trực tuyến và một số đại lý đối tác,
    tận dụng nhu cầu phương tiện giá phải chăng (W1, O3, O4)
                                                  → phát triển thị trường
    Đặt lịch bảo dưỡng trực tuyến để rút ngắn thời gian chờ (W2, O4)
                                                  → cấp chức năng (dịch vụ)

ST  Khác biệt hoá so với xe nhập giá rẻ và đối thủ mới bằng chứng nhận
    an toàn pin độc lập và bảo hành pin dài hơn (S1, S4, T1, T2, T3)
                                                  → khác biệt hoá

WT  Lập liên doanh với một nhà cung cấp cell pin để đảm bảo nguồn cell
    kiểm soát được chất lượng, giá ổn định, cùng chia sẻ vốn đầu tư
    (W3, W4, T3, T4)
                                                  → hội nhập về phía sau qua liên doanh

(c) Phương án đưa vào QSPM:
    A = phát triển thị trường vào miền Nam (WO)
    B = hội nhập về phía sau qua liên doanh cell pin (WT)</code></pre>
<p><strong>Vì sao:</strong> ma trận TOWS là công cụ tạo phương án, không phải công cụ chọn — nó buộc mỗi ý tưởng phải đáp lại một yếu tố cụ thể, và mã yếu tố làm lộ ra những lập luận yếu. Một số chiến lược có thể đi cùng nhau (chiến dịch an toàn chạy song song được với A hoặc B), nhưng A và B cạnh tranh cùng một nguồn vốn khan hiếm (W4), nên chúng là hai phương án loại trừ thật sự. Lưu ý ma trận IE xếp GreenBike vào ô V (giữ vững và duy trì), vốn ưu tiên thâm nhập và phát triển sản phẩm; vẫn đưa A và B đi tiếp là hợp lý vì chúng xử lý những khoảng trống nặng nhất tìm ra ở Bài tập 1 — nhưng giờ QSPM phải chứng minh cho lựa chọn đó.</p>`,
  ]]);

const q4 = quiz('stm301-quiz-4', 'Quiz 4 — Matching tools|||Quiz 4 — Công cụ kết hợp', [
  { id: 'q1', question: 'In a TOWS matrix, a strategy that uses internal strengths to reduce the impact of external threats is…|||Trong ma trận TOWS, chiến lược dùng điểm mạnh bên trong để giảm tác động của nguy cơ bên ngoài là…', options: ['an SO strategy|||chiến lược SO', 'a WO strategy|||chiến lược WO', 'an ST strategy|||chiến lược ST', 'a WT strategy|||chiến lược WT'], correctIndex: 2, explanation: 'ST pairs strengths (S) with threats (T); WT strategies are defensive moves from a position of weakness.|||ST ghép điểm mạnh (S) với nguy cơ (T); chiến lược WT là động thái phòng thủ khi đang ở thế yếu.' },
  { id: 'q2', question: 'A division has an IFE total of 3.20 and an EFE total of 2.40. In the IE matrix it falls in…|||Một đơn vị có tổng điểm IFE 3,20 và tổng điểm EFE 2,40. Trên ma trận IE, đơn vị này nằm ở…', options: ['cell II — grow and build|||ô II — phát triển và xây dựng', 'cell IV — grow and build|||ô IV — phát triển và xây dựng', 'cell V — hold and maintain|||ô V — giữ vững và duy trì', 'cell VII — hold and maintain|||ô VII — giữ vững và duy trì'], correctIndex: 1, explanation: 'IFE 3.20 is strong (first column) and EFE 2.40 is medium (second row): cell IV, a grow-and-build cell.|||IFE 3,20 là mạnh (cột thứ nhất) và EFE 2,40 là trung bình (hàng thứ hai): ô IV, thuộc nhóm phát triển và xây dựng.' },
  { id: 'q3', question: 'A SPACE analysis gives FP = +2.0, SP = −4.5, CP = −1.5 and IP = +5.0. The directional vector lies in which quadrant?|||Phân tích SPACE cho FP = +2,0, SP = −4,5, CP = −1,5 và IP = +5,0. Vectơ hướng nằm ở góc phần tư nào?', options: ['Aggressive|||Tấn công', 'Conservative|||Thận trọng', 'Defensive|||Phòng thủ', 'Competitive|||Cạnh tranh'], correctIndex: 3, explanation: 'x = CP + IP = −1.5 + 5.0 = +3.5 and y = FP + SP = 2.0 − 4.5 = −2.5: lower right, the competitive quadrant.|||x = CP + IP = −1,5 + 5,0 = +3,5 và y = FP + SP = 2,0 − 4,5 = −2,5: phía dưới bên phải, góc cạnh tranh.' },
]);

const c11 = doc('stm301-5-1-qspm', '5.1 — The decision stage: the quantitative strategic planning matrix (QSPM)|||5.1 — Giai đoạn quyết định: ma trận hoạch định chiến lược định lượng (QSPM)',
  'Sáu bước lập QSPM: lấy yếu tố và trọng số từ EFE/IFE, chọn các phương án loại trừ nhau, chấm điểm hấp dẫn 1–4 hoặc để trống khi yếu tố không ảnh hưởng tới lựa chọn, tính điểm hấp dẫn TAS và tổng STAS; ví dụ Cà phê Mộc Lan so phát triển thị trường với phát triển sản phẩm; ưu điểm, hạn chế và yếu tố chính trị trong lựa chọn chiến lược.',
  [[
    `<span class="eyebrow">STM301 · Part 5 · Lesson 5.1</span>
<h2>The decision stage: the QSPM</h2>
<p class="lead">The Quantitative Strategic Planning Matrix (QSPM) is the only tool in David's framework designed to decide. It objectively ranks alternative strategies identified in the matching stage, using the key factors and weights from the input stage.</p>
<h3>Six steps</h3>
<ol>
<li>List the key external and internal factors in the left column — taken directly from the EFE and IFE matrices.</li>
<li>Give each factor the same <strong>weight</strong> it had in the EFE or IFE. The external weights sum to 1.00 and the internal weights sum to 1.00, so a complete QSPM has weights totalling 2.00.</li>
<li>Write the alternative strategies from the matching stage across the top. Strategies compared in one set should be <strong>mutually exclusive</strong> alternatives.</li>
<li>Determine the <strong>attractiveness scores (AS)</strong>. For each factor ask: <em>does this factor affect the choice between these strategies?</em> If yes, score each strategy: 1 = not attractive, 2 = somewhat attractive, 3 = reasonably attractive, 4 = highly attractive. If no — for example, the factor would score the same for every strategy — put a dash in the whole row.</li>
<li>Compute the <strong>total attractiveness score (TAS)</strong> = weight × AS for each cell.</li>
<li>Add the TAS in each column to get the <strong>sum total attractiveness score (STAS)</strong>. The higher STAS indicates the more attractive strategy; the size of the gap shows how clear the preference is.</li>
</ol>
<h3>Worked example — Moc Lan Coffee (fictional, illustrative scores)</h3>
<p>Alternatives from lesson 4.2: <strong>A = market development</strong> (open stores in two new cities) and <strong>B = product development</strong> (bottled ready-to-drink coffee for supermarkets). A ready-to-drink line sold in supermarkets reaches a new channel and new competitors, so it sits on the border with related diversification; it is treated here as product development because it extends the existing brand and roastery (see lesson 3.2). A full QSPM lists all 20 factors from lessons 1.3 and 2.2; to save space only ten rows are shown, so the sums are partial.</p>
<pre><code class="language-text">Key factor                               Weight |  A: new cities  |  B: RTD coffee
                                                |   AS    TAS     |   AS    TAS
O1 Rising urban coffee spending            0.12 |   4     0.48    |   3     0.36
O2 Growth of delivery apps                 0.10 |   3     0.30    |   2     0.20
T1 Intense rivalry from chains             0.15 |   2     0.30    |   3     0.45
T2 Rising city-centre rents                0.12 |   1     0.12    |   4     0.48
S1 Strong brand recognition                0.15 |   3     0.45    |   4     0.60
S2 Loyal membership base                   0.10 |   —      —      |   —      —
S3 Efficient central roastery              0.10 |   2     0.20    |   4     0.40
W1 Slow new-product development            0.12 |   3     0.36    |   1     0.12
W2 Stores concentrated in two cities       0.12 |   4     0.48    |   2     0.24
W3 Weak store-level cost control           0.10 |   1     0.10    |   3     0.30
STAS (rows shown)                                |        2.79     |        3.15</code></pre>
<p><strong>Reading it:</strong> on the rows shown B leads by 3.15 − 2.79 = 0.36. New stores (A) score well where the question is reach — rising spending and the concentrated network — but badly on rents and on the weak store cost control that more stores would multiply. The bottled line (B) uses the brand and the roastery without new leases, but it runs straight into Moc Lan's slow new-product development (W1), which is why that row must never be left out of a product-development QSPM. The membership base (S2) helps both options equally, so it does not affect the choice and gets a dash. The decision is still provisional: ten of the twenty factors — including O5 (export of packaged coffee), T5 (food-safety inspections) and S5 (cash position) — have not been scored, and a lead of 0.36 can shrink or reverse once they are. On the rows shown, the result points the same way as the IE matrix's "hold and maintain" signal.</p>
<h3>Strengths and limits of the QSPM</h3>
<ul>
<li><strong>Strengths:</strong> any number of strategies can be compared; it forces the team to consider every relevant factor at once and to write down the reasoning behind each score.</li>
<li><strong>Limits:</strong> attractiveness scores are judgments, and the result is only as good as the EFE and IFE behind it; it compares strategies only within the set considered.</li>
<li><strong>Politics and culture:</strong> in practice, strategy choice is also shaped by coalitions, the preferences of top managers and the fit with culture. A transparent QSPM does not remove politics, but it makes the arguments visible and harder to override without reasons.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> If you find yourself giving both strategies the same AS in a row, stop: either the factor truly does not affect the choice (use a dash), or you have not yet thought through how each strategy interacts with it.</div>`,
    `<span class="eyebrow">STM301 · Phần 5 · Bài 5.1</span>
<h2>Giai đoạn quyết định: QSPM</h2>
<p class="lead">Ma trận hoạch định chiến lược định lượng (QSPM) là công cụ duy nhất trong khung của David được thiết kế để ra quyết định. Nó xếp hạng khách quan các chiến lược thay thế đã xác định ở giai đoạn kết hợp, dựa trên các yếu tố then chốt và trọng số từ giai đoạn nhập liệu.</p>
<h3>Sáu bước</h3>
<ol>
<li>Liệt kê các yếu tố then chốt bên ngoài và bên trong ở cột bên trái — lấy trực tiếp từ ma trận EFE và IFE.</li>
<li>Gán cho mỗi yếu tố đúng <strong>trọng số</strong> nó đã có trong EFE hoặc IFE. Trọng số bên ngoài cộng bằng 1,00 và trọng số bên trong cộng bằng 1,00, nên một QSPM đầy đủ có tổng trọng số 2,00.</li>
<li>Ghi các chiến lược thay thế từ giai đoạn kết hợp ở hàng trên cùng. Các chiến lược so sánh trong cùng một nhóm phải là các phương án <strong>loại trừ nhau</strong>.</li>
<li>Xác định <strong>điểm hấp dẫn (AS)</strong>. Với mỗi yếu tố, hỏi: <em>yếu tố này có ảnh hưởng tới việc lựa chọn giữa các chiến lược không?</em> Nếu có, chấm điểm từng chiến lược: 1 = không hấp dẫn, 2 = hơi hấp dẫn, 3 = khá hấp dẫn, 4 = rất hấp dẫn. Nếu không — ví dụ yếu tố sẽ được chấm như nhau cho mọi chiến lược — ghi dấu gạch cho cả hàng.</li>
<li>Tính <strong>tổng điểm hấp dẫn (TAS)</strong> = trọng số × AS cho mỗi ô.</li>
<li>Cộng TAS của mỗi cột để có <strong>tổng cộng điểm hấp dẫn (STAS)</strong>. STAS cao hơn cho biết chiến lược hấp dẫn hơn; độ lớn của khoảng cách cho biết mức ưu tiên rõ ràng tới đâu.</li>
</ol>
<h3>Ví dụ — Cà phê Mộc Lan (giả định, điểm minh hoạ)</h3>
<p>Hai phương án từ bài 4.2: <strong>A = phát triển thị trường</strong> (mở cửa hàng ở hai thành phố mới) và <strong>B = phát triển sản phẩm</strong> (cà phê đóng chai uống liền bán ở siêu thị). Dòng cà phê uống liền bán ở siêu thị đi vào một kênh mới và gặp đối thủ mới, nên nằm ở ranh giới với đa dạng hoá có liên quan; ở đây nó được xếp vào phát triển sản phẩm vì mở rộng từ thương hiệu và xưởng rang sẵn có (xem bài 3.2). QSPM đầy đủ liệt kê cả 20 yếu tố từ bài 1.3 và 2.2; để tiết kiệm chỗ chỉ trình bày mười hàng, nên các tổng là tổng từng phần.</p>
<pre><code class="language-text">Yếu tố then chốt                          Trọng số |  A: TP mới      |  B: cà phê chai
                                                   |   AS    TAS     |   AS    TAS
O1 Chi tiêu cà phê ở đô thị tăng             0,12  |   4     0,48    |   3     0,36
O2 Ứng dụng giao hàng tăng trưởng            0,10  |   3     0,30    |   2     0,20
T1 Cạnh tranh gay gắt từ các chuỗi           0,15  |   2     0,30    |   3     0,45
T2 Giá thuê mặt bằng trung tâm tăng          0,12  |   1     0,12    |   4     0,48
S1 Thương hiệu được nhận biết mạnh           0,15  |   3     0,45    |   4     0,60
S2 Tập thành viên trung thành                0,10  |   —      —      |   —      —
S3 Xưởng rang trung tâm hiệu quả             0,10  |   2     0,20    |   4     0,40
W1 Phát triển sản phẩm mới chậm              0,12  |   3     0,36    |   1     0,12
W2 Cửa hàng dồn ở hai thành phố              0,12  |   4     0,48    |   2     0,24
W3 Kiểm soát chi phí cửa hàng yếu            0,10  |   1     0,10    |   3     0,30
STAS (các hàng đã trình bày)                       |        2,79     |        3,15</code></pre>
<p><strong>Cách đọc:</strong> trên các hàng đã trình bày, B dẫn trước 3,15 − 2,79 = 0,36. Mở cửa hàng mới (A) được điểm cao ở những yếu tố liên quan tới độ phủ — chi tiêu tăng và mạng lưới đang dồn cục — nhưng điểm thấp ở giá thuê và ở khâu kiểm soát chi phí cửa hàng yếu, vốn sẽ bị nhân lên khi có thêm cửa hàng. Dòng cà phê đóng chai (B) tận dụng thương hiệu và xưởng rang mà không cần thuê thêm mặt bằng, nhưng vấp thẳng vào điểm yếu phát triển sản phẩm mới chậm của Mộc Lan (W1) — vì thế không bao giờ được bỏ hàng này khỏi QSPM của một phương án phát triển sản phẩm. Tập thành viên (S2) hỗ trợ hai phương án như nhau, nên không ảnh hưởng tới lựa chọn và được ghi dấu gạch. Quyết định vẫn chỉ là tạm thời: mười trong hai mươi yếu tố — trong đó có O5 (xuất khẩu cà phê đóng gói), T5 (kiểm tra an toàn thực phẩm) và S5 (tiền mặt) — chưa được chấm, và mức dẫn 0,36 có thể thu hẹp hoặc đảo chiều khi chấm đủ. Trên các hàng đã trình bày, kết quả cùng hướng với tín hiệu "giữ vững và duy trì" của ma trận IE.</p>
<h3>Ưu điểm và hạn chế của QSPM</h3>
<ul>
<li><strong>Ưu điểm:</strong> so sánh được bao nhiêu chiến lược cũng được; buộc cả nhóm cân nhắc cùng lúc mọi yếu tố liên quan và ghi lại lập luận đằng sau từng điểm số.</li>
<li><strong>Hạn chế:</strong> điểm hấp dẫn là nhận định chủ quan, và kết quả chỉ tốt bằng EFE và IFE làm nền; nó chỉ so sánh các chiến lược trong nhóm đang xét.</li>
<li><strong>Chính trị và văn hoá:</strong> trên thực tế, lựa chọn chiến lược còn chịu ảnh hưởng của các liên minh, sở thích của lãnh đạo cấp cao và sự phù hợp với văn hoá. Một QSPM minh bạch không xoá được yếu tố chính trị, nhưng làm lộ rõ các lập luận và khiến việc gạt bỏ chúng mà không có lý do trở nên khó hơn.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc nhanh</span> Nếu thấy mình chấm hai chiến lược cùng một AS trên một hàng, hãy dừng lại: hoặc yếu tố đó thực sự không ảnh hưởng tới lựa chọn (ghi dấu gạch), hoặc bạn chưa nghĩ kỹ từng chiến lược tương tác với yếu tố đó ra sao.</div>`,
  ]]);

const c11e = doc('stm301-5-2-exercise', 'Exercise 3 — a QSPM for GreenBike: market development or a battery joint venture?|||Bài tập 3 — QSPM của GreenBike: phát triển thị trường hay liên doanh cell pin?',
  'Bài tập: lập QSPM đầy đủ 16 yếu tố (tổng trọng số 2,00) cho hai phương án của GreenBike (giả định) từ Bài tập 2, tính TAS và STAS, chọn phương án, kiểm tra độ nhạy khi hạ điểm hấp dẫn và đối chiếu với tín hiệu của ma trận IE; kèm lời giải.',
  [[
    `<span class="eyebrow">STM301 · Part 5 · Exercise</span>
<h2>Exercise 3 — ranking GreenBike's two alternatives</h2>
<div class="callout"><span class="badge">Problem</span> GreenBike (fictional) must choose between <strong>A = market development into the south</strong> and <strong>B = backward integration through a joint venture with a battery-cell supplier</strong> (Exercise 2). Use the sixteen factors and weights from Exercise 1. The team's attractiveness scores (A / B) are: O1 2/4 · O2 no effect · O3 4/2 · O4 3/1 · T1 2/3 · T2 3/2 · T3 1/4 · T4 1/4 · S1 3/4 · S2 4/1 · S3 no effect · S4 1/4 · W1 4/1 · W2 1/2 · W3 1/4 · W4 3/1. (a) Check the weights. (b) Compute every TAS and the STAS of each strategy. (c) Which strategy should GreenBike choose? (d) If the team lowered B's scores on T3 and T4 from 4 to 3, would the decision change?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) External weights 1.00 + internal weights 1.00 = 2.00 ✓

(b) Factor  Weight |  A: AS  TAS  |  B: AS  TAS
    O1       0.14  |     2   0.28 |     4   0.56
    O2       0.12  |     —    —   |     —    —
    O3       0.10  |     4   0.40 |     2   0.20
    O4       0.08  |     3   0.24 |     1   0.08
    T1       0.18  |     2   0.36 |     3   0.54
    T2       0.16  |     3   0.48 |     2   0.32
    T3       0.12  |     1   0.12 |     4   0.48
    T4       0.10  |     1   0.10 |     4   0.40
    S1       0.16  |     3   0.48 |     4   0.64
    S2       0.12  |     4   0.48 |     1   0.12
    S3       0.10  |     —    —   |     —    —
    S4       0.08  |     1   0.08 |     4   0.32
    W1       0.14  |     4   0.56 |     1   0.14
    W2       0.14  |     1   0.14 |     2   0.28
    W3       0.14  |     1   0.14 |     4   0.56
    W4       0.12  |     3   0.36 |     1   0.12
    STAS                     4.22 |        4.76

(c) B (battery-cell joint venture) is more attractive by 4.76 − 4.22 = 0.54.

(d) B loses 0.12 x (4 − 3) + 0.10 x (4 − 3) = 0.22 → 4.76 − 0.22 = 4.54
    4.54 &gt; 4.22 → B still ranks first; the decision is not fragile here.</code></pre>
<p><strong>Why:</strong> B wins because one cause — dependence on imported cells of uncontrolled quality — sits behind a major weakness (W3) and two threats (T3, T4), and the joint venture also builds on the firm's battery design and R&amp;D team (S1, S4). A's clear wins are on reach — the southern brand gap (W1), the dealer know-how (S2), young buyers and online sales (O3, O4) — and on capital, because it needs far less of the scarce funds (W4: 0.36 against 0.12): new partner dealers will tie up some working capital in stock and receivables, but a JV requires a large up-front equity contribution. The sensitivity check matters: a decision that flips when one or two judgments move by a point should not be presented as clear-cut. Finally, B departs from the IE signal: cell V (hold and maintain) favours market penetration and product development, not integration (A, market development, departs from it too). If B is chosen, the JV form at least limits the commitment compared with building or buying a cell plant outright, but the departure has to be justified — by the QSPM above and by a financing check, since B scores lowest on W4 (EPS/EBIT analysis, lesson 5.3).</p>`,
    `<span class="eyebrow">STM301 · Phần 5 · Bài tập</span>
<h2>Bài tập 3 — xếp hạng hai phương án của GreenBike</h2>
<div class="callout"><span class="badge">Đề</span> GreenBike (giả định) phải chọn giữa <strong>A = phát triển thị trường vào miền Nam</strong> và <strong>B = hội nhập về phía sau qua liên doanh với một nhà cung cấp cell pin</strong> (Bài tập 2). Dùng mười sáu yếu tố và trọng số từ Bài tập 1. Điểm hấp dẫn nhóm đưa ra (A / B): O1 2/4 · O2 không ảnh hưởng · O3 4/2 · O4 3/1 · T1 2/3 · T2 3/2 · T3 1/4 · T4 1/4 · S1 3/4 · S2 4/1 · S3 không ảnh hưởng · S4 1/4 · W1 4/1 · W2 1/2 · W3 1/4 · W4 3/1. (a) Kiểm tra trọng số. (b) Tính mọi TAS và STAS của từng chiến lược. (c) GreenBike nên chọn chiến lược nào? (d) Nếu nhóm hạ điểm của B ở T3 và T4 từ 4 xuống 3, quyết định có thay đổi không?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Trọng số bên ngoài 1,00 + trọng số bên trong 1,00 = 2,00 ✓

(b) Yếu tố  Trọng số |  A: AS  TAS  |  B: AS  TAS
    O1       0,14    |     2   0,28 |     4   0,56
    O2       0,12    |     —    —   |     —    —
    O3       0,10    |     4   0,40 |     2   0,20
    O4       0,08    |     3   0,24 |     1   0,08
    T1       0,18    |     2   0,36 |     3   0,54
    T2       0,16    |     3   0,48 |     2   0,32
    T3       0,12    |     1   0,12 |     4   0,48
    T4       0,10    |     1   0,10 |     4   0,40
    S1       0,16    |     3   0,48 |     4   0,64
    S2       0,12    |     4   0,48 |     1   0,12
    S3       0,10    |     —    —   |     —    —
    S4       0,08    |     1   0,08 |     4   0,32
    W1       0,14    |     4   0,56 |     1   0,14
    W2       0,14    |     1   0,14 |     2   0,28
    W3       0,14    |     1   0,14 |     4   0,56
    W4       0,12    |     3   0,36 |     1   0,12
    STAS                       4,22 |        4,76

(c) B (liên doanh cell pin) hấp dẫn hơn 4,76 − 4,22 = 0,54.

(d) B mất 0,12 x (4 − 3) + 0,10 x (4 − 3) = 0,22 → 4,76 − 0,22 = 4,54
    4,54 &gt; 4,22 → B vẫn đứng đầu; ở đây quyết định không mong manh.</code></pre>
<p><strong>Vì sao:</strong> B thắng vì một nguyên nhân duy nhất — phụ thuộc cell pin nhập khẩu chưa kiểm soát được chất lượng — nằm sau một điểm yếu lớn (W3) và hai nguy cơ (T3, T4), và liên doanh còn dựa trên thiết kế pin và đội R&amp;D sẵn có (S1, S4). A thắng rõ ở độ phủ — khoảng trống thương hiệu miền Nam (W1), kinh nghiệm quản lý đại lý (S2), người mua trẻ và bán hàng trực tuyến (O3, O4) — và ở nhu cầu vốn, vì A cần ít nguồn tài chính khan hiếm hơn hẳn (W4: 0,36 so với 0,12): đại lý đối tác mới sẽ giam một phần vốn lưu động vào hàng tồn kho và công nợ, nhưng liên doanh đòi một khoản góp vốn lớn ngay từ đầu. Kiểm tra độ nhạy rất quan trọng: một quyết định bị đảo chiều khi một hai nhận định dịch đi một điểm thì không nên trình bày như thể đã rõ ràng. Cuối cùng, B đi lệch tín hiệu của ma trận IE: ô V (giữ vững và duy trì) ưu tiên thâm nhập thị trường và phát triển sản phẩm, không phải hội nhập (A, phát triển thị trường, cũng lệch tín hiệu này). Nếu chọn B, hình thức liên doanh ít ra giới hạn được mức cam kết so với tự xây hoặc mua đứt một nhà máy cell pin, nhưng sự đi lệch đó phải được chứng minh — bằng QSPM ở trên và bằng việc kiểm tra phương án tài trợ, vì B nhận điểm thấp nhất ở W4 (phân tích EPS/EBIT, bài 5.3).</p>`,
  ]]);

const c12 = doc('stm301-5-3-implementation', '5.3 — Implementing strategy: objectives, resources, structure, culture & leadership|||5.3 — Thực thi chiến lược: mục tiêu, nguồn lực, cơ cấu, văn hoá & lãnh đạo',
  'Khác biệt giữa hoạch định và thực thi; mục tiêu hằng năm, chính sách, phân bổ nguồn lực và các rào cản; "cơ cấu đi theo chiến lược" (Chandler) và bốn kiểu cơ cấu; văn hoá, quản trị sự thay đổi và ba cách thực hiện thay đổi; vai trò lãnh đạo và gắn thù lao với kết quả; khung 7-S; phân tích EPS/EBIT để chọn cách tài trợ, có ví dụ số (giả định).',
  [[
    `<span class="eyebrow">STM301 · Part 5 · Lesson 5.3</span>
<h2>Implementing strategy</h2>
<p class="lead">A well-formulated strategy that is poorly implemented fails as surely as a bad strategy. Implementation turns the chosen strategy into annual objectives, budgets, structures, people's daily work and a culture that supports it.</p>
<h3>Formulation vs implementation</h3>
<table>
<tr><th>Formulation</th><th>Implementation</th></tr>
<tr><td>Positions forces before the action</td><td>Manages forces during the action</td></tr>
<tr><td>Focuses on effectiveness (doing the right things)</td><td>Focuses on efficiency (doing things right)</td></tr>
<tr><td>Mainly an intellectual, analytical process</td><td>Mainly an operational process</td></tr>
<tr><td>Needs intuition and analytical skill</td><td>Needs motivation and leadership skill</td></tr>
<tr><td>Coordinates a few people at the top</td><td>Coordinates many people across the firm</td></tr>
</table>
<h3>Annual objectives, policies and resource allocation</h3>
<p><strong>Annual objectives</strong> break long-term objectives into targets for each division and function; they should be measurable, consistent, challenging, clearly communicated and linked to rewards. <strong>Policies</strong> are guidelines, methods and rules that make the strategy work day to day (for example, "every new product must reach break-even within 12 months"). <strong>Resource allocation</strong> should follow the priorities set by the annual objectives; common barriers are the overprotection of existing budgets, too much emphasis on short-run financial criteria, organizational politics, vague targets and reluctance to take risks.</p>
<h3>Structure follows strategy</h3>
<p>Alfred Chandler observed that a new strategy creates new administrative problems; performance declines until a new structure is adopted. Main types:</p>
<table>
<tr><th>Structure</th><th>Strengths</th><th>Weaknesses</th></tr>
<tr><td>Functional (by marketing, operations, finance…)</td><td>Simple, low cost, deep specialization</td><td>Weak accountability for results, slow coordination across functions</td></tr>
<tr><td>Divisional (by geography, product, customer or process)</td><td>Clear accountability for each division's results; closer to markets</td><td>Duplicated functions, higher cost, rivalry between divisions</td></tr>
<tr><td>Strategic business unit (SBU)</td><td>Groups related divisions so top management oversees fewer units</td><td>Adds a layer of management; the SBU head's role must be clear</td></tr>
<tr><td>Matrix (functional and project or product lines)</td><td>Shares scarce specialists, flexible for complex projects</td><td>Dual reporting lines, possible conflict and slower decisions</td></tr>
</table>
<h3>Culture, change and leadership</h3>
<p>Organizational culture — shared values, beliefs, stories and routines — can speed a strategy or quietly block it. Where culture and strategy clash, managers must either adapt the strategy or change the culture deliberately. David describes three ways to implement change: a <strong>force</strong> strategy (orders enforced by authority: fast but low commitment), an <strong>educative</strong> strategy (information and persuasion: slower but builds support) and a <strong>rational or self-interest</strong> strategy (showing individuals how the change benefits them). Strategic leaders set direction, communicate it repeatedly, allocate resources and <strong>link pay to performance</strong> on the objectives that matter for the strategy.</p>
<p>The <strong>McKinsey 7-S framework</strong> is a useful checklist of alignment: strategy, structure, systems (hard elements) and shared values, style, staff, skills (soft elements). If one element changes, the others must be checked.</p>
<h3>Financing the strategy: EPS/EBIT analysis</h3>
<p>Implementation often needs capital. EPS/EBIT analysis compares earnings per share under debt and equity financing across possible EBIT levels.</p>
<pre><code class="language-text">Moc Lan needs VND 50 billion for the ready-to-drink line (fictional).
Now: 10 million shares, no debt, tax rate assumed 20%.
Debt:  borrow 50 bn at 10%     → interest 5 bn/year, shares stay 10 m
Stock: issue new shares at VND 20,000 → 50 bn / 20,000 = 2.5 m new shares → 12.5 m

EPS = (EBIT − interest) x (1 − tax) / shares        (VND per share)
EBIT (bn)       10        20        25        30
Debt EPS       400     1,200     1,600     2,000
Stock EPS      640     1,280     1,600     1,920

Break-even EBIT: (EBIT − 5) x 0.8 / 10 = EBIT x 0.8 / 12.5 → EBIT = 25 bn</code></pre>
<p>Above an EBIT of VND 25 billion, debt gives the higher EPS; below it, equity does. The decision also depends on risk (can interest be paid in a bad year?), control (new shares dilute ownership) and flexibility — EPS/EBIT analysis informs the choice but does not make it.</p>
<div class="callout"><span class="badge">Key lesson</span> Most implementation failures are not failures of analysis but of alignment: objectives that do not match the strategy, budgets that follow last year, structures that hide accountability and rewards that pay for the old behaviour.</div>`,
    `<span class="eyebrow">STM301 · Phần 5 · Bài 5.3</span>
<h2>Thực thi chiến lược</h2>
<p class="lead">Một chiến lược được hoạch định tốt nhưng thực thi kém cũng thất bại chắc chắn như một chiến lược tồi. Thực thi biến chiến lược đã chọn thành mục tiêu hằng năm, ngân sách, cơ cấu, công việc hằng ngày của con người và một nền văn hoá hỗ trợ nó.</p>
<h3>Hoạch định và thực thi</h3>
<table>
<tr><th>Hoạch định</th><th>Thực thi</th></tr>
<tr><td>Bố trí các lực lượng trước khi hành động</td><td>Quản lý các lực lượng trong khi hành động</td></tr>
<tr><td>Tập trung vào hiệu lực (làm đúng việc)</td><td>Tập trung vào hiệu suất (làm việc đúng cách)</td></tr>
<tr><td>Chủ yếu là quá trình tư duy, phân tích</td><td>Chủ yếu là quá trình tác nghiệp</td></tr>
<tr><td>Cần trực giác và kỹ năng phân tích</td><td>Cần kỹ năng tạo động lực và lãnh đạo</td></tr>
<tr><td>Phối hợp một số ít người ở cấp cao</td><td>Phối hợp nhiều người trong toàn doanh nghiệp</td></tr>
</table>
<h3>Mục tiêu hằng năm, chính sách và phân bổ nguồn lực</h3>
<p><strong>Mục tiêu hằng năm</strong> chia nhỏ mục tiêu dài hạn thành chỉ tiêu cho từng bộ phận và chức năng; chúng cần đo lường được, nhất quán, có tính thách thức, được truyền đạt rõ ràng và gắn với khen thưởng. <strong>Chính sách</strong> là các hướng dẫn, phương pháp và quy tắc giúp chiến lược vận hành hằng ngày (ví dụ "mọi sản phẩm mới phải đạt hoà vốn trong 12 tháng"). <strong>Phân bổ nguồn lực</strong> cần theo thứ tự ưu tiên mà mục tiêu hằng năm đặt ra; các rào cản thường gặp là bảo vệ quá mức ngân sách hiện có, quá chú trọng tiêu chí tài chính ngắn hạn, chính trị nội bộ, chỉ tiêu mơ hồ và ngại rủi ro.</p>
<h3>Cơ cấu đi theo chiến lược</h3>
<p>Alfred Chandler nhận thấy một chiến lược mới tạo ra các vấn đề quản lý mới; kết quả kinh doanh đi xuống cho tới khi một cơ cấu mới được áp dụng. Các kiểu chính:</p>
<table>
<tr><th>Cơ cấu</th><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td>Chức năng (theo marketing, vận hành, tài chính…)</td><td>Đơn giản, chi phí thấp, chuyên môn hoá sâu</td><td>Trách nhiệm về kết quả không rõ, phối hợp giữa các chức năng chậm</td></tr>
<tr><td>Bộ phận (theo khu vực địa lý, sản phẩm, khách hàng hoặc quy trình)</td><td>Trách nhiệm rõ ràng về kết quả của từng bộ phận; gần thị trường hơn</td><td>Trùng lặp chức năng, chi phí cao hơn, cạnh tranh giữa các bộ phận</td></tr>
<tr><td>Đơn vị kinh doanh chiến lược (SBU)</td><td>Gom các bộ phận có liên quan để lãnh đạo cấp cao giám sát ít đơn vị hơn</td><td>Thêm một cấp quản lý; vai trò người đứng đầu SBU phải rõ ràng</td></tr>
<tr><td>Ma trận (kết hợp chức năng với dự án hoặc dòng sản phẩm)</td><td>Dùng chung chuyên gia khan hiếm, linh hoạt cho dự án phức tạp</td><td>Hai tuyến báo cáo, dễ xung đột và ra quyết định chậm hơn</td></tr>
</table>
<h3>Văn hoá, thay đổi và lãnh đạo</h3>
<p>Văn hoá tổ chức — những giá trị, niềm tin, câu chuyện và thói quen được chia sẻ — có thể đẩy nhanh một chiến lược hoặc âm thầm chặn nó lại. Khi văn hoá và chiến lược xung đột, nhà quản trị phải hoặc điều chỉnh chiến lược, hoặc thay đổi văn hoá một cách có chủ đích. David mô tả ba cách thực hiện thay đổi: chiến lược <strong>cưỡng chế</strong> (ra lệnh bằng quyền lực: nhanh nhưng ít cam kết), chiến lược <strong>giáo dục</strong> (thông tin và thuyết phục: chậm hơn nhưng tạo được sự ủng hộ) và chiến lược <strong>hợp lý hay vì lợi ích cá nhân</strong> (cho từng người thấy thay đổi mang lại lợi ích gì cho họ). Nhà lãnh đạo chiến lược định hướng, truyền đạt nhiều lần, phân bổ nguồn lực và <strong>gắn thù lao với kết quả</strong> trên những mục tiêu quan trọng đối với chiến lược.</p>
<p><strong>Khung 7-S của McKinsey</strong> là danh mục kiểm tra sự đồng bộ hữu ích: chiến lược, cơ cấu, hệ thống (yếu tố cứng) và giá trị chung, phong cách, nhân sự, kỹ năng (yếu tố mềm). Khi một yếu tố thay đổi, phải rà lại các yếu tố còn lại.</p>
<h3>Tài trợ cho chiến lược: phân tích EPS/EBIT</h3>
<p>Thực thi thường cần vốn. Phân tích EPS/EBIT so sánh thu nhập trên mỗi cổ phần khi tài trợ bằng nợ và bằng vốn cổ phần ở các mức EBIT có thể xảy ra.</p>
<pre><code class="language-text">Mộc Lan cần 50 tỷ đồng cho dòng cà phê uống liền (giả định).
Hiện tại: 10 triệu cổ phần, không nợ, thuế suất giả định 20%.
Nợ:     vay 50 tỷ, lãi 10%       → lãi vay 5 tỷ/năm, số cổ phần giữ 10 triệu
Cổ phần: phát hành giá 20.000 đồng → 50 tỷ / 20.000 = 2,5 triệu cổ phần mới → 12,5 triệu

EPS = (EBIT − lãi vay) x (1 − thuế) / số cổ phần      (đồng/cổ phần)
EBIT (tỷ)          10        20        25        30
EPS khi vay nợ    400     1.200     1.600     2.000
EPS khi phát hành 640     1.280     1.600     1.920

EBIT hoà điểm: (EBIT − 5) x 0,8 / 10 = EBIT x 0,8 / 12,5 → EBIT = 25 tỷ</code></pre>
<p>Trên mức EBIT 25 tỷ đồng, vay nợ cho EPS cao hơn; dưới mức đó, phát hành cổ phần cho EPS cao hơn. Quyết định còn phụ thuộc vào rủi ro (năm xấu có trả được lãi không?), quyền kiểm soát (cổ phần mới làm pha loãng sở hữu) và tính linh hoạt — phân tích EPS/EBIT cung cấp thông tin cho lựa chọn chứ không thay thế lựa chọn.</p>
<div class="callout"><span class="badge">Bài học chính</span> Phần lớn thất bại trong thực thi không phải do phân tích sai mà do thiếu đồng bộ: mục tiêu không khớp chiến lược, ngân sách lập theo năm trước, cơ cấu che khuất trách nhiệm và khen thưởng vẫn trả cho hành vi cũ.</div>`,
  ]]);

const c13 = doc('stm301-5-4-evaluation-governance-ethics', '5.4 — Evaluation & control, the balanced scorecard, governance & ethics|||5.4 — Đánh giá & kiểm soát, thẻ điểm cân bằng, quản trị công ty & đạo đức',
  'Bốn tiêu chí đánh giá chiến lược của Rumelt; khung ba hoạt động đánh giá chiến lược và kế hoạch dự phòng; các loại kiểm soát chiến lược; thẻ điểm cân bằng bốn khía cạnh với ví dụ số (giả định); quản trị công ty: vấn đề người đại diện, hội đồng quản trị, mô hình quản trị công ty cổ phần ở Việt Nam; đạo đức kinh doanh và trách nhiệm xã hội (tháp Carroll).',
  [[
    `<span class="eyebrow">STM301 · Part 5 · Lesson 5.4</span>
<h2>Evaluation &amp; control, the balanced scorecard, governance &amp; ethics</h2>
<h3>Rumelt's four criteria for evaluating a strategy</h3>
<table>
<tr><th>Criterion</th><th>Question</th></tr>
<tr><td>Consistency</td><td>Are goals and policies free of mutual contradictions?</td></tr>
<tr><td>Consonance</td><td>Is the strategy an adaptive response to the external environment and to the critical changes occurring in it?</td></tr>
<tr><td>Feasibility</td><td>Can it be carried out without overtaxing available resources or creating unsolvable sub-problems?</td></tr>
<tr><td>Advantage</td><td>Does it create or maintain a competitive advantage in the selected area of activity?</td></tr>
</table>
<h3>A strategy-evaluation framework</h3>
<ol>
<li><strong>Review the underlying bases of the strategy</strong> — prepare revised EFE and IFE matrices and compare them with the ones the strategy was built on. Have key opportunities, threats, strengths or weaknesses changed?</li>
<li><strong>Measure organizational performance</strong> — compare expected with actual results, investigate significant deviations and look at both financial and non-financial measures.</li>
<li><strong>Take corrective action</strong> — adjust objectives, policies, resource allocation, structure or even the strategy itself.</li>
</ol>
<p><strong>Contingency plans</strong> — prepared "what if" responses for key events that could occur, such as the loss of a major supplier — shorten reaction time. Many texts also distinguish four types of strategic control: <em>premise control</em> (are our assumptions still valid?), <em>implementation control</em> (are milestones being met?), <em>strategic surveillance</em> (broad monitoring for unexpected events) and <em>special alert control</em> (rapid response to a sudden, major event).</p>
<h3>The balanced scorecard</h3>
<p>Kaplan and Norton's <strong>balanced scorecard</strong> translates strategy into objectives and measures from four perspectives, so that managers do not steer by financial results alone: <strong>financial</strong>, <strong>customer</strong>, <strong>internal business processes</strong> and <strong>learning and growth</strong>. The perspectives form a cause-and-effect chain — often drawn as a <em>strategy map</em>: skilled people improve processes, better processes delight customers, satisfied customers drive financial results.</p>
<pre><code class="language-text">Moc Lan scorecard, first half-year (fictional, illustrative)
Perspective        Measure                      Target    Actual   % of target
Financial          Revenue growth                  12%        9%       75.0%
Customer           Satisfaction score (/100)        85        88      103.5%
Internal process   Average order time (min)       ≤ 4        5       80.0%  (target / actual)
Learning, growth   Staff trained on new menu       90%       72%       80.0%</code></pre>
<p>The lagging financial result (75% of target) is consistent with the leading indicators: orders take longer than planned and fewer staff are trained, even though customers who are served remain satisfied. Four numbers show an association, not proof of cause, so this points first to training and process; before concluding, check other explanations such as customer traffic, pricing, competitor moves and delays in opening new stores — and only then decide whether a price cut is needed.</p>
<h3>Corporate governance</h3>
<p>Corporate governance is the system by which a company is directed and controlled. Because shareholders own the firm while managers run it, an <strong>agency problem</strong> can arise: managers may pursue growth, perks or job security rather than shareholder value. The <strong>board of directors</strong> reduces it by overseeing strategy, appointing and evaluating the CEO, monitoring risk and internal control and setting executive pay. Good practice includes independent directors, an audit committee, separating the roles of board chair and CEO, and transparent disclosure. In Vietnam, the current Law on Enterprises allows a joint-stock company to be organized either with a general meeting of shareholders, board of directors, supervisory board and director/general director, or with a general meeting, board of directors (including independent members with an audit committee under the board) and director/general director — check the text in force, together with any rules for listed companies, before applying it.</p>
<h3>Business ethics and social responsibility</h3>
<p>Carroll's pyramid describes four layers of corporate social responsibility: <strong>economic</strong> (be profitable), <strong>legal</strong> (obey the law), <strong>ethical</strong> (do what is right beyond the law) and <strong>philanthropic</strong> (contribute to the community). Firms build ethics into strategy through a code of conduct, training, safe whistle-blowing channels, and leaders who model the behaviour they ask for. Sustainability reporting increasingly asks firms to account for environmental and social results alongside profit (the "triple bottom line" of people, planet and profit).</p>
<div class="callout"><span class="badge">One idea to keep</span> Evaluation is not a final exam at the end of the year. The strategy was built on assumptions; control is the habit of checking them continuously — and governance ensures that someone independent is allowed to ask.</div>`,
    `<span class="eyebrow">STM301 · Phần 5 · Bài 5.4</span>
<h2>Đánh giá &amp; kiểm soát, thẻ điểm cân bằng, quản trị công ty &amp; đạo đức</h2>
<h3>Bốn tiêu chí đánh giá chiến lược của Rumelt</h3>
<table>
<tr><th>Tiêu chí</th><th>Câu hỏi</th></tr>
<tr><td>Nhất quán</td><td>Các mục tiêu và chính sách có mâu thuẫn lẫn nhau không?</td></tr>
<tr><td>Phù hợp (hoà hợp với môi trường)</td><td>Chiến lược có phải là sự thích ứng với môi trường bên ngoài và với những thay đổi then chốt đang diễn ra trong đó không?</td></tr>
<tr><td>Khả thi</td><td>Có thực hiện được mà không vắt kiệt nguồn lực sẵn có hoặc tạo ra những vấn đề con không giải quyết được không?</td></tr>
<tr><td>Lợi thế</td><td>Chiến lược có tạo ra hoặc duy trì được lợi thế cạnh tranh trong lĩnh vực hoạt động đã chọn không?</td></tr>
</table>
<h3>Khung đánh giá chiến lược</h3>
<ol>
<li><strong>Rà soát các cơ sở nền tảng của chiến lược</strong> — lập ma trận EFE và IFE sửa đổi, so với các ma trận đã dùng khi xây dựng chiến lược. Các cơ hội, nguy cơ, điểm mạnh, điểm yếu then chốt có thay đổi không?</li>
<li><strong>Đo lường kết quả của tổ chức</strong> — so kết quả kỳ vọng với kết quả thực tế, tìm hiểu các sai lệch đáng kể và xem xét cả chỉ tiêu tài chính lẫn phi tài chính.</li>
<li><strong>Thực hiện hành động điều chỉnh</strong> — điều chỉnh mục tiêu, chính sách, phân bổ nguồn lực, cơ cấu hoặc thậm chí chính chiến lược.</li>
</ol>
<p><strong>Kế hoạch dự phòng</strong> — các phương án "nếu… thì" chuẩn bị sẵn cho những sự kiện then chốt có thể xảy ra, như mất một nhà cung cấp lớn — giúp rút ngắn thời gian phản ứng. Nhiều giáo trình còn phân biệt bốn loại kiểm soát chiến lược: <em>kiểm soát tiền đề</em> (các giả định còn đúng không?), <em>kiểm soát thực thi</em> (các mốc có đạt không?), <em>giám sát chiến lược</em> (theo dõi rộng để phát hiện sự kiện bất ngờ) và <em>kiểm soát cảnh báo đặc biệt</em> (phản ứng nhanh trước một sự kiện lớn, đột ngột).</p>
<h3>Thẻ điểm cân bằng</h3>
<p><strong>Thẻ điểm cân bằng</strong> của Kaplan và Norton chuyển chiến lược thành mục tiêu và thước đo theo bốn khía cạnh, để nhà quản trị không chỉ lái doanh nghiệp bằng kết quả tài chính: <strong>tài chính</strong>, <strong>khách hàng</strong>, <strong>quy trình kinh doanh nội bộ</strong> và <strong>học hỏi và phát triển</strong>. Các khía cạnh tạo thành một chuỗi nhân quả — thường được vẽ thành <em>bản đồ chiến lược</em>: con người có kỹ năng cải thiện quy trình, quy trình tốt hơn làm khách hàng hài lòng, khách hàng hài lòng tạo ra kết quả tài chính.</p>
<pre><code class="language-text">Thẻ điểm Mộc Lan, sáu tháng đầu năm (giả định, số minh hoạ)
Khía cạnh           Thước đo                         Chỉ tiêu  Thực tế  % chỉ tiêu
Tài chính           Tăng trưởng doanh thu               12%       9%      75,0%
Khách hàng          Điểm hài lòng (/100)                 85       88     103,5%
Quy trình nội bộ    Thời gian phục vụ TB (phút)         ≤ 4        5      80,0%  (chỉ tiêu / thực tế)
Học hỏi, phát triển Nhân viên được đào tạo thực đơn mới 90%      72%      80,0%</code></pre>
<p>Kết quả tài chính đi sau (75% chỉ tiêu) phù hợp với các chỉ số dẫn dắt: phục vụ lâu hơn kế hoạch và ít nhân viên được đào tạo hơn, dù những khách được phục vụ vẫn hài lòng. Bốn con số chỉ cho thấy các chỉ số đi kèm nhau, chưa chứng minh được quan hệ nhân quả, nên chúng gợi ý ưu tiên xử lý đào tạo và quy trình trước; trước khi kết luận, hãy kiểm các cách giải thích khác như lượng khách, giá bán, động thái của đối thủ và việc mở cửa hàng mới bị chậm — rồi mới quyết định có cần giảm giá hay không.</p>
<h3>Quản trị công ty</h3>
<p>Quản trị công ty là hệ thống theo đó công ty được định hướng và kiểm soát. Vì cổ đông sở hữu còn nhà quản lý điều hành, có thể phát sinh <strong>vấn đề người đại diện</strong>: nhà quản lý có thể theo đuổi quy mô, đặc quyền hay sự an toàn của vị trí thay vì giá trị cho cổ đông. <strong>Hội đồng quản trị</strong> hạn chế vấn đề này bằng cách giám sát chiến lược, bổ nhiệm và đánh giá người điều hành cao nhất, theo dõi rủi ro và kiểm soát nội bộ, quyết định thù lao của ban điều hành. Thông lệ tốt gồm có thành viên độc lập, uỷ ban kiểm toán, tách vai trò chủ tịch hội đồng quản trị và tổng giám đốc, và công bố thông tin minh bạch. Ở Việt Nam, Luật Doanh nghiệp hiện hành cho phép công ty cổ phần tổ chức theo một trong hai mô hình: Đại hội đồng cổ đông, Hội đồng quản trị, Ban kiểm soát và Giám đốc/Tổng giám đốc; hoặc Đại hội đồng cổ đông, Hội đồng quản trị (có thành viên độc lập và Uỷ ban kiểm toán trực thuộc Hội đồng quản trị) và Giám đốc/Tổng giám đốc — hãy kiểm văn bản đang có hiệu lực, cùng các quy định riêng cho công ty niêm yết, trước khi áp dụng.</p>
<h3>Đạo đức kinh doanh và trách nhiệm xã hội</h3>
<p>Tháp của Carroll mô tả bốn tầng trách nhiệm xã hội của doanh nghiệp: <strong>kinh tế</strong> (có lợi nhuận), <strong>pháp lý</strong> (tuân thủ pháp luật), <strong>đạo đức</strong> (làm điều đúng vượt trên yêu cầu của luật) và <strong>từ thiện</strong> (đóng góp cho cộng đồng). Doanh nghiệp đưa đạo đức vào chiến lược bằng bộ quy tắc ứng xử, đào tạo, kênh tố giác an toàn, và những nhà lãnh đạo làm gương cho hành vi mà họ yêu cầu. Báo cáo phát triển bền vững ngày càng đòi hỏi doanh nghiệp giải trình kết quả môi trường và xã hội bên cạnh lợi nhuận ("ba điểm mấu chốt": con người, hành tinh và lợi nhuận).</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Đánh giá không phải kỳ thi cuối năm. Chiến lược được xây trên các giả định; kiểm soát là thói quen kiểm tra chúng liên tục — và quản trị công ty đảm bảo có một người độc lập được phép đặt câu hỏi.</div>`,
  ]]);

const q5 = quiz('stm301-quiz-5', 'Quiz 5 — Choice, implementation & control|||Quiz 5 — Lựa chọn, thực thi & kiểm soát', [
  { id: 'q1', question: 'In a QSPM, a key factor that does not affect the choice between the strategies in a set…|||Trong QSPM, một yếu tố then chốt không ảnh hưởng tới việc lựa chọn giữa các chiến lược trong một nhóm thì…', options: ['receives no attractiveness score for any strategy — a dash is entered|||không được chấm điểm hấp dẫn cho chiến lược nào — ghi dấu gạch', 'receives an attractiveness score of 1 for every strategy|||được chấm điểm hấp dẫn 1 cho mọi chiến lược', 'is removed and the remaining weights are rescaled to 1.00|||bị loại bỏ và các trọng số còn lại được quy đổi lại cho đủ 1,00', 'receives double weight|||được nhân đôi trọng số'], correctIndex: 0, explanation: 'If the answer to “does this factor affect the choice?” is no, no AS is assigned in that row; weights are never rescaled.|||Nếu câu trả lời cho “yếu tố này có ảnh hưởng tới lựa chọn không?” là không, hàng đó không được chấm AS; trọng số không bao giờ bị quy đổi lại.' },
  { id: 'q2', question: 'Which set lists the four perspectives of the balanced scorecard?|||Tập hợp nào liệt kê đúng bốn khía cạnh của thẻ điểm cân bằng?', options: ['Political, economic, social, technological|||Chính trị, kinh tế, xã hội, công nghệ', 'Strategy, structure, systems, shared values|||Chiến lược, cơ cấu, hệ thống, giá trị chung', 'Financial, customer, internal business processes, learning and growth|||Tài chính, khách hàng, quy trình kinh doanh nội bộ, học hỏi và phát triển', 'Consistency, consonance, feasibility, advantage|||Nhất quán, phù hợp, khả thi, lợi thế'], correctIndex: 2, explanation: 'The other options are PESTEL variables, part of the 7-S framework and Rumelt’s criteria respectively.|||Các phương án còn lại lần lượt là biến số PESTEL, một phần của khung 7-S và tiêu chí của Rumelt.' },
  { id: 'q3', question: 'Which of Rumelt’s criteria asks whether a strategy is an adaptive response to the external environment and its critical changes?|||Tiêu chí nào của Rumelt đặt câu hỏi chiến lược có phải là sự thích ứng với môi trường bên ngoài và những thay đổi then chốt của nó không?', options: ['Consistency|||Nhất quán', 'Consonance|||Phù hợp (hoà hợp với môi trường)', 'Feasibility|||Khả thi', 'Advantage|||Lợi thế'], correctIndex: 1, explanation: 'Consonance looks outward at the environment; consistency looks inward at goals and policies, feasibility at resources, advantage at competitive position.|||Tiêu chí phù hợp nhìn ra môi trường bên ngoài; nhất quán nhìn vào mục tiêu và chính sách, khả thi nhìn vào nguồn lực, lợi thế nhìn vào vị thế cạnh tranh.' },
]);

const taiLieu = doc('stm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">STM301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning strategic management: the official syllabus and slides, the standard textbooks, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official STM301 syllabus, learning outcomes and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Strategic Management: Concepts and Cases</a> — Fred R. David &amp; Forest R. David (Pearson) — the textbook that systematizes the EFE, IFE, CPM, SPACE, IE and QSPM matrices into the three-stage framework used in this course (SPACE itself comes from Rowe and colleagues, and the IE matrix adapts the GE–McKinsey nine-cell grid); search the title on the publisher site.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Crafting &amp; Executing Strategy: The Quest for Competitive Advantage</a> — Thompson, Peteraf, Gamble &amp; Strickland (McGraw Hill) — strong on industry analysis, generic strategies and execution; search the title on the publisher site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx" target="_blank" rel="noopener">Harvard Business School — The Five Forces</a> — the Institute for Strategy and Competitiveness page on Porter's framework.</li>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management</a> — free open textbook with chapters on strategy, structure and control.</li>
<li><a href="https://openstax.org/details/books/business-ethics" target="_blank" rel="noopener">OpenStax — Business Ethics</a> — free open textbook on ethics, stakeholders and corporate governance.</li>
<li><a href="https://www.blueoceanstrategy.com/tools/errc-grid/" target="_blank" rel="noopener">Blue Ocean Strategy — ERRC grid</a> — the authors' official explanation of the eliminate–reduce–raise–create tool.</li>
<li><a href="https://balancedscorecard.org/" target="_blank" rel="noopener">Balanced Scorecard Institute</a> — articles and examples on scorecards and strategy maps.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — short videos on strategy, competition and leadership.</li>
<li><a href="https://www.youtube.com/@stanfordgsb" target="_blank" rel="noopener">Stanford Graduate School of Business</a> — talks by business leaders and faculty on strategy and management.</li>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u (Jim Riley)</a> — concise explainers of business-strategy models such as Ansoff, Porter and the BCG matrix.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — build EFE, IFE, CPM and QSPM matrices with SUMPRODUCT, plus EPS/EBIT tables and simple sensitivity checks; free and shareable with your team.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — a simple board for tracking annual objectives, implementation milestones and owners.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — online whiteboard for TOWS workshops, strategy canvases and strategy maps.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — Parts 1–2: practise EFE, CPM and IFE until you can build and interpret each in about twenty minutes.</li>
<li><strong>Practise on a real firm</strong> — pick a listed company, read its published annual report and build its EFE, IFE and CPM from public information.</li>
<li><strong>Go deeper</strong> — for the same firm, run TOWS, SPACE, IE and a QSPM; explain where the tools disagree. Hill, Schilling &amp; Jones (Cengage) is a good theoretical companion.</li>
<li><strong>Apply</strong> — write a two-page strategy memo: the recommended strategy, annual objectives, a financing check and a four-perspective balanced scorecard.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">STM301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học quản trị chiến lược: giáo trình &amp; slide chính thức, giáo trình chuẩn, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc đề cương, chuẩn đầu ra và slide bài giảng chính thức của STM301.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Strategic Management: Concepts and Cases</a> — Fred R. David &amp; Forest R. David (Pearson) — giáo trình hệ thống hoá các ma trận EFE, IFE, CPM, SPACE, IE và QSPM theo khung ba giai đoạn dùng trong môn này (bản thân SPACE do Rowe và cộng sự xây dựng, còn ma trận IE chuyển thể từ lưới chín ô GE–McKinsey); tra tên sách trên trang nhà xuất bản.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Crafting &amp; Executing Strategy: The Quest for Competitive Advantage</a> — Thompson, Peteraf, Gamble &amp; Strickland (McGraw Hill) — mạnh về phân tích ngành, chiến lược tổng quát và thực thi; tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx" target="_blank" rel="noopener">Harvard Business School — The Five Forces</a> — trang của Viện Chiến lược và Năng lực cạnh tranh về mô hình của Porter.</li>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management</a> — giáo trình mở miễn phí, có các chương về chiến lược, cơ cấu và kiểm soát.</li>
<li><a href="https://openstax.org/details/books/business-ethics" target="_blank" rel="noopener">OpenStax — Business Ethics</a> — giáo trình mở miễn phí về đạo đức, các bên liên quan và quản trị công ty.</li>
<li><a href="https://www.blueoceanstrategy.com/tools/errc-grid/" target="_blank" rel="noopener">Blue Ocean Strategy — ERRC grid</a> — giải thích chính thức của nhóm tác giả về công cụ loại bỏ – cắt giảm – gia tăng – tạo mới.</li>
<li><a href="https://balancedscorecard.org/" target="_blank" rel="noopener">Balanced Scorecard Institute</a> — bài viết và ví dụ về thẻ điểm cân bằng và bản đồ chiến lược.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — video ngắn về chiến lược, cạnh tranh và lãnh đạo.</li>
<li><a href="https://www.youtube.com/@stanfordgsb" target="_blank" rel="noopener">Stanford Graduate School of Business</a> — bài nói của lãnh đạo doanh nghiệp và giảng viên về chiến lược và quản trị.</li>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u (Jim Riley)</a> — giải thích ngắn gọn các mô hình chiến lược kinh doanh như Ansoff, Porter, ma trận BCG.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — lập ma trận EFE, IFE, CPM, QSPM bằng hàm SUMPRODUCT, cùng bảng EPS/EBIT và kiểm tra độ nhạy đơn giản; miễn phí và chia sẻ được với nhóm.</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — bảng công việc đơn giản để theo dõi mục tiêu hằng năm, các mốc thực thi và người phụ trách.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bảng trắng trực tuyến cho buổi làm TOWS, sơ đồ chiến lược và bản đồ chiến lược.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — Phần 1–2: luyện EFE, CPM và IFE tới khi dựng và diễn giải được mỗi ma trận trong khoảng hai mươi phút.</li>
<li><strong>Luyện trên doanh nghiệp thật</strong> — chọn một công ty niêm yết, đọc báo cáo thường niên đã công bố và dựng EFE, IFE, CPM từ thông tin công khai.</li>
<li><strong>Đào sâu</strong> — với cùng doanh nghiệp đó, chạy TOWS, SPACE, IE và một QSPM; giải thích chỗ các công cụ không thống nhất. Giáo trình của Hill, Schilling &amp; Jones (Cengage) là tài liệu đồng hành tốt về lý thuyết.</li>
<li><strong>Vận dụng</strong> — viết một bản ghi nhớ chiến lược hai trang: chiến lược đề xuất, mục tiêu hằng năm, kiểm tra phương án tài trợ và một thẻ điểm cân bằng bốn khía cạnh.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'STM301',
    slug: 'stm301-strategic-management',
    title: 'Strategic Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/STM301.webp',
    shortDescription: 'How firms craft and execute strategy: vision and mission, external and internal analysis (five forces, EFE, CPM, VRIO, IFE), business, corporate and international strategy, TOWS, SPACE, BCG, IE and QSPM, implementation and control. Bilingual, with exercises.|||Hoạch định và thực thi chiến lược: sứ mệnh, phân tích bên ngoài và bên trong (EFE, CPM, VRIO, IFE), chiến lược cấp kinh doanh, công ty, quốc tế, TOWS, SPACE, BCG, IE, QSPM, thực thi và kiểm soát. Song ngữ, có bài tập.',
    description: 'Môn <strong>STM301 — Strategic Management (Quản trị chiến lược)</strong> (khối Quản trị Kinh doanh, kỳ 3) trả lời câu hỏi: <strong>vì sao có doanh nghiệp liên tục vượt đối thủ, và làm sao hoạch định – thực thi – đánh giá một chiến lược như vậy</strong>. Từ <strong>tầm nhìn, sứ mệnh và mục tiêu</strong> → <strong>đánh giá bên ngoài</strong> (PESTEL, năm lực lượng, nhóm chiến lược, vòng đời ngành, ma trận EFE và CPM) → <strong>đánh giá nội bộ</strong> (nguồn lực, VRIO, chuỗi giá trị, năng lực cốt lõi, ma trận IFE) → <strong>các loại chiến lược</strong> cấp kinh doanh (Porter, đại dương xanh), cấp công ty (hội nhập, đa dạng hoá, M&amp;A, liên minh) và quốc tế → <strong>công cụ kết hợp</strong> (TOWS, SPACE, BCG, IE, ma trận chiến lược chính) → <strong>quyết định bằng QSPM</strong> → <strong>thực thi, đánh giá và kiểm soát</strong> (cơ cấu, văn hoá, EPS/EBIT, thẻ điểm cân bằng, quản trị công ty, đạo đức). MGT103 đã giới thiệu SWOT, BCG và Porter ở mức nhập môn; môn này đi sâu vào các công cụ định lượng trong khung của Fred David và vào khâu thực thi. Bám cấu trúc giáo trình chuẩn quốc tế (David &amp; David; Thompson và cộng sự; Hill, Schilling &amp; Jones), song ngữ Anh–Việt, tình huống và số liệu đều là giả định và đã kiểm bằng máy, có ba bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Viết tuyên bố tầm nhìn, sứ mệnh đủ chín thành phần và đặt mục tiêu dài hạn đạt chuẩn SMART\nPhân tích môi trường bên ngoài bằng PESTEL, năm lực lượng, nhóm chiến lược và vòng đời ngành\nLập ma trận EFE, CPM và IFE đúng quy tắc trọng số và điểm phân loại, diễn giải quanh mức 2,5\nĐánh giá nguồn lực và năng lực bằng VRIO, chuỗi giá trị và năng lực cốt lõi\nVận dụng chiến lược cạnh tranh tổng quát, đại dương xanh, hội nhập, đa dạng hoá, M&A, liên minh và chiến lược quốc tế\nDựng ma trận TOWS, SPACE, BCG, IE và ma trận chiến lược chính để hình thành phương án\nXếp hạng phương án bằng QSPM và kiểm tra độ nhạy của quyết định\nThực thi và kiểm soát chiến lược: cơ cấu, văn hoá, phân tích EPS/EBIT, thẻ điểm cân bằng, quản trị công ty và đạo đức',
    requirements: 'Nên học trước MGT103 — Introduction to Management (SWOT, BCG, Porter ở mức nhập môn)\nNên đã học MKT101 và FIN202 (hoặc ACC101) để đọc được thị trường và báo cáo tài chính\nBảng tính (Excel, Google Sheets) để lập các ma trận có trọng số',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Chiến lược, lợi thế cạnh tranh, ba giai đoạn quản trị chiến lược, ba cấp chiến lược.', lessons: [intro] },
    { title: 'Part 1 — Strategic direction & the external assessment|||Phần 1 — Định hướng chiến lược & đánh giá bên ngoài', description: 'Tầm nhìn, sứ mệnh, mục tiêu, PESTEL, năm lực lượng, nhóm chiến lược, vòng đời ngành, EFE, CPM.', lessons: [c1, c2, c3, q1] },
    { title: 'Part 2 — The internal assessment|||Phần 2 — Đánh giá nội bộ', description: 'Nguồn lực, năng lực, VRIO, năng lực cốt lõi, chuỗi giá trị, phân tích chức năng, IFE.', lessons: [c4, c5, c5e, q2] },
    { title: 'Part 3 — Business-, corporate- & international-level strategy|||Phần 3 — Chiến lược cấp kinh doanh, cấp công ty & quốc tế', description: 'Porter, chi phí tốt nhất, đại dương xanh, hội nhập, đa dạng hoá, M&A, liên minh, chiến lược quốc tế.', lessons: [c6, c7, c8, q3] },
    { title: 'Part 4 — Matching tools: TOWS, SPACE, BCG & IE|||Phần 4 — Công cụ kết hợp: TOWS, SPACE, BCG & IE', description: 'Khung ba giai đoạn, TOWS, SPACE, BCG, IE, ma trận chiến lược chính.', lessons: [c9, c10, c10e, q4] },
    { title: 'Part 5 — Choice, implementation & control|||Phần 5 — Lựa chọn, thực thi & kiểm soát', description: 'QSPM, thực thi, cơ cấu, văn hoá, EPS/EBIT, đánh giá, thẻ điểm cân bằng, quản trị công ty, đạo đức.', lessons: [c11, c11e, c12, c13, q5] },
  ],
};
