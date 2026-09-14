/**
 * BFT201 — Applications of Technology in Digital Banking and Finance. Giáo
 * trình FLM (syl): hệ sinh thái fintech, hạ tầng số ngân hàng (core banking,
 * cloud), API & Open Banking, thanh toán số (ví, QR, NAPAS), big data, AI/ML
 * trong ngân hàng, blockchain & tài sản số, an ninh mạng & eKYC. Song ngữ +
 * ví dụ + bài tập. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bft201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển fintech, tài liệu NAPAS/ngân hàng số, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">BFT201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn how technology reshapes banking and finance — fintech ecosystems, core banking &amp; cloud, Open Banking APIs, digital payments, big data, AI/ML, blockchain and cybersecurity — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for BFT201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/The+FINTECH+Book%3A+The+Financial+Technology+Handbook+for+Investors%2C+Entrepreneurs+and+Visionaries-p-9781119218866" target="_blank" rel="noopener"><em>The FINTECH Book</em> — Susanne Chishti &amp; Janos Barberis</a></li>
<li><a href="https://www.wiley.com/en-us/Bank+4.0%3A+Banking+Everywhere%2C+Never+at+a+Bank-p-9781119506510" target="_blank" rel="noopener"><em>Bank 4.0</em> — Brett King</a></li>
<li><a href="https://www.wiley.com/en-us/FinTech%3A+From+Blockchain+to+Holochain-p-9781119548178" target="_blank" rel="noopener"><em>Fintech</em> — Paolo Sironi (ed.)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://api.napas.com.vn" target="_blank" rel="noopener">NAPAS — API &amp; QR standard documentation</a></li>
<li><a href="https://www.sbv.gov.vn" target="_blank" rel="noopener">State Bank of Vietnam (SBV) — regulations on digital banking &amp; eKYC</a></li>
<li><a href="https://stripe.com/docs" target="_blank" rel="noopener">Stripe Docs</a> — modern payment API reference (patterns apply broadly)</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@FintechIsEasy" target="_blank" rel="noopener">Fintech Is Easy</a> — fintech concepts explained simply</li>
<li><a href="https://www.youtube.com/@lexfridman" target="_blank" rel="noopener">Lex Fridman</a> — long-form interviews touching AI &amp; blockchain in finance</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a> — explore/test banking &amp; payment REST APIs</li>
<li><a href="https://jwt.io/" target="_blank" rel="noopener">jwt.io</a> — decode tokens used in Open Banking OAuth2 flows</li>
<li><a href="https://sandbox.napas.com.vn" target="_blank" rel="noopener">NAPAS sandbox</a> — test QR/payment integration safely</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — fintech ecosystem map, core banking basics, Open Banking &amp; API concepts.</li>
<li><strong>Practice</strong> — call a sandbox payment/QR API with Postman, read a real bank API doc end-to-end.</li>
<li><strong>Go deeper</strong> — AI/ML use cases (credit scoring, fraud), blockchain &amp; digital assets.</li>
<li><strong>Job-ready</strong> — eKYC flows, data protection rules, and how a digital bank's tech stack fits together.</li>
</ol></div>`,
    `<span class="eyebrow">BFT201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học công nghệ đang thay đổi ngân hàng &amp; tài chính ra sao — hệ sinh thái fintech, hạ tầng số &amp; cloud, API Open Banking, thanh toán số, big data, AI/ML, blockchain và an ninh mạng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BFT201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/The+FINTECH+Book%3A+The+Financial+Technology+Handbook+for+Investors%2C+Entrepreneurs+and+Visionaries-p-9781119218866" target="_blank" rel="noopener"><em>The FINTECH Book</em> — Susanne Chishti &amp; Janos Barberis</a></li>
<li><a href="https://www.wiley.com/en-us/Bank+4.0%3A+Banking+Everywhere%2C+Never+at+a+Bank-p-9781119506510" target="_blank" rel="noopener"><em>Bank 4.0</em> — Brett King</a></li>
<li><a href="https://www.wiley.com/en-us/FinTech%3A+From+Blockchain+to+Holochain-p-9781119548178" target="_blank" rel="noopener"><em>Fintech</em> — Paolo Sironi (chủ biên)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://api.napas.com.vn" target="_blank" rel="noopener">NAPAS — tài liệu API &amp; chuẩn QR</a></li>
<li><a href="https://www.sbv.gov.vn" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV) — quy định về ngân hàng số &amp; eKYC</a></li>
<li><a href="https://stripe.com/docs" target="_blank" rel="noopener">Stripe Docs</a> — tài liệu API thanh toán hiện đại (mô hình áp dụng rộng)</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@FintechIsEasy" target="_blank" rel="noopener">Fintech Is Easy</a> — giải thích khái niệm fintech đơn giản</li>
<li><a href="https://www.youtube.com/@lexfridman" target="_blank" rel="noopener">Lex Fridman</a> — phỏng vấn dài chạm tới AI &amp; blockchain trong tài chính</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a> — thử/gọi API ngân hàng &amp; thanh toán</li>
<li><a href="https://jwt.io/" target="_blank" rel="noopener">jwt.io</a> — giải mã token dùng trong luồng OAuth2 của Open Banking</li>
<li><a href="https://sandbox.napas.com.vn" target="_blank" rel="noopener">NAPAS sandbox</a> — thử tích hợp QR/thanh toán an toàn</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — bản đồ hệ sinh thái fintech, kiến thức core banking cơ bản, khái niệm Open Banking &amp; API.</li>
<li><strong>Luyện tập</strong> — gọi API thanh toán/QR sandbox bằng Postman, đọc trọn một tài liệu API ngân hàng thật.</li>
<li><strong>Đào sâu</strong> — ứng dụng AI/ML (chấm điểm tín dụng, gian lận), blockchain &amp; tài sản số.</li>
<li><strong>Sẵn sàng đi làm</strong> — luồng eKYC, quy tắc bảo vệ dữ liệu, và cách một stack công nghệ ngân hàng số ghép lại với nhau.</li>
</ol></div>`,
  ]]);

const intro = doc('bft201-0-1-overview', 'Course overview: Technology in digital banking & finance|||Tổng quan: Công nghệ trong ngân hàng & tài chính số',
  'Fintech là gì; vì sao ngân hàng phải số hoá; lộ trình 8 chương từ hệ sinh thái → hạ tầng → API → thanh toán → dữ liệu → AI → blockchain → an ninh.',
  [[
    `<span class="eyebrow">BFT201 · Lesson 0.1 · Overview</span>
<h2>Applications of Technology in Digital Banking &amp; Finance</h2>
<p class="lead">This course maps <strong>how technology is reshaping banking and finance</strong> — from the fintech ecosystem disrupting incumbents, through the digital infrastructure banks run on, to the APIs, payments, data, AI and blockchain layers built on top of it, and the security that has to hold it all together.</p>
<h3>Why banks had to go digital</h3>
<ul>
<li><strong>Customer expectation</strong> — instant, mobile-first, 24/7 service (Brett King's "banking everywhere, never at a bank").</li>
<li><strong>Fintech competition</strong> — startups unbundled single banking functions (payments, lending, wealth) and did them faster, cheaper.</li>
<li><strong>Regulation &amp; opportunity</strong> — Open Banking rules pushed banks to expose APIs, turning data into a shared, competitive asset.</li>
</ul>
<h3>Roadmap</h3>
<p>Fintech ecosystem &amp; disruption → digital infrastructure (core banking, cloud) → APIs &amp; Open Banking → digital payments (wallets, QR, NAPAS) → big data &amp; analytics → AI/ML (credit scoring, chatbots, fraud detection) → blockchain &amp; digital assets → cybersecurity, eKYC &amp; data protection.</p>`,
    `<span class="eyebrow">BFT201 · Bài 0.1 · Tổng quan</span>
<h2>Ứng dụng công nghệ trong ngân hàng &amp; tài chính số</h2>
<p class="lead">Môn này vẽ bản đồ <strong>công nghệ đang thay đổi ngân hàng &amp; tài chính thế nào</strong> — từ hệ sinh thái fintech đang thách thức ngân hàng truyền thống, qua hạ tầng số mà ngân hàng vận hành trên đó, tới các lớp API, thanh toán, dữ liệu, AI và blockchain xây bên trên, và tầng an ninh phải giữ cho mọi thứ vận hành an toàn.</p>
<h3>Vì sao ngân hàng phải số hoá</h3>
<ul>
<li><strong>Kỳ vọng khách hàng</strong> — dịch vụ tức thời, ưu tiên di động, 24/7 (Brett King gọi là "ngân hàng ở mọi nơi, không còn là một nơi phải đến").</li>
<li><strong>Cạnh tranh từ fintech</strong> — startup tách riêng từng chức năng ngân hàng (thanh toán, cho vay, đầu tư) và làm nhanh hơn, rẻ hơn.</li>
<li><strong>Quy định &amp; cơ hội</strong> — các quy định Open Banking buộc ngân hàng mở API, biến dữ liệu thành tài sản cạnh tranh được chia sẻ.</li>
</ul>
<h3>Lộ trình</h3>
<p>Hệ sinh thái fintech &amp; sự phá vỡ → hạ tầng số (core banking, cloud) → API &amp; Open Banking → thanh toán số (ví, QR, NAPAS) → big data &amp; phân tích → AI/ML (chấm điểm tín dụng, chatbot, phát hiện gian lận) → blockchain &amp; tài sản số → an ninh mạng, eKYC &amp; bảo vệ dữ liệu.</p>`,
  ]]);

const c1 = doc('bft201-1-1-fintech-overview', '1.1 — Fintech overview & the disruption of banking|||1.1 — Tổng quan fintech & sự phá vỡ ngành ngân hàng',
  'Fintech là gì, mô hình "unbundling" ngân hàng truyền thống theo từng dịch vụ, cách ngân hàng phản ứng, hệ sinh thái fintech Việt Nam.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 1 · Lesson 1.1</span>
<h2>Fintech overview &amp; the disruption of banking</h2>
<h3>What is fintech?</h3>
<p><strong>Fintech</strong> (financial technology) is the use of technology to deliver financial services faster, cheaper, and more accessibly than traditional institutions — payments, lending, savings, investing and insurance, reinvented as software.</p>
<h3>The "unbundling" of the bank</h3>
<p>A traditional bank bundles many services under one roof: payments, deposits, loans, cards, wealth management. Fintech <strong>unbundles</strong> each function into a focused startup that does it better:</p>
<ul>
<li><strong>Payments</strong> — e-wallets, payment gateways (MoMo, ZaloPay, Stripe).</li>
<li><strong>Lending</strong> — peer-to-peer &amp; alternative-data lending platforms.</li>
<li><strong>WealthTech</strong> — robo-advisors, micro-investing apps.</li>
<li><strong>InsurTech</strong> — usage-based, app-first insurance.</li>
</ul>
<h3>How banks respond</h3>
<p>Incumbent banks answer by partnering with (or acquiring) fintechs, launching digital-only brands, and opening APIs — described in Brett King's <em>Bank 4.0</em> as the shift from "bank as a place" to "banking as an embedded, invisible service".</p>
<pre><code>Traditional bank (bundled):
 [Payments | Deposits | Loans | Cards | Wealth] - all inside one institution

Fintech (unbundled):
 [Payments: wallet app] [Loans: P2P platform] [Wealth: robo-advisor] ...
 - each a focused product, often stitched back together via APIs
</code></pre>
<div class="callout"><span class="badge">Vietnam context</span> Vietnam's fintech scene is dominated by e-wallets (MoMo, ZaloPay, ViettelPay) and NAPAS-powered bank transfers/QR — payments is the fintech vertical most Vietnamese users touch daily.</div>`,
    `<span class="eyebrow">BFT201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan fintech &amp; sự phá vỡ ngành ngân hàng</h2>
<h3>Fintech là gì?</h3>
<p><strong>Fintech</strong> (công nghệ tài chính) là việc dùng công nghệ để cung cấp dịch vụ tài chính nhanh hơn, rẻ hơn và dễ tiếp cận hơn so với tổ chức truyền thống — thanh toán, cho vay, tiết kiệm, đầu tư và bảo hiểm, được làm lại dưới dạng phần mềm.</p>
<h3>"Tách rời" (unbundling) ngân hàng</h3>
<p>Một ngân hàng truyền thống gộp nhiều dịch vụ vào một chỗ: thanh toán, tiền gửi, cho vay, thẻ, quản lý tài sản. Fintech <strong>tách rời</strong> từng chức năng thành một startup tập trung làm tốt hơn:</p>
<ul>
<li><strong>Thanh toán</strong> — ví điện tử, cổng thanh toán (MoMo, ZaloPay, Stripe).</li>
<li><strong>Cho vay</strong> — nền tảng cho vay P2P &amp; dùng dữ liệu thay thế.</li>
<li><strong>WealthTech</strong> — robo-advisor, app đầu tư vi mô.</li>
<li><strong>InsurTech</strong> — bảo hiểm theo mức sử dụng, ưu tiên app.</li>
</ul>
<h3>Ngân hàng phản ứng thế nào</h3>
<p>Ngân hàng lâu đời đáp lại bằng hợp tác (hoặc mua lại) fintech, ra mắt thương hiệu số riêng, và mở API — Brett King trong <em>Bank 4.0</em> mô tả đây là chuyển dịch từ "ngân hàng là một nơi" sang "ngân hàng là một dịch vụ ẩn, gắn khắp mọi nơi".</p>
<pre><code>Ngân hàng truyền thống (gộp):
 [Thanh toán | Tiền gửi | Cho vay | Thẻ | Tài sản] - nằm trong một tổ chức

Fintech (tách rời):
 [Thanh toán: app ví] [Cho vay: nền tảng P2P] [Tài sản: robo-advisor] ...
 - mỗi sản phẩm tập trung, thường được ghép lại qua API
</code></pre>
<div class="callout"><span class="badge">Bối cảnh Việt Nam</span> Fintech Việt Nam nổi bật nhất ở ví điện tử (MoMo, ZaloPay, ViettelPay) và chuyển tiền/QR qua hạ tầng NAPAS — thanh toán là mảng fintech người dùng Việt chạm nhiều nhất mỗi ngày.</div>`,
  ]]);

const c1q = quiz('bft201-quiz-1', 'Quiz 1 — Fintech ecosystem|||Quiz 1 — Hệ sinh thái fintech', [
  { id: 'q1', question: '"Unbundling" ngân hàng nghĩa là gì?', options: ['Ngân hàng gộp mọi dịch vụ vào một app', 'Fintech tách từng chức năng ngân hàng ra làm riêng biệt và tốt hơn', 'Ngân hàng đóng cửa toàn bộ chi nhánh', 'Khách hàng không dùng ngân hàng nữa'], correctIndex: 1, explanation: 'Unbundling: mỗi chức năng (thanh toán, cho vay, đầu tư...) được một startup tập trung làm riêng.' },
  { id: 'q2', question: 'Ở Việt Nam, mảng fintech người dùng chạm nhiều nhất hàng ngày là gì?', options: ['Cho vay P2P', 'Thanh toán (ví điện tử/QR)', 'InsurTech', 'WealthTech'], correctIndex: 1, explanation: 'Ví điện tử và chuyển tiền/QR qua NAPAS là mảng phổ biến nhất với người dùng Việt.' },
  { id: 'q3', question: 'Theo Brett King ("Bank 4.0"), xu hướng của ngân hàng là gì?', options: ['Ngân hàng là một nơi phải đến', 'Ngân hàng trở thành dịch vụ ẩn, có ở mọi nơi', 'Ngân hàng chỉ tồn tại trên chi nhánh vật lý', 'Ngân hàng không cần công nghệ'], correctIndex: 1, explanation: '"Banking everywhere, never at a bank" — ngân hàng trở thành dịch vụ gắn vào mọi trải nghiệm.' },
]);

const c2 = doc('bft201-2-1-core-banking-cloud', '2.1 — Digital banking infrastructure: core banking & cloud|||2.1 — Hạ tầng số ngân hàng: core banking & cloud',
  'Hệ thống core banking (sổ cái, giao dịch); kiến trúc monolith vs microservices; vì sao ngân hàng chuyển lên cloud.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 2 · Lesson 2.1</span>
<h2>Digital banking infrastructure: core banking &amp; cloud</h2>
<h3>What is core banking?</h3>
<p>The <strong>core banking system</strong> is the bank's central nervous system — it keeps the ledger of every account, processes deposits/withdrawals/transfers, and must never lose or double-count a transaction (ACID-style consistency).</p>
<h3>Monolith vs microservices</h3>
<ul>
<li><strong>Monolithic core</strong> — one large system handling accounts, loans, cards together. Reliable and battle-tested, but slow to change (a fintech competitor ships a feature in days; the bank needs months).</li>
<li><strong>Microservices core</strong> — the same functions split into independently deployable services (accounts, cards, payments) that talk over APIs — faster to update, easier to scale one piece at a time.</li>
</ul>
<h3>Why banks move to the cloud</h3>
<p>Cloud infrastructure (AWS, Azure, GCP, or local providers) gives banks elastic scaling (transaction spikes on payday), faster provisioning of new environments, and lower fixed hardware cost — at the price of new work: data-residency rules and security models designed for shared infrastructure.</p>
<pre><code>Core banking transaction flow (simplified):
 Customer app -&gt; API gateway -&gt; Core banking service
   -&gt; debit account A (ledger write)
   -&gt; credit account B (ledger write)
   -&gt; both writes succeed together, or both roll back (no half-done transfer)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A core banking outage is a headline event — this is why banks migrate to cloud/microservices gradually, keeping the old core running in parallel until the new one is proven.</div>`,
    `<span class="eyebrow">BFT201 · Chương 2 · Bài 2.1</span>
<h2>Hạ tầng số ngân hàng: core banking &amp; cloud</h2>
<h3>Core banking là gì?</h3>
<p><strong>Hệ thống core banking</strong> là hệ thần kinh trung tâm của ngân hàng — giữ sổ cái của mọi tài khoản, xử lý gửi/rút/chuyển tiền, và không được mất hay tính trùng bất kỳ giao dịch nào (nhất quán kiểu ACID).</p>
<h3>Monolith vs microservices</h3>
<ul>
<li><strong>Core dạng monolith</strong> — một hệ thống lớn xử lý tài khoản, cho vay, thẻ cùng nhau. Ổn định, đã kiểm chứng qua thời gian, nhưng chậm thay đổi (đối thủ fintech ra tính năng trong vài ngày; ngân hàng cần vài tháng).</li>
<li><strong>Core dạng microservices</strong> — cùng các chức năng đó tách thành dịch vụ triển khai độc lập (tài khoản, thẻ, thanh toán) nói chuyện qua API — cập nhật nhanh hơn, dễ mở rộng từng phần.</li>
</ul>
<h3>Vì sao ngân hàng chuyển lên cloud</h3>
<p>Hạ tầng cloud (AWS, Azure, GCP, hoặc nhà cung cấp trong nước) cho ngân hàng khả năng mở rộng linh hoạt (giao dịch tăng vọt ngày lương), cấp môi trường mới nhanh hơn, và giảm chi phí phần cứng cố định — đổi lại là việc mới: quy định lưu trú dữ liệu và mô hình bảo mật thiết kế cho hạ tầng chia sẻ.</p>
<pre><code>Luồng giao dịch core banking (đơn giản hoá):
 App khách -&gt; API gateway -&gt; Dịch vụ core banking
   -&gt; ghi nợ tài khoản A (ghi sổ cái)
   -&gt; ghi có tài khoản B (ghi sổ cái)
   -&gt; cả hai ghi thành công cùng lúc, hoặc cùng bị rollback (không có chuyển tiền nửa vời)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Sự cố core banking là tin lớn — đây là lý do ngân hàng chuyển sang cloud/microservices dần dần, vẫn chạy core cũ song song cho tới khi core mới được chứng minh ổn định.</div>`,
  ]]);

const c2q = quiz('bft201-quiz-2', 'Quiz 2 — Core banking & cloud|||Quiz 2 — Core banking & cloud', [
  { id: 'q1', question: 'Vai trò chính của core banking là gì?', options: ['Chỉ chạy website ngân hàng', 'Giữ sổ cái & xử lý giao dịch tài khoản chính xác tuyệt đối', 'Chạy quảng cáo cho ngân hàng', 'Quản lý mạng xã hội của ngân hàng'], correctIndex: 1, explanation: 'Core banking là hệ thần kinh trung tâm giữ sổ cái và xử lý giao dịch.' },
  { id: 'q2', question: 'Ưu điểm của kiến trúc microservices so với monolith trong core banking?', options: ['Không cần API nữa', 'Từng dịch vụ triển khai/mở rộng độc lập, dễ cập nhật hơn', 'Luôn rẻ hơn 100% so với monolith', 'Không cần bảo trì gì cả'], correctIndex: 1, explanation: 'Microservices tách chức năng thành dịch vụ độc lập, dễ cập nhật/mở rộng từng phần.' },
  { id: 'q3', question: 'Vì sao ngân hàng chuyển hạ tầng lên cloud?', options: ['Để giảm bảo mật', 'Để mở rộng linh hoạt & giảm chi phí phần cứng cố định', 'Vì bắt buộc theo luật toàn cầu', 'Để xoá dữ liệu khách hàng cũ'], correctIndex: 1, explanation: 'Cloud cho khả năng co giãn linh hoạt và chi phí hạ tầng tối ưu hơn.' },
]);

const c3 = doc('bft201-3-1-api-open-banking', '3.1 — APIs, Open Banking & integration|||3.1 — API, Open Banking & tích hợp',
  'Mô hình Open Banking (PSD2), xác thực OAuth2/scope, ví dụ gọi API ngân hàng.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 3 · Lesson 3.1</span>
<h2>APIs, Open Banking &amp; integration</h2>
<h3>What is Open Banking?</h3>
<p><strong>Open Banking</strong> is the model where banks expose standardized <strong>APIs</strong> so that, with customer consent, third-party apps (a budgeting app, a fintech lender) can read account data or initiate payments — pioneered by regulation like Europe's <strong>PSD2</strong>, and mirrored by voluntary/regulatory efforts elsewhere.</p>
<h3>How a bank API call is secured</h3>
<ul>
<li><strong>OAuth2 / consent</strong> — the customer explicitly authorizes the third-party app to access specific data (e.g. "read balance", not "move money"), for a limited time.</li>
<li><strong>Access token</strong> — a short-lived, signed token the app attaches to every request; it proves the granted permission without resending the customer's password.</li>
<li><strong>Scopes</strong> — fine-grained permissions (account-info-read, payments-initiate) so an app only gets what it needs.</li>
</ul>
<pre><code>GET /accounts/{id}/balance HTTP/1.1
Host: api.bank.example
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

Response:
{
  "accountId": "1234567890",
  "balance": 15250000,
  "currency": "VND"
}
</code></pre>
<h3>Why it matters for finance</h3>
<p>Open Banking is what lets a single super-app show balances from three different banks, or a lender approve a loan by reading verified bank-statement data instead of a scanned PDF — data that used to be locked inside one bank now moves (with consent) across the ecosystem.</p>
<div class="callout"><span class="badge">Security first</span> A leaked access token is as dangerous as a leaked password — APIs must use HTTPS, short token lifetimes, and scoped permissions.</div>`,
    `<span class="eyebrow">BFT201 · Chương 3 · Bài 3.1</span>
<h2>API, Open Banking &amp; tích hợp</h2>
<h3>Open Banking là gì?</h3>
<p><strong>Open Banking</strong> là mô hình ngân hàng mở <strong>API</strong> theo chuẩn, để (với sự đồng ý của khách hàng) ứng dụng bên thứ ba (app quản lý chi tiêu, nền tảng cho vay fintech) đọc dữ liệu tài khoản hoặc khởi tạo thanh toán — khởi xướng bởi quy định như <strong>PSD2</strong> của châu Âu, và được nhiều nơi khác áp dụng theo hướng tự nguyện hoặc bắt buộc.</p>
<h3>Một lời gọi API ngân hàng được bảo vệ ra sao</h3>
<ul>
<li><strong>OAuth2 / sự đồng ý</strong> — khách hàng cấp quyền rõ ràng cho app bên thứ ba truy cập dữ liệu cụ thể (vd "đọc số dư", không phải "chuyển tiền"), trong thời gian giới hạn.</li>
<li><strong>Access token</strong> — token có ký, sống ngắn, app gắn vào mỗi request; chứng minh quyền được cấp mà không cần gửi lại mật khẩu khách hàng.</li>
<li><strong>Scope</strong> — quyền hạn chi tiết (account-info-read, payments-initiate) để app chỉ nhận đúng phần cần.</li>
</ul>
<pre><code>GET /accounts/{id}/balance HTTP/1.1
Host: api.bank.example
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

Response:
{
  "accountId": "1234567890",
  "balance": 15250000,
  "currency": "VND"
}
</code></pre>
<h3>Vì sao quan trọng với tài chính</h3>
<p>Open Banking là thứ cho phép một super-app hiển thị số dư từ ba ngân hàng khác nhau, hay một bên cho vay duyệt khoản vay bằng cách đọc sao kê ngân hàng đã xác thực thay vì file PDF scan — dữ liệu từng bị khoá trong một ngân hàng giờ di chuyển (có đồng ý) khắp hệ sinh thái.</p>
<div class="callout"><span class="badge">Bảo mật là trên hết</span> Một access token bị rò rỉ nguy hiểm như mật khẩu bị rò rỉ — API phải dùng HTTPS, thời gian sống token ngắn, và quyền hạn theo scope.</div>`,
  ]]);

const c3q = quiz('bft201-quiz-3', 'Quiz 3 — API & Open Banking|||Quiz 3 — API & Open Banking', [
  { id: 'q1', question: 'Open Banking cho phép điều gì (có sự đồng ý của khách hàng)?', options: ['Ngân hàng bán dữ liệu tự do', 'Bên thứ ba đọc dữ liệu/khởi tạo thanh toán qua API chuẩn', 'Xoá tài khoản khách hàng', 'Không cần xác thực gì cả'], correctIndex: 1, explanation: 'Open Banking mở API chuẩn cho bên thứ ba, có sự đồng ý và giới hạn quyền của khách hàng.' },
  { id: 'q2', question: 'Access token trong OAuth2 dùng để làm gì?', options: ['Thay thế vĩnh viễn mật khẩu', 'Chứng minh quyền được cấp trong thời gian giới hạn mà không gửi lại mật khẩu', 'Lưu trữ toàn bộ dữ liệu khách hàng', 'Mã hoá ổ cứng máy chủ'], correctIndex: 1, explanation: 'Access token là token ngắn hạn chứng minh quyền, không phải mật khẩu.' },
  { id: 'q3', question: '"Scope" trong API ngân hàng dùng để?', options: ['Giới hạn quyền truy cập cụ thể (ví dụ chỉ đọc số dư)', 'Tăng tốc mạng', 'Đổi mật khẩu khách hàng', 'Ẩn API khỏi Internet'], correctIndex: 0, explanation: 'Scope giới hạn chính xác app được phép làm gì với dữ liệu/quyền nào.' },
]);

const c4 = doc('bft201-4-1-digital-payments', '4.1 — Digital payments: e-wallets, QR, NAPAS & payment gateways|||4.1 — Thanh toán số: ví điện tử, QR, NAPAS & cổng thanh toán',
  'Ví điện tử, mã QR thanh toán (VietQR), hạ tầng chuyển mạch NAPAS, cổng thanh toán thương mại điện tử.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 4 · Lesson 4.1</span>
<h2>Digital payments: e-wallets, QR, NAPAS &amp; payment gateways</h2>
<h3>E-wallets</h3>
<p>An <strong>e-wallet</strong> (MoMo, ZaloPay, ViettelPay) holds a stored balance linked to a bank account or card, letting users pay merchants, transfer to friends, or pay bills from a phone — without touching a physical card each time.</p>
<h3>QR payments</h3>
<p>A <strong>QR code</strong> encodes merchant/account info so a phone camera can initiate a payment instantly. Vietnam's <strong>VietQR</strong> standard (built on NAPAS) lets any bank app or wallet scan the same QR and transfer directly, bank-to-bank — no card network fee.</p>
<h3>NAPAS — the switch behind the scenes</h3>
<p><strong>NAPAS</strong> (National Payment Corporation of Vietnam) is the domestic switch that routes transactions <em>between</em> banks — an interbank transfer, an ATM withdrawal at another bank's machine, or a VietQR payment all pass through NAPAS's switching &amp; clearing infrastructure.</p>
<pre><code>VietQR payment flow:
 Merchant shows QR (bank + account encoded)
   -&gt; Customer's bank app scans QR
   -&gt; App sends transfer request -&gt; NAPAS switch
   -&gt; NAPAS routes to merchant's bank -&gt; credits merchant account
   -&gt; Confirmation shown on both apps within seconds
</code></pre>
<h3>Payment gateways</h3>
<p>For e-commerce, a <strong>payment gateway</strong> (e.g. VNPAY, OnePay, or internationally Stripe) sits between a merchant's website and the banking network, handling card/QR/wallet checkout, tokenizing card data so the merchant never stores raw card numbers.</p>
<div class="callout"><span class="badge">One QR, many apps</span> VietQR's whole value is interoperability — one printed QR code that every participating bank app and wallet can scan and pay, instead of a wall of separate QR codes per provider.</div>`,
    `<span class="eyebrow">BFT201 · Chương 4 · Bài 4.1</span>
<h2>Thanh toán số: ví điện tử, QR, NAPAS &amp; cổng thanh toán</h2>
<h3>Ví điện tử</h3>
<p>Một <strong>ví điện tử</strong> (MoMo, ZaloPay, ViettelPay) giữ số dư liên kết với tài khoản ngân hàng hoặc thẻ, cho phép người dùng trả tiền cho người bán, chuyển cho bạn bè, hoặc thanh toán hoá đơn từ điện thoại — không cần cầm thẻ vật lý mỗi lần.</p>
<h3>Thanh toán QR</h3>
<p>Một <strong>mã QR</strong> mã hoá thông tin người bán/tài khoản để camera điện thoại khởi tạo thanh toán ngay. Chuẩn <strong>VietQR</strong> của Việt Nam (xây trên NAPAS) cho phép app ngân hàng hoặc ví bất kỳ quét cùng một mã QR và chuyển tiền trực tiếp, ngân hàng-tới-ngân hàng — không mất phí mạng thẻ.</p>
<h3>NAPAS — chuyển mạch phía sau</h3>
<p><strong>NAPAS</strong> (Công ty Cổ phần Thanh toán Quốc gia Việt Nam) là chuyển mạch nội địa định tuyến giao dịch <em>giữa</em> các ngân hàng — chuyển tiền liên ngân hàng, rút tiền ATM ngân hàng khác, hay thanh toán VietQR đều đi qua hạ tầng chuyển mạch &amp; bù trừ của NAPAS.</p>
<pre><code>Luồng thanh toán VietQR:
 Người bán hiện QR (mã hoá ngân hàng + tài khoản)
   -&gt; App ngân hàng của khách quét QR
   -&gt; App gửi yêu cầu chuyển tiền -&gt; chuyển mạch NAPAS
   -&gt; NAPAS định tuyến tới ngân hàng người bán -&gt; ghi có tài khoản người bán
   -&gt; Xác nhận hiện trên cả hai app trong vài giây
</code></pre>
<h3>Cổng thanh toán</h3>
<p>Với thương mại điện tử, một <strong>cổng thanh toán</strong> (vd VNPAY, OnePay, hay quốc tế là Stripe) nằm giữa website người bán và hệ thống ngân hàng, xử lý thanh toán thẻ/QR/ví, token hoá dữ liệu thẻ để người bán không bao giờ lưu số thẻ gốc.</p>
<div class="callout"><span class="badge">Một QR, nhiều app</span> Giá trị lớn nhất của VietQR là khả năng liên thông — một mã QR in ra mà mọi app ngân hàng/ví tham gia đều quét và trả tiền được, thay vì một bức tường mã QR riêng cho từng nhà cung cấp.</div>`,
  ]]);

const c4q = quiz('bft201-quiz-4', 'Quiz 4 — Digital payments|||Quiz 4 — Thanh toán số', [
  { id: 'q1', question: 'NAPAS đóng vai trò gì trong hệ thống thanh toán Việt Nam?', options: ['Là một ví điện tử', 'Là hạ tầng chuyển mạch/định tuyến giao dịch liên ngân hàng', 'Là ngân hàng trung ương', 'Là cổng thanh toán quốc tế duy nhất'], correctIndex: 1, explanation: 'NAPAS định tuyến & bù trừ giao dịch giữa các ngân hàng.' },
  { id: 'q2', question: 'Giá trị lớn nhất của chuẩn VietQR là gì?', options: ['Chỉ dùng được trong một ứng dụng', 'Liên thông — nhiều app/ngân hàng cùng quét được một mã QR', 'Thay thế hoàn toàn thẻ tín dụng quốc tế', 'Không cần kết nối mạng'], correctIndex: 1, explanation: 'VietQR liên thông giữa các bank/wallet, chỉ cần một mã QR duy nhất.' },
  { id: 'q3', question: 'Vai trò của cổng thanh toán (payment gateway) trong thương mại điện tử là gì?', options: ['Lưu trữ số thẻ khách hàng công khai', 'Trung gian xử lý thanh toán & token hoá dữ liệu thẻ giữa website và hệ thống ngân hàng', 'Thay thế NAPAS', 'Không liên quan đến bảo mật'], correctIndex: 1, explanation: 'Payment gateway xử lý checkout và token hoá dữ liệu thẻ để bảo mật.' },
]);

const c5 = doc('bft201-5-1-big-data-analytics', '5.1 — Big data & analytics in finance|||5.1 — Big data & phân tích trong tài chính',
  'Dữ liệu giao dịch làm nguồn phân tích; phân khúc khách hàng, đánh giá rủi ro, cá nhân hoá sản phẩm tài chính.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 5 · Lesson 5.1</span>
<h2>Big data &amp; analytics in finance</h2>
<h3>Where the data comes from</h3>
<p>Every swipe, transfer, login and support chat leaves a data trail. Banks combine <strong>transaction history</strong>, <strong>behavioral data</strong> (app usage, login patterns) and, where permitted, <strong>alternative data</strong> (utility bill payments, e-commerce activity) to build a much richer picture of a customer than a paper application ever could.</p>
<h3>What analytics is used for</h3>
<ul>
<li><strong>Customer segmentation</strong> — grouping customers by behavior to target the right product (a savings nudge vs. a loan offer).</li>
<li><strong>Risk &amp; credit assessment</strong> — spotting patterns that predict default, feeding into credit-scoring models (Chapter 6).</li>
<li><strong>Personalization</strong> — recommending the right card, insurance, or investment product based on spending patterns.</li>
<li><strong>Operational analytics</strong> — forecasting ATM cash demand, call-center load, fraud spikes.</li>
</ul>
<pre><code>Data pipeline (simplified):
 Core banking + app logs + card network
   -&gt; Data lake / warehouse (raw, then cleaned)
   -&gt; Feature engineering (spend categories, frequency, recency)
   -&gt; Analytics / ML models -&gt; dashboards &amp; decisions
</code></pre>
<div class="callout"><span class="badge">Data quality &gt; data quantity</span> A model trained on dirty, duplicated or mislabeled transaction data will make confidently wrong predictions — most of the real work in financial analytics is cleaning and validating data before any model touches it.</div>`,
    `<span class="eyebrow">BFT201 · Chương 5 · Bài 5.1</span>
<h2>Big data &amp; phân tích trong tài chính</h2>
<h3>Dữ liệu đến từ đâu</h3>
<p>Mỗi lần chạm thẻ, chuyển tiền, đăng nhập hay chat hỗ trợ đều để lại một dấu vết dữ liệu. Ngân hàng kết hợp <strong>lịch sử giao dịch</strong>, <strong>dữ liệu hành vi</strong> (cách dùng app, kiểu đăng nhập) và, khi được phép, <strong>dữ liệu thay thế</strong> (thanh toán hoá đơn tiện ích, hoạt động thương mại điện tử) để dựng một bức tranh khách hàng chi tiết hơn nhiều so với một tờ đơn giấy.</p>
<h3>Phân tích được dùng để làm gì</h3>
<ul>
<li><strong>Phân khúc khách hàng</strong> — nhóm khách hàng theo hành vi để nhắm đúng sản phẩm (gợi ý tiết kiệm vs. đề xuất khoản vay).</li>
<li><strong>Đánh giá rủi ro &amp; tín dụng</strong> — phát hiện mẫu dự báo khả năng vỡ nợ, làm đầu vào cho mô hình chấm điểm tín dụng (Chương 6).</li>
<li><strong>Cá nhân hoá</strong> — gợi ý đúng loại thẻ, bảo hiểm, hay sản phẩm đầu tư dựa trên hành vi chi tiêu.</li>
<li><strong>Phân tích vận hành</strong> — dự báo nhu cầu tiền mặt ATM, tải trung tâm chăm sóc khách hàng, đợt tăng gian lận.</li>
</ul>
<pre><code>Pipeline dữ liệu (đơn giản hoá):
 Core banking + log app + mạng thẻ
   -&gt; Data lake / warehouse (thô, rồi làm sạch)
   -&gt; Feature engineering (nhóm chi tiêu, tần suất, độ gần đây)
   -&gt; Mô hình phân tích/ML -&gt; dashboard &amp; quyết định
</code></pre>
<div class="callout"><span class="badge">Chất lượng &gt; số lượng</span> Một mô hình huấn luyện trên dữ liệu bẩn, trùng lặp hoặc gán nhãn sai sẽ đưa ra dự đoán sai một cách tự tin — phần lớn công việc thật trong phân tích tài chính là làm sạch và kiểm chứng dữ liệu trước khi mô hình chạm vào.</div>`,
  ]]);

const c5q = quiz('bft201-quiz-5', 'Quiz 5 — Big data & analytics|||Quiz 5 — Big data & phân tích', [
  { id: 'q1', question: 'Ngoài dữ liệu giao dịch, ngân hàng còn có thể dùng "dữ liệu thay thế" nào (khi được phép) để đánh giá khách hàng?', options: ['Chỉ số CMND', 'Lịch sử thanh toán hoá đơn tiện ích, hoạt động thương mại điện tử', 'Màu tóc khách hàng', 'Số điện thoại chọn ngẫu nhiên'], correctIndex: 1, explanation: 'Dữ liệu thay thế (utility, e-commerce...) giúp đánh giá khách hàng khi thiếu lịch sử tín dụng truyền thống.' },
  { id: 'q2', question: 'Phân khúc khách hàng (customer segmentation) trong ngân hàng dùng để làm gì?', options: ['Xoá tài khoản ít hoạt động', 'Nhóm khách hàng theo hành vi để đề xuất sản phẩm phù hợp', 'In sao kê giấy', 'Thay đổi lãi suất ngẫu nhiên'], correctIndex: 1, explanation: 'Phân khúc giúp nhắm đúng sản phẩm/dịch vụ theo hành vi từng nhóm khách hàng.' },
  { id: 'q3', question: 'Vì sao "chất lượng dữ liệu quan trọng hơn số lượng"?', options: ['Dữ liệu bẩn khiến mô hình dự đoán sai một cách tự tin', 'Dữ liệu nhiều luôn tốt hơn dữ liệu sạch', 'Chất lượng không ảnh hưởng tới mô hình', 'Số lượng dữ liệu quyết định 100% độ chính xác'], correctIndex: 0, explanation: 'Dữ liệu bẩn/sai nhãn khiến mô hình "tự tin" đưa ra kết luận sai.' },
]);

const c6 = doc('bft201-6-1-ai-ml-banking', '6.1 — AI/ML in banking: credit scoring, chatbots & fraud detection|||6.1 — AI/ML trong ngân hàng: chấm điểm tín dụng, chatbot & phát hiện gian lận',
  'Mô hình chấm điểm tín dụng bằng ML, chatbot/trợ lý ảo chăm sóc khách hàng, hệ thống phát hiện gian lận thời gian thực.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 6 · Lesson 6.1</span>
<h2>AI/ML in banking: credit scoring, chatbots &amp; fraud detection</h2>
<h3>Credit scoring</h3>
<p>Traditional credit scores rely on a handful of factors (payment history, debt ratio). <strong>ML-based credit scoring</strong> can weigh hundreds of signals — including alternative data — to score customers with thin or no credit history, expanding access to credit while (done right) still predicting default risk accurately.</p>
<h3>Chatbots &amp; virtual assistants</h3>
<p>Banking chatbots handle balance checks, card blocking, FAQs and simple transfers through natural-language chat, freeing human agents for complex cases. Modern versions use large language models to understand intent beyond fixed keyword matching.</p>
<h3>Real-time fraud detection</h3>
<p>A fraud model scores every transaction <em>as it happens</em> — comparing it against the customer's normal pattern (location, amount, merchant type, time of day). An anomalous transaction can be held for extra verification (OTP) or blocked, within milliseconds.</p>
<pre><code>Fraud scoring (simplified):
 Transaction arrives -&gt; extract features (amount, location, device, time)
   -&gt; compare to customer's historical pattern
   -&gt; risk score computed
   -&gt; score &gt; threshold -&gt; step-up auth (OTP) or block
   -&gt; score &lt;= threshold -&gt; approve instantly
</code></pre>
<div class="callout"><span class="badge">Human in the loop</span> AI/ML systems in finance flag and score — the final decision on a large loan or a disputed fraud case still routes to a human, because a wrong automated call has real financial and legal consequences.</div>`,
    `<span class="eyebrow">BFT201 · Chương 6 · Bài 6.1</span>
<h2>AI/ML trong ngân hàng: chấm điểm tín dụng, chatbot &amp; phát hiện gian lận</h2>
<h3>Chấm điểm tín dụng</h3>
<p>Điểm tín dụng truyền thống dựa vào vài yếu tố (lịch sử thanh toán, tỉ lệ nợ). <strong>Chấm điểm tín dụng bằng ML</strong> có thể xét hàng trăm tín hiệu — kể cả dữ liệu thay thế — để chấm điểm khách hàng có lịch sử tín dụng mỏng hoặc chưa có, mở rộng khả năng tiếp cận tín dụng mà (nếu làm đúng) vẫn dự báo chính xác rủi ro vỡ nợ.</p>
<h3>Chatbot &amp; trợ lý ảo</h3>
<p>Chatbot ngân hàng xử lý kiểm tra số dư, khoá thẻ, câu hỏi thường gặp và chuyển tiền đơn giản qua chat ngôn ngữ tự nhiên, giải phóng nhân viên cho các trường hợp phức tạp. Phiên bản hiện đại dùng mô hình ngôn ngữ lớn để hiểu ý định vượt xa khớp từ khoá cố định.</p>
<h3>Phát hiện gian lận thời gian thực</h3>
<p>Mô hình gian lận chấm điểm mỗi giao dịch <em>ngay lúc phát sinh</em> — so sánh với mẫu hành vi bình thường của khách hàng (vị trí, số tiền, loại người bán, giờ trong ngày). Một giao dịch bất thường có thể bị giữ để xác thực thêm (OTP) hoặc chặn, trong vài mili giây.</p>
<pre><code>Chấm điểm gian lận (đơn giản hoá):
 Giao dịch tới -&gt; rút đặc trưng (số tiền, vị trí, thiết bị, thời gian)
   -&gt; so sánh với mẫu lịch sử của khách hàng
   -&gt; tính điểm rủi ro
   -&gt; điểm &gt; ngưỡng -&gt; xác thực nâng cao (OTP) hoặc chặn
   -&gt; điểm &lt;= ngưỡng -&gt; duyệt ngay
</code></pre>
<div class="callout"><span class="badge">Con người trong vòng lặp</span> Hệ thống AI/ML trong tài chính đánh dấu &amp; chấm điểm — quyết định cuối cùng cho một khoản vay lớn hay một tranh chấp gian lận vẫn chuyển tới con người, vì một quyết định tự động sai có hậu quả tài chính &amp; pháp lý thật.</div>`,
  ]]);

const c6q = quiz('bft201-quiz-6', 'Quiz 6 — AI/ML in banking|||Quiz 6 — AI/ML trong ngân hàng', [
  { id: 'q1', question: 'Lợi ích chính của chấm điểm tín dụng bằng ML so với mô hình truyền thống là gì?', options: ['Luôn cho vay tất cả mọi người', 'Có thể xét nhiều tín hiệu hơn (kể cả dữ liệu thay thế), mở rộng khả năng tiếp cận tín dụng', 'Không cần dữ liệu nào cả', 'Chỉ áp dụng cho doanh nghiệp lớn'], correctIndex: 1, explanation: 'ML xét được nhiều tín hiệu/dữ liệu thay thế hơn mô hình truyền thống.' },
  { id: 'q2', question: 'Hệ thống phát hiện gian lận thời gian thực hoạt động dựa trên nguyên tắc gì?', options: ['Kiểm tra thủ công sau một tuần', 'So sánh giao dịch hiện tại với mẫu hành vi thông thường của khách hàng để tính điểm rủi ro ngay lúc phát sinh', 'Chặn toàn bộ giao dịch quốc tế', 'Không cần dữ liệu lịch sử'], correctIndex: 1, explanation: 'Fraud detection so khớp giao dịch mới với mẫu hành vi lịch sử trong thời gian thực.' },
  { id: 'q3', question: 'Vì sao hệ thống AI/ML trong ngân hàng vẫn cần "con người trong vòng lặp" (human in the loop)?', options: ['Vì AI luôn đúng nên không cần', 'Vì quyết định sai trên khoản vay/gian lận lớn có hậu quả tài chính-pháp lý thật', 'Vì luật cấm dùng AI hoàn toàn', 'Vì AI không thể chạy 24/7'], correctIndex: 1, explanation: 'Quyết định lớn cần con người vì hậu quả thật của một quyết định sai.' },
]);

const c7 = doc('bft201-7-1-blockchain-digital-assets', '7.1 — Blockchain & digital assets in finance|||7.1 — Blockchain & tài sản số trong tài chính',
  'Sổ cái phân tán, hợp đồng thông minh, stablecoin/CBDC, ứng dụng trong thanh toán xuyên biên giới & tài trợ thương mại.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 7 · Lesson 7.1</span>
<h2>Blockchain &amp; digital assets in finance</h2>
<h3>What blockchain adds</h3>
<p>A <strong>blockchain</strong> is a distributed ledger that many parties hold copies of and agree on, without a single central authority — each block cryptographically links to the previous one, making past records extremely hard to alter unnoticed.</p>
<h3>Smart contracts</h3>
<p>A <strong>smart contract</strong> is code that runs automatically on the ledger when conditions are met — e.g. releasing payment the instant a shipment is confirmed delivered, with no manual reconciliation step.</p>
<h3>Where finance actually uses it</h3>
<ul>
<li><strong>Cross-border payments</strong> — settling between banks without the multi-day correspondent-banking chain.</li>
<li><strong>Trade finance</strong> — a shared ledger for letters of credit, so all parties see the same shipment/payment status.</li>
<li><strong>Stablecoins</strong> — digital tokens pegged to a fiat currency, used as a fast settlement rail.</li>
<li><strong>CBDC (Central Bank Digital Currency)</strong> — a digital form of a country's own currency, issued and backed directly by its central bank.</li>
</ul>
<pre><code>Traditional cross-border payment:
 Bank A -&gt; correspondent bank -&gt; correspondent bank -&gt; Bank B  (days, multiple fees)

Blockchain-based settlement:
 Bank A and Bank B both hold/verify the same ledger entry (minutes, one settlement layer)
</code></pre>
<div class="callout"><span class="badge">Hype vs. reality</span> Most production blockchain use in finance today is narrow and infrastructural (settlement, trade finance) — not the speculative trading that dominates headlines.</div>`,
    `<span class="eyebrow">BFT201 · Chương 7 · Bài 7.1</span>
<h2>Blockchain &amp; tài sản số trong tài chính</h2>
<h3>Blockchain thêm được gì</h3>
<p>Một <strong>blockchain</strong> là sổ cái phân tán mà nhiều bên cùng giữ bản sao và cùng thống nhất, không cần một cơ quan trung tâm duy nhất — mỗi block liên kết mã hoá với block trước, khiến bản ghi cũ rất khó bị sửa mà không bị phát hiện.</p>
<h3>Hợp đồng thông minh</h3>
<p>Một <strong>hợp đồng thông minh (smart contract)</strong> là đoạn mã tự động thực thi trên sổ cái khi điều kiện được đáp ứng — vd giải ngân thanh toán ngay khi lô hàng được xác nhận đã giao, không cần bước đối soát tay.</p>
<h3>Tài chính thực tế dùng blockchain ở đâu</h3>
<ul>
<li><strong>Thanh toán xuyên biên giới</strong> — thanh toán giữa các ngân hàng mà không cần chuỗi ngân hàng đại lý kéo dài nhiều ngày.</li>
<li><strong>Tài trợ thương mại</strong> — sổ cái chung cho tín dụng thư (L/C), để mọi bên thấy cùng trạng thái lô hàng/thanh toán.</li>
<li><strong>Stablecoin</strong> — token số neo theo một đồng tiền pháp định, dùng như đường thanh toán nhanh.</li>
<li><strong>CBDC (tiền số ngân hàng trung ương)</strong> — dạng số của đồng tiền quốc gia, do ngân hàng trung ương phát hành &amp; bảo đảm trực tiếp.</li>
</ul>
<pre><code>Thanh toán xuyên biên giới truyền thống:
 Ngân hàng A -&gt; ngân hàng đại lý -&gt; ngân hàng đại lý -&gt; Ngân hàng B  (nhiều ngày, nhiều phí)

Thanh toán dựa trên blockchain:
 Ngân hàng A và B cùng giữ/xác nhận một bản ghi sổ cái (vài phút, một tầng thanh toán)
</code></pre>
<div class="callout"><span class="badge">Kỳ vọng vs. thực tế</span> Phần lớn ứng dụng blockchain thật trong tài chính hiện nay hẹp và mang tính hạ tầng (thanh toán, tài trợ thương mại) — không phải giao dịch đầu cơ chiếm hết tiêu đề báo.</div>`,
  ]]);

const c7q = quiz('bft201-quiz-7', 'Quiz 7 — Blockchain & digital assets|||Quiz 7 — Blockchain & tài sản số', [
  { id: 'q1', question: 'Đặc điểm cốt lõi của blockchain là gì?', options: ['Chỉ một bên kiểm soát toàn bộ dữ liệu', 'Sổ cái phân tán, nhiều bên cùng giữ bản sao và khó sửa đổi lịch sử mà không bị phát hiện', 'Dữ liệu tự động xoá sau 24 giờ', 'Không thể lưu giao dịch tài chính'], correctIndex: 1, explanation: 'Blockchain là sổ cái phân tán, khó sửa lịch sử mà không bị phát hiện.' },
  { id: 'q2', question: 'Smart contract (hợp đồng thông minh) làm gì?', options: ['Chỉ là văn bản pháp lý in trên giấy', 'Tự động thực thi khi điều kiện được đáp ứng, không cần đối soát tay', 'Thay thế toàn bộ luật hợp đồng', 'Chỉ hoạt động trên ví điện tử'], correctIndex: 1, explanation: 'Smart contract là mã tự động thực thi khi điều kiện thoả.' },
  { id: 'q3', question: 'CBDC là gì?', options: ['Một loại tiền mã hoá phi tập trung không ai kiểm soát', 'Đồng tiền số của một quốc gia do ngân hàng trung ương phát hành & bảo đảm', 'Một cổng thanh toán thương mại điện tử', 'Một chuẩn mã QR'], correctIndex: 1, explanation: 'CBDC là tiền số chính thức do ngân hàng trung ương phát hành.' },
]);

const c8 = doc('bft201-8-1-cybersecurity-ekyc', '8.1 — Cybersecurity, eKYC & customer data protection|||8.1 — An ninh mạng, eKYC & bảo vệ dữ liệu khách hàng',
  'Mối đe doạ an ninh ngân hàng số (phishing, SIM swap), eKYC (xác thực danh tính điện tử), nguyên tắc bảo vệ dữ liệu khách hàng.',
  [[
    `<span class="eyebrow">BFT201 · Chapter 8 · Lesson 8.1</span>
<h2>Cybersecurity, eKYC &amp; customer data protection</h2>
<h3>Common threats to digital banking</h3>
<ul>
<li><strong>Phishing</strong> — fake bank websites/messages tricking customers into revealing passwords or OTPs.</li>
<li><strong>SIM swap</strong> — an attacker hijacks a victim's phone number to intercept SMS OTPs.</li>
<li><strong>Account takeover</strong> — using leaked credentials (often from unrelated breaches) to log into a banking account.</li>
<li><strong>API abuse</strong> — attacking a bank's own APIs directly instead of the app's front-end.</li>
</ul>
<h3>eKYC — electronic identity verification</h3>
<p><strong>eKYC (electronic Know Your Customer)</strong> lets a bank open an account remotely: the customer photographs their ID, a <strong>liveness check</strong> (e.g. a short selfie video) confirms a real person is present (not a photo or deepfake), and the details are cross-checked against the ID's data — replacing an in-branch visit with a phone camera.</p>
<pre><code>eKYC flow (simplified):
 Scan ID document -&gt; OCR extracts name/ID number/DOB
   -&gt; Liveness check (selfie/video, anti-spoofing)
   -&gt; Face match: selfie vs ID photo
   -&gt; Cross-check against watchlists / national ID database
   -&gt; Account approved or sent for manual review
</code></pre>
<h3>Protecting customer data</h3>
<p>Beyond stopping intrusions, banks must protect data at rest (encryption), limit who can see what (least-privilege access), and follow data-protection regulation on how customer data is collected, stored and shared with third parties (including Open Banking partners from Chapter 3).</p>
<div class="callout"><span class="badge">Security is layered</span> No single control is enough — OTP, device fingerprinting, transaction-risk scoring, encryption and staff access controls all have to work together, because attackers only need one weak layer.</div>`,
    `<span class="eyebrow">BFT201 · Chương 8 · Bài 8.1</span>
<h2>An ninh mạng, eKYC &amp; bảo vệ dữ liệu khách hàng</h2>
<h3>Các mối đe doạ phổ biến với ngân hàng số</h3>
<ul>
<li><strong>Phishing</strong> — website/tin nhắn giả mạo ngân hàng lừa khách hàng tiết lộ mật khẩu hoặc OTP.</li>
<li><strong>SIM swap</strong> — kẻ tấn công chiếm quyền số điện thoại của nạn nhân để chặn OTP gửi qua SMS.</li>
<li><strong>Chiếm tài khoản (account takeover)</strong> — dùng thông tin đăng nhập bị rò rỉ (thường từ vụ lộ dữ liệu không liên quan) để đăng nhập tài khoản ngân hàng.</li>
<li><strong>Lạm dụng API</strong> — tấn công trực tiếp vào API của ngân hàng thay vì giao diện app.</li>
</ul>
<h3>eKYC — xác thực danh tính điện tử</h3>
<p><strong>eKYC (electronic Know Your Customer)</strong> cho phép ngân hàng mở tài khoản từ xa: khách hàng chụp giấy tờ tuỳ thân, một <strong>kiểm tra liveness</strong> (vd video selfie ngắn) xác nhận có một người thật đang hiện diện (không phải ảnh hay deepfake), và thông tin được đối chiếu với dữ liệu trên giấy tờ — thay thế việc đến chi nhánh bằng camera điện thoại.</p>
<pre><code>Luồng eKYC (đơn giản hoá):
 Quét giấy tờ tuỳ thân -&gt; OCR rút tên/số ID/ngày sinh
   -&gt; Kiểm tra liveness (selfie/video, chống giả mạo)
   -&gt; So khớp khuôn mặt: selfie vs ảnh giấy tờ
   -&gt; Đối chiếu danh sách cảnh báo / cơ sở dữ liệu định danh quốc gia
   -&gt; Tài khoản được duyệt hoặc chuyển kiểm tra thủ công
</code></pre>
<h3>Bảo vệ dữ liệu khách hàng</h3>
<p>Ngoài chặn xâm nhập, ngân hàng phải bảo vệ dữ liệu lưu trữ (mã hoá), giới hạn ai thấy được gì (quyền truy cập tối thiểu cần thiết), và tuân theo quy định bảo vệ dữ liệu về cách thu thập, lưu trữ và chia sẻ dữ liệu khách hàng với bên thứ ba (kể cả đối tác Open Banking ở Chương 3).</p>
<div class="callout"><span class="badge">Bảo mật theo nhiều lớp</span> Không một lớp kiểm soát nào là đủ — OTP, nhận diện thiết bị, chấm điểm rủi ro giao dịch, mã hoá và kiểm soát quyền nhân viên đều phải cùng hoạt động, vì kẻ tấn công chỉ cần khai thác được một lớp yếu.</div>`,
  ]]);

const c8q = quiz('bft201-quiz-8', 'Quiz 8 — Cybersecurity & eKYC|||Quiz 8 — An ninh mạng & eKYC', [
  { id: 'q1', question: '"SIM swap" là kiểu tấn công gì?', options: ['Đánh cắp thẻ ATM vật lý', 'Kẻ tấn công chiếm quyền số điện thoại để chặn OTP gửi qua SMS', 'Giả mạo email nội bộ ngân hàng', 'Tấn công trực tiếp máy chủ core banking'], correctIndex: 1, explanation: 'SIM swap chiếm quyền số điện thoại để chặn OTP SMS.' },
  { id: 'q2', question: '"Liveness check" trong eKYC dùng để làm gì?', options: ['Kiểm tra tốc độ mạng', 'Xác nhận có một người thật đang hiện diện (không phải ảnh/deepfake) khi xác thực danh tính', 'Đếm số lần đăng nhập', 'Mã hoá dữ liệu trên máy chủ'], correctIndex: 1, explanation: 'Liveness check chống giả mạo bằng ảnh tĩnh hoặc deepfake.' },
  { id: 'q3', question: 'Vì sao bảo mật ngân hàng số cần "nhiều lớp" (layered security)?', options: ['Vì một lớp luôn đủ', 'Vì kẻ tấn công chỉ cần khai thác được một lớp yếu nếu chỉ có một lớp phòng thủ', 'Vì luật yêu cầu đúng 5 lớp', 'Vì nhiều lớp làm hệ thống chậm hơn nên an toàn hơn'], correctIndex: 1, explanation: 'Nhiều lớp bảo mật giảm rủi ro khi một lớp bị vượt qua.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'BFT201',
    slug: 'bft201-applications-of-technology-in-digital-banking-and-finance',
    title: 'Applications of Technology in Digital Banking and Finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BFT201.webp',
    shortDescription: 'How technology reshapes banking & finance — fintech, core banking & cloud, Open Banking APIs, digital payments (wallets, QR, NAPAS), big data, AI/ML (credit scoring, fraud detection), blockchain & cybersecurity/eKYC. Bilingual, with examples & quizzes.|||Công nghệ đang thay đổi ngân hàng & tài chính — fintech, core banking & cloud, API/Open Banking, thanh toán số (ví, QR, NAPAS), big data, AI/ML (tín dụng, gian lận), blockchain & an ninh mạng/eKYC. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>BFT201 — Applications of Technology in Digital Banking and Finance</strong> (kỳ 3, khối Quản trị Kinh doanh) giúp hiểu <strong>công nghệ đang thay đổi ngân hàng &amp; tài chính thế nào</strong>. Từ <strong>hệ sinh thái fintech</strong> (unbundling, ví điện tử) → <strong>hạ tầng số</strong> (core banking, cloud) → <strong>API &amp; Open Banking</strong> → <strong>thanh toán số</strong> (VietQR, NAPAS, cổng thanh toán) → <strong>big data &amp; phân tích</strong> → <strong>AI/ML</strong> (chấm điểm tín dụng, chatbot, phát hiện gian lận) → <strong>blockchain &amp; tài sản số</strong> → <strong>an ninh mạng, eKYC &amp; bảo vệ dữ liệu</strong>. Bám giáo trình FLM, song ngữ, có ví dụ minh hoạ và quiz mỗi chương.',
    whatYouLearn: 'Hệ sinh thái fintech & "unbundling" ngân hàng; core banking & kiến trúc microservices/cloud; API ngân hàng, OAuth2 & mô hình Open Banking; ví điện tử, VietQR & vai trò NAPAS; cổng thanh toán thương mại điện tử; pipeline dữ liệu & phân khúc khách hàng; chấm điểm tín dụng bằng ML, chatbot, phát hiện gian lận thời gian thực; blockchain, smart contract, stablecoin & CBDC; các mối đe doạ an ninh (phishing, SIM swap), eKYC & bảo vệ dữ liệu khách hàng.',
    requirements: 'Kiến thức nhập môn tài chính/ngân hàng cơ bản; không yêu cầu biết lập trình trước, các ví dụ API/code chỉ mang tính minh hoạ khái niệm.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách kinh điển fintech, tài liệu NAPAS/ngân hàng số, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Fintech, vì sao ngân hàng số hoá, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan fintech & hệ sinh thái|||Chapter 1 — Fintech overview & ecosystem', description: 'Unbundling ngân hàng, phản ứng của ngân hàng, bối cảnh Việt Nam.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hạ tầng số ngân hàng|||Chapter 2 — Digital banking infrastructure', description: 'Core banking, monolith vs microservices, cloud.', lessons: [c2, c2q] },
    { title: 'Chương 3 — API, Open Banking & tích hợp|||Chapter 3 — APIs, Open Banking & integration', description: 'OAuth2, scope, ví dụ gọi API ngân hàng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thanh toán số|||Chapter 4 — Digital payments', description: 'Ví điện tử, VietQR, NAPAS, cổng thanh toán.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Big data & phân tích|||Chapter 5 — Big data & analytics', description: 'Pipeline dữ liệu, phân khúc khách hàng, rủi ro.', lessons: [c5, c5q] },
    { title: 'Chương 6 — AI/ML trong ngân hàng|||Chapter 6 — AI/ML in banking', description: 'Chấm điểm tín dụng, chatbot, phát hiện gian lận.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Blockchain & tài sản số|||Chapter 7 — Blockchain & digital assets', description: 'Sổ cái phân tán, smart contract, stablecoin, CBDC.', lessons: [c7, c7q] },
    { title: 'Chương 8 — An ninh mạng & eKYC|||Chapter 8 — Cybersecurity & eKYC', description: 'Mối đe doạ, eKYC, bảo vệ dữ liệu khách hàng.', lessons: [c8, c8q] },
  ],
};
