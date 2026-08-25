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
      // Video mở đầu: "React in 100 Seconds" (Fireship) — 100 giây nắm React là gì.
      video: { url: 'https://youtu.be/Tn6-PIqc4UM', durationSeconds: 0 },
      description: 'React & Next.js là gì, sinh ra để giải quyết vấn đề gì, thay thế cái gì, dùng ở đâu trong công việc — và bản đồ 20 chương.',
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

<h3>Why does React even exist? What did it replace?</h3>
<p>For a beginner this is the missing piece: <em>why was this invented, and what was so painful before it?</em> In the 2000s, a web page's data and its HTML were kept in sync <strong>by hand</strong> — with jQuery or raw DOM calls, you found an element and mutated it every time something changed (Chapter 1 shows this code). On a page with hundreds of moving parts, humans forget a spot, the screen drifts out of sync with the data, and bugs multiply. React's founding idea, from Facebook in 2011, was to end that: <strong>you describe what the UI should look like for the current data, and React updates the DOM for you.</strong> It replaced manual DOM manipulation and the tangle of jQuery/Backbone/Angular-1 "keep it in sync yourself" code.</p>
<p><strong>And Next.js?</strong> Plain React runs entirely in the browser, which means a slow first paint and a page search engines see as empty. Next.js (from Vercel, 2015) wraps React with a server, file-based routing and a build system so pages render on the server — fast, SEO-friendly — while staying interactive. The full history and the people behind both is the next lesson.</p>

<h3>Where you actually use this at work</h3>
<p>React is the most widely used way to build user interfaces on the web, and Next.js is the most popular React framework — together they are the default frontend stack at a huge share of companies, from startups to Netflix, TikTok and Notion. Learning them is not academic:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">The job market</span><span class="v">"React developer" and "Next.js" are among the most-requested frontend skills in job listings worldwide and in Vietnam.</span></div>
  <div class="kv"><span class="k">What you build with it</span><span class="v">Dashboards, social apps, e-commerce, admin panels, marketing sites, SaaS products — anything with a screen a user clicks.</span></div>
  <div class="kv"><span class="k">It transfers</span><span class="v">React Native (mobile apps) uses the same components and hooks. Learn React once, ship to web and phone.</span></div>
  <div class="kv"><span class="k">This very site</span><span class="v">cuongthai.com — the app you are reading — is a Next.js + React frontend. This course is a tour of how it really works.</span></div>
</div>

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

<div class="pitfall"><p><strong>Trap — starting with Next.js before React, because the tutorial you found did.</strong> Next.js is a framework <em>around</em> React, so almost every error you hit in the first week is a React error wearing a Next.js hat: a stale closure, a missing key, an effect that re-runs, state copied from a prop. Without the React model underneath, those read as framework quirks and you learn workarounds instead of causes. That is why this course spends its first seven chapters on React with no framework involved. If you already know React, skim them and check you can answer the traps; if you do not, they are the part that makes the rest cheap.</p></div>
<h3>📚 Learn deeper</h3>
<p>The 100-second video above is the fastest possible overview. To go further, these are the primary sources — bookmark them, this course sends you back to them often:</p>
<a class="link-card dl" href="https://react.dev/learn" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — the official React docs</span><span class="lc-sub">Rewritten in 2023 and genuinely excellent; the "Learn React" path is the canonical tutorial.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/docs — the official Next.js docs</span><span class="lc-sub">The App Router reference. Make sure any tutorial you follow uses the App Router, not the old Pages Router.</span></span>
</a>
<a class="link-card dl" href="https://roadmap.sh/react" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">roadmap.sh/react — the React learning roadmap</span><span class="lc-sub">A visual map of everything a React developer learns, and in what order. Good for seeing the whole forest.</span></span>
</a>
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

<h3>Vì sao React ra đời? Nó thay thế cái gì?</h3>
<p>Với người mới, đây là mảnh còn thiếu: <em>vì sao người ta phát minh ra nó, và trước đó khổ ở chỗ nào?</em> Những năm 2000, dữ liệu của một trang web và HTML của nó được giữ đồng bộ <strong>bằng tay</strong> — với jQuery hay lệnh DOM trần, bạn tìm một phần tử rồi tự sửa nó mỗi khi có gì thay đổi (Chương 1 cho bạn xem đoạn code đó). Trên một trang có hàng trăm bộ phận động, con người quên một chỗ, màn hình trôi lệch khỏi dữ liệu, và bug nhân lên. Ý tưởng khai sinh React, từ Facebook năm 2011, là chấm dứt điều đó: <strong>bạn mô tả giao diện NÊN trông thế nào với dữ liệu hiện tại, còn React tự cập nhật DOM hộ bạn.</strong> Nó thay thế việc thao tác DOM bằng tay và mớ code "tự đi mà giữ đồng bộ" của jQuery/Backbone/Angular-1.</p>
<p><strong>Còn Next.js?</strong> React thuần chạy hoàn toàn trong trình duyệt, nghĩa là first paint chậm và một trang mà công cụ tìm kiếm nhìn thấy trống rỗng. Next.js (từ Vercel, 2015) bọc React bằng một server, định tuyến theo file và một hệ thống build để trang render trên server — nhanh, thân thiện SEO — mà vẫn tương tác được. Toàn bộ lịch sử và những con người đứng sau cả hai là bài học ngay sau đây.</p>

<h3>Bạn dùng thứ này ở đâu trong công việc</h3>
<p>React là cách được dùng rộng rãi nhất để dựng giao diện người dùng trên web, và Next.js là framework React phổ biến nhất — cùng nhau chúng là bộ frontend mặc định ở một lượng lớn công ty, từ startup tới Netflix, TikTok và Notion. Học chúng không phải chuyện hàn lâm:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Thị trường việc làm</span><span class="v">"React developer" và "Next.js" thuộc nhóm kỹ năng frontend được tuyển nhiều nhất trên thế giới lẫn ở Việt Nam.</span></div>
  <div class="kv"><span class="k">Bạn xây gì với nó</span><span class="v">Dashboard, ứng dụng xã hội, thương mại điện tử, trang quản trị, trang marketing, sản phẩm SaaS — bất cứ thứ gì có màn hình để người dùng bấm.</span></div>
  <div class="kv"><span class="k">Nó chuyển giao được</span><span class="v">React Native (app di động) dùng cùng component và hooks. Học React một lần, ship cho cả web lẫn điện thoại.</span></div>
  <div class="kv"><span class="k">Chính trang này</span><span class="v">cuongthai.com — ứng dụng bạn đang đọc — là một frontend Next.js + React. Khoá này là chuyến tham quan cách nó thật sự hoạt động.</span></div>
</div>

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

<div class="pitfall"><p><strong>Bẫy — bắt đầu với Next.js trước khi biết React, vì bài hướng dẫn bạn tìm được làm thế.</strong> Next.js là một framework bọc <em>quanh</em> React, nên gần như mọi lỗi bạn gặp trong tuần đầu đều là lỗi React đội mũ Next.js: một closure cũ, một key bị thiếu, một effect chạy lại, state chép từ một prop. Thiếu mô hình React ở bên dưới thì chúng đọc lên như những nét kỳ quặc của framework, và bạn học được các mẹo lách thay vì học nguyên nhân. Đó là lý do khoá này dành bảy chương đầu cho React mà chẳng dính framework nào. Nếu bạn đã biết React thì hãy lướt qua và kiểm xem mình trả lời được các cái bẫy không; nếu chưa thì đó chính là phần làm cho mọi thứ còn lại trở nên rẻ.</p></div>
<h3>📚 Học sâu thêm</h3>
<p>Video 100 giây phía trên là bản tổng quan nhanh nhất có thể. Muốn đi xa hơn, đây là các nguồn gốc — hãy lưu lại, khoá này sẽ gửi bạn quay về chúng thường xuyên:</p>
<a class="link-card dl" href="https://react.dev/learn" target="_blank" rel="noopener">
  <span class="lc-ico">⚛️</span>
  <span class="lc-body"><span class="lc-title">react.dev — tài liệu React chính thức</span><span class="lc-sub">Viết lại năm 2023 và thật sự xuất sắc; lộ trình "Learn React" là tutorial chuẩn mực.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs" target="_blank" rel="noopener">
  <span class="lc-ico">▲</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/docs — tài liệu Next.js chính thức</span><span class="lc-sub">Tham chiếu App Router. Hãy chắc mọi tutorial bạn theo dùng App Router, không phải Pages Router cũ.</span></span>
</a>
<a class="link-card dl" href="https://roadmap.sh/react" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">roadmap.sh/react — lộ trình học React</span><span class="lc-sub">Bản đồ trực quan mọi thứ một React developer học, và theo thứ tự nào. Tốt để thấy toàn cảnh khu rừng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — React vs Next.js: what each one is|||0.2 — React vs Next.js: mỗi cái là gì',
      slug: 'nextjs-0-2-react-vs-nextjs',
      type: 'VIDEO',
      isFreePreview: true,
      // Video lịch sử: Pete Hunt "React: Rethinking best practices" — JSConf EU 2013,
      // chính talk giới thiệu React ra thế giới lần đầu.
      video: { url: 'https://youtu.be/x7cQ3mrcKaY', durationSeconds: 0 },
      description: 'React là thư viện; Next.js là framework bọc quanh nó. Ai tạo ra chúng, năm nào, vì sao — và vì sao cần cả hai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>React is a library. Next.js is a framework.</h2>
<p class="lead">People say "React or Next.js?" as if they compete. They don't. React is the engine that turns your data into a user interface. Next.js is the car built around that engine — it adds the routing, the server, the build system and the deployment story that React deliberately leaves out.</p>

<h3>A short history: who built these, and why</h3>
<p><strong>React — Facebook, 2011 → open-sourced 2013.</strong> A Facebook engineer named <strong>Jordan Walke</strong> built the first version (an internal prototype called "FaxJS") to tame Facebook's increasingly complex UI — the News Feed and ads interfaces were becoming impossible to keep in sync by hand. Facebook used it internally from 2011, then <strong>open-sourced React in May 2013</strong>. The developer world was sceptical at first: putting HTML-like markup inside JavaScript looked wrong. The talk that changed minds — <strong>Pete Hunt's "React: Rethinking best practices" at JSConf EU 2013</strong>, the video at the top of this lesson — argued that separating "markup" from "logic" was the wrong separation, and that a component (markup + logic together) was the right unit. React is maintained today by <strong>Meta</strong> and a large open-source community.</p>
<p><strong>Next.js — Vercel, 2015.</strong> React solved the UI, but every team re-invented the same things around it: routing, server rendering, bundling. <strong>Guillermo Rauch</strong> and his company (then ZEIT, now <strong>Vercel</strong>) released <strong>Next.js in October 2015</strong> to package those decisions into one framework. Its big leap came in 2020–2023 with the App Router and React Server Components — the model this course teaches.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">2011</span><span class="v">Jordan Walke builds React inside Facebook.</span></div>
  <div class="kv"><span class="k">May 2013</span><span class="v">React open-sourced; Pete Hunt's JSConf talk introduces it to the world.</span></div>
  <div class="kv"><span class="k">Oct 2015</span><span class="v">Guillermo Rauch releases Next.js at ZEIT/Vercel.</span></div>
  <div class="kv"><span class="k">2022–23</span><span class="v">Next.js App Router + React Server Components — the modern model.</span></div>
</div>

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

<div class="pitfall"><p><strong>Trap — following an App Router tutorial that is actually written for the Pages Router.</strong> The two live in the same framework and share most of their vocabulary, so the difference is easy to miss: &#96;getServerSideProps&#96;, &#96;_app.tsx&#96;, &#96;next/router&#96; and an &#96;api/&#96; folder all belong to the older Pages Router, and none of them do anything in &#96;app/&#96;. The code does not error helpfully — a &#96;getServerSideProps&#96; export in an App Router page is simply ignored, so the page renders with no data and nothing says why. Check the date and the imports before trusting an example: anything using &#96;next/router&#96; rather than &#96;next/navigation&#96; predates the split.</p></div>
<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://github.com/facebook/react/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/facebook/react — the source &amp; release history</span><span class="lc-sub">Every version since 2013. Reading the release notes is the truest history of the library.</span></span>
</a>
<a class="link-card dl" href="https://github.com/vercel/next.js/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/vercel/next.js — the Next.js source &amp; releases</span><span class="lc-sub">See how the App Router landed and how the framework evolved release by release.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>React là một THƯ VIỆN. Next.js là một FRAMEWORK.</h2>
<p class="lead">Người ta hay hỏi "React hay Next.js?" như thể chúng cạnh tranh nhau. Không hề. React là cỗ máy biến dữ liệu của bạn thành giao diện. Next.js là chiếc xe dựng quanh cỗ máy đó — nó bổ sung router, server, hệ thống build và câu chuyện triển khai mà React cố tình để trống.</p>

<h3>Một chút lịch sử: ai tạo ra chúng, và vì sao</h3>
<p><strong>React — Facebook, 2011 → mã nguồn mở 2013.</strong> Một kỹ sư Facebook tên <strong>Jordan Walke</strong> dựng phiên bản đầu tiên (một bản thử nghiệm nội bộ tên "FaxJS") để thuần hoá giao diện ngày càng phức tạp của Facebook — News Feed và các giao diện quảng cáo trở nên bất khả thi để giữ đồng bộ bằng tay. Facebook dùng nội bộ từ 2011, rồi <strong>mở mã nguồn React vào tháng 5/2013</strong>. Giới lập trình ban đầu hoài nghi: nhét markup giống HTML vào trong JavaScript trông thật sai. Bài talk làm đổi suy nghĩ — <strong>"React: Rethinking best practices" của Pete Hunt tại JSConf EU 2013</strong>, chính video đầu bài này — lập luận rằng tách "markup" khỏi "logic" là kiểu tách SAI, và một component (markup + logic đi cùng nhau) mới là đơn vị đúng. React ngày nay được <strong>Meta</strong> và một cộng đồng mã nguồn mở lớn duy trì.</p>
<p><strong>Next.js — Vercel, 2015.</strong> React giải quyết phần giao diện, nhưng mỗi nhóm lại tự phát minh lại cùng những thứ quanh nó: định tuyến, render trên server, đóng gói. <strong>Guillermo Rauch</strong> và công ty của ông (khi đó là ZEIT, nay là <strong>Vercel</strong>) ra mắt <strong>Next.js vào tháng 10/2015</strong> để gói những quyết định đó vào một framework. Bước nhảy lớn của nó đến vào 2020–2023 với App Router và React Server Components — mô hình khoá này dạy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">2011</span><span class="v">Jordan Walke dựng React bên trong Facebook.</span></div>
  <div class="kv"><span class="k">5/2013</span><span class="v">React mở mã nguồn; talk JSConf của Pete Hunt giới thiệu nó ra thế giới.</span></div>
  <div class="kv"><span class="k">10/2015</span><span class="v">Guillermo Rauch ra mắt Next.js tại ZEIT/Vercel.</span></div>
  <div class="kv"><span class="k">2022–23</span><span class="v">Next.js App Router + React Server Components — mô hình hiện đại.</span></div>
</div>

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

<div class="pitfall"><p><strong>Bẫy — làm theo một bài hướng dẫn App Router mà thật ra viết cho Pages Router.</strong> Hai cái sống trong cùng một framework và dùng chung phần lớn từ vựng, nên khác biệt rất dễ bị bỏ sót: &#96;getServerSideProps&#96;, &#96;_app.tsx&#96;, &#96;next/router&#96; và một thư mục &#96;api/&#96; đều thuộc về Pages Router cũ, và chẳng cái nào làm gì trong &#96;app/&#96;. Mã không báo lỗi một cách hữu ích — một export &#96;getServerSideProps&#96; trong một trang App Router đơn giản là bị lờ đi, nên trang vẽ ra không có dữ liệu mà chẳng gì nói vì sao. Hãy kiểm ngày đăng và các dòng import trước khi tin một ví dụ: thứ gì dùng &#96;next/router&#96; thay vì &#96;next/navigation&#96; là có trước lần tách đó.</p></div>
<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://github.com/facebook/react/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/facebook/react — mã nguồn &amp; lịch sử phát hành</span><span class="lc-sub">Mọi phiên bản từ 2013. Đọc release notes là cách xem lịch sử thật nhất của thư viện.</span></span>
</a>
<a class="link-card dl" href="https://github.com/vercel/next.js/releases" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">github.com/vercel/next.js — mã nguồn &amp; phát hành Next.js</span><span class="lc-sub">Xem App Router ra đời thế nào và framework tiến hoá qua từng bản phát hành.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Setting up & the dev loop|||0.3 — Cài đặt & vòng lặp phát triển',
      slug: 'nextjs-0-3-cai-dat',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js in 100 Seconds" (Fireship) — xem một app Next dựng ra sao.
      video: { url: 'https://youtu.be/Sklc_fQBmcs', durationSeconds: 0 },
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

<h3>Checking the toolchain before writing any code</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Node version first</b> — Next.js has a minimum, and being below it produces syntax errors in library code that look like your mistake. &#96;node --version&#96; before anything else.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Create the app, then read what it made</b> — &#96;npx create-next-app@latest&#96;. Open &#96;app/layout.tsx&#96; and &#96;app/page.tsx&#96; — those two files are the whole starting point.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Run the dev server and change one word</b> — If the browser updates without a reload, hot reloading works and the toolchain is sound.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then run a production build once</b> — &#96;next build&#96;. It type-checks the whole project and prints the route table, so you know both work before you have any code to debug.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a project created inside a folder whose path contains a space or a non-ASCII character.</strong> &#96;/Users/an/Tài liệu/my app/&#96; works for a while and then produces failures with no obvious connection to the path: a build tool that cannot resolve a module, a Docker mount that silently misses files, a script that runs in the wrong directory. Each error names something else, so the real cause is nearly impossible to guess. Keep project paths plain ASCII with no spaces — this is a five-second decision at creation time that removes a category of unexplainable problems later.</p></div>
<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nodejs.org — download Node.js 22 LTS</span><span class="lc-sub">The official installer for macOS, Windows and Linux. Pick the LTS build.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/cli/create-next-app" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">create-next-app — the official scaffolding docs</span><span class="lc-sub">Every question the setup wizard asks, explained, and all the flags.</span></span>
</a>
<a class="link-card dl" href="https://code.visualstudio.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">VS Code — the editor most React devs use</span><span class="lc-sub">Free. Add the "ES7+ React" and "Tailwind CSS IntelliSense" extensions and you're set.</span></span>
</a>
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

<h3>Kiểm bộ công cụ trước khi viết dòng mã nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Phiên bản Node trước tiên</b> — Next.js có một mức tối thiểu, và ở dưới mức đó sẽ sinh ra lỗi cú pháp trong mã của thư viện, trông y như bạn làm sai. Hãy &#96;node --version&#96; trước mọi thứ.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Tạo ứng dụng, rồi đọc thứ nó vừa tạo</b> — &#96;npx create-next-app@latest&#96;. Hãy mở &#96;app/layout.tsx&#96; và &#96;app/page.tsx&#96; — hai file đó chính là toàn bộ điểm khởi đầu.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Chạy dev server rồi đổi một chữ</b> — Nếu trình duyệt cập nhật mà không cần tải lại thì nạp nóng chạy tốt và bộ công cụ lành lặn.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi chạy một bản build production một lần</b> — &#96;next build&#96;. Nó kiểm kiểu cả dự án và in ra bảng route, nên bạn biết cả hai đều chạy được từ khi chưa có mã nào để gỡ lỗi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một dự án tạo trong một thư mục có đường dẫn chứa dấu cách hoặc ký tự ngoài ASCII.</strong> &#96;/Users/an/Tài liệu/my app/&#96; chạy được một thời gian rồi sinh ra những cú hỏng chẳng có liên hệ rõ ràng nào với đường dẫn: một công cụ build không giải nổi một module, một mount Docker lặng lẽ bỏ sót file, một script chạy nhầm thư mục. Mỗi lỗi lại gọi tên một thứ khác, nên nguyên nhân thật gần như không đoán nổi. Hãy giữ đường dẫn dự án thuần ASCII và không có dấu cách — đây là một quyết định năm giây lúc tạo dự án, và nó gỡ bỏ cả một họ vấn đề không giải thích nổi về sau.</p></div>
<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nodejs.org — tải Node.js 22 LTS</span><span class="lc-sub">Bộ cài chính thức cho macOS, Windows và Linux. Chọn bản LTS.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/api-reference/cli/create-next-app" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">create-next-app — tài liệu dựng khung chính thức</span><span class="lc-sub">Mọi câu hỏi trình cài đặt hỏi, giải thích rõ, và tất cả các cờ.</span></span>
</a>
<a class="link-card dl" href="https://code.visualstudio.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">VS Code — trình soạn thảo hầu hết React dev dùng</span><span class="lc-sub">Miễn phí. Thêm extension "ES7+ React" và "Tailwind CSS IntelliSense" là xong.</span></span>
</a>
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

<h3>📚 Keep these open while you study</h3>
<p>You do not need to read these cover to cover — use them the way a working developer does: to look something up the moment you need it.</p>
<a class="link-card dl" href="https://react.dev/reference/react" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — the hooks &amp; API reference</span><span class="lc-sub">When you forget exactly what useEffect or useMemo does, this is the page to open.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/learn — the official interactive Next.js course</span><span class="lc-sub">A free, hands-on companion straight from the Next.js team. Great to do alongside our Stage 3.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">MDN Web Docs — the web platform itself</span><span class="lc-sub">HTML, CSS, JavaScript, the DOM, fetch. React sits on top of all of this; MDN is the ground truth.</span></span>
</a>

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

<h3>📚 Hãy mở sẵn những thứ này khi học</h3>
<p>Bạn không cần đọc hết từ đầu tới cuối — hãy dùng chúng như một lập trình viên đang làm việc: tra cứu đúng lúc cần.</p>
<a class="link-card dl" href="https://react.dev/reference/react" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">react.dev/reference — tra cứu hooks &amp; API</span><span class="lc-sub">Khi bạn quên chính xác useEffect hay useMemo làm gì, đây là trang cần mở.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/learn" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">nextjs.org/learn — khoá Next.js tương tác chính thức</span><span class="lc-sub">Một người bạn đồng hành thực hành miễn phí thẳng từ đội Next.js. Rất hợp làm song song với Giai đoạn 3 của ta.</span></span>
</a>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">MDN Web Docs — chính nền tảng web</span><span class="lc-sub">HTML, CSS, JavaScript, DOM, fetch. React nằm trên tất cả những thứ này; MDN là nguồn sự thật gốc.</span></span>
</a>

<div class="callout ok">
<p><strong>Sẵn sàng chưa?</strong> Chương 1 bắt đầu ở nơi mọi app React bắt đầu: với JSX, và ý tưởng quan trọng nhất của cả framework — rằng bạn <em>mô tả</em> giao diện mình muốn, còn React tự lo cách đưa màn hình tới đó.</p>
</div>
</div>
`,
    },
  ],
};
