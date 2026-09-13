/**
 * DXE291c — Digital Ecosystem: From Governance to Business (Hệ sinh thái số:
 * Từ quản trị tới kinh doanh). Ngành Chuyển đổi số FPTU, Kỳ 2. Khung 8 chương,
 * song ngữ VI+EN, ví dụ nền tảng thật (Grab/Amazon/Apple/Alibaba) + quiz.
 * Tài liệu: Parker & Van Alstyne "Platform Revolution"; Weill & Woerner
 * "What's Your Digital Business Model"; Moore "digital ecosystem"; MIT CISR; WEF.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dxe291c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách chuẩn (Platform Revolution, What’s Your Digital Business Model), MIT CISR, WEF, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DXE291c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>digital ecosystems</strong> — from platforms and network effects to data governance and digital business models — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are trusted, mostly-free references.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DXE291c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core books</h3>
<ul>
<li><em>Platform Revolution</em> — Parker, Van Alstyne &amp; Choudary (how multi-sided platforms create &amp; capture value).</li>
<li><em>What's Your Digital Business Model?</em> — Weill &amp; Woerner, MIT CISR (six digital business models &amp; the ecosystem-driver quadrant).</li>
<li><em>The Death of Competition</em> — James F. Moore (origin of the "business ecosystem" idea).</li>
</ul>
<h3>🌐 Free / official sources</h3>
<ul>
<li><a href="https://cisr.mit.edu/" target="_blank" rel="noopener">MIT CISR</a> — research briefings on digital business models &amp; ecosystems.</li>
<li><a href="https://www.weforum.org/" target="_blank" rel="noopener">World Economic Forum</a> — digital economy &amp; platform governance reports.</li>
<li><a href="https://www.oecd.org/" target="_blank" rel="noopener">OECD</a> — data governance &amp; digital policy frameworks.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what an ecosystem is, who the actors are, how platforms connect them.</li>
<li><strong>Economics</strong> — multi-sided markets, network effects, why platforms scale.</li>
<li><strong>Governance</strong> — data &amp; digital governance, standards, policy, trust.</li>
<li><strong>Business</strong> — digital business models, the governance-to-business shift, ecosystem orchestration, metrics &amp; sustainability.</li>
</ol></div>`,
    `<span class="eyebrow">DXE291c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học về <strong>hệ sinh thái số</strong> — từ nền tảng và hiệu ứng mạng tới quản trị dữ liệu và mô hình kinh doanh số — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo uy tín, đa phần miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DXE291c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><em>Platform Revolution</em> — Parker, Van Alstyne &amp; Choudary (nền tảng đa phía tạo &amp; thu giá trị thế nào).</li>
<li><em>What's Your Digital Business Model?</em> — Weill &amp; Woerner, MIT CISR (sáu mô hình kinh doanh số &amp; góc phần tư "người dẫn dắt hệ sinh thái").</li>
<li><em>The Death of Competition</em> — James F. Moore (nơi khai sinh khái niệm "hệ sinh thái kinh doanh").</li>
</ul>
<h3>🌐 Nguồn miễn phí / chính thức</h3>
<ul>
<li><a href="https://cisr.mit.edu/" target="_blank" rel="noopener">MIT CISR</a> — báo cáo về mô hình kinh doanh số &amp; hệ sinh thái.</li>
<li><a href="https://www.weforum.org/" target="_blank" rel="noopener">Diễn đàn Kinh tế Thế giới</a> — báo cáo kinh tế số &amp; quản trị nền tảng.</li>
<li><a href="https://www.oecd.org/" target="_blank" rel="noopener">OECD</a> — khung quản trị dữ liệu &amp; chính sách số.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — hệ sinh thái là gì, chủ thể gồm ai, nền tảng kết nối họ ra sao.</li>
<li><strong>Kinh tế học</strong> — thị trường đa phía, hiệu ứng mạng, vì sao nền tảng tăng quy mô.</li>
<li><strong>Quản trị</strong> — quản trị dữ liệu &amp; quản trị số, chuẩn, chính sách, niềm tin.</li>
<li><strong>Kinh doanh</strong> — mô hình kinh doanh số, chuyển từ quản trị tới kinh doanh, điều phối hệ sinh thái, đo lường &amp; bền vững.</li>
</ol></div>`,
  ]]);

const intro = doc('dxe291c-0-1-overview', 'Course overview: Digital ecosystems|||Tổng quan: Hệ sinh thái số',
  'Hệ sinh thái số là gì, vì sao "từ quản trị tới kinh doanh"; lộ trình 8 chương: nền tảng → kinh tế học nền tảng → quản trị dữ liệu → mô hình kinh doanh → chuyển đổi → công nghệ nền → hợp tác → đo lường & bền vững.',
  [[
    `<span class="eyebrow">DXE291c · Lesson 0.1 · Overview</span>
<h2>Digital ecosystems — from governance to business</h2>
<p class="lead">A <strong>digital ecosystem</strong> is a web of independent actors — companies, developers, customers, partners, regulators — that create value together around a shared <strong>digital platform</strong>. This course explains how such ecosystems are built, <strong>governed</strong>, and turned into <strong>profitable businesses</strong>.</p>
<h3>Why "governance to business"?</h3>
<p>Value in the digital economy no longer comes from one firm making one product. It comes from <strong>orchestrating many actors</strong>: setting the rules (governance) that make people trust and join, then designing the <strong>business model</strong> that captures a share of the value they create together. Grab, Amazon, Apple and Alibaba all won by doing both.</p>
<h3>Roadmap (8 chapters)</h3>
<ol>
<li>What a digital ecosystem is — actors, platform, network.</li>
<li>Platform businesses &amp; economics — multi-sided markets, network effects.</li>
<li>Data &amp; digital governance — standards, policy, trust.</li>
<li>Digital business models — value proposition, revenue models.</li>
<li>From governance to business — strategy &amp; innovation.</li>
<li>Enabling technologies — API, cloud, IoT, AI, blockchain.</li>
<li>Partnership &amp; network value — co-creation, orchestration.</li>
<li>Metrics, risk &amp; sustainability — KPIs, security, privacy, ethics.</li>
</ol>`,
    `<span class="eyebrow">DXE291c · Bài 0.1 · Tổng quan</span>
<h2>Hệ sinh thái số — từ quản trị tới kinh doanh</h2>
<p class="lead">Một <strong>hệ sinh thái số</strong> là mạng lưới các chủ thể độc lập — doanh nghiệp, lập trình viên, khách hàng, đối tác, cơ quan quản lý — cùng tạo giá trị quanh một <strong>nền tảng số</strong> chung. Môn này giải thích các hệ sinh thái đó được dựng, <strong>quản trị</strong>, và biến thành <strong>doanh nghiệp sinh lời</strong> thế nào.</p>
<h3>Vì sao "quản trị tới kinh doanh"?</h3>
<p>Giá trị trong kinh tế số không còn đến từ một công ty làm một sản phẩm. Nó đến từ việc <strong>điều phối nhiều chủ thể</strong>: đặt ra luật chơi (quản trị) để mọi người tin và tham gia, rồi thiết kế <strong>mô hình kinh doanh</strong> thu về một phần giá trị họ cùng tạo. Grab, Amazon, Apple và Alibaba đều thắng nhờ làm cả hai.</p>
<h3>Lộ trình (8 chương)</h3>
<ol>
<li>Hệ sinh thái số là gì — chủ thể, nền tảng, mạng lưới.</li>
<li>Nền tảng &amp; kinh tế học — thị trường đa phía, hiệu ứng mạng.</li>
<li>Quản trị dữ liệu &amp; quản trị số — chuẩn, chính sách, niềm tin.</li>
<li>Mô hình kinh doanh số — đề xuất giá trị, mô hình doanh thu.</li>
<li>Từ quản trị tới kinh doanh — chiến lược &amp; đổi mới.</li>
<li>Công nghệ nền — API, cloud, IoT, AI, blockchain.</li>
<li>Hợp tác &amp; giá trị mạng lưới — đồng kiến tạo, điều phối.</li>
<li>Đo lường, rủi ro &amp; bền vững — KPI, an ninh, quyền riêng tư, đạo đức.</li>
</ol>`,
  ]]);

const c1 = doc('dxe291c-1-1-ecosystem', '1.1 — What is a digital ecosystem?|||1.1 — Hệ sinh thái số là gì?',
  'Định nghĩa hệ sinh thái số; các chủ thể (actors), nền tảng (platform), mạng lưới (network); phân biệt với chuỗi giá trị tuyến tính; ví dụ Grab.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 1 · Lesson 1.1</span>
<h2>What is a digital ecosystem?</h2>
<p>Borrowing from biology, James Moore called a business ecosystem a community of organizations that <em>co-evolve</em>. A <strong>digital ecosystem</strong> is that community connected through a <strong>digital platform</strong>: software and data infrastructure that lets many independent parties interact at scale.</p>
<h3>The building blocks</h3>
<ul>
<li><strong>Actors</strong> — the participants: producers (drivers, sellers, developers), consumers, the platform owner, and complementors &amp; regulators around them.</li>
<li><strong>Platform</strong> — the shared infrastructure and rules that connect actors and enable transactions.</li>
<li><strong>Network</strong> — the web of relationships; value grows as more actors join and interact.</li>
</ul>
<h3>Linear chain vs ecosystem</h3>
<p>A <strong>traditional value chain</strong> is linear: supplier → factory → distributor → customer, value added step by step. An <strong>ecosystem</strong> is a <em>network</em>: the platform matches many producers with many consumers directly, and value is <strong>co-created</strong> by the participants, not manufactured by one firm.</p>
<div class="callout"><span class="badge">Example · Grab</span> Grab owns almost no cars. It is a platform whose actors — drivers, riders, restaurants, payment partners — create the value; Grab governs the matching, trust and payments that let them transact.</div>`,
    `<span class="eyebrow">DXE291c · Chương 1 · Bài 1.1</span>
<h2>Hệ sinh thái số là gì?</h2>
<p>Mượn từ sinh học, James Moore gọi hệ sinh thái kinh doanh là cộng đồng các tổ chức cùng <em>tiến hoá</em>. Một <strong>hệ sinh thái số</strong> là cộng đồng đó được kết nối qua một <strong>nền tảng số</strong>: hạ tầng phần mềm và dữ liệu cho phép nhiều bên độc lập tương tác ở quy mô lớn.</p>
<h3>Các khối cấu thành</h3>
<ul>
<li><strong>Chủ thể (actors)</strong> — người tham gia: bên cung (tài xế, người bán, lập trình viên), bên cầu, chủ nền tảng, cùng các bên bổ trợ &amp; cơ quan quản lý xung quanh.</li>
<li><strong>Nền tảng (platform)</strong> — hạ tầng &amp; luật chơi chung kết nối các chủ thể và cho phép giao dịch.</li>
<li><strong>Mạng lưới (network)</strong> — mạng quan hệ; giá trị lớn lên khi càng nhiều chủ thể tham gia và tương tác.</li>
</ul>
<h3>Chuỗi tuyến tính vs hệ sinh thái</h3>
<p>Một <strong>chuỗi giá trị truyền thống</strong> đi tuyến tính: nhà cung cấp → nhà máy → phân phối → khách hàng, giá trị cộng dồn từng bước. Một <strong>hệ sinh thái</strong> là một <em>mạng lưới</em>: nền tảng ghép nhiều bên cung với nhiều bên cầu trực tiếp, và giá trị được <strong>đồng kiến tạo</strong> bởi người tham gia, chứ không do một công ty sản xuất ra.</p>
<div class="callout"><span class="badge">Ví dụ · Grab</span> Grab gần như không sở hữu chiếc xe nào. Nó là nền tảng mà các chủ thể — tài xế, khách, quán ăn, đối tác thanh toán — mới là bên tạo giá trị; Grab quản trị việc ghép nối, niềm tin và thanh toán để họ giao dịch được.</div>`,
  ]]);

const c1q = quiz('dxe291c-quiz-1', 'Quiz 1 — Digital ecosystem|||Quiz 1 — Hệ sinh thái số', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa hệ sinh thái số và chuỗi giá trị tuyến tính?', options: ['Hệ sinh thái không dùng phần mềm', 'Hệ sinh thái là mạng lưới đồng kiến tạo, chuỗi là tuyến tính từng bước', 'Chuỗi tuyến tính không có khách hàng', 'Không có khác biệt'], correctIndex: 1, explanation: 'Hệ sinh thái ghép nhiều bên trực tiếp và đồng kiến tạo giá trị; chuỗi cộng dồn giá trị tuyến tính.' },
  { id: 'q2', question: 'Trong hệ sinh thái số, "nền tảng (platform)" là gì?', options: ['Một sản phẩm vật lý duy nhất', 'Hạ tầng & luật chơi chung kết nối các chủ thể', 'Tên gọi khác của khách hàng', 'Một loại phần cứng'], correctIndex: 1, explanation: 'Platform là hạ tầng phần mềm/dữ liệu và luật chơi cho phép các chủ thể giao dịch.' },
  { id: 'q3', question: 'Vì sao Grab được xem là ví dụ hệ sinh thái số?', options: ['Vì sở hữu toàn bộ đội xe', 'Vì tự sản xuất mọi giá trị', 'Vì là nền tảng để tài xế, khách, quán ăn cùng tạo giá trị', 'Vì không dùng dữ liệu'], correctIndex: 2, explanation: 'Grab điều phối nhiều chủ thể độc lập cùng tạo giá trị, không tự sản xuất.' },
]);

const c2 = doc('dxe291c-2-1-platform', '2.1 — Platform businesses & economics|||2.1 — Nền tảng số & mô hình kinh tế',
  'Nền tảng đa phía (multi-sided market), hiệu ứng mạng (network effect) cùng/khác phía, vòng bay (flywheel), bài toán "con gà quả trứng"; ví dụ Amazon Marketplace.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 2 · Lesson 2.1</span>
<h2>Platform businesses &amp; economics</h2>
<h3>Multi-sided markets</h3>
<p>A <strong>platform</strong> serves two or more groups that need each other — a <strong>multi-sided market</strong>. Amazon Marketplace connects <em>buyers</em> and <em>third-party sellers</em>; the App Store connects <em>developers</em> and <em>users</em>. The platform's job is to reduce friction and build trust between the sides.</p>
<h3>Network effects</h3>
<ul>
<li><strong>Same-side (direct):</strong> more users make the product better for other users (e.g. a social network).</li>
<li><strong>Cross-side (indirect):</strong> more of one side attracts the other — more sellers bring more buyers, which brings still more sellers.</li>
</ul>
<p>Positive cross-side effects create a <strong>flywheel</strong>: growth feeds growth. This is why platforms can scale far faster than linear businesses — and why the leader often takes most of the market.</p>
<h3>The chicken-and-egg problem</h3>
<p>Early on, neither side wants to join before the other exists. Platforms solve this by subsidizing one side, seeding supply, or starting in a narrow niche.</p>
<div class="callout"><span class="badge">Example · Amazon</span> Amazon opened its store to third-party sellers: more sellers → wider selection → more buyers → more sellers. That cross-side flywheel now drives over half of Amazon's units sold.</div>`,
    `<span class="eyebrow">DXE291c · Chương 2 · Bài 2.1</span>
<h2>Nền tảng số &amp; mô hình kinh tế</h2>
<h3>Thị trường đa phía</h3>
<p>Một <strong>nền tảng</strong> phục vụ hai nhóm trở lên cần đến nhau — một <strong>thị trường đa phía</strong>. Amazon Marketplace kết nối <em>người mua</em> và <em>người bán bên thứ ba</em>; App Store kết nối <em>lập trình viên</em> và <em>người dùng</em>. Việc của nền tảng là giảm ma sát và tạo niềm tin giữa các phía.</p>
<h3>Hiệu ứng mạng</h3>
<ul>
<li><strong>Cùng phía (trực tiếp):</strong> càng nhiều người dùng thì sản phẩm càng tốt cho người dùng khác (vd mạng xã hội).</li>
<li><strong>Khác phía (gián tiếp):</strong> một phía đông lên thì hút phía kia — nhiều người bán kéo nhiều người mua, rồi lại kéo thêm người bán.</li>
</ul>
<p>Hiệu ứng khác phía dương tạo ra một <strong>vòng bay (flywheel)</strong>: tăng trưởng nuôi tăng trưởng. Đó là lý do nền tảng tăng quy mô nhanh hơn hẳn doanh nghiệp tuyến tính — và người dẫn đầu thường chiếm phần lớn thị trường.</p>
<h3>Bài toán "con gà quả trứng"</h3>
<p>Buổi đầu, chưa phía nào muốn vào trước khi phía kia tồn tại. Nền tảng gỡ bằng cách trợ giá một phía, gieo mầm nguồn cung, hoặc khởi đầu ở một ngách hẹp.</p>
<div class="callout"><span class="badge">Ví dụ · Amazon</span> Amazon mở cửa hàng cho người bán bên thứ ba: nhiều người bán → nhiều lựa chọn → nhiều người mua → nhiều người bán. Vòng bay khác phía đó nay chiếm hơn một nửa số đơn vị hàng bán ra của Amazon.</div>`,
  ]]);

const c2q = quiz('dxe291c-quiz-2', 'Quiz 2 — Platform economics|||Quiz 2 — Kinh tế học nền tảng', [
  { id: 'q1', question: 'Thị trường đa phía (multi-sided market) là?', options: ['Thị trường chỉ có một loại khách', 'Nền tảng phục vụ hai nhóm trở lên cần đến nhau', 'Cửa hàng vật lý', 'Một loại hợp đồng'], correctIndex: 1, explanation: 'Nền tảng kết nối hai hay nhiều nhóm cần nhau (vd người mua và người bán).' },
  { id: 'q2', question: 'Hiệu ứng mạng "khác phía" (cross-side) nghĩa là?', options: ['Nhiều người dùng làm sản phẩm tệ đi', 'Một phía đông lên thì hút phía kia', 'Không liên quan số lượng người dùng', 'Chỉ áp dụng cho phần cứng'], correctIndex: 1, explanation: 'Nhiều người bán kéo nhiều người mua và ngược lại — vòng bay khác phía.' },
  { id: 'q3', question: 'Bài toán "con gà quả trứng" của nền tảng được giải bằng cách?', options: ['Bỏ mặc thị trường tự lớn', 'Trợ giá một phía, gieo nguồn cung hoặc khởi đầu ở ngách hẹp', 'Tăng giá cả hai phía', 'Đóng cửa với người bán'], correctIndex: 1, explanation: 'Cần kích một phía trước để phá thế chưa phía nào muốn vào trước.' },
]);

const c3 = doc('dxe291c-3-1-governance', '3.1 — Data & digital governance|||3.1 — Quản trị số & dữ liệu',
  'Data governance (chất lượng, chủ sở hữu, vòng đời dữ liệu), digital governance (vai trò quyết định, chuẩn, chính sách, tuân thủ), niềm tin & luật chơi nền tảng; ví dụ Apple App Store.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 3 · Lesson 3.1</span>
<h2>Data &amp; digital governance</h2>
<h3>Data governance</h3>
<p><strong>Data governance</strong> is the set of policies and roles that keep data trustworthy across its lifecycle: <em>ownership</em> (who is accountable), <em>quality</em> (accurate, complete), <em>lifecycle</em> (create → store → use → archive → delete), and <em>compliance</em> (privacy laws like GDPR). Bad data governance quietly poisons every decision and model built on top.</p>
<h3>Digital governance</h3>
<p><strong>Digital governance</strong> is broader: <em>who decides what</em> across the digital estate — the rules, standards and accountability for platforms, APIs, security and partner behaviour. In an ecosystem, governance is also the <strong>rulebook for participants</strong>: what developers may build, how disputes are resolved, what data can be shared.</p>
<h3>Governance builds trust</h3>
<p>Actors only join a platform they trust. Clear rules, consistent enforcement and data protection are what make thousands of independent parties willing to transact through one intermediary.</p>
<div class="callout"><span class="badge">Example · Apple App Store</span> Apple's review guidelines, privacy rules and security requirements are governance. They frustrate some developers, but they are also why users trust the store enough to install millions of third-party apps.</div>`,
    `<span class="eyebrow">DXE291c · Chương 3 · Bài 3.1</span>
<h2>Quản trị số &amp; dữ liệu</h2>
<h3>Quản trị dữ liệu (data governance)</h3>
<p><strong>Quản trị dữ liệu</strong> là tập chính sách và vai trò giữ cho dữ liệu đáng tin suốt vòng đời: <em>chủ sở hữu</em> (ai chịu trách nhiệm), <em>chất lượng</em> (chính xác, đầy đủ), <em>vòng đời</em> (tạo → lưu → dùng → lưu trữ → xoá), và <em>tuân thủ</em> (luật quyền riêng tư như GDPR). Quản trị dữ liệu kém âm thầm đầu độc mọi quyết định và mô hình dựng trên nó.</p>
<h3>Quản trị số (digital governance)</h3>
<p><strong>Quản trị số</strong> rộng hơn: <em>ai quyết định điều gì</em> trên toàn bộ hạ tầng số — luật, chuẩn và trách nhiệm cho nền tảng, API, an ninh và hành vi đối tác. Trong hệ sinh thái, quản trị còn là <strong>luật chơi cho người tham gia</strong>: lập trình viên được xây gì, tranh chấp xử ra sao, dữ liệu nào được chia sẻ.</p>
<h3>Quản trị tạo niềm tin</h3>
<p>Chủ thể chỉ tham gia nền tảng mà họ tin. Luật rõ ràng, thực thi nhất quán và bảo vệ dữ liệu chính là thứ khiến hàng nghìn bên độc lập sẵn lòng giao dịch qua một trung gian.</p>
<div class="callout"><span class="badge">Ví dụ · Apple App Store</span> Bộ quy tắc duyệt, luật riêng tư và yêu cầu an ninh của Apple chính là quản trị. Chúng làm một số lập trình viên khó chịu, nhưng cũng là lý do người dùng đủ tin để cài hàng triệu ứng dụng bên thứ ba.</div>`,
  ]]);

const c3q = quiz('dxe291c-quiz-3', 'Quiz 3 — Governance|||Quiz 3 — Quản trị số & dữ liệu', [
  { id: 'q1', question: 'Quản trị dữ liệu (data governance) tập trung vào?', options: ['Màu sắc giao diện', 'Chủ sở hữu, chất lượng, vòng đời và tuân thủ của dữ liệu', 'Giá cổ phiếu', 'Thiết kế logo'], correctIndex: 1, explanation: 'Data governance giữ dữ liệu đáng tin suốt vòng đời và tuân thủ luật.' },
  { id: 'q2', question: 'Khác biệt giữa "digital governance" và "data governance"?', options: ['Chúng giống hệt nhau', 'Digital governance rộng hơn: luật/chuẩn/trách nhiệm cho cả nền tảng, API, an ninh', 'Data governance rộng hơn digital governance', 'Không cái nào liên quan dữ liệu'], correctIndex: 1, explanation: 'Digital governance bao trùm toàn hạ tầng số; data governance là phần về dữ liệu.' },
  { id: 'q3', question: 'Vì sao quản trị tốt lại quan trọng với hệ sinh thái?', options: ['Vì làm nền tảng chậm đi', 'Vì tạo niềm tin để các bên độc lập sẵn lòng giao dịch', 'Vì loại bỏ mọi lập trình viên', 'Vì không cần thiết'], correctIndex: 1, explanation: 'Luật rõ, thực thi nhất quán và bảo vệ dữ liệu tạo niềm tin — điều kiện để hệ sinh thái vận hành.' },
]);

const c4 = doc('dxe291c-4-1-business-model', '4.1 — Digital business models|||4.1 — Mô hình kinh doanh số',
  'Đề xuất giá trị (value proposition), mô hình doanh thu (hoa hồng, đăng ký, quảng cáo, freemium, dữ liệu); sáu mô hình số của Weill & Woerner; ví dụ Alibaba.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 4 · Lesson 4.1</span>
<h2>Digital business models</h2>
<h3>Value proposition</h3>
<p>A <strong>business model</strong> answers three questions: what <strong>value</strong> do we offer, to <strong>whom</strong>, and how do we <strong>capture</strong> part of it? In an ecosystem the value proposition is usually <em>access and matching</em>: connecting the right producer to the right consumer, with trust and convenience built in.</p>
<h3>Revenue models</h3>
<ul>
<li><strong>Commission / take rate</strong> — a cut of each transaction (Grab, marketplaces).</li>
<li><strong>Subscription</strong> — recurring fee for access (SaaS, Prime).</li>
<li><strong>Advertising</strong> — monetize attention &amp; data.</li>
<li><strong>Freemium</strong> — free core, paid upgrades.</li>
<li><strong>Data / API</strong> — sell insights or programmatic access.</li>
</ul>
<h3>Weill &amp; Woerner: four ways to compete</h3>
<p>MIT CISR maps firms on two axes — how much they <em>know their end customer</em> and how much they operate as a <em>value chain vs an ecosystem</em>. The most valuable quadrant is the <strong>ecosystem driver</strong>: a firm that owns the customer relationship <em>and</em> orchestrates a platform of partners.</p>
<div class="callout"><span class="badge">Example · Alibaba</span> Alibaba stacks several models — marketplace commissions (Taobao/Tmall), advertising, cloud subscriptions (Alibaba Cloud) and fintech (Alipay) — an ecosystem driver capturing value at many points.</div>`,
    `<span class="eyebrow">DXE291c · Chương 4 · Bài 4.1</span>
<h2>Mô hình kinh doanh số</h2>
<h3>Đề xuất giá trị</h3>
<p>Một <strong>mô hình kinh doanh</strong> trả lời ba câu: ta trao <strong>giá trị</strong> gì, cho <strong>ai</strong>, và <strong>thu</strong> lại một phần bằng cách nào? Trong hệ sinh thái, đề xuất giá trị thường là <em>truy cập và ghép nối</em>: nối đúng bên cung với đúng bên cầu, kèm niềm tin và tiện lợi.</p>
<h3>Mô hình doanh thu</h3>
<ul>
<li><strong>Hoa hồng / take rate</strong> — cắt phần trăm mỗi giao dịch (Grab, sàn TMĐT).</li>
<li><strong>Đăng ký (subscription)</strong> — phí định kỳ để dùng (SaaS, Prime).</li>
<li><strong>Quảng cáo</strong> — kiếm tiền từ sự chú ý &amp; dữ liệu.</li>
<li><strong>Freemium</strong> — lõi miễn phí, nâng cấp trả phí.</li>
<li><strong>Dữ liệu / API</strong> — bán insight hoặc quyền truy cập lập trình.</li>
</ul>
<h3>Weill &amp; Woerner: bốn cách cạnh tranh</h3>
<p>MIT CISR đặt doanh nghiệp trên hai trục — mức độ <em>hiểu khách hàng cuối</em> và mức độ vận hành như <em>chuỗi giá trị hay hệ sinh thái</em>. Góc phần tư giá trị nhất là <strong>người dẫn dắt hệ sinh thái</strong>: vừa sở hữu quan hệ khách hàng <em>vừa</em> điều phối một nền tảng đối tác.</p>
<div class="callout"><span class="badge">Ví dụ · Alibaba</span> Alibaba xếp chồng nhiều mô hình — hoa hồng sàn (Taobao/Tmall), quảng cáo, đăng ký đám mây (Alibaba Cloud) và fintech (Alipay) — một người dẫn dắt hệ sinh thái thu giá trị ở nhiều điểm.</div>`,
  ]]);

const c4q = quiz('dxe291c-quiz-4', 'Quiz 4 — Business models|||Quiz 4 — Mô hình kinh doanh số', [
  { id: 'q1', question: 'Mô hình doanh thu "hoa hồng / take rate" là?', options: ['Phí định kỳ hằng tháng', 'Cắt một phần trăm trên mỗi giao dịch', 'Bán quảng cáo', 'Cho không hoàn toàn'], correctIndex: 1, explanation: 'Take rate cắt phần trăm mỗi giao dịch — điển hình của sàn và Grab.' },
  { id: 'q2', question: 'Theo Weill & Woerner, góc phần tư giá trị nhất là?', options: ['Nhà cung cấp (supplier)', 'Người dẫn dắt hệ sinh thái (ecosystem driver)', 'Nhà máy tuyến tính', 'Đại lý bán lẻ'], correctIndex: 1, explanation: 'Ecosystem driver vừa sở hữu quan hệ khách hàng vừa điều phối nền tảng đối tác.' },
  { id: 'q3', question: 'Vì sao Alibaba là ví dụ mô hình kinh doanh số phức hợp?', options: ['Chỉ có một nguồn doanh thu', 'Xếp chồng nhiều mô hình: hoa hồng, quảng cáo, cloud, fintech', 'Không dùng nền tảng', 'Chỉ bán một sản phẩm'], correctIndex: 1, explanation: 'Alibaba thu giá trị ở nhiều điểm qua nhiều mô hình chồng lên nhau.' },
]);

const c5 = doc('dxe291c-5-1-transformation', '5.1 — From governance to business|||5.1 — Chuyển từ quản trị tới kinh doanh',
  'Chiến lược chuyển đổi số, biến năng lực quản trị/dữ liệu thành sản phẩm & doanh thu, đổi mới mô hình (business model innovation), mở API thành kinh doanh; ví dụ Amazon → AWS.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 5 · Lesson 5.1</span>
<h2>From governance to business</h2>
<p>The heart of this course: how internal <strong>governance and capability</strong> become an external <strong>business</strong>. Firms that master data, standards and platform operations for their own needs can turn those capabilities into products others will pay for.</p>
<h3>Strategy of the shift</h3>
<ul>
<li><strong>Build capability</strong> — governed data, reliable infrastructure, clear standards.</li>
<li><strong>Productize it</strong> — expose the capability as a service or an open API.</li>
<li><strong>Open the ecosystem</strong> — let partners and developers build on top, then capture a share.</li>
</ul>
<h3>Business model innovation</h3>
<p>Digital transformation is rarely just "add technology". The winners <strong>re-invent how they create and capture value</strong> — moving from selling a product to running a platform, from one-off sales to recurring relationships, from closed to open.</p>
<div class="callout"><span class="badge">Example · Amazon → AWS</span> Amazon built cloud infrastructure to run its own store reliably (governance &amp; capability). It then <em>productized</em> that capability as <strong>AWS</strong> — now a huge, high-margin business. Internal governance became an external ecosystem.</div>`,
    `<span class="eyebrow">DXE291c · Chương 5 · Bài 5.1</span>
<h2>Chuyển từ quản trị tới kinh doanh</h2>
<p>Trái tim của môn học: <strong>năng lực và quản trị</strong> bên trong trở thành <strong>kinh doanh</strong> bên ngoài thế nào. Doanh nghiệp làm chủ dữ liệu, chuẩn và vận hành nền tảng cho nhu cầu của chính mình có thể biến các năng lực đó thành sản phẩm người khác trả tiền.</p>
<h3>Chiến lược của bước chuyển</h3>
<ul>
<li><strong>Dựng năng lực</strong> — dữ liệu được quản trị, hạ tầng tin cậy, chuẩn rõ ràng.</li>
<li><strong>Sản phẩm hoá</strong> — mở năng lực đó thành dịch vụ hoặc API mở.</li>
<li><strong>Mở hệ sinh thái</strong> — cho đối tác và lập trình viên xây lên trên, rồi thu một phần giá trị.</li>
</ul>
<h3>Đổi mới mô hình kinh doanh</h3>
<p>Chuyển đổi số hiếm khi chỉ là "thêm công nghệ". Bên thắng <strong>làm lại cách tạo và thu giá trị</strong> — từ bán sản phẩm sang vận hành nền tảng, từ bán một lần sang quan hệ định kỳ, từ đóng sang mở.</p>
<div class="callout"><span class="badge">Ví dụ · Amazon → AWS</span> Amazon dựng hạ tầng đám mây để chạy cửa hàng của chính mình cho ổn định (quản trị &amp; năng lực). Sau đó nó <em>sản phẩm hoá</em> năng lực ấy thành <strong>AWS</strong> — nay là mảng kinh doanh khổng lồ, biên lợi nhuận cao. Quản trị nội bộ đã thành hệ sinh thái bên ngoài.</div>`,
  ]]);

const c5q = quiz('dxe291c-quiz-5', 'Quiz 5 — Governance to business|||Quiz 5 — Quản trị tới kinh doanh', [
  { id: 'q1', question: 'Ý cốt lõi của "từ quản trị tới kinh doanh" là?', options: ['Bỏ hết quản trị đi', 'Biến năng lực & quản trị nội bộ thành sản phẩm/dịch vụ có doanh thu', 'Chỉ tập trung bán một sản phẩm', 'Ngừng dùng dữ liệu'], correctIndex: 1, explanation: 'Năng lực và quản trị bên trong được sản phẩm hoá thành kinh doanh bên ngoài.' },
  { id: 'q2', question: 'Ví dụ Amazon → AWS minh hoạ điều gì?', options: ['Quản trị nội bộ được sản phẩm hoá thành dịch vụ đám mây', 'Amazon rời bỏ thương mại điện tử', 'AWS là một cửa hàng bán lẻ', 'Không liên quan năng lực nội bộ'], correctIndex: 0, explanation: 'Hạ tầng dựng cho nhu cầu nội bộ được mở thành AWS — một hệ sinh thái kinh doanh.' },
  { id: 'q3', question: 'Đổi mới mô hình kinh doanh trong chuyển đổi số thường là?', options: ['Chỉ mua thêm máy chủ', 'Làm lại cách tạo & thu giá trị (từ sản phẩm sang nền tảng, đóng sang mở)', 'Giữ nguyên mọi thứ', 'Chỉ đổi logo'], correctIndex: 1, explanation: 'Chuyển đổi số thực chất là tái thiết kế cách tạo và thu giá trị, không chỉ thêm công nghệ.' },
]);

const c6 = doc('dxe291c-6-1-technology', '6.1 — Enabling technologies|||6.1 — Công nghệ nền của hệ sinh thái',
  'API (kết nối & mở nền tảng), cloud (mở rộng theo nhu cầu), IoT (thu dữ liệu thực), AI (cá nhân hoá & tự động), blockchain (tin cậy phi tập trung) trong hệ sinh thái số.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 6 · Lesson 6.1</span>
<h2>Enabling technologies</h2>
<p>Ecosystems run on a stack of technologies. None is magic alone; together they let a platform connect actors, scale, learn and stay trustworthy.</p>
<ul>
<li><strong>API</strong> — the connective tissue. Open, documented APIs let partners and developers plug into the platform. APIs turn a product into an ecosystem.</li>
<li><strong>Cloud</strong> — elastic infrastructure that scales up and down on demand, so a platform can serve millions without owning data centres.</li>
<li><strong>IoT</strong> — sensors and connected devices that feed real-world data (location, usage, condition) into the ecosystem.</li>
<li><strong>AI</strong> — turns that data into matching, recommendations, pricing, fraud detection and automation.</li>
<li><strong>Blockchain</strong> — a shared, tamper-evident ledger that can create trust between parties <em>without</em> a central intermediary — useful for provenance, payments and smart contracts.</li>
</ul>
<div class="callout"><span class="badge">Example · Grab stack</span> Grab combines <strong>APIs</strong> (partner integrations), <strong>cloud</strong> (scale), <strong>GPS/IoT</strong> (real-time location), and <strong>AI</strong> (matching drivers, ETA, dynamic pricing, fraud) — the technology stack that makes the ecosystem work.</div>`,
    `<span class="eyebrow">DXE291c · Chương 6 · Bài 6.1</span>
<h2>Công nghệ nền của hệ sinh thái</h2>
<p>Hệ sinh thái chạy trên một chồng công nghệ. Không cái nào tự thân là phép màu; cùng nhau chúng cho phép nền tảng kết nối chủ thể, mở rộng, học và giữ được niềm tin.</p>
<ul>
<li><strong>API</strong> — mô liên kết. API mở, có tài liệu cho phép đối tác và lập trình viên cắm vào nền tảng. API biến một sản phẩm thành hệ sinh thái.</li>
<li><strong>Cloud</strong> — hạ tầng co giãn, mở rộng/thu hẹp theo nhu cầu, để nền tảng phục vụ hàng triệu người mà không cần sở hữu trung tâm dữ liệu.</li>
<li><strong>IoT</strong> — cảm biến và thiết bị kết nối đưa dữ liệu đời thực (vị trí, mức dùng, tình trạng) vào hệ sinh thái.</li>
<li><strong>AI</strong> — biến dữ liệu đó thành ghép nối, gợi ý, định giá, phát hiện gian lận và tự động hoá.</li>
<li><strong>Blockchain</strong> — sổ cái chung, khó sửa, có thể tạo niềm tin giữa các bên <em>mà không</em> cần trung gian tập trung — hữu ích cho truy xuất nguồn gốc, thanh toán và hợp đồng thông minh.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ · Chồng công nghệ Grab</span> Grab kết hợp <strong>API</strong> (tích hợp đối tác), <strong>cloud</strong> (quy mô), <strong>GPS/IoT</strong> (vị trí thời gian thực) và <strong>AI</strong> (ghép tài xế, ETA, định giá động, chống gian lận) — chồng công nghệ khiến hệ sinh thái vận hành.</div>`,
  ]]);

const c6q = quiz('dxe291c-quiz-6', 'Quiz 6 — Enabling tech|||Quiz 6 — Công nghệ nền', [
  { id: 'q1', question: 'Vì sao API được gọi là "mô liên kết" của hệ sinh thái?', options: ['Vì nó lưu trữ dữ liệu vĩnh viễn', 'Vì cho đối tác & lập trình viên cắm vào nền tảng, biến sản phẩm thành hệ sinh thái', 'Vì nó thay thế cloud', 'Vì nó là phần cứng'], correctIndex: 1, explanation: 'API mở cho phép bên ngoài kết nối và xây trên nền tảng.' },
  { id: 'q2', question: 'Vai trò của blockchain trong hệ sinh thái số?', options: ['Tăng tốc GPS', 'Tạo niềm tin giữa các bên mà không cần trung gian tập trung', 'Thay thế toàn bộ AI', 'Chỉ để đào coin'], correctIndex: 1, explanation: 'Sổ cái chung khó sửa tạo tin cậy phi tập trung (nguồn gốc, thanh toán, hợp đồng thông minh).' },
  { id: 'q3', question: 'Trong chồng công nghệ của Grab, AI chủ yếu làm gì?', options: ['Sở hữu xe', 'Ghép tài xế, tính ETA, định giá động, chống gian lận', 'Thay thế API', 'In hoá đơn giấy'], correctIndex: 1, explanation: 'AI biến dữ liệu thành ghép nối, dự đoán và tự động hoá quyết định.' },
]);

const c7 = doc('dxe291c-7-1-partnership', '7.1 — Partnership & network value|||7.1 — Hợp tác & giá trị mạng lưới',
  'Đối tác & bổ trợ (complementors), đồng kiến tạo (co-creation), điều phối hệ sinh thái (orchestration), cân bằng mở/kiểm soát, chia sẻ giá trị công bằng; ví dụ Apple + nhà phát triển.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 7 · Lesson 7.1</span>
<h2>Partnership &amp; network value</h2>
<h3>Complementors &amp; co-creation</h3>
<p>A platform is only as valuable as what others build on it. <strong>Complementors</strong> — app developers, sellers, service partners — add products and services that make the core more useful. Value is <strong>co-created</strong>: the platform provides reach and rules, partners provide variety and innovation.</p>
<h3>Ecosystem orchestration</h3>
<p>The platform owner is an <strong>orchestrator</strong>, not just an operator. Orchestration means: attracting the right partners, aligning their incentives, setting standards, and resolving conflicts — steering a system it does not fully control.</p>
<h3>The openness dilemma</h3>
<p>Too <em>closed</em> and partners have no room to innovate; too <em>open</em> and quality, trust and the owner's own revenue suffer. Great ecosystems find a balance and <strong>share value fairly</strong> — partners must earn enough to keep investing.</p>
<div class="callout"><span class="badge">Example · Apple + developers</span> Apple provides the iPhone, App Store, tools and a billion customers; developers provide the apps. Both co-create value. The revenue split and rules are constantly negotiated — the classic tension between platform control and partner incentive.</div>`,
    `<span class="eyebrow">DXE291c · Chương 7 · Bài 7.1</span>
<h2>Hợp tác &amp; giá trị mạng lưới</h2>
<h3>Bên bổ trợ &amp; đồng kiến tạo</h3>
<p>Một nền tảng chỉ giá trị bằng những gì người khác xây trên nó. <strong>Bên bổ trợ (complementors)</strong> — lập trình viên, người bán, đối tác dịch vụ — thêm sản phẩm và dịch vụ làm phần lõi hữu ích hơn. Giá trị được <strong>đồng kiến tạo</strong>: nền tảng cho độ phủ và luật chơi, đối tác cho sự đa dạng và đổi mới.</p>
<h3>Điều phối hệ sinh thái</h3>
<p>Chủ nền tảng là <strong>người điều phối (orchestrator)</strong>, không chỉ là người vận hành. Điều phối nghĩa là: thu hút đúng đối tác, gắn kết lợi ích của họ, đặt chuẩn, và xử lý xung đột — lèo lái một hệ thống nó không kiểm soát hoàn toàn.</p>
<h3>Thế lưỡng nan mở/đóng</h3>
<p>Quá <em>đóng</em> thì đối tác không còn chỗ đổi mới; quá <em>mở</em> thì chất lượng, niềm tin và cả doanh thu của chủ nền tảng bị tổn hại. Hệ sinh thái tốt tìm được điểm cân bằng và <strong>chia sẻ giá trị công bằng</strong> — đối tác phải kiếm đủ để còn muốn đầu tư tiếp.</p>
<div class="callout"><span class="badge">Ví dụ · Apple + nhà phát triển</span> Apple cấp iPhone, App Store, công cụ và hàng tỉ khách hàng; nhà phát triển cấp ứng dụng. Cả hai đồng kiến tạo giá trị. Tỉ lệ chia doanh thu và luật lệ luôn được thương lượng — chính là căng thẳng kinh điển giữa kiểm soát nền tảng và động lực của đối tác.</div>`,
  ]]);

const c7q = quiz('dxe291c-quiz-7', 'Quiz 7 — Partnership|||Quiz 7 — Hợp tác & mạng lưới', [
  { id: 'q1', question: '"Complementors" (bên bổ trợ) trong hệ sinh thái là?', options: ['Đối thủ cạnh tranh', 'Bên xây thêm sản phẩm/dịch vụ làm phần lõi hữu ích hơn', 'Cơ quan thuế', 'Khách hàng cuối duy nhất'], correctIndex: 1, explanation: 'Lập trình viên, người bán, đối tác dịch vụ đồng kiến tạo giá trị trên nền tảng.' },
  { id: 'q2', question: '"Điều phối hệ sinh thái" (orchestration) nghĩa là?', options: ['Kiểm soát tuyệt đối mọi đối tác', 'Thu hút đối tác, gắn kết lợi ích, đặt chuẩn, xử lý xung đột', 'Bỏ mặc các bên', 'Chỉ viết mã'], correctIndex: 1, explanation: 'Orchestrator lèo lái hệ thống mình không kiểm soát hoàn toàn bằng chuẩn và incentive.' },
  { id: 'q3', question: 'Thế lưỡng nan "mở/đóng" của nền tảng là?', options: ['Mở luôn tốt, đóng luôn xấu', 'Quá đóng thì hạn chế đổi mới, quá mở thì hại chất lượng & doanh thu', 'Không ảnh hưởng gì', 'Chỉ liên quan giá bán'], correctIndex: 1, explanation: 'Cần cân bằng độ mở và chia sẻ giá trị công bằng để đối tác còn muốn đầu tư.' },
]);

const c8 = doc('dxe291c-8-1-metrics-risk', '8.1 — Metrics, risk & sustainability|||8.1 — Đo lường, rủi ro & bền vững',
  'KPI hệ sinh thái (GMV, người dùng hoạt động, take rate, tỉ lệ giữ chân), rủi ro an ninh & quyền riêng tư, đạo đức dữ liệu & thuật toán, bền vững số; ví dụ đo lường nền tảng.',
  [[
    `<span class="eyebrow">DXE291c · Chapter 8 · Lesson 8.1</span>
<h2>Metrics, risk &amp; sustainability</h2>
<h3>Measuring an ecosystem</h3>
<p>You manage what you measure. Ecosystem KPIs go beyond revenue:</p>
<ul>
<li><strong>Scale</strong> — GMV (gross merchandise value), transactions, monthly active users on each side.</li>
<li><strong>Health</strong> — liquidity (how fast supply meets demand), match rate, retention/churn.</li>
<li><strong>Capture</strong> — take rate, contribution margin, lifetime value vs acquisition cost.</li>
</ul>
<h3>Risk</h3>
<p>Bigger networks carry bigger risks: <strong>security</strong> (a breach affects millions), <strong>privacy</strong> (misusing personal data breaks trust and law), <strong>concentration</strong> (over-dependence on one partner or dominant platform), and <strong>algorithmic bias</strong>.</p>
<h3>Ethics &amp; digital sustainability</h3>
<p><strong>Sustainability</strong> here is threefold: <em>economic</em> (partners earn enough to stay), <em>social/ethical</em> (fair, transparent, privacy-respecting) and <em>environmental</em> (energy of data centres). A durable ecosystem is one all sides <em>want</em> to keep participating in.</p>
<div class="callout"><span class="badge">Takeaway</span> Governance, business model, technology and metrics are one loop: measure the network's health, manage its risks, and keep value flowing fairly — that is how a digital ecosystem lasts.</div>`,
    `<span class="eyebrow">DXE291c · Chương 8 · Bài 8.1</span>
<h2>Đo lường, rủi ro &amp; bền vững</h2>
<h3>Đo lường một hệ sinh thái</h3>
<p>Quản được cái ta đo được. KPI hệ sinh thái vượt ra ngoài doanh thu:</p>
<ul>
<li><strong>Quy mô</strong> — GMV (tổng giá trị hàng hoá), số giao dịch, người dùng hoạt động hằng tháng ở mỗi phía.</li>
<li><strong>Sức khoẻ</strong> — tính thanh khoản (cung gặp cầu nhanh ra sao), tỉ lệ ghép, tỉ lệ giữ chân/rời bỏ.</li>
<li><strong>Thu giá trị</strong> — take rate, biên đóng góp, giá trị vòng đời so với chi phí thu hút.</li>
</ul>
<h3>Rủi ro</h3>
<p>Mạng càng lớn rủi ro càng lớn: <strong>an ninh</strong> (một vụ rò rỉ ảnh hưởng hàng triệu người), <strong>quyền riêng tư</strong> (lạm dụng dữ liệu cá nhân phá vỡ niềm tin và luật), <strong>tập trung hoá</strong> (phụ thuộc quá mức một đối tác hay nền tảng thống trị), và <strong>thiên lệch thuật toán</strong>.</p>
<h3>Đạo đức &amp; bền vững số</h3>
<p><strong>Bền vững</strong> ở đây có ba mặt: <em>kinh tế</em> (đối tác kiếm đủ để ở lại), <em>xã hội/đạo đức</em> (công bằng, minh bạch, tôn trọng riêng tư) và <em>môi trường</em> (điện năng của trung tâm dữ liệu). Một hệ sinh thái bền là hệ sinh thái mà mọi phía <em>muốn</em> tiếp tục tham gia.</p>
<div class="callout"><span class="badge">Chốt lại</span> Quản trị, mô hình kinh doanh, công nghệ và đo lường là một vòng lặp: đo sức khoẻ mạng lưới, quản rủi ro, và giữ giá trị chảy công bằng — đó là cách một hệ sinh thái số trường tồn.</div>`,
  ]]);

const c8q = quiz('dxe291c-quiz-8', 'Quiz 8 — Metrics & risk|||Quiz 8 — Đo lường & rủi ro', [
  { id: 'q1', question: 'GMV (gross merchandise value) đo điều gì?', options: ['Số nhân viên', 'Tổng giá trị hàng hoá giao dịch qua nền tảng', 'Tốc độ máy chủ', 'Số dòng mã'], correctIndex: 1, explanation: 'GMV là chỉ số quy mô: tổng giá trị hàng hoá được giao dịch.' },
  { id: 'q2', question: 'Rủi ro nào KHÔNG đặc trưng khi hệ sinh thái lớn lên?', options: ['An ninh (rò rỉ ảnh hưởng hàng triệu)', 'Quyền riêng tư & lạm dụng dữ liệu', 'Thiên lệch thuật toán', 'Máy in giấy hết mực'], correctIndex: 3, explanation: 'An ninh, quyền riêng tư và thiên lệch thuật toán là rủi ro đặc trưng của mạng lớn.' },
  { id: 'q3', question: '"Bền vững số" của hệ sinh thái gồm ba mặt nào?', options: ['Kinh tế, xã hội/đạo đức, môi trường', 'Chỉ mỗi lợi nhuận', 'Màu sắc, phông chữ, bố cục', 'Phần cứng, phần mềm, mạng'], correctIndex: 0, explanation: 'Bền vững ba mặt: đối tác kiếm đủ, công bằng/minh bạch, và tiết kiệm năng lượng.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'DXE291c',
    slug: 'dxe291c-digital-ecosystem-from-governance-to-business',
    title: 'Digital ecosystem: From Governance to Business',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DXE291c.webp',
    shortDescription: 'How a digital ecosystem works and how to run it — platforms & network effects, data governance, digital business models, from governance to business, enabling tech & network value. Real platforms: Grab, Amazon, Alibaba.|||Hệ sinh thái số vận hành và điều hành thế nào — nền tảng & hiệu ứng mạng, quản trị dữ liệu, mô hình kinh doanh số, từ quản trị tới kinh doanh, công nghệ nền & giá trị mạng lưới. Nền tảng thật: Grab, Amazon, Alibaba.',
    description: 'Môn <strong>DXE291c — Digital Ecosystem: From Governance to Business</strong> (Hệ sinh thái số: Từ quản trị tới kinh doanh, ngành Chuyển đổi số, kỳ 2) giải thích một hệ sinh thái số được dựng, <strong>quản trị</strong> và biến thành <strong>doanh nghiệp sinh lời</strong> thế nào. Từ <strong>chủ thể &amp; nền tảng</strong> → <strong>kinh tế học nền tảng</strong> (thị trường đa phía, hiệu ứng mạng) → <strong>quản trị dữ liệu &amp; quản trị số</strong> → <strong>mô hình kinh doanh số</strong> → <strong>chuyển từ quản trị tới kinh doanh</strong> → <strong>công nghệ nền</strong> (API, cloud, IoT, AI, blockchain) → <strong>hợp tác &amp; giá trị mạng lưới</strong> → <strong>đo lường, rủi ro &amp; bền vững</strong>. Bám sách chuẩn (Platform Revolution; What’s Your Digital Business Model), song ngữ, ví dụ nền tảng thật (Grab/Amazon/Apple/Alibaba), quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa hệ sinh thái số (actor/platform/network); thị trường đa phía & hiệu ứng mạng (cùng/khác phía, flywheel, con gà quả trứng); data governance & digital governance; mô hình kinh doanh số (hoa hồng, đăng ký, quảng cáo, freemium, dữ liệu) & sáu mô hình Weill-Woerner; chiến lược chuyển từ quản trị tới kinh doanh (Amazon→AWS); công nghệ nền (API, cloud, IoT, AI, blockchain); đồng kiến tạo & điều phối hệ sinh thái; KPI (GMV, take rate, giữ chân), rủi ro, đạo đức & bền vững số.',
    requirements: 'Không cần nền kỹ thuật sâu. Nên có hiểu biết cơ bản về kinh doanh và Internet. Xem điều kiện tiên quyết ngành Chuyển đổi số trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách chuẩn, MIT CISR, WEF, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hệ sinh thái số là gì, vì sao từ quản trị tới kinh doanh.', lessons: [intro] },
    { title: 'Chương 1 — Hệ sinh thái số là gì|||Chapter 1 — What is a digital ecosystem', description: 'Actor, platform, network; mạng vs chuỗi.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nền tảng & mô hình kinh tế|||Chapter 2 — Platform economics', description: 'Đa phía, hiệu ứng mạng, flywheel.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quản trị số & dữ liệu|||Chapter 3 — Data & digital governance', description: 'Data/digital governance, chuẩn, niềm tin.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô hình kinh doanh số|||Chapter 4 — Digital business models', description: 'Value proposition, doanh thu, Weill-Woerner.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Từ quản trị tới kinh doanh|||Chapter 5 — Governance to business', description: 'Chiến lược, đổi mới mô hình, Amazon→AWS.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Công nghệ nền|||Chapter 6 — Enabling technologies', description: 'API, cloud, IoT, AI, blockchain.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hợp tác & giá trị mạng lưới|||Chapter 7 — Partnership & network value', description: 'Complementor, đồng kiến tạo, điều phối.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường, rủi ro & bền vững|||Chapter 8 — Metrics, risk & sustainability', description: 'KPI, an ninh, quyền riêng tư, đạo đức, bền vững.', lessons: [c8, c8q] },
  ],
};
