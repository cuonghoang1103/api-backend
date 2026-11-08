/** SDN302 · 4.2 — Templating phía server (CLO8): EJS (<%= %> thoát ký tự, <% %> logic, <%- %> thô), Handlebars ({{#each}}, {{#if}}, helper), res.render từ controller, API-first hay server-rendered, XSS. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const NORM = `const norm = (h) => String(h).replace(/\\s+/g, ' ').replace(/\\s*(<[^>]+>)\\s*/g, '$1').trim();`;
const DATA = `const products = [{ name: 'Clean Code', price: 25 }, { name: 'Pen', price: 2.5 }, { name: '<script>alert(1)</script>', price: 1 }];`;

/* ── 1 ── EJS list */
const E1 = bai({
  ten: 'EJS: render the product list of the lesson', kho: 'EASY', phut: 12, lib: ['views'],
  en: J`<p>Write the template <code>productsEjs</code> (a string, the content of <code>views/products.ejs</code>) so that</p>
<pre>ejs.render(productsEjs, { products })</pre>
<p>produces a <code>&lt;ul class="products"&gt;</code> with one <code>&lt;li&gt;NAME - PRICE&lt;/li&gt;</code> per product, in order. Use <code>&lt;% %&gt;</code> for the loop and <code>&lt;%= %&gt;</code> for the values — <code>&lt;%= %&gt;</code> escapes HTML, so a product called <code>&lt;script&gt;…</code> is shown as text, not executed.</p>
<p>(The grader compares the HTML with whitespace collapsed and the spaces next to tags removed, so indentation and line breaks do not matter.)</p>`,
  vi: J`<p>Viết template <code>productsEjs</code> (một chuỗi, nội dung của <code>views/products.ejs</code>) sao cho</p>
<pre>ejs.render(productsEjs, { products })</pre>
<p>sinh một <code>&lt;ul class="products"&gt;</code> với mỗi sản phẩm một <code>&lt;li&gt;TÊN - GIÁ&lt;/li&gt;</code>, đúng thứ tự. Dùng <code>&lt;% %&gt;</code> cho vòng lặp và <code>&lt;%= %&gt;</code> cho giá trị — <code>&lt;%= %&gt;</code> thoát HTML, nên sản phẩm tên <code>&lt;script&gt;…</code> hiện thành chữ, không chạy.</p>
<p>(Máy chấm so HTML sau khi gộp khoảng trắng và bỏ khoảng trắng sát thẻ, nên thụt lề và xuống dòng không quan trọng.)</p>`,
  yc: [
    ['<code>&lt;% products.forEach(p =&gt; { %&gt; … &lt;% }) %&gt;</code> for the loop.', '<code>&lt;% products.forEach(p =&gt; { %&gt; … &lt;% }) %&gt;</code> cho vòng lặp.'],
    ['<code>&lt;%= p.name %&gt; - &lt;%= p.price %&gt;</code> inside the <code>&lt;li&gt;</code>.', '<code>&lt;%= p.name %&gt; - &lt;%= p.price %&gt;</code> trong <code>&lt;li&gt;</code>.'],
    ['Never <code>&lt;%- %&gt;</code> for data typed by users.', 'Không bao giờ dùng <code>&lt;%- %&gt;</code> cho dữ liệu người dùng gõ.'],
  ],
  viDu: [['ejs.render(productsEjs, { products: [{ name: "Pen", price: 2 }] })', '<ul class="products"><li>Pen - 2</li></ul>', 'One li per product.', 'Mỗi sản phẩm một li.'], ['a product named <script>alert(1)</script>', '<li>&lt;script&gt;alert(1)&lt;/script&gt; - 1</li>', 'Escaped by <%= %>.', 'Đã thoát bởi <%= %>.']],
  goiY: [
    ['The lesson\'s template is almost the answer — add the class on the <code>&lt;ul&gt;</code>.', 'Template của bài gần như là đáp án — thêm class cho <code>&lt;ul&gt;</code>.'],
    ['Template literals in JavaScript use backticks; inside them EJS tags are plain text.', 'Template literal trong JavaScript dùng dấu backtick; bên trong đó thẻ EJS chỉ là chữ thường.'],
  ],
  loi: [
    ['<code>&lt;%- p.name %&gt;</code>: the raw tag inserts the &lt;script&gt; — a stored XSS.', '<code>&lt;%- p.name %&gt;</code>: thẻ thô chèn nguyên &lt;script&gt; — XSS lưu trữ.'],
    ['<code>&lt;% p.name %&gt;</code> (no =): runs the expression and prints nothing.', '<code>&lt;% p.name %&gt;</code> (không có =): chạy biểu thức và không in gì.'],
    ['Building the HTML with string concatenation in JavaScript instead of a template — no escaping at all.', 'Dựng HTML bằng nối chuỗi trong JavaScript thay vì template — không thoát gì cả.'],
  ],
  gt: [
    'EJS is "HTML with JavaScript sprinkled in": <code>&lt;% %&gt;</code> runs code without output (the loop), <code>&lt;%= %&gt;</code> prints a value after escaping <code>&amp; &lt; &gt; " \'</code>. Escaping is what turns the malicious product name into harmless text — the reason the lesson says to use the engine instead of hand-built strings.',
    'EJS là "HTML rắc thêm JavaScript": <code>&lt;% %&gt;</code> chạy mã không in (vòng lặp), <code>&lt;%= %&gt;</code> in giá trị sau khi thoát <code>&amp; &lt; &gt; " \'</code>. Việc thoát biến tên sản phẩm độc hại thành chữ vô hại — lý do bài dặn dùng engine thay vì tự nối chuỗi.',
  ],
  kn: ['EJS', 'escaping'],
  tns: [tn('template engine', 'bộ máy template'), tn('escape', 'thoát ký tự', '< thành &lt;'), tn('XSS', 'chèn script độc')],
  dau: J`const ejs = require('ejs');

const productsEjs = ´
<ul>
  <% products.forEach(p => { %>
    <li><%- p.name %></li>
  <% }) %>
</ul>
´;
`,
  giai: J`const ejs = require('ejs');

// views/products.ejs — <% %> runs logic, <%= %> prints an ESCAPED value
const productsEjs = ´
<ul class="products">
  <% products.forEach(p => { %>
    <li><%= p.name %> - <%= p.price %></li>
  <% }) %>
</ul>
´;
`,
  chuanBi: `${NORM} ${DATA}`,
  cases: [
    { goi: `norm(ejs.render(productsEjs, { products: products.slice(0, 2) }))`, moTa: ['Two products → two li in a ul.products', 'Hai sản phẩm → hai li trong ul.products'] },
    { goi: `norm(ejs.render(productsEjs, { products }))`, moTa: ['A <script> name is escaped', 'Tên <script> được thoát'] },
    { goi: `norm(ejs.render(productsEjs, { products: [] }))`, an: true },
    { goi: `norm(ejs.render(productsEjs, { products: [{ name: 'A & B "quoted"', price: 0 }] }))`, an: true },
  ],
});

/* ── 2 ── EJS conditionals */
const E2 = bai({
  ten: 'EJS with logic: empty state, formatting and the raw tag', kho: 'MEDIUM', phut: 15, lib: ['views'],
  en: J`<p>Improve the page. Template <code>pageEjs</code> rendered with <code>{ title, products, footerHtml }</code>:</p>
<ul><li><code>&lt;h1&gt;</code> with the escaped <code>title</code>;</li>
<li>if there are no products: <code>&lt;p class="empty"&gt;No products yet&lt;/p&gt;</code> and no list;</li>
<li>otherwise a <code>&lt;ul&gt;</code> with <code>&lt;li&gt;NAME — $PRICE&lt;/li&gt;</code>, price with 2 decimals (<code>p.price.toFixed(2)</code>), and the extra class <code>cheap</code> on the <code>li</code> when <code>price &lt; 5</code> (<code>&lt;li class="cheap"&gt;</code>);</li>
<li><code>footerHtml</code> is HTML <b>prepared by the server</b> (trusted) — insert it unescaped with <code>&lt;%- %&gt;</code>.</li></ul>`,
  vi: J`<p>Làm trang tốt hơn. Template <code>pageEjs</code> render với <code>{ title, products, footerHtml }</code>:</p>
<ul><li><code>&lt;h1&gt;</code> với <code>title</code> đã thoát;</li>
<li>không có sản phẩm: <code>&lt;p class="empty"&gt;No products yet&lt;/p&gt;</code> và không có danh sách;</li>
<li>ngược lại một <code>&lt;ul&gt;</code> với <code>&lt;li&gt;TÊN — $GIÁ&lt;/li&gt;</code>, giá 2 chữ số thập phân (<code>p.price.toFixed(2)</code>), và thêm class <code>cheap</code> cho <code>li</code> khi <code>price &lt; 5</code> (<code>&lt;li class="cheap"&gt;</code>);</li>
<li><code>footerHtml</code> là HTML <b>do server chuẩn bị</b> (tin cậy) — chèn không thoát bằng <code>&lt;%- %&gt;</code>.</li></ul>`,
  yc: [
    ['<code>&lt;% if (products.length === 0) { %&gt; … &lt;% } else { %&gt; … &lt;% } %&gt;</code>', '<code>&lt;% if (products.length === 0) { %&gt; … &lt;% } else { %&gt; … &lt;% } %&gt;</code>'],
    ['The separator is an em dash with spaces: <code> — </code>.', 'Dấu ngăn là gạch dài có khoảng trắng: <code> — </code>.'],
    ['Only <code>footerHtml</code> uses the raw tag.', 'Chỉ <code>footerHtml</code> dùng thẻ thô.'],
  ],
  viDu: [['{ title: "Shop", products: [], footerHtml: "<small>© 2026</small>" }', '<h1>Shop</h1><p class="empty">No products yet</p><small>© 2026</small>', 'Empty state.', 'Trạng thái rỗng.'], ['a product { name: "Pen", price: 2.5 }', '<li class="cheap">Pen — $2.50</li>', 'Cheap and formatted.', 'Rẻ và đã định dạng.']],
  goiY: [
    ['<code>&lt;li&lt;%= p.price &lt; 5 ? \' class="cheap"\' : \'\' %&gt;&gt;</code> — hmm, <code>&lt;%= %&gt;</code> escapes the quotes. Use <code>&lt;% if (p.price &lt; 5) { %&gt;&lt;li class="cheap"&gt;&lt;% } else { %&gt;&lt;li&gt;&lt;% } %&gt;</code> or <code>&lt;%- %&gt;</code> for that tiny server-made attribute.', '<code>&lt;li&lt;%= p.price &lt; 5 ? \' class="cheap"\' : \'\' %&gt;&gt;</code> — à, <code>&lt;%= %&gt;</code> thoát mất dấu nháy. Dùng <code>&lt;% if (p.price &lt; 5) { %&gt;&lt;li class="cheap"&gt;&lt;% } else { %&gt;&lt;li&gt;&lt;% } %&gt;</code> hoặc <code>&lt;%- %&gt;</code> cho cái thuộc tính nhỏ do server tạo đó.'],
    ['<code>&lt;%= p.name %&gt; — $&lt;%= p.price.toFixed(2) %&gt;</code>', '<code>&lt;%= p.name %&gt; — $&lt;%= p.price.toFixed(2) %&gt;</code>'],
  ],
  loi: [
    ['<code>&lt;%= footerHtml %&gt;</code>: the footer shows up as visible <code>&amp;lt;small&amp;gt;</code> text.', '<code>&lt;%= footerHtml %&gt;</code>: footer hiện thành chữ <code>&amp;lt;small&amp;gt;</code> nhìn thấy được.'],
    ['<code>&lt;%- p.name %&gt;</code> "because it worked for the footer" — the footer is trusted, product names are not.', '<code>&lt;%- p.name %&gt;</code> "vì footer dùng được" — footer là tin cậy, tên sản phẩm thì không.'],
    ['Formatting with <code>Math.round(p.price * 100) / 100</code>: 2.5 prints as "2.5", not "2.50".', 'Định dạng bằng <code>Math.round(p.price * 100) / 100</code>: 2.5 in ra "2.5", không phải "2.50".'],
  ],
  gt: [
    'Templates hold presentation logic (empty state, a CSS class, number formatting) and the engine handles escaping. The raw tag exists for HTML the SERVER produced (a footer, a pre-rendered snippet) — the moment user input could flow into it, it becomes an XSS hole. The safe default is <code>&lt;%= %&gt;</code> everywhere and <code>&lt;%- %&gt;</code> as a deliberate, reviewed exception.',
    'Template giữ logic trình bày (trạng thái rỗng, một class CSS, định dạng số) còn engine lo thoát ký tự. Thẻ thô tồn tại cho HTML do SERVER sinh (footer, một đoạn render sẵn) — khi dữ liệu người dùng có thể chảy vào nó, nó thành lỗ XSS. Mặc định an toàn là <code>&lt;%= %&gt;</code> ở mọi nơi và <code>&lt;%- %&gt;</code> là ngoại lệ có chủ ý, đã được xem xét.',
  ],
  kn: ['EJS conditionals', 'raw output'],
  tns: [tn('raw output', 'xuất thô', '<%- %> không thoát'), tn('empty state', 'trạng thái rỗng')],
  dau: J`const ejs = require('ejs');

const pageEjs = ´
<h1><%- title %></h1>
<ul>
  <% products.forEach(p => { %>
    <li><%= p.name %> — $<%= p.price %></li>
  <% }) %>
</ul>
<%= footerHtml %>
´;
`,
  giai: J`const ejs = require('ejs');

const pageEjs = ´
<h1><%= title %></h1>
<% if (products.length === 0) { %>
  <p class="empty">No products yet</p>
<% } else { %>
  <ul>
    <% products.forEach(p => { %>
      <% if (p.price < 5) { %><li class="cheap"><% } else { %><li><% } %>
        <%= p.name %> — $<%= p.price.toFixed(2) %>
      </li>
    <% }) %>
  </ul>
<% } %>
<%# footerHtml is built by the server, so the raw tag is allowed HERE only %>
<%- footerHtml %>
´;
`,
  chuanBi: `${NORM} ${DATA} const render = (o) => norm(ejs.render(pageEjs, Object.assign({ title: 'Shop', footerHtml: '<small>© 2026</small>' }, o)));`,
  cases: [
    { goi: `render({ products: [] })`, moTa: ['Empty state + trusted footer', 'Trạng thái rỗng + footer tin cậy'] },
    { goi: `render({ products: products.slice(0, 2) })`, moTa: ['Formatted prices, class cheap under 5', 'Giá đã định dạng, class cheap dưới 5'] },
    { goi: `render({ products, title: '<b>Sale</b>' })`, moTa: ['Title and names are escaped', 'Tiêu đề và tên đã được thoát'] },
    { goi: `render({ products: [{ name: 'Lamp', price: 5 }, { name: 'Clip', price: 4.999 }] })`, an: true },
  ],
});

/* ── 3 ── Handlebars */
const E3 = bai({
  ten: 'Handlebars: logic-less templates with {{#each}}, {{#if}} and a helper', kho: 'MEDIUM', phut: 15, lib: ['views'],
  en: J`<p>Write the same list in Handlebars, the logic-less engine. <code>productsHbs</code> is compiled with <code>Handlebars.compile(productsHbs)(data)</code> where <code>data = { products }</code>:</p>
<ul><li><code>&lt;ul class="products"&gt;</code> with <code>&lt;li&gt;NAME - $PRICE&lt;/li&gt;</code>; the price is formatted by a helper <code>money</code> that you register (<code>Handlebars.registerHelper('money', …)</code>, 2 decimals);</li>
<li>a product with <code>onSale: true</code> gets <code> &lt;em&gt;sale&lt;/em&gt;</code> after the price;</li>
<li>no products ⇒ <code>&lt;p class="empty"&gt;No products yet&lt;/p&gt;</code> instead of the list (use <code>{{else}}</code> of <code>{{#each}}</code>).</li></ul>`,
  vi: J`<p>Viết cùng danh sách bằng Handlebars, engine "ít logic". <code>productsHbs</code> được biên dịch bằng <code>Handlebars.compile(productsHbs)(data)</code> với <code>data = { products }</code>:</p>
<ul><li><code>&lt;ul class="products"&gt;</code> với <code>&lt;li&gt;TÊN - $GIÁ&lt;/li&gt;</code>; giá được định dạng bởi helper <code>money</code> mà bạn đăng ký (<code>Handlebars.registerHelper('money', …)</code>, 2 chữ số thập phân);</li>
<li>sản phẩm có <code>onSale: true</code> có thêm <code> &lt;em&gt;sale&lt;/em&gt;</code> sau giá;</li>
<li>không có sản phẩm ⇒ <code>&lt;p class="empty"&gt;No products yet&lt;/p&gt;</code> thay cho danh sách (dùng <code>{{else}}</code> của <code>{{#each}}</code>).</li></ul>`,
  yc: [
    ['Values with <code>{{this.name}}</code> (escaped), helpers with <code>{{money this.price}}</code>.', 'Giá trị bằng <code>{{this.name}}</code> (đã thoát), helper bằng <code>{{money this.price}}</code>.'],
    ['<code>{{#if this.onSale}} … {{/if}}</code>.', '<code>{{#if this.onSale}} … {{/if}}</code>.'],
    ['Because the <code>&lt;ul&gt;</code> must not appear when the list is empty, put <code>{{#each}}</code> inside it and use an outer <code>{{#if products.length}}</code>, or the <code>{{else}}</code> of each for the empty message.', 'Vì <code>&lt;ul&gt;</code> không được hiện khi danh sách rỗng, đặt <code>{{#each}}</code> bên trong nó và dùng <code>{{#if products.length}}</code> bên ngoài, hoặc <code>{{else}}</code> của each cho thông báo rỗng.'],
  ],
  viDu: [['{ products: [{ name: "Pen", price: 2.5, onSale: true }] }', '<ul class="products"><li>Pen - $2.50 <em>sale</em></li></ul>', 'Helper + if.', 'Helper + if.'], ['{ products: [] }', '<p class="empty">No products yet</p>', 'No empty <ul>.', 'Không có <ul> rỗng.']],
  goiY: [
    ['<code>Handlebars.registerHelper(\'money\', (n) =&gt; n.toFixed(2));</code>', '<code>Handlebars.registerHelper(\'money\', (n) =&gt; n.toFixed(2));</code>'],
    ['<code>{{#if products.length}}&lt;ul class="products"&gt;{{#each products}}…{{/each}}&lt;/ul&gt;{{else}}&lt;p class="empty"&gt;…&lt;/p&gt;{{/if}}</code> — an empty array is falsy in Handlebars.', '<code>{{#if products.length}}&lt;ul class="products"&gt;{{#each products}}…{{/each}}&lt;/ul&gt;{{else}}&lt;p class="empty"&gt;…&lt;/p&gt;{{/if}}</code> — mảng rỗng là falsy trong Handlebars.'],
  ],
  loi: [
    ['Trying <code>{{this.price.toFixed(2)}}</code> — Handlebars cannot call methods; that is what helpers are for.', 'Thử <code>{{this.price.toFixed(2)}}</code> — Handlebars không gọi được phương thức; helper sinh ra để làm việc đó.'],
    ['<code>{{{this.name}}}</code> (triple braces) — raw output, same XSS as <code>&lt;%- %&gt;</code>.', '<code>{{{this.name}}}</code> (ba ngoặc) — xuất thô, cùng lỗi XSS như <code>&lt;%- %&gt;</code>.'],
    ['Registering the helper AFTER rendering — the template then throws "Missing helper".', 'Đăng ký helper SAU khi render — template ném lỗi "Missing helper".'],
  ],
  gt: [
    'Handlebars deliberately has no arbitrary JavaScript: values, blocks (<code>each</code>, <code>if</code>) and named helpers. Formatting moves into a helper (or into the controller), which keeps the template readable and pushes logic to where it can be tested. <code>{{ }}</code> escapes like <code>&lt;%= %&gt;</code>; <code>{{{ }}}</code> is the raw tag.',
    'Handlebars cố ý không có JavaScript tuỳ ý: giá trị, khối (<code>each</code>, <code>if</code>) và helper có tên. Định dạng chuyển vào helper (hoặc vào controller), giữ template dễ đọc và đẩy logic tới nơi kiểm thử được. <code>{{ }}</code> thoát như <code>&lt;%= %&gt;</code>; <code>{{{ }}}</code> là thẻ thô.',
  ],
  kn: ['Handlebars', 'helpers'],
  tns: [tn('logic-less', 'ít logic', 'template không chứa JavaScript tuỳ ý'), tn('helper', 'hàm hỗ trợ của template')],
  dau: J`const Handlebars = require('handlebars');

const productsHbs = ´
<ul class="products">
  {{#each products}}
    <li>{{{this.name}}} - {{this.price}}</li>
  {{/each}}
</ul>
´;
`,
  giai: J`const Handlebars = require('handlebars');

// formatting lives in a helper — templates cannot call methods
Handlebars.registerHelper('money', (n) => Number(n).toFixed(2));

const productsHbs = ´
{{#if products.length}}
  <ul class="products">
    {{#each products}}
      <li>{{this.name}} - \@{{money this.price}}{{#if this.onSale}} <em>sale</em>{{/if}}</li>
    {{/each}}
  </ul>
{{else}}
  <p class="empty">No products yet</p>
{{/if}}
´;
`,
  chuanBi: `${NORM} ${DATA} const render = (d) => norm(Handlebars.compile(productsHbs)(d));`,
  cases: [
    { goi: `render({ products: [{ name: 'Pen', price: 2.5, onSale: true }, { name: 'Clean Code', price: 25 }] })`, moTa: ['money helper + sale marker', 'helper money + dấu sale'] },
    { goi: `render({ products: [] })`, moTa: ['Empty list → empty message, no <ul>', 'Danh sách rỗng → thông báo rỗng, không có <ul>'] },
    { goi: `render({ products })`, moTa: ['Names are escaped by {{ }}', 'Tên được thoát bởi {{ }}'] },
    { goi: `render({ products: [{ name: 'Lamp', price: 40, onSale: false }] })`, an: true },
  ],
});

/* ── 4 ── res.render */
const E4 = bai({
  ten: 'Controller + view: res.render() with a prepared view model', kho: 'HARD', phut: 25, lib: ['mongoose', 'express', 'views'],
  en: J`<p>One server, two outputs from the same service: <code>GET /api/products</code> returns JSON for React, <code>GET /admin/products</code> renders an HTML page for the admin (server-rendered). Handlebars is logic-less, so the <b>controller prepares the data</b>:</p>
<pre>res.render('products', {
  title: 'Products (3)',            // count in the title
  products: [{ name, priceText: '$2.50', lowStock: true }, …]   // sorted by name
})</pre>
<p><code>lowStock</code> is <code>stock &lt; 5</code>. The template <code>views.products</code> shows <code>&lt;h1&gt;{{title}}&lt;/h1&gt;</code> and a <code>&lt;table&gt;</code> with one <code>&lt;tr&gt;</code> per product: <code>&lt;td&gt;NAME&lt;/td&gt;&lt;td&gt;PRICE&lt;/td&gt;</code>, the row having <code>class="low"</code> when <code>lowStock</code>. In this practice, views are registered as strings: <code>app.set('views', { products: '…' })</code> with <code>app.set('view engine', 'hbs')</code>.</p>`,
  vi: J`<p>Một server, hai đầu ra từ cùng một service: <code>GET /api/products</code> trả JSON cho React, <code>GET /admin/products</code> render trang HTML cho admin (server-rendered). Handlebars ít logic nên <b>controller chuẩn bị dữ liệu</b>:</p>
<pre>res.render('products', {
  title: 'Products (3)',            // số lượng trong tiêu đề
  products: [{ name, priceText: '$2.50', lowStock: true }, …]   // sắp theo tên
})</pre>
<p><code>lowStock</code> là <code>stock &lt; 5</code>. Template <code>views.products</code> hiện <code>&lt;h1&gt;{{title}}&lt;/h1&gt;</code> và một <code>&lt;table&gt;</code> mỗi sản phẩm một <code>&lt;tr&gt;</code>: <code>&lt;td&gt;TÊN&lt;/td&gt;&lt;td&gt;GIÁ&lt;/td&gt;</code>, hàng có <code>class="low"</code> khi <code>lowStock</code>. Trong bài luyện này, view đăng ký dạng chuỗi: <code>app.set('views', { products: '…' })</code> với <code>app.set('view engine', 'hbs')</code>.</p>`,
  yc: [
    ['Both routes call the same <code>listProducts()</code> service (sorted by name).', 'Cả hai route gọi cùng service <code>listProducts()</code> (sắp theo tên).'],
    ['The view model contains only display-ready fields — no raw Mongoose documents in the template.', 'View model chỉ chứa field đã sẵn để hiển thị — không đưa document Mongoose thô vào template.'],
    ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>'],
  ],
  viDu: [['GET /admin/products', '200 text/html  <h1>Products (3)</h1><table><tr class="low"><td>Lamp</td><td>$40.00</td></tr>…', 'Server-rendered for the admin.', 'Render ở server cho admin.'], ['GET /api/products', '200 application/json  [{ name, price, stock, … }]', 'The same data for React.', 'Cùng dữ liệu cho React.']],
  goiY: [
    ['<code>const products = (await listProducts()).map((p) =&gt; ({ name: p.name, priceText: \'$\' + p.price.toFixed(2), lowStock: p.stock &lt; 5 }));</code>', '<code>const products = (await listProducts()).map((p) =&gt; ({ name: p.name, priceText: \'$\' + p.price.toFixed(2), lowStock: p.stock &lt; 5 }));</code>'],
    ['Row: <code>&lt;tr{{#if lowStock}} class="low"{{/if}}&gt;</code>', 'Hàng: <code>&lt;tr{{#if lowStock}} class="low"{{/if}}&gt;</code>'],
  ],
  loi: [
    ['Formatting inside the template — Handlebars cannot, so you end up registering helpers for every little thing.', 'Định dạng trong template — Handlebars không làm được, rồi bạn phải đăng ký helper cho từng thứ nhỏ.'],
    ['Writing two different queries for the API and the page — they drift apart (one sorted, one not).', 'Viết hai truy vấn khác nhau cho API và trang — chúng lệch nhau dần (một cái có sắp, một cái không).'],
    ['<code>res.render(\'products.ejs\', …)</code> with the hbs engine — use the view name without extension.', '<code>res.render(\'products.ejs\', …)</code> với engine hbs — dùng tên view không có đuôi.'],
  ],
  gt: [
    'The ★ note of the lesson in code: a React app wants JSON (API-first), an admin page or an email can be rendered by the server. Both read the same service; only the last step differs. Preparing a view model in the controller is what "logic-less" templates expect, and it keeps formatting rules testable in plain JavaScript.',
    'Ghi chú ★ của bài thành mã: app React cần JSON (API-first), trang admin hay email có thể render ở server. Cả hai đọc cùng một service; chỉ bước cuối khác nhau. Chuẩn bị view model ở controller là điều template "ít logic" mong đợi, và giữ luật định dạng kiểm thử được bằng JavaScript thường.',
  ],
  kn: ['res.render', 'view model', 'server-side rendering'],
  tns: [tn('view model', 'mô hình hiển thị', 'dữ liệu đã chuẩn bị cho view'), tn('server-rendered', 'render ở server')],
  dau: J`const express = require('express');
const mongoose = require('mongoose');
const Product = mongoose.model('Product', new mongoose.Schema({ name: String, price: Number, stock: Number }));

const listProducts = () => Product.find();

const app = express();
app.set('view engine', 'hbs');
app.set('views', {
  products: ´<h1>{{title}}</h1><table>{{#each products}}<tr><td>{{name}}</td><td>{{price}}</td></tr>{{/each}}</table>´,
});

app.get('/api/products', async (req, res) => res.json(await listProducts()));
app.get('/admin/products', async (req, res) => {
  res.render('products', { title: 'Products', products: await listProducts() });
});

module.exports = app;
`,
  giai: J`const express = require('express');
const mongoose = require('mongoose');
const Product = mongoose.model('Product', new mongoose.Schema({ name: String, price: Number, stock: Number }));

// ONE service for both outputs
const listProducts = () => Product.find().sort({ name: 1 });

const app = express();
app.set('view engine', 'hbs');
app.set('views', {
  // views/products.hbs — logic-less: it only shows what the controller prepared
  products: ´<h1>{{title}}</h1>
<table>
  {{#each products}}
    <tr{{#if lowStock}} class="low"{{/if}}><td>{{name}}</td><td>{{priceText}}</td></tr>
  {{/each}}
</table>´,
});

// API-first: JSON for React
app.get('/api/products', async (req, res, next) => {
  try { res.json(await listProducts()); } catch (e) { next(e); }
});

// server-rendered: the controller builds a display-ready VIEW MODEL
app.get('/admin/products', async (req, res, next) => {
  try {
    const list = await listProducts();
    const products = list.map((p) => ({
      name: p.name,
      priceText: '$' + p.price.toFixed(2),
      lowStock: p.stock < 5,
    }));
    res.render('products', { title: ´Products (@{products.length})´, products });
  } catch (e) { next(e); }
});

module.exports = app;
`,
  chuanBi: `${NORM} const P = mongoose.model('Product'); await P.create({ name: 'Pen', price: 2.5, stock: 100 }); await P.create({ name: 'Lamp', price: 40, stock: 2 }); await P.create({ name: 'Clean Code', price: 25, stock: 7 });
const page = async () => { const r = await module.exports.inject({ url: '/admin/products' }); return { status: r.status, type: r.headers['content-type'], html: norm(r.body) }; };`,
  cases: [
    { goi: `await page()`, moTa: ['The admin page: count in title, sorted, formatted, low-stock row', 'Trang admin: số lượng ở tiêu đề, có sắp, đã định dạng, hàng sắp hết hàng'] },
    { goi: `(await module.exports.inject({ url: '/api/products' })).body.map((p) => p.name)`, moTa: ['The JSON API uses the same sorted service', 'API JSON dùng cùng service có sắp'] },
    { goi: `(await P.create({ name: '<b>Glue</b>', price: 1, stock: 0 }), await page())`, an: true },
    { goi: `(await P.deleteMany({}), await page())`, an: true },
  ],
});

/* ── 5 ── choice */
const E5 = cs({
  ten: 'API-first or server-rendered? EJS vs Handlebars? XSS?', kho: 'EASY', phut: 8,
  en: 'The decisions behind templating, from the lesson and its ★ note.',
  vi: 'Những quyết định đằng sau templating, từ bài học và ghi chú ★.',
  cau: [
    q('t1', ['Your SDN302 project has a React front-end. What should <code>GET /api/products</code> return?', 'Dự án SDN302 của bạn có front-end React. <code>GET /api/products</code> nên trả gì?'],
      ['JSON — React renders it; no templating on this route', 'An EJS page that React then parses', 'Handlebars HTML, because it is logic-less', 'Both HTML and JSON in one response'],
      ['A client-rendered app wants data. Server templates are for pages the server owns (admin, emails, SEO pages).', 'App render ở client cần dữ liệu. Template phía server dành cho trang server làm chủ (admin, email, trang SEO).']),
    q('t2', ['Which EJS tag prints a value AFTER escaping HTML?', 'Thẻ EJS nào in giá trị SAU KHI thoát HTML?'],
      ['<code>&lt;%= value %&gt;</code>', '<code>&lt;%- value %&gt;</code>', '<code>&lt;% value %&gt;</code>', '<code>&lt;%# value %&gt;</code>'],
      ['<code>&lt;%-</code> is raw, <code>&lt;%</code> runs code without output, <code>&lt;%#</code> is a comment.', '<code>&lt;%-</code> là thô, <code>&lt;%</code> chạy mã không in, <code>&lt;%#</code> là chú thích.']),
    q('t3', ['A comment typed by a user is <code>&lt;img src=x onerror="steal()"&gt;</code>. Which rendering is safe?', 'Một bình luận người dùng gõ là <code>&lt;img src=x onerror="steal()"&gt;</code>. Cách render nào an toàn?'],
      ['<code>{{comment.text}}</code> in Handlebars', '<code>{{{comment.text}}}</code> in Handlebars', '<code>&lt;%- comment.text %&gt;</code> in EJS', '<code>res.send(\'&lt;p&gt;\' + comment.text + \'&lt;/p&gt;\')</code>'],
      ['Double braces escape; triple braces, the EJS raw tag and string concatenation all inject the HTML (stored XSS).', 'Hai ngoặc thì thoát; ba ngoặc, thẻ thô EJS và nối chuỗi đều chèn nguyên HTML (XSS lưu trữ).']),
    q('t4', ['Why does Handlebars refuse <code>{{price.toFixed(2)}}</code>?', 'Vì sao Handlebars từ chối <code>{{price.toFixed(2)}}</code>?'],
      ['It is logic-less by design: prepare data in the controller or register a helper', 'Because toFixed is not available on the server', 'Because Handlebars only supports strings', 'It does not — it prints 2 decimals'],
      ['Pushing logic out of templates is the cleaner separation the lesson mentions.', 'Đẩy logic ra khỏi template là sự tách bạch gọn gàng hơn mà bài nhắc tới.']),
    qn('t5', ['Good uses of server-side templating? (choose all)', 'Dùng templating phía server hợp lý? (chọn hết)'],
      ['A transactional email ("your order is confirmed")', 'An internal admin dashboard served by the API itself', 'An SEO-critical public product page', 'The JSON endpoint a React app calls', 'A REST endpoint for a mobile app'],
      [0, 1, 2],
      ['JSON consumers (React, mobile) do not want HTML.', 'Bên dùng JSON (React, mobile) không cần HTML.']),
  ],
  goiY: [['Who renders: the browser app or the server?', 'Ai render: app trên trình duyệt hay server?'], ['= escapes, - does not.', '= thì thoát, - thì không.']],
  loi: [['Using raw tags for user data.', 'Dùng thẻ thô cho dữ liệu người dùng.'], ['Templating a JSON API.', 'Dùng template cho API JSON.']],
  tns: [tn('API-first', 'API trước', 'server trả dữ liệu, client render'), tn('SSR', 'render ở server')],
  kn: ['templating'],
});

export default doiDau({
  slug: 'sdn302-4-2-templating',
  ten: '4.2 Server-side templating with EJS & Handlebars',
  khoa: KHOA,
  baiHoc: 'sdn302-4-2-templating',
  de: [E1, E5, E2, E3, E4],
});
