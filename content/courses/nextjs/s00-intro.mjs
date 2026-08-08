/**
 * Next.js & React — Mục 0: Giới thiệu khoá học & Hướng dẫn học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi. KHÔNG dùng backtick trần trong content
 * (dùng &#96;), và mọi `${` trong code mẫu phải escape thành \${.
 */
const REF = '?ref=%2Fcourses%2Fnextjs%2Flearn&reflabel=Next.js';

export default {
  title: 'Section 0 — Introduction & How to Study|||Mục 0 — Giới thiệu khoá học & Hướng dẫn học',
  description: 'Đọc trước tiên: khoá học này dạy gì, React và Next.js khác nhau ra sao, cài đặt thế nào và dự án xuyên suốt là gì.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — About this course & the full roadmap|||0.1 — Về khoá học này & bản đồ toàn khoá',
      slug: 'nextjs-0-1-gioi-thieu',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Khoá học dạy gì, khác gì tutorial trên mạng, và bản đồ 20 chương từ zero đến production với App Router.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Next.js &amp; React — from zero to production</h2>
<p class="lead">This course teaches you to build a <strong>real frontend</strong>: an app that renders on the server, hydrates in the browser, holds real users and real data, survives a page refresh, ranks on Google, and keeps its bundle small enough to load on a phone. Not a toy counter that lives in one file and forgets everything the moment you reload.</p>

<h3>What makes this course different</h3>
<p>Most React tutorials stop at <code>useState</code> and a to-do list. That is roughly 5% of the job. The other 95% — the part that decides whether your app survives contact with real users and a real deploy — is what we spend most of our time on:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Use useEffect to fetch data."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Why that fetch runs twice in dev, races itself when the user types fast, leaks when the component unmounts, and why a Server Component fetches without an effect at all.</span></div>
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Next.js does SSR, it's faster."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">What actually runs on the server vs the browser, why <code>'use client'</code> is a boundary not a file flag, and how a single <code>useState</code> in the wrong place ships 200KB of JavaScript you didn't need.</span></div>
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Deploy to Vercel, click deploy."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Build the standalone output, put it in a Docker image, and understand why this exact site once showed an <em>infinite loading screen with no error</em> after a rebuild — because Next locks the <code>public/</code> file list at server start.</span></div>
</div>
<p>Every chapter ends with the same question: <em>what does this look like in an app that is actually running?</em> The examples are taken from a production Next.js app — <strong>cuongthai.com</strong>, the site you are reading this on — including its outages, its bad decisions and its fixes. When we say "a stale bundle 404'd and the whole page hung", that happened here, and we show you the log.</p>

<h3>What you will be able to build</h3>
<ul>
  <li>A multi-page app with the App Router: nested layouts, loading and error states, dynamic routes.</li>
  <li>Pages that render on the server (fast first paint, good SEO) and stay interactive in the browser.</li>
  <li>Data fetching with caching and revalidation — and mutations with Server Actions, no hand-written API route needed.</li>
  <li>Auth with cookies and middleware, forms with validation, file uploads, realtime UI.</li>
  <li>A themed, accessible, fast design system in Tailwind — and a build you can ship in Docker to a server you own.</li>
</ul>

<h3>The roadmap — 5 stages, 20 chapters</h3>
<p>Each stage assumes the one before it. Do not skip ahead: chapter 9 (Server vs Client Components) is unreadable if chapter 3 (state &amp; re-renders) never clicked, and chapter 12 (Server Actions) needs chapter 5 (effects) so you know what you are <em>not</em> doing anymore.</p>
<div class="lz-map">
  <div class="lz-stage">Stage 1 · React foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">JSX &amp; the rendering model</div><div class="lz-nsub">What React actually does: elements, the virtual tree, describe-don't-command</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Components, props &amp; composition</div><div class="lz-nsub">One-way data flow, children, lifting state, thinking in components</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">State &amp; the re-render model</div><div class="lz-nsub">useState, snapshots, batching, why "state is a snapshot" explains every bug</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Events &amp; controlled forms</div><div class="lz-nsub">Handlers, controlled vs uncontrolled inputs, the single source of truth</div></div></div>
  <div class="lz-stage">Stage 2 · Thinking in React (hooks)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">useEffect &amp; synchronising with the outside</div><div class="lz-nsub">Deps, cleanup, the double-run in dev, races, the effects you shouldn't write</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">The hooks toolbox</div><div class="lz-nsub">useRef, useMemo, useCallback, useReducer, useContext, custom hooks</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Lists, keys &amp; render performance</div><div class="lz-nsub">Reconciliation, why the index key corrupts state, memo &amp; when it's useless</div></div></div>
  <div class="lz-stage">Stage 3 · Next.js App Router</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Next.js &amp; the App Router</div><div class="lz-nsub">Routing by the file system, the project layout, dev vs build vs start</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Server vs Client Components</div><div class="lz-nsub">The boundary, <code>'use client'</code>, what ships to the browser and what doesn't</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Data fetching, caching &amp; revalidation</div><div class="lz-nsub">fetch on the server, the cache, revalidate, streaming with Suspense</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Routing in depth</div><div class="lz-nsub">Layouts, loading, error, dynamic segments, parallel &amp; intercepting routes</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions &amp; mutations</div><div class="lz-nsub">Forms without an API route, progressive enhancement, revalidatePath</div></div></div>
  <div class="lz-stage">Stage 4 · Building the real app</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Styling &amp; design systems</div><div class="lz-nsub">Tailwind, CSS variables, dark mode — and the theme trap that broke this site</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Client &amp; server state</div><div class="lz-nsub">Zustand for client state, TanStack Query for server state, hydration</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Auth, middleware, cookies &amp; sessions</div><div class="lz-nsub">Reading cookies on the server, protecting routes, the refresh-token dance</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Forms, validation &amp; uploads</div><div class="lz-nsub">react-hook-form, zod, optimistic UI, files to object storage</div></div></div>
  <div class="lz-stage">Stage 5 · Production</div>
  <div class="lz-node"><div class="lz-badge">17</div><div class="lz-nbody"><div class="lz-ntitle">Rendering strategies, SEO &amp; metadata</div><div class="lz-nsub">SSG, SSR, ISR, PPR — when each one, metadata, Open Graph, sitemaps</div></div></div>
  <div class="lz-node"><div class="lz-badge">18</div><div class="lz-nbody"><div class="lz-ntitle">Performance</div><div class="lz-nsub">Bundle analysis, code splitting, streaming, next/image, next/font</div></div></div>
  <div class="lz-node"><div class="lz-badge">19</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">React Testing Library, user-event, Playwright end-to-end</div></div></div>
  <div class="lz-node"><div class="lz-badge">20</div><div class="lz-nbody"><div class="lz-ntitle">Build &amp; deploy</div><div class="lz-nsub">standalone output, Docker, env vars baked at build, the traps that took this site down</div></div></div>
</div>

<div class="callout ok">
<p><strong>By the end</strong> you will not just "know React". You will be able to open the source of cuongthai.com — a real Next.js App Router codebase — read any page, and know why it renders the way it does. That is the bar.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Next.js &amp; React — từ số 0 đến production</h2>
<p class="lead">Khoá học này dạy bạn xây một <strong>frontend thật</strong>: một ứng dụng render trên server, hydrate trong trình duyệt, có người dùng thật và dữ liệu thật, sống sót qua một lần tải lại trang, lên top Google, và giữ gói JavaScript đủ nhẹ để tải trên điện thoại. Không phải cái counter đồ chơi nằm gọn trong một file và quên sạch mọi thứ ngay khi bạn reload.</p>

<h3>Khoá này khác gì</h3>
<p>Phần lớn tutorial React dừng ở <code>useState</code> và một danh sách việc-cần-làm. Đó mới chừng 5% công việc. 95% còn lại — phần quyết định ứng dụng của bạn có sống nổi khi gặp người dùng thật và một lần deploy thật hay không — mới là chỗ chúng ta dành phần lớn thời gian:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tutorial thường thấy</span><span class="v">"Dùng useEffect để fetch dữ liệu."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Vì sao fetch đó chạy hai lần ở môi trường dev, tự đua với chính nó khi người dùng gõ nhanh, rò rỉ khi component bị gỡ, và vì sao một Server Component fetch mà chẳng cần effect nào cả.</span></div>
  <div class="kv"><span class="k">Tutorial thường thấy</span><span class="v">"Next.js có SSR, nhanh hơn."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Cái gì THẬT SỰ chạy trên server so với trên trình duyệt, vì sao <code>'use client'</code> là một RANH GIỚI chứ không phải cờ đánh dấu file, và làm sao một <code>useState</code> đặt sai chỗ đẩy 200KB JavaScript bạn không cần xuống máy người dùng.</span></div>
  <div class="kv"><span class="k">Tutorial thường thấy</span><span class="v">"Deploy lên Vercel, bấm deploy."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Dựng bản standalone, bỏ vào ảnh Docker, và hiểu vì sao chính site này từng hiện <em>màn hình tải xoay mãi mà không một lỗi nào</em> sau một lần build lại — vì Next chốt danh sách file trong <code>public/</code> ngay lúc server khởi động.</span></div>
</div>
<p>Mỗi chương đều kết bằng cùng một câu hỏi: <em>thứ này trông ra sao trong một ứng dụng đang thật sự chạy?</em> Các ví dụ lấy từ một ứng dụng Next.js đang chạy production — <strong>cuongthai.com</strong>, chính trang bạn đang đọc — kể cả những lần sập, những quyết định sai và cách sửa. Khi chúng ta nói "một bundle cũ trả 404 và cả trang treo", chuyện đó xảy ra ở đây, và chúng ta cho bạn xem log.</p>

<h3>Bạn sẽ làm được gì</h3>
<ul>
  <li>Một ứng dụng nhiều trang với App Router: layout lồng nhau, trạng thái loading và error, route động.</li>
  <li>Trang render trên server (first paint nhanh, SEO tốt) mà vẫn tương tác được trong trình duyệt.</li>
  <li>Fetch dữ liệu có cache và revalidate — và mutate bằng Server Actions, không cần tự viết API route.</li>
  <li>Xác thực bằng cookie và middleware, form có validation, upload file, UI realtime.</li>
  <li>Một hệ thiết kế Tailwind có theme, dễ tiếp cận, nhanh — và một bản build bạn ship bằng Docker lên máy chủ của chính mình.</li>
</ul>

<h3>Bản đồ — 5 giai đoạn, 20 chương</h3>
<p>Mỗi giai đoạn giả định bạn đã qua giai đoạn trước. Đừng nhảy cóc: chương 9 (Server vs Client Component) không đọc nổi nếu chương 3 (state &amp; re-render) chưa thông, và chương 12 (Server Actions) cần chương 5 (effect) để bạn biết mình <em>không còn</em> phải làm gì nữa.</p>
<div class="lz-map">
  <div class="lz-stage">Giai đoạn 1 · Nền tảng React</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">JSX &amp; mô hình render</div><div class="lz-nsub">React thật sự làm gì: element, cây ảo, mô tả-đừng-ra-lệnh</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Component, props &amp; ghép</div><div class="lz-nsub">Dòng dữ liệu một chiều, children, nâng state lên, tư duy theo component</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">State &amp; mô hình render lại</div><div class="lz-nsub">useState, ảnh chụp, gộp lô, vì sao "state là ảnh chụp" giải thích mọi bug</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Sự kiện &amp; form có kiểm soát</div><div class="lz-nsub">Handler, input controlled vs uncontrolled, một nguồn sự thật duy nhất</div></div></div>
  <div class="lz-stage">Giai đoạn 2 · Tư duy React (hooks)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">useEffect &amp; đồng bộ với bên ngoài</div><div class="lz-nsub">Mảng phụ thuộc, dọn dẹp, chạy hai lần ở dev, đua, những effect không nên viết</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Bộ đồ nghề hooks</div><div class="lz-nsub">useRef, useMemo, useCallback, useReducer, useContext, hook tự viết</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Danh sách, key &amp; hiệu năng render</div><div class="lz-nsub">Reconciliation, vì sao key theo chỉ số làm hỏng state, memo &amp; khi nào vô ích</div></div></div>
  <div class="lz-stage">Giai đoạn 3 · Next.js App Router</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Next.js &amp; App Router</div><div class="lz-nsub">Định tuyến theo hệ thống file, bố cục dự án, dev vs build vs start</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Server vs Client Component</div><div class="lz-nsub">Ranh giới, <code>'use client'</code>, cái gì xuống trình duyệt và cái gì không</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Fetch, cache &amp; revalidate</div><div class="lz-nsub">fetch trên server, bộ nhớ đệm, revalidate, streaming với Suspense</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Định tuyến chuyên sâu</div><div class="lz-nsub">Layout, loading, error, đoạn động, route song song &amp; chặn</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Server Actions &amp; mutate</div><div class="lz-nsub">Form không cần API route, cải tiến tiệm tiến, revalidatePath</div></div></div>
  <div class="lz-stage">Giai đoạn 4 · Dựng app thật</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Styling &amp; hệ thiết kế</div><div class="lz-nsub">Tailwind, biến CSS, dark mode — và cái bẫy theme từng làm hỏng site này</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">State client &amp; server</div><div class="lz-nsub">Zustand cho state client, TanStack Query cho state server, hydration</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Auth, middleware, cookie &amp; phiên</div><div class="lz-nsub">Đọc cookie trên server, chặn route, điệu nhảy refresh-token</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Form, validation &amp; upload</div><div class="lz-nsub">react-hook-form, zod, UI lạc quan, đưa file lên object storage</div></div></div>
  <div class="lz-stage">Giai đoạn 5 · Production</div>
  <div class="lz-node"><div class="lz-badge">17</div><div class="lz-nbody"><div class="lz-ntitle">Chiến lược render, SEO &amp; metadata</div><div class="lz-nsub">SSG, SSR, ISR, PPR — khi nào dùng cái nào, metadata, Open Graph, sitemap</div></div></div>
  <div class="lz-node"><div class="lz-badge">18</div><div class="lz-nbody"><div class="lz-ntitle">Hiệu năng</div><div class="lz-nsub">Phân tích bundle, tách mã, streaming, next/image, next/font</div></div></div>
  <div class="lz-node"><div class="lz-badge">19</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">React Testing Library, user-event, Playwright end-to-end</div></div></div>
  <div class="lz-node"><div class="lz-badge">20</div><div class="lz-nbody"><div class="lz-ntitle">Build &amp; deploy</div><div class="lz-nsub">bản standalone, Docker, env bake lúc build, những cái bẫy từng hạ site này</div></div></div>
</div>

<div class="callout ok">
<p><strong>Học xong</strong> bạn sẽ không chỉ "biết React". Bạn sẽ mở được mã nguồn cuongthai.com — một codebase Next.js App Router thật — đọc bất kỳ trang nào, và biết vì sao nó render theo cách nó render. Đó là cái chuẩn.</p>
</div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — React vs Next.js: what each one is|||0.2 — React vs Next.js: mỗi cái là gì',
      slug: 'nextjs-0-2-react-vs-nextjs',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'React là thư viện dựng giao diện; Next.js là framework bọc quanh React lo router, server, build. Vì sao cần cả hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>React is a library. Next.js is a framework.</h2>
<p class="lead">People say "React or Next.js?" as if they compete. They don't. React is the engine that turns your data into a user interface. Next.js is the car built around that engine — it adds the routing, the server, the build system and the deployment story that React deliberately leaves out.</p>

<h3>What React gives you, and what it doesn't</h3>
<p>React answers exactly one question: <em>given this data, what should the UI look like?</em> You write components; React renders them, and re-renders them efficiently when the data changes. That is the whole job.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">React DOES</span><span class="v">Components, JSX, state, hooks, the reconciler that updates the DOM efficiently.</span></div>
  <div class="kv"><span class="k">React does NOT</span><span class="v">Routing (which URL shows which page), server rendering, data fetching conventions, a build system, or how you deploy.</span></div>
</div>
<p>Left to itself, React runs entirely in the browser: the server sends a nearly-empty HTML file, the browser downloads a JavaScript bundle, and only then does the page appear. That is a <strong>Single-Page App (SPA)</strong>. It works, but the first paint is slow, and search engines see an empty page.</p>

<h3>What Next.js adds</h3>
<p>Next.js is a <strong>framework</strong>: it makes the decisions React left open, so a team doesn't reinvent them on every project.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>File-system routing</b><br/>A file at <code>app/blog/page.tsx</code> becomes the route <code>/blog</code>. No router config.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Server rendering by default</b><br/>Components run on the server and send finished HTML — fast first paint, real SEO.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Server Components</b><br/>Most of your UI never ships to the browser at all — less JavaScript, direct database access.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Data &amp; mutations</b><br/>fetch with caching, Server Actions for writes, no separate API layer required.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Build &amp; optimise</b><br/>Bundling, code-splitting, image and font optimisation, the production build.</div></div>
</div>
<p>Everything you learn about React in Stages 1–2 is still true inside Next.js — a component is a component. Next.js changes <em>where</em> it runs and <em>when</em>, not what it is. That is why this course teaches React first and Next.js second: you cannot understand "this component runs on the server" until you understand what a component is.</p>

<h3>App Router, not Pages Router</h3>
<p>Next.js has two routing systems. The old one lives in a <code>pages/</code> folder; the current one — the one this course teaches, and the one cuongthai.com uses — lives in <code>app/</code> and is called the <strong>App Router</strong>. It introduced React Server Components and a new mental model. Tutorials from before 2023 usually mean the old system; when something online contradicts this course, check which router it assumes first.</p>

<div class="note-ct">
<p><strong>How cuongthai.com is built</strong> — this site is a Next.js App Router app in the <code>frontend/</code> folder, talking to a separate Node.js + Express API in the project root. The frontend renders pages (some on the server, some in the browser); the backend owns the database, auth and file storage. Chapters 8–20 are essentially a guided tour of how the <code>frontend/</code> folder actually works.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>React là một THƯ VIỆN. Next.js là một FRAMEWORK.</h2>
<p class="lead">Người ta hay hỏi "React hay Next.js?" như thể chúng cạnh tranh nhau. Không hề. React là cỗ máy biến dữ liệu của bạn thành giao diện. Next.js là chiếc xe dựng quanh cỗ máy đó — nó bổ sung router, server, hệ thống build và câu chuyện triển khai mà React cố tình để trống.</p>

<h3>React cho bạn gì, và KHÔNG cho gì</h3>
<p>React trả lời đúng một câu hỏi: <em>với dữ liệu này, giao diện nên trông thế nào?</em> Bạn viết component; React render chúng, và render lại một cách hiệu quả khi dữ liệu đổi. Đó là toàn bộ nhiệm vụ của nó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">React CÓ lo</span><span class="v">Component, JSX, state, hooks, bộ reconciler cập nhật DOM hiệu quả.</span></div>
  <div class="kv"><span class="k">React KHÔNG lo</span><span class="v">Định tuyến (URL nào hiện trang nào), render trên server, quy ước fetch dữ liệu, hệ thống build, hay cách bạn deploy.</span></div>
</div>
<p>Để một mình, React chạy hoàn toàn trong trình duyệt: server gửi một file HTML gần như rỗng, trình duyệt tải về một gói JavaScript, rồi trang mới hiện. Đó là <strong>ứng dụng một trang (SPA)</strong>. Chạy được, nhưng first paint chậm, và công cụ tìm kiếm nhìn thấy một trang trống.</p>

<h3>Next.js bổ sung gì</h3>
<p>Next.js là một <strong>framework</strong>: nó quyết sẵn những chỗ React để ngỏ, để cả nhóm khỏi phải phát minh lại trên mỗi dự án.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Định tuyến theo hệ thống file</b><br/>File tại <code>app/blog/page.tsx</code> trở thành route <code>/blog</code>. Không cần cấu hình router.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Render trên server mặc định</b><br/>Component chạy trên server và gửi HTML hoàn chỉnh — first paint nhanh, SEO thật.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Server Component</b><br/>Phần lớn UI không bao giờ xuống trình duyệt — ít JavaScript hơn, truy cập DB trực tiếp.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Dữ liệu &amp; mutate</b><br/>fetch có cache, Server Actions cho thao tác ghi, không cần tầng API riêng.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Build &amp; tối ưu</b><br/>Đóng gói, tách mã, tối ưu ảnh và font, bản build production.</div></div>
</div>
<p>Mọi thứ bạn học về React ở Giai đoạn 1–2 vẫn đúng bên trong Next.js — một component vẫn là một component. Next.js đổi <em>nơi</em> nó chạy và <em>khi nào</em>, chứ không đổi nó là gì. Vì thế khoá này dạy React trước, Next.js sau: bạn không thể hiểu "component này chạy trên server" khi chưa hiểu component là gì.</p>

<h3>App Router, không phải Pages Router</h3>
<p>Next.js có hai hệ định tuyến. Cái cũ nằm trong thư mục <code>pages/</code>; cái hiện hành — cái khoá này dạy, và cái cuongthai.com dùng — nằm trong <code>app/</code> và gọi là <strong>App Router</strong>. Nó mang theo React Server Components và một mô hình tư duy mới. Tutorial trước 2023 thường nói về hệ cũ; khi có gì trên mạng mâu thuẫn với khoá này, hãy kiểm xem nó đang giả định router nào trước đã.</p>

<div class="note-ct">
<p><strong>cuongthai.com được dựng thế nào</strong> — site này là một app Next.js App Router trong thư mục <code>frontend/</code>, nói chuyện với một API Node.js + Express riêng ở gốc dự án. Frontend render các trang (một số trên server, một số trong trình duyệt); backend nắm database, xác thực và lưu trữ file. Chương 8–20 về cơ bản là một chuyến tham quan có hướng dẫn xem thư mục <code>frontend/</code> thật sự hoạt động ra sao.</p>
</div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Setting up & the dev loop|||0.3 — Cài đặt & vòng lặp phát triển',
      slug: 'nextjs-0-3-cai-dat',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cài Node 22, tạo app bằng create-next-app, hiểu ba lệnh dev/build/start và cây thư mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Set up once, then get out of the terminal</h2>
<p class="lead">You need three things: a recent Node.js, a package manager (npm ships with Node), and one command to scaffold the project. After that, almost everything happens in <code>npm run dev</code> and your editor.</p>

<h3>1 · Node.js 22 LTS</h3>
<p>Next.js runs on Node. Install the <strong>LTS</strong> (long-term support) version — 22.x at the time of writing. Check it:</p>
<pre><code>node --version
<span class="out">v22.21.0</span></code></pre>
<p>If you juggle projects on different Node versions, use <code>nvm</code> (Node Version Manager) and put the version in a <code>.nvmrc</code> file. This site pins Node 22 that way.</p>

<h3>2 · Create the app</h3>
<p>One command scaffolds a complete App Router project with TypeScript, Tailwind and ESLint wired up:</p>
<pre><code>npx create-next-app@latest my-app</code></pre>
<p>It asks a few questions. For this course answer: <b>TypeScript yes</b>, <b>ESLint yes</b>, <b>Tailwind yes</b>, <b>App Router yes</b>, <b>src/ directory</b> — your choice, this course uses <code>src/</code> like cuongthai.com does. Then:</p>
<pre><code>cd my-app
npm run dev
<span class="out">▲ Next.js 15.x
- Local:   http://localhost:3000
✓ Ready in 1200ms</span></code></pre>
<p>Open <code>http://localhost:3000</code>. Edit <code>src/app/page.tsx</code>, save, and the browser updates without a reload — that is <strong>Fast Refresh</strong>, and it keeps your component state across edits. This is where you will live.</p>

<h3>3 · The three commands you must not confuse</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm run dev</span><span class="v">Development server. Fast Refresh, detailed errors, source maps. NEVER what users hit — it is slow and unminified.</span></div>
  <div class="kv"><span class="k">npm run build</span><span class="v">Produces the optimised production output: minified bundles, static pages pre-rendered, the <code>.next/</code> folder. Run this before every deploy.</span></div>
  <div class="kv"><span class="k">npm run start</span><span class="v">Serves what <code>build</code> produced. This is production. If it breaks here but works in dev, the build is the source of truth — trust it.</span></div>
</div>
<div class="callout warn">
<p><strong>Dev lies, sometimes helpfully, sometimes not.</strong> Code that works under <code>npm run dev</code> can fail under <code>build</code> (a type error dev tolerated, a Server/Client boundary dev was lenient about) and vice-versa. Whenever behaviour surprises you near a deploy, reproduce it with <code>npm run build &amp;&amp; npm run start</code>, not dev.</p>
</div>

<h3>4 · The folder that matters: <code>app/</code></h3>
<pre><code>my-app/
  src/
    app/
      layout.tsx      <span class="tok-comment">// wraps every page (html, body, providers)</span>
      page.tsx        <span class="tok-comment">// the route "/"</span>
      globals.css     <span class="tok-comment">// global styles + Tailwind directives</span>
      about/
        page.tsx      <span class="tok-comment">// the route "/about"</span>
  public/             <span class="tok-comment">// static files served as-is (images, fonts)</span>
  next.config.js      <span class="tok-comment">// framework config</span>
  package.json
  tsconfig.json</code></pre>
<p>The rule you will use a hundred times: <strong>a folder under <code>app/</code> is a URL segment, and a <code>page.tsx</code> inside it is the page shown at that URL.</strong> We unpack this fully in Chapter 8.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài một lần, rồi thoát khỏi terminal</h2>
<p class="lead">Bạn cần ba thứ: một bản Node.js gần đây, một trình quản lý gói (npm đi kèm Node), và một lệnh để dựng khung dự án. Sau đó, gần như mọi thứ diễn ra trong <code>npm run dev</code> và trình soạn thảo của bạn.</p>

<h3>1 · Node.js 22 LTS</h3>
<p>Next.js chạy trên Node. Cài bản <strong>LTS</strong> (hỗ trợ dài hạn) — 22.x ở thời điểm viết. Kiểm tra:</p>
<pre><code>node --version
<span class="out">v22.21.0</span></code></pre>
<p>Nếu bạn xoay nhiều dự án ở các bản Node khác nhau, dùng <code>nvm</code> (Node Version Manager) và ghi bản cần dùng vào file <code>.nvmrc</code>. Site này ghim Node 22 theo cách đó.</p>

<h3>2 · Tạo app</h3>
<p>Một lệnh dựng nguyên một dự án App Router hoàn chỉnh có sẵn TypeScript, Tailwind và ESLint:</p>
<pre><code>npx create-next-app@latest my-app</code></pre>
<p>Nó hỏi vài câu. Với khoá này hãy trả lời: <b>TypeScript có</b>, <b>ESLint có</b>, <b>Tailwind có</b>, <b>App Router có</b>, <b>thư mục src/</b> — tuỳ bạn, khoá này dùng <code>src/</code> giống cuongthai.com. Rồi:</p>
<pre><code>cd my-app
npm run dev
<span class="out">▲ Next.js 15.x
- Local:   http://localhost:3000
✓ Ready in 1200ms</span></code></pre>
<p>Mở <code>http://localhost:3000</code>. Sửa <code>src/app/page.tsx</code>, lưu, và trình duyệt cập nhật mà không tải lại — đó là <strong>Fast Refresh</strong>, nó giữ nguyên state component qua các lần sửa. Đây là nơi bạn sẽ sống.</p>

<h3>3 · Ba lệnh không được lẫn lộn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm run dev</span><span class="v">Server phát triển. Fast Refresh, lỗi chi tiết, source map. KHÔNG BAO GIỜ là cái người dùng chạm tới — nó chậm và không nén.</span></div>
  <div class="kv"><span class="k">npm run build</span><span class="v">Tạo bản production đã tối ưu: bundle nén nhỏ, trang tĩnh render sẵn, thư mục <code>.next/</code>. Chạy lệnh này trước mỗi lần deploy.</span></div>
  <div class="kv"><span class="k">npm run start</span><span class="v">Phục vụ cái mà <code>build</code> tạo ra. Đây là production. Nếu chỗ này hỏng mà dev thì chạy, bản build mới là nguồn sự thật — tin nó.</span></div>
</div>
<div class="callout warn">
<p><strong>Dev nói dối, có lúc có ích, có lúc không.</strong> Mã chạy được dưới <code>npm run dev</code> có thể hỏng dưới <code>build</code> (một lỗi kiểu mà dev bỏ qua, một ranh giới Server/Client mà dev dễ tính) và ngược lại. Mỗi khi hành vi khiến bạn bất ngờ gần lúc deploy, hãy tái hiện bằng <code>npm run build &amp;&amp; npm run start</code>, đừng dùng dev.</p>
</div>

<h3>4 · Thư mục quan trọng: <code>app/</code></h3>
<pre><code>my-app/
  src/
    app/
      layout.tsx      <span class="tok-comment">// bọc mọi trang (html, body, provider)</span>
      page.tsx        <span class="tok-comment">// route "/"</span>
      globals.css     <span class="tok-comment">// style toàn cục + chỉ thị Tailwind</span>
      about/
        page.tsx      <span class="tok-comment">// route "/about"</span>
  public/             <span class="tok-comment">// file tĩnh phục vụ nguyên trạng (ảnh, font)</span>
  next.config.js      <span class="tok-comment">// cấu hình framework</span>
  package.json
  tsconfig.json</code></pre>
<p>Quy tắc bạn sẽ dùng cả trăm lần: <strong>một thư mục dưới <code>app/</code> là một đoạn URL, và một <code>page.tsx</code> bên trong nó là trang hiện ở URL đó.</strong> Chương 8 sẽ mổ xẻ trọn vẹn điều này.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — How to study this course|||0.4 — Cách học khoá này',
      slug: 'nextjs-0-4-cach-hoc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Học chủ động: gõ lại code, đọc lỗi, dùng Phòng thi và Code Lab, và một cảnh báo về việc hỏi AI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>How to get the most out of this</h2>
<p class="lead">This is a course you build alongside, not one you watch. Every chapter has runnable code. If you only read it, you will feel like you understand and discover at the keyboard that you don't. Type it. Break it. Read the error.</p>

<h3>The loop that works</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Read the lesson once</b>, for the shape of the idea — don't memorise.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Type the code yourself</b> into your dev app. Not copy-paste — typing forces you to read every token.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Change one thing</b> and predict what happens before you save. Being wrong is the lesson.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Read the whole error message.</b> React and Next errors are unusually good — they usually tell you the fix.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Do the Code Lab exercise</b> for that chapter to make it stick.</div></div>
</div>

<h3>What each icon in the course means</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.lead / examples</span><span class="v">The core idea and code with real output shown in an <code>out</code> block. Read the output — it's the point.</span></div>
  <div class="kv"><span class="k">Pitfall</span><span class="v">A mistake that is easy to make and hard to debug. These are worth more than the happy path.</span></div>
  <div class="kv"><span class="k">"How cuongthai.com does it"</span><span class="v">The same idea, seen in a production codebase — including the bugs it caused here.</span></div>
  <div class="kv"><span class="k">Quiz &amp; Exam Room</span><span class="v">Each chapter ends with a quiz; the course has Progress Tests, Final Exams and practical exams in the Exam Room.</span></div>
</div>

<h3>Use the Exam Room and Code Lab</h3>
<p>Reading proves nothing. This course ships with a full assessment set in the <strong>Exam Room</strong>: <b>3 Progress Tests</b> (after chapters 4, 12 and 20), <b>5 Final Exams</b> (50 questions each, the whole course), and <b>10 Practical Exams</b> where you build something and it is graded. The <strong>Code Lab</strong> has hands-on exercises with solutions. Do them; the questions are written to catch the exact misunderstandings this course is trying to fix.</p>

<div class="pitfall">
<p><strong>A word about asking an AI to write your React.</strong> An AI will happily produce a component that renders correctly and is quietly wrong — an effect with a missing dependency, an index used as a key, a <code>'use client'</code> at the top of a file that pulls half the app into the browser. It compiles, it runs, the bug ships. The whole point of this course is to give you the judgement the AI doesn't have. Use it to go faster on things you already understand; do not use it to skip understanding. Chapter 5 alone will show you three AI-favourite effects that are bugs.</p>
</div>

<div class="callout ok">
<p><strong>Ready?</strong> Chapter 1 starts where every React app starts: with JSX, and the single most important idea in the whole framework — that you <em>describe</em> the UI you want, and React figures out how to get the screen there.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Làm sao học được nhiều nhất</h2>
<p class="lead">Đây là khoá bạn dựng song song, không phải khoá bạn ngồi xem. Mỗi chương đều có code chạy được. Nếu chỉ đọc, bạn sẽ thấy như đã hiểu rồi ngồi vào bàn phím mới phát hiện là chưa. Gõ lại. Làm cho hỏng. Đọc lỗi.</p>

<h3>Vòng lặp hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Đọc bài một lượt</b>, để nắm hình dạng ý tưởng — đừng học thuộc.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Tự gõ lại code</b> vào app dev của bạn. Không copy-paste — gõ buộc bạn đọc từng token.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Đổi một thứ</b> và đoán trước chuyện gì xảy ra trước khi lưu. Đoán sai chính là bài học.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Đọc trọn thông báo lỗi.</b> Lỗi của React và Next tốt lạ thường — thường nói thẳng cách sửa.</div></div>
  <div class="lz-step"><div class="lz-si">5</div><div class="lz-sb"><b>Làm bài Code Lab</b> của chương đó cho nhớ lâu.</div></div>
</div>

<h3>Mỗi ký hiệu trong khoá nghĩa là gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.lead / ví dụ</span><span class="v">Ý cốt lõi và code có kết quả thật hiện trong khối <code>out</code>. Đọc kết quả — đó mới là điểm chính.</span></div>
  <div class="kv"><span class="k">Bẫy</span><span class="v">Lỗi dễ mắc mà khó dò. Những cái này đáng giá hơn con đường suôn sẻ.</span></div>
  <div class="kv"><span class="k">"cuongthai.com làm thế nào"</span><span class="v">Cùng ý tưởng đó, nhìn trong một codebase production — kể cả những bug nó gây ra ở đây.</span></div>
  <div class="kv"><span class="k">Quiz &amp; Phòng thi</span><span class="v">Mỗi chương kết bằng một quiz; khoá có Bài kiểm tra tiến độ, Thi cuối khoá và thi thực hành trong Phòng thi.</span></div>
</div>

<h3>Dùng Phòng thi và Code Lab</h3>
<p>Đọc không chứng minh được gì. Khoá này đi kèm nguyên một bộ đánh giá trong <strong>Phòng thi</strong>: <b>3 Bài kiểm tra tiến độ</b> (sau chương 4, 12 và 20), <b>5 đề Thi cuối khoá</b> (mỗi đề 50 câu, phủ cả khoá), và <b>10 đề Thực hành</b> nơi bạn dựng một thứ và được chấm. <strong>Code Lab</strong> có bài tập thực hành kèm lời giải. Hãy làm; các câu hỏi được viết để bắt đúng những hiểu lầm khoá này đang cố sửa.</p>

<div class="pitfall">
<p><strong>Một lời về việc nhờ AI viết React hộ.</strong> AI sẽ vui vẻ đẻ ra một component render đúng mà sai một cách âm thầm — một effect thiếu phụ thuộc, một chỉ số dùng làm key, một <code>'use client'</code> đặt đầu file kéo nửa ứng dụng xuống trình duyệt. Nó biên dịch được, chạy được, và bug lên production. Toàn bộ mục đích khoá này là cho bạn cái phán đoán mà AI không có. Dùng nó để đi nhanh hơn ở những chỗ bạn đã hiểu; đừng dùng nó để nhảy qua phần hiểu. Riêng Chương 5 sẽ cho bạn xem ba effect AI-hay-viết mà đều là bug.</p>
</div>

<div class="callout ok">
<p><strong>Sẵn sàng chưa?</strong> Chương 1 bắt đầu ở nơi mọi app React bắt đầu: với JSX, và ý tưởng quan trọng nhất của cả framework — rằng bạn <em>mô tả</em> giao diện mình muốn, còn React tự lo cách đưa màn hình tới đó.</p>
</div>
</div>
`,
    },
  ],
};
