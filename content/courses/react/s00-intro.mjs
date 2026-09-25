import { gallery, slide } from './_slides.mjs';

/**
 * React — Mục 0 (soạn từ khung 25/09/2026): Vì sao React · bắt đầu tại đây · cài đặt · JSX · JavaScript cho React · quiz.
 * GIỮ slug khung: rx-0-8-bat-dau-tai-day, rx-0-9-bat-dau-khi-khong-co, rx-0-1-cai-dat, rx-0-2-jsx (type LESSON).
 * MỚI: rx-0-0-slides (DOCUMENT), rx-0-3-js-cho-react (LESSON), rx-0-4-kiem-tra (QUIZ).
 *
 * Mọi output trong bài chạy THẬT 25/09/2026 trên máy ảo soạn bài (Node 22.22.2, npm 10.9.7): create-vite 9.2.1,
 * react 19.3.0, vite 8.3.1, typescript 6.0.3, vitest 5.0.1, @testing-library/react 16.3.3, jsdom 30.1.1;
 * create-react-app 5.1.0 (react-scripts 5.0.1) chỉ để đo so sánh; jQuery 3.7.1 cho minh hoạ "giao diện lệch dữ liệu".
 * Mốc lịch sử kiểm trên bản clone react.dev/blog, CHANGELOG.md của facebook/react và legacy.reactjs.org/blog.
 * Deck: scripts/slides-src/rx-00.mjs (30 slide).
 */

const REF = '?ref=%2Fcourses%2Freact%2Flearn&reflabel=React';

export default {
  title: 'Section 0 — Why React|||Mục 0 — Vì sao React',
  description: 'React giải quyết gì và cách học: lịch sử có mốc kiểm nguồn, vì sao công ty vẫn tuyển, tạo dự án Vite + TypeScript, JSX thật sự là gì, và phần JavaScript bạn cần trước khi viết component.',
  lessons: [

    /* ─────────────────────────── Bắt đầu 1/2 ─────────────────────────── */
    {
      title: 'Start here (1/2) — What React is, where it came from, and why companies still hire for it|||Bắt đầu tại đây (1/2) — React là gì, ra đời thế nào, vì sao công ty vẫn tuyển',
      slug: 'rx-0-8-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'UI là hàm của state, mười hai mốc lịch sử có nguồn kiểm được, React so với Vue/Angular/Svelte, bản đồ FER202 sang cách công ty làm, và khoá này đưa bạn tới đâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What React is, where it came from, and why companies still hire for it</h2>
<p class="lead">React is a JavaScript library for building user interfaces out of small pieces called components. Its one big idea fits in a sentence: you describe what the screen should look like for the current data, and React works out what to change when the data changes. Everything else in this course — hooks, forms, data fetching, testing — is built on that sentence.</p>

<p>This first lesson gives you the map before the journey. You will see what "the UI is a function of the state" actually means with a concrete clinic booking screen, walk through twelve dates in React&#39;s history that you can check yourself (and one popular story we could <em>not</em> verify, so we do not repeat it), compare React honestly with Vue, Angular and Svelte, and translate what you learned in FER202 into what a company expects in 2026. No code to install yet; that starts in Lesson 0.1.</p>

<p>Who this course is for: students taking FER202 at FPT (or anyone who learned React from a university syllabus), with JavaScript that is still a bit shaky, who want to be ready for a first frontend job interview. Every time an unfamiliar piece of JavaScript appears — destructuring, spread, <code>?.</code>, <code>async/await</code> — it is explained right where it appears, in a short "JS quick reminder". Lesson 0.3 collects all of them in one place.</p>

<h3>React in one picture: the UI is a function of the state</h3>
${slide('rx-00', 3, 'UI = f(state): sửa dữ liệu, React vẽ lại')}
<p>Look at the slide. On the left is the <strong>state</strong> (the data your screen depends on right now): an array of three time slots at a clinic, one of them already booked. In the middle is a <strong>component</strong>: an ordinary JavaScript function that receives that data and returns a description of the screen. On the right is the result the user sees: "2 slots left", one grey button, two green ones.</p>
<p>The important part is what you <em>do not</em> do. You never write "find the second button and turn it grey, then find the counter and subtract one". You change the data — mark the 08:30 slot as taken — and React calls your function again, compares the new description with the previous one, and patches only the parts of the page that differ. The words you will meet for this, with their Vietnamese meaning:</p>
<ul>
<li><strong>state (trạng thái)</strong> — data that can change while the page is open and that the screen depends on;</li>
<li><strong>component</strong> — a function that turns data into a description of UI; its name starts with a capital letter, e.g. <code>TheBacSi</code>;</li>
<li><strong>render (vẽ ra)</strong> — React calling your component to get that description. "Re-render" means calling it again after something changed;</li>
<li><strong>declarative (khai báo)</strong> — you describe <em>what</em> the screen should be; the opposite, <strong>imperative (mệnh lệnh)</strong>, is writing each step of <em>how</em> to change it.</li>
</ul>
<p>Here is the same idea in code, the imperative way first. This is roughly what you would write with plain DOM calls:</p>
<pre><code class="language-js">// Imperative: you edit the page step by step
const nut = document.querySelector('#nut-0830');
nut.disabled = true;
nut.textContent = 'Đã đặt';
const dem = document.querySelector('#con-trong');
dem.textContent = Number(dem.textContent) - 1;   // and hope nobody else edits it</code></pre>
<p>And the declarative way, which is what a React component looks like (you will write this for real from Chapter 1):</p>
<pre><code class="language-tsx">// Declarative: you describe the screen for ANY value of khungGio
function DatLich({ khungGio }: { khungGio: KhungGio[] }) {
  const conTrong = khungGio.filter((k) =&gt; k.conTrong).length;
  return (
    &lt;&gt;
      &lt;p&gt;Còn {conTrong} khung trống&lt;/p&gt;
      {khungGio.map((k) =&gt; (
        &lt;button key={k.id} disabled={!k.conTrong}&gt;{k.conTrong ? 'Đặt' : 'Đã đặt'}&lt;/button&gt;
      ))}
    &lt;/&gt;
  );
}</code></pre>
<p>Do not worry about the syntax yet (the angle brackets inside JavaScript are JSX, Lesson 0.2; <code>filter</code> and <code>map</code> are array functions, Lesson 0.3). Notice only the shape: there is no "subtract one", no "find the button". The count is <em>computed</em> from the data every time. That is why React code scales: when a colleague adds a "Cancel" button next month, they change the data, and every number on the screen follows. In Lesson 2/2 you will run a real experiment where the imperative version gets this wrong.</p>

<div class="callout"><p><strong>JS quick reminder: a function that returns something.</strong> <code>function f(x) { return x * 2 }</code> — call it with <code>f(3)</code> and you get <code>6</code>. A component is exactly that: React calls <code>DatLich(...)</code> and gets back a description of the screen. Calling it twice with the same data gives the same result — the idea of a <em>pure</em> function, which Chapter 1 makes precise.</p></div>

<p>Two more facts to keep straight from day one. First, React is a <strong>library</strong>, not a full framework: it only renders UI. Routing, forms, fetching data from a server and testing come from other libraries you choose (this course picks the ones companies use in 2026: React Router, React Hook Form + Zod, TanStack Query, Vitest + Testing Library). Second, the same component model runs in several places: in the browser with <code>react-dom</code>, on phones with React Native, and on the server inside frameworks such as Next.js. Learning React once pays off in all three.</p>

<h3>Where React came from: twelve dates you can check</h3>
${slide('rx-00', 4, 'Dòng thời gian React 2012–2026, mọi mốc có nguồn')}
<p>History matters in interviews for a simple reason: it explains why the code you meet at work looks the way it does. A 2018 codebase full of classes, a 2020 one full of hooks, a 2025 one with Server Components — all are "React", written in different eras. Every date on the slide was checked against a primary source (the React blog on react.dev, the <code>CHANGELOG.md</code> in the React repository, or the archived blog at legacy.reactjs.org), checked in September 2026.</p>
<table>
<thead><tr><th>Date</th><th>What happened</th><th>Source</th></tr></thead>
<tbody>
<tr><td>before 03/2012</td><td>Jordan Walke builds FaxJS as a side project: props, state, re-rendering and diffing a tree are born there. In March 2012 he brings it into Facebook&#39;s code as "FBolt"; with Tom Occhino it is renamed "React".</td><td>legacy blog, "Our First 50,000 Stars" (2016); react.dev "Acknowledgements"</td></tr>
<tr><td>29/05/2013</td><td>React is open-sourced: version 0.3.0, "Initial public release".</td><td>CHANGELOG.md; legacy blog "One Year of Open-Source React" (29/05/2014)</td></tr>
<tr><td>01/2015 → 26/03/2015</td><td>React Native announced at the first React.js Conf, then open-sourced.</td><td>legacy blog "Introducing React Native"</td></tr>
<tr><td>22/07/2016</td><td>Create React App (CRA) — "a new officially supported way to create single-page React applications".</td><td>legacy blog "Create Apps with No Configuration"</td></tr>
<tr><td>26/09/2017</td><td>React 16, "the first version of React built on top of a new core architecture, codenamed Fiber".</td><td>CHANGELOG.md; legacy blog "React v16.0"</td></tr>
<tr><td>06/02/2019</td><td>React 16.8, "The One With Hooks": state and effects in function components.</td><td>CHANGELOG.md; legacy blog "React v16.8"</td></tr>
<tr><td>29/03/2022</td><td>React 18: concurrent rendering, automatic batching.</td><td>CHANGELOG.md</td></tr>
<tr><td>05/12/2024</td><td>React 19 stable: Actions, <code>use()</code>, <code>ref</code> as a prop.</td><td>react.dev/blog "React v19"</td></tr>
<tr><td>14/02/2025</td><td>Create React App deprecated for new apps; the React team points to frameworks or build tools such as Vite.</td><td>react.dev/blog "Sunsetting Create React App"</td></tr>
<tr><td>07/10/2025</td><td>React Compiler 1.0: automatic memoization at build time.</td><td>react.dev/blog "React Compiler v1.0"</td></tr>
<tr><td>24/02/2026</td><td>The React Foundation launches under the Linux Foundation; React, React Native and JSX are no longer owned by Meta.</td><td>react.dev/blog "The React Foundation"</td></tr>
<tr><td>09/09/2026</td><td>React 19.3 (the version this course uses): stable <code>&lt;ViewTransition&gt;</code>, Fragment refs.</td><td>react.dev/blog "React 19.3"; CHANGELOG.md</td></tr>
</tbody>
</table>
<p>A note on what is <em>not</em> in the table. Many articles say React was "announced at JSConf US in May 2013". That may well be true, but none of the official sources we could read on the machine used to write this course says so; the React team&#39;s own record gives the open-source date (29 May 2013) and nothing about the conference. The course rule is simple: no source, no claim. You will be asked about React&#39;s age in interviews; "open-sourced by Facebook in 2013" is correct and enough.</p>
<p>Three dates matter directly for the code you will read at work. <strong>2019 (Hooks)</strong> is the line between "class components with lifecycle methods" and "function components with hooks" — FER202 still shows some classes, companies write functions. <strong>2025 (CRA deprecated)</strong> is why every new project in this course starts with Vite. <strong>2026 (React Foundation)</strong> answers the "is React going to be abandoned?" worry: it is now governed by a foundation whose founding members include Amazon, Meta, Microsoft and Vercel, not by one company.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "React makes my app fast because of the virtual DOM".</strong> This sentence is repeated in many interview answers and it is half wrong. React&#39;s job is to make UI code <em>predictable</em>: you describe the screen, it computes the smallest DOM change. That is usually fast enough, but React adds work (calling your components again, comparing descriptions) compared to a hand-tuned DOM update. A React app that re-renders a list of 5,000 items on every keystroke is slow, virtual DOM or not. Say "React keeps the UI in sync with the data and minimises DOM changes; performance still depends on how I structure state" — and Chapter 8 shows how to measure it.</div>

<h3>Why companies still hire for React in 2026</h3>
<p>This course does not quote market-share numbers: none of the surveys could be checked from the machine used to write it, and invented numbers are worse than none. Here are reasons you can verify yourself, and the 🧪 exercise at the end of this lesson asks you to count real job ads.</p>
<ul>
<li><strong>A huge amount of existing code.</strong> React&#39;s own versioning policy says the Facebook codebase alone has over 50,000 React components, and that is why the team works hard on upgrade paths. Companies with years of React code keep hiring people to maintain and extend it.</li>
<li><strong>One model, three platforms.</strong> The same components-and-state thinking works on the web (<code>react-dom</code>), on mobile (React Native) and on the server (Next.js). A team can share people and patterns across all three.</li>
<li><strong>The ecosystem.</strong> For almost any problem — forms, tables, charts, data fetching, animation — there are mature libraries and many engineers who already know them. You will use several of them in this course.</li>
<li><strong>Stable, slow-moving core.</strong> The code you learn here (function components, hooks) has been the recommended style since 2019 and still is in React 19.3. What you learn keeps its value.</li>
<li><strong>Neutral governance.</strong> Since February 2026 React belongs to the React Foundation, which lowers the "what if Meta drops it" risk that some companies used to raise.</li>
</ul>

<h3>React compared with Vue, Angular and Svelte</h3>
${slide('rx-00', 5, 'React, Vue, Angular, Svelte — bốn triết lý')}
<p>The table on the slide compares the four most common choices, with the version each package had on npm in September 2026 (checked with <code>npm view</code>). A few points deserve more than a table cell:</p>
<ul>
<li><strong>React</strong> writes the UI in JSX, which is just JavaScript with a tag syntax. There is little "magic": a list is <code>array.map</code>, a condition is a normal <code>? :</code>. The price is that you must be comfortable with JavaScript, and you must choose your own router, form library, and so on.</li>
<li><strong>Vue</strong> uses HTML-like templates with directives (<code>v-if</code>, <code>v-for</code>) in <code>.vue</code> files, and ships official companions (Vue Router, Pinia). Many people find the first week easier.</li>
<li><strong>Angular</strong> is a complete framework: routing, forms, HTTP, dependency injection, all in one box, written in TypeScript classes with decorators. Big enterprises like the "everything decided" approach; there are more concepts to learn up front.</li>
<li><strong>Svelte</strong> is a compiler: your <code>.svelte</code> file is turned into small, direct DOM code at build time. Very little boilerplate; a smaller job market than React in most places.</li>
</ul>
<p>None of them is "the best". The honest interview answer is about trade-offs: React for its ecosystem, React Native and hiring pool; Angular when a large team wants one prescribed way; Vue for gentle adoption; Svelte for minimal code. Once you know React well, learning any of the other three takes weeks, not months, because components, props, state and one-way data flow exist in all of them.</p>

<div class="callout"><p><strong>Common interview question.</strong> "What is React, and how is it different from a framework like Angular?"</p>
<p>A good answer in 4 lines: React is a JavaScript library for building UIs from components. I describe what the UI should look like for the current state; React re-renders and updates the DOM when state changes. It only covers the view layer, so a project picks its own router, data fetching and form libraries — Angular ships all of those built in. The same component model also runs on mobile with React Native.</p></div>

<h3>From FER202 to what companies do</h3>
${slide('rx-00', 6, 'Bản đồ FER202 → công ty')}
<p>If you are taking FER202, you already have the foundations: components, props, state, events, lists, maybe Redux. What differs at work in 2026 is mostly the <em>tooling around</em> those foundations. The slide maps each piece, and says which chapter of this course teaches the modern version.</p>
<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>Create React App, PropTypes, class components with <code>componentDidMount</code>, Redux with thunk, React-Bootstrap → Vite + TypeScript, function components with hooks, TanStack Query for server data, Zustand for client state, Tailwind or CSS Modules · <em>Why:</em> the syllabus tools are not wrong — they teach the same ideas and are fine for a lab — but CRA was deprecated in February 2025, TypeScript catches mistakes before the code runs instead of warning in the console like PropTypes, and hooks are the only style new React documentation teaches. You will still meet the FER202 style in older company projects; knowing both, and why things moved, is exactly what an interviewer wants to hear.</p></div>

<h3>Where this course takes you</h3>
${slide('rx-00', 7, 'Lộ trình khoá: Mục 0 → Chương 14')}
<p>The course runs from this section to Chapter 14 and builds one project the whole way: <strong>"Đặt lịch phòng khám An Tâm"</strong>, a clinic booking app. By the end of Section 0 you have a Vite + TypeScript project with a static home page and one passing test. Chapters 1–5 add components, state, forms and shared state; 6–9 add a (mocked) API, routing, performance and a full test suite; Chapter 10 is the mid-course project, where you finish the app yourself; 11–14 go deeper (React internals, React 19 features, architecture, going to production).</p>
<p>Each chapter ends with <strong>🛠 Keep building the project</strong>: steps, a "done when" you can check (a green test or a matching screenshot) and a solution you open only after trying. Other courses on this site connect here: <a href="/courses/typescript">TypeScript</a> for the type system, <a href="/courses/testing">Testing</a> for testing in depth, <a href="/courses/nextjs">Next.js</a> after Chapter 7, <a href="/courses/github-actions">GitHub Actions</a> for CI in Chapter 14.</p>

<div class="callout"><p><strong>Common interview question.</strong> "Why did the React team deprecate Create React App?"</p>
<p>Answer: CRA had no active maintainers, and as a plain build setup it could not solve problems real apps have — routing, data fetching, code splitting — without growing into a framework. In February 2025 the React team recommended frameworks, or build tools such as Vite, Parcel or Rsbuild for projects that do not need a framework. In practice new SPAs start with <code>npm create vite@latest</code>.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> before writing any React, check the two claims of this lesson that you can verify yourself.</p><ol>
<li>Open react.dev/blog and find the posts "Sunsetting Create React App" and "React Compiler v1.0". Write down their dates and compare them with the table above.</li>
<li>Open any Vietnamese IT job site, filter "Frontend" or "Fresher Frontend", and read the first 20 ads. Count how many mention React, Vue, Angular and Svelte (an ad can mention several).</li>
<li>Write the answer to "What is React?" in your own words in at most four sentences, without the words "virtual DOM" and "fast".</li>
</ol><p><strong>Done when:</strong> your two dates are 14/02/2025 and 07/10/2025; you have four numbers from your own count (keep them — Lesson 2/2 uses them to pick a learning path); and your four-sentence answer mentions components, state, and "React updates the DOM when the state changes".</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">component</span><span class="v">a function that turns data into a description of UI; name starts with a capital letter</span></div>
<div class="kv"><span class="k">state (trạng thái)</span><span class="v">data that can change while the page is open and that the screen depends on</span></div>
<div class="kv"><span class="k">render (vẽ ra)</span><span class="v">React calling a component to get its UI description; re-render = calling it again</span></div>
<div class="kv"><span class="k">declarative (khai báo)</span><span class="v">describe what the screen should be; React works out the steps</span></div>
<div class="kv"><span class="k">imperative (mệnh lệnh)</span><span class="v">write each step that changes the page yourself (plain DOM, jQuery)</span></div>
<div class="kv"><span class="k">Hooks</span><span class="v">functions like <code>useState</code> that give function components state and effects (since React 16.8, 2019)</span></div>
<div class="kv"><span class="k">Create React App (CRA)</span><span class="v">the 2016 official project generator, deprecated for new apps on 14/02/2025</span></div>
<div class="kv"><span class="k">React Foundation</span><span class="v">independent owner of React, React Native and JSX since 24/02/2026, hosted by the Linux Foundation</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>React is a library for building UIs from components; the UI is a function of the state — change data, React updates the screen.</li>
<li>Declarative code describes the screen for any data, so new features cannot "forget" to update a number.</li>
<li>Open-sourced 29/05/2013; Fiber in React 16 (2017); Hooks in 16.8 (2019); React 19 in 12/2024; CRA deprecated 02/2025; React 19.3 in 09/2026 — every date has a source.</li>
<li>Companies hire for React because of existing code, one model for web/mobile/server, a large ecosystem and a stable core now owned by a foundation.</li>
<li>Vue, Angular and Svelte make different trade-offs; the concepts transfer.</li>
<li>FER202 teaches the right ideas with older tools; this course teaches the 2026 tooling and says where each FER202 habit still appears.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Quick Start</span><span class="lc-sub">react.dev/learn — components, JSX, state and props in one page; the official starting point this section follows.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Sunsetting Create React App (14/02/2025)</span><span class="lc-sub">react.dev/blog/2025/02/14/sunsetting-create-react-app — why CRA was deprecated and what to use instead.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — The React Foundation (24/02/2026)</span><span class="lc-sub">react.dev/blog/2026/02/24/the-react-foundation — who governs React now.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — CHANGELOG.md</span><span class="lc-sub">github.com/facebook/react/blob/main/CHANGELOG.md — release dates from 0.3.0 (29/05/2013) to 19.3.0 (09/09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Legacy React blog — Our First 50,000 Stars</span><span class="lc-sub">legacy.reactjs.org/blog/2016/09/28/our-first-50000-stars.html — FaxJS, FBolt and how JSX was designed, told by the React team.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — HTML, CSS and JavaScript first</span><span class="lc-sub">/courses/web-foundations/learn${REF} — if the DOM and JavaScript functions still feel new, spend a week there first.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>React là gì, ra đời thế nào, vì sao công ty vẫn tuyển</h2>
<p class="lead">React là một thư viện JavaScript để dựng giao diện từ những mảnh nhỏ gọi là component. Ý tưởng lớn nhất của nó gói trong một câu: bạn mô tả màn hình phải trông thế nào với dữ liệu hiện tại, còn React tự tính xem cần đổi chỗ nào khi dữ liệu đổi. Mọi thứ còn lại trong khoá — hook, form, lấy dữ liệu, test — đều xây trên câu đó.</p>

<p>Bài đầu tiên đưa bạn tấm bản đồ trước khi lên đường. Bạn sẽ thấy "giao diện là hàm của state" nghĩa là gì qua một màn hình đặt lịch khám cụ thể, đi qua mười hai mốc lịch sử của React mà bạn tự kiểm được (và một câu chuyện rất phổ biến mà chúng tôi <em>không</em> kiểm được nguồn nên không kể lại), so sánh React với Vue, Angular, Svelte cho công bằng, và "dịch" những gì học ở FER202 sang thứ công ty chờ ở bạn năm 2026. Chưa phải cài gì cả; việc đó bắt đầu ở Bài 0.1.</p>

<p>Khoá này dành cho ai: sinh viên đang học FER202 ở FPT (hoặc ai học React theo giáo trình trường), JavaScript còn hơi lung lay, và muốn sẵn sàng cho buổi phỏng vấn frontend đầu tiên. Mỗi khi gặp một đoạn JavaScript lạ — destructuring, spread, <code>?.</code>, <code>async/await</code> — nó được giải thích ngay tại chỗ trong một khung nhỏ "JS nhắc nhanh". Bài 0.3 gom tất cả về một chỗ.</p>

<h3>React trong một hình: giao diện là hàm của state</h3>
${slide('rx-00', 3, 'UI = f(state): sửa dữ liệu, React vẽ lại')}
<p>Nhìn slide. Bên trái là <strong>state</strong> (dữ liệu mà màn hình đang phụ thuộc vào): một mảng ba khung giờ ở phòng khám, một khung đã có người đặt. Ở giữa là một <strong>component</strong>: một hàm JavaScript bình thường nhận dữ liệu đó và trả về bản mô tả màn hình. Bên phải là kết quả người dùng thấy: "Còn 2 khung trống", một nút xám, hai nút xanh.</p>
<p>Điều quan trọng nằm ở việc bạn <em>không</em> làm. Bạn không bao giờ viết "tìm cái nút thứ hai, tô nó xám, rồi tìm ô đếm và trừ đi một". Bạn đổi dữ liệu — đánh dấu khung 08:30 đã có người đặt — và React gọi lại hàm của bạn, so bản mô tả mới với bản cũ, rồi chỉ sửa những chỗ trên trang thật sự khác đi. Các từ bạn sẽ gặp cho chuyện này:</p>
<ul>
<li><strong>state (trạng thái)</strong> — dữ liệu có thể đổi khi trang đang mở, và màn hình phụ thuộc vào nó;</li>
<li><strong>component</strong> — một hàm biến dữ liệu thành bản mô tả giao diện; tên viết hoa chữ đầu, vd <code>TheBacSi</code>;</li>
<li><strong>render (vẽ ra)</strong> — React gọi component của bạn để lấy bản mô tả đó. "Render lại" là gọi lại lần nữa sau khi có gì đó đổi;</li>
<li><strong>declarative (khai báo)</strong> — bạn mô tả màn hình <em>là gì</em>; ngược lại, <strong>imperative (mệnh lệnh)</strong> là tự viết từng bước <em>làm sao</em> để đổi nó.</li>
</ul>
<p>Cùng một ý bằng code, kiểu mệnh lệnh trước. Đây gần đúng là thứ bạn viết khi gọi DOM trực tiếp:</p>
<pre><code class="language-js">// Mệnh lệnh: bạn sửa trang từng bước
const nut = document.querySelector('#nut-0830');
nut.disabled = true;
nut.textContent = 'Đã đặt';
const dem = document.querySelector('#con-trong');
dem.textContent = Number(dem.textContent) - 1;   // và cầu mong không ai khác sửa nó</code></pre>
<p>Và kiểu khai báo — đây là hình dạng của một component React (bạn sẽ viết thật từ Chương 1):</p>
<pre><code class="language-tsx">// Khai báo: mô tả màn hình cho MỌI giá trị của khungGio
function DatLich({ khungGio }: { khungGio: KhungGio[] }) {
  const conTrong = khungGio.filter((k) =&gt; k.conTrong).length;
  return (
    &lt;&gt;
      &lt;p&gt;Còn {conTrong} khung trống&lt;/p&gt;
      {khungGio.map((k) =&gt; (
        &lt;button key={k.id} disabled={!k.conTrong}&gt;{k.conTrong ? 'Đặt' : 'Đã đặt'}&lt;/button&gt;
      ))}
    &lt;/&gt;
  );
}</code></pre>
<p>Đừng lo cú pháp (dấu ngoặc nhọn nằm giữa JavaScript là JSX, Bài 0.2; <code>filter</code> và <code>map</code> là hàm của mảng, Bài 0.3). Chỉ để ý hình dạng: không có "trừ đi một", không có "tìm cái nút". Con số được <em>tính ra</em> từ dữ liệu mỗi lần. Vì thế code React lớn lên được: tháng sau đồng nghiệp thêm nút "Huỷ", họ chỉ đổi dữ liệu, và mọi con số trên màn hình tự đi theo. Ở Bài 2/2 bạn sẽ chạy một thí nghiệm thật trong đó bản mệnh lệnh làm sai đúng chỗ này.</p>

<div class="callout"><p><strong>JS nhắc nhanh: hàm trả về một giá trị.</strong> <code>function f(x) { return x * 2 }</code> — gọi <code>f(3)</code> thì được <code>6</code>. Component đúng là như vậy: React gọi <code>DatLich(...)</code> và nhận lại bản mô tả màn hình. Gọi hai lần với cùng dữ liệu thì ra cùng kết quả — đó là ý tưởng hàm <em>thuần</em> (pure), Chương 1 sẽ nói cho chính xác.</p></div>

<p>Thêm hai điều cần rõ ngay từ đầu. Thứ nhất, React là <strong>thư viện</strong>, không phải framework trọn gói: nó chỉ lo vẽ giao diện. Định tuyến, form, lấy dữ liệu từ server và test đến từ các thư viện khác mà bạn tự chọn (khoá này chọn đúng bộ công ty dùng năm 2026: React Router, React Hook Form + Zod, TanStack Query, Vitest + Testing Library). Thứ hai, cùng một mô hình component chạy ở nhiều nơi: trong trình duyệt với <code>react-dom</code>, trên điện thoại với React Native, và trên server bên trong framework như Next.js. Học React một lần, dùng được cả ba.</p>

<h3>React ra đời thế nào: mười hai mốc kiểm được</h3>
${slide('rx-00', 4, 'Dòng thời gian React 2012–2026, mọi mốc có nguồn')}
<p>Lịch sử có ích khi phỏng vấn vì một lý do đơn giản: nó giải thích vì sao code bạn gặp ở công ty trông như thế. Một dự án 2018 đầy class, một dự án 2020 đầy hook, một dự án 2025 có Server Components — tất cả đều là "React", chỉ là viết ở những thời kỳ khác nhau. Mọi mốc trên slide đều được đối chiếu với nguồn gốc (blog React trên react.dev, file <code>CHANGELOG.md</code> trong kho mã React, hoặc blog lưu trữ ở legacy.reactjs.org), kiểm 09/2026.</p>
<table>
<thead><tr><th>Thời điểm</th><th>Chuyện gì xảy ra</th><th>Nguồn</th></tr></thead>
<tbody>
<tr><td>trước 03/2012</td><td>Jordan Walke viết FaxJS như một dự án riêng: props, state, vẽ lại cả cây rồi so khác biệt ra đời ở đó. Tháng 3/2012 anh đưa nó vào mã nguồn Facebook với tên "FBolt"; cùng Tom Occhino đổi tên thành "React".</td><td>blog cũ "Our First 50,000 Stars" (2016); trang "Acknowledgements" của react.dev</td></tr>
<tr><td>29/05/2013</td><td>React mở mã nguồn: phiên bản 0.3.0, "Initial public release".</td><td>CHANGELOG.md; blog cũ "One Year of Open-Source React" (29/05/2014)</td></tr>
<tr><td>01/2015 → 26/03/2015</td><td>React Native được công bố ở React.js Conf đầu tiên, rồi mở mã.</td><td>blog cũ "Introducing React Native"</td></tr>
<tr><td>22/07/2016</td><td>Create React App (CRA) — "cách tạo ứng dụng React một trang được hỗ trợ chính thức".</td><td>blog cũ "Create Apps with No Configuration"</td></tr>
<tr><td>26/09/2017</td><td>React 16, "phiên bản đầu tiên xây trên kiến trúc lõi mới, tên mã Fiber".</td><td>CHANGELOG.md; blog cũ "React v16.0"</td></tr>
<tr><td>06/02/2019</td><td>React 16.8, "The One With Hooks": state và effect trong function component.</td><td>CHANGELOG.md; blog cũ "React v16.8"</td></tr>
<tr><td>29/03/2022</td><td>React 18: concurrent rendering, gộp cập nhật tự động.</td><td>CHANGELOG.md</td></tr>
<tr><td>05/12/2024</td><td>React 19 ổn định: Actions, <code>use()</code>, <code>ref</code> thành prop thường.</td><td>react.dev/blog "React v19"</td></tr>
<tr><td>14/02/2025</td><td>Create React App bị khai tử cho dự án mới; đội React chỉ sang framework hoặc công cụ build như Vite.</td><td>react.dev/blog "Sunsetting Create React App"</td></tr>
<tr><td>07/10/2025</td><td>React Compiler 1.0: tự memo lúc build.</td><td>react.dev/blog "React Compiler v1.0"</td></tr>
<tr><td>24/02/2026</td><td>React Foundation ra mắt dưới Linux Foundation; React, React Native và JSX không còn thuộc sở hữu của Meta.</td><td>react.dev/blog "The React Foundation"</td></tr>
<tr><td>09/09/2026</td><td>React 19.3 (bản khoá này dùng): <code>&lt;ViewTransition&gt;</code> ổn định, ref cho Fragment.</td><td>react.dev/blog "React 19.3"; CHANGELOG.md</td></tr>
</tbody>
</table>
<p>Một ghi chú về thứ <em>không</em> có trong bảng. Nhiều bài viết kể React được "công bố tại JSConf US tháng 5/2013". Có thể đúng, nhưng không nguồn chính thức nào mà chúng tôi đọc được trên máy soạn bài nói điều đó; ghi chép của chính đội React chỉ cho ngày mở mã (29/05/2013), không nhắc hội nghị. Luật của khoá rất đơn giản: không có nguồn thì không khẳng định. Phỏng vấn có hỏi React bao nhiêu tuổi, "Facebook mở mã năm 2013" là đúng và đủ.</p>
<p>Ba mốc ảnh hưởng trực tiếp tới code bạn sẽ đọc ở công ty. <strong>2019 (Hooks)</strong> là ranh giới giữa "class component với các hàm vòng đời" và "function component với hook" — FER202 vẫn còn vài slide class, công ty viết hàm. <strong>2025 (CRA bị khai tử)</strong> là lý do mọi dự án mới trong khoá bắt đầu bằng Vite. <strong>2026 (React Foundation)</strong> trả lời nỗi lo "React có bị bỏ rơi không": giờ nó do một quỹ quản lý, với các thành viên sáng lập gồm Amazon, Meta, Microsoft, Vercel…, không còn của riêng một công ty.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "React làm app nhanh nhờ virtual DOM".</strong> Câu này lặp lại trong rất nhiều câu trả lời phỏng vấn và nó sai một nửa. Việc của React là làm code giao diện <em>dễ đoán</em>: bạn mô tả màn hình, nó tính thay đổi DOM nhỏ nhất. Thường thì vậy là đủ nhanh, nhưng so với một lần sửa DOM viết tay thật khéo, React còn tốn thêm việc (gọi lại component, so bản mô tả). Một app React vẽ lại danh sách 5.000 dòng mỗi lần gõ phím thì vẫn chậm, có virtual DOM hay không. Hãy nói "React giữ giao diện khớp với dữ liệu và giảm thiểu thay đổi DOM; hiệu năng vẫn phụ thuộc vào cách tôi tổ chức state" — Chương 8 sẽ chỉ cách đo.</div>

<h3>Vì sao công ty vẫn tuyển React năm 2026</h3>
<p>Khoá này không đưa con số thị phần: không khảo sát nào kiểm được từ máy soạn bài, và số bịa còn tệ hơn không có số. Đây là những lý do bạn tự kiểm được — và bài 🧪 cuối bài nhờ bạn tự đếm tin tuyển dụng thật.</p>
<ul>
<li><strong>Lượng code có sẵn khổng lồ.</strong> Chính trang chính sách phiên bản của React ghi riêng mã nguồn Facebook đã có hơn 50.000 component React, và đó là lý do đội React rất chăm lo đường nâng cấp. Công ty có nhiều năm code React thì cứ phải tuyển người bảo trì và mở rộng nó.</li>
<li><strong>Một mô hình, ba nền tảng.</strong> Cùng lối nghĩ component-và-state chạy trên web (<code>react-dom</code>), trên di động (React Native) và trên server (Next.js). Một đội có thể dùng chung người và cách làm cho cả ba.</li>
<li><strong>Hệ sinh thái.</strong> Gần như vấn đề nào — form, bảng, biểu đồ, lấy dữ liệu, hiệu ứng — cũng có thư viện chín muồi và rất nhiều kỹ sư đã biết dùng. Khoá này dùng vài cái trong số đó.</li>
<li><strong>Lõi ổn định, đổi chậm.</strong> Thứ bạn học ở đây (function component, hook) là kiểu được khuyên dùng từ 2019 và vẫn thế ở React 19.3. Học xong không mất giá.</li>
<li><strong>Quản trị trung lập.</strong> Từ 02/2026 React thuộc React Foundation, bớt hẳn nỗi lo "lỡ Meta bỏ thì sao" mà vài công ty từng nêu.</li>
</ul>

<h3>React so với Vue, Angular và Svelte</h3>
${slide('rx-00', 5, 'React, Vue, Angular, Svelte — bốn triết lý')}
<p>Bảng trên slide so bốn lựa chọn phổ biến nhất, kèm phiên bản mỗi gói có trên npm tháng 9/2026 (kiểm bằng <code>npm view</code>). Vài điểm cần hơn một ô bảng:</p>
<ul>
<li><strong>React</strong> viết giao diện bằng JSX — chính là JavaScript với cú pháp thẻ. Ít "ma thuật": danh sách là <code>array.map</code>, điều kiện là <code>? :</code> bình thường. Cái giá: bạn phải vững JavaScript, và phải tự chọn router, thư viện form…</li>
<li><strong>Vue</strong> dùng template giống HTML với chỉ thị (<code>v-if</code>, <code>v-for</code>) trong file <code>.vue</code>, có đồ đi kèm chính hãng (Vue Router, Pinia). Nhiều người thấy tuần đầu dễ hơn.</li>
<li><strong>Angular</strong> là framework trọn gói: routing, form, HTTP, dependency injection đều trong một hộp, viết bằng class TypeScript có decorator. Doanh nghiệp lớn thích kiểu "mọi thứ đã được quyết sẵn"; đổi lại phải học nhiều khái niệm ngay từ đầu.</li>
<li><strong>Svelte</strong> là trình biên dịch: file <code>.svelte</code> được biến thành code DOM trực tiếp, gọn, lúc build. Rất ít code rườm rà; thị trường việc làm nhỏ hơn React ở phần lớn nơi.</li>
</ul>
<p>Không cái nào "tốt nhất". Câu trả lời phỏng vấn trung thực là nói về đánh đổi: React vì hệ sinh thái, React Native và nguồn người; Angular khi một đội lớn muốn một cách làm duy nhất; Vue khi muốn bắt đầu nhẹ nhàng; Svelte khi muốn ít code nhất. Vững React rồi thì học ba cái kia mất vài tuần chứ không phải vài tháng, vì component, props, state và luồng dữ liệu một chiều có mặt ở cả bốn.</p>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "React là gì, khác gì một framework như Angular?"</p>
<p>Ý trả lời trong 4 dòng: React là thư viện JavaScript để dựng giao diện từ component. Tôi mô tả giao diện phải như thế nào với state hiện tại; khi state đổi, React render lại và cập nhật DOM. Nó chỉ lo phần giao diện, nên dự án tự chọn router, thư viện lấy dữ liệu, thư viện form — Angular thì có sẵn tất cả. Cùng mô hình component còn chạy được trên di động với React Native.</p></div>

<h3>Từ FER202 tới cách công ty làm</h3>
${slide('rx-00', 6, 'Bản đồ FER202 → công ty')}
<p>Nếu bạn đang học FER202, bạn đã có nền: component, props, state, sự kiện, danh sách, có thể cả Redux. Thứ khác ở công ty năm 2026 chủ yếu là <em>bộ công cụ quanh</em> cái nền đó. Slide ghép từng mảnh, và ghi chương nào của khoá dạy bản hiện đại.</p>
<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Create React App, PropTypes, class component với <code>componentDidMount</code>, Redux + thunk, React-Bootstrap → Vite + TypeScript, function component với hook, TanStack Query cho dữ liệu từ server, Zustand cho state phía client, Tailwind hoặc CSS Modules · <em>Vì sao:</em> công cụ trong giáo trình không sai — chúng dạy cùng những ý tưởng và hợp cho bài lab — nhưng CRA đã bị khai tử 02/2025, TypeScript bắt lỗi trước khi code chạy thay vì chỉ cảnh báo trong console như PropTypes, và hook là kiểu duy nhất tài liệu React mới còn dạy. Bạn vẫn sẽ gặp kiểu FER202 trong dự án cũ ở công ty; biết cả hai, và biết vì sao người ta chuyển, đúng là điều người phỏng vấn muốn nghe.</p></div>

<h3>Khoá này đưa bạn tới đâu</h3>
${slide('rx-00', 7, 'Lộ trình khoá: Mục 0 → Chương 14')}
<p>Khoá chạy từ mục này tới Chương 14 và dựng một dự án suốt cả chặng: <strong>"Đặt lịch phòng khám An Tâm"</strong>. Hết Mục 0 bạn có dự án Vite + TypeScript với trang chủ tĩnh và một test xanh. Chương 1–5 thêm component, state, form, chia sẻ state; 6–9 thêm API (giả lập), định tuyến, hiệu năng và bộ test đầy đủ; Chương 10 là dự án giữa khoá, nơi bạn tự làm xong app; 11–14 đi sâu (React bên trong, tính năng React 19, kiến trúc, lên production).</p>
<p>Mỗi chương kết thúc bằng <strong>🛠 Tự gõ tiếp dự án</strong>: các bước, tiêu chí "đạt khi" kiểm được (test xanh hoặc ảnh giống) và lời giải chỉ mở sau khi đã thử. Các khoá khác trên trang nối vào đây: <a href="/courses/typescript">TypeScript</a> cho hệ kiểu, <a href="/courses/testing">Testing</a> để học test sâu, <a href="/courses/nextjs">Next.js</a> sau Chương 7, <a href="/courses/github-actions">GitHub Actions</a> cho CI ở Chương 14.</p>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao đội React khai tử Create React App?"</p>
<p>Ý trả lời: CRA không còn người bảo trì tích cực, và là một bộ build thuần nên nó không giải được những vấn đề app thật gặp — định tuyến, lấy dữ liệu, chia nhỏ code — nếu không phình thành framework. Tháng 2/2025 đội React khuyên dùng framework, hoặc công cụ build như Vite, Parcel, Rsbuild cho dự án không cần framework. Thực tế, SPA mới bắt đầu bằng <code>npm create vite@latest</code>.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trước khi viết dòng React nào, tự kiểm hai khẳng định của bài mà bạn kiểm được.</p><ol>
<li>Mở react.dev/blog, tìm bài "Sunsetting Create React App" và "React Compiler v1.0". Ghi ngày của hai bài, so với bảng ở trên.</li>
<li>Mở một trang tuyển dụng IT Việt Nam bất kỳ, lọc "Frontend" hoặc "Fresher Frontend", đọc 20 tin đầu. Đếm có bao nhiêu tin nhắc React, Vue, Angular, Svelte (một tin có thể nhắc nhiều cái).</li>
<li>Viết câu trả lời "React là gì?" bằng lời của bạn, tối đa bốn câu, không dùng chữ "virtual DOM" và "nhanh".</li>
</ol><p><strong>Đạt khi:</strong> hai ngày bạn ghi là 14/02/2025 và 07/10/2025; bạn có bốn con số từ chính lần đếm của mình (giữ lại — Bài 2/2 dùng chúng để chọn lộ trình); và câu trả lời bốn câu có nhắc component, state, và "React cập nhật DOM khi state đổi".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">component</span><span class="v">hàm biến dữ liệu thành bản mô tả giao diện; tên viết hoa chữ đầu</span></div>
<div class="kv"><span class="k">state (trạng thái)</span><span class="v">dữ liệu có thể đổi khi trang đang mở, màn hình phụ thuộc vào nó</span></div>
<div class="kv"><span class="k">render (vẽ ra)</span><span class="v">React gọi component để lấy bản mô tả; render lại = gọi lần nữa</span></div>
<div class="kv"><span class="k">declarative (khai báo)</span><span class="v">mô tả màn hình phải là gì; React tự tính các bước</span></div>
<div class="kv"><span class="k">imperative (mệnh lệnh)</span><span class="v">tự viết từng bước sửa trang (DOM thuần, jQuery)</span></div>
<div class="kv"><span class="k">Hook</span><span class="v">hàm như <code>useState</code> cho function component có state và effect (từ React 16.8, 2019)</span></div>
<div class="kv"><span class="k">Create React App (CRA)</span><span class="v">bộ tạo dự án chính thức từ 2016, bị khai tử cho dự án mới ngày 14/02/2025</span></div>
<div class="kv"><span class="k">React Foundation</span><span class="v">chủ sở hữu độc lập của React, React Native và JSX từ 24/02/2026, thuộc Linux Foundation</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>React là thư viện dựng giao diện từ component; giao diện là hàm của state — đổi dữ liệu, React cập nhật màn hình.</li>
<li>Code khai báo mô tả màn hình cho mọi dữ liệu, nên tính năng mới không thể "quên" cập nhật một con số.</li>
<li>Mở mã 29/05/2013; Fiber ở React 16 (2017); Hook ở 16.8 (2019); React 19 tháng 12/2024; CRA bị khai tử 02/2025; React 19.3 tháng 09/2026 — mốc nào cũng có nguồn.</li>
<li>Công ty tuyển React vì code có sẵn, một mô hình cho web/di động/server, hệ sinh thái lớn và lõi ổn định nay thuộc một quỹ.</li>
<li>Vue, Angular, Svelte đánh đổi khác nhau; khái niệm thì mang sang được.</li>
<li>FER202 dạy đúng ý tưởng với công cụ cũ hơn; khoá này dạy bộ công cụ 2026 và nói rõ thói quen FER202 nào còn gặp ở đâu.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Quick Start</span><span class="lc-sub">react.dev/learn — component, JSX, state và props trong một trang; điểm xuất phát chính thức mà mục này đi theo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Sunsetting Create React App (14/02/2025)</span><span class="lc-sub">react.dev/blog/2025/02/14/sunsetting-create-react-app — vì sao CRA bị khai tử và dùng gì thay.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — The React Foundation (24/02/2026)</span><span class="lc-sub">react.dev/blog/2026/02/24/the-react-foundation — ai quản lý React bây giờ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — CHANGELOG.md</span><span class="lc-sub">github.com/facebook/react/blob/main/CHANGELOG.md — ngày phát hành từ 0.3.0 (29/05/2013) tới 19.3.0 (09/09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Blog React cũ — Our First 50,000 Stars</span><span class="lc-sub">legacy.reactjs.org/blog/2016/09/28/our-first-50000-stars.html — FaxJS, FBolt và JSX được thiết kế thế nào, do chính đội React kể.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — HTML, CSS và JavaScript trước</span><span class="lc-sub">/courses/web-foundations/learn${REF} — nếu DOM và hàm JavaScript còn lạ, dành một tuần ở đó trước.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── Bắt đầu 2/2 ─────────────────────────── */
    {
      title: 'Start here (2/2) — Frontend without structure, and learning React without burnout|||Bắt đầu tại đây (2/2) — Frontend không cấu trúc, và học React không kiệt sức',
      slug: 'rx-0-9-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Thí nghiệm chạy thật: jQuery sửa DOM bằng tay làm màn hình lệch dữ liệu sau một lần Huỷ, cùng kịch bản bằng React thì khớp; tình huống đồ án, lộ trình học tối thiểu/đầy đủ và dự án xuyên suốt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Frontend without structure, and learning React without burnout</h2>
<p class="lead">Lesson 1/2 claimed that describing the screen from the data prevents a whole class of bugs. This lesson proves it with a real experiment you can run: a small booking page written the "edit the DOM by hand" way goes out of sync after one Cancel click, and the same page in React does not. Then we turn to you: how to study this course without burning out, and the project you will build from now to Chapter 14.</p>

<h3>The experiment: a booking page written with jQuery</h3>
${slide('rx-00', 8, 'jQuery: màn hình lệch dữ liệu sau một lần Huỷ (log thật)')}
<p>jQuery is the library that ran most interactive websites before React. It is still in many older company systems, and it is a fair stand-in for "any code that edits the page directly". The page has three time slots (08:00, 08:30, 09:00), a line "3 slots left", a line "My bookings (0)", and an empty "my bookings" list. The data also lives in an array, <code>khungGio</code>, because somebody knew it should.</p>
<p>Week 1: student A writes the <strong>Book</strong> button. To keep the page correct they must remember <em>four</em> places on the page plus the array:</p>
<pre><code class="language-js">$('#khung-gio').on('click', '.dat', function () {
  const li = $(this).closest('li');
  $(this).prop('disabled', true).text('Đã đặt');                       // place 1
  $('#con-trong').text(Number($('#con-trong').text()) - 1);          // place 2
  $('#dem-cua-toi').text(Number($('#dem-cua-toi').text()) + 1);      // place 3
  $('#cua-toi').append(&#96;&lt;li data-id="&#36;{li.data('id')}"&gt;… &lt;button class="huy"&gt;Huỷ&lt;/button&gt;&lt;/li&gt;&#96;); // place 4
  khungGio.find((k) =&gt; k.id === li.data('id')).conTrong = false;     // and the array
});</code></pre>
<p>Week 3: student B adds <strong>Cancel</strong>. They look at the page, see a button to re-enable, a counter "My bookings" to decrease and a list item to remove — and write exactly that:</p>
<pre><code class="language-js">$('#cua-toi').on('click', '.huy', function () {
  const id = $(this).closest('li').data('id');
  $(&#96;#khung-gio li[data-id="&#36;{id}"] .dat&#96;).prop('disabled', false).text('Đặt');
  $('#dem-cua-toi').text(Number($('#dem-cua-toi').text()) - 1);
  $(this).closest('li').remove();
  // forgot: "#con-trong" and the khungGio array
});</code></pre>
<p>We ran this page for real, with jQuery 3.7.1 inside jsdom 30.1.1 (a browser DOM implemented in Node), clicking Book 08:00, Book 08:30, then Cancel 08:00. After each step the script prints what the page says, how many Book buttons are really clickable, and what the array says:</p>
<pre><code class="language-bash">$ node dat-lich-jquery.cjs</code></pre>
<div class="out">Mở trang
  màn hình: "Còn 3 khung trống" · "Lịch của tôi (0)"
  nút "Đặt" còn bấm được: 3 · mảng dữ liệu conTrong: 3
Đặt 08:00 và 08:30
  màn hình: "Còn 1 khung trống" · "Lịch của tôi (2)"
  nút "Đặt" còn bấm được: 1 · mảng dữ liệu conTrong: 1
Huỷ 08:00
  màn hình: "Còn 1 khung trống" · "Lịch của tôi (1)"
  nút "Đặt" còn bấm được: 2 · mảng dữ liệu conTrong: 1</div>
<p>After one Cancel, the page says 1 slot is left, 2 buttons can actually be clicked, and the array says 1. Three "truths", and no error anywhere: no red text in the console, no failed test (there were none). A patient would see "1 slot left" and give up on a slot that is free. The backend, if the array were sent to it, would believe 08:00 is still taken.</p>
<p>The bug is not jQuery&#39;s fault, and it is not student B&#39;s either. The structure made it likely: the data and the screen were kept <strong>separately</strong>, and every event handler had to remember every place that depends on what it changed. With 3 places that is annoying; in a real FER202 project with a header badge, a sidebar, a dashboard and a history list, it is a matter of weeks before one handler forgets one place.</p>

<h3>The same scenario in React: one source of truth</h3>
${slide('rx-00', 9, 'React: mọi con số tính từ một mảng — test xanh')}
<p>Here is the React version. It is real code from this course&#39;s project folder, type-checked with <code>tsc</code> and tested with Vitest (you will understand every line by the end of Chapter 2; for now read it like a story):</p>
<pre><code class="language-tsx">import { useState } from 'react'

type Khung = { id: string; gio: string; conTrong: boolean }

const BAN_DAU: Khung[] = [
  { id: 'k1', gio: '08:00', conTrong: true },
  { id: 'k2', gio: '08:30', conTrong: true },
  { id: 'k3', gio: '09:00', conTrong: true },
]

export function DatLich() {
  // ONE source of truth: the khungGio array. Every number on screen is COMPUTED from it.
  const [khungGio, setKhungGio] = useState(BAN_DAU)
  const conTrong = khungGio.filter((k) =&gt; k.conTrong)
  const cuaToi = khungGio.filter((k) =&gt; !k.conTrong)

  const doi = (id: string, giaTri: boolean) =&gt;
    setKhungGio(khungGio.map((k) =&gt; (k.id === id ? { ...k, conTrong: giaTri } : k)))

  return (
    &lt;&gt;
      &lt;p&gt;Còn {conTrong.length} khung trống&lt;/p&gt;
      &lt;p&gt;Lịch của tôi ({cuaToi.length})&lt;/p&gt;
      &lt;ul&gt;
        {khungGio.map((k) =&gt; (
          &lt;li key={k.id}&gt;
            {k.gio}{' '}
            &lt;button disabled={!k.conTrong} onClick={() =&gt; doi(k.id, false)}&gt;
              {k.conTrong ? &#96;Đặt &#36;{k.gio}&#96; : &#96;Đã đặt &#36;{k.gio}&#96;}
            &lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
      &lt;ul aria-label="Lịch của tôi"&gt;
        {cuaToi.map((k) =&gt; (
          &lt;li key={k.id}&gt;
            {k.gio} &lt;button onClick={() =&gt; doi(k.id, true)}&gt;Huỷ {k.gio}&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/&gt;
  )
}</code></pre>
<p>Book and Cancel are now the same one-line change to the array: set <code>conTrong</code> to <code>false</code> or <code>true</code> for one slot. Nothing else is touched by hand. "2 slots left", "My bookings (1)", which buttons are disabled, which items are in the "my bookings" list — all are recomputed from the array on every render. There is no place to forget.</p>
<p>A test clicks through the same scenario as the jQuery script, the way a user would (by button name), and checks the numbers:</p>
<pre><code class="language-tsx">test('đặt hai khung rồi huỷ một: mọi con số vẫn khớp nhau', async () =&gt; {
  const user = userEvent.setup()
  render(&lt;DatLich /&gt;)
  await user.click(screen.getByRole('button', { name: 'Đặt 08:00' }))
  await user.click(screen.getByRole('button', { name: 'Đặt 08:30' }))
  expect(screen.getByText('Còn 1 khung trống')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Huỷ 08:00' }))
  expect(screen.getByText('Còn 2 khung trống')).toBeInTheDocument()
  expect(screen.getByText('Lịch của tôi (1)')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Đặt 08:00' })).toBeEnabled()
})</code></pre>
<pre><code class="language-bash">$ npx vitest run src/minh-hoa --reporter=verbose</code></pre>
<div class="out"> ✓ src/minh-hoa/DatLich.test.tsx &gt; đặt hai khung rồi huỷ một: mọi con số vẫn khớp nhau 239ms

 Test Files  1 passed (1)
      Tests  1 passed (1)</div>
<div class="callout"><p><strong>JS quick reminder: <code>{ ...k, conTrong: giaTri }</code>.</strong> The three dots are the <em>spread</em> syntax: "copy every field of <code>k</code> into a new object, then overwrite <code>conTrong</code>". The old object is not modified; you get a new one. React relies on this (Chapter 2 explains why). Lesson 0.3 runs it and shows the one trap: spread copies only one level deep.</p></div>
<p>To be fair to jQuery: you <em>can</em> write disciplined jQuery with one render function that redraws everything from the array. People did — and that is exactly the idea React turned into a library, with the performance work (only patching what changed) done for you.</p>

<div class="pitfall co-tieu-de"><strong>Trap — storing the same fact twice, even in React.</strong> React does not stop you from recreating the jQuery bug. If you keep <code>khungGio</code> in state <em>and</em> a separate <code>soConTrong</code> number in state, and update both in the Book handler, the Cancel handler written next month can forget the second one — same bug, new library. Rule for the whole course: if a value can be computed from state, compute it during render (<code>khungGio.filter(...).length</code>); do not store it. Chapter 2 calls this "derived state" and Chapter 4 shows the effect-based version of the same mistake.</div>

<h3>A FER202 project scenario (illustration)</h3>
<p>The following is an <em>illustration</em> built from common patterns, not a real team&#39;s story. A four-person FER202 group builds a "course registration" app for the final project. Each person takes a page. The list of registered courses is copied into three components — the header badge, the "My courses" page and the checkout page — each with its own <code>useState</code>, synchronised by passing callbacks around and by reading <code>localStorage</code> in <code>componentDidMount</code>. The demo goes fine. Two days before the deadline someone adds "remove a course"; it updates the page they own and <code>localStorage</code>, but the header badge still says 3 until you reload. Sound familiar? It is the jQuery bug again, reproduced with React, because the structure was the same: one fact, several copies.</p>
<p>The fix is not a new library, it is a decision: <strong>one owner</strong> for each piece of data, everyone else reads from it. Chapter 2 teaches lifting state up, Chapter 5 teaches Context and Zustand for data that many pages share, Chapter 6 teaches TanStack Query for data that really lives on the server. Each is a way to keep one source of truth as the app grows.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>Copy data into each page&#39;s state, keep them in sync with callbacks and <code>localStorage</code>, test by clicking around before the demo → one owner per piece of data (lifted state, a Zustand store, or the TanStack Query cache for server data), everything else computed, and a Vitest + Testing Library test for each flow that matters · <em>Why:</em> the FER202 way works for a two-week project with one demo. A product lives for years and is changed by people who did not write it; the only thing that protects it is a structure where forgetting a place is impossible, plus tests that fail when someone breaks a flow.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "Why would you use React instead of jQuery or plain DOM manipulation?"</p>
<p>Answer: with direct DOM manipulation, the data and the screen are kept separately, so every event handler must update every place that shows that data; as the app grows, handlers forget places and the UI drifts out of sync. React makes the UI a function of the state: I update the state, React re-renders and patches the DOM, so there is one source of truth. It also gives components for reuse and a testing story. For a tiny widget on a static page, plain DOM is still fine.</p></div>

<h3>Learning React without burning out</h3>
${slide('rx-00', 10, 'Lộ trình tối thiểu và đầy đủ, mỗi buổi 60–90 phút')}
<p>This course is long on purpose: every lesson has real output, a practice exercise and a project step. Nobody should read it cover to cover in a week. Two paths:</p>
<table>
<thead><tr><th>Path</th><th>Chapters</th><th>Good for</th><th>Rough time</th></tr></thead>
<tbody>
<tr><td><strong>Minimum</strong></td><td>Section 0 → 1 → 2 → 3 → 6 → 7 → 9 → 10</td><td>applying for an internship: you can build and test a small app with forms, API data and routing</td><td>6–8 weeks at 1 hour a day</td></tr>
<tr><td><strong>Full</strong></td><td>add 4, 5, 8, then 11–14</td><td>junior to middle: effects without bugs, shared state, performance, React 19, architecture, production</td><td>another 6–8 weeks</td></tr>
</tbody>
</table>
<p>The times are a suggestion from the size of each chapter, not a measurement; use your own pace. If your count of job ads in Lesson 1/2 showed Angular or Vue dominating where you want to work, finish the minimum path anyway — the concepts transfer — and then look at that framework.</p>
<p>Habits that keep you going:</p>
<ul>
<li><strong>One lesson per session, 60–90 minutes</strong>: read, run the examples yourself, do 🧪, do the 🛠 step. Stop there.</li>
<li><strong>Type the code, do not paste it.</strong> Mistyping and reading the real error message is half of the lesson. Every error in this course is real, so you will recognise yours.</li>
<li><strong>The 20-minute rule.</strong> Stuck for 20 minutes? Open the solution, read it, close it, and type your version from scratch.</li>
<li><strong>One new thing at a time.</strong> Do not learn Redux and Zustand in the same week; do not start Next.js before Chapter 7.</li>
<li><strong>End every chapter green</strong>: <code>npx tsc -b</code> prints nothing, <code>npx vitest run</code> passes, you commit. A green checkpoint is where you restart after a break.</li>
</ul>

<h3>The project you will build: "Đặt lịch phòng khám An Tâm"</h3>
${slide('rx-00', 11, 'Dự án xuyên suốt — ảnh chụp thật sau Mục 0')}
<p>From Lesson 0.1 to Chapter 14 you build one app: booking appointments at a fictional clinic. The data is fixed for the whole course so that every chapter fits together: four specialties, six doctors, time slots, patients and appointments. Their TypeScript types (Lesson 0.3 explains the syntax) are:</p>
<pre><code class="language-ts">// src/types.ts
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';
export interface BacSi { id: string; ten: string; chuyenKhoa: ChuyenKhoa; namKinhNghiem: number; gioiThieu: string }
export interface KhungGio { id: string; bacSiId: string; batDau: string /* ISO */; conTrong: boolean }
export interface BenhNhan { hoTen: string; soDienThoai: string; ngaySinh: string /* YYYY-MM-DD */ }
export type TrangThaiLichHen = 'cho-xac-nhan' | 'da-xac-nhan' | 'da-huy';
export interface LichHen { id: string; bacSiId: string; khungGioId: string; benhNhan: BenhNhan; lyDo: string; trangThai: TrangThaiLichHen }</code></pre>
<p>The screenshot on the slide is the real state of the project at the end of Section 0: a static home page with the clinic name, "6 bác sĩ · 4 chuyên khoa" computed from the data, opening hours and specialty chips, and a test that checks the heading. By Chapter 10 it has a doctor list with filters, a four-step booking flow with a validated form, a mocked API, routes and end-to-end tests — all typed by you.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> reproduce the jQuery bug on your own machine, then fix it — and count how many edits the fix needs.</p><ol>
<li>In an empty folder: <code>npm init -y</code>, then <code>npm install jquery@3 jsdom</code>.</li>
<li>Create <code>dat-lich-jquery.cjs</code> with the page HTML, the <code>khungGio</code> array and the two handlers from this lesson, plus the three <code>trigger('click')</code> steps and the print function (the full 52-line script is the two code blocks above wrapped in <code>new JSDOM(...)</code>; ask yourself what each line does as you type it).</li>
<li>Run <code>node dat-lich-jquery.cjs</code> and compare with the output above.</li>
<li>Fix the Cancel handler so the last block is correct.</li>
</ol><p><strong>Done when:</strong> the last block of your output reads <code>màn hình: "Còn 2 khung trống" · "Lịch của tôi (1)"</code> and <code>nút "Đặt" còn bấm được: 2 · mảng dữ liệu conTrong: 2</code> — which takes <strong>two</strong> added lines (the counter and the array), the point of the exercise.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">single source of truth</span><span class="v">each fact is stored in exactly one place; everything else reads or computes from it</span></div>
<div class="kv"><span class="k">derived value</span><span class="v">a value computed from state during render (e.g. a count), never stored separately</span></div>
<div class="kv"><span class="k">out of sync (lệch)</span><span class="v">the screen shows something different from the data — the classic bug of hand-edited DOM</span></div>
<div class="kv"><span class="k">jQuery</span><span class="v">a pre-React library for editing the DOM and handling events; still in many older systems</span></div>
<div class="kv"><span class="k">jsdom</span><span class="v">an implementation of the browser DOM in Node; Vitest uses it to run component tests</span></div>
<div class="kv"><span class="k">Testing Library</span><span class="v">tests components the way a user uses them: find by role and name, click, check text</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Hand-edited DOM keeps data and screen separately; every handler must update every place, and one forgotten place makes the page lie without any error.</li>
<li>Measured: after Book, Book, Cancel, the jQuery page showed 1 slot left while 2 buttons were clickable.</li>
<li>In React the same flow changes one field in one array; every number is computed from it, and a test proves it.</li>
<li>React does not prevent storing a fact twice — compute derived values in render, do not store them.</li>
<li>Study one lesson per 60–90 minute session, type the code, use the 20-minute rule, end each chapter green.</li>
<li>The project "Đặt lịch phòng khám An Tâm" runs from Lesson 0.1 to Chapter 14 with fixed types and data.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Thinking in React</span><span class="lc-sub">react.dev/learn/thinking-in-react — "find the minimal but complete representation of UI state"; the official version of the single-source-of-truth rule.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Choosing the State Structure</span><span class="lc-sub">react.dev/learn/choosing-the-state-structure — "avoid redundant state" and "avoid duplication in state", with examples.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Legacy React blog — Why did we build React? (2013)</span><span class="lc-sub">legacy.reactjs.org/blog/2013/06/05/why-react.html — the React team&#39;s own argument for re-rendering instead of mutating the DOM.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Testing — why tests catch what demos miss</span><span class="lc-sub">/courses/testing/learn${REF} — the course on this site that goes deeper into Testing Library and Vitest.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Frontend không cấu trúc, và học React không kiệt sức</h2>
<p class="lead">Bài 1/2 khẳng định: mô tả màn hình từ dữ liệu thì tránh được cả một loại bug. Bài này chứng minh bằng một thí nghiệm bạn tự chạy được: một trang đặt lịch nhỏ viết kiểu "tự sửa DOM bằng tay" lệch dữ liệu chỉ sau một lần bấm Huỷ, còn cùng trang đó bằng React thì không. Sau đó ta quay sang bạn: học khoá này sao cho không kiệt sức, và dự án bạn sẽ dựng từ giờ tới Chương 14.</p>

<h3>Thí nghiệm: trang đặt lịch viết bằng jQuery</h3>
${slide('rx-00', 8, 'jQuery: màn hình lệch dữ liệu sau một lần Huỷ (log thật)')}
<p>jQuery là thư viện chạy phần lớn các trang web có tương tác trước thời React. Nó vẫn còn trong nhiều hệ thống cũ ở công ty, và là đại diện công bằng cho "mọi kiểu code sửa trang trực tiếp". Trang có ba khung giờ (08:00, 08:30, 09:00), một dòng "Còn 3 khung trống", một dòng "Lịch của tôi (0)" và danh sách "lịch của tôi" đang rỗng. Dữ liệu cũng nằm trong một mảng <code>khungGio</code>, vì ai đó biết là nên có.</p>
<p>Tuần 1: bạn A viết nút <strong>Đặt</strong>. Để trang đúng, bạn ấy phải nhớ <em>bốn</em> chỗ trên trang cộng thêm cái mảng:</p>
<pre><code class="language-js">$('#khung-gio').on('click', '.dat', function () {
  const li = $(this).closest('li');
  $(this).prop('disabled', true).text('Đã đặt');                       // chỗ 1
  $('#con-trong').text(Number($('#con-trong').text()) - 1);          // chỗ 2
  $('#dem-cua-toi').text(Number($('#dem-cua-toi').text()) + 1);      // chỗ 3
  $('#cua-toi').append(&#96;&lt;li data-id="&#36;{li.data('id')}"&gt;… &lt;button class="huy"&gt;Huỷ&lt;/button&gt;&lt;/li&gt;&#96;); // chỗ 4
  khungGio.find((k) =&gt; k.id === li.data('id')).conTrong = false;     // và cái mảng
});</code></pre>
<p>Tuần 3: bạn B thêm nút <strong>Huỷ</strong>. Bạn ấy nhìn trang, thấy một nút cần bật lại, một ô "Lịch của tôi" cần trừ đi, một dòng cần xoá — và viết đúng như thế:</p>
<pre><code class="language-js">$('#cua-toi').on('click', '.huy', function () {
  const id = $(this).closest('li').data('id');
  $(&#96;#khung-gio li[data-id="&#36;{id}"] .dat&#96;).prop('disabled', false).text('Đặt');
  $('#dem-cua-toi').text(Number($('#dem-cua-toi').text()) - 1);
  $(this).closest('li').remove();
  // quên: "#con-trong" và mảng khungGio
});</code></pre>
<p>Chúng tôi chạy thật trang này, với jQuery 3.7.1 bên trong jsdom 30.1.1 (một DOM trình duyệt viết bằng Node), bấm Đặt 08:00, Đặt 08:30, rồi Huỷ 08:00. Sau mỗi bước, script in ra trang đang nói gì, thật sự còn mấy nút Đặt bấm được, và mảng nói gì:</p>
<pre><code class="language-bash">$ node dat-lich-jquery.cjs</code></pre>
<div class="out">Mở trang
  màn hình: "Còn 3 khung trống" · "Lịch của tôi (0)"
  nút "Đặt" còn bấm được: 3 · mảng dữ liệu conTrong: 3
Đặt 08:00 và 08:30
  màn hình: "Còn 1 khung trống" · "Lịch của tôi (2)"
  nút "Đặt" còn bấm được: 1 · mảng dữ liệu conTrong: 1
Huỷ 08:00
  màn hình: "Còn 1 khung trống" · "Lịch của tôi (1)"
  nút "Đặt" còn bấm được: 2 · mảng dữ liệu conTrong: 1</div>
<p>Sau một lần Huỷ, trang nói còn 1 khung, thực tế bấm được 2 nút, còn mảng nói 1. Ba "sự thật", và không có lỗi nào ở đâu cả: console không đỏ, không test nào hỏng (vì làm gì có test). Bệnh nhân thấy "Còn 1 khung trống" và bỏ qua một khung đang trống. Nếu mảng được gửi lên server, server tin 08:00 vẫn có người đặt.</p>
<p>Bug này không phải lỗi của jQuery, cũng không phải lỗi của bạn B. Chính cấu trúc làm nó dễ xảy ra: dữ liệu và màn hình được giữ <strong>riêng</strong>, và mỗi hàm xử lý sự kiện phải nhớ mọi chỗ phụ thuộc vào thứ nó vừa đổi. Với 3 chỗ thì phiền; trong một đồ án FER202 thật có huy hiệu ở header, thanh bên, trang tổng quan, danh sách lịch sử, thì chỉ vài tuần là sẽ có một hàm quên một chỗ.</p>

<h3>Cùng kịch bản bằng React: một nguồn sự thật</h3>
${slide('rx-00', 9, 'React: mọi con số tính từ một mảng — test xanh')}
<p>Đây là bản React. Nó là code thật trong thư mục dự án của khoá, đã kiểm kiểu bằng <code>tsc</code> và test bằng Vitest (hết Chương 2 bạn sẽ hiểu từng dòng; giờ cứ đọc như đọc truyện):</p>
<pre><code class="language-tsx">import { useState } from 'react'

type Khung = { id: string; gio: string; conTrong: boolean }

const BAN_DAU: Khung[] = [
  { id: 'k1', gio: '08:00', conTrong: true },
  { id: 'k2', gio: '08:30', conTrong: true },
  { id: 'k3', gio: '09:00', conTrong: true },
]

export function DatLich() {
  // MỘT nguồn sự thật: mảng khungGio. Mọi con số trên màn hình TÍNH từ nó.
  const [khungGio, setKhungGio] = useState(BAN_DAU)
  const conTrong = khungGio.filter((k) =&gt; k.conTrong)
  const cuaToi = khungGio.filter((k) =&gt; !k.conTrong)

  const doi = (id: string, giaTri: boolean) =&gt;
    setKhungGio(khungGio.map((k) =&gt; (k.id === id ? { ...k, conTrong: giaTri } : k)))

  return (
    &lt;&gt;
      &lt;p&gt;Còn {conTrong.length} khung trống&lt;/p&gt;
      &lt;p&gt;Lịch của tôi ({cuaToi.length})&lt;/p&gt;
      &lt;ul&gt;
        {khungGio.map((k) =&gt; (
          &lt;li key={k.id}&gt;
            {k.gio}{' '}
            &lt;button disabled={!k.conTrong} onClick={() =&gt; doi(k.id, false)}&gt;
              {k.conTrong ? &#96;Đặt &#36;{k.gio}&#96; : &#96;Đã đặt &#36;{k.gio}&#96;}
            &lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
      &lt;ul aria-label="Lịch của tôi"&gt;
        {cuaToi.map((k) =&gt; (
          &lt;li key={k.id}&gt;
            {k.gio} &lt;button onClick={() =&gt; doi(k.id, true)}&gt;Huỷ {k.gio}&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/&gt;
  )
}</code></pre>
<p>Đặt và Huỷ giờ là cùng một thay đổi một dòng trên mảng: đặt <code>conTrong</code> của một khung thành <code>false</code> hoặc <code>true</code>. Không chỗ nào khác bị sửa bằng tay. "Còn 2 khung trống", "Lịch của tôi (1)", nút nào bị khoá, dòng nào nằm trong "lịch của tôi" — tất cả được tính lại từ mảng mỗi lần render. Không còn chỗ nào để quên.</p>
<p>Một bài test bấm qua đúng kịch bản của script jQuery, theo cách người dùng bấm (tìm nút theo tên), rồi kiểm các con số:</p>
<pre><code class="language-tsx">test('đặt hai khung rồi huỷ một: mọi con số vẫn khớp nhau', async () =&gt; {
  const user = userEvent.setup()
  render(&lt;DatLich /&gt;)
  await user.click(screen.getByRole('button', { name: 'Đặt 08:00' }))
  await user.click(screen.getByRole('button', { name: 'Đặt 08:30' }))
  expect(screen.getByText('Còn 1 khung trống')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Huỷ 08:00' }))
  expect(screen.getByText('Còn 2 khung trống')).toBeInTheDocument()
  expect(screen.getByText('Lịch của tôi (1)')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Đặt 08:00' })).toBeEnabled()
})</code></pre>
<pre><code class="language-bash">$ npx vitest run src/minh-hoa --reporter=verbose</code></pre>
<div class="out"> ✓ src/minh-hoa/DatLich.test.tsx &gt; đặt hai khung rồi huỷ một: mọi con số vẫn khớp nhau 239ms

 Test Files  1 passed (1)
      Tests  1 passed (1)</div>
<div class="callout"><p><strong>JS nhắc nhanh: <code>{ ...k, conTrong: giaTri }</code>.</strong> Ba dấu chấm là cú pháp <em>spread</em>: "chép mọi trường của <code>k</code> sang một object mới, rồi ghi đè <code>conTrong</code>". Object cũ không bị sửa; bạn nhận một object mới. React dựa vào điều này (Chương 2 giải thích vì sao). Bài 0.3 chạy thử nó và chỉ ra cái bẫy duy nhất: spread chỉ chép một tầng.</p></div>
<p>Nói công bằng cho jQuery: bạn <em>có thể</em> viết jQuery kỷ luật, với một hàm vẽ lại toàn bộ từ mảng. Người ta từng làm thế — và đó đúng là ý tưởng mà React biến thành một thư viện, kèm phần việc hiệu năng (chỉ sửa chỗ khác đi) làm sẵn cho bạn.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — lưu cùng một sự thật hai lần, kể cả trong React.</strong> React không ngăn bạn tái tạo bug của jQuery. Nếu bạn giữ <code>khungGio</code> trong state <em>và</em> một số <code>soConTrong</code> riêng cũng trong state, rồi cập nhật cả hai trong hàm Đặt, thì hàm Huỷ viết tháng sau có thể quên cái thứ hai — cùng bug, thư viện mới. Luật cho cả khoá: giá trị nào tính được từ state thì tính trong lúc render (<code>khungGio.filter(...).length</code>); đừng lưu nó. Chương 2 gọi đây là "state dẫn xuất" và Chương 4 chỉ ra phiên bản dùng effect của cùng sai lầm này.</div>

<h3>Tình huống đồ án FER202 (minh hoạ)</h3>
<p>Đoạn sau là <em>minh hoạ</em> dựng từ những kiểu làm hay gặp, không phải chuyện của một nhóm có thật. Một nhóm FER202 bốn người làm app "đăng ký môn học" cho đồ án cuối kỳ. Mỗi người nhận một trang. Danh sách môn đã đăng ký được chép vào ba component — huy hiệu trên header, trang "Môn của tôi" và trang thanh toán — mỗi nơi một <code>useState</code> riêng, đồng bộ bằng cách truyền callback qua lại và đọc <code>localStorage</code> trong <code>componentDidMount</code>. Buổi demo suôn sẻ. Hai ngày trước hạn nộp, có người thêm "bỏ một môn"; nó cập nhật trang của người đó và <code>localStorage</code>, nhưng huy hiệu trên header vẫn ghi 3 cho tới khi tải lại trang. Nghe quen không? Đó lại là bug của jQuery, tái hiện bằng React, vì cấu trúc giống hệt: một sự thật, nhiều bản sao.</p>
<p>Cách sửa không phải một thư viện mới, mà là một quyết định: <strong>mỗi mẩu dữ liệu có một chủ</strong>, mọi nơi khác đọc từ đó. Chương 2 dạy nâng state lên (lifting state up), Chương 5 dạy Context và Zustand cho dữ liệu nhiều trang dùng chung, Chương 6 dạy TanStack Query cho dữ liệu thật sự sống ở server. Mỗi cái là một cách giữ một nguồn sự thật khi app lớn lên.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Chép dữ liệu vào state của từng trang, đồng bộ bằng callback và <code>localStorage</code>, test bằng cách bấm thử trước buổi demo → mỗi mẩu dữ liệu một chủ (state được nâng lên, một store Zustand, hoặc cache của TanStack Query cho dữ liệu server), mọi thứ khác tính ra, và mỗi luồng quan trọng có một test Vitest + Testing Library · <em>Vì sao:</em> cách FER202 chạy tốt cho dự án hai tuần với một buổi demo. Một sản phẩm sống nhiều năm và được sửa bởi người không viết ra nó; thứ duy nhất bảo vệ nó là một cấu trúc khiến việc "quên một chỗ" là không thể, cộng với test đỏ lên khi ai đó làm hỏng một luồng.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao dùng React thay vì jQuery hay thao tác DOM thuần?"</p>
<p>Ý trả lời: thao tác DOM trực tiếp thì dữ liệu và màn hình nằm riêng, nên mỗi hàm xử lý sự kiện phải cập nhật mọi chỗ hiển thị dữ liệu đó; app lớn dần, hàm nào đó quên một chỗ và giao diện lệch dữ liệu. React biến giao diện thành hàm của state: tôi cập nhật state, React render lại và vá DOM, nên chỉ có một nguồn sự thật. Nó còn cho component để dùng lại và cách test rõ ràng. Với một widget nhỏ trên trang tĩnh, DOM thuần vẫn ổn.</p></div>

<h3>Học React không kiệt sức</h3>
${slide('rx-00', 10, 'Lộ trình tối thiểu và đầy đủ, mỗi buổi 60–90 phút')}
<p>Khoá này dài có chủ đích: bài nào cũng có output thật, bài thực hành và một bước dự án. Không ai nên đọc hết trong một tuần. Có hai lộ trình:</p>
<table>
<thead><tr><th>Lộ trình</th><th>Chương</th><th>Hợp với</th><th>Thời gian ước chừng</th></tr></thead>
<tbody>
<tr><td><strong>Tối thiểu</strong></td><td>Mục 0 → 1 → 2 → 3 → 6 → 7 → 9 → 10</td><td>xin thực tập: bạn dựng và test được một app nhỏ có form, dữ liệu API và định tuyến</td><td>6–8 tuần, mỗi ngày 1 giờ</td></tr>
<tr><td><strong>Đầy đủ</strong></td><td>thêm 4, 5, 8, rồi 11–14</td><td>từ junior lên middle: effect không bug, state chia sẻ, hiệu năng, React 19, kiến trúc, production</td><td>thêm 6–8 tuần</td></tr>
</tbody>
</table>
<p>Thời gian là gợi ý dựa trên độ dài từng chương, không phải số đo; hãy theo nhịp của bạn. Nếu lần đếm tin tuyển dụng ở Bài 1/2 cho thấy Angular hay Vue áp đảo ở nơi bạn muốn làm, cứ xong lộ trình tối thiểu trước — khái niệm mang sang được — rồi mới xem framework đó.</p>
<p>Những thói quen giữ bạn đi tiếp:</p>
<ul>
<li><strong>Mỗi buổi một bài, 60–90 phút</strong>: đọc, tự chạy ví dụ, làm 🧪, làm bước 🛠. Dừng ở đó.</li>
<li><strong>Gõ lại code, đừng dán.</strong> Gõ sai rồi đọc thông báo lỗi thật là một nửa bài học. Mọi lỗi trong khoá đều là lỗi thật, nên bạn sẽ nhận ra lỗi của mình.</li>
<li><strong>Luật 20 phút.</strong> Bí 20 phút? Mở lời giải, đọc, đóng lại, rồi gõ bản của bạn từ đầu.</li>
<li><strong>Mỗi lần một thứ mới.</strong> Đừng học Redux và Zustand cùng một tuần; đừng học Next.js trước khi xong Chương 7.</li>
<li><strong>Kết thúc chương nào cũng xanh</strong>: <code>npx tsc -b</code> không in gì, <code>npx vitest run</code> qua, bạn commit. Một mốc xanh là chỗ bạn bắt đầu lại sau khi nghỉ.</li>
</ul>

<h3>Dự án bạn sẽ dựng: "Đặt lịch phòng khám An Tâm"</h3>
${slide('rx-00', 11, 'Dự án xuyên suốt — ảnh chụp thật sau Mục 0')}
<p>Từ Bài 0.1 tới Chương 14 bạn dựng một app: đặt lịch khám ở một phòng khám hư cấu. Dữ liệu cố định cho cả khoá để mọi chương khớp nhau: bốn chuyên khoa, sáu bác sĩ, khung giờ, bệnh nhân và lịch hẹn. Kiểu TypeScript của chúng (Bài 0.3 giải thích cú pháp):</p>
<pre><code class="language-ts">// src/types.ts
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';
export interface BacSi { id: string; ten: string; chuyenKhoa: ChuyenKhoa; namKinhNghiem: number; gioiThieu: string }
export interface KhungGio { id: string; bacSiId: string; batDau: string /* ISO */; conTrong: boolean }
export interface BenhNhan { hoTen: string; soDienThoai: string; ngaySinh: string /* YYYY-MM-DD */ }
export type TrangThaiLichHen = 'cho-xac-nhan' | 'da-xac-nhan' | 'da-huy';
export interface LichHen { id: string; bacSiId: string; khungGioId: string; benhNhan: BenhNhan; lyDo: string; trangThai: TrangThaiLichHen }</code></pre>
<p>Ảnh trên slide là trạng thái thật của dự án khi hết Mục 0: một trang chủ tĩnh có tên phòng khám, dòng "6 bác sĩ · 4 chuyên khoa" tính từ dữ liệu, giờ mở cửa, các chip chuyên khoa, và một test kiểm tiêu đề. Tới Chương 10 nó có danh sách bác sĩ kèm bộ lọc, luồng đặt lịch bốn bước với form có kiểm dữ liệu, API giả lập, định tuyến và test đầu-cuối — tất cả do bạn tự gõ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tái hiện bug jQuery trên máy bạn, rồi sửa nó — và đếm xem sửa cần bao nhiêu chỗ.</p><ol>
<li>Trong một thư mục trống: <code>npm init -y</code>, rồi <code>npm install jquery@3 jsdom</code>.</li>
<li>Tạo <code>dat-lich-jquery.cjs</code> gồm HTML của trang, mảng <code>khungGio</code> và hai hàm xử lý trong bài, thêm ba bước <code>trigger('click')</code> và hàm in (script đầy đủ 52 dòng chính là hai khối code ở trên bọc trong <code>new JSDOM(...)</code>; vừa gõ vừa tự hỏi mỗi dòng làm gì).</li>
<li>Chạy <code>node dat-lich-jquery.cjs</code> và so với output ở trên.</li>
<li>Sửa hàm Huỷ để khối cuối cùng đúng.</li>
</ol><p><strong>Đạt khi:</strong> khối cuối trong output của bạn là <code>màn hình: "Còn 2 khung trống" · "Lịch của tôi (1)"</code> và <code>nút "Đặt" còn bấm được: 2 · mảng dữ liệu conTrong: 2</code> — việc này cần thêm <strong>hai</strong> dòng (ô đếm và cái mảng), và đó chính là điểm của bài tập.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">single source of truth (một nguồn sự thật)</span><span class="v">mỗi sự thật lưu đúng một chỗ; mọi nơi khác đọc hoặc tính từ đó</span></div>
<div class="kv"><span class="k">giá trị dẫn xuất</span><span class="v">giá trị tính từ state trong lúc render (vd một con đếm), không lưu riêng</span></div>
<div class="kv"><span class="k">lệch dữ liệu (out of sync)</span><span class="v">màn hình hiện khác với dữ liệu — bug kinh điển của DOM sửa tay</span></div>
<div class="kv"><span class="k">jQuery</span><span class="v">thư viện thời trước React để sửa DOM và bắt sự kiện; còn trong nhiều hệ thống cũ</span></div>
<div class="kv"><span class="k">jsdom</span><span class="v">DOM trình duyệt viết bằng Node; Vitest dùng nó để chạy test component</span></div>
<div class="kv"><span class="k">Testing Library</span><span class="v">test component theo cách người dùng dùng: tìm theo vai trò và tên, bấm, kiểm chữ</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>DOM sửa tay giữ dữ liệu và màn hình riêng; mỗi hàm phải cập nhật mọi chỗ, quên một chỗ là trang "nói dối" mà không báo lỗi gì.</li>
<li>Đo thật: sau Đặt, Đặt, Huỷ, trang jQuery báo còn 1 khung trong khi bấm được 2 nút.</li>
<li>Trong React, cùng luồng đó chỉ đổi một trường trong một mảng; mọi con số tính từ nó, và có test chứng minh.</li>
<li>React không cấm lưu một sự thật hai lần — giá trị dẫn xuất thì tính trong render, đừng lưu.</li>
<li>Mỗi buổi một bài 60–90 phút, gõ lại code, luật 20 phút, hết chương phải xanh.</li>
<li>Dự án "Đặt lịch phòng khám An Tâm" chạy từ Bài 0.1 tới Chương 14 với kiểu và dữ liệu cố định.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Thinking in React</span><span class="lc-sub">react.dev/learn/thinking-in-react — "tìm biểu diễn tối thiểu nhưng đầy đủ của state giao diện"; bản chính thức của luật một nguồn sự thật.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Choosing the State Structure</span><span class="lc-sub">react.dev/learn/choosing-the-state-structure — "tránh state thừa" và "tránh trùng lặp trong state", kèm ví dụ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Blog React cũ — Why did we build React? (2013)</span><span class="lc-sub">legacy.reactjs.org/blog/2013/06/05/why-react.html — lập luận của chính đội React: vẽ lại thay vì sửa DOM.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Testing — vì sao test bắt được thứ buổi demo bỏ sót</span><span class="lc-sub">/courses/testing/learn${REF} — khoá trên trang đi sâu hơn vào Testing Library và Vitest.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.0 ─────────────────────────── */
    {
      title: '0.0 — Section 0 slides: why React, setup, JSX and JavaScript in pictures|||0.0 — Slide Mục 0: vì sao React, cài đặt, JSX và JavaScript bằng hình',
      slug: 'rx-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 30 slide của Mục 0: UI là hàm của state, 12 mốc lịch sử có nguồn, React so với Vue/Angular/Svelte, FER202 sang công ty, jQuery lệch dữ liệu đo thật, npm create vite, CRA so với Vite đo thật, JSX thành lời gọi hàm, và JavaScript cần cho React.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Slides</span>
<h2>The whole section in 30 slides</h2>
<p class="lead">Section 0 answers three questions before you write your first component: why React, how a real 2026 project is set up, and which pieces of JSX and JavaScript you need to read React code without getting lost. Skim the slides first to see the shape; come back after the quiz to revise.</p>
<p>Slides 3–7 belong to Start here (1/2) — what React is, its history with checked dates, the comparison with Vue, Angular and Svelte, and the FER202-to-company map. Slides 8–11 belong to Start here (2/2): the jQuery experiment where the page goes out of sync, the same flow in React, the learning paths and the project. Slides 12–17 are Lesson 0.1 (setup with Vite and TypeScript, measured against Create React App on the same machine), 18–22 are Lesson 0.2 (JSX), 23–27 are Lesson 0.3 (the JavaScript you need). The last three are common mistakes, a cheat sheet and the first project step. Every terminal output and screenshot is real: recorded on 25 September 2026 with create-vite 9.2.1, React 19.3.0, Vite 8.3.1, TypeScript 6.0.3 and Vitest 5.0.1 on Node 22.22.2.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Slide</span>
<h2>Cả mục trong 30 slide</h2>
<p class="lead">Mục 0 trả lời ba câu hỏi trước khi bạn viết component đầu tiên: vì sao React, một dự án thật năm 2026 được dựng thế nào, và những mảnh JSX với JavaScript nào cần có để đọc code React mà không bị lạc. Lướt bộ slide trước để nắm hình dạng; làm xong bài kiểm tra thì quay lại đây để ôn.</p>
<p>Slide 3–7 thuộc Bắt đầu tại đây (1/2) — React là gì, lịch sử với mốc đã kiểm, so sánh với Vue, Angular, Svelte, và bản đồ FER202 sang công ty. Slide 8–11 thuộc Bắt đầu tại đây (2/2): thí nghiệm jQuery làm trang lệch dữ liệu, cùng luồng đó bằng React, lộ trình học và dự án. Slide 12–17 là Bài 0.1 (cài đặt với Vite và TypeScript, đo so với Create React App trên cùng máy), 18–22 là Bài 0.2 (JSX), 23–27 là Bài 0.3 (JavaScript bạn cần). Ba slide cuối là sai lầm hay gặp, bảng tra nhanh và bước dự án đầu tiên. Mọi output terminal và ảnh chụp đều THẬT: ghi ngày 25/09/2026 với create-vite 9.2.1, React 19.3.0, Vite 8.3.1, TypeScript 6.0.3 và Vitest 5.0.1 trên Node 22.22.2.</p>
</div>
${gallery('rx-00', [
  [1, 'Bìa'], [2, 'Bản đồ Mục 0'],
  [3, 'UI là hàm của state'], [4, 'Mười hai mốc lịch sử có nguồn'], [5, 'React, Vue, Angular, Svelte'], [6, 'FER202 → công ty'], [7, 'Khoá đưa bạn tới đâu'],
  [8, 'jQuery: màn hình lệch dữ liệu'], [9, 'React: một nguồn sự thật'], [10, 'Học không kiệt sức'], [11, 'Dự án xuyên suốt'],
  [12, 'npm create vite'], [13, 'CRA so với Vite, đo thật'], [14, 'Cấu trúc dự án'], [15, 'index.html → main.tsx → App.tsx'], [16, 'Trang mặc định và HMR'], [17, 'vite build không kiểm kiểu'],
  [18, 'JSX thành lời gọi hàm'], [19, 'Phần tử JSX là object'], [20, 'Bốn luật JSX'], [21, 'Cái gì hiện ra trong { }'], [22, 'Lớp phủ lỗi của Vite'],
  [23, 'Destructuring và spread'], [24, 'map, filter, find, reduce'], [25, '?. và ??'], [26, 'import và export'], [27, 'async/await'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh'], [30, 'Tự gõ tiếp dự án'],
])}
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Setting up with Vite and TypeScript (measured against Create React App)|||0.1 — Cài đặt với Vite và TypeScript (đo so với Create React App)',
      slug: 'rx-0-1-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tạo dự án phong-kham bằng npm create vite (output thật), đo CRA và Vite trên cùng máy, đọc cấu trúc thư mục và chuỗi index.html → main.tsx → App.tsx, HMR, và vì sao vite build không kiểm kiểu mà tsc -b mới kiểm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Setting up with Vite and TypeScript (measured against Create React App)</h2>
<p class="lead">In this lesson you create the project you will keep until Chapter 14, with the exact command companies use in 2026: <code>npm create vite@latest</code>. Every output below was recorded on the machine used to write the course, and to settle the "why not Create React App?" question with numbers instead of opinions, we also ran CRA on the same machine the same day.</p>

<p>By the end you will know what every file in a fresh project does, what happens between typing <code>npm run dev</code> and seeing a page, why saving a file updates the page in about a tenth of a second, and — the one fact that saves beginners hours — why <code>vite build</code> can succeed with a type error in your code.</p>

<h3>Before you start: Node, npm and an editor</h3>
<p>React code is written in the browser&#39;s language (JavaScript, with TypeScript on top), but the <em>tools</em> — the dev server, the bundler, the test runner — run on <strong>Node.js</strong>, a JavaScript runtime for your computer. <strong>npm</strong> is the package manager that comes with Node: it downloads libraries into a <code>node_modules</code> folder and runs the scripts in <code>package.json</code>.</p>
<pre><code class="language-bash">$ node -v
$ npm -v</code></pre>
<div class="out">v22.22.2
10.9.7</div>
<p>Which Node do you need? The tools themselves say it, in the <code>engines</code> field of their <code>package.json</code> (checked in <code>node_modules</code>, September 2026): Vite 8.3.1 needs <code>^20.19.0 || &gt;=22.12.0</code>, and Vitest 5.0.1 needs <code>^22.12.0 || ^24.0.0 || &gt;=26.0.0</code>. So: <strong>Node 22.12 or newer, or Node 24</strong>. If <code>node -v</code> prints v18 or v20, install a current LTS from nodejs.org (or with a version manager such as nvm or fnm) before continuing. Any editor works; the course assumes VS Code, which understands TypeScript and JSX without plugins.</p>

<h3>Creating the project</h3>
${slide('rx-00', 12, 'npm create vite: hai câu hỏi, dưới một giây')}
<p>Open a terminal in the folder where you keep your projects and run the command from the slide. <code>npm create vite@latest</code> downloads the latest <code>create-vite</code> package and runs it; <code>phong-kham</code> is the folder name; everything after the lone <code>--</code> is passed to create-vite, here <code>--template react-ts</code> (React + TypeScript). The real interactive session asked two questions:</p>
<pre><code class="language-bash">$ npm create vite@latest phong-kham -- --template react-ts</code></pre>
<div class="out">&gt; npx
&gt; create-vite phong-kham --template react-ts

To create in one go, run: create-vite &lt;DIRECTORY&gt; --no-interactive --template &lt;TEMPLATE&gt;
*  Which linter to use?
|  &gt; Oxlint
|    ESLint
o  Which linter to use?
|  Oxlint
*  Install with npm and start now?
|    Yes / &gt; No
o  Scaffolding project in …/phong-kham...
—  Done. Now run:

  cd phong-kham
  npm install
  npm run dev</div>
<ul>
<li><strong>Which linter to use?</strong> A linter reads your code and warns about likely mistakes (an unused variable, a hook called inside an <code>if</code>). The default, <strong>Oxlint</strong>, is a fast linter written in Rust; ESLint is the older, more configurable one many companies still run. Pick Oxlint for this course.</li>
<li><strong>Install with npm and start now?</strong> Answer <strong>No</strong> the first time, so you see each step separately. "Yes" just runs the next two commands for you.</li>
</ul>
<p>The whole scaffold took 0.5 seconds (<code>time</code> printed <code>real 0m0.525s</code> for the non-interactive form). It only copies template files; nothing is downloaded yet. Then:</p>
<pre><code class="language-bash">$ cd phong-kham
$ npm install</code></pre>
<div class="out">added 27 packages, and audited 28 packages in 8s

9 packages are looking for funding
  run &#96;npm fund&#96; for details

found 0 vulnerabilities</div>
<pre><code class="language-bash">$ npm run dev</code></pre>
<div class="out">  VITE v8.3.1  ready in 400 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose</div>
<p>Open <code>http://localhost:5173/</code> and you see the Vite starter page. The server keeps running in that terminal; stop it with <kbd>Ctrl</kbd>+<kbd>C</kbd>. Two options you will use: <code>npm run dev -- --port 5174</code> if 5173 is taken, and <code>--host</code> to open the page from your phone on the same Wi-Fi. Check the versions you actually got:</p>
<pre><code class="language-bash">$ npm ls react react-dom vite typescript</code></pre>
<div class="out">phong-kham@0.0.0
+-- @vitejs/plugin-react@6.1.1
| &#96;-- vite@8.3.1 deduped
+-- react-dom@19.3.0
| &#96;-- react@19.3.0 deduped
+-- react@19.3.0
+-- typescript@6.0.3
&#96;-- vite@8.3.1</div>
<p>Note a small surprise: the template&#39;s <code>package.json</code> says <code>"react": "^19.2.8"</code>, yet npm installed 19.3.0. The caret <code>^</code> means "this version or any newer one with the same major number", so 19.3.0 qualifies. The exact versions you got are written to <code>package-lock.json</code>; commit that file so everyone on the team installs the same ones.</p>
<p>If you prefer no questions at all (for scripts or CI), the tool tells you how: <code>npm create vite@latest phong-kham -- --template react-ts --no-interactive</code>.</p>

<h3>Why not Create React App? Measured, same machine, same day</h3>
${slide('rx-00', 13, 'CRA so với Vite: đo cùng máy, cùng ngày')}
<p>FER202 material often still starts with <code>npx create-react-app</code>. It still works in 2026 — and it installs React 19.3.0 — so the fair question is what it costs. We ran both on the same machine on 25 September 2026:</p>
<pre><code class="language-bash">$ npx -y create-react-app@latest thu-cra</code></pre>
<div class="out">npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. …
npm warn deprecated glob@7.2.3: Old versions of glob are not supported, …
…
create-react-app is deprecated.

You can find a list of up-to-date React frameworks on react.dev
For more info see:https://react.dev/link/cra

This error message will only be shown once per install.

Creating a new React app in …/thu-cra.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts with cra-template...

added 1292 packages in 48s
…
28 vulnerabilities (9 low, 5 moderate, 14 high)</div>
<table>
<thead><tr><th>Measured 25/09/2026</th><th>create-react-app 5.1.0 (react-scripts 5.0.1)</th><th>create-vite 9.2.1, react-ts</th></tr></thead>
<tbody>
<tr><td>Packages installed, time</td><td>1292 packages, 48 s</td><td>27 packages, 8 s</td></tr>
<tr><td><code>node_modules</code> size (<code>du -sh</code>)</td><td>361 MB</td><td>90 MB</td></tr>
<tr><td><code>npm audit</code> after install</td><td>28 vulnerabilities (14 high)</td><td>0</td></tr>
<tr><td>Dev server ready</td><td>about 7.1 s to "Compiled successfully!" (webpack)</td><td>"ready in 267–400 ms"</td></tr>
<tr><td>Production build</td><td>8.8 s, main JS 70 kB gzip</td><td>0.17 s, JS 69.27 kB gzip</td></tr>
<tr><td>Warnings while starting the dev server</td><td>two webpack-dev-server <code>DeprecationWarning</code>s</td><td>none</td></tr>
</tbody>
</table>
<p>The bundle sizes are almost identical — React itself is most of it — but everything around the code is heavier and slower with CRA, and its dependency tree carries known vulnerabilities that nobody is going to fix, because the project has no active maintainers. That is why react.dev deprecated it on 14 February 2025 and why its own installer now opens with "create-react-app is deprecated".</p>
<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p><code>npx create-react-app my-app</code>, JavaScript files, <code>npm start</code> on port 3000, <code>npm run eject</code> when you need to change the webpack config → <code>npm create vite@latest my-app -- --template react-ts</code>, TypeScript from the first file, <code>npm run dev</code> on port 5173, a seven-line <code>vite.config.ts</code> you edit directly · <em>Why:</em> CRA is deprecated and unmaintained, 48 times more packages, with known vulnerabilities,, and a dev server that takes seconds instead of a fraction of a second. You will still meet CRA in older company projects: recognise it by <code>react-scripts</code> in <code>package.json</code>. Migrating such a project to Vite is a common first task for a new hire, and react.dev has a guide for it.</p></div>

<h3>What is in the project</h3>
${slide('rx-00', 14, 'Cấu trúc dự án: bạn chỉ sống trong src/')}
<p>The fresh project has 18 files (without <code>node_modules</code>). You will spend almost all your time in <code>src/</code>, but you should know what each file is for:</p>
<ul>
<li><code>index.html</code> — the only HTML page of the app. Its body is just <code>&lt;div id="root"&gt;&lt;/div&gt;</code> and a <code>&lt;script type="module" src="/src/main.tsx"&gt;</code>. In CRA it lived in <code>public/</code>; in Vite it is at the root because Vite treats it as the entry point.</li>
<li><code>package.json</code> — name, <code>"type": "module"</code> (files use <code>import</code>/<code>export</code>), dependencies, and four scripts: <code>dev</code> (<code>vite</code>), <code>build</code> (<code>tsc -b &amp;&amp; vite build</code>), <code>lint</code> (<code>oxlint</code>) and <code>preview</code> (<code>vite preview</code>, serves the built <code>dist/</code> folder like production).</li>
<li><code>vite.config.ts</code> — seven lines: import the React plugin, <code>export default defineConfig({ plugins: [react()] })</code>. The plugin makes JSX work and gives you Fast Refresh (component updates that keep state).</li>
<li><code>tsconfig.json</code>, <code>tsconfig.app.json</code>, <code>tsconfig.node.json</code> — TypeScript settings. The first only points to the other two: <code>app</code> checks <code>src/</code> (browser code, with <code>"jsx": "react-jsx"</code>), <code>node</code> checks <code>vite.config.ts</code> (runs in Node). Both have <code>"noEmit": true</code>: TypeScript only checks, Vite does the compiling.</li>
<li><code>public/</code> — files copied as-is to the output and served from the root: <code>public/favicon.svg</code> is <code>/favicon.svg</code>.</li>
<li><code>src/main.tsx</code> — the entry point that starts React. <code>src/App.tsx</code> — the first component. <code>src/index.css</code>, <code>src/App.css</code> — styles. <code>src/assets/</code> — images you <code>import</code> in code; Vite adds a content hash to their names at build time (<code>hero-CLDdwZDr.png</code>) so browsers can cache them forever.</li>
<li><code>.oxlintrc.json</code> — two lint rules for React: <code>react/rules-of-hooks</code> (error) and <code>react/only-export-components</code> (warning, needed for Fast Refresh). <code>.gitignore</code> — already ignores <code>node_modules</code> and <code>dist</code>.</li>
</ul>
<p>A file extension tells you what a file may contain: <code>.ts</code> is TypeScript, <code>.tsx</code> is TypeScript that may contain JSX. Put components in <code>.tsx</code>, plain logic (types, helpers, data) in <code>.ts</code>.</p>

<h3>From index.html to your component</h3>
${slide('rx-00', 15, 'index.html → main.tsx → App.tsx')}
<p>When the browser opens <code>http://localhost:5173/</code>, it receives <code>index.html</code>, sees the module script, and asks the dev server for <code>/src/main.tsx</code>. That file is short, and every line matters:</p>
<pre><code class="language-tsx">import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  &lt;StrictMode&gt;
    &lt;App /&gt;
  &lt;/StrictMode&gt;,
)</code></pre>
<ul>
<li><code>import { createRoot } from 'react-dom/client'</code> — React is split in two packages: <code>react</code> (components, hooks) and <code>react-dom</code> (putting them into a browser page). The curly braces import one <em>named</em> export (Lesson 0.3).</li>
<li><code>import './index.css'</code> — importing a CSS file makes Vite inject it into the page.</li>
<li><code>document.getElementById('root')!</code> — finds the empty <code>div</code>. The <code>!</code> at the end is TypeScript for "I know this is not null": <code>getElementById</code> is typed as <code>HTMLElement | null</code>, and <code>createRoot</code> refuses <code>null</code>.</li>
<li><code>createRoot(...).render(&lt;App /&gt;)</code> — React takes control of that div and renders your <code>App</code> component inside it. From now on, you never touch the DOM directly; you change state and React updates the div.</li>
<li><code>&lt;StrictMode&gt;</code> — development-only checks. It renders components twice and runs effects twice in development to expose bugs early (Chapter 4 shows why). It does nothing in production.</li>
</ul>
<p>How does the browser run a <code>.tsx</code> file? It does not. We asked the dev server for a small component and printed what it actually sent: a JavaScript module where the JSX has already become <code>_jsxDEV("div", …)</code> calls, the types are gone, and React itself is imported from <code>/node_modules/.vite/deps/react_jsx-dev-runtime.js</code>. That is Vite&#39;s trick: in development it does <strong>not</strong> bundle your app first. It serves each file as a native ES module and translates it at the moment the browser asks for it; only libraries from <code>node_modules</code> are pre-bundled once into <code>node_modules/.vite/deps</code>. For production, <code>vite build</code> bundles everything with Rolldown (the bundler Vite 8 depends on). Lesson 0.2 looks at that translated output line by line.</p>

<div class="callout"><p><strong>Common interview question.</strong> "Why does Vite start so much faster than Create React App or a webpack setup?"</p>
<p>Answer: webpack bundles the whole application before the dev server can serve a page, so start-up time grows with the app. Vite&#39;s dev server serves source files as native ES modules and transforms each file only when the browser requests it; dependencies are pre-bundled once and cached. Updates after a save go through HMR for just the changed module. For production it still bundles (with Rolldown in Vite 8) and minifies. Measured on the same machine: about 7 s for CRA versus 0.3–0.4 s for Vite.</p></div>

<h3>The starter page, hot updates and DevTools</h3>
${slide('rx-00', 16, 'Trang mặc định của Vite — ảnh chụp thật')}
<p>The screenshot on the slide is the real page, taken with Playwright from the dev server. Seeing it proves the whole chain works: Node, npm, Vite, React and the TypeScript template. Now try the feature that makes daily work pleasant, <strong>HMR (Hot Module Replacement)</strong>: with the page open, change a sentence in <code>src/App.tsx</code> and save. We measured it with a script that edits the file while a real browser is watching:</p>
<div class="out">TRƯỚC: Khám nhanh, hẹn đúng giờ, không phải xếp hàng.
SAU: Đặt lịch online, đến là khám. (100 ms)
--- log máy chủ vite:
  VITE v8.3.1  ready in 266 ms
1:43:02 AM [vite] (client) hmr update /src/App.tsx
--- console trình duyệt:
[debug] [vite] hot updated: /src/App.tsx</div>
<p>About 100 milliseconds from saving to new text on screen, with no page reload. The terminal line <code>hmr update /src/App.tsx</code> tells you which module was swapped; if you ever see a full reload instead, the file probably exports something that is not a component (the <code>only-export-components</code> lint rule warns about exactly that).</p>
<p>The browser console also printed <code>Download the React DevTools for a better development experience</code>. <strong>React Developer Tools</strong> is a browser extension (Chrome, Firefox, Edge) that adds two tabs to DevTools: <em>Components</em>, where you see the component tree with each component&#39;s props and state, and <em>Profiler</em>, which Chapter 8 uses to measure renders. Install it now from your browser&#39;s extension store.</p>
<p>⏳ Not run for real: installing the React DevTools extension and taking a screenshot of its Components tab — the headless browser on the course-writing machine cannot install extensions.</p>
<!-- CHAY-O-MAY: cài React Developer Tools trên Chrome, mở localhost:5173 của phong-kham, chụp tab Components (thấy <App>) để thêm vào slide/bài 0.1 -->

<h3>vite build does not check types — tsc -b does</h3>
${slide('rx-00', 17, 'vite build KHÔNG kiểm kiểu — tsc -b mới kiểm')}
<p>This is the fact that surprises everyone once. To make development fast, Vite only <em>strips</em> TypeScript types; it never checks them. We put a deliberate type error in <code>App.tsx</code> — <code>const namNay: string = new Date().getFullYear()</code> (a number stored in a string variable) — and ran three commands:</p>
<pre><code class="language-bash">$ npx tsc -b</code></pre>
<div class="out">src/App.tsx(13,9): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<pre><code class="language-bash">$ npx vite build</code></pre>
<div class="out">dist/assets/index-Cni7a6VB.css    1.39 kB │ gzip:  0.63 kB
dist/assets/index-CcUL7llf.js   222.07 kB │ gzip: 69.86 kB

✓ built in 363ms</div>
<pre><code class="language-bash">$ npm run build</code></pre>
<div class="out">&gt; phong-kham@0.0.0 build
&gt; tsc -b &amp;&amp; vite build

src/App.tsx(13,9): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p><code>vite build</code> produced a working bundle with the type error inside. That is why the template&#39;s <code>build</code> script is <code>tsc -b &amp;&amp; vite build</code>: the <code>&amp;&amp;</code> runs the second command only if the first succeeded, so <code>npm run build</code> stops at the type error. In the editor, VS Code shows the same error as a red underline while you type. <code>tsc -b</code> ("build mode") follows the references in <code>tsconfig.json</code> and checks both <code>tsconfig.app.json</code> and <code>tsconfig.node.json</code>; with no errors it prints nothing at all — silence is success.</p>
<p>The linter is a separate, third check. On the fresh template <code>npm run lint</code> printed nothing (no problems). With an unused variable it said:</p>
<div class="out">src/thu-lint.tsx:1:7: warning eslint(no-unused-vars): Variable 'x' is declared but never used. Unused variables should start with a '_'. help: Consider removing this declaration.</div>
<p>From now on, before every commit: <code>npx tsc -b</code> (types), <code>npx vitest run</code> (tests, added below), <code>npx vite build</code> (bundle). Chapter 14 runs the same three in GitHub Actions.</p>

<div class="pitfall co-tieu-de"><strong>Trap — "the build is green, so the code is fine".</strong> A team sets up deployment with <code>vite build</code> directly (it is faster than <code>npm run build</code>). Weeks later a refactor changes a function to return <code>string | undefined</code>; nobody runs <code>tsc</code>, the build stays green, and production crashes with "Cannot read properties of undefined" on a page nobody tested. Never deploy from <code>vite build</code> alone: run <code>tsc -b</code> first, in CI as well as on your machine.</div>

<h3>Run it step by step: clean the template and add Vitest</h3>
<p>The template is a demo page. Before Lesson 0.2 we clean it and add the test runner, because the template does not include one. Follow along in your <code>phong-kham</code> folder.</p>
<ol>
<li>Delete what we will not use: <code>src/App.css</code>, the <code>src/assets/</code> folder, and <code>public/icons.svg</code>. <code>App.tsx</code> will now fail to compile because it imports them — that is fine, you replace it in the 🛠 step of Lesson 0.3.</li>
<li>In <code>index.html</code> change <code>&lt;html lang="en"&gt;</code> to <code>&lt;html lang="vi"&gt;</code> (screen readers pronounce Vietnamese correctly) and the title to <code>Phòng khám An Tâm</code>.</li>
<li>Install the test tools as <em>dev dependencies</em> (<code>-D</code>: needed to develop, not shipped to users):
<pre><code class="language-bash">$ npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event</code></pre>
<div class="out">added 85 packages, and audited 113 packages in 6s

23 packages are looking for funding
  run &#96;npm fund&#96; for details
found 0 vulnerabilities</div></li>
<li>Tell Vitest to use a browser-like DOM. Add a <code>test</code> block to <code>vite.config.ts</code> — and the first line, which is easy to forget:
<pre><code class="language-ts">/// &lt;reference types="vitest/config" /&gt;
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})</code></pre>
Without the <code>/// &lt;reference … /&gt;</code> line, <code>tsc -b</code> fails, because plain Vite does not know about a <code>test</code> option:
<div class="out">vite.config.ts(7,3): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'.</div></li>
<li>Create <code>src/test/setup.ts</code>:
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest không bật "globals" ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test thứ hai thấy cả trang của test thứ nhất.
afterEach(cleanup)</code></pre>
The first import adds matchers such as <code>toBeInTheDocument()</code>. The <code>afterEach(cleanup)</code> line is explained in the trap below.</li>
<li>Add a script: <code>npm pkg set scripts.test="vitest run"</code>. Now <code>npm test</code> runs all tests once.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Trap — the second test sees the first test&#39;s page.</strong> Testing Library cleans up the rendered DOM after each test automatically <em>only</em> when the test runner exposes a global <code>afterEach</code>. Vitest does not, unless you enable <code>globals: true</code>. Without the <code>afterEach(cleanup)</code> line, our two home-page tests failed like this, because the first test&#39;s page was still there: <code>TestingLibraryElementError: Found multiple elements with the role "heading" and name "Giờ mở cửa"</code>. The error dump printed the whole page <em>twice</em> inside <code>&lt;body&gt;</code> — the tell-tale sign. Add the line once in <code>setup.ts</code> and forget about it.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> set up your own <code>phong-kham</code> and prove the three checks behave as in this lesson.</p><ol>
<li>Create the project with <code>npm create vite@latest phong-kham -- --template react-ts</code> (Oxlint, No), then <code>npm install</code> and <code>npm run dev</code>. Open the page.</li>
<li>Change "Get started" in <code>App.tsx</code> to "Phòng khám An Tâm" and save. Watch the page and the terminal.</li>
<li>Add <code>const namNay: string = new Date().getFullYear()</code> inside <code>App</code>. Run <code>npx tsc -b</code>, then <code>npx vite build</code>, then <code>npm run build</code>. Remove the line.</li>
<li>Run <code>npm ls react vite typescript</code> and write down your versions.</li>
</ol><p><strong>Done when:</strong> the heading changed without a page reload and the terminal printed <code>hmr update /src/App.tsx</code>; <code>npx tsc -b</code> printed <code>error TS2322</code> while <code>npx vite build</code> printed <code>✓ built in</code>; <code>npm run build</code> stopped at the TS2322 line; and after removing the line <code>npx tsc -b</code> prints nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Node.js / npm</span><span class="v">JavaScript runtime that runs the tools / its package manager (installs into <code>node_modules</code>)</span></div>
<div class="kv"><span class="k">Vite</span><span class="v">dev server + build tool; serves ES modules in dev, bundles with Rolldown for production</span></div>
<div class="kv"><span class="k">scaffold</span><span class="v">generating a starter project from a template (<code>create-vite</code>, <code>create-react-app</code>)</span></div>
<div class="kv"><span class="k">HMR (hot module replacement)</span><span class="v">swapping one changed module in the running page without a reload (~100 ms here)</span></div>
<div class="kv"><span class="k">entry point</span><span class="v"><code>index.html</code> → <code>src/main.tsx</code>, where <code>createRoot(...).render(&lt;App /&gt;)</code> starts React</span></div>
<div class="kv"><span class="k"><code>tsc -b</code></span><span class="v">TypeScript type check in build mode; prints nothing when there are no errors</span></div>
<div class="kv"><span class="k">dev dependency (<code>-D</code>)</span><span class="v">needed to develop and test (Vitest, TypeScript), not shipped to the browser</span></div>
<div class="kv"><span class="k">StrictMode</span><span class="v">development-only checks that render components and run effects twice to expose bugs</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Use Node 22.12+ (or 24): it is what Vite 8 and Vitest 5 declare in <code>engines</code>.</li>
<li><code>npm create vite@latest phong-kham -- --template react-ts</code> → Oxlint → No → <code>npm install</code> → <code>npm run dev</code>; 27 packages, dev server ready in under half a second.</li>
<li>Measured against CRA on the same machine: 27 vs 1292 packages, 90 vs 361 MB, 0 vs 28 known vulnerabilities, 0.3 s vs 7 s to start.</li>
<li><code>index.html</code> loads <code>src/main.tsx</code>, which calls <code>createRoot(...).render(&lt;App /&gt;)</code>; Vite translates each file when the browser asks.</li>
<li><code>vite build</code> does not check types; <code>tsc -b</code> does, and <code>npm run build</code> runs both.</li>
<li>The template has no test runner: install Vitest + Testing Library, add the <code>test</code> block and <code>afterEach(cleanup)</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Build a React app from Scratch</span><span class="lc-sub">react.dev/learn/build-a-react-app-from-scratch — the official page that recommends <code>npm create vite@latest my-app -- --template react-ts</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">react.dev/learn/react-developer-tools — install links for Chrome, Firefox and Edge, and what the Components tab shows.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;StrictMode&gt;</span><span class="lc-sub">react.dev/reference/react/StrictMode — what the development-only double render and double effect are for.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vite — Getting Started</span><span class="lc-sub">vite.dev/guide — templates, <code>npm create vite</code>, and why Vite serves native ES modules in development.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — the type checker you just met</span><span class="lc-sub">/courses/typescript/learn${REF} — what <code>tsc</code> checks, strict mode, and reading TS error messages.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Cài đặt với Vite và TypeScript (đo so với Create React App)</h2>
<p class="lead">Trong bài này bạn tạo dự án sẽ đi cùng bạn tới Chương 14, bằng đúng lệnh công ty dùng năm 2026: <code>npm create vite@latest</code>. Mọi output dưới đây được ghi trên máy soạn bài, và để trả lời câu "sao không dùng Create React App?" bằng con số thay vì ý kiến, chúng tôi chạy luôn CRA trên cùng máy, cùng ngày.</p>

<p>Hết bài bạn biết mỗi file trong dự án mới làm gì, điều gì xảy ra giữa lúc gõ <code>npm run dev</code> và lúc thấy trang, vì sao lưu file thì trang đổi trong khoảng một phần mười giây, và — sự thật giúp người mới đỡ mất cả buổi — vì sao <code>vite build</code> vẫn thành công dù code có lỗi kiểu.</p>

<h3>Trước khi bắt đầu: Node, npm và trình soạn thảo</h3>
<p>Code React viết bằng ngôn ngữ của trình duyệt (JavaScript, thêm TypeScript lên trên), nhưng các <em>công cụ</em> — máy chủ dev, bộ đóng gói, bộ chạy test — chạy trên <strong>Node.js</strong>, môi trường chạy JavaScript trên máy tính. <strong>npm</strong> là trình quản lý gói đi kèm Node: nó tải thư viện vào thư mục <code>node_modules</code> và chạy các script trong <code>package.json</code>.</p>
<pre><code class="language-bash">$ node -v
$ npm -v</code></pre>
<div class="out">v22.22.2
10.9.7</div>
<p>Cần Node bản nào? Chính các công cụ ghi rõ, trong trường <code>engines</code> của <code>package.json</code> của chúng (kiểm trong <code>node_modules</code>, 09/2026): Vite 8.3.1 cần <code>^20.19.0 || &gt;=22.12.0</code>, còn Vitest 5.0.1 cần <code>^22.12.0 || ^24.0.0 || &gt;=26.0.0</code>. Vậy: <strong>Node 22.12 trở lên, hoặc Node 24</strong>. Nếu <code>node -v</code> in ra v18 hay v20, hãy cài bản LTS hiện tại từ nodejs.org (hoặc bằng trình quản lý phiên bản như nvm, fnm) trước khi làm tiếp. Trình soạn thảo nào cũng được; khoá giả định VS Code, vốn hiểu TypeScript và JSX mà không cần plugin.</p>

<h3>Tạo dự án</h3>
${slide('rx-00', 12, 'npm create vite: hai câu hỏi, dưới một giây')}
<p>Mở terminal ở thư mục bạn để các dự án và chạy lệnh trên slide. <code>npm create vite@latest</code> tải gói <code>create-vite</code> mới nhất rồi chạy nó; <code>phong-kham</code> là tên thư mục; mọi thứ sau dấu <code>--</code> đứng riêng được chuyển cho create-vite, ở đây là <code>--template react-ts</code> (React + TypeScript). Phiên tương tác thật hỏi hai câu:</p>
<pre><code class="language-bash">$ npm create vite@latest phong-kham -- --template react-ts</code></pre>
<div class="out">&gt; npx
&gt; create-vite phong-kham --template react-ts

To create in one go, run: create-vite &lt;DIRECTORY&gt; --no-interactive --template &lt;TEMPLATE&gt;
*  Which linter to use?
|  &gt; Oxlint
|    ESLint
o  Which linter to use?
|  Oxlint
*  Install with npm and start now?
|    Yes / &gt; No
o  Scaffolding project in …/phong-kham...
—  Done. Now run:

  cd phong-kham
  npm install
  npm run dev</div>
<ul>
<li><strong>Which linter to use?</strong> Linter đọc code và cảnh báo những chỗ dễ sai (biến khai báo mà không dùng, hook gọi bên trong <code>if</code>). Mặc định là <strong>Oxlint</strong>, linter rất nhanh viết bằng Rust; ESLint là cái cũ hơn, cấu hình được nhiều hơn, nhiều công ty vẫn chạy. Khoá này chọn Oxlint.</li>
<li><strong>Install with npm and start now?</strong> Lần đầu hãy chọn <strong>No</strong>, để thấy từng bước riêng. "Yes" chỉ là chạy hộ bạn hai lệnh kế tiếp.</li>
</ul>
<p>Cả bước dựng khung mất 0,5 giây (<code>time</code> in <code>real 0m0.525s</code> với dạng không tương tác). Nó chỉ chép file mẫu; chưa tải gì cả. Sau đó:</p>
<pre><code class="language-bash">$ cd phong-kham
$ npm install</code></pre>
<div class="out">added 27 packages, and audited 28 packages in 8s

9 packages are looking for funding
  run &#96;npm fund&#96; for details

found 0 vulnerabilities</div>
<pre><code class="language-bash">$ npm run dev</code></pre>
<div class="out">  VITE v8.3.1  ready in 400 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose</div>
<p>Mở <code>http://localhost:5173/</code> là thấy trang mẫu của Vite. Máy chủ chạy tiếp trong terminal đó; dừng bằng <kbd>Ctrl</kbd>+<kbd>C</kbd>. Hai tuỳ chọn bạn sẽ dùng: <code>npm run dev -- --port 5174</code> khi cổng 5173 đã bị chiếm, và <code>--host</code> để mở trang từ điện thoại cùng Wi-Fi. Kiểm phiên bản bạn thật sự nhận được:</p>
<pre><code class="language-bash">$ npm ls react react-dom vite typescript</code></pre>
<div class="out">phong-kham@0.0.0
+-- @vitejs/plugin-react@6.1.1
| &#96;-- vite@8.3.1 deduped
+-- react-dom@19.3.0
| &#96;-- react@19.3.0 deduped
+-- react@19.3.0
+-- typescript@6.0.3
&#96;-- vite@8.3.1</div>
<p>Có một bất ngờ nhỏ: <code>package.json</code> của template ghi <code>"react": "^19.2.8"</code>, vậy mà npm cài 19.3.0. Dấu mũ <code>^</code> nghĩa là "bản này hoặc bản mới hơn có cùng số chính (major)", nên 19.3.0 hợp lệ. Phiên bản chính xác bạn nhận được ghi vào <code>package-lock.json</code>; hãy commit file đó để cả đội cài đúng những bản ấy.</p>
<p>Nếu muốn không bị hỏi gì (cho script hay CI), chính công cụ đã chỉ cách: <code>npm create vite@latest phong-kham -- --template react-ts --no-interactive</code>.</p>

<h3>Sao không dùng Create React App? Đo thật, cùng máy, cùng ngày</h3>
${slide('rx-00', 13, 'CRA so với Vite: đo cùng máy, cùng ngày')}
<p>Tài liệu FER202 thường vẫn mở đầu bằng <code>npx create-react-app</code>. Năm 2026 nó vẫn chạy — và vẫn cài React 19.3.0 — nên câu hỏi công bằng là nó tốn gì. Chúng tôi chạy cả hai trên cùng máy ngày 25/09/2026:</p>
<pre><code class="language-bash">$ npx -y create-react-app@latest thu-cra</code></pre>
<div class="out">npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. …
npm warn deprecated glob@7.2.3: Old versions of glob are not supported, …
…
create-react-app is deprecated.

You can find a list of up-to-date React frameworks on react.dev
For more info see:https://react.dev/link/cra

This error message will only be shown once per install.

Creating a new React app in …/thu-cra.

Installing packages. This might take a couple of minutes.
Installing react, react-dom, and react-scripts with cra-template...

added 1292 packages in 48s
…
28 vulnerabilities (9 low, 5 moderate, 14 high)</div>
<table>
<thead><tr><th>Đo 25/09/2026</th><th>create-react-app 5.1.0 (react-scripts 5.0.1)</th><th>create-vite 9.2.1, react-ts</th></tr></thead>
<tbody>
<tr><td>Số gói cài, thời gian</td><td>1292 gói, 48 s</td><td>27 gói, 8 s</td></tr>
<tr><td>Dung lượng <code>node_modules</code> (<code>du -sh</code>)</td><td>361 MB</td><td>90 MB</td></tr>
<tr><td><code>npm audit</code> sau khi cài</td><td>28 lỗ hổng (14 high)</td><td>0</td></tr>
<tr><td>Máy chủ dev sẵn sàng</td><td>khoảng 7,1 s tới "Compiled successfully!" (webpack)</td><td>"ready in 267–400 ms"</td></tr>
<tr><td>Build production</td><td>8,8 s, JS chính 70 kB gzip</td><td>0,17 s, JS 69,27 kB gzip</td></tr>
<tr><td>Cảnh báo khi khởi động máy chủ dev</td><td>hai <code>DeprecationWarning</code> của webpack-dev-server</td><td>không có</td></tr>
</tbody>
</table>
<p>Kích thước gói JS gần như bằng nhau — phần lớn là chính React — nhưng mọi thứ quanh code thì CRA nặng và chậm hơn, và cây phụ thuộc của nó mang theo lỗ hổng đã biết mà sẽ chẳng ai sửa, vì dự án không còn người bảo trì. Đó là lý do react.dev khai tử nó ngày 14/02/2025, và vì sao chính trình cài của nó giờ mở đầu bằng "create-react-app is deprecated".</p>
<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p><code>npx create-react-app my-app</code>, file JavaScript, <code>npm start</code> ở cổng 3000, <code>npm run eject</code> khi cần sửa cấu hình webpack → <code>npm create vite@latest my-app -- --template react-ts</code>, TypeScript ngay từ file đầu, <code>npm run dev</code> ở cổng 5173, một file <code>vite.config.ts</code> bảy dòng sửa trực tiếp · <em>Vì sao:</em> CRA đã bị khai tử và không còn ai bảo trì, nhiều gói gấp 48 lần kèm lỗ hổng đã biết, và máy chủ dev mất vài giây thay vì một phần nhỏ của giây. Bạn vẫn gặp CRA trong dự án cũ ở công ty: nhận ra nó qua <code>react-scripts</code> trong <code>package.json</code>. Chuyển một dự án như thế sang Vite là việc đầu tiên hay giao cho người mới, và react.dev có hướng dẫn cho việc đó.</p></div>

<h3>Trong dự án có gì</h3>
${slide('rx-00', 14, 'Cấu trúc dự án: bạn chỉ sống trong src/')}
<p>Dự án mới có 18 file (không tính <code>node_modules</code>). Gần như cả ngày bạn ở trong <code>src/</code>, nhưng nên biết mỗi file để làm gì:</p>
<ul>
<li><code>index.html</code> — trang HTML duy nhất của app. Phần thân chỉ có <code>&lt;div id="root"&gt;&lt;/div&gt;</code> và <code>&lt;script type="module" src="/src/main.tsx"&gt;</code>. Ở CRA nó nằm trong <code>public/</code>; ở Vite nó nằm ở gốc vì Vite coi nó là điểm vào.</li>
<li><code>package.json</code> — tên, <code>"type": "module"</code> (file dùng <code>import</code>/<code>export</code>), các phụ thuộc, và bốn script: <code>dev</code> (<code>vite</code>), <code>build</code> (<code>tsc -b &amp;&amp; vite build</code>), <code>lint</code> (<code>oxlint</code>) và <code>preview</code> (<code>vite preview</code>, phục vụ thư mục <code>dist/</code> đã build giống production).</li>
<li><code>vite.config.ts</code> — bảy dòng: import plugin React, <code>export default defineConfig({ plugins: [react()] })</code>. Plugin làm JSX chạy được và cho bạn Fast Refresh (cập nhật component mà giữ nguyên state).</li>
<li><code>tsconfig.json</code>, <code>tsconfig.app.json</code>, <code>tsconfig.node.json</code> — cấu hình TypeScript. File đầu chỉ trỏ tới hai file kia: <code>app</code> kiểm <code>src/</code> (code chạy trong trình duyệt, có <code>"jsx": "react-jsx"</code>), <code>node</code> kiểm <code>vite.config.ts</code> (chạy trong Node). Cả hai có <code>"noEmit": true</code>: TypeScript chỉ kiểm, việc dịch để Vite lo.</li>
<li><code>public/</code> — file chép nguyên xi ra kết quả và phục vụ từ gốc: <code>public/favicon.svg</code> là <code>/favicon.svg</code>.</li>
<li><code>src/main.tsx</code> — điểm vào khởi động React. <code>src/App.tsx</code> — component đầu tiên. <code>src/index.css</code>, <code>src/App.css</code> — style. <code>src/assets/</code> — ảnh được <code>import</code> trong code; lúc build Vite gắn mã băm nội dung vào tên (<code>hero-CLDdwZDr.png</code>) để trình duyệt cache được mãi mãi.</li>
<li><code>.oxlintrc.json</code> — hai luật lint cho React: <code>react/rules-of-hooks</code> (lỗi) và <code>react/only-export-components</code> (cảnh báo, cần cho Fast Refresh). <code>.gitignore</code> — đã bỏ qua sẵn <code>node_modules</code> và <code>dist</code>.</li>
</ul>
<p>Đuôi file cho biết file được chứa gì: <code>.ts</code> là TypeScript, <code>.tsx</code> là TypeScript có thể chứa JSX. Component để trong <code>.tsx</code>, logic thuần (kiểu, hàm tiện ích, dữ liệu) để trong <code>.ts</code>.</p>

<h3>Từ index.html tới component của bạn</h3>
${slide('rx-00', 15, 'index.html → main.tsx → App.tsx')}
<p>Khi trình duyệt mở <code>http://localhost:5173/</code>, nó nhận <code>index.html</code>, thấy thẻ script dạng module, và xin máy chủ dev file <code>/src/main.tsx</code>. File này ngắn, và dòng nào cũng có ý nghĩa:</p>
<pre><code class="language-tsx">import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  &lt;StrictMode&gt;
    &lt;App /&gt;
  &lt;/StrictMode&gt;,
)</code></pre>
<ul>
<li><code>import { createRoot } from 'react-dom/client'</code> — React chia làm hai gói: <code>react</code> (component, hook) và <code>react-dom</code> (đặt chúng vào trang trình duyệt). Dấu ngoặc nhọn import một export <em>có tên</em> (Bài 0.3).</li>
<li><code>import './index.css'</code> — import một file CSS là Vite chèn nó vào trang.</li>
<li><code>document.getElementById('root')!</code> — tìm cái div rỗng. Dấu <code>!</code> ở cuối là cách TypeScript nói "tôi biết cái này không null": <code>getElementById</code> có kiểu <code>HTMLElement | null</code>, còn <code>createRoot</code> không nhận <code>null</code>.</li>
<li><code>createRoot(...).render(&lt;App /&gt;)</code> — React nắm quyền cái div đó và render component <code>App</code> vào trong. Từ đây bạn không chạm DOM trực tiếp nữa; bạn đổi state và React cập nhật div.</li>
<li><code>&lt;StrictMode&gt;</code> — các phép kiểm chỉ chạy khi phát triển. Nó render component hai lần và chạy effect hai lần ở chế độ dev để lộ bug sớm (Chương 4 chỉ ra vì sao). Ở production nó không làm gì.</li>
</ul>
<p>Trình duyệt chạy file <code>.tsx</code> kiểu gì? Nó không chạy. Chúng tôi xin máy chủ dev một component nhỏ và in ra thứ nó thật sự gửi: một module JavaScript trong đó JSX đã thành lời gọi <code>_jsxDEV("div", …)</code>, kiểu đã biến mất, và chính React được import từ <code>/node_modules/.vite/deps/react_jsx-dev-runtime.js</code>. Đó là mẹo của Vite: khi phát triển nó <strong>không</strong> đóng gói app trước. Nó phục vụ từng file dưới dạng ES module gốc và dịch file đúng lúc trình duyệt xin; chỉ thư viện trong <code>node_modules</code> được gom trước một lần vào <code>node_modules/.vite/deps</code>. Khi build production, <code>vite build</code> đóng gói tất cả bằng Rolldown (bộ đóng gói mà Vite 8 phụ thuộc). Bài 0.2 đọc kỹ từng dòng output đã dịch đó.</p>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Vì sao Vite khởi động nhanh hơn Create React App hay một cấu hình webpack?"</p>
<p>Ý trả lời: webpack đóng gói cả ứng dụng xong thì máy chủ dev mới phục vụ được trang, nên thời gian khởi động tăng theo độ lớn app. Máy chủ dev của Vite phục vụ file nguồn dưới dạng ES module gốc và chỉ dịch từng file khi trình duyệt xin; thư viện được gom trước một lần và cache lại. Sau khi lưu, cập nhật đi qua HMR chỉ cho đúng module vừa đổi. Khi build production nó vẫn đóng gói (bằng Rolldown ở Vite 8) và nén. Đo trên cùng máy: khoảng 7 s cho CRA so với 0,3–0,4 s cho Vite.</p></div>

<h3>Trang mẫu, cập nhật nóng và DevTools</h3>
${slide('rx-00', 16, 'Trang mặc định của Vite — ảnh chụp thật')}
<p>Ảnh trên slide là trang thật, chụp bằng Playwright từ máy chủ dev. Thấy nó là biết cả chuỗi đã chạy: Node, npm, Vite, React và template TypeScript. Giờ thử tính năng làm việc hằng ngày dễ chịu, <strong>HMR (Hot Module Replacement — thay module nóng)</strong>: để trang mở, sửa một câu trong <code>src/App.tsx</code> rồi lưu. Chúng tôi đo bằng một script sửa file trong khi một trình duyệt thật đang theo dõi:</p>
<div class="out">TRƯỚC: Khám nhanh, hẹn đúng giờ, không phải xếp hàng.
SAU: Đặt lịch online, đến là khám. (100 ms)
--- log máy chủ vite:
  VITE v8.3.1  ready in 266 ms
1:43:02 AM [vite] (client) hmr update /src/App.tsx
--- console trình duyệt:
[debug] [vite] hot updated: /src/App.tsx</div>
<p>Khoảng 100 mili-giây từ lúc lưu tới lúc chữ mới hiện, không tải lại trang. Dòng <code>hmr update /src/App.tsx</code> trong terminal cho biết module nào vừa được thay; nếu có lúc bạn thấy cả trang tải lại thay vì vậy, nhiều khả năng file đó export thứ gì không phải component (luật lint <code>only-export-components</code> cảnh báo đúng chuyện này).</p>
<p>Console của trình duyệt còn in <code>Download the React DevTools for a better development experience</code>. <strong>React Developer Tools</strong> là tiện ích mở rộng trình duyệt (Chrome, Firefox, Edge) thêm hai tab vào DevTools: <em>Components</em>, nơi bạn thấy cây component kèm props và state của từng cái, và <em>Profiler</em>, thứ Chương 8 dùng để đo render. Cài ngay từ cửa hàng tiện ích của trình duyệt.</p>
<p>⏳ Chưa chạy thật: cài tiện ích React DevTools và chụp tab Components — trình duyệt không giao diện trên máy soạn bài không cài được tiện ích.</p>
<!-- CHAY-O-MAY: cài React Developer Tools trên Chrome, mở localhost:5173 của phong-kham, chụp tab Components (thấy <App>) để thêm vào slide/bài 0.1 -->

<h3>vite build không kiểm kiểu — tsc -b mới kiểm</h3>
${slide('rx-00', 17, 'vite build KHÔNG kiểm kiểu — tsc -b mới kiểm')}
<p>Đây là sự thật làm ai cũng bất ngờ một lần. Để phát triển cho nhanh, Vite chỉ <em>bóc</em> kiểu TypeScript đi; nó không bao giờ kiểm. Chúng tôi cố ý đặt một lỗi kiểu vào <code>App.tsx</code> — <code>const namNay: string = new Date().getFullYear()</code> (một số bị gán vào biến kiểu chuỗi) — rồi chạy ba lệnh:</p>
<pre><code class="language-bash">$ npx tsc -b</code></pre>
<div class="out">src/App.tsx(13,9): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<pre><code class="language-bash">$ npx vite build</code></pre>
<div class="out">dist/assets/index-Cni7a6VB.css    1.39 kB │ gzip:  0.63 kB
dist/assets/index-CcUL7llf.js   222.07 kB │ gzip: 69.86 kB

✓ built in 363ms</div>
<pre><code class="language-bash">$ npm run build</code></pre>
<div class="out">&gt; phong-kham@0.0.0 build
&gt; tsc -b &amp;&amp; vite build

src/App.tsx(13,9): error TS2322: Type 'number' is not assignable to type 'string'.</div>
<p><code>vite build</code> vẫn cho ra một gói chạy được với lỗi kiểu nằm bên trong. Vì thế script <code>build</code> của template là <code>tsc -b &amp;&amp; vite build</code>: dấu <code>&amp;&amp;</code> chỉ chạy lệnh thứ hai khi lệnh đầu thành công, nên <code>npm run build</code> dừng ở lỗi kiểu. Trong trình soạn thảo, VS Code hiện đúng lỗi đó bằng gạch đỏ ngay khi gõ. <code>tsc -b</code> ("chế độ build") đi theo các tham chiếu trong <code>tsconfig.json</code> và kiểm cả <code>tsconfig.app.json</code> lẫn <code>tsconfig.node.json</code>; không có lỗi thì nó không in gì — im lặng là thành công.</p>
<p>Linter là phép kiểm thứ ba, riêng biệt. Trên template mới <code>npm run lint</code> không in gì (không có vấn đề). Khi có một biến không dùng, nó nói:</p>
<div class="out">src/thu-lint.tsx:1:7: warning eslint(no-unused-vars): Variable 'x' is declared but never used. Unused variables should start with a '_'. help: Consider removing this declaration.</div>
<p>Từ giờ, trước mỗi commit: <code>npx tsc -b</code> (kiểu), <code>npx vitest run</code> (test, thêm ở dưới), <code>npx vite build</code> (đóng gói). Chương 14 chạy đúng ba lệnh này trong GitHub Actions.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "build xanh nghĩa là code ổn".</strong> Một đội cấu hình deploy bằng <code>vite build</code> trực tiếp (nhanh hơn <code>npm run build</code>). Vài tuần sau một lần sửa đổi làm một hàm trả về <code>string | undefined</code>; không ai chạy <code>tsc</code>, build vẫn xanh, và production sập với "Cannot read properties of undefined" ở một trang không ai test. Đừng bao giờ deploy chỉ từ <code>vite build</code>: chạy <code>tsc -b</code> trước, cả trong CI lẫn trên máy bạn.</div>

<h3>Chạy thử từng bước: dọn template và thêm Vitest</h3>
<p>Template là một trang demo. Trước Bài 0.2 ta dọn nó và thêm bộ chạy test, vì template không có sẵn. Làm theo trong thư mục <code>phong-kham</code> của bạn.</p>
<ol>
<li>Xoá thứ không dùng: <code>src/App.css</code>, thư mục <code>src/assets/</code>, và <code>public/icons.svg</code>. Lúc này <code>App.tsx</code> sẽ không biên dịch được vì còn import chúng — không sao, bạn thay nó ở bước 🛠 của Bài 0.3.</li>
<li>Trong <code>index.html</code> đổi <code>&lt;html lang="en"&gt;</code> thành <code>&lt;html lang="vi"&gt;</code> (trình đọc màn hình đọc đúng giọng Việt) và tiêu đề thành <code>Phòng khám An Tâm</code>.</li>
<li>Cài công cụ test dạng <em>dev dependency</em> (<code>-D</code>: cần để phát triển, không gửi tới người dùng):
<pre><code class="language-bash">$ npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event</code></pre>
<div class="out">added 85 packages, and audited 113 packages in 6s

23 packages are looking for funding
  run &#96;npm fund&#96; for details
found 0 vulnerabilities</div></li>
<li>Bảo Vitest dùng một DOM giống trình duyệt. Thêm khối <code>test</code> vào <code>vite.config.ts</code> — và dòng đầu tiên, dòng rất dễ quên:
<pre><code class="language-ts">/// &lt;reference types="vitest/config" /&gt;
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})</code></pre>
Thiếu dòng <code>/// &lt;reference … /&gt;</code>, <code>tsc -b</code> báo lỗi, vì Vite thuần không biết tuỳ chọn <code>test</code>:
<div class="out">vite.config.ts(7,3): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'.</div></li>
<li>Tạo <code>src/test/setup.ts</code>:
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest không bật "globals" ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test thứ hai thấy cả trang của test thứ nhất.
afterEach(cleanup)</code></pre>
Dòng import đầu thêm các phép so như <code>toBeInTheDocument()</code>. Dòng <code>afterEach(cleanup)</code> được giải thích ở bẫy ngay dưới.</li>
<li>Thêm script: <code>npm pkg set scripts.test="vitest run"</code>. Giờ <code>npm test</code> chạy mọi test một lần.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Bẫy — test thứ hai thấy trang của test thứ nhất.</strong> Testing Library tự dọn DOM đã render sau mỗi test <em>chỉ khi</em> bộ chạy test để lộ một hàm <code>afterEach</code> toàn cục. Vitest thì không, trừ khi bạn bật <code>globals: true</code>. Thiếu dòng <code>afterEach(cleanup)</code>, hai test trang chủ của chúng tôi hỏng thế này, vì trang của test đầu vẫn còn đó: <code>TestingLibraryElementError: Found multiple elements with the role "heading" and name "Giờ mở cửa"</code>. Phần in lỗi cho thấy cả trang xuất hiện <em>hai lần</em> trong <code>&lt;body&gt;</code> — dấu hiệu nhận biết. Thêm dòng đó một lần trong <code>setup.ts</code> rồi quên nó đi.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> dựng <code>phong-kham</code> của riêng bạn và chứng minh ba phép kiểm cư xử đúng như trong bài.</p><ol>
<li>Tạo dự án bằng <code>npm create vite@latest phong-kham -- --template react-ts</code> (Oxlint, No), rồi <code>npm install</code> và <code>npm run dev</code>. Mở trang.</li>
<li>Đổi "Get started" trong <code>App.tsx</code> thành "Phòng khám An Tâm" rồi lưu. Nhìn trang và terminal.</li>
<li>Thêm <code>const namNay: string = new Date().getFullYear()</code> vào trong <code>App</code>. Chạy <code>npx tsc -b</code>, rồi <code>npx vite build</code>, rồi <code>npm run build</code>. Xoá dòng đó.</li>
<li>Chạy <code>npm ls react vite typescript</code> và ghi lại phiên bản của bạn.</li>
</ol><p><strong>Đạt khi:</strong> tiêu đề đổi mà trang không tải lại và terminal in <code>hmr update /src/App.tsx</code>; <code>npx tsc -b</code> in <code>error TS2322</code> trong khi <code>npx vite build</code> in <code>✓ built in</code>; <code>npm run build</code> dừng ở dòng TS2322; và sau khi xoá dòng đó <code>npx tsc -b</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Node.js / npm</span><span class="v">môi trường chạy JavaScript cho các công cụ / trình quản lý gói của nó (cài vào <code>node_modules</code>)</span></div>
<div class="kv"><span class="k">Vite</span><span class="v">máy chủ dev + công cụ build; phục vụ ES module khi dev, đóng gói bằng Rolldown khi build</span></div>
<div class="kv"><span class="k">scaffold (dựng khung)</span><span class="v">sinh dự án khởi đầu từ template (<code>create-vite</code>, <code>create-react-app</code>)</span></div>
<div class="kv"><span class="k">HMR (thay module nóng)</span><span class="v">thay một module vừa đổi trong trang đang chạy mà không tải lại (~100 ms ở đây)</span></div>
<div class="kv"><span class="k">điểm vào (entry point)</span><span class="v"><code>index.html</code> → <code>src/main.tsx</code>, nơi <code>createRoot(...).render(&lt;App /&gt;)</code> khởi động React</span></div>
<div class="kv"><span class="k"><code>tsc -b</code></span><span class="v">kiểm kiểu TypeScript ở chế độ build; không lỗi thì không in gì</span></div>
<div class="kv"><span class="k">dev dependency (<code>-D</code>)</span><span class="v">cần để phát triển và test (Vitest, TypeScript), không gửi xuống trình duyệt</span></div>
<div class="kv"><span class="k">StrictMode</span><span class="v">phép kiểm chỉ khi dev: render component và chạy effect hai lần để lộ bug</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dùng Node 22.12+ (hoặc 24): đó là thứ Vite 8 và Vitest 5 khai trong <code>engines</code>.</li>
<li><code>npm create vite@latest phong-kham -- --template react-ts</code> → Oxlint → No → <code>npm install</code> → <code>npm run dev</code>; 27 gói, máy chủ dev sẵn sàng dưới nửa giây.</li>
<li>Đo so với CRA trên cùng máy: 27 và 1292 gói, 90 và 361 MB, 0 và 28 lỗ hổng đã biết, 0,3 s và 7 s để khởi động.</li>
<li><code>index.html</code> nạp <code>src/main.tsx</code>, file này gọi <code>createRoot(...).render(&lt;App /&gt;)</code>; Vite dịch từng file khi trình duyệt xin.</li>
<li><code>vite build</code> không kiểm kiểu; <code>tsc -b</code> mới kiểm, và <code>npm run build</code> chạy cả hai.</li>
<li>Template không có bộ chạy test: cài Vitest + Testing Library, thêm khối <code>test</code> và <code>afterEach(cleanup)</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Build a React app from Scratch</span><span class="lc-sub">react.dev/learn/build-a-react-app-from-scratch — trang chính thức khuyên dùng <code>npm create vite@latest my-app -- --template react-ts</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — React Developer Tools</span><span class="lc-sub">react.dev/learn/react-developer-tools — link cài cho Chrome, Firefox, Edge, và tab Components cho thấy gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;StrictMode&gt;</span><span class="lc-sub">react.dev/reference/react/StrictMode — render hai lần và effect hai lần khi dev để làm gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vite — Getting Started</span><span class="lc-sub">vite.dev/guide — các template, <code>npm create vite</code>, và vì sao Vite phục vụ ES module gốc khi dev.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — bộ kiểm kiểu bạn vừa gặp</span><span class="lc-sub">/courses/typescript/learn${REF} — <code>tsc</code> kiểm gì, chế độ strict, và cách đọc thông báo lỗi TS.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — JSX, really explained: what it compiles to and what shows up on screen|||0.2 — JSX, giải thích cho rõ: nó thành gì và cái gì hiện lên màn hình',
      slug: 'rx-0-2-jsx',
      type: 'LESSON',
      isFreePreview: true,
      description: 'JSX thành lời gọi hàm (output thật của tsc và Vite), phần tử là object, bốn luật JSX kèm lỗi tsc thật, cái gì hiện ra trong { } (số 0 hiện, true/null biến mất, chuỗi bị thoát), điều kiện, Fragment và lớp phủ lỗi của Vite.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>JSX, really explained: what it compiles to and what shows up on screen</h2>
<p class="lead">JSX is the HTML-looking syntax inside React components. Most tutorials say "it is like HTML" and move on, and then students lose hours to <code>class</code> versus <code>className</code>, a stray <code>0</code> on the page, or "Objects are not valid as a React child". This lesson shows what JSX really is by compiling it and printing the result, then turns each rule into a real error message you will recognise when you meet it.</p>

<p>Every output here was produced on the course machine with TypeScript 6.0.3, React 19.3.0 and Vite 8.3.1. The examples use the clinic project: doctor cards, opening hours, the number of appointments.</p>

<h3>JSX is function calls in disguise</h3>
${slide('rx-00', 18, 'JSX thành lời gọi hàm trước khi tới trình duyệt')}
<p>Take a tiny component that shows one doctor:</p>
<pre><code class="language-tsx">export function TheBacSi() {
  const ten = 'BS. Trần Thu Hà'
  return (
    &lt;div className="the"&gt;
      &lt;h2&gt;{ten}&lt;/h2&gt;
      &lt;p&gt;Nhi · 8 năm&lt;/p&gt;
    &lt;/div&gt;
  )
}</code></pre>
<p>Browsers do not understand <code>&lt;div&gt;</code> inside JavaScript; a JavaScript engine would stop at the first <code>&lt;</code>. Something must translate it first. We asked the TypeScript compiler to do it with the setting the project uses (<code>"jsx": "react-jsx"</code>):</p>
<pre><code class="language-bash">$ npx tsc jsx/the-bac-si.tsx --jsx react-jsx --target es2022 --module esnext --outDir out/moi</code></pre>
<pre><code class="language-js">import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TheBacSi() {
    const ten = 'BS. Trần Thu Hà';
    return (_jsxs("div", { className: "the", children: [_jsx("h2", { children: ten }), _jsx("p", { children: "Nhi \\u00B7 8 n\\u0103m" })] }));
}</code></pre>
<p>Every tag became a call: <code>_jsx(type, props)</code>. The tag name is the first argument (<code>"div"</code>), the attributes become an object (<code>{ className: "the" }</code>), and whatever sits between the tags becomes a prop called <code>children</code> — one child for <code>_jsx</code>, an array for <code>_jsxs</code>. The compiler even added the <code>import</code> of <code>react/jsx-runtime</code> for you. (The <code>\\u0103</code> is just how the compiler writes "ă" in an ASCII-safe way.)</p>
<p>Now compare the <strong>classic runtime</strong>, which is what React used before version 17 and what many FER202 slides still show:</p>
<pre><code class="language-bash">$ npx tsc jsx/the-bac-si.tsx --jsx react --target es2022 --module esnext --outDir out/cu</code></pre>
<div class="out">jsx/the-bac-si.tsx(4,6): error TS2874: This JSX tag requires 'React' to be in scope, but it could not be found.
…</div>
<pre><code class="language-js">export function TheBacSi() {
    const ten = 'BS. Trần Thu Hà';
    return (React.createElement("div", { className: "the" },
        React.createElement("h2", null, ten),
        React.createElement("p", null, "Nhi \\u00B7 8 n\\u0103m")));
}</code></pre>
<p>Same tree, but every tag becomes <code>React.createElement(...)</code>, and nothing imports <code>React</code> — hence the error. That is the whole reason old code starts every file with <code>import React from 'react'</code> even when it never writes the word <code>React</code>: the compiled output needs it. With the new runtime (React 17+, and every Vite template) you do not need that line, and the linter will flag it as unused.</p>
<p>What does Vite itself send to the browser in development? We requested the file from a running dev server:</p>
<pre><code class="language-js">const _jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
…
export function TheBacSi() {
	const ten = "BS. Trần Thu Hà";
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "the",
		children: [/* @__PURE__ */ _jsxDEV("h2", { children: ten }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 5,
			columnNumber: 7
		}, this), …
$RefreshReg$(_c, "TheBacSi");</code></pre>
<p>The development version, <code>jsxDEV</code>, also records the file name, line and column of every tag — that is how an error message or React DevTools can point you at <code>the-bac-si.tsx:5</code>. The last line registers the component for Fast Refresh (HMR that keeps state). In a production build none of that is there; you get the short <code>jsx(...)</code> calls, minified.</p>

<div class="callout"><p><strong>Common interview question.</strong> "What is JSX? Does the browser understand it?"</p>
<p>Answer: JSX is a syntax extension for JavaScript that lets you write UI as tags. The browser never sees it: a compiler (Babel, TypeScript, or Oxc inside Vite) turns each tag into a function call — <code>jsx(type, props)</code> with the new runtime, <code>React.createElement</code> with the classic one — which returns a plain object describing the element. That is why JSX follows JavaScript rules: <code>className</code> instead of <code>class</code>, one root per expression, and only expressions inside curly braces.</p></div>

<h3>An element is just an object</h3>
${slide('rx-00', 19, 'Một phần tử JSX chỉ là một object mô tả')}
<p>If <code>&lt;h1&gt;</code> becomes a function call, what does the call return? We ran it and printed the result:</p>
<pre><code class="language-tsx">const tieuDe = &lt;h1 className="to"&gt;Phòng khám An Tâm&lt;/h1&gt;
console.log('typeof:', typeof tieuDe)
console.log(tieuDe)</code></pre>
<div class="out">typeof: object
{
  '$$typeof': Symbol(react.transitional.element),
  type: 'h1',
  key: null,
  props: { className: 'to', children: 'Phòng khám An Tâm' },
  _owner: null,
  _store: {}
}</div>
<p>A React <strong>element (phần tử)</strong> is a small, plain object: a <code>type</code> (<code>'h1'</code>, or a component function such as <code>TheBacSi</code>), <code>props</code> (including <code>children</code>), and a <code>key</code> (used in lists, Chapter 1). Creating it does not touch the page. No <code>&lt;h1&gt;</code> exists in the DOM yet; this object is a <em>description</em>, and React reads such descriptions, compares them with the previous ones, and only then edits the real DOM (Chapter 2 names this "render then commit", Chapter 11 goes inside it). The <code>$$typeof</code> symbol is a safety mark React uses to recognise real elements — a JSON string from a server cannot contain a Symbol, so it cannot pretend to be an element.</p>
<p>Because an element is a value, you can do with JSX everything you do with values: store it in a variable (<code>const tieuDe = &lt;h1&gt;…&lt;/h1&gt;</code>), return it from a function, put several in an array, pass one as a prop. The word <strong>component</strong> is for the function that returns elements; <strong>element</strong> is for what it returns. Mixing them up is common in interviews; now you can tell them apart.</p>

<h3>Four JSX rules, each with the error you will see</h3>
${slide('rx-00', 20, 'Bốn luật JSX — lỗi tsc thật')}
<p>Every rule follows from "JSX becomes a function call with a props object". We wrote each mistake on purpose and ran <code>tsc</code> (the same check your editor runs while you type).</p>
<p><strong>1. One root element per expression.</strong> A function returns one value; <code>return &lt;h1/&gt;&lt;p/&gt;</code> would be two calls side by side, which is not valid JavaScript.</p>
<pre><code class="language-tsx">export function TrangChu() {
  return (
    &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
    &lt;p&gt;Giờ mở cửa: 07:30&lt;/p&gt;
  )
}</code></pre>
<div class="out">loi/hai-goc.tsx(3,5): error TS2657: JSX expressions must have one parent element.</div>
<p>Fix: wrap them. If you do not want an extra <code>&lt;div&gt;</code> in the DOM, use a <strong>Fragment</strong>, written <code>&lt;&gt;…&lt;/&gt;</code>. It groups children in JSX and leaves nothing in the page. When a fragment needs a <code>key</code> (inside a list), write the long form <code>&lt;Fragment key={id}&gt;</code> with <code>import { Fragment } from 'react'</code>.</p>
<p><strong>2. Attributes are JavaScript property names, mostly camelCase.</strong> <code>class</code> is a reserved word in JavaScript, so React uses the DOM property name <code>className</code>; <code>for</code> becomes <code>htmlFor</code>; events are <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>. TypeScript knows every valid attribute of every tag:</p>
<pre><code class="language-tsx">export function Nut() {
  return &lt;button class="nut" onclick={() =&gt; alert('Đặt lịch')}&gt;Đặt lịch&lt;/button&gt;
}</code></pre>
<div class="out">loi/class.tsx(2,18): error TS2322: Type '{ children: string; class: string; onclick: () =&gt; void; }' is not assignable to type 'DetailedHTMLProps&lt;ButtonHTMLAttributes&lt;HTMLButtonElement&gt;, HTMLButtonElement&gt;'.
  Property 'class' does not exist on type 'DetailedHTMLProps&lt;ButtonHTMLAttributes&lt;HTMLButtonElement&gt;, HTMLButtonElement&gt;'. Did you mean 'className'?</div>
<p>Read long TypeScript errors from the end: the last line — "Did you mean 'className'?" — is the useful one. Exceptions to camelCase: <code>aria-*</code> and <code>data-*</code> attributes keep their dashes (<code>aria-label</code>, <code>data-id</code>).</p>
<p><strong>3. Every tag must be closed.</strong> HTML forgives <code>&lt;img&gt;</code> and <code>&lt;br&gt;</code>; JSX does not, because the compiler must know where the function call ends.</p>
<pre><code class="language-tsx">export function Anh() {
  return &lt;img src="/logo.png" alt="Logo"&gt;
}</code></pre>
<div class="out">loi/the-mo.tsx(2,11): error TS17008: JSX element 'img' has no corresponding closing tag.
loi/the-mo.tsx(3,1): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?
loi/the-mo.tsx(4,1): error TS1005: '&lt;/' expected.</div>
<p>One missing slash, three errors — the first is the real one. Fix: <code>&lt;img src="/logo.png" alt="Logo" /&gt;</code>. Any tag can self-close, including components: <code>&lt;TheBacSi /&gt;</code>.</p>
<p><strong>4. Curly braces take an expression, not a statement.</strong> Inside <code>{ }</code> you can put anything that produces a value: a variable, <code>1 + 1</code>, a function call, a ternary <code>a ? b : c</code>, <code>array.map(...)</code>. You cannot put <code>if</code>, <code>for</code> or <code>const</code>, because the braces become one argument of a function call:</p>
<pre><code class="language-tsx">export function TrangThai({ mo }: { mo: boolean }) {
  return &lt;p&gt;{if (mo) { 'Đang mở' } else { 'Đã đóng' }}&lt;/p&gt;
}</code></pre>
<div class="out">loi/if.tsx(2,14): error TS1109: Expression expected.
loi/if.tsx(2,54): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?</div>
<p>Fix: <code>&lt;p&gt;{mo ? 'Đang mở' : 'Đã đóng'}&lt;/p&gt;</code>, or compute before <code>return</code> with a normal <code>if</code>. The same rule explains the <code>style</code> attribute: it takes a JavaScript object, not a CSS string.</p>
<pre><code class="language-tsx">return &lt;div style="color: red"&gt;Nghỉ&lt;/div&gt;</code></pre>
<div class="out">loi/style.tsx(2,15): error TS2559: Type 'string' has no properties in common with type 'Properties&lt;string | number, string &amp; {}&gt;'.</div>
<p>Fix: <code>style={{ color: 'red' }}</code>. The outer braces mean "a JavaScript expression", the inner ones are the object; CSS properties are camelCase (<code>backgroundColor</code>, <code>fontSize</code>), and numbers are pixels (<code>{{ marginTop: 8 }}</code>). Comments inside JSX are expressions too: <code>{/* ghi chú */}</code>.</p>

<h3>What shows up inside { }</h3>
${slide('rx-00', 21, 'Trong { }: số 0 hiện ra, true/false/null biến mất')}
<p>The rules above are about compiling. This part is about rendering: which values actually appear on the page. We rendered each case to HTML with <code>renderToStaticMarkup</code> (a function from <code>react-dom/server</code> that returns the HTML React would produce):</p>
<pre><code class="language-tsx">const soLichHen = 0
const ds: string[] = []
console.log('A', renderToStaticMarkup(&lt;p&gt;{soLichHen &amp;&amp; &lt;b&gt;Có lịch&lt;/b&gt;}&lt;/p&gt;))
console.log('B', renderToStaticMarkup(&lt;p&gt;{soLichHen &gt; 0 &amp;&amp; &lt;b&gt;Có lịch&lt;/b&gt;}&lt;/p&gt;))
console.log('C', renderToStaticMarkup(&lt;p&gt;{true}{false}{null}{undefined}&lt;/p&gt;))
console.log('D', renderToStaticMarkup(&lt;p&gt;{ds.length ? ds.join(', ') : 'Chưa có ai'}&lt;/p&gt;))
console.log('E', renderToStaticMarkup(&lt;p&gt;{'&lt;b&gt;đậm?&lt;/b&gt;'}&lt;/p&gt;))
console.log('F', renderToStaticMarkup(&lt;ul&gt;{['Nội', 'Nhi'].map((t) =&gt; &lt;li key={t}&gt;{t}&lt;/li&gt;)}&lt;/ul&gt;))</code></pre>
<div class="out">A &lt;p&gt;0&lt;/p&gt;
B &lt;p&gt;&lt;/p&gt;
C &lt;p&gt;&lt;/p&gt;
D &lt;p&gt;Chưa có ai&lt;/p&gt;
E &lt;p&gt;&amp;lt;b&amp;gt;đậm?&amp;lt;/b&amp;gt;&lt;/p&gt;
F &lt;ul&gt;&lt;li&gt;Nội&lt;/li&gt;&lt;li&gt;Nhi&lt;/li&gt;&lt;/ul&gt;</div>
<ul>
<li><strong>Strings and numbers</strong> render as text. <strong>Arrays</strong> render each item (F) — that is how lists work; every item needs a <code>key</code> (Chapter 1).</li>
<li><strong><code>true</code>, <code>false</code>, <code>null</code>, <code>undefined</code></strong> render nothing (C). This is what makes conditions like <code>{coLoi &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> work: when <code>coLoi</code> is <code>false</code>, the expression is <code>false</code>, and nothing is drawn.</li>
<li><strong>The number <code>0</code> is drawn</strong> (A). <code>a &amp;&amp; b</code> returns <code>a</code> itself when <code>a</code> is falsy, and <code>0</code> is falsy — so the expression is <code>0</code>, and 0 is a number, and numbers render. Case B, with a real boolean on the left, draws nothing.</li>
<li><strong>Strings are escaped</strong> (E). A string containing <code>&lt;b&gt;</code> is shown as those characters, never interpreted as HTML. This is React protecting you from XSS (cross-site scripting): text typed by a user cannot inject tags. Chapter 13 covers the one escape hatch, <code>dangerouslySetInnerHTML</code>, and how to use it safely.</li>
</ul>
<p>And the one value that cannot be rendered at all — a plain object:</p>
<pre><code class="language-tsx">const bacSi = { ten: 'BS. Trần Thu Hà', namKinhNghiem: 8 }
renderToStaticMarkup(&lt;p&gt;{bacSi}&lt;/p&gt;)</code></pre>
<div class="out">Objects are not valid as a React child (found: object with keys {ten, namKinhNghiem}). If you meant to render a collection of children, use an array instead.</div>
<p>React cannot guess how to show an object; you pick the fields: <code>&lt;p&gt;{bacSi.ten} · {bacSi.namKinhNghiem} năm&lt;/p&gt;</code> rendered <code>&lt;p&gt;BS. Trần Thu Hà · 8 năm&lt;/p&gt;</code>. With TypeScript you rarely reach the runtime error, because the editor already says <code>error TS2322: Type '{ ten: string; namKinhNghiem: number; }' is not assignable to type 'ReactNode'.</code> A <strong>ReactNode</strong> is the type of "anything React can render": strings, numbers, elements, arrays of those, and the four "nothing" values.</p>

<div class="pitfall co-tieu-de"><strong>Trap — the stray 0 in the header.</strong> A common real bug: <code>{soLichHen &amp;&amp; &lt;span className="huy-hieu"&gt;{soLichHen}&lt;/span&gt;}</code> in a navigation bar. It works in every demo, because the demo account has appointments. A new user with no appointments sees a lonely "0" next to the menu. The test in this lesson&#39;s 🧪 reproduces it (<code>expect(container.innerHTML).toBe('&lt;p&gt;0&lt;/p&gt;')</code> passes). The fix is always the same: make the left side a real boolean — <code>soLichHen &gt; 0 &amp;&amp;</code>, <code>ds.length &gt; 0 &amp;&amp;</code>, or <code>Boolean(x) &amp;&amp;</code>. react.dev&#39;s page on conditional rendering calls this out with exactly the same example.</div>

<h3>Conditions: three patterns and when to use each</h3>
<p>You now have all the pieces for conditional UI. Three patterns cover almost everything:</p>
<pre><code class="language-tsx">function GioMoCua({ gio }: { gio: string }) {
  // 1. if before return — for whole different screens, or "render nothing"
  if (gio === '') return null

  return (
    &lt;p&gt;
      {/* 2. ternary — choose between TWO things */}
      {gio === 'Nghỉ' ? &lt;strong className="nghi"&gt;Nghỉ&lt;/strong&gt; : gio}
      {/* 3. &amp;&amp; — show ONE thing or nothing; left side must be a boolean */}
      {gio === 'Nghỉ' &amp;&amp; ' (hẹn trước qua điện thoại)'}
    &lt;/p&gt;
  )
}</code></pre>
<ul>
<li><strong><code>if</code> + early <code>return</code></strong> — when the whole output differs (loading screen, empty state, "not found"). Returning <code>null</code> renders nothing.</li>
<li><strong>Ternary <code>cond ? A : B</code></strong> — when you choose between two outputs in the middle of JSX.</li>
<li><strong><code>cond &amp;&amp; A</code></strong> — when you show one thing or nothing. Keep <code>cond</code> a boolean.</li>
</ul>
<p>Nested ternaries (<code>a ? x : b ? y : z</code>) are legal but hard to read; once you need a third branch, move the logic into a variable or a small component. The home page you build in Lesson 0.3 uses the ternary pattern for the red "Nghỉ" cell: <code>className={dong.gio === 'Nghỉ' ? 'nghi' : undefined}</code> — <code>undefined</code> means "no attribute at all".</p>

<h3>When JSX does not even parse: Vite&#39;s error overlay</h3>
${slide('rx-00', 22, 'Lớp phủ lỗi của Vite — ảnh chụp thật')}
<p>Type errors show up in the editor and in <code>tsc</code>. Syntax errors — JSX the parser cannot understand — also show up right in the browser. We removed one slash from an <code>&lt;img /&gt;</code> in the clinic home page with the dev server running; the screenshot on the slide is what the page turned into. The overlay header says <code>[plugin:vite:oxc] Transform failed with 4 errors</code>, and the first error points exactly at the unclosed tag, with "Opened here" under <code>&lt;img</code> and "Expected <code>&lt;/img&gt;</code>" where the parser gave up.</p>
<p>How to read it: one mistake produced four errors, because after a broken tag the parser misreads everything that follows (<code>section</code>, <code>main</code>…). Always fix the <strong>first</strong> error, save, and look again; the others usually disappear. The overlay is Vite&#39;s (the Oxc transformer inside the React plugin), not React&#39;s, and it vanishes by itself as soon as the file compiles again.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p><code>import React from 'react'</code> at the top of every <code>.js</code> file, JSX inside a class component&#39;s <code>render()</code> method, PropTypes to check props when the app runs → <code>.tsx</code> files with no <code>React</code> import (the automatic JSX runtime adds what it needs), function components that return JSX directly, and TypeScript that rejects <code>class=</code>, a missing closing tag or an object child before you save · <em>Why:</em> the classic runtime genuinely needed <code>React</code> in scope (you saw error TS2874 without it); since React 17 the compiler imports <code>react/jsx-runtime</code> itself. In an older project you will still see <code>import React</code> everywhere — it is harmless there; do not add it to new code.</p></div>

<div class="callout"><p><strong>Common interview question.</strong> "What is a Fragment and why not just use a div?"</p>
<p>Answer: a component must return one root, and a Fragment (<code>&lt;&gt;…&lt;/&gt;</code>) groups several children without adding a DOM node. An extra <code>div</code> can break layouts (a flex or grid container expects its direct children), create invalid HTML (a <code>div</code> inside <code>&lt;tr&gt;</code> or <code>&lt;ul&gt;</code>) and adds noise to the DOM. Use the long form <code>&lt;Fragment key={…}&gt;</code> when it needs a key in a list.</p></div>

<h3>Run it step by step: from an HTML mock-up to JSX</h3>
<p>Designers and old pages hand you HTML. Converting it is a mechanical job once you know the four rules. Here is the opening-hours box as plain HTML:</p>
<pre><code class="language-html">&lt;section class="o-thong-tin"&gt;
  &lt;h2&gt;Giờ mở cửa&lt;/h2&gt;
  &lt;!-- bảng giờ --&gt;
  &lt;table&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Thứ 2 – Thứ 6&lt;/th&gt;&lt;td&gt;07:30 – 19:00&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Thứ 7&lt;/th&gt;&lt;td&gt;07:30 – 12:00&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Chủ nhật&lt;/th&gt;&lt;td class="nghi" style="font-weight: 600"&gt;Nghỉ&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/section&gt;</code></pre>
<ol>
<li><code>class</code> → <code>className</code> everywhere.</li>
<li>HTML comments <code>&lt;!-- --&gt;</code> → <code>{/* bảng giờ */}</code>.</li>
<li><code>style="font-weight: 600"</code> → <code>style={{ fontWeight: 600 }}</code> (or better, move it into the CSS class).</li>
<li>Add <code>&lt;tbody&gt;</code>: browsers insert it silently in HTML, but React builds exactly what you write. Without it, React 19.3 printed (we checked): <code>In HTML, &lt;tr&gt; cannot be a child of &lt;table&gt;. Add a &lt;tbody&gt;, &lt;thead&gt; or &lt;tfoot&gt; to your code to match the DOM tree generated by the browser.</code></li>
<li>Replace the three repeated rows with data + <code>map</code>, so a new opening time is one line of data instead of copied markup.</li>
</ol>
<p>The result is the real code of the project&#39;s home page (type-checked, tested):</p>
<pre><code class="language-tsx">const GIO_MO_CUA = [
  { thu: 'Thứ 2 – Thứ 6', gio: '07:30 – 19:00' },
  { thu: 'Thứ 7', gio: '07:30 – 12:00' },
  { thu: 'Chủ nhật', gio: 'Nghỉ' },
]

&lt;section className="o-thong-tin"&gt;
  &lt;h2&gt;Giờ mở cửa&lt;/h2&gt;
  &lt;table&gt;
    &lt;tbody&gt;
      {GIO_MO_CUA.map((dong) =&gt; (
        &lt;tr key={dong.thu}&gt;
          &lt;th scope="row"&gt;{dong.thu}&lt;/th&gt;
          &lt;td className={dong.gio === 'Nghỉ' ? 'nghi' : undefined}&gt;{dong.gio}&lt;/td&gt;
        &lt;/tr&gt;
      ))}
    &lt;/tbody&gt;
  &lt;/table&gt;
&lt;/section&gt;</code></pre>
<div class="callout"><p><strong>JS quick reminder: <code>(dong) =&gt; ( … )</code>.</strong> An arrow function. <code>map</code> calls it once per item of the array and collects what it returns into a new array — here, an array of <code>&lt;tr&gt;</code> elements, which JSX renders one after another. The round brackets after <code>=&gt;</code> mean "return this expression" (no <code>return</code> keyword needed). Lesson 0.3 runs <code>map</code>, <code>filter</code> and friends on the doctor list.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> prove the three rendering rules with a test instead of trusting this page. Work in your <code>phong-kham</code> project (with Vitest set up as in Lesson 0.1).</p><ol>
<li>Create <code>src/thu-jsx.test.tsx</code>. Import <code>render</code> from <code>@testing-library/react</code> and <code>expect, test</code> from <code>vitest</code>.</li>
<li>Test 1: <code>const soLichHen: number = 0</code>, render <code>&lt;p&gt;{soLichHen &amp;&amp; &lt;b&gt;Có lịch&lt;/b&gt;}&lt;/p&gt;</code>, take <code>container</code> from the result of <code>render</code>, and expect <code>container.innerHTML</code> to be <code>'&lt;p&gt;0&lt;/p&gt;'</code>.</li>
<li>Test 2: the same with <code>soLichHen &gt; 0 &amp;&amp;</code>; expect <code>'&lt;p&gt;&lt;/p&gt;'</code>.</li>
<li>Test 3: render <code>&lt;p&gt;{'&lt;b&gt;đậm?&lt;/b&gt;'}&lt;/p&gt;</code> and expect the escaped HTML <code>'&lt;p&gt;&amp;lt;b&amp;gt;đậm?&amp;lt;/b&amp;gt;&lt;/p&gt;'</code>.</li>
<li>Run <code>npx vitest run src/thu-jsx.test.tsx</code>, then write <code>{bacSi}</code> (an object) inside a <code>&lt;p&gt;</code> in the same file and run <code>npx tsc -b</code>.</li>
</ol><p><strong>Done when:</strong> Vitest prints <code>Tests  3 passed (3)</code> (our run: 17 ms, 2 ms, 3 ms), and <code>tsc -b</code> reports <code>TS2322 … not assignable to type 'ReactNode'</code> for the object line. Delete the object line afterwards.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">JSX</span><span class="v">tag syntax inside JavaScript; compiled to <code>jsx(type, props)</code> calls before the browser sees it</span></div>
<div class="kv"><span class="k">element (phần tử)</span><span class="v">the plain object a JSX tag produces: <code>type</code>, <code>props</code>, <code>key</code></span></div>
<div class="kv"><span class="k">JSX runtime</span><span class="v"><code>react/jsx-runtime</code>: the "new" automatic runtime since React 17; the classic one used <code>React.createElement</code></span></div>
<div class="kv"><span class="k">Fragment</span><span class="v"><code>&lt;&gt;…&lt;/&gt;</code>: groups children without adding a DOM node</span></div>
<div class="kv"><span class="k"><code>children</code></span><span class="v">the prop holding whatever is between the opening and closing tag</span></div>
<div class="kv"><span class="k">ReactNode</span><span class="v">the type of anything renderable: string, number, element, array, <code>null</code>/<code>undefined</code>/boolean</span></div>
<div class="kv"><span class="k">escaping (thoát)</span><span class="v">React shows strings as text, never as HTML — protection against XSS</span></div>
<div class="kv"><span class="k">error overlay</span><span class="v">Vite&#39;s full-page error display for code that fails to compile in dev</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>JSX compiles to function calls: <code>_jsx("div", { className, children })</code> (new runtime) or <code>React.createElement</code> (classic, needs <code>import React</code>).</li>
<li>A JSX tag produces a plain object (an element) — a description, not DOM.</li>
<li>Four rules: one root (or a Fragment), camelCase attributes (<code>className</code>, <code>onClick</code>), every tag closed, only expressions in <code>{ }</code> (<code>style</code> takes an object).</li>
<li>In <code>{ }</code>: strings, numbers and arrays render; <code>true/false/null/undefined</code> render nothing; <code>0</code> renders; objects throw; strings are escaped.</li>
<li>Conditions: <code>if</code> + early return, ternary for two options, <code>&amp;&amp;</code> with a real boolean for one option.</li>
<li>Read the first error first — in <code>tsc</code> output and in Vite&#39;s overlay.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Writing Markup with JSX</span><span class="lc-sub">react.dev/learn/writing-markup-with-jsx — the rules of JSX (single root, close all tags, camelCase) and why they exist.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — JavaScript in JSX with Curly Braces</span><span class="lc-sub">react.dev/learn/javascript-in-jsx-with-curly-braces — where braces are allowed, and "double curlies" for <code>style</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Conditional Rendering</span><span class="lc-sub">react.dev/learn/conditional-rendering — <code>if</code>, <code>? :</code>, <code>&amp;&amp;</code>, and the "don&#39;t put numbers on the left side of &amp;&amp;" warning.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;Fragment&gt;</span><span class="lc-sub">react.dev/reference/react/Fragment — the short and long syntax, and fragments with keys.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — HTML you will convert to JSX</span><span class="lc-sub">/courses/web-foundations/learn${REF} — semantic HTML (tables, headings, lists) that Lesson 0.2 turns into components.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>JSX, giải thích cho rõ: nó thành gì và cái gì hiện lên màn hình</h2>
<p class="lead">JSX là cú pháp trông như HTML bên trong component React. Phần lớn bài hướng dẫn nói "nó giống HTML" rồi đi tiếp, để rồi sinh viên mất hàng giờ vì <code>class</code> với <code>className</code>, một số <code>0</code> lạc trên trang, hay "Objects are not valid as a React child". Bài này cho thấy JSX thật ra là gì bằng cách biên dịch nó và in kết quả, rồi biến mỗi luật thành một thông báo lỗi thật mà bạn sẽ nhận ra khi gặp.</p>

<p>Mọi output ở đây được tạo trên máy soạn bài với TypeScript 6.0.3, React 19.3.0 và Vite 8.3.1. Ví dụ dùng dự án phòng khám: thẻ bác sĩ, giờ mở cửa, số lịch hẹn.</p>

<h3>JSX là lời gọi hàm đội lốt</h3>
${slide('rx-00', 18, 'JSX thành lời gọi hàm trước khi tới trình duyệt')}
<p>Lấy một component nhỏ hiển thị một bác sĩ:</p>
<pre><code class="language-tsx">export function TheBacSi() {
  const ten = 'BS. Trần Thu Hà'
  return (
    &lt;div className="the"&gt;
      &lt;h2&gt;{ten}&lt;/h2&gt;
      &lt;p&gt;Nhi · 8 năm&lt;/p&gt;
    &lt;/div&gt;
  )
}</code></pre>
<p>Trình duyệt không hiểu <code>&lt;div&gt;</code> nằm trong JavaScript; bộ máy JavaScript sẽ dừng ngay ở dấu <code>&lt;</code> đầu tiên. Phải có thứ dịch nó trước. Chúng tôi nhờ trình biên dịch TypeScript làm việc đó với đúng cấu hình dự án dùng (<code>"jsx": "react-jsx"</code>):</p>
<pre><code class="language-bash">$ npx tsc jsx/the-bac-si.tsx --jsx react-jsx --target es2022 --module esnext --outDir out/moi</code></pre>
<pre><code class="language-js">import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function TheBacSi() {
    const ten = 'BS. Trần Thu Hà';
    return (_jsxs("div", { className: "the", children: [_jsx("h2", { children: ten }), _jsx("p", { children: "Nhi \\u00B7 8 n\\u0103m" })] }));
}</code></pre>
<p>Mỗi thẻ thành một lời gọi: <code>_jsx(type, props)</code>. Tên thẻ là đối số đầu (<code>"div"</code>), các thuộc tính thành một object (<code>{ className: "the" }</code>), và thứ nằm giữa thẻ mở và thẻ đóng thành một prop tên là <code>children</code> — một con thì dùng <code>_jsx</code>, một mảng thì dùng <code>_jsxs</code>. Trình biên dịch còn tự thêm dòng <code>import</code> từ <code>react/jsx-runtime</code> cho bạn. (<code>\\u0103</code> chỉ là cách trình biên dịch viết chữ "ă" cho an toàn với bảng mã ASCII.)</p>
<p>Giờ so với <strong>runtime cổ điển</strong> — thứ React dùng trước bản 17, và thứ nhiều slide FER202 vẫn còn:</p>
<pre><code class="language-bash">$ npx tsc jsx/the-bac-si.tsx --jsx react --target es2022 --module esnext --outDir out/cu</code></pre>
<div class="out">jsx/the-bac-si.tsx(4,6): error TS2874: This JSX tag requires 'React' to be in scope, but it could not be found.
…</div>
<pre><code class="language-js">export function TheBacSi() {
    const ten = 'BS. Trần Thu Hà';
    return (React.createElement("div", { className: "the" },
        React.createElement("h2", null, ten),
        React.createElement("p", null, "Nhi \\u00B7 8 n\\u0103m")));
}</code></pre>
<p>Cùng một cây, nhưng mỗi thẻ thành <code>React.createElement(...)</code>, và chẳng có dòng nào import <code>React</code> — nên mới có lỗi. Đó là toàn bộ lý do code cũ mở đầu mọi file bằng <code>import React from 'react'</code> dù không hề viết chữ <code>React</code>: output đã biên dịch cần nó. Với runtime mới (React 17+, và mọi template Vite), bạn không cần dòng đó, và linter sẽ báo nó là thừa.</p>
<p>Chính Vite gửi gì xuống trình duyệt khi phát triển? Chúng tôi xin file đó từ một máy chủ dev đang chạy:</p>
<pre><code class="language-js">const _jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
…
export function TheBacSi() {
	const ten = "BS. Trần Thu Hà";
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "the",
		children: [/* @__PURE__ */ _jsxDEV("h2", { children: ten }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 5,
			columnNumber: 7
		}, this), …
$RefreshReg$(_c, "TheBacSi");</code></pre>
<p>Bản dành cho dev, <code>jsxDEV</code>, còn ghi tên file, dòng và cột của từng thẻ — nhờ vậy thông báo lỗi hay React DevTools chỉ được cho bạn tới <code>the-bac-si.tsx:5</code>. Dòng cuối đăng ký component cho Fast Refresh (HMR giữ nguyên state). Ở bản build production không còn những thứ đó; bạn nhận các lời gọi <code>jsx(...)</code> ngắn, đã nén.</p>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "JSX là gì? Trình duyệt có hiểu JSX không?"</p>
<p>Ý trả lời: JSX là phần mở rộng cú pháp của JavaScript cho phép viết giao diện dạng thẻ. Trình duyệt không bao giờ thấy nó: một trình biên dịch (Babel, TypeScript, hoặc Oxc bên trong Vite) biến mỗi thẻ thành một lời gọi hàm — <code>jsx(type, props)</code> với runtime mới, <code>React.createElement</code> với runtime cổ điển — trả về một object thường mô tả phần tử. Vì vậy JSX theo luật của JavaScript: <code>className</code> thay cho <code>class</code>, mỗi biểu thức một gốc, và trong ngoặc nhọn chỉ có biểu thức.</p></div>

<h3>Một phần tử chỉ là một object</h3>
${slide('rx-00', 19, 'Một phần tử JSX chỉ là một object mô tả')}
<p>Nếu <code>&lt;h1&gt;</code> thành một lời gọi hàm, lời gọi đó trả về gì? Chúng tôi chạy và in kết quả:</p>
<pre><code class="language-tsx">const tieuDe = &lt;h1 className="to"&gt;Phòng khám An Tâm&lt;/h1&gt;
console.log('typeof:', typeof tieuDe)
console.log(tieuDe)</code></pre>
<div class="out">typeof: object
{
  '$$typeof': Symbol(react.transitional.element),
  type: 'h1',
  key: null,
  props: { className: 'to', children: 'Phòng khám An Tâm' },
  _owner: null,
  _store: {}
}</div>
<p>Một <strong>element (phần tử)</strong> React là một object nhỏ, thường: có <code>type</code> (<code>'h1'</code>, hoặc một hàm component như <code>TheBacSi</code>), <code>props</code> (gồm cả <code>children</code>), và <code>key</code> (dùng trong danh sách, Chương 1). Tạo nó ra không đụng gì tới trang. Chưa có thẻ <code>&lt;h1&gt;</code> nào trong DOM; object này là một <em>bản mô tả</em>, và React đọc những bản mô tả đó, so với bản trước, rồi mới sửa DOM thật (Chương 2 gọi là "render rồi commit", Chương 11 đi vào bên trong). Symbol <code>$$typeof</code> là dấu an toàn React dùng để nhận ra phần tử thật — một chuỗi JSON từ server không thể chứa Symbol, nên không giả làm phần tử được.</p>
<p>Vì phần tử là một giá trị, JSX làm được mọi thứ bạn làm với giá trị: gán vào biến (<code>const tieuDe = &lt;h1&gt;…&lt;/h1&gt;</code>), trả về từ hàm, xếp nhiều cái vào mảng, truyền làm prop. Chữ <strong>component</strong> dành cho hàm trả về phần tử; <strong>element</strong> là thứ nó trả về. Phỏng vấn hay có người lẫn hai chữ này; giờ bạn phân biệt được.</p>

<h3>Bốn luật JSX, luật nào cũng kèm lỗi bạn sẽ thấy</h3>
${slide('rx-00', 20, 'Bốn luật JSX — lỗi tsc thật')}
<p>Luật nào cũng suy ra từ "JSX thành lời gọi hàm có một object props". Chúng tôi cố ý viết sai từng chỗ rồi chạy <code>tsc</code> (đúng phép kiểm mà trình soạn thảo chạy trong lúc bạn gõ).</p>
<p><strong>1. Mỗi biểu thức một phần tử gốc.</strong> Một hàm trả về một giá trị; <code>return &lt;h1/&gt;&lt;p/&gt;</code> sẽ là hai lời gọi đứng cạnh nhau, không phải JavaScript hợp lệ.</p>
<pre><code class="language-tsx">export function TrangChu() {
  return (
    &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
    &lt;p&gt;Giờ mở cửa: 07:30&lt;/p&gt;
  )
}</code></pre>
<div class="out">loi/hai-goc.tsx(3,5): error TS2657: JSX expressions must have one parent element.</div>
<p>Sửa: bọc chúng lại. Không muốn thêm một <code>&lt;div&gt;</code> vào DOM thì dùng <strong>Fragment</strong>, viết là <code>&lt;&gt;…&lt;/&gt;</code>. Nó gom các con trong JSX và không để lại gì trên trang. Khi fragment cần <code>key</code> (trong danh sách), viết dạng dài <code>&lt;Fragment key={id}&gt;</code> với <code>import { Fragment } from 'react'</code>.</p>
<p><strong>2. Thuộc tính là tên thuộc tính JavaScript, phần lớn viết camelCase.</strong> <code>class</code> là từ khoá dành riêng của JavaScript, nên React dùng tên thuộc tính DOM <code>className</code>; <code>for</code> thành <code>htmlFor</code>; sự kiện là <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>. TypeScript biết mọi thuộc tính hợp lệ của mọi thẻ:</p>
<pre><code class="language-tsx">export function Nut() {
  return &lt;button class="nut" onclick={() =&gt; alert('Đặt lịch')}&gt;Đặt lịch&lt;/button&gt;
}</code></pre>
<div class="out">loi/class.tsx(2,18): error TS2322: Type '{ children: string; class: string; onclick: () =&gt; void; }' is not assignable to type 'DetailedHTMLProps&lt;ButtonHTMLAttributes&lt;HTMLButtonElement&gt;, HTMLButtonElement&gt;'.
  Property 'class' does not exist on type 'DetailedHTMLProps&lt;ButtonHTMLAttributes&lt;HTMLButtonElement&gt;, HTMLButtonElement&gt;'. Did you mean 'className'?</div>
<p>Đọc lỗi TypeScript dài từ cuối lên: dòng cuối — "Did you mean 'className'?" — mới là dòng có ích. Ngoại lệ của camelCase: thuộc tính <code>aria-*</code> và <code>data-*</code> giữ dấu gạch ngang (<code>aria-label</code>, <code>data-id</code>).</p>
<p><strong>3. Thẻ nào cũng phải đóng.</strong> HTML bỏ qua cho <code>&lt;img&gt;</code> và <code>&lt;br&gt;</code>; JSX thì không, vì trình biên dịch phải biết lời gọi hàm kết thúc ở đâu.</p>
<pre><code class="language-tsx">export function Anh() {
  return &lt;img src="/logo.png" alt="Logo"&gt;
}</code></pre>
<div class="out">loi/the-mo.tsx(2,11): error TS17008: JSX element 'img' has no corresponding closing tag.
loi/the-mo.tsx(3,1): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?
loi/the-mo.tsx(4,1): error TS1005: '&lt;/' expected.</div>
<p>Thiếu một dấu gạch chéo, ra ba lỗi — lỗi đầu mới là lỗi thật. Sửa: <code>&lt;img src="/logo.png" alt="Logo" /&gt;</code>. Thẻ nào cũng tự đóng được, kể cả component: <code>&lt;TheBacSi /&gt;</code>.</p>
<p><strong>4. Ngoặc nhọn nhận biểu thức, không nhận câu lệnh.</strong> Trong <code>{ }</code> bạn đặt được mọi thứ tạo ra giá trị: một biến, <code>1 + 1</code>, lời gọi hàm, toán tử ba ngôi <code>a ? b : c</code>, <code>array.map(...)</code>. Không đặt được <code>if</code>, <code>for</code> hay <code>const</code>, vì ngoặc nhọn trở thành một đối số của lời gọi hàm:</p>
<pre><code class="language-tsx">export function TrangThai({ mo }: { mo: boolean }) {
  return &lt;p&gt;{if (mo) { 'Đang mở' } else { 'Đã đóng' }}&lt;/p&gt;
}</code></pre>
<div class="out">loi/if.tsx(2,14): error TS1109: Expression expected.
loi/if.tsx(2,54): error TS1381: Unexpected token. Did you mean &#96;{'}'}&#96; or &#96;&amp;rbrace;&#96;?</div>
<p>Sửa: <code>&lt;p&gt;{mo ? 'Đang mở' : 'Đã đóng'}&lt;/p&gt;</code>, hoặc tính trước <code>return</code> bằng một <code>if</code> bình thường. Cùng luật này giải thích thuộc tính <code>style</code>: nó nhận một object JavaScript, không nhận chuỗi CSS.</p>
<pre><code class="language-tsx">return &lt;div style="color: red"&gt;Nghỉ&lt;/div&gt;</code></pre>
<div class="out">loi/style.tsx(2,15): error TS2559: Type 'string' has no properties in common with type 'Properties&lt;string | number, string &amp; {}&gt;'.</div>
<p>Sửa: <code>style={{ color: 'red' }}</code>. Cặp ngoặc ngoài nghĩa là "một biểu thức JavaScript", cặp trong là object; thuộc tính CSS viết camelCase (<code>backgroundColor</code>, <code>fontSize</code>), và số là pixel (<code>{{ marginTop: 8 }}</code>). Chú thích trong JSX cũng là biểu thức: <code>{/* ghi chú */}</code>.</p>

<h3>Cái gì hiện ra trong { }</h3>
${slide('rx-00', 21, 'Trong { }: số 0 hiện ra, true/false/null biến mất')}
<p>Các luật trên là chuyện biên dịch. Phần này là chuyện render: giá trị nào thật sự hiện lên trang. Chúng tôi render từng trường hợp ra HTML bằng <code>renderToStaticMarkup</code> (một hàm của <code>react-dom/server</code> trả về đúng đoạn HTML mà React sẽ tạo):</p>
<pre><code class="language-tsx">const soLichHen = 0
const ds: string[] = []
console.log('A', renderToStaticMarkup(&lt;p&gt;{soLichHen &amp;&amp; &lt;b&gt;Có lịch&lt;/b&gt;}&lt;/p&gt;))
console.log('B', renderToStaticMarkup(&lt;p&gt;{soLichHen &gt; 0 &amp;&amp; &lt;b&gt;Có lịch&lt;/b&gt;}&lt;/p&gt;))
console.log('C', renderToStaticMarkup(&lt;p&gt;{true}{false}{null}{undefined}&lt;/p&gt;))
console.log('D', renderToStaticMarkup(&lt;p&gt;{ds.length ? ds.join(', ') : 'Chưa có ai'}&lt;/p&gt;))
console.log('E', renderToStaticMarkup(&lt;p&gt;{'&lt;b&gt;đậm?&lt;/b&gt;'}&lt;/p&gt;))
console.log('F', renderToStaticMarkup(&lt;ul&gt;{['Nội', 'Nhi'].map((t) =&gt; &lt;li key={t}&gt;{t}&lt;/li&gt;)}&lt;/ul&gt;))</code></pre>
<div class="out">A &lt;p&gt;0&lt;/p&gt;
B &lt;p&gt;&lt;/p&gt;
C &lt;p&gt;&lt;/p&gt;
D &lt;p&gt;Chưa có ai&lt;/p&gt;
E &lt;p&gt;&amp;lt;b&amp;gt;đậm?&amp;lt;/b&amp;gt;&lt;/p&gt;
F &lt;ul&gt;&lt;li&gt;Nội&lt;/li&gt;&lt;li&gt;Nhi&lt;/li&gt;&lt;/ul&gt;</div>
<ul>
<li><strong>Chuỗi và số</strong> hiện thành chữ. <strong>Mảng</strong> hiện từng phần tử (F) — danh sách hoạt động nhờ vậy; phần tử nào cũng cần <code>key</code> (Chương 1).</li>
<li><strong><code>true</code>, <code>false</code>, <code>null</code>, <code>undefined</code></strong> không hiện gì (C). Nhờ thế điều kiện kiểu <code>{coLoi &amp;&amp; &lt;p&gt;…&lt;/p&gt;}</code> mới chạy: khi <code>coLoi</code> là <code>false</code>, cả biểu thức là <code>false</code>, và không có gì được vẽ.</li>
<li><strong>Số <code>0</code> thì được vẽ</strong> (A). <code>a &amp;&amp; b</code> trả về chính <code>a</code> khi <code>a</code> là falsy, mà <code>0</code> là falsy — nên biểu thức bằng <code>0</code>, 0 là số, và số thì được vẽ. Trường hợp B, vế trái là boolean thật, không vẽ gì.</li>
<li><strong>Chuỗi bị thoát (escape)</strong> (E). Chuỗi chứa <code>&lt;b&gt;</code> được hiện đúng từng ký tự, không bao giờ được hiểu là HTML. Đây là React bảo vệ bạn khỏi XSS (cross-site scripting): chữ người dùng gõ vào không thể chèn thẻ. Chương 13 nói về cửa thoát duy nhất, <code>dangerouslySetInnerHTML</code>, và cách dùng nó an toàn.</li>
</ul>
<p>Và giá trị duy nhất hoàn toàn không render được — một object thường:</p>
<pre><code class="language-tsx">const bacSi = { ten: 'BS. Trần Thu Hà', namKinhNghiem: 8 }
renderToStaticMarkup(&lt;p&gt;{bacSi}&lt;/p&gt;)</code></pre>
<div class="out">Objects are not valid as a React child (found: object with keys {ten, namKinhNghiem}). If you meant to render a collection of children, use an array instead.</div>
<p>React không đoán được phải hiện object thế nào; bạn tự chọn trường: <code>&lt;p&gt;{bacSi.ten} · {bacSi.namKinhNghiem} năm&lt;/p&gt;</code> cho ra <code>&lt;p&gt;BS. Trần Thu Hà · 8 năm&lt;/p&gt;</code>. Có TypeScript thì hiếm khi bạn chạm tới lỗi lúc chạy này, vì trình soạn thảo đã báo <code>error TS2322: Type '{ ten: string; namKinhNghiem: number; }' is not assignable to type 'ReactNode'.</code> <strong>ReactNode</strong> là kiểu của "mọi thứ React render được": chuỗi, số, phần tử, mảng của chúng, và bốn giá trị "không có gì".</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — số 0 lạc trên thanh menu.</strong> Một bug thật rất hay gặp: <code>{soLichHen &amp;&amp; &lt;span className="huy-hieu"&gt;{soLichHen}&lt;/span&gt;}</code> trên thanh điều hướng. Buổi demo nào cũng chạy đúng, vì tài khoản demo có lịch hẹn. Người dùng mới chưa có lịch nào thì thấy một số "0" trơ trọi cạnh menu. Bài test trong 🧪 của bài này tái hiện đúng nó (<code>expect(container.innerHTML).toBe('&lt;p&gt;0&lt;/p&gt;')</code> qua). Cách sửa luôn như nhau: làm vế trái thành boolean thật — <code>soLichHen &gt; 0 &amp;&amp;</code>, <code>ds.length &gt; 0 &amp;&amp;</code>, hoặc <code>Boolean(x) &amp;&amp;</code>. Trang về render có điều kiện của react.dev cảnh báo đúng chuyện này với đúng ví dụ này.</div>

<h3>Điều kiện: ba mẫu và khi nào dùng mẫu nào</h3>
<p>Giờ bạn có đủ mảnh để làm giao diện có điều kiện. Ba mẫu phủ gần hết các trường hợp:</p>
<pre><code class="language-tsx">function GioMoCua({ gio }: { gio: string }) {
  // 1. if trước return — cho cả màn hình khác hẳn, hoặc "không vẽ gì"
  if (gio === '') return null

  return (
    &lt;p&gt;
      {/* 2. ba ngôi — chọn giữa HAI thứ */}
      {gio === 'Nghỉ' ? &lt;strong className="nghi"&gt;Nghỉ&lt;/strong&gt; : gio}
      {/* 3. &amp;&amp; — hiện MỘT thứ hoặc không gì; vế trái phải là boolean */}
      {gio === 'Nghỉ' &amp;&amp; ' (hẹn trước qua điện thoại)'}
    &lt;/p&gt;
  )
}</code></pre>
<ul>
<li><strong><code>if</code> + <code>return</code> sớm</strong> — khi cả kết quả khác nhau (màn hình đang tải, trạng thái rỗng, "không tìm thấy"). Trả về <code>null</code> là không vẽ gì.</li>
<li><strong>Ba ngôi <code>đk ? A : B</code></strong> — khi chọn giữa hai kết quả ngay giữa JSX.</li>
<li><strong><code>đk &amp;&amp; A</code></strong> — khi hiện một thứ hoặc không gì. Giữ <code>đk</code> là boolean.</li>
</ul>
<p>Ba ngôi lồng nhau (<code>a ? x : b ? y : z</code>) hợp lệ nhưng khó đọc; cần nhánh thứ ba thì đưa logic ra một biến hoặc một component nhỏ. Trang chủ bạn dựng ở Bài 0.3 dùng mẫu ba ngôi cho ô "Nghỉ" màu đỏ: <code>className={dong.gio === 'Nghỉ' ? 'nghi' : undefined}</code> — <code>undefined</code> nghĩa là "không có thuộc tính này".</p>

<h3>Khi JSX không đọc nổi: lớp phủ lỗi của Vite</h3>
${slide('rx-00', 22, 'Lớp phủ lỗi của Vite — ảnh chụp thật')}
<p>Lỗi kiểu hiện trong trình soạn thảo và trong <code>tsc</code>. Lỗi cú pháp — JSX mà bộ phân tích không hiểu nổi — còn hiện ngay trên trình duyệt. Chúng tôi xoá một dấu gạch chéo của <code>&lt;img /&gt;</code> trong trang chủ phòng khám khi máy chủ dev đang chạy; ảnh trên slide là thứ trang biến thành. Đầu lớp phủ ghi <code>[plugin:vite:oxc] Transform failed with 4 errors</code>, và lỗi đầu chỉ đúng thẻ chưa đóng, với "Opened here" dưới <code>&lt;img</code> và "Expected <code>&lt;/img&gt;</code>" ở chỗ bộ phân tích bỏ cuộc.</p>
<p>Đọc thế nào: một chỗ sai sinh ra bốn lỗi, vì sau một thẻ hỏng bộ phân tích hiểu sai mọi thứ phía sau (<code>section</code>, <code>main</code>…). Luôn sửa lỗi <strong>đầu tiên</strong>, lưu, rồi nhìn lại; các lỗi kia thường tự biến mất. Lớp phủ là của Vite (bộ chuyển đổi Oxc trong plugin React), không phải của React, và nó tự biến mất ngay khi file biên dịch được trở lại.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p><code>import React from 'react'</code> ở đầu mọi file <code>.js</code>, JSX nằm trong hàm <code>render()</code> của class component, PropTypes để kiểm props lúc app chạy → file <code>.tsx</code> không import <code>React</code> (runtime JSX tự động thêm thứ nó cần), function component trả JSX trực tiếp, và TypeScript từ chối <code>class=</code>, thẻ thiếu đóng hay con là object ngay trước khi bạn lưu · <em>Vì sao:</em> runtime cổ điển thật sự cần <code>React</code> trong phạm vi (bạn đã thấy lỗi TS2874 khi thiếu nó); từ React 17 trình biên dịch tự import <code>react/jsx-runtime</code>. Trong dự án cũ bạn vẫn sẽ thấy <code>import React</code> khắp nơi — ở đó nó vô hại; đừng thêm nó vào code mới.</p></div>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Fragment là gì, sao không dùng luôn div?"</p>
<p>Ý trả lời: component phải trả về một gốc, và Fragment (<code>&lt;&gt;…&lt;/&gt;</code>) gom nhiều con mà không thêm nút DOM nào. Một <code>div</code> thừa có thể phá bố cục (container flex hay grid chờ đúng các con trực tiếp của nó), tạo HTML sai (một <code>div</code> nằm trong <code>&lt;tr&gt;</code> hay <code>&lt;ul&gt;</code>) và làm DOM rối. Dùng dạng dài <code>&lt;Fragment key={…}&gt;</code> khi cần key trong danh sách.</p></div>

<h3>Chạy thử từng bước: từ bản HTML sang JSX</h3>
<p>Designer và các trang cũ đưa bạn HTML. Chuyển nó sang JSX là việc máy móc khi đã biết bốn luật. Đây là ô giờ mở cửa ở dạng HTML thuần:</p>
<pre><code class="language-html">&lt;section class="o-thong-tin"&gt;
  &lt;h2&gt;Giờ mở cửa&lt;/h2&gt;
  &lt;!-- bảng giờ --&gt;
  &lt;table&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Thứ 2 – Thứ 6&lt;/th&gt;&lt;td&gt;07:30 – 19:00&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Thứ 7&lt;/th&gt;&lt;td&gt;07:30 – 12:00&lt;/td&gt;&lt;/tr&gt;
    &lt;tr&gt;&lt;th scope="row"&gt;Chủ nhật&lt;/th&gt;&lt;td class="nghi" style="font-weight: 600"&gt;Nghỉ&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/section&gt;</code></pre>
<ol>
<li><code>class</code> → <code>className</code> ở mọi chỗ.</li>
<li>Chú thích HTML <code>&lt;!-- --&gt;</code> → <code>{/* bảng giờ */}</code>.</li>
<li><code>style="font-weight: 600"</code> → <code>style={{ fontWeight: 600 }}</code> (hoặc tốt hơn, chuyển vào class CSS).</li>
<li>Thêm <code>&lt;tbody&gt;</code>: trong HTML trình duyệt lặng lẽ chèn nó, nhưng React dựng đúng thứ bạn viết. Thiếu nó, React 19.3 in ra (đã kiểm): <code>In HTML, &lt;tr&gt; cannot be a child of &lt;table&gt;. Add a &lt;tbody&gt;, &lt;thead&gt; or &lt;tfoot&gt; to your code to match the DOM tree generated by the browser.</code></li>
<li>Thay ba dòng lặp lại bằng dữ liệu + <code>map</code>, để thêm một khung giờ mở cửa chỉ là thêm một dòng dữ liệu thay vì chép markup.</li>
</ol>
<p>Kết quả là code thật của trang chủ dự án (đã kiểm kiểu, đã test):</p>
<pre><code class="language-tsx">const GIO_MO_CUA = [
  { thu: 'Thứ 2 – Thứ 6', gio: '07:30 – 19:00' },
  { thu: 'Thứ 7', gio: '07:30 – 12:00' },
  { thu: 'Chủ nhật', gio: 'Nghỉ' },
]

&lt;section className="o-thong-tin"&gt;
  &lt;h2&gt;Giờ mở cửa&lt;/h2&gt;
  &lt;table&gt;
    &lt;tbody&gt;
      {GIO_MO_CUA.map((dong) =&gt; (
        &lt;tr key={dong.thu}&gt;
          &lt;th scope="row"&gt;{dong.thu}&lt;/th&gt;
          &lt;td className={dong.gio === 'Nghỉ' ? 'nghi' : undefined}&gt;{dong.gio}&lt;/td&gt;
        &lt;/tr&gt;
      ))}
    &lt;/tbody&gt;
  &lt;/table&gt;
&lt;/section&gt;</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: <code>(dong) =&gt; ( … )</code>.</strong> Một hàm mũi tên. <code>map</code> gọi nó một lần cho mỗi phần tử của mảng và gom thứ nó trả về thành một mảng mới — ở đây là mảng các phần tử <code>&lt;tr&gt;</code>, JSX vẽ lần lượt từng cái. Dấu ngoặc tròn sau <code>=&gt;</code> nghĩa là "trả về biểu thức này" (không cần chữ <code>return</code>). Bài 0.3 chạy <code>map</code>, <code>filter</code> và các anh em trên danh sách bác sĩ.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> chứng minh ba luật render bằng test thay vì tin trang này. Làm trong dự án <code>phong-kham</code> (đã có Vitest như Bài 0.1).</p><ol>
<li>Tạo <code>src/thu-jsx.test.tsx</code>. Import <code>render</code> từ <code>@testing-library/react</code> và <code>expect, test</code> từ <code>vitest</code>.</li>
<li>Test 1: <code>const soLichHen: number = 0</code>, render <code>&lt;p&gt;{soLichHen &amp;&amp; &lt;b&gt;Có lịch&lt;/b&gt;}&lt;/p&gt;</code>, lấy <code>container</code> từ kết quả của <code>render</code>, và chờ <code>container.innerHTML</code> bằng <code>'&lt;p&gt;0&lt;/p&gt;'</code>.</li>
<li>Test 2: y như vậy với <code>soLichHen &gt; 0 &amp;&amp;</code>; chờ <code>'&lt;p&gt;&lt;/p&gt;'</code>.</li>
<li>Test 3: render <code>&lt;p&gt;{'&lt;b&gt;đậm?&lt;/b&gt;'}&lt;/p&gt;</code> và chờ HTML đã thoát <code>'&lt;p&gt;&amp;lt;b&amp;gt;đậm?&amp;lt;/b&amp;gt;&lt;/p&gt;'</code>.</li>
<li>Chạy <code>npx vitest run src/thu-jsx.test.tsx</code>, rồi viết <code>{bacSi}</code> (một object) vào trong một <code>&lt;p&gt;</code> trong cùng file và chạy <code>npx tsc -b</code>.</li>
</ol><p><strong>Đạt khi:</strong> Vitest in <code>Tests  3 passed (3)</code> (lần chạy của chúng tôi: 17 ms, 2 ms, 3 ms), và <code>tsc -b</code> báo <code>TS2322 … not assignable to type 'ReactNode'</code> ở dòng object. Xoá dòng object đi sau đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">JSX</span><span class="v">cú pháp thẻ trong JavaScript; được dịch thành lời gọi <code>jsx(type, props)</code> trước khi tới trình duyệt</span></div>
<div class="kv"><span class="k">element (phần tử)</span><span class="v">object thường mà một thẻ JSX tạo ra: <code>type</code>, <code>props</code>, <code>key</code></span></div>
<div class="kv"><span class="k">JSX runtime</span><span class="v"><code>react/jsx-runtime</code>: runtime tự động "mới" từ React 17; runtime cổ điển dùng <code>React.createElement</code></span></div>
<div class="kv"><span class="k">Fragment</span><span class="v"><code>&lt;&gt;…&lt;/&gt;</code>: gom các con mà không thêm nút DOM</span></div>
<div class="kv"><span class="k"><code>children</code></span><span class="v">prop chứa những gì nằm giữa thẻ mở và thẻ đóng</span></div>
<div class="kv"><span class="k">ReactNode</span><span class="v">kiểu của mọi thứ render được: chuỗi, số, phần tử, mảng, <code>null</code>/<code>undefined</code>/boolean</span></div>
<div class="kv"><span class="k">thoát (escaping)</span><span class="v">React hiện chuỗi thành chữ, không bao giờ thành HTML — lá chắn trước XSS</span></div>
<div class="kv"><span class="k">lớp phủ lỗi (error overlay)</span><span class="v">màn hình lỗi toàn trang của Vite khi code dev không biên dịch được</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>JSX được dịch thành lời gọi hàm: <code>_jsx("div", { className, children })</code> (runtime mới) hoặc <code>React.createElement</code> (cổ điển, cần <code>import React</code>).</li>
<li>Một thẻ JSX tạo ra một object thường (phần tử) — bản mô tả, không phải DOM.</li>
<li>Bốn luật: một gốc (hoặc Fragment), thuộc tính camelCase (<code>className</code>, <code>onClick</code>), thẻ nào cũng đóng, trong <code>{ }</code> chỉ có biểu thức (<code>style</code> nhận object).</li>
<li>Trong <code>{ }</code>: chuỗi, số và mảng được vẽ; <code>true/false/null/undefined</code> không vẽ gì; <code>0</code> được vẽ; object gây lỗi; chuỗi bị thoát.</li>
<li>Điều kiện: <code>if</code> + return sớm, ba ngôi cho hai lựa chọn, <code>&amp;&amp;</code> với boolean thật cho một lựa chọn.</li>
<li>Đọc lỗi đầu tiên trước — cả trong output của <code>tsc</code> lẫn lớp phủ của Vite.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Writing Markup with JSX</span><span class="lc-sub">react.dev/learn/writing-markup-with-jsx — các luật của JSX (một gốc, đóng mọi thẻ, camelCase) và vì sao có chúng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — JavaScript in JSX with Curly Braces</span><span class="lc-sub">react.dev/learn/javascript-in-jsx-with-curly-braces — chỗ nào đặt được ngoặc nhọn, và "ngoặc kép" cho <code>style</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Conditional Rendering</span><span class="lc-sub">react.dev/learn/conditional-rendering — <code>if</code>, <code>? :</code>, <code>&amp;&amp;</code>, và cảnh báo "đừng đặt số ở vế trái của &amp;&amp;".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — &lt;Fragment&gt;</span><span class="lc-sub">react.dev/reference/react/Fragment — cú pháp ngắn và dài, và fragment có key.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — HTML bạn sẽ chuyển sang JSX</span><span class="lc-sub">/courses/web-foundations/learn${REF} — HTML có ngữ nghĩa (bảng, tiêu đề, danh sách) mà Bài 0.2 biến thành component.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — The JavaScript you need for React (run on the doctor list)|||0.3 — JavaScript bạn cần cho React (chạy thật trên danh sách bác sĩ)',
      slug: 'rx-0-3-js-cho-react',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phần JavaScript mọi component đều dùng, chạy thật trên dữ liệu 6 bác sĩ: hàm mũi tên, destructuring, spread, so sánh tham chiếu, map/filter/reduce, ?. và ??, import/export, closure, async/await, TypeScript tối thiểu — và bước 🛠 đầu tiên của dự án.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The JavaScript you need for React (run on the doctor list)</h2>
<p class="lead">React is mostly JavaScript. Students who find React "hard" usually find a handful of JavaScript features hard: destructuring, spread, <code>map</code>, <code>?.</code>, <code>async</code>. This lesson runs each of them on the project&#39;s real data — six doctors — and prints what happens, so that from Chapter 1 on you can read every line of a component. At the end you set up the project&#39;s data and home page: the first 🛠 step.</p>

<p>How to use this lesson: every example is a small <code>.ts</code> file that was run with <code>node</code> (Node 22 runs TypeScript files directly by stripping the types) and type-checked with <code>tsc</code>. Type them yourself and compare your output. The data they use is <code>src/du-lieu/bac-si.ts</code>: six doctors with <code>id</code>, <code>ten</code> (name), <code>chuyenKhoa</code> (specialty), <code>namKinhNghiem</code> (years of experience) and <code>gioiThieu</code> (a short intro).</p>

<h3>Variables, arrow functions and template literals</h3>
<pre><code class="language-ts">const ten = 'BS. Trần Thu Hà'
let soLuot = 0
soLuot = soLuot + 1

function chaoCu(t: string) { return 'Xin chào ' + t }   // classic function
const chao = (t: string) =&gt; &#96;Xin chào &#36;{t}&#96;              // arrow function + template literal
const binhPhuong = (x: number) =&gt; x * x                  // one expression ⇒ returned automatically

console.log(chaoCu(ten))
console.log(chao(ten), '· lượt', soLuot)
console.log(binhPhuong(7))
try {
  // @ts-expect-error — reassigning a const on purpose
  ten = 'khác'
} catch (e) { console.log('Lỗi:', (e as Error).message) }</code></pre>
<pre><code class="language-bash">$ node 1-bien-ham.ts</code></pre>
<div class="out">Xin chào BS. Trần Thu Hà
Xin chào BS. Trần Thu Hà · lượt 1
49
Lỗi: Assignment to constant variable.</div>
<ul>
<li><strong><code>const</code></strong> for a name you never reassign (almost everything in React), <strong><code>let</code></strong> when you must reassign. Forget <code>var</code>: its scoping rules are the source of classic bugs and no modern code uses it. Note that <code>const</code> stops <em>reassigning the name</em>, not changing what is inside an object: <code>const bs = {…}; bs.ten = 'x'</code> is allowed. That difference matters in a moment.</li>
<li><strong>Arrow functions</strong> <code>(x) =&gt; x * x</code> are the everyday way to write functions in React: event handlers, <code>map</code> callbacks, small helpers. With a single expression after <code>=&gt;</code> the value is returned automatically; with curly braces you need <code>return</code>. To return an object literal directly, wrap it in brackets: <code>() =&gt; ({ ten: 'An' })</code>.</li>
<li><strong>Template literals</strong> use backticks and <code>&#36;{…}</code> to insert values: <code>&#96;Đặt &#36;{k.gio}&#96;</code>. You saw them in the booking buttons of Lesson 2/2.</li>
</ul>

<h3>Destructuring: pulling fields out by name or position</h3>
${slide('rx-00', 23, 'Destructuring và spread, chạy thật')}
<p>Destructuring is the syntax on the left of <code>=</code> that takes an object or array apart. You will see it on the first line of almost every component, so it is worth running once:</p>
<pre><code class="language-ts">import { danhSachBacSi } from '../../ch00/src/du-lieu/bac-si.ts'

const bs = danhSachBacSi[1]
// Object destructuring: take fields into variables with the same names
const { ten, chuyenKhoa } = bs
console.log(ten, '|', chuyenKhoa)

// Rename + default value
const { namKinhNghiem: soNam, anh = '/anh-mac-dinh.png' } = { ...bs, anh: undefined }
console.log(soNam, '|', anh)

// Array destructuring: by POSITION — exactly how useState is used
const [dau, thuHai, ...conLai] = danhSachBacSi.map((b) =&gt; b.id)
console.log(dau, thuHai, conLai)

// In function parameters — exactly how a component receives props
function TheNho({ ten, namKinhNghiem }: { ten: string; namKinhNghiem: number }) {
  return &#96;&#36;{ten} (&#36;{namKinhNghiem} năm)&#96;
}
console.log(TheNho(bs))</code></pre>
<pre><code class="language-bash">$ node 2-destructuring.ts</code></pre>
<div class="out">BS. Trần Thu Hà | nhi
8 | /anh-mac-dinh.png
bs-1 bs-2 [ 'bs-3', 'bs-4', 'bs-5', 'bs-6' ]
BS. Trần Thu Hà (8 năm)</div>
<p>Four forms, four places you will meet them in React:</p>
<ul>
<li><code>const { ten, chuyenKhoa } = bs</code> is shorthand for <code>const ten = bs.ten; const chuyenKhoa = bs.chuyenKhoa</code>.</li>
<li><code>namKinhNghiem: soNam</code> renames; <code>anh = '…'</code> gives a default used only when the value is <code>undefined</code>.</li>
<li><code>const [dau, thuHai, ...conLai] = …</code> takes array items by position; <code>...conLai</code> collects the rest into a new array. This is why <code>const [dem, setDem] = useState(0)</code> works: <code>useState</code> returns an array of two items, and you name them whatever you like.</li>
<li><code>function TheNho({ ten, namKinhNghiem })</code> destructures the <em>parameter</em>. A React component receives one object, its props, and this is the standard way to read them: <code>function TheBacSi({ bacSi, onChon })</code>.</li>
</ul>

<h3>Spread: copy, then change — and what "copy" really means</h3>
<p>The three dots have two jobs. On the right of <code>=</code> (or inside <code>[ ]</code>/<code>{ }</code>) they <strong>spread</strong> — copy all items or fields into a new array or object. In a parameter list they <strong>rest</strong> — collect the remaining arguments into an array.</p>
<pre><code class="language-ts">const goc = danhSachBacSi[0]
const banSao = { ...goc, namKinhNghiem: goc.namKinhNghiem + 1 } // copy, then overwrite one field
console.log(goc.namKinhNghiem, banSao.namKinhNghiem, goc === banSao)

const them = [...danhSachBacSi.slice(0, 2), { ...danhSachBacSi[2], ten: 'BS. Mới' }]
console.log(them.map((b) =&gt; b.ten))

// Spread copies only ONE level (shallow)
const lich = { id: 'lh-1', benhNhan: { hoTen: 'Lan', soDienThoai: '0912345678' } }
const lich2 = { ...lich }
lich2.benhNhan.hoTen = 'Mai'
console.log(lich.benhNhan.hoTen, lich.benhNhan === lich2.benhNhan)

// Rest in parameters: gather the remaining arguments
const tong = (...so: number[]) =&gt; so.reduce((a, b) =&gt; a + b, 0)
console.log(tong(12, 8, 5))</code></pre>
<pre><code class="language-bash">$ node 3-spread.ts</code></pre>
<div class="out">12 13 false
[ 'BS. Nguyễn Minh An', 'BS. Trần Thu Hà', 'BS. Mới' ]
Mai true
25</div>
<p>Line 1: the original still has 12 years, the copy has 13, and they are different objects (<code>false</code>). This "copy, then change the copy" pattern is how you update state in React: you never edit the old object, you create a new one with <code>{ ...cu, truong: moi }</code> or a new array with <code>[...cu, moi]</code>. Line 3 is the trap: changing <code>lich2.benhNhan.hoTen</code> also changed <code>lich</code>, because spread copied the <em>reference</em> to the inner <code>benhNhan</code> object, not the object itself (<code>true</code>: same object). To change a nested field you copy each level you touch: <code>{ ...lich, benhNhan: { ...lich.benhNhan, hoTen: 'Mai' } }</code>. Chapter 2 practises this until it is automatic.</p>

<h3>Same value or same object? Comparing by reference</h3>
<pre><code class="language-ts">const a = [1, 2]
const b = [1, 2]
const c = a
console.log('a === b', a === b, '| a === c', a === c)
c.push(3)
console.log('a sau c.push(3):', a)
const d = [...a, 4]
console.log('d === a', d === a, '| Object.is({}, {})', Object.is({}, {}))
console.log("'1' == 1", '1' == (1 as unknown), "| '1' === 1", '1' === (1 as unknown))</code></pre>
<pre><code class="language-bash">$ node 6-so-sanh.ts</code></pre>
<div class="out">a === b false | a === c true
a sau c.push(3): [ 1, 2, 3 ]
d === a false | Object.is({}, {}) false
'1' == 1 true | '1' === 1 false</div>
<p>For arrays and objects, <code>===</code> asks "is this the <em>same object</em>?", not "do they contain the same things?". <code>a</code> and <code>b</code> look identical but are two arrays; <code>c</code> is just another name for <code>a</code>, so pushing into <code>c</code> changed <code>a</code>. React uses exactly this cheap check (<code>Object.is</code>) to decide whether your state changed. If you <code>push</code> into the state array and set it again, React sees the <em>same</em> array and may skip the update — the most common beginner bug in Chapter 2. A new array (<code>[...a, 4]</code>) is a different object, so React notices. And always use <code>===</code>, never <code>==</code>: the double equals converts types (<code>'1' == 1</code> is <code>true</code>).</p>

<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between a shallow copy and a deep copy? Why does it matter in React?"</p>
<p>Answer: a shallow copy (<code>{ ...obj }</code>, <code>[...arr]</code>) creates a new top-level object but reuses the same nested objects; a deep copy duplicates every level (<code>structuredClone(obj)</code>). React compares state by reference, so an update must produce new objects along the path that changed — and only that path. Mutating a nested object inside a shallow copy changes the old state too, which causes stale UI and bugs; deep-copying everything works but wastes memory and breaks memoization. The usual answer is "copy each level you change".</p></div>

<h3>map, filter, find, reduce: loops that return values</h3>
${slide('rx-00', 24, 'map, filter, find, reduce trên danhSachBacSi')}
<p>In React you rarely write <code>for</code> loops, because JSX needs <em>expressions</em> and these array methods return values. Each takes a function that is called once per item:</p>
<pre><code class="language-ts">console.log('map    →', danhSachBacSi.map((b) =&gt; b.id).join(' '))
console.log('filter →', danhSachBacSi.filter((b) =&gt; b.namKinhNghiem &gt;= 10).map((b) =&gt; b.ten))
console.log('find   →', danhSachBacSi.find((b) =&gt; b.chuyenKhoa === 'da-lieu')?.ten)
console.log('some   →', danhSachBacSi.some((b) =&gt; b.namKinhNghiem &gt; 18))
console.log('reduce →', danhSachBacSi.reduce((tong, b) =&gt; tong + b.namKinhNghiem, 0))

const theoKhoa = danhSachBacSi.reduce&lt;Record&lt;string, number&gt;&gt;((dem, b) =&gt; {
  dem[b.chuyenKhoa] = (dem[b.chuyenKhoa] ?? 0) + 1
  return dem
}, {})
console.log('đếm   →', theoKhoa)

// sort() CHANGES the original; toSorted() returns a new array
const ids = danhSachBacSi.map((b) =&gt; b.id)
const xepMoi = ids.toSorted().reverse()
console.log('toSorted:', xepMoi.join(' '), '| gốc:', ids.join(' '))
ids.sort((a, b) =&gt; (a &lt; b ? 1 : -1))
console.log('sau sort(): gốc đã đổi thành', ids.join(' '))</code></pre>
<pre><code class="language-bash">$ node 4-mang.ts</code></pre>
<div class="out">map    → bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
filter → [ 'BS. Nguyễn Minh An', 'BS. Phạm Ngọc Lan', 'BS. Vũ Thảo Vy' ]
find   → BS. Lê Quốc Bảo
some   → true
reduce → 63
đếm   → { noi: 2, nhi: 2, 'da-lieu': 1, 'rang-ham-mat': 1 }
toSorted: bs-6 bs-5 bs-4 bs-3 bs-2 bs-1 | gốc: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
sau sort(): gốc đã đổi thành bs-6 bs-5 bs-4 bs-3 bs-2 bs-1</div>
<table>
<thead><tr><th>Method</th><th>Returns</th><th>In React you use it to…</th></tr></thead>
<tbody>
<tr><td><code>map(fn)</code></td><td>a new array, same length</td><td>turn data into JSX: <code>ds.map((b) =&gt; &lt;TheBacSi key={b.id} bacSi={b} /&gt;)</code></td></tr>
<tr><td><code>filter(fn)</code></td><td>a new array with the items where <code>fn</code> is true</td><td>filter a list by specialty; <strong>remove</strong> an item from state: <code>ds.filter((b) =&gt; b.id !== id)</code></td></tr>
<tr><td><code>find(fn)</code></td><td>the first matching item, or <code>undefined</code></td><td>get the selected doctor by id</td></tr>
<tr><td><code>some(fn)</code> / <code>every(fn)</code></td><td><code>true</code>/<code>false</code></td><td>"is any slot free?", "are all fields valid?"</td></tr>
<tr><td><code>reduce(fn, start)</code></td><td>one value built from all items</td><td>totals, counts per group (like <code>theoKhoa</code> above)</td></tr>
<tr><td><code>toSorted(fn)</code></td><td>a new sorted array</td><td>sort for display without touching state</td></tr>
</tbody>
</table>
<p>Two reading tips. <code>reduce((tong, b) =&gt; tong + b.namKinhNghiem, 0)</code>: the <code>0</code> is the starting value; each call receives the running total and the next item and returns the new total. <code>(dem[b.chuyenKhoa] ?? 0) + 1</code> reads "the current count, or 0 if there is none yet, plus one" — the <code>??</code> is explained just below. The generic <code>reduce&lt;Record&lt;string, number&gt;&gt;</code> tells TypeScript the result is an object from string keys to numbers.</p>

<div class="pitfall co-tieu-de"><strong>Trap — sorting the state array in place.</strong> A doctor list with a "sort by experience" button: <code>setBacSi(bacSi.sort((a, b) =&gt; b.namKinhNghiem - a.namKinhNghiem))</code>. The last two output lines show why this is wrong: <code>sort()</code> rearranges the <em>original</em> array and returns that same array. You have mutated state, and you handed React the same object back, so depending on the situation the list does not re-render, or re-renders in a confusing order later, and any other component holding the old array sees it reshuffled. Use <code>bacSi.toSorted(...)</code> (ES2023, in every current browser and in the project&#39;s TypeScript <code>lib</code>) or <code>[...bacSi].sort(...)</code>. The same applies to <code>reverse()</code>, <code>splice()</code> and <code>push()</code> — each has a non-mutating alternative (<code>toReversed</code>, <code>toSpliced</code>, spread).</div>

<h3>Truthy and falsy, ?. and ??</h3>
${slide('rx-00', 25, '?. và ??, cùng bảng truthy/falsy')}
<pre><code class="language-ts">const khongCo = danhSachBacSi.find((b) =&gt; b.id === 'bs-99')
console.log('?.  →', khongCo?.ten)
console.log('??  →', khongCo?.ten ?? 'Không tìm thấy')
try { console.log((khongCo as any).ten) } catch (e) { console.log('không ?. →', (e as Error).message) }

// || treats 0 and '' as "missing"; ?? treats only null/undefined as "missing"
const soPhong: number = 0
const ghiChu: string = ''
console.log('soPhong || 99 =', soPhong || 99, '· soPhong ?? 99 =', soPhong ?? 99)
console.log("ghiChu || 'trống' =", ghiChu || 'trống', "· ghiChu ?? 'trống' =", JSON.stringify(ghiChu ?? 'trống'))

// truthy / falsy
const nhan = (v: unknown) =&gt; (Number.isNaN(v) || v === undefined ? String(v) : JSON.stringify(v))
for (const v of [0, '', null, undefined, NaN, [], {}, '0']) console.log(nhan(v), '→', v ? 'truthy' : 'falsy')</code></pre>
<pre><code class="language-bash">$ node 5-optional.ts</code></pre>
<div class="out">?.  → undefined
??  → Không tìm thấy
không ?. → Cannot read properties of undefined (reading 'ten')
soPhong || 99 = 99 · soPhong ?? 99 = 0
ghiChu || 'trống' = trống · ghiChu ?? 'trống' = ""
0 → falsy
"" → falsy
null → falsy
undefined → falsy
NaN → falsy
[] → truthy
{} → truthy
"0" → truthy</div>
<ul>
<li><strong>Falsy</strong> values are exactly <code>false</code>, <code>0</code>, <code>''</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Everything else is <strong>truthy</strong> — including the empty array <code>[]</code> and the string <code>'0'</code>. So <code>if (ds)</code> is always true for an array; check <code>ds.length &gt; 0</code>.</li>
<li><strong><code>?.</code> (optional chaining)</strong>: <code>khongCo?.ten</code> means "if <code>khongCo</code> is <code>null</code> or <code>undefined</code>, stop and give <code>undefined</code>; otherwise read <code>.ten</code>". Without it you get the most common runtime error in JavaScript, <code>Cannot read properties of undefined</code>. It also works for calls: <code>onChon?.(id)</code> calls the function only if it exists.</li>
<li><strong><code>??</code> (nullish coalescing)</strong>: <code>a ?? b</code> gives <code>b</code> only when <code>a</code> is <code>null</code> or <code>undefined</code>. <code>||</code> gives <code>b</code> for <em>any</em> falsy <code>a</code> — so <code>soPhong || 99</code> turned a real room number 0 into 99, and <code>ghiChu || 'trống'</code> replaced an intentionally empty note. Use <code>??</code> for defaults; use <code>||</code> only when 0 and <code>''</code> should also count as missing.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong> "What is the difference between <code>||</code> and <code>??</code>?"</p>
<p>Answer: <code>||</code> returns the right side when the left side is any falsy value (<code>0</code>, <code>''</code>, <code>false</code>, <code>NaN</code>, <code>null</code>, <code>undefined</code>); <code>??</code> only when it is <code>null</code> or <code>undefined</code>. For default values where 0 or an empty string are valid — a quantity, a page number, a note — <code>??</code> is correct and <code>||</code> is a bug. <code>?.</code> is the companion: it stops a property chain at the first <code>null</code>/<code>undefined</code> instead of throwing.</p></div>

<h3>import and export: how files talk to each other</h3>
${slide('rx-00', 26, 'import/export: đúng tên, đúng loại')}
<p>Each file is a <strong>module</strong>: its variables are private unless it <code>export</code>s them. There are two kinds of exports, and mixing them up gives two different errors:</p>
<pre><code class="language-ts">// tien-ich.ts
export const TEN_PHONG_KHAM = 'Phòng khám An Tâm'          // named export
export function dinhDangGio(gio: string) { return &#96;&#36;{gio} (giờ VN)&#96; }
export default function chao() { return 'Xin chào!' }      // default export — at most ONE per file

// dung.ts
import chao, { TEN_PHONG_KHAM, dinhDangGio as gio } from './tien-ich.ts'
console.log(chao(), TEN_PHONG_KHAM, gio('08:00'))</code></pre>
<div class="out">Xin chào! Phòng khám An Tâm 08:00 (giờ VN)</div>
<p>Named exports are imported inside <code>{ }</code> with their exact name (rename with <code>as</code>); the default export is imported without braces, under any name you choose. Import the default with braces by mistake and both Node and TypeScript stop you:</p>
<pre><code class="language-bash">$ node mod/sai.ts        # import { chao } from './tien-ich.ts'</code></pre>
<div class="out">import { chao } from './tien-ich.ts'
         ^^^^
SyntaxError: The requested module './tien-ich.ts' does not provide an export named 'chao'</div>
<div class="out">mod/sai.ts(1,10): error TS2614: Module '"./tien-ich.ts"' has no exported member 'chao'. Did you mean to use 'import chao from "./tien-ich.ts"' instead?</div>
<p>Conventions in this course: one component per file, exported as default (<code>export default App</code>, like the template) or named when a file groups small components; helpers, constants and types always named. Import types with <code>import type { BacSi } from '../types'</code>: the template&#39;s <code>verbatimModuleSyntax</code> setting requires it, and it tells the compiler the import disappears at runtime. Inside a Vite project you omit the <code>.ts</code> extension (<code>'./du-lieu/bac-si'</code>); the bare-Node scripts above needed it.</p>

<h3>Closures: functions remember where they were created</h3>
<pre><code class="language-ts">function taoBoDem() {
  let dem = 0
  return () =&gt; { dem = dem + 1; return dem }
}
const bam = taoBoDem()
bam(); bam()
console.log('bấm 3 lần →', bam())

// A closure keeps the OLD value: a preview of Chapter 4&#39;s "stale closure"
let soLich = 1
const hen = () =&gt; { const luc = soLich; setTimeout(() =&gt; console.log('hẹn giờ thấy soLich =', luc, '| hiện tại =', soLich), 10) }
hen()
soLich = 5</code></pre>
<div class="out">bấm 3 lần → 3
hẹn giờ thấy soLich = 1 | hiện tại = 5</div>
<p>A <strong>closure</strong> is a function together with the variables it could see when it was created. <code>bam</code> still reaches <code>dem</code> after <code>taoBoDem</code> has finished — that is how hooks keep data between renders, in spirit. The second example matters more for React: the timer&#39;s function captured <code>luc = 1</code> when it was created, and prints 1 even though <code>soLich</code> is now 5. Every render of a component is a fresh function call with its own variables, and event handlers or timers created in one render keep seeing <em>that</em> render&#39;s values. Chapter 2 calls it "state as a snapshot", Chapter 4 debugs the "stale closure" it causes in effects.</p>

<h3>Promises and async/await: waiting without freezing</h3>
${slide('rx-00', 27, 'async/await: thứ tự in ra thật')}
<p>Anything slow — a network request, a timer — gives you a <strong>Promise</strong>: an object that will later hold a result or an error. <code>await</code> pauses the current <code>async</code> function until the promise settles, while the rest of the program keeps running. We simulated an API with <code>setTimeout</code>:</p>
<pre><code class="language-ts">import { danhSachBacSi } from '../../ch00/src/du-lieu/bac-si.ts'
import type { BacSi } from '../../ch00/src/types.ts'

// A fake API call: returns a Promise that settles after ms milliseconds
const layBacSi = (id: string, ms: number) =&gt;
  new Promise&lt;BacSi&gt;((xong, loi) =&gt; setTimeout(() =&gt; {
    const bs = danhSachBacSi.find((b) =&gt; b.id === id)
    if (bs) xong(bs); else loi(new Error(&#96;404: không có bác sĩ &#36;{id}&#96;))
  }, ms))

async function main() {
  console.log('1. bắt đầu')
  const p = layBacSi('bs-1', 50)
  console.log('2. đã gọi, p là', Object.prototype.toString.call(p))
  const bs = await p                                   // waits HERE, does not block the program
  console.log('4. có kết quả:', bs.ten)

  try { await layBacSi('bs-99', 10) }
  catch (e) { console.log('5. bắt lỗi:', (e as Error).message) }

  const t0 = Date.now()
  const [a, b] = await Promise.all([layBacSi('bs-2', 100), layBacSi('bs-3', 100)])
  console.log('6. Promise.all:', a.id, b.id, &#96;≈&#36;{Math.round((Date.now() - t0) / 50) * 50} ms (chạy song song)&#96;)
}
main()
console.log('3. dòng này chạy TRƯỚC khi có kết quả')</code></pre>
<pre><code class="language-bash">$ node 8-async.ts</code></pre>
<div class="out">1. bắt đầu
2. đã gọi, p là [object Promise]
3. dòng này chạy TRƯỚC khi có kết quả
4. có kết quả: BS. Nguyễn Minh An
5. bắt lỗi: 404: không có bác sĩ bs-99
6. Promise.all: bs-2 bs-3 ≈100 ms (chạy song song)</div>
<ul>
<li>Line 3 printed before line 4: <code>await</code> paused only <code>main</code>; the last line of the file ran meanwhile. This is how the page stays responsive while data loads.</li>
<li>Calling <code>layBacSi</code> gives a Promise immediately (line 2); <code>await</code> unwraps its value.</li>
<li>A rejected promise becomes an exception at the <code>await</code>, caught with ordinary <code>try/catch</code> (line 5). An <code>await</code> without <code>try/catch</code> in an event handler is an unhandled error.</li>
<li><code>Promise.all</code> waits for several promises started together: two 100 ms calls took about 100 ms, not 200. Destructuring (<code>const [a, b] = …</code>) again.</li>
</ul>
<p>In React you will not call <code>fetch</code> directly inside components very often: Chapter 6 uses TanStack Query, which handles loading, errors, caching and retries around exactly these promises. But you must be able to read <code>async</code>/<code>await</code> to use it, and forms (Chapter 3) submit with <code>await</code>.</p>

<h3>The minimum TypeScript for this course</h3>
<p>The project is TypeScript from the first file, and TypeScript 6 checks strictly by default (our <code>tsconfig.app.json</code> has no <code>strict</code> line, yet the errors below appeared). You need only a few forms to start:</p>
<pre><code class="language-ts">// src/types.ts (excerpt)
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat'   // union of literal strings

export interface BacSi {          // the shape of an object
  id: string
  ten: string
  chuyenKhoa: ChuyenKhoa
  namKinhNghiem: number
  gioiThieu: string
}

// src/du-lieu/chuyen-khoa.ts
export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {  // an object with one key per specialty
  noi: 'Nội tổng quát', nhi: 'Nhi', 'da-lieu': 'Da liễu', 'rang-ham-mat': 'Răng hàm mặt',
}

// src/du-lieu/tien-ich.ts (excerpt)
export const timBacSi = (ds: BacSi[], id: string): BacSi | undefined =&gt;   // may return nothing
  ds.find((bs) =&gt; bs.id === id)</code></pre>
<p>Two mistakes, two real errors from <code>npx tsc -b</code>:</p>
<pre><code class="language-ts">locTheoChuyenKhoa(danhSachBacSi, 'tim-mach')   // a specialty that does not exist
const bs = timBacSi(danhSachBacSi, 'bs-1')
console.log(bs.ten)                      // bs might be undefined</code></pre>
<div class="out">src/minh-hoa/sai-kieu.ts(4,34): error TS2345: Argument of type '"tim-mach"' is not assignable to parameter of type 'ChuyenKhoa'.
src/minh-hoa/sai-kieu.ts(6,13): error TS18048: 'bs' is possibly 'undefined'.</div>
<p>The first is why the course uses union types instead of plain strings: a typo in a specialty is caught while you type. The second is TypeScript forcing you to handle "not found": <code>bs?.ten ?? 'Không tìm thấy'</code>, or an <code>if (!bs) return …</code>. Everything else about types — generics, utility types — comes when you need it; the <a href="/courses/typescript">TypeScript course</a> goes deeper.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p><code>var</code>, <code>function</code> everywhere, <code>this.handleClick = this.handleClick.bind(this)</code> in class constructors, <code>for</code> loops that <code>push</code> into a result array, <code>.then().catch()</code> chains, and <code>PropTypes.string.isRequired</code> → <code>const</code>, arrow functions, no <code>this</code> at all in function components, <code>map</code>/<code>filter</code>/<code>reduce</code>, <code>async/await</code> with <code>try/catch</code>, and TypeScript interfaces · <em>Why:</em> modern React is written in modern JavaScript; function components removed the whole <code>this</code>-binding problem, and array methods are expressions, which is what JSX needs. <code>.then()</code> is not wrong — <code>await</code> is built on it and you will read it in older code and library docs — but <code>await</code> reads top to bottom like the output above.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> write the four helper functions the home page needs and prove them with tests, before any JSX.</p><ol>
<li>In <code>src/du-lieu/tien-ich.ts</code> write <code>locTheoChuyenKhoa(ds, ck)</code> (with <code>filter</code>), <code>tongNamKinhNghiem(ds)</code> (with <code>reduce</code>), <code>soChuyenKhoa(ds)</code> (<code>new Set(ds.map(...)).size</code> — a <code>Set</code> keeps unique values) and <code>timBacSi(ds, id)</code> (with <code>find</code>). Type every parameter.</li>
<li>In <code>src/du-lieu/tien-ich.test.ts</code> test: filtering <code>'nhi'</code> gives ids <code>['bs-2', 'bs-6']</code> <em>and</em> <code>danhSachBacSi</code> still has 6 items; the total is 63; there are 4 specialties; <code>timBacSi(danhSachBacSi, 'bs-99')?.ten ?? 'Không tìm thấy'</code> is <code>'Không tìm thấy'</code>.</li>
<li>Run <code>npx vitest run src/du-lieu</code> and <code>npx tsc -b</code>.</li>
</ol><p><strong>Done when:</strong> the output lists four ✓ lines under <code>tiện ích danh sách bác sĩ</code> and <code>Tests  4 passed (4)</code>, and <code>tsc -b</code> prints nothing. (The solution is in the 🛠 section below.)</p></div>

<h3>🛠 Keep building the project</h3>
${slide('rx-00', 30, 'Tự gõ tiếp dự án: trang chủ tĩnh + test đầu tiên')}
<p><strong>Starting point:</strong> this is the first step — an empty folder. At the end of Section 0 you have the project that Chapter 1 starts from.</p>
<ol>
<li><strong>Create and run</strong> the project: <code>npm create vite@latest phong-kham -- --template react-ts</code> (Oxlint, No), <code>npm install</code>, <code>npm run dev</code>.</li>
<li><strong>Clean the template</strong> (Lesson 0.1): delete <code>src/App.css</code>, <code>src/assets/</code>, <code>public/icons.svg</code>; set <code>lang="vi"</code> and the title "Phòng khám An Tâm" in <code>index.html</code>.</li>
<li><strong>Data</strong>: create <code>src/types.ts</code> with the fixed types, <code>src/du-lieu/bac-si.ts</code> exporting <code>danhSachBacSi: BacSi[]</code> with the six doctors (<code>bs-1</code> BS. Nguyễn Minh An · noi · 12; <code>bs-2</code> BS. Trần Thu Hà · nhi · 8; <code>bs-3</code> BS. Lê Quốc Bảo · da-lieu · 5; <code>bs-4</code> BS. Phạm Ngọc Lan · rang-ham-mat · 15; <code>bs-5</code> BS. Hoàng Đức Huy · noi · 3; <code>bs-6</code> BS. Vũ Thảo Vy · nhi · 20) <code>src/du-lieu/chuyen-khoa.ts</code> exporting <code>TEN_CHUYEN_KHOA</code> (the Vietnamese name of each specialty), and <code>src/du-lieu/tien-ich.ts</code> from the 🧪 above. These names are fixed for the whole course: Chapter 1 imports them.</li>
<li><strong>Home page</strong> in <code>src/App.tsx</code>: a header with the clinic name; an <code>h1</code> "Phòng khám An Tâm" with a tagline; a pill "6 bác sĩ · 4 chuyên khoa" computed from <code>danhSachBacSi</code>; an "Giờ mở cửa" table built with <code>map</code> (Sunday "Nghỉ" in red); specialty chips from <code>TEN_CHUYEN_KHOA</code>; a footer with the current year. Replace <code>src/index.css</code> with your own styles.</li>
<li><strong>Tests</strong>: install Vitest + Testing Library, add the <code>test</code> block and the reference line to <code>vite.config.ts</code>, create <code>src/test/setup.ts</code> with <code>afterEach(cleanup)</code>, add the <code>test</code> script, and write <code>src/App.test.tsx</code>: the page has a level-1 heading "Phòng khám An Tâm"; the row "Chủ nhật" contains "Nghỉ".</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -b</code> prints nothing; <code>npx vitest run</code> ends with <code>Test Files  2 passed (2)</code> and <code>Tests  6 passed (6)</code>; <code>npx vite build</code> prints <code>✓ built in</code>; and <code>npm run dev</code> shows a page like the screenshot on slide 11 (header, heading, "6 bác sĩ · 4 chuyên khoa", three opening-hours rows with "Nghỉ" in red, four chips).</p>
<details><summary>Solution</summary>
<p>Verified on 25/09/2026 on a project created fresh with <code>npm create vite@latest</code>: <code>npx tsc -b</code> silent, Vitest <code>6 passed (6)</code>, build green. Files not shown (<code>main.tsx</code>, <code>tsconfig*.json</code>, <code>.oxlintrc.json</code>) stay as the template made them.</p>
<pre><code class="language-bash">$ npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
$ npm pkg set scripts.test="vitest run"</code></pre>
<p><code>src/types.ts</code></p>
<pre><code class="language-ts">// src/types.ts — kiểu dữ liệu CỐ ĐỊNH của dự án "Đặt lịch phòng khám An Tâm"
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';

export interface BacSi {
  id: string;
  ten: string;
  chuyenKhoa: ChuyenKhoa;
  namKinhNghiem: number;
  gioiThieu: string;
}

export interface KhungGio {
  id: string;
  bacSiId: string;
  batDau: string; // ISO, vd '2026-10-01T08:00:00+07:00'
  conTrong: boolean;
}

export interface BenhNhan {
  hoTen: string;
  soDienThoai: string;
  ngaySinh: string; // YYYY-MM-DD
}

export type TrangThaiLichHen = 'cho-xac-nhan' | 'da-xac-nhan' | 'da-huy';

export interface LichHen {
  id: string;
  bacSiId: string;
  khungGioId: string;
  benhNhan: BenhNhan;
  lyDo: string;
  trangThai: TrangThaiLichHen;
}</code></pre>
<p><code>src/du-lieu/bac-si.ts</code></p>
<pre><code class="language-ts">import type { BacSi } from '../types';

export const danhSachBacSi: BacSi[] = [
  { id: 'bs-1', ten: 'BS. Nguyễn Minh An', chuyenKhoa: 'noi', namKinhNghiem: 12, gioiThieu: 'Khám và theo dõi bệnh mạn tính: tăng huyết áp, tiểu đường, dạ dày.' },
  { id: 'bs-2', ten: 'BS. Trần Thu Hà', chuyenKhoa: 'nhi', namKinhNghiem: 8, gioiThieu: 'Khám trẻ từ sơ sinh tới 15 tuổi, tư vấn dinh dưỡng và tiêm chủng.' },
  { id: 'bs-3', ten: 'BS. Lê Quốc Bảo', chuyenKhoa: 'da-lieu', namKinhNghiem: 5, gioiThieu: 'Mụn trứng cá, viêm da cơ địa, chăm sóc da sau điều trị.' },
  { id: 'bs-4', ten: 'BS. Phạm Ngọc Lan', chuyenKhoa: 'rang-ham-mat', namKinhNghiem: 15, gioiThieu: 'Nhổ răng khôn, trám răng, chỉnh nha cho người lớn.' },
  { id: 'bs-5', ten: 'BS. Hoàng Đức Huy', chuyenKhoa: 'noi', namKinhNghiem: 3, gioiThieu: 'Khám tổng quát, đọc kết quả xét nghiệm, tư vấn lối sống.' },
  { id: 'bs-6', ten: 'BS. Vũ Thảo Vy', chuyenKhoa: 'nhi', namKinhNghiem: 20, gioiThieu: 'Hô hấp nhi, hen phế quản ở trẻ, khám sức khoẻ định kỳ.' },
];</code></pre>
<p><code>src/du-lieu/chuyen-khoa.ts</code></p>
<pre><code class="language-ts">import type { ChuyenKhoa } from '../types';

export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {
  noi: 'Nội tổng quát',
  nhi: 'Nhi',
  'da-lieu': 'Da liễu',
  'rang-ham-mat': 'Răng hàm mặt',
};</code></pre>
<p><code>src/du-lieu/tien-ich.ts</code></p>
<pre><code class="language-ts">// src/du-lieu/tien-ich.ts — vài hàm JS thuần làm việc với danh sách bác sĩ (Bài 0.3)
import type { BacSi, ChuyenKhoa } from '../types';

/** Lọc bác sĩ theo chuyên khoa — trả MẢNG MỚI, không đụng mảng gốc. */
export const locTheoChuyenKhoa = (ds: BacSi[], ck: ChuyenKhoa): BacSi[] =&gt;
  ds.filter((bs) =&gt; bs.chuyenKhoa === ck);

/** Tổng số năm kinh nghiệm của cả danh sách. */
export const tongNamKinhNghiem = (ds: BacSi[]): number =&gt;
  ds.reduce((tong, bs) =&gt; tong + bs.namKinhNghiem, 0);

/** Đếm số chuyên khoa KHÁC NHAU đang có bác sĩ. */
export const soChuyenKhoa = (ds: BacSi[]): number =&gt;
  new Set(ds.map((bs) =&gt; bs.chuyenKhoa)).size;

/** Tìm theo id; không thấy thì undefined (dùng với ?. và ??). */
export const timBacSi = (ds: BacSi[], id: string): BacSi | undefined =&gt;
  ds.find((bs) =&gt; bs.id === id);</code></pre>
<p><code>src/App.tsx</code></p>
<pre><code class="language-tsx">import { danhSachBacSi } from './du-lieu/bac-si'
import { TEN_CHUYEN_KHOA } from './du-lieu/chuyen-khoa'
import { soChuyenKhoa } from './du-lieu/tien-ich'

const GIO_MO_CUA = [
  { thu: 'Thứ 2 – Thứ 6', gio: '07:30 – 19:00' },
  { thu: 'Thứ 7', gio: '07:30 – 12:00' },
  { thu: 'Chủ nhật', gio: 'Nghỉ' },
]

function App() {
  const tenPhongKham = 'Phòng khám An Tâm'
  const namNay = new Date().getFullYear()

  return (
    &lt;div className="trang"&gt;
      &lt;header className="dau-trang"&gt;
        &lt;span className="logo" aria-hidden="true"&gt;✚&lt;/span&gt;
        &lt;strong&gt;{tenPhongKham}&lt;/strong&gt;
      &lt;/header&gt;

      &lt;main&gt;
        &lt;section className="gioi-thieu"&gt;
          &lt;h1&gt;{tenPhongKham}&lt;/h1&gt;
          &lt;p className="khau-hieu"&gt;Khám nhanh, hẹn đúng giờ, không phải xếp hàng.&lt;/p&gt;
          &lt;p className="so-lieu"&gt;
            {danhSachBacSi.length} bác sĩ · {soChuyenKhoa(danhSachBacSi)} chuyên khoa
          &lt;/p&gt;
        &lt;/section&gt;

        &lt;section className="o-thong-tin"&gt;
          &lt;h2&gt;Giờ mở cửa&lt;/h2&gt;
          &lt;table&gt;
            &lt;tbody&gt;
              {GIO_MO_CUA.map((dong) =&gt; (
                &lt;tr key={dong.thu}&gt;
                  &lt;th scope="row"&gt;{dong.thu}&lt;/th&gt;
                  &lt;td className={dong.gio === 'Nghỉ' ? 'nghi' : undefined}&gt;{dong.gio}&lt;/td&gt;
                &lt;/tr&gt;
              ))}
            &lt;/tbody&gt;
          &lt;/table&gt;
        &lt;/section&gt;

        &lt;section className="o-thong-tin"&gt;
          &lt;h2&gt;Chuyên khoa&lt;/h2&gt;
          &lt;ul className="chip"&gt;
            {Object.values(TEN_CHUYEN_KHOA).map((ten) =&gt; (
              &lt;li key={ten}&gt;{ten}&lt;/li&gt;
            ))}
          &lt;/ul&gt;
        &lt;/section&gt;
      &lt;/main&gt;

      &lt;footer className="chan-trang"&gt;
        © {namNay} {tenPhongKham} · dữ liệu minh hoạ cho khoá React
      &lt;/footer&gt;
    &lt;/div&gt;
  )
}

export default App</code></pre>
<p><code>src/index.css</code></p>
<pre><code class="language-css">:root {
  --chu: #1f2937;
  --chu-phu: #6b7280;
  --nen: #f6f8fb;
  --the: #ffffff;
  --vien: #e5e7eb;
  --nhan: #0e8a7e;
  font: 17px/1.5 system-ui, 'Segoe UI', Roboto, sans-serif;
  color: var(--chu);
  background: var(--nen);
}
* { box-sizing: border-box; }
body { margin: 0; }
.trang { max-width: 880px; margin: 0 auto; padding: 0 20px 32px; }
.dau-trang { display: flex; align-items: center; gap: 10px; padding: 18px 0; border-bottom: 1px solid var(--vien); }
.logo { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 9px; background: var(--nhan); color: #fff; font-weight: 700; }
.gioi-thieu { padding: 36px 0 20px; }
.gioi-thieu h1 { font-size: 40px; margin: 0 0 6px; color: #0b3b36; }
.khau-hieu { margin: 0; font-size: 20px; color: var(--chu-phu); }
.so-lieu { display: inline-block; margin-top: 16px; padding: 6px 14px; border-radius: 999px; background: #dff3f0; color: var(--nhan); font-weight: 600; }
.o-thong-tin { background: var(--the); border: 1px solid var(--vien); border-radius: 14px; padding: 18px 22px; margin-top: 18px; }
.o-thong-tin h2 { margin: 0 0 10px; font-size: 20px; }
table { border-collapse: collapse; width: 100%; }
th, td { text-align: left; padding: 8px 0; border-top: 1px solid var(--vien); }
th { font-weight: 500; color: var(--chu-phu); width: 45%; }
td.nghi { color: #b91c1c; font-weight: 600; }
.chip { list-style: none; display: flex; flex-wrap: wrap; gap: 10px; padding: 0; margin: 0; }
.chip li { padding: 6px 14px; border-radius: 999px; border: 1px solid var(--nhan); color: var(--nhan); }
.chan-trang { margin-top: 28px; font-size: 14px; color: var(--chu-phu); }</code></pre>
<p><code>vite.config.ts</code></p>
<pre><code class="language-ts">/// &lt;reference types="vitest/config" /&gt;
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})</code></pre>
<p><code>src/test/setup.ts</code></p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest không bật "globals" ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test thứ hai thấy cả trang của test thứ nhất.
afterEach(cleanup)</code></pre>
<p><code>src/App.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('trang chủ hiện tên phòng khám làm tiêu đề chính', () =&gt; {
  render(&lt;App /&gt;)
  expect(
    screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' }),
  ).toBeInTheDocument()
})

test('trang chủ có bảng giờ mở cửa, Chủ nhật nghỉ', () =&gt; {
  render(&lt;App /&gt;)
  expect(screen.getByRole('heading', { name: 'Giờ mở cửa' })).toBeInTheDocument()
  expect(screen.getByRole('row', { name: /Chủ nhật/ })).toHaveTextContent('Nghỉ')
})</code></pre>
<p><code>src/du-lieu/tien-ich.test.ts</code></p>
<pre><code class="language-ts">import { describe, expect, test } from 'vitest'
import { danhSachBacSi } from './bac-si'
import { locTheoChuyenKhoa, soChuyenKhoa, timBacSi, tongNamKinhNghiem } from './tien-ich'

describe('tiện ích danh sách bác sĩ', () =&gt; {
  test('lọc khoa nhi ra 2 bác sĩ, mảng gốc giữ nguyên 6', () =&gt; {
    const nhi = locTheoChuyenKhoa(danhSachBacSi, 'nhi')
    expect(nhi.map((bs) =&gt; bs.id)).toEqual(['bs-2', 'bs-6'])
    expect(danhSachBacSi).toHaveLength(6)
  })
  test('tổng năm kinh nghiệm là 63', () =&gt; {
    expect(tongNamKinhNghiem(danhSachBacSi)).toBe(63)
  })
  test('có 4 chuyên khoa khác nhau', () =&gt; {
    expect(soChuyenKhoa(danhSachBacSi)).toBe(4)
  })
  test('tìm id không có thì undefined, ?. và ?? cho chữ thay thế', () =&gt; {
    const bs = timBacSi(danhSachBacSi, 'bs-99')
    expect(bs?.ten ?? 'Không tìm thấy').toBe('Không tìm thấy')
  })
})</code></pre>
<p>In <code>index.html</code>: <code>&lt;html lang="vi"&gt;</code> and <code>&lt;title&gt;Phòng khám An Tâm&lt;/title&gt;</code>. Result:</p>
<pre><code class="language-bash">$ npx tsc -b
$ npx vitest run --reporter=verbose</code></pre>
<div class="out"> ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; lọc khoa nhi ra 2 bác sĩ, mảng gốc giữ nguyên 6 3ms
 ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; tổng năm kinh nghiệm là 63 0ms
 ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; có 4 chuyên khoa khác nhau 0ms
 ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; tìm id không có thì undefined, ?. và ?? cho chữ thay thế 1ms
 ✓ src/App.test.tsx &gt; trang chủ hiện tên phòng khám làm tiêu đề chính 165ms
 ✓ src/App.test.tsx &gt; trang chủ có bảng giờ mở cửa, Chủ nhật nghỉ 53ms

 Test Files  2 passed (2)
      Tests  6 passed (6)</div>
<pre><code class="language-bash">$ npx vite build</code></pre>
<div class="out">✓ 19 modules transformed.
dist/index.html                   0.47 kB │ gzip:  0.31 kB
dist/assets/index-Cni7a6VB.css    1.39 kB │ gzip:  0.63 kB
dist/assets/index-CcUL7llf.js   222.07 kB │ gzip: 69.86 kB
✓ built in 353ms</div>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">arrow function</span><span class="v"><code>(x) =&gt; x * 2</code>; one expression is returned automatically</span></div>
<div class="kv"><span class="k">destructuring</span><span class="v"><code>const { a } = obj</code>, <code>const [x, y] = arr</code> — take fields/items into variables</span></div>
<div class="kv"><span class="k">spread / rest</span><span class="v"><code>...</code>: copy into a new array/object (one level), or gather the remaining items</span></div>
<div class="kv"><span class="k">reference equality</span><span class="v"><code>===</code> on objects asks "same object?"; React compares state this way</span></div>
<div class="kv"><span class="k">falsy</span><span class="v"><code>false, 0, '', null, undefined, NaN</code> — everything else is truthy</span></div>
<div class="kv"><span class="k"><code>?.</code> / <code>??</code></span><span class="v">stop at null/undefined / default only for null/undefined</span></div>
<div class="kv"><span class="k">closure</span><span class="v">a function plus the variables it saw when created; keeps old values</span></div>
<div class="kv"><span class="k">Promise / await</span><span class="v">a future result; <code>await</code> pauses the async function, not the program</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>const</code> and arrow functions everywhere; template literals for text with values.</li>
<li>Destructuring reads props (<code>{ bacSi }</code>) and hook results (<code>[dem, setDem]</code>).</li>
<li>Update data by copying: <code>{ ...obj, x }</code>, <code>[...arr, y]</code>, <code>filter</code> to remove — spread is one level deep; <code>sort()</code>/<code>push()</code> mutate.</li>
<li>React compares state by reference: a new object means "changed", the same object means "unchanged".</li>
<li><code>map</code> turns data into JSX; <code>filter</code>, <code>find</code>, <code>reduce</code> compute what to show; <code>?.</code> and <code>??</code> handle "not found" without crashes.</li>
<li>Named vs default exports; closures keep old values; <code>await</code> waits inside the function while the page keeps running.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Importing and Exporting Components</span><span class="lc-sub">react.dev/learn/importing-and-exporting-components — default vs named exports for components.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Rendering Lists</span><span class="lc-sub">react.dev/learn/rendering-lists — <code>map</code> and <code>filter</code> turned into JSX, the next step after this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Updating Arrays in State</span><span class="lc-sub">react.dev/learn/updating-arrays-in-state — the table of mutating vs non-mutating array methods (avoid <code>sort</code>, prefer copies).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Using TypeScript</span><span class="lc-sub">react.dev/learn/typescript — typing props and hooks, where this lesson&#39;s minimum TypeScript leads.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — beyond the minimum</span><span class="lc-sub">/courses/typescript/learn${REF} — unions, interfaces, generics and strict mode in depth.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>JavaScript bạn cần cho React (chạy thật trên danh sách bác sĩ)</h2>
<p class="lead">React phần lớn là JavaScript. Sinh viên thấy React "khó" thường là thấy một nhúm tính năng JavaScript khó: destructuring, spread, <code>map</code>, <code>?.</code>, <code>async</code>. Bài này chạy từng thứ trên dữ liệu thật của dự án — sáu bác sĩ — và in ra điều xảy ra, để từ Chương 1 trở đi bạn đọc được mọi dòng của một component. Cuối bài bạn dựng dữ liệu và trang chủ của dự án: bước 🛠 đầu tiên.</p>

<p>Cách dùng bài này: mỗi ví dụ là một file <code>.ts</code> nhỏ đã chạy bằng <code>node</code> (Node 22 chạy thẳng file TypeScript bằng cách bóc kiểu) và đã kiểm kiểu bằng <code>tsc</code>. Tự gõ lại và so output của bạn. Dữ liệu chúng dùng là <code>src/du-lieu/bac-si.ts</code>: mảng <code>danhSachBacSi</code> gồm sáu bác sĩ với <code>id</code>, <code>ten</code>, <code>chuyenKhoa</code>, <code>namKinhNghiem</code> và <code>gioiThieu</code>.</p>

<h3>Biến, hàm mũi tên và template literal</h3>
<pre><code class="language-ts">const ten = 'BS. Trần Thu Hà'
let soLuot = 0
soLuot = soLuot + 1

function chaoCu(t: string) { return 'Xin chào ' + t }   // hàm kiểu cũ
const chao = (t: string) =&gt; &#96;Xin chào &#36;{t}&#96;              // hàm mũi tên + template literal
const binhPhuong = (x: number) =&gt; x * x                  // một biểu thức ⇒ tự return

console.log(chaoCu(ten))
console.log(chao(ten), '· lượt', soLuot)
console.log(binhPhuong(7))
try {
  // @ts-expect-error — cố ý gán lại const
  ten = 'khác'
} catch (e) { console.log('Lỗi:', (e as Error).message) }</code></pre>
<pre><code class="language-bash">$ node 1-bien-ham.ts</code></pre>
<div class="out">Xin chào BS. Trần Thu Hà
Xin chào BS. Trần Thu Hà · lượt 1
49
Lỗi: Assignment to constant variable.</div>
<ul>
<li><strong><code>const</code></strong> cho tên không bao giờ gán lại (gần như mọi thứ trong React), <strong><code>let</code></strong> khi buộc phải gán lại. Quên <code>var</code> đi: luật phạm vi của nó là nguồn của những bug kinh điển, code hiện đại không dùng. Lưu ý <code>const</code> chỉ cấm <em>gán lại cái tên</em>, không cấm sửa bên trong object: <code>const bs = {…}; bs.ten = 'x'</code> vẫn được. Khác biệt này quan trọng ngay dưới đây.</li>
<li><strong>Hàm mũi tên</strong> <code>(x) =&gt; x * x</code> là cách viết hàm hằng ngày trong React: hàm xử lý sự kiện, hàm truyền cho <code>map</code>, hàm tiện ích nhỏ. Có một biểu thức sau <code>=&gt;</code> thì giá trị tự được trả về; có ngoặc nhọn thì phải viết <code>return</code>. Muốn trả thẳng một object, bọc nó trong ngoặc tròn: <code>() =&gt; ({ ten: 'An' })</code>.</li>
<li><strong>Template literal</strong> dùng dấu backtick và <code>&#36;{…}</code> để chèn giá trị: <code>&#96;Đặt &#36;{k.gio}&#96;</code>. Bạn đã thấy nó ở các nút đặt lịch của Bài 2/2.</li>
</ul>

<h3>Destructuring: rút trường ra theo tên hoặc theo vị trí</h3>
${slide('rx-00', 23, 'Destructuring và spread, chạy thật')}
<p>Destructuring là cú pháp bên trái dấu <code>=</code> dùng để tách một object hay một mảng. Bạn sẽ thấy nó ở dòng đầu của gần như mọi component, nên đáng chạy thử một lần:</p>
<pre><code class="language-ts">import { danhSachBacSi } from '../../ch00/src/du-lieu/bac-si.ts'

const bs = danhSachBacSi[1]
// Destructuring object: rút trường ra biến cùng tên
const { ten, chuyenKhoa } = bs
console.log(ten, '|', chuyenKhoa)

// Đổi tên + giá trị mặc định
const { namKinhNghiem: soNam, anh = '/anh-mac-dinh.png' } = { ...bs, anh: undefined }
console.log(soNam, '|', anh)

// Destructuring mảng: lấy theo VỊ TRÍ — y hệt cách dùng useState
const [dau, thuHai, ...conLai] = danhSachBacSi.map((b) =&gt; b.id)
console.log(dau, thuHai, conLai)

// Trong tham số hàm — y hệt cách component nhận props
function TheNho({ ten, namKinhNghiem }: { ten: string; namKinhNghiem: number }) {
  return &#96;&#36;{ten} (&#36;{namKinhNghiem} năm)&#96;
}
console.log(TheNho(bs))</code></pre>
<pre><code class="language-bash">$ node 2-destructuring.ts</code></pre>
<div class="out">BS. Trần Thu Hà | nhi
8 | /anh-mac-dinh.png
bs-1 bs-2 [ 'bs-3', 'bs-4', 'bs-5', 'bs-6' ]
BS. Trần Thu Hà (8 năm)</div>
<p>Bốn dạng, bốn chỗ bạn sẽ gặp trong React:</p>
<ul>
<li><code>const { ten, chuyenKhoa } = bs</code> là cách viết tắt của <code>const ten = bs.ten; const chuyenKhoa = bs.chuyenKhoa</code>.</li>
<li><code>namKinhNghiem: soNam</code> đổi tên; <code>anh = '…'</code> cho giá trị mặc định, chỉ dùng khi giá trị là <code>undefined</code>.</li>
<li><code>const [dau, thuHai, ...conLai] = …</code> lấy phần tử mảng theo vị trí; <code>...conLai</code> gom phần còn lại vào một mảng mới. Đó là lý do <code>const [dem, setDem] = useState(0)</code> chạy được: <code>useState</code> trả về một mảng hai phần tử, và bạn đặt tên chúng tuỳ ý.</li>
<li><code>function TheNho({ ten, namKinhNghiem })</code> tách ngay <em>tham số</em>. Component React nhận một object — props của nó — và đây là cách chuẩn để đọc: <code>function TheBacSi({ bacSi, onChon })</code>.</li>
</ul>

<h3>Spread: chép rồi sửa — và "chép" thật ra nghĩa là gì</h3>
<p>Ba dấu chấm có hai việc. Ở vế phải dấu <code>=</code> (hoặc trong <code>[ ]</code>/<code>{ }</code>) chúng <strong>trải ra</strong> (spread) — chép mọi phần tử hay mọi trường vào một mảng hay object mới. Trong danh sách tham số chúng <strong>gom lại</strong> (rest) — gom các đối số còn lại vào một mảng.</p>
<pre><code class="language-ts">const goc = danhSachBacSi[0]
const banSao = { ...goc, namKinhNghiem: goc.namKinhNghiem + 1 } // copy rồi ghi đè một trường
console.log(goc.namKinhNghiem, banSao.namKinhNghiem, goc === banSao)

const them = [...danhSachBacSi.slice(0, 2), { ...danhSachBacSi[2], ten: 'BS. Mới' }]
console.log(them.map((b) =&gt; b.ten))

// Spread chỉ copy MỘT TẦNG (shallow)
const lich = { id: 'lh-1', benhNhan: { hoTen: 'Lan', soDienThoai: '0912345678' } }
const lich2 = { ...lich }
lich2.benhNhan.hoTen = 'Mai'
console.log(lich.benhNhan.hoTen, lich.benhNhan === lich2.benhNhan)

// Rest trong tham số: gom phần còn lại
const tong = (...so: number[]) =&gt; so.reduce((a, b) =&gt; a + b, 0)
console.log(tong(12, 8, 5))</code></pre>
<pre><code class="language-bash">$ node 3-spread.ts</code></pre>
<div class="out">12 13 false
[ 'BS. Nguyễn Minh An', 'BS. Trần Thu Hà', 'BS. Mới' ]
Mai true
25</div>
<p>Dòng 1: bản gốc vẫn 12 năm, bản sao 13, và chúng là hai object khác nhau (<code>false</code>). Mẫu "chép rồi sửa bản chép" này là cách cập nhật state trong React: bạn không bao giờ sửa object cũ, bạn tạo object mới bằng <code>{ ...cu, truong: moi }</code> hoặc mảng mới bằng <code>[...cu, moi]</code>. Dòng 3 là cái bẫy: sửa <code>lich2.benhNhan.hoTen</code> cũng sửa luôn <code>lich</code>, vì spread chỉ chép <em>tham chiếu</em> tới object <code>benhNhan</code> bên trong, không chép chính object đó (<code>true</code>: cùng một object). Muốn sửa một trường lồng bên trong thì chép từng tầng bạn đụng vào: <code>{ ...lich, benhNhan: { ...lich.benhNhan, hoTen: 'Mai' } }</code>. Chương 2 luyện việc này tới khi thành phản xạ.</p>

<h3>Cùng giá trị hay cùng object? So sánh theo tham chiếu</h3>
<pre><code class="language-ts">const a = [1, 2]
const b = [1, 2]
const c = a
console.log('a === b', a === b, '| a === c', a === c)
c.push(3)
console.log('a sau c.push(3):', a)
const d = [...a, 4]
console.log('d === a', d === a, '| Object.is({}, {})', Object.is({}, {}))
console.log("'1' == 1", '1' == (1 as unknown), "| '1' === 1", '1' === (1 as unknown))</code></pre>
<pre><code class="language-bash">$ node 6-so-sanh.ts</code></pre>
<div class="out">a === b false | a === c true
a sau c.push(3): [ 1, 2, 3 ]
d === a false | Object.is({}, {}) false
'1' == 1 true | '1' === 1 false</div>
<p>Với mảng và object, <code>===</code> hỏi "có phải <em>cùng một object</em> không?", chứ không hỏi "có chứa cùng thứ không?". <code>a</code> và <code>b</code> trông y hệt nhưng là hai mảng; <code>c</code> chỉ là một cái tên khác của <code>a</code>, nên push vào <code>c</code> là đổi <code>a</code>. React dùng đúng phép kiểm rẻ này (<code>Object.is</code>) để quyết định state có đổi không. Nếu bạn <code>push</code> vào mảng state rồi set lại nó, React thấy <em>cùng</em> mảng cũ và có thể bỏ qua cập nhật — bug phổ biến nhất của người mới ở Chương 2. Một mảng mới (<code>[...a, 4]</code>) là object khác, nên React nhận ra. Và luôn dùng <code>===</code>, đừng dùng <code>==</code>: dấu bằng đôi tự đổi kiểu (<code>'1' == 1</code> ra <code>true</code>).</p>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "Shallow copy và deep copy khác nhau thế nào? Vì sao quan trọng với React?"</p>
<p>Ý trả lời: shallow copy (<code>{ ...obj }</code>, <code>[...arr]</code>) tạo object mới ở tầng ngoài nhưng dùng lại các object lồng bên trong; deep copy nhân bản mọi tầng (<code>structuredClone(obj)</code>). React so state theo tham chiếu, nên một lần cập nhật phải tạo object mới dọc theo đường dẫn đã đổi — và chỉ đường dẫn đó. Sửa object lồng bên trong một bản shallow copy là sửa luôn state cũ, gây giao diện cũ và bug; deep copy tất cả thì chạy nhưng tốn bộ nhớ và phá memo. Câu trả lời thường gặp là "chép từng tầng bạn đổi".</p></div>

<h3>map, filter, find, reduce: vòng lặp trả về giá trị</h3>
${slide('rx-00', 24, 'map, filter, find, reduce trên danhSachBacSi')}
<p>Trong React bạn hiếm khi viết vòng <code>for</code>, vì JSX cần <em>biểu thức</em> và những hàm mảng này trả về giá trị. Mỗi hàm nhận một hàm khác, được gọi một lần cho mỗi phần tử:</p>
<pre><code class="language-ts">console.log('map    →', danhSachBacSi.map((b) =&gt; b.id).join(' '))
console.log('filter →', danhSachBacSi.filter((b) =&gt; b.namKinhNghiem &gt;= 10).map((b) =&gt; b.ten))
console.log('find   →', danhSachBacSi.find((b) =&gt; b.chuyenKhoa === 'da-lieu')?.ten)
console.log('some   →', danhSachBacSi.some((b) =&gt; b.namKinhNghiem &gt; 18))
console.log('reduce →', danhSachBacSi.reduce((tong, b) =&gt; tong + b.namKinhNghiem, 0))

const theoKhoa = danhSachBacSi.reduce&lt;Record&lt;string, number&gt;&gt;((dem, b) =&gt; {
  dem[b.chuyenKhoa] = (dem[b.chuyenKhoa] ?? 0) + 1
  return dem
}, {})
console.log('đếm   →', theoKhoa)

// sort() SỬA mảng gốc; toSorted() trả mảng mới
const ids = danhSachBacSi.map((b) =&gt; b.id)
const xepMoi = ids.toSorted().reverse()
console.log('toSorted:', xepMoi.join(' '), '| gốc:', ids.join(' '))
ids.sort((a, b) =&gt; (a &lt; b ? 1 : -1))
console.log('sau sort(): gốc đã đổi thành', ids.join(' '))</code></pre>
<pre><code class="language-bash">$ node 4-mang.ts</code></pre>
<div class="out">map    → bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
filter → [ 'BS. Nguyễn Minh An', 'BS. Phạm Ngọc Lan', 'BS. Vũ Thảo Vy' ]
find   → BS. Lê Quốc Bảo
some   → true
reduce → 63
đếm   → { noi: 2, nhi: 2, 'da-lieu': 1, 'rang-ham-mat': 1 }
toSorted: bs-6 bs-5 bs-4 bs-3 bs-2 bs-1 | gốc: bs-1 bs-2 bs-3 bs-4 bs-5 bs-6
sau sort(): gốc đã đổi thành bs-6 bs-5 bs-4 bs-3 bs-2 bs-1</div>
<table>
<thead><tr><th>Hàm</th><th>Trả về</th><th>Trong React bạn dùng nó để…</th></tr></thead>
<tbody>
<tr><td><code>map(fn)</code></td><td>mảng mới, cùng độ dài</td><td>biến dữ liệu thành JSX: <code>ds.map((b) =&gt; &lt;TheBacSi key={b.id} bacSi={b} /&gt;)</code></td></tr>
<tr><td><code>filter(fn)</code></td><td>mảng mới gồm phần tử làm <code>fn</code> đúng</td><td>lọc danh sách theo chuyên khoa; <strong>xoá</strong> một phần tử khỏi state: <code>ds.filter((b) =&gt; b.id !== id)</code></td></tr>
<tr><td><code>find(fn)</code></td><td>phần tử khớp đầu tiên, hoặc <code>undefined</code></td><td>lấy bác sĩ đang chọn theo id</td></tr>
<tr><td><code>some(fn)</code> / <code>every(fn)</code></td><td><code>true</code>/<code>false</code></td><td>"còn khung nào trống không?", "mọi ô đã hợp lệ chưa?"</td></tr>
<tr><td><code>reduce(fn, đầu)</code></td><td>một giá trị gộp từ mọi phần tử</td><td>tổng, đếm theo nhóm (như <code>theoKhoa</code> ở trên)</td></tr>
<tr><td><code>toSorted(fn)</code></td><td>mảng mới đã sắp</td><td>sắp để hiển thị mà không đụng state</td></tr>
</tbody>
</table>
<p>Hai mẹo đọc. <code>reduce((tong, b) =&gt; tong + b.namKinhNghiem, 0)</code>: số <code>0</code> là giá trị ban đầu; mỗi lần gọi nhận tổng đang có và phần tử kế tiếp, trả về tổng mới. <code>(dem[b.chuyenKhoa] ?? 0) + 1</code> đọc là "số đếm hiện tại, chưa có thì 0, cộng một" — <code>??</code> được giải thích ngay dưới. Phần generic <code>reduce&lt;Record&lt;string, number&gt;&gt;</code> báo TypeScript rằng kết quả là object có khoá chuỗi, giá trị số.</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — sắp xếp thẳng trên mảng state.</strong> Một danh sách bác sĩ có nút "xếp theo kinh nghiệm": <code>setBacSi(bacSi.sort((a, b) =&gt; b.namKinhNghiem - a.namKinhNghiem))</code>. Hai dòng output cuối cho thấy vì sao sai: <code>sort()</code> xếp lại <em>chính</em> mảng gốc và trả về đúng mảng đó. Bạn đã sửa trực tiếp state, và đưa lại cho React cùng một object, nên tuỳ tình huống danh sách không vẽ lại, hoặc sau này vẽ lại theo thứ tự khó hiểu, và mọi component khác đang giữ mảng cũ thấy nó bị xáo trộn. Dùng <code>bacSi.toSorted(...)</code> (ES2023, có trong mọi trình duyệt hiện tại và trong <code>lib</code> TypeScript của dự án) hoặc <code>[...bacSi].sort(...)</code>. Tương tự với <code>reverse()</code>, <code>splice()</code> và <code>push()</code> — cái nào cũng có bản không sửa gốc (<code>toReversed</code>, <code>toSpliced</code>, spread).</div>

<h3>Truthy và falsy, ?. và ??</h3>
${slide('rx-00', 25, '?. và ??, cùng bảng truthy/falsy')}
<pre><code class="language-ts">const khongCo = danhSachBacSi.find((b) =&gt; b.id === 'bs-99')
console.log('?.  →', khongCo?.ten)
console.log('??  →', khongCo?.ten ?? 'Không tìm thấy')
try { console.log((khongCo as any).ten) } catch (e) { console.log('không ?. →', (e as Error).message) }

// || coi 0 và '' là "không có"; ?? chỉ coi null/undefined là "không có"
const soPhong: number = 0
const ghiChu: string = ''
console.log('soPhong || 99 =', soPhong || 99, '· soPhong ?? 99 =', soPhong ?? 99)
console.log("ghiChu || 'trống' =", ghiChu || 'trống', "· ghiChu ?? 'trống' =", JSON.stringify(ghiChu ?? 'trống'))

// truthy / falsy
const nhan = (v: unknown) =&gt; (Number.isNaN(v) || v === undefined ? String(v) : JSON.stringify(v))
for (const v of [0, '', null, undefined, NaN, [], {}, '0']) console.log(nhan(v), '→', v ? 'truthy' : 'falsy')</code></pre>
<pre><code class="language-bash">$ node 5-optional.ts</code></pre>
<div class="out">?.  → undefined
??  → Không tìm thấy
không ?. → Cannot read properties of undefined (reading 'ten')
soPhong || 99 = 99 · soPhong ?? 99 = 0
ghiChu || 'trống' = trống · ghiChu ?? 'trống' = ""
0 → falsy
"" → falsy
null → falsy
undefined → falsy
NaN → falsy
[] → truthy
{} → truthy
"0" → truthy</div>
<ul>
<li>Giá trị <strong>falsy</strong> đúng sáu cái: <code>false</code>, <code>0</code>, <code>''</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Mọi thứ khác là <strong>truthy</strong> — kể cả mảng rỗng <code>[]</code> và chuỗi <code>'0'</code>. Nên <code>if (ds)</code> luôn đúng với một mảng; hãy kiểm <code>ds.length &gt; 0</code>.</li>
<li><strong><code>?.</code> (optional chaining)</strong>: <code>khongCo?.ten</code> nghĩa là "nếu <code>khongCo</code> là <code>null</code> hay <code>undefined</code> thì dừng và cho <code>undefined</code>; không thì đọc <code>.ten</code>". Không có nó bạn gặp lỗi lúc chạy phổ biến nhất của JavaScript, <code>Cannot read properties of undefined</code>. Nó dùng được cả cho lời gọi: <code>onChon?.(id)</code> chỉ gọi hàm khi hàm tồn tại.</li>
<li><strong><code>??</code> (nullish coalescing)</strong>: <code>a ?? b</code> cho <code>b</code> chỉ khi <code>a</code> là <code>null</code> hoặc <code>undefined</code>. <code>||</code> cho <code>b</code> với <em>mọi</em> <code>a</code> falsy — nên <code>soPhong || 99</code> biến phòng số 0 có thật thành 99, và <code>ghiChu || 'trống'</code> thay mất một ghi chú cố ý để trống. Dùng <code>??</code> cho giá trị mặc định; chỉ dùng <code>||</code> khi 0 và <code>''</code> cũng nên coi là "không có".</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong> "<code>||</code> và <code>??</code> khác nhau thế nào?"</p>
<p>Ý trả lời: <code>||</code> trả vế phải khi vế trái là bất kỳ giá trị falsy nào (<code>0</code>, <code>''</code>, <code>false</code>, <code>NaN</code>, <code>null</code>, <code>undefined</code>); <code>??</code> chỉ khi nó là <code>null</code> hoặc <code>undefined</code>. Với giá trị mặc định mà 0 hay chuỗi rỗng là hợp lệ — số lượng, số trang, ghi chú — <code>??</code> mới đúng, còn <code>||</code> là bug. <code>?.</code> là bạn đồng hành: nó dừng chuỗi truy cập ở <code>null</code>/<code>undefined</code> đầu tiên thay vì ném lỗi.</p></div>

<h3>import và export: các file nói chuyện với nhau thế nào</h3>
${slide('rx-00', 26, 'import/export: đúng tên, đúng loại')}
<p>Mỗi file là một <strong>module</strong>: biến của nó là riêng tư trừ khi nó <code>export</code>. Có hai loại export, và nhầm chúng cho ra hai lỗi khác nhau:</p>
<pre><code class="language-ts">// tien-ich.ts
export const TEN_PHONG_KHAM = 'Phòng khám An Tâm'          // export có tên (named)
export function dinhDangGio(gio: string) { return &#96;&#36;{gio} (giờ VN)&#96; }
export default function chao() { return 'Xin chào!' }      // export mặc định (default) — tối đa MỘT

// dung.ts
import chao, { TEN_PHONG_KHAM, dinhDangGio as gio } from './tien-ich.ts'
console.log(chao(), TEN_PHONG_KHAM, gio('08:00'))</code></pre>
<div class="out">Xin chào! Phòng khám An Tâm 08:00 (giờ VN)</div>
<p>Export có tên được import trong <code>{ }</code> với đúng tên của nó (đổi tên bằng <code>as</code>); export mặc định được import không có ngoặc, với tên tuỳ bạn. Lỡ import cái mặc định bằng ngoặc nhọn thì cả Node lẫn TypeScript chặn bạn:</p>
<pre><code class="language-bash">$ node mod/sai.ts        # import { chao } from './tien-ich.ts'</code></pre>
<div class="out">import { chao } from './tien-ich.ts'
         ^^^^
SyntaxError: The requested module './tien-ich.ts' does not provide an export named 'chao'</div>
<div class="out">mod/sai.ts(1,10): error TS2614: Module '"./tien-ich.ts"' has no exported member 'chao'. Did you mean to use 'import chao from "./tien-ich.ts"' instead?</div>
<p>Quy ước trong khoá: mỗi file một component, export mặc định (<code>export default App</code>, như template) hoặc export có tên khi một file gom vài component nhỏ; hàm tiện ích, hằng số và kiểu luôn export có tên. Import kiểu bằng <code>import type { BacSi } from '../types'</code>: cấu hình <code>verbatimModuleSyntax</code> của template đòi vậy, và nó báo trình biên dịch rằng dòng import này biến mất khi chạy. Trong dự án Vite bạn bỏ đuôi <code>.ts</code> (<code>'./du-lieu/bac-si'</code>); các script chạy bằng Node trần ở trên thì cần.</p>

<h3>Closure: hàm nhớ nơi nó được tạo ra</h3>
<pre><code class="language-ts">function taoBoDem() {
  let dem = 0
  return () =&gt; { dem = dem + 1; return dem }
}
const bam = taoBoDem()
bam(); bam()
console.log('bấm 3 lần →', bam())

// Closure giữ GIÁ TRỊ CŨ: xem trước "stale closure" của Chương 4
let soLich = 1
const hen = () =&gt; { const luc = soLich; setTimeout(() =&gt; console.log('hẹn giờ thấy soLich =', luc, '| hiện tại =', soLich), 10) }
hen()
soLich = 5</code></pre>
<div class="out">bấm 3 lần → 3
hẹn giờ thấy soLich = 1 | hiện tại = 5</div>
<p><strong>Closure</strong> là một hàm cùng với những biến nó nhìn thấy lúc được tạo. <code>bam</code> vẫn với tới <code>dem</code> sau khi <code>taoBoDem</code> đã chạy xong — về tinh thần, đó là cách hook giữ dữ liệu giữa các lần render. Ví dụ thứ hai quan trọng hơn với React: hàm của bộ hẹn giờ bắt <code>luc = 1</code> lúc được tạo, và in 1 dù <code>soLich</code> giờ đã là 5. Mỗi lần render một component là một lần gọi hàm mới với biến của riêng nó, và hàm xử lý sự kiện hay bộ hẹn giờ tạo ra trong lần render nào thì cứ thấy giá trị của <em>lần render đó</em>. Chương 2 gọi là "state là một ảnh chụp", Chương 4 gỡ lỗi "stale closure" mà nó gây ra trong effect.</p>

<h3>Promise và async/await: chờ mà không đứng hình</h3>
${slide('rx-00', 27, 'async/await: thứ tự in ra thật')}
<p>Việc gì chậm — một request mạng, một bộ hẹn giờ — đều trả cho bạn một <strong>Promise</strong>: một object sau này sẽ chứa kết quả hoặc lỗi. <code>await</code> tạm dừng hàm <code>async</code> hiện tại tới khi promise xong, trong khi phần còn lại của chương trình vẫn chạy. Chúng tôi giả lập một API bằng <code>setTimeout</code>:</p>
<pre><code class="language-ts">import { danhSachBacSi } from '../../ch00/src/du-lieu/bac-si.ts'
import type { BacSi } from '../../ch00/src/types.ts'

// Giả lập gọi API: trả Promise, xong sau &#96;ms&#96; mili-giây
const layBacSi = (id: string, ms: number) =&gt;
  new Promise&lt;BacSi&gt;((xong, loi) =&gt; setTimeout(() =&gt; {
    const bs = danhSachBacSi.find((b) =&gt; b.id === id)
    if (bs) xong(bs); else loi(new Error(&#96;404: không có bác sĩ &#36;{id}&#96;))
  }, ms))

async function main() {
  console.log('1. bắt đầu')
  const p = layBacSi('bs-1', 50)
  console.log('2. đã gọi, p là', Object.prototype.toString.call(p))
  const bs = await p                                   // "chờ" nhưng KHÔNG chặn cả chương trình
  console.log('4. có kết quả:', bs.ten)

  try { await layBacSi('bs-99', 10) }
  catch (e) { console.log('5. bắt lỗi:', (e as Error).message) }

  const t0 = Date.now()
  const [a, b] = await Promise.all([layBacSi('bs-2', 100), layBacSi('bs-3', 100)])
  console.log('6. Promise.all:', a.id, b.id, &#96;≈&#36;{Math.round((Date.now() - t0) / 50) * 50} ms (chạy song song)&#96;)
}
main()
console.log('3. dòng này chạy TRƯỚC khi có kết quả')</code></pre>
<pre><code class="language-bash">$ node 8-async.ts</code></pre>
<div class="out">1. bắt đầu
2. đã gọi, p là [object Promise]
3. dòng này chạy TRƯỚC khi có kết quả
4. có kết quả: BS. Nguyễn Minh An
5. bắt lỗi: 404: không có bác sĩ bs-99
6. Promise.all: bs-2 bs-3 ≈100 ms (chạy song song)</div>
<ul>
<li>Dòng 3 in trước dòng 4: <code>await</code> chỉ tạm dừng <code>main</code>; dòng cuối của file chạy trong lúc đó. Nhờ vậy trang vẫn phản hồi trong khi dữ liệu đang tải.</li>
<li>Gọi <code>layBacSi</code> là có ngay một Promise (dòng 2); <code>await</code> mở nó ra lấy giá trị.</li>
<li>Promise bị từ chối (reject) biến thành một exception tại <code>await</code>, bắt bằng <code>try/catch</code> bình thường (dòng 5). Một <code>await</code> không có <code>try/catch</code> trong hàm xử lý sự kiện là một lỗi không ai bắt.</li>
<li><code>Promise.all</code> chờ nhiều promise bắt đầu cùng lúc: hai lời gọi 100 ms mất khoảng 100 ms, không phải 200. Lại là destructuring (<code>const [a, b] = …</code>).</li>
</ul>
<p>Trong React bạn sẽ không hay gọi <code>fetch</code> trực tiếp trong component: Chương 6 dùng TanStack Query, thư viện lo phần đang tải, lỗi, cache và thử lại quanh đúng những promise này. Nhưng bạn phải đọc được <code>async</code>/<code>await</code> mới dùng được nó, và form (Chương 3) gửi đi bằng <code>await</code>.</p>

<h3>TypeScript tối thiểu cho khoá này</h3>
<p>Dự án là TypeScript từ file đầu tiên, và TypeScript 6 mặc định kiểm chặt (<code>tsconfig.app.json</code> của chúng ta không có dòng <code>strict</code> nào, vậy mà các lỗi dưới vẫn hiện). Để bắt đầu bạn chỉ cần vài dạng:</p>
<pre><code class="language-ts">// src/types.ts (trích)
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat'   // hợp các chuỗi cố định (union)

export interface BacSi {          // hình dạng của một object
  id: string
  ten: string
  chuyenKhoa: ChuyenKhoa
  namKinhNghiem: number
  gioiThieu: string
}

// src/du-lieu/chuyen-khoa.ts
export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {  // object có đúng một khoá cho mỗi chuyên khoa
  noi: 'Nội tổng quát', nhi: 'Nhi', 'da-lieu': 'Da liễu', 'rang-ham-mat': 'Răng hàm mặt',
}

// src/du-lieu/tien-ich.ts (trích)
export const timBacSi = (ds: BacSi[], id: string): BacSi | undefined =&gt;   // có thể không trả gì
  ds.find((bs) =&gt; bs.id === id)</code></pre>
<p>Hai chỗ sai, hai lỗi thật từ <code>npx tsc -b</code>:</p>
<pre><code class="language-ts">locTheoChuyenKhoa(danhSachBacSi, 'tim-mach')   // một chuyên khoa không tồn tại
const bs = timBacSi(danhSachBacSi, 'bs-1')
console.log(bs.ten)                            // bs có thể là undefined</code></pre>
<div class="out">src/minh-hoa/sai-kieu.ts(4,34): error TS2345: Argument of type '"tim-mach"' is not assignable to parameter of type 'ChuyenKhoa'.
src/minh-hoa/sai-kieu.ts(6,13): error TS18048: 'bs' is possibly 'undefined'.</div>
<p>Lỗi đầu là lý do khoá dùng kiểu union thay vì chuỗi trơn: gõ nhầm tên chuyên khoa bị bắt ngay khi gõ. Lỗi thứ hai là TypeScript buộc bạn xử lý trường hợp "không tìm thấy": <code>bs?.ten ?? 'Không tìm thấy'</code>, hoặc <code>if (!bs) return …</code>. Mọi thứ khác về kiểu — generic, utility type — học khi cần; <a href="/courses/typescript">khoá TypeScript</a> đi sâu hơn.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p><code>var</code>, <code>function</code> khắp nơi, <code>this.handleClick = this.handleClick.bind(this)</code> trong constructor của class, vòng <code>for</code> rồi <code>push</code> vào mảng kết quả, chuỗi <code>.then().catch()</code>, và <code>PropTypes.string.isRequired</code> → <code>const</code>, hàm mũi tên, không còn <code>this</code> trong function component, <code>map</code>/<code>filter</code>/<code>reduce</code>, <code>async/await</code> với <code>try/catch</code>, và interface TypeScript · <em>Vì sao:</em> React hiện đại viết bằng JavaScript hiện đại; function component xoá sổ cả bài toán gắn <code>this</code>, và hàm mảng là biểu thức — đúng thứ JSX cần. <code>.then()</code> không sai — <code>await</code> xây trên nó và bạn sẽ đọc nó trong code cũ và tài liệu thư viện — nhưng <code>await</code> đọc từ trên xuống như output ở trên.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> viết bốn hàm tiện ích trang chủ cần và chứng minh bằng test, trước khi viết dòng JSX nào.</p><ol>
<li>Trong <code>src/du-lieu/tien-ich.ts</code> viết <code>locTheoChuyenKhoa(ds, ck)</code> (dùng <code>filter</code>), <code>tongNamKinhNghiem(ds)</code> (dùng <code>reduce</code>), <code>soChuyenKhoa(ds)</code> (<code>new Set(ds.map(...)).size</code> — <code>Set</code> chỉ giữ giá trị không trùng) và <code>timBacSi(ds, id)</code> (dùng <code>find</code>). Ghi kiểu cho mọi tham số.</li>
<li>Trong <code>src/du-lieu/tien-ich.test.ts</code> test: lọc <code>'nhi'</code> ra id <code>['bs-2', 'bs-6']</code> <em>và</em> <code>danhSachBacSi</code> vẫn còn 6 phần tử; tổng là 63; có 4 chuyên khoa; <code>timBacSi(danhSachBacSi, 'bs-99')?.ten ?? 'Không tìm thấy'</code> bằng <code>'Không tìm thấy'</code>.</li>
<li>Chạy <code>npx vitest run src/du-lieu</code> và <code>npx tsc -b</code>.</li>
</ol><p><strong>Đạt khi:</strong> output có bốn dòng ✓ dưới <code>tiện ích danh sách bác sĩ</code> và <code>Tests  4 passed (4)</code>, còn <code>tsc -b</code> không in gì. (Lời giải nằm trong mục 🛠 ngay dưới.)</p></div>

<h3>🛠 Tự gõ tiếp dự án</h3>
${slide('rx-00', 30, 'Tự gõ tiếp dự án: trang chủ tĩnh + test đầu tiên')}
<p><strong>Điểm xuất phát:</strong> đây là bước đầu tiên — một thư mục trống. Hết Mục 0 bạn có đúng dự án mà Chương 1 bắt đầu từ đó.</p>
<ol>
<li><strong>Tạo và chạy</strong> dự án: <code>npm create vite@latest phong-kham -- --template react-ts</code> (Oxlint, No), <code>npm install</code>, <code>npm run dev</code>.</li>
<li><strong>Dọn template</strong> (Bài 0.1): xoá <code>src/App.css</code>, <code>src/assets/</code>, <code>public/icons.svg</code>; đặt <code>lang="vi"</code> và tiêu đề "Phòng khám An Tâm" trong <code>index.html</code>.</li>
<li><strong>Dữ liệu</strong>: tạo <code>src/types.ts</code> với các kiểu cố định, <code>src/du-lieu/bac-si.ts</code> export <code>danhSachBacSi: BacSi[]</code> gồm sáu bác sĩ (<code>bs-1</code> BS. Nguyễn Minh An · noi · 12; <code>bs-2</code> BS. Trần Thu Hà · nhi · 8; <code>bs-3</code> BS. Lê Quốc Bảo · da-lieu · 5; <code>bs-4</code> BS. Phạm Ngọc Lan · rang-ham-mat · 15; <code>bs-5</code> BS. Hoàng Đức Huy · noi · 3; <code>bs-6</code> BS. Vũ Thảo Vy · nhi · 20), <code>src/du-lieu/chuyen-khoa.ts</code> export <code>TEN_CHUYEN_KHOA</code> (tên tiếng Việt của từng chuyên khoa), và <code>src/du-lieu/tien-ich.ts</code> từ 🧪 ở trên. Các tên này cố định cả khoá: Chương 1 import đúng chúng.</li>
<li><strong>Trang chủ</strong> trong <code>src/App.tsx</code>: đầu trang có tên phòng khám; một <code>h1</code> "Phòng khám An Tâm" kèm khẩu hiệu; một nhãn "6 bác sĩ · 4 chuyên khoa" tính từ <code>danhSachBacSi</code>; bảng "Giờ mở cửa" dựng bằng <code>map</code> (Chủ nhật "Nghỉ" màu đỏ); các chip chuyên khoa lấy từ <code>TEN_CHUYEN_KHOA</code>; chân trang có năm hiện tại. Thay <code>src/index.css</code> bằng style của bạn.</li>
<li><strong>Test</strong>: cài Vitest + Testing Library, thêm khối <code>test</code> và dòng reference vào <code>vite.config.ts</code>, tạo <code>src/test/setup.ts</code> có <code>afterEach(cleanup)</code>, thêm script <code>test</code>, rồi viết <code>src/App.test.tsx</code>: trang có tiêu đề cấp 1 "Phòng khám An Tâm"; dòng "Chủ nhật" chứa "Nghỉ".</li>
</ol>
<p><strong>Đạt khi:</strong> <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> kết thúc bằng <code>Test Files  2 passed (2)</code> và <code>Tests  6 passed (6)</code>; <code>npx vite build</code> in <code>✓ built in</code>; và <code>npm run dev</code> hiện trang giống ảnh chụp ở slide 11 (đầu trang, tiêu đề, "6 bác sĩ · 4 chuyên khoa", ba dòng giờ mở cửa với "Nghỉ" màu đỏ, bốn chip).</p>
<details><summary>Lời giải</summary>
<p>Đã kiểm 25/09/2026 trên một dự án tạo mới bằng <code>npm create vite@latest</code>: <code>npx tsc -b</code> im lặng, Vitest <code>6 passed (6)</code>, build xanh. File không liệt kê (<code>main.tsx</code>, <code>tsconfig*.json</code>, <code>.oxlintrc.json</code>) giữ nguyên như template.</p>
<pre><code class="language-bash">$ npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
$ npm pkg set scripts.test="vitest run"</code></pre>
<p><code>src/types.ts</code></p>
<pre><code class="language-ts">// src/types.ts — kiểu dữ liệu CỐ ĐỊNH của dự án "Đặt lịch phòng khám An Tâm"
export type ChuyenKhoa = 'noi' | 'nhi' | 'da-lieu' | 'rang-ham-mat';

export interface BacSi {
  id: string;
  ten: string;
  chuyenKhoa: ChuyenKhoa;
  namKinhNghiem: number;
  gioiThieu: string;
}

export interface KhungGio {
  id: string;
  bacSiId: string;
  batDau: string; // ISO, vd '2026-10-01T08:00:00+07:00'
  conTrong: boolean;
}

export interface BenhNhan {
  hoTen: string;
  soDienThoai: string;
  ngaySinh: string; // YYYY-MM-DD
}

export type TrangThaiLichHen = 'cho-xac-nhan' | 'da-xac-nhan' | 'da-huy';

export interface LichHen {
  id: string;
  bacSiId: string;
  khungGioId: string;
  benhNhan: BenhNhan;
  lyDo: string;
  trangThai: TrangThaiLichHen;
}</code></pre>
<p><code>src/du-lieu/bac-si.ts</code></p>
<pre><code class="language-ts">import type { BacSi } from '../types';

export const danhSachBacSi: BacSi[] = [
  { id: 'bs-1', ten: 'BS. Nguyễn Minh An', chuyenKhoa: 'noi', namKinhNghiem: 12, gioiThieu: 'Khám và theo dõi bệnh mạn tính: tăng huyết áp, tiểu đường, dạ dày.' },
  { id: 'bs-2', ten: 'BS. Trần Thu Hà', chuyenKhoa: 'nhi', namKinhNghiem: 8, gioiThieu: 'Khám trẻ từ sơ sinh tới 15 tuổi, tư vấn dinh dưỡng và tiêm chủng.' },
  { id: 'bs-3', ten: 'BS. Lê Quốc Bảo', chuyenKhoa: 'da-lieu', namKinhNghiem: 5, gioiThieu: 'Mụn trứng cá, viêm da cơ địa, chăm sóc da sau điều trị.' },
  { id: 'bs-4', ten: 'BS. Phạm Ngọc Lan', chuyenKhoa: 'rang-ham-mat', namKinhNghiem: 15, gioiThieu: 'Nhổ răng khôn, trám răng, chỉnh nha cho người lớn.' },
  { id: 'bs-5', ten: 'BS. Hoàng Đức Huy', chuyenKhoa: 'noi', namKinhNghiem: 3, gioiThieu: 'Khám tổng quát, đọc kết quả xét nghiệm, tư vấn lối sống.' },
  { id: 'bs-6', ten: 'BS. Vũ Thảo Vy', chuyenKhoa: 'nhi', namKinhNghiem: 20, gioiThieu: 'Hô hấp nhi, hen phế quản ở trẻ, khám sức khoẻ định kỳ.' },
];</code></pre>
<p><code>src/du-lieu/chuyen-khoa.ts</code></p>
<pre><code class="language-ts">import type { ChuyenKhoa } from '../types';

export const TEN_CHUYEN_KHOA: Record&lt;ChuyenKhoa, string&gt; = {
  noi: 'Nội tổng quát',
  nhi: 'Nhi',
  'da-lieu': 'Da liễu',
  'rang-ham-mat': 'Răng hàm mặt',
};</code></pre>
<p><code>src/du-lieu/tien-ich.ts</code></p>
<pre><code class="language-ts">// src/du-lieu/tien-ich.ts — vài hàm JS thuần làm việc với danh sách bác sĩ (Bài 0.3)
import type { BacSi, ChuyenKhoa } from '../types';

/** Lọc bác sĩ theo chuyên khoa — trả MẢNG MỚI, không đụng mảng gốc. */
export const locTheoChuyenKhoa = (ds: BacSi[], ck: ChuyenKhoa): BacSi[] =&gt;
  ds.filter((bs) =&gt; bs.chuyenKhoa === ck);

/** Tổng số năm kinh nghiệm của cả danh sách. */
export const tongNamKinhNghiem = (ds: BacSi[]): number =&gt;
  ds.reduce((tong, bs) =&gt; tong + bs.namKinhNghiem, 0);

/** Đếm số chuyên khoa KHÁC NHAU đang có bác sĩ. */
export const soChuyenKhoa = (ds: BacSi[]): number =&gt;
  new Set(ds.map((bs) =&gt; bs.chuyenKhoa)).size;

/** Tìm theo id; không thấy thì undefined (dùng với ?. và ??). */
export const timBacSi = (ds: BacSi[], id: string): BacSi | undefined =&gt;
  ds.find((bs) =&gt; bs.id === id);</code></pre>
<p><code>src/App.tsx</code></p>
<pre><code class="language-tsx">import { danhSachBacSi } from './du-lieu/bac-si'
import { TEN_CHUYEN_KHOA } from './du-lieu/chuyen-khoa'
import { soChuyenKhoa } from './du-lieu/tien-ich'

const GIO_MO_CUA = [
  { thu: 'Thứ 2 – Thứ 6', gio: '07:30 – 19:00' },
  { thu: 'Thứ 7', gio: '07:30 – 12:00' },
  { thu: 'Chủ nhật', gio: 'Nghỉ' },
]

function App() {
  const tenPhongKham = 'Phòng khám An Tâm'
  const namNay = new Date().getFullYear()

  return (
    &lt;div className="trang"&gt;
      &lt;header className="dau-trang"&gt;
        &lt;span className="logo" aria-hidden="true"&gt;✚&lt;/span&gt;
        &lt;strong&gt;{tenPhongKham}&lt;/strong&gt;
      &lt;/header&gt;

      &lt;main&gt;
        &lt;section className="gioi-thieu"&gt;
          &lt;h1&gt;{tenPhongKham}&lt;/h1&gt;
          &lt;p className="khau-hieu"&gt;Khám nhanh, hẹn đúng giờ, không phải xếp hàng.&lt;/p&gt;
          &lt;p className="so-lieu"&gt;
            {danhSachBacSi.length} bác sĩ · {soChuyenKhoa(danhSachBacSi)} chuyên khoa
          &lt;/p&gt;
        &lt;/section&gt;

        &lt;section className="o-thong-tin"&gt;
          &lt;h2&gt;Giờ mở cửa&lt;/h2&gt;
          &lt;table&gt;
            &lt;tbody&gt;
              {GIO_MO_CUA.map((dong) =&gt; (
                &lt;tr key={dong.thu}&gt;
                  &lt;th scope="row"&gt;{dong.thu}&lt;/th&gt;
                  &lt;td className={dong.gio === 'Nghỉ' ? 'nghi' : undefined}&gt;{dong.gio}&lt;/td&gt;
                &lt;/tr&gt;
              ))}
            &lt;/tbody&gt;
          &lt;/table&gt;
        &lt;/section&gt;

        &lt;section className="o-thong-tin"&gt;
          &lt;h2&gt;Chuyên khoa&lt;/h2&gt;
          &lt;ul className="chip"&gt;
            {Object.values(TEN_CHUYEN_KHOA).map((ten) =&gt; (
              &lt;li key={ten}&gt;{ten}&lt;/li&gt;
            ))}
          &lt;/ul&gt;
        &lt;/section&gt;
      &lt;/main&gt;

      &lt;footer className="chan-trang"&gt;
        © {namNay} {tenPhongKham} · dữ liệu minh hoạ cho khoá React
      &lt;/footer&gt;
    &lt;/div&gt;
  )
}

export default App</code></pre>
<p><code>src/index.css</code></p>
<pre><code class="language-css">:root {
  --chu: #1f2937;
  --chu-phu: #6b7280;
  --nen: #f6f8fb;
  --the: #ffffff;
  --vien: #e5e7eb;
  --nhan: #0e8a7e;
  font: 17px/1.5 system-ui, 'Segoe UI', Roboto, sans-serif;
  color: var(--chu);
  background: var(--nen);
}
* { box-sizing: border-box; }
body { margin: 0; }
.trang { max-width: 880px; margin: 0 auto; padding: 0 20px 32px; }
.dau-trang { display: flex; align-items: center; gap: 10px; padding: 18px 0; border-bottom: 1px solid var(--vien); }
.logo { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 9px; background: var(--nhan); color: #fff; font-weight: 700; }
.gioi-thieu { padding: 36px 0 20px; }
.gioi-thieu h1 { font-size: 40px; margin: 0 0 6px; color: #0b3b36; }
.khau-hieu { margin: 0; font-size: 20px; color: var(--chu-phu); }
.so-lieu { display: inline-block; margin-top: 16px; padding: 6px 14px; border-radius: 999px; background: #dff3f0; color: var(--nhan); font-weight: 600; }
.o-thong-tin { background: var(--the); border: 1px solid var(--vien); border-radius: 14px; padding: 18px 22px; margin-top: 18px; }
.o-thong-tin h2 { margin: 0 0 10px; font-size: 20px; }
table { border-collapse: collapse; width: 100%; }
th, td { text-align: left; padding: 8px 0; border-top: 1px solid var(--vien); }
th { font-weight: 500; color: var(--chu-phu); width: 45%; }
td.nghi { color: #b91c1c; font-weight: 600; }
.chip { list-style: none; display: flex; flex-wrap: wrap; gap: 10px; padding: 0; margin: 0; }
.chip li { padding: 6px 14px; border-radius: 999px; border: 1px solid var(--nhan); color: var(--nhan); }
.chan-trang { margin-top: 28px; font-size: 14px; color: var(--chu-phu); }</code></pre>
<p><code>vite.config.ts</code></p>
<pre><code class="language-ts">/// &lt;reference types="vitest/config" /&gt;
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})</code></pre>
<p><code>src/test/setup.ts</code></p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest không bật "globals" ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test thứ hai thấy cả trang của test thứ nhất.
afterEach(cleanup)</code></pre>
<p><code>src/App.test.tsx</code></p>
<pre><code class="language-tsx">import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('trang chủ hiện tên phòng khám làm tiêu đề chính', () =&gt; {
  render(&lt;App /&gt;)
  expect(
    screen.getByRole('heading', { level: 1, name: 'Phòng khám An Tâm' }),
  ).toBeInTheDocument()
})

test('trang chủ có bảng giờ mở cửa, Chủ nhật nghỉ', () =&gt; {
  render(&lt;App /&gt;)
  expect(screen.getByRole('heading', { name: 'Giờ mở cửa' })).toBeInTheDocument()
  expect(screen.getByRole('row', { name: /Chủ nhật/ })).toHaveTextContent('Nghỉ')
})</code></pre>
<p><code>src/du-lieu/tien-ich.test.ts</code></p>
<pre><code class="language-ts">import { describe, expect, test } from 'vitest'
import { danhSachBacSi } from './bac-si'
import { locTheoChuyenKhoa, soChuyenKhoa, timBacSi, tongNamKinhNghiem } from './tien-ich'

describe('tiện ích danh sách bác sĩ', () =&gt; {
  test('lọc khoa nhi ra 2 bác sĩ, mảng gốc giữ nguyên 6', () =&gt; {
    const nhi = locTheoChuyenKhoa(danhSachBacSi, 'nhi')
    expect(nhi.map((bs) =&gt; bs.id)).toEqual(['bs-2', 'bs-6'])
    expect(danhSachBacSi).toHaveLength(6)
  })
  test('tổng năm kinh nghiệm là 63', () =&gt; {
    expect(tongNamKinhNghiem(danhSachBacSi)).toBe(63)
  })
  test('có 4 chuyên khoa khác nhau', () =&gt; {
    expect(soChuyenKhoa(danhSachBacSi)).toBe(4)
  })
  test('tìm id không có thì undefined, ?. và ?? cho chữ thay thế', () =&gt; {
    const bs = timBacSi(danhSachBacSi, 'bs-99')
    expect(bs?.ten ?? 'Không tìm thấy').toBe('Không tìm thấy')
  })
})</code></pre>
<p>Trong <code>index.html</code>: <code>&lt;html lang="vi"&gt;</code> và <code>&lt;title&gt;Phòng khám An Tâm&lt;/title&gt;</code>. Kết quả:</p>
<pre><code class="language-bash">$ npx tsc -b
$ npx vitest run --reporter=verbose</code></pre>
<div class="out"> ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; lọc khoa nhi ra 2 bác sĩ, mảng gốc giữ nguyên 6 3ms
 ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; tổng năm kinh nghiệm là 63 0ms
 ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; có 4 chuyên khoa khác nhau 0ms
 ✓ src/du-lieu/tien-ich.test.ts &gt; tiện ích danh sách bác sĩ &gt; tìm id không có thì undefined, ?. và ?? cho chữ thay thế 1ms
 ✓ src/App.test.tsx &gt; trang chủ hiện tên phòng khám làm tiêu đề chính 165ms
 ✓ src/App.test.tsx &gt; trang chủ có bảng giờ mở cửa, Chủ nhật nghỉ 53ms

 Test Files  2 passed (2)
      Tests  6 passed (6)</div>
<pre><code class="language-bash">$ npx vite build</code></pre>
<div class="out">✓ 19 modules transformed.
dist/index.html                   0.47 kB │ gzip:  0.31 kB
dist/assets/index-Cni7a6VB.css    1.39 kB │ gzip:  0.63 kB
dist/assets/index-CcUL7llf.js   222.07 kB │ gzip: 69.86 kB
✓ built in 353ms</div>
</details>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">hàm mũi tên (arrow function)</span><span class="v"><code>(x) =&gt; x * 2</code>; một biểu thức thì tự trả về</span></div>
<div class="kv"><span class="k">destructuring</span><span class="v"><code>const { a } = obj</code>, <code>const [x, y] = arr</code> — rút trường/phần tử ra biến</span></div>
<div class="kv"><span class="k">spread / rest</span><span class="v"><code>...</code>: chép vào mảng/object mới (một tầng), hoặc gom phần còn lại</span></div>
<div class="kv"><span class="k">so sánh tham chiếu</span><span class="v"><code>===</code> trên object hỏi "cùng object không?"; React so state theo cách này</span></div>
<div class="kv"><span class="k">falsy</span><span class="v"><code>false, 0, '', null, undefined, NaN</code> — mọi thứ khác là truthy</span></div>
<div class="kv"><span class="k"><code>?.</code> / <code>??</code></span><span class="v">dừng khi gặp null/undefined / giá trị mặc định chỉ cho null/undefined</span></div>
<div class="kv"><span class="k">closure</span><span class="v">hàm cùng các biến nó thấy lúc được tạo; giữ giá trị cũ</span></div>
<div class="kv"><span class="k">Promise / await</span><span class="v">kết quả trong tương lai; <code>await</code> dừng hàm async, không dừng chương trình</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>const</code> và hàm mũi tên ở khắp nơi; template literal cho chữ có chèn giá trị.</li>
<li>Destructuring đọc props (<code>{ bacSi }</code>) và kết quả hook (<code>[dem, setDem]</code>).</li>
<li>Cập nhật dữ liệu bằng cách chép: <code>{ ...obj, x }</code>, <code>[...arr, y]</code>, <code>filter</code> để xoá — spread chỉ một tầng; <code>sort()</code>/<code>push()</code> sửa bản gốc.</li>
<li>React so state theo tham chiếu: object mới nghĩa là "đã đổi", cùng object nghĩa là "không đổi".</li>
<li><code>map</code> biến dữ liệu thành JSX; <code>filter</code>, <code>find</code>, <code>reduce</code> tính thứ cần hiện; <code>?.</code> và <code>??</code> xử lý "không tìm thấy" mà không sập.</li>
<li>Export có tên và mặc định; closure giữ giá trị cũ; <code>await</code> chờ trong hàm còn trang vẫn chạy.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Importing and Exporting Components</span><span class="lc-sub">react.dev/learn/importing-and-exporting-components — export mặc định và export có tên cho component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Rendering Lists</span><span class="lc-sub">react.dev/learn/rendering-lists — <code>map</code> và <code>filter</code> biến thành JSX, bước tiếp theo sau bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Updating Arrays in State</span><span class="lc-sub">react.dev/learn/updating-arrays-in-state — bảng các hàm mảng sửa gốc và không sửa gốc (tránh <code>sort</code>, dùng bản chép).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">react.dev — Using TypeScript</span><span class="lc-sub">react.dev/learn/typescript — gõ kiểu cho props và hook, nơi phần TypeScript tối thiểu của bài này dẫn tới.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — vượt qua mức tối thiểu</span><span class="lc-sub">/courses/typescript/learn${REF} — union, interface, generic và chế độ strict, đi sâu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 — Quiz ─────────────────────────── */
    {
      title: '0.4 — Section 0 quiz: setup, JSX and JavaScript in real situations|||0.4 — Kiểm tra Mục 0: cài đặt, JSX và JavaScript qua tình huống thật',
      slug: 'rx-0-4-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống về Mục 0: số 0 trong JSX, vite build và tsc, spread một tầng, ?? và ||, dọn DOM giữa hai test, import sai loại, thứ tự async/await và cách tạo dự án năm 2026.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Section 0 quiz</h2>
<p class="lead">Ten questions, fifteen minutes. Most show a short piece of code or a situation from the project and ask what happens — the kind of question an interviewer asks after "what is React?". Every answer comes with an explanation of why it is right and why the most tempting wrong answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can create a React + TypeScript project with Vite and explain what <code>index.html</code>, <code>main.tsx</code> and <code>App.tsx</code> each do.</li>
<li>I know which command checks types (<code>tsc -b</code>) and which only bundles (<code>vite build</code>).</li>
<li>I can say what JSX compiles to and why <code>className</code>, one root and closed tags are required.</li>
<li>I can predict what <code>{0 &amp;&amp; …}</code>, <code>{null}</code> and a string containing <code>&lt;b&gt;</code> render.</li>
<li>I can read destructuring, spread, <code>map</code>/<code>filter</code>/<code>reduce</code>, <code>?.</code>, <code>??</code> and <code>async/await</code> without looking them up.</li>
<li>My <code>phong-kham</code> project passes <code>npx tsc -b</code> and <code>npx vitest run</code> (6 tests).</li>
</ul>
${slide('rx-00', 29, 'Bảng tra nhanh Mục 0')}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Kiểm tra Mục 0</h2>
<p class="lead">Mười câu, mười lăm phút. Phần lớn đưa một đoạn code ngắn hoặc một tình huống trong dự án và hỏi chuyện gì xảy ra — đúng kiểu câu người phỏng vấn hỏi sau "React là gì?". Câu nào cũng có giải thích vì sao đáp án đúng, và vì sao phương án dễ nhầm nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tạo được dự án React + TypeScript bằng Vite và giải thích được <code>index.html</code>, <code>main.tsx</code>, <code>App.tsx</code> mỗi file làm gì.</li>
<li>Tôi biết lệnh nào kiểm kiểu (<code>tsc -b</code>) và lệnh nào chỉ đóng gói (<code>vite build</code>).</li>
<li>Tôi nói được JSX biên dịch thành gì và vì sao cần <code>className</code>, một gốc và thẻ đóng đủ.</li>
<li>Tôi đoán đúng <code>{0 &amp;&amp; …}</code>, <code>{null}</code> và một chuỗi chứa <code>&lt;b&gt;</code> render ra gì.</li>
<li>Tôi đọc được destructuring, spread, <code>map</code>/<code>filter</code>/<code>reduce</code>, <code>?.</code>, <code>??</code> và <code>async/await</code> mà không phải tra.</li>
<li>Dự án <code>phong-kham</code> của tôi qua <code>npx tsc -b</code> và <code>npx vitest run</code> (6 test).</li>
</ul>
${slide('rx-00', 29, 'Bảng tra nhanh Mục 0')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The header shows a badge with {soLichHen && <span className="huy-hieu">{soLichHen}</span>}. A new user has soLichHen = 0. What appears in the header?|||Header có huy hiệu {soLichHen && <span className="huy-hieu">{soLichHen}</span>}. Người dùng mới có soLichHen = 0. Header hiện gì?',
            options: [
              'Nothing — 0 is falsy, so React renders nothing|||Không có gì — 0 là falsy nên React không vẽ gì',
              'A lone "0" as text|||Một chữ "0" trơ trọi',
              'An empty badge <span></span>|||Một huy hiệu rỗng <span></span>',
              'A runtime error: numbers are not valid children|||Lỗi lúc chạy: số không phải con hợp lệ',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: a && b returns a when a is falsy, so the expression is the number 0 — and numbers render as text (our run: <p>{0 && <b>…</b>}</p> gave <p>0</p>). "Nothing" is the tempting answer because 0 is falsy, but falsy is about the && operator, not about what React draws: only true, false, null and undefined render nothing. Fix: soLichHen > 0 && ….|||VI: a && b trả về a khi a falsy, nên biểu thức bằng số 0 — và số thì được vẽ thành chữ (lần chạy của bài: <p>{0 && <b>…</b>}</p> cho ra <p>0</p>). "Không có gì" là đáp án dễ nhầm vì 0 là falsy, nhưng falsy là chuyện của toán tử &&, không phải chuyện React vẽ gì: chỉ true, false, null, undefined mới không vẽ. Sửa: soLichHen > 0 && ….',
          },
          {
            question: 'Someone wrote const namNay: string = new Date().getFullYear() in App.tsx. The deploy script runs npx vite build (not npm run build). What happens?|||Ai đó viết const namNay: string = new Date().getFullYear() trong App.tsx. Script deploy chạy npx vite build (không phải npm run build). Chuyện gì xảy ra?',
            options: [
              'vite build stops with error TS2322|||vite build dừng với lỗi TS2322',
              'vite build prints a warning and still builds|||vite build in cảnh báo rồi vẫn build',
              'vite build succeeds silently; only tsc -b reports TS2322|||vite build thành công, im lặng; chỉ tsc -b báo TS2322',
              'The dev server refuses to start|||Máy chủ dev không chịu khởi động',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Vite only strips types, it never checks them. Measured in Lesson 0.1: npx tsc -b printed "error TS2322: Type \'number\' is not assignable to type \'string\'", while npx vite build printed "✓ built in 363ms". That is why the template\'s build script is tsc -b && vite build. "Stops with TS2322" is tempting because the editor underlines the line in red, but that red comes from the TypeScript language service, not from Vite.|||VI: Vite chỉ bóc kiểu, không bao giờ kiểm. Đo ở Bài 0.1: npx tsc -b in "error TS2322: Type \'number\' is not assignable to type \'string\'", trong khi npx vite build in "✓ built in 363ms". Vì thế script build của template là tsc -b && vite build. "Dừng với TS2322" dễ nhầm vì trình soạn thảo gạch đỏ dòng đó, nhưng gạch đỏ ấy đến từ TypeScript trong editor, không phải từ Vite.',
          },
          {
            question: 'Which sentence best describes React\'s core idea?|||Câu nào mô tả đúng nhất ý tưởng cốt lõi của React?',
            options: [
              'You describe the UI for the current state; when state changes React re-renders and updates only the DOM that differs|||Bạn mô tả giao diện theo state hiện tại; khi state đổi React render lại và chỉ sửa phần DOM khác đi',
              'React makes any app fast because the virtual DOM is always faster than editing the DOM|||React làm app nào cũng nhanh vì virtual DOM luôn nhanh hơn sửa DOM',
              'React is a full framework with a built-in router, forms and HTTP client|||React là framework trọn gói có sẵn router, form và HTTP client',
              'React replaces HTML: the browser runs JSX directly|||React thay HTML: trình duyệt chạy JSX trực tiếp',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: UI is a function of state — you change data, React calls your components again, compares the result and patches the DOM. The "virtual DOM is always faster" answer is the popular trap: React adds work compared with a hand-tuned DOM update; its benefit is predictability, and performance still depends on how you structure state (Chapter 8). React is a library (router, forms, fetching come from other libraries), and the browser never sees JSX.|||VI: giao diện là hàm của state — bạn đổi dữ liệu, React gọi lại component, so kết quả và vá DOM. "Virtual DOM luôn nhanh hơn" là cái bẫy phổ biến: React tốn thêm việc so với một lần sửa DOM viết tay khéo; cái lợi của nó là dễ đoán, còn hiệu năng vẫn tuỳ cách bạn tổ chức state (Chương 8). React là thư viện (router, form, lấy dữ liệu đến từ thư viện khác), và trình duyệt không bao giờ thấy JSX.',
          },
          {
            question: 'const lich = { id: \'lh-1\', benhNhan: { hoTen: \'Lan\' } }; const lich2 = { ...lich }; lich2.benhNhan.hoTen = \'Mai\'. What is lich.benhNhan.hoTen now?|||const lich = { id: \'lh-1\', benhNhan: { hoTen: \'Lan\' } }; const lich2 = { ...lich }; lich2.benhNhan.hoTen = \'Mai\'. Giờ lich.benhNhan.hoTen là gì?',
            options: [
              '\'Lan\' — spread made a full copy|||\'Lan\' — spread đã chép toàn bộ',
              'undefined|||undefined',
              'An error: lich is const|||Lỗi: lich là const',
              '\'Mai\' — both objects share the same inner benhNhan|||\'Mai\' — hai object dùng chung một benhNhan bên trong',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: spread copies one level. lich2 is a new object, but lich2.benhNhan is the same object as lich.benhNhan (our run printed "Mai true"). To change a nested field without touching the original, copy each level: { ...lich, benhNhan: { ...lich.benhNhan, hoTen: \'Mai\' } }. "\'Lan\', a full copy" is the tempting answer; it would be right only for a deep copy such as structuredClone. const does not help: it forbids reassigning the name, not changing what is inside.|||VI: spread chép một tầng. lich2 là object mới, nhưng lich2.benhNhan là cùng object với lich.benhNhan (lần chạy của bài in "Mai true"). Muốn sửa trường lồng mà không đụng bản gốc thì chép từng tầng: { ...lich, benhNhan: { ...lich.benhNhan, hoTen: \'Mai\' } }. "\'Lan\', chép toàn bộ" là đáp án dễ nhầm; nó chỉ đúng với deep copy như structuredClone. const cũng không giúp gì: nó cấm gán lại cái tên, không cấm sửa bên trong.',
          },
          {
            question: 'const soPhong: number = 0. What do soPhong || 99 and soPhong ?? 99 give?|||const soPhong: number = 0. soPhong || 99 và soPhong ?? 99 cho ra gì?',
            options: [
              '0 and 0|||0 và 0',
              '99 and 0|||99 và 0',
              '99 and 99|||99 và 99',
              '0 and 99|||0 và 99',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: || falls back for any falsy value, and 0 is falsy, so it gives 99; ?? falls back only for null and undefined, so it keeps 0 (our run: "soPhong || 99 = 99 · soPhong ?? 99 = 0"). "0 and 99" swaps the two operators — the most common mix-up. For defaults where 0 or \'\' are valid values, use ??.|||VI: || thay thế với mọi giá trị falsy, mà 0 là falsy, nên ra 99; ?? chỉ thay khi là null hoặc undefined, nên giữ 0 (lần chạy của bài: "soPhong || 99 = 99 · soPhong ?? 99 = 0"). "0 và 99" là tráo hai toán tử — kiểu nhầm hay gặp nhất. Với giá trị mặc định mà 0 hay \'\' là hợp lệ, dùng ??.',
          },
          {
            question: 'Your first test passes, the second fails with "Found multiple elements with the role \\"heading\\" and name \\"Giờ mở cửa\\"", and the error dump shows the whole page twice in <body>. Vitest runs with its default settings. What is missing?|||Test đầu qua, test thứ hai hỏng với "Found multiple elements with the role \\"heading\\" and name \\"Giờ mở cửa\\"", và phần in lỗi cho thấy cả trang xuất hiện hai lần trong <body>. Vitest chạy cấu hình mặc định. Thiếu gì?',
            options: [
              'A key on the table rows|||key cho các dòng của bảng',
              'environment: \'jsdom\' in vite.config.ts|||environment: \'jsdom\' trong vite.config.ts',
              'afterEach(cleanup) in src/test/setup.ts|||afterEach(cleanup) trong src/test/setup.ts',
              'The /// <reference types="vitest/config" /> line|||Dòng /// <reference types="vitest/config" />',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Testing Library cleans the DOM after each test automatically only when a global afterEach exists; Vitest does not provide globals unless globals: true. Without afterEach(cleanup), the first test\'s page stays in <body>, so the second test finds two headings. Missing environment: \'jsdom\' is tempting, but then there would be no DOM at all and even the first test would fail ("document is not defined"). The reference line only affects tsc, not test runs.|||VI: Testing Library tự dọn DOM sau mỗi test chỉ khi có hàm afterEach toàn cục; Vitest không có globals trừ khi bật globals: true. Thiếu afterEach(cleanup), trang của test đầu còn nằm trong <body>, nên test thứ hai thấy hai tiêu đề. Thiếu environment: \'jsdom\' nghe hợp lý, nhưng khi đó hoàn toàn không có DOM và cả test đầu cũng hỏng ("document is not defined"). Dòng reference chỉ ảnh hưởng tsc, không ảnh hưởng lúc chạy test.',
          },
          {
            question: 'tien-ich.ts has export default function chao() {…}. Another file writes import { chao } from \'./tien-ich.ts\' and is run with node. What happens?|||tien-ich.ts có export default function chao() {…}. Một file khác viết import { chao } from \'./tien-ich.ts\' và chạy bằng node. Chuyện gì xảy ra?',
            options: [
              'SyntaxError: the module does not provide an export named \'chao\'|||SyntaxError: module không cung cấp export tên \'chao\'',
              'It works: default exports can also be imported by name|||Chạy được: export mặc định cũng import theo tên được',
              'chao is undefined and calling it throws "chao is not a function"|||chao là undefined và gọi nó ném "chao is not a function"',
              'Node imports the whole module object into chao|||Node đưa cả object module vào chao',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: named imports must match a named export. Node refuses at load time: "SyntaxError: The requested module \'./tien-ich.ts\' does not provide an export named \'chao\'", and tsc says TS2614 "Did you mean to use \'import chao from …\'". "undefined, then not a function" is tempting because that is what older bundlers sometimes did, but native ES modules check the names before any code runs. Fix: import chao from \'./tien-ich.ts\'.|||VI: import có tên phải khớp một export có tên. Node từ chối ngay lúc nạp: "SyntaxError: The requested module \'./tien-ich.ts\' does not provide an export named \'chao\'", còn tsc báo TS2614 "Did you mean to use \'import chao from …\'". "undefined rồi not a function" dễ nhầm vì một số bộ đóng gói cũ từng cư xử thế, nhưng ES module gốc kiểm tên trước khi chạy dòng code nào. Sửa: import chao from \'./tien-ich.ts\'.',
          },
          {
            question: 'In a .tsx file you write <button class="nut">Đặt lịch</button>. What does the editor (TypeScript) tell you?|||Trong file .tsx bạn viết <button class="nut">Đặt lịch</button>. Trình soạn thảo (TypeScript) báo gì?',
            options: [
              'Nothing — class works in JSX just like in HTML|||Không gì — class chạy trong JSX y như HTML',
              'TS2657: JSX expressions must have one parent element|||TS2657: JSX expressions must have one parent element',
              'TS17008: no corresponding closing tag|||TS17008: thiếu thẻ đóng tương ứng',
              'TS2322 … Property \'class\' does not exist … Did you mean \'className\'?|||TS2322 … Property \'class\' does not exist … Did you mean \'className\'?',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: JSX attributes are JavaScript property names; class is a reserved word, so React uses className, and the React types do not contain class. Our tsc run: "Property \'class\' does not exist on type \'DetailedHTMLProps<…>\'. Did you mean \'className\'?". "Nothing" is tempting because plain JavaScript JSX in old projects sometimes rendered class with only a console warning; with TypeScript it is a compile error. The other two errors are for a second root and an unclosed tag.|||VI: thuộc tính JSX là tên thuộc tính JavaScript; class là từ khoá dành riêng, nên React dùng className, và kiểu của React không có class. Lần chạy tsc của bài: "Property \'class\' does not exist on type \'DetailedHTMLProps<…>\'. Did you mean \'className\'?". "Không gì" dễ nhầm vì JSX viết bằng JavaScript thuần trong dự án cũ đôi khi vẫn vẽ class kèm một cảnh báo trong console; với TypeScript thì đó là lỗi biên dịch. Hai lỗi còn lại dành cho hai gốc và thẻ chưa đóng.',
          },
          {
            question: 'async function main() { console.log(\'A\'); const bs = await layBacSi(\'bs-1\', 50); console.log(\'C\') } main(); console.log(\'B\'). In which order are the letters printed?|||async function main() { console.log(\'A\'); const bs = await layBacSi(\'bs-1\', 50); console.log(\'C\') } main(); console.log(\'B\'). Các chữ được in theo thứ tự nào?',
            options: [
              'A, C, B — await blocks the whole program for 50 ms|||A, C, B — await chặn cả chương trình 50 ms',
              'B, A, C — async functions start after the rest of the file|||B, A, C — hàm async chạy sau phần còn lại của file',
              'A, B, C — await pauses only main; the last line runs meanwhile|||A, B, C — await chỉ tạm dừng main; dòng cuối chạy trong lúc đó',
              'A, C only — B is skipped while main is waiting|||Chỉ A, C — B bị bỏ qua khi main đang chờ',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: main runs synchronously until its first await (prints A), then pauses; control returns to the caller, which prints B; 50 ms later the promise resolves and main continues with C. Our run of the same shape printed "1. bắt đầu, 2. …, 3. dòng này chạy TRƯỚC khi có kết quả, 4. có kết quả". "A, C, B" is the tempting answer because the code reads top to bottom, but await never blocks the whole program — that is why a page stays responsive while data loads.|||VI: main chạy đồng bộ tới await đầu tiên (in A) rồi tạm dừng; quyền điều khiển trở về nơi gọi, nơi in B; 50 ms sau promise xong và main chạy tiếp, in C. Lần chạy cùng dạng của bài in "1. bắt đầu, 2. …, 3. dòng này chạy TRƯỚC khi có kết quả, 4. có kết quả". "A, C, B" dễ nhầm vì code đọc từ trên xuống, nhưng await không bao giờ chặn cả chương trình — nhờ vậy trang vẫn phản hồi khi dữ liệu đang tải.',
          },
          {
            question: 'It is September 2026 and you start a new single-page React app for the clinic, without a framework. Which command matches what react.dev recommends?|||Tháng 9/2026, bạn bắt đầu một app React một trang mới cho phòng khám, không dùng framework. Lệnh nào khớp với khuyến nghị của react.dev?',
            options: [
              'npx create-react-app phong-kham --template typescript|||npx create-react-app phong-kham --template typescript',
              'npm create vite@latest phong-kham -- --template react-ts|||npm create vite@latest phong-kham -- --template react-ts',
              'npm install react react-dom and open index.html directly|||npm install react react-dom rồi mở thẳng index.html',
              'npx react-scripts start|||npx react-scripts start',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: react.dev deprecated Create React App on 14/02/2025 and its "Build a React app from Scratch" page shows npm create vite@latest my-app -- --template react-ts. CRA is tempting because it still works — it even installed React 19.3.0 in our test — but it printed "create-react-app is deprecated.", pulled in 1292 packages with 28 known vulnerabilities and needed about 7 s to start the dev server, against 27 packages, 0 vulnerabilities and 0.3–0.4 s for Vite. Opening index.html directly cannot work: the browser does not understand JSX or TypeScript.|||VI: react.dev khai tử Create React App ngày 14/02/2025 và trang "Build a React app from Scratch" của nó ghi npm create vite@latest my-app -- --template react-ts. CRA dễ nhầm vì nó vẫn chạy — thậm chí cài React 19.3.0 trong lần thử của bài — nhưng nó in "create-react-app is deprecated.", kéo về 1292 gói với 28 lỗ hổng đã biết và mất khoảng 7 s để khởi động máy chủ dev, so với 27 gói, 0 lỗ hổng và 0,3–0,4 s của Vite. Mở thẳng index.html thì không chạy được: trình duyệt không hiểu JSX hay TypeScript.',
          },
        ],
      },
    },

  ],
};
