/**
 * MGT103 — Introduction to Management (Nhập môn quản trị). Khối Quản trị Kinh doanh, kỳ 1.
 * Bám cấu trúc giáo trình quản trị học nhập môn chuẩn (vd Robbins & Coulter — Management):
 * nhà quản trị & lịch sử tư tưởng, môi trường–văn hoá–đạo đức, hoạch định & ra quyết định,
 * tổ chức, lãnh đạo & động viên, kiểm soát. Song ngữ + ví dụ (số đã kiểm) + bài tập tình huống + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mgt103-0-1-overview', 'Course overview: managers & management|||Tổng quan: nhà quản trị & quản trị',
  'Nhà quản trị là ai (3 cấp), hiệu quả và hiệu suất, 4 chức năng POLC, 10 vai trò của Mintzberg, 3 kỹ năng của Katz, tiến trình tư tưởng quản trị từ cổ điển tới hiện đại, lộ trình môn.',
  [[
    `<span class="eyebrow">MGT103 · Lesson 0.1 · Overview</span>
<h2>Introduction to Management</h2>
<p class="lead"><strong>Management</strong> is coordinating and overseeing the work activities of others so that their activities are completed <strong>efficiently</strong> and <strong>effectively</strong>. Efficiency is "doing things right" — getting the most output from the least input. Effectiveness is "doing the right things" — achieving the organization's goals. Good managers need both.</p>
<h3>Who are managers?</h3>
<p><strong>First-line managers</strong> (supervisors, team leaders) direct the daily work of non-managerial employees; <strong>middle managers</strong> (department heads, branch managers) link the top and the front line; <strong>top managers</strong> (CEO, directors) set direction and make organization-wide decisions.</p>
<h3>The four functions — P-O-L-C</h3>
<table>
<tr><th>Function</th><th>What managers do</th></tr>
<tr><td>Planning</td><td>Define goals, establish strategies, develop plans</td></tr>
<tr><td>Organizing</td><td>Decide what must be done, how, and who does it; design the structure</td></tr>
<tr><td>Leading</td><td>Motivate, direct and communicate with people, resolve conflicts</td></tr>
<tr><td>Controlling</td><td>Monitor performance, compare it with goals, correct deviations</td></tr>
</table>
<h3>Roles and skills</h3>
<p>Henry Mintzberg observed that managers play ten roles in three groups: <strong>interpersonal</strong> (figurehead, leader, liaison), <strong>informational</strong> (monitor, disseminator, spokesperson) and <strong>decisional</strong> (entrepreneur, disturbance handler, resource allocator, negotiator). Robert Katz identified three skills: <strong>technical</strong> skills (most important for first-line managers), <strong>human</strong> skills (important at every level) and <strong>conceptual</strong> skills — seeing the organization as a whole (most important for top managers).</p>
<h3>How management thinking evolved</h3>
<table>
<tr><th>Approach</th><th>Key ideas and people</th></tr>
<tr><td>Classical</td><td><strong>Scientific management</strong> — Frederick Taylor, the Gilbreths: find the "one best way" to do a job. <strong>General administrative theory</strong> — Henri Fayol's 14 principles (division of work, authority, unity of command, scalar chain…); Max Weber's <strong>bureaucracy</strong> (hierarchy, rules, impersonality, merit)</td></tr>
<tr><td>Behavioural</td><td>The <strong>Hawthorne studies</strong> (Elton Mayo): social norms and attention affect productivity; Mary Parker Follett, Chester Barnard</td></tr>
<tr><td>Quantitative</td><td>Statistics, optimization models, total quality management (W. Edwards Deming)</td></tr>
<tr><td>Contemporary</td><td><strong>Systems</strong> approach — the organization as an open system interacting with its environment; <strong>contingency</strong> approach — "it depends" on size, technology, uncertainty and people</td></tr>
</table>
<h3>Roadmap</h3>
<p>Part 1: the environment, culture and ethics · Part 2: planning and decision making · Part 3: organizing · Part 4: leading (motivation and leadership) · Part 5: controlling. Each part ends with a quiz; parts 2 and 4 include a case exercise.</p>
<div class="callout"><span class="badge">Why study management?</span> Almost everyone either manages or is managed. Understanding how managers think helps you work better in any organization — and prepares you to lead one.</div>`,
    `<span class="eyebrow">MGT103 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn quản trị</h2>
<p class="lead"><strong>Quản trị</strong> là phối hợp và giám sát hoạt động công việc của người khác để các hoạt động đó được hoàn thành <strong>có hiệu suất</strong> và <strong>có hiệu quả</strong>. Hiệu suất (efficiency) là "làm đúng cách" — thu được nhiều đầu ra nhất từ ít đầu vào nhất. Hiệu quả (effectiveness) là "làm đúng việc" — đạt được mục tiêu của tổ chức. Nhà quản trị giỏi cần cả hai.</p>
<h3>Nhà quản trị là ai?</h3>
<p><strong>Nhà quản trị cấp cơ sở</strong> (tổ trưởng, trưởng nhóm) điều hành công việc hằng ngày của nhân viên không làm quản lý; <strong>nhà quản trị cấp trung</strong> (trưởng phòng, giám đốc chi nhánh) nối cấp cao với tuyến đầu; <strong>nhà quản trị cấp cao</strong> (tổng giám đốc, ban giám đốc) định hướng và ra các quyết định cho toàn tổ chức.</p>
<h3>Bốn chức năng — P-O-L-C</h3>
<table>
<tr><th>Chức năng</th><th>Nhà quản trị làm gì</th></tr>
<tr><td>Hoạch định</td><td>Xác định mục tiêu, xây dựng chiến lược, lập kế hoạch</td></tr>
<tr><td>Tổ chức</td><td>Quyết định việc gì phải làm, làm thế nào, ai làm; thiết kế cơ cấu</td></tr>
<tr><td>Lãnh đạo</td><td>Động viên, chỉ dẫn và giao tiếp với con người, giải quyết xung đột</td></tr>
<tr><td>Kiểm soát</td><td>Theo dõi kết quả, so với mục tiêu, điều chỉnh sai lệch</td></tr>
</table>
<h3>Vai trò và kỹ năng</h3>
<p>Henry Mintzberg quan sát thấy nhà quản trị đóng mười vai trò thuộc ba nhóm: <strong>quan hệ con người</strong> (người đại diện, người lãnh đạo, người liên lạc), <strong>thông tin</strong> (người giám sát, người phổ biến, người phát ngôn) và <strong>quyết định</strong> (nhà kinh doanh, người xử lý xáo trộn, người phân bổ nguồn lực, nhà thương thuyết). Robert Katz chỉ ra ba kỹ năng: <strong>kỹ thuật</strong> (quan trọng nhất với cấp cơ sở), <strong>quan hệ con người</strong> (quan trọng ở mọi cấp) và <strong>tư duy khái quát</strong> — nhìn tổ chức như một tổng thể (quan trọng nhất với cấp cao).</p>
<h3>Tư tưởng quản trị đã phát triển thế nào</h3>
<table>
<tr><th>Trường phái</th><th>Ý tưởng và nhân vật chính</th></tr>
<tr><td>Cổ điển</td><td><strong>Quản trị khoa học</strong> — Frederick Taylor, vợ chồng Gilbreth: tìm "cách tốt nhất" để làm một công việc. <strong>Lý thuyết quản trị hành chính</strong> — 14 nguyên tắc của Henri Fayol (phân công lao động, quyền hạn, thống nhất chỉ huy, hệ thống cấp bậc…); mô hình <strong>quan liêu</strong> của Max Weber (thứ bậc, quy tắc, phi cá nhân, trọng năng lực)</td></tr>
<tr><td>Hành vi</td><td><strong>Nghiên cứu Hawthorne</strong> (Elton Mayo): chuẩn mực nhóm và sự quan tâm tác động tới năng suất; Mary Parker Follett, Chester Barnard</td></tr>
<tr><td>Định lượng</td><td>Thống kê, mô hình tối ưu, quản trị chất lượng toàn diện (W. Edwards Deming)</td></tr>
<tr><td>Hiện đại</td><td>Cách tiếp cận <strong>hệ thống</strong> — tổ chức là hệ thống mở tương tác với môi trường; cách tiếp cận <strong>tình huống</strong> — "tuỳ trường hợp", phụ thuộc quy mô, công nghệ, mức bất định và con người</td></tr>
</table>
<h3>Lộ trình</h3>
<p>Phần 1: môi trường, văn hoá và đạo đức · Phần 2: hoạch định và ra quyết định · Phần 3: tổ chức · Phần 4: lãnh đạo (động viên và phong cách lãnh đạo) · Phần 5: kiểm soát. Mỗi phần kết thúc bằng một bài quiz; phần 2 và 4 có bài tập tình huống.</p>
<div class="callout"><span class="badge">Vì sao học quản trị?</span> Gần như ai cũng hoặc là người quản lý, hoặc là người được quản lý. Hiểu cách nhà quản trị suy nghĩ giúp bạn làm việc tốt hơn trong bất kỳ tổ chức nào — và chuẩn bị để bạn lãnh đạo một tổ chức.</div>`,
  ]]);

const c1 = doc('mgt103-1-1-environment-culture-ethics', '1.1 — Environment, culture, social responsibility & ethics|||1.1 — Môi trường, văn hoá, trách nhiệm xã hội & đạo đức',
  'Quan điểm toàn năng và biểu tượng, văn hoá tổ chức (các chiều, văn hoá mạnh, cách truyền tải), môi trường cụ thể và môi trường chung, mức bất định, các bên liên quan, trách nhiệm xã hội (cổ điển và kinh tế – xã hội), các yếu tố ảnh hưởng hành vi đạo đức và cách khuyến khích.',
  [[
    `<span class="eyebrow">MGT103 · Part 1 · Lesson 1.1</span>
<h2>Environment, culture, social responsibility &amp; ethics</h2>
<h3>How much do managers matter?</h3>
<p>The <strong>omnipotent view</strong> says managers are directly responsible for an organization's success or failure. The <strong>symbolic view</strong> says much of the outcome is due to forces outside their control. Reality lies in between: managers act within <strong>constraints</strong> set by the organization's culture and its environment.</p>
<h3>Organizational culture</h3>
<p>Culture is the shared values, principles, traditions and ways of doing things that influence how members act. It can be described along dimensions such as attention to detail, outcome orientation, people orientation, team orientation, aggressiveness, stability, and innovation and risk-taking. In a <strong>strong culture</strong> the key values are intensely held and widely shared — it guides behaviour powerfully but can resist change. Employees learn culture through <strong>stories, rituals, material symbols and language</strong>, and it shapes what managers plan, how they organize, lead and control.</p>
<h3>The external environment</h3>
<table>
<tr><th>Specific environment (direct impact)</th><th>General environment (broad conditions)</th></tr>
<tr><td>Customers, suppliers, competitors, pressure groups</td><td>Economic, demographic, political/legal, sociocultural, technological and global conditions</td></tr>
</table>
<p><strong>Environmental uncertainty</strong> depends on the degree of change (stable vs dynamic) and complexity (few vs many components). Managers also manage relationships with <strong>stakeholders</strong> — any group affected by the organization's decisions: employees, customers, shareholders, communities, governments.</p>
<h3>Social responsibility</h3>
<ul>
<li><strong>Classical view</strong> (Milton Friedman): management's only social responsibility is to maximize profits for shareholders, within the law.</li>
<li><strong>Socioeconomic view</strong>: managers are responsible to society at large — protecting and improving social welfare.</li>
</ul>
<p>Firms progress from <strong>social obligation</strong> (meeting legal and economic duties) to <strong>social responsiveness</strong> (adapting to changing social conditions) to <strong>social responsibility</strong> (pursuing long-term goals that are good for society). Today this includes <strong>sustainability</strong> — meeting business goals while protecting the environment.</p>
<h3>Managerial ethics</h3>
<p>Ethics are the principles that define right and wrong conduct. Three common views: <strong>utilitarian</strong> (the greatest good for the greatest number), <strong>rights</strong> (respect individual liberties) and <strong>justice</strong> (fair, impartial rules). Ethical behaviour is shaped by a person's moral development and values, by structural variables (rules, performance systems), by the organization's culture and by the intensity of the issue. Organizations encourage it through a clear <strong>code of ethics</strong>, ethical leadership from the top, training, realistic goals and protection for <strong>whistle-blowers</strong>.</p>
<div class="callout"><span class="badge">Example</span> A sales team rewarded only on volume, with no ethics training, is a structural invitation to mis-selling — the fix is in the system, not only in individuals.</div>`,
    `<span class="eyebrow">MGT103 · Phần 1 · Bài 1.1</span>
<h2>Môi trường, văn hoá, trách nhiệm xã hội &amp; đạo đức</h2>
<h3>Nhà quản trị quan trọng tới đâu?</h3>
<p><strong>Quan điểm toàn năng</strong> cho rằng nhà quản trị chịu trách nhiệm trực tiếp cho thành bại của tổ chức. <strong>Quan điểm biểu tượng</strong> cho rằng phần lớn kết quả do những lực nằm ngoài tầm kiểm soát của họ. Thực tế nằm ở giữa: nhà quản trị hành động trong những <strong>giới hạn</strong> do văn hoá tổ chức và môi trường đặt ra.</p>
<h3>Văn hoá tổ chức</h3>
<p>Văn hoá là các giá trị, nguyên tắc, truyền thống và cách làm việc được chia sẻ, ảnh hưởng tới hành động của các thành viên. Có thể mô tả văn hoá qua các chiều như chú trọng chi tiết, định hướng kết quả, định hướng con người, định hướng làm việc nhóm, tính quyết liệt, tính ổn định, và đổi mới – chấp nhận rủi ro. Trong <strong>văn hoá mạnh</strong>, các giá trị cốt lõi được giữ vững và chia sẻ rộng rãi — nó định hướng hành vi rất mạnh nhưng có thể cản trở thay đổi. Nhân viên học văn hoá qua <strong>câu chuyện, nghi thức, biểu tượng vật chất và ngôn ngữ</strong>, và văn hoá định hình việc nhà quản trị hoạch định gì, tổ chức, lãnh đạo, kiểm soát ra sao.</p>
<h3>Môi trường bên ngoài</h3>
<table>
<tr><th>Môi trường cụ thể (tác động trực tiếp)</th><th>Môi trường chung (điều kiện rộng)</th></tr>
<tr><td>Khách hàng, nhà cung cấp, đối thủ cạnh tranh, các nhóm gây áp lực</td><td>Điều kiện kinh tế, nhân khẩu học, chính trị – pháp luật, văn hoá – xã hội, công nghệ và toàn cầu</td></tr>
</table>
<p><strong>Mức bất định của môi trường</strong> phụ thuộc mức độ thay đổi (ổn định hay năng động) và mức độ phức tạp (ít hay nhiều thành phần). Nhà quản trị còn quản lý quan hệ với <strong>các bên liên quan</strong> — mọi nhóm chịu ảnh hưởng từ quyết định của tổ chức: nhân viên, khách hàng, cổ đông, cộng đồng, nhà nước.</p>
<h3>Trách nhiệm xã hội</h3>
<ul>
<li><strong>Quan điểm cổ điển</strong> (Milton Friedman): trách nhiệm xã hội duy nhất của nhà quản trị là tối đa hoá lợi nhuận cho cổ đông, trong khuôn khổ pháp luật.</li>
<li><strong>Quan điểm kinh tế – xã hội</strong>: nhà quản trị có trách nhiệm với xã hội nói chung — bảo vệ và nâng cao phúc lợi xã hội.</li>
</ul>
<p>Doanh nghiệp đi từ <strong>nghĩa vụ xã hội</strong> (làm tròn bổn phận pháp lý và kinh tế) tới <strong>đáp ứng xã hội</strong> (thích nghi với điều kiện xã hội thay đổi) rồi tới <strong>trách nhiệm xã hội</strong> (theo đuổi mục tiêu dài hạn có lợi cho xã hội). Ngày nay điều đó bao gồm <strong>phát triển bền vững</strong> — đạt mục tiêu kinh doanh đồng thời bảo vệ môi trường.</p>
<h3>Đạo đức trong quản trị</h3>
<p>Đạo đức là các nguyên tắc xác định hành vi đúng và sai. Ba quan điểm phổ biến: <strong>vị lợi</strong> (lợi ích lớn nhất cho nhiều người nhất), <strong>quyền</strong> (tôn trọng các quyền tự do cá nhân) và <strong>công bằng</strong> (quy tắc công bằng, không thiên vị). Hành vi đạo đức chịu ảnh hưởng của mức phát triển đạo đức và giá trị của mỗi người, các biến số cơ cấu (quy định, hệ thống đánh giá), văn hoá tổ chức và mức độ nghiêm trọng của vấn đề. Tổ chức khuyến khích hành vi đạo đức bằng <strong>bộ quy tắc đạo đức</strong> rõ ràng, lãnh đạo gương mẫu từ cấp cao, đào tạo, mục tiêu thực tế và bảo vệ <strong>người tố giác sai phạm</strong>.</p>
<div class="callout"><span class="badge">Ví dụ</span> Một đội bán hàng chỉ được thưởng theo doanh số, không được đào tạo về đạo đức, là "lời mời" mang tính cơ cấu cho việc bán hàng sai lệch — cách sửa nằm ở hệ thống, không chỉ ở từng cá nhân.</div>`,
  ]]);

const c1q = quiz('mgt103-quiz-1', 'Quiz 1 — Managers & their environment|||Quiz 1 — Nhà quản trị & môi trường', [
  { id: 'q1', question: 'Which skill does Katz consider MOST important for top managers?|||Theo Katz, kỹ năng nào QUAN TRỌNG NHẤT với nhà quản trị cấp cao?', options: ['Technical skills|||Kỹ năng kỹ thuật', 'Conceptual skills|||Kỹ năng tư duy khái quát', 'Typing skills|||Kỹ năng đánh máy', 'Selling skills|||Kỹ năng bán hàng'], correctIndex: 1, explanation: 'Top managers must see the organization as a whole and how its parts fit the environment.|||Nhà quản trị cấp cao phải nhìn tổ chức như một tổng thể và cách các bộ phận ăn khớp với môi trường.' },
  { id: 'q2', question: 'The view that management’s only social responsibility is to maximize profits within the law is the…|||Quan điểm cho rằng trách nhiệm xã hội duy nhất của nhà quản trị là tối đa hoá lợi nhuận trong khuôn khổ pháp luật là…', options: ['socioeconomic view|||quan điểm kinh tế – xã hội', 'classical view|||quan điểm cổ điển', 'symbolic view|||quan điểm biểu tượng', 'contingency view|||quan điểm tình huống'], correctIndex: 1, explanation: 'This is the classical view associated with Milton Friedman.|||Đây là quan điểm cổ điển gắn với Milton Friedman.' },
  { id: 'q3', question: 'A strong organizational culture is one in which…|||Văn hoá tổ chức mạnh là văn hoá mà trong đó…', options: ['there are many written rules|||có rất nhiều quy định thành văn', 'the key values are intensely held and widely shared|||các giá trị cốt lõi được giữ vững và chia sẻ rộng rãi', 'employees change jobs often|||nhân viên thường xuyên nhảy việc', 'the CEO makes every decision|||tổng giám đốc ra mọi quyết định'], correctIndex: 1, explanation: 'Strength comes from how deeply and widely values are shared, not from the number of rules.|||Sức mạnh đến từ mức độ chia sẻ sâu rộng của giá trị, không phải từ số lượng quy định.' },
]);

const c3 = doc('mgt103-2-1-decision-making', '2.1 — Decision making|||2.1 — Ra quyết định',
  'Quy trình 8 bước ra quyết định, mô hình duy lý, duy lý có giới hạn, trực giác và quản trị dựa trên bằng chứng, quyết định lập trình và không lập trình, điều kiện chắc chắn, rủi ro, bất định có ví dụ giá trị kỳ vọng, các thiên kiến và ra quyết định nhóm.',
  [[
    `<span class="eyebrow">MGT103 · Part 2 · Lesson 2.1</span>
<h2>Decision making</h2>
<h3>The eight-step process</h3>
<ol>
<li>Identify a problem — a gap between the current and the desired state.</li>
<li>Identify the decision criteria — what is relevant to the decision.</li>
<li>Allocate weights to the criteria.</li>
<li>Develop alternatives.</li>
<li>Analyse the alternatives against the weighted criteria.</li>
<li>Select an alternative.</li>
<li>Implement it.</li>
<li>Evaluate the decision's effectiveness.</li>
</ol>
<h3>How managers actually decide</h3>
<ul>
<li><strong>Rational model</strong> — fully informed, logical, maximizing. Rarely possible in practice.</li>
<li><strong>Bounded rationality</strong> (Herbert Simon) — limited information and time lead managers to <em>satisfice</em>: accept the first solution that is "good enough".</li>
<li><strong>Intuition</strong> — decisions based on experience, feelings and accumulated judgement.</li>
<li><strong>Evidence-based management</strong> — systematically using the best available evidence.</li>
</ul>
<h3>Types of problems and decisions</h3>
<p><strong>Structured</strong> problems (routine, clear — a customer returns a product) are handled by <strong>programmed decisions</strong>: a procedure, rule or policy. <strong>Unstructured</strong> problems (new, unusual — whether to enter a new market) need <strong>non-programmed</strong>, custom decisions. The higher the level, the more non-programmed decisions a manager faces.</p>
<h3>Certainty, risk and uncertainty</h3>
<p>Under <strong>certainty</strong> outcomes are known; under <strong>risk</strong> probabilities can be estimated; under <strong>uncertainty</strong> they cannot, and the choice depends on the decision maker's attitude (optimistic "maximax", pessimistic "maximin").</p>
<pre><code>Risk example — expected value (EV)
Option A: 60% chance of +500 profit, 40% chance of −100
          EV = 0.6 x 500 + 0.4 x (−100) = 300 − 40 = 260
Option B: a certain profit of 200            EV = 200
A risk-neutral manager chooses A; a very risk-averse one might still prefer B.</code></pre>
<h3>Biases and groups</h3>
<p>Common errors: <strong>overconfidence</strong>, <strong>anchoring</strong> on initial information, <strong>confirmation</strong> bias, the <strong>sunk-cost</strong> error and <strong>escalation of commitment</strong>, <strong>availability</strong> and <strong>framing</strong> effects. Groups bring more information and acceptance but take longer and risk <strong>groupthink</strong> — pressure to conform that silences dissent. Techniques such as brainstorming, the nominal group technique and electronic meetings help.</p>
<div class="callout"><span class="badge">Tip</span> Steps 2 and 3 — choosing criteria and their weights — often decide the outcome before any alternative is analysed. Make them explicit.</div>`,
    `<span class="eyebrow">MGT103 · Phần 2 · Bài 2.1</span>
<h2>Ra quyết định</h2>
<h3>Quy trình tám bước</h3>
<ol>
<li>Nhận diện vấn đề — khoảng cách giữa tình trạng hiện tại và tình trạng mong muốn.</li>
<li>Xác định tiêu chí ra quyết định — những gì liên quan tới quyết định.</li>
<li>Phân bổ trọng số cho các tiêu chí.</li>
<li>Xây dựng các phương án.</li>
<li>Phân tích các phương án theo tiêu chí có trọng số.</li>
<li>Chọn một phương án.</li>
<li>Thực hiện phương án.</li>
<li>Đánh giá hiệu quả của quyết định.</li>
</ol>
<h3>Nhà quản trị thực sự quyết định thế nào</h3>
<ul>
<li><strong>Mô hình duy lý</strong> — đầy đủ thông tin, logic, tối đa hoá. Hiếm khi làm được trong thực tế.</li>
<li><strong>Duy lý có giới hạn</strong> (Herbert Simon) — thông tin và thời gian hạn chế khiến nhà quản trị <em>chọn mức thoả mãn</em>: chấp nhận giải pháp đầu tiên "đủ tốt".</li>
<li><strong>Trực giác</strong> — quyết định dựa trên kinh nghiệm, cảm nhận và phán đoán tích luỹ.</li>
<li><strong>Quản trị dựa trên bằng chứng</strong> — dùng có hệ thống bằng chứng tốt nhất hiện có.</li>
</ul>
<h3>Các loại vấn đề và quyết định</h3>
<p>Vấn đề <strong>có cấu trúc</strong> (thường gặp, rõ ràng — khách hàng trả lại sản phẩm) được xử lý bằng <strong>quyết định được lập trình</strong>: một thủ tục, quy tắc hay chính sách. Vấn đề <strong>không có cấu trúc</strong> (mới, bất thường — có nên vào thị trường mới không) cần quyết định <strong>không lập trình</strong>, được thiết kế riêng. Cấp quản trị càng cao, càng gặp nhiều quyết định không lập trình.</p>
<h3>Chắc chắn, rủi ro và bất định</h3>
<p>Trong điều kiện <strong>chắc chắn</strong>, kết quả đã biết; <strong>rủi ro</strong> là khi ước lượng được xác suất; <strong>bất định</strong> là khi không ước lượng được, và lựa chọn phụ thuộc thái độ người quyết định (lạc quan "maximax", bi quan "maximin").</p>
<pre><code>Ví dụ rủi ro — giá trị kỳ vọng (EV)
Phương án A: 60% khả năng lãi +500, 40% khả năng lỗ −100
             EV = 0,6 x 500 + 0,4 x (−100) = 300 − 40 = 260
Phương án B: chắc chắn lãi 200                EV = 200
Nhà quản trị trung lập với rủi ro chọn A; người rất ngại rủi ro có thể vẫn chọn B.</code></pre>
<h3>Thiên kiến và quyết định nhóm</h3>
<p>Sai lầm hay gặp: <strong>quá tự tin</strong>, <strong>thả neo</strong> vào thông tin ban đầu, thiên kiến <strong>xác nhận</strong>, sai lầm <strong>chi phí chìm</strong> và <strong>leo thang cam kết</strong>, hiệu ứng <strong>sẵn có</strong> và <strong>đóng khung</strong>. Nhóm mang lại nhiều thông tin và sự đồng thuận hơn nhưng tốn thời gian và dễ rơi vào <strong>tư duy nhóm</strong> — áp lực phải đồng thuận khiến ý kiến trái chiều im lặng. Các kỹ thuật như động não, nhóm danh nghĩa và họp trực tuyến giúp hạn chế điều này.</p>
<div class="callout"><span class="badge">Mẹo</span> Bước 2 và 3 — chọn tiêu chí và trọng số — thường đã quyết định kết quả trước khi phân tích phương án nào. Hãy viết chúng ra rõ ràng.</div>`,
  ]]);

const c4 = doc('mgt103-2-2-planning-strategy', '2.2 — Planning & strategic management|||2.2 — Hoạch định & quản trị chiến lược',
  'Vì sao phải hoạch định, các loại mục tiêu và kế hoạch, quản trị theo mục tiêu (MBO) và mục tiêu SMART, quy trình quản trị chiến lược 6 bước, phân tích SWOT, chiến lược cấp công ty (tăng trưởng, ổn định, đổi mới, ma trận BCG), chiến lược cạnh tranh của Porter và năm lực lượng.',
  [[
    `<span class="eyebrow">MGT103 · Part 2 · Lesson 2.2</span>
<h2>Planning &amp; strategic management</h2>
<h3>Goals and plans</h3>
<p>Planning gives direction, reduces uncertainty, minimizes waste and sets the standards used in controlling. <strong>Goals</strong> are desired outcomes; <strong>plans</strong> describe how goals will be met. Plans can be <strong>strategic</strong> (the whole organization) or <strong>operational</strong> (one area), long- or short-term, <strong>specific</strong> or <strong>directional</strong>, <strong>single-use</strong> or <strong>standing</strong> (policies, rules, procedures).</p>
<p>In <strong>management by objectives (MBO)</strong>, managers and employees set specific goals together, agree a time period and review progress with feedback. Well-written goals are <strong>SMART</strong>: Specific, Measurable, Achievable, Relevant, Time-bound — "raise repeat purchases from 30% to 40% by December" rather than "sell more".</p>
<h3>The strategic management process</h3>
<ol>
<li>Identify the current mission, goals and strategies.</li>
<li>Do an <strong>external analysis</strong> — opportunities and threats.</li>
<li>Do an <strong>internal analysis</strong> — strengths and weaknesses, resources, capabilities and <em>core competencies</em>.</li>
<li>Formulate strategies.</li>
<li>Implement strategies.</li>
<li>Evaluate results.</li>
</ol>
<p>Steps 2 and 3 together form a <strong>SWOT analysis</strong>: match internal Strengths and Weaknesses with external Opportunities and Threats.</p>
<h3>Three levels of strategy</h3>
<table>
<tr><th>Level</th><th>Question</th><th>Options</th></tr>
<tr><td>Corporate</td><td>Which businesses should we be in?</td><td><strong>Growth</strong> (concentration, vertical integration, horizontal integration, related or unrelated diversification), <strong>stability</strong>, <strong>renewal</strong> (retrenchment, turnaround). The <strong>BCG matrix</strong> sorts businesses by market share and market growth into stars, cash cows, question marks and dogs</td></tr>
<tr><td>Competitive (business)</td><td>How do we compete in this business?</td><td>Michael Porter: <strong>cost leadership</strong>, <strong>differentiation</strong> or <strong>focus</strong> on a narrow segment. Industry attractiveness is shaped by <strong>five forces</strong>: new entrants, substitutes, buyer power, supplier power and rivalry</td></tr>
<tr><td>Functional</td><td>How does each department support the strategy?</td><td>Marketing, operations, HR and finance plans</td></tr>
</table>
<div class="callout"><span class="badge">Watch out</span> A firm "stuck in the middle" — neither the cheapest nor clearly different — usually earns below-average profits.</div>`,
    `<span class="eyebrow">MGT103 · Phần 2 · Bài 2.2</span>
<h2>Hoạch định &amp; quản trị chiến lược</h2>
<h3>Mục tiêu và kế hoạch</h3>
<p>Hoạch định cho tổ chức phương hướng, giảm bất định, hạn chế lãng phí và đặt ra các tiêu chuẩn dùng trong kiểm soát. <strong>Mục tiêu</strong> là kết quả mong muốn; <strong>kế hoạch</strong> mô tả cách đạt mục tiêu. Kế hoạch có thể là <strong>chiến lược</strong> (toàn tổ chức) hoặc <strong>tác nghiệp</strong> (một bộ phận), dài hạn hoặc ngắn hạn, <strong>cụ thể</strong> hoặc <strong>định hướng</strong>, <strong>dùng một lần</strong> hoặc <strong>thường trực</strong> (chính sách, quy tắc, thủ tục).</p>
<p>Với <strong>quản trị theo mục tiêu (MBO)</strong>, nhà quản trị và nhân viên cùng đặt mục tiêu cụ thể, thống nhất thời hạn và rà soát tiến độ kèm phản hồi. Mục tiêu được viết tốt là mục tiêu <strong>SMART</strong>: Cụ thể, Đo lường được, Khả thi, Phù hợp, Có thời hạn — "tăng tỷ lệ khách mua lại từ 30% lên 40% trước tháng 12" thay vì "bán nhiều hơn".</p>
<h3>Quy trình quản trị chiến lược</h3>
<ol>
<li>Xác định sứ mệnh, mục tiêu và chiến lược hiện tại.</li>
<li><strong>Phân tích bên ngoài</strong> — cơ hội và thách thức.</li>
<li><strong>Phân tích bên trong</strong> — điểm mạnh và điểm yếu, nguồn lực, năng lực và <em>năng lực cốt lõi</em>.</li>
<li>Xây dựng chiến lược.</li>
<li>Thực hiện chiến lược.</li>
<li>Đánh giá kết quả.</li>
</ol>
<p>Bước 2 và 3 hợp lại thành <strong>phân tích SWOT</strong>: đối chiếu Điểm mạnh, Điểm yếu bên trong với Cơ hội, Thách thức bên ngoài.</p>
<h3>Ba cấp chiến lược</h3>
<table>
<tr><th>Cấp</th><th>Câu hỏi</th><th>Lựa chọn</th></tr>
<tr><td>Công ty</td><td>Nên kinh doanh những lĩnh vực nào?</td><td><strong>Tăng trưởng</strong> (tập trung, hội nhập dọc, hội nhập ngang, đa dạng hoá liên quan hoặc không liên quan), <strong>ổn định</strong>, <strong>đổi mới</strong> (thu hẹp, xoay chuyển). <strong>Ma trận BCG</strong> xếp các đơn vị kinh doanh theo thị phần và tốc độ tăng trưởng thị trường thành ngôi sao, bò sữa, dấu hỏi và con chó</td></tr>
<tr><td>Cạnh tranh (đơn vị kinh doanh)</td><td>Cạnh tranh thế nào trong lĩnh vực này?</td><td>Michael Porter: <strong>dẫn đầu chi phí</strong>, <strong>khác biệt hoá</strong> hoặc <strong>tập trung</strong> vào một phân khúc hẹp. Sức hấp dẫn của ngành do <strong>năm lực lượng</strong> quyết định: đối thủ tiềm ẩn, sản phẩm thay thế, quyền lực người mua, quyền lực nhà cung cấp và cạnh tranh nội bộ ngành</td></tr>
<tr><td>Chức năng</td><td>Mỗi bộ phận hỗ trợ chiến lược thế nào?</td><td>Kế hoạch marketing, vận hành, nhân sự và tài chính</td></tr>
</table>
<div class="callout"><span class="badge">Cẩn thận</span> Doanh nghiệp "kẹt ở giữa" — không rẻ nhất mà cũng không khác biệt rõ ràng — thường có lợi nhuận dưới mức trung bình.</div>`,
  ]]);

const c4e = doc('mgt103-2-3-exercise', 'Exercise 1 — SWOT, SMART goals & a weighted decision|||Bài tập 1 — SWOT, mục tiêu SMART & quyết định có trọng số',
  'Bài tập tình huống: chuỗi trà sữa muốn mở cửa hàng mới — lập SWOT, viết hai mục tiêu SMART, chấm ba địa điểm bằng ma trận quyết định có trọng số và kiểm tra độ nhạy khi đổi trọng số; kèm lời giải.',
  [[
    `<span class="eyebrow">MGT103 · Part 2 · Exercise</span>
<h2>Exercise 1 — a bubble-tea chain chooses its next store</h2>
<div class="callout"><span class="badge">Problem</span> A small bubble-tea chain (a fictional case) has loyal student customers and its own recipes, but little capital and depends on a single milk supplier. A new university campus is opening nearby and delivery apps are growing; meanwhile many new competitors have appeared and milk prices are rising. (a) Build a SWOT. (b) Write two SMART goals. (c) Choose a location using the criteria foot traffic (weight 0.4), rent (0.3, cheaper scores higher) and competition (0.3, less competition scores higher). Scores out of 10 — A near the campus: 9, 5, 4; B on a residential street: 6, 8, 7; C in a shopping mall: 8, 3, 5. (d) Recompute with weights 0.6 / 0.2 / 0.2.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) SWOT
    Strengths:     loyal student customers; own recipes
    Weaknesses:    little capital; a single milk supplier
    Opportunities: new campus nearby; growth of delivery apps
    Threats:       many new competitors; rising milk prices

(b) SMART goals
    - Open one new store and reach 300 cups a day within 6 months of opening.
    - Sign a contract with a second milk supplier by the end of this quarter.

(c) Weighted scores (0.4 traffic, 0.3 rent, 0.3 competition)
    A = 0.4x9 + 0.3x5 + 0.3x4 = 3.6 + 1.5 + 1.2 = 6.3
    B = 0.4x6 + 0.3x8 + 0.3x7 = 2.4 + 2.4 + 2.1 = 6.9   <- best
    C = 0.4x8 + 0.3x3 + 0.3x5 = 3.2 + 0.9 + 1.5 = 5.6

(d) Weights 0.6 / 0.2 / 0.2
    A = 5.4 + 1.0 + 0.8 = 7.2   <- best
    B = 3.6 + 1.6 + 1.4 = 6.6
    C = 4.8 + 0.6 + 1.0 = 6.4</code></pre>
<p><strong>Why:</strong> the ranking flips when traffic is weighted more heavily. That is the lesson of steps 2–3 of the decision process: the weights carry the strategy. A cash-poor chain (weakness: little capital) can justify a high weight on rent, which points to B; a chain chasing the new campus opportunity would weight traffic and choose A. The SWOT and the weights must tell the same story.</p>`,
    `<span class="eyebrow">MGT103 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — chuỗi trà sữa chọn cửa hàng tiếp theo</h2>
<div class="callout"><span class="badge">Đề</span> Một chuỗi trà sữa nhỏ (tình huống giả định) có khách hàng sinh viên trung thành và công thức riêng, nhưng ít vốn và phụ thuộc một nhà cung cấp sữa duy nhất. Một khuôn viên đại học mới sắp mở gần đó và ứng dụng giao đồ ăn đang phát triển; trong khi nhiều đối thủ mới xuất hiện và giá sữa đang tăng. (a) Lập SWOT. (b) Viết hai mục tiêu SMART. (c) Chọn địa điểm theo tiêu chí lượng người qua lại (trọng số 0,4), tiền thuê (0,3, rẻ hơn điểm cao hơn) và mức cạnh tranh (0,3, ít cạnh tranh điểm cao hơn). Điểm trên thang 10 — A gần khuôn viên đại học: 9, 5, 4; B trên phố dân cư: 6, 8, 7; C trong trung tâm thương mại: 8, 3, 5. (d) Tính lại với trọng số 0,6 / 0,2 / 0,2.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) SWOT
    Điểm mạnh:   khách sinh viên trung thành; công thức riêng
    Điểm yếu:    ít vốn; chỉ một nhà cung cấp sữa
    Cơ hội:      khuôn viên đại học mới gần đó; ứng dụng giao hàng phát triển
    Thách thức:  nhiều đối thủ mới; giá sữa tăng

(b) Mục tiêu SMART
    - Mở một cửa hàng mới và đạt 300 ly mỗi ngày trong vòng 6 tháng sau khai trương.
    - Ký hợp đồng với nhà cung cấp sữa thứ hai trước khi hết quý này.

(c) Điểm có trọng số (0,4 lượng khách, 0,3 tiền thuê, 0,3 cạnh tranh)
    A = 0,4x9 + 0,3x5 + 0,3x4 = 3,6 + 1,5 + 1,2 = 6,3
    B = 0,4x6 + 0,3x8 + 0,3x7 = 2,4 + 2,4 + 2,1 = 6,9   <- tốt nhất
    C = 0,4x8 + 0,3x3 + 0,3x5 = 3,2 + 0,9 + 1,5 = 5,6

(d) Trọng số 0,6 / 0,2 / 0,2
    A = 5,4 + 1,0 + 0,8 = 7,2   <- tốt nhất
    B = 3,6 + 1,6 + 1,4 = 6,6
    C = 4,8 + 0,6 + 1,0 = 6,4</code></pre>
<p><strong>Vì sao:</strong> thứ hạng đảo ngược khi lượng khách được coi trọng hơn. Đó chính là bài học của bước 2–3 trong quy trình ra quyết định: trọng số mang theo chiến lược. Một chuỗi ít vốn (điểm yếu: ít vốn) có lý do đặt trọng số cao cho tiền thuê, dẫn tới B; một chuỗi muốn đón cơ hội từ khuôn viên mới sẽ đặt trọng số cao cho lượng khách và chọn A. SWOT và trọng số phải kể cùng một câu chuyện.</p>`,
  ]]);

const c4q = quiz('mgt103-quiz-2', 'Quiz 2 — Planning & decisions|||Quiz 2 — Hoạch định & quyết định', [
  { id: 'q1', question: 'Bounded rationality means that managers…|||Duy lý có giới hạn nghĩa là nhà quản trị…', options: ['always find the optimal solution|||luôn tìm được giải pháp tối ưu', 'decide rationally but within limits of information and time, often satisficing|||quyết định duy lý nhưng trong giới hạn thông tin và thời gian, thường chọn mức thoả mãn', 'decide only by intuition|||chỉ quyết định bằng trực giác', 'never use data|||không bao giờ dùng dữ liệu'], correctIndex: 1, explanation: 'Herbert Simon: limited information and capacity lead managers to accept a “good enough” solution.|||Herbert Simon: thông tin và năng lực hạn chế khiến nhà quản trị chấp nhận giải pháp “đủ tốt”.' },
  { id: 'q2', question: 'A SWOT analysis combines…|||Phân tích SWOT kết hợp…', options: ['internal strengths and weaknesses with external opportunities and threats|||điểm mạnh, điểm yếu bên trong với cơ hội, thách thức bên ngoài', 'only the competitors’ strengths|||chỉ điểm mạnh của đối thủ', 'financial ratios only|||chỉ các chỉ số tài chính', 'the four management functions|||bốn chức năng quản trị'], correctIndex: 0, explanation: 'S and W come from the internal analysis; O and T from the external analysis.|||S và W đến từ phân tích bên trong; O và T từ phân tích bên ngoài.' },
  { id: 'q3', question: 'In Porter’s framework, a cost leadership strategy means…|||Theo Porter, chiến lược dẫn đầu chi phí nghĩa là…', options: ['charging the highest price|||đặt giá cao nhất', 'becoming the lowest-cost producer in the industry|||trở thành nhà sản xuất có chi phí thấp nhất ngành', 'serving only one small niche|||chỉ phục vụ một ngách nhỏ', 'offering the most unique product|||cung cấp sản phẩm độc đáo nhất'], correctIndex: 1, explanation: 'Cost leaders compete on efficiency and scale; differentiators compete on uniqueness.|||Người dẫn đầu chi phí cạnh tranh bằng hiệu suất và quy mô; người khác biệt hoá cạnh tranh bằng sự độc đáo.' },
]);

const c5 = doc('mgt103-3-1-organizing', '3.1 — Organizational structure & design|||3.1 — Cơ cấu & thiết kế tổ chức',
  'Sáu yếu tố của cơ cấu (chuyên môn hoá, bộ phận hoá, chuỗi mệnh lệnh, tầm hạn quản trị có ví dụ số, tập trung và phân quyền, chính thức hoá), tổ chức cơ học và hữu cơ, các yếu tố tình huống, các mô hình cơ cấu truyền thống và hiện đại.',
  [[
    `<span class="eyebrow">MGT103 · Part 3 · Lesson 3.1</span>
<h2>Organizational structure &amp; design</h2>
<h3>Six elements of structure</h3>
<table>
<tr><th>Element</th><th>Key question</th></tr>
<tr><td>Work specialization</td><td>How far are tasks divided into separate jobs?</td></tr>
<tr><td>Departmentalization</td><td>How are jobs grouped — by function, product, geography, process or customer?</td></tr>
<tr><td>Chain of command</td><td>Who reports to whom? (authority, responsibility, <strong>unity of command</strong> — one boss per person)</td></tr>
<tr><td>Span of control</td><td>How many people can a manager direct effectively?</td></tr>
<tr><td>Centralization vs decentralization</td><td>Where are decisions made — at the top or close to the action?</td></tr>
<tr><td>Formalization</td><td>How standardized are jobs and how many rules guide behaviour?</td></tr>
</table>
<pre><code>Span of control and the number of managers — 1,000 front-line employees
Span 10:  1,000 / 10 = 100 -> 10 -> 1              = 111 managers, 3 levels
Span 5:   1,000 / 5 = 200 -> 40 -> 8 -> 2 -> 1     = 251 managers, 5 levels
          (8 / 5 = 1.6 is rounded up to 2 managers)</code></pre>
<p>Wider spans mean fewer managers and levels — cheaper and faster communication — but only work when employees are skilled, tasks are similar and managers have good systems.</p>
<h3>Mechanistic vs organic organizations</h3>
<table>
<tr><th>Mechanistic</th><th>Organic</th></tr>
<tr><td>High specialization, rigid departments</td><td>Cross-functional teams</td></tr>
<tr><td>Clear chain of command, narrow spans</td><td>Free flow of information, wide spans</td></tr>
<tr><td>Centralized, high formalization</td><td>Decentralized, low formalization</td></tr>
</table>
<p>Which fits depends on <strong>contingency factors</strong>: an innovation strategy, a dynamic environment and small size favour organic designs; a cost-minimization strategy, a stable environment and large size favour mechanistic ones; and technology matters (Joan Woodward found that unit, mass and process production each fit different structures).</p>
<h3>Common designs</h3>
<ul>
<li><strong>Simple structure</strong> — few departments, centralized in the owner; typical of start-ups.</li>
<li><strong>Functional structure</strong> — groups similar specialties (marketing, finance, production); efficient but can create silos.</li>
<li><strong>Divisional structure</strong> — separate units by product or region, each with its own functions; focuses on results but duplicates resources.</li>
<li><strong>Team, matrix and project structures</strong> — in a <strong>matrix</strong>, specialists from functional departments work on projects and report to <em>two</em> managers, breaking unity of command.</li>
<li><strong>Boundaryless designs</strong> — virtual and network organizations that outsource much of their work; <strong>learning organizations</strong> that continuously adapt.</li>
</ul>
<div class="callout"><span class="badge">Remember</span> Structure follows strategy: design the organization to support what it is trying to achieve.</div>`,
    `<span class="eyebrow">MGT103 · Phần 3 · Bài 3.1</span>
<h2>Cơ cấu &amp; thiết kế tổ chức</h2>
<h3>Sáu yếu tố của cơ cấu</h3>
<table>
<tr><th>Yếu tố</th><th>Câu hỏi then chốt</th></tr>
<tr><td>Chuyên môn hoá công việc</td><td>Nhiệm vụ được chia nhỏ thành các công việc riêng tới mức nào?</td></tr>
<tr><td>Bộ phận hoá</td><td>Công việc được nhóm lại thế nào — theo chức năng, sản phẩm, địa lý, quy trình hay khách hàng?</td></tr>
<tr><td>Chuỗi mệnh lệnh</td><td>Ai báo cáo cho ai? (quyền hạn, trách nhiệm, <strong>thống nhất chỉ huy</strong> — mỗi người một cấp trên)</td></tr>
<tr><td>Tầm hạn quản trị</td><td>Một nhà quản trị điều hành hiệu quả được bao nhiêu người?</td></tr>
<tr><td>Tập trung và phân quyền</td><td>Quyết định được đưa ra ở đâu — trên đỉnh hay gần nơi diễn ra công việc?</td></tr>
<tr><td>Chính thức hoá</td><td>Công việc được chuẩn hoá tới đâu và có bao nhiêu quy định chi phối hành vi?</td></tr>
</table>
<pre><code>Tầm hạn quản trị và số nhà quản trị — 1.000 nhân viên tuyến đầu
Tầm hạn 10:  1.000 / 10 = 100 -> 10 -> 1              = 111 nhà quản trị, 3 cấp
Tầm hạn 5:   1.000 / 5 = 200 -> 40 -> 8 -> 2 -> 1     = 251 nhà quản trị, 5 cấp
             (8 / 5 = 1,6 làm tròn lên thành 2 nhà quản trị)</code></pre>
<p>Tầm hạn rộng nghĩa là ít nhà quản trị và ít cấp hơn — rẻ hơn và thông tin đi nhanh hơn — nhưng chỉ hiệu quả khi nhân viên có kỹ năng, công việc tương tự nhau và nhà quản trị có hệ thống tốt.</p>
<h3>Tổ chức cơ học và tổ chức hữu cơ</h3>
<table>
<tr><th>Cơ học</th><th>Hữu cơ</th></tr>
<tr><td>Chuyên môn hoá cao, bộ phận cứng nhắc</td><td>Nhóm liên chức năng</td></tr>
<tr><td>Chuỗi mệnh lệnh rõ ràng, tầm hạn hẹp</td><td>Thông tin lưu chuyển tự do, tầm hạn rộng</td></tr>
<tr><td>Tập trung quyền lực, chính thức hoá cao</td><td>Phân quyền, chính thức hoá thấp</td></tr>
</table>
<p>Mô hình nào phù hợp phụ thuộc vào <strong>các yếu tố tình huống</strong>: chiến lược đổi mới, môi trường năng động và quy mô nhỏ hợp với thiết kế hữu cơ; chiến lược tối thiểu hoá chi phí, môi trường ổn định và quy mô lớn hợp với thiết kế cơ học; công nghệ cũng quan trọng (Joan Woodward nhận thấy sản xuất đơn chiếc, hàng loạt và theo dây chuyền liên tục mỗi loại hợp một kiểu cơ cấu).</p>
<h3>Các mô hình phổ biến</h3>
<ul>
<li><strong>Cơ cấu giản đơn</strong> — ít bộ phận, quyền lực tập trung ở chủ doanh nghiệp; điển hình ở doanh nghiệp khởi nghiệp.</li>
<li><strong>Cơ cấu chức năng</strong> — nhóm các chuyên môn giống nhau (marketing, tài chính, sản xuất); hiệu suất cao nhưng dễ tạo "ốc đảo".</li>
<li><strong>Cơ cấu theo bộ phận (division)</strong> — các đơn vị riêng theo sản phẩm hoặc khu vực, mỗi đơn vị có đủ chức năng; chú trọng kết quả nhưng trùng lặp nguồn lực.</li>
<li><strong>Cơ cấu nhóm, ma trận và dự án</strong> — trong <strong>ma trận</strong>, chuyên gia từ các phòng chức năng làm việc ở dự án và báo cáo cho <em>hai</em> nhà quản trị, phá vỡ nguyên tắc thống nhất chỉ huy.</li>
<li><strong>Thiết kế không biên giới</strong> — tổ chức ảo và tổ chức mạng lưới thuê ngoài nhiều phần việc; <strong>tổ chức học tập</strong> liên tục thích nghi.</li>
</ul>
<div class="callout"><span class="badge">Ghi nhớ</span> Cơ cấu đi theo chiến lược: thiết kế tổ chức để phục vụ điều tổ chức đang muốn đạt được.</div>`,
  ]]);

const c5q = quiz('mgt103-quiz-3', 'Quiz 3 — Organizing|||Quiz 3 — Tổ chức', [
  { id: 'q1', question: 'The principle of unity of command states that…|||Nguyên tắc thống nhất chỉ huy phát biểu rằng…', options: ['all decisions are made by the CEO|||mọi quyết định do tổng giám đốc đưa ra', 'each employee should report to only one manager|||mỗi nhân viên chỉ nên báo cáo cho một nhà quản trị', 'teams must vote on decisions|||các nhóm phải biểu quyết mọi quyết định', 'managers supervise at most five people|||nhà quản trị giám sát tối đa năm người'], correctIndex: 1, explanation: 'Unity of command avoids conflicting orders; the matrix structure deliberately breaks it.|||Thống nhất chỉ huy tránh mệnh lệnh mâu thuẫn; cơ cấu ma trận chủ ý phá vỡ nguyên tắc này.' },
  { id: 'q2', question: 'An organic structure fits best with…|||Cơ cấu hữu cơ phù hợp nhất với…', options: ['a stable environment and a cost-minimization strategy|||môi trường ổn định và chiến lược tối thiểu hoá chi phí', 'a dynamic environment and an innovation strategy|||môi trường năng động và chiến lược đổi mới', 'very high formalization|||mức chính thức hoá rất cao', 'a very large, routine operation|||một hoạt động rất lớn, lặp đi lặp lại'], correctIndex: 1, explanation: 'Flexible, decentralized structures adapt quickly to change and support innovation.|||Cơ cấu linh hoạt, phân quyền thích nghi nhanh với thay đổi và hỗ trợ đổi mới.' },
  { id: 'q3', question: 'In a matrix structure, employees typically…|||Trong cơ cấu ma trận, nhân viên thường…', options: ['report to two managers: functional and project|||báo cáo cho hai nhà quản trị: chức năng và dự án', 'work alone without a manager|||làm việc một mình không có quản lý', 'belong only to one product division|||chỉ thuộc một bộ phận sản phẩm', 'have no job descriptions|||không có mô tả công việc'], correctIndex: 0, explanation: 'Matrix designs combine functional expertise with project focus, at the cost of dual reporting.|||Ma trận kết hợp chuyên môn chức năng với trọng tâm dự án, đổi lại là báo cáo hai chiều.' },
]);

const c6 = doc('mgt103-4-1-motivation', '4.1 — Motivating employees|||4.1 — Động viên nhân viên',
  'Định nghĩa động lực (năng lượng, định hướng, bền bỉ), các thuyết kinh điển (Maslow, thuyết X và Y, Herzberg hai nhân tố, McClelland ba nhu cầu) và hiện đại (thiết lập mục tiêu, thiết kế công việc, công bằng, kỳ vọng Vroom có ví dụ E × I × V).',
  [[
    `<span class="eyebrow">MGT103 · Part 4 · Lesson 4.1</span>
<h2>Motivating employees</h2>
<p><strong>Motivation</strong> is the process by which a person's efforts are <em>energized</em>, <em>directed</em> and <em>sustained</em> toward attaining a goal. High effort alone is not enough — it must point toward organizational goals and persist.</p>
<h3>Early theories</h3>
<table>
<tr><th>Theory</th><th>Core idea</th></tr>
<tr><td>Maslow's hierarchy of needs</td><td>Physiological → safety → social → esteem → self-actualization; a satisfied need no longer motivates, so managers address the next level up</td></tr>
<tr><td>McGregor's Theory X and Theory Y</td><td>Theory X assumes people dislike work and must be controlled; Theory Y assumes they can enjoy work, accept responsibility and self-direct</td></tr>
<tr><td>Herzberg's two-factor theory</td><td><strong>Hygiene factors</strong> (pay, supervision, company policy, working conditions) only remove dissatisfaction; <strong>motivators</strong> (achievement, recognition, the work itself, responsibility, growth) create satisfaction</td></tr>
<tr><td>McClelland's three needs</td><td>Need for achievement, need for power, need for affiliation — people differ in which dominates</td></tr>
</table>
<h3>Contemporary theories</h3>
<ul>
<li><strong>Goal-setting theory</strong> — specific, difficult goals that are accepted, with feedback, produce higher performance than "do your best".</li>
<li><strong>Job design</strong> — the job characteristics model: skill variety, task identity, task significance, autonomy and feedback make work more motivating.</li>
<li><strong>Equity theory</strong> — people compare their outcome/input ratio with others'; perceived unfairness leads them to change effort, change their perceptions, change the comparison person, or leave.</li>
<li><strong>Expectancy theory</strong> (Victor Vroom) — motivation depends on three beliefs: <strong>expectancy</strong> (effort → performance), <strong>instrumentality</strong> (performance → reward) and <strong>valence</strong> (how much the reward is valued).</li>
</ul>
<pre><code>Motivational force ≈ Expectancy x Instrumentality x Valence   (each 0 to 1)
Before: E = 0.8, I = 0.3 (bonus not linked to results), V = 0.9  ->  0.216
After linking the bonus to results, I = 0.8                     ->  0.576
Because it is a product, one weak link pulls the whole score down.</code></pre>
<div class="callout"><span class="badge">For managers</span> Recognize individual differences, match people to jobs, use specific goals, make rewards contingent on performance, and check the system for fairness.</div>`,
    `<span class="eyebrow">MGT103 · Phần 4 · Bài 4.1</span>
<h2>Động viên nhân viên</h2>
<p><strong>Động lực</strong> là quá trình nỗ lực của một người được <em>khơi dậy</em>, <em>định hướng</em> và <em>duy trì</em> để đạt mục tiêu. Chỉ nỗ lực nhiều thôi chưa đủ — nỗ lực phải hướng tới mục tiêu của tổ chức và bền bỉ.</p>
<h3>Các thuyết kinh điển</h3>
<table>
<tr><th>Thuyết</th><th>Ý chính</th></tr>
<tr><td>Tháp nhu cầu Maslow</td><td>Sinh lý → an toàn → xã hội → được tôn trọng → tự thể hiện; nhu cầu đã được thoả mãn không còn tạo động lực, nên nhà quản trị hướng vào bậc kế tiếp</td></tr>
<tr><td>Thuyết X và thuyết Y của McGregor</td><td>Thuyết X giả định con người không thích làm việc và phải bị kiểm soát; thuyết Y giả định họ có thể thích làm việc, nhận trách nhiệm và tự định hướng</td></tr>
<tr><td>Thuyết hai nhân tố của Herzberg</td><td><strong>Nhân tố duy trì</strong> (lương, sự giám sát, chính sách công ty, điều kiện làm việc) chỉ xoá bỏ sự bất mãn; <strong>nhân tố động viên</strong> (thành tích, sự công nhận, bản thân công việc, trách nhiệm, phát triển) mới tạo ra sự thoả mãn</td></tr>
<tr><td>Thuyết ba nhu cầu của McClelland</td><td>Nhu cầu thành tích, nhu cầu quyền lực, nhu cầu liên kết — mỗi người có một nhu cầu nổi trội khác nhau</td></tr>
</table>
<h3>Các thuyết hiện đại</h3>
<ul>
<li><strong>Thuyết thiết lập mục tiêu</strong> — mục tiêu cụ thể, thách thức, được chấp nhận, kèm phản hồi, cho kết quả cao hơn lời dặn "cố gắng hết sức".</li>
<li><strong>Thiết kế công việc</strong> — mô hình đặc điểm công việc: đa dạng kỹ năng, tính trọn vẹn của nhiệm vụ, tầm quan trọng của nhiệm vụ, quyền tự chủ và phản hồi làm công việc có sức động viên hơn.</li>
<li><strong>Thuyết công bằng</strong> — người ta so sánh tỷ lệ kết quả/đóng góp của mình với người khác; cảm thấy bất công sẽ khiến họ thay đổi nỗ lực, thay đổi nhận thức, đổi người để so sánh, hoặc rời đi.</li>
<li><strong>Thuyết kỳ vọng</strong> (Victor Vroom) — động lực phụ thuộc ba niềm tin: <strong>kỳ vọng</strong> (nỗ lực → kết quả), <strong>tính công cụ</strong> (kết quả → phần thưởng) và <strong>hoá trị</strong> (phần thưởng được coi trọng tới đâu).</li>
</ul>
<pre><code>Sức mạnh động lực ≈ Kỳ vọng x Tính công cụ x Hoá trị   (mỗi thành phần từ 0 tới 1)
Trước: E = 0,8, I = 0,3 (thưởng không gắn với kết quả), V = 0,9  ->  0,216
Sau khi gắn thưởng với kết quả, I = 0,8                          ->  0,576
Vì là phép nhân, chỉ một mắt xích yếu cũng kéo cả điểm số xuống.</code></pre>
<div class="callout"><span class="badge">Cho nhà quản trị</span> Nhận biết khác biệt cá nhân, bố trí người hợp việc, dùng mục tiêu cụ thể, gắn phần thưởng với kết quả, và kiểm tra tính công bằng của hệ thống.</div>`,
  ]]);

const c7 = doc('mgt103-4-2-leadership-communication', '4.2 — Leadership & communication|||4.2 — Lãnh đạo & giao tiếp',
  'Lãnh đạo là gì, lý thuyết đặc điểm, lý thuyết hành vi (Iowa, Ohio State, Michigan, lưới quản trị), lý thuyết tình huống (Fiedler, Hersey–Blanchard, đường dẫn – mục tiêu), lãnh đạo giao dịch và chuyển đổi, quá trình giao tiếp và rào cản.',
  [[
    `<span class="eyebrow">MGT103 · Part 4 · Lesson 4.2</span>
<h2>Leadership &amp; communication</h2>
<p><strong>Leadership</strong> is the process of influencing a group toward achieving goals. Managers are appointed and have formal authority; leaders can emerge from within a group. Ideally, all managers should also be leaders.</p>
<h3>Trait and behavioural theories</h3>
<p><strong>Trait theories</strong> looked for traits that separate leaders from non-leaders: drive, desire to lead, honesty and integrity, self-confidence, intelligence, job-relevant knowledge, extraversion. Traits help, but they cannot explain leadership on their own. <strong>Behavioural theories</strong> studied what effective leaders <em>do</em>:</p>
<ul>
<li><strong>University of Iowa</strong> (Kurt Lewin): autocratic, democratic and laissez-faire styles.</li>
<li><strong>Ohio State</strong>: <em>initiating structure</em> (organizing tasks) and <em>consideration</em> (caring for people); "high–high" often, but not always, worked best.</li>
<li><strong>University of Michigan</strong>: employee-oriented vs production-oriented leaders.</li>
<li><strong>Managerial grid</strong> (Blake and Mouton): concern for people × concern for production; "team management" (9,9) is presented as the ideal.</li>
</ul>
<h3>Contingency theories — "it depends"</h3>
<table>
<tr><th>Model</th><th>Idea</th></tr>
<tr><td>Fiedler</td><td>A leader's style (task- or relationship-oriented) is fixed; match it to the situation, judged by leader–member relations, task structure and position power</td></tr>
<tr><td>Hersey–Blanchard situational leadership</td><td>Adapt to follower <strong>readiness</strong>: <em>telling</em> (unable and unwilling), <em>selling</em> (unable but willing), <em>participating</em> (able but unwilling), <em>delegating</em> (able and willing)</td></tr>
<tr><td>Path–goal (Robert House)</td><td>The leader clears the path to goals by being directive, supportive, participative or achievement-oriented, depending on the employees and the task</td></tr>
</table>
<p>Contemporary views distinguish <strong>transactional</strong> leaders (exchange rewards for performance) from <strong>transformational</strong> leaders (inspire followers to go beyond self-interest), and stress <strong>trust</strong>, integrity and authentic, ethical leadership.</p>
<h3>Communication</h3>
<p>The communication process: sender → <em>encoding</em> → message through a <em>channel</em> → <em>decoding</em> → receiver → <em>feedback</em>, with <em>noise</em> disturbing every step. Barriers: filtering, emotions, information overload, defensiveness, language and national culture. Overcome them by using feedback, simplifying language, listening actively, constraining emotions and watching non-verbal cues.</p>
<div class="callout"><span class="badge">No single best style</span> The same leader should direct closely a brand-new employee and delegate freely to an experienced expert.</div>`,
    `<span class="eyebrow">MGT103 · Phần 4 · Bài 4.2</span>
<h2>Lãnh đạo &amp; giao tiếp</h2>
<p><strong>Lãnh đạo</strong> là quá trình tác động tới một nhóm để đạt mục tiêu. Nhà quản trị được bổ nhiệm và có quyền hạn chính thức; người lãnh đạo có thể xuất hiện ngay trong nhóm. Lý tưởng nhất, mọi nhà quản trị cũng nên là người lãnh đạo.</p>
<h3>Lý thuyết đặc điểm và lý thuyết hành vi</h3>
<p><strong>Lý thuyết đặc điểm</strong> tìm những phẩm chất phân biệt người lãnh đạo với người không lãnh đạo: động lực, mong muốn lãnh đạo, trung thực và chính trực, tự tin, thông minh, hiểu biết chuyên môn, hướng ngoại. Phẩm chất có ích nhưng không tự giải thích được lãnh đạo. <strong>Lý thuyết hành vi</strong> nghiên cứu người lãnh đạo hiệu quả <em>làm gì</em>:</p>
<ul>
<li><strong>Đại học Iowa</strong> (Kurt Lewin): phong cách độc đoán, dân chủ và tự do.</li>
<li><strong>Đại học Ohio State</strong>: <em>khởi xướng cấu trúc</em> (tổ chức công việc) và <em>quan tâm</em> (chăm lo con người); kiểu "cao – cao" thường, nhưng không phải lúc nào cũng, hiệu quả nhất.</li>
<li><strong>Đại học Michigan</strong>: lãnh đạo hướng vào nhân viên và hướng vào sản xuất.</li>
<li><strong>Lưới quản trị</strong> (Blake và Mouton): quan tâm con người × quan tâm sản xuất; "quản trị theo nhóm" (9,9) được coi là lý tưởng.</li>
</ul>
<h3>Lý thuyết tình huống — "tuỳ trường hợp"</h3>
<table>
<tr><th>Mô hình</th><th>Ý tưởng</th></tr>
<tr><td>Fiedler</td><td>Phong cách của người lãnh đạo (hướng nhiệm vụ hay hướng quan hệ) là cố định; hãy ghép nó với tình huống, được đánh giá qua quan hệ lãnh đạo – thành viên, cấu trúc nhiệm vụ và quyền lực vị trí</td></tr>
<tr><td>Lãnh đạo theo tình huống Hersey–Blanchard</td><td>Thích ứng với <strong>mức sẵn sàng</strong> của cấp dưới: <em>chỉ đạo</em> (không có khả năng, không sẵn lòng), <em>thuyết phục</em> (chưa có khả năng nhưng sẵn lòng), <em>tham gia</em> (có khả năng nhưng chưa sẵn lòng), <em>uỷ quyền</em> (có khả năng và sẵn lòng)</td></tr>
<tr><td>Đường dẫn – mục tiêu (Robert House)</td><td>Người lãnh đạo dọn đường tới mục tiêu bằng cách chỉ dẫn, hỗ trợ, cho tham gia hoặc hướng tới thành tích, tuỳ nhân viên và nhiệm vụ</td></tr>
</table>
<p>Quan điểm hiện đại phân biệt lãnh đạo <strong>giao dịch</strong> (trao phần thưởng lấy kết quả) với lãnh đạo <strong>chuyển đổi</strong> (truyền cảm hứng để người theo vượt lên lợi ích cá nhân), và nhấn mạnh <strong>lòng tin</strong>, sự chính trực, lãnh đạo chân thực và có đạo đức.</p>
<h3>Giao tiếp</h3>
<p>Quá trình giao tiếp: người gửi → <em>mã hoá</em> → thông điệp qua <em>kênh</em> → <em>giải mã</em> → người nhận → <em>phản hồi</em>, với <em>nhiễu</em> làm sai lệch mọi bước. Rào cản: lọc thông tin, cảm xúc, quá tải thông tin, phòng thủ, ngôn ngữ và văn hoá quốc gia. Vượt qua bằng cách dùng phản hồi, đơn giản hoá ngôn ngữ, lắng nghe tích cực, kiềm chế cảm xúc và chú ý tín hiệu phi ngôn ngữ.</p>
<div class="callout"><span class="badge">Không có phong cách tốt nhất</span> Cùng một người lãnh đạo nên hướng dẫn sát sao một nhân viên hoàn toàn mới và uỷ quyền thoải mái cho một chuyên gia giàu kinh nghiệm.</div>`,
  ]]);

const c7e = doc('mgt103-4-3-exercise', 'Exercise 2 — diagnosing a demotivated sales team|||Bài tập 2 — chẩn đoán một đội bán hàng thiếu động lực',
  'Bài tập tình huống: đội bán hàng lương ổn nhưng thiếu nhiệt huyết — áp dụng Herzberg, thuyết kỳ vọng (tính lại E × I × V), thiết lập mục tiêu và lãnh đạo theo tình huống để đề xuất giải pháp; kèm lời giải mẫu.',
  [[
    `<span class="eyebrow">MGT103 · Part 4 · Exercise</span>
<h2>Exercise 2 — why won't the team try harder?</h2>
<div class="callout"><span class="badge">Problem</span> Lan manages a newly hired sales team of ten (a fictional case). Pay is at market level and the office is comfortable, yet the team is unenthusiastic. Everyone receives the same bonus whatever their results; the only target is "sell more"; most staff are new to sales and unsure how to close a deal. Use four theories to diagnose the problem and propose actions.</div>
<h3>Model answer</h3>
<table>
<tr><th>Theory</th><th>Diagnosis</th><th>Action</th></tr>
<tr><td>Herzberg</td><td>Hygiene factors (pay, office) are fine, so there is no dissatisfaction — but motivators are missing</td><td>Add recognition, visible achievements, responsibility for key accounts, a growth path</td></tr>
<tr><td>Expectancy (Vroom)</td><td>Instrumentality is low (the bonus ignores results) and expectancy is low (staff doubt their skills)</td><td>Link part of the bonus to results; train and coach to raise the belief that effort leads to sales; ask what rewards people value</td></tr>
<tr><td>Goal-setting</td><td>"Sell more" is vague</td><td>Set specific, challenging, accepted goals with weekly feedback, e.g. 12 qualified meetings and 4 closed deals per person per month</td></tr>
<tr><td>Hersey–Blanchard</td><td>Followers are willing but not yet able — low readiness</td><td>Start with a <em>telling/selling</em> style (clear instructions plus support), move toward <em>participating</em> and <em>delegating</em> as skills grow</td></tr>
</table>
<pre><code class="language-text">Expectancy check for a typical salesperson (0–1 scales)
Now:        E 0.5 (unsure of skills) x I 0.2 (flat bonus) x V 0.9 = 0.09
After plan: E 0.8 (training)         x I 0.8 (linked bonus) x V 0.9 = 0.576</code></pre>
<p><strong>Why:</strong> the theories do not compete here — each points to a different weak link. Fixing only pay (a hygiene factor) would change little; the biggest gains come from making rewards depend on results and from building the skills that make results possible.</p>`,
    `<span class="eyebrow">MGT103 · Phần 4 · Bài tập</span>
<h2>Bài tập 2 — vì sao đội không cố gắng hơn?</h2>
<div class="callout"><span class="badge">Đề</span> Lan quản lý một đội bán hàng mười người mới tuyển (tình huống giả định). Lương ngang mặt bằng thị trường và văn phòng thoải mái, nhưng cả đội thiếu nhiệt huyết. Ai cũng nhận mức thưởng như nhau dù kết quả thế nào; mục tiêu duy nhất là "bán nhiều hơn"; phần lớn nhân viên mới vào nghề bán hàng và chưa tự tin chốt đơn. Hãy dùng bốn thuyết để chẩn đoán vấn đề và đề xuất hành động.</div>
<h3>Lời giải mẫu</h3>
<table>
<tr><th>Thuyết</th><th>Chẩn đoán</th><th>Hành động</th></tr>
<tr><td>Herzberg</td><td>Nhân tố duy trì (lương, văn phòng) ổn nên không có bất mãn — nhưng thiếu nhân tố động viên</td><td>Thêm sự công nhận, thành tích được ghi nhận rõ ràng, trách nhiệm với khách hàng lớn, lộ trình phát triển</td></tr>
<tr><td>Kỳ vọng (Vroom)</td><td>Tính công cụ thấp (thưởng không phụ thuộc kết quả) và kỳ vọng thấp (nhân viên nghi ngờ kỹ năng của mình)</td><td>Gắn một phần thưởng với kết quả; đào tạo, kèm cặp để nâng niềm tin rằng nỗ lực sẽ ra doanh số; hỏi xem mọi người coi trọng phần thưởng nào</td></tr>
<tr><td>Thiết lập mục tiêu</td><td>"Bán nhiều hơn" quá mơ hồ</td><td>Đặt mục tiêu cụ thể, thách thức, được chấp nhận, có phản hồi hằng tuần, vd mỗi người 12 cuộc gặp khách tiềm năng và chốt 4 hợp đồng mỗi tháng</td></tr>
<tr><td>Hersey–Blanchard</td><td>Cấp dưới sẵn lòng nhưng chưa có khả năng — mức sẵn sàng thấp</td><td>Bắt đầu bằng phong cách <em>chỉ đạo/thuyết phục</em> (hướng dẫn rõ kèm hỗ trợ), chuyển dần sang <em>tham gia</em> và <em>uỷ quyền</em> khi kỹ năng tăng</td></tr>
</table>
<pre><code class="language-text">Kiểm tra thuyết kỳ vọng cho một nhân viên điển hình (thang 0–1)
Hiện tại:  E 0,5 (chưa tự tin) x I 0,2 (thưởng đồng loạt) x V 0,9 = 0,09
Sau kế hoạch: E 0,8 (được đào tạo) x I 0,8 (thưởng gắn kết quả) x V 0,9 = 0,576</code></pre>
<p><strong>Vì sao:</strong> các thuyết ở đây không cạnh tranh nhau — mỗi thuyết chỉ ra một mắt xích yếu khác nhau. Chỉ sửa lương (một nhân tố duy trì) sẽ thay đổi rất ít; hiệu quả lớn nhất đến từ việc làm cho phần thưởng phụ thuộc kết quả và xây dựng kỹ năng để có được kết quả.</p>`,
  ]]);

const c7q = quiz('mgt103-quiz-4', 'Quiz 4 — Leading|||Quiz 4 — Lãnh đạo', [
  { id: 'q1', question: 'According to Herzberg, pay and working conditions are…|||Theo Herzberg, lương và điều kiện làm việc là…', options: ['motivators that create satisfaction|||nhân tố động viên tạo ra sự thoả mãn', 'hygiene factors that only prevent dissatisfaction|||nhân tố duy trì, chỉ ngăn sự bất mãn', 'self-actualization needs|||nhu cầu tự thể hiện', 'irrelevant to employees|||không liên quan tới nhân viên'], correctIndex: 1, explanation: 'Improving hygiene factors removes dissatisfaction but does not by itself motivate.|||Cải thiện nhân tố duy trì xoá bỏ bất mãn nhưng tự nó không tạo động lực.' },
  { id: 'q2', question: 'Under expectancy theory, motivation falls sharply when employees believe that…|||Theo thuyết kỳ vọng, động lực giảm mạnh khi nhân viên tin rằng…', options: ['the task is interesting|||nhiệm vụ thú vị', 'good performance will not lead to rewards|||kết quả tốt sẽ không dẫn tới phần thưởng', 'they have the skills needed|||họ có đủ kỹ năng cần thiết', 'rewards are valuable|||phần thưởng có giá trị'], correctIndex: 1, explanation: 'Low instrumentality makes the product E × I × V small, whatever the other two factors.|||Tính công cụ thấp làm tích E × I × V nhỏ đi, bất kể hai yếu tố còn lại.' },
  { id: 'q3', question: 'In Hersey–Blanchard’s model, which style suits followers who are unable and unwilling?|||Trong mô hình Hersey–Blanchard, phong cách nào hợp với cấp dưới không có khả năng và không sẵn lòng?', options: ['Delegating|||Uỷ quyền', 'Participating|||Tham gia', 'Telling|||Chỉ đạo', 'Laissez-faire|||Tự do'], correctIndex: 2, explanation: 'Low readiness needs high task direction: clear instructions and close supervision.|||Mức sẵn sàng thấp cần chỉ dẫn nhiệm vụ cao: hướng dẫn rõ ràng và giám sát chặt.' },
]);

const c8 = doc('mgt103-5-1-controlling', '5.1 — Controlling|||5.1 — Kiểm soát',
  'Kiểm soát là gì và vì sao quan trọng, quy trình kiểm soát 3 bước với phạm vi sai lệch chấp nhận được, ba hành động quản trị, kiểm soát lường trước, đồng thời và phản hồi, công cụ kiểm soát tài chính (tỷ số, ngân sách), thẻ điểm cân bằng và đo lường đối chuẩn.',
  [[
    `<span class="eyebrow">MGT103 · Part 5 · Lesson 5.1</span>
<h2>Controlling</h2>
<p><strong>Controlling</strong> is monitoring, comparing and correcting work performance. It closes the management loop: plans set the goals, and control shows whether they are being met. It also lets managers delegate with confidence and protects the organization's assets.</p>
<h3>The control process</h3>
<ol>
<li><strong>Measure actual performance</strong> — through personal observation, statistical reports, oral and written reports; choose criteria that really reflect performance.</li>
<li><strong>Compare performance with the standard</strong> — within an acceptable <strong>range of variation</strong>.</li>
<li><strong>Take managerial action</strong> — do nothing; <strong>correct actual performance</strong> (immediate corrective action fixes the symptom now, <em>basic</em> corrective action finds and fixes the cause); or <strong>revise the standard</strong> if it was unrealistic.</li>
</ol>
<pre><code>Standard: 100 units sold per week, acceptable variation ±5% (95–105)
Actual:   92 units  ->  deviation = (92 − 100) / 100 = −8%  -> outside the range
Action:   investigate the cause (stock-outs? a new competitor? poor training?)
          before choosing between correcting performance and revising the standard</code></pre>
<h3>When to control</h3>
<table>
<tr><th>Type</th><th>Timing</th><th>Example</th></tr>
<tr><td>Feedforward</td><td>Before the activity — prevent problems</td><td>Preventive maintenance, checking raw materials, training before launch</td></tr>
<tr><td>Concurrent</td><td>During the activity</td><td>Direct supervision, "management by walking around", real-time dashboards</td></tr>
<tr><td>Feedback</td><td>After the activity</td><td>Monthly financial reports, customer satisfaction surveys</td></tr>
</table>
<h3>Tools for measuring performance</h3>
<ul>
<li><strong>Financial controls</strong> — ratios for liquidity (current ratio = current assets ÷ current liabilities; 600 ÷ 400 = 1.5), leverage, activity and profitability, plus <strong>budgets</strong> that set quantitative standards.</li>
<li><strong>Balanced scorecard</strong> (Kaplan and Norton) — measure four perspectives, not just money: <em>financial</em>, <em>customer</em>, <em>internal business processes</em> and <em>learning and growth</em>.</li>
<li><strong>Benchmarking</strong> — compare with the best performers, inside or outside the industry.</li>
<li><strong>Information controls</strong> — protect data and use information systems to monitor operations.</li>
</ul>
<div class="callout"><span class="badge">Balance</span> Too little control invites waste and error; too much control kills initiative. Good controls are timely, accurate, economical and focused on what matters.</div>`,
    `<span class="eyebrow">MGT103 · Phần 5 · Bài 5.1</span>
<h2>Kiểm soát</h2>
<p><strong>Kiểm soát</strong> là theo dõi, so sánh và điều chỉnh kết quả công việc. Nó khép kín vòng quản trị: hoạch định đặt mục tiêu, còn kiểm soát cho biết mục tiêu có đang đạt được hay không. Kiểm soát cũng giúp nhà quản trị tự tin uỷ quyền và bảo vệ tài sản của tổ chức.</p>
<h3>Quy trình kiểm soát</h3>
<ol>
<li><strong>Đo lường kết quả thực tế</strong> — qua quan sát trực tiếp, báo cáo thống kê, báo cáo miệng và bằng văn bản; chọn tiêu chí phản ánh đúng kết quả.</li>
<li><strong>So sánh kết quả với tiêu chuẩn</strong> — trong một <strong>phạm vi sai lệch</strong> chấp nhận được.</li>
<li><strong>Thực hiện hành động quản trị</strong> — không làm gì; <strong>điều chỉnh kết quả thực tế</strong> (điều chỉnh tức thời xử lý triệu chứng ngay, điều chỉnh <em>căn bản</em> tìm và xử lý nguyên nhân); hoặc <strong>điều chỉnh tiêu chuẩn</strong> nếu tiêu chuẩn thiếu thực tế.</li>
</ol>
<pre><code>Tiêu chuẩn: bán 100 sản phẩm mỗi tuần, sai lệch chấp nhận ±5% (95–105)
Thực tế:    92 sản phẩm  ->  sai lệch = (92 − 100) / 100 = −8%  -> ngoài phạm vi
Hành động:  tìm nguyên nhân (hết hàng? đối thủ mới? đào tạo kém?)
            trước khi chọn giữa điều chỉnh kết quả và điều chỉnh tiêu chuẩn</code></pre>
<h3>Kiểm soát vào lúc nào</h3>
<table>
<tr><th>Loại</th><th>Thời điểm</th><th>Ví dụ</th></tr>
<tr><td>Lường trước</td><td>Trước hoạt động — phòng ngừa vấn đề</td><td>Bảo trì phòng ngừa, kiểm tra nguyên liệu, đào tạo trước khi triển khai</td></tr>
<tr><td>Đồng thời</td><td>Trong khi hoạt động</td><td>Giám sát trực tiếp, "quản lý bằng cách đi quanh", bảng điều khiển thời gian thực</td></tr>
<tr><td>Phản hồi</td><td>Sau hoạt động</td><td>Báo cáo tài chính hằng tháng, khảo sát sự hài lòng của khách hàng</td></tr>
</table>
<h3>Công cụ đo lường kết quả</h3>
<ul>
<li><strong>Kiểm soát tài chính</strong> — tỷ số thanh khoản (hệ số thanh toán hiện hành = tài sản ngắn hạn ÷ nợ ngắn hạn; 600 ÷ 400 = 1,5), đòn bẩy, hoạt động và khả năng sinh lời, cùng <strong>ngân sách</strong> đặt ra tiêu chuẩn định lượng.</li>
<li><strong>Thẻ điểm cân bằng</strong> (Kaplan và Norton) — đo bốn khía cạnh chứ không chỉ tiền: <em>tài chính</em>, <em>khách hàng</em>, <em>quy trình kinh doanh nội bộ</em> và <em>học hỏi – phát triển</em>.</li>
<li><strong>Đo lường đối chuẩn (benchmarking)</strong> — so sánh với đơn vị làm tốt nhất, trong hay ngoài ngành.</li>
<li><strong>Kiểm soát thông tin</strong> — bảo vệ dữ liệu và dùng hệ thống thông tin để theo dõi hoạt động.</li>
</ul>
<div class="callout"><span class="badge">Cân bằng</span> Kiểm soát quá ít dễ gây lãng phí và sai sót; kiểm soát quá nhiều giết chết sự chủ động. Kiểm soát tốt là kịp thời, chính xác, tiết kiệm và tập trung vào điều quan trọng.</div>`,
  ]]);

const c8q = quiz('mgt103-quiz-5', 'Quiz 5 — Controlling|||Quiz 5 — Kiểm soát', [
  { id: 'q1', question: 'Preventive maintenance on machines is an example of…|||Bảo trì phòng ngừa cho máy móc là ví dụ của…', options: ['feedback control|||kiểm soát phản hồi', 'concurrent control|||kiểm soát đồng thời', 'feedforward control|||kiểm soát lường trước', 'no control|||không phải kiểm soát'], correctIndex: 2, explanation: 'It acts before the problem occurs, which is the defining feature of feedforward control.|||Nó tác động trước khi vấn đề xảy ra — đặc điểm của kiểm soát lường trước.' },
  { id: 'q2', question: 'Which set lists the four perspectives of the balanced scorecard?|||Tập hợp nào nêu đúng bốn khía cạnh của thẻ điểm cân bằng?', options: ['Planning, organizing, leading, controlling|||Hoạch định, tổ chức, lãnh đạo, kiểm soát', 'Financial, customer, internal processes, learning and growth|||Tài chính, khách hàng, quy trình nội bộ, học hỏi và phát triển', 'Strengths, weaknesses, opportunities, threats|||Điểm mạnh, điểm yếu, cơ hội, thách thức', 'Product, price, place, promotion|||Sản phẩm, giá, phân phối, xúc tiến'], correctIndex: 1, explanation: 'Kaplan and Norton added non-financial measures so that managers do not steer by money alone.|||Kaplan và Norton bổ sung thước đo phi tài chính để nhà quản trị không chỉ lái theo con số tiền.' },
  { id: 'q3', question: 'Actual performance is far below a standard that turns out to have been set unrealistically high. The appropriate action is to…|||Kết quả thực tế thấp xa so với một tiêu chuẩn hoá ra được đặt cao phi thực tế. Hành động phù hợp là…', options: ['punish the employees|||phạt nhân viên', 'revise the standard|||điều chỉnh lại tiêu chuẩn', 'ignore the deviation|||bỏ qua sai lệch', 'stop measuring|||ngừng đo lường'], correctIndex: 1, explanation: 'When the standard itself is the problem, correcting performance cannot fix it.|||Khi chính tiêu chuẩn là vấn đề, điều chỉnh kết quả không thể giải quyết được.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MGT103',
    slug: 'mgt103-introduction-to-management',
    title: 'Introduction to Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MGT103.webp',
    shortDescription: 'What managers do: the four functions, roles and skills, the evolution of management thought, culture and ethics, decision making, planning and strategy, organizational structure, motivation, leadership and control. Bilingual, with case exercises and quizzes.|||Nhà quản trị làm gì: 4 chức năng, vai trò, kỹ năng, lịch sử tư tưởng, văn hoá và đạo đức, ra quyết định, chiến lược, cơ cấu tổ chức, động viên, lãnh đạo, kiểm soát. Song ngữ, có bài tập tình huống và quiz.',
    description: 'Môn <strong>MGT103 — Introduction to Management (Nhập môn quản trị)</strong> (khối Quản trị Kinh doanh, kỳ 1) giới thiệu công việc của nhà quản trị qua <strong>bốn chức năng hoạch định – tổ chức – lãnh đạo – kiểm soát</strong>. Từ <strong>vai trò, kỹ năng và lịch sử tư tưởng quản trị</strong> → <strong>môi trường, văn hoá, trách nhiệm xã hội và đạo đức</strong> → <strong>ra quyết định, hoạch định và chiến lược</strong> (SWOT, Porter, BCG) → <strong>cơ cấu và thiết kế tổ chức</strong> → <strong>động viên và lãnh đạo</strong> → <strong>kiểm soát</strong> (quy trình, thẻ điểm cân bằng). Bám cấu trúc giáo trình quản trị học nhập môn chuẩn, song ngữ Anh–Việt, có bài tập tình huống kèm lời giải mẫu và quiz cuối mỗi phần.',
    whatYouLearn: 'Phân biệt hiệu suất và hiệu quả; mô tả 4 chức năng, 10 vai trò và 3 kỹ năng của nhà quản trị\nTóm tắt các trường phái quản trị từ Taylor, Fayol, Weber tới cách tiếp cận hệ thống và tình huống\nPhân tích văn hoá tổ chức, môi trường, trách nhiệm xã hội và các yếu tố của hành vi đạo đức\nÁp dụng quy trình ra quyết định 8 bước, giá trị kỳ vọng và ma trận có trọng số\nViết mục tiêu SMART, lập SWOT và chọn chiến lược theo Porter và BCG\nThiết kế cơ cấu tổ chức: tầm hạn quản trị, cơ học hay hữu cơ, ma trận\nVận dụng các thuyết động viên (Maslow, Herzberg, Vroom…) và lãnh đạo tình huống\nThiết lập quy trình kiểm soát và thẻ điểm cân bằng',
    requirements: 'Không cần kiến thức quản trị trước\nKhả năng đọc hiểu tình huống và trình bày lập luận\nNên liên hệ với trải nghiệm làm việc nhóm, câu lạc bộ hoặc việc làm thêm của bản thân',
  },
  sections: [
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Nhà quản trị, POLC, vai trò, kỹ năng, lịch sử tư tưởng.', lessons: [intro] },
    { title: 'Part 1 — The management environment|||Phần 1 — Môi trường quản trị', description: 'Văn hoá, môi trường, trách nhiệm xã hội, đạo đức.', lessons: [c1, c1q] },
    { title: 'Part 2 — Planning & decision making|||Phần 2 — Hoạch định & ra quyết định', description: 'Quy trình quyết định, mục tiêu SMART, SWOT, chiến lược.', lessons: [c3, c4, c4e, c4q] },
    { title: 'Part 3 — Organizing|||Phần 3 — Tổ chức', description: 'Sáu yếu tố cơ cấu, cơ học và hữu cơ, các mô hình.', lessons: [c5, c5q] },
    { title: 'Part 4 — Leading|||Phần 4 — Lãnh đạo', description: 'Động viên, phong cách lãnh đạo, giao tiếp.', lessons: [c6, c7, c7e, c7q] },
    { title: 'Part 5 — Controlling|||Phần 5 — Kiểm soát', description: 'Quy trình kiểm soát, loại kiểm soát, thẻ điểm cân bằng.', lessons: [c8, c8q] },
  ],
};
