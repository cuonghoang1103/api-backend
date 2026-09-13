/**
 * HRM202c — Human Resource Management (Quản trị nguồn nhân lực). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám cấu trúc giáo trình quản trị nhân lực chuẩn quốc tế (Gary Dessler — Human Resource
 * Management; Michael Armstrong — Armstrong's Handbook of Human Resource Management Practice;
 * Noe, Hollenbeck, Gerhart & Wright — Fundamentals of Human Resource Management): HRM chiến lược,
 * phân tích công việc, hoạch định nhân lực, tuyển mộ & tuyển chọn, đào tạo (ADDIE, Kirkpatrick, ROI),
 * quản lý hiệu suất, lương thưởng & phúc lợi, quan hệ lao động, an toàn, nguyên tắc luật lao động
 * Việt Nam (có rào đón), HR analytics, HRM thời đại số. Học sau MGT103 và OBE102c — động lực và
 * lãnh đạo chỉ nhắc để liên hệ. Song ngữ + ví dụ số (đã kiểm bằng máy; tình huống và số liệu là
 * GIẢ ĐỊNH) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('hrm202c-0-1-overview', 'Course overview: what human resource management does|||Tổng quan: quản trị nguồn nhân lực làm gì',
  'Định nghĩa quản trị nguồn nhân lực, năm nhóm chức năng, phân vai giữa quản lý trực tuyến và phòng nhân sự, bốn vai trò của HR theo Ulrich và mô hình ba trụ cột, HRM cứng và mềm, liên hệ với MGT103 và OBE102c, lộ trình môn.',
  [[
    `<span class="eyebrow">HRM202c · Lesson 0.1 · Overview</span>
<h2>Human Resource Management</h2>
<p class="lead">Human resource management (HRM) is the set of policies and practices an organisation uses to <strong>acquire, develop, reward and retain</strong> its people, and to manage the employment relationship fairly, safely and within the law. A strategy is only as good as the people who carry it out — HRM is how a firm makes sure it has the right people, with the right skills, doing the right work, for the right reward.</p>
<h3>What HRM covers</h3>
<table>
<tr><th>Function</th><th>Key question</th><th>Where in this course</th></tr>
<tr><td>Strategy &amp; workforce planning</td><td>How many people, with which skills, will we need — and where will they come from?</td><td>Part 1</td></tr>
<tr><td>Acquiring talent</td><td>How do we attract applicants and choose the best-fitting person fairly?</td><td>Part 2</td></tr>
<tr><td>Developing people &amp; managing performance</td><td>How do people learn, and how do we set goals, measure and improve performance?</td><td>Part 3</td></tr>
<tr><td>Rewarding</td><td>How do we pay fairly inside the firm and competitively in the market?</td><td>Part 4</td></tr>
<tr><td>Relations, safety &amp; analytics</td><td>How do we manage the employment relationship, protect health and use workforce data?</td><td>Part 5</td></tr>
</table>
<h3>Who does HR work?</h3>
<p>Every manager is, in part, an HR manager: line managers interview candidates, coach, appraise and handle day-to-day discipline. The HR department holds <strong>staff authority</strong> — it designs policies, advises, provides services and monitors compliance — and sometimes <strong>functional authority</strong>, for example requiring every manager to use the approved interview guide. Good outcomes need both sides to play their part.</p>
<h3>The changing roles of HR</h3>
<p>Dave Ulrich’s widely used model describes four roles: <strong>strategic partner</strong> (aligning HR with business strategy), <strong>administrative expert</strong> (efficient, accurate HR processes), <strong>employee champion</strong> (voice, well-being, engagement) and <strong>change agent</strong> (culture and transformation). Many larger organisations now structure HR in three pillars: <strong>HR business partners</strong> who work alongside line leaders, <strong>centres of expertise</strong> (reward, talent, learning) and <strong>shared services</strong> that handle transactions such as payroll and records.</p>
<h3>Hard and soft HRM</h3>
<p>Two long-standing perspectives shape HR choices. <strong>Hard HRM</strong> treats people as a resource to be deployed efficiently in line with strategy, with emphasis on planning, cost and performance metrics. <strong>Soft HRM</strong> emphasises commitment, development, communication and trust. Real organisations blend the two; the balance is a strategic choice, not a matter of good versus bad.</p>
<h3>How this course connects to what you know</h3>
<p>You met motivation theories and leadership in MGT103 and OBE102c; they are not retaught here. HRM turns them into <em>systems</em>: goal-setting reappears in performance management (Part 3), equity and expectancy theories in pay and incentive design (Part 4), and job enrichment in job design (Part 1).</p>
<h3>Roadmap</h3>
<p>Part 1: strategic HRM, job analysis and workforce planning · Part 2: recruitment and selection · Part 3: training, development and performance management · Part 4: compensation and benefits · Part 5: employee relations, safety, Vietnamese labour law principles, HR analytics and digital HRM. Parts 2, 4 and 5 include worked exercises; every part ends with a quiz. All cases and numbers are fictional and illustrative, and every calculation has been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> HR practices work as a system. Excellent hiring is wasted by poor onboarding; generous pay is wasted if it rewards the wrong behaviour. Always ask how one practice supports — or undermines — the others.</div>`,
    `<span class="eyebrow">HRM202c · Bài 0.1 · Tổng quan</span>
<h2>Quản trị nguồn nhân lực</h2>
<p class="lead">Quản trị nguồn nhân lực (HRM) là tập hợp các chính sách và hoạt động mà tổ chức dùng để <strong>thu hút, phát triển, đãi ngộ và giữ chân</strong> người lao động, đồng thời quản lý quan hệ lao động một cách công bằng, an toàn và đúng pháp luật. Một chiến lược chỉ tốt bằng những con người thực hiện nó — HRM là cách doanh nghiệp bảo đảm có đúng người, đúng kỹ năng, làm đúng việc, với mức đãi ngộ phù hợp.</p>
<h3>HRM bao gồm những gì</h3>
<table>
<tr><th>Chức năng</th><th>Câu hỏi chính</th><th>Học ở đâu trong môn</th></tr>
<tr><td>Chiến lược &amp; hoạch định nhân lực</td><td>Cần bao nhiêu người, với kỹ năng nào — và lấy từ đâu?</td><td>Phần 1</td></tr>
<tr><td>Thu hút nhân tài</td><td>Làm sao thu hút ứng viên và chọn người phù hợp nhất một cách công bằng?</td><td>Phần 2</td></tr>
<tr><td>Phát triển con người &amp; quản lý hiệu suất</td><td>Người lao động học tập ra sao; đặt mục tiêu, đo lường và cải thiện hiệu suất thế nào?</td><td>Phần 3</td></tr>
<tr><td>Đãi ngộ</td><td>Trả lương thế nào để công bằng trong nội bộ và cạnh tranh trên thị trường?</td><td>Phần 4</td></tr>
<tr><td>Quan hệ lao động, an toàn &amp; phân tích dữ liệu</td><td>Quản lý quan hệ lao động, bảo vệ sức khoẻ và dùng dữ liệu nhân sự ra sao?</td><td>Phần 5</td></tr>
</table>
<h3>Ai làm công việc nhân sự?</h3>
<p>Mỗi nhà quản lý đều phần nào là một nhà quản trị nhân sự: quản lý trực tuyến phỏng vấn ứng viên, kèm cặp, đánh giá và xử lý kỷ luật hằng ngày. Phòng nhân sự nắm <strong>quyền tham mưu</strong> — xây dựng chính sách, tư vấn, cung cấp dịch vụ và giám sát việc tuân thủ — và đôi khi có <strong>quyền chức năng</strong>, chẳng hạn yêu cầu mọi quản lý dùng bộ câu hỏi phỏng vấn đã được duyệt. Kết quả tốt đòi hỏi cả hai bên cùng làm tròn vai.</p>
<h3>Vai trò đang thay đổi của HR</h3>
<p>Mô hình được dùng rộng rãi của Dave Ulrich mô tả bốn vai trò: <strong>đối tác chiến lược</strong> (gắn HR với chiến lược kinh doanh), <strong>chuyên gia hành chính</strong> (quy trình nhân sự hiệu quả, chính xác), <strong>người bênh vực nhân viên</strong> (tiếng nói, phúc lợi tinh thần, sự gắn kết) và <strong>tác nhân thay đổi</strong> (văn hoá và chuyển đổi). Nhiều tổ chức lớn hiện tổ chức HR theo ba trụ cột: <strong>đối tác nhân sự (HRBP)</strong> làm việc cùng lãnh đạo trực tuyến, <strong>trung tâm chuyên môn</strong> (đãi ngộ, nhân tài, đào tạo) và <strong>dịch vụ dùng chung</strong> xử lý giao dịch như tính lương và hồ sơ.</p>
<h3>HRM cứng và HRM mềm</h3>
<p>Hai quan điểm lâu đời định hình các lựa chọn nhân sự. <strong>HRM cứng</strong> coi con người là một nguồn lực cần bố trí hiệu quả theo chiến lược, nhấn mạnh hoạch định, chi phí và chỉ số hiệu suất. <strong>HRM mềm</strong> nhấn mạnh sự cam kết, phát triển, giao tiếp và niềm tin. Tổ chức thực tế pha trộn cả hai; tỷ lệ pha trộn là một lựa chọn chiến lược, không phải chuyện tốt hay xấu.</p>
<h3>Môn học này nối với những gì bạn đã biết</h3>
<p>Bạn đã học các thuyết động lực và lãnh đạo ở MGT103 và OBE102c; môn này không dạy lại. HRM biến chúng thành <em>hệ thống</em>: thuyết đặt mục tiêu xuất hiện lại trong quản lý hiệu suất (Phần 3), thuyết công bằng và thuyết kỳ vọng trong thiết kế lương và khuyến khích (Phần 4), làm giàu công việc trong thiết kế công việc (Phần 1).</p>
<h3>Lộ trình</h3>
<p>Phần 1: HRM chiến lược, phân tích công việc và hoạch định nhân lực · Phần 2: tuyển mộ và tuyển chọn · Phần 3: đào tạo, phát triển và quản lý hiệu suất · Phần 4: lương thưởng và phúc lợi · Phần 5: quan hệ lao động, an toàn, nguyên tắc luật lao động Việt Nam, phân tích dữ liệu nhân sự và HRM thời đại số. Phần 2, 4 và 5 có bài tập kèm lời giải; mỗi phần kết thúc bằng một bài quiz. Mọi tình huống và số liệu đều là giả định, minh hoạ, và mọi phép tính đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Các hoạt động nhân sự vận hành như một hệ thống. Tuyển giỏi mà hội nhập kém thì phí; trả lương hào phóng mà thưởng cho hành vi sai thì cũng phí. Luôn hỏi một hoạt động hỗ trợ — hay phá hỏng — các hoạt động khác thế nào.</div>`,
  ]]);

const c1 = doc('hrm202c-1-1-strategic-hrm', '1.1 — Strategic HRM: linking people to strategy|||1.1 — HRM chiến lược: gắn con người với chiến lược',
  'Quy trình từ chiến lược tới hoạt động nhân sự, sự phù hợp giữa HR và chiến lược cạnh tranh (chi phí thấp và khác biệt hoá), ba trường phái best fit – best practice – gói hoạt động (HPWS), mô hình Michigan và Harvard, quan điểm dựa trên nguồn lực, mô hình AMO, thẻ điểm HR.',
  [[
    `<span class="eyebrow">HRM202c · Part 1 · Lesson 1.1</span>
<h2>Strategic HRM: linking people to strategy</h2>
<p class="lead">Strategic HRM (SHRM) means designing HR policies and practices so that they help the organisation achieve its strategic goals — and making sure those practices fit together as a coherent system.</p>
<h3>From strategy to HR practice</h3>
<ol>
<li>The business sets its strategy — for example, compete on low cost, or on innovation and quality.</li>
<li>Leaders identify the workforce capabilities and behaviours that the strategy requires.</li>
<li>HR designs practices — job design, hiring, training, appraisal, pay — that build those capabilities and behaviours.</li>
<li>Outcomes are measured (for example with an HR scorecard) and practices are adjusted.</li>
</ol>
<h3>Fitting HR practices to competitive strategy (typical patterns)</h3>
<table>
<tr><th>HR area</th><th>Cost leadership</th><th>Differentiation / innovation</th></tr>
<tr><td>Job design</td><td>Narrow, standardised jobs; efficiency first</td><td>Broad jobs, cross-functional teams</td></tr>
<tr><td>Selection</td><td>Hire for reliability and job-specific skills</td><td>Hire for creativity, learning ability and teamwork</td></tr>
<tr><td>Training</td><td>Short, job-focused</td><td>Continuous, broad development</td></tr>
<tr><td>Appraisal</td><td>Short-term, output and results</td><td>Longer-term; includes behaviours and team results</td></tr>
<tr><td>Pay</td><td>Market-level, tight cost control</td><td>More incentives for innovation, more emphasis on internal fairness</td></tr>
</table>
<h3>Three schools of thought</h3>
<ul>
<li><strong>Best fit (contingency):</strong> the right practices depend on context — strategy, sector, size, labour market. The Michigan “matching model” links selection, appraisal, rewards and development to the firm’s strategy.</li>
<li><strong>Best practice (universal):</strong> some practices tend to raise performance almost everywhere. A well-known list popularised by Jeffrey Pfeffer includes selective hiring, employment security, self-managed teams, comparatively high pay linked to organisational performance, extensive training, reduced status differences and sharing information.</li>
<li><strong>Bundles (configurational):</strong> practices are most powerful in mutually reinforcing combinations, known as <strong>high-performance work systems (HPWS)</strong>. Selective hiring plus heavy training plus pay for skills sends one consistent message.</li>
</ul>
<p>The Harvard framework adds that HRM serves several <em>stakeholders</em> — shareholders, employees, government, the community — and should aim at the “four Cs” — commitment, competence, congruence (shared goals between employees and management) and cost-effectiveness — not only at owners’ returns.</p>
<h3>Why people can be a competitive advantage</h3>
<p>The <strong>resource-based view</strong> argues that sustained advantage comes from resources that are <strong>valuable, rare, hard to imitate and hard to substitute</strong>. A competitor can buy the same machines within months; copying a skilled, committed workforce embedded in your culture and routines is far harder. The <strong>AMO model</strong> explains how HR practices lift performance: they build <strong>Ability</strong> (hiring, training), <strong>Motivation</strong> (pay, recognition, fair appraisal) and the <strong>Opportunity</strong> to contribute (job design, involvement, voice). Performance suffers if any one of the three is missing.</p>
<h3>Measuring HR’s contribution</h3>
<p>An <strong>HR scorecard</strong> links HR measures to business results through a chain of cause and effect — for example, <em>time to fill sales roles → sales capacity → revenue</em>, or <em>training hours → first-contact resolution → customer satisfaction</em>. The metrics themselves are covered in Part 5.</p>
<div class="callout"><span class="badge">Watch out</span> A “best practice” copied without fit can fail. A forced-ranking system that suits a sales force may destroy collaboration in a research team. Start from strategy and context, then choose practices that reinforce each other.</div>`,
    `<span class="eyebrow">HRM202c · Phần 1 · Bài 1.1</span>
<h2>HRM chiến lược: gắn con người với chiến lược</h2>
<p class="lead">Quản trị nguồn nhân lực chiến lược (SHRM) là thiết kế các chính sách và hoạt động nhân sự sao cho chúng giúp tổ chức đạt các mục tiêu chiến lược — và bảo đảm các hoạt động đó ăn khớp với nhau thành một hệ thống nhất quán.</p>
<h3>Từ chiến lược tới hoạt động nhân sự</h3>
<ol>
<li>Doanh nghiệp xác định chiến lược — chẳng hạn cạnh tranh bằng chi phí thấp, hoặc bằng đổi mới và chất lượng.</li>
<li>Lãnh đạo xác định năng lực và hành vi của đội ngũ mà chiến lược đòi hỏi.</li>
<li>HR thiết kế các hoạt động — thiết kế công việc, tuyển dụng, đào tạo, đánh giá, trả lương — để xây dựng năng lực và hành vi đó.</li>
<li>Đo lường kết quả (ví dụ bằng thẻ điểm HR) và điều chỉnh hoạt động.</li>
</ol>
<h3>Làm cho hoạt động nhân sự phù hợp với chiến lược cạnh tranh (các mô thức điển hình)</h3>
<table>
<tr><th>Lĩnh vực HR</th><th>Dẫn đầu chi phí</th><th>Khác biệt hoá / đổi mới</th></tr>
<tr><td>Thiết kế công việc</td><td>Công việc hẹp, chuẩn hoá; ưu tiên hiệu suất</td><td>Công việc rộng, nhóm liên chức năng</td></tr>
<tr><td>Tuyển chọn</td><td>Tuyển người tin cậy, có kỹ năng chuyên biệt cho công việc</td><td>Tuyển người sáng tạo, học nhanh, làm việc nhóm tốt</td></tr>
<tr><td>Đào tạo</td><td>Ngắn, tập trung vào công việc</td><td>Liên tục, phát triển rộng</td></tr>
<tr><td>Đánh giá</td><td>Ngắn hạn, theo sản lượng và kết quả</td><td>Dài hạn hơn; gồm cả hành vi và kết quả nhóm</td></tr>
<tr><td>Trả lương</td><td>Ngang thị trường, kiểm soát chặt chi phí</td><td>Nhiều khuyến khích cho đổi mới, chú trọng công bằng nội bộ hơn</td></tr>
</table>
<h3>Ba trường phái</h3>
<ul>
<li><strong>Phù hợp nhất (best fit, tiếp cận tình huống):</strong> hoạt động đúng tuỳ thuộc bối cảnh — chiến lược, ngành, quy mô, thị trường lao động. “Mô hình tương thích” Michigan gắn tuyển chọn, đánh giá, đãi ngộ và phát triển với chiến lược của doanh nghiệp.</li>
<li><strong>Thực hành tốt nhất (best practice, phổ quát):</strong> một số hoạt động có xu hướng nâng hiệu suất ở hầu hết mọi nơi. Một danh sách nổi tiếng do Jeffrey Pfeffer phổ biến gồm: tuyển chọn kỹ lưỡng, bảo đảm việc làm, nhóm tự quản, lương tương đối cao gắn với kết quả của tổ chức, đào tạo sâu rộng, giảm khác biệt địa vị và chia sẻ thông tin.</li>
<li><strong>Gói hoạt động (cấu hình):</strong> các hoạt động mạnh nhất khi kết hợp và củng cố lẫn nhau, gọi là <strong>hệ thống công việc hiệu suất cao (HPWS)</strong>. Tuyển chọn kỹ cộng đào tạo nhiều cộng trả lương theo kỹ năng gửi đi một thông điệp nhất quán.</li>
</ul>
<p>Mô hình Harvard bổ sung rằng HRM phục vụ nhiều <em>bên liên quan</em> — cổ đông, người lao động, nhà nước, cộng đồng — và nên hướng tới “bốn C” — sự cam kết, năng lực, sự tương hợp (mục tiêu chung giữa người lao động và ban lãnh đạo) và hiệu quả chi phí — chứ không chỉ lợi ích của chủ sở hữu.</p>
<h3>Vì sao con người có thể là lợi thế cạnh tranh</h3>
<p><strong>Quan điểm dựa trên nguồn lực</strong> cho rằng lợi thế bền vững đến từ những nguồn lực <strong>có giá trị, hiếm, khó bắt chước và khó thay thế</strong>. Đối thủ có thể mua cùng loại máy móc trong vài tháng; sao chép một đội ngũ giỏi, gắn bó, đã thấm vào văn hoá và nề nếp của bạn thì khó hơn nhiều. <strong>Mô hình AMO</strong> giải thích cách hoạt động nhân sự nâng hiệu suất: chúng xây dựng <strong>Năng lực</strong> (Ability — tuyển dụng, đào tạo), <strong>Động lực</strong> (Motivation — lương, ghi nhận, đánh giá công bằng) và <strong>Cơ hội</strong> đóng góp (Opportunity — thiết kế công việc, sự tham gia, tiếng nói). Thiếu một trong ba thì hiệu suất đi xuống.</p>
<h3>Đo lường đóng góp của HR</h3>
<p><strong>Thẻ điểm HR</strong> nối các chỉ số nhân sự với kết quả kinh doanh qua một chuỗi nhân quả — ví dụ <em>thời gian tuyển vị trí bán hàng → năng lực bán hàng → doanh thu</em>, hoặc <em>số giờ đào tạo → tỷ lệ giải quyết ngay lần đầu → sự hài lòng của khách hàng</em>. Bản thân các chỉ số được học ở Phần 5.</p>
<div class="callout"><span class="badge">Cẩn thận</span> Một “thực hành tốt nhất” sao chép mà không phù hợp có thể thất bại. Hệ thống xếp hạng bắt buộc hợp với lực lượng bán hàng có thể phá hỏng sự hợp tác trong một nhóm nghiên cứu. Hãy bắt đầu từ chiến lược và bối cảnh, rồi chọn các hoạt động củng cố lẫn nhau.</div>`,
  ]]);

const c2 = doc('hrm202c-1-2-job-analysis', '1.2 — Job analysis: job descriptions & job specifications|||1.2 — Phân tích công việc: bản mô tả & bản tiêu chuẩn công việc',
  'Phân tích công việc dùng để làm gì, sáu bước thực hiện, các phương pháp thu thập thông tin (phỏng vấn, bảng hỏi PAQ, quan sát, nhật ký, O*NET), phân biệt bản mô tả công việc và bản tiêu chuẩn công việc (KSAO), ví dụ trưởng nhóm chăm sóc khách hàng, phân tích theo năng lực và thiết kế công việc.',
  [[
    `<span class="eyebrow">HRM202c · Part 1 · Lesson 1.2</span>
<h2>Job analysis: job descriptions &amp; job specifications</h2>
<p class="lead">Job analysis is the systematic process of determining the duties of a job and the characteristics of the people who should be hired to do it. Almost every other HR practice is built on it.</p>
<h3>What job analysis feeds</h3>
<ul>
<li><strong>Recruitment and selection</strong> — what to advertise and what to assess.</li>
<li><strong>Training</strong> — which skills to build.</li>
<li><strong>Performance management</strong> — what “good performance” looks like.</li>
<li><strong>Compensation</strong> — job evaluation compares the relative worth of jobs (Part 4).</li>
<li><strong>Fairness and legal defence</strong> — decisions based on job-related criteria are easier to justify.</li>
<li><strong>Job design and workforce planning</strong> — how work is divided and how many people it needs.</li>
</ul>
<h3>Six steps</h3>
<ol>
<li>Decide how the information will be used — this determines what data to collect.</li>
<li>Review background information: organisation charts, process charts, existing descriptions.</li>
<li>Select representative positions when many people hold similar jobs.</li>
<li>Collect data on activities, required behaviours, working conditions and human traits.</li>
<li>Verify the information with the job holder and the supervisor.</li>
<li>Write the job description and the job specification.</li>
</ol>
<h3>Methods of collecting data</h3>
<table>
<tr><th>Method</th><th>Strength</th><th>Limitation</th></tr>
<tr><td>Interviews (individual, group, supervisor)</td><td>Rich detail; uncovers informal tasks</td><td>Time-consuming; job holders may overstate duties</td></tr>
<tr><td>Questionnaires, including structured ones such as the Position Analysis Questionnaire (PAQ)</td><td>Fast, many respondents, easy to quantify</td><td>Costly to design well; may miss nuance</td></tr>
<tr><td>Observation</td><td>Good for manual, repetitive work</td><td>Weak for mental or irregular work; people act differently when watched</td></tr>
<tr><td>Diaries and work logs</td><td>Complete picture of a period</td><td>Relies on discipline and honesty</td></tr>
<tr><td>Occupational databases such as O*NET</td><td>Standard lists of tasks, skills and knowledge</td><td>Generic; must be adapted to the local job</td></tr>
</table>
<h3>Job description vs job specification</h3>
<table>
<tr><th>Job description — about the <em>job</em></th><th>Job specification — about the <em>person</em></th></tr>
<tr><td>Job title, grade, department, reports to</td><td>Education and qualifications</td></tr>
<tr><td>Job summary (the purpose of the job)</td><td>Experience</td></tr>
<tr><td>Duties and responsibilities</td><td>Knowledge, skills, abilities and other characteristics (KSAOs)</td></tr>
<tr><td>Authority, working relationships, standards of performance</td><td>Behavioural competencies</td></tr>
<tr><td>Working conditions</td><td>Physical requirements — only if the job genuinely needs them</td></tr>
</table>
<p>Excerpt for a Customer Service Team Leader at Delta Retail (a fictional company used throughout this course):</p>
<pre><code>Job summary   Leads a team of 8 customer-service agents to resolve customer
              requests quickly and accurately.
Key duties    Schedules shifts; coaches agents on difficult calls; monitors KPIs
              (first-contact resolution, response time); handles escalated
              complaints; reports weekly to the service manager.
Specification Two-year college diploma or equivalent; 2+ years in customer
              service, including 6+ months leading others; clear spoken
              communication; calm problem solving; basic spreadsheet skills.</code></pre>
<h3>Competency-based analysis and job design</h3>
<p>Many firms now describe jobs by <strong>competencies</strong> — observable behaviours such as “customer focus” or “coaching others” — which adapt better than fixed task lists when roles change quickly. Job analysis also informs <strong>job design</strong>: <em>job enlargement</em> adds tasks at the same level, <em>job rotation</em> moves people between jobs, and <em>job enrichment</em> adds responsibility and autonomy. The job characteristics model from OBE102c explains why enrichment tends to motivate.</p>
<div class="callout"><span class="badge">Tip</span> Keep specifications <em>job-related</em>. Requirements such as age, gender or appearance that the job does not truly need are discriminatory and needlessly shrink your talent pool.</div>`,
    `<span class="eyebrow">HRM202c · Phần 1 · Bài 1.2</span>
<h2>Phân tích công việc: bản mô tả &amp; bản tiêu chuẩn công việc</h2>
<p class="lead">Phân tích công việc là quá trình có hệ thống nhằm xác định nhiệm vụ của một công việc và những đặc điểm cần có ở người được tuyển để làm công việc đó. Gần như mọi hoạt động nhân sự khác đều dựa trên nó.</p>
<h3>Phân tích công việc phục vụ những gì</h3>
<ul>
<li><strong>Tuyển mộ và tuyển chọn</strong> — đăng tuyển điều gì và đánh giá điều gì.</li>
<li><strong>Đào tạo</strong> — cần xây dựng kỹ năng nào.</li>
<li><strong>Quản lý hiệu suất</strong> — “làm tốt” trông như thế nào.</li>
<li><strong>Lương thưởng</strong> — định giá công việc so sánh giá trị tương đối giữa các công việc (Phần 4).</li>
<li><strong>Công bằng và phòng vệ pháp lý</strong> — quyết định dựa trên tiêu chí liên quan tới công việc dễ bảo vệ hơn.</li>
<li><strong>Thiết kế công việc và hoạch định nhân lực</strong> — công việc được chia thế nào và cần bao nhiêu người.</li>
</ul>
<h3>Sáu bước</h3>
<ol>
<li>Xác định thông tin sẽ được dùng vào việc gì — điều này quyết định cần thu thập dữ liệu nào.</li>
<li>Xem xét thông tin nền: sơ đồ tổ chức, sơ đồ quy trình, các bản mô tả hiện có.</li>
<li>Chọn các vị trí đại diện khi có nhiều người cùng làm công việc tương tự.</li>
<li>Thu thập dữ liệu về hoạt động, hành vi cần có, điều kiện làm việc và phẩm chất con người.</li>
<li>Xác minh thông tin với người đảm nhận công việc và cấp quản lý trực tiếp.</li>
<li>Viết bản mô tả công việc và bản tiêu chuẩn công việc.</li>
</ol>
<h3>Các phương pháp thu thập dữ liệu</h3>
<table>
<tr><th>Phương pháp</th><th>Điểm mạnh</th><th>Hạn chế</th></tr>
<tr><td>Phỏng vấn (cá nhân, nhóm, cấp quản lý)</td><td>Chi tiết phong phú; phát hiện nhiệm vụ không chính thức</td><td>Tốn thời gian; người làm có thể phóng đại nhiệm vụ</td></tr>
<tr><td>Bảng hỏi, kể cả bảng hỏi có cấu trúc như Bảng hỏi phân tích vị trí (PAQ)</td><td>Nhanh, nhiều người trả lời, dễ lượng hoá</td><td>Tốn công thiết kế tốt; có thể bỏ sót chi tiết tinh tế</td></tr>
<tr><td>Quan sát</td><td>Tốt cho công việc chân tay, lặp lại</td><td>Yếu với công việc trí óc hoặc không đều đặn; người bị quan sát cư xử khác đi</td></tr>
<tr><td>Nhật ký và sổ ghi công việc</td><td>Bức tranh đầy đủ về một giai đoạn</td><td>Phụ thuộc vào tính kỷ luật và trung thực</td></tr>
<tr><td>Cơ sở dữ liệu nghề nghiệp như O*NET</td><td>Danh sách chuẩn về nhiệm vụ, kỹ năng, kiến thức</td><td>Mang tính chung; phải điều chỉnh cho công việc cụ thể</td></tr>
</table>
<h3>Bản mô tả công việc và bản tiêu chuẩn công việc</h3>
<table>
<tr><th>Bản mô tả công việc — về <em>công việc</em></th><th>Bản tiêu chuẩn công việc — về <em>con người</em></th></tr>
<tr><td>Chức danh, ngạch bậc, bộ phận, cấp báo cáo</td><td>Trình độ học vấn và bằng cấp</td></tr>
<tr><td>Tóm tắt công việc (mục đích của công việc)</td><td>Kinh nghiệm</td></tr>
<tr><td>Nhiệm vụ và trách nhiệm</td><td>Kiến thức, kỹ năng, khả năng và các đặc điểm khác (KSAO)</td></tr>
<tr><td>Quyền hạn, quan hệ công việc, tiêu chuẩn thực hiện</td><td>Năng lực hành vi</td></tr>
<tr><td>Điều kiện làm việc</td><td>Yêu cầu thể chất — chỉ khi công việc thật sự cần</td></tr>
</table>
<p>Trích đoạn cho vị trí Trưởng nhóm chăm sóc khách hàng tại Delta Retail (công ty giả định dùng xuyên suốt môn học):</p>
<pre><code>Tóm tắt       Dẫn dắt nhóm 8 nhân viên chăm sóc khách hàng giải quyết yêu cầu
              của khách nhanh và chính xác.
Nhiệm vụ      Xếp ca; kèm cặp nhân viên với cuộc gọi khó; theo dõi KPI (tỷ lệ
              giải quyết ngay lần đầu, thời gian phản hồi); xử lý khiếu nại được
              chuyển cấp; báo cáo hằng tuần cho quản lý dịch vụ.
Tiêu chuẩn    Tốt nghiệp cao đẳng hoặc tương đương; từ 2 năm chăm sóc khách
              hàng, trong đó từ 6 tháng dẫn dắt người khác; giao tiếp lời nói
              rõ ràng; giải quyết vấn đề điềm tĩnh; kỹ năng bảng tính cơ bản.</code></pre>
<h3>Phân tích theo năng lực và thiết kế công việc</h3>
<p>Nhiều doanh nghiệp nay mô tả công việc bằng <strong>năng lực</strong> — những hành vi quan sát được như “hướng tới khách hàng” hay “kèm cặp người khác” — vốn thích ứng tốt hơn danh sách nhiệm vụ cố định khi vai trò thay đổi nhanh. Phân tích công việc cũng là đầu vào cho <strong>thiết kế công việc</strong>: <em>mở rộng công việc</em> thêm nhiệm vụ cùng cấp độ, <em>luân chuyển công việc</em> đưa người qua lại giữa các công việc, và <em>làm giàu công việc</em> thêm trách nhiệm và quyền tự chủ. Mô hình đặc điểm công việc ở OBE102c giải thích vì sao làm giàu công việc thường tạo động lực.</p>
<div class="callout"><span class="badge">Mẹo</span> Giữ bản tiêu chuẩn <em>gắn với công việc</em>. Những yêu cầu như tuổi, giới tính hay ngoại hình mà công việc không thật sự cần là phân biệt đối xử và thu hẹp nguồn ứng viên một cách vô ích.</div>`,
  ]]);

const c3 = doc('hrm202c-1-3-workforce-planning', '1.3 — Workforce planning: forecasting demand and supply|||1.3 — Hoạch định nhân lực: dự báo cầu và cung',
  'Logic ba bước của hoạch định nhân lực, các kỹ thuật dự báo cầu (xu hướng, tỷ số, hồi quy, Delphi), dự báo cung nội bộ (hồ sơ kỹ năng, sơ đồ thay thế, kế thừa, phân tích Markov) và bên ngoài, ví dụ số Delta Retail, các phương án xử lý thiếu hụt và dư thừa.',
  [[
    `<span class="eyebrow">HRM202c · Part 1 · Lesson 1.3</span>
<h2>Workforce planning: forecasting demand and supply</h2>
<p class="lead">Workforce (human resource) planning is the process of deciding which positions the firm will have to fill and how to fill them, so that the right number of people with the right skills are available at the right time.</p>
<h3>The three-step logic</h3>
<ol>
<li>Forecast the <strong>demand</strong> for labour.</li>
<li>Forecast the <strong>supply</strong> of labour — internal and external.</li>
<li>Compare them and plan actions to close the <strong>gap</strong> (shortage or surplus).</li>
</ol>
<h3>Forecasting demand</h3>
<ul>
<li><strong>Trend analysis</strong> — extend the pattern of past headcount.</li>
<li><strong>Ratio analysis</strong> — use a stable ratio between a business driver and people needed (revenue per salesperson, patients per nurse).</li>
<li><strong>Scatter plots and regression</strong> — relate headcount to a driver statistically.</li>
<li><strong>Managerial judgement and the Delphi technique</strong> — experts give anonymous estimates over several rounds until they converge.</li>
</ul>
<p>Always adjust the numbers for expected productivity gains, new technology and strategic changes.</p>
<h3>Forecasting supply</h3>
<p><strong>Internal supply:</strong> HRIS records and <strong>skills inventories</strong>, <strong>replacement charts</strong> (who could step into each key role, and how soon), <strong>succession plans</strong>, and <strong>Markov analysis</strong>, which applies historical transition probabilities to today’s headcount to project where people will be next year. <strong>External supply:</strong> labour-market conditions, unemployment, graduates in relevant fields and competitors’ demand for the same skills.</p>
<h3>Worked example — Delta Retail (fictional, illustrative numbers)</h3>
<pre><code>DEMAND (ratio analysis)
Revenue now 150 billion VND with 300 store staff  → 0.5 billion per staff member
Revenue next year +10% = 165 billion  → staff needed       = 165 / 0.5 = 330
Span of control 1 supervisor : 5 staff → supervisors needed = 330 / 5  = 66
1 manager : 3 supervisors              → managers needed    = 66 / 3   = 22

SUPPLY (Markov analysis — annual transition probabilities)
From           Manager  Supervisor  Staff   Exit   Headcount now
Manager          0.80       –         –     0.20        20
Supervisor       0.10      0.75       –     0.15        60
Staff             –        0.05      0.80   0.15       300
Projected next year
  Managers    = 20 x 0.80 + 60 x 0.10  = 16 + 6  = 22
  Supervisors = 60 x 0.75 + 300 x 0.05 = 45 + 15 = 60
  Staff       = 300 x 0.80                       = 240
  Exits       = 4 + 9 + 45                       = 58
  Check: 22 + 60 + 240 + 58 = 380 = 20 + 60 + 300 ✓

GAP (demand − supply)
  Managers 22 − 22 = 0 · Supervisors 66 − 60 = 6 short · Staff 330 − 240 = 90 short</code></pre>
<p>The 90 staff gap already includes replacing the 45 expected leavers and the 15 staff promoted to supervisor, plus growth of 30 (45 + 15 + 30 = 90). The 6 supervisor gap can be met by promoting more strong staff through a development programme — but each promotion opens another staff vacancy (the chain effect of internal moves), so the staff gap to fill externally becomes 90 + 6 = 96. That staff gap needs external recruitment — lesson 2.1 shows how many applicants it requires.</p>
<h3>Closing the gap</h3>
<table>
<tr><th>Situation</th><th>Faster options (usually more cost or hardship)</th><th>Slower options (gentler)</th></tr>
<tr><td>Shortage</td><td>Overtime, temporary or agency workers, outsourcing</td><td>Retraining and internal transfers, reducing turnover, external hiring, automation</td></tr>
<tr><td>Surplus</td><td>Layoffs, pay cuts, demotions, transfers, work sharing</td><td>Hiring freeze, natural attrition, voluntary early retirement, retraining</td></tr>
</table>
<div class="callout"><span class="badge">Remember</span> A plan is only as good as its assumptions. Update the transition probabilities every year and run scenarios (for example revenue +5% and +15%) rather than trusting one number.</div>`,
    `<span class="eyebrow">HRM202c · Phần 1 · Bài 1.3</span>
<h2>Hoạch định nhân lực: dự báo cầu và cung</h2>
<p class="lead">Hoạch định nhân lực (hoạch định nguồn nhân lực) là quá trình xác định doanh nghiệp sẽ phải lấp những vị trí nào và lấp bằng cách nào, để có đúng số người với đúng kỹ năng vào đúng thời điểm.</p>
<h3>Logic ba bước</h3>
<ol>
<li>Dự báo <strong>cầu</strong> nhân lực.</li>
<li>Dự báo <strong>cung</strong> nhân lực — nội bộ và bên ngoài.</li>
<li>So sánh hai bên và lập kế hoạch hành động để thu hẹp <strong>khoảng chênh</strong> (thiếu hụt hoặc dư thừa).</li>
</ol>
<h3>Dự báo cầu</h3>
<ul>
<li><strong>Phân tích xu hướng</strong> — kéo dài xu hướng số lao động trong quá khứ.</li>
<li><strong>Phân tích tỷ số</strong> — dùng một tỷ lệ ổn định giữa một yếu tố kinh doanh và số người cần có (doanh thu trên mỗi nhân viên bán hàng, số bệnh nhân trên mỗi điều dưỡng).</li>
<li><strong>Biểu đồ phân tán và hồi quy</strong> — liên hệ số lao động với một yếu tố bằng thống kê.</li>
<li><strong>Phán đoán của nhà quản lý và kỹ thuật Delphi</strong> — các chuyên gia đưa ra ước tính ẩn danh qua nhiều vòng cho tới khi hội tụ.</li>
</ul>
<p>Luôn điều chỉnh con số theo mức tăng năng suất dự kiến, công nghệ mới và thay đổi chiến lược.</p>
<h3>Dự báo cung</h3>
<p><strong>Cung nội bộ:</strong> dữ liệu trong hệ thống thông tin nhân sự (HRIS) và <strong>hồ sơ kỹ năng</strong>, <strong>sơ đồ thay thế</strong> (ai có thể đảm nhận từng vị trí then chốt, và sau bao lâu), <strong>kế hoạch kế thừa</strong>, và <strong>phân tích Markov</strong>, áp các xác suất chuyển dịch trong quá khứ vào số lao động hiện tại để dự báo năm sau mọi người sẽ ở đâu. <strong>Cung bên ngoài:</strong> tình hình thị trường lao động, thất nghiệp, số sinh viên tốt nghiệp ngành liên quan và nhu cầu của đối thủ về cùng loại kỹ năng.</p>
<h3>Ví dụ có lời giải — Delta Retail (tình huống giả định, số liệu minh hoạ)</h3>
<pre><code>CẦU (phân tích tỷ số)
Doanh thu hiện nay 150 tỷ đồng với 300 nhân viên cửa hàng → 0,5 tỷ mỗi nhân viên
Doanh thu năm sau +10% = 165 tỷ   → nhân viên cần       = 165 / 0,5 = 330
Tầm hạn quản trị 1 giám sát : 5 nhân viên → giám sát cần = 330 / 5   = 66
1 quản lý : 3 giám sát                   → quản lý cần   = 66 / 3    = 22

CUNG (phân tích Markov — xác suất chuyển dịch hằng năm)
Từ             Quản lý  Giám sát  Nhân viên  Rời đi   Số hiện có
Quản lý          0,80      –         –        0,20        20
Giám sát         0,10     0,75       –        0,15        60
Nhân viên         –       0,05      0,80      0,15       300
Dự báo năm sau
  Quản lý   = 20 x 0,80 + 60 x 0,10  = 16 + 6  = 22
  Giám sát  = 60 x 0,75 + 300 x 0,05 = 45 + 15 = 60
  Nhân viên = 300 x 0,80                       = 240
  Rời đi    = 4 + 9 + 45                       = 58
  Kiểm tra: 22 + 60 + 240 + 58 = 380 = 20 + 60 + 300 ✓

KHOẢNG CHÊNH (cầu − cung)
  Quản lý 22 − 22 = 0 · Giám sát 66 − 60 = thiếu 6 · Nhân viên 330 − 240 = thiếu 90</code></pre>
<p>Khoảng thiếu 90 nhân viên đã bao gồm việc thay 45 người dự kiến nghỉ và 15 nhân viên được thăng lên giám sát, cộng mức tăng trưởng 30 (45 + 15 + 30 = 90). Khoảng thiếu 6 giám sát có thể lấp bằng cách thăng chức thêm những nhân viên giỏi qua một chương trình phát triển — nhưng mỗi lần thăng chức lại mở thêm một chỗ trống ở cấp nhân viên (hiệu ứng dây chuyền của dịch chuyển nội bộ), nên khoảng thiếu nhân viên phải tuyển từ bên ngoài thành 90 + 6 = 96. Khoảng thiếu nhân viên đó cần tuyển từ bên ngoài — bài 2.1 cho thấy cần bao nhiêu hồ sơ ứng tuyển.</p>
<h3>Thu hẹp khoảng chênh</h3>
<table>
<tr><th>Tình huống</th><th>Phương án nhanh (thường tốn kém hoặc gây khó khăn hơn)</th><th>Phương án chậm (nhẹ nhàng hơn)</th></tr>
<tr><td>Thiếu hụt</td><td>Làm thêm giờ, lao động thời vụ hoặc thuê lại, thuê ngoài</td><td>Đào tạo lại và điều chuyển nội bộ, giảm nghỉ việc, tuyển bên ngoài, tự động hoá</td></tr>
<tr><td>Dư thừa</td><td>Cắt giảm lao động, giảm lương, giáng chức, điều chuyển, chia sẻ công việc</td><td>Ngừng tuyển, để giảm tự nhiên, nghỉ hưu sớm tự nguyện, đào tạo lại</td></tr>
</table>
<div class="callout"><span class="badge">Ghi nhớ</span> Kế hoạch chỉ tốt bằng các giả định của nó. Cập nhật xác suất chuyển dịch hằng năm và chạy các kịch bản (ví dụ doanh thu +5% và +15%) thay vì tin vào một con số duy nhất.</div>`,
  ]]);

const c3q = quiz('hrm202c-quiz-1', 'Quiz 1 — Strategic HRM & workforce planning|||Quiz 1 — HRM chiến lược & hoạch định nhân lực', [
  { id: 'q1', question: 'Which document lists the knowledge, skills, abilities and other characteristics a job holder needs?|||Tài liệu nào liệt kê kiến thức, kỹ năng, khả năng và các đặc điểm khác mà người đảm nhận công việc cần có?', options: ['The job description|||Bản mô tả công việc', 'The organisation chart|||Sơ đồ tổ chức', 'The job specification|||Bản tiêu chuẩn công việc', 'The replacement chart|||Sơ đồ thay thế'], correctIndex: 2, explanation: 'The job description is about the job (duties, conditions); the job specification is about the person (KSAOs, qualifications, experience).|||Bản mô tả công việc nói về công việc (nhiệm vụ, điều kiện); bản tiêu chuẩn công việc nói về con người (KSAO, bằng cấp, kinh nghiệm).' },
  { id: 'q2', question: 'A firm keeps 1 supervisor for every 8 staff and forecasts 240 staff next year. Using ratio analysis, how many supervisors will it need?|||Một doanh nghiệp duy trì 1 giám sát cho mỗi 8 nhân viên và dự báo năm sau có 240 nhân viên. Theo phân tích tỷ số, cần bao nhiêu giám sát?', options: ['24|||24', '30|||30', '32|||32', '38|||38'], correctIndex: 1, explanation: '240 / 8 = 30 supervisors.|||240 / 8 = 30 giám sát.' },
  { id: 'q3', question: 'According to the resource-based view, a workforce is a source of sustained competitive advantage when it is…|||Theo quan điểm dựa trên nguồn lực, đội ngũ lao động là nguồn lợi thế cạnh tranh bền vững khi nó…', options: ['valuable, rare, hard to imitate and hard to substitute|||có giá trị, hiếm, khó bắt chước và khó thay thế', 'large, cheap and easy to replace|||đông, rẻ và dễ thay thế', 'paid exactly the market median|||được trả đúng mức trung vị thị trường', 'managed only by the HR department|||chỉ do phòng nhân sự quản lý'], correctIndex: 0, explanation: 'Resources that competitors can easily buy or copy cannot give a lasting advantage; skilled, committed people embedded in the firm’s culture are hard to copy.|||Nguồn lực mà đối thủ dễ mua hoặc sao chép không tạo được lợi thế lâu dài; con người giỏi, gắn bó, đã thấm vào văn hoá doanh nghiệp thì khó sao chép.' },
]);

const c4 = doc('hrm202c-2-1-recruitment', '2.1 — Recruitment: building the applicant pool|||2.1 — Tuyển mộ: xây dựng nguồn ứng viên',
  'Nguồn nội bộ và bên ngoài (ưu, nhược), giới thiệu từ nhân viên, tháp năng suất tuyển mộ và tỷ lệ chuyển đổi qua từng vòng, so sánh kênh tuyển theo chi phí một người và tỷ lệ tuyển được, thương hiệu nhà tuyển dụng (EVP), xem trước công việc thực tế (RJP), tuyển mộ công bằng.',
  [[
    `<span class="eyebrow">HRM202c · Part 2 · Lesson 2.1</span>
<h2>Recruitment: building the applicant pool</h2>
<p class="lead">Recruitment attracts a pool of qualified applicants; selection (lessons 2.2–2.3) chooses among them. A weak pool cannot be rescued by an excellent selection process — you can only choose from the people who apply.</p>
<h3>Internal vs external sources</h3>
<table>
<tr><th></th><th>Internal (promotion, transfer, job posting, rehiring former staff)</th><th>External (job boards, social media, employee referrals, agencies, executive search, campus)</th></tr>
<tr><td>Advantages</td><td>Known performance record; signals career paths and motivates staff; faster and cheaper onboarding</td><td>New ideas and skills; much larger pool; necessary for growth or strategic change</td></tr>
<tr><td>Disadvantages</td><td>Limited pool; each move creates another vacancy; risk of “inbreeding” and resentment among those not chosen</td><td>Higher cost and time; less reliable information about the candidate; longer adjustment</td></tr>
</table>
<p><strong>Employee referrals</strong> are external candidates found through current employees. They often fit and stay well because referrers know both the job and the person, but relying on them alone can reduce diversity.</p>
<h3>The recruiting yield pyramid</h3>
<p>Historical <strong>yield ratios</strong> — the share of candidates who pass from one stage to the next — tell you how many applicants you need. Delta Retail (lesson 1.3) plans a hiring wave of 20 store staff (illustrative ratios):</p>
<pre><code>Hires needed                                   20
Offer acceptance 80%          → offers        = 20 / 0.80  = 25
Offers made to 50% of interviewees → interviews = 25 / 0.50 = 50
50% of phone screens reach interview → screens = 50 / 0.50 = 100
25% of applications pass CV screening → applications = 100 / 0.25 = 400</code></pre>
<p>Ninety-six external staff hires for the year (lesson 1.3, after promoting 6 staff to supervisor) therefore means several such waves — and if yield ratios worsen (for example because pay is below market), the required pool grows quickly.</p>
<h3>Comparing sources (illustrative data for one wave)</h3>
<table>
<tr><th>Source</th><th>Applicants</th><th>Hires</th><th>Cost (VND million)</th><th>Cost per hire</th><th>Applicant-to-hire yield</th></tr>
<tr><td>Job board</td><td>250</td><td>8</td><td>64</td><td>8.0</td><td>3.2%</td></tr>
<tr><td>Employee referral</td><td>40</td><td>6</td><td>30</td><td>5.0</td><td>15.0%</td></tr>
<tr><td>Recruitment agency</td><td>30</td><td>4</td><td>96</td><td>24.0</td><td>13.3%</td></tr>
<tr><td>Campus</td><td>80</td><td>2</td><td>20</td><td>10.0</td><td>2.5%</td></tr>
<tr><td><strong>Total</strong></td><td>400</td><td>20</td><td>210</td><td>10.5</td><td>5.0%</td></tr>
</table>
<p>Cost is only one lens. Before cutting a channel, also compare <em>quality of hire</em> (for example first-year performance ratings) and <em>retention</em> by source. An agency may be worth its cost for scarce skills; a campus programme may be a long-term pipeline for future supervisors.</p>
<h3>Employer brand and realistic job previews</h3>
<p>An <strong>employer value proposition (EVP)</strong> states what people get in return for working for you — pay, growth, culture, purpose, flexibility. Job advertisements should be honest and specific about duties, requirements and pay range where possible. A <strong>realistic job preview (RJP)</strong> shows both the attractive and the difficult sides of the job (for example weekend shifts and peak-season pressure); candidates who would not cope can self-select out, which tends to reduce early turnover.</p>
<h3>Recruiting fairly</h3>
<ul>
<li>Advertise only job-related requirements (lesson 1.2).</li>
<li>Avoid wording that signals a preferred gender, age or appearance.</li>
<li>Use several channels so the pool is not limited to one social network.</li>
<li>Track the make-up of the pool at each stage to spot where groups drop out.</li>
</ul>
<div class="callout"><span class="badge">Practice</span> Where feasible, post vacancies internally before advertising externally. It signals that careers exist inside the firm, and an internal candidate’s record reduces the risk of a wrong hire.</div>`,
    `<span class="eyebrow">HRM202c · Phần 2 · Bài 2.1</span>
<h2>Tuyển mộ: xây dựng nguồn ứng viên</h2>
<p class="lead">Tuyển mộ thu hút một nguồn ứng viên đủ tiêu chuẩn; tuyển chọn (bài 2.2–2.3) chọn người trong nguồn đó. Một nguồn yếu thì không quy trình tuyển chọn xuất sắc nào cứu được — bạn chỉ có thể chọn trong số những người đã nộp hồ sơ.</p>
<h3>Nguồn nội bộ và nguồn bên ngoài</h3>
<table>
<tr><th></th><th>Nội bộ (thăng chức, điều chuyển, thông báo tuyển nội bộ, tuyển lại nhân viên cũ)</th><th>Bên ngoài (trang việc làm, mạng xã hội, nhân viên giới thiệu, công ty tuyển dụng, săn đầu người, tuyển tại trường)</th></tr>
<tr><td>Ưu điểm</td><td>Đã biết thành tích; cho thấy có lộ trình nghề nghiệp và tạo động lực; hội nhập nhanh và rẻ hơn</td><td>Ý tưởng và kỹ năng mới; nguồn lớn hơn nhiều; cần thiết khi tăng trưởng hay thay đổi chiến lược</td></tr>
<tr><td>Nhược điểm</td><td>Nguồn hạn chế; mỗi lần điều chuyển lại tạo một chỗ trống khác; nguy cơ “đồng huyết” và bất mãn ở người không được chọn</td><td>Tốn chi phí và thời gian hơn; thông tin về ứng viên kém tin cậy hơn; thời gian thích nghi dài hơn</td></tr>
</table>
<p><strong>Nhân viên giới thiệu</strong> là ứng viên bên ngoài được tìm qua nhân viên hiện tại. Họ thường phù hợp và gắn bó tốt vì người giới thiệu hiểu cả công việc lẫn con người, nhưng chỉ dựa vào kênh này có thể làm giảm sự đa dạng.</p>
<h3>Tháp năng suất tuyển mộ</h3>
<p>Các <strong>tỷ lệ chuyển đổi</strong> trong quá khứ — phần ứng viên đi tiếp từ vòng này sang vòng sau — cho biết cần bao nhiêu hồ sơ. Delta Retail (bài 1.3) lên kế hoạch một đợt tuyển 20 nhân viên cửa hàng (tỷ lệ minh hoạ):</p>
<pre><code>Số người cần tuyển                                  20
Tỷ lệ nhận lời mời 80%          → số lời mời       = 20 / 0,80  = 25
Mời làm việc 50% người phỏng vấn → số phỏng vấn     = 25 / 0,50  = 50
50% người qua sàng lọc qua điện thoại được phỏng vấn → sàng lọc = 50 / 0,50 = 100
25% hồ sơ qua vòng lọc CV       → số hồ sơ         = 100 / 0,25 = 400</code></pre>
<p>Vì vậy 96 nhân viên cần tuyển từ bên ngoài trong năm (bài 1.3, sau khi thăng 6 nhân viên lên giám sát) nghĩa là nhiều đợt như thế — và nếu tỷ lệ chuyển đổi xấu đi (chẳng hạn vì lương thấp hơn thị trường), nguồn cần có sẽ phình ra rất nhanh.</p>
<h3>So sánh các kênh tuyển (số liệu minh hoạ cho một đợt)</h3>
<table>
<tr><th>Kênh</th><th>Số ứng viên</th><th>Số tuyển được</th><th>Chi phí (triệu đồng)</th><th>Chi phí một người</th><th>Tỷ lệ ứng viên → tuyển</th></tr>
<tr><td>Trang việc làm</td><td>250</td><td>8</td><td>64</td><td>8,0</td><td>3,2%</td></tr>
<tr><td>Nhân viên giới thiệu</td><td>40</td><td>6</td><td>30</td><td>5,0</td><td>15,0%</td></tr>
<tr><td>Công ty tuyển dụng</td><td>30</td><td>4</td><td>96</td><td>24,0</td><td>13,3%</td></tr>
<tr><td>Tuyển tại trường</td><td>80</td><td>2</td><td>20</td><td>10,0</td><td>2,5%</td></tr>
<tr><td><strong>Tổng</strong></td><td>400</td><td>20</td><td>210</td><td>10,5</td><td>5,0%</td></tr>
</table>
<p>Chi phí chỉ là một góc nhìn. Trước khi cắt một kênh, hãy so sánh thêm <em>chất lượng tuyển dụng</em> (ví dụ điểm đánh giá hiệu suất năm đầu) và <em>tỷ lệ giữ chân</em> theo từng kênh. Công ty tuyển dụng có thể đáng tiền với kỹ năng khan hiếm; chương trình tuyển tại trường có thể là đường ống dài hạn cho các giám sát tương lai.</p>
<h3>Thương hiệu nhà tuyển dụng và xem trước công việc thực tế</h3>
<p><strong>Tuyên bố giá trị dành cho nhân viên (EVP)</strong> nói rõ người lao động nhận được gì khi làm việc cho bạn — lương, cơ hội phát triển, văn hoá, ý nghĩa công việc, sự linh hoạt. Tin tuyển dụng nên trung thực và cụ thể về nhiệm vụ, yêu cầu và khoảng lương nếu có thể. <strong>Xem trước công việc thực tế (RJP)</strong> cho thấy cả mặt hấp dẫn lẫn mặt khó của công việc (ví dụ ca cuối tuần và áp lực mùa cao điểm); ứng viên không kham nổi có thể tự rút lui, nhờ đó thường giảm tỷ lệ nghỉ việc sớm.</p>
<h3>Tuyển mộ công bằng</h3>
<ul>
<li>Chỉ đăng các yêu cầu gắn với công việc (bài 1.2).</li>
<li>Tránh câu chữ ngầm ưu tiên một giới tính, độ tuổi hay ngoại hình.</li>
<li>Dùng nhiều kênh để nguồn ứng viên không bị bó trong một mạng quan hệ.</li>
<li>Theo dõi cơ cấu nguồn ứng viên ở từng vòng để phát hiện nhóm nào rơi rụng ở đâu.</li>
</ul>
<div class="callout"><span class="badge">Thực hành</span> Khi có thể, hãy thông báo tuyển nội bộ trước khi đăng tuyển bên ngoài. Điều này cho thấy trong doanh nghiệp có con đường sự nghiệp, và thành tích sẵn có của ứng viên nội bộ giúp giảm rủi ro tuyển sai.</div>`,
  ]]);

const c5 = doc('hrm202c-2-2-reliability-validity', '2.2 — Selection tools: reliability & validity|||2.2 — Công cụ tuyển chọn: độ tin cậy & độ hiệu lực',
  'Độ tin cậy (test–retest, dạng song song, nhất quán nội tại, giữa người chấm) và độ hiệu lực (theo tiêu chí, nội dung, cấu trúc), hệ số hiệu lực và r bình phương, tính khái quát, hữu dụng, công bằng, bảng so sánh các công cụ tuyển chọn (trắc nghiệm năng lực, tính cách, mẫu công việc, trung tâm đánh giá, phán đoán tình huống).',
  [[
    `<span class="eyebrow">HRM202c · Part 2 · Lesson 2.2</span>
<h2>Selection tools: reliability &amp; validity</h2>
<p class="lead">Selection predicts future job performance from limited information. The quality of that prediction depends on two properties of every selection tool: reliability and validity.</p>
<h3>Reliability — is the measure consistent?</h3>
<ul>
<li><strong>Test–retest:</strong> the same person gets similar scores on two occasions.</li>
<li><strong>Alternate (parallel) forms:</strong> two versions of a test give similar scores.</li>
<li><strong>Internal consistency:</strong> items meant to measure the same thing agree with each other (often reported as Cronbach’s alpha).</li>
<li><strong>Inter-rater reliability:</strong> different interviewers or assessors give similar ratings to the same candidate.</li>
</ul>
<h3>Validity — does it measure what matters for the job?</h3>
<ul>
<li><strong>Criterion-related validity:</strong> scores correlate with a criterion such as job performance. <em>Predictive</em> designs test applicants and measure their performance later; <em>concurrent</em> designs test current employees and compare with their current performance.</li>
<li><strong>Content validity:</strong> the tool samples the actual content of the job — a spreadsheet task for an analyst, a mock customer call for an agent.</li>
<li><strong>Construct validity:</strong> the tool really measures the underlying trait it claims to measure, such as conscientiousness.</li>
</ul>
<pre><code>Validity coefficient r ranges from −1 to +1.
r squared = share of differences in performance "explained" by the tool
r = 0.40 → 0.40 x 0.40 = 0.16 → 16%        r = 0.50 → 25%</code></pre>
<p>A tool can be <strong>reliable but not valid</strong> — a very consistent measure of the wrong thing — but it cannot be valid if it is unreliable. Good tools are also <strong>generalisable</strong> to similar jobs, have <strong>utility</strong> (benefits exceed costs) and are <strong>legal and fair</strong>.</p>
<h3>Common selection tools</h3>
<table>
<tr><th>Tool</th><th>What it measures</th><th>Notes</th></tr>
<tr><td>Cognitive ability tests</td><td>Reasoning, learning speed, problem solving</td><td>Among the stronger predictors across many jobs; monitor score differences between groups</td></tr>
<tr><td>Personality inventories (Big Five)</td><td>Traits; conscientiousness relates to performance in most jobs</td><td>Use validated instruments; candidates may try to fake answers</td></tr>
<tr><td>Work samples and simulations</td><td>Performance on real job tasks</td><td>High content validity; candidates see them as fair</td></tr>
<tr><td>Assessment centres</td><td>Several exercises (in-basket, group discussion, role play) rated by trained assessors</td><td>Costly; mostly for managerial roles</td></tr>
<tr><td>Situational judgement tests</td><td>Choice of the best response to realistic job scenarios</td><td>Useful for customer-facing and supervisory roles</td></tr>
<tr><td>Reference and background checks</td><td>Past behaviour, credentials</td><td>Verify facts; respect personal-data rules and consent</td></tr>
<tr><td>Interviews</td><td>Many attributes</td><td>Validity depends heavily on structure</td></tr>
</table>
<div class="callout"><span class="badge">Rule of thumb</span> Before using any selection tool, ask three questions. Does it measure consistently (reliability)? Does it predict performance in this job (validity)? Is it fair and worth its cost (fairness, utility)? A tool that fails any one of them should not drive hiring decisions.</div>`,
    `<span class="eyebrow">HRM202c · Phần 2 · Bài 2.2</span>
<h2>Công cụ tuyển chọn: độ tin cậy &amp; độ hiệu lực</h2>
<p class="lead">Tuyển chọn là dự đoán hiệu suất công việc tương lai từ một lượng thông tin hạn chế. Chất lượng của dự đoán phụ thuộc vào hai thuộc tính của mọi công cụ tuyển chọn: độ tin cậy và độ hiệu lực.</p>
<h3>Độ tin cậy — phép đo có nhất quán không?</h3>
<ul>
<li><strong>Kiểm tra – kiểm tra lại (test–retest):</strong> cùng một người đạt điểm tương tự ở hai lần đo.</li>
<li><strong>Dạng song song:</strong> hai phiên bản của một bài kiểm tra cho điểm tương tự.</li>
<li><strong>Nhất quán nội tại:</strong> các câu hỏi cùng đo một thứ thì cho kết quả khớp nhau (thường báo cáo bằng hệ số Cronbach’s alpha).</li>
<li><strong>Độ tin cậy giữa người chấm:</strong> các người phỏng vấn hoặc đánh giá khác nhau cho điểm tương tự cùng một ứng viên.</li>
</ul>
<h3>Độ hiệu lực — có đo đúng điều quan trọng với công việc không?</h3>
<ul>
<li><strong>Hiệu lực theo tiêu chí:</strong> điểm số tương quan với một tiêu chí như hiệu suất công việc. Thiết kế <em>dự báo</em> kiểm tra ứng viên rồi đo hiệu suất sau này; thiết kế <em>đồng thời</em> kiểm tra nhân viên đang làm và so với hiệu suất hiện tại của họ.</li>
<li><strong>Hiệu lực nội dung:</strong> công cụ lấy mẫu đúng nội dung thực của công việc — một bài bảng tính cho chuyên viên phân tích, một cuộc gọi giả lập cho nhân viên chăm sóc khách hàng.</li>
<li><strong>Hiệu lực cấu trúc (khái niệm):</strong> công cụ thực sự đo đặc điểm nền tảng mà nó tuyên bố đo, chẳng hạn tính tận tâm.</li>
</ul>
<pre><code>Hệ số hiệu lực r nằm trong khoảng từ −1 đến +1.
r bình phương = phần khác biệt về hiệu suất được công cụ "giải thích"
r = 0,40 → 0,40 x 0,40 = 0,16 → 16%        r = 0,50 → 25%</code></pre>
<p>Một công cụ có thể <strong>tin cậy nhưng không hiệu lực</strong> — đo rất nhất quán một thứ sai — nhưng không thể có hiệu lực nếu thiếu tin cậy. Công cụ tốt còn phải <strong>khái quát được</strong> cho các công việc tương tự, có <strong>tính hữu dụng</strong> (lợi ích lớn hơn chi phí) và <strong>hợp pháp, công bằng</strong>.</p>
<h3>Các công cụ tuyển chọn thông dụng</h3>
<table>
<tr><th>Công cụ</th><th>Đo gì</th><th>Lưu ý</th></tr>
<tr><td>Trắc nghiệm năng lực nhận thức</td><td>Suy luận, tốc độ học, giải quyết vấn đề</td><td>Thuộc nhóm dự báo tốt ở nhiều loại công việc; theo dõi chênh lệch điểm giữa các nhóm</td></tr>
<tr><td>Trắc nghiệm tính cách (Big Five)</td><td>Các nét tính cách; tính tận tâm liên quan tới hiệu suất ở hầu hết công việc</td><td>Dùng công cụ đã được kiểm định; ứng viên có thể cố trả lời “đẹp”</td></tr>
<tr><td>Mẫu công việc và mô phỏng</td><td>Kết quả khi làm nhiệm vụ thật của công việc</td><td>Hiệu lực nội dung cao; ứng viên thấy công bằng</td></tr>
<tr><td>Trung tâm đánh giá</td><td>Nhiều bài tập (xử lý hồ sơ công văn, thảo luận nhóm, đóng vai) do người đánh giá được đào tạo chấm</td><td>Tốn kém; chủ yếu cho vị trí quản lý</td></tr>
<tr><td>Trắc nghiệm phán đoán tình huống</td><td>Chọn phản ứng tốt nhất trước các tình huống công việc thực tế</td><td>Hữu ích cho vị trí tiếp xúc khách hàng và giám sát</td></tr>
<tr><td>Kiểm tra tham chiếu và lý lịch</td><td>Hành vi trong quá khứ, bằng cấp</td><td>Xác minh sự thật; tôn trọng quy định về dữ liệu cá nhân và sự đồng ý</td></tr>
<tr><td>Phỏng vấn</td><td>Nhiều thuộc tính</td><td>Độ hiệu lực phụ thuộc rất nhiều vào mức độ cấu trúc</td></tr>
</table>
<div class="callout"><span class="badge">Quy tắc nhanh</span> Trước khi dùng bất kỳ công cụ tuyển chọn nào, hãy hỏi ba câu. Nó có đo nhất quán không (độ tin cậy)? Nó có dự báo được hiệu suất ở công việc này không (độ hiệu lực)? Nó có công bằng và đáng chi phí không (công bằng, hữu dụng)? Công cụ trượt bất kỳ câu nào thì không nên dùng để ra quyết định tuyển dụng.</div>`,
  ]]);

const c5b = doc('hrm202c-2-3-structured-interviews', '2.3 — Structured interviews & fair selection decisions|||2.3 — Phỏng vấn có cấu trúc & quyết định tuyển chọn công bằng',
  'Năm yếu tố của phỏng vấn có cấu trúc, câu hỏi tình huống và câu hỏi hành vi (STAR), thang điểm có neo, các lỗi của người phỏng vấn, kiểm tra tác động bất lợi bằng tỷ số bốn phần năm, cách kết hợp thông tin bù trừ và nhiều rào cản.',
  [[
    `<span class="eyebrow">HRM202c · Part 2 · Lesson 2.3</span>
<h2>Structured interviews &amp; fair selection decisions</h2>
<p class="lead">The interview is the most widely used selection tool — and, when unstructured, one of the noisiest. This lesson shows how to structure it, how to check the fairness of the whole process, and how to combine several pieces of evidence into one decision.</p>
<h3>Structured interviews</h3>
<p>Research consistently finds that <strong>structured interviews</strong> predict job performance better than unstructured conversations. Structure means:</p>
<ol>
<li>Questions derived from job analysis, with the same core questions for every candidate.</li>
<li>Two question types: <strong>situational</strong> (“What would you do if a customer shouted at your agent?”) and <strong>behavioural</strong> (“Tell me about a time you turned around an unhappy customer”), with answers probed using <strong>STAR</strong> — Situation, Task, Action, Result.</li>
<li><strong>Anchored rating scales</strong>, for example 1–5 with a behavioural example for 1, 3 and 5.</li>
<li>Several trained interviewers score <strong>independently</strong>, then discuss the evidence.</li>
<li>Notes taken; weights and minimum scores agreed <strong>before</strong> the interviews.</li>
</ol>
<h3>Interviewer errors to avoid</h3>
<p>Snap judgements in the first minutes; first-impression and halo effects; similar-to-me bias; contrast effects (judging a candidate against the previous one); being swayed by non-verbal behaviour or appearance; and talking more than listening.</p>
<h3>Fairness check — adverse impact</h3>
<pre><code>Selection rate, group A = 60 hired / 200 applicants = 30%
Selection rate, group B = 20 hired / 100 applicants = 20%
Impact ratio = 20% / 30% = 0.67   → below 0.80</code></pre>
<p>Under the US “four-fifths rule of thumb”, an impact ratio below 0.80 signals possible adverse impact that should be investigated: is each step job-related, and is there a fairer tool that predicts as well? Vietnamese labour law also prohibits discrimination in employment, so the ratio is a useful internal check anywhere.</p>
<h3>Combining the information</h3>
<p>In a <strong>compensatory</strong> approach, a high score on one criterion can offset a low score on another (weighted total). In a <strong>multiple-hurdle</strong> approach, candidates must reach a minimum at each step before moving on. Many firms combine them — Exercise 1 shows why.</p>
<div class="callout"><span class="badge">Remember</span> The goal is not to find the most impressive talker but the best predictor of performance. Structure, evidence and independent scoring beat gut feeling.</div>`,
    `<span class="eyebrow">HRM202c · Phần 2 · Bài 2.3</span>
<h2>Phỏng vấn có cấu trúc &amp; quyết định tuyển chọn công bằng</h2>
<p class="lead">Phỏng vấn là công cụ tuyển chọn được dùng nhiều nhất — và khi không có cấu trúc, là một trong những công cụ nhiễu nhất. Bài này chỉ cách cấu trúc buổi phỏng vấn, cách kiểm tra tính công bằng của cả quy trình, và cách kết hợp nhiều nguồn bằng chứng thành một quyết định.</p>
<h3>Phỏng vấn có cấu trúc</h3>
<p>Nghiên cứu nhất quán cho thấy <strong>phỏng vấn có cấu trúc</strong> dự báo hiệu suất công việc tốt hơn những cuộc trò chuyện không cấu trúc. Cấu trúc nghĩa là:</p>
<ol>
<li>Câu hỏi xuất phát từ phân tích công việc, cùng bộ câu hỏi cốt lõi cho mọi ứng viên.</li>
<li>Hai loại câu hỏi: <strong>tình huống</strong> (“Bạn sẽ làm gì nếu một khách hàng quát tháo nhân viên của bạn?”) và <strong>hành vi</strong> (“Hãy kể về một lần bạn xoay chuyển được một khách hàng đang không hài lòng”), câu trả lời được đào sâu theo <strong>STAR</strong> — Tình huống, Nhiệm vụ, Hành động, Kết quả.</li>
<li><strong>Thang điểm có neo hành vi</strong>, ví dụ 1–5 với ví dụ hành vi cho mức 1, 3 và 5.</li>
<li>Nhiều người phỏng vấn đã được đào tạo chấm <strong>độc lập</strong>, sau đó thảo luận bằng chứng.</li>
<li>Có ghi chép; trọng số và điểm tối thiểu được thống nhất <strong>trước</strong> buổi phỏng vấn.</li>
</ol>
<h3>Lỗi của người phỏng vấn cần tránh</h3>
<p>Kết luận vội trong vài phút đầu; hiệu ứng ấn tượng ban đầu và hiệu ứng hào quang; thiên kiến “giống tôi”; hiệu ứng tương phản (đánh giá ứng viên so với người vừa phỏng vấn trước); bị chi phối bởi cử chỉ hay ngoại hình; và nói nhiều hơn nghe.</p>
<h3>Kiểm tra công bằng — tác động bất lợi</h3>
<pre><code>Tỷ lệ được chọn, nhóm A = 60 người được tuyển / 200 ứng viên = 30%
Tỷ lệ được chọn, nhóm B = 20 người được tuyển / 100 ứng viên = 20%
Tỷ số tác động = 20% / 30% = 0,67   → dưới 0,80</code></pre>
<p>Theo “quy tắc kinh nghiệm bốn phần năm” của Mỹ, tỷ số tác động dưới 0,80 là dấu hiệu có thể có tác động bất lợi, cần điều tra: từng bước có gắn với công việc không, có công cụ công bằng hơn mà dự báo tốt tương đương không? Luật lao động Việt Nam cũng cấm phân biệt đối xử trong lao động, nên tỷ số này là một phép kiểm nội bộ hữu ích ở bất cứ đâu.</p>
<h3>Kết hợp thông tin</h3>
<p>Trong cách tiếp cận <strong>bù trừ</strong>, điểm cao ở tiêu chí này có thể bù cho điểm thấp ở tiêu chí khác (tổng có trọng số). Trong cách tiếp cận <strong>nhiều rào cản</strong>, ứng viên phải đạt mức tối thiểu ở từng bước mới được đi tiếp. Nhiều doanh nghiệp kết hợp cả hai — Bài tập 1 cho thấy vì sao.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Mục tiêu không phải là tìm người nói hay nhất mà là yếu tố dự báo hiệu suất tốt nhất. Cấu trúc, bằng chứng và chấm điểm độc lập thắng cảm tính.</div>`,
  ]]);

const c5e = doc('hrm202c-2-4-exercise', 'Exercise 1 — choose a team leader with a structured interview|||Bài tập 1 — chọn trưởng nhóm bằng phỏng vấn có cấu trúc',
  'Bài tập tình huống giả định: chấm ba ứng viên trưởng nhóm chăm sóc khách hàng bằng tiêu chí có trọng số, áp dụng rào cản điểm tối thiểu về tính chính trực, xử lý khi người phỏng vấn chấm lệch nhau và kiểm tra độ nhạy của quyết định; kèm lời giải.',
  [[
    `<span class="eyebrow">HRM202c · Part 2 · Exercise 1</span>
<h2>Exercise 1 — choose a team leader with a structured interview</h2>
<div class="callout"><span class="badge">Problem</span> Delta Retail (a fictional company) is hiring a Customer Service Team Leader (job description in lesson 1.2). A panel of three trained interviewers used the same structured guide and a 1–5 anchored scale. The table below shows each candidate’s average panel score (illustrative numbers). Weights: customer focus 25%, problem solving 20%, team leadership 25%, communication 15%, integrity 15%. Decision rule agreed before the interviews: integrity must be at least 3.0. (a) Compute each candidate’s weighted score. (b) Apply the decision rule and recommend a hire. (c) Chi’s three raw ratings for team leadership were 4, 3 and 2. What should the panel do, and how sensitive is the decision to this one rating — for example if calibration moved it to 4.0?</div>
<table>
<tr><th>Criterion (weight)</th><th>An</th><th>Binh</th><th>Chi</th></tr>
<tr><td>Customer focus (25%)</td><td>4.0</td><td>4.5</td><td>3.5</td></tr>
<tr><td>Problem solving (20%)</td><td>3.5</td><td>4.5</td><td>5.0</td></tr>
<tr><td>Team leadership (25%)</td><td>4.0</td><td>4.5</td><td>3.0</td></tr>
<tr><td>Communication (15%)</td><td>4.5</td><td>4.0</td><td>3.5</td></tr>
<tr><td>Integrity (15%, minimum 3.0)</td><td>4.0</td><td>2.5</td><td>4.5</td></tr>
</table>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Weighted score = sum of (weight x score)
    An   = 0.25x4.0 + 0.20x3.5 + 0.25x4.0 + 0.15x4.5 + 0.15x4.0
         = 1.000 + 0.700 + 1.000 + 0.675 + 0.600 = 3.975
    Binh = 1.125 + 0.900 + 1.125 + 0.600 + 0.375 = 4.125
    Chi  = 0.875 + 1.000 + 0.750 + 0.525 + 0.675 = 3.825
    Compensatory ranking: Binh 4.125 &gt; An 3.975 &gt; Chi 3.825

(b) Hurdle: integrity must be at least 3.0
    Binh 2.5 → fails → eliminated, despite the highest weighted score
    Remaining: An 3.975 &gt; Chi 3.825 → recommend An; keep Chi as the reserve candidate

(c) Chi, team leadership: ratings 4, 3, 2 → mean 3.0, spread (max − min) 4 − 2 = 2 points
    A 2-point spread means the raters saw different things: do not just average.
    Each interviewer presents the evidence (STAR notes); the panel re-rates against the anchors.
    Sensitivity: if calibrated to 4.0 → Chi = 3.825 + 0.25 x (4.0 − 3.0) = 4.075 &gt; An 3.975
    → the decision would flip, so the calibration must happen before any offer is made.</code></pre>
<p><strong>Why:</strong> the weights and the hurdle express what the job needs, and they must be fixed before the interviews — otherwise a panel can bend the rules towards a favourite. A purely compensatory rule would let strong skills hide an integrity concern; the hurdle prevents that. The small gap between An and Chi shows that one poorly evidenced rating can change a hiring decision: structure reduces noise, but it does not remove the need for an evidence-based discussion.</p>`,
    `<span class="eyebrow">HRM202c · Phần 2 · Bài tập 1</span>
<h2>Bài tập 1 — chọn trưởng nhóm bằng phỏng vấn có cấu trúc</h2>
<div class="callout"><span class="badge">Đề</span> Delta Retail (công ty giả định) tuyển Trưởng nhóm chăm sóc khách hàng (bản mô tả công việc ở bài 1.2). Hội đồng ba người phỏng vấn đã được đào tạo dùng cùng một bộ câu hỏi có cấu trúc và thang 1–5 có neo hành vi. Bảng dưới cho điểm trung bình của hội đồng với từng ứng viên (số liệu minh hoạ). Trọng số: hướng tới khách hàng 25%, giải quyết vấn đề 20%, dẫn dắt nhóm 25%, giao tiếp 15%, chính trực 15%. Quy tắc quyết định đã thống nhất trước buổi phỏng vấn: điểm chính trực phải từ 3,0 trở lên. (a) Tính điểm có trọng số của từng ứng viên. (b) Áp dụng quy tắc quyết định và đề xuất người được tuyển. (c) Ba điểm gốc của Chi ở tiêu chí dẫn dắt nhóm là 4, 3 và 2. Hội đồng nên làm gì, và quyết định nhạy cảm thế nào với riêng điểm này — ví dụ nếu sau khi hiệu chỉnh điểm thành 4,0?</div>
<table>
<tr><th>Tiêu chí (trọng số)</th><th>An</th><th>Bình</th><th>Chi</th></tr>
<tr><td>Hướng tới khách hàng (25%)</td><td>4,0</td><td>4,5</td><td>3,5</td></tr>
<tr><td>Giải quyết vấn đề (20%)</td><td>3,5</td><td>4,5</td><td>5,0</td></tr>
<tr><td>Dẫn dắt nhóm (25%)</td><td>4,0</td><td>4,5</td><td>3,0</td></tr>
<tr><td>Giao tiếp (15%)</td><td>4,5</td><td>4,0</td><td>3,5</td></tr>
<tr><td>Chính trực (15%, tối thiểu 3,0)</td><td>4,0</td><td>2,5</td><td>4,5</td></tr>
</table>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Điểm có trọng số = tổng của (trọng số x điểm)
    An   = 0,25x4,0 + 0,20x3,5 + 0,25x4,0 + 0,15x4,5 + 0,15x4,0
         = 1,000 + 0,700 + 1,000 + 0,675 + 0,600 = 3,975
    Bình = 1,125 + 0,900 + 1,125 + 0,600 + 0,375 = 4,125
    Chi  = 0,875 + 1,000 + 0,750 + 0,525 + 0,675 = 3,825
    Xếp hạng bù trừ: Bình 4,125 &gt; An 3,975 &gt; Chi 3,825

(b) Rào cản: điểm chính trực phải từ 3,0 trở lên
    Bình 2,5 → không đạt → bị loại, dù có điểm có trọng số cao nhất
    Còn lại: An 3,975 &gt; Chi 3,825 → đề xuất tuyển An; giữ Chi làm ứng viên dự phòng

(c) Chi, dẫn dắt nhóm: điểm 4, 3, 2 → trung bình 3,0, khoảng chênh (max − min) 4 − 2 = 2 điểm
    Chênh 2 điểm nghĩa là các người chấm đã thấy những điều khác nhau: không nên chỉ lấy trung bình.
    Từng người trình bày bằng chứng (ghi chép STAR); hội đồng chấm lại theo các mức neo.
    Độ nhạy: nếu hiệu chỉnh thành 4,0 → Chi = 3,825 + 0,25 x (4,0 − 3,0) = 4,075 &gt; An 3,975
    → quyết định sẽ đảo ngược, nên phải hiệu chỉnh xong trước khi đưa ra bất kỳ lời mời nào.</code></pre>
<p><strong>Vì sao:</strong> trọng số và rào cản thể hiện điều công việc cần, và phải được chốt trước buổi phỏng vấn — nếu không, hội đồng có thể bẻ quy tắc theo hướng có lợi cho người mình thích. Một quy tắc bù trừ thuần tuý sẽ để kỹ năng mạnh che lấp một mối lo về tính chính trực; rào cản ngăn điều đó. Khoảng cách nhỏ giữa An và Chi cho thấy chỉ một điểm chấm thiếu bằng chứng cũng có thể đổi một quyết định tuyển dụng: cấu trúc giảm nhiễu, nhưng không thay được một cuộc thảo luận dựa trên bằng chứng.</p>`,
  ]]);

const c5q = quiz('hrm202c-quiz-2', 'Quiz 2 — Recruitment & selection|||Quiz 2 — Tuyển mộ & tuyển chọn', [
  { id: 'q1', question: 'A test gives almost identical scores when the same people retake it, but the scores do not predict job performance. The test is…|||Một bài kiểm tra cho điểm gần như giống hệt khi cùng những người làm lại, nhưng điểm không dự báo được hiệu suất công việc. Bài kiểm tra này…', options: ['valid but not reliable|||có hiệu lực nhưng không tin cậy', 'both reliable and valid|||vừa tin cậy vừa có hiệu lực', 'neither reliable nor consistent|||không tin cậy và không nhất quán', 'reliable but not valid|||tin cậy nhưng không có hiệu lực'], correctIndex: 3, explanation: 'Consistency means reliability; failing to predict the criterion means the test lacks criterion-related validity.|||Nhất quán nghĩa là tin cậy; không dự báo được tiêu chí nghĩa là bài kiểm tra thiếu hiệu lực theo tiêu chí.' },
  { id: 'q2', question: 'A firm needs 30 hires. 75% of offers are accepted and offers go to 40% of interviewees. How many candidates must be interviewed?|||Doanh nghiệp cần tuyển 30 người. 75% lời mời được nhận và lời mời được gửi cho 40% số người phỏng vấn. Cần phỏng vấn bao nhiêu ứng viên?', options: ['53|||53', '70|||70', '100|||100', '120|||120'], correctIndex: 2, explanation: 'Offers = 30 / 0.75 = 40; interviews = 40 / 0.40 = 100.|||Số lời mời = 30 / 0,75 = 40; số phỏng vấn = 40 / 0,40 = 100.' },
  { id: 'q3', question: 'Which is a behavioural interview question?|||Câu nào là câu hỏi phỏng vấn hành vi?', options: ['Tell me about a time you had to calm an angry customer. What did you do and what was the result?|||Hãy kể về một lần bạn phải xoa dịu một khách hàng đang giận. Bạn đã làm gì và kết quả ra sao?', 'What would you do if two agents asked for the same day off?|||Bạn sẽ làm gì nếu hai nhân viên cùng xin nghỉ một ngày?', 'Where do you see yourself in five years?|||Bạn thấy mình ở đâu sau năm năm nữa?', 'What is your greatest weakness?|||Điểm yếu lớn nhất của bạn là gì?'], correctIndex: 0, explanation: 'Behavioural questions ask about past behaviour and are probed with STAR; the second option is a situational (hypothetical) question.|||Câu hỏi hành vi hỏi về hành vi trong quá khứ và được đào sâu theo STAR; phương án thứ hai là câu hỏi tình huống (giả định).' },
]);

const c6 = doc('hrm202c-3-1-training', '3.1 — Training & development: ADDIE, Kirkpatrick and ROI|||3.1 — Đào tạo & phát triển: ADDIE, Kirkpatrick và ROI',
  'Hội nhập nhân viên mới, mô hình ADDIE, phân tích nhu cầu đào tạo ba cấp (tổ chức, nhiệm vụ, cá nhân), các phương pháp đào tạo và phát triển, chuyển giao đào tạo, bốn cấp đánh giá Kirkpatrick và cấp ROI của Phillips, ví dụ số tính ROI và tỷ số lợi ích/chi phí có nhóm đối chứng.',
  [[
    `<span class="eyebrow">HRM202c · Part 3 · Lesson 3.1</span>
<h2>Training &amp; development: ADDIE, Kirkpatrick and ROI</h2>
<p class="lead">Training builds the skills needed for the current job; development prepares people for future roles. Both are investments — and they should be designed, justified and evaluated like investments.</p>
<h3>Onboarding comes first</h3>
<p><strong>Onboarding</strong> (orientation and socialisation) gives new employees the practical information, relationships and expectations they need to become productive. Good onboarding is one of the cheapest ways to reduce early turnover and speed up time to full performance.</p>
<h3>The ADDIE model</h3>
<table>
<tr><th>Phase</th><th>Key activities</th></tr>
<tr><td><strong>A</strong>nalysis</td><td>Training needs analysis at three levels: <strong>organisational</strong> (strategy, where training is needed, resources and support), <strong>task</strong> (what the job requires — from job analysis) and <strong>person</strong> (who lacks those skills — from appraisals, tests, observation). Confirm that training is the right fix: a gap caused by poor tools, unclear goals or weak incentives will not be solved by a course.</td></tr>
<tr><td><strong>D</strong>esign</td><td>Write observable, measurable learning objectives; choose content, methods and sequence; plan the evaluation now, not afterwards.</td></tr>
<tr><td><strong>D</strong>evelopment</td><td>Build materials — cases, role plays, e-learning modules, job aids — and pilot them.</td></tr>
<tr><td><strong>I</strong>mplementation</td><td>Deliver; prepare trainers, participants and their managers.</td></tr>
<tr><td><strong>E</strong>valuation</td><td>Measure results at several levels (Kirkpatrick) and improve the programme.</td></tr>
</table>
<h3>Methods</h3>
<ul>
<li><strong>On the job:</strong> coaching, structured on-the-job training, job rotation, apprenticeship.</li>
<li><strong>Off the job:</strong> workshops, classroom courses, simulations, case discussions.</li>
<li><strong>Digital:</strong> e-learning, microlearning on mobile, virtual classrooms.</li>
<li><strong>Development:</strong> stretch assignments, action-learning projects, mentoring, 360-degree feedback, formal education; <em>succession planning</em> ties development to key roles.</li>
</ul>
<h3>Transfer of training</h3>
<p>Learning only pays if it is used at work. Transfer improves when the content matches real tasks, trainees practise with feedback, and managers support application afterwards — giving opportunities to use the skill, following up and recognising progress.</p>
<h3>Kirkpatrick’s four levels of evaluation</h3>
<table>
<tr><th>Level</th><th>Question</th><th>Example measure</th></tr>
<tr><td>1 Reaction</td><td>Did participants find it relevant and engaging?</td><td>End-of-course survey, e.g. 4.4 out of 5</td></tr>
<tr><td>2 Learning</td><td>Did knowledge or skills increase?</td><td>Pre-test 55% → post-test 82%</td></tr>
<tr><td>3 Behaviour</td><td>Are people applying it on the job?</td><td>Manager observation of sales calls after 3 months</td></tr>
<tr><td>4 Results</td><td>Did business outcomes improve?</td><td>Sales, quality, customer satisfaction, safety incidents</td></tr>
</table>
<p>Jack Phillips added a fifth level, <strong>return on investment (ROI)</strong>, which converts level-4 results into money and compares them with the fully loaded cost of the programme.</p>
<h3>Worked example — ROI of a sales-coaching programme (fictional, illustrative)</h3>
<pre><code>Participants: 25 sales representatives; a similar group of reps not yet trained is the control group
COSTS (VND million)
  Needs analysis and design 40 + delivery 90 + participants’ paid time 80 + evaluation 30 = 240
LEVEL 4 — isolating the training effect with the control group
  Increase in monthly gross profit per rep: trained +3.0 million, control +1.0 million
  Attributable to training = 3.0 − 1.0 = 2.0 million per rep per month
  First-year benefit = 2.0 x 25 reps x 12 months = 600
LEVEL 5 — ROI
  ROI     = (benefits − costs) / costs x 100 = (600 − 240) / 240 x 100 = 150%
  BCR     = benefits / costs = 600 / 240 = 2.5
  Payback = 240 / (2.0 x 25) = 4.8 months</code></pre>
<p>A credible ROI <strong>isolates</strong> the training effect (control group, trend analysis or conservative estimates), uses <strong>fully loaded costs</strong> including participants’ time, and counts only benefits that can be defended — here only the first year. Without the control group, the claimed benefit would have been 3.0 million per rep per month, overstating it by 50%.</p>
<div class="callout"><span class="badge">Don’t skip levels</span> A high ROI means little if level 3 shows that nobody changed their behaviour — the result may come from something else. Evaluate the whole chain: reaction → learning → behaviour → results.</div>`,
    `<span class="eyebrow">HRM202c · Phần 3 · Bài 3.1</span>
<h2>Đào tạo &amp; phát triển: ADDIE, Kirkpatrick và ROI</h2>
<p class="lead">Đào tạo xây dựng kỹ năng cho công việc hiện tại; phát triển chuẩn bị con người cho các vai trò tương lai. Cả hai đều là khoản đầu tư — và nên được thiết kế, biện minh và đánh giá như một khoản đầu tư.</p>
<h3>Hội nhập đi trước</h3>
<p><strong>Hội nhập</strong> (định hướng và xã hội hoá) cung cấp cho nhân viên mới thông tin thực tế, các mối quan hệ và những kỳ vọng cần thiết để làm việc hiệu quả. Hội nhập tốt là một trong những cách rẻ nhất để giảm nghỉ việc sớm và rút ngắn thời gian đạt hiệu suất đầy đủ.</p>
<h3>Mô hình ADDIE</h3>
<table>
<tr><th>Giai đoạn</th><th>Hoạt động chính</th></tr>
<tr><td><strong>A</strong> — Phân tích (Analysis)</td><td>Phân tích nhu cầu đào tạo ở ba cấp: <strong>tổ chức</strong> (chiến lược, nơi cần đào tạo, nguồn lực và sự hỗ trợ), <strong>nhiệm vụ</strong> (công việc đòi hỏi gì — từ phân tích công việc) và <strong>cá nhân</strong> (ai thiếu kỹ năng đó — từ đánh giá, bài kiểm tra, quan sát). Xác nhận đào tạo là cách chữa đúng: khoảng cách do công cụ kém, mục tiêu mơ hồ hay khuyến khích yếu thì một khoá học không giải quyết được.</td></tr>
<tr><td><strong>D</strong> — Thiết kế (Design)</td><td>Viết mục tiêu học tập quan sát và đo được; chọn nội dung, phương pháp, trình tự; lập kế hoạch đánh giá ngay từ bây giờ, không phải để sau.</td></tr>
<tr><td><strong>D</strong> — Phát triển (Development)</td><td>Xây dựng học liệu — tình huống, đóng vai, bài học trực tuyến, tài liệu hỗ trợ công việc — và chạy thử.</td></tr>
<tr><td><strong>I</strong> — Triển khai (Implementation)</td><td>Tổ chức đào tạo; chuẩn bị giảng viên, học viên và quản lý của họ.</td></tr>
<tr><td><strong>E</strong> — Đánh giá (Evaluation)</td><td>Đo kết quả ở nhiều cấp (Kirkpatrick) và cải tiến chương trình.</td></tr>
</table>
<h3>Phương pháp</h3>
<ul>
<li><strong>Tại nơi làm việc:</strong> kèm cặp, đào tạo tại chỗ có cấu trúc, luân chuyển công việc, học nghề.</li>
<li><strong>Ngoài nơi làm việc:</strong> hội thảo, lớp học, mô phỏng, thảo luận tình huống.</li>
<li><strong>Kỹ thuật số:</strong> học trực tuyến, học vi mô trên điện thoại, lớp học ảo.</li>
<li><strong>Phát triển:</strong> giao việc thử thách, dự án học qua hành động, cố vấn (mentoring), phản hồi 360 độ, học chính quy; <em>kế hoạch kế thừa</em> gắn việc phát triển với các vị trí then chốt.</li>
</ul>
<h3>Chuyển giao đào tạo</h3>
<p>Học chỉ sinh lời nếu được dùng trong công việc. Chuyển giao tốt hơn khi nội dung khớp với nhiệm vụ thật, học viên được thực hành có phản hồi, và quản lý hỗ trợ áp dụng sau đó — tạo cơ hội dùng kỹ năng, theo dõi và ghi nhận tiến bộ.</p>
<h3>Bốn cấp đánh giá của Kirkpatrick</h3>
<table>
<tr><th>Cấp</th><th>Câu hỏi</th><th>Ví dụ thước đo</th></tr>
<tr><td>1 Phản ứng</td><td>Học viên có thấy phù hợp và cuốn hút không?</td><td>Khảo sát cuối khoá, ví dụ 4,4 trên 5</td></tr>
<tr><td>2 Học tập</td><td>Kiến thức hay kỹ năng có tăng không?</td><td>Kiểm tra đầu vào 55% → đầu ra 82%</td></tr>
<tr><td>3 Hành vi</td><td>Họ có áp dụng vào công việc không?</td><td>Quản lý quan sát các cuộc gọi bán hàng sau 3 tháng</td></tr>
<tr><td>4 Kết quả</td><td>Kết quả kinh doanh có cải thiện không?</td><td>Doanh số, chất lượng, sự hài lòng của khách hàng, sự cố an toàn</td></tr>
</table>
<p>Jack Phillips bổ sung cấp thứ năm, <strong>tỷ suất hoàn vốn đầu tư (ROI)</strong>, quy đổi kết quả cấp 4 ra tiền và so sánh với toàn bộ chi phí của chương trình.</p>
<h3>Ví dụ có lời giải — ROI của chương trình kèm cặp bán hàng (tình huống giả định, số liệu minh hoạ)</h3>
<pre><code>Học viên: 25 nhân viên bán hàng; một nhóm nhân viên tương tự chưa được đào tạo làm nhóm đối chứng
CHI PHÍ (triệu đồng)
  Phân tích nhu cầu và thiết kế 40 + tổ chức giảng dạy 90 + thời gian có lương của học viên 80 + đánh giá 30 = 240
CẤP 4 — tách tác động của đào tạo bằng nhóm đối chứng
  Mức tăng lợi nhuận gộp hằng tháng mỗi người: nhóm được đào tạo +3,0 triệu, nhóm đối chứng +1,0 triệu
  Phần do đào tạo = 3,0 − 1,0 = 2,0 triệu mỗi người mỗi tháng
  Lợi ích năm đầu = 2,0 x 25 người x 12 tháng = 600
CẤP 5 — ROI
  ROI           = (lợi ích − chi phí) / chi phí x 100 = (600 − 240) / 240 x 100 = 150%
  BCR           = lợi ích / chi phí = 600 / 240 = 2,5
  Thời gian hoàn vốn = 240 / (2,0 x 25) = 4,8 tháng</code></pre>
<p>Một ROI đáng tin phải <strong>tách riêng</strong> tác động của đào tạo (nhóm đối chứng, phân tích xu hướng hoặc ước tính thận trọng), dùng <strong>toàn bộ chi phí</strong> kể cả thời gian của học viên, và chỉ tính những lợi ích bảo vệ được — ở đây chỉ năm đầu. Nếu không có nhóm đối chứng, lợi ích được nêu sẽ là 3,0 triệu mỗi người mỗi tháng, cao hơn thực tế 50%.</p>
<div class="callout"><span class="badge">Đừng bỏ cấp</span> ROI cao chẳng có mấy ý nghĩa nếu cấp 3 cho thấy không ai thay đổi hành vi — kết quả có thể đến từ nguyên nhân khác. Hãy đánh giá cả chuỗi: phản ứng → học tập → hành vi → kết quả.</div>`,
  ]]);

const c7 = doc('hrm202c-3-2-performance', '3.2 — Performance management: methods, rater errors, 360° and KPI/OKR|||3.2 — Quản lý hiệu suất: phương pháp, lỗi đánh giá, 360° và KPI/OKR',
  'Chu trình quản lý hiệu suất và mục tiêu SMART, bốn nhóm phương pháp đánh giá (so sánh, thuộc tính, hành vi – BARS, kết quả – MBO), các lỗi của người đánh giá và cách khắc phục, họp hiệu chỉnh, phản hồi 360 độ, so sánh KPI và OKR có ví dụ, cuộc trao đổi phản hồi.',
  [[
    `<span class="eyebrow">HRM202c · Part 3 · Lesson 3.2</span>
<h2>Performance management: methods, rater errors, 360° and KPI/OKR</h2>
<p class="lead">Performance management is the continuous process of setting goals, observing and measuring performance, giving feedback and developing people, in line with the organisation’s goals. The annual appraisal form is only one part of it.</p>
<h3>The cycle</h3>
<ol>
<li><strong>Plan</strong> — agree goals and standards; make goals SMART: specific, measurable, achievable, relevant, time-bound.</li>
<li><strong>Monitor and coach</strong> — regular check-ins, feedback, notes on critical incidents.</li>
<li><strong>Review</strong> — the formal appraisal of results and behaviours.</li>
<li><strong>Reward and develop</strong> — links to pay, promotion and development plans; poor performance is handled with a performance improvement plan.</li>
</ol>
<h3>Appraisal methods</h3>
<table>
<tr><th>Approach</th><th>Methods</th><th>Strengths</th><th>Weaknesses</th></tr>
<tr><td>Comparative</td><td>Simple or alternation ranking; paired comparison (n people → n(n − 1) / 2 pairs, so 5 people → 10 comparisons); forced distribution (e.g. 20% / 70% / 10%: a team of 40 → 8 / 28 / 4)</td><td>Separates performers; prevents everyone being rated high</td><td>Can damage teamwork; assumes a fixed distribution; gives little feedback</td></tr>
<tr><td>Attribute</td><td>Graphic rating scales (e.g. quality, dependability, 1–5)</td><td>Simple, cheap, widely used</td><td>Vague standards invite rater errors</td></tr>
<tr><td>Behavioural</td><td>Critical incidents; behaviourally anchored rating scales (BARS); behavioural observation scales</td><td>Clear, job-specific, good for feedback</td><td>Time-consuming to build</td></tr>
<tr><td>Results</td><td>Management by objectives (MBO); KPIs</td><td>Objective, aligned with goals</td><td>May ignore how results were achieved and factors outside the person’s control</td></tr>
</table>
<h3>Rater errors</h3>
<table>
<tr><th>Error</th><th>What happens</th></tr>
<tr><td>Halo / horns</td><td>One strong positive (or negative) trait colours every rating</td></tr>
<tr><td>Leniency / strictness</td><td>Everyone is rated too high / too low</td></tr>
<tr><td>Central tendency</td><td>Everyone is rated “average” to avoid difficult conversations</td></tr>
<tr><td>Recency</td><td>Only the last few weeks count</td></tr>
<tr><td>Similar-to-me and stereotyping</td><td>Higher ratings for people like the rater; judgements based on group membership</td></tr>
<tr><td>Contrast</td><td>A rating depends on who was reviewed just before</td></tr>
</table>
<p><strong>Remedies:</strong> clear behavioural standards (BARS), rater training, notes kept all year, <strong>calibration meetings</strong> in which managers compare evidence across teams, and review by the next-level manager.</p>
<h3>360-degree feedback</h3>
<p>Input from the manager, peers, direct reports, the employee (self-rating) and sometimes customers. It gives a fuller picture — especially of behaviours such as collaboration and leadership — and works best for <strong>development</strong>. Linking it directly to pay can make raters strategic. Keep peer and subordinate input anonymous and help the person interpret the report.</p>
<h3>KPIs and OKRs</h3>
<table>
<tr><th></th><th>KPI (key performance indicator)</th><th>OKR (objectives and key results)</th></tr>
<tr><td>Purpose</td><td>Monitor the ongoing health of a process or role</td><td>Focus effort on a few priorities for improvement</td></tr>
<tr><td>Form</td><td>A metric with a target, e.g. first-contact resolution of at least 80%</td><td>A qualitative objective plus 2–5 measurable key results</td></tr>
<tr><td>Ambition</td><td>Realistic; expected to be met</td><td>Often stretching; partial achievement can still be a good result</td></tr>
<tr><td>Cycle</td><td>Continuous, reviewed monthly or quarterly</td><td>Usually set and reviewed quarterly</td></tr>
<tr><td>Link to pay</td><td>Often linked</td><td>Often kept separate from pay to encourage ambitious goals</td></tr>
</table>
<pre><code>Example OKR for Delta Retail’s customer-service team (illustrative)
Objective  Customers feel we solve their problem the first time
KR1        First-contact resolution rises from 72% to 80%
KR2        Repeat-contact rate falls below 10%
KR3        Customer satisfaction score rises from 4.1 to 4.4 (out of 5)</code></pre>
<h3>The feedback conversation</h3>
<p>Prepare evidence; start with the employee’s self-assessment; discuss specific behaviours and results rather than personality; agree goals and a development plan; follow up. Address poor performance early, with clear expectations, support and a timeline — never save it for the annual review.</p>
<div class="callout"><span class="badge">Connect, don’t reteach</span> Goal-setting theory (OBE102c) explains why specific, challenging goals with feedback raise performance. Performance management builds that insight into a routine that every manager runs.</div>`,
    `<span class="eyebrow">HRM202c · Phần 3 · Bài 3.2</span>
<h2>Quản lý hiệu suất: phương pháp, lỗi đánh giá, 360° và KPI/OKR</h2>
<p class="lead">Quản lý hiệu suất là quá trình liên tục đặt mục tiêu, quan sát và đo lường kết quả làm việc, phản hồi và phát triển con người, phù hợp với mục tiêu của tổ chức. Mẫu đánh giá cuối năm chỉ là một phần của quá trình đó.</p>
<h3>Chu trình</h3>
<ol>
<li><strong>Lập kế hoạch</strong> — thống nhất mục tiêu và tiêu chuẩn; đặt mục tiêu SMART: cụ thể, đo được, khả thi, liên quan, có thời hạn.</li>
<li><strong>Theo dõi và kèm cặp</strong> — trao đổi định kỳ, phản hồi, ghi chép các sự kiện quan trọng.</li>
<li><strong>Đánh giá</strong> — đánh giá chính thức về kết quả và hành vi.</li>
<li><strong>Đãi ngộ và phát triển</strong> — gắn với lương, thăng tiến và kế hoạch phát triển; hiệu suất kém được xử lý bằng kế hoạch cải thiện hiệu suất.</li>
</ol>
<h3>Các phương pháp đánh giá</h3>
<table>
<tr><th>Cách tiếp cận</th><th>Phương pháp</th><th>Điểm mạnh</th><th>Điểm yếu</th></tr>
<tr><td>So sánh</td><td>Xếp hạng đơn giản hoặc xếp hạng luân phiên; so sánh cặp (n người → n(n − 1) / 2 cặp, nên 5 người → 10 lần so sánh); phân phối bắt buộc (ví dụ 20% / 70% / 10%: nhóm 40 người → 8 / 28 / 4)</td><td>Phân biệt được người giỏi, người yếu; tránh chuyện ai cũng được điểm cao</td><td>Có thể phá tinh thần đồng đội; giả định một phân phối cố định; ít thông tin phản hồi</td></tr>
<tr><td>Thuộc tính</td><td>Thang điểm đồ hoạ (ví dụ chất lượng, độ tin cậy, 1–5)</td><td>Đơn giản, rẻ, phổ biến</td><td>Tiêu chuẩn mơ hồ dễ sinh lỗi đánh giá</td></tr>
<tr><td>Hành vi</td><td>Sự kiện quan trọng; thang đánh giá có neo hành vi (BARS); thang quan sát hành vi</td><td>Rõ ràng, gắn với công việc, tốt cho phản hồi</td><td>Tốn thời gian xây dựng</td></tr>
<tr><td>Kết quả</td><td>Quản trị theo mục tiêu (MBO); KPI</td><td>Khách quan, gắn với mục tiêu</td><td>Có thể bỏ qua cách đạt kết quả và các yếu tố ngoài tầm kiểm soát của cá nhân</td></tr>
</table>
<h3>Lỗi của người đánh giá</h3>
<table>
<tr><th>Lỗi</th><th>Biểu hiện</th></tr>
<tr><td>Hào quang / định kiến xấu (horns)</td><td>Một nét nổi bật tích cực (hoặc tiêu cực) chi phối mọi điểm số</td></tr>
<tr><td>Dễ dãi / khắt khe</td><td>Ai cũng bị chấm quá cao / quá thấp</td></tr>
<tr><td>Xu hướng trung bình</td><td>Ai cũng được chấm “trung bình” để tránh những cuộc nói chuyện khó</td></tr>
<tr><td>Gần đây (recency)</td><td>Chỉ vài tuần cuối được tính</td></tr>
<tr><td>“Giống tôi” và rập khuôn</td><td>Chấm cao hơn cho người giống mình; phán xét dựa trên nhóm mà người đó thuộc về</td></tr>
<tr><td>Tương phản</td><td>Điểm số phụ thuộc vào người vừa được đánh giá ngay trước đó</td></tr>
</table>
<p><strong>Cách khắc phục:</strong> tiêu chuẩn hành vi rõ ràng (BARS), đào tạo người đánh giá, ghi chép suốt năm, <strong>họp hiệu chỉnh</strong> để các quản lý so sánh bằng chứng giữa các nhóm, và quản lý cấp trên xem xét lại.</p>
<h3>Phản hồi 360 độ</h3>
<p>Thông tin từ quản lý, đồng nghiệp, cấp dưới trực tiếp, chính người lao động (tự đánh giá) và đôi khi khách hàng. Nó cho bức tranh đầy đủ hơn — nhất là về các hành vi như hợp tác và lãnh đạo — và phát huy tốt nhất cho mục đích <strong>phát triển</strong>. Gắn trực tiếp với lương có thể khiến người chấm tính toán. Giữ ẩn danh ý kiến của đồng nghiệp và cấp dưới, và giúp người được đánh giá hiểu đúng bản báo cáo.</p>
<h3>KPI và OKR</h3>
<table>
<tr><th></th><th>KPI (chỉ số hiệu suất then chốt)</th><th>OKR (mục tiêu và kết quả then chốt)</th></tr>
<tr><td>Mục đích</td><td>Theo dõi “sức khoẻ” thường xuyên của một quy trình hay vị trí</td><td>Dồn nỗ lực vào vài ưu tiên cần cải thiện</td></tr>
<tr><td>Hình thức</td><td>Một chỉ số kèm chỉ tiêu, ví dụ tỷ lệ giải quyết ngay lần đầu tối thiểu 80%</td><td>Một mục tiêu định tính cộng 2–5 kết quả then chốt đo được</td></tr>
<tr><td>Mức tham vọng</td><td>Thực tế; kỳ vọng phải đạt</td><td>Thường mang tính thử thách; đạt một phần vẫn có thể là kết quả tốt</td></tr>
<tr><td>Chu kỳ</td><td>Liên tục, xem xét hằng tháng hoặc hằng quý</td><td>Thường đặt và xem xét theo quý</td></tr>
<tr><td>Gắn với lương</td><td>Thường gắn</td><td>Thường tách khỏi lương để khuyến khích mục tiêu tham vọng</td></tr>
</table>
<pre><code>Ví dụ OKR cho nhóm chăm sóc khách hàng của Delta Retail (minh hoạ)
Mục tiêu   Khách hàng cảm thấy chúng ta giải quyết vấn đề ngay lần đầu
KR1        Tỷ lệ giải quyết ngay lần đầu tăng từ 72% lên 80%
KR2        Tỷ lệ khách liên hệ lại giảm xuống dưới 10%
KR3        Điểm hài lòng của khách hàng tăng từ 4,1 lên 4,4 (trên 5)</code></pre>
<h3>Cuộc trao đổi phản hồi</h3>
<p>Chuẩn bị bằng chứng; bắt đầu từ phần tự đánh giá của nhân viên; bàn về hành vi và kết quả cụ thể thay vì tính cách; thống nhất mục tiêu và kế hoạch phát triển; theo dõi sau đó. Xử lý hiệu suất kém sớm, với kỳ vọng rõ ràng, sự hỗ trợ và mốc thời gian — đừng bao giờ để dồn tới kỳ đánh giá cuối năm.</p>
<div class="callout"><span class="badge">Liên hệ, không dạy lại</span> Thuyết đặt mục tiêu (OBE102c) giải thích vì sao mục tiêu cụ thể, thử thách, có phản hồi làm tăng hiệu suất. Quản lý hiệu suất biến hiểu biết đó thành một nề nếp mà mọi nhà quản lý đều thực hiện.</div>`,
  ]]);

const c7q = quiz('hrm202c-quiz-3', 'Quiz 3 — Training & performance management|||Quiz 3 — Đào tạo & quản lý hiệu suất', [
  { id: 'q1', question: 'Three months after a course, managers observe whether trainees use the new sales steps in real calls. Which Kirkpatrick level is this?|||Ba tháng sau khoá học, quản lý quan sát xem học viên có dùng các bước bán hàng mới trong cuộc gọi thật không. Đây là cấp nào của Kirkpatrick?', options: ['Level 1 — Reaction|||Cấp 1 — Phản ứng', 'Level 3 — Behaviour|||Cấp 3 — Hành vi', 'Level 2 — Learning|||Cấp 2 — Học tập', 'Level 4 — Results|||Cấp 4 — Kết quả'], correctIndex: 1, explanation: 'Level 3 asks whether learning transfers to behaviour on the job; level 4 would measure business outcomes such as sales.|||Cấp 3 hỏi việc học có chuyển thành hành vi trong công việc không; cấp 4 mới đo kết quả kinh doanh như doanh số.' },
  { id: 'q2', question: 'A programme costs 200 million VND and produces isolated benefits of 300 million VND. What is its ROI?|||Một chương trình tốn 200 triệu đồng và tạo ra lợi ích đã tách riêng là 300 triệu đồng. ROI bằng bao nhiêu?', options: ['150%|||150%', '1.5%|||1,5%', '100%|||100%', '50%|||50%'], correctIndex: 3, explanation: 'ROI = (300 − 200) / 200 x 100 = 50%. The benefit-cost ratio is 300 / 200 = 1.5, which is a different measure.|||ROI = (300 − 200) / 200 x 100 = 50%. Tỷ số lợi ích/chi phí là 300 / 200 = 1,5, là một thước đo khác.' },
  { id: 'q3', question: 'A manager rates all ten team members as 3 on a 1–5 scale to avoid difficult conversations. This is…|||Một quản lý chấm cả mười thành viên trong nhóm 3 điểm trên thang 1–5 để tránh những cuộc nói chuyện khó. Đây là lỗi…', options: ['central tendency|||xu hướng trung bình', 'halo effect|||hiệu ứng hào quang', 'recency error|||lỗi gần đây', 'contrast error|||lỗi tương phản'], correctIndex: 0, explanation: 'Clustering everyone around the middle of the scale is central tendency; it hides real differences in performance.|||Dồn mọi người vào giữa thang điểm là lỗi xu hướng trung bình; nó che mất khác biệt thực về hiệu suất.' },
]);

const c8 = doc('hrm202c-4-1-pay-structure', '4.1 — Compensation: job evaluation and pay structures|||4.1 — Lương thưởng: định giá công việc và cấu trúc thang bậc lương',
  'Tổng đãi ngộ, ba phép thử công bằng (nội bộ, bên ngoài, cá nhân), bốn phương pháp định giá công việc, ví dụ tính điểm theo yếu tố, đường chính sách lương hồi quy từ công việc chuẩn, chính sách dẫn – theo – trễ thị trường, ngạch lương, độ rộng khung, điểm giữa, compa-ratio, mức thâm nhập khung, vòng tròn đỏ và xanh, dải rộng.',
  [[
    `<span class="eyebrow">HRM202c · Part 4 · Lesson 4.1</span>
<h2>Compensation: job evaluation and pay structures</h2>
<p class="lead">Pay is usually the largest cost that HR influences, and one of the most sensitive. A sound pay system passes three tests of fairness and is simple enough to explain.</p>
<h3>Total rewards</h3>
<table>
<tr><th>Component</th><th>Examples</th></tr>
<tr><td>Direct financial</td><td>Base pay, allowances, incentives and bonuses</td></tr>
<tr><td>Indirect financial</td><td>Benefits: insurance, paid leave, retirement savings, meals, transport</td></tr>
<tr><td>Non-financial</td><td>Recognition, development, meaningful work, flexibility, working environment</td></tr>
</table>
<h3>Three equity tests</h3>
<ul>
<li><strong>Internal equity</strong> — jobs of greater worth to the organisation pay more → <em>job evaluation</em>.</li>
<li><strong>External competitiveness</strong> — pay compared with the labour market → <em>pay surveys</em> and a pay policy to <strong>lead</strong>, <strong>match</strong> or <strong>lag</strong> the market.</li>
<li><strong>Individual equity</strong> — people in the same job are paid according to performance, skill or experience → <em>pay ranges</em> and merit pay (lesson 4.2).</li>
</ul>
<p>Equity theory (OBE102c) explains why perceived unfairness reduces effort and raises turnover; the pay structure is how HR manages that perception.</p>
<h3>Job evaluation methods</h3>
<table>
<tr><th>Method</th><th>How it works</th><th>Type</th></tr>
<tr><td>Ranking</td><td>Order whole jobs from most to least valuable</td><td>Non-quantitative; fine for small firms</td></tr>
<tr><td>Job classification (grading)</td><td>Slot jobs into predefined grades using written grade descriptions</td><td>Non-quantitative; common in public services</td></tr>
<tr><td>Point-factor</td><td>Rate each job on <strong>compensable factors</strong> (e.g. skill, effort, responsibility, working conditions), each with defined degrees and points; add the points</td><td>Quantitative; the most widely used</td></tr>
<tr><td>Factor comparison</td><td>Compare jobs factor by factor against benchmark jobs, in money terms</td><td>Quantitative; complex</td></tr>
</table>
<p>The Hay method, used by many large employers, is a well-known proprietary point-factor system.</p>
<h3>Worked example — point-factor (fictional, illustrative)</h3>
<pre><code>Factor (weight)           Maximum points   Points per degree (5 degrees)
Skill (40%)                     200                 40
Effort (15%)                     75                 15
Responsibility (35%)            175                 35
Working conditions (10%)         50                 10
Total                           500

Payroll specialist: skill degree 3 = 120, effort degree 2 = 30,
                    responsibility degree 3 = 105, conditions degree 1 = 10
Total = 120 + 30 + 105 + 10 = 265 points</code></pre>
<h3>From points to money: the pay policy line</h3>
<p>Survey market pay for <strong>benchmark jobs</strong> — well-defined jobs found in many firms — and fit a line of pay against points:</p>
<pre><code>Benchmark job points             150     220     320     450
Market median (VND million/mo)   8.0    11.0    16.0    22.0
Least-squares line: pay = 0.840 + 0.04705 x points      (very close fit, r above 0.99)
Payroll specialist, 265 points: 0.840 + 0.04705 x 265 ≈ 13.31 million per month</code></pre>
<p>A firm that wants to <strong>lead</strong> the market sets its policy line above this market line (for example +5%) to attract scarce talent; a <strong>lag</strong> policy sits below it and relies on other rewards; a <strong>match</strong> policy follows it.</p>
<h3>Pay grades and ranges</h3>
<p>Jobs with similar points are grouped into <strong>grades</strong>. Each grade has a pay range around its midpoint, which is set on the policy line:</p>
<pre><code>Range spread         = (max − min) / min
Midpoint             = (min + max) / 2
From midpoint M and spread s:  min = 2M / (2 + s),   max = min x (1 + s)
Midpoint progression = % difference between midpoints of adjacent grades
Compa-ratio          = actual pay / midpoint of the grade
Range penetration    = (actual pay − min) / (max − min)</code></pre>
<ul>
<li>A <strong>compa-ratio</strong> of 1.00 means pay equals the midpoint — often the target for a fully competent employee; below 1.00 is normal for people still growing into the job.</li>
<li>Pay above the range maximum is <strong>red-circled</strong>: frozen, or rewarded through lump sums, until the range moves up.</li>
<li>Pay below the minimum is <strong>green-circled</strong>: it should be raised to the minimum as soon as possible.</li>
<li>Adjacent ranges usually <strong>overlap</strong>, so an experienced person in a lower grade can earn more than a newcomer in the grade above.</li>
<li><strong>Broadbanding</strong> merges several grades into a few wide bands, giving flexibility to flatter organisations at the cost of looser cost control.</li>
</ul>
<p>Exercise 2 applies these formulas to a real-looking grade.</p>
<div class="callout"><span class="badge">Pay data</span> Use recent surveys that are comparable in industry, location and company size, and match jobs by content, not by title — a “manager” in one firm can be a team leader in another.</div>`,
    `<span class="eyebrow">HRM202c · Phần 4 · Bài 4.1</span>
<h2>Lương thưởng: định giá công việc và cấu trúc thang bậc lương</h2>
<p class="lead">Tiền lương thường là khoản chi phí lớn nhất mà HR có ảnh hưởng, và là một trong những vấn đề nhạy cảm nhất. Một hệ thống lương tốt vượt qua ba phép thử công bằng và đủ đơn giản để giải thích.</p>
<h3>Tổng đãi ngộ</h3>
<table>
<tr><th>Thành phần</th><th>Ví dụ</th></tr>
<tr><td>Tài chính trực tiếp</td><td>Lương cơ bản, phụ cấp, khuyến khích và tiền thưởng</td></tr>
<tr><td>Tài chính gián tiếp</td><td>Phúc lợi: bảo hiểm, nghỉ có lương, tiết kiệm hưu trí, ăn trưa, đi lại</td></tr>
<tr><td>Phi tài chính</td><td>Ghi nhận, phát triển, công việc có ý nghĩa, sự linh hoạt, môi trường làm việc</td></tr>
</table>
<h3>Ba phép thử công bằng</h3>
<ul>
<li><strong>Công bằng nội bộ</strong> — công việc có giá trị lớn hơn với tổ chức thì được trả cao hơn → <em>định giá công việc</em>.</li>
<li><strong>Cạnh tranh bên ngoài</strong> — lương so với thị trường lao động → <em>khảo sát lương</em> và chính sách <strong>dẫn đầu</strong>, <strong>ngang bằng</strong> hay <strong>đi sau</strong> thị trường.</li>
<li><strong>Công bằng cá nhân</strong> — những người cùng một công việc được trả theo hiệu suất, kỹ năng hay kinh nghiệm → <em>khung lương</em> và tăng lương theo thành tích (bài 4.2).</li>
</ul>
<p>Thuyết công bằng (OBE102c) giải thích vì sao cảm nhận bất công làm giảm nỗ lực và tăng nghỉ việc; cấu trúc lương là cách HR quản lý cảm nhận đó.</p>
<h3>Các phương pháp định giá công việc</h3>
<table>
<tr><th>Phương pháp</th><th>Cách làm</th><th>Loại</th></tr>
<tr><td>Xếp hạng</td><td>Sắp xếp các công việc (xét tổng thể) từ giá trị cao nhất tới thấp nhất</td><td>Định tính; phù hợp doanh nghiệp nhỏ</td></tr>
<tr><td>Phân loại (xếp ngạch)</td><td>Đưa công việc vào các ngạch định sẵn dựa trên bản mô tả từng ngạch</td><td>Định tính; phổ biến ở khu vực công</td></tr>
<tr><td>Tính điểm theo yếu tố</td><td>Chấm mỗi công việc theo các <strong>yếu tố được trả lương</strong> (ví dụ kỹ năng, nỗ lực, trách nhiệm, điều kiện làm việc), mỗi yếu tố có các mức và điểm xác định; cộng điểm lại</td><td>Định lượng; được dùng rộng rãi nhất</td></tr>
<tr><td>So sánh yếu tố</td><td>So sánh từng yếu tố của công việc với các công việc chuẩn, quy ra tiền</td><td>Định lượng; phức tạp</td></tr>
</table>
<p>Phương pháp Hay, được nhiều tập đoàn lớn sử dụng, là một hệ thống tính điểm theo yếu tố có bản quyền nổi tiếng.</p>
<h3>Ví dụ có lời giải — tính điểm theo yếu tố (tình huống giả định, số liệu minh hoạ)</h3>
<pre><code>Yếu tố (trọng số)          Điểm tối đa   Điểm mỗi mức (5 mức)
Kỹ năng (40%)                  200             40
Nỗ lực (15%)                    75             15
Trách nhiệm (35%)              175             35
Điều kiện làm việc (10%)        50             10
Tổng                           500

Chuyên viên tính lương: kỹ năng mức 3 = 120, nỗ lực mức 2 = 30,
                        trách nhiệm mức 3 = 105, điều kiện mức 1 = 10
Tổng = 120 + 30 + 105 + 10 = 265 điểm</code></pre>
<h3>Từ điểm sang tiền: đường chính sách lương</h3>
<p>Khảo sát lương thị trường của các <strong>công việc chuẩn</strong> — những công việc được định nghĩa rõ, có ở nhiều doanh nghiệp — rồi khớp một đường lương theo điểm:</p>
<pre><code>Điểm của công việc chuẩn          150     220     320     450
Trung vị thị trường (triệu/tháng)  8,0    11,0    16,0    22,0
Đường bình phương nhỏ nhất: lương = 0,840 + 0,04705 x điểm   (khớp rất sát, r trên 0,99)
Chuyên viên tính lương, 265 điểm: 0,840 + 0,04705 x 265 ≈ 13,31 triệu mỗi tháng</code></pre>
<p>Doanh nghiệp muốn <strong>dẫn đầu</strong> thị trường đặt đường chính sách cao hơn đường thị trường này (ví dụ +5%) để thu hút nhân tài khan hiếm; chính sách <strong>đi sau</strong> nằm dưới đường và dựa vào các hình thức đãi ngộ khác; chính sách <strong>ngang bằng</strong> bám theo đường.</p>
<h3>Ngạch lương và khung lương</h3>
<p>Các công việc có số điểm gần nhau được gộp vào cùng một <strong>ngạch</strong>. Mỗi ngạch có một khung lương quanh điểm giữa, và điểm giữa được đặt trên đường chính sách:</p>
<pre><code>Độ rộng khung          = (mức tối đa − mức tối thiểu) / mức tối thiểu
Điểm giữa              = (tối thiểu + tối đa) / 2
Từ điểm giữa M và độ rộng s:  tối thiểu = 2M / (2 + s),   tối đa = tối thiểu x (1 + s)
Chênh lệch điểm giữa   = % chênh giữa điểm giữa của hai ngạch liền kề
Compa-ratio            = lương thực tế / điểm giữa của ngạch
Mức thâm nhập khung    = (lương thực tế − tối thiểu) / (tối đa − tối thiểu)</code></pre>
<ul>
<li><strong>Compa-ratio</strong> bằng 1,00 nghĩa là lương đúng bằng điểm giữa — thường là mục tiêu cho người đã thành thạo công việc; dưới 1,00 là bình thường với người còn đang lớn dần vào vị trí.</li>
<li>Lương cao hơn mức tối đa của khung bị <strong>khoanh đỏ</strong>: giữ nguyên, hoặc thưởng bằng khoản trọn gói, cho tới khi khung được nâng lên.</li>
<li>Lương thấp hơn mức tối thiểu được <strong>khoanh xanh</strong>: cần nâng lên mức tối thiểu càng sớm càng tốt.</li>
<li>Các khung liền kề thường <strong>chồng lấn</strong>, nên người nhiều kinh nghiệm ở ngạch dưới có thể nhận nhiều hơn người mới ở ngạch trên.</li>
<li><strong>Dải rộng (broadbanding)</strong> gộp nhiều ngạch thành vài dải rộng, tạo sự linh hoạt cho tổ chức phẳng nhưng kiểm soát chi phí lỏng hơn.</li>
</ul>
<p>Bài tập 2 áp dụng các công thức này cho một ngạch lương cụ thể.</p>
<div class="callout"><span class="badge">Dữ liệu lương</span> Dùng khảo sát gần đây, tương đồng về ngành, địa bàn và quy mô doanh nghiệp, và so khớp công việc theo nội dung chứ không theo chức danh — “quản lý” ở doanh nghiệp này có thể chỉ là trưởng nhóm ở doanh nghiệp khác.</div>`,
  ]]);

const c9 = doc('hrm202c-4-2-incentives-benefits', '4.2 — Pay for performance, incentives and benefits|||4.2 — Trả lương theo kết quả, khuyến khích và phúc lợi',
  'Tăng lương theo thành tích và ma trận tăng lương, thưởng trọn gói, các kế hoạch khuyến khích cá nhân – nhóm – đơn vị – toàn tổ chức, ví dụ số chia sẻ lợi ích năng suất (gainsharing), trả lương theo kỹ năng, nguyên tắc thiết kế khuyến khích (liên hệ thuyết kỳ vọng), phúc lợi bắt buộc và tự nguyện ở Việt Nam ở mức nguyên tắc, phúc lợi linh hoạt.',
  [[
    `<span class="eyebrow">HRM202c · Part 4 · Lesson 4.2</span>
<h2>Pay for performance, incentives and benefits</h2>
<p class="lead">Base pay rewards the job; pay for performance rewards <em>how well</em> it is done; benefits protect employees and make the organisation an attractive place to stay. Each needs careful design, because people respond to exactly what is rewarded.</p>
<h3>Merit pay and the merit matrix</h3>
<p>A <strong>merit increase</strong> is a permanent rise in base pay tied to the performance rating. Many firms use a <strong>merit matrix</strong> that also considers position in the range, so that good performers who are low in the range move faster towards the midpoint (illustrative percentages):</p>
<table>
<tr><th>Performance rating</th><th>Compa-ratio below 0.90</th><th>0.90–1.10</th><th>Above 1.10</th></tr>
<tr><td>Exceeds expectations</td><td>8%</td><td>6%</td><td>4%</td></tr>
<tr><td>Meets expectations</td><td>6%</td><td>4%</td><td>2%</td></tr>
<tr><td>Below expectations</td><td>2%</td><td>0%</td><td>0%</td></tr>
</table>
<p>Merit raises compound: this year’s increase is paid again every future year. That is why many firms reward people who are already above the range maximum with a one-off <strong>lump-sum bonus</strong> instead of a base increase.</p>
<h3>Incentive plans</h3>
<table>
<tr><th>Level</th><th>Plan</th><th>Pays for</th><th>Watch out</th></tr>
<tr><td>Individual</td><td>Piece rate; sales commission; individual bonus against targets</td><td>Output or sales</td><td>Quality, teamwork and ethics can suffer</td></tr>
<tr><td>Team</td><td>Team bonus</td><td>Team results</td><td>Free riding; conflict over shares</td></tr>
<tr><td>Unit or plant</td><td>Gainsharing (e.g. Scanlon-type plans)</td><td>A share of cost or productivity gains against a baseline</td><td>Needs a baseline everyone trusts</td></tr>
<tr><td>Organisation</td><td>Profit sharing; employee share ownership; stock options</td><td>Profit or share value</td><td>Weak line of sight for most employees</td></tr>
</table>
<p><strong>Skill- or competency-based pay</strong> rewards the skills a person acquires rather than the job held — useful where flexibility across tasks is valuable.</p>
<h3>Worked example — gainsharing (fictional, illustrative)</h3>
<pre><code>Baseline agreed with employees: labour cost = 20% of production value
This quarter: production value 10,000 million VND; actual labour cost 1,800 million
Gain       = 20% x 10,000 − 1,800 = 2,000 − 1,800 = 200 million
Employees’ share 50% → bonus pool 100 million; 50 employees → 2 million each</code></pre>
<h3>Designing incentives that work</h3>
<p>Expectancy theory (OBE102c) gives the checklist: employees must believe that effort leads to the measured result, and that the result reliably leads to a reward they value. In practice:</p>
<ul>
<li>Use few measures that employees can influence, and explain the formula.</li>
<li>Pay soon after results, while the link is still visible.</li>
<li>Balance measures to prevent gaming — for example combine sales with customer satisfaction and a compliance gate.</li>
<li>Test the plan on past data before launch: who would have earned what?</li>
</ul>
<h3>Benefits</h3>
<ul>
<li><strong>Statutory (required by law):</strong> in Vietnam this includes compulsory social insurance, health insurance and unemployment insurance for eligible employees, with contributions shared by employer and employee at rates set by law, plus paid annual leave and public holidays.</li>
<li><strong>Voluntary:</strong> private health and accident insurance, meal and transport allowances, extra leave, wellness programmes, study support, flexible working.</li>
<li><strong>Flexible (cafeteria) benefits</strong> let each employee choose items within a budget, matching benefits to different life stages.</li>
<li>Many Vietnamese employers also pay a “13th-month” bonus as common practice; whether it is owed depends on the employment contract, collective agreement or company bonus rules, so check those documents.</li>
</ul>
<p>Benefits are expensive and employees often underestimate their value, so communicate them through a <strong>total rewards statement</strong>.</p>
<div class="callout"><span class="badge">Legal check</span> Contribution rates, salary ceilings for insurance and tax treatment of allowances change over time. Check the regulations in force before calculating the cost of a benefits package.</div>`,
    `<span class="eyebrow">HRM202c · Phần 4 · Bài 4.2</span>
<h2>Trả lương theo kết quả, khuyến khích và phúc lợi</h2>
<p class="lead">Lương cơ bản trả cho công việc; trả lương theo kết quả trả cho việc làm <em>tốt đến đâu</em>; phúc lợi bảo vệ người lao động và khiến tổ chức là nơi đáng ở lại. Mỗi thứ đều cần thiết kế cẩn thận, vì con người phản ứng đúng theo điều được thưởng.</p>
<h3>Tăng lương theo thành tích và ma trận tăng lương</h3>
<p><strong>Tăng lương theo thành tích</strong> là mức tăng vĩnh viễn của lương cơ bản gắn với kết quả đánh giá. Nhiều doanh nghiệp dùng <strong>ma trận tăng lương</strong> xét thêm vị trí trong khung, để người làm tốt nhưng đang ở thấp trong khung tiến nhanh hơn về điểm giữa (tỷ lệ minh hoạ):</p>
<table>
<tr><th>Kết quả đánh giá</th><th>Compa-ratio dưới 0,90</th><th>0,90–1,10</th><th>Trên 1,10</th></tr>
<tr><td>Vượt kỳ vọng</td><td>8%</td><td>6%</td><td>4%</td></tr>
<tr><td>Đạt kỳ vọng</td><td>6%</td><td>4%</td><td>2%</td></tr>
<tr><td>Dưới kỳ vọng</td><td>2%</td><td>0%</td><td>0%</td></tr>
</table>
<p>Tăng lương theo thành tích mang tính cộng dồn: mức tăng năm nay được trả lại mọi năm về sau. Vì thế nhiều doanh nghiệp thưởng cho người đã vượt mức tối đa của khung bằng một <strong>khoản thưởng trọn gói</strong> một lần thay vì tăng lương cơ bản.</p>
<h3>Các kế hoạch khuyến khích</h3>
<table>
<tr><th>Cấp</th><th>Kế hoạch</th><th>Trả cho</th><th>Cần lưu ý</th></tr>
<tr><td>Cá nhân</td><td>Lương khoán sản phẩm; hoa hồng bán hàng; thưởng cá nhân theo chỉ tiêu</td><td>Sản lượng hoặc doanh số</td><td>Chất lượng, tinh thần đồng đội và đạo đức có thể bị ảnh hưởng</td></tr>
<tr><td>Nhóm</td><td>Thưởng nhóm</td><td>Kết quả của nhóm</td><td>Người “ăn theo”; tranh chấp khi chia</td></tr>
<tr><td>Đơn vị hoặc nhà máy</td><td>Chia sẻ lợi ích năng suất (gainsharing, ví dụ các kế hoạch kiểu Scanlon)</td><td>Một phần khoản tiết kiệm chi phí hoặc tăng năng suất so với mức gốc</td><td>Cần một mức gốc mà mọi người tin tưởng</td></tr>
<tr><td>Toàn tổ chức</td><td>Chia sẻ lợi nhuận; cổ phần cho nhân viên; quyền chọn mua cổ phiếu</td><td>Lợi nhuận hoặc giá trị cổ phiếu</td><td>Phần lớn nhân viên khó thấy mối liên hệ giữa việc mình làm và phần thưởng</td></tr>
</table>
<p><strong>Trả lương theo kỹ năng hoặc năng lực</strong> trả cho kỹ năng mà một người tích luỹ được thay vì vị trí đang giữ — hữu ích khi sự linh hoạt giữa các nhiệm vụ có giá trị.</p>
<h3>Ví dụ có lời giải — chia sẻ lợi ích năng suất (tình huống giả định, số liệu minh hoạ)</h3>
<pre><code>Mức gốc đã thống nhất với người lao động: chi phí nhân công = 20% giá trị sản xuất
Quý này: giá trị sản xuất 10.000 triệu đồng; chi phí nhân công thực tế 1.800 triệu
Lợi ích    = 20% x 10.000 − 1.800 = 2.000 − 1.800 = 200 triệu
Phần của người lao động 50% → quỹ thưởng 100 triệu; 50 người → mỗi người 2 triệu</code></pre>
<h3>Thiết kế khuyến khích hiệu quả</h3>
<p>Thuyết kỳ vọng (OBE102c) cho ta danh sách kiểm tra: người lao động phải tin rằng nỗ lực dẫn tới kết quả được đo, và kết quả đó chắc chắn dẫn tới phần thưởng mà họ coi trọng. Trong thực tế:</p>
<ul>
<li>Dùng ít chỉ tiêu, những chỉ tiêu người lao động tác động được, và giải thích rõ công thức.</li>
<li>Trả sớm sau khi có kết quả, khi mối liên hệ còn dễ thấy.</li>
<li>Cân bằng các chỉ tiêu để tránh “lách” — ví dụ kết hợp doanh số với sự hài lòng của khách hàng và một điều kiện tuân thủ.</li>
<li>Chạy thử kế hoạch trên dữ liệu quá khứ trước khi áp dụng: ai sẽ nhận được bao nhiêu?</li>
</ul>
<h3>Phúc lợi</h3>
<ul>
<li><strong>Bắt buộc (theo luật):</strong> ở Việt Nam gồm bảo hiểm xã hội, bảo hiểm y tế và bảo hiểm thất nghiệp bắt buộc đối với người lao động thuộc diện tham gia, với phần đóng chia cho người sử dụng lao động và người lao động theo tỷ lệ do luật định, cùng với nghỉ hằng năm có lương và nghỉ lễ, tết.</li>
<li><strong>Tự nguyện:</strong> bảo hiểm sức khoẻ và tai nạn tư nhân, phụ cấp ăn trưa và đi lại, thêm ngày nghỉ, chương trình chăm sóc sức khoẻ, hỗ trợ học tập, làm việc linh hoạt.</li>
<li><strong>Phúc lợi linh hoạt (kiểu “căng tin”)</strong> cho mỗi người tự chọn trong một ngân sách, phù hợp với các giai đoạn cuộc sống khác nhau.</li>
<li>Nhiều doanh nghiệp Việt Nam còn trả thưởng “tháng lương thứ 13” theo thông lệ; khoản này có bắt buộc hay không tuỳ thuộc hợp đồng lao động, thoả ước lao động tập thể hoặc quy chế thưởng của doanh nghiệp, nên cần kiểm tra các văn bản đó.</li>
</ul>
<p>Phúc lợi tốn kém và người lao động thường đánh giá thấp giá trị của nó, nên hãy truyền đạt qua một <strong>bảng tổng đãi ngộ</strong> cho từng người.</p>
<div class="callout"><span class="badge">Kiểm tra pháp lý</span> Tỷ lệ đóng, mức trần tiền lương đóng bảo hiểm và cách tính thuế đối với các khoản phụ cấp thay đổi theo thời gian. Hãy kiểm tra văn bản đang có hiệu lực trước khi tính chi phí một gói phúc lợi.</div>`,
  ]]);

const c9e = doc('hrm202c-4-3-exercise', 'Exercise 2 — pay range, compa-ratio and merit increases|||Bài tập 2 — khung lương, compa-ratio và tăng lương theo thành tích',
  'Bài tập tình huống giả định: dựng khung lương từ điểm giữa và độ rộng khung, tính ngạch kế tiếp, compa-ratio và mức thâm nhập khung của bốn nhân viên, nhận diện vòng tròn đỏ và xanh, áp dụng ma trận tăng lương và kiểm tra ngân sách; kèm lời giải.',
  [[
    `<span class="eyebrow">HRM202c · Part 4 · Exercise 2</span>
<h2>Exercise 2 — pay range, compa-ratio and merit increases</h2>
<div class="callout"><span class="badge">Problem</span> Delta Retail (a fictional company) sets grade 3 at a midpoint of VND 15.0 million per month with a range spread of 40%, and a midpoint progression of 15% between grades. Four employees in grade 3 earn (monthly, illustrative): A 13.50 million, rated Exceeds; B 15.75 million, Meets; C 18.00 million, Meets; D 12.00 million, Meets. (a) Compute the minimum and maximum of grade 3, and the midpoint, minimum and maximum of grade 4. (b) Compute each employee’s compa-ratio and range penetration, the group compa-ratio, and flag red- and green-circle cases. (c) Apply the merit matrix of lesson 4.2; a red-circled employee receives the percentage as an annual lump sum instead of a base increase. Check that the green-circled employee reaches the minimum. (d) Is the first-year cost within a merit budget of 4.5% of the group’s annual base payroll?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Grade 3: min = 2 x 15.0 / (2 + 0.40) = 30 / 2.4 = 12.5    max = 12.5 x 1.40 = 17.5
    check: (12.5 + 17.5) / 2 = 15.0 ✓
    Grade 4: midpoint = 15.0 x 1.15 = 17.25; min = 2 x 17.25 / 2.4 = 14.375; max = 14.375 x 1.40 = 20.125

(b) Emp   Pay     Compa-ratio          Range penetration          Flag
    A    13.50   13.50 / 15 = 0.90    (13.50 − 12.5) / 5 = 20%   –
    B    15.75   1.05                 65%                        –
    C    18.00   1.20                 110%  (above max 17.5)     red circle
    D    12.00   0.80                 −10%  (below min 12.5)     green circle
    Group compa-ratio = (13.50 + 15.75 + 18.00 + 12.00) / (4 x 15) = 59.25 / 60 = 0.9875 ≈ 0.99

(c) A: Exceeds, CR 0.90 (0.90–1.10 column) → 6% → 13.50 x 1.06 = 14.31  (new CR 0.954)
    B: Meets,   CR 1.05                   → 4% → 15.75 x 1.04 = 16.38  (new CR 1.092)
    C: Meets,   CR 1.20 → 2% as a lump sum = 18.00 x 2% x 12 = 4.32 per year; base stays 18.00
    D: Meets,   CR 0.80                   → 6% → 12.00 x 1.06 = 12.72 ≥ min 12.5 ✓ (new CR 0.848)

(d) Base increases: 0.81 + 0.63 + 0.72 = 2.16 per month → 2.16 x 12 = 25.92 per year
    First-year cost = 25.92 + 4.32 = 30.24 million
    Budget = 4.5% x (59.25 x 12) = 4.5% x 711 = 31.995 ≈ 32.0 million
    30.24 &lt; 31.995 → within budget, about 1.76 million left</code></pre>
<p><strong>Why:</strong> the compa-ratio shows where each person sits against the market-based midpoint. A receives 6% rather than the 4% for Meets because A is rated Exceeds, not because of range position: a compa-ratio of exactly 0.90 falls in the 0.90–1.10 column, so A just misses the faster below-0.90 rate (8%). D, at 0.80, is the one the matrix speeds up because of range position — a Meets rating earns 6% instead of 4%. C is already paid above the maximum; a base increase would push pay further beyond what the job is worth, so a lump sum rewards performance without inflating base pay. D is below the minimum — a fairness and retention risk — so the increase must at least reach the minimum (6% does; about 4.17% would have been the bare minimum). The group compa-ratio of 0.99 looks healthy, but it hides one person above and one below the range — always look at individuals too. Finally, base increases recur every year while lump sums do not, which is why the budget check separates them.</p>`,
    `<span class="eyebrow">HRM202c · Phần 4 · Bài tập 2</span>
<h2>Bài tập 2 — khung lương, compa-ratio và tăng lương theo thành tích</h2>
<div class="callout"><span class="badge">Đề</span> Delta Retail (công ty giả định) đặt ngạch 3 với điểm giữa 15,0 triệu đồng mỗi tháng, độ rộng khung 40%, và chênh lệch điểm giữa giữa các ngạch là 15%. Bốn nhân viên ngạch 3 có lương tháng (minh hoạ): A 13,50 triệu, đánh giá Vượt kỳ vọng; B 15,75 triệu, Đạt; C 18,00 triệu, Đạt; D 12,00 triệu, Đạt. (a) Tính mức tối thiểu và tối đa của ngạch 3, và điểm giữa, tối thiểu, tối đa của ngạch 4. (b) Tính compa-ratio và mức thâm nhập khung của từng người, compa-ratio của cả nhóm, và chỉ ra trường hợp khoanh đỏ, khoanh xanh. (c) Áp dụng ma trận tăng lương ở bài 4.2; người bị khoanh đỏ nhận tỷ lệ đó dưới dạng khoản thưởng trọn gói theo năm thay vì tăng lương cơ bản. Kiểm tra người được khoanh xanh có đạt mức tối thiểu không. (d) Chi phí năm đầu có nằm trong ngân sách tăng lương bằng 4,5% quỹ lương cơ bản cả năm của nhóm không?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Ngạch 3: tối thiểu = 2 x 15,0 / (2 + 0,40) = 30 / 2,4 = 12,5    tối đa = 12,5 x 1,40 = 17,5
    kiểm tra: (12,5 + 17,5) / 2 = 15,0 ✓
    Ngạch 4: điểm giữa = 15,0 x 1,15 = 17,25; tối thiểu = 2 x 17,25 / 2,4 = 14,375; tối đa = 14,375 x 1,40 = 20,125

(b) NV    Lương   Compa-ratio          Mức thâm nhập khung          Ghi chú
    A    13,50   13,50 / 15 = 0,90    (13,50 − 12,5) / 5 = 20%     –
    B    15,75   1,05                 65%                          –
    C    18,00   1,20                 110%  (trên tối đa 17,5)     khoanh đỏ
    D    12,00   0,80                 −10%  (dưới tối thiểu 12,5)  khoanh xanh
    Compa-ratio cả nhóm = (13,50 + 15,75 + 18,00 + 12,00) / (4 x 15) = 59,25 / 60 = 0,9875 ≈ 0,99

(c) A: Vượt, CR 0,90 (cột 0,90–1,10) → 6% → 13,50 x 1,06 = 14,31  (CR mới 0,954)
    B: Đạt,  CR 1,05                → 4% → 15,75 x 1,04 = 16,38  (CR mới 1,092)
    C: Đạt,  CR 1,20 → 2% dạng thưởng trọn gói = 18,00 x 2% x 12 = 4,32 mỗi năm; lương cơ bản giữ 18,00
    D: Đạt,  CR 0,80                → 6% → 12,00 x 1,06 = 12,72 ≥ tối thiểu 12,5 ✓ (CR mới 0,848)

(d) Tăng lương cơ bản: 0,81 + 0,63 + 0,72 = 2,16 mỗi tháng → 2,16 x 12 = 25,92 mỗi năm
    Chi phí năm đầu = 25,92 + 4,32 = 30,24 triệu
    Ngân sách = 4,5% x (59,25 x 12) = 4,5% x 711 = 31,995 ≈ 32,0 triệu
    30,24 &lt; 31,995 → nằm trong ngân sách, còn dư khoảng 1,76 triệu</code></pre>
<p><strong>Vì sao:</strong> compa-ratio cho biết mỗi người đứng ở đâu so với điểm giữa dựa trên thị trường. A được 6% thay vì 4% của mức Đạt là nhờ xếp loại Vượt kỳ vọng, không phải nhờ vị trí trong khung: compa-ratio đúng 0,90 rơi vào cột 0,90–1,10, nên A vừa lỡ mức ưu tiên của cột dưới 0,90 (8%). D, với 0,80, mới là người được ma trận đẩy nhanh vì vị trí thấp trong khung — xếp loại Đạt nhưng nhận 6% thay vì 4%. C đã được trả trên mức tối đa; tăng lương cơ bản sẽ đẩy lương càng vượt xa giá trị của công việc, nên khoản thưởng trọn gói ghi nhận thành tích mà không làm phình lương cơ bản. D ở dưới mức tối thiểu — một rủi ro về công bằng và giữ chân — nên mức tăng ít nhất phải đưa D lên mức tối thiểu (6% làm được; khoảng 4,17% là mức vừa đủ). Compa-ratio cả nhóm 0,99 trông ổn, nhưng che mất một người trên khung và một người dưới khung — luôn nhìn cả từng cá nhân. Cuối cùng, tăng lương cơ bản lặp lại mỗi năm còn thưởng trọn gói thì không, vì vậy phép kiểm ngân sách tách riêng hai khoản.</p>`,
  ]]);

const c9q = quiz('hrm202c-quiz-4', 'Quiz 4 — Compensation & benefits|||Quiz 4 — Lương thưởng & phúc lợi', [
  { id: 'q1', question: 'An employee earns 11.7 million VND a month in a grade whose midpoint is 13.0 million. What is the compa-ratio?|||Một nhân viên nhận 11,7 triệu đồng mỗi tháng ở ngạch có điểm giữa 13,0 triệu. Compa-ratio bằng bao nhiêu?', options: ['1.11|||1,11', '1.30|||1,30', '0.90|||0,90', '0.13|||0,13'], correctIndex: 2, explanation: 'Compa-ratio = actual pay / midpoint = 11.7 / 13.0 = 0.90; 1.11 is the ratio inverted.|||Compa-ratio = lương thực tế / điểm giữa = 11,7 / 13,0 = 0,90; 1,11 là tỷ số bị đảo ngược.' },
  { id: 'q2', question: 'Which job evaluation method rates each job on compensable factors with defined degrees and adds up the points?|||Phương pháp định giá công việc nào chấm mỗi công việc theo các yếu tố được trả lương với các mức xác định rồi cộng điểm?', options: ['Ranking|||Xếp hạng', 'Point-factor method|||Phương pháp tính điểm theo yếu tố', 'Job classification|||Phân loại (xếp ngạch)', 'Pay survey|||Khảo sát lương'], correctIndex: 1, explanation: 'The point-factor method is quantitative: factor degrees carry points that are summed. A pay survey measures the external market, not internal job worth.|||Phương pháp tính điểm theo yếu tố mang tính định lượng: mỗi mức của yếu tố có điểm và được cộng lại. Khảo sát lương đo thị trường bên ngoài, không đo giá trị nội bộ của công việc.' },
  { id: 'q3', question: 'Which incentive plan pays employees a share of cost or productivity gains of their unit measured against an agreed baseline?|||Kế hoạch khuyến khích nào trả cho người lao động một phần khoản tiết kiệm chi phí hoặc tăng năng suất của đơn vị so với một mức gốc đã thống nhất?', options: ['Piece rate|||Lương khoán sản phẩm', 'Profit sharing|||Chia sẻ lợi nhuận', 'Stock options|||Quyền chọn mua cổ phiếu', 'Gainsharing|||Chia sẻ lợi ích năng suất (gainsharing)'], correctIndex: 3, explanation: 'Gainsharing rewards unit-level gains that employees can influence; profit sharing depends on company profit, which many other factors affect.|||Gainsharing thưởng cho lợi ích ở cấp đơn vị mà người lao động tác động được; chia sẻ lợi nhuận phụ thuộc lợi nhuận công ty, vốn chịu ảnh hưởng của nhiều yếu tố khác.' },
]);

const c10 = doc('hrm202c-5-1-employee-relations', '5.1 — Employee relations and health & safety|||5.1 — Quan hệ lao động và an toàn – sức khoẻ',
  'Quan điểm nhất nguyên và đa nguyên về quan hệ lao động, tiếng nói người lao động, thủ tục khiếu nại và kỷ luật, an toàn – vệ sinh lao động (điều kiện và hành vi không an toàn, thứ bậc biện pháp kiểm soát, tỷ lệ tai nạn theo số giờ làm việc), rủi ro tâm lý xã hội, các nguyên tắc và quyền cơ bản tại nơi làm việc của ILO.',
  [[
    `<span class="eyebrow">HRM202c · Part 5 · Lesson 5.1</span>
<h2>Employee relations and health &amp; safety</h2>
<p class="lead">Employee relations covers how an organisation and its people — individually and collectively — manage their relationship: communication, voice, grievances, discipline, bargaining and conflict. Health and safety protects people’s physical and mental well-being. Both operate within the law, which lesson 5.2 summarises for Vietnam.</p>
<h3>Two perspectives on the employment relationship</h3>
<p>The <strong>unitarist</strong> view sees managers and employees as one team with shared goals, so conflict signals poor communication. The <strong>pluralist</strong> view accepts that groups have legitimate different interests (pay versus cost, flexibility versus security) that must be negotiated through institutions such as trade unions and collective bargaining. HR works best when it designs processes that are fair under both views.</p>
<h3>Voice, grievances and discipline</h3>
<ul>
<li><strong>Employee voice:</strong> surveys, open meetings, suggestion schemes, dialogue with employee representatives.</li>
<li><strong>Grievance procedure:</strong> clear steps and time limits, escalation to a higher level, and protection from retaliation.</li>
<li><strong>Discipline:</strong> written rules communicated in advance; facts investigated; the employee heard; penalties proportionate and consistent; everything documented. Many firms use <em>progressive</em> steps for minor repeated problems, always within the forms allowed by law.</li>
<li><strong>Exit interviews</strong> reveal fixable causes of turnover.</li>
</ul>
<h3>Occupational safety and health (OSH)</h3>
<p>Accidents have two broad causes: <strong>unsafe conditions</strong> (unguarded machines, poor lighting, slippery floors) and <strong>unsafe acts</strong> (skipping procedures, not wearing protective equipment, working while exhausted). Prevention follows the <strong>hierarchy of controls</strong>, from most to least effective:</p>
<ol>
<li><strong>Elimination</strong> — remove the hazard.</li>
<li><strong>Substitution</strong> — replace it with something less dangerous.</li>
<li><strong>Engineering controls</strong> — guards, ventilation, isolation.</li>
<li><strong>Administrative controls</strong> — procedures, training, job rotation, signs.</li>
<li><strong>Personal protective equipment (PPE)</strong> — the last line of defence.</li>
</ol>
<p>Safety performance is compared using rates that adjust for hours worked:</p>
<pre><code>Illustrative: 6 recordable injuries, 480,000 hours worked in a year
Rate per 200,000 hours (US OSHA convention, about 100 full-time workers a year)
      = 6 x 200,000 / 480,000   = 2.5
Rate per 1,000,000 hours (convention used in many other countries)
      = 6 x 1,000,000 / 480,000 = 12.5</code></pre>
<p>Well-being also means managing <strong>psychosocial risks</strong> — excessive workload, harassment, very long hours. The World Health Organization describes burnout as an occupational phenomenon resulting from chronic workplace stress that has not been successfully managed.</p>
<h3>International baseline</h3>
<p>The International Labour Organization (ILO) sets out fundamental principles and rights at work: freedom of association and collective bargaining; elimination of forced labour; abolition of child labour; elimination of discrimination; and a safe and healthy working environment.</p>
<div class="callout"><span class="badge">Practice</span> Treat safety and discipline as systems, not one-off events: record near misses as well as injuries, investigate causes rather than looking for someone to blame, and apply rules consistently so that employees see them as fair.</div>`,
    `<span class="eyebrow">HRM202c · Phần 5 · Bài 5.1</span>
<h2>Quan hệ lao động và an toàn – sức khoẻ</h2>
<p class="lead">Quan hệ lao động bao gồm cách tổ chức và người lao động — từng cá nhân và tập thể — quản lý mối quan hệ của họ: giao tiếp, tiếng nói, khiếu nại, kỷ luật, thương lượng và xung đột. An toàn – sức khoẻ bảo vệ thể chất và tinh thần của con người. Cả hai vận hành trong khuôn khổ pháp luật, được tóm tắt cho Việt Nam ở bài 5.2.</p>
<h3>Hai quan điểm về quan hệ lao động</h3>
<p>Quan điểm <strong>nhất nguyên</strong> coi quản lý và người lao động là một đội có chung mục tiêu, nên xung đột là dấu hiệu giao tiếp kém. Quan điểm <strong>đa nguyên</strong> chấp nhận rằng các nhóm có lợi ích khác nhau chính đáng (tiền lương so với chi phí, linh hoạt so với ổn định) cần được thương lượng qua các thiết chế như công đoàn và thương lượng tập thể. HR làm tốt nhất khi thiết kế các quy trình công bằng dưới cả hai góc nhìn.</p>
<h3>Tiếng nói, khiếu nại và kỷ luật</h3>
<ul>
<li><strong>Tiếng nói người lao động:</strong> khảo sát, họp mở, hòm thư góp ý, đối thoại với đại diện người lao động.</li>
<li><strong>Thủ tục khiếu nại:</strong> các bước và thời hạn rõ ràng, chuyển lên cấp cao hơn, và bảo vệ người khiếu nại khỏi bị trả đũa.</li>
<li><strong>Kỷ luật:</strong> nội quy bằng văn bản được phổ biến trước; điều tra sự việc; người lao động được trình bày; hình thức xử lý tương xứng và nhất quán; mọi thứ được lập hồ sơ. Nhiều doanh nghiệp xử lý <em>tăng dần</em> với vi phạm nhỏ lặp lại, nhưng luôn trong các hình thức pháp luật cho phép.</li>
<li><strong>Phỏng vấn thôi việc</strong> chỉ ra những nguyên nhân nghỉ việc có thể khắc phục.</li>
</ul>
<h3>An toàn, vệ sinh lao động</h3>
<p>Tai nạn có hai nhóm nguyên nhân chính: <strong>điều kiện không an toàn</strong> (máy không có che chắn, thiếu ánh sáng, sàn trơn) và <strong>hành vi không an toàn</strong> (bỏ qua quy trình, không dùng phương tiện bảo hộ, làm việc khi kiệt sức). Phòng ngừa theo <strong>thứ bậc các biện pháp kiểm soát</strong>, từ hiệu quả nhất tới kém nhất:</p>
<ol>
<li><strong>Loại bỏ</strong> — dẹp bỏ mối nguy.</li>
<li><strong>Thay thế</strong> — dùng thứ ít nguy hiểm hơn.</li>
<li><strong>Biện pháp kỹ thuật</strong> — che chắn, thông gió, cách ly.</li>
<li><strong>Biện pháp hành chính</strong> — quy trình, huấn luyện, luân chuyển công việc, biển báo.</li>
<li><strong>Phương tiện bảo vệ cá nhân (PPE)</strong> — tuyến phòng thủ cuối cùng.</li>
</ol>
<p>Kết quả an toàn được so sánh bằng các tỷ lệ đã điều chỉnh theo số giờ làm việc:</p>
<pre><code>Minh hoạ: 6 vụ tai nạn phải ghi nhận, 480.000 giờ làm việc trong năm
Tỷ lệ trên 200.000 giờ (quy ước OSHA của Mỹ, xấp xỉ 100 lao động toàn thời gian trong một năm)
      = 6 x 200.000 / 480.000   = 2,5
Tỷ lệ trên 1.000.000 giờ (quy ước được nhiều nước khác dùng)
      = 6 x 1.000.000 / 480.000 = 12,5</code></pre>
<p>Chăm lo sức khoẻ tinh thần còn là quản lý các <strong>rủi ro tâm lý xã hội</strong> — khối lượng công việc quá tải, quấy rối, làm việc quá dài giờ. Tổ chức Y tế Thế giới mô tả kiệt sức (burnout) là một hiện tượng nghề nghiệp do căng thẳng kéo dài tại nơi làm việc chưa được quản lý thành công.</p>
<h3>Chuẩn mực quốc tế</h3>
<p>Tổ chức Lao động Quốc tế (ILO) nêu các nguyên tắc và quyền cơ bản tại nơi làm việc: tự do hiệp hội và thương lượng tập thể; xoá bỏ lao động cưỡng bức; xoá bỏ lao động trẻ em; xoá bỏ phân biệt đối xử; và môi trường làm việc an toàn, lành mạnh.</p>
<div class="callout"><span class="badge">Thực hành</span> Hãy coi an toàn và kỷ luật là hệ thống chứ không phải sự việc riêng lẻ: ghi nhận cả sự cố suýt xảy ra lẫn tai nạn, điều tra nguyên nhân thay vì tìm người để đổ lỗi, và áp dụng quy định nhất quán để người lao động thấy công bằng.</div>`,
  ]]);

const c10b = doc('hrm202c-5-2-vietnam-labour-law', '5.2 — Vietnamese labour law: principles for HR|||5.2 — Luật lao động Việt Nam: nguyên tắc cho người làm nhân sự',
  'Nguồn luật (Bộ luật Lao động và các luật liên quan), nguyên tắc về hợp đồng, thử việc, thời giờ làm việc và làm thêm giờ, nghỉ phép, tiền lương, bảo hiểm bắt buộc, nội quy và kỷ luật, chấm dứt hợp đồng, không phân biệt đối xử, quan hệ tập thể; bảng đối chiếu luật với chu trình nhân sự (có rào đón: kiểm văn bản đang có hiệu lực).',
  [[
    `<span class="eyebrow">HRM202c · Part 5 · Lesson 5.2</span>
<h2>Vietnamese labour law: principles for HR</h2>
<p class="lead">HR decisions in Vietnam must respect the Labour Code and related laws. This lesson summarises the principles that shape everyday HR work — a map of what to check, not a substitute for the legal text.</p>
<h3>Sources of law</h3>
<p>The main source is the <strong>Labour Code</strong> (the current Code was adopted in 2019 and took effect in 2021), with implementing decrees and circulars, plus separate laws on social insurance, health insurance, employment (which governs unemployment insurance), occupational safety and hygiene, and trade unions — several of these were replaced in 2024–2025, so check the version in force.</p>
<h3>Principles to know</h3>
<ul>
<li><strong>Employment contracts</strong> are either indefinite-term or fixed-term (a fixed term of up to 36 months) and are normally concluded in writing.</li>
<li><strong>Probation</strong> may be agreed; its maximum length depends on the level of the job, and probation pay must be at least 85% of the job’s wage.</li>
<li><strong>Working time:</strong> normal hours are no more than 8 per day (up to 10 per day if the employer schedules by week) and 48 per week. Overtime normally needs the employee’s consent (except in special cases defined by law), is capped by day, month and year, and is paid at no less than 150% on normal working days, 200% on weekly rest days and 300% on public holidays and paid leave days.</li>
<li><strong>Leave:</strong> at least 12 working days of paid annual leave for normal working conditions, rising with length of service, plus paid public holidays.</li>
<li><strong>Wages:</strong> not below the regional minimum wage set by the Government; paid in full and on time; equal pay for work of equal value regardless of gender.</li>
<li><strong>Insurance:</strong> social, health and unemployment insurance are compulsory for eligible employees, with contributions from both sides.</li>
<li><strong>Internal labour rules</strong> must be in writing when an employer uses 10 or more employees. Discipline may take only the forms set by law — reprimand, extension of the wage-increase period, removal from a managerial position (for employees holding one) and dismissal — must follow the legal procedure, and <strong>fines or wage cuts may not be used in place of discipline</strong>.</li>
<li><strong>Termination:</strong> employees may resign, usually with advance notice whose length depends on the contract type and, for some occupations, on the job itself; in some cases defined by law (for example unpaid or late wages, maltreatment or sexual harassment) no notice is required; employers may terminate only on grounds and by procedures set in law, and a severance allowance may be payable.</li>
<li><strong>Non-discrimination:</strong> discrimination (for example by gender, age, ethnicity, religion, disability, marital status or pregnancy) and sexual harassment at work are prohibited.</li>
<li><strong>Collective relations:</strong> employees may be represented by a grassroots trade union or another employee representative organisation at the enterprise; employers and representatives bargain collectively and may sign a collective labour agreement; disputes are settled through mediation, arbitration or the courts, and strikes are lawful only under strict conditions and procedures.</li>
</ul>
<h3>Where the law meets the HR cycle</h3>
<table>
<tr><th>HR process</th><th>Legal checkpoints</th></tr>
<tr><td>Recruitment and selection</td><td>Job-related, non-discriminatory requirements and interview questions; the right contract type; probation length and probation pay</td></tr>
<tr><td>Working time and pay</td><td>Normal hours; overtime consent, caps and premiums; regional minimum wage; equal pay for work of equal value; full and on-time payment</td></tr>
<tr><td>Benefits</td><td>Compulsory social, health and unemployment insurance; paid annual leave and public holidays</td></tr>
<tr><td>Discipline</td><td>Written internal rules where required; only the legal forms of discipline; the legal procedure followed; no fines or wage cuts</td></tr>
<tr><td>Termination</td><td>Lawful grounds, notice and severance where due; final pay settled and insurance records returned within the legal time limit</td></tr>
<tr><td>Collective relations and safety</td><td>Dialogue and bargaining with employee representatives; occupational safety duties such as risk assessment, safety training and protective equipment</td></tr>
</table>
<div class="callout"><span class="badge">Legal note</span> This is a principle-level summary for learning, not legal advice. Figures such as notice periods, overtime caps, contribution rates and minimum wages are amended from time to time — always check the text currently in force (for example on the national legal database vbpl.vn) or ask a qualified adviser.</div>`,
    `<span class="eyebrow">HRM202c · Phần 5 · Bài 5.2</span>
<h2>Luật lao động Việt Nam: nguyên tắc cho người làm nhân sự</h2>
<p class="lead">Các quyết định nhân sự ở Việt Nam phải tôn trọng Bộ luật Lao động và các luật liên quan. Bài này tóm tắt những nguyên tắc định hình công việc nhân sự hằng ngày — một tấm bản đồ về những điều cần kiểm tra, không thay thế cho văn bản pháp luật.</p>
<h3>Nguồn luật</h3>
<p>Nguồn chính là <strong>Bộ luật Lao động</strong> (bộ luật hiện hành được thông qua năm 2019 và có hiệu lực từ năm 2021), cùng các nghị định, thông tư hướng dẫn, và các luật riêng về bảo hiểm xã hội, bảo hiểm y tế, việc làm (điều chỉnh bảo hiểm thất nghiệp), an toàn vệ sinh lao động, công đoàn — nhiều luật trong số này được thay mới trong 2024–2025, nên cần kiểm bản đang có hiệu lực.</p>
<h3>Những nguyên tắc cần biết</h3>
<ul>
<li><strong>Hợp đồng lao động</strong> gồm hợp đồng không xác định thời hạn và hợp đồng xác định thời hạn (thời hạn không quá 36 tháng), thông thường được giao kết bằng văn bản.</li>
<li><strong>Thử việc</strong> có thể được thoả thuận; thời gian tối đa tuỳ theo mức độ công việc, và tiền lương thử việc ít nhất bằng 85% mức lương của công việc đó.</li>
<li><strong>Thời giờ làm việc:</strong> thời giờ làm việc bình thường không quá 8 giờ một ngày (tối đa 10 giờ một ngày nếu quy định theo tuần) và 48 giờ một tuần. Làm thêm giờ thông thường cần có sự đồng ý của người lao động (trừ các trường hợp đặc biệt luật định), bị giới hạn theo ngày, tháng, năm, và được trả ít nhất 150% vào ngày thường, 200% vào ngày nghỉ hằng tuần và 300% vào ngày nghỉ lễ, tết, ngày nghỉ có hưởng lương.</li>
<li><strong>Nghỉ phép:</strong> ít nhất 12 ngày làm việc nghỉ hằng năm có hưởng lương với điều kiện làm việc bình thường, tăng theo thâm niên, cộng các ngày nghỉ lễ, tết có hưởng lương.</li>
<li><strong>Tiền lương:</strong> không thấp hơn mức lương tối thiểu vùng do Chính phủ quy định; trả đầy đủ, đúng hạn; trả lương bình đẳng cho công việc có giá trị như nhau, không phân biệt giới tính.</li>
<li><strong>Bảo hiểm:</strong> bảo hiểm xã hội, bảo hiểm y tế và bảo hiểm thất nghiệp là bắt buộc với người lao động thuộc diện tham gia, với phần đóng của cả hai bên.</li>
<li><strong>Nội quy lao động</strong> phải bằng văn bản khi người sử dụng lao động sử dụng từ 10 người lao động trở lên. Kỷ luật chỉ được áp dụng các hình thức luật định — khiển trách, kéo dài thời hạn nâng lương, cách chức (với người đang giữ chức vụ quản lý) và sa thải — phải theo đúng trình tự, và <strong>không được phạt tiền, cắt lương thay cho việc xử lý kỷ luật</strong>.</li>
<li><strong>Chấm dứt hợp đồng:</strong> người lao động có thể nghỉ việc, thông thường với thời hạn báo trước tuỳ loại hợp đồng và, với một số ngành nghề đặc thù, tuỳ công việc; trong một số trường hợp luật định (ví dụ không được trả lương đủ hoặc đúng hạn, bị ngược đãi hay quấy rối tình dục) thì không cần báo trước; người sử dụng lao động chỉ được đơn phương chấm dứt theo các căn cứ và trình tự luật định, và có thể phải trả trợ cấp thôi việc.</li>
<li><strong>Không phân biệt đối xử:</strong> cấm phân biệt đối xử (ví dụ theo giới tính, độ tuổi, dân tộc, tôn giáo, khuyết tật, tình trạng hôn nhân hay thai sản) và quấy rối tình dục tại nơi làm việc.</li>
<li><strong>Quan hệ tập thể:</strong> người lao động có thể được đại diện bởi công đoàn cơ sở hoặc tổ chức đại diện người lao động khác tại doanh nghiệp; người sử dụng lao động và đại diện thương lượng tập thể và có thể ký thoả ước lao động tập thể; tranh chấp được giải quyết qua hoà giải, trọng tài hoặc toà án, và đình công chỉ hợp pháp khi đáp ứng các điều kiện và trình tự chặt chẽ.</li>
</ul>
<h3>Luật gặp chu trình nhân sự ở đâu</h3>
<table>
<tr><th>Hoạt động nhân sự</th><th>Điểm cần kiểm tra về pháp lý</th></tr>
<tr><td>Tuyển mộ và tuyển chọn</td><td>Yêu cầu và câu hỏi phỏng vấn gắn với công việc, không phân biệt đối xử; đúng loại hợp đồng; thời gian và tiền lương thử việc</td></tr>
<tr><td>Thời giờ làm việc và tiền lương</td><td>Giờ làm việc bình thường; sự đồng ý, giới hạn và mức trả khi làm thêm giờ; lương tối thiểu vùng; trả lương bình đẳng cho công việc có giá trị như nhau; trả đủ và đúng hạn</td></tr>
<tr><td>Phúc lợi</td><td>Bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp bắt buộc; nghỉ hằng năm và nghỉ lễ, tết có hưởng lương</td></tr>
<tr><td>Kỷ luật</td><td>Nội quy bằng văn bản khi luật yêu cầu; chỉ dùng các hình thức kỷ luật luật định; tuân thủ trình tự; không phạt tiền, cắt lương</td></tr>
<tr><td>Chấm dứt hợp đồng</td><td>Căn cứ hợp pháp, báo trước và trợ cấp thôi việc nếu phải trả; thanh toán các khoản và trả lại hồ sơ bảo hiểm trong thời hạn luật định</td></tr>
<tr><td>Quan hệ tập thể và an toàn</td><td>Đối thoại và thương lượng với đại diện người lao động; nghĩa vụ an toàn, vệ sinh lao động như đánh giá rủi ro, huấn luyện an toàn và phương tiện bảo hộ</td></tr>
</table>
<div class="callout"><span class="badge">Lưu ý pháp lý</span> Đây là bản tóm tắt ở mức nguyên tắc để học tập, không phải tư vấn pháp lý. Các con số như thời hạn báo trước, giới hạn làm thêm giờ, tỷ lệ đóng bảo hiểm và lương tối thiểu được sửa đổi theo thời gian — luôn kiểm văn bản đang có hiệu lực (ví dụ trên Cơ sở dữ liệu quốc gia về pháp luật vbpl.vn) hoặc hỏi người tư vấn có chuyên môn.</div>`,
  ]]);

const c11 = doc('hrm202c-5-3-hr-analytics-digital', '5.3 — HR analytics and HRM in the digital era|||5.3 — Phân tích dữ liệu nhân sự và HRM thời đại số',
  'Bảng các chỉ số nhân sự cốt lõi kèm công thức (tỷ lệ nghỉ việc, tỷ lệ giữ chân, nghỉ việc năm đầu, chi phí tuyển một người, thời gian tuyển, tỷ lệ vắng mặt, eNPS…), bốn cấp độ phân tích, ví dụ số tìm điểm nóng nghỉ việc theo nhóm, công cụ số trong HR (HRIS, ATS, AI, LMS), làm việc từ xa và kết hợp, rủi ro thiên lệch thuật toán và quyền riêng tư.',
  [[
    `<span class="eyebrow">HRM202c · Part 5 · Lesson 5.3</span>
<h2>HR analytics and HRM in the digital era</h2>
<p class="lead">HR analytics (people analytics) uses data about the workforce to improve decisions on hiring, development, retention and performance. Digital tools make that data available — and bring new risks that HR must manage.</p>
<h3>Core HR metrics</h3>
<table>
<tr><th>Metric</th><th>Formula</th><th>Watch</th></tr>
<tr><td>Annual turnover rate</td><td>separations in the year / average headcount x 100</td><td>Split voluntary vs involuntary, and regretted vs non-regretted leavers</td></tr>
<tr><td>Retention rate</td><td>employees at the start still employed at the end / employees at the start x 100</td><td>Not equal to 100% − turnover</td></tr>
<tr><td>First-year turnover</td><td>new hires who left within 12 months / new hires x 100</td><td>Signals recruiting or onboarding problems</td></tr>
<tr><td>Cost per hire</td><td>(external costs + internal costs) / number of hires</td><td>Include agency fees, advertising, recruiter and interviewer time</td></tr>
<tr><td>Time to fill</td><td>days from approved requisition to offer accepted</td><td>Definitions differ — state yours</td></tr>
<tr><td>Time to hire</td><td>days from a candidate entering the process to accepting the offer</td><td>Reflects candidate experience</td></tr>
<tr><td>Offer acceptance rate</td><td>offers accepted / offers made x 100</td><td>A low rate points to pay or employer-brand problems</td></tr>
<tr><td>Absenteeism rate</td><td>days lost to absence / scheduled working days x 100</td><td>e.g. 1,920 / (400 x 240) = 2.0%</td></tr>
<tr><td>Training hours per employee</td><td>total training hours / average headcount</td><td>Input measure; pair with Kirkpatrick results</td></tr>
<tr><td>Employee net promoter score (eNPS)</td><td>% promoters (score 9–10) − % detractors (score 0–6)</td><td>Ranges from −100 to +100</td></tr>
<tr><td>Revenue per employee</td><td>revenue / average full-time equivalents</td><td>A rough productivity proxy</td></tr>
</table>
<h3>Four levels of analytics</h3>
<table>
<tr><th>Level</th><th>Question</th><th>Example</th></tr>
<tr><td>Descriptive</td><td>What happened?</td><td>Turnover was 13.5% last year</td></tr>
<tr><td>Diagnostic</td><td>Why did it happen?</td><td>Store staff turnover is four times office turnover; exit interviews mention unpredictable schedules</td></tr>
<tr><td>Predictive</td><td>What is likely to happen?</td><td>A model flags employees at higher risk of leaving</td></tr>
<tr><td>Prescriptive</td><td>What should we do?</td><td>Test fixed weekly schedules in 5 stores against 5 comparable stores</td></tr>
</table>
<h3>Worked example — finding the hotspot (fictional, illustrative)</h3>
<pre><code>Segment        Average headcount   Leavers   Turnover
Store staff          200             40       40 / 200 = 20.0%
Warehouse             80              8        8 / 80  = 10.0%
Office               120              6        6 / 120 =  5.0%
Total                400             54       54 / 400 = 13.5%
Store staff share of all leavers = 40 / 54 ≈ 74%</code></pre>
<p>The company average hides the problem. Action should target store scheduling and supervision — not a company-wide pay rise that would cost far more and miss the cause.</p>
<h3>HRM in the digital era</h3>
<ul>
<li><strong>HRIS and self-service:</strong> one system of record for employee data, leave, payroll and documents.</li>
<li><strong>Recruiting technology:</strong> applicant tracking systems (ATS), online job boards, social recruiting, video interviews, skills-based matching.</li>
<li><strong>AI tools:</strong> CV screening, chatbots that answer candidates’ and employees’ questions, drafting job descriptions, suggesting learning content.</li>
<li><strong>Learning platforms:</strong> learning management systems (LMS), microlearning, mobile learning.</li>
<li><strong>Continuous performance tools:</strong> regular check-ins, real-time feedback, OKR tracking.</li>
<li><strong>New ways of working:</strong> remote and hybrid work, gig and platform workers — raising questions about measuring output, inclusion, well-being and fair treatment.</li>
</ul>
<h3>Risks and ethics</h3>
<p><strong>Algorithmic bias:</strong> a model trained on past hiring decisions can learn past discrimination; audit outcomes by group (the impact ratio from lesson 2.3) and keep people accountable for decisions. <strong>Privacy:</strong> collect only what is needed, tell employees what is collected and why, and secure it; Vietnam also regulates the protection of personal data, so check the current rules. <strong>Surveillance:</strong> monitoring keystrokes or screens can destroy more trust than it creates. Regulation is tightening internationally — for example, the European Union’s AI Act treats AI used for recruitment and for managing workers as high-risk, with extra obligations.</p>
<div class="callout"><span class="badge">Start small</span> Clean definitions and one trusted dashboard — headcount, turnover, time to fill, cost per hire — are worth more than an ambitious prediction model built on messy data.</div>`,
    `<span class="eyebrow">HRM202c · Phần 5 · Bài 5.3</span>
<h2>Phân tích dữ liệu nhân sự và HRM thời đại số</h2>
<p class="lead">Phân tích dữ liệu nhân sự (people analytics) dùng dữ liệu về đội ngũ lao động để cải thiện quyết định về tuyển dụng, phát triển, giữ chân và hiệu suất. Công cụ số giúp có được dữ liệu đó — và mang tới những rủi ro mới mà HR phải quản lý.</p>
<h3>Các chỉ số nhân sự cốt lõi</h3>
<table>
<tr><th>Chỉ số</th><th>Công thức</th><th>Lưu ý</th></tr>
<tr><td>Tỷ lệ nghỉ việc năm</td><td>số người rời đi trong năm / số lao động bình quân x 100</td><td>Tách tự nguyện và không tự nguyện, người ra đi đáng tiếc và không đáng tiếc</td></tr>
<tr><td>Tỷ lệ giữ chân</td><td>số người đầu kỳ vẫn còn làm cuối kỳ / số người đầu kỳ x 100</td><td>Không bằng 100% − tỷ lệ nghỉ việc</td></tr>
<tr><td>Nghỉ việc năm đầu</td><td>số người mới tuyển rời đi trong 12 tháng / số người mới tuyển x 100</td><td>Báo hiệu vấn đề ở tuyển dụng hoặc hội nhập</td></tr>
<tr><td>Chi phí tuyển một người</td><td>(chi phí bên ngoài + chi phí nội bộ) / số người tuyển được</td><td>Tính cả phí công ty tuyển dụng, quảng cáo, thời gian của chuyên viên tuyển dụng và người phỏng vấn</td></tr>
<tr><td>Thời gian lấp vị trí (time to fill)</td><td>số ngày từ khi yêu cầu tuyển được duyệt tới khi ứng viên nhận lời</td><td>Định nghĩa khác nhau giữa các nơi — nêu rõ định nghĩa của bạn</td></tr>
<tr><td>Thời gian tuyển (time to hire)</td><td>số ngày từ khi ứng viên vào quy trình tới khi nhận lời</td><td>Phản ánh trải nghiệm ứng viên</td></tr>
<tr><td>Tỷ lệ nhận lời mời</td><td>số lời mời được nhận / số lời mời đã gửi x 100</td><td>Thấp thì có vấn đề về lương hoặc thương hiệu nhà tuyển dụng</td></tr>
<tr><td>Tỷ lệ vắng mặt</td><td>số ngày vắng mặt / số ngày làm việc theo lịch x 100</td><td>ví dụ 1.920 / (400 x 240) = 2,0%</td></tr>
<tr><td>Số giờ đào tạo mỗi người</td><td>tổng số giờ đào tạo / số lao động bình quân</td><td>Chỉ số đầu vào; nên đi kèm kết quả theo Kirkpatrick</td></tr>
<tr><td>Chỉ số sẵn lòng giới thiệu của nhân viên (eNPS)</td><td>% người ủng hộ (chấm 9–10) − % người phản đối (chấm 0–6)</td><td>Nằm trong khoảng −100 đến +100</td></tr>
<tr><td>Doanh thu mỗi lao động</td><td>doanh thu / số lao động quy đổi toàn thời gian bình quân</td><td>Một thước đo năng suất gần đúng</td></tr>
</table>
<h3>Bốn cấp độ phân tích</h3>
<table>
<tr><th>Cấp độ</th><th>Câu hỏi</th><th>Ví dụ</th></tr>
<tr><td>Mô tả</td><td>Điều gì đã xảy ra?</td><td>Tỷ lệ nghỉ việc năm ngoái là 13,5%</td></tr>
<tr><td>Chẩn đoán</td><td>Vì sao nó xảy ra?</td><td>Tỷ lệ nghỉ việc của nhân viên cửa hàng gấp bốn lần khối văn phòng; phỏng vấn thôi việc nhắc tới lịch làm việc thất thường</td></tr>
<tr><td>Dự báo</td><td>Điều gì có khả năng xảy ra?</td><td>Một mô hình đánh dấu những nhân viên có nguy cơ nghỉ việc cao hơn</td></tr>
<tr><td>Đề xuất</td><td>Chúng ta nên làm gì?</td><td>Thử lịch làm việc cố định theo tuần ở 5 cửa hàng, so với 5 cửa hàng tương đương</td></tr>
</table>
<h3>Ví dụ có lời giải — tìm điểm nóng (tình huống giả định, số liệu minh hoạ)</h3>
<pre><code>Nhóm            Lao động bình quân   Số rời đi   Tỷ lệ nghỉ việc
Nhân viên cửa hàng     200              40        40 / 200 = 20,0%
Kho                     80               8         8 / 80  = 10,0%
Văn phòng              120               6         6 / 120 =  5,0%
Tổng                   400              54        54 / 400 = 13,5%
Tỷ trọng của nhân viên cửa hàng trong tổng số người rời đi = 40 / 54 ≈ 74%</code></pre>
<p>Con số trung bình của công ty che mất vấn đề. Hành động nên nhắm vào việc xếp lịch và giám sát ở cửa hàng — chứ không phải tăng lương toàn công ty, vừa tốn kém hơn nhiều vừa trượt khỏi nguyên nhân.</p>
<h3>HRM trong thời đại số</h3>
<ul>
<li><strong>HRIS và tự phục vụ:</strong> một hệ thống gốc cho dữ liệu nhân viên, nghỉ phép, tiền lương và hồ sơ.</li>
<li><strong>Công nghệ tuyển dụng:</strong> hệ thống quản lý ứng viên (ATS), trang việc làm trực tuyến, tuyển dụng qua mạng xã hội, phỏng vấn video, ghép nối theo kỹ năng.</li>
<li><strong>Công cụ AI:</strong> sàng lọc CV, chatbot trả lời câu hỏi của ứng viên và nhân viên, soạn bản mô tả công việc, gợi ý nội dung học.</li>
<li><strong>Nền tảng học tập:</strong> hệ thống quản lý học tập (LMS), học vi mô, học trên thiết bị di động.</li>
<li><strong>Công cụ quản lý hiệu suất liên tục:</strong> trao đổi định kỳ, phản hồi tức thời, theo dõi OKR.</li>
<li><strong>Cách làm việc mới:</strong> làm việc từ xa và kết hợp, lao động tự do và lao động qua nền tảng — đặt ra câu hỏi về đo lường kết quả, hoà nhập, sức khoẻ tinh thần và đối xử công bằng.</li>
</ul>
<h3>Rủi ro và đạo đức</h3>
<p><strong>Thiên lệch thuật toán:</strong> mô hình học từ các quyết định tuyển dụng cũ có thể học luôn sự phân biệt đối xử trong quá khứ; hãy kiểm tra kết quả theo từng nhóm (tỷ số tác động ở bài 2.3) và giữ trách nhiệm quyết định ở con người. <strong>Quyền riêng tư:</strong> chỉ thu thập điều cần thiết, cho nhân viên biết thu thập gì và để làm gì, và bảo mật dữ liệu; Việt Nam cũng có quy định về bảo vệ dữ liệu cá nhân, nên cần kiểm tra quy định hiện hành. <strong>Giám sát:</strong> theo dõi thao tác bàn phím hay màn hình có thể phá huỷ niềm tin nhiều hơn những gì nó mang lại. Quy định quốc tế đang chặt hơn — ví dụ Đạo luật AI của Liên minh châu Âu xếp AI dùng trong tuyển dụng và quản lý người lao động vào nhóm rủi ro cao, kèm thêm nghĩa vụ.</p>
<div class="callout"><span class="badge">Bắt đầu từ nhỏ</span> Định nghĩa rõ ràng và một bảng điều khiển đáng tin — số lao động, tỷ lệ nghỉ việc, thời gian lấp vị trí, chi phí tuyển một người — có giá trị hơn một mô hình dự báo tham vọng dựng trên dữ liệu lộn xộn.</div>`,
  ]]);

const c11e = doc('hrm202c-5-4-exercise', 'Exercise 3 — HR metrics for Echo Logistics|||Bài tập 3 — các chỉ số nhân sự của Echo Logistics',
  'Bài tập số liệu giả định: tính số người tuyển mới, tỷ lệ nghỉ việc năm (tổng, tự nguyện, không tự nguyện), tỷ lệ giữ chân, nghỉ việc năm đầu, chi phí tuyển một người, thời gian lấp vị trí bình quân có trọng số, ước tính chi phí nghỉ việc tự nguyện và khoản tiết kiệm khi giảm; kèm lời giải.',
  [[
    `<span class="eyebrow">HRM202c · Part 5 · Exercise 3</span>
<h2>Exercise 3 — HR metrics for Echo Logistics</h2>
<div class="callout"><span class="badge">Problem</span> Echo Logistics (a fictional company) reports for last year (illustrative numbers): headcount 240 on 1 January and 260 on 31 December; 36 separations (27 voluntary, 9 involuntary); of the 240 people employed on 1 January, 210 were still employed on 31 December. Recruiting costs: external (advertising, agency fees, job boards) VND 420 million; internal (recruiters’ and interviewers’ time) VND 252 million. Hires and average time to fill by job family: sales 20 hires, 25 days; customer service 18 hires, 20 days; IT 6 hires, 55 days; warehouse 12 hires, 15 days. (a) How many people were hired? (b) Compute the annual turnover rate — total, voluntary and involuntary — using average headcount. (c) Compute the retention rate, estimate first-year turnover from the data given, and explain why turnover plus retention is not 100%. (d) Compute cost per hire. (e) Compute the average time to fill, and explain why a simple average of the four families would mislead. (f) If replacing one voluntary leaver costs about VND 20 million (assumed: the 12 million cost per hire plus 8 million for onboarding and lost productivity), estimate the annual cost of voluntary turnover and the saving if voluntary turnover fell to 8%.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Hires = end − start + separations = 260 − 240 + 36 = 56
    check: 240 + 56 − 36 = 260 ✓

(b) Average headcount = (240 + 260) / 2 = 250
    Turnover     = 36 / 250 = 14.4%
    Voluntary    = 27 / 250 = 10.8%
    Involuntary  =  9 / 250 =  3.6%

(c) Retention = 210 / 240 = 87.5%
    Leavers among 1-January staff = 240 − 210 = 30
    → the other 36 − 30 = 6 leavers were hired during the year
    In-year new-hire turnover = 6 / 56 ≈ 10.7%
    This is only a lower bound for first-year turnover: hires made late in the year
    have not yet completed 12 months, so the true rate can only be higher — track
    each hiring cohort for a full 12 months from its start date.
    14.4% + 87.5% ≠ 100%: turnover counts leavers who joined during the year and
    divides by average headcount; retention follows only the starting group.

(d) Cost per hire = (420 + 252) / 56 = 672 / 56 = 12.0 million VND

(e) Weighted average = (20x25 + 18x20 + 6x55 + 12x15) / 56
                     = (500 + 360 + 330 + 180) / 56 = 1,370 / 56 ≈ 24.5 days
    Simple average of families = (25 + 20 + 55 + 15) / 4 = 28.75 days
    → overstates, because IT (6 hires) counts as much as sales (20 hires)

(f) Cost of voluntary turnover ≈ 27 x 20 = 540 million per year
    Target: 8% x 250 = 20 voluntary leavers
    Saving ≈ (27 − 20) x 20 = 140 million per year</code></pre>
<p><strong>Why:</strong> every metric needs a clear definition — which headcount, which leavers, which days — or comparisons between years and firms are meaningless. Turnover and retention answer different questions: how much movement there was, and how much of the starting team you kept. Even as a lower bound, losing at least 10.7% of new hires within their first months points to recruiting or onboarding (lessons 2.1 and 3.1), while the long IT time to fill is where a recruiting fix would help most. Putting a money value on voluntary turnover — even a rough, clearly stated estimate — turns “people issues” into a business case that managers can weigh against the cost of solutions.</p>`,
    `<span class="eyebrow">HRM202c · Phần 5 · Bài tập 3</span>
<h2>Bài tập 3 — các chỉ số nhân sự của Echo Logistics</h2>
<div class="callout"><span class="badge">Đề</span> Echo Logistics (công ty giả định) báo cáo năm vừa qua (số liệu minh hoạ): số lao động 240 người ngày 1 tháng 1 và 260 người ngày 31 tháng 12; 36 người rời đi (27 tự nguyện, 9 không tự nguyện); trong 240 người có mặt ngày 1 tháng 1, 210 người vẫn còn làm việc ngày 31 tháng 12. Chi phí tuyển dụng: bên ngoài (quảng cáo, phí công ty tuyển dụng, trang việc làm) 420 triệu đồng; nội bộ (thời gian của chuyên viên tuyển dụng và người phỏng vấn) 252 triệu đồng. Số người tuyển và thời gian lấp vị trí bình quân theo nhóm công việc: bán hàng 20 người, 25 ngày; chăm sóc khách hàng 18 người, 20 ngày; CNTT 6 người, 55 ngày; kho 12 người, 15 ngày. (a) Công ty đã tuyển bao nhiêu người? (b) Tính tỷ lệ nghỉ việc năm — tổng, tự nguyện và không tự nguyện — theo số lao động bình quân. (c) Tính tỷ lệ giữ chân, ước tính tỷ lệ nghỉ việc năm đầu từ dữ liệu đã cho, và giải thích vì sao tỷ lệ nghỉ việc cộng tỷ lệ giữ chân không bằng 100%. (d) Tính chi phí tuyển một người. (e) Tính thời gian lấp vị trí bình quân, và giải thích vì sao lấy trung bình giản đơn của bốn nhóm sẽ gây hiểu sai. (f) Nếu thay một người nghỉ việc tự nguyện tốn khoảng 20 triệu đồng (giả định: 12 triệu chi phí tuyển một người cộng 8 triệu cho hội nhập và năng suất bị mất), hãy ước tính chi phí hằng năm của nghỉ việc tự nguyện và khoản tiết kiệm nếu tỷ lệ nghỉ việc tự nguyện giảm còn 8%.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Số tuyển mới = cuối kỳ − đầu kỳ + số rời đi = 260 − 240 + 36 = 56
    kiểm tra: 240 + 56 − 36 = 260 ✓

(b) Số lao động bình quân = (240 + 260) / 2 = 250
    Nghỉ việc          = 36 / 250 = 14,4%
    Tự nguyện          = 27 / 250 = 10,8%
    Không tự nguyện    =  9 / 250 =  3,6%

(c) Giữ chân = 210 / 240 = 87,5%
    Số người rời đi trong nhóm có mặt ngày 1/1 = 240 − 210 = 30
    → 36 − 30 = 6 người rời đi còn lại là người được tuyển trong năm
    Tỷ lệ nghỉ trong năm của người mới tuyển = 6 / 56 ≈ 10,7%
    Đây chỉ là cận dưới của tỷ lệ nghỉ việc năm đầu: người tuyển cuối năm chưa đủ
    12 tháng theo dõi, nên tỷ lệ thật chỉ có thể cao hơn — hãy theo dõi từng lứa
    tuyển đủ 12 tháng kể từ ngày vào.
    14,4% + 87,5% ≠ 100%: tỷ lệ nghỉ việc tính cả người vào trong năm rồi rời đi và
    chia cho số lao động bình quân; tỷ lệ giữ chân chỉ theo dõi nhóm đầu kỳ.

(d) Chi phí tuyển một người = (420 + 252) / 56 = 672 / 56 = 12,0 triệu đồng

(e) Bình quân có trọng số = (20x25 + 18x20 + 6x55 + 12x15) / 56
                          = (500 + 360 + 330 + 180) / 56 = 1.370 / 56 ≈ 24,5 ngày
    Trung bình giản đơn của các nhóm = (25 + 20 + 55 + 15) / 4 = 28,75 ngày
    → cao hơn thực tế, vì CNTT (6 người) được tính nặng ngang bán hàng (20 người)

(f) Chi phí nghỉ việc tự nguyện ≈ 27 x 20 = 540 triệu mỗi năm
    Mục tiêu: 8% x 250 = 20 người nghỉ tự nguyện
    Tiết kiệm ≈ (27 − 20) x 20 = 140 triệu mỗi năm</code></pre>
<p><strong>Vì sao:</strong> mỗi chỉ số cần một định nghĩa rõ — số lao động nào, người rời đi nào, tính những ngày nào — nếu không, so sánh giữa các năm và các doanh nghiệp sẽ vô nghĩa. Tỷ lệ nghỉ việc và tỷ lệ giữ chân trả lời hai câu hỏi khác nhau: có bao nhiêu biến động, và giữ lại được bao nhiêu phần của đội ngũ ban đầu. Dù chỉ là cận dưới, việc mất ít nhất 10,7% người mới tuyển ngay trong những tháng đầu đã chỉ ra vấn đề ở tuyển dụng hoặc hội nhập (bài 2.1 và 3.1), còn thời gian lấp vị trí dài của CNTT là nơi cải tiến tuyển dụng có ích nhất. Gắn một giá trị tiền cho nghỉ việc tự nguyện — dù chỉ là ước tính thô nhưng nêu rõ giả định — biến “chuyện con người” thành một phương án kinh doanh mà nhà quản lý có thể cân với chi phí của các giải pháp.</p>`,
  ]]);

const c11q = quiz('hrm202c-quiz-5', 'Quiz 5 — Employee relations, safety & HR analytics|||Quiz 5 — Quan hệ lao động, an toàn & phân tích nhân sự', [
  { id: 'q1', question: 'Headcount was 190 at the start of the year and 210 at the end, with 30 separations. Using average headcount, what is the annual turnover rate?|||Số lao động là 190 người đầu năm và 210 người cuối năm, có 30 người rời đi. Theo số lao động bình quân, tỷ lệ nghỉ việc năm là bao nhiêu?', options: ['14.3%|||14,3%', '15.0%|||15,0%', '15.8%|||15,8%', '30.0%|||30,0%'], correctIndex: 1, explanation: 'Average headcount = (190 + 210) / 2 = 200; 30 / 200 = 15.0%. Dividing by 210 or 190 gives the wrong answers 14.3% and 15.8%.|||Lao động bình quân = (190 + 210) / 2 = 200; 30 / 200 = 15,0%. Chia cho 210 hoặc 190 cho các đáp án sai 14,3% và 15,8%.' },
  { id: 'q2', question: 'In the hierarchy of controls, which measure is the most effective way to deal with a workplace hazard?|||Trong thứ bậc các biện pháp kiểm soát, biện pháp nào hiệu quả nhất để xử lý một mối nguy tại nơi làm việc?', options: ['Eliminating the hazard|||Loại bỏ mối nguy', 'Issuing personal protective equipment|||Cấp phương tiện bảo vệ cá nhân', 'Putting up warning signs|||Treo biển cảnh báo', 'Training workers to be careful|||Huấn luyện người lao động cẩn thận'], correctIndex: 0, explanation: 'Elimination removes the risk itself; signs and training are administrative controls and PPE is the last line of defence.|||Loại bỏ triệt tiêu chính rủi ro; biển báo và huấn luyện là biện pháp hành chính, còn phương tiện bảo vệ cá nhân là tuyến phòng thủ cuối cùng.' },
  { id: 'q3', question: 'A CV-screening model is trained on ten years of past hiring decisions. What is the main risk HR should check?|||Một mô hình sàng lọc CV được huấn luyện trên mười năm quyết định tuyển dụng trước đây. Rủi ro chính mà HR cần kiểm tra là gì?', options: ['It will always be slower than human recruiters|||Nó luôn chậm hơn chuyên viên tuyển dụng', 'It cannot read CVs written in two languages|||Nó không đọc được CV viết bằng hai thứ tiếng', 'It may reproduce past bias against some groups|||Nó có thể lặp lại thiên lệch trong quá khứ đối với một số nhóm', 'It will raise the cost per hire|||Nó sẽ làm tăng chi phí tuyển một người'], correctIndex: 2, explanation: 'Models learn patterns in historical decisions, including discriminatory ones; audit selection rates by group and keep humans accountable.|||Mô hình học các khuôn mẫu trong quyết định cũ, kể cả những khuôn mẫu phân biệt đối xử; hãy kiểm tra tỷ lệ được chọn theo từng nhóm và giữ trách nhiệm ở con người.' },
]);

const taiLieu = doc('hrm202c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">HRM202c · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning human resource management: the official syllabus and slides, textbooks, free professional resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official HRM202c syllabus, learning outcomes and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Human Resource Management</a> — Gary Dessler (Pearson): the classic, practice-oriented textbook — search the title on the publisher’s site for the current edition.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Fundamentals of Human Resource Management</a> — Noe, Hollenbeck, Gerhart &amp; Wright (McGraw Hill): concise, with a strong strategic view — search the title on the publisher’s site. For deeper reading, Michael Armstrong’s <em>Armstrong’s Handbook of Human Resource Management Practice</em> (Kogan Page) is the standard reference.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management</a> — free open textbook; chapter 11 is Human Resource Management.</li>
<li><a href="https://openstax.org/details/books/introduction-business" target="_blank" rel="noopener">OpenStax — Introduction to Business</a> — chapter 8, Managing Human Resources and Labor Relations.</li>
<li><a href="https://www.shrm.org/" target="_blank" rel="noopener">SHRM</a> — the US-based Society for Human Resource Management: articles, toolkits and HR news.</li>
<li><a href="https://www.cipd.org/" target="_blank" rel="noopener">CIPD</a> — the UK professional body for HR and people development: research, reports and practice guides (some content is for members).</li>
<li><a href="https://www.onetonline.org/" target="_blank" rel="noopener">O*NET OnLine</a> — occupational database with tasks, skills and knowledge by occupation — a starting point for job analysis (lesson 1.2).</li>
<li><a href="https://rework.withgoogle.com/" target="_blank" rel="noopener">Google re:Work</a> — practical guides on hiring and onboarding, manager effectiveness, learning and people analytics.</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — Vietnam’s national legal database: check the Labour Code and related texts currently in force (lesson 5.2).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — management, hiring, feedback and leadership topics.</li>
<li><a href="https://www.youtube.com/@SHRMOfficial" target="_blank" rel="noopener">SHRM</a> — the official SHRM channel on HR practice and the workplace.</li>
<li><a href="https://www.youtube.com/@CipdUk" target="_blank" rel="noopener">CIPD</a> — the official CIPD channel on people management and work.</li>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u</a> — short business-studies explainers, including workforce planning, labour turnover and motivation.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — HR metrics, weighted interview scorecards; SLOPE and INTERCEPT fit a pay policy line.</li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Microsoft Excel — Help &amp; learning</a> — official tutorials for the same functions and for PivotTables (turnover by segment).</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — a simple board to run a recruitment pipeline (applied → screened → interviewed → offer → hired).</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — strategic HRM, job analysis, recruitment and selection, following Parts 1–2 here.</li>
<li><strong>Practise</strong> — redo Exercises 1–3 in a spreadsheet with your own numbers; write one job description and one structured interview guide.</li>
<li><strong>Go deeper</strong> — read the performance and reward chapters of a full textbook, then compare a pay structure and a merit matrix with Part 4.</li>
<li><strong>Apply</strong> — build a small HR dashboard (headcount, turnover, time to fill, cost per hire) for a real or fictional team and write three recommendations.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">HRM202c · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học quản trị nguồn nhân lực: giáo trình &amp; slide chính thức, sách giáo khoa, tài liệu nghề nghiệp miễn phí, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình, chuẩn đầu ra và slide bài giảng chính thức của HRM202c.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">Human Resource Management</a> — Gary Dessler (Pearson): giáo trình kinh điển, thiên về thực hành — tra tên sách trên trang nhà xuất bản để tìm ấn bản hiện hành.</li>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">Fundamentals of Human Resource Management</a> — Noe, Hollenbeck, Gerhart &amp; Wright (McGraw Hill): ngắn gọn, góc nhìn chiến lược rõ — tra tên sách trên trang nhà xuất bản. Muốn đọc sâu hơn, cuốn <em>Armstrong’s Handbook of Human Resource Management Practice</em> của Michael Armstrong (Kogan Page) là tài liệu tham khảo chuẩn.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management</a> — giáo trình mở miễn phí; chương 11 là Human Resource Management.</li>
<li><a href="https://openstax.org/details/books/introduction-business" target="_blank" rel="noopener">OpenStax — Introduction to Business</a> — chương 8, Managing Human Resources and Labor Relations.</li>
<li><a href="https://www.shrm.org/" target="_blank" rel="noopener">SHRM</a> — Hiệp hội Quản trị Nhân sự (Mỹ): bài viết, bộ công cụ và tin tức nhân sự.</li>
<li><a href="https://www.cipd.org/" target="_blank" rel="noopener">CIPD</a> — hiệp hội nghề nghiệp về nhân sự và phát triển con người của Anh: nghiên cứu, báo cáo và hướng dẫn thực hành (một phần nội dung dành cho hội viên).</li>
<li><a href="https://www.onetonline.org/" target="_blank" rel="noopener">O*NET OnLine</a> — cơ sở dữ liệu nghề nghiệp với nhiệm vụ, kỹ năng, kiến thức theo từng nghề — điểm xuất phát cho phân tích công việc (bài 1.2).</li>
<li><a href="https://rework.withgoogle.com/" target="_blank" rel="noopener">Google re:Work</a> — hướng dẫn thực hành về tuyển dụng và hội nhập, hiệu quả của quản lý, đào tạo và phân tích dữ liệu nhân sự.</li>
<li><a href="https://vbpl.vn/" target="_blank" rel="noopener">vbpl.vn</a> — Cơ sở dữ liệu quốc gia về pháp luật: tra Bộ luật Lao động và các văn bản liên quan đang có hiệu lực (bài 5.2).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — các chủ đề quản trị, tuyển dụng, phản hồi và lãnh đạo.</li>
<li><a href="https://www.youtube.com/@SHRMOfficial" target="_blank" rel="noopener">SHRM</a> — kênh chính thức của SHRM về thực hành nhân sự và nơi làm việc.</li>
<li><a href="https://www.youtube.com/@CipdUk" target="_blank" rel="noopener">CIPD</a> — kênh chính thức của CIPD về quản lý con người và công việc.</li>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u</a> — video ngắn giải thích kiến thức kinh doanh, có hoạch định nhân lực, nghỉ việc và động lực.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — tính chỉ số nhân sự, bảng chấm phỏng vấn có trọng số; hàm SLOPE và INTERCEPT khớp đường chính sách lương.</li>
<li><a href="https://support.microsoft.com/en-us/excel" target="_blank" rel="noopener">Microsoft Excel — Help &amp; learning</a> — hướng dẫn chính thức cho các hàm tương tự và PivotTable (xem nghỉ việc theo nhóm).</li>
<li><a href="https://trello.com/" target="_blank" rel="noopener">Trello</a> — bảng đơn giản để vận hành quy trình tuyển dụng (nộp hồ sơ → sàng lọc → phỏng vấn → mời làm việc → nhận việc).</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — HRM chiến lược, phân tích công việc, tuyển mộ và tuyển chọn, theo đúng Phần 1–2 ở đây.</li>
<li><strong>Luyện tập</strong> — làm lại Bài tập 1–3 trên bảng tính với số liệu của riêng bạn; viết một bản mô tả công việc và một bộ câu hỏi phỏng vấn có cấu trúc.</li>
<li><strong>Đào sâu</strong> — đọc các chương về hiệu suất và đãi ngộ trong một giáo trình đầy đủ, rồi so một cấu trúc lương và một ma trận tăng lương với Phần 4.</li>
<li><strong>Vận dụng</strong> — dựng một bảng điều khiển nhân sự nhỏ (số lao động, tỷ lệ nghỉ việc, thời gian lấp vị trí, chi phí tuyển một người) cho một nhóm thật hoặc giả định và viết ba khuyến nghị.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'HRM202c',
    slug: 'hrm202c-human-resource-management',
    title: 'Human Resource Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/HRM202c.webp',
    shortDescription: 'How firms plan, hire, develop, appraise and reward people: strategic HRM, job analysis, recruitment and selection, training ROI, performance management, pay structures, benefits, employee relations and HR analytics. Bilingual, with exercises.|||Hoạch định, tuyển dụng, đào tạo, đánh giá và đãi ngộ nhân sự: HRM chiến lược, phân tích công việc, tuyển chọn, ROI đào tạo, quản lý hiệu suất, thang lương, phúc lợi, quan hệ lao động, HR analytics. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>HRM202c — Human Resource Management (Quản trị nguồn nhân lực)</strong> (khối Quản trị Kinh doanh, kỳ 3) trả lời câu hỏi: <strong>làm sao có đúng người, đúng kỹ năng, làm đúng việc, với đãi ngộ công bằng</strong>. Từ <strong>HRM chiến lược, phân tích công việc và hoạch định nhân lực</strong> (dự báo cung – cầu, Markov) → <strong>tuyển mộ và tuyển chọn</strong> (độ tin cậy, độ hiệu lực, phỏng vấn có cấu trúc) → <strong>đào tạo và quản lý hiệu suất</strong> (ADDIE, Kirkpatrick, ROI, lỗi đánh giá, 360°, KPI/OKR) → <strong>lương thưởng và phúc lợi</strong> (định giá công việc, thang bậc lương, compa-ratio, trả theo kết quả) → <strong>quan hệ lao động, an toàn, nguyên tắc luật lao động Việt Nam và phân tích dữ liệu nhân sự</strong>. Bám cấu trúc giáo trình của Dessler, Armstrong và Noe và cộng sự; học sau MGT103 và OBE102c nên động lực, lãnh đạo chỉ được nhắc để liên hệ. Song ngữ Anh–Việt, tình huống và số liệu là giả định, mọi phép tính đã kiểm bằng máy, có bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích vai trò của HR, HRM chiến lược, mô hình AMO và quan điểm dựa trên nguồn lực\nThực hiện phân tích công việc; viết bản mô tả công việc và bản tiêu chuẩn công việc\nDự báo cầu – cung nhân lực bằng phân tích tỷ số và Markov, đề xuất cách xử lý thiếu hụt, dư thừa\nThiết kế quy trình tuyển mộ bằng tháp năng suất; đánh giá công cụ tuyển chọn theo độ tin cậy, độ hiệu lực\nXây dựng phỏng vấn có cấu trúc và ra quyết định tuyển bằng tiêu chí có trọng số và rào cản\nThiết kế đào tạo theo ADDIE, đánh giá theo Kirkpatrick và tính ROI có nhóm đối chứng\nChọn phương pháp đánh giá hiệu suất, nhận diện lỗi đánh giá, phân biệt KPI và OKR\nDựng khung lương, tính compa-ratio, áp dụng ma trận tăng lương và các chỉ số HR analytics',
    requirements: 'Nên học trước MGT103 (quản trị học) và OBE102c (hành vi tổ chức) — động lực và lãnh đạo chỉ được nhắc lại để liên hệ\nPhần trăm, trung bình có trọng số và đọc bảng số liệu\nBảng tính (Excel hoặc Google Sheets) để làm bài tập',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'HRM là gì, ai làm công việc nhân sự, vai trò của HR, HRM cứng và mềm.', lessons: [intro] },
    { title: 'Part 1 — Strategic HRM, job analysis & workforce planning|||Phần 1 — HRM chiến lược, phân tích công việc & hoạch định nhân lực', description: 'Phù hợp chiến lược, HPWS, AMO, bản mô tả và tiêu chuẩn công việc, dự báo cung – cầu, Markov.', lessons: [c1, c2, c3, c3q] },
    { title: 'Part 2 — Recruitment & selection|||Phần 2 — Tuyển mộ & tuyển chọn', description: 'Nguồn tuyển, tháp năng suất, độ tin cậy, độ hiệu lực, phỏng vấn có cấu trúc, tác động bất lợi.', lessons: [c4, c5, c5b, c5e, c5q] },
    { title: 'Part 3 — Training, development & performance management|||Phần 3 — Đào tạo, phát triển & quản lý hiệu suất', description: 'ADDIE, Kirkpatrick, ROI, phương pháp đánh giá, lỗi đánh giá, 360°, KPI/OKR.', lessons: [c6, c7, c7q] },
    { title: 'Part 4 — Compensation & benefits|||Phần 4 — Lương thưởng & phúc lợi', description: 'Định giá công việc, đường chính sách lương, khung lương, compa-ratio, khuyến khích, phúc lợi.', lessons: [c8, c9, c9e, c9q] },
    { title: 'Part 5 — Employee relations, safety & HR analytics|||Phần 5 — Quan hệ lao động, an toàn & phân tích nhân sự', description: 'Kỷ luật, khiếu nại, an toàn vệ sinh lao động, nguyên tắc luật lao động Việt Nam, chỉ số nhân sự, HRM số.', lessons: [c10, c10b, c11, c11e, c11q] },
  ],
};
