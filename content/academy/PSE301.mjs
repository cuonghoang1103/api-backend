/**
 * PSE301 — Payment Systems in E-Commerce. Hệ thống Thanh toán trong Thương
 * mại điện tử (khối Quản trị Kinh doanh, FPTU). Giáo trình tham khảo: Laudon
 * & Traver "E-commerce: Business, Technology, Society"; Benson "Payments
 * Systems in the U.S."; tài liệu Visa/Mastercard, PCI DSS. 8 chương: tổng
 * quan → thẻ (issuer/acquirer/scheme) → cổng thanh toán/PSP → ví & QR di
 * động → chuyển khoản/ngân hàng số/Open Banking → crypto/blockchain →
 * bảo mật/gian lận/tuân thủ → xu hướng (BNPL, xuyên biên giới, fintech).
 * Song ngữ + ví dụ + quiz. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG
 * backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pse301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, tài liệu chính thức Visa/Mastercard/PCI DSS, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">PSE301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Payment Systems in E-Commerce — card flows, gateways, e-wallets, open banking, crypto and payment security — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PSE301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>E-commerce: Business, Technology, Society</em> — Kenneth C. Laudon &amp; Carol Guercio Traver (chapters on payment systems &amp; e-commerce security)</li>
<li><em>Payments Systems in the U.S.</em> — Carol Coye Benson, Scott Loftesness &amp; Russ Jones — a practitioner's map of card networks, ACH, wires and settlement</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council</a> — official PCI DSS documents</li>
<li><a href="https://www.visa.com/" target="_blank" rel="noopener">Visa</a> and <a href="https://www.mastercard.com/" target="_blank" rel="noopener">Mastercard</a> developer/merchant documentation — four-party model, authorization &amp; settlement</li>
<li><a href="https://napas.com.vn/" target="_blank" rel="noopener">NAPAS</a> — Vietnam's national payment switch (VietQR, domestic card/transfer rails)</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Stripe" target="_blank" rel="noopener">Stripe</a> — how online payments &amp; gateways work, from a PSP's own engineering</li>
<li><a href="https://www.youtube.com/results?search_query=how+card+payments+work" target="_blank" rel="noopener">"How card payments work"</a> search — several solid explainer videos on the four-party model</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://vietqr.io/" target="_blank" rel="noopener">VietQR.io</a> — generate &amp; decode VietQR payment codes</li>
<li><a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener">Stripe test dashboard</a> — a free sandbox to see a real gateway checkout/API flow</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — payment system actors, the card four/five-party model, gateway vs PSP vs acquirer terminology.</li>
<li><strong>Practice</strong> — trace a real checkout: card entry → authorization → capture → settlement; try a VietQR sandbox.</li>
<li><strong>Go deeper</strong> — Open Banking, crypto/stablecoins, PCI DSS scope and 3-D Secure.</li>
<li><strong>Job-ready</strong> — read a PSP's API docs end to end, and be able to explain a chargeback dispute step by step.</li>
</ol></div>`,
    `<span class="eyebrow">PSE301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Hệ thống thanh toán trong Thương mại điện tử — luồng thẻ, cổng thanh toán, ví điện tử, open banking, crypto và bảo mật thanh toán — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PSE301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>E-commerce: Business, Technology, Society</em> — Kenneth C. Laudon &amp; Carol Guercio Traver (các chương về hệ thống thanh toán &amp; bảo mật e-commerce)</li>
<li><em>Payments Systems in the U.S.</em> — Carol Coye Benson, Scott Loftesness &amp; Russ Jones — bản đồ thực tế về mạng thẻ, ACH, chuyển khoản điện và bù trừ</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.pcisecuritystandards.org/" target="_blank" rel="noopener">PCI Security Standards Council</a> — tài liệu chính thức PCI DSS</li>
<li><a href="https://www.visa.com/" target="_blank" rel="noopener">Visa</a> và <a href="https://www.mastercard.com/" target="_blank" rel="noopener">Mastercard</a> — tài liệu cho merchant/nhà phát triển, mô hình bốn bên, cấp phép &amp; bù trừ</li>
<li><a href="https://napas.com.vn/" target="_blank" rel="noopener">NAPAS</a> — hệ thống chuyển mạch tài chính quốc gia (VietQR, hạ tầng thẻ/chuyển khoản trong nước)</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Stripe" target="_blank" rel="noopener">Stripe</a> — thanh toán trực tuyến &amp; cổng thanh toán hoạt động ra sao, từ chính kỹ thuật của một PSP</li>
<li><a href="https://www.youtube.com/results?search_query=how+card+payments+work" target="_blank" rel="noopener">Tìm "how card payments work"</a> — nhiều video giải thích tốt về mô hình bốn bên</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://vietqr.io/" target="_blank" rel="noopener">VietQR.io</a> — sinh &amp; đọc mã VietQR</li>
<li><a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener">Stripe test dashboard</a> — sandbox miễn phí để thấy luồng checkout/API của một cổng thanh toán thật</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các bên trong hệ thống thanh toán, mô hình bốn/năm bên của thẻ, thuật ngữ gateway vs PSP vs acquirer.</li>
<li><strong>Luyện tập</strong> — lần theo một giao dịch thật: nhập thẻ → cấp phép → capture → bù trừ; thử sandbox VietQR.</li>
<li><strong>Đào sâu</strong> — Open Banking, crypto/stablecoin, phạm vi PCI DSS và 3-D Secure.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc hết tài liệu API của một PSP, giải thích được từng bước một tranh chấp chargeback.</li>
</ol></div>`,
  ]]);

const intro = doc('pse301-0-1-overview', 'Course overview: Payment Systems in E-Commerce|||Tổng quan: Hệ thống Thanh toán trong Thương mại điện tử',
  'Vai trò của hệ thống thanh toán trong e-commerce; các bên tham gia; lộ trình 8 chương từ tổng quan đến xu hướng fintech.',
  [[
    `<span class="eyebrow">PSE301 · Lesson 0.1 · Overview</span>
<h2>Payment Systems in E-Commerce</h2>
<p class="lead">Every online purchase ends the same way: money must move from buyer to seller, safely and quickly. This course explains <strong>how</strong> — the actors, rails and rules behind cards, e-wallets, bank transfers and crypto — and where fraud, compliance and new fintech trends fit in.</p>
<h3>Why payment systems matter</h3>
<ul>
<li><strong>Trust</strong> — a buyer who does not trust the payment step abandons the cart.</li>
<li><strong>Speed &amp; cost</strong> — every rail (card, QR, bank transfer, crypto) trades off speed, cost and reach differently.</li>
<li><strong>Risk</strong> — fraud, chargebacks and regulation (PCI DSS, AML) are business risks, not just IT problems.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Overview of e-commerce payments → card flows (issuer/acquirer/scheme) → payment gateways &amp; PSPs → e-wallets &amp; mobile QR (VietQR, Momo, ZaloPay) → bank transfer, digital banking &amp; Open Banking → cryptocurrency &amp; blockchain → security, fraud &amp; compliance (PCI DSS, 3-D Secure, AML) → trends: BNPL, cross-border payments &amp; fintech regulation.</p>`,
    `<span class="eyebrow">PSE301 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống Thanh toán trong Thương mại điện tử</h2>
<p class="lead">Mọi giao dịch mua online đều kết thúc giống nhau: tiền phải chuyển từ người mua sang người bán, an toàn và nhanh chóng. Môn này giải thích <strong>bằng cách nào</strong> — các bên tham gia, hạ tầng và quy tắc phía sau thẻ, ví điện tử, chuyển khoản ngân hàng và crypto — cùng vị trí của gian lận, tuân thủ và các xu hướng fintech mới.</p>
<h3>Vì sao hệ thống thanh toán quan trọng</h3>
<ul>
<li><strong>Niềm tin</strong> — người mua không tin bước thanh toán sẽ bỏ giỏ hàng.</li>
<li><strong>Tốc độ &amp; chi phí</strong> — mỗi hạ tầng (thẻ, QR, chuyển khoản, crypto) đánh đổi tốc độ, chi phí và độ phổ cập khác nhau.</li>
<li><strong>Rủi ro</strong> — gian lận, chargeback và quy định (PCI DSS, chống rửa tiền) là rủi ro kinh doanh, không chỉ vấn đề kỹ thuật.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Tổng quan thanh toán e-commerce → luồng thẻ (issuer/acquirer/scheme) → cổng thanh toán &amp; PSP → ví điện tử &amp; QR di động (VietQR, Momo, ZaloPay) → chuyển khoản, ngân hàng số &amp; Open Banking → tiền mã hoá &amp; blockchain → bảo mật, gian lận &amp; tuân thủ (PCI DSS, 3-D Secure, chống rửa tiền) → xu hướng: BNPL, thanh toán xuyên biên giới &amp; quy định fintech.</p>`,
  ]]);

const c1 = doc('pse301-1-1-overview-actors', '1.1 — Overview of e-commerce payment systems|||1.1 — Tổng quan hệ thống thanh toán điện tử',
  'Các bên tham gia (buyer, merchant, bank/PSP); thanh toán tiền mặt vs không tiền mặt; push vs pull; vòng đời một giao dịch e-commerce.',
  [[
    `<span class="eyebrow">PSE301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of e-commerce payment systems</h2>
<h3>Who is involved</h3>
<ul>
<li><strong>Buyer (payer)</strong> — the customer, holding a card, wallet or bank account.</li>
<li><strong>Merchant (payee)</strong> — the online store receiving the money.</li>
<li><strong>Banks / PSPs</strong> — financial institutions and payment service providers that move and guarantee the money between the two.</li>
</ul>
<h3>Cash-based vs cashless, push vs pull</h3>
<ul>
<li><strong>Cash-based</strong> (e.g. cash on delivery) settles outside the digital system; <strong>cashless</strong> (card, wallet, transfer, crypto) settles through it.</li>
<li><strong>Push payment</strong> — the payer initiates and sends money (bank transfer, QR pay). <strong>Pull payment</strong> — the payee requests money using authorization the payer gave earlier (card charge, subscription).</li>
</ul>
<h3>Lifecycle of an e-commerce payment</h3>
<pre><code>Cart -> Checkout -> Authorization (funds reserved)
     -> Capture (funds actually taken)
     -> Settlement (money moves bank to bank)
     -> Reconciliation (merchant books match the bank statement)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> "Payment accepted" on screen is only <em>authorization</em> — the money hasn't necessarily moved yet. Capture, settlement and reconciliation happen afterward, often hours or days later.</div>`,
    `<span class="eyebrow">PSE301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan hệ thống thanh toán điện tử</h2>
<h3>Các bên tham gia</h3>
<ul>
<li><strong>Người mua (payer)</strong> — khách hàng, dùng thẻ, ví hoặc tài khoản ngân hàng.</li>
<li><strong>Người bán (payee)</strong> — cửa hàng online nhận tiền.</li>
<li><strong>Ngân hàng / PSP</strong> — các tổ chức tài chính và nhà cung cấp dịch vụ thanh toán chuyển và bảo đảm tiền giữa hai bên.</li>
</ul>
<h3>Tiền mặt vs không tiền mặt, push vs pull</h3>
<ul>
<li><strong>Dựa trên tiền mặt</strong> (vd COD — thu tiền khi giao hàng) bù trừ ngoài hệ thống số; <strong>không tiền mặt</strong> (thẻ, ví, chuyển khoản, crypto) bù trừ qua hệ thống số.</li>
<li><strong>Thanh toán push</strong> — người mua khởi tạo và gửi tiền đi (chuyển khoản, quét QR trả tiền). <strong>Thanh toán pull</strong> — người bán yêu cầu tiền dựa trên uỷ quyền người mua đã cấp trước (trừ tiền thẻ, thuê bao định kỳ).</li>
</ul>
<h3>Vòng đời một giao dịch thanh toán e-commerce</h3>
<pre><code>Giỏ hàng -> Checkout -> Cấp phép (giữ tiền)
         -> Capture (thực sự trừ tiền)
         -> Bù trừ/Settlement (tiền chuyển giữa các ngân hàng)
         -> Đối soát (số sách merchant khớp sao kê ngân hàng)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> "Thanh toán thành công" trên màn hình mới chỉ là <em>cấp phép</em> — tiền chưa hẳn đã chuyển. Capture, bù trừ và đối soát diễn ra sau đó, thường vài giờ đến vài ngày.</div>`,
  ]]);

const c1q = quiz('pse301-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Trong e-commerce, "authorization" (cấp phép) có nghĩa là gì?', options: ['Tiền đã thực sự chuyển xong', 'Giữ (reserve) tiền, chưa chắc đã trừ', 'Đơn hàng đã giao thành công', 'Merchant đã nhận tiền mặt'], correctIndex: 1, explanation: 'Authorization chỉ giữ tiền; capture mới thực sự trừ, settlement mới chuyển tiền giữa ngân hàng.' },
  { id: 'q2', question: 'Thanh toán "push" khác "pull" ở điểm nào?', options: ['Push do người mua khởi tạo gửi tiền; pull do người bán yêu cầu trừ tiền', 'Push chỉ dùng tiền mặt', 'Pull không cần uỷ quyền trước', 'Không có khác biệt'], correctIndex: 0, explanation: 'Push: người mua tự gửi (chuyển khoản, QR). Pull: người bán rút tiền dựa trên uỷ quyền trước (thẻ, thuê bao).' },
  { id: 'q3', question: 'Bước nào xảy ra SAU CÙNG trong vòng đời thanh toán?', options: ['Cấp phép', 'Capture', 'Đối soát (reconciliation)', 'Checkout'], correctIndex: 2, explanation: 'Thứ tự: checkout → cấp phép → capture → bù trừ → đối soát cuối cùng.' },
]);

const c2 = doc('pse301-2-1-card-flow', '2.1 — Cards & the card payment flow|||2.1 — Thẻ & luồng thanh toán thẻ',
  'Mô hình bốn/năm bên: issuer (ngân hàng phát hành), acquirer (ngân hàng thanh toán), card scheme (Visa/Mastercard); cấp phép → clearing → settlement.',
  [[
    `<span class="eyebrow">PSE301 · Chapter 2 · Lesson 2.1</span>
<h2>Cards &amp; the card payment flow</h2>
<h3>The four-party model</h3>
<ul>
<li><strong>Cardholder</strong> — the buyer holding the card.</li>
<li><strong>Issuer</strong> — the cardholder's bank; issues the card, approves or declines each transaction.</li>
<li><strong>Acquirer</strong> — the merchant's bank; receives the funds on the merchant's behalf.</li>
<li><strong>Card scheme</strong> (Visa, Mastercard) — owns the network rules and routes messages between issuer and acquirer.</li>
</ul>
<p>A <strong>five-party model</strong> adds a <strong>PSP/payment gateway</strong> between merchant and acquirer, handling the technical connection (see Chapter 3).</p>
<h3>The three stages of a card transaction</h3>
<pre><code>1. Authorization (real-time, seconds)
   Cardholder -> Merchant -> Acquirer -> Scheme -> Issuer
   Issuer checks funds/limit/fraud -> APPROVE or DECLINE
   Issuer -> Scheme -> Acquirer -> Merchant

2. Clearing (batch, same/next day)
   Acquirer & Issuer exchange transaction data via the Scheme
   -> amounts are calculated for each side

3. Settlement (funds actually move, T+1/T+2)
   Money moves Issuer -> Scheme -> Acquirer -> Merchant's account
</code></pre>
<div class="callout"><span class="badge">Chargeback</span> If a cardholder disputes a charge, the flow runs partly in reverse: the issuer pulls money back from the acquirer, who deducts it from the merchant — often weeks after the original sale.</div>`,
    `<span class="eyebrow">PSE301 · Chương 2 · Bài 2.1</span>
<h2>Thẻ &amp; luồng thanh toán thẻ</h2>
<h3>Mô hình bốn bên</h3>
<ul>
<li><strong>Chủ thẻ</strong> — người mua đang cầm thẻ.</li>
<li><strong>Issuer (ngân hàng phát hành)</strong> — ngân hàng của chủ thẻ; phát hành thẻ, chấp thuận hoặc từ chối từng giao dịch.</li>
<li><strong>Acquirer (ngân hàng thanh toán)</strong> — ngân hàng của merchant; nhận tiền thay merchant.</li>
<li><strong>Card scheme</strong> (Visa, Mastercard) — sở hữu quy tắc mạng lưới và định tuyến thông điệp giữa issuer và acquirer.</li>
</ul>
<p><strong>Mô hình năm bên</strong> thêm một <strong>PSP/payment gateway</strong> giữa merchant và acquirer, xử lý kết nối kỹ thuật (xem Chương 3).</p>
<h3>Ba giai đoạn của một giao dịch thẻ</h3>
<pre><code>1. Cấp phép (Authorization — thời gian thực, vài giây)
   Chủ thẻ -> Merchant -> Acquirer -> Scheme -> Issuer
   Issuer kiểm hạn mức/số dư/gian lận -> CHẤP THUẬN hoặc TỪ CHỐI
   Issuer -> Scheme -> Acquirer -> Merchant

2. Clearing (theo lô, cùng ngày/ngày sau)
   Acquirer & Issuer trao đổi dữ liệu giao dịch qua Scheme
   -> tính số tiền mỗi bên phải trả/nhận

3. Settlement/Bù trừ (tiền thực sự chuyển, T+1/T+2)
   Tiền chuyển Issuer -> Scheme -> Acquirer -> tài khoản Merchant
</code></pre>
<div class="callout"><span class="badge">Chargeback</span> Nếu chủ thẻ khiếu nại giao dịch, luồng chạy ngược một phần: issuer rút tiền lại từ acquirer, acquirer trừ lại từ merchant — thường vài tuần sau giao dịch gốc.</div>`,
  ]]);

const c2q = quiz('pse301-quiz-2', 'Quiz 2 — Card flow|||Quiz 2 — Luồng thanh toán thẻ', [
  { id: 'q1', question: 'Trong mô hình bốn bên, "acquirer" là ai?', options: ['Ngân hàng của chủ thẻ', 'Ngân hàng của merchant, nhận tiền thay merchant', 'Tổ chức sở hữu mạng thẻ (Visa/Mastercard)', 'Chính chủ thẻ'], correctIndex: 1, explanation: 'Acquirer là ngân hàng thanh toán, đứng phía merchant; issuer mới là ngân hàng của chủ thẻ.' },
  { id: 'q2', question: 'Giai đoạn nào diễn ra THỜI GIAN THỰC (vài giây), ngay lúc thanh toán?', options: ['Clearing', 'Settlement', 'Authorization (cấp phép)', 'Đối soát'], correctIndex: 2, explanation: 'Cấp phép chạy real-time để chấp thuận/từ chối; clearing và settlement xử lý theo lô, sau đó.' },
  { id: 'q3', question: 'Mô hình năm bên khác bốn bên ở chỗ nào?', options: ['Bỏ vai trò issuer', 'Thêm PSP/gateway giữa merchant và acquirer', 'Bỏ card scheme', 'Chủ thẻ giao dịch trực tiếp với issuer'], correctIndex: 1, explanation: 'Năm bên = bốn bên + PSP/gateway xử lý kết nối kỹ thuật giữa merchant và acquirer.' },
]);

const c3 = doc('pse301-3-1-gateway-psp', '3.1 — Payment gateways & PSPs|||3.1 — Cổng thanh toán & payment gateway/PSP',
  'Payment gateway vs payment processor vs PSP (aggregator) vs acquiring bank; hosted checkout vs tích hợp API; tokenization.',
  [[
    `<span class="eyebrow">PSE301 · Chapter 3 · Lesson 3.1</span>
<h2>Payment gateways &amp; PSPs</h2>
<h3>Untangling the terms</h3>
<ul>
<li><strong>Payment gateway</strong> — the technical layer that encrypts and forwards transaction data from the merchant's checkout to the processor/acquirer.</li>
<li><strong>Payment processor</strong> — handles the message exchange with card schemes and banks behind the gateway.</li>
<li><strong>PSP (Payment Service Provider / aggregator)</strong> — e.g. Stripe, PayPal — bundles gateway + processor + merchant-account-like access, so a small merchant doesn't need its own acquirer relationship.</li>
<li><strong>Acquiring bank</strong> — still ultimately holds the merchant account that receives settled funds.</li>
</ul>
<h3>Two integration patterns</h3>
<ul>
<li><strong>Hosted checkout / redirect</strong> — the buyer is sent to the PSP's own page to enter card details; simplest, and keeps the merchant largely out of PCI DSS scope.</li>
<li><strong>API / direct integration</strong> — the merchant's own page collects card data (often via the PSP's JS SDK, e.g. tokenized fields) and calls the PSP's API; more control over UX, more compliance responsibility.</li>
</ul>
<h3>Tokenization</h3>
<pre><code>Card number -> PSP vault -> single-use/reusable TOKEN returned to merchant
Merchant stores/sends the TOKEN, never the real card number
-> reduces what a data breach at the merchant can expose
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Choosing hosted checkout vs API integration is a real trade-off between development speed/compliance burden and control over the checkout experience.</div>`,
    `<span class="eyebrow">PSE301 · Chương 3 · Bài 3.1</span>
<h2>Cổng thanh toán &amp; payment gateway/PSP</h2>
<h3>Gỡ rối các thuật ngữ</h3>
<ul>
<li><strong>Payment gateway (cổng thanh toán)</strong> — lớp kỹ thuật mã hoá và chuyển tiếp dữ liệu giao dịch từ checkout của merchant tới processor/acquirer.</li>
<li><strong>Payment processor</strong> — xử lý trao đổi thông điệp với card scheme và ngân hàng phía sau gateway.</li>
<li><strong>PSP (nhà cung cấp dịch vụ thanh toán / aggregator)</strong> — vd Stripe, PayPal — gộp gateway + processor + quyền truy cập kiểu merchant account, nên merchant nhỏ không cần quan hệ trực tiếp với acquirer.</li>
<li><strong>Acquiring bank</strong> — vẫn là bên giữ merchant account cuối cùng nhận tiền đã bù trừ.</li>
</ul>
<h3>Hai kiểu tích hợp</h3>
<ul>
<li><strong>Hosted checkout / redirect</strong> — người mua được chuyển sang trang của PSP để nhập thông tin thẻ; đơn giản nhất, và giữ merchant phần lớn ngoài phạm vi PCI DSS.</li>
<li><strong>Tích hợp API / trực tiếp</strong> — trang của merchant tự thu thập dữ liệu thẻ (thường qua JS SDK của PSP, vd trường đã token hoá) và gọi API của PSP; nhiều quyền kiểm soát UX hơn, nhiều trách nhiệm tuân thủ hơn.</li>
</ul>
<h3>Tokenization</h3>
<pre><code>Số thẻ -> Kho lưu trữ của PSP -> TOKEN (dùng 1 lần/nhiều lần) trả về merchant
Merchant lưu/gửi TOKEN, không bao giờ lưu số thẻ thật
-> giảm dữ liệu bị lộ nếu merchant bị vi phạm dữ liệu
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Chọn hosted checkout hay tích hợp API là đánh đổi thật giữa tốc độ phát triển/gánh tuân thủ và quyền kiểm soát trải nghiệm checkout.</div>`,
  ]]);

const c3q = quiz('pse301-quiz-3', 'Quiz 3 — Gateway & PSP|||Quiz 3 — Cổng thanh toán & PSP', [
  { id: 'q1', question: 'Vai trò chính của "payment gateway" là gì?', options: ['Phát hành thẻ cho khách hàng', 'Mã hoá & chuyển tiếp dữ liệu giao dịch từ checkout tới processor/acquirer', 'Quyết định lãi suất ngân hàng', 'Thay thế card scheme'], correctIndex: 1, explanation: 'Gateway là lớp kỹ thuật chuyển tiếp và mã hoá dữ liệu giao dịch, không phải bên phát hành hay quyết định lãi suất.' },
  { id: 'q2', question: 'Vì sao hosted checkout giúp merchant giảm phạm vi PCI DSS?', options: ['Vì merchant lưu số thẻ thật', 'Vì dữ liệu thẻ được nhập trực tiếp trên trang của PSP, không đi qua hệ thống merchant', 'Vì hosted checkout không cần mã hoá', 'Vì PCI DSS chỉ áp dụng cho ngân hàng'], correctIndex: 1, explanation: 'Với hosted checkout, dữ liệu thẻ nhạy cảm không chạm vào hệ thống của merchant.' },
  { id: 'q3', question: 'Tokenization giải quyết vấn đề gì?', options: ['Tăng lãi suất cho ngân hàng', 'Giảm dữ liệu thẻ thật bị lộ nếu merchant bị tấn công', 'Loại bỏ hoàn toàn nhu cầu cấp phép', 'Thay thế card scheme'], correctIndex: 1, explanation: 'Token thay số thẻ thật; nếu hệ thống merchant bị lộ, kẻ tấn công chỉ lấy được token vô giá trị ngoài PSP.' },
]);

const c4 = doc('pse301-4-1-wallet-qr-mobile', '4.1 — E-wallets, QR & mobile payments|||4.1 — Ví điện tử, QR & thanh toán di động',
  'Ví điện tử (Momo, ZaloPay), chuẩn QR VietQR/NAPAS 247, QR tĩnh vs động, thanh toán NFC/contactless.',
  [[
    `<span class="eyebrow">PSE301 · Chapter 4 · Lesson 4.1</span>
<h2>E-wallets, QR &amp; mobile payments</h2>
<h3>E-wallets</h3>
<p>An <strong>e-wallet</strong> (Momo, ZaloPay, ShopeePay) stores a balance and/or linked cards/bank accounts inside an app; it sits between the user and the banking system, offering instant peer-to-peer transfer, bill payment and in-app/QR checkout.</p>
<h3>QR payments — VietQR</h3>
<ul>
<li><strong>VietQR</strong> (built on the NAPAS 247 fast-transfer network) encodes an account number, bank ID and amount into a single QR code that ANY participating banking app can scan and pay — no need to install the merchant's own wallet.</li>
<li><strong>Static QR</strong> — printed once, encodes only the receiving account; the buyer types the amount. <strong>Dynamic QR</strong> — generated per transaction, already includes the exact amount (and often an order reference) — safer and faster.</li>
</ul>
<h3>QR payment flow</h3>
<pre><code>Merchant checkout -> generate dynamic QR (amount + order ref)
Buyer's banking/e-wallet app scans QR
   -> app shows amount, buyer confirms
   -> instant transfer via NAPAS 247 / wallet rail
Merchant's system receives a webhook/callback -> order marked PAID
</code></pre>
<h3>NFC / contactless</h3>
<p>Contactless cards and mobile wallets (Apple Pay, Google Pay) use <strong>NFC</strong> to transmit a tokenized card number to a terminal — fast, and the real card number never touches the merchant terminal.</p>
<div class="callout"><span class="badge">Why QR won in Vietnam</span> No new hardware needed (any phone camera works), works across banks via NAPAS, and dynamic QR removes typing errors — a big reason for its explosive adoption in Vietnamese e-commerce and retail.</div>`,
    `<span class="eyebrow">PSE301 · Chương 4 · Bài 4.1</span>
<h2>Ví điện tử, QR &amp; thanh toán di động</h2>
<h3>Ví điện tử</h3>
<p>Một <strong>ví điện tử</strong> (Momo, ZaloPay, ShopeePay) lưu số dư và/hoặc liên kết thẻ/tài khoản ngân hàng trong app; nó nằm giữa người dùng và hệ thống ngân hàng, cung cấp chuyển tiền tức thời giữa người dùng, thanh toán hoá đơn và checkout trong app/qua QR.</p>
<h3>Thanh toán QR — VietQR</h3>
<ul>
<li><strong>VietQR</strong> (xây trên hạ tầng chuyển nhanh NAPAS 247) mã hoá số tài khoản, mã ngân hàng và số tiền vào một mã QR duy nhất mà BẤT KỲ app ngân hàng tham gia nào cũng quét và trả được — không cần cài ví riêng của người bán.</li>
<li><strong>QR tĩnh</strong> — in một lần, chỉ mã hoá tài khoản nhận; người mua tự nhập số tiền. <strong>QR động</strong> — sinh riêng cho từng giao dịch, đã gồm sẵn số tiền chính xác (thường kèm mã tham chiếu đơn hàng) — an toàn và nhanh hơn.</li>
</ul>
<h3>Luồng thanh toán QR</h3>
<pre><code>Checkout của merchant -> sinh QR động (số tiền + mã đơn hàng)
App ngân hàng/ví của người mua quét QR
   -> app hiện số tiền, người mua xác nhận
   -> chuyển tiền tức thời qua NAPAS 247 / hạ tầng ví
Hệ thống merchant nhận webhook/callback -> đơn hàng chuyển ĐÃ THANH TOÁN
</code></pre>
<h3>NFC / không tiếp xúc</h3>
<p>Thẻ contactless và ví di động (Apple Pay, Google Pay) dùng <strong>NFC</strong> để truyền số thẻ đã token hoá tới máy POS — nhanh, và số thẻ thật không bao giờ chạm vào máy POS của merchant.</p>
<div class="callout"><span class="badge">Vì sao QR thắng ở Việt Nam</span> Không cần phần cứng mới (camera điện thoại là đủ), hoạt động xuyên ngân hàng qua NAPAS, và QR động loại bỏ lỗi nhập tay — một lý do lớn khiến nó bùng nổ trong e-commerce và bán lẻ Việt Nam.</div>`,
  ]]);

const c4q = quiz('pse301-quiz-4', 'Quiz 4 — Wallet & QR|||Quiz 4 — Ví & QR', [
  { id: 'q1', question: 'VietQR khác gì so với mã QR riêng của một ví điện tử duy nhất?', options: ['VietQR chỉ dùng được trong một app', 'VietQR quét được bởi bất kỳ app ngân hàng tham gia NAPAS, không cần cài ví riêng', 'VietQR không mã hoá số tiền', 'VietQR chỉ dùng cho chuyển khoản quốc tế'], correctIndex: 1, explanation: 'VietQR xây trên NAPAS 247, liên thông giữa các ngân hàng/app, không khoá vào một ví duy nhất.' },
  { id: 'q2', question: 'QR động (dynamic QR) an toàn hơn QR tĩnh ở điểm nào?', options: ['QR động không cần quét', 'QR động đã gồm sẵn số tiền chính xác cho từng giao dịch, giảm lỗi nhập tay', 'QR động không dùng NAPAS', 'QR tĩnh không thể in ra'], correctIndex: 1, explanation: 'QR tĩnh chỉ mã hoá tài khoản nhận, người mua phải tự nhập số tiền — dễ sai; QR động đã có sẵn số tiền đúng.' },
  { id: 'q3', question: 'Thanh toán NFC/contactless bảo vệ số thẻ thật bằng cách nào?', options: ['Không mã hoá gì cả', 'Truyền số thẻ đã token hoá tới máy POS, số thẻ thật không chạm vào terminal', 'Yêu cầu ký tay mỗi lần', 'Chỉ hoạt động khi có internet tốc độ cao'], correctIndex: 1, explanation: 'NFC gửi một token thay số thẻ thật đến terminal, giảm rủi ro nếu terminal bị tấn công.' },
]);

const c5 = doc('pse301-5-1-transfer-digital-openbanking', '5.1 — Bank transfer, digital banking & Open Banking|||5.1 — Chuyển khoản, ngân hàng số & Open Banking',
  'Chuyển khoản trong nước (NAPAS) vs quốc tế (SWIFT); ngân hàng số; Open Banking API (account aggregation, payment initiation).',
  [[
    `<span class="eyebrow">PSE301 · Chapter 5 · Lesson 5.1</span>
<h2>Bank transfer, digital banking &amp; Open Banking</h2>
<h3>Domestic vs international transfer</h3>
<ul>
<li><strong>Domestic transfer</strong> in Vietnam runs over <strong>NAPAS</strong> — usually settling in seconds via the 24/7 fast-transfer scheme, at low or zero cost.</li>
<li><strong>International transfer</strong> typically runs over <strong>SWIFT</strong> messaging between correspondent banks — slower (often 1-3 business days), with FX conversion and multiple intermediary fees.</li>
</ul>
<h3>Digital banking</h3>
<p>Digital banking apps let customers manage accounts and pay entirely online (no branch visit): balance checks, transfers, bill pay, card controls — the customer-facing layer sitting on top of the core banking system.</p>
<h3>Open Banking</h3>
<p><strong>Open Banking</strong> lets a customer authorize a third-party app (e.g. a budgeting app or a merchant's checkout) to securely access their bank data or initiate a payment directly from their account, via standardized bank APIs — instead of screen-scraping or manually typing account numbers.</p>
<pre><code>Two core Open Banking use cases:
1. Account Information Service (AIS) -> read balances/transactions (read-only, with consent)
2. Payment Initiation Service (PIS)   -> trigger a bank transfer directly from checkout
</code></pre>
<div class="callout"><span class="badge">Why it matters for e-commerce</span> Open Banking-based "pay by bank" checkout can be cheaper than card fees and settle faster than traditional transfers — a growing alternative rail merchants are starting to offer.</div>`,
    `<span class="eyebrow">PSE301 · Chương 5 · Bài 5.1</span>
<h2>Chuyển khoản, ngân hàng số &amp; Open Banking</h2>
<h3>Chuyển khoản trong nước vs quốc tế</h3>
<ul>
<li><strong>Chuyển khoản trong nước</strong> tại Việt Nam chạy qua <strong>NAPAS</strong> — thường bù trừ trong vài giây qua hệ thống chuyển nhanh 24/7, chi phí thấp hoặc miễn phí.</li>
<li><strong>Chuyển khoản quốc tế</strong> thường chạy qua thông điệp <strong>SWIFT</strong> giữa các ngân hàng đại lý — chậm hơn (thường 1-3 ngày làm việc), kèm quy đổi ngoại tệ và nhiều phí trung gian.</li>
</ul>
<h3>Ngân hàng số</h3>
<p>App ngân hàng số cho khách hàng quản lý tài khoản và thanh toán hoàn toàn trực tuyến (không cần đến chi nhánh): xem số dư, chuyển tiền, thanh toán hoá đơn, khoá/mở thẻ — lớp giao tiếp khách hàng nằm trên hệ thống ngân hàng lõi (core banking).</p>
<h3>Open Banking</h3>
<p><strong>Open Banking</strong> cho phép khách hàng uỷ quyền một app bên thứ ba (vd app quản lý chi tiêu hoặc checkout của merchant) truy cập an toàn dữ liệu ngân hàng của họ hoặc khởi tạo thanh toán trực tiếp từ tài khoản, qua các API ngân hàng tiêu chuẩn hoá — thay vì cào màn hình hay tự nhập tay số tài khoản.</p>
<pre><code>Hai trường hợp dùng chính của Open Banking:
1. Account Information Service (AIS) -> đọc số dư/giao dịch (chỉ đọc, có uỷ quyền)
2. Payment Initiation Service (PIS)   -> kích hoạt chuyển khoản trực tiếp từ checkout
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng với e-commerce</span> Checkout "pay by bank" dựa trên Open Banking có thể rẻ hơn phí thẻ và bù trừ nhanh hơn chuyển khoản truyền thống — một hạ tầng thay thế ngày càng nhiều merchant bắt đầu cung cấp.</div>`,
  ]]);

const c5q = quiz('pse301-quiz-5', 'Quiz 5 — Transfer & Open Banking|||Quiz 5 — Chuyển khoản & Open Banking', [
  { id: 'q1', question: 'Vì sao chuyển khoản quốc tế qua SWIFT thường chậm hơn chuyển khoản trong nước qua NAPAS?', options: ['SWIFT không dùng máy tính', 'SWIFT đi qua nhiều ngân hàng đại lý và kèm quy đổi ngoại tệ', 'NAPAS chỉ hoạt động ban đêm', 'Không có sự khác biệt về tốc độ'], correctIndex: 1, explanation: 'Chuyển khoản quốc tế qua nhiều ngân hàng trung gian và FX, còn NAPAS bù trừ trong nước tức thời.' },
  { id: 'q2', question: 'Payment Initiation Service (PIS) trong Open Banking dùng để làm gì?', options: ['Chỉ đọc số dư tài khoản', 'Khởi tạo chuyển khoản trực tiếp từ tài khoản khách hàng, có uỷ quyền', 'Phát hành thẻ mới', 'Đổi ngoại tệ'], correctIndex: 1, explanation: 'PIS cho phép một app được uỷ quyền kích hoạt thanh toán trực tiếp từ tài khoản ngân hàng của khách.' },
  { id: 'q3', question: 'AIS (Account Information Service) khác PIS ở điểm nào?', options: ['AIS chỉ đọc dữ liệu (số dư/giao dịch), không khởi tạo thanh toán', 'AIS dùng để phát hành thẻ', 'AIS và PIS giống nhau hoàn toàn', 'AIS chỉ dùng cho chuyển khoản quốc tế'], correctIndex: 0, explanation: 'AIS là dịch vụ chỉ-đọc (có uỷ quyền); PIS mới là dịch vụ khởi tạo thanh toán.' },
]);

const c6 = doc('pse301-6-1-crypto-blockchain', '6.1 — Cryptocurrency & blockchain in payments|||6.1 — Tiền mã hoá & blockchain trong thanh toán',
  'Sổ cái phân tán & đồng thuận; crypto làm phương tiện thanh toán và rào cản biến động giá; stablecoin; khái niệm CBDC.',
  [[
    `<span class="eyebrow">PSE301 · Chapter 6 · Lesson 6.1</span>
<h2>Cryptocurrency &amp; blockchain in payments</h2>
<h3>Blockchain basics</h3>
<p>A <strong>blockchain</strong> is a distributed ledger — a shared record of transactions replicated across many computers, with new blocks added only after network nodes reach <strong>consensus</strong> that they're valid. No single bank or company controls it, which is both its appeal (no intermediary) and its challenge (no one to call when something goes wrong).</p>
<h3>Cryptocurrency as a payment method</h3>
<ul>
<li><strong>Pros</strong> — can settle cross-border without a correspondent-bank chain, operates 24/7, transactions are irreversible (no chargebacks for the merchant).</li>
<li><strong>Cons</strong> — <strong>price volatility</strong> (a $50 sale could be worth $45 by settlement), slower/costlier at network congestion, unclear regulation in many markets, irreversibility also means no recourse for buyers.</li>
</ul>
<h3>Stablecoins &amp; CBDC</h3>
<p>A <strong>stablecoin</strong> is a crypto token pegged to a stable asset (usually USD), aiming to keep blockchain's settlement speed without the volatility — increasingly used for cross-border settlement between businesses. A <strong>CBDC (Central Bank Digital Currency)</strong> is a digital form of a country's own currency issued directly by its central bank — conceptually a "digital cash," still mostly in pilot stages worldwide.</p>
<pre><code>Fiat currency  -> stable value, centrally issued, reversible via banks/cards
Cryptocurrency -> decentralized, volatile, irreversible
Stablecoin     -> decentralized ledger + pegged (stable) value
CBDC           -> centrally issued + digital ledger
</code></pre>
<div class="callout"><span class="badge">Where it's used today</span> Most consumer e-commerce checkouts still don't accept crypto directly; adoption is strongest in cross-border B2B settlement and stablecoin-based remittance, not everyday retail checkout.</div>`,
    `<span class="eyebrow">PSE301 · Chương 6 · Bài 6.1</span>
<h2>Tiền mã hoá &amp; blockchain trong thanh toán</h2>
<h3>Kiến thức nền về blockchain</h3>
<p>Một <strong>blockchain</strong> là sổ cái phân tán — một bản ghi giao dịch chung được sao chép trên nhiều máy tính, khối mới chỉ được thêm vào sau khi các node trong mạng đạt <strong>đồng thuận (consensus)</strong> rằng chúng hợp lệ. Không một ngân hàng hay công ty nào kiểm soát nó — vừa là điểm hấp dẫn (không trung gian) vừa là thử thách (không có ai để gọi khi có sự cố).</p>
<h3>Tiền mã hoá như phương tiện thanh toán</h3>
<ul>
<li><strong>Ưu điểm</strong> — có thể bù trừ xuyên biên giới không cần chuỗi ngân hàng đại lý, hoạt động 24/7, giao dịch không thể đảo ngược (merchant không lo chargeback).</li>
<li><strong>Nhược điểm</strong> — <strong>biến động giá</strong> (một đơn hàng 50$ có thể chỉ còn giá trị 45$ lúc bù trừ), chậm/đắt hơn khi mạng tắc nghẽn, quy định pháp lý chưa rõ ở nhiều thị trường, tính không đảo ngược cũng nghĩa là người mua không có đường khiếu nại.</li>
</ul>
<h3>Stablecoin &amp; CBDC</h3>
<p>Một <strong>stablecoin</strong> là token crypto được gắn với một tài sản ổn định (thường là USD), nhằm giữ tốc độ bù trừ của blockchain mà không có biến động giá — ngày càng được dùng để bù trừ xuyên biên giới giữa doanh nghiệp. <strong>CBDC (tiền tệ số ngân hàng trung ương)</strong> là dạng số của chính đồng tiền quốc gia, do ngân hàng trung ương phát hành trực tiếp — về khái niệm là "tiền mặt số," phần lớn vẫn còn ở giai đoạn thử nghiệm trên thế giới.</p>
<pre><code>Tiền pháp định -> giá trị ổn định, phát hành tập trung, đảo ngược được qua ngân hàng/thẻ
Tiền mã hoá    -> phi tập trung, biến động, không đảo ngược
Stablecoin     -> sổ cái phi tập trung + giá trị ổn định (được gắn)
CBDC           -> phát hành tập trung + sổ cái số
</code></pre>
<div class="callout"><span class="badge">Thực tế dùng ở đâu</span> Phần lớn checkout e-commerce tiêu dùng vẫn chưa nhận crypto trực tiếp; mức áp dụng cao nhất nằm ở bù trừ B2B xuyên biên giới và chuyển tiền dựa trên stablecoin, không phải checkout bán lẻ hàng ngày.</div>`,
  ]]);

const c6q = quiz('pse301-quiz-6', 'Quiz 6 — Crypto & blockchain|||Quiz 6 — Crypto & blockchain', [
  { id: 'q1', question: 'Vì sao biến động giá là một nhược điểm của crypto khi dùng để thanh toán?', options: ['Vì crypto không thể chuyển được', 'Vì giá trị giữa lúc thanh toán và lúc bù trừ có thể khác nhau đáng kể', 'Vì crypto luôn tăng giá', 'Vì crypto không cần internet'], correctIndex: 1, explanation: 'Giá crypto dao động mạnh, nên số tiền quy đổi lúc bù trừ có thể khác lúc thanh toán, gây rủi ro cho cả hai bên.' },
  { id: 'q2', question: 'Stablecoin khác tiền mã hoá thông thường (như một số đồng biến động mạnh) ở điểm nào?', options: ['Stablecoin không dùng blockchain', 'Stablecoin được gắn với một tài sản ổn định (thường USD) để giảm biến động', 'Stablecoin do ngân hàng trung ương phát hành', 'Không có khác biệt'], correctIndex: 1, explanation: 'Stablecoin vẫn chạy trên sổ cái phi tập trung nhưng gắn giá với tài sản ổn định.' },
  { id: 'q3', question: 'CBDC (tiền tệ số ngân hàng trung ương) khác crypto phi tập trung ở điểm cốt lõi nào?', options: ['CBDC do ngân hàng trung ương phát hành tập trung, không phi tập trung', 'CBDC luôn biến động giá mạnh hơn crypto', 'CBDC không thể dùng để thanh toán', 'CBDC giống hoàn toàn Bitcoin'], correctIndex: 0, explanation: 'CBDC là tiền số do một cơ quan trung ương (ngân hàng trung ương) phát hành và kiểm soát, khác bản chất phi tập trung của crypto.' },
]);

const c7 = doc('pse301-7-1-security-fraud-compliance', '7.1 — Security, fraud & compliance|||7.1 — Bảo mật, gian lận & tuân thủ',
  'Phạm vi PCI DSS; 3-D Secure (xác thực chủ thẻ); chống rửa tiền (AML/KYC); phát hiện gian lận bằng luật/machine learning.',
  [[
    `<span class="eyebrow">PSE301 · Chapter 7 · Lesson 7.1</span>
<h2>Security, fraud &amp; compliance</h2>
<h3>PCI DSS</h3>
<p><strong>PCI DSS (Payment Card Industry Data Security Standard)</strong> is a set of requirements — set by the card schemes, enforced via the acquirer/PSP — that ANY business storing, processing or transmitting cardholder data must follow: network segmentation, encryption, access control, regular testing. Scope (and audit burden) shrinks a lot if the merchant never touches raw card data (see hosted checkout / tokenization, Chapter 3).</p>
<h3>3-D Secure (3DS)</h3>
<p><strong>3-D Secure</strong> adds a cardholder-authentication step to an online card payment — the issuer (not the merchant) verifies it's really the cardholder, via an OTP, banking-app approval, or biometrics — before authorization completes. It shifts fraud liability toward the issuer when used correctly, and is the technical basis for regulatory requirements like "Strong Customer Authentication."</p>
<pre><code>Card payment WITHOUT 3DS: Merchant -> Acquirer -> Scheme -> Issuer -> approve/decline
Card payment WITH 3DS:    ...same path, PLUS a step where the issuer
                           challenges the cardholder directly (OTP/app)
                           before approve/decline is returned
</code></pre>
<h3>AML/KYC &amp; fraud detection</h3>
<ul>
<li><strong>KYC (Know Your Customer)</strong> — verifying who a customer/merchant actually is before onboarding them.</li>
<li><strong>AML (Anti-Money Laundering)</strong> — monitoring transactions for patterns that suggest illegally-obtained funds being "cleaned," with mandatory reporting of suspicious activity.</li>
<li><strong>Fraud detection</strong> — rule-based checks (velocity limits, mismatched billing/shipping address) plus machine-learning risk scoring that flags or blocks suspicious transactions in real time.</li>
</ul>
<div class="callout"><span class="badge">Compliance is not optional</span> A merchant that ignores PCI DSS or skips AML checks risks fines, loss of the right to accept cards, and in serious AML cases, criminal liability — not just a "best practice" checkbox.</div>`,
    `<span class="eyebrow">PSE301 · Chương 7 · Bài 7.1</span>
<h2>Bảo mật, gian lận &amp; tuân thủ</h2>
<h3>PCI DSS</h3>
<p><strong>PCI DSS (Payment Card Industry Data Security Standard)</strong> là bộ yêu cầu — do các card scheme đặt ra, thực thi qua acquirer/PSP — mà BẤT KỲ doanh nghiệp nào lưu trữ, xử lý hoặc truyền dữ liệu chủ thẻ đều phải tuân theo: phân vùng mạng, mã hoá, kiểm soát truy cập, kiểm tra định kỳ. Phạm vi (và gánh audit) giảm nhiều nếu merchant không bao giờ chạm vào dữ liệu thẻ thô (xem hosted checkout / tokenization, Chương 3).</p>
<h3>3-D Secure (3DS)</h3>
<p><strong>3-D Secure</strong> thêm một bước xác thực chủ thẻ vào giao dịch thẻ online — issuer (không phải merchant) xác minh đúng là chủ thẻ, qua OTP, xác nhận trên app ngân hàng, hoặc sinh trắc học — trước khi cấp phép hoàn tất. Nó chuyển trách nhiệm gian lận về phía issuer khi dùng đúng cách, và là nền kỹ thuật cho các yêu cầu pháp lý như "Xác thực khách hàng mạnh (Strong Customer Authentication)".</p>
<pre><code>Thanh toán thẻ KHÔNG 3DS: Merchant -> Acquirer -> Scheme -> Issuer -> chấp thuận/từ chối
Thanh toán thẻ CÓ 3DS:    ...cùng đường, THÊM một bước issuer
                           thử thách trực tiếp chủ thẻ (OTP/app)
                           trước khi trả kết quả chấp thuận/từ chối
</code></pre>
<h3>AML/KYC &amp; phát hiện gian lận</h3>
<ul>
<li><strong>KYC (Biết khách hàng của bạn)</strong> — xác minh danh tính thật của khách hàng/merchant trước khi cho tham gia hệ thống.</li>
<li><strong>AML (Chống rửa tiền)</strong> — giám sát giao dịch tìm mẫu hình gợi ý tiền có nguồn gốc phi pháp đang được "làm sạch," kèm báo cáo bắt buộc khi có hoạt động đáng ngờ.</li>
<li><strong>Phát hiện gian lận</strong> — kiểm tra dựa trên luật (giới hạn tốc độ giao dịch, địa chỉ thanh toán/giao hàng không khớp) cộng chấm điểm rủi ro bằng machine learning để đánh dấu hoặc chặn giao dịch nghi vấn theo thời gian thực.</li>
</ul>
<div class="callout"><span class="badge">Tuân thủ không phải tuỳ chọn</span> Merchant bỏ qua PCI DSS hoặc lơ là kiểm tra AML đối mặt rủi ro bị phạt, mất quyền nhận thẻ, và trong trường hợp AML nghiêm trọng, cả trách nhiệm hình sự — không chỉ là một mục "nên làm."</div>`,
  ]]);

const c7q = quiz('pse301-quiz-7', 'Quiz 7 — Security & compliance|||Quiz 7 — Bảo mật & tuân thủ', [
  { id: 'q1', question: 'Vì sao hosted checkout/tokenization giúp giảm gánh nặng tuân thủ PCI DSS?', options: ['Vì PCI DSS không áp dụng cho e-commerce', 'Vì merchant không lưu/chạm vào dữ liệu thẻ thô', 'Vì hosted checkout luôn miễn phí', 'Vì PCI DSS chỉ áp dụng cho ngân hàng'], correctIndex: 1, explanation: 'Phạm vi PCI DSS thu hẹp đáng kể khi dữ liệu thẻ thật không đi qua hệ thống của merchant.' },
  { id: 'q2', question: '3-D Secure (3DS) thêm bước nào vào giao dịch thẻ?', options: ['Merchant tự xác minh chủ thẻ', 'Issuer thử thách xác thực trực tiếp chủ thẻ (OTP/app/sinh trắc học)', 'Bỏ qua bước cấp phép', 'Chuyển giao dịch sang tiền mặt'], correctIndex: 1, explanation: '3DS để issuer — bên biết rõ chủ thẻ — thực hiện một bước xác thực bổ sung trước khi cấp phép.' },
  { id: 'q3', question: 'KYC và AML khác nhau như thế nào?', options: ['KYC xác minh danh tính khách hàng; AML giám sát giao dịch nghi ngờ rửa tiền', 'KYC và AML là một quy trình giống nhau', 'AML chỉ áp dụng cho tiền mặt', 'KYC chỉ áp dụng cho merchant, không áp dụng cho khách hàng'], correctIndex: 0, explanation: 'KYC trả lời "khách hàng là ai"; AML giám sát hành vi giao dịch để phát hiện dấu hiệu rửa tiền.' },
]);

const c8 = doc('pse301-8-1-trends-bnpl-crossborder-fintech', '8.1 — Trends: BNPL, cross-border payments & fintech regulation|||8.1 — Xu hướng: BNPL, thanh toán xuyên biên giới, fintech & quy định',
  'Buy Now Pay Later (BNPL); thanh toán xuyên biên giới (correspondent banking, FX); xu hướng quy định fintech.',
  [[
    `<span class="eyebrow">PSE301 · Chapter 8 · Lesson 8.1</span>
<h2>Trends: BNPL, cross-border payments &amp; fintech regulation</h2>
<h3>Buy Now, Pay Later (BNPL)</h3>
<p><strong>BNPL</strong> lets a buyer split a purchase into installments (often interest-free for short terms), approved instantly at checkout by a BNPL provider (not the merchant's bank). The merchant is usually paid in full upfront by the BNPL provider, who then collects installments from the buyer and bears the credit risk — trading a fee for higher conversion and average order value.</p>
<h3>Cross-border payments</h3>
<p>A cross-border e-commerce sale typically still relies on <strong>correspondent banking</strong> — a chain of banks passing the payment along, each taking a small fee and margin on <strong>FX conversion</strong> — which is why international transfers remain slower and costlier than domestic ones (Chapter 5). Newer rails (regional real-time payment links, stablecoin settlement) are starting to shorten that chain.</p>
<pre><code>Traditional cross-border: Buyer's bank -> Correspondent bank(s) -> Seller's bank
                           (multiple fees + FX spread + 1-3+ days)
Emerging alternatives:    Real-time payment scheme links between countries
                           Stablecoin settlement between businesses
</code></pre>
<h3>Fintech regulation trends</h3>
<p>Regulators worldwide are tightening rules on non-bank payment providers as they grow — licensing requirements, safeguarding of customer funds, Strong Customer Authentication mandates (feeding back into 3DS adoption, Chapter 7), and open-data rules that underpin Open Banking (Chapter 5). E-commerce payment strategy has to track this moving target, not just the technology.</p>
<div class="callout"><span class="badge">The big picture</span> Every trend in this chapter is really the same story as the rest of the course, at a different layer: new intermediaries (BNPL providers), new rails shortening old chains (cross-border), and rules catching up to both.</div>`,
    `<span class="eyebrow">PSE301 · Chương 8 · Bài 8.1</span>
<h2>Xu hướng: BNPL, thanh toán xuyên biên giới, fintech &amp; quy định</h2>
<h3>Mua trước trả sau (BNPL)</h3>
<p><strong>BNPL</strong> cho phép người mua chia đơn hàng thành nhiều kỳ trả góp (thường miễn lãi với kỳ hạn ngắn), được một nhà cung cấp BNPL (không phải ngân hàng của merchant) chấp thuận ngay tại checkout. Merchant thường được nhà cung cấp BNPL trả đủ tiền ngay, sau đó bên này tự thu góp từ người mua và chịu rủi ro tín dụng — đổi một khoản phí lấy tỉ lệ chuyển đổi và giá trị đơn hàng trung bình cao hơn.</p>
<h3>Thanh toán xuyên biên giới</h3>
<p>Một giao dịch e-commerce xuyên biên giới thường vẫn dựa vào <strong>ngân hàng đại lý (correspondent banking)</strong> — một chuỗi ngân hàng chuyển tiếp thanh toán, mỗi bên lấy một khoản phí và biên lợi nhuận trên <strong>quy đổi ngoại tệ (FX)</strong> — đây là lý do chuyển khoản quốc tế vẫn chậm và đắt hơn trong nước (Chương 5). Các hạ tầng mới hơn (liên kết thanh toán tức thời khu vực, bù trừ bằng stablecoin) đang bắt đầu rút ngắn chuỗi đó.</p>
<pre><code>Xuyên biên giới truyền thống: Ngân hàng người mua -> Ngân hàng đại lý -> Ngân hàng người bán
                              (nhiều phí + chênh lệch FX + 1-3+ ngày)
Hạ tầng mới nổi:              Liên kết hệ thống thanh toán tức thời giữa các nước
                              Bù trừ bằng stablecoin giữa doanh nghiệp
</code></pre>
<h3>Xu hướng quy định fintech</h3>
<p>Cơ quan quản lý trên thế giới đang siết chặt quy định với các nhà cung cấp thanh toán phi ngân hàng khi họ tăng trưởng — yêu cầu cấp phép, bảo vệ tiền của khách hàng, bắt buộc Xác thực khách hàng mạnh (nuôi lại việc áp dụng 3DS, Chương 7), và quy định mở dữ liệu làm nền cho Open Banking (Chương 5). Chiến lược thanh toán e-commerce phải theo sát mục tiêu đang di chuyển này, không chỉ theo công nghệ.</p>
<div class="callout"><span class="badge">Bức tranh lớn</span> Mọi xu hướng trong chương này thực chất là cùng một câu chuyện với phần còn lại của môn học, ở một lớp khác: trung gian mới (nhà cung cấp BNPL), hạ tầng mới rút ngắn chuỗi cũ (xuyên biên giới), và quy định đang chạy theo cả hai.</div>`,
  ]]);

const c8q = quiz('pse301-quiz-8', 'Quiz 8 — Trends|||Quiz 8 — Xu hướng', [
  { id: 'q1', question: 'Trong mô hình BNPL, ai chịu rủi ro tín dụng nếu người mua không trả góp đúng hạn?', options: ['Merchant', 'Ngân hàng phát hành thẻ', 'Nhà cung cấp BNPL', 'Card scheme'], correctIndex: 2, explanation: 'BNPL trả đủ cho merchant ngay, rồi tự thu góp và chịu rủi ro tín dụng từ người mua.' },
  { id: 'q2', question: 'Vì sao thanh toán xuyên biên giới truyền thống thường chậm và đắt hơn trong nước?', options: ['Vì luôn dùng tiền mặt', 'Vì đi qua chuỗi ngân hàng đại lý, mỗi bên lấy phí và biên FX', 'Vì không dùng máy tính', 'Vì luật cấm chuyển khoản quốc tế'], correctIndex: 1, explanation: 'Correspondent banking cộng phí và chênh lệch FX ở mỗi chặng, khác với bù trừ trong nước tức thời.' },
  { id: 'q3', question: 'Xu hướng quy định fintech đang tập trung vào điều gì với nhà cung cấp thanh toán phi ngân hàng?', options: ['Bỏ hoàn toàn quy định để khuyến khích tăng trưởng', 'Yêu cầu cấp phép, bảo vệ tiền khách hàng, xác thực khách hàng mạnh', 'Chỉ áp dụng cho ngân hàng truyền thống', 'Cấm hoàn toàn các nhà cung cấp mới'], correctIndex: 1, explanation: 'Quy định đang siết chặt để bảo vệ người dùng khi các nhà cung cấp phi ngân hàng tăng trưởng nhanh, không phải cấm hay bỏ hoàn toàn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PSE301',
    slug: 'pse301-payment-systems-in-e-commerce',
    title: 'Payment Systems in E-Commerce',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PSE301.webp',
    shortDescription: 'How e-commerce payments work — card flows, gateways & PSPs, e-wallets & QR (VietQR, Momo, ZaloPay), bank transfer & Open Banking, crypto/blockchain, PCI DSS/3-D Secure/AML, and trends like BNPL & cross-border payments.|||Thanh toán thương mại điện tử hoạt động thế nào — luồng thẻ, gateway & PSP, ví điện tử & QR (VietQR, Momo, ZaloPay), chuyển khoản & Open Banking, crypto/blockchain, bảo mật PCI DSS/3-D Secure/AML, xu hướng BNPL & xuyên biên giới.',
    description: 'Môn <strong>PSE301 — Payment Systems in E-Commerce</strong> (kỳ 4, khối Quản trị Kinh doanh) giúp hiểu <strong>hệ thống thanh toán thương mại điện tử hoạt động thế nào</strong>. Từ <strong>tổng quan</strong> (các bên tham gia, vòng đời giao dịch) → <strong>luồng thẻ</strong> (issuer/acquirer/card scheme, cấp phép→clearing→settlement) → <strong>cổng thanh toán &amp; PSP</strong> (gateway vs processor vs PSP, tokenization) → <strong>ví điện tử &amp; QR di động</strong> (VietQR, Momo, ZaloPay, NFC) → <strong>chuyển khoản, ngân hàng số &amp; Open Banking</strong> → <strong>tiền mã hoá &amp; blockchain</strong> (stablecoin, CBDC) → <strong>bảo mật, gian lận &amp; tuân thủ</strong> (PCI DSS, 3-D Secure, AML/KYC) → <strong>xu hướng</strong> (BNPL, thanh toán xuyên biên giới, quy định fintech). Bám tinh thần giáo trình Laudon &amp; Traver và Benson, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Các bên & vòng đời thanh toán e-commerce; mô hình bốn/năm bên của thẻ, cấp phép/clearing/settlement, chargeback; payment gateway vs processor vs PSP, hosted checkout vs API, tokenization; ví điện tử & QR (VietQR/NAPAS 247, QR tĩnh/động, NFC); chuyển khoản trong nước/quốc tế, ngân hàng số, Open Banking (AIS/PIS); blockchain, crypto, stablecoin, CBDC; PCI DSS, 3-D Secure, AML/KYC, phát hiện gian lận; BNPL, thanh toán xuyên biên giới, xu hướng quy định fintech.',
    requirements: 'Kiến thức nhập môn kinh doanh/e-commerce cơ bản (không yêu cầu lập trình). Nên đọc trước chương payment systems trong Laudon & Traver "E-commerce: Business, Technology, Society" nếu có sẵn.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, tài liệu chính thức PCI DSS/Visa/Mastercard, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vai trò của hệ thống thanh toán trong e-commerce, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan hệ thống thanh toán|||Chapter 1 — Overview', description: 'Các bên tham gia, push/pull, vòng đời giao dịch.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thẻ & luồng thanh toán thẻ|||Chapter 2 — Card flow', description: 'Issuer/acquirer/scheme, cấp phép→clearing→settlement.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cổng thanh toán & PSP|||Chapter 3 — Gateway & PSP', description: 'Gateway vs processor vs PSP, tokenization.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ví điện tử, QR & di động|||Chapter 4 — Wallets, QR & mobile', description: 'VietQR, Momo, ZaloPay, NFC.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chuyển khoản, ngân hàng số & Open Banking|||Chapter 5 — Transfer & Open Banking', description: 'NAPAS, SWIFT, ngân hàng số, AIS/PIS.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tiền mã hoá & blockchain|||Chapter 6 — Crypto & blockchain', description: 'Blockchain, crypto, stablecoin, CBDC.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bảo mật, gian lận & tuân thủ|||Chapter 7 — Security & compliance', description: 'PCI DSS, 3-D Secure, AML/KYC.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xu hướng: BNPL, xuyên biên giới, fintech|||Chapter 8 — Trends', description: 'BNPL, thanh toán xuyên biên giới, quy định fintech.', lessons: [c8, c8q] },
  ],
};
