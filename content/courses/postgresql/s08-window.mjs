/**
 * PostgreSQL — Chương 8: Hàm cửa sổ (KHÉP Giai đoạn 2 — Truy vấn sâu).
 * OVER()/PARTITION BY (tổng hợp không gộp dòng) · ROW_NUMBER/RANK/DENSE_RANK +
 * top-N mỗi nhóm · LAG/LEAD + running total (cửa sổ có thứ tự) · window frame
 * ROWS BETWEEN + FIRST_VALUE + NTILE. Output chạy thật PG 15.4 (schema ch8).
 * LUẬT: < > trong code → &lt; &gt; (so sánh <=); & → &amp;; backtick → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 8 — Window functions|||Chương 8 — Hàm cửa sổ',
  description: 'Tính toán trên một nhóm dòng liên quan tới dòng hiện tại mà không gộp chúng lại: tổng theo phân vùng, xếp hạng (ROW_NUMBER/RANK/DENSE_RANK), so với dòng trước (LAG/LEAD), tổng luỹ tiến, khung cửa sổ và NTILE.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — What a window function is: aggregate without collapsing|||8.1 — Hàm cửa sổ là gì: tổng hợp mà không gộp dòng',
      slug: 'postgresql-8-1-window-la-gi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'OVER() để tính một hàm tổng hợp mà vẫn giữ mọi dòng, và PARTITION BY để tính riêng theo từng nhóm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>The aggregate that keeps every row</h2>
<p class="lead">A <code>GROUP BY</code> collapses many rows into one summary — you lose the individual rows. A <strong>window function</strong> computes the same kind of aggregate but <em>keeps every row</em>, attaching the summary alongside. That single difference unlocks "each row next to its group's total", rankings, running totals, and row-to-row comparisons — things plain aggregation simply can't express.</p>

<h3>OVER () — a total on every row</h3>
<p>Add <code>OVER ()</code> to an aggregate and it becomes a window function: it computes over all the rows but reports on <em>each</em> one. Show every sale with the grand total and its share of it — without collapsing the eight rows into one:</p>
<pre><code>SELECT seller, amount,
       sum(amount) OVER ()                            AS grand_total,
       round(100.0 * amount / sum(amount) OVER (), 1) AS pct_of_total
FROM sale ORDER BY id;</code></pre>
<div class="out"> seller | amount | grand_total | pct_of_total
--------+--------+-------------+--------------
 Alice  | 100.00 |     1550.00 |          6.5
 Alice  | 150.00 |     1550.00 |          9.7
 Bob    | 200.00 |     1550.00 |         12.9
 Bob    | 150.00 |     1550.00 |          9.7
 Carol  | 300.00 |     1550.00 |         19.4
 Carol  | 250.00 |     1550.00 |         16.1
 Dave   | 180.00 |     1550.00 |         11.6
 Dave   | 220.00 |     1550.00 |         14.2
(8 rows)</div>
<p>All eight rows survived, each showing the same <code>grand_total</code> (1550) and its own <code>pct_of_total</code>. A <code>GROUP BY</code> could give you 1550, but only as a single row — you couldn't put each sale next to it. The window function does both at once.</p>

<h3>PARTITION BY — a separate window per group</h3>
<p><code>PARTITION BY</code> is the window equivalent of <code>GROUP BY</code>: it splits the rows into groups and computes the aggregate <em>within each group</em>, still keeping every row. Each sale next to its region's total:</p>
<pre><code>SELECT region, seller, amount,
       sum(amount) OVER (PARTITION BY region) AS region_total
FROM sale ORDER BY region, id;</code></pre>
<div class="out"> region | seller | amount | region_total
--------+--------+--------+--------------
 North  | Alice  | 100.00 |       600.00
 North  | Alice  | 150.00 |       600.00
 North  | Bob    | 200.00 |       600.00
 North  | Bob    | 150.00 |       600.00
 South  | Carol  | 300.00 |       950.00
 South  | Carol  | 250.00 |       950.00
 South  | Dave   | 180.00 |       950.00
 South  | Dave   | 220.00 |       950.00
(8 rows)</div>
<p>North's rows all show 600, South's all show 950 — the per-region total, repeated on every row of that region. This is the core idea: <strong><code>OVER (PARTITION BY ...)</code> is "group by, but keep the rows"</strong>. Everything else in this chapter is variations on it — ordering the window, ranking within it, looking at neighbours.</p>
<div class="callout ok">The mental split: use <strong><code>GROUP BY</code></strong> when you want one row per group (a summary table). Use a <strong>window function</strong> when you want to keep every detail row but add a group-level value to each — a total, a rank, a running sum. If you find yourself joining a <code>GROUP BY</code> result back to the detail rows, a window function is almost always the cleaner tool.</div>
<div class="note-ct">A leaderboard on this site — "each post with its view count <em>and</em> what share of the day's total views it got" — is one window query. Doing it with <code>GROUP BY</code> would need a separate aggregate query joined back to the posts; <code>sum(views) OVER (PARTITION BY day)</code> gives the daily total on every post row in a single pass.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: OVER() and PARTITION BY on the sales table</span><span class="lc-sub">The Code Lab track sets up the data used across this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Phép tổng hợp giữ lại mọi dòng</h2>
<p class="lead">Một <code>GROUP BY</code> gộp nhiều dòng thành một tóm tắt — bạn mất các dòng riêng lẻ. Một <strong>hàm cửa sổ</strong> tính cùng loại tổng hợp nhưng <em>giữ mọi dòng</em>, gắn tóm tắt cạnh bên. Khác biệt duy nhất đó mở khoá "mỗi dòng cạnh tổng của nhóm nó", xếp hạng, tổng luỹ tiến, và so sánh dòng-với-dòng — những thứ tổng hợp thường đơn giản không diễn đạt được.</p>

<h3>OVER () — một tổng trên mỗi dòng</h3>
<p>Thêm <code>OVER ()</code> vào một hàm tổng hợp là nó thành một hàm cửa sổ: nó tính trên mọi dòng nhưng báo cáo trên <em>mỗi</em> dòng. Hiện mỗi giao dịch với tổng lớn và phần chia của nó — mà không gộp tám dòng thành một:</p>
<pre><code>SELECT seller, amount,
       sum(amount) OVER ()                            AS grand_total,
       round(100.0 * amount / sum(amount) OVER (), 1) AS pct_of_total
FROM sale ORDER BY id;</code></pre>
<div class="out"> seller | amount | grand_total | pct_of_total
--------+--------+-------------+--------------
 Alice  | 100.00 |     1550.00 |          6.5
 Alice  | 150.00 |     1550.00 |          9.7
 Bob    | 200.00 |     1550.00 |         12.9
 Bob    | 150.00 |     1550.00 |          9.7
 Carol  | 300.00 |     1550.00 |         19.4
 Carol  | 250.00 |     1550.00 |         16.1
 Dave   | 180.00 |     1550.00 |         11.6
 Dave   | 220.00 |     1550.00 |         14.2
(8 rows)</div>
<p>Cả tám dòng sống sót, mỗi dòng hiện cùng <code>grand_total</code> (1550) và <code>pct_of_total</code> của riêng nó. Một <code>GROUP BY</code> có thể cho bạn 1550, nhưng chỉ dưới dạng một dòng duy nhất — bạn không thể đặt mỗi giao dịch cạnh nó. Hàm cửa sổ làm cả hai cùng lúc.</p>

<h3>PARTITION BY — một cửa sổ riêng cho mỗi nhóm</h3>
<p><code>PARTITION BY</code> là tương đương cửa sổ của <code>GROUP BY</code>: nó chia các dòng thành nhóm và tính hàm tổng hợp <em>trong mỗi nhóm</em>, vẫn giữ mọi dòng. Mỗi giao dịch cạnh tổng của vùng nó:</p>
<pre><code>SELECT region, seller, amount,
       sum(amount) OVER (PARTITION BY region) AS region_total
FROM sale ORDER BY region, id;</code></pre>
<div class="out"> region | seller | amount | region_total
--------+--------+--------+--------------
 North  | Alice  | 100.00 |       600.00
 North  | Alice  | 150.00 |       600.00
 North  | Bob    | 200.00 |       600.00
 North  | Bob    | 150.00 |       600.00
 South  | Carol  | 300.00 |       950.00
 South  | Carol  | 250.00 |       950.00
 South  | Dave   | 180.00 |       950.00
 South  | Dave   | 220.00 |       950.00
(8 rows)</div>
<p>Các dòng North đều hiện 600, các dòng South đều hiện 950 — tổng theo vùng, lặp lại trên mỗi dòng của vùng đó. Đây là ý cốt lõi: <strong><code>OVER (PARTITION BY ...)</code> là "gom nhóm, nhưng giữ dòng"</strong>. Mọi thứ khác trong chương này là biến tấu của nó — sắp thứ tự cửa sổ, xếp hạng trong nó, nhìn hàng xóm.</p>
<div class="callout ok">Sự phân chia trong đầu: dùng <strong><code>GROUP BY</code></strong> khi bạn muốn một dòng cho mỗi nhóm (một bảng tóm tắt). Dùng một <strong>hàm cửa sổ</strong> khi bạn muốn giữ mọi dòng chi tiết nhưng thêm một giá trị cấp-nhóm vào mỗi dòng — một tổng, một hạng, một tổng luỹ tiến. Nếu bạn thấy mình đang join kết quả <code>GROUP BY</code> ngược lại các dòng chi tiết, một hàm cửa sổ gần như luôn là công cụ gọn hơn.</div>
<div class="note-ct">Một bảng xếp hạng trên trang này — "mỗi bài đăng với số views <em>và</em> phần chia bao nhiêu trong tổng views của ngày" — là một truy vấn cửa sổ. Làm bằng <code>GROUP BY</code> sẽ cần một truy vấn tổng hợp riêng join ngược lại các bài; <code>sum(views) OVER (PARTITION BY day)</code> cho tổng của ngày trên mỗi dòng bài trong một lượt.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: OVER() và PARTITION BY trên bảng sale</span><span class="lc-sub">Track Code Lab dựng dữ liệu dùng xuyên suốt chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Ranking: ROW_NUMBER, RANK & DENSE_RANK|||8.2 — Xếp hạng: ROW_NUMBER, RANK & DENSE_RANK',
      slug: 'postgresql-8-2-ranking',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba hàm xếp hạng và cách chúng khác nhau khi có đồng hạng, cùng mẫu "top-N mỗi nhóm".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Numbering and ranking rows</h2>
<p class="lead">Add <code>ORDER BY</code> inside the window and you can number rows in that order — the basis of every leaderboard and "top N" query. Three functions do it, and they differ in exactly one way: how they treat ties. Knowing which to pick is the whole lesson.</p>

<h3>The three ranking functions</h3>
<p>All three rank within each region by amount (highest first). The North region has a tie — Alice and Bob both sold 150 — which is where they diverge:</p>
<pre><code>SELECT region, seller, amount,
       row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn,
       rank()       OVER (PARTITION BY region ORDER BY amount DESC) AS rnk,
       dense_rank() OVER (PARTITION BY region ORDER BY amount DESC) AS drnk
FROM sale ORDER BY region, amount DESC, seller;</code></pre>
<div class="out"> region | seller | amount | rn | rnk | drnk
--------+--------+--------+----+-----+------
 North  | Bob    | 200.00 |  1 |   1 |    1
 North  | Alice  | 150.00 |  2 |   2 |    2
 North  | Bob    | 150.00 |  3 |   2 |    2
 North  | Alice  | 100.00 |  4 |   4 |    3
 South  | Carol  | 300.00 |  1 |   1 |    1
 South  | Carol  | 250.00 |  2 |   2 |    2
 South  | Dave   | 220.00 |  3 |   3 |    3
 South  | Dave   | 180.00 |  4 |   4 |    4
(8 rows)</div>
<p>Look at the North tie (two rows at 150) to see the difference:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">row_number() → 2, 3</span><span class="v">Always distinct, 1..N. Breaks ties arbitrarily. Use when you need a unique number per row (e.g. "exactly one winner").</span></div>
  <div class="kv"><span class="k">rank() → 2, 2, then 4</span><span class="v">Ties share a rank, then it <em>skips</em> — like Olympic medals (two silvers, no bronze). The next rank jumps to 4.</span></div>
  <div class="kv"><span class="k">dense_rank() → 2, 2, then 3</span><span class="v">Ties share a rank, but the next rank does <em>not</em> skip. Use for "how many distinct ranks down am I".</span></div>
</div>
<p>So after the tied pair, <code>rank</code> jumps 2 → 4 (positions 2 and 3 both taken), while <code>dense_rank</code> continues 2 → 3. <code>row_number</code> ignores the tie and just counts 2, 3. Pick by intent: unique ordering → <code>row_number</code>; standings with gaps → <code>rank</code>; standings without gaps → <code>dense_rank</code>.</p>

<h3>Top-N per group — and why you need a subquery</h3>
<p>A window function is computed <em>after</em> <code>WHERE</code>, so you can't filter on <code>rn</code> in the same query's <code>WHERE</code>. Wrap it in a CTE (or subquery), then filter. "Top 2 sales per region":</p>
<pre><code>WITH ranked AS (
  SELECT region, seller, amount,
         row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn
  FROM sale
)
SELECT region, seller, amount FROM ranked WHERE rn &lt;= 2 ORDER BY region, rn;</code></pre>
<div class="out"> region | seller | amount
--------+--------+--------
 North  | Bob    | 200.00
 North  | Alice  | 150.00
 South  | Carol  | 300.00
 South  | Carol  | 250.00
(4 rows)</div>
<p>Each region kept only its top 2 by amount. This "top-N per group" is one of the most useful patterns in SQL — top 3 posts per category, best 5 customers per region, latest 2 orders per user — and this CTE-then-filter shape is how you write all of them.</p>
<div class="callout ok">Remember: a window function can't be used in the <code>WHERE</code> of the same <code>SELECT</code> (it hasn't been computed yet at filter time). Compute it in a CTE/subquery, then filter the result. This is the single most common "why won't my window filter work?" gotcha.</div>
<div class="note-ct">Leaderboards and "top N" widgets on the site are exactly this. "The 3 most-viewed posts in each category" is a <code>row_number() OVER (PARTITION BY category ORDER BY views DESC)</code> filtered to <code>rn &lt;= 3</code>. And when a tie-break matters (two posts with equal likes), the choice between <code>rank</code> and <code>dense_rank</code> decides whether the displayed positions skip or stay contiguous.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: the three rankers and top-N per group</span><span class="lc-sub">The Code Lab track uses the tie to make RANK vs DENSE_RANK click.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Đánh số và xếp hạng các dòng</h2>
<p class="lead">Thêm <code>ORDER BY</code> bên trong cửa sổ là bạn có thể đánh số các dòng theo thứ tự đó — nền tảng của mọi bảng xếp hạng và truy vấn "top N". Ba hàm làm việc này, và chúng khác nhau đúng một điểm: cách xử lý đồng hạng. Biết chọn cái nào là toàn bộ bài học.</p>

<h3>Ba hàm xếp hạng</h3>
<p>Cả ba xếp hạng trong mỗi vùng theo amount (cao trước). Vùng North có một đồng hạng — Alice và Bob đều bán 150 — đó là chỗ chúng rẽ nhánh:</p>
<pre><code>SELECT region, seller, amount,
       row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn,
       rank()       OVER (PARTITION BY region ORDER BY amount DESC) AS rnk,
       dense_rank() OVER (PARTITION BY region ORDER BY amount DESC) AS drnk
FROM sale ORDER BY region, amount DESC, seller;</code></pre>
<div class="out"> region | seller | amount | rn | rnk | drnk
--------+--------+--------+----+-----+------
 North  | Bob    | 200.00 |  1 |   1 |    1
 North  | Alice  | 150.00 |  2 |   2 |    2
 North  | Bob    | 150.00 |  3 |   2 |    2
 North  | Alice  | 100.00 |  4 |   4 |    3
 South  | Carol  | 300.00 |  1 |   1 |    1
 South  | Carol  | 250.00 |  2 |   2 |    2
 South  | Dave   | 220.00 |  3 |   3 |    3
 South  | Dave   | 180.00 |  4 |   4 |    4
(8 rows)</div>
<p>Nhìn cặp đồng hạng ở North (hai dòng 150) để thấy khác biệt:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">row_number() → 2, 3</span><span class="v">Luôn khác nhau, 1..N. Phá đồng hạng tuỳ tiện. Dùng khi bạn cần một số duy nhất mỗi dòng (ví dụ "đúng một người thắng").</span></div>
  <div class="kv"><span class="k">rank() → 2, 2, rồi 4</span><span class="v">Đồng hạng chia chung một hạng, rồi <em>nhảy cóc</em> — như huy chương Olympic (hai bạc, không đồng). Hạng kế nhảy lên 4.</span></div>
  <div class="kv"><span class="k">dense_rank() → 2, 2, rồi 3</span><span class="v">Đồng hạng chia chung một hạng, nhưng hạng kế <em>không</em> nhảy cóc. Dùng cho "tôi ở bao nhiêu hạng khác nhau tính xuống".</span></div>
</div>
<p>Nên sau cặp đồng hạng, <code>rank</code> nhảy 2 → 4 (vị trí 2 và 3 đều bị chiếm), còn <code>dense_rank</code> tiếp 2 → 3. <code>row_number</code> phớt lờ đồng hạng và cứ đếm 2, 3. Chọn theo ý định: thứ tự duy nhất → <code>row_number</code>; bảng xếp hạng có khoảng trống → <code>rank</code>; bảng xếp hạng không khoảng trống → <code>dense_rank</code>.</p>

<h3>Top-N mỗi nhóm — và vì sao cần một subquery</h3>
<p>Một hàm cửa sổ được tính <em>sau</em> <code>WHERE</code>, nên bạn không thể lọc theo <code>rn</code> trong <code>WHERE</code> của cùng truy vấn. Hãy bọc nó trong một CTE (hoặc subquery), rồi lọc. "Top 2 giao dịch mỗi vùng":</p>
<pre><code>WITH ranked AS (
  SELECT region, seller, amount,
         row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn
  FROM sale
)
SELECT region, seller, amount FROM ranked WHERE rn &lt;= 2 ORDER BY region, rn;</code></pre>
<div class="out"> region | seller | amount
--------+--------+--------
 North  | Bob    | 200.00
 North  | Alice  | 150.00
 South  | Carol  | 300.00
 South  | Carol  | 250.00
(4 rows)</div>
<p>Mỗi vùng chỉ giữ top 2 theo amount. "Top-N mỗi nhóm" này là một trong những mẫu hữu ích nhất SQL — top 3 bài mỗi danh mục, 5 khách tốt nhất mỗi vùng, 2 đơn mới nhất mỗi user — và hình CTE-rồi-lọc này là cách bạn viết tất cả chúng.</p>
<div class="callout ok">Nhớ: một hàm cửa sổ không dùng được trong <code>WHERE</code> của cùng <code>SELECT</code> (lúc lọc nó chưa được tính). Tính nó trong một CTE/subquery, rồi lọc kết quả. Đây là cái vấp "sao bộ lọc cửa sổ của tôi không chạy?" phổ biến nhất.</div>
<div class="note-ct">Bảng xếp hạng và widget "top N" trên trang đúng là cái này. "3 bài xem nhiều nhất mỗi danh mục" là một <code>row_number() OVER (PARTITION BY category ORDER BY views DESC)</code> lọc về <code>rn &lt;= 3</code>. Và khi phá đồng hạng quan trọng (hai bài bằng like), lựa chọn giữa <code>rank</code> và <code>dense_rank</code> quyết định các vị trí hiển thị nhảy cóc hay liền mạch.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: ba hàm xếp hạng và top-N mỗi nhóm</span><span class="lc-sub">Track Code Lab dùng đồng hạng để làm RANK vs DENSE_RANK sáng ra.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — LAG, LEAD & running totals|||8.3 — LAG, LEAD & tổng luỹ tiến',
      slug: 'postgresql-8-3-lag-running-total',
      type: 'LESSON',
      isFreePreview: true,
      description: 'So sánh mỗi dòng với dòng trước/sau bằng LAG/LEAD, và tính tổng luỹ tiến bằng một cửa sổ có thứ tự.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Looking at neighbours, and accumulating over time</h2>
<p class="lead">Once a window is <em>ordered</em>, each row has a well-defined "previous" and "next", and a growing set of rows "so far". That gives two hugely useful tools: <code>LAG</code>/<code>LEAD</code> to compare a row with its neighbours, and a running total that accumulates down the order. Both are staples of time-series and trend reporting.</p>

<h3>Running total — an ordered SUM</h3>
<p>When a window has <code>ORDER BY</code> but no explicit frame, it defaults to "all rows from the start up to the current row" — so <code>sum()</code> over it becomes a <strong>running total</strong>. Cumulative sales per seller over time:</p>
<pre><code>SELECT seller, sold_on, amount,
       sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS running_total
FROM sale ORDER BY seller, sold_on;</code></pre>
<div class="out"> seller |  sold_on   | amount | running_total
--------+------------+--------+---------------
 Alice  | 2026-01-05 | 100.00 |        100.00
 Alice  | 2026-02-10 | 150.00 |        250.00
 Bob    | 2026-01-20 | 200.00 |        200.00
 Bob    | 2026-03-01 | 150.00 |        350.00
 Carol  | 2026-01-15 | 300.00 |        300.00
 Carol  | 2026-02-20 | 250.00 |        550.00
 Dave   | 2026-02-05 | 180.00 |        180.00
 Dave   | 2026-03-10 | 220.00 |        400.00
(8 rows)</div>
<p>Each seller's <code>running_total</code> grows down their rows: Alice's 100 then 250, Bob's 200 then 350. The <code>PARTITION BY seller</code> restarts the accumulation for each seller; the <code>ORDER BY sold_on</code> defines "so far". This is the query behind every cumulative-revenue chart.</p>

<h3>LAG — compare each row to the previous one</h3>
<p><code>lag(col)</code> reaches back to the previous row in the window's order; <code>lead(col)</code> reaches forward. Perfect for "change since last time" — subtract the previous amount from the current:</p>
<pre><code>SELECT seller, sold_on, amount,
       lag(amount) OVER (PARTITION BY seller ORDER BY sold_on)          AS prev_amount,
       amount - lag(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS change
FROM sale ORDER BY seller, sold_on;</code></pre>
<div class="out"> seller |  sold_on   | amount | prev_amount | change
--------+------------+--------+-------------+--------
 Alice  | 2026-01-05 | 100.00 |             |
 Alice  | 2026-02-10 | 150.00 |      100.00 |  50.00
 Bob    | 2026-01-20 | 200.00 |             |
 Bob    | 2026-03-01 | 150.00 |      200.00 | -50.00
 Carol  | 2026-01-15 | 300.00 |             |
 Carol  | 2026-02-20 | 250.00 |      300.00 | -50.00
 Dave   | 2026-02-05 | 180.00 |             |
 Dave   | 2026-03-10 | 220.00 |      180.00 |  40.00
(8 rows)</div>
<p>Each seller's first row has an empty <code>prev_amount</code> (there's no earlier row, so <code>lag</code> returns <code>NULL</code>), and the rest show the change from their previous sale — Bob dropped 50, Dave rose 40. <code>lag</code>/<code>lead</code> turn "compare a row to its neighbour" from an awkward self-join into one clean expression. (Pass a default to avoid the NULLs: <code>lag(amount, 1, 0)</code>.)</p>
<div class="callout ok">The key is the ordered window. <code>sum() OVER (ORDER BY ...)</code> accumulates (running total); <code>lag()</code>/<code>lead() OVER (ORDER BY ...)</code> reach to neighbours. Add <code>PARTITION BY</code> to restart per group. These replace clumsy self-joins that people used to write before window functions existed.</div>
<div class="note-ct">Growth and trend numbers on the site are these functions. "Views this week vs last week" per post is <code>lag</code> over a weekly-ordered window; the cumulative-signups line on the admin dashboard is a running <code>sum() OVER (ORDER BY day)</code>. Both would otherwise need fragile self-joins on shifted dates.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: running totals and LAG deltas</span><span class="lc-sub">The Code Lab track builds a cumulative and a period-over-period column.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Nhìn hàng xóm, và tích luỹ theo thời gian</h2>
<p class="lead">Một khi cửa sổ được <em>sắp thứ tự</em>, mỗi dòng có một "trước" và "sau" xác định rõ, và một tập dòng "tới lúc này" đang lớn dần. Điều đó cho hai công cụ cực hữu ích: <code>LAG</code>/<code>LEAD</code> để so một dòng với hàng xóm, và một tổng luỹ tiến tích luỹ dọc thứ tự. Cả hai là trụ cột của báo cáo chuỗi-thời-gian và xu hướng.</p>

<h3>Tổng luỹ tiến — một SUM có thứ tự</h3>
<p>Khi một cửa sổ có <code>ORDER BY</code> nhưng không có khung tường minh, nó mặc định là "mọi dòng từ đầu tới dòng hiện tại" — nên <code>sum()</code> trên nó thành một <strong>tổng luỹ tiến</strong>. Doanh số tích luỹ mỗi người bán theo thời gian:</p>
<pre><code>SELECT seller, sold_on, amount,
       sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS running_total
FROM sale ORDER BY seller, sold_on;</code></pre>
<div class="out"> seller |  sold_on   | amount | running_total
--------+------------+--------+---------------
 Alice  | 2026-01-05 | 100.00 |        100.00
 Alice  | 2026-02-10 | 150.00 |        250.00
 Bob    | 2026-01-20 | 200.00 |        200.00
 Bob    | 2026-03-01 | 150.00 |        350.00
 Carol  | 2026-01-15 | 300.00 |        300.00
 Carol  | 2026-02-20 | 250.00 |        550.00
 Dave   | 2026-02-05 | 180.00 |        180.00
 Dave   | 2026-03-10 | 220.00 |        400.00
(8 rows)</div>
<p><code>running_total</code> của mỗi người bán lớn dần theo các dòng của họ: Alice 100 rồi 250, Bob 200 rồi 350. <code>PARTITION BY seller</code> khởi động lại tích luỹ cho mỗi người bán; <code>ORDER BY sold_on</code> định nghĩa "tới lúc này". Đây là truy vấn đằng sau mọi biểu đồ doanh thu tích luỹ.</p>

<h3>LAG — so mỗi dòng với dòng trước</h3>
<p><code>lag(col)</code> với ngược lại dòng trước theo thứ tự cửa sổ; <code>lead(col)</code> với tới trước. Hoàn hảo cho "thay đổi so với lần trước" — trừ amount trước khỏi amount hiện tại:</p>
<pre><code>SELECT seller, sold_on, amount,
       lag(amount) OVER (PARTITION BY seller ORDER BY sold_on)          AS prev_amount,
       amount - lag(amount) OVER (PARTITION BY seller ORDER BY sold_on) AS change
FROM sale ORDER BY seller, sold_on;</code></pre>
<div class="out"> seller |  sold_on   | amount | prev_amount | change
--------+------------+--------+-------------+--------
 Alice  | 2026-01-05 | 100.00 |             |
 Alice  | 2026-02-10 | 150.00 |      100.00 |  50.00
 Bob    | 2026-01-20 | 200.00 |             |
 Bob    | 2026-03-01 | 150.00 |      200.00 | -50.00
 Carol  | 2026-01-15 | 300.00 |             |
 Carol  | 2026-02-20 | 250.00 |      300.00 | -50.00
 Dave   | 2026-02-05 | 180.00 |             |
 Dave   | 2026-03-10 | 220.00 |      180.00 |  40.00
(8 rows)</div>
<p>Dòng đầu của mỗi người bán có <code>prev_amount</code> trống (không có dòng trước, nên <code>lag</code> trả <code>NULL</code>), và phần còn lại hiện thay đổi so với giao dịch trước — Bob giảm 50, Dave tăng 40. <code>lag</code>/<code>lead</code> biến "so một dòng với hàng xóm" từ một self-join vụng về thành một biểu thức gọn. (Truyền một mặc định để tránh NULL: <code>lag(amount, 1, 0)</code>.)</p>
<div class="callout ok">Chìa khoá là cửa sổ có thứ tự. <code>sum() OVER (ORDER BY ...)</code> tích luỹ (tổng luỹ tiến); <code>lag()</code>/<code>lead() OVER (ORDER BY ...)</code> với tới hàng xóm. Thêm <code>PARTITION BY</code> để khởi động lại mỗi nhóm. Những cái này thay cho các self-join lóng ngóng mà người ta từng viết trước khi có hàm cửa sổ.</div>
<div class="note-ct">Các con số tăng trưởng và xu hướng trên trang là những hàm này. "Views tuần này vs tuần trước" mỗi bài là <code>lag</code> trên một cửa sổ sắp theo tuần; đường đăng-ký-tích-luỹ trên dashboard admin là một <code>sum() OVER (ORDER BY day)</code> luỹ tiến. Cả hai nếu không sẽ cần các self-join mong manh trên các ngày lệch.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tổng luỹ tiến và độ lệch LAG</span><span class="lc-sub">Track Code Lab dựng một cột tích luỹ và một cột kỳ-này-so-kỳ-trước.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Window frames, FIRST_VALUE & NTILE|||8.4 — Khung cửa sổ, FIRST_VALUE & NTILE',
      slug: 'postgresql-8-4-frame-ntile',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Điều khiển chính xác dòng nào nằm trong cửa sổ bằng ROWS BETWEEN (trung bình trượt), lấy giá trị đầu nhóm với FIRST_VALUE, và chia nhóm phần trăm với NTILE.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Fine control: frames, first values, and buckets</h2>
<p class="lead">Three finishing tools. A <strong>frame</strong> (<code>ROWS BETWEEN ...</code>) says exactly which rows around the current one the window covers — the key to moving averages. <code>FIRST_VALUE</code> pulls a value from the top of the window onto every row. And <code>NTILE</code> splits rows into equal buckets — quartiles, halves, percentiles. With these, window functions are complete.</p>

<h3>Frames — a sliding subset of rows</h3>
<p>The default frame with <code>ORDER BY</code> is "start of partition to current row" (that's what made the running total). Override it with <code>ROWS BETWEEN</code> to get a <em>sliding window</em> — here, the average of the current row and the one before it (a 2-row moving average):</p>
<pre><code>SELECT seller, sold_on, amount,
       round(avg(amount) OVER (PARTITION BY seller ORDER BY sold_on
                               ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 1) AS moving_avg2
FROM sale ORDER BY seller, sold_on;</code></pre>
<div class="out"> seller |  sold_on   | amount | moving_avg2
--------+------------+--------+-------------
 Alice  | 2026-01-05 | 100.00 |       100.0
 Alice  | 2026-02-10 | 150.00 |       125.0
 Bob    | 2026-01-20 | 200.00 |       200.0
 Bob    | 2026-03-01 | 150.00 |       175.0
 Carol  | 2026-01-15 | 300.00 |       300.0
 Carol  | 2026-02-20 | 250.00 |       275.0
 Dave   | 2026-02-05 | 180.00 |       180.0
 Dave   | 2026-03-10 | 220.00 |       200.0
(8 rows)</div>
<p>Each row's <code>moving_avg2</code> averages just it and its predecessor: Alice's second row is (100+150)/2 = 125; the first row (no predecessor) is just 100. Widen the frame — <code>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code> — for a 3-row moving average. Frames are how you smooth noisy time series.</p>

<h3>FIRST_VALUE — the top of the window on every row</h3>
<p><code>first_value(col)</code> returns the value from the first row of the (ordered) window — handy for "compared to the best". The top seller's amount in each region, shown on every row:</p>
<pre><code>SELECT region, seller, amount,
       first_value(amount) OVER (PARTITION BY region ORDER BY amount DESC) AS top_amount
FROM sale ORDER BY region, amount DESC, seller;</code></pre>
<div class="out"> region | seller | amount | top_amount
--------+--------+--------+------------
 North  | Bob    | 200.00 |     200.00
 North  | Alice  | 150.00 |     200.00
 North  | Bob    | 150.00 |     200.00
 North  | Alice  | 100.00 |     200.00
 South  | Carol  | 300.00 |     300.00
 South  | Carol  | 250.00 |     300.00
 South  | Dave   | 220.00 |     300.00
 South  | Dave   | 180.00 |     300.00
(8 rows)</div>
<p>Every North row now knows its region's best was 200; every South row, 300. From here "how far behind the leader is each sale?" is just <code>top_amount - amount</code>.</p>

<h3>NTILE — split into equal buckets</h3>
<p><code>ntile(n)</code> divides the ordered rows into <code>n</code> roughly equal groups and labels each row with its bucket number — the basis of quartiles, deciles, and percentile cohorts. Split all sales into a top and bottom half by amount:</p>
<pre><code>SELECT seller, amount,
       ntile(2) OVER (ORDER BY amount DESC) AS half
FROM sale ORDER BY amount DESC, seller;</code></pre>
<div class="out"> seller | amount | half
--------+--------+------
 Carol  | 300.00 |    1
 Carol  | 250.00 |    1
 Dave   | 220.00 |    1
 Bob    | 200.00 |    1
 Dave   | 180.00 |    2
 Alice  | 150.00 |    2
 Bob    | 150.00 |    2
 Alice  | 100.00 |    2
(8 rows)</div>
<p>The top four amounts landed in bucket 1, the bottom four in bucket 2. <code>ntile(4)</code> would give quartiles, <code>ntile(100)</code> percentiles. It's the standard way to answer "which quartile is this customer's spend in?" without hand-computing thresholds.</p>
<div class="callout ok">The window toolkit, complete: <strong>frames</strong> (<code>ROWS BETWEEN</code>) for moving windows, <strong>ranking</strong> (<code>row_number</code>/<code>rank</code>/<code>dense_rank</code>) for standings, <strong>navigation</strong> (<code>lag</code>/<code>lead</code>/<code>first_value</code>) for neighbours and extremes, and <strong>bucketing</strong> (<code>ntile</code>) for percentiles — all keeping every row, all driven by <code>PARTITION BY</code> and <code>ORDER BY</code> in the <code>OVER</code> clause.</div>
<div class="note-ct">These close out the analytics toolkit the site uses: smoothed trend lines are moving averages via frames, "top performer in your group" badges use <code>first_value</code>, and engagement cohorts ("you're in the top 10% of readers this month") are <code>ntile</code>. That completes Phase 2 — you can now read data in every shape SQL offers. Phase 3 turns to making it fast.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: indexes — making queries fast</span><span class="lc-sub">Phase 3 begins: why a query is slow and how the right index fixes it.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Điều khiển tinh: khung, giá trị đầu, và nhóm chia</h2>
<p class="lead">Ba công cụ hoàn thiện. Một <strong>khung (frame)</strong> (<code>ROWS BETWEEN ...</code>) nói chính xác dòng nào quanh dòng hiện tại mà cửa sổ bao — chìa khoá cho trung bình trượt. <code>FIRST_VALUE</code> kéo một giá trị từ đỉnh cửa sổ lên mọi dòng. Và <code>NTILE</code> chia dòng thành các nhóm bằng nhau — tứ phân, một nửa, phần trăm. Với những cái này, hàm cửa sổ là đầy đủ.</p>

<h3>Khung — một tập con trượt của các dòng</h3>
<p>Khung mặc định với <code>ORDER BY</code> là "đầu phân vùng tới dòng hiện tại" (đó là cái làm nên tổng luỹ tiến). Ghi đè nó bằng <code>ROWS BETWEEN</code> để có một <em>cửa sổ trượt</em> — ở đây, trung bình của dòng hiện tại và dòng trước nó (trung bình trượt 2 dòng):</p>
<pre><code>SELECT seller, sold_on, amount,
       round(avg(amount) OVER (PARTITION BY seller ORDER BY sold_on
                               ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 1) AS moving_avg2
FROM sale ORDER BY seller, sold_on;</code></pre>
<div class="out"> seller |  sold_on   | amount | moving_avg2
--------+------------+--------+-------------
 Alice  | 2026-01-05 | 100.00 |       100.0
 Alice  | 2026-02-10 | 150.00 |       125.0
 Bob    | 2026-01-20 | 200.00 |       200.0
 Bob    | 2026-03-01 | 150.00 |       175.0
 Carol  | 2026-01-15 | 300.00 |       300.0
 Carol  | 2026-02-20 | 250.00 |       275.0
 Dave   | 2026-02-05 | 180.00 |       180.0
 Dave   | 2026-03-10 | 220.00 |       200.0
(8 rows)</div>
<p><code>moving_avg2</code> của mỗi dòng lấy trung bình chỉ nó và dòng liền trước: dòng thứ hai của Alice là (100+150)/2 = 125; dòng đầu (không có dòng trước) chỉ là 100. Mở rộng khung — <code>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code> — cho trung bình trượt 3 dòng. Khung là cách bạn làm mượt chuỗi thời gian nhiễu.</p>

<h3>FIRST_VALUE — đỉnh cửa sổ trên mọi dòng</h3>
<p><code>first_value(col)</code> trả về giá trị từ dòng đầu của cửa sổ (đã sắp) — tiện cho "so với người giỏi nhất". Amount của người bán top trong mỗi vùng, hiện trên mọi dòng:</p>
<pre><code>SELECT region, seller, amount,
       first_value(amount) OVER (PARTITION BY region ORDER BY amount DESC) AS top_amount
FROM sale ORDER BY region, amount DESC, seller;</code></pre>
<div class="out"> region | seller | amount | top_amount
--------+--------+--------+------------
 North  | Bob    | 200.00 |     200.00
 North  | Alice  | 150.00 |     200.00
 North  | Bob    | 150.00 |     200.00
 North  | Alice  | 100.00 |     200.00
 South  | Carol  | 300.00 |     300.00
 South  | Carol  | 250.00 |     300.00
 South  | Dave   | 220.00 |     300.00
 South  | Dave   | 180.00 |     300.00
(8 rows)</div>
<p>Mọi dòng North giờ biết người giỏi nhất vùng nó là 200; mọi dòng South, 300. Từ đây "mỗi giao dịch kém người dẫn đầu bao nhiêu?" chỉ là <code>top_amount - amount</code>.</p>

<h3>NTILE — chia thành các nhóm bằng nhau</h3>
<p><code>ntile(n)</code> chia các dòng đã sắp thành <code>n</code> nhóm xấp xỉ bằng nhau và gán mỗi dòng số nhóm của nó — nền tảng của tứ phân, thập phân, và nhóm phần trăm. Chia mọi giao dịch thành nửa trên và nửa dưới theo amount:</p>
<pre><code>SELECT seller, amount,
       ntile(2) OVER (ORDER BY amount DESC) AS half
FROM sale ORDER BY amount DESC, seller;</code></pre>
<div class="out"> seller | amount | half
--------+--------+------
 Carol  | 300.00 |    1
 Carol  | 250.00 |    1
 Dave   | 220.00 |    1
 Bob    | 200.00 |    1
 Dave   | 180.00 |    2
 Alice  | 150.00 |    2
 Bob    | 150.00 |    2
 Alice  | 100.00 |    2
(8 rows)</div>
<p>Bốn amount cao nhất rơi vào nhóm 1, bốn thấp nhất vào nhóm 2. <code>ntile(4)</code> cho tứ phân, <code>ntile(100)</code> phần trăm. Đây là cách chuẩn để trả lời "chi tiêu của khách này ở tứ phân nào?" mà không phải tự tính ngưỡng.</p>
<div class="callout ok">Bộ công cụ cửa sổ, đầy đủ: <strong>khung</strong> (<code>ROWS BETWEEN</code>) cho cửa sổ trượt, <strong>xếp hạng</strong> (<code>row_number</code>/<code>rank</code>/<code>dense_rank</code>) cho bảng xếp hạng, <strong>điều hướng</strong> (<code>lag</code>/<code>lead</code>/<code>first_value</code>) cho hàng xóm và cực trị, và <strong>chia nhóm</strong> (<code>ntile</code>) cho phần trăm — tất cả giữ mọi dòng, tất cả điều khiển bởi <code>PARTITION BY</code> và <code>ORDER BY</code> trong mệnh đề <code>OVER</code>.</div>
<div class="note-ct">Những cái này khép lại bộ công cụ phân tích trang dùng: đường xu hướng làm mượt là trung bình trượt qua khung, huy hiệu "người giỏi nhất nhóm bạn" dùng <code>first_value</code>, và các nhóm tương tác ("bạn trong top 10% người đọc tháng này") là <code>ntile</code>. Đó khép lại Giai đoạn 2 — giờ bạn đọc được dữ liệu ở mọi hình mà SQL có. Giai đoạn 3 quay sang làm cho nó nhanh.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: chỉ mục — làm truy vấn nhanh</span><span class="lc-sub">Giai đoạn 3 bắt đầu: vì sao một truy vấn chậm và chỉ mục đúng sửa nó ra sao.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.5 Quiz ─────────────────────────── */
    {
      title: '8.5 — Chapter 8 quiz|||8.5 — Kiểm tra Chương 8',
      slug: 'postgresql-8-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về OVER/PARTITION BY, ba hàm xếp hạng, top-N, LAG & tổng luỹ tiến, khung cửa sổ và NTILE.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on window functions. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: window vs GROUP BY — keeping rows (8.1) — and the fact that a window function can't be filtered in WHERE, so top-N needs a CTE (8.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về hàm cửa sổ. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: cửa sổ vs GROUP BY — giữ dòng (8.1) — và việc một hàm cửa sổ không lọc được trong WHERE, nên top-N cần một CTE (8.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'How does a window function differ from GROUP BY?|||Một hàm cửa sổ khác GROUP BY thế nào?',
            options: [
              'It is faster|||Nó nhanh hơn',
              'It computes an aggregate but keeps every row instead of collapsing them|||Nó tính một tổng hợp nhưng giữ mọi dòng thay vì gộp chúng',
              'It cannot use SUM|||Nó không dùng được SUM',
              'It only works on one column|||Nó chỉ chạy trên một cột',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'OVER (PARTITION BY region) does what?|||OVER (PARTITION BY region) làm gì?',
            options: [
              'Sorts by region|||Sắp theo region',
              'Computes the aggregate separately within each region, on every row|||Tính hàm tổng hợp riêng trong mỗi region, trên mọi dòng',
              'Deletes other regions|||Xoá các region khác',
              'Is the same as GROUP BY region|||Giống hệt GROUP BY region',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With a tie, RANK gives 2, 2, then ... and DENSE_RANK gives 2, 2, then ...?|||Khi đồng hạng, RANK cho 2, 2, rồi ... và DENSE_RANK cho 2, 2, rồi ...?',
            options: [
              'RANK → 3, DENSE_RANK → 4|||RANK → 3, DENSE_RANK → 4',
              'RANK → 4 (skips), DENSE_RANK → 3 (no skip)|||RANK → 4 (nhảy cóc), DENSE_RANK → 3 (không nhảy)',
              'Both → 3|||Cả hai → 3',
              'Both → 4|||Cả hai → 4',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'ROW_NUMBER() differs from RANK() how?|||ROW_NUMBER() khác RANK() ra sao?',
            options: [
              'ROW_NUMBER always gives distinct numbers, even for ties|||ROW_NUMBER luôn cho số khác nhau, kể cả khi đồng hạng',
              'They are identical|||Chúng giống hệt',
              'ROW_NUMBER skips numbers on ties|||ROW_NUMBER nhảy số khi đồng hạng',
              'ROW_NUMBER requires PARTITION BY|||ROW_NUMBER bắt buộc PARTITION BY',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'To get the top 2 rows per group by a window rank, you must?|||Để lấy top 2 dòng mỗi nhóm theo một hạng cửa sổ, bạn phải?',
            options: [
              'Put WHERE rn <= 2 in the same SELECT|||Đặt WHERE rn <= 2 trong cùng SELECT',
              'Compute the rank in a CTE/subquery, then filter it in the outer query|||Tính hạng trong một CTE/subquery, rồi lọc nó ở truy vấn ngoài',
              'Use GROUP BY|||Dùng GROUP BY',
              'Use LIMIT 2|||Dùng LIMIT 2',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) produces?|||sum(amount) OVER (PARTITION BY seller ORDER BY sold_on) tạo ra?',
            options: [
              'The grand total on every row|||Tổng lớn trên mọi dòng',
              'A running (cumulative) total per seller in date order|||Một tổng luỹ tiến (tích luỹ) mỗi người bán theo thứ tự ngày',
              'The average|||Trung bình',
              'One row per seller|||Một dòng mỗi người bán',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'lag(amount) OVER (ORDER BY sold_on) returns, for the first row of a partition?|||lag(amount) OVER (ORDER BY sold_on) trả về, cho dòng đầu của một phân vùng?',
            options: [
              '0|||0',
              'NULL (there is no previous row)|||NULL (không có dòng trước)',
              'The last row\'s value|||Giá trị dòng cuối',
              'An error|||Một lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'ntile(4) OVER (ORDER BY amount DESC) does what?|||ntile(4) OVER (ORDER BY amount DESC) làm gì?',
            options: [
              'Returns the top 4 rows|||Trả về 4 dòng đầu',
              'Splits the ordered rows into 4 roughly equal buckets (quartiles), labeling each row|||Chia các dòng đã sắp thành 4 nhóm xấp xỉ bằng nhau (tứ phân), gán nhãn mỗi dòng',
              'Averages every 4 rows|||Trung bình mỗi 4 dòng',
              'Ranks with ties|||Xếp hạng có đồng hạng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
