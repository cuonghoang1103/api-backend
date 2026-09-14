/**
 * EAI201 — AI in E-Commerce. Giáo trình FLM (syl) + tài liệu tham khảo:
 * "AI for Marketing" (Sterne), Amazon/Shopify AI docs, McKinsey/Gartner "AI
 * in E-commerce" whitepapers, "Recommender Systems" (Aggarwal). 8 chương:
 * tổng quan & giá trị KD, hệ khuyến nghị, cá nhân hoá & phân khúc, chatbot,
 * tìm kiếm thông minh (ảnh/giọng nói), định giá động & dự báo, gian lận &
 * chuyển đổi, generative AI + đạo đức/quyền riêng tư. Song ngữ + ví dụ + bài
 * tập. Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('eai201-0-1-overview', 'Course overview: AI in E-Commerce|||Tổng quan: AI trong Thương mại điện tử',
  'AI làm gì trong TMĐT; nơi AI xuất hiện trong hành trình mua hàng; lộ trình 8 chương từ tổng quan đến generative AI & đạo đức.',
  [[
    `<span class="eyebrow">EAI201 · Lesson 0.1 · Overview</span>
<h2>AI in E-Commerce</h2>
<p class="lead">This course maps <strong>where artificial intelligence creates business value</strong> across an online store — from the moment a shopper searches, through recommendations, personalized offers, chat support, pricing, fraud checks, and the AI-written product copy they read along the way.</p>
<h3>Why e-commerce and AI fit so well</h3>
<p>Every click, search, cart, and purchase is already a data point. E-commerce platforms have the two ingredients AI needs at scale: <strong>large behavioral datasets</strong> and <strong>clear business metrics</strong> (conversion rate, average order value, retention) to optimize against.</p>
<h3>Roadmap</h3>
<p>Overview &amp; business value → recommendation engines → personalization &amp; segmentation → chatbots &amp; virtual assistants → intelligent/visual/voice search → dynamic pricing &amp; demand forecasting → fraud detection &amp; conversion optimization → generative AI, ethics &amp; privacy. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">EAI201 · Bài 0.1 · Tổng quan</span>
<h2>AI trong Thương mại điện tử</h2>
<p class="lead">Môn này vạch ra <strong>AI tạo giá trị kinh doanh ở đâu</strong> trên một sàn TMĐT — từ lúc khách tìm kiếm, qua gợi ý sản phẩm, ưu đãi cá nhân hoá, hỗ trợ qua chat, định giá, kiểm tra gian lận, đến cả mô tả sản phẩm do AI viết mà họ đọc trên đường đi.</p>
<h3>Vì sao TMĐT và AI hợp nhau</h3>
<p>Mỗi lượt click, tìm kiếm, giỏ hàng, đơn mua đều đã là một điểm dữ liệu. Các sàn TMĐT có sẵn hai thứ AI cần ở quy mô lớn: <strong>dữ liệu hành vi khối lượng lớn</strong> và <strong>chỉ số kinh doanh rõ ràng</strong> (tỉ lệ chuyển đổi, giá trị đơn trung bình, giữ chân khách) để tối ưu theo.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; giá trị kinh doanh → hệ khuyến nghị → cá nhân hoá &amp; phân khúc khách hàng → chatbot &amp; trợ lý ảo → tìm kiếm thông minh/hình ảnh/giọng nói → định giá động &amp; dự báo nhu cầu → phát hiện gian lận &amp; tối ưu chuyển đổi → generative AI, đạo đức &amp; quyền riêng tư. Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('eai201-1-1-ai-ecommerce-overview', '1.1 — AI landscape & business value|||1.1 — Bức tranh AI & giá trị kinh doanh',
  'AI xuất hiện ở đâu trong hành trình mua hàng; vòng lặp dữ liệu (data flywheel); chỉ số kinh doanh AI cần tác động (CR, AOV, CLV, cart abandonment).',
  [[
    `<span class="eyebrow">EAI201 · Chapter 1 · Lesson 1.1</span>
<h2>AI landscape &amp; business value</h2>
<h3>Where AI shows up in the shopping journey</h3>
<ul>
<li><strong>Discovery</strong> — search ranking, visual/voice search, recommendations on the homepage.</li>
<li><strong>Consideration</strong> — personalized product feeds, chatbots answering questions, review summarization.</li>
<li><strong>Purchase</strong> — dynamic pricing, fraud/risk scoring on checkout, cart-abandonment prediction.</li>
<li><strong>Post-purchase</strong> — support automation, demand forecasting that keeps items in stock, retention offers.</li>
</ul>
<h3>The data flywheel</h3>
<pre><code>More traffic &amp; purchases -&gt; more behavioral data
    -&gt; better models (search / recommend / price)
    -&gt; more relevant experience -&gt; higher conversion &amp; retention
    -&gt; more traffic &amp; purchases (loop closes)
</code></pre>
<h3>Business metrics AI is expected to move</h3>
<ul>
<li><strong>Conversion rate (CR)</strong> — % of visits that end in a purchase.</li>
<li><strong>Average order value (AOV)</strong> — revenue per order (cross-sell/upsell target).</li>
<li><strong>Customer lifetime value (CLV)</strong> — total value a customer brings over time.</li>
<li><strong>Cart abandonment rate</strong> — carts started but never checked out.</li>
</ul>
<div class="callout"><span class="badge">Not magic, math on data</span> Every AI feature in this course sits on the same base: enough clean behavioral/transaction data, a model trained on it, and a business metric it is supposed to move.</div>`,
    `<span class="eyebrow">EAI201 · Chương 1 · Bài 1.1</span>
<h2>Bức tranh AI &amp; giá trị kinh doanh</h2>
<h3>AI xuất hiện ở đâu trong hành trình mua hàng</h3>
<ul>
<li><strong>Khám phá (discovery)</strong> — xếp hạng tìm kiếm, tìm bằng hình ảnh/giọng nói, gợi ý trên trang chủ.</li>
<li><strong>Xem xét (consideration)</strong> — bảng feed sản phẩm cá nhân hoá, chatbot trả lời câu hỏi, tóm tắt đánh giá.</li>
<li><strong>Mua hàng</strong> — định giá động, chấm điểm rủi ro/gian lận lúc thanh toán, dự đoán bỏ giỏ hàng.</li>
<li><strong>Sau mua</strong> — tự động hoá hỗ trợ, dự báo nhu cầu giúp còn hàng, ưu đãi giữ chân khách.</li>
</ul>
<h3>Vòng lặp dữ liệu (data flywheel)</h3>
<pre><code>Nhiều lượt ghé &amp; đơn mua -&gt; nhiều dữ liệu hành vi
    -&gt; mô hình tốt hơn (tìm kiếm / gợi ý / định giá)
    -&gt; trải nghiệm phù hợp hơn -&gt; chuyển đổi &amp; giữ chân cao hơn
    -&gt; nhiều lượt ghé &amp; đơn mua hơn (vòng lặp khép lại)
</code></pre>
<h3>Chỉ số kinh doanh AI cần tác động</h3>
<ul>
<li><strong>Tỉ lệ chuyển đổi (CR)</strong> — % lượt ghé kết thúc bằng đơn mua.</li>
<li><strong>Giá trị đơn trung bình (AOV)</strong> — doanh thu mỗi đơn (mục tiêu bán chéo/bán thêm).</li>
<li><strong>Giá trị trọn đời khách hàng (CLV)</strong> — tổng giá trị một khách mang lại theo thời gian.</li>
<li><strong>Tỉ lệ bỏ giỏ hàng</strong> — giỏ hàng đã tạo nhưng không thanh toán.</li>
</ul>
<div class="callout"><span class="badge">Không phải ma thuật, là toán trên dữ liệu</span> Mọi tính năng AI trong môn này đều dựa trên cùng một nền: đủ dữ liệu hành vi/giao dịch sạch, một mô hình học từ đó, và một chỉ số kinh doanh nó phải tác động.</div>`,
  ]]);

const c1q = quiz('eai201-quiz-1', 'Quiz 1 — AI landscape & business value|||Quiz 1 — Bức tranh AI & giá trị KD', [
  { id: 'q1', question: 'AI ở giai đoạn "khám phá" (discovery) trong hành trình mua hàng thường là?', options: ['Chấm điểm gian lận lúc thanh toán', 'Tìm kiếm & gợi ý sản phẩm', 'Dự báo tồn kho', 'Chatbot hỗ trợ sau mua'], correctIndex: 1, explanation: 'Discovery là lúc khách tìm và được gợi ý sản phẩm — search & recommendation.' },
  { id: 'q2', question: 'AOV (Average Order Value) đo điều gì?', options: ['Tỉ lệ khách rời trang', 'Doanh thu trung bình mỗi đơn hàng', 'Số lượt ghé mỗi ngày', 'Tốc độ tải trang'], correctIndex: 1, explanation: 'AOV = giá trị đơn trung bình, mục tiêu của cross-sell/upsell.' },
  { id: 'q3', question: '"Vòng lặp dữ liệu" (data flywheel) trong TMĐT nghĩa là?', options: ['Dữ liệu chỉ dùng một lần rồi xoá', 'Nhiều dữ liệu → mô hình tốt hơn → trải nghiệm tốt hơn → thêm dữ liệu', 'AI thay hoàn toàn con người', 'Giá cả không đổi theo thời gian'], correctIndex: 1, explanation: 'Flywheel là vòng khép kín: dữ liệu nuôi mô hình, mô hình cải thiện trải nghiệm, trải nghiệm tạo thêm dữ liệu.' },
]);

const c2 = doc('eai201-2-1-recommendation-engines', '2.1 — Recommendation engines|||2.1 — Hệ khuyến nghị',
  'Collaborative filtering (user-based/item-based), content-based filtering, hybrid; cold-start problem; chỉ số CTR & conversion lift.',
  [[
    `<span class="eyebrow">EAI201 · Chapter 2 · Lesson 2.1</span>
<h2>Recommendation engines</h2>
<h3>Two core approaches</h3>
<ul>
<li><strong>Collaborative filtering</strong> — "customers like you also bought…". <em>User-based</em>: finds similar shoppers by purchase/rating history. <em>Item-based</em>: finds items frequently bought/viewed together (e.g. Amazon's "frequently bought together").</li>
<li><strong>Content-based filtering</strong> — recommends items similar in <em>attributes</em> (category, brand, price range, description) to what a user already liked, using no other users' data.</li>
<li><strong>Hybrid</strong> — most production systems (Amazon, Shopify) blend both, plus business rules (margin, inventory).</li>
</ul>
<h3>The cold-start problem</h3>
<p>A brand-new user has no history (nothing to collaborate on); a brand-new product has no interactions (nothing to compare). Fixes: content-based fallback, popularity/trending defaults, and explicit onboarding questions ("what are you shopping for today?").</p>
<pre><code>User A bought: running shoes, protein bar, water bottle
User B bought: running shoes, protein bar, sports watch
-&gt; A and B are "similar" (collaborative filtering)
-&gt; recommend "sports watch" to A
</code></pre>
<h3>Measuring success</h3>
<ul>
<li><strong>CTR (click-through rate)</strong> — % of shown recommendations that get clicked.</li>
<li><strong>Conversion lift</strong> — extra purchases attributable to the recommendation vs. a control group (A/B test), the number that actually matters to the business.</li>
</ul>
<div class="callout"><span class="badge">CTR ≠ revenue</span> A recommendation can win clicks without winning sales — always measure against a held-out control group, not clicks alone.</div>`,
    `<span class="eyebrow">EAI201 · Chương 2 · Bài 2.1</span>
<h2>Hệ khuyến nghị (recommendation engine)</h2>
<h3>Hai cách tiếp cận chính</h3>
<ul>
<li><strong>Lọc cộng tác (collaborative filtering)</strong> — "khách giống bạn cũng mua…". <em>Theo người dùng</em>: tìm khách có lịch sử mua/đánh giá giống nhau. <em>Theo sản phẩm</em>: tìm sản phẩm thường được mua/xem cùng nhau (vd "thường mua cùng" của Amazon).</li>
<li><strong>Lọc theo nội dung (content-based)</strong> — gợi ý sản phẩm có <em>thuộc tính</em> giống (ngành hàng, thương hiệu, mức giá, mô tả) với thứ người dùng đã thích, không cần dữ liệu người dùng khác.</li>
<li><strong>Lai (hybrid)</strong> — hầu hết hệ thực tế (Amazon, Shopify) kết hợp cả hai, cộng thêm quy tắc kinh doanh (biên lợi nhuận, tồn kho).</li>
</ul>
<h3>Bài toán cold-start</h3>
<p>Khách mới hoàn toàn chưa có lịch sử (không có gì để cộng tác); sản phẩm mới hoàn toàn chưa có tương tác (không có gì để so sánh). Cách xử lý: dùng content-based làm dự phòng, đề xuất theo mức phổ biến/đang hot, và hỏi trực tiếp lúc onboarding ("hôm nay bạn tìm mua gì?").</p>
<pre><code>Khách A đã mua: giày chạy, thanh protein, bình nước
Khách B đã mua: giày chạy, thanh protein, đồng hồ thể thao
-&gt; A và B "giống nhau" (collaborative filtering)
-&gt; gợi ý "đồng hồ thể thao" cho A
</code></pre>
<h3>Đo hiệu quả</h3>
<ul>
<li><strong>CTR (tỉ lệ nhấp)</strong> — % gợi ý được hiển thị mà khách bấm vào.</li>
<li><strong>Conversion lift</strong> — số đơn mua thêm nhờ gợi ý so với nhóm đối chứng (A/B test) — con số thực sự có ý nghĩa với kinh doanh.</li>
</ul>
<div class="callout"><span class="badge">CTR ≠ doanh thu</span> Một gợi ý có thể thắng về lượt click nhưng không thắng về doanh số — luôn đo bằng nhóm đối chứng, đừng chỉ nhìn lượt click.</div>`,
  ]]);

const c2q = quiz('eai201-quiz-2', 'Quiz 2 — Recommendation engines|||Quiz 2 — Hệ khuyến nghị', [
  { id: 'q1', question: '"Khách giống bạn cũng mua…" là ví dụ của?', options: ['Content-based filtering', 'Collaborative filtering', 'Dynamic pricing', 'Fraud detection'], correctIndex: 1, explanation: 'Collaborative filtering dựa vào sự giống nhau giữa người dùng/sản phẩm qua lịch sử tương tác.' },
  { id: 'q2', question: 'Cold-start problem là gì?', options: ['Server chạy chậm lúc khởi động', 'Người/sản phẩm mới chưa có dữ liệu tương tác để gợi ý', 'Giá sản phẩm quá cao', 'Kho hàng hết hàng'], correctIndex: 1, explanation: 'Không có lịch sử → không có gì để so sánh/cộng tác, cần fallback (content-based, phổ biến).' },
  { id: 'q3', question: 'Vì sao chỉ đo CTR của gợi ý là chưa đủ?', options: ['CTR luôn bằng 100%', 'CTR đo doanh thu trực tiếp', 'CTR có thể cao mà không tăng doanh số thật — cần đo conversion lift qua A/B test', 'CTR không thể đo được'], correctIndex: 2, explanation: 'Cần so với nhóm đối chứng để biết gợi ý có thực sự tạo thêm đơn mua hay không.' },
]);

const c3 = doc('eai201-3-1-personalization-segmentation', '3.1 — Personalization & customer segmentation|||3.1 — Cá nhân hoá & phân khúc khách hàng',
  'Phân khúc RFM, clustering; cá nhân hoá trang chủ/email/push; behavioral targeting.',
  [[
    `<span class="eyebrow">EAI201 · Chapter 3 · Lesson 3.1</span>
<h2>Personalization &amp; customer segmentation</h2>
<h3>RFM segmentation</h3>
<p>A classic, simple model that scores every customer on three numbers:</p>
<ul>
<li><strong>Recency (R)</strong> — how long since their last purchase.</li>
<li><strong>Frequency (F)</strong> — how often they buy.</li>
<li><strong>Monetary (M)</strong> — how much they spend.</li>
</ul>
<pre><code>High R (recent) + High F + High M  -&gt; "Champions": VIP treatment, early access
Low R (long ago) + High F + High M -&gt; "At risk": win-back campaign
Low R + Low F + Low M              -&gt; "Lost": low-cost or no targeting
</code></pre>
<h3>Beyond RFM: clustering</h3>
<p>AI-driven segmentation uses <strong>clustering algorithms</strong> (e.g. k-means) over many features at once — browsing category, price sensitivity, device, time-of-day — to find customer groups a human analyst wouldn't think to define manually.</p>
<h3>Where personalization shows up</h3>
<ul>
<li><strong>Homepage</strong> — different hero banners/products per segment.</li>
<li><strong>Email/push</strong> — different subject lines, timing, and offers per segment.</li>
<li><strong>Behavioral targeting</strong> — ads/offers driven by browsing behavior (viewed-but-not-bought retargeting).</li>
</ul>
<div class="callout"><span class="badge">Segments must lead to different action</span> A segmentation is only useful if two segments actually get treated differently — otherwise it's a report, not a personalization system.</div>`,
    `<span class="eyebrow">EAI201 · Chương 3 · Bài 3.1</span>
<h2>Cá nhân hoá &amp; phân khúc khách hàng</h2>
<h3>Phân khúc RFM</h3>
<p>Một mô hình kinh điển, đơn giản: chấm mỗi khách hàng theo ba con số:</p>
<ul>
<li><strong>Recency (R)</strong> — mua lần cuối cách đây bao lâu.</li>
<li><strong>Frequency (F)</strong> — mua thường xuyên đến mức nào.</li>
<li><strong>Monetary (M)</strong> — chi tiêu bao nhiều.</li>
</ul>
<pre><code>R cao (gần đây) + F cao + M cao   -&gt; "Khách VIP": đãi ngộ đặc biệt, mở bán sớm
R thấp (đã lâu) + F cao + M cao   -&gt; "Sắp mất": chiến dịch lôi kéo lại
R thấp + F thấp + M thấp          -&gt; "Đã mất": nhắm mục tiêu chi phí thấp hoặc bỏ qua
</code></pre>
<h3>Vượt xa RFM: clustering</h3>
<p>Phân khúc bằng AI dùng <strong>thuật toán phân cụm (clustering)</strong> (vd k-means) trên nhiều đặc trưng cùng lúc — ngành hàng đang xem, độ nhạy giá, thiết bị dùng, thời điểm trong ngày — để tìm ra các nhóm khách hàng mà con người khó tự định nghĩa bằng tay.</p>
<h3>Cá nhân hoá xuất hiện ở đâu</h3>
<ul>
<li><strong>Trang chủ</strong> — banner/sản phẩm nổi bật khác nhau theo phân khúc.</li>
<li><strong>Email/push</strong> — tiêu đề, thời điểm gửi, ưu đãi khác nhau theo phân khúc.</li>
<li><strong>Behavioral targeting</strong> — quảng cáo/ưu đãi dựa theo hành vi xem (retargeting cho sản phẩm đã xem nhưng chưa mua).</li>
</ul>
<div class="callout"><span class="badge">Phân khúc phải dẫn tới hành động khác nhau</span> Một cách phân khúc chỉ có ích nếu hai nhóm thực sự được đối xử khác nhau — không thì nó chỉ là báo cáo, chưa phải hệ cá nhân hoá.</div>`,
  ]]);

const c3q = quiz('eai201-quiz-3', 'Quiz 3 — Personalization & segmentation|||Quiz 3 — Cá nhân hoá & phân khúc', [
  { id: 'q1', question: 'RFM là viết tắt của?', options: ['Recency, Frequency, Monetary', 'Rating, Feedback, Metric', 'Return, Fraud, Margin', 'Revenue, Forecast, Model'], correctIndex: 0, explanation: 'RFM: Recency (lần mua gần nhất), Frequency (tần suất), Monetary (chi tiêu).' },
  { id: 'q2', question: 'Khách hàng có Recency thấp (đã lâu không mua) + Frequency/Monetary cao nên xử lý ra sao?', options: ['Xoá khỏi hệ thống', 'Chiến dịch "win-back" lôi kéo lại', 'Tăng giá sản phẩm cho họ', 'Không làm gì'], correctIndex: 1, explanation: 'Đây là nhóm "at risk" — từng chi nhiều nhưng lâu rồi không mua, cần chiến dịch lôi kéo lại.' },
  { id: 'q3', question: 'Vì sao clustering (vd k-means) mạnh hơn phân khúc RFM thủ công?', options: ['Nó không cần dữ liệu', 'Nó tự tìm nhóm khách hàng từ nhiều đặc trưng mà con người khó định nghĩa tay', 'Nó chỉ dùng đúng 3 chỉ số như RFM', 'Nó chạy nhanh hơn nên chính xác hơn'], correctIndex: 1, explanation: 'Clustering xử lý nhiều chiều dữ liệu đồng thời, phát hiện nhóm mà quy tắc tay không thấy.' },
]);

const c4 = doc('eai201-4-1-chatbots-virtual-assistants', '4.1 — Chatbots & virtual assistants|||4.1 — Chatbot & trợ lý ảo',
  'Chatbot rule-based vs AI (NLU/LLM); các ca dùng (tra đơn, FAQ, gợi ý qua chat); chuyển tiếp cho nhân viên (handoff).',
  [[
    `<span class="eyebrow">EAI201 · Chapter 4 · Lesson 4.1</span>
<h2>Chatbots &amp; virtual assistants</h2>
<h3>Rule-based vs. AI-driven</h3>
<ul>
<li><strong>Rule-based (decision-tree) bots</strong> — fixed menus/buttons ("Track order" / "Return item"); cheap, predictable, but break on anything unexpected.</li>
<li><strong>AI-driven bots</strong> — use <strong>NLU (natural language understanding)</strong> to parse free-text intent ("where's my package?"), or a full <strong>LLM</strong> to hold open-ended conversations, summarize policies, and even recommend products conversationally.</li>
</ul>
<h3>Common e-commerce use cases</h3>
<ul>
<li><strong>Order tracking &amp; status</strong> — pulls live order data instead of a human reading it off a dashboard.</li>
<li><strong>FAQ &amp; policy answers</strong> — shipping, returns, sizing — instantly, 24/7.</li>
<li><strong>Conversational recommendations</strong> — "I need a gift under $50 for a coffee lover" → the bot searches and filters the catalog.</li>
</ul>
<h3>Human handoff</h3>
<p>No bot should be a dead end. Good design detects <strong>low confidence</strong> or <strong>frustration signals</strong> (repeated questions, negative sentiment, explicit "talk to a human") and escalates to a live agent with the full chat context attached — losing that context is the single most common chatbot complaint.</p>
<div class="callout"><span class="badge">Bot handles volume, human handles edge cases</span> The economics work when the bot resolves the high-volume, repetitive 70-80% and hands the hard 20-30% cleanly to a person.</div>`,
    `<span class="eyebrow">EAI201 · Chương 4 · Bài 4.1</span>
<h2>Chatbot &amp; trợ lý ảo</h2>
<h3>Rule-based vs. dùng AI</h3>
<ul>
<li><strong>Bot theo quy tắc (rule-based/decision-tree)</strong> — menu/nút cố định ("Tra đơn hàng" / "Đổi trả"); rẻ, dễ đoán, nhưng gãy ngay khi gặp câu hỏi ngoài kịch bản.</li>
<li><strong>Bot dùng AI</strong> — dùng <strong>NLU (hiểu ngôn ngữ tự nhiên)</strong> để phân tích ý định từ văn bản tự do ("hàng của tôi đang ở đâu?"), hoặc dùng thẳng <strong>LLM</strong> để trò chuyện mở, tóm tắt chính sách, thậm chí gợi ý sản phẩm qua hội thoại.</li>
</ul>
<h3>Ca dùng phổ biến trong TMĐT</h3>
<ul>
<li><strong>Tra cứu &amp; trạng thái đơn hàng</strong> — lấy dữ liệu đơn hàng trực tiếp thay vì nhân viên đọc từ dashboard.</li>
<li><strong>Trả lời FAQ &amp; chính sách</strong> — vận chuyển, đổi trả, size — ngay lập tức, 24/7.</li>
<li><strong>Gợi ý qua hội thoại</strong> — "tôi cần món quà dưới 1 triệu cho người mê cà phê" → bot tìm và lọc trong catalog.</li>
</ul>
<h3>Chuyển tiếp cho người (handoff)</h3>
<p>Không bot nào nên là ngõ cụt. Thiết kế tốt phát hiện <strong>độ tin cậy thấp</strong> hoặc <strong>tín hiệu bực bội</strong> (hỏi lặp lại, cảm xúc tiêu cực, yêu cầu thẳng "nói chuyện với người") và chuyển sang nhân viên trực tiếp kèm toàn bộ ngữ cảnh chat — mất ngữ cảnh này là lời phàn nàn phổ biến nhất về chatbot.</p>
<div class="callout"><span class="badge">Bot xử lý số lượng, người xử lý ca khó</span> Bài toán kinh tế chỉ hợp lý khi bot giải quyết được 70-80% câu hỏi lặp lại số lượng lớn và chuyển gọn 20-30% ca khó cho người.</div>`,
  ]]);

const c4q = quiz('eai201-quiz-4', 'Quiz 4 — Chatbots & virtual assistants|||Quiz 4 — Chatbot & trợ lý ảo', [
  { id: 'q1', question: 'Điểm yếu chính của chatbot rule-based (menu cố định) là?', options: ['Quá đắt để vận hành', 'Gãy khi khách hỏi ngoài kịch bản đã định nghĩa', 'Không thể trả lời FAQ', 'Chạy chậm hơn AI'], correctIndex: 1, explanation: 'Rule-based chỉ xử lý được các nhánh đã định nghĩa sẵn, gặp câu hỏi lạ là bó tay.' },
  { id: 'q2', question: 'NLU trong chatbot AI dùng để làm gì?', options: ['Tính giá sản phẩm', 'Hiểu ý định từ văn bản tự do của khách', 'Kiểm tra tồn kho', 'Mã hoá dữ liệu thanh toán'], correctIndex: 1, explanation: 'NLU (Natural Language Understanding) giúp bot hiểu câu hỏi tự do, không chỉ nút bấm cố định.' },
  { id: 'q3', question: 'Vì sao "human handoff" (chuyển cho nhân viên) quan trọng?', options: ['Để giảm chi phí vận hành bot', 'Để bot không cần trả lời gì cả', 'Vì bot không nên là ngõ cụt khi gặp ca khó/khách bực bội — cần chuyển kèm ngữ cảnh chat', 'Để tăng thời gian chờ của khách'], correctIndex: 2, explanation: 'Handoff tốt giữ ngữ cảnh và xử lý đúng lúc bot không đủ khả năng, tránh khách bỏ đi.' },
]);

const c5 = doc('eai201-5-1-intelligent-search', '5.1 — Intelligent, visual & voice search|||5.1 — Tìm kiếm thông minh, hình ảnh & giọng nói',
  'Semantic/vector search (embeddings); tìm kiếm bằng hình ảnh (image similarity); tìm kiếm bằng giọng nói (speech-to-text + NLU).',
  [[
    `<span class="eyebrow">EAI201 · Chapter 5 · Lesson 5.1</span>
<h2>Intelligent, visual &amp; voice search</h2>
<h3>Semantic (vector) search</h3>
<p>Classic keyword search fails when the shopper's words don't match the product title ("comfy shoes for standing all day" ≠ "orthopedic insole sneakers"). <strong>Embeddings</strong> turn text into vectors that capture <em>meaning</em>, not just exact words — so the search matches by similarity in that vector space, understanding synonyms and intent.</p>
<pre><code>Query: "comfy shoes for standing all day"
   -&gt; embedding vector (meaning, not exact words)
   -&gt; compare against product embeddings
   -&gt; closest match: "orthopedic insole sneakers" (even with zero shared words)
</code></pre>
<h3>Visual search</h3>
<p>A shopper uploads (or screenshots) a photo; a computer-vision model extracts a feature vector describing color, shape, and pattern, then finds catalog items with the closest vector — "shop this look" from a photo instead of typing words at all.</p>
<h3>Voice search</h3>
<p>Pipeline: <strong>speech-to-text</strong> converts audio to text, then the same NLU/semantic search used for typed queries takes over. Voice queries tend to be longer and more conversational ("find me a red dress for a summer wedding") than typed ones.</p>
<div class="callout"><span class="badge">Same backend, different front door</span> Text, image, and voice search all funnel into the same underlying catalog-matching problem — only the "turn the input into a comparable vector" step changes.</div>`,
    `<span class="eyebrow">EAI201 · Chương 5 · Bài 5.1</span>
<h2>Tìm kiếm thông minh, hình ảnh &amp; giọng nói</h2>
<h3>Tìm kiếm theo ngữ nghĩa (vector search)</h3>
<p>Tìm kiếm theo từ khoá cổ điển thất bại khi lời khách không khớp tên sản phẩm ("giày thoải mái để đứng cả ngày" ≠ "giày thể thao đế lót chỉnh hình"). <strong>Embeddings</strong> biến văn bản thành vector nắm bắt <em>ý nghĩa</em>, không chỉ từ đúng chữ — nên tìm kiếm khớp theo độ tương đồng trong không gian vector đó, hiểu được từ đồng nghĩa và ý định.</p>
<pre><code>Câu tìm: "giày thoải mái để đứng cả ngày"
   -&gt; vector embedding (ý nghĩa, không phải từ đúng chữ)
   -&gt; so sánh với embedding sản phẩm
   -&gt; khớp gần nhất: "giày thể thao đế lót chỉnh hình" (dù không chung từ nào)
</code></pre>
<h3>Tìm kiếm bằng hình ảnh</h3>
<p>Khách tải lên (hoặc chụp màn hình) một ảnh; mô hình computer vision rút ra vector đặc trưng mô tả màu, hình dạng, hoa văn, rồi tìm sản phẩm trong catalog có vector gần nhất — "mua theo phong cách này" từ một tấm ảnh, không cần gõ chữ nào.</p>
<h3>Tìm kiếm bằng giọng nói</h3>
<p>Chuỗi xử lý: <strong>speech-to-text</strong> chuyển âm thanh thành văn bản, rồi cùng cơ chế NLU/tìm kiếm ngữ nghĩa dùng cho câu gõ tay tiếp quản. Câu tìm bằng giọng nói thường dài và tự nhiên hơn ("tìm cho tôi váy đỏ đi dự cưới mùa hè") so với gõ tay.</p>
<div class="callout"><span class="badge">Cùng lõi, khác cửa vào</span> Tìm kiếm bằng văn bản, hình ảnh, giọng nói đều đổ về cùng một bài toán khớp catalog phía sau — chỉ khác bước "biến đầu vào thành vector so sánh được".</div>`,
  ]]);

const c5q = quiz('eai201-quiz-5', 'Quiz 5 — Intelligent, visual & voice search|||Quiz 5 — Tìm kiếm thông minh, ảnh & giọng nói', [
  { id: 'q1', question: 'Semantic (vector) search khác tìm kiếm từ khoá cổ điển ở điểm nào?', options: ['Chỉ khớp đúng từng chữ', 'Khớp theo ý nghĩa/độ tương đồng vector, hiểu được từ đồng nghĩa', 'Không cần dữ liệu sản phẩm', 'Chạy chậm hơn nên chính xác hơn'], correctIndex: 1, explanation: 'Embedding nắm bắt ý nghĩa, nên câu tìm và tên sản phẩm không cần chung từ vẫn khớp được.' },
  { id: 'q2', question: 'Tìm kiếm bằng hình ảnh (visual search) hoạt động dựa trên?', options: ['So sánh giá sản phẩm', 'Vector đặc trưng (màu/hình dạng/hoa văn) rút ra từ ảnh, so khớp với catalog', 'Đọc chữ trong ảnh', 'Chỉ dùng được với ảnh đen trắng'], correctIndex: 1, explanation: 'Computer vision rút đặc trưng ảnh thành vector rồi tìm sản phẩm gần nhất trong không gian đó.' },
  { id: 'q3', question: 'Bước đầu tiên trong pipeline tìm kiếm bằng giọng nói là?', options: ['Dynamic pricing', 'Speech-to-text (chuyển âm thanh thành văn bản)', 'Fraud detection', 'Content-based filtering'], correctIndex: 1, explanation: 'Sau khi có văn bản từ giọng nói, hệ thống dùng lại NLU/semantic search như câu gõ tay.' },
]);

const c6 = doc('eai201-6-1-dynamic-pricing-forecasting', '6.1 — Dynamic pricing & demand forecasting|||6.1 — Định giá động & dự báo nhu cầu/tồn kho',
  'Định giá động (theo nhu cầu, đối thủ, thời gian); dự báo nhu cầu bằng time series; tối ưu tồn kho.',
  [[
    `<span class="eyebrow">EAI201 · Chapter 6 · Lesson 6.1</span>
<h2>Dynamic pricing &amp; demand forecasting</h2>
<h3>Dynamic pricing</h3>
<p>Prices that adjust automatically based on signals, instead of staying fixed:</p>
<ul>
<li><strong>Demand-based</strong> — raise price when many shoppers are viewing/buying the same item (airline-ticket style surge).</li>
<li><strong>Competitor-based</strong> — track competitor prices and adjust to stay within a target range (common in marketplaces).</li>
<li><strong>Time-based</strong> — flash sales, clearance discounts that increase as a product ages or a deadline approaches.</li>
</ul>
<h3>Demand forecasting</h3>
<p><strong>Time series models</strong> (from simple moving averages to modern ML forecasters) predict future demand per SKU from historical sales, seasonality (holidays, weekends), promotions, and even weather for some categories.</p>
<pre><code>Historical sales + seasonality + promo calendar
   -&gt; forecast model
   -&gt; predicted demand per SKU per week
   -&gt; inventory/reorder decisions
</code></pre>
<h3>Inventory optimization</h3>
<p>Forecasts feed directly into <strong>reorder points and safety stock</strong>: order too early/much and capital sits in a warehouse; order too late/little and the item stocks out mid-demand spike, losing the sale (and often the customer's trust).</p>
<div class="callout"><span class="badge">Pricing and forecasting are the same coin</span> A demand forecast that's wrong doesn't just risk stockouts — it also feeds bad inputs into demand-based dynamic pricing.</div>`,
    `<span class="eyebrow">EAI201 · Chương 6 · Bài 6.1</span>
<h2>Định giá động &amp; dự báo nhu cầu/tồn kho</h2>
<h3>Định giá động (dynamic pricing)</h3>
<p>Giá tự động điều chỉnh theo tín hiệu, thay vì cố định:</p>
<ul>
<li><strong>Theo nhu cầu</strong> — tăng giá khi nhiều khách đang xem/mua cùng một sản phẩm (kiểu "surge" như giá vé máy bay).</li>
<li><strong>Theo đối thủ</strong> — theo dõi giá đối thủ và điều chỉnh để nằm trong khoảng mục tiêu (phổ biến trên các sàn marketplace).</li>
<li><strong>Theo thời gian</strong> — flash sale, giảm giá thanh lý tăng dần khi sản phẩm cũ đi hoặc gần hạn.</li>
</ul>
<h3>Dự báo nhu cầu</h3>
<p><strong>Mô hình time series</strong> (từ trung bình động đơn giản đến các mô hình ML dự báo hiện đại) đoán nhu cầu tương lai cho từng SKU dựa trên doanh số lịch sử, tính mùa vụ (lễ, cuối tuần), khuyến mãi, và cả thời tiết với vài ngành hàng.</p>
<pre><code>Doanh số lịch sử + tính mùa vụ + lịch khuyến mãi
   -&gt; mô hình dự báo
   -&gt; nhu cầu dự đoán theo từng SKU mỗi tuần
   -&gt; quyết định nhập/đặt hàng tồn kho
</code></pre>
<h3>Tối ưu tồn kho</h3>
<p>Dự báo đổ trực tiếp vào <strong>điểm đặt hàng lại (reorder point) và tồn kho an toàn</strong>: đặt quá sớm/nhiều thì vốn nằm im trong kho; đặt quá muộn/ít thì hết hàng ngay lúc nhu cầu tăng vọt, mất đơn (và thường mất cả niềm tin của khách).</p>
<div class="callout"><span class="badge">Định giá và dự báo là hai mặt một đồng xu</span> Dự báo nhu cầu sai không chỉ gây hết hàng — nó còn đưa đầu vào sai vào chính hệ định giá động theo nhu cầu.</div>`,
  ]]);

const c6q = quiz('eai201-quiz-6', 'Quiz 6 — Dynamic pricing & forecasting|||Quiz 6 — Định giá động & dự báo', [
  { id: 'q1', question: 'Định giá động "theo nhu cầu" (demand-based) hoạt động thế nào?', options: ['Giá luôn cố định', 'Tăng giá khi nhiều khách đang xem/mua cùng sản phẩm', 'Giảm giá mỗi ngày một ít bất kể nhu cầu', 'Chỉ đổi giá theo mùa'], correctIndex: 1, explanation: 'Đây là kiểu định giá "surge" — giá tăng khi nhu cầu tức thời cao.' },
  { id: 'q2', question: 'Dự báo nhu cầu (demand forecasting) dùng dữ liệu gì làm đầu vào chính?', options: ['Chỉ giá đối thủ', 'Doanh số lịch sử, tính mùa vụ, lịch khuyến mãi', 'Đánh giá sản phẩm', 'Số lượng nhân viên kho'], correctIndex: 1, explanation: 'Time series model học từ doanh số quá khứ cộng các yếu tố mùa vụ/khuyến mãi để đoán tương lai.' },
  { id: 'q3', question: 'Dự báo nhu cầu sai gây hậu quả gì cho tồn kho?', options: ['Không ảnh hưởng gì vì kho luôn đủ chỗ', 'Đặt hàng quá nhiều gây tồn vốn, hoặc quá ít gây hết hàng mất đơn', 'Chỉ ảnh hưởng đến giao diện web', 'Làm chậm chatbot'], correctIndex: 1, explanation: 'Dự báo sai lệch trực tiếp gây tồn kho dư (vốn chết) hoặc hết hàng (mất đơn/mất khách).' },
]);

const c7 = doc('eai201-7-1-fraud-detection-conversion', '7.1 — Fraud detection & conversion optimization|||7.1 — Phát hiện gian lận & tối ưu chuyển đổi',
  'Phát hiện gian lận bằng anomaly detection & chấm điểm giao dịch; tối ưu chuyển đổi qua A/B testing và dự đoán bỏ giỏ hàng.',
  [[
    `<span class="eyebrow">EAI201 · Chapter 7 · Lesson 7.1</span>
<h2>Fraud detection &amp; conversion optimization</h2>
<h3>Fraud detection</h3>
<p>Every transaction gets a <strong>risk score</strong> from a model trained on past fraudulent vs. legitimate orders, using signals like: shipping/billing address mismatch, unusual order size for that customer, device/IP reputation, and velocity (many orders in a short time).</p>
<pre><code>Transaction -&gt; feature extraction (address match, device, velocity, amount)
           -&gt; risk model -&gt; score 0-100
Low score  -&gt; auto-approve
Mid score  -&gt; extra verification (OTP, manual review)
High score -&gt; auto-decline / hold
</code></pre>
<p>This is <strong>anomaly detection</strong>: the model doesn't need to have seen a specific fraud pattern before — it flags orders that look statistically different from the customer's or the platform's normal behavior.</p>
<h3>Conversion rate optimization (CRO)</h3>
<ul>
<li><strong>A/B testing</strong> — show two versions of a page/flow to random visitor splits, measure which converts better; the disciplined way to know an AI feature actually helped (see Chapter 2's "CTR ≠ revenue" lesson).</li>
<li><strong>Cart-abandonment prediction</strong> — a model flags sessions likely to abandon (idle time, hesitation on the price/shipping page) and triggers an intervention (discount popup, reminder email).</li>
<li><strong>Exit-intent detection</strong> — mouse movement toward closing the tab/back button triggers a last-chance offer.</li>
</ul>
<div class="callout"><span class="badge">Same tool, opposite goal</span> Fraud detection and conversion optimization both score a session in real time — one to block a bad actor, the other to rescue a good one from leaving empty-handed.</div>`,
    `<span class="eyebrow">EAI201 · Chương 7 · Bài 7.1</span>
<h2>Phát hiện gian lận &amp; tối ưu chuyển đổi</h2>
<h3>Phát hiện gian lận</h3>
<p>Mỗi giao dịch nhận một <strong>điểm rủi ro</strong> từ mô hình học trên các đơn gian lận và hợp lệ trong quá khứ, dùng các tín hiệu như: địa chỉ giao/thanh toán không khớp, quy mô đơn bất thường so với lịch sử khách đó, độ tin cậy thiết bị/IP, và tốc độ (nhiều đơn trong thời gian ngắn).</p>
<pre><code>Giao dịch -&gt; trích đặc trưng (khớp địa chỉ, thiết bị, tốc độ, số tiền)
         -&gt; mô hình rủi ro -&gt; điểm 0-100
Điểm thấp -&gt; tự động duyệt
Điểm trung -&gt; xác minh thêm (OTP, xét duyệt tay)
Điểm cao   -&gt; tự động từ chối / giữ lại
</code></pre>
<p>Đây là <strong>anomaly detection (phát hiện bất thường)</strong>: mô hình không cần từng thấy đúng dạng gian lận đó trước đây — nó gắn cờ những đơn khác biệt bất thường so với hành vi thường thấy của khách đó hoặc của cả sàn.</p>
<h3>Tối ưu tỉ lệ chuyển đổi (CRO)</h3>
<ul>
<li><strong>A/B testing</strong> — hiển thị hai phiên bản trang/luồng cho hai nhóm khách ngẫu nhiên, đo bên nào chuyển đổi tốt hơn; đây là cách nghiêm túc để biết một tính năng AI có thực sự giúp ích (nhớ lại bài học "CTR ≠ doanh thu" ở Chương 2).</li>
<li><strong>Dự đoán bỏ giỏ hàng</strong> — mô hình gắn cờ các lượt duyệt có khả năng bỏ giỏ (dừng lại lâu, chần chừ ở trang giá/vận chuyển) và kích hoạt can thiệp (popup giảm giá, email nhắc).</li>
<li><strong>Phát hiện ý định thoát (exit-intent)</strong> — chuột di về nút đóng tab/back kích hoạt ưu đãi "cơ hội cuối".</li>
</ul>
<div class="callout"><span class="badge">Cùng công cụ, mục tiêu ngược nhau</span> Phát hiện gian lận và tối ưu chuyển đổi đều chấm điểm phiên khách theo thời gian thực — một để chặn kẻ xấu, một để cứu người tốt khỏi rời đi tay không.</div>`,
  ]]);

const c7q = quiz('eai201-quiz-7', 'Quiz 7 — Fraud detection & conversion optimization|||Quiz 7 — Gian lận & chuyển đổi', [
  { id: 'q1', question: 'Tín hiệu nào KHÔNG thường dùng để chấm điểm rủi ro gian lận?', options: ['Địa chỉ giao/thanh toán không khớp', 'Tốc độ đặt nhiều đơn trong thời gian ngắn', 'Màu sắc logo trên trang chủ', 'Độ tin cậy thiết bị/IP'], correctIndex: 2, explanation: 'Màu logo không liên quan hành vi giao dịch; ba tín hiệu còn lại đều là dấu hiệu rủi ro thật.' },
  { id: 'q2', question: 'A/B testing dùng để?', options: ['Tăng tốc server', 'So sánh hai phiên bản trang/luồng để biết bên nào chuyển đổi tốt hơn', 'Mã hoá dữ liệu khách hàng', 'Phát hiện gian lận thanh toán'], correctIndex: 1, explanation: 'A/B test chia ngẫu nhiên khách vào 2 nhóm để đo hiệu quả thực sự của một thay đổi.' },
  { id: 'q3', question: 'Mô hình dự đoán bỏ giỏ hàng dựa trên tín hiệu nào?', options: ['Giá cổ phiếu công ty', 'Hành vi trong phiên: thời gian dừng lại, chần chừ ở trang giá/vận chuyển', 'Số lượng nhân viên hỗ trợ', 'Ngày thành lập công ty'], correctIndex: 1, explanation: 'Tín hiệu hành vi trong phiên (idle time, hesitation) là đầu vào chính để dự đoán khả năng bỏ giỏ.' },
]);

const c8 = doc('eai201-8-1-generative-ai-ethics-privacy', '8.1 — Generative AI, ethics & privacy|||8.1 — Generative AI, đạo đức & quyền riêng tư',
  'Generative AI cho mô tả sản phẩm/marketing; đạo đức AI (bias, minh bạch, dark pattern); quyền riêng tư dữ liệu (GDPR, đồng thuận).',
  [[
    `<span class="eyebrow">EAI201 · Chapter 8 · Lesson 8.1</span>
<h2>Generative AI, ethics &amp; privacy</h2>
<h3>Generative AI in e-commerce</h3>
<ul>
<li><strong>Product descriptions</strong> — an LLM drafts SEO-friendly copy from structured attributes (size, material, color) at catalog scale, in seconds instead of hours per SKU.</li>
<li><strong>Marketing copy &amp; images</strong> — ad headlines, email subject lines, and AI-generated product imagery/backgrounds for A/B testing at low cost.</li>
<li><strong>Human review still matters</strong> — generated copy can be factually wrong (a hallucinated material or size) or off-brand; a review step before publishing is standard practice, not optional.</li>
</ul>
<h3>Ethics: bias, transparency, dark patterns</h3>
<ul>
<li><strong>Bias</strong> — a model trained on historical data can learn and repeat historical bias (e.g. pricing or recommending differently by inferred demographic).</li>
<li><strong>Transparency</strong> — shoppers increasingly expect to know when they're talking to a bot, and why a price or recommendation is what it is.</li>
<li><strong>Dark patterns</strong> — using AI's persuasive power for manipulation (fake urgency countdowns, hidden costs surfaced only at checkout) crosses from "personalization" into deception.</li>
</ul>
<h3>Privacy: GDPR and consent</h3>
<p>Personalization needs behavioral data, and data protection law limits how it can be collected and used. Key ideas from <strong>GDPR</strong> (and similar laws elsewhere): explicit <strong>consent</strong> before tracking, the right to know what data is held, and the right to be forgotten (deletion on request).</p>
<div class="callout"><span class="badge">Every chapter's power comes with this chapter's responsibility</span> Recommendation, personalization, pricing and fraud models all run on the same customer data — the ethics and privacy rules here apply to the whole course, not just this chapter.</div>`,
    `<span class="eyebrow">EAI201 · Chương 8 · Bài 8.1</span>
<h2>Generative AI, đạo đức &amp; quyền riêng tư</h2>
<h3>Generative AI trong TMĐT</h3>
<ul>
<li><strong>Mô tả sản phẩm</strong> — LLM soạn nội dung chuẩn SEO từ thuộc tính có cấu trúc (kích cỡ, vật liệu, màu) ở quy mô toàn catalog, trong vài giây thay vì hàng giờ mỗi SKU.</li>
<li><strong>Nội dung marketing &amp; hình ảnh</strong> — tiêu đề quảng cáo, dòng chủ đề email, và hình ảnh/nền sản phẩm do AI tạo để A/B test với chi phí thấp.</li>
<li><strong>Con người vẫn phải kiểm duyệt</strong> — nội dung do AI sinh có thể sai sự thật (bịa chất liệu hoặc kích cỡ) hoặc lệch tông thương hiệu; bước kiểm duyệt trước khi đăng là bắt buộc, không phải tuỳ chọn.</li>
</ul>
<h3>Đạo đức: thiên vị, minh bạch, dark pattern</h3>
<ul>
<li><strong>Thiên vị (bias)</strong> — mô hình học trên dữ liệu lịch sử có thể học và lặp lại thiên vị lịch sử (vd định giá hoặc gợi ý khác nhau theo nhóm nhân khẩu học suy đoán được).</li>
<li><strong>Minh bạch</strong> — khách hàng ngày càng muốn biết khi nào họ đang nói chuyện với bot, và vì sao một mức giá hay gợi ý lại như vậy.</li>
<li><strong>Dark pattern</strong> — dùng sức thuyết phục của AI để thao túng (đồng hồ đếm ngược khẩn cấp giả, phụ phí ẩn chỉ hiện lúc thanh toán) là vượt ranh giới từ "cá nhân hoá" sang lừa dối.</li>
</ul>
<h3>Quyền riêng tư: GDPR và sự đồng thuận</h3>
<p>Cá nhân hoá cần dữ liệu hành vi, còn luật bảo vệ dữ liệu giới hạn cách thu thập và sử dụng nó. Ý chính từ <strong>GDPR</strong> (và các luật tương tự ở nơi khác): <strong>đồng thuận</strong> rõ ràng trước khi theo dõi, quyền được biết dữ liệu nào đang bị lưu, và quyền bị xoá (xoá dữ liệu khi yêu cầu).</p>
<div class="callout"><span class="badge">Sức mạnh mỗi chương đi kèm trách nhiệm của chương này</span> Gợi ý, cá nhân hoá, định giá và chấm điểm gian lận đều chạy trên cùng dữ liệu khách hàng — quy tắc đạo đức và quyền riêng tư ở đây áp dụng cho toàn môn, không chỉ chương này.</div>`,
  ]]);

const c8q = quiz('eai201-quiz-8', 'Quiz 8 — Generative AI, ethics & privacy|||Quiz 8 — Generative AI, đạo đức & quyền riêng tư', [
  { id: 'q1', question: 'Vì sao mô tả sản phẩm do Generative AI viết vẫn cần con người kiểm duyệt?', options: ['Vì AI luôn viết quá ngắn', 'Vì nội dung sinh ra có thể sai sự thật (bịa chất liệu/kích cỡ) hoặc lệch thương hiệu', 'Vì luật cấm AI viết nội dung', 'Vì AI không thể viết tiếng Việt'], correctIndex: 1, explanation: 'Generative AI có thể "hallucinate" thông tin sai, nên cần bước kiểm duyệt trước khi đăng.' },
  { id: 'q2', question: '"Dark pattern" trong AI/TMĐT nghĩa là?', options: ['Giao diện web tối màu (dark mode)', 'Dùng sức thuyết phục của AI để thao túng khách (đồng hồ giả, phụ phí ẩn)', 'Một loại thuật toán gợi ý mới', 'Lỗi kỹ thuật của server'], correctIndex: 1, explanation: 'Dark pattern là cá nhân hoá vượt ranh giới thành lừa dối/thao túng khách hàng.' },
  { id: 'q3', question: 'GDPR yêu cầu gì liên quan đến dữ liệu khách hàng?', options: ['Cấm hoàn toàn việc thu thập dữ liệu', 'Đồng thuận rõ ràng trước khi theo dõi, và quyền được xoá dữ liệu khi yêu cầu', 'Chỉ áp dụng cho công ty ngoài châu Âu', 'Không liên quan đến cá nhân hoá AI'], correctIndex: 1, explanation: 'GDPR đặt ra quyền đồng thuận, quyền biết dữ liệu đang lưu, và quyền bị xoá (right to be forgotten).' },
]);

const taiLieu = doc('eai201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách tham khảo, whitepaper hãng, tài liệu chính thức miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">EAI201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn AI in E-Commerce — recommendation engines, personalization, chatbots, search, pricing, fraud, and generative AI — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources cited for this course.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EAI201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Artificial Intelligence for Marketing</em> — Jim Sterne (foundational reading on AI-driven marketing &amp; personalization).</li>
<li><em>Recommender Systems: The Textbook</em> — Charu C. Aggarwal (collaborative/content-based/hybrid filtering in depth).</li>
</ul>
<h3>🌐 Official / free documentation &amp; whitepapers</h3>
<ul>
<li><a href="https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights" target="_blank" rel="noopener">McKinsey — Growth, Marketing &amp; Sales insights</a> — AI in retail/e-commerce research.</li>
<li><a href="https://www.gartner.com/en/marketing" target="_blank" rel="noopener">Gartner — Marketing research</a> — AI adoption &amp; e-commerce trend reports.</li>
<li><a href="https://www.aboutamazon.com/news/how-amazon-works" target="_blank" rel="noopener">About Amazon — How Amazon works</a> — recommendation &amp; personalization at scale.</li>
<li><a href="https://www.shopify.com/blog/shopify-magic" target="_blank" rel="noopener">Shopify — AI tools (Shopify Magic)</a> — generative AI for product listings.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@StanfordOnline" target="_blank" rel="noopener">Stanford Online</a> — recommender systems &amp; ML lectures.</li>
<li><a href="https://www.youtube.com/@GoogleCloudTech" target="_blank" rel="noopener">Google Cloud Tech</a> — applied AI/retail case studies.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.kaggle.com/" target="_blank" rel="noopener">Kaggle</a> — e-commerce datasets to practice recommendation/forecasting models.</li>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">scikit-learn</a> — clustering (k-means), classification for fraud/segmentation exercises.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — AI landscape &amp; business metrics, recommendation approaches, RFM segmentation.</li>
<li><strong>Practice</strong> — chatbot use cases, semantic/visual/voice search concepts.</li>
<li><strong>Go deeper</strong> — dynamic pricing, demand forecasting, fraud scoring, conversion optimization.</li>
<li><strong>Job-ready</strong> — generative AI workflows plus the ethics/privacy rules that govern all of the above in production.</li>
</ol></div>`,
    `<span class="eyebrow">EAI201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học AI trong Thương mại điện tử — hệ khuyến nghị, cá nhân hoá, chatbot, tìm kiếm, định giá, gian lận và generative AI — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp được trích dẫn cho môn này.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EAI201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Artificial Intelligence for Marketing</em> — Jim Sterne (nền tảng về marketing &amp; cá nhân hoá dùng AI).</li>
<li><em>Recommender Systems: The Textbook</em> — Charu C. Aggarwal (đi sâu collaborative/content-based/hybrid filtering).</li>
</ul>
<h3>🌐 Tài liệu chính thức / whitepaper</h3>
<ul>
<li><a href="https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights" target="_blank" rel="noopener">McKinsey — Growth, Marketing &amp; Sales insights</a> — nghiên cứu AI trong bán lẻ/TMĐT.</li>
<li><a href="https://www.gartner.com/en/marketing" target="_blank" rel="noopener">Gartner — Marketing research</a> — báo cáo xu hướng ứng dụng AI trong TMĐT.</li>
<li><a href="https://www.aboutamazon.com/news/how-amazon-works" target="_blank" rel="noopener">About Amazon — How Amazon works</a> — gợi ý &amp; cá nhân hoá ở quy mô lớn.</li>
<li><a href="https://www.shopify.com/blog/shopify-magic" target="_blank" rel="noopener">Shopify — công cụ AI (Shopify Magic)</a> — generative AI cho mô tả sản phẩm.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@StanfordOnline" target="_blank" rel="noopener">Stanford Online</a> — bài giảng recommender systems &amp; ML.</li>
<li><a href="https://www.youtube.com/@GoogleCloudTech" target="_blank" rel="noopener">Google Cloud Tech</a> — case study AI ứng dụng trong bán lẻ.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.kaggle.com/" target="_blank" rel="noopener">Kaggle</a> — dữ liệu TMĐT để luyện mô hình gợi ý/dự báo.</li>
<li><a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener">scikit-learn</a> — clustering (k-means), phân loại cho bài tập gian lận/phân khúc.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — bức tranh AI &amp; chỉ số kinh doanh, các cách khuyến nghị, phân khúc RFM.</li>
<li><strong>Luyện tập</strong> — ca dùng chatbot, khái niệm tìm kiếm ngữ nghĩa/hình ảnh/giọng nói.</li>
<li><strong>Đào sâu thực tế</strong> — định giá động, dự báo nhu cầu, chấm điểm gian lận, tối ưu chuyển đổi.</li>
<li><strong>Sẵn sàng đi làm</strong> — quy trình generative AI cùng quy tắc đạo đức/quyền riêng tư chi phối tất cả những điều trên trong thực tế.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'EAI201',
    slug: 'eai201-ai-in-e-commerce',
    title: 'AI in E-Commerce',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EAI201.webp',
    shortDescription: 'Where AI creates value in online retail: recommendations, personalization, chatbots, smart/visual/voice search, dynamic pricing & forecasting, fraud detection, conversion optimization, generative AI, ethics & privacy.|||AI tạo giá trị ở đâu trong TMĐT: hệ khuyến nghị, cá nhân hoá, chatbot, tìm kiếm thông minh/hình ảnh/giọng nói, định giá động & dự báo, phát hiện gian lận, tối ưu chuyển đổi, generative AI, đạo đức & quyền riêng tư.',
    description: 'Môn <strong>EAI201 — AI in E-Commerce</strong> (kỳ 5, khối Quản trị Kinh doanh) khảo sát <strong>AI tạo giá trị kinh doanh ở đâu</strong> trên một sàn TMĐT. Từ <strong>tổng quan &amp; giá trị kinh doanh</strong> → <strong>hệ khuyến nghị</strong> (collaborative/content-based) → <strong>cá nhân hoá &amp; phân khúc khách hàng</strong> (RFM, clustering) → <strong>chatbot &amp; trợ lý ảo</strong> → <strong>tìm kiếm thông minh, hình ảnh &amp; giọng nói</strong> → <strong>định giá động &amp; dự báo nhu cầu/tồn kho</strong> → <strong>phát hiện gian lận &amp; tối ưu chuyển đổi</strong> → <strong>generative AI, đạo đức &amp; quyền riêng tư</strong>. Trích dẫn "AI for Marketing" (Sterne), "Recommender Systems" (Aggarwal), tài liệu Amazon/Shopify và whitepaper McKinsey/Gartner. Song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Bức tranh AI & chỉ số kinh doanh (CR, AOV, CLV); hệ khuyến nghị (collaborative/content-based/hybrid, cold-start); phân khúc khách hàng (RFM, clustering) & cá nhân hoá; chatbot AI (NLU/LLM) & handoff cho người; tìm kiếm ngữ nghĩa/hình ảnh/giọng nói (embeddings); định giá động & dự báo nhu cầu (time series); phát hiện gian lận (anomaly detection) & tối ưu chuyển đổi (A/B testing); generative AI cho nội dung sản phẩm/marketing; đạo đức AI (bias, dark pattern) & quyền riêng tư (GDPR).',
    requirements: 'Kiến thức nền về marketing/TMĐT (khối BBA). Không cần biết lập trình — môn tập trung vào khái niệm, ứng dụng và tác động kinh doanh của AI.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách, whitepaper, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'AI trong hành trình mua hàng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan AI trong TMĐT & giá trị kinh doanh|||Chapter 1 — AI landscape & business value', description: 'Hành trình mua hàng, data flywheel, chỉ số kinh doanh.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hệ khuyến nghị|||Chapter 2 — Recommendation engines', description: 'Collaborative/content-based/hybrid, cold-start, CTR vs conversion.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cá nhân hoá & phân khúc khách hàng|||Chapter 3 — Personalization & segmentation', description: 'RFM, clustering, cá nhân hoá đa kênh.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Chatbot & trợ lý ảo|||Chapter 4 — Chatbots & virtual assistants', description: 'Rule-based vs AI, ca dùng, human handoff.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tìm kiếm thông minh, hình ảnh & giọng nói|||Chapter 5 — Intelligent, visual & voice search', description: 'Semantic/vector search, visual search, voice search.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định giá động & dự báo nhu cầu/tồn kho|||Chapter 6 — Dynamic pricing & demand forecasting', description: 'Dynamic pricing, time series forecasting, tối ưu tồn kho.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phát hiện gian lận & tối ưu chuyển đổi|||Chapter 7 — Fraud detection & conversion optimization', description: 'Anomaly detection, chấm điểm rủi ro, A/B testing, cart abandonment.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Generative AI, đạo đức & quyền riêng tư|||Chapter 8 — Generative AI, ethics & privacy', description: 'Generative AI cho nội dung, bias/dark pattern, GDPR.', lessons: [c8, c8q] },
  ],
};
