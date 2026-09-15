/**
 * IBF301 — International Finance. Giáo trình FLM (khối BBA, kỳ 4), tham khảo
 * Eun/Resnick "International Financial Management", Madura "International
 * Financial Management", Shapiro "Multinational Financial Management".
 * 8 chương: môi trường tiền tệ quốc tế · FX & tỷ giá · thuyết tỷ giá (PPP/IRP/
 * Fisher) · phòng ngừa rủi ro tỷ giá · tài trợ thương mại · đầu tư & chi phí
 * vốn đa quốc gia · vốn lưu động đa quốc gia · khủng hoảng & định chế (IMF/WB).
 * Song ngữ + ví dụ GIẢ ĐỊNH + quiz. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ibf301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Eun/Resnick, Madura, Shapiro), tài liệu chính thức miễn phí, YouTube, công cụ tra tỷ giá, lộ trình tự học.',
  [[
    `<span class="eyebrow">IBF301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn International Finance — FX markets, exchange rate theories, hedging, trade finance, and multinational capital &amp; working-capital management — in one place. The official FPTU slides live on <strong>FLM</strong>; below are the reference textbooks and free resources this course draws on.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>International Financial Management</em> — Cheol S. Eun &amp; Bruce G. Resnick</li>
<li><em>International Financial Management</em> — Jeff Madura</li>
<li><em>Multinational Financial Management</em> — Alan C. Shapiro</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.imf.org/en/Topics/imf-and-covid19/imf-financial-resources-and-response-to-covid-19" target="_blank" rel="noopener">IMF — About the IMF &amp; publications</a></li>
<li><a href="https://www.worldbank.org/en/about" target="_blank" rel="noopener">World Bank — About &amp; data</a></li>
<li><a href="https://www.bis.org/statistics/rpfx19.htm" target="_blank" rel="noopener">BIS — Foreign exchange market statistics</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — currencies, trade &amp; monetary systems</li>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — international finance concepts</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noopener">XE Currency Converter</a> — live &amp; historical exchange rates</li>
<li><a href="https://fred.stlouisfed.org/categories/15" target="_blank" rel="noopener">FRED — exchange rate &amp; interest rate data</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the international monetary environment, the FX market, and how spot/forward rates are quoted.</li>
<li><strong>Theory core</strong> — PPP, IRP and the Fisher effect: how prices, rates and inflation stay linked.</li>
<li><strong>Practice</strong> — hedge a hypothetical exposure with a forward, an option and a swap; compare outcomes.</li>
<li><strong>Applied</strong> — trade finance instruments, capital budgeting for a foreign project, multinational cash management, and the lessons of past currency crises.</li>
</ol></div>`,
    `<span class="eyebrow">IBF301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Tài chính quốc tế — thị trường ngoại hối, các thuyết tỷ giá, phòng ngừa rủi ro, tài trợ thương mại, và quản trị vốn/đầu tư đa quốc gia — gom về một chỗ. Slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là các giáo trình tham khảo và nguồn miễn phí môn này dựa vào.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>International Financial Management</em> — Cheol S. Eun &amp; Bruce G. Resnick</li>
<li><em>International Financial Management</em> — Jeff Madura</li>
<li><em>Multinational Financial Management</em> — Alan C. Shapiro</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.imf.org/en/Topics/imf-and-covid19/imf-financial-resources-and-response-to-covid-19" target="_blank" rel="noopener">IMF — Giới thiệu &amp; ấn phẩm</a></li>
<li><a href="https://www.worldbank.org/en/about" target="_blank" rel="noopener">World Bank — Giới thiệu &amp; dữ liệu</a></li>
<li><a href="https://www.bis.org/statistics/rpfx19.htm" target="_blank" rel="noopener">BIS — Thống kê thị trường ngoại hối</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — tiền tệ, thương mại &amp; hệ thống tiền tệ</li>
<li><a href="https://www.youtube.com/@MarginalRevolutionUniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — khái niệm tài chính quốc tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noopener">XE Currency Converter</a> — tỷ giá trực tiếp &amp; lịch sử</li>
<li><a href="https://fred.stlouisfed.org/categories/15" target="_blank" rel="noopener">FRED — dữ liệu tỷ giá &amp; lãi suất</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — môi trường tiền tệ quốc tế, thị trường ngoại hối, cách yết tỷ giá giao ngay/kỳ hạn.</li>
<li><strong>Lõi lý thuyết</strong> — PPP, IRP và hiệu ứng Fisher: giá cả, lãi suất và lạm phát gắn với nhau ra sao.</li>
<li><strong>Luyện tập</strong> — phòng ngừa một khoản phơi nhiễm giả định bằng forward, option và swap; so sánh kết quả.</li>
<li><strong>Ứng dụng</strong> — công cụ tài trợ thương mại, thẩm định dự án đầu tư nước ngoài, quản trị tiền mặt đa quốc gia, và bài học từ các cuộc khủng hoảng tiền tệ.</li>
</ol></div>`,
  ]]);

const intro = doc('ibf301-0-1-overview', 'Course overview: International Finance|||Tổng quan: Tài chính quốc tế',
  'Tài chính quốc tế khác gì tài chính nội địa; lộ trình môn: môi trường tiền tệ → FX & tỷ giá → thuyết tỷ giá → phòng ngừa rủi ro → tài trợ thương mại → đầu tư & chi phí vốn → vốn lưu động → khủng hoảng & định chế.',
  [[
    `<span class="eyebrow">IBF301 · Lesson 0.1 · Overview</span>
<h2>International Finance</h2>
<p class="lead">This course studies how firms, banks and governments manage money that crosses borders — trade payments, investment, and financing — when currencies, interest rates and regulations differ by country. It builds directly on corporate finance, adding one new variable: <strong>the exchange rate</strong>.</p>
<h3>Why it's a distinct field</h3>
<ul>
<li><strong>Foreign exchange risk</strong> — the value of a foreign cash flow in home currency changes as rates move.</li>
<li><strong>Political &amp; country risk</strong> — capital controls, expropriation, sudden regulatory change.</li>
<li><strong>Market imperfections</strong> — taxes, capital controls and information gaps differ by country, creating both risk and opportunity.</li>
</ul>
<h3>Roadmap</h3>
<p>International monetary environment &amp; FX market basics → exchange rate theories (PPP, IRP, Fisher) → hedging FX risk (forward, option, swap) → trade finance → international investment decisions &amp; cost of capital → multinational working capital → financial crises &amp; institutions (IMF, World Bank).</p>`,
    `<span class="eyebrow">IBF301 · Bài 0.1 · Tổng quan</span>
<h2>Tài chính quốc tế</h2>
<p class="lead">Môn này nghiên cứu cách doanh nghiệp, ngân hàng và chính phủ quản lý dòng tiền vượt biên giới — thanh toán thương mại, đầu tư, tài trợ — khi tiền tệ, lãi suất và quy định khác nhau giữa các quốc gia. Nó xây trực tiếp trên tài chính doanh nghiệp, thêm một biến mới: <strong>tỷ giá hối đoái</strong>.</p>
<h3>Vì sao là một lĩnh vực riêng</h3>
<ul>
<li><strong>Rủi ro tỷ giá</strong> — giá trị một dòng tiền ngoại tệ tính bằng nội tệ thay đổi theo tỷ giá.</li>
<li><strong>Rủi ro chính trị &amp; quốc gia</strong> — kiểm soát vốn, tước quyền sở hữu, thay đổi quy định bất ngờ.</li>
<li><strong>Bất hoàn hảo thị trường</strong> — thuế, kiểm soát vốn và bất cân xứng thông tin khác nhau giữa các nước, tạo ra cả rủi ro và cơ hội.</li>
</ul>
<h3>Lộ trình</h3>
<p>Môi trường tiền tệ quốc tế &amp; nền tảng thị trường ngoại hối → các thuyết tỷ giá (PPP, IRP, Fisher) → phòng ngừa rủi ro tỷ giá (forward, option, swap) → tài trợ thương mại → quyết định đầu tư quốc tế &amp; chi phí vốn → vốn lưu động đa quốc gia → khủng hoảng tài chính &amp; định chế (IMF, World Bank).</p>`,
  ]]);

const c1 = doc('ibf301-1-1-monetary-environment', '1.1 — International finance & the international monetary environment|||1.1 — Tài chính quốc tế & môi trường tiền tệ quốc tế',
  'Vì sao tài chính quốc tế khác tài chính nội địa; các hệ thống tiền tệ quốc tế (chuẩn vàng, Bretton Woods, thả nổi sau 1973); cán cân thanh toán.',
  [[
    `<span class="eyebrow">IBF301 · Chapter 1 · Lesson 1.1</span>
<h2>International finance &amp; the international monetary environment</h2>
<h3>What makes it different</h3>
<ul>
<li><strong>Foreign exchange risk</strong> — cash flows and asset values change in value as exchange rates move.</li>
<li><strong>Political risk</strong> — expropriation, capital controls, unexpected regulatory change.</li>
<li><strong>Market imperfections</strong> — differing tax regimes, capital controls, and information asymmetry across countries.</li>
<li><strong>Expanded opportunity set</strong> — access to foreign markets, cheaper financing, and diversification benefits.</li>
</ul>
<h3>Evolution of the international monetary system</h3>
<ul>
<li><strong>Gold standard (pre-1914)</strong> — each currency's value fixed to a quantity of gold.</li>
<li><strong>Bretton Woods (1944–1973)</strong> — currencies pegged to the USD, the USD pegged to gold; the IMF and World Bank were created.</li>
<li><strong>Post-1973 — flexible rate regimes</strong> — market-determined floating rates, managed floats, currency boards, and currency unions (e.g. the euro).</li>
</ul>
<h3>The balance of payments (BOP)</h3>
<p>A country's BOP records all transactions with the rest of the world: the <strong>current account</strong> (trade in goods/services, income, transfers) and the <strong>capital/financial account</strong> (investment flows). A current-account deficit must be financed by a capital-account surplus (or reserve changes) — the BOP always balances by construction.</p>
<pre><code>Example (hypothetical):
 Country A: exports 500, imports 620 -> current account = -120
 To balance, capital account must show +120 (net capital inflow)
 e.g. foreign investors buying 120 of Country A's bonds
</code></pre>
<div class="callout"><span class="badge">Course goal</span> Understand the FX market, the theories linking prices/rates/inflation, how to hedge exposure, and how multinational firms finance trade, invest, and manage capital across currencies.</div>`,
    `<span class="eyebrow">IBF301 · Chương 1 · Bài 1.1</span>
<h2>Tài chính quốc tế &amp; môi trường tiền tệ quốc tế</h2>
<h3>Điều gì làm nó khác biệt</h3>
<ul>
<li><strong>Rủi ro tỷ giá</strong> — dòng tiền và giá trị tài sản thay đổi khi tỷ giá biến động.</li>
<li><strong>Rủi ro chính trị</strong> — tước quyền sở hữu, kiểm soát vốn, thay đổi quy định bất ngờ.</li>
<li><strong>Bất hoàn hảo thị trường</strong> — chế độ thuế, kiểm soát vốn và bất cân xứng thông tin khác nhau giữa các nước.</li>
<li><strong>Tập cơ hội mở rộng</strong> — tiếp cận thị trường nước ngoài, tài trợ rẻ hơn, lợi ích đa dạng hoá.</li>
</ul>
<h3>Sự tiến hoá của hệ thống tiền tệ quốc tế</h3>
<ul>
<li><strong>Chuẩn vàng (trước 1914)</strong> — giá trị mỗi tiền tệ cố định theo một lượng vàng.</li>
<li><strong>Bretton Woods (1944–1973)</strong> — các tiền tệ neo vào USD, USD neo vào vàng; IMF và World Bank ra đời.</li>
<li><strong>Sau 1973 — chế độ tỷ giá linh hoạt</strong> — thả nổi theo thị trường, thả nổi có quản lý, hội đồng tiền tệ, và liên minh tiền tệ (vd đồng euro).</li>
</ul>
<h3>Cán cân thanh toán (BOP)</h3>
<p>BOP của một quốc gia ghi lại mọi giao dịch với phần còn lại của thế giới: <strong>tài khoản vãng lai</strong> (thương mại hàng hoá/dịch vụ, thu nhập, chuyển giao) và <strong>tài khoản vốn/tài chính</strong> (dòng đầu tư). Thâm hụt tài khoản vãng lai phải được bù bằng thặng dư tài khoản vốn (hoặc thay đổi dự trữ) — BOP luôn cân bằng theo cấu trúc.</p>
<pre><code>Ví dụ (giả định):
 Quốc gia A: xuất khẩu 500, nhập khẩu 620 -> tài khoản vãng lai = -120
 Để cân bằng, tài khoản vốn phải là +120 (dòng vốn vào thuần)
 vd nhà đầu tư nước ngoài mua 120 trái phiếu của quốc gia A
</code></pre>
<div class="callout"><span class="badge">Mục tiêu môn học</span> Hiểu thị trường ngoại hối, các thuyết gắn kết giá cả/tỷ giá/lạm phát, cách phòng ngừa phơi nhiễm, và cách doanh nghiệp đa quốc gia tài trợ thương mại, đầu tư và quản trị vốn qua nhiều tiền tệ.</div>`,
  ]]);

const c1q = quiz('ibf301-quiz-1', 'Quiz 1 — Môi trường tiền tệ quốc tế|||Quiz 1 — International monetary environment', [
  { id: 'q1', question: 'Hệ thống Bretton Woods (1944–1973) hoạt động theo cơ chế nào?', options: ['Thả nổi hoàn toàn theo thị trường', 'Các tiền tệ neo vào USD, USD neo vào vàng', 'Mỗi nước tự in tiền không neo gì', 'Chuẩn bạc'], correctIndex: 1, explanation: 'Bretton Woods: tiền tệ neo USD, USD neo vàng; IMF & World Bank ra đời từ đây.' },
  { id: 'q2', question: 'Rủi ro nào KHÔNG xuất hiện trong tài chính nội địa nhưng là đặc trưng của tài chính quốc tế?', options: ['Rủi ro lãi suất', 'Rủi ro tỷ giá', 'Rủi ro tín dụng', 'Rủi ro thanh khoản'], correctIndex: 1, explanation: 'Rủi ro tỷ giá — giá trị nội tệ của dòng tiền ngoại tệ thay đổi theo tỷ giá — là biến mới của tài chính quốc tế.' },
  { id: 'q3', question: 'Nếu tài khoản vãng lai của một nước thâm hụt, điều gì phải xảy ra để cán cân thanh toán (BOP) cân bằng?', options: ['Tài khoản vốn phải thặng dư tương ứng', 'Không cần gì, BOP có thể mất cân bằng vĩnh viễn', 'Ngân hàng trung ương phải in thêm tiền', 'Xuất khẩu phải giảm thêm'], correctIndex: 0, explanation: 'BOP luôn cân bằng theo cấu trúc: thâm hụt vãng lai được bù bằng thặng dư vốn/tài chính (hoặc thay đổi dự trữ).' },
]);

const c2 = doc('ibf301-2-1-fx-market', '2.1 — Foreign exchange markets & exchange rates|||2.1 — Thị trường ngoại hối & tỷ giá',
  'Cấu trúc thị trường FX (giao ngay/kỳ hạn, OTC, các bên tham gia); cách yết tỷ giá (trực tiếp/gián tiếp, bid-ask); tỷ giá chéo.',
  [[
    `<span class="eyebrow">IBF301 · Chapter 2 · Lesson 2.1</span>
<h2>Foreign exchange markets &amp; exchange rates</h2>
<h3>The FX market</h3>
<p>The foreign exchange market is the largest financial market in the world, trading mostly <strong>over-the-counter (OTC)</strong> — no central exchange. Participants include commercial banks, central banks, corporations, and speculators. It trades <strong>spot</strong> (settlement in ~2 business days) and <strong>forward</strong> (settlement at a future date, rate fixed today) contracts.</p>
<h3>Quoting exchange rates</h3>
<ul>
<li><strong>Direct quote</strong> — home currency price of one unit of foreign currency (e.g. from a Vietnamese view: VND per USD).</li>
<li><strong>Indirect quote</strong> — foreign currency price of one unit of home currency.</li>
<li><strong>Bid-ask spread</strong> — a bank buys foreign currency at the (lower) <em>bid</em> and sells at the (higher) <em>ask</em>; the spread is the dealer's compensation.</li>
</ul>
<h3>Cross rates</h3>
<p>When a direct quote between two currencies isn't available, compute it through a common third currency (usually USD).</p>
<pre><code>Example (hypothetical):
 USD/VND = 25,000   (1 USD = 25,000 VND)
 USD/JPY = 150       (1 USD = 150 JPY)
 Cross rate JPY/VND = USD/VND / USD/JPY = 25,000 / 150 ~ 166.7
 -> 1 JPY ~ 166.7 VND
</code></pre>
<div class="callout"><span class="badge">Note</span> A wider bid-ask spread usually signals a less liquid currency pair or higher dealer risk.</div>`,
    `<span class="eyebrow">IBF301 · Chương 2 · Bài 2.1</span>
<h2>Thị trường ngoại hối &amp; tỷ giá</h2>
<h3>Thị trường FX</h3>
<p>Thị trường ngoại hối là thị trường tài chính lớn nhất thế giới, giao dịch chủ yếu <strong>phi tập trung (OTC)</strong> — không qua một sở giao dịch trung tâm. Các bên tham gia gồm ngân hàng thương mại, ngân hàng trung ương, doanh nghiệp, và nhà đầu cơ. Thị trường giao dịch hợp đồng <strong>giao ngay (spot)</strong> (thanh toán trong ~2 ngày làm việc) và <strong>kỳ hạn (forward)</strong> (thanh toán vào một ngày trong tương lai, tỷ giá cố định ngay hôm nay).</p>
<h3>Cách yết tỷ giá</h3>
<ul>
<li><strong>Yết trực tiếp</strong> — giá nội tệ của một đơn vị ngoại tệ (vd theo góc nhìn Việt Nam: VND trên mỗi USD).</li>
<li><strong>Yết gián tiếp</strong> — giá ngoại tệ của một đơn vị nội tệ.</li>
<li><strong>Chênh lệch mua-bán (bid-ask spread)</strong> — ngân hàng mua ngoại tệ ở giá <em>bid</em> (thấp hơn) và bán ở giá <em>ask</em> (cao hơn); chênh lệch là phần bù cho nhà giao dịch.</li>
</ul>
<h3>Tỷ giá chéo</h3>
<p>Khi không có yết trực tiếp giữa hai tiền tệ, tính qua một tiền tệ trung gian (thường là USD).</p>
<pre><code>Ví dụ (giả định):
 USD/VND = 25.000   (1 USD = 25.000 VND)
 USD/JPY = 150       (1 USD = 150 JPY)
 Tỷ giá chéo JPY/VND = USD/VND / USD/JPY = 25.000 / 150 ~ 166,7
 -> 1 JPY ~ 166,7 VND
</code></pre>
<div class="callout"><span class="badge">Ghi chú</span> Chênh lệch mua-bán rộng thường báo hiệu một cặp tiền kém thanh khoản hoặc rủi ro cho nhà giao dịch cao hơn.</div>`,
  ]]);

const c2q = quiz('ibf301-quiz-2', 'Quiz 2 — Thị trường ngoại hối & tỷ giá|||Quiz 2 — FX markets & exchange rates', [
  { id: 'q1', question: 'Thị trường ngoại hối (FX) giao dịch chủ yếu theo cơ chế nào?', options: ['Qua một sở giao dịch trung tâm duy nhất', 'Phi tập trung (OTC), không qua sở trung tâm', 'Chỉ qua ngân hàng trung ương', 'Chỉ giao dịch một lần mỗi ngày'], correctIndex: 1, explanation: 'FX là thị trường OTC lớn nhất thế giới, không có sở giao dịch trung tâm.' },
  { id: 'q2', question: 'Chênh lệch giữa giá bid và giá ask của ngân hàng thể hiện điều gì?', options: ['Thuế xuất nhập khẩu', 'Phần bù cho nhà giao dịch/ngân hàng', 'Lãi suất chính sách', 'Tỷ lệ lạm phát'], correctIndex: 1, explanation: 'Bid-ask spread là khoản bù cho ngân hàng/nhà giao dịch khi làm trung gian mua bán ngoại tệ.' },
  { id: 'q3', question: 'Nếu USD/VND = 25.000 và USD/JPY = 150, tỷ giá chéo JPY/VND xấp xỉ bao nhiêu?', options: ['~3.750.000', '~166,7', '~0,006', '~25.150'], correctIndex: 1, explanation: 'JPY/VND = USD/VND ÷ USD/JPY = 25.000 ÷ 150 ≈ 166,7.' },
]);

const c3 = doc('ibf301-3-1-parity-theories', '3.1 — Exchange rate theories: PPP, IRP & the Fisher effect|||3.1 — Các thuyết tỷ giá: PPP, IRP & hiệu ứng Fisher',
  'Ngang giá sức mua (PPP): tuyệt đối/tương đối; ngang giá lãi suất (IRP) & kinh doanh chênh lệch lãi suất có phòng ngừa; hiệu ứng Fisher quốc tế.',
  [[
    `<span class="eyebrow">IBF301 · Chapter 3 · Lesson 3.1</span>
<h2>Exchange rate theories: PPP, IRP &amp; the Fisher effect</h2>
<h3>Purchasing power parity (PPP)</h3>
<p><strong>Absolute PPP</strong>: identical goods should cost the same everywhere once converted to a common currency. <strong>Relative PPP</strong>: the change in the exchange rate reflects the inflation differential between two countries.</p>
<pre><code>Relative PPP (hypothetical):
 Home inflation = 6%, foreign inflation = 2%
 Expected change in spot rate (home currency per foreign unit)
 ~ 6% - 2% = 4% depreciation of the home currency
</code></pre>
<h3>Interest rate parity (IRP)</h3>
<p>The forward premium/discount on a currency should offset the interest rate differential between two countries — otherwise <strong>covered interest arbitrage</strong> is profitable and traders exploit it until it disappears.</p>
<pre><code>IRP (hypothetical):
 Home interest rate = 8%, foreign interest rate = 5%
 Forward rate (home/foreign) should trade at a premium ~ 8% - 5% = 3%
 above the spot rate (foreign currency trades forward at a premium)
</code></pre>
<h3>The (international) Fisher effect</h3>
<p>Nominal interest rate ~ real interest rate + expected inflation. Across countries, the (uncovered) international Fisher effect predicts that currencies with higher nominal interest rates are expected to depreciate — because higher rates largely reflect higher expected inflation.</p>
<div class="callout"><span class="badge">The chain</span> Inflation differentials drive PPP; interest rate differentials drive IRP; the Fisher effect links interest rates to inflation — together they explain why exchange rates, prices and interest rates cannot drift apart forever.</div>`,
    `<span class="eyebrow">IBF301 · Chương 3 · Bài 3.1</span>
<h2>Các thuyết tỷ giá: PPP, IRP &amp; hiệu ứng Fisher</h2>
<h3>Ngang giá sức mua (PPP)</h3>
<p><strong>PPP tuyệt đối</strong>: hàng hoá giống nhau phải có giá bằng nhau ở mọi nơi khi quy về cùng một tiền tệ. <strong>PPP tương đối</strong>: mức thay đổi tỷ giá phản ánh chênh lệch lạm phát giữa hai quốc gia.</p>
<pre><code>PPP tương đối (giả định):
 Lạm phát trong nước = 6%, lạm phát nước ngoài = 2%
 Mức thay đổi kỳ vọng của tỷ giá giao ngay (nội tệ trên mỗi ngoại tệ)
 ~ 6% - 2% = 4% nội tệ mất giá
</code></pre>
<h3>Ngang giá lãi suất (IRP)</h3>
<p>Mức chiết khấu/phụ giá kỳ hạn của một tiền tệ phải bù trừ đúng chênh lệch lãi suất giữa hai quốc gia — nếu không, <strong>kinh doanh chênh lệch lãi suất có phòng ngừa (covered interest arbitrage)</strong> sẽ có lợi và nhà giao dịch khai thác đến khi cơ hội biến mất.</p>
<pre><code>IRP (giả định):
 Lãi suất trong nước = 8%, lãi suất nước ngoài = 5%
 Tỷ giá kỳ hạn (nội/ngoại) nên giao dịch ở mức phụ giá ~ 8% - 5% = 3%
 so với tỷ giá giao ngay (ngoại tệ giao dịch kỳ hạn ở mức phụ giá)
</code></pre>
<h3>Hiệu ứng Fisher (quốc tế)</h3>
<p>Lãi suất danh nghĩa ~ lãi suất thực + lạm phát kỳ vọng. Giữa các quốc gia, hiệu ứng Fisher quốc tế (không phòng ngừa) dự báo tiền tệ có lãi suất danh nghĩa cao hơn sẽ mất giá — vì lãi suất cao phần lớn phản ánh lạm phát kỳ vọng cao hơn.</p>
<div class="callout"><span class="badge">Chuỗi liên kết</span> Chênh lệch lạm phát dẫn tới PPP; chênh lệch lãi suất dẫn tới IRP; hiệu ứng Fisher gắn lãi suất với lạm phát — cùng nhau chúng giải thích vì sao tỷ giá, giá cả và lãi suất không thể trôi xa nhau mãi mãi.</div>`,
  ]]);

const c3q = quiz('ibf301-quiz-3', 'Quiz 3 — PPP, IRP & Fisher|||Quiz 3 — PPP, IRP & Fisher', [
  { id: 'q1', question: 'Theo PPP tương đối, nếu lạm phát trong nước 6% và nước ngoài 2%, điều gì được kỳ vọng?', options: ['Nội tệ tăng giá ~4%', 'Nội tệ mất giá ~4%', 'Tỷ giá không đổi', 'Lãi suất trong nước giảm 4%'], correctIndex: 1, explanation: 'PPP tương đối: chênh lệch lạm phát (6%-2%=4%) phản ánh vào mức mất giá kỳ vọng của nội tệ.' },
  { id: 'q2', question: 'Ngang giá lãi suất (IRP) mô tả quan hệ giữa hai đại lượng nào?', options: ['Chênh lệch lãi suất và mức phụ giá/chiết khấu kỳ hạn', 'Lạm phát và thất nghiệp', 'Xuất khẩu và nhập khẩu', 'Thuế và trợ cấp'], correctIndex: 0, explanation: 'IRP: mức phụ giá/chiết khấu kỳ hạn của một tiền tệ bù trừ đúng chênh lệch lãi suất giữa hai nước.' },
  { id: 'q3', question: 'Hiệu ứng Fisher liên kết lãi suất danh nghĩa với đại lượng nào?', options: ['Lãi suất thực + lạm phát kỳ vọng', 'Thuế thu nhập doanh nghiệp', 'Tỷ giá chéo', 'Cán cân vãng lai'], correctIndex: 0, explanation: 'Fisher: lãi suất danh nghĩa ≈ lãi suất thực + lạm phát kỳ vọng.' },
]);

const c4 = doc('ibf301-4-1-fx-risk-hedging', '4.1 — FX risk & hedging: forward, option, swap|||4.1 — Rủi ro tỷ giá & phòng ngừa: forward, option, swap',
  'Ba loại phơi nhiễm tỷ giá (giao dịch, chuyển đổi, kinh tế); công cụ phòng ngừa: hợp đồng kỳ hạn, quyền chọn tiền tệ, hoán đổi tiền tệ.',
  [[
    `<span class="eyebrow">IBF301 · Chapter 4 · Lesson 4.1</span>
<h2>FX risk &amp; hedging: forward, option, swap</h2>
<h3>Three types of exposure</h3>
<ul>
<li><strong>Transaction exposure</strong> — a specific contractual cash flow (a receivable/payable) whose home-currency value changes with the exchange rate.</li>
<li><strong>Translation exposure</strong> — consolidating a foreign subsidiary's financial statements into the parent's reporting currency changes reported values as rates move.</li>
<li><strong>Economic exposure</strong> — long-run competitiveness and cash flows shift as exchange rates move, even without a specific contract.</li>
</ul>
<h3>Hedging instruments</h3>
<ul>
<li><strong>Forward contract</strong> — locks today the exchange rate for a future date; eliminates uncertainty but also gives up any favorable move.</li>
<li><strong>Currency option</strong> — a <em>call</em> gives the right (not the obligation) to buy a currency at a fixed rate; a <em>put</em> gives the right to sell. Costs a premium upfront but keeps the upside if the rate moves favorably.</li>
<li><strong>Currency swap</strong> — two parties exchange principal and/or interest payments in different currencies over a longer horizon — often used to hedge a long-term foreign-currency loan.</li>
</ul>
<pre><code>Example (hypothetical):
 A US exporter expects to receive EUR 1,000,000 in 6 months.
 Spot: USD/EUR = 1.05. Forward: locks in 1.05 -> USD 1,050,000, no matter
 where the spot rate ends up. A put option on EUR would cost a premium
 but let the exporter benefit if EUR strengthens above 1.05.
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> Forwards remove risk AND upside; options remove downside risk for a premium and keep upside; swaps hedge longer-term, recurring exposures.</div>`,
    `<span class="eyebrow">IBF301 · Chương 4 · Bài 4.1</span>
<h2>Rủi ro tỷ giá &amp; phòng ngừa: forward, option, swap</h2>
<h3>Ba loại phơi nhiễm tỷ giá</h3>
<ul>
<li><strong>Phơi nhiễm giao dịch</strong> — một dòng tiền hợp đồng cụ thể (khoản phải thu/phải trả) mà giá trị tính bằng nội tệ thay đổi theo tỷ giá.</li>
<li><strong>Phơi nhiễm chuyển đổi</strong> — hợp nhất báo cáo tài chính của công ty con nước ngoài vào tiền tệ báo cáo của công ty mẹ làm giá trị ghi nhận thay đổi theo tỷ giá.</li>
<li><strong>Phơi nhiễm kinh tế</strong> — năng lực cạnh tranh và dòng tiền dài hạn thay đổi theo tỷ giá, dù không có hợp đồng cụ thể.</li>
</ul>
<h3>Công cụ phòng ngừa</h3>
<ul>
<li><strong>Hợp đồng kỳ hạn (forward)</strong> — chốt sẵn hôm nay tỷ giá cho một ngày trong tương lai; loại bỏ bất định nhưng cũng bỏ luôn phần lợi nếu tỷ giá biến động thuận lợi.</li>
<li><strong>Quyền chọn tiền tệ (option)</strong> — quyền chọn <em>mua (call)</em> cho quyền (không phải nghĩa vụ) mua một tiền tệ ở mức giá cố định; quyền chọn <em>bán (put)</em> cho quyền bán. Tốn phí quyền chọn trả trước nhưng giữ được phần lợi nếu tỷ giá biến động thuận lợi.</li>
<li><strong>Hoán đổi tiền tệ (swap)</strong> — hai bên trao đổi gốc và/hoặc lãi bằng các tiền tệ khác nhau trong một khoảng thời gian dài hơn — thường dùng để phòng ngừa một khoản vay ngoại tệ dài hạn.</li>
</ul>
<pre><code>Ví dụ (giả định):
 Một nhà xuất khẩu Mỹ dự kiến nhận EUR 1.000.000 trong 6 tháng.
 Giao ngay: USD/EUR = 1,05. Kỳ hạn: chốt 1,05 -> USD 1.050.000, bất kể
 tỷ giá giao ngay lúc đó là bao nhiêu. Một quyền chọn bán EUR sẽ tốn phí
 nhưng cho nhà xuất khẩu hưởng lợi nếu EUR mạnh lên trên 1,05.
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Forward loại bỏ cả rủi ro VÀ phần lợi; option loại bỏ rủi ro giảm giá với một khoản phí và giữ phần lợi; swap phòng ngừa phơi nhiễm dài hạn, lặp lại.</div>`,
  ]]);

const c4q = quiz('ibf301-quiz-4', 'Quiz 4 — Phòng ngừa rủi ro tỷ giá|||Quiz 4 — FX risk & hedging', [
  { id: 'q1', question: 'Phơi nhiễm nào phát sinh từ việc hợp nhất báo cáo tài chính công ty con nước ngoài?', options: ['Phơi nhiễm giao dịch', 'Phơi nhiễm chuyển đổi', 'Phơi nhiễm kinh tế', 'Phơi nhiễm lãi suất'], correctIndex: 1, explanation: 'Phơi nhiễm chuyển đổi (translation exposure) phát sinh khi hợp nhất báo cáo tài chính sang tiền tệ báo cáo của công ty mẹ.' },
  { id: 'q2', question: 'Công cụ phòng ngừa nào chốt tỷ giá tương lai nhưng KHÔNG cho giữ phần lợi nếu tỷ giá biến động thuận lợi?', options: ['Quyền chọn (option)', 'Hợp đồng kỳ hạn (forward)', 'Hoán đổi lãi suất', 'Không công cụ nào'], correctIndex: 1, explanation: 'Forward chốt tỷ giá cố định — loại bỏ cả rủi ro và phần lợi tiềm năng.' },
  { id: 'q3', question: 'Mua một quyền chọn bán (put option) ngoại tệ mang lại điều gì?', options: ['Nghĩa vụ phải bán ngoại tệ ở giá cố định', 'Quyền (không phải nghĩa vụ) bán ngoại tệ ở giá cố định, trả phí trước', 'Chốt tỷ giá không mất phí', 'Không liên quan đến phòng ngừa rủi ro'], correctIndex: 1, explanation: 'Put option: quyền, không phải nghĩa vụ, bán ở giá cố định — đổi lại một khoản phí quyền chọn.' },
]);

const c5 = doc('ibf301-5-1-trade-finance', '5.1 — International trade finance|||5.1 — Tài trợ thương mại quốc tế',
  'Thư tín dụng (L/C), nhờ thu chứng từ, tài trợ xuất khẩu (bao thanh toán, forfaiting), rủi ro trong thương mại quốc tế.',
  [[
    `<span class="eyebrow">IBF301 · Chapter 5 · Lesson 5.1</span>
<h2>International trade finance</h2>
<h3>Why trade finance exists</h3>
<p>An exporter and an importer in different countries face mutual distrust: the exporter wants payment before shipping; the importer wants the goods before paying. Trade finance instruments bridge this gap using banks as trusted intermediaries.</p>
<h3>Key instruments</h3>
<ul>
<li><strong>Letter of credit (L/C)</strong> — the importer's bank guarantees payment to the exporter once the exporter presents the specified shipping documents, provided all terms are met.</li>
<li><strong>Documentary collection</strong> — the exporter's bank forwards shipping documents to the importer's bank, releasing them only when the importer pays or accepts a bill of exchange; cheaper than an L/C but with less guarantee for the exporter.</li>
<li><strong>Export factoring</strong> — the exporter sells its foreign receivables to a bank/factor at a discount for immediate cash, transferring collection risk.</li>
<li><strong>Forfaiting</strong> — similar to factoring but for medium/long-term receivables, typically without recourse to the exporter.</li>
</ul>
<pre><code>Example (hypothetical):
 Exporter ships goods worth 200,000 under an L/C.
 Bank verifies the shipping documents match the L/C terms exactly
 -> bank pays the exporter 200,000, then collects from the importer.
 If documents have a discrepancy, the bank can refuse payment.
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> More bank guarantee (L/C) means more safety but higher cost; less guarantee (open account, documentary collection) means lower cost but more risk for the exporter.</div>`,
    `<span class="eyebrow">IBF301 · Chương 5 · Bài 5.1</span>
<h2>Tài trợ thương mại quốc tế</h2>
<h3>Vì sao cần tài trợ thương mại</h3>
<p>Nhà xuất khẩu và nhà nhập khẩu ở hai quốc gia khác nhau đối mặt với sự thiếu tin tưởng lẫn nhau: nhà xuất khẩu muốn được trả tiền trước khi giao hàng; nhà nhập khẩu muốn nhận hàng trước khi trả tiền. Các công cụ tài trợ thương mại lấp khoảng trống này bằng cách dùng ngân hàng làm trung gian đáng tin cậy.</p>
<h3>Các công cụ chính</h3>
<ul>
<li><strong>Thư tín dụng (L/C)</strong> — ngân hàng của nhà nhập khẩu bảo đảm thanh toán cho nhà xuất khẩu ngay khi nhà xuất khẩu xuất trình đúng bộ chứng từ giao hàng theo yêu cầu, miễn mọi điều khoản được đáp ứng.</li>
<li><strong>Nhờ thu chứng từ (documentary collection)</strong> — ngân hàng của nhà xuất khẩu chuyển chứng từ giao hàng cho ngân hàng của nhà nhập khẩu, chỉ giao chứng từ khi nhà nhập khẩu trả tiền hoặc chấp nhận hối phiếu; rẻ hơn L/C nhưng ít bảo đảm hơn cho nhà xuất khẩu.</li>
<li><strong>Bao thanh toán xuất khẩu (export factoring)</strong> — nhà xuất khẩu bán khoản phải thu nước ngoài cho ngân hàng/công ty bao thanh toán với chiết khấu để lấy tiền ngay, chuyển giao rủi ro thu hồi.</li>
<li><strong>Forfaiting</strong> — tương tự bao thanh toán nhưng cho khoản phải thu trung/dài hạn, thường không được truy đòi lại nhà xuất khẩu.</li>
</ul>
<pre><code>Ví dụ (giả định):
 Nhà xuất khẩu giao hàng trị giá 200.000 theo một L/C.
 Ngân hàng kiểm tra chứng từ giao hàng khớp đúng điều khoản L/C
 -> ngân hàng trả nhà xuất khẩu 200.000, sau đó thu lại từ nhà nhập khẩu.
 Nếu chứng từ có sai lệch, ngân hàng có thể từ chối thanh toán.
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Bảo đảm ngân hàng cao (L/C) nghĩa là an toàn hơn nhưng chi phí cao hơn; bảo đảm thấp (ghi sổ mở, nhờ thu) nghĩa là chi phí thấp hơn nhưng rủi ro cao hơn cho nhà xuất khẩu.</div>`,
  ]]);

const c5q = quiz('ibf301-quiz-5', 'Quiz 5 — Tài trợ thương mại quốc tế|||Quiz 5 — International trade finance', [
  { id: 'q1', question: 'Thư tín dụng (L/C) đóng vai trò gì trong thương mại quốc tế?', options: ['Ngân hàng nhà nhập khẩu bảo đảm thanh toán khi chứng từ đúng điều khoản', 'Xoá bỏ hoàn toàn rủi ro tỷ giá', 'Thay thế hợp đồng mua bán', 'Chỉ dùng cho giao dịch nội địa'], correctIndex: 0, explanation: 'L/C: ngân hàng của nhà nhập khẩu cam kết trả tiền khi nhà xuất khẩu xuất trình đúng chứng từ.' },
  { id: 'q2', question: 'Bao thanh toán xuất khẩu (export factoring) chuyển giao điều gì cho bên bao thanh toán?', options: ['Rủi ro thu hồi khoản phải thu', 'Rủi ro tỷ giá của toàn công ty', 'Quyền sở hữu hàng hoá đã giao', 'Nghĩa vụ thuế nhập khẩu'], correctIndex: 0, explanation: 'Factoring: nhà xuất khẩu bán khoản phải thu, chuyển rủi ro thu hồi cho bên mua (factor).' },
  { id: 'q3', question: 'So với thư tín dụng (L/C), nhờ thu chứng từ (documentary collection) có đặc điểm gì?', options: ['Chi phí thấp hơn nhưng ít bảo đảm hơn cho nhà xuất khẩu', 'Chi phí cao hơn và bảo đảm cao hơn', 'Không liên quan đến ngân hàng', 'Chỉ áp dụng cho hàng hoá số lượng nhỏ'], correctIndex: 0, explanation: 'Nhờ thu chứng từ rẻ hơn L/C nhưng không có bảo đảm thanh toán từ ngân hàng như L/C.' },
]);

const c6 = doc('ibf301-6-1-investment-cost-of-capital', '6.1 — International investment decisions & MNC cost of capital|||6.1 — Quyết định đầu tư quốc tế & chi phí vốn đa quốc gia',
  'Thẩm định dự án đầu tư nước ngoài (NPV, dòng vốn bị chặn, rủi ro chính trị); chi phí vốn của công ty đa quốc gia (WACC điều chỉnh theo rủi ro quốc gia).',
  [[
    `<span class="eyebrow">IBF301 · Chapter 6 · Lesson 6.1</span>
<h2>International investment decisions &amp; MNC cost of capital</h2>
<h3>Capital budgeting for a foreign project</h3>
<p>The same <strong>NPV</strong> logic from domestic capital budgeting applies, with extra adjustments: cash flows should be evaluated from the <strong>parent's</strong> perspective (after conversion to home currency), not just the project's local perspective, because only cash the parent can actually access matters for the parent's shareholders.</p>
<ul>
<li><strong>Blocked funds</strong> — some countries restrict how much cash a subsidiary may remit to the parent; blocked cash has less value to the parent even if it's profitable locally.</li>
<li><strong>Exchange rate risk</strong> — future foreign cash flows must be converted at expected future exchange rates, which are uncertain.</li>
<li><strong>Political risk</strong> — expropriation or new capital controls can eliminate the project's value overnight; often handled by a higher discount rate or by explicit scenario adjustment.</li>
</ul>
<h3>Cost of capital for an MNC</h3>
<p>A multinational's <strong>WACC</strong> often differs from a purely domestic firm's because of: access to (potentially cheaper) foreign capital markets, diversification benefits that can lower the firm's overall risk, and country-risk premiums added for operations in less stable markets.</p>
<pre><code>Example (hypothetical):
 Domestic-only WACC = 10%. A project in a higher-risk country
 may use a project-specific discount rate = 10% + 4% (country risk
 premium) = 14%, lowering NPV to reflect political/economic risk.
</code></pre>
<div class="callout"><span class="badge">Key principle</span> Value the project from the parent's perspective, in the parent's currency, using a discount rate that reflects the actual risk of that specific foreign cash flow.</div>`,
    `<span class="eyebrow">IBF301 · Chương 6 · Bài 6.1</span>
<h2>Quyết định đầu tư quốc tế &amp; chi phí vốn đa quốc gia</h2>
<h3>Thẩm định dự án đầu tư nước ngoài</h3>
<p>Cùng logic <strong>NPV</strong> của thẩm định dự án nội địa vẫn áp dụng, cộng thêm các điều chỉnh: dòng tiền nên được đánh giá theo góc nhìn <strong>công ty mẹ</strong> (sau khi quy đổi về nội tệ), không chỉ theo góc nhìn của dự án tại địa phương, vì chỉ dòng tiền mà công ty mẹ thực sự tiếp cận được mới có ý nghĩa với cổ đông công ty mẹ.</p>
<ul>
<li><strong>Dòng vốn bị chặn (blocked funds)</strong> — một số quốc gia hạn chế lượng tiền mà công ty con được chuyển về công ty mẹ; tiền bị chặn có giá trị thấp hơn với công ty mẹ dù dự án vẫn có lãi ở địa phương.</li>
<li><strong>Rủi ro tỷ giá</strong> — dòng tiền ngoại tệ tương lai phải quy đổi theo tỷ giá kỳ vọng trong tương lai, vốn không chắc chắn.</li>
<li><strong>Rủi ro chính trị</strong> — tước quyền sở hữu hoặc kiểm soát vốn mới có thể xoá sạch giá trị dự án chỉ trong một đêm; thường được xử lý bằng cách nâng suất chiết khấu hoặc điều chỉnh kịch bản rõ ràng.</li>
</ul>
<h3>Chi phí vốn của công ty đa quốc gia</h3>
<p><strong>WACC</strong> của một công ty đa quốc gia thường khác công ty chỉ hoạt động nội địa vì: tiếp cận thị trường vốn nước ngoài (có thể rẻ hơn), lợi ích đa dạng hoá có thể giảm rủi ro tổng thể của công ty, và phần bù rủi ro quốc gia cộng thêm khi hoạt động ở thị trường kém ổn định hơn.</p>
<pre><code>Ví dụ (giả định):
 WACC chỉ hoạt động nội địa = 10%. Một dự án ở quốc gia rủi ro cao hơn
 có thể dùng suất chiết khấu riêng cho dự án = 10% + 4% (phần bù rủi ro
 quốc gia) = 14%, làm giảm NPV để phản ánh rủi ro chính trị/kinh tế.
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc cốt lõi</span> Định giá dự án theo góc nhìn công ty mẹ, bằng tiền tệ của công ty mẹ, dùng suất chiết khấu phản ánh đúng rủi ro thực của dòng tiền ngoại tệ cụ thể đó.</div>`,
  ]]);

const c6q = quiz('ibf301-quiz-6', 'Quiz 6 — Đầu tư quốc tế & chi phí vốn|||Quiz 6 — International investment & cost of capital', [
  { id: 'q1', question: 'Khi thẩm định dự án đầu tư nước ngoài, dòng tiền nên được đánh giá theo góc nhìn nào?', options: ['Chỉ góc nhìn của dự án tại địa phương', 'Góc nhìn công ty mẹ, sau khi quy đổi về nội tệ', 'Góc nhìn của chính phủ nước ngoài', 'Không cần quy đổi tiền tệ'], correctIndex: 1, explanation: 'Chỉ dòng tiền công ty mẹ thực sự tiếp cận được mới có ý nghĩa với cổ đông công ty mẹ, nên đánh giá theo góc nhìn công ty mẹ.' },
  { id: 'q2', question: '"Dòng vốn bị chặn" (blocked funds) ảnh hưởng thế nào đến giá trị dự án với công ty mẹ?', options: ['Không ảnh hưởng gì', 'Làm giảm giá trị dự án đối với công ty mẹ dù dự án có lãi ở địa phương', 'Luôn làm tăng NPV', 'Chỉ ảnh hưởng đến thuế'], correctIndex: 1, explanation: 'Tiền bị chặn không chuyển về được công ty mẹ nên có giá trị thấp hơn với công ty mẹ, dù lãi ở địa phương.' },
  { id: 'q3', question: 'Vì sao WACC của một dự án ở quốc gia rủi ro cao thường được điều chỉnh tăng?', options: ['Để cộng thêm phần bù rủi ro quốc gia', 'Vì thuế thu nhập luôn cao hơn', 'Vì lãi suất nội địa luôn thấp hơn', 'Không có lý do tài chính, chỉ là quy ước'], correctIndex: 0, explanation: 'Suất chiết khấu dự án thường = WACC cơ sở + phần bù rủi ro quốc gia, phản ánh rủi ro chính trị/kinh tế cao hơn.' },
]);

const c7 = doc('ibf301-7-1-working-capital', '7.1 — Multinational working capital management|||7.1 — Quản trị vốn lưu động đa quốc gia',
  'Quản trị tiền mặt đa quốc gia; netting song phương/đa phương; leading & lagging; giá chuyển nhượng nội bộ (transfer pricing).',
  [[
    `<span class="eyebrow">IBF301 · Chapter 7 · Lesson 7.1</span>
<h2>Multinational working capital management</h2>
<h3>Why it's harder across borders</h3>
<p>A multinational firm has cash, receivables and payables scattered across subsidiaries in different currencies and time zones, subject to different capital controls and tax rules. The goal is to minimize idle cash and FX/transaction costs while keeping enough liquidity everywhere it's needed.</p>
<h3>Key techniques</h3>
<ul>
<li><strong>Multilateral netting</strong> — subsidiaries that owe each other money settle only the <em>net</em> difference through a central clearing point, drastically cutting the number and value of cross-border transfers (and their FX/transfer costs).</li>
<li><strong>Leading &amp; lagging</strong> — deliberately accelerating (leading) or delaying (lagging) intercompany payments between subsidiaries to shift cash to where it's needed or to benefit from an expected exchange-rate move.</li>
<li><strong>Transfer pricing</strong> — the price charged on goods/services traded between a firm's own subsidiaries; besides its tax implications, it can shift reported profit and cash to the subsidiary that needs it most (within legal/tax limits).</li>
</ul>
<pre><code>Example (hypothetical):
 Subsidiary A owes Subsidiary B 300,000; B owes A 260,000.
 Without netting: 2 transfers, total 560,000, 2x FX/transfer costs.
 With netting: 1 transfer of 40,000 from A to B — same net result,
 far fewer transaction/FX costs.
</code></pre>
<div class="callout"><span class="badge">Bigger picture</span> A well-run multinational treasury function can meaningfully cut transaction costs and idle cash simply by centralizing and netting flows that would otherwise move independently.</div>`,
    `<span class="eyebrow">IBF301 · Chương 7 · Bài 7.1</span>
<h2>Quản trị vốn lưu động đa quốc gia</h2>
<h3>Vì sao khó hơn khi vượt biên giới</h3>
<p>Một công ty đa quốc gia có tiền mặt, khoản phải thu và phải trả nằm rải rác ở các công ty con thuộc nhiều tiền tệ và múi giờ khác nhau, chịu các quy định kiểm soát vốn và thuế khác nhau. Mục tiêu là giảm thiểu tiền mặt nhàn rỗi và chi phí ngoại hối/giao dịch trong khi vẫn giữ đủ thanh khoản ở mọi nơi cần thiết.</p>
<h3>Các kỹ thuật chính</h3>
<ul>
<li><strong>Netting đa phương</strong> — các công ty con nợ lẫn nhau chỉ thanh toán phần <em>chênh lệch thuần</em> qua một điểm thanh toán trung tâm, giảm mạnh số lượng và giá trị các chuyển tiền qua biên giới (và chi phí ngoại hối/chuyển tiền kèm theo).</li>
<li><strong>Leading &amp; lagging</strong> — chủ động đẩy nhanh (leading) hoặc trì hoãn (lagging) các khoản thanh toán nội bộ giữa các công ty con để dịch chuyển tiền tới nơi cần hoặc hưởng lợi từ một biến động tỷ giá kỳ vọng.</li>
<li><strong>Giá chuyển nhượng nội bộ (transfer pricing)</strong> — mức giá tính cho hàng hoá/dịch vụ giao dịch giữa các công ty con của cùng một công ty; ngoài ảnh hưởng về thuế, nó có thể dịch chuyển lợi nhuận và tiền mặt ghi nhận tới công ty con cần nhất (trong giới hạn pháp lý/thuế).</li>
</ul>
<pre><code>Ví dụ (giả định):
 Công ty con A nợ công ty con B 300.000; B nợ A 260.000.
 Không netting: 2 lần chuyển tiền, tổng 560.000, tốn 2 lần phí FX/chuyển tiền.
 Có netting: 1 lần chuyển 40.000 từ A sang B — cùng kết quả thuần,
 nhưng ít hơn hẳn chi phí giao dịch/ngoại hối.
</code></pre>
<div class="callout"><span class="badge">Bức tranh lớn hơn</span> Một bộ phận ngân quỹ đa quốc gia vận hành tốt có thể giảm đáng kể chi phí giao dịch và tiền mặt nhàn rỗi chỉ bằng cách tập trung hoá và netting các dòng tiền vốn dĩ sẽ di chuyển độc lập.</div>`,
  ]]);

const c7q = quiz('ibf301-quiz-7', 'Quiz 7 — Vốn lưu động đa quốc gia|||Quiz 7 — Multinational working capital', [
  { id: 'q1', question: 'Netting đa phương giúp một công ty đa quốc gia đạt được điều gì?', options: ['Tăng số lượng chuyển tiền qua biên giới', 'Giảm số lượng và giá trị chuyển tiền bằng cách chỉ thanh toán phần chênh lệch thuần', 'Xoá bỏ hoàn toàn nghĩa vụ nợ giữa các công ty con', 'Tăng thuế phải nộp'], correctIndex: 1, explanation: 'Netting đa phương chỉ thanh toán phần chênh lệch thuần qua một điểm trung tâm, giảm số lần và chi phí chuyển tiền.' },
  { id: 'q2', question: '"Leading & lagging" trong quản trị vốn lưu động đa quốc gia nghĩa là gì?', options: ['Luôn thanh toán đúng hạn, không thay đổi', 'Chủ động đẩy nhanh hoặc trì hoãn thanh toán nội bộ giữa các công ty con', 'Chỉ áp dụng cho thuế xuất nhập khẩu', 'Một loại hợp đồng kỳ hạn tiền tệ'], correctIndex: 1, explanation: 'Leading (đẩy nhanh) & lagging (trì hoãn) là kỹ thuật dịch chuyển thời điểm thanh toán nội bộ để tối ưu tiền mặt hoặc tỷ giá.' },
  { id: 'q3', question: 'Giá chuyển nhượng nội bộ (transfer pricing) có thể được dùng để làm gì (trong giới hạn pháp lý)?', options: ['Dịch chuyển lợi nhuận/tiền mặt ghi nhận tới công ty con cần nhất', 'Xoá bỏ hoàn toàn thuế thu nhập doanh nghiệp toàn cầu', 'Thay thế netting đa phương', 'Chỉ dùng khi công ty có một công ty con duy nhất'], correctIndex: 0, explanation: 'Transfer pricing ảnh hưởng đến nơi lợi nhuận/tiền mặt được ghi nhận giữa các công ty con, trong giới hạn quy định thuế.' },
]);

const c8 = doc('ibf301-8-1-crises-institutions', '8.1 — International financial crises & institutions: IMF, World Bank|||8.1 — Khủng hoảng tài chính quốc tế & định chế: IMF, World Bank',
  'Nguyên nhân điển hình của khủng hoảng tiền tệ/tài chính (khủng hoảng châu Á 1997); vai trò của IMF (cứu trợ, điều kiện đi kèm) và World Bank (tài trợ phát triển).',
  [[
    `<span class="eyebrow">IBF301 · Chapter 8 · Lesson 8.1</span>
<h2>International financial crises &amp; institutions: IMF, World Bank</h2>
<h3>Anatomy of a currency/financial crisis</h3>
<p>Many crises share a common pattern: a country runs large current-account deficits financed by short-term foreign capital, often under a fixed or pegged exchange rate. When investor confidence turns, capital flees quickly (a "sudden stop"), the peg becomes unsustainable, and the currency collapses — often triggering bank failures and a wider economic crisis. The <strong>1997 Asian financial crisis</strong> (Thailand, Indonesia, South Korea, and others) is a classic case: pegged currencies, large short-term foreign-currency debt, then rapid capital flight.</p>
<h3>The IMF's role</h3>
<p>The <strong>International Monetary Fund (IMF)</strong> lends foreign-currency reserves to countries facing a balance-of-payments crisis, usually attaching <strong>conditionality</strong> — required policy reforms (fiscal tightening, structural reforms) meant to restore stability and repayment capacity. This conditionality is often controversial: it can restore confidence, but the short-term austerity can also deepen a recession.</p>
<h3>The World Bank's role</h3>
<p>The <strong>World Bank</strong> focuses on longer-term <strong>development financing</strong> — infrastructure, poverty reduction, institutional capacity — rather than short-term crisis lending; it complements, rather than substitutes for, the IMF's crisis-response mandate.</p>
<pre><code>Simplified crisis chain (hypothetical):
 Fixed peg + large short-term FX debt -> confidence shock
 -> capital flight -> reserves drained -> peg breaks -> currency collapses
 -> IMF lends reserves + attaches policy conditions
</code></pre>
<div class="callout"><span class="badge">Lesson</span> Fixed exchange rates funded by short-term foreign debt are fragile; the IMF and World Bank exist precisely because international capital flows can reverse fast enough to overwhelm any single country's reserves.</div>`,
    `<span class="eyebrow">IBF301 · Chương 8 · Bài 8.1</span>
<h2>Khủng hoảng tài chính quốc tế &amp; định chế: IMF, World Bank</h2>
<h3>Cấu trúc điển hình của một cuộc khủng hoảng tiền tệ/tài chính</h3>
<p>Nhiều cuộc khủng hoảng có chung một khuôn mẫu: một quốc gia thâm hụt tài khoản vãng lai lớn, được tài trợ bằng vốn ngoại tệ ngắn hạn, thường dưới chế độ tỷ giá cố định hoặc neo. Khi niềm tin nhà đầu tư đảo chiều, vốn rút đi nhanh chóng (một "cú dừng đột ngột"), mức neo trở nên không bền vững, và tiền tệ sụp đổ — thường kéo theo sụp đổ ngân hàng và khủng hoảng kinh tế rộng hơn. <strong>Khủng hoảng tài chính châu Á 1997</strong> (Thái Lan, Indonesia, Hàn Quốc, và các nước khác) là ví dụ kinh điển: tiền tệ neo cố định, nợ ngoại tệ ngắn hạn lớn, rồi vốn rút đi nhanh.</p>
<h3>Vai trò của IMF</h3>
<p><strong>Quỹ Tiền tệ Quốc tế (IMF)</strong> cho các quốc gia đang gặp khủng hoảng cán cân thanh toán vay dự trữ ngoại tệ, thường kèm <strong>điều kiện (conditionality)</strong> — các cải cách chính sách bắt buộc (thắt chặt tài khoá, cải cách cấu trúc) nhằm khôi phục ổn định và khả năng trả nợ. Điều kiện này thường gây tranh cãi: nó có thể khôi phục niềm tin, nhưng chính sách khắc khổ ngắn hạn cũng có thể làm suy thoái sâu hơn.</p>
<h3>Vai trò của World Bank</h3>
<p><strong>World Bank</strong> tập trung vào <strong>tài trợ phát triển</strong> dài hạn hơn — hạ tầng, giảm nghèo, năng lực thể chế — thay vì cho vay khủng hoảng ngắn hạn; nó bổ trợ, không thay thế, vai trò ứng phó khủng hoảng của IMF.</p>
<pre><code>Chuỗi khủng hoảng đơn giản hoá (giả định):
 Neo cố định + nợ ngoại tệ ngắn hạn lớn -> sốc niềm tin
 -> vốn rút đi -> dự trữ cạn -> mức neo vỡ -> tiền tệ sụp đổ
 -> IMF cho vay dự trữ + kèm điều kiện chính sách
</code></pre>
<div class="callout"><span class="badge">Bài học</span> Tỷ giá cố định được tài trợ bằng nợ ngoại tệ ngắn hạn là mong manh; IMF và World Bank tồn tại chính vì dòng vốn quốc tế có thể đảo chiều nhanh đến mức vượt quá dự trữ của bất kỳ một quốc gia đơn lẻ.</div>`,
  ]]);

const c8q = quiz('ibf301-quiz-8', 'Quiz 8 — Khủng hoảng & định chế|||Quiz 8 — Crises & institutions', [
  { id: 'q1', question: 'Khủng hoảng tài chính châu Á 1997 có đặc điểm chung nào?', options: ['Tỷ giá thả nổi tự do, không có nợ nước ngoài', 'Tiền tệ neo cố định, nợ ngoại tệ ngắn hạn lớn, rồi vốn rút đi nhanh', 'Chỉ ảnh hưởng đến thị trường chứng khoán, không ảnh hưởng tiền tệ', 'Không liên quan đến dòng vốn quốc tế'], correctIndex: 1, explanation: 'Mẫu hình điển hình: neo cố định + nợ ngắn hạn ngoại tệ lớn + đảo chiều niềm tin -> vốn rút đi -> sụp đổ tiền tệ.' },
  { id: 'q2', question: '"Điều kiện" (conditionality) mà IMF thường gắn với khoản vay cứu trợ là gì?', options: ['Yêu cầu quốc gia vay đổi sang tiền tệ khác', 'Các cải cách chính sách bắt buộc (thắt chặt tài khoá, cải cách cấu trúc)', 'Một loại thuế đánh vào nhà đầu tư nước ngoài', 'Không có điều kiện nào, IMF cho vay không kèm điều kiện'], correctIndex: 1, explanation: 'IMF thường yêu cầu cải cách chính sách (điều kiện) đi kèm khoản vay để khôi phục ổn định và khả năng trả nợ.' },
  { id: 'q3', question: 'World Bank khác IMF chủ yếu ở điểm nào?', options: ['World Bank tập trung tài trợ phát triển dài hạn, không phải cho vay khủng hoảng ngắn hạn', 'World Bank chỉ cho vay bằng vàng', 'World Bank thay thế hoàn toàn vai trò của IMF', 'World Bank chỉ hoạt động ở châu Á'], correctIndex: 0, explanation: 'World Bank tập trung tài trợ phát triển dài hạn (hạ tầng, giảm nghèo); IMF xử lý khủng hoảng cán cân thanh toán ngắn hạn.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'IBF301',
    slug: 'ibf301-international-finance',
    title: 'International Finance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IBF301.webp',
    shortDescription: 'International finance: FX markets, exchange rate theories (PPP, IRP, Fisher), hedging, trade finance, MNC capital budgeting & cost of capital, working capital, and crises & institutions (IMF, WB). Bilingual, with examples & quizzes.|||Tài chính quốc tế: thị trường ngoại hối, các thuyết tỷ giá (PPP, IRP, Fisher), phòng ngừa rủi ro, tài trợ thương mại, đầu tư & chi phí vốn đa quốc gia, vốn lưu động, khủng hoảng & định chế (IMF, WB). Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>IBF301 — International Finance</strong> (kỳ 4, khối Quản trị Kinh doanh) giúp hiểu cách doanh nghiệp và nhà đầu tư quản lý tiền vượt biên giới. Từ <strong>môi trường tiền tệ quốc tế</strong> &amp; <strong>thị trường ngoại hối</strong> → <strong>các thuyết tỷ giá</strong> (PPP, IRP, hiệu ứng Fisher) → <strong>phòng ngừa rủi ro tỷ giá</strong> (forward, option, swap) → <strong>tài trợ thương mại quốc tế</strong> → <strong>đầu tư quốc tế &amp; chi phí vốn đa quốc gia</strong> → <strong>vốn lưu động đa quốc gia</strong> → <strong>khủng hoảng tài chính &amp; định chế</strong> (IMF, World Bank). Tham khảo Eun/Resnick, Madura, Shapiro; song ngữ, có ví dụ giả định và quiz mỗi chương.',
    whatYouLearn: 'Môi trường tiền tệ quốc tế & cán cân thanh toán; cấu trúc thị trường FX, yết tỷ giá & tỷ giá chéo; PPP, IRP & hiệu ứng Fisher; ba loại phơi nhiễm tỷ giá & phòng ngừa bằng forward/option/swap; công cụ tài trợ thương mại (L/C, nhờ thu, factoring, forfaiting); thẩm định dự án đầu tư nước ngoài & chi phí vốn đa quốc gia; netting, leading & lagging, transfer pricing; nguyên nhân khủng hoảng tiền tệ & vai trò IMF/World Bank.',
    requirements: 'Đã học qua tài chính doanh nghiệp/kinh tế học cơ bản (cung-cầu, lãi suất, cán cân thương mại). Không cần kiến thức chuyên sâu về ngoại hối trước khi học.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo (Eun/Resnick, Madura, Shapiro), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tài chính quốc tế khác gì tài chính nội địa; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Môi trường tiền tệ quốc tế|||Chapter 1 — International monetary environment', description: 'Hệ thống tiền tệ quốc tế, cán cân thanh toán.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Thị trường ngoại hối & tỷ giá|||Chapter 2 — FX markets & exchange rates', description: 'Cấu trúc thị trường FX, yết tỷ giá, tỷ giá chéo.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Các thuyết tỷ giá|||Chapter 3 — Exchange rate theories', description: 'PPP, IRP, hiệu ứng Fisher.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Rủi ro tỷ giá & phòng ngừa|||Chapter 4 — FX risk & hedging', description: 'Phơi nhiễm tỷ giá; forward, option, swap.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tài trợ thương mại quốc tế|||Chapter 5 — International trade finance', description: 'L/C, nhờ thu, factoring, forfaiting.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đầu tư quốc tế & chi phí vốn|||Chapter 6 — International investment & cost of capital', description: 'Thẩm định dự án nước ngoài, WACC đa quốc gia.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Vốn lưu động đa quốc gia|||Chapter 7 — Multinational working capital', description: 'Netting, leading & lagging, transfer pricing.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Khủng hoảng & định chế|||Chapter 8 — Crises & institutions', description: 'Khủng hoảng châu Á 1997; IMF, World Bank.', lessons: [c8, c8q] },
  ],
};
