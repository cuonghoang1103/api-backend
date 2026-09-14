/**
 * FIN201 — Monetary Economics and Global Economy. Giáo trình FLM
 * (syl): tiền tệ & hệ thống tiền tệ, NHTW & cung tiền, chính sách tiền tệ &
 * lãi suất, lạm phát/thất nghiệp & đường Phillips, hệ thống tài chính, tỷ giá
 * & thị trường ngoại hối, cán cân thanh toán, toàn cầu hoá & khủng hoảng tài
 * chính (IMF/WB/WTO). Trích Mishkin, Krugman/Obstfeld, Blanchard. Song ngữ.
 * Giữ NGUYÊN slug/semester/thumb(v3). Thêm syncOrder+pruneSections.
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('fin201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & sách (Mishkin, Krugman/Obstfeld, Blanchard), tài liệu chính thức miễn phí, dữ liệu kinh tế, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">FIN201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Monetary Economics and the Global Economy — money &amp; central banking, monetary policy, inflation, financial markets, exchange rates and the balance of payments — in one place. The full official slides &amp; giáo trình live on <strong>FLM</strong>; below are the reference textbooks and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FIN201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Frederic S. Mishkin — <em>The Economics of Money, Banking and Financial Markets</em> (money, banking, monetary policy, financial system)</li>
<li>Paul Krugman &amp; Maurice Obstfeld — <em>International Economics: Theory and Policy</em> (exchange rates, balance of payments, open economy)</li>
<li>Olivier Blanchard — <em>Macroeconomics</em> (inflation, unemployment, aggregate demand/supply, policy)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.imf.org/en/About" target="_blank" rel="noopener">IMF — About &amp; publications</a> — surveillance, lending, capacity development</li>
<li><a href="https://www.worldbank.org/en/about" target="_blank" rel="noopener">World Bank — About</a> — development financing</li>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm" target="_blank" rel="noopener">WTO — What is the WTO</a> — trade rules &amp; disputes</li>
<li><a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener">FRED (St. Louis Fed)</a> — free real-world money supply, inflation, interest-rate data series</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@mruniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — short, clear macro/monetary videos</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — real-world monetary &amp; global-economy cases</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener">FRED</a> — chart real money-supply, CPI and interest-rate data</li>
<li><a href="https://tradingeconomics.com/" target="_blank" rel="noopener">Trading Economics</a> — live exchange rates, policy rates, balance-of-payments data by country</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — functions of money, central bank tools, monetary policy transmission, inflation vs unemployment (Phillips curve).</li>
<li><strong>Practice</strong> — money-multiplier and interest-parity calculations; read one FRED chart per topic.</li>
<li><strong>Go deeper</strong> — financial markets &amp; intermediaries, exchange-rate regimes, balance-of-payments identity.</li>
<li><strong>Big picture</strong> — globalization, financial crises (1997 Asia, 2008), and the role of IMF/WB/WTO.</li>
</ol></div>`,
    `<span class="eyebrow">FIN201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Kinh tế tiền tệ &amp; Kinh tế toàn cầu — tiền tệ &amp; ngân hàng trung ương, chính sách tiền tệ, lạm phát, thị trường tài chính, tỷ giá và cán cân thanh toán — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách tham khảo và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FIN201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Frederic S. Mishkin — <em>The Economics of Money, Banking and Financial Markets</em> (tiền tệ, ngân hàng, chính sách tiền tệ, hệ thống tài chính)</li>
<li>Paul Krugman &amp; Maurice Obstfeld — <em>International Economics: Theory and Policy</em> (tỷ giá, cán cân thanh toán, kinh tế mở)</li>
<li>Olivier Blanchard — <em>Macroeconomics</em> (lạm phát, thất nghiệp, tổng cầu/tổng cung, chính sách)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.imf.org/en/About" target="_blank" rel="noopener">IMF — Giới thiệu &amp; ấn phẩm</a> — giám sát, cho vay, hỗ trợ năng lực</li>
<li><a href="https://www.worldbank.org/en/about" target="_blank" rel="noopener">World Bank — Giới thiệu</a> — tài trợ phát triển</li>
<li><a href="https://www.wto.org/english/thewto_e/whatis_e/whatis_e.htm" target="_blank" rel="noopener">WTO — WTO là gì</a> — quy tắc thương mại &amp; tranh chấp</li>
<li><a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener">FRED (St. Louis Fed)</a> — chuỗi số liệu thật miễn phí về cung tiền, lạm phát, lãi suất</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@mruniversity" target="_blank" rel="noopener">Marginal Revolution University</a> — video macro/tiền tệ ngắn, rõ</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — ca thực tế về tiền tệ &amp; kinh tế toàn cầu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener">FRED</a> — vẽ biểu đồ cung tiền, CPI, lãi suất thật</li>
<li><a href="https://tradingeconomics.com/" target="_blank" rel="noopener">Trading Economics</a> — tỷ giá, lãi suất điều hành, cán cân thanh toán theo từng nước, cập nhật liên tục</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — chức năng của tiền, công cụ NHTW, truyền dẫn chính sách tiền tệ, lạm phát vs thất nghiệp (đường Phillips).</li>
<li><strong>Luyện tập</strong> — tính số nhân tiền và ngang giá lãi suất; đọc một biểu đồ FRED cho mỗi chủ đề.</li>
<li><strong>Đào sâu</strong> — thị trường &amp; định chế tài chính, chế độ tỷ giá, đồng nhất thức cán cân thanh toán.</li>
<li><strong>Nhìn toàn cảnh</strong> — toàn cầu hoá, khủng hoảng tài chính (Châu Á 1997, 2008), vai trò IMF/WB/WTO.</li>
</ol></div>`,
  ]]);

const intro = doc('fin201-0-1-overview', 'Course overview: Monetary Economics and Global Economy|||Tổng quan: Kinh tế tiền tệ và Kinh tế toàn cầu',
  'Vì sao học tiền tệ & kinh tế toàn cầu; lộ trình 8 chương từ tiền tệ → NHTW → chính sách tiền tệ → lạm phát/thất nghiệp → hệ thống tài chính → tỷ giá → cán cân thanh toán → toàn cầu hoá & khủng hoảng.',
  [[
    `<span class="eyebrow">FIN201 · Lesson 0.1 · Overview</span>
<h2>Monetary Economics and Global Economy</h2>
<p class="lead">This course explains <strong>how money, banks and the global economy connect</strong> — why central banks raise or cut interest rates, why prices rise, why currencies move, and how countries trade and borrow from each other. It draws on three classic references: Mishkin (money &amp; banking), Krugman/Obstfeld (international economics), and Blanchard (macroeconomics).</p>
<h3>Two halves of the course</h3>
<ul>
<li><strong>Monetary economics (closed-economy view)</strong> — what money is, how central banks create/control it, how monetary policy works, and how it drives inflation and unemployment.</li>
<li><strong>Global economy (open-economy view)</strong> — how financial markets connect countries, how exchange rates and the balance of payments work, and how globalization creates both growth and crises.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<pre><code>1. Money: functions &amp; the monetary system
2. Central banks &amp; the money supply
3. Monetary policy &amp; interest rates
4. Inflation, unemployment &amp; the Phillips curve
5. The financial system &amp; financial markets
6. Exchange rates &amp; the foreign exchange market
7. Balance of payments &amp; the open economy
8. Globalization, financial crises &amp; international institutions (IMF, WB, WTO)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Every headline about "the Fed raising rates," "the dong weakening," or "an IMF bailout" is this course, applied. By the end you can read those headlines and explain the mechanism behind them.</div>`,
    `<span class="eyebrow">FIN201 · Bài 0.1 · Tổng quan</span>
<h2>Kinh tế tiền tệ và Kinh tế toàn cầu</h2>
<p class="lead">Môn này giải thích <strong>tiền, ngân hàng và kinh tế toàn cầu liên kết với nhau ra sao</strong> — vì sao ngân hàng trung ương tăng/giảm lãi suất, vì sao giá cả tăng, vì sao tỷ giá biến động, và các nước giao thương/vay mượn nhau thế nào. Môn bám ba tài liệu kinh điển: Mishkin (tiền &amp; ngân hàng), Krugman/Obstfeld (kinh tế quốc tế), Blanchard (kinh tế học vĩ mô).</p>
<h3>Hai nửa của môn học</h3>
<ul>
<li><strong>Kinh tế tiền tệ (góc nhìn nền kinh tế đóng)</strong> — tiền là gì, ngân hàng trung ương tạo/kiểm soát tiền thế nào, chính sách tiền tệ vận hành ra sao, và nó tác động đến lạm phát &amp; thất nghiệp thế nào.</li>
<li><strong>Kinh tế toàn cầu (góc nhìn nền kinh tế mở)</strong> — thị trường tài chính kết nối các nước thế nào, tỷ giá &amp; cán cân thanh toán vận hành ra sao, và toàn cầu hoá tạo ra cả tăng trưởng lẫn khủng hoảng thế nào.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<pre><code>1. Tiền tệ: chức năng &amp; hệ thống tiền tệ
2. Ngân hàng trung ương &amp; cung tiền
3. Chính sách tiền tệ &amp; lãi suất
4. Lạm phát, thất nghiệp &amp; đường Phillips
5. Hệ thống tài chính &amp; thị trường tài chính
6. Tỷ giá hối đoái &amp; thị trường ngoại hối
7. Cán cân thanh toán &amp; kinh tế mở
8. Toàn cầu hoá, khủng hoảng tài chính &amp; định chế quốc tế (IMF, WB, WTO)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi tin tức kiểu "Fed tăng lãi suất," "tiền đồng mất giá," hay "IMF cứu trợ" chính là môn này, áp dụng vào thực tế. Học xong bạn đọc được các tin đó và giải thích được cơ chế phía sau.</div>`,
  ]]);

const c1 = doc('fin201-1-1-money-monetary-system', '1.1 — Money: functions & the monetary system|||1.1 — Tiền tệ: chức năng & hệ thống tiền tệ',
  'Ba chức năng của tiền (trao đổi, đơn vị tính toán, tích trữ giá trị); tiền hàng hoá vs tiền pháp định; các khối cung tiền M0/M1/M2/M3.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 1 · Lesson 1.1</span>
<h2>Money: functions &amp; the monetary system</h2>
<h3>What makes something "money"</h3>
<p>Money is anything widely accepted as payment. Mishkin defines <strong>three functions</strong>:</p>
<ul>
<li><strong>Medium of exchange</strong> — avoids barter; everyone accepts it for goods/services.</li>
<li><strong>Unit of account</strong> — prices are quoted in it, so values are comparable.</li>
<li><strong>Store of value</strong> — it holds purchasing power over time (though inflation erodes this).</li>
</ul>
<h3>From commodity money to fiat money</h3>
<p><strong>Commodity money</strong> (gold, silver) has intrinsic value. <strong>Fiat money</strong> (today's dollars, đồng) has no intrinsic value — it works because the government decrees it legal tender and people trust it will keep working tomorrow. Trust, not metal, backs modern currency.</p>
<h3>Measuring the money supply</h3>
<pre><code>M0 (base money)  = currency in circulation + bank reserves at the central bank
M1               = currency + checking/demand deposits (most liquid, spendable now)
M2               = M1 + savings deposits + small time deposits (near-money)
M3               = M2 + large time deposits &amp; institutional funds (broadest)
</code></pre>
<div class="callout"><span class="badge">Liquidity ladder</span> M1 is the most "money-like" (instantly spendable); each wider aggregate (M2, M3) adds less-liquid assets. Central banks watch several aggregates because policy affects them differently.</div>`,
    `<span class="eyebrow">FIN201 · Chương 1 · Bài 1.1</span>
<h2>Tiền tệ: chức năng &amp; hệ thống tiền tệ</h2>
<h3>Điều gì làm một thứ trở thành "tiền"</h3>
<p>Tiền là bất cứ thứ gì được chấp nhận rộng rãi làm phương tiện thanh toán. Mishkin nêu <strong>ba chức năng</strong>:</p>
<ul>
<li><strong>Phương tiện trao đổi</strong> — tránh đổi hàng-lấy-hàng; ai cũng nhận nó để đổi hàng hoá/dịch vụ.</li>
<li><strong>Đơn vị tính toán</strong> — giá cả được niêm yết bằng nó, nên giá trị so sánh được với nhau.</li>
<li><strong>Phương tiện tích trữ giá trị</strong> — giữ được sức mua qua thời gian (tuy lạm phát làm hao mòn điều này).</li>
</ul>
<h3>Từ tiền hàng hoá đến tiền pháp định</h3>
<p><strong>Tiền hàng hoá</strong> (vàng, bạc) có giá trị nội tại. <strong>Tiền pháp định</strong> (đô-la, đồng ngày nay) không có giá trị nội tại — nó hoạt động vì chính phủ quy định là phương tiện thanh toán hợp pháp và người dân tin nó sẽ tiếp tục dùng được. Niềm tin, không phải kim loại, là thứ đứng sau đồng tiền hiện đại.</p>
<h3>Đo cung tiền</h3>
<pre><code>M0 (tiền cơ sở) = tiền mặt lưu thông + dự trữ ngân hàng tại NHTW
M1              = tiền mặt + tiền gửi thanh toán/không kỳ hạn (thanh khoản cao nhất)
M2              = M1 + tiền gửi tiết kiệm + tiền gửi kỳ hạn nhỏ (gần-tiền)
M3              = M2 + tiền gửi kỳ hạn lớn &amp; quỹ định chế (rộng nhất)
</code></pre>
<div class="callout"><span class="badge">Nấc thang thanh khoản</span> M1 "giống tiền" nhất (tiêu được ngay); mỗi khối rộng hơn (M2, M3) thêm vào tài sản kém thanh khoản hơn. NHTW theo dõi nhiều khối vì chính sách ảnh hưởng đến chúng khác nhau.</div>`,
  ]]);

const c1q = quiz('fin201-quiz-1', 'Quiz 1 — Money & monetary system|||Quiz 1 — Tiền tệ & hệ thống tiền tệ', [
  { id: 'q1', question: 'Ba chức năng của tiền theo Mishkin là gì?', options: ['Trao đổi, đơn vị tính toán, tích trữ giá trị', 'Vay, cho vay, đầu tư', 'In tiền, huỷ tiền, dự trữ', 'Xuất khẩu, nhập khẩu, thuế'], correctIndex: 0, explanation: 'Medium of exchange, unit of account, store of value.' },
  { id: 'q2', question: 'Tiền pháp định (fiat money) hoạt động được là nhờ đâu?', options: ['Được đảm bảo bằng vàng dự trữ', 'Có giá trị nội tại như kim loại quý', 'Chính phủ quy định hợp pháp & niềm tin của người dùng', 'Không thể in thêm được'], correctIndex: 2, explanation: 'Fiat money không có giá trị nội tại, dựa vào luật định và niềm tin.' },
  { id: 'q3', question: 'Khối cung tiền nào có tính thanh khoản cao nhất (tiêu được ngay)?', options: ['M3', 'M2', 'M1', 'Tất cả bằng nhau'], correctIndex: 2, explanation: 'M1 gồm tiền mặt + tiền gửi không kỳ hạn — thanh khoản cao nhất.' },
]);

const c2 = doc('fin201-2-1-central-bank-money-supply', '2.1 — Central banks & the money supply|||2.1 — Ngân hàng trung ương & cung tiền',
  'Chức năng NHTW (phát hành tiền, ngân hàng của ngân hàng, người cho vay cuối cùng); cách ngân hàng thương mại tạo tiền; số nhân tiền.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 2 · Lesson 2.1</span>
<h2>Central banks &amp; the money supply</h2>
<h3>What a central bank does</h3>
<ul>
<li><strong>Issues currency</strong> — the sole legal issuer of banknotes.</li>
<li><strong>Bank for banks</strong> — commercial banks hold reserve accounts at it and settle payments through it.</li>
<li><strong>Lender of last resort</strong> — lends to solvent-but-illiquid banks in a crisis, to stop bank runs from spreading.</li>
<li><strong>Monetary policy authority</strong> — sets policy interest rates and manages the money supply to target inflation/growth.</li>
</ul>
<h3>How commercial banks create money</h3>
<p>A bank does not just store deposits — it lends most of them out, and the loan becomes a new deposit somewhere else, which gets lent out again. Each round keeps only a fraction as <strong>reserves</strong> (set by the <strong>reserve requirement ratio</strong>), so the money supply expands beyond the original deposit.</p>
<pre><code>Simple money multiplier:
 m = 1 / rr                (rr = required reserve ratio)
 Example: rr = 10% = 0.10
 m = 1 / 0.10 = 10
 A $1,000 initial deposit can expand the money supply by up to $1,000 x 10 = $10,000
</code></pre>
<div class="callout"><span class="badge">Why the multiplier is a ceiling, not a fact</span> Real expansion is smaller: banks may hold extra ("excess") reserves, and some cash leaks out of the banking system entirely.</div>`,
    `<span class="eyebrow">FIN201 · Chương 2 · Bài 2.1</span>
<h2>Ngân hàng trung ương &amp; cung tiền</h2>
<h3>Ngân hàng trung ương làm gì</h3>
<ul>
<li><strong>Phát hành tiền</strong> — cơ quan duy nhất được phép in tiền giấy hợp pháp.</li>
<li><strong>Ngân hàng của các ngân hàng</strong> — ngân hàng thương mại giữ tài khoản dự trữ tại đây và thanh toán qua đây.</li>
<li><strong>Người cho vay cuối cùng</strong> — cho vay ngân hàng còn khả năng thanh toán nhưng thiếu thanh khoản tạm thời trong khủng hoảng, để chặn hiệu ứng rút tiền hàng loạt lan rộng.</li>
<li><strong>Cơ quan điều hành chính sách tiền tệ</strong> — đặt lãi suất điều hành và quản lý cung tiền để đạt mục tiêu lạm phát/tăng trưởng.</li>
</ul>
<h3>Ngân hàng thương mại "tạo ra" tiền thế nào</h3>
<p>Ngân hàng không chỉ giữ tiền gửi — họ cho vay ra phần lớn số đó, khoản vay trở thành tiền gửi mới ở nơi khác, rồi lại được cho vay tiếp. Mỗi vòng chỉ giữ lại một phần làm <strong>dự trữ</strong> (theo <strong>tỷ lệ dự trữ bắt buộc</strong>), nên cung tiền mở rộng vượt xa khoản tiền gửi ban đầu.</p>
<pre><code>Số nhân tiền đơn giản:
 m = 1 / rr                (rr = tỷ lệ dự trữ bắt buộc)
 Ví dụ: rr = 10% = 0,10
 m = 1 / 0,10 = 10
 Tiền gửi ban đầu 1.000$ có thể mở rộng cung tiền tối đa 1.000$ x 10 = 10.000$
</code></pre>
<div class="callout"><span class="badge">Vì sao số nhân là TRẦN, không phải con số thật</span> Mở rộng thực tế nhỏ hơn: ngân hàng có thể giữ dự trữ dư ("excess"), và một phần tiền mặt rò ra ngoài hệ thống ngân hàng.</div>`,
  ]]);

const c2q = quiz('fin201-quiz-2', 'Quiz 2 — Central bank & money supply|||Quiz 2 — Ngân hàng trung ương & cung tiền', [
  { id: 'q1', question: 'Chức năng "người cho vay cuối cùng" (lender of last resort) của NHTW nghĩa là gì?', options: ['Cho vay bất kỳ ai không cần điều kiện', 'Cho vay ngân hàng còn khả năng thanh toán nhưng thiếu thanh khoản, ngăn khủng hoảng lan rộng', 'Chỉ cho vay chính phủ', 'In tiền không giới hạn'], correctIndex: 1, explanation: 'Đây là chốt chặn để ngăn bank run lan sang cả hệ thống.' },
  { id: 'q2', question: 'Với tỷ lệ dự trữ bắt buộc rr = 20%, số nhân tiền tối đa là bao nhiêu?', options: ['2', '5', '10', '20'], correctIndex: 1, explanation: 'm = 1/rr = 1/0,2 = 5.' },
  { id: 'q3', question: 'Vì sao mở rộng cung tiền thực tế thường NHỎ HƠN số nhân lý thuyết?', options: ['Vì lãi suất luôn bằng 0', 'Vì ngân hàng giữ dự trữ dư và tiền mặt rò ra ngoài hệ thống', 'Vì NHTW cấm cho vay', 'Vì tiền pháp định không co giãn được'], correctIndex: 1, explanation: 'Dự trữ dư (excess reserves) và rò tiền mặt (cash leakage) làm số nhân thực tế thấp hơn trần lý thuyết.' },
]);

const c3 = doc('fin201-3-1-monetary-policy-interest-rates', '3.1 — Monetary policy & interest rates|||3.1 — Chính sách tiền tệ & lãi suất',
  'Ba công cụ chính sách tiền tệ (nghiệp vụ thị trường mở, lãi suất chiết khấu, tỷ lệ dự trữ bắt buộc); mở rộng vs thắt chặt; truyền dẫn tới nền kinh tế thực.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 3 · Lesson 3.1</span>
<h2>Monetary policy &amp; interest rates</h2>
<h3>The three classic tools</h3>
<ul>
<li><strong>Open market operations (OMO)</strong> — the central bank buys or sells government bonds to inject or drain reserves; the main day-to-day tool.</li>
<li><strong>Discount/policy rate</strong> — the rate the central bank charges banks; changing it nudges every other interest rate in the economy.</li>
<li><strong>Reserve requirement ratio</strong> — raising it locks up more bank reserves (contracts lending capacity); lowering it frees up reserves.</li>
</ul>
<h3>Expansionary vs contractionary policy</h3>
<pre><code>Expansionary (loosen):   buy bonds + cut policy rate + lower reserve ratio
  -> more reserves, cheaper credit -> more borrowing/spending -> supports growth, but risks inflation

Contractionary (tighten): sell bonds + raise policy rate + raise reserve ratio
  -> fewer reserves, costlier credit -> less borrowing/spending -> cools inflation, but risks slowing growth
</code></pre>
<h3>Transmission to the real economy</h3>
<p>A policy-rate change does not touch households directly — it moves through <strong>bank lending rates → business investment &amp; consumer credit → aggregate demand → output, employment and, with a lag, inflation</strong>. That lag (often many months) is why central banks act ahead of visible inflation, not after it.</p>
<div class="callout"><span class="badge">One instrument, one main goal</span> Most central banks steer a single short-term policy rate to hit an inflation target — everything else (OMO size, reserve ratio) is a means to keep that rate where they want it.</div>`,
    `<span class="eyebrow">FIN201 · Chương 3 · Bài 3.1</span>
<h2>Chính sách tiền tệ &amp; lãi suất</h2>
<h3>Ba công cụ kinh điển</h3>
<ul>
<li><strong>Nghiệp vụ thị trường mở (OMO)</strong> — NHTW mua/bán trái phiếu chính phủ để bơm hoặc rút dự trữ; công cụ dùng hàng ngày chính.</li>
<li><strong>Lãi suất chiết khấu/điều hành</strong> — lãi suất NHTW áp cho ngân hàng; thay đổi nó kéo theo hầu hết lãi suất khác trong nền kinh tế.</li>
<li><strong>Tỷ lệ dự trữ bắt buộc</strong> — tăng tỷ lệ này giữ lại nhiều dự trữ hơn (giảm khả năng cho vay); giảm tỷ lệ này giải phóng dự trữ.</li>
</ul>
<h3>Chính sách mở rộng vs thắt chặt</h3>
<pre><code>Mở rộng (nới lỏng):   mua trái phiếu + giảm lãi suất điều hành + giảm tỷ lệ dự trữ
  -> nhiều dự trữ, tín dụng rẻ hơn -> vay/tiêu nhiều hơn -> hỗ trợ tăng trưởng, nhưng rủi ro lạm phát

Thắt chặt: bán trái phiếu + tăng lãi suất điều hành + tăng tỷ lệ dự trữ
  -> ít dự trữ, tín dụng đắt hơn -> vay/tiêu ít hơn -> hạ nhiệt lạm phát, nhưng rủi ro chậm tăng trưởng
</code></pre>
<h3>Truyền dẫn tới nền kinh tế thực</h3>
<p>Thay đổi lãi suất điều hành không tác động trực tiếp tới hộ gia đình — nó đi qua <strong>lãi suất cho vay ngân hàng → đầu tư doanh nghiệp &amp; tín dụng tiêu dùng → tổng cầu → sản lượng, việc làm, và với độ trễ, lạm phát</strong>. Độ trễ đó (thường vài tháng) là lý do NHTW hành động TRƯỚC khi lạm phát hiện rõ, không phải sau.</p>
<div class="callout"><span class="badge">Một công cụ, một mục tiêu chính</span> Hầu hết NHTW điều khiển MỘT lãi suất điều hành ngắn hạn để đạt mục tiêu lạm phát — mọi thứ khác (quy mô OMO, tỷ lệ dự trữ) chỉ là phương tiện giữ lãi suất đó ở mức mong muốn.</div>`,
  ]]);

const c3q = quiz('fin201-quiz-3', 'Quiz 3 — Monetary policy & interest rates|||Quiz 3 — Chính sách tiền tệ & lãi suất', [
  { id: 'q1', question: 'Công cụ dùng hàng ngày, chủ yếu để bơm/rút dự trữ, là gì?', options: ['Nghiệp vụ thị trường mở (OMO)', 'In tiền trực tiếp', 'Thuế thu nhập', 'Trợ cấp thất nghiệp'], correctIndex: 0, explanation: 'OMO (mua/bán trái phiếu chính phủ) là công cụ vận hành hàng ngày.' },
  { id: 'q2', question: 'Chính sách tiền tệ THẮT CHẶT gồm hành động nào?', options: ['Mua trái phiếu, giảm lãi suất', 'Bán trái phiếu, tăng lãi suất điều hành', 'Giảm tỷ lệ dự trữ bắt buộc', 'Phát tiền trực tiếp cho dân'], correctIndex: 1, explanation: 'Bán trái phiếu + tăng lãi suất + tăng dự trữ bắt buộc = thắt chặt, hạ nhiệt lạm phát.' },
  { id: 'q3', question: 'Vì sao NHTW thường hành động TRƯỚC khi lạm phát hiện rõ?', options: ['Vì luật bắt buộc phải làm vậy', 'Vì truyền dẫn chính sách tới nền kinh tế thực có độ trễ nhiều tháng', 'Vì lạm phát không thể đo được', 'Vì lãi suất không ảnh hưởng tới đầu tư'], correctIndex: 1, explanation: 'Độ trễ truyền dẫn (lãi suất -> tín dụng -> tổng cầu -> lạm phát) buộc NHTW hành động sớm.' },
]);

const c4 = doc('fin201-4-1-inflation-unemployment-phillips', '4.1 — Inflation, unemployment & the Phillips curve|||4.1 — Lạm phát, thất nghiệp & đường Phillips',
  'Lạm phát do cầu kéo vs chi phí đẩy; ba loại thất nghiệp; đường Phillips ngắn hạn (đánh đổi) vs dài hạn (thẳng đứng) & NAIRU.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 4 · Lesson 4.1</span>
<h2>Inflation, unemployment &amp; the Phillips curve</h2>
<h3>Two sources of inflation</h3>
<ul>
<li><strong>Demand-pull</strong> — aggregate demand outruns the economy's capacity ("too much money chasing too few goods").</li>
<li><strong>Cost-push</strong> — rising input costs (oil, wages, supply shocks) push prices up even as demand is flat.</li>
</ul>
<h3>Three types of unemployment</h3>
<ul>
<li><strong>Frictional</strong> — short-term, between jobs (normal, even in a healthy economy).</li>
<li><strong>Structural</strong> — a mismatch of skills/location versus available jobs.</li>
<li><strong>Cyclical</strong> — caused by a recession (weak aggregate demand); this is the one policy targets.</li>
</ul>
<h3>The Phillips curve</h3>
<p>The <strong>short-run Phillips curve</strong> shows a trade-off: lower unemployment tends to come with higher inflation, and vice versa — because a hotter labor market pushes wages and prices up. But Blanchard's key point is that this trade-off is <strong>not permanent</strong>: once people expect higher inflation, the trade-off shifts, and in the <strong>long run the Phillips curve is vertical</strong> at the <strong>natural rate of unemployment (NAIRU)</strong> — you cannot buy permanently lower unemployment with permanently higher inflation.</p>
<pre><code>Short run:  lower unemployment  &lt;-&gt;  higher inflation   (a real, temporary trade-off)
Long run:   unemployment settles at NAIRU regardless of inflation (curve is vertical)
</code></pre>
<div class="callout"><span class="badge">Why this matters for policy</span> A central bank chasing very low unemployment with easy money can win short-term jobs but ends up only with higher inflation once expectations adjust — the classic 1970s stagflation lesson.</div>`,
    `<span class="eyebrow">FIN201 · Chương 4 · Bài 4.1</span>
<h2>Lạm phát, thất nghiệp &amp; đường Phillips</h2>
<h3>Hai nguồn gây lạm phát</h3>
<ul>
<li><strong>Cầu kéo (demand-pull)</strong> — tổng cầu vượt quá năng lực sản xuất của nền kinh tế ("quá nhiều tiền đuổi theo quá ít hàng").</li>
<li><strong>Chi phí đẩy (cost-push)</strong> — chi phí đầu vào tăng (dầu, lương, cú sốc cung) đẩy giá lên dù cầu không đổi.</li>
</ul>
<h3>Ba loại thất nghiệp</h3>
<ul>
<li><strong>Tạm thời (frictional)</strong> — ngắn hạn, giữa hai công việc (bình thường, có cả trong nền kinh tế lành mạnh).</li>
<li><strong>Cơ cấu (structural)</strong> — lệch giữa kỹ năng/vị trí và việc làm hiện có.</li>
<li><strong>Chu kỳ (cyclical)</strong> — do suy thoái (tổng cầu yếu); đây là loại chính sách nhắm tới.</li>
</ul>
<h3>Đường Phillips</h3>
<p><strong>Đường Phillips ngắn hạn</strong> thể hiện một đánh đổi: thất nghiệp thấp hơn thường đi kèm lạm phát cao hơn, và ngược lại — vì thị trường lao động "nóng" hơn đẩy lương và giá lên. Nhưng điểm mấu chốt của Blanchard là đánh đổi này <strong>KHÔNG vĩnh viễn</strong>: khi người dân bắt đầu kỳ vọng lạm phát cao hơn, đánh đổi dịch chuyển, và trong <strong>dài hạn đường Phillips thẳng đứng</strong> tại <strong>tỷ lệ thất nghiệp tự nhiên (NAIRU)</strong> — không thể "mua" thất nghiệp thấp vĩnh viễn bằng lạm phát cao vĩnh viễn.</p>
<pre><code>Ngắn hạn: thất nghiệp thấp hơn  &lt;-&gt;  lạm phát cao hơn   (đánh đổi thật, tạm thời)
Dài hạn:  thất nghiệp về đúng NAIRU bất kể lạm phát (đường thẳng đứng)
</code></pre>
<div class="callout"><span class="badge">Ý nghĩa cho chính sách</span> Một NHTW cố ép thất nghiệp xuống rất thấp bằng tiền rẻ có thể thắng việc làm ngắn hạn nhưng cuối cùng chỉ còn lạm phát cao hơn khi kỳ vọng điều chỉnh — bài học kinh điển đình lạm (stagflation) thập niên 1970.</div>`,
  ]]);

const c4q = quiz('fin201-quiz-4', 'Quiz 4 — Inflation, unemployment & Phillips curve|||Quiz 4 — Lạm phát, thất nghiệp & đường Phillips', [
  { id: 'q1', question: 'Lạm phát do tổng cầu vượt năng lực sản xuất gọi là loại gì?', options: ['Cầu kéo (demand-pull)', 'Chi phí đẩy (cost-push)', 'Thất nghiệp cơ cấu', 'Giảm phát'], correctIndex: 0, explanation: 'Demand-pull: cầu tăng nhanh hơn khả năng cung ứng.' },
  { id: 'q2', question: 'Thất nghiệp do lệch kỹ năng/vị trí với việc làm sẵn có gọi là loại gì?', options: ['Tạm thời (frictional)', 'Cơ cấu (structural)', 'Chu kỳ (cyclical)', 'Tự nguyện'], correctIndex: 1, explanation: 'Structural unemployment là do mismatch kỹ năng/vị trí, không phải do suy thoái.' },
  { id: 'q3', question: 'Trong DÀI HẠN, đường Phillips có hình dạng gì?', options: ['Dốc xuống, đánh đổi vĩnh viễn với lạm phát', 'Thẳng đứng tại NAIRU, không đánh đổi được nữa', 'Dốc lên', 'Đường ngang bằng 0'], correctIndex: 1, explanation: 'Dài hạn: thất nghiệp về NAIRU bất kể mức lạm phát; đánh đổi chỉ tồn tại ngắn hạn.' },
]);

const c5 = doc('fin201-5-1-financial-system-markets', '5.1 — The financial system & financial markets|||5.1 — Hệ thống tài chính & thị trường tài chính',
  'Tài trợ trực tiếp vs gián tiếp; trung gian tài chính; thị trường tiền tệ vs thị trường vốn; thị trường sơ cấp vs thứ cấp; lựa chọn đối nghịch & rủi ro đạo đức.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 5 · Lesson 5.1</span>
<h2>The financial system &amp; financial markets</h2>
<h3>Direct vs indirect finance</h3>
<p><strong>Direct finance</strong> — savers lend straight to borrowers by buying securities (stocks, bonds) in financial markets. <strong>Indirect finance</strong> — savers deposit with a <strong>financial intermediary</strong> (a bank), which then lends to borrowers. Mishkin's key insight: indirect finance dominates in most economies because intermediaries solve information problems savers can't solve alone.</p>
<h3>Two information problems intermediaries solve</h3>
<ul>
<li><strong>Adverse selection</strong> (before the deal) — the riskiest borrowers are the most eager to borrow, and the lender can't tell them apart from safe ones. Banks screen applicants to reduce this.</li>
<li><strong>Moral hazard</strong> (after the deal) — a borrower may take on riskier behavior once they have the money. Banks monitor and use covenants to reduce this.</li>
</ul>
<h3>Classifying markets</h3>
<pre><code>Money market   -> short-term debt (&lt; 1 year): T-bills, commercial paper — liquidity management
Capital market -> long-term debt &amp; equity (&gt; 1 year): bonds, stocks — funding investment

Primary market   -> a NEW security is sold for the first time; issuer receives the funds
Secondary market -> existing securities trade between investors; issuer receives nothing further,
                    but this trading is what gives the security its liquidity and price
</code></pre>
<div class="callout"><span class="badge">Why secondary markets matter</span> No one would buy a 10-year bond in the primary market if they couldn't resell it in a secondary market before it matures — liquidity is the price of long-term financing.</div>`,
    `<span class="eyebrow">FIN201 · Chương 5 · Bài 5.1</span>
<h2>Hệ thống tài chính &amp; thị trường tài chính</h2>
<h3>Tài trợ trực tiếp vs gián tiếp</h3>
<p><strong>Tài trợ trực tiếp</strong> — người tiết kiệm cho vay thẳng người vay bằng cách mua chứng khoán (cổ phiếu, trái phiếu) trên thị trường tài chính. <strong>Tài trợ gián tiếp</strong> — người tiết kiệm gửi tiền vào một <strong>trung gian tài chính</strong> (ngân hàng), rồi ngân hàng cho vay lại người vay. Điểm mấu chốt của Mishkin: tài trợ gián tiếp chiếm ưu thế ở hầu hết nền kinh tế vì trung gian giải quyết được vấn đề thông tin mà người tiết kiệm không tự giải quyết được.</p>
<h3>Hai vấn đề thông tin trung gian tài chính giải quyết</h3>
<ul>
<li><strong>Lựa chọn đối nghịch (adverse selection)</strong> (trước giao dịch) — người vay rủi ro nhất lại là người hăng hái vay nhất, và người cho vay không phân biệt được với người vay an toàn. Ngân hàng sàng lọc hồ sơ để giảm vấn đề này.</li>
<li><strong>Rủi ro đạo đức (moral hazard)</strong> (sau giao dịch) — người vay có thể hành động rủi ro hơn sau khi đã có tiền trong tay. Ngân hàng giám sát và dùng điều khoản ràng buộc để giảm vấn đề này.</li>
</ul>
<h3>Phân loại thị trường</h3>
<pre><code>Thị trường tiền tệ -> nợ ngắn hạn (&lt; 1 năm): tín phiếu kho bạc, thương phiếu — quản lý thanh khoản
Thị trường vốn     -> nợ dài hạn &amp; cổ phần (&gt; 1 năm): trái phiếu, cổ phiếu — tài trợ đầu tư

Thị trường sơ cấp -> chứng khoán MỚI được bán lần đầu; tổ chức phát hành nhận tiền
Thị trường thứ cấp -> chứng khoán đã phát hành giao dịch giữa các nhà đầu tư; tổ chức phát hành
                      không nhận thêm tiền, nhưng chính giao dịch này tạo thanh khoản &amp; giá cho chứng khoán
</code></pre>
<div class="callout"><span class="badge">Vì sao thị trường thứ cấp quan trọng</span> Không ai muốn mua trái phiếu 10 năm ở thị trường sơ cấp nếu không thể bán lại được ở thị trường thứ cấp trước khi đáo hạn — thanh khoản là cái giá của tài trợ dài hạn.</div>`,
  ]]);

const c5q = quiz('fin201-quiz-5', 'Quiz 5 — Financial system & markets|||Quiz 5 — Hệ thống tài chính & thị trường tài chính', [
  { id: 'q1', question: 'Người tiết kiệm gửi tiền vào ngân hàng, ngân hàng cho vay lại người vay — đây là loại tài trợ gì?', options: ['Tài trợ trực tiếp', 'Tài trợ gián tiếp', 'Tài trợ bằng vàng', 'Tài trợ ngân sách'], correctIndex: 1, explanation: 'Qua trung gian tài chính (ngân hàng) = tài trợ gián tiếp.' },
  { id: 'q2', question: 'Vấn đề "người vay rủi ro nhất lại hăng hái vay nhất, khó phân biệt trước khi cho vay" gọi là gì?', options: ['Rủi ro đạo đức (moral hazard)', 'Lựa chọn đối nghịch (adverse selection)', 'Lạm phát', 'Đường Phillips'], correctIndex: 1, explanation: 'Adverse selection xảy ra TRƯỚC giao dịch, do thông tin bất cân xứng.' },
  { id: 'q3', question: 'Ở thị trường THỨ CẤP, ai nhận tiền khi chứng khoán được giao dịch?', options: ['Tổ chức phát hành ban đầu', 'Nhà đầu tư bán chứng khoán đó', 'Ngân hàng trung ương', 'Không ai nhận'], correctIndex: 1, explanation: 'Thị trường thứ cấp là giao dịch giữa nhà đầu tư; tổ chức phát hành không nhận thêm tiền.' },
]);

const c6 = doc('fin201-6-1-exchange-rates-forex', '6.1 — Exchange rates & the foreign exchange market|||6.1 — Tỷ giá hối đoái & thị trường ngoại hối',
  'Tỷ giá danh nghĩa vs thực; sức mua tương đương (PPP); ngang giá lãi suất; chế độ tỷ giá cố định vs thả nổi.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 6 · Lesson 6.1</span>
<h2>Exchange rates &amp; the foreign exchange market</h2>
<h3>Nominal vs real exchange rate</h3>
<p>The <strong>nominal exchange rate</strong> is the price of one currency in terms of another (e.g. VND per USD). The <strong>real exchange rate</strong> adjusts for relative price levels — it tells you the true relative cost of goods between two countries, not just the currency price.</p>
<h3>What determines the exchange rate</h3>
<pre><code>Purchasing Power Parity (PPP), long run:
 E = P_domestic / P_foreign
 (identical baskets should cost the same across countries once converted)

Interest Rate Parity (IRP), short run — capital chases the best risk-adjusted return:
 (1 + i_domestic) = (1 + i_foreign) x (E_expected_future / E_today)
 Higher domestic interest rates, other things equal, tend to attract capital inflows and
 appreciate the domestic currency today.
</code></pre>
<h3>Exchange-rate regimes</h3>
<ul>
<li><strong>Fixed (pegged)</strong> — the government/central bank commits to a rate and defends it using reserves; gives price stability, but sacrifices independent monetary policy.</li>
<li><strong>Floating</strong> — the market sets the rate via supply and demand; gives monetary-policy independence, but the rate can be volatile.</li>
<li><strong>Managed float</strong> — floats within a band or with occasional central-bank intervention — the most common regime in practice, including Vietnam's.</li>
</ul>
<div class="callout"><span class="badge">The trilemma</span> A country cannot simultaneously have a fixed exchange rate, free capital flows, AND independent monetary policy — it must give up one of the three (the "impossible trinity").</div>`,
    `<span class="eyebrow">FIN201 · Chương 6 · Bài 6.1</span>
<h2>Tỷ giá hối đoái &amp; thị trường ngoại hối</h2>
<h3>Tỷ giá danh nghĩa vs thực</h3>
<p><strong>Tỷ giá danh nghĩa</strong> là giá một đồng tiền tính theo đồng tiền khác (vd VND đổi 1 USD). <strong>Tỷ giá thực</strong> điều chỉnh theo mức giá tương đối giữa hai nước — nó cho biết chi phí hàng hoá tương đối THẬT giữa hai nước, không chỉ giá quy đổi đồng tiền.</p>
<h3>Điều gì quyết định tỷ giá</h3>
<pre><code>Sức mua tương đương (PPP), dài hạn:
 E = P_trong_nuoc / P_nuoc_ngoai
 (cùng một giỏ hàng phải có giá bằng nhau giữa các nước sau khi quy đổi)

Ngang giá lãi suất (IRP), ngắn hạn — vốn chạy theo lợi suất điều chỉnh rủi ro tốt nhất:
 (1 + i_trong_nuoc) = (1 + i_nuoc_ngoai) x (E_ky_vong_tuong_lai / E_hien_tai)
 Lãi suất trong nước cao hơn, các yếu tố khác không đổi, thường hút vốn vào và làm
 đồng tiền trong nước lên giá NGAY hôm nay.
</code></pre>
<h3>Chế độ tỷ giá</h3>
<ul>
<li><strong>Cố định (pegged)</strong> — chính phủ/NHTW cam kết một mức tỷ giá và bảo vệ nó bằng dự trữ ngoại hối; cho ổn định giá cả, nhưng đánh đổi bằng mất tính độc lập của chính sách tiền tệ.</li>
<li><strong>Thả nổi</strong> — thị trường quyết định tỷ giá qua cung-cầu; giữ được độc lập chính sách tiền tệ, nhưng tỷ giá có thể biến động mạnh.</li>
<li><strong>Thả nổi có quản lý</strong> — thả nổi trong một biên độ hoặc có can thiệp của NHTW đôi lúc — chế độ phổ biến nhất trên thực tế, bao gồm cả Việt Nam.</li>
</ul>
<div class="callout"><span class="badge">Bộ ba bất khả thi</span> Một nước không thể đồng thời có tỷ giá cố định, dòng vốn tự do, VÀ chính sách tiền tệ độc lập — phải bỏ đúng một trong ba ("impossible trinity").</div>`,
  ]]);

const c6q = quiz('fin201-quiz-6', 'Quiz 6 — Exchange rates & forex market|||Quiz 6 — Tỷ giá & thị trường ngoại hối', [
  { id: 'q1', question: 'Tỷ giá điều chỉnh theo mức giá tương đối giữa hai nước, phản ánh chi phí hàng hoá THẬT, gọi là gì?', options: ['Tỷ giá danh nghĩa', 'Tỷ giá thực', 'Tỷ giá cố định', 'Tỷ giá chéo'], correctIndex: 1, explanation: 'Tỷ giá thực (real exchange rate) đã điều chỉnh theo mức giá.' },
  { id: 'q2', question: 'Theo ngang giá lãi suất (IRP), lãi suất trong nước tăng (các yếu tố khác không đổi) thường dẫn đến điều gì?', options: ['Đồng tiền trong nước mất giá ngay', 'Đồng tiền trong nước lên giá do hút vốn vào', 'Không ảnh hưởng gì đến tỷ giá', 'Lạm phát giảm về 0'], correctIndex: 1, explanation: 'Lãi suất cao hơn hút vốn, làm đồng tiền lên giá trong ngắn hạn.' },
  { id: 'q3', question: '"Bộ ba bất khả thi" (impossible trinity) nói điều gì?', options: ['Không thể đồng thời có tỷ giá cố định, vốn tự do và chính sách tiền tệ độc lập', 'Lạm phát, thất nghiệp và tăng trưởng luôn đi cùng nhau', 'Ba loại thất nghiệp luôn bằng nhau', 'NHTW không thể kiểm soát cung tiền'], correctIndex: 0, explanation: 'Một nước chỉ giữ được 2 trong 3 mục tiêu: tỷ giá cố định, vốn tự do, chính sách tiền tệ độc lập.' },
]);

const c7 = doc('fin201-7-1-balance-of-payments-open-economy', '7.1 — Balance of payments & the open economy|||7.1 — Cán cân thanh toán & kinh tế mở',
  'Cấu trúc BOP: tài khoản vãng lai vs tài khoản vốn/tài chính; đồng nhất thức cán cân thanh toán; cơ chế điều chỉnh trong nền kinh tế mở.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 7 · Lesson 7.1</span>
<h2>Balance of payments &amp; the open economy</h2>
<h3>The two main accounts</h3>
<ul>
<li><strong>Current account</strong> — trade in goods &amp; services, plus income flows (interest, dividends) and transfers (remittances). A surplus means the country is a net lender to the rest of the world; a deficit means it's a net borrower.</li>
<li><strong>Capital &amp; financial account</strong> — cross-border investment flows: FDI, portfolio investment (stocks/bonds), and bank lending.</li>
</ul>
<h3>The balance-of-payments identity</h3>
<pre><code>Current Account + Capital &amp; Financial Account + Reserve changes = 0  (by construction)

Intuition: a current account deficit (importing more than exporting) MUST be financed
 by a capital-account surplus (borrowing from / selling assets to foreigners) or by
 running down reserves — the books always balance, because BOP is double-entry bookkeeping.
</code></pre>
<h3>Adjustment in an open economy</h3>
<p>Krugman/Obstfeld's Mundell-Fleming framework shows that how a country adjusts to shocks depends on its exchange-rate regime and how open its capital account is: under floating rates with open capital, monetary policy is powerful and the exchange rate absorbs shocks; under fixed rates, the exchange rate cannot move, so the burden falls on interest rates, reserves, or the real economy instead.</p>
<div class="callout"><span class="badge">A deficit is not automatically "bad"</span> A current account deficit financed by productive FDI inflows (building factories) is very different from one financed by short-term hot money — the composition of financing matters as much as the size of the deficit.</div>`,
    `<span class="eyebrow">FIN201 · Chương 7 · Bài 7.1</span>
<h2>Cán cân thanh toán &amp; kinh tế mở</h2>
<h3>Hai tài khoản chính</h3>
<ul>
<li><strong>Tài khoản vãng lai</strong> — thương mại hàng hoá &amp; dịch vụ, cộng dòng thu nhập (lãi, cổ tức) và chuyển giao (kiều hối). Thặng dư nghĩa là nước đó là người cho vay ròng với thế giới; thiếu hụt nghĩa là người vay ròng.</li>
<li><strong>Tài khoản vốn &amp; tài chính</strong> — dòng đầu tư xuyên biên giới: FDI, đầu tư danh mục (cổ phiếu/trái phiếu), và cho vay ngân hàng.</li>
</ul>
<h3>Đồng nhất thức cán cân thanh toán</h3>
<pre><code>Tài khoản vãng lai + Tài khoản vốn &amp; tài chính + Thay đổi dự trữ = 0  (luôn đúng, do định nghĩa)

Trực giác: thiếu hụt tài khoản vãng lai (nhập nhiều hơn xuất) BẮT BUỘC phải được tài trợ
 bằng thặng dư tài khoản vốn (vay từ / bán tài sản cho nước ngoài) hoặc bằng cách giảm dự trữ
 — sổ sách luôn cân bằng, vì BOP là ghi sổ kép (double-entry).
</code></pre>
<h3>Điều chỉnh trong nền kinh tế mở</h3>
<p>Khung Mundell-Fleming của Krugman/Obstfeld chỉ ra rằng cách một nước điều chỉnh trước các cú sốc phụ thuộc vào chế độ tỷ giá và mức độ mở của tài khoản vốn: dưới tỷ giá thả nổi với vốn mở, chính sách tiền tệ mạnh và tỷ giá tự hấp thụ cú sốc; dưới tỷ giá cố định, tỷ giá không thể di chuyển, nên gánh nặng dồn vào lãi suất, dự trữ, hoặc nền kinh tế thực.</p>
<div class="callout"><span class="badge">Thiếu hụt không tự động là "xấu"</span> Thiếu hụt tài khoản vãng lai được tài trợ bằng dòng FDI sản xuất (xây nhà máy) rất khác với thiếu hụt tài trợ bằng dòng vốn nóng ngắn hạn — CƠ CẤU tài trợ quan trọng không kém quy mô thiếu hụt.</div>`,
  ]]);

const c7q = quiz('fin201-quiz-7', 'Quiz 7 — Balance of payments & open economy|||Quiz 7 — Cán cân thanh toán & kinh tế mở', [
  { id: 'q1', question: 'Kiều hối và lãi/cổ tức nhận từ nước ngoài được ghi nhận trong tài khoản nào?', options: ['Tài khoản vốn & tài chính', 'Tài khoản vãng lai', 'Tài khoản dự trữ', 'Không được ghi nhận'], correctIndex: 1, explanation: 'Thu nhập & chuyển giao (kiều hối) nằm trong current account.' },
  { id: 'q2', question: 'Theo đồng nhất thức cán cân thanh toán, thiếu hụt tài khoản vãng lai PHẢI đi kèm với điều gì?', options: ['Thặng dư tài khoản vốn/tài chính hoặc giảm dự trữ', 'Lạm phát tăng vọt', 'Tỷ giá cố định vĩnh viễn', 'Không cần điều gì, tự cân bằng'], correctIndex: 0, explanation: 'CA + KA + thay đổi dự trữ = 0, nên thiếu hụt CA phải được bù bằng KA hoặc rút dự trữ.' },
  { id: 'q3', question: 'Điều gì quyết định thiếu hụt tài khoản vãng lai có "đáng lo" hay không, theo bài học?', options: ['Chỉ cần nhìn quy mô số tuyệt đối', 'Cơ cấu nguồn tài trợ (FDI dài hạn vs vốn nóng ngắn hạn)', 'Tỷ giá danh nghĩa hôm nay', 'Số lượng ngân hàng trong nước'], correctIndex: 1, explanation: 'Thiếu hụt tài trợ bằng FDI ổn định khác hẳn tài trợ bằng vốn nóng dễ đảo chiều.' },
]);

const c8 = doc('fin201-8-1-globalization-crises-institutions', '8.1 — Globalization, financial crises & international institutions|||8.1 — Toàn cầu hoá, khủng hoảng tài chính & định chế quốc tế',
  'Toàn cầu hoá thương mại-tài chính; ba loại khủng hoảng (tiền tệ, ngân hàng, nợ) & các ca thực tế (Châu Á 1997, Toàn cầu 2008); vai trò IMF, World Bank, WTO.',
  [[
    `<span class="eyebrow">FIN201 · Chapter 8 · Lesson 8.1</span>
<h2>Globalization, financial crises &amp; international institutions</h2>
<h3>Globalization — trade and finance, intertwined</h3>
<p><strong>Trade globalization</strong> (falling tariffs, global supply chains) and <strong>financial globalization</strong> (free capital flows across borders) reinforce each other — but financial globalization also transmits shocks: a crisis in one country's banking system can spread through trade links and capital flight to others.</p>
<h3>Three types of financial crisis</h3>
<ul>
<li><strong>Currency crisis</strong> — a sudden, forced devaluation/collapse of a pegged exchange rate (e.g. Thailand's baht, 1997).</li>
<li><strong>Banking crisis</strong> — widespread bank failures/runs, often after a lending boom turns to bust (e.g. US subprime, 2008).</li>
<li><strong>Debt (sovereign) crisis</strong> — a government cannot service its debt (e.g. several Eurozone countries, 2010-2012).</li>
</ul>
<p>The <strong>1997 Asian financial crisis</strong> combined all three: pegged currencies collapsed once capital fled, banks that had borrowed short-term in dollars failed, and some governments needed emergency financing. The <strong>2008 global financial crisis</strong> began as a US banking/housing crisis and spread worldwide through globally interconnected financial institutions.</p>
<h3>The three Bretton Woods-era institutions</h3>
<pre><code>IMF (International Monetary Fund) -> monitors economies, lends to countries in
   balance-of-payments trouble, usually attaching policy conditions ("conditionality")
World Bank                        -> long-term development financing (infrastructure,
   poverty reduction) for developing countries
WTO (World Trade Organization)     -> negotiates &amp; enforces global trade rules,
   settles trade disputes between member countries
</code></pre>
<div class="callout"><span class="badge">The takeaway</span> Globalization raises average living standards but concentrates risk in financial linkages — which is exactly why the world built standing institutions (IMF/WB/WTO) instead of relying on ad-hoc bailouts each time.</div>`,
    `<span class="eyebrow">FIN201 · Chương 8 · Bài 8.1</span>
<h2>Toàn cầu hoá, khủng hoảng tài chính &amp; định chế quốc tế</h2>
<h3>Toàn cầu hoá — thương mại và tài chính, gắn chặt nhau</h3>
<p><strong>Toàn cầu hoá thương mại</strong> (thuế quan giảm, chuỗi cung ứng toàn cầu) và <strong>toàn cầu hoá tài chính</strong> (dòng vốn tự do xuyên biên giới) củng cố nhau — nhưng toàn cầu hoá tài chính cũng truyền dẫn cú sốc: khủng hoảng ngân hàng ở một nước có thể lan sang nước khác qua liên kết thương mại và dòng vốn tháo chạy.</p>
<h3>Ba loại khủng hoảng tài chính</h3>
<ul>
<li><strong>Khủng hoảng tiền tệ</strong> — tỷ giá cố định bị phá giá/sụp đổ đột ngột, bắt buộc (vd baht Thái Lan, 1997).</li>
<li><strong>Khủng hoảng ngân hàng</strong> — ngân hàng đổ vỡ/bị rút tiền hàng loạt trên diện rộng, thường sau một đợt cho vay bùng nổ rồi sụp (vd cho vay dưới chuẩn Mỹ, 2008).</li>
<li><strong>Khủng hoảng nợ (quốc gia)</strong> — chính phủ không trả được nợ (vd một số nước Eurozone, 2010-2012).</li>
</ul>
<p><strong>Khủng hoảng tài chính Châu Á 1997</strong> hội tụ cả ba: tỷ giá cố định sụp đổ khi vốn tháo chạy, ngân hàng vay ngắn hạn bằng đô-la đổ vỡ, và một số chính phủ cần tài trợ khẩn cấp. <strong>Khủng hoảng tài chính toàn cầu 2008</strong> bắt đầu là khủng hoảng ngân hàng/nhà đất Mỹ rồi lan ra toàn cầu qua các định chế tài chính liên kết chặt chẽ.</p>
<h3>Ba định chế thời Bretton Woods</h3>
<pre><code>IMF (Quỹ Tiền tệ Quốc tế) -> giám sát nền kinh tế, cho vay các nước gặp khó khăn
   cán cân thanh toán, thường kèm điều kiện chính sách ("conditionality")
World Bank                 -> tài trợ phát triển dài hạn (hạ tầng, giảm nghèo)
   cho các nước đang phát triển
WTO (Tổ chức Thương mại Thế giới) -> đàm phán &amp; thực thi quy tắc thương mại toàn cầu,
   giải quyết tranh chấp thương mại giữa các nước thành viên
</code></pre>
<div class="callout"><span class="badge">Bài học rút ra</span> Toàn cầu hoá nâng mức sống trung bình nhưng cũng tập trung rủi ro vào các liên kết tài chính — chính vì vậy thế giới dựng nên các định chế thường trực (IMF/WB/WTO) thay vì mỗi lần lại giải cứu tuỳ tiện.</div>`,
  ]]);

const c8q = quiz('fin201-quiz-8', 'Quiz 8 — Globalization, crises & institutions|||Quiz 8 — Toàn cầu hoá, khủng hoảng & định chế quốc tế', [
  { id: 'q1', question: 'Khủng hoảng Châu Á 1997 kết hợp những loại khủng hoảng nào?', options: ['Chỉ khủng hoảng nợ quốc gia', 'Tiền tệ, ngân hàng và nợ cùng lúc', 'Chỉ khủng hoảng thương mại', 'Chỉ lạm phát cao'], correctIndex: 1, explanation: 'Tỷ giá sụp đổ + ngân hàng đổ vỡ + cần tài trợ khẩn cấp — cả ba loại cùng lúc.' },
  { id: 'q2', question: 'Định chế nào cho vay các nước gặp khó khăn cán cân thanh toán, thường kèm điều kiện chính sách?', options: ['WTO', 'World Bank', 'IMF', 'Ngân hàng trung ương từng nước'], correctIndex: 2, explanation: 'IMF giám sát & cho vay kèm conditionality khi khó khăn BOP.' },
  { id: 'q3', question: 'Vì sao toàn cầu hoá tài chính có thể khiến khủng hoảng LAN RỘNG hơn?', options: ['Vì các nước không còn giao thương với nhau', 'Vì dòng vốn & liên kết định chế tài chính xuyên biên giới truyền dẫn cú sốc', 'Vì tỷ giá luôn cố định', 'Vì lạm phát tự động bằng 0'], correctIndex: 1, explanation: 'Vốn tháo chạy và liên kết ngân hàng toàn cầu là kênh lan truyền khủng hoảng.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'FIN201',
    slug: 'fin201-monetary-economics-and-global-economy',
    title: 'Monetary Economics and Global Economy',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIN201.webp',
    shortDescription: 'Money, central banks, monetary policy & interest rates, inflation/unemployment (Phillips curve), financial markets, exchange rates, balance of payments, globalization & crises (IMF, WB, WTO). Bilingual, worked examples & quizzes.|||Tiền tệ, ngân hàng trung ương, chính sách tiền tệ & lãi suất, lạm phát/thất nghiệp (đường Phillips), thị trường tài chính, tỷ giá, cán cân thanh toán, toàn cầu hoá & khủng hoảng (IMF, WB, WTO). Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>FIN201 — Monetary Economics and Global Economy</strong> (kỳ 3, khối Quản trị Kinh doanh) giúp hiểu <strong>tiền tệ hoạt động thế nào và các nền kinh tế kết nối với nhau ra sao</strong>. Từ <strong>tiền tệ &amp; hệ thống tiền tệ</strong> → <strong>ngân hàng trung ương &amp; cung tiền</strong> → <strong>chính sách tiền tệ &amp; lãi suất</strong> → <strong>lạm phát, thất nghiệp &amp; đường Phillips</strong> → <strong>hệ thống &amp; thị trường tài chính</strong> → <strong>tỷ giá hối đoái</strong> → <strong>cán cân thanh toán &amp; kinh tế mở</strong> → <strong>toàn cầu hoá, khủng hoảng tài chính &amp; định chế quốc tế (IMF, WB, WTO)</strong>. Trích dẫn Mishkin, Krugman/Obstfeld, Blanchard; song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Chức năng của tiền & khối cung tiền M0-M3; chức năng NHTW & số nhân tiền; công cụ chính sách tiền tệ (OMO, lãi suất chiết khấu, dự trữ bắt buộc) & truyền dẫn; lạm phát cầu kéo/chi phí đẩy, ba loại thất nghiệp, đường Phillips ngắn/dài hạn & NAIRU; tài trợ trực tiếp/gián tiếp, lựa chọn đối nghịch & rủi ro đạo đức, phân loại thị trường tài chính; tỷ giá danh nghĩa/thực, PPP, ngang giá lãi suất, chế độ tỷ giá & bộ ba bất khả thi; đồng nhất thức cán cân thanh toán; ba loại khủng hoảng tài chính & vai trò IMF/World Bank/WTO.',
    requirements: 'Kinh tế học vi mô/vĩ mô nhập môn. Không cần kiến thức tài chính chuyên sâu trước.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách (Mishkin, Krugman/Obstfeld, Blanchard), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kinh tế tiền tệ & kinh tế toàn cầu, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tiền tệ & hệ thống tiền tệ|||Chapter 1 — Money & the monetary system', description: 'Chức năng của tiền, tiền hàng hoá vs pháp định, khối cung tiền M0-M3.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngân hàng trung ương & cung tiền|||Chapter 2 — Central banks & money supply', description: 'Chức năng NHTW, ngân hàng tạo tiền, số nhân tiền.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chính sách tiền tệ & lãi suất|||Chapter 3 — Monetary policy & interest rates', description: 'OMO, lãi suất chiết khấu, dự trữ bắt buộc, truyền dẫn chính sách.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lạm phát, thất nghiệp & đường Phillips|||Chapter 4 — Inflation, unemployment & Phillips curve', description: 'Cầu kéo/chi phí đẩy, ba loại thất nghiệp, Phillips ngắn/dài hạn, NAIRU.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hệ thống & thị trường tài chính|||Chapter 5 — Financial system & markets', description: 'Trực tiếp/gián tiếp, adverse selection/moral hazard, phân loại thị trường.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Tỷ giá hối đoái & thị trường ngoại hối|||Chapter 6 — Exchange rates & forex market', description: 'Danh nghĩa/thực, PPP, ngang giá lãi suất, chế độ tỷ giá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cán cân thanh toán & kinh tế mở|||Chapter 7 — Balance of payments & open economy', description: 'Tài khoản vãng lai/vốn, đồng nhất thức BOP, điều chỉnh Mundell-Fleming.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Toàn cầu hoá & khủng hoảng tài chính|||Chapter 8 — Globalization & financial crises', description: 'Ba loại khủng hoảng, ca thực tế 1997/2008, IMF/World Bank/WTO.', lessons: [c8, c8q] },
  ],
};
