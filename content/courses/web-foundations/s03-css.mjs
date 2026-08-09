/**
 * Web Foundations — Chương 3: CSS + responsive (làm cho trang đẹp và vừa mọi màn hình).
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 3 — CSS & responsive design|||Chương 3 — CSS & thiết kế responsive',
  description: 'Nếu HTML là bộ xương, CSS là làn da và trang phục: màu sắc, phông chữ, khoảng cách và — quan trọng nhất — bố cục. Học chọn phần tử, hộp (box model), hai hệ dàn trang hiện đại Flexbox và Grid, rồi làm trang vừa vặn từ điện thoại tới màn hình lớn.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — CSS basics: selectors, properties, the cascade|||3.1 — CSS căn bản: bộ chọn, thuộc tính, và sự "xếp tầng"',
      slug: 'wf-3-1-css-basics',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/yfoY53QXEnI', durationSeconds: 0 },
      description: 'Cách gắn CSS vào trang, cú pháp bộ chọn { thuộc tính: giá trị }, bộ chọn thẻ/class/id, và ý nghĩa hai chữ "Cascading".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>CSS says how HTML should look</h2>
<p class="lead">HTML gives meaning; CSS (Cascading Style Sheets) gives appearance. You write <strong>rules</strong> that pick some elements and set their style. The same HTML can look completely different just by swapping the CSS — content and presentation stay separate, and that separation is the whole point.</p>

<h3>Three ways to attach CSS — use the third</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inline</span><span class="v">style="..." on one element. Quick but unmanageable — avoid.</span></div>
  <div class="kv"><span class="k">Internal</span><span class="v">A &lt;style&gt; block in the &lt;head&gt;. Fine for a single tiny page.</span></div>
  <div class="kv"><span class="k">External</span><span class="v">A separate .css file linked from &lt;head&gt;. The standard — one file styles the whole site.</span></div>
</div>
<pre><code>&lt;!-- in the &lt;head&gt; --&gt;
&lt;link rel="stylesheet" href="styles.css"&gt;</code></pre>

<h3>The shape of a rule</h3>
<pre><code>selector {
  property: value;
  property: value;
}

/* a real example */
p {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
}</code></pre>
<p>A <strong>selector</strong> chooses which elements; inside the braces are <strong>declarations</strong> (a property and its value), each ending in a semicolon.</p>

<h3>The three selectors you use constantly</h3>
<pre><code>h1        { color: navy; }      /* by tag name: every &lt;h1&gt; */
.card     { padding: 16px; }    /* by class: every element with class="card" */
#site-nav { background: #eee; } /* by id: the one element id="site-nav" */</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tag</span><span class="v">Matches all elements of that type. Broad.</span></div>
  <div class="kv"><span class="k">.class</span><span class="v">Matches any element with that class. Reusable — your everyday tool.</span></div>
  <div class="kv"><span class="k">#id</span><span class="v">Matches the single element with that id. Use sparingly.</span></div>
</div>
<p>You can combine them: <code>nav a</code> means "every &lt;a&gt; inside a &lt;nav&gt;"; <code>.card:hover</code> means "a .card while the mouse is over it".</p>

<h3>What "Cascading" means</h3>
<p>When several rules touch the same element, CSS decides the winner by <strong>specificity</strong> (an id beats a class beats a tag) and, on a tie, by <strong>order</strong> (the later rule wins). This is why your styles sometimes "do not apply" — a more specific rule elsewhere is overriding them.</p>
<p class="note-ct"><strong>Prefer classes.</strong> Style almost everything with classes, keep specificity low and even, and let source order settle ties. Fighting the cascade with <code>!important</code> and stacked ids is a mess you can avoid by leaning on classes from the start.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>CSS nói cho HTML biết trông ra sao</h2>
<p class="lead">HTML cho ý nghĩa; CSS (Cascading Style Sheets — bảng kiểu xếp tầng) cho vẻ ngoài. Bạn viết các <strong>quy tắc (rule)</strong> chọn một số phần tử và đặt kiểu cho chúng. Cùng một HTML có thể trông hoàn toàn khác chỉ bằng cách đổi CSS — nội dung và hình thức tách riêng, và chính sự tách đó là điều cốt lõi.</p>

<h3>Ba cách gắn CSS — hãy dùng cách thứ ba</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inline</span><span class="v">style="..." trên một phần tử. Nhanh nhưng khó quản — tránh.</span></div>
  <div class="kv"><span class="k">Internal</span><span class="v">Một khối &lt;style&gt; trong &lt;head&gt;. Ổn cho một trang nhỏ xíu.</span></div>
  <div class="kv"><span class="k">External</span><span class="v">Một file .css riêng, liên kết từ &lt;head&gt;. Chuẩn mực — một file tạo kiểu cho cả site.</span></div>
</div>
<pre><code>&lt;!-- trong &lt;head&gt; --&gt;
&lt;link rel="stylesheet" href="styles.css"&gt;</code></pre>

<h3>Hình dạng một quy tắc</h3>
<pre><code>bộ_chọn {
  thuộc_tính: giá_trị;
  thuộc_tính: giá_trị;
}

/* một ví dụ thật */
p {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
}</code></pre>
<p>Một <strong>bộ chọn (selector)</strong> chọn phần tử nào; bên trong ngoặc là các <strong>khai báo (declaration)</strong> (một thuộc tính và giá trị của nó), mỗi cái kết bằng dấu chấm phẩy.</p>

<h3>Ba bộ chọn bạn dùng liên tục</h3>
<pre><code>h1        { color: navy; }      /* theo tên thẻ: mọi &lt;h1&gt; */
.card     { padding: 16px; }    /* theo class: mọi phần tử có class="card" */
#site-nav { background: #eee; } /* theo id: phần tử duy nhất id="site-nav" */</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Thẻ</span><span class="v">Khớp mọi phần tử loại đó. Rộng.</span></div>
  <div class="kv"><span class="k">.class</span><span class="v">Khớp bất kỳ phần tử nào mang class đó. Tái dùng được — công cụ hằng ngày.</span></div>
  <div class="kv"><span class="k">#id</span><span class="v">Khớp phần tử duy nhất mang id đó. Dùng dè sẻn.</span></div>
</div>
<p>Bạn có thể kết hợp: <code>nav a</code> nghĩa là "mọi &lt;a&gt; bên trong một &lt;nav&gt;"; <code>.card:hover</code> nghĩa là "một .card khi con trỏ chuột đang ở trên nó".</p>

<h3>"Cascading" (xếp tầng) nghĩa là gì</h3>
<p>Khi nhiều quy tắc cùng chạm một phần tử, CSS quyết định người thắng theo <strong>độ đặc hiệu (specificity)</strong> (id thắng class, class thắng thẻ) và, khi hoà, theo <strong>thứ tự</strong> (quy tắc viết sau thắng). Đây là lý do đôi khi kiểu của bạn "không ăn" — một quy tắc đặc hiệu hơn ở chỗ khác đang đè lên.</p>
<p class="note-ct"><strong>Ưu tiên class.</strong> Hãy tạo kiểu gần như mọi thứ bằng class, giữ độ đặc hiệu thấp và đồng đều, và để thứ tự nguồn phân định khi hoà. Đấu với cascade bằng <code>!important</code> và chồng id là một mớ hỗn độn bạn tránh được nếu tựa vào class ngay từ đầu.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — The box model: every element is a box|||3.2 — Box model: mọi phần tử là một cái hộp',
      slug: 'wf-3-2-box-model',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/rIO5326FgPE', durationSeconds: 0 },
      description: 'Content, padding, border, margin — bốn lớp của mọi hộp — cùng box-sizing: border-box, mẹo khiến kích thước cuối cùng dễ đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Understand the box and CSS layout stops being mysterious</h2>
<p class="lead">Every element the browser draws is a rectangular <strong>box</strong> with four layers, from inside out: content, padding, border, margin. Almost every "why is there a gap / why is it too wide" question comes down to these four. Master them and layout gets calm.</p>

<h3>The four layers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Content</span><span class="v">The actual text or image — set by width/height.</span></div>
  <div class="kv"><span class="k">Padding</span><span class="v">Space inside the border, between content and edge. Pushes the border outward.</span></div>
  <div class="kv"><span class="k">Border</span><span class="v">A line around the padding. Has width, style, colour.</span></div>
  <div class="kv"><span class="k">Margin</span><span class="v">Space outside the border — the gap to neighbouring elements.</span></div>
</div>
<pre><code>.card {
  width: 300px;
  padding: 16px;              /* space inside */
  border: 1px solid #ccc;     /* the outline */
  margin: 24px;               /* space to neighbours */
}</code></pre>
<p>A memory hook: <strong>padding is the stuffing inside a jacket; margin is how far you stand from other people.</strong></p>

<h3>The gotcha: what does width actually mean?</h3>
<p>By default, <code>width: 300px</code> sizes only the <em>content</em>. The browser then <em>adds</em> padding and border on top, so the visible box is wider than 300px. This surprises every beginner. The fix is one rule you set once:</p>
<pre><code>*, *::before, *::after {
  box-sizing: border-box;
}</code></pre>
<p>With <code>border-box</code>, <code>width: 300px</code> means the box is 300px <em>including</em> padding and border. Predictable at last. Put this at the top of every stylesheet.</p>

<h3>Shorthands you will use daily</h3>
<pre><code>margin: 10px;                 /* all four sides */
margin: 10px 20px;            /* top/bottom 10, left/right 20 */
margin: 10px 20px 30px 40px;  /* top, right, bottom, left (clockwise) */
padding-left: 8px;            /* just one side */</code></pre>
<p class="pitfall"><strong>Vertical margins collapse.</strong> When two stacked elements each have a vertical margin, the browser uses the <em>larger</em> of the two, not their sum. So a 20px margin below one box and 30px above the next gives a 30px gap, not 50px. Expected behaviour — but it surprises people until they know it.</p>

<h3>Inspect it live</h3>
<p class="note-ct"><strong>Open DevTools</strong> (F12) → Elements → pick an element, and you will see this exact box diagram with the four layers coloured. Learning to read that panel is one of the fastest ways to understand any layout — yours or someone else's.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Hiểu cái hộp thì dàn trang CSS hết bí ẩn</h2>
<p class="lead">Mọi phần tử trình duyệt vẽ ra đều là một <strong>hộp</strong> chữ nhật với bốn lớp, từ trong ra ngoài: content, padding, border, margin. Gần như mọi câu hỏi "sao lại có khoảng hở / sao nó rộng quá" đều quy về bốn lớp này. Thạo chúng thì việc dàn trang trở nên nhẹ nhàng.</p>

<h3>Bốn lớp</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Content</span><span class="v">Chữ hoặc ảnh thật — đặt bằng width/height.</span></div>
  <div class="kv"><span class="k">Padding</span><span class="v">Khoảng trống bên trong viền, giữa content và mép. Đẩy viền ra ngoài.</span></div>
  <div class="kv"><span class="k">Border</span><span class="v">Một đường bao quanh padding. Có độ dày, kiểu, màu.</span></div>
  <div class="kv"><span class="k">Margin</span><span class="v">Khoảng trống bên ngoài viền — khoảng hở tới các phần tử hàng xóm.</span></div>
</div>
<pre><code>.card {
  width: 300px;
  padding: 16px;              /* khoảng trống bên trong */
  border: 1px solid #ccc;     /* đường bao */
  margin: 24px;               /* khoảng hở tới hàng xóm */
}</code></pre>
<p>Một mẹo nhớ: <strong>padding là lớp bông độn bên trong áo khoác; margin là khoảng bạn đứng cách người khác.</strong></p>

<h3>Cái bẫy: width thật ra nghĩa là gì?</h3>
<p>Mặc định, <code>width: 300px</code> chỉ tính kích thước phần <em>content</em>. Trình duyệt rồi <em>cộng thêm</em> padding và border, nên cái hộp nhìn thấy rộng hơn 300px. Điều này làm mọi người mới bất ngờ. Cách chữa là một quy tắc bạn đặt một lần:</p>
<pre><code>*, *::before, *::after {
  box-sizing: border-box;
}</code></pre>
<p>Với <code>border-box</code>, <code>width: 300px</code> nghĩa là cái hộp rộng 300px <em>đã bao gồm</em> padding và border. Cuối cùng cũng dễ đoán. Hãy đặt nó ở đầu mọi bảng kiểu.</p>

<h3>Cú pháp rút gọn bạn dùng hằng ngày</h3>
<pre><code>margin: 10px;                 /* cả bốn cạnh */
margin: 10px 20px;            /* trên/dưới 10, trái/phải 20 */
margin: 10px 20px 30px 40px;  /* trên, phải, dưới, trái (theo chiều kim đồng hồ) */
padding-left: 8px;            /* chỉ một cạnh */</code></pre>
<p class="pitfall"><strong>Margin dọc bị "gộp" (collapse).</strong> Khi hai phần tử xếp chồng mỗi cái có margin dọc, trình duyệt dùng cái <em>lớn hơn</em>, không phải tổng. Nên margin 20px dưới một hộp và 30px trên hộp kế cho khoảng hở 30px, không phải 50px. Đây là hành vi đúng — nhưng gây bất ngờ cho tới khi bạn biết.</p>

<h3>Soi trực tiếp</h3>
<p class="note-ct"><strong>Mở DevTools</strong> (F12) → Elements → chọn một phần tử, bạn sẽ thấy đúng sơ đồ hộp này với bốn lớp được tô màu. Học đọc bảng đó là một trong những cách nhanh nhất để hiểu bất kỳ bố cục nào — của bạn hay của người khác.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Flexbox: arranging things in a row or column|||3.3 — Flexbox: xếp mọi thứ theo hàng hoặc cột',
      slug: 'wf-3-3-flexbox',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/fYq5PXgSsbE', durationSeconds: 0 },
      description: 'display:flex, trục chính/trục phụ, justify-content, align-items, gap, và flex-wrap — công cụ đầu tay để căn chỉnh một chiều.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Flexbox lays items along one line — and centres things at last</h2>
<p class="lead">For decades, centring a box or spacing a navbar evenly was painfully fiddly. <strong>Flexbox</strong> fixed that. You make a container <code>display: flex</code> and its direct children line up along one axis, with clean controls for spacing and alignment. It is the layout tool you reach for most.</p>

<h3>One line of CSS to start</h3>
<pre><code>.navbar {
  display: flex;          /* children now sit in a row */
  gap: 16px;              /* even space between them */
}</code></pre>
<p>The element you set <code>display: flex</code> on is the <strong>flex container</strong>; its direct children become <strong>flex items</strong>.</p>

<h3>Two axes — the key idea</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Main axis</span><span class="v">The direction items flow. Row by default (left→right).</span></div>
  <div class="kv"><span class="k">Cross axis</span><span class="v">Perpendicular to it (top→bottom for a row).</span></div>
  <div class="kv"><span class="k">justify-content</span><span class="v">Positions items along the MAIN axis.</span></div>
  <div class="kv"><span class="k">align-items</span><span class="v">Positions items along the CROSS axis.</span></div>
</div>

<h3>The properties you will use most</h3>
<pre><code>.container {
  display: flex;
  flex-direction: row;            /* or column */
  justify-content: space-between; /* start | center | space-between | space-around */
  align-items: center;            /* start | center | stretch | end */
  gap: 12px;
  flex-wrap: wrap;                /* let items drop to a new line if cramped */
}</code></pre>

<h3>The famous perfect-centre</h3>
<pre><code>.hero {
  display: flex;
  justify-content: center;  /* centre horizontally */
  align-items: center;      /* centre vertically */
  min-height: 100vh;        /* fill the screen height */
}</code></pre>
<p>Two lines centre a child both ways — the thing that used to take ugly hacks.</p>

<h3>Growing and shrinking</h3>
<p>On an item, <code>flex: 1</code> tells it to grow and share leftover space equally with its siblings. This is how you build a sidebar of fixed width next to content that fills the rest:</p>
<pre><code>.sidebar { width: 240px; }   /* fixed */
.content { flex: 1; }        /* takes all remaining space */</code></pre>
<p class="note-ct"><strong>Reach for Flexbox for one-dimensional layout:</strong> a navbar, a row of buttons, a card's inner alignment, a media object (avatar beside text). When you need a real two-dimensional grid of rows AND columns, that is the next lesson.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Flexbox xếp các mục theo một đường thẳng — và cuối cùng cũng căn giữa được</h2>
<p class="lead">Suốt nhiều thập ni, căn giữa một cái hộp hay giãn đều một thanh điều hướng là chuyện vặt mà cực kỳ khó chịu. <strong>Flexbox</strong> giải quyết điều đó. Bạn cho một vùng chứa <code>display: flex</code> và các con trực tiếp của nó xếp thẳng hàng theo một trục, với các nút điều khiển gọn gàng cho khoảng cách và căn chỉnh. Đây là công cụ dàn trang bạn dùng nhiều nhất.</p>

<h3>Một dòng CSS để bắt đầu</h3>
<pre><code>.navbar {
  display: flex;          /* các con giờ nằm thành một hàng */
  gap: 16px;              /* khoảng cách đều giữa chúng */
}</code></pre>
<p>Phần tử bạn đặt <code>display: flex</code> là <strong>flex container (vùng chứa)</strong>; các con trực tiếp của nó thành <strong>flex item (mục)</strong>.</p>

<h3>Hai trục — ý tưởng cốt lõi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trục chính</span><span class="v">Hướng các mục trôi theo. Mặc định là hàng (trái→phải).</span></div>
  <div class="kv"><span class="k">Trục phụ</span><span class="v">Vuông góc với nó (trên→dưới khi là hàng).</span></div>
  <div class="kv"><span class="k">justify-content</span><span class="v">Đặt vị trí các mục dọc theo TRỤC CHÍNH.</span></div>
  <div class="kv"><span class="k">align-items</span><span class="v">Đặt vị trí các mục dọc theo TRỤC PHỤ.</span></div>
</div>

<h3>Các thuộc tính bạn dùng nhiều nhất</h3>
<pre><code>.container {
  display: flex;
  flex-direction: row;            /* hoặc column */
  justify-content: space-between; /* start | center | space-between | space-around */
  align-items: center;            /* start | center | stretch | end */
  gap: 12px;
  flex-wrap: wrap;                /* cho các mục rớt xuống dòng mới nếu chật */
}</code></pre>

<h3>Cú "căn giữa hoàn hảo" trứ danh</h3>
<pre><code>.hero {
  display: flex;
  justify-content: center;  /* căn giữa theo chiều ngang */
  align-items: center;      /* căn giữa theo chiều dọc */
  min-height: 100vh;        /* chiếm hết chiều cao màn hình */
}</code></pre>
<p>Hai dòng căn giữa một phần tử con theo cả hai chiều — thứ trước kia phải dùng những chiêu xấu xí.</p>

<h3>Nở ra và co lại</h3>
<p>Trên một mục, <code>flex: 1</code> bảo nó nở ra và chia đều phần không gian còn dư với các anh em. Đây là cách bạn dựng một thanh bên rộng cố định cạnh phần nội dung lấp đầy phần còn lại:</p>
<pre><code>.sidebar { width: 240px; }   /* cố định */
.content { flex: 1; }        /* lấy hết không gian còn lại */</code></pre>
<p class="note-ct"><strong>Dùng Flexbox cho bố cục một chiều:</strong> một thanh điều hướng, một hàng nút, căn chỉnh bên trong một thẻ, một khối media (ảnh đại diện cạnh chữ). Khi bạn cần một lưới hai chiều thật sự gồm CẢ hàng VÀ cột, đó là bài kế tiếp.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — CSS Grid: two-dimensional layout|||3.4 — CSS Grid: dàn trang hai chiều',
      slug: 'wf-3-4-css-grid',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/9zBsdzdE4sM', durationSeconds: 0 },
      description: 'grid-template-columns, đơn vị fr, gap, repeat(), và minmax()/auto-fit để tạo lưới thẻ tự xuống dòng — dàn cả hàng lẫn cột cùng lúc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Grid lays out rows and columns together</h2>
<p class="lead">Flexbox handles one line at a time. <strong>CSS Grid</strong> handles a true two-dimensional structure — you define columns and rows, and place items into that grid. It is the tool for page layouts and card galleries.</p>

<h3>Columns with the fr unit</h3>
<pre><code>.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* three equal columns */
  gap: 16px;
}</code></pre>
<p>The <strong>fr</strong> unit means "one fraction of the free space". <code>1fr 1fr 1fr</code> splits the row into three equal columns; <code>2fr 1fr</code> makes the first column twice as wide as the second. Cleaner than juggling percentages.</p>

<h3>repeat() — do not type it twelve times</h3>
<pre><code>grid-template-columns: repeat(3, 1fr);        /* same as 1fr 1fr 1fr */
grid-template-columns: 240px 1fr;             /* fixed sidebar + flexible content */</code></pre>

<h3>The responsive grid trick worth memorising</h3>
<p>This one line makes a card grid that automatically fits as many columns as will fit, and reflows on smaller screens — no media query needed:</p>
<pre><code>.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">auto-fit</span><span class="v">Fit as many columns as the width allows.</span></div>
  <div class="kv"><span class="k">minmax(220px, 1fr)</span><span class="v">Each column is at least 220px, but grows to share extra space.</span></div>
  <div class="kv"><span class="k">Result</span><span class="v">4 columns on a desktop, 2 on a tablet, 1 on a phone — automatically.</span></div>
</div>

<h3>Grid or Flexbox?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flexbox</span><span class="v">Content in ONE direction: a row, a column, a navbar, aligning items on a line.</span></div>
  <div class="kv"><span class="k">Grid</span><span class="v">A structure in TWO directions at once: page regions, image galleries, dashboards.</span></div>
</div>
<p class="note-ct"><strong>You do not choose one forever.</strong> Real pages use both together — Grid for the overall page skeleton, Flexbox inside individual cards and bars. Learn both; reach for whichever matches the shape of the problem in front of you.</p>

<div class="link-card"><a href="https://cssgridgarden.com/" target="_blank" rel="noopener">Grid Garden — learn CSS Grid by playing a game</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Grid dàn cả hàng lẫn cột cùng lúc</h2>
<p class="lead">Flexbox xử lý một đường tại một thời điểm. <strong>CSS Grid</strong> xử lý một cấu trúc hai chiều thật sự — bạn định nghĩa các cột và hàng, rồi đặt các mục vào lưới đó. Đây là công cụ cho bố cục trang và các phòng trưng bày thẻ.</p>

<h3>Cột với đơn vị fr</h3>
<pre><code>.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* ba cột bằng nhau */
  gap: 16px;
}</code></pre>
<p>Đơn vị <strong>fr</strong> nghĩa là "một phần của không gian trống". <code>1fr 1fr 1fr</code> chia hàng thành ba cột bằng nhau; <code>2fr 1fr</code> làm cột đầu rộng gấp đôi cột sau. Gọn hơn nhiều so với xoay xở với phần trăm.</p>

<h3>repeat() — đừng gõ mười hai lần</h3>
<pre><code>grid-template-columns: repeat(3, 1fr);        /* giống 1fr 1fr 1fr */
grid-template-columns: 240px 1fr;             /* thanh bên cố định + nội dung linh hoạt */</code></pre>

<h3>Chiêu lưới responsive đáng học thuộc</h3>
<p>Một dòng này tạo một lưới thẻ tự động vừa đủ nhiều cột nhất có thể, và tự sắp lại trên màn hình nhỏ hơn — không cần media query:</p>
<pre><code>.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">auto-fit</span><span class="v">Nhồi nhiều cột nhất mà chiều rộng cho phép.</span></div>
  <div class="kv"><span class="k">minmax(220px, 1fr)</span><span class="v">Mỗi cột tối thiểu 220px, nhưng nở ra để chia phần dư.</span></div>
  <div class="kv"><span class="k">Kết quả</span><span class="v">4 cột trên desktop, 2 trên tablet, 1 trên điện thoại — tự động.</span></div>
</div>

<h3>Grid hay Flexbox?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flexbox</span><span class="v">Nội dung theo MỘT chiều: một hàng, một cột, một thanh điều hướng, căn các mục trên một đường.</span></div>
  <div class="kv"><span class="k">Grid</span><span class="v">Một cấu trúc theo HAI chiều cùng lúc: các vùng của trang, thư viện ảnh, bảng điều khiển.</span></div>
</div>
<p class="note-ct"><strong>Bạn không chọn một cái mãi mãi.</strong> Trang thật dùng cả hai cùng nhau — Grid cho bộ khung tổng thể của trang, Flexbox bên trong từng thẻ và thanh. Học cả hai; dùng cái nào khớp với hình dạng bài toán trước mặt.</p>

<div class="link-card"><a href="https://cssgridgarden.com/" target="_blank" rel="noopener">Grid Garden — học CSS Grid bằng cách chơi game</a></div>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Responsive design: one page, every screen|||3.5 — Thiết kế responsive: một trang, mọi màn hình',
      slug: 'wf-3-5-responsive',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/VQraviuwbzU', durationSeconds: 0 },
      description: 'Đơn vị tương đối (%, rem, vw), thẻ viewport, tư duy mobile-first, và media query để trang đẹp từ điện thoại tới màn hình rộng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Design for phones first, then let it grow</h2>
<p class="lead">More than half the web is browsed on phones. <strong>Responsive design</strong> means one HTML page that reshapes itself to any screen — not a separate mobile site. The recipe is: flexible units, a viewport tag, mobile-first CSS, and a few media queries.</p>

<h3>Step 0: the viewport tag (from Chapter 2)</h3>
<pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code></pre>
<p>Without this, phones pretend to be a wide desktop and shrink your whole page to unreadable. It is the one line that makes responsiveness possible — never leave it out.</p>

<h3>Use relative units, not fixed pixels</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">%</span><span class="v">Relative to the parent. width: 100% fills whatever contains it.</span></div>
  <div class="kv"><span class="k">rem</span><span class="v">Relative to the root font size. 1rem = 16px by default. Use for font sizes and spacing so everything scales together.</span></div>
  <div class="kv"><span class="k">vw / vh</span><span class="v">1vw = 1% of the viewport width; 100vh = full screen height.</span></div>
  <div class="kv"><span class="k">max-width</span><span class="v">img { max-width: 100%; } stops images overflowing on small screens — a must.</span></div>
</div>

<h3>Media queries — different CSS at different widths</h3>
<p>A <strong>media query</strong> applies a block of CSS only when a condition holds — usually a minimum screen width called a <strong>breakpoint</strong>:</p>
<pre><code>/* base styles: written for the phone (mobile-first) */
.container { padding: 16px; }
.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* tablet and up */
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* desktop and up */
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}</code></pre>

<h3>Why mobile-first?</h3>
<p>Write the simplest layout — the phone one — as your base CSS, then use <code>min-width</code> queries to <em>add</em> complexity as the screen grows. This is easier to reason about and produces less code than starting wide and stripping things away.</p>
<p class="pitfall"><strong>Test at real sizes, not just by guessing.</strong> Open DevTools (F12) → the device-toolbar / responsive mode, and drag the width. Watch your breakpoints kick in. Many "it looks broken on my phone" bugs are a missing viewport tag or a fixed pixel width that never got a max-width.</p>

<h3>Where this leads</h3>
<p class="note-ct"><strong>Every framework builds on this.</strong> Tailwind CSS (used in the Next.js course) is just these ideas with short class names — <code>md:grid-cols-3</code> is a <code>min-width: 768px</code> media query. Understand raw CSS responsiveness here and every UI framework afterwards is a shortcut, not a mystery.</p>

<div class="link-card"><a href="https://web.dev/learn/design" target="_blank" rel="noopener">web.dev — Learn Responsive Design</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Thiết kế cho điện thoại trước, rồi để nó nở ra</h2>
<p class="lead">Hơn một nửa lượt truy cập web là trên điện thoại. <strong>Thiết kế responsive</strong> nghĩa là một trang HTML tự tái định hình cho mọi màn hình — không phải một site di động riêng. Công thức là: đơn vị linh hoạt, thẻ viewport, CSS mobile-first, và vài media query.</p>

<h3>Bước 0: thẻ viewport (từ Chương 2)</h3>
<pre><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code></pre>
<p>Thiếu nó, điện thoại giả vờ là một desktop rộng và thu nhỏ cả trang tới mức không đọc nổi. Đó là dòng duy nhất khiến responsive khả thi — đừng bao giờ bỏ.</p>

<h3>Dùng đơn vị tương đối, không phải pixel cố định</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">%</span><span class="v">Tương đối theo phần tử cha. width: 100% lấp đầy thứ chứa nó.</span></div>
  <div class="kv"><span class="k">rem</span><span class="v">Tương đối theo cỡ chữ gốc. 1rem = 16px mặc định. Dùng cho cỡ chữ và khoảng cách để mọi thứ co giãn cùng nhau.</span></div>
  <div class="kv"><span class="k">vw / vh</span><span class="v">1vw = 1% chiều rộng khung nhìn; 100vh = trọn chiều cao màn hình.</span></div>
  <div class="kv"><span class="k">max-width</span><span class="v">img { max-width: 100%; } ngăn ảnh tràn ra trên màn hình nhỏ — bắt buộc.</span></div>
</div>

<h3>Media query — CSS khác nhau ở các chiều rộng khác nhau</h3>
<p>Một <strong>media query</strong> áp một khối CSS chỉ khi một điều kiện đúng — thường là chiều rộng màn hình tối thiểu, gọi là một <strong>điểm ngắt (breakpoint)</strong>:</p>
<pre><code>/* kiểu nền: viết cho điện thoại (mobile-first) */
.container { padding: 16px; }
.cards { display: grid; grid-template-columns: 1fr; gap: 16px; }

/* từ tablet trở lên */
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

/* từ desktop trở lên */
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}</code></pre>

<h3>Vì sao mobile-first?</h3>
<p>Viết bố cục đơn giản nhất — bố cục điện thoại — làm CSS nền, rồi dùng các query <code>min-width</code> để <em>thêm</em> độ phức tạp khi màn hình lớn dần. Cách này dễ suy luận hơn và ít code hơn so với bắt đầu từ màn hình rộng rồi lược bớt.</p>
<p class="pitfall"><strong>Kiểm ở kích thước thật, đừng chỉ đoán.</strong> Mở DevTools (F12) → thanh thiết bị / chế độ responsive, rồi kéo chiều rộng. Xem các breakpoint kích hoạt. Nhiều lỗi "trên điện thoại nhìn hỏng" là do thiếu thẻ viewport hoặc một chiều rộng pixel cố định không bao giờ được cho max-width.</p>

<h3>Điều này dẫn tới đâu</h3>
<p class="note-ct"><strong>Mọi framework đều đứng trên nền này.</strong> Tailwind CSS (dùng trong khoá Next.js) chỉ là những ý tưởng này với tên class ngắn — <code>md:grid-cols-3</code> chính là một media query <code>min-width: 768px</code>. Hiểu responsive bằng CSS thuần ở đây thì mọi framework UI về sau là một lối tắt, không phải một điều bí ẩn.</p>

<div class="link-card"><a href="https://web.dev/learn/design" target="_blank" rel="noopener">web.dev — Học Thiết kế Responsive</a></div>
</div>
`,
    },

    /* ─────────────────────────── 3.6 quiz ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra chương 3',
      slug: 'wf-3-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về bộ chọn và cascade, box model, Flexbox, Grid và thiết kế responsive.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 3: selectors and the cascade, the box model and box-sizing, Flexbox axes, CSS Grid, relative units and media queries.</p></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 3: bộ chọn và cascade, box model và box-sizing, các trục Flexbox, CSS Grid, đơn vị tương đối và media query.</p></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which selector matches every element with class="card"?|||Bộ chọn nào khớp mọi phần tử có class="card"?',
            options: [
              '.card|||.card',
              '#card|||#card',
              'card|||card',
              '*card|||*card',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The recommended way to add CSS to a real site is…|||Cách được khuyến nghị để thêm CSS cho một site thật là…',
            options: [
              'An external .css file linked from <head>|||Một file .css riêng liên kết từ <head>',
              'An inline style="" on every element|||Một style="" inline trên mọi phần tử',
              'A <style> block repeated on each page|||Một khối <style> lặp lại trên từng trang',
              'Writing CSS inside the JavaScript file|||Viết CSS bên trong file JavaScript',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What are the four layers of the box model, inside to outside?|||Bốn lớp của box model, từ trong ra ngoài, là gì?',
            options: [
              'content, padding, border, margin|||content, padding, border, margin',
              'margin, border, padding, content|||margin, border, padding, content',
              'padding, content, margin, border|||padding, content, margin, border',
              'border, margin, content, padding|||border, margin, content, padding',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does box-sizing: border-box do?|||box-sizing: border-box làm gì?',
            options: [
              'Makes width include padding and border, so sizes are predictable|||Khiến width bao gồm padding và border, nên kích thước dễ đoán',
              'Removes all borders|||Xoá mọi đường viền',
              'Doubles the element width|||Nhân đôi chiều rộng phần tử',
              'Turns the element into a flex container|||Biến phần tử thành flex container',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In Flexbox, justify-content positions items along which axis?|||Trong Flexbox, justify-content đặt vị trí các mục dọc theo trục nào?',
            options: [
              'The main axis|||Trục chính',
              'The cross axis|||Trục phụ',
              'Both axes at once|||Cả hai trục cùng lúc',
              'Neither — it sets colours|||Không trục nào — nó đặt màu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which pair of properties perfectly centres a child with Flexbox?|||Cặp thuộc tính nào căn giữa hoàn hảo một phần tử con bằng Flexbox?',
            options: [
              'justify-content: center; align-items: center;|||justify-content: center; align-items: center;',
              'text-align: center; margin: 0;|||text-align: center; margin: 0;',
              'float: center; clear: both;|||float: center; clear: both;',
              'position: center; top: 50%;|||position: center; top: 50%;',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the fr unit mean in CSS Grid?|||Đơn vị fr trong CSS Grid nghĩa là gì?',
            options: [
              'A fraction of the available free space|||Một phần của không gian trống có sẵn',
              'A fixed number of pixels|||Một số pixel cố định',
              'The font size|||Cỡ chữ',
              'A French locale setting|||Một thiết lập ngôn ngữ tiếng Pháp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'For a one-dimensional row (like a navbar), which tool fits best?|||Với một hàng một chiều (như thanh điều hướng), công cụ nào hợp nhất?',
            options: [
              'Flexbox|||Flexbox',
              'A table|||Một cái bảng',
              'Absolute positioning of every item|||Định vị tuyệt đối từng mục',
              'Nothing — HTML aligns rows by itself|||Không cần gì — HTML tự căn hàng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which meta tag is required for responsive design to work on phones?|||Thẻ meta nào bắt buộc để responsive hoạt động trên điện thoại?',
            options: [
              '<meta name="viewport" content="width=device-width, initial-scale=1">|||<meta name="viewport" content="width=device-width, initial-scale=1">',
              '<meta charset="UTF-8">|||<meta charset="UTF-8">',
              '<meta name="description" content="...">|||<meta name="description" content="...">',
              '<meta name="mobile" content="yes">|||<meta name="mobile" content="yes">',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is a "mobile-first" media query strategy?|||Chiến lược media query "mobile-first" là gì?',
            options: [
              'Write base CSS for phones, then use min-width queries to add for larger screens|||Viết CSS nền cho điện thoại, rồi dùng query min-width để thêm cho màn hình lớn hơn',
              'Write for desktop, then hide things on mobile|||Viết cho desktop, rồi ẩn bớt trên di động',
              'Only support mobile and block desktops|||Chỉ hỗ trợ di động và chặn desktop',
              'Use a completely separate mobile website|||Dùng một website di động hoàn toàn tách biệt',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
