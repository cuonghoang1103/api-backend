/**
 * LDS301 — Leadership (Lãnh đạo). Khối Quản trị Kinh doanh, kỳ 4.
 * Bám cấu trúc giáo trình lãnh đạo chuẩn quốc tế: Northouse — Leadership: Theory and Practice (SAGE);
 * Yukl & Gardner — Leadership in Organizations (Pearson); OpenStax Organizational Behavior (chương Leadership):
 * khái niệm, lãnh đạo và quản lý, quyền lực & ảnh hưởng, phẩm chất, kỹ năng, hành vi, ngẫu nhiên (Fiedler,
 * đường dẫn–mục tiêu), tình huống (SLII), LMX, đội nhóm, chuyển đổi/giao dịch, đích thực, phục vụ, đạo đức &
 * mặt tối, thích ứng & dẫn dắt thay đổi, giới–đa dạng–văn hoá, phát triển năng lực lãnh đạo.
 * Song ngữ + mức bằng chứng thực nghiệm của từng lý thuyết + bài tập (số đã kiểm bằng máy; tình huống là
 * GIẢ ĐỊNH, hư cấu) + quiz. Không chép câu hỏi của bảng hỏi có bản quyền (MLQ, LPC, bảng tự đánh giá).
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('lds301-0-1-overview', 'Course overview: what leadership is and how we study it|||Tổng quan: lãnh đạo là gì và nghiên cứu nó thế nào',
  'Định nghĩa lãnh đạo như một quá trình ảnh hưởng, lãnh đạo được bổ nhiệm và lãnh đạo nổi lên, lãnh đạo và quản lý theo Kotter, bản đồ các cách tiếp cận lý thuyết, cách đọc mức bằng chứng thực nghiệm, lộ trình môn.',
  [[
    `<span class="eyebrow">LDS301 · Lesson 0.1 · Overview</span>
<h2>Leadership</h2>
<p class="lead">Almost every organisational success or failure is eventually explained with the word "leadership". This course replaces that loose word with precise ideas: what leaders actually do, where their influence comes from, which theories are backed by strong evidence — and which are popular mainly because they are easy to teach.</p>
<h3>A working definition</h3>
<p>Following Northouse, we treat leadership as <strong>a process in which one person influences a group of people to achieve a common goal</strong>. Four elements follow from this definition:</p>
<ul>
<li><strong>Process</strong> — leadership is not a fixed trait or a job title; it is an interaction between leader and followers that unfolds over time.</li>
<li><strong>Influence</strong> — without influence there is no leadership. Influence can rest on authority, expertise, relationships or persuasion (Part 1).</li>
<li><strong>Groups</strong> — leadership happens in teams, departments, communities and whole organisations.</li>
<li><strong>Common goals</strong> — leaders and followers work towards shared purposes; influence used only for the leader's private gain is closer to manipulation (Part 4).</li>
</ul>
<h3>Assigned and emergent leadership</h3>
<p><strong>Assigned leadership</strong> comes from a formal position — a team leader, a department head. <strong>Emergent leadership</strong> appears when group members come to see someone as the leader, whatever his or her title. The two often differ: a newly appointed manager may hold authority while an experienced colleague holds the group's trust.</p>
<h3>Leadership and management</h3>
<p>Kotter distinguishes the two by what they produce. Management produces <em>order and consistency</em>; leadership produces <em>change and movement</em>. Organisations need both.</p>
<table>
<tr><th>Management (order)</th><th>Leadership (change)</th></tr>
<tr><td>Planning and budgeting — set timetables, allocate resources</td><td>Establishing direction — create a vision and strategy</td></tr>
<tr><td>Organising and staffing — build structure, assign jobs, make rules</td><td>Aligning people — communicate the vision, build coalitions and commitment</td></tr>
<tr><td>Controlling and problem solving — monitor results, correct deviations</td><td>Motivating and inspiring — energise people, meet unmet needs, empower</td></tr>
</table>
<p>Too much management without leadership gives a stable but stagnant organisation; too much leadership without management gives exciting but chaotic change. In practice the same person usually has to do both.</p>
<h3>Map of the course</h3>
<table>
<tr><th>Part</th><th>Question</th><th>Main ideas</th></tr>
<tr><td>1</td><td>Where does influence come from, and who becomes a leader?</td><td>Power, influence tactics, traits, emotional intelligence, skills</td></tr>
<tr><td>2</td><td>What do leaders do, and when does it work?</td><td>Ohio State, Michigan, Leadership Grid, Fiedler, path–goal</td></tr>
<tr><td>3</td><td>How should leaders adapt to people and teams?</td><td>Situational leadership (SLII), LMX, followership, team leadership</td></tr>
<tr><td>4</td><td>What makes leadership inspiring — and what makes it harmful?</td><td>Transformational, transactional, authentic, servant, ethical and toxic leadership</td></tr>
<tr><td>5</td><td>How do leaders handle change, diversity and their own growth?</td><td>Adaptive leadership, Lewin, Kotter, gender and culture, 360-degree feedback, coaching</td></tr>
</table>
<h3>How to read the evidence</h3>
<p>Leadership theories differ greatly in how well they have been tested. Each lesson ends with an <strong>evidence check</strong> using three rough levels:</p>
<ul>
<li><strong>Strong</strong> — many studies and meta-analyses with broadly consistent results (even then, mostly correlational).</li>
<li><strong>Moderate / mixed</strong> — supported in part, but with inconsistent findings or serious measurement concerns.</li>
<li><strong>Limited</strong> — mainly conceptual or prescriptive, with few rigorous tests.</li>
</ul>
<div class="callout"><span class="badge">One idea to keep</span> A model that is easy to remember is not the same as a model that is true. Always ask: what exactly does this theory predict, and how was it tested?</div>`,
    `<span class="eyebrow">LDS301 · Bài 0.1 · Tổng quan</span>
<h2>Lãnh đạo</h2>
<p class="lead">Gần như mọi thành công hay thất bại của tổ chức cuối cùng đều được giải thích bằng hai chữ "lãnh đạo". Môn học này thay cụm từ mơ hồ ấy bằng những khái niệm chính xác: người lãnh đạo thực sự làm gì, ảnh hưởng của họ đến từ đâu, lý thuyết nào có bằng chứng vững — và lý thuyết nào phổ biến chủ yếu vì dễ giảng dạy.</p>
<h3>Một định nghĩa làm việc</h3>
<p>Theo Northouse, ta coi lãnh đạo là <strong>một quá trình trong đó một người ảnh hưởng tới một nhóm người để đạt được mục tiêu chung</strong>. Định nghĩa này gồm bốn yếu tố:</p>
<ul>
<li><strong>Quá trình</strong> — lãnh đạo không phải một phẩm chất cố định hay một chức danh; đó là sự tương tác giữa người lãnh đạo và người đi theo diễn ra theo thời gian.</li>
<li><strong>Ảnh hưởng</strong> — không có ảnh hưởng thì không có lãnh đạo. Ảnh hưởng có thể dựa trên quyền hạn, chuyên môn, quan hệ hoặc thuyết phục (Phần 1).</li>
<li><strong>Nhóm</strong> — lãnh đạo diễn ra trong đội, phòng ban, cộng đồng và cả tổ chức.</li>
<li><strong>Mục tiêu chung</strong> — người lãnh đạo và người đi theo cùng hướng tới mục đích chung; ảnh hưởng chỉ để phục vụ lợi ích riêng của người lãnh đạo thì gần với thao túng hơn (Phần 4).</li>
</ul>
<h3>Lãnh đạo được bổ nhiệm và lãnh đạo nổi lên</h3>
<p><strong>Lãnh đạo được bổ nhiệm</strong> đến từ vị trí chính thức — trưởng nhóm, trưởng phòng. <strong>Lãnh đạo nổi lên</strong> xuất hiện khi các thành viên dần coi một người là người dẫn dắt, bất kể chức danh của người đó. Hai kiểu này thường không trùng nhau: một quản lý mới được bổ nhiệm có thể nắm quyền hạn trong khi một đồng nghiệp lâu năm lại nắm được lòng tin của cả nhóm.</p>
<h3>Lãnh đạo và quản lý</h3>
<p>Kotter phân biệt hai khái niệm theo cái mà chúng tạo ra. Quản lý tạo ra <em>trật tự và sự nhất quán</em>; lãnh đạo tạo ra <em>thay đổi và chuyển động</em>. Tổ chức cần cả hai.</p>
<table>
<tr><th>Quản lý (trật tự)</th><th>Lãnh đạo (thay đổi)</th></tr>
<tr><td>Lập kế hoạch và ngân sách — đặt tiến độ, phân bổ nguồn lực</td><td>Xác lập phương hướng — tạo tầm nhìn và chiến lược</td></tr>
<tr><td>Tổ chức và bố trí nhân sự — dựng cơ cấu, giao việc, đặt quy định</td><td>Gắn kết con người — truyền đạt tầm nhìn, xây liên minh và cam kết</td></tr>
<tr><td>Kiểm soát và giải quyết vấn đề — theo dõi kết quả, điều chỉnh sai lệch</td><td>Tạo động lực và truyền cảm hứng — khơi dậy năng lượng, đáp ứng nhu cầu chưa được đáp ứng, trao quyền</td></tr>
</table>
<p>Quản lý nhiều mà thiếu lãnh đạo cho ra một tổ chức ổn định nhưng trì trệ; lãnh đạo nhiều mà thiếu quản lý cho ra thay đổi hào hứng nhưng hỗn loạn. Trên thực tế, cùng một người thường phải làm cả hai.</p>
<h3>Bản đồ môn học</h3>
<table>
<tr><th>Phần</th><th>Câu hỏi</th><th>Ý chính</th></tr>
<tr><td>1</td><td>Ảnh hưởng đến từ đâu, và ai trở thành người lãnh đạo?</td><td>Quyền lực, chiến thuật ảnh hưởng, phẩm chất, trí tuệ cảm xúc, kỹ năng</td></tr>
<tr><td>2</td><td>Người lãnh đạo làm gì, và khi nào thì hiệu quả?</td><td>Ohio State, Michigan, lưới lãnh đạo, Fiedler, đường dẫn–mục tiêu</td></tr>
<tr><td>3</td><td>Người lãnh đạo nên thích ứng với con người và đội nhóm thế nào?</td><td>Lãnh đạo tình huống (SLII), LMX, vai trò người đi theo, lãnh đạo đội nhóm</td></tr>
<tr><td>4</td><td>Điều gì làm lãnh đạo truyền cảm hứng — và điều gì làm nó gây hại?</td><td>Lãnh đạo chuyển đổi, giao dịch, đích thực, phục vụ, đạo đức và lãnh đạo độc hại</td></tr>
<tr><td>5</td><td>Người lãnh đạo xử lý thay đổi, đa dạng và sự phát triển của chính mình ra sao?</td><td>Lãnh đạo thích ứng, Lewin, Kotter, giới và văn hoá, phản hồi 360 độ, coaching</td></tr>
</table>
<h3>Cách đọc bằng chứng</h3>
<p>Các lý thuyết lãnh đạo khác nhau rất nhiều về mức độ đã được kiểm chứng. Mỗi bài kết thúc bằng một mục <strong>kiểm tra bằng chứng</strong> theo ba mức tương đối:</p>
<ul>
<li><strong>Mạnh</strong> — nhiều nghiên cứu và phân tích tổng hợp (meta-analysis) cho kết quả nhìn chung nhất quán (dù vậy vẫn chủ yếu là tương quan).</li>
<li><strong>Trung bình / lẫn lộn</strong> — được ủng hộ một phần, nhưng kết quả không nhất quán hoặc có vấn đề nghiêm trọng về đo lường.</li>
<li><strong>Hạn chế</strong> — chủ yếu mang tính khái niệm hoặc khuyến nghị, ít kiểm định chặt chẽ.</li>
</ul>
<div class="callout"><span class="badge">Một ý cần giữ</span> Một mô hình dễ nhớ không có nghĩa là một mô hình đúng. Luôn hỏi: lý thuyết này dự báo chính xác điều gì, và nó đã được kiểm định ra sao?</div>`,
  ]]);

const c1 = doc('lds301-1-1-power-influence', '1.1 — Power and influence|||1.1 — Quyền lực và ảnh hưởng',
  'Sáu nguồn quyền lực của French & Raven (thêm quyền lực thông tin của Raven), quyền lực vị trí và quyền lực cá nhân, 11 chiến thuật ảnh hưởng chủ động của Yukl, ba kết quả cam kết – tuân thủ – kháng cự, nguyên tắc chọn chiến thuật và mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 1 · Lesson 1.1</span>
<h2>Power and influence</h2>
<p class="lead">Power is the <em>capacity</em> to influence other people; influence is the <em>act</em> of changing what they believe or do. Leaders differ less in how much power they hold than in how wisely they turn it into influence.</p>
<h3>Bases of power: French &amp; Raven</h3>
<p>French and Raven (1959) described five bases of social power; Raven later added a sixth, information power.</p>
<table>
<tr><th>Base</th><th>Rests on</th><th>Workplace example</th><th>Typical reaction</th></tr>
<tr><td>Legitimate</td><td>A formal position that others accept as giving the right to ask</td><td>A department head sets the team's quarterly targets</td><td>Compliance</td></tr>
<tr><td>Reward</td><td>Control over things people value</td><td>Recommending bonuses or choice assignments</td><td>Compliance</td></tr>
<tr><td>Coercive</td><td>Ability to punish or withhold</td><td>Formal warnings, removal of privileges</td><td>Compliance or resistance</td></tr>
<tr><td>Expert</td><td>Knowledge and skill others need</td><td>The analyst everyone asks about the pricing model</td><td>Commitment</td></tr>
<tr><td>Referent</td><td>Being liked, admired and identified with</td><td>A respected senior colleague whose opinion people seek</td><td>Commitment</td></tr>
<tr><td>Information</td><td>Control of, or access to, information others need</td><td>The coordinator who knows the status of every project</td><td>Varies</td></tr>
</table>
<p>A caution on the last row: Raven's original informational power rests on the persuasive content of the information itself — the target changes because the explanation makes sense, whoever delivers it, so the change tends to be internalised. Controlling access to information that others need, as in the example, is how Yukl treats it: a separate, position-based source (see below).</p>
<p>A useful grouping (Yukl) separates <strong>position power</strong> — legitimate, reward, coercive and control of information that come with the job — from <strong>personal power</strong> — expert and referent power that belong to the person and travel with them to any role. Research generally links personal power more closely to follower satisfaction and commitment; coercive power used heavily is linked to resentment.</p>
<h3>Proactive influence tactics (Yukl)</h3>
<table>
<tr><th>Tactic</th><th>What the agent does</th></tr>
<tr><td>Rational persuasion</td><td>Uses logical arguments and factual evidence</td></tr>
<tr><td>Apprising</td><td>Explains how the request will benefit the target personally</td></tr>
<tr><td>Inspirational appeals</td><td>Appeals to values, ideals and emotions</td></tr>
<tr><td>Consultation</td><td>Invites the target to help plan or improve the proposal</td></tr>
<tr><td>Exchange</td><td>Offers something in return, now or later</td></tr>
<tr><td>Collaboration</td><td>Offers resources or help to make the request easier to carry out</td></tr>
<tr><td>Personal appeals</td><td>Asks for a favour based on friendship or loyalty</td></tr>
<tr><td>Ingratiation</td><td>Uses praise or flattery before or during the request</td></tr>
<tr><td>Legitimating tactics</td><td>Stresses authority, rules, policies or precedent</td></tr>
<tr><td>Pressure</td><td>Uses demands, threats or persistent checking</td></tr>
<tr><td>Coalition tactics</td><td>Enlists other people to add weight to the request</td></tr>
</table>
<h3>Three outcomes of an influence attempt</h3>
<ul>
<li><strong>Commitment</strong> — the target agrees inwardly and puts in real effort and initiative.</li>
<li><strong>Compliance</strong> — the target does what is asked, but with minimal effort and no enthusiasm.</li>
<li><strong>Resistance</strong> — the target argues, delays, makes excuses or quietly sabotages.</li>
</ul>
<p>Rational persuasion, consultation, collaboration and inspirational appeals are the tactics most often associated with commitment; pressure and legitimating tactics used alone usually produce compliance at best and often resistance. Combining compatible tactics — for example rational persuasion with consultation or collaboration — tends to work better than a single tactic, whereas stacking "hard" tactics such as pressure plus legitimating does not; the right mix also depends on direction — downward, lateral or upward.</p>
<div class="callout"><span class="badge">Evidence check — moderate</span> The power-base and influence-tactic frameworks come from surveys, diary and critical-incident studies, largely cross-sectional. Findings on which tactics produce commitment are fairly consistent, but the effect of a tactic always depends on the relationship, the request and the culture.</div>`,
    `<span class="eyebrow">LDS301 · Phần 1 · Bài 1.1</span>
<h2>Quyền lực và ảnh hưởng</h2>
<p class="lead">Quyền lực là <em>khả năng</em> ảnh hưởng tới người khác; ảnh hưởng là <em>hành động</em> làm thay đổi điều họ tin hoặc làm. Người lãnh đạo khác nhau ít ở chỗ nắm bao nhiêu quyền lực mà nhiều ở chỗ biến quyền lực thành ảnh hưởng một cách khôn ngoan đến đâu.</p>
<h3>Các nguồn quyền lực: French &amp; Raven</h3>
<p>French và Raven (1959) mô tả năm nguồn quyền lực xã hội; về sau Raven bổ sung nguồn thứ sáu là quyền lực thông tin.</p>
<table>
<tr><th>Nguồn</th><th>Dựa trên</th><th>Ví dụ ở nơi làm việc</th><th>Phản ứng thường gặp</th></tr>
<tr><td>Hợp pháp</td><td>Vị trí chính thức được người khác chấp nhận là có quyền yêu cầu</td><td>Trưởng phòng đặt chỉ tiêu quý cho cả đội</td><td>Tuân thủ</td></tr>
<tr><td>Khen thưởng</td><td>Kiểm soát những thứ người khác coi trọng</td><td>Đề xuất thưởng hoặc giao việc hấp dẫn</td><td>Tuân thủ</td></tr>
<tr><td>Cưỡng chế</td><td>Khả năng trừng phạt hoặc tước bỏ</td><td>Cảnh cáo chính thức, cắt quyền lợi</td><td>Tuân thủ hoặc kháng cự</td></tr>
<tr><td>Chuyên môn</td><td>Kiến thức và kỹ năng người khác cần</td><td>Chuyên viên phân tích mà ai cũng hỏi về mô hình định giá</td><td>Cam kết</td></tr>
<tr><td>Tham chiếu (uy tín cá nhân)</td><td>Được quý mến, ngưỡng mộ và muốn noi theo</td><td>Một đồng nghiệp lâu năm được kính trọng, ai cũng muốn hỏi ý kiến</td><td>Cam kết</td></tr>
<tr><td>Thông tin</td><td>Kiểm soát hoặc tiếp cận thông tin người khác cần</td><td>Điều phối viên nắm tình trạng của mọi dự án</td><td>Tuỳ trường hợp</td></tr>
</table>
<p>Lưu ý về dòng cuối: quyền lực thông tin gốc của Raven dựa trên chính nội dung thuyết phục của thông tin — người nghe thay đổi vì lời giải thích hợp lý, bất kể ai là người nói, nên thay đổi thường được nội tâm hoá. Kiểm soát việc tiếp cận thông tin người khác cần, như ví dụ trong bảng, là cách Yukl nhìn nguồn này: một nguồn riêng thuộc quyền lực vị trí (xem dưới đây).</p>
<p>Một cách nhóm hữu ích (Yukl) tách <strong>quyền lực vị trí</strong> — hợp pháp, khen thưởng, cưỡng chế và kiểm soát thông tin đi kèm công việc — khỏi <strong>quyền lực cá nhân</strong> — chuyên môn và uy tín thuộc về con người và theo họ sang bất kỳ vai trò nào. Nghiên cứu nhìn chung gắn quyền lực cá nhân chặt hơn với sự hài lòng và cam kết của người đi theo; lạm dụng quyền lực cưỡng chế gắn với sự bất mãn.</p>
<h3>Các chiến thuật ảnh hưởng chủ động (Yukl)</h3>
<table>
<tr><th>Chiến thuật</th><th>Người tác động làm gì</th></tr>
<tr><td>Thuyết phục lý trí</td><td>Dùng lập luận logic và bằng chứng thực tế</td></tr>
<tr><td>Cho biết lợi ích (apprising)</td><td>Giải thích yêu cầu sẽ mang lại lợi ích gì cho chính người được đề nghị</td></tr>
<tr><td>Kêu gọi truyền cảm hứng</td><td>Khơi gợi giá trị, lý tưởng và cảm xúc</td></tr>
<tr><td>Tham vấn</td><td>Mời người được đề nghị cùng lập kế hoạch hoặc cải thiện đề xuất</td></tr>
<tr><td>Trao đổi</td><td>Đề nghị đáp lại một điều gì đó, ngay hoặc về sau</td></tr>
<tr><td>Hợp tác</td><td>Hỗ trợ nguồn lực hoặc giúp đỡ để yêu cầu dễ thực hiện hơn</td></tr>
<tr><td>Kêu gọi cá nhân</td><td>Nhờ vả dựa trên tình bạn hoặc lòng trung thành</td></tr>
<tr><td>Lấy lòng</td><td>Khen ngợi hoặc tâng bốc trước hay trong khi đề nghị</td></tr>
<tr><td>Hợp thức hoá</td><td>Nhấn mạnh thẩm quyền, quy định, chính sách hoặc tiền lệ</td></tr>
<tr><td>Gây sức ép</td><td>Đòi hỏi, đe doạ hoặc liên tục kiểm tra</td></tr>
<tr><td>Liên minh</td><td>Tranh thủ người khác để tăng sức nặng cho yêu cầu</td></tr>
</table>
<h3>Ba kết quả của một nỗ lực ảnh hưởng</h3>
<ul>
<li><strong>Cam kết</strong> — người được đề nghị đồng ý từ bên trong, bỏ công sức và sáng kiến thật sự.</li>
<li><strong>Tuân thủ</strong> — làm theo yêu cầu nhưng với nỗ lực tối thiểu và không nhiệt tình.</li>
<li><strong>Kháng cự</strong> — tranh cãi, trì hoãn, viện cớ hoặc ngấm ngầm phá hỏng.</li>
</ul>
<p>Thuyết phục lý trí, tham vấn, hợp tác và kêu gọi truyền cảm hứng là những chiến thuật hay gắn với cam kết nhất; gây sức ép và hợp thức hoá nếu dùng đơn độc thường chỉ tạo ra tuân thủ, và hay dẫn tới kháng cự. Kết hợp các chiến thuật tương thích — ví dụ thuyết phục lý trí cùng tham vấn hoặc hợp tác — thường hiệu quả hơn dùng một chiến thuật, còn chồng các chiến thuật "cứng" như gây sức ép cộng hợp thức hoá thì không; cách phối hợp phù hợp còn tuỳ theo chiều ảnh hưởng — xuống dưới, ngang hàng hay lên trên.</p>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình</span> Khung nguồn quyền lực và chiến thuật ảnh hưởng đến từ khảo sát, nhật ký và nghiên cứu sự kiện điển hình, phần lớn là cắt ngang. Kết quả về chiến thuật nào tạo ra cam kết khá nhất quán, nhưng tác dụng của một chiến thuật luôn tuỳ thuộc vào mối quan hệ, nội dung yêu cầu và văn hoá.</div>`,
  ]]);

const c2 = doc('lds301-1-2-traits-ei', '1.2 — The trait approach and emotional intelligence|||1.2 — Cách tiếp cận phẩm chất và trí tuệ cảm xúc',
  'Từ thuyết "vĩ nhân" tới các tổng quan của Stogdill, năm phẩm chất chính theo Northouse, mô hình Big Five và lãnh đạo, trí tuệ cảm xúc (mô hình năng lực Mayer–Salovey và mô hình hỗn hợp Goleman), tranh luận về bằng chứng, điểm mạnh và hạn chế.',
  [[
    `<span class="eyebrow">LDS301 · Part 1 · Lesson 1.2</span>
<h2>The trait approach and emotional intelligence</h2>
<p class="lead">The oldest question in leadership research is simple: are some people simply born to lead? A century of studies gives a more nuanced answer — some traits matter, but they matter more for <em>who is seen as a leader</em> than for <em>who leads well</em>.</p>
<h3>From "great man" theories to Stogdill</h3>
<p>Early twentieth-century "great man" theories looked for the innate qualities of famous political and military figures. Stogdill's first review (1948) of more than a hundred trait studies found some recurring traits — intelligence, alertness, insight, responsibility, initiative, persistence, self-confidence, sociability — but concluded that <strong>no set of traits reliably separates leaders from non-leaders across situations</strong>. His second review (1974) was more positive, suggesting that both traits and situations matter. Later work (for example Lord and colleagues in the 1980s) showed that traits strongly shape <em>perceptions</em> of leadership: people carry implicit images of what a leader looks like.</p>
<h3>Five major traits (Northouse's synthesis)</h3>
<table>
<tr><th>Trait</th><th>Meaning</th><th>Caution</th></tr>
<tr><td>Intelligence</td><td>Verbal, perceptual and reasoning ability</td><td>A leader far above the group may struggle to communicate</td></tr>
<tr><td>Self-confidence</td><td>Certainty about one's competence and skills</td><td>Can slide into arrogance</td></tr>
<tr><td>Determination</td><td>Desire to get the job done: initiative, persistence, drive</td><td>Can become stubbornness</td></tr>
<tr><td>Integrity</td><td>Honesty and trustworthiness; taking responsibility</td><td>Hard to observe before a crisis</td></tr>
<tr><td>Sociability</td><td>Seeking pleasant social relationships; tact and diplomacy</td><td>Not the same as being liked by everyone</td></tr>
</table>
<h3>The Big Five and leadership</h3>
<p>A widely cited meta-analysis by Judge, Bono, Ilies and Gerhardt (2002) related the five-factor model of personality to leadership. <strong>Extraversion</strong> was the most consistent correlate, followed by conscientiousness and openness to experience; neuroticism was negatively related and agreeableness only weakly. Together the five factors showed a multiple correlation of about 0.48 with leadership — and the links were stronger for <strong>leader emergence</strong> than for <strong>leader effectiveness</strong>.</p>
<h3>Emotional intelligence (EI)</h3>
<ul>
<li><strong>Ability model</strong> (Mayer &amp; Salovey): EI is a set of abilities — perceiving emotions, using emotions to facilitate thinking, understanding emotions and managing emotions — measured with performance tests.</li>
<li><strong>Mixed model</strong> (Goleman): EI combines self-awareness, self-regulation, motivation, empathy and social skills — measured mostly by self-report or 360-degree ratings.</li>
</ul>
<p><strong>The debate.</strong> Goleman's popular writing claimed that EI matters more than IQ for leaders. Critics (for example Antonakis) answer that many EI measures overlap heavily with personality and general intelligence, and that EI adds only a small amount of prediction beyond them. Relationships between EI and leadership look much stronger when the <em>same person</em> rates both, and weaker when leadership is rated by others. The fair conclusion: managing emotions is clearly part of leading people, but the specific claim that EI is the master key to leadership is not supported by the evidence.</p>
<h3>Strengths and limits of the trait approach</h3>
<ul>
<li><strong>Strengths:</strong> intuitive, backed by a long research record, useful for selection and self-awareness.</li>
<li><strong>Limits:</strong> the lists of traits are long and inconsistent; traits say little about what to <em>do</em>; the role of the situation is underplayed; and traits predict emergence better than performance.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — moderate</span> Personality traits reliably predict who emerges as a leader and modestly predict effectiveness. Emotional-intelligence findings depend heavily on how EI is measured; treat strong popular claims with caution.</div>`,
    `<span class="eyebrow">LDS301 · Phần 1 · Bài 1.2</span>
<h2>Cách tiếp cận phẩm chất và trí tuệ cảm xúc</h2>
<p class="lead">Câu hỏi lâu đời nhất trong nghiên cứu lãnh đạo rất đơn giản: có phải một số người sinh ra để lãnh đạo? Một thế kỷ nghiên cứu cho câu trả lời tinh tế hơn — một số phẩm chất có ý nghĩa, nhưng chúng quyết định <em>ai được nhìn nhận là người lãnh đạo</em> nhiều hơn là <em>ai lãnh đạo giỏi</em>.</p>
<h3>Từ thuyết "vĩ nhân" tới Stogdill</h3>
<p>Các thuyết "vĩ nhân" đầu thế kỷ XX tìm những phẩm chất bẩm sinh của các nhân vật chính trị và quân sự nổi tiếng. Tổng quan đầu tiên của Stogdill (1948) trên hơn một trăm nghiên cứu về phẩm chất tìm thấy một số phẩm chất lặp lại — trí thông minh, sự nhanh nhạy, khả năng thấu suốt, tinh thần trách nhiệm, sự chủ động, sự bền bỉ, tự tin, hoà đồng — nhưng kết luận rằng <strong>không có tập phẩm chất nào phân biệt được một cách tin cậy người lãnh đạo với người không lãnh đạo trong mọi tình huống</strong>. Tổng quan thứ hai (1974) tích cực hơn, cho rằng cả phẩm chất lẫn tình huống đều quan trọng. Các nghiên cứu sau (ví dụ Lord và cộng sự thập niên 1980) cho thấy phẩm chất định hình mạnh <em>nhận thức</em> về lãnh đạo: mỗi người mang sẵn một hình mẫu ngầm về người lãnh đạo "trông như thế nào".</p>
<h3>Năm phẩm chất chính (tổng hợp của Northouse)</h3>
<table>
<tr><th>Phẩm chất</th><th>Ý nghĩa</th><th>Lưu ý</th></tr>
<tr><td>Trí thông minh</td><td>Năng lực ngôn ngữ, tri giác và suy luận</td><td>Người lãnh đạo vượt quá xa nhóm có thể khó giao tiếp</td></tr>
<tr><td>Tự tin</td><td>Chắc chắn về năng lực và kỹ năng của mình</td><td>Dễ trượt thành kiêu ngạo</td></tr>
<tr><td>Quyết tâm</td><td>Mong muốn hoàn thành công việc: chủ động, bền bỉ, có động lực</td><td>Có thể thành cố chấp</td></tr>
<tr><td>Chính trực</td><td>Trung thực, đáng tin cậy; dám nhận trách nhiệm</td><td>Khó quan sát trước khi có khủng hoảng</td></tr>
<tr><td>Hoà đồng</td><td>Hướng tới các mối quan hệ dễ chịu; tế nhị và khéo léo</td><td>Không đồng nghĩa với việc được tất cả mọi người yêu mến</td></tr>
</table>
<h3>Big Five và lãnh đạo</h3>
<p>Một phân tích tổng hợp được trích dẫn rộng rãi của Judge, Bono, Ilies và Gerhardt (2002) liên hệ mô hình năm yếu tố tính cách với lãnh đạo. <strong>Hướng ngoại</strong> là yếu tố tương quan nhất quán nhất, tiếp theo là tận tâm và cởi mở với trải nghiệm; bất ổn cảm xúc có tương quan âm và dễ chịu (agreeableness) chỉ tương quan yếu. Cả năm yếu tố cộng lại có hệ số tương quan bội khoảng 0,48 với lãnh đạo — và mối liên hệ mạnh hơn với việc <strong>nổi lên làm lãnh đạo</strong> so với <strong>hiệu quả lãnh đạo</strong>.</p>
<h3>Trí tuệ cảm xúc (EI)</h3>
<ul>
<li><strong>Mô hình năng lực</strong> (Mayer &amp; Salovey): EI là tập hợp năng lực — nhận biết cảm xúc, dùng cảm xúc hỗ trợ tư duy, hiểu cảm xúc và quản lý cảm xúc — đo bằng bài kiểm tra năng lực.</li>
<li><strong>Mô hình hỗn hợp</strong> (Goleman): EI gồm tự nhận thức, tự điều chỉnh, động lực, thấu cảm và kỹ năng xã hội — chủ yếu đo bằng tự đánh giá hoặc đánh giá 360 độ.</li>
</ul>
<p><strong>Tranh luận.</strong> Các sách phổ thông của Goleman cho rằng với người lãnh đạo, EI quan trọng hơn IQ. Những người phê bình (ví dụ Antonakis) đáp lại rằng nhiều thang đo EI trùng lặp nặng với tính cách và trí thông minh chung, và EI chỉ bổ sung rất ít khả năng dự báo ngoài hai yếu tố đó. Mối liên hệ giữa EI và lãnh đạo trông mạnh hơn nhiều khi <em>cùng một người</em> tự chấm cả hai, và yếu hơn khi lãnh đạo do người khác đánh giá. Kết luận công bằng: quản lý cảm xúc rõ ràng là một phần của việc lãnh đạo con người, nhưng nhận định rằng EI là chìa khoá vạn năng của lãnh đạo không được bằng chứng ủng hộ.</p>
<h3>Điểm mạnh và hạn chế của cách tiếp cận phẩm chất</h3>
<ul>
<li><strong>Điểm mạnh:</strong> trực quan, có lịch sử nghiên cứu dài, hữu ích cho tuyển chọn và tự nhận thức.</li>
<li><strong>Hạn chế:</strong> danh sách phẩm chất dài và không thống nhất; phẩm chất nói rất ít về việc cần <em>làm</em> gì; vai trò của tình huống bị xem nhẹ; và phẩm chất dự báo việc nổi lên làm lãnh đạo tốt hơn là dự báo kết quả.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình</span> Tính cách dự báo tin cậy việc ai nổi lên làm lãnh đạo và dự báo ở mức vừa phải hiệu quả lãnh đạo. Kết quả về trí tuệ cảm xúc phụ thuộc nhiều vào cách đo EI; hãy thận trọng với những khẳng định mạnh trên sách báo phổ thông.</div>`,
  ]]);

const c3 = doc('lds301-1-3-skills', '1.3 — The skills approach: Katz and Mumford|||1.3 — Cách tiếp cận kỹ năng: Katz và Mumford',
  'Ba kỹ năng quản trị của Katz (kỹ thuật, con người, tư duy) và tầm quan trọng theo cấp quản lý; mô hình kỹ năng của Mumford và cộng sự (năng lực, thuộc tính cá nhân, kết quả, kinh nghiệm nghề nghiệp, ảnh hưởng môi trường); điểm mạnh, hạn chế và mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 1 · Lesson 1.3</span>
<h2>The skills approach: Katz and Mumford</h2>
<p class="lead">Traits are largely what you are; skills are what you can <em>learn</em> to do. The skills approach shifts attention from the leader's personality to the capabilities that make effective leadership possible — and that can be developed.</p>
<h3>Katz's three skills (1955)</h3>
<table>
<tr><th>Skill</th><th>Meaning</th><th>Example</th></tr>
<tr><td>Technical</td><td>Knowledge and proficiency in a specific type of work or activity</td><td>Reading a sales dashboard, using the accounting system</td></tr>
<tr><td>Human</td><td>Working with people: communication, trust, cooperation</td><td>Resolving a conflict between two team members</td></tr>
<tr><td>Conceptual</td><td>Working with ideas: seeing the organisation as a whole, strategy</td><td>Understanding how a pricing change affects sales, logistics and cash</td></tr>
</table>
<p>Katz argued that the relative importance of the three skills changes with level. Supervisors need a great deal of <strong>technical</strong> skill; top managers need more <strong>conceptual</strong> skill; <strong>human</strong> skill is important at every level. A common failure is to promote the best technician into a management job without developing the other two skills.</p>
<pre><code class="language-text">Level of management     Technical   Human   Conceptual
Top                     low         high    high
Middle                  medium      high    medium
Supervisory             high        high    low
(relative emphasis, following Katz's argument)</code></pre>
<h3>The skills model of Mumford and colleagues (2000)</h3>
<p>A research team led by Mumford, working with large samples of military officers, proposed a capability model with five components:</p>
<ol>
<li><strong>Competencies</strong> — the heart of the model: <em>problem-solving skills</em> (defining novel, ill-defined problems and generating solutions), <em>social judgment skills</em> (perspective taking, social perceptiveness, behavioural flexibility, social performance) and <em>knowledge</em>.</li>
<li><strong>Individual attributes</strong> — general cognitive ability, crystallised cognitive ability (learned over time), motivation and personality.</li>
<li><strong>Leadership outcomes</strong> — effective problem solving and performance.</li>
<li><strong>Career experiences</strong> — challenging assignments, mentoring and training that build competencies over years.</li>
<li><strong>Environmental influences</strong> — factors outside the leader's control, such as technology, resources and the skills of subordinates.</li>
</ol>
<p>The model's message is that leadership capability grows over a career: attributes are the starting point, experience turns them into competencies, and competencies produce results within a given environment.</p>
<h3>Strengths and limits</h3>
<ul>
<li><strong>Strengths:</strong> makes leadership learnable and available to everyone; gives a clear structure for training and development programmes; fits most managerial roles.</li>
<li><strong>Limits:</strong> the model's breadth (it includes personality and cognitive ability) makes it partly a trait model again; it is weak at predicting <em>how</em> skills lead to performance; and it was developed mainly on military samples.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — moderate</span> Katz's framework is a conceptual classic with broad practical acceptance. Mumford's model rests on large empirical studies, but mostly in one (military) setting; its generalisation to other organisations has been tested less.</div>`,
    `<span class="eyebrow">LDS301 · Phần 1 · Bài 1.3</span>
<h2>Cách tiếp cận kỹ năng: Katz và Mumford</h2>
<p class="lead">Phẩm chất phần lớn là bạn là ai; kỹ năng là điều bạn có thể <em>học</em> để làm. Cách tiếp cận kỹ năng chuyển sự chú ý từ tính cách người lãnh đạo sang những năng lực làm cho lãnh đạo hiệu quả trở nên khả thi — và có thể phát triển được.</p>
<h3>Ba kỹ năng của Katz (1955)</h3>
<table>
<tr><th>Kỹ năng</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
<tr><td>Kỹ thuật</td><td>Kiến thức và sự thành thạo trong một loại công việc hay hoạt động cụ thể</td><td>Đọc bảng điều khiển bán hàng, dùng hệ thống kế toán</td></tr>
<tr><td>Con người</td><td>Làm việc với con người: giao tiếp, tạo lòng tin, hợp tác</td><td>Giải quyết mâu thuẫn giữa hai thành viên trong đội</td></tr>
<tr><td>Tư duy (khái niệm)</td><td>Làm việc với ý tưởng: nhìn tổ chức như một tổng thể, chiến lược</td><td>Hiểu một thay đổi về giá tác động ra sao tới bán hàng, logistics và dòng tiền</td></tr>
</table>
<p>Katz lập luận rằng tầm quan trọng tương đối của ba kỹ năng thay đổi theo cấp bậc. Cấp giám sát cần nhiều kỹ năng <strong>kỹ thuật</strong>; quản lý cấp cao cần nhiều kỹ năng <strong>tư duy</strong> hơn; kỹ năng <strong>con người</strong> quan trọng ở mọi cấp. Một sai lầm phổ biến là đề bạt người giỏi chuyên môn nhất lên vị trí quản lý mà không phát triển hai kỹ năng còn lại.</p>
<pre><code class="language-text">Cấp quản lý          Kỹ thuật   Con người   Tư duy
Cấp cao              thấp       cao         cao
Cấp trung            vừa        cao         vừa
Cấp giám sát         cao        cao         thấp
(mức nhấn mạnh tương đối, theo lập luận của Katz)</code></pre>
<h3>Mô hình kỹ năng của Mumford và cộng sự (2000)</h3>
<p>Một nhóm nghiên cứu do Mumford dẫn đầu, làm việc với các mẫu lớn sĩ quan quân đội, đề xuất mô hình năng lực gồm năm thành phần:</p>
<ol>
<li><strong>Năng lực</strong> — trọng tâm của mô hình: <em>kỹ năng giải quyết vấn đề</em> (xác định những vấn đề mới, chưa rõ ràng và tạo ra giải pháp), <em>kỹ năng phán đoán xã hội</em> (đặt mình vào góc nhìn người khác, nhạy bén xã hội, linh hoạt hành vi, thể hiện xã hội) và <em>kiến thức</em>.</li>
<li><strong>Thuộc tính cá nhân</strong> — năng lực nhận thức chung, năng lực nhận thức tinh thể (tích luỹ qua thời gian), động lực và tính cách.</li>
<li><strong>Kết quả lãnh đạo</strong> — giải quyết vấn đề hiệu quả và thành tích.</li>
<li><strong>Kinh nghiệm nghề nghiệp</strong> — nhiệm vụ thử thách, được kèm cặp và đào tạo, giúp xây dựng năng lực qua nhiều năm.</li>
<li><strong>Ảnh hưởng của môi trường</strong> — các yếu tố ngoài tầm kiểm soát của người lãnh đạo như công nghệ, nguồn lực và kỹ năng của cấp dưới.</li>
</ol>
<p>Thông điệp của mô hình là năng lực lãnh đạo lớn dần qua sự nghiệp: thuộc tính cá nhân là điểm xuất phát, kinh nghiệm biến chúng thành năng lực, và năng lực tạo ra kết quả trong một môi trường cụ thể.</p>
<h3>Điểm mạnh và hạn chế</h3>
<ul>
<li><strong>Điểm mạnh:</strong> biến lãnh đạo thành thứ có thể học và ai cũng tiếp cận được; cho cấu trúc rõ ràng để thiết kế chương trình đào tạo, phát triển; phù hợp với hầu hết vai trò quản lý.</li>
<li><strong>Hạn chế:</strong> phạm vi rộng (bao gồm cả tính cách và năng lực nhận thức) khiến mô hình phần nào quay lại thành mô hình phẩm chất; yếu trong việc dự báo kỹ năng dẫn tới thành tích <em>như thế nào</em>; và được xây dựng chủ yếu trên mẫu quân đội.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình</span> Khung của Katz là một kinh điển mang tính khái niệm, được chấp nhận rộng rãi trong thực tiễn. Mô hình của Mumford dựa trên các nghiên cứu thực nghiệm lớn nhưng chủ yếu trong một bối cảnh (quân đội); khả năng khái quát sang các tổ chức khác được kiểm định ít hơn.</div>`,
  ]]);

const c3q = quiz('lds301-quiz-1', 'Quiz 1 — Power, traits and skills|||Quiz 1 — Quyền lực, phẩm chất và kỹ năng', [
  { id: 'q1', question: 'A team member follows an analyst’s advice because the analyst knows the pricing model better than anyone. Which base of power is at work?|||Một thành viên làm theo lời khuyên của chuyên viên phân tích vì người này hiểu mô hình định giá hơn ai hết. Đó là nguồn quyền lực nào?', options: ['Legitimate power|||Quyền lực hợp pháp', 'Reward power|||Quyền lực khen thưởng', 'Referent power|||Quyền lực tham chiếu (uy tín cá nhân)', 'Expert power|||Quyền lực chuyên môn'], correctIndex: 3, explanation: 'Expert power rests on knowledge and skill that others need; it is personal power and tends to produce commitment.|||Quyền lực chuyên môn dựa trên kiến thức và kỹ năng người khác cần; đây là quyền lực cá nhân và thường tạo ra cam kết.' },
  { id: 'q2', question: 'According to the Big Five meta-analysis by Judge and colleagues (2002), which trait was the most consistent correlate of leadership?|||Theo phân tích tổng hợp Big Five của Judge và cộng sự (2002), phẩm chất nào tương quan nhất quán nhất với lãnh đạo?', options: ['Extraversion|||Hướng ngoại', 'Agreeableness|||Dễ chịu (agreeableness)', 'Neuroticism|||Bất ổn cảm xúc', 'Emotional intelligence|||Trí tuệ cảm xúc'], correctIndex: 0, explanation: 'Extraversion was the strongest and most consistent correlate; agreeableness was weak, neuroticism negative, and EI is not one of the Big Five.|||Hướng ngoại là yếu tố tương quan mạnh và nhất quán nhất; dễ chịu tương quan yếu, bất ổn cảm xúc tương quan âm, còn EI không thuộc Big Five.' },
  { id: 'q3', question: 'In Katz’s three-skill approach, which skill is described as important at every level of management?|||Trong cách tiếp cận ba kỹ năng của Katz, kỹ năng nào được mô tả là quan trọng ở mọi cấp quản lý?', options: ['Technical skill|||Kỹ năng kỹ thuật', 'Conceptual skill|||Kỹ năng tư duy', 'Human skill|||Kỹ năng con người', 'Crystallised cognitive ability|||Năng lực nhận thức tinh thể'], correctIndex: 2, explanation: 'Technical skill matters most for supervisors and conceptual skill for top managers; human skill is needed at all levels. Crystallised ability belongs to Mumford’s model, not Katz’s.|||Kỹ năng kỹ thuật quan trọng nhất với cấp giám sát, kỹ năng tư duy với cấp cao; kỹ năng con người cần ở mọi cấp. Năng lực nhận thức tinh thể thuộc mô hình của Mumford, không phải của Katz.' },
]);

const c4 = doc('lds301-2-1-behavioural', '2.1 — The behavioural approach: Ohio State, Michigan and the Leadership Grid|||2.1 — Cách tiếp cận hành vi: Ohio State, Michigan và lưới lãnh đạo',
  'Hai nhóm hành vi nhiệm vụ và quan hệ: nghiên cứu Ohio State (định hình cấu trúc, quan tâm), Michigan (định hướng nhân viên, định hướng sản xuất), lưới lãnh đạo Blake–Mouton với năm phong cách chính, giả thuyết "cao–cao", điểm mạnh, hạn chế và mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 2 · Lesson 2.1</span>
<h2>The behavioural approach</h2>
<p class="lead">When trait research disappointed, researchers asked a different question: not who leaders <em>are</em>, but what they <em>do</em>. Across very different studies, leader behaviour kept falling into two broad families — behaviour about the <strong>task</strong> and behaviour about <strong>relationships</strong>.</p>
<h3>Ohio State studies (late 1940s onward)</h3>
<p>Researchers asked subordinates to describe how often their leaders engaged in many specific behaviours, using the Leader Behavior Description Questionnaire (LBDQ). Two largely independent factors emerged:</p>
<ul>
<li><strong>Initiating structure</strong> — task behaviour: organising work, defining roles and responsibilities, scheduling, setting standards.</li>
<li><strong>Consideration</strong> — relationship behaviour: building respect, trust and camaraderie, looking after followers' well-being.</li>
</ul>
<p>Because the two factors are separate, a leader can be high on both, low on both, or high on one and low on the other.</p>
<h3>University of Michigan studies</h3>
<p>Michigan researchers identified <strong>employee orientation</strong> (strong human-relations emphasis, interest in workers as people) and <strong>production orientation</strong> (stress on technical and production aspects of the job, workers as means to get work done). At first they were seen as opposite ends of one continuum; later research treated them, like the Ohio State factors, as two independent dimensions.</p>
<h3>The Leadership Grid (Blake &amp; Mouton)</h3>
<p>The Managerial Grid, later renamed the Leadership Grid, plots <strong>concern for results</strong> (production) on the horizontal axis and <strong>concern for people</strong> on the vertical axis, each from 1 to 9. The first number is concern for results, the second concern for people.</p>
<table>
<tr><th>Position</th><th>Style</th><th>Description</th></tr>
<tr><td>9,1</td><td>Authority–compliance</td><td>Results first; people are tools; communication is instruction and control</td></tr>
<tr><td>1,9</td><td>Country-club management</td><td>Comfort and friendly atmosphere first; results come second</td></tr>
<tr><td>1,1</td><td>Impoverished management</td><td>Minimum effort on both; the leader is uninvolved and withdrawn</td></tr>
<tr><td>5,5</td><td>Middle-of-the-road management</td><td>Compromise: adequate results with acceptable morale, avoiding conflict</td></tr>
<tr><td>9,9</td><td>Team management</td><td>High commitment to both; people are involved in shared goals</td></tr>
</table>
<p>Blake and Mouton also described <em>paternalism/maternalism</em> (using both concerns but keeping control, rewarding loyalty) and <em>opportunism</em> (using whichever style serves personal advancement). They argued that 9,9 is the most effective style in most situations.</p>
<h3>Is "high–high" always best?</h3>
<p>The idea that a leader who is high on both task and relationship behaviour is universally effective has received only limited and inconsistent support. Meta-analytic work (Judge, Piccolo and Ilies, 2004) found that both consideration and initiating structure are meaningfully related to outcomes: consideration more strongly to follower satisfaction and perceived leader effectiveness, initiating structure somewhat more to group and organisational performance. What the behavioural approach did <em>not</em> find is one style that works best everywhere — the gap that contingency theories (lessons 2.2 and 2.3) try to fill.</p>
<h3>Strengths and limits</h3>
<ul>
<li><strong>Strengths:</strong> focuses on observable, learnable behaviour; gives a simple and robust vocabulary (task vs relationship); supported by many studies.</li>
<li><strong>Limits:</strong> has not shown how particular behaviours link to particular outcomes in different situations; the "high–high" style is not universally best.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — moderate to strong</span> The two-factor structure (task and relationship) is one of the most replicated findings in leadership research. The claim that a single best style exists is not supported.</div>`,
    `<span class="eyebrow">LDS301 · Phần 2 · Bài 2.1</span>
<h2>Cách tiếp cận hành vi</h2>
<p class="lead">Khi nghiên cứu phẩm chất gây thất vọng, các nhà nghiên cứu đặt câu hỏi khác: không phải người lãnh đạo <em>là ai</em>, mà họ <em>làm gì</em>. Qua những nghiên cứu rất khác nhau, hành vi lãnh đạo liên tục quy về hai nhóm lớn — hành vi hướng về <strong>nhiệm vụ</strong> và hành vi hướng về <strong>quan hệ</strong>.</p>
<h3>Nghiên cứu Ohio State (từ cuối thập niên 1940)</h3>
<p>Các nhà nghiên cứu đề nghị cấp dưới mô tả mức độ thường xuyên người lãnh đạo thực hiện nhiều hành vi cụ thể, bằng Bảng mô tả hành vi lãnh đạo (LBDQ). Hai yếu tố gần như độc lập xuất hiện:</p>
<ul>
<li><strong>Định hình cấu trúc (initiating structure)</strong> — hành vi nhiệm vụ: tổ chức công việc, xác định vai trò và trách nhiệm, lập lịch, đặt tiêu chuẩn.</li>
<li><strong>Quan tâm (consideration)</strong> — hành vi quan hệ: xây dựng sự tôn trọng, lòng tin và tình đồng đội, chăm lo đời sống của người đi theo.</li>
</ul>
<p>Vì hai yếu tố tách biệt, một người lãnh đạo có thể cao cả hai, thấp cả hai, hoặc cao một và thấp một.</p>
<h3>Nghiên cứu của Đại học Michigan</h3>
<p>Các nhà nghiên cứu Michigan xác định <strong>định hướng nhân viên</strong> (nhấn mạnh quan hệ con người, quan tâm tới người lao động như những con người) và <strong>định hướng sản xuất</strong> (nhấn mạnh khía cạnh kỹ thuật và sản xuất của công việc, coi người lao động là phương tiện để hoàn thành việc). Ban đầu hai định hướng được xem là hai đầu của một trục; về sau, giống các yếu tố Ohio State, chúng được coi là hai chiều độc lập.</p>
<h3>Lưới lãnh đạo (Blake &amp; Mouton)</h3>
<p>Lưới quản trị, sau đổi tên thành lưới lãnh đạo, đặt <strong>quan tâm tới kết quả</strong> (sản xuất) trên trục ngang và <strong>quan tâm tới con người</strong> trên trục dọc, mỗi trục từ 1 đến 9. Số thứ nhất là quan tâm tới kết quả, số thứ hai là quan tâm tới con người.</p>
<table>
<tr><th>Vị trí</th><th>Phong cách</th><th>Mô tả</th></tr>
<tr><td>9,1</td><td>Quyền lực – phục tùng</td><td>Kết quả trên hết; con người là công cụ; giao tiếp là ra lệnh và kiểm soát</td></tr>
<tr><td>1,9</td><td>Quản lý kiểu câu lạc bộ</td><td>Sự thoải mái và bầu không khí thân thiện trên hết; kết quả xếp sau</td></tr>
<tr><td>1,1</td><td>Quản lý bỏ mặc</td><td>Nỗ lực tối thiểu cho cả hai; người lãnh đạo thờ ơ, tách biệt</td></tr>
<tr><td>5,5</td><td>Quản lý trung dung</td><td>Thoả hiệp: kết quả tạm được, tinh thần chấp nhận được, tránh xung đột</td></tr>
<tr><td>9,9</td><td>Quản lý theo đội</td><td>Cam kết cao với cả hai; mọi người cùng tham gia vào mục tiêu chung</td></tr>
</table>
<p>Blake và Mouton còn mô tả kiểu <em>gia trưởng</em> (dùng cả hai mối quan tâm nhưng giữ quyền kiểm soát, thưởng cho sự trung thành) và kiểu <em>cơ hội</em> (dùng bất kỳ phong cách nào có lợi cho sự thăng tiến cá nhân). Họ cho rằng 9,9 là phong cách hiệu quả nhất trong phần lớn tình huống.</p>
<h3>"Cao–cao" có luôn tốt nhất?</h3>
<p>Ý tưởng rằng người lãnh đạo cao cả về hành vi nhiệm vụ lẫn quan hệ thì hiệu quả ở mọi nơi chỉ nhận được sự ủng hộ hạn chế và không nhất quán. Nghiên cứu phân tích tổng hợp (Judge, Piccolo và Ilies, 2004) cho thấy cả quan tâm lẫn định hình cấu trúc đều liên hệ có ý nghĩa với kết quả: quan tâm liên hệ mạnh hơn với sự hài lòng của người đi theo và hiệu quả lãnh đạo được cảm nhận, định hình cấu trúc liên hệ nhiều hơn một chút với thành tích của nhóm và tổ chức. Điều cách tiếp cận hành vi <em>không</em> tìm ra là một phong cách tốt nhất ở mọi nơi — khoảng trống mà các lý thuyết ngẫu nhiên (bài 2.2 và 2.3) cố gắng lấp.</p>
<h3>Điểm mạnh và hạn chế</h3>
<ul>
<li><strong>Điểm mạnh:</strong> tập trung vào hành vi quan sát được và học được; cho một bộ từ vựng đơn giản, vững chắc (nhiệm vụ và quan hệ); được nhiều nghiên cứu ủng hộ.</li>
<li><strong>Hạn chế:</strong> chưa chỉ ra hành vi cụ thể nào dẫn tới kết quả cụ thể nào trong từng tình huống; phong cách "cao–cao" không phải lúc nào cũng tốt nhất.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình tới mạnh</span> Cấu trúc hai yếu tố (nhiệm vụ và quan hệ) là một trong những phát hiện được lặp lại nhiều nhất trong nghiên cứu lãnh đạo. Nhận định rằng có một phong cách tốt nhất duy nhất thì không được ủng hộ.</div>`,
  ]]);

const c5 = doc('lds301-2-2-fiedler', '2.2 — Fiedler’s contingency theory|||2.2 — Lý thuyết ngẫu nhiên của Fiedler',
  'Phong cách lãnh đạo đo bằng thang LPC (hướng nhiệm vụ hay hướng quan hệ), ba biến tình huống (quan hệ lãnh đạo–thành viên, cấu trúc nhiệm vụ, quyền lực vị trí), tám ô (octant) và mức thuận lợi, dự báo của mô hình, "thiết kế lại công việc", tranh cãi về bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 2 · Lesson 2.2</span>
<h2>Fiedler's contingency theory</h2>
<p class="lead">Fiedler (1967) proposed the first major "it depends" theory: a leader's effectiveness depends on the <strong>match</strong> between the leader's style and the favourableness of the situation. Crucially, he treated style as relatively <em>fixed</em> — so if the match is poor, change the situation rather than the leader.</p>
<h3>Measuring style: the LPC scale</h3>
<p>Leaders think of the one co-worker they have worked with <em>least well</em> — the least preferred co-worker (LPC) — and describe that person on a series of bipolar adjective scales. We do not reproduce the copyrighted items here; what matters is how the score is read:</p>
<ul>
<li><strong>Low LPC</strong> (describes the least preferred co-worker very negatively) → <strong>task-motivated</strong>: gets satisfaction from accomplishing the task.</li>
<li><strong>High LPC</strong> (describes that person relatively positively) → <strong>relationship-motivated</strong>: gets satisfaction from good interpersonal relations.</li>
<li>A middle score is sometimes labelled socio-independent.</li>
</ul>
<h3>Three situational variables</h3>
<table>
<tr><th>Variable</th><th>Favourable when</th><th>Weight</th></tr>
<tr><td>Leader–member relations</td><td>Good: the group trusts, likes and is loyal to the leader</td><td>Most important</td></tr>
<tr><td>Task structure</td><td>High: clear requirements, few paths to the goal, results easy to verify, few correct solutions</td><td>Second</td></tr>
<tr><td>Position power</td><td>Strong: formal authority to reward, punish, hire and fire</td><td>Least important</td></tr>
</table>
<h3>The eight octants</h3>
<pre><code class="language-text">Octant   Relations   Task structure   Position power   Favourableness   Predicted best leader
I        Good        High             Strong           High             Low LPC (task)
II       Good        High             Weak             High             Low LPC (task)
III      Good        Low              Strong           High             Low LPC (task)
IV       Good        Low              Weak             Moderate         High LPC (relationship)
V        Poor        High             Strong           Moderate         High LPC (relationship)
VI       Poor        High             Weak             Moderate         High LPC (relationship)
VII      Poor        Low              Strong           Moderate*        High LPC (relationship)*
VIII     Poor        Low              Weak             Low              Low LPC (task)</code></pre>
<p>The logic is a U-shape. When the situation is very favourable, the group is ready to act and a task-focused leader simply gets things done; when it is very unfavourable, the group needs firm structure, which again favours the task-motivated leader. In the moderate middle, a relationship-motivated leader who can build trust and handle ambiguity does best. * Octant VII is the borderline case. Northouse, the core text for this course, counts octants IV–VII as moderately favourable and assigns VII to the relationship-motivated (high-LPC) leader; some organisational-behaviour textbooks group VII with VIII as unfavourable and assign it to the task-motivated leader — so do not rely on it.</p>
<h3>What to do with a mismatch</h3>
<p>Because Fiedler assumed style is hard to change, his practical advice (the "Leader Match" idea) is <strong>job engineering</strong>: move the situation into a zone that suits the leader, for example by adding structure to the task (procedures, milestones), increasing or reducing formal authority, or improving relations. Alternatively, place leaders in situations that fit them.</p>
<h3>Strengths and criticisms</h3>
<ul>
<li><strong>Strengths:</strong> first theory to make the situation central; predictive and testable; relieves leaders of the expectation to be effective everywhere.</li>
<li><strong>Criticisms:</strong> the LPC measure has weak face validity — it is not obvious what describing a disliked co-worker actually measures; the theory does not explain <em>why</em> certain styles fit certain situations; it gives little guidance on what to do beyond changing the situation; and the treatment of middle-LPC leaders and some octants is unclear.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — moderate, contested</span> Meta-analyses in the 1980s found general support, stronger in laboratory studies than in field studies, and not for every octant. The meaning and stability of LPC scores remain debated.</div>`,
    `<span class="eyebrow">LDS301 · Phần 2 · Bài 2.2</span>
<h2>Lý thuyết ngẫu nhiên của Fiedler</h2>
<p class="lead">Fiedler (1967) đề xuất lý thuyết "tuỳ tình huống" lớn đầu tiên: hiệu quả của người lãnh đạo phụ thuộc vào sự <strong>phù hợp</strong> giữa phong cách của người đó và mức độ thuận lợi của tình huống. Điểm then chốt: ông coi phong cách là tương đối <em>cố định</em> — nên khi không phù hợp thì hãy thay đổi tình huống thay vì thay đổi người lãnh đạo.</p>
<h3>Đo phong cách: thang LPC</h3>
<p>Người lãnh đạo nghĩ tới một đồng nghiệp mà mình làm việc <em>kém ăn ý nhất</em> — đồng nghiệp ít được ưa thích nhất (LPC) — rồi mô tả người đó trên một loạt thang tính từ đối lập. Ở đây không chép lại các câu có bản quyền; điều quan trọng là cách đọc điểm:</p>
<ul>
<li><strong>LPC thấp</strong> (mô tả đồng nghiệp ít ưa thích nhất rất tiêu cực) → <strong>động cơ nhiệm vụ</strong>: thấy thoả mãn khi hoàn thành nhiệm vụ.</li>
<li><strong>LPC cao</strong> (mô tả người đó tương đối tích cực) → <strong>động cơ quan hệ</strong>: thấy thoả mãn từ các mối quan hệ tốt đẹp.</li>
<li>Điểm ở giữa đôi khi được gọi là độc lập xã hội.</li>
</ul>
<h3>Ba biến tình huống</h3>
<table>
<tr><th>Biến</th><th>Thuận lợi khi</th><th>Trọng số</th></tr>
<tr><td>Quan hệ lãnh đạo – thành viên</td><td>Tốt: nhóm tin tưởng, quý mến và trung thành với người lãnh đạo</td><td>Quan trọng nhất</td></tr>
<tr><td>Cấu trúc nhiệm vụ</td><td>Cao: yêu cầu rõ ràng, ít con đường tới mục tiêu, kết quả dễ kiểm chứng, ít lời giải đúng</td><td>Thứ hai</td></tr>
<tr><td>Quyền lực vị trí</td><td>Mạnh: có thẩm quyền chính thức để thưởng, phạt, tuyển dụng và cho nghỉ việc</td><td>Ít quan trọng nhất</td></tr>
</table>
<h3>Tám ô (octant)</h3>
<pre><code class="language-text">Ô     Quan hệ   Cấu trúc NV   Quyền lực VT   Mức thuận lợi   Người lãnh đạo phù hợp theo dự báo
I     Tốt       Cao           Mạnh           Cao             LPC thấp (nhiệm vụ)
II    Tốt       Cao           Yếu            Cao             LPC thấp (nhiệm vụ)
III   Tốt       Thấp          Mạnh           Cao             LPC thấp (nhiệm vụ)
IV    Tốt       Thấp          Yếu            Trung bình      LPC cao (quan hệ)
V     Kém       Cao           Mạnh           Trung bình      LPC cao (quan hệ)
VI    Kém       Cao           Yếu            Trung bình      LPC cao (quan hệ)
VII   Kém       Thấp          Mạnh           Trung bình*     LPC cao (quan hệ)*
VIII  Kém       Thấp          Yếu            Thấp            LPC thấp (nhiệm vụ)</code></pre>
<p>Logic của mô hình có dạng chữ U. Khi tình huống rất thuận lợi, nhóm đã sẵn sàng hành động và người lãnh đạo hướng nhiệm vụ chỉ việc đẩy công việc về đích; khi tình huống rất bất lợi, nhóm cần cấu trúc chặt, điều này lại có lợi cho người lãnh đạo hướng nhiệm vụ. Ở vùng trung bình, người lãnh đạo hướng quan hệ — biết xây dựng lòng tin và xử lý sự mơ hồ — làm tốt nhất. * Ô VII là trường hợp ranh giới. Northouse — giáo trình chính của môn này — xếp các ô IV–VII vào mức thuận lợi trung bình và dành ô VII cho người lãnh đạo động cơ quan hệ (LPC cao); một số giáo trình hành vi tổ chức lại gộp ô VII với ô VIII vào nhóm bất lợi và dành nó cho người lãnh đạo hướng nhiệm vụ — nên đừng dựa vào ô này.</p>
<h3>Làm gì khi không phù hợp</h3>
<p>Vì Fiedler cho rằng phong cách khó thay đổi, lời khuyên thực tế của ông (ý tưởng "Leader Match") là <strong>thiết kế lại công việc</strong>: đưa tình huống vào vùng hợp với người lãnh đạo, ví dụ tăng cấu trúc cho nhiệm vụ (quy trình, mốc tiến độ), tăng hoặc giảm quyền hạn chính thức, hoặc cải thiện quan hệ. Cách khác là bố trí người lãnh đạo vào những tình huống hợp với họ.</p>
<h3>Điểm mạnh và phê bình</h3>
<ul>
<li><strong>Điểm mạnh:</strong> lý thuyết đầu tiên đặt tình huống vào trung tâm; có tính dự báo và kiểm định được; giải phóng người lãnh đạo khỏi kỳ vọng phải hiệu quả ở mọi nơi.</li>
<li><strong>Phê bình:</strong> thang LPC có giá trị bề mặt yếu — không rõ việc mô tả một đồng nghiệp mình không ưa thực chất đo cái gì; lý thuyết không giải thích <em>vì sao</em> phong cách này hợp với tình huống kia; ít hướng dẫn phải làm gì ngoài việc thay đổi tình huống; cách xử lý người có LPC trung bình và một số ô chưa rõ ràng.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình, còn tranh cãi</span> Các phân tích tổng hợp thập niên 1980 cho thấy mô hình được ủng hộ nói chung, mạnh hơn trong nghiên cứu phòng thí nghiệm so với nghiên cứu thực địa, và không đúng với mọi ô. Ý nghĩa và độ ổn định của điểm LPC vẫn còn tranh luận.</div>`,
  ]]);

const c6 = doc('lds301-2-3-path-goal', '2.3 — Path–goal theory and substitutes for leadership|||2.3 — Lý thuyết đường dẫn – mục tiêu và yếu tố thay thế lãnh đạo',
  'Nền tảng thuyết kỳ vọng, bốn hành vi lãnh đạo của House (chỉ đạo, hỗ trợ, tham gia, định hướng thành tựu), đặc điểm người đi theo và đặc điểm nhiệm vụ, bảng dự báo, yếu tố thay thế và vô hiệu hoá lãnh đạo (Kerr & Jermier), mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 2 · Lesson 2.3</span>
<h2>Path–goal theory and substitutes for leadership</h2>
<p class="lead">Path–goal theory (House, 1971; House &amp; Mitchell, 1974) asks how leaders can <strong>motivate</strong> followers. Its answer: by clarifying the path to goals, removing obstacles and making the rewards along the way meaningful — and by choosing the behaviour that supplies what the followers and the task are missing.</p>
<h3>The motivational core</h3>
<p>The theory builds on <strong>expectancy theory</strong>: people are motivated when they believe they can do the job (expectancy), that doing it will lead to an outcome (instrumentality), and that the outcome is worthwhile (valence). The leader's job is to strengthen each link.</p>
<h3>Four leader behaviours</h3>
<table>
<tr><th>Behaviour</th><th>What the leader does</th></tr>
<tr><td>Directive</td><td>Gives instructions, expectations, methods, schedules and standards</td></tr>
<tr><td>Supportive</td><td>Is friendly and approachable, attends to followers' well-being and needs</td></tr>
<tr><td>Participative</td><td>Invites followers to share in decision making, consults and uses their ideas</td></tr>
<tr><td>Achievement-oriented</td><td>Sets challenging goals, expects excellence, shows confidence in followers</td></tr>
</table>
<h3>Contingencies: followers and task</h3>
<ul>
<li><strong>Follower characteristics:</strong> need for affiliation, preference for structure, desire for control (locus of control), self-perceived ability.</li>
<li><strong>Task characteristics:</strong> design of the task, the formal authority system, and work-group norms.</li>
</ul>
<table>
<tr><th>Situation</th><th>Behaviour the theory suggests</th></tr>
<tr><td>Ambiguous task, unclear rules; followers who prefer structure or feel inexperienced</td><td>Directive</td></tr>
<tr><td>Repetitive, dull or stressful tasks; followers who need affiliation</td><td>Supportive</td></tr>
<tr><td>Unstructured task; followers with internal locus of control who want autonomy</td><td>Participative</td></tr>
<tr><td>Complex tasks; followers who want to excel and can set high standards</td><td>Achievement-oriented</td></tr>
</table>
<p>A key point: behaviour that duplicates what the situation already provides is redundant and can annoy. Close direction of an expert doing a well-structured task adds nothing — and may be read as distrust.</p>
<h3>Substitutes for leadership (Kerr &amp; Jermier, 1978)</h3>
<p>Some features of followers, tasks and organisations can <strong>substitute</strong> for leader behaviour (make it unnecessary) or <strong>neutralise</strong> it (block its effect). Examples: professional training and experience substitute for directive behaviour; intrinsically satisfying work substitutes for supportive behaviour; a leader who is physically far from the team, or who has no control over rewards, is neutralised. The idea reminds us that good organisational design can reduce the need for constant leader intervention.</p>
<h3>Strengths and criticisms</h3>
<ul>
<li><strong>Strengths:</strong> links leadership directly to motivation; gives practical guidance on matching behaviour to needs; reminds leaders their role is to help, not to dominate.</li>
<li><strong>Criticisms:</strong> so many variables that the theory is hard to test as a whole; empirical support is partial and mixed; it does not fully explain how leader behaviour changes follower motivation; it places most responsibility on the leader.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — limited to mixed</span> Tests of path–goal theory give partial support for some predictions (for example, supportive behaviour on stressful tasks) but inconsistent results for others. Research on substitutes for leadership has also produced mixed findings.</div>`,
    `<span class="eyebrow">LDS301 · Phần 2 · Bài 2.3</span>
<h2>Lý thuyết đường dẫn – mục tiêu và yếu tố thay thế lãnh đạo</h2>
<p class="lead">Lý thuyết đường dẫn – mục tiêu (House, 1971; House &amp; Mitchell, 1974) hỏi người lãnh đạo có thể <strong>tạo động lực</strong> cho người đi theo bằng cách nào. Câu trả lời: làm rõ con đường tới mục tiêu, dỡ bỏ trở ngại và làm cho phần thưởng trên đường đi trở nên có ý nghĩa — và chọn hành vi bù đắp đúng thứ mà người đi theo và nhiệm vụ đang thiếu.</p>
<h3>Cốt lõi về động lực</h3>
<p>Lý thuyết dựa trên <strong>thuyết kỳ vọng</strong>: con người có động lực khi tin rằng mình làm được việc (kỳ vọng), làm xong sẽ dẫn tới một kết quả (phương tiện), và kết quả đó đáng giá (hoá trị). Việc của người lãnh đạo là củng cố từng mắt xích.</p>
<h3>Bốn hành vi lãnh đạo</h3>
<table>
<tr><th>Hành vi</th><th>Người lãnh đạo làm gì</th></tr>
<tr><td>Chỉ đạo</td><td>Đưa ra hướng dẫn, kỳ vọng, phương pháp, lịch trình và tiêu chuẩn</td></tr>
<tr><td>Hỗ trợ</td><td>Thân thiện, dễ tiếp cận, chăm lo đời sống và nhu cầu của người đi theo</td></tr>
<tr><td>Tham gia</td><td>Mời người đi theo cùng ra quyết định, tham vấn và sử dụng ý tưởng của họ</td></tr>
<tr><td>Định hướng thành tựu</td><td>Đặt mục tiêu thách thức, kỳ vọng sự xuất sắc, thể hiện niềm tin vào người đi theo</td></tr>
</table>
<h3>Các yếu tố ngẫu nhiên: người đi theo và nhiệm vụ</h3>
<ul>
<li><strong>Đặc điểm người đi theo:</strong> nhu cầu liên kết, mức ưa thích cấu trúc, mong muốn kiểm soát (nơi kiểm soát), năng lực tự đánh giá.</li>
<li><strong>Đặc điểm nhiệm vụ:</strong> thiết kế nhiệm vụ, hệ thống thẩm quyền chính thức, và chuẩn mực của nhóm làm việc.</li>
</ul>
<table>
<tr><th>Tình huống</th><th>Hành vi lý thuyết gợi ý</th></tr>
<tr><td>Nhiệm vụ mơ hồ, quy định không rõ; người đi theo thích cấu trúc hoặc thấy mình thiếu kinh nghiệm</td><td>Chỉ đạo</td></tr>
<tr><td>Nhiệm vụ lặp lại, nhàm chán hoặc căng thẳng; người đi theo cần sự gắn kết</td><td>Hỗ trợ</td></tr>
<tr><td>Nhiệm vụ thiếu cấu trúc; người đi theo có nơi kiểm soát bên trong, muốn tự chủ</td><td>Tham gia</td></tr>
<tr><td>Nhiệm vụ phức tạp; người đi theo muốn xuất sắc và có thể tự đặt chuẩn cao</td><td>Định hướng thành tựu</td></tr>
</table>
<p>Một điểm then chốt: hành vi lặp lại thứ mà tình huống đã có sẵn là thừa và có thể gây khó chịu. Chỉ đạo sát sao một chuyên gia đang làm một nhiệm vụ có cấu trúc rõ ràng không thêm được gì — và còn có thể bị hiểu là thiếu tin tưởng.</p>
<h3>Yếu tố thay thế lãnh đạo (Kerr &amp; Jermier, 1978)</h3>
<p>Một số đặc điểm của người đi theo, nhiệm vụ và tổ chức có thể <strong>thay thế</strong> hành vi lãnh đạo (khiến nó không cần thiết) hoặc <strong>vô hiệu hoá</strong> nó (chặn tác dụng của nó). Ví dụ: đào tạo chuyên nghiệp và kinh nghiệm thay thế cho hành vi chỉ đạo; công việc tự thân đem lại thoả mãn thay thế cho hành vi hỗ trợ; người lãnh đạo ở xa đội về địa lý, hoặc không kiểm soát được phần thưởng, thì bị vô hiệu hoá. Ý tưởng này nhắc rằng thiết kế tổ chức tốt có thể giảm nhu cầu người lãnh đạo phải can thiệp liên tục.</p>
<h3>Điểm mạnh và phê bình</h3>
<ul>
<li><strong>Điểm mạnh:</strong> gắn lãnh đạo trực tiếp với động lực; hướng dẫn thực tế về việc chọn hành vi theo nhu cầu; nhắc người lãnh đạo rằng vai trò của họ là giúp đỡ chứ không phải áp đảo.</li>
<li><strong>Phê bình:</strong> quá nhiều biến nên khó kiểm định lý thuyết như một tổng thể; bằng chứng thực nghiệm chỉ một phần và lẫn lộn; chưa giải thích đầy đủ hành vi lãnh đạo thay đổi động lực người đi theo ra sao; đặt phần lớn trách nhiệm lên người lãnh đạo.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — hạn chế tới lẫn lộn</span> Các kiểm định lý thuyết đường dẫn – mục tiêu ủng hộ một phần một số dự báo (ví dụ hành vi hỗ trợ với nhiệm vụ căng thẳng) nhưng cho kết quả không nhất quán với các dự báo khác. Nghiên cứu về yếu tố thay thế lãnh đạo cũng cho kết quả lẫn lộn.</div>`,
  ]]);

const c6e = doc('lds301-2-4-exercise', 'Exercise 1 — Fiedler: diagnose three situations|||Bài tập 1 — Fiedler: chẩn đoán ba tình huống',
  'Bài tập tình huống giả định: phân loại quan hệ lãnh đạo–thành viên, cấu trúc nhiệm vụ và quyền lực vị trí bằng quy tắc cho trước, xác định ô (octant) và mức thuận lợi, chọn người lãnh đạo LPC thấp hay cao, và thiết kế lại công việc khi không phù hợp; kèm lời giải.',
  [[
    `<span class="eyebrow">LDS301 · Part 2 · Exercise</span>
<h2>Exercise 1 — which leader fits which situation?</h2>
<div class="callout"><span class="badge">Problem</span> Delta Co. is a fictional company; all figures are illustrative. For teaching purposes, use these assumed rules: <strong>relations</strong> are good if the team's average trust score in an anonymous pulse survey is at least 3.5 out of 5; <strong>task structure</strong> is high if at least 3 of 4 criteria are met (clear goal, clear procedure, verifiable result, few correct solutions); <strong>position power</strong> is strong if the leader holds at least 2 of 3 formal levers (assign work, influence pay or bonus, start discipline).<br><br>
<strong>A.</strong> Night-shift lead in the warehouse: trust 4.4; criteria met 4 of 4; levers 3 of 3.<br>
<strong>B.</strong> Coordinator of a volunteer committee that must design a new employee well-being programme: trust 4.1; criteria met 1 of 4; levers 0 of 3.<br>
<strong>C.</strong> Project manager in a matrix structure sent to rescue a late innovation project; members report to their functional heads; the team distrusts management after the previous manager left: trust 2.3; criteria met 1 of 4; levers 1 of 3.<br><br>
(a) Classify each situation and find its octant and favourableness. (b) Which type of leader (low or high LPC) does Fiedler predict will be more effective? (c) In situation B, the only available coordinator has a low LPC score. What would Fiedler recommend?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a)  Case  Trust  Criteria  Levers   Relations  Task   Power    Octant  Favourableness
     A     4.4    4/4       3/3      Good       High   Strong   I       High
     B     4.1    1/4       0/3      Good       Low    Weak     IV      Moderate
     C     2.3    1/4       1/3      Poor       Low    Weak     VIII    Low

(b)  A (octant I)    → low-LPC, task-motivated leader
     B (octant IV)   → high-LPC, relationship-motivated leader
     C (octant VIII) → low-LPC, task-motivated leader

(c)  Job engineering — change the situation, not the leader:
     • add structure: a charter, milestones and templates → criteria 3/4
       → Good / High / Weak = octant II (high favourableness) → fits low LPC
     • or give formal levers: the right to assign work and to recommend bonuses → levers 2/3
       → Good / Low / Strong = octant III (high favourableness) → fits low LPC</code></pre>
<p><strong>Why:</strong> in A everything is clear and the leader is trusted, so a leader who concentrates on getting the task done is efficient. C is the other extreme: with no trust, no clear task and little authority, the team needs someone who imposes structure quickly. B sits in the middle — a trusted leader with an open-ended task and no authority must rely on relationships and persuasion, which suits a relationship-motivated leader. Note that the cut-off rules here are assumed teaching devices, not Fiedler's own instruments, and that the model's field evidence is mixed: use it as a structured way to think about fit, not as a mechanical formula.</p>`,
    `<span class="eyebrow">LDS301 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — người lãnh đạo nào hợp với tình huống nào?</h2>
<div class="callout"><span class="badge">Đề</span> Công ty Delta là doanh nghiệp hư cấu; mọi số liệu là số liệu minh hoạ giả định. Để học tập, dùng các quy tắc giả định sau: <strong>quan hệ</strong> là tốt nếu điểm tin tưởng trung bình của đội trong khảo sát nhanh ẩn danh từ 3,5 trên 5 trở lên; <strong>cấu trúc nhiệm vụ</strong> là cao nếu đạt ít nhất 3 trong 4 tiêu chí (mục tiêu rõ, quy trình rõ, kết quả kiểm chứng được, ít lời giải đúng); <strong>quyền lực vị trí</strong> là mạnh nếu người lãnh đạo nắm ít nhất 2 trong 3 đòn bẩy chính thức (giao việc, tác động tới lương hoặc thưởng, khởi động kỷ luật).<br><br>
<strong>A.</strong> Trưởng ca đêm ở kho: điểm tin tưởng 4,4; đạt 4/4 tiêu chí; nắm 3/3 đòn bẩy.<br>
<strong>B.</strong> Điều phối viên một ban tình nguyện phải thiết kế chương trình chăm sóc sức khoẻ tinh thần mới cho nhân viên: điểm tin tưởng 4,1; đạt 1/4 tiêu chí; nắm 0/3 đòn bẩy.<br>
<strong>C.</strong> Quản lý dự án trong cơ cấu ma trận được cử tới cứu một dự án đổi mới bị chậm; thành viên báo cáo cho trưởng bộ phận chức năng của họ; cả đội mất lòng tin vào ban quản lý sau khi quản lý cũ nghỉ: điểm tin tưởng 2,3; đạt 1/4 tiêu chí; nắm 1/3 đòn bẩy.<br><br>
(a) Phân loại từng tình huống, xác định ô (octant) và mức thuận lợi. (b) Fiedler dự báo kiểu người lãnh đạo nào (LPC thấp hay cao) sẽ hiệu quả hơn? (c) Ở tình huống B, người điều phối duy nhất có thể bố trí lại có điểm LPC thấp. Fiedler sẽ khuyên gì?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a)  TH   Tin tưởng  Tiêu chí  Đòn bẩy  Quan hệ  Nhiệm vụ  Quyền lực  Ô     Mức thuận lợi
     A    4,4        4/4       3/3      Tốt      Cao       Mạnh       I     Cao
     B    4,1        1/4       0/3      Tốt      Thấp      Yếu        IV    Trung bình
     C    2,3        1/4       1/3      Kém      Thấp      Yếu        VIII  Thấp

(b)  A (ô I)    → người lãnh đạo LPC thấp, động cơ nhiệm vụ
     B (ô IV)   → người lãnh đạo LPC cao, động cơ quan hệ
     C (ô VIII) → người lãnh đạo LPC thấp, động cơ nhiệm vụ

(c)  Thiết kế lại công việc — đổi tình huống, không đổi người:
     • thêm cấu trúc: điều lệ dự án, mốc tiến độ, biểu mẫu → đạt 3/4 tiêu chí
       → Tốt / Cao / Yếu = ô II (mức thuận lợi cao) → hợp với LPC thấp
     • hoặc trao đòn bẩy chính thức: quyền giao việc và đề xuất thưởng → nắm 2/3
       → Tốt / Thấp / Mạnh = ô III (mức thuận lợi cao) → hợp với LPC thấp</code></pre>
<p><strong>Vì sao:</strong> ở A mọi thứ rõ ràng và người lãnh đạo được tin tưởng, nên người tập trung hoàn thành nhiệm vụ làm việc hiệu quả. C là thái cực còn lại: không có lòng tin, nhiệm vụ không rõ và gần như không có quyền hạn, cả đội cần một người áp đặt cấu trúc nhanh chóng. B nằm ở giữa — một người được tin tưởng nhưng nhiệm vụ mở và không có quyền hạn phải dựa vào quan hệ và thuyết phục, điều hợp với người lãnh đạo động cơ quan hệ. Lưu ý các ngưỡng phân loại ở đây là công cụ dạy học giả định, không phải công cụ đo của chính Fiedler, và bằng chứng thực địa của mô hình còn lẫn lộn: hãy dùng nó như một cách tư duy có cấu trúc về sự phù hợp, không phải một công thức máy móc.</p>`,
  ]]);

const c6q = quiz('lds301-quiz-2', 'Quiz 2 — Behaviour and contingency|||Quiz 2 — Hành vi và ngẫu nhiên', [
  { id: 'q1', question: 'In the Leadership Grid, a manager with high concern for people but low concern for results (1,9) practises…|||Trong lưới lãnh đạo, người quản lý quan tâm cao tới con người nhưng thấp tới kết quả (1,9) theo phong cách…', options: ['Authority–compliance management|||Quyền lực – phục tùng', 'Country-club management|||Quản lý kiểu câu lạc bộ', 'Team management|||Quản lý theo đội', 'Impoverished management|||Quản lý bỏ mặc'], correctIndex: 1, explanation: 'The first number is concern for results, the second concern for people: 1,9 puts comfort and a friendly atmosphere ahead of results.|||Số thứ nhất là quan tâm tới kết quả, số thứ hai là quan tâm tới con người: 1,9 đặt sự thoải mái và bầu không khí thân thiện lên trước kết quả.' },
  { id: 'q2', question: 'Leader–member relations are good, task structure is low and position power is weak. Which octant is this, and whom does Fiedler predict will be more effective?|||Quan hệ lãnh đạo – thành viên tốt, cấu trúc nhiệm vụ thấp, quyền lực vị trí yếu. Đây là ô nào, và Fiedler dự báo ai hiệu quả hơn?', options: ['Octant II, a low-LPC leader|||Ô II, người lãnh đạo LPC thấp', 'Octant VIII, a low-LPC leader|||Ô VIII, người lãnh đạo LPC thấp', 'Octant IV, a high-LPC leader|||Ô IV, người lãnh đạo LPC cao', 'Octant I, a high-LPC leader|||Ô I, người lãnh đạo LPC cao'], correctIndex: 2, explanation: 'Good / Low / Weak is octant IV, a moderately favourable situation, where relationship-motivated (high-LPC) leaders are predicted to do best.|||Tốt / Thấp / Yếu là ô IV, tình huống thuận lợi trung bình, nơi người lãnh đạo động cơ quan hệ (LPC cao) được dự báo làm tốt nhất.' },
  { id: 'q3', question: 'Path–goal theory suggests which behaviour for followers doing a repetitive, dull or stressful task?|||Lý thuyết đường dẫn – mục tiêu gợi ý hành vi nào với người đi theo đang làm nhiệm vụ lặp lại, nhàm chán hoặc căng thẳng?', options: ['Directive|||Chỉ đạo', 'Achievement-oriented|||Định hướng thành tựu', 'Participative|||Tham gia', 'Supportive|||Hỗ trợ'], correctIndex: 3, explanation: 'Supportive behaviour supplies what these tasks lack — human warmth and care that make stressful or monotonous work more tolerable; on a routine, well-structured task, extra direction would be redundant.|||Hành vi hỗ trợ bù đắp thứ những nhiệm vụ này đang thiếu — sự ấm áp và quan tâm giúp công việc căng thẳng hoặc đơn điệu dễ chịu đựng hơn; với một nhiệm vụ thường nhật, có cấu trúc rõ, chỉ đạo thêm là thừa.' },
]);

const c7 = doc('lds301-3-1-situational', '3.1 — Situational leadership: Hersey–Blanchard and SLII|||3.1 — Lãnh đạo tình huống: Hersey–Blanchard và SLII',
  'Hai chiều hành vi chỉ đạo và hỗ trợ, bốn phong cách S1–S4, bốn mức phát triển D1–D4 (năng lực × cam kết) theo từng nhiệm vụ, nguyên tắc ghép phong cách với mức phát triển, phiên bản gốc Hersey–Blanchard, vì sao mô hình phổ biến và vì sao bằng chứng yếu.',
  [[
    `<span class="eyebrow">LDS301 · Part 3 · Lesson 3.1</span>
<h2>Situational leadership: Hersey–Blanchard and SLII</h2>
<p class="lead">Situational leadership is probably the most widely used leadership model in corporate training. Its promise is intuitive: diagnose how ready a person is for a specific task, then give that person the right mix of direction and support.</p>
<h3>Origins</h3>
<p>Hersey and Blanchard introduced a "life-cycle theory of leadership" in 1969, later called Situational Leadership. Their version used follower <em>readiness</em> (earlier "maturity", R1–R4) and four styles: telling, selling, participating and delegating. Blanchard and colleagues later revised it as <strong>SLII</strong>, with the terms used below.</p>
<h3>Two dimensions of leader behaviour</h3>
<ul>
<li><strong>Directive behaviour</strong> — one-way communication that helps people accomplish goals: giving directions, setting goals and methods, defining roles, showing how.</li>
<li><strong>Supportive behaviour</strong> — two-way communication that helps people feel comfortable about themselves, co-workers and the situation: asking for input, listening, praising, sharing information about oneself.</li>
</ul>
<h3>Four styles and four development levels</h3>
<table>
<tr><th>Development level of the follower (for this task)</th><th>Matching style</th><th>Leader behaviour</th></tr>
<tr><td><strong>D1</strong> — low competence, high commitment ("enthusiastic beginner")</td><td><strong>S1 Directing</strong></td><td>High directive, low supportive: clear goals, step-by-step instructions, close supervision</td></tr>
<tr><td><strong>D2</strong> — some competence, low commitment ("disillusioned learner")</td><td><strong>S2 Coaching</strong></td><td>High directive, high supportive: keep directing, but explain why, ask for ideas, encourage</td></tr>
<tr><td><strong>D3</strong> — moderate to high competence, variable commitment ("capable but cautious")</td><td><strong>S3 Supporting</strong></td><td>High supportive, low directive: listen, facilitate problem solving, express confidence</td></tr>
<tr><td><strong>D4</strong> — high competence, high commitment ("self-reliant achiever")</td><td><strong>S4 Delegating</strong></td><td>Low supportive, low directive: agree the goal, then hand over responsibility</td></tr>
</table>
<h3>Rules for using the model</h3>
<ol>
<li><strong>Diagnose per task, not per person.</strong> A senior analyst can be D4 in budgeting and D1 in negotiating a contract.</li>
<li><strong>Match the style to the level</strong> — and move with the person: as they develop, first add support while keeping direction high (S1→S2), then reduce direction (S2→S3), and finally reduce support (S3→S4).</li>
<li><strong>Move back when performance drops.</strong> If a D4 starts to struggle (a new system, a personal crisis), the leader temporarily returns to a more directive or supportive style.</li>
<li><strong>Agree the diagnosis with the person.</strong> In SLII, partnering for performance means discussing development level and style openly rather than labelling people.</li>
</ol>
<h3>Why it is popular — and what the research says</h3>
<p>The model is practical, easy to teach, prescriptive (it tells you what to do) and emphasises flexibility and the development of people. However, Northouse and other reviewers note that it has <strong>very little published empirical support</strong>. Early tests (for example Vecchio, 1987) found that the model's predictions held mainly for newly hired employees, who benefited from more structure; later tests of the revised model found little support for the claim that matching style to development level improves outcomes. Further criticisms:</p>
<ul>
<li>How competence and commitment combine into four levels is not clearly justified; in particular, why commitment should fall at D2 and then rise again is unexplained.</li>
<li>Demographic factors (education, experience, age, gender) and culture are not addressed, although they affect preferred styles.</li>
<li>It is unclear how to lead a whole group whose members are at different levels.</li>
<li>Training questionnaires tend to reward the "right" answers built into the model, so they can confirm the model rather than test it.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — limited</span> Use SLII as a helpful coaching language — diagnose, match, adjust — but do not present it as a scientifically validated theory. When your judgement and the model disagree, talk to the person.</div>`,
    `<span class="eyebrow">LDS301 · Phần 3 · Bài 3.1</span>
<h2>Lãnh đạo tình huống: Hersey–Blanchard và SLII</h2>
<p class="lead">Lãnh đạo tình huống có lẽ là mô hình lãnh đạo được dùng nhiều nhất trong đào tạo doanh nghiệp. Lời hứa của nó rất trực quan: chẩn đoán mức sẵn sàng của một người với một nhiệm vụ cụ thể, rồi trao cho người đó liều lượng chỉ đạo và hỗ trợ phù hợp.</p>
<h3>Nguồn gốc</h3>
<p>Hersey và Blanchard giới thiệu "lý thuyết vòng đời của lãnh đạo" năm 1969, về sau gọi là Lãnh đạo tình huống. Phiên bản của họ dùng <em>mức sẵn sàng</em> của người đi theo (trước đó gọi là "mức trưởng thành", R1–R4) và bốn phong cách: ra lệnh (telling), thuyết phục (selling), cùng tham gia (participating) và uỷ thác (delegating). Blanchard và cộng sự sau đó chỉnh sửa thành <strong>SLII</strong>, với các thuật ngữ dùng dưới đây.</p>
<h3>Hai chiều hành vi lãnh đạo</h3>
<ul>
<li><strong>Hành vi chỉ đạo</strong> — giao tiếp một chiều giúp người khác đạt mục tiêu: đưa ra chỉ dẫn, đặt mục tiêu và phương pháp, xác định vai trò, làm mẫu.</li>
<li><strong>Hành vi hỗ trợ</strong> — giao tiếp hai chiều giúp người khác thấy thoải mái về bản thân, đồng nghiệp và tình huống: hỏi ý kiến, lắng nghe, khen ngợi, chia sẻ thông tin về bản thân.</li>
</ul>
<h3>Bốn phong cách và bốn mức phát triển</h3>
<table>
<tr><th>Mức phát triển của người đi theo (với nhiệm vụ này)</th><th>Phong cách phù hợp</th><th>Hành vi của người lãnh đạo</th></tr>
<tr><td><strong>D1</strong> — năng lực thấp, cam kết cao ("người mới đầy nhiệt huyết")</td><td><strong>S1 Chỉ đạo</strong></td><td>Chỉ đạo cao, hỗ trợ thấp: mục tiêu rõ, hướng dẫn từng bước, giám sát sát sao</td></tr>
<tr><td><strong>D2</strong> — có chút năng lực, cam kết thấp ("người học bị vỡ mộng")</td><td><strong>S2 Huấn luyện (coaching)</strong></td><td>Chỉ đạo cao, hỗ trợ cao: vẫn chỉ đạo nhưng giải thích lý do, hỏi ý tưởng, động viên</td></tr>
<tr><td><strong>D3</strong> — năng lực trung bình tới cao, cam kết thay đổi ("có năng lực nhưng dè dặt")</td><td><strong>S3 Hỗ trợ</strong></td><td>Hỗ trợ cao, chỉ đạo thấp: lắng nghe, tạo điều kiện giải quyết vấn đề, thể hiện niềm tin</td></tr>
<tr><td><strong>D4</strong> — năng lực cao, cam kết cao ("người tự lực thành đạt")</td><td><strong>S4 Uỷ thác</strong></td><td>Hỗ trợ thấp, chỉ đạo thấp: thống nhất mục tiêu rồi giao hẳn trách nhiệm</td></tr>
</table>
<h3>Nguyên tắc sử dụng mô hình</h3>
<ol>
<li><strong>Chẩn đoán theo nhiệm vụ, không theo con người.</strong> Một chuyên viên phân tích lâu năm có thể là D4 khi lập ngân sách và D1 khi đàm phán hợp đồng.</li>
<li><strong>Ghép phong cách với mức phát triển</strong> — và đi cùng người đó: khi người đó tiến bộ, trước tiên tăng hỗ trợ trong khi vẫn giữ chỉ đạo cao (S1→S2), sau đó giảm chỉ đạo (S2→S3), cuối cùng giảm hỗ trợ (S3→S4).</li>
<li><strong>Lùi lại khi kết quả giảm.</strong> Nếu một người D4 bắt đầu gặp khó (hệ thống mới, khủng hoảng cá nhân), người lãnh đạo tạm quay về phong cách chỉ đạo hoặc hỗ trợ nhiều hơn.</li>
<li><strong>Thống nhất chẩn đoán với chính người đó.</strong> Trong SLII, cùng nhau vì hiệu quả công việc nghĩa là trao đổi cởi mở về mức phát triển và phong cách thay vì dán nhãn con người.</li>
</ol>
<h3>Vì sao phổ biến — và nghiên cứu nói gì</h3>
<p>Mô hình thực tế, dễ dạy, có tính khuyến nghị (bảo bạn phải làm gì) và nhấn mạnh sự linh hoạt cũng như phát triển con người. Tuy nhiên, Northouse và các nhà tổng quan khác chỉ ra rằng nó có <strong>rất ít bằng chứng thực nghiệm được công bố</strong>. Các kiểm định ban đầu (ví dụ Vecchio, 1987) thấy dự báo của mô hình chủ yếu đúng với nhân viên mới tuyển, những người được lợi từ nhiều cấu trúc hơn; các kiểm định sau đối với mô hình sửa đổi ít ủng hộ nhận định rằng ghép phong cách theo mức phát triển giúp cải thiện kết quả. Các phê bình khác:</p>
<ul>
<li>Cách năng lực và cam kết kết hợp thành bốn mức chưa được lý giải rõ; đặc biệt, vì sao cam kết giảm ở D2 rồi lại tăng thì không được giải thích.</li>
<li>Các yếu tố nhân khẩu học (học vấn, kinh nghiệm, tuổi, giới) và văn hoá không được xét tới, dù chúng ảnh hưởng tới phong cách được ưa thích.</li>
<li>Không rõ nên lãnh đạo cả một nhóm mà các thành viên ở những mức khác nhau như thế nào.</li>
<li>Các bảng hỏi dùng trong đào tạo có xu hướng chấm điểm theo "đáp án đúng" gài sẵn trong mô hình, nên chúng xác nhận mô hình hơn là kiểm định nó.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — hạn chế</span> Hãy dùng SLII như một ngôn ngữ huấn luyện (coaching) hữu ích — chẩn đoán, ghép, điều chỉnh — nhưng đừng trình bày nó như một lý thuyết đã được kiểm chứng khoa học. Khi phán đoán của bạn và mô hình khác nhau, hãy nói chuyện với chính người đó.</div>`,
  ]]);

const c8 = doc('lds301-3-2-lmx-followership', '3.2 — Leader–member exchange and followership|||3.2 — Trao đổi lãnh đạo – thành viên (LMX) và vai trò người đi theo',
  'LMX: từ liên kết cặp dọc tới nhóm trong – nhóm ngoài, ba giai đoạn "tạo dựng lãnh đạo" (người lạ, người quen, đối tác trưởng thành), kết quả của LMX chất lượng cao, vấn đề công bằng, cách đo; năm kiểu người đi theo của Kelley; mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 3 · Lesson 3.2</span>
<h2>Leader–member exchange and followership</h2>
<p class="lead">Most theories treat "the followers" as one group. Leader–member exchange (LMX) theory starts from a simple observation: a leader has a <em>different</em> relationship with each follower — and the quality of each relationship shapes that person's work.</p>
<h3>From vertical dyads to in-groups and out-groups</h3>
<p>Early work (Dansereau, Graen and Haga, 1975) studied the vertical dyad — one leader, one follower. It found two kinds of relationships:</p>
<table>
<tr><th></th><th>In-group</th><th>Out-group</th></tr>
<tr><td>Basis</td><td>Expanded, negotiated role responsibilities beyond the job description</td><td>Formal employment contract and defined job</td></tr>
<tr><td>What members give</td><td>Extra effort, initiative, loyalty</td><td>What is required — "a fair day's work"</td></tr>
<tr><td>What they receive</td><td>More information, influence, confidence and attention</td><td>Standard treatment</td></tr>
</table>
<h3>Leadership making: three phases (Graen &amp; Uhl-Bien)</h3>
<p>Later LMX research shifted from describing differences to prescribing how leaders can build high-quality exchanges with <strong>all</strong> followers:</p>
<pre><code class="language-text">Phase                  Roles        Influence    Exchange          Interests
1 Stranger             Scripted     One-way      Low quality       Self
2 Acquaintance         Tested       Mixed        Medium quality    Self and other
3 Mature partnership   Negotiated   Reciprocal   High quality      Group</code></pre>
<p>Relationships move forward when one side makes an offer — a challenging assignment, a candid piece of information, help in a difficult moment — and the other side responds with trust and effort.</p>
<h3>Why the quality of exchange matters</h3>
<p>Meta-analyses (for example Gerstner and Day, 1997; Dulebohn and colleagues, 2012) associate high-quality LMX with better performance ratings, higher job satisfaction and organisational commitment, more citizenship behaviour and lower turnover intentions. These results are largely correlational: good performers may also earn better relationships.</p>
<h3>Measurement and fairness</h3>
<p>LMX is usually measured with short multi-item scales (the best known has seven items) covering mutual respect, trust and obligation; we do not reproduce the items here. The biggest criticism is <strong>fairness</strong>: visible in-groups and out-groups can look like favouritism and damage the whole team's sense of justice. The leadership-making prescription answers this by asking leaders to <em>offer</em> high-quality relationships to everyone, even if not everyone accepts.</p>
<h3>Followership</h3>
<p>Leadership needs followers, and followers are not passive. Kelley (1992) classified followers on two dimensions — <strong>independent, critical thinking</strong> and <strong>active engagement</strong>:</p>
<table>
<tr><th>Style</th><th>Critical thinking</th><th>Engagement</th><th>Description</th></tr>
<tr><td>Exemplary</td><td>High</td><td>High</td><td>Thinks for themselves, contributes actively, challenges constructively</td></tr>
<tr><td>Alienated</td><td>High</td><td>Low</td><td>Critical but disengaged, often cynical</td></tr>
<tr><td>Conformist</td><td>Low</td><td>High</td><td>Active but uncritical — a "yes" person</td></tr>
<tr><td>Passive</td><td>Low</td><td>Low</td><td>Waits for instructions, needs close supervision</td></tr>
<tr><td>Pragmatist</td><td>Middle</td><td>Middle</td><td>Adjusts to what seems safe; rarely takes a strong position</td></tr>
</table>
<div class="callout"><span class="badge">Evidence check — strong for correlates</span> The link between LMX quality and positive outcomes is one of the best-documented findings in the field. The causal direction, the measurement of LMX and the practical steps for building partnerships with everyone are less well established. Followership typologies are mainly conceptual.</div>`,
    `<span class="eyebrow">LDS301 · Phần 3 · Bài 3.2</span>
<h2>Trao đổi lãnh đạo – thành viên (LMX) và vai trò người đi theo</h2>
<p class="lead">Phần lớn lý thuyết coi "người đi theo" là một nhóm đồng nhất. Lý thuyết trao đổi lãnh đạo – thành viên (LMX) bắt đầu từ một quan sát đơn giản: người lãnh đạo có mối quan hệ <em>khác nhau</em> với từng người đi theo — và chất lượng của mỗi mối quan hệ định hình công việc của người đó.</p>
<h3>Từ cặp dọc tới nhóm trong và nhóm ngoài</h3>
<p>Các nghiên cứu ban đầu (Dansereau, Graen và Haga, 1975) xem xét cặp dọc — một người lãnh đạo, một người đi theo — và thấy hai kiểu quan hệ:</p>
<table>
<tr><th></th><th>Nhóm trong</th><th>Nhóm ngoài</th></tr>
<tr><td>Cơ sở</td><td>Trách nhiệm vai trò mở rộng, được thương lượng, vượt ngoài bản mô tả công việc</td><td>Hợp đồng lao động chính thức và công việc được xác định</td></tr>
<tr><td>Thành viên đóng góp</td><td>Nỗ lực thêm, sáng kiến, lòng trung thành</td><td>Những gì được yêu cầu — "làm đủ phần việc"</td></tr>
<tr><td>Thành viên nhận được</td><td>Nhiều thông tin, ảnh hưởng, sự tin tưởng và quan tâm hơn</td><td>Đối xử theo tiêu chuẩn</td></tr>
</table>
<h3>Tạo dựng lãnh đạo: ba giai đoạn (Graen &amp; Uhl-Bien)</h3>
<p>Nghiên cứu LMX về sau chuyển từ mô tả khác biệt sang khuyến nghị cách người lãnh đạo xây dựng quan hệ trao đổi chất lượng cao với <strong>mọi</strong> người đi theo:</p>
<pre><code class="language-text">Giai đoạn                Vai trò             Ảnh hưởng   Trao đổi                Lợi ích hướng tới
1 Người lạ               Theo kịch bản       Một chiều   Chất lượng thấp         Bản thân
2 Người quen             Được thử nghiệm     Pha trộn    Chất lượng trung bình   Bản thân và người khác
3 Đối tác trưởng thành   Được thương lượng   Hai chiều   Chất lượng cao          Tập thể</code></pre>
<p>Quan hệ tiến lên khi một bên đưa ra lời mời — một nhiệm vụ thử thách, một thông tin thẳng thắn, sự giúp đỡ lúc khó khăn — và bên kia đáp lại bằng lòng tin và nỗ lực.</p>
<h3>Vì sao chất lượng trao đổi quan trọng</h3>
<p>Các phân tích tổng hợp (ví dụ Gerstner và Day, 1997; Dulebohn và cộng sự, 2012) gắn LMX chất lượng cao với đánh giá thành tích tốt hơn, sự hài lòng với công việc và gắn bó với tổ chức cao hơn, nhiều hành vi công dân tổ chức hơn và ý định nghỉ việc thấp hơn. Các kết quả này phần lớn là tương quan: người làm tốt cũng có thể giành được quan hệ tốt hơn.</p>
<h3>Đo lường và công bằng</h3>
<p>LMX thường được đo bằng thang ngắn nhiều câu (thang nổi tiếng nhất có bảy câu) bao quát sự tôn trọng, lòng tin và nghĩa vụ lẫn nhau; ở đây không chép lại các câu hỏi. Phê bình lớn nhất là về <strong>công bằng</strong>: nhóm trong và nhóm ngoài lộ rõ có thể trông như thiên vị và làm tổn hại cảm nhận về công bằng của cả đội. Khuyến nghị tạo dựng lãnh đạo trả lời điều này bằng cách yêu cầu người lãnh đạo <em>mời gọi</em> quan hệ chất lượng cao với tất cả mọi người, dù không phải ai cũng đón nhận.</p>
<h3>Vai trò người đi theo</h3>
<p>Lãnh đạo cần người đi theo, và người đi theo không thụ động. Kelley (1992) phân loại người đi theo theo hai chiều — <strong>tư duy độc lập, phản biện</strong> và <strong>mức độ tham gia chủ động</strong>:</p>
<table>
<tr><th>Kiểu</th><th>Tư duy phản biện</th><th>Tham gia</th><th>Mô tả</th></tr>
<tr><td>Mẫu mực</td><td>Cao</td><td>Cao</td><td>Tự suy nghĩ, đóng góp tích cực, phản biện mang tính xây dựng</td></tr>
<tr><td>Xa cách</td><td>Cao</td><td>Thấp</td><td>Có phản biện nhưng không tham gia, thường hoài nghi</td></tr>
<tr><td>Chiều theo</td><td>Thấp</td><td>Cao</td><td>Tích cực nhưng thiếu phản biện — người luôn "vâng dạ"</td></tr>
<tr><td>Thụ động</td><td>Thấp</td><td>Thấp</td><td>Chờ chỉ thị, cần giám sát sát sao</td></tr>
<tr><td>Thực dụng</td><td>Trung bình</td><td>Trung bình</td><td>Điều chỉnh theo điều có vẻ an toàn; hiếm khi có lập trường rõ</td></tr>
</table>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — mạnh về các tương quan</span> Mối liên hệ giữa chất lượng LMX và các kết quả tích cực là một trong những phát hiện được ghi nhận tốt nhất của lĩnh vực. Chiều nhân quả, cách đo LMX và các bước thực hành để xây dựng quan hệ đối tác với mọi người thì kém vững chắc hơn. Các cách phân loại người đi theo chủ yếu mang tính khái niệm.</div>`,
  ]]);

const c9 = doc('lds301-3-3-team-leadership', '3.3 — Team leadership: Hill’s model|||3.3 — Lãnh đạo đội nhóm: mô hình của Hill',
  'Hiệu quả đội nhóm (thành tích và phát triển), mô hình lãnh đạo đội nhóm của Hill: ba quyết định lãnh đạo, hành động nội bộ nhiệm vụ, nội bộ quan hệ và bên ngoài; tám đặc điểm đội xuất sắc (Larson & LaFasto); nhắc lại ngắn các giai đoạn Tuckman; mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 3 · Lesson 3.3</span>
<h2>Team leadership: Hill's model</h2>
<p class="lead">Much organisational work is done by teams. Team leadership theory asks a practical question: what should the leader pay attention to, and when should he or she intervene, to make a team effective?</p>
<h3>Two meanings of team effectiveness</h3>
<ul>
<li><strong>Team performance</strong> — the quality of the team's output: goals met, customers served, deadlines kept.</li>
<li><strong>Team development</strong> — the team's cohesiveness and its ability to keep working well together over time.</li>
</ul>
<h3>Leadership decisions in Hill's model</h3>
<p>Hill's model (presented in Northouse) treats the leader's main job as <strong>monitoring</strong> the team and <strong>taking action</strong> when needed. The leader makes three decisions:</p>
<ol>
<li>Should I keep monitoring, or take action now?</li>
<li>If I act, is the problem about the <strong>task</strong> or about <strong>relationships</strong>?</li>
<li>Is the intervention needed <strong>inside</strong> the team or in its <strong>external environment</strong>?</li>
</ol>
<h3>Three families of leader actions</h3>
<table>
<tr><th>Internal — task</th><th>Internal — relational</th><th>External — environmental</th></tr>
<tr><td>Goal focusing (clarify goals, gain agreement)</td><td>Coaching members in interpersonal skills</td><td>Networking and forming alliances</td></tr>
<tr><td>Structuring for results (plan, organise, clarify roles, delegate)</td><td>Collaborating (include and involve members)</td><td>Advocating for and representing the team</td></tr>
<tr><td>Facilitating decisions (inform, coordinate, mediate, synthesise)</td><td>Managing conflict and power issues</td><td>Negotiating upward for resources and support</td></tr>
<tr><td>Training members in task skills</td><td>Building commitment and team spirit</td><td>Buffering members from distractions</td></tr>
<tr><td>Maintaining standards of excellence</td><td>Satisfying individual needs (trust, support)</td><td>Assessing environmental indicators of effectiveness</td></tr>
<tr><td></td><td>Modelling ethical and principled practices</td><td>Sharing relevant external information with the team</td></tr>
</table>
<h3>What excellent teams share</h3>
<p>Larson and LaFasto identified eight characteristics that the model uses as a diagnostic checklist: a <strong>clear, elevating goal</strong>; a <strong>results-driven structure</strong>; <strong>competent members</strong>; <strong>unified commitment</strong>; a <strong>collaborative climate</strong>; <strong>standards of excellence</strong>; <strong>external support and recognition</strong>; and <strong>principled leadership</strong>. Hackman's related work stresses conditions the leader can create: a real team, a compelling direction, an enabling structure, a supportive context and expert coaching.</p>
<h3>A reminder on team development</h3>
<p>You met Tuckman's stages in OBE102c: forming, storming, norming, performing, and later adjourning. In Hill's terms, the balance of useful actions shifts across stages — more goal focusing and structuring early, more conflict management during storming, more buffering and delegation once the team performs.</p>
<h3>Strengths and limits</h3>
<ul>
<li><strong>Strengths:</strong> designed for real teams; gives the leader a cognitive map for diagnosing problems; recognises that leadership functions can be shared by members.</li>
<li><strong>Limits:</strong> complex and not fully tested as a whole; offers a menu of actions more than precise guidance on which to choose; does not address the skills a leader needs to carry them out.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — moderate for functions, limited for the model</span> Meta-analytic work on teams (for example Burke and colleagues, 2006) links both task-focused and person-focused leadership behaviours to team effectiveness. Hill's model as a whole is a useful synthesis, but it has not been tested as a complete predictive theory.</div>`,
    `<span class="eyebrow">LDS301 · Phần 3 · Bài 3.3</span>
<h2>Lãnh đạo đội nhóm: mô hình của Hill</h2>
<p class="lead">Rất nhiều công việc trong tổ chức do các đội nhóm thực hiện. Lý thuyết lãnh đạo đội nhóm đặt một câu hỏi thực tế: người lãnh đạo nên chú ý tới điều gì, và khi nào nên can thiệp, để đội làm việc hiệu quả?</p>
<h3>Hai nghĩa của hiệu quả đội nhóm</h3>
<ul>
<li><strong>Thành tích của đội</strong> — chất lượng đầu ra: đạt mục tiêu, phục vụ khách hàng, đúng hạn.</li>
<li><strong>Sự phát triển của đội</strong> — độ gắn kết và khả năng tiếp tục làm việc tốt cùng nhau theo thời gian.</li>
</ul>
<h3>Các quyết định lãnh đạo trong mô hình của Hill</h3>
<p>Mô hình của Hill (được trình bày trong sách của Northouse) coi việc chính của người lãnh đạo là <strong>theo dõi</strong> đội và <strong>hành động</strong> khi cần. Người lãnh đạo đưa ra ba quyết định:</p>
<ol>
<li>Tôi nên tiếp tục theo dõi hay hành động ngay?</li>
<li>Nếu hành động, vấn đề thuộc về <strong>nhiệm vụ</strong> hay <strong>quan hệ</strong>?</li>
<li>Cần can thiệp <strong>bên trong</strong> đội hay ở <strong>môi trường bên ngoài</strong>?</li>
</ol>
<h3>Ba nhóm hành động của người lãnh đạo</h3>
<table>
<tr><th>Nội bộ — nhiệm vụ</th><th>Nội bộ — quan hệ</th><th>Bên ngoài — môi trường</th></tr>
<tr><td>Tập trung mục tiêu (làm rõ mục tiêu, tạo đồng thuận)</td><td>Huấn luyện (coaching) kỹ năng giao tiếp, ứng xử cho thành viên</td><td>Kết nối và xây dựng liên minh</td></tr>
<tr><td>Tổ chức để ra kết quả (lập kế hoạch, sắp xếp, làm rõ vai trò, uỷ quyền)</td><td>Hợp tác (lôi cuốn, để thành viên cùng tham gia)</td><td>Bênh vực và đại diện cho đội</td></tr>
<tr><td>Tạo điều kiện ra quyết định (thông tin, điều phối, hoà giải, tổng hợp)</td><td>Quản lý xung đột và vấn đề quyền lực</td><td>Thương lượng với cấp trên về nguồn lực và hỗ trợ</td></tr>
<tr><td>Đào tạo kỹ năng nhiệm vụ cho thành viên</td><td>Xây dựng cam kết và tinh thần đồng đội</td><td>Che chắn thành viên khỏi những thứ gây xao nhãng</td></tr>
<tr><td>Duy trì tiêu chuẩn xuất sắc</td><td>Đáp ứng nhu cầu cá nhân (lòng tin, hỗ trợ)</td><td>Đánh giá các chỉ báo hiệu quả từ môi trường</td></tr>
<tr><td></td><td>Làm gương về cách hành xử có đạo đức, có nguyên tắc</td><td>Chia sẻ thông tin bên ngoài có liên quan cho đội</td></tr>
</table>
<h3>Điểm chung của những đội xuất sắc</h3>
<p>Larson và LaFasto xác định tám đặc điểm mà mô hình dùng như danh mục chẩn đoán: <strong>mục tiêu rõ ràng, nâng tầm</strong>; <strong>cơ cấu hướng tới kết quả</strong>; <strong>thành viên có năng lực</strong>; <strong>cam kết thống nhất</strong>; <strong>bầu không khí hợp tác</strong>; <strong>tiêu chuẩn xuất sắc</strong>; <strong>sự hỗ trợ và ghi nhận từ bên ngoài</strong>; và <strong>lãnh đạo có nguyên tắc</strong>. Công trình liên quan của Hackman nhấn mạnh những điều kiện người lãnh đạo có thể tạo ra: một đội thực sự, một phương hướng thuyết phục, một cơ cấu tạo điều kiện, một bối cảnh hỗ trợ và sự huấn luyện (coaching) có chuyên môn.</p>
<h3>Nhắc lại về sự phát triển của đội</h3>
<p>Bạn đã gặp các giai đoạn của Tuckman trong OBE102c: hình thành, xung đột, định chuẩn, hoạt động hiệu quả, và về sau thêm giai đoạn kết thúc. Theo cách nhìn của Hill, cán cân các hành động hữu ích dịch chuyển qua từng giai đoạn — đầu tiên cần tập trung mục tiêu và tổ chức nhiều hơn, giai đoạn xung đột cần quản lý mâu thuẫn nhiều hơn, còn khi đội đã vận hành tốt thì cần che chắn và uỷ quyền nhiều hơn.</p>
<h3>Điểm mạnh và hạn chế</h3>
<ul>
<li><strong>Điểm mạnh:</strong> được thiết kế cho đội nhóm thực; cho người lãnh đạo một bản đồ tư duy để chẩn đoán vấn đề; thừa nhận các chức năng lãnh đạo có thể được chia sẻ giữa các thành viên.</li>
<li><strong>Hạn chế:</strong> phức tạp và chưa được kiểm định đầy đủ như một tổng thể; đưa ra một thực đơn hành động hơn là hướng dẫn chính xác nên chọn cái nào; không bàn tới kỹ năng người lãnh đạo cần để thực hiện các hành động đó.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình về các chức năng, hạn chế về mô hình</span> Các nghiên cứu phân tích tổng hợp về đội nhóm (ví dụ Burke và cộng sự, 2006) gắn cả hành vi lãnh đạo hướng nhiệm vụ lẫn hướng con người với hiệu quả của đội. Mô hình của Hill như một tổng thể là một bản tổng hợp hữu ích, nhưng chưa được kiểm định như một lý thuyết dự báo hoàn chỉnh.</div>`,
  ]]);

const c9e = doc('lds301-3-4-exercise', 'Exercise 2 — SLII: diagnose four team members|||Bài tập 2 — SLII: chẩn đoán bốn thành viên',
  'Bài tập tình huống giả định ở một công ty tiếp thị số hư cấu: chẩn đoán mức phát triển D1–D4 của bốn nhân viên với từng nhiệm vụ cụ thể, chọn phong cách S1–S4, nêu hành vi cụ thể của người lãnh đạo, và xử lý trường hợp một người có hai mức phát triển cho hai nhiệm vụ; kèm lời giải.',
  [[
    `<span class="eyebrow">LDS301 · Part 3 · Exercise</span>
<h2>Exercise 2 — one leader, four development levels</h2>
<div class="callout"><span class="badge">Problem</span> You lead a five-person team at a fictional digital-marketing agency (all people and facts are invented).<br><br>
<strong>Lan</strong> joined two weeks ago straight from university. This month she must prepare the weekly ad-performance report for the first time. She has never used the reporting tool, but she is excited and keeps asking for more work.<br>
<strong>Minh</strong> has been learning the new customer-relationship-management (CRM) system for four months. He can do the basic steps, but he keeps making data-entry mistakes and recently said: "Maybe this system just isn't for me."<br>
<strong>Ha</strong> has managed client accounts for five years and runs client meetings very well. She must now present the quarterly review to your largest client alone — the first time since a difficult meeting with that client last year. She is hesitant and keeps asking whether you think she is ready.<br>
<strong>Tuan</strong> is a senior analyst who built the team's budget model and enjoys improving it. You also want him to lead a vendor contract negotiation next month — something he has never done, though he says he is keen to try.<br><br>
(a) Diagnose the development level for each person and task. (b) Choose the matching SLII style and describe two concrete leader behaviours for each. (c) What does Tuan's case show about the model?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Person / task                 Competence       Commitment     Level  Style
Lan  — weekly ad report       low              high           D1     S1 Directing
Minh — CRM data entry         some (low-mod.)  low            D2     S2 Coaching
Ha   — solo client review     high             variable/low   D3     S3 Supporting
Tuan — budget model           high             high           D4     S4 Delegating
Tuan — vendor negotiation     low              high           D1     S1 Directing</code></pre>
<table>
<tr><th>Person</th><th>Concrete behaviours</th></tr>
<tr><td>Lan (S1)</td><td>Give a report template and a worked example; set a clear deadline and review her first two drafts line by line</td></tr>
<tr><td>Minh (S2)</td><td>Keep showing the correct procedure and checking entries, but explain why each field matters; ask which step confuses him and praise each week with fewer errors</td></tr>
<tr><td>Ha (S3)</td><td>Ask how she plans to handle the client's likely objections and listen; tell her specifically why you trust her, and offer a rehearsal only if she wants one</td></tr>
<tr><td>Tuan (S4 / S1)</td><td>Budget: agree the outcome and the deadline, then step back. Negotiation: brief him on objectives, walk-away limits and approval rules; prepare the first session together</td></tr>
</table>
<p><strong>Why:</strong> Lan's enthusiasm is high but her skill is not yet there, so she needs structure more than encouragement. Minh has partial skill but his commitment has dropped; direction alone would feel like criticism, so he needs direction <em>and</em> support. Ha has the skill — what she lacks is confidence on this specific task, so telling her how to do it would signal distrust; she needs support. Tuan shows the model's central rule: development level belongs to a <strong>task</strong>, not to a person, so the same leader may use S4 and S1 with one employee in the same week. Remember, too, that SLII's empirical support is limited: the diagnosis above is a starting hypothesis to check in conversation with each person, not a verdict.</p>`,
    `<span class="eyebrow">LDS301 · Phần 3 · Bài tập</span>
<h2>Bài tập 2 — một người lãnh đạo, bốn mức phát triển</h2>
<div class="callout"><span class="badge">Đề</span> Bạn phụ trách một đội năm người ở một công ty tiếp thị số hư cấu (mọi nhân vật và tình tiết đều giả định).<br><br>
<strong>Lan</strong> mới vào làm hai tuần, vừa tốt nghiệp đại học. Tháng này cô lần đầu phải lập báo cáo hiệu quả quảng cáo hằng tuần. Cô chưa từng dùng công cụ báo cáo nhưng rất hào hứng và liên tục xin thêm việc.<br>
<strong>Minh</strong> đã học hệ thống quản lý quan hệ khách hàng (CRM) mới được bốn tháng. Anh làm được các bước cơ bản nhưng liên tục nhập sai dữ liệu và gần đây nói: "Có lẽ hệ thống này không hợp với mình."<br>
<strong>Hà</strong> đã quản lý tài khoản khách hàng năm năm và điều hành các buổi họp với khách rất tốt. Giờ chị phải một mình trình bày báo cáo quý cho khách hàng lớn nhất — lần đầu kể từ một buổi họp khó khăn với chính khách hàng này năm ngoái. Chị do dự và liên tục hỏi bạn có nghĩ chị đã sẵn sàng chưa.<br>
<strong>Tuấn</strong> là chuyên viên phân tích lâu năm, tự xây mô hình ngân sách của đội và thích cải tiến nó. Bạn cũng muốn anh dẫn dắt một cuộc đàm phán hợp đồng với nhà cung cấp vào tháng sau — việc anh chưa từng làm, dù anh nói rất muốn thử.<br><br>
(a) Chẩn đoán mức phát triển của từng người với từng nhiệm vụ. (b) Chọn phong cách SLII phù hợp và mô tả hai hành vi cụ thể của người lãnh đạo cho mỗi người. (c) Trường hợp của Tuấn cho thấy điều gì về mô hình?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Người / nhiệm vụ              Năng lực             Cam kết          Mức   Phong cách
Lan  — báo cáo QC hằng tuần   thấp                 cao              D1    S1 Chỉ đạo
Minh — nhập dữ liệu CRM       có chút (thấp–vừa)   thấp             D2    S2 Huấn luyện
Hà   — tự trình bày báo cáo   cao                  thay đổi/thấp    D3    S3 Hỗ trợ
Tuấn — mô hình ngân sách      cao                  cao              D4    S4 Uỷ thác
Tuấn — đàm phán nhà cung cấp  thấp                 cao              D1    S1 Chỉ đạo</code></pre>
<table>
<tr><th>Người</th><th>Hành vi cụ thể</th></tr>
<tr><td>Lan (S1)</td><td>Đưa biểu mẫu báo cáo và một bản mẫu đã làm sẵn; đặt hạn chót rõ ràng và duyệt từng dòng hai bản nháp đầu tiên của cô</td></tr>
<tr><td>Minh (S2)</td><td>Tiếp tục chỉ lại quy trình đúng và kiểm tra dữ liệu nhập, nhưng giải thích vì sao từng trường thông tin quan trọng; hỏi bước nào làm anh bối rối và khen mỗi tuần khi lỗi giảm</td></tr>
<tr><td>Hà (S3)</td><td>Hỏi chị định xử lý những phản bác có thể có của khách hàng thế nào và lắng nghe; nói cụ thể vì sao bạn tin chị, và chỉ đề nghị tập dượt nếu chị muốn</td></tr>
<tr><td>Tuấn (S4 / S1)</td><td>Ngân sách: thống nhất kết quả và hạn chót rồi lùi lại. Đàm phán: trao đổi rõ mục tiêu, giới hạn rút lui và quy định phê duyệt; cùng chuẩn bị buổi đầu tiên</td></tr>
</table>
<p><strong>Vì sao:</strong> Lan rất nhiệt tình nhưng kỹ năng chưa có, nên cô cần cấu trúc hơn là động viên. Minh có một phần kỹ năng nhưng cam kết đã giảm; chỉ chỉ đạo thôi sẽ giống như bị phê bình, nên anh cần cả chỉ đạo <em>lẫn</em> hỗ trợ. Hà có kỹ năng — thứ chị thiếu là sự tự tin với nhiệm vụ cụ thể này, nên bảo chị phải làm thế nào sẽ phát đi tín hiệu thiếu tin tưởng; chị cần được hỗ trợ. Tuấn cho thấy nguyên tắc trung tâm của mô hình: mức phát triển gắn với <strong>nhiệm vụ</strong>, không gắn với con người, nên cùng một người lãnh đạo có thể dùng S4 và S1 với một nhân viên trong cùng một tuần. Cũng nhớ rằng bằng chứng thực nghiệm cho SLII còn hạn chế: chẩn đoán trên là giả thuyết ban đầu cần kiểm lại qua trao đổi với từng người, không phải một phán quyết.</p>`,
  ]]);

const c9q = quiz('lds301-quiz-3', 'Quiz 3 — Situational, LMX and team leadership|||Quiz 3 — Lãnh đạo tình huống, LMX và đội nhóm', [
  { id: 'q1', question: 'In SLII, a follower with some competence but low commitment on a task (D2) is best matched with…|||Trong SLII, người đi theo có chút năng lực nhưng cam kết thấp với một nhiệm vụ (D2) phù hợp nhất với phong cách…', options: ['S2 Coaching: high directive, high supportive|||S2 Huấn luyện: chỉ đạo cao, hỗ trợ cao', 'S4 Delegating: low directive, low supportive|||S4 Uỷ thác: chỉ đạo thấp, hỗ trợ thấp', 'S3 Supporting: low directive, high supportive|||S3 Hỗ trợ: chỉ đạo thấp, hỗ trợ cao', 'S1 Directing: high directive, low supportive|||S1 Chỉ đạo: chỉ đạo cao, hỗ trợ thấp'], correctIndex: 0, explanation: 'D2 still needs direction because competence is incomplete, and needs support because commitment has dropped — the coaching style provides both.|||D2 vẫn cần chỉ đạo vì năng lực chưa đủ, và cần hỗ trợ vì cam kết đã giảm — phong cách huấn luyện (coaching) đáp ứng cả hai.' },
  { id: 'q2', question: 'Which statement best describes the empirical status of situational leadership (SLII)?|||Nhận định nào mô tả đúng nhất tình trạng bằng chứng thực nghiệm của lãnh đạo tình huống (SLII)?', options: ['It is supported by many meta-analyses and is the best-validated leadership theory|||Được nhiều phân tích tổng hợp ủng hộ và là lý thuyết lãnh đạo được kiểm chứng tốt nhất', 'It is widely used in training but has little published empirical support|||Được dùng rộng rãi trong đào tạo nhưng có rất ít bằng chứng thực nghiệm được công bố', 'It has been proven false and is no longer taught|||Đã bị chứng minh là sai và không còn được giảng dạy', 'It is supported only in military samples|||Chỉ được ủng hộ trong các mẫu quân đội'], correctIndex: 1, explanation: 'SLII is popular and practical, but reviewers note very little research support; early tests supported it mainly for newly hired employees.|||SLII phổ biến và thực tế, nhưng các nhà tổng quan chỉ ra rất ít bằng chứng nghiên cứu; các kiểm định ban đầu chủ yếu ủng hộ nó với nhân viên mới tuyển.' },
  { id: 'q3', question: 'In LMX theory, what distinguishes in-group members from out-group members?|||Trong lý thuyết LMX, điều gì phân biệt thành viên nhóm trong với nhóm ngoài?', options: ['In-group members have longer employment contracts|||Thành viên nhóm trong có hợp đồng lao động dài hơn', 'In-group members are always the highest performers|||Thành viên nhóm trong luôn là người có thành tích cao nhất', 'In-group members work in the same location as the leader|||Thành viên nhóm trong làm việc cùng địa điểm với người lãnh đạo', 'In-group members have expanded, negotiated roles beyond the formal job|||Thành viên nhóm trong có vai trò mở rộng, được thương lượng, vượt ngoài công việc chính thức'], correctIndex: 3, explanation: 'In-group relationships rest on negotiated extra responsibilities and mutual trust; out-group relationships stay within the formal contract.|||Quan hệ nhóm trong dựa trên trách nhiệm mở rộng được thương lượng và lòng tin lẫn nhau; quan hệ nhóm ngoài chỉ gói gọn trong hợp đồng chính thức.' },
]);

const c10 = doc('lds301-4-1-transformational', '4.1 — Transformational and transactional leadership|||4.1 — Lãnh đạo chuyển đổi và lãnh đạo giao dịch',
  'Burns: lãnh đạo chuyển đổi và giao dịch; Bass và mô hình toàn dải (Full Range Leadership): bốn chữ I, thưởng theo kết quả, quản lý theo ngoại lệ chủ động và bị động, lãnh đạo tự do; hiệu ứng tăng cường; lãnh đạo lôi cuốn (House); năm thực hành của Kouzes & Posner; cấu trúc bảng hỏi MLQ; phê bình và mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 4 · Lesson 4.1</span>
<h2>Transformational and transactional leadership</h2>
<p class="lead">Since the 1980s, transformational leadership has been the most researched approach in the field. It explains how some leaders move followers to perform <em>beyond</em> expectations — by changing what followers value and believe they can achieve, not only by exchanging rewards for effort.</p>
<h3>Burns: two kinds of leadership</h3>
<p>Studying political leaders, Burns (1978) contrasted <strong>transactional</strong> leadership — exchanges between leader and follower (votes for jobs, effort for pay) — with <strong>transforming</strong> leadership, in which leader and followers raise one another to higher levels of motivation and morality. Burns saw these as opposite ends of a continuum.</p>
<h3>Bass and the Full Range Leadership model</h3>
<p>Bass (1985) and later Bass and Avolio extended the idea to organisations and argued that transformational and transactional leadership are <strong>separate dimensions</strong>: the best leaders use both.</p>
<table>
<tr><th>Group</th><th>Factor</th><th>Meaning</th></tr>
<tr><td rowspan="4">Transformational (the "4 I's")</td><td>Idealised influence (charisma)</td><td>Acts as a strong role model with high ethical standards; followers identify with and trust the leader</td></tr>
<tr><td>Inspirational motivation</td><td>Communicates an appealing vision and high expectations; builds team spirit</td></tr>
<tr><td>Intellectual stimulation</td><td>Encourages followers to question assumptions, think creatively and solve problems in new ways</td></tr>
<tr><td>Individualised consideration</td><td>Attends to each follower's needs; coaches, mentors and delegates to develop people</td></tr>
<tr><td rowspan="3">Transactional</td><td>Contingent reward</td><td>Agrees what must be done and what the reward will be</td></tr>
<tr><td>Management by exception — active</td><td>Watches closely for mistakes and rule violations and corrects them</td></tr>
<tr><td>Management by exception — passive</td><td>Intervenes only after standards have not been met</td></tr>
<tr><td>Non-leadership</td><td>Laissez-faire</td><td>Avoids decisions, is absent when needed, abdicates responsibility</td></tr>
</table>
<p>The <strong>augmentation effect</strong> describes the model's central claim: transformational leadership adds to the effects of transactional leadership. Contingent reward produces expected performance; the 4 I's help produce performance beyond expectations.</p>
<h3>Measuring the full range</h3>
<p>The model is usually measured with the Multifactor Leadership Questionnaire (MLQ): a copyrighted instrument in which leaders rate themselves and followers, peers or supervisors rate how frequently the leader shows behaviours linked to each factor. We describe only its structure; the items are not reproduced.</p>
<h3>Charismatic leadership and other models</h3>
<ul>
<li><strong>Charismatic leadership</strong> (House, 1976): charismatic leaders are dominant, self-confident, want to influence others and hold strong values; they model behaviour, articulate goals, communicate high expectations and express confidence in followers.</li>
<li><strong>Kouzes and Posner's five practices</strong>: model the way, inspire a shared vision, challenge the process, enable others to act, and encourage the heart — a practitioner-oriented model based on leaders' descriptions of their personal best experiences.</li>
</ul>
<h3>Strengths and criticisms</h3>
<ul>
<li><strong>Strengths:</strong> very extensive research base; broad view that includes followers' needs and values; strong intuitive appeal; emphasises morality and development.</li>
<li><strong>Criticisms:</strong> the four I's overlap heavily and the concept lacks clear boundaries; research has often mixed <em>behaviours</em> with their <em>effects</em>; heavy reliance on questionnaires from the same source; a "heroic leader" bias that neglects followers and context; and the possibility of abuse — Bass later distinguished authentic transformational leadership from <strong>pseudo-transformational</strong> leadership, which uses the same influence for self-serving ends.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — strong, with caveats</span> Meta-analyses (for example Judge and Piccolo, 2004) find that transformational leadership and contingent reward are both strongly related to follower satisfaction, motivation and rated effectiveness, while laissez-faire is negatively related. Serious conceptual and measurement critiques (for example van Knippenberg and Sitkin, 2013) mean these results should be read as robust correlations, not proof of a precise causal model.</div>`,
    `<span class="eyebrow">LDS301 · Phần 4 · Bài 4.1</span>
<h2>Lãnh đạo chuyển đổi và lãnh đạo giao dịch</h2>
<p class="lead">Từ thập niên 1980, lãnh đạo chuyển đổi là cách tiếp cận được nghiên cứu nhiều nhất trong lĩnh vực. Nó giải thích vì sao một số người lãnh đạo đưa người đi theo làm việc <em>vượt</em> kỳ vọng — bằng cách thay đổi điều họ coi trọng và điều họ tin mình có thể đạt được, chứ không chỉ trao đổi phần thưởng lấy nỗ lực.</p>
<h3>Burns: hai kiểu lãnh đạo</h3>
<p>Khi nghiên cứu các nhà lãnh đạo chính trị, Burns (1978) đối lập lãnh đạo <strong>giao dịch</strong> — sự trao đổi giữa người lãnh đạo và người đi theo (lá phiếu đổi lấy việc làm, nỗ lực đổi lấy tiền lương) — với lãnh đạo <strong>chuyển hoá</strong>, trong đó người lãnh đạo và người đi theo cùng nâng nhau lên mức động lực và đạo đức cao hơn. Burns xem đây là hai đầu của một trục liên tục.</p>
<h3>Bass và mô hình lãnh đạo toàn dải</h3>
<p>Bass (1985) và sau đó Bass cùng Avolio mở rộng ý tưởng sang tổ chức và cho rằng lãnh đạo chuyển đổi và giao dịch là <strong>hai chiều riêng biệt</strong>: người lãnh đạo giỏi nhất dùng cả hai.</p>
<table>
<tr><th>Nhóm</th><th>Yếu tố</th><th>Ý nghĩa</th></tr>
<tr><td rowspan="4">Chuyển đổi ("4 chữ I")</td><td>Ảnh hưởng lý tưởng hoá (sức lôi cuốn)</td><td>Là tấm gương mạnh mẽ với chuẩn mực đạo đức cao; người đi theo đồng cảm và tin tưởng</td></tr>
<tr><td>Truyền cảm hứng</td><td>Truyền đạt một tầm nhìn hấp dẫn và kỳ vọng cao; xây dựng tinh thần đồng đội</td></tr>
<tr><td>Kích thích trí tuệ</td><td>Khuyến khích người đi theo chất vấn giả định, tư duy sáng tạo và giải quyết vấn đề theo cách mới</td></tr>
<tr><td>Quan tâm cá nhân</td><td>Chú ý tới nhu cầu của từng người; huấn luyện (coaching), kèm cặp (mentoring) và uỷ quyền để phát triển con người</td></tr>
<tr><td rowspan="3">Giao dịch</td><td>Thưởng theo kết quả</td><td>Thống nhất việc phải làm và phần thưởng tương ứng</td></tr>
<tr><td>Quản lý theo ngoại lệ — chủ động</td><td>Theo dõi sát sai sót và vi phạm quy định để sửa</td></tr>
<tr><td>Quản lý theo ngoại lệ — bị động</td><td>Chỉ can thiệp sau khi tiêu chuẩn đã không đạt</td></tr>
<tr><td>Phi lãnh đạo</td><td>Tự do (laissez-faire)</td><td>Né tránh quyết định, vắng mặt khi cần, thoái thác trách nhiệm</td></tr>
</table>
<p><strong>Hiệu ứng tăng cường</strong> mô tả nhận định trung tâm của mô hình: lãnh đạo chuyển đổi cộng thêm vào tác động của lãnh đạo giao dịch. Thưởng theo kết quả tạo ra thành tích như kỳ vọng; bốn chữ I giúp tạo ra thành tích vượt kỳ vọng.</p>
<h3>Đo lường toàn dải</h3>
<p>Mô hình thường được đo bằng Bảng hỏi lãnh đạo đa yếu tố (MLQ): một công cụ có bản quyền, trong đó người lãnh đạo tự đánh giá và người đi theo, đồng nghiệp hoặc cấp trên đánh giá mức độ thường xuyên người lãnh đạo thể hiện các hành vi gắn với từng yếu tố. Ở đây chỉ mô tả cấu trúc; không chép lại các câu hỏi.</p>
<h3>Lãnh đạo lôi cuốn và các mô hình khác</h3>
<ul>
<li><strong>Lãnh đạo lôi cuốn</strong> (House, 1976): người lãnh đạo lôi cuốn có tính áp đảo, tự tin, muốn ảnh hưởng tới người khác và có hệ giá trị mạnh; họ làm gương, nêu rõ mục tiêu, truyền đạt kỳ vọng cao và thể hiện niềm tin vào người đi theo.</li>
<li><strong>Năm thực hành của Kouzes và Posner</strong>: làm gương, truyền cảm hứng về tầm nhìn chung, thách thức quy trình, tạo điều kiện cho người khác hành động, và khích lệ tinh thần — một mô hình thiên về thực hành, dựa trên mô tả của người lãnh đạo về những trải nghiệm tốt nhất của chính họ.</li>
</ul>
<h3>Điểm mạnh và phê bình</h3>
<ul>
<li><strong>Điểm mạnh:</strong> nền nghiên cứu rất rộng; góc nhìn rộng bao gồm cả nhu cầu và giá trị của người đi theo; sức hấp dẫn trực quan mạnh; nhấn mạnh đạo đức và sự phát triển.</li>
<li><strong>Phê bình:</strong> bốn chữ I trùng lặp nhiều và khái niệm thiếu ranh giới rõ; nghiên cứu hay trộn <em>hành vi</em> với <em>tác động</em> của hành vi; phụ thuộc nặng vào bảng hỏi cùng một nguồn; thiên kiến "người lãnh đạo anh hùng" bỏ quên người đi theo và bối cảnh; và khả năng bị lạm dụng — về sau Bass phân biệt lãnh đạo chuyển đổi đích thực với lãnh đạo <strong>giả chuyển đổi</strong>, dùng cùng kiểu ảnh hưởng đó cho mục đích vụ lợi.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — mạnh, kèm lưu ý</span> Các phân tích tổng hợp (ví dụ Judge và Piccolo, 2004) cho thấy lãnh đạo chuyển đổi và thưởng theo kết quả đều liên hệ mạnh với sự hài lòng, động lực của người đi theo và hiệu quả được đánh giá, còn lãnh đạo tự do có liên hệ âm. Những phê bình nghiêm túc về khái niệm và đo lường (ví dụ van Knippenberg và Sitkin, 2013) cho thấy nên đọc các kết quả này như những tương quan vững chắc, không phải bằng chứng cho một mô hình nhân quả chính xác.</div>`,
  ]]);

const c11 = doc('lds301-4-2-authentic-servant', '4.2 — Authentic and servant leadership|||4.2 — Lãnh đạo đích thực và lãnh đạo phục vụ',
  'Lãnh đạo đích thực: bốn thành phần (tự nhận thức, quan điểm đạo đức nội tại, xử lý thông tin cân bằng, minh bạch trong quan hệ) và cách tiếp cận thực hành của George; lãnh đạo phục vụ của Greenleaf, mười đặc điểm theo Spears, các hành vi theo Liden và cộng sự; so sánh với lãnh đạo chuyển đổi; mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 4 · Lesson 4.2</span>
<h2>Authentic and servant leadership</h2>
<p class="lead">After corporate scandals in the early 2000s, interest grew in leadership grounded in values: leaders who are genuine and trustworthy, and leaders who put others first. Both approaches are appealing; both are still building their evidence base.</p>
<h3>Authentic leadership</h3>
<p>Authentic leadership is about leaders who are true to themselves and transparent with others. It can be viewed from several angles — intrapersonal (the leader's self-knowledge), interpersonal (a relationship built with followers) and developmental (something that grows over a lifetime). A theoretical model tested by Walumbwa and colleagues (2008) identifies four components:</p>
<table>
<tr><th>Component</th><th>Meaning</th><th>What it looks like at work</th></tr>
<tr><td>Self-awareness</td><td>Understanding one's values, strengths, weaknesses and impact on others</td><td>Asking for feedback and acting on it</td></tr>
<tr><td>Internalised moral perspective</td><td>Being guided by internal moral standards rather than outside pressure</td><td>Refusing to hide a product defect despite sales pressure</td></tr>
<tr><td>Balanced processing</td><td>Analysing information objectively, including views that challenge one's own</td><td>Inviting critics into the decision meeting</td></tr>
<tr><td>Relational transparency</td><td>Sharing one's true thoughts and feelings appropriately</td><td>Explaining the real reasons behind a difficult decision</td></tr>
</table>
<p>A practical approach from George (2003) describes five qualities of authentic leaders — purpose, values, relationships, self-discipline and heart — each paired with a characteristic way of acting: passion, behaviour that matches values, connectedness, consistency and compassion.</p>
<h3>Servant leadership</h3>
<p>Greenleaf (1970) argued that great leaders are first servants: their priority is the growth and well-being of people and communities, and leadership follows from that choice. Spears later drew ten characteristics from Greenleaf's writing:</p>
<ul>
<li>listening · empathy · healing · awareness · persuasion (rather than coercion)</li>
<li>conceptualisation · foresight · stewardship · commitment to the growth of people · building community</li>
</ul>
<p>Liden and colleagues (2008) developed a research model with measurable servant-leader behaviours: conceptualising, emotional healing, putting followers first, helping followers grow and succeed, behaving ethically, empowering, and creating value for the community. Outcomes are expected at three levels: follower performance and growth, organisational performance, and societal impact.</p>
<h3>How they differ from transformational leadership</h3>
<table>
<tr><th>Approach</th><th>Primary focus</th></tr>
<tr><td>Transformational</td><td>Commitment to the organisation's goals and vision</td></tr>
<tr><td>Authentic</td><td>The leader's genuineness, values and self-knowledge</td></tr>
<tr><td>Servant</td><td>Followers' needs and growth, and the wider community</td></tr>
</table>
<h3>Criticisms</h3>
<ul>
<li>Key terms (for example "internalised moral perspective" or "healing") are hard to define and measure; there are several competing servant-leadership scales.</li>
<li>Being true to oneself is not enough: a leader can be authentic and still hold harmful values.</li>
<li>Servant leadership can sound passive or naive in highly competitive settings, and the word "servant" can conflict with some cultural expectations of leaders.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — emerging</span> Both approaches show positive links with trust, engagement and performance, but research is younger. Meta-analytic work has questioned whether authentic leadership is distinct from transformational leadership (for example Banks and colleagues, 2016), while servant leadership has shown some explanatory value beyond transformational leadership (for example Hoch and colleagues, 2018). Treat both as promising, not settled.</div>`,
    `<span class="eyebrow">LDS301 · Phần 4 · Bài 4.2</span>
<h2>Lãnh đạo đích thực và lãnh đạo phục vụ</h2>
<p class="lead">Sau các vụ bê bối doanh nghiệp đầu thập niên 2000, sự quan tâm tăng lên với kiểu lãnh đạo dựa trên giá trị: người lãnh đạo chân thật, đáng tin cậy, và người lãnh đạo đặt người khác lên trước. Cả hai cách tiếp cận đều hấp dẫn; cả hai vẫn đang xây dựng nền tảng bằng chứng.</p>
<h3>Lãnh đạo đích thực</h3>
<p>Lãnh đạo đích thực nói về những người lãnh đạo sống thật với chính mình và minh bạch với người khác. Có thể nhìn nó từ nhiều góc — nội tâm (sự hiểu biết về bản thân của người lãnh đạo), liên cá nhân (mối quan hệ được xây dựng với người đi theo) và phát triển (thứ lớn dần suốt đời). Một mô hình lý thuyết do Walumbwa và cộng sự (2008) kiểm định xác định bốn thành phần:</p>
<table>
<tr><th>Thành phần</th><th>Ý nghĩa</th><th>Biểu hiện ở nơi làm việc</th></tr>
<tr><td>Tự nhận thức</td><td>Hiểu giá trị, điểm mạnh, điểm yếu và tác động của mình lên người khác</td><td>Chủ động xin phản hồi và hành động theo phản hồi</td></tr>
<tr><td>Quan điểm đạo đức nội tại</td><td>Hành động theo chuẩn mực đạo đức bên trong thay vì áp lực bên ngoài</td><td>Không che giấu lỗi sản phẩm dù chịu áp lực doanh số</td></tr>
<tr><td>Xử lý thông tin cân bằng</td><td>Phân tích thông tin khách quan, kể cả những quan điểm thách thức ý mình</td><td>Mời cả người phản biện vào cuộc họp ra quyết định</td></tr>
<tr><td>Minh bạch trong quan hệ</td><td>Chia sẻ suy nghĩ và cảm xúc thật một cách phù hợp</td><td>Giải thích lý do thật đằng sau một quyết định khó</td></tr>
</table>
<p>Một cách tiếp cận thực hành của George (2003) mô tả năm phẩm chất của người lãnh đạo đích thực — mục đích, giá trị, quan hệ, kỷ luật bản thân và trái tim — mỗi phẩm chất đi kèm một cách hành động đặc trưng: đam mê, hành vi khớp với giá trị, sự kết nối, sự nhất quán và lòng trắc ẩn.</p>
<h3>Lãnh đạo phục vụ</h3>
<p>Greenleaf (1970) lập luận rằng người lãnh đạo vĩ đại trước hết là người phục vụ: ưu tiên của họ là sự trưởng thành và đời sống của con người và cộng đồng, còn vai trò lãnh đạo nảy sinh từ lựa chọn đó. Về sau Spears rút ra mười đặc điểm từ các bài viết của Greenleaf:</p>
<ul>
<li>lắng nghe · thấu cảm · chữa lành · nhận thức · thuyết phục (thay vì cưỡng ép)</li>
<li>khái niệm hoá · tầm nhìn xa · quản gia (trông coi vì lợi ích chung) · cam kết với sự phát triển của con người · xây dựng cộng đồng</li>
</ul>
<p>Liden và cộng sự (2008) phát triển một mô hình nghiên cứu với các hành vi lãnh đạo phục vụ đo được: khái niệm hoá, chữa lành cảm xúc, đặt người đi theo lên trước, giúp người đi theo trưởng thành và thành công, hành xử có đạo đức, trao quyền, và tạo giá trị cho cộng đồng. Kết quả được kỳ vọng ở ba cấp: thành tích và sự trưởng thành của người đi theo, thành tích của tổ chức, và tác động xã hội.</p>
<h3>Khác lãnh đạo chuyển đổi ở đâu</h3>
<table>
<tr><th>Cách tiếp cận</th><th>Trọng tâm chính</th></tr>
<tr><td>Chuyển đổi</td><td>Cam kết với mục tiêu và tầm nhìn của tổ chức</td></tr>
<tr><td>Đích thực</td><td>Sự chân thật, giá trị và hiểu biết về bản thân của người lãnh đạo</td></tr>
<tr><td>Phục vụ</td><td>Nhu cầu, sự phát triển của người đi theo và cộng đồng rộng hơn</td></tr>
</table>
<h3>Phê bình</h3>
<ul>
<li>Các thuật ngữ then chốt (ví dụ "quan điểm đạo đức nội tại" hay "chữa lành") khó định nghĩa và đo lường; có nhiều thang đo lãnh đạo phục vụ cạnh tranh nhau.</li>
<li>Sống thật với chính mình là chưa đủ: một người lãnh đạo có thể rất "đích thực" mà vẫn mang những giá trị gây hại.</li>
<li>Lãnh đạo phục vụ có thể nghe thụ động hoặc ngây thơ trong môi trường cạnh tranh cao, và chữ "phục vụ" có thể mâu thuẫn với một số kỳ vọng văn hoá về người lãnh đạo.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — đang hình thành</span> Cả hai cách tiếp cận đều cho thấy liên hệ tích cực với lòng tin, sự gắn kết và thành tích, nhưng nghiên cứu còn non trẻ. Nghiên cứu phân tích tổng hợp đã đặt câu hỏi liệu lãnh đạo đích thực có thực sự khác lãnh đạo chuyển đổi (ví dụ Banks và cộng sự, 2016), trong khi lãnh đạo phục vụ cho thấy có giá trị giải thích nhất định vượt ngoài lãnh đạo chuyển đổi (ví dụ Hoch và cộng sự, 2018). Hãy coi cả hai là hứa hẹn, chưa phải đã ngã ngũ.</div>`,
  ]]);

const c12 = doc('lds301-4-3-ethics-dark-side', '4.3 — Ethical leadership and the dark side|||4.3 — Lãnh đạo có đạo đức và mặt tối của lãnh đạo',
  'Năm nguyên tắc lãnh đạo có đạo đức, người lãnh đạo là "con người đạo đức" và "nhà quản lý đạo đức", lãnh đạo độc hại và phá hoại, giám sát lạm dụng, bộ ba tối (ái kỷ, thủ đoạn, thái nhân cách), tam giác độc hại (lãnh đạo – người đi theo dễ bị cuốn – môi trường thuận lợi), cách tổ chức phòng ngừa.',
  [[
    `<span class="eyebrow">LDS301 · Part 4 · Lesson 4.3</span>
<h2>Ethical leadership and the dark side</h2>
<p class="lead">Leadership is influence, and influence can be used well or badly. Because leaders shape what others do, their ethical failures are multiplied — and harmful leadership rarely happens without followers and an environment that allow it.</p>
<h3>Principles of ethical leadership</h3>
<p>Northouse summarises five principles with roots in moral philosophy. Ethical leaders:</p>
<ul>
<li><strong>respect others</strong> — treat people as ends in themselves, not merely as means;</li>
<li><strong>serve others</strong> — put followers' welfare into their plans;</li>
<li><strong>are just</strong> — treat people fairly and explain the rules for distributing rewards and burdens;</li>
<li><strong>are honest</strong> — tell the truth, while balancing openness with sensitivity;</li>
<li><strong>build community</strong> — pursue goals that serve the leader, the followers and the wider community.</li>
</ul>
<p>Treviño and colleagues add a practical distinction: an ethical leader must be both a <strong>moral person</strong> (honest, fair, caring in private and public conduct) and a <strong>moral manager</strong> (who talks about ethics, sets clear standards, and rewards and disciplines accordingly). A good person who never makes ethics visible is seen as ethically neutral.</p>
<h3>The dark side: destructive and toxic leadership</h3>
<table>
<tr><th>Concept</th><th>Meaning</th></tr>
<tr><td>Toxic leadership (Lipman-Blumen)</td><td>Leaders whose behaviour and personal qualities cause serious and lasting harm to followers and organisations</td></tr>
<tr><td>Abusive supervision (Tepper)</td><td>Sustained hostile verbal and non-verbal behaviour towards subordinates, excluding physical contact — public ridicule, silent treatment, taking credit</td></tr>
<tr><td>Pseudo-transformational leadership</td><td>Inspiring and charismatic on the surface but serving the leader's own interests</td></tr>
<tr><td>Laissez-faire as destructive</td><td>Absence of leadership when it is needed can also harm followers</td></tr>
</table>
<h3>The dark triad and narcissism</h3>
<p>Three socially aversive traits are often studied together: <strong>narcissism</strong> (grandiosity, entitlement, need for admiration), <strong>Machiavellianism</strong> (manipulation, cynicism, strategic exploitation) and <strong>psychopathy</strong> (low empathy, impulsivity, lack of remorse). Narcissism is the most studied in leadership. A meta-analysis by Grijalva and colleagues (2015) found that narcissists are more likely to <em>emerge</em> as leaders — confidence and dominance impress groups at first — but narcissism had no overall linear relationship with leadership <em>effectiveness</em>, and moderate levels looked better than very low or very high ones. The lesson for selection: the confidence that wins the interview is not evidence of good leadership.</p>
<h3>The toxic triangle (Padilla, Hogan &amp; Kaiser, 2007)</h3>
<pre><code class="language-text">          DESTRUCTIVE LEADERS
     (charisma, personalised power,
      narcissism, hateful ideology)
            /                \\
SUSCEPTIBLE FOLLOWERS      CONDUCIVE ENVIRONMENTS
• conformers: unmet needs,  • instability, perceived threat
  low self-esteem           • cultural values that accept it
• colluders: ambition,      • absence of checks and balances
  shared bad values           and institutional controls</code></pre>
<p>Destructive leadership is a <em>system</em> outcome. That is why prevention focuses on the whole triangle, not only on "bad people".</p>
<h3>What organisations can do</h3>
<ul>
<li>Checks and balances: independent boards, audit, rotation, limits on concentrated power.</li>
<li>Selection and promotion that weigh integrity and 360-degree evidence, not just charisma and short-term results.</li>
<li>Safe speak-up channels and protection for employees who report misconduct (check the rules in force in your country and organisation).</li>
<li>Psychological safety in teams, so that conformers can become courageous followers.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — moderate</span> Research on abusive supervision and destructive leadership consistently links them with lower well-being, lower performance and higher turnover. Much of it is survey-based; the toxic triangle is a well-regarded integrative framework rather than a fully tested predictive model.</div>`,
    `<span class="eyebrow">LDS301 · Phần 4 · Bài 4.3</span>
<h2>Lãnh đạo có đạo đức và mặt tối của lãnh đạo</h2>
<p class="lead">Lãnh đạo là ảnh hưởng, và ảnh hưởng có thể được dùng tốt hoặc xấu. Vì người lãnh đạo định hình hành động của người khác, sai phạm đạo đức của họ bị nhân lên — và lãnh đạo gây hại hiếm khi xảy ra nếu không có người đi theo và môi trường dung túng.</p>
<h3>Các nguyên tắc lãnh đạo có đạo đức</h3>
<p>Northouse tóm lược năm nguyên tắc có gốc từ triết học đạo đức. Người lãnh đạo có đạo đức:</p>
<ul>
<li><strong>tôn trọng người khác</strong> — đối xử với con người như mục đích tự thân, không chỉ như phương tiện;</li>
<li><strong>phục vụ người khác</strong> — đưa lợi ích của người đi theo vào kế hoạch của mình;</li>
<li><strong>công bằng</strong> — đối xử công bằng và giải thích rõ quy tắc phân chia lợi ích và gánh nặng;</li>
<li><strong>trung thực</strong> — nói sự thật, đồng thời cân bằng giữa cởi mở và tế nhị;</li>
<li><strong>xây dựng cộng đồng</strong> — theo đuổi mục tiêu phục vụ người lãnh đạo, người đi theo và cộng đồng rộng hơn.</li>
</ul>
<p>Treviño và cộng sự bổ sung một phân biệt thực tế: người lãnh đạo có đạo đức phải vừa là <strong>con người đạo đức</strong> (trung thực, công bằng, quan tâm trong ứng xử riêng và chung) vừa là <strong>nhà quản lý đạo đức</strong> (nói về đạo đức, đặt chuẩn mực rõ ràng, khen thưởng và kỷ luật tương ứng). Một người tốt nhưng không bao giờ làm cho đạo đức trở nên hữu hình sẽ bị xem là trung tính về đạo đức.</p>
<h3>Mặt tối: lãnh đạo phá hoại và độc hại</h3>
<table>
<tr><th>Khái niệm</th><th>Ý nghĩa</th></tr>
<tr><td>Lãnh đạo độc hại (Lipman-Blumen)</td><td>Người lãnh đạo có hành vi và phẩm chất cá nhân gây tổn hại nghiêm trọng, lâu dài cho người đi theo và tổ chức</td></tr>
<tr><td>Giám sát lạm dụng (Tepper)</td><td>Hành vi thù địch bằng lời nói và phi ngôn ngữ kéo dài với cấp dưới, không kể tiếp xúc thân thể — chế giễu trước mặt người khác, phớt lờ, cướp công</td></tr>
<tr><td>Lãnh đạo giả chuyển đổi</td><td>Bề ngoài truyền cảm hứng, lôi cuốn nhưng thực chất phục vụ lợi ích riêng của người lãnh đạo</td></tr>
<tr><td>Lãnh đạo tự do như một dạng phá hoại</td><td>Sự vắng mặt của lãnh đạo khi cần cũng có thể gây hại cho người đi theo</td></tr>
</table>
<h3>Bộ ba tối và tính ái kỷ</h3>
<p>Ba đặc điểm gây phản cảm về mặt xã hội thường được nghiên cứu cùng nhau: <strong>ái kỷ</strong> (tự cao, cho mình có đặc quyền, cần được ngưỡng mộ), <strong>thủ đoạn (Machiavellianism)</strong> (thao túng, hoài nghi, lợi dụng có tính toán) và <strong>thái nhân cách</strong> (thiếu thấu cảm, bốc đồng, không hối hận). Ái kỷ được nghiên cứu nhiều nhất trong lãnh đạo. Một phân tích tổng hợp của Grijalva và cộng sự (2015) cho thấy người ái kỷ dễ <em>nổi lên</em> làm lãnh đạo hơn — sự tự tin và áp đảo gây ấn tượng với nhóm lúc đầu — nhưng ái kỷ không có quan hệ tuyến tính tổng thể với <em>hiệu quả</em> lãnh đạo, và mức vừa phải trông tốt hơn mức rất thấp hoặc rất cao. Bài học cho tuyển chọn: sự tự tin giúp thắng buổi phỏng vấn không phải là bằng chứng của lãnh đạo giỏi.</p>
<h3>Tam giác độc hại (Padilla, Hogan &amp; Kaiser, 2007)</h3>
<pre><code class="language-text">          NGƯỜI LÃNH ĐẠO PHÁ HOẠI
     (sức lôi cuốn, quyền lực vì bản thân,
      ái kỷ, hệ tư tưởng thù ghét)
            /                \\
NGƯỜI ĐI THEO DỄ BỊ CUỐN     MÔI TRƯỜNG THUẬN LỢI
• người chiều theo: nhu cầu  • bất ổn, cảm nhận bị đe doạ
  chưa được đáp ứng,         • giá trị văn hoá chấp nhận nó
  lòng tự trọng thấp         • thiếu cơ chế kiểm soát, cân bằng
• người đồng loã: tham vọng,   và kiểm soát thể chế
  chung giá trị xấu</code></pre>
<p>Lãnh đạo phá hoại là kết quả của cả <em>hệ thống</em>. Vì thế phòng ngừa phải nhắm vào cả tam giác, không chỉ vào "người xấu".</p>
<h3>Tổ chức có thể làm gì</h3>
<ul>
<li>Cơ chế kiểm soát và cân bằng: hội đồng độc lập, kiểm toán, luân chuyển, giới hạn quyền lực tập trung.</li>
<li>Tuyển chọn và đề bạt có cân nhắc sự chính trực và bằng chứng từ phản hồi 360 độ, không chỉ sức lôi cuốn và kết quả ngắn hạn.</li>
<li>Kênh lên tiếng an toàn và bảo vệ người lao động tố giác sai phạm (kiểm tra quy định đang có hiệu lực ở quốc gia và tổ chức của bạn).</li>
<li>An toàn tâm lý trong đội, để người chiều theo có thể trở thành người đi theo dũng cảm.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình</span> Nghiên cứu về giám sát lạm dụng và lãnh đạo phá hoại liên tục gắn chúng với sức khoẻ tinh thần thấp hơn, thành tích thấp hơn và tỷ lệ nghỉ việc cao hơn. Phần lớn dựa trên khảo sát; tam giác độc hại là một khung tích hợp được đánh giá cao hơn là một mô hình dự báo đã được kiểm định đầy đủ.</div>`,
  ]]);

const c12q = quiz('lds301-quiz-4', 'Quiz 4 — Transformational, values-based and dark-side leadership|||Quiz 4 — Lãnh đạo chuyển đổi, dựa trên giá trị và mặt tối', [
  { id: 'q1', question: 'A manager encourages the team to question long-held assumptions and to try new ways of solving problems. Which factor of transformational leadership is this?|||Một người quản lý khuyến khích đội chất vấn những giả định lâu nay và thử cách giải quyết vấn đề mới. Đây là yếu tố nào của lãnh đạo chuyển đổi?', options: ['Individualised consideration|||Quan tâm cá nhân', 'Contingent reward|||Thưởng theo kết quả', 'Intellectual stimulation|||Kích thích trí tuệ', 'Management by exception — active|||Quản lý theo ngoại lệ — chủ động'], correctIndex: 2, explanation: 'Intellectual stimulation means challenging assumptions and encouraging creativity; contingent reward and management by exception are transactional factors.|||Kích thích trí tuệ là thách thức giả định và khuyến khích sáng tạo; thưởng theo kết quả và quản lý theo ngoại lệ là các yếu tố giao dịch.' },
  { id: 'q2', question: 'Which of these is one of the four components of authentic leadership in the model tested by Walumbwa and colleagues?|||Yếu tố nào sau đây là một trong bốn thành phần của lãnh đạo đích thực trong mô hình do Walumbwa và cộng sự kiểm định?', options: ['Balanced processing|||Xử lý thông tin cân bằng', 'Contingent reward|||Thưởng theo kết quả', 'Initiating structure|||Định hình cấu trúc', 'Position power|||Quyền lực vị trí'], correctIndex: 0, explanation: 'The four components are self-awareness, internalised moral perspective, balanced processing and relational transparency.|||Bốn thành phần là tự nhận thức, quan điểm đạo đức nội tại, xử lý thông tin cân bằng và minh bạch trong quan hệ.' },
  { id: 'q3', question: 'According to the toxic triangle, destructive leadership results from…|||Theo mô hình tam giác độc hại, lãnh đạo phá hoại là kết quả của…', options: ['A leader with high emotional intelligence|||Một người lãnh đạo có trí tuệ cảm xúc cao', 'Too much contingent reward|||Quá nhiều thưởng theo kết quả', 'A mismatch between LPC score and octant|||Sự không phù hợp giữa điểm LPC và ô tình huống', 'Destructive leaders, susceptible followers and conducive environments together|||Người lãnh đạo phá hoại, người đi theo dễ bị cuốn và môi trường thuận lợi cùng lúc'], correctIndex: 3, explanation: 'Padilla, Hogan and Kaiser treat destructive leadership as a system outcome of all three elements, so prevention must address followers and environments too.|||Padilla, Hogan và Kaiser coi lãnh đạo phá hoại là kết quả hệ thống của cả ba yếu tố, nên phòng ngừa phải tác động cả tới người đi theo và môi trường.' },
]);

const c13 = doc('lds301-5-1-adaptive', '5.1 — Adaptive leadership: technical problems and adaptive challenges|||5.1 — Lãnh đạo thích ứng: vấn đề kỹ thuật và thách thức thích ứng',
  'Lãnh đạo thích ứng của Heifetz: phân biệt quyền hạn và lãnh đạo, ba loại thách thức (kỹ thuật, kỹ thuật và thích ứng, thích ứng), sáu hành vi của người lãnh đạo, môi trường nâng đỡ và vùng mất cân bằng hữu ích, hành vi né tránh công việc, điểm mạnh, phê bình và mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 5 · Lesson 5.1</span>
<h2>Adaptive leadership: technical problems and adaptive challenges</h2>
<p class="lead">Some problems have answers that an expert can supply. Others can only be solved when the people who have the problem change their own habits, priorities and loyalties. Heifetz calls the second kind <strong>adaptive challenges</strong> and argues that the leader's job is not to hand out answers but to mobilise people to do the adaptive work themselves.</p>
<h3>Authority is not leadership</h3>
<p>Heifetz (1994) separates <strong>authority</strong> — the formal power people grant to a position in return for protection, direction and order — from <strong>leadership</strong>, the activity of helping a group face a difficult reality. People with authority are expected to provide solutions, which is exactly what they cannot do for an adaptive challenge. That is why leading adaptively often disappoints people at first, and why it can also be exercised by someone without a formal title.</p>
<h3>Three kinds of challenge</h3>
<table>
<tr><th>Kind of challenge</th><th>Problem definition</th><th>Solution</th><th>Who does the work</th><th>Example (fictional)</th></tr>
<tr><td>Technical</td><td>Clear</td><td>Clear — known expertise works</td><td>The authority or expert</td><td>The payroll file fails to upload; IT fixes the format</td></tr>
<tr><td>Technical and adaptive</td><td>Clear</td><td>Requires learning</td><td>The authority and the people involved</td><td>A new CRM system: installing it is technical, but salespeople must change how they share customer information</td></tr>
<tr><td>Adaptive</td><td>Requires learning</td><td>Requires learning</td><td>The people involved</td><td>A family firm moving from founder control to professional management</td></tr>
</table>
<p>Heifetz argues that a frequent cause of leadership failure is treating an adaptive challenge as if it were technical: announcing a new procedure, buying software or restructuring the chart, while the real issue — values, trust, habits — is left untouched.</p>
<h3>Six leader behaviours</h3>
<ol>
<li><strong>Get on the balcony</strong> — step back from the action to see patterns, conflicts and what people are avoiding.</li>
<li><strong>Identify adaptive challenges</strong> — ask whether the problem lies in people's hearts and habits, and look for conflicts between espoused values and actual behaviour.</li>
<li><strong>Regulate distress</strong> — keep tension high enough to motivate change but not so high that people are overwhelmed. This means building a <em>holding environment</em> (a safe space of trust, structure and clear norms) and keeping people in a <em>productive zone of disequilibrium</em>.</li>
<li><strong>Maintain disciplined attention</strong> — notice and counter <em>work avoidance</em>: blaming, denial, scapegoating, jumping to conclusions or retreating to technical fixes.</li>
<li><strong>Give the work back to the people</strong> — resist the pull to solve everything; let those who own the problem take responsibility for it.</li>
<li><strong>Protect leadership voices from below</strong> — listen to people at the margins or low in the hierarchy who raise uncomfortable questions; they often see the challenge first.</li>
</ol>
<h3>Strengths and criticisms</h3>
<ul>
<li><strong>Strengths:</strong> treats leadership as a process rather than a trait; puts followers and their learning at the centre; offers practical guidance for messy, value-laden problems that most theories ignore.</li>
<li><strong>Criticisms:</strong> key concepts such as the holding environment and adaptive work are loosely defined; the model tells leaders <em>what</em> to attend to more than <em>how</em> to do it; its moral dimension — which changes count as growth — is assumed rather than explained.</li>
</ul>
<div class="callout"><span class="badge">Evidence check — limited</span> Adaptive leadership is built mainly on case experience and conceptual writing, and it has been tested in few rigorous empirical studies. Its technical-versus-adaptive distinction is widely used as a diagnostic lens; treat the six behaviours as well-reasoned advice, not tested predictions.</div>`,
    `<span class="eyebrow">LDS301 · Phần 5 · Bài 5.1</span>
<h2>Lãnh đạo thích ứng: vấn đề kỹ thuật và thách thức thích ứng</h2>
<p class="lead">Có những vấn đề mà chuyên gia đưa ra được lời giải. Có những vấn đề khác chỉ được giải quyết khi chính những người mang vấn đề thay đổi thói quen, thứ tự ưu tiên và sự trung thành của mình. Heifetz gọi loại thứ hai là <strong>thách thức thích ứng</strong> và cho rằng việc của người lãnh đạo không phải là phát lời giải mà là huy động mọi người tự làm công việc thích ứng.</p>
<h3>Quyền hạn không phải là lãnh đạo</h3>
<p>Heifetz (1994) tách <strong>quyền hạn</strong> — quyền lực chính thức mà mọi người trao cho một vị trí để đổi lấy sự bảo vệ, định hướng và trật tự — khỏi <strong>lãnh đạo</strong>, tức hoạt động giúp một nhóm đối diện với một thực tế khó khăn. Người có quyền hạn bị kỳ vọng phải đưa ra lời giải, mà đó chính là điều họ không làm được với thách thức thích ứng. Vì thế lãnh đạo thích ứng lúc đầu thường làm mọi người thất vọng, và cũng vì thế mà người không có chức danh chính thức vẫn có thể thực hiện nó.</p>
<h3>Ba loại thách thức</h3>
<table>
<tr><th>Loại thách thức</th><th>Xác định vấn đề</th><th>Lời giải</th><th>Ai làm việc chính</th><th>Ví dụ (hư cấu)</th></tr>
<tr><td>Kỹ thuật</td><td>Rõ ràng</td><td>Rõ ràng — chuyên môn sẵn có dùng được</td><td>Người có quyền hạn hoặc chuyên gia</td><td>Tệp lương không tải lên được; bộ phận IT sửa định dạng</td></tr>
<tr><td>Kỹ thuật và thích ứng</td><td>Rõ ràng</td><td>Cần học hỏi</td><td>Người có quyền hạn và những người liên quan</td><td>Hệ thống CRM mới: cài đặt là việc kỹ thuật, nhưng nhân viên bán hàng phải thay đổi cách chia sẻ thông tin khách hàng</td></tr>
<tr><td>Thích ứng</td><td>Cần học hỏi</td><td>Cần học hỏi</td><td>Những người liên quan</td><td>Một doanh nghiệp gia đình chuyển từ người sáng lập nắm hết sang quản trị chuyên nghiệp</td></tr>
</table>
<p>Heifetz cho rằng một nguyên nhân thường gặp khiến lãnh đạo thất bại là coi thách thức thích ứng như thể nó là vấn đề kỹ thuật: ban hành quy trình mới, mua phần mềm hay vẽ lại sơ đồ tổ chức, trong khi vấn đề thật — giá trị, lòng tin, thói quen — vẫn còn nguyên.</p>
<h3>Sáu hành vi của người lãnh đạo</h3>
<ol>
<li><strong>Lên ban công</strong> — lùi ra khỏi dòng sự việc để thấy các khuôn mẫu, xung đột và điều mọi người đang né tránh.</li>
<li><strong>Nhận diện thách thức thích ứng</strong> — hỏi xem vấn đề có nằm ở suy nghĩ và thói quen của con người không, và tìm những mâu thuẫn giữa giá trị được tuyên bố với hành vi thực tế.</li>
<li><strong>Điều tiết mức căng thẳng</strong> — giữ căng thẳng đủ cao để thúc đẩy thay đổi nhưng không cao tới mức mọi người bị quá tải. Điều này đòi hỏi xây dựng một <em>môi trường nâng đỡ</em> (không gian an toàn có lòng tin, cấu trúc và chuẩn mực rõ ràng) và giữ mọi người trong <em>vùng mất cân bằng hữu ích</em>.</li>
<li><strong>Duy trì sự chú tâm có kỷ luật</strong> — nhận ra và ngăn <em>hành vi né tránh công việc</em>: đổ lỗi, phủ nhận, tìm người chịu tội thay, vội kết luận hoặc rút về các giải pháp kỹ thuật.</li>
<li><strong>Trả công việc lại cho mọi người</strong> — cưỡng lại sức kéo phải tự giải quyết mọi thứ; để những người sở hữu vấn đề nhận trách nhiệm với nó.</li>
<li><strong>Bảo vệ tiếng nói lãnh đạo từ bên dưới</strong> — lắng nghe những người ở rìa hoặc ở cấp thấp đang nêu câu hỏi khó chịu; họ thường thấy thách thức sớm nhất.</li>
</ol>
<h3>Điểm mạnh và phê bình</h3>
<ul>
<li><strong>Điểm mạnh:</strong> coi lãnh đạo là một quá trình chứ không phải phẩm chất; đặt người đi theo và việc học của họ vào trung tâm; đưa ra hướng dẫn thực tế cho những vấn đề rối rắm, gắn với giá trị mà phần lớn lý thuyết bỏ qua.</li>
<li><strong>Phê bình:</strong> các khái niệm then chốt như môi trường nâng đỡ và công việc thích ứng được định nghĩa lỏng lẻo; mô hình nói người lãnh đạo cần chú ý tới <em>điều gì</em> nhiều hơn là làm <em>thế nào</em>; khía cạnh đạo đức — thay đổi nào được coi là trưởng thành — được mặc định hơn là giải thích.</li>
</ul>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — hạn chế</span> Lãnh đạo thích ứng được xây chủ yếu trên kinh nghiệm tình huống và bài viết khái niệm, và mới được kiểm định trong ít nghiên cứu thực nghiệm chặt chẽ. Cách phân biệt vấn đề kỹ thuật với thách thức thích ứng được dùng rộng rãi như một lăng kính chẩn đoán; hãy coi sáu hành vi là lời khuyên có lập luận tốt, chưa phải dự báo đã được kiểm định.</div>`,
  ]]);

const c14 = doc('lds301-5-2-leading-change', '5.2 — Leading change: Lewin, Kotter and resistance|||5.2 — Dẫn dắt thay đổi: Lewin, Kotter và sự kháng cự',
  'Phân tích trường lực và mô hình ba bước của Lewin (kèm tranh luận về nguồn gốc), tám bước dẫn dắt thay đổi và tám sai lầm của Kotter, nguyên nhân kháng cự và sáu cách xử lý theo Kotter & Schlesinger, kháng cự như một nguồn thông tin, mức bằng chứng và con số "70% thất bại".',
  [[
    `<span class="eyebrow">LDS301 · Part 5 · Lesson 5.2</span>
<h2>Leading change: Lewin, Kotter and resistance</h2>
<p class="lead">Kotter's distinction from the introduction returns here: management keeps a system running, leadership moves it somewhere new. This lesson gives three classic tools for that movement — a way to analyse the forces, a sequence of steps, and a way to work with resistance rather than against it.</p>
<h3>Lewin: force fields and three steps</h3>
<p><strong>Force-field analysis</strong> pictures the current situation as a balance between <em>driving forces</em> pushing for change and <em>restraining forces</em> holding it back. Lewin's insight was that simply pushing harder on the driving forces tends to raise tension and push-back; reducing the restraining forces often moves the balance more smoothly.</p>
<pre><code class="language-text">Driving forces  ──►  |  ◄──  Restraining forces
customer demand      |      fear of job loss
cost pressure        |      old habits and skills
new technology       |      lack of time to learn
                     |
            current equilibrium</code></pre>
<p>The famous <strong>three-step model</strong> — <em>unfreeze</em> (create readiness, show why the present cannot continue), <em>move</em> (introduce new behaviours and structures), <em>refreeze</em> (stabilise the new state through systems, rewards and norms) — is attributed to Lewin. Note, however, that historians of management (for example Cummings, Bridgman and Brown, 2016) argue that the neat three-step version was largely built by later writers from a few brief remarks, and that Lewin himself saw change as more continuous. It remains a useful teaching simplification.</p>
<h3>Kotter's eight steps (1995, 1996)</h3>
<table>
<tr><th>Step</th><th>What the leader does</th><th>Typical error Kotter observed</th></tr>
<tr><td>1. Establish a sense of urgency</td><td>Show honestly why the status quo is dangerous or an opportunity is being missed</td><td>Complacency; underestimating how hard it is to move people</td></tr>
<tr><td>2. Create a guiding coalition</td><td>Assemble a group with enough power, expertise and credibility to lead the change</td><td>A coalition that is too weak or too narrow</td></tr>
<tr><td>3. Develop a vision and strategy</td><td>Describe a clear, desirable future and the route to it</td><td>Plans and programmes but no vision</td></tr>
<tr><td>4. Communicate the change vision</td><td>Repeat the vision through every channel; leaders model it</td><td>Undercommunicating — Kotter said by a factor of ten</td></tr>
<tr><td>5. Empower broad-based action</td><td>Remove obstacles: structures, systems, skills gaps, blocking managers</td><td>Letting obstacles block the new vision</td></tr>
<tr><td>6. Generate short-term wins</td><td>Plan visible, unambiguous improvements early and reward the people involved</td><td>No planned wins, so sceptics gain ground</td></tr>
<tr><td>7. Consolidate gains and produce more change</td><td>Use credibility from early wins to change more systems and people</td><td>Declaring victory too soon</td></tr>
<tr><td>8. Anchor new approaches in the culture</td><td>Connect new behaviours to success; build them into hiring, promotion and succession</td><td>Changes that are never anchored and fade</td></tr>
</table>
<p>Steps 1–4 unfreeze, steps 5–7 introduce new practices, and step 8 refreezes — Kotter's sequence can be read as a detailed version of Lewin's logic.</p>
<h3>Why people resist, and how to respond</h3>
<p>Kotter and Schlesinger (1979) named four common reasons: <strong>parochial self-interest</strong> (fear of losing something valued), <strong>misunderstanding and lack of trust</strong>, <strong>different assessments</strong> of whether the change makes sense, and <strong>low tolerance for change</strong>. They matched them with six approaches:</p>
<table>
<tr><th>Approach</th><th>Commonly used when</th><th>Drawback</th></tr>
<tr><td>Education and communication</td><td>Resistance comes from missing or inaccurate information</td><td>Time-consuming with many people</td></tr>
<tr><td>Participation and involvement</td><td>Initiators lack information, or others have power to resist</td><td>Slow; poor if participants design a poor change</td></tr>
<tr><td>Facilitation and support</td><td>People resist because of anxiety and adjustment problems</td><td>Costly and may still fail</td></tr>
<tr><td>Negotiation and agreement</td><td>A group will clearly lose and has power to resist</td><td>Expensive; invites others to negotiate</td></tr>
<tr><td>Manipulation and co-optation</td><td>Other tactics will not work or cost too much</td><td>Backfires if people feel manipulated; ethically doubtful</td></tr>
<tr><td>Explicit and implicit coercion</td><td>Speed is essential and initiators hold much power</td><td>Risky; leaves people angry — compliance at best</td></tr>
</table>
<p>Ford, Ford and D'Amelio (2008) add an important corrective: resistance is not only an obstacle but also <strong>information</strong>. Objections may reveal real flaws in the plan, and change agents often provoke resistance themselves through broken promises or poor communication. Listening to resisters is part of leading change, not a concession.</p>
<div class="callout"><span class="badge">Evidence check — limited to moderate</span> Kotter's model comes from his observation of change efforts as a scholar and consultant; reviews (for example Appelbaum and colleagues, 2012) find support for many individual steps but few rigorous tests of the model as a whole. The widely repeated claim that "70% of change programmes fail" has no solid empirical basis (Hughes, 2011). Findings that participation and fair communication reduce resistance are more consistent.</div>`,
    `<span class="eyebrow">LDS301 · Phần 5 · Bài 5.2</span>
<h2>Dẫn dắt thay đổi: Lewin, Kotter và sự kháng cự</h2>
<p class="lead">Cách phân biệt của Kotter ở bài giới thiệu quay lại ở đây: quản lý giữ cho hệ thống vận hành, lãnh đạo đưa nó tới một nơi mới. Bài này đưa ra ba công cụ kinh điển cho hành trình ấy — một cách phân tích các lực, một trình tự các bước, và một cách làm việc cùng sự kháng cự thay vì chống lại nó.</p>
<h3>Lewin: trường lực và ba bước</h3>
<p><strong>Phân tích trường lực</strong> hình dung tình trạng hiện tại như thế cân bằng giữa <em>lực thúc đẩy</em> đẩy về phía thay đổi và <em>lực cản trở</em> giữ nó lại. Nhận định của Lewin là chỉ đẩy mạnh hơn các lực thúc đẩy thường làm tăng căng thẳng và phản ứng ngược; giảm các lực cản trở thường dịch chuyển thế cân bằng êm hơn.</p>
<pre><code class="language-text">Lực thúc đẩy  ──►    |  ◄──  Lực cản trở
nhu cầu khách hàng   |      sợ mất việc
áp lực chi phí       |      thói quen và kỹ năng cũ
công nghệ mới        |      thiếu thời gian để học
                     |
         thế cân bằng hiện tại</code></pre>
<p><strong>Mô hình ba bước</strong> nổi tiếng — <em>làm tan băng</em> (tạo sự sẵn sàng, cho thấy vì sao hiện trạng không thể tiếp tục), <em>chuyển đổi</em> (đưa vào hành vi và cấu trúc mới), <em>tái đóng băng</em> (ổn định trạng thái mới bằng hệ thống, khen thưởng và chuẩn mực) — được gắn với tên Lewin. Tuy nhiên, lưu ý rằng các nhà nghiên cứu lịch sử quản trị (ví dụ Cummings, Bridgman và Brown, 2016) cho rằng phiên bản ba bước gọn gàng phần lớn do các tác giả đời sau dựng lên từ vài nhận xét ngắn, và bản thân Lewin nhìn thay đổi như một quá trình liên tục hơn. Nó vẫn là một cách đơn giản hoá hữu ích để giảng dạy.</p>
<h3>Tám bước của Kotter (1995, 1996)</h3>
<table>
<tr><th>Bước</th><th>Người lãnh đạo làm gì</th><th>Sai lầm điển hình Kotter quan sát được</th></tr>
<tr><td>1. Tạo cảm giác cấp bách</td><td>Cho thấy một cách trung thực vì sao hiện trạng nguy hiểm hoặc một cơ hội đang bị bỏ lỡ</td><td>Tự mãn; đánh giá thấp mức khó của việc làm con người chuyển động</td></tr>
<tr><td>2. Lập liên minh dẫn dắt</td><td>Tập hợp một nhóm đủ quyền lực, chuyên môn và uy tín để dẫn dắt thay đổi</td><td>Liên minh quá yếu hoặc quá hẹp</td></tr>
<tr><td>3. Xây dựng tầm nhìn và chiến lược</td><td>Mô tả một tương lai rõ ràng, đáng mong muốn và con đường tới đó</td><td>Có kế hoạch và chương trình nhưng không có tầm nhìn</td></tr>
<tr><td>4. Truyền đạt tầm nhìn thay đổi</td><td>Nhắc lại tầm nhìn qua mọi kênh; người lãnh đạo làm gương</td><td>Truyền đạt quá ít — theo Kotter là ít đi tới mười lần</td></tr>
<tr><td>5. Trao quyền hành động trên diện rộng</td><td>Dỡ bỏ trở ngại: cơ cấu, hệ thống, thiếu hụt kỹ năng, người quản lý cản đường</td><td>Để các trở ngại chặn tầm nhìn mới</td></tr>
<tr><td>6. Tạo thắng lợi ngắn hạn</td><td>Lên kế hoạch cho những cải thiện sớm, dễ thấy, không mơ hồ và khen thưởng người tham gia</td><td>Không có thắng lợi được lên kế hoạch, nên người hoài nghi lấn tới</td></tr>
<tr><td>7. Củng cố thành quả và thúc đẩy thay đổi tiếp</td><td>Dùng uy tín từ thắng lợi ban đầu để thay đổi thêm hệ thống và con người</td><td>Tuyên bố chiến thắng quá sớm</td></tr>
<tr><td>8. Neo cách làm mới vào văn hoá</td><td>Gắn hành vi mới với thành công; đưa chúng vào tuyển dụng, đề bạt và kế nhiệm</td><td>Thay đổi không bao giờ được neo lại và phai dần</td></tr>
</table>
<p>Bước 1–4 làm tan băng, bước 5–7 đưa vào cách làm mới, bước 8 tái đóng băng — có thể đọc trình tự của Kotter như một phiên bản chi tiết của logic Lewin.</p>
<h3>Vì sao con người kháng cự, và nên đáp lại thế nào</h3>
<p>Kotter và Schlesinger (1979) nêu bốn lý do thường gặp: <strong>lợi ích cục bộ của bản thân</strong> (sợ mất thứ mình coi trọng), <strong>hiểu lầm và thiếu lòng tin</strong>, <strong>đánh giá khác nhau</strong> về việc thay đổi có hợp lý không, và <strong>khả năng chịu đựng thay đổi thấp</strong>. Hai ông ghép chúng với sáu cách xử lý:</p>
<table>
<tr><th>Cách xử lý</th><th>Thường dùng khi</th><th>Nhược điểm</th></tr>
<tr><td>Giáo dục và truyền thông</td><td>Kháng cự bắt nguồn từ thông tin thiếu hoặc sai</td><td>Tốn thời gian khi có nhiều người</td></tr>
<tr><td>Cho tham gia và cùng làm</td><td>Người khởi xướng thiếu thông tin, hoặc người khác có sức kháng cự lớn</td><td>Chậm; tệ nếu người tham gia thiết kế ra một thay đổi kém</td></tr>
<tr><td>Tạo điều kiện và hỗ trợ</td><td>Con người kháng cự vì lo âu và khó thích nghi</td><td>Tốn kém và vẫn có thể thất bại</td></tr>
<tr><td>Thương lượng và thoả thuận</td><td>Một nhóm rõ ràng sẽ chịu thiệt và có sức kháng cự</td><td>Đắt đỏ; khiến nhóm khác cũng đòi thương lượng</td></tr>
<tr><td>Thao túng và lôi kéo</td><td>Các cách khác không hiệu quả hoặc quá tốn kém</td><td>Phản tác dụng nếu con người thấy bị thao túng; đáng ngờ về đạo đức</td></tr>
<tr><td>Ép buộc công khai hoặc ngầm</td><td>Tốc độ là yếu tố sống còn và người khởi xướng nắm nhiều quyền lực</td><td>Rủi ro; để lại sự tức giận — cùng lắm chỉ có tuân thủ</td></tr>
</table>
<p>Ford, Ford và D'Amelio (2008) bổ sung một điều chỉnh quan trọng: kháng cự không chỉ là trở ngại mà còn là <strong>thông tin</strong>. Những phản đối có thể chỉ ra lỗ hổng thật của kế hoạch, và chính người thúc đẩy thay đổi thường gây ra kháng cự vì thất hứa hoặc truyền thông kém. Lắng nghe người kháng cự là một phần của dẫn dắt thay đổi, không phải sự nhượng bộ.</p>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — hạn chế tới trung bình</span> Mô hình của Kotter đến từ quan sát của ông về các nỗ lực thay đổi trong vai trò học giả và nhà tư vấn; các tổng quan (ví dụ Appelbaum và cộng sự, 2012) thấy nhiều bước riêng lẻ được ủng hộ nhưng rất ít kiểm định chặt chẽ cho cả mô hình. Nhận định được nhắc đi nhắc lại rằng "70% chương trình thay đổi thất bại" không có cơ sở thực nghiệm vững chắc (Hughes, 2011). Các phát hiện cho thấy sự tham gia và truyền thông công bằng làm giảm kháng cự thì nhất quán hơn.</div>`,
  ]]);

const c15 = doc('lds301-5-3-diversity-culture-development', '5.3 — Gender, culture and developing leaders|||5.3 — Giới, văn hoá và phát triển người lãnh đạo',
  'Giới và lãnh đạo (mê cung lãnh đạo, khác biệt phong cách nhỏ, thuyết phù hợp vai trò, vực kính (glass cliff)), lãnh đạo hoà nhập và an toàn tâm lý, nhắc ngắn GLOBE với sáu chiều lý thuyết lãnh đạo ngầm theo văn hoá (CLT); phát triển năng lực lãnh đạo: phản hồi 360 độ, coaching, kèm cặp, kế hoạch phát triển cá nhân, quy tắc 70-20-10; mức bằng chứng.',
  [[
    `<span class="eyebrow">LDS301 · Part 5 · Lesson 5.3</span>
<h2>Gender, culture and developing leaders</h2>
<p class="lead">Who gets to lead, what people expect from leaders in different cultures, and how leadership capability can be built — three questions that decide whether the theories of this course are applied fairly and well.</p>
<h3>Gender and leadership</h3>
<p>Women remain under-represented in senior leadership in most countries. Eagly and Carli (2007) proposed replacing the metaphor of a single <strong>glass ceiling</strong> with a <strong>labyrinth</strong>: many barriers at every stage of a career rather than one wall at the top. Research has tested three broad explanations:</p>
<ul>
<li><strong>Human-capital differences</strong> — differences in education and experience are now small; unequal domestic responsibilities still interrupt more women's careers.</li>
<li><strong>Style differences</strong> — meta-analyses find <em>small</em> differences: women on average lead in a slightly more participative way (Eagly and Johnson, 1990) and show slightly more transformational behaviour and contingent reward (Eagly, Johannesen-Schmidt and van Engen, 2003). Overlap between men and women is far larger than the gap.</li>
<li><strong>Prejudice</strong> — <em>role congruity theory</em> (Eagly and Karau, 2002) explains that the stereotype of a leader (assertive, dominant) clashes with the stereotype of women (warm, communal). Women are then judged as having less leadership potential, and the same assertive behaviour is evaluated less favourably when a woman shows it.</li>
</ul>
<p>On effectiveness, an early meta-analysis (Eagly, Karau and Makhijani, 1995) found no overall difference between men and women, although each did somewhat better in roles seen as congruent with their gender. Ryan and Haslam (2005) described a <strong>glass cliff</strong>: women are sometimes appointed to lead in precarious situations, when failure is more likely; later studies show the effect depends strongly on context.</p>
<h3>Diversity and inclusive leadership</h3>
<p>Inclusion means that people feel they <em>belong</em> and that their <em>unique</em> perspectives are valued (Shore and colleagues, 2011). Leader behaviour matters: Nembhard and Edmondson (2006) found that when leaders explicitly invite and appreciate others' contributions, team members — especially those of lower status — feel more psychologically safe to speak up. Practical habits: ask quieter members first, invite dissent before deciding, explain how input was used, and check whether stretch assignments go to the same people every time.</p>
<h3>Culture: a short reminder (IBC201 goes deeper)</h3>
<p>The GLOBE project (House and colleagues, 2004) surveyed middle managers in 62 societies and summarised what people see as outstanding leadership in six <strong>culturally endorsed implicit leadership theory (CLT)</strong> dimensions:</p>
<table>
<tr><th>CLT dimension</th><th>Across cultures</th></tr>
<tr><td>Charismatic / value-based</td><td>Seen as contributing to outstanding leadership almost everywhere</td></tr>
<tr><td>Team-oriented</td><td>Seen as contributing almost everywhere</td></tr>
<tr><td>Participative</td><td>Generally positive, but more valued in some clusters than others</td></tr>
<tr><td>Humane-oriented</td><td>Generally positive, with variation</td></tr>
<tr><td>Autonomous</td><td>Varies from slightly impeding to slightly contributing</td></tr>
<tr><td>Self-protective</td><td>Generally seen as impeding, though less so in some clusters</td></tr>
</table>
<p>GLOBE also found attributes that were endorsed almost universally — for example being trustworthy, just, honest, encouraging and decisive — and others that were almost universally rejected, such as being ruthless, egocentric or dictatorial. The lesson: the <em>core</em> of good leadership travels well, but how it is <em>expressed</em> (how directly to disagree, how much to consult) must be adapted. Check whether a country is actually in the GLOBE sample before using its scores.</p>
<h3>Developing leaders</h3>
<ul>
<li><strong>360-degree feedback</strong> — ratings of the same behaviours from self, manager, peers, direct reports and sometimes customers. Good practice: use it for development rather than pay decisions, combine several raters per group so no one can be identified, and follow it with a coached development plan. A meta-analysis by Smither, London and Reilly (2005) found that improvement after multisource feedback is usually <em>small</em>, and more likely when recipients accept the need to change, set specific goals and take action.</li>
<li><strong>Coaching</strong> — a one-to-one, goal-focused relationship. Meta-analyses (for example Theeboom and colleagues, 2014) report positive average effects on performance, well-being and goal attainment, though many studies are small.</li>
<li><strong>Mentoring and challenging assignments</strong> — the "lessons of experience" research at the Center for Creative Leadership showed that leaders learn most from stretch jobs, hardships and other people. The popular <strong>70-20-10</strong> rule (70% experience, 20% relationships, 10% courses) is a rough guideline drawn from that work, not a precise measured ratio.</li>
<li><strong>Formal training</strong> — a meta-analysis by Lacerenza and colleagues (2017) found that leadership training on average improves learning, on-the-job behaviour and results, especially when it is based on a needs analysis, includes practice and feedback, and is spread over several sessions.</li>
</ul>
<pre><code class="language-text">INDIVIDUAL DEVELOPMENT PLAN (IDP) — one page, reviewed each quarter
1. Strengths to keep using        (evidence: 360 report, results)
2. One or two development goals   (specific behaviour, not a trait)
3. Actions   70: stretch assignment  ·  20: mentor / coach  ·  10: course
4. Support needed                 (manager, budget, time)
5. Measures of progress           (repeat pulse ratings, observed behaviour)
6. Timeline and review dates</code></pre>
<div class="callout"><span class="badge">Evidence check — moderate</span> Gender-difference meta-analyses are large and consistent, but the differences they find are small and depend on context. GLOBE is the largest study of culture and leadership, yet its measurement choices are still debated. Leadership development works on average, with modest effects that depend heavily on design and follow-up.</div>`,
    `<span class="eyebrow">LDS301 · Phần 5 · Bài 5.3</span>
<h2>Giới, văn hoá và phát triển người lãnh đạo</h2>
<p class="lead">Ai được làm lãnh đạo, người ở những nền văn hoá khác nhau kỳ vọng gì ở người lãnh đạo, và năng lực lãnh đạo được xây dựng ra sao — ba câu hỏi quyết định các lý thuyết trong môn học này có được áp dụng công bằng và hiệu quả hay không.</p>
<h3>Giới và lãnh đạo</h3>
<p>Phụ nữ vẫn chiếm tỷ lệ thấp ở cấp lãnh đạo cao nhất tại phần lớn các quốc gia. Eagly và Carli (2007) đề xuất thay hình ảnh một <strong>trần kính</strong> duy nhất bằng hình ảnh <strong>mê cung</strong>: nhiều rào cản ở mọi giai đoạn sự nghiệp chứ không phải một bức tường ở trên cùng. Nghiên cứu đã kiểm định ba nhóm giải thích:</p>
<ul>
<li><strong>Khác biệt về vốn con người</strong> — khác biệt về học vấn và kinh nghiệm nay đã nhỏ; trách nhiệm việc nhà không đồng đều vẫn làm gián đoạn sự nghiệp của nhiều phụ nữ hơn.</li>
<li><strong>Khác biệt về phong cách</strong> — các phân tích tổng hợp thấy khác biệt <em>nhỏ</em>: trung bình phụ nữ lãnh đạo theo cách hơi thiên về cùng tham gia hơn (Eagly và Johnson, 1990) và thể hiện hơi nhiều hành vi chuyển đổi và thưởng theo kết quả hơn (Eagly, Johannesen-Schmidt và van Engen, 2003). Phần chồng lấn giữa nam và nữ lớn hơn nhiều so với khoảng cách.</li>
<li><strong>Định kiến</strong> — <em>thuyết phù hợp vai trò</em> (Eagly và Karau, 2002) giải thích rằng khuôn mẫu về người lãnh đạo (quyết đoán, áp đảo) va chạm với khuôn mẫu về phụ nữ (ấm áp, hướng về cộng đồng). Khi đó phụ nữ bị đánh giá là có ít tiềm năng lãnh đạo hơn, và cùng một hành vi quyết đoán lại bị đánh giá kém thiện cảm hơn khi do phụ nữ thể hiện.</li>
</ul>
<p>Về hiệu quả, một phân tích tổng hợp sớm (Eagly, Karau và Makhijani, 1995) không thấy khác biệt tổng thể giữa nam và nữ, dù mỗi giới làm tốt hơn đôi chút ở những vai trò được coi là phù hợp với giới của mình. Ryan và Haslam (2005) mô tả hiện tượng <strong>vực kính (glass cliff)</strong>: phụ nữ đôi khi được bổ nhiệm lãnh đạo trong những tình huống bấp bênh, khi khả năng thất bại cao hơn; các nghiên cứu sau cho thấy hiệu ứng này phụ thuộc mạnh vào bối cảnh.</p>
<h3>Đa dạng và lãnh đạo hoà nhập</h3>
<p>Hoà nhập nghĩa là con người cảm thấy mình <em>thuộc về</em> tập thể và góc nhìn <em>riêng</em> của mình được coi trọng (Shore và cộng sự, 2011). Hành vi của người lãnh đạo có ý nghĩa: Nembhard và Edmondson (2006) thấy rằng khi người lãnh đạo chủ động mời gọi và ghi nhận đóng góp của người khác, các thành viên — nhất là người có vị thế thấp hơn — cảm thấy an toàn tâm lý hơn để lên tiếng. Thói quen thực hành: hỏi những người ít nói trước, mời ý kiến phản biện trước khi quyết định, giải thích ý kiến đóng góp đã được dùng thế nào, và kiểm tra xem các nhiệm vụ thử thách có luôn rơi vào cùng một vài người hay không.</p>
<h3>Văn hoá: nhắc ngắn (IBC201 đi sâu hơn)</h3>
<p>Dự án GLOBE (House và cộng sự, 2004) khảo sát các nhà quản lý cấp trung ở 62 xã hội và tóm lược điều mọi người coi là lãnh đạo xuất sắc thành sáu chiều <strong>lý thuyết lãnh đạo ngầm được văn hoá tán thành (CLT)</strong>:</p>
<table>
<tr><th>Chiều CLT</th><th>Qua các nền văn hoá</th></tr>
<tr><td>Lôi cuốn / dựa trên giá trị</td><td>Được coi là góp phần vào lãnh đạo xuất sắc ở hầu hết mọi nơi</td></tr>
<tr><td>Hướng về đội nhóm</td><td>Được coi là góp phần ở hầu hết mọi nơi</td></tr>
<tr><td>Cùng tham gia</td><td>Nhìn chung tích cực, nhưng được coi trọng ở nhóm văn hoá này hơn nhóm khác</td></tr>
<tr><td>Hướng về nhân văn</td><td>Nhìn chung tích cực, có khác biệt</td></tr>
<tr><td>Tự chủ</td><td>Thay đổi từ hơi cản trở tới hơi góp phần</td></tr>
<tr><td>Tự bảo vệ</td><td>Nhìn chung bị coi là cản trở, dù ít hơn ở một số nhóm văn hoá</td></tr>
</table>
<p>GLOBE cũng tìm thấy những thuộc tính được tán thành gần như ở mọi nơi — ví dụ đáng tin cậy, công bằng, trung thực, biết khích lệ và quyết đoán — và những thuộc tính bị bác bỏ gần như ở mọi nơi, như tàn nhẫn, vị kỷ hay độc đoán. Bài học: <em>cốt lõi</em> của lãnh đạo tốt có tính phổ quát, nhưng cách <em>thể hiện</em> (phản biện thẳng tới đâu, tham vấn nhiều đến mức nào) phải được điều chỉnh. Hãy kiểm tra xem một quốc gia có thực sự nằm trong mẫu của GLOBE hay không trước khi dùng điểm số của nước đó.</p>
<h3>Phát triển người lãnh đạo</h3>
<ul>
<li><strong>Phản hồi 360 độ</strong> — đánh giá cùng một bộ hành vi từ bản thân, cấp trên, đồng nghiệp, cấp dưới trực tiếp và đôi khi khách hàng. Thực hành tốt: dùng cho phát triển thay vì quyết định lương thưởng, gộp nhiều người đánh giá trong mỗi nhóm để không ai bị nhận diện, và theo sau bằng một kế hoạch phát triển có coach đồng hành. Phân tích tổng hợp của Smither, London và Reilly (2005) thấy mức cải thiện sau phản hồi đa nguồn thường <em>nhỏ</em>, và dễ xảy ra hơn khi người nhận chấp nhận mình cần thay đổi, đặt mục tiêu cụ thể và hành động.</li>
<li><strong>Coaching</strong> — quan hệ một kèm một, tập trung vào mục tiêu. Các phân tích tổng hợp (ví dụ Theeboom và cộng sự, 2014) báo cáo tác động trung bình tích cực tới thành tích, sức khoẻ tinh thần và mức đạt mục tiêu, dù nhiều nghiên cứu có quy mô nhỏ.</li>
<li><strong>Kèm cặp (mentoring) và nhiệm vụ thử thách</strong> — nghiên cứu "bài học từ kinh nghiệm" tại Center for Creative Leadership cho thấy người lãnh đạo học nhiều nhất từ những công việc vượt sức, khó khăn và từ người khác. Quy tắc <strong>70-20-10</strong> phổ biến (70% kinh nghiệm, 20% quan hệ, 10% khoá học) là một hướng dẫn thô rút ra từ nghiên cứu đó, không phải một tỷ lệ đo đạc chính xác.</li>
<li><strong>Đào tạo chính quy</strong> — phân tích tổng hợp của Lacerenza và cộng sự (2017) thấy đào tạo lãnh đạo trung bình cải thiện việc học, hành vi trong công việc và kết quả, nhất là khi dựa trên phân tích nhu cầu, có thực hành và phản hồi, và được chia thành nhiều buổi.</li>
</ul>
<pre><code class="language-text">KẾ HOẠCH PHÁT TRIỂN CÁ NHÂN (IDP) — một trang, xem lại mỗi quý
1. Điểm mạnh cần tiếp tục phát huy   (bằng chứng: báo cáo 360, kết quả)
2. Một hoặc hai mục tiêu phát triển  (hành vi cụ thể, không phải phẩm chất)
3. Hành động  70: nhiệm vụ thử thách · 20: người kèm cặp / coach · 10: khoá học
4. Hỗ trợ cần có                     (cấp trên, ngân sách, thời gian)
5. Thước đo tiến bộ                  (lặp lại khảo sát nhanh, hành vi quan sát được)
6. Tiến độ và ngày xem lại</code></pre>
<div class="callout"><span class="badge">Kiểm tra bằng chứng — trung bình</span> Các phân tích tổng hợp về khác biệt giới có quy mô lớn và nhất quán, nhưng khác biệt tìm thấy là nhỏ và phụ thuộc bối cảnh. GLOBE là nghiên cứu lớn nhất về văn hoá và lãnh đạo, song các lựa chọn đo lường của nó vẫn còn tranh luận. Phát triển năng lực lãnh đạo nhìn chung có tác dụng, với mức tác động vừa phải phụ thuộc nhiều vào thiết kế và việc theo dõi sau đó.</div>`,
  ]]);

const c15e = doc('lds301-5-4-exercise', 'Exercise 3 — Leading change at a fictional retail chain|||Bài tập 3 — Dẫn dắt thay đổi ở một chuỗi bán lẻ hư cấu',
  'Bài tập tình huống giả định: chuỗi 40 cửa hàng sách – văn phòng phẩm hư cấu chuyển từ kiểm kho giấy sang ứng dụng di động; lập bản đồ bên liên quan theo quyền lực × thái độ và tính chỉ số ủng hộ minh hoạ, lập kế hoạch 8 bước Kotter, chọn chiến thuật ảnh hưởng cho từng nhóm; kèm lời giải.',
  [[
    `<span class="eyebrow">LDS301 · Part 5 · Exercise</span>
<h2>Exercise 3 — from paper stock counts to a mobile app</h2>
<div class="callout"><span class="badge">Problem</span> Omega Retail is a fictional chain of 40 book-and-stationery stores; all people and figures are illustrative. Store managers still count stock on paper and type weekly reports. In an 8-week pilot in 3 stores, a mobile inventory app cut reporting time from 6 to 2 hours per store per week and cut stock discrepancies from 5.0% to 1.5% of items. The CEO wants all stores on the app within a year, but reactions are mixed.<br><br>
For teaching purposes, each stakeholder group is rated for <strong>power</strong> over the change (1 = low to 5 = high) and current <strong>attitude</strong> (−2 = strongly opposed to +2 = strongly supportive):<br>
CEO 5, +2 · CFO 4, −1 (worried about device costs) · store managers 4, −1 (fear losing control and extra work during go-live) · IT manager 3, +2 · store staff 2, −2 (fear being monitored or replaced) · employee representatives 3, 0 · HR head 3, +1.<br><br>
(a) Quantify the pilot results for one store, the pilot and the whole chain. (b) Place each group on a power × attitude grid (high power = 3 or more) and compute an illustrative <em>support index</em> = Σ(power × attitude) / Σ power, now and for a target in which the CFO, store managers and employee representatives move to +1 and store staff to 0. (c) Draft a Kotter eight-step plan with one concrete action per step. (d) Choose influence tactics for the four groups you need to move, and name one tactic to avoid.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Time saved per store  = 6 − 2 = 4 hours/week   (−66.7%)
    Pilot (3 stores)      = 3 x 4  = 12 hours/week
    Chain (40 stores)     = 40 x 4 = 160 hours/week, if pilot results hold
    Discrepancies         = 5.0% − 1.5% = 3.5 points  (−70% relative)

(b) Group             Power  Attitude  P x A   Quadrant
    CEO                 5      +2       +10    high power / supportive
    CFO                 4      −1        −4    high power / opposed
    Store managers      4      −1        −4    high power / opposed
    IT manager          3      +2        +6    high power / supportive
    Store staff         2      −2        −4    low power  / opposed
    Employee reps       3       0         0    high power / neutral
    HR head             3      +1        +3    high power / supportive
    Totals             24                +7    index now    = 7 / 24  = 0.29
    Target: 10 + 4 + 4 + 6 + 0 + 3 + 3 = +30   index target = 30 / 24 = 1.25</code></pre>
<table>
<tr><th>Kotter step</th><th>Concrete action at Omega (illustrative)</th></tr>
<tr><td>1. Urgency</td><td>Share the pilot data and store-level stock-out complaints at the managers' meeting; say honestly what the paper process costs</td></tr>
<tr><td>2. Guiding coalition</td><td>CEO as sponsor, IT manager, HR head, two respected pilot-store managers and one employee representative</td></tr>
<tr><td>3. Vision and strategy</td><td>"Less time counting, more time with customers"; roll out to the remaining 37 stores in waves of 10, 10, 10 and 7</td></tr>
<tr><td>4. Communicate</td><td>Pilot managers explain it store to store; short videos; a written FAQ that states what the app will and will not be used for</td></tr>
<tr><td>5. Empower action</td><td>Hands-on training, spare devices, an extra person in each store during go-live week; drop the old paper report once the app is live</td></tr>
<tr><td>6. Short-term wins</td><td>Publish hours saved per store after wave 1 and thank the teams by name</td></tr>
<tr><td>7. Consolidate</td><td>Use the credibility to automate reordering; keep going after wave 1 instead of declaring victory</td></tr>
<tr><td>8. Anchor</td><td>Add stock accuracy and customer time to store scorecards, onboarding and promotion criteria</td></tr>
</table>
<table>
<tr><th>Group</th><th>Tactics</th><th>Avoid</th></tr>
<tr><td>CFO</td><td>Rational persuasion (cost of hours and discrepancies vs device cost); consultation — let the CFO set the go/no-go criteria for each wave</td><td>Pressure through the CEO alone</td></tr>
<tr><td>Store managers</td><td>Consultation and collaboration — they help design the rollout calendar; coalition with the respected pilot managers</td><td>Legitimating tactics ("head office has decided")</td></tr>
<tr><td>Store staff</td><td>Collaboration (training, time, support) and inspirational appeal (more time with customers); clear written limits on how app data may be used</td><td>Pressure or threats — they create resistance</td></tr>
<tr><td>Employee representatives</td><td>Consultation before announcement; apprising — show how the change benefits the staff they represent (less time counting stock, more time with customers, written limits on how app data may be used)</td><td>Manipulation or co-optation</td></tr>
</table>
<p><strong>Why:</strong> most of the rise from 0.29 to 1.25 (+19 of the +23 points) comes from the three high-power groups that are opposed or neutral — moving the CFO, store managers and employee representatives alone lifts the index to 26 / 24 ≈ 1.08, and moving store staff from −2 to 0 adds the remaining +4 — which is why the plan spends most of its effort on those three groups. Their objections are also information: device cost, workload at go-live and fear of monitoring are real design questions, so answering them improves the change rather than just "selling" it. Staff have low individual power but they carry out the new process every day, so their commitment, not mere compliance, decides whether the app is used well. Note that the power–attitude scores and the index are teaching devices, not standard metrics; in practice they are judgements to discuss with the guiding coalition.</p>`,
    `<span class="eyebrow">LDS301 · Phần 5 · Bài tập</span>
<h2>Bài tập 3 — từ kiểm kho bằng giấy sang ứng dụng di động</h2>
<div class="callout"><span class="badge">Đề</span> Omega Retail là một chuỗi hư cấu gồm 40 cửa hàng sách – văn phòng phẩm; mọi nhân vật và số liệu là minh hoạ giả định. Các cửa hàng trưởng vẫn kiểm kho bằng giấy và gõ báo cáo hằng tuần. Trong đợt thí điểm 8 tuần ở 3 cửa hàng, một ứng dụng kiểm kho di động giảm thời gian làm báo cáo từ 6 xuống 2 giờ mỗi cửa hàng mỗi tuần và giảm chênh lệch tồn kho từ 5,0% xuống 1,5% số mặt hàng. Tổng giám đốc muốn mọi cửa hàng dùng ứng dụng trong vòng một năm, nhưng phản ứng còn trái chiều.<br><br>
Để học tập, mỗi nhóm bên liên quan được chấm <strong>quyền lực</strong> đối với thay đổi (1 = thấp tới 5 = cao) và <strong>thái độ</strong> hiện tại (−2 = phản đối mạnh tới +2 = ủng hộ mạnh):<br>
Tổng giám đốc 5, +2 · Giám đốc tài chính 4, −1 (lo chi phí thiết bị) · cửa hàng trưởng 4, −1 (sợ mất quyền kiểm soát và thêm việc lúc triển khai) · trưởng IT 3, +2 · nhân viên cửa hàng 2, −2 (sợ bị giám sát hoặc bị thay thế) · đại diện người lao động 3, 0 · trưởng phòng nhân sự 3, +1.<br><br>
(a) Lượng hoá kết quả thí điểm cho một cửa hàng, cho đợt thí điểm và cho cả chuỗi. (b) Đặt từng nhóm lên lưới quyền lực × thái độ (quyền lực cao = từ 3 trở lên) và tính <em>chỉ số ủng hộ</em> minh hoạ = Σ(quyền lực × thái độ) / Σ quyền lực, hiện tại và ở mục tiêu trong đó giám đốc tài chính, cửa hàng trưởng và đại diện người lao động chuyển sang +1, nhân viên cửa hàng sang 0. (c) Lập kế hoạch tám bước Kotter với một hành động cụ thể cho mỗi bước. (d) Chọn chiến thuật ảnh hưởng cho bốn nhóm cần thay đổi thái độ, và nêu một chiến thuật nên tránh.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Tiết kiệm mỗi cửa hàng  = 6 − 2 = 4 giờ/tuần   (−66,7%)
    Thí điểm (3 cửa hàng)   = 3 x 4  = 12 giờ/tuần
    Cả chuỗi (40 cửa hàng)  = 40 x 4 = 160 giờ/tuần, nếu kết quả thí điểm giữ được
    Chênh lệch tồn kho      = 5,0% − 1,5% = 3,5 điểm %  (giảm tương đối 70%)

(b) Nhóm                  QL    Thái độ   QL x TĐ   Ô trên lưới
    Tổng giám đốc          5      +2       +10     QL cao / ủng hộ
    GĐ tài chính           4      −1        −4     QL cao / phản đối
    Cửa hàng trưởng        4      −1        −4     QL cao / phản đối
    Trưởng IT              3      +2        +6     QL cao / ủng hộ
    Nhân viên cửa hàng     2      −2        −4     QL thấp / phản đối
    Đại diện NLĐ           3       0         0     QL cao / trung lập
    Trưởng phòng nhân sự   3      +1        +3     QL cao / ủng hộ
    Tổng                  24                +7     chỉ số hiện tại = 7 / 24  = 0,29
    Mục tiêu: 10 + 4 + 4 + 6 + 0 + 3 + 3 = +30     chỉ số mục tiêu = 30 / 24 = 1,25</code></pre>
<table>
<tr><th>Bước Kotter</th><th>Hành động cụ thể ở Omega (minh hoạ)</th></tr>
<tr><td>1. Cấp bách</td><td>Chia sẻ dữ liệu thí điểm và phàn nàn hết hàng ở từng cửa hàng tại cuộc họp cửa hàng trưởng; nói thẳng quy trình giấy đang tốn kém thế nào</td></tr>
<tr><td>2. Liên minh dẫn dắt</td><td>Tổng giám đốc bảo trợ, trưởng IT, trưởng phòng nhân sự, hai cửa hàng trưởng thí điểm được kính trọng và một đại diện người lao động</td></tr>
<tr><td>3. Tầm nhìn và chiến lược</td><td>"Bớt thời gian đếm hàng, thêm thời gian với khách"; triển khai cho 37 cửa hàng còn lại theo các đợt 10, 10, 10 và 7</td></tr>
<tr><td>4. Truyền đạt</td><td>Cửa hàng trưởng thí điểm đi giải thích từng cửa hàng; video ngắn; bộ hỏi–đáp bằng văn bản nêu rõ ứng dụng sẽ và sẽ không được dùng vào việc gì</td></tr>
<tr><td>5. Trao quyền hành động</td><td>Đào tạo thực hành, thiết bị dự phòng, thêm một người ở mỗi cửa hàng trong tuần triển khai; bỏ báo cáo giấy cũ ngay khi ứng dụng chạy</td></tr>
<tr><td>6. Thắng lợi ngắn hạn</td><td>Công bố số giờ tiết kiệm của từng cửa hàng sau đợt 1 và cảm ơn các đội bằng tên</td></tr>
<tr><td>7. Củng cố</td><td>Dùng uy tín đó để tự động hoá việc đặt hàng lại; tiếp tục sau đợt 1 thay vì tuyên bố chiến thắng</td></tr>
<tr><td>8. Neo vào văn hoá</td><td>Đưa độ chính xác tồn kho và thời gian phục vụ khách vào thẻ điểm cửa hàng, chương trình hội nhập và tiêu chí đề bạt</td></tr>
</table>
<table>
<tr><th>Nhóm</th><th>Chiến thuật</th><th>Nên tránh</th></tr>
<tr><td>Giám đốc tài chính</td><td>Thuyết phục lý trí (chi phí của số giờ và chênh lệch tồn kho so với chi phí thiết bị); tham vấn — để giám đốc tài chính đặt tiêu chí đi tiếp/dừng cho từng đợt</td><td>Gây sức ép chỉ thông qua tổng giám đốc</td></tr>
<tr><td>Cửa hàng trưởng</td><td>Tham vấn và hợp tác — họ cùng thiết kế lịch triển khai; liên minh với các cửa hàng trưởng thí điểm được kính trọng</td><td>Hợp thức hoá ("công ty đã quyết")</td></tr>
<tr><td>Nhân viên cửa hàng</td><td>Hợp tác (đào tạo, thời gian, hỗ trợ) và kêu gọi truyền cảm hứng (thêm thời gian với khách); giới hạn rõ bằng văn bản về cách được dùng dữ liệu của ứng dụng</td><td>Gây sức ép hoặc đe doạ — sẽ tạo ra kháng cự</td></tr>
<tr><td>Đại diện người lao động</td><td>Tham vấn trước khi công bố; cho biết lợi ích — chỉ ra thay đổi mang lại lợi ích gì cho chính những người lao động họ đại diện (bớt thời gian đếm hàng, thêm thời gian với khách, giới hạn bằng văn bản về cách dùng dữ liệu của ứng dụng)</td><td>Thao túng hoặc lôi kéo</td></tr>
</table>
<p><strong>Vì sao:</strong> phần lớn mức tăng từ 0,29 lên 1,25 (+19 trên +23 điểm) đến từ ba nhóm quyền lực cao đang phản đối hoặc trung lập — chỉ riêng giám đốc tài chính, cửa hàng trưởng và đại diện người lao động đổi thái độ đã đưa chỉ số lên 26 / 24 ≈ 1,08, còn nhân viên cửa hàng chuyển từ −2 lên 0 góp nốt +4 — đó là lý do kế hoạch dồn phần lớn công sức vào ba nhóm này. Phản đối của họ cũng là thông tin: chi phí thiết bị, khối lượng việc lúc triển khai và nỗi sợ bị giám sát là những câu hỏi thiết kế có thật, nên trả lời chúng làm thay đổi tốt hơn chứ không chỉ để "bán" nó. Nhân viên có quyền lực cá nhân thấp nhưng là người vận hành quy trình mới mỗi ngày, nên sự cam kết của họ, chứ không chỉ sự tuân thủ, quyết định ứng dụng có được dùng tốt hay không. Lưu ý điểm quyền lực – thái độ và chỉ số ở đây là công cụ dạy học, không phải thước đo chuẩn; trong thực tế chúng là những phán đoán cần thảo luận với liên minh dẫn dắt.</p>`,
  ]]);

const c15q = quiz('lds301-quiz-5', 'Quiz 5 — Change, diversity and development|||Quiz 5 — Thay đổi, đa dạng và phát triển', [
  { id: 'q1', question: 'The problem is clearly defined, but the solution requires learning and the work must be shared by the authority and the people involved. In Heifetz’s terms this is…|||Vấn đề đã được xác định rõ, nhưng lời giải cần học hỏi và công việc phải được chia sẻ giữa người có quyền hạn và những người liên quan. Theo Heifetz, đây là…', options: ['A technical challenge|||Thách thức kỹ thuật', 'A technical and adaptive challenge|||Thách thức kỹ thuật và thích ứng', 'An adaptive challenge|||Thách thức thích ứng', 'A task-structure problem|||Vấn đề cấu trúc nhiệm vụ'], correctIndex: 1, explanation: 'Technical: clear problem and clear solution; technical and adaptive: clear problem, solution requires learning; adaptive: both require learning. Task structure belongs to Fiedler’s model.|||Kỹ thuật: vấn đề rõ và lời giải rõ; kỹ thuật và thích ứng: vấn đề rõ, lời giải cần học hỏi; thích ứng: cả hai đều cần học hỏi. Cấu trúc nhiệm vụ thuộc mô hình của Fiedler.' },
  { id: 'q2', question: 'In Kotter’s eight-step model, which step comes immediately after creating a guiding coalition?|||Trong mô hình tám bước của Kotter, bước nào đứng ngay sau bước lập liên minh dẫn dắt?', options: ['Generate short-term wins|||Tạo thắng lợi ngắn hạn', 'Anchor new approaches in the culture|||Neo cách làm mới vào văn hoá', 'Develop a vision and strategy|||Xây dựng tầm nhìn và chiến lược', 'Empower broad-based action|||Trao quyền hành động trên diện rộng'], correctIndex: 2, explanation: 'The order is urgency, guiding coalition, vision and strategy, communicate, empower, short-term wins, consolidate, anchor.|||Thứ tự là cấp bách, liên minh dẫn dắt, tầm nhìn và chiến lược, truyền đạt, trao quyền, thắng lợi ngắn hạn, củng cố, neo vào văn hoá.' },
  { id: 'q3', question: 'Role congruity theory (Eagly and Karau) explains prejudice against women leaders mainly as the result of…|||Thuyết phù hợp vai trò (Eagly và Karau) giải thích định kiến với nữ lãnh đạo chủ yếu là kết quả của…', options: ['A perceived mismatch between stereotypes of women and stereotypes of leaders|||Sự không khớp được cảm nhận giữa khuôn mẫu về phụ nữ và khuôn mẫu về người lãnh đạo', 'Large measured differences in effectiveness between men and women|||Khác biệt lớn đã đo được về hiệu quả giữa nam và nữ', 'Lower extraversion scores among women|||Điểm hướng ngoại thấp hơn ở phụ nữ', 'Laws that bar women from managerial jobs|||Luật cấm phụ nữ giữ vị trí quản lý'], correctIndex: 0, explanation: 'The leader stereotype (agentic) clashes with the female stereotype (communal), so women are rated as having less potential and their assertive behaviour is judged more harshly; meta-analyses find no overall effectiveness gap.|||Khuôn mẫu người lãnh đạo (quyết đoán) va chạm với khuôn mẫu nữ giới (hướng cộng đồng), nên phụ nữ bị đánh giá ít tiềm năng hơn và hành vi quyết đoán của họ bị đánh giá khắt khe hơn; các phân tích tổng hợp không thấy khoảng cách hiệu quả tổng thể.' },
]);

const taiLieu = doc('lds301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">LDS301 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning leadership: the official syllabus and slides, the two standard textbooks, free open resources, video channels, tools for the exercises and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account. When this course was written (September 2026), no public LDS301 syllabus could be found on FLM by course code or by name, so this Academy course follows the structure of Northouse's textbook. <strong>Read the official LDS301 syllabus on FLM once your lecturer publishes it</strong>, and follow its chapters, weighting and assessment where they differ from this course.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://uk.sagepub.com/en-gb/eur/leadership/book283944" target="_blank" rel="noopener">Leadership: Theory and Practice</a> — Peter G. Northouse (SAGE): the most widely adopted leadership textbook; one chapter per theory, each with strengths, criticisms and cases. Parts 1–5 of this course follow its structure.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/leadership-in-organizations/P200000006445/9780135641255" target="_blank" rel="noopener">Leadership in Organizations</a> — Gary A. Yukl &amp; William L. Gardner (Pearson): deeper on power, influence tactics, leading change and research evidence.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://openstax.org/details/books/organizational-behavior" target="_blank" rel="noopener">OpenStax — Organizational Behavior</a> — free open textbook; chapter 12 covers leadership (traits, behaviour, situational, transformational) and chapter 13 power and politics.</li>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management</a> — free open textbook; chapter 12 covers diversity and inclusion in the workplace.</li>
<li><a href="https://www.shrm.org/" target="_blank" rel="noopener">SHRM</a> — Society for Human Resource Management: articles and toolkits on developing leaders, 360-degree feedback and coaching (some content is for members only).</li>
<li><a href="https://rework.withgoogle.com/" target="_blank" rel="noopener">Google re:Work</a> — free guides on manager effectiveness and team research from Google.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — short talks on leading teams, change and difficult conversations.</li>
<li><a href="https://www.youtube.com/@Stanfordgsb" target="_blank" rel="noopener">Stanford Graduate School of Business</a> — lectures and interviews on leadership, power and influence.</li>
<li><a href="https://www.youtube.com/@LondonBusinessSchool" target="_blank" rel="noopener">London Business School</a> — faculty talks on leadership, organisations and change.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — talks on leadership and motivation; check popular claims against the evidence checks in this course.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — online whiteboard for stakeholder maps, force-field analysis and change plans (Exercise 3).</li>
<li><a href="https://www.google.com/forms/about/" target="_blank" rel="noopener">Google Forms</a> — anonymous pulse surveys and simple feedback forms for a class project.</li>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> — keep a personal development plan (IDP) and track its actions each quarter.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — definitions, power and influence, and the trait, skills and behavioural approaches (Introduction and Part 1–2 here).</li>
<li><strong>Practise diagnosis</strong> — redo Exercises 1 and 2 with situations from your own clubs, internships or group projects.</li>
<li><strong>Go deeper</strong> — for each theory, read the criticisms section of the matching Northouse chapter and state its evidence level in one sentence.</li>
<li><strong>Apply</strong> — plan a real change in a student organisation with Kotter's steps and a stakeholder map, then write a one-page IDP for yourself.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides, books or questionnaires (for example the MLQ, the LPC scale or Northouse's self-assessments) are reproduced or embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">LDS301 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học lãnh đạo: giáo trình &amp; slide chính thức, hai giáo trình chuẩn, tài liệu mở miễn phí, kênh video, công cụ cho bài tập, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU. Khi soạn môn này (tháng 9/2026), chưa tìm thấy đề cương LDS301 công khai trên FLM theo mã môn lẫn theo tên môn, nên khoá học trên Academy bám theo cấu trúc giáo trình của Northouse. <strong>Đề cương môn xem trên FLM khi được giảng viên công bố</strong>, và hãy theo chương, trọng số và cách đánh giá trong đề cương ở những chỗ khác với khoá học này.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://uk.sagepub.com/en-gb/eur/leadership/book283944" target="_blank" rel="noopener">Leadership: Theory and Practice</a> — Peter G. Northouse (SAGE): giáo trình lãnh đạo được dùng rộng rãi nhất; mỗi chương một lý thuyết, đều có điểm mạnh, phê bình và tình huống. Phần 1–5 của khoá học này bám theo cấu trúc của sách.</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/leadership-in-organizations/P200000006445/9780135641255" target="_blank" rel="noopener">Leadership in Organizations</a> — Gary A. Yukl &amp; William L. Gardner (Pearson): sâu hơn về quyền lực, chiến thuật ảnh hưởng, dẫn dắt thay đổi và bằng chứng nghiên cứu.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://openstax.org/details/books/organizational-behavior" target="_blank" rel="noopener">OpenStax — Organizational Behavior</a> — giáo trình mở miễn phí; chương 12 về lãnh đạo (phẩm chất, hành vi, tình huống, chuyển đổi) và chương 13 về quyền lực và chính trị trong tổ chức.</li>
<li><a href="https://openstax.org/details/books/principles-management" target="_blank" rel="noopener">OpenStax — Principles of Management</a> — giáo trình mở miễn phí; chương 12 về đa dạng và hoà nhập nơi làm việc.</li>
<li><a href="https://www.shrm.org/" target="_blank" rel="noopener">SHRM</a> — Hiệp hội Quản trị Nhân sự (Society for Human Resource Management): bài viết và bộ công cụ về phát triển người lãnh đạo, phản hồi 360 độ và coaching (một phần nội dung chỉ dành cho hội viên).</li>
<li><a href="https://rework.withgoogle.com/" target="_blank" rel="noopener">Google re:Work</a> — hướng dẫn miễn phí về hiệu quả của người quản lý và nghiên cứu đội nhóm của Google.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — bài nói ngắn về lãnh đạo đội nhóm, thay đổi và những cuộc trò chuyện khó.</li>
<li><a href="https://www.youtube.com/@Stanfordgsb" target="_blank" rel="noopener">Stanford Graduate School of Business</a> — bài giảng và phỏng vấn về lãnh đạo, quyền lực và ảnh hưởng.</li>
<li><a href="https://www.youtube.com/@LondonBusinessSchool" target="_blank" rel="noopener">London Business School</a> — giảng viên trình bày về lãnh đạo, tổ chức và thay đổi.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — bài nói về lãnh đạo và động lực; hãy đối chiếu những nhận định phổ biến với các mục kiểm tra bằng chứng trong khoá học.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bảng trắng trực tuyến để vẽ bản đồ bên liên quan, phân tích trường lực và kế hoạch thay đổi (Bài tập 3).</li>
<li><a href="https://www.google.com/forms/about/" target="_blank" rel="noopener">Google Forms</a> — khảo sát nhanh ẩn danh và biểu mẫu phản hồi đơn giản cho dự án lớp.</li>
<li><a href="https://www.notion.so/" target="_blank" rel="noopener">Notion</a> — lưu kế hoạch phát triển cá nhân (IDP) và theo dõi các hành động mỗi quý.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — định nghĩa, quyền lực và ảnh hưởng, cách tiếp cận phẩm chất, kỹ năng và hành vi (phần Giới thiệu và Phần 1–2 ở đây).</li>
<li><strong>Luyện chẩn đoán</strong> — làm lại Bài tập 1 và 2 với tình huống từ câu lạc bộ, kỳ thực tập hoặc dự án nhóm của chính bạn.</li>
<li><strong>Đào sâu</strong> — với mỗi lý thuyết, đọc mục phê bình trong chương tương ứng của sách Northouse và nêu mức bằng chứng của nó trong một câu.</li>
<li><strong>Vận dụng</strong> — lập kế hoạch một thay đổi thật trong tổ chức sinh viên bằng các bước của Kotter và bản đồ bên liên quan, rồi viết một IDP một trang cho chính mình.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không chép hay nhúng slide, sách hoặc bảng hỏi có bản quyền (ví dụ MLQ, thang LPC hay các bảng tự đánh giá trong sách của Northouse). Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'LDS301',
    slug: 'lds301-leadership',
    title: 'Leadership',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LDS301.webp',
    shortDescription: 'Where leaders get influence and when a style works: power, traits, skills, behaviour, Fiedler, SLII, LMX, teams, transformational, servant and ethical leadership, adaptive leadership and leading change. Bilingual, with evidence checks, exercises and quizzes.|||Ảnh hưởng của người lãnh đạo đến từ đâu, khi nào phong cách hiệu quả: quyền lực, phẩm chất, hành vi, Fiedler, SLII, LMX, lãnh đạo chuyển đổi, phục vụ, thích ứng, dẫn dắt thay đổi. Song ngữ, có bài tập, quiz.',
    description: 'Môn <strong>LDS301 — Leadership (Lãnh đạo)</strong> (khối Quản trị Kinh doanh, kỳ 4) thay chữ "lãnh đạo" mơ hồ bằng những khái niệm chính xác: người lãnh đạo làm gì, ảnh hưởng của họ đến từ đâu, và lý thuyết nào thực sự có bằng chứng. Từ <strong>định nghĩa, lãnh đạo và quản lý (Kotter), quyền lực và chiến thuật ảnh hưởng</strong> → <strong>phẩm chất, trí tuệ cảm xúc và kỹ năng</strong> (Stogdill, Big Five, Goleman, Katz, Mumford) → <strong>hành vi và ngẫu nhiên</strong> (Ohio State, Michigan, lưới Blake–Mouton, Fiedler, đường dẫn–mục tiêu) → <strong>lãnh đạo tình huống SLII, LMX và lãnh đạo đội nhóm</strong> → <strong>lãnh đạo chuyển đổi, đích thực, phục vụ, đạo đức và mặt tối</strong> → <strong>lãnh đạo thích ứng, dẫn dắt thay đổi (Lewin, Kotter), giới, văn hoá và phát triển người lãnh đạo</strong>. Bám cấu trúc giáo trình Northouse — Leadership: Theory and Practice, bổ sung Yukl &amp; Gardner và OpenStax; song ngữ Anh–Việt, mỗi bài có mục kiểm tra mức bằng chứng thực nghiệm, ba bài tập tình huống hư cấu kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Định nghĩa lãnh đạo như một quá trình ảnh hưởng và phân biệt lãnh đạo với quản lý theo Kotter\nPhân tích sáu nguồn quyền lực, 11 chiến thuật ảnh hưởng và ba kết quả cam kết – tuân thủ – kháng cự\nĐánh giá cách tiếp cận phẩm chất, trí tuệ cảm xúc và kỹ năng cùng tranh luận về bằng chứng\nDùng các nghiên cứu hành vi và lưới Blake–Mouton để mô tả phong cách nhiệm vụ – quan hệ\nChẩn đoán tình huống bằng mô hình Fiedler (octant, LPC) và lý thuyết đường dẫn – mục tiêu\nChẩn đoán mức phát triển D1–D4 theo từng nhiệm vụ và chọn phong cách S1–S4, hiểu giới hạn bằng chứng của SLII\nPhân biệt lãnh đạo chuyển đổi, giao dịch, đích thực, phục vụ, đạo đức và nhận diện lãnh đạo độc hại\nLập kế hoạch dẫn dắt thay đổi theo Kotter, bản đồ bên liên quan và kế hoạch phát triển cá nhân',
    requirements: 'Nên học trước OBE102c — Organizational Behavior (động lực, đội nhóm, giai đoạn Tuckman)\nNên học trước MGT103 — Introduction to Management (chức năng quản trị)\nKhông cần kiến thức toán; cần sẵn sàng phân tích tình huống và tự đánh giá bản thân',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Định nghĩa lãnh đạo, bổ nhiệm và nổi lên, lãnh đạo và quản lý, cách đọc bằng chứng.', lessons: [intro] },
    { title: 'Part 1 — Power, traits and skills|||Phần 1 — Quyền lực, phẩm chất và kỹ năng', description: 'French & Raven, chiến thuật ảnh hưởng của Yukl, Stogdill, Big Five, trí tuệ cảm xúc, Katz, Mumford.', lessons: [c1, c2, c3, c3q] },
    { title: 'Part 2 — Behaviour and contingency|||Phần 2 — Hành vi và ngẫu nhiên', description: 'Ohio State, Michigan, lưới lãnh đạo, Fiedler, đường dẫn–mục tiêu, yếu tố thay thế lãnh đạo.', lessons: [c4, c5, c6, c6e, c6q] },
    { title: 'Part 3 — Situational, relational and team leadership|||Phần 3 — Lãnh đạo tình huống, quan hệ và đội nhóm', description: 'SLII, LMX, vai trò người đi theo, mô hình lãnh đạo đội nhóm của Hill.', lessons: [c7, c8, c9, c9e, c9q] },
    { title: 'Part 4 — Transformational, values-based and ethical leadership|||Phần 4 — Lãnh đạo chuyển đổi, dựa trên giá trị và đạo đức', description: 'Burns, Bass, bốn chữ I, lãnh đạo đích thực, phục vụ, đạo đức, lãnh đạo độc hại.', lessons: [c10, c11, c12, c12q] },
    { title: 'Part 5 — Change, diversity and development|||Phần 5 — Thay đổi, đa dạng và phát triển', description: 'Heifetz, Lewin, Kotter, kháng cự thay đổi, giới, GLOBE, phản hồi 360 độ, coaching, IDP.', lessons: [c13, c14, c15, c15e, c15q] },
  ],
};
