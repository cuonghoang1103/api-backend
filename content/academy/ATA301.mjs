/**
 * ATA301 — Applied Technical Analysis (Phân tích kỹ thuật ứng dụng).
 * Giáo trình tham khảo (trích dẫn, KHÔNG upload PDF): Murphy "Technical
 * Analysis of the Financial Markets"; Pring "Technical Analysis Explained";
 * Edwards/Magee "Technical Analysis of Stock Trends"; CMT curriculum.
 * 8 chương: Dow Theory → biểu đồ/mô hình giá → xu hướng/hỗ trợ-kháng cự →
 * chỉ báo xu hướng (MA/MACD) → chỉ báo dao động (RSI/Stochastic) → khối lượng
 * → Elliott/Fibonacci → hệ thống giao dịch & quản lý rủi ro. Số ví dụ trong
 * <pre><code> đều là GIẢ ĐỊNH minh hoạ — KHÔNG phải khuyến nghị đầu tư.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ata301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển (kèm link), tài liệu chính thức miễn phí (Investopedia, StockCharts ChartSchool), YouTube, công cụ biểu đồ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ATA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Applied Technical Analysis — chart reading, indicators, wave theory and system building — in one place. These are free/legal references; the official FPTU syllabus &amp; slides live on <strong>FLM</strong>.</p>
<h3>📗 Classic reference books (cited, not reproduced)</h3>
<ul>
<li>John J. Murphy — <em>Technical Analysis of the Financial Markets</em></li>
<li>Martin J. Pring — <em>Technical Analysis Explained</em></li>
<li>Robert D. Edwards &amp; John Magee — <em>Technical Analysis of Stock Trends</em></li>
<li><a href="https://cmtassociation.org/" target="_blank" rel="noopener">CMT Association</a> — Chartered Market Technician curriculum outline</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.investopedia.com/technical-analysis-4689657" target="_blank" rel="noopener">Investopedia — Technical Analysis</a></li>
<li><a href="https://school.stockcharts.com/doku.php" target="_blank" rel="noopener">StockCharts ChartSchool</a> — free chart-pattern &amp; indicator encyclopedia</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ChartSchool" target="_blank" rel="noopener">StockCharts / ChartSchool</a> — indicator walkthroughs</li>
<li><a href="https://www.youtube.com/@rayner_teo" target="_blank" rel="noopener">Rayner Teo</a> — price action &amp; risk management explainers</li>
</ul>
<h3>🛠️ Charting tools</h3>
<ul>
<li><a href="https://www.tradingview.com/" target="_blank" rel="noopener">TradingView</a> — free charting with drawing tools &amp; indicators</li>
<li><a href="https://www.investing.com/" target="_blank" rel="noopener">Investing.com</a> — quotes, charts, economic calendar</li>
</ul>
<div class="callout"><span class="badge">⚠️ Risk notice</span> Technical analysis is a tool for reading probability and market psychology from price/volume history — it does <strong>not</strong> predict the future with certainty. Every number in this course's examples is <strong>assumed/illustrative</strong>. Nothing here is investment advice; trading real money carries real risk of loss.</div>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — Dow Theory, chart types, trend/support-resistance.</li>
<li><strong>Indicators</strong> — moving averages, MACD, RSI, Stochastic, volume.</li>
<li><strong>Advanced patterns</strong> — Elliott Wave, Fibonacci retracement/extension.</li>
<li><strong>Practice</strong> — build a written trading plan and backtest it on historical charts (paper trading, never live capital, while learning).</li>
</ol></div>`,
    `<span class="eyebrow">ATA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Phân tích kỹ thuật ứng dụng — đọc biểu đồ, chỉ báo, lý thuyết sóng và xây hệ thống giao dịch — gom về một chỗ. Đây là nguồn miễn phí/hợp pháp; giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>.</p>
<h3>📗 Sách kinh điển (trích dẫn, không sao chép)</h3>
<ul>
<li>John J. Murphy — <em>Technical Analysis of the Financial Markets</em></li>
<li>Martin J. Pring — <em>Technical Analysis Explained</em></li>
<li>Robert D. Edwards &amp; John Magee — <em>Technical Analysis of Stock Trends</em></li>
<li><a href="https://cmtassociation.org/" target="_blank" rel="noopener">CMT Association</a> — đề cương chứng chỉ Chartered Market Technician</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.investopedia.com/technical-analysis-4689657" target="_blank" rel="noopener">Investopedia — Technical Analysis</a></li>
<li><a href="https://school.stockcharts.com/doku.php" target="_blank" rel="noopener">StockCharts ChartSchool</a> — bách khoa mô hình biểu đồ &amp; chỉ báo miễn phí</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ChartSchool" target="_blank" rel="noopener">StockCharts / ChartSchool</a> — giảng chỉ báo chi tiết</li>
<li><a href="https://www.youtube.com/@rayner_teo" target="_blank" rel="noopener">Rayner Teo</a> — hành động giá &amp; quản lý rủi ro</li>
</ul>
<h3>🛠️ Công cụ biểu đồ</h3>
<ul>
<li><a href="https://www.tradingview.com/" target="_blank" rel="noopener">TradingView</a> — biểu đồ miễn phí kèm công cụ vẽ &amp; chỉ báo</li>
<li><a href="https://www.investing.com/" target="_blank" rel="noopener">Investing.com</a> — giá, biểu đồ, lịch kinh tế</li>
</ul>
<div class="callout"><span class="badge">⚠️ Lưu ý rủi ro</span> Phân tích kỹ thuật là công cụ đọc xác suất và tâm lý thị trường từ lịch sử giá/khối lượng — <strong>không</strong> dự đoán chắc chắn tương lai. Mọi con số trong ví dụ của môn này đều là <strong>giả định/minh hoạ</strong>. Không nội dung nào ở đây là lời khuyên đầu tư; giao dịch bằng tiền thật luôn có rủi ro mất vốn.</div>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — lý thuyết Dow, các loại biểu đồ, xu hướng/hỗ trợ-kháng cự.</li>
<li><strong>Chỉ báo</strong> — đường trung bình động, MACD, RSI, Stochastic, khối lượng.</li>
<li><strong>Mô hình nâng cao</strong> — sóng Elliott, Fibonacci retracement/extension.</li>
<li><strong>Thực hành</strong> — viết một kế hoạch giao dịch và kiểm thử trên dữ liệu lịch sử (paper trading, KHÔNG dùng tiền thật khi còn học).</li>
</ol></div>`,
  ]]);

const intro = doc('ata301-0-1-overview', 'Course overview: Applied Technical Analysis|||Tổng quan: Phân tích kỹ thuật ứng dụng',
  'Phân tích kỹ thuật là gì, ba tiền đề nền tảng, khác biệt với phân tích cơ bản; lộ trình 8 chương; cảnh báo rủi ro.',
  [[
    `<span class="eyebrow">ATA301 · Lesson 0.1 · Overview</span>
<h2>Applied Technical Analysis</h2>
<p class="lead">This course teaches you to read <strong>price charts</strong> and <strong>indicators</strong> to study market behavior — the discipline used alongside (not instead of) fundamental analysis. You'll study chart patterns, trend tools, momentum/volume indicators, Elliott Wave &amp; Fibonacci, and finish by building a written, risk-managed trading plan.</p>
<h3>Three foundational premises</h3>
<ul>
<li><strong>The market discounts everything</strong> — price already reflects all known information (news, fundamentals, sentiment).</li>
<li><strong>Prices move in trends</strong> — a trend in motion tends to continue until a clear reversal signal appears.</li>
<li><strong>History tends to repeat</strong> — repeated crowd psychology (fear/greed) produces recurring chart patterns.</li>
</ul>
<h3>Technical vs. fundamental analysis</h3>
<p><strong>Fundamental analysis</strong> studies a company/economy's intrinsic value (earnings, macro data). <strong>Technical analysis</strong> studies price and volume history to gauge supply/demand and probability — it does not attempt to value a business.</p>
<h3>Roadmap</h3>
<p>Dow Theory foundations → charts &amp; price patterns → trend/support-resistance → trend indicators (MA, MACD) → oscillators (RSI, Stochastic) → volume → Elliott Wave &amp; Fibonacci → building a trading system with risk management.</p>
<div class="callout"><span class="badge">⚠️ Not investment advice</span> This course is educational. Technical analysis describes <em>probability</em>, not certainty — past patterns can fail. Nothing taught here is a recommendation to buy or sell any specific asset.</div>`,
    `<span class="eyebrow">ATA301 · Bài 0.1 · Tổng quan</span>
<h2>Phân tích kỹ thuật ứng dụng</h2>
<p class="lead">Môn này dạy bạn đọc <strong>biểu đồ giá</strong> và <strong>chỉ báo</strong> để nghiên cứu hành vi thị trường — một trường phái dùng SONG SONG (không thay thế) phân tích cơ bản. Bạn sẽ học mô hình biểu đồ, công cụ xu hướng, chỉ báo động lượng/khối lượng, sóng Elliott &amp; Fibonacci, và kết thúc bằng việc xây một kế hoạch giao dịch có quản lý rủi ro, viết ra rõ ràng.</p>
<h3>Ba tiền đề nền tảng</h3>
<ul>
<li><strong>Thị trường phản ánh mọi thứ</strong> — giá đã bao hàm mọi thông tin đã biết (tin tức, cơ bản, tâm lý).</li>
<li><strong>Giá di chuyển theo xu hướng</strong> — một xu hướng đang chạy có xu hướng tiếp diễn cho tới khi có tín hiệu đảo chiều rõ ràng.</li>
<li><strong>Lịch sử có xu hướng lặp lại</strong> — tâm lý đám đông (sợ hãi/tham lam) lặp đi lặp lại tạo ra các mô hình biểu đồ tái diễn.</li>
</ul>
<h3>Phân tích kỹ thuật vs. phân tích cơ bản</h3>
<p><strong>Phân tích cơ bản</strong> nghiên cứu giá trị nội tại của doanh nghiệp/nền kinh tế (lợi nhuận, dữ liệu vĩ mô). <strong>Phân tích kỹ thuật</strong> nghiên cứu lịch sử giá và khối lượng để đo cung/cầu và xác suất — không định giá doanh nghiệp.</p>
<h3>Lộ trình</h3>
<p>Nền tảng lý thuyết Dow → biểu đồ &amp; mô hình giá → xu hướng/hỗ trợ-kháng cự → chỉ báo xu hướng (MA, MACD) → chỉ báo dao động (RSI, Stochastic) → khối lượng → sóng Elliott &amp; Fibonacci → xây hệ thống giao dịch có quản lý rủi ro.</p>
<div class="callout"><span class="badge">⚠️ Không phải lời khuyên đầu tư</span> Môn học mang tính giáo dục. Phân tích kỹ thuật mô tả <em>xác suất</em>, không phải chắc chắn — mô hình quá khứ có thể thất bại. Không nội dung nào ở đây là khuyến nghị mua/bán một tài sản cụ thể.</div>`,
  ]]);

const c1 = doc('ata301-1-1-dow-theory', '1.1 — Foundations & Dow Theory|||1.1 — Cơ sở phân tích kỹ thuật & lý thuyết Dow',
  'Ba tiền đề của phân tích kỹ thuật, sáu nguyên lý lý thuyết Dow, ba pha thị trường, vai trò của khối lượng xác nhận xu hướng.',
  [[
    `<span class="eyebrow">ATA301 · Chapter 1 · Lesson 1.1</span>
<h2>Foundations &amp; Dow Theory</h2>
<p>Charles Dow's ideas (late 19th century) are the root of modern technical analysis. Six commonly-cited tenets:</p>
<ul>
<li><strong>The averages discount everything</strong> — all available information is already reflected in price.</li>
<li><strong>The market has three trends</strong> — <em>primary</em> (months–years), <em>secondary</em> (weeks–months, corrections against the primary), <em>minor</em> (days, noise).</li>
<li><strong>Primary trends have three phases</strong> — accumulation (informed buyers step in quietly), public participation (the trend becomes obvious, most gains happen here), distribution (informed holders sell into strength).</li>
<li><strong>Averages must confirm each other</strong> — Dow required two indices to move together to validate a signal (a caution against acting on one narrow signal).</li>
<li><strong>Volume must confirm the trend</strong> — rising price on rising volume is healthy; rising price on falling volume is suspect.</li>
<li><strong>A trend is assumed in effect until a clear reversal signal appears</strong> — the basis of "the trend is your friend."</li>
</ul>
<pre><code>Three phases (illustrative, not a signal):
 Accumulation      -> quiet buying, price flat/choppy
 Public participation -> trend visible, most of the move happens here
 Distribution      -> smart holders exit, momentum fades
</code></pre>
<div class="callout"><span class="badge">⚠️ Limitation</span> Dow Theory is descriptive and lagging — it identifies trend phases AFTER they are underway, and it says nothing about exact entry/exit prices. It is a framework, not a signal generator.</div>`,
    `<span class="eyebrow">ATA301 · Chương 1 · Bài 1.1</span>
<h2>Cơ sở phân tích kỹ thuật &amp; lý thuyết Dow</h2>
<p>Ý tưởng của Charles Dow (cuối thế kỷ 19) là gốc rễ của phân tích kỹ thuật hiện đại. Sáu nguyên lý thường được trích dẫn:</p>
<ul>
<li><strong>Chỉ số phản ánh mọi thứ</strong> — mọi thông tin sẵn có đã nằm trong giá.</li>
<li><strong>Thị trường có ba xu hướng</strong> — <em>chính (primary)</em> (tháng–năm), <em>phụ (secondary)</em> (tuần–tháng, điều chỉnh ngược xu hướng chính), <em>nhỏ (minor)</em> (ngày, nhiễu).</li>
<li><strong>Xu hướng chính có ba pha</strong> — tích luỹ (nhà đầu tư am hiểu âm thầm mua vào), tham gia đại chúng (xu hướng rõ ràng, phần lớn mức tăng xảy ra ở đây), phân phối (người nắm giữ am hiểu bán ra khi giá còn cao).</li>
<li><strong>Các chỉ số phải xác nhận lẫn nhau</strong> — Dow yêu cầu hai chỉ số cùng di chuyển để xác nhận tín hiệu (cảnh báo không hành động theo một tín hiệu đơn lẻ hẹp).</li>
<li><strong>Khối lượng phải xác nhận xu hướng</strong> — giá tăng kèm khối lượng tăng là lành mạnh; giá tăng kèm khối lượng giảm là đáng ngờ.</li>
<li><strong>Một xu hướng được coi là còn hiệu lực cho tới khi có tín hiệu đảo chiều rõ ràng</strong> — nền tảng của câu "xu hướng là bạn".</li>
</ul>
<pre><code>Ba pha (minh hoạ, KHÔNG phải tín hiệu):
 Tích luỹ       -> mua âm thầm, giá đi ngang/giằng co
 Tham gia đại chúng -> xu hướng rõ, phần lớn biến động xảy ra ở đây
 Phân phối      -> người nắm giữ am hiểu thoát hàng, động lượng yếu dần
</code></pre>
<div class="callout"><span class="badge">⚠️ Giới hạn</span> Lý thuyết Dow mang tính mô tả và ĐỘ TRỄ — nó nhận diện pha xu hướng SAU KHI xu hướng đã diễn ra, và không nói gì về giá vào/ra chính xác. Đây là khung tư duy, không phải bộ sinh tín hiệu.</div>`,
  ]]);

const c1q = quiz('ata301-quiz-1', 'Quiz 1 — Dow Theory|||Quiz 1 — Lý thuyết Dow', [
  { id: 'q1', question: 'Theo lý thuyết Dow, xu hướng CHÍNH (primary) kéo dài trong khoảng thời gian nào?', options: ['Vài giờ', 'Vài ngày', 'Vài tháng đến vài năm', 'Vài phút'], correctIndex: 2, explanation: 'Xu hướng chính là xu hướng dài hạn nhất, kéo dài từ vài tháng tới vài năm; xu hướng phụ và nhỏ ngắn hơn.' },
  { id: 'q2', question: 'Pha nào của xu hướng chính diễn ra khi xu hướng đã rõ ràng và phần lớn mức tăng xảy ra?', options: ['Tích luỹ', 'Tham gia đại chúng', 'Phân phối', 'Đảo chiều'], correctIndex: 1, explanation: 'Pha "tham gia đại chúng" là lúc xu hướng đã hiển nhiên với số đông và phần lớn biến động giá xảy ra ở đây.' },
  { id: 'q3', question: 'Theo lý thuyết Dow, một xu hướng tăng giá kèm khối lượng giảm dần nên được nhìn nhận thế nào?', options: ['Là xác nhận mạnh cho xu hướng', 'Đáng ngờ — khối lượng không xác nhận xu hướng', 'Không liên quan tới xu hướng', 'Luôn là tín hiệu mua'], correctIndex: 1, explanation: 'Dow cho rằng khối lượng phải xác nhận xu hướng; giá tăng mà khối lượng giảm là dấu hiệu đáng ngờ, không phải xác nhận.' },
]);

const c2 = doc('ata301-2-1-chart-patterns', '2.1 — Charts & price patterns|||2.1 — Biểu đồ & mô hình giá',
  'Ba loại biểu đồ (đường, thanh, nến Nhật), cấu tạo nến, mô hình đảo chiều (Head & Shoulders, Double Top/Bottom) và tiếp diễn (cờ, tam giác).',
  [[
    `<span class="eyebrow">ATA301 · Chapter 2 · Lesson 2.1</span>
<h2>Charts &amp; price patterns</h2>
<h3>Chart types</h3>
<ul>
<li><strong>Line chart</strong> — connects closing prices; simplest, hides intraday range.</li>
<li><strong>Bar (OHLC) chart</strong> — a vertical line for the high-low range, ticks left (open) and right (close).</li>
<li><strong>Candlestick chart</strong> — a "body" between open and close, "wicks/shadows" for the high/low; <strong>bullish</strong> (close &gt; open, usually shown hollow/green) vs. <strong>bearish</strong> (close &lt; open, filled/red).</li>
</ul>
<h3>Reversal patterns</h3>
<ul>
<li><strong>Head &amp; Shoulders</strong> — three peaks, the middle (head) higher than the two shoulders; a break of the "neckline" suggests a trend reversal.</li>
<li><strong>Double Top / Double Bottom</strong> — price tests a level twice and fails to break it, suggesting exhaustion of the prior trend.</li>
</ul>
<h3>Continuation patterns</h3>
<ul>
<li><strong>Flags &amp; Pennants</strong> — a brief sideways/counter-trend pause after a sharp move, often resolving in the prior direction.</li>
<li><strong>Triangles</strong> (ascending/descending/symmetrical) — converging trendlines showing a squeeze before a breakout.</li>
</ul>
<pre><code>Illustrative Head &amp; Shoulders (assumed prices, not a signal):
   Left shoulder ~102 -- Head ~108 -- Right shoulder ~103
   Neckline ~98
   A close below 98 is the pattern's classic "confirmation" —
   still just one input among many, not a guarantee.
</code></pre>
<div class="callout"><span class="badge">⚠️ Caution</span> Chart patterns are subjective and drawn with hindsight bias; the same chart can look like different patterns to different people. Never trade a pattern in isolation.</div>`,
    `<span class="eyebrow">ATA301 · Chương 2 · Bài 2.1</span>
<h2>Biểu đồ &amp; mô hình giá</h2>
<h3>Các loại biểu đồ</h3>
<ul>
<li><strong>Biểu đồ đường (line)</strong> — nối các giá đóng cửa; đơn giản nhất, không thấy biên độ trong phiên.</li>
<li><strong>Biểu đồ thanh (bar/OHLC)</strong> — một đường dọc thể hiện biên độ cao-thấp, gạch ngang trái (mở cửa) và phải (đóng cửa).</li>
<li><strong>Biểu đồ nến Nhật (candlestick)</strong> — "thân nến" giữa giá mở và đóng, "bấc/râu nến" cho giá cao/thấp; <strong>nến tăng</strong> (đóng &gt; mở, thường tô rỗng/xanh) và <strong>nến giảm</strong> (đóng &lt; mở, tô đặc/đỏ).</li>
</ul>
<h3>Mô hình đảo chiều</h3>
<ul>
<li><strong>Vai-Đầu-Vai (Head &amp; Shoulders)</strong> — ba đỉnh, đỉnh giữa (đầu) cao hơn hai đỉnh vai; giá phá "đường viền cổ" (neckline) gợi ý xu hướng đảo chiều.</li>
<li><strong>Hai đỉnh / Hai đáy (Double Top/Bottom)</strong> — giá kiểm định một vùng hai lần và không phá được, gợi ý xu hướng trước đó đang cạn lực.</li>
</ul>
<h3>Mô hình tiếp diễn</h3>
<ul>
<li><strong>Cờ &amp; cờ đuôi nheo (Flag/Pennant)</strong> — một nhịp nghỉ ngang/ngược xu hướng ngắn sau một cú tăng/giảm mạnh, thường tiếp diễn theo hướng cũ.</li>
<li><strong>Tam giác</strong> (tăng dần/giảm dần/cân) — hai đường xu hướng hội tụ, thể hiện sự nén giá trước khi bứt phá.</li>
</ul>
<pre><code>Minh hoạ Vai-Đầu-Vai (giá GIẢ ĐỊNH, không phải tín hiệu):
   Vai trái ~102 -- Đầu ~108 -- Vai phải ~103
   Đường viền cổ ~98
   Giá đóng cửa dưới 98 là "xác nhận" kinh điển của mô hình —
   vẫn chỉ là một yếu tố trong nhiều yếu tố, không phải đảm bảo.
</code></pre>
<div class="callout"><span class="badge">⚠️ Lưu ý</span> Mô hình biểu đồ mang tính chủ quan và dễ bị "nhìn ngược đọc xuôi" (hindsight bias); cùng một biểu đồ có thể được nhìn thành mô hình khác nhau tuỳ người. Không bao giờ giao dịch theo một mô hình đơn lẻ.</div>`,
  ]]);

const c2q = quiz('ata301-quiz-2', 'Quiz 2 — Chart patterns|||Quiz 2 — Mô hình biểu đồ', [
  { id: 'q1', question: 'Trong biểu đồ nến Nhật, một nến TĂNG (bullish) nghĩa là?', options: ['Giá đóng cửa thấp hơn giá mở cửa', 'Giá đóng cửa cao hơn giá mở cửa', 'Không có bấc nến', 'Khối lượng bằng 0'], correctIndex: 1, explanation: 'Nến tăng: giá đóng cửa cao hơn giá mở cửa trong phiên đó.' },
  { id: 'q2', question: 'Mô hình Vai-Đầu-Vai (Head & Shoulders) được xem là loại mô hình gì?', options: ['Mô hình tiếp diễn', 'Mô hình đảo chiều', 'Chỉ báo khối lượng', 'Đường trung bình động'], correctIndex: 1, explanation: 'Head & Shoulders là mô hình đảo chiều kinh điển, gợi ý xu hướng trước đó sắp kết thúc.' },
  { id: 'q3', question: 'Mô hình cờ (flag) hoặc tam giác thường được xếp vào loại nào?', options: ['Mô hình đảo chiều', 'Mô hình tiếp diễn', 'Chỉ báo dao động', 'Lý thuyết Dow'], correctIndex: 1, explanation: 'Cờ và tam giác thường là mô hình tiếp diễn — một nhịp nghỉ trước khi giá đi tiếp theo hướng cũ.' },
]);

const c3 = doc('ata301-3-1-trend-support-resistance', '3.1 — Trends, support/resistance & trendlines|||3.1 — Xu hướng, hỗ trợ/kháng cự & đường xu hướng',
  'Định nghĩa xu hướng tăng/giảm/đi ngang, khái niệm hỗ trợ và kháng cự, đổi vai trò khi bị phá vỡ, cách vẽ đường xu hướng và kênh giá.',
  [[
    `<span class="eyebrow">ATA301 · Chapter 3 · Lesson 3.1</span>
<h2>Trends, support/resistance &amp; trendlines</h2>
<h3>Defining a trend</h3>
<ul>
<li><strong>Uptrend</strong> — a series of higher highs (HH) and higher lows (HL).</li>
<li><strong>Downtrend</strong> — a series of lower highs (LH) and lower lows (LL).</li>
<li><strong>Sideways / range</strong> — price oscillates between a fairly flat high and low with no clear HH/HL or LH/LL sequence.</li>
</ul>
<h3>Support &amp; resistance</h3>
<p><strong>Support</strong> is a price level where buying pressure has historically been strong enough to stop a decline. <strong>Resistance</strong> is a level where selling pressure has stopped an advance. A key idea: <strong>role reversal</strong> — once resistance is decisively broken it often becomes a new support level, and vice versa.</p>
<h3>Trendlines &amp; channels</h3>
<p>An <strong>uptrend line</strong> connects a series of rising lows; a <strong>downtrend line</strong> connects a series of falling highs. A line drawn from only two points is a guess — a <strong>third touch</strong> that respects the line adds confidence. Adding a parallel line on the opposite side creates a <strong>price channel</strong>.</p>
<pre><code>Illustrative uptrend (assumed points, not a signal):
 Low1 = 100 at day 1
 Low2 = 104 at day 10   (higher low)
 Low3 = 109 at day 20   (higher low, touches the same trendline)
 -> a rising trendline can be drawn through Low1-Low2-Low3
</code></pre>
<div class="callout"><span class="badge">⚠️ Caution</span> Support/resistance levels are zones of probability, not exact prices — and once broken, they can fail to "reverse roles" as expected. Combine with other tools before acting.</div>`,
    `<span class="eyebrow">ATA301 · Chương 3 · Bài 3.1</span>
<h2>Xu hướng, hỗ trợ/kháng cự &amp; đường xu hướng</h2>
<h3>Định nghĩa xu hướng</h3>
<ul>
<li><strong>Xu hướng tăng</strong> — chuỗi đỉnh sau cao hơn đỉnh trước (HH) và đáy sau cao hơn đáy trước (HL).</li>
<li><strong>Xu hướng giảm</strong> — chuỗi đỉnh sau thấp hơn đỉnh trước (LH) và đáy sau thấp hơn đáy trước (LL).</li>
<li><strong>Đi ngang (sideway/range)</strong> — giá dao động giữa vùng cao-thấp khá bằng phẳng, không có chuỗi HH/HL hay LH/LL rõ ràng.</li>
</ul>
<h3>Hỗ trợ &amp; kháng cự</h3>
<p><strong>Hỗ trợ (support)</strong> là vùng giá mà lực mua trong lịch sử đủ mạnh để chặn đà giảm. <strong>Kháng cự (resistance)</strong> là vùng giá mà lực bán từng chặn đà tăng. Ý tưởng quan trọng: <strong>đổi vai trò (role reversal)</strong> — khi kháng cự bị phá vỡ dứt khoát, nó thường trở thành hỗ trợ mới, và ngược lại.</p>
<h3>Đường xu hướng &amp; kênh giá</h3>
<p><strong>Đường xu hướng tăng</strong> nối các đáy tăng dần; <strong>đường xu hướng giảm</strong> nối các đỉnh giảm dần. Một đường vẽ qua chỉ hai điểm là phỏng đoán — <strong>điểm chạm thứ ba</strong> tôn trọng đường đó làm tăng độ tin cậy. Thêm một đường song song phía đối diện tạo thành <strong>kênh giá</strong>.</p>
<pre><code>Minh hoạ xu hướng tăng (điểm GIẢ ĐỊNH, không phải tín hiệu):
 Đáy1 = 100 tại ngày 1
 Đáy2 = 104 tại ngày 10  (đáy cao hơn)
 Đáy3 = 109 tại ngày 20  (đáy cao hơn, chạm cùng đường xu hướng)
 -> có thể vẽ một đường xu hướng tăng qua Đáy1-Đáy2-Đáy3
</code></pre>
<div class="callout"><span class="badge">⚠️ Lưu ý</span> Vùng hỗ trợ/kháng cự là vùng xác suất, không phải mức giá chính xác — và sau khi bị phá vỡ, chúng có thể KHÔNG "đổi vai trò" như kỳ vọng. Kết hợp với công cụ khác trước khi hành động.</div>`,
  ]]);

const c3q = quiz('ata301-quiz-3', 'Quiz 3 — Trend & support/resistance|||Quiz 3 — Xu hướng & hỗ trợ/kháng cự', [
  { id: 'q1', question: 'Một xu hướng TĂNG được nhận diện qua chuỗi nào?', options: ['Đỉnh thấp dần, đáy thấp dần', 'Đỉnh cao dần, đáy cao dần', 'Đỉnh và đáy không đổi', 'Không thể nhận diện qua đỉnh/đáy'], correctIndex: 1, explanation: 'Xu hướng tăng: chuỗi đỉnh sau cao hơn đỉnh trước và đáy sau cao hơn đáy trước (HH/HL).' },
  { id: 'q2', question: 'Khi một vùng kháng cự bị phá vỡ dứt khoát, hiện tượng "đổi vai trò" cho rằng vùng đó thường trở thành gì?', options: ['Kháng cự mạnh hơn', 'Hỗ trợ mới', 'Không còn ý nghĩa', 'Đường xu hướng'], correctIndex: 1, explanation: 'Theo nguyên lý đổi vai trò, kháng cự cũ khi bị phá thường trở thành hỗ trợ mới (và ngược lại).' },
  { id: 'q3', question: 'Vì sao một đường xu hướng chỉ vẽ qua hai điểm được xem là kém tin cậy?', options: ['Vì luôn sai', 'Vì chưa có điểm chạm thứ ba xác nhận', 'Vì đường xu hướng phải nằm ngang', 'Vì cần ít nhất 10 điểm'], correctIndex: 1, explanation: 'Hai điểm chỉ đủ để vẽ một đường thẳng bất kỳ; điểm chạm thứ ba tôn trọng đường đó mới tăng độ tin cậy.' },
]);

const c4 = doc('ata301-4-1-trend-indicators', '4.1 — Trend indicators: MA & MACD|||4.1 — Chỉ báo xu hướng: MA & MACD',
  'Đường trung bình động đơn giản/hàm mũ (SMA/EMA), tín hiệu giao cắt vàng/tử thần, cấu tạo MACD (đường MACD, đường tín hiệu, histogram).',
  [[
    `<span class="eyebrow">ATA301 · Chapter 4 · Lesson 4.1</span>
<h2>Trend indicators: MA &amp; MACD</h2>
<h3>Moving averages (MA)</h3>
<p>A <strong>Simple Moving Average (SMA)</strong> is the average close over N periods; it smooths noise to reveal the trend's direction. An <strong>Exponential Moving Average (EMA)</strong> weights recent prices more heavily, so it reacts faster than an SMA of the same length.</p>
<pre><code>SMA(N) = (P1 + P2 + ... + PN) / N

Illustrative 5-day SMA (assumed closes):
 Closes: 100, 102, 101, 105, 107
 SMA(5) = (100+102+101+105+107) / 5 = 103
</code></pre>
<h3>Golden cross &amp; death cross</h3>
<p>A commonly-cited crossover signal: a <strong>golden cross</strong> is a shorter MA (e.g. 50-day) crossing ABOVE a longer MA (e.g. 200-day) — often read as bullish. A <strong>death cross</strong> is the reverse (shorter MA crosses below) — often read as bearish. Both are lagging, since MAs are built from past prices.</p>
<h3>MACD (Moving Average Convergence Divergence)</h3>
<ul>
<li><strong>MACD line</strong> = EMA(12) − EMA(26).</li>
<li><strong>Signal line</strong> = EMA(9) of the MACD line.</li>
<li><strong>Histogram</strong> = MACD line − Signal line; it visualizes momentum shifts. MACD crossing above its signal line is often read as bullish momentum, and below as bearish.</li>
</ul>
<div class="callout"><span class="badge">⚠️ Lag warning</span> All moving-average-based tools are LAGGING — they confirm a trend that has already started and can whipsaw (give false signals) in a sideways market.</div>`,
    `<span class="eyebrow">ATA301 · Chương 4 · Bài 4.1</span>
<h2>Chỉ báo xu hướng: MA &amp; MACD</h2>
<h3>Đường trung bình động (MA)</h3>
<p><strong>SMA (Simple Moving Average)</strong> là trung bình giá đóng cửa trong N phiên; giúp làm mượt nhiễu để thấy rõ hướng xu hướng. <strong>EMA (Exponential Moving Average)</strong> đặt trọng số cao hơn cho giá gần đây, nên phản ứng nhanh hơn SMA cùng độ dài.</p>
<pre><code>SMA(N) = (P1 + P2 + ... + PN) / N

Minh hoạ SMA 5 ngày (giá đóng cửa GIẢ ĐỊNH):
 Giá đóng: 100, 102, 101, 105, 107
 SMA(5) = (100+102+101+105+107) / 5 = 103
</code></pre>
<h3>Giao cắt vàng &amp; giao cắt tử thần</h3>
<p>Một tín hiệu giao cắt thường được nhắc tới: <strong>giao cắt vàng (golden cross)</strong> là khi MA ngắn (vd 50 phiên) cắt LÊN TRÊN MA dài (vd 200 phiên) — thường được đọc là tín hiệu tăng giá. <strong>Giao cắt tử thần (death cross)</strong> là ngược lại (MA ngắn cắt xuống dưới) — thường đọc là tín hiệu giảm giá. Cả hai đều có độ trễ, vì MA được tính từ giá quá khứ.</p>
<h3>MACD (Moving Average Convergence Divergence)</h3>
<ul>
<li><strong>Đường MACD</strong> = EMA(12) − EMA(26).</li>
<li><strong>Đường tín hiệu (signal)</strong> = EMA(9) của đường MACD.</li>
<li><strong>Histogram</strong> = đường MACD − đường tín hiệu; trực quan hoá thay đổi động lượng. MACD cắt lên trên đường tín hiệu thường đọc là động lượng tăng, cắt xuống là động lượng giảm.</li>
</ul>
<div class="callout"><span class="badge">⚠️ Cảnh báo độ trễ</span> Mọi công cụ dựa trên trung bình động đều CÓ ĐỘ TRỄ — chúng xác nhận một xu hướng đã bắt đầu và có thể cho tín hiệu giả (whipsaw) khi thị trường đi ngang.</div>`,
  ]]);

const c4q = quiz('ata301-quiz-4', 'Quiz 4 — MA & MACD|||Quiz 4 — MA & MACD', [
  { id: 'q1', question: 'So với SMA cùng độ dài, EMA phản ứng với giá gần đây như thế nào?', options: ['Chậm hơn vì trọng số bằng nhau', 'Nhanh hơn vì đặt trọng số cao hơn cho giá gần đây', 'Không khác biệt', 'EMA không dùng giá gần đây'], correctIndex: 1, explanation: 'EMA đặt trọng số cao hơn cho giá gần đây nên phản ứng nhanh hơn SMA cùng độ dài.' },
  { id: 'q2', question: '"Giao cắt vàng" (golden cross) xảy ra khi nào?', options: ['MA dài cắt lên trên MA ngắn', 'MA ngắn cắt lên trên MA dài', 'Giá cắt xuống dưới MA', 'MACD bằng 0'], correctIndex: 1, explanation: 'Giao cắt vàng: đường MA ngắn hơn cắt lên trên đường MA dài hơn, thường đọc là tín hiệu tăng.' },
  { id: 'q3', question: 'Đường MACD được tính bằng công thức nào?', options: ['SMA(50) − SMA(200)', 'EMA(12) − EMA(26)', 'EMA(9) của giá đóng cửa', 'RSI − 50'], correctIndex: 1, explanation: 'Đường MACD = EMA(12) trừ EMA(26); đường tín hiệu là EMA(9) của chính đường MACD.' },
]);

const c5 = doc('ata301-5-1-oscillators', '5.1 — Oscillators: RSI & Stochastic|||5.1 — Chỉ báo dao động: RSI & Stochastic',
  'Công thức RSI, vùng quá mua/quá bán, chỉ báo Stochastic %K/%D, khái niệm phân kỳ (divergence) giữa giá và chỉ báo.',
  [[
    `<span class="eyebrow">ATA301 · Chapter 5 · Lesson 5.1</span>
<h2>Oscillators: RSI &amp; Stochastic</h2>
<h3>RSI (Relative Strength Index)</h3>
<pre><code>RSI = 100 − 100 / (1 + RS)
RS  = Average gain over N periods / Average loss over N periods

Illustrative 14-period RSI (assumed averages):
 Average gain = 1.2, Average loss = 0.6
 RS = 1.2 / 0.6 = 2
 RSI = 100 − 100/(1+2) = 100 − 33.3 = 66.7
</code></pre>
<p>RSI oscillates 0–100. A common (not guaranteed) reading: RSI &gt; 70 suggests "overbought" and RSI &lt; 30 suggests "oversold" — meaning momentum has stretched, not that a reversal is imminent.</p>
<h3>Stochastic Oscillator</h3>
<pre><code>%K = 100 × (Close − LowestLow_N) / (HighestHigh_N − LowestLow_N)
%D = a moving average (commonly 3-period) of %K
</code></pre>
<p>Also scaled 0–100, with 80/20 commonly cited as overbought/oversold thresholds.</p>
<h3>Divergence</h3>
<p>A <strong>bearish divergence</strong> is when price makes a higher high but the oscillator makes a lower high (momentum weakening under the surface). A <strong>bullish divergence</strong> is the mirror case at lows. Divergence is a warning sign, not a trade trigger on its own.</p>
<div class="callout"><span class="badge">⚠️ Caution</span> "Overbought" does not mean "must fall" — in a strong trend, an oscillator can stay overbought/oversold for a long time. Oscillators work best in ranging markets and can mislead in strong trends.</div>`,
    `<span class="eyebrow">ATA301 · Chương 5 · Bài 5.1</span>
<h2>Chỉ báo dao động: RSI &amp; Stochastic</h2>
<h3>RSI (Relative Strength Index)</h3>
<pre><code>RSI = 100 − 100 / (1 + RS)
RS  = Trung bình tăng N phiên / Trung bình giảm N phiên

Minh hoạ RSI 14 phiên (trung bình GIẢ ĐỊNH):
 Trung bình tăng = 1.2, Trung bình giảm = 0.6
 RS = 1.2 / 0.6 = 2
 RSI = 100 − 100/(1+2) = 100 − 33.3 = 66.7
</code></pre>
<p>RSI dao động 0–100. Một mốc thường được nhắc tới (không đảm bảo): RSI &gt; 70 gợi ý "quá mua" và RSI &lt; 30 gợi ý "quá bán" — nghĩa là động lượng đã căng, không phải chắc chắn sắp đảo chiều.</p>
<h3>Chỉ báo Stochastic</h3>
<pre><code>%K = 100 × (Đóng cửa − Thấp nhất_N) / (Cao nhất_N − Thấp nhất_N)
%D = trung bình động (thường 3 phiên) của %K
</code></pre>
<p>Cũng dao động 0–100, với mốc 80/20 thường được dùng làm ngưỡng quá mua/quá bán.</p>
<h3>Phân kỳ (divergence)</h3>
<p><strong>Phân kỳ giảm (bearish)</strong> là khi giá tạo đỉnh cao hơn nhưng chỉ báo tạo đỉnh thấp hơn (động lượng đang yếu đi bên dưới bề mặt). <strong>Phân kỳ tăng (bullish)</strong> là trường hợp ngược lại ở đáy. Phân kỳ là dấu hiệu cảnh báo, không phải điểm vào lệnh tự thân.</p>
<div class="callout"><span class="badge">⚠️ Lưu ý</span> "Quá mua" không có nghĩa "phải giảm" — trong xu hướng mạnh, chỉ báo có thể ở vùng quá mua/quá bán rất lâu. Chỉ báo dao động hiệu quả nhất trong thị trường đi ngang và có thể gây hiểu lầm trong xu hướng mạnh.</div>`,
  ]]);

const c5q = quiz('ata301-quiz-5', 'Quiz 5 — RSI & Stochastic|||Quiz 5 — RSI & Stochastic', [
  { id: 'q1', question: 'RSI dao động trong khoảng giá trị nào?', options: ['-100 đến 100', '0 đến 100', '0 đến 1', 'Không giới hạn'], correctIndex: 1, explanation: 'RSI được chuẩn hoá dao động từ 0 đến 100.' },
  { id: 'q2', question: 'Mốc RSI nào thường được dùng để gợi ý vùng "quá mua"?', options: ['RSI < 30', 'RSI = 50', 'RSI > 70', 'RSI = 0'], correctIndex: 2, explanation: 'RSI trên 70 thường được đọc là vùng quá mua (overbought) — không đảm bảo giá sẽ giảm.' },
  { id: 'q3', question: 'Phân kỳ giảm (bearish divergence) xảy ra khi nào?', options: ['Giá và chỉ báo cùng tạo đỉnh cao hơn', 'Giá tạo đỉnh cao hơn nhưng chỉ báo tạo đỉnh thấp hơn', 'Giá và chỉ báo cùng đi ngang', 'Khối lượng tăng đột biến'], correctIndex: 1, explanation: 'Phân kỳ giảm: giá tạo đỉnh mới cao hơn nhưng chỉ báo động lượng lại tạo đỉnh thấp hơn — dấu hiệu động lượng suy yếu.' },
]);

const c6 = doc('ata301-6-1-volume', '6.1 — Volume & volume indicators|||6.1 — Khối lượng & các chỉ báo khối lượng',
  'Vai trò khối lượng xác nhận biến động giá, chỉ báo OBV (On-Balance Volume), hiện tượng đỉnh điểm khối lượng (volume climax).',
  [[
    `<span class="eyebrow">ATA301 · Chapter 6 · Lesson 6.1</span>
<h2>Volume &amp; volume indicators</h2>
<h3>Why volume matters</h3>
<p><strong>Volume</strong> is the number of shares/contracts traded in a period. It measures conviction: a price move on high volume reflects broad participation and is generally considered more significant than the same move on low (thin) volume.</p>
<h3>On-Balance Volume (OBV)</h3>
<pre><code>If today's close > yesterday's close: OBV = OBV_prev + Volume_today
If today's close < yesterday's close: OBV = OBV_prev − Volume_today
If unchanged: OBV = OBV_prev

Illustrative OBV (assumed volumes, starting OBV = 0):
 Day 1: close up,   volume 1,000 -> OBV =  1,000
 Day 2: close up,   volume   800 -> OBV =  1,800
 Day 3: close down, volume   500 -> OBV =  1,300
</code></pre>
<p>OBV is a running total that tries to reveal whether volume is flowing into or out of an asset; a rising OBV alongside a rising price is read as confirmation, while OBV diverging from price is read as a caution flag.</p>
<h3>Volume climax</h3>
<p>An unusually large volume spike at the end of a strong move ("climax") can mark exhaustion — the last wave of buyers/sellers piling in — though it is only a probabilistic clue, not a guaranteed turning point.</p>
<div class="callout"><span class="badge">⚠️ Caution</span> Volume data quality varies by market/broker feed, and volume alone never confirms direction — always read it alongside price action.</div>`,
    `<span class="eyebrow">ATA301 · Chương 6 · Bài 6.1</span>
<h2>Khối lượng &amp; các chỉ báo khối lượng</h2>
<h3>Vì sao khối lượng quan trọng</h3>
<p><strong>Khối lượng</strong> là số cổ phiếu/hợp đồng được giao dịch trong một phiên. Nó đo mức độ đồng thuận: một biến động giá đi kèm khối lượng lớn phản ánh sự tham gia rộng rãi và thường được xem là đáng tin hơn cùng biến động đó với khối lượng thấp (mỏng).</p>
<h3>OBV (On-Balance Volume)</h3>
<pre><code>Nếu đóng cửa hôm nay > hôm qua: OBV = OBV_trước + Khối lượng hôm nay
Nếu đóng cửa hôm nay < hôm qua: OBV = OBV_trước − Khối lượng hôm nay
Nếu không đổi: OBV = OBV_trước

Minh hoạ OBV (khối lượng GIẢ ĐỊNH, OBV bắt đầu = 0):
 Ngày 1: đóng cửa tăng, KL 1.000 -> OBV = 1.000
 Ngày 2: đóng cửa tăng, KL   800 -> OBV = 1.800
 Ngày 3: đóng cửa giảm, KL   500 -> OBV = 1.300
</code></pre>
<p>OBV là tổng cộng dồn cố gắng thể hiện dòng tiền/khối lượng đang vào hay ra khỏi một tài sản; OBV tăng cùng giá được đọc là xác nhận, còn OBV phân kỳ với giá được đọc là cờ cảnh báo.</p>
<h3>Đỉnh điểm khối lượng (volume climax)</h3>
<p>Một đợt tăng vọt khối lượng bất thường ở cuối một nhịp tăng/giảm mạnh ("climax") có thể đánh dấu sự cạn kiệt — đợt sóng cuối cùng của bên mua/bán dồn vào — dù đây chỉ là gợi ý xác suất, không phải điểm đảo chiều đảm bảo.</p>
<div class="callout"><span class="badge">⚠️ Lưu ý</span> Chất lượng dữ liệu khối lượng khác nhau tuỳ thị trường/nguồn dữ liệu, và khối lượng một mình không bao giờ xác nhận được hướng đi — luôn đọc cùng hành động giá.</div>`,
  ]]);

const c6q = quiz('ata301-quiz-6', 'Quiz 6 — Volume|||Quiz 6 — Khối lượng', [
  { id: 'q1', question: 'Một biến động giá đi kèm khối lượng LỚN thường được xem là gì so với cùng biến động đó với khối lượng thấp?', options: ['Kém tin cậy hơn', 'Đáng tin hơn, phản ánh sự đồng thuận rộng', 'Không có ý nghĩa gì khác', 'Luôn là tín hiệu bán'], correctIndex: 1, explanation: 'Khối lượng lớn phản ánh sự tham gia rộng rãi, thường được xem là xác nhận đáng tin hơn cho biến động giá.' },
  { id: 'q2', question: 'Chỉ báo OBV được tính bằng cách nào?', options: ['Trung bình khối lượng N phiên', 'Cộng dồn khối lượng khi giá tăng, trừ dồn khi giá giảm', 'RSI nhân với khối lượng', 'Khối lượng chia cho giá đóng cửa'], correctIndex: 1, explanation: 'OBV là tổng cộng dồn: cộng khối lượng ngày giá tăng, trừ khối lượng ngày giá giảm.' },
  { id: 'q3', question: '"Đỉnh điểm khối lượng" (volume climax) ở cuối một nhịp tăng mạnh có thể gợi ý điều gì?', options: ['Xu hướng chắc chắn sẽ tiếp diễn mãi', 'Sự cạn kiệt của bên mua/bán, một gợi ý xác suất chứ không đảm bảo', 'Không có ý nghĩa gì', 'Khối lượng dữ liệu bị lỗi'], correctIndex: 1, explanation: 'Volume climax có thể đánh dấu đợt sóng cuối cùng dồn vào trước khi cạn lực — nhưng chỉ là gợi ý xác suất.' },
]);

const c7 = doc('ata301-7-1-elliott-fibonacci', '7.1 — Elliott Wave Theory & Fibonacci|||7.1 — Lý thuyết sóng Elliott & Fibonacci',
  'Cấu trúc 5 sóng đẩy + 3 sóng điều chỉnh, các mốc Fibonacci retracement (23.6/38.2/50/61.8%) và extension (127.2/161.8%).',
  [[
    `<span class="eyebrow">ATA301 · Chapter 7 · Lesson 7.1</span>
<h2>Elliott Wave Theory &amp; Fibonacci</h2>
<h3>Elliott Wave structure</h3>
<p>Ralph Nelson Elliott proposed that crowd psychology moves in repeating wave patterns: a <strong>5-wave impulse</strong> in the direction of the larger trend (waves 1-3-5 moving with the trend, waves 2-4 correcting against it), followed by a <strong>3-wave correction</strong> (labeled A-B-C).</p>
<pre><code>Impulse (with the trend):  1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; 5
Correction (against it):   A -&gt; B -&gt; C
Rule of thumb: wave 3 is often the longest and is never the shortest
of waves 1, 3, 5 (a guideline, not a law of nature).
</code></pre>
<h3>Fibonacci retracement</h3>
<p>Derived from the Fibonacci sequence, commonly-used retracement levels are <strong>23.6%, 38.2%, 50%, 61.8%</strong> — the percentage a price move "gives back" before (possibly) resuming.</p>
<pre><code>Illustrative retracement (assumed swing, not a signal):
 Swing low = 100, Swing high = 150 (range = 50)
 38.2% retracement = 150 − 0.382×50 = 130.9
 61.8% retracement = 150 − 0.618×50 = 119.1
</code></pre>
<h3>Fibonacci extension</h3>
<p>Extension levels (commonly <strong>127.2%, 161.8%</strong>) project where a move might extend TO beyond the prior swing, often used to frame a potential target zone.</p>
<div class="callout"><span class="badge">⚠️ Caution</span> Elliott Wave counts are notoriously subjective — analysts often disagree on which wave the market is "in," and a count can be re-labeled after the fact. Fibonacci levels are watched by many traders (a self-fulfilling element), not a law of physics.</div>`,
    `<span class="eyebrow">ATA301 · Chương 7 · Bài 7.1</span>
<h2>Lý thuyết sóng Elliott &amp; Fibonacci</h2>
<h3>Cấu trúc sóng Elliott</h3>
<p>Ralph Nelson Elliott cho rằng tâm lý đám đông di chuyển theo mô hình sóng lặp lại: một <strong>sóng đẩy 5 nhịp</strong> theo hướng xu hướng lớn (sóng 1-3-5 đi theo xu hướng, sóng 2-4 điều chỉnh ngược lại), theo sau là một <strong>sóng điều chỉnh 3 nhịp</strong> (ký hiệu A-B-C).</p>
<pre><code>Sóng đẩy (theo xu hướng):   1 -&gt; 2 -&gt; 3 -&gt; 4 -&gt; 5
Sóng điều chỉnh (ngược lại): A -&gt; B -&gt; C
Nguyên tắc thường gặp: sóng 3 thường là sóng dài nhất và không bao
giờ là sóng ngắn nhất trong ba sóng 1, 3, 5 (chỉ là hướng dẫn, không
phải quy luật tuyệt đối).
</code></pre>
<h3>Fibonacci retracement (thoái lui)</h3>
<p>Bắt nguồn từ dãy số Fibonacci, các mốc thoái lui thường dùng là <strong>23,6% · 38,2% · 50% · 61,8%</strong> — tỉ lệ phần trăm mà giá "trả lại" trước khi (có thể) tiếp diễn.</p>
<pre><code>Minh hoạ thoái lui (nhịp GIẢ ĐỊNH, không phải tín hiệu):
 Đáy nhịp = 100, Đỉnh nhịp = 150 (biên độ = 50)
 Thoái lui 38,2% = 150 − 0,382×50 = 130,9
 Thoái lui 61,8% = 150 − 0,618×50 = 119,1
</code></pre>
<h3>Fibonacci extension (mở rộng)</h3>
<p>Các mốc mở rộng (thường dùng <strong>127,2% · 161,8%</strong>) chiếu ra nơi một nhịp giá có thể đi TỚI vượt qua nhịp trước đó, thường dùng để khoanh vùng mục tiêu tiềm năng.</p>
<div class="callout"><span class="badge">⚠️ Lưu ý</span> Đếm sóng Elliott nổi tiếng mang tính chủ quan — các nhà phân tích thường bất đồng về việc thị trường "đang ở sóng nào", và một cách đếm có thể bị gán nhãn lại sau khi sự việc đã xảy ra. Mốc Fibonacci được nhiều trader theo dõi (có yếu tố tự ứng nghiệm), không phải quy luật vật lý.</div>`,
  ]]);

const c7q = quiz('ata301-quiz-7', 'Quiz 7 — Elliott & Fibonacci|||Quiz 7 — Elliott & Fibonacci', [
  { id: 'q1', question: 'Theo lý thuyết sóng Elliott, một chu kỳ đầy đủ gồm bao nhiêu sóng đẩy và bao nhiêu sóng điều chỉnh?', options: ['3 sóng đẩy, 5 sóng điều chỉnh', '5 sóng đẩy, 3 sóng điều chỉnh', '8 sóng đẩy, 0 sóng điều chỉnh', '2 sóng đẩy, 2 sóng điều chỉnh'], correctIndex: 1, explanation: 'Cấu trúc kinh điển: 5 sóng đẩy theo xu hướng (1-2-3-4-5) rồi tới 3 sóng điều chỉnh (A-B-C).' },
  { id: 'q2', question: 'Mốc Fibonacci retracement nào KHÔNG nằm trong nhóm thường dùng?', options: ['38,2%', '50%', '61,8%', '99%'], correctIndex: 3, explanation: 'Các mốc thường dùng là 23,6% · 38,2% · 50% · 61,8%; 99% không phải mốc Fibonacci tiêu chuẩn.' },
  { id: 'q3', question: 'Vì sao việc đếm sóng Elliott bị xem là hạn chế lớn của công cụ này?', options: ['Vì luôn cho tín hiệu chính xác', 'Vì mang tính chủ quan, dễ bị gán nhãn lại sau khi giá đã đi', 'Vì không dùng được với cổ phiếu', 'Vì không liên quan tới tâm lý thị trường'], correctIndex: 1, explanation: 'Đếm sóng Elliott chủ quan — các nhà phân tích khác nhau có thể đếm khác nhau, và cách đếm hay bị điều chỉnh lại sau khi biết kết quả thực tế.' },
]);

const c8 = doc('ata301-8-1-trading-system-risk', '8.1 — Building a trading system, risk management & psychology|||8.1 — Xây dựng hệ thống giao dịch, quản lý rủi ro & tâm lý',
  'Thành phần kế hoạch giao dịch (vào/ra/khối lượng), tỉ lệ risk/reward, nguyên tắc rủi ro mỗi lệnh, tâm lý giao dịch, cảnh báo rủi ro toàn diện.',
  [[
    `<span class="eyebrow">ATA301 · Chapter 8 · Lesson 8.1</span>
<h2>Building a trading system, risk management &amp; psychology</h2>
<h3>A written trading plan needs</h3>
<ul>
<li><strong>Entry rule</strong> — the specific, repeatable condition that triggers a trade (e.g. a defined pattern/indicator combination).</li>
<li><strong>Exit rule</strong> — both a stop-loss (where you're wrong) and a take-profit or trailing rule (where you bank gains).</li>
<li><strong>Position sizing</strong> — how much capital/how many shares to risk per trade.</li>
</ul>
<h3>Risk/reward &amp; the "risk per trade" rule</h3>
<p>A widely-taught guideline (not a guarantee of profit) is to risk only a small, fixed percentage of capital per trade — commonly cited examples are <strong>1% or 2%</strong> — so that a string of losses does not wipe out the account.</p>
<pre><code>Illustrative position sizing (assumed numbers):
 Account = 10,000,000 VND, Risk per trade = 1% = 100,000 VND
 Entry = 50,000, Stop-loss = 48,000 -> risk/share = 2,000
 Position size = 100,000 / 2,000 = 50 shares

Risk/reward ratio:
 Risk = Entry − Stop-loss = 2,000
 Reward = Target − Entry  = 6,000 (assumed target)
 R:R = 6,000 / 2,000 = 3:1
</code></pre>
<h3>Trading psychology</h3>
<p>Common pitfalls: <strong>FOMO</strong> (chasing a move already underway), <strong>revenge trading</strong> (oversizing after a loss to "win it back"), and <strong>overconfidence</strong> after a winning streak. A written plan followed with discipline — sized and risk-checked BEFORE entering — is the main defense against these emotional errors.</p>
<div class="callout"><span class="badge">⚠️ Full risk disclosure</span> Everything in ATA301 is <strong>educational</strong>. No number, pattern or indicator in this course is a recommendation to buy, sell, or hold any specific asset. Technical analysis does not guarantee profit; backtested results do not guarantee future performance; trading and investing carry a real risk of loss, including loss of principal. Practice on paper/demo accounts before risking real capital, and consider seeking advice from a licensed professional for actual investment decisions.</div>`,
    `<span class="eyebrow">ATA301 · Chương 8 · Bài 8.1</span>
<h2>Xây dựng hệ thống giao dịch, quản lý rủi ro &amp; tâm lý</h2>
<h3>Một kế hoạch giao dịch viết ra cần có</h3>
<ul>
<li><strong>Quy tắc vào lệnh</strong> — điều kiện cụ thể, lặp lại được để kích hoạt một giao dịch (vd tổ hợp mô hình/chỉ báo đã định nghĩa rõ).</li>
<li><strong>Quy tắc thoát lệnh</strong> — gồm cả cắt lỗ (stop-loss, nơi bạn thừa nhận sai) và chốt lời hoặc trailing (nơi bạn giữ lợi nhuận).</li>
<li><strong>Quản lý khối lượng lệnh (position sizing)</strong> — bao nhiêu vốn/bao nhiêu cổ phiếu rủi ro cho mỗi lệnh.</li>
</ul>
<h3>Tỉ lệ Risk/Reward &amp; nguyên tắc "rủi ro mỗi lệnh"</h3>
<p>Một hướng dẫn phổ biến (không đảm bảo lợi nhuận) là chỉ chấp nhận rủi ro một tỉ lệ nhỏ, cố định của vốn cho mỗi lệnh — ví dụ thường được nhắc là <strong>1% hoặc 2%</strong> — để một chuỗi lệnh thua không xoá sạch tài khoản.</p>
<pre><code>Minh hoạ tính khối lượng lệnh (số GIẢ ĐỊNH):
 Vốn = 10.000.000đ, Rủi ro mỗi lệnh = 1% = 100.000đ
 Giá vào = 50.000, Cắt lỗ = 48.000 -> rủi ro/cổ phiếu = 2.000
 Khối lượng = 100.000 / 2.000 = 50 cổ phiếu

Tỉ lệ Risk/Reward:
 Rủi ro = Giá vào − Cắt lỗ = 2.000
 Lợi nhuận kỳ vọng = Mục tiêu − Giá vào = 6.000 (mục tiêu giả định)
 R:R = 6.000 / 2.000 = 3:1
</code></pre>
<h3>Tâm lý giao dịch</h3>
<p>Các bẫy thường gặp: <strong>FOMO</strong> (đuổi theo một nhịp giá đã chạy), <strong>giao dịch trả thù (revenge trading)</strong> (vào lệnh quá lớn sau một lần thua để "gỡ lại"), và <strong>tự tin thái quá</strong> sau chuỗi thắng. Một kế hoạch viết sẵn, tuân thủ kỷ luật — tính khối lượng và kiểm tra rủi ro TRƯỚC khi vào lệnh — là tuyến phòng thủ chính trước các sai lầm cảm tính này.</p>
<div class="callout"><span class="badge">⚠️ Cảnh báo rủi ro toàn diện</span> Toàn bộ ATA301 mang tính <strong>giáo dục</strong>. Không con số, mô hình hay chỉ báo nào trong môn này là khuyến nghị mua, bán hay nắm giữ một tài sản cụ thể. Phân tích kỹ thuật không đảm bảo lợi nhuận; kết quả kiểm thử lịch sử (backtest) không đảm bảo hiệu suất tương lai; giao dịch và đầu tư luôn có rủi ro mất vốn thực sự, kể cả mất vốn gốc. Hãy luyện tập trên tài khoản demo/paper trước khi dùng vốn thật, và cân nhắc tìm tư vấn từ chuyên gia được cấp phép cho quyết định đầu tư thực tế.</div>`,
  ]]);

const c8q = quiz('ata301-quiz-8', 'Quiz 8 — Trading system & risk|||Quiz 8 — Hệ thống giao dịch & rủi ro', [
  { id: 'q1', question: 'Nguyên tắc "rủi ro mỗi lệnh" (ví dụ 1-2% vốn) nhằm mục đích gì?', options: ['Đảm bảo lệnh nào cũng thắng', 'Ngăn một chuỗi lệnh thua xoá sạch tài khoản', 'Tăng tối đa khối lượng mỗi lệnh', 'Loại bỏ hoàn toàn rủi ro'], correctIndex: 1, explanation: 'Giới hạn rủi ro mỗi lệnh ở một tỉ lệ nhỏ, cố định giúp một chuỗi thua không làm cạn vốn — không đảm bảo lệnh nào cũng thắng.' },
  { id: 'q2', question: '"Giao dịch trả thù" (revenge trading) là bẫy tâm lý nào?', options: ['Vào lệnh quá lớn sau một lần thua để cố gỡ lại', 'Luôn tuân thủ kế hoạch đã viết', 'Chốt lời quá sớm', 'Không liên quan tới tâm lý'], correctIndex: 0, explanation: 'Revenge trading là việc vào lệnh với khối lượng lớn bất thường sau một lần thua nhằm gỡ lại nhanh, thường dẫn tới rủi ro cao hơn.' },
  { id: 'q3', question: 'Theo cảnh báo rủi ro của môn ATA301, nội dung môn học có phải là khuyến nghị đầu tư không?', options: ['Có, nên làm theo để chắc chắn có lãi', 'Không — mang tính giáo dục, không đảm bảo lợi nhuận và có rủi ro mất vốn', 'Chỉ đúng với cổ phiếu Việt Nam', 'Chỉ áp dụng khi dùng phần mềm trả phí'], correctIndex: 1, explanation: 'Môn học nêu rõ: nội dung mang tính giáo dục, không phải khuyến nghị đầu tư, không đảm bảo lợi nhuận, và giao dịch luôn có rủi ro mất vốn.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'ATA301',
    slug: 'ata301-applied-technical-analysis',
    title: 'Applied Technical Analysis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ATA301.webp',
    shortDescription: 'Reading price charts & indicators: Dow Theory, chart patterns, trend/support-resistance, MA/MACD, RSI/Stochastic, volume, Elliott Wave & Fibonacci, risk-managed trading systems. Bilingual, educational, not investment advice.|||Đọc biểu đồ giá & chỉ báo: lý thuyết Dow, mô hình biểu đồ, xu hướng/hỗ trợ-kháng cự, MA/MACD, RSI/Stochastic, khối lượng, sóng Elliott & Fibonacci, hệ thống giao dịch có quản lý rủi ro. Song ngữ, giáo dục, không phải lời khuyên đầu tư.',
    description: 'Môn <strong>ATA301 — Applied Technical Analysis</strong> (kỳ 3, khối Quản trị Kinh doanh) dạy cách đọc <strong>biểu đồ giá &amp; chỉ báo</strong> để nghiên cứu hành vi thị trường. Từ <strong>lý thuyết Dow</strong> → <strong>biểu đồ &amp; mô hình giá</strong> (nến Nhật, đảo chiều/tiếp diễn) → <strong>xu hướng, hỗ trợ/kháng cự</strong> → <strong>chỉ báo xu hướng</strong> (MA, MACD) → <strong>chỉ báo dao động</strong> (RSI, Stochastic) → <strong>khối lượng</strong> → <strong>sóng Elliott &amp; Fibonacci</strong> → <strong>xây hệ thống giao dịch có quản lý rủi ro</strong>. Bám các giáo trình kinh điển (Murphy, Pring, Edwards/Magee, CMT), song ngữ, có ví dụ tính toán (số giả định) và quiz mỗi chương. <strong>Mang tính giáo dục, không phải khuyến nghị đầu tư.</strong>',
    whatYouLearn: 'Ba tiền đề & lý thuyết Dow (ba xu hướng, ba pha); các loại biểu đồ & mô hình giá (đảo chiều/tiếp diễn); xu hướng, hỗ trợ/kháng cự, đường xu hướng, kênh giá; MA/EMA, giao cắt vàng/tử thần, MACD; RSI, Stochastic, phân kỳ; khối lượng & OBV; sóng Elliott, Fibonacci retracement/extension; xây kế hoạch giao dịch, position sizing, risk/reward, tâm lý giao dịch & quản lý rủi ro.',
    requirements: 'Kiến thức tài chính/kinh tế cơ bản (không bắt buộc). Nên có tài khoản demo/paper trading (TradingView, Investing.com) để thực hành đọc biểu đồ, KHÔNG dùng vốn thật khi còn học.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách kinh điển, tài liệu chính thức, YouTube, công cụ biểu đồ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Phân tích kỹ thuật là gì, ba tiền đề, so với phân tích cơ bản.', lessons: [intro] },
    { title: 'Chương 1 — Cơ sở & lý thuyết Dow|||Chapter 1 — Foundations & Dow Theory', description: 'Ba tiền đề, sáu nguyên lý Dow, ba pha xu hướng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Biểu đồ & mô hình giá|||Chapter 2 — Charts & price patterns', description: 'Nến Nhật, mô hình đảo chiều & tiếp diễn.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xu hướng, hỗ trợ/kháng cự|||Chapter 3 — Trend, support/resistance', description: 'Xu hướng, hỗ trợ/kháng cự, đường xu hướng, kênh giá.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chỉ báo xu hướng (MA, MACD)|||Chapter 4 — Trend indicators (MA, MACD)', description: 'SMA/EMA, giao cắt vàng/tử thần, MACD.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chỉ báo dao động (RSI, Stochastic)|||Chapter 5 — Oscillators (RSI, Stochastic)', description: 'RSI, Stochastic, phân kỳ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Khối lượng & chỉ báo khối lượng|||Chapter 6 — Volume & volume indicators', description: 'Vai trò khối lượng, OBV, volume climax.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sóng Elliott & Fibonacci|||Chapter 7 — Elliott Wave & Fibonacci', description: 'Cấu trúc sóng, retracement, extension.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hệ thống giao dịch & quản lý rủi ro|||Chapter 8 — Trading system & risk management', description: 'Kế hoạch giao dịch, risk/reward, tâm lý, cảnh báo rủi ro.', lessons: [c8, c8q] },
  ],
};
