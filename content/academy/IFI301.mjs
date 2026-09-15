/**
 * IFI301 — International Financial Investment. Giáo trình FLM (khung BBA, kỳ 5)
 * (syl): tổng quan đầu tư quốc tế, tài sản & thị trường toàn cầu, rủi ro/lợi
 * nhuận, đa dạng hoá danh mục quốc tế, rủi ro tỷ giá & phòng ngừa, thị trường
 * mới nổi, quỹ/ETF, phân bổ tài sản toàn cầu. Song ngữ + ví dụ giả định + bài
 * tập. KHÔNG khuyến nghị đầu tư — chỉ mang tính học thuật.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ifi301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ tra dữ liệu, lộ trình tự học.',
  [[
    `<span class="eyebrow">IFI301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn International Financial Investment — global markets, asset classes, risk &amp; return, diversification, currency hedging, emerging markets, funds/ETFs and global asset allocation — in one place. The full official slides &amp; giáo trình live on <strong>FLM</strong>; below are free, legal reference resources. <strong>Nothing here is investment advice.</strong></p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IFI301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Bodie, Kane &amp; Marcus — <em>Investments</em> (McGraw-Hill) — core chapters on international diversification, currency risk and asset allocation.</li>
<li>Solnik &amp; McLeavey — <em>International Investments</em> (Pearson) — the standard text on international portfolio management and exchange-rate risk.</li>
<li><a href="https://www.cfainstitute.org/" target="_blank" rel="noopener">CFA Institute</a> — CFA Program curriculum topic areas on portfolio management and international asset classes (public topic outlines, no login needed for overviews).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Aswath Damodaran (NYU Stern)</a> — free notes, data and spreadsheets on risk, country risk premiums and global valuation.</li>
<li><a href="https://www.investopedia.com/terms/i/internationalinvesting.asp" target="_blank" rel="noopener">Investopedia — International Investing</a> — plain-language explainers for every concept in this course.</li>
<li><a href="https://www.msci.com/our-solutions/indexes/market-classification" target="_blank" rel="noopener">MSCI Market Classification</a> — how "developed", "emerging" and "frontier" markets are actually defined.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Aswath.Damodaran" target="_blank" rel="noopener">Aswath Damodaran</a> — international finance &amp; valuation lectures from NYU Stern.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy — Finance &amp; capital markets</a> — foundations of risk, return and diversification.</li>
</ul>
<h3>🛠️ Tools (data, not advice)</h3>
<ul>
<li><a href="https://www.investing.com/" target="_blank" rel="noopener">Investing.com</a> — free real-time quotes for global equities, bonds and currency pairs, for practicing calculations only.</li>
<li><a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noopener">XE Currency Converter</a> — spot exchange rates, for the currency-risk exercises in Chapter 5.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — global market structure, asset classes, expected return &amp; standard deviation.</li>
<li><strong>Practice</strong> — portfolio variance with two assets, hedged vs unhedged returns, using the worked (hypothetical) examples in each chapter.</li>
<li><strong>Go deeper</strong> — emerging-market risk premiums, ETF tracking error, strategic asset allocation.</li>
<li><strong>Job-ready</strong> — read a real fund's factsheet and identify its asset classes, currency exposure and fees — without acting on it.</li>
</ol></div>
<div class="callout"><span class="badge">⚠️ Educational only</span> This course explains <strong>concepts and calculation methods</strong> used in international investment analysis. It is <strong>not financial advice</strong> and does not recommend buying, selling or holding any asset. All numeric examples are explicitly labeled hypothetical.</div>`,
    `<span class="eyebrow">IFI301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Đầu tư tài chính quốc tế — thị trường toàn cầu, các loại tài sản, rủi ro &amp; lợi nhuận, đa dạng hoá, phòng ngừa tỷ giá, thị trường mới nổi, quỹ/ETF và phân bổ tài sản toàn cầu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo miễn phí, hợp pháp. <strong>Không có nội dung nào ở đây là lời khuyên đầu tư.</strong></p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IFI301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Bodie, Kane &amp; Marcus — <em>Investments</em> (McGraw-Hill) — các chương lõi về đa dạng hoá quốc tế, rủi ro tỷ giá và phân bổ tài sản.</li>
<li>Solnik &amp; McLeavey — <em>International Investments</em> (Pearson) — giáo trình chuẩn về quản lý danh mục quốc tế và rủi ro tỷ giá.</li>
<li><a href="https://www.cfainstitute.org/" target="_blank" rel="noopener">CFA Institute</a> — đề mục chương trình CFA về quản lý danh mục và tài sản quốc tế (mục lục công khai, không cần đăng nhập).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://pages.stern.nyu.edu/~adamodar/" target="_blank" rel="noopener">Aswath Damodaran (NYU Stern)</a> — ghi chú, dữ liệu và bảng tính miễn phí về rủi ro, phần bù rủi ro quốc gia và định giá toàn cầu.</li>
<li><a href="https://www.investopedia.com/terms/i/internationalinvesting.asp" target="_blank" rel="noopener">Investopedia — International Investing</a> — giải thích dễ hiểu cho mọi khái niệm trong môn này.</li>
<li><a href="https://www.msci.com/our-solutions/indexes/market-classification" target="_blank" rel="noopener">MSCI Market Classification</a> — cách phân loại thị trường "phát triển", "mới nổi" và "cận biên" trong thực tế.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Aswath.Damodaran" target="_blank" rel="noopener">Aswath Damodaran</a> — bài giảng tài chính quốc tế &amp; định giá từ NYU Stern.</li>
<li><a href="https://www.youtube.com/@khanacademy" target="_blank" rel="noopener">Khan Academy — Finance &amp; capital markets</a> — nền tảng rủi ro, lợi nhuận và đa dạng hoá.</li>
</ul>
<h3>🛠️ Công cụ (chỉ dữ liệu, không phải khuyến nghị)</h3>
<ul>
<li><a href="https://www.investing.com/" target="_blank" rel="noopener">Investing.com</a> — báo giá gần thời gian thực cho cổ phiếu, trái phiếu và tỷ giá toàn cầu, chỉ để luyện tính toán.</li>
<li><a href="https://www.xe.com/currencyconverter/" target="_blank" rel="noopener">XE Currency Converter</a> — tỷ giá giao ngay, dùng cho bài tập rủi ro tỷ giá ở Chương 5.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — cấu trúc thị trường toàn cầu, các loại tài sản, lợi nhuận kỳ vọng &amp; độ lệch chuẩn.</li>
<li><strong>Luyện tập</strong> — phương sai danh mục hai tài sản, lợi nhuận có/không phòng ngừa tỷ giá, dùng các ví dụ giả định trong từng chương.</li>
<li><strong>Đào sâu</strong> — phần bù rủi ro thị trường mới nổi, sai lệch bám chỉ số của ETF, phân bổ tài sản chiến lược.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc bản cáo bạch (factsheet) một quỹ thật và chỉ ra loại tài sản, mức rủi ro tỷ giá, phí — mà không hành động theo nó.</li>
</ol></div>
<div class="callout"><span class="badge">⚠️ Chỉ mang tính học thuật</span> Môn này giải thích <strong>khái niệm và phương pháp tính toán</strong> dùng trong phân tích đầu tư quốc tế. Đây <strong>không phải lời khuyên tài chính</strong> và không khuyến nghị mua, bán hay giữ bất kỳ tài sản nào. Mọi ví dụ số liệu đều được ghi rõ là giả định.</div>`,
  ]]);

const intro = doc('ifi301-0-1-overview', 'Course overview: International Financial Investment|||Tổng quan: Đầu tư tài chính quốc tế',
  'Đầu tư tài chính quốc tế là gì và vì sao doanh nghiệp/nhà đầu tư quan tâm; lộ trình 8 chương: thị trường toàn cầu → tài sản → rủi ro/lợi nhuận → đa dạng hoá → tỷ giá → thị trường mới nổi → quỹ/ETF → phân bổ tài sản.',
  [[
    `<span class="eyebrow">IFI301 · Lesson 0.1 · Overview</span>
<h2>International Financial Investment</h2>
<p class="lead">This course explains <strong>how investors evaluate opportunities across national borders</strong> — buying equities, bonds and funds issued in other countries and other currencies. You will learn the vocabulary, the risk/return math, and the practical constraints (currency, regulation, market access) that make international investing different from domestic investing.</p>
<h3>Why cross borders at all</h3>
<ul>
<li><strong>Bigger opportunity set</strong> — most of the world's listed companies and government debt sit outside any single country.</li>
<li><strong>Diversification</strong> — economies do not move in lockstep, so combining assets across countries can reduce a portfolio's overall risk (Chapter 4).</li>
<li><strong>New risks appear</strong> — exchange-rate movements, political/regulatory risk and lower liquidity in some markets (Chapters 3, 5, 6).</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Global markets &amp; overview → international asset classes (equities, bonds, funds) → risk &amp; return → international diversification → currency risk &amp; hedging → emerging markets → international funds &amp; ETFs → global asset allocation and practice for Vietnamese investors. Bilingual, with worked (hypothetical) examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">⚠️ Not investment advice</span> This course is academic. Every numeric example uses <strong>assumed (hypothetical)</strong> figures, not real quotes, and nothing here recommends any specific action.</div>`,
    `<span class="eyebrow">IFI301 · Bài 0.1 · Tổng quan</span>
<h2>Đầu tư tài chính quốc tế</h2>
<p class="lead">Môn này giải thích <strong>nhà đầu tư đánh giá cơ hội xuyên biên giới thế nào</strong> — mua cổ phiếu, trái phiếu và quỹ phát hành ở nước khác, bằng đồng tiền khác. Bạn sẽ học từ vựng, phần toán rủi ro/lợi nhuận, và các ràng buộc thực tế (tỷ giá, quy định, khả năng tiếp cận thị trường) khiến đầu tư quốc tế khác với đầu tư trong nước.</p>
<h3>Vì sao phải vượt biên giới</h3>
<ul>
<li><strong>Không gian cơ hội lớn hơn</strong> — phần lớn công ty niêm yết và nợ chính phủ trên thế giới nằm ngoài bất kỳ một quốc gia đơn lẻ.</li>
<li><strong>Đa dạng hoá</strong> — các nền kinh tế không di chuyển đồng pha, nên kết hợp tài sản nhiều quốc gia có thể giảm rủi ro tổng thể của danh mục (Chương 4).</li>
<li><strong>Rủi ro mới xuất hiện</strong> — biến động tỷ giá, rủi ro chính trị/pháp lý và thanh khoản thấp hơn ở một số thị trường (Chương 3, 5, 6).</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Thị trường toàn cầu &amp; tổng quan → các loại tài sản quốc tế (cổ phiếu, trái phiếu, quỹ) → rủi ro &amp; lợi nhuận → đa dạng hoá danh mục quốc tế → rủi ro tỷ giá &amp; phòng ngừa → thị trường mới nổi → quỹ &amp; ETF quốc tế → phân bổ tài sản toàn cầu và thực tiễn cho nhà đầu tư Việt Nam. Song ngữ, có ví dụ giả định và quiz mỗi chương.</p>
<div class="callout"><span class="badge">⚠️ Không phải lời khuyên đầu tư</span> Môn này mang tính học thuật. Mọi ví dụ số liệu dùng con số <strong>giả định</strong>, không phải báo giá thật, và không có nội dung nào khuyến nghị hành động cụ thể.</div>`,
  ]]);

const c1 = doc('ifi301-1-1-global-markets', '1.1 — Overview of international financial investment & global markets|||1.1 — Tổng quan đầu tư tài chính quốc tế & thị trường toàn cầu',
  'Đầu tư trực tiếp vs đầu tư gián tiếp (portfolio); cấu trúc thị trường vốn toàn cầu; động lực và rào cản của dòng vốn xuyên biên giới; lợi nhuận trong tệ nhà so với tệ nước ngoài.',
  [[
    `<span class="eyebrow">IFI301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of international financial investment &amp; global markets</h2>
<h3>Direct vs portfolio investment</h3>
<ul>
<li><strong>Foreign direct investment (FDI)</strong> — buying a controlling stake or building operations abroad (a factory, a subsidiary). Long horizon, operational involvement.</li>
<li><strong>International portfolio investment</strong> — buying foreign equities, bonds or funds without control, purely for financial return. This is the focus of this course.</li>
</ul>
<h3>Global capital market structure</h3>
<p>World capital markets split broadly into <strong>developed markets</strong> (e.g. the US, Japan, most of Western Europe — large, liquid, well-regulated), <strong>emerging markets</strong> (e.g. much of Asia and Latin America — growing fast, less liquid, more volatile) and <strong>frontier markets</strong> (smaller, less accessible still). Classification is set by index providers such as MSCI and can change over time.</p>
<h3>Why returns differ once you cross a border</h3>
<p>An investor's return on a foreign asset has two parts: the asset's return <em>in its own currency</em>, and the change in that currency's value against the investor's home currency.</p>
<pre><code>Return in home currency (approx. formula):
 R_home = (1 + R_foreign) x (1 + e) - 1
 where:
  R_foreign = the asset's return measured in the foreign currency
  e         = % change of the foreign currency against the home currency
              (e is positive if the foreign currency strengthens)

Example (hypothetical numbers):
 R_foreign = 8%  (the foreign stock itself gained 8% in its own currency)
 e = 3%          (the foreign currency strengthened 3% against home currency)
 R_home = (1.08) x (1.03) - 1 = 0.1124 = 11.24%
</code></pre>
<div class="callout"><span class="badge">Two sources of return</span> Every cross-border investment mixes an <strong>asset return</strong> with a <strong>currency return</strong>. Chapter 5 goes deep on isolating and managing the currency piece; the number above (11.24%) is illustrative only, not a forecast.</div>`,
    `<span class="eyebrow">IFI301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan đầu tư tài chính quốc tế &amp; thị trường toàn cầu</h2>
<h3>Đầu tư trực tiếp vs đầu tư gián tiếp (portfolio)</h3>
<ul>
<li><strong>Đầu tư trực tiếp nước ngoài (FDI)</strong> — mua cổ phần chi phối hoặc xây dựng hoạt động ở nước ngoài (một nhà máy, một công ty con). Chân trời dài, tham gia vận hành.</li>
<li><strong>Đầu tư gián tiếp quốc tế (portfolio)</strong> — mua cổ phiếu, trái phiếu hoặc quỹ nước ngoài mà không kiểm soát, chỉ vì lợi nhuận tài chính. Đây là trọng tâm của môn này.</li>
</ul>
<h3>Cấu trúc thị trường vốn toàn cầu</h3>
<p>Thị trường vốn thế giới chia rộng thành <strong>thị trường phát triển</strong> (vd Mỹ, Nhật, phần lớn Tây Âu — lớn, thanh khoản cao, quản lý chặt), <strong>thị trường mới nổi</strong> (vd phần lớn châu Á và Mỹ Latinh — tăng trưởng nhanh, thanh khoản thấp hơn, biến động hơn) và <strong>thị trường cận biên</strong> (nhỏ hơn, khó tiếp cận hơn nữa). Cách phân loại do các nhà cung cấp chỉ số như MSCI đặt ra và có thể thay đổi theo thời gian.</p>
<h3>Vì sao lợi nhuận khác nhau khi vượt biên giới</h3>
<p>Lợi nhuận của nhà đầu tư trên một tài sản nước ngoài gồm hai phần: lợi nhuận của tài sản <em>tính bằng chính đồng tiền của nó</em>, và mức thay đổi giá trị của đồng tiền đó so với đồng tiền nhà đầu tư.</p>
<pre><code>Lợi nhuận tính theo đồng tiền nhà (công thức xấp xỉ):
 R_nha = (1 + R_ngoai) x (1 + e) - 1
 trong đó:
  R_ngoai = lợi nhuận tài sản tính bằng đồng tiền nước ngoài
  e       = % thay đổi của đồng tiền nước ngoài so với đồng tiền nhà
            (e dương nếu đồng tiền nước ngoài mạnh lên)

Ví dụ (số liệu giả định):
 R_ngoai = 8%  (cổ phiếu nước ngoài tăng 8% tính theo đồng tiền của nó)
 e = 3%        (đồng tiền nước ngoài mạnh lên 3% so với đồng tiền nhà)
 R_nha = (1.08) x (1.03) - 1 = 0.1124 = 11,24%
</code></pre>
<div class="callout"><span class="badge">Hai nguồn lợi nhuận</span> Mọi khoản đầu tư xuyên biên giới trộn <strong>lợi nhuận tài sản</strong> với <strong>lợi nhuận tỷ giá</strong>. Chương 5 đi sâu vào cách tách và quản lý phần tỷ giá; con số trên (11,24%) chỉ minh hoạ, không phải dự báo.</div>`,
  ]]);

const c1q = quiz('ifi301-quiz-1', 'Quiz 1 — Tổng quan & thị trường toàn cầu|||Quiz 1 — Overview & global markets', [
  { id: 'q1', question: 'Đầu tư mua cổ phần không kiểm soát ở nước ngoài, chỉ vì lợi nhuận tài chính, gọi là?', options: ['Đầu tư trực tiếp (FDI)', 'Đầu tư gián tiếp quốc tế (portfolio)', 'Sáp nhập xuyên biên giới', 'Vay nợ song phương'], correctIndex: 1, explanation: 'FDI là kiểm soát/vận hành; portfolio investment là mua tài sản tài chính không kiểm soát.' },
  { id: 'q2', question: 'Ai là bên thường đặt ra cách phân loại "phát triển / mới nổi / cận biên" cho các thị trường?', options: ['Ngân hàng trung ương mỗi nước', 'Nhà cung cấp chỉ số (vd MSCI)', 'Sàn giao dịch nội địa', 'Công ty kiểm toán'], correctIndex: 1, explanation: 'Các nhà cung cấp chỉ số như MSCI đặt và định kỳ cập nhật phân loại thị trường.' },
  { id: 'q3', question: 'Lợi nhuận tính theo đồng tiền nhà từ một tài sản nước ngoài phụ thuộc vào?', options: ['Chỉ lợi nhuận tài sản bằng đồng tiền nước ngoài', 'Chỉ mức thay đổi tỷ giá', 'Cả lợi nhuận tài sản VÀ mức thay đổi tỷ giá', 'Chỉ lãi suất trong nước'], correctIndex: 2, explanation: 'R_nha = (1+R_ngoai)(1+e) - 1: kết hợp cả lợi nhuận tài sản và biến động tỷ giá e.' },
]);

const c2 = doc('ifi301-2-1-asset-classes', '2.1 — International asset classes & markets|||2.1 — Các loại tài sản & thị trường quốc tế',
  'Cổ phiếu quốc tế (niêm yết trực tiếp, ADR/GDR), trái phiếu quốc tế (Eurobond, trái phiếu nội tệ nước ngoài), quỹ đầu tư quốc tế; đặc điểm và cách tiếp cận từng loại.',
  [[
    `<span class="eyebrow">IFI301 · Chapter 2 · Lesson 2.1</span>
<h2>International asset classes &amp; markets</h2>
<h3>International equities</h3>
<ul>
<li><strong>Direct listing</strong> — buying a stock on its home exchange (e.g. a Japanese stock on the Tokyo Stock Exchange), usually needs a broker with foreign-market access.</li>
<li><strong>Depositary receipts (ADR/GDR)</strong> — a certificate traded on a domestic exchange that represents shares held abroad. Convenient — trades in the investor's own market and currency — but still carries the underlying company's foreign-market risk.</li>
</ul>
<h3>International bonds</h3>
<ul>
<li><strong>Foreign bond</strong> — issued by a foreign borrower in the local market's currency (e.g. a Vietnamese company issuing bonds in yen in Japan).</li>
<li><strong>Eurobond</strong> — issued outside the country of the currency it's denominated in (e.g. a USD-denominated bond sold in Europe/Asia, outside the US). Not regulated by any single national authority the way domestic bonds are.</li>
</ul>
<h3>International funds</h3>
<p>Mutual funds and ETFs that pool many investors' money and buy a basket of foreign assets (Chapter 7 covers these in depth) — the most accessible route to international exposure for a retail investor, because the fund manager handles market access and settlement.</p>
<pre><code>Example (hypothetical): comparing three routes to the same foreign company
 Route            | Currency traded in | Access needed
 Direct listing    | Foreign currency    | Foreign broker account
 ADR                | Home currency        | Ordinary domestic broker
 Fund/ETF holding it | Home currency (usually) | Ordinary domestic broker
</code></pre>
<div class="callout"><span class="badge">Same company, different wrapper</span> The "wrapper" (direct share, ADR, or fund unit) changes convenience and reporting currency — it does not remove the underlying company's business or country risk.</div>`,
    `<span class="eyebrow">IFI301 · Chương 2 · Bài 2.1</span>
<h2>Các loại tài sản &amp; thị trường quốc tế</h2>
<h3>Cổ phiếu quốc tế</h3>
<ul>
<li><strong>Niêm yết trực tiếp</strong> — mua cổ phiếu trên sàn nội địa của nó (vd cổ phiếu Nhật trên Sở Tokyo), thường cần tài khoản môi giới có quyền tiếp cận thị trường nước ngoài.</li>
<li><strong>Chứng chỉ lưu ký (ADR/GDR)</strong> — một chứng chỉ giao dịch trên sàn nội địa đại diện cho cổ phần đang được lưu ký ở nước ngoài. Thuận tiện — giao dịch trên thị trường và bằng đồng tiền của nhà đầu tư — nhưng vẫn mang rủi ro thị trường nước ngoài của công ty gốc.</li>
</ul>
<h3>Trái phiếu quốc tế</h3>
<ul>
<li><strong>Trái phiếu nước ngoài (foreign bond)</strong> — do tổ chức nước ngoài phát hành, bằng đồng tiền của thị trường phát hành (vd một công ty Việt Nam phát hành trái phiếu bằng yên ở Nhật).</li>
<li><strong>Eurobond</strong> — phát hành bên ngoài quốc gia có đồng tiền định danh của trái phiếu đó (vd trái phiếu định danh USD bán ở châu Âu/châu Á, ngoài nước Mỹ). Không do một cơ quan quản lý quốc gia đơn lẻ điều chỉnh như trái phiếu nội địa.</li>
</ul>
<h3>Quỹ đầu tư quốc tế</h3>
<p>Quỹ tương hỗ và ETF gom tiền của nhiều nhà đầu tư để mua một danh mục tài sản nước ngoài (Chương 7 đi sâu về loại này) — con đường dễ tiếp cận nhất cho nhà đầu tư cá nhân, vì nhà quản lý quỹ xử lý việc tiếp cận thị trường và thanh toán.</p>
<pre><code>Ví dụ (giả định): so sánh ba cách tiếp cận cùng một công ty nước ngoài
 Cách tiếp cận       | Giao dịch bằng tiền  | Cần gì
 Niêm yết trực tiếp    | Đồng tiền nước ngoài  | Tài khoản môi giới nước ngoài
 ADR                    | Đồng tiền nhà          | Môi giới nội địa thông thường
 Quỹ/ETF nắm giữ nó      | Đồng tiền nhà (thường) | Môi giới nội địa thông thường
</code></pre>
<div class="callout"><span class="badge">Cùng công ty, gói khác nhau</span> "Gói" (cổ phần trực tiếp, ADR, hay chứng chỉ quỹ) thay đổi sự thuận tiện và đồng tiền báo cáo — nó KHÔNG loại bỏ rủi ro kinh doanh hay rủi ro quốc gia của công ty gốc.</div>`,
  ]]);

const c2q = quiz('ifi301-quiz-2', 'Quiz 2 — Tài sản & thị trường quốc tế|||Quiz 2 — Asset classes & markets', [
  { id: 'q1', question: 'Chứng chỉ giao dịch trên sàn nội địa nhưng đại diện cổ phần lưu ký ở nước ngoài gọi là?', options: ['Eurobond', 'ADR/GDR', 'Trái phiếu nội tệ', 'Quỹ ETF'], correctIndex: 1, explanation: 'ADR/GDR (depositary receipt) là chứng chỉ đại diện cổ phần nước ngoài, giao dịch nội địa.' },
  { id: 'q2', question: 'Eurobond được định nghĩa bởi đặc điểm nào?', options: ['Chỉ phát hành ở châu Âu', 'Phát hành bên ngoài quốc gia có đồng tiền định danh của nó', 'Luôn bằng đồng euro', 'Do chính phủ duy nhất bảo lãnh'], correctIndex: 1, explanation: 'Eurobond là trái phiếu phát hành ngoài quốc gia sở hữu đồng tiền định danh — không nhất thiết ở châu Âu hay bằng euro.' },
  { id: 'q3', question: 'Vì sao quỹ/ETF quốc tế thường dễ tiếp cận hơn niêm yết trực tiếp cho nhà đầu tư cá nhân?', options: ['Vì luôn có lợi nhuận cao hơn', 'Vì không có rủi ro', 'Vì nhà quản lý quỹ xử lý việc tiếp cận thị trường & thanh toán, giao dịch bằng đồng tiền nhà', 'Vì pháp luật cấm niêm yết trực tiếp'], correctIndex: 2, explanation: 'Quỹ/ETF gói sẵn việc tiếp cận thị trường nước ngoài; nhà đầu tư chỉ cần môi giới nội địa thông thường. Điều này KHÔNG có nghĩa quỹ không rủi ro.' },
]);

const c3 = doc('ifi301-3-1-risk-return', '3.1 — Risk & return in international investment|||3.1 — Rủi ro & lợi nhuận trong đầu tư quốc tế',
  'Lợi nhuận kỳ vọng E(R), phương sai & độ lệch chuẩn đo rủi ro, hệ số Sharpe; các loại rủi ro riêng có của đầu tư quốc tế (tỷ giá, quốc gia, thanh khoản).',
  [[
    `<span class="eyebrow">IFI301 · Chapter 3 · Lesson 3.1</span>
<h2>Risk &amp; return in international investment</h2>
<h3>Measuring expected return and risk</h3>
<p>Given a set of possible scenarios, each with a probability p and a return R, the <strong>expected return</strong> is a probability-weighted average, and the <strong>standard deviation</strong> (SD) measures how much outcomes scatter around that average — the usual proxy for risk.</p>
<pre><code>E(R)     = sum of [ p_i x R_i ] over all scenarios i
Variance = sum of [ p_i x (R_i - E(R))^2 ] over all scenarios i
SD       = square root of Variance

Example (hypothetical, 3 scenarios for a foreign equity fund):
 Scenario   p     R
 Good       0.3   20%
 Normal     0.5   8%
 Bad        0.2  -10%

 E(R) = 0.3(20%) + 0.5(8%) + 0.2(-10%) = 6% + 4% - 2% = 8%
 (variance/SD follow the same weighted formula above)
</code></pre>
<h3>Reward per unit of risk: the Sharpe ratio</h3>
<pre><code>SR = (Rp - Rf) / SD_p
 where Rp = portfolio return, Rf = risk-free rate, SD_p = portfolio SD

Example (hypothetical): Rp = 8%, Rf = 3%, SD_p = 15%
 SR = (8% - 3%) / 15% = 0.33
</code></pre>
<h3>Risks specific to crossing borders</h3>
<ul>
<li><strong>Currency risk</strong> — the home-currency value of a foreign holding moves with the exchange rate (Chapter 5).</li>
<li><strong>Country/political risk</strong> — capital controls, expropriation, sudden regulation changes.</li>
<li><strong>Liquidity risk</strong> — some foreign markets trade thinly, widening the gap between the price you want and the price you get.</li>
</ul>
<div class="callout"><span class="badge">SD is a proxy, not the whole story</span> Standard deviation treats upside and downside swings symmetrically; it does not capture tail events like a currency controls shock. Use it as one tool among several, not the final word on risk.</div>`,
    `<span class="eyebrow">IFI301 · Chương 3 · Bài 3.1</span>
<h2>Rủi ro &amp; lợi nhuận trong đầu tư quốc tế</h2>
<h3>Đo lợi nhuận kỳ vọng và rủi ro</h3>
<p>Với một tập kịch bản có thể xảy ra, mỗi kịch bản có xác suất p và lợi nhuận R, <strong>lợi nhuận kỳ vọng</strong> là trung bình có trọng số theo xác suất, và <strong>độ lệch chuẩn</strong> (SD) đo mức các kết quả phân tán quanh trung bình đó — thước đo rủi ro thường dùng.</p>
<pre><code>E(R)      = tổng của [ p_i x R_i ] trên mọi kịch bản i
Phương sai = tổng của [ p_i x (R_i - E(R))^2 ] trên mọi kịch bản i
SD         = căn bậc hai của phương sai

Ví dụ (giả định, 3 kịch bản cho một quỹ cổ phiếu nước ngoài):
 Kịch bản   p     R
 Tốt         0,3   20%
 Bình thường  0,5   8%
 Xấu          0,2  -10%

 E(R) = 0,3(20%) + 0,5(8%) + 0,2(-10%) = 6% + 4% - 2% = 8%
 (phương sai/SD tính theo công thức trọng số y hệt trên)
</code></pre>
<h3>Lợi nhuận trên mỗi đơn vị rủi ro: hệ số Sharpe</h3>
<pre><code>SR = (Rp - Rf) / SD_p
 trong đó Rp = lợi nhuận danh mục, Rf = lãi suất không rủi ro, SD_p = SD danh mục

Ví dụ (giả định): Rp = 8%, Rf = 3%, SD_p = 15%
 SR = (8% - 3%) / 15% = 0,33
</code></pre>
<h3>Rủi ro riêng có khi vượt biên giới</h3>
<ul>
<li><strong>Rủi ro tỷ giá</strong> — giá trị tính bằng đồng tiền nhà của một khoản đầu tư nước ngoài biến động theo tỷ giá (Chương 5).</li>
<li><strong>Rủi ro quốc gia/chính trị</strong> — kiểm soát vốn, tịch thu tài sản, thay đổi quy định bất ngờ.</li>
<li><strong>Rủi ro thanh khoản</strong> — một số thị trường nước ngoài giao dịch mỏng, làm rộng khoảng cách giữa giá muốn và giá thực nhận.</li>
</ul>
<div class="callout"><span class="badge">SD là thước đo gần đúng, không phải toàn bộ</span> Độ lệch chuẩn coi biến động tăng và giảm là đối xứng; nó không nắm được các sự kiện đuôi (tail event) như cú sốc kiểm soát vốn. Dùng nó như một công cụ trong nhiều công cụ, không phải lời cuối về rủi ro.</div>`,
  ]]);

const c3q = quiz('ifi301-quiz-3', 'Quiz 3 — Rủi ro & lợi nhuận|||Quiz 3 — Risk & return', [
  { id: 'q1', question: 'Lợi nhuận kỳ vọng E(R) được tính bằng?', options: ['Trung bình cộng đơn giản các kịch bản', 'Trung bình có trọng số theo xác suất mỗi kịch bản', 'Lợi nhuận của kịch bản xấu nhất', 'Độ lệch chuẩn của các kịch bản'], correctIndex: 1, explanation: 'E(R) = tổng [p_i x R_i] — trọng số là xác suất từng kịch bản.' },
  { id: 'q2', question: 'Hệ số Sharpe SR = (Rp - Rf)/SD_p đo điều gì?', options: ['Rủi ro tuyệt đối', 'Lợi nhuận vượt trội trên mỗi đơn vị rủi ro (SD)', 'Tỷ giá kỳ vọng', 'Phần bù rủi ro quốc gia'], correctIndex: 1, explanation: 'Sharpe ratio là lợi nhuận vượt lãi suất không rủi ro, chia cho độ lệch chuẩn — đo hiệu quả trên mỗi đơn vị rủi ro.' },
  { id: 'q3', question: 'Loại rủi ro nào đặc trưng riêng cho đầu tư QUỐC TẾ (so với đầu tư trong nước)?', options: ['Rủi ro lãi suất', 'Rủi ro tỷ giá và rủi ro quốc gia/chính trị', 'Rủi ro lạm phát trong nước', 'Rủi ro của riêng một cổ phiếu (unsystematic risk nội địa)'], correctIndex: 1, explanation: 'Rủi ro tỷ giá và rủi ro quốc gia/chính trị xuất hiện khi tài sản nằm ở một quốc gia/đồng tiền khác với nhà đầu tư.' },
]);

const c4 = doc('ifi301-4-1-diversification', '4.1 — International portfolio diversification|||4.1 — Đa dạng hoá danh mục quốc tế',
  'Vì sao kết hợp tài sản nhiều quốc gia giảm rủi ro danh mục; công thức phương sai danh mục hai tài sản; vai trò của tương quan (correlation) thấp giữa các thị trường.',
  [[
    `<span class="eyebrow">IFI301 · Chapter 4 · Lesson 4.1</span>
<h2>International portfolio diversification</h2>
<h3>Why combining countries can lower risk</h3>
<p>Diversification works because different assets do not move perfectly together. The lower the <strong>correlation</strong> between two assets' returns, the more combining them can reduce the portfolio's overall standard deviation — even if neither asset's own risk changes. National economies, driven by different policies and cycles, often have lower correlation with each other than two companies inside the same domestic market.</p>
<h3>Two-asset portfolio variance</h3>
<pre><code>Var(Rp) = w1^2 x Var1 + w2^2 x Var2 + 2 x w1 x w2 x corr12 x SD1 x SD2
 where w1, w2 = weights (w1 + w2 = 1); SD1, SD2 = standard deviations;
       corr12 = correlation coefficient between asset 1 and asset 2 (-1 to 1)

Example (hypothetical): domestic equity + foreign equity
 w1 = 0.6, SD1 = 20%   (domestic)
 w2 = 0.4, SD2 = 25%   (foreign)
 corr12 = 0.3           (assumed low correlation across markets)

 Var(Rp) = 0.6^2(20%)^2 + 0.4^2(25%)^2 + 2(0.6)(0.4)(0.3)(20%)(25%)
         = 0.0144 + 0.01 + 0.0072 = 0.0316
 SD_p    = sqrt(0.0316) = 17.78%
</code></pre>
<p>Compare: a simple weighted average of the two SDs would be 0.6(20%) + 0.4(25%) = 22%. The actual portfolio SD (17.78%) is lower — that gap IS the diversification benefit, and it grows as corr12 falls toward 0 or negative.</p>
<div class="callout"><span class="badge">Diversification is not elimination</span> Lower correlation reduces risk, but a low correlation today can rise sharply during a global crisis ("correlations go to 1 in a crash") — diversification does not remove risk, it manages it under normal conditions.</div>`,
    `<span class="eyebrow">IFI301 · Chương 4 · Bài 4.1</span>
<h2>Đa dạng hoá danh mục quốc tế</h2>
<h3>Vì sao kết hợp nhiều quốc gia có thể giảm rủi ro</h3>
<p>Đa dạng hoá hiệu quả vì các tài sản không di chuyển hoàn toàn đồng pha. <strong>Tương quan (correlation)</strong> giữa lợi nhuận hai tài sản càng thấp, việc kết hợp chúng càng giảm được độ lệch chuẩn tổng thể của danh mục — dù rủi ro riêng của từng tài sản không đổi. Các nền kinh tế quốc gia, chịu chính sách và chu kỳ khác nhau, thường có tương quan thấp hơn với nhau so với hai công ty trong cùng một thị trường nội địa.</p>
<h3>Phương sai danh mục hai tài sản</h3>
<pre><code>Var(Rp) = w1^2 x Var1 + w2^2 x Var2 + 2 x w1 x w2 x corr12 x SD1 x SD2
 trong đó w1, w2 = trọng số (w1 + w2 = 1); SD1, SD2 = độ lệch chuẩn;
          corr12 = hệ số tương quan giữa tài sản 1 và 2 (từ -1 đến 1)

Ví dụ (giả định): cổ phiếu trong nước + cổ phiếu nước ngoài
 w1 = 0,6, SD1 = 20%   (trong nước)
 w2 = 0,4, SD2 = 25%   (nước ngoài)
 corr12 = 0,3           (giả định tương quan thấp giữa hai thị trường)

 Var(Rp) = 0,6^2(20%)^2 + 0,4^2(25%)^2 + 2(0,6)(0,4)(0,3)(20%)(25%)
         = 0,0144 + 0,01 + 0,0072 = 0,0316
 SD_p    = sqrt(0,0316) = 17,78%
</code></pre>
<p>So sánh: trung bình có trọng số đơn giản của hai SD sẽ là 0,6(20%) + 0,4(25%) = 22%. SD thực tế của danh mục (17,78%) thấp hơn — khoảng cách đó CHÍNH LÀ lợi ích đa dạng hoá, và nó tăng khi corr12 giảm về 0 hoặc âm.</p>
<div class="callout"><span class="badge">Đa dạng hoá không phải triệt tiêu rủi ro</span> Tương quan thấp giúp giảm rủi ro, nhưng tương quan thấp hôm nay có thể tăng mạnh trong khủng hoảng toàn cầu ("tương quan tiến về 1 khi thị trường sụp"). Đa dạng hoá quản lý rủi ro trong điều kiện bình thường, không loại bỏ nó.</div>`,
  ]]);

const c4q = quiz('ifi301-quiz-4', 'Quiz 4 — Đa dạng hoá quốc tế|||Quiz 4 — International diversification', [
  { id: 'q1', question: 'Lợi ích đa dạng hoá của việc kết hợp hai tài sản phụ thuộc chủ yếu vào yếu tố nào giữa chúng?', options: ['Trọng số w1, w2 mà thôi', 'Hệ số tương quan (corr12)', 'Chỉ độ lệch chuẩn của tài sản 1', 'Đồng tiền niêm yết'], correctIndex: 1, explanation: 'Tương quan thấp/âm giữa hai tài sản làm giảm phương sai danh mục nhiều hơn — đó là cốt lõi của lợi ích đa dạng hoá.' },
  { id: 'q2', question: 'Nếu corr12 giảm từ 0,3 về gần -1 (giữ w và SD như cũ), SD của danh mục sẽ?', options: ['Tăng lên', 'Giảm xuống (lợi ích đa dạng hoá lớn hơn)', 'Không đổi', 'Bằng đúng lãi suất không rủi ro'], correctIndex: 1, explanation: 'Số hạng 2·w1·w2·corr12·SD1·SD2 nhỏ hơn (hoặc âm) khi corr12 giảm, kéo Var(Rp) và SD_p xuống.' },
  { id: 'q3', question: 'Vì sao đa dạng hoá quốc tế KHÔNG loại bỏ hoàn toàn rủi ro trong khủng hoảng toàn cầu?', options: ['Vì lãi suất không rủi ro tăng', 'Vì tương quan giữa các thị trường có thể tăng mạnh (tiến về 1) trong khủng hoảng', 'Vì tỷ giá luôn cố định', 'Vì phương sai luôn bằng 0'], correctIndex: 1, explanation: 'Trong khủng hoảng, các thị trường thường bán tháo đồng loạt — tương quan tăng vọt, làm giảm lợi ích đa dạng hoá đúng lúc cần nó nhất.' },
]);

const c5 = doc('ifi301-5-1-currency-risk-hedging', '5.1 — Exchange-rate risk & hedging|||5.1 — Rủi ro tỷ giá trong đầu tư & phòng ngừa',
  'Rủi ro tỷ giá tác động đến lợi nhuận thế nào; hợp đồng kỳ hạn (forward) để phòng ngừa; lợi nhuận có phòng ngừa (hedged) vs không phòng ngừa (unhedged); tỷ lệ phòng ngừa.',
  [[
    `<span class="eyebrow">IFI301 · Chapter 5 · Lesson 5.1</span>
<h2>Exchange-rate risk &amp; hedging</h2>
<h3>Where currency risk comes from</h3>
<p>Recall from Chapter 1: R_home = (1 + R_foreign) x (1 + e) - 1. The term <strong>e</strong> — the percentage change of the foreign currency versus the home currency — can add to or subtract from the asset's own return, sometimes by more than the asset itself moved. This is <strong>currency risk</strong>, and it exists purely because of the currency, independent of the asset's business performance.</p>
<h3>Hedging with a forward contract</h3>
<p>A <strong>forward contract</strong> locks in today an exchange rate for a future date, removing uncertainty about what that rate will be. An investor who converts foreign proceeds using a forward rate agreed in advance gets a <strong>hedged return</strong> that depends only on the asset's foreign-currency return and the pre-agreed forward rate — not on where the spot rate actually ends up.</p>
<pre><code>Unhedged: proceeds converted at the FUTURE spot rate (unknown today)
Hedged:   proceeds converted at a FORWARD rate agreed today

Example (hypothetical):
 Foreign investment = 10,000 units of foreign currency (FC) today
 Foreign return = 8%  ->  10,800 FC at the end of the period
 Forward rate agreed today = 1 FC = 1.00 home currency unit (HC)
 Hedged proceeds = 10,800 FC x 1.00 = 10,800 HC  (known in advance)

 If instead the spot rate at the end turns out to be 1 FC = 0.95 HC (unhedged):
 Unhedged proceeds = 10,800 FC x 0.95 = 10,260 HC (lower, and was unknown in advance)
</code></pre>
<h3>Hedge ratio</h3>
<p>Investors rarely hedge 100% or 0%. The <strong>hedge ratio</strong> = (value of foreign-currency exposure hedged) / (total foreign-currency exposure). A ratio of 0.5 means half the currency exposure is locked in, half is left to float.</p>
<div class="callout"><span class="badge">Hedging has a cost, and removes upside too</span> Forward contracts typically have a small cost (embedded in the forward rate itself) and a hedge that protects against the foreign currency weakening also gives up the gain if it strengthens instead.</div>`,
    `<span class="eyebrow">IFI301 · Chương 5 · Bài 5.1</span>
<h2>Rủi ro tỷ giá trong đầu tư &amp; phòng ngừa</h2>
<h3>Rủi ro tỷ giá đến từ đâu</h3>
<p>Nhớ lại Chương 1: R_nha = (1 + R_ngoai) x (1 + e) - 1. Số hạng <strong>e</strong> — % thay đổi của đồng tiền nước ngoài so với đồng tiền nhà — có thể cộng thêm hoặc trừ đi vào lợi nhuận của chính tài sản, đôi khi nhiều hơn mức tài sản đó tự biến động. Đây là <strong>rủi ro tỷ giá</strong>, tồn tại hoàn toàn do đồng tiền, độc lập với kết quả kinh doanh của tài sản.</p>
<h3>Phòng ngừa bằng hợp đồng kỳ hạn (forward)</h3>
<p>Một <strong>hợp đồng kỳ hạn</strong> chốt sẵn hôm nay một tỷ giá cho một ngày trong tương lai, loại bỏ sự không chắc chắn về tỷ giá đó sẽ là bao nhiêu. Nhà đầu tư chuyển đổi khoản thu ngoại tệ theo tỷ giá kỳ hạn đã thoả thuận trước sẽ nhận <strong>lợi nhuận có phòng ngừa</strong>, chỉ phụ thuộc lợi nhuận bằng ngoại tệ của tài sản và tỷ giá kỳ hạn đã chốt — không phụ thuộc tỷ giá giao ngay thực tế cuối cùng là bao nhiêu.</p>
<pre><code>Không phòng ngừa: chuyển đổi theo tỷ giá GIAO NGAY TƯƠNG LAI (chưa biết hôm nay)
Có phòng ngừa:    chuyển đổi theo tỷ giá KỲ HẠN chốt sẵn hôm nay

Ví dụ (giả định):
 Đầu tư nước ngoài = 10.000 đơn vị ngoại tệ (FC) hôm nay
 Lợi nhuận ngoại tệ = 8%  ->  10.800 FC vào cuối kỳ
 Tỷ giá kỳ hạn chốt hôm nay = 1 FC = 1,00 đơn vị đồng tiền nhà (HC)
 Thu về có phòng ngừa = 10.800 FC x 1,00 = 10.800 HC (biết trước)

 Nếu tỷ giá giao ngay cuối kỳ lại là 1 FC = 0,95 HC (không phòng ngừa):
 Thu về không phòng ngừa = 10.800 FC x 0,95 = 10.260 HC (thấp hơn, và không biết trước)
</code></pre>
<h3>Tỷ lệ phòng ngừa (hedge ratio)</h3>
<p>Nhà đầu tư hiếm khi phòng ngừa 100% hoặc 0%. <strong>Tỷ lệ phòng ngừa</strong> = (giá trị rủi ro tỷ giá đã phòng ngừa) / (tổng rủi ro tỷ giá). Tỷ lệ 0,5 nghĩa là một nửa rủi ro tỷ giá được chốt, một nửa để thả nổi.</p>
<div class="callout"><span class="badge">Phòng ngừa có chi phí và cũng mất phần lợi</span> Hợp đồng kỳ hạn thường có chi phí nhỏ (ẩn trong chính tỷ giá kỳ hạn), và một khoản phòng ngừa bảo vệ khi đồng ngoại tệ yếu đi cũng đồng thời từ bỏ phần lợi nếu đồng đó lại mạnh lên.</div>`,
  ]]);

const c5q = quiz('ifi301-quiz-5', 'Quiz 5 — Rủi ro tỷ giá & phòng ngừa|||Quiz 5 — Currency risk & hedging', [
  { id: 'q1', question: 'Rủi ro tỷ giá xuất hiện vì?', options: ['Lãi suất trong nước thay đổi', 'Đồng tiền nước ngoài biến động giá trị so với đồng tiền nhà, độc lập với kết quả kinh doanh tài sản', 'Công ty nước ngoài phá sản', 'Thanh khoản thị trường thấp'], correctIndex: 1, explanation: 'Rủi ro tỷ giá là biến động của số hạng e trong R_nha = (1+R_ngoai)(1+e)-1, tách biệt với hiệu quả kinh doanh của tài sản.' },
  { id: 'q2', question: 'Hợp đồng kỳ hạn (forward) giúp nhà đầu tư điều gì?', options: ['Tăng lợi nhuận chắc chắn', 'Chốt trước tỷ giá cho một ngày tương lai, loại bỏ sự không chắc chắn về tỷ giá đó', 'Xoá bỏ rủi ro kinh doanh của tài sản', 'Miễn thuế đầu tư nước ngoài'], correctIndex: 1, explanation: 'Forward chỉ chốt tỷ giá tương lai — không liên quan đến rủi ro kinh doanh hay thuế.' },
  { id: 'q3', question: 'Tỷ lệ phòng ngừa (hedge ratio) = 0,5 nghĩa là gì?', options: ['Toàn bộ rủi ro tỷ giá được phòng ngừa', 'Không phòng ngừa gì cả', 'Một nửa giá trị rủi ro tỷ giá được chốt bằng hợp đồng kỳ hạn, một nửa thả nổi', 'Lợi nhuận tài sản giảm 50%'], correctIndex: 2, explanation: 'Hedge ratio = giá trị đã phòng ngừa / tổng rủi ro tỷ giá; 0,5 là phòng ngừa một nửa.' },
]);

const c6 = doc('ifi301-6-1-emerging-markets', '6.1 — Investing in emerging markets|||6.1 — Đầu tư vào thị trường mới nổi',
  'Đặc điểm thị trường mới nổi (tăng trưởng, biến động, thanh khoản, rủi ro chính trị/pháp lý); phần bù rủi ro quốc gia; những cân nhắc khi đưa emerging markets vào danh mục.',
  [[
    `<span class="eyebrow">IFI301 · Chapter 6 · Lesson 6.1</span>
<h2>Investing in emerging markets</h2>
<h3>What makes a market "emerging"</h3>
<p>Index providers (e.g. MSCI) classify markets by criteria such as economic development, market size/liquidity, and accessibility for foreign investors. Emerging markets typically offer <strong>faster potential growth</strong> than developed markets, paired with <strong>higher volatility</strong>, <strong>lower liquidity</strong>, and greater exposure to political/regulatory change.</p>
<h3>Country risk premium</h3>
<p>Because of these extra risks, investors often require a higher expected return to hold emerging-market assets — a <strong>country risk premium</strong> added on top of what a comparable developed-market asset would need.</p>
<pre><code>Required return (illustrative decomposition):
 Required return = Rf + Equity risk premium + Country risk premium

Example (hypothetical, for comparison only):
 Rf (risk-free rate)          = 3%
 Equity risk premium          = 5%   (general premium for holding equities)
 Country risk premium (EM)    = 4%   (assumed, for one emerging market)
 Required return              = 3% + 5% + 4% = 12%
</code></pre>
<h3>Practical considerations</h3>
<ul>
<li><strong>Capital controls</strong> — some countries restrict how much foreign currency can be moved in or out, which can trap or delay proceeds.</li>
<li><strong>Liquidity risk</strong> — thinner trading can widen bid-ask spreads and make large trades move the price.</li>
<li><strong>Information/transparency risk</strong> — accounting standards, disclosure quality and legal protection for minority shareholders vary widely.</li>
</ul>
<div class="callout"><span class="badge">Higher potential return, explicitly higher risk</span> A larger country risk premium is compensation for real, cited risks — not a guarantee. This course does not recommend allocating to, or avoiding, any specific market.</div>`,
    `<span class="eyebrow">IFI301 · Chương 6 · Bài 6.1</span>
<h2>Đầu tư vào thị trường mới nổi</h2>
<h3>Điều gì khiến một thị trường được gọi là "mới nổi"</h3>
<p>Các nhà cung cấp chỉ số (vd MSCI) phân loại thị trường theo tiêu chí như mức phát triển kinh tế, quy mô/thanh khoản thị trường, và khả năng tiếp cận cho nhà đầu tư nước ngoài. Thị trường mới nổi thường có <strong>tiềm năng tăng trưởng nhanh hơn</strong> thị trường phát triển, đi kèm <strong>biến động cao hơn</strong>, <strong>thanh khoản thấp hơn</strong>, và rủi ro thay đổi chính trị/pháp lý lớn hơn.</p>
<h3>Phần bù rủi ro quốc gia</h3>
<p>Vì những rủi ro thêm này, nhà đầu tư thường yêu cầu lợi nhuận kỳ vọng cao hơn để giữ tài sản thị trường mới nổi — một <strong>phần bù rủi ro quốc gia</strong> cộng thêm vào mức mà một tài sản tương đương ở thị trường phát triển cần có.</p>
<pre><code>Lợi nhuận yêu cầu (phân tách minh hoạ):
 Lợi nhuận yêu cầu = Rf + Phần bù rủi ro cổ phiếu + Phần bù rủi ro quốc gia

Ví dụ (giả định, chỉ để minh hoạ):
 Rf (lãi suất không rủi ro)      = 3%
 Phần bù rủi ro cổ phiếu          = 5%   (phần bù chung khi giữ cổ phiếu)
 Phần bù rủi ro quốc gia (EM)     = 4%   (giả định, cho một thị trường mới nổi)
 Lợi nhuận yêu cầu                = 3% + 5% + 4% = 12%
</code></pre>
<h3>Những cân nhắc thực tế</h3>
<ul>
<li><strong>Kiểm soát vốn</strong> — một số quốc gia hạn chế mức ngoại tệ được chuyển vào/ra, có thể làm kẹt hoặc trì hoãn khoản thu.</li>
<li><strong>Rủi ro thanh khoản</strong> — giao dịch mỏng hơn có thể nới rộng chênh lệch giá mua-bán và khiến giao dịch lớn làm dịch chuyển giá.</li>
<li><strong>Rủi ro thông tin/minh bạch</strong> — chuẩn kế toán, chất lượng công bố thông tin và bảo vệ pháp lý cho cổ đông nhỏ khác nhau rất nhiều.</li>
</ul>
<div class="callout"><span class="badge">Lợi nhuận tiềm năng cao hơn, rủi ro nêu rõ cao hơn</span> Phần bù rủi ro quốc gia lớn hơn là để đền bù cho những rủi ro thật, đã được chỉ rõ — không phải một sự bảo đảm. Môn học này không khuyến nghị phân bổ vào, hay tránh, bất kỳ thị trường cụ thể nào.</div>`,
  ]]);

const c6q = quiz('ifi301-quiz-6', 'Quiz 6 — Thị trường mới nổi|||Quiz 6 — Emerging markets', [
  { id: 'q1', question: 'So với thị trường phát triển, thị trường mới nổi thường có đặc điểm gì?', options: ['Biến động thấp hơn, thanh khoản cao hơn', 'Tiềm năng tăng trưởng nhanh hơn nhưng biến động và rủi ro cao hơn', 'Không có rủi ro chính trị', 'Luôn cấm nhà đầu tư nước ngoài'], correctIndex: 1, explanation: 'Thị trường mới nổi thường tăng trưởng nhanh hơn nhưng đi kèm biến động, thanh khoản và rủi ro chính trị/pháp lý cao hơn.' },
  { id: 'q2', question: 'Phần bù rủi ro quốc gia được cộng vào đâu để ra lợi nhuận yêu cầu?', options: ['Chỉ vào lãi suất không rủi ro', 'Vào Rf cộng phần bù rủi ro cổ phiếu', 'Trừ khỏi lợi nhuận kỳ vọng', 'Không liên quan đến lợi nhuận yêu cầu'], correctIndex: 1, explanation: 'Lợi nhuận yêu cầu = Rf + phần bù rủi ro cổ phiếu + phần bù rủi ro quốc gia.' },
  { id: 'q3', question: 'Kiểm soát vốn (capital controls) ở một số thị trường mới nổi tạo ra rủi ro gì?', options: ['Rủi ro lãi suất tăng', 'Có thể làm kẹt hoặc trì hoãn việc chuyển ngoại tệ vào/ra', 'Rủi ro lạm phát trong nước nhà đầu tư', 'Không có rủi ro nào'], correctIndex: 1, explanation: 'Kiểm soát vốn hạn chế dòng ngoại tệ ra/vào, có thể khiến nhà đầu tư không rút được vốn đúng lúc mong muốn.' },
]);

const c7 = doc('ifi301-7-1-funds-etf', '7.1 — International funds, ETFs & investment products|||7.1 — Quỹ đầu tư quốc tế, ETF & sản phẩm đầu tư',
  'Quỹ tương hỗ (active) vs ETF (thường theo chỉ số); NAV, phí quản lý (expense ratio), sai lệch bám chỉ số (tracking error); tác động của phí lên lợi nhuận dài hạn.',
  [[
    `<span class="eyebrow">IFI301 · Chapter 7 · Lesson 7.1</span>
<h2>International funds, ETFs &amp; investment products</h2>
<h3>Mutual funds vs ETFs</h3>
<ul>
<li><strong>Mutual funds</strong> — priced once a day at <strong>Net Asset Value (NAV)</strong> = (total assets − liabilities) / number of units. Often actively managed, aiming to beat a benchmark.</li>
<li><strong>ETFs (exchange-traded funds)</strong> — trade throughout the day like a stock; most track an index (passive), though actively managed ETFs also exist. Generally lower expense ratios than actively managed mutual funds.</li>
</ul>
<h3>Cost: the expense ratio</h3>
<pre><code>Expense ratio = annual fund operating cost / average fund assets

Example (hypothetical): how a 2% fee vs a 0.2% fee compounds over 20 years
 Starting amount = 100 (units), gross annual return = 7% for both funds
 Fund A (fee 2%): net return = 5% per year   -> 100 x (1.05)^20 = 265.3
 Fund B (fee 0.2%): net return = 6.8% per year -> 100 x (1.068)^20 = 372.7
 Same gross return, very different ending value — cost compounds too.
</code></pre>
<h3>Tracking error (for index-tracking funds/ETFs)</h3>
<pre><code>Tracking error = standard deviation of (Return_fund - Return_index)
 measured over a series of periods; a small tracking error means the fund
 closely follows its benchmark index, before/after accounting for fees.
</code></pre>
<div class="callout"><span class="badge">Read the factsheet, not the fund name</span> A fund's name can say "global" or "emerging markets" while its actual holdings, currency exposure and fee structure differ widely — check the factsheet's asset breakdown and expense ratio, not just the label.</div>`,
    `<span class="eyebrow">IFI301 · Chương 7 · Bài 7.1</span>
<h2>Quỹ đầu tư quốc tế, ETF &amp; sản phẩm đầu tư</h2>
<h3>Quỹ tương hỗ vs ETF</h3>
<ul>
<li><strong>Quỹ tương hỗ (mutual fund)</strong> — định giá một lần mỗi ngày theo <strong>giá trị tài sản thuần (NAV)</strong> = (tổng tài sản − nợ) / số đơn vị quỹ. Thường quản lý chủ động (active), nhằm vượt một chỉ số tham chiếu.</li>
<li><strong>ETF (quỹ giao dịch trên sàn)</strong> — giao dịch suốt ngày như cổ phiếu; đa số theo chỉ số (passive/thụ động), tuy vẫn có ETF chủ động. Thường có phí quản lý (expense ratio) thấp hơn quỹ tương hỗ chủ động.</li>
</ul>
<h3>Chi phí: tỷ lệ phí quản lý (expense ratio)</h3>
<pre><code>Expense ratio = chi phí vận hành quỹ hàng năm / tài sản quỹ trung bình

Ví dụ (giả định): phí 2% so với phí 0,2% cộng gộp qua 20 năm ra sao
 Số tiền ban đầu = 100 (đơn vị), lợi nhuận gộp mỗi năm = 7% cho cả hai quỹ
 Quỹ A (phí 2%): lợi nhuận ròng = 5%/năm   -> 100 x (1,05)^20 = 265,3
 Quỹ B (phí 0,2%): lợi nhuận ròng = 6,8%/năm -> 100 x (1,068)^20 = 372,7
 Cùng lợi nhuận gộp, giá trị cuối kỳ rất khác nhau — chi phí cũng cộng gộp theo thời gian.
</code></pre>
<h3>Sai lệch bám chỉ số (tracking error, cho quỹ/ETF theo chỉ số)</h3>
<pre><code>Tracking error = độ lệch chuẩn của (Lợi nhuận quỹ - Lợi nhuận chỉ số)
 đo qua một chuỗi kỳ; sai lệch nhỏ nghĩa là quỹ bám khá sát chỉ số tham
 chiếu, trước/sau khi tính đến phí.
</code></pre>
<div class="callout"><span class="badge">Đọc bản cáo bạch, không chỉ đọc tên quỹ</span> Tên quỹ có thể ghi "toàn cầu" hay "thị trường mới nổi" nhưng danh mục thực tế, mức rủi ro tỷ giá và cấu trúc phí có thể rất khác — hãy xem bảng phân bổ tài sản và tỷ lệ phí trong factsheet, không chỉ dựa vào cái tên.</div>`,
  ]]);

const c7q = quiz('ifi301-quiz-7', 'Quiz 7 — Quỹ & ETF quốc tế|||Quiz 7 — International funds & ETFs', [
  { id: 'q1', question: 'NAV (giá trị tài sản thuần) của một quỹ tương hỗ được tính bằng?', options: ['Tổng tài sản nhân số đơn vị quỹ', '(Tổng tài sản − nợ) / số đơn vị quỹ', 'Giá cổ phiếu cao nhất trong danh mục', 'Phí quản lý hàng năm'], correctIndex: 1, explanation: 'NAV = (tổng tài sản - nợ) / số đơn vị quỹ đang lưu hành, định giá thường một lần mỗi ngày.' },
  { id: 'q2', question: 'Tỷ lệ phí quản lý (expense ratio) cao hơn ảnh hưởng thế nào đến lợi nhuận dài hạn?', options: ['Không ảnh hưởng gì vì phí trừ một lần', 'Làm giảm lợi nhuận ròng mỗi năm, và mức giảm đó CỘNG GỘP theo thời gian', 'Luôn được bù lại bằng lợi nhuận gộp cao hơn', 'Chỉ ảnh hưởng đến ETF, không ảnh hưởng quỹ tương hỗ'], correctIndex: 1, explanation: 'Phí trừ hàng năm làm giảm lợi nhuận ròng, và khoản chênh lệch đó tăng theo cấp số nhân qua nhiều năm (compounding).' },
  { id: 'q3', question: 'Tracking error nhỏ ở một quỹ/ETF theo chỉ số cho biết điều gì?', options: ['Quỹ luôn vượt trội chỉ số', 'Quỹ bám khá sát diễn biến của chỉ số tham chiếu', 'Quỹ không có phí quản lý', 'Quỹ không có rủi ro tỷ giá'], correctIndex: 1, explanation: 'Tracking error đo độ lệch chuẩn giữa lợi nhuận quỹ và lợi nhuận chỉ số — nhỏ nghĩa là bám sát chỉ số.' },
]);

const c8 = doc('ifi301-8-1-global-allocation', '8.1 — Global asset allocation & practice for Vietnamese investors|||8.1 — Phân bổ tài sản toàn cầu & thực tiễn nhà đầu tư Việt Nam',
  'Phân bổ tài sản chiến lược (strategic asset allocation) qua nhiều quốc gia/loại tài sản; home bias; các ràng buộc pháp lý/thực tế khi nhà đầu tư Việt Nam đầu tư ra nước ngoài.',
  [[
    `<span class="eyebrow">IFI301 · Chapter 8 · Lesson 8.1</span>
<h2>Global asset allocation &amp; practice for Vietnamese investors</h2>
<h3>Strategic asset allocation</h3>
<p><strong>Strategic asset allocation</strong> is the long-term target mix of asset classes and countries/regions an investor sets, based on goals, time horizon and risk tolerance — the weights (w1, w2, ... summing to 100%) referenced in Chapter 4, chosen deliberately rather than by accident.</p>
<pre><code>Example (hypothetical, illustrative only, not a recommendation):
 Domestic equities        30%
 Domestic bonds           20%
 Developed-market equities 25%
 Emerging-market equities  15%
 International bonds/funds 10%
 Total                    100%
</code></pre>
<h3>Home bias</h3>
<p><strong>Home bias</strong> is the well-documented tendency of investors worldwide to hold far more of their own country's assets than a purely risk/return optimization would suggest — often due to familiarity, currency comfort, and easier access to information. It is a real, measured pattern in the data, not a rule to follow or avoid on its own.</p>
<h3>Practical constraints for investors based in Vietnam</h3>
<ul>
<li><strong>Foreign-exchange regulation</strong> — outbound investment by individuals is subject to Vietnamese foreign-exchange management rules; check current State Bank of Vietnam (SBV) regulations before any real transaction.</li>
<li><strong>Access channels</strong> — direct foreign brokerage accounts, or domestically distributed funds/ETFs that themselves hold foreign assets, are the two common routes; each has different fees, currency handling, and reporting.</li>
<li><strong>Taxation</strong> — foreign investment income may be subject to both foreign withholding tax and Vietnamese personal income tax rules; this varies by product and is outside the scope of this course.</li>
</ul>
<div class="callout"><span class="badge">⚠️ Course closing note</span> Everything in this course — formulas, allocations, risk premiums — used <strong>assumed, hypothetical numbers</strong> to teach method. Real decisions require current data, a licensed advisor where required by law, and attention to the legal/tax rules in force at the time. This course does not recommend any specific allocation or product.</div>`,
    `<span class="eyebrow">IFI301 · Chương 8 · Bài 8.1</span>
<h2>Phân bổ tài sản toàn cầu &amp; thực tiễn nhà đầu tư Việt Nam</h2>
<h3>Phân bổ tài sản chiến lược</h3>
<p><strong>Phân bổ tài sản chiến lược</strong> là tỷ trọng mục tiêu dài hạn giữa các loại tài sản và quốc gia/khu vực mà nhà đầu tư đặt ra, dựa trên mục tiêu, chân trời thời gian và khả năng chịu rủi ro — chính là các trọng số (w1, w2, ... cộng lại 100%) đã nói ở Chương 4, được chọn có chủ đích chứ không phải tuỳ tiện.</p>
<pre><code>Ví dụ (giả định, chỉ minh hoạ, KHÔNG phải khuyến nghị):
 Cổ phiếu trong nước         30%
 Trái phiếu trong nước        20%
 Cổ phiếu thị trường phát triển 25%
 Cổ phiếu thị trường mới nổi   15%
 Trái phiếu/quỹ quốc tế         10%
 Tổng                          100%
</code></pre>
<h3>Thiên lệch nội địa (home bias)</h3>
<p><strong>Home bias</strong> là xu hướng đã được ghi nhận rộng rãi trên toàn cầu: nhà đầu tư giữ tài sản trong nước nhiều hơn hẳn mức mà tối ưu rủi ro/lợi nhuận thuần túy gợi ý — thường do sự quen thuộc, cảm giác an toàn về đồng tiền, và dễ tiếp cận thông tin hơn. Đây là một hiện tượng thực tế, được đo trong dữ liệu, không phải một quy tắc để làm theo hay tránh một cách máy móc.</p>
<h3>Ràng buộc thực tế cho nhà đầu tư ở Việt Nam</h3>
<ul>
<li><strong>Quy định ngoại hối</strong> — đầu tư ra nước ngoài của cá nhân chịu sự quản lý ngoại hối của Việt Nam; cần kiểm tra quy định hiện hành của Ngân hàng Nhà nước (SBV) trước bất kỳ giao dịch thật nào.</li>
<li><strong>Kênh tiếp cận</strong> — tài khoản môi giới nước ngoài trực tiếp, hoặc quỹ/ETF phân phối trong nước mà tự nắm giữ tài sản nước ngoài, là hai con đường phổ biến; mỗi kênh có phí, cách xử lý ngoại tệ và báo cáo khác nhau.</li>
<li><strong>Thuế</strong> — thu nhập đầu tư nước ngoài có thể chịu cả thuế khấu trừ tại nước ngoài và quy định thuế thu nhập cá nhân Việt Nam; điều này khác nhau theo sản phẩm và nằm ngoài phạm vi môn học này.</li>
</ul>
<div class="callout"><span class="badge">⚠️ Ghi chú kết môn</span> Mọi thứ trong môn này — công thức, tỷ trọng phân bổ, phần bù rủi ro — đều dùng <strong>số liệu giả định</strong> để dạy phương pháp. Quyết định thật cần dữ liệu hiện hành, tư vấn viên có chứng chỉ khi pháp luật yêu cầu, và chú ý quy định pháp lý/thuế đang có hiệu lực tại thời điểm đó. Môn học này không khuyến nghị bất kỳ tỷ trọng phân bổ hay sản phẩm cụ thể nào.</div>`,
  ]]);

const c8q = quiz('ifi301-quiz-8', 'Quiz 8 — Phân bổ tài sản toàn cầu|||Quiz 8 — Global asset allocation', [
  { id: 'q1', question: 'Phân bổ tài sản chiến lược là gì?', options: ['Mua bán liên tục theo tin tức ngắn hạn', 'Tỷ trọng mục tiêu dài hạn giữa các loại tài sản/quốc gia, đặt theo mục tiêu và khả năng chịu rủi ro', 'Chỉ đầu tư vào một cổ phiếu duy nhất', 'Một loại thuế đầu tư'], correctIndex: 1, explanation: 'Đây là các trọng số dài hạn (w1, w2,... = 100%) được chọn có chủ đích dựa trên mục tiêu và khả năng chịu rủi ro.' },
  { id: 'q2', question: '"Home bias" (thiên lệch nội địa) mô tả hiện tượng gì?', options: ['Nhà đầu tư luôn tối ưu hoá rủi ro/lợi nhuận hoàn hảo', 'Nhà đầu tư giữ tài sản trong nước nhiều hơn mức tối ưu rủi ro/lợi nhuận thuần túy gợi ý', 'Chỉ xảy ra ở Việt Nam', 'Là một quy định pháp luật bắt buộc'], correctIndex: 1, explanation: 'Home bias là hiện tượng quan sát được rộng rãi trên toàn cầu, không phải luật hay quy tắc bắt buộc.' },
  { id: 'q3', question: 'Ràng buộc thực tế nào nhà đầu tư ở Việt Nam cần kiểm tra TRƯỚC khi đầu tư ra nước ngoài?', options: ['Không cần kiểm tra gì, tự do hoàn toàn', 'Quy định quản lý ngoại hối hiện hành của Ngân hàng Nhà nước (SBV)', 'Chỉ cần biết giá cổ phiếu', 'Chỉ cần mở tài khoản ở bất kỳ đâu'], correctIndex: 1, explanation: 'Đầu tư ra nước ngoài của cá nhân chịu quản lý ngoại hối; cần kiểm tra quy định SBV hiện hành trước khi giao dịch thật.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'IFI301',
    slug: 'ifi301-international-financial-investment',
    title: 'International Financial Investment',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IFI301.webp',
    shortDescription: 'How investors evaluate cross-border equities, bonds & funds — risk/return, diversification, currency hedging, emerging markets, ETFs, global allocation. Bilingual, hypothetical examples & quizzes. Educational only.|||Nhà đầu tư đánh giá cổ phiếu, trái phiếu, quỹ xuyên biên giới thế nào — rủi ro/lợi nhuận, đa dạng hoá, phòng ngừa tỷ giá, thị trường mới nổi, ETF, phân bổ tài sản toàn cầu. Song ngữ, ví dụ giả định & quiz. Chỉ học thuật.',
    description: 'Môn <strong>IFI301 — International Financial Investment</strong> (kỳ 5, khối Quản trị Kinh doanh) giải thích <strong>nhà đầu tư đánh giá cơ hội xuyên biên giới thế nào</strong>. Từ <strong>tổng quan thị trường toàn cầu</strong> &amp; <strong>các loại tài sản quốc tế</strong> (cổ phiếu, trái phiếu, quỹ) → <strong>rủi ro &amp; lợi nhuận</strong> (E(R), độ lệch chuẩn, Sharpe) → <strong>đa dạng hoá danh mục quốc tế</strong> → <strong>rủi ro tỷ giá &amp; phòng ngừa</strong> (forward, hedge ratio) → <strong>thị trường mới nổi</strong> (phần bù rủi ro quốc gia) → <strong>quỹ &amp; ETF quốc tế</strong> (NAV, phí, tracking error) → <strong>phân bổ tài sản toàn cầu</strong> và ràng buộc thực tế cho nhà đầu tư Việt Nam. Bám giáo trình Bodie/Kane/Marcus &amp; Solnik, song ngữ, ví dụ tính toán <strong>giả định</strong>, quiz mỗi chương. <strong>Mang tính học thuật, không phải lời khuyên đầu tư.</strong>',
    whatYouLearn: 'Đầu tư trực tiếp vs gián tiếp; cấu trúc thị trường toàn cầu (phát triển/mới nổi/cận biên); cổ phiếu quốc tế (ADR/GDR), trái phiếu quốc tế (Eurobond), quỹ; lợi nhuận trong tệ nhà R_home=(1+R_foreign)(1+e)-1; E(R), phương sai, độ lệch chuẩn, Sharpe ratio; phương sai danh mục hai tài sản & vai trò tương quan; rủi ro tỷ giá & phòng ngừa bằng forward, hedge ratio; phần bù rủi ro quốc gia ở thị trường mới nổi; NAV, expense ratio, tracking error của quỹ/ETF; phân bổ tài sản chiến lược, home bias, ràng buộc ngoại hối/thuế cho nhà đầu tư Việt Nam.',
    requirements: 'Kiến thức tài chính/kinh tế cơ bản (giá trị thời gian của tiền, lãi suất). Không yêu cầu tài khoản đầu tư thật — mọi ví dụ trong môn đều dùng số liệu giả định.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đầu tư tài chính quốc tế là gì, vì sao quan tâm, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & thị trường toàn cầu|||Chapter 1 — Overview & global markets', description: 'FDI vs portfolio, cấu trúc thị trường, lợi nhuận trong tệ nhà.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tài sản & thị trường quốc tế|||Chapter 2 — International asset classes', description: 'Cổ phiếu (ADR/GDR), trái phiếu (Eurobond), quỹ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Rủi ro & lợi nhuận|||Chapter 3 — Risk & return', description: 'E(R), phương sai, độ lệch chuẩn, Sharpe ratio, rủi ro riêng có.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đa dạng hoá danh mục quốc tế|||Chapter 4 — International diversification', description: 'Phương sai danh mục hai tài sản, tương quan.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Rủi ro tỷ giá & phòng ngừa|||Chapter 5 — Currency risk & hedging', description: 'Forward contract, lợi nhuận hedged vs unhedged, hedge ratio.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thị trường mới nổi|||Chapter 6 — Emerging markets', description: 'Đặc điểm, phần bù rủi ro quốc gia, cân nhắc thực tế.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quỹ đầu tư quốc tế & ETF|||Chapter 7 — International funds & ETFs', description: 'Mutual fund vs ETF, NAV, expense ratio, tracking error.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phân bổ tài sản toàn cầu|||Chapter 8 — Global asset allocation', description: 'Strategic allocation, home bias, thực tiễn nhà đầu tư Việt Nam.', lessons: [c8, c8q] },
  ],
};
