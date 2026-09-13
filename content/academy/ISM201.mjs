/**
 * ISM201 — Introduction to Strategic Communication (Nhập môn Truyền thông
 * chiến lược). Khối Công nghệ Truyền thông FPTU, kỳ 1. Môn KHÔNG có syllabus
 * FLM chi tiết → dựng theo giáo trình chuẩn quốc tế (Hallahan et al "Defining
 * Strategic Communication"; Zerfass; Holtzhausen & Zerfass "Routledge Handbook
 * of Strategic Communication"; Argenti "Corporate Communication"; Cornelissen).
 * 8 chương, mỗi chương 1 DOCUMENT song ngữ + 1 QUIZ. Song ngữ + ví dụ tổ chức/
 * chiến dịch thật. Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ism201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Zerfass, Argenti, Cornelissen, Holtzhausen & Zerfass), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ISM201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Strategic Communication</strong> — what it is, why it matters, the planning process, stakeholders, integrated channels, crisis and measurement — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are widely used references and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ISM201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Ansgar Zerfass et al — <em>Strategic Communication</em> (defining the field; the four pillars)</li>
<li>Derina Holtzhausen &amp; Ansgar Zerfass — <em>The Routledge Handbook of Strategic Communication</em></li>
<li>Paul Argenti — <em>Corporate Communication</em> (reputation, stakeholders, practice)</li>
<li>Joep Cornelissen — <em>Corporate Communication: A Guide to Theory &amp; Practice</em></li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://amecorg.com/" target="_blank" rel="noopener">AMEC — measurement framework &amp; the Barcelona Principles</a></li>
<li><a href="https://instituteforpr.org/" target="_blank" rel="noopener">Institute for Public Relations — research &amp; theory</a></li>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Code of Ethics &amp; resources</a></li>
</ul>
<h3>▶️ YouTube &amp; talks</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=strategic+communication+PESO+model" target="_blank" rel="noopener">Strategic communication &amp; the PESO model — explainer talks</a></li>
<li><a href="https://www.youtube.com/results?search_query=crisis+communication+case+study" target="_blank" rel="noopener">Crisis communication case studies</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://amecorg.com/amecframework/" target="_blank" rel="noopener">AMEC Integrated Evaluation Framework — plan &amp; measure</a></li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — build simple communication assets</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what strategic communication is, its four pillars, and how it differs from PR/marketing.</li>
<li><strong>Plan</strong> — set objectives, scan the environment, map stakeholders, position a message.</li>
<li><strong>Execute</strong> — choose PESO channels, integrate internal &amp; external comms, prepare for issues/crisis.</li>
<li><strong>Prove &amp; protect</strong> — measure outcomes with AMEC, and practise the field's ethics.</li>
</ol></div>`,
    `<span class="eyebrow">ISM201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Truyền thông chiến lược</strong> — nó là gì, vì sao quan trọng, quy trình hoạch định, bên liên quan, kênh tích hợp, khủng hoảng và đo lường — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ISM201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Ansgar Zerfass và cộng sự — <em>Strategic Communication</em> (định nghĩa lĩnh vực; bốn trụ cột)</li>
<li>Derina Holtzhausen &amp; Ansgar Zerfass — <em>The Routledge Handbook of Strategic Communication</em></li>
<li>Paul Argenti — <em>Corporate Communication</em> (danh tiếng, bên liên quan, thực hành)</li>
<li>Joep Cornelissen — <em>Corporate Communication: A Guide to Theory &amp; Practice</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://amecorg.com/" target="_blank" rel="noopener">AMEC — khung đo lường &amp; Nguyên tắc Barcelona</a></li>
<li><a href="https://instituteforpr.org/" target="_blank" rel="noopener">Institute for Public Relations — nghiên cứu &amp; lý thuyết</a></li>
<li><a href="https://www.prsa.org/" target="_blank" rel="noopener">PRSA — Bộ Quy tắc đạo đức &amp; tài nguyên</a></li>
</ul>
<h3>▶️ YouTube &amp; talk</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=strategic+communication+PESO+model" target="_blank" rel="noopener">Truyền thông chiến lược &amp; mô hình PESO — video giảng</a></li>
<li><a href="https://www.youtube.com/results?search_query=crisis+communication+case+study" target="_blank" rel="noopener">Case study truyền thông khủng hoảng</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://amecorg.com/amecframework/" target="_blank" rel="noopener">AMEC Integrated Evaluation Framework — hoạch định &amp; đo lường</a></li>
<li><a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a> — dựng ấn phẩm truyền thông đơn giản</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — truyền thông chiến lược là gì, bốn trụ cột, và khác PR/marketing thế nào.</li>
<li><strong>Hoạch định</strong> — đặt mục tiêu, quét môi trường, lập bản đồ bên liên quan, định vị thông điệp.</li>
<li><strong>Thực thi</strong> — chọn kênh PESO, tích hợp truyền thông nội bộ &amp; đối ngoại, sẵn sàng cho issue/khủng hoảng.</li>
<li><strong>Chứng minh &amp; bảo vệ</strong> — đo kết quả bằng AMEC, và thực hành đạo đức nghề.</li>
</ol></div>`,
  ]]);

const intro = doc('ism201-0-1-overview', 'Course overview: Strategic Communication|||Tổng quan: Truyền thông chiến lược',
  'Truyền thông chiến lược là gì; vì sao khác truyền thông tự phát; lộ trình môn: định nghĩa & trụ cột → vai trò & lý thuyết → hoạch định & công chúng → kênh tích hợp → số/khủng hoảng → đo lường & đạo đức.',
  [[
    `<span class="eyebrow">ISM201 · Lesson 0.1 · Overview</span>
<h2>Strategic Communication</h2>
<p class="lead">This course helps you understand <strong>how organisations communicate on purpose</strong> — deliberately, to advance a mission. Strategic communication is the <strong>purposeful use of communication by an organisation to fulfil its goals</strong> (Hallahan et al., 2007). It is not random posting or reactive PR; every message is tied to strategy.</p>
<h3>Purposeful vs. accidental</h3>
<p>A brand that posts whenever someone has an idea communicates <em>accidentally</em>. A brand that maps its audiences, sets an objective, positions a message and measures the outcome communicates <strong>strategically</strong>. Same tools — very different discipline.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch1–2</strong> — what strategic communication is, its four pillars, and its value to an organisation.</li>
<li><strong>Ch3</strong> — the theories underneath it (stakeholder, framing, agenda-setting, excellence).</li>
<li><strong>Ch4–5</strong> — the planning process and how to understand publics &amp; stakeholders.</li>
<li><strong>Ch6–7</strong> — integrated channels (PESO), then digital &amp; crisis contexts.</li>
<li><strong>Ch8</strong> — measurement (AMEC) and the ethics of the profession.</li>
</ul>
<div class="callout"><span class="badge">One sentence to keep</span> Strategic communication asks four questions of every message: <em>who</em> are we talking to, <em>why</em>, <em>what</em> do we want them to think/feel/do, and <em>how will we know it worked</em>.</div>`,
    `<span class="eyebrow">ISM201 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông chiến lược</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>tổ chức giao tiếp có chủ đích thế nào</strong> — có tính toán, để phục vụ một sứ mệnh. Truyền thông chiến lược là <strong>việc tổ chức sử dụng truyền thông một cách có chủ đích để đạt mục tiêu của mình</strong> (Hallahan và cộng sự, 2007). Nó không phải đăng bài ngẫu hứng hay PR phản ứng; mọi thông điệp đều gắn với chiến lược.</p>
<h3>Có chủ đích vs. tình cờ</h3>
<p>Một thương hiệu đăng bài mỗi khi ai đó có ý tưởng là giao tiếp <em>tình cờ</em>. Một thương hiệu lập bản đồ công chúng, đặt mục tiêu, định vị thông điệp và đo kết quả là giao tiếp <strong>chiến lược</strong>. Cùng công cụ — kỷ luật hoàn toàn khác.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch1–2</strong> — truyền thông chiến lược là gì, bốn trụ cột, và giá trị với tổ chức.</li>
<li><strong>Ch3</strong> — các lý thuyết nền (bên liên quan, khung, thiết lập chương trình nghị sự, excellence).</li>
<li><strong>Ch4–5</strong> — quy trình hoạch định và cách hiểu công chúng &amp; bên liên quan.</li>
<li><strong>Ch6–7</strong> — kênh tích hợp (PESO), rồi bối cảnh số &amp; khủng hoảng.</li>
<li><strong>Ch8</strong> — đo lường (AMEC) và đạo đức nghề.</li>
</ul>
<div class="callout"><span class="badge">Một câu cần nhớ</span> Truyền thông chiến lược hỏi bốn câu ở mỗi thông điệp: nói với <em>ai</em>, <em>vì sao</em>, muốn họ <em>nghĩ/cảm/làm</em> gì, và <em>làm sao biết nó có tác dụng</em>.</div>`,
  ]]);

const c1 = doc('ism201-1-1-what-is-stratcomm', '1.1 — What strategic communication is|||1.1 — Truyền thông chiến lược là gì',
  'Định nghĩa Hallahan et al; phân biệt với PR, marketing, corporate communication; bốn trụ cột (management, marketing, technical/PR, và các chức năng hỗ trợ) và ý tưởng hội tụ.',
  [[
    `<span class="eyebrow">ISM201 · Chapter 1 · Lesson 1.1</span>
<h2>What strategic communication is</h2>
<h3>The founding definition</h3>
<p>Hallahan, Holtzhausen, van Ruler, Verčič &amp; Sriramesh (2007) define it as <strong>"the purposeful use of communication by an organisation to fulfil its mission."</strong> Three words carry the weight: <em>purposeful</em> (deliberate, goal-driven), <em>organisation</em> (any entity with a mission — firm, NGO, government, movement), and <em>mission</em> (communication serves the organisation's overall goals, not just a campaign).</p>
<h3>How it differs from neighbours</h3>
<ul>
<li><strong>Public relations</strong> — manages relationships with publics; strategic communication is the broader umbrella that aligns ALL communicative functions.</li>
<li><strong>Marketing communication</strong> — focuses on customers and selling; strategic comm serves the whole mission (employees, regulators, investors too).</li>
<li><strong>Corporate communication</strong> — the management function that oversees comm in a company; strategic communication is the wider concept that also covers NGOs, governments, activists.</li>
</ul>
<h3>The convergence idea</h3>
<p>Zerfass et al. describe strategic communication as the <strong>convergence</strong> of once-separate silos — PR, marketing, corporate, and public affairs — under one goal-driven, integrated view. Rather than five departments each with its own agenda, the organisation communicates as one.</p>
<div class="callout"><span class="badge">Real example</span> When <strong>Patagonia</strong> tells customers "Don't buy this jacket," marketing (sales), PR (reputation) and corporate mission (sustainability) speak with one voice — that alignment is strategic communication, not just an ad.</div>`,
    `<span class="eyebrow">ISM201 · Chương 1 · Bài 1.1</span>
<h2>Truyền thông chiến lược là gì</h2>
<h3>Định nghĩa nền tảng</h3>
<p>Hallahan, Holtzhausen, van Ruler, Verčič &amp; Sriramesh (2007) định nghĩa đó là <strong>"việc tổ chức sử dụng truyền thông một cách có chủ đích để hoàn thành sứ mệnh của mình."</strong> Ba từ mang trọng lượng: <em>có chủ đích</em> (có tính toán, hướng mục tiêu), <em>tổ chức</em> (bất kỳ thực thể nào có sứ mệnh — doanh nghiệp, NGO, chính phủ, phong trào), và <em>sứ mệnh</em> (truyền thông phục vụ mục tiêu tổng thể, không chỉ một chiến dịch).</p>
<h3>Khác các lĩnh vực lân cận thế nào</h3>
<ul>
<li><strong>Quan hệ công chúng (PR)</strong> — quản lý quan hệ với công chúng; truyền thông chiến lược là chiếc ô rộng hơn, gắn kết MỌI chức năng giao tiếp.</li>
<li><strong>Truyền thông marketing</strong> — tập trung vào khách hàng và bán hàng; truyền thông chiến lược phục vụ cả sứ mệnh (cả nhân viên, cơ quan quản lý, nhà đầu tư).</li>
<li><strong>Corporate communication</strong> — chức năng quản lý giám sát truyền thông trong doanh nghiệp; truyền thông chiến lược là khái niệm rộng hơn, bao cả NGO, chính phủ, nhà hoạt động.</li>
</ul>
<h3>Ý tưởng hội tụ</h3>
<p>Zerfass và cộng sự mô tả truyền thông chiến lược là sự <strong>hội tụ</strong> của các mảng từng tách rời — PR, marketing, corporate, và public affairs — dưới một góc nhìn tích hợp, hướng mục tiêu. Thay vì năm phòng ban mỗi nơi một hướng, tổ chức giao tiếp như một khối.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Khi <strong>Patagonia</strong> nói với khách "Đừng mua chiếc áo này," marketing (bán hàng), PR (danh tiếng) và sứ mệnh (bền vững) cùng một tiếng nói — sự gắn kết đó là truyền thông chiến lược, không chỉ một quảng cáo.</div>`,
  ]]);

const c1q = quiz('ism201-quiz-1', 'Quiz 1 — What it is|||Quiz 1 — Nó là gì', [
  { id: 'q1', question: 'Theo Hallahan và cộng sự (2007), truyền thông chiến lược là?', options: ['Đăng bài mạng xã hội thường xuyên', 'Việc tổ chức dùng truyền thông CÓ CHỦ ĐÍCH để hoàn thành sứ mệnh', 'Chỉ là quảng cáo bán hàng', 'Trả lời báo chí khi có sự cố'], correctIndex: 1, explanation: 'Định nghĩa nền: dùng truyền thông có chủ đích để đạt sứ mệnh của tổ chức.' },
  { id: 'q2', question: 'Điểm khác biệt chính giữa truyền thông chiến lược và marketing communication?', options: ['Chiến lược chỉ lo khách hàng', 'Marketing rộng hơn chiến lược', 'Chiến lược phục vụ CẢ sứ mệnh (nhân viên, quản lý, nhà đầu tư…), không chỉ bán hàng', 'Không có khác biệt'], correctIndex: 2, explanation: 'Marketing tập trung khách hàng/bán; chiến lược gắn mọi chức năng với sứ mệnh chung.' },
  { id: 'q3', question: 'Ý tưởng "hội tụ" (convergence) của Zerfass nói gì?', options: ['Tách PR, marketing, corporate thành các silo riêng', 'Gộp các chức năng giao tiếp dưới một góc nhìn tích hợp, hướng mục tiêu', 'Bỏ hết đo lường', 'Chỉ dùng kênh sở hữu'], correctIndex: 1, explanation: 'Convergence: các silo từng tách rời cùng phục vụ một mục tiêu chung.' },
]);

const c2 = doc('ism201-2-1-role-value', '2.1 — Role & value in the organisation|||2.1 — Vai trò & giá trị trong tổ chức',
  'Gắn truyền thông với chiến lược tổ chức; đóng góp vào danh tiếng (reputation) và "license to operate"; truyền thông là tài sản vô hình, không chỉ chi phí.',
  [[
    `<span class="eyebrow">ISM201 · Chapter 2 · Lesson 2.1</span>
<h2>Role &amp; value in the organisation</h2>
<h3>Aligning communication with strategy</h3>
<p>Communication earns its seat at the table when it is <strong>linked to the organisation's strategy</strong> — supporting goals like entering a market, launching a product, changing behaviour, or defending trust. Zerfass's "value creation" idea: communication builds <em>intangible assets</em> (reputation, brand, relationships, license to operate) that ultimately enable tangible results.</p>
<h3>Reputation &amp; license to operate</h3>
<ul>
<li><strong>Reputation</strong> — the aggregate of what stakeholders believe about you; it is slow to build, fast to lose, and directly affects sales, hiring and share price.</li>
<li><strong>License to operate</strong> — the informal permission society grants an organisation to do business. Lose public trust (a scandal, a pollution event) and regulators, communities and customers can effectively withdraw it.</li>
</ul>
<h3>Communication as investment, not cost</h3>
<p>A common mistake is treating communication as a cost centre. Strategically, it is an <strong>investment in intangible value</strong>: a strong reputation lowers the cost of a crisis, attracts talent, and buys the benefit of the doubt.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Johnson &amp; Johnson's 1982 Tylenol recall</strong> cost millions short-term, but transparent, public-first communication protected the brand's license to operate — it remains the textbook case that reputation is an asset worth defending.</div>`,
    `<span class="eyebrow">ISM201 · Chương 2 · Bài 2.1</span>
<h2>Vai trò &amp; giá trị trong tổ chức</h2>
<h3>Gắn truyền thông với chiến lược</h3>
<p>Truyền thông giành được chỗ ngồi ở bàn ra quyết định khi nó <strong>gắn với chiến lược của tổ chức</strong> — hỗ trợ các mục tiêu như vào thị trường, ra mắt sản phẩm, thay đổi hành vi, hoặc bảo vệ niềm tin. Ý tưởng "tạo giá trị" của Zerfass: truyền thông xây <em>tài sản vô hình</em> (danh tiếng, thương hiệu, quan hệ, license to operate) mà cuối cùng tạo ra kết quả hữu hình.</p>
<h3>Danh tiếng &amp; giấy phép hoạt động</h3>
<ul>
<li><strong>Danh tiếng (reputation)</strong> — tổng hợp những gì bên liên quan tin về bạn; xây thì chậm, mất thì nhanh, ảnh hưởng trực tiếp doanh số, tuyển dụng và giá cổ phiếu.</li>
<li><strong>License to operate</strong> — sự cho phép không chính thức mà xã hội trao để tổ chức kinh doanh. Mất niềm tin công chúng (bê bối, ô nhiễm) thì cơ quan quản lý, cộng đồng và khách hàng có thể rút nó về.</li>
</ul>
<h3>Truyền thông là đầu tư, không phải chi phí</h3>
<p>Sai lầm phổ biến là coi truyền thông như một khoản chi. Về mặt chiến lược, đó là <strong>khoản đầu tư vào giá trị vô hình</strong>: danh tiếng mạnh làm giảm chi phí khủng hoảng, thu hút nhân tài, và mua được sự "cho qua lần đầu".</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>Vụ thu hồi Tylenol của Johnson &amp; Johnson năm 1982</strong> tốn hàng triệu đô trước mắt, nhưng truyền thông minh bạch, đặt công chúng lên trước đã bảo vệ giấy phép hoạt động của thương hiệu — vẫn là case kinh điển rằng danh tiếng là tài sản đáng bảo vệ.</div>`,
  ]]);

const c2q = quiz('ism201-quiz-2', 'Quiz 2 — Role & value|||Quiz 2 — Vai trò & giá trị', [
  { id: 'q1', question: '"License to operate" nghĩa là?', options: ['Giấy phép kinh doanh do sở KHĐT cấp', 'Sự cho phép KHÔNG chính thức mà xã hội/công chúng trao để tổ chức hoạt động', 'Bằng sáng chế', 'Chứng chỉ ISO'], correctIndex: 1, explanation: 'Là niềm tin/chấp thuận của xã hội; mất nó thì hoạt động bị cản dù giấy tờ vẫn hợp lệ.' },
  { id: 'q2', question: 'Theo góc nhìn chiến lược, truyền thông nên được xem là?', options: ['Một trung tâm chi phí thuần', 'Đầu tư vào tài sản vô hình (danh tiếng, quan hệ)', 'Việc chỉ làm khi có khủng hoảng', 'Nhiệm vụ riêng của phòng marketing'], correctIndex: 1, explanation: 'Truyền thông xây tài sản vô hình dẫn tới kết quả hữu hình — là đầu tư, không phải chi phí.' },
  { id: 'q3', question: 'Vụ thu hồi Tylenol 1982 của J&J là case kinh điển cho thấy điều gì?', options: ['Che giấu thông tin bảo vệ được thương hiệu', 'Truyền thông minh bạch, đặt công chúng lên trước bảo vệ danh tiếng/license to operate', 'Danh tiếng không quan trọng', 'Nên im lặng chờ qua'], correctIndex: 1, explanation: 'Minh bạch, ưu tiên an toàn công chúng đã giữ được niềm tin — danh tiếng là tài sản đáng bảo vệ.' },
]);

const c3 = doc('ism201-3-1-foundational-theories', '3.1 — Foundational theories|||3.1 — Lý thuyết nền',
  'Stakeholder theory (Freeman); framing (Entman); agenda-setting (McCombs & Shaw); excellence theory (Grunig) — bốn lăng kính lý giải truyền thông chiến lược vận hành thế nào.',
  [[
    `<span class="eyebrow">ISM201 · Chapter 3 · Lesson 3.1</span>
<h2>Foundational theories</h2>
<p class="lead">Four theories give strategic communication its intellectual backbone. Each answers a different question.</p>
<h3>Stakeholder theory (Freeman)</h3>
<p>An organisation is answerable not only to shareholders but to all <strong>stakeholders</strong> — anyone who affects or is affected by it (employees, customers, communities, regulators, suppliers). Communication must serve this web of relationships, not just owners.</p>
<h3>Framing (Entman)</h3>
<p>To <strong>frame</strong> is to select some aspects of reality and make them more salient — shaping how an issue is understood. "A tax <em>relief</em>" and "a tax <em>cut for the rich</em>" describe the same policy through different frames. Strategic communicators choose frames deliberately.</p>
<h3>Agenda-setting (McCombs &amp; Shaw)</h3>
<p>Media may not tell people <em>what to think</em>, but they powerfully shape <em>what to think about</em>. By influencing which issues get coverage, communicators help set the public agenda.</p>
<h3>Excellence theory (Grunig)</h3>
<p>The most effective PR/communication is <strong>two-way and symmetrical</strong> — a dialogue that adjusts the organisation as well as the public, built on listening and mutual benefit rather than one-way persuasion.</p>
<div class="callout"><span class="badge">Putting it together</span> Stakeholder theory says <em>who</em> matters; framing says <em>how</em> we shape meaning; agenda-setting says <em>what</em> rises to attention; excellence theory says the best relationship is a <em>dialogue</em>.</div>`,
    `<span class="eyebrow">ISM201 · Chương 3 · Bài 3.1</span>
<h2>Lý thuyết nền</h2>
<p class="lead">Bốn lý thuyết tạo nên xương sống trí tuệ cho truyền thông chiến lược. Mỗi cái trả lời một câu hỏi khác nhau.</p>
<h3>Lý thuyết bên liên quan (Freeman)</h3>
<p>Tổ chức có trách nhiệm không chỉ với cổ đông mà với mọi <strong>bên liên quan (stakeholder)</strong> — ai tác động hoặc bị tác động bởi nó (nhân viên, khách hàng, cộng đồng, cơ quan quản lý, nhà cung cấp). Truyền thông phải phục vụ mạng lưới quan hệ này, không chỉ chủ sở hữu.</p>
<h3>Đóng khung — Framing (Entman)</h3>
<p><strong>Đóng khung</strong> là chọn một số khía cạnh của thực tế và làm chúng nổi bật — định hình cách hiểu một vấn đề. "Giảm nhẹ thuế" và "cắt thuế cho người giàu" mô tả cùng một chính sách qua hai khung khác nhau. Người làm truyền thông chiến lược chọn khung có chủ đích.</p>
<h3>Thiết lập chương trình nghị sự (McCombs &amp; Shaw)</h3>
<p>Truyền thông có thể không bảo người ta <em>nghĩ gì</em>, nhưng định hình mạnh <em>nghĩ về cái gì</em>. Bằng cách tác động vấn đề nào được đưa tin, người làm truyền thông góp phần đặt chương trình nghị sự công chúng.</p>
<h3>Lý thuyết Excellence (Grunig)</h3>
<p>Truyền thông/PR hiệu quả nhất là <strong>hai chiều và đối xứng</strong> — một cuộc đối thoại điều chỉnh cả tổ chức lẫn công chúng, dựa trên lắng nghe và lợi ích chung chứ không phải thuyết phục một chiều.</p>
<div class="callout"><span class="badge">Ghép lại</span> Bên liên quan nói <em>ai</em> quan trọng; framing nói <em>cách</em> ta định hình nghĩa; agenda-setting nói <em>cái gì</em> nổi lên; excellence nói quan hệ tốt nhất là một <em>cuộc đối thoại</em>.</div>`,
  ]]);

const c3q = quiz('ism201-quiz-3', 'Quiz 3 — Theories|||Quiz 3 — Lý thuyết', [
  { id: 'q1', question: 'Lý thuyết bên liên quan (Freeman) cho rằng tổ chức chịu trách nhiệm với?', options: ['Chỉ cổ đông', 'Chỉ khách hàng', 'Mọi bên tác động hoặc bị tác động (nhân viên, cộng đồng, quản lý…)', 'Chỉ cơ quan nhà nước'], correctIndex: 2, explanation: 'Stakeholder = bất kỳ ai ảnh hưởng hoặc bị ảnh hưởng bởi tổ chức, không chỉ cổ đông.' },
  { id: 'q2', question: 'Thiết lập chương trình nghị sự (agenda-setting) nói truyền thông định hình mạnh nhất điều gì?', options: ['Người ta nghĩ CHÍNH XÁC điều gì', 'Người ta nghĩ VỀ CÁI GÌ (vấn đề nào được chú ý)', 'Giá sản phẩm', 'Cấu trúc tổ chức'], correctIndex: 1, explanation: 'McCombs & Shaw: media định "nghĩ về cái gì" hơn là "nghĩ gì".' },
  { id: 'q3', question: 'Theo lý thuyết Excellence (Grunig), truyền thông hiệu quả nhất là?', options: ['Một chiều, thuyết phục tối đa', 'Hai chiều, đối xứng — đối thoại, lắng nghe, lợi ích chung', 'Chỉ quảng cáo trả tiền', 'Im lặng để tránh rủi ro'], correctIndex: 1, explanation: 'Mô hình two-way symmetrical: đối thoại điều chỉnh cả hai phía.' },
]);

const c4 = doc('ism201-4-1-planning-process', '4.1 — The strategic planning process|||4.1 — Quy trình hoạch định chiến lược',
  'Đặt mục tiêu SMART; phân tích môi trường (SWOT/PEST, nghiên cứu); định vị thông điệp; mô hình RACE/RPIE (Research–Plan–Implement–Evaluate).',
  [[
    `<span class="eyebrow">ISM201 · Chapter 4 · Lesson 4.1</span>
<h2>The strategic planning process</h2>
<h3>A repeatable cycle: RPIE / RACE</h3>
<p>Strategic communication follows a planning loop — <strong>R</strong>esearch → <strong>P</strong>lanning → <strong>I</strong>mplementation → <strong>E</strong>valuation (RPIE; also taught as RACE: Research, Action-planning, Communication, Evaluation). It is a cycle, not a line: evaluation feeds the next round of research.</p>
<h3>Objectives before tactics</h3>
<p>Set objectives <strong>before</strong> choosing channels. Good objectives are <strong>SMART</strong> — Specific, Measurable, Achievable, Relevant, Time-bound — and distinguish <em>outputs</em> (we published 10 posts) from <em>outcomes</em> (awareness rose 8 points). Aim at outcomes.</p>
<h3>Scan the environment</h3>
<p>Research the situation before acting: <strong>SWOT</strong> (Strengths, Weaknesses, Opportunities, Threats) and <strong>PEST</strong> (Political, Economic, Social, Technological) map the internal and external landscape, so the plan responds to reality, not assumptions.</p>
<h3>Position the message</h3>
<p><strong>Positioning</strong> is the single, distinctive idea you want to own in the audience's mind. A strong message is consistent, relevant to the audience's values, and differentiated from competitors — then adapted (not reinvented) per channel.</p>
<div class="callout"><span class="badge">Real example</span> <strong>Dove's "Real Beauty"</strong> began with research into how few women called themselves beautiful (an insight), set an outcome objective (shift self-perception), positioned one idea (real beauty), then rolled it across paid, owned and earned media for years.</div>`,
    `<span class="eyebrow">ISM201 · Chương 4 · Bài 4.1</span>
<h2>Quy trình hoạch định chiến lược</h2>
<h3>Một chu trình lặp lại: RPIE / RACE</h3>
<p>Truyền thông chiến lược đi theo một vòng hoạch định — <strong>R</strong>esearch (nghiên cứu) → <strong>P</strong>lanning (lập kế hoạch) → <strong>I</strong>mplementation (thực thi) → <strong>E</strong>valuation (đánh giá) (RPIE; còn dạy là RACE: Research, Action, Communication, Evaluation). Đó là vòng tròn, không phải đường thẳng: đánh giá nuôi lại vòng nghiên cứu kế tiếp.</p>
<h3>Mục tiêu trước chiến thuật</h3>
<p>Đặt mục tiêu <strong>trước khi</strong> chọn kênh. Mục tiêu tốt là <strong>SMART</strong> — Cụ thể, Đo được, Khả thi, Liên quan, Có hạn thời gian — và phân biệt <em>đầu ra (output)</em> (đăng 10 bài) với <em>kết quả (outcome)</em> (nhận biết tăng 8 điểm). Nhắm vào outcome.</p>
<h3>Quét môi trường</h3>
<p>Nghiên cứu bối cảnh trước khi hành động: <strong>SWOT</strong> (Điểm mạnh, Điểm yếu, Cơ hội, Thách thức) và <strong>PEST</strong> (Chính trị, Kinh tế, Xã hội, Công nghệ) lập bản đồ nội bộ và bên ngoài, để kế hoạch đáp lại thực tế chứ không phải giả định.</p>
<h3>Định vị thông điệp</h3>
<p><strong>Định vị (positioning)</strong> là một ý tưởng riêng biệt bạn muốn sở hữu trong tâm trí công chúng. Thông điệp mạnh thì nhất quán, liên quan giá trị của công chúng, khác biệt với đối thủ — rồi được điều chỉnh (không phải làm lại) theo từng kênh.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> <strong>"Real Beauty" của Dove</strong> khởi đầu từ nghiên cứu rằng rất ít phụ nữ tự nhận mình đẹp (một insight), đặt mục tiêu outcome (đổi cách tự nhìn nhận), định vị một ý tưởng (vẻ đẹp thật), rồi trải khắp paid, owned và earned media suốt nhiều năm.</div>`,
  ]]);

const c4q = quiz('ism201-quiz-4', 'Quiz 4 — Planning|||Quiz 4 — Hoạch định', [
  { id: 'q1', question: 'Bốn bước của mô hình RPIE là?', options: ['Read–Post–Ignore–Exit', 'Research–Planning–Implementation–Evaluation', 'Reach–Profit–Income–Expense', 'Rush–Panic–Improvise–Escape'], correctIndex: 1, explanation: 'RPIE: Nghiên cứu → Lập kế hoạch → Thực thi → Đánh giá (vòng lặp).' },
  { id: 'q2', question: 'Mục tiêu SMART nên nhắm vào?', options: ['Output (số bài đăng)', 'Outcome (thay đổi nhận biết/thái độ/hành vi), đo được và có hạn', 'Càng mơ hồ càng linh hoạt', 'Chỉ số lượt thích'], correctIndex: 1, explanation: 'SMART hướng outcome đo được; output chỉ là hoạt động, không phải kết quả.' },
  { id: 'q3', question: 'Công cụ quét môi trường bên ngoài theo Chính trị–Kinh tế–Xã hội–Công nghệ là?', options: ['SWOT', 'PEST', 'PESO', 'RACE'], correctIndex: 1, explanation: 'PEST = Political, Economic, Social, Technological; SWOT gồm cả nội bộ.' },
]);

const c5 = doc('ism201-5-1-publics-stakeholders', '5.1 — Publics & stakeholders|||5.1 — Công chúng & bên liên quan',
  'Phân biệt stakeholder vs public (Grunig: latent/aware/active); lập bản đồ bên liên quan (power–interest grid); phân khúc (segmentation) để nhắm đúng thông điệp.',
  [[
    `<span class="eyebrow">ISM201 · Chapter 5 · Lesson 5.1</span>
<h2>Publics &amp; stakeholders</h2>
<h3>Stakeholders vs. publics</h3>
<p>A <strong>stakeholder</strong> is any group linked to the organisation (a broad category — "customers", "employees"). A <strong>public</strong> is narrower: Grunig's situational theory says publics <em>form</em> around an issue and move through stages — <strong>latent</strong> (affected but unaware) → <strong>aware</strong> (recognise the problem) → <strong>active</strong> (organise and act). You communicate differently with each.</p>
<h3>Stakeholder mapping: the power–interest grid</h3>
<pre><code>            LOW interest        HIGH interest
HIGH power  Keep satisfied      Manage closely
LOW power   Monitor             Keep informed</code></pre>
<p>Plot each stakeholder by how much <strong>power</strong> they hold and how much <strong>interest</strong> they have. High power + high interest = manage closely (e.g. regulators, key investors); low power + low interest = monitor. The grid tells you where to spend effort.</p>
<h3>Segmentation</h3>
<p>Rather than "the general public", divide audiences into <strong>segments</strong> that share needs, values or behaviours — by demographics, psychographics, or relationship to the issue — so each gets a relevant message on a channel it actually uses.</p>
<div class="callout"><span class="badge">Real example</span> A university launching a new programme segments differently for <em>prospective students</em> (TikTok, aspiration), <em>parents</em> (email, outcomes &amp; cost) and <em>employers</em> (LinkedIn, graduate quality) — same programme, three tailored messages.</div>`,
    `<span class="eyebrow">ISM201 · Chương 5 · Bài 5.1</span>
<h2>Công chúng &amp; bên liên quan</h2>
<h3>Bên liên quan vs. công chúng</h3>
<p><strong>Bên liên quan (stakeholder)</strong> là bất kỳ nhóm nào gắn với tổ chức (một loại rộng — "khách hàng", "nhân viên"). <strong>Công chúng (public)</strong> hẹp hơn: lý thuyết tình huống của Grunig nói công chúng <em>hình thành</em> quanh một vấn đề và đi qua các giai đoạn — <strong>tiềm ẩn (latent)</strong> (bị ảnh hưởng nhưng chưa nhận ra) → <strong>nhận biết (aware)</strong> (nhận ra vấn đề) → <strong>chủ động (active)</strong> (tổ chức lại và hành động). Mỗi giai đoạn giao tiếp một kiểu.</p>
<h3>Lập bản đồ bên liên quan: lưới quyền lực–quan tâm</h3>
<pre><code>              Quan tâm THẤP     Quan tâm CAO
Quyền lực CAO  Giữ hài lòng      Quản lý sát sao
Quyền lực THẤP Theo dõi          Giữ thông tin</code></pre>
<p>Đặt mỗi bên liên quan theo mức <strong>quyền lực</strong> họ nắm và mức <strong>quan tâm</strong> họ có. Quyền lực cao + quan tâm cao = quản lý sát (vd cơ quan quản lý, nhà đầu tư then chốt); quyền lực thấp + quan tâm thấp = theo dõi. Lưới cho biết dồn công sức vào đâu.</p>
<h3>Phân khúc (segmentation)</h3>
<p>Thay vì "công chúng nói chung", chia đối tượng thành các <strong>phân khúc</strong> chung nhu cầu, giá trị hay hành vi — theo nhân khẩu, tâm lý học (psychographics), hay quan hệ với vấn đề — để mỗi nhóm nhận thông điệp liên quan trên kênh họ thực sự dùng.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một trường đại học ra ngành mới phân khúc khác nhau cho <em>thí sinh tương lai</em> (TikTok, khát vọng), <em>phụ huynh</em> (email, kết quả &amp; chi phí) và <em>nhà tuyển dụng</em> (LinkedIn, chất lượng sinh viên) — cùng một ngành, ba thông điệp riêng.</div>`,
  ]]);

const c5q = quiz('ism201-quiz-5', 'Quiz 5 — Publics|||Quiz 5 — Công chúng', [
  { id: 'q1', question: 'Theo lý thuyết tình huống của Grunig, thứ tự các giai đoạn của một public là?', options: ['Active → aware → latent', 'Latent (tiềm ẩn) → aware (nhận biết) → active (chủ động)', 'Aware → latent → active', 'Chỉ có một giai đoạn'], correctIndex: 1, explanation: 'Public hình thành quanh vấn đề: tiềm ẩn → nhận biết → chủ động.' },
  { id: 'q2', question: 'Trên lưới power–interest, bên liên quan quyền lực CAO + quan tâm CAO cần?', options: ['Chỉ theo dõi', 'Quản lý sát sao (manage closely)', 'Bỏ qua', 'Giữ hài lòng ở mức tối thiểu'], correctIndex: 1, explanation: 'Quyền lực cao + quan tâm cao (vd nhà đầu tư, cơ quan quản lý) → quản lý sát.' },
  { id: 'q3', question: 'Segmentation (phân khúc) nhằm để?', options: ['Gửi một thông điệp giống nhau cho tất cả', 'Chia đối tượng theo nhu cầu/giá trị/hành vi để nhắm đúng thông điệp và kênh', 'Giảm số kênh xuống một', 'Bỏ nghiên cứu công chúng'], correctIndex: 1, explanation: 'Phân khúc giúp mỗi nhóm nhận thông điệp liên quan trên kênh họ dùng.' },
]);

const c6 = doc('ism201-6-1-peso-integration', '6.1 — Channels & integrated tactics (PESO)|||6.1 — Kênh & chiến thuật tích hợp (PESO)',
  'Mô hình PESO (Paid, Earned, Shared, Owned); tích hợp để một thông điệp nhất quán qua nhiều kênh; truyền thông nội bộ (internal comm) như một kênh chiến lược.',
  [[
    `<span class="eyebrow">ISM201 · Chapter 6 · Lesson 6.1</span>
<h2>Channels &amp; integrated tactics — the PESO model</h2>
<h3>Four media types</h3>
<ul>
<li><strong>Paid</strong> — you pay for placement (ads, sponsored posts, influencer deals). Fast reach, full control, but trusted less.</li>
<li><strong>Earned</strong> — coverage you <em>earn</em> from journalists/third parties (news articles, reviews). Highest credibility, least control.</li>
<li><strong>Shared</strong> — social media, where audiences amplify and converse. Reach through networks; you share control with the crowd.</li>
<li><strong>Owned</strong> — channels you control (website, blog, email, app). Full control, permanent, but you must drive the audience there.</li>
</ul>
<h3>Why integrate (IMC)</h3>
<p><strong>Integrated marketing/communication</strong> means the same core message reinforces itself across all four — an owned blog post, seeded to journalists (earned), boosted with paid, discussed on shared. Consistency multiplies impact; contradiction destroys trust.</p>
<h3>Internal communication is strategic too</h3>
<p>Employees are the first public and the most credible messengers. <strong>Internal communication</strong> — aligning and engaging staff — is a strategic channel: disengaged or misinformed employees undermine every external message.</p>
<div class="callout"><span class="badge">Real example</span> A product launch: teaser on <em>owned</em> email → press release to tech media (<em>earned</em>) → launch film boosted as <em>paid</em> ads → community reactions on <em>shared</em> social — one message, four media, mutually reinforcing.</div>`,
    `<span class="eyebrow">ISM201 · Chương 6 · Bài 6.1</span>
<h2>Kênh &amp; chiến thuật tích hợp — mô hình PESO</h2>
<h3>Bốn loại kênh</h3>
<ul>
<li><strong>Paid (trả tiền)</strong> — bạn trả tiền để xuất hiện (quảng cáo, bài tài trợ, hợp đồng influencer). Tiếp cận nhanh, kiểm soát trọn, nhưng ít được tin.</li>
<li><strong>Earned (lan truyền/tự nhiên)</strong> — sự đưa tin bạn <em>giành được</em> từ nhà báo/bên thứ ba (bài báo, đánh giá). Uy tín cao nhất, ít kiểm soát nhất.</li>
<li><strong>Shared (chia sẻ)</strong> — mạng xã hội, nơi công chúng khuếch đại và trò chuyện. Lan qua mạng lưới; bạn chia sẻ quyền kiểm soát với đám đông.</li>
<li><strong>Owned (sở hữu)</strong> — kênh bạn kiểm soát (website, blog, email, app). Kiểm soát trọn, lâu bền, nhưng phải tự kéo công chúng tới.</li>
</ul>
<h3>Vì sao tích hợp (IMC)</h3>
<p><strong>Truyền thông/marketing tích hợp</strong> nghĩa là cùng một thông điệp cốt lõi tự củng cố qua cả bốn — bài blog owned, gửi cho nhà báo (earned), đẩy bằng paid, bàn luận trên shared. Sự nhất quán nhân tác động lên; mâu thuẫn phá niềm tin.</p>
<h3>Truyền thông nội bộ cũng là chiến lược</h3>
<p>Nhân viên là công chúng đầu tiên và là người truyền tin đáng tin nhất. <strong>Truyền thông nội bộ</strong> — gắn kết và tạo động lực cho nhân sự — là một kênh chiến lược: nhân viên hờ hững hay hiểu sai sẽ làm hỏng mọi thông điệp đối ngoại.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Một đợt ra mắt sản phẩm: teaser qua email <em>owned</em> → thông cáo báo chí cho báo công nghệ (<em>earned</em>) → phim ra mắt đẩy dạng quảng cáo <em>paid</em> → phản ứng cộng đồng trên mạng <em>shared</em> — một thông điệp, bốn kênh, củng cố lẫn nhau.</div>`,
  ]]);

const c6q = quiz('ism201-quiz-6', 'Quiz 6 — PESO|||Quiz 6 — PESO', [
  { id: 'q1', question: 'PESO là viết tắt của?', options: ['Plan–Execute–Share–Own', 'Paid–Earned–Shared–Owned', 'Public–Employee–Social–Online', 'Print–Email–SMS–Outdoor'], correctIndex: 1, explanation: 'PESO = Paid (trả tiền), Earned (tự nhiên), Shared (chia sẻ), Owned (sở hữu).' },
  { id: 'q2', question: 'Loại kênh nào thường có UY TÍN cao nhất nhưng ít kiểm soát nhất?', options: ['Paid', 'Owned', 'Earned', 'Shared'], correctIndex: 2, explanation: 'Earned (báo chí/bên thứ ba) đáng tin nhất nhưng bạn không kiểm soát nội dung.' },
  { id: 'q3', question: 'Vì sao truyền thông nội bộ được coi là kênh chiến lược?', options: ['Vì nó rẻ', 'Vì nhân viên là công chúng đầu tiên và người truyền tin đáng tin nhất', 'Vì nó thay được mọi kênh khác', 'Vì nó không cần đo lường'], correctIndex: 1, explanation: 'Nhân viên gắn kết củng cố mọi thông điệp đối ngoại; hờ hững thì phá hỏng.' },
]);

const c7 = doc('ism201-7-1-digital-crisis', '7.1 — Digital contexts, issues & crisis|||7.1 — Bối cảnh số, issue & khủng hoảng',
  'Truyền thông số & mạng xã hội (tốc độ, hai chiều, tin giả); quản trị issue (issues management) trước khi thành khủng hoảng; tổng quan crisis communication (SCCT, "chiếc kim đồng hồ vàng").',
  [[
    `<span class="eyebrow">ISM201 · Chapter 7 · Lesson 7.1</span>
<h2>Digital contexts, issues &amp; crisis</h2>
<h3>The digital shift</h3>
<p>Social and digital media changed the field: communication became <strong>real-time, two-way, and networked</strong>. Audiences are now co-creators who can amplify — or contradict — you instantly. That raises reach and speed, but also the risk of misinformation and viral backlash.</p>
<h3>Issues management — before it burns</h3>
<p>An <strong>issue</strong> is a gap between an organisation's actions and stakeholder expectations that could become a crisis if ignored. <strong>Issues management</strong> is the proactive practice of scanning for these early, and acting before they escalate — the cheapest crisis is the one you prevent.</p>
<h3>Crisis communication basics</h3>
<ul>
<li><strong>Speed</strong> — the "golden hour": responding quickly frames the story before others do; silence is read as guilt.</li>
<li><strong>SCCT (Coombs)</strong> — Situational Crisis Communication Theory matches the <em>response</em> (deny / diminish / rebuild) to the level of <em>responsibility</em> the public assigns.</li>
<li><strong>Honesty first</strong> — acknowledge, express concern, say what you're doing, and don't speculate. Trust lost in a crisis is hard to rebuild.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> During the 2018 <strong>KFC UK chicken shortage</strong>, KFC ran a paid ad rearranging its logo to "FCK" with a candid apology. Fast, honest, self-aware crisis communication turned a supply failure into goodwill.</div>`,
    `<span class="eyebrow">ISM201 · Chương 7 · Bài 7.1</span>
<h2>Bối cảnh số, issue &amp; khủng hoảng</h2>
<h3>Bước dịch chuyển số</h3>
<p>Mạng xã hội và truyền thông số đã đổi cả lĩnh vực: giao tiếp trở nên <strong>thời gian thực, hai chiều và nối mạng</strong>. Công chúng nay là người đồng sáng tạo, có thể khuếch đại — hoặc phản bác — bạn tức thì. Điều đó tăng độ phủ và tốc độ, nhưng cũng tăng rủi ro tin giả và làn sóng phản ứng lan nhanh.</p>
<h3>Quản trị issue — trước khi cháy</h3>
<p><strong>Issue</strong> là khoảng cách giữa hành động của tổ chức và kỳ vọng của bên liên quan, có thể thành khủng hoảng nếu bị bỏ mặc. <strong>Quản trị issue (issues management)</strong> là thực hành chủ động quét sớm những khoảng cách này và xử lý trước khi leo thang — khủng hoảng rẻ nhất là khủng hoảng bạn ngăn được.</p>
<h3>Nền tảng truyền thông khủng hoảng</h3>
<ul>
<li><strong>Tốc độ</strong> — "giờ vàng": phản hồi nhanh giúp định khung câu chuyện trước khi người khác làm; im lặng bị hiểu là có lỗi.</li>
<li><strong>SCCT (Coombs)</strong> — Lý thuyết truyền thông khủng hoảng tình huống ghép <em>cách phản hồi</em> (phủ nhận / giảm nhẹ / tái thiết) với mức <em>trách nhiệm</em> mà công chúng quy cho.</li>
<li><strong>Thành thật trước</strong> — thừa nhận, bày tỏ quan tâm, nói bạn đang làm gì, đừng suy đoán. Niềm tin mất trong khủng hoảng rất khó xây lại.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Trong vụ <strong>KFC UK hết gà năm 2018</strong>, KFC chạy quảng cáo trả tiền xếp lại logo thành "FCK" kèm lời xin lỗi thẳng thắn. Truyền thông khủng hoảng nhanh, thật, tự trào đã biến một sự cố nguồn cung thành thiện cảm.</div>`,
  ]]);

const c7q = quiz('ism201-quiz-7', 'Quiz 7 — Digital & crisis|||Quiz 7 — Số & khủng hoảng', [
  { id: 'q1', question: '"Issues management" (quản trị issue) là?', options: ['Xử lý khủng hoảng sau khi nó bùng nổ', 'Chủ động quét & xử lý khoảng cách kỳ vọng SỚM, trước khi thành khủng hoảng', 'Xoá bình luận tiêu cực', 'Chỉ làm khi báo chí gọi'], correctIndex: 1, explanation: 'Issues management là phòng ngừa chủ động — khủng hoảng rẻ nhất là cái bạn ngăn được.' },
  { id: 'q2', question: 'Trong truyền thông khủng hoảng, im lặng kéo dài thường bị công chúng hiểu là?', options: ['Sự chuyên nghiệp', 'Dấu hiệu có lỗi/né tránh', 'Chiến lược thông minh', 'Tôn trọng báo chí'], correctIndex: 1, explanation: '"Giờ vàng": phản hồi nhanh định khung câu chuyện; im lặng bị đọc là guilt.' },
  { id: 'q3', question: 'SCCT (Coombs) khuyên điều gì?', options: ['Luôn phủ nhận mọi cáo buộc', 'Ghép cách phản hồi (phủ nhận/giảm nhẹ/tái thiết) với mức trách nhiệm công chúng quy cho', 'Luôn giữ im lặng', 'Chỉ dùng kênh paid'], correctIndex: 1, explanation: 'SCCT khớp chiến lược phản hồi với mức responsibility mà công chúng gán.' },
]);

const c8 = doc('ism201-8-1-measurement-ethics', '8.1 — Measurement & ethics|||8.1 — Đo lường & đạo đức',
  'Đo lường: output vs outcome vs impact, KPI, khung AMEC & Nguyên tắc Barcelona (bỏ AVE); đạo đức nghề truyền thông (trung thực, minh bạch, tránh spin/tin giả, bộ quy tắc PRSA).',
  [[
    `<span class="eyebrow">ISM201 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement &amp; ethics</h2>
<h3>Measure outcomes, not just activity</h3>
<pre><code>Outputs   -> what we did      (posts published, press releases sent)
Outtakes  -> what audiences took (reach, recall, engagement)
Outcomes  -> what changed      (awareness, attitude, behaviour)
Impact    -> organisational    (sales, trust, license to operate)</code></pre>
<p>Amateurs count outputs; professionals prove <strong>outcomes and impact</strong>. Choose <strong>KPIs</strong> tied to the objective set in Chapter 4 — measure against a baseline.</p>
<h3>The AMEC framework &amp; Barcelona Principles</h3>
<p><strong>AMEC's Integrated Evaluation Framework</strong> links objectives → inputs → activities → outputs → outtakes → outcomes → impact. The <strong>Barcelona Principles</strong> set the modern standard — notably: goal-setting and measurement are fundamental, <em>outcomes beat outputs</em>, and <strong>AVE (Advertising Value Equivalent) is NOT a valid metric</strong>. Measurement should be transparent and consistent.</p>
<h3>Ethics of the profession</h3>
<p>Strategic communication influences beliefs and behaviour — so ethics are non-negotiable. Core duties: <strong>honesty</strong> (no fabrication), <strong>transparency</strong> (disclose paid relationships, don't astroturf), avoiding manipulative <strong>spin</strong> and disinformation, and protecting the public interest. Codes like the <strong>PRSA Code of Ethics</strong> and <strong>Global Alliance</strong> principles guide practice.</p>
<div class="callout"><span class="badge">Bottom line</span> A campaign that hits its KPIs by deceiving the public has failed strategically — trust, the whole asset, is spent. Measure honestly; communicate ethically.</div>`,
    `<span class="eyebrow">ISM201 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; đạo đức</h2>
<h3>Đo kết quả, không chỉ hoạt động</h3>
<pre><code>Output   -> việc ta làm       (số bài đăng, thông cáo gửi đi)
Outtake  -> điều công chúng nhận (reach, nhớ, tương tác)
Outcome  -> điều thay đổi      (nhận biết, thái độ, hành vi)
Impact   -> với tổ chức        (doanh số, niềm tin, license to operate)</code></pre>
<p>Người non tay đếm output; người chuyên nghiệp chứng minh <strong>outcome và impact</strong>. Chọn <strong>KPI</strong> gắn với mục tiêu đã đặt ở Chương 4 — đo so với một mốc gốc (baseline).</p>
<h3>Khung AMEC &amp; Nguyên tắc Barcelona</h3>
<p><strong>Khung đánh giá tích hợp của AMEC</strong> nối mục tiêu → đầu vào → hoạt động → output → outtake → outcome → impact. <strong>Nguyên tắc Barcelona</strong> đặt chuẩn hiện đại — đáng chú ý: đặt mục tiêu và đo lường là cốt lõi, <em>outcome hơn output</em>, và <strong>AVE (Advertising Value Equivalent) KHÔNG phải chỉ số hợp lệ</strong>. Đo lường phải minh bạch và nhất quán.</p>
<h3>Đạo đức nghề</h3>
<p>Truyền thông chiến lược tác động niềm tin và hành vi — nên đạo đức là không thể thỏa hiệp. Bổn phận cốt lõi: <strong>trung thực</strong> (không bịa đặt), <strong>minh bạch</strong> (công bố quan hệ trả tiền, không astroturf), tránh <strong>spin</strong> thao túng và tin giả, và bảo vệ lợi ích công. Các bộ quy tắc như <strong>PRSA Code of Ethics</strong> và nguyên tắc <strong>Global Alliance</strong> dẫn dắt thực hành.</p>
<div class="callout"><span class="badge">Chốt lại</span> Một chiến dịch đạt KPI bằng cách lừa dối công chúng là thất bại về chiến lược — niềm tin, chính là tài sản, đã bị tiêu. Đo lường trung thực; giao tiếp có đạo đức.</div>`,
  ]]);

const c8q = quiz('ism201-quiz-8', 'Quiz 8 — Measurement & ethics|||Quiz 8 — Đo lường & đạo đức', [
  { id: 'q1', question: 'Cấp đo lường nào cho biết ĐIỀU GÌ ĐÃ THAY ĐỔI (nhận biết, thái độ, hành vi)?', options: ['Output', 'Outtake', 'Outcome', 'Không cấp nào'], correctIndex: 2, explanation: 'Outcome = thay đổi thực ở công chúng; output chỉ là hoạt động ta làm.' },
  { id: 'q2', question: 'Theo Nguyên tắc Barcelona (AMEC), AVE (Advertising Value Equivalent) là?', options: ['Chỉ số vàng nên dùng chính', 'KHÔNG phải chỉ số hợp lệ để đo giá trị truyền thông', 'Bắt buộc trong mọi báo cáo', 'Cách đo outcome tốt nhất'], correctIndex: 1, explanation: 'Barcelona Principles bác bỏ AVE; ưu tiên outcome, minh bạch, nhất quán.' },
  { id: 'q3', question: 'Nguyên tắc đạo đức cốt lõi khi công bố quan hệ trả tiền / không tạo dư luận giả (astroturf) là?', options: ['Tốc độ', 'Minh bạch (transparency)', 'Độ phủ', 'Ngân sách'], correctIndex: 1, explanation: 'Minh bạch: công bố quan hệ trả tiền, không giả mạo dư luận cơ sở.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ISM201',
    slug: 'ism201-introduction-to-strategic-communication',
    title: 'Introduction to strategic communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ISM201.webp',
    shortDescription: 'What strategic communication is & how organisations use it — Hallahan\'s definition, value & theory, the planning process, publics & stakeholders, PESO channels, digital & crisis comms, measurement (AMEC) & ethics. Bilingual, real cases & quizzes.|||Truyền thông chiến lược là gì & tổ chức dùng nó thế nào — định nghĩa Hallahan, giá trị & lý thuyết, quy trình hoạch định, công chúng & bên liên quan, kênh PESO, truyền thông số & khủng hoảng, đo lường (AMEC) & đạo đức. Song ngữ, có case thật & quiz.',
    description: 'Môn <strong>ISM201 — Introduction to Strategic Communication</strong> (Nhập môn Truyền thông chiến lược, kỳ 1) giúp hiểu <strong>tổ chức giao tiếp có chủ đích thế nào</strong>. Từ <strong>định nghĩa &amp; bốn trụ cột</strong> (Hallahan; phân biệt PR/marketing/corporate comm) → <strong>vai trò &amp; giá trị</strong> (danh tiếng, license to operate) → <strong>lý thuyết nền</strong> (stakeholder, framing, agenda-setting, excellence) → <strong>quy trình hoạch định</strong> (RPIE, SMART, SWOT/PEST, định vị) → <strong>công chúng &amp; bên liên quan</strong> (mapping, phân khúc) → <strong>kênh tích hợp PESO</strong> → <strong>số &amp; khủng hoảng</strong> (issues, SCCT) → <strong>đo lường (AMEC) &amp; đạo đức</strong>. Bám giáo trình chuẩn quốc tế (Zerfass, Argenti, Cornelissen, Holtzhausen &amp; Zerfass), song ngữ, có ví dụ chiến dịch thật và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa & bốn trụ cột của truyền thông chiến lược; phân biệt PR/marketing/corporate comm; danh tiếng & license to operate; lý thuyết nền (stakeholder, framing, agenda-setting, excellence); quy trình RPIE/RACE, mục tiêu SMART, SWOT/PEST, định vị thông điệp; stakeholder vs public (latent/aware/active), power–interest grid, phân khúc; mô hình PESO & truyền thông nội bộ; truyền thông số, quản trị issue & khủng hoảng (SCCT); đo lường output/outcome/impact, khung AMEC & Nguyên tắc Barcelona; đạo đức nghề.',
    requirements: 'Không cần kiến thức nền chuyên ngành. Quan tâm tới truyền thông, thương hiệu, tổ chức là đủ. Tham khảo giáo trình trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Truyền thông chiến lược là gì, có chủ đích vs tình cờ, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Là gì|||Chapter 1 — What it is', description: 'Định nghĩa Hallahan, phân biệt PR/marketing/corporate, hội tụ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Vai trò & giá trị|||Chapter 2 — Role & value', description: 'Gắn với chiến lược, danh tiếng, license to operate.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lý thuyết nền|||Chapter 3 — Theories', description: 'Stakeholder, framing, agenda-setting, excellence.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hoạch định|||Chapter 4 — Planning', description: 'RPIE, SMART, SWOT/PEST, định vị thông điệp.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Công chúng & bên liên quan|||Chapter 5 — Publics & stakeholders', description: 'Stakeholder vs public, mapping, phân khúc.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kênh tích hợp PESO|||Chapter 6 — PESO channels', description: 'Paid/Earned/Shared/Owned, IMC, truyền thông nội bộ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Số & khủng hoảng|||Chapter 7 — Digital & crisis', description: 'Truyền thông số, issues management, SCCT.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & đạo đức|||Chapter 8 — Measurement & ethics', description: 'Output/outcome/impact, AMEC, Barcelona, đạo đức.', lessons: [c8, c8q] },
  ],
};
