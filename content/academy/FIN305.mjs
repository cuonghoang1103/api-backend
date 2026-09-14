/**
 * FIN305 — Technical Analysis. Giáo trình FLM (syl), khối Quản trị Kinh doanh,
 * Kỳ 3. Trích dẫn: Murphy "Technical Analysis of the Financial Markets",
 * Pring "Technical Analysis Explained", Kirkpatrick "Technical Analysis"
 * (CMT) — KHÔNG upload PDF. Môn này thiên NỀN TẢNG/LÝ THUYẾT phân tích kỹ
 * thuật; môn ATA301 (Applied Technical Analysis) thiên ỨNG DỤNG — tránh
 * trùng lặp. Số liệu trong ví dụ/công thức đều là số GIẢ ĐỊNH để minh hoạ
 * cách tính, KHÔNG phải khuyến nghị đầu tư. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('fin305-0-1-overview', 'Course overview: Technical Analysis foundations|||Tổng quan: Nền tảng Phân tích kỹ thuật',
  'Phân tích kỹ thuật là gì, khác gì phân tích cơ bản; ba giả định nền tảng; FIN305 (lý thuyết nền) khác ATA301 (ứng dụng) thế nào; lộ trình 8 chương; cảnh báo rủi ro.',
  [[
    `<span class="eyebrow">FIN305 · Lesson 0.1 · Overview</span>
<h2>Technical Analysis foundations</h2>
<p class="lead"><strong>Technical analysis (TA)</strong> studies past price and volume action on a chart to infer probable future price behavior — as opposed to <strong>fundamental analysis</strong>, which studies a company's financial statements, industry and macro conditions. TA does not try to answer "is this asset cheap or expensive"; it tries to answer "what is the crowd of buyers and sellers doing right now, and where might that push price next."</p>
<h3>Three founding assumptions</h3>
<ul>
<li><strong>The market discounts everything</strong> — all known information (fundamentals, news, sentiment) is already reflected in the current price, so studying price itself is enough.</li>
<li><strong>Price moves in trends</strong> — once established, a trend is more likely to continue than reverse, until a clear signal says otherwise.</li>
<li><strong>History tends to repeat itself</strong> — because market participants react to similar situations in similar (psychological) ways, recognizable patterns recur.</li>
</ul>
<h3>FIN305 vs ATA301 — not a repeat</h3>
<p><strong>FIN305 (this course)</strong> builds the <em>theoretical foundation</em>: Dow Theory, chart construction, trend/support-resistance theory, the mechanics and formulas behind common indicators, volume theory and risk-management principles. <strong>ATA301 — Applied Technical Analysis</strong> is a separate, later course that focuses on <em>applying</em> these tools to real trading setups, strategy backtesting and case studies. Study FIN305 first to understand <em>why</em> a tool works before ATA301 teaches <em>how</em> to trade with it.</p>
<h3>Roadmap</h3>
<p>Dow Theory &amp; TA foundations → charts &amp; timeframes → trend/trendlines/channels → support-resistance &amp; price patterns → trend indicators (MA, MACD, ADX) → momentum oscillators (RSI, Stochastic, CCI) → volume theory &amp; market psychology → combining tools &amp; risk management.</p>
<div class="callout"><span class="badge">Risk disclosure</span> Every example number in this course is <strong>assumed</strong>, for illustrating a calculation only. Technical analysis does not guarantee profit; past patterns do not guarantee future results. Nothing here is investment advice.</div>`,
    `<span class="eyebrow">FIN305 · Bài 0.1 · Tổng quan</span>
<h2>Nền tảng Phân tích kỹ thuật</h2>
<p class="lead"><strong>Phân tích kỹ thuật (Technical Analysis — TA)</strong> nghiên cứu diễn biến giá và khối lượng trong quá khứ trên biểu đồ để suy đoán khả năng vận động giá trong tương lai — khác với <strong>phân tích cơ bản</strong>, vốn nghiên cứu báo cáo tài chính, ngành và vĩ mô. TA không trả lời "tài sản này rẻ hay đắt"; nó trả lời "đám đông người mua-người bán đang làm gì, và giá có thể đi về đâu tiếp theo".</p>
<h3>Ba giả định nền tảng</h3>
<ul>
<li><strong>Thị trường đã phản ánh tất cả</strong> — mọi thông tin đã biết (tài chính, tin tức, tâm lý) đã nằm trong giá hiện tại, nên chỉ cần nghiên cứu giá là đủ.</li>
<li><strong>Giá vận động theo xu hướng</strong> — một khi đã hình thành, xu hướng có xu hướng tiếp diễn nhiều hơn đảo chiều, cho đến khi có tín hiệu rõ ràng ngược lại.</li>
<li><strong>Lịch sử có xu hướng lặp lại</strong> — vì người tham gia thị trường phản ứng theo cách tâm lý tương tự trước các tình huống tương tự, nên các mô hình có thể nhận diện được sẽ lặp lại.</li>
</ul>
<h3>FIN305 khác ATA301 — không trùng lặp</h3>
<p><strong>FIN305 (môn này)</strong> dựng <em>nền tảng lý thuyết</em>: lý thuyết Dow, cách vẽ biểu đồ, lý thuyết xu hướng/hỗ trợ-kháng cự, cơ chế và công thức phía sau các chỉ báo phổ biến, lý thuyết khối lượng và nguyên tắc quản trị rủi ro. <strong>ATA301 — Applied Technical Analysis</strong> là môn riêng, học sau, tập trung <em>ứng dụng</em> các công cụ này vào tình huống giao dịch thật, kiểm định chiến lược (backtest) và case study. Học FIN305 trước để hiểu <em>vì sao</em> công cụ đó hoạt động, trước khi ATA301 dạy <em>cách</em> dùng nó để giao dịch.</p>
<h3>Lộ trình</h3>
<p>Lý thuyết Dow &amp; nền tảng TA → biểu đồ &amp; khung thời gian → xu hướng/đường xu hướng/kênh giá → hỗ trợ-kháng cự &amp; mô hình giá → chỉ báo xu hướng (MA, MACD, ADX) → chỉ báo động lượng (RSI, Stochastic, CCI) → lý thuyết khối lượng &amp; tâm lý thị trường → kết hợp công cụ &amp; quản trị rủi ro.</p>
<div class="callout"><span class="badge">Cảnh báo rủi ro</span> Mọi số liệu ví dụ trong môn đều là số <strong>GIẢ ĐỊNH</strong>, chỉ để minh hoạ cách tính. Phân tích kỹ thuật KHÔNG bảo đảm lợi nhuận; mô hình quá khứ KHÔNG bảo đảm kết quả tương lai. Không có nội dung nào ở đây là khuyến nghị đầu tư.</div>`,
  ]]);

const c1 = doc('fin305-1-1-dow-theory', '1.1 — TA foundations & Dow Theory|||1.1 — Nền tảng TA & Lý thuyết Dow',
  'Ba giả định của TA; sáu nguyên lý lý thuyết Dow: ba loại xu hướng, ba giai đoạn xu hướng chính, chỉ số phải xác nhận nhau, khối lượng xác nhận xu hướng, xu hướng tồn tại đến khi có tín hiệu đảo rõ ràng.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 1 · Lesson 1.1</span>
<h2>TA foundations &amp; Dow Theory</h2>
<p>Charles Dow's ideas, later organized into <strong>Dow Theory</strong>, are the historical root of nearly all modern technical analysis (Murphy, ch.2; Pring, ch.3).</p>
<h3>Three degrees of trend</h3>
<ul>
<li><strong>Primary trend</strong> — the broad, multi-month to multi-year move (the "tide").</li>
<li><strong>Secondary (intermediate) trend</strong> — corrections against the primary trend, lasting weeks to months (the "waves").</li>
<li><strong>Minor trend</strong> — short-term noise lasting days, usually not tradeable on its own (the "ripples").</li>
</ul>
<h3>Three phases of a primary trend</h3>
<pre><code>1. Accumulation   -> informed participants quietly build positions; price is flat/range-bound
2. Public participation -> the broad trend becomes visible; most of the price move happens here
3. Distribution   -> early participants begin exiting into strength; momentum starts to fade
</code></pre>
<h3>Other Dow Theory tenets</h3>
<ul>
<li><strong>Averages must confirm each other</strong> — Dow used two averages (industrials and rail transports); a signal is stronger when both agree.</li>
<li><strong>Volume must confirm the trend</strong> — volume should expand in the direction of the primary trend and contract on corrections.</li>
<li><strong>A trend is assumed to continue</strong> until clear reversal signals appear — this is a probabilistic assumption, not a certainty.</li>
</ul>
<div class="callout"><span class="badge">Limitation</span> Dow Theory tends to identify a trend only after it is already underway, and works best in liquid, broad markets — it is a framework for probability, not a guarantee.</div>`,
    `<span class="eyebrow">FIN305 · Chương 1 · Bài 1.1</span>
<h2>Nền tảng TA &amp; Lý thuyết Dow</h2>
<p>Các ý tưởng của Charles Dow, sau này được hệ thống thành <strong>Lý thuyết Dow</strong>, là gốc lịch sử của gần như mọi phân tích kỹ thuật hiện đại (Murphy, ch.2; Pring, ch.3).</p>
<h3>Ba cấp độ xu hướng</h3>
<ul>
<li><strong>Xu hướng chính (primary)</strong> — vận động rộng, kéo dài nhiều tháng đến nhiều năm (như "thuỷ triều").</li>
<li><strong>Xu hướng trung gian (secondary)</strong> — các đợt điều chỉnh ngược xu hướng chính, kéo dài vài tuần đến vài tháng (như "con sóng").</li>
<li><strong>Xu hướng phụ (minor)</strong> — nhiễu ngắn hạn kéo dài vài ngày, thường không đủ để giao dịch riêng (như "gợn sóng nhỏ").</li>
</ul>
<h3>Ba giai đoạn của xu hướng chính</h3>
<pre><code>1. Tích luỹ (accumulation) -> bên nắm thông tin âm thầm gom hàng; giá đi ngang/hẹp
2. Tham gia đại chúng (public participation) -> xu hướng trở nên rõ ràng; phần lớn biến động giá xảy ra ở đây
3. Phân phối (distribution) -> bên vào sớm bắt đầu thoát hàng vào lúc giá mạnh; động lượng bắt đầu yếu đi
</code></pre>
<h3>Các nguyên lý khác của lý thuyết Dow</h3>
<ul>
<li><strong>Các chỉ số phải xác nhận nhau</strong> — Dow dùng hai chỉ số (công nghiệp và vận tải đường sắt); tín hiệu mạnh hơn khi cả hai đồng thuận.</li>
<li><strong>Khối lượng phải xác nhận xu hướng</strong> — khối lượng nên tăng theo hướng xu hướng chính và giảm khi điều chỉnh.</li>
<li><strong>Xu hướng được giả định tiếp diễn</strong> cho đến khi có tín hiệu đảo chiều rõ ràng — đây là giả định xác suất, không phải chắc chắn.</li>
</ul>
<div class="callout"><span class="badge">Hạn chế</span> Lý thuyết Dow thường chỉ nhận ra xu hướng sau khi nó đã diễn ra một phần, và hoạt động tốt nhất ở thị trường rộng, thanh khoản cao — đây là khung xác suất, không phải bảo đảm.</div>`,
  ]]);

const c1q = quiz('fin305-quiz-1', 'Quiz 1 — Dow Theory|||Quiz 1 — Lý thuyết Dow', [
  { id: 'q1', question: 'Theo lý thuyết Dow, xu hướng "chính" (primary) được ví như gì?', options: ['Gợn sóng nhỏ', 'Con sóng', 'Thuỷ triều', 'Cơn gió'], correctIndex: 2, explanation: 'Xu hướng chính kéo dài nhiều tháng-năm, ví như thuỷ triều; trung gian là sóng, phụ là gợn sóng.' },
  { id: 'q2', question: 'Giai đoạn nào của xu hướng chính diễn ra phần LỚN biến động giá?', options: ['Tích luỹ', 'Tham gia đại chúng', 'Phân phối', 'Không giai đoạn nào'], correctIndex: 1, explanation: 'Giai đoạn tham gia đại chúng là lúc xu hướng rõ ràng và phần lớn biến động giá xảy ra.' },
  { id: 'q3', question: 'Một trong ba giả định nền tảng của TA là?', options: ['Báo cáo tài chính quyết định giá', 'Thị trường đã phản ánh mọi thông tin đã biết', 'Giá luôn ngẫu nhiên, không có mẫu hình', 'Khối lượng không liên quan tới xu hướng'], correctIndex: 1, explanation: '"Thị trường đã discount tất cả" là một trong ba giả định nền tảng của phân tích kỹ thuật.' },
]);

const c2 = doc('fin305-2-1-charts-timeframes', '2.1 — Charts & timeframes|||2.1 — Biểu đồ & khung thời gian',
  'Ba loại biểu đồ (line, bar OHLC, candlestick); giải phẫu nến; khung thời gian (M1-H4, ngày, tuần, tháng) theo khung nhìn giao dịch; thang giá arithmetic vs logarithmic.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 2 · Lesson 2.1</span>
<h2>Charts &amp; timeframes</h2>
<h3>Three chart types</h3>
<ul>
<li><strong>Line chart</strong> — connects closing prices only; simplest, good for a quick overview of the broad trend.</li>
<li><strong>Bar chart (OHLC)</strong> — each bar shows Open, High, Low, Close as tick marks; more detail than a line.</li>
<li><strong>Candlestick chart</strong> — the most widely used in TA; a "body" spans open-to-close, "wicks/shadows" show the high/low extremes.</li>
</ul>
<h3>Candle anatomy (assumed numbers)</h3>
<pre><code>Assume: Open = 50, High = 55, Low = 48, Close = 53
 Close (53) &gt; Open (50) -&gt; bullish candle (body drawn hollow/green by convention)
 Upper wick = High - Close = 55 - 53 = 2
 Lower wick = Open - Low  = 50 - 48 = 2
 Body size  = Close - Open = 53 - 50 = 3
</code></pre>
<h3>Timeframes</h3>
<p>The same instrument looks different depending on the <strong>timeframe</strong> — the period each candle/bar represents:</p>
<ul>
<li><strong>Intraday (M1-H4)</strong> — for scalping/day trading; noisy, many false signals.</li>
<li><strong>Daily (D1)</strong> — the most commonly studied timeframe for swing analysis.</li>
<li><strong>Weekly/Monthly</strong> — for position/long-term analysis; smooths out short-term noise.</li>
</ul>
<h3>Scale: arithmetic vs logarithmic</h3>
<p>An <strong>arithmetic scale</strong> spaces equal price amounts equally; a <strong>logarithmic scale</strong> spaces equal <em>percentage</em> moves equally — preferred over long histories or wide price ranges, where a move from 10 to 20 (100%) should look as significant as 100 to 200 (100%).</p>
<div class="callout"><span class="badge">Practice tip</span> Match the timeframe to your horizon: analyzing a multi-week decision on a 1-minute chart is a common beginner mistake.</div>`,
    `<span class="eyebrow">FIN305 · Chương 2 · Bài 2.1</span>
<h2>Biểu đồ &amp; khung thời gian</h2>
<h3>Ba loại biểu đồ</h3>
<ul>
<li><strong>Biểu đồ đường (line)</strong> — chỉ nối giá đóng cửa; đơn giản nhất, phù hợp nhìn nhanh xu hướng rộng.</li>
<li><strong>Biểu đồ thanh (bar/OHLC)</strong> — mỗi thanh thể hiện Open, High, Low, Close bằng các vạch; chi tiết hơn line.</li>
<li><strong>Biểu đồ nến (candlestick)</strong> — dùng phổ biến nhất trong TA; "thân nến" trải từ open đến close, "bóng nến" thể hiện mức cao/thấp nhất.</li>
</ul>
<h3>Giải phẫu nến (số giả định)</h3>
<pre><code>Giả định: Open = 50, High = 55, Low = 48, Close = 53
 Close (53) &gt; Open (50) -&gt; nến tăng (theo quy ước thường vẽ rỗng/xanh)
 Bóng trên = High - Close = 55 - 53 = 2
 Bóng dưới = Open - Low  = 50 - 48 = 2
 Thân nến  = Close - Open = 53 - 50 = 3
</code></pre>
<h3>Khung thời gian</h3>
<p>Cùng một tài sản sẽ trông khác nhau tuỳ <strong>khung thời gian</strong> — chu kỳ mỗi nến/thanh đại diện:</p>
<ul>
<li><strong>Trong ngày (M1-H4)</strong> — cho scalping/day trading; nhiều nhiễu, tín hiệu giả nhiều.</li>
<li><strong>Ngày (D1)</strong> — khung được nghiên cứu phổ biến nhất cho phân tích swing.</li>
<li><strong>Tuần/Tháng</strong> — cho phân tích dài hạn/position; làm mượt nhiễu ngắn hạn.</li>
</ul>
<h3>Thang giá: arithmetic vs logarithmic</h3>
<p><strong>Thang arithmetic</strong> chia đều theo mức giá tuyệt đối; <strong>thang logarithmic</strong> chia đều theo mức <em>phần trăm</em> thay đổi — được ưa dùng khi xem lịch sử dài hoặc biên độ giá rộng, nơi mức tăng từ 10 lên 20 (100%) cần nhìn "to" tương đương mức tăng từ 100 lên 200 (100%).</p>
<div class="callout"><span class="badge">Mẹo thực hành</span> Chọn khung thời gian khớp với khung nhìn của bạn: phân tích một quyết định nhiều tuần trên biểu đồ 1 phút là lỗi phổ biến của người mới.</div>`,
  ]]);

const c2q = quiz('fin305-quiz-2', 'Quiz 2 — Charts & timeframes|||Quiz 2 — Biểu đồ & khung thời gian', [
  { id: 'q1', question: 'Biểu đồ nào chỉ dùng giá đóng cửa để vẽ?', options: ['Bar (OHLC)', 'Candlestick', 'Line', 'Không loại nào'], correctIndex: 2, explanation: 'Biểu đồ đường (line) chỉ nối các mức giá đóng cửa.' },
  { id: 'q2', question: 'Với Open=50, High=55, Low=48, Close=53, bóng trên (upper wick) bằng?', options: ['5', '2', '3', '7'], correctIndex: 1, explanation: 'Bóng trên = High - Close = 55 - 53 = 2.' },
  { id: 'q3', question: 'Thang logarithmic phù hợp hơn arithmetic khi nào?', options: ['Biên độ giá hẹp, thời gian ngắn', 'Lịch sử dài hoặc biên độ giá rất rộng', 'Chỉ dùng cho biểu đồ nến', 'Không bao giờ cần dùng'], correctIndex: 1, explanation: 'Log scale chia đều theo % thay đổi, hợp với lịch sử dài/biên độ rộng.' },
]);

const c3 = doc('fin305-3-1-trend-trendline-channel', '3.1 — Trends, trendlines & channels|||3.1 — Xu hướng, đường xu hướng & kênh giá',
  'Định nghĩa xu hướng qua đỉnh/đáy (HH/HL, LH/LL, sideway); vẽ đường xu hướng từ tối thiểu 2 điểm, xác nhận ở điểm 3; kênh giá song song; rủi ro breakout giả.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 3 · Lesson 3.1</span>
<h2>Trends, trendlines &amp; channels</h2>
<h3>Defining a trend by swing points</h3>
<ul>
<li><strong>Uptrend</strong> — a sequence of Higher Highs and Higher Lows (HH/HL).</li>
<li><strong>Downtrend</strong> — a sequence of Lower Highs and Lower Lows (LH/LL).</li>
<li><strong>Sideways / range</strong> — highs and lows stay roughly level; no clear directional bias.</li>
</ul>
<h3>Drawing a trendline</h3>
<p>An <strong>uptrend line</strong> connects a series of rising swing lows; a <strong>downtrend line</strong> connects a series of falling swing highs. Technically two points are enough to draw the line, but a <strong>third touch</strong> is what confirms it as a valid trendline rather than a coincidence.</p>
<pre><code>Assumed swing lows on an uptrend: (t1, 100), (t2, 108), (t3, 115)
 Slope between t1-t2 = (108 - 100) / (t2 - t1)
 A third low near the extended line (t3 ~ 115, on-trend) confirms the trendline
</code></pre>
<h3>Price channels</h3>
<p>A <strong>channel</strong> is drawn by adding a second line, parallel to the trendline, touching the opposite swing points (highs, for an uptrend). Price tends to oscillate between the two lines; a move toward the far line can signal a short-term extreme within the trend.</p>
<h3>Breaks and false breaks</h3>
<p>A close beyond a trendline can signal a change in trend — but <strong>false breakouts</strong> (a brief piercing that snaps back) are common, especially on thin volume or in choppy conditions; many practitioners wait for a candle close, not just a touch, before treating a break as valid.</p>
<div class="callout"><span class="badge">Risk note</span> Trendlines are drawn with some subjectivity — two analysts can draw slightly different lines from the same chart. Treat a trendline as a zone of interest, not an exact price.</div>`,
    `<span class="eyebrow">FIN305 · Chương 3 · Bài 3.1</span>
<h2>Xu hướng, đường xu hướng &amp; kênh giá</h2>
<h3>Định nghĩa xu hướng qua các điểm đảo (swing)</h3>
<ul>
<li><strong>Xu hướng tăng</strong> — chuỗi đỉnh cao hơn và đáy cao hơn (Higher High/Higher Low — HH/HL).</li>
<li><strong>Xu hướng giảm</strong> — chuỗi đỉnh thấp hơn và đáy thấp hơn (Lower High/Lower Low — LH/LL).</li>
<li><strong>Đi ngang / range</strong> — đỉnh và đáy giữ mức tương đối bằng nhau; không có xu hướng rõ.</li>
</ul>
<h3>Vẽ đường xu hướng</h3>
<p><strong>Đường xu hướng tăng</strong> nối các đáy đang cao dần; <strong>đường xu hướng giảm</strong> nối các đỉnh đang thấp dần. Về kỹ thuật hai điểm là đủ để vẽ đường, nhưng <strong>điểm chạm thứ ba</strong> mới là thứ xác nhận đó là một đường xu hướng hợp lệ, không phải trùng hợp.</p>
<pre><code>Giả định các đáy trên xu hướng tăng: (t1, 100), (t2, 108), (t3, 115)
 Độ dốc giữa t1-t2 = (108 - 100) / (t2 - t1)
 Đáy thứ ba gần đường kéo dài (t3 ~ 115, đúng xu hướng) xác nhận đường xu hướng
</code></pre>
<h3>Kênh giá</h3>
<p>Một <strong>kênh giá</strong> được vẽ bằng cách thêm một đường thứ hai, song song với đường xu hướng, chạm các điểm đảo đối diện (đỉnh, với xu hướng tăng). Giá có xu hướng dao động giữa hai đường; khi giá tiến về đường đối diện có thể là dấu hiệu cực ngắn hạn trong xu hướng.</p>
<h3>Phá vỡ và phá vỡ giả</h3>
<p>Giá đóng cửa vượt qua đường xu hướng có thể báo hiệu đổi xu hướng — nhưng <strong>phá vỡ giả (false breakout)</strong> (xuyên qua ngắn rồi bật lại) rất phổ biến, đặc biệt khi khối lượng mỏng hoặc thị trường nhiễu; nhiều người thực hành chờ nến ĐÓNG cửa, không chỉ chạm, mới coi là phá vỡ hợp lệ.</p>
<div class="callout"><span class="badge">Lưu ý rủi ro</span> Đường xu hướng được vẽ có phần chủ quan — hai người phân tích có thể vẽ hơi khác nhau trên cùng một biểu đồ. Coi đường xu hướng là một VÙNG quan tâm, không phải một mức giá chính xác.</div>`,
  ]]);

const c3q = quiz('fin305-quiz-3', 'Quiz 3 — Trend & trendline|||Quiz 3 — Xu hướng & đường xu hướng', [
  { id: 'q1', question: 'Xu hướng tăng được nhận diện qua chuỗi nào?', options: ['LH/LL', 'HH/HL', 'Đỉnh đáy ngang bằng', 'Không cần đỉnh/đáy'], correctIndex: 1, explanation: 'Higher High/Higher Low (HH/HL) là dấu hiệu của xu hướng tăng.' },
  { id: 'q2', question: 'Điều gì xác nhận một đường xu hướng là hợp lệ, không phải trùng hợp?', options: ['Chỉ cần vẽ qua 1 điểm', 'Điểm chạm thứ ba gần đường kéo dài', 'Đường phải nằm ngang', 'Không cần xác nhận gì'], correctIndex: 1, explanation: 'Hai điểm vẽ được đường, nhưng điểm chạm thứ ba mới xác nhận độ tin cậy.' },
  { id: 'q3', question: '"Phá vỡ giả" (false breakout) là gì?', options: ['Giá phá đường xu hướng và tiếp diễn mạnh', 'Giá xuyên qua đường ngắn rồi bật ngược lại', 'Giá đi ngang mãi không phá', 'Một loại chỉ báo động lượng'], correctIndex: 1, explanation: 'False breakout là cú xuyên ngắn rồi quay lại vùng cũ, dễ gặp khi khối lượng mỏng.' },
]);

const c4 = doc('fin305-4-1-support-resistance-patterns', '4.1 — Support, resistance & price patterns|||4.1 — Hỗ trợ, kháng cự & mô hình giá',
  'Hỗ trợ/kháng cự và hiện tượng đổi vai; mô hình đảo chiều (Head & Shoulders, Double Top/Bottom); mô hình tiếp diễn (Triangle, Flag, Pennant); quy tắc đo mục tiêu giá.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 4 · Lesson 4.1</span>
<h2>Support, resistance &amp; price patterns</h2>
<h3>Support &amp; resistance</h3>
<p><strong>Support</strong> is a price level where buying pressure has historically been strong enough to halt or reverse a decline; <strong>resistance</strong> is where selling pressure has halted or reversed an advance. A key idea: once broken, <strong>support can become resistance</strong> and vice versa (a "role reversal").</p>
<h3>Reversal patterns</h3>
<ul>
<li><strong>Head &amp; Shoulders</strong> — three peaks, the middle one (head) higher than the two shoulders; a break of the "neckline" signals a reversal.</li>
<li><strong>Double Top / Double Bottom</strong> — price fails twice near the same level, signaling exhaustion of the prior trend.</li>
</ul>
<h3>Continuation patterns</h3>
<ul>
<li><strong>Triangle</strong> (symmetrical/ascending/descending) — converging trendlines during a pause in the trend.</li>
<li><strong>Flag / Pennant</strong> — a brief, tight consolidation after a sharp move, usually resolving in the same direction as the prior move.</li>
</ul>
<h3>Measuring rule (assumed numbers)</h3>
<pre><code>Head &amp; Shoulders example:
 Head high = 130, Neckline = 100  -&gt; pattern height = 30
 Neckline break at 100 -&gt; projected target = 100 - 30 = 70
 (a rough guide, not a guaranteed floor)
</code></pre>
<div class="callout"><span class="badge">Risk note</span> Patterns are visual generalizations — the same shape can fail. Wait for confirmation (a closed break with supporting volume) rather than anticipating the pattern before it completes.</div>`,
    `<span class="eyebrow">FIN305 · Chương 4 · Bài 4.1</span>
<h2>Hỗ trợ, kháng cự &amp; mô hình giá</h2>
<h3>Hỗ trợ &amp; kháng cự</h3>
<p><strong>Hỗ trợ</strong> là mức giá mà lực mua trong lịch sử đủ mạnh để chặn hoặc đảo chiều một đợt giảm; <strong>kháng cự</strong> là mức mà lực bán đã chặn hoặc đảo chiều một đợt tăng. Một ý quan trọng: khi bị phá vỡ, <strong>hỗ trợ có thể trở thành kháng cự</strong> và ngược lại (hiện tượng "đổi vai").</p>
<h3>Mô hình đảo chiều</h3>
<ul>
<li><strong>Head &amp; Shoulders (Đầu &amp; Hai vai)</strong> — ba đỉnh, đỉnh giữa (đầu) cao hơn hai đỉnh vai; phá "đường viền cổ" (neckline) báo hiệu đảo chiều.</li>
<li><strong>Double Top / Double Bottom (Hai đỉnh/Hai đáy)</strong> — giá thất bại hai lần gần cùng một mức, báo hiệu xu hướng cũ đang cạn lực.</li>
</ul>
<h3>Mô hình tiếp diễn</h3>
<ul>
<li><strong>Tam giác (Triangle)</strong> (cân/tăng/giảm) — các đường xu hướng thu hẹp lại trong lúc xu hướng tạm nghỉ.</li>
<li><strong>Cờ (Flag) / Cờ đuôi nheo (Pennant)</strong> — vùng tích luỹ hẹp, ngắn sau một đợt biến động mạnh, thường giải quyết theo hướng đợt biến động trước đó.</li>
</ul>
<h3>Quy tắc đo mục tiêu (số giả định)</h3>
<pre><code>Ví dụ Head &amp; Shoulders:
 Đỉnh đầu = 130, Neckline = 100  -&gt; chiều cao mô hình = 30
 Phá neckline tại 100 -&gt; mục tiêu chiếu = 100 - 30 = 70
 (chỉ là ước lượng tham khảo, không phải sàn giá đảm bảo)
</code></pre>
<div class="callout"><span class="badge">Lưu ý rủi ro</span> Mô hình giá là khái quát hoá trực quan — cùng một hình dạng có thể thất bại. Chờ xác nhận (giá đóng cửa phá vỡ kèm khối lượng ủng hộ) thay vì đoán trước khi mô hình hoàn tất.</div>`,
  ]]);

const c4q = quiz('fin305-quiz-4', 'Quiz 4 — Support/resistance & patterns|||Quiz 4 — Hỗ trợ/kháng cự & mô hình', [
  { id: 'q1', question: 'Khi hỗ trợ bị phá vỡ, nó có thể trở thành gì?', options: ['Biến mất hoàn toàn', 'Kháng cự (đổi vai)', 'Luôn giữ nguyên vai trò hỗ trợ', 'Không liên quan tới kháng cự'], correctIndex: 1, explanation: 'Hiện tượng đổi vai: hỗ trợ bị phá thường trở thành kháng cự mới.' },
  { id: 'q2', question: 'Mô hình nào gồm ba đỉnh, đỉnh giữa cao nhất?', options: ['Double Top', 'Triangle', 'Head & Shoulders', 'Flag'], correctIndex: 2, explanation: 'Head & Shoulders có đỉnh giữa (đầu) cao hơn hai vai.' },
  { id: 'q3', question: 'Với Head&Shoulders: đỉnh đầu=130, neckline=100, mục tiêu chiếu sau khi phá neckline là?', options: ['160', '70', '130', '30'], correctIndex: 1, explanation: 'Chiều cao = 130-100=30; mục tiêu = 100-30 = 70.' },
]);

const c5 = doc('fin305-5-1-trend-indicators', '5.1 — Trend indicators: MA, MACD, ADX|||5.1 — Chỉ báo xu hướng: MA, MACD, ADX',
  'Trung bình động SMA/EMA và tín hiệu cắt đường; MACD (EMA12-EMA26, đường signal EMA9, histogram); ADX đo sức mạnh xu hướng (không đo hướng), +DI/-DI.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 5 · Lesson 5.1</span>
<h2>Trend indicators: MA, MACD, ADX</h2>
<h3>Moving averages (SMA / EMA)</h3>
<p>A <strong>Simple Moving Average (SMA)</strong> is the arithmetic mean of the last N closes; an <strong>Exponential Moving Average (EMA)</strong> weights recent prices more heavily, reacting faster.</p>
<pre><code>SMA(N) = (P1 + P2 + ... + PN) / N
Assumed 5 closes: 20, 21, 22, 21, 24
SMA(5) = (20+21+22+21+24) / 5 = 108 / 5 = 21.6
A common signal: price crossing above/below its own MA, or a "golden/death cross" between a fast and a slow MA.
</code></pre>
<h3>MACD (Moving Average Convergence/Divergence)</h3>
<pre><code>MACD line   = EMA(12) - EMA(26)
Signal line = EMA(9) of the MACD line
Histogram   = MACD line - Signal line
Assumed: EMA12 = 55, EMA26 = 50 -&gt; MACD line = 5
If Signal = 3 -&gt; Histogram = 5 - 3 = 2 (positive -&gt; bullish momentum building)
</code></pre>
<h3>ADX (Average Directional Index)</h3>
<p><strong>ADX</strong> (built from +DI and -DI) measures the <em>strength</em> of a trend, regardless of direction — it does not tell you whether price is going up or down, only how strongly it is trending. A rising ADX above roughly 25 (a common, non-universal reference) is often read as "a trend worth respecting"; a falling/low ADX suggests a range.</p>
<div class="callout"><span class="badge">Risk note</span> Trend indicators are built from past prices, so they inherently <strong>lag</strong>. In a choppy, non-trending market they generate frequent whipsaw signals.</div>`,
    `<span class="eyebrow">FIN305 · Chương 5 · Bài 5.1</span>
<h2>Chỉ báo xu hướng: MA, MACD, ADX</h2>
<h3>Trung bình động (SMA / EMA)</h3>
<p><strong>SMA (Simple Moving Average)</strong> là trung bình số học của N giá đóng cửa gần nhất; <strong>EMA (Exponential Moving Average)</strong> đặt trọng số cao hơn cho giá gần đây, phản ứng nhanh hơn.</p>
<pre><code>SMA(N) = (P1 + P2 + ... + PN) / N
Giả định 5 giá đóng cửa: 20, 21, 22, 21, 24
SMA(5) = (20+21+22+21+24) / 5 = 108 / 5 = 21.6
Tín hiệu phổ biến: giá cắt lên/xuống MA của chính nó, hoặc "golden/death cross" giữa MA nhanh và MA chậm.
</code></pre>
<h3>MACD (Moving Average Convergence/Divergence)</h3>
<pre><code>Đường MACD  = EMA(12) - EMA(26)
Đường Signal = EMA(9) của đường MACD
Histogram    = Đường MACD - Đường Signal
Giả định: EMA12 = 55, EMA26 = 50 -&gt; đường MACD = 5
Nếu Signal = 3 -&gt; Histogram = 5 - 3 = 2 (dương -&gt; động lượng tăng đang mạnh lên)
</code></pre>
<h3>ADX (Average Directional Index)</h3>
<p><strong>ADX</strong> (dựng từ +DI và -DI) đo <em>sức mạnh</em> của xu hướng, bất kể hướng nào — nó KHÔNG cho biết giá đang tăng hay giảm, chỉ cho biết xu hướng đang mạnh tới đâu. ADX tăng và vượt khoảng 25 (một mốc tham khảo phổ biến, không phải chuẩn tuyệt đối) thường được đọc là "xu hướng đáng tin"; ADX thấp/giảm gợi ý thị trường đang đi ngang.</p>
<div class="callout"><span class="badge">Lưu ý rủi ro</span> Chỉ báo xu hướng được dựng từ giá quá khứ nên vốn <strong>trễ (lag)</strong>. Trong thị trường đi ngang, nhiễu, chúng tạo nhiều tín hiệu giả liên tiếp (whipsaw).</div>`,
  ]]);

const c5q = quiz('fin305-quiz-5', 'Quiz 5 — Trend indicators|||Quiz 5 — Chỉ báo xu hướng', [
  { id: 'q1', question: 'Với 5 giá đóng cửa 20,21,22,21,24, SMA(5) bằng?', options: ['20.0', '21.6', '22.5', '24.0'], correctIndex: 1, explanation: 'Tổng=108, chia 5 = 21.6.' },
  { id: 'q2', question: 'Đường MACD được tính bằng?', options: ['EMA(9) - EMA(12)', 'EMA(12) - EMA(26)', 'SMA(12) + SMA(26)', 'EMA(26) - EMA(9)'], correctIndex: 1, explanation: 'MACD line = EMA(12) - EMA(26).' },
  { id: 'q3', question: 'ADX dùng để đo điều gì?', options: ['Hướng của xu hướng (tăng hay giảm)', 'Sức mạnh của xu hướng, không phân biệt hướng', 'Khối lượng giao dịch', 'Độ biến động (volatility)'], correctIndex: 1, explanation: 'ADX đo sức mạnh xu hướng, không cho biết hướng — cần +DI/-DI để biết hướng.' },
]);

const c6 = doc('fin305-6-1-momentum-oscillators', '6.1 — Momentum & oscillators: RSI, Stochastic, CCI|||6.1 — Chỉ báo động lượng & dao động: RSI, Stochastic, CCI',
  'RSI (công thức, vùng quá mua/quá bán 70/30, phân kỳ); Stochastic %K/%D; CCI (độ lệch giá so với trung bình động); rủi ro quá mua/quá bán kéo dài trong xu hướng mạnh.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 6 · Lesson 6.1</span>
<h2>Momentum &amp; oscillators: RSI, Stochastic, CCI</h2>
<h3>RSI (Relative Strength Index)</h3>
<pre><code>RSI = 100 - [100 / (1 + RS)],  RS = average gain / average loss (over N periods, typically 14)
Assumed: average gain = 1.5, average loss = 0.5 -&gt; RS = 3
RSI = 100 - [100 / (1 + 3)] = 100 - 25 = 75  (above 70 -&gt; commonly read as "overbought")
</code></pre>
<p>Common reference thresholds: <strong>above 70 = overbought</strong>, <strong>below 30 = oversold</strong> — signals of a stretched move, not an automatic reversal. A <strong>bearish divergence</strong> (price makes a higher high while RSI makes a lower high) is often watched as an early warning of weakening momentum.</p>
<h3>Stochastic oscillator</h3>
<pre><code>%K = 100 x (Close - LowestLow_N) / (HighestHigh_N - LowestLow_N)
Assumed: Close = 58, LowestLow(14) = 50, HighestHigh(14) = 60
%K = 100 x (58-50) / (60-50) = 100 x 0.8 = 80
%D = a moving average (commonly 3-period) of %K, used as the signal line
</code></pre>
<h3>CCI (Commodity Channel Index)</h3>
<p><strong>CCI</strong> measures how far the typical price ((High+Low+Close)/3) sits from its own moving average, scaled by mean deviation — readings beyond roughly +100/-100 are commonly read as strong momentum extremes.</p>
<div class="callout"><span class="badge">Risk note</span> In a strong trend, oscillators can stay "overbought" or "oversold" for a long stretch — treating that alone as a reversal signal, against a strong trend, is a common and costly mistake.</div>`,
    `<span class="eyebrow">FIN305 · Chương 6 · Bài 6.1</span>
<h2>Chỉ báo động lượng &amp; dao động: RSI, Stochastic, CCI</h2>
<h3>RSI (Relative Strength Index)</h3>
<pre><code>RSI = 100 - [100 / (1 + RS)],  RS = trung bình tăng / trung bình giảm (qua N phiên, thường 14)
Giả định: trung bình tăng = 1.5, trung bình giảm = 0.5 -&gt; RS = 3
RSI = 100 - [100 / (1 + 3)] = 100 - 25 = 75  (trên 70 -&gt; thường đọc là "quá mua")
</code></pre>
<p>Mốc tham khảo phổ biến: <strong>trên 70 = quá mua</strong>, <strong>dưới 30 = quá bán</strong> — là tín hiệu một đợt vận động đã kéo dài, không phải tín hiệu đảo chiều tự động. <strong>Phân kỳ giảm (bearish divergence)</strong> (giá tạo đỉnh cao hơn nhưng RSI tạo đỉnh thấp hơn) thường được theo dõi như cảnh báo sớm động lượng đang yếu đi.</p>
<h3>Chỉ báo Stochastic</h3>
<pre><code>%K = 100 x (Close - ĐáyThấpNhất_N) / (ĐỉnhCaoNhất_N - ĐáyThấpNhất_N)
Giả định: Close = 58, ĐáyThấpNhất(14) = 50, ĐỉnhCaoNhất(14) = 60
%K = 100 x (58-50) / (60-50) = 100 x 0.8 = 80
%D = trung bình động (thường 3 phiên) của %K, dùng làm đường tín hiệu
</code></pre>
<h3>CCI (Commodity Channel Index)</h3>
<p><strong>CCI</strong> đo khoảng cách giữa giá điển hình ((High+Low+Close)/3) so với trung bình động của chính nó, chuẩn hoá theo độ lệch trung bình — mức đọc vượt khoảng +100/-100 thường được xem là cực điểm động lượng mạnh.</p>
<div class="callout"><span class="badge">Lưu ý rủi ro</span> Trong xu hướng mạnh, chỉ báo dao động có thể ở trạng thái "quá mua" hoặc "quá bán" rất lâu — coi riêng điều đó là tín hiệu đảo chiều, ngược xu hướng mạnh, là lỗi phổ biến và tốn kém.</div>`,
  ]]);

const c6q = quiz('fin305-quiz-6', 'Quiz 6 — Momentum oscillators|||Quiz 6 — Chỉ báo động lượng', [
  { id: 'q1', question: 'RSI trên 70 thường được đọc là?', options: ['Quá bán', 'Quá mua', 'Xu hướng trung tính', 'Khối lượng thấp'], correctIndex: 1, explanation: 'Trên 70 là mốc tham khảo phổ biến cho "quá mua".' },
  { id: 'q2', question: '"Phân kỳ giảm" (bearish divergence) trên RSI là khi?', options: ['Giá và RSI cùng tạo đỉnh cao hơn', 'Giá tạo đỉnh cao hơn nhưng RSI tạo đỉnh thấp hơn', 'Giá đi ngang mãi', 'RSI luôn bằng 50'], correctIndex: 1, explanation: 'Phân kỳ giảm: giá tạo đỉnh cao hơn, RSI tạo đỉnh thấp hơn — cảnh báo động lượng yếu.' },
  { id: 'q3', question: 'Rủi ro phổ biến khi dùng chỉ báo dao động trong xu hướng mạnh là?', options: ['Chỉ báo luôn sai', 'Nó có thể ở vùng quá mua/quá bán rất lâu mà giá vẫn tiếp diễn', 'Không có rủi ro nào', 'Chỉ báo chỉ dùng được cho cổ phiếu'], correctIndex: 1, explanation: 'Trong xu hướng mạnh, oscillator có thể "kẹt" ở cực điểm lâu, coi đó là tín hiệu đảo chiều dễ gây lỗ.' },
]);

const c7 = doc('fin305-7-1-volume-psychology', '7.1 — Volume theory & market psychology|||7.1 — Lý thuyết khối lượng & tâm lý thị trường',
  'Khối lượng xác nhận giá; nguyên lý "khối lượng đi trước giá"; OBV; tâm lý sợ-tham (fear/greed), hành vi đám đông, chỉ báo ngược dòng (contrarian); rủi ro dữ liệu khối lượng phân mảnh.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 7 · Lesson 7.1</span>
<h2>Volume theory &amp; market psychology</h2>
<h3>Volume confirms price</h3>
<p><strong>Volume</strong> — the number of shares/contracts traded — is treated as a confirming signal alongside price: a price move on rising volume is considered more credible than the same move on thin volume. A widely cited heuristic is that <strong>"volume precedes price"</strong> — a pickup in volume can appear before a significant price move, as informed participants begin to act.</p>
<h3>On-Balance Volume (OBV) — concept</h3>
<pre><code>OBV running total:
 If today's close &gt; yesterday's close -&gt; OBV = previous OBV + today's volume
 If today's close &lt; yesterday's close -&gt; OBV = previous OBV - today's volume
 If unchanged -&gt; OBV unchanged
Assumed: OBV(prev) = 10,000; today close up, volume = 1,200 -&gt; OBV(today) = 11,200
</code></pre>
<p>A rising OBV alongside a rising price is read as confirmation; OBV diverging from price (e.g. OBV falling while price still rises) is read as a warning sign.</p>
<h3>Market psychology</h3>
<p>Repeating chart patterns exist, in Dow Theory's own logic, because crowds repeat the same emotional cycle: <strong>optimism → excitement → euphoria (top) → anxiety → fear → panic (capitulation, bottom) → disbelief → hope</strong>. Some practitioners use <strong>contrarian</strong> readings of extreme sentiment (e.g. surveys, put/call ratios) as a caution flag when a crowd appears one-sidedly positioned.</p>
<div class="callout"><span class="badge">Risk note</span> Volume data quality varies a lot across fragmented markets (many exchanges for the same asset) and especially in crypto, where reported volume can be unreliable — treat volume analysis as directional evidence, not a precise measurement.</div>`,
    `<span class="eyebrow">FIN305 · Chương 7 · Bài 7.1</span>
<h2>Lý thuyết khối lượng &amp; tâm lý thị trường</h2>
<h3>Khối lượng xác nhận giá</h3>
<p><strong>Khối lượng (volume)</strong> — số cổ phiếu/hợp đồng được giao dịch — được xem là tín hiệu xác nhận đi kèm giá: một biến động giá trên khối lượng tăng được coi là đáng tin hơn cùng biến động đó trên khối lượng mỏng. Một nguyên lý được trích dẫn nhiều là <strong>"khối lượng đi trước giá"</strong> — khối lượng tăng lên có thể xuất hiện trước một biến động giá đáng kể, khi bên nắm thông tin bắt đầu hành động.</p>
<h3>On-Balance Volume (OBV) — khái niệm</h3>
<pre><code>OBV tích lũy:
 Nếu close hôm nay &gt; close hôm qua -&gt; OBV = OBV trước + khối lượng hôm nay
 Nếu close hôm nay &lt; close hôm qua -&gt; OBV = OBV trước - khối lượng hôm nay
 Nếu không đổi -&gt; OBV không đổi
Giả định: OBV(trước) = 10.000; hôm nay close tăng, khối lượng = 1.200 -&gt; OBV(hôm nay) = 11.200
</code></pre>
<p>OBV tăng cùng giá tăng được đọc là xác nhận; OBV phân kỳ với giá (vd OBV giảm trong khi giá vẫn tăng) được đọc là dấu hiệu cảnh báo.</p>
<h3>Tâm lý thị trường</h3>
<p>Các mô hình biểu đồ lặp lại tồn tại, theo đúng logic của lý thuyết Dow, vì đám đông lặp lại cùng một vòng cảm xúc: <strong>lạc quan → hào hứng → hưng phấn tột độ (đỉnh) → lo lắng → sợ hãi → hoảng loạn (bán tháo, đáy) → hoài nghi → hy vọng</strong>. Một số người thực hành đọc <strong>ngược dòng (contrarian)</strong> các chỉ số tâm lý cực đoan (vd khảo sát, tỉ lệ put/call) như cờ cảnh báo khi đám đông có vẻ đang lệch về một phía.</p>
<div class="callout"><span class="badge">Lưu ý rủi ro</span> Chất lượng dữ liệu khối lượng khác biệt nhiều giữa các thị trường phân mảnh (nhiều sàn cho cùng tài sản), đặc biệt ở crypto, nơi khối lượng báo cáo có thể không đáng tin — coi phân tích khối lượng là bằng chứng về HƯỚNG, không phải số đo chính xác.</div>`,
  ]]);

const c7q = quiz('fin305-quiz-7', 'Quiz 7 — Volume & psychology|||Quiz 7 — Khối lượng & tâm lý', [
  { id: 'q1', question: 'Nguyên lý "khối lượng đi trước giá" nghĩa là?', options: ['Giá luôn đi trước khối lượng', 'Khối lượng tăng có thể xuất hiện trước một biến động giá lớn', 'Khối lượng không liên quan gì tới giá', 'Khối lượng chỉ quan trọng ở thị trường crypto'], correctIndex: 1, explanation: 'Đây là nguyên lý phổ biến: khối lượng bất thường có thể báo trước biến động giá.' },
  { id: 'q2', question: 'OBV(trước)=10.000, hôm nay close TĂNG với khối lượng 1.200, OBV hôm nay là?', options: ['8.800', '10.000', '11.200', '12.200'], correctIndex: 2, explanation: 'Close tăng -> OBV = OBV trước + khối lượng = 10.000+1.200 = 11.200.' },
  { id: 'q3', question: 'Vì sao dữ liệu khối lượng cần được xem xét cẩn trọng, đặc biệt ở crypto?', options: ['Vì khối lượng luôn chính xác 100%', 'Vì thị trường phân mảnh/báo cáo không đáng tin có thể làm khối lượng sai lệch', 'Vì khối lượng không tồn tại ở crypto', 'Vì khối lượng chỉ áp dụng cho cổ phiếu'], correctIndex: 1, explanation: 'Thị trường phân mảnh và báo cáo khối lượng không đáng tin (đặc biệt crypto) làm dữ liệu kém chính xác.' },
]);

const c8 = doc('fin305-8-1-combine-risk-management', '8.1 — Combining analysis & risk management|||8.1 — Kết hợp phân tích & quản trị rủi ro',
  'Kết hợp nhiều lớp xác nhận (xu hướng+động lượng+khối lượng), tránh chồng chỉ báo cùng loại; định cỡ vị thế, đặt dừng lỗ theo hỗ trợ/kháng cự hoặc ATR, tỉ lệ risk/reward; giới hạn của TA.',
  [[
    `<span class="eyebrow">FIN305 · Chapter 8 · Lesson 8.1</span>
<h2>Combining analysis &amp; risk management</h2>
<h3>Multiple confirmation, not indicator overload</h3>
<p>A single tool is rarely enough. A common approach layers <strong>different categories</strong>: a trend read (Dow Theory / MA direction), a momentum read (RSI/Stochastic), and a volume read (rising/falling OBV) — looking for them to <em>agree</em>. Stacking three indicators from the <em>same</em> category (e.g. RSI + Stochastic + CCI, all momentum) tends to just repeat the same information, not add new confirmation.</p>
<h3>Position sizing (assumed numbers)</h3>
<pre><code>Account = 10,000; Risk per trade = 1% = 100
Entry = 50, Stop-loss (below support) = 48 -&gt; risk per unit = 2
Position size = Risk amount / risk per unit = 100 / 2 = 50 units
</code></pre>
<h3>Risk/reward ratio</h3>
<pre><code>Entry = 50, Stop-loss = 48 (risk = 2), Target = 56 (reward = 6)
Risk/Reward = 2 : 6 = 1 : 3
</code></pre>
<p>Stops are commonly placed just beyond a support/resistance level or a multiple of <strong>ATR (Average True Range)</strong>, a volatility measure — rather than an arbitrary percentage that ignores how the instrument actually moves.</p>
<h3>Limits of technical analysis</h3>
<p>TA is a framework for reading probability and managing exposure, not a forecasting machine. It can be wrong on any single trade; it says nothing about a company's solvency or an economy's health; and it works best combined with sound risk management, never as a substitute for it.</p>
<div class="callout"><span class="badge">Disclaimer</span> This course, and every number in it, is for education only. It is not investment advice, and does not recommend buying or selling any specific asset. Past patterns and indicator readings do not guarantee future results.</div>`,
    `<span class="eyebrow">FIN305 · Chương 8 · Bài 8.1</span>
<h2>Kết hợp phân tích &amp; quản trị rủi ro</h2>
<h3>Xác nhận đa lớp, không chồng chỉ báo</h3>
<p>Một công cụ đơn lẻ hiếm khi đủ. Cách tiếp cận phổ biến là chồng các <strong>lớp khác NHÓM</strong>: đọc xu hướng (lý thuyết Dow / hướng MA), đọc động lượng (RSI/Stochastic), và đọc khối lượng (OBV tăng/giảm) — tìm xem chúng có <em>đồng thuận</em> không. Chồng ba chỉ báo cùng NHÓM (vd RSI + Stochastic + CCI, đều là động lượng) thường chỉ lặp lại cùng một thông tin, không thêm xác nhận mới.</p>
<h3>Định cỡ vị thế (số giả định)</h3>
<pre><code>Tài khoản = 10.000; Rủi ro mỗi lệnh = 1% = 100
Vào lệnh = 50, Dừng lỗ (dưới hỗ trợ) = 48 -&gt; rủi ro mỗi đơn vị = 2
Cỡ vị thế = Số tiền rủi ro / rủi ro mỗi đơn vị = 100 / 2 = 50 đơn vị
</code></pre>
<h3>Tỉ lệ risk/reward</h3>
<pre><code>Vào lệnh = 50, Dừng lỗ = 48 (rủi ro = 2), Mục tiêu = 56 (lợi nhuận kỳ vọng = 6)
Risk/Reward = 2 : 6 = 1 : 3
</code></pre>
<p>Điểm dừng lỗ thường được đặt ngay ngoài một mức hỗ trợ/kháng cự hoặc theo bội số của <strong>ATR (Average True Range)</strong>, một thước đo biến động — thay vì một tỉ lệ phần trăm tuỳ ý bỏ qua cách tài sản đó thực sự dao động.</p>
<h3>Giới hạn của phân tích kỹ thuật</h3>
<p>TA là khung đọc xác suất và quản lý mức độ tiếp xúc rủi ro, không phải máy dự báo. Nó có thể sai ở bất kỳ lệnh đơn lẻ nào; nó không nói gì về khả năng thanh khoản của một công ty hay sức khoẻ một nền kinh tế; và nó hoạt động tốt nhất khi đi kèm quản trị rủi ro chặt chẽ, không bao giờ thay thế được nó.</p>
<div class="callout"><span class="badge">Miễn trừ trách nhiệm</span> Môn học này, và mọi số liệu trong đó, chỉ nhằm mục đích giáo dục. Đây KHÔNG phải khuyến nghị đầu tư, và không đề xuất mua/bán bất kỳ tài sản cụ thể nào. Mô hình quá khứ và chỉ báo KHÔNG bảo đảm kết quả tương lai.</div>`,
  ]]);

const c8q = quiz('fin305-quiz-8', 'Quiz 8 — Combining & risk management|||Quiz 8 — Kết hợp & quản trị rủi ro', [
  { id: 'q1', question: 'Vì sao chồng RSI + Stochastic + CCI cùng lúc thường KHÔNG tăng độ tin cậy nhiều?', options: ['Vì cả ba đều là chỉ báo động lượng, dễ lặp cùng thông tin', 'Vì ba chỉ báo này không tồn tại', 'Vì chúng luôn cho tín hiệu ngược nhau', 'Vì chúng đo khối lượng, không đo động lượng'], correctIndex: 0, explanation: 'Cùng nhóm động lượng nên thường lặp lại thông tin, không phải xác nhận độc lập.' },
  { id: 'q2', question: 'Tài khoản 10.000, rủi ro 1%/lệnh=100, entry=50, stop=48 (rủi ro/đơn vị=2). Cỡ vị thế là?', options: ['25 đơn vị', '50 đơn vị', '100 đơn vị', '200 đơn vị'], correctIndex: 1, explanation: 'Cỡ vị thế = 100/2 = 50 đơn vị.' },
  { id: 'q3', question: 'Stop-loss nên được đặt dựa trên nguyên tắc nào, thay vì % tuỳ ý?', options: ['Luôn đặt đúng 5% bất kể tài sản nào', 'Dựa trên hỗ trợ/kháng cự hoặc bội số ATR (biến động thực tế)', 'Không cần đặt stop-loss', 'Đặt bằng đúng giá vào lệnh'], correctIndex: 1, explanation: 'Stop nên phản ánh cấu trúc giá (hỗ trợ/kháng cự) hoặc biến động thực (ATR).' },
]);

const taiLieu = doc('fin305-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách tham khảo (Murphy, Pring, Kirkpatrick — trích dẫn, không upload PDF), tài liệu miễn phí, YouTube, công cụ biểu đồ, lộ trình tự học.',
  [[
    `<span class="eyebrow">FIN305 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn the foundations of Technical Analysis — Dow Theory, charts, trends, patterns, indicators, volume and risk management — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are cited reference books and free, legal resources (no PDFs are hosted here).</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for FIN305 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (citation only)</h3>
<ul>
<li>John J. Murphy — <em>Technical Analysis of the Financial Markets</em></li>
<li>Martin J. Pring — <em>Technical Analysis Explained</em></li>
<li>Charles D. Kirkpatrick &amp; Julie R. Dahlquist — <em>Technical Analysis: The Complete Resource for Financial Market Technicians</em> (CMT curriculum reference)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://chartschool.stockcharts.com/" target="_blank" rel="noopener">StockCharts ChartSchool</a> — free encyclopedia of chart patterns &amp; indicators</li>
<li><a href="https://www.investopedia.com/technical-analysis-4689657" target="_blank" rel="noopener">Investopedia — Technical Analysis</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@rayner_teo" target="_blank" rel="noopener">Rayner Teo</a> — technical analysis &amp; trading psychology explained</li>
<li><a href="https://www.youtube.com/@TradingView" target="_blank" rel="noopener">TradingView</a> — official chart-reading tutorials</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.tradingview.com/" target="_blank" rel="noopener">TradingView</a> — free charting with indicators &amp; drawing tools</li>
<li><a href="https://chartschool.stockcharts.com/" target="_blank" rel="noopener">StockCharts.com</a> — chart library &amp; screener</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the three TA assumptions, Dow Theory, chart types, trend/support-resistance theory.</li>
<li><strong>Practice</strong> — draw trendlines and identify patterns on real (free, delayed) charts on TradingView, and check them against ChartSchool definitions.</li>
<li><strong>Go deeper</strong> — trend indicators (MA/MACD/ADX), momentum oscillators (RSI/Stochastic/CCI), volume theory.</li>
<li><strong>Risk-aware</strong> — practice position sizing and risk/reward math before ATA301 puts these tools into applied trading setups.</li>
</ol></div>
<div class="callout"><span class="badge">Not investment advice</span> This material is educational. It does not recommend any specific trade, asset, broker or strategy.</div>`,
    `<span class="eyebrow">FIN305 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học nền tảng Phân tích kỹ thuật — lý thuyết Dow, biểu đồ, xu hướng, mô hình giá, chỉ báo, khối lượng và quản trị rủi ro — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách trích dẫn và nguồn miễn phí, hợp pháp (KHÔNG lưu PDF ở đây).</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của FIN305 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (chỉ trích dẫn)</h3>
<ul>
<li>John J. Murphy — <em>Technical Analysis of the Financial Markets</em></li>
<li>Martin J. Pring — <em>Technical Analysis Explained</em></li>
<li>Charles D. Kirkpatrick &amp; Julie R. Dahlquist — <em>Technical Analysis: The Complete Resource for Financial Market Technicians</em> (tài liệu chuẩn CMT)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://chartschool.stockcharts.com/" target="_blank" rel="noopener">StockCharts ChartSchool</a> — bách khoa miễn phí về mô hình giá &amp; chỉ báo</li>
<li><a href="https://www.investopedia.com/technical-analysis-4689657" target="_blank" rel="noopener">Investopedia — Technical Analysis</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@rayner_teo" target="_blank" rel="noopener">Rayner Teo</a> — phân tích kỹ thuật &amp; tâm lý giao dịch giải thích dễ hiểu</li>
<li><a href="https://www.youtube.com/@TradingView" target="_blank" rel="noopener">TradingView</a> — hướng dẫn đọc biểu đồ chính thức</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.tradingview.com/" target="_blank" rel="noopener">TradingView</a> — vẽ biểu đồ miễn phí kèm chỉ báo &amp; công cụ vẽ</li>
<li><a href="https://chartschool.stockcharts.com/" target="_blank" rel="noopener">StockCharts.com</a> — thư viện biểu đồ &amp; bộ lọc cổ phiếu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — ba giả định của TA, lý thuyết Dow, loại biểu đồ, lý thuyết xu hướng/hỗ trợ-kháng cự.</li>
<li><strong>Luyện tập</strong> — vẽ đường xu hướng và nhận diện mô hình trên biểu đồ thật (miễn phí, trễ) trên TradingView, đối chiếu với định nghĩa ở ChartSchool.</li>
<li><strong>Đào sâu</strong> — chỉ báo xu hướng (MA/MACD/ADX), chỉ báo động lượng (RSI/Stochastic/CCI), lý thuyết khối lượng.</li>
<li><strong>Ý thức rủi ro</strong> — luyện định cỡ vị thế và tính risk/reward trước khi ATA301 đưa các công cụ này vào tình huống giao dịch ứng dụng.</li>
</ol></div>
<div class="callout"><span class="badge">Không phải khuyến nghị đầu tư</span> Tài liệu này chỉ nhằm mục đích giáo dục. Nó không khuyến nghị bất kỳ giao dịch, tài sản, broker hay chiến lược cụ thể nào.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'FIN305',
    slug: 'fin305-technical-analysis',
    title: 'Technical analysis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/FIN305.webp',
    shortDescription: 'Foundations of technical analysis: Dow Theory, charts & timeframes, trends & patterns, trend/momentum indicators (MA, MACD, RSI), volume theory, risk management. Bilingual, formulas & quizzes. Not investment advice.|||Nền tảng phân tích kỹ thuật: lý thuyết Dow, biểu đồ & khung thời gian, xu hướng & mô hình giá, chỉ báo xu hướng/động lượng (MA, MACD, RSI), lý thuyết khối lượng, quản trị rủi ro. Song ngữ, có công thức & quiz. Không phải khuyến nghị đầu tư.',
    description: 'Môn <strong>FIN305 — Technical Analysis</strong> (Phân tích kỹ thuật, kỳ 3, khối Quản trị Kinh doanh) dựng <strong>nền tảng lý thuyết</strong> của phân tích kỹ thuật trong tài chính/đầu tư: <strong>lý thuyết Dow</strong>, cách đọc <strong>biểu đồ &amp; khung thời gian</strong>, <strong>xu hướng, đường xu hướng &amp; kênh giá</strong>, <strong>hỗ trợ-kháng cự &amp; mô hình giá</strong>, cơ chế các <strong>chỉ báo xu hướng</strong> (MA, MACD, ADX) và <strong>chỉ báo động lượng</strong> (RSI, Stochastic, CCI), <strong>lý thuyết khối lượng &amp; tâm lý thị trường</strong>, và <strong>quản trị rủi ro giao dịch</strong>. Trích dẫn Murphy, Pring, Kirkpatrick (không upload PDF); song ngữ, có ví dụ tính toán (số giả định) và quiz mỗi chương. Môn thiên lý thuyết/nền tảng — môn <strong>ATA301 (Applied Technical Analysis)</strong> học sau, thiên ứng dụng/thực hành, không trùng nội dung.',
    whatYouLearn: 'Ba giả định của TA & lý thuyết Dow (3 cấp xu hướng, 3 giai đoạn); biểu đồ line/bar/candlestick & khung thời gian; xu hướng HH/HL-LH/LL, đường xu hướng & kênh giá; hỗ trợ-kháng cự & mô hình giá (Head&Shoulders, Double Top/Bottom, Triangle, Flag); MA (SMA/EMA), MACD, ADX; RSI, Stochastic, CCI; lý thuyết khối lượng (OBV) & tâm lý thị trường; kết hợp đa lớp xác nhận, định cỡ vị thế, risk/reward, giới hạn của TA.',
    requirements: 'Kiến thức tài chính/đầu tư nhập môn (không yêu cầu); nên có tài khoản xem biểu đồ miễn phí (vd TradingView) để thực hành song song.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách trích dẫn (Murphy, Pring, Kirkpatrick), tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'TA là gì, ba giả định, FIN305 khác ATA301, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng & lý thuyết Dow|||Chapter 1 — Foundations & Dow Theory', description: 'Ba giả định TA, ba cấp xu hướng, ba giai đoạn, xác nhận khối lượng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Biểu đồ & khung thời gian|||Chapter 2 — Charts & timeframes', description: 'Line/bar/candlestick, giải phẫu nến, khung thời gian, thang giá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xu hướng, đường xu hướng & kênh giá|||Chapter 3 — Trends, trendlines & channels', description: 'HH/HL-LH/LL, vẽ trendline, kênh giá, phá vỡ giả.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hỗ trợ, kháng cự & mô hình giá|||Chapter 4 — Support, resistance & patterns', description: 'Đổi vai, Head&Shoulders, Double Top/Bottom, Triangle, Flag.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Chỉ báo xu hướng: MA, MACD, ADX|||Chapter 5 — Trend indicators: MA, MACD, ADX', description: 'SMA/EMA, MACD, ADX đo sức mạnh xu hướng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chỉ báo động lượng: RSI, Stochastic, CCI|||Chapter 6 — Momentum oscillators: RSI, Stochastic, CCI', description: 'Công thức, quá mua/quá bán, phân kỳ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Lý thuyết khối lượng & tâm lý thị trường|||Chapter 7 — Volume theory & market psychology', description: 'OBV, khối lượng đi trước giá, vòng cảm xúc đám đông.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kết hợp phân tích & quản trị rủi ro|||Chapter 8 — Combining analysis & risk management', description: 'Xác nhận đa lớp, định cỡ vị thế, risk/reward, giới hạn của TA.', lessons: [c8, c8q] },
  ],
};
