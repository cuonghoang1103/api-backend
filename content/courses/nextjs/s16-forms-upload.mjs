/**
 * Next.js & React — Chương 16: Form, validation & upload file. KHÉP GIAI ĐOẠN 4.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần kỹ thuật form/upload — không có output console để chạy. Sự cố THẬT
 * cuongthai.com: getMediaUrl ghép CDN base vào blob:/data: preview URL làm hỏng
 * ảnh xem trước; các đợt vá lỗ hổng upload (validate type/size/auth ở server, R2).
 * Lồng vào .note-ct/.pitfall.
 */

import G16_1 from './giang/nxj-16-1.mjs';
import G16_2 from './giang/nxj-16-2.mjs';
import G16_3 from './giang/nxj-16-3.mjs';
import G16_4 from './giang/nxj-16-4.mjs';
import G16_5 from './giang/nxj-16-5.mjs';
export default {
  title: 'Chapter 16 — Forms, validation, and file uploads|||Chương 16 — Form, validation và upload file',
  description: 'Hai cách làm form (Server Action và react-hook-form), validation bằng Zod với MỘT schema dùng cả client lẫn server, và upload file lên storage (R2/S3) — kèm bẫy preview blob:/data: và luật bảo mật upload thật của cuongthai.com.',
  lessons: [
    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: '16.1 — Two ways to build a form|||16.1 — Hai cách dựng một form',
      slug: 'nextjs-16-1-hai-cach-form',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Form Validation in Next.js with React Hook Form & Zod" — Code With Joel (oEmbed verified).
      video: { url: 'https://youtu.be/T5n7dsQxVnE', durationSeconds: 0 },
      description: 'App Router cho hai cách làm form: form gắn thẳng Server Action (Chương 12) và form phía client với react-hook-form. Bài này so sánh và chỉ khi nào dùng cái nào.',
      content: `
${G16_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> The React part of this chapter is taught in depth in the <a href="/courses/react">React</a> course (Chapter 3 for react-hook-form and Zod). What is specific to Next.js here: validating the same Zod schema inside a Server Action, and uploading files to storage.</div>
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Server Action forms vs client forms — pick by need</h2>
<p class="lead">You have already built one kind of form: a <code>&lt;form action={serverAction}&gt;</code> in Chapter 12, which submits straight to the server with progressive enhancement. This chapter adds the other kind — rich client-side forms with <strong>react-hook-form</strong> — and shows where each fits.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Server Action form</span><span class="v">Great for straightforward submits and mutations: works without JS, minimal client code, validation and write on the server. The default for "submit this data."</span></div>
  <div class="kv"><span class="k">react-hook-form (client)</span><span class="v">Great for rich interactivity: instant field-level validation, dynamic/array fields, multi-step wizards, live formatting. When the form itself is a mini-app.</span></div>
</div>

<h3>They are not mutually exclusive</h3>
<p>A common, strong combination: use react-hook-form for the client experience (instant validation, good UX), and still submit to a Server Action for the write — with the <em>same</em> Zod schema validating on both sides (lesson 16.3). Client validation is for fast feedback; server validation is the one that actually protects you (the Chapter 12 rule, again).</p>

<h3>The rule of thumb</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Simple submit / mutation, want it to work without JS → <b>Server Action form</b>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Complex, highly interactive form → <b>react-hook-form</b>, submitting to an action or route handler.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Either way → <b>validate on the server</b>, and prefer one shared schema.</div></div>
</div>

<h3>Two ways to build a form, and when each wins</h3>
<div class="lz-map">
  <div class="lz-stage">The question is what has to happen while the user types</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Server Action + FormData</div><div class="lz-nsub">No client JavaScript needed, works before hydration, and the mutation lives next to the data. Best default for a create or edit form.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Client library + fetch/action</div><div class="lz-nsub">React Hook Form or similar. Needed when you want live validation, dependent fields, or a wizard with steps.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">You can combine them</div><div class="lz-nsub">A client form that validates as you type, submitting to a Server Action that validates again. Neither check replaces the other.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">The server check is not optional</div><div class="lz-nsub">Client validation is a courtesy to honest users. Anything arriving at the server is attacker-controlled, always.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — a form that only works after the JavaScript loads.</strong> An &#96;onSubmit&#96; handler does not exist until hydration finishes. Measured on Next.js 16.4.6 with JavaScript slowed down, the click before hydration is not ignored: the browser submits the form its own way — a <strong>GET</strong> to the same page with every named field in the query string (&#96;/dk/b?name=Tuan&amp;email=tuan%40lab.test&#96;). Nothing is stored, the page reloads empty, and a password field would end up in the address bar, the history and the server logs. A &#96;&lt;form action={serverAction}&gt;&#96; has no such window: the browser can POST it natively, and React takes over once it is ready. When a form must work for everyone, that is the shape to reach for, and the client enhancements go on top.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Actions with forms</span><span class="lc-sub">The progressive-enhancement path, and what works before hydration.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — form</span><span class="lc-sub">The action prop and the hooks that report its pending state.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build the same form twice: once with a Server Action (<code>&lt;form action&gt;</code>) and once as a controlled client form.</li>
<li>List which approach gives progressive enhancement and which gives rich live validation.</li>
<li>Decide for one real form which approach fits and justify it in a sentence.</li>
</ol>
<p><strong>Done when:</strong> you can compare server-action forms and client forms and choose between them.</p></div>

<h3>🔬 Measured: the same sign-up, two forms, JavaScript on / off / slow (Next.js 16.4.6 · next start · Chromium)</h3>
<p>A = <code>&lt;form action={signUp}&gt;</code> (Server Action). B = a controlled client form with <code>onSubmit</code> + <code>fetch(&#39;/api/dk&#39;)</code>. The build already tells them apart:</p>
<div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|/dk|/api/dk|rror'
├ ƒ /api/dk
├ ƒ /dk/a
├ ○ /dk/b
└ ƒ /dk/ok</div>
<div style="overflow-x:auto"><table><thead><tr><th></th><th>A · Server Action form</th><th>B · client form</th></tr></thead><tbody>
<tr><td>JavaScript off</td><td>GET /dk/a → 200<br>POST /dk/a → 303<br>GET /dk/ok → 200<br>⇒ /dk/ok · signed up: 3</td><td>GET /dk/b → 200<br>GET /dk/b?name=Minh&email=minh%40lab.test → 200<br>⇒ <code>/dk/b?name=Minh&email=minh%40lab.test</code></td></tr>
<tr><td>JS delayed 4 s, click at once</td><td>GET /dk/a → 200<br>POST /dk/a → 303<br>GET /dk/ok → 200<br>⇒ /dk/ok · signed up: 4</td><td>GET /dk/b → 200<br>GET /dk/b?name=Tuan&email=tuan%40lab.test → 200<br>⇒ <code>/dk/b?name=Tuan&email=tuan%40lab.test</code></td></tr>
<tr><td>JS on, email "nam-at-lab"</td><td>—</td><td>email: not an email address — no request<br>fixed: POST /api/dk → 201 ⇒ /dk/ok · signed up: 5</td></tr>
</tbody></table></div>
<p><strong>The browser check is a courtesy — the endpoint checks again:</strong></p>
<div class="out">$ curl -si -X POST localhost:3000/api/dk -d '{"name":"x","email":"no-at-sign"}'
HTTP/1.1 400 Bad Request
{"error":"name: at least 2 characters"}
$ curl -si -X POST localhost:3000/api/dk -d '{"name":"An","email":"an@lab.test"}'
HTTP/1.1 201 Created
# server log
[signup] #1 an@lab.test via client fetch
[signup] #2 an@lab.test via client fetch
[signup] #3 lan@lab.test via server action
[signup] #4 hoa@lab.test via server action
[signup] #5 nam@lab.test via client fetch</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -nE '"react-hook-form"|"zod"|"@hookform/resolvers"' package.json
35:    "@hookform/resolvers": "^3.9.0",
87:    "react-hook-form": "^7.53.0",
111:    "zod": "^3.23.8",
$ grep -rlE "useForm[&lt;(]" src | wc -l | sed 's/^ */tệp dùng useForm: /'
tệp dùng useForm: 6
$ grep -rl "onSubmit" src | wc -l | sed 's/^ */tệp có onSubmit: /'
tệp có onSubmit: 133
$ grep -rlE "'use server'|\\"use server\\"" src | wc -l | sed 's/^ */tệp có use server: /'
tệp có use server: 0
$ grep -rnE "&lt;form[^&gt;]*action=\\{" src | sed 's/^\\([^:]*:[0-9]*\\):.*\\(&lt;form[^&gt;]*\\)$/\\1: \\2/' | cut -c1-120
src/components/admin/GithubAppAdmin.tsx:61:        &lt;form ref={formRef} method="post" action={form.action} className="hid</div>The Next.js frontend has no Server Action at all (<code>&#39;use server&#39;</code> in 0 files): every form is a client form — about 133 files with <code>onSubmit</code> — that calls the Express backend, which validates again. react-hook-form, Zod and @hookform/resolvers are installed and used in six files (login, register, password reset/change, game editor). The single <code>&lt;form action={…}&gt;</code> posts to GitHub, not to an action.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># A: &lt;form action={signUp}&gt;  ·  B: 'use client' + onSubmit + fetch</span>
npm run build &amp;&amp; npm start
<span class="tok-comment"># Chrome DevTools → ⌘⇧P → "Disable JavaScript" → submit both forms, read the URL</span>
<span class="tok-comment"># Network → Slow 3G → click before the page is interactive</span>
curl -si -X POST localhost:3000/api/dk -H 'content-type: application/json' -d '{"name":"x","email":"bad"}' | head -1</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-4-forms" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 2.4 — Forms</span><span class="lc-sub">What a form does on its own: GET and POST</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Controlled inputs</span><span class="lc-sub">value + onChange, way B</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-2-form-action" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.2 — Forms with action</span><span class="lc-sub">Way A, from Chapter 12</span></span></a>

<h3>🌏 Not just theory: real life, what-ifs, attackers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">you fill a sign-up form on your phone in the dorm, the network flickers, and you press submit before the page has finished loading.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">What if that is a sign-in form built the client way? The password lands in the address bar, in a shared computer's history and in the campus network logs.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker&#39;s angle</span><span class="v">An attacker needs no browser: DevTools or curl skips every check that runs in the browser.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Prevent it: give client forms method="post", and always check again on the server.</span></div>
</div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Server Action form</span><span class="v"><code>&lt;form action={fn}&gt;</code> — works without client JS.</span></div>
  <div class="kv"><span class="k">Client form</span><span class="v">Controlled inputs with live validation in the browser.</span></div>
  <div class="kv"><span class="k">Progressive enhancement</span><span class="v">The form works even before/without JavaScript.</span></div>
  <div class="kv"><span class="k">Live validation</span><span class="v">Instant feedback as the user types (client-side).</span></div>
  <div class="kv"><span class="k">Trade-off</span><span class="v">Server actions = simpler + PE; client forms = richer UX.</span></div>
  <div class="kv"><span class="k">Hybrid</span><span class="v">A client form can still submit to a Server Action.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Two ways to build a form: a Server Action form (works without JS) and a controlled client form (rich live validation).</li><li>Server-action forms give progressive enhancement and the least code.</li><li>Client forms give instant validation and a richer UX.</li><li>You can combine them — a client form that submits to a Server Action.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react-hook-form.com/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — Get Started</span><span class="lc-sub">register, handleSubmit, and the uncontrolled approach.</span></span>
</a>
</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Phần React của chương này được dạy kỹ ở khoá <a href="/courses/react">React</a> (Chương 3 phần react-hook-form và Zod). Phần riêng của Next.js ở đây: kiểm cùng một schema Zod trong Server Action, và upload file lên storage.</div>
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Form Server Action vs form client — chọn theo nhu cầu</h2>
<p class="lead">Bạn đã dựng một kiểu form: một <code>&lt;form action={serverAction}&gt;</code> ở Chương 12, submit thẳng tới server với progressive enhancement. Chương này thêm kiểu còn lại — form phía client phong phú với <strong>react-hook-form</strong> — và chỉ chỗ mỗi cái hợp.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Form Server Action</span><span class="v">Tuyệt cho submit và mutation đơn giản: chạy được không cần JS, ít code client, validation và ghi trên server. Mặc định cho "gửi dữ liệu này".</span></div>
  <div class="kv"><span class="k">react-hook-form (client)</span><span class="v">Tuyệt cho tương tác phong phú: validation tức thì theo trường, trường động/mảng, wizard nhiều bước, định dạng trực tiếp. Khi bản thân form là một app nhỏ.</span></div>
</div>

<h3>Chúng không loại trừ nhau</h3>
<p>Một kết hợp phổ biến, mạnh: dùng react-hook-form cho trải nghiệm client (validation tức thì, UX tốt), và vẫn submit tới một Server Action để ghi — với <em>cùng</em> một schema Zod validate cả hai phía (bài 16.3). Validation client để phản hồi nhanh; validation server mới là cái thật sự bảo vệ bạn (lại quy tắc Chương 12).</p>

<h3>Quy tắc ngón tay cái</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Submit / mutation đơn giản, muốn chạy không cần JS → <b>form Server Action</b>.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Form phức tạp, tương tác cao → <b>react-hook-form</b>, submit tới một action hoặc route handler.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">Kiểu nào cũng → <b>validate trên server</b>, và ưu tiên một schema dùng chung.</div></div>
</div>

<h3>Hai cách dựng một form, và mỗi cách thắng khi nào</h3>
<div class="lz-map">
  <div class="lz-stage">Câu hỏi là cái gì phải xảy ra TRONG LÚC người dùng gõ</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Server Action + FormData</div><div class="lz-nsub">Không cần JavaScript phía client, chạy được trước khi hydrate, và phép ghi nằm ngay cạnh dữ liệu. Mặc định tốt nhất cho một form tạo hoặc sửa.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Thư viện client + fetch/action</div><div class="lz-nsub">React Hook Form hoặc tương tự. Cần khi bạn muốn kiểm dữ liệu trực tiếp, trường phụ thuộc nhau, hoặc một form nhiều bước.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Kết hợp cả hai được</div><div class="lz-nsub">Một form phía client kiểm ngay lúc gõ, gửi tới một Server Action rồi kiểm lại lần nữa. Chẳng phép kiểm nào thay thế phép kiểm kia.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Phép kiểm ở máy chủ là bắt buộc</div><div class="lz-nsub">Kiểm ở client là cử chỉ lịch sự với người dùng ngay thẳng. Mọi thứ tới máy chủ đều do kẻ tấn công điều khiển, luôn luôn.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một form chỉ chạy được sau khi JavaScript tải xong.</strong> Handler &#96;onSubmit&#96; chưa tồn tại cho tới khi hydrate xong. Đo trên Next.js 16.4.6 với JavaScript bị làm chậm: cú bấm trước khi hydrate KHÔNG bị bỏ qua — trình duyệt tự gửi form theo cách mặc định, một <strong>GET</strong> về chính trang đó, mọi trường có tên nằm trên URL (&#96;/dk/b?name=Tuan&amp;email=tuan%40lab.test&#96;). Không gì được lưu, trang tải lại trống trơn, và nếu có ô mật khẩu thì mật khẩu nằm trên thanh địa chỉ, trong lịch sử và nhật ký máy chủ. Một &#96;&lt;form action={serverAction}&gt;&#96; không có cái khe cửa đó: trình duyệt POST nó một cách bản địa được, và React tiếp quản khi nó sẵn sàng. Khi một form phải chạy được cho tất cả mọi người thì đó là hình dạng cần với tay tới, còn các cải tiến phía client thì đặt lên trên.</p></div>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Server Action với form</span><span class="lc-sub">Con đường cải tiến tiệm tiến, và cái gì chạy được trước khi hydrate.</span></span>
</a>
<a class="link-card dl" href="https://react.dev/reference/react-dom/components/form" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — form</span><span class="lc-sub">Prop action và các hook báo cáo trạng thái đang-gửi của nó.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng cùng một form hai lần: một với Server Action (<code>&lt;form action&gt;</code>) và một là form client có kiểm soát.</li>
<li>Liệt kê cách nào cho progressive enhancement và cách nào cho validation trực tiếp phong phú.</li>
<li>Với một form thật, quyết định cách nào hợp và biện minh một câu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn so được form server-action và form client và chọn giữa chúng.</p></div>

<h3>🔬 Đo thật: cùng một form đăng ký, hai cách, JavaScript bật / tắt / chậm (Next.js 16.4.6 · next start · Chromium)</h3>
<p>A = <code>&lt;form action={signUp}&gt;</code> (Server Action). B = form client có kiểm soát, <code>onSubmit</code> + <code>fetch(&#39;/api/dk&#39;)</code>. Ngay bảng build đã phân biệt hai trang:</p>
<div class="out">$ npm run build 2&gt;&amp;1 | grep -E 'Compiled|/dk|/api/dk|rror'
├ ƒ /api/dk
├ ƒ /dk/a
├ ○ /dk/b
└ ƒ /dk/ok</div>
<div style="overflow-x:auto"><table><thead><tr><th></th><th>A · form Server Action</th><th>B · form client</th></tr></thead><tbody>
<tr><td>Tắt JavaScript</td><td>GET /dk/a → 200<br>POST /dk/a → 303<br>GET /dk/ok → 200<br>⇒ /dk/ok · signed up: 3</td><td>GET /dk/b → 200<br>GET /dk/b?name=Minh&email=minh%40lab.test → 200<br>⇒ <code>/dk/b?name=Minh&email=minh%40lab.test</code></td></tr>
<tr><td>JS chậm 4 giây, bấm ngay</td><td>GET /dk/a → 200<br>POST /dk/a → 303<br>GET /dk/ok → 200<br>⇒ /dk/ok · signed up: 4</td><td>GET /dk/b → 200<br>GET /dk/b?name=Tuan&email=tuan%40lab.test → 200<br>⇒ <code>/dk/b?name=Tuan&email=tuan%40lab.test</code></td></tr>
<tr><td>JS bật, email "nam-at-lab"</td><td>—</td><td>email: not an email address — không có request<br>sửa lại: POST /api/dk → 201 ⇒ /dk/ok · signed up: 5</td></tr>
</tbody></table></div>
<p><strong>Kiểm ở trình duyệt chỉ là lịch sự — endpoint kiểm lại:</strong></p>
<div class="out">$ curl -si -X POST localhost:3000/api/dk -d '{"name":"x","email":"no-at-sign"}'
HTTP/1.1 400 Bad Request
{"error":"name: at least 2 characters"}
$ curl -si -X POST localhost:3000/api/dk -d '{"name":"An","email":"an@lab.test"}'
HTTP/1.1 201 Created
# nhật ký server
[signup] #1 an@lab.test via client fetch
[signup] #2 an@lab.test via client fetch
[signup] #3 lan@lab.test via server action
[signup] #4 hoa@lab.test via server action
[signup] #5 nam@lab.test via client fetch</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -nE '"react-hook-form"|"zod"|"@hookform/resolvers"' package.json
35:    "@hookform/resolvers": "^3.9.0",
87:    "react-hook-form": "^7.53.0",
111:    "zod": "^3.23.8",
$ grep -rlE "useForm[&lt;(]" src | wc -l | sed 's/^ */tệp dùng useForm: /'
tệp dùng useForm: 6
$ grep -rl "onSubmit" src | wc -l | sed 's/^ */tệp có onSubmit: /'
tệp có onSubmit: 133
$ grep -rlE "'use server'|\\"use server\\"" src | wc -l | sed 's/^ */tệp có use server: /'
tệp có use server: 0
$ grep -rnE "&lt;form[^&gt;]*action=\\{" src | sed 's/^\\([^:]*:[0-9]*\\):.*\\(&lt;form[^&gt;]*\\)$/\\1: \\2/' | cut -c1-120
src/components/admin/GithubAppAdmin.tsx:61:        &lt;form ref={formRef} method="post" action={form.action} className="hid</div>Frontend Next.js không có Server Action nào (<code>&#39;use server&#39;</code> ở 0 tệp): mọi form là form client — khoảng 133 tệp có <code>onSubmit</code> — gọi backend Express, nơi kiểm lại. react-hook-form, Zod và @hookform/resolvers đã cài, dùng ở sáu tệp (đăng nhập, đăng ký, quên/đổi mật khẩu, sửa game). <code>&lt;form action={…}&gt;</code> duy nhất là form POST sang GitHub, không phải action.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># A: &lt;form action={signUp}&gt;  ·  B: 'use client' + onSubmit + fetch</span>
npm run build &amp;&amp; npm start
<span class="tok-comment"># Chrome DevTools → ⌘⇧P → "Disable JavaScript" → gửi cả hai form, đọc thanh địa chỉ</span>
<span class="tok-comment"># Network → Slow 3G → bấm trước khi trang tương tác được</span>
curl -si -X POST localhost:3000/api/dk -H 'content-type: application/json' -d '{"name":"x","email":"bad"}' | head -1</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-4-forms" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 2.4 — Form</span><span class="lc-sub">Form tự làm gì khi không có JS: GET và POST</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Input có kiểm soát</span><span class="lc-sub">value + onChange, cách B</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-2-form-action" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.2 — Form với action</span><span class="lc-sub">Cách A, từ Chương 12</span></span></a>

<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">bạn điền form đăng ký trên điện thoại ở ký túc xá, mạng chập chờn, bấm gửi khi trang chưa tải xong.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Nếu đó là form đăng nhập kiểu B thì sao? Mật khẩu lên thanh địa chỉ, nằm lại trong lịch sử máy dùng chung và nhật ký của mạng trường.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kẻ xấu không cần trình duyệt: mở DevTools hoặc gọi curl là bỏ qua mọi phép kiểm phía trình duyệt.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Cách phòng: form client vẫn khai method bằng post, và luôn kiểm lại trên máy chủ.</span></div>
</div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Form Server Action</span><span class="v"><code>&lt;form action={fn}&gt;</code> — chạy được không cần JS client.</span></div>
  <div class="kv"><span class="k">Form client</span><span class="v">Input có kiểm soát với validation trực tiếp trong trình duyệt.</span></div>
  <div class="kv"><span class="k">Progressive enhancement</span><span class="v">Form chạy được kể cả trước/không có JavaScript.</span></div>
  <div class="kv"><span class="k">Validation trực tiếp</span><span class="v">Phản hồi tức thì khi người dùng gõ (phía client).</span></div>
  <div class="kv"><span class="k">Đánh đổi</span><span class="v">Server action = đơn giản + PE; form client = UX phong phú hơn.</span></div>
  <div class="kv"><span class="k">Lai</span><span class="v">Một form client vẫn submit tới một Server Action được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Hai cách dựng form: form Server Action (chạy không cần JS) và form client có kiểm soát (validation trực tiếp phong phú).</li><li>Form server-action cho progressive enhancement và ít code nhất.</li><li>Form client cho validation tức thì và UX phong phú hơn.</li><li>Bạn kết hợp được — một form client submit tới một Server Action.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react-hook-form.com/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — Get Started</span><span class="lc-sub">register, handleSubmit, và cách uncontrolled.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: '16.2 — react-hook-form: fast client forms|||16.2 — react-hook-form: form client nhanh',
      slug: 'nextjs-16-2-react-hook-form',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'react-hook-form dùng input không-kiểm-soát (uncontrolled) qua register(), nên gõ không làm render lại cả form — nhanh hơn hẳn cách value+onChange của Chương 4. handleSubmit, formState.errors, và Controller.',
      content: `
${G16_2}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>Less re-rendering, less boilerplate</h2>
<p class="lead">In Chapter 4 you built controlled inputs — every keystroke set state and re-rendered. That is fine for a field or two; for a large form it re-renders the whole thing on every key. react-hook-form takes the <em>uncontrolled</em> approach: inputs keep their own value in the DOM, and the library reads them on submit.</p>

<pre><code class="language-typescript">'use client';
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) =&gt; console.log(data);   <span class="tok-comment">// { email, password }</span>

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('email', { required: 'Email is required' })} /&gt;
      {errors.email &amp;&amp; &lt;p&gt;{errors.email.message}&lt;/p&gt;}
      &lt;input type="password" {...register('password')} /&gt;
      &lt;button&gt;Sign up&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<div class="callout warn"><strong>Measured on Next.js 16.4.6 (react-hook-form 7.92.0): in a .tsx file this snippet does not type-check.</strong><div class="out">src/app/f/bai/SignupForm.tsx(5,21): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/app/f/bai/SignupForm.tsx(9,27): error TS2322: Type 'string | FieldError | Merge&lt;FieldError, FieldErrorsImpl&lt;any&gt;&gt; | undefined' is not assignable to type 'ReactNode'.</div>An untyped <code>useForm()</code> knows no field names, so <code>data</code> is <code>any</code> and <code>errors.email</code> may be a nested object. Give the form a type and both errors go away (tsc: 0 errors):<pre><code class="language-tsx">'use client';
import { useForm } from 'react-hook-form';

type Signup = { email: string; password: string };

export function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm&lt;Signup&gt;();
  const onSubmit = (data: Signup) =&gt; console.log(data); <span class="tok-comment">  // { email, password }</span>
  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('email', { required: 'Email is required' })} /&gt;
      {errors.email &amp;&amp; &lt;p&gt;{errors.email.message}&lt;/p&gt;}
      &lt;input type="password" {...register('password')} /&gt;
      &lt;button&gt;Sign up&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre></div>
<div class="kv-grid">
  <div class="kv"><span class="k">register('name')</span><span class="v">Wires an input to the form. Typing does not re-render the component — the big performance win over controlled inputs.</span></div>
  <div class="kv"><span class="k">handleSubmit</span><span class="v">Collects all values, runs validation, and calls your handler with a clean data object only if valid.</span></div>
  <div class="kv"><span class="k">formState.errors</span><span class="v">Per-field error messages to render inline.</span></div>
  <div class="kv"><span class="k">Controller</span><span class="v">A bridge for controlled components (a custom Select, a date picker) that cannot be plain uncontrolled inputs.</span></div>
</div>

<div class="callout ok">
<p><strong>Why it feels faster:</strong> because keystrokes do not flow through React state, a 20-field form does not re-render on every character. You get validation, error handling, and submit orchestration while typing stays cheap. For non-trivial forms this is the default choice.</p>
</div>

<h3>Why a form library exists</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Uncontrolled by default</b> — It registers inputs with refs, so typing does not re-render the form. On a twenty-field form that difference is visible.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Validation as a schema</b> — One resolver (&#96;zodResolver&#96;) turns a schema into field-level errors, so the rules live in one place.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It tracks the states you would hand-roll</b> — Dirty, touched, submitting, submitted, per-field errors. Each is a boolean you would otherwise maintain yourself.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>It still needs the server</b> — The library validates the shape in the browser. The same schema must run again in the action.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — an input rendered without &#96;register&#96;, silently absent from the submitted values.</strong> &#96;&lt;input name="title" /&gt;&#96; inside a React Hook Form looks registered because it has a name, and the library never sees it: registration happens through &#96;{...register(&#39;title&#39;)}&#96;, not through the attribute. So &#96;handleSubmit&#96; hands you an object with no title, validation reports it as missing, and the field on screen visibly contains text. It happens most often after refactoring a field into a child component, where the spread gets dropped. When a value is missing, check the spread before the schema — and for a component input, use &#96;Controller&#96; rather than passing &#96;register&#96; down.</p></div>
<a class="link-card dl" href="https://react-hook-form.com/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">React Hook Form — Get started</span><span class="lc-sub">register, handleSubmit, and the uncontrolled model it is built on.</span></span>
</a>
<a class="link-card dl" href="https://react-hook-form.com/docs/usecontroller/controller" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">React Hook Form — Controller</span><span class="lc-sub">Wrapping a controlled component (a date picker, a select) so it registers correctly.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build a form with <code>useForm</code>: register fields, handle submit, and show validation errors from the <code>formState</code>.</li>
<li>Confirm it uses uncontrolled inputs under the hood by noting the lack of re-render on each keystroke.</li>
<li>Add a required and a pattern rule and display the messages.</li>
</ol>
<p><strong>Done when:</strong> you can build a fast form with react-hook-form and surface its validation errors.</p></div>

<h3>🔬 Measured: renders per keystroke, the bytes, and a missing field (Next.js 16.4.6 · next start · Chromium)</h3>
<p>Two pages with the same 20 inputs and a render counter (<code>useRef</code> incremented in the component body). Typing "hello world" (11 keys) into the first field:</p>
<div class="out">controlled (useState):   renders: 1  →  renders: 12
react-hook-form:        renders: 2  →  renders: 2
after Submit:           renders: 2 · {"field1":"hello world","field2":"","field3":"","field4":"","field5":"","field6"…</div>
<p>One render per keystroke for the controlled form; react-hook-form renders twice while setting up and then not at all — the value lives in the DOM until <code>handleSubmit</code> reads it.</p>
<p><strong>What it costs — first-load JavaScript of the same page:</strong></p>
<div class="out">$ node -e "….next/diagnostics/route-bundle-stats.json"
/f/rhf            492879 B
/f/thieu          492860 B
/f/kiem-soat      457706 B</div>
<p><strong>The trap, measured — a field with a name but no <code>register</code> (moved into a child component):</strong></p>
<div class="out">My first post ⇒ data = {"body":"hello"}</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -rlE "useForm[&lt;(]" src | sort
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/forgot-password/ForgotPasswordForm.tsx
src/app/reset-password/page.tsx
src/components/auth/ChangePasswordModal.tsx
src/components/games/admin/GameForm.tsx
$ grep -n "useForm&lt;\\|zodResolver(" 'src/app/(auth)/login/page.tsx' | head -3
93:  } = useForm&lt;LoginFormValues&gt;({
94:    resolver: zodResolver(loginSchema),
$ grep -rn "&lt;Controller" src | wc -l | sed 's/^ */chỗ dùng Controller: /'
chỗ dùng Controller: 1</div>Six forms use react-hook-form, typed and wired to Zod through <code>zodResolver</code> — login, register, forgot/reset/change password and the game editor. Every other client form uses plain <code>useState</code>, which is the right call for small forms.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-tsx"><span class="tok-comment">// in both components: count renders</span>
const renders = useRef(0);
renders.current += 1;
<span class="tok-comment">// &lt;p&gt;renders: {renders.current}&lt;/p&gt; — type 11 keys and read it</span></code></pre>
<pre><code class="language-bash">npm run build &amp;&amp; node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, r.firstLoadUncompressedJsBytes)"</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-2-react-hook-form" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.2 — React Hook Form</span><span class="lc-sub">The library from the ground up</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Controlled inputs</span><span class="lc-sub">The other model, measured above</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-5-dat-ranh-gioi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.5 — Where to draw the client boundary</span><span class="lc-sub">Keep the library inside small client islands</span></span></a>

<h3>🌏 Not just theory: real life, what-ifs, attackers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">a 20-field enrolment form on an old phone — every keystroke lags.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">What if a field moved into a child component loses its register? The student thinks everything was submitted; the server receives less, and nobody is told.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker&#39;s angle</span><span class="v">An attacker does not need your nice form: browser checks only stop honest users, a direct request goes straight through.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Detect it by comparing submitted data with the fields on screen in a test. Prevent it: the server checks again with the same schema (next lesson).</span></div>
</div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">react-hook-form</span><span class="v">A form library using uncontrolled inputs for performance.</span></div>
  <div class="kv"><span class="k">useForm</span><span class="v">The hook exposing <code>register</code>, <code>handleSubmit</code>, <code>formState</code>.</span></div>
  <div class="kv"><span class="k">register</span><span class="v">Wires an input to the form without controlling it.</span></div>
  <div class="kv"><span class="k">formState.errors</span><span class="v">Where field validation errors live.</span></div>
  <div class="kv"><span class="k">Fewer re-renders</span><span class="v">Uncontrolled inputs avoid re-rendering on each keystroke.</span></div>
  <div class="kv"><span class="k">Resolver</span><span class="v">Plug a schema (Zod) in for validation (next lesson).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>react-hook-form uses uncontrolled inputs, so typing does not re-render the whole form — it is fast.</li><li><code>useForm</code> gives you <code>register</code>, <code>handleSubmit</code> and a <code>formState</code> with errors.</li><li>Register each field, handle submit, and read validation errors from <code>formState.errors</code>.</li><li>It plugs into a schema resolver (Zod) for validation, covered next.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://react-hook-form.com/docs/useform" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — useForm</span><span class="lc-sub">register, handleSubmit, formState, and Controller.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Render lại ít hơn, ít rườm rà hơn</h2>
<p class="lead">Ở Chương 4 bạn dựng input có-kiểm-soát — mỗi phím set state và render lại. Ổn với một hai trường; với một form lớn nó render lại cả form ở mỗi phím. react-hook-form dùng cách <em>uncontrolled</em>: input tự giữ giá trị trong DOM, và thư viện đọc chúng lúc submit.</p>

<pre><code class="language-typescript">'use client';
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) =&gt; console.log(data);   <span class="tok-comment">// { email, password }</span>

  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('email', { required: 'Email là bắt buộc' })} /&gt;
      {errors.email &amp;&amp; &lt;p&gt;{errors.email.message}&lt;/p&gt;}
      &lt;input type="password" {...register('password')} /&gt;
      &lt;button&gt;Đăng ký&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<div class="callout warn"><strong>Đo trên Next.js 16.4.6 (react-hook-form 7.92.0): trong tệp .tsx đoạn mã này không qua kiểm kiểu.</strong><div class="out">src/app/f/bai/SignupForm.tsx(5,21): error TS7006: Parameter 'data' implicitly has an 'any' type.
src/app/f/bai/SignupForm.tsx(9,27): error TS2322: Type 'string | FieldError | Merge&lt;FieldError, FieldErrorsImpl&lt;any&gt;&gt; | undefined' is not assignable to type 'ReactNode'.</div><code>useForm()</code> không có kiểu thì không biết tên trường nào, nên <code>data</code> là <code>any</code> và <code>errors.email</code> có thể là object lồng. Đặt kiểu cho form là cả hai lỗi biến mất (tsc: 0 lỗi):<pre><code class="language-tsx">'use client';
import { useForm } from 'react-hook-form';

type Signup = { email: string; password: string };

export function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm&lt;Signup&gt;();
  const onSubmit = (data: Signup) =&gt; console.log(data); <span class="tok-comment">  // { email, password }</span>
  return (
    &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
      &lt;input {...register('email', { required: 'Email is required' })} /&gt;
      {errors.email &amp;&amp; &lt;p&gt;{errors.email.message}&lt;/p&gt;}
      &lt;input type="password" {...register('password')} /&gt;
      &lt;button&gt;Sign up&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre></div>
<div class="kv-grid">
  <div class="kv"><span class="k">register('name')</span><span class="v">Nối một input vào form. Gõ không render lại component — lợi hiệu năng lớn so với input có-kiểm-soát.</span></div>
  <div class="kv"><span class="k">handleSubmit</span><span class="v">Gom mọi giá trị, chạy validation, và gọi handler của bạn với một object dữ liệu sạch chỉ khi hợp lệ.</span></div>
  <div class="kv"><span class="k">formState.errors</span><span class="v">Thông báo lỗi theo từng trường để render tại chỗ.</span></div>
  <div class="kv"><span class="k">Controller</span><span class="v">Một cầu nối cho component có-kiểm-soát (một Select tự chế, một date picker) không thể là input uncontrolled thường.</span></div>
</div>

<div class="callout ok">
<p><strong>Vì sao cảm giác nhanh hơn:</strong> vì phím gõ không chảy qua React state, một form 20 trường không render lại ở mỗi ký tự. Bạn được validation, xử lý lỗi, và điều phối submit trong khi gõ vẫn rẻ. Cho form không tầm thường, đây là lựa chọn mặc định.</p>
</div>

<h3>Vì sao có thư viện form</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Mặc định là không kiểm soát</b> — Nó đăng ký các ô nhập bằng ref, nên việc gõ chữ không render lại cả form. Với một form hai mươi trường thì khác biệt đó nhìn thấy được.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Kiểm dữ liệu dưới dạng schema</b> — Một resolver (&#96;zodResolver&#96;) biến một schema thành lỗi ở mức từng trường, nên các luật sống ở một chỗ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó theo dõi những trạng thái mà bạn sẽ phải tự viết</b> — Đã sửa, đã chạm, đang gửi, đã gửi, lỗi theo từng trường. Mỗi cái là một boolean mà nếu không có nó bạn phải tự duy trì.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó vẫn cần máy chủ</b> — Thư viện kiểm cái dáng trong trình duyệt. Chính cái schema đó phải chạy lại trong action.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một ô nhập vẽ ra mà không có &#96;register&#96;, vắng mặt lặng lẽ khỏi các giá trị được gửi.</strong> &#96;&lt;input name="title" /&gt;&#96; bên trong một React Hook Form trông như đã đăng ký vì nó có thuộc tính name, mà thư viện thì chẳng thấy nó: việc đăng ký diễn ra qua &#96;{...register(&#39;title&#39;)}&#96;, không qua thuộc tính. Nên &#96;handleSubmit&#96; đưa cho bạn một object không có title, phần kiểm dữ liệu báo là thiếu, còn cái trường trên màn hình thì rành rành có chữ. Nó hay xảy ra nhất sau khi tách một trường ra thành component con và làm rơi mất phép trải. Khi một giá trị bị thiếu, hãy kiểm phép trải trước khi kiểm schema — và với một ô nhập dạng component thì hãy dùng &#96;Controller&#96; chứ đừng truyền &#96;register&#96; xuống.</p></div>
<a class="link-card dl" href="https://react-hook-form.com/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">React Hook Form — Bắt đầu</span><span class="lc-sub">register, handleSubmit, và mô hình không-kiểm-soát mà nó dựng trên đó.</span></span>
</a>
<a class="link-card dl" href="https://react-hook-form.com/docs/usecontroller/controller" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">React Hook Form — Controller</span><span class="lc-sub">Bọc một component có kiểm soát (bộ chọn ngày, một select) để nó đăng ký đúng cách.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một form với <code>useForm</code>: register các trường, xử lý submit, và hiện lỗi validation từ <code>formState</code>.</li>
<li>Xác nhận nó dùng input uncontrolled bên dưới bằng cách để ý không render lại mỗi lần gõ.</li>
<li>Thêm một luật required và một luật pattern và hiển thị thông báo.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được một form nhanh với react-hook-form và lộ ra lỗi validation của nó.</p></div>

<h3>🔬 Đo thật: render mỗi phím gõ, số byte, và một trường biến mất (Next.js 16.4.6 · next start · Chromium)</h3>
<p>Hai trang cùng 20 ô và một bộ đếm render (<code>useRef</code> tăng trong thân component). Gõ "hello world" (11 phím) vào ô đầu:</p>
<div class="out">kiểm soát (useState):   renders: 1  →  renders: 12
react-hook-form:        renders: 2  →  renders: 2
sau Submit:           renders: 2 · {"field1":"hello world","field2":"","field3":"","field4":"","field5":"","field6"…</div>
<p>Form kiểm soát render mỗi phím gõ; react-hook-form render hai lần lúc khởi tạo rồi thôi — giá trị nằm trong DOM tới khi <code>handleSubmit</code> đọc ra.</p>
<p><strong>Cái giá — JavaScript lần tải đầu của cùng một trang:</strong></p>
<div class="out">$ node -e "….next/diagnostics/route-bundle-stats.json"
/f/rhf            492879 B
/f/thieu          492860 B
/f/kiem-soat      457706 B</div>
<p><strong>Cái bẫy, đo thật — ô có name mà không có <code>register</code> (đã tách ra component con):</strong></p>
<div class="out">My first post ⇒ data = {"body":"hello"}</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -rlE "useForm[&lt;(]" src | sort
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/forgot-password/ForgotPasswordForm.tsx
src/app/reset-password/page.tsx
src/components/auth/ChangePasswordModal.tsx
src/components/games/admin/GameForm.tsx
$ grep -n "useForm&lt;\\|zodResolver(" 'src/app/(auth)/login/page.tsx' | head -3
93:  } = useForm&lt;LoginFormValues&gt;({
94:    resolver: zodResolver(loginSchema),
$ grep -rn "&lt;Controller" src | wc -l | sed 's/^ */chỗ dùng Controller: /'
chỗ dùng Controller: 1</div>Sáu form dùng react-hook-form, có kiểu và nối Zod qua <code>zodResolver</code> — đăng nhập, đăng ký, quên/đặt lại/đổi mật khẩu và form sửa trò chơi. Mọi form client khác dùng <code>useState</code> thường, hợp lý với form nhỏ.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-tsx"><span class="tok-comment">// trong cả hai component: đếm render</span>
const renders = useRef(0);
renders.current += 1;
<span class="tok-comment">// &lt;p&gt;renders: {renders.current}&lt;/p&gt; — gõ 11 phím rồi đọc</span></code></pre>
<pre><code class="language-bash">npm run build &amp;&amp; node -e "for (const r of require('./.next/diagnostics/route-bundle-stats.json')) console.log(r.route, r.firstLoadUncompressedJsBytes)"</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-2-react-hook-form" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.2 — React Hook Form</span><span class="lc-sub">Thư viện từ gốc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-1-controlled" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.1 — Input có kiểm soát</span><span class="lc-sub">Mô hình còn lại, đã đo ở trên</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-9-5-dat-ranh-gioi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 9.5 — Đặt ranh giới client ở đâu</span><span class="lc-sub">Giữ thư viện trong những đảo client nhỏ</span></span></a>

<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">form khai thông tin nhập học hai mươi ô, gõ trên một chiếc điện thoại cũ thì chữ hiện chậm, giật từng phím.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Nếu một ô bị tách ra component con và rơi mất register thì sao? Sinh viên tưởng đã nộp đủ, máy chủ nhận thiếu, không ai báo gì.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kẻ xấu chẳng cần form đẹp: kiểm ở trình duyệt chỉ chặn người ngay thẳng, còn request gửi thẳng thì đi qua hết.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Cách nhận ra: so dữ liệu submit với các ô trên màn hình trong bài test. Cách phòng: máy chủ kiểm lại bằng cùng một schema, bài sau.</span></div>
</div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">react-hook-form</span><span class="v">Một thư viện form dùng input uncontrolled để nhanh.</span></div>
  <div class="kv"><span class="k">useForm</span><span class="v">Hook lộ ra <code>register</code>, <code>handleSubmit</code>, <code>formState</code>.</span></div>
  <div class="kv"><span class="k">register</span><span class="v">Nối một input vào form mà không kiểm soát nó.</span></div>
  <div class="kv"><span class="k">formState.errors</span><span class="v">Nơi chứa lỗi validation của các trường.</span></div>
  <div class="kv"><span class="k">Ít render lại</span><span class="v">Input uncontrolled tránh render lại mỗi lần gõ.</span></div>
  <div class="kv"><span class="k">Resolver</span><span class="v">Cắm một schema (Zod) vào để validate (bài sau).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>react-hook-form dùng input uncontrolled, nên gõ không render lại cả form — nó nhanh.</li><li><code>useForm</code> cho bạn <code>register</code>, <code>handleSubmit</code> và một <code>formState</code> có lỗi.</li><li>Register từng trường, xử lý submit, và đọc lỗi validation từ <code>formState.errors</code>.</li><li>Nó cắm vào một resolver schema (Zod) để validate, nói ở bài sau.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://react-hook-form.com/docs/useform" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">react-hook-form — useForm</span><span class="lc-sub">register, handleSubmit, formState, và Controller.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: '16.3 — Validation with Zod: one schema, both sides|||16.3 — Validation với Zod: một schema, cả hai phía',
      slug: 'nextjs-16-3-zod',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Zod định nghĩa hình dạng dữ liệu MỘT lần, rồi validate cả ở client (qua zodResolver) lẫn ở server (schema.safeParse trong action). Một nguồn sự thật, suy ra được cả kiểu TypeScript.',
      content: `
${G16_3}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Describe the data once, validate it everywhere</h2>
<p class="lead">Validation logic duplicated in the client and the server drifts apart the day someone edits one and not the other. Zod fixes this: you define the shape and rules once as a schema, use it to validate on the client for instant feedback, and use the <em>same</em> schema on the server as the real guard.</p>

<pre><code class="language-javascript">import { z } from 'zod';

export const signupSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  age:      z.number().int().positive().optional(),
});

export type Signup = z.infer&lt;typeof signupSchema&gt;;   <span class="tok-comment">// TS type, for free</span></code></pre>
<div class="callout warn"><strong>Measured on Zod 4.6.7: this runs, with Zod 3 spellings.</strong> <code>z.string().email()</code> and <code>error.flatten()</code> are deprecated in Zod 4: write <code>z.email(&#39;Invalid email&#39;)</code> and <code>z.flattenError(error)</code>. Bad input gives one message per field:<div class="out">fieldErrors: {
 "email": [
  "Invalid email"
 ],
 "password": [
  "At least 8 characters"
 ],
 "age": [
  "Too small: expected number to be &gt;0"
 ]
}</div></div>
<h3>Client side: wire Zod into react-hook-form</h3>
<pre><code class="language-javascript">import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } =
  useForm({ resolver: zodResolver(signupSchema) });</code></pre>
<p>Now the form validates against the schema automatically, and <code>errors</code> carries the messages you wrote in the schema — no separate <code>required</code> rules on each field.</p>

<h3>Server side: the real check</h3>
<pre><code class="language-javascript">async function signup(formData) {
  'use server';
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { errors: parsed.error.flatten() };   <span class="tok-comment">// reject bad input</span>
  await createUser(parsed.data);                                     <span class="tok-comment">// parsed.data is typed &amp; clean</span>
}</code></pre>
<div class="callout warn"><strong>Measured: pasted into a .ts file, this server half does not type-check.</strong><div class="out">src/app/z/bai-server.ts(2,23): error TS7006: Parameter 'formData' implicitly has an 'any' type.
src/app/z/bai-server.ts(9,9): error TS2304: Cannot find name 'createUser'.</div>Type the input as <code>unknown</code> — <code>safeParse</code> is what narrows it — and use your own data layer:<pre><code class="language-typescript">'use server';
<span class="tok-comment">// app/z/actions.ts — the server half, typed (Zod 4)</span>
import { z } from 'zod';
import { signupSchema } from '@/lib/signup-schema';

export async function signupAction(input: unknown) {   <span class="tok-comment">  // unknown: the bytes come from outside</span>
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, errors: z.flattenError(parsed.error).fieldErrors };
  await createUser(parsed.data);                       <span class="tok-comment">  // your own data layer; parsed.data is typed &amp; clean</span>
  return { ok: true as const };
}</code></pre></div>
<div class="kv-grid">
  <div class="kv"><span class="k">One source of truth</span><span class="v">Change a rule once; both sides update. No drift between client and server validation.</span></div>
  <div class="kv"><span class="k">Types for free</span><span class="v"><code>z.infer</code> derives the TypeScript type from the schema — no hand-written duplicate that can fall out of sync.</span></div>
  <div class="kv"><span class="k">Server is authoritative</span><span class="v">Client validation is UX; <code>safeParse</code> on the server is what actually rejects bad or malicious input.</span></div>
</div>

<h3>One schema, both sides</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Declare the shape once</b> — &#96;const CreateNote = z.object({ title: z.string().min(1), tags: z.array(z.string()) })&#96;. It is a runtime value, so it survives compilation.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Derive the type from it</b> — &#96;type CreateNote = z.infer&lt;typeof CreateNote&gt;&#96;. The check and the type cannot drift apart, because one produces the other.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Parse at the boundary</b> — In the Server Action, on the FormData. Not &#96;as CreateNote&#96; — that is a claim, and the bytes came from outside.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>safeParse, then narrow</b> — &#96;{ success: true, data }&#96; or &#96;{ success: false, error }&#96;. Return the field errors to the form rather than throwing.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a schema that describes what you type, not what the browser sends.</strong> &#96;z.object({ count: z.number() })&#96; fails on every submission, because &#96;FormData&#96; values are always strings: &quot;3&quot; is not a number, and the error says &quot;Invalid input: expected number, received string&quot; (Zod 4.6.7, measured) on a field that visibly contains 3. The same applies to a checkbox (&#96;&#39;on&#39;&#96; or absent, never a boolean) and a date. Use &#96;z.coerce.number()&#96; and friends for form input, and remember that &#96;z.infer&#96; then gives you the <em>output</em> type — the input type is different, which matters the moment you use that type for a function parameter.</p></div>
<a class="link-card dl" href="https://zod.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">Zod — documentation</span><span class="lc-sub">Every type, coercion, refinement and the input/output distinction.</span></span>
</a>
<a class="link-card dl" href="https://github.com/react-hook-form/resolvers" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">@hookform/resolvers</span><span class="lc-sub">Wiring the same schema into React Hook Form, so one declaration drives both sides.</span></span>
</a>


<h3>🔬 Measured: one schema on both sides, and what FormData really sends (Zod 4.6.7 · Next.js 16.4.6 · Chromium)</h3>
<p>The same <code>signupSchema</code> imported by the form (<code>zodResolver</code>) and by the Server Action (<code>safeParse</code>):</p>
<div class="out">form, bad email + 3-char password:  Invalid email | At least 8 characters  (POST requests sent: 0)
form, valid data:  {"ok":true}
action called directly ({ email: 'x', password: '1' }):
  {"ok":false,"errors":{"email":["Invalid email"],"password":["At least 8 characters"]}}
[signup] #1 an@lab.test via zod action
[action] rejected: {"email":"x","password":"1"}</div>
<p><strong>FormData values are strings — every coercion measured:</strong></p>
<div class="out">FormData → {"count":"3","agree":"on"}
z.number()                     FAIL Invalid input: expected number, received string
z.coerce.number()              OK   {"count":3}
z.coerce.number() · ""         OK   {"count":0}
z.boolean() · "on"             FAIL Invalid input: expected boolean, received string
z.coerce.boolean() · "false"   OK   {"agree":true}
z.stringbool() · "on"          OK   {"agree":true}
z.stringbool() · "false"       OK   {"agree":false}
z.stringbool() · missing       FAIL Invalid input: expected string, received undefined</div>
<p>An empty field coerces to <code>0</code> without an error, and <code>z.coerce.boolean()</code> turns "false" into <code>true</code> (any non-empty string is truthy). For checkboxes use <code>z.stringbool()</code> with <code>.default(false)</code>.</p>
<p><strong>Input type vs output type of a coerced schema (printed by tsc):</strong></p>
<div class="out">error TS2322: Type 'number' is not assignable to type '[{ count: unknown; }, { count: number; }]'.</div>
<p>And keys the schema does not know are dropped — a free guard, as long as you pass <code>parsed.data</code> on:</p>
<div class="out">extra field "role": {"email":"an@lab.test","password":"correct-horse"}</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n '"zod"' frontend/package.json package.json
frontend/package.json:111:    "zod": "^3.23.8",
package.json:148:    "zod": "^3.23.8"
$ sed -n '/const registerSchema = z/,/^  })/p' 'frontend/src/app/(auth)/register/page.tsx' | grep -nE "min\\(12|regex\\(/\\[A-Z\\]"
12:      .min(12, 'Password must be at least 12 characters')
14:      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
$ grep -n "'/register'" -A20 src/routes/auth.routes.ts | grep -E "isLength\\(\\{ min: 12|matches\\(/\\[A-Z\\]/\\)"
72-      .isLength({ min: 12, max: 100 })
74-      .matches(/[A-Z]/)</div>The register password rule exists twice: a Zod schema in the Next.js form and express-validator rules on the Express route. They agree today; every change is two edits. A small shared package exporting the schema would make it one.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-typescript">import { z } from 'zod';
const fd = new FormData(); fd.set('count', '3'); fd.set('agree', 'on');
console.log(z.object({ count: z.number() }).safeParse(Object.fromEntries(fd)).error?.issues[0].message);
console.log(z.coerce.number().parse(''), z.coerce.boolean().parse('false'), z.stringbool().parse('on'));</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-3-loi" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.3 — Showing form errors</span><span class="lc-sub">Turning field errors into readable UI</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-5-bao-mat-action" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.5 — An action is a public endpoint</span><span class="lc-sub">Why the action parses again</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-3-validate-schema" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 6.3 — Validation with a schema</span><span class="lc-sub">The same idea on an Express API</span></span></a>

<h3>🌏 Not just theory: real life, what-ifs, attackers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">the quantity box in a cart, the 'I agree' checkbox, a date of birth — all reach the server as strings.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">What if a 'send me promotions' checkbox uses z.coerce.boolean() and a client sends the string 'false'? Someone who opted out still gets email.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker&#39;s angle</span><span class="v">An attacker adds keys you did not expect, like role: 'admin', hoping the server copies them into the database — mass assignment.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Prevent it: z.object drops unknown keys; use parsed.data only; test empty fields and the string 'false'.</span></div>
</div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Zod</span><span class="v">A TypeScript-first schema library for validation.</span></div>
  <div class="kv"><span class="k">Schema</span><span class="v">A declarative description of valid data.</span></div>
  <div class="kv"><span class="k">parse / safeParse</span><span class="v">Validate data, throwing or returning a result.</span></div>
  <div class="kv"><span class="k">Inferred type</span><span class="v"><code>z.infer</code> derives the TypeScript type from the schema.</span></div>
  <div class="kv"><span class="k">One schema, both sides</span><span class="v">Reuse the same schema on client and server.</span></div>
  <div class="kv"><span class="k">Server trust</span><span class="v">Always validate on the server, even if the client did.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Zod describes valid data as a schema and validates with <code>parse</code>/<code>safeParse</code>.</li><li><code>z.infer</code> derives the TypeScript type from the schema — one source of truth.</li><li>Reuse one schema on both the client (instant feedback) and the server (real enforcement).</li><li>Client validation is UX; server validation is security — always do the server side.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://zod.dev" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">zod.dev</span><span class="lc-sub">Schemas, parse vs safeParse, and z.infer for types.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Mô tả dữ liệu một lần, validate ở mọi nơi</h2>
<p class="lead">Logic validation lặp ở client và server sẽ trôi lệch vào ngày ai đó sửa một bên mà quên bên kia. Zod chữa điều này: bạn định nghĩa hình dạng và luật một lần thành một schema, dùng nó validate ở client cho phản hồi tức thì, và dùng <em>cùng</em> schema đó ở server làm lá chắn thật.</p>

<pre><code class="language-javascript">import { z } from 'zod';

export const signupSchema = z.object({
  email:    z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Ít nhất 8 ký tự'),
  age:      z.number().int().positive().optional(),
});

export type Signup = z.infer&lt;typeof signupSchema&gt;;   <span class="tok-comment">// kiểu TS, miễn phí</span></code></pre>
<div class="callout warn"><strong>Đo trên Zod 4.6.7: đoạn này chạy được, nhưng là cách viết của Zod 3.</strong> <code>z.string().email()</code> và <code>error.flatten()</code> đã bị Zod 4 đánh dấu bỏ: viết <code>z.email(&#39;Invalid email&#39;)</code> và <code>z.flattenError(error)</code>. Dữ liệu sai cho mỗi trường một thông báo:<div class="out">fieldErrors: {
 "email": [
  "Invalid email"
 ],
 "password": [
  "At least 8 characters"
 ],
 "age": [
  "Too small: expected number to be &gt;0"
 ]
}</div></div>
<h3>Phía client: nối Zod vào react-hook-form</h3>
<pre><code class="language-javascript">import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } =
  useForm({ resolver: zodResolver(signupSchema) });</code></pre>
<p>Giờ form tự validate theo schema, và <code>errors</code> mang các thông báo bạn viết trong schema — không cần luật <code>required</code> riêng trên từng trường.</p>

<h3>Phía server: phép kiểm thật</h3>
<pre><code class="language-javascript">async function signup(formData) {
  'use server';
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { errors: parsed.error.flatten() };   <span class="tok-comment">// từ chối input xấu</span>
  await createUser(parsed.data);                                     <span class="tok-comment">// parsed.data đã có kiểu &amp; sạch</span>
}</code></pre>
<div class="callout warn"><strong>Đo: chép vào tệp .ts, nửa phía server này không qua kiểm kiểu.</strong><div class="out">src/app/z/bai-server.ts(2,23): error TS7006: Parameter 'formData' implicitly has an 'any' type.
src/app/z/bai-server.ts(9,9): error TS2304: Cannot find name 'createUser'.</div>Đặt kiểu tham số là <code>unknown</code> — chính <code>safeParse</code> thu hẹp nó — và dùng lớp dữ liệu của bạn:<pre><code class="language-typescript">'use server';
<span class="tok-comment">// app/z/actions.ts — the server half, typed (Zod 4)</span>
import { z } from 'zod';
import { signupSchema } from '@/lib/signup-schema';

export async function signupAction(input: unknown) {   <span class="tok-comment">  // unknown: the bytes come from outside</span>
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, errors: z.flattenError(parsed.error).fieldErrors };
  await createUser(parsed.data);                       <span class="tok-comment">  // your own data layer; parsed.data is typed &amp; clean</span>
  return { ok: true as const };
}</code></pre></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một nguồn sự thật</span><span class="v">Đổi một luật một lần; cả hai phía cập nhật. Không trôi lệch giữa validation client và server.</span></div>
  <div class="kv"><span class="k">Kiểu miễn phí</span><span class="v"><code>z.infer</code> suy ra kiểu TypeScript từ schema — không có bản chép tay có thể lệch nhịp.</span></div>
  <div class="kv"><span class="k">Server có thẩm quyền</span><span class="v">Validation client là UX; <code>safeParse</code> trên server mới thật sự từ chối input xấu hoặc độc hại.</span></div>
</div>

<h3>Một schema, dùng cho cả hai phía</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Khai cái dáng một lần</b> — &#96;const CreateNote = z.object({ title: z.string().min(1), tags: z.array(z.string()) })&#96;. Nó là một giá trị lúc chạy, nên nó sống sót qua biên dịch.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Dẫn xuất kiểu từ nó</b> — &#96;type CreateNote = z.infer&lt;typeof CreateNote&gt;&#96;. Phép kiểm và cái kiểu không thể trôi dạt khỏi nhau, vì cái này sinh ra cái kia.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Phân tích ở biên</b> — Trong Server Action, trên FormData. Đừng dùng &#96;as CreateNote&#96; — đó là một khẳng định, còn các byte thì đến từ bên ngoài.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>safeParse, rồi thu hẹp</b> — &#96;{ success: true, data }&#96; hoặc &#96;{ success: false, error }&#96;. Hãy trả lỗi theo từng trường về cho form thay vì ném lỗi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một schema mô tả thứ bạn gõ, chứ không mô tả thứ trình duyệt gửi.</strong> &#96;z.object({ count: z.number() })&#96; hỏng ở mọi lần gửi, vì giá trị trong &#96;FormData&#96; luôn là chuỗi: &quot;3&quot; không phải một con số, và lỗi ghi &quot;Invalid input: expected number, received string&quot; (Zod 4.6.7, đã đo) trên một trường rành rành chứa số 3. Chuyện tương tự với một ô tích (&#96;&#39;on&#39;&#96; hoặc vắng mặt, không bao giờ là boolean) và với một ngày. Hãy dùng &#96;z.coerce.number()&#96; và các anh em của nó cho đầu vào từ form, và nhớ rằng khi đó &#96;z.infer&#96; cho bạn kiểu <em>đầu ra</em> — kiểu đầu vào thì khác, và điều đó có ý nghĩa ngay khi bạn dùng cái kiểu ấy cho một tham số hàm.</p></div>
<a class="link-card dl" href="https://zod.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">🧾</span>
  <span class="lc-body"><span class="lc-title">Zod — tài liệu</span><span class="lc-sub">Mọi kiểu, phép ép kiểu, phép tinh chỉnh và sự phân biệt đầu vào/đầu ra.</span></span>
</a>
<a class="link-card dl" href="https://github.com/react-hook-form/resolvers" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">@hookform/resolvers</span><span class="lc-sub">Đấu chính schema đó vào React Hook Form, để một khai báo lo cả hai phía.</span></span>
</a>


<h3>🔬 Đo thật: một schema hai phía, và thứ FormData thật sự gửi (Zod 4.6.7 · Next.js 16.4.6 · Chromium)</h3>
<p>Cùng một <code>signupSchema</code> được form (<code>zodResolver</code>) và Server Action (<code>safeParse</code>) import:</p>
<div class="out">form, email sai + mật khẩu 3 ký tự:  Invalid email | At least 8 characters  (số POST đã gửi: 0)
form, dữ liệu đúng:  {"ok":true}
gọi thẳng action ({ email: 'x', password: '1' }):
  {"ok":false,"errors":{"email":["Invalid email"],"password":["At least 8 characters"]}}
[signup] #1 an@lab.test via zod action
[action] rejected: {"email":"x","password":"1"}</div>
<p><strong>Giá trị FormData là chuỗi — đo từng cách ép kiểu:</strong></p>
<div class="out">FormData → {"count":"3","agree":"on"}
z.number()                     FAIL Invalid input: expected number, received string
z.coerce.number()              OK   {"count":3}
z.coerce.number() · ""         OK   {"count":0}
z.boolean() · "on"             FAIL Invalid input: expected boolean, received string
z.coerce.boolean() · "false"   OK   {"agree":true}
z.stringbool() · "on"          OK   {"agree":true}
z.stringbool() · "false"       OK   {"agree":false}
z.stringbool() · missing       FAIL Invalid input: expected string, received undefined</div>
<p>Ô trống ép thành <code>0</code> mà không báo lỗi, và <code>z.coerce.boolean()</code> biến "false" thành <code>true</code> (chuỗi không rỗng nào cũng truthy). Với ô tích hãy dùng <code>z.stringbool()</code> kèm <code>.default(false)</code>.</p>
<p><strong>Kiểu đầu vào và kiểu đầu ra của schema có ép kiểu (tsc in ra):</strong></p>
<div class="out">error TS2322: Type 'number' is not assignable to type '[{ count: unknown; }, { count: number; }]'.</div>
<p>Và khoá schema không biết sẽ bị bỏ — một lớp chắn miễn phí, miễn là bạn dùng <code>parsed.data</code>:</p>
<div class="out">extra field "role": {"email":"an@lab.test","password":"correct-horse"}</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n '"zod"' frontend/package.json package.json
frontend/package.json:111:    "zod": "^3.23.8",
package.json:148:    "zod": "^3.23.8"
$ sed -n '/const registerSchema = z/,/^  })/p' 'frontend/src/app/(auth)/register/page.tsx' | grep -nE "min\\(12|regex\\(/\\[A-Z\\]"
12:      .min(12, 'Password must be at least 12 characters')
14:      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
$ grep -n "'/register'" -A20 src/routes/auth.routes.ts | grep -E "isLength\\(\\{ min: 12|matches\\(/\\[A-Z\\]/\\)"
72-      .isLength({ min: 12, max: 100 })
74-      .matches(/[A-Z]/)</div>Luật mật khẩu đăng ký tồn tại hai bản: schema Zod ở form Next.js và luật express-validator ở route Express. Hôm nay chúng khớp nhau; mỗi lần đổi là hai chỗ phải sửa. Một gói nhỏ dùng chung xuất schema sẽ gom về một.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-typescript">import { z } from 'zod';
const fd = new FormData(); fd.set('count', '3'); fd.set('agree', 'on');
console.log(z.object({ count: z.number() }).safeParse(Object.fromEntries(fd)).error?.issues[0].message);
console.log(z.coerce.number().parse(''), z.coerce.boolean().parse('false'), z.stringbool().parse('on'));</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-3-loi" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.3 — Hiện lỗi form</span><span class="lc-sub">Biến lỗi từng trường thành giao diện dễ đọc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-5-bao-mat-action" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.5 — Một action là endpoint công khai</span><span class="lc-sub">Vì sao action phải parse lại</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-6-3-validate-schema" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 6.3 — Kiểm tra dữ liệu bằng lược đồ</span><span class="lc-sub">Cùng ý tưởng trên API Express</span></span></a>

<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">ô số lượng trong giỏ hàng, ô tích đồng ý điều khoản, ô ngày sinh. Tất cả tới máy chủ dưới dạng chuỗi.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Nếu ô nhận thư quảng cáo dùng coerce boolean, và có client gửi chữ false thì sao? Người đã từ chối vẫn bị gửi thư.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kẻ xấu gửi kèm những khoá bạn không ngờ, như role bằng admin, mong máy chủ chép thẳng vào cơ sở dữ liệu. Lỗi này gọi là mass assignment.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Cách phòng: z.object bỏ khoá lạ, chỉ dùng parsed.data, và thử cả ô trống, chữ false trong bài test.</span></div>
</div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Zod</span><span class="v">Một thư viện schema ưu tiên TypeScript để validate.</span></div>
  <div class="kv"><span class="k">Schema</span><span class="v">Một mô tả khai báo về dữ liệu hợp lệ.</span></div>
  <div class="kv"><span class="k">parse / safeParse</span><span class="v">Validate dữ liệu, ném lỗi hoặc trả về một kết quả.</span></div>
  <div class="kv"><span class="k">Kiểu suy ra</span><span class="v"><code>z.infer</code> dẫn ra kiểu TypeScript từ schema.</span></div>
  <div class="kv"><span class="k">Một schema, hai phía</span><span class="v">Dùng lại cùng một schema ở client và server.</span></div>
  <div class="kv"><span class="k">Tin server</span><span class="v">Luôn validate trên server, kể cả khi client đã làm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Zod mô tả dữ liệu hợp lệ thành một schema và validate bằng <code>parse</code>/<code>safeParse</code>.</li><li><code>z.infer</code> dẫn ra kiểu TypeScript từ schema — một nguồn sự thật.</li><li>Dùng lại một schema ở cả client (phản hồi tức thì) và server (thực thi thật).</li><li>Validate client là UX; validate server là bảo mật — luôn làm phía server.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://zod.dev" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">zod.dev</span><span class="lc-sub">Schema, parse vs safeParse, và z.infer cho kiểu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: '16.4 — File uploads: from the browser to storage|||16.4 — Upload file: từ trình duyệt tới storage',
      slug: 'nextjs-16-4-upload-file',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'File không lưu trong DB mà đưa lên object storage (R2/S3). Hai mẫu: upload qua endpoint của bạn, hoặc presigned URL để trình duyệt tải thẳng. Và bạn lưu cái KHOÁ, không phải cả file.',
      content: `
${G16_4}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>Files go to object storage, not your database</h2>
<p class="lead">A form can carry a file — an avatar, a document, a video. You do not store the bytes in your database; you upload them to <strong>object storage</strong> (Cloudflare R2, AWS S3, etc.) and save only a reference — the object <em>key</em> or URL — in the database.</p>

<h3>Two upload patterns</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Through your server</span><span class="v">Browser sends the file to your Route Handler / Server Action; your server streams it to storage. Simple, and you can validate before storing. The file passes through your server.</span></div>
  <div class="kv"><span class="k">Presigned URL (direct)</span><span class="v">Your server issues a short-lived signed URL; the browser uploads <em>directly</em> to storage. Better for large files — the bytes skip your server. You still record the resulting key.</span></div>
</div>

<pre><code class="language-typescript"><span class="tok-comment">// A form that carries a file uses multipart; FormData handles it</span>
&lt;form action={uploadAvatar}&gt;
  &lt;input type="file" name="avatar" accept="image/*" /&gt;
  &lt;button&gt;Upload&lt;/button&gt;
&lt;/form&gt;

<span class="tok-comment">// server: read the File out of FormData, then push to storage</span>
async function uploadAvatar(formData) {
  'use server';
  const file = formData.get('avatar');            <span class="tok-comment">// a File object</span>
  const key = &#96;avatars/\${user.id}/\${file.name}&#96;;
  await storage.put(key, file);                    <span class="tok-comment">// upload to R2/S3</span>
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>
<div class="callout warn"><strong>Measured on Next.js 16.4.6: the snippet is a sketch, and a Server Action stops at 1 MB.</strong><div class="out">src/app/up/bai.ts(1,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.
src/app/up/bai.ts(4,26): error TS2304: Cannot find name 'user'.
src/app/up/bai.ts(5,9): error TS2552: Cannot find name 'storage'. Did you mean 'Storage'?
src/app/up/bai.ts(6,9): error TS2304: Cannot find name 'db'.
src/app/up/bai.ts(6,39): error TS2304: Cannot find name 'user'.</div>A version that runs against a real S3 API (a local MinIO; same calls for R2):<pre><code class="language-typescript">'use server';
<span class="tok-comment">// app/up/actions.ts — runs (Next.js 16.4.6 + @aws-sdk/client-s3; R2, S3 and MinIO speak the same API)</span>
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/current-user'; <span class="tok-comment">  // lesson 15.4</span>
import { s3, BUCKET, avatarKeys } from '@/lib/s3';    <span class="tok-comment">  // an S3Client + your data layer</span>

export async function uploadAvatar(formData: FormData) {
  const user = await getCurrentUser();
  const file = formData.get('avatar');
  if (!user || !(file instanceof File)) return;
  const key = &#96;avatars/\${user.id}/\${file.name}&#96;;      <span class="tok-comment">  // 16.5: never trust file.name like this</span>
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));
  avatarKeys.set(user.id, key);                       <span class="tok-comment">  // the database keeps the KEY</span>
  revalidatePath('/up');
}</code></pre>Then the size limit — a 200 KB image is saved, a 2 MB image is refused by Next.js itself, and the page shows <em>no</em> error (it still displays the old key):<div class="out">saved key: avatars/1/anh-200kb.jpg
# 2 MB, server log:
⨯ Error: Body exceeded 1 MB limit.
statusCode: 413,</div>Raising <code>serverActions.bodySizeLimit</code> only moves the problem into memory (measured below).</div>
<div class="note-ct">
<p><strong>How cuongthai.com stores media:</strong> uploads go to Cloudflare R2 and the database keeps the R2 <em>key</em>, not the file. A helper turns a stored key into a full CDN URL for display (the site serves media from a CDN host, required by its CSP). Storing keys, not URLs, means the CDN domain can change without rewriting every row.</p>
</div>

<div class="pitfall">
<p><strong>The blob:/data: preview trap — a real cuongthai.com bug.</strong> When you show an <em>optimistic preview</em> of a just-picked file, the browser gives you a local <code>blob:</code> or <code>data:</code> URL — already renderable as-is. A helper that blindly prepends the CDN base to <em>every</em> image value turned those into <code>https://cdn.../blob:...</code> and broke the preview (a 400). The fix: object/data URLs are already complete — return them untouched; only prepend the CDN base to bare storage keys. When building a media-URL helper, branch on whether the value is already a full/blob/data URL before adding any prefix.</p>
</div>

<h3>Where an uploaded file should go</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Not into your database</b> — A blob column makes every backup huge and every query slower. Store the file elsewhere and keep a URL.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Not onto the app server&#39;s disk</b> — A container is replaced on every deploy, and a second instance cannot see the first one&#39;s files.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Into object storage</b> — S3, R2, or similar. Durable, cheap, served by a CDN, and independent of your app&#39;s lifecycle.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Directly, with a presigned URL</b> — The browser uploads straight to storage; your server only signs the request. The file never passes through your process.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — routing every upload through the Next.js server.</strong> Accepting the file in a Server Action and forwarding it to storage works on a 200KB avatar and falls over on a 40MB video: the request body has to be buffered, serverless platforms cap it (4.5MB on Vercel), and on a VPS it is memory you did not budget for — several concurrent uploads and the process is killed. The failure is a 413 or a container restart, neither of which mentions upload size. Presigned URLs move the bytes browser-to-storage and leave your server signing a short string, which scales the same whether the file is 1MB or 1GB.</p></div>
<a class="link-card dl" href="https://developers.cloudflare.com/r2/api/s3/presigned-urls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cloudflare R2 — Presigned URLs</span><span class="lc-sub">Generating an upload URL server-side, with the expiry and scope options.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body-formdata" target="_blank" rel="noopener">
  <span class="lc-ico">📤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Handling FormData uploads</span><span class="lc-sub">When routing through the server is the right choice, and its limits.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build a form that sends a file as <code>FormData</code> to the server; read it from the request and get its size and type.</li>
<li>Switch to a presigned-URL flow: the server signs an upload URL, the browser uploads directly to storage.</li>
<li>Explain why large files should not pass through your server as <code>FormData</code>.</li>
</ol>
<p><strong>Done when:</strong> you can upload a file both via FormData and via a presigned URL, and know when to use each.</p></div>

<h3>🔬 Measured: through the server vs a presigned URL (MinIO · @aws-sdk/client-s3 3.1169.0 · Next.js 16.4.6)</h3>
<p>Through the server — a Route Handler reading <code>req.formData()</code>, with the process memory (RSS) before and while reading:</p>
<div class="out">$ curl -s -F file=@anh-200kb.jpg localhost:3000/api/upload
{"key":"uploads/32ed7314-9d4f-48f4-b80d-5eaa3f55a750-anh-200kb.jpg","size":204800,"rss":"121.2 MB → 121.8 MB"}
$ curl -s -F file=@video-40mb.mp4 localhost:3000/api/upload
{"key":"uploads/896ea12d-8151-4a20-ac17-35bef6e14e67-video-40mb.mp4","size":41943040,"rss":"124.0 MB → 343.7 MB"}</div>
<p>One 40 MB file cost the process about 220 MB: the body is buffered, then copied again by <code>arrayBuffer()</code>.</p>
<p><strong>A presigned URL — the server signs, the client uploads straight to storage:</strong></p>
<div class="out">$ curl -s -X POST localhost:3000/api/presign -d '{"name":"video-40mb.mp4","type":"video/mp4"}'
{"key":"uploads/6879b4b7-cabe-4f90-948a-82a9d2a5f6ce-video-40mb.mp4","rss":"344.0 MB"}
url: http://127.0.0.1:19319/nxj-lab/uploads/6879b4b7-cabe-4…?X-Amz-Algorithm&amp;X-Amz-Content-Sha256&amp;X-Amz-Credential&amp;X-Amz-Date&amp;X-Amz-Expires&amp;X-Amz-Signature&amp;X-Amz-SignedHeaders&amp;x-amz-checksum-crc32&amp;x-amz-sdk-checksum-algorithm&amp;x-id
$ curl -s -o /dev/null -w '%{http_code}\\n' -X PUT -H 'content-type: video/mp4' --upload-file video-40mb.mp4 "$URL"
200
$ curl -s "localhost:3000/api/obj?key=$KEY"
{"key":"uploads/6879b4b7-cabe-4f90-948a-82a9d2a5f6ce-video-40mb.mp4","bytes":41943040,"type":"video/mp4"}
# someone edits the key inside the signed URL
$ curl -s -X PUT --upload-file anh-200kb.jpg "\${URL/video-40mb/evil}" | grep -o '&lt;Code&gt;[^&lt;]*'
SignatureDoesNotMatch
# a URL signed for 5 seconds, used after 6
$ sleep 6
$ curl -s -X PUT --upload-file anh-200kb.jpg "$URL5" | grep -oE '&lt;(Code|Message)&gt;[^&lt;]*'
AccessDenied
Request has expired</div>
<p><strong>The <code>blob:</code> preview bug, reproduced:</strong></p>
<div class="out">in:    avatars/1/me.jpg
naive: https://media.cuongthai.com/avatars/1/me.jpg
fixed: https://media.cuongthai.com/avatars/1/me.jpg
in:    blob:http://localhost:3000/7c1e9a52-0b6d-4e1f-9f43-2a7d1b6c0
naive: https://media.cuongthai.com/blob:http://localhost:3000/7c1e9a52-0b6d-4e1
fixed: blob:http://localhost:3000/7c1e9a52-0b6d-4e1f-9f43-2a7d1b6c0e11
in:    data:image/png;base64,iVBORw0KGgo=
naive: https://media.cuongthai.com/data:image/png;base64,iVBORw0KGgo=
fixed: data:image/png;base64,iVBORw0KGgo=</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ sed -n '219,220p' frontend/src/lib/utils.ts
  if (lp.startsWith('blob:') || lp.startsWith('data:')) return lp;
  if (au.startsWith('blob:') || au.startsWith('data:')) return au;
$ git log --format='%h %ad %s' --date=short -S"lp.startsWith('blob:')" -- frontend/src/lib/utils.ts | tail -1
4448f4d14 2026-07-02 fix(media+auth): stop blob: URLs hitting R2 (400) + silent session refresh
$ grep -rln "multer" src/routes | wc -l | sed 's/^ */tệp route dùng multer: /'
tệp route dùng multer: 31
$ grep -rn "multer.memoryStorage()" src/routes | wc -l | sed 's/^ */multer.memoryStorage(): /'
multer.memoryStorage(): 40
$ grep -rln "getSignedUploadUrl" src | grep -v test | grep -v "config/r2.ts" | wc -l | sed 's/^ */tệp gọi getSignedUploadUrl: /'
tệp gọi getSignedUploadUrl: 7</div>The fix for the blob: bug is in <code>getMediaUrl</code> since 2026-07-02. The backend uses both patterns: multer with <code>memoryStorage()</code> and a per-route <code>fileSize</code> limit for small files, and <code>getSignedUploadUrl</code> (presigned PUT to R2) in seven places for direct uploads.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">docker run -d -p 127.0.0.1:9000:9000 -e MINIO_ROOT_USER=lab -e MINIO_ROOT_PASSWORD=lab-secret-123 minio/minio server /data
npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
head -c 41943040 /dev/urandom &gt; big.bin
curl -s -F file=@big.bin localhost:3000/api/upload        <span class="tok-comment">  # watch the RSS</span>
curl -X PUT --upload-file big.bin "$(curl -s -X POST localhost:3000/api/presign -d '{}' | jq -r .url)"</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-0-1-vs-fs" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 0.1 — Object storage vs file system</span><span class="lc-sub">Three differences that decide where files live</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-4-1-vi-sao" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 4.1 — Why direct upload from the browser</span><span class="lc-sub">Bypassing server limits, in depth</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-15-4-doc-nguoi-dung" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 15.4 — Reading the current user</span><span class="lc-sub">Who is uploading — read inside the action</span></span></a>

<h3>🌏 Not just theory: real life, what-ifs, attackers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">changing a profile picture, or the whole class submitting assignments to the school system minutes before the deadline.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">What if 100 students upload a 40 MB video through the server at once? At ~220 MB of memory per file, the server runs out of RAM at the deadline.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker&#39;s angle</span><span class="v">Attackers look for presign routes that do not check the caller and turn your bucket into free hosting for their files.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Detect unusual bucket growth and strange keys. Prevent it: authenticate before signing, short expiry, server-chosen keys.</span></div>
</div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">FormData upload</span><span class="v">Send a file to the server in a multipart form.</span></div>
  <div class="kv"><span class="k">Presigned URL</span><span class="v">A short-lived signed URL the browser uploads directly to.</span></div>
  <div class="kv"><span class="k">Direct-to-storage</span><span class="v">The file bypasses your server, going straight to object storage.</span></div>
  <div class="kv"><span class="k">Content-Type</span><span class="v">The file's MIME type, needed so it serves correctly later.</span></div>
  <div class="kv"><span class="k">Size limits</span><span class="v">Server routes have body limits; large files need presigned uploads.</span></div>
  <div class="kv"><span class="k">Object storage</span><span class="v">S3/R2 where the uploaded file is stored (see the Object Storage course).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Small files can go to the server as <code>FormData</code>; read them from the request with their type and size.</li><li>Large files should use a presigned URL so the browser uploads directly to object storage, bypassing your server.</li><li>Set the correct <code>Content-Type</code> so the file serves properly later.</li><li>The Object Storage course covers the storage side (S3/R2) in depth.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">📤</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData &amp; file uploads</span><span class="lc-sub">Reading File objects, multipart forms, and object URLs.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>File lên object storage, không phải database của bạn</h2>
<p class="lead">Một form có thể mang một file — avatar, tài liệu, video. Bạn không lưu bytes trong database; bạn upload chúng lên <strong>object storage</strong> (Cloudflare R2, AWS S3, v.v.) và chỉ lưu một tham chiếu — <em>khoá</em> object hoặc URL — trong database.</p>

<h3>Hai mẫu upload</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Qua server của bạn</span><span class="v">Trình duyệt gửi file tới Route Handler / Server Action của bạn; server stream nó lên storage. Đơn giản, và bạn validate được trước khi lưu. File đi qua server.</span></div>
  <div class="kv"><span class="k">Presigned URL (trực tiếp)</span><span class="v">Server cấp một URL đã ký, sống ngắn; trình duyệt upload <em>thẳng</em> lên storage. Tốt cho file lớn — bytes bỏ qua server. Bạn vẫn ghi lại khoá kết quả.</span></div>
</div>

<pre><code class="language-typescript"><span class="tok-comment">// Một form mang file dùng multipart; FormData lo việc đó</span>
&lt;form action={uploadAvatar}&gt;
  &lt;input type="file" name="avatar" accept="image/*" /&gt;
  &lt;button&gt;Upload&lt;/button&gt;
&lt;/form&gt;

<span class="tok-comment">// server: đọc File ra khỏi FormData, rồi đẩy lên storage</span>
async function uploadAvatar(formData) {
  'use server';
  const file = formData.get('avatar');            <span class="tok-comment">// một object File</span>
  const key = &#96;avatars/\${user.id}/\${file.name}&#96;;
  await storage.put(key, file);                    <span class="tok-comment">// upload lên R2/S3</span>
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>
<div class="callout warn"><strong>Đo trên Next.js 16.4.6: đoạn mã là bản phác, và Server Action dừng ở 1 MB.</strong><div class="out">src/app/up/bai.ts(1,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.
src/app/up/bai.ts(4,26): error TS2304: Cannot find name 'user'.
src/app/up/bai.ts(5,9): error TS2552: Cannot find name 'storage'. Did you mean 'Storage'?
src/app/up/bai.ts(6,9): error TS2304: Cannot find name 'db'.
src/app/up/bai.ts(6,39): error TS2304: Cannot find name 'user'.</div>Bản chạy được với một API S3 thật (MinIO trong máy; R2 dùng đúng các lời gọi này):<pre><code class="language-typescript">'use server';
<span class="tok-comment">// app/up/actions.ts — runs (Next.js 16.4.6 + @aws-sdk/client-s3; R2, S3 and MinIO speak the same API)</span>
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/current-user'; <span class="tok-comment">  // lesson 15.4</span>
import { s3, BUCKET, avatarKeys } from '@/lib/s3';    <span class="tok-comment">  // an S3Client + your data layer</span>

export async function uploadAvatar(formData: FormData) {
  const user = await getCurrentUser();
  const file = formData.get('avatar');
  if (!user || !(file instanceof File)) return;
  const key = &#96;avatars/\${user.id}/\${file.name}&#96;;      <span class="tok-comment">  // 16.5: never trust file.name like this</span>
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type }));
  avatarKeys.set(user.id, key);                       <span class="tok-comment">  // the database keeps the KEY</span>
  revalidatePath('/up');
}</code></pre>Rồi tới giới hạn kích thước — ảnh 200 KB được lưu, ảnh 2 MB bị chính Next.js từ chối, và trang <em>không</em> báo lỗi gì (vẫn hiện khoá cũ):<div class="out">saved key: avatars/1/anh-200kb.jpg
# 2 MB, server log:
⨯ Error: Body exceeded 1 MB limit.
statusCode: 413,</div>Nâng <code>serverActions.bodySizeLimit</code> chỉ dời vấn đề sang bộ nhớ (đo bên dưới).</div>
<div class="note-ct">
<p><strong>cuongthai.com lưu media thế nào:</strong> upload lên Cloudflare R2 và database giữ <em>khoá</em> R2, không phải file. Một helper biến một khoá đã lưu thành URL CDN đầy đủ để hiển thị (site phục vụ media từ một host CDN, do CSP yêu cầu). Lưu khoá, không phải URL, nghĩa là domain CDN có thể đổi mà không phải viết lại mọi dòng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy preview blob:/data: — một bug thật của cuongthai.com.</strong> Khi bạn hiện một <em>preview lạc quan</em> của file vừa chọn, trình duyệt cho bạn một URL cục bộ <code>blob:</code> hoặc <code>data:</code> — đã render được nguyên trạng. Một helper vô tư ghép CDN base vào <em>mọi</em> giá trị ảnh đã biến chúng thành <code>https://cdn.../blob:...</code> và làm hỏng preview (một lỗi 400). Cách sửa: URL object/data đã hoàn chỉnh — trả nguyên trạng; chỉ ghép CDN base vào các khoá storage trần. Khi dựng một helper media-URL, hãy rẽ nhánh xem giá trị đã là URL đầy đủ/blob/data chưa trước khi thêm bất kỳ tiền tố nào.</p>
</div>

<h3>Một file tải lên nên đi đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Đừng vào cơ sở dữ liệu</b> — Một cột blob làm mọi bản sao lưu phình to và mọi truy vấn chậm đi. Hãy lưu file ở nơi khác và giữ lại một URL.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đừng vào đĩa của máy chủ ứng dụng</b> — Một container bị thay ở mỗi lần deploy, và một thực thể thứ hai không nhìn thấy file của thực thể thứ nhất.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Vào kho lưu trữ đối tượng</b> — S3, R2, hoặc tương tự. Bền, rẻ, phục vụ qua CDN, và độc lập với vòng đời ứng dụng của bạn.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đi thẳng, bằng một URL đã ký sẵn</b> — Trình duyệt tải thẳng lên kho; máy chủ của bạn chỉ ký cái request. File chẳng bao giờ đi qua tiến trình của bạn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — cho mọi file tải lên đi vòng qua máy chủ Next.js.</strong> Nhận file trong một Server Action rồi chuyển tiếp lên kho thì chạy được với một ảnh đại diện 200KB và gục ngã với một video 40MB: thân request phải được đệm vào bộ nhớ, các nền tảng serverless chặn kích thước (4,5MB trên Vercel), và trên một VPS thì đó là bộ nhớ bạn không hề dự trù — vài lượt tải lên song song là tiến trình bị giết. Cú hỏng là một mã 413 hoặc một lần container khởi động lại, chẳng cái nào nhắc tới kích thước file. URL ký sẵn dời các byte đi thẳng từ trình duyệt tới kho và để máy chủ của bạn chỉ ký một chuỗi ngắn, thứ mở rộng như nhau dù file là 1MB hay 1GB.</p></div>
<a class="link-card dl" href="https://developers.cloudflare.com/r2/api/s3/presigned-urls/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Cloudflare R2 — URL ký sẵn</span><span class="lc-sub">Sinh một URL tải lên ở phía máy chủ, kèm tuỳ chọn hạn dùng và phạm vi.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers#request-body-formdata" target="_blank" rel="noopener">
  <span class="lc-ico">📤</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Xử lý tải lên bằng FormData</span><span class="lc-sub">Khi nào đi vòng qua máy chủ mới là lựa chọn đúng, và giới hạn của nó.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một form gửi một file dưới dạng <code>FormData</code> tới server; đọc nó từ request và lấy size và type của nó.</li>
<li>Chuyển sang luồng presigned-URL: server ký một URL upload, trình duyệt upload thẳng tới storage.</li>
<li>Giải thích vì sao file lớn không nên đi qua server của bạn dưới dạng <code>FormData</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn upload được một file qua FormData và qua presigned URL, và biết khi nào dùng cái nào.</p></div>

<h3>🔬 Đo thật: qua máy chủ vs URL ký sẵn (MinIO · @aws-sdk/client-s3 3.1169.0 · Next.js 16.4.6)</h3>
<p>Qua máy chủ — một Route Handler đọc <code>req.formData()</code>, kèm bộ nhớ tiến trình (RSS) trước và trong lúc đọc:</p>
<div class="out">$ curl -s -F file=@anh-200kb.jpg localhost:3000/api/upload
{"key":"uploads/32ed7314-9d4f-48f4-b80d-5eaa3f55a750-anh-200kb.jpg","size":204800,"rss":"121.2 MB → 121.8 MB"}
$ curl -s -F file=@video-40mb.mp4 localhost:3000/api/upload
{"key":"uploads/896ea12d-8151-4a20-ac17-35bef6e14e67-video-40mb.mp4","size":41943040,"rss":"124.0 MB → 343.7 MB"}</div>
<p>Một tệp 40 MB làm tiến trình tốn thêm khoảng 220 MB: thân request được đệm, rồi <code>arrayBuffer()</code> chép thêm lần nữa.</p>
<p><strong>URL ký sẵn — máy chủ ký, client tải thẳng lên kho:</strong></p>
<div class="out">$ curl -s -X POST localhost:3000/api/presign -d '{"name":"video-40mb.mp4","type":"video/mp4"}'
{"key":"uploads/6879b4b7-cabe-4f90-948a-82a9d2a5f6ce-video-40mb.mp4","rss":"344.0 MB"}
url: http://127.0.0.1:19319/nxj-lab/uploads/6879b4b7-cabe-4…?X-Amz-Algorithm&amp;X-Amz-Content-Sha256&amp;X-Amz-Credential&amp;X-Amz-Date&amp;X-Amz-Expires&amp;X-Amz-Signature&amp;X-Amz-SignedHeaders&amp;x-amz-checksum-crc32&amp;x-amz-sdk-checksum-algorithm&amp;x-id
$ curl -s -o /dev/null -w '%{http_code}\\n' -X PUT -H 'content-type: video/mp4' --upload-file video-40mb.mp4 "$URL"
200
$ curl -s "localhost:3000/api/obj?key=$KEY"
{"key":"uploads/6879b4b7-cabe-4f90-948a-82a9d2a5f6ce-video-40mb.mp4","bytes":41943040,"type":"video/mp4"}
# someone edits the key inside the signed URL
$ curl -s -X PUT --upload-file anh-200kb.jpg "\${URL/video-40mb/evil}" | grep -o '&lt;Code&gt;[^&lt;]*'
SignatureDoesNotMatch
# a URL signed for 5 seconds, used after 6
$ sleep 6
$ curl -s -X PUT --upload-file anh-200kb.jpg "$URL5" | grep -oE '&lt;(Code|Message)&gt;[^&lt;]*'
AccessDenied
Request has expired</div>
<p><strong>Lỗi xem trước <code>blob:</code>, tái hiện:</strong></p>
<div class="out">in:    avatars/1/me.jpg
naive: https://media.cuongthai.com/avatars/1/me.jpg
fixed: https://media.cuongthai.com/avatars/1/me.jpg
in:    blob:http://localhost:3000/7c1e9a52-0b6d-4e1f-9f43-2a7d1b6c0
naive: https://media.cuongthai.com/blob:http://localhost:3000/7c1e9a52-0b6d-4e1
fixed: blob:http://localhost:3000/7c1e9a52-0b6d-4e1f-9f43-2a7d1b6c0e11
in:    data:image/png;base64,iVBORw0KGgo=
naive: https://media.cuongthai.com/data:image/png;base64,iVBORw0KGgo=
fixed: data:image/png;base64,iVBORw0KGgo=</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ sed -n '219,220p' frontend/src/lib/utils.ts
  if (lp.startsWith('blob:') || lp.startsWith('data:')) return lp;
  if (au.startsWith('blob:') || au.startsWith('data:')) return au;
$ git log --format='%h %ad %s' --date=short -S"lp.startsWith('blob:')" -- frontend/src/lib/utils.ts | tail -1
4448f4d14 2026-07-02 fix(media+auth): stop blob: URLs hitting R2 (400) + silent session refresh
$ grep -rln "multer" src/routes | wc -l | sed 's/^ */tệp route dùng multer: /'
tệp route dùng multer: 31
$ grep -rn "multer.memoryStorage()" src/routes | wc -l | sed 's/^ */multer.memoryStorage(): /'
multer.memoryStorage(): 40
$ grep -rln "getSignedUploadUrl" src | grep -v test | grep -v "config/r2.ts" | wc -l | sed 's/^ */tệp gọi getSignedUploadUrl: /'
tệp gọi getSignedUploadUrl: 7</div>Bản vá lỗi blob: nằm trong <code>getMediaUrl</code> từ 2026-07-02. Backend dùng cả hai mẫu: multer với <code>memoryStorage()</code> và giới hạn <code>fileSize</code> riêng từng route cho tệp nhỏ, và <code>getSignedUploadUrl</code> (PUT ký sẵn lên R2) ở bảy chỗ cho upload trực tiếp.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">docker run -d -p 127.0.0.1:9000:9000 -e MINIO_ROOT_USER=lab -e MINIO_ROOT_PASSWORD=lab-secret-123 minio/minio server /data
npm i @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
head -c 41943040 /dev/urandom &gt; big.bin
curl -s -F file=@big.bin localhost:3000/api/upload        <span class="tok-comment">  # xem RSS</span>
curl -X PUT --upload-file big.bin "$(curl -s -X POST localhost:3000/api/presign -d '{}' | jq -r .url)"</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-0-1-vs-fs" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 0.1 — Object storage vs file system</span><span class="lc-sub">Ba khác biệt quyết định tệp nằm ở đâu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-4-1-vi-sao" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 4.1 — Vì sao upload trực tiếp từ browser</span><span class="lc-sub">Vượt giới hạn máy chủ, chuyên sâu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-15-4-doc-nguoi-dung" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 15.4 — Đọc người dùng hiện tại</span><span class="lc-sub">Ai đang upload — đọc bên trong action</span></span></a>

<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">đổi ảnh đại diện trên mạng xã hội, hay nộp bài tập lên hệ thống của trường sát giờ hạn, khi cả lớp cùng nộp một lúc.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Nếu một trăm sinh viên cùng nộp video bốn mươi MB qua máy chủ thì sao? Mỗi tệp tốn hơn hai trăm MB bộ nhớ, máy chủ hết RAM ngay giờ chót.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kẻ xấu săn những route ký URL không kiểm người gọi, biến kho của bạn thành chỗ chứa tệp miễn phí để phát tán.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Cách nhận ra: dung lượng kho tăng bất thường, nhiều khoá lạ. Cách phòng: xác thực trước khi ký, hạn ngắn, khoá do máy chủ chọn.</span></div>
</div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Upload FormData</span><span class="v">Gửi một file tới server trong một form multipart.</span></div>
  <div class="kv"><span class="k">Presigned URL</span><span class="v">Một URL đã ký sống ngắn mà trình duyệt upload thẳng tới.</span></div>
  <div class="kv"><span class="k">Thẳng-tới-storage</span><span class="v">File bỏ qua server của bạn, đi thẳng tới object storage.</span></div>
  <div class="kv"><span class="k">Content-Type</span><span class="v">MIME type của file, cần để nó phục vụ đúng về sau.</span></div>
  <div class="kv"><span class="k">Giới hạn size</span><span class="v">Route server có giới hạn body; file lớn cần upload presigned.</span></div>
  <div class="kv"><span class="k">Object storage</span><span class="v">S3/R2 nơi lưu file đã upload (xem khoá Object Storage).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>File nhỏ đi tới server dưới dạng <code>FormData</code>; đọc chúng từ request với type và size.</li><li>File lớn nên dùng presigned URL để trình duyệt upload thẳng tới object storage, bỏ qua server.</li><li>Đặt <code>Content-Type</code> đúng để file phục vụ đúng về sau.</li><li>Khoá Object Storage bao phần storage (S3/R2) chi tiết.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener">
  <span class="lc-ico">📤</span>
  <span class="lc-body"><span class="lc-title">MDN — FormData &amp; upload file</span><span class="lc-sub">Đọc object File, form multipart, và object URL.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.5 ─────────────────────────── */
    {
      title: '16.5 — Upload UX and the security you must not skip|||16.5 — UX upload và phần bảo mật không được bỏ',
      slug: 'nextjs-16-5-upload-bao-mat',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Preview tức thì, thanh tiến trình, chặn gửi hai lần — và điều bắt buộc: server phải kiểm loại, kích thước, và quyền của MỌI upload. Nối các đợt vá lỗ hổng upload thật của cuongthai.com.',
      content: `
${G16_5}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.5</span>
<h2>Good upload UX, and the checks that keep it safe</h2>
<p class="lead">A polished upload shows the file before it finishes, indicates progress, and prevents double-submits. But behind the nice UX sits a public write path — and an upload endpoint is one of the most abused surfaces in any app if the server does not check what it receives.</p>

<h3>The UX layer</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Optimistic preview</span><span class="v">Show the picked file immediately via its <code>blob:</code>/<code>data:</code> URL (mind the trap from 16.4 — do not CDN-prefix those).</span></div>
  <div class="kv"><span class="k">Progress &amp; disabled state</span><span class="v">Show upload progress; disable the button while in flight (the <code>useFormStatus</code>/pending pattern from Chapter 12).</span></div>
  <div class="kv"><span class="k">Client hints</span><span class="v"><code>accept="image/*"</code> and a client size check improve UX — but they are hints, not enforcement.</span></div>
</div>

<div class="pitfall">
<p><strong>Client-side file checks are not security — the server must validate every upload.</strong> <code>accept</code> and a JavaScript size check are trivially bypassed by calling the endpoint directly. The server must independently: confirm the user is authenticated and allowed to upload; check the file's <em>real</em> type (not just the extension or the client-sent MIME); enforce a maximum size; and constrain where it is stored. cuongthai.com's security reviews repeatedly found the same class of issue on upload and socket endpoints — trusting the client instead of re-validating on the server — and each had to be patched. An upload action is exactly the Chapter 12 rule applied to files: authenticate, authorise, validate, on the server, every time.</p>
</div>

<h3>A safe server upload, in shape</h3>
<pre><code class="language-javascript">async function uploadAvatar(formData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');           <span class="tok-comment">// authz</span>

  const file = formData.get('avatar');
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Bad type');   <span class="tok-comment">// type</span>
  if (file.size &gt; MAX_BYTES)         throw new Error('Too large');  <span class="tok-comment">// size</span>

  const key = &#96;avatars/\${user.id}/\${crypto.randomUUID()}&#96;;   <span class="tok-comment">// server-chosen path</span>
  await storage.put(key, file);
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>
<div class="callout warn"><strong>Measured on Next.js 16.4.6: the skeleton needs types, and its type check trusts the browser.</strong><div class="out">src/app/tai/bai.ts(2,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.
src/app/tai/bai.ts(7,8): error TS2304: Cannot find name 'ALLOWED_TYPES'.
src/app/tai/bai.ts(8,19): error TS2304: Cannot find name 'MAX_BYTES'.
src/app/tai/bai.ts(10,9): error TS2552: Cannot find name 'storage'. Did you mean 'Storage'?
src/app/tai/bai.ts(11,9): error TS2304: Cannot find name 'db'.</div><code>file.type</code> is the type the browser <em>declared</em> — <code>curl -F &#39;file=@evil.jpg;type=image/jpeg&#39;</code> sends an HTML page that passes it. Check the first bytes instead. The route measured below:<pre><code class="language-typescript"><span class="tok-comment">// lib/sniff.ts — the real type, from the first bytes (the "magic numbers"), not from the name</span>
const SIGS: [string, string, number[]][] = [
  ['image/jpeg', 'jpg', [0xff, 0xd8, 0xff]],
  ['image/png', 'png', [0x89, 0x50, 0x4e, 0x47]],
  ['image/gif', 'gif', [0x47, 0x49, 0x46, 0x38]],
];
export function sniff(bytes: Uint8Array): { type: string; ext: string } | null {
  for (const [type, ext, sig] of SIGS) if (sig.every((b, i) =&gt; bytes[i] === b)) return { type, ext };
  return null;
}

<span class="tok-comment">// app/api/up-safe/route.ts — who · how big · what really · where (the server decides all four)</span>
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getCurrentUser } from '@/lib/current-user';
import { s3, BUCKET, ensureBucket } from '@/lib/s3';
import { sniff } from '@/lib/sniff';

const MAX_BYTES = 2 * 1024 * 1024;
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'not signed in' }, { status: 401 });                      <span class="tok-comment">  // who</span>
  if (Number(req.headers.get('content-length')) &gt; MAX_BYTES + 4096)
    return Response.json({ error: 'too large (header)' }, { status: 413 });                            <span class="tok-comment">  // how big — before reading</span>
  const file = (await req.formData()).get('file');
  if (!(file instanceof File) || file.size &gt; MAX_BYTES) return Response.json({ error: 'too large' }, { status: 413 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const real = sniff(bytes);
  if (!real) return Response.json({ error: &#96;not an image (declared \${file.type})&#96; }, { status: 415 });<span class="tok-comment">  // what really</span>
  const key = &#96;avatars/\${user.id}/\${crypto.randomUUID()}.\${real.ext}&#96;;                                 <span class="tok-comment">  // where: the server's key</span>
  await ensureBucket();
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: real.type }));
  return Response.json({ key, type: real.type, label: file.name });
}</code></pre></div><p>Note the server chooses the storage key — never trust a client-supplied path, or a user could write outside their own folder. Type and size are enforced here, not in the form.</p>

<h3>Checks an upload endpoint needs</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Who is uploading</b> — Authenticate before signing anything. A presigned URL handed to an anonymous caller is free storage for the internet.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>How big, enforced by the signature</b> — Put the content-length limit in the presigned policy, not only in the client. The client is not a control.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>What type, checked by content</b> — Sniff the magic bytes rather than trusting the extension or the declared MIME type. Both are attacker-supplied.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Where it lands</b> — Generate the key server-side, namespaced by user. Never let the client choose the path.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — trusting the filename the browser sends.</strong> Using it as the storage key lets a caller send &#96;../../config/app.json&#96; and write outside the intended prefix, or send a name that collides with another user&#39;s file and overwrite it. Even without traversal, an attacker-chosen name is an attacker-chosen URL — useful for phishing on your domain, and awkward to clean up. Generate the key yourself: a uuid, prefixed by the user id, with an extension derived from the sniffed content type. Keep the original name in the database as a display label, where it is text and nothing more.</p></div>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — File Upload Cheat Sheet</span><span class="lc-sub">Every check an upload needs, and the attack each one blocks.</span></span>
</a>
<a class="link-card dl" href="https://github.com/sindresorhus/file-type" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">file-type</span><span class="lc-sub">Detecting the real type from the file's magic bytes, rather than its name.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Add an optimistic preview and a progress indicator to an upload so the UX is not a frozen button.</li>
<li>On the server, validate the file type and size and reject anything unexpected — never trust the client's claims.</li>
<li>Restrict a presigned URL to the expected content-type and size, and give it a short expiry.</li>
</ol>
<p><strong>Done when:</strong> you can give uploads good UX while enforcing type/size limits on the server.</p></div>

<h3>🔬 Measured: the same three attacks, a naive endpoint vs a safe one (MinIO · Next.js 16.4.6)</h3>
<p>The naive endpoint uses the browser&#39;s name, type and size; the safe one checks who, how big, what really, and builds the key itself.</p>
<div class="out">$ curl -s -w 'HTTP %{http_code}' -F 'file=@evil.jpg;filename=../../config/app.json' localhost:3000/api/up-naive -H "Cookie: token=$AN"; grep XMinio server.log
HTTP 500
XMinioInvalidResourceName: Resource name contains bad components such as "
$ curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/up-naive -H "Cookie: token=$AN"     # an HTML page named .jpg
{"key":"avatars/1/evil.jpg","type":"image/jpeg","size":65}
$ curl -s -F 'file=@that.jpg;filename=me.jpg' localhost:3000/api/up-naive …   # twice, the same name
objects named me.jpg after two uploads: 1
$ curl -s localhost:3000/api/ls
avatars/1/82d14948-c6bd-4730-9367-34f966207074.jpg  446280 B
avatars/1/anh-200kb.jpg  204800 B
avatars/1/evil.jpg  65 B
avatars/1/me.jpg  446280 B
# what a ../ in a name does on a disk-backed store (path.join)
$ node -e "const p=require('path'); console.log(p.join('uploads/avatars/1', '../../config/app.json'))"
uploads/config/app.json</div>
<div class="out">$ curl -s -o /dev/null -w '%{http_code}\\n' -F file=@that.jpg localhost:3000/api/up-safe            # no cookie
401
$ curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/up-safe -H "Cookie: token=$AN"
{"error":"not an image (declared image/jpeg)"}
$ curl -s -F file=@lon-6mb.jpg localhost:3000/api/up-safe -H "Cookie: token=$AN"
{"error":"too large (header)"}
$ curl -s -F 'file=@that.jpg;filename=../../config/app.json' localhost:3000/api/up-safe -H "Cookie: token=$AN"
{"key":"avatars/1/82d14948-c6bd-4730-9367-34f966207074.jpg","type":"image/jpeg","label":"../../config/app.json"}</div>
<p>The first bytes of the two files:</p>
<div class="out">$ head -c 4 that.jpg | xxd -p
ffd8ffdb
$ head -c 4 evil.jpg | xxd -p
3c68746d</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ git log --format='%h %ad %s' --date=short -1 7d1df6e86
7d1df6e86 2026-07-10 fix(security): enforce post/story visibility, media-cleanup ownership, upload MIME allowlist (P0)
$ grep -n "assertSafeUploadType(req.file.mimetype, req.file.originalname" src/routes/upload.routes.ts | head -1
91:      assertSafeUploadType(req.file.mimetype, req.file.originalname, bucket);
$ npx tsx -e "assertSafeUploadType(mimetype, originalname, 'images/avatars') for three uploads"
text/html      page.html  ⇒ File type not allowed
image/svg+xml  logo.svg   ⇒ File type not allowed
image/jpeg     evil.jpg   ⇒ accepted</div>A real P0 fix (2026-07-10) rejects active content (HTML, SVG, JS) on upload. <code>assertSafeUploadType</code> looks at the declared <code>mimetype</code> and the <code>originalname</code>, never the bytes, so <code>image/jpeg</code> + <code>evil.jpg</code> is accepted whatever is inside. The stored content type comes from the extension, so it is served as an image — but a byte sniff would close the gap.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">printf '&lt;html&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;/html&gt;' &gt; evil.jpg
curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/upload -H "Cookie: token=$TOKEN" <span class="tok-comment">  # should be 415</span>
curl -s -F 'file=@me.jpg;filename=../../config/app.json' localhost:3000/api/upload …        <span class="tok-comment">  # the key must not contain it</span>
head -c 4 photo.jpg | xxd -p  <span class="tok-comment">  # ffd8ff…</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-3-kiem-file-that" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.3 — Never trust the file</span><span class="lc-sub">Magic bytes, polyglots and zip bombs</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-4-useactionstate-useformstatus" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.4 — useActionState and useFormStatus</span><span class="lc-sub">The pending state of the upload button</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-4-1-vi-sao" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 4.1 — Why upload directly from the browser</span><span class="lc-sub">Presigned uploads in depth</span></span></a>

<h3>🌏 Not just theory: real life, what-ifs, attackers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">uploading an ID photo to an app, a CV to a job site, a profile picture — you pass an upload endpoint every day.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">What if a site accepts SVG or HTML as an avatar? Whoever opens that 'image' may run someone else's script, on your domain.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker&#39;s angle</span><span class="v">An attacker hosts a fake sign-in page in your storage and sends a link with your real domain for phishing — or overwrites other people's files.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Prevent it: sniff the bytes, server-built keys, content type from the bytes. Detect it: scan the bucket for image extensions whose content is HTML.</span></div>
</div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Optimistic preview</span><span class="v">Show the file immediately before the upload finishes.</span></div>
  <div class="kv"><span class="k">Progress</span><span class="v">Report upload progress so the UI is not frozen.</span></div>
  <div class="kv"><span class="k">Server-side validation</span><span class="v">Verify type and size on the server, not just the client.</span></div>
  <div class="kv"><span class="k">MIME sniffing</span><span class="v">Do not trust the extension/claimed type; verify it.</span></div>
  <div class="kv"><span class="k">Presigned constraints</span><span class="v">Lock the signed URL to a type, size and short expiry.</span></div>
  <div class="kv"><span class="k">Never trust the client</span><span class="v">Any limit enforced only in the browser can be bypassed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Give uploads an optimistic preview and a progress indicator so the UI stays responsive.</li><li>Validate file type and size on the server — a client-only limit can be bypassed.</li><li>Lock a presigned URL to the expected content-type and size, with a short expiry.</li><li>Never trust the client's claimed type; verify it server-side.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — File Upload Cheat Sheet</span><span class="lc-sub">Server-side validation, type/size limits, and safe storage.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.5</span>
<h2>UX upload tốt, và các phép kiểm giữ nó an toàn</h2>
<p class="lead">Một upload bóng bẩy hiện file trước khi xong, báo tiến trình, và chặn gửi hai lần. Nhưng sau UX đẹp là một đường ghi công khai — và một endpoint upload là một trong những bề mặt bị lạm dụng nhất của mọi app nếu server không kiểm cái nó nhận.</p>

<h3>Lớp UX</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Preview lạc quan</span><span class="v">Hiện file đã chọn ngay qua URL <code>blob:</code>/<code>data:</code> của nó (nhớ bẫy ở 16.4 — đừng ghép CDN vào chúng).</span></div>
  <div class="kv"><span class="k">Tiến trình &amp; trạng thái disabled</span><span class="v">Hiện tiến trình upload; vô hiệu hoá nút khi đang gửi (mẫu <code>useFormStatus</code>/pending ở Chương 12).</span></div>
  <div class="kv"><span class="k">Gợi ý client</span><span class="v"><code>accept="image/*"</code> và một phép kiểm kích thước ở client cải thiện UX — nhưng chúng là gợi ý, không phải thực thi.</span></div>
</div>

<div class="pitfall">
<p><strong>Kiểm file phía client không phải bảo mật — server phải validate mọi upload.</strong> <code>accept</code> và một phép kiểm kích thước bằng JavaScript bị lách dễ dàng bằng cách gọi thẳng endpoint. Server phải tự mình: xác nhận người dùng đã xác thực và được phép upload; kiểm loại <em>thật</em> của file (không chỉ đuôi hay MIME client gửi); ép một kích thước tối đa; và ràng buộc nơi lưu. Các đợt rà soát bảo mật của cuongthai.com lặp đi lặp lại đúng loại vấn đề này trên endpoint upload và socket — tin client thay vì kiểm lại trên server — và mỗi cái phải vá. Một action upload chính xác là quy tắc Chương 12 áp cho file: xác thực, phân quyền, validate, trên server, mọi lúc.</p>
</div>

<h3>Một upload server an toàn, dạng khung</h3>
<pre><code class="language-javascript">async function uploadAvatar(formData) {
  'use server';
  const user = await getCurrentUser();
  if (!user) throw new Error('Chưa xác thực');               <span class="tok-comment">// authz</span>

  const file = formData.get('avatar');
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Sai loại');   <span class="tok-comment">// type</span>
  if (file.size &gt; MAX_BYTES)         throw new Error('Quá lớn');    <span class="tok-comment">// size</span>

  const key = &#96;avatars/\${user.id}/\${crypto.randomUUID()}&#96;;   <span class="tok-comment">// đường do server chọn</span>
  await storage.put(key, file);
  await db.user.update({ where: { id: user.id }, data: { avatarKey: key } });
}</code></pre>
<div class="callout warn"><strong>Đo trên Next.js 16.4.6: khung này cần kiểu, và phép kiểm loại của nó tin trình duyệt.</strong><div class="out">src/app/tai/bai.ts(2,29): error TS7006: Parameter 'formData' implicitly has an 'any' type.
src/app/tai/bai.ts(7,8): error TS2304: Cannot find name 'ALLOWED_TYPES'.
src/app/tai/bai.ts(8,19): error TS2304: Cannot find name 'MAX_BYTES'.
src/app/tai/bai.ts(10,9): error TS2552: Cannot find name 'storage'. Did you mean 'Storage'?
src/app/tai/bai.ts(11,9): error TS2304: Cannot find name 'db'.</div><code>file.type</code> là kiểu do trình duyệt <em>khai</em> — <code>curl -F &#39;file=@evil.jpg;type=image/jpeg&#39;</code> gửi một trang HTML qua được nó. Hãy kiểm mấy byte đầu. Route đã đo bên dưới:<pre><code class="language-typescript"><span class="tok-comment">// lib/sniff.ts — the real type, from the first bytes (the "magic numbers"), not from the name</span>
const SIGS: [string, string, number[]][] = [
  ['image/jpeg', 'jpg', [0xff, 0xd8, 0xff]],
  ['image/png', 'png', [0x89, 0x50, 0x4e, 0x47]],
  ['image/gif', 'gif', [0x47, 0x49, 0x46, 0x38]],
];
export function sniff(bytes: Uint8Array): { type: string; ext: string } | null {
  for (const [type, ext, sig] of SIGS) if (sig.every((b, i) =&gt; bytes[i] === b)) return { type, ext };
  return null;
}

<span class="tok-comment">// app/api/up-safe/route.ts — who · how big · what really · where (the server decides all four)</span>
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getCurrentUser } from '@/lib/current-user';
import { s3, BUCKET, ensureBucket } from '@/lib/s3';
import { sniff } from '@/lib/sniff';

const MAX_BYTES = 2 * 1024 * 1024;
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'not signed in' }, { status: 401 });                      <span class="tok-comment">  // who</span>
  if (Number(req.headers.get('content-length')) &gt; MAX_BYTES + 4096)
    return Response.json({ error: 'too large (header)' }, { status: 413 });                            <span class="tok-comment">  // how big — before reading</span>
  const file = (await req.formData()).get('file');
  if (!(file instanceof File) || file.size &gt; MAX_BYTES) return Response.json({ error: 'too large' }, { status: 413 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const real = sniff(bytes);
  if (!real) return Response.json({ error: &#96;not an image (declared \${file.type})&#96; }, { status: 415 });<span class="tok-comment">  // what really</span>
  const key = &#96;avatars/\${user.id}/\${crypto.randomUUID()}.\${real.ext}&#96;;                                 <span class="tok-comment">  // where: the server's key</span>
  await ensureBucket();
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: real.type }));
  return Response.json({ key, type: real.type, label: file.name });
}</code></pre></div><p>Để ý server chọn khoá storage — đừng bao giờ tin một đường do client cấp, kẻo một người dùng ghi được ra ngoài thư mục của họ. Loại và kích thước được ép ở đây, không phải trong form.</p>

<h3>Những phép kiểm mà một endpoint tải lên cần</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Ai đang tải lên</b> — Hãy xác thực trước khi ký bất cứ thứ gì. Một URL ký sẵn trao cho một người gọi vô danh là kho lưu trữ miễn phí cho cả internet.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>To bao nhiêu, cưỡng chế bằng chữ ký</b> — Hãy đặt giới hạn content-length vào chính chính sách ký sẵn, đừng chỉ đặt ở client. Client không phải một phép kiểm soát.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Loại gì, kiểm bằng nội dung</b> — Hãy ngửi các byte đặc trưng thay vì tin phần mở rộng hay kiểu MIME được khai. Cả hai đều do kẻ tấn công cung cấp.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó rơi xuống đâu</b> — Sinh cái khoá ở phía máy chủ, phân vùng theo người dùng. Đừng bao giờ để client chọn đường dẫn.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tin cái tên file mà trình duyệt gửi lên.</strong> Dùng nó làm khoá lưu trữ là cho phép một người gọi gửi &#96;../../config/app.json&#96; và ghi ra ngoài tiền tố dự định, hoặc gửi một cái tên trùng với file của người khác rồi ghi đè lên. Kể cả không có phép đi ngược thư mục thì một cái tên do kẻ tấn công chọn cũng là một URL do kẻ tấn công chọn — tiện cho việc lừa đảo trên chính tên miền của bạn, và khó dọn dẹp. Hãy tự sinh cái khoá: một uuid, gắn tiền tố là id người dùng, với phần mở rộng suy ra từ kiểu nội dung đã ngửi được. Giữ tên gốc trong cơ sở dữ liệu làm nhãn hiển thị, nơi nó chỉ là chữ và không hơn.</p></div>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — Bản tra cứu tải file lên</span><span class="lc-sub">Mọi phép kiểm mà một lần tải lên cần, và cuộc tấn công mà từng cái chặn.</span></span>
</a>
<a class="link-card dl" href="https://github.com/sindresorhus/file-type" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">file-type</span><span class="lc-sub">Nhận diện kiểu thật từ các byte đặc trưng của file, thay vì từ cái tên.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm một preview lạc quan và một chỉ báo tiến độ cho một upload để UX không phải một nút đơ.</li>
<li>Trên server, validate type và size của file và từ chối mọi thứ bất ngờ — đừng bao giờ tin lời khai của client.</li>
<li>Giới hạn một presigned URL theo content-type và size mong đợi, và cho nó hạn ngắn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho upload UX tốt trong khi thực thi giới hạn type/size trên server.</p></div>

<h3>🔬 Đo thật: cùng ba đòn, endpoint ngây thơ vs endpoint an toàn (MinIO · Next.js 16.4.6)</h3>
<p>Endpoint ngây thơ dùng tên, kiểu và kích thước của trình duyệt; endpoint an toàn kiểm ai, to bao nhiêu, thật ra là gì, và tự dựng khoá.</p>
<div class="out">$ curl -s -w 'HTTP %{http_code}' -F 'file=@evil.jpg;filename=../../config/app.json' localhost:3000/api/up-naive -H "Cookie: token=$AN"; grep XMinio server.log
HTTP 500
XMinioInvalidResourceName: Resource name contains bad components such as "
$ curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/up-naive -H "Cookie: token=$AN"     # an HTML page named .jpg
{"key":"avatars/1/evil.jpg","type":"image/jpeg","size":65}
$ curl -s -F 'file=@that.jpg;filename=me.jpg' localhost:3000/api/up-naive …   # twice, the same name
objects named me.jpg after two uploads: 1
$ curl -s localhost:3000/api/ls
avatars/1/82d14948-c6bd-4730-9367-34f966207074.jpg  446280 B
avatars/1/anh-200kb.jpg  204800 B
avatars/1/evil.jpg  65 B
avatars/1/me.jpg  446280 B
# what a ../ in a name does on a disk-backed store (path.join)
$ node -e "const p=require('path'); console.log(p.join('uploads/avatars/1', '../../config/app.json'))"
uploads/config/app.json</div>
<div class="out">$ curl -s -o /dev/null -w '%{http_code}\\n' -F file=@that.jpg localhost:3000/api/up-safe            # no cookie
401
$ curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/up-safe -H "Cookie: token=$AN"
{"error":"not an image (declared image/jpeg)"}
$ curl -s -F file=@lon-6mb.jpg localhost:3000/api/up-safe -H "Cookie: token=$AN"
{"error":"too large (header)"}
$ curl -s -F 'file=@that.jpg;filename=../../config/app.json' localhost:3000/api/up-safe -H "Cookie: token=$AN"
{"key":"avatars/1/82d14948-c6bd-4730-9367-34f966207074.jpg","type":"image/jpeg","label":"../../config/app.json"}</div>
<p>Mấy byte đầu của hai tệp:</p>
<div class="out">$ head -c 4 that.jpg | xxd -p
ffd8ffdb
$ head -c 4 evil.jpg | xxd -p
3c68746d</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ git log --format='%h %ad %s' --date=short -1 7d1df6e86
7d1df6e86 2026-07-10 fix(security): enforce post/story visibility, media-cleanup ownership, upload MIME allowlist (P0)
$ grep -n "assertSafeUploadType(req.file.mimetype, req.file.originalname" src/routes/upload.routes.ts | head -1
91:      assertSafeUploadType(req.file.mimetype, req.file.originalname, bucket);
$ npx tsx -e "assertSafeUploadType(mimetype, originalname, 'images/avatars') for three uploads"
text/html      page.html  ⇒ File type not allowed
image/svg+xml  logo.svg   ⇒ File type not allowed
image/jpeg     evil.jpg   ⇒ accepted</div>Một bản vá P0 thật (2026-07-10) chặn tải lên nội dung chạy được (HTML, SVG, JS). <code>assertSafeUploadType</code> xem <code>mimetype</code> khai và <code>originalname</code>, không xem byte, nên <code>image/jpeg</code> + <code>evil.jpg</code> được nhận dù bên trong là gì. Content type lưu lấy từ đuôi tệp nên nó được phục vụ như ảnh — nhưng ngửi byte sẽ bịt nốt khe này.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">printf '&lt;html&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;/html&gt;' &gt; evil.jpg
curl -s -F 'file=@evil.jpg;type=image/jpeg' localhost:3000/api/upload -H "Cookie: token=$TOKEN" <span class="tok-comment">  # phải là 415</span>
curl -s -F 'file=@me.jpg;filename=../../config/app.json' localhost:3000/api/upload …        <span class="tok-comment">  # khoá không được chứa nó</span>
head -c 4 photo.jpg | xxd -p  <span class="tok-comment">  # ffd8ff…</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-10-3-kiem-file-that" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 10.3 — Đừng tin file người dùng</span><span class="lc-sub">Magic bytes, file lai và bom giải nén</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-4-useactionstate-useformstatus" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.4 — useActionState và useFormStatus</span><span class="lc-sub">Trạng thái đang gửi của nút tải lên</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/object-storage/learn?lessonSlug=os-4-1-vi-sao" target="_blank" rel="noopener"><span class="lc-ico">🪣</span><span class="lc-body"><span class="lc-title">Object Storage · 4.1 — Vì sao upload trực tiếp từ browser</span><span class="lc-sub">Upload ký sẵn chuyên sâu</span></span></a>

<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">tải ảnh căn cước lên một ứng dụng, nộp CV lên trang tuyển dụng, đổi ảnh đại diện. Ngày nào bạn cũng đi qua một endpoint tải lên.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">Nếu trang cho phép SVG hay HTML làm ảnh đại diện thì sao? Ai mở ảnh đó có thể chạy script của người khác, ngay trên tên miền của bạn.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kẻ xấu đặt một trang đăng nhập giả lên kho của bạn, rồi gửi đường dẫn mang tên miền thật để lừa đảo, hoặc đè tệp của người khác.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Cách phòng: ngửi byte, khoá do máy chủ dựng, kiểu nội dung lấy từ byte. Cách nhận ra: soát kho tìm tệp có đuôi ảnh mà nội dung là HTML.</span></div>
</div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Preview lạc quan</span><span class="v">Hiện file ngay trước khi upload xong.</span></div>
  <div class="kv"><span class="k">Tiến độ</span><span class="v">Báo tiến độ upload để UI không đơ.</span></div>
  <div class="kv"><span class="k">Validate phía server</span><span class="v">Xác minh type và size trên server, không chỉ client.</span></div>
  <div class="kv"><span class="k">MIME sniffing</span><span class="v">Đừng tin đuôi file/type khai; hãy xác minh.</span></div>
  <div class="kv"><span class="k">Ràng buộc presigned</span><span class="v">Khoá URL đã ký theo type, size và hạn ngắn.</span></div>
  <div class="kv"><span class="k">Đừng tin client</span><span class="v">Mọi giới hạn chỉ thực thi trong trình duyệt đều bỏ qua được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cho upload một preview lạc quan và một chỉ báo tiến độ để UI vẫn phản hồi.</li><li>Validate type và size của file trên server — giới hạn chỉ-ở-client bỏ qua được.</li><li>Khoá một presigned URL theo content-type và size mong đợi, với hạn ngắn.</li><li>Đừng bao giờ tin type client khai; hãy xác minh phía server.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">OWASP — File Upload Cheat Sheet</span><span class="lc-sub">Validate phía server, giới hạn loại/kích thước, và lưu trữ an toàn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.6 QUIZ ─────────────────────────── */
    {
      title: '16.6 — Chapter 16 quiz|||16.6 — Kiểm tra chương 16',
      slug: 'nextjs-16-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về form/upload: hai cách làm form, react-hook-form uncontrolled, Zod một-schema-hai-phía + z.infer, upload lên object storage + lưu khoá, bẫy preview blob:/data:, và bảo mật upload phía server. Khép Giai đoạn 4.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 16: the two form approaches, react-hook-form's uncontrolled model, Zod validation on both sides, uploading to object storage, the blob:/data: preview trap, and server-side upload security. End of Stage 4.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 16: hai cách làm form, mô hình uncontrolled của react-hook-form, validation Zod hai phía, upload lên object storage, bẫy preview blob:/data:, và bảo mật upload phía server. Khép Giai đoạn 4.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'When is a Server Action form preferable to a client react-hook-form?|||Khi nào form Server Action hơn một client react-hook-form?',
            options: [
              'never|||không bao giờ',
              'for straightforward submits/mutations that should work even without JS|||cho submit/mutation đơn giản nên chạy được cả khi không có JS',
              'only for file uploads|||chỉ cho upload file',
              'only in development|||chỉ ở dev',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is react-hook-form fast on large forms?|||Vì sao react-hook-form nhanh trên form lớn?',
            options: [
              'it caches the form|||nó cache form',
              'inputs are uncontrolled (register) so typing does not re-render the component|||input là uncontrolled (register) nên gõ không render lại component',
              'it disables validation|||nó tắt validation',
              'it runs on the server|||nó chạy trên server',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the main benefit of validating with a single Zod schema?|||Lợi ích chính của việc validate bằng một schema Zod duy nhất là gì?',
            options: [
              'it makes forms prettier|||làm form đẹp hơn',
              'one source of truth for client + server validation, plus a TS type via z.infer|||một nguồn sự thật cho validation client + server, cộng một kiểu TS qua z.infer',
              'it removes the need for a server|||bỏ nhu cầu server',
              'it only validates numbers|||chỉ validate số',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which validation is the one that actually protects the app?|||Validation nào mới thật sự bảo vệ app?',
            options: [
              'the client-side one (instant feedback)|||cái phía client (phản hồi tức thì)',
              'the server-side one (e.g. safeParse in the action)|||cái phía server (ví dụ safeParse trong action)',
              'both are equally protective|||cả hai bảo vệ như nhau',
              'neither|||không cái nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where do uploaded files go, and what does the database store?|||File upload đi đâu, và database lưu gì?',
            options: [
              'the file bytes are stored in the database|||bytes của file lưu trong database',
              'files go to object storage (R2/S3); the DB stores the key/URL reference|||file lên object storage (R2/S3); DB lưu tham chiếu khoá/URL',
              'files are kept in localStorage|||file giữ trong localStorage',
              'files are not stored anywhere|||file không lưu ở đâu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is a presigned-URL upload good for?|||Upload bằng presigned URL hợp cho gì?',
            options: [
              'small text fields|||các trường text nhỏ',
              'large files — the browser uploads directly to storage, skipping your server|||file lớn — trình duyệt upload thẳng lên storage, bỏ qua server',
              'validation|||validation',
              'styling|||styling',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A media-URL helper turned previews into https://cdn.../blob:... and broke them. The fix?|||Một helper media-URL biến preview thành https://cdn.../blob:... và làm hỏng. Cách sửa?',
            options: [
              'prepend the CDN base to everything|||ghép CDN base vào mọi thứ',
              'blob:/data: URLs are already renderable — return them untouched; only prefix bare storage keys|||URL blob:/data: đã render được — trả nguyên trạng; chỉ thêm tiền tố cho khoá storage trần',
              'stop showing previews|||thôi hiện preview',
              'store files in the database|||lưu file trong database',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Are accept="image/*" and a JS size check sufficient upload security?|||accept="image/*" và một phép kiểm kích thước bằng JS có đủ bảo mật upload không?',
            options: [
              'yes, they block bad files|||có, chúng chặn file xấu',
              'no — they are UX hints, trivially bypassed; the server must validate type, size, and auth|||không — chúng là gợi ý UX, dễ lách; server phải validate loại, kích thước, và auth',
              'yes, if the file is small|||có, nếu file nhỏ',
              'only in production|||chỉ ở production',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should the SERVER choose the storage key, not the client?|||Vì sao SERVER nên chọn khoá storage, không phải client?',
            options: [
              'the client cannot make strings|||client không tạo được chuỗi',
              'a client-supplied path could let a user write outside their own folder|||một đường do client cấp có thể để người dùng ghi ra ngoài thư mục của họ',
              'it is faster|||nó nhanh hơn',
              'there is no reason|||không có lý do',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The recurring class of bug in cuongthai.com upload/socket reviews was…|||Loại bug lặp lại trong rà soát upload/socket của cuongthai.com là…',
            options: [
              'slow uploads|||upload chậm',
              'trusting the client instead of re-validating auth/type/size on the server|||tin client thay vì kiểm lại auth/loại/kích thước trên server',
              'files too small|||file quá nhỏ',
              'too much validation|||validate quá nhiều',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
