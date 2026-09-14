/**
 * DTF201c — Digital Transformation in Financial Services. Giáo trình FLM
 * (syl, trích dẫn — không upload PDF): Skinner "Digital Human"; "The FINTECH
 * Book" (Chishti & Barberis); King "Bank 4.0"; báo cáo McKinsey/Deloitte về
 * fintech. 8 chương: tổng quan CĐS tài chính → fintech & disruption → số hoá
 * kênh/CX → Open Banking & API → dữ liệu/AI/tự động hoá → blockchain & tài
 * sản số → an ninh/RegTech/tuân thủ → chiến lược CĐS & quản trị thay đổi.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('dtf201c-0-1-overview', 'Course overview: Digital Transformation in Financial Services|||Tổng quan: Chuyển đổi số trong Dịch vụ tài chính',
  'CĐS là gì trong ngành tài chính; ba làn sóng ngân hàng theo Brett King (Bank 4.0); lộ trình 8 chương: tổng quan → fintech → kênh số/CX → Open Banking → dữ liệu/AI → blockchain → an ninh/RegTech → chiến lược & thay đổi.',
  [[
    `<span class="eyebrow">DTF201c · Lesson 0.1 · Overview</span>
<h2>Digital Transformation in Financial Services</h2>
<p class="lead">This course looks at how <strong>banks, insurers and fintech firms</strong> are being reshaped by digital technology — not just moving paper forms onto a screen, but rethinking channels, data, products and risk from the ground up. You will learn the vocabulary, the drivers, and the frameworks analysts and bankers actually use to talk about this shift.</p>
<h3>Three words that are not the same thing</h3>
<ul>
<li><strong>Digitization</strong> — turning analog into digital (a paper statement becomes a PDF).</li>
<li><strong>Digitalization</strong> — using digital data to change how a process works (a loan officer approves faster because data is now searchable).</li>
<li><strong>Digital transformation</strong> — using digital capability to change the <em>business model</em> itself (a bank stops being "a place you visit" and becomes a service embedded in other apps).</li>
</ul>
<h3>Brett King's three waves of banking (Bank 4.0)</h3>
<pre><code>Bank 1.0 -&gt; Bank 2.0 -&gt; Bank 3.0 -&gt; Bank 4.0
"a place"   internet    mobile app   invisible, embedded
you visit   banking     "bank in     in daily life
(branch)    (browser)   your pocket" (banking, not a bank)</code></pre>
<p>Chris Skinner's <em>Digital Human</em> pushes the same idea further: a bank should behave like a <strong>digital-first organism</strong> that lives on data and software the way a human lives on a smartphone — always-on, always-learning — not a branch network with an app bolted on.</p>
<h3>Roadmap</h3>
<p>Overview &amp; drivers → fintech &amp; disruption → digital channels &amp; customer experience → Open Banking &amp; APIs → data, AI &amp; automation → blockchain &amp; digital assets → security, RegTech &amp; compliance → strategy &amp; change management. Bilingual, with real-world cases and a quiz per chapter.</p>`,
    `<span class="eyebrow">DTF201c · Bài 0.1 · Tổng quan</span>
<h2>Chuyển đổi số trong Dịch vụ tài chính</h2>
<p class="lead">Môn này nhìn vào cách <strong>ngân hàng, công ty bảo hiểm và fintech</strong> đang bị công nghệ số định hình lại — không chỉ là đưa giấy tờ lên màn hình, mà là nghĩ lại kênh phân phối, dữ liệu, sản phẩm và rủi ro từ gốc. Bạn sẽ học từ vựng, động lực thay đổi, và các khung phân tích mà chuyên gia phân tích &amp; ngân hàng thật sự dùng để nói về sự dịch chuyển này.</p>
<h3>Ba từ nghe giống nhau nhưng khác nhau</h3>
<ul>
<li><strong>Số hoá dữ liệu (digitization)</strong> — biến analog thành số (sao kê giấy trở thành PDF).</li>
<li><strong>Số hoá quy trình (digitalization)</strong> — dùng dữ liệu số để thay đổi cách một quy trình hoạt động (nhân viên duyệt vay nhanh hơn vì dữ liệu giờ tra được).</li>
<li><strong>Chuyển đổi số (digital transformation)</strong> — dùng năng lực số để thay đổi chính <em>mô hình kinh doanh</em> (ngân hàng không còn là "nơi bạn đến" mà trở thành dịch vụ nhúng vào ứng dụng khác).</li>
</ul>
<h3>Ba làn sóng ngân hàng của Brett King (Bank 4.0)</h3>
<pre><code>Bank 1.0 -&gt; Bank 2.0 -&gt; Bank 3.0 -&gt; Bank 4.0
"một nơi"   ngân hàng   app di      vô hình, nhúng
bạn đến     qua mạng    động "ngân  vào đời sống
(chi nhánh) (trình duyệt) hàng trong (banking, không
                          túi bạn"   phải "một bank")</code></pre>
<p><em>Digital Human</em> của Chris Skinner đẩy ý tưởng này xa hơn: một ngân hàng nên hoạt động như một <strong>cơ thể số</strong> sống trên dữ liệu và phần mềm giống cách con người sống trên smartphone — luôn hoạt động, luôn học — không phải một mạng chi nhánh gắn thêm cái app.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; động lực → fintech &amp; disruption → kênh số &amp; trải nghiệm khách hàng → Open Banking &amp; API → dữ liệu, AI &amp; tự động hoá → blockchain &amp; tài sản số → an ninh, RegTech &amp; tuân thủ → chiến lược &amp; quản trị thay đổi. Song ngữ, có ví dụ thực tế và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dtf201c-1-1-tong-quan-cds-tai-chinh', '1.1 — Overview & drivers of digital transformation in finance|||1.1 — Tổng quan & động lực chuyển đổi số ngành tài chính',
  'Digitization vs digitalization vs digital transformation; áp lực thay đổi (khách hàng số, fintech, quy định, công nghệ); ba làn sóng ngân hàng King.',
  [[
    `<span class="eyebrow">DTF201c · Chapter 1 · Lesson 1.1</span>
<h2>Overview &amp; drivers of digital transformation in finance</h2>
<h3>What is being transformed</h3>
<p>Financial services digital transformation (DX) touches four layers at once: the <strong>channel</strong> (branch → app), the <strong>process</strong> (paper form → straight-through processing), the <strong>product</strong> (fixed savings account → programmable wallet), and the <strong>business model</strong> (own-everything bank → platform that plugs into partners).</p>
<h3>Four forces pushing banks to change</h3>
<ul>
<li><strong>Customer expectations</strong> — people compare their bank's app to Grab, Shopee, Netflix, not to other banks.</li>
<li><strong>Fintech &amp; Big Tech competition</strong> — narrow, fast-moving players attack one profitable slice (payments, lending) at a time.</li>
<li><strong>Regulation &amp; policy</strong> — Open Banking mandates, e-KYC rules, data-protection law push (and sometimes force) digitization.</li>
<li><strong>Enabling technology</strong> — cloud, APIs, mobile, AI make it cheap enough to actually rebuild instead of just patch.</li>
</ul>
<h3>Three waves of banking (Brett King, Bank 4.0)</h3>
<pre><code>Bank 1.0: branch-centric   - the bank IS the building
Bank 2.0: internet banking - a website bolted onto the branch model
Bank 3.0: mobile-first     - "bank in your pocket", still a destination app
Bank 4.0: invisible/embedded - banking happens INSIDE other apps
          (checkout, ride-hailing, payroll) with no separate "banking" step</code></pre>
<div class="callout"><span class="badge">Exam-core idea</span> DX is not "add an app". It is moving down this ladder: digitize a document → digitalize a process → transform the business model. Most failed "digital" projects only did step one and called it done.</div>`,
    `<span class="eyebrow">DTF201c · Chương 1 · Bài 1.1</span>
<h2>Tổng quan &amp; động lực chuyển đổi số ngành tài chính</h2>
<h3>Cái gì đang được chuyển đổi</h3>
<p>Chuyển đổi số (CĐS) dịch vụ tài chính đụng tới bốn lớp cùng lúc: <strong>kênh</strong> (chi nhánh → app), <strong>quy trình</strong> (form giấy → xử lý tự động đầu-cuối), <strong>sản phẩm</strong> (sổ tiết kiệm cố định → ví lập trình được), và <strong>mô hình kinh doanh</strong> (ngân hàng tự làm mọi thứ → nền tảng cắm được với đối tác).</p>
<h3>Bốn lực đẩy ngân hàng phải thay đổi</h3>
<ul>
<li><strong>Kỳ vọng khách hàng</strong> — người dùng so app ngân hàng với Grab, Shopee, Netflix, không so với ngân hàng khác.</li>
<li><strong>Cạnh tranh từ fintech &amp; Big Tech</strong> — đối thủ hẹp, nhanh, đánh đúng một lát cắt sinh lời (thanh toán, cho vay) mỗi lần.</li>
<li><strong>Quy định &amp; chính sách</strong> — yêu cầu Open Banking, quy định eKYC, luật bảo vệ dữ liệu thúc đẩy (đôi khi bắt buộc) số hoá.</li>
<li><strong>Công nghệ nền</strong> — cloud, API, mobile, AI làm chi phí đủ rẻ để thật sự xây lại chứ không chỉ vá.</li>
</ul>
<h3>Ba làn sóng ngân hàng (Brett King, Bank 4.0)</h3>
<pre><code>Bank 1.0: lấy chi nhánh làm trung tâm - ngân hàng LÀ tòa nhà đó
Bank 2.0: ngân hàng qua internet     - một website gắn thêm vào mô hình chi nhánh
Bank 3.0: mobile-first               - "ngân hàng trong túi", vẫn là app đích để mở
Bank 4.0: vô hình/nhúng               - ngân hàng nằm BÊN TRONG app khác
          (thanh toán khi mua hàng, gọi xe, trả lương) không còn bước "vào bank" riêng</code></pre>
<div class="callout"><span class="badge">Ý cốt lõi để thi</span> CĐS không phải "thêm cái app". Đó là đi xuống thang này: số hoá tài liệu → số hoá quy trình → chuyển đổi mô hình kinh doanh. Đa số dự án "số" thất bại chỉ làm bước một rồi tuyên bố xong.</div>`,
  ]]);

const c1q = quiz('dtf201c-quiz-1', 'Quiz 1 — Overview & drivers|||Quiz 1 — Tổng quan & động lực', [
  { id: 'q1', question: 'Dùng dữ liệu số để thay đổi CÁCH một quy trình hoạt động (nhưng chưa đổi mô hình kinh doanh) gọi là?', options: ['Digitization', 'Digitalization', 'Digital transformation', 'Automation thuần cơ khí'], correctIndex: 1, explanation: 'Digitalization = số hoá quy trình; digitization chỉ là chuyển dạng dữ liệu; transformation mới đổi mô hình kinh doanh.' },
  { id: 'q2', question: 'Theo Brett King (Bank 4.0), Bank 4.0 khác Bank 3.0 (mobile-first) ở điểm nào?', options: ['Bank 4.0 vẫn là app đích bạn phải mở ra dùng', 'Bank 4.0 là ngân hàng vô hình, nhúng vào app/dịch vụ khác', 'Bank 4.0 quay lại mô hình chi nhánh', 'Bank 4.0 chỉ khác về màu giao diện'], correctIndex: 1, explanation: 'Bank 3.0 vẫn là "app ngân hàng" bạn mở; Bank 4.0 là banking ẩn sau các trải nghiệm khác, không còn "bước vào bank" riêng.' },
  { id: 'q3', question: 'Đâu KHÔNG phải một trong bốn lực đẩy CĐS tài chính nêu trong bài?', options: ['Kỳ vọng khách hàng', 'Cạnh tranh fintech/Big Tech', 'Quy định & chính sách', 'Giá vàng thế giới'], correctIndex: 3, explanation: 'Bốn lực: khách hàng, cạnh tranh, quy định, công nghệ nền — giá vàng không nằm trong khung này.' },
]);

const c2 = doc('dtf201c-2-1-fintech-disruption', '2.1 — Fintech & disruption|||2.1 — Fintech & sự gián đoạn (disruption)',
  'Định nghĩa & phân loại fintech (The FINTECH Book); disruption/unbundling ngân hàng; Banking-as-a-Service; case Big Tech & neobank.',
  [[
    `<span class="eyebrow">DTF201c · Chapter 2 · Lesson 2.1</span>
<h2>Fintech &amp; disruption</h2>
<h3>What "fintech" actually covers</h3>
<p><em>The FINTECH Book</em> (Chishti &amp; Barberis) groups fintech into slices of the financial value chain, each attacked by specialized startups instead of one all-purpose bank:</p>
<ul>
<li><strong>Payments</strong> — e-wallets, QR/instant transfer, cross-border remittance.</li>
<li><strong>Lending</strong> — peer-to-peer lending, buy-now-pay-later, alternative credit scoring.</li>
<li><strong>WealthTech</strong> — robo-advisors, micro-investing apps.</li>
<li><strong>InsurTech</strong> — usage-based insurance, instant claims via app.</li>
<li><strong>RegTech</strong> — software that automates compliance and reporting.</li>
<li><strong>Blockchain / crypto</strong> — decentralized ledgers, digital assets, DeFi.</li>
</ul>
<h3>Disruption &amp; "unbundling the bank"</h3>
<p>A traditional bank bundles many services (deposits, payments, lending, investing, advice) under one brand and balance sheet. Disruption theory (Christensen) explains fintech's playbook: enter with one narrow, cheaper, better-UX slice that incumbents ignore because it looks unprofitable to them — then scale it. The result is <strong>unbundling</strong>: a customer's "financial life" is spread across several specialist apps instead of one bank.</p>
<h3>The incumbent's answer: Banking-as-a-Service (BaaS)</h3>
<p>Rather than only compete, many banks now <strong>rebundle</strong> by becoming infrastructure: they expose accounts, payments and KYC as services other companies plug into (e.g. a ride-hailing app offering a driver wallet powered by a licensed bank behind the scenes).</p>
<div class="callout"><span class="badge">Cases</span> Big Tech moving into finance (Apple Pay, Grab's financial services) and neobanks / digital-only banks (Revolut-style apps; in Vietnam: Timo, Cake) are both examples of unbundling — a non-bank brand delivers the experience, while compliance and the ledger sit with a licensed partner.</div>`,
    `<span class="eyebrow">DTF201c · Chương 2 · Bài 2.1</span>
<h2>Fintech &amp; sự gián đoạn (disruption)</h2>
<h3>"Fintech" thực chất gồm những gì</h3>
<p><em>The FINTECH Book</em> (Chishti &amp; Barberis) chia fintech theo từng lát cắt của chuỗi giá trị tài chính, mỗi lát bị một nhóm startup chuyên biệt tấn công thay vì một ngân hàng làm tất cả:</p>
<ul>
<li><strong>Thanh toán (Payments)</strong> — ví điện tử, chuyển tiền QR/tức thời, chuyển tiền xuyên biên giới.</li>
<li><strong>Cho vay (Lending)</strong> — vay ngang hàng (P2P), mua trước trả sau (BNPL), chấm điểm tín dụng thay thế.</li>
<li><strong>WealthTech</strong> — robo-advisor, app đầu tư số tiền nhỏ.</li>
<li><strong>InsurTech</strong> — bảo hiểm theo mức dùng, bồi thường ngay qua app.</li>
<li><strong>RegTech</strong> — phần mềm tự động hoá tuân thủ &amp; báo cáo.</li>
<li><strong>Blockchain / crypto</strong> — sổ cái phân tán, tài sản số, DeFi.</li>
</ul>
<h3>Disruption &amp; "tách rã ngân hàng" (unbundling)</h3>
<p>Ngân hàng truyền thống gói nhiều dịch vụ (nhận gửi, thanh toán, cho vay, đầu tư, tư vấn) dưới một thương hiệu và một bảng cân đối. Lý thuyết disruption (Christensen) mô tả đúng lối chơi của fintech: vào bằng một lát cắt hẹp, rẻ hơn, trải nghiệm tốt hơn mà ngân hàng lớn bỏ qua vì nhìn có vẻ không sinh lời — rồi mở rộng dần. Kết quả là <strong>tách rã (unbundling)</strong>: "đời sống tài chính" của khách hàng nằm rải trên nhiều app chuyên biệt thay vì một ngân hàng.</p>
<h3>Câu trả lời của ngân hàng lớn: Banking-as-a-Service (BaaS)</h3>
<p>Thay vì chỉ cạnh tranh, nhiều ngân hàng chọn <strong>gói lại (rebundle)</strong> bằng cách trở thành hạ tầng: họ mở tài khoản, thanh toán, KYC dưới dạng dịch vụ cho công ty khác cắm vào (vd một app gọi xe cung cấp ví cho lái xe, chạy trên nền một ngân hàng có phép ở phía sau).</p>
<div class="callout"><span class="badge">Case thực tế</span> Big Tech lấn sang tài chính (Apple Pay, dịch vụ tài chính của Grab) và neobank / ngân hàng số thuần (mô hình như Revolut; ở Việt Nam: Timo, Cake) đều là ví dụ của tách rã — thương hiệu không phải ngân hàng mang lại trải nghiệm, còn tuân thủ &amp; sổ cái nằm ở đối tác có phép.</div>`,
  ]]);

const c2q = quiz('dtf201c-quiz-2', 'Quiz 2 — Fintech & disruption|||Quiz 2 — Fintech & disruption', [
  { id: 'q1', question: 'Nhóm fintech chuyên robo-advisor và app đầu tư số tiền nhỏ thuộc mảng nào?', options: ['Payments', 'WealthTech', 'InsurTech', 'RegTech'], correctIndex: 1, explanation: 'WealthTech = công nghệ cho quản lý tài sản/đầu tư, gồm robo-advisor.' },
  { id: 'q2', question: '"Unbundling ngân hàng" nghĩa là gì?', options: ['Ngân hàng gộp thêm nhiều dịch vụ vào một app', 'Đời sống tài chính khách hàng bị tách ra nhiều app chuyên biệt thay vì một ngân hàng', 'Ngân hàng đóng cửa hết chi nhánh', 'Chỉ áp dụng cho bảo hiểm'], correctIndex: 1, explanation: 'Unbundling: từng dịch vụ (thanh toán, vay, đầu tư...) bị startup chuyên biệt tách ra khỏi ngân hàng truyền thống.' },
  { id: 'q3', question: 'Banking-as-a-Service (BaaS) là gì?', options: ['Ngân hàng cấm hoàn toàn fintech dùng dữ liệu', 'Ngân hàng trở thành hạ tầng, cho công ty khác cắm vào dùng tài khoản/thanh toán/KYC qua dịch vụ', 'Một loại bảo hiểm mới', 'Một sàn giao dịch crypto'], correctIndex: 1, explanation: 'BaaS: ngân hàng lộ năng lực (account, payment, KYC...) như dịch vụ cho bên thứ ba tích hợp.' },
]);

const c3 = doc('dtf201c-3-1-so-hoa-kenh-trai-nghiem', '3.1 — Digitizing channels & customer experience|||3.1 — Số hoá kênh & trải nghiệm khách hàng',
  'Omni-channel vs multi-channel; mobile banking, chatbot, eKYC/biometric onboarding; customer journey mapping; cá nhân hoá & phi ma sát (frictionless).',
  [[
    `<span class="eyebrow">DTF201c · Chapter 3 · Lesson 3.1</span>
<h2>Digitizing channels &amp; customer experience</h2>
<h3>Multi-channel vs omni-channel</h3>
<ul>
<li><strong>Multi-channel</strong> — branch, call center, app, website all exist, but each keeps its own data and history. A customer who starts a loan application on the app and calls support has to explain everything again.</li>
<li><strong>Omni-channel</strong> — one shared customer record and conversation history across every channel. The call-center agent already sees the half-finished app application.</li>
</ul>
<h3>Key digital-channel building blocks</h3>
<ul>
<li><strong>Mobile banking app</strong> — the primary channel for most retail customers today; replaces most branch visits.</li>
<li><strong>Chatbots / virtual assistants</strong> — handle FAQs and simple transactions 24/7, escalate complex cases to a human.</li>
<li><strong>eKYC &amp; biometric onboarding</strong> — open an account by scanning an ID card and a selfie/liveness check instead of visiting a branch with paper documents; cuts onboarding from days to minutes.</li>
</ul>
<h3>Customer journey mapping</h3>
<p>A journey map lays out every step a customer takes for a goal (e.g. "open a savings account") across touchpoints, marking <strong>pain points</strong> (re-entering the same data, waiting for manual approval) and <strong>moments of truth</strong> (the instant a card is approved). Digital transformation projects usually start by mapping the journey, then removing the worst friction points first.</p>
<div class="callout"><span class="badge">Frictionless ≠ feature-less</span> "Frictionless" means removing unnecessary steps (re-typing, waiting, physical presence) — not removing security. Good design hides complexity (e.g. biometric login) instead of deleting the control behind it.</div>`,
    `<span class="eyebrow">DTF201c · Chương 3 · Bài 3.1</span>
<h2>Số hoá kênh &amp; trải nghiệm khách hàng</h2>
<h3>Multi-channel và omni-channel</h3>
<ul>
<li><strong>Multi-channel (đa kênh)</strong> — chi nhánh, tổng đài, app, website đều tồn tại, nhưng mỗi kênh giữ riêng dữ liệu &amp; lịch sử. Khách bắt đầu vay trên app rồi gọi tổng đài phải kể lại từ đầu.</li>
<li><strong>Omni-channel (đa kênh liền mạch)</strong> — một hồ sơ khách hàng &amp; lịch sử hội thoại dùng chung xuyên suốt mọi kênh. Nhân viên tổng đài đã thấy ngay hồ sơ vay đang làm dở trên app.</li>
</ul>
<h3>Các khối kênh số quan trọng</h3>
<ul>
<li><strong>App ngân hàng di động</strong> — kênh chính của đa số khách cá nhân hiện nay; thay thế phần lớn việc đến chi nhánh.</li>
<li><strong>Chatbot / trợ lý ảo</strong> — xử lý câu hỏi thường gặp &amp; giao dịch đơn giản 24/7, chuyển ca khó cho nhân viên.</li>
<li><strong>eKYC &amp; xác thực sinh trắc học</strong> — mở tài khoản bằng chụp CCCD và chụp mặt/kiểm tra "sống" thay vì đến chi nhánh mang giấy tờ; rút thời gian mở tài khoản từ nhiều ngày xuống vài phút.</li>
</ul>
<h3>Bản đồ hành trình khách hàng (customer journey mapping)</h3>
<p>Bản đồ hành trình vạch ra từng bước khách hàng đi qua để đạt mục tiêu (vd "mở sổ tiết kiệm") xuyên các điểm chạm, đánh dấu <strong>điểm đau (pain point)</strong> (phải nhập lại cùng dữ liệu, chờ duyệt tay) và <strong>khoảnh khắc quyết định (moment of truth)</strong> (giây thẻ được duyệt). Dự án CĐS thường bắt đầu bằng vẽ hành trình, rồi xoá điểm ma sát tệ nhất trước.</p>
<div class="callout"><span class="badge">Phi ma sát ≠ bỏ tính năng</span> "Phi ma sát" (frictionless) nghĩa là bỏ bước không cần thiết (nhập lại, chờ, phải có mặt) — không phải bỏ an toàn. Thiết kế tốt giấu độ phức tạp (vd đăng nhập sinh trắc học) chứ không xoá lớp kiểm soát phía sau.</div>`,
  ]]);

const c3q = quiz('dtf201c-quiz-3', 'Quiz 3 — Channels & customer experience|||Quiz 3 — Kênh số & trải nghiệm KH', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa omni-channel và multi-channel là?', options: ['Omni-channel có nhiều kênh hơn về số lượng', 'Omni-channel dùng chung một hồ sơ/lịch sử khách hàng xuyên các kênh, multi-channel thì mỗi kênh tách biệt', 'Multi-channel chỉ có trên mobile', 'Không có khác biệt, hai từ đồng nghĩa'], correctIndex: 1, explanation: 'Omni-channel hợp nhất dữ liệu &amp; hội thoại xuyên kênh; multi-channel mỗi kênh giữ riêng.' },
  { id: 'q2', question: 'eKYC giúp gì trong mở tài khoản?', options: ['Bắt buộc khách phải đến chi nhánh nhiều lần hơn', 'Xác thực danh tính qua ảnh giấy tờ + sinh trắc học, rút thời gian mở tài khoản xuống vài phút', 'Chỉ dùng cho vay, không dùng để mở tài khoản', 'Thay thế hoàn toàn quy định pháp luật về KYC'], correctIndex: 1, explanation: 'eKYC số hoá bước xác thực danh tính, không xoá yêu cầu pháp lý mà làm nó nhanh hơn.' },
  { id: 'q3', question: '"Điểm đau" (pain point) trong bản đồ hành trình khách hàng là gì?', options: ['Bước khách hàng thấy khó chịu/mất thời gian trong hành trình', 'Tên gọi khác của KPI doanh thu', 'Một loại lỗi bảo mật', 'Chỉ áp dụng cho kênh chi nhánh'], correctIndex: 0, explanation: 'Pain point là bước gây khó chịu/ma sát mà đội CĐS ưu tiên loại bỏ trước.' },
]);

const c4 = doc('dtf201c-4-1-open-banking-api', '4.1 — Open Banking, APIs & platforms|||4.1 — Open Banking, API & nền tảng',
  'Định nghĩa Open Banking, PSD2; API là "hợp đồng số"; Banking-as-a-Platform vs Banking-as-a-Service; ecosystem qua API marketplace.',
  [[
    `<span class="eyebrow">DTF201c · Chapter 4 · Lesson 4.1</span>
<h2>Open Banking, APIs &amp; platforms</h2>
<h3>What Open Banking means</h3>
<p><strong>Open Banking</strong> is the practice (and, in many markets, the regulation) of letting a customer authorize <em>third-party apps</em> to securely access their bank account data or initiate payments, through standardized APIs — instead of the bank being the only door to that data. Europe's <strong>PSD2</strong> directive is the reference case: it forced banks to open account-information and payment-initiation APIs to licensed third parties, with the customer's explicit consent.</p>
<h3>An API is a digital contract</h3>
<p>An <strong>API (Application Programming Interface)</strong> defines exactly what data/actions a system exposes and how another system may call them — a documented, versioned contract. In finance this matters twice as much: the "contract" also encodes consent, security, and liability (who is responsible if a payment fails).</p>
<h3>Banking-as-a-Platform vs Banking-as-a-Service</h3>
<ul>
<li><strong>Banking-as-a-Platform (BaaP)</strong> — the bank keeps the customer relationship and brand, but opens APIs so fintech apps can plug in features (e.g. a budgeting app reading transaction data with consent).</li>
<li><strong>Banking-as-a-Service (BaaS)</strong> — the bank becomes invisible infrastructure; another brand owns the customer relationship and end product, the bank supplies the licensed core (accounts, ledger, compliance) behind an API.</li>
</ul>
<pre><code>Customer -&gt; Third-party app (consent) -&gt; Open Banking API -&gt; Bank's core system
         (budgeting, lending, payment-initiation apps all reuse ONE data source)</code></pre>
<div class="callout"><span class="badge">Ecosystem, not a single app</span> An API marketplace lets many fintechs build on the same bank rails at once — the bank's value shifts from "the only app you use" to "the trusted rail many apps run on".</div>`,
    `<span class="eyebrow">DTF201c · Chương 4 · Bài 4.1</span>
<h2>Open Banking, API &amp; nền tảng</h2>
<h3>Open Banking nghĩa là gì</h3>
<p><strong>Open Banking</strong> là việc (và ở nhiều thị trường, là quy định bắt buộc) cho phép khách hàng cấp quyền cho <em>ứng dụng bên thứ ba</em> truy cập an toàn vào dữ liệu tài khoản hoặc khởi tạo thanh toán, thông qua API chuẩn hoá — thay vì ngân hàng là cửa duy nhất tới dữ liệu đó. Chỉ thị <strong>PSD2</strong> của châu Âu là ví dụ tham chiếu: nó buộc ngân hàng mở API thông tin tài khoản &amp; khởi tạo thanh toán cho bên thứ ba có phép, với sự đồng ý rõ ràng của khách hàng.</p>
<h3>API là một hợp đồng số</h3>
<p><strong>API (Application Programming Interface)</strong> định nghĩa chính xác dữ liệu/hành động nào một hệ thống mở ra và hệ thống khác gọi thế nào — một hợp đồng có tài liệu, có phiên bản. Trong tài chính điều này quan trọng gấp đôi: "hợp đồng" đó còn mã hoá cả sự đồng ý, an toàn, và trách nhiệm (ai chịu trách nhiệm nếu thanh toán lỗi).</p>
<h3>Banking-as-a-Platform và Banking-as-a-Service</h3>
<ul>
<li><strong>Banking-as-a-Platform (BaaP)</strong> — ngân hàng giữ quan hệ khách hàng &amp; thương hiệu, nhưng mở API để app fintech cắm thêm tính năng (vd app quản lý chi tiêu đọc dữ liệu giao dịch khi được đồng ý).</li>
<li><strong>Banking-as-a-Service (BaaS)</strong> — ngân hàng trở thành hạ tầng vô hình; thương hiệu khác giữ quan hệ khách hàng &amp; sản phẩm cuối, ngân hàng cấp lõi có phép (tài khoản, sổ cái, tuân thủ) phía sau qua API.</li>
</ul>
<pre><code>Khách hàng -&gt; App bên thứ ba (có đồng ý) -&gt; API Open Banking -&gt; Hệ thống lõi ngân hàng
           (app quản lý chi tiêu, cho vay, khởi tạo thanh toán... đều dùng lại MỘT nguồn dữ liệu)</code></pre>
<div class="callout"><span class="badge">Là hệ sinh thái, không phải một app</span> Một API marketplace cho nhiều fintech cùng xây trên một hạ tầng ngân hàng — giá trị của ngân hàng chuyển từ "app duy nhất bạn dùng" thành "đường ray đáng tin cậy nhiều app chạy trên đó".</div>`,
  ]]);

const c4q = quiz('dtf201c-quiz-4', 'Quiz 4 — Open Banking & APIs|||Quiz 4 — Open Banking & API', [
  { id: 'q1', question: 'PSD2 (châu Âu) yêu cầu điều gì?', options: ['Cấm mọi ứng dụng bên thứ ba truy cập dữ liệu ngân hàng', 'Buộc ngân hàng mở API thông tin tài khoản & khởi tạo thanh toán cho bên thứ ba có phép, với sự đồng ý của khách hàng', 'Bắt buộc dùng blockchain cho mọi giao dịch', 'Chỉ áp dụng cho bảo hiểm'], correctIndex: 1, explanation: 'PSD2 là chỉ thị mở API ngân hàng cho bên thứ ba có phép, theo sự đồng ý của khách hàng.' },
  { id: 'q2', question: 'Trong Banking-as-a-Service (BaaS), ai giữ quan hệ khách hàng & thương hiệu?', options: ['Ngân hàng cấp phép luôn giữ thương hiệu chính', 'Một thương hiệu khác (không phải ngân hàng) giữ quan hệ khách hàng, ngân hàng chỉ cấp hạ tầng có phép phía sau', 'Không ai giữ, hệ thống hoàn toàn tự động', 'Chỉ có ở lĩnh vực bảo hiểm'], correctIndex: 1, explanation: 'BaaS: ngân hàng ẩn phía sau như hạ tầng, thương hiệu đối tác sở hữu trải nghiệm & khách hàng.' },
  { id: 'q3', question: 'Vì sao API trong tài chính được gọi là "hợp đồng số"?', options: ['Vì API chỉ dùng để trang trí giao diện', 'Vì nó định nghĩa rõ dữ liệu/hành động được phép, kèm mã hoá sự đồng ý, an toàn & trách nhiệm', 'Vì API luôn phải ký bằng chữ ký điện tử', 'Vì API không cần tài liệu'], correctIndex: 1, explanation: 'API là hợp đồng có tài liệu & phiên bản; trong tài chính còn gánh cả đồng ý, an toàn, trách nhiệm.' },
]);

const c5 = doc('dtf201c-5-1-du-lieu-ai-tu-dong-hoa', '5.1 — Data, AI & automation in finance|||5.1 — Dữ liệu, AI & tự động hoá trong tài chính',
  'Big data hành vi/giao dịch; ứng dụng AI/ML: credit scoring, fraud detection, robo-advisory; RPA tự động hoá back-office; rủi ro bias & giải thích được.',
  [[
    `<span class="eyebrow">DTF201c · Chapter 5 · Lesson 5.1</span>
<h2>Data, AI &amp; automation in finance</h2>
<h3>Why data is the real product</h3>
<p>Every digital channel (app clicks, card swipes, chat logs) generates behavioral and transactional data. In digitally transformed finance, this data becomes the raw material for decisions that used to rely on a loan officer's judgment or a fixed rulebook.</p>
<h3>Where AI/ML actually gets used</h3>
<ul>
<li><strong>Alternative credit scoring</strong> — models use transaction/behavioral data (not just formal credit history) to score customers with no prior credit file — useful for financial inclusion, but riskier to audit.</li>
<li><strong>Fraud &amp; anomaly detection</strong> — models flag transactions that don't match a customer's usual pattern in real time, faster than fixed rule lists.</li>
<li><strong>Robo-advisory</strong> — algorithm-driven portfolio allocation and rebalancing at a fraction of a human advisor's fee.</li>
<li><strong>Chatbots / NLP</strong> — understand free-text customer queries, not just menu buttons.</li>
</ul>
<h3>RPA — automating the back office</h3>
<p><strong>Robotic Process Automation (RPA)</strong> is different from AI: a "bot" follows a fixed script across existing screens/systems (e.g. copy data from an incoming form into three legacy systems) — no learning, no judgment, just fast and consistent execution of a repetitive task. It's often the first, cheapest automation win before any AI project.</p>
<div class="callout"><span class="badge">The catch: bias &amp; explainability</span> A model trained on past lending data can learn to replicate past discrimination (e.g. against a postal code correlated with income). "Explainability" — being able to say <em>why</em> a model rejected an application — is now a compliance requirement in many jurisdictions, not just a nice-to-have.</div>`,
    `<span class="eyebrow">DTF201c · Chương 5 · Bài 5.1</span>
<h2>Dữ liệu, AI &amp; tự động hoá trong tài chính</h2>
<h3>Vì sao dữ liệu mới là sản phẩm thật</h3>
<p>Mỗi kênh số (click trên app, chạm thẻ, log chat) sinh ra dữ liệu hành vi &amp; giao dịch. Trong tài chính đã chuyển đổi số, dữ liệu này trở thành nguyên liệu cho các quyết định trước đây dựa vào cảm tính nhân viên tín dụng hoặc bộ quy tắc cố định.</p>
<h3>AI/ML thật sự được dùng ở đâu</h3>
<ul>
<li><strong>Chấm điểm tín dụng thay thế (alternative credit scoring)</strong> — mô hình dùng dữ liệu giao dịch/hành vi (không chỉ lịch sử tín dụng chính thức) để chấm điểm khách chưa có hồ sơ tín dụng — hữu ích cho tài chính toàn diện, nhưng khó kiểm toán hơn.</li>
<li><strong>Phát hiện gian lận &amp; bất thường</strong> — mô hình đánh dấu giao dịch lệch khỏi thói quen thường ngày của khách theo thời gian thực, nhanh hơn danh sách quy tắc cố định.</li>
<li><strong>Robo-advisory</strong> — phân bổ &amp; tái cân bằng danh mục đầu tư bằng thuật toán với phí chỉ bằng một phần nhỏ so với chuyên viên tư vấn con người.</li>
<li><strong>Chatbot / NLP</strong> — hiểu câu hỏi tự do của khách, không chỉ nút bấm theo menu.</li>
</ul>
<h3>RPA — tự động hoá vận hành back-office</h3>
<p><strong>Robotic Process Automation (RPA)</strong> khác với AI: một "bot" chạy theo script cố định trên các màn hình/hệ thống có sẵn (vd chép dữ liệu từ form đến vào ba hệ thống cũ) — không học, không phán đoán, chỉ thực thi nhanh &amp; nhất quán một việc lặp lại. Đây thường là chiến thắng tự động hoá đầu tiên, rẻ nhất, trước khi làm bất kỳ dự án AI nào.</p>
<div class="callout"><span class="badge">Cái giá phải trả: bias & khả năng giải thích</span> Một mô hình huấn luyện trên dữ liệu cho vay quá khứ có thể học lại chính sự phân biệt quá khứ (vd theo mã vùng gắn với thu nhập). "Khả năng giải thích" — nói được <em>vì sao</em> mô hình từ chối một hồ sơ — nay là yêu cầu tuân thủ ở nhiều nơi, không còn là "có thì tốt".</div>`,
  ]]);

const c5q = quiz('dtf201c-quiz-5', 'Quiz 5 — Data, AI & automation|||Quiz 5 — Dữ liệu, AI & tự động hoá', [
  { id: 'q1', question: 'Chấm điểm tín dụng thay thế (alternative credit scoring) khác chấm điểm truyền thống ở điểm nào?', options: ['Chỉ dùng lịch sử tín dụng chính thức', 'Dùng cả dữ liệu hành vi/giao dịch để chấm khách chưa có hồ sơ tín dụng', 'Không dùng dữ liệu nào cả', 'Chỉ áp dụng cho doanh nghiệp lớn'], correctIndex: 1, explanation: 'Alternative credit scoring mở rộng nguồn dữ liệu ngoài hồ sơ tín dụng chính thức.' },
  { id: 'q2', question: 'RPA (Robotic Process Automation) khác AI/ML ở điểm cốt lõi nào?', options: ['RPA học và tự cải thiện theo thời gian như AI', 'RPA chạy theo script cố định trên hệ thống có sẵn, không học/không phán đoán', 'RPA chỉ dùng cho phát hiện gian lận', 'RPA là một loại blockchain'], correctIndex: 1, explanation: 'RPA thực thi quy trình lặp theo script cố định; AI/ML học từ dữ liệu và đưa ra dự đoán/phán đoán.' },
  { id: 'q3', question: '"Khả năng giải thích" (explainability) của mô hình AI trong tài chính quan trọng vì?', options: ['Giúp mô hình chạy nhanh hơn', 'Cho phép nói rõ vì sao mô hình ra quyết định (vd từ chối vay), phục vụ tuân thủ & tránh bias ẩn', 'Chỉ để marketing', 'Không liên quan tới quy định pháp luật'], correctIndex: 1, explanation: 'Explainability giúp kiểm toán quyết định của mô hình, phát hiện bias, và đáp ứng yêu cầu tuân thủ.' },
]);

const c6 = doc('dtf201c-6-1-blockchain-tai-san-so', '6.1 — Blockchain & digital assets|||6.1 — Blockchain & tài sản số',
  'Sổ cái phân tán & đồng thuận; ứng dụng: thanh toán xuyên biên giới, trade finance, smart contract; tài sản số: crypto, CBDC, stablecoin, tokenization; rủi ro.',
  [[
    `<span class="eyebrow">DTF201c · Chapter 6 · Lesson 6.1</span>
<h2>Blockchain &amp; digital assets</h2>
<h3>Blockchain in one paragraph</h3>
<p>A <strong>blockchain</strong> is a shared ledger replicated across many independent computers (nodes), where new entries ("blocks") are added only after the network agrees they're valid (<strong>consensus</strong>), and each block cryptographically links to the previous one — making past records extremely hard to alter quietly. No single company owns or can unilaterally rewrite the ledger.</p>
<h3>Financial applications</h3>
<ul>
<li><strong>Cross-border payments</strong> — settle between banks in different countries without a long chain of correspondent banks, each adding delay and fees.</li>
<li><strong>Trade finance</strong> — a letter of credit and its supporting documents shared on one ledger, visible to buyer, seller, and banks at once, instead of faxed/couriered paper.</li>
<li><strong>Smart contracts</strong> — code on a blockchain that executes automatically when agreed conditions are met (e.g. release payment the instant a shipment is confirmed delivered) — no manual reconciliation step.</li>
</ul>
<h3>Digital assets: four terms often confused</h3>
<ul>
<li><strong>Cryptocurrency</strong> (e.g. Bitcoin) — a digital asset native to a blockchain, not issued by any government.</li>
<li><strong>Stablecoin</strong> — a crypto token designed to hold a steady value, usually pegged to a currency like USD.</li>
<li><strong>CBDC (Central Bank Digital Currency)</strong> — a digital form of a country's own official currency, issued by its central bank — not the same thing as crypto, since it's centrally issued and backed by the state.</li>
<li><strong>Tokenization</strong> — representing a real-world asset (property, a bond, art) as a digital token on a blockchain, enabling fractional ownership and faster transfer.</li>
</ul>
<div class="callout"><span class="badge">Real limits, not just hype</span> Volatility (for crypto), unsettled regulation, and — for some consensus designs — heavy energy use are genuine constraints. A bank piloting blockchain almost always starts with a narrow, permissioned use case (like trade finance among known partners), not an open public chain.</div>`,
    `<span class="eyebrow">DTF201c · Chương 6 · Bài 6.1</span>
<h2>Blockchain &amp; tài sản số</h2>
<h3>Blockchain trong một đoạn</h3>
<p><strong>Blockchain</strong> là một sổ cái được nhân bản trên nhiều máy tính độc lập (node), nơi bản ghi mới ("block") chỉ được thêm sau khi cả mạng đồng ý nó hợp lệ (<strong>đồng thuận — consensus</strong>), và mỗi block liên kết mật mã với block trước — khiến bản ghi cũ rất khó bị sửa lặng lẽ. Không một công ty nào sở hữu hay đơn phương viết lại được sổ cái đó.</p>
<h3>Ứng dụng trong tài chính</h3>
<ul>
<li><strong>Thanh toán xuyên biên giới</strong> — quyết toán giữa ngân hàng ở các nước khác nhau mà không cần chuỗi dài ngân hàng đại lý, mỗi trạm thêm chậm &amp; phí.</li>
<li><strong>Trade finance (tài trợ thương mại)</strong> — thư tín dụng &amp; tài liệu kèm theo nằm trên một sổ cái, người mua, người bán, ngân hàng cùng thấy một lúc, thay vì fax/chuyển phát giấy.</li>
<li><strong>Smart contract (hợp đồng thông minh)</strong> — mã trên blockchain tự thực thi khi điều kiện đã thoả thuận được đáp ứng (vd giải ngân ngay khi lô hàng xác nhận đã giao) — không cần bước đối soát tay.</li>
</ul>
<h3>Tài sản số: bốn thuật ngữ hay bị lẫn</h3>
<ul>
<li><strong>Cryptocurrency (tiền mã hoá)</strong> (vd Bitcoin) — tài sản số nguyên bản của một blockchain, không do chính phủ nào phát hành.</li>
<li><strong>Stablecoin</strong> — token crypto được thiết kế giữ giá trị ổn định, thường neo theo một loại tiền như USD.</li>
<li><strong>CBDC (tiền số ngân hàng trung ương)</strong> — dạng số của chính đồng tiền chính thức một quốc gia, do ngân hàng trung ương phát hành — không giống crypto vì nó được phát hành tập trung &amp; có nhà nước đứng sau.</li>
<li><strong>Tokenization (số hoá tài sản)</strong> — biểu diễn tài sản thực (bất động sản, trái phiếu, tác phẩm nghệ thuật) thành token số trên blockchain, cho phép sở hữu theo phần &amp; chuyển nhượng nhanh hơn.</li>
</ul>
<div class="callout"><span class="badge">Hạn chế thật, không chỉ là quảng cáo</span> Biến động giá (với crypto), quy định chưa ổn định, và — với một số cơ chế đồng thuận — tiêu tốn năng lượng lớn là những giới hạn thật. Một ngân hàng thử nghiệm blockchain hầu như luôn bắt đầu bằng một trường hợp hẹp, có cấp phép (như trade finance giữa các đối tác đã biết), không phải một chain công khai mở.</div>`,
  ]]);

const c6q = quiz('dtf201c-quiz-6', 'Quiz 6 — Blockchain & digital assets|||Quiz 6 — Blockchain & tài sản số', [
  { id: 'q1', question: 'Điều gì làm bản ghi cũ trên blockchain khó bị sửa lặng lẽ?', options: ['Chỉ một công ty duy nhất kiểm soát dữ liệu', 'Mỗi block liên kết mật mã với block trước, được nhân bản & đồng thuận trên nhiều node', 'Dữ liệu được mã hoá bằng mật khẩu người dùng', 'Không có gì đặc biệt, giống một database thường'], correctIndex: 1, explanation: 'Liên kết mật mã giữa các block + đồng thuận phân tán khiến sửa lặng lẽ rất khó.' },
  { id: 'q2', question: 'CBDC khác cryptocurrency (như Bitcoin) ở điểm nào?', options: ['CBDC do ngân hàng trung ương phát hành, là dạng số của tiền chính thức quốc gia; crypto không do chính phủ phát hành', 'CBDC và crypto hoàn toàn giống nhau', 'CBDC chỉ dùng được ở nước ngoài', 'Crypto luôn ổn định giá hơn CBDC'], correctIndex: 0, explanation: 'CBDC được nhà nước/ngân hàng trung ương phát hành & bảo đảm; crypto không có tổ chức phát hành trung tâm.' },
  { id: 'q3', question: 'Smart contract trong trade finance mang lại lợi ích gì?', options: ['Tự thực thi khi điều kiện thoả thuận được đáp ứng, bỏ bước đối soát tay', 'Bắt buộc phải fax tài liệu qua nhiều bên', 'Chỉ dùng được cho tiền mã hoá, không dùng cho thương mại', 'Làm chậm giao dịch hơn quy trình giấy'], correctIndex: 0, explanation: 'Smart contract tự động giải ngân/thực hiện khi điều kiện đã lập trình được đáp ứng — không cần đối soát thủ công.' },
]);

const c7 = doc('dtf201c-7-1-an-ninh-regtech-tuan-thu', '7.1 — Security, RegTech & compliance|||7.1 — An ninh, RegTech & tuân thủ',
  'Rủi ro an ninh mạng tài chính (phishing, ransomware, gian lận); RegTech tự động hoá AML/KYC & giám sát giao dịch; khung pháp lý & bảo vệ dữ liệu.',
  [[
    `<span class="eyebrow">DTF201c · Chapter 7 · Lesson 7.1</span>
<h2>Security, RegTech &amp; compliance</h2>
<h3>Why more digital channels = a bigger attack surface</h3>
<p>Every new digital channel, API, and partner integration is also a new door an attacker can try. The most common financial-sector incidents are not exotic: <strong>phishing</strong> (fake messages tricking a user into revealing credentials), <strong>ransomware</strong> (malware that locks systems until paid), and <strong>account-takeover fraud</strong> (using stolen credentials to move money).</p>
<h3>RegTech: technology that automates compliance</h3>
<p><strong>RegTech</strong> is software built specifically to satisfy regulatory obligations faster and cheaper than manual review:</p>
<ul>
<li><strong>Automated AML/KYC</strong> — screening new customers against sanctions/watch lists and verifying identity automatically at onboarding.</li>
<li><strong>Transaction monitoring</strong> — algorithms flag suspicious patterns (structuring, unusual velocity) for a human investigator to review, instead of sampling manually.</li>
<li><strong>Regulatory reporting</strong> — auto-generating the reports regulators require, reducing manual error.</li>
</ul>
<h3>The legal backdrop</h3>
<ul>
<li><strong>Basel framework</strong> — international standards for bank capital &amp; risk management, increasingly including operational/technology risk.</li>
<li><strong>AML/CFT</strong> (anti-money-laundering / countering the financing of terrorism) — rules requiring banks to know their customer and report suspicious activity.</li>
<li><strong>Data-protection law</strong> — e.g. the EU's GDPR, or Vietnam's Decree 13/2023 on personal data protection — governs how customer data collected through digital channels may be stored, used, and shared.</li>
</ul>
<div class="callout"><span class="badge">Governance, not just tools</span> Buying a monitoring tool is not the same as having a risk culture. Technology risk governance means someone senior owns the risk, incidents are reported honestly, and controls are tested — not just installed.</div>`,
    `<span class="eyebrow">DTF201c · Chương 7 · Bài 7.1</span>
<h2>An ninh, RegTech &amp; tuân thủ</h2>
<h3>Vì sao nhiều kênh số hơn = bề mặt tấn công lớn hơn</h3>
<p>Mỗi kênh số, API, và tích hợp đối tác mới cũng là một cửa mới kẻ tấn công có thể thử. Sự cố phổ biến nhất trong ngành tài chính không hề "kỳ lạ": <strong>phishing</strong> (tin nhắn giả lừa người dùng để lộ thông tin đăng nhập), <strong>ransomware</strong> (mã độc khoá hệ thống đòi tiền chuộc), và <strong>chiếm đoạt tài khoản (account takeover)</strong> (dùng thông tin đăng nhập bị đánh cắp để chuyển tiền).</p>
<h3>RegTech: công nghệ tự động hoá tuân thủ</h3>
<p><strong>RegTech</strong> là phần mềm dựng riêng để đáp ứng nghĩa vụ pháp lý nhanh &amp; rẻ hơn kiểm tra tay:</p>
<ul>
<li><strong>AML/KYC tự động</strong> — sàng lọc khách hàng mới với danh sách trừng phạt/theo dõi và xác minh danh tính tự động ngay lúc mở tài khoản.</li>
<li><strong>Giám sát giao dịch</strong> — thuật toán đánh dấu mẫu hình đáng ngờ (chia nhỏ giao dịch, tốc độ bất thường) để nhân viên điều tra xem lại, thay vì chọn mẫu tay.</li>
<li><strong>Báo cáo tuân thủ</strong> — tự sinh báo cáo cơ quan quản lý yêu cầu, giảm lỗi thủ công.</li>
</ul>
<h3>Bối cảnh pháp lý</h3>
<ul>
<li><strong>Khung Basel</strong> — chuẩn quốc tế về vốn &amp; quản trị rủi ro ngân hàng, ngày càng bao gồm cả rủi ro vận hành/công nghệ.</li>
<li><strong>AML/CFT</strong> (chống rửa tiền / chống tài trợ khủng bố) — quy định buộc ngân hàng phải hiểu khách hàng &amp; báo cáo hoạt động đáng ngờ.</li>
<li><strong>Luật bảo vệ dữ liệu</strong> — vd GDPR của EU, hoặc Nghị định 13/2023 của Việt Nam về bảo vệ dữ liệu cá nhân — điều chỉnh việc dữ liệu khách hàng thu qua kênh số được lưu, dùng, chia sẻ ra sao.</li>
</ul>
<div class="callout"><span class="badge">Quản trị, không chỉ là công cụ</span> Mua một công cụ giám sát không đồng nghĩa có văn hoá rủi ro. Quản trị rủi ro công nghệ nghĩa là có người cấp cao chịu trách nhiệm, sự cố được báo cáo trung thực, và kiểm soát được kiểm thử — không chỉ được cài đặt.</div>`,
  ]]);

const c7q = quiz('dtf201c-quiz-7', 'Quiz 7 — Security, RegTech & compliance|||Quiz 7 — An ninh, RegTech & tuân thủ', [
  { id: 'q1', question: 'Phishing là gì?', options: ['Mã độc khoá hệ thống đòi tiền chuộc', 'Tin nhắn/email giả lừa người dùng để lộ thông tin đăng nhập', 'Một loại chấm điểm tín dụng', 'Một dạng smart contract'], correctIndex: 1, explanation: 'Phishing đánh vào con người để lấy thông tin đăng nhập, khác ransomware (mã độc khoá hệ thống).' },
  { id: 'q2', question: 'RegTech giúp ngân hàng làm gì?', options: ['Thay thế hoàn toàn yêu cầu pháp luật', 'Tự động hoá việc đáp ứng nghĩa vụ tuân thủ (AML/KYC, giám sát giao dịch, báo cáo) nhanh & rẻ hơn', 'Chỉ dùng để marketing sản phẩm mới', 'Không liên quan gì đến an ninh dữ liệu'], correctIndex: 1, explanation: 'RegTech = công nghệ hỗ trợ tuân thủ, không thay thế luật mà giúp đáp ứng luật hiệu quả hơn.' },
  { id: 'q3', question: 'Nghị định 13/2023 của Việt Nam liên quan đến điều gì?', options: ['Quy định về vốn ngân hàng (giống Basel)', 'Bảo vệ dữ liệu cá nhân', 'Tiêu chuẩn kỹ thuật blockchain', 'Chính sách lãi suất'], correctIndex: 1, explanation: 'Nghị định 13/2023 là luật bảo vệ dữ liệu cá nhân của Việt Nam, tương tự vai trò GDPR ở EU.' },
]);

const c8 = doc('dtf201c-8-1-chien-luoc-cds-quan-tri-thay-doi', '8.1 — DX strategy, change management & the future|||8.1 — Chiến lược CĐS, quản trị thay đổi & tương lai',
  'Xây chiến lược CĐS: đánh giá năng lực số, roadmap; quản trị thay đổi & văn hoá số; đo hiệu quả CĐS; xu hướng: GenAI, embedded finance, fintech xanh.',
  [[
    `<span class="eyebrow">DTF201c · Chapter 8 · Lesson 8.1</span>
<h2>DX strategy, change management &amp; the future</h2>
<h3>Building a digital transformation strategy</h3>
<pre><code>1. Assess digital maturity  - where are we vs. customers' expectations & rivals?
2. Set a roadmap            - which journeys/products get transformed, in what order?
3. Prioritize by value/risk - highest customer pain + lowest regulatory risk first
4. Invest & build           - platform, data, talent - not just a single app
5. Measure & iterate        - adoption, cost-to-serve, satisfaction; adjust the plan</code></pre>
<p>McKinsey and Deloitte research on financial-services DX consistently makes one point: the biggest failures are <strong>not technology failures</strong> — they are strategy and change-management failures (wrong priorities, no executive sponsorship, no plan for the people affected).</p>
<h3>Change management &amp; digital culture</h3>
<ul>
<li><strong>Leadership</strong> — a senior sponsor who owns the transformation, not just an IT project manager.</li>
<li><strong>Skills</strong> — retraining staff whose manual tasks get automated, not just hiring new data scientists.</li>
<li><strong>Culture</strong> — tolerating fast, cheap experiments and failure, which is unfamiliar in a historically risk-averse, compliance-first industry.</li>
</ul>
<h3>Measuring digital transformation</h3>
<p>Good DX metrics mix three lenses: <strong>digital adoption</strong> (% of transactions done digitally, app usage), <strong>customer experience</strong> (satisfaction, time-to-resolve), and <strong>efficiency</strong> (cost-to-serve per customer, straight-through-processing rate) — a project that only moves one of the three (e.g. "app downloads") without the others usually isn't real transformation.</p>
<h3>What's next</h3>
<p>Generative AI copilots for staff and customers, <strong>embedded finance</strong> (financial products offered inside non-financial apps at the point of need), and growing pressure for <strong>sustainable/green fintech</strong> (financing and reporting tied to environmental impact) are the trends analysts expect to shape the next wave.</p>
<div class="callout"><span class="badge">Closing idea</span> Digital transformation in financial services is not a project with an end date — it's an operating capability. The institutions that treat chapter 1's ladder (digitize → digitalize → transform) as a one-time initiative usually fall behind the ones that treat it as permanent practice.</div>`,
    `<span class="eyebrow">DTF201c · Chương 8 · Bài 8.1</span>
<h2>Chiến lược CĐS, quản trị thay đổi &amp; tương lai</h2>
<h3>Xây chiến lược chuyển đổi số</h3>
<pre><code>1. Đánh giá năng lực số     - đang ở đâu so với kỳ vọng khách hàng & đối thủ?
2. Đặt lộ trình (roadmap)   - hành trình/sản phẩm nào được chuyển đổi, theo thứ tự nào?
3. Ưu tiên theo giá trị/rủi ro - điểm đau khách hàng lớn nhất + rủi ro pháp lý thấp nhất trước
4. Đầu tư & xây dựng        - nền tảng, dữ liệu, con người - không chỉ một cái app
5. Đo lường & lặp lại        - mức dùng, chi phí phục vụ, hài lòng; điều chỉnh kế hoạch</code></pre>
<p>Nghiên cứu của McKinsey và Deloitte về CĐS dịch vụ tài chính đều nhất quán một điểm: thất bại lớn nhất <strong>không phải do công nghệ</strong> — mà là thất bại chiến lược &amp; quản trị thay đổi (ưu tiên sai, không có lãnh đạo cấp cao đứng sau, không có kế hoạch cho những người bị ảnh hưởng).</p>
<h3>Quản trị thay đổi &amp; văn hoá số</h3>
<ul>
<li><strong>Lãnh đạo</strong> — cần một người cấp cao đứng sau &amp; chịu trách nhiệm cho chuyển đổi, không chỉ một trưởng dự án IT.</li>
<li><strong>Kỹ năng</strong> — đào tạo lại nhân sự có công việc tay chân bị tự động hoá, không chỉ tuyển thêm chuyên gia dữ liệu mới.</li>
<li><strong>Văn hoá</strong> — chấp nhận thử nghiệm nhanh, rẻ và cả thất bại, điều khá lạ với một ngành xưa nay né rủi ro, lấy tuân thủ làm đầu.</li>
</ul>
<h3>Đo lường hiệu quả CĐS</h3>
<p>Bộ chỉ số CĐS tốt kết hợp ba góc nhìn: <strong>mức áp dụng số</strong> (% giao dịch làm qua kênh số, mức dùng app), <strong>trải nghiệm khách hàng</strong> (hài lòng, thời gian xử lý), và <strong>hiệu quả vận hành</strong> (chi phí phục vụ mỗi khách, tỉ lệ xử lý tự động đầu-cuối) — một dự án chỉ nhích một trong ba (vd "số lượt tải app") mà không có hai còn lại thường chưa phải chuyển đổi thật.</p>
<h3>Xu hướng tiếp theo</h3>
<p>Trợ lý AI tạo sinh cho nhân viên &amp; khách hàng, <strong>embedded finance</strong> (sản phẩm tài chính được nhúng vào app không-phải-tài-chính ngay đúng lúc cần), và áp lực ngày càng lớn cho <strong>fintech bền vững/xanh</strong> (tài trợ &amp; báo cáo gắn với tác động môi trường) là những xu hướng chuyên gia phân tích cho là sẽ định hình làn sóng kế tiếp.</p>
<div class="callout"><span class="badge">Ý kết</span> Chuyển đổi số trong dịch vụ tài chính không phải một dự án có ngày kết thúc — mà là một năng lực vận hành. Tổ chức nào coi cái thang ở chương 1 (số hoá dữ liệu → số hoá quy trình → chuyển đổi mô hình) là sáng kiến một lần thường tụt lại sau tổ chức coi đó là thực hành thường trực.</div>`,
  ]]);

const c8q = quiz('dtf201c-quiz-8', 'Quiz 8 — Strategy & change management|||Quiz 8 — Chiến lược & quản trị thay đổi', [
  { id: 'q1', question: 'Theo nghiên cứu McKinsey/Deloitte, nguyên nhân phổ biến nhất khiến CĐS thất bại là gì?', options: ['Công nghệ chọn sai luôn là lý do chính', 'Thất bại chiến lược & quản trị thay đổi (ưu tiên sai, thiếu lãnh đạo, thiếu kế hoạch cho con người)', 'Thiếu tiền đầu tư tuyệt đối', 'Khách hàng không dùng smartphone'], correctIndex: 1, explanation: 'Cả hai nguồn đều nhấn mạnh: thất bại chủ yếu do chiến lược & con người, không phải công nghệ.' },
  { id: 'q2', question: 'Bộ chỉ số đo CĐS "tốt" nên kết hợp ba góc nhìn nào?', options: ['Chỉ số lượt tải app duy nhất', 'Mức áp dụng số, trải nghiệm khách hàng, và hiệu quả vận hành', 'Chỉ giá cổ phiếu công ty', 'Chỉ số hài lòng nhân viên IT'], correctIndex: 1, explanation: 'Ba lăng kính: mức áp dụng số, CX, và hiệu quả (chi phí phục vụ, STP) — thiếu một dễ gây ảo tưởng đã chuyển đổi.' },
  { id: 'q3', question: '"Embedded finance" là xu hướng gì?', options: ['Ngân hàng đóng hết chi nhánh', 'Sản phẩm tài chính được nhúng vào ứng dụng không-phải-tài-chính, ngay tại điểm cần', 'Chỉ áp dụng cho tiền mã hoá', 'Một loại quy định RegTech'], correctIndex: 1, explanation: 'Embedded finance: banking/insurance/lending xuất hiện ngay trong app khác (gọi xe, mua sắm...) đúng lúc khách cần.' },
]);

const taiLieu = doc('dtf201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách tham khảo (Skinner, Chishti & Barberis, King), báo cáo McKinsey/Deloitte, tài liệu chính thức miễn phí, lộ trình tự học.',
  [[
    `<span class="eyebrow">DTF201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Transformation in Financial Services — fintech, channels, Open Banking, data/AI, blockchain, RegTech and strategy — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are the reference books cited throughout this course and free, legal resources to go deeper.</p>
<h3>📘 Reference books (cited in this course)</h3>
<ul>
<li>Chris Skinner — <em>Digital Human: The Fourth Revolution of Humanity Includes Everyone</em>. Author's ongoing commentary: <a href="https://thefinanser.com/" target="_blank" rel="noopener">thefinanser.com</a></li>
<li>Susanne Chishti &amp; Janos Barberis — <em>The FINTECH Book: The Financial Technology Handbook for Investors, Entrepreneurs and Visionaries</em>.</li>
<li>Brett King — <em>Bank 4.0: Banking Everywhere, Never at a Bank</em>. Author site: <a href="https://www.brettking.com/" target="_blank" rel="noopener">brettking.com</a></li>
</ul>
<h3>🌐 Official / free research (McKinsey, Deloitte & regulators)</h3>
<ul>
<li><a href="https://www.mckinsey.com/industries/financial-services/our-insights" target="_blank" rel="noopener">McKinsey — Financial Services Insights</a></li>
<li><a href="https://www2.deloitte.com/us/en/insights/industry/financial-services.html" target="_blank" rel="noopener">Deloitte Insights — Financial Services</a></li>
<li><a href="https://www.bis.org/topic/fintech.htm" target="_blank" rel="noopener">Bank for International Settlements (BIS) — Fintech</a></li>
<li><a href="https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/fintech/" target="_blank" rel="noopener">Financial Stability Board — Fintech &amp; innovation</a></li>
<li><a href="https://www.openbanking.org.uk/" target="_blank" rel="noopener">Open Banking Limited (UK) — Open Banking standard</a></li>
</ul>
<h3>🏫 FPTU official materials</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DTF201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — vocabulary (digitization/digitalization/transformation), King's three waves, fintech categories.</li>
<li><strong>Practice</strong> — pick a real bank/fintech app, map its journey, identify which BaaP/BaaS pattern it uses.</li>
<li><strong>Go deeper</strong> — read one McKinsey or Deloitte financial-services report end to end; compare it to this course's chapters.</li>
<li><strong>Job-ready</strong> — be able to explain Open Banking, RegTech, and a DX roadmap in an interview, with one concrete example each.</li>
</ol></div>`,
    `<span class="eyebrow">DTF201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Chuyển đổi số trong Dịch vụ tài chính — fintech, kênh số, Open Banking, dữ liệu/AI, blockchain, RegTech và chiến lược — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các sách được trích dẫn trong môn này và nguồn miễn phí, hợp pháp để đào sâu.</p>
<h3>📘 Sách tham khảo (được trích dẫn trong môn này)</h3>
<ul>
<li>Chris Skinner — <em>Digital Human: The Fourth Revolution of Humanity Includes Everyone</em>. Bình luận liên tục của tác giả: <a href="https://thefinanser.com/" target="_blank" rel="noopener">thefinanser.com</a></li>
<li>Susanne Chishti &amp; Janos Barberis — <em>The FINTECH Book: The Financial Technology Handbook for Investors, Entrepreneurs and Visionaries</em>.</li>
<li>Brett King — <em>Bank 4.0: Banking Everywhere, Never at a Bank</em>. Trang tác giả: <a href="https://www.brettking.com/" target="_blank" rel="noopener">brettking.com</a></li>
</ul>
<h3>🌐 Nghiên cứu chính thức / miễn phí (McKinsey, Deloitte & cơ quan quản lý)</h3>
<ul>
<li><a href="https://www.mckinsey.com/industries/financial-services/our-insights" target="_blank" rel="noopener">McKinsey — Financial Services Insights</a></li>
<li><a href="https://www2.deloitte.com/us/en/insights/industry/financial-services.html" target="_blank" rel="noopener">Deloitte Insights — Financial Services</a></li>
<li><a href="https://www.bis.org/topic/fintech.htm" target="_blank" rel="noopener">Ngân hàng Thanh toán Quốc tế (BIS) — Fintech</a></li>
<li><a href="https://www.fsb.org/work-of-the-fsb/financial-innovation-and-structural-change/fintech/" target="_blank" rel="noopener">Financial Stability Board — Fintech & đổi mới</a></li>
<li><a href="https://www.openbanking.org.uk/" target="_blank" rel="noopener">Open Banking Limited (UK) — chuẩn Open Banking</a></li>
</ul>
<h3>🏫 Tài liệu chính thức FPTU</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DTF201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — từ vựng (digitization/digitalization/transformation), ba làn sóng của King, các nhóm fintech.</li>
<li><strong>Luyện tập</strong> — chọn một app ngân hàng/fintech thật, vẽ hành trình khách hàng, xác định nó dùng mẫu BaaP hay BaaS.</li>
<li><strong>Đào sâu thực tế</strong> — đọc trọn một báo cáo McKinsey hoặc Deloitte về dịch vụ tài chính; đối chiếu với các chương của môn này.</li>
<li><strong>Sẵn sàng đi làm</strong> — giải thích được Open Banking, RegTech, và một roadmap CĐS khi phỏng vấn, kèm một ví dụ cụ thể cho mỗi khái niệm.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DTF201c',
    slug: 'dtf201c-digital-transformation-in-finance-services',
    title: 'Digital Transformation in Financial Services',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTF201c.webp',
    shortDescription: 'How banks & fintech are reshaped by digital: King’s bank waves, fintech & disruption, digital channels & CX, Open Banking/APIs, data/AI/RPA, blockchain & digital assets, security/RegTech, DX strategy. Bilingual, with cases & quizzes.|||Ngân hàng & fintech bị công nghệ số định hình lại thế nào: làn sóng ngân hàng của King, fintech & disruption, kênh số & CX, Open Banking/API, dữ liệu/AI/RPA, blockchain & tài sản số, an ninh/RegTech, chiến lược CĐS. Song ngữ, có case & quiz.',
    description: 'Môn <strong>DTF201c — Digital Transformation in Financial Services</strong> (kỳ 4, khối Quản trị Kinh doanh) giúp hiểu <strong>ngành tài chính đang bị công nghệ số định hình lại thế nào</strong>. Từ <strong>tổng quan &amp; động lực CĐS</strong> (ba làn sóng ngân hàng theo Brett King) → <strong>fintech &amp; disruption</strong> (unbundling, BaaS) → <strong>kênh số &amp; trải nghiệm khách hàng</strong> (omni-channel, eKYC) → <strong>Open Banking, API &amp; nền tảng</strong> → <strong>dữ liệu, AI &amp; tự động hoá</strong> (credit scoring, fraud detection, RPA) → <strong>blockchain &amp; tài sản số</strong> (CBDC, stablecoin, tokenization) → <strong>an ninh, RegTech &amp; tuân thủ</strong> → <strong>chiến lược CĐS &amp; quản trị thay đổi</strong>. Trích dẫn Skinner (<em>Digital Human</em>), Chishti &amp; Barberis (<em>The FINTECH Book</em>), King (<em>Bank 4.0</em>) và báo cáo McKinsey/Deloitte, song ngữ, có ví dụ thực tế và quiz mỗi chương.',
    whatYouLearn: 'Digitization vs digitalization vs digital transformation; ba làn sóng ngân hàng (Bank 1.0-4.0); phân loại fintech (payments, lending, WealthTech, InsurTech, RegTech, blockchain) & disruption/unbundling; Banking-as-a-Platform vs Banking-as-a-Service; omni-channel, eKYC, customer journey mapping; Open Banking, PSD2, API kinh tế; big data, AI/ML (credit scoring, fraud detection, robo-advisory), RPA & rủi ro bias; blockchain, smart contract, crypto/stablecoin/CBDC/tokenization; an ninh mạng tài chính, RegTech, AML/CFT, bảo vệ dữ liệu; xây chiến lược CĐS, quản trị thay đổi, đo hiệu quả, xu hướng GenAI & embedded finance.',
    requirements: 'Kiến thức nhập môn tài chính/ngân hàng hoặc quản trị kinh doanh cơ bản. Không cần biết lập trình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách tham khảo (Skinner, Chishti & Barberis, King), báo cáo McKinsey/Deloitte, tài liệu chính thức FPTU, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Digitization vs digitalization vs transformation; ba làn sóng ngân hàng King.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & động lực CĐS|||Chapter 1 — Overview & drivers', description: 'Bốn lực đẩy CĐS; Bank 1.0-4.0.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Fintech & disruption|||Chapter 2 — Fintech & disruption', description: 'Phân loại fintech, unbundling, BaaS.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Số hoá kênh & trải nghiệm KH|||Chapter 3 — Channels & CX', description: 'Omni-channel, eKYC, journey mapping.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Open Banking, API & nền tảng|||Chapter 4 — Open Banking & APIs', description: 'PSD2, API, BaaP vs BaaS.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Dữ liệu, AI & tự động hoá|||Chapter 5 — Data, AI & automation', description: 'Credit scoring, fraud detection, RPA, bias.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Blockchain & tài sản số|||Chapter 6 — Blockchain & digital assets', description: 'Smart contract, CBDC, stablecoin, tokenization.', lessons: [c6, c6q] },
    { title: 'Chương 7 — An ninh, RegTech & tuân thủ|||Chapter 7 — Security, RegTech & compliance', description: 'Phishing/ransomware, AML/KYC, bảo vệ dữ liệu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chiến lược CĐS & quản trị thay đổi|||Chapter 8 — DX strategy & change management', description: 'Roadmap CĐS, văn hoá số, đo hiệu quả, xu hướng tương lai.', lessons: [c8, c8q] },
  ],
};
