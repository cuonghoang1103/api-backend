/**
 * Web Foundations — Chương 3: CSS + responsive (làm cho trang đẹp và vừa mọi màn hình).
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery } from './_slides.mjs';

export default {
  title: 'Chapter 3 — CSS & responsive design|||Chương 3 — CSS & thiết kế responsive',
  description: 'Nếu HTML là bộ xương, CSS là làn da và trang phục: màu sắc, phông chữ, khoảng cách và — quan trọng nhất — bố cục. Học chọn phần tử, hộp (box model), hai hệ dàn trang hiện đại Flexbox và Grid, rồi làm trang vừa vặn từ điện thoại tới màn hình lớn.',
  lessons: [
    /* ─────────────────── 3.0 slide bài giảng ─────────────────── */
    {
      title: '3.0 — Lecture slides: CSS in 14 slides|||3.0 — Slide bài giảng: CSS trong 14 slide',
      slug: 'wf-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ chọn, box model, Flexbox, Grid và responsive — nền để hiểu các class của Bootstrap.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: CSS in 14 slides</h2>
<p>Slides 7 and 10 (Flexbox and breakpoints) are what Bootstrap wraps up into class names. Understand them and Bootstrap stops being magic.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: CSS trong 14 slide</h2>
<p>Slide 7 và 10 (Flexbox và breakpoint) chính là thứ Bootstrap gói lại thành tên class. Hiểu hai cái đó thì Bootstrap hết là phép thuật.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${gallery('wf-css', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Ba cách gắn CSS"],
  [4, "Bộ chọn — bốn loại dùng nhiều nhất"],
  [5, "Xếp tầng & độ ưu tiên — vì sao CSS không ăn"],
  [6, "Box model và một dòng chữa hết"],
  [7, "Flexbox — xếp theo một chiều ⭐"],
  [8, "Canh giữa — bài toán kinh điển"],
  [9, "CSS Grid — dàn trang hai chiều"],
  [10, "Responsive — mobile first ⭐⭐"],
  [11, "Đơn vị — dùng cái nào khi nào"],
  [12, "Biến CSS — đổi màu cả trang một dòng"],
  [13, "Bốn lỗi CSS hay gặp"],
  [14, "Tự luyện"],
])}
`,
    },

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
<pre><code class="language-html">&lt;!-- in the &lt;head&gt; --&gt;
&lt;link rel="stylesheet" href="styles.css"&gt;</code></pre>

<h3>The shape of a rule</h3>
<pre><code class="language-css">selector {
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
<pre><code class="language-css">h1        { color: navy; }      /* by tag name: every &lt;h1&gt; */
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
<h3>How the browser picks which rule wins</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Collect every matching rule</span><span class="lz-d">From your stylesheets, from inline styles, and from the browser's own defaults. Several rules setting the same property is normal, not a mistake.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Compare specificity</span><span class="lz-d">An id beats any number of classes; a class beats any number of tag names. <code>#nav a</code> beats <code>.menu .link.active</code>, however unfair that feels.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tie? The later rule wins</span><span class="lz-d">Same specificity means source order decides — which is why the order of your <code>&lt;link&gt;</code> tags matters and why appending a rule often "fixes" it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">DevTools shows you the answer</span><span class="lz-d">The Styles panel lists every rule that matched and strikes through the ones that lost. Read it instead of guessing — the reason is always right there.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — reaching for <code>!important</code> to win a fight you have not diagnosed.</strong> It works instantly, which is the problem: the real cause was a more specific selector somewhere, and you have now added a rule that only a second <code>!important</code> can override. Two months later a stylesheet has fifteen of them, and changing any colour requires adding a sixteenth. When a style does not apply, open DevTools, find the rule that beat yours, and either match its specificity or lower it. Keep <code>!important</code> for overriding third-party CSS you cannot edit — that is the one case where it is the right tool.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity" target="_blank" rel="noopener">MDN — Specificity, with the exact scoring rules</a></div>
<div class="link-card"><a href="https://specificity.keegan.st/" target="_blank" rel="noopener">Specificity calculator — paste a selector, see its score</a></div>
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
<pre><code class="language-html">&lt;!-- trong &lt;head&gt; --&gt;
&lt;link rel="stylesheet" href="styles.css"&gt;</code></pre>

<h3>Hình dạng một quy tắc</h3>
<pre><code class="language-css">bộ_chọn {
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
<pre><code class="language-css">h1        { color: navy; }      /* theo tên thẻ: mọi &lt;h1&gt; */
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
<h3>Trình duyệt chọn luật nào thắng như thế nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gom mọi luật khớp</span><span class="lz-d">Từ bảng kiểu của bạn, từ style viết thẳng trong thẻ, và từ mặc định của chính trình duyệt. Nhiều luật cùng đặt một thuộc tính là chuyện bình thường, không phải sai.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">So độ đặc hiệu</span><span class="lz-d">Một id thắng bao nhiêu class cũng thắng; một class thắng bao nhiêu tên thẻ cũng thắng. <code>#nav a</code> thắng <code>.menu .link.active</code>, dù nghe có bất công đến đâu.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hoà? Luật đứng sau thắng</span><span class="lz-d">Cùng độ đặc hiệu thì thứ tự trong mã quyết định — đó là lý do thứ tự các thẻ <code>&lt;link&gt;</code> có ý nghĩa và là lý do thêm một luật vào cuối thường "chữa" được.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">DevTools bày sẵn đáp án</span><span class="lz-d">Bảng Styles liệt kê mọi luật đã khớp và gạch ngang những cái thua. Hãy đọc nó thay vì đoán — lý do luôn nằm ngay đó.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — với tay lấy <code>!important</code> để thắng một trận bạn chưa chẩn đoán.</strong> Nó hiệu nghiệm tức thì, và đó mới là vấn đề: nguyên nhân thật là một bộ chọn đặc hiệu hơn ở đâu đó, còn bạn thì vừa thêm một luật mà chỉ một <code>!important</code> thứ hai mới đè nổi. Hai tháng sau, một bảng kiểu có mười lăm cái như thế, và đổi một màu bất kỳ đòi phải thêm cái thứ mười sáu. Khi một style không ăn, hãy mở DevTools, tìm cái luật đã thắng luật của bạn, rồi hoặc cân bằng độ đặc hiệu hoặc hạ nó xuống. Hãy để dành <code>!important</code> cho việc đè CSS của bên thứ ba mà bạn không sửa được — đó là trường hợp duy nhất nó là công cụ đúng.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity" target="_blank" rel="noopener">MDN — Độ đặc hiệu, kèm luật tính điểm chính xác</a></div>
<div class="link-card"><a href="https://specificity.keegan.st/" target="_blank" rel="noopener">Máy tính độ đặc hiệu — dán một bộ chọn, xem điểm của nó</a></div>
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
<pre><code class="language-css">.card {
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
<h3>The box model, from the inside out</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Content</span><span class="lz-t">The text or image itself</span><span class="lz-d">What <code>width</code> and <code>height</code> refer to by default — and only this part, which is where the confusion starts.</span></div>
<div class="lz-layer"><span class="lz-k">Padding</span><span class="lz-t">Space inside the border</span><span class="lz-d">Takes the element's background colour. Use it to push content away from the edge of a card or button.</span></div>
<div class="lz-layer"><span class="lz-k">Border</span><span class="lz-t">The line around it</span><span class="lz-d">Adds to the element's rendered size unless <code>box-sizing</code> says otherwise. A 1px border on both sides is 2px wider than you asked for.</span></div>
<div class="lz-layer"><span class="lz-k">Margin</span><span class="lz-t">Space outside, between elements</span><span class="lz-d">Always transparent, and never part of the element's size. Vertical margins between siblings collapse into one — the larger of the two.</span></div>
</div>
<pre><code class="language-css">* { box-sizing: border-box; }   /* put this at the top of every stylesheet */

.card { width: 300px; padding: 20px; border: 1px solid #ddd; }
/* with border-box:  the card is exactly 300px wide  */
/* without it:       300 + 40 + 2 = 342px            */</code></pre>
<div class="pitfall"><p><strong>Trap — two columns at <code>width: 50%</code> that do not fit side by side.</strong> Give each of them <code>padding: 20px</code> and, under the default <code>content-box</code> sizing, each is really 50% + 40px wide — so together they exceed 100% and the second wraps onto its own line. Nothing errors; the layout just breaks, usually only at certain screen widths, which makes it look like a responsive bug. The one-line fix at the top of the stylesheet, <code>* { box-sizing: border-box; }</code>, makes <code>width</code> mean the whole visible box including padding and border. Every CSS framework does this on your behalf; do it yourself when you are not using one.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model" target="_blank" rel="noopener">MDN — The box model, with interactive examples</a></div>
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
<pre><code class="language-css">.card {
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
<h3>Mô hình hộp, từ trong ra ngoài</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Nội dung</span><span class="lz-t">Chính đoạn chữ hay tấm ảnh</span><span class="lz-d">Thứ mà <code>width</code> và <code>height</code> mặc định trỏ tới — và chỉ phần này thôi, đó là chỗ bắt đầu mọi nhầm lẫn.</span></div>
<div class="lz-layer"><span class="lz-k">Padding</span><span class="lz-t">Khoảng trống bên trong viền</span><span class="lz-d">Mang màu nền của phần tử. Dùng nó để đẩy nội dung ra khỏi mép một cái thẻ hay cái nút.</span></div>
<div class="lz-layer"><span class="lz-k">Border</span><span class="lz-t">Đường viền quanh nó</span><span class="lz-d">Cộng thêm vào kích thước hiển thị trừ khi <code>box-sizing</code> nói khác. Viền 1px hai bên là rộng hơn 2px so với con số bạn đặt.</span></div>
<div class="lz-layer"><span class="lz-k">Margin</span><span class="lz-t">Khoảng trống bên ngoài, giữa các phần tử</span><span class="lz-d">Luôn trong suốt, và không bao giờ tính vào kích thước phần tử. Margin dọc giữa hai anh em sẽ gộp làm một — lấy cái lớn hơn.</span></div>
</div>
<pre><code class="language-css">* { box-sizing: border-box; }   /* đặt dòng này ở đầu mọi bảng kiểu */

.card { width: 300px; padding: 20px; border: 1px solid #ddd; }
/* với border-box:  cái thẻ rộng đúng 300px       */
/* không có nó:     300 + 40 + 2 = 342px          */</code></pre>
<div class="pitfall"><p><strong>Bẫy — hai cột <code>width: 50%</code> mà không nằm cạnh nhau nổi.</strong> Cho mỗi cái <code>padding: 20px</code>, thì dưới kiểu tính mặc định <code>content-box</code>, mỗi cái thật ra rộng 50% + 40px — nên cộng lại vượt quá 100% và cái thứ hai rớt xuống hàng riêng. Chẳng lỗi nào cả; bố cục chỉ đơn giản là vỡ, thường chỉ ở vài độ rộng màn hình nhất định, làm nó trông như một lỗi responsive. Cách chữa một dòng ở đầu bảng kiểu, <code>* { box-sizing: border-box; }</code>, làm <code>width</code> nghĩa là cả cái hộp nhìn thấy được, kể cả padding và viền. Framework CSS nào cũng làm việc này giùm bạn; hãy tự làm khi bạn không dùng cái nào.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model" target="_blank" rel="noopener">MDN — Mô hình hộp, kèm ví dụ tương tác</a></div>
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
<pre><code class="language-css">.navbar {
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
<pre><code class="language-css">.container {
  display: flex;
  flex-direction: row;            /* or column */
  justify-content: space-between; /* start | center | space-between | space-around */
  align-items: center;            /* start | center | stretch | end */
  gap: 12px;
  flex-wrap: wrap;                /* let items drop to a new line if cramped */
}</code></pre>

<h3>The famous perfect-centre</h3>
<pre><code class="language-css">.hero {
  display: flex;
  justify-content: center;  /* centre horizontally */
  align-items: center;      /* centre vertically */
  min-height: 100vh;        /* fill the screen height */
}</code></pre>
<p>Two lines centre a child both ways — the thing that used to take ugly hacks.</p>

<h3>Growing and shrinking</h3>
<p>On an item, <code>flex: 1</code> tells it to grow and share leftover space equally with its siblings. This is how you build a sidebar of fixed width next to content that fills the rest:</p>
<pre><code class="language-css">.sidebar { width: 240px; }   /* fixed */
.content { flex: 1; }        /* takes all remaining space */</code></pre>
<p class="note-ct"><strong>Reach for Flexbox for one-dimensional layout:</strong> a navbar, a row of buttons, a card's inner alignment, a media object (avatar beside text). When you need a real two-dimensional grid of rows AND columns, that is the next lesson.</p>
<h3>Flexbox in four decisions</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Which element is the container?</span><span class="lz-d"><code>display: flex</code> goes on the <em>parent</em>. It changes how its direct children are laid out and does nothing to grandchildren.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Which way is the main axis?</span><span class="lz-d"><code>flex-direction: row</code> (default) or <code>column</code>. This single property decides what "justify" and "align" mean for everything below.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">justify-content — along the main axis</span><span class="lz-d">Left-to-right in a row, top-to-bottom in a column. <code>space-between</code> is the classic navbar: logo left, links right.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">align-items — across it</span><span class="lz-d">The perpendicular direction. <code>center</code> here is what vertically centres a row of items, the thing CSS was mocked for being unable to do.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>justify-content: center</code> that centres nothing, because the axis is not the one you pictured.</strong> The two alignment properties swap meaning the moment you set <code>flex-direction: column</code>: <code>justify-content</code> now works vertically and <code>align-items</code> horizontally. So a sidebar you switched to a column suddenly ignores the centring you wrote, and adding more <code>center</code> values makes it worse. Before touching either property, say the direction out loud — "this is a column, so justify is vertical" — or use DevTools' flexbox overlay, which draws the main axis on the page so there is nothing left to guess.</p></div>
<div class="link-card"><a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noopener">CSS-Tricks — A Complete Guide to Flexbox (the one everyone keeps open)</a></div>
<div class="link-card"><a href="https://flexboxfroggy.com/" target="_blank" rel="noopener">Flexbox Froggy — 24 levels, learn it by playing</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Flexbox xếp các mục theo một đường thẳng — và cuối cùng cũng căn giữa được</h2>
<p class="lead">Suốt nhiều thập ni, căn giữa một cái hộp hay giãn đều một thanh điều hướng là chuyện vặt mà cực kỳ khó chịu. <strong>Flexbox</strong> giải quyết điều đó. Bạn cho một vùng chứa <code>display: flex</code> và các con trực tiếp của nó xếp thẳng hàng theo một trục, với các nút điều khiển gọn gàng cho khoảng cách và căn chỉnh. Đây là công cụ dàn trang bạn dùng nhiều nhất.</p>

<h3>Một dòng CSS để bắt đầu</h3>
<pre><code class="language-css">.navbar {
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
<pre><code class="language-css">.container {
  display: flex;
  flex-direction: row;            /* hoặc column */
  justify-content: space-between; /* start | center | space-between | space-around */
  align-items: center;            /* start | center | stretch | end */
  gap: 12px;
  flex-wrap: wrap;                /* cho các mục rớt xuống dòng mới nếu chật */
}</code></pre>

<h3>Cú "căn giữa hoàn hảo" trứ danh</h3>
<pre><code class="language-css">.hero {
  display: flex;
  justify-content: center;  /* căn giữa theo chiều ngang */
  align-items: center;      /* căn giữa theo chiều dọc */
  min-height: 100vh;        /* chiếm hết chiều cao màn hình */
}</code></pre>
<p>Hai dòng căn giữa một phần tử con theo cả hai chiều — thứ trước kia phải dùng những chiêu xấu xí.</p>

<h3>Nở ra và co lại</h3>
<p>Trên một mục, <code>flex: 1</code> bảo nó nở ra và chia đều phần không gian còn dư với các anh em. Đây là cách bạn dựng một thanh bên rộng cố định cạnh phần nội dung lấp đầy phần còn lại:</p>
<pre><code class="language-css">.sidebar { width: 240px; }   /* cố định */
.content { flex: 1; }        /* lấy hết không gian còn lại */</code></pre>
<p class="note-ct"><strong>Dùng Flexbox cho bố cục một chiều:</strong> một thanh điều hướng, một hàng nút, căn chỉnh bên trong một thẻ, một khối media (ảnh đại diện cạnh chữ). Khi bạn cần một lưới hai chiều thật sự gồm CẢ hàng VÀ cột, đó là bài kế tiếp.</p>
<h3>Flexbox trong bốn quyết định</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Phần tử nào là vật chứa?</span><span class="lz-d"><code>display: flex</code> đặt lên <em>phần tử cha</em>. Nó đổi cách các con TRỰC TIẾP được bố trí và chẳng làm gì với các cháu.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trục chính đi hướng nào?</span><span class="lz-d"><code>flex-direction: row</code> (mặc định) hoặc <code>column</code>. Đúng một thuộc tính này quyết định "justify" và "align" nghĩa là gì cho mọi thứ phía dưới.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">justify-content — dọc theo trục chính</span><span class="lz-d">Trái sang phải với row, trên xuống dưới với column. <code>space-between</code> là thanh điều hướng kinh điển: logo bên trái, các liên kết bên phải.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">align-items — cắt ngang nó</span><span class="lz-d">Hướng vuông góc. <code>center</code> ở đây là thứ căn giữa theo chiều dọc một hàng phần tử, đúng cái mà CSS từng bị chê là không làm nổi.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>justify-content: center</code> chẳng căn giữa được gì, vì cái trục không phải cái bạn hình dung.</strong> Hai thuộc tính căn chỉnh đổi nghĩa cho nhau ngay khi bạn đặt <code>flex-direction: column</code>: <code>justify-content</code> giờ làm việc theo chiều dọc còn <code>align-items</code> theo chiều ngang. Nên một thanh bên bạn vừa đổi sang column bỗng lờ đi phép căn giữa bạn viết, và thêm nữa giá trị <code>center</code> chỉ làm tệ hơn. Trước khi động vào hai thuộc tính đó, hãy nói hướng ra thành lời — "đây là column, nên justify là chiều dọc" — hoặc dùng lớp phủ flexbox của DevTools, nó vẽ luôn trục chính lên trang để không còn gì phải đoán.</p></div>
<div class="link-card"><a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank" rel="noopener">CSS-Tricks — Hướng dẫn Flexbox đầy đủ (ai cũng mở sẵn tab này)</a></div>
<div class="link-card"><a href="https://flexboxfroggy.com/" target="_blank" rel="noopener">Flexbox Froggy — 24 màn, học bằng cách chơi</a></div>
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
<pre><code class="language-css">.gallery {
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
<pre><code class="language-css">.cards {
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

<h3>Grid or flexbox — the question that decides</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">One direction?</span><span class="lz-t">Flexbox</span><span class="lz-d">A row of buttons, a navbar, a list of tags that wraps. You care about how items flow along a line.</span></div>
<div class="lz-node"><span class="lz-k">Two directions at once?</span><span class="lz-t">Grid</span><span class="lz-d">A page layout with header, sidebar and content; a photo gallery where rows must line up with each other. You care about the whole plane.</span></div>
<div class="lz-node"><span class="lz-k">Content decides the size?</span><span class="lz-t">Flexbox leans that way</span><span class="lz-d">Items size themselves and the container reacts. Good when you do not know how many items there will be.</span></div>
<div class="lz-node"><span class="lz-k">Layout decides the size?</span><span class="lz-t">Grid leans that way</span><span class="lz-d">You declare the tracks up front and items go into them. Good when the design has a fixed skeleton.</span></div>
</div>
<pre><code class="language-css">.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
/* No media query needed: columns are added and removed automatically
   as the container gets wider or narrower. */</code></pre>
<div class="pitfall"><p><strong>Trap — treating grid and flexbox as rivals and picking one for the whole project.</strong> They are not alternatives; they solve different problems and are designed to nest. The natural answer for most pages is grid for the page skeleton — header, sidebar, main, footer — and flexbox inside each region for the row of buttons or the list of cards. Forcing everything into one produces the tell-tale symptoms: a flexbox layout full of fixed widths trying to make rows line up, or a grid with one column and a lot of <code>grid-row</code> arithmetic doing what <code>flex-direction: column</code> does in one line. Ask the direction question per container, not per project.</p></div>
<div class="link-card"><a href="https://cssgridgarden.com/" target="_blank" rel="noopener">Grid Garden — learn CSS Grid by playing a game</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Grid dàn cả hàng lẫn cột cùng lúc</h2>
<p class="lead">Flexbox xử lý một đường tại một thời điểm. <strong>CSS Grid</strong> xử lý một cấu trúc hai chiều thật sự — bạn định nghĩa các cột và hàng, rồi đặt các mục vào lưới đó. Đây là công cụ cho bố cục trang và các phòng trưng bày thẻ.</p>

<h3>Cột với đơn vị fr</h3>
<pre><code class="language-css">.gallery {
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
<pre><code class="language-css">.cards {
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

<h3>Grid hay flexbox — câu hỏi quyết định</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Một chiều thôi?</span><span class="lz-t">Flexbox</span><span class="lz-d">Một hàng nút, một thanh điều hướng, một danh sách thẻ có xuống dòng. Bạn quan tâm các phần tử chảy dọc theo một đường thế nào.</span></div>
<div class="lz-node"><span class="lz-k">Hai chiều cùng lúc?</span><span class="lz-t">Grid</span><span class="lz-d">Một bố cục trang có đầu trang, thanh bên và nội dung; một thư viện ảnh mà các hàng phải thẳng hàng với nhau. Bạn quan tâm cả mặt phẳng.</span></div>
<div class="lz-node"><span class="lz-k">Nội dung quyết định kích thước?</span><span class="lz-t">Flexbox nghiêng về phía đó</span><span class="lz-d">Phần tử tự định cỡ và vật chứa phản ứng theo. Tốt khi bạn không biết sẽ có bao nhiêu phần tử.</span></div>
<div class="lz-node"><span class="lz-k">Bố cục quyết định kích thước?</span><span class="lz-t">Grid nghiêng về phía đó</span><span class="lz-d">Bạn khai các rãnh từ trước rồi phần tử rơi vào đó. Tốt khi thiết kế có một bộ khung cố định.</span></div>
</div>
<pre><code class="language-css">.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
/* Không cần media query: số cột tự thêm vào và bớt đi
   khi vật chứa rộng ra hay hẹp lại. */</code></pre>
<div class="pitfall"><p><strong>Bẫy — coi grid và flexbox là đối thủ rồi chọn một cái cho cả dự án.</strong> Chúng không phải hai lựa chọn thay nhau; chúng giải hai bài toán khác nhau và được thiết kế để lồng vào nhau. Đáp án tự nhiên cho phần lớn trang là grid cho bộ khung trang — đầu trang, thanh bên, nội dung chính, chân trang — và flexbox bên trong từng vùng cho hàng nút hay danh sách thẻ. Ép mọi thứ vào một cái sẽ sinh ra những triệu chứng dễ nhận: một bố cục flexbox đầy chiều rộng cố định cố làm các hàng thẳng nhau, hoặc một grid một cột với cả đống phép tính <code>grid-row</code> làm đúng việc mà <code>flex-direction: column</code> làm trong một dòng. Hãy hỏi câu hỏi về chiều cho từng vật chứa, đừng hỏi cho cả dự án.</p></div>
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
<pre><code class="language-css">/* base styles: written for the phone (mobile-first) */
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

<h3>Responsive, in the order that matters</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The viewport meta tag, first</span><span class="lz-d">Without <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> a phone pretends to be 980px wide and zooms out. Every media query below it is then measuring the wrong thing.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Write the mobile layout as the default</span><span class="lz-d">One column, full-width, no media query. This is the hardest constraint, so solving it first means everything after is an enhancement.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Add min-width queries as it gets roomier</span><span class="lz-d"><code>@media (min-width: 768px)</code> and up. Each query only adds; nothing has to be undone, which keeps the stylesheet readable.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Break where the design breaks</span><span class="lz-d">Not at device names. Drag the browser window until the layout looks wrong, and put the breakpoint there — the device list changes every year, your content does not.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — testing responsiveness only by resizing the desktop browser.</strong> The narrow window tells you about width and nothing else, so three real differences slip through: a phone's on-screen keyboard covers half the viewport and can hide the very button the form needs; there is no hover, so a menu that opens on hover is unreachable; and a fingertip is about 44px wide, so links spaced 8px apart are a lottery. Desktop DevTools' device mode fixes the first two-thirds of this. Actually opening the page on a phone — on your local network, at least once before shipping — is what catches the rest.</p></div>
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
<pre><code class="language-css">/* kiểu nền: viết cho điện thoại (mobile-first) */
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

<h3>Responsive, theo đúng thứ tự quan trọng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Thẻ meta viewport, trước đã</span><span class="lz-d">Không có <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> thì điện thoại giả vờ rộng 980px rồi thu nhỏ lại. Mọi media query phía dưới khi đó đang đo nhầm thứ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Viết bố cục điện thoại làm mặc định</span><span class="lz-d">Một cột, tràn hết chiều rộng, không media query nào. Đây là ràng buộc khó nhất, nên giải nó trước nghĩa là mọi thứ sau đó chỉ là thêm thắt.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thêm query min-width khi màn rộng ra</span><span class="lz-d"><code>@media (min-width: 768px)</code> trở lên. Mỗi query chỉ thêm vào; chẳng phải gỡ bỏ gì, và điều đó giữ cho bảng kiểu đọc được.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Ngắt ở chỗ thiết kế vỡ</span><span class="lz-d">Chứ không phải ở tên thiết bị. Hãy kéo cửa sổ trình duyệt cho tới khi bố cục trông sai, rồi đặt điểm ngắt ở đó — danh sách thiết bị mỗi năm mỗi khác, nội dung của bạn thì không.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — chỉ kiểm responsive bằng cách kéo hẹp cửa sổ trình duyệt trên máy tính.</strong> Cửa sổ hẹp chỉ nói cho bạn về chiều rộng chứ không nói gì khác, nên có ba khác biệt thật lọt qua: bàn phím ảo của điện thoại che mất nửa khung nhìn và có thể giấu đúng cái nút mà form cần; không có trạng thái rê chuột, nên một menu mở khi rê chuột là không với tới được; và một đầu ngón tay rộng chừng 44px, nên các liên kết cách nhau 8px là một trò may rủi. Chế độ thiết bị trong DevTools trên máy tính giải quyết được hai phần ba đầu. Còn thật sự mở trang trên một cái điện thoại — trong mạng nội bộ, ít nhất một lần trước khi ship — mới là thứ bắt được phần còn lại.</p></div>
<div class="link-card"><a href="https://web.dev/learn/design" target="_blank" rel="noopener">web.dev — Học Thiết kế Responsive</a></div>
</div>
`,
    },

    /* ─────────────────── 3.5b wireframe (thêm 17/10/2026) ─────────────────── */
    // Bài chen giữa 3.5 và quiz 3.6 — số "3.5b" để KHÔNG đổi tiêu đề/slug các bài đã có (syncOrder giữ đúng thứ tự file).
    // Ảnh mẫu: images/academy/WIREFRAME/v1/nha-tro-sv/001.webp (dùng chung với PRJ301 ASM.2b), đẩy bằng
    // scripts/upload-academy-slides.mjs --prefix WIREFRAME/v1 — dựng lại thì sang v2, đừng ghi đè (cache Cloudflare).
    {
      title: '3.5b — Wireframes for developers: draw the page before you code it|||3.5b — Wireframe cho lập trình viên: vẽ trang trước khi code',
      slug: 'wf-3-5b-wireframes',
      type: 'DOCUMENT',
      description: 'Wireframe là bản vẽ mặt bằng của một trang: hộp, nút, bấm đi đâu, ai được mở. Phân biệt low-fi/hi-fi/mockup/prototype, quy ước vẽ, ví dụ trang chủ "Nhà trọ sinh viên", cách đổi từng hộp thành HTML/CSS, công cụ (giấy, draw.io, Figma), dùng AI có trách nhiệm và bài thực hành tự kiểm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5b · added</span>
<h2>Draw the page before you code it</h2>
<p class="lead">You now know enough HTML and CSS to build a real page. The fastest way to build the <em>wrong</em> page is to open the editor first. A <strong>wireframe</strong> is a ten-minute drawing that decides what goes where, what every click does and who may see the page — before a single tag is written.</p>

<h3>What a wireframe is</h3>
<p>Think of a house. Nobody pours concrete first and decides where the kitchen goes later; an architect draws a <strong>floor plan</strong>: rooms as rectangles, doors as gaps, labels on everything. No paint colours, no furniture brands. The plan exists so that everyone — owner, builder, electrician — agrees on the layout while changing it still costs an eraser.</p>
<p>A wireframe is the floor plan of one page. It shows four things:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Boxes</span><span class="v">Which blocks exist and where they sit: header, filter panel, list of cards, pagination, footer.</span></div>
  <div class="kv"><span class="k">Controls</span><span class="v">Every button, link, input and dropdown — with the real words written on it.</span></div>
  <div class="kv"><span class="k">Where clicks go</span><span class="v">Each clickable spot gets a number, and a note says which URL it opens or what it does.</span></div>
  <div class="kv"><span class="k">Who may open it</span><span class="v">The page URL and the roles allowed: everyone, logged-in users only, admin only.</span></div>
</div>
<p>It deliberately leaves out colours, fonts, real photos and exact pixel sizes. Those come later, and arguing about them too early is how teams waste a week.</p>

<h3>Five words people mix up</h3>
<table>
<thead><tr><th>Stage</th><th>What it looks like</th><th>The question it answers</th><th>Typical tool · time</th></tr></thead>
<tbody>
<tr><td><strong>Sketch</strong></td><td>Pen on paper, rough boxes</td><td>"Roughly what is on this page?"</td><td>Paper · 2–5 min</td></tr>
<tr><td><strong>Low-fidelity wireframe</strong></td><td>Grey boxes, real labels, numbered clicks</td><td>"What goes where, and where does each click go?"</td><td>draw.io, Figma, paper · 10–30 min</td></tr>
<tr><td><strong>High-fidelity wireframe</strong></td><td>Real spacing and text sizes, still mostly grey</td><td>"Does the content actually fit?"</td><td>Figma · 1–2 h</td></tr>
<tr><td><strong>Mockup</strong></td><td>Final colours, fonts, icons, images — a static picture</td><td>"What will it look like?"</td><td>Figma · hours</td></tr>
<tr><td><strong>Prototype</strong></td><td>Mockups (or wireframes) linked so you can click through</td><td>"Does the flow feel right to a user?"</td><td>Figma prototype mode · hours</td></tr>
<tr><td><strong>Final UI</strong></td><td>Real HTML/CSS/JS with real data</td><td>"Does it work?"</td><td>Your code · days</td></tr>
</tbody>
</table>
<p>As a developer, the low-fidelity wireframe is the one you will draw most. It is cheap enough to throw away and precise enough to code from.</p>

<h3>Why a developer should bother</h3>
<ul>
<li><strong>The team agrees before anyone codes.</strong> "Is the filter on the left or on top?" takes one minute at a whiteboard and an afternoon of rewritten CSS after the fact. With a wireframe, three people build three pages that look like one site.</li>
<li><strong>Fewer rewrites.</strong> Drawing forces questions you would otherwise discover halfway through coding: what is shown when nothing matches the filter? Where does "Back" go? Does a guest see the "Book" button?</li>
<li><strong>It becomes a document.</strong> University project reports ask for screen designs: at FPTU the SWP391 and SEP490 reports include screen layouts and flows, and SWR302 asks for mockups of the requirements. A clean wireframe is that section, already done.</li>
<li><strong>Real jobs often have no designer.</strong> In small companies, freelance work and internal tools, the developer is the designer. A client who sees a wireframe on day one will tell you what is wrong while it is still free to fix.</li>
<li><strong>It reveals the data you need.</strong> Every box on screen shows data from somewhere. "Area: 20 m²" on a card means a field called something like <code>area</code> must exist in the database or the API.</li>
</ul>

<h3>Conventions that make a wireframe readable</h3>
<p>These are habits most teams share, not laws. Adapt them, but agree on them inside your team.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Grey by default</span><span class="lz-d">Black, white and greys. Use colour only when it carries meaning: the one primary action of the page, or a status (available / rented). If everything is coloured, nothing stands out.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A crossed box means an image</span><span class="lz-d">A rectangle with an X through it is the universal sign for "a picture goes here". No need to find real photos yet.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Real words, not "Button"</span><span class="lz-d">Write "View details", "Filter", "Log in". Real labels expose unclear wording early and become the text you will type into the HTML.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Number every clickable spot</span><span class="lz-d">Put a number on it and write the target beside the drawing: "② Filter ⇒ GET /rooms?typeId=…". Unnumbered clicks are the ones nobody implements.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Write the URL and who may open it</span><span class="lz-d">At the top: the page's address and the roles allowed. This line later becomes your route and your access check.</span></div>
</div>
<p>Two more that save arguments: draw the <strong>empty state</strong> (no results, no data yet) and sketch the <strong>phone version</strong> — usually one column — next to the desktop one.</p>

<h3>Worked example: the home page of "Nhà trọ sinh viên"</h3>
<p>A student team building a room-rental site (<em>Nhà trọ sinh viên</em> — student lodging) drew this before writing any code. It is the home page: a list of available rooms with a filter and pagination. Read it slowly — every convention above is in it.</p>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/WIREFRAME/v1/nha-tro-sv/001.webp" alt="Low-fidelity wireframe of the student-lodging home page: navbar, filter panel on the left, a 3 by 2 grid of room cards with crossed image boxes, pagination, footer, and seven numbered notes on the right" loading="lazy" width="1600" height="1150" /><p class="chu-thich">🖼️ Wireframe, home page of a student-lodging site: grey boxes, crossed images, real labels, seven numbered clicks with their targets, URL and access written at the top.</p></div>
<p>What each part tells the developer:</p>
<ul>
<li><strong>The header line</strong> — URL <code>/rooms?typeId=&amp;minPrice=&amp;maxPrice=&amp;floor=&amp;page=</code>, open to everyone, even guests. You already know the route, its query parameters and that it needs no login.</li>
<li><strong>① Navbar</strong> — shared by every page; after login the two buttons are replaced by the user's name and "Log out". One drawing, two states.</li>
<li><strong>② Filter</strong> — a form sent with GET to the same URL, keeping the values the user typed. GET because filtering only <em>reads</em>: the URL can be bookmarked, shared and reloaded (lessons 2.4 and 6.5).</li>
<li><strong>③ Cards</strong> — one card per room that is active and not already rented. That is a business rule hiding in a drawing; it becomes a condition in the database query.</li>
<li><strong>④ "View details"</strong> — goes to <code>/rooms/detail?id=3</code>, the next page to wireframe.</li>
<li><strong>⑤ Pagination</strong> — six rooms per page, <code>?page=2</code>, and the filter values must survive the page change.</li>
<li><strong>⑥ Empty state</strong> — "No matching rooms" plus a "Clear filters" link. Without this note, someone would ship a blank page.</li>
<li><strong>⑦ Log in / Sign up</strong> — <code>/login</code> and <code>/register</code>.</li>
</ul>
<p>Only the "Filter" button and the current page number are shaded darker: those are the only places where emphasis means something.</p>

<h3>From wireframe to HTML and CSS</h3>
<p>A good wireframe translates almost box by box. A useful rule from the numbers: <strong>a note that says "⇒ some URL" is a link (<code>&lt;a&gt;</code>); a note that sends data or changes something is a button inside a form.</strong></p>
<table>
<thead><tr><th>Wireframe box</th><th>HTML</th><th>CSS (Chapter 3)</th></tr></thead>
<tbody>
<tr><td>① Top bar</td><td><code>&lt;header&gt;</code> + <code>&lt;nav&gt;</code> with <code>&lt;a&gt;</code> links</td><td>Flexbox, <code>justify-content: space-between</code></td></tr>
<tr><td>Title + "14 rooms found"</td><td><code>&lt;h1&gt;</code> + <code>&lt;p&gt;</code></td><td>—</td></tr>
<tr><td>② Filter panel</td><td><code>&lt;aside&gt;</code> &gt; <code>&lt;form method="get" action="/rooms"&gt;</code>, <code>&lt;label&gt;</code> + <code>&lt;select&gt;</code>/<code>&lt;input&gt;</code></td><td>Left column of a grid</td></tr>
<tr><td>③ Card grid</td><td><code>&lt;section&gt;</code> holding six <code>&lt;article class="card"&gt;</code></td><td>Grid: 1 column on phones, 2 on tablets, 3 on desktop</td></tr>
<tr><td>Crossed box</td><td><code>&lt;img alt="…"&gt;</code></td><td><code>max-width: 100%</code></td></tr>
<tr><td>④ View details</td><td><code>&lt;a href="/rooms/detail?id=1"&gt;</code> styled as a button</td><td>A class like <code>.btn</code></td></tr>
<tr><td>⑤ Pagination</td><td><code>&lt;nav aria-label="Pages"&gt;</code> with links <code>?page=2</code></td><td>Flexbox, centred</td></tr>
<tr><td>⑥ Empty state</td><td><code>&lt;p&gt;</code> + a "Clear filters" link, shown instead of the grid</td><td>—</td></tr>
<tr><td>Footer</td><td><code>&lt;footer&gt;</code></td><td>—</td></tr>
</tbody>
</table>
<p>The skeleton below is the wireframe turned into semantic HTML. The visible text stays in Vietnamese because the site is Vietnamese:</p>
<pre><code class="language-html">&lt;header class="topbar"&gt;
  &lt;a class="logo" href="/"&gt;Nhà Trọ SV&lt;/a&gt;
  &lt;nav class="menu"&gt;
    &lt;a href="/rooms"&gt;Phòng trống&lt;/a&gt;
    &lt;a href="/about"&gt;Giới thiệu&lt;/a&gt;
  &lt;/nav&gt;
  &lt;div class="auth"&gt;
    &lt;a href="/login"&gt;Đăng nhập&lt;/a&gt;                     &lt;!-- ⑦ --&gt;
    &lt;a class="btn" href="/register"&gt;Đăng ký&lt;/a&gt;
  &lt;/div&gt;
&lt;/header&gt;

&lt;main class="page"&gt;
  &lt;h1&gt;Phòng còn trống&lt;/h1&gt;
  &lt;p class="muted"&gt;Tìm thấy 14 phòng&lt;/p&gt;

  &lt;div class="layout"&gt;
    &lt;aside class="filter"&gt;                              &lt;!-- ② --&gt;
      &lt;form method="get" action="/rooms"&gt;
        &lt;label for="typeId"&gt;Loại phòng&lt;/label&gt;
        &lt;select id="typeId" name="typeId"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Phòng đơn&lt;/option&gt;
          &lt;option value="2"&gt;Phòng đôi&lt;/option&gt;
        &lt;/select&gt;
        &lt;label for="minPrice"&gt;Giá từ (đ)&lt;/label&gt;
        &lt;input id="minPrice" name="minPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="maxPrice"&gt;đến&lt;/label&gt;
        &lt;input id="maxPrice" name="maxPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="floor"&gt;Tầng&lt;/label&gt;
        &lt;select id="floor" name="floor"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Tầng 1&lt;/option&gt;
          &lt;option value="2"&gt;Tầng 2&lt;/option&gt;
        &lt;/select&gt;
        &lt;button class="btn btn-primary" type="submit"&gt;Lọc&lt;/button&gt;
        &lt;a href="/rooms"&gt;Xoá bộ lọc&lt;/a&gt;
      &lt;/form&gt;
    &lt;/aside&gt;

    &lt;section class="cards" aria-label="Danh sách phòng"&gt;  &lt;!-- ③ --&gt;
      &lt;article class="card"&gt;
        &lt;img src="/img/p101.jpg" alt="Phòng P101" width="400" height="250"&gt;
        &lt;div class="card-head"&gt;
          &lt;h2&gt;P101&lt;/h2&gt;
          &lt;span class="badge badge-free"&gt;Còn trống&lt;/span&gt;
        &lt;/div&gt;
        &lt;p&gt;Loại: Phòng đôi · Tầng 1&lt;/p&gt;
        &lt;p&gt;Diện tích: 20 m²&lt;/p&gt;
        &lt;p class="price"&gt;2.500.000 đ / tháng&lt;/p&gt;
        &lt;a class="btn" href="/rooms/detail?id=1"&gt;Xem chi tiết&lt;/a&gt;   &lt;!-- ④ --&gt;
      &lt;/article&gt;
      &lt;!-- five more cards with the same shape --&gt;
    &lt;/section&gt;
  &lt;/div&gt;

  &lt;nav class="pager" aria-label="Phân trang"&gt;           &lt;!-- ⑤ --&gt;
    &lt;a href="/rooms?page=1" aria-current="page"&gt;1&lt;/a&gt;
    &lt;a href="/rooms?page=2"&gt;2&lt;/a&gt;
    &lt;a href="/rooms?page=3"&gt;3&lt;/a&gt;
  &lt;/nav&gt;
&lt;/main&gt;

&lt;footer class="site-footer"&gt;© 2026 Nhà Trọ SV&lt;/footer&gt;</code></pre>
<p>And the layout, mobile-first as in lesson 3.5 — the wireframe's "filter left, three cards per row" is the desktop rule; the phone gets one column:</p>
<pre><code class="language-css">.topbar { display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: 16px; padding: 12px 24px; }
.menu   { display: flex; gap: 24px; }
.layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
.cards  { display: grid; grid-template-columns: 1fr; gap: 16px; }
.card img { max-width: 100%; height: auto; }
.pager  { display: flex; justify-content: center; gap: 8px; margin: 24px 0; }

/* colour only where it means something: the primary action and the status */
.btn-primary { background: #2563eb; color: #fff; }
.badge-free  { border: 1px solid #16a34a; color: #16a34a; }

@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .layout { grid-template-columns: 260px 1fr; }   /* filter left, cards right */
  .cards  { grid-template-columns: repeat(3, 1fr); }
}</code></pre>
<div class="pitfall"><p><strong>Trap — pagination that forgets the filter.</strong> The static links above say <code>?page=2</code>. On a real site, page 2 of "double rooms under 3 million" must be <code>/rooms?typeId=2&amp;maxPrice=3000000&amp;page=2</code>, otherwise clicking "2" silently drops the filter. Note ⑤ in the wireframe says exactly this, which is why the server (Node.js course) or JavaScript (Chapter 4) has to build those links from the current URL — plain HTML cannot.</p></div>

<h3>Tools</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Paper</span><span class="v">The fastest. Draw three versions in ten minutes, photograph the winner, post it in the team chat. Perfect for the first idea.</span></div>
  <div class="kv"><span class="k">draw.io (diagrams.net)</span><span class="v">Free, in the browser or as a desktop app. Has a "Mockups" shape library (buttons, inputs, browser window). Saves a .drawio file you can commit next to the code, so the drawing has a history like the code.</span></div>
  <div class="kv"><span class="k">Figma</span><span class="v">Free starter plan, plus an education plan for verified students. Several people can edit at once, and the same file can grow from wireframe to mockup to clickable prototype.</span></div>
  <div class="kv"><span class="k">Others</span><span class="v">Excalidraw (hand-drawn look, free), Penpot (open-source Figma alternative). Pick one tool per team and stick to it.</span></div>
</div>

<h3>Using AI to turn a wireframe into code — responsibly</h3>
<p>Modern AI assistants can read an image of a wireframe and produce HTML/CSS in seconds. That is genuinely useful — and genuinely risky if you skip the thinking. The rule: <strong>you design, the AI types, you verify and can explain every line.</strong></p>
<ol>
<li>Draw the wireframe yourself. The decisions (what is on the page, where clicks go, who may see it) are the part that is your work.</li>
<li>Give the AI the image <em>and</em> your constraints: plain HTML and CSS, semantic tags, mobile-first, no framework, the field names you actually have.</li>
<li>Ask for a skeleton, not a finished site. Smaller output is easier to check.</li>
<li>Check it against the numbered notes: every number must exist in the code with the right target. Anything in the code that is not in the wireframe gets questioned or deleted.</li>
<li>Open it at 375 px and at 1280 px wide. Read it line by line. If you cannot explain a line, you do not own it yet.</li>
</ol>
<pre><code class="language-plaintext">Here is a wireframe of one page (image attached).
Build ONLY the HTML skeleton + one CSS file:
- semantic tags (header, nav, main, aside, section, article, footer)
- mobile-first: one column by default, filter left + 3 cards per row from 1024px
- the filter is a GET form to /rooms with fields typeId, minPrice, maxPrice, floor
- no framework, no JavaScript, no inline style
- keep the Vietnamese labels exactly as written in the wireframe
Mark each numbered element from the wireframe with an HTML comment (1)…(7).</code></pre>
<div class="pitfall"><p><strong>Trap — accepting what the AI adds.</strong> Typical extras: a search box nobody drew, a rating field the database does not have, an inline <code>style=""</code> on every element, a div where a button belongs, a link to a URL that does not exist. Each one looks harmless and each one is a bug, a lie in your report, or a question you cannot answer when a teacher or a colleague asks "why is this here?".</p></div>

<h3>🧪 Practice</h3>
<p>Wireframe <strong>two pages</strong> of a small app, a "Recipe notebook":</p>
<ol>
<li><strong>Recipe list</strong> — search by name, filter by category (breakfast, main, dessert), recipe cards (photo, cooking time, difficulty), pagination. Everyone may open it.</li>
<li><strong>Recipe detail</strong> — photo, ingredients, numbered steps, and a "Save to favourites" button that only logged-in users see.</li>
</ol>
<p>Use paper or draw.io, 20–30 minutes in total. Then build page 1 in HTML and CSS using the mapping table above.</p>
<p><strong>Check yourself before calling it done:</strong></p>
<ul>
<li>☐ The URL and who may open it are written at the top of each page.</li>
<li>☐ Every clickable spot has a number and a target (URL, or what it does).</li>
<li>☐ Buttons and headings carry real words, not "Button" or "Title".</li>
<li>☐ Grey only; colour appears only for the primary action or a status.</li>
<li>☐ Images are crossed boxes.</li>
<li>☐ The empty state is drawn ("No recipes match").</li>
<li>☐ A phone version (one column) is sketched next to the desktop one.</li>
<li>☐ For every box you can say where its data comes from.</li>
<li>☐ A classmate can explain the page from your drawing without you talking.</li>
</ul>

<h3>Going further</h3>
<p>This lesson is the developer's minimum. The UX/UI for Developers course goes deeper — sketching techniques, low- and high-fidelity wireframes, Figma, prototypes and testing them with users — in Chapter 4. Note: that course is still an outline; its lessons are being written.</p>
<div class="link-card"><a href="/courses/ux-ui-for-developers/learn?lessonSlug=uxui-4-1-phac-thao">UX/UI for Developers — 4.1 Sketching and low-fidelity wireframes (outline)</a></div>
<div class="link-card"><a href="https://www.drawio.com/" target="_blank" rel="noopener">draw.io — free diagram and wireframe editor</a></div>
<div class="link-card"><a href="https://www.figma.com/education/" target="_blank" rel="noopener">Figma for Education — free plan for students</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5b · bài bổ sung</span>
<h2>Vẽ trang trước khi code</h2>
<p class="lead">Tới đây bạn đã biết đủ HTML và CSS để dựng một trang thật. Cách nhanh nhất để dựng <em>sai</em> trang là mở editor ra trước. <strong>Wireframe</strong> (bản phác khung giao diện) là một hình vẽ mười phút quyết định cái gì nằm ở đâu, mỗi cú bấm làm gì và ai được xem trang — trước khi gõ một thẻ nào.</p>

<h3>Wireframe là gì</h3>
<p>Hãy nghĩ tới một ngôi nhà. Không ai đổ bê tông trước rồi mới tính bếp đặt đâu; kiến trúc sư vẽ <strong>bản vẽ mặt bằng</strong>: phòng là hình chữ nhật, cửa là khoảng hở, chỗ nào cũng có nhãn. Không màu sơn, không hiệu nội thất. Bản vẽ có để mọi người — chủ nhà, thợ xây, thợ điện — thống nhất bố cục khi việc sửa vẫn chỉ tốn một cục tẩy.</p>
<p>Wireframe là bản vẽ mặt bằng của một trang. Nó cho thấy bốn thứ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Hộp</span><span class="v">Có những khối nào và nằm ở đâu: thanh trên cùng, khung bộ lọc, danh sách thẻ, phân trang, chân trang.</span></div>
  <div class="kv"><span class="k">Điều khiển</span><span class="v">Mọi nút, liên kết, ô nhập và ô chọn — ghi đúng chữ thật sẽ hiện trên đó.</span></div>
  <div class="kv"><span class="k">Bấm đi đâu</span><span class="v">Mỗi chỗ bấm được đánh một số, và một ghi chú nói nó mở URL nào hoặc làm việc gì.</span></div>
  <div class="kv"><span class="k">Ai được mở</span><span class="v">URL của trang và các vai trò được vào: mọi người, chỉ người đã đăng nhập, chỉ admin.</span></div>
</div>
<p>Nó cố ý bỏ qua màu sắc, phông chữ, ảnh thật và kích thước pixel chính xác. Mấy thứ đó tính sau, và cãi nhau về chúng quá sớm là cách một nhóm mất toi một tuần.</p>

<h3>Năm từ hay bị lẫn</h3>
<table>
<thead><tr><th>Giai đoạn</th><th>Trông như thế nào</th><th>Trả lời câu hỏi gì</th><th>Công cụ · thời gian</th></tr></thead>
<tbody>
<tr><td><strong>Phác thảo (sketch)</strong></td><td>Bút trên giấy, hộp nguệch ngoạc</td><td>"Đại khái trang này có gì?"</td><td>Giấy · 2–5 phút</td></tr>
<tr><td><strong>Wireframe độ trung thực thấp (low-fidelity)</strong></td><td>Hộp xám, chữ thật, chỗ bấm có đánh số</td><td>"Cái gì ở đâu, bấm vào thì đi đâu?"</td><td>draw.io, Figma, giấy · 10–30 phút</td></tr>
<tr><td><strong>Wireframe độ trung thực cao (high-fidelity)</strong></td><td>Khoảng cách và cỡ chữ thật, vẫn chủ yếu là xám</td><td>"Nội dung có vừa thật không?"</td><td>Figma · 1–2 giờ</td></tr>
<tr><td><strong>Mockup</strong></td><td>Màu, phông, icon, ảnh đúng bản cuối — một bức ảnh tĩnh</td><td>"Trông nó sẽ ra sao?"</td><td>Figma · vài giờ</td></tr>
<tr><td><strong>Prototype (bản mẫu bấm được)</strong></td><td>Các mockup (hoặc wireframe) nối với nhau để bấm thử</td><td>"Người dùng đi qua luồng có thuận không?"</td><td>Chế độ prototype của Figma · vài giờ</td></tr>
<tr><td><strong>Giao diện thật (final UI)</strong></td><td>HTML/CSS/JS thật, dữ liệu thật</td><td>"Nó có chạy không?"</td><td>Code của bạn · nhiều ngày</td></tr>
</tbody>
</table>
<p>Là lập trình viên, bạn sẽ vẽ wireframe low-fidelity nhiều nhất. Nó đủ rẻ để vứt đi và đủ chính xác để code theo.</p>

<h3>Vì sao lập trình viên nên vẽ</h3>
<ul>
<li><strong>Cả nhóm thống nhất trước khi code.</strong> "Bộ lọc nằm bên trái hay ở trên?" mất một phút trước bảng trắng, nhưng mất cả buổi chiều viết lại CSS nếu để sau. Có wireframe thì ba người làm ba trang vẫn ra một website.</li>
<li><strong>Ít phải làm lại.</strong> Vẽ buộc bạn trả lời những câu mà nếu không thì nửa chừng code mới lòi ra: lọc không ra kết quả thì hiện gì? Nút "Quay lại" về đâu? Khách chưa đăng nhập có thấy nút "Đặt phòng" không?</li>
<li><strong>Nó thành tài liệu.</strong> Báo cáo đồ án ở trường đòi phần thiết kế màn hình: ở FPTU, báo cáo SWP391 và SEP490 có bố cục và luồng màn hình, còn SWR302 yêu cầu mockup cho các yêu cầu. Một wireframe gọn gàng chính là phần đó, làm sẵn rồi.</li>
<li><strong>Đi làm thật thường không có designer.</strong> Ở công ty nhỏ, việc freelance hay công cụ nội bộ, lập trình viên kiêm luôn thiết kế. Khách hàng xem wireframe ngay ngày đầu sẽ chỉ ra chỗ sai khi sửa vẫn còn miễn phí.</li>
<li><strong>Nó lộ ra dữ liệu bạn cần.</strong> Mỗi hộp trên màn hình hiện dữ liệu lấy từ đâu đó. "Diện tích: 20 m²" trên thẻ nghĩa là phải có một trường kiểu <code>area</code> trong cơ sở dữ liệu hoặc API.</li>
</ul>

<h3>Quy ước giúp wireframe dễ đọc</h3>
<p>Đây là thói quen đa số nhóm dùng chung, không phải luật. Cứ điều chỉnh, nhưng trong nhóm phải thống nhất với nhau.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mặc định là xám</span><span class="lz-d">Đen, trắng và các sắc xám. Chỉ dùng màu khi màu mang nghĩa: hành động chính duy nhất của trang, hoặc trạng thái (còn trống / đã thuê). Cái gì cũng có màu thì chẳng cái gì nổi bật.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hộp gạch chéo là ảnh</span><span class="lz-d">Hình chữ nhật có dấu X là ký hiệu chung của "chỗ này đặt ảnh". Chưa cần đi tìm ảnh thật.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chữ thật, không phải "Button"</span><span class="lz-d">Ghi "Xem chi tiết", "Lọc", "Đăng nhập". Chữ thật làm lộ sớm những nhãn khó hiểu, và chính là chữ bạn sẽ gõ vào HTML.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đánh số mọi chỗ bấm được</span><span class="lz-d">Gắn số lên nó và ghi đích đến bên cạnh hình: "② Lọc ⇒ GET /rooms?typeId=…". Chỗ bấm không đánh số là chỗ không ai làm.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ghi URL và ai được mở</span><span class="lz-d">Ở trên cùng: địa chỉ của trang và các vai trò được vào. Dòng này về sau thành route và phép kiểm quyền của bạn.</span></div>
</div>
<p>Thêm hai thói quen bớt cãi nhau: vẽ <strong>trạng thái rỗng</strong> (không có kết quả, chưa có dữ liệu) và phác <strong>bản điện thoại</strong> — thường là một cột — đặt cạnh bản máy tính.</p>

<h3>Ví dụ: trang chủ "Nhà trọ sinh viên"</h3>
<p>Một nhóm sinh viên làm web cho thuê phòng trọ đã vẽ hình này trước khi viết dòng code nào. Đây là trang chủ: danh sách phòng còn trống, có bộ lọc và phân trang. Đọc chậm — mọi quy ước ở trên đều có trong đó.</p>
<div class="anh-slide"><img src="https://media.cuongthai.com/images/academy/WIREFRAME/v1/nha-tro-sv/001.webp" alt="Wireframe độ trung thực thấp trang chủ Nhà trọ sinh viên: thanh điều hướng, bộ lọc bên trái, lưới 3 x 2 thẻ phòng với ô ảnh gạch chéo, phân trang, chân trang và bảy ghi chú đánh số bên phải" loading="lazy" width="1600" height="1150" /><p class="chu-thich">🖼️ Wireframe trang chủ web Nhà trọ sinh viên: hộp xám, ảnh gạch chéo, chữ thật, bảy chỗ bấm đánh số kèm đích đến, URL và quyền truy cập ghi ở trên cùng.</p></div>
<p>Mỗi phần nói gì với người code:</p>
<ul>
<li><strong>Dòng đầu</strong> — URL <code>/rooms?typeId=&amp;minPrice=&amp;maxPrice=&amp;floor=&amp;page=</code>, ai cũng vào được, kể cả khách chưa đăng nhập. Bạn đã biết route, các tham số query và việc nó không cần đăng nhập.</li>
<li><strong>① Thanh điều hướng</strong> — dùng chung cho mọi trang; đăng nhập rồi thì hai nút được thay bằng tên người dùng và "Đăng xuất". Một hình vẽ, hai trạng thái.</li>
<li><strong>② Bộ lọc</strong> — một form gửi bằng GET về chính URL đó, giữ nguyên giá trị người dùng đã nhập. Dùng GET vì lọc chỉ <em>đọc</em>: URL lưu dấu trang được, gửi cho bạn được, tải lại được (bài 2.4 và 6.5).</li>
<li><strong>③ Thẻ phòng</strong> — mỗi thẻ là một phòng đang hoạt động và chưa có người thuê. Đó là một luật nghiệp vụ nấp trong hình vẽ; nó sẽ thành một điều kiện trong câu truy vấn cơ sở dữ liệu.</li>
<li><strong>④ "Xem chi tiết"</strong> — đi tới <code>/rooms/detail?id=3</code>, cũng chính là trang tiếp theo cần vẽ.</li>
<li><strong>⑤ Phân trang</strong> — sáu phòng mỗi trang, <code>?page=2</code>, và giá trị bộ lọc phải còn nguyên khi chuyển trang.</li>
<li><strong>⑥ Trạng thái rỗng</strong> — "Không tìm thấy phòng phù hợp" kèm liên kết "Xoá bộ lọc". Không có ghi chú này, sẽ có người giao một trang trắng trơn.</li>
<li><strong>⑦ Đăng nhập / Đăng ký</strong> — <code>/login</code> và <code>/register</code>.</li>
</ul>
<p>Chỉ nút "Lọc" và số trang hiện tại được tô đậm hơn: đó là hai chỗ duy nhất mà sự nhấn mạnh có ý nghĩa.</p>

<h3>Từ wireframe sang HTML và CSS</h3>
<p>Một wireframe tốt dịch ra gần như từng hộp một. Một quy tắc hữu ích rút từ các con số: <strong>ghi chú nói "⇒ một URL" là liên kết (<code>&lt;a&gt;</code>); ghi chú gửi dữ liệu hoặc làm thay đổi gì đó là nút nằm trong form.</strong></p>
<table>
<thead><tr><th>Hộp trên wireframe</th><th>HTML</th><th>CSS (Chương 3)</th></tr></thead>
<tbody>
<tr><td>① Thanh trên cùng</td><td><code>&lt;header&gt;</code> + <code>&lt;nav&gt;</code> chứa các <code>&lt;a&gt;</code></td><td>Flexbox, <code>justify-content: space-between</code></td></tr>
<tr><td>Tiêu đề + "Tìm thấy 14 phòng"</td><td><code>&lt;h1&gt;</code> + <code>&lt;p&gt;</code></td><td>—</td></tr>
<tr><td>② Khung bộ lọc</td><td><code>&lt;aside&gt;</code> &gt; <code>&lt;form method="get" action="/rooms"&gt;</code>, <code>&lt;label&gt;</code> + <code>&lt;select&gt;</code>/<code>&lt;input&gt;</code></td><td>Cột trái của một lưới grid</td></tr>
<tr><td>③ Lưới thẻ</td><td><code>&lt;section&gt;</code> chứa sáu <code>&lt;article class="card"&gt;</code></td><td>Grid: điện thoại 1 cột, tablet 2, máy tính 3</td></tr>
<tr><td>Hộp gạch chéo</td><td><code>&lt;img alt="…"&gt;</code></td><td><code>max-width: 100%</code></td></tr>
<tr><td>④ Xem chi tiết</td><td><code>&lt;a href="/rooms/detail?id=1"&gt;</code> trang trí như nút</td><td>Một class kiểu <code>.btn</code></td></tr>
<tr><td>⑤ Phân trang</td><td><code>&lt;nav aria-label="Phân trang"&gt;</code> chứa liên kết <code>?page=2</code></td><td>Flexbox, căn giữa</td></tr>
<tr><td>⑥ Trạng thái rỗng</td><td><code>&lt;p&gt;</code> + liên kết "Xoá bộ lọc", hiện thay cho lưới</td><td>—</td></tr>
<tr><td>Chân trang</td><td><code>&lt;footer&gt;</code></td><td>—</td></tr>
</tbody>
</table>
<p>Bộ khung dưới đây là wireframe đổi thành HTML ngữ nghĩa:</p>
<pre><code class="language-html">&lt;header class="topbar"&gt;
  &lt;a class="logo" href="/"&gt;Nhà Trọ SV&lt;/a&gt;
  &lt;nav class="menu"&gt;
    &lt;a href="/rooms"&gt;Phòng trống&lt;/a&gt;
    &lt;a href="/about"&gt;Giới thiệu&lt;/a&gt;
  &lt;/nav&gt;
  &lt;div class="auth"&gt;
    &lt;a href="/login"&gt;Đăng nhập&lt;/a&gt;                     &lt;!-- ⑦ --&gt;
    &lt;a class="btn" href="/register"&gt;Đăng ký&lt;/a&gt;
  &lt;/div&gt;
&lt;/header&gt;

&lt;main class="page"&gt;
  &lt;h1&gt;Phòng còn trống&lt;/h1&gt;
  &lt;p class="muted"&gt;Tìm thấy 14 phòng&lt;/p&gt;

  &lt;div class="layout"&gt;
    &lt;aside class="filter"&gt;                              &lt;!-- ② --&gt;
      &lt;form method="get" action="/rooms"&gt;
        &lt;label for="typeId"&gt;Loại phòng&lt;/label&gt;
        &lt;select id="typeId" name="typeId"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Phòng đơn&lt;/option&gt;
          &lt;option value="2"&gt;Phòng đôi&lt;/option&gt;
        &lt;/select&gt;
        &lt;label for="minPrice"&gt;Giá từ (đ)&lt;/label&gt;
        &lt;input id="minPrice" name="minPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="maxPrice"&gt;đến&lt;/label&gt;
        &lt;input id="maxPrice" name="maxPrice" type="number" min="0" step="100000"&gt;
        &lt;label for="floor"&gt;Tầng&lt;/label&gt;
        &lt;select id="floor" name="floor"&gt;
          &lt;option value=""&gt;— Tất cả —&lt;/option&gt;
          &lt;option value="1"&gt;Tầng 1&lt;/option&gt;
          &lt;option value="2"&gt;Tầng 2&lt;/option&gt;
        &lt;/select&gt;
        &lt;button class="btn btn-primary" type="submit"&gt;Lọc&lt;/button&gt;
        &lt;a href="/rooms"&gt;Xoá bộ lọc&lt;/a&gt;
      &lt;/form&gt;
    &lt;/aside&gt;

    &lt;section class="cards" aria-label="Danh sách phòng"&gt;  &lt;!-- ③ --&gt;
      &lt;article class="card"&gt;
        &lt;img src="/img/p101.jpg" alt="Phòng P101" width="400" height="250"&gt;
        &lt;div class="card-head"&gt;
          &lt;h2&gt;P101&lt;/h2&gt;
          &lt;span class="badge badge-free"&gt;Còn trống&lt;/span&gt;
        &lt;/div&gt;
        &lt;p&gt;Loại: Phòng đôi · Tầng 1&lt;/p&gt;
        &lt;p&gt;Diện tích: 20 m²&lt;/p&gt;
        &lt;p class="price"&gt;2.500.000 đ / tháng&lt;/p&gt;
        &lt;a class="btn" href="/rooms/detail?id=1"&gt;Xem chi tiết&lt;/a&gt;   &lt;!-- ④ --&gt;
      &lt;/article&gt;
      &lt;!-- năm thẻ nữa cùng hình dạng --&gt;
    &lt;/section&gt;
  &lt;/div&gt;

  &lt;nav class="pager" aria-label="Phân trang"&gt;           &lt;!-- ⑤ --&gt;
    &lt;a href="/rooms?page=1" aria-current="page"&gt;1&lt;/a&gt;
    &lt;a href="/rooms?page=2"&gt;2&lt;/a&gt;
    &lt;a href="/rooms?page=3"&gt;3&lt;/a&gt;
  &lt;/nav&gt;
&lt;/main&gt;

&lt;footer class="site-footer"&gt;© 2026 Nhà Trọ SV&lt;/footer&gt;</code></pre>
<p>Và bố cục, mobile-first đúng như bài 3.5 — "bộ lọc bên trái, ba thẻ một hàng" trên wireframe là luật cho máy tính; điện thoại chỉ một cột:</p>
<pre><code class="language-css">.topbar { display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: 16px; padding: 12px 24px; }
.menu   { display: flex; gap: 24px; }
.layout { display: grid; grid-template-columns: 1fr; gap: 24px; }
.cards  { display: grid; grid-template-columns: 1fr; gap: 16px; }
.card img { max-width: 100%; height: auto; }
.pager  { display: flex; justify-content: center; gap: 8px; margin: 24px 0; }

/* màu chỉ đặt ở chỗ có nghĩa: hành động chính và trạng thái */
.btn-primary { background: #2563eb; color: #fff; }
.badge-free  { border: 1px solid #16a34a; color: #16a34a; }

@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .layout { grid-template-columns: 260px 1fr; }   /* bộ lọc trái, thẻ phải */
  .cards  { grid-template-columns: repeat(3, 1fr); }
}</code></pre>
<div class="pitfall"><p><strong>Bẫy — phân trang quên mất bộ lọc.</strong> Các liên kết tĩnh ở trên ghi <code>?page=2</code>. Trên web thật, trang 2 của "phòng đôi dưới 3 triệu" phải là <code>/rooms?typeId=2&amp;maxPrice=3000000&amp;page=2</code>, nếu không thì bấm "2" là bộ lọc lặng lẽ biến mất. Ghi chú ⑤ trên wireframe nói đúng điều này, và đó là lý do server (khoá Node.js) hoặc JavaScript (Chương 4) phải dựng các liên kết đó từ URL hiện tại — HTML thuần không làm được.</p></div>

<h3>Công cụ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Giấy</span><span class="v">Nhanh nhất. Vẽ ba phương án trong mười phút, chụp ảnh bản thắng, gửi vào nhóm chat. Hợp nhất cho ý tưởng đầu tiên.</span></div>
  <div class="kv"><span class="k">draw.io (diagrams.net)</span><span class="v">Miễn phí, chạy trên trình duyệt hoặc cài bản máy tính. Có thư viện hình "Mockups" (nút, ô nhập, khung trình duyệt). Lưu thành file .drawio commit được cạnh code, nên hình vẽ cũng có lịch sử như code.</span></div>
  <div class="kv"><span class="k">Figma</span><span class="v">Có gói miễn phí, và gói Education miễn phí cho sinh viên đã xác minh. Nhiều người sửa cùng lúc, và cùng một file có thể lớn dần từ wireframe lên mockup rồi prototype bấm được.</span></div>
  <div class="kv"><span class="k">Khác</span><span class="v">Excalidraw (nét vẽ tay, miễn phí), Penpot (mã nguồn mở, thay thế Figma). Mỗi nhóm chọn một công cụ rồi dùng thống nhất.</span></div>
</div>

<h3>Dùng AI đổi wireframe thành code — có trách nhiệm</h3>
<p>Trợ lý AI bây giờ đọc được ảnh wireframe và sinh HTML/CSS trong vài giây. Việc đó thật sự có ích — và thật sự rủi ro nếu bạn bỏ qua phần suy nghĩ. Luật là: <strong>bạn thiết kế, AI gõ phím, bạn kiểm và giải thích được từng dòng.</strong></p>
<ol>
<li>Tự vẽ wireframe. Các quyết định (trang có gì, bấm đi đâu, ai được xem) mới là phần việc của bạn.</li>
<li>Đưa AI ảnh wireframe <em>kèm</em> ràng buộc: HTML và CSS thuần, thẻ ngữ nghĩa, mobile-first, không framework, đúng tên trường dữ liệu bạn thật sự có.</li>
<li>Xin bộ khung, đừng xin cả website. Kết quả nhỏ thì dễ kiểm.</li>
<li>So với các ghi chú đánh số: số nào cũng phải có trong code với đúng đích đến. Thứ gì có trong code mà không có trên wireframe thì phải hỏi lại hoặc xoá.</li>
<li>Mở ở bề ngang 375 px và 1280 px. Đọc từng dòng. Dòng nào bạn chưa giải thích được thì nó chưa phải của bạn.</li>
</ol>
<pre><code class="language-plaintext">Đây là wireframe của một trang (ảnh đính kèm).
CHỈ dựng bộ khung HTML + một file CSS:
- thẻ ngữ nghĩa (header, nav, main, aside, section, article, footer)
- mobile-first: mặc định một cột; từ 1024px bộ lọc bên trái + 3 thẻ một hàng
- bộ lọc là form GET tới /rooms với các trường typeId, minPrice, maxPrice, floor
- không framework, không JavaScript, không style inline
- giữ nguyên các nhãn tiếng Việt đúng như trên wireframe
Đánh dấu mỗi phần tử có số trên wireframe bằng một chú thích HTML (1)…(7).</code></pre>
<div class="pitfall"><p><strong>Bẫy — nhận hết những gì AI tự thêm.</strong> Mấy thứ hay gặp: một ô tìm kiếm không ai vẽ, một trường đánh giá sao mà cơ sở dữ liệu không có, <code>style=""</code> inline trên mọi phần tử, một thẻ div ở chỗ đáng lẽ là nút, một liên kết tới URL không tồn tại. Từng cái trông vô hại, nhưng mỗi cái là một lỗi, một điều sai trong báo cáo, hoặc một câu bạn không trả lời được khi thầy cô hay đồng nghiệp hỏi "cái này để làm gì?".</p></div>

<h3>🧪 Thực hành</h3>
<p>Vẽ wireframe <strong>hai trang</strong> của một app nhỏ, "Sổ công thức nấu ăn":</p>
<ol>
<li><strong>Danh sách công thức</strong> — tìm theo tên, lọc theo loại (bữa sáng, món chính, tráng miệng), thẻ công thức (ảnh, thời gian nấu, độ khó), phân trang. Ai cũng mở được.</li>
<li><strong>Chi tiết công thức</strong> — ảnh, nguyên liệu, các bước đánh số, và nút "Lưu vào yêu thích" mà chỉ người đã đăng nhập mới thấy.</li>
</ol>
<p>Dùng giấy hoặc draw.io, tổng cộng 20–30 phút. Sau đó dựng trang 1 bằng HTML và CSS theo bảng đối chiếu ở trên.</p>
<p><strong>Tự kiểm trước khi coi là xong:</strong></p>
<ul>
<li>☐ URL và ai được mở ghi ở trên cùng mỗi trang.</li>
<li>☐ Mọi chỗ bấm được đều có số và đích đến (URL, hoặc nó làm gì).</li>
<li>☐ Nút và tiêu đề mang chữ thật, không phải "Button" hay "Tiêu đề".</li>
<li>☐ Chỉ có xám; màu chỉ xuất hiện ở hành động chính hoặc trạng thái.</li>
<li>☐ Ảnh là hộp gạch chéo.</li>
<li>☐ Có vẽ trạng thái rỗng ("Không có công thức phù hợp").</li>
<li>☐ Có phác bản điện thoại (một cột) đặt cạnh bản máy tính.</li>
<li>☐ Với mỗi hộp, bạn nói được dữ liệu của nó lấy từ đâu.</li>
<li>☐ Một bạn cùng lớp nhìn hình của bạn là giải thích được trang, không cần bạn nói.</li>
</ul>

<h3>Đi xa hơn</h3>
<p>Bài này là mức tối thiểu cho lập trình viên. Khoá UX/UI cho lập trình viên đi sâu hơn — kỹ thuật phác thảo, wireframe độ trung thực thấp và cao, Figma, prototype và thử với người dùng — ở Chương 4. Lưu ý: khoá đó hiện mới có đề cương, các bài đang được soạn.</p>
<div class="link-card"><a href="/courses/ux-ui-for-developers/learn?lessonSlug=uxui-4-1-phac-thao">UX/UI cho lập trình viên — 4.1 Phác thảo và wireframe độ trung thực thấp (đề cương)</a></div>
<div class="link-card"><a href="https://www.drawio.com/" target="_blank" rel="noopener">draw.io — trình vẽ sơ đồ và wireframe miễn phí</a></div>
<div class="link-card"><a href="https://www.figma.com/education/" target="_blank" rel="noopener">Figma for Education — gói miễn phí cho sinh viên</a></div>
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
<div class="ml-en"><p class="lead">Ten questions on Chapter 3: selectors and the cascade, the box model and box-sizing, Flexbox axes, CSS Grid, relative units and media queries.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> CSS layout only clicks once you push pixels yourself. On Code Lab, style and lay out real elements — box model, Flexbox, Grid and responsive — with instant feedback.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Cascade</span><span class="lz-t">Specificity, then source order</span><span class="lz-d">DevTools strikes through the rules that lost. Read it before reaching for <code>!important</code>, which hides the cause rather than fixing it.</span></div>
<div class="lz-node"><span class="lz-k">Box model</span><span class="lz-t">border-box, once, at the top</span><span class="lz-d"><code>* { box-sizing: border-box }</code> makes <code>width</code> mean the visible box. Without it, padding pushes columns past 100%.</span></div>
<div class="lz-node"><span class="lz-k">Flexbox</span><span class="lz-t">One direction, and the axis matters</span><span class="lz-d">Set <code>flex-direction</code> first: <code>justify-content</code> and <code>align-items</code> swap meaning between row and column.</span></div>
<div class="lz-node"><span class="lz-k">Grid &amp; responsive</span><span class="lz-t">Two directions; mobile as the default</span><span class="lz-d">Grid for the page skeleton, flexbox inside it. Write the one-column layout first, then add <code>min-width</code> queries where the design breaks.</span></div>
</div>
<p class="note-ct"><strong>Do not memorise CSS properties.</strong> Nobody does. Learn the four models above — cascade, box, flex axis, grid tracks — and look the properties up. The models are what let you read someone else's stylesheet.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-3-0-slides&amp;khoa=web-foundations">Practice on Code Lab → the Chapter 3 set, easy to hard</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 3: bộ chọn và cascade, box model và box-sizing, các trục Flexbox, CSS Grid, đơn vị tương đối và media query.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Bố cục CSS chỉ thật sự thông khi bạn tự tay đẩy từng pixel. Trên Code Lab, hãy tạo kiểu và dàn các phần tử thật — box model, Flexbox, Grid và responsive — với phản hồi tức thì.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Đổ tầng (cascade)</span><span class="lz-t">Độ đặc hiệu, rồi tới thứ tự trong mã</span><span class="lz-d">DevTools gạch ngang những luật đã thua. Hãy đọc nó trước khi với tay lấy <code>!important</code>, thứ giấu nguyên nhân đi chứ không sửa nó.</span></div>
<div class="lz-node"><span class="lz-k">Mô hình hộp</span><span class="lz-t">border-box, một lần, ở trên cùng</span><span class="lz-d"><code>* { box-sizing: border-box }</code> làm <code>width</code> nghĩa là cái hộp nhìn thấy được. Thiếu nó, padding đẩy các cột vượt quá 100%.</span></div>
<div class="lz-node"><span class="lz-k">Flexbox</span><span class="lz-t">Một chiều, và cái trục có ý nghĩa</span><span class="lz-d">Hãy đặt <code>flex-direction</code> trước: <code>justify-content</code> và <code>align-items</code> đổi nghĩa cho nhau giữa row và column.</span></div>
<div class="lz-node"><span class="lz-k">Grid &amp; responsive</span><span class="lz-t">Hai chiều; điện thoại làm mặc định</span><span class="lz-d">Grid cho bộ khung trang, flexbox bên trong nó. Hãy viết bố cục một cột trước, rồi thêm query <code>min-width</code> ở chỗ thiết kế vỡ.</span></div>
</div>
<p class="note-ct"><strong>Đừng học thuộc các thuộc tính CSS.</strong> Chẳng ai làm thế. Hãy học bốn mô hình ở trên — cascade, hộp, trục flex, rãnh grid — rồi tra thuộc tính khi cần. Chính các mô hình mới là thứ giúp bạn đọc được bảng kiểu của người khác.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-3-0-slides&amp;khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 3, từ dễ đến khó</a></div></div>
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
