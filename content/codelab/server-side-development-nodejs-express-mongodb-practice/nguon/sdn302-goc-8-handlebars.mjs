/** SDN302 · Slot 8 (slide gốc) — Handlebars: helper + #if/#each của slide 9–10 (helper "capitalize" viết ĐÚNG nghĩa), và câu hỏi về layout,
 *  {{ }} và {{{ }}}, hook helperMissing — đối chiếu handlebars 4.7 + express-handlebars 7 chạy thật (09/11/2026). */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const NORM = `const norm = (h) => String(h).replace(/\\s+/g, ' ').replace(/\\s*(<[^>]+>)\\s*/g, '$1').trim();`;

const E1 = bai({
  ten: 'A real capitalize helper, #if and #each (slides 9–10)', kho: 'MEDIUM', phut: 15, lib: ['views'],
  en: J`<p>On slide 9 the helper called <code>capitalize</code> uses <code>toUpperCase()</code>, so "Hello, World!" becomes "HELLO, WORLD!". Write it properly and a template that uses it:</p>
<ol><li>Register a helper <code>capitalize</code>: first letter upper-case, the rest unchanged (<code>"hello world"</code> → <code>"Hello world"</code>; empty or missing → <code>""</code>).</li>
<li><code>homeHbs</code>: <code>&lt;h1&gt;{{capitalize title}}&lt;/h1&gt;</code>, then <code>&lt;p&gt;Welcome, admin!&lt;/p&gt;</code> if <code>isAdmin</code> else <code>&lt;p&gt;Welcome, user!&lt;/p&gt;</code>, then <code>&lt;ul&gt;</code> with one <code>&lt;li&gt;{{this}}&lt;/li&gt;</code> per item of <code>items</code>.</li></ol>
<p>Export <code>render(data)</code> = <code>Handlebars.compile(homeHbs)(data)</code>.</p>`,
  vi: J`<p>Ở slide 9, helper tên <code>capitalize</code> lại dùng <code>toUpperCase()</code>, nên "Hello, World!" thành "HELLO, WORLD!". Viết lại cho đúng và một template dùng nó:</p>
<ol><li>Đăng ký helper <code>capitalize</code>: viết hoa chữ cái đầu, phần còn lại giữ nguyên (<code>"hello world"</code> → <code>"Hello world"</code>; rỗng hoặc không có → <code>""</code>).</li>
<li><code>homeHbs</code>: <code>&lt;h1&gt;{{capitalize title}}&lt;/h1&gt;</code>, rồi <code>&lt;p&gt;Welcome, admin!&lt;/p&gt;</code> nếu <code>isAdmin</code>, không thì <code>&lt;p&gt;Welcome, user!&lt;/p&gt;</code>, rồi <code>&lt;ul&gt;</code> với mỗi phần tử của <code>items</code> một <code>&lt;li&gt;{{this}}&lt;/li&gt;</code>.</li></ol>
<p>Export <code>render(data)</code> = <code>Handlebars.compile(homeHbs)(data)</code>.</p>`,
  yc: [['<code>Handlebars.registerHelper(\'capitalize\', (text) =&gt; …)</code>.', '<code>Handlebars.registerHelper(\'capitalize\', (text) =&gt; …)</code>.'], ['<code>{{#if isAdmin}} … {{else}} … {{/if}}</code> and <code>{{#each items}} … {{/each}}</code>.', '<code>{{#if isAdmin}} … {{else}} … {{/if}}</code> và <code>{{#each items}} … {{/each}}</code>.']],
  viDu: [['render({ title: "hello, world!", isAdmin: true, items: ["Item1", "Item2"] })', '<h1>Hello, world!</h1><p>Welcome, admin!</p><ul><li>Item1</li><li>Item2</li></ul>', 'Only the first letter is upper-cased.', 'Chỉ chữ cái đầu được viết hoa.']],
  goiY: [['<code>text.charAt(0).toUpperCase() + text.slice(1)</code>.', '<code>text.charAt(0).toUpperCase() + text.slice(1)</code>.'], ['Inside <code>{{#each}}</code>, <code>{{this}}</code> is the current item.', 'Trong <code>{{#each}}</code>, <code>{{this}}</code> là phần tử hiện tại.']],
  loi: [['<code>toUpperCase()</code> on the whole string — the bug of the slide.', '<code>toUpperCase()</code> cả chuỗi — đúng lỗi của slide.'], ['<code>{{#if isAdmin == true}}</code>: Handlebars has no comparison inside if.', '<code>{{#if isAdmin == true}}</code>: Handlebars không có phép so sánh trong if.']],
  gt: ['A helper moves logic out of the template (Handlebars is logic-less); the template only calls it by name with its argument after a space. <code>#if</code> tests truthiness only, <code>#each</code> loops with <code>this</code>.', 'Helper đưa logic ra khỏi template (Handlebars không chứa logic); template chỉ gọi nó theo tên, đối số đặt sau dấu cách. <code>#if</code> chỉ xét đúng/sai, <code>#each</code> lặp với <code>this</code>.'],
  kn: ['Handlebars helper'],
  tns: [tn('helper', 'hàm trợ giúp của template'), tn('logic-less', 'không chứa logic')],
  dau: J`const Handlebars = require('handlebars');

Handlebars.registerHelper('capitalize', (text) => text.toUpperCase());

const homeHbs = ´<h1>{{capitalize title}}</h1><ul>{{#each items}}<li>{{this}}</li>{{/each}}</ul>´;

const render = (data) => Handlebars.compile(homeHbs)(data);
module.exports = { render };
`,
  giai: J`const Handlebars = require('handlebars');

// a REAL capitalize: first letter only
Handlebars.registerHelper('capitalize', (text) => {
  if (!text) return '';
  const s = String(text);
  return s.charAt(0).toUpperCase() + s.slice(1);
});

const homeHbs = ´
<h1>{{capitalize title}}</h1>
{{#if isAdmin}}
  <p>Welcome, admin!</p>
{{else}}
  <p>Welcome, user!</p>
{{/if}}
<ul>
  {{#each items}}
    <li>{{this}}</li>
  {{/each}}
</ul>
´;

const render = (data) => Handlebars.compile(homeHbs)(data);
module.exports = { render };
`,
  chuanBi: NORM,
  cases: [
    { goi: `norm(module.exports.render({ title: 'hello, world!', isAdmin: true, items: ['Item1', 'Item2'] }))`, moTa: ['Admin, two items', 'Admin, hai phần tử'] },
    { goi: `norm(module.exports.render({ title: 'news', isAdmin: false, items: [] }))`, moTa: ['Not admin, empty list', 'Không phải admin, danh sách rỗng'] },
    { goi: `norm(module.exports.render({ isAdmin: false, items: ['<b>x</b>'] }))`, an: true },
  ],
});

const E2 = cs({
  ten: 'Handlebars and express-handlebars, checked for real', kho: 'EASY', phut: 8,
  en: 'Questions on slides 6–13 of Slot 8.', vi: 'Câu hỏi về slide 6–13 của Slot 8.',
  cau: [
    q('h1', ['<code>{{x}}</code> vs <code>{{{x}}}</code> with <code>x = "&lt;b&gt;hi&lt;/b&gt;"</code>:', '<code>{{x}}</code> và <code>{{{x}}}</code> với <code>x = "&lt;b&gt;hi&lt;/b&gt;"</code>:'], ['{{x}} shows the tags as text, {{{x}}} renders bold "hi"', '{{x}} renders bold "hi", {{{x}}} shows the tags as text', 'both show the tags as text, escaped the same way', '{{{x}}} is a syntax error and the page fails'], ['Two braces escape, three print raw HTML.', 'Hai ngoặc thì thoát, ba ngoặc in HTML thô.']),
    q('h2', ['With <code>app.engine(\'handlebars\', exphbs.engine())</code> and no layout file, rendering a view gives…', 'Với <code>app.engine(\'handlebars\', exphbs.engine())</code> và không có tệp layout, render một view sẽ…'], ['500 — ENOENT … views/layouts/main.handlebars', 'the view without a layout', 'an empty page with 200', '404'], ['The default layout is main; checked with express-handlebars 7.', 'Layout mặc định là main; đã kiểm với express-handlebars 7.']),
    q('h3', ['Where does the view go inside a layout file?', 'View được đặt vào đâu trong tệp layout?'], ['{{{body}}}', '{{body}}', '{{> body}}', '&lt;%- body %&gt;'], ['Triple braces: the view is already HTML.', 'Ba ngoặc: view đã là HTML.']),
    q('h4', ['With the helperMissing hook of slide 12, <code>{{foo 2 true}}</code> renders…', 'Với hook helperMissing của slide 12, <code>{{foo 2 true}}</code> render ra…'], ['Missing: foo(2,true)', 'Missing: foo', 'an empty string', 'an error'], ['Real run matches the slide: Missing: foo(2,true).', 'Chạy thật khớp slide: Missing: foo(2,true).']),
    q('h5', ['How do you include the partial <code>views/partials/item.handlebars</code>?', 'Chèn partial <code>views/partials/item.handlebars</code> bằng cách nào?'], ['{{> item}}', '{{#item}}', '{{include item}}', '&lt;%- include(\'item\') %&gt;'], ['The &gt; sign is the partial call; partialsDir tells express-handlebars where to look.', 'Dấu &gt; là lời gọi partial; partialsDir cho express-handlebars biết tìm ở đâu.']),
  ],
  goiY: [['Layouts wrap views; partials are pieces inside views.', 'Layout bọc view; partial là mẩu bên trong view.'], ['Count the braces.', 'Đếm số ngoặc.']],
  loi: [['Using {{body}} in a layout: the whole page shows as escaped text.', 'Dùng {{body}} trong layout: cả trang hiện thành chữ đã thoát.'], ['Forgetting the layouts folder.', 'Quên thư mục layouts.']],
  kn: ['Handlebars'],
});

export default doiDau({
  slug: 'sdn302-goc-8-handlebars',
  ten: 'Slot 8 Handlebars (official slides)',
  khoa: KHOA,
  baiHoc: 'sdn302-goc-8-handlebars',
  de: [E2, E1],
});
