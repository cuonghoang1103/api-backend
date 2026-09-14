/**
 * EPT301 — E-payment Processes and Technology. Giáo trình FLM (syl):
 * hệ sinh thái thanh toán điện tử, thẻ & mạng lưới thẻ, cổng thanh toán,
 * ví điện tử/QR/NFC, chuyển khoản thời gian thực (NAPAS 24/7), thanh toán
 * xuyên biên giới & tiền số/CBDC, an ninh thanh toán (PCI-DSS/3DS/tokenization),
 * phòng chống gian lận & xu hướng fintech. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ept301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, tài liệu chuẩn ngành (Visa/Mastercard/NAPAS/PCI-DSS), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EPT301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn E-payment Processes and Technology — card networks, gateways, e-wallets, real-time transfers, cross-border payments and payment security — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources plus the real-world standards docs the industry actually uses.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EPT301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Electronic Payment Systems</em> — Donal O'Mahony, Michael Peirce &amp; Hitesh Tewari (Artech House) — the classic academic reference for payment protocols and security models.</li>
<li><em>Payments Systems in the U.S.</em> — Carol Coye Benson &amp; Scott Loftesness (Glenbrook Partners) — industry-standard practitioner reference on how real payment rails work end to end.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://usa.visa.com/partner-with-us/payment-technology.html" target="_blank" rel="noopener">Visa — payment technology &amp; network overview</a></li>
<li><a href="https://developer.mastercard.com/" target="_blank" rel="noopener">Mastercard Developers</a> — network specs, APIs, sandbox docs</li>
<li><a href="https://www.napas.com.vn/" target="_blank" rel="noopener">NAPAS</a> — Vietnam's national payment switch (247 real-time transfer, VietQR)</li>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council</a> — official PCI-DSS documents</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV)</a> — quy định thanh toán điện tử trong nước</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GlenbrookPartners" target="_blank" rel="noopener">Glenbrook Partners</a> — payments industry explainers</li>
<li><a href="https://www.youtube.com/results?search_query=how+card+payments+work" target="_blank" rel="noopener">"How card payments work"</a> — search results: multiple well-produced explainer videos on the 4-party model</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://stripe.com/docs" target="_blank" rel="noopener">Stripe Docs</a> — read a real payment gateway's API &amp; webhook design (even without an account)</li>
<li><a href="https://www.vietqr.io/" target="_blank" rel="noopener">VietQR.io</a> — try VietQR generation live</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — payment ecosystem players, the 4-party card model, gateway vs. processor vs. acquirer.</li>
<li><strong>Practice</strong> — trace one transaction end to end (authorization → clearing → settlement) for a card payment and for a QR/e-wallet payment; compare them.</li>
<li><strong>Go deeper</strong> — real-time transfer rails (NAPAS 24/7), cross-border payments, security (PCI-DSS, tokenization, 3D Secure).</li>
<li><strong>Job-ready</strong> — read a real gateway's API docs (Stripe/VNPay), understand a chargeback dispute, and know what "PCI compliant" actually requires of a merchant.</li>
</ol></div>`,
    `<span class="eyebrow">EPT301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quy trình &amp; Công nghệ thanh toán điện tử — mạng lưới thẻ, cổng thanh toán, ví điện tử, chuyển khoản thời gian thực, thanh toán xuyên biên giới và an ninh thanh toán — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, cộng thêm tài liệu chuẩn ngành mà thực tế đang dùng.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EPT301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Electronic Payment Systems</em> — Donal O'Mahony, Michael Peirce &amp; Hitesh Tewari (Artech House) — tài liệu học thuật kinh điển về giao thức &amp; mô hình an ninh thanh toán.</li>
<li><em>Payments Systems in the U.S.</em> — Carol Coye Benson &amp; Scott Loftesness (Glenbrook Partners) — tài liệu chuẩn ngành, giải thích các hệ thống thanh toán thật vận hành thế nào từ đầu đến cuối.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://usa.visa.com/partner-with-us/payment-technology.html" target="_blank" rel="noopener">Visa — tổng quan công nghệ &amp; mạng lưới thanh toán</a></li>
<li><a href="https://developer.mastercard.com/" target="_blank" rel="noopener">Mastercard Developers</a> — tài liệu kỹ thuật, API, sandbox</li>
<li><a href="https://www.napas.com.vn/" target="_blank" rel="noopener">NAPAS</a> — công ty chuyển mạch quốc gia (chuyển khoản 24/7, VietQR)</li>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council</a> — tài liệu chính thức PCI-DSS</li>
<li><a href="https://www.sbv.gov.vn/" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV)</a> — quy định thanh toán điện tử trong nước</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GlenbrookPartners" target="_blank" rel="noopener">Glenbrook Partners</a> — giải thích ngành thanh toán</li>
<li><a href="https://www.youtube.com/results?search_query=how+card+payments+work" target="_blank" rel="noopener">"How card payments work"</a> — nhiều video giải thích mô hình 4 bên chất lượng tốt</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://stripe.com/docs" target="_blank" rel="noopener">Stripe Docs</a> — đọc thiết kế API &amp; webhook của một cổng thanh toán thật (không cần tài khoản)</li>
<li><a href="https://www.vietqr.io/" target="_blank" rel="noopener">VietQR.io</a> — thử sinh mã VietQR trực tiếp</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các bên trong hệ sinh thái thanh toán, mô hình thẻ 4 bên, phân biệt gateway/processor/acquirer.</li>
<li><strong>Luyện tập</strong> — theo dấu một giao dịch từ đầu đến cuối (authorization → clearing → settlement) cho thẻ và cho QR/ví điện tử; so sánh hai đường.</li>
<li><strong>Đào sâu thực tế</strong> — chuyển khoản thời gian thực (NAPAS 24/7), thanh toán xuyên biên giới, an ninh (PCI-DSS, tokenization, 3D Secure).</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc tài liệu API của một cổng thật (Stripe/VNPay), hiểu tranh chấp chargeback, biết "đạt chuẩn PCI" thực ra yêu cầu gì ở merchant.</li>
</ol></div>`,
  ]]);

const intro = doc('ept301-0-1-overview', 'Course overview: E-payment Processes and Technology|||Tổng quan: Quy trình & Công nghệ thanh toán điện tử',
  'Thanh toán điện tử là gì, vì sao quan trọng; lộ trình 8 chương: hệ sinh thái → thẻ & mạng lưới → cổng thanh toán → ví điện tử/QR/NFC → chuyển khoản thời gian thực → xuyên biên giới & tiền số → an ninh → gian lận & xu hướng fintech.',
  [[
    `<span class="eyebrow">EPT301 · Lesson 0.1 · Overview</span>
<h2>E-payment Processes and Technology</h2>
<p class="lead">Every time you tap a card, scan a QR code, or tap "Buy now", a chain of systems — banks, networks, gateways, processors, regulators — moves money and data in seconds while trying to stop fraud in the same seconds. This course opens up that chain: who the players are, how a transaction actually flows, what technology makes it fast and (mostly) safe, and where the industry is heading.</p>
<h3>Why this matters</h3>
<ul>
<li><strong>Every business needs it</strong> — e-commerce, retail, fintech, banking all run on payment rails; understanding them is a hard requirement for BBA graduates working in finance, operations, or product.</li>
<li><strong>It's where technology meets regulation</strong> — payments sit at the intersection of software engineering, banking law, and consumer protection.</li>
<li><strong>It's changing fast</strong> — QR payments, real-time transfers and digital currencies have reshaped the industry in the last decade.</li>
</ul>
<h3>Roadmap</h3>
<p>Payment ecosystem overview → cards &amp; card networks (acquirer/issuer) → payment gateways &amp; transaction processing → e-wallets &amp; mobile payment (QR/NFC/VietQR) → real-time transfers (NAPAS 24/7) → cross-border payments &amp; digital currency/CBDC → payment security (encryption, tokenization, 3D Secure, PCI-DSS) → fraud prevention, compliance &amp; fintech trends. Bilingual, with real-world flow diagrams and quizzes.</p>
<div class="callout"><span class="badge">How to read this course</span> Every chapter follows one transaction from the customer's action to the money actually settling in a bank account — that's the thread tying cards, gateways, wallets and real-time transfers together.</div>`,
    `<span class="eyebrow">EPT301 · Bài 0.1 · Tổng quan</span>
<h2>Quy trình &amp; Công nghệ thanh toán điện tử</h2>
<p class="lead">Mỗi lần bạn chạm thẻ, quét QR, hay bấm "Mua ngay", một chuỗi hệ thống — ngân hàng, mạng lưới thẻ, cổng thanh toán, tổ chức xử lý, cơ quan quản lý — chuyển tiền và dữ liệu trong vài giây, đồng thời cố ngăn gian lận cũng trong vài giây đó. Môn này mở chuỗi đó ra: ai là các bên tham gia, một giao dịch thực sự chạy thế nào, công nghệ nào làm nó nhanh và (phần lớn) an toàn, và ngành đang đi về đâu.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Doanh nghiệp nào cũng cần</strong> — thương mại điện tử, bán lẻ, fintech, ngân hàng đều chạy trên hạ tầng thanh toán; hiểu nó là yêu cầu bắt buộc với sinh viên BBA làm tài chính, vận hành hay sản phẩm.</li>
<li><strong>Nơi công nghệ gặp quy định</strong> — thanh toán nằm ở giao điểm giữa kỹ thuật phần mềm, luật ngân hàng và bảo vệ người tiêu dùng.</li>
<li><strong>Đang thay đổi rất nhanh</strong> — thanh toán QR, chuyển khoản thời gian thực và tiền số đã định hình lại ngành trong thập kỷ qua.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan hệ sinh thái thanh toán → thẻ &amp; mạng lưới thẻ (acquirer/issuer) → cổng thanh toán &amp; xử lý giao dịch → ví điện tử &amp; mobile payment (QR/NFC/VietQR) → chuyển khoản thời gian thực (NAPAS 24/7) → thanh toán xuyên biên giới &amp; tiền số/CBDC → an ninh thanh toán (mã hoá, tokenization, 3D Secure, PCI-DSS) → phòng chống gian lận, tuân thủ &amp; xu hướng fintech. Song ngữ, có sơ đồ luồng thực tế và quiz.</p>
<div class="callout"><span class="badge">Cách đọc môn này</span> Mỗi chương đều theo một giao dịch từ hành động của khách hàng đến khi tiền thực sự về tài khoản ngân hàng — đó là mạch nối thẻ, cổng thanh toán, ví điện tử và chuyển khoản thời gian thực lại với nhau.</div>`,
  ]]);

const c1 = doc('ept301-1-1-ecosystem', '1.1 — Payment ecosystem overview|||1.1 — Tổng quan hệ sinh thái thanh toán',
  'Thanh toán điện tử là gì; các bên tham gia (khách hàng, merchant, issuer, acquirer, network, PSP, cơ quan quản lý); các phương thức chính; luồng tiền & luồng dữ liệu tổng quát.',
  [[
    `<span class="eyebrow">EPT301 · Chapter 1 · Lesson 1.1</span>
<h2>Payment ecosystem overview</h2>
<h3>What is electronic payment?</h3>
<p>An <strong>electronic payment</strong> moves money without physical cash, using electronic instructions between financial systems — a card swipe, a bank transfer, a QR scan, an e-wallet top-up. Two things travel together in every transaction: <strong>money</strong> (the actual funds settling between accounts) and <strong>data</strong> (who paid whom, how much, when, approved or declined).</p>
<h3>The players</h3>
<ul>
<li><strong>Consumer / cardholder</strong> — the person paying.</li>
<li><strong>Merchant</strong> — the business getting paid.</li>
<li><strong>Issuer (issuing bank)</strong> — the consumer's bank; issues the card/account and approves or declines the payment.</li>
<li><strong>Acquirer (acquiring bank)</strong> — the merchant's bank; receives funds on the merchant's behalf.</li>
<li><strong>Payment network</strong> — Visa, Mastercard, NAPAS — the rails connecting issuers and acquirers.</li>
<li><strong>Payment Service Provider (PSP) / gateway</strong> — the technology layer merchants plug into instead of connecting to banks directly.</li>
<li><strong>Regulator / central bank</strong> — sets the rules (in Vietnam: Ngân hàng Nhà nước / SBV) and often runs national infrastructure (NAPAS).</li>
</ul>
<h3>Main payment methods</h3>
<pre><code>Cash            -> physical, no electronic trace
Card payment    -> credit/debit, via card networks (Chapter 2)
Bank transfer   -> direct account-to-account, batch or real-time (Chapter 5)
E-wallet / QR   -> MoMo, ZaloPay, VietQR (Chapter 4)
Digital currency -> crypto, CBDC (Chapter 6)
</code></pre>
<div class="callout"><span class="badge">The one idea to keep</span> Every payment method you'll study is really the same question answered differently: "how do we move money AND move trust between two parties who don't fully know each other?"</div>`,
    `<span class="eyebrow">EPT301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan hệ sinh thái thanh toán</h2>
<h3>Thanh toán điện tử là gì?</h3>
<p><strong>Thanh toán điện tử</strong> di chuyển tiền không dùng tiền mặt vật lý, bằng chỉ lệnh điện tử giữa các hệ thống tài chính — quẹt thẻ, chuyển khoản, quét QR, nạp ví điện tử. Hai thứ luôn đi cùng nhau trong mọi giao dịch: <strong>tiền</strong> (khoản tiền thực sự chuyển giữa các tài khoản) và <strong>dữ liệu</strong> (ai trả cho ai, bao nhiêu, khi nào, được duyệt hay bị từ chối).</p>
<h3>Các bên tham gia</h3>
<ul>
<li><strong>Người dùng / chủ thẻ</strong> — người trả tiền.</li>
<li><strong>Merchant (đơn vị bán)</strong> — doanh nghiệp nhận tiền.</li>
<li><strong>Issuer (ngân hàng phát hành)</strong> — ngân hàng của người dùng; phát hành thẻ/tài khoản và duyệt hoặc từ chối giao dịch.</li>
<li><strong>Acquirer (ngân hàng thanh toán)</strong> — ngân hàng của merchant; nhận tiền thay merchant.</li>
<li><strong>Mạng lưới thanh toán</strong> — Visa, Mastercard, NAPAS — hạ tầng nối issuer và acquirer.</li>
<li><strong>Payment Service Provider (PSP) / cổng thanh toán</strong> — lớp công nghệ merchant tích hợp vào thay vì nối trực tiếp với ngân hàng.</li>
<li><strong>Cơ quan quản lý / ngân hàng trung ương</strong> — đặt quy định (ở Việt Nam: Ngân hàng Nhà nước / SBV) và thường vận hành hạ tầng quốc gia (NAPAS).</li>
</ul>
<h3>Các phương thức thanh toán chính</h3>
<pre><code>Tiền mặt         -> vật lý, không có dấu vết điện tử
Thanh toán thẻ   -> tín dụng/ghi nợ, qua mạng lưới thẻ (Chương 2)
Chuyển khoản     -> trực tiếp tài khoản-tài khoản, theo lô hoặc thời gian thực (Chương 5)
Ví điện tử / QR  -> MoMo, ZaloPay, VietQR (Chương 4)
Tiền số          -> crypto, CBDC (Chương 6)
</code></pre>
<div class="callout"><span class="badge">Ý chính cần nhớ</span> Mọi phương thức thanh toán bạn sẽ học thực ra chỉ là một câu hỏi được trả lời khác nhau: "làm sao chuyển được cả TIỀN và cả LÒNG TIN giữa hai bên chưa hoàn toàn biết nhau?"</div>`,
  ]]);

const c1q = quiz('ept301-quiz-1', 'Quiz 1 — Payment ecosystem|||Quiz 1 — Hệ sinh thái thanh toán', [
  { id: 'q1', question: 'Ngân hàng của người mua, duyệt hoặc từ chối giao dịch, gọi là?', options: ['Acquirer', 'Issuer', 'Payment network', 'PSP'], correctIndex: 1, explanation: 'Issuer (ngân hàng phát hành) là ngân hàng của người dùng, đứng ra duyệt/từ chối giao dịch.' },
  { id: 'q2', question: 'Ngân hàng nhận tiền thay cho merchant gọi là?', options: ['Issuer', 'Acquirer', 'Regulator', 'Network'], correctIndex: 1, explanation: 'Acquirer (ngân hàng thanh toán) đứng phía merchant, nhận tiền về cho merchant.' },
  { id: 'q3', question: 'Trong mọi giao dịch điện tử, hai thứ nào luôn đi cùng nhau?', options: ['Tiền mặt và thẻ', 'Tiền và dữ liệu', 'Ngân hàng và cơ quan thuế', 'QR và NFC'], correctIndex: 1, explanation: 'Mọi giao dịch di chuyển cả tiền (quỹ thực) và dữ liệu (thông tin ai trả ai, duyệt hay từ chối).' },
]);

const c2 = doc('ept301-2-1-cards-networks', '2.1 — Payment cards & card networks|||2.1 — Thẻ thanh toán & mạng lưới thẻ',
  'Thẻ tín dụng/ghi nợ; mô hình 4 bên (four-party model); vai trò issuer/acquirer/network; luồng giao dịch thẻ: authorization → clearing → settlement.',
  [[
    `<span class="eyebrow">EPT301 · Chapter 2 · Lesson 2.1</span>
<h2>Payment cards &amp; card networks</h2>
<h3>Credit vs. debit</h3>
<p>A <strong>debit card</strong> pulls money directly from the cardholder's bank account at the moment of payment. A <strong>credit card</strong> draws on a line of credit the issuer extends — the cardholder pays the issuer back later, often with interest if not paid in full.</p>
<h3>The four-party model</h3>
<p>Almost every card transaction runs on a <strong>four-party model</strong>: cardholder, merchant, issuer, acquirer — connected by a <strong>card network</strong> (Visa, Mastercard, or in Vietnam, NAPAS domestic cards) that sets the technical rules and routes messages between issuer and acquirer. The network itself doesn't hold accounts for consumers or merchants — it's the switch in the middle.</p>
<h3>Three stages of a card transaction</h3>
<pre><code>1. Authorization
   Cardholder pays -> Merchant terminal -> Acquirer -> Network -> Issuer
   Issuer checks balance/limit/fraud rules -> sends APPROVE or DECLINE back
   (happens in ~1-2 seconds; money has NOT moved yet)

2. Clearing
   Network collects all approved transactions from the day
   Calculates what each issuer owes each acquirer (netting)

3. Settlement
   Actual funds move: issuer -> network -> acquirer -> merchant's account
   (usually T+1 or T+2: money lands a day or two after the purchase)
</code></pre>
<div class="callout"><span class="badge">Key insight</span> "Approved" at the register only means the issuer promised to pay — the actual money moves later, in batches, during clearing &amp; settlement. This gap is exactly why chargebacks and fraud disputes are possible after a purchase.</div>`,
    `<span class="eyebrow">EPT301 · Chương 2 · Bài 2.1</span>
<h2>Thẻ thanh toán &amp; mạng lưới thẻ</h2>
<h3>Thẻ tín dụng và thẻ ghi nợ</h3>
<p><strong>Thẻ ghi nợ (debit)</strong> rút tiền trực tiếp từ tài khoản ngân hàng của chủ thẻ ngay lúc thanh toán. <strong>Thẻ tín dụng (credit)</strong> dùng hạn mức tín dụng do issuer cấp — chủ thẻ trả lại cho issuer sau, thường chịu lãi nếu không trả đủ.</p>
<h3>Mô hình bốn bên (four-party model)</h3>
<p>Gần như mọi giao dịch thẻ chạy theo <strong>mô hình bốn bên</strong>: chủ thẻ, merchant, issuer, acquirer — nối với nhau qua một <strong>mạng lưới thẻ</strong> (Visa, Mastercard, hoặc ở Việt Nam là thẻ nội địa qua NAPAS) đặt ra quy tắc kỹ thuật và định tuyến bản tin giữa issuer và acquirer. Mạng lưới bản thân không giữ tài khoản của người dùng hay merchant — nó là bộ chuyển mạch ở giữa.</p>
<h3>Ba giai đoạn của một giao dịch thẻ</h3>
<pre><code>1. Authorization (cấp phép)
   Chủ thẻ trả tiền -> Máy POS merchant -> Acquirer -> Network -> Issuer
   Issuer kiểm số dư/hạn mức/quy tắc gian lận -> trả về DUYỆT hoặc TỪ CHỐI
   (mất khoảng 1-2 giây; tiền CHƯA di chuyển)

2. Clearing (bù trừ)
   Network gom mọi giao dịch đã duyệt trong ngày
   Tính issuer nào nợ acquirer nào bao nhiêu (bù trừ ròng)

3. Settlement (thanh toán cuối)
   Tiền thật di chuyển: issuer -> network -> acquirer -> tài khoản merchant
   (thường T+1 hoặc T+2: tiền về sau 1-2 ngày kể từ lúc mua)
</code></pre>
<div class="callout"><span class="badge">Điểm mấu chốt</span> "Đã duyệt" ở máy POS chỉ có nghĩa issuer HỨA sẽ trả — tiền thật di chuyển sau, theo lô, trong lúc clearing &amp; settlement. Chính khoảng trễ này là lý do chargeback và tranh chấp gian lận vẫn xảy ra được sau khi mua hàng.</div>`,
  ]]);

const c2q = quiz('ept301-quiz-2', 'Quiz 2 — Cards & networks|||Quiz 2 — Thẻ & mạng lưới', [
  { id: 'q1', question: 'Trong mô hình bốn bên, ai định tuyến bản tin giữa issuer và acquirer?', options: ['Cardholder', 'Merchant', 'Card network', 'Regulator'], correctIndex: 2, explanation: 'Card network (Visa/Mastercard/NAPAS) là bộ chuyển mạch giữa issuer và acquirer, không giữ tài khoản của ai.' },
  { id: 'q2', question: '"Đã duyệt" (approved) tại máy POS có nghĩa là gì?', options: ['Tiền đã về tài khoản merchant', 'Issuer hứa sẽ trả, tiền chưa di chuyển', 'Giao dịch không thể bị tranh chấp nữa', 'Acquirer đã nhận tiền'], correctIndex: 1, explanation: 'Authorization chỉ là lời hứa trả tiền của issuer; tiền thật di chuyển sau ở bước clearing & settlement.' },
  { id: 'q3', question: 'Thẻ ghi nợ (debit) khác thẻ tín dụng (credit) ở điểm nào?', options: ['Debit dùng hạn mức tín dụng', 'Debit rút trực tiếp từ tài khoản ngân hàng ngay lúc trả', 'Credit không cần issuer', 'Không có khác biệt'], correctIndex: 1, explanation: 'Debit trừ tiền trực tiếp từ tài khoản; credit dùng hạn mức, trả lại sau.' },
]);

const c3 = doc('ept301-3-1-gateway-processing', '3.1 — Payment gateways & transaction processing|||3.1 — Cổng thanh toán & xử lý giao dịch',
  'Vai trò của payment gateway/PSP; phân biệt gateway, processor, acquirer; luồng kỹ thuật một giao dịch online; ví dụ thực tế (VNPay, OnePay, Stripe).',
  [[
    `<span class="eyebrow">EPT301 · Chapter 3 · Lesson 3.1</span>
<h2>Payment gateways &amp; transaction processing</h2>
<h3>Why merchants need a gateway</h3>
<p>Connecting directly to every bank and card network is expensive and technically heavy. A <strong>payment gateway</strong> (a type of <strong>Payment Service Provider, PSP</strong>) sits between the merchant's website/app and the banking system — it encrypts card data, formats it correctly, routes it to the right acquirer/network, and returns a simple approve/decline to the merchant.</p>
<h3>Gateway vs. processor vs. acquirer</h3>
<ul>
<li><strong>Gateway</strong> — the software layer merchants integrate with (API/SDK/checkout page); captures &amp; encrypts payment data.</li>
<li><strong>Processor</strong> — handles the back-end technical routing of the transaction to the card network.</li>
<li><strong>Acquirer</strong> — the bank that actually holds the merchant's settlement account.</li>
</ul>
<p>In practice one company can bundle several of these roles — a modern PSP (Stripe, VNPay, OnePay) often acts as gateway + processor + partners with an acquiring bank, so the merchant only integrates once.</p>
<h3>A checkout, step by step</h3>
<pre><code>1. Customer enters card/QR on checkout page
2. Gateway encrypts data, sends to Processor
3. Processor -> Card Network -> Issuer for authorization
4. Issuer's APPROVE/DECLINE flows back the same path
5. Gateway returns result to merchant's site (usually under 3 seconds)
6. Later: Processor/Acquirer settle funds into merchant's bank account
</code></pre>
<div class="callout"><span class="badge">Real examples</span> Vietnam: <strong>VNPay</strong>, <strong>OnePay</strong>, <strong>MoMo Business</strong>. Global: <strong>Stripe</strong>, <strong>PayPal</strong>, <strong>Adyen</strong>. Reading a real gateway's API docs is the fastest way to see this flow as actual code, not just theory.</div>`,
    `<span class="eyebrow">EPT301 · Chương 3 · Bài 3.1</span>
<h2>Cổng thanh toán &amp; xử lý giao dịch</h2>
<h3>Vì sao merchant cần cổng thanh toán</h3>
<p>Kết nối trực tiếp với từng ngân hàng và mạng lưới thẻ vừa tốn kém vừa nặng về kỹ thuật. Một <strong>cổng thanh toán (payment gateway)</strong> (một dạng <strong>Payment Service Provider, PSP</strong>) nằm giữa website/app của merchant và hệ thống ngân hàng — mã hoá dữ liệu thẻ, định dạng đúng chuẩn, định tuyến tới đúng acquirer/network, và trả về kết quả duyệt/từ chối đơn giản cho merchant.</p>
<h3>Phân biệt gateway, processor, acquirer</h3>
<ul>
<li><strong>Gateway</strong> — lớp phần mềm merchant tích hợp vào (API/SDK/trang thanh toán); thu thập &amp; mã hoá dữ liệu thanh toán.</li>
<li><strong>Processor</strong> — xử lý định tuyến kỹ thuật ở tầng dưới, đưa giao dịch tới mạng lưới thẻ.</li>
<li><strong>Acquirer</strong> — ngân hàng thực sự giữ tài khoản thanh toán của merchant.</li>
</ul>
<p>Trong thực tế một công ty có thể gộp nhiều vai trò — một PSP hiện đại (Stripe, VNPay, OnePay) thường vừa là gateway vừa là processor và hợp tác với một ngân hàng acquiring, nên merchant chỉ cần tích hợp một lần.</p>
<h3>Một lượt thanh toán, từng bước</h3>
<pre><code>1. Khách hàng nhập thẻ/QR trên trang thanh toán
2. Gateway mã hoá dữ liệu, gửi cho Processor
3. Processor -> Card Network -> Issuer để cấp phép
4. Kết quả DUYỆT/TỪ CHỐI của Issuer chạy ngược lại đúng đường đó
5. Gateway trả kết quả về trang merchant (thường dưới 3 giây)
6. Sau đó: Processor/Acquirer thanh toán tiền vào tài khoản ngân hàng merchant
</code></pre>
<div class="callout"><span class="badge">Ví dụ thực tế</span> Việt Nam: <strong>VNPay</strong>, <strong>OnePay</strong>, <strong>MoMo Business</strong>. Toàn cầu: <strong>Stripe</strong>, <strong>PayPal</strong>, <strong>Adyen</strong>. Đọc tài liệu API của một cổng thanh toán thật là cách nhanh nhất để thấy luồng này thành mã thật, không chỉ lý thuyết.</div>`,
  ]]);

const c3q = quiz('ept301-quiz-3', 'Quiz 3 — Gateways & processing|||Quiz 3 — Cổng thanh toán & xử lý', [
  { id: 'q1', question: 'Vai trò chính của payment gateway là gì?', options: ['Giữ tài khoản thanh toán của merchant', 'Mã hoá & định tuyến dữ liệu thanh toán giữa merchant và ngân hàng', 'Phát hành thẻ cho khách hàng', 'Ban hành quy định thanh toán'], correctIndex: 1, explanation: 'Gateway là lớp phần mềm thu thập, mã hoá và định tuyến dữ liệu thanh toán; nó không giữ tài khoản merchant (đó là acquirer).' },
  { id: 'q2', question: 'Ngân hàng thực sự giữ tài khoản thanh toán của merchant gọi là?', options: ['Gateway', 'Processor', 'Acquirer', 'Issuer'], correctIndex: 2, explanation: 'Acquirer là ngân hàng giữ tài khoản settlement của merchant.' },
  { id: 'q3', question: 'Một PSP hiện đại như Stripe/VNPay thường làm gì để merchant tiện lợi?', options: ['Chỉ làm gateway, không làm gì khác', 'Gộp vai trò gateway + processor + hợp tác acquirer để tích hợp một lần', 'Thay thế hoàn toàn ngân hàng', 'Chỉ hoạt động ngoài Việt Nam'], correctIndex: 1, explanation: 'PSP hiện đại thường bundle nhiều vai trò để merchant chỉ cần tích hợp một API duy nhất.' },
]);

const c4 = doc('ept301-4-1-ewallet-mobile', '4.1 — E-wallets & mobile payment (QR/NFC)|||4.1 — Ví điện tử & mobile payment (QR/NFC)',
  'Mô hình ví điện tử (MoMo, ZaloPay); mã QR tĩnh/động; chuẩn VietQR; NFC/contactless & tokenization (Apple Pay/Google Pay); luồng thanh toán mobile.',
  [[
    `<span class="eyebrow">EPT301 · Chapter 4 · Lesson 4.1</span>
<h2>E-wallets &amp; mobile payment</h2>
<h3>How an e-wallet works</h3>
<p>An <strong>e-wallet</strong> (MoMo, ZaloPay, ShopeePay) is a prepaid account: users top it up from a bank account or card, then spend the balance at merchants. The wallet provider becomes a middle layer holding stored value — regulated as an intermediary payment service, not a bank.</p>
<h3>QR code payment</h3>
<p>A <strong>QR code</strong> encodes payment information as a scannable image.</p>
<ul>
<li><strong>Static QR</strong> — fixed code (e.g. printed at a shop counter) identifying only the merchant; the customer types in the amount.</li>
<li><strong>Dynamic QR</strong> — generated per transaction, already encoding the exact amount and a transaction reference; expires after use.</li>
</ul>
<h3>VietQR — the Vietnamese interoperability standard</h3>
<p><strong>VietQR</strong>, run by NAPAS together with member banks, is a shared QR standard so that a code generated by one bank's app can be scanned and paid from ANY participating bank's app or e-wallet — solving the fragmentation of every bank having its own incompatible QR format.</p>
<h3>NFC &amp; contactless — the tokenization trick</h3>
<pre><code>Tap phone -> NFC chip sends a TOKEN (not the real card number)
Token maps to real card only inside the card network's secure vault
Merchant terminal & network never see the actual card number
</code></pre>
<p><strong>Apple Pay</strong> and <strong>Google Pay</strong> use this <strong>tokenization</strong> approach: even if the token is intercepted, it's useless outside that one device/merchant pairing.</p>
<div class="callout"><span class="badge">Same goal, different rail</span> QR and NFC solve the same problem as cards — authenticate the payer and move value — using cheaper infrastructure (a phone screen or antenna) instead of a physical card &amp; POS terminal.</div>`,
    `<span class="eyebrow">EPT301 · Chương 4 · Bài 4.1</span>
<h2>Ví điện tử &amp; mobile payment</h2>
<h3>Ví điện tử hoạt động thế nào</h3>
<p><strong>Ví điện tử</strong> (MoMo, ZaloPay, ShopeePay) là một tài khoản trả trước: người dùng nạp tiền từ tài khoản ngân hàng hoặc thẻ, rồi chi tiêu số dư đó tại merchant. Nhà cung cấp ví trở thành một lớp trung gian giữ giá trị lưu trữ — được quản lý như một trung gian thanh toán, không phải ngân hàng.</p>
<h3>Thanh toán bằng mã QR</h3>
<p>Một <strong>mã QR</strong> mã hoá thông tin thanh toán thành hình ảnh quét được.</p>
<ul>
<li><strong>QR tĩnh</strong> — mã cố định (vd in sẵn ở quầy thu ngân), chỉ định danh merchant; khách hàng tự nhập số tiền.</li>
<li><strong>QR động</strong> — sinh riêng cho từng giao dịch, đã mã hoá đúng số tiền và mã tham chiếu giao dịch; hết hiệu lực sau khi dùng.</li>
</ul>
<h3>VietQR — chuẩn liên thông của Việt Nam</h3>
<p><strong>VietQR</strong>, do NAPAS vận hành cùng các ngân hàng thành viên, là chuẩn QR chung để một mã do app ngân hàng này sinh ra có thể được quét và trả bằng app hoặc ví điện tử của BẤT KỲ ngân hàng thành viên nào — giải quyết tình trạng mỗi ngân hàng có định dạng QR riêng không tương thích.</p>
<h3>NFC &amp; contactless — thủ thuật tokenization</h3>
<pre><code>Chạm điện thoại -> Chip NFC gửi một TOKEN (không phải số thẻ thật)
Token chỉ ánh xạ về thẻ thật bên trong kho an toàn của card network
Máy POS merchant & network không bao giờ thấy số thẻ thật
</code></pre>
<p><strong>Apple Pay</strong> và <strong>Google Pay</strong> dùng cách <strong>tokenization</strong> này: dù token bị chặn lấy được, nó cũng vô dụng ngoài đúng cặp thiết bị/merchant đó.</p>
<div class="callout"><span class="badge">Cùng mục tiêu, đường khác</span> QR và NFC giải cùng bài toán với thẻ — xác thực người trả và chuyển giá trị — nhưng dùng hạ tầng rẻ hơn (màn hình điện thoại hay anten) thay cho thẻ vật lý &amp; máy POS.</div>`,
  ]]);

const c4q = quiz('ept301-quiz-4', 'Quiz 4 — E-wallets & mobile payment|||Quiz 4 — Ví điện tử & mobile payment', [
  { id: 'q1', question: 'Khác biệt chính giữa QR tĩnh và QR động là gì?', options: ['QR tĩnh mã hoá sẵn số tiền, QR động không', 'QR động sinh riêng từng giao dịch kèm số tiền, QR tĩnh chỉ định danh merchant', 'QR tĩnh chỉ dùng cho NFC', 'Không có khác biệt'], correctIndex: 1, explanation: 'QR động gắn với một giao dịch cụ thể (số tiền + mã tham chiếu), QR tĩnh chỉ định danh merchant và khách phải tự nhập số tiền.' },
  { id: 'q2', question: 'VietQR giải quyết vấn đề gì?', options: ['Thay thế hoàn toàn thẻ ngân hàng', 'Cho phép mã QR của một ngân hàng được quét/trả bằng app của ngân hàng khác', 'Mã hoá số thẻ khi chạm NFC', 'Quản lý hạn mức tín dụng'], correctIndex: 1, explanation: 'VietQR là chuẩn liên thông do NAPAS vận hành, giải quyết việc mỗi ngân hàng có QR riêng không tương thích.' },
  { id: 'q3', question: 'Khi chạm NFC để thanh toán, merchant terminal nhận được gì?', options: ['Số thẻ thật của khách hàng', 'Một token thay cho số thẻ thật', 'Mật khẩu ví điện tử', 'Không nhận được gì'], correctIndex: 1, explanation: 'NFC dùng tokenization: terminal chỉ nhận token, số thẻ thật được giữ an toàn trong kho của card network.' },
]);

const c5 = doc('ept301-5-1-realtime-transfer', '5.1 — Bank transfers & real-time payment (NAPAS 24/7)|||5.1 — Chuyển khoản & thanh toán thời gian thực (NAPAS 24/7)',
  'Chuyển khoản theo lô (batch) vs. thời gian thực; hệ thống NAPAS 24/7; vai trò chuẩn bản tin (ISO 20022); tính chung cuộc (finality) của settlement.',
  [[
    `<span class="eyebrow">EPT301 · Chapter 5 · Lesson 5.1</span>
<h2>Bank transfers &amp; real-time payment</h2>
<h3>Batch vs. real-time transfer</h3>
<p>A traditional <strong>batch transfer</strong> collects instructions and processes them together at set times (e.g. end of day) — cheap but slow: money can take hours or until the next business day to arrive. A <strong>real-time (instant) transfer</strong> processes each instruction the moment it's submitted, 24 hours a day, 7 days a week, including weekends and holidays.</p>
<h3>NAPAS 24/7</h3>
<p>In Vietnam, <strong>NAPAS 24/7</strong> is the national real-time interbank transfer system: a customer sends money from Bank A to a beneficiary at Bank B and the funds are usable within seconds, any time, any day. It's the same NAPAS switch that also runs VietQR and domestic card processing — one national infrastructure serving multiple rails.</p>
<h3>Messaging standards</h3>
<p>Banks need a shared "language" to describe a transfer instruction unambiguously across systems and borders. <strong>ISO 20022</strong> is the modern global messaging standard (replacing the older, more limited SWIFT MT format) — it carries richer, structured data (amount, purpose, remitter/beneficiary details) that's easier for systems to process automatically and screen for compliance.</p>
<h3>Settlement finality</h3>
<pre><code>Instruction sent -> Instant notification to both parties ("received")
                  -> Underlying settlement between banks' central bank accounts
                     may still happen on a slightly different schedule
Finality = the point after which the transfer CANNOT be reversed/undone
</code></pre>
<div class="callout"><span class="badge">Why speed matters</span> Real-time rails changed consumer expectations everywhere: once people can split a bill or pay a vendor in 3 seconds, "wait 1-3 business days" for anything else starts to feel broken.</div>`,
    `<span class="eyebrow">EPT301 · Chương 5 · Bài 5.1</span>
<h2>Chuyển khoản &amp; thanh toán thời gian thực</h2>
<h3>Chuyển khoản theo lô vs. thời gian thực</h3>
<p><strong>Chuyển khoản theo lô (batch)</strong> truyền thống gom các lệnh lại và xử lý cùng lúc theo mốc giờ cố định (vd cuối ngày) — rẻ nhưng chậm: tiền có thể mất vài giờ hoặc đến ngày làm việc kế tiếp mới về. <strong>Chuyển khoản thời gian thực (instant)</strong> xử lý từng lệnh ngay khi được gửi, 24 giờ mỗi ngày, 7 ngày mỗi tuần, kể cả cuối tuần và ngày lễ.</p>
<h3>NAPAS 24/7</h3>
<p>Ở Việt Nam, <strong>NAPAS 24/7</strong> là hệ thống chuyển tiền liên ngân hàng thời gian thực quốc gia: khách hàng chuyển từ Ngân hàng A đến người nhận ở Ngân hàng B và tiền dùng được trong vài giây, bất kỳ giờ nào, ngày nào. Đây cùng là bộ chuyển mạch NAPAS vận hành cả VietQR và xử lý thẻ nội địa — một hạ tầng quốc gia phục vụ nhiều đường ray khác nhau.</p>
<h3>Chuẩn bản tin</h3>
<p>Ngân hàng cần một "ngôn ngữ" chung để mô tả lệnh chuyển tiền không mập mờ giữa các hệ thống và qua biên giới. <strong>ISO 20022</strong> là chuẩn bản tin toàn cầu hiện đại (thay cho định dạng SWIFT MT cũ hạn chế hơn) — mang dữ liệu có cấu trúc phong phú hơn (số tiền, mục đích, thông tin người gửi/người nhận), dễ được hệ thống xử lý tự động và sàng lọc tuân thủ.</p>
<h3>Tính chung cuộc của settlement</h3>
<pre><code>Gửi lệnh -> Thông báo tức thì cho cả hai bên ("đã nhận")
         -> Thanh toán bù trừ thực giữa các tài khoản ngân hàng tại NHTW
            vẫn có thể diễn ra theo mốc thời gian hơi khác
Finality = mốc mà sau đó giao dịch KHÔNG THỂ đảo/hoàn lại
</code></pre>
<div class="callout"><span class="badge">Vì sao tốc độ quan trọng</span> Hạ tầng thời gian thực đã thay đổi kỳ vọng của người dùng ở mọi nơi: khi người ta chia tiền hoá đơn hay trả nhà cung cấp trong 3 giây, chờ "1-3 ngày làm việc" cho việc khác bắt đầu cảm thấy bất thường.</div>`,
  ]]);

const c5q = quiz('ept301-quiz-5', 'Quiz 5 — Real-time transfer|||Quiz 5 — Chuyển khoản thời gian thực', [
  { id: 'q1', question: 'Điểm khác chính giữa chuyển khoản batch và thời gian thực là?', options: ['Batch xử lý ngay lập tức, thời gian thực xử lý theo lô', 'Batch xử lý theo mốc giờ cố định, thời gian thực xử lý ngay khi gửi lệnh, 24/7', 'Chỉ có ở Việt Nam', 'Không có khác biệt về tốc độ'], correctIndex: 1, explanation: 'Batch gom lệnh xử lý theo mốc giờ; thời gian thực xử lý từng lệnh ngay lập tức mọi lúc.' },
  { id: 'q2', question: 'NAPAS 24/7 là gì?', options: ['Ứng dụng ví điện tử', 'Hệ thống chuyển tiền liên ngân hàng thời gian thực của Việt Nam', 'Một loại thẻ tín dụng', 'Cơ quan quản lý ngân hàng'], correctIndex: 1, explanation: 'NAPAS 24/7 là hạ tầng chuyển khoản liên ngân hàng thời gian thực quốc gia, hoạt động mọi giờ mọi ngày.' },
  { id: 'q3', question: 'ISO 20022 là gì?', options: ['Một loại thẻ NFC', 'Chuẩn bản tin thanh toán hiện đại thay cho SWIFT MT', 'Quy định PCI-DSS', 'Một ví điện tử'], correctIndex: 1, explanation: 'ISO 20022 là chuẩn bản tin toàn cầu hiện đại, mang dữ liệu có cấu trúc phong phú hơn SWIFT MT cũ.' },
]);

const c6 = doc('ept301-6-1-crossborder-digital', '6.1 — Cross-border payments & digital currency/CBDC|||6.1 — Thanh toán xuyên biên giới & tiền số/CBDC',
  'Thách thức thanh toán xuyên biên giới (correspondent banking, SWIFT, tỷ giá); kiều hối; tiền mã hoá (cryptocurrency) trong thanh toán; CBDC (tiền số ngân hàng trung ương).',
  [[
    `<span class="eyebrow">EPT301 · Chapter 6 · Lesson 6.1</span>
<h2>Cross-border payments &amp; digital currency/CBDC</h2>
<h3>Why cross-border is harder</h3>
<p>Domestic payments run inside one country's rules, currency, and infrastructure. Cross-border payments must cross all three — different regulators, currency conversion (FX), and payment systems that don't talk to each other directly.</p>
<h3>Correspondent banking &amp; SWIFT</h3>
<p>Traditionally, a bank without a direct relationship in the destination country routes a payment through a chain of <strong>correspondent banks</strong> — each takes a cut and adds delay. <strong>SWIFT</strong> (Society for Worldwide Interbank Financial Telecommunication) is the global messaging network banks use to instruct each other, though the money itself still moves through the correspondent chain.</p>
<pre><code>Sender's bank -> Correspondent bank 1 -> Correspondent bank 2 -> Receiver's bank
Each hop: fee + delay + FX conversion risk
Can take 1-5 business days for money that traveled digitally the whole way
</code></pre>
<h3>Remittances</h3>
<p><strong>Remittances</strong> — money migrant workers send home — are a huge, fee-sensitive segment. Services like Wise, Western Union, and MoneyGram compete by shortening or bypassing the correspondent chain.</p>
<h3>Cryptocurrency in payments</h3>
<p>Cryptocurrencies (e.g. Bitcoin, stablecoins) move value peer-to-peer on a blockchain without a bank intermediary — attractive for speed and cost in some corridors, but held back by price volatility (for non-stablecoins), unclear regulation, and limited merchant acceptance.</p>
<h3>CBDC — Central Bank Digital Currency</h3>
<p>A <strong>CBDC</strong> is a digital form of a country's own fiat currency, issued directly by the central bank — combining the trust/stability of government-backed money with the technology of digital payment rails. Several countries are piloting CBDCs to modernize retail and cross-border payments while keeping monetary sovereignty.</p>
<div class="callout"><span class="badge">The common thread</span> Every cross-border solution — correspondent banking, remittance apps, crypto, CBDC — is trying to answer the same question: how do you move value across a border faster and cheaper without losing trust?</div>`,
    `<span class="eyebrow">EPT301 · Chương 6 · Bài 6.1</span>
<h2>Thanh toán xuyên biên giới &amp; tiền số/CBDC</h2>
<h3>Vì sao xuyên biên giới khó hơn</h3>
<p>Thanh toán trong nước chạy trong quy định, tiền tệ và hạ tầng của một quốc gia. Thanh toán xuyên biên giới phải vượt qua cả ba — cơ quan quản lý khác nhau, quy đổi tiền tệ (FX), và các hệ thống thanh toán không nói chuyện trực tiếp với nhau.</p>
<h3>Correspondent banking &amp; SWIFT</h3>
<p>Theo cách truyền thống, một ngân hàng không có quan hệ trực tiếp ở quốc gia đích sẽ định tuyến giao dịch qua một chuỗi <strong>ngân hàng đại lý (correspondent bank)</strong> — mỗi chặng lấy phí và thêm thời gian chờ. <strong>SWIFT</strong> (Society for Worldwide Interbank Financial Telecommunication) là mạng bản tin toàn cầu các ngân hàng dùng để ra lệnh cho nhau, dù bản thân tiền vẫn di chuyển qua chuỗi correspondent.</p>
<pre><code>Ngân hàng người gửi -> Correspondent 1 -> Correspondent 2 -> Ngân hàng người nhận
Mỗi chặng: phí + trễ + rủi ro quy đổi FX
Có thể mất 1-5 ngày làm việc cho số tiền đã di chuyển bằng điện tử suốt hành trình
</code></pre>
<h3>Kiều hối (remittance)</h3>
<p><strong>Kiều hối</strong> — tiền lao động xuất khẩu gửi về nhà — là phân khúc lớn, rất nhạy về phí. Các dịch vụ như Wise, Western Union, MoneyGram cạnh tranh bằng cách rút ngắn hoặc bỏ qua chuỗi correspondent.</p>
<h3>Tiền mã hoá trong thanh toán</h3>
<p>Tiền mã hoá (vd Bitcoin, stablecoin) di chuyển giá trị ngang hàng (peer-to-peer) trên blockchain không cần ngân hàng trung gian — hấp dẫn về tốc độ và chi phí ở một số hành lang, nhưng bị cản bởi biến động giá (với coin không phải stablecoin), quy định chưa rõ ràng, và mức chấp nhận của merchant còn hạn chế.</p>
<h3>CBDC — tiền số ngân hàng trung ương</h3>
<p>Một <strong>CBDC</strong> là dạng số của chính đồng tiền pháp định một quốc gia, do ngân hàng trung ương phát hành trực tiếp — kết hợp sự tin cậy/ổn định của tiền được nhà nước bảo đảm với công nghệ của hạ tầng thanh toán số. Nhiều quốc gia đang thử nghiệm CBDC để hiện đại hoá thanh toán bán lẻ và xuyên biên giới mà vẫn giữ chủ quyền tiền tệ.</p>
<div class="callout"><span class="badge">Mạch chung</span> Mọi giải pháp xuyên biên giới — correspondent banking, app kiều hối, crypto, CBDC — đều đang trả lời cùng một câu hỏi: làm sao chuyển giá trị qua biên giới nhanh và rẻ hơn mà không mất đi lòng tin?</div>`,
  ]]);

const c6q = quiz('ept301-quiz-6', 'Quiz 6 — Cross-border & CBDC|||Quiz 6 — Xuyên biên giới & CBDC', [
  { id: 'q1', question: 'SWIFT thực chất là gì?', options: ['Nơi giữ tiền của các ngân hàng', 'Mạng bản tin toàn cầu để ngân hàng ra lệnh cho nhau', 'Một loại thẻ thanh toán', 'Một dạng CBDC'], correctIndex: 1, explanation: 'SWIFT là mạng bản tin; tiền thật vẫn di chuyển qua chuỗi correspondent banking, không phải qua SWIFT.' },
  { id: 'q2', question: 'CBDC khác cryptocurrency ở điểm nào?', options: ['CBDC do ngân hàng trung ương phát hành, là dạng số của tiền pháp định', 'CBDC không thể dùng để thanh toán', 'Cryptocurrency luôn ổn định giá hơn CBDC', 'Không có khác biệt'], correctIndex: 0, explanation: 'CBDC là tiền số chính thức do ngân hàng trung ương phát hành, khác cryptocurrency (phi tập trung, không do nhà nước bảo đảm).' },
  { id: 'q3', question: 'Vì sao chuyển tiền qua correspondent banking thường chậm và có phí ở mỗi chặng?', options: ['Vì luôn dùng tiền mặt', 'Vì mỗi ngân hàng đại lý trong chuỗi đều lấy phí và thêm thời gian xử lý', 'Vì SWIFT tính phí theo giờ', 'Vì CBDC chưa phổ biến'], correctIndex: 1, explanation: 'Khi không có quan hệ trực tiếp, giao dịch phải đi qua nhiều correspondent bank, mỗi chặng cộng thêm phí và độ trễ.' },
]);

const c7 = doc('ept301-7-1-security', '7.1 — Payment security (encryption, tokenization, 3D Secure, PCI-DSS)|||7.1 — An ninh thanh toán (mã hoá, tokenization, 3D Secure, PCI-DSS)',
  'Mã hoá dữ liệu thanh toán (TLS); tokenization; xác thực 3D Secure/OTP; chuẩn tuân thủ PCI-DSS và trách nhiệm của merchant.',
  [[
    `<span class="eyebrow">EPT301 · Chapter 7 · Lesson 7.1</span>
<h2>Payment security</h2>
<h3>Encryption — protecting data in transit</h3>
<p>When a browser or app sends card details to a gateway, the connection is protected by <strong>TLS (Transport Layer Security)</strong> — the "https" you see in a checkout URL. Encryption scrambles the data so anyone intercepting the connection sees gibberish, not the actual card number.</p>
<h3>Tokenization — protecting data at rest</h3>
<p>Encryption protects data while it moves; <strong>tokenization</strong> protects it once stored. Instead of keeping the real card number, a merchant or gateway stores a <strong>token</strong> — a meaningless substitute value that only the token-issuing system can map back to the real card. If a database of tokens leaks, the tokens are useless to a thief.</p>
<h3>3D Secure &amp; OTP — proving it's really you</h3>
<p><strong>3D Secure</strong> (branded as Visa Secure / Mastercard Identity Check) adds a second authentication step for online card payments: after entering card details, the cardholder confirms via an <strong>OTP (one-time password)</strong> sent by SMS/app, or biometrics. This shifts fraud liability toward the issuer/network and away from the merchant when used correctly, and blocks many stolen-card-number attacks.</p>
<h3>PCI-DSS — the industry's shared rulebook</h3>
<p><strong>PCI-DSS (Payment Card Industry Data Security Standard)</strong> is a set of security requirements every business that stores, processes, or transmits card data must follow — strong access controls, encryption, regular vulnerability scans, restricted storage of sensitive data (e.g. never storing the CVV after authorization). It's not optional: card networks can fine or cut off non-compliant merchants after a breach.</p>
<pre><code>Layered defense:
  TLS encryption      -> protects data IN TRANSIT
  Tokenization        -> protects data AT REST
  3D Secure / OTP      -> proves WHO is paying
  PCI-DSS compliance   -> the baseline RULES tying it all together
</code></pre>
<div class="callout"><span class="badge">Merchant takeaway</span> Using a PCI-compliant gateway that handles card data for you (so raw card numbers never touch your own servers) is the single most common way small businesses satisfy most of PCI-DSS with minimal effort.</div>`,
    `<span class="eyebrow">EPT301 · Chương 7 · Bài 7.1</span>
<h2>An ninh thanh toán</h2>
<h3>Mã hoá — bảo vệ dữ liệu khi đang truyền</h3>
<p>Khi trình duyệt hoặc app gửi thông tin thẻ tới cổng thanh toán, kết nối được bảo vệ bằng <strong>TLS (Transport Layer Security)</strong> — chữ "https" bạn thấy ở URL trang thanh toán. Mã hoá xáo trộn dữ liệu để ai chặn được đường truyền cũng chỉ thấy chuỗi vô nghĩa, không phải số thẻ thật.</p>
<h3>Tokenization — bảo vệ dữ liệu khi lưu trữ</h3>
<p>Mã hoá bảo vệ dữ liệu lúc di chuyển; <strong>tokenization</strong> bảo vệ dữ liệu khi đã lưu trữ. Thay vì giữ số thẻ thật, merchant hoặc gateway lưu một <strong>token</strong> — giá trị thay thế vô nghĩa mà chỉ hệ thống phát token mới ánh xạ ngược về thẻ thật được. Nếu cơ sở dữ liệu token bị rò rỉ, token đó vô dụng với kẻ trộm.</p>
<h3>3D Secure &amp; OTP — chứng minh đúng là bạn</h3>
<p><strong>3D Secure</strong> (mang tên thương hiệu Visa Secure / Mastercard Identity Check) thêm một bước xác thực thứ hai cho thanh toán thẻ online: sau khi nhập thông tin thẻ, chủ thẻ xác nhận qua <strong>OTP (mã dùng một lần)</strong> gửi qua SMS/app, hoặc sinh trắc học. Điều này chuyển trách nhiệm gian lận về phía issuer/network và giảm rủi ro cho merchant khi dùng đúng cách, chặn được nhiều kiểu tấn công dùng số thẻ bị đánh cắp.</p>
<h3>PCI-DSS — bộ luật chung của ngành</h3>
<p><strong>PCI-DSS (Payment Card Industry Data Security Standard)</strong> là tập yêu cầu an ninh mọi doanh nghiệp lưu trữ, xử lý hoặc truyền dữ liệu thẻ phải tuân theo — kiểm soát truy cập chặt, mã hoá, quét lỗ hổng định kỳ, hạn chế lưu dữ liệu nhạy cảm (vd không bao giờ lưu CVV sau khi cấp phép). Đây không phải tuỳ chọn: card network có thể phạt hoặc cắt kết nối với merchant không tuân thủ sau một vụ rò rỉ.</p>
<pre><code>Phòng thủ nhiều lớp:
  Mã hoá TLS           -> bảo vệ dữ liệu KHI TRUYỀN
  Tokenization         -> bảo vệ dữ liệu KHI LƯU TRỮ
  3D Secure / OTP       -> chứng minh AI đang trả tiền
  Tuân thủ PCI-DSS      -> bộ QUY TẮC nền nối tất cả lại
</code></pre>
<div class="callout"><span class="badge">Điều merchant cần nhớ</span> Dùng một cổng thanh toán đạt chuẩn PCI để xử lý dữ liệu thẻ thay bạn (số thẻ thật không bao giờ chạm vào server của bạn) là cách phổ biến nhất giúp doanh nghiệp nhỏ đáp ứng phần lớn PCI-DSS với ít công sức nhất.</div>`,
  ]]);

const c7q = quiz('ept301-quiz-7', 'Quiz 7 — Payment security|||Quiz 7 — An ninh thanh toán', [
  { id: 'q1', question: 'Tokenization bảo vệ dữ liệu ở giai đoạn nào?', options: ['Khi đang truyền qua mạng', 'Khi đã lưu trữ', 'Chỉ khi in hoá đơn', 'Không bảo vệ gì'], correctIndex: 1, explanation: 'Tokenization thay số thẻ thật bằng token vô nghĩa khi LƯU TRỮ; TLS mới bảo vệ dữ liệu khi TRUYỀN.' },
  { id: 'q2', question: '3D Secure thêm bước gì vào thanh toán thẻ online?', options: ['Xoá số thẻ sau khi trả', 'Xác thực thêm bằng OTP/biometrics để chứng minh đúng là chủ thẻ', 'Giảm giá cho merchant', 'Chuyển tiền nhanh hơn'], correctIndex: 1, explanation: '3D Secure thêm bước xác thực thứ hai (OTP hoặc sinh trắc học), giúp giảm gian lận dùng thẻ bị đánh cắp.' },
  { id: 'q3', question: 'PCI-DSS là gì?', options: ['Một loại thẻ tín dụng mới', 'Chuẩn yêu cầu an ninh bắt buộc cho mọi bên xử lý dữ liệu thẻ', 'Một hệ thống chuyển khoản thời gian thực', 'Một loại token'], correctIndex: 1, explanation: 'PCI-DSS là tập yêu cầu an ninh bắt buộc với mọi tổ chức lưu trữ/xử lý/truyền dữ liệu thẻ.' },
]);

const c8 = doc('ept301-8-1-fraud-compliance-trends', '8.1 — Fraud prevention, compliance & fintech trends|||8.1 — Phòng chống gian lận, tuân thủ & xu hướng fintech',
  'Các dạng gian lận thanh toán phổ biến; công cụ phát hiện gian lận (rule-based, chấm điểm rủi ro bằng AI/ML); AML/KYC; xu hướng fintech (BNPL, open banking, embedded finance).',
  [[
    `<span class="eyebrow">EPT301 · Chapter 8 · Lesson 8.1</span>
<h2>Fraud prevention, compliance &amp; fintech trends</h2>
<h3>Common types of payment fraud</h3>
<ul>
<li><strong>Card-not-present (CNP) fraud</strong> — using stolen card details online, where no physical card or chip check applies.</li>
<li><strong>Phishing</strong> — tricking a victim into revealing card/account credentials via fake emails, sites, or messages.</li>
<li><strong>Account takeover</strong> — an attacker gains control of a victim's existing payment account (e-wallet, bank login) and drains it.</li>
<li><strong>Friendly fraud</strong> — a genuine customer disputes a legitimate charge as fraudulent to get a free refund (a chargeback abuse pattern).</li>
</ul>
<h3>Detecting fraud</h3>
<p><strong>Rule-based systems</strong> flag transactions matching known risky patterns (e.g. unusually large amount, new device, mismatched billing/shipping country). <strong>AI/ML risk scoring</strong> goes further — models trained on millions of past transactions assign each new one a real-time fraud probability score, catching subtler patterns rules would miss, at the cost of needing large, clean historical data and ongoing retraining.</p>
<h3>AML &amp; KYC — compliance, not just fraud</h3>
<p><strong>KYC (Know Your Customer)</strong> requires verifying a customer's real identity before opening an account or processing large payments. <strong>AML (Anti-Money Laundering)</strong> requires monitoring transaction patterns for signs of laundering illicit funds and reporting suspicious activity to regulators. These exist independently of fraud loss — a "successful," non-fraudulent transaction can still violate AML/KYC rules.</p>
<h3>Fintech trends reshaping payments</h3>
<pre><code>BNPL (Buy Now, Pay Later)  -> installment credit offered at checkout by a
                              third party, not the merchant or a traditional bank
Open banking               -> banks expose secure APIs so licensed third
                              parties can initiate payments/read account data
                              (with customer consent) without screen-scraping
Embedded finance           -> non-financial apps (ride-hailing, e-commerce)
                              bundle payment/lending/insurance directly in-app
</code></pre>
<div class="callout"><span class="badge">Where this course connects</span> Every trend here plugs back into what you already learned: BNPL still routes through gateways &amp; card networks; open banking still needs KYC/AML and strong security; the ecosystem in Chapter 1 just keeps adding new players.</div>`,
    `<span class="eyebrow">EPT301 · Chương 8 · Bài 8.1</span>
<h2>Phòng chống gian lận, tuân thủ &amp; xu hướng fintech</h2>
<h3>Các dạng gian lận thanh toán phổ biến</h3>
<ul>
<li><strong>Gian lận không có thẻ vật lý (CNP)</strong> — dùng thông tin thẻ bị đánh cắp để mua online, nơi không kiểm tra được thẻ vật lý hay chip.</li>
<li><strong>Phishing</strong> — lừa nạn nhân tiết lộ thông tin thẻ/tài khoản qua email, trang web, tin nhắn giả.</li>
<li><strong>Account takeover (chiếm đoạt tài khoản)</strong> — kẻ tấn công chiếm quyền kiểm soát tài khoản thanh toán có sẵn của nạn nhân (ví điện tử, đăng nhập ngân hàng) và rút hết.</li>
<li><strong>Friendly fraud</strong> — khách hàng thật khiếu nại một giao dịch hợp lệ là gian lận để được hoàn tiền miễn phí (một dạng lạm dụng chargeback).</li>
</ul>
<h3>Phát hiện gian lận</h3>
<p><strong>Hệ thống dựa trên quy tắc (rule-based)</strong> gắn cờ giao dịch khớp mẫu rủi ro đã biết (vd số tiền bất thường lớn, thiết bị mới, quốc gia thanh toán/giao hàng lệch nhau). <strong>Chấm điểm rủi ro bằng AI/ML</strong> đi xa hơn — mô hình huấn luyện trên hàng triệu giao dịch cũ gán điểm xác suất gian lận theo thời gian thực cho mỗi giao dịch mới, bắt được các mẫu tinh vi hơn mà quy tắc bỏ lỡ, đổi lại cần dữ liệu lịch sử lớn, sạch và phải huấn luyện lại liên tục.</p>
<h3>AML &amp; KYC — tuân thủ, không chỉ là chống gian lận</h3>
<p><strong>KYC (Know Your Customer)</strong> yêu cầu xác minh danh tính thật của khách hàng trước khi mở tài khoản hoặc xử lý giao dịch lớn. <strong>AML (Anti-Money Laundering)</strong> yêu cầu giám sát mẫu giao dịch để phát hiện dấu hiệu rửa tiền và báo cáo hoạt động đáng nghi lên cơ quan quản lý. Hai yêu cầu này tồn tại độc lập với thiệt hại gian lận — một giao dịch "thành công", không gian lận vẫn có thể vi phạm quy tắc AML/KYC.</p>
<h3>Xu hướng fintech đang định hình lại thanh toán</h3>
<pre><code>BNPL (Mua trước trả sau)   -> tín dụng trả góp cấp ngay tại checkout bởi
                              một bên thứ ba, không phải merchant hay ngân hàng truyền thống
Open banking               -> ngân hàng mở API an toàn để bên thứ ba được cấp phép
                              khởi tạo thanh toán/đọc dữ liệu tài khoản
                              (có sự đồng ý của khách hàng) mà không cần screen-scraping
Embedded finance           -> app không phải tài chính (gọi xe, thương mại điện tử)
                              gắn thanh toán/cho vay/bảo hiểm trực tiếp trong app
</code></pre>
<div class="callout"><span class="badge">Chỗ nối lại với môn học</span> Mọi xu hướng ở đây đều nối lại với những gì bạn đã học: BNPL vẫn đi qua gateway &amp; card network; open banking vẫn cần KYC/AML và an ninh chặt; hệ sinh thái ở Chương 1 chỉ đang thêm những người chơi mới.</div>`,
  ]]);

const c8q = quiz('ept301-quiz-8', 'Quiz 8 — Fraud, compliance & fintech trends|||Quiz 8 — Gian lận, tuân thủ & xu hướng fintech', [
  { id: 'q1', question: 'Gian lận "card-not-present" (CNP) xảy ra khi nào?', options: ['Khi thanh toán bằng thẻ vật lý tại quầy', 'Khi dùng thông tin thẻ bị đánh cắp để mua hàng online', 'Khi ngân hàng phát hành thẻ mới', 'Khi chuyển khoản NAPAS 24/7'], correctIndex: 1, explanation: 'CNP là gian lận online không cần thẻ vật lý, chỉ cần thông tin thẻ bị đánh cắp.' },
  { id: 'q2', question: 'KYC (Know Your Customer) yêu cầu điều gì?', options: ['Chấm điểm rủi ro bằng AI', 'Xác minh danh tính thật của khách hàng trước khi mở tài khoản/giao dịch lớn', 'Mã hoá dữ liệu thẻ', 'Gộp acquirer và issuer'], correctIndex: 1, explanation: 'KYC là yêu cầu xác minh danh tính khách hàng, một phần của tuân thủ AML.' },
  { id: 'q3', question: 'BNPL (Buy Now, Pay Later) hoạt động như thế nào?', options: ['Ngân hàng phát hành thẻ tín dụng mới', 'Một bên thứ ba cấp tín dụng trả góp ngay tại checkout', 'Chuyển khoản thời gian thực miễn phí', 'Một chuẩn mã hoá thanh toán'], correctIndex: 1, explanation: 'BNPL là tín dụng trả góp do một bên thứ ba (không phải merchant hay ngân hàng truyền thống) cấp ngay tại điểm thanh toán.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'EPT301',
    slug: 'ept301-epayment-processes-and-technology',
    title: 'Epayment Processes and Technology',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EPT301.webp',
    shortDescription: 'How electronic payments work — the ecosystem, card networks, gateways, e-wallets/QR/NFC, real-time transfers (NAPAS 24/7), cross-border payments & CBDC, security (PCI-DSS, 3D Secure) & fraud/fintech trends. Bilingual, flows & quizzes.|||Thanh toán điện tử vận hành thế nào — hệ sinh thái, mạng lưới thẻ, cổng thanh toán, ví điện tử/QR/NFC, chuyển khoản thời gian thực (NAPAS 24/7), xuyên biên giới & CBDC, an ninh (PCI-DSS, 3D Secure), gian lận & fintech. Song ngữ, sơ đồ & quiz.',
    description: 'Môn <strong>EPT301 — E-payment Processes and Technology</strong> (khối Quản trị Kinh doanh, kỳ 4) giúp hiểu <strong>thanh toán điện tử vận hành thế nào từ đầu đến cuối</strong>. Từ <strong>hệ sinh thái thanh toán</strong> (issuer/acquirer/network/PSP) → <strong>thẻ &amp; mạng lưới thẻ</strong> (authorization/clearing/settlement) → <strong>cổng thanh toán &amp; xử lý giao dịch</strong> → <strong>ví điện tử &amp; mobile payment</strong> (QR/NFC/VietQR) → <strong>chuyển khoản thời gian thực</strong> (NAPAS 24/7) → <strong>thanh toán xuyên biên giới &amp; tiền số/CBDC</strong> → <strong>an ninh thanh toán</strong> (mã hoá, tokenization, 3D Secure, PCI-DSS) → <strong>phòng chống gian lận, tuân thủ &amp; xu hướng fintech</strong>. Bám giáo trình FLM, song ngữ, có sơ đồ luồng giao dịch thực tế và quiz mỗi chương.',
    whatYouLearn: 'Các bên trong hệ sinh thái thanh toán (issuer, acquirer, network, PSP); mô hình thẻ 4 bên & luồng authorization/clearing/settlement; vai trò gateway/processor/acquirer; ví điện tử, QR tĩnh/động, chuẩn VietQR, NFC & tokenization; chuyển khoản thời gian thực NAPAS 24/7 & ISO 20022; correspondent banking, SWIFT, kiều hối, cryptocurrency & CBDC; mã hoá TLS, tokenization, 3D Secure/OTP, PCI-DSS; các dạng gian lận, phát hiện gian lận bằng rule/AI, AML/KYC; xu hướng BNPL, open banking, embedded finance.',
    requirements: 'Kiến thức nền về tài chính/ngân hàng cơ bản (môn kỳ trước trong khối Quản trị Kinh doanh). Không cần kiến thức kỹ thuật chuyên sâu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chuẩn ngành, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thanh toán điện tử là gì, các bên tham gia, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Hệ sinh thái thanh toán|||Chapter 1 — Payment ecosystem', description: 'Issuer, acquirer, network, PSP, các phương thức thanh toán.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thẻ & mạng lưới thẻ|||Chapter 2 — Cards & card networks', description: 'Mô hình 4 bên, authorization/clearing/settlement.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cổng thanh toán & xử lý giao dịch|||Chapter 3 — Payment gateways & processing', description: 'Gateway vs. processor vs. acquirer, luồng checkout.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ví điện tử & mobile payment|||Chapter 4 — E-wallets & mobile payment', description: 'QR tĩnh/động, VietQR, NFC & tokenization.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chuyển khoản thời gian thực|||Chapter 5 — Real-time payment', description: 'NAPAS 24/7, ISO 20022, settlement finality.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Xuyên biên giới & tiền số/CBDC|||Chapter 6 — Cross-border & digital currency/CBDC', description: 'Correspondent banking, SWIFT, kiều hối, crypto, CBDC.', lessons: [c6, c6q] },
    { title: 'Chương 7 — An ninh thanh toán|||Chapter 7 — Payment security', description: 'Mã hoá, tokenization, 3D Secure, PCI-DSS.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Gian lận, tuân thủ & xu hướng fintech|||Chapter 8 — Fraud, compliance & fintech trends', description: 'Phát hiện gian lận, AML/KYC, BNPL/open banking/embedded finance.', lessons: [c8, c8q] },
  ],
};
