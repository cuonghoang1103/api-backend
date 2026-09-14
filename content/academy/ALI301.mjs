/**
 * ALI301 — Alternative Investment. Khung 8 chương bám CAIA Level I
 * (Chambers et al) + Bodie/Kane/Marcus (chương alternatives) + CFA:
 * tổng quan & vai trò trong danh mục, quỹ đầu cơ, private equity/VC,
 * bất động sản & REITs, hàng hoá & futures, hạ tầng & tài sản thực,
 * tài sản số/crypto, đo lường rủi ro-lợi nhuận + due diligence + phân
 * bổ danh mục. Song ngữ + ví dụ giả định + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ali301-0-1-overview', 'Course overview: Alternative Investment|||Tổng quan môn học: Đầu tư thay thế',
  'Đầu tư thay thế là gì (kém thanh khoản, tương quan thấp, định giá phức tạp, quản lý chủ động); lộ trình 8 chương từ tổng quan đến phân bổ danh mục.',
  [[
    `<span class="eyebrow">ALI301 · Lesson 0.1 · Overview</span>
<h2>Alternative Investment</h2>
<p class="lead">This course looks beyond the traditional world of listed <strong>stocks and bonds</strong> into <strong>alternative investments</strong> — hedge funds, private equity &amp; venture capital, real estate, commodities, infrastructure and digital assets. You'll learn what makes each asset class different, why institutional investors add them to a portfolio, and how to measure their risk and return.</p>
<h3>What makes an investment "alternative"?</h3>
<ul>
<li><strong>Illiquidity</strong> — money is often locked up for years (private equity funds), unlike a stock you can sell in seconds.</li>
<li><strong>Low correlation</strong> — alternatives often move differently from stocks/bonds, which is exactly what makes them useful for diversification.</li>
<li><strong>Complex valuation</strong> — no daily market price; value is estimated (appraisal, model, mark-to-model).</li>
<li><strong>Active, specialized management</strong> — returns depend heavily on manager skill, not just market exposure.</li>
</ul>
<h3>Roadmap</h3>
<p>Overview &amp; portfolio role → hedge funds → private equity &amp; venture capital → real estate &amp; REITs → commodities &amp; futures → infrastructure &amp; real assets → digital assets/crypto → risk-return measurement, due diligence &amp; allocation.</p>
<div class="callout"><span class="badge">Why it matters</span> Large pension funds and university endowments put 20-50% of their portfolio into alternatives — understanding them is core knowledge for a career in asset management, banking or corporate finance.</div>`,
    `<span class="eyebrow">ALI301 · Bài 0.1 · Tổng quan</span>
<h2>Đầu tư thay thế (Alternative Investment)</h2>
<p class="lead">Môn này nhìn ra ngoài thế giới quen thuộc của <strong>cổ phiếu và trái phiếu</strong> niêm yết, đến với <strong>đầu tư thay thế</strong> — quỹ đầu cơ, private equity &amp; vốn mạo hiểm, bất động sản, hàng hoá, hạ tầng và tài sản số. Bạn sẽ học điều gì làm mỗi lớp tài sản khác biệt, vì sao nhà đầu tư tổ chức đưa chúng vào danh mục, và cách đo lường rủi ro-lợi nhuận.</p>
<h3>Điều gì làm một khoản đầu tư "thay thế"?</h3>
<ul>
<li><strong>Kém thanh khoản</strong> — tiền thường bị khoá nhiều năm (quỹ private equity), khác với cổ phiếu có thể bán trong vài giây.</li>
<li><strong>Tương quan thấp</strong> — tài sản thay thế thường biến động khác cổ phiếu/trái phiếu, đúng là điều làm chúng hữu ích cho đa dạng hoá.</li>
<li><strong>Định giá phức tạp</strong> — không có giá thị trường hàng ngày; giá trị được ước lượng (thẩm định, mô hình, mark-to-model).</li>
<li><strong>Quản lý chủ động, chuyên biệt</strong> — lợi nhuận phụ thuộc nhiều vào kỹ năng người quản lý, không chỉ vào thị trường chung.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; vai trò trong danh mục → quỹ đầu cơ → private equity &amp; vốn mạo hiểm → bất động sản &amp; REITs → hàng hoá &amp; hợp đồng tương lai → hạ tầng &amp; tài sản thực → tài sản số/crypto → đo lường rủi ro-lợi nhuận, due diligence &amp; phân bổ.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Các quỹ hưu trí lớn và quỹ hiến tặng đại học đưa 20-50% danh mục vào tài sản thay thế — hiểu chúng là kiến thức nền cho sự nghiệp quản lý tài sản, ngân hàng hay tài chính doanh nghiệp.</div>`,
  ]]);

const c1 = doc('ali301-1-1-overview-role', '1.1 — Alternative investments & their role in a portfolio|||1.1 — Đầu tư thay thế & vai trò trong danh mục',
  'Truyền thống vs thay thế; vì sao thêm tài sản thay thế (đa dạng hoá, tăng lợi nhuận, chống lạm phát); đánh đổi (kém thanh khoản, phí cao, thẩm định).',
  [[
    `<span class="eyebrow">ALI301 · Chapter 1 · Lesson 1.1</span>
<h2>Alternative investments &amp; their role in a portfolio</h2>
<h3>Traditional vs. alternative</h3>
<p><strong>Traditional assets</strong> — publicly listed stocks and bonds — are liquid, transparent, and priced daily. <strong>Alternative assets</strong> sit outside that world: hedge funds, private equity, real estate, commodities, infrastructure, and increasingly digital assets. Investors accept less liquidity and more complexity in exchange for potentially higher returns and diversification.</p>
<h3>Why add alternatives to a portfolio?</h3>
<ul>
<li><strong>Diversification</strong> — low correlation with stocks/bonds can reduce overall portfolio volatility.</li>
<li><strong>Return enhancement</strong> — an illiquidity premium and manager skill (alpha) can add return traditional assets don't offer.</li>
<li><strong>Inflation hedge</strong> — real assets (real estate, infrastructure, commodities) often track inflation better than bonds.</li>
</ul>
<h3>The trade-offs</h3>
<ul>
<li><strong>Illiquidity</strong> — capital can be locked up for 5-10+ years (private equity).</li>
<li><strong>Higher fees</strong> — active management is expensive (e.g. hedge fund "2 and 20").</li>
<li><strong>Due diligence burden</strong> — harder to verify manager skill and valuations.</li>
</ul>
<pre><code>Assumed example — diversification effect:
 100% stocks portfolio:            expected return 8%,  volatility 16%
 80% stocks / 20% alternatives:    expected return 7.7%, volatility 13.5%
 -> a small return give-up can buy a meaningfully smoother ride
 (illustrative numbers, not real market data)
</code></pre>
<div class="callout"><span class="badge">Core idea</span> Alternatives aren't "better" investments — they're <em>different</em> ones. Their value comes from how they behave alongside the rest of the portfolio, not in isolation.</div>`,
    `<span class="eyebrow">ALI301 · Chương 1 · Bài 1.1</span>
<h2>Đầu tư thay thế &amp; vai trò trong danh mục</h2>
<h3>Truyền thống vs. thay thế</h3>
<p><strong>Tài sản truyền thống</strong> — cổ phiếu và trái phiếu niêm yết công khai — có tính thanh khoản, minh bạch, và được định giá hàng ngày. <strong>Tài sản thay thế</strong> nằm ngoài thế giới đó: quỹ đầu cơ, private equity, bất động sản, hàng hoá, hạ tầng, và ngày càng có thêm tài sản số. Nhà đầu tư chấp nhận kém thanh khoản hơn và phức tạp hơn để đổi lấy khả năng lợi nhuận cao hơn và đa dạng hoá.</p>
<h3>Vì sao thêm tài sản thay thế vào danh mục?</h3>
<ul>
<li><strong>Đa dạng hoá</strong> — tương quan thấp với cổ phiếu/trái phiếu có thể giảm biến động tổng thể của danh mục.</li>
<li><strong>Tăng lợi nhuận</strong> — phần bù kém thanh khoản và kỹ năng người quản lý (alpha) có thể thêm lợi nhuận mà tài sản truyền thống không có.</li>
<li><strong>Chống lạm phát</strong> — tài sản thực (bất động sản, hạ tầng, hàng hoá) thường bám lạm phát tốt hơn trái phiếu.</li>
</ul>
<h3>Đánh đổi</h3>
<ul>
<li><strong>Kém thanh khoản</strong> — vốn có thể bị khoá 5-10+ năm (private equity).</li>
<li><strong>Phí cao hơn</strong> — quản lý chủ động tốn kém (vd phí "2 và 20" của quỹ đầu cơ).</li>
<li><strong>Gánh nặng thẩm định</strong> — khó xác minh kỹ năng người quản lý và định giá hơn.</li>
</ul>
<pre><code>Ví dụ giả định — hiệu ứng đa dạng hoá:
 Danh mục 100% cổ phiếu:              lợi nhuận kỳ vọng 8%,  biến động 16%
 80% cổ phiếu / 20% tài sản thay thế: lợi nhuận kỳ vọng 7,7%, biến động 13,5%
 -> hy sinh một chút lợi nhuận có thể mua được sự ổn định đáng kể
 (số liệu minh hoạ, không phải dữ liệu thị trường thật)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Tài sản thay thế không "tốt hơn" — chúng <em>khác</em>. Giá trị của chúng nằm ở cách chúng vận động cùng phần còn lại của danh mục, không phải khi đứng riêng lẻ.</div>`,
  ]]);

const c1q = quiz('ali301-quiz-1', 'Quiz 1 — Overview & role|||Quiz 1 — Tổng quan & vai trò', [
  { id: 'q1', question: 'Điểm khác biệt CHÍNH của tài sản thay thế so với cổ phiếu/trái phiếu niêm yết là gì?', options: ['Luôn sinh lời cao hơn', 'Kém thanh khoản & định giá phức tạp hơn', 'Không có rủi ro', 'Chỉ dành cho cá nhân'], correctIndex: 1, explanation: 'Tài sản thay thế thường kém thanh khoản và khó định giá hơn tài sản niêm yết.' },
  { id: 'q2', question: 'Lý do chính nhà đầu tư tổ chức thêm tài sản thay thế vào danh mục?', options: ['Để tăng phí trả cho quản lý quỹ', 'Đa dạng hoá nhờ tương quan thấp với cổ phiếu/trái phiếu', 'Vì luôn thanh khoản cao', 'Vì được định giá hàng ngày'], correctIndex: 1, explanation: 'Tương quan thấp giúp giảm biến động tổng thể của danh mục.' },
  { id: 'q3', question: 'Đánh đổi lớn nhất khi đầu tư private equity là gì?', options: ['Không có đánh đổi', 'Vốn có thể bị khoá nhiều năm', 'Phí luôn thấp hơn quỹ mở', 'Định giá hàng ngày minh bạch'], correctIndex: 1, explanation: 'Vốn private equity thường bị khoá 5-10+ năm, kém thanh khoản.' },
]);

const c2 = doc('ali301-2-1-hedge-funds', '2.1 — Hedge funds & strategies|||2.1 — Quỹ đầu cơ & chiến lược',
  'Quỹ đầu cơ & phí "2 và 20"; long/short equity, global macro, event-driven, relative value; đòn bẩy & rủi ro.',
  [[
    `<span class="eyebrow">ALI301 · Chapter 2 · Lesson 2.1</span>
<h2>Hedge funds &amp; strategies</h2>
<h3>What is a hedge fund?</h3>
<p>A <strong>hedge fund</strong> is a privately pooled investment vehicle that uses a wide toolkit — leverage, short selling, derivatives — to pursue absolute returns (positive returns regardless of market direction), unlike a mutual fund benchmarked to an index. It's typically open only to accredited/institutional investors and charges a <strong>"2 and 20"</strong> fee: 2% of assets under management per year plus 20% of profits.</p>
<h3>Main strategy families</h3>
<ul>
<li><strong>Long/short equity</strong> — buy undervalued stocks, short overvalued ones; profits from the spread regardless of market direction.</li>
<li><strong>Global macro</strong> — bets on macroeconomic trends (interest rates, currencies, commodities) across countries.</li>
<li><strong>Event-driven</strong> — profits from corporate events: mergers (merger arbitrage), bankruptcies, spin-offs.</li>
<li><strong>Relative value / arbitrage</strong> — exploits small pricing gaps between related securities (e.g. convertible bond arbitrage), often with leverage.</li>
</ul>
<h3>Leverage &amp; risk</h3>
<p>Hedge funds often use <strong>leverage</strong> (borrowed money) to amplify returns — and losses. A fund with 3x leverage that loses 5% on its underlying positions loses 15% of investor capital.</p>
<pre><code>Assumed example — "2 and 20" fee:
 Fund AUM = $100M, annual gross return = 12% ($12M profit)
 Management fee (2%)  = $2.0M
 Performance fee (20% of $12M) = $2.4M
 Net return to investors ≈ (12M - 2M - 2.4M) / 100M = 7.6%
</code></pre>
<div class="callout"><span class="badge">Key term</span> "Absolute return" means the goal is to make money in both up and down markets — very different from a mutual fund that just tries to beat its benchmark.</div>`,
    `<span class="eyebrow">ALI301 · Chương 2 · Bài 2.1</span>
<h2>Quỹ đầu cơ &amp; chiến lược</h2>
<h3>Quỹ đầu cơ là gì?</h3>
<p>Một <strong>quỹ đầu cơ (hedge fund)</strong> là quỹ đầu tư huy động vốn tư nhân, dùng bộ công cụ rộng — đòn bẩy, bán khống, phái sinh — để theo đuổi lợi nhuận tuyệt đối (dương bất kể thị trường đi hướng nào), khác với quỹ mở vốn được đo theo một chỉ số tham chiếu. Quỹ thường chỉ mở cho nhà đầu tư đủ điều kiện/tổ chức và thu phí <strong>"2 và 20"</strong>: 2% tài sản quản lý mỗi năm cộng 20% lợi nhuận.</p>
<h3>Các nhóm chiến lược chính</h3>
<ul>
<li><strong>Long/short equity</strong> — mua cổ phiếu bị định giá thấp, bán khống cổ phiếu bị định giá cao; lời từ chênh lệch bất kể thị trường đi hướng nào.</li>
<li><strong>Global macro</strong> — đặt cược vào xu hướng vĩ mô (lãi suất, tiền tệ, hàng hoá) trên nhiều quốc gia.</li>
<li><strong>Event-driven</strong> — lời từ sự kiện doanh nghiệp: sáp nhập (merger arbitrage), phá sản, tách công ty.</li>
<li><strong>Relative value / kinh doanh chênh lệch giá</strong> — khai thác chênh lệch giá nhỏ giữa các chứng khoán liên quan (vd arbitrage trái phiếu chuyển đổi), thường dùng đòn bẩy.</li>
</ul>
<h3>Đòn bẩy &amp; rủi ro</h3>
<p>Quỹ đầu cơ thường dùng <strong>đòn bẩy</strong> (tiền vay) để khuếch đại lợi nhuận — và cả thua lỗ. Quỹ dùng đòn bẩy 3 lần mà vị thế cơ sở lỗ 5% thì nhà đầu tư mất 15% vốn.</p>
<pre><code>Ví dụ giả định — phí "2 và 20":
 Quỹ AUM = 100 triệu $, lợi nhuận gộp năm = 12% (12 triệu $)
 Phí quản lý (2%)  = 2,0 triệu $
 Phí hiệu suất (20% của 12 triệu $) = 2,4 triệu $
 Lợi nhuận ròng cho NĐT ≈ (12 - 2 - 2,4) / 100 = 7,6%
</code></pre>
<div class="callout"><span class="badge">Thuật ngữ chính</span> "Lợi nhuận tuyệt đối" nghĩa là mục tiêu kiếm tiền cả khi thị trường lên lẫn xuống — rất khác quỹ mở chỉ cố gắng vượt chỉ số tham chiếu.</div>`,
  ]]);

const c2q = quiz('ali301-quiz-2', 'Quiz 2 — Hedge funds|||Quiz 2 — Quỹ đầu cơ', [
  { id: 'q1', question: 'Phí "2 và 20" của quỹ đầu cơ nghĩa là gì?', options: ['2% lợi nhuận + 20% tài sản', '2% tài sản quản lý/năm + 20% lợi nhuận', '2 năm khoá vốn, 20% phí rút', '20% tài sản, 2% lợi nhuận'], correctIndex: 1, explanation: '2% phí quản lý trên AUM mỗi năm, cộng 20% phí hiệu suất trên lợi nhuận.' },
  { id: 'q2', question: 'Chiến lược nào lời từ sự kiện sáp nhập, phá sản, tách công ty?', options: ['Long/short equity', 'Global macro', 'Event-driven', 'Relative value'], correctIndex: 2, explanation: 'Event-driven khai thác các sự kiện doanh nghiệp cụ thể.' },
  { id: 'q3', question: 'Đòn bẩy trong quỹ đầu cơ làm gì?', options: ['Chỉ giảm rủi ro', 'Khuếch đại cả lợi nhuận lẫn thua lỗ', 'Không ảnh hưởng gì', 'Luôn đảm bảo lợi nhuận dương'], correctIndex: 1, explanation: 'Đòn bẩy nhân cả chiều lời lẫn chiều lỗ theo tỷ lệ vay.' },
]);

const c3 = doc('ali301-3-1-pe-vc', '3.1 — Private equity & venture capital|||3.1 — Private equity & vốn mạo hiểm',
  'GP/LP, capital call; LBO (mua lại có đòn bẩy); các vòng gọi vốn VC (seed, Series A/B/C); đường cong chữ J.',
  [[
    `<span class="eyebrow">ALI301 · Chapter 3 · Lesson 3.1</span>
<h2>Private equity &amp; venture capital</h2>
<h3>Fund structure: GP and LP</h3>
<p>A private equity fund is run by a <strong>General Partner (GP)</strong> — the fund manager, who makes investment decisions and earns fees — while <strong>Limited Partners (LP)</strong> — pension funds, endowments, wealthy individuals — commit capital but stay passive. Capital isn't handed over all at once: LPs make a <strong>commitment</strong>, and the GP draws it down over time via <strong>capital calls</strong> as deals are found.</p>
<h3>Leveraged buyouts (LBO)</h3>
<p>A classic private equity deal buys a mature company using a mix of equity and significant <strong>debt</strong> (leverage), improves its operations/cash flow, then sells it (exit) years later. Leverage magnifies equity returns if the deal goes well — and losses if it doesn't.</p>
<h3>Venture capital (VC) stages</h3>
<ul>
<li><strong>Seed</strong> — earliest capital, often just an idea/prototype.</li>
<li><strong>Series A/B/C...</strong> — successive rounds as the company proves traction, scales revenue, and grows.</li>
<li><strong>Exit</strong> — IPO or acquisition, where investors realize their return.</li>
</ul>
<h3>The J-curve</h3>
<pre><code>Assumed example — fund cash flow (J-curve):
 Years 1-3: net cash flow NEGATIVE (capital calls, fees, early write-downs)
 Years 4-7: portfolio companies mature, first exits -> cash flow turns positive
 Years 8-10: harvest period, most distributions to LPs
 -> plotted over time this shape looks like the letter "J"
</code></pre>
<div class="callout"><span class="badge">Key distinction</span> Private equity typically targets mature, cash-flow-positive companies with debt; venture capital targets early-stage, high-growth (often cash-flow-negative) companies with equity only.</div>`,
    `<span class="eyebrow">ALI301 · Chương 3 · Bài 3.1</span>
<h2>Private equity &amp; vốn mạo hiểm</h2>
<h3>Cấu trúc quỹ: GP và LP</h3>
<p>Một quỹ private equity được điều hành bởi <strong>General Partner (GP)</strong> — người quản lý quỹ, ra quyết định đầu tư và hưởng phí — trong khi <strong>Limited Partner (LP)</strong> — quỹ hưu trí, quỹ hiến tặng, cá nhân giàu có — cam kết vốn nhưng thụ động. Vốn không được đưa hết một lần: LP đưa ra một <strong>cam kết (commitment)</strong>, và GP rút dần qua các <strong>lệnh gọi vốn (capital call)</strong> khi tìm được thương vụ.</p>
<h3>Mua lại có đòn bẩy (LBO)</h3>
<p>Một thương vụ private equity điển hình mua một công ty trưởng thành bằng cách kết hợp vốn chủ sở hữu và <strong>nợ vay</strong> đáng kể (đòn bẩy), cải thiện vận hành/dòng tiền, rồi bán lại (exit) sau vài năm. Đòn bẩy khuếch đại lợi nhuận vốn chủ nếu thương vụ tốt — và khuếch đại thua lỗ nếu không.</p>
<h3>Các vòng gọi vốn mạo hiểm (VC)</h3>
<ul>
<li><strong>Seed</strong> — vốn sớm nhất, thường chỉ là ý tưởng/bản mẫu.</li>
<li><strong>Series A/B/C...</strong> — các vòng kế tiếp khi công ty chứng minh sức hút, mở rộng doanh thu và tăng trưởng.</li>
<li><strong>Exit</strong> — IPO hoặc bị mua lại, nơi nhà đầu tư hiện thực hoá lợi nhuận.</li>
</ul>
<h3>Đường cong chữ J</h3>
<pre><code>Ví dụ giả định — dòng tiền quỹ (J-curve):
 Năm 1-3: dòng tiền ròng ÂM (gọi vốn, phí, giảm giá trị sớm)
 Năm 4-7: công ty trong danh mục trưởng thành, exit đầu tiên -> dòng tiền chuyển dương
 Năm 8-10: giai đoạn thu hoạch, phần lớn tiền trả về cho LP
 -> vẽ theo thời gian, hình dạng này giống chữ "J"
</code></pre>
<div class="callout"><span class="badge">Phân biệt chính</span> Private equity thường nhắm công ty trưởng thành, dòng tiền dương, dùng nợ; vốn mạo hiểm nhắm công ty giai đoạn sớm, tăng trưởng cao (thường dòng tiền âm), chỉ dùng vốn chủ.</div>`,
  ]]);

const c3q = quiz('ali301-quiz-3', 'Quiz 3 — Private equity & VC|||Quiz 3 — Private equity & vốn mạo hiểm', [
  { id: 'q1', question: 'Trong quỹ private equity, ai ra quyết định đầu tư và hưởng phí?', options: ['Limited Partner (LP)', 'General Partner (GP)', 'Cổ đông công ty mục tiêu', 'Ngân hàng cho vay'], correctIndex: 1, explanation: 'GP quản lý quỹ và ra quyết định đầu tư; LP chỉ góp vốn thụ động.' },
  { id: 'q2', question: 'LBO (mua lại có đòn bẩy) đặc trưng bởi điều gì?', options: ['Chỉ dùng vốn chủ sở hữu', 'Kết hợp vốn chủ & nợ vay đáng kể', 'Không bao giờ bán lại công ty', 'Chỉ áp dụng cho startup'], correctIndex: 1, explanation: 'LBO dùng nợ vay đáng kể cùng vốn chủ để mua công ty mục tiêu.' },
  { id: 'q3', question: 'Đường cong chữ J trong private equity mô tả điều gì?', options: ['Lợi nhuận luôn dương ngay từ đầu', 'Dòng tiền âm giai đoạn đầu rồi dương ở giai đoạn sau', 'Giá cổ phiếu biến động ngẫu nhiên', 'Lãi suất vay theo thời gian'], correctIndex: 1, explanation: 'Dòng tiền quỹ âm những năm đầu (gọi vốn) rồi dương khi có exit.' },
]);

const c4 = doc('ali301-4-1-real-estate-reits', '4.1 — Real estate & REITs|||4.1 — Bất động sản & REITs',
  'Bất động sản trực tiếp vs REITs; NOI, cap rate, cash-on-cash; equity REIT vs mortgage REIT.',
  [[
    `<span class="eyebrow">ALI301 · Chapter 4 · Lesson 4.1</span>
<h2>Real estate &amp; REITs</h2>
<h3>Direct real estate vs. REITs</h3>
<p><strong>Direct real estate</strong> — buying a physical building — is illiquid, capital-intensive, and requires active management. A <strong>REIT (Real Estate Investment Trust)</strong> is a company that owns/operates income-producing real estate and trades like a stock on an exchange, giving investors liquid, small-ticket exposure to real estate.</p>
<h3>Key valuation metrics</h3>
<ul>
<li><strong>NOI (Net Operating Income)</strong> — rental income minus operating expenses (before debt service).</li>
<li><strong>Cap rate (capitalization rate)</strong> — NOI ÷ property value; a rough measure of unlevered yield.</li>
<li><strong>Cash-on-cash return</strong> — annual cash flow ÷ actual cash invested (accounts for the mortgage/leverage used).</li>
</ul>
<h3>Types of REITs</h3>
<ul>
<li><strong>Equity REITs</strong> — own physical properties (offices, malls, apartments, warehouses) and earn rental income.</li>
<li><strong>Mortgage REITs (mREITs)</strong> — hold mortgages/mortgage-backed securities and earn interest income; more sensitive to interest rates.</li>
</ul>
<pre><code>Assumed example — cap rate:
 Property price = $2,000,000
 Annual rental income = $180,000, operating expenses = $60,000
 NOI = 180,000 - 60,000 = $120,000
 Cap rate = NOI / Price = 120,000 / 2,000,000 = 6%
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> REITs trade liquidity and diversification for lower control and correlation with the broader stock market compared to owning a building directly.</div>`,
    `<span class="eyebrow">ALI301 · Chương 4 · Bài 4.1</span>
<h2>Bất động sản &amp; REITs</h2>
<h3>Bất động sản trực tiếp vs. REITs</h3>
<p><strong>Bất động sản trực tiếp</strong> — mua một toà nhà vật lý — kém thanh khoản, cần nhiều vốn, và đòi hỏi quản lý chủ động. <strong>REIT (Quỹ tín thác đầu tư bất động sản)</strong> là công ty sở hữu/vận hành bất động sản tạo thu nhập và giao dịch như cổ phiếu trên sàn, cho nhà đầu tư tiếp cận bất động sản với thanh khoản và số vốn nhỏ.</p>
<h3>Các chỉ số định giá chính</h3>
<ul>
<li><strong>NOI (Thu nhập hoạt động ròng)</strong> — thu nhập cho thuê trừ chi phí vận hành (trước trả nợ vay).</li>
<li><strong>Cap rate (tỷ suất vốn hoá)</strong> — NOI ÷ giá trị bất động sản; thước đo tương đối cho suất sinh lời chưa dùng đòn bẩy.</li>
<li><strong>Cash-on-cash return</strong> — dòng tiền hàng năm ÷ số tiền mặt thực bỏ ra (tính đến đòn bẩy/vay thế chấp).</li>
</ul>
<h3>Các loại REIT</h3>
<ul>
<li><strong>Equity REIT</strong> — sở hữu bất động sản vật lý (văn phòng, trung tâm thương mại, căn hộ, kho bãi) và thu tiền thuê.</li>
<li><strong>Mortgage REIT (mREIT)</strong> — nắm giữ khoản vay thế chấp/chứng khoán bảo đảm bằng thế chấp và thu lãi; nhạy với lãi suất hơn.</li>
</ul>
<pre><code>Ví dụ giả định — cap rate:
 Giá bất động sản = 2.000.000 $
 Thu nhập cho thuê/năm = 180.000 $, chi phí vận hành = 60.000 $
 NOI = 180.000 - 60.000 = 120.000 $
 Cap rate = NOI / Giá = 120.000 / 2.000.000 = 6%
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> REIT đổi lấy thanh khoản và đa dạng hoá bằng việc giảm quyền kiểm soát và tương quan cao hơn với thị trường cổ phiếu chung, so với sở hữu trực tiếp một toà nhà.</div>`,
  ]]);

const c4q = quiz('ali301-quiz-4', 'Quiz 4 — Real estate & REITs|||Quiz 4 — Bất động sản & REITs', [
  { id: 'q1', question: 'Cap rate được tính bằng?', options: ['Giá / NOI', 'NOI / Giá trị bất động sản', 'Doanh thu / Chi phí', 'Nợ vay / Vốn chủ'], correctIndex: 1, explanation: 'Cap rate = Thu nhập hoạt động ròng (NOI) chia giá trị bất động sản.' },
  { id: 'q2', question: 'Ưu điểm chính của REIT so với sở hữu bất động sản trực tiếp là gì?', options: ['Kiểm soát tài sản tốt hơn', 'Thanh khoản cao hơn, vốn vào nhỏ hơn', 'Không có rủi ro lãi suất', 'Miễn thuế hoàn toàn'], correctIndex: 1, explanation: 'REIT giao dịch như cổ phiếu trên sàn nên thanh khoản cao và vốn vào nhỏ.' },
  { id: 'q3', question: 'Mortgage REIT (mREIT) khác Equity REIT ở điểm nào?', options: ['mREIT sở hữu toà nhà vật lý', 'mREIT nắm giữ khoản vay/chứng khoán thế chấp, thu lãi', 'mREIT không giao dịch trên sàn', 'Không có khác biệt'], correctIndex: 1, explanation: 'mREIT đầu tư vào khoản vay thế chấp thay vì sở hữu bất động sản vật lý.' },
]);

const c5 = doc('ali301-5-1-commodities-futures', '5.1 — Commodities & futures|||5.1 — Hàng hoá & hợp đồng tương lai',
  'Hàng hoá & hợp đồng tương lai; vì sao nắm giữ; contango vs backwardation, roll yield.',
  [[
    `<span class="eyebrow">ALI301 · Chapter 5 · Lesson 5.1</span>
<h2>Commodities &amp; futures</h2>
<h3>What are commodities?</h3>
<p><strong>Commodities</strong> are raw physical goods traded in bulk: energy (oil, natural gas), metals (gold, copper), and agriculture (wheat, coffee). Investors rarely hold the physical good directly — instead they use <strong>futures contracts</strong>, agreements to buy/sell a set quantity at a set price on a future date.</p>
<h3>Why hold commodities?</h3>
<ul>
<li><strong>Inflation hedge</strong> — commodity prices often rise with inflation.</li>
<li><strong>Diversification</strong> — historically low/negative correlation with stocks and bonds in many periods.</li>
<li><strong>Supply/demand exposure</strong> — a direct way to bet on economic growth or geopolitical events.</li>
</ul>
<h3>Contango vs. backwardation</h3>
<p>Because commodity investors mostly use futures (not physical storage), the shape of the futures curve matters:</p>
<ul>
<li><strong>Contango</strong> — futures prices are higher than the spot price; rolling contracts forward (selling the expiring one, buying the next) tends to <em>lose</em> money (negative roll yield).</li>
<li><strong>Backwardation</strong> — futures prices are lower than spot; rolling forward tends to <em>gain</em> money (positive roll yield).</li>
</ul>
<pre><code>Assumed example — roll yield in contango:
 Spot oil price = $70/barrel
 1-month futures = $70.50, 2-month futures = $71.00
 Selling the expiring $70.50 contract and buying the $71.00 one
 "loses" $0.50/barrel just from rolling -> contango drags on returns
</code></pre>
<div class="callout"><span class="badge">Watch out</span> A commodity index fund's return can differ a lot from the spot price move, because roll yield (contango/backwardation) adds or subtracts return on top of the price change itself.</div>`,
    `<span class="eyebrow">ALI301 · Chương 5 · Bài 5.1</span>
<h2>Hàng hoá &amp; hợp đồng tương lai</h2>
<h3>Hàng hoá là gì?</h3>
<p><strong>Hàng hoá (commodities)</strong> là hàng thực giao dịch số lượng lớn: năng lượng (dầu, khí đốt), kim loại (vàng, đồng), nông sản (lúa mì, cà phê). Nhà đầu tư hiếm khi nắm giữ hàng thực trực tiếp — thay vào đó họ dùng <strong>hợp đồng tương lai (futures)</strong>, thoả thuận mua/bán một lượng cố định với giá cố định vào một ngày trong tương lai.</p>
<h3>Vì sao nắm giữ hàng hoá?</h3>
<ul>
<li><strong>Chống lạm phát</strong> — giá hàng hoá thường tăng cùng lạm phát.</li>
<li><strong>Đa dạng hoá</strong> — trong lịch sử tương quan thấp/âm với cổ phiếu và trái phiếu ở nhiều giai đoạn.</li>
<li><strong>Tiếp cận cung/cầu</strong> — cách trực tiếp để đặt cược vào tăng trưởng kinh tế hoặc sự kiện địa chính trị.</li>
</ul>
<h3>Contango vs. backwardation</h3>
<p>Vì nhà đầu tư hàng hoá chủ yếu dùng hợp đồng tương lai (không lưu kho hàng thực), hình dạng đường cong tương lai rất quan trọng:</p>
<ul>
<li><strong>Contango</strong> — giá hợp đồng tương lai cao hơn giá giao ngay; chuyển hợp đồng (bán hợp đồng sắp đáo hạn, mua hợp đồng tiếp theo) có xu hướng <em>lỗ</em> (roll yield âm).</li>
<li><strong>Backwardation</strong> — giá hợp đồng tương lai thấp hơn giá giao ngay; chuyển hợp đồng có xu hướng <em>lời</em> (roll yield dương).</li>
</ul>
<pre><code>Ví dụ giả định — roll yield khi contango:
 Giá dầu giao ngay = 70 $/thùng
 Hợp đồng 1 tháng = 70,50 $, hợp đồng 2 tháng = 71,00 $
 Bán hợp đồng 70,50 $ sắp đáo hạn và mua hợp đồng 71,00 $
 "mất" 0,50 $/thùng chỉ vì chuyển hợp đồng -> contango kéo lùi lợi nhuận
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Lợi nhuận của quỹ chỉ số hàng hoá có thể khác nhiều so với biến động giá giao ngay, vì roll yield (contango/backwardation) cộng/trừ thêm lợi nhuận ngoài biến động giá.</div>`,
  ]]);

const c5q = quiz('ali301-quiz-5', 'Quiz 5 — Commodities & futures|||Quiz 5 — Hàng hoá & futures', [
  { id: 'q1', question: 'Vì sao nhà đầu tư hàng hoá thường dùng hợp đồng tương lai thay vì mua hàng thực?', options: ['Vì luật cấm mua hàng thực', 'Tránh chi phí lưu kho, bảo quản hàng thực', 'Vì giá luôn thấp hơn', 'Không có lý do đặc biệt'], correctIndex: 1, explanation: 'Futures tránh được chi phí lưu kho, vận chuyển, bảo quản hàng thực.' },
  { id: 'q2', question: 'Contango là gì?', options: ['Giá tương lai thấp hơn giá giao ngay', 'Giá tương lai cao hơn giá giao ngay', 'Giá hàng hoá luôn giảm', 'Không liên quan đến hợp đồng tương lai'], correctIndex: 1, explanation: 'Contango: đường cong futures dốc lên, giá xa hạn cao hơn giá giao ngay.' },
  { id: 'q3', question: 'Trong contango, việc chuyển hợp đồng (roll) có xu hướng?', options: ['Luôn có lời', 'Có xu hướng lỗ (roll yield âm)', 'Không ảnh hưởng gì', 'Chỉ ảnh hưởng vàng'], correctIndex: 1, explanation: 'Bán hợp đồng rẻ hơn mua hợp đồng đắt hơn khi roll -> roll yield âm.' },
]);

const c6 = doc('ali301-6-1-infrastructure-real-assets', '6.1 — Infrastructure & real assets|||6.1 — Hạ tầng & tài sản thực',
  'Tài sản hạ tầng (đường, sân bay, tiện ích); dòng tiền được quản lý; timberland & farmland.',
  [[
    `<span class="eyebrow">ALI301 · Chapter 6 · Lesson 6.1</span>
<h2>Infrastructure &amp; real assets</h2>
<h3>What is infrastructure investing?</h3>
<p><strong>Infrastructure assets</strong> are large, long-lived physical systems that provide essential services: toll roads, airports, ports, utilities (water, electricity), and telecom towers. They typically generate stable, predictable cash flows — often from regulated tariffs or long-term contracts — with 20-30+ year investment horizons.</p>
<h3>Why investors like infrastructure</h3>
<ul>
<li><strong>Stable, contracted cash flows</strong> — long-term concessions or regulated returns reduce cash-flow uncertainty.</li>
<li><strong>Inflation linkage</strong> — many contracts/tariffs are explicitly indexed to inflation.</li>
<li><strong>High barriers to entry</strong> — capital intensity and regulation limit competition once built.</li>
</ul>
<h3>Broader "real assets"</h3>
<p><strong>Real assets</strong> is the umbrella category: infrastructure, but also <strong>timberland</strong> (managed forests, harvested for lumber) and <strong>farmland</strong> (agricultural land, leased or farmed for crop income). All share tangibility, an inflation hedge role, and long holding periods.</p>
<pre><code>Assumed example — regulated utility cash flow:
 Regulated asset base = $500M, allowed return = 7%/year
 Expected annual cash flow ≈ 500M × 7% = $35M
 -> a "regulated return" model: the return is set by contract/regulator,
    not by market demand swings
</code></pre>
<div class="callout"><span class="badge">Risk to watch</span> Infrastructure is capital-intensive and highly illiquid; regulatory or political risk (a government renegotiating a concession) is a key downside not present in listed stocks.</div>`,
    `<span class="eyebrow">ALI301 · Chương 6 · Bài 6.1</span>
<h2>Hạ tầng &amp; tài sản thực</h2>
<h3>Đầu tư hạ tầng là gì?</h3>
<p><strong>Tài sản hạ tầng</strong> là các hệ thống vật lý lớn, tuổi thọ dài, cung cấp dịch vụ thiết yếu: đường cao tốc thu phí, sân bay, cảng biển, tiện ích công cộng (nước, điện), tháp viễn thông. Chúng thường tạo dòng tiền ổn định, dự đoán được — thường từ biểu giá được quản lý hoặc hợp đồng dài hạn — với thời gian đầu tư 20-30+ năm.</p>
<h3>Vì sao nhà đầu tư thích hạ tầng</h3>
<ul>
<li><strong>Dòng tiền ổn định, theo hợp đồng</strong> — nhượng quyền dài hạn hoặc lợi nhuận được quản lý giảm bất định về dòng tiền.</li>
<li><strong>Gắn với lạm phát</strong> — nhiều hợp đồng/biểu giá được chỉ số hoá rõ ràng theo lạm phát.</li>
<li><strong>Rào cản gia nhập cao</strong> — cường độ vốn và quy định hạn chế cạnh tranh sau khi đã xây dựng.</li>
</ul>
<h3>"Tài sản thực" rộng hơn</h3>
<p><strong>Tài sản thực (real assets)</strong> là danh mục bao trùm: hạ tầng, nhưng còn có <strong>đất rừng (timberland)</strong> (rừng được quản lý, khai thác lấy gỗ) và <strong>đất nông nghiệp (farmland)</strong> (đất canh tác, cho thuê hoặc canh tác lấy thu nhập mùa vụ). Tất cả đều có tính hữu hình, vai trò chống lạm phát, và thời gian nắm giữ dài.</p>
<pre><code>Ví dụ giả định — dòng tiền tiện ích được quản lý:
 Cơ sở tài sản được quản lý = 500 triệu $, lợi nhuận được phép = 7%/năm
 Dòng tiền kỳ vọng hàng năm ≈ 500 triệu × 7% = 35 triệu $
 -> mô hình "lợi nhuận được quản lý": lợi nhuận do hợp đồng/cơ quan quản lý
    quyết định, không do biến động cầu thị trường
</code></pre>
<div class="callout"><span class="badge">Rủi ro cần lưu ý</span> Hạ tầng cần nhiều vốn và rất kém thanh khoản; rủi ro quy định/chính trị (chính phủ đàm phán lại hợp đồng nhượng quyền) là điểm yếu chính không có ở cổ phiếu niêm yết.</div>`,
  ]]);

const c6q = quiz('ali301-quiz-6', 'Quiz 6 — Infrastructure & real assets|||Quiz 6 — Hạ tầng & tài sản thực', [
  { id: 'q1', question: 'Đặc điểm nổi bật của dòng tiền từ tài sản hạ tầng là gì?', options: ['Rất biến động, khó dự đoán', 'Ổn định, thường theo hợp đồng/quy định dài hạn', 'Luôn bằng 0', 'Chỉ có trong 1 năm'], correctIndex: 1, explanation: 'Hạ tầng thường có dòng tiền ổn định nhờ hợp đồng/nhượng quyền dài hạn.' },
  { id: 'q2', question: '"Tài sản thực" (real assets) bao gồm nhóm nào dưới đây?', options: ['Chỉ cổ phiếu công nghệ', 'Hạ tầng, đất rừng, đất nông nghiệp', 'Chỉ trái phiếu chính phủ', 'Chỉ tiền mặt'], correctIndex: 1, explanation: 'Real assets bao trùm hạ tầng, timberland, farmland và tài sản hữu hình khác.' },
  { id: 'q3', question: 'Rủi ro đặc trưng của đầu tư hạ tầng là gì?', options: ['Rủi ro quy định/chính trị (đàm phán lại nhượng quyền)', 'Không có rủi ro nào', 'Rủi ro tỷ giá duy nhất', 'Rủi ro thanh khoản bằng 0'], correctIndex: 0, explanation: 'Chính phủ có thể đàm phán lại hợp đồng nhượng quyền, đây là rủi ro đặc trưng.' },
]);

const c7 = doc('ali301-7-1-digital-assets-crypto', '7.1 — Digital assets/crypto as an alternative asset class|||7.1 — Tài sản số/crypto như một lớp tài sản thay thế',
  'Blockchain, tiền mã hoá; lý do đưa vào danh mục; rủi ro biến động, quy định, lưu ký, định giá.',
  [[
    `<span class="eyebrow">ALI301 · Chapter 7 · Lesson 7.1</span>
<h2>Digital assets/crypto as an alternative asset class</h2>
<h3>What are digital assets?</h3>
<p><strong>Cryptocurrencies</strong> (Bitcoin, Ethereum) and other <strong>digital assets</strong> (tokens, stablecoins) run on <strong>blockchain</strong> — a distributed, tamper-resistant ledger with no central authority. They've emerged as a new, highly debated candidate for the "alternative investments" bucket.</p>
<h3>Why some investors add crypto</h3>
<ul>
<li><strong>Potential diversification</strong> — historically low correlation with traditional assets in some periods (though this has been rising).</li>
<li><strong>Asymmetric return potential</strong> — a small allocation can meaningfully move a portfolio's return if it performs well.</li>
<li><strong>24/7 global, permissionless market</strong> — no market hours, no single gatekeeper.</li>
</ul>
<h3>Key risks</h3>
<ul>
<li><strong>Extreme volatility</strong> — price swings far larger than stocks or bonds.</li>
<li><strong>Regulatory uncertainty</strong> — rules vary by country and change quickly.</li>
<li><strong>Custody &amp; security risk</strong> — losing a private key or an exchange hack can mean a total loss, with no deposit insurance.</li>
<li><strong>Valuation difficulty</strong> — no cash flows to discount; value depends heavily on adoption and sentiment.</li>
</ul>
<pre><code>Assumed example — volatility comparison:
 Annualized volatility (illustrative):
   Large-cap stock index  ≈ 15-18%
   Government bonds       ≈ 5-8%
   Bitcoin                ≈ 60-80%
 -> even a 2-3% crypto allocation can add a lot of portfolio volatility
</code></pre>
<div class="callout"><span class="badge">Institutional view</span> Most institutions that allocate to crypto treat it as a small, high-risk "satellite" position (often under 5% of the portfolio) rather than a core holding.</div>`,
    `<span class="eyebrow">ALI301 · Chương 7 · Bài 7.1</span>
<h2>Tài sản số/crypto như một lớp tài sản thay thế</h2>
<h3>Tài sản số là gì?</h3>
<p><strong>Tiền mã hoá</strong> (Bitcoin, Ethereum) và các <strong>tài sản số</strong> khác (token, stablecoin) chạy trên <strong>blockchain</strong> — sổ cái phân tán, chống giả mạo, không có cơ quan trung ương. Chúng nổi lên như một ứng viên mới, gây nhiều tranh cãi, cho nhóm "đầu tư thay thế".</p>
<h3>Vì sao một số nhà đầu tư thêm crypto</h3>
<ul>
<li><strong>Tiềm năng đa dạng hoá</strong> — trong lịch sử tương quan thấp với tài sản truyền thống ở một số giai đoạn (dù đang tăng dần).</li>
<li><strong>Tiềm năng lợi nhuận bất đối xứng</strong> — một tỷ trọng nhỏ có thể tác động đáng kể đến lợi nhuận danh mục nếu diễn biến tốt.</li>
<li><strong>Thị trường toàn cầu 24/7, không cần xin phép</strong> — không giờ giao dịch cố định, không có một bên gác cổng duy nhất.</li>
</ul>
<h3>Rủi ro chính</h3>
<ul>
<li><strong>Biến động cực lớn</strong> — biên độ giá lớn hơn nhiều so với cổ phiếu hay trái phiếu.</li>
<li><strong>Bất định về quy định</strong> — luật khác nhau theo quốc gia và thay đổi nhanh.</li>
<li><strong>Rủi ro lưu ký &amp; bảo mật</strong> — mất private key hoặc sàn giao dịch bị hack có thể mất trắng, không có bảo hiểm tiền gửi.</li>
<li><strong>Khó định giá</strong> — không có dòng tiền để chiết khấu; giá trị phụ thuộc nhiều vào mức độ chấp nhận và tâm lý thị trường.</li>
</ul>
<pre><code>Ví dụ giả định — so sánh biến động:
 Biến động hàng năm (minh hoạ):
   Chỉ số cổ phiếu vốn hoá lớn  ≈ 15-18%
   Trái phiếu chính phủ          ≈ 5-8%
   Bitcoin                       ≈ 60-80%
 -> chỉ 2-3% tỷ trọng crypto cũng có thể thêm nhiều biến động cho danh mục
</code></pre>
<div class="callout"><span class="badge">Góc nhìn tổ chức</span> Hầu hết tổ chức phân bổ vào crypto coi đó là vị thế "vệ tinh" nhỏ, rủi ro cao (thường dưới 5% danh mục) chứ không phải nắm giữ cốt lõi.</div>`,
  ]]);

const c7q = quiz('ali301-quiz-7', 'Quiz 7 — Digital assets/crypto|||Quiz 7 — Tài sản số/crypto', [
  { id: 'q1', question: 'Crypto chạy trên nền tảng công nghệ nào?', options: ['Ngân hàng trung ương', 'Blockchain (sổ cái phân tán)', 'Sàn chứng khoán truyền thống', 'Quỹ tương hỗ'], correctIndex: 1, explanation: 'Crypto vận hành trên blockchain — sổ cái phân tán, không có cơ quan trung ương.' },
  { id: 'q2', question: 'Rủi ro ĐẶC TRƯNG của tài sản số so với cổ phiếu/trái phiếu là gì?', options: ['Không có rủi ro nào cả', 'Biến động cực lớn & rủi ro lưu ký/bảo mật', 'Luôn được bảo hiểm tiền gửi', 'Định giá dễ dàng bằng dòng tiền'], correctIndex: 1, explanation: 'Crypto biến động rất mạnh và có rủi ro mất private key/hack sàn, không bảo hiểm.' },
  { id: 'q3', question: 'Theo góc nhìn tổ chức phổ biến, crypto thường được phân bổ như thế nào trong danh mục?', options: ['Là nắm giữ cốt lõi trên 50%', 'Vị thế "vệ tinh" nhỏ, rủi ro cao (thường dưới 5%)', 'Không bao giờ được phân bổ', 'Luôn thay thế hoàn toàn trái phiếu'], correctIndex: 1, explanation: 'Hầu hết tổ chức coi crypto là vị thế vệ tinh nhỏ, không phải nắm giữ cốt lõi.' },
]);

const c8 = doc('ali301-8-1-risk-return-dd-allocation', '8.1 — Risk-return measurement, due diligence & portfolio allocation|||8.1 — Đo lường rủi ro-lợi nhuận, due diligence & phân bổ danh mục',
  'Sharpe, Sortino, max drawdown; due diligence đầu tư & vận hành; mô hình phân bổ kiểu quỹ hiến tặng.',
  [[
    `<span class="eyebrow">ALI301 · Chapter 8 · Lesson 8.1</span>
<h2>Risk-return measurement, due diligence &amp; portfolio allocation</h2>
<h3>Measuring risk-adjusted return</h3>
<ul>
<li><strong>Sharpe ratio</strong> — (portfolio return − risk-free rate) ÷ volatility (standard deviation); higher means more return per unit of total risk.</li>
<li><strong>Sortino ratio</strong> — like Sharpe, but only penalizes downside volatility (ignores upside swings) — often preferred for strategies with asymmetric returns.</li>
<li><strong>Maximum drawdown</strong> — the largest peak-to-trough decline; measures the worst pain an investor would have felt holding the strategy.</li>
</ul>
<h3>Due diligence on a manager/fund</h3>
<ul>
<li><strong>Investment due diligence</strong> — strategy, track record, how returns were actually generated (skill vs. luck vs. leverage).</li>
<li><strong>Operational due diligence</strong> — checking the fund's back office: an independent administrator/auditor, custody of assets, valuation policy — this is where many historical frauds (e.g. Madoff) were eventually caught.</li>
</ul>
<h3>Portfolio allocation: the "endowment model"</h3>
<p>Pioneered by university endowments (e.g. Yale), this approach allocates a large share (often 40-60%) to alternatives — private equity, hedge funds, real assets — betting that a long investment horizon and tolerance for illiquidity can be turned into higher long-run returns.</p>
<pre><code>Assumed example — Sharpe ratio:
 Portfolio A: return 10%, risk-free rate 3%, volatility 12%
 Sharpe = (10 - 3) / 12 = 0.58
 Portfolio B: return 8%, risk-free rate 3%, volatility 6%
 Sharpe = (8 - 3) / 6 = 0.83  -> B delivers more return per unit of risk
</code></pre>
<div class="callout"><span class="badge">Bottom line</span> Alternatives are judged not by return alone, but by risk-adjusted return, their correlation benefit to the whole portfolio, and — critically — whether the manager and its operations can be trusted.</div>`,
    `<span class="eyebrow">ALI301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường rủi ro-lợi nhuận, due diligence &amp; phân bổ danh mục</h2>
<h3>Đo lợi nhuận điều chỉnh theo rủi ro</h3>
<ul>
<li><strong>Sharpe ratio</strong> — (lợi nhuận danh mục − lãi suất phi rủi ro) ÷ biến động (độ lệch chuẩn); càng cao nghĩa là càng nhiều lợi nhuận trên mỗi đơn vị rủi ro tổng.</li>
<li><strong>Sortino ratio</strong> — giống Sharpe, nhưng chỉ phạt biến động chiều xuống (bỏ qua biến động chiều lên) — thường được ưa chuộng cho chiến lược có lợi nhuận bất đối xứng.</li>
<li><strong>Sụt giảm tối đa (max drawdown)</strong> — mức giảm lớn nhất từ đỉnh xuống đáy; đo "nỗi đau" tệ nhất nhà đầu tư trải qua khi nắm giữ chiến lược.</li>
</ul>
<h3>Due diligence với người quản lý/quỹ</h3>
<ul>
<li><strong>Due diligence đầu tư</strong> — chiến lược, thành tích, lợi nhuận thực sự đến từ đâu (kỹ năng vs. may mắn vs. đòn bẩy).</li>
<li><strong>Due diligence vận hành</strong> — kiểm tra hậu trường của quỹ: đơn vị quản trị/kiểm toán độc lập, lưu ký tài sản, chính sách định giá — đây là nơi nhiều vụ gian lận lịch sử (vd Madoff) cuối cùng bị phát hiện.</li>
</ul>
<h3>Phân bổ danh mục: "mô hình quỹ hiến tặng"</h3>
<p>Được các quỹ hiến tặng đại học tiên phong (vd Yale), cách tiếp cận này phân bổ tỷ trọng lớn (thường 40-60%) vào tài sản thay thế — private equity, quỹ đầu cơ, tài sản thực — đặt cược rằng thời gian đầu tư dài và khả năng chịu kém thanh khoản có thể chuyển thành lợi nhuận dài hạn cao hơn.</p>
<pre><code>Ví dụ giả định — Sharpe ratio:
 Danh mục A: lợi nhuận 10%, lãi suất phi rủi ro 3%, biến động 12%
 Sharpe = (10 - 3) / 12 = 0,58
 Danh mục B: lợi nhuận 8%, lãi suất phi rủi ro 3%, biến động 6%
 Sharpe = (8 - 3) / 6 = 0,83  -> B mang lại nhiều lợi nhuận hơn trên mỗi đơn vị rủi ro
</code></pre>
<div class="callout"><span class="badge">Kết luận</span> Tài sản thay thế không chỉ được đánh giá bằng lợi nhuận, mà bằng lợi nhuận điều chỉnh rủi ro, lợi ích tương quan với cả danh mục, và — quan trọng không kém — liệu người quản lý và bộ máy vận hành có đáng tin cậy hay không.</div>`,
  ]]);

const c8q = quiz('ali301-quiz-8', 'Quiz 8 — Risk-return, due diligence & allocation|||Quiz 8 — Rủi ro-lợi nhuận, due diligence & phân bổ', [
  { id: 'q1', question: 'Sharpe ratio đo điều gì?', options: ['Chỉ lợi nhuận tuyệt đối', 'Lợi nhuận trên mỗi đơn vị rủi ro tổng (biến động)', 'Chỉ mức sụt giảm tối đa', 'Chỉ phí quản lý quỹ'], correctIndex: 1, explanation: 'Sharpe = phần bù lợi nhuận chia cho độ lệch chuẩn (biến động).' },
  { id: 'q2', question: 'Due diligence vận hành (operational due diligence) tập trung kiểm tra điều gì?', options: ['Chỉ chiến lược đầu tư', 'Hậu trường quỹ: kiểm toán độc lập, lưu ký, định giá', 'Chỉ lịch sử giá cổ phiếu', 'Chỉ tốc độ tăng trưởng doanh thu'], correctIndex: 1, explanation: 'Operational DD kiểm tra back office: kiểm toán, lưu ký tài sản, chính sách định giá.' },
  { id: 'q3', question: '"Mô hình quỹ hiến tặng" (endowment model) đặc trưng bởi điều gì?', options: ['Chỉ đầu tư trái phiếu chính phủ', 'Phân bổ tỷ trọng lớn vào tài sản thay thế nhờ thời gian đầu tư dài', 'Tránh hoàn toàn cổ phiếu', 'Chỉ dùng cho quỹ hưu trí nhỏ'], correctIndex: 1, explanation: 'Endowment model (vd Yale) phân bổ 40-60% vào tài sản thay thế nhờ thời gian đầu tư dài hạn.' },
]);

const taiLieu = doc('ali301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách/giáo trình CAIA & CFA, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ALI301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Alternative Investment — hedge funds, private equity &amp; venture capital, real estate, commodities, infrastructure and digital assets — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references used by the CAIA and CFA curricula.</p>
<h3>📘 Curriculum &amp; textbook</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ALI301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books &amp; curricula</h3>
<ul>
<li><a href="https://caia.org/caia-program/curriculum" target="_blank" rel="noopener">CAIA Association — Level I curriculum</a> — the industry-standard body of knowledge for alternative investments.</li>
<li><a href="https://www.wiley.com/en-us/CAIA+Level+I%3A+An+Introduction+to+Core+Topics+in+Alternative+Investments%2C+4th+Edition-p-9781119850141" target="_blank" rel="noopener">Chambers, Black &amp; Lai — <em>CAIA Level I: An Introduction to Core Topics in Alternative Investments</em></a></li>
<li><a href="https://www.wiley.com/en-us/Investments-p-9781260013825" target="_blank" rel="noopener">Bodie, Kane &amp; Marcus — <em>Investments</em></a> (alternative investment chapters)</li>
<li><a href="https://www.cfainstitute.org/en/programs/cfa/curriculum" target="_blank" rel="noopener">CFA Institute — CFA Program curriculum</a> (alternative investments topic area)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/a/alternative_investment.asp" target="_blank" rel="noopener">Investopedia — Alternative Investment</a></li>
<li><a href="https://www.preqin.com/insights" target="_blank" rel="noopener">Preqin Insights</a> — free industry research on private equity, hedge funds, real assets.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — valuation &amp; corporate finance (NYU Stern) lectures.</li>
<li><a href="https://www.youtube.com/@WallStreetMojo" target="_blank" rel="noopener">WallStreetMojo</a> — explainers on private equity, hedge funds, REITs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.preqin.com/" target="_blank" rel="noopener">Preqin</a> — private markets data (private equity, hedge funds, real assets).</li>
<li><a href="https://www.reit.com/" target="_blank" rel="noopener">Nareit</a> — REIT industry data &amp; education.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — what makes an asset "alternative", the role of alternatives in a portfolio, hedge fund and private equity structures.</li>
<li><strong>Practice</strong> — work the cap rate, Sharpe ratio and fee examples until the formulas feel natural.</li>
<li><strong>Go deeper</strong> — real estate, commodities, infrastructure, and how digital assets fit (or don't) into the alternatives bucket.</li>
<li><strong>Job-ready</strong> — read a real fund's due diligence questionnaire (DDQ) and a REIT's annual report.</li>
</ol></div>`,
    `<span class="eyebrow">ALI301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Đầu tư thay thế — quỹ đầu cơ, private equity &amp; vốn mạo hiểm, bất động sản, hàng hoá, hạ tầng và tài sản số — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là tài liệu miễn phí, hợp pháp được dùng trong giáo trình CAIA và CFA.</p>
<h3>📘 Giáo trình &amp; sách</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ALI301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách &amp; giáo trình tham khảo</h3>
<ul>
<li><a href="https://caia.org/caia-program/curriculum" target="_blank" rel="noopener">CAIA Association — Giáo trình Level I</a> — khung kiến thức chuẩn ngành cho đầu tư thay thế.</li>
<li><a href="https://www.wiley.com/en-us/CAIA+Level+I%3A+An+Introduction+to+Core+Topics+in+Alternative+Investments%2C+4th+Edition-p-9781119850141" target="_blank" rel="noopener">Chambers, Black &amp; Lai — <em>CAIA Level I: An Introduction to Core Topics in Alternative Investments</em></a></li>
<li><a href="https://www.wiley.com/en-us/Investments-p-9781260013825" target="_blank" rel="noopener">Bodie, Kane &amp; Marcus — <em>Investments</em></a> (các chương về đầu tư thay thế)</li>
<li><a href="https://www.cfainstitute.org/en/programs/cfa/curriculum" target="_blank" rel="noopener">CFA Institute — Giáo trình CFA Program</a> (mảng đầu tư thay thế)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.investopedia.com/terms/a/alternative_investment.asp" target="_blank" rel="noopener">Investopedia — Alternative Investment</a></li>
<li><a href="https://www.preqin.com/insights" target="_blank" rel="noopener">Preqin Insights</a> — nghiên cứu ngành miễn phí về private equity, quỹ đầu cơ, tài sản thực.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AswathDamodaranonValuation" target="_blank" rel="noopener">Aswath Damodaran</a> — bài giảng định giá &amp; tài chính doanh nghiệp (NYU Stern).</li>
<li><a href="https://www.youtube.com/@WallStreetMojo" target="_blank" rel="noopener">WallStreetMojo</a> — giải thích private equity, quỹ đầu cơ, REITs.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.preqin.com/" target="_blank" rel="noopener">Preqin</a> — dữ liệu thị trường tư nhân (private equity, quỹ đầu cơ, tài sản thực).</li>
<li><a href="https://www.reit.com/" target="_blank" rel="noopener">Nareit</a> — dữ liệu &amp; kiến thức ngành REIT.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — điều gì làm một tài sản "thay thế", vai trò của tài sản thay thế trong danh mục, cấu trúc quỹ đầu cơ và private equity.</li>
<li><strong>Luyện tập</strong> — làm các ví dụ cap rate, Sharpe ratio, phí quỹ đến khi công thức trở nên tự nhiên.</li>
<li><strong>Đào sâu thực tế</strong> — bất động sản, hàng hoá, hạ tầng, và tài sản số phù hợp (hay không) với nhóm tài sản thay thế thế nào.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc một bảng câu hỏi due diligence (DDQ) quỹ thật và báo cáo thường niên của một REIT.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'ALI301',
    slug: 'ali301-alternative-investment',
    title: 'Alternative Investment',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ALI301.webp',
    shortDescription: 'Alternative investments beyond stocks & bonds: hedge funds, private equity & VC, real estate & REITs, commodities, real assets and crypto — plus risk-return, due diligence & portfolio allocation.|||Đầu tư thay thế ngoài cổ phiếu & trái phiếu: quỹ đầu cơ, private equity & VC, bất động sản & REITs, hàng hoá, tài sản thực và crypto — cùng rủi ro-lợi nhuận, due diligence & phân bổ danh mục.',
    description: 'Môn <strong>ALI301 — Alternative Investment</strong> (kỳ 4, khối Quản trị Kinh doanh) giới thiệu các lớp tài sản nằm ngoài cổ phiếu và trái phiếu truyền thống. Từ <strong>tổng quan và vai trò trong danh mục</strong> → <strong>quỹ đầu cơ</strong> (chiến lược, phí "2 và 20") → <strong>private equity và vốn mạo hiểm</strong> (GP/LP, LBO, đường cong chữ J) → <strong>bất động sản và REITs</strong> (NOI, cap rate) → <strong>hàng hoá và hợp đồng tương lai</strong> (contango/backwardation) → <strong>hạ tầng và tài sản thực</strong> → <strong>tài sản số/crypto</strong> → <strong>đo lường rủi ro-lợi nhuận, due diligence và phân bổ danh mục</strong> (Sharpe ratio, mô hình quỹ hiến tặng). Bám khung CAIA/CFA, song ngữ, có ví dụ tính toán giả định và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt tài sản thay thế và tài sản truyền thống, vai trò đa dạng hoá trong danh mục; cấu trúc và chiến lược quỹ đầu cơ (long/short, macro, event-driven, arbitrage), phí "2 và 20"; private equity và vốn mạo hiểm (GP/LP, LBO, các vòng gọi vốn, đường cong chữ J); bất động sản trực tiếp và REITs (NOI, cap rate, cash-on-cash); hàng hoá và hợp đồng tương lai (contango, backwardation, roll yield); hạ tầng và tài sản thực (timberland, farmland); tài sản số/crypto như một lớp tài sản thay thế và rủi ro của nó; đo lường rủi ro-lợi nhuận (Sharpe, Sortino, max drawdown), due diligence đầu tư và vận hành, mô hình phân bổ danh mục kiểu quỹ hiến tặng.',
    requirements: 'Kiến thức tài chính doanh nghiệp và đầu tư cơ bản (đã học các môn nền về tài chính). Xem điều kiện tiên quyết chi tiết trong khung chương trình khối Quản trị Kinh doanh trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách/giáo trình CAIA & CFA, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đầu tư thay thế là gì, vai trò trong danh mục.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & vai trò trong danh mục|||Chapter 1 — Overview & portfolio role', description: 'Thay thế vs truyền thống, đa dạng hoá, đánh đổi.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quỹ đầu cơ & chiến lược|||Chapter 2 — Hedge funds & strategies', description: 'Phí "2 và 20", long/short, macro, event-driven, arbitrage.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Private equity & vốn mạo hiểm|||Chapter 3 — Private equity & VC', description: 'GP/LP, LBO, các vòng gọi vốn VC, đường cong chữ J.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bất động sản & REITs|||Chapter 4 — Real estate & REITs', description: 'NOI, cap rate, equity REIT & mortgage REIT.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hàng hoá & hợp đồng tương lai|||Chapter 5 — Commodities & futures', description: 'Futures, contango/backwardation, roll yield.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hạ tầng & tài sản thực|||Chapter 6 — Infrastructure & real assets', description: 'Dòng tiền ổn định, timberland, farmland.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tài sản số/crypto|||Chapter 7 — Digital assets/crypto', description: 'Blockchain, biến động, rủi ro lưu ký.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rủi ro-lợi nhuận, due diligence & phân bổ|||Chapter 8 — Risk-return, due diligence & allocation', description: 'Sharpe/Sortino, due diligence, mô hình quỹ hiến tặng.', lessons: [c8, c8q] },
  ],
};
