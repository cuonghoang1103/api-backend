/**
 * FTP301 — Payments, Cryptocurrencies and Blockchain. Khối Quản trị Kinh doanh,
 * Kỳ 5. Đã có BDF201 (Blockchain & DeFi — cơ chế kỹ thuật blockchain/Bitcoin/
 * Ethereum/DeFi/token) và EPT301 (E-payment — hệ sinh thái thẻ/gateway/ví điện
 * tử/NAPAS 24/7/an ninh thanh toán). Môn NÀY đứng ở góc KINH DOANH & HẠ TẦNG
 * HỆ THỐNG: lịch sử & mô hình kinh doanh của hệ thống thanh toán, hạ tầng
 * quyết toán liên ngân hàng (RTGS/ACH), sổ cái phân tán trong bối cảnh doanh
 * nghiệp/liên ngân hàng, Bitcoin như một MẠNG THANH TOÁN (không đi sâu đào
 * coin), stablecoin như CÔNG CỤ QUẢN TRỊ DÒNG TIỀN doanh nghiệp, crypto trong
 * thanh toán xuyên biên giới nhìn từ CFO, CBDC chuyên sâu, và rủi ro hệ thống
 * + khung pháp lý. Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ftp301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Sách nền tảng (Mastering Bitcoin, The Book of Payments), báo cáo BIS/IMF về CBDC, tài liệu chính thức, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">FTP301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This course sits at the <strong>business &amp; infrastructure</strong> layer of payments — how payment systems evolved, how settlement infrastructure and central bank digital currencies work, and how crypto/stablecoins fit into corporate payment strategy. For the <strong>technical mechanics</strong> of blockchain, Bitcoin, Ethereum, smart contracts, tokens and DeFi, see <strong>BDF201</strong>. For the <strong>consumer-facing</strong> mechanics of cards, gateways, e-wallets, NAPAS 24/7 and PCI-DSS, see <strong>EPT301</strong>.</p>
<h3>📘 Core references (cite only — do not upload PDFs)</h3>
<ul>
<li><a href="https://github.com/bitcoinbook/bitcoinbook" target="_blank" rel="noopener">Andreas M. Antonopoulos — <em>Mastering Bitcoin</em></a> (free, O'Reilly) — the reference for how Bitcoin actually works under the hood.</li>
<li><a href="https://link.springer.com/book/10.1057/9781137602311" target="_blank" rel="noopener">Bátiz-Lazo &amp; Efthymiou (eds.) — <em>The Book of Payments: Historical and Contemporary Views on the Cashless Society</em></a> (Palgrave Macmillan) — the history and business of payment systems.</li>
<li><a href="https://www.bis.org/publ/othp33.htm" target="_blank" rel="noopener">BIS — <em>Central bank digital currencies: foundational principles and core features</em></a></li>
<li><a href="https://www.imf.org/en/Topics/fintech/central-bank-digital-currency" target="_blank" rel="noopener">IMF — Central Bank Digital Currency hub</a></li>
<li><a href="https://www.bis.org/cpmi/publ/d101a.pdf" target="_blank" rel="noopener">CPMI-IOSCO — <em>Principles for Financial Market Infrastructures (PFMI)</em></a> — the global rulebook for payment/settlement system safety.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.bis.org/cpmi/index.htm" target="_blank" rel="noopener">BIS Committee on Payments and Market Infrastructures (CPMI)</a></li>
<li><a href="https://napas.com.vn" target="_blank" rel="noopener">NAPAS — National Payment Corporation of Vietnam</a></li>
<li><a href="https://sbv.gov.vn" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV)</a> — legal stance on cryptocurrency in Vietnam</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@aantonop" target="_blank" rel="noopener">aantonop (Andreas Antonopoulos)</a> — Bitcoin &amp; payments, technically grounded</li>
<li><a href="https://www.youtube.com/@BIS_org" target="_blank" rel="noopener">Bank for International Settlements</a> — CBDC &amp; payment infrastructure talks</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://mempool.space/" target="_blank" rel="noopener">mempool.space</a> — live Bitcoin block explorer &amp; fee market</li>
<li><a href="https://napas.com.vn/vi/gioi-thieu-napas" target="_blank" rel="noopener">NAPAS interoperability overview</a> — Vietnam's national payment switch</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — how payment systems evolved, the four-party model, RTGS vs ACH settlement.</li>
<li><strong>Infrastructure</strong> — distributed ledgers for interbank settlement, Bitcoin as a payment network, stablecoins as a corporate treasury instrument.</li>
<li><strong>Applied</strong> — crypto payments &amp; cross-border transfers from a CFO's cost/time lens.</li>
<li><strong>Policy</strong> — CBDC design choices, systemic risk and the regulatory frameworks payment businesses must comply with.</li>
</ol></div>`,
    `<span class="eyebrow">FTP301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Môn này đứng ở lớp <strong>kinh doanh &amp; hạ tầng</strong> của thanh toán — hệ thống thanh toán tiến hoá ra sao, hạ tầng quyết toán và tiền kỹ thuật số ngân hàng trung ương vận hành thế nào, và crypto/stablecoin nằm ở đâu trong chiến lược thanh toán doanh nghiệp. Về <strong>cơ chế kỹ thuật</strong> blockchain, Bitcoin, Ethereum, smart contract, token và DeFi, xem <strong>BDF201</strong>. Về cơ chế <strong>hướng người dùng</strong> của thẻ, gateway, ví điện tử, NAPAS 24/7 và PCI-DSS, xem <strong>EPT301</strong>.</p>
<h3>📘 Tài liệu gốc (chỉ trích dẫn, KHÔNG upload PDF)</h3>
<ul>
<li><a href="https://github.com/bitcoinbook/bitcoinbook" target="_blank" rel="noopener">Andreas M. Antonopoulos — <em>Mastering Bitcoin</em></a> (miễn phí, O'Reilly) — tài liệu chuẩn về cách Bitcoin thật sự vận hành.</li>
<li><a href="https://link.springer.com/book/10.1057/9781137602311" target="_blank" rel="noopener">Bátiz-Lazo &amp; Efthymiou (chủ biên) — <em>The Book of Payments: Historical and Contemporary Views on the Cashless Society</em></a> (Palgrave Macmillan) — lịch sử và kinh doanh của hệ thống thanh toán.</li>
<li><a href="https://www.bis.org/publ/othp33.htm" target="_blank" rel="noopener">BIS — <em>Central bank digital currencies: foundational principles and core features</em></a></li>
<li><a href="https://www.imf.org/en/Topics/fintech/central-bank-digital-currency" target="_blank" rel="noopener">IMF — Trung tâm CBDC</a></li>
<li><a href="https://www.bis.org/cpmi/publ/d101a.pdf" target="_blank" rel="noopener">CPMI-IOSCO — <em>Principles for Financial Market Infrastructures (PFMI)</em></a> — bộ nguyên tắc toàn cầu về an toàn hạ tầng thanh toán/quyết toán.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.bis.org/cpmi/index.htm" target="_blank" rel="noopener">BIS — Uỷ ban Thanh toán &amp; Hạ tầng Thị trường (CPMI)</a></li>
<li><a href="https://napas.com.vn" target="_blank" rel="noopener">NAPAS — Công ty CP Thanh toán Quốc gia Việt Nam</a></li>
<li><a href="https://sbv.gov.vn" target="_blank" rel="noopener">Ngân hàng Nhà nước Việt Nam (SBV)</a> — quan điểm pháp lý về tiền mã hoá tại Việt Nam</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@aantonop" target="_blank" rel="noopener">aantonop (Andreas Antonopoulos)</a> — Bitcoin &amp; thanh toán, nền tảng kỹ thuật vững</li>
<li><a href="https://www.youtube.com/@BIS_org" target="_blank" rel="noopener">Bank for International Settlements</a> — chia sẻ về CBDC &amp; hạ tầng thanh toán</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://mempool.space/" target="_blank" rel="noopener">mempool.space</a> — block explorer Bitcoin trực tiếp &amp; thị trường phí</li>
<li><a href="https://napas.com.vn/vi/gioi-thieu-napas" target="_blank" rel="noopener">Giới thiệu NAPAS</a> — hệ thống chuyển mạch quốc gia của Việt Nam</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — hệ thống thanh toán tiến hoá thế nào, mô hình bốn bên, quyết toán RTGS so với ACH.</li>
<li><strong>Hạ tầng</strong> — sổ cái phân tán trong quyết toán liên ngân hàng, Bitcoin như mạng thanh toán, stablecoin như công cụ quản trị dòng tiền.</li>
<li><strong>Ứng dụng</strong> — thanh toán crypto &amp; chuyển tiền xuyên biên giới nhìn từ góc CFO (chi phí/thời gian).</li>
<li><strong>Chính sách</strong> — lựa chọn thiết kế CBDC, rủi ro hệ thống và khung pháp lý doanh nghiệp thanh toán phải tuân thủ.</li>
</ol></div>`,
  ]]);

const intro = doc('ftp301-0-1-overview', 'Course overview: Payments, Cryptocurrencies and Blockchain|||Tổng quan môn: Thanh toán, Tiền mã hoá và Blockchain',
  'Vì sao môn này khác BDF201/EPT301: góc nhìn kinh doanh & hạ tầng hệ thống thanh toán; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">FTP301 · Lesson 0.1 · Overview</span>
<h2>Payments, Cryptocurrencies and Blockchain</h2>
<p class="lead">Money moves through <strong>systems</strong> — card networks, interbank settlement rails, and now blockchain-based networks. This course studies those systems from a <strong>business and infrastructure</strong> viewpoint: who operates them, how they settle, what they cost, and what risk they carry — rather than how to code a smart contract or swipe a card.</p>
<h3>How this differs from BDF201 and EPT301</h3>
<ul>
<li><strong>BDF201</strong> teaches blockchain/Bitcoin/Ethereum mechanics, token standards and DeFi protocols in depth. Here, Bitcoin and distributed ledgers appear only as <em>payment infrastructure</em> — we ask "does this work as a payment rail?", not "how does mining work?".</li>
<li><strong>EPT301</strong> teaches the consumer-facing plumbing of card authorization, e-wallets, NAPAS 24/7 and PCI-DSS security. Here, we zoom out to <em>interbank settlement systems</em> (RTGS/ACH), <em>central bank digital currencies</em>, and the <em>corporate</em> use of crypto/stablecoins for treasury and cross-border payments.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<p>Evolution of payment systems &amp; business models → interbank settlement infrastructure (card networks, RTGS, ACH, NAPAS) → distributed ledgers for institutional settlement → Bitcoin as a payment network &amp; consensus → stablecoins &amp; tokens as payment/treasury instruments → crypto payments &amp; cross-border transfers (a CFO's view) → central bank digital currencies (CBDC) → systemic risk, regulation &amp; compliance.</p>
<div class="callout"><span class="badge">Not investment advice</span> This course explains how payment systems, cryptocurrencies and CBDCs work and the risks they carry. Nothing here is a recommendation to buy, hold or trade any asset.</div>`,
    `<span class="eyebrow">FTP301 · Bài 0.1 · Tổng quan</span>
<h2>Thanh toán, Tiền mã hoá và Blockchain</h2>
<p class="lead">Tiền di chuyển qua các <strong>hệ thống</strong> — mạng lưới thẻ, hạ tầng quyết toán liên ngân hàng, và giờ là mạng dựa trên blockchain. Môn này nghiên cứu các hệ thống đó từ góc <strong>kinh doanh và hạ tầng</strong>: ai vận hành, quyết toán ra sao, tốn chi phí gì, và mang rủi ro gì — chứ không phải cách viết smart contract hay quẹt thẻ.</p>
<h3>Khác BDF201 và EPT301 ở đâu</h3>
<ul>
<li><strong>BDF201</strong> dạy cơ chế blockchain/Bitcoin/Ethereum, chuẩn token và giao thức DeFi chuyên sâu. Ở đây, Bitcoin và sổ cái phân tán chỉ xuất hiện như <em>hạ tầng thanh toán</em> — ta hỏi "cái này có dùng làm kênh thanh toán được không?", không hỏi "đào coin thế nào?".</li>
<li><strong>EPT301</strong> dạy hạ tầng hướng người dùng của xác thực thẻ, ví điện tử, NAPAS 24/7 và an ninh PCI-DSS. Ở đây, ta nhìn rộng ra <em>hệ thống quyết toán liên ngân hàng</em> (RTGS/ACH), <em>tiền kỹ thuật số ngân hàng trung ương</em>, và việc <em>doanh nghiệp</em> dùng crypto/stablecoin cho quản trị dòng tiền và thanh toán xuyên biên giới.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<p>Tiến hoá hệ thống thanh toán &amp; mô hình kinh doanh → hạ tầng quyết toán liên ngân hàng (card network, RTGS, ACH, NAPAS) → sổ cái phân tán cho quyết toán tổ chức → Bitcoin như mạng thanh toán &amp; đồng thuận → stablecoin &amp; token như công cụ thanh toán/quản trị dòng tiền → thanh toán crypto &amp; chuyển tiền xuyên biên giới (góc nhìn CFO) → tiền kỹ thuật số ngân hàng trung ương (CBDC) → rủi ro hệ thống, quy định &amp; tuân thủ.</p>
<div class="callout"><span class="badge">Không khuyến nghị đầu tư</span> Môn này giải thích hệ thống thanh toán, tiền mã hoá và CBDC vận hành thế nào cùng rủi ro của chúng. Không có nội dung nào ở đây là khuyến nghị mua, giữ hay giao dịch bất kỳ tài sản nào.</div>`,
  ]]);

const c1 = doc('ftp301-1-1-evolution', '1.1 — Evolution of payment systems & business models|||1.1 — Tiến hoá hệ thống thanh toán & mô hình kinh doanh',
  'Từ tiền mặt → séc → thẻ → chuyển khoản điện tử → ví điện tử/thời gian thực; mô hình bốn bên (issuer/acquirer/network/merchant); ai kiếm tiền ở đâu trong chuỗi.',
  [[
    `<span class="eyebrow">FTP301 · Chapter 1 · Lesson 1.1</span>
<h2>Evolution of payment systems &amp; business models</h2>
<h3>A short history</h3>
<p>Payments evolved in waves: <strong>cash</strong> (physical, peer-to-peer, no intermediary) → <strong>checks</strong> (paper instruction to a bank, cleared in batches) → <strong>cards</strong> (electronic authorization at point of sale, four-party model) → <strong>electronic funds transfer / ACH</strong> (bank-to-bank, batched) → <strong>e-wallets &amp; real-time payments</strong> (instant, mobile-first, QR-based). Each wave didn't fully replace the last — cash, checks and cards still coexist with instant transfers today.</p>
<h3>The four-party model — who gets paid</h3>
<pre><code>Cardholder --pays--> Merchant
    |                    |
 Issuer (cardholder's  Acquirer (merchant's
 bank; earns interchange)  bank; earns markup)
    \\__________ Card Network __________/
        (Visa/Mastercard; earns
         network/assessment fee)
</code></pre>
<p>Every party in that chain takes a small cut of every transaction — this fee structure (<strong>interchange, network fee, acquirer markup</strong>) is the core business model of the card industry, and it's why merchants push customers toward cheaper rails (bank transfer, QR) when volume is high.</p>
<h3>Vietnam's shift</h3>
<p>Vietnam largely skipped a long "check era" and jumped from cash to a mobile-first mix of cards, e-wallets (Momo, ZaloPay) and bank-QR, coordinated through the national switch <strong>NAPAS</strong> (Chapter 2).</p>
<div class="callout"><span class="badge">Business lens</span> A payment system's design determines who bears cost, who bears risk, and who gets the data — that's the lens this course uses throughout.</div>`,
    `<span class="eyebrow">FTP301 · Chương 1 · Bài 1.1</span>
<h2>Tiến hoá hệ thống thanh toán &amp; mô hình kinh doanh</h2>
<h3>Lược sử ngắn</h3>
<p>Thanh toán tiến hoá theo từng đợt: <strong>tiền mặt</strong> (vật lý, ngang hàng, không trung gian) → <strong>séc</strong> (chỉ thị giấy cho ngân hàng, xử lý theo lô) → <strong>thẻ</strong> (xác thực điện tử tại điểm bán, mô hình bốn bên) → <strong>chuyển khoản điện tử / ACH</strong> (ngân hàng-ngân hàng, theo lô) → <strong>ví điện tử &amp; thanh toán thời gian thực</strong> (tức thời, ưu tiên di động, dựa trên QR). Mỗi đợt không thay thế hoàn toàn đợt trước — tiền mặt, séc và thẻ vẫn cùng tồn tại với chuyển khoản tức thời ngày nay.</p>
<h3>Mô hình bốn bên — ai được trả</h3>
<pre><code>Chủ thẻ --thanh toán--> Người bán
    |                        |
Ngân hàng phát hành      Ngân hàng thanh toán
(issuer; hưởng phí       (acquirer; hưởng phí
 interchange)             chiết khấu)
    \\_______ Mạng lưới thẻ (Visa/MC) ________/
           (hưởng phí mạng lưới/assessment)
</code></pre>
<p>Mỗi bên trong chuỗi này ăn một phần nhỏ của mỗi giao dịch — cấu trúc phí này (<strong>interchange, phí mạng lưới, chiết khấu acquirer</strong>) là mô hình kinh doanh cốt lõi của ngành thẻ, và là lý do người bán đẩy khách sang kênh rẻ hơn (chuyển khoản, QR) khi khối lượng lớn.</p>
<h3>Sự chuyển dịch của Việt Nam</h3>
<p>Việt Nam gần như bỏ qua "thời kỳ séc" kéo dài và nhảy thẳng từ tiền mặt sang tổ hợp ưu tiên di động gồm thẻ, ví điện tử (Momo, ZaloPay) và QR ngân hàng, phối hợp qua chuyển mạch quốc gia <strong>NAPAS</strong> (Chương 2).</p>
<div class="callout"><span class="badge">Góc nhìn kinh doanh</span> Thiết kế của một hệ thống thanh toán quyết định ai gánh chi phí, ai gánh rủi ro, và ai nắm dữ liệu — đây là lăng kính môn học dùng xuyên suốt.</div>`,
  ]]);

const c1q = quiz('ftp301-quiz-1', 'Quiz 1 — Payment evolution|||Quiz 1 — Tiến hoá thanh toán', [
  { id: 'q1', question: 'Trong mô hình bốn bên của thẻ, ai hưởng phí interchange?', options: ['Người bán', 'Ngân hàng phát hành (issuer)', 'Ngân hàng thanh toán (acquirer)', 'Người mua'], correctIndex: 1, explanation: 'Interchange là phí ngân hàng phát hành (issuer) hưởng từ mỗi giao dịch thẻ.' },
  { id: 'q2', question: 'Vì sao nói Việt Nam "bỏ qua thời kỳ séc"?', options: ['Séc bị cấm theo luật', 'Việt Nam chuyển thẳng từ tiền mặt sang thanh toán di động/QR', 'Séc vẫn phổ biến nhất hiện nay', 'NAPAS không hỗ trợ séc nên bỏ luôn'], correctIndex: 1, explanation: 'Việt Nam nhảy thẳng từ tiền mặt sang tổ hợp thẻ/ví điện tử/QR, không trải qua giai đoạn séc kéo dài như nhiều nước.' },
  { id: 'q3', question: 'Thiết kế hệ thống thanh toán quan trọng với doanh nghiệp vì?', options: ['Không ảnh hưởng gì tới chi phí', 'Quyết định ai gánh chi phí, rủi ro và nắm dữ liệu giao dịch', 'Chỉ ảnh hưởng tới ngân hàng trung ương', 'Chỉ liên quan tới người tiêu dùng cá nhân'], correctIndex: 1, explanation: 'Cấu trúc phí và luồng dữ liệu của hệ thống thanh toán tác động trực tiếp tới mô hình kinh doanh của doanh nghiệp.' },
]);

const c2 = doc('ftp301-2-1-infrastructure', '2.1 — Settlement infrastructure: card networks, RTGS, ACH, NAPAS|||2.1 — Hạ tầng quyết toán: mạng lưới thẻ, RTGS, ACH, NAPAS',
  'Authorization/clearing/settlement của mạng lưới thẻ; RTGS (quyết toán tổng tức thời) so với ACH (bù trừ ròng theo lô); NAPAS là chuyển mạch quốc gia kết nối các hệ thống đó.',
  [[
    `<span class="eyebrow">FTP301 · Chapter 2 · Lesson 2.1</span>
<h2>Settlement infrastructure: card networks, RTGS, ACH, NAPAS</h2>
<h3>Card networks: three separate moments</h3>
<p><strong>Authorization</strong> (real-time — "can this transaction go through?") happens in seconds at checkout. <strong>Clearing</strong> (batching transactions between banks) and <strong>settlement</strong> (the actual movement of funds between banks) usually happen hours to a day later. The customer sees only authorization; the money moves afterward.</p>
<h3>RTGS vs. ACH — the two settlement models behind every bank transfer</h3>
<pre><code>RTGS (Real-Time Gross Settlement)      ACH (Automated Clearing House)
- Settles EACH transaction alone,      - BATCHES many transactions,
  immediately, one by one                nets them, settles periodically
- No credit risk between settlements   - Settlement risk exists until
  (final the instant it clears)          the batch settles
- High value, time-critical             - High volume, low value,
  (interbank, large corporate)           low urgency (payroll, bills)
- Central-bank operated (e.g. Vietnam's - Operated via clearing houses
  Interbank Electronic Payment System)    or card/ewallet networks
</code></pre>
<h3>NAPAS — the switch that ties it together</h3>
<p><strong>NAPAS</strong> (National Payment Corporation of Vietnam) is the interbank switch: it routes ATM/card transactions between banks, and — since it operates Vietnam's real-time retail rail (used for VietQR/bank transfers) — lets any bank's customer pay any other bank's customer in seconds, 24/7. It is <em>interoperability</em> infrastructure, not a bank itself: banks still settle with each other through the central bank's RTGS in the background.</p>
<div class="callout"><span class="badge">Systemic view</span> The BIS classifies systems like RTGS as <strong>Systemically Important Payment Systems (SIPS)</strong> — if one fails, the whole economy's payments can seize up, which is why central banks regulate and often operate them directly.</div>`,
    `<span class="eyebrow">FTP301 · Chương 2 · Bài 2.1</span>
<h2>Hạ tầng quyết toán: mạng lưới thẻ, RTGS, ACH, NAPAS</h2>
<h3>Mạng lưới thẻ: ba khoảnh khắc tách biệt</h3>
<p><strong>Authorization</strong> (thời gian thực — "giao dịch này có được duyệt không?") diễn ra trong vài giây tại điểm thanh toán. <strong>Clearing</strong> (gộp giao dịch theo lô giữa các ngân hàng) và <strong>settlement</strong> (dòng tiền thật sự di chuyển giữa các ngân hàng) thường diễn ra vài giờ tới một ngày sau. Khách hàng chỉ thấy authorization; tiền di chuyển sau đó.</p>
<h3>RTGS so với ACH — hai mô hình quyết toán đằng sau mọi lệnh chuyển khoản</h3>
<pre><code>RTGS (Quyết toán tổng tức thời)        ACH (Bù trừ tự động theo lô)
- Quyết toán TỪNG giao dịch riêng lẻ,  - GỘP nhiều giao dịch,
  ngay lập tức, từng cái một             bù trừ ròng, quyết toán định kỳ
- Không rủi ro tín dụng giữa các lần   - Tồn tại rủi ro quyết toán
  quyết toán (chốt ngay khi xử lý)       cho tới khi lô được quyết toán
- Giá trị lớn, tính khẩn cấp cao        - Khối lượng lớn, giá trị nhỏ,
  (liên ngân hàng, doanh nghiệp lớn)     ít khẩn cấp (lương, hoá đơn)
- Ngân hàng trung ương vận hành (vd     - Vận hành qua trung tâm bù trừ
  Hệ thống Thanh toán Điện tử Liên        hoặc mạng lưới thẻ/ví điện tử
  ngân hàng của Việt Nam)
</code></pre>
<h3>NAPAS — chuyển mạch kết nối tất cả</h3>
<p><strong>NAPAS</strong> (Công ty CP Thanh toán Quốc gia Việt Nam) là chuyển mạch liên ngân hàng: định tuyến giao dịch ATM/thẻ giữa các ngân hàng, và — vì vận hành kênh bán lẻ thời gian thực của Việt Nam (dùng cho VietQR/chuyển khoản) — cho phép khách hàng của một ngân hàng trả tiền cho khách hàng ngân hàng khác trong vài giây, 24/7. Đây là hạ tầng <em>liên thông (interoperability)</em>, không phải bản thân một ngân hàng: các ngân hàng vẫn quyết toán với nhau qua RTGS của ngân hàng trung ương ở phía sau.</p>
<div class="callout"><span class="badge">Góc nhìn hệ thống</span> BIS xếp các hệ thống như RTGS vào nhóm <strong>Hệ thống thanh toán quan trọng hệ thống (SIPS)</strong> — nếu một hệ thống này sập, toàn bộ thanh toán của nền kinh tế có thể tê liệt, đó là lý do ngân hàng trung ương giám sát và thường trực tiếp vận hành chúng.</div>`,
  ]]);

const c2q = quiz('ftp301-quiz-2', 'Quiz 2 — Settlement infrastructure|||Quiz 2 — Hạ tầng quyết toán', [
  { id: 'q1', question: 'Khác biệt chính giữa RTGS và ACH là gì?', options: ['RTGS quyết toán từng giao dịch ngay lập tức, ACH gộp lô và bù trừ ròng định kỳ', 'RTGS chỉ dùng cho thẻ, ACH chỉ dùng cho tiền mặt', 'ACH nhanh hơn RTGS', 'Không có khác biệt, hai tên gọi cho cùng một hệ thống'], correctIndex: 0, explanation: 'RTGS quyết toán tổng, tức thời, từng giao dịch; ACH bù trừ ròng theo lô, quyết toán định kỳ.' },
  { id: 'q2', question: 'NAPAS đóng vai trò gì trong hệ thống thanh toán Việt Nam?', options: ['Một ngân hàng thương mại phát hành thẻ', 'Chuyển mạch liên ngân hàng, kết nối các ngân hàng để thanh toán liên thông', 'Cơ quan in tiền mặt', 'Sàn giao dịch tiền mã hoá'], correctIndex: 1, explanation: 'NAPAS là hạ tầng liên thông/chuyển mạch quốc gia, không tự mình là ngân hàng.' },
  { id: 'q3', question: 'Vì sao BIS xếp RTGS vào nhóm "hệ thống quan trọng hệ thống" (SIPS)?', options: ['Vì nó xử lý lượng giao dịch nhỏ', 'Vì nếu nó sập, thanh toán của cả nền kinh tế có thể tê liệt', 'Vì nó do doanh nghiệp tư nhân vận hành', 'Vì nó chỉ dùng cho thanh toán quốc tế'], correctIndex: 1, explanation: 'RTGS là huyết mạch quyết toán liên ngân hàng — rủi ro hệ thống rất cao nếu gián đoạn.' },
]);

const c3 = doc('ftp301-3-1-dlt-institutional', '3.1 — Distributed ledgers for institutional settlement|||3.1 — Sổ cái phân tán trong quyết toán tổ chức',
  'Vì sao ngân hàng thử nghiệm DLT (JPM Coin, R3 Corda) cho quyết toán/thương mại; permissioned vs permissionless; chi phí đối soát so với sổ cái chung; hạn chế thực tế.',
  [[
    `<span class="eyebrow">FTP301 · Chapter 3 · Lesson 3.1</span>
<h2>Distributed ledgers for institutional settlement</h2>
<p class="lead">BDF201 covers how public blockchains work end to end. Here, the question is narrower and business-shaped: <strong>why would a bank or a payment operator adopt distributed ledger technology (DLT) for settlement at all?</strong></p>
<h3>The reconciliation problem DLT targets</h3>
<p>Today, when Bank A and Bank B both record the "same" trade or payment, they keep <em>separate</em> databases and must periodically <strong>reconcile</strong> them — a slow, costly, error-prone process (this is what clearing houses exist to solve at scale). A <strong>shared, permissioned ledger</strong> replaces "two records that must agree" with "one record both parties can see and cryptographically trust" — in principle collapsing reconciliation to zero.</p>
<h3>Permissioned vs. permissionless — the business trade-off</h3>
<pre><code>Permissionless (public, e.g. Bitcoin) Permissioned (private/consortium)
- Anyone can run a node/validate      - Only vetted institutions
- No one to sue if something breaks     participate; legal recourse exists
- Full transaction history public     - Data visible only to
                                         authorized parties
- Fits: censorship-resistant,         - Fits: interbank settlement,
  open payment rails                    trade finance, securities
</code></pre>
<h3>Real examples and their limits</h3>
<p><strong>JPM Coin</strong> (JPMorgan) settles interbank payments between the bank's own clients on a private ledger. <strong>R3 Corda</strong> is a permissioned DLT platform built specifically for regulated financial institutions. These systems prove the reconciliation savings are real — but they mostly connect participants <em>within</em> one bank's or one consortium's network; they have not replaced the public RTGS/SWIFT backbone that connects the whole financial system.</p>
<div class="callout"><span class="badge">Business takeaway</span> DLT's payment value isn't "no more banks" — it's cutting the cost of keeping multiple institutions' records in sync.</div>`,
    `<span class="eyebrow">FTP301 · Chương 3 · Bài 3.1</span>
<h2>Sổ cái phân tán trong quyết toán tổ chức</h2>
<p class="lead">BDF201 đã trình bày blockchain công khai vận hành thế nào từ đầu tới cuối. Ở đây câu hỏi hẹp hơn và mang tính kinh doanh: <strong>vì sao một ngân hàng hay đơn vị vận hành thanh toán lại muốn dùng công nghệ sổ cái phân tán (DLT) cho quyết toán?</strong></p>
<h3>Bài toán đối soát mà DLT nhắm tới</h3>
<p>Hiện nay, khi Ngân hàng A và Ngân hàng B cùng ghi nhận "cùng một" giao dịch, mỗi bên giữ cơ sở dữ liệu <em>riêng</em> và phải định kỳ <strong>đối soát (reconcile)</strong> — một quy trình chậm, tốn kém, dễ sai sót (đây chính là lý do các trung tâm bù trừ tồn tại ở quy mô lớn). Một <strong>sổ cái chung, có cấp phép</strong> thay "hai bản ghi phải khớp nhau" bằng "một bản ghi cả hai bên cùng thấy và tin cậy bằng mật mã" — về nguyên lý đưa chi phí đối soát về gần bằng không.</p>
<h3>Có cấp phép vs. không cấp phép — sự đánh đổi kinh doanh</h3>
<pre><code>Không cấp phép (công khai, vd Bitcoin) Có cấp phép (riêng/liên minh)
- Ai cũng chạy được node/xác thực     - Chỉ tổ chức đã thẩm định
- Không có ai để kiện nếu có sự cố      tham gia; có cơ chế pháp lý
- Toàn bộ lịch sử giao dịch công khai - Dữ liệu chỉ bên được cấp
                                         quyền mới thấy
- Phù hợp: kênh thanh toán mở,        - Phù hợp: quyết toán liên
  chống kiểm duyệt                      ngân hàng, tài trợ thương mại,
                                         chứng khoán
</code></pre>
<h3>Ví dụ thực tế và giới hạn</h3>
<p><strong>JPM Coin</strong> (JPMorgan) quyết toán thanh toán liên ngân hàng giữa các khách hàng của chính ngân hàng này trên một sổ cái riêng. <strong>R3 Corda</strong> là nền tảng DLT có cấp phép, xây riêng cho các tổ chức tài chính chịu quản lý. Các hệ thống này chứng minh khoản tiết kiệm đối soát là có thật — nhưng phần lớn chỉ kết nối các bên <em>trong</em> mạng lưới của một ngân hàng hoặc một liên minh; chúng chưa thay thế được xương sống RTGS/SWIFT công khai kết nối toàn bộ hệ thống tài chính.</p>
<div class="callout"><span class="badge">Kết luận kinh doanh</span> Giá trị thanh toán của DLT không phải là "không cần ngân hàng nữa" — mà là cắt chi phí giữ đồng bộ bản ghi giữa nhiều tổ chức.</div>`,
  ]]);

const c3q = quiz('ftp301-quiz-3', 'Quiz 3 — DLT for settlement|||Quiz 3 — Sổ cái phân tán cho quyết toán', [
  { id: 'q1', question: 'Vấn đề chính DLT nhắm giải quyết cho quyết toán liên ngân hàng là gì?', options: ['Tăng phí giao dịch', 'Chi phí và rủi ro sai sót của việc đối soát nhiều bản ghi riêng', 'Thay thế hoàn toàn ngân hàng trung ương', 'Giảm bảo mật để tăng tốc độ'], correctIndex: 1, explanation: 'Sổ cái chung, có cấp phép giúp các tổ chức không phải đối soát nhiều bản ghi riêng lẻ.' },
  { id: 'q2', question: 'JPM Coin và R3 Corda là ví dụ của loại sổ cái nào?', options: ['Không cấp phép, công khai như Bitcoin', 'Có cấp phép, dành cho tổ chức tài chính được thẩm định', 'Sổ cái giấy truyền thống', 'Không phải sổ cái phân tán'], correctIndex: 1, explanation: 'Cả hai là nền tảng DLT có cấp phép (permissioned), phục vụ tổ chức tài chính chịu quản lý.' },
  { id: 'q3', question: 'DLT có cấp phép hiện nay chủ yếu kết nối phạm vi nào?', options: ['Toàn bộ hệ thống tài chính toàn cầu, thay thế SWIFT/RTGS', 'Chỉ trong nội bộ một ngân hàng hoặc một liên minh tổ chức', 'Chỉ người dùng cá nhân không qua ngân hàng', 'Không kết nối được ai cả'], correctIndex: 1, explanation: 'DLT có cấp phép hiện chủ yếu vận hành trong phạm vi một ngân hàng/liên minh, chưa thay thế xương sống RTGS/SWIFT.' },
]);

const c4 = doc('ftp301-4-1-bitcoin-payment-network', '4.1 — Bitcoin as a payment network & consensus|||4.1 — Bitcoin như mạng thanh toán & đồng thuận',
  'Bitcoin đánh giá NHƯ MỘT MẠNG THANH TOÁN: finality xác suất, thông lượng/phí, Lightning Network; đồng thuận Proof-of-Work ở mức khái niệm (đào sâu ở BDF201).',
  [[
    `<span class="eyebrow">FTP301 · Chapter 4 · Lesson 4.1</span>
<h2>Bitcoin as a payment network &amp; consensus</h2>
<p class="lead">BDF201 covers mining mechanics, UTXO and halving in depth. Here we ask a payments-business question: <strong>is Bitcoin actually usable as a payment rail, and how does it settle?</strong></p>
<h3>Consensus in one paragraph</h3>
<p>Bitcoin has no central operator; instead, miners compete to add the next block by solving a computational puzzle (<strong>Proof-of-Work</strong>). Whoever solves it first proposes the block; other nodes verify it and extend the chain. This is what lets strangers agree on transaction order <em>without</em> trusting each other or a bank.</p>
<h3>Settlement finality — probabilistic, not instant</h3>
<pre><code>0 confirmations -> transaction broadcast, NOT yet final
1 confirmation  -> in a block, but could still be reorganized
6 confirmations -> ~1 hour; industry convention for "final"
                    (reversing it would cost an attacker enormous
                     computing power)
</code></pre>
<p>Unlike RTGS (final the instant it settles), Bitcoin settlement is <strong>probabilistic</strong> — the more confirmations, the safer, but never mathematically certain. This matters a lot for merchants accepting Bitcoin directly.</p>
<h3>Throughput &amp; the Lightning Network</h3>
<p>The base Bitcoin network processes roughly <strong>7 transactions/second</strong>, against Visa's tens of thousands — Bitcoin was never designed for retail-scale volume on-chain. The <strong>Lightning Network</strong> is a "layer 2" solution: two parties lock funds into a payment channel, transact instantly and near-free off-chain, and settle the net result on-chain only when the channel closes — trading some trust assumptions for speed and low cost.</p>
<div class="callout"><span class="badge">Payments verdict</span> Bitcoin's strength as a payment rail is censorship-resistant, permissionless value transfer — not speed or low cost at the base layer. Businesses that accept it directly usually route through a payment processor (Chapter 6) rather than waiting on confirmations themselves.</div>`,
    `<span class="eyebrow">FTP301 · Chương 4 · Bài 4.1</span>
<h2>Bitcoin như mạng thanh toán &amp; đồng thuận</h2>
<p class="lead">BDF201 đã trình bày cơ chế đào, UTXO và halving chuyên sâu. Ở đây ta hỏi câu hỏi kinh doanh thanh toán: <strong>Bitcoin có thật sự dùng được như một kênh thanh toán không, và nó quyết toán thế nào?</strong></p>
<h3>Đồng thuận trong một đoạn</h3>
<p>Bitcoin không có bên vận hành trung tâm; thay vào đó, thợ đào cạnh tranh để thêm khối tiếp theo bằng cách giải một bài toán tính toán (<strong>Proof-of-Work</strong>). Ai giải xong trước sẽ đề xuất khối; các node khác xác minh và nối dài chuỗi. Đây là cách người lạ đồng thuận được thứ tự giao dịch mà <em>không</em> cần tin nhau hay tin một ngân hàng.</p>
<h3>Tính chung cuộc quyết toán — xác suất, không tức thời</h3>
<pre><code>0 xác nhận  -> giao dịch đã phát, CHƯA chung cuộc
1 xác nhận  -> đã vào một khối, nhưng vẫn có thể bị tổ chức lại
6 xác nhận  -> ~1 giờ; quy ước ngành xem là "chung cuộc"
               (đảo ngược đòi hỏi kẻ tấn công một lượng
                năng lực tính toán khổng lồ)
</code></pre>
<p>Khác với RTGS (chung cuộc ngay khi quyết toán), quyết toán Bitcoin mang tính <strong>xác suất</strong> — càng nhiều xác nhận càng an toàn, nhưng không bao giờ chắc chắn tuyệt đối về mặt toán học. Điều này rất quan trọng với người bán chấp nhận Bitcoin trực tiếp.</p>
<h3>Thông lượng &amp; Lightning Network</h3>
<p>Mạng Bitcoin gốc xử lý khoảng <strong>7 giao dịch/giây</strong>, so với hàng chục nghìn của Visa — Bitcoin chưa từng được thiết kế cho khối lượng bán lẻ trên chuỗi. <strong>Lightning Network</strong> là giải pháp "lớp 2": hai bên khoá tiền vào một kênh thanh toán, giao dịch tức thời gần như miễn phí ngoài chuỗi, và chỉ quyết toán kết quả ròng lên chuỗi khi kênh đóng — đánh đổi một phần giả định tin cậy để lấy tốc độ và chi phí thấp.</p>
<div class="callout"><span class="badge">Kết luận thanh toán</span> Thế mạnh của Bitcoin như kênh thanh toán là chuyển giá trị không kiểm duyệt, không cần cấp phép — không phải tốc độ hay chi phí thấp ở lớp gốc. Doanh nghiệp chấp nhận trực tiếp thường đi qua bộ xử lý thanh toán (Chương 6) thay vì tự chờ xác nhận.</div>`,
  ]]);

const c4q = quiz('ftp301-quiz-4', 'Quiz 4 — Bitcoin as payment network|||Quiz 4 — Bitcoin như mạng thanh toán', [
  { id: 'q1', question: 'Quy ước ngành xem giao dịch Bitcoin là "chung cuộc" sau bao nhiêu xác nhận?', options: ['0 xác nhận', '1 xác nhận', '6 xác nhận', '100 xác nhận'], correctIndex: 2, explanation: '6 xác nhận (~1 giờ) là quy ước ngành cho tính chung cuộc thực tế.' },
  { id: 'q2', question: 'Lightning Network giải quyết vấn đề gì của Bitcoin?', options: ['Tăng bảo mật Proof-of-Work', 'Thông lượng thấp trên chuỗi gốc, bằng cách giao dịch ngoài chuỗi qua kênh thanh toán', 'Thay thế hoàn toàn thợ đào', 'Giảm tổng cung Bitcoin'], correctIndex: 1, explanation: 'Lightning là lớp 2, xử lý giao dịch ngoài chuỗi rồi chỉ quyết toán ròng lên chuỗi khi đóng kênh.' },
  { id: 'q3', question: 'So với RTGS, quyết toán Bitcoin khác biệt cơ bản ở điểm nào?', options: ['Bitcoin chung cuộc tức thời như RTGS', 'Bitcoin mang tính xác suất, càng nhiều xác nhận càng an toàn nhưng không chắc chắn tuyệt đối', 'RTGS cũng mang tính xác suất', 'Không có khác biệt nào'], correctIndex: 1, explanation: 'RTGS chung cuộc ngay lập tức; Bitcoin chỉ đạt độ an toàn cao dần theo số xác nhận, không bao giờ tuyệt đối.' },
]);

const c5 = doc('ftp301-5-1-stablecoins-tokens-payments', '5.1 — Stablecoins & tokens as payment/treasury instruments|||5.1 — Stablecoin & token như công cụ thanh toán/quản trị dòng tiền',
  'Stablecoin nhìn từ góc TÀI CHÍNH DOANH NGHIỆP: dùng để quản trị dòng tiền/quyết toán B2B; cấu trúc thị trường (Tether, Circle); rủi ro dự trữ & "bank run".',
  [[
    `<span class="eyebrow">FTP301 · Chapter 5 · Lesson 5.1</span>
<h2>Stablecoins &amp; tokens as payment/treasury instruments</h2>
<p class="lead">BDF201 classifies stablecoins technically (fiat-collateralized, crypto-collateralized, algorithmic) and covers token standards in depth. Here the question is: <strong>why would a business hold or move value in a stablecoin, and what does that risk actually mean for a treasury?</strong></p>
<h3>Why businesses use stablecoins</h3>
<p>A stablecoin (e.g. USDC, USDT) is a token pegged roughly 1:1 to a currency like the US dollar. For a business, it can function as a <strong>settlement instrument</strong> that moves on a blockchain 24/7 without banking hours, useful for paying overseas suppliers, freelancers, or settling between crypto exchanges — without the volatility of Bitcoin.</p>
<h3>Market structure — a few issuers, a lot of concentration</h3>
<pre><code>Issuer   Stablecoin   Reserve claim
Tether    USDT         mix of cash, T-bills, commercial paper
                        (reserve reports, not full independent audits)
Circle    USDC         cash & short-term US Treasuries
                        (monthly attestations)
</code></pre>
<h3>The reserve/"bank run" risk a CFO must price in</h3>
<p>A stablecoin's peg depends entirely on the issuer actually holding (and being able to liquidate) the reserves it claims. If holders lose confidence and redeem en masse faster than the issuer can liquidate reserves, the peg can break — this is structurally the same risk as a <strong>bank run</strong>, just on a private, less-regulated balance sheet. TerraUSD's 2022 collapse (an <em>algorithmic</em>, uncollateralized design) is the extreme case: it lost its peg entirely within days.</p>
<div class="callout"><span class="badge">Treasury takeaway</span> Holding stablecoins is holding unsecured exposure to the issuer's balance sheet and redemption process — a business decision, not a technical one. Diversifying issuers and checking reserve attestations is basic treasury risk management here.</div>`,
    `<span class="eyebrow">FTP301 · Chương 5 · Bài 5.1</span>
<h2>Stablecoin &amp; token như công cụ thanh toán/quản trị dòng tiền</h2>
<p class="lead">BDF201 đã phân loại stablecoin về mặt kỹ thuật (thế chấp fiat, thế chấp crypto, thuật toán) và trình bày chuẩn token chuyên sâu. Ở đây câu hỏi là: <strong>vì sao một doanh nghiệp lại giữ hoặc chuyển giá trị bằng stablecoin, và rủi ro đó thật sự có ý nghĩa gì với bộ phận tài chính?</strong></p>
<h3>Vì sao doanh nghiệp dùng stablecoin</h3>
<p>Một stablecoin (vd USDC, USDT) là token neo giá xấp xỉ 1:1 với một đồng tiền như USD. Với doanh nghiệp, nó có thể đóng vai trò <strong>công cụ quyết toán</strong> di chuyển trên blockchain 24/7 không phụ thuộc giờ hành chính ngân hàng, hữu ích để trả nhà cung cấp nước ngoài, freelancer, hoặc quyết toán giữa các sàn crypto — mà không chịu biến động giá như Bitcoin.</p>
<h3>Cấu trúc thị trường — vài đơn vị phát hành, mức tập trung cao</h3>
<pre><code>Đơn vị phát hành  Stablecoin  Tuyên bố dự trữ
Tether             USDT        hỗn hợp tiền mặt, tín phiếu kho bạc,
                                thương phiếu (báo cáo dự trữ, không
                                phải kiểm toán độc lập đầy đủ)
Circle             USDC        tiền mặt & trái phiếu kho bạc Mỹ
                                kỳ hạn ngắn (xác nhận hàng tháng)
</code></pre>
<h3>Rủi ro dự trữ/"bank run" mà CFO phải tính vào giá</h3>
<p>Việc neo giá của stablecoin phụ thuộc hoàn toàn vào việc đơn vị phát hành thật sự giữ (và có thể thanh khoản) đúng lượng dự trữ đã tuyên bố. Nếu người giữ mất niềm tin và đổi lại hàng loạt nhanh hơn tốc độ thanh khoản dự trữ, giá neo có thể vỡ — về cấu trúc đây là rủi ro giống hệt <strong>bank run</strong>, chỉ khác là trên bảng cân đối tư nhân, ít bị quản lý hơn. Vụ sụp đổ TerraUSD năm 2022 (thiết kế <em>thuật toán</em>, không thế chấp) là trường hợp cực đoan: mất neo hoàn toàn chỉ trong vài ngày.</p>
<div class="callout"><span class="badge">Kết luận cho bộ phận tài chính</span> Giữ stablecoin là chịu rủi ro tín dụng không đảm bảo với bảng cân đối và quy trình đổi lại của đơn vị phát hành — đây là quyết định kinh doanh, không phải kỹ thuật. Đa dạng hoá đơn vị phát hành và kiểm tra xác nhận dự trữ là quản trị rủi ro tài chính cơ bản ở đây.</div>`,
  ]]);

const c5q = quiz('ftp301-quiz-5', 'Quiz 5 — Stablecoins & treasury|||Quiz 5 — Stablecoin & dòng tiền doanh nghiệp', [
  { id: 'q1', question: 'Rủi ro cốt lõi khi doanh nghiệp giữ stablecoin là gì?', options: ['Không có rủi ro, giá luôn cố định tuyệt đối', 'Rủi ro tín dụng với đơn vị phát hành nếu dự trữ không đủ hoặc không thanh khoản kịp khi bị đổi lại hàng loạt', 'Chỉ có rủi ro về tốc độ giao dịch', 'Rủi ro duy nhất là phí giao dịch cao'], correctIndex: 1, explanation: 'Giá neo phụ thuộc vào dự trữ thật của đơn vị phát hành — rủi ro giống bank run.' },
  { id: 'q2', question: 'Vì sao vụ sụp đổ TerraUSD (2022) được xem là trường hợp cực đoan?', options: ['Vì nó là stablecoin thế chấp bằng USD tiền mặt', 'Vì nó là thiết kế thuật toán, không thế chấp, và mất neo hoàn toàn trong vài ngày', 'Vì nó được ngân hàng trung ương bảo lãnh', 'Vì nó không liên quan tới stablecoin'], correctIndex: 1, explanation: 'TerraUSD dùng cơ chế thuật toán không có tài sản thế chấp thực, nên mất neo rất nhanh khi niềm tin sụp đổ.' },
  { id: 'q3', question: 'Vì sao stablecoin hữu ích cho doanh nghiệp trả nhà cung cấp nước ngoài?', options: ['Vì nó biến động giá mạnh như Bitcoin', 'Vì nó di chuyển trên blockchain 24/7, không phụ thuộc giờ hành chính ngân hàng, và ổn định giá hơn Bitcoin', 'Vì nó được chính phủ phát hành', 'Vì nó không thể theo dõi giao dịch'], correctIndex: 1, explanation: 'Stablecoin kết hợp tính sẵn sàng 24/7 của blockchain với giá tương đối ổn định — phù hợp cho quyết toán quốc tế.' },
]);

const c6 = doc('ftp301-6-1-crypto-cross-border', '6.1 — Crypto payments & cross-border transfers: a CFO view|||6.1 — Thanh toán crypto & chuyển tiền xuyên biên giới: góc nhìn CFO',
  'So sánh chi phí/thời gian: correspondent banking/SWIFT so với chuyển tiền qua crypto; vai trò bộ xử lý thanh toán crypto (on/off-ramp); rủi ro biến động & kế toán/thuế.',
  [[
    `<span class="eyebrow">FTP301 · Chapter 6 · Lesson 6.1</span>
<h2>Crypto payments &amp; cross-border transfers: a CFO view</h2>
<p class="lead">EPT301 covers the consumer cross-border journey (correspondent banking, SWIFT, remittance apps). Here we compare rails from a <strong>finance/treasury decision-maker's</strong> perspective: cost, speed, and operational risk of moving money internationally.</p>
<h3>Two rails, compared</h3>
<pre><code>Traditional correspondent banking / SWIFT
- 1-5 business days; multiple intermediary banks each take a cut
- Predictable, heavily regulated, dispute/recourse process exists
- FX conversion happens at the bank's quoted rate

Crypto rail (stablecoin transfer + on/off-ramp)
- Minutes on-chain; but on/off-ramp (fiat<->crypto conversion)
  adds its own time, fees and compliance checks (KYC/AML)
- Volatile if using a non-pegged asset; near-zero if using
  a stablecoin, but reserve risk applies (Chapter 5)
- Little to no dispute/recourse once settled on-chain
</code></pre>
<h3>Where crypto payment processors fit in</h3>
<p>A business rarely holds crypto directly end to end. A <strong>payment processor</strong> (custodial gateway) sits between the merchant and the blockchain: it receives crypto from the customer, converts it to fiat immediately (so the merchant never bears price volatility), and settles fiat to the merchant's bank account — functionally similar to a card acquirer, but for crypto.</p>
<h3>What finance teams must account for</h3>
<p>Accepting or holding crypto brings obligations beyond the transfer itself: <strong>accounting</strong> (crypto is usually treated as an intangible asset, not cash, under most standards — gains/losses must be tracked), <strong>tax</strong> (each conversion can be a taxable event), and <strong>compliance</strong> (AML/KYC on counterparties, sanctions screening).</p>
<div class="callout"><span class="badge">CFO verdict</span> Crypto rails can beat correspondent banking on speed for specific corridors, but the "5-day SWIFT vs. 5-minute crypto" comparison ignores on/off-ramp friction, volatility exposure and new compliance overhead — the true cost comparison must include all of it.</div>`,
    `<span class="eyebrow">FTP301 · Chương 6 · Bài 6.1</span>
<h2>Thanh toán crypto &amp; chuyển tiền xuyên biên giới: góc nhìn CFO</h2>
<p class="lead">EPT301 đã trình bày hành trình xuyên biên giới của người tiêu dùng (correspondent banking, SWIFT, ứng dụng kiều hối). Ở đây ta so sánh các kênh từ góc nhìn <strong>người ra quyết định tài chính/dòng tiền</strong>: chi phí, tốc độ và rủi ro vận hành khi chuyển tiền quốc tế.</p>
<h3>Hai kênh, đặt cạnh nhau</h3>
<pre><code>Correspondent banking / SWIFT truyền thống
- 1-5 ngày làm việc; nhiều ngân hàng trung gian mỗi bên ăn một phần
- Có thể dự đoán, quản lý chặt, có quy trình tranh chấp/khiếu nại
- Quy đổi ngoại tệ theo tỷ giá ngân hàng niêm yết

Kênh crypto (chuyển stablecoin + on/off-ramp)
- Vài phút trên chuỗi; nhưng on/off-ramp (quy đổi fiat<->crypto)
  cộng thêm thời gian, phí và kiểm tra tuân thủ riêng (KYC/AML)
- Biến động mạnh nếu dùng tài sản không neo giá; gần như bằng
  không nếu dùng stablecoin, nhưng vẫn có rủi ro dự trữ (Chương 5)
- Gần như không có quy trình tranh chấp/khiếu nại sau khi đã
  quyết toán trên chuỗi
</code></pre>
<h3>Bộ xử lý thanh toán crypto nằm ở đâu</h3>
<p>Doanh nghiệp hiếm khi tự giữ crypto xuyên suốt. Một <strong>bộ xử lý thanh toán</strong> (cổng giữ hộ tài sản) đứng giữa người bán và blockchain: nhận crypto từ khách hàng, quy đổi ngay sang fiat (để người bán không chịu biến động giá), và quyết toán fiat vào tài khoản ngân hàng người bán — chức năng tương tự ngân hàng thanh toán (acquirer) của thẻ, nhưng cho crypto.</p>
<h3>Những gì bộ phận tài chính phải tính đến</h3>
<p>Chấp nhận hoặc giữ crypto kéo theo nghĩa vụ ngoài bản thân giao dịch chuyển tiền: <strong>kế toán</strong> (crypto thường được hạch toán như tài sản vô hình, không phải tiền mặt, theo hầu hết chuẩn mực — phải theo dõi lãi/lỗ), <strong>thuế</strong> (mỗi lần quy đổi có thể là một sự kiện chịu thuế), và <strong>tuân thủ</strong> (AML/KYC với đối tác, sàng lọc trừng phạt).</p>
<div class="callout"><span class="badge">Kết luận CFO</span> Kênh crypto có thể vượt correspondent banking về tốc độ ở một số hành lang cụ thể, nhưng phép so sánh "SWIFT 5 ngày so với crypto 5 phút" bỏ qua ma sát on/off-ramp, rủi ro biến động và chi phí tuân thủ mới — so sánh chi phí thật phải tính đủ những phần này.</div>`,
  ]]);

const c6q = quiz('ftp301-quiz-6', 'Quiz 6 — Crypto cross-border|||Quiz 6 — Crypto xuyên biên giới', [
  { id: 'q1', question: 'Vai trò chính của một bộ xử lý thanh toán crypto (payment processor) với người bán là gì?', options: ['Bắt người bán tự giữ crypto và chịu rủi ro biến động', 'Nhận crypto từ khách, quy đổi ngay sang fiat và quyết toán fiat cho người bán', 'Phát hành thẻ tín dụng', 'Thay thế hoàn toàn ngân hàng trung ương'], correctIndex: 1, explanation: 'Bộ xử lý thanh toán quy đổi ngay để người bán không chịu rủi ro biến động giá crypto.' },
  { id: 'q2', question: 'Vì sao so sánh "SWIFT 5 ngày so với crypto 5 phút" là chưa đầy đủ?', options: ['Vì SWIFT thực ra nhanh hơn crypto', 'Vì bỏ qua thời gian/phí on-off-ramp, rủi ro biến động và chi phí tuân thủ mới của kênh crypto', 'Vì crypto không có phí giao dịch nào', 'Vì SWIFT không tồn tại nữa'], correctIndex: 1, explanation: 'Chi phí thật của kênh crypto phải cộng thêm ma sát chuyển đổi fiat-crypto và tuân thủ.' },
  { id: 'q3', question: 'Nghĩa vụ nào KHÔNG thuộc về bộ phận tài chính khi doanh nghiệp chấp nhận crypto?', options: ['Kế toán lãi/lỗ tài sản', 'Tuân thủ AML/KYC với đối tác', 'Xử lý sự kiện chịu thuế khi quy đổi', 'Tự động miễn mọi nghĩa vụ thuế vì là tài sản số'], correctIndex: 3, explanation: 'Crypto không miễn nghĩa vụ thuế — mỗi lần quy đổi có thể là sự kiện chịu thuế.' },
]);

const c7 = doc('ftp301-7-1-cbdc', '7.1 — Central bank digital currencies (CBDC)|||7.1 — Tiền kỹ thuật số ngân hàng trung ương (CBDC)',
  'CBDC là gì; bán buôn (wholesale) so với bán lẻ (retail); lựa chọn thiết kế tài khoản/token, trực tiếp/trung gian; các thử nghiệm toàn cầu (e-CNY, digital euro); hệ quả chính sách tiền tệ.',
  [[
    `<span class="eyebrow">FTP301 · Chapter 7 · Lesson 7.1</span>
<h2>Central bank digital currencies (CBDC)</h2>
<h3>What a CBDC actually is</h3>
<p>A <strong>CBDC</strong> is a digital liability of the central bank itself — unlike money in a commercial bank account (a liability of that bank) or a stablecoin (a liability of a private issuer), a CBDC is claim directly on the central bank, the safest possible form of digital money. It may or may not use DLT/blockchain — that's an implementation choice, not the definition.</p>
<h3>Wholesale vs. retail — two very different projects</h3>
<pre><code>Wholesale CBDC                    Retail CBDC
- Used only between banks/         - Used by the general public,
  financial institutions             like digital cash
- Speeds up/derisks interbank      - Competes directly with bank
  settlement (an upgrade to RTGS)    deposits and e-wallets
- Lower financial-stability risk   - Higher financial-stability risk
  (limited, known participants)      (mass adoption could drain
                                      bank deposits — "disintermediation")
</code></pre>
<h3>Design choices that matter</h3>
<p><strong>Account-based</strong> CBDC ties balances to verified identity (like a bank account); <strong>token-based</strong> CBDC behaves more like digital cash, transferable with less identity friction. <strong>Direct</strong> issuance means the central bank runs consumer accounts itself; <strong>intermediated/two-tier</strong> (the model most pilots use) keeps commercial banks and e-wallets as the customer interface, with the central bank only issuing and settling behind the scenes.</p>
<h3>Global pilots (illustrative, not exhaustive)</h3>
<p>China's <strong>e-CNY</strong> is the largest live retail pilot; the <strong>digital euro</strong> project is in advanced design by the ECB; Hong Kong has piloted a retail <strong>e-HKD</strong>. Vietnam's central bank (SBV) has studied CBDC but has not issued one as of this writing — treat any specific status as something to verify, not assume, since pilots move fast.</p>
<div class="callout"><span class="badge">Policy stakes</span> A retail CBDC isn't just a technical upgrade — done carelessly, it can pull deposits out of commercial banks during stress (a "digital bank run" channel), which is why most central banks design it with holding limits and go through years of pilots before launch.</div>`,
    `<span class="eyebrow">FTP301 · Chương 7 · Bài 7.1</span>
<h2>Tiền kỹ thuật số ngân hàng trung ương (CBDC)</h2>
<h3>CBDC thực chất là gì</h3>
<p>Một <strong>CBDC</strong> là khoản nợ kỹ thuật số của chính ngân hàng trung ương — khác với tiền trong tài khoản ngân hàng thương mại (khoản nợ của ngân hàng đó) hay stablecoin (khoản nợ của đơn vị phát hành tư nhân), CBDC là yêu cầu trực tiếp lên ngân hàng trung ương, hình thức tiền kỹ thuật số an toàn nhất có thể. CBDC có thể dùng hoặc không dùng DLT/blockchain — đó là lựa chọn triển khai, không phải định nghĩa.</p>
<h3>Bán buôn so với bán lẻ — hai dự án rất khác nhau</h3>
<pre><code>CBDC bán buôn (wholesale)          CBDC bán lẻ (retail)
- Chỉ dùng giữa các ngân hàng/      - Công chúng dùng trực tiếp,
  tổ chức tài chính                  như tiền mặt kỹ thuật số
- Tăng tốc/giảm rủi ro quyết toán   - Cạnh tranh trực tiếp với
  liên ngân hàng (nâng cấp RTGS)     tiền gửi ngân hàng & ví điện tử
- Rủi ro ổn định tài chính thấp     - Rủi ro ổn định tài chính cao
  (số bên tham gia giới hạn, đã       hơn (áp dụng đại trà có thể
   biết trước)                        rút cạn tiền gửi ngân hàng —
                                       "phi trung gian hoá")
</code></pre>
<h3>Các lựa chọn thiết kế quan trọng</h3>
<p>CBDC <strong>theo tài khoản</strong> gắn số dư với danh tính đã xác thực (như tài khoản ngân hàng); CBDC <strong>theo token</strong> hoạt động giống tiền mặt kỹ thuật số, chuyển giao ít ràng buộc danh tính hơn. Phát hành <strong>trực tiếp</strong> nghĩa là ngân hàng trung ương tự quản lý tài khoản người dùng; mô hình <strong>trung gian/hai tầng</strong> (hầu hết thử nghiệm dùng mô hình này) giữ ngân hàng thương mại và ví điện tử làm giao diện khách hàng, ngân hàng trung ương chỉ phát hành và quyết toán phía sau.</p>
<h3>Các thử nghiệm toàn cầu (minh hoạ, không đầy đủ)</h3>
<p><strong>e-CNY</strong> của Trung Quốc là thử nghiệm bán lẻ đang chạy quy mô lớn nhất; dự án <strong>digital euro</strong> đang ở giai đoạn thiết kế nâng cao bởi ECB; Hong Kong đã thử nghiệm <strong>e-HKD</strong> bán lẻ. Ngân hàng Nhà nước Việt Nam (SBV) đã nghiên cứu CBDC nhưng chưa phát hành tính tới thời điểm viết bài — hãy kiểm tra hiện trạng cụ thể thay vì giả định, vì các thử nghiệm thay đổi rất nhanh.</p>
<div class="callout"><span class="badge">Cân nhắc chính sách</span> CBDC bán lẻ không chỉ là nâng cấp kỹ thuật — nếu triển khai bất cẩn, nó có thể rút tiền gửi khỏi ngân hàng thương mại lúc căng thẳng (kênh "bank run kỹ thuật số"), đó là lý do hầu hết ngân hàng trung ương thiết kế hạn mức nắm giữ và trải qua nhiều năm thử nghiệm trước khi ra mắt.</div>`,
  ]]);

const c7q = quiz('ftp301-quiz-7', 'Quiz 7 — CBDC|||Quiz 7 — CBDC', [
  { id: 'q1', question: 'CBDC khác tiền trong tài khoản ngân hàng thương mại ở điểm nào?', options: ['CBDC là khoản nợ trực tiếp của ngân hàng trung ương, còn tiền gửi ngân hàng là khoản nợ của ngân hàng thương mại', 'Không có khác biệt nào', 'CBDC luôn dùng blockchain còn tiền gửi thì không', 'CBDC chỉ tồn tại dưới dạng tiền mặt vật lý'], correctIndex: 0, explanation: 'CBDC là yêu cầu trực tiếp lên ngân hàng trung ương — an toàn hơn tiền gửi thương mại.' },
  { id: 'q2', question: 'Vì sao CBDC bán lẻ (retail) mang rủi ro ổn định tài chính cao hơn CBDC bán buôn (wholesale)?', options: ['Vì bán lẻ chỉ dùng giữa các ngân hàng', 'Vì áp dụng đại trà có thể rút tiền gửi khỏi ngân hàng thương mại, gây phi trung gian hoá', 'Vì bán buôn không có ngân hàng trung ương tham gia', 'Vì bán lẻ không cần thử nghiệm'], correctIndex: 1, explanation: 'CBDC bán lẻ cạnh tranh trực tiếp với tiền gửi ngân hàng, có thể gây rút tiền hàng loạt khi căng thẳng.' },
  { id: 'q3', question: 'Mô hình "hai tầng/trung gian" trong thiết kế CBDC nghĩa là gì?', options: ['Ngân hàng trung ương tự quản lý mọi tài khoản người dùng', 'Ngân hàng thương mại/ví điện tử làm giao diện khách hàng, ngân hàng trung ương phát hành & quyết toán phía sau', 'Không có ngân hàng trung ương nào tham gia', 'Chỉ áp dụng cho CBDC bán buôn'], correctIndex: 1, explanation: 'Mô hình hai tầng giữ vai trò trung gian cho ngân hàng thương mại/ví điện tử, phổ biến trong hầu hết thử nghiệm CBDC.' },
]);

const c8 = doc('ftp301-8-1-risk-regulation', '8.1 — Systemic risk, regulation & compliance in payments|||8.1 — Rủi ro hệ thống, quy định & tuân thủ trong thanh toán',
  'Rủi ro hệ thống khi crypto kết nối với hạ tầng thanh toán truyền thống; khung cấp phép VASP; hiện trạng pháp lý crypto tại Việt Nam; Travel Rule; bài học Terra/Luna & FTX.',
  [[
    `<span class="eyebrow">FTP301 · Chapter 8 · Lesson 8.1</span>
<h2>Systemic risk, regulation &amp; compliance in payments</h2>
<p class="lead">EPT301 covers transaction-level fraud detection and AML/KYC. Here we zoom out to <strong>system-level</strong> risk: what happens to the payment system as a whole when crypto and traditional rails interconnect, and what businesses in this space must comply with.</p>
<h3>Interconnection risk</h3>
<p>As stablecoin issuers hold traditional assets (T-bills, bank deposits) as reserves, and as payment processors bridge crypto to bank accounts, the crypto and traditional payment systems become <strong>linked</strong>. A large enough shock on the crypto side (a major stablecoin de-pegging, an exchange collapse) can now propagate into traditional finance — this interconnection is exactly what regulators worry about.</p>
<h3>Two case studies</h3>
<pre><code>TerraUSD / Luna (May 2022)       FTX (Nov 2022)
- Algorithmic stablecoin lost     - Exchange used customer deposits
  its peg; ~$40B wiped out          for undisclosed risky bets;
  in days                           collapsed within days
- Lesson: uncollateralized        - Lesson: custody without
  design has no floor                segregation/audit is a fraud risk,
                                     not just a market risk
</code></pre>
<h3>Regulatory response: VASP licensing &amp; the Travel Rule</h3>
<p>Most jurisdictions now require crypto businesses (exchanges, custodians, some payment processors) to register as a <strong>Virtual Asset Service Provider (VASP)</strong> and follow AML/KYC rules. The <strong>Travel Rule</strong> (from the Financial Action Task Force, FATF) requires VASPs to share sender/receiver identity information on transfers above a threshold — extending a decades-old banking-wire rule to crypto.</p>
<h3>Vietnam's current legal position</h3>
<p>As of this writing, Vietnamese law does <strong>not</strong> recognize cryptocurrency as legal tender or an authorized means of payment — the State Bank of Vietnam (SBV) has repeatedly stated that using crypto to pay for goods/services is not permitted. Vietnam has been developing a broader legal framework for virtual assets; treat the exact current rules as something to verify against SBV's latest guidance rather than assume, since this area moves quickly.</p>
<div class="callout"><span class="badge">Not investment advice</span> This chapter describes systemic risk and regulatory mechanics, not a judgment on any asset's future value. Always verify current legal status before a business decision involving crypto.</div>`,
    `<span class="eyebrow">FTP301 · Chương 8 · Bài 8.1</span>
<h2>Rủi ro hệ thống, quy định &amp; tuân thủ trong thanh toán</h2>
<p class="lead">EPT301 đã trình bày phát hiện gian lận cấp giao dịch và AML/KYC. Ở đây ta nhìn rộng ra rủi ro <strong>cấp hệ thống</strong>: điều gì xảy ra với toàn bộ hệ thống thanh toán khi crypto kết nối với hạ tầng truyền thống, và doanh nghiệp trong lĩnh vực này phải tuân thủ gì.</p>
<h3>Rủi ro liên thông</h3>
<p>Khi đơn vị phát hành stablecoin giữ tài sản truyền thống (tín phiếu kho bạc, tiền gửi ngân hàng) làm dự trữ, và khi bộ xử lý thanh toán bắc cầu crypto sang tài khoản ngân hàng, hệ thống thanh toán crypto và truyền thống trở nên <strong>liên thông</strong>. Một cú sốc đủ lớn ở phía crypto (một stablecoin lớn mất neo, một sàn giao dịch sụp đổ) giờ có thể lan sang tài chính truyền thống — đây chính là điều cơ quan quản lý lo ngại.</p>
<h3>Hai vụ việc điển hình</h3>
<pre><code>TerraUSD / Luna (5/2022)          FTX (11/2022)
- Stablecoin thuật toán mất neo;  - Sàn giao dịch dùng tiền gửi
  ~40 tỷ USD bốc hơi trong          khách hàng cho các khoản đầu
  vài ngày                          cơ rủi ro không công bố; sụp
                                     đổ trong vài ngày
- Bài học: thiết kế không thế     - Bài học: giữ hộ tài sản mà
  chấp không có sàn đỡ giá           không tách bạch/kiểm toán là
                                     rủi ro gian lận, không chỉ
                                     rủi ro thị trường
</code></pre>
<h3>Phản ứng quản lý: cấp phép VASP & Travel Rule</h3>
<p>Hầu hết các quốc gia hiện yêu cầu doanh nghiệp crypto (sàn giao dịch, đơn vị giữ hộ, một số bộ xử lý thanh toán) đăng ký làm <strong>Nhà cung cấp dịch vụ tài sản ảo (VASP)</strong> và tuân theo quy tắc AML/KYC. <strong>Travel Rule</strong> (từ Lực lượng Đặc nhiệm Tài chính, FATF) yêu cầu VASP chia sẻ thông tin danh tính người gửi/nhận với các khoản chuyển vượt ngưỡng — mở rộng một quy tắc chuyển khoản ngân hàng đã có từ hàng chục năm sang crypto.</p>
<h3>Hiện trạng pháp lý tại Việt Nam</h3>
<p>Tính tới thời điểm viết bài, pháp luật Việt Nam <strong>không</strong> công nhận tiền mã hoá là phương tiện thanh toán hợp pháp — Ngân hàng Nhà nước Việt Nam (SBV) đã nhiều lần khẳng định dùng crypto để thanh toán hàng hoá/dịch vụ là không được phép. Việt Nam đang xây dựng khung pháp lý rộng hơn cho tài sản ảo; hãy kiểm tra quy định hiện hành theo hướng dẫn mới nhất của SBV thay vì giả định, vì lĩnh vực này thay đổi rất nhanh.</p>
<div class="callout"><span class="badge">Không khuyến nghị đầu tư</span> Chương này mô tả rủi ro hệ thống và cơ chế quản lý, không phải nhận định về giá trị tương lai của bất kỳ tài sản nào. Luôn kiểm tra hiện trạng pháp lý trước khi ra quyết định kinh doanh liên quan tới crypto.</div>`,
  ]]);

const c8q = quiz('ftp301-quiz-8', 'Quiz 8 — Systemic risk & regulation|||Quiz 8 — Rủi ro hệ thống & quy định', [
  { id: 'q1', question: 'Bài học chính từ vụ sụp đổ FTX (11/2022) là gì?', options: ['Stablecoin thuật toán luôn an toàn', 'Giữ hộ tài sản khách hàng mà không tách bạch/kiểm toán là rủi ro gian lận, không chỉ rủi ro thị trường', 'Sàn giao dịch không cần tuân thủ quy định', 'FTX sụp đổ vì lỗi kỹ thuật blockchain'], correctIndex: 1, explanation: 'FTX dùng tiền khách hàng cho đầu cơ rủi ro không công bố — vấn đề quản trị/gian lận, không phải lỗi công nghệ.' },
  { id: 'q2', question: 'Travel Rule (FATF) yêu cầu các VASP làm gì?', options: ['Cấm mọi giao dịch crypto', 'Chia sẻ thông tin danh tính người gửi/nhận với các khoản chuyển vượt ngưỡng', 'Chỉ áp dụng cho ngân hàng truyền thống, không áp dụng cho crypto', 'Tự động hoàn tiền khi có tranh chấp'], correctIndex: 1, explanation: 'Travel Rule mở rộng quy tắc chia sẻ danh tính của chuyển khoản ngân hàng sang các nhà cung cấp dịch vụ tài sản ảo.' },
  { id: 'q3', question: 'Hiện trạng pháp lý về crypto làm phương tiện thanh toán tại Việt Nam (theo SBV) là gì?', options: ['Được công nhận hợp pháp như tiền mặt', 'Không được công nhận là phương tiện thanh toán hợp pháp', 'Chỉ hợp pháp cho doanh nghiệp lớn', 'Luật chưa từng đề cập tới vấn đề này'], correctIndex: 1, explanation: 'SBV đã nhiều lần khẳng định dùng crypto để thanh toán hàng hoá/dịch vụ tại Việt Nam là không được phép.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'FTP301',
    slug: 'ftp301-payments-crypto-currencies-and-blockchain',
    title: 'Payments, Crypto currencies and blockchain',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FTP301.webp',
    shortDescription: 'Payments, crypto & blockchain via a business/infrastructure lens: settlement rails (RTGS/ACH/NAPAS), DLT, Bitcoin, stablecoins, cross-border crypto, CBDC, systemic risk & regulation. Not investment advice.|||Thanh toán, crypto & blockchain qua góc kinh doanh/hạ tầng: hạ tầng quyết toán (RTGS/ACH/NAPAS), DLT, Bitcoin, stablecoin, crypto xuyên biên giới, CBDC, rủi ro hệ thống & quy định. Không khuyến nghị đầu tư.',
    description: 'Môn <strong>FTP301 — Payments, Crypto currencies and blockchain</strong> (kỳ 5, khối Quản trị Kinh doanh) nhìn thanh toán, tiền mã hoá và blockchain qua lăng kính <strong>kinh doanh &amp; hạ tầng hệ thống</strong> — khác với <strong>BDF201</strong> (cơ chế kỹ thuật blockchain/DeFi) và <strong>EPT301</strong> (hạ tầng hướng người dùng của thanh toán điện tử). Từ <strong>tiến hoá hệ thống thanh toán</strong> &amp; mô hình bốn bên → <strong>hạ tầng quyết toán</strong> (card network, RTGS, ACH, NAPAS) → <strong>sổ cái phân tán</strong> cho quyết toán tổ chức → <strong>Bitcoin như mạng thanh toán</strong> &amp; đồng thuận → <strong>stablecoin &amp; token</strong> như công cụ quản trị dòng tiền → <strong>crypto &amp; chuyển tiền xuyên biên giới</strong> theo góc CFO → <strong>CBDC</strong> chuyên sâu → <strong>rủi ro hệ thống, quy định &amp; tuân thủ</strong>. Song ngữ, có sơ đồ, ví dụ và quiz mỗi chương. Không khuyến nghị đầu tư.',
    whatYouLearn: 'Lịch sử & mô hình kinh doanh của hệ thống thanh toán (mô hình bốn bên, phí interchange/network); hạ tầng quyết toán RTGS vs ACH, vai trò NAPAS, khái niệm SIPS; sổ cái phân tán có cấp phép cho quyết toán liên ngân hàng (JPM Coin, R3 Corda) & bài toán đối soát; Bitcoin đánh giá như mạng thanh toán (finality xác suất, thông lượng, Lightning Network); stablecoin & token như công cụ thanh toán/quản trị dòng tiền doanh nghiệp, rủi ro dự trữ; thanh toán crypto & chuyển tiền xuyên biên giới so với correspondent banking/SWIFT, vai trò bộ xử lý thanh toán, nghĩa vụ kế toán/thuế; CBDC bán buôn/bán lẻ, lựa chọn thiết kế, thử nghiệm toàn cầu; rủi ro hệ thống khi crypto liên thông tài chính truyền thống, khung VASP/Travel Rule, hiện trạng pháp lý Việt Nam.',
    requirements: 'Kiến thức nền về tài chính/kinh doanh cơ bản (Kỳ 5, khối Quản trị Kinh doanh). Không yêu cầu lập trình. Nên đã học hoặc song song với EPT301/BDF201 để có nền kỹ thuật, tuy không bắt buộc.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Mastering Bitcoin, The Book of Payments, báo cáo BIS/IMF về CBDC, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao khác BDF201/EPT301, góc nhìn kinh doanh & hạ tầng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tiến hoá hệ thống thanh toán|||Chapter 1 — Evolution of payment systems', description: 'Từ tiền mặt tới thanh toán thời gian thực; mô hình bốn bên; ai kiếm tiền ở đâu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hạ tầng thanh toán|||Chapter 2 — Payment infrastructure', description: 'Card network, RTGS vs ACH, vai trò NAPAS, hệ thống quan trọng hệ thống (SIPS).', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nền tảng blockchain & sổ cái phân tán|||Chapter 3 — Blockchain & distributed ledgers', description: 'DLT có cấp phép cho quyết toán liên ngân hàng; JPM Coin, R3 Corda; đối soát.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bitcoin & cơ chế đồng thuận|||Chapter 4 — Bitcoin & consensus', description: 'Bitcoin như mạng thanh toán; finality xác suất; Lightning Network.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tiền mã hoá, stablecoin & token|||Chapter 5 — Cryptocurrencies, stablecoins & tokens', description: 'Stablecoin như công cụ dòng tiền doanh nghiệp; rủi ro dự trữ/bank run.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thanh toán crypto & xuyên biên giới|||Chapter 6 — Crypto payments & cross-border', description: 'So sánh SWIFT với crypto rail; bộ xử lý thanh toán; kế toán & thuế.', lessons: [c6, c6q] },
    { title: 'Chương 7 — CBDC & tương lai tiền tệ số|||Chapter 7 — CBDC & the future of money', description: 'Bán buôn vs bán lẻ, thiết kế tài khoản/token, thử nghiệm toàn cầu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rủi ro, quy định & tác động hệ thống|||Chapter 8 — Risks, regulation & systemic impact', description: 'Liên thông crypto-truyền thống; Terra/Luna & FTX; VASP/Travel Rule; pháp lý Việt Nam.', lessons: [c8, c8q] },
  ],
};
