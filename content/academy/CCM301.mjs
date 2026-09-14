/**
 * CCM301 — Crisis Communications Management. Giáo trình tham khảo (trích dẫn,
 * KHÔNG upload PDF): Coombs "Ongoing Crisis Communication" (SCCT), Fearn-Banks
 * "Crisis Communications: A Casebook Approach", Benoit "Image Restoration
 * Theory". Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ccm301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Coombs, Fearn-Banks, Benoit), tài liệu chính thức miễn phí, tình huống thực tế, lộ trình tự học.',
  [[
    `<span class="eyebrow">CCM301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Crisis Communications Management — crisis theory, planning, response strategy, digital-age crises and reputation recovery — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources that follow the same academic base.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CCM301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li>W. Timothy Coombs — <em>Ongoing Crisis Communication: Planning, Managing, and Responding</em> (source of the <strong>Situational Crisis Communication Theory</strong>, SCCT).</li>
<li>Kathleen Fearn-Banks — <em>Crisis Communications: A Casebook Approach</em> (crisis typologies &amp; real-world case analysis).</li>
<li>William L. Benoit — <em>Accounts, Excuses, and Apologies</em> (source of <strong>Image Restoration Theory</strong>).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Crisis_communication" target="_blank" rel="noopener">Wikipedia — Crisis communication</a></li>
<li><a href="https://en.wikipedia.org/wiki/Situational_crisis_communication_theory" target="_blank" rel="noopener">Wikipedia — Situational Crisis Communication Theory</a></li>
<li><a href="https://en.wikipedia.org/wiki/Image_restoration_theory" target="_blank" rel="noopener">Wikipedia — Image Restoration Theory (Benoit)</a></li>
<li><a href="https://instituteforpr.org/" target="_blank" rel="noopener">Institute for Public Relations — crisis communication research</a></li>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA (Public Relations Society of America)</a></li>
</ul>
<h3>🧩 Classic case studies to study</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Chicago_Tylenol_murders" target="_blank" rel="noopener">Tylenol tampering crisis (1982)</a> — the textbook example of a well-handled victim crisis.</li>
<li><a href="https://en.wikipedia.org/wiki/Volkswagen_emissions_scandal" target="_blank" rel="noopener">Volkswagen emissions scandal (2015)</a> — a textbook example of a preventable, badly-handled organizational-misdeed crisis.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — crisis definition, crisis types, the crisis life cycle, the crisis communication plan.</li>
<li><strong>Theory</strong> — SCCT (attribution → strategy) and Image Restoration Theory (denial/evasion/reduction/corrective action/mortification).</li>
<li><strong>Practice</strong> — draft holding statements and key messages for a sample scenario; run a mock press conference.</li>
<li><strong>Go deeper</strong> — social-media crisis dynamics, reputation recovery timelines, and case-study comparison (what worked vs. what failed and why).</li>
</ol></div>`,
    `<span class="eyebrow">CCM301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản lý truyền thông khủng hoảng — lý thuyết khủng hoảng, lập kế hoạch, chiến lược phản ứng, khủng hoảng thời đại số và phục hồi danh tiếng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, bám cùng nền học thuật.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CCM301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li>W. Timothy Coombs — <em>Ongoing Crisis Communication: Planning, Managing, and Responding</em> (nguồn của <strong>Lý thuyết Truyền thông Khủng hoảng theo Tình huống</strong>, SCCT).</li>
<li>Kathleen Fearn-Banks — <em>Crisis Communications: A Casebook Approach</em> (phân loại khủng hoảng &amp; phân tích tình huống thực tế).</li>
<li>William L. Benoit — <em>Accounts, Excuses, and Apologies</em> (nguồn của <strong>Lý thuyết Phục hồi Hình ảnh</strong>).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Crisis_communication" target="_blank" rel="noopener">Wikipedia — Crisis communication</a></li>
<li><a href="https://en.wikipedia.org/wiki/Situational_crisis_communication_theory" target="_blank" rel="noopener">Wikipedia — Situational Crisis Communication Theory</a></li>
<li><a href="https://en.wikipedia.org/wiki/Image_restoration_theory" target="_blank" rel="noopener">Wikipedia — Image Restoration Theory (Benoit)</a></li>
<li><a href="https://instituteforpr.org/" target="_blank" rel="noopener">Institute for Public Relations — nghiên cứu truyền thông khủng hoảng</a></li>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA (Public Relations Society of America)</a></li>
</ul>
<h3>🧩 Tình huống kinh điển nên học</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Chicago_Tylenol_murders" target="_blank" rel="noopener">Khủng hoảng Tylenol bị đầu độc (1982)</a> — ví dụ kinh điển về xử lý tốt khủng hoảng dạng "nạn nhân".</li>
<li><a href="https://en.wikipedia.org/wiki/Volkswagen_emissions_scandal" target="_blank" rel="noopener">Bê bối khí thải Volkswagen (2015)</a> — ví dụ kinh điển về khủng hoảng "sai phạm tổ chức" có thể tránh nhưng xử lý tệ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — định nghĩa khủng hoảng, các loại khủng hoảng, vòng đời khủng hoảng, kế hoạch truyền thông khủng hoảng.</li>
<li><strong>Lý thuyết</strong> — SCCT (quy trách nhiệm → chiến lược) và Lý thuyết Phục hồi Hình ảnh (chối bỏ/tránh trách nhiệm/giảm mức độ nghiêm trọng/hành động sửa sai/xin lỗi).</li>
<li><strong>Luyện tập</strong> — soạn holding statement &amp; thông điệp chính cho một tình huống mẫu; chạy thử một buổi họp báo giả định.</li>
<li><strong>Đào sâu</strong> — động lực khủng hoảng trên mạng xã hội, hành trình phục hồi danh tiếng, và so sánh tình huống (cái gì hiệu quả, cái gì thất bại và vì sao).</li>
</ol></div>`,
  ]]);

const intro = doc('ccm301-0-1-overview', 'Course overview: Crisis Communications Management|||Tổng quan: Quản lý truyền thông khủng hoảng',
  'Vì sao khủng hoảng khác vấn đề thường ngày; truyền thông khủng hoảng là gì; lộ trình môn: khủng hoảng & vòng đời → chuẩn bị → SCCT → thông điệp/kênh → mạng xã hội → phục hồi hình ảnh → đánh giá & tình huống thực tế.',
  [[
    `<span class="eyebrow">CCM301 · Lesson 0.1 · Overview</span>
<h2>Crisis Communications Management</h2>
<p class="lead">This course helps you understand <strong>how organizations communicate under threat</strong> — when an unexpected event puts an organization's reputation, finances, or the safety of its stakeholders at risk. You'll learn to plan ahead, choose the right response strategy, craft messages, and repair reputation afterward.</p>
<h3>What is a crisis?</h3>
<p>A <strong>crisis</strong> is a sudden, unpredictable event that threatens stakeholders and can seriously damage an organization's reputation and finances — it violates stakeholder expectations and demands an immediate response. It differs from an ordinary <em>issue</em> (a slower-moving disagreement that can usually be managed through negotiation) and from a <em>disaster</em> (typically a large-scale, non-attributable event, e.g. a natural disaster).</p>
<h3>What is crisis communication?</h3>
<p><strong>Crisis communication</strong> is the collection and processing of information required to address a crisis, and the sharing of that information with stakeholders (employees, customers, media, investors, regulators, community) in a way that protects reputation and reduces harm.</p>
<h3>Roadmap</h3>
<p>Crisis types &amp; the crisis life cycle → preparation (plan, team, spokesperson) → SCCT theory &amp; response strategies → crisis messaging, channels &amp; press conferences → social-media &amp; digital-age crises → image restoration &amp; reputation recovery → evaluation, lessons learned &amp; real case studies (Tylenol, Volkswagen). Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">CCM301 · Bài 0.1 · Tổng quan</span>
<h2>Quản lý truyền thông khủng hoảng</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>tổ chức truyền thông thế nào khi bị đe dọa</strong> — khi một sự việc bất ngờ đặt danh tiếng, tài chính, hoặc an toàn của các bên liên quan vào rủi ro. Bạn học cách chuẩn bị trước, chọn đúng chiến lược phản ứng, soạn thông điệp, và phục hồi danh tiếng sau đó.</p>
<h3>Khủng hoảng là gì?</h3>
<p>Một <strong>khủng hoảng</strong> là sự việc bất ngờ, không lường trước, đe dọa các bên liên quan và có thể gây tổn hại nghiêm trọng đến danh tiếng &amp; tài chính của tổ chức — nó phá vỡ kỳ vọng của các bên liên quan và đòi hỏi phản ứng ngay. Khủng hoảng khác với <em>vấn đề (issue)</em> thông thường (một mâu thuẫn diễn ra chậm hơn, thường xử lý được bằng đàm phán) và khác với <em>thảm họa (disaster)</em> (thường là sự việc quy mô lớn, không quy được trách nhiệm cho ai, ví dụ thiên tai).</p>
<h3>Truyền thông khủng hoảng là gì?</h3>
<p><strong>Truyền thông khủng hoảng</strong> là việc thu thập, xử lý thông tin cần thiết để đối phó khủng hoảng, và chia sẻ thông tin đó với các bên liên quan (nhân viên, khách hàng, báo chí, nhà đầu tư, cơ quan quản lý, cộng đồng) theo cách bảo vệ danh tiếng và giảm thiểu tổn hại.</p>
<h3>Lộ trình</h3>
<p>Loại khủng hoảng &amp; vòng đời khủng hoảng → chuẩn bị (kế hoạch, đội xử lý, phát ngôn viên) → lý thuyết SCCT &amp; chiến lược phản ứng → thông điệp, kênh &amp; họp báo khủng hoảng → khủng hoảng trên mạng xã hội &amp; thời đại số → phục hồi hình ảnh &amp; danh tiếng → đánh giá, bài học kinh nghiệm &amp; tình huống thực tế (Tylenol, Volkswagen). Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('ccm301-1-1-crisis-overview', '1.1 — Crisis & crisis communication overview|||1.1 — Tổng quan khủng hoảng & truyền thông khủng hoảng',
  'Định nghĩa khủng hoảng; khủng hoảng vs vấn đề/rủi ro/thảm họa; mục tiêu truyền thông khủng hoảng; các bên liên quan chính.',
  [[
    `<span class="eyebrow">CCM301 · Chapter 1 · Lesson 1.1</span>
<h2>Crisis &amp; crisis communication overview</h2>
<h3>Crisis vs. issue vs. risk vs. disaster</h3>
<ul>
<li><strong>Risk</strong> — a potential future problem that has not yet happened; managed through prevention and monitoring.</li>
<li><strong>Issue</strong> — a slower-developing disagreement between an organization and its stakeholders; usually manageable through negotiation before it escalates.</li>
<li><strong>Crisis</strong> — a sudden, specific, unexpected event that violates stakeholder expectations and threatens reputation, finances, or safety; demands immediate response.</li>
<li><strong>Disaster</strong> — typically a large-scale event with no clear organizational fault (e.g. earthquake, flood); the organization's response can still turn it into (or protect it from) a reputational crisis.</li>
</ul>
<h3>Why crisis communication matters</h3>
<p>Stakeholders judge an organization not only by what happened, but by <strong>how it responded</strong>. Poor crisis communication can turn a manageable incident into lasting reputational, financial and legal damage; good crisis communication can protect trust and even strengthen it.</p>
<h3>Key stakeholders</h3>
<ul>
<li><strong>Internal</strong> — employees, management, board.</li>
<li><strong>External</strong> — customers, media, investors/shareholders, regulators, suppliers, the surrounding community, and — in the digital age — online publics who never interact with the organization offline.</li>
</ul>
<div class="callout"><span class="badge">Core goal</span> Crisis communication protects <strong>people first, then reputation</strong> — safety and accurate information for stakeholders come before protecting the organization's image.</div>`,
    `<span class="eyebrow">CCM301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan khủng hoảng &amp; truyền thông khủng hoảng</h2>
<h3>Khủng hoảng vs. vấn đề vs. rủi ro vs. thảm họa</h3>
<ul>
<li><strong>Rủi ro (risk)</strong> — vấn đề tiềm ẩn trong tương lai, chưa xảy ra; xử lý bằng phòng ngừa &amp; theo dõi.</li>
<li><strong>Vấn đề (issue)</strong> — mâu thuẫn phát triển chậm hơn giữa tổ chức và các bên liên quan; thường xử lý được bằng đàm phán trước khi leo thang.</li>
<li><strong>Khủng hoảng (crisis)</strong> — sự việc bất ngờ, cụ thể, phá vỡ kỳ vọng của các bên liên quan và đe dọa danh tiếng, tài chính, hoặc an toàn; đòi hỏi phản ứng ngay.</li>
<li><strong>Thảm họa (disaster)</strong> — thường là sự việc quy mô lớn, không rõ lỗi của tổ chức (vd động đất, lũ lụt); cách tổ chức phản ứng vẫn có thể biến nó thành (hoặc tránh cho nó khỏi thành) một khủng hoảng danh tiếng.</li>
</ul>
<h3>Vì sao truyền thông khủng hoảng quan trọng</h3>
<p>Các bên liên quan đánh giá tổ chức không chỉ qua việc gì đã xảy ra, mà qua <strong>cách tổ chức phản ứng</strong>. Truyền thông khủng hoảng kém có thể biến một sự việc có thể kiểm soát thành tổn hại danh tiếng, tài chính và pháp lý lâu dài; truyền thông khủng hoảng tốt bảo vệ được niềm tin, thậm chí củng cố nó.</p>
<h3>Các bên liên quan chính</h3>
<ul>
<li><strong>Nội bộ</strong> — nhân viên, quản lý, hội đồng quản trị.</li>
<li><strong>Bên ngoài</strong> — khách hàng, báo chí, nhà đầu tư/cổ đông, cơ quan quản lý, nhà cung cấp, cộng đồng xung quanh, và — trong thời đại số — công chúng trên mạng chưa từng tương tác trực tiếp với tổ chức.</li>
</ul>
<div class="callout"><span class="badge">Mục tiêu cốt lõi</span> Truyền thông khủng hoảng bảo vệ <strong>con người trước, danh tiếng sau</strong> — an toàn và thông tin chính xác cho các bên liên quan đứng trước việc bảo vệ hình ảnh của tổ chức.</div>`,
  ]]);

const c1q = quiz('ccm301-quiz-1', 'Quiz 1 — Crisis overview|||Quiz 1 — Tổng quan khủng hoảng', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa "khủng hoảng" và "vấn đề (issue)" là gì?', options: ['Khủng hoảng luôn do thiên tai gây ra', 'Khủng hoảng bất ngờ và đòi hỏi phản ứng ngay, vấn đề phát triển chậm và có thể đàm phán', 'Vấn đề luôn nghiêm trọng hơn khủng hoảng', 'Không có khác biệt, hai từ dùng thay nhau'], correctIndex: 1, explanation: 'Khủng hoảng là sự việc bất ngờ, cụ thể, cần phản ứng ngay; vấn đề diễn ra chậm hơn và thường xử lý bằng đàm phán.' },
  { id: 'q2', question: 'Theo môn học, mục tiêu ưu tiên hàng đầu của truyền thông khủng hoảng là gì?', options: ['Bảo vệ giá cổ phiếu', 'Bảo vệ con người/an toàn của các bên liên quan trước, danh tiếng sau', 'Giữ im lặng cho tới khi có đủ thông tin', 'Đổ lỗi cho đối tác'], correctIndex: 1, explanation: 'Nguyên tắc cốt lõi: an toàn và thông tin chính xác cho các bên liên quan đứng trước việc bảo vệ hình ảnh tổ chức.' },
  { id: 'q3', question: 'Một trận lũ lụt tự nhiên gây thiệt hại cho nhà máy được gọi là gì trong phân loại của môn học?', options: ['Rủi ro (risk)', 'Vấn đề (issue)', 'Thảm họa (disaster)', 'Chiến lược phục hồi hình ảnh'], correctIndex: 2, explanation: 'Thảm họa thường là sự việc quy mô lớn, không rõ lỗi của tổ chức, như thiên tai.' },
]);

const c2 = doc('ccm301-2-1-crisis-types-lifecycle', '2.1 — Crisis types & the crisis life cycle|||2.1 — Các loại khủng hoảng & vòng đời khủng hoảng',
  'Ba nhóm khủng hoảng theo trách nhiệm (nạn nhân/tai nạn/có thể tránh); mô hình 4 giai đoạn của Fink (Prodromal/Acute/Chronic/Resolution).',
  [[
    `<span class="eyebrow">CCM301 · Chapter 2 · Lesson 2.1</span>
<h2>Crisis types &amp; the crisis life cycle</h2>
<h3>Crisis types by responsibility (Coombs)</h3>
<p>Coombs groups crises into three clusters by how much responsibility stakeholders attribute to the organization:</p>
<ul>
<li><strong>Victim cluster</strong> (low attributed responsibility) — natural disaster, rumor, workplace violence, product tampering by an outsider. The organization is seen as a victim too.</li>
<li><strong>Accidental cluster</strong> (moderate responsibility) — technical-error accidents or product harm (equipment failure), technical-error challenges.</li>
<li><strong>Preventable cluster</strong> (high responsibility) — human-error accidents/product harm, organizational misdeed (management knowingly took a risk, deceived stakeholders, or violated the law).</li>
</ul>
<h3>Fearn-Banks' crisis typology</h3>
<p>Fearn-Banks classifies crises by cause — natural disaster, mechanical/technological problem, human error, management decision/indecision, or malevolence (deliberate harm from outside, e.g. sabotage, terrorism) — a lens complementary to Coombs' responsibility clusters.</p>
<h3>The crisis life cycle (Fink's four-stage model)</h3>
<pre><code>Prodromal (warning) -> Acute (trigger event) -> Chronic (clean-up, investigation, media follow-up) -> Resolution (back to normal, lessons applied)
</code></pre>
<ul>
<li><strong>Prodromal</strong> — early warning signs are visible if you're watching (complaints, near-misses, rumors).</li>
<li><strong>Acute</strong> — the triggering event happens; the highest-intensity, most time-pressured phase.</li>
<li><strong>Chronic</strong> — clean-up, investigations, audits, continued media/stakeholder scrutiny.</li>
<li><strong>Resolution</strong> — the organization returns to normal operations, ideally having learned and adapted.</li>
</ul>
<div class="callout"><span class="badge">Why the type matters</span> The crisis type and the responsibility level it implies directly shape which response strategy (Chapter 4) will actually work — this is the foundation SCCT is built on.</div>`,
    `<span class="eyebrow">CCM301 · Chương 2 · Bài 2.1</span>
<h2>Các loại khủng hoảng &amp; vòng đời khủng hoảng</h2>
<h3>Loại khủng hoảng theo trách nhiệm (Coombs)</h3>
<p>Coombs chia khủng hoảng thành ba nhóm theo mức trách nhiệm mà các bên liên quan quy cho tổ chức:</p>
<ul>
<li><strong>Nhóm nạn nhân (victim)</strong> (trách nhiệm thấp) — thiên tai, tin đồn, bạo lực nơi làm việc, sản phẩm bị người ngoài phá hoại. Tổ chức cũng được xem là nạn nhân.</li>
<li><strong>Nhóm tai nạn (accidental)</strong> (trách nhiệm trung bình) — tai nạn do lỗi kỹ thuật hoặc sản phẩm gây hại (thiết bị hỏng), thử thách do lỗi kỹ thuật.</li>
<li><strong>Nhóm có thể tránh (preventable)</strong> (trách nhiệm cao) — tai nạn/sản phẩm gây hại do lỗi con người, sai phạm tổ chức (quản lý biết rủi ro nhưng vẫn làm, lừa dối các bên liên quan, hoặc vi phạm pháp luật).</li>
</ul>
<h3>Phân loại khủng hoảng của Fearn-Banks</h3>
<p>Fearn-Banks phân loại khủng hoảng theo nguyên nhân — thiên tai, sự cố cơ khí/công nghệ, lỗi con người, quyết định/thiếu quyết định của quản lý, hoặc ác ý (gây hại có chủ đích từ bên ngoài, vd phá hoại, khủng bố) — một góc nhìn bổ sung cho các nhóm trách nhiệm của Coombs.</p>
<h3>Vòng đời khủng hoảng (mô hình 4 giai đoạn của Fink)</h3>
<pre><code>Prodromal (báo trước) -> Acute (sự việc bùng phát) -> Chronic (dọn dẹp, điều tra, báo chí theo sát) -> Resolution (trở lại bình thường, đã học được bài học)
</code></pre>
<ul>
<li><strong>Prodromal</strong> — dấu hiệu cảnh báo sớm hiện ra nếu bạn theo sát (phàn nàn, suýt xảy ra, tin đồn).</li>
<li><strong>Acute</strong> — sự việc bùng phát; giai đoạn căng nhất, áp lực thời gian cao nhất.</li>
<li><strong>Chronic</strong> — dọn dẹp, điều tra, kiểm toán, báo chí &amp; các bên liên quan tiếp tục theo sát.</li>
<li><strong>Resolution</strong> — tổ chức trở lại hoạt động bình thường, lý tưởng là đã học được và thích ứng.</li>
</ul>
<div class="callout"><span class="badge">Vì sao loại khủng hoảng quan trọng</span> Loại khủng hoảng và mức trách nhiệm nó hàm ý quyết định trực tiếp chiến lược phản ứng nào (Chương 4) sẽ thực sự hiệu quả — đây là nền tảng SCCT được xây dựng trên đó.</div>`,
  ]]);

const c2q = quiz('ccm301-quiz-2', 'Quiz 2 — Types & life cycle|||Quiz 2 — Loại khủng hoảng & vòng đời', [
  { id: 'q1', question: 'Theo Coombs, một sản phẩm bị người ngoài phá hoại (không phải lỗi tổ chức) thuộc nhóm nào?', options: ['Nhóm có thể tránh (preventable)', 'Nhóm tai nạn (accidental)', 'Nhóm nạn nhân (victim)', 'Không thuộc nhóm nào'], correctIndex: 2, explanation: 'Bị phá hoại từ bên ngoài thuộc nhóm nạn nhân — trách nhiệm quy cho tổ chức thấp.' },
  { id: 'q2', question: 'Giai đoạn nào trong mô hình 4 giai đoạn của Fink có dấu hiệu cảnh báo sớm nhưng chưa bùng phát?', options: ['Acute', 'Chronic', 'Resolution', 'Prodromal'], correctIndex: 3, explanation: 'Prodromal là giai đoạn có dấu hiệu cảnh báo sớm (phàn nàn, suýt xảy ra, tin đồn).' },
  { id: 'q3', question: 'Sai phạm tổ chức (quản lý biết rủi ro nhưng vẫn cố ý làm) thuộc nhóm trách nhiệm nào?', options: ['Thấp', 'Trung bình', 'Cao', 'Không quy trách nhiệm được'], correctIndex: 2, explanation: 'Sai phạm tổ chức thuộc nhóm "có thể tránh" (preventable) — trách nhiệm quy cho tổ chức cao nhất.' },
]);

const c3 = doc('ccm301-3-1-preparation-plan-team-spokesperson', '3.1 — Preparation: plan, crisis team & spokesperson|||3.1 — Chuẩn bị: kế hoạch, đội xử lý & phát ngôn viên',
  'Kế hoạch truyền thông khủng hoảng (CCP): rà rủi ro, thông điệp nền, danh bạ liên hệ, holding statement; đội quản lý khủng hoảng (CMT); chọn & huấn luyện phát ngôn viên; diễn tập.',
  [[
    `<span class="eyebrow">CCM301 · Chapter 3 · Lesson 3.1</span>
<h2>Preparation: plan, crisis team &amp; spokesperson</h2>
<h3>The Crisis Communication Plan (CCP)</h3>
<p>A CCP is written <em>before</em> a crisis happens, so the organization does not have to think from scratch under pressure. Core components:</p>
<ul>
<li><strong>Risk assessment</strong> — the most likely crisis scenarios for this specific organization.</li>
<li><strong>Contact lists</strong> — crisis team, media, regulators, key stakeholders, with backups.</li>
<li><strong>Pre-drafted holding statements</strong> — short, generic statements ("we are aware of the situation and are gathering facts") that buy time for accuracy without leaving a media vacuum.</li>
<li><strong>Protocols</strong> — who approves messages, who talks to media, escalation chain, a "dark site" (a pre-built webpage that can go live instantly with crisis information).</li>
</ul>
<h3>The Crisis Management Team (CMT)</h3>
<p>A small, cross-functional team activated the moment a crisis is identified — typically: a team leader, communications lead, legal counsel, HR, operations/technical expert, and the spokesperson. Clear roles prevent the two most common failures: silence and mixed messages.</p>
<h3>Choosing &amp; training the spokesperson</h3>
<p>The spokesperson should be credible, calm under pressure, and senior enough to be taken seriously — not necessarily the CEO for every crisis. <strong>Media training</strong> covers staying on message, bridging back from hostile questions, and body language.</p>
<pre><code>Holding statement template:
"We are aware of [situation]. Our priority right now is [safety/affected people].
We are actively gathering facts and will share verified updates as soon as we have them at [channel]."
</code></pre>
<h3>Drills &amp; simulation</h3>
<p>Plans that are never rehearsed fail under real pressure. Regular tabletop exercises and simulated press conferences test the plan, the team, and the spokesperson before a real crisis does.</p>
<div class="callout"><span class="badge">Golden rule</span> A plan you wrote once and never updated is almost as risky as no plan — review and drill it regularly.</div>`,
    `<span class="eyebrow">CCM301 · Chương 3 · Bài 3.1</span>
<h2>Chuẩn bị: kế hoạch, đội xử lý &amp; phát ngôn viên</h2>
<h3>Kế hoạch truyền thông khủng hoảng (CCP)</h3>
<p>CCP được viết <em>trước khi</em> khủng hoảng xảy ra, để tổ chức không phải nghĩ từ đầu trong lúc chịu áp lực. Các phần cốt lõi:</p>
<ul>
<li><strong>Rà soát rủi ro</strong> — các tình huống khủng hoảng có khả năng xảy ra nhất với chính tổ chức này.</li>
<li><strong>Danh bạ liên hệ</strong> — đội xử lý khủng hoảng, báo chí, cơ quan quản lý, các bên liên quan chính, có phương án dự phòng.</li>
<li><strong>Holding statement soạn sẵn</strong> — phát biểu ngắn, mang tính chung ("chúng tôi đã biết về tình huống và đang thu thập thông tin") giúp có thêm thời gian để chính xác mà không để trống thông tin cho báo chí.</li>
<li><strong>Quy trình</strong> — ai phê duyệt thông điệp, ai trả lời báo chí, chuỗi báo cáo leo thang, một "dark site" (trang web dựng sẵn có thể lên ngay với thông tin khủng hoảng).</li>
</ul>
<h3>Đội quản lý khủng hoảng (CMT)</h3>
<p>Một đội nhỏ, đa chức năng, được kích hoạt ngay khi phát hiện khủng hoảng — thường gồm: trưởng đội, phụ trách truyền thông, cố vấn pháp lý, nhân sự, chuyên gia vận hành/kỹ thuật, và phát ngôn viên. Vai trò rõ ràng ngăn được hai lỗi phổ biến nhất: im lặng và thông điệp lẫn lộn.</p>
<h3>Chọn &amp; huấn luyện phát ngôn viên</h3>
<p>Phát ngôn viên cần đáng tin, bình tĩnh dưới áp lực, và đủ cấp bậc để được xem trọng — không nhất thiết phải là CEO cho mọi khủng hoảng. <strong>Huấn luyện truyền thông</strong> gồm: giữ đúng thông điệp, "bắc cầu" quay lại thông điệp khi bị hỏi khó, và ngôn ngữ cơ thể.</p>
<pre><code>Mẫu holding statement:
"Chúng tôi đã biết về [tình huống]. Ưu tiên hiện tại là [an toàn/người bị ảnh hưởng].
Chúng tôi đang tích cực thu thập thông tin và sẽ cập nhật đã kiểm chứng sớm nhất qua [kênh]."
</code></pre>
<h3>Diễn tập &amp; mô phỏng</h3>
<p>Kế hoạch chưa từng diễn tập gần như luôn thất bại khi áp lực thật xảy ra. Diễn tập trên bàn (tabletop) và họp báo giả định thường xuyên kiểm tra kế hoạch, đội xử lý, và phát ngôn viên trước khi khủng hoảng thật xảy ra.</p>
<div class="callout"><span class="badge">Quy tắc vàng</span> Một kế hoạch viết một lần rồi không bao giờ cập nhật gần như rủi ro như không có kế hoạch — cần rà soát &amp; diễn tập thường xuyên.</div>`,
  ]]);

const c3q = quiz('ccm301-quiz-3', 'Quiz 3 — Preparation|||Quiz 3 — Chuẩn bị', [
  { id: 'q1', question: 'Holding statement được dùng để làm gì?', options: ['Công bố kết luận điều tra cuối cùng', 'Mua thêm thời gian để chính xác, không để trống thông tin cho báo chí', 'Đổ lỗi cho một cá nhân cụ thể', 'Thay thế hoàn toàn cho họp báo'], correctIndex: 1, explanation: 'Holding statement là phát biểu ngắn, chung, giúp có thêm thời gian thu thập thông tin mà vẫn có phản hồi ngay.' },
  { id: 'q2', question: 'Đội quản lý khủng hoảng (CMT) điển hình KHÔNG cần bao gồm vai trò nào sau đây?', options: ['Trưởng đội', 'Cố vấn pháp lý', 'Phát ngôn viên', 'Toàn bộ khách hàng của công ty'], correctIndex: 3, explanation: 'CMT là một đội nhỏ nội bộ, đa chức năng — khách hàng không phải thành viên của đội này.' },
  { id: 'q3', question: 'Vì sao cần diễn tập (drill) kế hoạch truyền thông khủng hoảng thường xuyên?', options: ['Vì luật yêu cầu diễn tập hàng ngày', 'Vì kế hoạch chưa từng diễn tập thường thất bại dưới áp lực thật', 'Vì diễn tập thay thế được việc viết kế hoạch', 'Vì diễn tập giúp tăng giá cổ phiếu'], correctIndex: 1, explanation: 'Diễn tập kiểm tra kế hoạch, đội xử lý và phát ngôn viên trước khi khủng hoảng thật xảy ra.' },
]);

const c4 = doc('ccm301-4-1-scct-response-strategies', '4.1 — SCCT theory & response strategies|||4.1 — Lý thuyết SCCT & chiến lược phản ứng',
  'Lý thuyết SCCT của Coombs: quy trách nhiệm khủng hoảng (thấp/trung bình/cao) quyết định chiến lược; bốn nhóm chiến lược: chối bỏ, giảm nhẹ, xây dựng lại, và bồi đắp; yếu tố tăng nặng (lịch sử khủng hoảng, danh tiếng trước đó).',
  [[
    `<span class="eyebrow">CCM301 · Chapter 4 · Lesson 4.1</span>
<h2>SCCT theory &amp; response strategies</h2>
<h3>Situational Crisis Communication Theory (Coombs)</h3>
<p><strong>SCCT</strong> holds that the correct response strategy depends on how much responsibility stakeholders attribute to the organization for the crisis — matching the strategy to the situation, rather than picking one strategy for every crisis.</p>
<h3>Intensifying factors</h3>
<p>Two factors push attributed responsibility <em>higher</em> even for the same base crisis type:</p>
<ul>
<li><strong>Crisis history</strong> — has this organization had similar crises before?</li>
<li><strong>Prior reputation</strong> — did stakeholders already view the organization negatively?</li>
</ul>
<h3>Four strategy groups</h3>
<pre><code>Deny        -> attack the accuser, deny a crisis exists, scapegoat
Diminish    -> excuse (no control/intent), justify (minimal damage)
Rebuild     -> compensation, apology (mortification)
Bolster     -> reminder (past good works), ingratiation (thank stakeholders), victimage (organization is a victim too)
</code></pre>
<ul>
<li><strong>Deny</strong> — appropriate only when responsibility is genuinely low/false; using it when responsibility is real backfires badly (see Volkswagen, Chapter 8).</li>
<li><strong>Diminish</strong> — for accidental-cluster crises, moderate responsibility.</li>
<li><strong>Rebuild</strong> — for preventable-cluster crises, high responsibility; the costliest but most trust-restoring strategy.</li>
<li><strong>Bolster</strong> — always usable as a <em>supplement</em> to another strategy, never as the sole response to a high-responsibility crisis.</li>
</ul>
<div class="callout"><span class="badge">The core rule</span> Higher attributed responsibility → the strategy must shift from deny/diminish toward rebuild. Using a "deny" strategy on a high-responsibility crisis is the single most common crisis-communication failure.</div>`,
    `<span class="eyebrow">CCM301 · Chương 4 · Bài 4.1</span>
<h2>Lý thuyết SCCT &amp; chiến lược phản ứng</h2>
<h3>Lý thuyết Truyền thông Khủng hoảng theo Tình huống (Coombs)</h3>
<p><strong>SCCT</strong> cho rằng chiến lược phản ứng đúng phụ thuộc vào mức trách nhiệm mà các bên liên quan quy cho tổ chức về khủng hoảng — khớp chiến lược với tình huống, thay vì chọn một chiến lược cố định cho mọi khủng hoảng.</p>
<h3>Yếu tố tăng nặng</h3>
<p>Hai yếu tố đẩy mức trách nhiệm bị quy <em>cao hơn</em> ngay cả với cùng một loại khủng hoảng nền:</p>
<ul>
<li><strong>Lịch sử khủng hoảng</strong> — tổ chức này đã từng gặp khủng hoảng tương tự chưa?</li>
<li><strong>Danh tiếng trước đó</strong> — các bên liên quan đã có sẵn cái nhìn tiêu cực về tổ chức chưa?</li>
</ul>
<h3>Bốn nhóm chiến lược</h3>
<pre><code>Chối bỏ (Deny)    -> công kích người buộc tội, chối khủng hoảng tồn tại, đổ lỗi bên khác
Giảm nhẹ (Diminish) -> biện hộ (không kiểm soát/không cố ý), thanh minh (thiệt hại nhỏ)
Xây dựng lại (Rebuild) -> bồi thường, xin lỗi (mortification)
Bồi đắp (Bolster)  -> nhắc việc tốt đã làm, cảm ơn các bên liên quan, nhận là nạn nhân cùng
</code></pre>
<ul>
<li><strong>Chối bỏ</strong> — chỉ phù hợp khi trách nhiệm thực sự thấp/sai lệch; dùng khi trách nhiệm là thật sẽ phản tác dụng nặng (xem Volkswagen, Chương 8).</li>
<li><strong>Giảm nhẹ</strong> — cho khủng hoảng nhóm tai nạn, trách nhiệm trung bình.</li>
<li><strong>Xây dựng lại</strong> — cho khủng hoảng nhóm có thể tránh, trách nhiệm cao; chiến lược đắt nhất nhưng phục hồi niềm tin tốt nhất.</li>
<li><strong>Bồi đắp</strong> — luôn dùng được như chiến lược <em>bổ trợ</em> cho chiến lược khác, không bao giờ dùng làm phản ứng duy nhất cho khủng hoảng trách nhiệm cao.</li>
</ul>
<div class="callout"><span class="badge">Quy tắc cốt lõi</span> Trách nhiệm bị quy càng cao → chiến lược phải chuyển từ chối bỏ/giảm nhẹ sang xây dựng lại. Dùng chiến lược "chối bỏ" cho khủng hoảng trách nhiệm cao là lỗi truyền thông khủng hoảng phổ biến nhất.</div>`,
  ]]);

const c4q = quiz('ccm301-quiz-4', 'Quiz 4 — SCCT|||Quiz 4 — SCCT', [
  { id: 'q1', question: 'Theo SCCT, điều gì quyết định chiến lược phản ứng nên chọn?', options: ['Ngân sách truyền thông của tổ chức', 'Mức trách nhiệm mà các bên liên quan quy cho tổ chức về khủng hoảng', 'Quy mô tổ chức', 'Ngày trong tuần khủng hoảng xảy ra'], correctIndex: 1, explanation: 'SCCT khớp chiến lược phản ứng với mức trách nhiệm bị quy cho tổ chức.' },
  { id: 'q2', question: 'Chiến lược "Bồi đắp" (Bolster) nên được dùng như thế nào?', options: ['Là chiến lược duy nhất cho mọi khủng hoảng trách nhiệm cao', 'Là chiến lược bổ trợ đi kèm một chiến lược khác', 'Chỉ dùng khi tổ chức hoàn toàn vô can', 'Không nên dùng trong truyền thông khủng hoảng'], correctIndex: 1, explanation: 'Bồi đắp luôn dùng được như bổ trợ, nhưng không đủ làm phản ứng duy nhất cho khủng hoảng trách nhiệm cao.' },
  { id: 'q3', question: 'Yếu tố nào sau đây làm TĂNG mức trách nhiệm bị quy cho tổ chức, dù cùng loại khủng hoảng?', options: ['Tổ chức có lịch sử từng gặp khủng hoảng tương tự', 'Tổ chức mới thành lập', 'Khủng hoảng xảy ra vào cuối tuần', 'Tổ chức có trụ sở ở nước ngoài'], correctIndex: 0, explanation: 'Lịch sử khủng hoảng và danh tiếng tiêu cực trước đó là hai yếu tố tăng nặng trách nhiệm bị quy.' },
]);

const c5 = doc('ccm301-5-1-messaging-channels-press-conference', '5.1 — Crisis messaging, channels & press conferences|||5.1 — Thông điệp, kênh & họp báo khủng hoảng',
  'Nguyên tắc soạn thông điệp khủng hoảng (ngắn, nhất quán, thể hiện quan tâm/cam kết/kiểm soát); các kênh (thông cáo, họp báo, dark site, truyền thông trực tiếp, nội bộ); nguyên tắc "giờ vàng"; kỹ năng họp báo.',
  [[
    `<span class="eyebrow">CCM301 · Chapter 5 · Lesson 5.1</span>
<h2>Crisis messaging, channels &amp; press conferences</h2>
<h3>Crafting the message: concern, commitment, control</h3>
<p>Effective crisis messages consistently signal three things: <strong>concern</strong> (we care about those affected), <strong>commitment</strong> (we will act/fix/investigate), and <strong>control</strong> (we know what we're doing and are on it). Messages should be short, factual, consistent across channels, and repeated — not creative or novel.</p>
<h3>The golden hour</h3>
<p>The first response window is critical: silence or delay is read as guilt or incompetence, even when the organization is not at fault. A fast, honest holding statement almost always beats a slower, more "complete" one — <strong>speed and accuracy are in tension, and speed usually wins the first round.</strong></p>
<h3>Channels</h3>
<ul>
<li><strong>Press release / statement</strong> — the official written record, quotable by media.</li>
<li><strong>Press conference</strong> — for high-visibility crises; allows direct Q&amp;A but is higher-risk (live, unscripted follow-ups).</li>
<li><strong>Dark site</strong> — a pre-built webpage that goes live with verified crisis updates, reducing dependence on media relay.</li>
<li><strong>Direct stakeholder channels</strong> — email/SMS to customers, direct notices to employees — often faster and more targeted than media.</li>
<li><strong>Internal communication</strong> — employees should never learn about their own organization's crisis from the news first.</li>
</ul>
<h3>Running a press conference</h3>
<pre><code>1. Opening statement (concern + commitment + control, &lt;2 min)
2. Known facts only -- never speculate
3. Q&A: bridge back to key messages ("What I can tell you is...")
4. Close with next update time/channel
</code></pre>
<div class="callout"><span class="badge">Never say</span> "No comment" reads as guilt. A holding statement always beats silence.</div>`,
    `<span class="eyebrow">CCM301 · Chương 5 · Bài 5.1</span>
<h2>Thông điệp, kênh &amp; họp báo khủng hoảng</h2>
<h3>Soạn thông điệp: quan tâm, cam kết, kiểm soát</h3>
<p>Thông điệp khủng hoảng hiệu quả luôn thể hiện nhất quán ba điều: <strong>quan tâm</strong> (chúng tôi quan tâm những người bị ảnh hưởng), <strong>cam kết</strong> (chúng tôi sẽ hành động/khắc phục/điều tra), và <strong>kiểm soát</strong> (chúng tôi biết mình đang làm gì và đang xử lý). Thông điệp nên ngắn, dựa trên dữ kiện, nhất quán qua mọi kênh, và được lặp lại — không nên sáng tạo hay khác biệt mỗi lần.</p>
<h3>Giờ vàng</h3>
<p>Khoảng thời gian phản ứng đầu tiên rất quan trọng: im lặng hoặc chậm trễ bị hiểu là có lỗi hoặc bất lực, dù tổ chức thực ra không có lỗi. Một holding statement nhanh, trung thực gần như luôn tốt hơn một phát biểu chậm hơn nhưng "đầy đủ" hơn — <strong>tốc độ và độ chính xác luôn xung đột, và tốc độ thường thắng ở vòng đầu.</strong></p>
<h3>Các kênh</h3>
<ul>
<li><strong>Thông cáo báo chí / phát biểu</strong> — bản ghi chính thức bằng văn bản, báo chí có thể trích dẫn.</li>
<li><strong>Họp báo</strong> — cho khủng hoảng có độ chú ý cao; cho phép hỏi-đáp trực tiếp nhưng rủi ro cao hơn (trực tiếp, câu hỏi không kịch bản).</li>
<li><strong>Dark site</strong> — trang web dựng sẵn, lên ngay với thông tin đã kiểm chứng, giảm phụ thuộc vào việc báo chí truyền tải lại.</li>
<li><strong>Kênh trực tiếp với các bên liên quan</strong> — email/SMS cho khách hàng, thông báo trực tiếp cho nhân viên — thường nhanh và đúng đối tượng hơn báo chí.</li>
<li><strong>Truyền thông nội bộ</strong> — nhân viên không nên là người biết về khủng hoảng của chính tổ chức mình qua tin tức trước.</li>
</ul>
<h3>Điều hành một buổi họp báo</h3>
<pre><code>1. Phát biểu mở đầu (quan tâm + cam kết + kiểm soát, &lt;2 phút)
2. Chỉ nói dữ kiện đã biết -- không suy đoán
3. Hỏi-đáp: bắc cầu về lại thông điệp chính ("Điều tôi có thể chia sẻ là...")
4. Kết thúc bằng thời điểm/kênh cập nhật tiếp theo
</code></pre>
<div class="callout"><span class="badge">Đừng bao giờ nói</span> "Không có bình luận" bị hiểu là có lỗi. Một holding statement luôn tốt hơn im lặng.</div>`,
  ]]);

const c5q = quiz('ccm301-quiz-5', 'Quiz 5 — Messaging & channels|||Quiz 5 — Thông điệp & kênh', [
  { id: 'q1', question: 'Ba yếu tố thông điệp khủng hoảng hiệu quả cần thể hiện nhất quán là gì?', options: ['Sáng tạo, hài hước, ngắn gọn', 'Quan tâm, cam kết, kiểm soát', 'Số liệu, biểu đồ, trích dẫn chuyên gia', 'Xin lỗi, đổ lỗi, im lặng'], correctIndex: 1, explanation: 'Thông điệp khủng hoảng cần thể hiện quan tâm, cam kết hành động, và đang kiểm soát tình hình.' },
  { id: 'q2', question: 'Vì sao trả lời "không có bình luận" thường là lựa chọn tệ trong khủng hoảng?', options: ['Vì luật cấm câu nói này', 'Vì nó bị hiểu là có lỗi hoặc đang che giấu', 'Vì báo chí không được phép trích dẫn câu này', 'Vì nó quá dài dòng'], correctIndex: 1, explanation: 'Im lặng hoặc "không có bình luận" thường bị công chúng và báo chí hiểu là dấu hiệu có lỗi.' },
  { id: 'q3', question: '"Dark site" trong truyền thông khủng hoảng là gì?', options: ['Trang web bị hacker chiếm quyền', 'Trang web dựng sẵn, có thể lên ngay với thông tin khủng hoảng đã kiểm chứng', 'Một chiến lược im lặng hoàn toàn', 'Kênh mạng xã hội ẩn danh của tổ chức'], correctIndex: 1, explanation: 'Dark site là trang web chuẩn bị trước, kích hoạt ngay khi khủng hoảng xảy ra để chủ động cung cấp thông tin.' },
]);

const c6 = doc('ccm301-6-1-social-media-digital-crisis', '6.1 — Crisis in the social media & digital age|||6.1 — Khủng hoảng trên mạng xã hội & thời đại số',
  'Mô hình truyền thông khủng hoảng qua mạng xã hội (SMCC); tốc độ lan truyền, rủi ro tin giả; theo dõi lắng nghe xã hội (social listening); phòng chỉ huy (war room); quản lý bình luận, troll, người ảnh hưởng.',
  [[
    `<span class="eyebrow">CCM301 · Chapter 6 · Lesson 6.1</span>
<h2>Crisis in the social media &amp; digital age</h2>
<h3>Why social media changes crisis communication</h3>
<p>Crises can now start, spread, and mutate on social media before an organization's official statement even goes out — screenshots, videos and rumors travel faster than any press release. The <strong>Social-Mediated Crisis Communication (SMCC) model</strong> adds three digital-native elements to the classic view: form (which platform), source (who posted it first — the organization, media, or an ordinary user), and message strategy.</p>
<h3>New risks</h3>
<ul>
<li><strong>Speed</strong> — a local incident can become a global trending topic within hours.</li>
<li><strong>Misinformation</strong> — false or exaggerated versions of events spread as fast as, or faster than, facts.</li>
<li><strong>Loss of control over the narrative</strong> — anyone with a phone can become an eyewitness "source," not just the organization or the press.</li>
<li><strong>Amplification by influencers</strong> — a single influential account can multiply reach dramatically, for better or worse.</li>
</ul>
<h3>Managing a digital crisis</h3>
<pre><code>1. Social listening -- monitor mentions/keywords in real time (before, not just during, a crisis)
2. War room -- a dedicated cross-functional group tracking the crisis live across channels
3. Respond on the same platform where the crisis is happening, not only via press release
4. Correct misinformation with facts, calmly -- don't argue with trolls
5. Coordinate one voice across all social accounts to avoid mixed messages
</code></pre>
<div class="callout"><span class="badge">Practical rule</span> Monitor social media <em>continuously</em>, not just after a crisis is confirmed — most crises show early warning signs (Prodromal stage) online first.</div>`,
    `<span class="eyebrow">CCM301 · Chương 6 · Bài 6.1</span>
<h2>Khủng hoảng trên mạng xã hội &amp; thời đại số</h2>
<h3>Vì sao mạng xã hội thay đổi truyền thông khủng hoảng</h3>
<p>Khủng hoảng giờ có thể bắt đầu, lan truyền, và biến đổi trên mạng xã hội trước khi phát biểu chính thức của tổ chức kịp ra — ảnh chụp màn hình, video và tin đồn lan nhanh hơn bất kỳ thông cáo báo chí nào. <strong>Mô hình Truyền thông Khủng hoảng qua Mạng xã hội (SMCC)</strong> bổ sung ba yếu tố đặc trưng số vào góc nhìn kinh điển: hình thức (platform nào), nguồn (ai đăng đầu tiên — tổ chức, báo chí, hay một người dùng bình thường), và chiến lược thông điệp.</p>
<h3>Rủi ro mới</h3>
<ul>
<li><strong>Tốc độ</strong> — một sự việc địa phương có thể thành chủ đề trending toàn cầu trong vài giờ.</li>
<li><strong>Tin giả (misinformation)</strong> — phiên bản sai lệch hoặc bị thổi phồng của sự việc lan nhanh bằng hoặc nhanh hơn sự thật.</li>
<li><strong>Mất kiểm soát tường thuật</strong> — bất kỳ ai có điện thoại đều có thể thành "nguồn" chứng kiến, không chỉ tổ chức hay báo chí.</li>
<li><strong>Khuếch đại bởi người ảnh hưởng</strong> — một tài khoản có ảnh hưởng có thể nhân độ lan tỏa lên nhiều lần, theo cả hai chiều tốt/xấu.</li>
</ul>
<h3>Xử lý khủng hoảng số</h3>
<pre><code>1. Lắng nghe xã hội -- theo dõi nhắc-tên/từ khóa theo thời gian thực (từ TRƯỚC, không chỉ trong lúc khủng hoảng)
2. War room -- nhóm đa chức năng chuyên trách theo sát khủng hoảng trực tiếp trên mọi kênh
3. Phản hồi ĐÚNG platform nơi khủng hoảng đang diễn ra, không chỉ qua thông cáo báo chí
4. Đính chính tin giả bằng dữ kiện, bình tĩnh -- không tranh luận với troll
5. Thống nhất MỘT giọng nói trên mọi tài khoản mạng xã hội để tránh thông điệp lẫn lộn
</code></pre>
<div class="callout"><span class="badge">Quy tắc thực tế</span> Theo dõi mạng xã hội <em>liên tục</em>, không chỉ sau khi khủng hoảng đã được xác nhận — hầu hết khủng hoảng có dấu hiệu cảnh báo sớm (giai đoạn Prodromal) trên mạng trước tiên.</div>`,
  ]]);

const c6q = quiz('ccm301-quiz-6', 'Quiz 6 — Social media crisis|||Quiz 6 — Khủng hoảng mạng xã hội', [
  { id: 'q1', question: 'Mô hình SMCC bổ sung điều gì so với góc nhìn truyền thông khủng hoảng kinh điển?', options: ['Loại bỏ hoàn toàn vai trò của báo chí', 'Thêm yếu tố hình thức (platform), nguồn đăng đầu tiên, và chiến lược thông điệp trên mạng xã hội', 'Chỉ áp dụng cho khủng hoảng thiên tai', 'Thay thế hoàn toàn kế hoạch truyền thông khủng hoảng truyền thống'], correctIndex: 1, explanation: 'SMCC bổ sung các yếu tố đặc trưng số: platform, nguồn đăng, và chiến lược thông điệp.' },
  { id: 'q2', question: 'Nên xử lý bình luận sai lệch/troll trên mạng xã hội trong khủng hoảng như thế nào?', options: ['Tranh luận gay gắt để chứng minh troll sai', 'Đính chính bằng dữ kiện, giữ bình tĩnh, không tranh luận với troll', 'Xóa hết mọi bình luận tiêu cực', 'Không phản hồi bất kỳ bình luận nào'], correctIndex: 1, explanation: 'Nguyên tắc là đính chính bằng dữ kiện và bình tĩnh, tránh lôi kéo vào tranh luận với troll.' },
  { id: 'q3', question: 'Vì sao nên "lắng nghe xã hội" (social listening) liên tục, không chỉ khi khủng hoảng đã xảy ra?', options: ['Vì luật yêu cầu', 'Vì hầu hết khủng hoảng có dấu hiệu cảnh báo sớm trên mạng trước', 'Vì nó giúp tăng lượt theo dõi trang', 'Vì nó thay thế được đội quản lý khủng hoảng'], correctIndex: 1, explanation: 'Dấu hiệu cảnh báo sớm (giai đoạn Prodromal) thường xuất hiện trên mạng xã hội trước khi khủng hoảng bùng phát.' },
]);

const c7 = doc('ccm301-7-1-image-restoration-reputation', '7.1 — Image restoration & reputation recovery|||7.1 — Phục hồi hình ảnh & danh tiếng sau khủng hoảng',
  'Lý thuyết Phục hồi Hình ảnh của Benoit: chối bỏ, tránh trách nhiệm, giảm mức độ nghiêm trọng, hành động sửa sai, xin lỗi (mortification); so sánh với chiến lược rebuild/bolster của SCCT; hành trình phục hồi danh tiếng.',
  [[
    `<span class="eyebrow">CCM301 · Chapter 7 · Lesson 7.1</span>
<h2>Image restoration &amp; reputation recovery</h2>
<h3>Benoit's Image Restoration Theory</h3>
<p>Benoit's theory focuses on what an organization <em>says</em> after an accusation to repair its image, offering five strategy families:</p>
<pre><code>1. Denial            -> simple denial, or shift the blame to someone else
2. Evasion of         -> provocation, defeasibility (lack of information/control),
   responsibility        accident, good intentions
3. Reducing            -> bolstering, minimization, differentiation,
   offensiveness          transcendence, attacking the accuser, compensation
4. Corrective action   -> plan to fix the problem and/or prevent recurrence
5. Mortification       -> apologize, accept responsibility, ask forgiveness
</code></pre>
<h3>How it maps onto SCCT</h3>
<p>Benoit's five families overlap closely with Coombs' four SCCT groups: denial ≈ deny, evasion/reducing offensiveness ≈ diminish (and part of bolster), corrective action + mortification ≈ rebuild. Studying both gives a richer vocabulary for exactly <em>what to say</em>, once SCCT has told you <em>which direction</em> to go.</p>
<h3>The reputation recovery timeline</h3>
<p>Reputation is not repaired by a single statement — it recovers over time through <strong>consistency between words and actions</strong>: following through on corrective-action promises, transparent follow-up communication, and visible behavior change. Stakeholders judge organizations on delivered action more than on apology wording alone.</p>
<div class="callout"><span class="badge">Key insight</span> Mortification (a genuine apology) is the most trust-restoring strategy for high-responsibility crises — but only when paired with real corrective action, not words alone.</div>`,
    `<span class="eyebrow">CCM301 · Chương 7 · Bài 7.1</span>
<h2>Phục hồi hình ảnh &amp; danh tiếng sau khủng hoảng</h2>
<h3>Lý thuyết Phục hồi Hình ảnh của Benoit</h3>
<p>Lý thuyết của Benoit tập trung vào những gì tổ chức <em>nói</em> sau khi bị buộc tội để phục hồi hình ảnh, đưa ra năm nhóm chiến lược:</p>
<pre><code>1. Chối bỏ (Denial)        -> chối đơn giản, hoặc đổ lỗi cho người khác
2. Tránh trách nhiệm        -> khiêu khích, thiếu khả năng biện hộ (thiếu thông tin/kiểm soát),
   (Evasion)                   tai nạn, ý định tốt
3. Giảm mức độ nghiêm trọng  -> bồi đắp, giảm nhẹ, phân biệt hóa,
   (Reducing offensiveness)    siêu vượt (transcendence), công kích người buộc tội, bồi thường
4. Hành động sửa sai         -> kế hoạch khắc phục và/hoặc ngăn tái diễn
5. Xin lỗi (Mortification)   -> xin lỗi, nhận trách nhiệm, xin được tha thứ
</code></pre>
<h3>Cách nó khớp với SCCT</h3>
<p>Năm nhóm của Benoit gối lên bốn nhóm SCCT của Coombs khá gần: chối bỏ ≈ deny; tránh trách nhiệm/giảm mức độ nghiêm trọng ≈ diminish (và một phần bolster); hành động sửa sai + xin lỗi ≈ rebuild. Học cả hai cho một vốn từ phong phú hơn về đúng <em>nên nói gì</em>, sau khi SCCT đã cho biết <em>nên đi hướng nào</em>.</p>
<h3>Hành trình phục hồi danh tiếng</h3>
<p>Danh tiếng không phục hồi chỉ bằng một phát biểu — nó phục hồi theo thời gian qua <strong>sự nhất quán giữa lời nói và hành động</strong>: thực hiện đúng cam kết sửa sai, truyền thông theo sát minh bạch, và thay đổi hành vi thấy được. Các bên liên quan đánh giá tổ chức qua hành động thực hiện được nhiều hơn là lời xin lỗi đơn thuần.</p>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Xin lỗi thật lòng (mortification) là chiến lược phục hồi niềm tin tốt nhất cho khủng hoảng trách nhiệm cao — nhưng chỉ khi đi kèm hành động sửa sai thật, không chỉ lời nói.</div>`,
  ]]);

const c7q = quiz('ccm301-quiz-7', 'Quiz 7 — Image restoration|||Quiz 7 — Phục hồi hình ảnh', [
  { id: 'q1', question: 'Trong Lý thuyết Phục hồi Hình ảnh của Benoit, "mortification" là gì?', options: ['Chối bỏ hoàn toàn trách nhiệm', 'Xin lỗi thật lòng, nhận trách nhiệm', 'Công kích người buộc tội', 'Im lặng không phản hồi'], correctIndex: 1, explanation: 'Mortification là chiến lược xin lỗi, nhận trách nhiệm và xin được tha thứ.' },
  { id: 'q2', question: 'Vì sao xin lỗi (mortification) đơn thuần thường KHÔNG đủ để phục hồi danh tiếng?', options: ['Vì luật cấm xin lỗi công khai', 'Vì cần đi kèm hành động sửa sai thật, nhất quán giữa lời nói và hành động', 'Vì xin lỗi luôn bị xem là yếu đuối', 'Vì công chúng không đọc lời xin lỗi'], correctIndex: 1, explanation: 'Danh tiếng phục hồi qua sự nhất quán giữa lời nói và hành động sửa sai thực tế, không chỉ lời xin lỗi.' },
  { id: 'q3', question: 'Nhóm chiến lược nào của Benoit gần khớp nhất với "rebuild" trong SCCT?', options: ['Chối bỏ (Denial)', 'Tránh trách nhiệm (Evasion)', 'Hành động sửa sai + Xin lỗi (Corrective action + Mortification)', 'Giảm mức độ nghiêm trọng (Reducing offensiveness)'], correctIndex: 2, explanation: 'Hành động sửa sai kết hợp xin lỗi tương ứng với nhóm chiến lược "xây dựng lại" (rebuild) của SCCT.' },
]);

const c8 = doc('ccm301-8-1-evaluation-lessons-case-studies', '8.1 — Evaluation, lessons learned & real case studies|||8.1 — Đánh giá, bài học kinh nghiệm & tình huống thực tế',
  'Đánh giá sau khủng hoảng (after-action review); cập nhật kế hoạch; so sánh hai tình huống kinh điển: Tylenol (1982, xử lý tốt) và bê bối khí thải Volkswagen (2015, xử lý tệ).',
  [[
    `<span class="eyebrow">CCM301 · Chapter 8 · Lesson 8.1</span>
<h2>Evaluation, lessons learned &amp; real case studies</h2>
<h3>Post-crisis evaluation</h3>
<p>Once the Chronic stage settles, a structured <strong>after-action review</strong> should ask: Did key messages actually reach stakeholders? Did stakeholder perception (surveys, sentiment, media tone) improve, stay flat, or worsen? Which decisions were made too slowly? What would we do differently? The output is a revised Crisis Communication Plan — closing the loop back to Chapter 3.</p>
<h3>Case study 1 — Tylenol tampering crisis (1982)</h3>
<p>Following a criminal poisoning of Tylenol capsules by an outsider (a <strong>victim-cluster</strong> crisis, per Coombs), Johnson &amp; Johnson prioritized public safety over short-term cost: a nationwide product recall, full cooperation with authorities and media, and the introduction of tamper-resistant packaging. It is widely cited as the textbook example of a crisis handled well — transparency and consumer safety came first, and the brand recovered its market position.</p>
<h3>Case study 2 — Volkswagen emissions scandal (2015)</h3>
<p>Volkswagen was found to have installed software that cheated emissions tests — a <strong>preventable-cluster, organizational-misdeed</strong> crisis with high attributed responsibility. The company's early responses leaned toward minimizing/denying scope, which did not match the high-responsibility reality — a textbook example of the strategy/responsibility mismatch from Chapter 4. It faced major fines, lawsuits, and years of reputational and financial fallout.</p>
<h3>What the contrast teaches</h3>
<pre><code>Tylenol (victim, low responsibility)      -> transparency + safety-first + corrective action -> reputation preserved
Volkswagen (preventable, high responsibility) -> initial minimizing/denial -> mismatch with real responsibility -> reputation severely damaged
</code></pre>
<div class="callout"><span class="badge">Course takeaway</span> Every chapter of this course exists to make sure a real organization matches the RIGHT strategy to the RIGHT crisis type, fast, and follows through with real action afterward.</div>`,
    `<span class="eyebrow">CCM301 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá, bài học kinh nghiệm &amp; tình huống thực tế</h2>
<h3>Đánh giá sau khủng hoảng</h3>
<p>Khi giai đoạn Chronic lắng xuống, một <strong>đánh giá sau hành động (after-action review)</strong> có cấu trúc cần trả lời: Thông điệp chính có thực sự tới được các bên liên quan không? Nhận thức của các bên liên quan (khảo sát, cảm xúc mạng xã hội, giọng điệu báo chí) tốt lên, đứng yên, hay xấu đi? Quyết định nào ra chậm? Lần sau nên làm khác gì? Kết quả là một Kế hoạch Truyền thông Khủng hoảng đã sửa đổi — khép vòng lặp về lại Chương 3.</p>
<h3>Tình huống 1 — Khủng hoảng Tylenol bị đầu độc (1982)</h3>
<p>Sau khi viên nang Tylenol bị một người ngoài đầu độc bằng thủ đoạn hình sự (khủng hoảng <strong>nhóm nạn nhân</strong> theo Coombs), Johnson &amp; Johnson đặt an toàn công chúng lên trên chi phí ngắn hạn: thu hồi sản phẩm toàn quốc, hợp tác đầy đủ với cơ quan chức năng và báo chí, và đưa ra bao bì chống can thiệp (tamper-resistant). Đây được xem rộng rãi là ví dụ kinh điển về khủng hoảng xử lý tốt — minh bạch và an toàn người tiêu dùng được đặt trước, và thương hiệu phục hồi được vị thế trên thị trường.</p>
<h3>Tình huống 2 — Bê bối khí thải Volkswagen (2015)</h3>
<p>Volkswagen bị phát hiện đã cài phần mềm gian lận kết quả kiểm tra khí thải — khủng hoảng <strong>nhóm có thể tránh, sai phạm tổ chức</strong>, với mức trách nhiệm bị quy rất cao. Các phản ứng ban đầu của công ty nghiêng về giảm nhẹ/chối bỏ quy mô, không khớp với thực tế trách nhiệm cao — một ví dụ kinh điển về sự lệch pha chiến lược/trách nhiệm từ Chương 4. Công ty đối mặt các khoản phạt lớn, kiện tụng, và nhiều năm hậu quả về danh tiếng &amp; tài chính.</p>
<h3>Bài học từ sự đối lập</h3>
<pre><code>Tylenol (nạn nhân, trách nhiệm thấp)         -> minh bạch + an toàn trước + hành động sửa sai -> giữ được danh tiếng
Volkswagen (có thể tránh, trách nhiệm cao)   -> giảm nhẹ/chối bỏ ban đầu -> lệch pha với trách nhiệm thật -> danh tiếng tổn hại nặng
</code></pre>
<div class="callout"><span class="badge">Tổng kết môn học</span> Mọi chương của môn học tồn tại để đảm bảo một tổ chức thật khớp ĐÚNG chiến lược với ĐÚNG loại khủng hoảng, nhanh chóng, và thực hiện hành động thật sau đó.</div>`,
  ]]);

const c8q = quiz('ccm301-quiz-8', 'Quiz 8 — Evaluation & case studies|||Quiz 8 — Đánh giá & tình huống thực tế', [
  { id: 'q1', question: 'Đầu ra chính của một "after-action review" sau khủng hoảng là gì?', options: ['Một bản thông cáo báo chí mới', 'Một Kế hoạch Truyền thông Khủng hoảng đã được sửa đổi, cập nhật', 'Sa thải toàn bộ đội quản lý khủng hoảng', 'Ngừng mọi hoạt động truyền thông trong tương lai'], correctIndex: 1, explanation: 'After-action review khép vòng lặp bằng cách cập nhật lại kế hoạch truyền thông khủng hoảng.' },
  { id: 'q2', question: 'Khủng hoảng Tylenol (1982) thường được dùng làm ví dụ về điều gì?', options: ['Một khủng hoảng bị xử lý tệ dẫn đến phá sản', 'Một khủng hoảng xử lý tốt: minh bạch, an toàn công chúng trước, hành động sửa sai (bao bì chống can thiệp)', 'Một trường hợp chối bỏ trách nhiệm thành công', 'Một khủng hoảng không liên quan đến truyền thông'], correctIndex: 1, explanation: 'Johnson & Johnson ưu tiên an toàn công chúng, minh bạch, thu hồi sản phẩm và đổi bao bì — ví dụ kinh điển xử lý tốt.' },
  { id: 'q3', question: 'Vì sao phản ứng ban đầu của Volkswagen trong bê bối khí thải (2015) bị xem là một lỗi truyền thông khủng hoảng điển hình?', options: ['Vì công ty xin lỗi quá nhiều', 'Vì công ty phản ứng quá nhanh', 'Vì công ty nghiêng về giảm nhẹ/chối bỏ trong khi trách nhiệm thực tế bị quy rất cao — lệch pha chiến lược', 'Vì công ty không có đội quản lý khủng hoảng'], correctIndex: 2, explanation: 'Đây là ví dụ điển hình về lệch pha giữa chiến lược (giảm nhẹ/chối bỏ) và mức trách nhiệm thực tế (cao) theo SCCT.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'CCM301',
    slug: 'ccm301-crisis-communications-management',
    title: 'Crisis Communications Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCM301.webp',
    shortDescription: 'How organizations manage crises — crisis types & life cycle, planning & spokesperson, Coombs SCCT strategies, crisis messaging & press conferences, social-media crises, Benoit image restoration, real cases (Tylenol, VW).|||Cách tổ chức quản lý khủng hoảng — loại khủng hoảng & vòng đời, chuẩn bị & phát ngôn viên, chiến lược SCCT của Coombs, thông điệp & họp báo, khủng hoảng mạng xã hội, phục hồi hình ảnh (Benoit), tình huống thực tế (Tylenol, VW).',
    description: 'Môn <strong>CCM301 — Crisis Communications Management</strong> (kỳ 8) giúp hiểu <strong>tổ chức truyền thông thế nào khi khủng hoảng xảy ra</strong>. Từ <strong>khái niệm &amp; loại khủng hoảng</strong> (theo Coombs, Fearn-Banks) và <strong>vòng đời khủng hoảng</strong> → <strong>chuẩn bị</strong> (kế hoạch, đội xử lý, phát ngôn viên) → <strong>Lý thuyết SCCT</strong> &amp; chiến lược phản ứng (chối bỏ/giảm nhẹ/xây dựng lại/bồi đắp) → <strong>thông điệp, kênh &amp; họp báo</strong> → <strong>khủng hoảng trên mạng xã hội</strong> → <strong>Lý thuyết Phục hồi Hình ảnh</strong> (Benoit) → <strong>đánh giá &amp; tình huống thực tế</strong> (Tylenol, Volkswagen). Bám giáo trình FLM, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa khủng hoảng & phân biệt với vấn đề/rủi ro/thảm họa; các loại khủng hoảng theo Coombs & Fearn-Banks; vòng đời khủng hoảng (mô hình Fink); kế hoạch truyền thông khủng hoảng (CCP), đội quản lý khủng hoảng (CMT), chọn & huấn luyện phát ngôn viên; Lý thuyết SCCT & bốn nhóm chiến lược phản ứng; soạn thông điệp khủng hoảng, chọn kênh, điều hành họp báo; động lực khủng hoảng trên mạng xã hội (SMCC), social listening, war room; Lý thuyết Phục hồi Hình ảnh của Benoit; đánh giá sau khủng hoảng & phân tích tình huống thực tế (Tylenol, Volkswagen).',
    requirements: 'Không yêu cầu kiến thức truyền thông trước đó. Nên đọc trước khái niệm cơ bản về marketing/PR. Xem điều kiện tiên quyết chính thức trong khung chương trình khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng (Coombs, Fearn-Banks, Benoit), tài liệu chính thức, tình huống thực tế, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Khủng hoảng là gì, truyền thông khủng hoảng là gì, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan khủng hoảng|||Chapter 1 — Crisis overview', description: 'Định nghĩa, phân biệt khủng hoảng/vấn đề/rủi ro/thảm họa, các bên liên quan.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Loại khủng hoảng & vòng đời|||Chapter 2 — Crisis types & life cycle', description: 'Coombs, Fearn-Banks, mô hình 4 giai đoạn của Fink.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chuẩn bị: kế hoạch, đội, phát ngôn viên|||Chapter 3 — Preparation', description: 'CCP, CMT, chọn & huấn luyện phát ngôn viên, diễn tập.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lý thuyết SCCT & chiến lược phản ứng|||Chapter 4 — SCCT & response strategies', description: 'Quy trách nhiệm, bốn nhóm chiến lược, yếu tố tăng nặng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thông điệp, kênh & họp báo|||Chapter 5 — Messaging & press conferences', description: 'Quan tâm/cam kết/kiểm soát, giờ vàng, các kênh, điều hành họp báo.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Khủng hoảng trên mạng xã hội|||Chapter 6 — Social media crisis', description: 'SMCC, tốc độ lan truyền, social listening, war room.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phục hồi hình ảnh & danh tiếng|||Chapter 7 — Image restoration', description: 'Lý thuyết Benoit, so sánh với SCCT, hành trình phục hồi.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá & tình huống thực tế|||Chapter 8 — Evaluation & case studies', description: 'After-action review, Tylenol vs Volkswagen.', lessons: [c8, c8q] },
  ],
};
