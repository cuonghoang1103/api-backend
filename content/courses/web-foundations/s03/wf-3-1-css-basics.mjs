/**
 * Bài 3.1 — CSS cơ bản: bộ chọn, cascade, kế thừa (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/3-1).
 * Deck: scripts/slides-src/wf-3-1.mjs (11 slide, WF/v1/wf-3-1). Code Lab: module 3.1 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-3-1', 'CSS basics', 'CSS cơ bản', [
  [1, 'CSS basics',
    '<p>HTML said what things are. CSS says how they look. In this lesson you learn to read and write a rule, select exactly the elements you want, and, most importantly, understand why a rule sometimes seems to be ignored. That question is the source of most CSS frustration.</p>',
    '<p>HTML đã nói mọi thứ là gì. CSS nói chúng trông ra sao. Trong bài này bạn học đọc và viết một luật, chọn đúng phần tử mình muốn, và quan trọng nhất là hiểu vì sao đôi khi một luật có vẻ bị bỏ qua. Câu hỏi đó là nguồn gốc của phần lớn ức chế với CSS.</p>'],
  [2, 'After this lesson you can…',
    '<p>The outcome that pays off most is the third: predicting which rule wins. Once you can compare two rules by origin, specificity and order, CSS stops feeling random. The DevTools Styles tab then shows you the same reasoning, line by line.</p>',
    '<p>Kết quả đáng giá nhất là điều thứ ba: đoán được luật nào thắng. Khi so được hai luật theo nguồn gốc, độ cụ thể và thứ tự, CSS không còn có vẻ ngẫu nhiên. Thẻ Styles của DevTools sau đó cho bạn thấy đúng cách suy luận đó, từng dòng một.</p>'],
  [3, 'Anatomy of a rule, three ways to add it',
    '<p>A rule is a selector plus declarations, and a declaration is a property and a value. CSS can live on one element, in a style element, or in a separate file. The last is the normal way, because one file styles every page. All three applied here, as the computed colours confirm.</p>',
    '<p>Một luật gồm bộ chọn cộng các khai báo, và khai báo là một thuộc tính với một giá trị. CSS có thể nằm trên một phần tử, trong thẻ style, hoặc trong tệp riêng. Cách cuối là cách thông thường, vì một tệp tạo kiểu cho mọi trang. Cả ba đều có tác dụng ở đây, như màu đã tính xác nhận.</p>'],
  [4, 'Selectors',
    '<p>Every selector here was run with <code>querySelectorAll</code>, because CSS and JavaScript share the same selector language. The numbers tell you how many elements each one matched. A space means "anywhere inside", the greater-than sign means "direct child", and no space means "on the same element".</p>',
    '<p>Mỗi bộ chọn ở đây đều được chạy bằng <code>querySelectorAll</code>, vì CSS và JavaScript dùng chung ngôn ngữ bộ chọn. Con số cho biết mỗi bộ chọn khớp bao nhiêu phần tử. Dấu cách nghĩa là "ở đâu đó bên trong", dấu lớn hơn nghĩa là "con trực tiếp", và không có dấu cách nghĩa là "trên cùng phần tử".</p>'],
  [5, 'The cascade: which rule wins?',
    '<p>Six fights, and green wins each one. The order of comparison: importance first, then specificity, then source order. A later rule wins only when specificity is equal. An id beats any number of classes, and a class beats any number of tags.</p>',
    '<p>Sáu cuộc đấu, và màu xanh thắng cả sáu. Thứ tự so sánh: mức quan trọng trước, rồi độ cụ thể, rồi thứ tự trong nguồn. Luật sau chỉ thắng khi độ cụ thể bằng nhau. Một id thắng mọi số lượng class, và một class thắng mọi số lượng thẻ.</p>'],
  [6, 'Specificity is a score',
    '<p>Think of three counters: ids, classes, tags. Compare from left to right; a single id beats a hundred classes. Keep specificity low on purpose: use classes, avoid ids in CSS, and avoid <code>!important</code>, because each one forces the next rule to be even stronger.</p>',
    '<p>Hãy nghĩ tới ba bộ đếm: id, class, thẻ. So từ trái sang phải; một id thắng cả trăm class. Hãy cố ý giữ độ cụ thể thấp: dùng class, tránh id trong CSS, và tránh <code>!important</code>, vì mỗi lần dùng lại buộc luật sau phải mạnh hơn nữa.</p>'],
  [7, 'Inheritance',
    '<p>Some properties pass from parent to child, and some do not. Text properties like colour and font inherit; boxes like border do not. Links keep the browser’s colour and form controls keep their own font. That is why a reset usually includes <code>font: inherit</code>.</p>',
    '<p>Một số thuộc tính truyền từ cha sang con, một số thì không. Thuộc tính về chữ như màu và phông được kế thừa; thuộc tính về hộp như viền thì không. Liên kết giữ màu của trình duyệt và điều khiển form giữ phông riêng. Vì vậy phần reset thường có <code>font: inherit</code>.</p>'],
  [8, 'Colours and units',
    '<p>The same blue in three notations computes to almost the same value. Percentages come from the parent, <code>em</code> from the current font size, <code>rem</code> from the root, and <code>vw</code> from the window. Prefer <code>rem</code> for sizes that should follow the reader’s settings.</p>',
    '<p>Cùng một màu xanh ở ba cách viết cho ra gần như cùng một giá trị. Phần trăm tính từ cha, <code>em</code> từ cỡ chữ hiện tại, <code>rem</code> từ gốc, còn <code>vw</code> từ cửa sổ. Hãy ưu tiên <code>rem</code> cho những kích thước nên theo thiết lập của người đọc.</p>'],
  [9, 'CSS fails silently',
    '<p>Like HTML, CSS never reports an error. An unknown value or property is simply dropped. A missing semicolon kills two declarations at once, and class names are case-sensitive. Only the correct rules took effect here. In DevTools a bad declaration appears struck through.</p>',
    '<p>Giống HTML, CSS không bao giờ báo lỗi. Giá trị hay thuộc tính lạ đơn giản là bị bỏ. Thiếu một dấu chấm phẩy giết hai khai báo cùng lúc, và tên class phân biệt hoa thường. Chỉ các luật đúng có tác dụng ở đây. Trong DevTools khai báo sai bị gạch ngang.</p>'],
  [10, 'Styling a button, keeping focus',
    '<p>A complete button: inherited font, padding, colour, hover and active states, a disabled style, and a visible focus ring. The screenshot shows the middle button with keyboard focus. Removing the outline is easy and wrong; replacing it with <code>:focus-visible</code> is the right way.</p>',
    '<p>Một nút hoàn chỉnh: phông kế thừa, padding, màu, trạng thái hover và active, kiểu vô hiệu hoá, và viền tiêu điểm nhìn thấy được. Ảnh chụp cho thấy nút giữa đang có tiêu điểm bàn phím. Gỡ outline thì dễ và sai; thay nó bằng <code>:focus-visible</code> mới là cách đúng.</p>'],
  [11, 'Summary & practice',
    '<p>The practice styles a small card and then asks you to explain a rule conflict using DevTools. "Done when" is about understanding: you can point at a struck-through line and say which rule beat it and why.</p>',
    '<p>Bài luyện tạo kiểu cho một thẻ nhỏ rồi yêu cầu bạn giải thích một xung đột luật bằng DevTools. "Xong khi" nói về sự hiểu: bạn chỉ được vào một dòng bị gạch ngang và nói luật nào đã thắng nó và vì sao.</p>'],
]);

export default {
  title: '3.1 — What CSS is: selectors, the cascade, inheritance|||3.1 — CSS là gì: bộ chọn, cascade, kế thừa',
  slug: 'wf-3-1-css-basics',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/yfoY53QXEnI', durationSeconds: 0 },
  description: 'Giải phẫu một luật, ba cách thêm CSS, bộ chọn (đếm khớp thật), sáu cuộc đấu cascade đo bằng Chromium, độ cụ thể như ba bộ đếm, kế thừa, màu và đơn vị (đã tính), CSS hỏng âm thầm, tạo kiểu nút với :focus-visible, đọc thẻ Styles của DevTools.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Selecting elements, and knowing which rule wins</h2>
<p class="lead">After this lesson you can write a CSS rule, attach a stylesheet, select exactly the elements you want, predict which of two conflicting rules wins, use inheritance instead of repeating yourself, and read the Styles panel in DevTools to see why a rule is ignored. You need this because nearly every CSS complaint — "my style is not applying" — comes down to one of three things: the selector does not match, another rule beats it, or there is a typo that CSS ignored silently. This lesson gives you a way to find out which, in under a minute.</p>

<h3>Step 1 — anatomy of a rule</h3>
<p>CSS (Cascading Style Sheets) is a list of rules. A rule picks some elements and declares how they should look:</p>
<pre><code class="language-css">h1 {                 /* selector: which elements          */
  color: #1f4e8c;    /* declaration = property: value;    */
  font-size: 28px;
}</code></pre>
<p>A <strong>selector</strong> chooses elements; each <strong>declaration</strong> sets one <strong>property</strong> to a <strong>value</strong>, and ends with a semicolon. There are three places to write CSS:</p>
${ma('html', CODE['3-1/ba-cach.html'], [5, 13])}
${ra(OUT['3-1/ba-cach'])}
<div class="kv-grid">
  <div class="kv"><span class="k">External file</span><span class="v"><code>link rel="stylesheet"</code>. The normal way: one file styles the whole site, and the browser caches it.</span></div>
  <div class="kv"><span class="k">style element</span><span class="v">Inside <code>head</code>. For quick demos or one-page tools.</span></div>
  <div class="kv"><span class="k">style attribute</span><span class="v">On one element. Hard to maintain, and strong in the cascade. Use only when a script must set it.</span></div>
</div>

<h3>Step 2 — selectors</h3>
<p>CSS and JavaScript share one selector language, so we can run a list of selectors with <code>querySelectorAll</code> and count what each matches on a small page:</p>
${ma('html', CODE['3-1/bo-chon.html'], [5, 14])}
${ra(OUT['3-1/bo-chon'])}
<table>
<thead><tr><th>Selector</th><th>Matches</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>Every <code>a</code> element</td></tr>
<tr><td><code>.link</code></td><td>Elements with <code>class="link"</code>. Your everyday tool</td></tr>
<tr><td><code>#top</code></td><td>The element with <code>id="top"</code></td></tr>
<tr><td><code>nav a</code></td><td>A space: <code>a</code> anywhere inside <code>nav</code> (descendant)</td></tr>
<tr><td><code>article &gt; p</code></td><td><code>p</code> that is a direct child (child combinator)</td></tr>
<tr><td><code>a.link.active</code></td><td>No space: both conditions on the same element</td></tr>
<tr><td><code>[href^="https"]</code></td><td>An attribute that starts with a value</td></tr>
<tr><td><code>h2 + p</code></td><td>The <code>p</code> right after an <code>h2</code></td></tr>
<tr><td><code>h1, h2</code></td><td>A comma: either one</td></tr>
<tr><td><code>a:hover</code>, <code>li:first-child</code></td><td>A pseudo-class: a state or a position</td></tr>
<tr><td><code>p::first-line</code></td><td>A pseudo-element: a part of an element</td></tr>
</tbody>
</table>
<p>The space matters more than it looks: <code>.card.big</code> is one element with both classes; <code>.card .big</code> is a <code>.big</code> inside a <code>.card</code>. Test any selector in the Console with <code>document.querySelectorAll('nav a')</code>. If it returns nothing, the problem is not your CSS properties.</p>

<h3>Step 3 — the cascade: which rule wins?</h3>
<p>Often several rules set the same property on one element. "Cascading" is the algorithm that chooses a winner. Here are six fights. In each one, the green rule should win:</p>
${ma('html', CODE['3-1/cascade.html'], [5, 22])}
${ra(OUT['3-1/cascade'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Importance</span><span class="lz-d"><code>!important</code> beats normal rules. Avoid it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Specificity</span><span class="lz-d">The more precise selector wins, regardless of order.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Order</span><span class="lz-d">If still tied, the later rule wins.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Inheritance</span><span class="lz-d">Only if no rule targets the element itself does it take the parent's value.</span></div>
</div>
<p>Case 2 surprises beginners: <code>p</code> comes later and still loses, because order only breaks ties. Case 6 surprises them too: <code>.six</code> is on the parent, and a rule that targets the element directly always beats an inherited value.</p>

<h3>Step 4 — specificity is a score</h3>
<p>Think of three counters, written <strong>(ids, classes, tags)</strong>. Compare from left to right; the first difference decides.</p>
<table>
<thead><tr><th>Selector</th><th>Score</th></tr></thead>
<tbody>
<tr><td><code>p</code></td><td>(0, 0, 1)</td></tr>
<tr><td><code>article p</code></td><td>(0, 0, 2)</td></tr>
<tr><td><code>.card</code></td><td>(0, 1, 0)</td></tr>
<tr><td><code>.card .title</code></td><td>(0, 2, 0)</td></tr>
<tr><td><code>a:hover</code></td><td>(0, 1, 1): a pseudo-class counts as a class</td></tr>
<tr><td><code>[type="email"]</code></td><td>(0, 1, 0): an attribute too</td></tr>
<tr><td><code>#top</code></td><td>(1, 0, 0): beats any number of classes</td></tr>
<tr><td><code>style="…"</code></td><td>Beats all selectors</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — the <code>!important</code> war.</strong> A style does not apply, so you add <code>!important</code>. It works. Next week someone needs to override that, so they add a more specific <code>!important</code>. Soon nothing can be changed without another one, and your stylesheet is a pile of exceptions. Find out <em>why</em> the rule loses instead. Keep specificity low and even: use single classes (Lesson 12.3), and keep ids for HTML and JavaScript, not CSS.</p></div>

<h3>Step 5 — inheritance</h3>
<p>You do not set a font on every element. Some properties pass down to children automatically:</p>
${ma('html', CODE['3-1/ke-thua.html'], [5, 12])}
${ra(OUT['3-1/ke-thua'])}
<p>Text-related properties inherit: <code>color</code>, <code>font-*</code>, <code>line-height</code>, <code>text-align</code>. Box-related ones do not: <code>border</code>, <code>padding</code>, <code>margin</code>, <code>background</code>, <code>width</code>. That is why setting a font on <code>body</code> is the standard start of a stylesheet.</p>
<p>Two exceptions appeared above, and they catch everyone. Links stayed blue because the browser's own stylesheet targets <code>a</code> directly; and form controls did not inherit the font. Fix them on purpose: <code>a { color: inherit; }</code> and <code>button, input { font: inherit; }</code>.</p>

<h3>Step 6 — colours and units</h3>
${ma('html', CODE['3-1/mau-don-vi.html'], [5, 15])}
${ra(OUT['3-1/mau-don-vi'])}
<div class="kv-grid">
  <div class="kv"><span class="k">#1f4e8c</span><span class="v">Hex: red, green, blue. Copied from design tools.</span></div>
  <div class="kv"><span class="k">rgb(31 78 140 / 50%)</span><span class="v">The same three numbers, with optional transparency.</span></div>
  <div class="kv"><span class="k">hsl(214 64% 34%)</span><span class="v">Hue, saturation, lightness: easy to make a lighter shade.</span></div>
  <div class="kv"><span class="k">px</span><span class="v">A fixed size. Fine for borders and small details.</span></div>
  <div class="kv"><span class="k">%</span><span class="v">A share of the parent.</span></div>
  <div class="kv"><span class="k">rem</span><span class="v">Relative to the root font size (usually 16px). Follows the reader's settings: the best default for text and spacing.</span></div>
  <div class="kv"><span class="k">em</span><span class="v">Relative to this element's font size. It compounds when nested.</span></div>
  <div class="kv"><span class="k">vw, vh</span><span class="v">1% of the window's width or height.</span></div>
</div>

<h3>Step 7 — CSS fails silently</h3>
<p>As with HTML, there are no error messages. Six rules, four of them wrong:</p>
${ma('html', CODE['3-1/loi-css.html'], [5, 10])}
${ra(OUT['3-1/loi-css'])}
<p>A wrong value or a wrong property is dropped without a word, and only that declaration is lost. Look at <code>.c</code>, though: a missing semicolon makes one long invalid value, so <strong>both</strong> declarations vanish. And <code>.Card</code> did not match <code>class="card"</code>, because class names are case-sensitive. Note that the last declaration in a block may omit its semicolon, as <code>.e</code> shows; but always write it, so that the next line you add does not break it.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — editing the wrong thing for an hour.</strong> Your style "does not work", so you keep changing values. First ask: does the rule reach the element at all? Right-click the element → <strong>Inspect</strong> → <strong>Styles</strong>. There are only four cases: (1) your rule is absent: the selector does not match, or the file did not load (check Network); (2) it is struck through: another rule won, and it is listed above; (3) it has a yellow warning triangle: a typo; (4) it applies, but the value is not what you think (see Computed).</p></div>

<h3>Step 8 — styling a button, and keeping focus visible</h3>
<p>Here is a complete button. It brings many things together:</p>
${ma('html', CODE['3-1/nut-tieu-diem.html'], [6, 18])}
${ra(OUT['3-1/nut-tieu-diem'])}
<p><code>:hover</code> applies under the mouse, <code>:active</code> while pressed, and <code>:focus-visible</code> when focus should be shown, which browsers decide for keyboard users. The screenshot on slide 10 shows the middle button focused.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>outline: none</code> without a replacement.</strong> Designers often dislike the default ring and remove it globally. Keyboard users then cannot see where they are. If you do not like the default, replace it as above with your own <code>:focus-visible</code> style, and check by pressing Tab.</p></div>

<h3>A short starter stylesheet</h3>
<pre><code class="language-css">*, *::before, *::after { box-sizing: border-box; }   /* Lesson 3.2 */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #222;
}
img { max-width: 100%; height: auto; }               /* Lesson 3.5 */
button, input, select, textarea { font: inherit; }</code></pre>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — a profile card, and one conflict to explain</strong></p>
<ol>
<li>Create <code>index.html</code> and <code>style.css</code>, linked together. Add the starter stylesheet above.</li>
<li>Add a card: an <code>article class="card"</code> with a photo, an <code>h2</code>, a paragraph and a <code>button class="btn"</code>.</li>
<li>Style it with classes only: background, padding, border radius, a heading colour, and a button with hover and <code>:focus-visible</code> states.</li>
<li>Now create a conflict: add <code>p { color: red; }</code> <em>after</em> your <code>.card p { color: #444; }</code> rule, and predict which wins before reloading.</li>
</ol>
<p>Hint: <code>.card p</code> scores (0,1,1) and <code>p</code> scores (0,0,1).</p>
<p><strong>Done when:</strong> DevTools → Styles shows the red line struck through, and you can say why in one sentence; pressing Tab shows your own focus ring; <code>document.querySelectorAll('.btn').length</code> is 1; and no ids appear in your CSS. Then Code Lab module 3.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rule</span><span class="v">luật — bộ chọn + khai báo.</span></div>
  <div class="kv"><span class="k">selector</span><span class="v">bộ chọn — chọn phần tử.</span></div>
  <div class="kv"><span class="k">declaration</span><span class="v">khai báo — thuộc tính: giá trị;</span></div>
  <div class="kv"><span class="k">cascade</span><span class="v">thuật toán chọn luật thắng.</span></div>
  <div class="kv"><span class="k">specificity</span><span class="v">độ cụ thể — điểm (id, class, thẻ).</span></div>
  <div class="kv"><span class="k">inheritance</span><span class="v">kế thừa — con nhận giá trị từ cha.</span></div>
  <div class="kv"><span class="k">pseudo-class</span><span class="v">lớp giả — trạng thái, vd :hover.</span></div>
  <div class="kv"><span class="k">pseudo-element</span><span class="v">phần tử giả — một phần, vd ::first-line.</span></div>
  <div class="kv"><span class="k">computed value</span><span class="v">giá trị đã tính — kết quả cuối cùng.</span></div>
  <div class="kv"><span class="k">rem / em</span><span class="v">theo cỡ chữ gốc / theo cỡ chữ hiện tại.</span></div>
  <div class="kv"><span class="k">reset</span><span class="v">vài luật đầu tệp để đưa mặc định về chuẩn.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A rule = selector + declarations. Keep CSS in an external file.</li>
  <li>Space = inside; <code>&gt;</code> = direct child; no space = same element; comma = either.</li>
  <li>Winner: importance, then specificity (ids, classes, tags), then order. Order only breaks ties.</li>
  <li>Text properties inherit; box properties do not; form controls need <code>font: inherit</code>.</li>
  <li>Prefer <code>rem</code> for text and spacing; <code>%</code> follows the parent.</li>
  <li>CSS fails silently; a missing semicolon loses two declarations. Class names are case-sensitive.</li>
  <li>DevTools → Styles has the answer: absent, struck through, warning, or Computed.</li>
  <li>Never remove focus without replacing it.</li>
</ul>
${nguon('📗', 'MDN — CSS first steps and building blocks', 'Selectors, the cascade and specificity', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics')}
${nguon('📘', 'web.dev — Learn CSS', 'A free, thorough course from Google', 'https://web.dev/learn/css')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-cascade', title: 'WED201c (Academy) — the cascade', sub: 'The same rules in the university syllabus', cta: 'Open lesson' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-1-styling-va-tailwind', title: 'Next.js 13.1 — styling and Tailwind', sub: 'Why utility classes avoid most specificity fights', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Chọn phần tử, và biết luật nào thắng</h2>
<p class="lead">Học xong bài này bạn viết được một luật CSS, gắn được bảng định kiểu, chọn đúng phần tử mình muốn, đoán được luật nào thắng trong hai luật xung đột, dùng kế thừa thay vì lặp lại, và đọc được ngăn Styles trong DevTools để biết vì sao một luật bị bỏ qua. Bạn cần điều này vì gần như mọi lời than về CSS — "style không ăn" — đều quy về một trong ba thứ: bộ chọn không khớp, một luật khác thắng nó, hoặc một lỗi gõ bị CSS âm thầm bỏ qua. Bài này cho bạn cách tìm ra là thứ nào, trong chưa đầy một phút.</p>

<h3>Bước 1 — giải phẫu một luật</h3>
<p>CSS (Cascading Style Sheets — bảng định kiểu xếp tầng) là một danh sách luật. Mỗi luật chọn vài phần tử và khai báo chúng nên trông thế nào:</p>
<pre><code class="language-css">h1 {                 /* bộ chọn: những phần tử nào        */
  color: #1f4e8c;    /* khai báo = thuộc tính: giá trị;   */
  font-size: 28px;
}</code></pre>
<p><strong>Bộ chọn (selector)</strong> chọn phần tử; mỗi <strong>khai báo (declaration)</strong> đặt một <strong>thuộc tính (property)</strong> thành một <strong>giá trị (value)</strong>, và kết thúc bằng dấu chấm phẩy. Có ba chỗ viết CSS:</p>
${ma('html', CODE['3-1/ba-cach.html'], [5, 13])}
${ra(OUT['3-1/ba-cach'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Tệp ngoài</span><span class="v"><code>link rel="stylesheet"</code>. Cách thông thường: một tệp tạo kiểu cả website, và trình duyệt lưu đệm nó.</span></div>
  <div class="kv"><span class="k">thẻ style</span><span class="v">Trong <code>head</code>. Cho demo nhanh hay công cụ một trang.</span></div>
  <div class="kv"><span class="k">thuộc tính style</span><span class="v">Trên một phần tử. Khó bảo trì, và rất mạnh trong cascade. Chỉ dùng khi script buộc phải đặt nó.</span></div>
</div>

<h3>Bước 2 — bộ chọn</h3>
<p>CSS và JavaScript dùng chung một ngôn ngữ bộ chọn, nên ta có thể chạy một danh sách bộ chọn bằng <code>querySelectorAll</code> và đếm mỗi cái khớp gì trên một trang nhỏ:</p>
${ma('html', CODE['3-1/bo-chon.html'], [5, 14])}
${ra(OUT['3-1/bo-chon'])}
<table>
<thead><tr><th>Bộ chọn</th><th>Khớp</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>Mọi phần tử <code>a</code></td></tr>
<tr><td><code>.link</code></td><td>Phần tử có <code>class="link"</code>. Công cụ hằng ngày của bạn</td></tr>
<tr><td><code>#top</code></td><td>Phần tử có <code>id="top"</code></td></tr>
<tr><td><code>nav a</code></td><td>Dấu cách: <code>a</code> ở đâu đó trong <code>nav</code> (hậu duệ)</td></tr>
<tr><td><code>article &gt; p</code></td><td><code>p</code> là con trực tiếp</td></tr>
<tr><td><code>a.link.active</code></td><td>Không dấu cách: cả hai điều kiện trên cùng phần tử</td></tr>
<tr><td><code>[href^="https"]</code></td><td>Thuộc tính bắt đầu bằng một giá trị</td></tr>
<tr><td><code>h2 + p</code></td><td><code>p</code> ngay sau một <code>h2</code></td></tr>
<tr><td><code>h1, h2</code></td><td>Dấu phẩy: cái nào cũng được</td></tr>
<tr><td><code>a:hover</code>, <code>li:first-child</code></td><td>Lớp giả: một trạng thái hay vị trí</td></tr>
<tr><td><code>p::first-line</code></td><td>Phần tử giả: một phần của phần tử</td></tr>
</tbody>
</table>
<p>Dấu cách quan trọng hơn bạn tưởng: <code>.card.big</code> là một phần tử có cả hai class; <code>.card .big</code> là một <code>.big</code> nằm trong <code>.card</code>. Thử bộ chọn bất kỳ trong Console bằng <code>document.querySelectorAll('nav a')</code>. Nếu nó không trả gì, vấn đề không nằm ở các thuộc tính CSS của bạn.</p>

<h3>Bước 3 — cascade: luật nào thắng?</h3>
<p>Thường nhiều luật cùng đặt một thuộc tính trên một phần tử. "Cascading" là thuật toán chọn người thắng. Đây là sáu cuộc đấu. Trong mỗi cuộc, luật xanh phải thắng:</p>
${ma('html', CODE['3-1/cascade.html'], [5, 22])}
${ra(OUT['3-1/cascade'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mức quan trọng</span><span class="lz-d"><code>!important</code> thắng luật thường. Hãy tránh nó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Độ cụ thể</span><span class="lz-d">Bộ chọn chính xác hơn thắng, bất kể thứ tự.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thứ tự</span><span class="lz-d">Nếu vẫn hoà, luật sau thắng.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kế thừa</span><span class="lz-d">Chỉ khi không có luật nào nhắm vào chính phần tử, nó mới nhận giá trị của cha.</span></div>
</div>
<p>Trường hợp 2 làm người mới bất ngờ: <code>p</code> đứng sau mà vẫn thua, vì thứ tự chỉ để phá hoà. Trường hợp 6 cũng vậy: <code>.six</code> nằm trên cha, và luật nhắm trực tiếp vào phần tử luôn thắng giá trị được kế thừa.</p>

<h3>Bước 4 — độ cụ thể là một bảng điểm</h3>
<p>Hãy nghĩ tới ba bộ đếm, viết là <strong>(id, class, thẻ)</strong>. So từ trái sang phải; chỗ khác đầu tiên quyết định.</p>
<table>
<thead><tr><th>Bộ chọn</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td><code>p</code></td><td>(0, 0, 1)</td></tr>
<tr><td><code>article p</code></td><td>(0, 0, 2)</td></tr>
<tr><td><code>.card</code></td><td>(0, 1, 0)</td></tr>
<tr><td><code>.card .title</code></td><td>(0, 2, 0)</td></tr>
<tr><td><code>a:hover</code></td><td>(0, 1, 1): lớp giả tính như class</td></tr>
<tr><td><code>[type="email"]</code></td><td>(0, 1, 0): thuộc tính cũng vậy</td></tr>
<tr><td><code>#top</code></td><td>(1, 0, 0): thắng mọi số lượng class</td></tr>
<tr><td><code>style="…"</code></td><td>Thắng mọi bộ chọn</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — cuộc chiến <code>!important</code>.</strong> Một kiểu không ăn, bạn thêm <code>!important</code>. Được ngay. Tuần sau có người cần ghi đè nó, nên họ thêm một <code>!important</code> cụ thể hơn. Chẳng bao lâu không gì đổi được nếu thiếu thêm một cái nữa, và tệp CSS thành một đống ngoại lệ. Hãy tìm hiểu <em>vì sao</em> luật đó thua. Giữ độ cụ thể thấp và đều: dùng một class (Bài 12.3), để id cho HTML và JavaScript, không cho CSS.</p></div>

<h3>Bước 5 — kế thừa</h3>
<p>Bạn không đặt phông cho từng phần tử. Một số thuộc tính tự truyền xuống con:</p>
${ma('html', CODE['3-1/ke-thua.html'], [5, 12])}
${ra(OUT['3-1/ke-thua'])}
<p>Thuộc tính về chữ được kế thừa: <code>color</code>, <code>font-*</code>, <code>line-height</code>, <code>text-align</code>. Thuộc tính về hộp thì không: <code>border</code>, <code>padding</code>, <code>margin</code>, <code>background</code>, <code>width</code>. Vì thế đặt phông trên <code>body</code> là khởi đầu chuẩn của một tệp CSS.</p>
<p>Hai ngoại lệ xuất hiện ở trên, và chúng bẫy tất cả mọi người. Liên kết vẫn xanh vì bảng định kiểu riêng của trình duyệt nhắm thẳng vào <code>a</code>; còn điều khiển form không kế thừa phông. Hãy sửa có chủ đích: <code>a { color: inherit; }</code> và <code>button, input { font: inherit; }</code>.</p>

<h3>Bước 6 — màu và đơn vị</h3>
${ma('html', CODE['3-1/mau-don-vi.html'], [5, 15])}
${ra(OUT['3-1/mau-don-vi'])}
<div class="kv-grid">
  <div class="kv"><span class="k">#1f4e8c</span><span class="v">Hex: đỏ, lục, lam. Chép từ công cụ thiết kế.</span></div>
  <div class="kv"><span class="k">rgb(31 78 140 / 50%)</span><span class="v">Cùng ba con số, thêm độ trong suốt nếu cần.</span></div>
  <div class="kv"><span class="k">hsl(214 64% 34%)</span><span class="v">Sắc, độ bão hoà, độ sáng: dễ tạo tông nhạt hơn.</span></div>
  <div class="kv"><span class="k">px</span><span class="v">Kích thước cố định. Hợp với viền và chi tiết nhỏ.</span></div>
  <div class="kv"><span class="k">%</span><span class="v">Một phần của cha.</span></div>
  <div class="kv"><span class="k">rem</span><span class="v">Theo cỡ chữ gốc (thường 16px). Tôn trọng thiết lập của người đọc: mặc định tốt nhất cho chữ và khoảng cách.</span></div>
  <div class="kv"><span class="k">em</span><span class="v">Theo cỡ chữ của chính phần tử. Nhân dồn khi lồng nhau.</span></div>
  <div class="kv"><span class="k">vw, vh</span><span class="v">1% bề rộng hoặc chiều cao cửa sổ.</span></div>
</div>

<h3>Bước 7 — CSS hỏng âm thầm</h3>
<p>Như HTML, không có thông báo lỗi nào. Sáu luật, bốn cái sai:</p>
${ma('html', CODE['3-1/loi-css.html'], [5, 10])}
${ra(OUT['3-1/loi-css'])}
<p>Giá trị sai hay thuộc tính sai bị bỏ không một lời, và chỉ mất đúng khai báo đó. Nhưng nhìn <code>.c</code>: thiếu dấu chấm phẩy tạo ra một giá trị dài không hợp lệ, nên <strong>cả hai</strong> khai báo biến mất. Còn <code>.Card</code> không khớp <code>class="card"</code>, vì tên class phân biệt hoa thường. Lưu ý khai báo cuối cùng trong khối có thể bỏ dấu chấm phẩy, như <code>.e</code>; nhưng hãy luôn viết nó, để dòng tiếp theo bạn thêm vào không làm hỏng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — sửa nhầm chỗ suốt một giờ.</strong> Kiểu của bạn "không ăn", nên bạn cứ đổi giá trị. Trước hết hãy hỏi: luật có chạm tới phần tử không? Chuột phải vào phần tử → <strong>Inspect</strong> → <strong>Styles</strong>. Chỉ có bốn trường hợp: (1) không thấy luật: bộ chọn không khớp, hoặc tệp không tải được (xem Network); (2) bị gạch ngang: luật khác đã thắng, nó nằm phía trên; (3) có tam giác cảnh báo vàng: lỗi gõ; (4) nó có tác dụng, nhưng giá trị không như bạn nghĩ (xem Computed).</p></div>

<h3>Bước 8 — tạo kiểu nút, và giữ tiêu điểm nhìn thấy được</h3>
<p>Đây là một nút hoàn chỉnh. Nó gom nhiều thứ lại với nhau:</p>
${ma('html', CODE['3-1/nut-tieu-diem.html'], [6, 18])}
${ra(OUT['3-1/nut-tieu-diem'])}
<p><code>:hover</code> áp dụng khi rê chuột, <code>:active</code> khi đang nhấn, và <code>:focus-visible</code> khi cần hiện tiêu điểm, thứ trình duyệt quyết định cho người dùng bàn phím. Ảnh chụp ở slide 10 cho thấy nút giữa đang có tiêu điểm.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>outline: none</code> mà không thay thế.</strong> Nhà thiết kế thường không thích viền mặc định và gỡ nó trên toàn trang. Người dùng bàn phím liền không biết mình đang ở đâu. Nếu không thích mặc định, hãy thay nó như trên bằng kiểu <code>:focus-visible</code> của bạn, và kiểm bằng cách nhấn Tab.</p></div>

<h3>Một tệp CSS khởi đầu ngắn</h3>
<pre><code class="language-css">*, *::before, *::after { box-sizing: border-box; }   /* Bài 3.2 */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #222;
}
img { max-width: 100%; height: auto; }               /* Bài 3.5 */
button, input, select, textarea { font: inherit; }</code></pre>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — một thẻ hồ sơ, và một xung đột cần giải thích</strong></p>
<ol>
<li>Tạo <code>index.html</code> và <code>style.css</code>, gắn với nhau. Thêm tệp khởi đầu ở trên.</li>
<li>Thêm một thẻ: <code>article class="card"</code> có ảnh, <code>h2</code>, đoạn văn và <code>button class="btn"</code>.</li>
<li>Tạo kiểu chỉ bằng class: màu nền, padding, bo góc, màu tiêu đề, và nút có trạng thái hover và <code>:focus-visible</code>.</li>
<li>Giờ tạo một xung đột: thêm <code>p { color: red; }</code> <em>sau</em> luật <code>.card p { color: #444; }</code> của bạn, và đoán xem cái nào thắng trước khi tải lại.</li>
</ol>
<p>Gợi ý: <code>.card p</code> có điểm (0,1,1) còn <code>p</code> có điểm (0,0,1).</p>
<p><strong>Xong khi:</strong> DevTools → Styles hiện dòng đỏ bị gạch ngang, và bạn nói được vì sao trong một câu; nhấn Tab thấy viền tiêu điểm của riêng bạn; <code>document.querySelectorAll('.btn').length</code> là 1; và không có id nào trong CSS. Sau đó làm module Code Lab 3.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rule</span><span class="v">luật — bộ chọn + khai báo.</span></div>
  <div class="kv"><span class="k">selector</span><span class="v">bộ chọn — chọn phần tử.</span></div>
  <div class="kv"><span class="k">declaration</span><span class="v">khai báo — thuộc tính: giá trị;</span></div>
  <div class="kv"><span class="k">cascade</span><span class="v">thuật toán chọn luật thắng.</span></div>
  <div class="kv"><span class="k">specificity</span><span class="v">độ cụ thể — điểm (id, class, thẻ).</span></div>
  <div class="kv"><span class="k">inheritance</span><span class="v">kế thừa — con nhận giá trị từ cha.</span></div>
  <div class="kv"><span class="k">pseudo-class</span><span class="v">lớp giả — trạng thái, vd :hover.</span></div>
  <div class="kv"><span class="k">pseudo-element</span><span class="v">phần tử giả — một phần, vd ::first-line.</span></div>
  <div class="kv"><span class="k">computed value</span><span class="v">giá trị đã tính — kết quả cuối cùng.</span></div>
  <div class="kv"><span class="k">rem / em</span><span class="v">theo cỡ chữ gốc / theo cỡ chữ hiện tại.</span></div>
  <div class="kv"><span class="k">reset</span><span class="v">vài luật đầu tệp để đưa mặc định về chuẩn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Luật = bộ chọn + khai báo. Giữ CSS trong tệp ngoài.</li>
  <li>Dấu cách = bên trong; <code>&gt;</code> = con trực tiếp; không dấu cách = cùng phần tử; dấu phẩy = hoặc.</li>
  <li>Thắng: mức quan trọng, rồi độ cụ thể (id, class, thẻ), rồi thứ tự. Thứ tự chỉ để phá hoà.</li>
  <li>Thuộc tính chữ kế thừa; thuộc tính hộp thì không; điều khiển form cần <code>font: inherit</code>.</li>
  <li>Ưu tiên <code>rem</code> cho chữ và khoảng cách; <code>%</code> theo cha.</li>
  <li>CSS hỏng âm thầm; thiếu dấu chấm phẩy mất hai khai báo. Tên class phân biệt hoa thường.</li>
  <li>DevTools → Styles có đáp án: không thấy, gạch ngang, cảnh báo, hoặc Computed.</li>
  <li>Đừng bao giờ gỡ tiêu điểm mà không thay thế.</li>
</ul>
${nguon('📗', 'MDN — CSS first steps and building blocks', 'Bộ chọn, cascade và độ cụ thể', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics')}
${nguon('📘', 'web.dev — Learn CSS', 'Khoá miễn phí, đầy đủ từ Google', 'https://web.dev/learn/css')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-cascade', title: 'WED201c (Academy) — Cascade', sub: 'Cùng các luật đó trong đề cương môn học ở trường', cta: 'Mở bài' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-1-styling-va-tailwind', title: 'Next.js 13.1 — styling và Tailwind', sub: 'Vì sao class tiện ích tránh được phần lớn cuộc đấu độ cụ thể', cta: 'Mở bài' })}
</div>
`,
};
