/** SDN302 · Slot 7 (slide gốc) — EJS: template danh sách bài viết của slide 15–17 (thoát ký tự, src có nháy, trạng thái rỗng, thẻ chú thích),
 *  và câu hỏi về bảng thẻ + EJS và JSX — đối chiếu ejs 3 thật (09/11/2026). */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const NORM = `const norm = (h) => String(h).replace(/\\s+/g, ' ').replace(/\\s*(<[^>]+>)\\s*/g, '$1').trim();`;
const DATA = `const articles = [
  { id: 1, title: 'Exploring the Hidden Gems of Paris', date: '2023-06-02', video: 'https://www.youtube.com/embed/hLluNp5xlJE' },
  { id: 2, title: 'Tom & Jerry <b>forever</b>', date: '2023-06-03', video: 'https://www.youtube.com/embed/7R6oAzie4Lc' }];`;

const E1 = bai({
  ten: 'The articles page of slide 17, done right', kho: 'MEDIUM', phut: 15, lib: ['views'],
  en: J`<p>Write <code>articlesEjs</code> (the content of <code>views/articles.ejs</code>) so that <code>ejs.render(articlesEjs, { articles })</code> produces:</p>
<pre>&lt;h1&gt;News&lt;/h1&gt;
&lt;ul&gt;
  &lt;li&gt;&lt;h2&gt;TITLE&lt;/h2&gt;&lt;p&gt;Date: DATE&lt;/p&gt;&lt;iframe src="VIDEO"&gt;&lt;/iframe&gt;&lt;/li&gt;   (one per article)
&lt;/ul&gt;</pre>
<p>and, when the array is empty, <code>&lt;h1&gt;News&lt;/h1&gt;&lt;p&gt;No articles yet&lt;/p&gt;</code> instead of the list. Every value must be <b>escaped</b>, and the <code>src</code> attribute must be in double quotes (the slide left them out). A line <code>&lt;%# … %&gt;</code> comment is allowed — it prints nothing.</p>`,
  vi: J`<p>Viết <code>articlesEjs</code> (nội dung của <code>views/articles.ejs</code>) sao cho <code>ejs.render(articlesEjs, { articles })</code> sinh ra:</p>
<pre>&lt;h1&gt;News&lt;/h1&gt;
&lt;ul&gt;
  &lt;li&gt;&lt;h2&gt;TITLE&lt;/h2&gt;&lt;p&gt;Date: DATE&lt;/p&gt;&lt;iframe src="VIDEO"&gt;&lt;/iframe&gt;&lt;/li&gt;   (mỗi bài một li)
&lt;/ul&gt;</pre>
<p>và khi mảng rỗng thì là <code>&lt;h1&gt;News&lt;/h1&gt;&lt;p&gt;No articles yet&lt;/p&gt;</code> thay cho danh sách. Mọi giá trị phải được <b>thoát</b>, và thuộc tính <code>src</code> phải nằm trong nháy kép (slide bỏ quên). Được phép có dòng chú thích <code>&lt;%# … %&gt;</code> — nó không in gì.</p>`,
  yc: [['<code>&lt;% if (…) { %&gt; … &lt;% } else { %&gt; … &lt;% } %&gt;</code> for the empty state.', '<code>&lt;% if (…) { %&gt; … &lt;% } else { %&gt; … &lt;% } %&gt;</code> cho trạng thái rỗng.'], ['<code>&lt;%= %&gt;</code> for every value, including the URL.', '<code>&lt;%= %&gt;</code> cho mọi giá trị, kể cả URL.']],
  viDu: [['a title "Tom & Jerry <b>forever</b>"', '<h2>Tom &amp; Jerry &lt;b&gt;forever&lt;/b&gt;</h2>', 'Escaped, shown as text.', 'Đã thoát, hiện thành chữ.']],
  goiY: [['Start from the template of slide 17 and fix the two problems.', 'Bắt đầu từ template của slide 17 rồi sửa hai chỗ.'], ['<code>articles.length === 0</code> decides which branch to print.', '<code>articles.length === 0</code> quyết định in nhánh nào.']],
  loi: [['<code>&lt;%- article.title %&gt;</code>: the &lt;b&gt; of the title becomes real HTML.', '<code>&lt;%- article.title %&gt;</code>: thẻ &lt;b&gt; trong tiêu đề thành HTML thật.'], ['An empty <code>&lt;ul&gt;&lt;/ul&gt;</code> left on the page when there are no articles.', 'Để lại <code>&lt;ul&gt;&lt;/ul&gt;</code> rỗng khi không có bài nào.']],
  gt: ['<code>&lt;% %&gt;</code> runs the if and the loop, <code>&lt;%= %&gt;</code> prints escaped values (so <code>&amp;</code> becomes <code>&amp;amp;</code> and tags become text), <code>&lt;%# %&gt;</code> is a comment. Quoting attributes keeps a value with spaces or quotes from breaking out of the attribute.', '<code>&lt;% %&gt;</code> chạy if và vòng lặp, <code>&lt;%= %&gt;</code> in giá trị đã thoát (nên <code>&amp;</code> thành <code>&amp;amp;</code> và thẻ thành chữ), <code>&lt;%# %&gt;</code> là chú thích. Đặt thuộc tính trong nháy giúp giá trị có khoảng trắng hay dấu nháy không "thoát" ra khỏi thuộc tính.'],
  kn: ['EJS', 'escaping'],
  tns: [tn('scriptlet', 'thẻ chạy code', '<% %>'), tn('escape', 'thoát ký tự')],
  dau: J`const ejs = require('ejs');

const articlesEjs = ´
<h1>News</h1>
<ul>
  <% articles.forEach(article => { %>
    <li><h2><%- article.title %></h2><p>Date: <%= article.date %></p><iframe src=<%= article.video %>></iframe></li>
  <% }) %>
</ul>
´;
`,
  giai: J`const ejs = require('ejs');

// views/articles.ejs
const articlesEjs = ´
<h1>News</h1>
<%# empty state first, then the list %>
<% if (articles.length === 0) { %>
  <p>No articles yet</p>
<% } else { %>
  <ul>
    <% articles.forEach(article => { %>
      <li><h2><%= article.title %></h2><p>Date: <%= article.date %></p><iframe src="<%= article.video %>"></iframe></li>
    <% }) %>
  </ul>
<% } %>
´;
`,
  chuanBi: `${NORM} ${DATA}`,
  cases: [
    { goi: `norm(ejs.render(articlesEjs, { articles: articles.slice(0, 1) }))`, moTa: ['One article → one li, src in quotes', 'Một bài → một li, src có nháy'] },
    { goi: `norm(ejs.render(articlesEjs, { articles: [] }))`, moTa: ['No articles → "No articles yet"', 'Không có bài → "No articles yet"'] },
    { goi: `norm(ejs.render(articlesEjs, { articles }))`, an: true },
  ],
});

const E2 = cs({
  ten: 'EJS tags and EJS vs JSX', kho: 'EASY', phut: 8,
  en: 'Questions on slides 5, 6, 11 and 12 of Slot 7.', vi: 'Câu hỏi về slide 5, 6, 11 và 12 của Slot 7.',
  cau: [
    q('e1', ['Which tag prints a value <b>escaped</b>?', 'Thẻ nào in giá trị <b>có thoát</b>?'], ['&lt;%= %&gt;', '&lt;%- %&gt;', '&lt;% %&gt;', '&lt;%# %&gt;'], ['= escapes, - prints raw HTML, plain runs code, # is a comment.', '= thoát, - in HTML thô, không dấu thì chạy code, # là chú thích.']),
    q('e2', ['Where does EJS turn the template into HTML?', 'EJS biến template thành HTML ở đâu?'], ['On the server, before the response is sent', 'In the browser after the page loads', 'In MongoDB', 'In the build step, like JSX'], ['The slide says "client side" — wrong for EJS; View page source shows finished HTML.', 'Slide ghi "client side" — sai với EJS; View page source cho thấy HTML đã hoàn chỉnh.']),
    q('e3', ['A template uses <code>&lt;%= user %&gt;</code> but <code>res.render(\'page\', {})</code> passes no <code>user</code>. Result?', 'Template dùng <code>&lt;%= user %&gt;</code> nhưng <code>res.render(\'page\', {})</code> không truyền <code>user</code>. Kết quả?'], ['Rendering fails: "user is not defined"', 'An empty string is printed', 'The word undefined is printed', 'EJS asks the browser for the value'], ['Checked with real ejs: ReferenceError "… is not defined".', 'Đã kiểm với ejs thật: ReferenceError "… is not defined".']),
    qn('e4', ['True about EJS vs JSX? (choose all)', 'Đúng về EJS và JSX? (chọn hết)'], ['EJS uses &lt;% %&gt;, JSX uses { }', 'JSX needs a build step (Babel / Vite)', 'EJS reuse is by includes/partials, JSX by components', 'EJS runs in the browser like React'], [0, 1, 2], ['Only the last statement is false.', 'Chỉ câu cuối sai.']),
  ],
  goiY: [['Re-read the tag table of slide 11.', 'Đọc lại bảng thẻ ở slide 11.'], ['Server-side rendering = HTML is built before it leaves the server.', 'Render phía server = HTML được dựng trước khi rời server.']],
  loi: [['Confusing &lt;%= and &lt;%-.', 'Nhầm &lt;%= với &lt;%-.'], ['Believing EJS runs in the browser.', 'Tin rằng EJS chạy trên trình duyệt.']],
  kn: ['EJS'],
});

export default doiDau({
  slug: 'sdn302-goc-7-ejs',
  ten: 'Slot 7 EJS (official slides)',
  khoa: KHOA,
  baiHoc: 'sdn302-goc-7-ejs',
  de: [E2, E1],
});
