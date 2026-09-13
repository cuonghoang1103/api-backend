/**
 * ECO102 — Business Environment (Môi trường kinh doanh). Khối Quản trị Kinh doanh, kỳ 1.
 * Bám cấu trúc giáo trình "business environment" chuẩn quốc tế (Worthington & Britton —
 * The Business Environment: A Global Perspective; Wetherly & Otter — The Business Environment:
 * Themes and Issues): doanh nghiệp như hệ thống mở, loại hình tổ chức & các bên liên quan,
 * PESTLE, kinh tế vĩ mô, môi trường quốc tế, cấu trúc thị trường & năm lực lượng, công nghệ &
 * chuyển đổi số, pháp lý – đạo đức – CSR/ESG, quét môi trường – SWOT/TOWS – kịch bản.
 * Song ngữ + ví dụ (số đã kiểm; tình huống là GIẢ ĐỊNH, không có số liệu kinh tế thật) + bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('eco102-0-1-overview', 'Course overview: the business and its environment|||Tổng quan: doanh nghiệp và môi trường của nó',
  'Môi trường kinh doanh là gì, doanh nghiệp như một hệ thống mở (đầu vào – chuyển hoá – đầu ra – phản hồi), ba lớp môi trường (nội bộ, trực tiếp, tổng quát), quan hệ hai chiều giữa doanh nghiệp và môi trường, lộ trình môn.',
  [[
    `<span class="eyebrow">ECO102 · Lesson 0.1 · Overview</span>
<h2>Business Environment</h2>
<p class="lead">No business operates in a vacuum. The <strong>business environment</strong> is the set of internal and external factors — people, organizations, forces and institutions — that affect how a business operates and how well it performs. Managers who understand it can spot opportunities earlier, see threats coming and make better decisions.</p>
<h3>The business as an open system</h3>
<p>A business is an <strong>open system</strong>: it constantly exchanges resources and information with its surroundings.</p>
<pre><code class="language-text">ENVIRONMENT
  Inputs  ----->  Transformation  ----->  Outputs
  (labour, capital,   (production, service    (goods and services, profit,
   materials, energy,  delivery, management)    wages, taxes, waste, emissions)
   information)
       ^                                          |
       +-------------- feedback ------------------+
         (sales, customer reviews, prices, regulation, public opinion)</code></pre>
<p>Every stage depends on the environment: inputs come from labour and capital markets and suppliers; the transformation uses technology and must obey the law; outputs are bought by customers, taxed by governments and judged by society. Feedback tells the business whether it needs to adapt.</p>
<h3>Three layers of the environment</h3>
<table>
<tr><th>Layer</th><th>What it includes</th><th>Degree of control</th></tr>
<tr><td>Internal environment</td><td>Resources, structure, culture, people and systems of the organization</td><td>High — managed directly</td></tr>
<tr><td>Immediate (operational, task) environment</td><td>Customers, suppliers, competitors, intermediaries, lenders, the local labour market</td><td>Partial — can be influenced through negotiation and competition</td></tr>
<tr><td>General (contextual, macro) environment</td><td>Political, economic, social, technological, legal and ecological forces — often summarised as <strong>PESTLE</strong> — and the international context</td><td>Low — the firm mainly monitors and adapts</td></tr>
</table>
<h3>A two-way relationship</h3>
<p>The environment shapes businesses, but businesses also shape the environment: they create jobs, introduce new technologies, lobby governments, pollute or protect nature. Large firms can even change the rules of their industry. That is why the course ends with ethics, corporate social responsibility and ways of responding to — and influencing — change.</p>
<h3>Roadmap</h3>
<p>Part 1: organizations, objectives and stakeholders · Part 2: the macro environment (PESTLE, the macroeconomy, the international environment) · Part 3: industry, competition and technology · Part 4: law, ethics, CSR/ESG and how firms analyse and respond to their environment. Parts 1–3 include an exercise; every part ends with a quiz.</p>
<div class="callout"><span class="badge">Mindset</span> For any change in the world, ask three questions: "What is changing? How does it affect our inputs, our transformation or our outputs? What should we do about it?"</div>`,
    `<span class="eyebrow">ECO102 · Bài 0.1 · Tổng quan</span>
<h2>Môi trường kinh doanh</h2>
<p class="lead">Không doanh nghiệp nào hoạt động trong chân không. <strong>Môi trường kinh doanh</strong> là tập hợp các yếu tố bên trong và bên ngoài — con người, tổ chức, lực lượng và thể chế — tác động tới cách doanh nghiệp vận hành và kết quả hoạt động của nó. Nhà quản lý hiểu môi trường sẽ nhận ra cơ hội sớm hơn, thấy trước nguy cơ và ra quyết định tốt hơn.</p>
<h3>Doanh nghiệp như một hệ thống mở</h3>
<p>Doanh nghiệp là một <strong>hệ thống mở</strong>: nó liên tục trao đổi nguồn lực và thông tin với môi trường xung quanh.</p>
<pre><code class="language-text">MÔI TRƯỜNG
  Đầu vào  ----->  Chuyển hoá  ----->  Đầu ra
  (lao động, vốn,     (sản xuất, cung ứng     (hàng hoá và dịch vụ, lợi nhuận,
   nguyên liệu, năng   dịch vụ, quản lý)        tiền lương, thuế, chất thải, khí thải)
   lượng, thông tin)
       ^                                          |
       +--------------- phản hồi -----------------+
         (doanh số, đánh giá của khách hàng, giá cả, quy định, dư luận)</code></pre>
<p>Mọi khâu đều phụ thuộc môi trường: đầu vào đến từ thị trường lao động, thị trường vốn và nhà cung cấp; khâu chuyển hoá dùng công nghệ và phải tuân thủ pháp luật; đầu ra được khách hàng mua, bị Nhà nước đánh thuế và được xã hội đánh giá. Thông tin phản hồi cho doanh nghiệp biết mình có cần thích nghi hay không.</p>
<h3>Ba lớp môi trường</h3>
<table>
<tr><th>Lớp</th><th>Bao gồm</th><th>Mức độ kiểm soát</th></tr>
<tr><td>Môi trường nội bộ</td><td>Nguồn lực, cơ cấu, văn hoá, con người và hệ thống của tổ chức</td><td>Cao — quản lý trực tiếp</td></tr>
<tr><td>Môi trường trực tiếp (tác nghiệp, ngành)</td><td>Khách hàng, nhà cung cấp, đối thủ cạnh tranh, trung gian, người cho vay, thị trường lao động địa phương</td><td>Một phần — có thể tác động qua đàm phán và cạnh tranh</td></tr>
<tr><td>Môi trường tổng quát (vĩ mô)</td><td>Các lực lượng chính trị, kinh tế, xã hội, công nghệ, pháp lý và sinh thái — thường gọi tắt là <strong>PESTLE</strong> — cùng bối cảnh quốc tế</td><td>Thấp — doanh nghiệp chủ yếu theo dõi và thích nghi</td></tr>
</table>
<h3>Quan hệ hai chiều</h3>
<p>Môi trường định hình doanh nghiệp, nhưng doanh nghiệp cũng định hình môi trường: tạo việc làm, đưa công nghệ mới vào đời sống, vận động chính sách, gây ô nhiễm hoặc bảo vệ thiên nhiên. Doanh nghiệp lớn thậm chí có thể thay đổi "luật chơi" của cả ngành. Vì thế môn học kết thúc bằng đạo đức kinh doanh, trách nhiệm xã hội và các cách ứng phó với — cũng như tác động tới — sự thay đổi.</p>
<h3>Lộ trình</h3>
<p>Phần 1: tổ chức, mục tiêu và các bên liên quan · Phần 2: môi trường vĩ mô (PESTLE, kinh tế vĩ mô, môi trường quốc tế) · Phần 3: ngành, cạnh tranh và công nghệ · Phần 4: pháp luật, đạo đức, CSR/ESG và cách doanh nghiệp phân tích, ứng phó với môi trường. Phần 1–3 có bài tập; mỗi phần kết thúc bằng một bài quiz.</p>
<div class="callout"><span class="badge">Tư duy</span> Với mọi thay đổi trên thế giới, hãy hỏi ba câu: "Điều gì đang thay đổi? Nó tác động tới đầu vào, khâu chuyển hoá hay đầu ra của chúng ta? Chúng ta nên làm gì?"</div>`,
  ]]);

const c1 = doc('eco102-1-1-organizations-stakeholders', '1.1 — Organizations, objectives & stakeholders|||1.1 — Tổ chức, mục tiêu & các bên liên quan',
  'Ba khu vực (tư nhân, công, phi lợi nhuận), các loại hình pháp lý và trách nhiệm hữu hạn/vô hạn (kèm đối chiếu loại hình doanh nghiệp ở Việt Nam), các lý thuyết về mục tiêu doanh nghiệp, vấn đề người uỷ quyền – người đại diện, các bên liên quan và lưới quyền lực – quan tâm của Mendelow.',
  [[
    `<span class="eyebrow">ECO102 · Part 1 · Lesson 1.1</span>
<h2>Organizations, objectives &amp; stakeholders</h2>
<h3>Three sectors</h3>
<p>Organizations sit in the <strong>private sector</strong> (owned by individuals or shareholders, usually seeking profit), the <strong>public sector</strong> (owned or controlled by the state, e.g. public hospitals, state-owned enterprises) or the <strong>voluntary (third) sector</strong> (charities, associations, NGOs, pursuing a social purpose). Economic activity is also grouped into <strong>primary</strong> (extracting resources: farming, mining), <strong>secondary</strong> (manufacturing, construction) and <strong>tertiary</strong> (services) sectors.</p>
<h3>Legal forms of business</h3>
<table>
<tr><th>Form</th><th>Owners</th><th>Liability of owners</th><th>Typical fit</th></tr>
<tr><td>Sole trader (sole proprietorship)</td><td>One person</td><td>Unlimited — personal assets at risk</td><td>Small shops, freelancers</td></tr>
<tr><td>Partnership</td><td>Two or more partners</td><td>Usually unlimited for general partners</td><td>Professional firms (law, audit)</td></tr>
<tr><td>Private limited company</td><td>Members/shareholders; shares not offered to the public</td><td>Limited to capital contributed</td><td>Most SMEs and family firms</td></tr>
<tr><td>Public (joint stock) company</td><td>Shareholders; shares can be offered to the public</td><td>Limited to shares held</td><td>Large firms raising capital on stock markets</td></tr>
</table>
<p><strong>Limited liability</strong> and a <strong>separate legal personality</strong> make it easier to raise capital, but bring more disclosure and governance obligations. In Vietnam the Law on Enterprises provides the private enterprise (one individual owner, unlimited liability), the partnership company, the limited liability company (one member, or two to fifty members) and the joint stock company (at least three shareholders); household businesses are regulated separately. Check the text currently in force before relying on details.</p>
<h3>What do businesses try to achieve?</h3>
<ul>
<li><strong>Profit maximization</strong> — the classical assumption.</li>
<li><strong>Sales revenue maximization</strong> (Baumol) or <strong>growth</strong> — managers' pay and prestige often follow size.</li>
<li><strong>Satisficing</strong> (Herbert Simon) — aiming for satisfactory rather than maximum results across several goals, to keep different groups content.</li>
<li><strong>Social and public goals</strong> — service quality and value for money in the public sector; a mission in charities and social enterprises.</li>
</ul>
<p>In large companies ownership is separated from control, creating a <strong>principal–agent problem</strong>: managers (agents) may pursue their own interests rather than those of shareholders (principals). Corporate governance — boards, audits, incentive pay — tries to align them. Good objectives are <strong>SMART</strong>: specific, measurable, achievable, relevant and time-bound.</p>
<h3>Stakeholders</h3>
<p>A <strong>stakeholder</strong> is any group or individual who can affect, or is affected by, the achievement of an organization's objectives (a definition associated with R. Edward Freeman). They can be <strong>internal</strong> (employees, managers), <strong>connected</strong> (shareholders, customers, suppliers, lenders) or <strong>external</strong> (government, local communities, pressure groups, the media). Their interests often conflict: higher wages versus higher dividends, lower prices versus higher margins.</p>
<p><strong>Mendelow's power–interest grid</strong> helps decide how to manage each group:</p>
<table>
<tr><th></th><th>Low interest</th><th>High interest</th></tr>
<tr><td><strong>High power</strong></td><td>Keep satisfied</td><td>Key players — manage closely</td></tr>
<tr><td><strong>Low power</strong></td><td>Minimal effort — monitor</td><td>Keep informed</td></tr>
</table>
<div class="callout"><span class="badge">Watch out</span> Positions on the grid move. A low-power group can gain power by forming coalitions or attracting media attention, so the map must be reviewed regularly.</div>`,
    `<span class="eyebrow">ECO102 · Phần 1 · Bài 1.1</span>
<h2>Tổ chức, mục tiêu &amp; các bên liên quan</h2>
<h3>Ba khu vực</h3>
<p>Tổ chức thuộc <strong>khu vực tư nhân</strong> (do cá nhân hoặc cổ đông sở hữu, thường tìm kiếm lợi nhuận), <strong>khu vực công</strong> (Nhà nước sở hữu hoặc kiểm soát, vd bệnh viện công, doanh nghiệp nhà nước) hoặc <strong>khu vực tự nguyện (khu vực thứ ba)</strong> (quỹ từ thiện, hiệp hội, tổ chức phi chính phủ, theo đuổi mục đích xã hội). Hoạt động kinh tế còn được chia thành khu vực <strong>thứ nhất</strong> (khai thác tài nguyên: nông nghiệp, khai khoáng), <strong>thứ hai</strong> (chế biến chế tạo, xây dựng) và <strong>thứ ba</strong> (dịch vụ).</p>
<h3>Các loại hình pháp lý</h3>
<table>
<tr><th>Loại hình</th><th>Chủ sở hữu</th><th>Trách nhiệm của chủ sở hữu</th><th>Thường phù hợp với</th></tr>
<tr><td>Doanh nghiệp một chủ (sole trader)</td><td>Một người</td><td>Vô hạn — tài sản cá nhân có thể bị mất</td><td>Cửa hàng nhỏ, người làm tự do</td></tr>
<tr><td>Hợp danh</td><td>Hai thành viên trở lên</td><td>Thường vô hạn với thành viên hợp danh</td><td>Hãng dịch vụ chuyên môn (luật, kiểm toán)</td></tr>
<tr><td>Công ty trách nhiệm hữu hạn (tư)</td><td>Thành viên/cổ đông; không chào bán cổ phần ra công chúng</td><td>Hữu hạn trong phần vốn góp</td><td>Phần lớn doanh nghiệp nhỏ và vừa, doanh nghiệp gia đình</td></tr>
<tr><td>Công ty đại chúng (cổ phần)</td><td>Cổ đông; có thể chào bán cổ phần ra công chúng</td><td>Hữu hạn trong số cổ phần nắm giữ</td><td>Doanh nghiệp lớn huy động vốn trên thị trường chứng khoán</td></tr>
</table>
<p><strong>Trách nhiệm hữu hạn</strong> và <strong>tư cách pháp nhân độc lập</strong> giúp huy động vốn dễ hơn, đổi lại là nhiều nghĩa vụ công bố thông tin và quản trị hơn. Ở Việt Nam, Luật Doanh nghiệp quy định doanh nghiệp tư nhân (một cá nhân làm chủ, chịu trách nhiệm vô hạn), công ty hợp danh, công ty trách nhiệm hữu hạn (một thành viên, hoặc từ hai đến năm mươi thành viên) và công ty cổ phần (tối thiểu ba cổ đông); hộ kinh doanh được điều chỉnh riêng. Hãy kiểm văn bản đang có hiệu lực trước khi dựa vào chi tiết.</p>
<h3>Doanh nghiệp theo đuổi điều gì?</h3>
<ul>
<li><strong>Tối đa hoá lợi nhuận</strong> — giả định kinh điển.</li>
<li><strong>Tối đa hoá doanh thu</strong> (Baumol) hoặc <strong>tăng trưởng</strong> — thu nhập và uy tín của nhà quản lý thường đi theo quy mô.</li>
<li><strong>Thoả mãn vừa đủ</strong> (satisficing — Herbert Simon) — nhắm tới kết quả chấp nhận được thay vì tối đa ở nhiều mục tiêu cùng lúc, để các nhóm khác nhau đều hài lòng.</li>
<li><strong>Mục tiêu xã hội và công</strong> — chất lượng dịch vụ và hiệu quả sử dụng ngân sách ở khu vực công; sứ mệnh ở tổ chức từ thiện và doanh nghiệp xã hội.</li>
</ul>
<p>Ở công ty lớn, quyền sở hữu tách khỏi quyền điều hành, sinh ra <strong>vấn đề người uỷ quyền – người đại diện</strong>: nhà quản lý (người đại diện) có thể theo đuổi lợi ích riêng thay vì lợi ích của cổ đông (người uỷ quyền). Quản trị công ty — hội đồng quản trị, kiểm toán, thù lao gắn với kết quả — nhằm dung hoà hai bên. Mục tiêu tốt phải <strong>SMART</strong>: cụ thể, đo lường được, khả thi, phù hợp và có thời hạn.</p>
<h3>Các bên liên quan</h3>
<p><strong>Bên liên quan</strong> là bất kỳ nhóm hay cá nhân nào có thể tác động tới, hoặc bị tác động bởi, việc tổ chức đạt mục tiêu (định nghĩa gắn với R. Edward Freeman). Họ có thể là bên <strong>nội bộ</strong> (nhân viên, nhà quản lý), bên <strong>có liên hệ trực tiếp</strong> (cổ đông, khách hàng, nhà cung cấp, người cho vay) hoặc bên <strong>bên ngoài</strong> (Nhà nước, cộng đồng địa phương, nhóm gây áp lực, báo chí). Lợi ích của họ thường xung đột: lương cao hơn hay cổ tức cao hơn, giá thấp hơn hay biên lợi nhuận cao hơn.</p>
<p><strong>Lưới quyền lực – quan tâm của Mendelow</strong> giúp quyết định cách ứng xử với từng nhóm:</p>
<table>
<tr><th></th><th>Quan tâm thấp</th><th>Quan tâm cao</th></tr>
<tr><td><strong>Quyền lực cao</strong></td><td>Giữ cho hài lòng</td><td>Nhân vật then chốt — quản lý chặt chẽ</td></tr>
<tr><td><strong>Quyền lực thấp</strong></td><td>Nỗ lực tối thiểu — theo dõi</td><td>Thông tin đầy đủ</td></tr>
</table>
<div class="callout"><span class="badge">Lưu ý</span> Vị trí trên lưới luôn dịch chuyển. Một nhóm ít quyền lực có thể mạnh lên nhờ liên kết với nhóm khác hoặc thu hút sự chú ý của báo chí, nên bản đồ phải được rà lại thường xuyên.</div>`,
  ]]);

const c1e = doc('eco102-1-2-exercise', 'Exercise 1 — Stakeholder map for a new factory|||Bài tập 1 — Bản đồ các bên liên quan cho một nhà máy mới',
  'Bài tập tình huống giả định: chấm quyền lực và mức quan tâm của 8 bên liên quan, xếp vào lưới Mendelow, tính điểm ưu tiên, đề xuất chiến lược ứng xử cho từng nhóm và xử lý một xung đột lợi ích; kèm lời giải mẫu.',
  [[
    `<span class="eyebrow">ECO102 · Part 1 · Exercise 1</span>
<h2>Exercise 1 — who matters, and how to engage them</h2>
<div class="callout"><span class="badge">Problem</span> MekoFood (a fictional company), a mid-sized seafood processor, plans a new processing plant beside a riverside village. The project team scored each stakeholder's power and interest from 1 to 5 (4–5 = high, 1–3 = low): board and major shareholders — power 5, interest 5; the bank financing the project — 4, 4; provincial authorities (land, environmental permits) — 5, 3; current employees — 3, 4; local residents — 2, 5; a major overseas buyer — 4, 2; national media — 3, 2; a small local environmental group — 1, 5. (a) Place each group on Mendelow's grid and rank them by an attention score = power × interest. (b) Propose an engagement strategy for each quadrant. (c) Residents fear wastewater in the river; a treatment system above the legal minimum adds 4 billion dong to a 40 billion dong project (illustrative numbers). How should the firm handle this conflict?</div>
<h3>Model answer</h3>
<table>
<tr><th>Stakeholder</th><th>Power</th><th>Interest</th><th>Score</th><th>Quadrant</th></tr>
<tr><td>Board and major shareholders</td><td>5</td><td>5</td><td>25</td><td>Key players</td></tr>
<tr><td>Project bank</td><td>4</td><td>4</td><td>16</td><td>Key players</td></tr>
<tr><td>Provincial authorities</td><td>5</td><td>3</td><td>15</td><td>Keep satisfied</td></tr>
<tr><td>Current employees</td><td>3</td><td>4</td><td>12</td><td>Keep informed</td></tr>
<tr><td>Local residents</td><td>2</td><td>5</td><td>10</td><td>Keep informed</td></tr>
<tr><td>Overseas buyer</td><td>4</td><td>2</td><td>8</td><td>Keep satisfied</td></tr>
<tr><td>National media</td><td>3</td><td>2</td><td>6</td><td>Minimal effort — monitor</td></tr>
<tr><td>Local environmental group</td><td>1</td><td>5</td><td>5</td><td>Keep informed</td></tr>
</table>
<pre><code class="language-text">(b) Key players (board, bank)      -> involve in decisions: steering meetings, monthly reports,
                                      agree risk limits and milestones together
    Keep satisfied (province, buyer) -> meet their requirements early: full permit files,
                                      environmental impact assessment, buyer's audit standards
    Keep informed (employees,        -> regular two-way communication: town-hall meetings,
     residents, local group)          a public hotline, site visits, published water tests
    Monitor (national media)         -> prepare facts and a spokesperson; respond quickly

(c) Extra cost = 4 / 40 = 10% of the project budget.</code></pre>
<p>For (c), the firm should consult residents and the local group before construction, share independent water-test results, and present the treatment system to the board as <strong>risk management</strong>: it protects the environmental permit, the overseas buyer's audit and the company's reputation. A 10% cost increase is significant, so the board (key players) must approve it with clear evidence.</p>
<p><strong>Why:</strong> residents and the environmental group have little formal power today, but together with the media they could delay permits or trigger a buyer's audit — their power can rise quickly. Engaging them early is cheaper than repairing a conflict later. The grid is a starting point for judgement, not a mechanical rule.</p>`,
    `<span class="eyebrow">ECO102 · Phần 1 · Bài tập 1</span>
<h2>Bài tập 1 — ai quan trọng, và gắn kết họ thế nào</h2>
<div class="callout"><span class="badge">Đề</span> MekoFood (doanh nghiệp giả định), một công ty chế biến thuỷ sản quy mô vừa, dự định xây nhà máy chế biến mới cạnh một làng ven sông. Nhóm dự án chấm quyền lực và mức quan tâm của từng bên liên quan từ 1 đến 5 (4–5 = cao, 1–3 = thấp): hội đồng quản trị và cổ đông lớn — quyền lực 5, quan tâm 5; ngân hàng tài trợ dự án — 4, 4; chính quyền tỉnh (đất đai, giấy phép môi trường) — 5, 3; nhân viên hiện tại — 3, 4; người dân địa phương — 2, 5; một khách mua lớn ở nước ngoài — 4, 2; báo chí toàn quốc — 3, 2; một nhóm môi trường nhỏ ở địa phương — 1, 5. (a) Xếp từng nhóm vào lưới Mendelow và xếp hạng theo điểm ưu tiên = quyền lực × quan tâm. (b) Đề xuất chiến lược gắn kết cho từng ô. (c) Người dân lo nước thải đổ ra sông; một hệ thống xử lý vượt mức tối thiểu của luật làm dự án 40 tỷ đồng tăng thêm 4 tỷ đồng (số liệu minh hoạ giả định). Doanh nghiệp nên xử lý xung đột này thế nào?</div>
<h3>Lời giải mẫu</h3>
<table>
<tr><th>Bên liên quan</th><th>Quyền lực</th><th>Quan tâm</th><th>Điểm</th><th>Ô trên lưới</th></tr>
<tr><td>Hội đồng quản trị và cổ đông lớn</td><td>5</td><td>5</td><td>25</td><td>Nhân vật then chốt</td></tr>
<tr><td>Ngân hàng tài trợ dự án</td><td>4</td><td>4</td><td>16</td><td>Nhân vật then chốt</td></tr>
<tr><td>Chính quyền tỉnh</td><td>5</td><td>3</td><td>15</td><td>Giữ cho hài lòng</td></tr>
<tr><td>Nhân viên hiện tại</td><td>3</td><td>4</td><td>12</td><td>Thông tin đầy đủ</td></tr>
<tr><td>Người dân địa phương</td><td>2</td><td>5</td><td>10</td><td>Thông tin đầy đủ</td></tr>
<tr><td>Khách mua nước ngoài</td><td>4</td><td>2</td><td>8</td><td>Giữ cho hài lòng</td></tr>
<tr><td>Báo chí toàn quốc</td><td>3</td><td>2</td><td>6</td><td>Nỗ lực tối thiểu — theo dõi</td></tr>
<tr><td>Nhóm môi trường địa phương</td><td>1</td><td>5</td><td>5</td><td>Thông tin đầy đủ</td></tr>
</table>
<pre><code class="language-text">(b) Nhân vật then chốt (HĐQT, ngân hàng) -> đưa vào quá trình ra quyết định: họp điều hành,
                                            báo cáo hằng tháng, cùng thống nhất hạn mức rủi ro và mốc
    Giữ cho hài lòng (tỉnh, khách mua)     -> đáp ứng yêu cầu của họ từ sớm: hồ sơ giấy phép đầy đủ,
                                            đánh giá tác động môi trường, tiêu chuẩn đánh giá của khách
    Thông tin đầy đủ (nhân viên,           -> trao đổi hai chiều thường xuyên: họp dân, đường dây nóng,
     người dân, nhóm địa phương)             tham quan công trường, công bố kết quả đo nước
    Theo dõi (báo chí toàn quốc)           -> chuẩn bị dữ kiện và người phát ngôn; phản hồi nhanh

(c) Chi phí tăng thêm = 4 / 40 = 10% ngân sách dự án.</code></pre>
<p>Với câu (c), doanh nghiệp nên tham vấn người dân và nhóm môi trường trước khi xây dựng, công bố kết quả đo nước độc lập, và trình hệ thống xử lý lên hội đồng quản trị như một khoản <strong>quản trị rủi ro</strong>: nó bảo vệ giấy phép môi trường, kết quả đánh giá của khách mua nước ngoài và uy tín công ty. Mức tăng 10% chi phí là đáng kể, nên hội đồng quản trị (nhân vật then chốt) phải phê duyệt dựa trên bằng chứng rõ ràng.</p>
<p><strong>Vì sao:</strong> người dân và nhóm môi trường hiện có ít quyền lực chính thức, nhưng khi kết hợp với báo chí họ có thể làm chậm việc cấp phép hoặc khiến khách mua mở cuộc đánh giá — quyền lực của họ có thể tăng rất nhanh. Gắn kết sớm rẻ hơn nhiều so với hàn gắn xung đột về sau. Lưới Mendelow là điểm khởi đầu cho việc cân nhắc, không phải quy tắc máy móc.</p>`,
  ]]);

const c1q = quiz('eco102-quiz-1', 'Quiz 1 — Organizations & stakeholders|||Quiz 1 — Tổ chức & các bên liên quan', [
  { id: 'q1', question: 'On Mendelow’s grid, a stakeholder with HIGH power but LOW interest should be…|||Trên lưới Mendelow, bên liên quan có quyền lực CAO nhưng mức quan tâm THẤP nên được…', options: ['managed closely as a key player|||quản lý chặt chẽ như nhân vật then chốt', 'kept satisfied|||giữ cho hài lòng', 'kept informed|||thông tin đầy đủ', 'monitored with minimal effort|||theo dõi với nỗ lực tối thiểu'], correctIndex: 1, explanation: 'Powerful but not very interested groups must not be provoked: meet their needs so they stay satisfied, while watching for a rise in interest.|||Nhóm có quyền lực nhưng ít quan tâm không nên bị khiêu khích: đáp ứng nhu cầu để họ hài lòng, đồng thời theo dõi xem mức quan tâm có tăng lên không.' },
  { id: 'q2', question: 'In which legal form is the owner personally liable for ALL the debts of the business?|||Ở loại hình pháp lý nào chủ sở hữu phải chịu trách nhiệm cá nhân về TOÀN BỘ nợ của doanh nghiệp?', options: ['A private limited company|||Công ty trách nhiệm hữu hạn', 'A public limited company|||Công ty đại chúng', 'A sole trader (sole proprietorship)|||Doanh nghiệp một chủ (doanh nghiệp tư nhân)', 'A joint stock company|||Công ty cổ phần'], correctIndex: 2, explanation: 'A sole trader has unlimited liability; in companies, owners risk only the capital they contributed.|||Doanh nghiệp một chủ chịu trách nhiệm vô hạn; ở các loại hình công ty, chủ sở hữu chỉ chịu rủi ro trong phần vốn đã góp.' },
  { id: 'q3', question: '“Satisficing” means that a firm…|||“Thoả mãn vừa đủ” (satisficing) nghĩa là doanh nghiệp…', options: ['maximizes profit whatever the cost to other groups|||tối đa hoá lợi nhuận bất kể thiệt hại cho các nhóm khác', 'maximizes sales revenue subject to a minimum profit|||tối đa hoá doanh thu với điều kiện đạt lợi nhuận tối thiểu', 'maximizes the rate of growth of the firm|||tối đa hoá tốc độ tăng trưởng của doanh nghiệp', 'aims for satisfactory results across several goals to keep stakeholders content|||nhắm tới kết quả chấp nhận được ở nhiều mục tiêu để các bên liên quan đều hài lòng'], correctIndex: 3, explanation: 'Satisficing (Herbert Simon) replaces maximization with “good enough” targets; the second option describes sales revenue maximization (Baumol).|||Thoả mãn vừa đủ (Herbert Simon) thay việc tối đa hoá bằng mục tiêu “đủ tốt”; phương án thứ hai mô tả tối đa hoá doanh thu (Baumol).' },
]);

const c2 = doc('eco102-2-1-pestle', '2.1 — The macro environment: PESTLE analysis|||2.1 — Môi trường vĩ mô: phân tích PESTLE',
  'Sáu nhóm yếu tố vĩ mô (chính trị, kinh tế, xã hội – nhân khẩu, công nghệ, pháp lý, môi trường tự nhiên) và câu hỏi cần đặt cho từng nhóm, các biến thể PEST/STEEPLE, cách làm PESTLE có "vậy thì sao" (tác động × khả năng xảy ra) và các hạn chế.',
  [[
    `<span class="eyebrow">ECO102 · Part 2 · Lesson 2.1</span>
<h2>The macro environment: PESTLE analysis</h2>
<p class="lead"><strong>PESTLE</strong> is a checklist for scanning the general environment: <strong>P</strong>olitical, <strong>E</strong>conomic, <strong>S</strong>ocial, <strong>T</strong>echnological, <strong>L</strong>egal and <strong>E</strong>nvironmental (ecological) factors. These forces affect whole industries, and a single firm can rarely control them.</p>
<table>
<tr><th>Factor</th><th>Examples</th><th>Question to ask</th></tr>
<tr><td>Political</td><td>Political stability, government priorities, tax and spending policy, trade policy, industrial support, the state as a customer, geopolitical tensions</td><td>What is the government trying to encourage or discourage?</td></tr>
<tr><td>Economic</td><td>Economic growth, inflation, interest rates, exchange rates, unemployment, household income, the cost of energy and materials</td><td>How will demand and costs move?</td></tr>
<tr><td>Social (socio-cultural and demographic)</td><td>Population size and age structure, urbanization, household size, migration, education, lifestyles, values, health and environmental awareness</td><td>How are customers and workers changing?</td></tr>
<tr><td>Technological</td><td>New products and processes, automation, artificial intelligence, digital platforms, the speed of technology transfer, R&amp;D</td><td>What could make our product or process obsolete — or much cheaper?</td></tr>
<tr><td>Legal</td><td>Company, competition, consumer-protection, employment, health-and-safety, tax, data-protection and intellectual-property law</td><td>What must we comply with, and what changes are coming?</td></tr>
<tr><td>Environmental (ecological)</td><td>Climate change and extreme weather, pollution, waste and recycling rules, resource scarcity, carbon pricing, customers' demand for greener products</td><td>How do we affect nature, and how does nature affect us?</td></tr>
</table>
<h3>Variants</h3>
<p><strong>PEST</strong> is the shorter four-factor version; <strong>PESTEL</strong> is the same as PESTLE in a different order; <strong>STEEPLE</strong> adds <em>ethical</em> factors. The label matters less than covering the relevant forces. Some issues fit several boxes — a carbon tax is political, legal and environmental — so place each issue where it best explains its impact and avoid counting it twice.</p>
<h3>Doing PESTLE well</h3>
<ol>
<li><strong>Be specific to the organization</strong> — "inflation" is a fact; "rising packaging costs will squeeze our margin" is an insight.</li>
<li><strong>Separate trends from impacts</strong> — describe the change, then its effect on inputs, operations or demand.</li>
<li><strong>Prioritize</strong> — score each factor for <strong>impact</strong> (1–5) and <strong>likelihood</strong> (1–5); multiply to get a priority score and focus on the highest.</li>
<li><strong>Classify</strong> each item as an <strong>opportunity</strong> or a <strong>threat</strong> — this feeds directly into SWOT (Lesson 4.2).</li>
<li><strong>Update regularly</strong> — the environment moves; a PESTLE is a snapshot, not a permanent truth.</li>
</ol>
<h3>Limitations</h3>
<ul>
<li>It can become a long list with no conclusion ("paralysis by analysis").</li>
<li>It relies on judgement and on the quality of available information.</li>
<li>Factors interact — an economic shock can trigger political and social change — which a simple table hides.</li>
</ul>
<div class="callout"><span class="badge">Example of reasoning</span> An ageing population (social) raises demand for healthcare and home services, may create labour shortages (economic) and can push governments to reform pensions (political) — one trend, several consequences.</div>`,
    `<span class="eyebrow">ECO102 · Phần 2 · Bài 2.1</span>
<h2>Môi trường vĩ mô: phân tích PESTLE</h2>
<p class="lead"><strong>PESTLE</strong> là bảng kiểm để rà soát môi trường tổng quát: các yếu tố <strong>Chính trị</strong> (Political), <strong>Kinh tế</strong> (Economic), <strong>Xã hội</strong> (Social), <strong>Công nghệ</strong> (Technological), <strong>Pháp lý</strong> (Legal) và <strong>Môi trường tự nhiên</strong> (Environmental). Các lực lượng này tác động tới cả ngành, và một doanh nghiệp đơn lẻ hiếm khi kiểm soát được chúng.</p>
<table>
<tr><th>Yếu tố</th><th>Ví dụ</th><th>Câu hỏi cần đặt</th></tr>
<tr><td>Chính trị</td><td>Ổn định chính trị, ưu tiên của Chính phủ, chính sách thuế và chi tiêu, chính sách thương mại, hỗ trợ ngành, Nhà nước với tư cách khách hàng, căng thẳng địa chính trị</td><td>Chính phủ đang muốn khuyến khích hay hạn chế điều gì?</td></tr>
<tr><td>Kinh tế</td><td>Tăng trưởng kinh tế, lạm phát, lãi suất, tỷ giá, thất nghiệp, thu nhập hộ gia đình, giá năng lượng và nguyên liệu</td><td>Cầu và chi phí sẽ biến động ra sao?</td></tr>
<tr><td>Xã hội (văn hoá – xã hội và nhân khẩu)</td><td>Quy mô và cơ cấu tuổi dân số, đô thị hoá, quy mô hộ gia đình, di cư, giáo dục, lối sống, giá trị, ý thức về sức khoẻ và môi trường</td><td>Khách hàng và người lao động đang thay đổi thế nào?</td></tr>
<tr><td>Công nghệ</td><td>Sản phẩm và quy trình mới, tự động hoá, trí tuệ nhân tạo, nền tảng số, tốc độ chuyển giao công nghệ, R&amp;D</td><td>Điều gì có thể làm sản phẩm hay quy trình của ta lỗi thời — hoặc rẻ hơn nhiều?</td></tr>
<tr><td>Pháp lý</td><td>Luật doanh nghiệp, cạnh tranh, bảo vệ người tiêu dùng, lao động, an toàn – vệ sinh lao động, thuế, bảo vệ dữ liệu, sở hữu trí tuệ</td><td>Ta phải tuân thủ điều gì, và sắp có thay đổi gì?</td></tr>
<tr><td>Môi trường tự nhiên (sinh thái)</td><td>Biến đổi khí hậu và thời tiết cực đoan, ô nhiễm, quy định về chất thải và tái chế, khan hiếm tài nguyên, định giá carbon, nhu cầu sản phẩm xanh của khách hàng</td><td>Ta tác động tới thiên nhiên thế nào, và thiên nhiên tác động tới ta thế nào?</td></tr>
</table>
<h3>Các biến thể</h3>
<p><strong>PEST</strong> là bản rút gọn bốn yếu tố; <strong>PESTEL</strong> giống PESTLE, chỉ khác thứ tự; <strong>STEEPLE</strong> thêm yếu tố <em>đạo đức</em>. Tên gọi không quan trọng bằng việc bao quát đủ các lực lượng liên quan. Có vấn đề thuộc nhiều ô — thuế carbon vừa là chính trị, vừa là pháp lý, vừa là môi trường — nên hãy đặt mỗi vấn đề vào ô giải thích rõ nhất tác động của nó và tránh đếm hai lần.</p>
<h3>Làm PESTLE cho tốt</h3>
<ol>
<li><strong>Cụ thể cho tổ chức</strong> — "lạm phát" là một dữ kiện; "chi phí bao bì tăng sẽ bóp biên lợi nhuận của ta" mới là một nhận định có giá trị.</li>
<li><strong>Tách xu hướng khỏi tác động</strong> — mô tả sự thay đổi, rồi tác động của nó tới đầu vào, vận hành hay nhu cầu.</li>
<li><strong>Xếp ưu tiên</strong> — chấm mỗi yếu tố theo <strong>mức tác động</strong> (1–5) và <strong>khả năng xảy ra</strong> (1–5); nhân lại để có điểm ưu tiên và tập trung vào điểm cao nhất.</li>
<li><strong>Phân loại</strong> từng mục là <strong>cơ hội</strong> hay <strong>nguy cơ</strong> — kết quả này đi thẳng vào SWOT (Bài 4.2).</li>
<li><strong>Cập nhật thường xuyên</strong> — môi trường luôn chuyển động; PESTLE là một bức ảnh chụp nhanh, không phải chân lý vĩnh viễn.</li>
</ol>
<h3>Hạn chế</h3>
<ul>
<li>Dễ biến thành một danh sách dài không có kết luận ("tê liệt vì phân tích").</li>
<li>Phụ thuộc vào óc phán đoán và chất lượng thông tin sẵn có.</li>
<li>Các yếu tố tương tác với nhau — một cú sốc kinh tế có thể kéo theo thay đổi chính trị và xã hội — điều mà một bảng đơn giản che khuất.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ lập luận</span> Dân số già hoá (xã hội) làm tăng nhu cầu dịch vụ y tế và chăm sóc tại nhà, có thể gây thiếu hụt lao động (kinh tế) và thúc Chính phủ cải cách lương hưu (chính trị) — một xu hướng, nhiều hệ quả.</div>`,
  ]]);

const c3 = doc('eco102-2-2-macroeconomy', '2.2 — The macroeconomic environment & government policy|||2.2 — Môi trường kinh tế vĩ mô & chính sách của Nhà nước',
  'Vòng chu chuyển thu nhập (rò rỉ và bơm vào), bốn mục tiêu kinh tế vĩ mô, chu kỳ kinh doanh, cách đọc tăng trưởng thực, CPI và lạm phát, tỷ lệ thất nghiệp, lãi suất thực và tỷ giá (ví dụ số giả định), chính sách tài khoá, tiền tệ và trọng cung, tác động tới doanh nghiệp.',
  [[
    `<span class="eyebrow">ECO102 · Part 2 · Lesson 2.2</span>
<h2>The macroeconomic environment &amp; government policy</h2>
<h3>The circular flow of income</h3>
<p>Households supply labour and capital to firms and receive incomes, which they spend on firms' output. Some income <strong>leaks</strong> out of the flow — savings (S), taxes (T) and imports (M) — while <strong>injections</strong> enter it — investment (I), government spending (G) and exports (X). When injections exceed withdrawals, national income tends to rise; when withdrawals exceed injections, it tends to fall. This is why a fall in exports or a rise in taxes can reduce demand for firms that never export or never deal with the state directly.</p>
<h3>Four macroeconomic objectives</h3>
<p>Governments typically aim for <strong>sustainable economic growth</strong>, <strong>low and stable inflation</strong>, <strong>high employment</strong> and a <strong>sustainable external balance</strong> (balance of payments). The objectives can conflict: fast growth may raise inflation and imports.</p>
<p>Growth is uneven. The <strong>business cycle</strong> moves through boom, downturn, recession (a common rule of thumb is two consecutive quarters of falling real GDP) and recovery. Sales of luxury goods, cars and construction swing much more than sales of basic food.</p>
<h3>Reading the key indicators (illustrative numbers, Country X)</h3>
<pre><code class="language-text">Real growth    : nominal GDP +9%, price level +3%
                 real growth = 1.09 / 1.03 - 1 = 5.8%   (approximation: 9% - 3% = 6%)
Inflation (CPI): basket cost 200 last year, 212 this year
                 inflation = (212 - 200) / 200 = 6%
Unemployment   : labour force 20.0 million, unemployed 1.0 million
                 unemployment rate = 1.0 / 20.0 = 5%
Real interest  : loan rate 8%, inflation 6%  ->  real rate approx. 8% - 6% = 2%
Exchange rate  : 24,000 -> 25,200 dong per US dollar (the dong depreciates)
                 an exporter's USD 10 sale: 240,000 -> 252,000 dong  (+5%)
                 an importer's USD 10,000 bill: 240 -> 252 million dong  (+5%)</code></pre>
<p><strong>Inflation</strong> may be <em>demand-pull</em> (spending grows faster than output) or <em>cost-push</em> (energy, wages or imported inputs become more expensive). It raises costs, erodes customers' purchasing power and makes planning harder. <strong>Unemployment</strong> can be <em>frictional</em> (between jobs), <em>structural</em> (skills no longer match jobs), <em>cyclical</em> (weak demand in a recession) or <em>seasonal</em>.</p>
<h3>Government policy tools</h3>
<table>
<tr><th>Policy</th><th>Tools</th><th>Typical effect on business</th></tr>
<tr><td>Fiscal policy</td><td>Government spending and taxation; the budget balance</td><td>Expansionary policy (more spending, lower taxes) lifts demand; contractionary policy dampens it</td></tr>
<tr><td>Monetary policy</td><td>Set by the central bank (in Vietnam, the State Bank of Vietnam): policy interest rates, open market operations, reserve requirements, influence on credit and the exchange rate</td><td>Higher rates raise borrowing costs, cool consumer credit and investment, and can strengthen the currency</td></tr>
<tr><td>Supply-side policy</td><td>Education and training, infrastructure, deregulation, support for innovation</td><td>Raises productive capacity in the long run</td></tr>
</table>
<div class="callout"><span class="badge">Business lens</span> Do not stop at "interest rates rose". Ask: does it raise our borrowing costs? Will customers buying on credit postpone purchases? Will the currency move and change our import costs?</div>`,
    `<span class="eyebrow">ECO102 · Phần 2 · Bài 2.2</span>
<h2>Môi trường kinh tế vĩ mô &amp; chính sách của Nhà nước</h2>
<h3>Vòng chu chuyển thu nhập</h3>
<p>Hộ gia đình cung cấp lao động và vốn cho doanh nghiệp và nhận thu nhập, rồi dùng thu nhập đó mua sản phẩm của doanh nghiệp. Một phần thu nhập <strong>rò rỉ</strong> khỏi vòng — tiết kiệm (S), thuế (T) và nhập khẩu (M) — trong khi các khoản <strong>bơm vào</strong> đi vào vòng — đầu tư (I), chi tiêu của Chính phủ (G) và xuất khẩu (X). Khi bơm vào lớn hơn rò rỉ, thu nhập quốc dân có xu hướng tăng; khi rò rỉ lớn hơn bơm vào, nó có xu hướng giảm. Đó là lý do xuất khẩu giảm hay thuế tăng có thể làm giảm cầu của cả những doanh nghiệp không hề xuất khẩu hay giao dịch trực tiếp với Nhà nước.</p>
<h3>Bốn mục tiêu kinh tế vĩ mô</h3>
<p>Chính phủ thường nhắm tới <strong>tăng trưởng kinh tế bền vững</strong>, <strong>lạm phát thấp và ổn định</strong>, <strong>việc làm cao</strong> và <strong>cân bằng đối ngoại bền vững</strong> (cán cân thanh toán). Các mục tiêu có thể mâu thuẫn: tăng trưởng nhanh có thể đẩy lạm phát và nhập khẩu lên.</p>
<p>Tăng trưởng không đều. <strong>Chu kỳ kinh doanh</strong> đi qua các pha bùng nổ, suy giảm, suy thoái (quy ước thường dùng là GDP thực giảm hai quý liên tiếp) và phục hồi. Doanh số hàng xa xỉ, ô tô và xây dựng dao động mạnh hơn nhiều so với doanh số lương thực thiết yếu.</p>
<h3>Đọc các chỉ số chính (số liệu minh hoạ giả định, Quốc gia X)</h3>
<pre><code class="language-text">Tăng trưởng thực: GDP danh nghĩa +9%, mặt bằng giá +3%
                  tăng trưởng thực = 1,09 / 1,03 - 1 = 5,8%   (xấp xỉ: 9% - 3% = 6%)
Lạm phát (CPI)  : giỏ hàng năm trước 200, năm nay 212
                  lạm phát = (212 - 200) / 200 = 6%
Thất nghiệp     : lực lượng lao động 20,0 triệu, thất nghiệp 1,0 triệu
                  tỷ lệ thất nghiệp = 1,0 / 20,0 = 5%
Lãi suất thực   : lãi vay 8%, lạm phát 6%  ->  lãi suất thực xấp xỉ 8% - 6% = 2%
Tỷ giá          : 24.000 -> 25.200 đồng/đô la Mỹ (đồng Việt Nam mất giá)
                  một đơn hàng xuất khẩu 10 USD: 240.000 -> 252.000 đồng  (+5%)
                  một hoá đơn nhập khẩu 10.000 USD: 240 -> 252 triệu đồng  (+5%)</code></pre>
<p><strong>Lạm phát</strong> có thể do <em>cầu kéo</em> (chi tiêu tăng nhanh hơn sản lượng) hoặc <em>chi phí đẩy</em> (năng lượng, tiền lương hay đầu vào nhập khẩu đắt lên). Nó làm tăng chi phí, bào mòn sức mua của khách hàng và khiến việc lập kế hoạch khó hơn. <strong>Thất nghiệp</strong> có thể là <em>tạm thời</em> (đang chuyển việc), <em>cơ cấu</em> (kỹ năng không còn khớp với việc làm), <em>chu kỳ</em> (cầu yếu khi suy thoái) hoặc <em>thời vụ</em>.</p>
<h3>Công cụ chính sách của Nhà nước</h3>
<table>
<tr><th>Chính sách</th><th>Công cụ</th><th>Tác động điển hình tới doanh nghiệp</th></tr>
<tr><td>Chính sách tài khoá</td><td>Chi tiêu của Chính phủ và thuế; cân đối ngân sách</td><td>Chính sách mở rộng (chi nhiều hơn, giảm thuế) kích cầu; chính sách thắt chặt làm cầu chững lại</td></tr>
<tr><td>Chính sách tiền tệ</td><td>Do ngân hàng trung ương điều hành (ở Việt Nam là Ngân hàng Nhà nước Việt Nam): lãi suất điều hành, nghiệp vụ thị trường mở, dự trữ bắt buộc, tác động tới tín dụng và tỷ giá</td><td>Lãi suất cao hơn làm tăng chi phí vay, hạ nhiệt tín dụng tiêu dùng và đầu tư, và có thể làm đồng nội tệ mạnh lên</td></tr>
<tr><td>Chính sách trọng cung</td><td>Giáo dục và đào tạo, hạ tầng, nới lỏng quy định, hỗ trợ đổi mới sáng tạo</td><td>Nâng năng lực sản xuất trong dài hạn</td></tr>
</table>
<div class="callout"><span class="badge">Góc nhìn doanh nghiệp</span> Đừng dừng ở câu "lãi suất tăng". Hãy hỏi: chi phí vay của ta có tăng không? Khách hàng mua trả góp có hoãn mua không? Tỷ giá có biến động và làm đổi chi phí nhập khẩu của ta không?</div>`,
  ]]);

const c4 = doc('eco102-2-3-international', '2.3 — The international environment & globalization|||2.3 — Môi trường quốc tế & toàn cầu hoá',
  'Toàn cầu hoá và động lực của nó, lợi thế tuyệt đối và lợi thế so sánh (ví dụ số), rào cản thương mại và lý lẽ bảo hộ, bốn cấp độ hội nhập kinh tế khu vực, WTO và các FTA của Việt Nam, các phương thức thâm nhập thị trường quốc tế, khác biệt văn hoá theo Hofstede.',
  [[
    `<span class="eyebrow">ECO102 · Part 2 · Lesson 2.3</span>
<h2>The international environment &amp; globalization</h2>
<p class="lead"><strong>Globalization</strong> is the growing interconnection of national economies through trade, investment, finance, technology, people and ideas. Its drivers include falling transport and communication costs, trade liberalization, the spread of multinational enterprises and global supply chains, and converging consumer tastes. Critics point to job losses in some industries, exposure to global shocks and pressure on labour and environmental standards.</p>
<h3>Why countries trade: comparative advantage</h3>
<p>Adam Smith explained gains from <strong>absolute advantage</strong> (producing more with the same resources). David Ricardo showed that trade pays even without it, through <strong>comparative advantage</strong>: specialize in what you give up least to produce.</p>
<pre><code class="language-text">Output per worker-day (illustrative)   Rice   Cloth   Opportunity cost of 1 cloth
Country A                                4       2      4 / 2 = 2 rice
Country B                                1       1      1 / 1 = 1 rice

A is better at both (absolute advantage), but cloth costs B less rice:
B has the comparative advantage in cloth, A in rice. Both gain if they specialize
and trade at a price between 1 and 2 rice per cloth.</code></pre>
<h3>Trade barriers</h3>
<p>Governments may restrict trade with <strong>tariffs</strong> (taxes on imports), <strong>quotas</strong> (limits on quantity), <strong>subsidies</strong> to domestic producers, <strong>non-tariff barriers</strong> (technical standards, licensing, slow customs procedures) and <strong>embargoes</strong>. Arguments for protection include infant industries, jobs, national security and responses to dumping; the costs are higher prices, less efficiency and the risk of retaliation.</p>
<h3>Regional economic integration</h3>
<table>
<tr><th>Level</th><th>What members agree</th></tr>
<tr><td>Free trade area</td><td>Remove tariffs among members; each keeps its own tariffs on outsiders</td></tr>
<tr><td>Customs union</td><td>Free trade area + a <strong>common external tariff</strong></td></tr>
<tr><td>Common market</td><td>Customs union + free movement of labour and capital</td></tr>
<tr><td>Economic union</td><td>Common market + harmonized economic policies, possibly a single currency</td></tr>
</table>
<p>The European Union goes furthest, with a single market and a common currency used by many members. ASEAN has built a free trade area and the ASEAN Economic Community. The <strong>World Trade Organization</strong> (WTO) sets global trade rules and settles disputes; Vietnam joined in 2007 and is also party to many free trade agreements, such as CPTPP, EVFTA and RCEP. For businesses these create both opportunities (lower tariffs abroad) and threats (stronger foreign competition at home), and require meeting <strong>rules of origin</strong> to claim preferences.</p>
<h3>Entering foreign markets</h3>
<table>
<tr><th>Mode</th><th>Commitment and risk</th><th>Control</th></tr>
<tr><td>Exporting (direct or via agents)</td><td>Low</td><td>Low over the foreign market</td></tr>
<tr><td>Licensing and franchising</td><td>Low to medium</td><td>Limited; risk of losing know-how</td></tr>
<tr><td>Joint venture</td><td>Medium — shared with a local partner</td><td>Shared</td></tr>
<tr><td>Foreign direct investment (wholly owned subsidiary)</td><td>High</td><td>Full</td></tr>
</table>
<p>Culture also differs. Hofstede's model compares countries on six dimensions — power distance, individualism, masculinity, uncertainty avoidance, long-term orientation and indulgence — which affect management style, negotiation and marketing.</p>
<div class="callout"><span class="badge">Remember</span> Globalization means your competitor, supplier or customer may be on another continent — and a shock there (a war, a pandemic, a port closure) can reach your factory within weeks.</div>`,
    `<span class="eyebrow">ECO102 · Phần 2 · Bài 2.3</span>
<h2>Môi trường quốc tế &amp; toàn cầu hoá</h2>
<p class="lead"><strong>Toàn cầu hoá</strong> là sự gắn kết ngày càng chặt giữa các nền kinh tế quốc gia qua thương mại, đầu tư, tài chính, công nghệ, con người và ý tưởng. Động lực của nó gồm chi phí vận tải và liên lạc giảm, tự do hoá thương mại, sự lan rộng của doanh nghiệp đa quốc gia và chuỗi cung ứng toàn cầu, và thị hiếu tiêu dùng xích lại gần nhau. Người phê phán chỉ ra việc mất việc làm ở một số ngành, dễ bị tổn thương trước các cú sốc toàn cầu và áp lực hạ thấp chuẩn mực lao động, môi trường.</p>
<h3>Vì sao các nước buôn bán: lợi thế so sánh</h3>
<p>Adam Smith giải thích lợi ích từ <strong>lợi thế tuyệt đối</strong> (sản xuất được nhiều hơn với cùng nguồn lực). David Ricardo chỉ ra rằng thương mại vẫn có lợi ngay cả khi không có lợi thế tuyệt đối, nhờ <strong>lợi thế so sánh</strong>: chuyên môn hoá vào thứ mà mình phải hy sinh ít nhất để sản xuất.</p>
<pre><code class="language-text">Sản lượng mỗi ngày công (minh hoạ)   Gạo   Vải   Chi phí cơ hội của 1 vải
Quốc gia A                             4     2     4 / 2 = 2 gạo
Quốc gia B                             1     1     1 / 1 = 1 gạo

A giỏi hơn ở cả hai mặt hàng (lợi thế tuyệt đối), nhưng làm vải thì B hy sinh ít gạo hơn:
B có lợi thế so sánh về vải, A về gạo. Cả hai cùng lợi nếu chuyên môn hoá
và trao đổi ở mức giá từ 1 đến 2 gạo cho mỗi vải.</code></pre>
<h3>Rào cản thương mại</h3>
<p>Chính phủ có thể hạn chế thương mại bằng <strong>thuế quan</strong> (thuế đánh vào hàng nhập khẩu), <strong>hạn ngạch</strong> (giới hạn số lượng), <strong>trợ cấp</strong> cho nhà sản xuất trong nước, <strong>rào cản phi thuế quan</strong> (tiêu chuẩn kỹ thuật, giấy phép, thủ tục hải quan chậm) và <strong>cấm vận</strong>. Lý lẽ ủng hộ bảo hộ gồm bảo vệ ngành non trẻ, việc làm, an ninh quốc gia và đối phó bán phá giá; cái giá phải trả là giá cao hơn, kém hiệu quả hơn và nguy cơ bị trả đũa.</p>
<h3>Hội nhập kinh tế khu vực</h3>
<table>
<tr><th>Cấp độ</th><th>Các thành viên cam kết</th></tr>
<tr><td>Khu vực thương mại tự do</td><td>Xoá thuế quan giữa các thành viên; mỗi nước giữ biểu thuế riêng với bên ngoài</td></tr>
<tr><td>Liên minh thuế quan</td><td>Khu vực thương mại tự do + <strong>biểu thuế quan chung với bên ngoài</strong></td></tr>
<tr><td>Thị trường chung</td><td>Liên minh thuế quan + tự do di chuyển lao động và vốn</td></tr>
<tr><td>Liên minh kinh tế</td><td>Thị trường chung + hài hoà chính sách kinh tế, có thể dùng chung một đồng tiền</td></tr>
</table>
<p>Liên minh châu Âu đi xa nhất, với thị trường chung duy nhất và đồng tiền chung được nhiều thành viên sử dụng. ASEAN đã xây dựng khu vực thương mại tự do và Cộng đồng Kinh tế ASEAN. <strong>Tổ chức Thương mại Thế giới</strong> (WTO) đặt ra luật chơi thương mại toàn cầu và giải quyết tranh chấp; Việt Nam gia nhập năm 2007 và là thành viên của nhiều hiệp định thương mại tự do như CPTPP, EVFTA và RCEP. Với doanh nghiệp, các hiệp định này vừa mở ra cơ hội (thuế quan ở nước ngoài thấp hơn) vừa tạo nguy cơ (cạnh tranh nước ngoài mạnh hơn ngay trên sân nhà), và đòi hỏi đáp ứng <strong>quy tắc xuất xứ</strong> để được hưởng ưu đãi.</p>
<h3>Thâm nhập thị trường nước ngoài</h3>
<table>
<tr><th>Phương thức</th><th>Mức cam kết và rủi ro</th><th>Mức kiểm soát</th></tr>
<tr><td>Xuất khẩu (trực tiếp hoặc qua đại lý)</td><td>Thấp</td><td>Thấp đối với thị trường nước ngoài</td></tr>
<tr><td>Cấp phép và nhượng quyền thương mại</td><td>Thấp đến trung bình</td><td>Hạn chế; nguy cơ lộ bí quyết</td></tr>
<tr><td>Liên doanh</td><td>Trung bình — chia sẻ với đối tác địa phương</td><td>Chia sẻ</td></tr>
<tr><td>Đầu tư trực tiếp nước ngoài (công ty con 100% vốn)</td><td>Cao</td><td>Toàn quyền</td></tr>
</table>
<p>Văn hoá cũng khác nhau. Mô hình của Hofstede so sánh các quốc gia theo sáu khía cạnh — khoảng cách quyền lực, chủ nghĩa cá nhân, nam tính, né tránh bất định, định hướng dài hạn và tự thoả mãn — ảnh hưởng tới phong cách quản lý, đàm phán và marketing.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Toàn cầu hoá nghĩa là đối thủ, nhà cung cấp hay khách hàng của bạn có thể ở một châu lục khác — và một cú sốc ở đó (chiến tranh, đại dịch, cảng bị đóng) có thể lan tới nhà máy của bạn chỉ trong vài tuần.</div>`,
  ]]);

const c4e = doc('eco102-2-4-exercise', 'Exercise 2 — PESTLE for a packaging manufacturer|||Bài tập 2 — PESTLE cho một doanh nghiệp sản xuất bao bì',
  'Bài tập tình huống giả định: xác định 9 yếu tố PESTLE cho một doanh nghiệp bao bì nhựa, chấm tác động × khả năng xảy ra, xếp hạng, phân loại cơ hội/nguy cơ và rút ra khuyến nghị hành động; kèm lời giải mẫu.',
  [[
    `<span class="eyebrow">ECO102 · Part 2 · Exercise 2</span>
<h2>Exercise 2 — from a list of factors to decisions</h2>
<div class="callout"><span class="badge">Problem</span> PackCo (a fictional company) makes plastic food packaging — boxes, cups and trays — for restaurants, food-delivery kitchens and supermarkets. Its main input is plastic resin, much of it imported and priced in US dollars. Management wants a PESTLE for the next three years. (a) Identify relevant factors under each heading. (b) Score each for impact (1–5) and likelihood (1–5), rank them by impact × likelihood and label each an opportunity (O) or a threat (T). Use: 15 or more = act now, 9–14 = plan, 8 or less = monitor. (c) Recommend actions for the top priorities.</div>
<h3>Model answer</h3>
<table>
<tr><th>Code</th><th>Factor (illustrative)</th><th>Impact</th><th>Likelihood</th><th>Score</th><th>O/T</th></tr>
<tr><td>P1</td><td>Government policy to cut single-use plastics and promote green growth</td><td>5</td><td>4</td><td>20</td><td>T</td></tr>
<tr><td>L1</td><td>Extended producer responsibility (EPR): producers of certain packaging must recycle or pay a contribution (check the current regulations and covered products)</td><td>4</td><td>5</td><td>20</td><td>T</td></tr>
<tr><td>S1</td><td>Busy urban lifestyles: growth of food delivery and convenience meals</td><td>4</td><td>5</td><td>20</td><td>O</td></tr>
<tr><td>E1</td><td>Volatile, oil-linked resin prices and a weaker dong raise input costs</td><td>4</td><td>4</td><td>16</td><td>T</td></tr>
<tr><td>S2</td><td>Consumers increasingly prefer recyclable or plastic-free packaging</td><td>4</td><td>4</td><td>16</td><td>O</td></tr>
<tr><td>T1</td><td>Recyclable mono-materials and paper-based alternatives becoming cheaper</td><td>4</td><td>3</td><td>12</td><td>O</td></tr>
<tr><td>T2</td><td>Automated forming and packing lines reduce unit labour costs</td><td>3</td><td>4</td><td>12</td><td>O</td></tr>
<tr><td>E2</td><td>Higher interest rates raise the cost of financing new machines</td><td>3</td><td>3</td><td>9</td><td>T</td></tr>
<tr><td>En1</td><td>Flooding risk at the factory in a low-lying industrial zone</td><td>3</td><td>2</td><td>6</td><td>T</td></tr>
</table>
<pre><code class="language-text">Act now (15+) : P1 20, L1 20, S1 20, E1 16, S2 16
Plan (9-14)   : T1 12, T2 12, E2 9
Monitor (<=8) : En1 6
Total score   : opportunities 20+16+12+12 = 60 ; threats 20+20+16+9+6 = 71</code></pre>
<p><strong>(c) Recommendations.</strong> (1) Launch a recyclable or paper-based range aimed at food-delivery kitchens — it answers P1, L1, S1 and S2 at once. (2) Prepare for EPR now: partner with recyclers, estimate the contribution and build it into prices. (3) Reduce input-cost risk: several resin suppliers, some local recycled resin, and forward contracts to fix the exchange rate on large orders. (4) Phase automation (T2) so that borrowing (E2) is spread over time. (5) Keep a simple flood plan (En1): raised storage, insurance, a backup supplier.</p>
<p><strong>Why:</strong> the value of PESTLE is in the "so what". Threat scores slightly exceed opportunity scores (71 against 60), but the strongest threats and opportunities point the same way — away from single-use plastic towards recyclable packaging for a growing delivery market. A threat for the current product can be an opportunity for the next one.</p>`,
    `<span class="eyebrow">ECO102 · Phần 2 · Bài tập 2</span>
<h2>Bài tập 2 — từ danh sách yếu tố tới quyết định</h2>
<div class="callout"><span class="badge">Đề</span> PackCo (doanh nghiệp giả định) sản xuất bao bì nhựa đựng thực phẩm — hộp, ly, khay — cho nhà hàng, bếp giao đồ ăn và siêu thị. Đầu vào chính là hạt nhựa, phần lớn nhập khẩu và tính giá bằng đô la Mỹ. Ban giám đốc cần một bản PESTLE cho ba năm tới. (a) Xác định các yếu tố liên quan theo từng nhóm. (b) Chấm mỗi yếu tố theo mức tác động (1–5) và khả năng xảy ra (1–5), xếp hạng theo tác động × khả năng xảy ra và gắn nhãn cơ hội (O) hay nguy cơ (T). Quy ước: từ 15 trở lên = hành động ngay, 9–14 = lập kế hoạch, từ 8 trở xuống = theo dõi. (c) Đề xuất hành động cho các ưu tiên hàng đầu.</div>
<h3>Lời giải mẫu</h3>
<table>
<tr><th>Mã</th><th>Yếu tố (minh hoạ)</th><th>Tác động</th><th>Khả năng</th><th>Điểm</th><th>O/T</th></tr>
<tr><td>P1</td><td>Chính sách giảm nhựa dùng một lần và thúc đẩy tăng trưởng xanh</td><td>5</td><td>4</td><td>20</td><td>T</td></tr>
<tr><td>L1</td><td>Trách nhiệm mở rộng của nhà sản xuất (EPR): nhà sản xuất một số loại bao bì phải tái chế hoặc đóng góp tài chính (kiểm quy định hiện hành và danh mục sản phẩm áp dụng)</td><td>4</td><td>5</td><td>20</td><td>T</td></tr>
<tr><td>S1</td><td>Lối sống đô thị bận rộn: giao đồ ăn và bữa ăn tiện lợi tăng mạnh</td><td>4</td><td>5</td><td>20</td><td>O</td></tr>
<tr><td>E1</td><td>Giá hạt nhựa biến động theo giá dầu và đồng Việt Nam yếu đi làm tăng chi phí đầu vào</td><td>4</td><td>4</td><td>16</td><td>T</td></tr>
<tr><td>S2</td><td>Người tiêu dùng ngày càng chuộng bao bì tái chế được hoặc không dùng nhựa</td><td>4</td><td>4</td><td>16</td><td>O</td></tr>
<tr><td>T1</td><td>Vật liệu đơn chất dễ tái chế và bao bì giấy ngày càng rẻ</td><td>4</td><td>3</td><td>12</td><td>O</td></tr>
<tr><td>T2</td><td>Dây chuyền định hình và đóng gói tự động giảm chi phí nhân công mỗi sản phẩm</td><td>3</td><td>4</td><td>12</td><td>O</td></tr>
<tr><td>E2</td><td>Lãi suất cao hơn làm tăng chi phí vay để mua máy mới</td><td>3</td><td>3</td><td>9</td><td>T</td></tr>
<tr><td>En1</td><td>Nguy cơ ngập lụt ở nhà máy trong khu công nghiệp thấp trũng</td><td>3</td><td>2</td><td>6</td><td>T</td></tr>
</table>
<pre><code class="language-text">Hành động ngay (15+) : P1 20, L1 20, S1 20, E1 16, S2 16
Lập kế hoạch (9-14)  : T1 12, T2 12, E2 9
Theo dõi (<=8)       : En1 6
Tổng điểm            : cơ hội 20+16+12+12 = 60 ; nguy cơ 20+20+16+9+6 = 71</code></pre>
<p><strong>(c) Khuyến nghị.</strong> (1) Ra dòng sản phẩm tái chế được hoặc làm từ giấy nhắm vào các bếp giao đồ ăn — đáp ứng cùng lúc P1, L1, S1 và S2. (2) Chuẩn bị cho EPR ngay từ bây giờ: hợp tác với đơn vị tái chế, ước tính khoản đóng góp và tính vào giá bán. (3) Giảm rủi ro chi phí đầu vào: nhiều nhà cung cấp hạt nhựa, dùng một phần hạt nhựa tái chế trong nước, và hợp đồng kỳ hạn để chốt tỷ giá cho các đơn hàng lớn. (4) Đầu tư tự động hoá (T2) theo từng giai đoạn để dàn trải khoản vay (E2). (5) Giữ một phương án chống ngập đơn giản (En1): kho kê cao, bảo hiểm, nhà cung cấp dự phòng.</p>
<p><strong>Vì sao:</strong> giá trị của PESTLE nằm ở câu hỏi "vậy thì sao". Điểm nguy cơ nhỉnh hơn điểm cơ hội (71 so với 60), nhưng các nguy cơ và cơ hội mạnh nhất cùng chỉ về một hướng — rời bỏ nhựa dùng một lần để chuyển sang bao bì tái chế được cho thị trường giao đồ ăn đang lớn lên. Nguy cơ với sản phẩm hiện tại có thể là cơ hội cho sản phẩm tiếp theo.</p>`,
  ]]);

const c4q = quiz('eco102-quiz-2', 'Quiz 2 — The macro environment|||Quiz 2 — Môi trường vĩ mô', [
  { id: 'q1', question: 'A rising share of older people and rapid urbanization belong mainly to which PESTLE factor?|||Tỷ trọng người cao tuổi tăng và đô thị hoá nhanh chủ yếu thuộc yếu tố nào của PESTLE?', options: ['Social (demographic)|||Xã hội (nhân khẩu)', 'Technological|||Công nghệ', 'Legal|||Pháp lý', 'Political|||Chính trị'], correctIndex: 0, explanation: 'Population size, age structure and urbanization are demographic trends, part of the social factor — although they have economic and political consequences.|||Quy mô, cơ cấu tuổi dân số và đô thị hoá là xu hướng nhân khẩu, thuộc yếu tố xã hội — dù chúng kéo theo hệ quả kinh tế và chính trị.' },
  { id: 'q2', question: 'A Vietnamese exporter sells a product for USD 5. The exchange rate moves from 24,000 to 25,000 dong per dollar. How many dong does it now receive per unit?|||Một doanh nghiệp xuất khẩu Việt Nam bán sản phẩm giá 5 USD. Tỷ giá đổi từ 24.000 lên 25.000 đồng/USD. Mỗi sản phẩm giờ mang về bao nhiêu đồng?', options: ['115,000 dong|||115.000 đồng', '120,000 dong|||120.000 đồng', '125,000 dong|||125.000 đồng', '130,000 dong|||130.000 đồng'], correctIndex: 2, explanation: '5 × 25,000 = 125,000 dong, up from 5 × 24,000 = 120,000: a weaker dong helps exporters but raises the cost of imports.|||5 × 25.000 = 125.000 đồng, tăng từ 5 × 24.000 = 120.000: đồng Việt Nam yếu đi có lợi cho xuất khẩu nhưng làm hàng nhập khẩu đắt hơn.' },
  { id: 'q3', question: 'What does a customs union add to a free trade area?|||Liên minh thuế quan bổ sung điều gì so với khu vực thương mại tự do?', options: ['Free movement of labour and capital|||Tự do di chuyển lao động và vốn', 'A common external tariff on non-members|||Biểu thuế quan chung với các nước ngoài khối', 'A single currency|||Một đồng tiền chung', 'Fully harmonized fiscal policy|||Chính sách tài khoá được hài hoà hoàn toàn'], correctIndex: 1, explanation: 'Free movement of factors defines a common market; a single currency and harmonized policies belong to an economic union.|||Tự do di chuyển yếu tố sản xuất là đặc trưng của thị trường chung; đồng tiền chung và chính sách hài hoà thuộc về liên minh kinh tế.' },
]);

const c5 = doc('eco102-3-1-market-structure-five-forces', '3.1 — Market structure & Porter’s five forces|||3.1 — Cấu trúc thị trường & năm lực lượng cạnh tranh của Porter',
  'Bốn cấu trúc thị trường (cạnh tranh hoàn hảo, cạnh tranh độc quyền, độc quyền nhóm, độc quyền), đo mức tập trung bằng CR4 và HHI (ví dụ số), rào cản gia nhập, năm lực lượng cạnh tranh của Porter và các yếu tố quyết định sức mạnh từng lực lượng, hạn chế của mô hình.',
  [[
    `<span class="eyebrow">ECO102 · Part 3 · Lesson 3.1</span>
<h2>Market structure &amp; Porter's five forces</h2>
<h3>Four market structures</h3>
<table>
<tr><th>Structure</th><th>Number of firms</th><th>Product</th><th>Barriers to entry</th><th>Control over price</th></tr>
<tr><td>Perfect competition</td><td>Very many, small</td><td>Identical</td><td>None</td><td>None — price takers</td></tr>
<tr><td>Monopolistic competition</td><td>Many</td><td>Differentiated (brand, location, style)</td><td>Low</td><td>Some</td></tr>
<tr><td>Oligopoly</td><td>A few large, <strong>interdependent</strong> firms</td><td>Identical or differentiated</td><td>High</td><td>Considerable; rivals react to each other; non-price competition common</td></tr>
<tr><td>Monopoly</td><td>One</td><td>No close substitutes</td><td>Very high</td><td>Price maker (subject to regulation)</td></tr>
</table>
<p>Perfect competition is a theoretical benchmark; most real markets are monopolistically competitive (cafés, clothing shops) or oligopolistic (telecoms, beer, airlines). Competition authorities watch concentrated markets because firms with market power can raise prices or abuse a dominant position.</p>
<h3>Measuring concentration (illustrative numbers)</h3>
<pre><code class="language-text">Market shares: firm A 30%, B 25%, C 15%, D 10%, plus 20 small firms with 1% each

Four-firm concentration ratio  CR4 = 30 + 25 + 15 + 10 = 80%
Herfindahl-Hirschman Index     HHI = 30^2 + 25^2 + 15^2 + 10^2 + 20 x 1^2
                                   = 900 + 625 + 225 + 100 + 20 = 1,870
(HHI runs from near 0 for a fragmented market to 10,000 for a pure monopoly)</code></pre>
<p><strong>Barriers to entry</strong> protect incumbents: economies of scale, high capital requirements, strong brands and customer loyalty, control of distribution channels, switching costs, patents and licences, and cost advantages from experience or location.</p>
<h3>Porter's five forces</h3>
<p>Michael Porter argued that an industry's long-run profitability depends on five competitive forces. The stronger the forces, the less attractive the industry.</p>
<table>
<tr><th>Force</th><th>Strong when…</th></tr>
<tr><td>Threat of new entrants</td><td>Barriers to entry are low; incumbents are unlikely to retaliate</td></tr>
<tr><td>Bargaining power of suppliers</td><td>Suppliers are few or concentrated, inputs are unique, switching suppliers is costly, suppliers could integrate forward</td></tr>
<tr><td>Bargaining power of buyers</td><td>Buyers are few or buy large volumes, products are standardized, switching costs are low, buyers are price-sensitive or could integrate backward</td></tr>
<tr><td>Threat of substitutes</td><td>Products from other industries meet the same need at an attractive price–performance and switching is easy</td></tr>
<tr><td>Rivalry among existing competitors</td><td>Many similar-sized rivals, slow industry growth, little differentiation, high fixed costs, high exit barriers</td></tr>
</table>
<h3>Using and criticizing the model</h3>
<ul>
<li>It explains <em>why</em> some industries earn more than others and where a firm can build defences (brand, switching costs, cost leadership).</li>
<li>It is a snapshot: PESTLE changes shift the forces — digital platforms, for example, have lowered entry barriers in many services.</li>
<li>It stresses competition over cooperation; many analysts add <strong>complementors</strong> (firms whose products increase the value of yours) as a further consideration.</li>
<li>Define the industry carefully: "beverages" and "bottled cold brew in big cities" give very different pictures.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Five forces is about the industry, not the firm. It tells you how hard the game is; your strategy decides how well you play it.</div>`,
    `<span class="eyebrow">ECO102 · Phần 3 · Bài 3.1</span>
<h2>Cấu trúc thị trường &amp; năm lực lượng cạnh tranh của Porter</h2>
<h3>Bốn cấu trúc thị trường</h3>
<table>
<tr><th>Cấu trúc</th><th>Số doanh nghiệp</th><th>Sản phẩm</th><th>Rào cản gia nhập</th><th>Khả năng chi phối giá</th></tr>
<tr><td>Cạnh tranh hoàn hảo</td><td>Rất nhiều, quy mô nhỏ</td><td>Đồng nhất</td><td>Không có</td><td>Không — người chấp nhận giá</td></tr>
<tr><td>Cạnh tranh độc quyền</td><td>Nhiều</td><td>Khác biệt (thương hiệu, địa điểm, kiểu dáng)</td><td>Thấp</td><td>Một phần</td></tr>
<tr><td>Độc quyền nhóm</td><td>Một vài doanh nghiệp lớn, <strong>phụ thuộc lẫn nhau</strong></td><td>Đồng nhất hoặc khác biệt</td><td>Cao</td><td>Đáng kể; các đối thủ phản ứng lẫn nhau; hay cạnh tranh phi giá</td></tr>
<tr><td>Độc quyền</td><td>Một</td><td>Không có sản phẩm thay thế gần</td><td>Rất cao</td><td>Người định giá (chịu sự điều tiết)</td></tr>
</table>
<p>Cạnh tranh hoàn hảo là chuẩn so sánh trên lý thuyết; phần lớn thị trường thực tế là cạnh tranh độc quyền (quán cà phê, cửa hàng quần áo) hoặc độc quyền nhóm (viễn thông, bia, hàng không). Cơ quan cạnh tranh theo dõi các thị trường tập trung cao vì doanh nghiệp có sức mạnh thị trường có thể nâng giá hoặc lạm dụng vị trí thống lĩnh.</p>
<h3>Đo mức độ tập trung (số liệu minh hoạ giả định)</h3>
<pre><code class="language-text">Thị phần: doanh nghiệp A 30%, B 25%, C 15%, D 10%, cùng 20 doanh nghiệp nhỏ mỗi nơi 1%

Tỷ lệ tập trung bốn doanh nghiệp  CR4 = 30 + 25 + 15 + 10 = 80%
Chỉ số Herfindahl-Hirschman        HHI = 30^2 + 25^2 + 15^2 + 10^2 + 20 x 1^2
                                       = 900 + 625 + 225 + 100 + 20 = 1.870
(HHI chạy từ gần 0 với thị trường phân tán tới 10.000 với độc quyền thuần tuý)</code></pre>
<p><strong>Rào cản gia nhập</strong> bảo vệ doanh nghiệp hiện hữu: lợi thế kinh tế theo quy mô, yêu cầu vốn lớn, thương hiệu mạnh và lòng trung thành của khách hàng, kiểm soát kênh phân phối, chi phí chuyển đổi, bằng sáng chế và giấy phép, lợi thế chi phí nhờ kinh nghiệm hoặc vị trí.</p>
<h3>Năm lực lượng cạnh tranh của Porter</h3>
<p>Michael Porter lập luận rằng khả năng sinh lời dài hạn của một ngành phụ thuộc vào năm lực lượng cạnh tranh. Các lực lượng càng mạnh, ngành càng kém hấp dẫn.</p>
<table>
<tr><th>Lực lượng</th><th>Mạnh khi…</th></tr>
<tr><td>Nguy cơ từ đối thủ tiềm ẩn (gia nhập mới)</td><td>Rào cản gia nhập thấp; doanh nghiệp hiện hữu khó trả đũa</td></tr>
<tr><td>Quyền thương lượng của nhà cung cấp</td><td>Nhà cung cấp ít hoặc tập trung, đầu vào độc đáo, đổi nhà cung cấp tốn kém, nhà cung cấp có thể hội nhập về phía trước</td></tr>
<tr><td>Quyền thương lượng của người mua</td><td>Người mua ít hoặc mua khối lượng lớn, sản phẩm chuẩn hoá, chi phí chuyển đổi thấp, người mua nhạy cảm về giá hoặc có thể hội nhập ngược</td></tr>
<tr><td>Nguy cơ từ sản phẩm thay thế</td><td>Sản phẩm của ngành khác đáp ứng cùng nhu cầu với tương quan giá – công dụng hấp dẫn và chuyển đổi dễ dàng</td></tr>
<tr><td>Cạnh tranh giữa các đối thủ hiện hữu</td><td>Nhiều đối thủ quy mô tương đương, ngành tăng trưởng chậm, ít khác biệt, chi phí cố định cao, rào cản rút lui cao</td></tr>
</table>
<h3>Vận dụng và phê phán mô hình</h3>
<ul>
<li>Mô hình giải thích <em>vì sao</em> có ngành lãi hơn ngành khác và doanh nghiệp có thể dựng hàng rào ở đâu (thương hiệu, chi phí chuyển đổi, dẫn đầu về chi phí).</li>
<li>Nó là ảnh chụp tĩnh: các thay đổi PESTLE làm dịch chuyển các lực lượng — ví dụ nền tảng số đã hạ rào cản gia nhập ở nhiều ngành dịch vụ.</li>
<li>Nó đề cao cạnh tranh hơn hợp tác; nhiều nhà phân tích bổ sung <strong>doanh nghiệp bổ trợ</strong> (những doanh nghiệp có sản phẩm làm tăng giá trị sản phẩm của bạn) như một yếu tố cần xét thêm.</li>
<li>Cần xác định ngành cẩn thận: "đồ uống" và "cà phê ủ lạnh đóng chai ở thành phố lớn" cho hai bức tranh rất khác nhau.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Năm lực lượng nói về ngành, không nói về doanh nghiệp. Nó cho biết cuộc chơi khó đến đâu; chiến lược của bạn quyết định bạn chơi giỏi đến đâu.</div>`,
  ]]);

const c6 = doc('eco102-3-2-technology-innovation', '3.2 — Technology, innovation & digital transformation|||3.2 — Công nghệ, đổi mới sáng tạo & chuyển đổi số',
  'Công nghệ tác động tới sản phẩm, quy trình, mô hình kinh doanh và cấu trúc ngành; phát minh và đổi mới; đổi mới tuần tự – đột phá, mô hình 4P của đổi mới; đổi mới duy trì và đổi mới phá vỡ (Christensen); lan toả đổi mới (Rogers); số hoá – chuyển đổi số, nền tảng và hiệu ứng mạng; rủi ro và cách ứng phó.',
  [[
    `<span class="eyebrow">ECO102 · Part 3 · Lesson 3.2</span>
<h2>Technology, innovation &amp; digital transformation</h2>
<p class="lead">Technology is the environmental force that most often redraws industry boundaries. It changes <strong>products</strong> (smartphones replacing cameras and maps), <strong>processes</strong> (automation, cloud software), <strong>business models</strong> (subscriptions, platforms) and the <strong>structure of industries</strong> (lower entry barriers, new substitutes) — and with them the skills firms need.</p>
<h3>Invention and innovation</h3>
<p>An <strong>invention</strong> is a new idea or device; an <strong>innovation</strong> is its successful introduction into use or the market. Innovation can be <strong>incremental</strong> (steady improvement) or <strong>radical</strong> (a big leap). Tidd and Bessant describe four targets — the "4Ps": <strong>product</strong> (what we offer), <strong>process</strong> (how we make and deliver it), <strong>position</strong> (the context or story in which we offer it) and <strong>paradigm</strong> (the underlying business model).</p>
<h3>Sustaining versus disruptive innovation</h3>
<p>Clayton Christensen distinguished <strong>sustaining</strong> innovations, which improve products for existing mainstream customers, from <strong>disruptive</strong> innovations, which start as simpler, cheaper or more convenient offers for overlooked customers or new markets, are dismissed by incumbents, then improve until they win mainstream customers. Leading firms are often beaten not because they manage badly, but because they rationally focus on their best customers.</p>
<h3>How new technologies spread</h3>
<table>
<tr><th>Adopter category (Rogers)</th><th>Share of adopters</th><th>Typical attitude</th></tr>
<tr><td>Innovators</td><td>2.5%</td><td>Venturesome, tolerate risk</td></tr>
<tr><td>Early adopters</td><td>13.5%</td><td>Respected opinion leaders</td></tr>
<tr><td>Early majority</td><td>34%</td><td>Deliberate; want proven benefits</td></tr>
<tr><td>Late majority</td><td>34%</td><td>Sceptical; adopt under pressure or necessity</td></tr>
<tr><td>Laggards</td><td>16%</td><td>Traditional; adopt last</td></tr>
</table>
<p>Adoption is faster when an innovation offers a clear relative advantage, fits existing habits, is simple, can be tried on a small scale and has visible results. The gap between enthusiastic early adopters and the pragmatic early majority is where many new products fail.</p>
<h3>Digital transformation</h3>
<ul>
<li><strong>Digitization</strong> — converting information into digital form (scanning paper invoices).</li>
<li><strong>Digitalization</strong> — using digital technology to improve processes (e-invoicing, online ordering).</li>
<li><strong>Digital transformation</strong> — rethinking the business model, customer experience and organization around data and digital technology.</li>
</ul>
<p>Enablers include cloud computing, mobile internet, data analytics, artificial intelligence and the Internet of Things; the German-born term <strong>Industry 4.0</strong> describes connected, data-driven factories. <strong>Digital platforms</strong> (marketplaces, ride-hailing, app stores) connect two or more groups of users and benefit from <strong>network effects</strong>: each extra user makes the platform more valuable to others, which can produce winner-takes-most markets.</p>
<h3>Risks and responses</h3>
<p>Risks: cyber-attacks, personal-data breaches and tightening data-protection rules (in Vietnam, check the regulations currently in force), skill shortages, job displacement, dependence on a few platforms, and the cost of failed projects. Responses: scan technology trends, run small pilots before large investments, reskill staff, and use <strong>open innovation</strong> (Henry Chesbrough) — working with start-ups, universities and suppliers instead of relying only on in-house R&amp;D.</p>
<div class="callout"><span class="badge">Remember</span> Digital transformation is a business change, not an IT purchase. Start from the customer problem and the process, then choose the technology.</div>`,
    `<span class="eyebrow">ECO102 · Phần 3 · Bài 3.2</span>
<h2>Công nghệ, đổi mới sáng tạo &amp; chuyển đổi số</h2>
<p class="lead">Công nghệ là lực lượng môi trường hay vẽ lại ranh giới ngành nhất. Nó thay đổi <strong>sản phẩm</strong> (điện thoại thông minh thay máy ảnh và bản đồ), <strong>quy trình</strong> (tự động hoá, phần mềm đám mây), <strong>mô hình kinh doanh</strong> (thuê bao, nền tảng) và <strong>cấu trúc ngành</strong> (rào cản gia nhập thấp hơn, sản phẩm thay thế mới) — và kéo theo cả những kỹ năng doanh nghiệp cần.</p>
<h3>Phát minh và đổi mới</h3>
<p><strong>Phát minh</strong> là một ý tưởng hay thiết bị mới; <strong>đổi mới</strong> là việc đưa nó vào sử dụng hoặc ra thị trường thành công. Đổi mới có thể <strong>tuần tự</strong> (cải tiến dần) hoặc <strong>đột phá</strong> (bước nhảy lớn). Tidd và Bessant mô tả bốn đối tượng — "4P": <strong>sản phẩm</strong> (ta chào bán gì), <strong>quy trình</strong> (ta làm ra và cung ứng thế nào), <strong>vị thế</strong> (bối cảnh hay câu chuyện mà ta đặt sản phẩm vào) và <strong>mô thức</strong> (mô hình kinh doanh nền tảng).</p>
<h3>Đổi mới duy trì và đổi mới phá vỡ</h3>
<p>Clayton Christensen phân biệt đổi mới <strong>duy trì</strong> — cải tiến sản phẩm cho khách hàng chủ lưu hiện có — với đổi mới <strong>phá vỡ</strong> — khởi đầu là sản phẩm đơn giản hơn, rẻ hơn hoặc tiện hơn cho nhóm khách bị bỏ qua hay thị trường mới, bị doanh nghiệp đầu ngành xem nhẹ, rồi cải thiện dần tới mức giành được khách hàng chủ lưu. Doanh nghiệp dẫn đầu thường thua không phải vì quản lý kém, mà vì họ tập trung một cách hợp lý vào những khách hàng tốt nhất của mình.</p>
<h3>Công nghệ mới lan toả thế nào</h3>
<table>
<tr><th>Nhóm chấp nhận (Rogers)</th><th>Tỷ lệ</th><th>Thái độ điển hình</th></tr>
<tr><td>Người đổi mới</td><td>2,5%</td><td>Ưa mạo hiểm, chịu được rủi ro</td></tr>
<tr><td>Người chấp nhận sớm</td><td>13,5%</td><td>Người dẫn dắt dư luận được tôn trọng</td></tr>
<tr><td>Số đông sớm</td><td>34%</td><td>Thận trọng; muốn lợi ích đã được chứng minh</td></tr>
<tr><td>Số đông muộn</td><td>34%</td><td>Hoài nghi; chấp nhận khi bị áp lực hoặc buộc phải dùng</td></tr>
<tr><td>Người tụt hậu</td><td>16%</td><td>Truyền thống; chấp nhận sau cùng</td></tr>
</table>
<p>Một đổi mới lan nhanh hơn khi có lợi thế tương đối rõ ràng, hợp với thói quen sẵn có, đơn giản, dùng thử được ở quy mô nhỏ và cho kết quả nhìn thấy được. Khoảng trống giữa nhóm chấp nhận sớm nhiệt tình và nhóm số đông sớm thực dụng là nơi nhiều sản phẩm mới thất bại.</p>
<h3>Chuyển đổi số</h3>
<ul>
<li><strong>Số hoá dữ liệu</strong> (digitization) — chuyển thông tin sang dạng số (quét hoá đơn giấy).</li>
<li><strong>Số hoá quy trình</strong> (digitalization) — dùng công nghệ số để cải tiến quy trình (hoá đơn điện tử, đặt hàng trực tuyến).</li>
<li><strong>Chuyển đổi số</strong> (digital transformation) — tư duy lại mô hình kinh doanh, trải nghiệm khách hàng và tổ chức xoay quanh dữ liệu và công nghệ số.</li>
</ul>
<p>Các yếu tố hỗ trợ gồm điện toán đám mây, internet di động, phân tích dữ liệu, trí tuệ nhân tạo và Internet vạn vật; thuật ngữ <strong>Công nghiệp 4.0</strong> ra đời ở Đức mô tả nhà máy kết nối, vận hành bằng dữ liệu. <strong>Nền tảng số</strong> (sàn thương mại, gọi xe, kho ứng dụng) kết nối hai hay nhiều nhóm người dùng và hưởng lợi từ <strong>hiệu ứng mạng</strong>: mỗi người dùng thêm vào làm nền tảng có giá trị hơn với người khác, có thể dẫn tới thị trường "kẻ thắng lấy gần hết".</p>
<h3>Rủi ro và cách ứng phó</h3>
<p>Rủi ro: tấn công mạng, lộ lọt dữ liệu cá nhân và quy định bảo vệ dữ liệu ngày càng chặt (ở Việt Nam, hãy kiểm các quy định đang có hiệu lực), thiếu hụt kỹ năng, mất việc làm, phụ thuộc vào một vài nền tảng, và chi phí của dự án thất bại. Cách ứng phó: theo dõi xu hướng công nghệ, thử nghiệm nhỏ trước khi đầu tư lớn, đào tạo lại nhân viên, và áp dụng <strong>đổi mới mở</strong> (Henry Chesbrough) — hợp tác với start-up, trường đại học và nhà cung cấp thay vì chỉ trông vào R&amp;D nội bộ.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Chuyển đổi số là một thay đổi về kinh doanh, không phải một lần mua sắm CNTT. Hãy bắt đầu từ vấn đề của khách hàng và quy trình, rồi mới chọn công nghệ.</div>`,
  ]]);

const c6e = doc('eco102-3-3-exercise', 'Exercise 3 — Five forces scorecard for the milk-tea shop industry|||Bài tập 3 — Bảng chấm năm lực lượng cho ngành cửa hàng trà sữa',
  'Bài tập tình huống giả định: chấm 15 yếu tố con cho năm lực lượng cạnh tranh của ngành trà sữa ở một thành phố lớn, tính điểm trung bình từng lực lượng và toàn ngành, phân tích độ nhạy khi rào cản gia nhập tăng, và đề xuất cách một chuỗi làm yếu các lực lượng; kèm lời giải.',
  [[
    `<span class="eyebrow">ECO102 · Part 3 · Exercise 3</span>
<h2>Exercise 3 — how attractive is the industry?</h2>
<div class="callout"><span class="badge">Problem</span> An investor is considering opening a chain of milk-tea shops in a large city (a fictional case with illustrative scores). Each force is assessed on three sub-factors, scored 1–5, where 5 means the force is very strong (bad for industry profits). Bands for averages: 1.0–2.4 weak, 2.5–3.4 moderate, 3.5–5.0 strong. (a) Compute the average for each force and for the industry. (b) A new regulation requires costly food-safety certification before opening, cutting the "low capital needed" score from 5 to 3. Recalculate. (c) Suggest how a new chain could weaken the strongest forces.</div>
<h3>Worked solution</h3>
<table>
<tr><th>Force</th><th>Sub-factors (score)</th><th>Average</th><th>Band</th></tr>
<tr><td>Threat of new entrants</td><td>Little capital needed to open a shop (5) · weak brand loyalty (4) · easy access to premises and delivery apps (3)</td><td>12 / 3 = 4.00</td><td>Strong</td></tr>
<tr><td>Supplier power</td><td>Many ingredient and packaging suppliers (2) · standard inputs, easy to switch (2) · landlords of prime locations (5)</td><td>9 / 3 = 3.00</td><td>Moderate</td></tr>
<tr><td>Buyer power</td><td>Each buyer purchases small amounts (2) · zero switching cost (5) · price comparison and promotions on apps (4)</td><td>11 / 3 = 3.67</td><td>Strong</td></tr>
<tr><td>Threat of substitutes</td><td>Many substitutes: coffee, juice, soft drinks (5) · similar price–performance (4) · health trend pulls some buyers away (3)</td><td>12 / 3 = 4.00</td><td>Strong</td></tr>
<tr><td>Rivalry</td><td>Many similar shops (5) · low differentiation (4) · slowing growth in central districts (4)</td><td>13 / 3 = 4.33</td><td>Strong</td></tr>
</table>
<pre><code class="language-text">(a) Industry average = (4.00 + 3.00 + 3.67 + 4.00 + 4.33) / 5 = 19.00 / 5 = 3.80  -> strong forces,
    an unattractive industry on average: profits are competed away.

(b) New entrants = (3 + 4 + 3) / 3 = 10 / 3 = 3.33  -> moderate (was 4.00, strong)
    Industry average = (3.33 + 3.00 + 3.67 + 4.00 + 4.33) / 5 = 18.33 / 5 = 3.67  -> still strong</code></pre>
<table>
<tr><th>Strong force</th><th>How a chain could weaken it</th></tr>
<tr><td>Rivalry</td><td>Differentiate with signature recipes, store design and consistent quality; avoid pure price wars</td></tr>
<tr><td>Buyer power</td><td>Raise switching costs with a loyalty app, member prices and personalised offers</td></tr>
<tr><td>Substitutes</td><td>Widen the range (less-sugar drinks, fruit teas) to capture buyers who move with the health trend</td></tr>
<tr><td>New entrants</td><td>Build scale economies in purchasing and a strong brand; secure the best locations on long leases (which also limits landlord power)</td></tr>
</table>
<p><strong>Why:</strong> the scorecard makes judgement explicit and comparable, but the numbers are only as good as the reasoning behind them. Part (b) shows that one PESTLE change (regulation) moves one force, yet the industry stays tough: a newcomer can succeed only if its strategy weakens several forces for <em>itself</em>, not for the whole industry.</p>`,
    `<span class="eyebrow">ECO102 · Phần 3 · Bài tập 3</span>
<h2>Bài tập 3 — ngành này hấp dẫn đến đâu?</h2>
<div class="callout"><span class="badge">Đề</span> Một nhà đầu tư cân nhắc mở chuỗi cửa hàng trà sữa ở một thành phố lớn (tình huống giả định, điểm số minh hoạ). Mỗi lực lượng được đánh giá qua ba yếu tố con, chấm từ 1 đến 5, trong đó 5 nghĩa là lực lượng rất mạnh (bất lợi cho lợi nhuận ngành). Thang điểm trung bình: 1,0–2,4 yếu, 2,5–3,4 trung bình, 3,5–5,0 mạnh. (a) Tính điểm trung bình của từng lực lượng và của toàn ngành. (b) Một quy định mới buộc phải có chứng nhận an toàn thực phẩm tốn kém trước khi mở cửa hàng, khiến điểm "cần ít vốn" giảm từ 5 xuống 3. Tính lại. (c) Đề xuất cách một chuỗi mới có thể làm yếu các lực lượng mạnh nhất.</div>
<h3>Lời giải</h3>
<table>
<tr><th>Lực lượng</th><th>Yếu tố con (điểm)</th><th>Trung bình</th><th>Mức</th></tr>
<tr><td>Nguy cơ gia nhập mới</td><td>Cần ít vốn để mở cửa hàng (5) · lòng trung thành thương hiệu yếu (4) · dễ thuê mặt bằng và lên ứng dụng giao hàng (3)</td><td>12 / 3 = 4,00</td><td>Mạnh</td></tr>
<tr><td>Quyền lực nhà cung cấp</td><td>Nhiều nhà cung cấp nguyên liệu và bao bì (2) · đầu vào tiêu chuẩn, dễ đổi (2) · chủ mặt bằng ở vị trí đẹp (5)</td><td>9 / 3 = 3,00</td><td>Trung bình</td></tr>
<tr><td>Quyền lực người mua</td><td>Mỗi người mua với lượng nhỏ (2) · chi phí chuyển đổi bằng không (5) · so giá và khuyến mãi trên ứng dụng (4)</td><td>11 / 3 = 3,67</td><td>Mạnh</td></tr>
<tr><td>Nguy cơ sản phẩm thay thế</td><td>Nhiều sản phẩm thay thế: cà phê, nước ép, nước ngọt (5) · tương quan giá – công dụng tương đương (4) · xu hướng sống khoẻ kéo một số khách đi (3)</td><td>12 / 3 = 4,00</td><td>Mạnh</td></tr>
<tr><td>Cạnh tranh nội bộ ngành</td><td>Nhiều cửa hàng na ná nhau (5) · ít khác biệt (4) · tăng trưởng chậm lại ở các quận trung tâm (4)</td><td>13 / 3 = 4,33</td><td>Mạnh</td></tr>
</table>
<pre><code class="language-text">(a) Trung bình ngành = (4,00 + 3,00 + 3,67 + 4,00 + 4,33) / 5 = 19,00 / 5 = 3,80  -> các lực lượng mạnh,
    ngành kém hấp dẫn xét trung bình: lợi nhuận bị cạnh tranh bào mòn.

(b) Gia nhập mới = (3 + 4 + 3) / 3 = 10 / 3 = 3,33  -> trung bình (trước là 4,00, mạnh)
    Trung bình ngành = (3,33 + 3,00 + 3,67 + 4,00 + 4,33) / 5 = 18,33 / 5 = 3,67  -> vẫn mạnh</code></pre>
<table>
<tr><th>Lực lượng mạnh</th><th>Cách một chuỗi có thể làm yếu nó</th></tr>
<tr><td>Cạnh tranh nội bộ ngành</td><td>Khác biệt hoá bằng công thức riêng, thiết kế cửa hàng và chất lượng ổn định; tránh chiến tranh giá thuần tuý</td></tr>
<tr><td>Quyền lực người mua</td><td>Tăng chi phí chuyển đổi bằng ứng dụng khách hàng thân thiết, giá thành viên và ưu đãi cá nhân hoá</td></tr>
<tr><td>Sản phẩm thay thế</td><td>Mở rộng danh mục (đồ uống ít đường, trà trái cây) để giữ những khách chuyển theo xu hướng sống khoẻ</td></tr>
<tr><td>Gia nhập mới</td><td>Tạo lợi thế quy mô trong thu mua và thương hiệu mạnh; giữ các vị trí đẹp nhất bằng hợp đồng thuê dài hạn (đồng thời hạn chế quyền lực chủ mặt bằng)</td></tr>
</table>
<p><strong>Vì sao:</strong> bảng chấm điểm làm cho phán đoán trở nên minh bạch và so sánh được, nhưng con số chỉ tốt bằng lập luận đứng sau nó. Câu (b) cho thấy một thay đổi PESTLE (quy định) làm dịch chuyển một lực lượng, nhưng ngành vẫn khắc nghiệt: người mới vào chỉ thành công nếu chiến lược của họ làm yếu nhiều lực lượng đối với <em>chính mình</em>, chứ không phải với cả ngành.</p>`,
  ]]);

const c6q = quiz('eco102-quiz-3', 'Quiz 3 — Industry, competition & technology|||Quiz 3 — Ngành, cạnh tranh & công nghệ', [
  { id: 'q1', question: 'A market dominated by a few large, interdependent firms protected by high entry barriers is…|||Thị trường bị chi phối bởi một vài doanh nghiệp lớn, phụ thuộc lẫn nhau và được bảo vệ bởi rào cản gia nhập cao là…', options: ['perfect competition|||cạnh tranh hoàn hảo', 'monopolistic competition|||cạnh tranh độc quyền', 'monopoly|||độc quyền', 'oligopoly|||độc quyền nhóm'], correctIndex: 3, explanation: 'Interdependence — each firm must anticipate rivals’ reactions — is the defining feature of oligopoly.|||Sự phụ thuộc lẫn nhau — mỗi doanh nghiệp phải tính trước phản ứng của đối thủ — là đặc trưng của độc quyền nhóm.' },
  { id: 'q2', question: 'Four firms hold market shares of 50%, 30%, 10% and 10%. What is the HHI?|||Bốn doanh nghiệp có thị phần 50%, 30%, 10% và 10%. Chỉ số HHI là bao nhiêu?', options: ['3,600|||3.600', '100|||100', '1,000|||1.000', '10,000|||10.000'], correctIndex: 0, explanation: '50² + 30² + 10² + 10² = 2,500 + 900 + 100 + 100 = 3,600. The CR4 here is 100%.|||50² + 30² + 10² + 10² = 2.500 + 900 + 100 + 100 = 3.600. CR4 ở đây là 100%.' },
  { id: 'q3', question: 'According to Christensen, a disruptive innovation typically…|||Theo Christensen, một đổi mới phá vỡ thường…', options: ['targets the most demanding customers with a better, more expensive product|||nhắm vào khách hàng khó tính nhất bằng sản phẩm tốt hơn, đắt hơn', 'starts as a simpler, cheaper offer for overlooked customers and later moves upmarket|||khởi đầu là sản phẩm đơn giản, rẻ hơn cho nhóm khách bị bỏ qua rồi dần tiến lên phân khúc cao', 'is always a new scientific invention|||luôn là một phát minh khoa học mới', 'is quickly adopted by market leaders|||được doanh nghiệp dẫn đầu thị trường áp dụng ngay'], correctIndex: 1, explanation: 'Incumbents tend to ignore disruptive offers because their best customers do not want them — until the offers improve enough.|||Doanh nghiệp đầu ngành thường bỏ qua sản phẩm phá vỡ vì khách hàng tốt nhất của họ không cần tới — cho tới khi sản phẩm đó đủ tốt.' },
]);

const c7 = doc('eco102-4-1-legal-ethics-csr', '4.1 — Legal environment, business ethics, CSR & ESG|||4.1 — Môi trường pháp lý, đạo đức kinh doanh, CSR & ESG',
  'Thể chế chính thức và phi chính thức, các lĩnh vực luật tác động tới doanh nghiệp (kèm các luật chính ở Việt Nam), đạo đức kinh doanh và các cách tiếp cận, quan điểm cổ đông và quan điểm các bên liên quan, tháp CSR của Carroll, giá trị chung, phát triển bền vững, ba trụ cột lợi nhuận – con người – hành tinh, ESG, SDGs và tẩy xanh.',
  [[
    `<span class="eyebrow">ECO102 · Part 4 · Lesson 4.1</span>
<h2>Legal environment, business ethics, CSR &amp; ESG</h2>
<h3>Institutions: the rules of the game</h3>
<p>Douglass North described institutions as the "rules of the game" in a society. <strong>Formal institutions</strong> are constitutions, laws, regulations, courts and regulators; <strong>informal institutions</strong> are norms, customs and expectations. Clear, stable and enforced rules lower the cost and risk of doing business. Legal systems differ: <em>common law</em> systems rely heavily on judicial precedent, while <em>civil law</em> systems rely mainly on written codes — Vietnam's system is largely codified.</p>
<table>
<tr><th>Area of law</th><th>What it governs</th><th>Business implication</th></tr>
<tr><td>Company and investment law</td><td>Forms of enterprise, governance, foreign investment</td><td>How to set up, raise capital and be governed</td></tr>
<tr><td>Contract law</td><td>Agreements with customers, suppliers, partners</td><td>Enforceable deals; dispute resolution</td></tr>
<tr><td>Competition law</td><td>Anti-competitive agreements, abuse of dominance, mergers</td><td>Limits on cartels, predatory pricing, some mergers</td></tr>
<tr><td>Consumer protection</td><td>Product safety, information, unfair terms</td><td>Honest labelling and advertising, warranties, recalls</td></tr>
<tr><td>Employment law</td><td>Contracts, wages, working hours, safety, social insurance</td><td>Labour costs, flexibility, workplace standards</td></tr>
<tr><td>Intellectual property</td><td>Patents, trademarks, copyright, trade secrets</td><td>Protection of innovations and brands</td></tr>
<tr><td>Environmental and data-protection law</td><td>Pollution, waste, emissions; personal data</td><td>Permits, compliance costs, fines, reputation</td></tr>
</table>
<p>In Vietnam the main texts include the Law on Enterprises, the Law on Investment, the Competition Law, the Law on Protection of Consumers' Rights, the Labour Code, the Law on Intellectual Property and the Law on Environmental Protection. Laws are amended often — always check the version currently in force (for example on the national legal database vbpl.vn).</p>
<h3>Business ethics</h3>
<p>Law sets the minimum; <strong>ethics</strong> asks what is right. Common lenses: <strong>consequences</strong> (which choice produces the greatest good for the most people?), <strong>duties and rights</strong> (which choice respects everyone's rights and our obligations?) and <strong>virtue</strong> (what would a person of integrity do?). A practical test: would you be comfortable if the decision appeared on the front page of a newspaper?</p>
<h3>Corporate social responsibility (CSR)</h3>
<p>Milton Friedman famously argued that the social responsibility of business is to increase its profits within the rules of the game; the <strong>stakeholder view</strong> argues that firms also owe duties to employees, customers, communities and the environment. Archie Carroll's <strong>CSR pyramid</strong> has four layers, from the base up: <strong>economic</strong> (be profitable), <strong>legal</strong> (obey the law), <strong>ethical</strong> (do what is right, fair and just) and <strong>philanthropic</strong> (be a good corporate citizen). Porter and Kramer's <strong>creating shared value</strong> seeks business opportunities in solving social problems.</p>
<h3>Sustainability and ESG</h3>
<ul>
<li><strong>Sustainable development</strong> (Brundtland Report, 1987): meeting present needs without compromising future generations' ability to meet theirs.</li>
<li><strong>Triple bottom line</strong> (John Elkington): judge performance on profit, people and planet.</li>
<li><strong>ESG</strong> — environmental, social and governance criteria used by investors and lenders to assess risks and practices; sustainability reporting frameworks include GRI and the ISSB standards.</li>
<li>The UN's 17 <strong>Sustainable Development Goals</strong> (2015) give a shared agenda to 2030.</li>
</ul>
<div class="callout"><span class="badge">Warning</span> <strong>Greenwashing</strong> — exaggerated or misleading environmental claims — destroys trust and can break consumer-protection and advertising rules. Claims must be specific, measurable and verifiable.</div>`,
    `<span class="eyebrow">ECO102 · Phần 4 · Bài 4.1</span>
<h2>Môi trường pháp lý, đạo đức kinh doanh, CSR &amp; ESG</h2>
<h3>Thể chế: luật chơi</h3>
<p>Douglass North mô tả thể chế là "luật chơi" của một xã hội. <strong>Thể chế chính thức</strong> là hiến pháp, luật, quy định, toà án và cơ quan quản lý; <strong>thể chế phi chính thức</strong> là chuẩn mực, phong tục và kỳ vọng. Luật lệ rõ ràng, ổn định và được thực thi giúp giảm chi phí và rủi ro kinh doanh. Các hệ thống pháp luật khác nhau: hệ thống <em>thông luật</em> dựa nhiều vào án lệ, còn hệ thống <em>dân luật</em> dựa chủ yếu vào văn bản pháp điển — pháp luật Việt Nam chủ yếu thành văn.</p>
<table>
<tr><th>Lĩnh vực luật</th><th>Điều chỉnh</th><th>Hàm ý cho doanh nghiệp</th></tr>
<tr><td>Luật doanh nghiệp và đầu tư</td><td>Loại hình doanh nghiệp, quản trị, đầu tư nước ngoài</td><td>Cách thành lập, huy động vốn và được quản trị</td></tr>
<tr><td>Luật hợp đồng</td><td>Thoả thuận với khách hàng, nhà cung cấp, đối tác</td><td>Giao dịch có hiệu lực thi hành; giải quyết tranh chấp</td></tr>
<tr><td>Luật cạnh tranh</td><td>Thoả thuận hạn chế cạnh tranh, lạm dụng vị trí thống lĩnh, sáp nhập</td><td>Giới hạn cartel, định giá huỷ diệt, một số vụ sáp nhập</td></tr>
<tr><td>Bảo vệ người tiêu dùng</td><td>An toàn sản phẩm, thông tin, điều khoản không công bằng</td><td>Nhãn mác và quảng cáo trung thực, bảo hành, thu hồi sản phẩm</td></tr>
<tr><td>Luật lao động</td><td>Hợp đồng, tiền lương, giờ làm, an toàn, bảo hiểm xã hội</td><td>Chi phí lao động, tính linh hoạt, chuẩn mực nơi làm việc</td></tr>
<tr><td>Sở hữu trí tuệ</td><td>Sáng chế, nhãn hiệu, quyền tác giả, bí mật kinh doanh</td><td>Bảo hộ đổi mới và thương hiệu</td></tr>
<tr><td>Luật môi trường và bảo vệ dữ liệu</td><td>Ô nhiễm, chất thải, khí thải; dữ liệu cá nhân</td><td>Giấy phép, chi phí tuân thủ, tiền phạt, uy tín</td></tr>
</table>
<p>Ở Việt Nam, các văn bản chính gồm Luật Doanh nghiệp, Luật Đầu tư, Luật Cạnh tranh, Luật Bảo vệ quyền lợi người tiêu dùng, Bộ luật Lao động, Luật Sở hữu trí tuệ và Luật Bảo vệ môi trường. Luật được sửa đổi thường xuyên — luôn kiểm phiên bản đang có hiệu lực (ví dụ trên cơ sở dữ liệu quốc gia về pháp luật vbpl.vn).</p>
<h3>Đạo đức kinh doanh</h3>
<p>Pháp luật đặt ra mức tối thiểu; <strong>đạo đức</strong> hỏi điều gì là đúng. Các lăng kính phổ biến: <strong>hệ quả</strong> (lựa chọn nào mang lại lợi ích lớn nhất cho nhiều người nhất?), <strong>bổn phận và quyền</strong> (lựa chọn nào tôn trọng quyền của mọi người và nghĩa vụ của ta?) và <strong>phẩm hạnh</strong> (một người chính trực sẽ làm gì?). Một phép thử thực tế: bạn có thấy thoải mái nếu quyết định này lên trang nhất một tờ báo?</p>
<h3>Trách nhiệm xã hội của doanh nghiệp (CSR)</h3>
<p>Milton Friedman nổi tiếng với lập luận rằng trách nhiệm xã hội của doanh nghiệp là tăng lợi nhuận trong khuôn khổ luật chơi; <strong>quan điểm các bên liên quan</strong> cho rằng doanh nghiệp còn có nghĩa vụ với người lao động, khách hàng, cộng đồng và môi trường. <strong>Tháp CSR</strong> của Archie Carroll có bốn tầng, từ đáy lên: <strong>kinh tế</strong> (có lợi nhuận), <strong>pháp lý</strong> (tuân thủ pháp luật), <strong>đạo đức</strong> (làm điều đúng, công bằng, chính trực) và <strong>từ thiện</strong> (là công dân doanh nghiệp tốt). Khái niệm <strong>tạo giá trị chung</strong> của Porter và Kramer tìm cơ hội kinh doanh trong việc giải quyết các vấn đề xã hội.</p>
<h3>Phát triển bền vững và ESG</h3>
<ul>
<li><strong>Phát triển bền vững</strong> (Báo cáo Brundtland, 1987): đáp ứng nhu cầu hiện tại mà không làm tổn hại khả năng đáp ứng nhu cầu của các thế hệ tương lai.</li>
<li><strong>Ba trụ cột</strong> (triple bottom line — John Elkington): đánh giá kết quả theo lợi nhuận, con người và hành tinh.</li>
<li><strong>ESG</strong> — các tiêu chí môi trường, xã hội và quản trị mà nhà đầu tư và bên cho vay dùng để đánh giá rủi ro và cách làm của doanh nghiệp; các khung báo cáo bền vững gồm GRI và bộ chuẩn mực ISSB.</li>
<li>17 <strong>Mục tiêu Phát triển Bền vững</strong> của Liên Hợp Quốc (2015) là chương trình nghị sự chung tới năm 2030.</li>
</ul>
<div class="callout"><span class="badge">Cảnh báo</span> <strong>Tẩy xanh</strong> (greenwashing) — tuyên bố về môi trường phóng đại hoặc gây hiểu lầm — phá huỷ niềm tin và có thể vi phạm quy định về bảo vệ người tiêu dùng và quảng cáo. Tuyên bố phải cụ thể, đo lường được và kiểm chứng được.</div>`,
  ]]);

const c8 = doc('eco102-4-2-analysing-responding', '4.2 — Analysing and responding to the environment|||4.2 — Phân tích và ứng phó với môi trường',
  'Mức độ bất định của môi trường (ma trận phức tạp × biến động của Duncan), quy trình quét môi trường 4 bước và nguồn thông tin, SWOT nối với PESTLE và năm lực lượng, ma trận TOWS, lập kịch bản 2×2 với dấu hiệu cảnh báo sớm, các cách ứng phó: thích nghi, định hình, tạo vùng đệm, đa dạng hoá.',
  [[
    `<span class="eyebrow">ECO102 · Part 4 · Lesson 4.2</span>
<h2>Analysing and responding to the environment</h2>
<h3>How uncertain is the environment?</h3>
<p>Robert Duncan described environmental uncertainty along two dimensions: <strong>complexity</strong> (how many factors matter, and how different they are) and <strong>dynamism</strong> (how fast they change).</p>
<table>
<tr><th></th><th>Simple</th><th>Complex</th></tr>
<tr><td><strong>Static</strong></td><td>Low uncertainty — past experience is a good guide</td><td>Moderately low — detailed analysis pays off</td></tr>
<tr><td><strong>Dynamic</strong></td><td>Moderately high — watch for change, stay flexible</td><td>High — scenarios, flexibility and fast learning are essential</td></tr>
</table>
<h3>Environmental scanning</h3>
<ol>
<li><strong>Scanning</strong> — searching broadly for signals of change.</li>
<li><strong>Monitoring</strong> — tracking the signals that matter over time.</li>
<li><strong>Forecasting</strong> — projecting where the trends are heading.</li>
<li><strong>Assessing</strong> — judging the implications for the organization.</li>
</ol>
<p>Sources include official statistics, central bank and government publications, industry associations, trade press, international organizations (World Bank, WTO), customer and sales data, suppliers and front-line staff.</p>
<h3>From PESTLE to SWOT to strategy</h3>
<p><strong>SWOT</strong> summarizes internal <strong>strengths</strong> and <strong>weaknesses</strong> (from an audit of resources and capabilities) and external <strong>opportunities</strong> and <strong>threats</strong> (from PESTLE and five forces). The <strong>TOWS matrix</strong> (Heinz Weihrich) turns the list into strategic options — here for PackCo from Exercise 2:</p>
<table>
<tr><th></th><th>Opportunities: delivery growth, green demand</th><th>Threats: EPR rules, anti-plastic policy</th></tr>
<tr><td><strong>Strengths:</strong> strong ties with delivery kitchens</td><td><strong>SO</strong> — sell a recyclable range through existing customer relationships</td><td><strong>ST</strong> — use those relationships to run a packaging take-back scheme that supports EPR compliance</td></tr>
<tr><td><strong>Weaknesses:</strong> no paper-forming technology</td><td><strong>WO</strong> — license the technology or partner with a paper-packaging maker</td><td><strong>WT</strong> — phase out the least profitable single-use items before rules tighten</td></tr>
</table>
<h3>Scenario planning</h3>
<p>When the future cannot be forecast reliably, <strong>scenarios</strong> describe several plausible futures. The approach was made famous by Shell in the 1970s. Steps: define the focal question and time horizon; list the driving forces; rank them by impact and uncertainty; choose the two most critical uncertainties to form a 2×2 matrix; write a short story for each scenario; test strategies against all four; set <strong>signposts</strong> (early-warning indicators).</p>
<pre><code class="language-text">PackCo, 5 years ahead         Alternatives stay expensive     Alternatives become cheap
Plastic rules tighten slowly  "Business as usual, for now"    "Customers switch first"
Plastic rules tighten fast    "Squeezed from both sides"      "Green race"

Signposts: draft regulations, recycled-resin prices, big customers' packaging policies.</code></pre>
<p>A <strong>robust strategy</strong> works reasonably well in all four — for PackCo, building capability in recyclable materials does.</p>
<h3>Ways to respond</h3>
<ul>
<li><strong>Adapt</strong> — reactively (after a change) or proactively (before it).</li>
<li><strong>Shape</strong> the environment — through industry associations, consultations on draft rules, standards, alliances and innovation.</li>
<li><strong>Buffer</strong> — safety stock, insurance, hedging exchange rates with forward contracts, multiple suppliers.</li>
<li><strong>Diversify</strong> — across products, markets or suppliers to reduce dependence on one source of risk.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Analysis is only useful if it changes decisions. End every environmental analysis with priorities, options and the signals you will keep watching.</div>`,
    `<span class="eyebrow">ECO102 · Phần 4 · Bài 4.2</span>
<h2>Phân tích và ứng phó với môi trường</h2>
<h3>Môi trường bất định đến đâu?</h3>
<p>Robert Duncan mô tả mức bất định của môi trường theo hai chiều: <strong>độ phức tạp</strong> (có bao nhiêu yếu tố quan trọng và chúng khác nhau thế nào) và <strong>độ biến động</strong> (chúng thay đổi nhanh đến đâu).</p>
<table>
<tr><th></th><th>Đơn giản</th><th>Phức tạp</th></tr>
<tr><td><strong>Ổn định</strong></td><td>Bất định thấp — kinh nghiệm quá khứ là chỉ dẫn tốt</td><td>Bất định tương đối thấp — phân tích chi tiết sẽ có ích</td></tr>
<tr><td><strong>Biến động</strong></td><td>Bất định tương đối cao — theo dõi thay đổi, giữ linh hoạt</td><td>Bất định cao — kịch bản, sự linh hoạt và học nhanh là thiết yếu</td></tr>
</table>
<h3>Quét môi trường</h3>
<ol>
<li><strong>Rà quét</strong> — tìm kiếm rộng các tín hiệu thay đổi.</li>
<li><strong>Theo dõi</strong> — bám sát theo thời gian những tín hiệu quan trọng.</li>
<li><strong>Dự báo</strong> — phóng chiếu xu hướng sẽ đi về đâu.</li>
<li><strong>Đánh giá</strong> — nhận định hàm ý đối với tổ chức.</li>
</ol>
<p>Nguồn thông tin gồm số liệu thống kê chính thức, ấn phẩm của ngân hàng trung ương và Chính phủ, hiệp hội ngành, báo chí chuyên ngành, tổ chức quốc tế (Ngân hàng Thế giới, WTO), dữ liệu khách hàng và bán hàng, nhà cung cấp và nhân viên tuyến đầu.</p>
<h3>Từ PESTLE sang SWOT rồi tới chiến lược</h3>
<p><strong>SWOT</strong> tóm tắt <strong>điểm mạnh</strong> và <strong>điểm yếu</strong> bên trong (từ việc rà soát nguồn lực và năng lực) cùng <strong>cơ hội</strong> và <strong>nguy cơ</strong> bên ngoài (từ PESTLE và năm lực lượng). <strong>Ma trận TOWS</strong> (Heinz Weihrich) biến danh sách đó thành các phương án chiến lược — ở đây cho PackCo trong Bài tập 2:</p>
<table>
<tr><th></th><th>Cơ hội: giao đồ ăn tăng, nhu cầu sản phẩm xanh</th><th>Nguy cơ: quy định EPR, chính sách hạn chế nhựa</th></tr>
<tr><td><strong>Điểm mạnh:</strong> quan hệ chặt với các bếp giao đồ ăn</td><td><strong>SO</strong> — bán dòng sản phẩm tái chế được qua quan hệ khách hàng sẵn có</td><td><strong>ST</strong> — dùng chính các quan hệ đó để triển khai chương trình thu hồi bao bì, hỗ trợ tuân thủ EPR</td></tr>
<tr><td><strong>Điểm yếu:</strong> chưa có công nghệ định hình giấy</td><td><strong>WO</strong> — mua bản quyền công nghệ hoặc hợp tác với một nhà sản xuất bao bì giấy</td><td><strong>WT</strong> — loại dần các mặt hàng dùng một lần kém lãi nhất trước khi quy định siết chặt</td></tr>
</table>
<h3>Lập kịch bản</h3>
<p>Khi tương lai không thể dự báo đáng tin cậy, <strong>kịch bản</strong> mô tả nhiều tương lai hợp lý khác nhau. Cách làm này nổi tiếng nhờ Shell từ những năm 1970. Các bước: xác định câu hỏi trọng tâm và tầm nhìn thời gian; liệt kê các động lực; xếp hạng chúng theo mức tác động và mức bất định; chọn hai yếu tố bất định then chốt nhất để lập ma trận 2×2; viết một câu chuyện ngắn cho mỗi kịch bản; thử các chiến lược trong cả bốn kịch bản; đặt các <strong>dấu hiệu cảnh báo sớm</strong>.</p>
<pre><code class="language-text">PackCo, 5 năm tới               Vật liệu thay thế vẫn đắt       Vật liệu thay thế trở nên rẻ
Quy định về nhựa siết chậm      "Tạm thời như cũ"               "Khách hàng đổi trước"
Quy định về nhựa siết nhanh     "Bị ép cả hai phía"             "Cuộc đua xanh"

Dấu hiệu cảnh báo: dự thảo quy định, giá hạt nhựa tái chế, chính sách bao bì của các khách hàng lớn.</code></pre>
<p>Một <strong>chiến lược vững</strong> hoạt động tương đối tốt trong cả bốn kịch bản — với PackCo, xây dựng năng lực về vật liệu tái chế được là chiến lược như vậy.</p>
<h3>Các cách ứng phó</h3>
<ul>
<li><strong>Thích nghi</strong> — thụ động (sau khi thay đổi xảy ra) hoặc chủ động (trước khi nó xảy ra).</li>
<li><strong>Định hình</strong> môi trường — qua hiệp hội ngành, góp ý dự thảo quy định, tiêu chuẩn, liên minh và đổi mới.</li>
<li><strong>Tạo vùng đệm</strong> — tồn kho an toàn, bảo hiểm, phòng ngừa rủi ro tỷ giá bằng hợp đồng kỳ hạn, nhiều nhà cung cấp.</li>
<li><strong>Đa dạng hoá</strong> — theo sản phẩm, thị trường hoặc nhà cung cấp để giảm phụ thuộc vào một nguồn rủi ro.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Phân tích chỉ có ích khi nó làm thay đổi quyết định. Hãy kết thúc mọi phân tích môi trường bằng các ưu tiên, các phương án và những tín hiệu bạn sẽ tiếp tục theo dõi.</div>`,
  ]]);

const c8q = quiz('eco102-quiz-4', 'Quiz 4 — Law, ethics & responding to change|||Quiz 4 — Pháp luật, đạo đức & ứng phó với thay đổi', [
  { id: 'q1', question: 'What is the BASE layer of Carroll’s CSR pyramid?|||Tầng ĐÁY của tháp CSR của Carroll là gì?', options: ['Philanthropic responsibility|||Trách nhiệm từ thiện', 'Ethical responsibility|||Trách nhiệm đạo đức', 'Legal responsibility|||Trách nhiệm pháp lý', 'Economic responsibility|||Trách nhiệm kinh tế'], correctIndex: 3, explanation: 'From the base up: economic, legal, ethical, philanthropic. A business must survive profitably before it can meet its other responsibilities.|||Từ đáy lên: kinh tế, pháp lý, đạo đức, từ thiện. Doanh nghiệp phải tồn tại và có lãi trước khi thực hiện được các trách nhiệm khác.' },
  { id: 'q2', question: 'In a TOWS matrix, using internal strengths to reduce the impact of external threats is a…|||Trong ma trận TOWS, dùng điểm mạnh bên trong để giảm tác động của nguy cơ bên ngoài là chiến lược…', options: ['SO strategy|||SO', 'WO strategy|||WO', 'ST strategy|||ST', 'WT strategy|||WT'], correctIndex: 2, explanation: 'ST = strengths against threats. SO exploits opportunities with strengths; WO overcomes weaknesses by using opportunities; WT is defensive.|||ST = điểm mạnh đối phó nguy cơ. SO dùng điểm mạnh nắm cơ hội; WO khắc phục điểm yếu nhờ cơ hội; WT mang tính phòng thủ.' },
  { id: 'q3', question: 'What is the main purpose of scenario planning?|||Mục đích chính của lập kịch bản là gì?', options: ['To predict the single most likely future precisely|||Dự báo chính xác một tương lai có khả năng xảy ra nhất', 'To prepare strategies that hold up across several plausible futures|||Chuẩn bị các chiến lược đứng vững trong nhiều tương lai hợp lý', 'To replace the need for environmental scanning|||Thay thế cho việc quét môi trường', 'To calculate the firm’s market share|||Tính thị phần của doanh nghiệp'], correctIndex: 1, explanation: 'Scenarios are not forecasts: they widen thinking, test strategies for robustness and define signposts to watch.|||Kịch bản không phải là dự báo: chúng mở rộng tư duy, thử độ vững của chiến lược và xác định các dấu hiệu cần theo dõi.' },
]);

const taiLieu = doc('eco102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ECO102 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for studying the business environment: the official syllabus &amp; slides, textbooks, free official sources and data, video channels, tools, and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official ECO102 syllabus, learning outcomes and lecture slides. This course follows the standard structure of international business-environment textbooks; always check the syllabus for your own class.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/business-environment-the/P200000010126/9781292417851" target="_blank" rel="noopener">The Business Environment: A Global Perspective</a> — Ed Thompson, Ian Worthington &amp; Chris Britton, Pearson: the classic PESTLE-based textbook for this subject.</li>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/exploring-strategy-text-and-cases/P200000007156/9781292479538" target="_blank" rel="noopener">Exploring Strategy (Text and Cases)</a> — Richard Whittington, Patrick Regnér, Duncan Angwin, Gerry Johnson &amp; Kevan Scholes, Pearson: macro-environment, industry analysis, stakeholders and scenarios from a strategy viewpoint.</li>
</ul>
<h3>🌐 Free official sources</h3>
<ul>
<li><a href="https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx" target="_blank" rel="noopener">The Five Forces — Harvard Business School, Institute for Strategy and Competitiveness</a> — Porter's framework explained by his own institute.</li>
<li><a href="https://www.tutor2u.net/business/topics/pestle-analysis" target="_blank" rel="noopener">tutor2u — PESTLE analysis</a> — short study notes and examples.</li>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">World Bank Open Data</a> — free data on growth, inflation, trade and population by country.</li>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm" target="_blank" rel="noopener">What is the WTO?</a> — the rules of international trade, from the WTO itself.</li>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">UN Sustainable Development Goals</a> — the 17 goals behind many CSR and ESG strategies.</li>
<li><a href="https://www.nso.gov.vn/" target="_blank" rel="noopener">Vietnam's official statistics office (nso.gov.vn)</a> and <a href="https://vbpl.vn/" target="_blank" rel="noopener">the national legal database (vbpl.vn)</a> — Vietnamese statistics and the legal texts currently in force.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u — Jim Riley</a> — business revision videos: PESTLE, stakeholders, SWOT.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — strategy, competition and management ideas.</li>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — free economics courses: inflation, growth, trade.</li>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse</a> — the Crash Course Economics series for quick overviews.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — spot social and technological trends in search interest.</li>
<li><a href="https://ourworldindata.org/" target="_blank" rel="noopener">Our World in Data</a> — charts on demography, energy, climate and the economy.</li>
<li><a href="https://miro.com/templates/stakeholder-mapping/" target="_blank" rel="noopener">Miro stakeholder mapping</a> and <a href="https://miro.com/templates/swot-analysis/" target="_blank" rel="noopener">SWOT templates</a> — whiteboards for group work.</li>
<li><a href="https://www.theculturefactor.com/country-comparison-tool" target="_blank" rel="noopener">Country comparison tool (Hofstede model)</a> — compare national cultures.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — scorecards for PESTLE and five forces.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — open systems, stakeholders, PESTLE, five forces and SWOT, following the lessons here.</li>
<li><strong>Practice on a real firm</strong> — pick a company you know and write a one-page PESTLE and a five forces scorecard.</li>
<li><strong>Go deeper</strong> — read the economic and trade news each week and link each story to a PESTLE factor and an industry.</li>
<li><strong>Job-ready</strong> — produce a full environmental analysis with TOWS options and scenarios, as in a consulting or strategy report.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">ECO102 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học môi trường kinh doanh: giáo trình &amp; slide chính thức, sách, nguồn chính thức và dữ liệu miễn phí, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình, chuẩn đầu ra và slide bài giảng chính thức của ECO102. Môn học ở đây bám cấu trúc chuẩn của các giáo trình môi trường kinh doanh quốc tế; hãy luôn đối chiếu với đề cương của lớp mình.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/business-environment-the/P200000010126/9781292417851" target="_blank" rel="noopener">The Business Environment: A Global Perspective</a> — Ed Thompson, Ian Worthington &amp; Chris Britton, Pearson: giáo trình kinh điển xây quanh PESTLE cho môn này.</li>
<li><a href="https://www.pearson.com/en-gb/subject-catalog/p/exploring-strategy-text-and-cases/P200000007156/9781292479538" target="_blank" rel="noopener">Exploring Strategy (Text and Cases)</a> — Richard Whittington, Patrick Regnér, Duncan Angwin, Gerry Johnson &amp; Kevan Scholes, Pearson: môi trường vĩ mô, phân tích ngành, các bên liên quan và kịch bản dưới góc nhìn chiến lược.</li>
</ul>
<h3>🌐 Nguồn chính thức miễn phí</h3>
<ul>
<li><a href="https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx" target="_blank" rel="noopener">The Five Forces — Viện Chiến lược và Năng lực cạnh tranh, Trường Kinh doanh Harvard</a> — mô hình của Porter do chính viện của ông giải thích.</li>
<li><a href="https://www.tutor2u.net/business/topics/pestle-analysis" target="_blank" rel="noopener">tutor2u — phân tích PESTLE</a> — ghi chú ôn tập ngắn gọn kèm ví dụ.</li>
<li><a href="https://data.worldbank.org/" target="_blank" rel="noopener">Dữ liệu mở của Ngân hàng Thế giới</a> — số liệu miễn phí về tăng trưởng, lạm phát, thương mại và dân số theo quốc gia.</li>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm" target="_blank" rel="noopener">What is the WTO?</a> — luật chơi thương mại quốc tế, do chính WTO giới thiệu.</li>
<li><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener">17 Mục tiêu Phát triển Bền vững của Liên Hợp Quốc</a> — nền tảng của nhiều chiến lược CSR và ESG.</li>
<li><a href="https://www.nso.gov.vn/" target="_blank" rel="noopener">Cơ quan thống kê chính thức của Việt Nam (nso.gov.vn)</a> và <a href="https://vbpl.vn/" target="_blank" rel="noopener">cơ sở dữ liệu quốc gia về pháp luật (vbpl.vn)</a> — số liệu thống kê Việt Nam và văn bản pháp luật đang có hiệu lực.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@tutor2u" target="_blank" rel="noopener">tutor2u — Jim Riley</a> — video ôn tập kinh doanh: PESTLE, các bên liên quan, SWOT.</li>
<li><a href="https://www.youtube.com/@harvardbusinessreview" target="_blank" rel="noopener">Harvard Business Review</a> — ý tưởng về chiến lược, cạnh tranh và quản trị.</li>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — khoá kinh tế học miễn phí: lạm phát, tăng trưởng, thương mại.</li>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse</a> — loạt Crash Course Economics để nắm nhanh tổng quan.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — phát hiện xu hướng xã hội và công nghệ qua mức độ tìm kiếm.</li>
<li><a href="https://ourworldindata.org/" target="_blank" rel="noopener">Our World in Data</a> — biểu đồ về dân số, năng lượng, khí hậu và kinh tế.</li>
<li><a href="https://miro.com/templates/stakeholder-mapping/" target="_blank" rel="noopener">Mẫu bản đồ các bên liên quan</a> và <a href="https://miro.com/templates/swot-analysis/" target="_blank" rel="noopener">mẫu SWOT</a> trên Miro — bảng trắng cho làm việc nhóm.</li>
<li><a href="https://www.theculturefactor.com/country-comparison-tool" target="_blank" rel="noopener">Công cụ so sánh quốc gia (mô hình Hofstede)</a> — so sánh văn hoá các nước.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — lập bảng chấm điểm PESTLE và năm lực lượng.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — hệ thống mở, các bên liên quan, PESTLE, năm lực lượng và SWOT, theo đúng các bài ở đây.</li>
<li><strong>Luyện trên doanh nghiệp thật</strong> — chọn một công ty bạn biết, viết một trang PESTLE và một bảng chấm năm lực lượng.</li>
<li><strong>Đào sâu</strong> — đọc tin kinh tế, thương mại mỗi tuần và gắn mỗi tin với một yếu tố PESTLE và một ngành.</li>
<li><strong>Sẵn sàng đi làm</strong> — hoàn thành một bản phân tích môi trường đầy đủ kèm phương án TOWS và kịch bản, như một báo cáo tư vấn hay chiến lược.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ECO102',
    slug: 'eco102-business-environment',
    title: 'Business Environment',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ECO102.webp',
    shortDescription: 'How the world around a business shapes it: stakeholders, PESTLE, the macroeconomy, globalization, market structure and Porter’s five forces, technology, law, ethics, CSR and ESG, SWOT and scenarios. Bilingual, with exercises and quizzes.|||Thế giới quanh doanh nghiệp định hình nó ra sao: các bên liên quan, PESTLE, kinh tế vĩ mô, toàn cầu hoá, cấu trúc thị trường và năm lực lượng, công nghệ, pháp luật, đạo đức, CSR/ESG, SWOT và kịch bản. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>ECO102 — Business Environment (Môi trường kinh doanh)</strong> (khối Quản trị Kinh doanh, kỳ 1) giúp bạn nhìn doanh nghiệp như một <strong>hệ thống mở</strong> luôn chịu tác động của môi trường xung quanh. Từ <strong>loại hình tổ chức, mục tiêu và các bên liên quan</strong> (lưới Mendelow) → <strong>môi trường vĩ mô PESTLE</strong>, <strong>kinh tế vĩ mô và chính sách</strong> (tăng trưởng, lạm phát, thất nghiệp, lãi suất, tỷ giá), <strong>môi trường quốc tế</strong> (toàn cầu hoá, thương mại, hội nhập) → <strong>cấu trúc thị trường và năm lực lượng của Porter</strong>, <strong>công nghệ và chuyển đổi số</strong> → <strong>pháp luật, đạo đức, CSR và ESG</strong> → <strong>quét môi trường, SWOT/TOWS và lập kịch bản</strong>. Bám cấu trúc giáo trình môi trường kinh doanh chuẩn quốc tế, song ngữ Anh–Việt, có bài tập tình huống (giả định) kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích doanh nghiệp như một hệ thống mở và ba lớp môi trường kinh doanh\nSo sánh các loại hình tổ chức, mục tiêu doanh nghiệp và vấn đề người uỷ quyền – người đại diện\nLập bản đồ các bên liên quan bằng lưới quyền lực – quan tâm của Mendelow và đề xuất cách ứng xử\nPhân tích PESTLE có xếp ưu tiên theo tác động × khả năng xảy ra\nĐọc các chỉ số kinh tế vĩ mô và đánh giá tác động của chính sách tài khoá, tiền tệ, tỷ giá tới doanh nghiệp\nGiải thích lợi thế so sánh, rào cản thương mại, các cấp độ hội nhập và phương thức thâm nhập thị trường quốc tế\nPhân tích cấu trúc thị trường, CR4/HHI và năm lực lượng cạnh tranh; nhận diện tác động của công nghệ và đổi mới\nVận dụng đạo đức kinh doanh, CSR, ESG và nối PESTLE với SWOT/TOWS, lập kịch bản để ứng phó',
    requirements: 'Không cần kiến thức kinh tế hay quản trị trước\nToán phổ thông: phần trăm, trung bình, tỉ lệ\nThói quen đọc tin kinh tế – xã hội và quan sát doanh nghiệp quanh mình',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Môi trường kinh doanh là gì, hệ thống mở, ba lớp môi trường.', lessons: [intro] },
    { title: 'Part 1 — Organizations & stakeholders|||Phần 1 — Tổ chức & các bên liên quan', description: 'Khu vực, loại hình pháp lý, mục tiêu doanh nghiệp, các bên liên quan và lưới Mendelow.', lessons: [c1, c1e, c1q] },
    { title: 'Part 2 — The macro environment|||Phần 2 — Môi trường vĩ mô', description: 'PESTLE, kinh tế vĩ mô và chính sách, toàn cầu hoá và thương mại quốc tế.', lessons: [c2, c3, c4, c4e, c4q] },
    { title: 'Part 3 — Industry, competition & technology|||Phần 3 — Ngành, cạnh tranh & công nghệ', description: 'Cấu trúc thị trường, CR4/HHI, năm lực lượng của Porter, đổi mới và chuyển đổi số.', lessons: [c5, c6, c6e, c6q] },
    { title: 'Part 4 — Law, ethics & responding to the environment|||Phần 4 — Pháp luật, đạo đức & ứng phó với môi trường', description: 'Thể chế và pháp luật, đạo đức, CSR, ESG, quét môi trường, SWOT/TOWS, kịch bản.', lessons: [c7, c8, c8q] },
  ],
};
