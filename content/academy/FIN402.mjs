/**
 * FIN402 — Derivatives (Công cụ tài chính phái sinh). Khối Quản trị Kinh doanh
 * (BBA), FPTU, Kỳ 4. Giáo trình tham khảo: Hull "Options, Futures, and Other
 * Derivatives"; McDonald "Derivatives Markets"; CFA Program — Derivatives.
 * Song ngữ + ví dụ số (GIẢ ĐỊNH) + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fin402-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Hull, McDonald, CFA), tài liệu chính thức miễn phí, YouTube, công cụ tính payoff, lộ trình tự học.',
  [[
    `<span class="eyebrow">FIN402 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Derivatives — forwards, futures, options, swaps and risk management — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources used worldwide.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FIN402 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Options, Futures, and Other Derivatives</em> — John C. Hull (the standard reference in almost every derivatives course worldwide)</li>
<li><em>Derivatives Markets</em> — Robert L. McDonald</li>
<li>CFA Program curriculum — Derivatives topic area</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/d/derivative.asp" target="_blank" rel="noopener">Investopedia — Derivatives basics</a></li>
<li><a href="https://www.cmegroup.com/education.html" target="_blank" rel="noopener">CME Group — Derivatives education center</a></li>
<li><a href="https://www.cboe.com/education/" target="_blank" rel="noopener">Cboe — Options education</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@PatrickBoyleOnFinance" target="_blank" rel="noopener">Patrick Boyle</a> — derivatives, risk &amp; market structure explained clearly</li>
<li><a href="https://www.youtube.com/@wallstreetmojo" target="_blank" rel="noopener">WallStreetMojo</a> — worked examples for forwards, futures, options, swaps</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.optionsprofitcalculator.com/" target="_blank" rel="noopener">Options Profit Calculator</a> — draw payoff/profit diagrams for any option strategy</li>
<li><a href="https://www.cboe.com/education/tools/" target="_blank" rel="noopener">Cboe education tools</a> — options basics calculators</li>
<li><a href="https://www.hnx.vn" target="_blank" rel="noopener">HNX (Sở GDCK Hà Nội)</a> — nơi niêm yết hợp đồng tương lai VN30 &amp; trái phiếu chính phủ tại Việt Nam</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what a derivative is, the four instrument families, forward/futures payoff, option payoff (call/put).</li>
<li><strong>Practice</strong> — compute futures fair price (cost-of-carry) and option payoff/profit for a handful of made-up numbers until it is automatic.</li>
<li><strong>Go deeper</strong> — option strategies (spreads, straddles), binomial &amp; Black-Scholes pricing intuition, swaps.</li>
<li><strong>Job-ready</strong> — read a real futures/option contract specification (CME or HNX), and know how derivatives are used for hedging vs. speculation.</li>
</ol></div>`,
    `<span class="eyebrow">FIN402 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Công cụ tài chính phái sinh — hợp đồng kỳ hạn, tương lai, quyền chọn, hoán đổi và quản trị rủi ro — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp được dùng phổ biến trên thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FIN402 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Options, Futures, and Other Derivatives</em> — John C. Hull (tài liệu chuẩn của hầu hết mọi môn phái sinh trên thế giới)</li>
<li><em>Derivatives Markets</em> — Robert L. McDonald</li>
<li>Giáo trình CFA Program — phần Derivatives</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/d/derivative.asp" target="_blank" rel="noopener">Investopedia — Kiến thức nền phái sinh</a></li>
<li><a href="https://www.cmegroup.com/education.html" target="_blank" rel="noopener">CME Group — Trung tâm giáo dục phái sinh</a></li>
<li><a href="https://www.cboe.com/education/" target="_blank" rel="noopener">Cboe — Giáo dục về quyền chọn</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PatrickBoyleOnFinance" target="_blank" rel="noopener">Patrick Boyle</a> — phái sinh, rủi ro &amp; cấu trúc thị trường giảng rõ ràng</li>
<li><a href="https://www.youtube.com/@wallstreetmojo" target="_blank" rel="noopener">WallStreetMojo</a> — ví dụ tính toán forward, futures, options, swaps</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.optionsprofitcalculator.com/" target="_blank" rel="noopener">Options Profit Calculator</a> — vẽ biểu đồ payoff/lãi lỗ cho mọi chiến lược quyền chọn</li>
<li><a href="https://www.cboe.com/education/tools/" target="_blank" rel="noopener">Công cụ giáo dục của Cboe</a> — máy tính kiến thức nền quyền chọn</li>
<li><a href="https://www.hnx.vn" target="_blank" rel="noopener">HNX (Sở GDCK Hà Nội)</a> — nơi niêm yết hợp đồng tương lai VN30 &amp; trái phiếu chính phủ tại Việt Nam</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — phái sinh là gì, bốn nhóm công cụ, payoff forward/futures, payoff quyền chọn (call/put).</li>
<li><strong>Luyện tập</strong> — tính giá futures hợp lý (cost-of-carry) và payoff/lãi lỗ quyền chọn với vài con số giả định đến khi thành thục.</li>
<li><strong>Đào sâu</strong> — chiến lược quyền chọn (spread, straddle), trực giác định giá nhị thức &amp; Black-Scholes, hoán đổi.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc thông số hợp đồng futures/option thật (CME hoặc HNX), hiểu cách phái sinh dùng để phòng ngừa rủi ro vs. đầu cơ.</li>
</ol></div>`,
  ]]);

const intro = doc('fin402-0-1-overview', 'Course overview: Derivatives|||Tổng quan: Công cụ tài chính phái sinh',
  'Derivative là gì; 4 nhóm công cụ (forward, futures, option, swap); 3 vai trò (hedging/speculation/arbitrage); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">FIN402 · Lesson 0.1 · Overview</span>
<h2>Derivatives</h2>
<p class="lead">A <strong>derivative</strong> is a financial contract whose value is <em>derived from</em> the price of something else — the <strong>underlying asset</strong> (a stock, a bond, a currency, an interest rate, a commodity, an index). You rarely buy the underlying itself; you buy exposure to its future price.</p>
<h3>Four instrument families</h3>
<ul>
<li><strong>Forwards</strong> — customized, over-the-counter (OTC) agreement to trade at a future date.</li>
<li><strong>Futures</strong> — the exchange-traded, standardized cousin of a forward.</li>
<li><strong>Options</strong> — the right, but not the obligation, to buy or sell.</li>
<li><strong>Swaps</strong> — an agreement to exchange cash flows (e.g. fixed rate for floating rate).</li>
</ul>
<h3>Three roles</h3>
<ul>
<li><strong>Hedging</strong> — reduce an existing risk (e.g. an exporter locks in an exchange rate).</li>
<li><strong>Speculation</strong> — take on risk to bet on a price direction.</li>
<li><strong>Arbitrage</strong> — lock in a riskless profit from a price mismatch between markets.</li>
</ul>
<h3>Roadmap</h3>
<p>Market overview &amp; role → forwards &amp; futures → futures pricing &amp; hedging → option basics &amp; payoff → option strategies → option pricing (binomial, Black-Scholes) → swaps → risk management &amp; the Vietnam derivatives market (HNX).</p>`,
    `<span class="eyebrow">FIN402 · Bài 0.1 · Tổng quan</span>
<h2>Công cụ tài chính phái sinh</h2>
<p class="lead">Một <strong>công cụ phái sinh (derivative)</strong> là hợp đồng tài chính có giá trị <em>bắt nguồn từ</em> giá của một thứ khác — <strong>tài sản cơ sở (underlying asset)</strong> (cổ phiếu, trái phiếu, ngoại tệ, lãi suất, hàng hoá, chỉ số). Bạn hiếm khi mua chính tài sản cơ sở; bạn mua sự phơi nhiễm với giá tương lai của nó.</p>
<h3>Bốn nhóm công cụ</h3>
<ul>
<li><strong>Hợp đồng kỳ hạn (forward)</strong> — thoả thuận tuỳ chỉnh, phi tập trung (OTC) để giao dịch tại một ngày tương lai.</li>
<li><strong>Hợp đồng tương lai (futures)</strong> — phiên bản chuẩn hoá, niêm yết trên sàn của forward.</li>
<li><strong>Quyền chọn (options)</strong> — quyền, không phải nghĩa vụ, được mua hoặc bán.</li>
<li><strong>Hoán đổi (swaps)</strong> — thoả thuận trao đổi các luồng tiền (vd lãi suất cố định đổi lấy lãi suất thả nổi).</li>
</ul>
<h3>Ba vai trò</h3>
<ul>
<li><strong>Phòng ngừa rủi ro (hedging)</strong> — giảm một rủi ro đang có (vd nhà xuất khẩu chốt trước tỷ giá).</li>
<li><strong>Đầu cơ (speculation)</strong> — nhận rủi ro để đặt cược vào chiều giá.</li>
<li><strong>Kinh doanh chênh lệch giá (arbitrage)</strong> — chốt lợi nhuận không rủi ro từ sự lệch giá giữa các thị trường.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan thị trường &amp; vai trò → forward &amp; futures → định giá futures &amp; hedging → quyền chọn cơ bản &amp; payoff → chiến lược quyền chọn → định giá quyền chọn (nhị thức, Black-Scholes) → hoán đổi → quản trị rủi ro &amp; thị trường phái sinh Việt Nam (HNX).</p>`,
  ]]);

const c1 = doc('fin402-1-1-market-overview', '1.1 — Derivatives markets & their role|||1.1 — Tổng quan thị trường phái sinh & vai trò',
  'Derivative là gì; thị trường OTC vs sàn giao dịch; 3 vai trò (hedging/speculation/arbitrage); ví dụ minh hoạ.',
  [[
    `<span class="eyebrow">FIN402 · Chapter 1 · Lesson 1.1</span>
<h2>Derivatives markets &amp; their role</h2>
<h3>OTC vs. exchange-traded</h3>
<ul>
<li><strong>OTC (over-the-counter)</strong> — two parties negotiate directly (typical for forwards, swaps). Flexible, but carries <strong>counterparty risk</strong> — the other side may default.</li>
<li><strong>Exchange-traded</strong> — standardized contracts (typical for futures, listed options) traded on an exchange with a <strong>clearing house</strong> as counterparty to every trade, which removes most counterparty risk.</li>
</ul>
<h3>Why derivatives exist — three roles</h3>
<pre><code>Hedging     -> reduce an existing exposure (airline buys oil futures
               so fuel cost does not spike unexpectedly)
Speculation -> take a directional bet with leverage (small margin
               controls a large notional position)
Arbitrage   -> exploit a price gap between two markets risk-free
               (buy cheap in market A, sell dear in market B)
</code></pre>
<h3>Worked example (assumed numbers)</h3>
<pre><code>A coffee exporter expects to sell 10,000 kg of coffee in 3 months.
Today's spot price: 50,000 VND/kg. Total exposure: 500,000,000 VND.
If price falls 10% -> revenue falls by 50,000,000 VND.
Selling a forward locks TODAY'S price for the 3-month delivery,
removing that 50,000,000 VND downside (this is hedging).
</code></pre>
<div class="callout"><span class="badge">Same tool, opposite intent</span> The identical futures contract can be a hedge for one party (an exporter reducing risk) and speculation for the other (a trader betting on price direction). The instrument is neutral — the intent behind the position is what defines its role.</div>`,
    `<span class="eyebrow">FIN402 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan thị trường phái sinh &amp; vai trò</h2>
<h3>OTC vs. sàn giao dịch</h3>
<ul>
<li><strong>OTC (phi tập trung)</strong> — hai bên thoả thuận trực tiếp (thường gặp ở forward, swap). Linh hoạt, nhưng mang <strong>rủi ro đối tác (counterparty risk)</strong> — bên kia có thể mất khả năng thanh toán.</li>
<li><strong>Niêm yết trên sàn</strong> — hợp đồng chuẩn hoá (thường gặp ở futures, option niêm yết) giao dịch qua sàn với <strong>trung tâm thanh toán (clearing house)</strong> đứng ra làm đối tác cho mọi giao dịch, loại bỏ phần lớn rủi ro đối tác.</li>
</ul>
<h3>Vì sao phái sinh tồn tại — ba vai trò</h3>
<pre><code>Phòng ngừa rủi ro -> giảm một phơi nhiễm đang có (hãng bay mua
                      futures dầu để chi phí xăng dầu không tăng vọt
                      bất ngờ)
Đầu cơ            -> đặt cược theo chiều giá với đòn bẩy (ký quỹ
                      nhỏ kiểm soát vị thế danh nghĩa lớn)
Arbitrage         -> khai thác chênh lệch giá giữa hai thị trường
                      mà không chịu rủi ro (mua rẻ ở thị trường A,
                      bán đắt ở thị trường B)
</code></pre>
<h3>Ví dụ tính toán (số giả định)</h3>
<pre><code>Một nhà xuất khẩu cà phê dự kiến bán 10.000 kg cà phê trong 3 tháng.
Giá giao ngay hôm nay: 50.000 VND/kg. Tổng giá trị: 500.000.000 VND.
Nếu giá giảm 10% -> doanh thu giảm 50.000.000 VND.
Bán một hợp đồng kỳ hạn chốt giá HÔM NAY cho lần giao hàng 3 tháng
tới, loại bỏ khoản rủi ro giảm 50.000.000 VND đó (đây là hedging).
</code></pre>
<div class="callout"><span class="badge">Cùng công cụ, mục đích khác nhau</span> Cùng một hợp đồng futures có thể là hedging cho bên này (nhà xuất khẩu giảm rủi ro) và đầu cơ cho bên kia (nhà giao dịch cược vào chiều giá). Công cụ trung tính — mục đích đằng sau vị thế mới quyết định vai trò của nó.</div>`,
  ]]);

const c1q = quiz('fin402-quiz-1', 'Quiz 1 — Market overview & role|||Quiz 1 — Tổng quan thị trường & vai trò', [
  { id: 'q1', question: 'Giá trị của một công cụ phái sinh được xác định như thế nào?', options: ['Cố định theo hợp đồng, không đổi', 'Bắt nguồn từ giá của một tài sản cơ sở', 'Do ngân hàng trung ương quy định', 'Bằng giá vốn phát hành cộng lãi'], correctIndex: 1, explanation: 'Derivative "derived from" giá tài sản cơ sở (cổ phiếu, lãi suất, hàng hoá...).' },
  { id: 'q2', question: 'Điểm khác biệt chính giữa hợp đồng OTC và hợp đồng niêm yết trên sàn là gì?', options: ['OTC luôn rẻ hơn', 'Hợp đồng sàn chuẩn hoá và có trung tâm thanh toán giảm rủi ro đối tác', 'OTC không dùng được cho hedging', 'Sàn giao dịch không cho phép đầu cơ'], correctIndex: 1, explanation: 'Sàn giao dịch chuẩn hoá hợp đồng + clearing house đứng giữa mọi giao dịch, giảm rủi ro đối tác so với OTC.' },
  { id: 'q3', question: 'Một hãng bay mua futures dầu để chi phí nhiên liệu không tăng vọt bất ngờ — đây là vai trò gì?', options: ['Arbitrage', 'Đầu cơ (speculation)', 'Phòng ngừa rủi ro (hedging)', 'Phát hành trái phiếu'], correctIndex: 2, explanation: 'Hãng bay đang GIẢM một rủi ro đang có (chi phí nhiên liệu) — đó là hedging, dù công cụ dùng là futures.' },
]);

const c2 = doc('fin402-2-1-forwards-futures', '2.1 — Forward & futures contracts|||2.1 — Hợp đồng kỳ hạn & tương lai',
  'Forward (OTC, tuỳ chỉnh, rủi ro đối tác) vs futures (sàn, chuẩn hoá, mark-to-market, ký quỹ); payoff long/short; ví dụ số.',
  [[
    `<span class="eyebrow">FIN402 · Chapter 2 · Lesson 2.1</span>
<h2>Forward &amp; futures contracts</h2>
<h3>Same idea, different plumbing</h3>
<p>Both a <strong>forward</strong> and a <strong>futures</strong> contract are an agreement to buy/sell an asset at a fixed price (<strong>F</strong>, the forward/futures price) on a future date (<strong>T</strong>, maturity). The difference is in how they are run:</p>
<pre><code>              Forward              Futures
Where         OTC, private deal    Exchange-listed
Terms         Customized           Standardized (size, date, asset)
Settlement    Once, at maturity    Daily "mark-to-market"
Counterparty  The other party      Clearing house (for everyone)
Margin        Usually none         Initial margin + daily variation
Default risk  Higher               Much lower
</code></pre>
<h3>Payoff at maturity (per unit of the underlying)</h3>
<pre><code>Long  (agreed to BUY at F):  Payoff = S_T - F
Short (agreed to SELL at F): Payoff = F - S_T

S_T = spot price of the underlying at maturity T
F   = forward/futures price locked in today
</code></pre>
<h3>Worked example (assumed numbers)</h3>
<pre><code>An importer takes a LONG position on a USD/VND forward:
F = 25,000 VND/USD, notional = 100,000 USD, T = 3 months.

Case A: spot at maturity S_T = 25,800 VND/USD (USD got more expensive)
Payoff = (25,800 - 25,000) x 100,000 = 80,000,000 VND gain
-> the forward offset the higher cost of buying USD on the open market.

Case B: S_T = 24,500 VND/USD (USD got cheaper)
Payoff = (24,500 - 25,000) x 100,000 = -50,000,000 VND loss
-> the importer still had to honor F = 25,000, missing the cheaper rate.
</code></pre>
<div class="callout"><span class="badge">Symmetric obligation</span> Unlike an option (next chapter), BOTH sides of a forward/futures are obligated to transact — the payoff can be positive or negative for either side. There is no "walking away."</div>`,
    `<span class="eyebrow">FIN402 · Chương 2 · Bài 2.1</span>
<h2>Hợp đồng kỳ hạn &amp; tương lai</h2>
<h3>Cùng ý tưởng, khác "bộ máy"</h3>
<p>Cả <strong>hợp đồng kỳ hạn (forward)</strong> và <strong>hợp đồng tương lai (futures)</strong> đều là thoả thuận mua/bán một tài sản tại một giá cố định (<strong>F</strong>, giá kỳ hạn/tương lai) vào một ngày tương lai (<strong>T</strong>, ngày đáo hạn). Khác nhau ở cách vận hành:</p>
<pre><code>              Kỳ hạn (Forward)     Tương lai (Futures)
Nơi giao dịch OTC, thoả thuận riêng  Niêm yết trên sàn
Điều khoản    Tuỳ chỉnh              Chuẩn hoá (khối lượng, ngày,
                                     tài sản)
Thanh toán    Một lần, khi đáo hạn   "Mark-to-market" mỗi ngày
Đối tác       Chính bên còn lại      Trung tâm thanh toán (cho mọi
                                     bên)
Ký quỹ        Thường không có        Ký quỹ ban đầu + biến động
                                     hàng ngày
Rủi ro vỡ nợ  Cao hơn                Thấp hơn nhiều
</code></pre>
<h3>Payoff khi đáo hạn (trên mỗi đơn vị tài sản cơ sở)</h3>
<pre><code>Long  (đã đồng ý MUA tại F): Payoff = S_T - F
Short (đã đồng ý BÁN tại F): Payoff = F - S_T

S_T = giá giao ngay của tài sản cơ sở tại thời điểm đáo hạn T
F   = giá kỳ hạn/tương lai đã chốt từ hôm nay
</code></pre>
<h3>Ví dụ tính toán (số giả định)</h3>
<pre><code>Một nhà nhập khẩu giữ vị thế LONG hợp đồng kỳ hạn USD/VND:
F = 25.000 VND/USD, giá trị danh nghĩa = 100.000 USD, T = 3 tháng.

Trường hợp A: giá giao ngay lúc đáo hạn S_T = 25.800 VND/USD (USD
tăng giá)
Payoff = (25.800 - 25.000) x 100.000 = lãi 80.000.000 VND
-> hợp đồng kỳ hạn bù đắp chi phí mua USD cao hơn trên thị trường mở.

Trường hợp B: S_T = 24.500 VND/USD (USD giảm giá)
Payoff = (24.500 - 25.000) x 100.000 = lỗ 50.000.000 VND
-> nhà nhập khẩu vẫn phải tuân theo F = 25.000, bỏ lỡ mức giá rẻ hơn.
</code></pre>
<div class="callout"><span class="badge">Nghĩa vụ đối xứng</span> Khác với quyền chọn (chương sau), CẢ HAI bên của forward/futures đều có nghĩa vụ giao dịch — payoff có thể dương hoặc âm cho bất kỳ bên nào. Không có chuyện "bỏ ngang".</div>`,
  ]]);

const c2q = quiz('fin402-quiz-2', 'Quiz 2 — Forward & futures|||Quiz 2 — Kỳ hạn & tương lai', [
  { id: 'q1', question: 'Điểm khác biệt lớn nhất giữa forward và futures về mặt thanh toán là gì?', options: ['Forward thanh toán hàng ngày, futures thanh toán một lần', 'Futures thanh toán "mark-to-market" hàng ngày, forward thanh toán một lần khi đáo hạn', 'Cả hai đều thanh toán hàng ngày', 'Không có khác biệt nào'], correctIndex: 1, explanation: 'Futures mark-to-market mỗi ngày qua clearing house; forward chỉ thanh toán một lần lúc đáo hạn.' },
  { id: 'q2', question: 'Payoff của bên giữ vị thế LONG một hợp đồng kỳ hạn tại đáo hạn là?', options: ['F - S_T', 'S_T - F', 'S_T x F', 'F / S_T'], correctIndex: 1, explanation: 'Long đồng ý MUA tại F, nên lãi khi giá S_T cao hơn F: Payoff = S_T - F.' },
  { id: 'q3', question: 'Vì sao rủi ro vỡ nợ (default risk) của futures thấp hơn forward?', options: ['Futures không có giá trị', 'Futures có clearing house làm đối tác trung gian cho mọi giao dịch', 'Futures không đáo hạn', 'Futures chỉ dùng cho cổ phiếu'], correctIndex: 1, explanation: 'Clearing house đứng giữa mọi bên và yêu cầu ký quỹ, giảm mạnh rủi ro đối tác so với thoả thuận OTC trực tiếp.' },
]);

const c3 = doc('fin402-3-1-pricing-hedging', '3.1 — Futures pricing & hedging|||3.1 — Định giá futures & phòng ngừa rủi ro',
  'Mô hình cost-of-carry định giá futures hợp lý; hedge dài/ngắn; hệ số hedge; ví dụ tính toán.',
  [[
    `<span class="eyebrow">FIN402 · Chapter 3 · Lesson 3.1</span>
<h2>Futures pricing &amp; hedging</h2>
<h3>The cost-of-carry model</h3>
<p>If a futures price strays from its "fair" value, an arbitrageur can lock in a riskless profit — so in a frictionless market, the futures price is pinned down by the cost of "carrying" the asset to maturity:</p>
<pre><code>F = S x (1 + r) ^ T          (simple annual compounding)
F = S x e ^ (r x T)          (continuous compounding)

F = fair futures price today
S = spot price today
r = risk-free interest rate (annualized)
T = time to maturity, in years
</code></pre>
<h3>Worked example (assumed numbers)</h3>
<pre><code>Spot gold S = 2,000 USD/oz. Risk-free rate r = 5%/year. T = 0.5 year.

F = 2,000 x (1 + 0.05) ^ 0.5 = 2,000 x 1.0247 = 2,049.4 USD/oz

If the exchange quotes gold futures at 2,100 -> it is OVERPRICED:
sell the futures, borrow money to buy spot gold, hold it, deliver at
maturity -> a riskless profit (arbitrage), which pushes the futures
price back down toward 2,049.4.
</code></pre>
<h3>Hedging with futures</h3>
<ul>
<li><strong>Short hedge</strong> — you own (or will produce) the asset and are worried its price will FALL, so you SELL futures now (e.g. a farmer hedging next season's rice).</li>
<li><strong>Long hedge</strong> — you will need to BUY the asset later and are worried its price will RISE, so you BUY futures now (e.g. an airline hedging jet fuel).</li>
</ul>
<pre><code>Hedge ratio (simple case) = Size of position to protect / Contract size

Example: an airline needs to hedge 1,000,000 liters of jet fuel;
one futures contract covers 42,000 liters.
Number of contracts = 1,000,000 / 42,000 = ~23.8 -> round to 24
</code></pre>
<div class="callout"><span class="badge">A hedge is not free</span> A perfect hedge removes the downside AND the upside — if price moves favorably, the hedge gives that gain back. The airline that hedged fuel is protected from a spike, but also does not benefit if fuel gets cheaper.</div>`,
    `<span class="eyebrow">FIN402 · Chương 3 · Bài 3.1</span>
<h2>Định giá futures &amp; phòng ngừa rủi ro</h2>
<h3>Mô hình cost-of-carry</h3>
<p>Nếu giá futures lệch khỏi giá "hợp lý", nhà kinh doanh chênh lệch giá (arbitrageur) có thể chốt lợi nhuận không rủi ro — nên trong một thị trường không có ma sát, giá futures bị "neo" bởi chi phí "mang" tài sản tới ngày đáo hạn:</p>
<pre><code>F = S x (1 + r) ^ T          (lãi kép đơn giản theo năm)
F = S x e ^ (r x T)          (lãi kép liên tục)

F = giá futures hợp lý hôm nay
S = giá giao ngay hôm nay
r = lãi suất không rủi ro (theo năm)
T = thời gian tới đáo hạn, tính bằng năm
</code></pre>
<h3>Ví dụ tính toán (số giả định)</h3>
<pre><code>Giá vàng giao ngay S = 2.000 USD/oz. Lãi suất không rủi ro r = 5%/năm.
T = 0,5 năm.

F = 2.000 x (1 + 0,05) ^ 0,5 = 2.000 x 1,0247 = 2.049,4 USD/oz

Nếu sàn niêm yết futures vàng ở mức 2.100 -> giá đó BỊ ĐỊNH GIÁ CAO:
bán futures, vay tiền mua vàng giao ngay, giữ đến đáo hạn để giao
hàng -> lợi nhuận không rủi ro (arbitrage), việc này kéo giá futures
trở lại gần 2.049,4.
</code></pre>
<h3>Phòng ngừa rủi ro (hedging) bằng futures</h3>
<ul>
<li><strong>Short hedge</strong> — bạn đang giữ (hoặc sẽ sản xuất ra) tài sản và lo giá sẽ GIẢM, nên BÁN futures ngay từ bây giờ (vd nông dân hedge vụ lúa sắp thu hoạch).</li>
<li><strong>Long hedge</strong> — bạn sẽ cần MUA tài sản trong tương lai và lo giá sẽ TĂNG, nên MUA futures ngay từ bây giờ (vd hãng bay hedge nhiên liệu).</li>
</ul>
<pre><code>Hệ số hedge (trường hợp đơn giản) = Quy mô vị thế cần bảo hiểm /
                                     Quy mô một hợp đồng

Ví dụ: một hãng bay cần hedge 1.000.000 lít nhiên liệu phản lực;
một hợp đồng futures bao 42.000 lít.
Số hợp đồng = 1.000.000 / 42.000 = ~23,8 -> làm tròn thành 24
</code></pre>
<div class="callout"><span class="badge">Hedge không miễn phí</span> Một hedge hoàn hảo loại bỏ cả rủi ro giảm VÀ cơ hội tăng — nếu giá đi theo chiều thuận lợi, hedge sẽ "trả lại" khoản lãi đó. Hãng bay hedge nhiên liệu được bảo vệ khi giá tăng vọt, nhưng cũng không hưởng lợi nếu nhiên liệu rẻ đi.</div>`,
  ]]);

const c3q = quiz('fin402-quiz-3', 'Quiz 3 — Pricing & hedging|||Quiz 3 — Định giá & phòng ngừa rủi ro', [
  { id: 'q1', question: 'Theo mô hình cost-of-carry, giá futures hợp lý F phụ thuộc vào?', options: ['Chỉ vào tâm lý nhà đầu tư', 'Giá giao ngay S, lãi suất r, và thời gian tới đáo hạn T', 'Chỉ vào khối lượng giao dịch', 'Số hợp đồng đang mở (open interest)'], correctIndex: 1, explanation: 'F = S x (1+r)^T — giá futures hợp lý được neo bởi chi phí "mang" tài sản (S, r, T).' },
  { id: 'q2', question: 'Một nông dân lo giá lúa sẽ GIẢM vào lúc thu hoạch nên nên làm gì để hedge?', options: ['Mua futures lúa', 'Bán futures lúa (short hedge)', 'Không làm gì', 'Mua quyền chọn mua cổ phiếu'], correctIndex: 1, explanation: 'Nông dân đang giữ/sẽ có tài sản và lo giá giảm -> bán futures trước (short hedge) để chốt giá.' },
  { id: 'q3', question: 'Vì sao futures vàng niêm yết CAO hơn giá hợp lý theo cost-of-carry sẽ tự điều chỉnh giảm?', options: ['Sàn giao dịch tự sửa giá theo lệnh hành chính', 'Arbitrageur bán futures + mua giao ngay để chốt lời không rủi ro, đẩy giá futures xuống', 'Giá vàng giao ngay sẽ tự tăng lên bằng futures', 'Không có cơ chế nào, giá cứ neo mãi ở đó'], correctIndex: 1, explanation: 'Chênh lệch giá tạo cơ hội arbitrage; hành động khai thác chênh lệch đó kéo futures về gần giá hợp lý.' },
]);

const c4 = doc('fin402-4-1-options-payoff', '4.1 — Options basics & payoff|||4.1 — Quyền chọn cơ bản & payoff',
  'Call/Put, mua/bán quyền chọn, phí quyền chọn (premium), payoff tại đáo hạn, điểm hoà vốn; sơ đồ payoff.',
  [[
    `<span class="eyebrow">FIN402 · Chapter 4 · Lesson 4.1</span>
<h2>Options basics &amp; payoff</h2>
<h3>The right, not the obligation</h3>
<ul>
<li><strong>Call option</strong> — the right to BUY the underlying at a fixed <strong>strike price (K)</strong> on/before maturity.</li>
<li><strong>Put option</strong> — the right to SELL the underlying at strike K.</li>
<li>The buyer pays a <strong>premium</strong> upfront for that right; the seller ("writer") receives the premium and takes on the obligation.</li>
</ul>
<h3>Payoff at maturity (before subtracting the premium)</h3>
<pre><code>Call buyer payoff = max(S_T - K, 0)
Put  buyer payoff = max(K - S_T, 0)

The seller's payoff is always the mirror image (negative of the
buyer's payoff), since one side's gain is the other side's loss.
</code></pre>
<h3>Worked example (assumed numbers)</h3>
<pre><code>Call option: K = 100,000 VND, premium paid = 5,000 VND/share.

If S_T = 120,000: payoff = max(120,000-100,000, 0) = 20,000
                  profit = 20,000 - 5,000 = 15,000 VND/share
If S_T = 95,000:  payoff = max(95,000-100,000, 0)  = 0
                  profit = 0 - 5,000 = -5,000 VND/share (lose only
                  the premium, never more)
Breakeven: S_T = K + premium = 105,000 VND
</code></pre>
<h3>Payoff diagram (call buyer)</h3>
<pre><code>Profit
   |                              /
   |                            /
 0 |------K----------------- /------- S_T
   |          \\___________/
-premium       flat below K (option expires worthless)
</code></pre>
<div class="callout"><span class="badge">Asymmetric risk</span> An option buyer's loss is CAPPED at the premium paid, but the gain is unbounded (call) or bounded by K (put) — the exact opposite of a forward/futures, where both sides carry unlimited symmetric risk.</div>`,
    `<span class="eyebrow">FIN402 · Chương 4 · Bài 4.1</span>
<h2>Quyền chọn cơ bản &amp; payoff</h2>
<h3>Quyền, không phải nghĩa vụ</h3>
<ul>
<li><strong>Quyền chọn mua (call)</strong> — quyền được MUA tài sản cơ sở tại một <strong>giá thực hiện (strike price, K)</strong> cố định vào/trước ngày đáo hạn.</li>
<li><strong>Quyền chọn bán (put)</strong> — quyền được BÁN tài sản cơ sở tại giá thực hiện K.</li>
<li>Người mua trả trước một <strong>phí quyền chọn (premium)</strong> để có quyền đó; người bán ("writer") nhận phí và nhận nghĩa vụ.</li>
</ul>
<h3>Payoff tại đáo hạn (trước khi trừ phí quyền chọn)</h3>
<pre><code>Payoff người mua call = max(S_T - K, 0)
Payoff người mua put  = max(K - S_T, 0)

Payoff của người bán luôn là hình ảnh đối xứng (âm của payoff người
mua), vì lãi của một bên là lỗ của bên kia.
</code></pre>
<h3>Ví dụ tính toán (số giả định)</h3>
<pre><code>Quyền chọn mua: K = 100.000 VND, phí đã trả = 5.000 VND/cổ phiếu.

Nếu S_T = 120.000: payoff = max(120.000-100.000, 0) = 20.000
                   lãi = 20.000 - 5.000 = 15.000 VND/cổ phiếu
Nếu S_T = 95.000:  payoff = max(95.000-100.000, 0)  = 0
                   lãi = 0 - 5.000 = lỗ 5.000 VND/cổ phiếu (chỉ mất
                   đúng phí quyền chọn, không mất hơn)
Điểm hoà vốn: S_T = K + phí = 105.000 VND
</code></pre>
<h3>Sơ đồ payoff (người mua call)</h3>
<pre><code>Lợi nhuận
   |                              /
   |                            /
 0 |------K----------------- /------- S_T
   |          \\___________/
-phí          nằm ngang dưới K (quyền chọn hết hạn, không có giá trị)
</code></pre>
<div class="callout"><span class="badge">Rủi ro bất đối xứng</span> Lỗ của người mua quyền chọn bị GIỚI HẠN ở mức phí đã trả, nhưng lãi thì không giới hạn (call) hoặc giới hạn bởi K (put) — ngược hoàn toàn với forward/futures, nơi cả hai bên chịu rủi ro đối xứng không giới hạn.</div>`,
  ]]);

const c4q = quiz('fin402-quiz-4', 'Quiz 4 — Options & payoff|||Quiz 4 — Quyền chọn & payoff', [
  { id: 'q1', question: 'Payoff của người mua quyền chọn mua (call) tại đáo hạn là?', options: ['max(K - S_T, 0)', 'max(S_T - K, 0)', 'S_T - K (luôn dương)', 'K - S_T (luôn dương)'], correctIndex: 1, explanation: 'Call cho quyền MUA tại K, nên chỉ có giá trị khi S_T > K: payoff = max(S_T - K, 0).' },
  { id: 'q2', question: 'Khoản lỗ tối đa của người MUA một quyền chọn là?', options: ['Không giới hạn', 'Bằng đúng phí quyền chọn (premium) đã trả', 'Bằng giá thực hiện K', 'Bằng giá tài sản cơ sở S_T'], correctIndex: 1, explanation: 'Người mua quyền chọn có thể không thực hiện quyền, nên lỗ tối đa chỉ là phí đã trả — đây là rủi ro bất đối xứng đặc trưng của option.' },
  { id: 'q3', question: 'Điểm hoà vốn (breakeven) của người mua call với K=100.000 và phí=5.000 là?', options: ['95.000', '100.000', '105.000', '110.000'], correctIndex: 2, explanation: 'Breakeven = K + phí = 100.000 + 5.000 = 105.000 — tại đó payoff vừa đủ bù phí đã trả.' },
]);

const c5 = doc('fin402-5-1-option-strategies', '5.1 — Option strategies (spreads, straddles)|||5.1 — Chiến lược quyền chọn (spread, straddle)',
  'Bull call spread, bear put spread, straddle, strangle, covered call, protective put; khi nào dùng chiến lược nào.',
  [[
    `<span class="eyebrow">FIN402 · Chapter 5 · Lesson 5.1</span>
<h2>Option strategies</h2>
<h3>Spreads — bet on direction, cap both sides</h3>
<pre><code>Bull call spread: BUY call at low strike K1, SELL call at higher K2
  (same maturity). Cheaper than a plain call (premium received from
  the sold call offsets part of the cost), but the maximum gain is
  capped at (K2 - K1) - net premium paid. Used when you expect a
  MODEST rise, not an explosive one.

Bear put spread: BUY put at high strike K1, SELL put at lower K2.
  Mirror image, for a modest expected FALL.
</code></pre>
<h3>Straddle &amp; strangle — bet on volatility, not direction</h3>
<pre><code>Long straddle:  BUY a call AND a put, SAME strike K, same maturity.
  Profits if S_T moves FAR from K in EITHER direction (e.g. before an
  earnings announcement) — loses if the price stays flat.

Long strangle:  BUY a call at K2 (K2 > K1) AND a put at K1.
  Same idea as a straddle but cheaper (both options are further
  out-of-the-money), needing an even BIGGER move to profit.
</code></pre>
<h3>Combining options with the underlying</h3>
<pre><code>Covered call:    own the stock + SELL a call against it. Gives up
                 upside above K in exchange for premium income —
                 used by holders who expect the stock to stay flat.
Protective put:  own the stock + BUY a put. Insurance against a
                 crash, paid for with the put premium.
</code></pre>
<h3>Worked example (assumed numbers) — bull call spread</h3>
<pre><code>Buy call K1=100,000 for 8,000; sell call K2=120,000 for 3,000.
Net premium paid = 8,000 - 3,000 = 5,000.

If S_T = 130,000: payoff = (130,000-100,000) - (130,000-120,000)
                         = 30,000 - 10,000 = 20,000
                  profit = 20,000 - 5,000 = 15,000 (capped: max
                  possible is (K2-K1) - net premium = 20,000-5,000
                  = 15,000, matches)
If S_T = 95,000:  both options expire worthless -> profit = -5,000
                  (loss capped at the net premium paid)
</code></pre>
<div class="callout"><span class="badge">Strategy = view + risk appetite</span> Every option strategy is a trade-off: giving up some upside (spreads, covered call) or paying a premium (straddle, protective put) in exchange for a cheaper or safer position that matches a specific market view.</div>`,
    `<span class="eyebrow">FIN402 · Chương 5 · Bài 5.1</span>
<h2>Chiến lược quyền chọn</h2>
<h3>Spread — cược theo chiều, giới hạn cả hai phía</h3>
<pre><code>Bull call spread: MUA call ở strike thấp K1, BÁN call ở strike cao
  K2 hơn (cùng ngày đáo hạn). Rẻ hơn một call thường (phí nhận từ
  call bán ra bù một phần chi phí), nhưng lãi tối đa bị giới hạn ở
  mức (K2 - K1) - phí thuần đã trả. Dùng khi kỳ vọng giá tăng VỪA
  PHẢI, không phải bùng nổ.

Bear put spread: MUA put ở strike cao K1, BÁN put ở strike thấp K2.
  Hình ảnh đối xứng, dùng khi kỳ vọng giá giảm vừa phải.
</code></pre>
<h3>Straddle &amp; strangle — cược vào biến động, không phải chiều</h3>
<pre><code>Long straddle: MUA một call VÀ một put, CÙNG strike K, cùng ngày
  đáo hạn. Lãi nếu S_T di chuyển XA khỏi K theo BẤT KỲ chiều nào (vd
  trước một công bố kết quả kinh doanh) — lỗ nếu giá đứng yên.

Long strangle: MUA call ở K2 (K2 > K1) VÀ put ở K1.
  Cùng ý tưởng với straddle nhưng rẻ hơn (cả hai option đều xa tiền
  hơn), cần biến động LỚN hơn nữa mới có lãi.
</code></pre>
<h3>Kết hợp quyền chọn với tài sản cơ sở</h3>
<pre><code>Covered call:    giữ cổ phiếu + BÁN một call trên nó. Đánh đổi phần
                 tăng giá trên K để lấy phí quyền chọn — dùng khi
                 kỳ vọng cổ phiếu đứng yên.
Protective put:  giữ cổ phiếu + MUA một put. Bảo hiểm chống sập giá,
                 trả bằng phí quyền chọn put.
</code></pre>
<h3>Ví dụ tính toán (số giả định) — bull call spread</h3>
<pre><code>Mua call K1=100.000 giá 8.000; bán call K2=120.000 giá 3.000.
Phí thuần đã trả = 8.000 - 3.000 = 5.000.

Nếu S_T = 130.000: payoff = (130.000-100.000) - (130.000-120.000)
                          = 30.000 - 10.000 = 20.000
                   lãi = 20.000 - 5.000 = 15.000 (đã chạm mức tối đa:
                   (K2-K1) - phí thuần = 20.000-5.000 = 15.000, khớp)
Nếu S_T = 95.000:  cả hai option hết hạn không giá trị -> lãi = -5.000
                   (lỗ tối đa bằng đúng phí thuần đã trả)
</code></pre>
<div class="callout"><span class="badge">Chiến lược = quan điểm + mức chấp nhận rủi ro</span> Mọi chiến lược quyền chọn là một sự đánh đổi: bỏ một phần lãi (spread, covered call) hoặc trả phí (straddle, protective put) để đổi lấy một vị thế rẻ hơn hoặc an toàn hơn, khớp với một quan điểm thị trường cụ thể.</div>`,
  ]]);

const c5q = quiz('fin402-quiz-5', 'Quiz 5 — Option strategies|||Quiz 5 — Chiến lược quyền chọn', [
  { id: 'q1', question: 'Bull call spread được xây bằng cách nào?', options: ['Mua call K1 thấp, bán call K2 cao hơn', 'Mua put K1 cao, bán put K2 thấp hơn', 'Mua cả call và put cùng strike', 'Chỉ mua một call duy nhất'], correctIndex: 0, explanation: 'Bull call spread = mua call strike thấp + bán call strike cao hơn, cùng đáo hạn, để giảm chi phí và giới hạn lãi tối đa.' },
  { id: 'q2', question: 'Long straddle có lãi khi nào?', options: ['Chỉ khi giá tăng mạnh', 'Chỉ khi giá giảm mạnh', 'Khi giá di chuyển XA khỏi strike theo BẤT KỲ chiều nào', 'Khi giá đứng yên đúng tại strike'], correctIndex: 2, explanation: 'Straddle mua cả call và put cùng strike — cược vào biến động lớn, không quan tâm chiều tăng hay giảm.' },
  { id: 'q3', question: 'Covered call (giữ cổ phiếu + bán call) đánh đổi điều gì?', options: ['Không đánh đổi gì, chỉ có lợi', 'Nhận phí quyền chọn, đổi lại từ bỏ phần tăng giá trên strike', 'Mất toàn bộ cổ phiếu nếu giá giảm', 'Không thể dùng khi kỳ vọng giá đứng yên'], correctIndex: 1, explanation: 'Bán call trên cổ phiếu đang giữ thu về phí, nhưng nếu giá vượt strike, phần lãi vượt đó thuộc về người mua call.' },
]);

const c6 = doc('fin402-6-1-option-pricing', '6.1 — Option pricing: binomial & Black-Scholes|||6.1 — Định giá quyền chọn: nhị thức & Black-Scholes',
  'Mô hình nhị thức một bước (risk-neutral); công thức Black-Scholes; put-call parity; ý nghĩa của delta.',
  [[
    `<span class="eyebrow">FIN402 · Chapter 6 · Lesson 6.1</span>
<h2>Option pricing: binomial &amp; Black-Scholes</h2>
<h3>The one-step binomial model</h3>
<p>The simplest way to see WHY options can be priced without knowing the "true" probability of the stock going up or down: build a portfolio of the stock + a risk-free bond that replicates the option's payoff exactly, then the option must cost the same as that portfolio (no-arbitrage).</p>
<pre><code>Stock today S = 100. In one period it goes UP to Su=120 or DOWN to
Sd=90. Risk-free rate r = 0% for simplicity. Call strike K = 100.

Call payoff if up:   Cu = max(120-100, 0) = 20
Call payoff if down: Cd = max(90-100, 0)  = 0

Risk-neutral probability of "up": p = (1+r - d) / (u - d)
  where u = 120/100 = 1.2, d = 90/100 = 0.9
  p = (1 - 0.9) / (1.2 - 0.9) = 0.1 / 0.3 = 0.333

Option price today = [p x Cu + (1-p) x Cd] / (1+r)
                    = [0.333 x 20 + 0.667 x 0] / 1 = 6.67
</code></pre>
<h3>Black-Scholes (continuous-time limit)</h3>
<p>Repeat the binomial step infinitely many times over the same period, and the price converges to the <strong>Black-Scholes formula</strong> — the industry-standard closed-form price for a European call/put, using five inputs: spot price S, strike K, time to maturity T, risk-free rate r, and volatility σ (the ONLY input that is not directly observable, which is why it is the main source of disagreement in option pricing).</p>
<h3>Put-call parity — a pricing sanity check</h3>
<pre><code>C - P = S - K x e^(-r x T)

C = call price, P = put price (same K, same T)
This must hold regardless of the pricing model — if it does not,
there is a riskless arbitrage between the call, the put, and the
stock.
</code></pre>
<div class="callout"><span class="badge">Delta, briefly</span> <strong>Delta</strong> is how much the option's price changes for a 1-unit change in the underlying — a call has delta between 0 and 1 (in the binomial example above, delta = (Cu-Cd)/(Su-Sd) = 20/30 = 0.667). Delta is also the number of shares needed to replicate/hedge the option.</div>`,
    `<span class="eyebrow">FIN402 · Chương 6 · Bài 6.1</span>
<h2>Định giá quyền chọn: nhị thức &amp; Black-Scholes</h2>
<h3>Mô hình nhị thức một bước</h3>
<p>Cách đơn giản nhất để thấy VÌ SAO quyền chọn có thể định giá được mà không cần biết xác suất "thật" giá cổ phiếu tăng hay giảm: dựng một danh mục gồm cổ phiếu + trái phiếu không rủi ro mô phỏng đúng payoff của quyền chọn, thì quyền chọn phải có giá bằng đúng danh mục đó (nguyên tắc không arbitrage).</p>
<pre><code>Cổ phiếu hôm nay S = 100. Sau một kỳ, giá TĂNG lên Su=120 hoặc GIẢM
xuống Sd=90. Lãi suất không rủi ro r = 0% để đơn giản. Strike K=100.

Payoff call nếu tăng: Cu = max(120-100, 0) = 20
Payoff call nếu giảm: Cd = max(90-100, 0)  = 0

Xác suất trung hoà rủi ro của "tăng": p = (1+r - d) / (u - d)
  với u = 120/100 = 1,2, d = 90/100 = 0,9
  p = (1 - 0,9) / (1,2 - 0,9) = 0,1 / 0,3 = 0,333

Giá quyền chọn hôm nay = [p x Cu + (1-p) x Cd] / (1+r)
                       = [0,333 x 20 + 0,667 x 0] / 1 = 6,67
</code></pre>
<h3>Black-Scholes (giới hạn thời gian liên tục)</h3>
<p>Lặp lại bước nhị thức vô số lần trong cùng một khoảng thời gian, giá sẽ hội tụ về <strong>công thức Black-Scholes</strong> — công thức đóng chuẩn của ngành để định giá một call/put châu Âu, dùng năm đầu vào: giá giao ngay S, giá thực hiện K, thời gian tới đáo hạn T, lãi suất không rủi ro r, và độ biến động σ (đầu vào DUY NHẤT không quan sát trực tiếp được, nên là nguồn tranh cãi chính khi định giá quyền chọn).</p>
<h3>Put-call parity — phép kiểm tra hợp lý của giá</h3>
<pre><code>C - P = S - K x e^(-r x T)

C = giá call, P = giá put (cùng K, cùng T)
Đẳng thức này phải đúng bất kể mô hình định giá nào — nếu không
đúng, sẽ có cơ hội arbitrage không rủi ro giữa call, put và cổ phiếu.
</code></pre>
<div class="callout"><span class="badge">Delta, sơ lược</span> <strong>Delta</strong> là mức giá quyền chọn thay đổi bao nhiêu khi tài sản cơ sở thay đổi 1 đơn vị — call có delta từ 0 đến 1 (trong ví dụ nhị thức trên, delta = (Cu-Cd)/(Su-Sd) = 20/30 = 0,667). Delta cũng là số cổ phiếu cần để mô phỏng/hedge quyền chọn đó.</div>`,
  ]]);

const c6q = quiz('fin402-quiz-6', 'Quiz 6 — Option pricing models|||Quiz 6 — Định giá quyền chọn', [
  { id: 'q1', question: 'Nguyên tắc cốt lõi của mô hình nhị thức định giá quyền chọn là gì?', options: ['Đoán xác suất thật giá tăng/giảm', 'Dựng danh mục cổ phiếu + trái phiếu mô phỏng đúng payoff quyền chọn (không arbitrage)', 'Dùng lãi suất ngân hàng thương mại làm chiết khấu', 'Chỉ áp dụng cho quyền chọn kiểu Mỹ'], correctIndex: 1, explanation: 'Mô hình nhị thức định giá bằng danh mục sao chép payoff (replicating portfolio), không cần biết xác suất thật.' },
  { id: 'q2', question: 'Trong 5 đầu vào của công thức Black-Scholes, đầu vào nào KHÔNG quan sát trực tiếp được?', options: ['Giá thực hiện K', 'Giá giao ngay S', 'Độ biến động (volatility) σ', 'Thời gian tới đáo hạn T'], correctIndex: 2, explanation: 'S, K, T, r đều quan sát được trực tiếp; σ phải ước lượng, nên là nguồn tranh cãi chính khi định giá.' },
  { id: 'q3', question: 'Put-call parity (C - P = S - K x e^(-rT)) dùng để làm gì?', options: ['Tính lãi suất ngân hàng', 'Kiểm tra tính hợp lý giữa giá call, put và cổ phiếu — lệch thì có arbitrage', 'Thay thế hoàn toàn Black-Scholes', 'Chỉ áp dụng cho hợp đồng futures'], correctIndex: 1, explanation: 'Put-call parity là một ràng buộc không arbitrage giữa ba giá — nếu vi phạm, có thể kiếm lợi nhuận không rủi ro.' },
]);

const c7 = doc('fin402-7-1-swaps', '7.1 — Swaps: interest rate & currency|||7.1 — Hoán đổi: lãi suất & tiền tệ',
  'Interest rate swap (fixed vs floating), currency swap; ví dụ tính luồng tiền hoán đổi lãi suất.',
  [[
    `<span class="eyebrow">FIN402 · Chapter 7 · Lesson 7.1</span>
<h2>Swaps: interest rate &amp; currency</h2>
<h3>The basic idea</h3>
<p>A <strong>swap</strong> is an agreement between two parties to exchange a series of cash flows over time, based on a <strong>notional principal</strong> that is NEVER actually exchanged (it is only used to compute the payments).</p>
<h3>Interest rate swap (the most common type)</h3>
<p>One party pays a <strong>fixed rate</strong>, the other pays a <strong>floating rate</strong> (e.g. tied to a benchmark rate), both on the same notional. Typical use: a company with a floating-rate loan swaps into fixed to remove uncertainty about future interest payments.</p>
<pre><code>Notional = 10,000,000,000 VND. Fixed rate = 7%/year. Floating rate
resets each period to the benchmark.

Period 1: benchmark = 6% -> floating payer owes 6% x 10bn = 600m
                             fixed payer owes 7% x 10bn = 700m
          Net: fixed payer pays floating payer 100m
              (only the NET difference actually changes hands)

Period 2: benchmark = 8% -> floating payer owes 800m
                             fixed payer owes 700m
          Net: floating payer pays fixed payer 100m
</code></pre>
<h3>Currency swap</h3>
<p>Two parties exchange principal AND interest payments in DIFFERENT currencies (e.g. a Vietnamese firm with USD debt and a US firm with VND debt swap their obligations) — useful when a company can borrow more cheaply in its home currency than directly in the foreign one it actually needs.</p>
<div class="callout"><span class="badge">Why a swap, not a series of forwards?</span> A swap is economically similar to a bundle of forward contracts, but is negotiated and documented as ONE contract with one counterparty relationship — simpler to manage, and often cheaper, than assembling many separate forwards for each future date.</div>`,
    `<span class="eyebrow">FIN402 · Chương 7 · Bài 7.1</span>
<h2>Hoán đổi: lãi suất &amp; tiền tệ</h2>
<h3>Ý tưởng cơ bản</h3>
<p>Một <strong>hoán đổi (swap)</strong> là thoả thuận giữa hai bên để trao đổi một chuỗi luồng tiền theo thời gian, dựa trên một <strong>số vốn danh nghĩa (notional principal)</strong> KHÔNG BAO GIỜ thực sự được trao đổi (chỉ dùng để tính các khoản thanh toán).</p>
<h3>Hoán đổi lãi suất (loại phổ biến nhất)</h3>
<p>Một bên trả <strong>lãi suất cố định</strong>, bên còn lại trả <strong>lãi suất thả nổi</strong> (vd gắn với một lãi suất tham chiếu), cả hai trên cùng một số vốn danh nghĩa. Ứng dụng phổ biến: một công ty đang vay lãi suất thả nổi hoán đổi sang lãi suất cố định để loại bỏ sự bất định về khoản lãi phải trả trong tương lai.</p>
<pre><code>Vốn danh nghĩa = 10.000.000.000 VND. Lãi cố định = 7%/năm. Lãi thả
nổi được đặt lại mỗi kỳ theo lãi suất tham chiếu.

Kỳ 1: lãi tham chiếu = 6% -> bên trả thả nổi nợ 6% x 10 tỷ = 600 tr
                              bên trả cố định nợ 7% x 10 tỷ = 700 tr
       Ròng: bên trả cố định trả cho bên trả thả nổi 100 triệu
             (chỉ khoản chênh RÒNG mới thực sự đổi tay)

Kỳ 2: lãi tham chiếu = 8% -> bên trả thả nổi nợ 800 triệu
                              bên trả cố định nợ 700 triệu
       Ròng: bên trả thả nổi trả cho bên trả cố định 100 triệu
</code></pre>
<h3>Hoán đổi tiền tệ (currency swap)</h3>
<p>Hai bên trao đổi CẢ vốn gốc VÀ các khoản lãi bằng các LOẠI TIỀN KHÁC NHAU (vd một công ty Việt Nam đang nợ USD và một công ty Mỹ đang nợ VND hoán đổi nghĩa vụ cho nhau) — hữu ích khi một công ty vay được rẻ hơn bằng chính tiền nước mình so với vay trực tiếp bằng ngoại tệ mà nó thực sự cần.</p>
<div class="callout"><span class="badge">Vì sao dùng swap thay vì một loạt forward?</span> Về bản chất kinh tế, swap tương tự một chuỗi hợp đồng kỳ hạn, nhưng được đàm phán và ghi nhận thành MỘT hợp đồng duy nhất với một quan hệ đối tác — dễ quản lý hơn, và thường rẻ hơn, so với ghép nhiều forward riêng lẻ cho từng ngày trong tương lai.</div>`,
  ]]);

const c7q = quiz('fin402-quiz-7', 'Quiz 7 — Swaps|||Quiz 7 — Hoán đổi', [
  { id: 'q1', question: 'Trong một hoán đổi lãi suất, "số vốn danh nghĩa" (notional principal) được dùng để làm gì?', options: ['Là số tiền thực sự trao đổi giữa hai bên', 'Chỉ dùng để TÍNH các khoản thanh toán lãi, không thực sự đổi tay', 'Là phí giao dịch phải trả cho sàn', 'Là số tiền ký quỹ bắt buộc'], correctIndex: 1, explanation: 'Vốn danh nghĩa chỉ là cơ sở tính lãi cố định/thả nổi; chỉ phần CHÊNH LỆCH RÒNG mới thực sự đổi tay.' },
  { id: 'q2', question: 'Một công ty đang vay lãi suất thả nổi, lo lãi suất sẽ tăng, nên dùng swap nào để loại bỏ bất định?', options: ['Trả thêm lãi thả nổi', 'Hoán đổi để chuyển sang trả lãi suất cố định', 'Vay thêm một khoản thả nổi khác', 'Mua thêm cổ phiếu của chính công ty'], correctIndex: 1, explanation: 'Chuyển từ thả nổi sang cố định qua interest rate swap giúp công ty biết chắc khoản lãi phải trả mỗi kỳ.' },
  { id: 'q3', question: 'Currency swap khác interest rate swap chủ yếu ở điểm nào?', options: ['Currency swap không có lãi suất', 'Currency swap trao đổi cả vốn gốc và lãi bằng các loại tiền khác nhau', 'Currency swap chỉ dùng cho cổ phiếu', 'Không có khác biệt nào'], correctIndex: 1, explanation: 'Currency swap liên quan hai đồng tiền khác nhau và có trao đổi vốn gốc, khác với interest rate swap (cùng một đồng tiền, không đổi vốn gốc).' },
]);

const c8 = doc('fin402-8-1-risk-management-vietnam', '8.1 — Risk management with derivatives & Vietnam market (HNX)|||8.1 — Quản trị rủi ro bằng phái sinh & thị trường Việt Nam (HNX)',
  'Phái sinh trong quản trị rủi ro doanh nghiệp; bài học Barings/LTCM về đầu cơ mất kiểm soát; thị trường phái sinh Việt Nam trên HNX (VN30 futures, trái phiếu chính phủ).',
  [[
    `<span class="eyebrow">FIN402 · Chapter 8 · Lesson 8.1</span>
<h2>Risk management with derivatives &amp; the Vietnam market</h2>
<h3>Derivatives as a corporate risk-management tool</h3>
<p>Beyond trading desks, most large companies use derivatives quietly and routinely to manage risks they did NOT choose to take on as part of their core business:</p>
<ul>
<li><strong>FX risk</strong> — an exporter/importer hedges foreign-currency receivables/payables with forwards.</li>
<li><strong>Interest rate risk</strong> — a borrower swaps floating debt into fixed (or vice versa).</li>
<li><strong>Commodity price risk</strong> — an airline hedges jet fuel, a food company hedges wheat.</li>
</ul>
<h3>A cautionary note: when speculation is mistaken for hedging</h3>
<p>Derivatives are neutral tools (Chapter 1) — the same instrument used prudently for hedging can be misused for outsized speculation, sometimes with catastrophic results: <strong>Barings Bank (1995)</strong> collapsed after a single trader's unauthorized, unhedged futures positions on the Nikkei index; <strong>Long-Term Capital Management (1998)</strong> nearly triggered a systemic crisis from highly leveraged derivatives bets. The lesson repeated in every derivatives course: leverage magnifies gains AND losses, and controls (position limits, independent risk oversight) exist for a reason.</p>
<h3>The derivatives market in Vietnam</h3>
<p>Vietnam's derivatives market is exchange-traded and runs on <strong>HNX (Hanoi Stock Exchange)</strong>, launched in 2017:</p>
<ul>
<li><strong>VN30 Index Futures</strong> — the first and most actively traded product, letting investors hedge or speculate on the VN30 (top-30 stocks) without trading each stock individually.</li>
<li><strong>Government bond futures</strong> — added later, giving fixed-income investors a way to hedge interest-rate risk on government bonds.</li>
</ul>
<div class="callout"><span class="badge">Full circle</span> Everything in this course — the four instrument families, pricing, hedging, and the discipline around leverage — comes together in a single VN30 futures contract on HNX: a standardized, exchange-cleared bet or hedge on the direction of Vietnam's blue-chip stocks.</div>`,
    `<span class="eyebrow">FIN402 · Chương 8 · Bài 8.1</span>
<h2>Quản trị rủi ro bằng phái sinh &amp; thị trường Việt Nam</h2>
<h3>Phái sinh như công cụ quản trị rủi ro doanh nghiệp</h3>
<p>Ngoài các bàn giao dịch chuyên nghiệp, hầu hết doanh nghiệp lớn dùng phái sinh một cách âm thầm và thường xuyên để quản trị những rủi ro mà họ KHÔNG chủ động chọn gánh khi kinh doanh cốt lõi:</p>
<ul>
<li><strong>Rủi ro tỷ giá</strong> — nhà xuất/nhập khẩu hedge các khoản phải thu/phải trả bằng ngoại tệ với hợp đồng kỳ hạn.</li>
<li><strong>Rủi ro lãi suất</strong> — người đi vay hoán đổi nợ thả nổi sang cố định (hoặc ngược lại).</li>
<li><strong>Rủi ro giá hàng hoá</strong> — hãng bay hedge nhiên liệu, công ty thực phẩm hedge lúa mì.</li>
</ul>
<h3>Lời cảnh báo: khi đầu cơ bị nhầm với hedging</h3>
<p>Phái sinh là công cụ trung tính (Chương 1) — cùng một công cụ dùng cẩn trọng để hedging có thể bị lạm dụng để đầu cơ quá mức, đôi khi dẫn tới hậu quả thảm khốc: <strong>Ngân hàng Barings (1995)</strong> sụp đổ sau khi một nhà giao dịch duy nhất mở các vị thế futures trên chỉ số Nikkei không được cấp phép và không hedge; <strong>Long-Term Capital Management (1998)</strong> suýt gây khủng hoảng hệ thống vì các cược phái sinh đòn bẩy quá cao. Bài học lặp lại trong mọi môn phái sinh: đòn bẩy khuếch đại cả lãi VÀ lỗ, và các cơ chế kiểm soát (hạn mức vị thế, giám sát rủi ro độc lập) tồn tại vì lý do đó.</p>
<h3>Thị trường phái sinh tại Việt Nam</h3>
<p>Thị trường phái sinh Việt Nam niêm yết trên sàn và vận hành trên <strong>HNX (Sở Giao dịch Chứng khoán Hà Nội)</strong>, khai trương năm 2017:</p>
<ul>
<li><strong>Hợp đồng tương lai chỉ số VN30</strong> — sản phẩm đầu tiên và giao dịch sôi động nhất, cho phép nhà đầu tư hedge hoặc đầu cơ theo VN30 (30 cổ phiếu vốn hoá lớn nhất) mà không cần giao dịch từng cổ phiếu riêng lẻ.</li>
<li><strong>Hợp đồng tương lai trái phiếu chính phủ</strong> — bổ sung sau, cho nhà đầu tư thu nhập cố định một cách hedge rủi ro lãi suất trên trái phiếu chính phủ.</li>
</ul>
<div class="callout"><span class="badge">Khép vòng tròn</span> Mọi thứ trong môn này — bốn nhóm công cụ, định giá, hedging, và kỷ luật với đòn bẩy — hội tụ lại trong một hợp đồng tương lai VN30 trên HNX: một cược hoặc một hedge chuẩn hoá, thanh toán qua trung tâm bù trừ, vào chiều đi của các cổ phiếu blue-chip Việt Nam.</div>`,
  ]]);

const c8q = quiz('fin402-quiz-8', 'Quiz 8 — Risk management & Vietnam market|||Quiz 8 — Quản trị rủi ro & thị trường Việt Nam', [
  { id: 'q1', question: 'Một hãng bay dùng futures nhiên liệu để hedge, còn một trader dùng đúng loại futures đó để đặt cược theo chiều giá — điều này minh hoạ điều gì?', options: ['Futures chỉ dùng được cho một mục đích duy nhất', 'Công cụ phái sinh trung tính; mục đích của người dùng quyết định đó là hedging hay đầu cơ', 'Hãng bay không được phép dùng futures', 'Trader luôn thua lỗ khi dùng futures'], correctIndex: 1, explanation: 'Đây nhắc lại bài học Chương 1: cùng công cụ, vai trò khác nhau tuỳ mục đích sử dụng.' },
  { id: 'q2', question: 'Bài học chính từ sự sụp đổ của Barings Bank (1995) là gì?', options: ['Không nên dùng phái sinh dưới bất kỳ hình thức nào', 'Vị thế đầu cơ không hedge, không được cấp phép và không kiểm soát có thể gây thiệt hại thảm khốc', 'Chỉ ngân hàng lớn mới gặp rủi ro này', 'Barings sụp đổ vì lãi suất tăng'], correctIndex: 1, explanation: 'Một trader mở vị thế futures không hedge, không được cấp phép, không bị giám sát đúng mức — đòn bẩy khuếch đại khoản lỗ tới mức phá sản ngân hàng.' },
  { id: 'q3', question: 'Sản phẩm phái sinh niêm yết đầu tiên và giao dịch sôi động nhất trên HNX là gì?', options: ['Quyền chọn cổ phiếu riêng lẻ', 'Hợp đồng tương lai chỉ số VN30', 'Hoán đổi lãi suất', 'Hợp đồng kỳ hạn ngoại tệ OTC'], correctIndex: 1, explanation: 'HNX khai trương thị trường phái sinh năm 2017 với Hợp đồng tương lai chỉ số VN30 là sản phẩm đầu tiên và sôi động nhất; trái phiếu chính phủ futures được thêm sau.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'FIN402',
    slug: 'fin402-derivatives',
    title: 'Derivatives',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIN402.webp',
    shortDescription: 'How derivatives work — forwards & futures, pricing & hedging, option payoff & strategies, binomial/Black-Scholes intuition, swaps, risk management on Vietnam market (HNX). Bilingual, worked examples & quizzes.|||Phái sinh hoạt động thế nào — kỳ hạn & tương lai, định giá & hedging, payoff & chiến lược quyền chọn, trực giác nhị thức/Black-Scholes, hoán đổi, quản trị rủi ro trên thị trường Việt Nam (HNX). Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>FIN402 — Derivatives</strong> (kỳ 4, khối Quản trị Kinh doanh) giúp hiểu <strong>công cụ tài chính phái sinh hoạt động thế nào và dùng để làm gì</strong>. Từ <strong>tổng quan thị trường &amp; vai trò</strong> (hedging/speculation/arbitrage) → <strong>hợp đồng kỳ hạn &amp; tương lai</strong> → <strong>định giá futures &amp; phòng ngừa rủi ro</strong> → <strong>quyền chọn</strong> (payoff, chiến lược spread/straddle, định giá nhị thức &amp; Black-Scholes) → <strong>hoán đổi</strong> → <strong>quản trị rủi ro &amp; thị trường phái sinh Việt Nam (HNX)</strong>. Bám giáo trình Hull, McDonald &amp; CFA Program, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Bốn nhóm công cụ phái sinh & ba vai trò (hedging/speculation/arbitrage); forward vs futures & payoff; cost-of-carry pricing futures & hedge ratio; payoff call/put & điểm hoà vốn; spread (bull/bear), straddle, strangle, covered call, protective put; mô hình nhị thức & trực giác Black-Scholes, put-call parity; interest rate swap & currency swap; quản trị rủi ro doanh nghiệp bằng phái sinh; thị trường phái sinh Việt Nam trên HNX (VN30 futures, trái phiếu chính phủ).',
    requirements: 'Đã học qua Tài chính doanh nghiệp cơ bản & Thống kê (kỳ vọng, xác suất). Nên có máy tính cầm tay hoặc Excel để làm ví dụ tính toán.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Hull/McDonald/CFA, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Derivative là gì, 4 nhóm công cụ, 3 vai trò.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan thị trường & vai trò|||Chapter 1 — Market overview & role', description: 'OTC vs sàn, hedging/speculation/arbitrage.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kỳ hạn & tương lai|||Chapter 2 — Forwards & futures', description: 'Forward vs futures, payoff long/short.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Định giá futures & hedging|||Chapter 3 — Futures pricing & hedging', description: 'Cost-of-carry, short/long hedge, hệ số hedge.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Quyền chọn cơ bản & payoff|||Chapter 4 — Option basics & payoff', description: 'Call/put, payoff, breakeven.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chiến lược quyền chọn|||Chapter 5 — Option strategies', description: 'Spread, straddle, strangle, covered call.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định giá quyền chọn|||Chapter 6 — Option pricing', description: 'Nhị thức, Black-Scholes, put-call parity.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hoán đổi|||Chapter 7 — Swaps', description: 'Interest rate swap, currency swap.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị rủi ro & thị trường VN|||Chapter 8 — Risk management & Vietnam market', description: 'Rủi ro doanh nghiệp, Barings/LTCM, HNX VN30 futures.', lessons: [c8, c8q] },
  ],
};
