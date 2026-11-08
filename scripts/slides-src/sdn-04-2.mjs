/**
 * sdn-04-2 — SDN302 · Chapter 4 · Lesson 4.2 "Server-side templating with EJS & Handlebars" (slide EN, kiểu FU, đợt 5 — 01/11/2026). Tập sdn-4-2.
 * Nguồn: content/academy/SDN302.mjs › sdn302-4-2-templating. Phủ: khi nào server render HTML (admin, email, SEO) · EJS: view engine, res.render, <%= %> (escape) /
 * <% %> (logic) · Handlebars: {{ }}, {{#each}}, ít logic ⇒ chuẩn bị dữ liệu ở controller · ★ API-first vs server-rendered · không nối chuỗi HTML (XSS).
 * BỔ SUNG: <%- %> raw + include partial · ejs.render từng thẻ (thật) · biến thiếu ⇒ ReferenceError (thật) · XSS chạy thật trên Chromium headless (alert chạy ở trang
 * <%- %>, không chạy ở <%= %>) · cùng dữ liệu dạng JSON · express-handlebars 9.0.4 + document Mongoose ⇒ ô trống + cảnh báo "Access has been denied" (thật) ⇒ .lean() ·
 * {{else}}, {{{ }}} · bảng EJS vs Handlebars · bài tập đoán HTML (đáp án thật).
 * Output THẬT Node 22.23.3 + Express 5.3.0 + ejs 7.0.2 + express-handlebars 9.0.4 + Mongoose 9.11.4, cổng 4300, Playwright Chromium: that/s4t/*.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, three, box, kw, bang, cards, flow, vsd, ma, ra, js, term, cot, sql, esc, gay } from './_sdn-chung.mjs';

export const deck = { key: 'sdn-04-2', code: 'SDN 4.2', title: 'Server-side templating with EJS & Handlebars', sub: 'SDN302 — Node.js, Express & MongoDB' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const V = (f) => readFileSync(new URL(`file:///Users/admin/Documents/video-bai-giang/src/khung/node/that/s4t/views/${f}`, import.meta.url), 'utf8').replace(/\s+$/, '');
const html = (src, o = {}) => sql(src, { lang: 'html', ...o });
const H = (a, b) => ra('s4t/hbs-app', a, b);
const E = (a, b) => ra('s4t/ejs-app', a, b);

/** Hai cách dựng trang (SVG). */
function haiCach() {
  return two(flow([{ t: 'Server', s: 'res.json(data)', mau: LAM }, { t: 'JSON', s: 'over the wire', mau: TIM }, { t: 'React', s: 'builds the page', mau: NODE }], { w: 540, h: 140, fs: 19 }),
    flow([{ t: 'Server', s: 'res.render(view, data)', mau: LAM }, { t: 'HTML', s: 'finished page', mau: CAM }, { t: 'Browser', s: 'just shows it', mau: NODE }], { w: 540, h: 140, fs: 19 }));
}

export const slides = lamDeck({ chuong: 'Chapter 4 — REST API with MVC', bai: '4.2' }, [
  { cover: true, t: 'Server-side templating<br>with EJS & Handlebars', sub: 'When the server sends finished HTML instead of JSON (CLO8).' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>API-first vs server-rendered: which one are you building?</li>
<li><b>EJS</b>: JavaScript inside HTML, the three tags</li>
<li>Escaping and XSS, run in a real browser</li>
<li><b>Handlebars</b>: logic-less templates, and the Mongoose trap</li>
<li>EJS vs Handlebars, side by side</li>
</ul>
${box('CLO8', 'Use EJS and Handlebars templating. Part of Progress Test 1.', '')}
${box('Versions', 'ejs 7.0.2 · express-handlebars 9.0.4 · Express 5.3 · Mongoose 9.11 · run on Node 22.', 'lam')}` },

  { t: 'Two ways to build a page', to: true, giua: true, body: haiCach() + two(
    box('API-first (JSON)', 'A React app asks for data and builds the page itself. Everything you did in lesson 4.1.', 'lam'),
    box('Server-rendered (HTML)', 'The server fills a template and sends a finished page: admin dashboards, e-mails, pages that need SEO.', '')) +
    box('★ Decide first', 'Mixing both in one app without a reason makes the architecture confusing. Pick per page, on purpose.', 'xanh') },

  { t: 'EJS: set up and render', body: js(ma('s4t/ejs-app', 5, 17)) + three(
    box("app.set('view engine', 'ejs')", 'Templates live in <code class="i">./views</code> and end in <code class="i">.ejs</code>.', 'lam'),
    box("res.render('products', data)", 'Fills <b>views/products.ejs</b> with the data, sends HTML.', 'xanh'),
    box('Same data, two answers', '<code class="i">/products</code> = HTML page · <code class="i">/api/products</code> = JSON.', '')) },

  { t: 'An EJS template', body: two(html(V('products.ejs')), cot(html(V('partials/header.ejs')), bang(['Tag', 'Does'], [
    ['<code class="i">&lt;%= x %&gt;</code>', 'print a value, <b>escaped</b>'], ['<code class="i">&lt;% code %&gt;</code>', 'run logic: if, forEach'], ['<code class="i">&lt;%- x %&gt;</code>', 'print <b>raw</b> HTML (dangerous)'], ['<code class="i">include()</code>', 'insert a partial'],
  ], { co: 21 }))) + box('Feels like HTML with JavaScript sprinkled in', 'Any JavaScript works inside <code class="i">&lt;% %&gt;</code>, which is both its power and its risk.', 'lam') +
    box('Files', '<code class="i">views/products.ejs</code> and <code class="i">views/partials/header.ejs</code>; res.render(\'products\') finds the first one by name.', '') },

  { t: 'The tags, one at a time', to: true, giua: true, body: js(ma('s4t/ejs-snippets', 2, 9).replace("try { ejs.render('<h1><%= title %></h1>', data); } catch (err) {", "try { ejs.render('<h1><%= title %></h1>', data); }\ncatch (err) {"), { sm: true }) + term(ra('s4t/ejs-snippets', 2, 6), { title: 'node snippets.js · ejs 7.0.2 · real' }) + two(
    box('1 vs 2', '&lt;%= %&gt; turned &lt;b&gt; into text; &lt;%- %&gt; kept it as real HTML.', 'xanh'),
    box('5) A missing variable', 'EJS throws <b>ReferenceError</b>: pass every variable the template uses (here: title).', 'do2')) },

  { t: 'Run it: the HTML the browser gets', body: term(E(1, 7), { title: 'curl /products · ejs 7.0.2 · real' }) + term(E(14, 15).replace(/\[\{/, '[\n{').replace(/\},\{/g, '},\n{'), { title: 'curl /api/products · same data as JSON · real', sm: true }) +
    box('A product name with a script tag', 'One product is named <code class="i">&lt;script&gt;alert("hacked")&lt;/script&gt;Mug</code>. In the HTML page EJS escaped it to harmless text; the JSON carries it as plain data.', 'xanh') },

  { t: 'XSS: escaped vs raw, in a real browser', body: two(html(V('unsafe.ejs')), term(E(9, 13), { title: 'curl /unsafe · real', sm: true })) +
    term(E(16, 18).replace(/ \| first item text: /g, '\n             first item text: '), { title: 'headless Chromium (Playwright) opens both pages · real', sm: true }) + two(
      box('/products (&lt;%= %&gt;)', 'No alert: the script is shown as text.', 'xanh'),
      box('/unsafe (&lt;%- %&gt;)', 'The alert <b>ran</b>: anyone viewing the page runs the attacker’s code. Use &lt;%= %&gt; for user input (Node.js 9.2).', 'do2')) },

  { t: 'Forms: POST, then redirect', body: js(ma('s4t/form-app', 8, 8).replace(' // reads HTML form bodies', '') + '\n' + ma('s4t/form-app', 12, 18), { sm: true }) + term(gay((ra('s4t/form-app', 9, 13) + '\n' + ra('s4t/form-app', 16, 16) + '\n' + ra('s4t/form-app', 17, 17) + ' ⇒ ' + ra('s4t/form-app', 19, 19).trim()).replace(" | grep -iE '^HTTP|^location'", '').replace(" -w '  [%{http_code}]'", '').replace(" | grep -E 'error|value|\\['", ''), 112), { title: 'curl · an HTML form post · real', sm: true }) + two(
    box('302 → /products', 'Post / Redirect / Get: save, then send the browser to the list. A refresh will not post twice.', 'xanh'),
    box('400 + the same form', 'On an error, render the form again with the message and the typed values.', '')) },

  { t: 'Handlebars: set up', body: js(ma('s4t/hbs-app', 6, 15)) + two(
    box('express-handlebars', '<code class="i">app.engine(\'hbs\', engine(…))</code> registers the engine; views end in <code class="i">.hbs</code>.', 'lam'),
    box('defaultLayout: false', 'No layout file in this demo. Real apps add <code class="i">views/layouts/main.hbs</code> around every page.', '')) },

  { t: 'A Handlebars template', to: true, giua: true, body: two(html(V('products.hbs')), bang(['Syntax', 'Does'], [
    ['<code class="i">{{ x }}</code>', 'print, escaped'], ['<code class="i">{{{ x }}}</code>', 'print raw (dangerous)'], ['<code class="i">{{#each list}}</code>', 'loop; <code class="i">this</code> = current item'], ['<code class="i">{{else}}</code>', 'when the list is empty'], ['<code class="i">{{#if x}}</code>', 'only true / false, no expressions'],
  ], { co: 21 })) + box('Logic-less on purpose', 'No <code class="i">price &lt; 10</code> inside the template: the controller prepares the data, the template only shows it.', 'xanh') +
    box('Same output as EJS', 'Real run of /lean on the next slide: Pen - 2 USD, Lamp - 30 USD.', 'lam') },

  { t: 'The Mongoose trap in Handlebars', body: two(term(H(1, 5), { title: 'curl /docs · real', sm: true }), term(H(6, 10), { title: 'curl /lean · real', sm: true })) + term(gay(ra('s4t/hbs-app', 3, 4, 'server').replace(' because it is', '\n  because it is'), 110), { title: 'server log · real', sm: true }) + two(
    box('/docs: empty cells', 'Mongoose documents keep name and price on a prototype. Handlebars refuses to read them: blank output and a warning.', 'do2'),
    box('/lean: fixed', '<code class="i">.lean()</code> returns plain objects (lesson 3.2b). Always lean() before render with Handlebars.', 'xanh')) },

  { t: 'EJS vs Handlebars', to: true, giua: true, body: bang(['', 'EJS', 'Handlebars'], [
    ['Syntax', '&lt;%= %&gt; · &lt;% %&gt; · &lt;%- %&gt;', '{{ }} · {{#each}} · {{{ }}}'], ['Logic in the template', 'any JavaScript', 'almost none (helpers)'], ['Escaping', '&lt;%= %&gt; escapes', '{{ }} escapes'],
    ['Mongoose documents', 'work directly', 'need .lean()'], ['Missing variable', 'ReferenceError', 'prints nothing'], ['Feels like', 'HTML + JavaScript', 'HTML + placeholders'],
  ], { co: 20 }) + term(ra('s4t/hbs-missing', 2, 3), { title: 'node missing.js · a missing variable · real', sm: true }) + box('Which one?', 'The syllabus asks for both. Generator: <code class="i">--view=ejs</code> or <code class="i">--view=hbs</code> (lesson 2.1).', 'lam') },

  { t: 'Exercise: predict the HTML', to: true, giua: true, body: box('Your task', 'Data: <code class="i">{ name: \'&lt;b&gt;Mug&lt;/b&gt;\', price: 8, tags: [\'kitchen\', \'gift\'] }</code>. Predict the output of: 1) <code class="i">&lt;p&gt;&lt;%= name %&gt;&lt;/p&gt;</code> · 2) <code class="i">&lt;p&gt;&lt;%- name %&gt;&lt;/p&gt;</code> · 3) an if on price &lt; 10 · 4) a forEach over tags · 5) <code class="i">&lt;%= title %&gt;</code>.', '') +
    `<div data-k="dapan">${term(ra('s4t/ejs-snippets', 2, 6), { title: 'answers · node snippets.js · real' })}${box('', 'Escaped, raw, logic, loop, and the ReferenceError when a variable is missing.', 'xanh')}</div>` },

  { t: 'Check yourself', to: true, giua: true, body: `<ol>
<li>Which EJS tag prints a value safely?</li>
<li>Handlebars prints empty cells for Mongoose results. The fix?</li>
<li>A React front-end needs product data. Render HTML or send JSON?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. &lt;%= %&gt; (escaped). &nbsp;2. .lean() before res.render. &nbsp;3. JSON: React builds the page itself.', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}
${box('Bonus', 'Which Handlebars syntax prints raw HTML? Answer: {{{ }}}, use it as rarely as &lt;%- %&gt;.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Server-rendered = the server fills a template and sends finished HTML (admin, e-mail, SEO)</li>
<li>EJS: &lt;%= %&gt; escaped · &lt;% %&gt; logic · &lt;%- %&gt; raw · include()</li>
<li>Handlebars: {{ }} · {{#each}} · logic in the controller · lean() with Mongoose</li>
<li>Never print user input raw: XSS ran for real in the browser</li>
</ul>
${box('Next', 'Lesson 5.1: passwords and sessions (bcrypt, cookies, Passport).', 'lam')}
${box('Go deeper', 'Node.js 9.2: XSS and sanitising input, with a Content-Security-Policy.', 'xanh')}` },
]);
