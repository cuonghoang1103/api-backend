import { gallery, slide } from './_slides.mjs';

/**
 * React — Chương 4: Effect (soạn chi tiết 25/09/2026, thay chương KHUNG trong react.mjs).
 * GIỮ: title chương + slug rx-4-1-use-effect, rx-4-2-khong-can, rx-4-3-vong-lap, rx-4-4-custom-hook (type LESSON).
 * THÊM: rx-4-0-slides (DOCUMENT, đầu chương), rx-4-5-kiem-tra (QUIZ).
 * Mọi output trong bài là THẬT, chạy 25/09/2026 trên máy dựng bài, dự án thử `phong-kham` (bản sau Chương 3 + phần Chương 4)
 * (react 19.3.0 · vite 8.3.1 · typescript 6.0.3 · vitest 5.0.1 · @testing-library/react 16.3.3 · jsdom · oxlint 1.85.0),
 * cùng Chromium thật (Playwright) cho console của Strict Mode, vòng lặp vô hạn và bản nháp sau khi tải lại trang.
 * Deck: scripts/slides-src/rx-04.mjs (29 slide). Ảnh chụp giao diện: scripts/slides-src/rx-anh/rx-04/.
 */

export default {
  title: 'Chapter 4 — Effects|||Chương 4 — Effect',
  description: 'Đồng bộ với thế giới bên ngoài React — và dùng ít effect hơn: useEffect chạy khi nào, dependency, cleanup, Strict Mode chạy hai lần; những chỗ không cần effect; vòng lặp vô hạn và closure cũ; và bốn hook tự viết cho phòng khám An Tâm (debounce ô tìm, bản nháp form, tiêu đề tab, đồng hồ mở cửa).',
  lessons: [

    /* ─────────────────────────── 4.0 ─────────────────────────── */
    {
      title: '4.0 — Chapter 4 slides: effects in pictures|||4.0 — Slide Chương 4: effect bằng hình',
      slug: 'rx-4-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 4: effect chạy sau khi vẽ, dependency, cleanup, Strict Mode trong Chromium thật, những chỗ không cần effect, vòng lặp vô hạn đếm theo giây, closure cũ, useEffectEvent, linter, và bốn hook tự viết của dự án.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Until now every component only calculated: props and state in, JSX out. Real apps also have to touch things React does not own — the browser tab&#39;s title, a timer, <code>localStorage</code>, a connection. This chapter teaches the one tool for that, <code>useEffect</code>, and spends just as long on when <em>not</em> to use it. It ends with four small hooks that make the clinic app feel finished: a search box that waits until you stop typing, a booking form that survives a page reload, a tab title that names the doctor, and a live "open now?" badge.</p>
<p>Slides 3–8 belong to Lesson 4.1 (useEffect, dependencies and cleanup), 9–14 to 4.2 (you might not need an effect), 15–20 to 4.3 (infinite loops and stale closures), and 21–26 to 4.4 (custom hooks). The last three are the chapter&#39;s common mistakes, a cheat sheet and the "keep building the project" task. Every terminal on the slides is real output recorded on 25 September 2026 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.1, oxlint 1.85.0). Four measurements come from a real Chromium browser: Strict Mode&#39;s extra setup and cleanup in the console, an infinite loop counted second by second (46,167 renders in three seconds), a dependency object that keeps an effect running while the screen looks correct, and a form draft that is still there after reloading the page.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Tới giờ mọi component chỉ làm một việc: tính. Props và state vào, JSX ra. App thật còn phải đụng tới những thứ React không quản — tiêu đề tab trình duyệt, một bộ hẹn giờ, <code>localStorage</code>, một kết nối. Chương này dạy công cụ duy nhất cho việc đó, <code>useEffect</code>, và dành thời gian ngang như thế cho câu hỏi khi nào <em>không</em> dùng nó. Chương kết thúc bằng bốn hook nhỏ làm app phòng khám "ra dáng" hẳn: ô tìm chờ bạn gõ xong mới lọc, form đặt lịch sống sót qua lần tải lại trang, tiêu đề tab ghi tên bác sĩ, và nhãn "đang mở cửa?" tự cập nhật.</p>
<p>Slide 3–8 thuộc Bài 4.1 (useEffect, dependency và cleanup), 9–14 thuộc 4.2 (có thể bạn không cần effect), 15–20 thuộc 4.3 (vòng lặp vô hạn và closure cũ), 21–26 thuộc 4.4 (hook tự viết). Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và đề "tự gõ tiếp dự án". Mọi terminal trên slide là output THẬT ghi ngày 25/09/2026 (React 19.3.0, Vite 8.3.1, TypeScript 6.0.3, Vitest 5.0.1, oxlint 1.85.0). Bốn phép đo lấy từ trình duyệt Chromium thật: Strict Mode chạy thêm setup và cleanup trên console, một vòng lặp vô hạn đếm theo từng giây (46.167 lượt render trong ba giây), một object làm dependency khiến effect chạy mãi trong khi màn hình trông vẫn đúng, và bản nháp form vẫn còn sau khi tải lại trang.</p>
</div>
${gallery('rx-04', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Effect đồng bộ component với thứ nằm ngoài React'], [4, 'Effect chạy sau khi React sửa DOM và trình duyệt vẽ'], [5, 'Mảng dependency quyết định khi nào chạy lại'],
  [6, 'Cleanup chạy trước lần setup kế tiếp và khi gỡ'], [7, 'Strict Mode chạy thử setup → cleanup → setup'], [8, 'Thiếu cleanup: đồng hồ chạy gấp đôi'],
  [9, 'Tính được thì tính ngay khi render'], [10, 'Nhật ký thật: effect vẽ gấp đôi'], [11, 'Reset state bằng key, không bằng effect'],
  [12, 'Việc do người dùng bấm thì làm trong handler'], [13, 'Tải dữ liệu trong effect: cuộc đua'], [14, 'Có cần effect không? Ba câu hỏi'],
  [15, 'Vòng lặp vô hạn trong Chromium thật'], [16, 'Object làm dependency: effect luôn chạy'], [17, 'Hàm làm dependency'],
  [18, 'Closure cũ trong setInterval'], [19, 'useEffectEvent'], [20, 'Linter đếm dependency hộ bạn'],
  [21, 'Hook tự viết: chia sẻ logic, không chia sẻ state'], [22, 'useDebounce cho ô tìm'], [23, 'useLocalStorage: bản nháp sống qua tải lại'],
  [24, 'Đồng hồ đang mở cửa'], [25, 'Quy tắc hook'], [26, 'Hai test cũ đỏ vì hook mới'],
  [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Tự gõ tiếp dự án'],
])}
`,
    },

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — useEffect, dependencies and cleanup: when it runs and why Strict Mode runs it twice|||4.1 — useEffect, dependency và cleanup: khi nào chạy và vì sao Strict Mode chạy hai lần',
      slug: 'rx-4-1-use-effect',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Effect đồng bộ component với thứ nằm ngoài React: chạy SAU khi vẽ (đo thật), ba dạng mảng dependency (4/1/2 lần), cleanup chạy trước lần setup kế tiếp và khi gỡ, Strict Mode chạy setup → cleanup → setup trong Chromium thật, và đồng hồ thiếu cleanup tích 12 lần sau khi đã bị gỡ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>useEffect, dependencies and cleanup: when it runs, what it cleans, and why Strict Mode runs it twice</h2>
<p class="lead">Chapter 1 said a component must be pure: given the same props and state it returns the same JSX, and it changes nothing outside itself. Chapter 2 added event handlers, where changes are allowed because a user asked for them. That still leaves a gap. The clinic app wants the browser tab to read "BS. Trần Thu Hà · Phòng khám An Tâm" while that doctor is open, and a header badge that turns from "closed" to "open" at 7:30 without anyone clicking anything. Nobody clicks to make those happen — they must happen <em>because the component is on screen</em>. That is what an effect is for.</p>

<p>This lesson builds the mental model with small components whose every step is logged, run in Vitest and in a real Chromium browser. You will see the exact order in which React renders, runs an effect, cleans it up and runs it again; what the dependency array changes (measured: 4 runs, 1 run, 2 runs for the same four renders); why React 19 in development deliberately runs your effect twice; and what happens to a timer nobody stops — it kept ticking 12 times after its component had been removed.</p>

<h3>An effect synchronises a component with something outside React</h3>
${slide('rx-04', 3, 'An effect synchronises a component with something outside React')}
<p>Think of two kinds of code in a component:</p>
<ul>
<li><strong>Rendering code</strong> — the body of the function. It reads props and state and returns JSX. It must be pure: React may call it at any time, several times, and throw the result away (Chapter 1 measured Strict Mode calling it twice).</li>
<li><strong>Side effects</strong> — anything that changes the world outside the return value: writing <code>document.title</code>, starting a <code>setInterval</code>, saving to <code>localStorage</code>, opening a connection, subscribing to a library&#39;s events, sending a request.</li>
</ul>
<p>Side effects have two legal homes. If a <strong>user action</strong> causes them — a click, a submit — they belong in the <strong>event handler</strong> (Chapter 2). If they must happen <strong>because the component is displayed</strong>, and stay in sync with what it displays, they belong in an <strong>effect</strong>. React&#39;s documentation calls effects an "escape hatch": a way to step outside React and synchronise with an external system. The slide shows the four external systems this chapter will touch in the clinic app.</p>
<p>The shape of every effect is the same:</p>
<pre><code class="language-tsx">import { useEffect } from 'react';

function TieuDeBacSi({ ten }: { ten: string }) {
  useEffect(() =&gt; {
    // 1. setup: start synchronising
    document.title = &#96;&#36;{ten} · Phòng khám An Tâm&#96;;
    return () =&gt; {
      // 2. cleanup: stop synchronising (optional, but often needed)
    };
  }, [ten]); // 3. dependencies: the values the setup reads
  return &lt;h2&gt;{ten}&lt;/h2&gt;;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: a function that returns a function.</strong> <code>() =&gt; { …; return () =&gt; { … }; }</code> is an arrow function whose body ends by returning <em>another</em> arrow function. React calls the outer one (setup) and keeps what it returns (cleanup) to call later. Nothing runs the inner function immediately. The backtick string <code>&#96;&#36;{ten} · …&#96;</code> is a template literal: <code>&#36;{ten}</code> is replaced by the value of <code>ten</code>.</p></div>
<p>Three rules follow directly from that shape, and the rest of the lesson measures each one: the setup runs <em>after</em> the screen is updated; the dependency array decides when the pair runs again; and React always runs the old cleanup before a new setup.</p>

<h3>An effect runs after React has updated the DOM and the browser has painted</h3>
${slide('rx-04', 4, 'An effect runs after React has updated the DOM and the browser has painted')}
<p>React&#39;s work on each update has phases: something <strong>triggers</strong> it (the first display, or a <code>setState</code>); React <strong>renders</strong> (calls your component functions); React <strong>commits</strong> (changes the real DOM to match); the browser <strong>paints</strong> the pixels. Effects run at the end, after the commit — normally after the paint too, so a slow effect never delays what the user sees first.</p>
<p>A small component shows the difference. It looks for its own paragraph in the DOM twice: once while rendering, once inside an effect.</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export function DocDom() {
  const trongRender = document.getElementById('dong-ho-demo')?.textContent ?? 'null (chưa có trong DOM)';
  nhatKy.push(&#96;trong render: &#36;{trongRender}&#96;);
  useEffect(() =&gt; {
    nhatKy.push(&#96;trong effect: &#36;{document.getElementById('dong-ho-demo')?.textContent}&#96;);
  }, []);
  return &lt;p id="dong-ho-demo"&gt;07:30&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: <code>?.</code> and <code>??</code>.</strong> <code>a?.b</code> ("optional chaining") reads <code>b</code> only if <code>a</code> is not <code>null</code>/<code>undefined</code>; otherwise the whole expression is <code>undefined</code> instead of crashing. <code>x ?? y</code> ("nullish coalescing") gives <code>y</code> when <code>x</code> is <code>null</code> or <code>undefined</code>. Together: "the paragraph&#39;s text, or this message if there is no paragraph yet". (Reading <code>document</code> during render is done here only to prove a point — do not do it in real components.)</p></div>
<div class="out">$ npx vitest run src/vi-du/b1 -t "SAU khi DOM" --reporter=verbose
stdout | src/vi-du/b1.test.tsx &gt; effect chạy SAU khi DOM đã có
trong render: null (chưa có trong DOM)
trong effect: 07:30
 ✓ src/vi-du/b1.test.tsx &gt; effect chạy SAU khi DOM đã có</div>
<p>During render the paragraph does not exist yet — React has not committed anything. Inside the effect it exists and contains "07:30". So an effect can safely read or change the DOM, measure an element, or hand a DOM node to a non-React library. (For the rare case where you must measure and change the layout <em>before</em> the paint — a tooltip that must not flicker — React has <code>useLayoutEffect</code>; Chapter 11 uses it.)</p>

<h3>The dependency array decides when the effect runs again</h3>
${slide('rx-04', 5, 'The dependency array decides when the effect runs again')}
<p>The second argument of <code>useEffect</code> is a list of values. After every render React compares each item with the same item from the previous render; if <em>any</em> differs, the effect runs again. There are three forms, and one component can use all three:</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export const dem = { khongMang: 0, mangRong: 0, coPhuThuoc: 0 };
export function BaDang({ bacSiId, soLanBam }: { bacSiId: string; soLanBam: number }) {
  useEffect(() =&gt; {
    dem.khongMang++;
  }); // no array: after EVERY render
  useEffect(() =&gt; {
    dem.mangRong++;
  }, []); // empty array: only after the first display
  useEffect(() =&gt; {
    dem.coPhuThuoc++;
  }, [bacSiId]); // only when bacSiId differs from last time
  return (
    &lt;p&gt;
      {bacSiId} · {soLanBam}
    &lt;/p&gt;
  );
}</code></pre>
<p>The test displays it once, then re-renders three times with <code>bacSiId</code> going bs-1 → bs-1 → bs-2 → bs-2:</p>
<div class="out">$ npx vitest run src/vi-du/b1 -t "ba dạng" --reporter=verbose
stdout | src/vi-du/b1.test.tsx &gt; ba dạng dependency sau 1 lần hiện + 3 lần vẽ lại (bacSiId đổi 1 lần)
không mảng: 4 lần · [] : 1 lần · [bacSiId]: 2 lần
 ✓ src/vi-du/b1.test.tsx &gt; ba dạng dependency sau 1 lần hiện + 3 lần vẽ lại (bacSiId đổi 1 lần)</div>
<p>No array: 4 runs, one per render. Empty array: 1 run, at the first display. <code>[bacSiId]</code>: 2 runs — the first display, and the render where bs-1 became bs-2. Renders where <code>bacSiId</code> stayed the same were skipped even though <code>soLanBam</code> changed, because <code>soLanBam</code> is not in the list — and the effect does not read it.</p>
<p>That last clause is the real rule. <strong>The dependency list is not a setting you choose; it is a description of what the effect reads.</strong> Every "reactive value" the setup uses — props, state, and variables calculated from them inside the component — must be in the list. If you leave one out, the effect keeps using an old value (Lesson 4.3 shows the bug); if you add one it does not read, it re-runs for nothing. Lesson 4.3 also shows a linter that checks the list for you.</p>
<div class="callout"><p><strong>JS quick reminder: how React compares.</strong> React compares each dependency with <code>Object.is(old, new)</code>. For strings, numbers and booleans that means "same value": <code>Object.is('bs-1', 'bs-1')</code> is <code>true</code>. For objects, arrays and functions it means "the very same object in memory": <code>Object.is({ a: 1 }, { a: 1 })</code> is <code>false</code>, because each <code>{ … }</code> creates a new object. Keep that in mind — it is the cause of most infinite loops in Lesson 4.3.</p></div>

<h3>Cleanup runs before the next setup, and when the component is removed</h3>
${slide('rx-04', 6, 'Cleanup runs before the next setup, and when the component is removed')}
<p>If the setup starts something, the cleanup stops it. React calls the cleanup in two situations: <strong>before running the setup again</strong> (because a dependency changed), and <strong>when the component is removed</strong> from the screen ("unmounted"). To see the order, <code>TieuDeBacSi</code> from the start of the lesson logs every step:</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export function TieuDeBacSi({ ten }: { ten: string }) {
  nhatKy.push(&#96;render (&#36;{ten})&#96;);
  useEffect(() =&gt; {
    nhatKy.push(&#96;effect: đặt tiêu đề "&#36;{ten}"&#96;);
    document.title = &#96;&#36;{ten} · Phòng khám An Tâm&#96;;
    return () =&gt; {
      nhatKy.push(&#96;cleanup: dọn tiêu đề "&#36;{ten}"&#96;);
    };
  }, [ten]);
  return &lt;h2&gt;{ten}&lt;/h2&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b1 -t "thứ tự" --reporter=verbose
render (BS. Nguyễn Minh An)
effect: đặt tiêu đề "BS. Nguyễn Minh An"
— đổi sang bác sĩ khác —
render (BS. Trần Thu Hà)
cleanup: dọn tiêu đề "BS. Nguyễn Minh An"
effect: đặt tiêu đề "BS. Trần Thu Hà"
— vẽ lại, ten KHÔNG đổi —
render (BS. Trần Thu Hà)
— gỡ component —
cleanup: dọn tiêu đề "BS. Trần Thu Hà"
document.title = BS. Trần Thu Hà · Phòng khám An Tâm
 ✓ src/vi-du/b1.test.tsx &gt; thứ tự: render → effect; đổi ten → cleanup cũ rồi effect mới; gỡ → cleanup</div>
<p>Read it slowly — it answers most interview questions about effects:</p>
<ul>
<li><strong>Render first, effect after.</strong> Every block starts with "render".</li>
<li><strong>On a change, the old cleanup runs before the new setup</strong>, and the old cleanup still sees the <em>old</em> name ("BS. Nguyễn Minh An"). Each render carries its own effect and its own cleanup, with the values of that render.</li>
<li><strong>No change, nothing runs.</strong> The third render logged only "render".</li>
<li><strong>Removal runs the last cleanup.</strong></li>
<li><strong>The last line is a bug waiting to happen.</strong> This cleanup only writes to the log; it does not put the old title back. After the component is gone, the tab still says "BS. Trần Thu Hà". Lesson 4.4 fixes it in the project&#39;s <code>useTieuDeTrang</code> hook, whose cleanup restores the previous title.</li>
</ul>
<p>The picture on the slide is the model to keep: an effect is not "run on mount, run on unmount" like old lifecycle methods. It is <strong>"start synchronising with these values; stop synchronising with these values"</strong>, repeated as often as the values change.</p>

<h3>Strict Mode runs setup → cleanup → setup once, in development</h3>
${slide('rx-04', 7, 'Strict Mode runs setup → cleanup → setup once, in development')}
<p>Vite&#39;s template wraps the app in <code>&lt;StrictMode&gt;</code> in <code>main.tsx</code>. In development only, Strict Mode does extra work to expose bugs. For components it calls the function twice (Chapter 1). For effects it does something more pointed: right after the component first appears, it runs <strong>setup, then cleanup, then setup again</strong>. We opened a demo page with the Vite dev server in real Chromium and recorded the console:</p>
<pre><code class="language-tsx">// src/vi-du/trang.tsx (demo page /vi-du.html, rendered inside &lt;StrictMode&gt;)
function NhatKyStrict() {
  const [bacSi, setBacSi] = useState('BS. Nguyễn Minh An');
  useEffect(() =&gt; {
    console.log(&#96;effect: kết nối kênh nhắc lịch của &#36;{bacSi}&#96;);
    return () =&gt; console.log(&#96;cleanup: ngắt kênh của &#36;{bacSi}&#96;);
  }, [bacSi]);
  return (
    &lt;div className="hop"&gt;
      &lt;h1&gt;{bacSi}&lt;/h1&gt;
      &lt;button onClick={() =&gt; setBacSi('BS. Trần Thu Hà')}&gt;Đổi sang BS. Trần Thu Hà&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">$ node scripts/rx-chup.mjs … --dev --path /vi-du.html --click "Đổi sang BS. Trần Thu Hà"
[log] effect: kết nối kênh nhắc lịch của BS. Nguyễn Minh An
[log] cleanup: ngắt kênh của BS. Nguyễn Minh An
[log] effect: kết nối kênh nhắc lịch của BS. Nguyễn Minh An
[log] cleanup: ngắt kênh của BS. Nguyễn Minh An
[log] effect: kết nối kênh nhắc lịch của BS. Trần Thu Hà</div>
<p>The first three lines are the Strict Mode check at first display; the last two are the normal response to the click. Vitest shows the same pattern (rendering is doubled too):</p>
<div class="out">stdout | src/vi-du/b1.test.tsx &gt; StrictMode (dev): setup → cleanup → setup ngay lần đầu
render (BS. Nguyễn Minh An)
render (BS. Nguyễn Minh An)
effect: đặt tiêu đề "BS. Nguyễn Minh An"
cleanup: dọn tiêu đề "BS. Nguyễn Minh An"
effect: đặt tiêu đề "BS. Nguyễn Minh An"</div>
<p>Why would React do this on purpose? Because in a real app a component is often removed and shown again — a tab switched away and back, a route left and revisited — and each time its effect must stop and start cleanly. Strict Mode simulates that immediately, so that if your cleanup is missing or wrong you see <em>two</em> connections, two timers or two subscriptions while you are still developing, not in production a month later. The correct response to "my effect runs twice" is almost always <strong>write or fix the cleanup</strong> so that setup → cleanup → setup behaves exactly like one setup. The production build (<code>vite build</code>) does not do the extra run.</p>
<div class="pitfall co-tieu-de"><strong>Trap — "fixing" the double run with a ref flag.</strong> A common answer on forums is <code>const daChay = useRef(false); useEffect(() =&gt; { if (daChay.current) return; daChay.current = true; ketNoi(); }, []);</code>. The console shows one "connect" and the developer moves on. But the effect now has no cleanup at all, so in production, the day the user leaves the page and comes back, the old connection is still open next to the new one — exactly the bug Strict Mode was pointing at. React&#39;s documentation says it plainly: do not try to prevent the effect from running twice; implement the cleanup. Turning off <code>&lt;StrictMode&gt;</code> hides the warning in the same way.</div>

<h3>Missing cleanup: a clock that ticks twice and outlives its component</h3>
${slide('rx-04', 8, 'Missing cleanup: a clock that ticks twice and outlives its component')}
<p>The clinic header will show a live clock. Here are two versions — one without cleanup, one with:</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export function DongHoThieuCleanup() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    setInterval(() =&gt; {
      soLanTich.thieu++;
      setGiay((g) =&gt; g + 1);
    }, 1000);
    // ✗ no cleanup returned: the interval lives forever, even after the component is removed
  }, []);
  return &lt;p&gt;Thiếu cleanup: {giay} giây&lt;/p&gt;;
}

export function DongHoCoCleanup() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; {
      soLanTich.du++;
      setGiay((g) =&gt; g + 1);
    }, 1000);
    return () =&gt; clearInterval(id); // ✓ React calls this before removal and before the next setup
  }, []);
  return &lt;p&gt;Có cleanup: {giay} giây&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: timers.</strong> <code>setInterval(fn, 1000)</code> calls <code>fn</code> every 1000 ms and returns a number, the timer&#39;s id; <code>clearInterval(id)</code> stops it. <code>setTimeout</code>/<code>clearTimeout</code> are the one-shot versions. The browser owns these timers — React does not know they exist unless you stop them in a cleanup. <code>setGiay((g) =&gt; g + 1)</code> is the "update with a function" form from Chapter 2; Lesson 4.3 explains why it matters here.</p></div>
<p>The test renders both inside <code>&lt;StrictMode&gt;</code>, uses Vitest&#39;s fake clock (<code>vi.useFakeTimers()</code> — time only moves when the test says so), advances three seconds, removes both components and advances three more:</p>
<div class="out">$ npx vitest run src/vi-du/b1 -t "đồng hồ" --reporter=verbose
Thiếu cleanup: 6 giây | lần tích: 6
Có cleanup: 3 giây | lần tích: 3
sau khi gỡ, thêm 3 giây: thiếu cleanup đã tích 12 lần · có cleanup 3 lần
 ✓ src/vi-du/b1.test.tsx &gt; đồng hồ trong StrictMode, 3 giây, rồi gỡ và chờ thêm 3 giây</div>
<p>Without cleanup, Strict Mode&#39;s extra setup created a second interval, so after three seconds the clock says <strong>6 seconds</strong> — the bug is visible on screen, which is the point. After the components were removed, the orphaned intervals kept firing: <strong>12 ticks</strong> in total, each calling <code>setGiay</code> on a component that no longer exists. React ignores those updates, but the timers, the memory they hold and (in a real app) the network requests they send are real. With cleanup, the clock is correct under Strict Mode and stops at 3 when removed.</p>
<p>Most things an effect starts have an obvious "undo":</p>
<table>
<thead><tr><th>Setup</th><th>Cleanup</th></tr></thead>
<tbody>
<tr><td><code>const id = setInterval(…)</code> / <code>setTimeout(…)</code></td><td><code>clearInterval(id)</code> / <code>clearTimeout(id)</code></td></tr>
<tr><td><code>window.addEventListener('resize', xuLy)</code></td><td><code>window.removeEventListener('resize', xuLy)</code> (same function)</td></tr>
<tr><td><code>const huy = kho.subscribe(…)</code></td><td><code>huy()</code></td></tr>
<tr><td><code>const ketNoi = taoKetNoi(kenh); ketNoi.connect()</code></td><td><code>ketNoi.disconnect()</code></td></tr>
<tr><td><code>document.title = moi</code></td><td>put back the previous title</td></tr>
<tr><td>start a request</td><td>ignore its answer, or abort it (Lesson 4.2)</td></tr>
</tbody>
</table>
<p>Some effects need no cleanup — for example one that only logs an analytics "page viewed" event, where running twice in development is acceptable. If you cannot think of an "undo", ask whether the code should be an effect at all (Lesson 4.2).</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 slides still show class components with lifecycle methods: start a timer or fetch data in <code>componentDidMount</code>, react to changes in <code>componentDidUpdate(prevProps)</code> by comparing <code>prevProps.id !== this.props.id</code>, and stop things in <code>componentWillUnmount</code>. → At work, new code is function components with <code>useEffect</code>: one effect holds the setup and its matching cleanup side by side, and the dependency array replaces the manual <code>prevProps</code> comparison. · <em>Why:</em> with lifecycles, the start and the stop of one feature live in three different methods, and forgetting the <code>componentDidUpdate</code> branch was a classic bug (the timer kept the old doctor). An effect keeps one feature in one place and React handles the "changed" case for you. You will still meet class components in older codebases and in error boundaries (Chapter 11); knowing that <code>componentDidMount</code> + <code>componentDidUpdate</code> + <code>componentWillUnmount</code> map to one effect makes that code readable.</p></div>

<h3>Run it step by step: a live clock in the header</h3>
<ol>
<li>In a new file <code>src/components/DongHoNho.tsx</code>, write a component that keeps <code>bayGio</code> in state (<code>useState(() =&gt; new Date())</code>) and shows <code>bayGio.toLocaleTimeString('vi-VN')</code>.</li>
<li>Add an effect with an empty dependency array that starts <code>setInterval(() =&gt; setBayGio(new Date()), 1000)</code>. Do <em>not</em> return a cleanup yet.</li>
<li>Render it in <code>Header</code>, run <code>npm run dev</code>, and add a <code>console.log('tick')</code> inside the interval. Count how many "tick" lines appear per second in the console (Strict Mode is on).</li>
<li>Return <code>() =&gt; clearInterval(id)</code> from the effect. Reload and count again.</li>
<li>Add a button in <code>App</code> that hides the header (<code>{hienHeader &amp;&amp; &lt;Header /&gt;}</code>). Hide it and check that the "tick" lines stop.</li>
<li>Remove the button and the <code>console.log</code> when you are done — Lesson 4.4 turns this clock into a hook.</li>
</ol>

<h3>When to use an effect — and when not</h3>
<ul>
<li><strong>Use one</strong> to keep something outside React in sync with what the component shows: the tab title, a timer, a subscription, a connection, a non-React widget (a map, a chart), <code>localStorage</code>.</li>
<li><strong>Use one</strong> when the thing must happen because the component is visible, not because of a particular click.</li>
<li><strong>Do not use one</strong> to calculate values from props or state, to reset state when a prop changes, or to run code in response to a click — Lesson 4.2 measures what goes wrong.</li>
<li><strong>Do not use one</strong> to fetch server data in company code; Chapter 6 uses TanStack Query, which handles caching, cancellation and race conditions.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: When does <code>useEffect</code> run, and what does the dependency array do?</strong><br>A: After React commits the render to the DOM (normally after the browser paints). With no array it runs after every render; with <code>[]</code> only after the first; with <code>[a, b]</code> after the first and whenever <code>a</code> or <code>b</code> differs from the previous render by <code>Object.is</code>. The array must list every reactive value the effect reads — it describes the code, it is not an option you tune.</p>
<p><strong>Q: Why does my effect run twice in development?</strong><br>A: Strict Mode in development runs setup → cleanup → setup once after the first mount to check that the cleanup correctly undoes the setup. It does not happen in production. The fix is a correct cleanup, not a ref flag or removing Strict Mode.</p>
<p><strong>Q: When does the cleanup run?</strong><br>A: Before the effect runs again because a dependency changed (with the old values), and when the component unmounts.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the reception screen shows which doctor is selected; the browser tab should say the same, and go back to normal when nothing is selected.</p><ol>
<li>Write <code>TieuDeBacSi</code> as in this lesson, but make its cleanup restore the title that was there before (save <code>document.title</code> in a variable at the start of the setup).</li>
<li>Write a Vitest test: set <code>document.title = 'Phòng khám An Tâm'</code>, render <code>&lt;TieuDeBacSi ten="BS. Nguyễn Minh An" /&gt;</code>, re-render with "BS. Trần Thu Hà", then <code>unmount()</code>. Check <code>document.title</code> after each step.</li>
<li>Render the same component inside <code>&lt;StrictMode&gt;</code> and check the title is still correct after the first render.</li>
<li>Add a log line to setup and cleanup and compare your order with the log in this lesson.</li>
</ol><p><strong>Done when:</strong> the three <code>expect</code>s pass — "BS. Nguyễn Minh An · Phòng khám An Tâm", then "BS. Trần Thu Hà · Phòng khám An Tâm", then "Phòng khám An Tâm" after unmount; the Strict Mode render gives the same title; and <code>npx tsc -b</code> prints nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">side effect (tác dụng phụ)</span><span class="v">anything a piece of code changes outside its own return value: DOM, timers, storage, network</span></div>
<div class="kv"><span class="k">effect</span><span class="v">code in <code>useEffect</code> that keeps a component in sync with an external system while it is on screen</span></div>
<div class="kv"><span class="k">setup / cleanup</span><span class="v">the function that starts synchronising, and the function it returns that stops it</span></div>
<div class="kv"><span class="k">dependency array</span><span class="v">the reactive values an effect reads; React re-runs the effect when one differs (<code>Object.is</code>)</span></div>
<div class="kv"><span class="k">reactive value</span><span class="v">props, state, and anything calculated from them inside the component</span></div>
<div class="kv"><span class="k">commit / paint</span><span class="v">React writing the DOM / the browser drawing pixels; effects run after both</span></div>
<div class="kv"><span class="k">mount / unmount (gắn / gỡ)</span><span class="v">a component appearing on screen / being removed from it</span></div>
<div class="kv"><span class="k">Strict Mode</span><span class="v">development-only checks; for effects: setup → cleanup → setup once after mount</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Effects are for synchronising with things outside React; user-caused work goes in handlers.</li>
<li>An effect runs after the commit: during render the paragraph was <code>null</code>, in the effect it read "07:30".</li>
<li>No array / <code>[]</code> / <code>[bacSiId]</code> ran 4 / 1 / 2 times for the same four renders; list every value the effect reads.</li>
<li>Cleanup runs before the next setup (with the old values) and on unmount — think "start / stop synchronising".</li>
<li>Strict Mode ran setup → cleanup → setup in real Chromium; fix the cleanup, never block the second run.</li>
<li>A clock without cleanup showed 6 seconds after 3 and ticked 12 times after removal; with <code>clearInterval</code> it was exact.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Synchronizing with Effects</span><span class="lc-sub">react.dev/learn/synchronizing-with-effects — what effects are for, dependencies, cleanup, and "how to handle the Effect firing twice in development".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useEffect reference</span><span class="lc-sub">react.dev/reference/react/useEffect — parameters, caveats, and examples: connecting to a system, controlling a non-React widget, timers.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Lifecycle of Reactive Effects</span><span class="lc-sub">react.dev/learn/lifecycle-of-reactive-effects — why an effect "starts and stops synchronising" rather than following the component&#39;s lifecycle.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — StrictMode</span><span class="lc-sub">react.dev/reference/react/StrictMode — the development-only checks, including re-running effects.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>useEffect, dependency và cleanup: khi nào chạy, dọn gì, và vì sao Strict Mode chạy hai lần</h2>
<p class="lead">Chương 1 nói component phải thuần: cùng props và state thì trả về cùng JSX, và không đổi gì bên ngoài nó. Chương 2 thêm handler sự kiện, nơi được phép thay đổi vì người dùng yêu cầu. Vẫn còn một khoảng trống. App phòng khám muốn tab trình duyệt ghi "BS. Trần Thu Hà · Phòng khám An Tâm" khi đang xem bác sĩ đó, và muốn nhãn trên header tự chuyển từ "đóng cửa" sang "mở cửa" lúc 7:30 mà không ai bấm gì. Không có cú bấm nào gây ra những việc này — chúng phải xảy ra <em>vì component đang hiện trên màn hình</em>. Effect (hiệu ứng) sinh ra cho đúng việc đó.</p>

<p>Bài này dựng mô hình trong đầu bằng những component nhỏ ghi nhật ký từng bước, chạy trong Vitest và trong trình duyệt Chromium thật. Bạn sẽ thấy đúng thứ tự React render, chạy effect, dọn effect rồi chạy lại; mảng dependency (phụ thuộc) thay đổi được gì (đo thật: 4 lần, 1 lần, 2 lần cho cùng bốn lượt render); vì sao React 19 lúc phát triển cố ý chạy effect của bạn hai lần; và chuyện gì xảy ra với một bộ hẹn giờ không ai dừng — nó tích thêm tới 12 lần sau khi component của nó đã bị gỡ.</p>

<h3>Effect đồng bộ component với thứ nằm ngoài React</h3>
${slide('rx-04', 3, 'Effect đồng bộ component với thứ nằm ngoài React')}
<p>Hãy nghĩ về hai loại code trong một component:</p>
<ul>
<li><strong>Code render</strong> — thân hàm. Nó đọc props và state rồi trả JSX. Nó phải thuần: React có thể gọi nó bất cứ lúc nào, nhiều lần, rồi vứt kết quả (Chương 1 đã đo Strict Mode gọi nó hai lần).</li>
<li><strong>Tác dụng phụ (side effect)</strong> — mọi thứ làm thay đổi thế giới bên ngoài giá trị trả về: ghi <code>document.title</code>, bật một <code>setInterval</code>, lưu vào <code>localStorage</code>, mở một kết nối, đăng ký nghe sự kiện của một thư viện, gửi một yêu cầu mạng.</li>
</ul>
<p>Tác dụng phụ có hai chỗ ở hợp lệ. Nếu một <strong>hành động của người dùng</strong> gây ra nó — một cú bấm, một lần gửi form — thì nó thuộc về <strong>handler sự kiện</strong> (Chương 2). Nếu nó phải xảy ra <strong>vì component đang được hiển thị</strong>, và phải luôn khớp với thứ đang hiển thị, thì nó thuộc về <strong>effect</strong>. Tài liệu React gọi effect là "lối thoát hiểm" (escape hatch): cách bước ra khỏi React để đồng bộ với một hệ thống bên ngoài. Slide cho thấy bốn hệ thống bên ngoài mà chương này sẽ đụng tới trong app phòng khám.</p>
<p>Mọi effect đều có cùng một hình dạng:</p>
<pre><code class="language-tsx">import { useEffect } from 'react';

function TieuDeBacSi({ ten }: { ten: string }) {
  useEffect(() =&gt; {
    // 1. setup: bắt đầu đồng bộ
    document.title = &#96;&#36;{ten} · Phòng khám An Tâm&#96;;
    return () =&gt; {
      // 2. cleanup: ngừng đồng bộ (không bắt buộc, nhưng thường cần)
    };
  }, [ten]); // 3. dependency: những giá trị mà setup đọc
  return &lt;h2&gt;{ten}&lt;/h2&gt;;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: hàm trả về một hàm.</strong> <code>() =&gt; { …; return () =&gt; { … }; }</code> là một arrow function (hàm mũi tên) mà thân của nó kết thúc bằng việc trả về <em>một arrow function khác</em>. React gọi hàm ngoài (setup) và giữ lại thứ nó trả về (cleanup) để gọi sau. Không có gì chạy hàm bên trong ngay lập tức. Chuỗi trong dấu backtick <code>&#96;&#36;{ten} · …&#96;</code> là template literal: <code>&#36;{ten}</code> được thay bằng giá trị của <code>ten</code>.</p></div>
<p>Ba luật suy ra thẳng từ hình dạng đó, và phần còn lại của bài đo từng luật: setup chạy <em>sau</em> khi màn hình đã cập nhật; mảng dependency quyết định khi nào cặp setup/cleanup chạy lại; và React luôn chạy cleanup cũ trước setup mới.</p>

<h3>Effect chạy SAU khi React đã sửa DOM và trình duyệt đã vẽ</h3>
${slide('rx-04', 4, 'Effect chạy SAU khi React đã sửa DOM và trình duyệt đã vẽ')}
<p>Mỗi lần cập nhật, React làm việc theo từng pha: có thứ <strong>kích hoạt</strong> (trigger — lần hiện đầu tiên, hoặc một lần <code>setState</code>); React <strong>render</strong> (gọi các hàm component của bạn); React <strong>commit</strong> (sửa DOM thật cho khớp); trình duyệt <strong>paint</strong> (vẽ điểm ảnh). Effect chạy ở cuối cùng, sau commit — thường là sau cả paint, nên một effect chậm không bao giờ làm trễ thứ người dùng nhìn thấy đầu tiên.</p>
<p>Một component nhỏ cho thấy khác biệt. Nó tìm đoạn văn của chính nó trong DOM hai lần: một lần lúc render, một lần trong effect.</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export function DocDom() {
  const trongRender = document.getElementById('dong-ho-demo')?.textContent ?? 'null (chưa có trong DOM)';
  nhatKy.push(&#96;trong render: &#36;{trongRender}&#96;);
  useEffect(() =&gt; {
    nhatKy.push(&#96;trong effect: &#36;{document.getElementById('dong-ho-demo')?.textContent}&#96;);
  }, []);
  return &lt;p id="dong-ho-demo"&gt;07:30&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: <code>?.</code> và <code>??</code>.</strong> <code>a?.b</code> (optional chaining) chỉ đọc <code>b</code> khi <code>a</code> không phải <code>null</code>/<code>undefined</code>; nếu là, cả biểu thức ra <code>undefined</code> thay vì làm sập chương trình. <code>x ?? y</code> (nullish coalescing) cho <code>y</code> khi <code>x</code> là <code>null</code> hoặc <code>undefined</code>. Ghép lại: "chữ trong đoạn văn, hoặc câu này nếu chưa có đoạn văn". (Đọc <code>document</code> trong lúc render ở đây chỉ để chứng minh một ý — đừng làm vậy trong component thật.)</p></div>
<div class="out">$ npx vitest run src/vi-du/b1 -t "SAU khi DOM" --reporter=verbose
stdout | src/vi-du/b1.test.tsx &gt; effect chạy SAU khi DOM đã có
trong render: null (chưa có trong DOM)
trong effect: 07:30
 ✓ src/vi-du/b1.test.tsx &gt; effect chạy SAU khi DOM đã có</div>
<p>Lúc render, đoạn văn chưa tồn tại — React chưa commit gì cả. Trong effect, nó đã có và chứa "07:30". Vậy effect đọc hoặc sửa DOM an toàn, đo kích thước một phần tử, hay trao một nút DOM cho thư viện không phải React. (Với trường hợp hiếm phải đo và sửa bố cục <em>trước</em> khi vẽ — một tooltip không được nhấp nháy — React có <code>useLayoutEffect</code>; Chương 11 sẽ dùng.)</p>

<h3>Mảng dependency quyết định khi nào effect chạy lại</h3>
${slide('rx-04', 5, 'Mảng dependency quyết định khi nào effect chạy lại')}
<p>Tham số thứ hai của <code>useEffect</code> là một danh sách giá trị. Sau mỗi lần render, React so từng phần tử với phần tử cùng vị trí của lần render trước; chỉ cần <em>một</em> phần tử khác là effect chạy lại. Có ba dạng, và một component có thể dùng cả ba:</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export const dem = { khongMang: 0, mangRong: 0, coPhuThuoc: 0 };
export function BaDang({ bacSiId, soLanBam }: { bacSiId: string; soLanBam: number }) {
  useEffect(() =&gt; {
    dem.khongMang++;
  }); // không có mảng: sau MỌI lần render
  useEffect(() =&gt; {
    dem.mangRong++;
  }, []); // mảng rỗng: chỉ sau lần hiện đầu tiên
  useEffect(() =&gt; {
    dem.coPhuThuoc++;
  }, [bacSiId]); // chỉ khi bacSiId khác lần trước
  return (
    &lt;p&gt;
      {bacSiId} · {soLanBam}
    &lt;/p&gt;
  );
}</code></pre>
<p>Test hiện nó một lần, rồi vẽ lại ba lần với <code>bacSiId</code> đi bs-1 → bs-1 → bs-2 → bs-2:</p>
<div class="out">$ npx vitest run src/vi-du/b1 -t "ba dạng" --reporter=verbose
stdout | src/vi-du/b1.test.tsx &gt; ba dạng dependency sau 1 lần hiện + 3 lần vẽ lại (bacSiId đổi 1 lần)
không mảng: 4 lần · [] : 1 lần · [bacSiId]: 2 lần
 ✓ src/vi-du/b1.test.tsx &gt; ba dạng dependency sau 1 lần hiện + 3 lần vẽ lại (bacSiId đổi 1 lần)</div>
<p>Không mảng: 4 lần, mỗi lượt render một lần. Mảng rỗng: 1 lần, lúc hiện đầu tiên. <code>[bacSiId]</code>: 2 lần — lần hiện đầu, và lượt render mà bs-1 thành bs-2. Những lượt <code>bacSiId</code> giữ nguyên bị bỏ qua dù <code>soLanBam</code> đã đổi, vì <code>soLanBam</code> không có trong danh sách — và effect cũng không đọc nó.</p>
<p>Vế cuối đó mới là luật thật. <strong>Danh sách dependency không phải một tuỳ chọn bạn chọn; nó là bản mô tả những gì effect đọc.</strong> Mọi "giá trị phản ứng" (reactive value) mà setup dùng — props, state, và biến tính từ chúng bên trong component — đều phải có mặt. Bỏ sót một cái, effect cứ dùng giá trị cũ (Bài 4.3 cho thấy bug); thêm một cái nó không đọc, nó chạy lại vô ích. Bài 4.3 cũng giới thiệu linter kiểm danh sách hộ bạn.</p>
<div class="callout"><p><strong>JS nhắc nhanh: React so sánh thế nào.</strong> React so từng dependency bằng <code>Object.is(cũ, mới)</code>. Với chuỗi, số, boolean, nghĩa là "cùng giá trị": <code>Object.is('bs-1', 'bs-1')</code> là <code>true</code>. Với object, mảng và hàm, nghĩa là "đúng cùng một object trong bộ nhớ": <code>Object.is({ a: 1 }, { a: 1 })</code> là <code>false</code>, vì mỗi lần viết <code>{ … }</code> là tạo một object mới. Nhớ điều này — nó là thủ phạm của hầu hết các vòng lặp vô hạn ở Bài 4.3.</p></div>

<h3>Cleanup chạy trước lần setup kế tiếp, và khi gỡ component</h3>
${slide('rx-04', 6, 'Cleanup chạy trước lần setup kế tiếp, và khi gỡ component')}
<p>Setup bật cái gì thì cleanup (dọn dẹp) tắt cái đó. React gọi cleanup trong hai tình huống: <strong>trước khi chạy setup lần nữa</strong> (vì một dependency đã đổi), và <strong>khi component bị gỡ</strong> khỏi màn hình (unmount). Để thấy thứ tự, <code>TieuDeBacSi</code> ở đầu bài ghi nhật ký mọi bước:</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export function TieuDeBacSi({ ten }: { ten: string }) {
  nhatKy.push(&#96;render (&#36;{ten})&#96;);
  useEffect(() =&gt; {
    nhatKy.push(&#96;effect: đặt tiêu đề "&#36;{ten}"&#96;);
    document.title = &#96;&#36;{ten} · Phòng khám An Tâm&#96;;
    return () =&gt; {
      nhatKy.push(&#96;cleanup: dọn tiêu đề "&#36;{ten}"&#96;);
    };
  }, [ten]);
  return &lt;h2&gt;{ten}&lt;/h2&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b1 -t "thứ tự" --reporter=verbose
render (BS. Nguyễn Minh An)
effect: đặt tiêu đề "BS. Nguyễn Minh An"
— đổi sang bác sĩ khác —
render (BS. Trần Thu Hà)
cleanup: dọn tiêu đề "BS. Nguyễn Minh An"
effect: đặt tiêu đề "BS. Trần Thu Hà"
— vẽ lại, ten KHÔNG đổi —
render (BS. Trần Thu Hà)
— gỡ component —
cleanup: dọn tiêu đề "BS. Trần Thu Hà"
document.title = BS. Trần Thu Hà · Phòng khám An Tâm
 ✓ src/vi-du/b1.test.tsx &gt; thứ tự: render → effect; đổi ten → cleanup cũ rồi effect mới; gỡ → cleanup</div>
<p>Đọc chậm — nó trả lời hầu hết câu hỏi phỏng vấn về effect:</p>
<ul>
<li><strong>Render trước, effect sau.</strong> Khối nào cũng mở đầu bằng "render".</li>
<li><strong>Khi có thay đổi, cleanup cũ chạy trước setup mới</strong>, và cleanup cũ vẫn thấy tên <em>cũ</em> ("BS. Nguyễn Minh An"). Mỗi lượt render mang theo effect và cleanup của riêng nó, với các giá trị của lượt đó.</li>
<li><strong>Không đổi thì không chạy gì.</strong> Lượt render thứ ba chỉ ghi "render".</li>
<li><strong>Gỡ component thì chạy cleanup cuối cùng.</strong></li>
<li><strong>Dòng cuối là một bug đang chờ.</strong> Cleanup này chỉ ghi nhật ký; nó không trả tiêu đề cũ về. Component đã đi rồi mà tab vẫn ghi "BS. Trần Thu Hà". Bài 4.4 sửa điều này trong hook <code>useTieuDeTrang</code> của dự án, với cleanup trả lại tiêu đề trước đó.</li>
</ul>
<p>Hình trên slide là mô hình cần giữ: effect không phải "chạy khi mount, chạy khi unmount" như các phương thức vòng đời (lifecycle) kiểu cũ. Nó là <strong>"bắt đầu đồng bộ với những giá trị này; ngừng đồng bộ với những giá trị này"</strong>, lặp lại bao nhiêu lần tuỳ giá trị đổi bao nhiêu lần.</p>

<h3>Strict Mode chạy setup → cleanup → setup một lần, lúc phát triển</h3>
${slide('rx-04', 7, 'Strict Mode chạy setup → cleanup → setup một lần, lúc phát triển')}
<p>Template của Vite bọc app trong <code>&lt;StrictMode&gt;</code> ở <code>main.tsx</code>. Chỉ lúc phát triển, Strict Mode làm thêm việc để lộ bug. Với component, nó gọi hàm hai lần (Chương 1). Với effect, nó làm một việc nhắm trúng hơn: ngay sau khi component hiện lần đầu, nó chạy <strong>setup, rồi cleanup, rồi setup lần nữa</strong>. Chúng tôi mở một trang ví dụ bằng Vite dev server trong Chromium thật và ghi lại console:</p>
<pre><code class="language-tsx">// src/vi-du/trang.tsx (trang ví dụ /vi-du.html, vẽ bên trong &lt;StrictMode&gt;)
function NhatKyStrict() {
  const [bacSi, setBacSi] = useState('BS. Nguyễn Minh An');
  useEffect(() =&gt; {
    console.log(&#96;effect: kết nối kênh nhắc lịch của &#36;{bacSi}&#96;);
    return () =&gt; console.log(&#96;cleanup: ngắt kênh của &#36;{bacSi}&#96;);
  }, [bacSi]);
  return (
    &lt;div className="hop"&gt;
      &lt;h1&gt;{bacSi}&lt;/h1&gt;
      &lt;button onClick={() =&gt; setBacSi('BS. Trần Thu Hà')}&gt;Đổi sang BS. Trần Thu Hà&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="out">$ node scripts/rx-chup.mjs … --dev --path /vi-du.html --click "Đổi sang BS. Trần Thu Hà"
[log] effect: kết nối kênh nhắc lịch của BS. Nguyễn Minh An
[log] cleanup: ngắt kênh của BS. Nguyễn Minh An
[log] effect: kết nối kênh nhắc lịch của BS. Nguyễn Minh An
[log] cleanup: ngắt kênh của BS. Nguyễn Minh An
[log] effect: kết nối kênh nhắc lịch của BS. Trần Thu Hà</div>
<p>Ba dòng đầu là phép kiểm của Strict Mode lúc hiện lần đầu; hai dòng cuối là phản ứng bình thường với cú bấm. Vitest cho cùng một khuôn (render cũng bị gấp đôi):</p>
<div class="out">stdout | src/vi-du/b1.test.tsx &gt; StrictMode (dev): setup → cleanup → setup ngay lần đầu
render (BS. Nguyễn Minh An)
render (BS. Nguyễn Minh An)
effect: đặt tiêu đề "BS. Nguyễn Minh An"
cleanup: dọn tiêu đề "BS. Nguyễn Minh An"
effect: đặt tiêu đề "BS. Nguyễn Minh An"</div>
<p>Vì sao React cố ý làm vậy? Vì trong app thật, component thường bị gỡ rồi hiện lại — chuyển tab đi rồi quay về, rời một trang rồi vào lại — và mỗi lần như thế effect phải dừng và khởi động sạch sẽ. Strict Mode mô phỏng điều đó ngay lập tức, để nếu cleanup của bạn thiếu hoặc sai thì bạn thấy <em>hai</em> kết nối, hai hẹn giờ, hai đăng ký nghe ngay lúc đang phát triển, chứ không phải trên production một tháng sau. Câu trả lời đúng cho "effect của tôi chạy hai lần" gần như luôn là <strong>viết hoặc sửa cleanup</strong> sao cho setup → cleanup → setup cho kết quả y như một lần setup. Bản build production (<code>vite build</code>) không chạy thêm lần đó.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — "chữa" lần chạy thứ hai bằng một cờ useRef.</strong> Câu trả lời hay gặp trên diễn đàn là <code>const daChay = useRef(false); useEffect(() =&gt; { if (daChay.current) return; daChay.current = true; ketNoi(); }, []);</code>. Console chỉ còn một dòng "kết nối" và lập trình viên đi tiếp. Nhưng giờ effect không có cleanup nào cả, nên trên production, hôm người dùng rời trang rồi quay lại, kết nối cũ vẫn mở bên cạnh kết nối mới — đúng cái bug Strict Mode đã chỉ tay vào. Tài liệu React nói thẳng: đừng cố chặn effect chạy hai lần; hãy viết cleanup. Tắt <code>&lt;StrictMode&gt;</code> cũng chỉ là giấu cảnh báo theo cùng một cách.</div>

<h3>Thiếu cleanup: đồng hồ chạy gấp đôi và sống cả sau khi bị gỡ</h3>
${slide('rx-04', 8, 'Thiếu cleanup: đồng hồ chạy gấp đôi và sống cả sau khi bị gỡ')}
<p>Header phòng khám sẽ có một đồng hồ chạy. Đây là hai phiên bản — một không cleanup, một có:</p>
<pre><code class="language-tsx">// src/vi-du/b1.tsx
export function DongHoThieuCleanup() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    setInterval(() =&gt; {
      soLanTich.thieu++;
      setGiay((g) =&gt; g + 1);
    }, 1000);
    // ✗ không return cleanup ⇒ interval sống mãi, kể cả khi component đã bị gỡ
  }, []);
  return &lt;p&gt;Thiếu cleanup: {giay} giây&lt;/p&gt;;
}

export function DongHoCoCleanup() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; {
      soLanTich.du++;
      setGiay((g) =&gt; g + 1);
    }, 1000);
    return () =&gt; clearInterval(id); // ✓ React gọi hàm này trước khi gỡ, và trước lần setup kế tiếp
  }, []);
  return &lt;p&gt;Có cleanup: {giay} giây&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: bộ hẹn giờ.</strong> <code>setInterval(fn, 1000)</code> gọi <code>fn</code> mỗi 1000 ms và trả về một con số là mã (id) của bộ hẹn giờ; <code>clearInterval(id)</code> dừng nó. <code>setTimeout</code>/<code>clearTimeout</code> là bản chạy một lần. Trình duyệt sở hữu các bộ hẹn giờ này — React không hề biết chúng tồn tại trừ khi bạn dừng chúng trong cleanup. <code>setGiay((g) =&gt; g + 1)</code> là dạng "cập nhật theo hàm" của Chương 2; Bài 4.3 giải thích vì sao nó quan trọng ở đây.</p></div>
<p>Test vẽ cả hai bên trong <code>&lt;StrictMode&gt;</code>, dùng đồng hồ giả của Vitest (<code>vi.useFakeTimers()</code> — thời gian chỉ trôi khi test bảo nó trôi), cho chạy ba giây, gỡ cả hai component rồi cho chạy thêm ba giây:</p>
<div class="out">$ npx vitest run src/vi-du/b1 -t "đồng hồ" --reporter=verbose
Thiếu cleanup: 6 giây | lần tích: 6
Có cleanup: 3 giây | lần tích: 3
sau khi gỡ, thêm 3 giây: thiếu cleanup đã tích 12 lần · có cleanup 3 lần
 ✓ src/vi-du/b1.test.tsx &gt; đồng hồ trong StrictMode, 3 giây, rồi gỡ và chờ thêm 3 giây</div>
<p>Không có cleanup, lần setup thêm của Strict Mode tạo ra interval thứ hai, nên sau ba giây đồng hồ ghi <strong>6 giây</strong> — bug hiện ngay trên màn hình, và đó chính là mục đích. Sau khi component bị gỡ, các interval mồ côi vẫn tiếp tục chạy: tổng cộng <strong>12 lần tích</strong>, lần nào cũng gọi <code>setGiay</code> của một component không còn tồn tại. React bỏ qua những lần cập nhật đó, nhưng bộ hẹn giờ, bộ nhớ chúng giữ và (trong app thật) các yêu cầu mạng chúng gửi là có thật. Có cleanup, đồng hồ chạy đúng dưới Strict Mode và dừng ở 3 khi bị gỡ.</p>
<p>Hầu hết thứ effect khởi động đều có một thao tác "hoàn tác" rõ ràng:</p>
<table>
<thead><tr><th>Setup</th><th>Cleanup</th></tr></thead>
<tbody>
<tr><td><code>const id = setInterval(…)</code> / <code>setTimeout(…)</code></td><td><code>clearInterval(id)</code> / <code>clearTimeout(id)</code></td></tr>
<tr><td><code>window.addEventListener('resize', xuLy)</code></td><td><code>window.removeEventListener('resize', xuLy)</code> (đúng hàm đó)</td></tr>
<tr><td><code>const huy = kho.subscribe(…)</code></td><td><code>huy()</code></td></tr>
<tr><td><code>const ketNoi = taoKetNoi(kenh); ketNoi.connect()</code></td><td><code>ketNoi.disconnect()</code></td></tr>
<tr><td><code>document.title = moi</code></td><td>trả lại tiêu đề trước đó</td></tr>
<tr><td>bắt đầu một yêu cầu mạng</td><td>bỏ qua câu trả lời của nó, hoặc huỷ nó (Bài 4.2)</td></tr>
</tbody>
</table>
<p>Có effect không cần cleanup — ví dụ một effect chỉ gửi sự kiện thống kê "đã xem trang", chạy hai lần lúc phát triển cũng chấp nhận được. Nếu bạn không nghĩ ra được thao tác "hoàn tác", hãy tự hỏi đoạn code đó có nên là effect không (Bài 4.2).</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Slide FER202 vẫn còn class component với các phương thức vòng đời: bật hẹn giờ hay tải dữ liệu trong <code>componentDidMount</code>, phản ứng với thay đổi trong <code>componentDidUpdate(prevProps)</code> bằng cách so <code>prevProps.id !== this.props.id</code>, và dừng mọi thứ trong <code>componentWillUnmount</code>. → Đi làm, code mới là function component với <code>useEffect</code>: một effect chứa setup và cleanup tương ứng nằm cạnh nhau, và mảng dependency thay cho việc tự so <code>prevProps</code>. · <em>Vì sao:</em> với lifecycle, phần bật và phần tắt của cùng một tính năng nằm ở ba phương thức khác nhau, và quên nhánh <code>componentDidUpdate</code> là bug kinh điển (hẹn giờ vẫn giữ bác sĩ cũ). Effect giữ một tính năng ở một chỗ và React lo giúp trường hợp "đã đổi". Bạn vẫn sẽ gặp class component ở các codebase cũ và ở error boundary (Chương 11); biết rằng <code>componentDidMount</code> + <code>componentDidUpdate</code> + <code>componentWillUnmount</code> gộp lại thành một effect giúp bạn đọc được code đó.</p></div>

<h3>Chạy thử từng bước: đồng hồ trên header</h3>
<ol>
<li>Trong file mới <code>src/components/DongHoNho.tsx</code>, viết một component giữ <code>bayGio</code> trong state (<code>useState(() =&gt; new Date())</code>) và hiện <code>bayGio.toLocaleTimeString('vi-VN')</code>.</li>
<li>Thêm một effect với mảng dependency rỗng, bật <code>setInterval(() =&gt; setBayGio(new Date()), 1000)</code>. <em>Chưa</em> trả về cleanup.</li>
<li>Vẽ nó trong <code>Header</code>, chạy <code>npm run dev</code>, và thêm <code>console.log('tick')</code> vào trong interval. Đếm xem mỗi giây console in ra bao nhiêu dòng "tick" (Strict Mode đang bật).</li>
<li>Trả về <code>() =&gt; clearInterval(id)</code> từ effect. Tải lại và đếm lần nữa.</li>
<li>Thêm một nút trong <code>App</code> để ẩn header (<code>{hienHeader &amp;&amp; &lt;Header /&gt;}</code>). Ẩn nó và kiểm tra các dòng "tick" đã dừng.</li>
<li>Làm xong thì xoá nút và <code>console.log</code> — Bài 4.4 biến đồng hồ này thành một hook.</li>
</ol>

<h3>Khi nào dùng effect — khi nào KHÔNG</h3>
<ul>
<li><strong>Dùng</strong> để giữ một thứ bên ngoài React khớp với thứ component đang hiển thị: tiêu đề tab, bộ hẹn giờ, đăng ký nghe, kết nối, một widget không phải React (bản đồ, biểu đồ), <code>localStorage</code>.</li>
<li><strong>Dùng</strong> khi việc đó phải xảy ra vì component đang hiện, không vì một cú bấm cụ thể.</li>
<li><strong>Không dùng</strong> để tính giá trị từ props/state, để reset state khi prop đổi, hay để chạy code đáp lại một cú bấm — Bài 4.2 đo xem sai ở đâu.</li>
<li><strong>Không dùng</strong> để tải dữ liệu từ server trong code công ty; Chương 6 dùng TanStack Query, thứ lo cache, huỷ yêu cầu và cuộc đua dữ liệu.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: <code>useEffect</code> chạy lúc nào, và mảng dependency làm gì?</strong><br>Đáp: Sau khi React commit lượt render vào DOM (thường là sau khi trình duyệt vẽ). Không có mảng: chạy sau mọi lượt render; <code>[]</code>: chỉ sau lượt đầu; <code>[a, b]</code>: sau lượt đầu và mỗi khi <code>a</code> hoặc <code>b</code> khác lượt trước theo <code>Object.is</code>. Mảng phải liệt kê mọi giá trị phản ứng mà effect đọc — nó mô tả code, không phải tuỳ chọn để vặn.</p>
<p><strong>Hỏi: Vì sao effect của tôi chạy hai lần lúc phát triển?</strong><br>Đáp: Strict Mode lúc phát triển chạy setup → cleanup → setup một lần sau lần mount đầu để kiểm cleanup có hoàn tác đúng setup không. Production không có. Cách sửa là một cleanup đúng, không phải cờ useRef hay bỏ Strict Mode.</p>
<p><strong>Hỏi: Cleanup chạy khi nào?</strong><br>Đáp: Trước khi effect chạy lại vì một dependency đổi (với các giá trị cũ), và khi component unmount.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> màn hình quầy lễ tân hiện bác sĩ đang chọn; tab trình duyệt phải ghi đúng như vậy, và trở về bình thường khi không chọn ai.</p><ol>
<li>Viết <code>TieuDeBacSi</code> như trong bài, nhưng cho cleanup trả lại tiêu đề có từ trước (lưu <code>document.title</code> vào một biến ở đầu setup).</li>
<li>Viết một test Vitest: đặt <code>document.title = 'Phòng khám An Tâm'</code>, vẽ <code>&lt;TieuDeBacSi ten="BS. Nguyễn Minh An" /&gt;</code>, vẽ lại với "BS. Trần Thu Hà", rồi <code>unmount()</code>. Kiểm <code>document.title</code> sau từng bước.</li>
<li>Vẽ cùng component đó bên trong <code>&lt;StrictMode&gt;</code> và kiểm tiêu đề vẫn đúng sau lần render đầu.</li>
<li>Thêm một dòng nhật ký vào setup và cleanup, so thứ tự của bạn với nhật ký trong bài.</li>
</ol><p><strong>Đạt khi:</strong> ba <code>expect</code> đều qua — "BS. Nguyễn Minh An · Phòng khám An Tâm", rồi "BS. Trần Thu Hà · Phòng khám An Tâm", rồi "Phòng khám An Tâm" sau unmount; bản trong Strict Mode cho cùng tiêu đề; và <code>npx tsc -b</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">side effect (tác dụng phụ)</span><span class="v">mọi thứ một đoạn code thay đổi bên ngoài giá trị nó trả về: DOM, hẹn giờ, kho lưu trữ, mạng</span></div>
<div class="kv"><span class="k">effect (hiệu ứng)</span><span class="v">code trong <code>useEffect</code> giữ component khớp với một hệ thống bên ngoài trong lúc nó đang hiện</span></div>
<div class="kv"><span class="k">setup / cleanup</span><span class="v">hàm bắt đầu đồng bộ, và hàm nó trả về để ngừng đồng bộ</span></div>
<div class="kv"><span class="k">dependency array (mảng phụ thuộc)</span><span class="v">các giá trị phản ứng effect đọc; một cái khác đi (<code>Object.is</code>) thì effect chạy lại</span></div>
<div class="kv"><span class="k">reactive value (giá trị phản ứng)</span><span class="v">props, state, và mọi thứ tính từ chúng bên trong component</span></div>
<div class="kv"><span class="k">commit / paint</span><span class="v">React ghi DOM / trình duyệt vẽ điểm ảnh; effect chạy sau cả hai</span></div>
<div class="kv"><span class="k">mount / unmount (gắn / gỡ)</span><span class="v">component xuất hiện trên màn hình / bị gỡ khỏi màn hình</span></div>
<div class="kv"><span class="k">Strict Mode</span><span class="v">các phép kiểm chỉ có lúc phát triển; với effect: setup → cleanup → setup một lần sau mount</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Effect để đồng bộ với thứ nằm ngoài React; việc do người dùng gây ra thì để trong handler.</li>
<li>Effect chạy sau commit: lúc render đoạn văn là <code>null</code>, trong effect đọc được "07:30".</li>
<li>Không mảng / <code>[]</code> / <code>[bacSiId]</code> chạy 4 / 1 / 2 lần cho cùng bốn lượt render; liệt kê mọi giá trị effect đọc.</li>
<li>Cleanup chạy trước lần setup kế tiếp (với giá trị cũ) và khi unmount — nghĩ theo "bắt đầu / ngừng đồng bộ".</li>
<li>Strict Mode chạy setup → cleanup → setup trong Chromium thật; hãy sửa cleanup, đừng bao giờ chặn lần chạy thứ hai.</li>
<li>Đồng hồ thiếu cleanup báo 6 giây sau 3 giây và tích 12 lần sau khi bị gỡ; có <code>clearInterval</code> thì chính xác.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Synchronizing with Effects</span><span class="lc-sub">react.dev/learn/synchronizing-with-effects — effect dùng để làm gì, dependency, cleanup, và "xử lý effect chạy hai lần lúc phát triển".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useEffect reference</span><span class="lc-sub">react.dev/reference/react/useEffect — tham số, lưu ý, và ví dụ: kết nối một hệ thống, điều khiển widget không phải React, bộ hẹn giờ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Lifecycle of Reactive Effects</span><span class="lc-sub">react.dev/learn/lifecycle-of-reactive-effects — vì sao effect "bắt đầu và ngừng đồng bộ" thay vì đi theo vòng đời component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — StrictMode</span><span class="lc-sub">react.dev/reference/react/StrictMode — các phép kiểm chỉ có lúc phát triển, trong đó có chạy lại effect.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — You might not need an effect: compute in render, reset with a key, act in handlers|||4.2 — Có thể bạn không cần effect: tính trong render, reset bằng key, làm trong handler',
      slug: 'rx-4-2-khong-can',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Những chỗ effect thừa và cách thay: dữ liệu dẫn xuất tính trong render (đo thật: 6 lượt render thành 3, có lượt hiện số sai), reset state bằng key, việc của sự kiện đặt trong handler (effect gửi 3 lần khi đổi tab), tự fetch trong effect sinh cuộc đua dữ liệu (câu trả lời cũ đè câu mới), và linter set-state-in-effect.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>You might not need an effect: calculate while rendering, reset with a key, act in the handler</h2>
<p class="lead">Once people learn <code>useEffect</code>, they start using it as "run this when that changes" — for filtering a list, for clearing a form, for sending a request after a click. The code works in a demo. Then the list flashes the wrong count for a frame, the form keeps the previous doctor&#39;s note for one render, and the booking request goes out three times. React&#39;s own guide on this topic is titled "You Might Not Need an Effect", and this lesson measures why: each unnecessary effect adds a render, a moment where the screen is wrong, or a repeat of something that should happen once.</p>

<p>The rule of thumb from Lesson 4.1 does most of the work: an effect is for synchronising with a system <em>outside</em> React. If there is no outside system — only props, state and user actions — there is almost always a simpler place for the code. We look at the five cases that appear in real projects, with the clinic app&#39;s own components, and finish with a three-question checklist and a linter rule that catches the most common one.</p>

<h3>If you can calculate it from props or state, calculate it while rendering</h3>
${slide('rx-04', 9, 'If you can calculate it from props or state, calculate it while rendering')}
<p>Chapter 2 already built the doctor filter correctly: <code>KhuBacSi</code> keeps the search text in state and computes the filtered list in the component body with <code>locBacSi(danhSachBacSi, chuyenKhoa, tuKhoa)</code>. The effect-based version is what many people write first, because it "feels" like the list should be updated when the text changes:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function LocBangEffect() {
  const [tuKhoa, setTuKhoa] = useState('');
  const [ketQua, setKetQua] = useState&lt;BacSi[]&gt;(danhSachBacSi);
  useEffect(() =&gt; {
    setKetQua(locBacSi(danhSachBacSi, 'tat-ca', tuKhoa)); // ✗ a second state copying something calculable
  }, [tuKhoa]);
  nhatKy.push(&#96;[effect] render: tuKhoa="&#36;{tuKhoa}" → hiện &#36;{ketQua.length} bác sĩ&#96;);
  return (
    &lt;div&gt;
      &lt;input aria-label="Tìm (effect)" value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;
      &lt;p&gt;{ketQua.length} bác sĩ&lt;/p&gt;
    &lt;/div&gt;
  );
}

export function LocTrongRender() {
  const [tuKhoa, setTuKhoa] = useState('');
  const ketQua = locBacSi(danhSachBacSi, 'tat-ca', tuKhoa); // ✓ calculated during render
  nhatKy.push(&#96;[render] render: tuKhoa="&#36;{tuKhoa}" → hiện &#36;{ketQua.length} bác sĩ&#96;);
  return (
    &lt;div&gt;
      &lt;input aria-label="Tìm (render)" value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;
      &lt;p&gt;{ketQua.length} bác sĩ&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: <code>useState&lt;BacSi[]&gt;(…)</code>.</strong> The angle brackets are a TypeScript "type argument": they tell <code>useState</code> that this state holds an array of <code>BacSi</code>. <code>e.target.value</code> is the text currently in the input that fired the <code>onChange</code> event.</p></div>
<p>The test types "l" then "a" into both inputs and prints every render:</p>
${slide('rx-04', 10, 'A real render log: the effect version renders twice as often, and once shows the wrong count')}
<div class="out">$ npx vitest run src/vi-du/b2 --reporter=verbose
stdout | src/vi-du/b2.test.tsx &gt; dữ liệu dẫn xuất: gõ "l" rồi "a" — effect vẽ thêm một lượt SAI mỗi phím
[effect] render: tuKhoa="" → hiện 6 bác sĩ
[effect] render: tuKhoa="" → hiện 6 bác sĩ
[render] render: tuKhoa="" → hiện 6 bác sĩ
[effect] render: tuKhoa="l" → hiện 6 bác sĩ
[effect] render: tuKhoa="l" → hiện 2 bác sĩ
[effect] render: tuKhoa="la" → hiện 2 bác sĩ
[effect] render: tuKhoa="la" → hiện 1 bác sĩ
[render] render: tuKhoa="l" → hiện 2 bác sĩ
[render] render: tuKhoa="la" → hiện 1 bác sĩ
số lượt render: effect 6 · tính trong render 3
 ✓ src/vi-du/b2.test.tsx &gt; dữ liệu dẫn xuất: gõ "l" rồi "a" — effect vẽ thêm một lượt SAI mỗi phím</div>
<p>Three things to read in that log:</p>
<ul>
<li><strong>Twice as many renders</strong> — 6 against 3. Each keystroke renders once with the new text, then the effect runs, calls <code>setKetQua</code>, and React renders again.</li>
<li><strong>A render with the wrong data.</strong> <code>tuKhoa="l" → hiện 6 bác sĩ</code>: the input already says "l", but the list still has all six doctors. React commits that render to the DOM before the effect runs. On a fast computer you rarely see it; on a slow phone, or with a heavier list, users see the wrong count flash.</li>
<li><strong>Even the first display renders twice</strong> in the effect version — the effect runs after mount and sets state to a value equal in content but a new array.</li>
</ul>
<p>The calculated version has none of these, and there is only one source of truth: the search text. Nothing can ever disagree with it. That is the "derived state" rule of Chapter 2 seen from the effect side: <strong>if a value can be computed from props or state, do not store it in state, and do not use an effect to keep it updated.</strong></p>
<p>What if the calculation is slow — thousands of doctors, a complicated sort? Then wrap it in <code>useMemo</code> so it re-runs only when its inputs change: <code>const ketQua = useMemo(() =&gt; locBacSi(ds, chuyenKhoa, tuKhoa), [ds, chuyenKhoa, tuKhoa]);</code>. That is still a calculation during render, just cached. Chapter 8 measures when it actually pays off; with six doctors it does not.</p>
<p>oxlint 1.85 — the linter in Vite&#39;s template — recognises this pattern. Run on the example file, it says:</p>
<div class="out">$ npx oxlint src/vi-du/b2.tsx
src/vi-du/b2.tsx:13:5: warning react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders help: Effects should synchronize React with external systems. Calling setState synchronously inside an effect starts another render and is usually unnecessary. Derive the value during render, initialize state directly, or update it from the event that caused the change. Use an effect only when synchronizing with an external system.</div>
<p>(Output trimmed to the relevant line; the file also has unrelated "only-export-components" warnings because demo files export several things.) The help text is this lesson in one paragraph.</p>

<h3>To reset state when a prop changes, change the key — not an effect</h3>
${slide('rx-04', 11, 'To reset state when the doctor changes, use a key, not an effect')}
<p>The clinic&#39;s detail panel has a note box. When the receptionist switches from one doctor to another, the note must start empty. The effect version clears it when <code>bacSi.id</code> changes; the key version lets the parent give the component a different identity per doctor:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function GhiChuEffect({ bacSi }: { bacSi: BacSi }) {
  const [ghiChu, setGhiChu] = useState('');
  useEffect(() =&gt; {
    setGhiChu(''); // ✗ clears AFTER one render with the old note
  }, [bacSi.id]);
  nhatKy.push(&#96;[effect] vẽ &#36;{bacSi.ten} với ghi chú "&#36;{ghiChu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={ghiChu} onChange={(e) =&gt; setGhiChu(e.target.value)} /&gt;;
}

export function GhiChu({ bacSi }: { bacSi: BacSi }) {
  const [ghiChu, setGhiChu] = useState('');
  nhatKy.push(&#96;[key] vẽ &#36;{bacSi.ten} với ghi chú "&#36;{ghiChu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={ghiChu} onChange={(e) =&gt; setGhiChu(e.target.value)} /&gt;;
}
// in the parent: &lt;GhiChu key={bacSi.id} bacSi={bacSi} /&gt;</code></pre>
<div class="out">$ npx vitest run src/vi-du/b2 -t "reset" --reporter=verbose
[effect] vẽ BS. Trần Thu Hà với ghi chú "dị ứng"
[effect] vẽ BS. Trần Thu Hà với ghi chú ""
[key] vẽ BS. Trần Thu Hà với ghi chú ""
 ✓ src/vi-du/b2.test.tsx &gt; reset khi đổi bác sĩ: effect vẽ một lượt với ghi chú CŨ, key thì không</div>
<p>After typing "dị ứng" (allergy) for BS. Nguyễn Minh An and switching to BS. Trần Thu Hà, the effect version renders <strong>BS. Trần Thu Hà with the note "dị ứng"</strong> — the previous doctor&#39;s note — and only then clears it. The key version renders once, already empty. Chapter 1 explained why: a different <code>key</code> means "a different component", so React throws away the old state and starts fresh.</p>
<p>The project already uses this: Chapter 3 rendered <code>&lt;FormDatLich key={bacSiDangChon.id} … /&gt;</code>, so switching doctors gives a clean form. In Lesson 4.4 the key does double duty — each doctor gets its own saved draft.</p>
<p>A related case is <em>adjusting part</em> of the state when a prop changes, for example "keep the selected doctor only if they are still in the filtered list". The best answer is usually to store less: <code>KhuBacSi</code> stores <code>bacSiDangChonId</code> (a string) and derives <code>bacSiDangChon</code> with <code>find</code> on every render, so there is nothing to adjust. React&#39;s guide also shows setting state during render for the rare cases that need it; you will almost never need it in this course.</p>

<h3>Work caused by a user action belongs in the event handler</h3>
${slide('rx-04', 12, 'Work caused by a user action belongs in the event handler')}
<p>A pattern that looks tidy: keep a flag "has been sent" in state, and let an effect send the request when the flag becomes true. To see what it does, the demo keeps the flag in the parent (as a real app might, to show a ✓ in a tab bar) and lets the user switch tabs:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function KhungGuiEffect({ daGui, onGui }: { daGui: boolean; onGui: () =&gt; void }) {
  useEffect(() =&gt; {
    if (daGui) guiYeuCau('effect'); // ✗ "whenever daGui is true, send"
  }, [daGui]);
  return &lt;button onClick={onGui}&gt;Gửi (effect)&lt;/button&gt;;
}

export function KhungGuiHandler({ onGui }: { onGui: () =&gt; void }) {
  function xuLyBam() {
    guiYeuCau('handler'); // ✓ send exactly when the user clicks
    onGui();
  }
  return &lt;button onClick={xuLyBam}&gt;Gửi (handler)&lt;/button&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b2 -t "gửi trong effect" --reporter=verbose
vừa bấm xong  → effect gửi 1 lần · handler gửi 1 lần
đổi tab 2 lần → effect gửi 3 lần · handler gửi 1 lần
 ✓ src/vi-du/b2.test.tsx &gt; gửi trong effect vs trong handler: bấm một lần, rồi đổi tab đi và quay lại</div>
<p>Honest reading: right after the click, both versions sent once — Strict Mode&#39;s extra run happens only at mount, when <code>daGui</code> was still <code>false</code>. The difference appears when the component is shown again. Switching away and back mounts <code>KhungGuiEffect</code> again with <code>daGui = true</code>, so the effect sends again, and Strict Mode&#39;s check at that new mount sends once more: <strong>3 requests for one click</strong>. Without Strict Mode we measured 2. The handler version sent once, because the code runs because of the click, not because of what is on screen.</p>
<p>The question to ask of any code is: <strong>does this run because the component appeared, or because the user did something?</strong> Submitting a form, adding to a list, showing a "saved" toast, sending an analytics "button clicked" event — all "because the user did something", all handlers. Showing a chat connection while the chat is open — "because it appeared", an effect.</p>
<p>Two related habits to drop for the same reason:</p>
<ul>
<li><strong>Chains of effects</strong> — an effect sets state A, which triggers an effect that sets state B, which triggers a third. Each link is an extra render and the order becomes hard to follow. Compute what you can during render and set the rest in the one handler that started the chain.</li>
<li><strong>Notifying the parent from an effect</strong> — <code>useEffect(() =&gt; { onDoi(giaTri); }, [giaTri])</code> after a child updates its own state. Call <code>onDoi</code> in the same handler that changes the value, or lift the state up (Chapter 2) so there is only one copy.</li>
</ul>

<h3>Fetching data yourself in an effect: an old answer overwrites the new one</h3>
${slide('rx-04', 13, 'Fetching in an effect yourself: an old answer can overwrite a newer one')}
<p>Loading data is the one "outside system" everyone reaches for first, so it deserves a careful look before Chapter 6 replaces it. The demo loads a doctor&#39;s name after a delay. BS. Nguyễn Minh An&#39;s answer takes 900 ms, BS. Trần Thu Hà&#39;s 100 ms — like a slow and a fast server response:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function GioiThieuDua({ id }: { id: string }) {
  const [ten, setTen] = useState('Đang tải…');
  useEffect(() =&gt; {
    taiGioiThieu(id).then((kq) =&gt; setTen(kq)); // ✗ whichever answer arrives LAST wins
  }, [id]);
  return &lt;p&gt;Đang xem: {ten}&lt;/p&gt;;
}

export function GioiThieuCoBoQua({ id }: { id: string }) {
  const [ten, setTen] = useState('Đang tải…');
  useEffect(() =&gt; {
    let boQua = false;
    taiGioiThieu(id).then((kq) =&gt; {
      if (!boQua) setTen(kq);
    });
    return () =&gt; {
      boQua = true; // ✓ id changed ⇒ ignore the answer of the old run
    };
  }, [id]);
  return &lt;p&gt;Đang xem: {ten}&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: Promises and <code>.then</code>.</strong> <code>taiGioiThieu(id)</code> returns a <em>Promise</em> — an object that will hold a result later. <code>.then((kq) =&gt; …)</code> registers a function to run when the result arrives, with the result as <code>kq</code>. Meanwhile the rest of the code keeps running; the effect has already finished long before the answer comes. <code>let boQua = false</code> is a variable that the cleanup and the <code>.then</code> function share — a closure, explained properly in Lesson 4.3.</p></div>
<p>The test opens bs-1, immediately switches to bs-2, and lets one second pass:</p>
<div class="out">$ npx vitest run src/vi-du/b2 -t "cuộc đua" --reporter=verbose
id hiện tại = bs-2 · không cờ bỏ qua: "Đang xem: BS. Nguyễn Minh An" · có cờ bỏ qua: "Đang xem: BS. Trần Thu Hà"
 ✓ src/vi-du/b2.test.tsx &gt; cuộc đua: mở bs-1 (chậm 900ms) rồi đổi ngay sang bs-2 (100ms)</div>
<p>This is a <strong>race condition</strong>. The receptionist is looking at bs-2, the fast answer showed "Trần Thu Hà" correctly, and then the slow answer for bs-1 arrived and overwrote it. The screen now shows the wrong doctor, with no error anywhere. The cleanup flag fixes it: when <code>id</code> changes, React runs the old cleanup, which sets that run&#39;s <code>boQua</code> to <code>true</code>, so its late answer is ignored.</p>
<p>The flag is the minimum you must write if you fetch in an effect. A real app also needs a loading state, errors, retries, caching so the same doctor is not downloaded twice, and cancelling with <code>AbortController</code>. That is why company code uses a data library — Chapter 6 replaces all of this with TanStack Query&#39;s <code>useQuery</code>, which has no race by design. (React 19 also offers <code>use()</code> with Suspense for data — Chapter 12.)</p>
<div class="pitfall co-tieu-de"><strong>Trap — the doctor profile that "sometimes" shows the wrong person.</strong> A bug report says: "When I click through doctors quickly, the profile sometimes shows the previous one." Nobody can reproduce it on the office Wi-Fi. The code is <code>useEffect(() =&gt; { fetch(url).then(r =&gt; r.json()).then(setBacSi); }, [id]);</code> — no cleanup. On a slow mobile network, answers come back out of order, and the last one to arrive wins. Any effect that starts something asynchronous and later calls <code>setState</code> needs a cleanup that ignores or cancels the old run; better, use a data library.</div>

<h3>Do you need an effect? Ask three questions before writing one</h3>
${slide('rx-04', 14, 'Do you need an effect? Ask three questions before writing one')}
<ol>
<li><strong>Can it be calculated from props or state?</strong> Calculate it during render (<code>useMemo</code> if measured to be slow). No effect, no extra state.</li>
<li><strong>Is it caused by something the user did?</strong> Put it in the event handler.</li>
<li><strong>Does it keep something outside React in sync with what is on screen?</strong> That is an effect — with a cleanup — or better, a custom hook that wraps it (Lesson 4.4).</li>
</ol>
<p>And a special case of 3: <strong>loading server data</strong> — in this course, from Chapter 6 on, a data library rather than a hand-written effect.</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>FER202 examples copy props into state in the constructor or with <code>componentDidUpdate(prevProps)</code> ("if the id changed, reset the form"), and fetch data in <code>componentDidMount</code> with <code>fetch(...).then(data =&gt; this.setState({ data }))</code>; when those students move to hooks, the same habits become <code>useEffect(() =&gt; setX(...), [y])</code>. → At work, reviewers ask you to delete such effects: derived values are calculated in render, resets use a <code>key</code>, user-caused work happens in handlers, and server data comes from TanStack Query. · <em>Why:</em> every removed effect is one render fewer, one moment of wrong UI fewer (measured above), and one less place for a race. The FER202 way is not wrong in a small lab — the lab list has six items and a fast local server — but the same code breaks on a slow phone, and linters in 2026 flag it (<code>set-state-in-effect</code>).</p></div>

<h3>Run it step by step: remove two effects</h3>
<ol>
<li>Copy <code>LocBangEffect</code> into your project, render it, and add <code>console.log('render', tuKhoa, ketQua.length)</code> in the body. Type three letters and count the renders in the console.</li>
<li>Replace the second state and the effect with <code>const ketQua = locBacSi(…)</code>. Count again. Run <code>npx oxlint</code> before and after — the <code>set-state-in-effect</code> warning disappears.</li>
<li>Write a component with a note textarea and an effect that clears it when <code>bacSi.id</code> changes. Log each render; switch doctors; find the render that shows the old note.</li>
<li>Delete the effect and render the component with <code>key={bacSi.id}</code> in the parent. Check the log again.</li>
</ol>

<h3>When an effect is right — and when it is not</h3>
<ul>
<li><strong>Right:</strong> subscribing to something that changes outside React (the clock, a store, the window size), updating <code>document.title</code>, saving to storage, controlling a non-React widget.</li>
<li><strong>Not right:</strong> filtering, sorting, counting, formatting — calculate in render.</li>
<li><strong>Not right:</strong> resetting state for a new item — use <code>key</code>.</li>
<li><strong>Not right:</strong> anything that must happen once per click — handler.</li>
<li><strong>Acceptable but replace soon:</strong> fetching in an effect with an ignore flag — until you adopt a data library (Chapter 6).</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: Give examples of when you should not use <code>useEffect</code>.</strong><br>A: To derive data from props/state (compute during render, <code>useMemo</code> if expensive); to reset state when a prop changes (use a <code>key</code>); to respond to a user event (do it in the handler); to notify a parent of a change (call the callback in the handler or lift state). Effects are for synchronising with external systems. Unnecessary effects cause extra renders and a frame of stale UI.</p>
<p><strong>Q: What is a race condition in data fetching, and how do you avoid it with <code>useEffect</code>?</strong><br>A: When requests for different inputs finish out of order, the older answer can overwrite the newer one. In the effect, set a local <code>ignore</code> flag in the cleanup (or abort with <code>AbortController</code>) so answers from outdated runs are dropped. In production code, prefer a data-fetching library such as TanStack Query.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate&#39;s pull request adds a "favourite doctors count" badge and an effect-based filter. Review it by measurement.</p><ol>
<li>Write a component that keeps <code>yeuThich: string[]</code> in state and a second state <code>soYeuThich</code> updated by <code>useEffect(() =&gt; setSoYeuThich(yeuThich.length), [yeuThich])</code>, with a button that adds a doctor&#39;s id.</li>
<li>Write a test that clicks the button once and records every render&#39;s <code>(yeuThich.length, soYeuThich)</code> in an array, like this lesson&#39;s <code>nhatKy</code>.</li>
<li>Find the render where the two numbers disagree. Then replace <code>soYeuThich</code> with <code>yeuThich.length</code> computed in the body and run the test again.</li>
<li>Run <code>npx oxlint</code> on both versions.</li>
</ol><p><strong>Done when:</strong> the effect version&#39;s log contains a render like <code>(1, 0)</code> and more renders in total; the calculated version has no such render; oxlint reports <code>set-state-in-effect</code> only for the first version; <code>npx tsc -b</code> prints nothing and <code>npx vitest run</code> is green.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">derived value (giá trị dẫn xuất)</span><span class="v">something computed from props/state; calculate it during render, never store a copy</span></div>
<div class="kv"><span class="k">cascading render (render dây chuyền)</span><span class="v">an effect sets state, which renders again — each link one extra render</span></div>
<div class="kv"><span class="k">key reset</span><span class="v">changing <code>key</code> so React discards a component&#39;s state and mounts a fresh one</span></div>
<div class="kv"><span class="k">event handler</span><span class="v">the function for a user action; the place for work that must happen once per action</span></div>
<div class="kv"><span class="k">race condition (cuộc đua)</span><span class="v">asynchronous results finishing in a different order than they started, so an old one wins</span></div>
<div class="kv"><span class="k">ignore flag</span><span class="v">a local variable set in cleanup so a finished old request does not call <code>setState</code></span></div>
<div class="kv"><span class="k"><code>set-state-in-effect</code></span><span class="v">oxlint rule warning about <code>setState</code> called synchronously inside an effect</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Filtering in an effect took 6 renders instead of 3 and rendered "l → 6 doctors" once; calculating during render has one source of truth.</li>
<li>Resetting a note with an effect rendered the new doctor with the old note; <code>key={bacSi.id}</code> gives a clean component in one render.</li>
<li>Sending from an effect repeated when the component was shown again: 3 requests for one click (2 without Strict Mode); the handler sent 1.</li>
<li>Fetching in an effect without cleanup let an old, slow answer overwrite the current doctor; an ignore flag fixes the minimum, TanStack Query fixes the rest (Chapter 6).</li>
<li>Three questions: calculable → render; user-caused → handler; outside system → effect with cleanup.</li>
<li>oxlint&#39;s <code>set-state-in-effect</code> flags the most common unnecessary effect.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — You Might Not Need an Effect</span><span class="lc-sub">react.dev/learn/you-might-not-need-an-effect — derived data, <code>useMemo</code>, resetting with a key, event-specific logic, chains, notifying parents, fetching.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Synchronizing with Effects: fetching data</span><span class="lc-sub">react.dev/learn/synchronizing-with-effects — the <code>ignore</code> flag pattern and why frameworks and data libraries do better.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Preserving and Resetting State</span><span class="lc-sub">react.dev/learn/preserving-and-resetting-state — resetting state with a key.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Có thể bạn không cần effect: tính trong render, reset bằng key, xử lý trong handler</h2>
<p class="lead">Học xong <code>useEffect</code>, nhiều người bắt đầu dùng nó như câu lệnh "khi cái kia đổi thì chạy cái này" — để lọc danh sách, để xoá form, để gửi yêu cầu sau một cú bấm. Code chạy được trong bản demo. Rồi danh sách nháy con số sai trong một khung hình, form giữ ghi chú của bác sĩ trước thêm một lượt render, và yêu cầu đặt lịch bị gửi đi ba lần. Chính hướng dẫn của React về chủ đề này có tiêu đề "You Might Not Need an Effect" (Có thể bạn không cần effect), và bài này đo xem vì sao: mỗi effect thừa thêm một lượt render, một khoảnh khắc màn hình sai, hoặc một lần lặp lại của thứ lẽ ra chỉ xảy ra một lần.</p>

<p>Quy tắc từ Bài 4.1 gánh gần hết việc: effect là để đồng bộ với một hệ thống <em>bên ngoài</em> React. Không có hệ thống bên ngoài nào — chỉ có props, state và hành động của người dùng — thì gần như luôn có chỗ đơn giản hơn cho đoạn code đó. Ta xem năm trường hợp hay gặp trong dự án thật, bằng chính component của app phòng khám, rồi kết thúc bằng danh sách ba câu hỏi và một luật linter bắt được trường hợp phổ biến nhất.</p>

<h3>Tính được từ props hoặc state thì tính ngay khi render</h3>
${slide('rx-04', 9, 'Tính được từ props/state thì tính ngay khi render')}
<p>Chương 2 đã dựng bộ lọc bác sĩ đúng cách: <code>KhuBacSi</code> giữ chữ tìm kiếm trong state và tính danh sách đã lọc ngay trong thân component bằng <code>locBacSi(danhSachBacSi, chuyenKhoa, tuKhoa)</code>. Bản dùng effect là thứ nhiều người viết đầu tiên, vì "cảm giác" danh sách phải được cập nhật khi chữ đổi:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function LocBangEffect() {
  const [tuKhoa, setTuKhoa] = useState('');
  const [ketQua, setKetQua] = useState&lt;BacSi[]&gt;(danhSachBacSi);
  useEffect(() =&gt; {
    setKetQua(locBacSi(danhSachBacSi, 'tat-ca', tuKhoa)); // ✗ state thứ hai chép lại thứ tính được
  }, [tuKhoa]);
  nhatKy.push(&#96;[effect] render: tuKhoa="&#36;{tuKhoa}" → hiện &#36;{ketQua.length} bác sĩ&#96;);
  return (
    &lt;div&gt;
      &lt;input aria-label="Tìm (effect)" value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;
      &lt;p&gt;{ketQua.length} bác sĩ&lt;/p&gt;
    &lt;/div&gt;
  );
}

export function LocTrongRender() {
  const [tuKhoa, setTuKhoa] = useState('');
  const ketQua = locBacSi(danhSachBacSi, 'tat-ca', tuKhoa); // ✓ tính ngay khi render
  nhatKy.push(&#96;[render] render: tuKhoa="&#36;{tuKhoa}" → hiện &#36;{ketQua.length} bác sĩ&#96;);
  return (
    &lt;div&gt;
      &lt;input aria-label="Tìm (render)" value={tuKhoa} onChange={(e) =&gt; setTuKhoa(e.target.value)} /&gt;
      &lt;p&gt;{ketQua.length} bác sĩ&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: <code>useState&lt;BacSi[]&gt;(…)</code>.</strong> Cặp ngoặc nhọn là "tham số kiểu" của TypeScript: nó báo cho <code>useState</code> biết state này chứa một mảng <code>BacSi</code>. <code>e.target.value</code> là chữ đang có trong ô input vừa phát sự kiện <code>onChange</code>.</p></div>
<p>Test gõ "l" rồi "a" vào cả hai ô và in ra mọi lượt render:</p>
${slide('rx-04', 10, 'Nhật ký thật: bản effect vẽ gấp đôi, có một lượt hiện số sai')}
<div class="out">$ npx vitest run src/vi-du/b2 --reporter=verbose
stdout | src/vi-du/b2.test.tsx &gt; dữ liệu dẫn xuất: gõ "l" rồi "a" — effect vẽ thêm một lượt SAI mỗi phím
[effect] render: tuKhoa="" → hiện 6 bác sĩ
[effect] render: tuKhoa="" → hiện 6 bác sĩ
[render] render: tuKhoa="" → hiện 6 bác sĩ
[effect] render: tuKhoa="l" → hiện 6 bác sĩ
[effect] render: tuKhoa="l" → hiện 2 bác sĩ
[effect] render: tuKhoa="la" → hiện 2 bác sĩ
[effect] render: tuKhoa="la" → hiện 1 bác sĩ
[render] render: tuKhoa="l" → hiện 2 bác sĩ
[render] render: tuKhoa="la" → hiện 1 bác sĩ
số lượt render: effect 6 · tính trong render 3
 ✓ src/vi-du/b2.test.tsx &gt; dữ liệu dẫn xuất: gõ "l" rồi "a" — effect vẽ thêm một lượt SAI mỗi phím</div>
<p>Ba điều cần đọc trong nhật ký đó:</p>
<ul>
<li><strong>Gấp đôi số lượt render</strong> — 6 so với 3. Mỗi phím render một lần với chữ mới, rồi effect chạy, gọi <code>setKetQua</code>, và React render thêm lần nữa.</li>
<li><strong>Một lượt render với dữ liệu sai.</strong> <code>tuKhoa="l" → hiện 6 bác sĩ</code>: ô input đã ghi "l", nhưng danh sách vẫn đủ sáu bác sĩ. React commit lượt render đó vào DOM trước khi effect chạy. Trên máy nhanh hiếm khi thấy; trên điện thoại chậm, hay với danh sách nặng hơn, người dùng thấy con số sai nháy lên.</li>
<li><strong>Ngay lần hiện đầu tiên cũng render hai lần</strong> ở bản effect — effect chạy sau mount và đặt state thành một mảng có nội dung y hệt nhưng là mảng mới.</li>
</ul>
<p>Bản tính trong render không dính điều nào, và chỉ có một nguồn sự thật: chữ tìm kiếm. Không gì có thể lệch khỏi nó. Đó là luật "state dẫn xuất" của Chương 2 nhìn từ phía effect: <strong>giá trị nào tính được từ props hoặc state thì đừng cất vào state, và đừng dùng effect để giữ nó cập nhật.</strong></p>
<p>Nếu phép tính chậm thì sao — hàng nghìn bác sĩ, một kiểu sắp xếp phức tạp? Khi đó bọc nó trong <code>useMemo</code> để nó chỉ chạy lại khi đầu vào đổi: <code>const ketQua = useMemo(() =&gt; locBacSi(ds, chuyenKhoa, tuKhoa), [ds, chuyenKhoa, tuKhoa]);</code>. Đó vẫn là tính trong lúc render, chỉ là có nhớ kết quả. Chương 8 đo xem khi nào nó thật sự đáng; với sáu bác sĩ thì không.</p>
<p>oxlint 1.85 — linter có sẵn trong template Vite — nhận ra khuôn này. Chạy trên file ví dụ, nó nói:</p>
<div class="out">$ npx oxlint src/vi-du/b2.tsx
src/vi-du/b2.tsx:13:5: warning react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders help: Effects should synchronize React with external systems. Calling setState synchronously inside an effect starts another render and is usually unnecessary. Derive the value during render, initialize state directly, or update it from the event that caused the change. Use an effect only when synchronizing with an external system.</div>
<p>(Output đã rút gọn còn dòng liên quan; file còn vài cảnh báo "only-export-components" không liên quan vì file ví dụ export nhiều thứ.) Phần help chính là bài học này gói trong một đoạn: "Effect nên đồng bộ React với hệ thống bên ngoài… Hãy suy ra giá trị trong lúc render, khởi tạo state trực tiếp, hoặc cập nhật nó từ chính sự kiện gây ra thay đổi."</p>

<h3>Muốn state về trắng khi prop đổi: đổi key, đừng dùng effect</h3>
${slide('rx-04', 11, 'Muốn state về trắng khi đổi bác sĩ: dùng key, không dùng effect')}
<p>Ô chi tiết của phòng khám có một ô ghi chú. Khi lễ tân chuyển từ bác sĩ này sang bác sĩ khác, ô ghi chú phải trống. Bản effect xoá nó khi <code>bacSi.id</code> đổi; bản key để component cha cho mỗi bác sĩ một danh tính khác nhau:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function GhiChuEffect({ bacSi }: { bacSi: BacSi }) {
  const [ghiChu, setGhiChu] = useState('');
  useEffect(() =&gt; {
    setGhiChu(''); // ✗ xoá SAU khi đã vẽ một lượt với ghi chú cũ
  }, [bacSi.id]);
  nhatKy.push(&#96;[effect] vẽ &#36;{bacSi.ten} với ghi chú "&#36;{ghiChu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={ghiChu} onChange={(e) =&gt; setGhiChu(e.target.value)} /&gt;;
}

export function GhiChu({ bacSi }: { bacSi: BacSi }) {
  const [ghiChu, setGhiChu] = useState('');
  nhatKy.push(&#96;[key] vẽ &#36;{bacSi.ten} với ghi chú "&#36;{ghiChu}"&#96;);
  return &lt;textarea aria-label="Ghi chú" value={ghiChu} onChange={(e) =&gt; setGhiChu(e.target.value)} /&gt;;
}
// cha dùng: &lt;GhiChu key={bacSi.id} bacSi={bacSi} /&gt;</code></pre>
<div class="out">$ npx vitest run src/vi-du/b2 -t "reset" --reporter=verbose
[effect] vẽ BS. Trần Thu Hà với ghi chú "dị ứng"
[effect] vẽ BS. Trần Thu Hà với ghi chú ""
[key] vẽ BS. Trần Thu Hà với ghi chú ""
 ✓ src/vi-du/b2.test.tsx &gt; reset khi đổi bác sĩ: effect vẽ một lượt với ghi chú CŨ, key thì không</div>
<p>Sau khi gõ "dị ứng" cho BS. Nguyễn Minh An rồi chuyển sang BS. Trần Thu Hà, bản effect vẽ <strong>BS. Trần Thu Hà kèm ghi chú "dị ứng"</strong> — ghi chú của bác sĩ trước — rồi mới xoá. Bản key vẽ một lần, trống ngay từ đầu. Chương 1 đã giải thích vì sao: <code>key</code> khác nghĩa là "một component khác", nên React vứt state cũ và bắt đầu mới.</p>
<p>Dự án đã dùng cách này: Chương 3 vẽ <code>&lt;FormDatLich key={bacSiDangChon.id} … /&gt;</code>, nên đổi bác sĩ là có form sạch. Ở Bài 4.4 key còn làm thêm một việc — mỗi bác sĩ có bản nháp riêng.</p>
<p>Một trường hợp gần giống là <em>chỉnh một phần</em> state khi prop đổi, ví dụ "chỉ giữ bác sĩ đang chọn nếu họ vẫn còn trong danh sách đã lọc". Cách tốt nhất thường là cất ít hơn: <code>KhuBacSi</code> cất <code>bacSiDangChonId</code> (một chuỗi) và suy ra <code>bacSiDangChon</code> bằng <code>find</code> ở mỗi lượt render, nên chẳng có gì phải chỉnh. Hướng dẫn của React còn chỉ cách đặt state ngay trong lúc render cho vài trường hợp hiếm cần; trong khoá này bạn gần như sẽ không cần tới.</p>

<h3>Việc do người dùng gây ra thì làm trong handler sự kiện</h3>
${slide('rx-04', 12, 'Việc do người dùng bấm thì làm trong handler')}
<p>Một khuôn trông gọn gàng: giữ một cờ "đã gửi" trong state, rồi để một effect gửi yêu cầu khi cờ thành true. Để thấy nó làm gì, ví dụ giữ cờ ở component cha (như app thật có thể làm, để hiện dấu ✓ trên thanh tab) và cho người dùng chuyển tab:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function KhungGuiEffect({ daGui, onGui }: { daGui: boolean; onGui: () =&gt; void }) {
  useEffect(() =&gt; {
    if (daGui) guiYeuCau('effect'); // ✗ "hễ daGui là true thì gửi"
  }, [daGui]);
  return &lt;button onClick={onGui}&gt;Gửi (effect)&lt;/button&gt;;
}

export function KhungGuiHandler({ onGui }: { onGui: () =&gt; void }) {
  function xuLyBam() {
    guiYeuCau('handler'); // ✓ gửi đúng lúc người dùng bấm
    onGui();
  }
  return &lt;button onClick={xuLyBam}&gt;Gửi (handler)&lt;/button&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b2 -t "gửi trong effect" --reporter=verbose
vừa bấm xong  → effect gửi 1 lần · handler gửi 1 lần
đổi tab 2 lần → effect gửi 3 lần · handler gửi 1 lần
 ✓ src/vi-du/b2.test.tsx &gt; gửi trong effect vs trong handler: bấm một lần, rồi đổi tab đi và quay lại</div>
<p>Đọc cho trung thực: ngay sau cú bấm, cả hai bản đều gửi một lần — lần chạy thêm của Strict Mode chỉ xảy ra lúc mount, khi <code>daGui</code> còn là <code>false</code>. Khác biệt lộ ra khi component hiện lại. Chuyển tab đi rồi quay về làm <code>KhungGuiEffect</code> mount lại với <code>daGui = true</code>, nên effect gửi lần nữa, và phép kiểm của Strict Mode ở lần mount mới đó gửi thêm lần nữa: <strong>3 yêu cầu cho một cú bấm</strong>. Không có Strict Mode, chúng tôi đo được 2. Bản handler gửi một lần, vì code chạy do cú bấm, không do thứ đang hiện trên màn hình.</p>
<p>Câu cần hỏi với mọi đoạn code: <strong>nó chạy vì component xuất hiện, hay vì người dùng đã làm gì đó?</strong> Gửi form, thêm vào danh sách, hiện thông báo "đã lưu", gửi sự kiện thống kê "đã bấm nút" — đều là "vì người dùng làm", đều là handler. Giữ kết nối chat trong lúc khung chat đang mở — "vì nó đang hiện", là effect.</p>
<p>Hai thói quen nên bỏ cùng lý do:</p>
<ul>
<li><strong>Chuỗi effect</strong> — effect này đặt state A, kích hoạt effect khác đặt state B, lại kích hoạt effect thứ ba. Mỗi mắt xích là một lượt render thêm và thứ tự trở nên khó theo dõi. Tính những gì tính được trong render, còn lại thì đặt trong đúng một handler đã khởi đầu chuỗi.</li>
<li><strong>Báo cho cha từ một effect</strong> — <code>useEffect(() =&gt; { onDoi(giaTri); }, [giaTri])</code> sau khi con cập nhật state của nó. Hãy gọi <code>onDoi</code> ngay trong handler đã đổi giá trị, hoặc nâng state lên (Chương 2) để chỉ còn một bản.</li>
</ul>

<h3>Tự tải dữ liệu trong effect: câu trả lời cũ đè câu trả lời mới</h3>
${slide('rx-04', 13, 'Tự tải dữ liệu trong effect: câu trả lời cũ đè câu trả lời mới')}
<p>Tải dữ liệu là "hệ thống bên ngoài" mà ai cũng với tới đầu tiên, nên đáng xem kỹ trước khi Chương 6 thay nó. Ví dụ tải tên bác sĩ sau một khoảng trễ. Câu trả lời cho BS. Nguyễn Minh An mất 900 ms, cho BS. Trần Thu Hà mất 100 ms — như một phản hồi chậm và một phản hồi nhanh từ server:</p>
<pre><code class="language-tsx">// src/vi-du/b2.tsx
export function GioiThieuDua({ id }: { id: string }) {
  const [ten, setTen] = useState('Đang tải…');
  useEffect(() =&gt; {
    taiGioiThieu(id).then((kq) =&gt; setTen(kq)); // ✗ ai về SAU thắng, dù là câu trả lời cũ
  }, [id]);
  return &lt;p&gt;Đang xem: {ten}&lt;/p&gt;;
}

export function GioiThieuCoBoQua({ id }: { id: string }) {
  const [ten, setTen] = useState('Đang tải…');
  useEffect(() =&gt; {
    let boQua = false;
    taiGioiThieu(id).then((kq) =&gt; {
      if (!boQua) setTen(kq);
    });
    return () =&gt; {
      boQua = true; // ✓ id đã đổi ⇒ câu trả lời của lượt cũ bị bỏ qua
    };
  }, [id]);
  return &lt;p&gt;Đang xem: {ten}&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: Promise và <code>.then</code>.</strong> <code>taiGioiThieu(id)</code> trả về một <em>Promise</em> (lời hứa) — một object sẽ chứa kết quả vào lúc sau. <code>.then((kq) =&gt; …)</code> đăng ký một hàm để chạy khi kết quả tới, với kết quả là <code>kq</code>. Trong lúc đó phần code còn lại vẫn chạy tiếp; effect đã chạy xong từ lâu trước khi câu trả lời về. <code>let boQua = false</code> là một biến mà cleanup và hàm trong <code>.then</code> dùng chung — một closure, sẽ giải thích kỹ ở Bài 4.3.</p></div>
<p>Test mở bs-1, lập tức chuyển sang bs-2, rồi cho trôi một giây:</p>
<div class="out">$ npx vitest run src/vi-du/b2 -t "cuộc đua" --reporter=verbose
id hiện tại = bs-2 · không cờ bỏ qua: "Đang xem: BS. Nguyễn Minh An" · có cờ bỏ qua: "Đang xem: BS. Trần Thu Hà"
 ✓ src/vi-du/b2.test.tsx &gt; cuộc đua: mở bs-1 (chậm 900ms) rồi đổi ngay sang bs-2 (100ms)</div>
<p>Đây là một <strong>race condition (cuộc đua dữ liệu)</strong>. Lễ tân đang xem bs-2, câu trả lời nhanh đã hiện đúng "Trần Thu Hà", rồi câu trả lời chậm của bs-1 về tới và đè lên. Màn hình giờ hiện sai bác sĩ, không có lỗi nào ở đâu cả. Cờ trong cleanup sửa được: khi <code>id</code> đổi, React chạy cleanup cũ, đặt <code>boQua</code> của lượt đó thành <code>true</code>, nên câu trả lời về muộn của nó bị bỏ qua.</p>
<p>Cờ bỏ qua là mức tối thiểu bắt buộc nếu bạn fetch trong effect. App thật còn cần trạng thái đang tải, lỗi, thử lại, cache để cùng một bác sĩ không bị tải hai lần, và huỷ yêu cầu bằng <code>AbortController</code>. Vì vậy code công ty dùng thư viện dữ liệu — Chương 6 thay toàn bộ phần này bằng <code>useQuery</code> của TanStack Query, thứ không có cuộc đua ngay từ thiết kế. (React 19 còn có <code>use()</code> cùng Suspense cho dữ liệu — Chương 12.)</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — trang hồ sơ bác sĩ "thỉnh thoảng" hiện nhầm người.</strong> Báo lỗi viết: "Khi tôi bấm qua các bác sĩ thật nhanh, hồ sơ thỉnh thoảng hiện người trước đó." Không ai tái hiện được trên Wi-Fi văn phòng. Code là <code>useEffect(() =&gt; { fetch(url).then(r =&gt; r.json()).then(setBacSi); }, [id]);</code> — không có cleanup. Trên mạng di động chậm, các câu trả lời về không theo thứ tự, và câu về cuối cùng thắng. Mọi effect khởi động một việc bất đồng bộ rồi sau đó gọi <code>setState</code> đều cần cleanup bỏ qua hoặc huỷ lượt cũ; tốt hơn nữa, dùng thư viện dữ liệu.</div>

<h3>Có cần effect không? Hỏi ba câu trước khi viết</h3>
${slide('rx-04', 14, 'Có cần effect không? Hỏi ba câu trước khi viết')}
<ol>
<li><strong>Tính được từ props hoặc state không?</strong> Tính trong render (<code>useMemo</code> nếu đo thấy chậm). Không effect, không state thêm.</li>
<li><strong>Có phải do người dùng làm gì đó không?</strong> Đặt vào handler sự kiện.</li>
<li><strong>Có phải để giữ một thứ bên ngoài React khớp với màn hình không?</strong> Đó là effect — có cleanup — hoặc tốt hơn, một hook tự viết bọc nó lại (Bài 4.4).</li>
</ol>
<p>Và một trường hợp đặc biệt của câu 3: <strong>tải dữ liệu từ server</strong> — trong khoá này, từ Chương 6 trở đi, dùng thư viện dữ liệu thay vì tự viết effect.</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ví dụ FER202 chép props vào state trong constructor hoặc bằng <code>componentDidUpdate(prevProps)</code> ("nếu id đổi thì reset form"), và tải dữ liệu trong <code>componentDidMount</code> bằng <code>fetch(...).then(data =&gt; this.setState({ data }))</code>; khi chuyển sang hook, các thói quen đó biến thành <code>useEffect(() =&gt; setX(...), [y])</code>. → Đi làm, người review sẽ bảo bạn xoá những effect như vậy: giá trị dẫn xuất tính trong render, reset dùng <code>key</code>, việc do người dùng gây ra làm trong handler, dữ liệu server lấy qua TanStack Query. · <em>Vì sao:</em> mỗi effect bị xoá là bớt một lượt render, bớt một khoảnh khắc giao diện sai (đo ở trên), và bớt một chỗ có thể xảy ra cuộc đua. Cách FER202 không sai trong một bài lab nhỏ — danh sách trong lab có sáu phần tử và server chạy ngay trên máy — nhưng cùng đoạn code đó hỏng trên điện thoại chậm, và linter năm 2026 đánh dấu nó (<code>set-state-in-effect</code>).</p></div>

<h3>Chạy thử từng bước: xoá hai effect</h3>
<ol>
<li>Chép <code>LocBangEffect</code> vào dự án, vẽ nó, thêm <code>console.log('render', tuKhoa, ketQua.length)</code> vào thân hàm. Gõ ba chữ cái và đếm số lượt render trên console.</li>
<li>Thay state thứ hai và effect bằng <code>const ketQua = locBacSi(…)</code>. Đếm lại. Chạy <code>npx oxlint</code> trước và sau — cảnh báo <code>set-state-in-effect</code> biến mất.</li>
<li>Viết một component có ô ghi chú và một effect xoá ô đó khi <code>bacSi.id</code> đổi. Ghi nhật ký mỗi lượt render; đổi bác sĩ; tìm lượt render còn hiện ghi chú cũ.</li>
<li>Xoá effect và vẽ component với <code>key={bacSi.id}</code> ở cha. Xem lại nhật ký.</li>
</ol>

<h3>Khi nào effect là đúng — khi nào KHÔNG</h3>
<ul>
<li><strong>Đúng:</strong> đăng ký nghe một thứ thay đổi bên ngoài React (đồng hồ, một kho dữ liệu, kích thước cửa sổ), cập nhật <code>document.title</code>, lưu vào kho, điều khiển widget không phải React.</li>
<li><strong>Không đúng:</strong> lọc, sắp xếp, đếm, định dạng — tính trong render.</li>
<li><strong>Không đúng:</strong> reset state cho một đối tượng mới — dùng <code>key</code>.</li>
<li><strong>Không đúng:</strong> bất cứ thứ gì phải xảy ra đúng một lần mỗi cú bấm — handler.</li>
<li><strong>Tạm chấp nhận nhưng sớm thay:</strong> fetch trong effect có cờ bỏ qua — cho tới khi dùng thư viện dữ liệu (Chương 6).</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Cho ví dụ những lúc không nên dùng <code>useEffect</code>.</strong><br>Đáp: Để suy ra dữ liệu từ props/state (tính trong render, <code>useMemo</code> nếu nặng); để reset state khi prop đổi (dùng <code>key</code>); để phản ứng với sự kiện của người dùng (làm trong handler); để báo cho cha một thay đổi (gọi callback trong handler hoặc nâng state). Effect là để đồng bộ với hệ thống bên ngoài. Effect thừa gây render thêm và một khung hình giao diện cũ.</p>
<p><strong>Hỏi: Race condition khi tải dữ liệu là gì, tránh nó với <code>useEffect</code> thế nào?</strong><br>Đáp: Khi các yêu cầu cho những đầu vào khác nhau hoàn thành không theo thứ tự, câu trả lời cũ có thể đè câu mới. Trong effect, đặt một cờ <code>ignore</code> cục bộ trong cleanup (hoặc huỷ bằng <code>AbortController</code>) để câu trả lời của lượt đã lỗi thời bị bỏ. Trong code production, ưu tiên thư viện như TanStack Query.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> pull request của một bạn cùng nhóm thêm nhãn "số bác sĩ yêu thích" và một bộ lọc dùng effect. Hãy review bằng đo đạc.</p><ol>
<li>Viết một component giữ <code>yeuThich: string[]</code> trong state và state thứ hai <code>soYeuThich</code> được cập nhật bằng <code>useEffect(() =&gt; setSoYeuThich(yeuThich.length), [yeuThich])</code>, kèm một nút thêm id một bác sĩ.</li>
<li>Viết một test bấm nút một lần và ghi <code>(yeuThich.length, soYeuThich)</code> của mọi lượt render vào một mảng, giống <code>nhatKy</code> trong bài.</li>
<li>Tìm lượt render mà hai con số lệch nhau. Rồi thay <code>soYeuThich</code> bằng <code>yeuThich.length</code> tính trong thân hàm và chạy test lại.</li>
<li>Chạy <code>npx oxlint</code> trên cả hai phiên bản.</li>
</ol><p><strong>Đạt khi:</strong> nhật ký bản effect có một lượt kiểu <code>(1, 0)</code> và tổng số lượt render nhiều hơn; bản tính trong render không có lượt nào như vậy; oxlint chỉ báo <code>set-state-in-effect</code> ở bản đầu; <code>npx tsc -b</code> không in gì và <code>npx vitest run</code> xanh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">derived value (giá trị dẫn xuất)</span><span class="v">thứ tính được từ props/state; tính trong render, không bao giờ cất một bản sao</span></div>
<div class="kv"><span class="k">cascading render (render dây chuyền)</span><span class="v">effect đặt state, gây render lại — mỗi mắt xích thêm một lượt render</span></div>
<div class="kv"><span class="k">reset bằng key</span><span class="v">đổi <code>key</code> để React bỏ state của component và mount một bản mới</span></div>
<div class="kv"><span class="k">event handler (hàm xử lý sự kiện)</span><span class="v">hàm cho một hành động của người dùng; chỗ cho việc phải xảy ra đúng một lần mỗi hành động</span></div>
<div class="kv"><span class="k">race condition (cuộc đua dữ liệu)</span><span class="v">các kết quả bất đồng bộ về không theo thứ tự đã gửi, nên kết quả cũ thắng</span></div>
<div class="kv"><span class="k">cờ bỏ qua (ignore flag)</span><span class="v">biến cục bộ được đặt trong cleanup để yêu cầu cũ đã xong không gọi <code>setState</code></span></div>
<div class="kv"><span class="k"><code>set-state-in-effect</code></span><span class="v">luật oxlint cảnh báo <code>setState</code> gọi đồng bộ bên trong effect</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lọc bằng effect tốn 6 lượt render thay vì 3 và có một lượt vẽ "l → 6 bác sĩ"; tính trong render chỉ có một nguồn sự thật.</li>
<li>Reset ghi chú bằng effect vẽ bác sĩ mới kèm ghi chú cũ; <code>key={bacSi.id}</code> cho component sạch trong một lượt.</li>
<li>Gửi từ effect lặp lại khi component hiện lại: 3 yêu cầu cho một cú bấm (2 khi không có Strict Mode); handler gửi 1.</li>
<li>Fetch trong effect không cleanup để câu trả lời cũ, chậm đè lên bác sĩ hiện tại; cờ bỏ qua sửa mức tối thiểu, TanStack Query sửa phần còn lại (Chương 6).</li>
<li>Ba câu hỏi: tính được → render; do người dùng → handler; hệ thống bên ngoài → effect có cleanup.</li>
<li>Luật <code>set-state-in-effect</code> của oxlint bắt được kiểu effect thừa phổ biến nhất.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — You Might Not Need an Effect</span><span class="lc-sub">react.dev/learn/you-might-not-need-an-effect — dữ liệu dẫn xuất, <code>useMemo</code>, reset bằng key, logic của sự kiện, chuỗi effect, báo cho cha, tải dữ liệu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Synchronizing with Effects: fetching data</span><span class="lc-sub">react.dev/learn/synchronizing-with-effects — khuôn cờ <code>ignore</code> và vì sao framework cùng thư viện dữ liệu làm tốt hơn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Preserving and Resetting State</span><span class="lc-sub">react.dev/learn/preserving-and-resetting-state — reset state bằng key.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Infinite loops and stale closures: unstable dependencies and useEffectEvent|||4.3 — Vòng lặp vô hạn và closure cũ: dependency không ổn định và useEffectEvent',
      slug: 'rx-4-3-vong-lap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vòng lặp vô hạn đo trong Chromium thật (46.167 lượt render, 887 lỗi trong 3 giây), object và hàm tạo mới mỗi lần render làm effect chạy mãi (4 lần so với 1), useCallback đúng lúc, closure cũ trong setInterval ("Cũ: 1 giây" so với "Mới: 5 giây"), useEffectEvent của React 19.2, và để oxlint đếm dependency.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Infinite loops and stale closures: object and function dependencies, useCallback, useEffectEvent and the linter</h2>
<p class="lead">Two bugs account for most of the time people lose to effects. The first runs too often: an effect that changes state and re-runs because of it, forever — the fan spins, the console fills with red, and sometimes the screen still looks correct. The second runs too rarely, or rather with old values: a timer that keeps reading the number from the first render, a callback that remembers yesterday&#39;s filter. Both come from the same two facts you met in Lesson 4.1 — dependencies are compared with <code>Object.is</code>, and each render has its own values — and both are caught by a linter if you let it.</p>

<p>This lesson reproduces each bug, measures it (including an infinite loop counted second by second in a real Chromium), and fixes it the way React&#39;s documentation recommends, in order of preference: change the code so the effect needs fewer dependencies, update state with a function, move functions inside the effect, and only then reach for <code>useCallback</code>, <code>useMemo</code> or React 19.2&#39;s <code>useEffectEvent</code>.</p>

<h3>setState in an effect with no dependency array: a loop that never stops</h3>
${slide('rx-04', 15, 'setState in an effect with no dependency array: a loop that never stops')}
<p>Someone wants a "views" counter that goes up by one when the doctor&#39;s page is shown, and writes:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function DemLuotXem() {
  const [luotXem, setLuotXem] = useState(0);
  useEffect(() =&gt; {
    setLuotXem(luotXem + 1); // ✗ the effect changes state ⇒ render ⇒ the effect runs again ⇒ …
  });
  return &lt;p&gt;Lượt xem: {luotXem}&lt;/p&gt;;
}</code></pre>
<p>With no dependency array, the effect runs after every render. It calls <code>setLuotXem</code>, which causes a render, after which the effect runs… In jsdom the test never finished (Vitest had to be stopped), so we measured it in Chromium: a demo page with a button that shows this component, read once per second.</p>
<div class="out">$ node do-trang.mjs "/vi-du.html?demo=vong-lap" "Bật component lỗi" 3 "Lượt xem: \\d+"
sau 1 giây: "Lượt xem: 12376" · console.error: 237 lần
sau 2 giây: "Lượt xem: 28402" · console.error: 546 lần
sau 3 giây: "Lượt xem: 46167" · console.error: 887 lần
lỗi đầu tiên: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.</div>
<p>(<code>do-trang.mjs</code> is a small Playwright script from the course&#39;s practice tools: it starts the Vite dev server, opens the page, clicks the button and reads the text and the console every second.) In three seconds React rendered the component more than 46,000 times and logged 887 errors. Notice what did <em>not</em> happen: the page did not crash or go blank. React detects the pattern, prints "Maximum update depth exceeded" and keeps going, because effects run asynchronously and do not block the browser. The screenshot on the slide was taken mid-loop. A user sees a number running wildly — or, worse, nothing unusual while the laptop heats up.</p>
<p>The error message names both causes: no dependency array, <strong>or a dependency that changes on every render</strong>. The fix depends on what you meant:</p>
<ul>
<li>"Count once per display": use <code>[]</code> and the function form, <code>setLuotXem((n) =&gt; n + 1)</code>. (In development Strict Mode will make it 2 — which is honest: showing the page twice counts twice. A real view counter would be sent to a server in an analytics call.)</li>
<li>"Count when the doctor changes": <code>[bacSiId]</code>.</li>
<li>Often the real answer is Lesson 4.2: the value can be calculated, so there should be no state and no effect.</li>
</ul>

<h3>An object or array created during render is new every time, so the effect always runs</h3>
${slide('rx-04', 16, 'An object or array created during render is new every time, so the effect always runs')}
<p>The second cause is subtler, because the dependency array is there and looks right:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function KetQuaLocObject({ chuyenKhoa }: { chuyenKhoa: BoLocChuyenKhoa }) {
  const [ketQua, setKetQua] = useState&lt;BacSi[]&gt;([]);
  const boLoc = { chuyenKhoa, tuKhoa: '' }; // ✗ a NEW object on every render
  useEffect(() =&gt; {
    setKetQua(locBacSi(danhSachBacSi, boLoc.chuyenKhoa, boLoc.tuKhoa)); // a NEW array ⇒ always "different" ⇒ render
  }, [boLoc]);
  return &lt;p&gt;{ketQua.length} bác sĩ&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: shorthand properties and references.</strong> <code>{ chuyenKhoa, tuKhoa: '' }</code> is short for <code>{ chuyenKhoa: chuyenKhoa, tuKhoa: '' }</code>. Every time this line runs, JavaScript creates a brand-new object in memory, even if its contents are identical to last time. Variables holding objects hold a <em>reference</em> (an address); <code>Object.is</code> compares addresses. Two objects with the same contents at different addresses are "different" to React. The same is true for arrays (<code>[]</code>, <code>filter</code>, <code>map</code> all create new arrays) and functions.</p></div>
<p>Each render creates a new <code>boLoc</code> → the dependency differs → the effect runs → <code>setKetQua</code> receives a new array (<code>filter</code> always returns a new one) → React sees a different state and renders → a new <code>boLoc</code>… Measured in Chromium, without clicking anything:</p>
<div class="out">$ node do-trang.mjs "/vi-du.html?demo=object" - 3 "\\d+ bác sĩ"
sau 1 giây: "2 bác sĩ" · console.error: 321 lần
sau 2 giây: "2 bác sĩ" · console.error: 632 lần
sau 3 giây: "2 bác sĩ" · console.error: 945 lần
lỗi đầu tiên: Maximum update depth exceeded. …</div>
<p>This is the dangerous version: <strong>the screen is correct</strong> — "2 bác sĩ", the two paediatricians — while the loop runs forever. Only the console, and the battery, tell the truth. Two fixes, in order of preference:</p>
<pre><code class="language-tsx">// ✓ 1. depend on the primitive value, not on an object built from it
useEffect(() =&gt; {
  setKetQua(locBacSi(danhSachBacSi, chuyenKhoa, ''));
}, [chuyenKhoa]); // a string: compared by value

// ✓ 2. if you really need an object, keep the same one with useMemo
const boLoc = useMemo(() =&gt; ({ chuyenKhoa, tuKhoa: '' }), [chuyenKhoa]);
useEffect(() =&gt; {
  setKetQua(locBacSi(danhSachBacSi, boLoc.chuyenKhoa, boLoc.tuKhoa));
}, [boLoc]);</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t "useMemo" --reporter=verbose
nguyên thuỷ + useMemo: 2 bác sĩ | 2 bác sĩ · console.error: 0
 ✓ src/vi-du/b3.test.tsx &gt; dependency là chuỗi / object bọc useMemo: yên</div>
<p><code>useMemo(() =&gt; value, [deps])</code> returns the same object as last render as long as its own dependencies are unchanged. Both versions settle after one extra render and log no errors. And both are still examples of Lesson 4.2&#39;s mistake — the list is calculable, so the best fix of all is <code>const ketQua = locBacSi(…)</code> with no effect. The linter agrees: it still flags both fixed versions with <code>set-state-in-effect</code>.</p>
<p>Objects often arrive as props, too: <code>&lt;KetQua boLoc={{ chuyenKhoa }} /&gt;</code> creates a new object in the parent on every render. If the child&#39;s effect depends on <code>boLoc</code>, the loop starts in the child but its cause is in the parent. Destructure the primitives you need (<code>const { chuyenKhoa } = boLoc</code>) and depend on those.</p>

<h3>A function declared in the component is also new on every render</h3>
${slide('rx-04', 17, 'A function declared in the component is also new on every render')}
<p>Functions are objects, so the same thing happens with a helper function used inside an effect:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function KetNoiHamTho({ bacSiId, dem }: { bacSiId: string; dem: number }) {
  function taoKenh() {
    return &#96;kenh-&#36;{bacSiId}&#96;;
  }
  useEffect(() =&gt; {
    soLanKetNoi.hamTho++;
    void taoKenh();
  }, [taoKenh]); // ✗ taoKenh is a NEW function on every render
  return &lt;p&gt;{dem}&lt;/p&gt;;
}

export function KetNoiUseCallback({ bacSiId, dem }: { bacSiId: string; dem: number }) {
  const taoKenh = useCallback(() =&gt; &#96;kenh-&#36;{bacSiId}&#96;, [bacSiId]); // ✓ same function while bacSiId is unchanged
  useEffect(() =&gt; {
    soLanKetNoi.useCallback++;
    void taoKenh();
  }, [taoKenh]);
  return &lt;p&gt;{dem}&lt;/p&gt;;
}

export function KetNoiTrongEffect({ bacSiId, dem }: { bacSiId: string; dem: number }) {
  useEffect(() =&gt; {
    function taoKenh() {
      return &#96;kenh-&#36;{bacSiId}&#96;; // ✓ the function lives INSIDE the effect ⇒ only bacSiId is a dependency
    }
    soLanKetNoi.trongEffect++;
    void taoKenh();
  }, [bacSiId]);
  return &lt;p&gt;{dem}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t "hàm làm" --reporter=verbose
effect "kết nối" chạy: hàm thô 4 lần · useCallback 1 lần · hàm trong effect 1 lần
 ✓ src/vi-du/b3.test.tsx &gt; hàm làm dependency: 1 lần hiện + 3 lần vẽ lại, bacSiId không đổi</div>
<p>One display plus three re-renders where only <code>dem</code> changed: the raw-function version reconnected 4 times — imagine a chat socket disconnecting and reconnecting on every keystroke elsewhere on the page. Both fixes connected once. (It did not loop only because this effect does not set state; add a <code>setState</code> and it would.) <code>void taoKenh()</code> simply calls the function and discards its result.</p>
<p>Which fix to choose:</p>
<ul>
<li><strong>Move the function inside the effect</strong> when only this effect uses it. It is the simplest and the linter then asks only for the values the function reads.</li>
<li><strong>Move it outside the component</strong> if it reads no props or state at all (a pure helper like <code>locBacSi</code>) — then it is never a dependency.</li>
<li><strong><code>useCallback(fn, [deps])</code></strong> when the same function must be used in several places, or passed to a child that lists it in <em>its</em> effect or wraps itself in <code>memo</code> (Chapter 8). <code>useCallback</code> keeps the same function object between renders as long as its dependencies are unchanged — exactly <code>useMemo(() =&gt; fn, deps)</code>.</li>
</ul>
<p>Do not wrap every function in <code>useCallback</code> "for performance". It has a cost, makes code harder to read, and only helps when something actually compares the function&#39;s identity. The "useCallback at the right moment" in this lesson&#39;s outline means exactly this: when a function is a dependency or a prop that is compared.</p>

<h3>Stale closure: the interval keeps reading the first render&#39;s value</h3>
${slide('rx-04', 18, 'Stale closure: the interval reads the value from the first render')}
<p>The opposite bug. The dependency list is <em>short</em>, and the effect keeps seeing an old value:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function DemGiayCu() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; {
      setGiay(giay + 1); // ✗ "giay" is frozen at 0 — the value of the first render
    }, 1000);
    return () =&gt; clearInterval(id);
  }, []);
  return &lt;p&gt;Cũ: {giay} giây&lt;/p&gt;;
}

export function DemGiayMoi() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; {
      setGiay((g) =&gt; g + 1); // ✓ update with a function: React passes the LATEST value as g
    }, 1000);
    return () =&gt; clearInterval(id);
  }, []);
  return &lt;p&gt;Mới: {giay} giây&lt;/p&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t "closure" --reporter=verbose
Cũ: 1 giây | Mới: 5 giây
 ✓ src/vi-du/b3.test.tsx &gt; closure cũ: 5 giây sau</div>
<div class="callout"><p><strong>JS quick reminder: closures.</strong> A function "closes over" the variables around it when it is created: the arrow function inside <code>setInterval</code> remembers the <code>giay</code> of the render in which it was created. In React, every render is a new call of your component function, with its own <code>const giay</code>. The effect with <code>[]</code> ran only after the first render, so its interval callback remembers the first render&#39;s <code>giay</code>, which is 0 — forever. Every tick computes <code>0 + 1</code>. That remembered-but-outdated value is a <strong>stale closure</strong>.</p></div>
<p>After five seconds the old version shows 1 second; the new one shows 5. Two correct fixes:</p>
<ul>
<li><strong>Update with a function</strong> (<code>setGiay((g) =&gt; g + 1)</code>): the callback no longer reads <code>giay</code> at all, so <code>[]</code> is truly correct. This is the preferred fix whenever the new state is calculated from the old.</li>
<li><strong>List the dependency</strong> (<code>[giay]</code>): the effect re-runs every second, clearing the old interval and creating a new one that reads the new value. Correct, but it tears down and rebuilds the timer each tick. This is what the linter will suggest, because it only sees that <code>giay</code> is read.</li>
</ul>
<p>Stale closures appear anywhere a function created in one render is called later: in <code>setTimeout</code>, in an event listener added in an effect, in a <code>.then</code> after a request. The question is always "which render&#39;s values does this function see?"</p>

<h3>useEffectEvent: read the latest values without re-running the effect</h3>
${slide('rx-04', 19, 'useEffectEvent: read the latest value without re-running the effect')}
<p>Sometimes an effect needs a value <em>at the moment something happens</em>, but changes of that value should not restart the effect. The clinic example: a reminder timer per doctor that plays a sound if sound is on. Changing the sound setting should not reset the timer; changing the doctor should. React 19.2 (October 2025) made <code>useEffectEvent</code> stable for exactly this — we checked it exists in React 19.3&#39;s type definitions (<code>export function useEffectEvent&lt;T extends Function&gt;(callback: T): T;</code>) and ran it:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
import { useEffect, useEffectEvent } from 'react';

export function NhacGioKham({ bacSiId, amThanh }: { bacSiId: string; amThanh: boolean }) {
  const onDenGio = useEffectEvent(() =&gt; {
    nhatKy.push(&#96;nhắc giờ khám &#36;{bacSiId} · âm thanh &#36;{amThanh ? 'BẬT' : 'TẮT'}&#96;);
  });
  useEffect(() =&gt; {
    nhatKy.push(&#96;hẹn giờ cho &#36;{bacSiId}&#96;);
    const id = setInterval(() =&gt; onDenGio(), 1000);
    return () =&gt; clearInterval(id);
  }, [bacSiId]); // amThanh is NOT here — changing the sound does not reset the timer
  return null;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t useEffectEvent --reporter=verbose
hẹn giờ cho bs-1
nhắc giờ khám bs-1 · âm thanh TẮT
nhắc giờ khám bs-1 · âm thanh BẬT
hẹn giờ cho bs-2
nhắc giờ khám bs-2 · âm thanh BẬT
 ✓ src/vi-du/b3.test.tsx &gt; useEffectEvent: đổi âm thanh không đặt lại hẹn giờ, nhưng lần nhắc sau thấy giá trị mới</div>
<p>Switching the sound on did not log a new "hẹn giờ" (timer set), yet the next reminder saw "BẬT" (on) — no stale closure. Switching the doctor restarted the timer, as it should. The rules, from React&#39;s reference: call the effect event only from inside effects; declare it in the same component as the effect; never list it as a dependency; and do not use it merely to silence the linter — if a value should restart the effect when it changes, it belongs in the dependency list.</p>
<p>Before React 19.2, people solved this with a <code>useRef</code> holding the latest value, updated on every render. You will see that pattern in existing code; <code>useEffectEvent</code> is the supported replacement (tính đến 09/2026).</p>

<h3>Let the linter count the dependencies</h3>
${slide('rx-04', 20, 'Let the linter count the dependencies')}
<p>You do not have to find these bugs by hand. Vite&#39;s React template (create-vite 9, September 2026) ships oxlint with its <code>react</code> plugin, and the <code>exhaustive-deps</code> check runs even though the template&#39;s <code>.oxlintrc.json</code> lists only <code>rules-of-hooks</code> and <code>only-export-components</code>. Run on this lesson&#39;s example file:</p>
<div class="out">$ npx oxlint src/vi-du/b3.tsx
src/vi-du/b3.tsx:9:3: warning react-hooks(exhaustive-deps): React Hook useEffect contains a call to setState. Without a list of dependencies, this can lead to an infinite chain of updates. help: Consider adding an empty list of dependencies to make it clear which values are intended to be stable.
src/vi-du/b3.tsx:21:7: warning react-hooks(exhaustive-deps): React hook useEffect depends on &#96;boLoc&#96;, which changes every render help: Try memoizing this variable with &#96;useRef&#96; or &#96;useCallback&#96;.
src/vi-du/b3.tsx:41:7: warning react-hooks(exhaustive-deps): React hook useEffect depends on &#96;taoKenh&#96;, which changes every render help: Try memoizing this variable with &#96;useRef&#96; or &#96;useCallback&#96;.
src/vi-du/b3.tsx:68:15: warning react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'giay' help: Either include it or remove the dependency array.
src/vi-du/b3.tsx:10:5: warning react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders …
…</div>
<p>Every bug in this lesson is on that list: the missing array (line 9), the object (21), the function (41), the stale <code>giay</code> (68). The project itself — the hooks and components you build in Lesson 4.4 — lints with zero <code>exhaustive-deps</code> warnings. (Companies using ESLint instead get the same checks from <code>eslint-plugin-react-hooks</code>; React&#39;s 19.2 post notes its v6 release.)</p>
<p>Treat these warnings as bugs, not style. The linter can be silenced — we checked that a comment <code>// oxlint-disable-next-line react-hooks/exhaustive-deps</code> above the dependency array makes the warning disappear — but the bug stays exactly where it was. React&#39;s documentation is firm on this: when the linter complains, change the code (move the function in, update with a function, use an effect event, or remove the effect) until the list it wants is the list you want.</p>
<div class="pitfall co-tieu-de"><strong>Trap — the "just add it to the array" loop.</strong> A developer sees "missing dependency: 'boLoc'", adds <code>boLoc</code> to the array to make the warning go away, and the app starts looping — because <code>boLoc</code> is an object created on every render. Then they add <code>// oxlint-disable-next-line</code> and remove it again, and the effect now uses a stale filter. The warning was pointing at the real problem: the effect depends on something unstable. Fix the source (depend on <code>chuyenKhoa</code>, or <code>useMemo</code> the object, or stop using an effect for a calculation), not the list.</div>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202&#39;s class components, <code>this.state.giay</code> always reads the current value, so <code>setInterval(() =&gt; this.setState({ giay: this.state.giay + 1 }), 1000)</code> in <code>componentDidMount</code> works, and stale closures never come up; a missing <code>componentDidUpdate</code> check shows up instead as "forgot to update". Students who switch to hooks by copying that code into <code>useEffect(…, [])</code> hit the stale closure immediately. → At work with hooks, the linter (oxlint or <code>eslint-plugin-react-hooks</code>) runs in the editor and in CI, dependency warnings are fixed not suppressed, state that depends on itself is updated with the function form, and <code>useCallback</code>/<code>useMemo</code> are used where identity matters, not everywhere. · <em>Why:</em> function components capture each render&#39;s values — that is what makes them predictable — so the tools exist to keep the captured values correct. You will still read <code>this.setState</code> code in older projects; the mental translation is "class fields are always latest; hook values are per render".</p></div>

<h3>Run it step by step: break it, then let the tools find it</h3>
<ol>
<li>Copy <code>DemGiayCu</code> into the project and render it. Watch it stick at 1 in the browser.</li>
<li>Run <code>npx oxlint src</code>. Find the <code>missing dependency: 'giay'</code> warning.</li>
<li>Fix it with <code>setGiay((g) =&gt; g + 1)</code>, keep <code>[]</code>, and run oxlint again — the warning is gone because the effect no longer reads <code>giay</code>.</li>
<li>Write a component that builds <code>const boLoc = { chuyenKhoa }</code> and uses it in an effect that calls <code>setState</code>. Open the browser console and watch the "Maximum update depth exceeded" errors. Close the tab quickly.</li>
<li>Change the dependency to <code>chuyenKhoa</code>. Then delete the effect entirely and compute the list in render. Run oxlint after each step.</li>
</ol>

<h3>When to reach for each tool</h3>
<ul>
<li><strong>Function update</strong> <code>setX((cu) =&gt; …)</code>: whenever new state is computed from old state inside an effect, timer or async callback.</li>
<li><strong>Primitive dependencies</strong>: always prefer <code>[chuyenKhoa]</code> over <code>[boLoc]</code>.</li>
<li><strong>Function inside the effect</strong>: when only that effect uses it.</li>
<li><strong><code>useMemo</code>/<code>useCallback</code></strong>: when an object or function must be stable because an effect or a memoized child compares it — not by default.</li>
<li><strong><code>useEffectEvent</code></strong>: when the effect must read the latest value of something whose changes should not restart it.</li>
<li><strong>No effect</strong>: when it turns out the value is calculable (Lesson 4.2) — the most common "fix" of all.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: What causes an infinite loop with <code>useEffect</code>?</strong><br>A: The effect sets state and runs again after the resulting render: either there is no dependency array, or a dependency is a new object/array/function every render (compared with <code>Object.is</code>), so it always "changed". Fix by depending on primitives, moving functions into the effect, memoizing with <code>useMemo</code>/<code>useCallback</code>, or removing the effect if the value is derivable.</p>
<p><strong>Q: What is a stale closure in React?</strong><br>A: A function created during one render keeps the props/state of that render; if it runs later (a timer, a listener) it sees outdated values. Fix with the functional updater, by listing the dependency so the effect re-subscribes, or with <code>useEffectEvent</code> for "read latest without re-running".</p>
<p><strong>Q: <code>useCallback</code> vs <code>useMemo</code>?</strong><br>A: <code>useMemo</code> caches a computed value; <code>useCallback</code> caches a function (it is <code>useMemo(() =&gt; fn, deps)</code>). Both only help when something compares identity — an effect dependency or a <code>memo</code> child.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the clinic&#39;s waiting-room screen shows "Đang phục vụ số N" (now serving number N) and should advance every 10 seconds; a teammate&#39;s version sticks at 1.</p><ol>
<li>Write <code>SoThuTu</code> with <code>const [so, setSo] = useState(0)</code> and an effect with <code>[]</code> that runs <code>setInterval(() =&gt; setSo(so + 1), 10_000)</code>, with cleanup.</li>
<li>Write a Vitest test with <code>vi.useFakeTimers()</code> that advances 30 seconds inside <code>act</code> and expects "Đang phục vụ số 3". Watch it fail with 1.</li>
<li>Run <code>npx oxlint</code> on the file and copy the warning.</li>
<li>Fix it with the function form and re-run the test and oxlint.</li>
<li>Bonus: add a prop <code>buoc</code> (step) and make the timer restart when it changes, using the right dependency.</li>
</ol><p><strong>Done when:</strong> the test fails before the fix (it shows 1) and passes after; oxlint reports <code>missing dependency: 'so'</code> before and nothing for this file after; <code>npx tsc -b</code> prints nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">infinite loop (vòng lặp vô hạn)</span><span class="v">effect → setState → render → effect… React logs "Maximum update depth exceeded" and keeps running</span></div>
<div class="kv"><span class="k">reference / identity</span><span class="v">the address of an object; <code>Object.is</code> compares it, so a new <code>{}</code> is always "different"</span></div>
<div class="kv"><span class="k"><code>useMemo</code></span><span class="v">keeps the same computed value (object, array) between renders while its dependencies are unchanged</span></div>
<div class="kv"><span class="k"><code>useCallback</code></span><span class="v">keeps the same function between renders while its dependencies are unchanged</span></div>
<div class="kv"><span class="k">closure</span><span class="v">a function together with the variables it captured when it was created</span></div>
<div class="kv"><span class="k">stale closure (closure cũ)</span><span class="v">a function still using the values of the render in which it was created</span></div>
<div class="kv"><span class="k"><code>useEffectEvent</code></span><span class="v">React 19.2+: a function called from effects that always sees the latest values and is not a dependency</span></div>
<div class="kv"><span class="k"><code>exhaustive-deps</code></span><span class="v">lint rule that checks the dependency list against what the effect reads</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>setState in an effect with no array rendered 46,167 times and logged 887 errors in 3 seconds in Chromium — without crashing the page.</li>
<li>An object built during render as a dependency looped forever while the screen correctly showed "2 bác sĩ"; depend on the primitive, or <code>useMemo</code> the object.</li>
<li>A function declared in the component reconnected the effect 4 times instead of 1; move it into the effect, or <code>useCallback</code> it when it is shared.</li>
<li>An interval with <code>[]</code> reading state stuck at "1 giây" after 5 seconds; <code>setGiay((g) =&gt; g + 1)</code> showed 5.</li>
<li><code>useEffectEvent</code> read the new sound setting without restarting the timer; only the doctor change restarted it.</li>
<li>oxlint flagged all four bugs; fix the code, never silence the warning.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Removing Effect Dependencies</span><span class="lc-sub">react.dev/learn/removing-effect-dependencies — objects and functions as dependencies, updater functions, moving code into the effect.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Separating Events from Effects</span><span class="lc-sub">react.dev/learn/separating-events-from-effects — reactive vs non-reactive logic and effect events.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useEffectEvent reference</span><span class="lc-sub">react.dev/reference/react/useEffectEvent — the API, its rules, and when not to use it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useCallback</span><span class="lc-sub">react.dev/reference/react/useCallback — when caching a function helps, including as an effect dependency.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Vòng lặp vô hạn và closure cũ: object và hàm làm dependency, useCallback, useEffectEvent và linter</h2>
<p class="lead">Hai bug chiếm phần lớn thời gian người ta mất vào effect. Bug thứ nhất chạy quá nhiều: một effect đổi state rồi vì thế mà chạy lại, mãi mãi — quạt máy quay tít, console đầy chữ đỏ, và đôi khi màn hình vẫn trông đúng. Bug thứ hai chạy quá ít, hay đúng hơn là chạy với giá trị cũ: một bộ hẹn giờ cứ đọc con số của lượt render đầu tiên, một callback nhớ bộ lọc của hôm qua. Cả hai đến từ cùng hai sự thật bạn đã gặp ở Bài 4.1 — dependency được so bằng <code>Object.is</code>, và mỗi lượt render có giá trị riêng của nó — và cả hai đều bị linter bắt nếu bạn cho nó bắt.</p>

<p>Bài này tái hiện từng bug, đo nó (có cả một vòng lặp vô hạn đếm theo từng giây trong Chromium thật), rồi sửa theo cách tài liệu React khuyên, theo thứ tự ưu tiên: đổi code để effect cần ít dependency hơn, cập nhật state theo hàm, đưa hàm vào trong effect, và chỉ sau đó mới với tới <code>useCallback</code>, <code>useMemo</code> hay <code>useEffectEvent</code> của React 19.2.</p>

<h3>setState trong effect không có mảng dependency: vòng lặp không bao giờ dừng</h3>
${slide('rx-04', 15, 'setState trong effect không mảng dependency: lặp không dừng')}
<p>Có người muốn một bộ đếm "lượt xem" tăng một mỗi khi trang bác sĩ hiện ra, và viết:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function DemLuotXem() {
  const [luotXem, setLuotXem] = useState(0);
  useEffect(() =&gt; {
    setLuotXem(luotXem + 1); // ✗ effect đổi state ⇒ render lại ⇒ effect chạy lại ⇒ …
  });
  return &lt;p&gt;Lượt xem: {luotXem}&lt;/p&gt;;
}</code></pre>
<p>Không có mảng dependency, effect chạy sau mọi lượt render. Nó gọi <code>setLuotXem</code>, gây ra một lượt render, sau đó effect lại chạy… Trong jsdom, test không bao giờ kết thúc (phải dừng Vitest bằng tay), nên chúng tôi đo trong Chromium: một trang ví dụ có nút bấm để hiện component này, đọc mỗi giây một lần.</p>
<div class="out">$ node do-trang.mjs "/vi-du.html?demo=vong-lap" "Bật component lỗi" 3 "Lượt xem: \\d+"
sau 1 giây: "Lượt xem: 12376" · console.error: 237 lần
sau 2 giây: "Lượt xem: 28402" · console.error: 546 lần
sau 3 giây: "Lượt xem: 46167" · console.error: 887 lần
lỗi đầu tiên: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.</div>
<p>(<code>do-trang.mjs</code> là một script Playwright nhỏ trong bộ công cụ thực hành của khoá: nó bật Vite dev server, mở trang, bấm nút rồi đọc chữ và console mỗi giây.) Trong ba giây React render component hơn 46.000 lần và ghi 887 lỗi. Để ý điều <em>không</em> xảy ra: trang không sập, không trắng. React nhận ra khuôn này, in "Maximum update depth exceeded" (vượt quá độ sâu cập nhật tối đa) rồi cứ thế chạy tiếp, vì effect chạy bất đồng bộ và không chặn trình duyệt. Ảnh chụp trên slide được chụp giữa vòng lặp. Người dùng thấy một con số chạy loạn — hoặc tệ hơn, chẳng thấy gì lạ trong khi laptop nóng dần.</p>
<p>Thông báo lỗi nêu cả hai nguyên nhân: không có mảng dependency, <strong>hoặc một dependency đổi sau mỗi lượt render</strong>. Cách sửa tuỳ bạn định làm gì:</p>
<ul>
<li>"Đếm một lần mỗi lần hiện": dùng <code>[]</code> và dạng hàm, <code>setLuotXem((n) =&gt; n + 1)</code>. (Lúc phát triển Strict Mode sẽ làm nó thành 2 — điều đó trung thực: hiện trang hai lần thì đếm hai lần. Bộ đếm lượt xem thật sẽ gửi lên server qua một lời gọi thống kê.)</li>
<li>"Đếm khi đổi bác sĩ": <code>[bacSiId]</code>.</li>
<li>Thường thì câu trả lời thật là Bài 4.2: giá trị tính được, nên không cần state cũng không cần effect.</li>
</ul>

<h3>Object hay mảng tạo trong render là MỚI mỗi lần, nên effect luôn chạy</h3>
${slide('rx-04', 16, 'Object/mảng tạo trong render là MỚI mỗi lần: effect luôn chạy')}
<p>Nguyên nhân thứ hai khó thấy hơn, vì mảng dependency có đó và trông đúng:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function KetQuaLocObject({ chuyenKhoa }: { chuyenKhoa: BoLocChuyenKhoa }) {
  const [ketQua, setKetQua] = useState&lt;BacSi[]&gt;([]);
  const boLoc = { chuyenKhoa, tuKhoa: '' }; // ✗ object MỚI mỗi lần render
  useEffect(() =&gt; {
    setKetQua(locBacSi(danhSachBacSi, boLoc.chuyenKhoa, boLoc.tuKhoa)); // mảng MỚI ⇒ luôn "khác" ⇒ render lại
  }, [boLoc]);
  return &lt;p&gt;{ketQua.length} bác sĩ&lt;/p&gt;;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: viết tắt thuộc tính và tham chiếu.</strong> <code>{ chuyenKhoa, tuKhoa: '' }</code> là viết tắt của <code>{ chuyenKhoa: chuyenKhoa, tuKhoa: '' }</code>. Mỗi lần dòng này chạy, JavaScript tạo một object hoàn toàn mới trong bộ nhớ, dù nội dung y hệt lần trước. Biến chứa object thực ra chứa một <em>tham chiếu</em> (reference — một địa chỉ); <code>Object.is</code> so địa chỉ. Hai object cùng nội dung ở hai địa chỉ khác nhau là "khác nhau" với React. Mảng cũng vậy (<code>[]</code>, <code>filter</code>, <code>map</code> đều tạo mảng mới), và hàm cũng vậy.</p></div>
<p>Mỗi lượt render tạo một <code>boLoc</code> mới → dependency khác → effect chạy → <code>setKetQua</code> nhận một mảng mới (<code>filter</code> luôn trả mảng mới) → React thấy state khác và render → lại một <code>boLoc</code> mới… Đo trong Chromium, không bấm gì cả:</p>
<div class="out">$ node do-trang.mjs "/vi-du.html?demo=object" - 3 "\\d+ bác sĩ"
sau 1 giây: "2 bác sĩ" · console.error: 321 lần
sau 2 giây: "2 bác sĩ" · console.error: 632 lần
sau 3 giây: "2 bác sĩ" · console.error: 945 lần
lỗi đầu tiên: Maximum update depth exceeded. …</div>
<p>Đây là phiên bản nguy hiểm: <strong>màn hình đúng</strong> — "2 bác sĩ", hai bác sĩ nhi — trong khi vòng lặp chạy mãi. Chỉ có console, và cục pin, nói sự thật. Hai cách sửa, theo thứ tự ưu tiên:</p>
<pre><code class="language-tsx">// ✓ 1. phụ thuộc vào giá trị nguyên thuỷ, không phải object dựng từ nó
useEffect(() =&gt; {
  setKetQua(locBacSi(danhSachBacSi, chuyenKhoa, ''));
}, [chuyenKhoa]); // một chuỗi: so bằng giá trị

// ✓ 2. nếu thật sự cần object, giữ đúng object đó bằng useMemo
const boLoc = useMemo(() =&gt; ({ chuyenKhoa, tuKhoa: '' }), [chuyenKhoa]);
useEffect(() =&gt; {
  setKetQua(locBacSi(danhSachBacSi, boLoc.chuyenKhoa, boLoc.tuKhoa));
}, [boLoc]);</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t "useMemo" --reporter=verbose
nguyên thuỷ + useMemo: 2 bác sĩ | 2 bác sĩ · console.error: 0
 ✓ src/vi-du/b3.test.tsx &gt; dependency là chuỗi / object bọc useMemo: yên</div>
<p><code>useMemo(() =&gt; giáTrị, [deps])</code> trả về đúng object của lượt trước chừng nào dependency của chính nó chưa đổi. Cả hai bản đều yên lại sau một lượt render thêm và không có lỗi. Và cả hai vẫn là ví dụ của lỗi ở Bài 4.2 — danh sách tính được, nên cách sửa tốt nhất là <code>const ketQua = locBacSi(…)</code>, không effect. Linter đồng ý: nó vẫn đánh dấu cả hai bản đã sửa bằng <code>set-state-in-effect</code>.</p>
<p>Object cũng hay tới qua props: <code>&lt;KetQua boLoc={{ chuyenKhoa }} /&gt;</code> tạo object mới ở component cha mỗi lượt render. Nếu effect của con phụ thuộc <code>boLoc</code>, vòng lặp chạy ở con nhưng nguyên nhân nằm ở cha. Hãy tách các giá trị nguyên thuỷ bạn cần (<code>const { chuyenKhoa } = boLoc</code> — cú pháp destructuring) và phụ thuộc vào chúng.</p>

<h3>Hàm khai báo trong component cũng mới sau mỗi lượt render</h3>
${slide('rx-04', 17, 'Hàm khai trong component cũng mới mỗi lần render')}
<p>Hàm cũng là object, nên chuyện tương tự xảy ra với một hàm phụ trợ dùng bên trong effect:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function KetNoiHamTho({ bacSiId, dem }: { bacSiId: string; dem: number }) {
  function taoKenh() {
    return &#96;kenh-&#36;{bacSiId}&#96;;
  }
  useEffect(() =&gt; {
    soLanKetNoi.hamTho++;
    void taoKenh();
  }, [taoKenh]); // ✗ taoKenh là hàm MỚI mỗi lần render
  return &lt;p&gt;{dem}&lt;/p&gt;;
}

export function KetNoiUseCallback({ bacSiId, dem }: { bacSiId: string; dem: number }) {
  const taoKenh = useCallback(() =&gt; &#96;kenh-&#36;{bacSiId}&#96;, [bacSiId]); // ✓ giữ nguyên hàm khi bacSiId không đổi
  useEffect(() =&gt; {
    soLanKetNoi.useCallback++;
    void taoKenh();
  }, [taoKenh]);
  return &lt;p&gt;{dem}&lt;/p&gt;;
}

export function KetNoiTrongEffect({ bacSiId, dem }: { bacSiId: string; dem: number }) {
  useEffect(() =&gt; {
    function taoKenh() {
      return &#96;kenh-&#36;{bacSiId}&#96;; // ✓ hàm nằm TRONG effect ⇒ dependency chỉ còn bacSiId
    }
    soLanKetNoi.trongEffect++;
    void taoKenh();
  }, [bacSiId]);
  return &lt;p&gt;{dem}&lt;/p&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t "hàm làm" --reporter=verbose
effect "kết nối" chạy: hàm thô 4 lần · useCallback 1 lần · hàm trong effect 1 lần
 ✓ src/vi-du/b3.test.tsx &gt; hàm làm dependency: 1 lần hiện + 3 lần vẽ lại, bacSiId không đổi</div>
<p>Một lần hiện cộng ba lần vẽ lại mà chỉ <code>dem</code> đổi: bản hàm thô kết nối lại 4 lần — hãy tưởng tượng một socket chat ngắt rồi nối lại mỗi lần bạn gõ phím ở chỗ khác trên trang. Cả hai cách sửa chỉ kết nối một lần. (Nó không lặp vô hạn chỉ vì effect này không đặt state; thêm một <code>setState</code> là lặp.) <code>void taoKenh()</code> đơn giản là gọi hàm và bỏ kết quả.</p>
<p>Chọn cách sửa nào:</p>
<ul>
<li><strong>Đưa hàm vào trong effect</strong> khi chỉ effect này dùng nó. Đơn giản nhất, và linter khi đó chỉ đòi những giá trị mà hàm đọc.</li>
<li><strong>Đưa ra ngoài component</strong> nếu nó không đọc props hay state nào (một hàm thuần như <code>locBacSi</code>) — khi đó nó không bao giờ là dependency.</li>
<li><strong><code>useCallback(fn, [deps])</code></strong> khi cùng một hàm phải dùng ở nhiều chỗ, hoặc truyền cho con mà con liệt kê nó trong effect <em>của con</em> hoặc tự bọc trong <code>memo</code> (Chương 8). <code>useCallback</code> giữ nguyên object hàm giữa các lượt render chừng nào dependency của nó chưa đổi — đúng bằng <code>useMemo(() =&gt; fn, deps)</code>.</li>
</ul>
<p>Đừng bọc mọi hàm trong <code>useCallback</code> "cho nhanh". Nó có chi phí, làm code khó đọc hơn, và chỉ giúp khi có thứ gì đó thật sự so danh tính (identity) của hàm. Cụm "useCallback đúng lúc" trong đề cương bài này nghĩa đúng như vậy: khi hàm là dependency, hoặc là prop bị đem ra so.</p>

<h3>Closure cũ: interval cứ đọc giá trị của lượt render đầu tiên</h3>
${slide('rx-04', 18, 'Closure cũ: interval đọc giá trị của lượt render đầu tiên')}
<p>Bug ngược lại. Danh sách dependency <em>ngắn</em> quá, và effect cứ thấy một giá trị cũ:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
export function DemGiayCu() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; {
      setGiay(giay + 1); // ✗ "giay" bị đóng băng ở 0 — giá trị của lượt render đầu tiên
    }, 1000);
    return () =&gt; clearInterval(id);
  }, []);
  return &lt;p&gt;Cũ: {giay} giây&lt;/p&gt;;
}

export function DemGiayMoi() {
  const [giay, setGiay] = useState(0);
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; {
      setGiay((g) =&gt; g + 1); // ✓ cập nhật theo hàm: React đưa giá trị MỚI NHẤT vào g
    }, 1000);
    return () =&gt; clearInterval(id);
  }, []);
  return &lt;p&gt;Mới: {giay} giây&lt;/p&gt;;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t "closure" --reporter=verbose
Cũ: 1 giây | Mới: 5 giây
 ✓ src/vi-du/b3.test.tsx &gt; closure cũ: 5 giây sau</div>
<div class="callout"><p><strong>JS nhắc nhanh: closure.</strong> Một hàm "đóng gói" (close over) các biến xung quanh nó lúc nó được tạo: arrow function bên trong <code>setInterval</code> nhớ <code>giay</code> của lượt render đã tạo ra nó. Trong React, mỗi lượt render là một lần gọi mới hàm component của bạn, với <code>const giay</code> của riêng lượt đó. Effect với <code>[]</code> chỉ chạy sau lượt render đầu, nên callback của interval nhớ <code>giay</code> của lượt đầu, tức là 0 — mãi mãi. Mỗi lần tích đều tính <code>0 + 1</code>. Giá trị được nhớ nhưng đã lỗi thời đó chính là <strong>closure cũ (stale closure)</strong>.</p></div>
<p>Sau năm giây, bản cũ hiện 1 giây; bản mới hiện 5. Hai cách sửa đúng:</p>
<ul>
<li><strong>Cập nhật theo hàm</strong> (<code>setGiay((g) =&gt; g + 1)</code>): callback không còn đọc <code>giay</code> nữa, nên <code>[]</code> thật sự đúng. Đây là cách nên dùng mỗi khi state mới tính từ state cũ.</li>
<li><strong>Khai dependency</strong> (<code>[giay]</code>): effect chạy lại mỗi giây, xoá interval cũ và tạo interval mới đọc giá trị mới. Đúng, nhưng dỡ rồi dựng lại bộ hẹn giờ mỗi lần tích. Đây là thứ linter sẽ gợi ý, vì nó chỉ thấy <code>giay</code> được đọc.</li>
</ul>
<p>Closure cũ xuất hiện ở bất cứ đâu một hàm tạo ra trong lượt render này được gọi vào lúc sau: trong <code>setTimeout</code>, trong một event listener gắn trong effect, trong <code>.then</code> sau một yêu cầu mạng. Câu hỏi luôn là "hàm này nhìn thấy giá trị của lượt render nào?"</p>

<h3>useEffectEvent: đọc giá trị mới nhất mà không chạy lại effect</h3>
${slide('rx-04', 19, 'useEffectEvent: đọc giá trị mới mà không chạy lại effect')}
<p>Đôi khi effect cần một giá trị <em>tại thời điểm một việc xảy ra</em>, nhưng việc giá trị đó đổi không nên khởi động lại effect. Ví dụ ở phòng khám: một bộ hẹn giờ nhắc lịch cho từng bác sĩ, có phát âm thanh nếu đang bật âm thanh. Đổi cài đặt âm thanh không nên đặt lại bộ hẹn giờ; đổi bác sĩ thì nên. React 19.2 (10/2025) đưa <code>useEffectEvent</code> thành ổn định cho đúng việc này — chúng tôi đã kiểm nó có trong file kiểu của React 19.3 (<code>export function useEffectEvent&lt;T extends Function&gt;(callback: T): T;</code>) và chạy thử:</p>
<pre><code class="language-tsx">// src/vi-du/b3.tsx
import { useEffect, useEffectEvent } from 'react';

export function NhacGioKham({ bacSiId, amThanh }: { bacSiId: string; amThanh: boolean }) {
  const onDenGio = useEffectEvent(() =&gt; {
    nhatKy.push(&#96;nhắc giờ khám &#36;{bacSiId} · âm thanh &#36;{amThanh ? 'BẬT' : 'TẮT'}&#96;);
  });
  useEffect(() =&gt; {
    nhatKy.push(&#96;hẹn giờ cho &#36;{bacSiId}&#96;);
    const id = setInterval(() =&gt; onDenGio(), 1000);
    return () =&gt; clearInterval(id);
  }, [bacSiId]); // amThanh KHÔNG nằm đây — đổi âm thanh không đặt lại hẹn giờ
  return null;
}</code></pre>
<div class="out">$ npx vitest run src/vi-du/b3 -t useEffectEvent --reporter=verbose
hẹn giờ cho bs-1
nhắc giờ khám bs-1 · âm thanh TẮT
nhắc giờ khám bs-1 · âm thanh BẬT
hẹn giờ cho bs-2
nhắc giờ khám bs-2 · âm thanh BẬT
 ✓ src/vi-du/b3.test.tsx &gt; useEffectEvent: đổi âm thanh không đặt lại hẹn giờ, nhưng lần nhắc sau thấy giá trị mới</div>
<p>Bật âm thanh không ghi thêm dòng "hẹn giờ" nào, vậy mà lần nhắc tiếp theo đã thấy "BẬT" — không có closure cũ. Đổi bác sĩ thì khởi động lại bộ hẹn giờ, đúng như mong muốn. Các luật, theo tài liệu tham khảo của React: chỉ gọi effect event từ bên trong effect; khai báo nó trong cùng component với effect; không bao giờ liệt kê nó trong dependency; và đừng dùng nó chỉ để làm linter im — nếu một giá trị đổi thì effect phải khởi động lại, nó thuộc về danh sách dependency.</p>
<p>Trước React 19.2, người ta giải bài này bằng một <code>useRef</code> giữ giá trị mới nhất, cập nhật sau mỗi lượt render. Bạn sẽ gặp khuôn đó trong code có sẵn; <code>useEffectEvent</code> là cách thay thế được hỗ trợ chính thức (tính đến 09/2026).</p>

<h3>Để linter đếm dependency hộ bạn</h3>
${slide('rx-04', 20, 'Để linter đếm dependency hộ bạn')}
<p>Bạn không phải tự tay tìm những bug này. Template React của Vite (create-vite 9, 09/2026) cài sẵn oxlint với plugin <code>react</code>, và phép kiểm <code>exhaustive-deps</code> chạy dù file <code>.oxlintrc.json</code> của template chỉ liệt kê <code>rules-of-hooks</code> và <code>only-export-components</code>. Chạy trên file ví dụ của bài:</p>
<div class="out">$ npx oxlint src/vi-du/b3.tsx
src/vi-du/b3.tsx:9:3: warning react-hooks(exhaustive-deps): React Hook useEffect contains a call to setState. Without a list of dependencies, this can lead to an infinite chain of updates. help: Consider adding an empty list of dependencies to make it clear which values are intended to be stable.
src/vi-du/b3.tsx:21:7: warning react-hooks(exhaustive-deps): React hook useEffect depends on &#96;boLoc&#96;, which changes every render help: Try memoizing this variable with &#96;useRef&#96; or &#96;useCallback&#96;.
src/vi-du/b3.tsx:41:7: warning react-hooks(exhaustive-deps): React hook useEffect depends on &#96;taoKenh&#96;, which changes every render help: Try memoizing this variable with &#96;useRef&#96; or &#96;useCallback&#96;.
src/vi-du/b3.tsx:68:15: warning react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'giay' help: Either include it or remove the dependency array.
src/vi-du/b3.tsx:10:5: warning react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders …
…</div>
<p>Mọi bug trong bài đều có trong danh sách: thiếu mảng (dòng 9), object (21), hàm (41), <code>giay</code> cũ (68). Bản thân dự án — các hook và component bạn dựng ở Bài 4.4 — chạy lint không có cảnh báo <code>exhaustive-deps</code> nào. (Công ty dùng ESLint thì có cùng các phép kiểm từ <code>eslint-plugin-react-hooks</code>; bài viết React 19.2 có nhắc bản v6 của nó.)</p>
<p>Hãy coi những cảnh báo này là bug, không phải chuyện văn phong. Linter có thể bị làm im — chúng tôi đã kiểm: một dòng chú thích <code>// oxlint-disable-next-line react-hooks/exhaustive-deps</code> đặt trên mảng dependency làm cảnh báo biến mất — nhưng bug vẫn nằm nguyên chỗ cũ. Tài liệu React rất dứt khoát: khi linter phàn nàn, hãy đổi code (đưa hàm vào trong, cập nhật theo hàm, dùng effect event, hoặc bỏ effect) cho tới khi danh sách nó đòi chính là danh sách bạn muốn.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — vòng lặp "thì thêm vào mảng là xong".</strong> Một lập trình viên thấy "missing dependency: 'boLoc'", thêm <code>boLoc</code> vào mảng cho cảnh báo biến mất, và app bắt đầu lặp — vì <code>boLoc</code> là object tạo mới mỗi lượt render. Rồi họ thêm <code>// oxlint-disable-next-line</code> và bỏ nó ra lần nữa, và giờ effect dùng một bộ lọc cũ. Cảnh báo đã chỉ đúng vấn đề thật: effect phụ thuộc vào một thứ không ổn định. Hãy sửa từ gốc (phụ thuộc <code>chuyenKhoa</code>, hoặc <code>useMemo</code> object, hoặc thôi dùng effect cho một phép tính), đừng sửa danh sách.</div>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Trong class component của FER202, <code>this.state.giay</code> luôn đọc giá trị hiện tại, nên <code>setInterval(() =&gt; this.setState({ giay: this.state.giay + 1 }), 1000)</code> trong <code>componentDidMount</code> chạy đúng, và closure cũ không bao giờ xuất hiện; thay vào đó, thiếu phép kiểm trong <code>componentDidUpdate</code> hiện ra dưới dạng "quên cập nhật". Sinh viên chuyển sang hook bằng cách chép nguyên đoạn đó vào <code>useEffect(…, [])</code> sẽ dính closure cũ ngay. → Đi làm với hook, linter (oxlint hoặc <code>eslint-plugin-react-hooks</code>) chạy trong editor và trong CI, cảnh báo dependency được sửa chứ không bị tắt, state phụ thuộc chính nó được cập nhật bằng dạng hàm, và <code>useCallback</code>/<code>useMemo</code> dùng ở chỗ danh tính quan trọng, không dùng khắp nơi. · <em>Vì sao:</em> function component chụp lại giá trị của từng lượt render — chính điều đó làm nó dễ đoán — nên cần công cụ để giữ các giá trị được chụp luôn đúng. Bạn vẫn sẽ đọc code <code>this.setState</code> trong các dự án cũ; cách dịch trong đầu là "trường của class luôn mới nhất; giá trị trong hook thuộc về từng lượt render".</p></div>

<h3>Chạy thử từng bước: làm hỏng, rồi để công cụ tìm ra</h3>
<ol>
<li>Chép <code>DemGiayCu</code> vào dự án và vẽ nó. Nhìn nó kẹt ở 1 trên trình duyệt.</li>
<li>Chạy <code>npx oxlint src</code>. Tìm cảnh báo <code>missing dependency: 'giay'</code>.</li>
<li>Sửa bằng <code>setGiay((g) =&gt; g + 1)</code>, giữ <code>[]</code>, chạy oxlint lần nữa — cảnh báo biến mất vì effect không còn đọc <code>giay</code>.</li>
<li>Viết một component dựng <code>const boLoc = { chuyenKhoa }</code> và dùng nó trong một effect có gọi <code>setState</code>. Mở console trình duyệt và xem các lỗi "Maximum update depth exceeded". Đóng tab thật nhanh.</li>
<li>Đổi dependency thành <code>chuyenKhoa</code>. Rồi xoá hẳn effect và tính danh sách trong render. Chạy oxlint sau mỗi bước.</li>
</ol>

<h3>Khi nào với tới công cụ nào</h3>
<ul>
<li><strong>Cập nhật theo hàm</strong> <code>setX((cu) =&gt; …)</code>: mỗi khi state mới tính từ state cũ bên trong effect, bộ hẹn giờ hay callback bất đồng bộ.</li>
<li><strong>Dependency nguyên thuỷ</strong>: luôn ưu tiên <code>[chuyenKhoa]</code> hơn <code>[boLoc]</code>.</li>
<li><strong>Hàm bên trong effect</strong>: khi chỉ effect đó dùng nó.</li>
<li><strong><code>useMemo</code>/<code>useCallback</code></strong>: khi một object hay hàm phải ổn định vì một effect hay một component con có <code>memo</code> đem nó ra so — không dùng mặc định.</li>
<li><strong><code>useEffectEvent</code></strong>: khi effect phải đọc giá trị mới nhất của một thứ mà việc nó đổi không được khởi động lại effect.</li>
<li><strong>Bỏ effect</strong>: khi hoá ra giá trị tính được (Bài 4.2) — "cách sửa" phổ biến nhất.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Điều gì gây vòng lặp vô hạn với <code>useEffect</code>?</strong><br>Đáp: Effect đặt state rồi chạy lại sau lượt render do chính nó gây ra: hoặc không có mảng dependency, hoặc một dependency là object/mảng/hàm mới mỗi lượt render (so bằng <code>Object.is</code>) nên luôn "đã đổi". Sửa bằng cách phụ thuộc giá trị nguyên thuỷ, đưa hàm vào trong effect, ghi nhớ bằng <code>useMemo</code>/<code>useCallback</code>, hoặc bỏ effect nếu giá trị suy ra được.</p>
<p><strong>Hỏi: Closure cũ trong React là gì?</strong><br>Đáp: Một hàm tạo ra trong một lượt render giữ props/state của lượt đó; nếu nó chạy vào lúc sau (bộ hẹn giờ, listener) nó thấy giá trị lỗi thời. Sửa bằng cập nhật theo hàm, bằng khai dependency để effect đăng ký lại, hoặc bằng <code>useEffectEvent</code> cho nhu cầu "đọc mới nhất mà không chạy lại".</p>
<p><strong>Hỏi: <code>useCallback</code> khác <code>useMemo</code> thế nào?</strong><br>Đáp: <code>useMemo</code> nhớ một giá trị đã tính; <code>useCallback</code> nhớ một hàm (nó chính là <code>useMemo(() =&gt; fn, deps)</code>). Cả hai chỉ có ích khi có thứ so danh tính — một dependency của effect hoặc một component con bọc <code>memo</code>.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> màn hình phòng chờ của phòng khám hiện "Đang phục vụ số N" và phải tăng mỗi 10 giây; bản của một bạn cùng nhóm kẹt ở 1.</p><ol>
<li>Viết <code>SoThuTu</code> với <code>const [so, setSo] = useState(0)</code> và một effect <code>[]</code> chạy <code>setInterval(() =&gt; setSo(so + 1), 10_000)</code>, có cleanup.</li>
<li>Viết một test Vitest dùng <code>vi.useFakeTimers()</code>, cho trôi 30 giây bên trong <code>act</code> và mong đợi "Đang phục vụ số 3". Nhìn nó đỏ với số 1.</li>
<li>Chạy <code>npx oxlint</code> trên file và chép cảnh báo.</li>
<li>Sửa bằng dạng hàm, chạy lại test và oxlint.</li>
<li>Thêm: thêm prop <code>buoc</code> (bước nhảy) và cho bộ hẹn giờ khởi động lại khi nó đổi, với dependency đúng.</li>
</ol><p><strong>Đạt khi:</strong> test đỏ trước khi sửa (hiện 1) và xanh sau khi sửa; oxlint báo <code>missing dependency: 'so'</code> trước và không báo gì cho file này sau; <code>npx tsc -b</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">infinite loop (vòng lặp vô hạn)</span><span class="v">effect → setState → render → effect… React ghi "Maximum update depth exceeded" và cứ chạy tiếp</span></div>
<div class="kv"><span class="k">reference / identity (tham chiếu / danh tính)</span><span class="v">địa chỉ của một object; <code>Object.is</code> so địa chỉ, nên <code>{}</code> mới luôn "khác"</span></div>
<div class="kv"><span class="k"><code>useMemo</code></span><span class="v">giữ nguyên một giá trị đã tính (object, mảng) giữa các lượt render khi dependency chưa đổi</span></div>
<div class="kv"><span class="k"><code>useCallback</code></span><span class="v">giữ nguyên một hàm giữa các lượt render khi dependency chưa đổi</span></div>
<div class="kv"><span class="k">closure</span><span class="v">một hàm cùng các biến nó đã "chụp" lại lúc được tạo</span></div>
<div class="kv"><span class="k">stale closure (closure cũ)</span><span class="v">hàm vẫn dùng giá trị của lượt render đã tạo ra nó</span></div>
<div class="kv"><span class="k"><code>useEffectEvent</code></span><span class="v">React 19.2+: hàm gọi từ effect, luôn thấy giá trị mới nhất và không phải dependency</span></div>
<div class="kv"><span class="k"><code>exhaustive-deps</code></span><span class="v">luật lint so danh sách dependency với những gì effect đọc</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>setState trong effect không mảng render 46.167 lần và ghi 887 lỗi trong 3 giây trên Chromium — mà trang không sập.</li>
<li>Object dựng trong render làm dependency lặp mãi trong khi màn hình vẫn hiện đúng "2 bác sĩ"; hãy phụ thuộc giá trị nguyên thuỷ, hoặc <code>useMemo</code> object.</li>
<li>Hàm khai trong component làm effect kết nối lại 4 lần thay vì 1; đưa nó vào trong effect, hoặc <code>useCallback</code> khi dùng chung.</li>
<li>Interval với <code>[]</code> đọc state kẹt ở "1 giây" sau 5 giây; <code>setGiay((g) =&gt; g + 1)</code> hiện 5.</li>
<li><code>useEffectEvent</code> đọc được cài đặt âm thanh mới mà không khởi động lại bộ hẹn giờ; chỉ việc đổi bác sĩ mới khởi động lại.</li>
<li>oxlint bắt cả bốn bug; hãy sửa code, đừng bao giờ tắt cảnh báo.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Removing Effect Dependencies</span><span class="lc-sub">react.dev/learn/removing-effect-dependencies — object và hàm làm dependency, hàm cập nhật, đưa code vào trong effect.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Separating Events from Effects</span><span class="lc-sub">react.dev/learn/separating-events-from-effects — logic phản ứng và không phản ứng, effect event.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useEffectEvent reference</span><span class="lc-sub">react.dev/reference/react/useEffectEvent — API, các luật của nó, và khi nào không dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useCallback</span><span class="lc-sub">react.dev/reference/react/useCallback — khi nào nhớ một hàm có ích, kể cả khi làm dependency của effect.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Custom hooks: useDebounce, useLocalStorage, useTieuDeTrang and the rules of hooks|||4.4 — Hook tự viết: useDebounce, useLocalStorage, useTieuDeTrang và quy tắc hook',
      slug: 'rx-4-4-custom-hook',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tách logic có effect ra hook tự viết để dùng lại: useTieuDeTrang (trả tiêu đề cũ khi gỡ), useDebounce cho ô tìm, useLocalStorage giữ bản nháp form qua lần tải lại trang (chụp thật), useGioHienTai + dangMoCua cho nhãn mở cửa; hook chia sẻ logic chứ không chia sẻ state (đo thật); quy tắc hook qua oxlint; test hook bằng renderHook + đồng hồ giả; và mục Tự gõ tiếp dự án có lời giải chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Custom hooks: useDebounce, useLocalStorage, useTieuDeTrang and the rules of hooks</h2>
<p class="lead">The three lessons so far wrote effects directly inside components. That works for one component, but the clinic app needs the same kinds of effect again and again: "set the tab title", "wait until the user stops typing", "remember this in localStorage", "tell me the time every 30 seconds". A <strong>custom hook</strong> is simply a function whose name starts with <code>use</code> and which calls other hooks. It packages an effect — setup, cleanup, dependencies, all the details from Lessons 4.1–4.3 — behind a one-line call, so each component says <em>what</em> it wants and the hook knows <em>how</em>.</p>

<p>This lesson builds the four hooks the project needs, wires them into the real components, tests each one with <code>renderHook</code> and a fake clock, and shows two things every React developer should have seen once: two components calling the same hook do <em>not</em> share state, and adding perfectly good hooks can turn old tests red — for good reasons. It ends with the chapter&#39;s "keep building the project" task and its full, tested solution.</p>

<h3>A custom hook is a function named use… that calls other hooks</h3>
${slide('rx-04', 21, 'A custom hook is a function named use… that calls other hooks')}
<p>Lesson 4.1 ended with a bug: the title effect did not restore the previous title. Fixed, and moved into its own file, it becomes the project&#39;s first hook:</p>
<pre><code class="language-ts">// src/hooks/useTieuDeTrang.ts
import { useEffect } from 'react';

/** Đặt document.title khi component đang hiện; gỡ component thì trả lại tiêu đề cũ. */
export function useTieuDeTrang(tieuDe: string) {
  useEffect(() =&gt; {
    const tieuDeCu = document.title;
    document.title = tieuDe;
    return () =&gt; {
      document.title = tieuDeCu;
    };
  }, [tieuDe]);
}</code></pre>
<p>Using it in <code>KhuBacSi</code> is one line, placed after <code>bacSiDangChon</code> is calculated:</p>
<pre><code class="language-tsx">useTieuDeTrang(bacSiDangChon ? &#96;&#36;{bacSiDangChon.ten} · Phòng khám An Tâm&#96; : 'Phòng khám An Tâm');</code></pre>
<p>What makes it a hook, and what it is not:</p>
<ul>
<li><strong>It is an ordinary function.</strong> No registration, no special syntax. React does not even know it exists; when <code>KhuBacSi</code> calls it, the <code>useEffect</code> inside belongs to <code>KhuBacSi</code> exactly as if it had been written there.</li>
<li><strong>Its name starts with <code>use</code> and a capital letter.</strong> That tells readers and the linter "this calls hooks, so the rules of hooks apply" (below).</li>
<li><strong>It shares logic, not state.</strong> Every call gets its own state and its own effects. Two components calling <code>useLocalStorage('chung', 0)</code> — defined in a moment — each have their own copy:</li>
</ul>
<div class="out">$ npx vitest run src/hooks/useLocalStorage --reporter=verbose
stdout | src/hooks/useLocalStorage.test.ts &gt; hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE
A thấy 5 · B thấy 0 · localStorage = 5
 ✓ src/hooks/useLocalStorage.test.ts &gt; hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE</div>
<p>A set the value to 5 and saved it; B, rendered from the same key, still shows 0 because nothing told it to re-read. If several components must see one value, that value must live in one place: lifted into a common parent (Chapter 2), in context, or in a store such as Zustand (Chapter 5). A hook is a recipe, not a shared pot.</p>
<p>The test file shows how hooks are tested without writing a component: <code>renderHook</code> from Testing Library renders a tiny invisible component that calls your hook and gives you its latest return value in <code>result.current</code>:</p>
<pre><code class="language-ts">// src/hooks/useTieuDeTrang.test.ts
import { renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useTieuDeTrang } from './useTieuDeTrang';

test('đặt tiêu đề, đổi theo tham số, gỡ thì trả tiêu đề cũ', () =&gt; {
  document.title = 'Phòng khám An Tâm';
  const { rerender, unmount } = renderHook(({ t }) =&gt; useTieuDeTrang(t), { initialProps: { t: 'BS. Nguyễn Minh An · Phòng khám An Tâm' } });
  expect(document.title).toBe('BS. Nguyễn Minh An · Phòng khám An Tâm');
  rerender({ t: 'BS. Trần Thu Hà · Phòng khám An Tâm' });
  expect(document.title).toBe('BS. Trần Thu Hà · Phòng khám An Tâm');
  unmount();
  expect(document.title).toBe('Phòng khám An Tâm');
});</code></pre>

<h3>useDebounce: the input shows each letter at once, the list waits until you stop typing</h3>
${slide('rx-04', 22, 'useDebounce: the input updates at once, the list waits until typing stops')}
<p>On the clinic page the list re-filters on every keystroke. With six doctors that is instant; with the 200 doctors of Chapter 8, or once Chapter 6 turns each search into a request to the server, "n", "ng", "ngu", "nguy", "nguye", "nguyen" would be six searches when the user wanted one. <strong>Debouncing</strong> means: wait until the value has stopped changing for a moment, then use it.</p>
<pre><code class="language-ts">// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Trả về &#96;giaTri&#96; nhưng CHẬM &#96;treMs&#96; mili-giây: chỉ cập nhật khi người dùng ngừng thay đổi đủ lâu.
 * Mỗi lần giaTri đổi, cleanup huỷ hẹn giờ cũ rồi effect đặt hẹn giờ mới.
 */
export function useDebounce&lt;T&gt;(giaTri: T, treMs = 300): T {
  const [giaTriCham, setGiaTriCham] = useState(giaTri);
  useEffect(() =&gt; {
    const hen = setTimeout(() =&gt; setGiaTriCham(giaTri), treMs);
    return () =&gt; clearTimeout(hen);
  }, [giaTri, treMs]);
  return giaTriCham;
}</code></pre>
<div class="callout"><p><strong>JS quick reminder: generics <code>&lt;T&gt;</code>.</strong> <code>useDebounce&lt;T&gt;(giaTri: T, treMs = 300): T</code> says "whatever type you pass in, you get the same type back": a string for the search box, a number for a slider. <code>treMs = 300</code> is a default parameter — used when the caller leaves it out.</p></div>
<p>It is Lesson 4.1&#39;s pattern in eight lines. Each new value runs the effect again; before that, React runs the cleanup of the previous run, which cancels the timer that was about to publish the <em>previous</em> value. Only when the user pauses for 300 ms does a timer survive long enough to call <code>setGiaTriCham</code>. The test types "nguyen" with 100 ms between keys on a fake clock and records the hook&#39;s output after every key:</p>
<pre><code class="language-ts">// src/hooks/useDebounce.test.ts (first test)
test('gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối', () =&gt; {
  vi.useFakeTimers();
  const daThay: string[] = [];
  const { result, rerender } = renderHook(({ chu }) =&gt; useDebounce(chu, 300), { initialProps: { chu: '' } });
  daThay.push(result.current);
  let dangGo = '';
  for (const phim of 'nguyen') {
    dangGo += phim;
    rerender({ chu: dangGo });
    act(() =&gt; vi.advanceTimersByTime(100));
    daThay.push(result.current);
  }
  console.log('sau từng phím:', JSON.stringify(daThay));
  act(() =&gt; vi.advanceTimersByTime(200));
  console.log('thêm 200 ms  :', JSON.stringify(result.current));
  expect(result.current).toBe('nguyen');
  expect(new Set(daThay)).toEqual(new Set(['']));
});</code></pre>
<div class="out">$ npx vitest run src/hooks/useDebounce --reporter=verbose
stdout | src/hooks/useDebounce.test.ts &gt; gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối
sau từng phím: ["","","","","","",""]
thêm 200 ms  : "nguyen"
 ✓ src/hooks/useDebounce.test.ts &gt; gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối
 ✓ src/hooks/useDebounce.test.ts &gt; đổi treMs cũng đặt lại hẹn giờ</div>
<p>Six keystrokes, six empty strings: the debounced value did not move while typing continued. 300 ms after the last key it became "nguyen" — one change instead of six. In <code>KhuBacSi</code>, the input keeps using <code>tuKhoa</code> (so each letter appears immediately — never debounce what the user sees in the input) while the list uses the slow copy:</p>
<pre><code class="language-tsx">// src/components/KhuBacSi.tsx (the Chapter 4 lines)
const tuKhoaCham = useDebounce(tuKhoa, 300);
const danhSachLoc = locBacSi(danhSachBacSi, chuyenKhoa, tuKhoaCham);</code></pre>
<p>The slide&#39;s screenshot was taken in Chromium after typing "huy" and waiting for "Đang hiện 1/6 bác sĩ". Note what the filter still is: a calculation during render (Lesson 4.2). The effect is only inside the hook, where it synchronises with the one outside system involved — a timer.</p>

<h3>useLocalStorage: a form draft that survives a page reload</h3>
${slide('rx-04', 23, 'useLocalStorage: a form draft that survives a page reload')}
<p>Patients fill in the booking form on their phones and get interrupted. If they reload or come back, what they typed should still be there. <code>localStorage</code> is a small key–value store in the browser that survives reloads; it holds only strings, so we save JSON.</p>
<pre><code class="language-ts">// src/hooks/useLocalStorage.ts
import { useCallback, useEffect, useState } from 'react';

function docKho&lt;T&gt;(khoa: string, macDinh: T): T {
  try {
    const chuoi = localStorage.getItem(khoa);
    return chuoi === null ? macDinh : (JSON.parse(chuoi) as T);
  } catch {
    return macDinh; // JSON hỏng, hoặc trình duyệt chặn localStorage
  }
}

/**
 * Như useState, nhưng giá trị sống sót qua lần tải lại trang: đọc localStorage MỘT lần lúc khởi tạo,
 * và ghi lại mỗi khi giá trị (hoặc khoá) đổi. Trả về [giá trị, hàm đặt, hàm xoá bản lưu].
 */
export function useLocalStorage&lt;T&gt;(khoa: string, macDinh: T) {
  const [giaTri, setGiaTri] = useState&lt;T&gt;(() =&gt; docKho(khoa, macDinh));

  useEffect(() =&gt; {
    try {
      localStorage.setItem(khoa, JSON.stringify(giaTri));
    } catch {
      // đầy bộ nhớ hoặc bị chặn: bỏ qua, app vẫn chạy như useState thường
    }
  }, [khoa, giaTri]);

  const xoa = useCallback(() =&gt; {
    localStorage.removeItem(khoa);
  }, [khoa]);

  return [giaTri, setGiaTri, xoa] as const;
}</code></pre>
<p>Line by line, with the chapter&#39;s ideas:</p>
<ul>
<li><strong>Read once, lazily.</strong> <code>useState(() =&gt; docKho(khoa, macDinh))</code> passes a <em>function</em>; React calls it only on the first render (Chapter 2&#39;s lazy initial state). Reading storage in the component body instead would run on every render.</li>
<li><strong>Write in an effect.</strong> Saving is synchronising React state with an outside system, so it is an effect, with <code>[khoa, giaTri]</code> as dependencies — exactly what it reads.</li>
<li><strong><code>try/catch</code> both ways.</strong> Storage may be blocked (some private-browsing modes), full, or hold broken JSON typed by someone in DevTools; the app must still work as if it were plain <code>useState</code>. The test "JSON hỏng ⇒ không sập" checks this.</li>
<li><strong><code>useCallback</code> for <code>xoa</code></strong> — this is Lesson 4.3&#39;s "at the right moment": a caller may list any function this hook returns in an effect&#39;s dependencies (the form does exactly that with <code>setBanNhap</code>), so every returned function must stay the same between renders. <code>setGiaTri</code> from <code>useState</code> is already stable; <code>xoa</code> is made stable with <code>useCallback</code>, changing only when <code>khoa</code> does.</li>
<li><strong><code>as const</code></strong> makes TypeScript treat the returned array as a fixed tuple <code>[T, setter, () =&gt; void]</code>, so destructuring gets the right type for each position.</li>
</ul>
<p>In <code>FormDatLich</code> the draft is keyed per doctor — <code>&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;</code> — and read once when the form is created. The form already has <code>key={bacSi.id}</code> (Chapter 3), so switching doctors creates a new form that reads that doctor&#39;s own draft. React Hook Form keeps field values in its own store outside React; to follow them we <em>subscribe</em> in an effect and unsubscribe in the cleanup — a textbook effect:</p>
<pre><code class="language-tsx">// src/components/FormDatLich.tsx (the Chapter 4 part)
const [banNhap, setBanNhap, xoaBanNhap] = useLocalStorage&lt;DatLichForm&gt;(&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;, RONG);
const { register, handleSubmit, setError, control, subscribe, formState: { … } } = useForm({
  resolver: zodResolver(datLichSchema),
  defaultValues: banNhap, // the draft becomes the starting values
  mode: 'onTouched',
});

useEffect(() =&gt; {
  const huy = subscribe({
    formState: { values: true },
    callback: ({ values }) =&gt; setBanNhap(values),
  });
  return huy; // subscribe() returns the unsubscribe function — exactly what a cleanup is
}, [subscribe, setBanNhap]);

const [daKhoiPhuc] = useState(() =&gt; banNhap.benhNhan.hoTen !== '' || banNhap.lyDo !== '');
// … after a successful submit: xoaBanNhap();</code></pre>
<p>(<code>subscribe</code> exists in React Hook Form 7.88 — its type in <code>node_modules/react-hook-form/dist/types/form.d.ts</code> returns <code>() =&gt; void</code>. <code>daKhoiPhuc</code> uses a lazy initial state so the message "Đã khôi phục bản nháp" means "there was a draft when the form opened", not "you are typing".) We checked it end to end in real Chromium on the production build — type half a form, reload, open the doctor again:</p>
<div class="out">$ node chup-nhap.mjs    # Playwright: vite build + vite preview, TZ=Asia/Ho_Chi_Minh
1. mở trang       → document.title = "Phòng khám An Tâm"
2. xem BS. Thu Hà → document.title = "BS. Trần Thu Hà · Phòng khám An Tâm"
3. gõ dở → localStorage = {"benhNhan":{"hoTen":"Nguyễn Thị Mai","soDienThoai":"","ngaySinh":""},"lyDo":"Bé sốt 38,5 độ từ tối qua, ho nhiều về đêm"}
4. tải lại trang  → document.title = "Phòng khám An Tâm"
5. mở lại → ô Họ và tên = "Nguyễn Thị Mai"</div>
<p>The same run also proves <code>useTieuDeTrang</code> in a real tab: the title names the doctor while open and returns to "Phòng khám An Tâm" after the reload. The slide shows the restored form.</p>
<div class="callout warn"><p><strong>Privacy note.</strong> A booking draft contains a name, a phone number, a date of birth and a medical reason. <code>localStorage</code> is readable by any script on the page and stays on a shared computer until cleared. That is why the draft is deleted after a successful submit, and why a real clinic might keep only the "reason" field, or use <code>sessionStorage</code> (cleared when the tab closes). Decide with the product owner; do not store health data "because it was easy".</p></div>

<h3>A live "open now?" badge: pure logic plus a timer hook</h3>
${slide('rx-04', 24, 'A live "open now?" badge: pure logic plus a timer hook')}
<p>The footer says the clinic opens Monday to Saturday, 7:30–17:00. The header should say whether it is open <em>now</em>, and change by itself at 7:30. Split it in two: a pure function that answers the question for any time, and a hook that provides the current time.</p>
<pre><code class="language-ts">// src/logic/gio-mo-cua.ts
/** Giờ mở cửa: Thứ 2 – Thứ 7, 7:30 – 17:00; Chủ nhật nghỉ. Tính theo giờ của máy người dùng. */
export const MO_CUA_PHUT = 7 * 60 + 30;
export const DONG_CUA_PHUT = 17 * 60;

/** Hàm THUẦN: nhận một thời điểm, trả về true nếu phòng khám đang mở. Dễ test, không cần giả đồng hồ. */
export function dangMoCua(luc: Date): boolean {
  if (luc.getDay() === 0) return false; // getDay(): 0 = Chủ nhật, 1 = Thứ 2, …, 6 = Thứ 7
  const phut = luc.getHours() * 60 + luc.getMinutes();
  return phut &gt;= MO_CUA_PHUT &amp;&amp; phut &lt; DONG_CUA_PHUT;
}</code></pre>
<pre><code class="language-ts">// src/hooks/useGioHienTai.ts
import { useEffect, useState } from 'react';

/** Giờ hiện tại, tự cập nhật mỗi &#96;moiMs&#96; mili-giây. Có cleanup: gỡ component là dừng hẹn giờ. */
export function useGioHienTai(moiMs = 30_000): Date {
  const [bayGio, setBayGio] = useState(() =&gt; new Date());
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; setBayGio(new Date()), moiMs);
    return () =&gt; clearInterval(id);
  }, [moiMs]);
  return bayGio;
}</code></pre>
<pre><code class="language-tsx">// src/components/TrangThaiMoCua.tsx
import { useGioHienTai } from '../hooks/useGioHienTai';
import { dangMoCua } from '../logic/gio-mo-cua';

export function TrangThaiMoCua() {
  const bayGio = useGioHienTai();
  const mo = dangMoCua(bayGio);
  const gio = bayGio.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return (
    &lt;p className={mo ? 'trang-thai-mo mo' : 'trang-thai-mo dong'} role="status"&gt;
      &lt;span aria-hidden="true"&gt;●&lt;/span&gt; {mo ? 'Đang mở cửa' : 'Đang đóng cửa'} · {gio}
    &lt;/p&gt;
  );
}</code></pre>
<p>Why the split matters: <code>dangMoCua</code> has no effect and no clock, so its test just passes dates — including the edge cases 7:29, 7:30, 16:59, 17:00 and Sunday. The hook is a four-line effect with a cleanup. The component combines them in two lines. Testing the component needs a fake <em>system</em> clock too: <code>vi.setSystemTime</code> makes <code>new Date()</code> return 07:29 on a Monday, and advancing 60 seconds lets the 30-second interval fire twice:</p>
<pre><code class="language-tsx">// src/components/TrangThaiMoCua.test.tsx
import { act, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { TrangThaiMoCua } from './TrangThaiMoCua';

afterEach(() =&gt; {
  vi.useRealTimers();
});

test('07:29 Thứ 2 đang đóng; 60 giây sau tự chuyển sang mở, không cần tải lại', () =&gt; {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 28, 7, 29)); // giả đồng hồ hệ thống: 07:29 Thứ 2
  render(&lt;TrangThaiMoCua /&gt;);
  expect(screen.getByRole('status')).toHaveTextContent('Đang đóng cửa · 07:29');
  act(() =&gt; vi.advanceTimersByTime(60_000));
  expect(screen.getByRole('status')).toHaveTextContent('Đang mở cửa · 07:30');
});

test('gỡ component ⇒ không còn hẹn giờ nào chạy', () =&gt; {
  vi.useFakeTimers();
  const { unmount } = render(&lt;TrangThaiMoCua /&gt;);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});</code></pre>
<div class="out">$ npx vitest run src/logic/gio-mo-cua src/components/TrangThaiMoCua --reporter=verbose
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 07:29 ⇒ mở cửa: false
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 07:30 ⇒ mở cửa: true
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 16:59 ⇒ mở cửa: true
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 17:00 ⇒ mở cửa: false
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 7, 10:00 ⇒ mở cửa: true
 ✓ src/logic/gio-mo-cua.test.ts &gt; Chủ nhật, 10:00 ⇒ mở cửa: false
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; 07:29 Thứ 2 đang đóng; 60 giây sau tự chuyển sang mở, không cần tải lại
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; gỡ component ⇒ không còn hẹn giờ nào chạy</div>
<p>The last test is Lesson 4.1&#39;s cleanup made measurable: <code>vi.getTimerCount()</code> is 1 while the badge is on screen and 0 after unmount. The screenshot on the slide was taken with the machine&#39;s time zone set to Vietnam (the build machine runs on UTC; <code>getHours()</code> uses the browser&#39;s local time — a real clinic app shown abroad would need an explicit time zone, a topic for Chapter 14).</p>

<h3>The rules of hooks: call them at the top level of a component or another hook</h3>
${slide('rx-04', 25, 'The rules of hooks: top level, inside components or other hooks')}
<p>Two rules, enforced by the linter:</p>
<ol>
<li><strong>Only call hooks at the top level</strong> of a component or custom hook — not inside <code>if</code>, loops, after an early <code>return</code>, inside event handlers or inside the function you pass to <code>useEffect</code>/<code>useMemo</code>.</li>
<li><strong>Only call hooks from React functions</strong> — components and custom hooks — not from ordinary helpers like <code>dangMoCua</code>.</li>
</ol>
<p>Why: React does not know hook names. It identifies "the first <code>useState</code> of this component", "the second", "the first <code>useEffect</code>" by the <strong>order of calls</strong>. If a hook is called only when some condition is true, the order shifts between renders and the state of one hook ends up in another. oxlint reports it as an error:</p>
<div class="out">$ npx oxlint src/vi-du/b3-lint.tsx
src/vi-du/b3-lint.tsx:5:25: warning react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'ten' help: Either include it or remove the dependency array.
src/vi-du/b3-lint.tsx:12:33: error react-hooks(rules-of-hooks): React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.</div>
<p>The offending code was <code>if (coChiTiet) { const [moRong, setMoRong] = useState(false); … }</code>. The fix is in the help text: call <code>useState</code> unconditionally at the top, and branch on its value. The same applies inside your own hooks: <code>useDebounce</code> always calls <code>useState</code> then <code>useEffect</code>, in that order, every render.</p>
<p>Naming follows from rule 2. A function that calls hooks must start with <code>use</code> — otherwise the linter cannot check it. A function that calls no hooks must <em>not</em> start with <code>use</code> — <code>dangMoCua</code>, not <code>useDangMoCua</code> — because then it can be called anywhere, including in conditions and in plain tests.</p>

<h3>New hooks turned two old tests red — and that was good news</h3>
${slide('rx-04', 26, 'New hooks turned two old tests red — and that was good news')}
<p>After wiring the hooks in, the Chapter 2–3 test suite failed:</p>
<div class="out">$ npx vitest run
 FAIL  src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
TestingLibraryElementError: Unable to find an element with the text: Đang hiện 1/6 bác sĩ. …
 FAIL  src/components/KhuBacSi.test.tsx &gt; không khớp ⇒ thông báo rỗng
TestingLibraryElementError: Unable to find an element with the text: Không tìm thấy bác sĩ phù hợp.. …
 FAIL  src/components/FormDatLich.test.tsx &gt; đếm ký tự lý do theo NFC; vượt 500 ⇒ lỗi
TestingLibraryElementError: Unable to find an element with the text: 501/500. …
      Tests  3 failed | 36 passed (39)   ← (this run still included the chapter&#39;s demo tests in src/vi-du)</div>
<p>Two different causes, both real:</p>
<ul>
<li><strong>The search tests were right to fail.</strong> They expected the filtered list immediately after typing (<code>getByText</code>), and debouncing deliberately delays it by 300 ms. The behaviour changed on purpose, so the tests change: <code>expect(await screen.findByText('Đang hiện 1/6 bác sĩ'))</code> — <code>findBy…</code> retries for up to one second. A new test also pins the intended behaviour: right after typing, the input shows "huy" while the count still says 6/6; then the count becomes 1/6.</li>
<li><strong>The form test exposed a test-isolation bug.</strong> The DOM of the failing test showed "Đã khôi phục bản nháp" and a counter of <strong>518/500</strong>: an earlier test in the same file had typed into the form for the same doctor, the draft was saved, and jsdom&#39;s <code>localStorage</code> lives for the whole test file. Chapter 1 added <code>cleanup()</code> for the DOM; now storage needs the same.</li>
</ul>
<pre><code class="language-ts">// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
  // Chương 4: localStorage của jsdom sống suốt một file test ⇒ bản nháp của test trước
  // sẽ "khôi phục" vào test sau. Dọn sau mỗi test.
  localStorage.clear();
});</code></pre>
<div class="pitfall co-tieu-de"><strong>Trap — the test that passes alone and fails in the suite.</strong> The draft bug only appears when the "server error" test runs before the character-count test; run the second one alone (<code>-t "đếm ký tự"</code>) and it is green. Anything global — <code>localStorage</code>, <code>document.title</code>, fake timers, a mocked <code>console.error</code> — leaks between tests unless you reset it. That is why this chapter&#39;s tests call <code>vi.useRealTimers()</code> and <code>vi.restoreAllMocks()</code> in <code>afterEach</code>, set <code>document.title</code> at the start of title tests, and why <code>setup.ts</code> now clears storage.</div>
<div class="out">$ npx vitest run
 Test Files  11 passed (11)
      Tests  46 passed (46)</div>
<p>(Counted without the chapter&#39;s <code>src/vi-du/</code> demo files.)</p>

<div class="callout"><p><strong>🎓 At FER202 you do it this way — 💼 at work they do it that way.</strong></p>
<p>In FER202 and older React code, logic shared between class components is copied from one <code>componentDidMount</code>/<code>componentWillUnmount</code> pair to the next, or wrapped in a higher-order component (<code>withTimer(Component)</code>) or a "render prop"; <code>localStorage</code> reads are often scattered through components. → At work, shared stateful logic is a custom hook in <code>src/hooks/</code> (or <code>src/features/…/hooks</code>, Chapter 7), typed with generics, tested with <code>renderHook</code> and fake timers, and well-known ones are often taken from a small library rather than rewritten. · <em>Why:</em> hooks compose — a component can call five of them, each hiding its own effect and cleanup, without the wrapper nesting that HOCs and render props caused — and they are testable on their own. You will still meet HOCs in older libraries (and <code>memo()</code> is technically one); read them, but write hooks.</p></div>

<h3>Run it step by step: your own useMediaQuery</h3>
<ol>
<li>Create <code>src/hooks/useKhopMediaQuery.ts</code> exporting <code>useKhopMediaQuery(query: string): boolean</code>.</li>
<li>Inside, keep <code>khop</code> in state, lazily initialised from <code>window.matchMedia(query).matches</code>.</li>
<li>In an effect with <code>[query]</code>, get <code>const mql = window.matchMedia(query)</code>, define <code>const xuLy = () =&gt; setKhop(mql.matches)</code>, call <code>mql.addEventListener('change', xuLy)</code>, and return a cleanup that removes the same listener.</li>
<li>Use it in <code>App</code>: <code>const hep = useKhopMediaQuery('(max-width: 700px)')</code>, and show the doctor list in one column when <code>hep</code>. Resize the browser.</li>
<li>Run <code>npx oxlint src</code> and make sure there is no <code>exhaustive-deps</code> or <code>rules-of-hooks</code> warning for the new file.</li>
</ol>
<p>(jsdom does not implement <code>matchMedia</code>; to test this hook you would provide a small fake. That is a good Chapter 9 exercise.)</p>

<h3>When to write a custom hook — and when not</h3>
<ul>
<li><strong>Write one</strong> when two components need the same effect, or when a component&#39;s effect code hides what the component is about. The name should say the purpose: <code>useDebounce</code>, not <code>useMyEffect</code>.</li>
<li><strong>Write one</strong> to give an effect a test of its own (<code>renderHook</code>).</li>
<li><strong>Do not write one</strong> for code that calls no hooks — make it a plain function (<code>dangMoCua</code>, <code>locBacSi</code>).</li>
<li><strong>Do not write one</strong> expecting shared state; for that you need lifted state, context or a store (Chapter 5).</li>
<li><strong>Do not write</strong> "lifecycle" hooks like <code>useMount(fn)</code>; they hide the dependency list from the linter and bring back the bugs of Lesson 4.3.</li>
</ul>

<div class="callout"><p><strong>Common interview question.</strong></p>
<p><strong>Q: What is a custom hook? Do two components using the same hook share state?</strong><br>A: A JavaScript function whose name starts with <code>use</code> and that calls other hooks, used to reuse stateful logic (effects, subscriptions, timers). Each call has its own independent state; hooks share logic, not state. To share state, lift it up, use context, or an external store.</p>
<p><strong>Q: What are the rules of hooks and why do they exist?</strong><br>A: Call hooks only at the top level (not in conditions, loops or nested functions) and only from components or custom hooks. React tracks hooks by call order; conditional calls change the order between renders and mix up state. The <code>rules-of-hooks</code> lint rule enforces this.</p>
<p><strong>Q: Implement a <code>useDebounce</code>.</strong><br>A: State for the debounced value; an effect on <code>[value, delay]</code> that sets a timeout to update it and returns <code>clearTimeout</code> as cleanup, so each change cancels the previous timer. Test with fake timers.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the doctor detail panel should say "Bạn đã xem hồ sơ này N giây" (you have viewed this profile for N seconds), resetting for each doctor.</p><ol>
<li>Write <code>useDemGiay(): number</code> — state starting at 0, an interval of 1000 ms that updates it with the function form, and a cleanup.</li>
<li>Use it in <code>ChiTietBacSi</code>. Because <code>ChiTietBacSi</code> is not keyed by doctor, check what happens when you switch doctors; then give it <code>key={bacSiDangChon.id}</code> in <code>KhuBacSi</code> and check again.</li>
<li>Test the hook with <code>renderHook</code>, <code>vi.useFakeTimers()</code> and <code>act(() =&gt; vi.advanceTimersByTime(5000))</code>; expect 5. Then <code>unmount()</code> and expect <code>vi.getTimerCount()</code> to be 0.</li>
<li>Run <code>npx oxlint src</code>.</li>
</ol><p><strong>Done when:</strong> the hook test shows 5 after 5 seconds and 0 timers after unmount; switching doctors restarts the counter from 0 only with the <code>key</code>; <code>npx tsc -b</code> prints nothing; oxlint reports no <code>exhaustive-deps</code>/<code>rules-of-hooks</code> problem in your files.</p></div>

<h3>🛠 Keep building the project</h3>
<p><strong>Starting point:</strong> the project after Chapter 3 — <code>KhuBacSi</code> with specialty chips (<code>ChipChuyenKhoa</code>), name search (<code>OTimBacSi</code>, filtering with <code>locBacSi</code> in <code>src/logic/loc-bac-si.ts</code>), <code>ChiTietBacSi</code> and favourites; and <code>FormDatLich</code> (React Hook Form + Zod schema in <code>src/schema/dat-lich.ts</code>) rendered as <code>&lt;FormDatLich key={bacSiDangChon.id} … /&gt;</code> and sending through <code>src/logic/gui-dat-lich.ts</code>. <code>src/test/setup.ts</code> already calls <code>cleanup()</code> after each test.</p>
<p><strong>Task — by the end of Chapter 4 the app has four hooks:</strong></p>
<ol>
<li><code>src/hooks/useDebounce.ts</code>: <code>useDebounce&lt;T&gt;(giaTri: T, treMs = 300): T</code>. In <code>KhuBacSi</code>, keep the input on <code>tuKhoa</code> but filter with <code>useDebounce(tuKhoa, 300)</code>.</li>
<li><code>src/hooks/useTieuDeTrang.ts</code>: sets <code>document.title</code> and restores the previous title in the cleanup. In <code>KhuBacSi</code>: "&lt;doctor name&gt; · Phòng khám An Tâm" while a doctor is open, "Phòng khám An Tâm" otherwise.</li>
<li><code>src/logic/gio-mo-cua.ts</code> with a pure <code>dangMoCua(luc: Date): boolean</code> (Monday–Saturday, 7:30 ≤ time &lt; 17:00); <code>src/hooks/useGioHienTai.ts</code> returning the current <code>Date</code>, refreshed every 30 seconds, with cleanup; <code>src/components/TrangThaiMoCua.tsx</code> showing "● Đang mở cửa · HH:MM" or "● Đang đóng cửa · HH:MM" with <code>role="status"</code>, placed at the right of <code>Header</code>.</li>
<li><code>src/hooks/useLocalStorage.ts</code>: <code>useLocalStorage&lt;T&gt;(khoa, macDinh)</code> returning <code>[giaTri, setGiaTri, xoa]</code>, reading once lazily, writing in an effect, surviving blocked storage and broken JSON. In <code>FormDatLich</code>: a draft per doctor under <code>ban-nhap-dat-lich:&lt;id&gt;</code>, used as <code>defaultValues</code>, updated through <code>subscribe</code> in an effect with cleanup, deleted after a successful submit, and the note "Đã khôi phục bản nháp — tự lưu trên máy này." shown only when the form opened with a draft.</li>
<li>Tests: one file per hook, one for <code>dangMoCua</code>, one for <code>TrangThaiMoCua</code> (fake system time), two draft tests in <code>FormDatLich.test.tsx</code>, two in <code>KhuBacSi.test.tsx</code> (title; debounced list). Make the old search tests wait with <code>findBy…</code> and add <code>localStorage.clear()</code> to <code>setup.ts</code>.</li>
</ol>
<p><strong>Done when (all three):</strong></p>
<ul>
<li><code>npx tsc -b</code> prints nothing, <code>npx vitest run</code> is green (the solution below: <code>Test Files 11 passed (11)</code>, <code>Tests 46 passed (46)</code>), and <code>npx oxlint src</code> shows no <code>exhaustive-deps</code>, <code>rules-of-hooks</code> or <code>set-state-in-effect</code> warning in your files;</li>
<li>in the browser, typing "huy" shows the letters at once and the list shrinks to BS. Hoàng Đức Huy a moment later (slide 22); the tab title names the open doctor; the header badge shows open/closed with the time (slide 24);</li>
<li>typing half a booking form, reloading the page and opening the same doctor again shows the draft and the "Đã khôi phục bản nháp" note (slide 23); a different doctor&#39;s form is empty.</li>
</ul>
<details><summary>Solution</summary>
<p>This is the exact code of the course&#39;s practice project after Chapter 4, checked on 25 September 2026: <code>npx tsc -b</code> printed nothing; <code>npx vitest run</code> gave <code>Test Files 11 passed (11)</code> / <code>Tests 46 passed (46)</code>; <code>npx vite build</code> produced <code>dist/assets/index-….js 343.63 kB │ gzip: 107.46 kB</code>; oxlint showed no hook warnings in <code>src</code> (only four unused-parameter warnings in the Chapter 3 form test). Files not listed are unchanged from Chapter 3.</p>
<p>The four hooks, <code>gio-mo-cua.ts</code> and <code>TrangThaiMoCua.tsx</code> are exactly the versions printed earlier in this lesson (<code>useTieuDeTrang.ts</code>, <code>useDebounce.ts</code>, <code>useLocalStorage.ts</code>, <code>gio-mo-cua.ts</code>, <code>useGioHienTai.ts</code>, <code>TrangThaiMoCua.tsx</code>, plus the tests <code>useTieuDeTrang.test.ts</code> and <code>TrangThaiMoCua.test.tsx</code>). The remaining files:</p>
<p><code>src/components/Header.tsx</code></p>
<pre><code class="language-tsx">import { TrangThaiMoCua } from './TrangThaiMoCua';

export function Header() {
  return (
    &lt;header className="header"&gt;
      &lt;span className="logo" aria-hidden="true"&gt;✚&lt;/span&gt;
      &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
      &lt;TrangThaiMoCua /&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p><code>src/components/KhuBacSi.tsx</code> — the top of the file, down to the new hook calls (the Chapter 4 changes are the two hook imports and the lines under "Dẫn xuất"); the rest is unchanged from Chapter 3:</p>
<pre><code class="language-tsx">import { useState } from 'react';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { useDebounce } from '../hooks/useDebounce';
import { useTieuDeTrang } from '../hooks/useTieuDeTrang';
import { locBacSi, type BoLocChuyenKhoa } from '../logic/loc-bac-si';
import { guiYeuCauDatLich } from '../logic/gui-dat-lich';
import { doiYeuThich } from '../logic/yeu-thich';
import { ChiTietBacSi } from './ChiTietBacSi';
import { ChipChuyenKhoa } from './ChipChuyenKhoa';
import { FormDatLich } from './FormDatLich';
import { DanhSachBacSi } from './DanhSachBacSi';
import { OTimBacSi } from './OTimBacSi';

export function KhuBacSi() {
  // ● Bốn mẩu state — mỗi mẩu là thứ NGƯỜI DÙNG đổi được, không suy ra được từ thứ khác.
  const [chuyenKhoa, setChuyenKhoa] = useState&lt;BoLocChuyenKhoa&gt;('tat-ca');
  const [tuKhoa, setTuKhoa] = useState('');
  const [bacSiDangChonId, setBacSiDangChonId] = useState&lt;string | null&gt;(null);
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);

  // Dẫn xuất (tính trong lúc render) — KHÔNG cất vào state.
  // Ô tìm hiện ngay chữ vừa gõ (tuKhoa); danh sách chỉ lọc lại khi ngừng gõ 300 ms (tuKhoaCham).
  const tuKhoaCham = useDebounce(tuKhoa, 300);
  const danhSachLoc = locBacSi(danhSachBacSi, chuyenKhoa, tuKhoaCham);
  const bacSiDangChon = danhSachBacSi.find((bs) =&gt; bs.id === bacSiDangChonId) ?? null;
  useTieuDeTrang(bacSiDangChon ? &#96;&#36;{bacSiDangChon.ten} · Phòng khám An Tâm&#96; : 'Phòng khám An Tâm');
  const dsYeuThich = danhSachBacSi.filter((bs) =&gt; yeuThich.includes(bs.id));
  // … phần còn lại (hàm xuLyDoiYeuThich và JSX) giữ nguyên như Chương 3</code></pre>
<p><code>src/components/FormDatLich.tsx</code> (whole file)</p>
<pre><code class="language-tsx">import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch, type Control } from 'react-hook-form';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { datLichSchema, LY_DO_TOI_DA, type DatLich, type DatLichForm } from '../schema/dat-lich';
import type { BacSi } from '../types';

interface FormDatLichProps {
  bacSi: BacSi;
  /** Trả về Promise: form chờ nó xong mới mở khoá nút Gửi. Lỗi ném ra ⇒ hiện ở đầu form. */
  onGui: (duLieu: DatLich) =&gt; Promise&lt;void&gt;;
}

/** Bộ đếm ký tự tách riêng: useWatch chỉ làm component NÀY render lại mỗi phím (đo ở Bài 3.2). */
function DemKyTuLyDo({ control }: { control: Control&lt;DatLichForm, unknown, DatLich&gt; }) {
  const soKyTu = (useWatch({ control, name: 'lyDo' }) ?? '').normalize('NFC').length;
  return (
    &lt;p id="lyDo-dem" className={soKyTu &gt; LY_DO_TOI_DA ? 'dem-ky-tu vuot' : 'dem-ky-tu'}&gt;
      {soKyTu}/{LY_DO_TOI_DA}
    &lt;/p&gt;
  );
}

const RONG: DatLichForm = { benhNhan: { hoTen: '', soDienThoai: '', ngaySinh: '' }, lyDo: '' };

export function FormDatLich({ bacSi, onGui }: FormDatLichProps) {
  // Bản nháp riêng cho từng bác sĩ; đọc MỘT lần khi form được tạo (form có key={bacSi.id}).
  const [banNhap, setBanNhap, xoaBanNhap] = useLocalStorage&lt;DatLichForm&gt;(&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;, RONG);
  const {
    register,
    handleSubmit,
    setError,
    control,
    subscribe,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(datLichSchema),
    defaultValues: banNhap,
    mode: 'onTouched', // lỗi hiện khi rời ô lần đầu, rồi cập nhật theo từng phím
  });

  // Đồng bộ với một hệ thống NGOÀI React (kho giá trị của React Hook Form): đăng ký nghe, và huỷ khi gỡ.
  useEffect(() =&gt; {
    const huy = subscribe({
      formState: { values: true },
      callback: ({ values }) =&gt; setBanNhap(values),
    });
    return huy;
  }, [subscribe, setBanNhap]);

  // Chỉ cần biết "lúc MỞ form có bản nháp không" ⇒ khởi tạo lười một lần, không cập nhật theo từng phím.
  const [daKhoiPhuc] = useState(() =&gt; banNhap.benhNhan.hoTen !== '' || banNhap.lyDo !== '');

  async function guiDi(duLieu: DatLich) {
    try {
      await onGui(duLieu);
      xoaBanNhap(); // gửi xong thì bản nháp hết tác dụng
    } catch (loi) {
      setError('root.server', { message: loi instanceof Error ? loi.message : 'Gửi không thành công, thử lại sau' });
    }
  }

  const e = errors.benhNhan;

  if (isSubmitSuccessful &amp;&amp; !errors.root) {
    return (
      &lt;p className="gui-xong" role="status"&gt;
        Đã gửi yêu cầu đặt lịch với {bacSi.ten}. Phòng khám sẽ gọi lại để xác nhận.
      &lt;/p&gt;
    );
  }

  return (
    &lt;form className="form-dat-lich" onSubmit={handleSubmit(guiDi)} noValidate aria-label={&#96;Đặt lịch với &#36;{bacSi.ten}&#96;}&gt;
      &lt;h3&gt;Đặt lịch với {bacSi.ten}&lt;/h3&gt;
      {daKhoiPhuc &amp;&amp; &lt;p className="ban-nhap"&gt;Đã khôi phục bản nháp — tự lưu trên máy này.&lt;/p&gt;}
      {errors.root?.server &amp;&amp; (
        &lt;p className="loi-chung" role="alert"&gt;
          {errors.root.server.message}
        &lt;/p&gt;
      )}

      &lt;label htmlFor="hoTen"&gt;Họ và tên&lt;/label&gt;
      &lt;input
        id="hoTen"
        autoComplete="name"
        aria-invalid={e?.hoTen ? true : undefined}
        aria-describedby={e?.hoTen ? 'hoTen-loi' : undefined}
        {...register('benhNhan.hoTen')}
      /&gt;
      {e?.hoTen &amp;&amp; &lt;p id="hoTen-loi" className="loi"&gt;{e.hoTen.message}&lt;/p&gt;}

      &lt;label htmlFor="soDienThoai"&gt;Số điện thoại&lt;/label&gt;
      &lt;input
        id="soDienThoai"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        aria-invalid={e?.soDienThoai ? true : undefined}
        aria-describedby={e?.soDienThoai ? 'soDienThoai-loi' : undefined}
        {...register('benhNhan.soDienThoai')}
      /&gt;
      {e?.soDienThoai &amp;&amp; &lt;p id="soDienThoai-loi" className="loi"&gt;{e.soDienThoai.message}&lt;/p&gt;}

      &lt;label htmlFor="ngaySinh"&gt;Ngày sinh&lt;/label&gt;
      &lt;input
        id="ngaySinh"
        type="date"
        aria-invalid={e?.ngaySinh ? true : undefined}
        aria-describedby={e?.ngaySinh ? 'ngaySinh-loi' : undefined}
        {...register('benhNhan.ngaySinh')}
      /&gt;
      {e?.ngaySinh &amp;&amp; &lt;p id="ngaySinh-loi" className="loi"&gt;{e.ngaySinh.message}&lt;/p&gt;}

      &lt;label htmlFor="lyDo"&gt;Lý do khám&lt;/label&gt;
      &lt;textarea
        id="lyDo"
        rows={3}
        aria-invalid={errors.lyDo ? true : undefined}
        aria-describedby={errors.lyDo ? 'lyDo-loi lyDo-dem' : 'lyDo-dem'}
        {...register('lyDo')}
      /&gt;
      &lt;DemKyTuLyDo control={control} /&gt;
      {errors.lyDo &amp;&amp; &lt;p id="lyDo-loi" className="loi"&gt;{errors.lyDo.message}&lt;/p&gt;}

      &lt;button type="submit" className="nut nut-chinh" disabled={isSubmitting}&gt;
        {isSubmitting ? 'Đang gửi…' : 'Gửi yêu cầu'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p><code>src/App.css</code> — add at the end:</p>
<pre><code class="language-css">/* ── Chương 4: đồng hồ mở cửa ── */
.trang-thai-mo { margin: 0 0 0 auto; padding: 4px 12px; border-radius: 999px; font-size: 14px; font-weight: 600; background: rgba(255, 255, 255, .16); }
.trang-thai-mo.mo span { color: #86efac; }
.trang-thai-mo.dong span { color: #fda4af; }
.ban-nhap { margin: 0 0 4px; font-size: 13px; color: var(--nhat); }</code></pre>
<p><code>src/test/setup.ts</code></p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
  // Chương 4: localStorage của jsdom sống suốt một file test ⇒ bản nháp của test trước
  // sẽ "khôi phục" vào test sau. Dọn sau mỗi test.
  localStorage.clear();
});</code></pre>
<p><code>src/hooks/useDebounce.test.ts</code></p>
<pre><code class="language-ts">import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useDebounce } from './useDebounce';

afterEach(() =&gt; {
  vi.useRealTimers();
});

test('gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối', () =&gt; {
  vi.useFakeTimers();
  const daThay: string[] = [];
  const { result, rerender } = renderHook(({ chu }) =&gt; useDebounce(chu, 300), { initialProps: { chu: '' } });
  daThay.push(result.current);
  let dangGo = '';
  for (const phim of 'nguyen') {
    dangGo += phim;
    rerender({ chu: dangGo });
    act(() =&gt; vi.advanceTimersByTime(100));
    daThay.push(result.current);
  }
  console.log('sau từng phím:', JSON.stringify(daThay));
  act(() =&gt; vi.advanceTimersByTime(200));
  console.log('thêm 200 ms  :', JSON.stringify(result.current));
  expect(result.current).toBe('nguyen');
  expect(new Set(daThay)).toEqual(new Set(['']));
});

test('đổi treMs cũng đặt lại hẹn giờ', () =&gt; {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ chu, tre }) =&gt; useDebounce(chu, tre), { initialProps: { chu: 'a', tre: 300 } });
  rerender({ chu: 'ab', tre: 1000 });
  act(() =&gt; vi.advanceTimersByTime(999));
  expect(result.current).toBe('a');
  act(() =&gt; vi.advanceTimersByTime(1));
  expect(result.current).toBe('ab');
});</code></pre>
<p><code>src/hooks/useLocalStorage.test.ts</code></p>
<pre><code class="language-ts">import { act, renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

test('chưa có gì trong kho ⇒ giá trị mặc định; đặt giá trị ⇒ ghi JSON vào localStorage', () =&gt; {
  const { result } = renderHook(() =&gt; useLocalStorage('thu', { lyDo: '' }));
  expect(result.current[0]).toEqual({ lyDo: '' });
  act(() =&gt; result.current[1]({ lyDo: 'đau đầu' }));
  expect(localStorage.getItem('thu')).toBe('{"lyDo":"đau đầu"}');
});

test('đã có trong kho ⇒ đọc ra ngay lần render đầu', () =&gt; {
  localStorage.setItem('thu', '{"lyDo":"sốt"}');
  const { result } = renderHook(() =&gt; useLocalStorage('thu', { lyDo: '' }));
  expect(result.current[0]).toEqual({ lyDo: 'sốt' });
});

test('JSON hỏng ⇒ không sập, dùng giá trị mặc định', () =&gt; {
  localStorage.setItem('thu', '{hỏng');
  const { result } = renderHook(() =&gt; useLocalStorage('thu', 42));
  expect(result.current[0]).toBe(42);
});

test('hàm xoá bỏ bản lưu', () =&gt; {
  const { result } = renderHook(() =&gt; useLocalStorage('thu', 'x'));
  act(() =&gt; result.current[2]());
  expect(localStorage.getItem('thu')).toBeNull();
});

test('hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE', () =&gt; {
  const a = renderHook(() =&gt; useLocalStorage('chung', 0));
  const b = renderHook(() =&gt; useLocalStorage('chung', 0));
  act(() =&gt; a.result.current[1](5));
  console.log(&#96;A thấy &#36;{a.result.current[0]} · B thấy &#36;{b.result.current[0]} · localStorage = &#36;{localStorage.getItem('chung')}&#96;);
  expect(b.result.current[0]).toBe(0);
});</code></pre>
<p><code>src/logic/gio-mo-cua.test.ts</code></p>
<pre><code class="language-ts">import { expect, test } from 'vitest';
import { dangMoCua } from './gio-mo-cua';

// new Date(năm, THÁNG-TỪ-0, ngày, giờ, phút): tháng 8 = tháng 9. 28/09/2026 là Thứ 2.
test.each([
  ['Thứ 2, 07:29', false, new Date(2026, 8, 28, 7, 29)],
  ['Thứ 2, 07:30', true, new Date(2026, 8, 28, 7, 30)],
  ['Thứ 2, 16:59', true, new Date(2026, 8, 28, 16, 59)],
  ['Thứ 2, 17:00', false, new Date(2026, 8, 28, 17, 0)],
  ['Thứ 7, 10:00', true, new Date(2026, 9, 3, 10, 0)],
  ['Chủ nhật, 10:00', false, new Date(2026, 9, 4, 10, 0)],
])('%s ⇒ mở cửa: %s', (_ten, mong, luc) =&gt; {
  expect(dangMoCua(luc)).toBe(mong);
});</code></pre>
<p><code>src/components/KhuBacSi.test.tsx</code> — the two search tests now wait (<code>expect(await screen.findByText('Đang hiện 1/6 bác sĩ'))</code> and <code>expect(await screen.findByText('Không tìm thấy bác sĩ phù hợp.'))</code>), and two tests are added at the end:</p>
<pre><code class="language-tsx">test('Chương 4 — tiêu đề tab theo bác sĩ đang xem, đóng thì trả lại', async () =&gt; {
  const user = userEvent.setup();
  document.title = 'Phòng khám An Tâm';
  render(&lt;KhuBacSi /&gt;);
  await user.click(screen.getByRole('button', { name: 'Xem chi tiết BS. Vũ Thảo Vy' }));
  expect(document.title).toBe('BS. Vũ Thảo Vy · Phòng khám An Tâm');
  await user.click(screen.getByRole('button', { name: 'Đóng' }));
  expect(document.title).toBe('Phòng khám An Tâm');
});

test('Chương 4 — ô tìm hiện chữ ngay, danh sách chờ ngừng gõ rồi mới lọc', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;KhuBacSi /&gt;);
  await user.type(screen.getByLabelText('Tìm theo tên'), 'huy');
  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('huy');
  expect(screen.getByText('Đang hiện 6/6 bác sĩ')).toBeInTheDocument(); // chưa lọc
  expect(await screen.findByText('Đang hiện 1/6 bác sĩ')).toBeInTheDocument(); // ~300 ms sau
});</code></pre>
<p><code>src/components/FormDatLich.test.tsx</code> — two tests added at the end:</p>
<pre><code class="language-tsx">test('Chương 4 — bản nháp: gõ dở, đóng form, mở lại ⇒ chữ còn; gửi xong ⇒ bản nháp bị xoá', async () =&gt; {
  const user = userEvent.setup();
  const lan1 = render(&lt;FormDatLich bacSi={bacSi} onGui={async () =&gt; {}} /&gt;);
  expect(screen.queryByText(/Đã khôi phục bản nháp/)).not.toBeInTheDocument();
  await user.type(screen.getByLabelText('Họ và tên'), 'Lê Văn Tám');
  expect(screen.queryByText(/Đã khôi phục bản nháp/)).not.toBeInTheDocument(); // đang gõ ≠ khôi phục
  await user.type(screen.getByLabelText('Lý do khám'), 'Ho kéo dài');
  lan1.unmount();
  const lan2 = render(&lt;FormDatLich bacSi={bacSi} onGui={async () =&gt; {}} /&gt;);
  expect(screen.getByLabelText('Họ và tên')).toHaveValue('Lê Văn Tám');
  expect(screen.getByText('Đã khôi phục bản nháp — tự lưu trên máy này.')).toBeInTheDocument();
  await user.type(screen.getByLabelText('Số điện thoại'), '0912345678');
  await user.type(screen.getByLabelText('Ngày sinh'), '1990-05-12');
  await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Đã gửi yêu cầu đặt lịch');
  expect(localStorage.getItem(&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;)).toBeNull();
  lan2.unmount();
});

test('Chương 4 — bản nháp tách theo bác sĩ', async () =&gt; {
  const user = userEvent.setup();
  const a = render(&lt;FormDatLich bacSi={bacSi} onGui={async () =&gt; {}} /&gt;);
  await user.type(screen.getByLabelText('Họ và tên'), 'Lê Văn Tám');
  a.unmount();
  render(&lt;FormDatLich bacSi={danhSachBacSi[0]} onGui={async () =&gt; {}} /&gt;);
  expect(screen.getByLabelText('Họ và tên')).toHaveValue('');
});</code></pre>
<p>The full run, trimmed to the new and changed tests:</p>
<div class="out">$ npx vitest run --reporter=verbose
 ✓ src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
 ✓ src/components/KhuBacSi.test.tsx &gt; không khớp ⇒ thông báo rỗng
 ✓ src/components/FormDatLich.test.tsx &gt; đếm ký tự lý do theo NFC; vượt 500 ⇒ lỗi
 ✓ src/components/FormDatLich.test.tsx &gt; Chương 4 — bản nháp: gõ dở, đóng form, mở lại ⇒ chữ còn; gửi xong ⇒ bản nháp bị xoá
 ✓ src/components/FormDatLich.test.tsx &gt; Chương 4 — bản nháp tách theo bác sĩ
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; 07:29 Thứ 2 đang đóng; 60 giây sau tự chuyển sang mở, không cần tải lại
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; gỡ component ⇒ không còn hẹn giờ nào chạy
 ✓ src/hooks/useDebounce.test.ts &gt; gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối
 ✓ src/hooks/useDebounce.test.ts &gt; đổi treMs cũng đặt lại hẹn giờ
 ✓ src/hooks/useLocalStorage.test.ts &gt; chưa có gì trong kho ⇒ giá trị mặc định; đặt giá trị ⇒ ghi JSON vào localStorage
 ✓ src/hooks/useLocalStorage.test.ts &gt; đã có trong kho ⇒ đọc ra ngay lần render đầu
 ✓ src/hooks/useLocalStorage.test.ts &gt; JSON hỏng ⇒ không sập, dùng giá trị mặc định
 ✓ src/hooks/useLocalStorage.test.ts &gt; hàm xoá bỏ bản lưu
 ✓ src/hooks/useLocalStorage.test.ts &gt; hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE
 ✓ src/components/KhuBacSi.test.tsx &gt; Chương 4 — tiêu đề tab theo bác sĩ đang xem, đóng thì trả lại
 ✓ src/components/KhuBacSi.test.tsx &gt; Chương 4 — ô tìm hiện chữ ngay, danh sách chờ ngừng gõ rồi mới lọc
 ✓ src/hooks/useTieuDeTrang.test.ts &gt; đặt tiêu đề, đổi theo tham số, gỡ thì trả tiêu đề cũ
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 07:29 ⇒ mở cửa: false
 …
 Test Files  11 passed (11)
      Tests  46 passed (46)</div>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">custom hook (hook tự viết)</span><span class="v">a function named <code>use…</code> that calls other hooks to reuse stateful logic</span></div>
<div class="kv"><span class="k">rules of hooks</span><span class="v">call hooks at the top level, only from components or hooks — React tracks them by call order</span></div>
<div class="kv"><span class="k">debounce</span><span class="v">use a value only after it has stopped changing for a set time</span></div>
<div class="kv"><span class="k"><code>renderHook</code></span><span class="v">Testing Library helper that runs a hook in a hidden component; <code>result.current</code> is its latest return</span></div>
<div class="kv"><span class="k">fake timers</span><span class="v"><code>vi.useFakeTimers()</code>, <code>advanceTimersByTime</code>, <code>setSystemTime</code> — time moves only when the test says</span></div>
<div class="kv"><span class="k">lazy initial state</span><span class="v"><code>useState(() =&gt; …)</code>: the function runs only on the first render</span></div>
<div class="kv"><span class="k"><code>localStorage</code></span><span class="v">browser key–value string store that survives reloads; readable by any script on the page</span></div>
<div class="kv"><span class="k">subscribe / unsubscribe</span><span class="v">start listening to an outside store and stop — the setup and cleanup of an effect</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A custom hook is a <code>use…</code> function that calls hooks; it shares logic, not state — two callers measured "A thấy 5 · B thấy 0".</li>
<li><code>useTieuDeTrang</code> restores the previous title in its cleanup; verified in a real tab before and after reload.</li>
<li><code>useDebounce</code> kept the output at "" through six fast keys and produced "nguyen" once, 300 ms after the last one.</li>
<li><code>useLocalStorage</code> reads once lazily, writes in an effect, survives bad storage; the booking draft survived a real reload.</li>
<li><code>dangMoCua</code> is pure and tested with plain dates; <code>useGioHienTai</code> is a timer with cleanup (0 timers after unmount).</li>
<li>Hooks run in a fixed order — oxlint errors on a conditional <code>useState</code>; new hooks made old tests fail for real reasons (debounce timing, leaked storage), fixed with <code>findBy</code> and <code>localStorage.clear()</code>.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Reusing Logic with Custom Hooks</span><span class="lc-sub">react.dev/learn/reusing-logic-with-custom-hooks — naming, sharing logic not state, when to extract a hook.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Rules of Hooks</span><span class="lc-sub">react.dev/reference/rules/rules-of-hooks — top-level calls only, only from React functions.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useState: avoiding recreating the initial state</span><span class="lc-sub">react.dev/reference/react/useState — the lazy initializer used by <code>useLocalStorage</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vitest — Fake timers</span><span class="lc-sub">vitest.dev/api/vi — <code>useFakeTimers</code>, <code>advanceTimersByTime</code>, <code>setSystemTime</code>, <code>getTimerCount</code>.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Hook tự viết: useDebounce, useLocalStorage, useTieuDeTrang và quy tắc hook</h2>
<p class="lead">Ba bài trước viết effect thẳng trong component. Cách đó ổn cho một component, nhưng app phòng khám cần đi cần lại cùng một kiểu effect: "đặt tiêu đề tab", "chờ người dùng gõ xong", "nhớ cái này trong localStorage", "báo giờ cho tôi mỗi 30 giây". Một <strong>hook tự viết (custom hook)</strong> đơn giản là một hàm có tên bắt đầu bằng <code>use</code> và gọi các hook khác. Nó gói một effect — setup, cleanup, dependency, mọi chi tiết của Bài 4.1–4.3 — sau một lời gọi một dòng, để mỗi component nói nó muốn <em>gì</em> còn hook lo <em>làm thế nào</em>.</p>

<p>Bài này dựng bốn hook dự án cần, gắn chúng vào các component thật, test từng cái bằng <code>renderHook</code> và đồng hồ giả, và cho thấy hai điều lập trình viên React nào cũng nên thấy tận mắt một lần: hai component gọi cùng một hook <em>không</em> dùng chung state, và thêm những hook hoàn toàn đúng có thể làm test cũ đỏ — vì những lý do chính đáng. Bài kết thúc bằng đề "tự gõ tiếp dự án" của chương cùng lời giải đầy đủ đã chạy test.</p>

<h3>Hook tự viết là một hàm tên use… gọi các hook khác</h3>
${slide('rx-04', 21, 'Hook tự viết = hàm tên use… gọi các hook khác')}
<p>Bài 4.1 kết thúc với một bug: effect tiêu đề không trả lại tiêu đề cũ. Sửa xong và chuyển sang file riêng, nó thành hook đầu tiên của dự án:</p>
<pre><code class="language-ts">// src/hooks/useTieuDeTrang.ts
import { useEffect } from 'react';

/** Đặt document.title khi component đang hiện; gỡ component thì trả lại tiêu đề cũ. */
export function useTieuDeTrang(tieuDe: string) {
  useEffect(() =&gt; {
    const tieuDeCu = document.title;
    document.title = tieuDe;
    return () =&gt; {
      document.title = tieuDeCu;
    };
  }, [tieuDe]);
}</code></pre>
<p>Dùng trong <code>KhuBacSi</code> chỉ một dòng, đặt sau chỗ tính <code>bacSiDangChon</code>:</p>
<pre><code class="language-tsx">useTieuDeTrang(bacSiDangChon ? &#96;&#36;{bacSiDangChon.ten} · Phòng khám An Tâm&#96; : 'Phòng khám An Tâm');</code></pre>
<p>Điều gì làm nó thành hook, và nó không phải là gì:</p>
<ul>
<li><strong>Nó là một hàm bình thường.</strong> Không đăng ký, không cú pháp đặc biệt. React thậm chí không biết nó tồn tại; khi <code>KhuBacSi</code> gọi nó, <code>useEffect</code> bên trong thuộc về <code>KhuBacSi</code> y như được viết ngay tại đó.</li>
<li><strong>Tên bắt đầu bằng <code>use</code> và một chữ hoa.</strong> Điều đó báo cho người đọc và linter "hàm này gọi hook, nên quy tắc hook áp dụng" (bên dưới).</li>
<li><strong>Nó chia sẻ logic, không chia sẻ state.</strong> Mỗi lần gọi có state và effect riêng. Hai component gọi <code>useLocalStorage('chung', 0)</code> — định nghĩa ngay sau đây — mỗi bên có một bản riêng:</li>
</ul>
<div class="out">$ npx vitest run src/hooks/useLocalStorage --reporter=verbose
stdout | src/hooks/useLocalStorage.test.ts &gt; hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE
A thấy 5 · B thấy 0 · localStorage = 5
 ✓ src/hooks/useLocalStorage.test.ts &gt; hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE</div>
<p>A đặt giá trị thành 5 và lưu lại; B, vẽ từ cùng khoá, vẫn hiện 0 vì không có gì bảo nó đọc lại. Nếu nhiều component phải thấy cùng một giá trị, giá trị đó phải sống ở một chỗ: nâng lên component cha chung (Chương 2), trong context, hoặc trong một store như Zustand (Chương 5). Hook là một công thức nấu, không phải một nồi dùng chung.</p>
<p>File test cho thấy cách test hook mà không cần viết component: <code>renderHook</code> của Testing Library vẽ một component nhỏ vô hình gọi hook của bạn và đưa giá trị trả về mới nhất vào <code>result.current</code>:</p>
<pre><code class="language-ts">// src/hooks/useTieuDeTrang.test.ts
import { renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useTieuDeTrang } from './useTieuDeTrang';

test('đặt tiêu đề, đổi theo tham số, gỡ thì trả tiêu đề cũ', () =&gt; {
  document.title = 'Phòng khám An Tâm';
  const { rerender, unmount } = renderHook(({ t }) =&gt; useTieuDeTrang(t), { initialProps: { t: 'BS. Nguyễn Minh An · Phòng khám An Tâm' } });
  expect(document.title).toBe('BS. Nguyễn Minh An · Phòng khám An Tâm');
  rerender({ t: 'BS. Trần Thu Hà · Phòng khám An Tâm' });
  expect(document.title).toBe('BS. Trần Thu Hà · Phòng khám An Tâm');
  unmount();
  expect(document.title).toBe('Phòng khám An Tâm');
});</code></pre>

<h3>useDebounce: ô tìm hiện từng chữ ngay, danh sách chờ bạn ngừng gõ</h3>
${slide('rx-04', 22, 'useDebounce: ô tìm hiện chữ ngay, danh sách chờ ngừng gõ')}
<p>Trên trang phòng khám, danh sách lọc lại sau mỗi phím. Với sáu bác sĩ thì tức thì; với 200 bác sĩ ở Chương 8, hoặc khi Chương 6 biến mỗi lần tìm thành một yêu cầu lên server, "n", "ng", "ngu", "nguy", "nguye", "nguyen" sẽ là sáu lần tìm trong khi người dùng chỉ muốn một. <strong>Debounce (chống dội)</strong> nghĩa là: chờ tới khi giá trị ngừng đổi một chút, rồi mới dùng nó.</p>
<pre><code class="language-ts">// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Trả về &#96;giaTri&#96; nhưng CHẬM &#96;treMs&#96; mili-giây: chỉ cập nhật khi người dùng ngừng thay đổi đủ lâu.
 * Mỗi lần giaTri đổi, cleanup huỷ hẹn giờ cũ rồi effect đặt hẹn giờ mới.
 */
export function useDebounce&lt;T&gt;(giaTri: T, treMs = 300): T {
  const [giaTriCham, setGiaTriCham] = useState(giaTri);
  useEffect(() =&gt; {
    const hen = setTimeout(() =&gt; setGiaTriCham(giaTri), treMs);
    return () =&gt; clearTimeout(hen);
  }, [giaTri, treMs]);
  return giaTriCham;
}</code></pre>
<div class="callout"><p><strong>JS nhắc nhanh: generic <code>&lt;T&gt;</code>.</strong> <code>useDebounce&lt;T&gt;(giaTri: T, treMs = 300): T</code> nói "bạn đưa vào kiểu gì thì nhận lại đúng kiểu đó": chuỗi cho ô tìm, số cho thanh trượt. <code>treMs = 300</code> là tham số mặc định — dùng khi người gọi bỏ trống.</p></div>
<p>Đây là khuôn của Bài 4.1 trong tám dòng. Mỗi giá trị mới làm effect chạy lại; trước đó React chạy cleanup của lượt trước, huỷ bộ hẹn giờ sắp công bố giá trị <em>trước đó</em>. Chỉ khi người dùng dừng 300 ms thì mới có một bộ hẹn giờ sống đủ lâu để gọi <code>setGiaTriCham</code>. Test gõ "nguyen", mỗi phím cách 100 ms, trên đồng hồ giả, và ghi lại output của hook sau từng phím:</p>
<pre><code class="language-ts">// src/hooks/useDebounce.test.ts (test đầu tiên)
test('gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối', () =&gt; {
  vi.useFakeTimers();
  const daThay: string[] = [];
  const { result, rerender } = renderHook(({ chu }) =&gt; useDebounce(chu, 300), { initialProps: { chu: '' } });
  daThay.push(result.current);
  let dangGo = '';
  for (const phim of 'nguyen') {
    dangGo += phim;
    rerender({ chu: dangGo });
    act(() =&gt; vi.advanceTimersByTime(100));
    daThay.push(result.current);
  }
  console.log('sau từng phím:', JSON.stringify(daThay));
  act(() =&gt; vi.advanceTimersByTime(200));
  console.log('thêm 200 ms  :', JSON.stringify(result.current));
  expect(result.current).toBe('nguyen');
  expect(new Set(daThay)).toEqual(new Set(['']));
});</code></pre>
<div class="out">$ npx vitest run src/hooks/useDebounce --reporter=verbose
stdout | src/hooks/useDebounce.test.ts &gt; gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối
sau từng phím: ["","","","","","",""]
thêm 200 ms  : "nguyen"
 ✓ src/hooks/useDebounce.test.ts &gt; gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối
 ✓ src/hooks/useDebounce.test.ts &gt; đổi treMs cũng đặt lại hẹn giờ</div>
<p>Sáu phím, sáu chuỗi rỗng: giá trị đã debounce không nhúc nhích khi còn đang gõ. 300 ms sau phím cuối nó thành "nguyen" — một lần đổi thay vì sáu. Trong <code>KhuBacSi</code>, ô input vẫn dùng <code>tuKhoa</code> (nên từng chữ hiện ngay — đừng bao giờ debounce thứ người dùng thấy trong ô nhập) còn danh sách dùng bản chậm:</p>
<pre><code class="language-tsx">// src/components/KhuBacSi.tsx (các dòng của Chương 4)
const tuKhoaCham = useDebounce(tuKhoa, 300);
const danhSachLoc = locBacSi(danhSachBacSi, chuyenKhoa, tuKhoaCham);</code></pre>
<p>Ảnh chụp trên slide được chụp trong Chromium sau khi gõ "huy" và chờ "Đang hiện 1/6 bác sĩ". Để ý bộ lọc vẫn là gì: một phép tính trong lúc render (Bài 4.2). Effect chỉ nằm trong hook, nơi nó đồng bộ với hệ thống bên ngoài duy nhất có liên quan — một bộ hẹn giờ.</p>

<h3>useLocalStorage: bản nháp form sống sót qua lần tải lại trang</h3>
${slide('rx-04', 23, 'useLocalStorage: bản nháp form sống qua lần tải lại trang')}
<p>Bệnh nhân điền form đặt lịch trên điện thoại và bị gián đoạn. Nếu họ tải lại trang hay quay lại, những gì đã gõ nên còn đó. <code>localStorage</code> là một kho khoá–giá trị nhỏ trong trình duyệt, sống qua các lần tải lại; nó chỉ chứa chuỗi, nên ta lưu JSON.</p>
<pre><code class="language-ts">// src/hooks/useLocalStorage.ts
import { useCallback, useEffect, useState } from 'react';

function docKho&lt;T&gt;(khoa: string, macDinh: T): T {
  try {
    const chuoi = localStorage.getItem(khoa);
    return chuoi === null ? macDinh : (JSON.parse(chuoi) as T);
  } catch {
    return macDinh; // JSON hỏng, hoặc trình duyệt chặn localStorage
  }
}

/**
 * Như useState, nhưng giá trị sống sót qua lần tải lại trang: đọc localStorage MỘT lần lúc khởi tạo,
 * và ghi lại mỗi khi giá trị (hoặc khoá) đổi. Trả về [giá trị, hàm đặt, hàm xoá bản lưu].
 */
export function useLocalStorage&lt;T&gt;(khoa: string, macDinh: T) {
  const [giaTri, setGiaTri] = useState&lt;T&gt;(() =&gt; docKho(khoa, macDinh));

  useEffect(() =&gt; {
    try {
      localStorage.setItem(khoa, JSON.stringify(giaTri));
    } catch {
      // đầy bộ nhớ hoặc bị chặn: bỏ qua, app vẫn chạy như useState thường
    }
  }, [khoa, giaTri]);

  const xoa = useCallback(() =&gt; {
    localStorage.removeItem(khoa);
  }, [khoa]);

  return [giaTri, setGiaTri, xoa] as const;
}</code></pre>
<p>Từng dòng, theo các ý của chương:</p>
<ul>
<li><strong>Đọc một lần, lười.</strong> <code>useState(() =&gt; docKho(khoa, macDinh))</code> truyền một <em>hàm</em>; React chỉ gọi nó ở lượt render đầu (khởi tạo lười — lazy initial state — của Chương 2). Đọc kho ngay trong thân component thì sẽ chạy ở mọi lượt render.</li>
<li><strong>Ghi trong effect.</strong> Lưu là đồng bộ state của React với một hệ thống bên ngoài, nên nó là effect, với dependency <code>[khoa, giaTri]</code> — đúng những gì nó đọc.</li>
<li><strong><code>try/catch</code> cả hai chiều.</strong> Kho có thể bị chặn (vài chế độ duyệt riêng tư), đầy, hoặc chứa JSON hỏng do ai đó gõ trong DevTools; app vẫn phải chạy như <code>useState</code> thường. Test "JSON hỏng ⇒ không sập" kiểm điều này.</li>
<li><strong><code>useCallback</code> cho <code>xoa</code></strong> — đây là "đúng lúc" của Bài 4.3: nơi gọi có thể liệt kê bất kỳ hàm nào hook này trả về trong dependency của một effect (form làm đúng như vậy với <code>setBanNhap</code>), nên mọi hàm trả về phải giữ nguyên giữa các lượt render. <code>setGiaTri</code> lấy từ <code>useState</code> vốn đã ổn định; <code>xoa</code> được giữ ổn định bằng <code>useCallback</code>, chỉ đổi khi <code>khoa</code> đổi.</li>
<li><strong><code>as const</code></strong> khiến TypeScript coi mảng trả về là một bộ cố định <code>[T, hàm đặt, () =&gt; void]</code>, nên khi destructuring mỗi vị trí có đúng kiểu.</li>
</ul>
<p>Trong <code>FormDatLich</code>, bản nháp có khoá riêng cho từng bác sĩ — <code>&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;</code> — và được đọc một lần khi form được tạo. Form đã có <code>key={bacSi.id}</code> (Chương 3), nên đổi bác sĩ là tạo form mới đọc bản nháp của chính bác sĩ đó. React Hook Form giữ giá trị các ô trong kho riêng của nó, bên ngoài React; để theo dõi chúng ta <em>đăng ký nghe</em> (subscribe) trong một effect và huỷ đăng ký trong cleanup — một effect đúng sách giáo khoa:</p>
<pre><code class="language-tsx">// src/components/FormDatLich.tsx (phần của Chương 4)
const [banNhap, setBanNhap, xoaBanNhap] = useLocalStorage&lt;DatLichForm&gt;(&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;, RONG);
const { register, handleSubmit, setError, control, subscribe, formState: { … } } = useForm({
  resolver: zodResolver(datLichSchema),
  defaultValues: banNhap, // bản nháp thành giá trị khởi đầu
  mode: 'onTouched',
});

useEffect(() =&gt; {
  const huy = subscribe({
    formState: { values: true },
    callback: ({ values }) =&gt; setBanNhap(values),
  });
  return huy; // subscribe() trả về hàm huỷ đăng ký — đúng thứ mà cleanup cần
}, [subscribe, setBanNhap]);

const [daKhoiPhuc] = useState(() =&gt; banNhap.benhNhan.hoTen !== '' || banNhap.lyDo !== '');
// … sau khi gửi thành công: xoaBanNhap();</code></pre>
<p>(<code>subscribe</code> có trong React Hook Form 7.88 — kiểu của nó trong <code>node_modules/react-hook-form/dist/types/form.d.ts</code> trả về <code>() =&gt; void</code>. <code>daKhoiPhuc</code> dùng khởi tạo lười để câu "Đã khôi phục bản nháp" nghĩa là "lúc mở form đã có bản nháp", chứ không phải "bạn đang gõ".) Chúng tôi kiểm đầu–cuối trong Chromium thật trên bản build production — gõ dở nửa form, tải lại trang, mở lại bác sĩ đó:</p>
<div class="out">$ node chup-nhap.mjs    # Playwright: vite build + vite preview, TZ=Asia/Ho_Chi_Minh
1. mở trang       → document.title = "Phòng khám An Tâm"
2. xem BS. Thu Hà → document.title = "BS. Trần Thu Hà · Phòng khám An Tâm"
3. gõ dở → localStorage = {"benhNhan":{"hoTen":"Nguyễn Thị Mai","soDienThoai":"","ngaySinh":""},"lyDo":"Bé sốt 38,5 độ từ tối qua, ho nhiều về đêm"}
4. tải lại trang  → document.title = "Phòng khám An Tâm"
5. mở lại → ô Họ và tên = "Nguyễn Thị Mai"</div>
<p>Cùng lần chạy đó cũng chứng minh <code>useTieuDeTrang</code> trên một tab thật: tiêu đề ghi tên bác sĩ khi đang mở, và trở về "Phòng khám An Tâm" sau khi tải lại. Slide cho thấy form đã được khôi phục.</p>
<div class="callout warn"><p><strong>Lưu ý quyền riêng tư.</strong> Bản nháp đặt lịch chứa họ tên, số điện thoại, ngày sinh và lý do khám bệnh. <code>localStorage</code> đọc được bởi mọi script trên trang và nằm lại trên máy dùng chung cho tới khi bị xoá. Vì vậy bản nháp bị xoá sau khi gửi thành công, và một phòng khám thật có thể chỉ giữ ô "lý do", hoặc dùng <code>sessionStorage</code> (mất khi đóng tab). Hãy quyết cùng người phụ trách sản phẩm; đừng lưu dữ liệu sức khoẻ "vì làm cho dễ".</p></div>

<h3>Nhãn "đang mở cửa?" tự cập nhật: logic thuần cộng một hook hẹn giờ</h3>
${slide('rx-04', 24, 'Đồng hồ “đang mở cửa?”: logic thuần + hook hẹn giờ')}
<p>Footer ghi phòng khám mở Thứ 2 – Thứ 7, 7:30–17:00. Header nên nói <em>lúc này</em> có mở không, và tự đổi lúc 7:30. Tách làm hai: một hàm thuần trả lời câu hỏi cho bất kỳ thời điểm nào, và một hook cung cấp giờ hiện tại.</p>
<pre><code class="language-ts">// src/logic/gio-mo-cua.ts
/** Giờ mở cửa: Thứ 2 – Thứ 7, 7:30 – 17:00; Chủ nhật nghỉ. Tính theo giờ của máy người dùng. */
export const MO_CUA_PHUT = 7 * 60 + 30;
export const DONG_CUA_PHUT = 17 * 60;

/** Hàm THUẦN: nhận một thời điểm, trả về true nếu phòng khám đang mở. Dễ test, không cần giả đồng hồ. */
export function dangMoCua(luc: Date): boolean {
  if (luc.getDay() === 0) return false; // getDay(): 0 = Chủ nhật, 1 = Thứ 2, …, 6 = Thứ 7
  const phut = luc.getHours() * 60 + luc.getMinutes();
  return phut &gt;= MO_CUA_PHUT &amp;&amp; phut &lt; DONG_CUA_PHUT;
}</code></pre>
<pre><code class="language-ts">// src/hooks/useGioHienTai.ts
import { useEffect, useState } from 'react';

/** Giờ hiện tại, tự cập nhật mỗi &#96;moiMs&#96; mili-giây. Có cleanup: gỡ component là dừng hẹn giờ. */
export function useGioHienTai(moiMs = 30_000): Date {
  const [bayGio, setBayGio] = useState(() =&gt; new Date());
  useEffect(() =&gt; {
    const id = setInterval(() =&gt; setBayGio(new Date()), moiMs);
    return () =&gt; clearInterval(id);
  }, [moiMs]);
  return bayGio;
}</code></pre>
<pre><code class="language-tsx">// src/components/TrangThaiMoCua.tsx
import { useGioHienTai } from '../hooks/useGioHienTai';
import { dangMoCua } from '../logic/gio-mo-cua';

export function TrangThaiMoCua() {
  const bayGio = useGioHienTai();
  const mo = dangMoCua(bayGio);
  const gio = bayGio.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return (
    &lt;p className={mo ? 'trang-thai-mo mo' : 'trang-thai-mo dong'} role="status"&gt;
      &lt;span aria-hidden="true"&gt;●&lt;/span&gt; {mo ? 'Đang mở cửa' : 'Đang đóng cửa'} · {gio}
    &lt;/p&gt;
  );
}</code></pre>
<p>Vì sao tách quan trọng: <code>dangMoCua</code> không có effect, không có đồng hồ, nên test của nó chỉ việc truyền ngày giờ — kể cả các ca biên 7:29, 7:30, 16:59, 17:00 và Chủ nhật. Hook là một effect bốn dòng có cleanup. Component ghép chúng trong hai dòng. Test component cần giả cả đồng hồ <em>hệ thống</em>: <code>vi.setSystemTime</code> làm <code>new Date()</code> trả về 07:29 sáng Thứ 2, và cho trôi 60 giây để interval 30 giây kích hoạt hai lần:</p>
<pre><code class="language-tsx">// src/components/TrangThaiMoCua.test.tsx
import { act, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { TrangThaiMoCua } from './TrangThaiMoCua';

afterEach(() =&gt; {
  vi.useRealTimers();
});

test('07:29 Thứ 2 đang đóng; 60 giây sau tự chuyển sang mở, không cần tải lại', () =&gt; {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 28, 7, 29)); // giả đồng hồ hệ thống: 07:29 Thứ 2
  render(&lt;TrangThaiMoCua /&gt;);
  expect(screen.getByRole('status')).toHaveTextContent('Đang đóng cửa · 07:29');
  act(() =&gt; vi.advanceTimersByTime(60_000));
  expect(screen.getByRole('status')).toHaveTextContent('Đang mở cửa · 07:30');
});

test('gỡ component ⇒ không còn hẹn giờ nào chạy', () =&gt; {
  vi.useFakeTimers();
  const { unmount } = render(&lt;TrangThaiMoCua /&gt;);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});</code></pre>
<div class="out">$ npx vitest run src/logic/gio-mo-cua src/components/TrangThaiMoCua --reporter=verbose
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 07:29 ⇒ mở cửa: false
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 07:30 ⇒ mở cửa: true
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 16:59 ⇒ mở cửa: true
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 17:00 ⇒ mở cửa: false
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 7, 10:00 ⇒ mở cửa: true
 ✓ src/logic/gio-mo-cua.test.ts &gt; Chủ nhật, 10:00 ⇒ mở cửa: false
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; 07:29 Thứ 2 đang đóng; 60 giây sau tự chuyển sang mở, không cần tải lại
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; gỡ component ⇒ không còn hẹn giờ nào chạy</div>
<p>Test cuối là cleanup của Bài 4.1 được biến thành thứ đo được: <code>vi.getTimerCount()</code> là 1 khi nhãn đang hiện và 0 sau unmount. Ảnh chụp trên slide được chụp với múi giờ của máy đặt về Việt Nam (máy dựng bài chạy giờ UTC; <code>getHours()</code> dùng giờ địa phương của trình duyệt — app phòng khám thật mà hiển thị ở nước ngoài sẽ cần chỉ rõ múi giờ, chuyện của Chương 14).</p>

<h3>Quy tắc hook: gọi ở cấp cao nhất của component hoặc của một hook khác</h3>
${slide('rx-04', 25, 'Quy tắc hook: gọi ở cấp cao nhất, trong component hoặc hook')}
<p>Hai quy tắc, được linter kiểm:</p>
<ol>
<li><strong>Chỉ gọi hook ở cấp cao nhất</strong> của component hoặc hook tự viết — không trong <code>if</code>, vòng lặp, sau một <code>return</code> sớm, trong handler sự kiện hay trong hàm bạn truyền cho <code>useEffect</code>/<code>useMemo</code>.</li>
<li><strong>Chỉ gọi hook từ hàm React</strong> — component và hook tự viết — không từ hàm phụ trợ thường như <code>dangMoCua</code>.</li>
</ol>
<p>Vì sao: React không biết tên hook. Nó nhận ra "<code>useState</code> thứ nhất của component này", "cái thứ hai", "<code>useEffect</code> thứ nhất" theo <strong>thứ tự gọi</strong>. Nếu một hook chỉ được gọi khi một điều kiện đúng, thứ tự lệch đi giữa các lượt render và state của hook này rơi vào hook khác. oxlint báo đây là lỗi:</p>
<div class="out">$ npx oxlint src/vi-du/b3-lint.tsx
src/vi-du/b3-lint.tsx:5:25: warning react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'ten' help: Either include it or remove the dependency array.
src/vi-du/b3-lint.tsx:12:33: error react-hooks(rules-of-hooks): React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.</div>
<p>Đoạn code phạm luật là <code>if (coChiTiet) { const [moRong, setMoRong] = useState(false); … }</code>. Cách sửa nằm ngay trong phần help: gọi <code>useState</code> vô điều kiện ở đầu, rồi rẽ nhánh theo giá trị của nó. Điều tương tự áp dụng bên trong hook của bạn: <code>useDebounce</code> luôn gọi <code>useState</code> rồi <code>useEffect</code>, đúng thứ tự đó, ở mọi lượt render.</p>
<p>Cách đặt tên suy ra từ quy tắc 2. Hàm có gọi hook phải bắt đầu bằng <code>use</code> — không thì linter không kiểm được. Hàm không gọi hook nào thì <em>không được</em> bắt đầu bằng <code>use</code> — <code>dangMoCua</code>, không phải <code>useDangMoCua</code> — vì khi đó nó gọi được ở bất cứ đâu, kể cả trong điều kiện và trong test thuần.</p>

<h3>Hook mới làm hai test cũ đỏ — và đó là tin tốt</h3>
${slide('rx-04', 26, 'Thêm hook vào dự án làm đỏ hai test cũ — và đó là tin tốt')}
<p>Gắn hook xong, bộ test của Chương 2–3 báo lỗi:</p>
<div class="out">$ npx vitest run
 FAIL  src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
TestingLibraryElementError: Unable to find an element with the text: Đang hiện 1/6 bác sĩ. …
 FAIL  src/components/KhuBacSi.test.tsx &gt; không khớp ⇒ thông báo rỗng
TestingLibraryElementError: Unable to find an element with the text: Không tìm thấy bác sĩ phù hợp.. …
 FAIL  src/components/FormDatLich.test.tsx &gt; đếm ký tự lý do theo NFC; vượt 500 ⇒ lỗi
TestingLibraryElementError: Unable to find an element with the text: 501/500. …
      Tests  3 failed | 36 passed (39)   ← (lần chạy này còn tính cả test ví dụ của chương trong src/vi-du)</div>
<p>Hai nguyên nhân khác nhau, đều có thật:</p>
<ul>
<li><strong>Test tìm kiếm đỏ là đúng.</strong> Chúng đòi danh sách đã lọc ngay sau khi gõ (<code>getByText</code>), trong khi debounce cố ý trễ 300 ms. Hành vi đã đổi có chủ đích, nên test đổi theo: <code>expect(await screen.findByText('Đang hiện 1/6 bác sĩ'))</code> — <code>findBy…</code> thử lại trong tối đa một giây. Một test mới còn chốt luôn hành vi mong muốn: ngay sau khi gõ, ô input hiện "huy" trong khi bộ đếm vẫn ghi 6/6; rồi bộ đếm thành 1/6.</li>
<li><strong>Test form lộ ra một bug cách ly test.</strong> DOM của test đỏ hiện "Đã khôi phục bản nháp" và bộ đếm <strong>518/500</strong>: một test trước đó trong cùng file đã gõ vào form của cùng bác sĩ, bản nháp được lưu, và <code>localStorage</code> của jsdom sống suốt cả file test. Chương 1 đã thêm <code>cleanup()</code> cho DOM; giờ kho lưu trữ cũng cần y như vậy.</li>
</ul>
<pre><code class="language-ts">// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
  // Chương 4: localStorage của jsdom sống suốt một file test ⇒ bản nháp của test trước
  // sẽ "khôi phục" vào test sau. Dọn sau mỗi test.
  localStorage.clear();
});</code></pre>
<div class="pitfall co-tieu-de"><strong>Bẫy — test chạy riêng thì xanh, chạy cả bộ thì đỏ.</strong> Bug bản nháp chỉ hiện khi test "máy chủ báo lỗi" chạy trước test đếm ký tự; chạy riêng test thứ hai (<code>-t "đếm ký tự"</code>) thì nó xanh. Mọi thứ toàn cục — <code>localStorage</code>, <code>document.title</code>, đồng hồ giả, một <code>console.error</code> đã bị giả — đều rò từ test này sang test khác nếu không reset. Vì vậy test của chương này gọi <code>vi.useRealTimers()</code> và <code>vi.restoreAllMocks()</code> trong <code>afterEach</code>, đặt lại <code>document.title</code> ở đầu các test tiêu đề, và <code>setup.ts</code> giờ xoá kho lưu trữ.</div>
<div class="out">$ npx vitest run
 Test Files  11 passed (11)
      Tests  46 passed (46)</div>
<p>(Đếm không tính các file ví dụ trong <code>src/vi-du/</code> của chương.)</p>

<div class="callout"><p><strong>🎓 Ở FER202 bạn làm thế này — 💼 đi làm người ta làm thế kia.</strong></p>
<p>Ở FER202 và trong code React cũ, logic dùng chung giữa các class component được chép từ cặp <code>componentDidMount</code>/<code>componentWillUnmount</code> này sang cặp khác, hoặc bọc trong một higher-order component (<code>withTimer(Component)</code>) hay một "render prop"; các chỗ đọc <code>localStorage</code> thường rải rác khắp component. → Đi làm, logic có state dùng chung là một hook tự viết trong <code>src/hooks/</code> (hoặc <code>src/features/…/hooks</code>, Chương 7), có kiểu bằng generic, test bằng <code>renderHook</code> và đồng hồ giả, và những hook phổ biến thường được lấy từ một thư viện nhỏ thay vì tự viết lại. · <em>Vì sao:</em> hook ghép được với nhau — một component gọi năm hook, mỗi hook giấu effect và cleanup của riêng nó, mà không bị lồng lớp bọc như HOC và render prop — và test được riêng từng cái. Bạn vẫn sẽ gặp HOC trong các thư viện cũ (và <code>memo()</code> về kỹ thuật cũng là một HOC); hãy đọc được chúng, nhưng viết hook.</p></div>

<h3>Chạy thử từng bước: tự viết useKhopMediaQuery</h3>
<ol>
<li>Tạo <code>src/hooks/useKhopMediaQuery.ts</code> export <code>useKhopMediaQuery(query: string): boolean</code>.</li>
<li>Bên trong, giữ <code>khop</code> trong state, khởi tạo lười từ <code>window.matchMedia(query).matches</code>.</li>
<li>Trong một effect với <code>[query]</code>, lấy <code>const mql = window.matchMedia(query)</code>, định nghĩa <code>const xuLy = () =&gt; setKhop(mql.matches)</code>, gọi <code>mql.addEventListener('change', xuLy)</code>, và trả về cleanup gỡ đúng listener đó.</li>
<li>Dùng trong <code>App</code>: <code>const hep = useKhopMediaQuery('(max-width: 700px)')</code>, và hiện danh sách bác sĩ một cột khi <code>hep</code>. Kéo nhỏ cửa sổ trình duyệt.</li>
<li>Chạy <code>npx oxlint src</code> và chắc chắn file mới không có cảnh báo <code>exhaustive-deps</code> hay <code>rules-of-hooks</code>.</li>
</ol>
<p>(jsdom không có <code>matchMedia</code>; muốn test hook này bạn phải tự cấp một bản giả nhỏ. Đó là một bài tập hay cho Chương 9.)</p>

<h3>Khi nào viết hook tự viết — khi nào KHÔNG</h3>
<ul>
<li><strong>Viết</strong> khi hai component cần cùng một effect, hoặc khi code effect trong component che mất việc chính của component. Tên phải nói mục đích: <code>useDebounce</code>, không phải <code>useMyEffect</code>.</li>
<li><strong>Viết</strong> để effect có test riêng của nó (<code>renderHook</code>).</li>
<li><strong>Không viết</strong> cho đoạn code không gọi hook nào — hãy để nó là hàm thường (<code>dangMoCua</code>, <code>locBacSi</code>).</li>
<li><strong>Không viết</strong> với mong đợi dùng chung state; muốn thế cần nâng state, context hoặc store (Chương 5).</li>
<li><strong>Không viết</strong> các hook "vòng đời" kiểu <code>useMount(fn)</code>; chúng giấu danh sách dependency khỏi linter và mang lại các bug của Bài 4.3.</li>
</ul>

<div class="callout"><p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>Hỏi: Custom hook là gì? Hai component dùng cùng một hook có chung state không?</strong><br>Đáp: Một hàm JavaScript có tên bắt đầu bằng <code>use</code> và gọi các hook khác, dùng để tái sử dụng logic có state (effect, đăng ký nghe, hẹn giờ). Mỗi lần gọi có state độc lập; hook chia sẻ logic, không chia sẻ state. Muốn dùng chung state thì nâng lên, dùng context, hoặc một store bên ngoài.</p>
<p><strong>Hỏi: Quy tắc hook là gì và vì sao có?</strong><br>Đáp: Chỉ gọi hook ở cấp cao nhất (không trong điều kiện, vòng lặp, hàm lồng) và chỉ từ component hoặc custom hook. React theo dõi hook theo thứ tự gọi; gọi có điều kiện làm thứ tự đổi giữa các lượt render và trộn lẫn state. Luật lint <code>rules-of-hooks</code> kiểm điều này.</p>
<p><strong>Hỏi: Hãy viết một <code>useDebounce</code>.</strong><br>Đáp: Một state cho giá trị đã debounce; một effect với <code>[value, delay]</code> đặt timeout để cập nhật nó và trả về <code>clearTimeout</code> làm cleanup, để mỗi lần đổi huỷ bộ hẹn giờ trước. Test bằng đồng hồ giả.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ô chi tiết bác sĩ nên ghi "Bạn đã xem hồ sơ này N giây", đếm lại từ đầu cho mỗi bác sĩ.</p><ol>
<li>Viết <code>useDemGiay(): number</code> — state bắt đầu từ 0, một interval 1000 ms cập nhật nó bằng dạng hàm, và một cleanup.</li>
<li>Dùng nó trong <code>ChiTietBacSi</code>. Vì <code>ChiTietBacSi</code> không có key theo bác sĩ, hãy xem chuyện gì xảy ra khi đổi bác sĩ; rồi cho nó <code>key={bacSiDangChon.id}</code> trong <code>KhuBacSi</code> và xem lại.</li>
<li>Test hook bằng <code>renderHook</code>, <code>vi.useFakeTimers()</code> và <code>act(() =&gt; vi.advanceTimersByTime(5000))</code>; mong đợi 5. Rồi <code>unmount()</code> và mong đợi <code>vi.getTimerCount()</code> là 0.</li>
<li>Chạy <code>npx oxlint src</code>.</li>
</ol><p><strong>Đạt khi:</strong> test hook ra 5 sau 5 giây và 0 bộ hẹn giờ sau unmount; đổi bác sĩ chỉ đếm lại từ 0 khi có <code>key</code>; <code>npx tsc -b</code> không in gì; oxlint không báo lỗi <code>exhaustive-deps</code>/<code>rules-of-hooks</code> nào trong file của bạn.</p></div>

<h3>🛠 Tự gõ tiếp dự án</h3>
<p><strong>Điểm xuất phát:</strong> dự án sau Chương 3 — <code>KhuBacSi</code> với các chip chuyên khoa (<code>ChipChuyenKhoa</code>), ô tìm theo tên (<code>OTimBacSi</code>, lọc bằng <code>locBacSi</code> trong <code>src/logic/loc-bac-si.ts</code>), <code>ChiTietBacSi</code> và danh sách yêu thích; và <code>FormDatLich</code> (React Hook Form + schema Zod trong <code>src/schema/dat-lich.ts</code>) được vẽ bằng <code>&lt;FormDatLich key={bacSiDangChon.id} … /&gt;</code> và gửi qua <code>src/logic/gui-dat-lich.ts</code>. <code>src/test/setup.ts</code> đã gọi <code>cleanup()</code> sau mỗi test.</p>
<p><strong>Đề — hết Chương 4, app có bốn hook:</strong></p>
<ol>
<li><code>src/hooks/useDebounce.ts</code>: <code>useDebounce&lt;T&gt;(giaTri: T, treMs = 300): T</code>. Trong <code>KhuBacSi</code>, ô input vẫn dùng <code>tuKhoa</code> nhưng lọc bằng <code>useDebounce(tuKhoa, 300)</code>.</li>
<li><code>src/hooks/useTieuDeTrang.ts</code>: đặt <code>document.title</code> và trả lại tiêu đề trước đó trong cleanup. Trong <code>KhuBacSi</code>: "&lt;tên bác sĩ&gt; · Phòng khám An Tâm" khi đang mở một bác sĩ, "Phòng khám An Tâm" khi không.</li>
<li><code>src/logic/gio-mo-cua.ts</code> với hàm thuần <code>dangMoCua(luc: Date): boolean</code> (Thứ 2 – Thứ 7, 7:30 ≤ giờ &lt; 17:00); <code>src/hooks/useGioHienTai.ts</code> trả về <code>Date</code> hiện tại, làm mới mỗi 30 giây, có cleanup; <code>src/components/TrangThaiMoCua.tsx</code> hiện "● Đang mở cửa · HH:MM" hoặc "● Đang đóng cửa · HH:MM" với <code>role="status"</code>, đặt bên phải <code>Header</code>.</li>
<li><code>src/hooks/useLocalStorage.ts</code>: <code>useLocalStorage&lt;T&gt;(khoa, macDinh)</code> trả về <code>[giaTri, setGiaTri, xoa]</code>, đọc một lần kiểu lười, ghi trong effect, chịu được kho bị chặn và JSON hỏng. Trong <code>FormDatLich</code>: bản nháp riêng từng bác sĩ với khoá <code>ban-nhap-dat-lich:&lt;id&gt;</code>, dùng làm <code>defaultValues</code>, cập nhật qua <code>subscribe</code> trong một effect có cleanup, bị xoá sau khi gửi thành công, và câu "Đã khôi phục bản nháp — tự lưu trên máy này." chỉ hiện khi form mở ra đã có bản nháp.</li>
<li>Test: mỗi hook một file, một file cho <code>dangMoCua</code>, một cho <code>TrangThaiMoCua</code> (giả giờ hệ thống), hai test bản nháp trong <code>FormDatLich.test.tsx</code>, hai test trong <code>KhuBacSi.test.tsx</code> (tiêu đề; danh sách debounce). Cho các test tìm kiếm cũ chờ bằng <code>findBy…</code> và thêm <code>localStorage.clear()</code> vào <code>setup.ts</code>.</li>
</ol>
<p><strong>Đạt khi (cả ba):</strong></p>
<ul>
<li><code>npx tsc -b</code> không in gì, <code>npx vitest run</code> xanh (lời giải dưới đây: <code>Test Files 11 passed (11)</code>, <code>Tests 46 passed (46)</code>), và <code>npx oxlint src</code> không có cảnh báo <code>exhaustive-deps</code>, <code>rules-of-hooks</code> hay <code>set-state-in-effect</code> nào trong file của bạn;</li>
<li>trên trình duyệt, gõ "huy" thì chữ hiện ngay và danh sách thu về BS. Hoàng Đức Huy một thoáng sau (slide 22); tiêu đề tab ghi tên bác sĩ đang mở; nhãn trên header hiện mở/đóng kèm giờ (slide 24);</li>
<li>gõ dở nửa form đặt lịch, tải lại trang rồi mở lại đúng bác sĩ đó thì thấy bản nháp và câu "Đã khôi phục bản nháp" (slide 23); form của bác sĩ khác thì trống.</li>
</ul>
<details><summary>Lời giải</summary>
<p>Đây đúng là code của dự án thực hành của khoá sau Chương 4, kiểm ngày 25/09/2026: <code>npx tsc -b</code> không in gì; <code>npx vitest run</code> ra <code>Test Files 11 passed (11)</code> / <code>Tests 46 passed (46)</code>; <code>npx vite build</code> ra <code>dist/assets/index-….js 343.63 kB │ gzip: 107.46 kB</code>; oxlint không có cảnh báo hook nào trong <code>src</code> (chỉ còn bốn cảnh báo tham số không dùng trong test form của Chương 3). File không liệt kê thì giữ nguyên như Chương 3.</p>
<p>Bốn hook, <code>gio-mo-cua.ts</code> và <code>TrangThaiMoCua.tsx</code> đúng là các bản đã in ở trên trong bài (<code>useTieuDeTrang.ts</code>, <code>useDebounce.ts</code>, <code>useLocalStorage.ts</code>, <code>gio-mo-cua.ts</code>, <code>useGioHienTai.ts</code>, <code>TrangThaiMoCua.tsx</code>, cùng các test <code>useTieuDeTrang.test.ts</code> và <code>TrangThaiMoCua.test.tsx</code>). Các file còn lại:</p>
<p><code>src/components/Header.tsx</code></p>
<pre><code class="language-tsx">import { TrangThaiMoCua } from './TrangThaiMoCua';

export function Header() {
  return (
    &lt;header className="header"&gt;
      &lt;span className="logo" aria-hidden="true"&gt;✚&lt;/span&gt;
      &lt;h1&gt;Phòng khám An Tâm&lt;/h1&gt;
      &lt;TrangThaiMoCua /&gt;
    &lt;/header&gt;
  );
}</code></pre>
<p><code>src/components/KhuBacSi.tsx</code> — phần đầu file, tới các lời gọi hook mới (thay đổi của Chương 4 là hai dòng import hook và các dòng dưới chú thích "Dẫn xuất"); phần còn lại giữ nguyên như Chương 3:</p>
<pre><code class="language-tsx">import { useState } from 'react';
import { danhSachBacSi } from '../du-lieu/bac-si';
import { useDebounce } from '../hooks/useDebounce';
import { useTieuDeTrang } from '../hooks/useTieuDeTrang';
import { locBacSi, type BoLocChuyenKhoa } from '../logic/loc-bac-si';
import { guiYeuCauDatLich } from '../logic/gui-dat-lich';
import { doiYeuThich } from '../logic/yeu-thich';
import { ChiTietBacSi } from './ChiTietBacSi';
import { ChipChuyenKhoa } from './ChipChuyenKhoa';
import { FormDatLich } from './FormDatLich';
import { DanhSachBacSi } from './DanhSachBacSi';
import { OTimBacSi } from './OTimBacSi';

export function KhuBacSi() {
  // ● Bốn mẩu state — mỗi mẩu là thứ NGƯỜI DÙNG đổi được, không suy ra được từ thứ khác.
  const [chuyenKhoa, setChuyenKhoa] = useState&lt;BoLocChuyenKhoa&gt;('tat-ca');
  const [tuKhoa, setTuKhoa] = useState('');
  const [bacSiDangChonId, setBacSiDangChonId] = useState&lt;string | null&gt;(null);
  const [yeuThich, setYeuThich] = useState&lt;string[]&gt;([]);

  // Dẫn xuất (tính trong lúc render) — KHÔNG cất vào state.
  // Ô tìm hiện ngay chữ vừa gõ (tuKhoa); danh sách chỉ lọc lại khi ngừng gõ 300 ms (tuKhoaCham).
  const tuKhoaCham = useDebounce(tuKhoa, 300);
  const danhSachLoc = locBacSi(danhSachBacSi, chuyenKhoa, tuKhoaCham);
  const bacSiDangChon = danhSachBacSi.find((bs) =&gt; bs.id === bacSiDangChonId) ?? null;
  useTieuDeTrang(bacSiDangChon ? &#96;&#36;{bacSiDangChon.ten} · Phòng khám An Tâm&#96; : 'Phòng khám An Tâm');
  const dsYeuThich = danhSachBacSi.filter((bs) =&gt; yeuThich.includes(bs.id));
  // … phần còn lại (hàm xuLyDoiYeuThich và JSX) giữ nguyên như Chương 3</code></pre>
<p><code>src/components/FormDatLich.tsx</code> (cả file)</p>
<pre><code class="language-tsx">import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch, type Control } from 'react-hook-form';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { datLichSchema, LY_DO_TOI_DA, type DatLich, type DatLichForm } from '../schema/dat-lich';
import type { BacSi } from '../types';

interface FormDatLichProps {
  bacSi: BacSi;
  /** Trả về Promise: form chờ nó xong mới mở khoá nút Gửi. Lỗi ném ra ⇒ hiện ở đầu form. */
  onGui: (duLieu: DatLich) =&gt; Promise&lt;void&gt;;
}

/** Bộ đếm ký tự tách riêng: useWatch chỉ làm component NÀY render lại mỗi phím (đo ở Bài 3.2). */
function DemKyTuLyDo({ control }: { control: Control&lt;DatLichForm, unknown, DatLich&gt; }) {
  const soKyTu = (useWatch({ control, name: 'lyDo' }) ?? '').normalize('NFC').length;
  return (
    &lt;p id="lyDo-dem" className={soKyTu &gt; LY_DO_TOI_DA ? 'dem-ky-tu vuot' : 'dem-ky-tu'}&gt;
      {soKyTu}/{LY_DO_TOI_DA}
    &lt;/p&gt;
  );
}

const RONG: DatLichForm = { benhNhan: { hoTen: '', soDienThoai: '', ngaySinh: '' }, lyDo: '' };

export function FormDatLich({ bacSi, onGui }: FormDatLichProps) {
  // Bản nháp riêng cho từng bác sĩ; đọc MỘT lần khi form được tạo (form có key={bacSi.id}).
  const [banNhap, setBanNhap, xoaBanNhap] = useLocalStorage&lt;DatLichForm&gt;(&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;, RONG);
  const {
    register,
    handleSubmit,
    setError,
    control,
    subscribe,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(datLichSchema),
    defaultValues: banNhap,
    mode: 'onTouched', // lỗi hiện khi rời ô lần đầu, rồi cập nhật theo từng phím
  });

  // Đồng bộ với một hệ thống NGOÀI React (kho giá trị của React Hook Form): đăng ký nghe, và huỷ khi gỡ.
  useEffect(() =&gt; {
    const huy = subscribe({
      formState: { values: true },
      callback: ({ values }) =&gt; setBanNhap(values),
    });
    return huy;
  }, [subscribe, setBanNhap]);

  // Chỉ cần biết "lúc MỞ form có bản nháp không" ⇒ khởi tạo lười một lần, không cập nhật theo từng phím.
  const [daKhoiPhuc] = useState(() =&gt; banNhap.benhNhan.hoTen !== '' || banNhap.lyDo !== '');

  async function guiDi(duLieu: DatLich) {
    try {
      await onGui(duLieu);
      xoaBanNhap(); // gửi xong thì bản nháp hết tác dụng
    } catch (loi) {
      setError('root.server', { message: loi instanceof Error ? loi.message : 'Gửi không thành công, thử lại sau' });
    }
  }

  const e = errors.benhNhan;

  if (isSubmitSuccessful &amp;&amp; !errors.root) {
    return (
      &lt;p className="gui-xong" role="status"&gt;
        Đã gửi yêu cầu đặt lịch với {bacSi.ten}. Phòng khám sẽ gọi lại để xác nhận.
      &lt;/p&gt;
    );
  }

  return (
    &lt;form className="form-dat-lich" onSubmit={handleSubmit(guiDi)} noValidate aria-label={&#96;Đặt lịch với &#36;{bacSi.ten}&#96;}&gt;
      &lt;h3&gt;Đặt lịch với {bacSi.ten}&lt;/h3&gt;
      {daKhoiPhuc &amp;&amp; &lt;p className="ban-nhap"&gt;Đã khôi phục bản nháp — tự lưu trên máy này.&lt;/p&gt;}
      {errors.root?.server &amp;&amp; (
        &lt;p className="loi-chung" role="alert"&gt;
          {errors.root.server.message}
        &lt;/p&gt;
      )}

      &lt;label htmlFor="hoTen"&gt;Họ và tên&lt;/label&gt;
      &lt;input
        id="hoTen"
        autoComplete="name"
        aria-invalid={e?.hoTen ? true : undefined}
        aria-describedby={e?.hoTen ? 'hoTen-loi' : undefined}
        {...register('benhNhan.hoTen')}
      /&gt;
      {e?.hoTen &amp;&amp; &lt;p id="hoTen-loi" className="loi"&gt;{e.hoTen.message}&lt;/p&gt;}

      &lt;label htmlFor="soDienThoai"&gt;Số điện thoại&lt;/label&gt;
      &lt;input
        id="soDienThoai"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        aria-invalid={e?.soDienThoai ? true : undefined}
        aria-describedby={e?.soDienThoai ? 'soDienThoai-loi' : undefined}
        {...register('benhNhan.soDienThoai')}
      /&gt;
      {e?.soDienThoai &amp;&amp; &lt;p id="soDienThoai-loi" className="loi"&gt;{e.soDienThoai.message}&lt;/p&gt;}

      &lt;label htmlFor="ngaySinh"&gt;Ngày sinh&lt;/label&gt;
      &lt;input
        id="ngaySinh"
        type="date"
        aria-invalid={e?.ngaySinh ? true : undefined}
        aria-describedby={e?.ngaySinh ? 'ngaySinh-loi' : undefined}
        {...register('benhNhan.ngaySinh')}
      /&gt;
      {e?.ngaySinh &amp;&amp; &lt;p id="ngaySinh-loi" className="loi"&gt;{e.ngaySinh.message}&lt;/p&gt;}

      &lt;label htmlFor="lyDo"&gt;Lý do khám&lt;/label&gt;
      &lt;textarea
        id="lyDo"
        rows={3}
        aria-invalid={errors.lyDo ? true : undefined}
        aria-describedby={errors.lyDo ? 'lyDo-loi lyDo-dem' : 'lyDo-dem'}
        {...register('lyDo')}
      /&gt;
      &lt;DemKyTuLyDo control={control} /&gt;
      {errors.lyDo &amp;&amp; &lt;p id="lyDo-loi" className="loi"&gt;{errors.lyDo.message}&lt;/p&gt;}

      &lt;button type="submit" className="nut nut-chinh" disabled={isSubmitting}&gt;
        {isSubmitting ? 'Đang gửi…' : 'Gửi yêu cầu'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p><code>src/App.css</code> — thêm vào cuối:</p>
<pre><code class="language-css">/* ── Chương 4: đồng hồ mở cửa ── */
.trang-thai-mo { margin: 0 0 0 auto; padding: 4px 12px; border-radius: 999px; font-size: 14px; font-weight: 600; background: rgba(255, 255, 255, .16); }
.trang-thai-mo.mo span { color: #86efac; }
.trang-thai-mo.dong span { color: #fda4af; }
.ban-nhap { margin: 0 0 4px; font-size: 13px; color: var(--nhat); }</code></pre>
<p><code>src/test/setup.ts</code></p>
<pre><code class="language-ts">import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest mặc định globals: false ⇒ Testing Library KHÔNG tự dọn DOM sau mỗi test.
// Không có dòng này, test sau thấy cả những gì test trước đã vẽ.
afterEach(() =&gt; {
  cleanup();
  // Chương 4: localStorage của jsdom sống suốt một file test ⇒ bản nháp của test trước
  // sẽ "khôi phục" vào test sau. Dọn sau mỗi test.
  localStorage.clear();
});</code></pre>
<p><code>src/hooks/useDebounce.test.ts</code></p>
<pre><code class="language-ts">import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useDebounce } from './useDebounce';

afterEach(() =&gt; {
  vi.useRealTimers();
});

test('gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối', () =&gt; {
  vi.useFakeTimers();
  const daThay: string[] = [];
  const { result, rerender } = renderHook(({ chu }) =&gt; useDebounce(chu, 300), { initialProps: { chu: '' } });
  daThay.push(result.current);
  let dangGo = '';
  for (const phim of 'nguyen') {
    dangGo += phim;
    rerender({ chu: dangGo });
    act(() =&gt; vi.advanceTimersByTime(100));
    daThay.push(result.current);
  }
  console.log('sau từng phím:', JSON.stringify(daThay));
  act(() =&gt; vi.advanceTimersByTime(200));
  console.log('thêm 200 ms  :', JSON.stringify(result.current));
  expect(result.current).toBe('nguyen');
  expect(new Set(daThay)).toEqual(new Set(['']));
});

test('đổi treMs cũng đặt lại hẹn giờ', () =&gt; {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ chu, tre }) =&gt; useDebounce(chu, tre), { initialProps: { chu: 'a', tre: 300 } });
  rerender({ chu: 'ab', tre: 1000 });
  act(() =&gt; vi.advanceTimersByTime(999));
  expect(result.current).toBe('a');
  act(() =&gt; vi.advanceTimersByTime(1));
  expect(result.current).toBe('ab');
});</code></pre>
<p><code>src/hooks/useLocalStorage.test.ts</code></p>
<pre><code class="language-ts">import { act, renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

test('chưa có gì trong kho ⇒ giá trị mặc định; đặt giá trị ⇒ ghi JSON vào localStorage', () =&gt; {
  const { result } = renderHook(() =&gt; useLocalStorage('thu', { lyDo: '' }));
  expect(result.current[0]).toEqual({ lyDo: '' });
  act(() =&gt; result.current[1]({ lyDo: 'đau đầu' }));
  expect(localStorage.getItem('thu')).toBe('{"lyDo":"đau đầu"}');
});

test('đã có trong kho ⇒ đọc ra ngay lần render đầu', () =&gt; {
  localStorage.setItem('thu', '{"lyDo":"sốt"}');
  const { result } = renderHook(() =&gt; useLocalStorage('thu', { lyDo: '' }));
  expect(result.current[0]).toEqual({ lyDo: 'sốt' });
});

test('JSON hỏng ⇒ không sập, dùng giá trị mặc định', () =&gt; {
  localStorage.setItem('thu', '{hỏng');
  const { result } = renderHook(() =&gt; useLocalStorage('thu', 42));
  expect(result.current[0]).toBe(42);
});

test('hàm xoá bỏ bản lưu', () =&gt; {
  const { result } = renderHook(() =&gt; useLocalStorage('thu', 'x'));
  act(() =&gt; result.current[2]());
  expect(localStorage.getItem('thu')).toBeNull();
});

test('hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE', () =&gt; {
  const a = renderHook(() =&gt; useLocalStorage('chung', 0));
  const b = renderHook(() =&gt; useLocalStorage('chung', 0));
  act(() =&gt; a.result.current[1](5));
  console.log(&#96;A thấy &#36;{a.result.current[0]} · B thấy &#36;{b.result.current[0]} · localStorage = &#36;{localStorage.getItem('chung')}&#96;);
  expect(b.result.current[0]).toBe(0);
});</code></pre>
<p><code>src/logic/gio-mo-cua.test.ts</code></p>
<pre><code class="language-ts">import { expect, test } from 'vitest';
import { dangMoCua } from './gio-mo-cua';

// new Date(năm, THÁNG-TỪ-0, ngày, giờ, phút): tháng 8 = tháng 9. 28/09/2026 là Thứ 2.
test.each([
  ['Thứ 2, 07:29', false, new Date(2026, 8, 28, 7, 29)],
  ['Thứ 2, 07:30', true, new Date(2026, 8, 28, 7, 30)],
  ['Thứ 2, 16:59', true, new Date(2026, 8, 28, 16, 59)],
  ['Thứ 2, 17:00', false, new Date(2026, 8, 28, 17, 0)],
  ['Thứ 7, 10:00', true, new Date(2026, 9, 3, 10, 0)],
  ['Chủ nhật, 10:00', false, new Date(2026, 9, 4, 10, 0)],
])('%s ⇒ mở cửa: %s', (_ten, mong, luc) =&gt; {
  expect(dangMoCua(luc)).toBe(mong);
});</code></pre>
<p><code>src/components/KhuBacSi.test.tsx</code> — hai test tìm kiếm giờ chờ (<code>expect(await screen.findByText('Đang hiện 1/6 bác sĩ'))</code> và <code>expect(await screen.findByText('Không tìm thấy bác sĩ phù hợp.'))</code>), và thêm hai test ở cuối:</p>
<pre><code class="language-tsx">test('Chương 4 — tiêu đề tab theo bác sĩ đang xem, đóng thì trả lại', async () =&gt; {
  const user = userEvent.setup();
  document.title = 'Phòng khám An Tâm';
  render(&lt;KhuBacSi /&gt;);
  await user.click(screen.getByRole('button', { name: 'Xem chi tiết BS. Vũ Thảo Vy' }));
  expect(document.title).toBe('BS. Vũ Thảo Vy · Phòng khám An Tâm');
  await user.click(screen.getByRole('button', { name: 'Đóng' }));
  expect(document.title).toBe('Phòng khám An Tâm');
});

test('Chương 4 — ô tìm hiện chữ ngay, danh sách chờ ngừng gõ rồi mới lọc', async () =&gt; {
  const user = userEvent.setup();
  render(&lt;KhuBacSi /&gt;);
  await user.type(screen.getByLabelText('Tìm theo tên'), 'huy');
  expect(screen.getByLabelText('Tìm theo tên')).toHaveValue('huy');
  expect(screen.getByText('Đang hiện 6/6 bác sĩ')).toBeInTheDocument(); // chưa lọc
  expect(await screen.findByText('Đang hiện 1/6 bác sĩ')).toBeInTheDocument(); // ~300 ms sau
});</code></pre>
<p><code>src/components/FormDatLich.test.tsx</code> — thêm hai test ở cuối:</p>
<pre><code class="language-tsx">test('Chương 4 — bản nháp: gõ dở, đóng form, mở lại ⇒ chữ còn; gửi xong ⇒ bản nháp bị xoá', async () =&gt; {
  const user = userEvent.setup();
  const lan1 = render(&lt;FormDatLich bacSi={bacSi} onGui={async () =&gt; {}} /&gt;);
  expect(screen.queryByText(/Đã khôi phục bản nháp/)).not.toBeInTheDocument();
  await user.type(screen.getByLabelText('Họ và tên'), 'Lê Văn Tám');
  expect(screen.queryByText(/Đã khôi phục bản nháp/)).not.toBeInTheDocument(); // đang gõ ≠ khôi phục
  await user.type(screen.getByLabelText('Lý do khám'), 'Ho kéo dài');
  lan1.unmount();
  const lan2 = render(&lt;FormDatLich bacSi={bacSi} onGui={async () =&gt; {}} /&gt;);
  expect(screen.getByLabelText('Họ và tên')).toHaveValue('Lê Văn Tám');
  expect(screen.getByText('Đã khôi phục bản nháp — tự lưu trên máy này.')).toBeInTheDocument();
  await user.type(screen.getByLabelText('Số điện thoại'), '0912345678');
  await user.type(screen.getByLabelText('Ngày sinh'), '1990-05-12');
  await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Đã gửi yêu cầu đặt lịch');
  expect(localStorage.getItem(&#96;ban-nhap-dat-lich:&#36;{bacSi.id}&#96;)).toBeNull();
  lan2.unmount();
});

test('Chương 4 — bản nháp tách theo bác sĩ', async () =&gt; {
  const user = userEvent.setup();
  const a = render(&lt;FormDatLich bacSi={bacSi} onGui={async () =&gt; {}} /&gt;);
  await user.type(screen.getByLabelText('Họ và tên'), 'Lê Văn Tám');
  a.unmount();
  render(&lt;FormDatLich bacSi={danhSachBacSi[0]} onGui={async () =&gt; {}} /&gt;);
  expect(screen.getByLabelText('Họ và tên')).toHaveValue('');
});</code></pre>
<p>Lần chạy đầy đủ, rút gọn còn các test mới và test đã sửa:</p>
<div class="out">$ npx vitest run --reporter=verbose
 ✓ src/components/KhuBacSi.test.tsx &gt; gõ "lan" (không dấu) ⇒ tìm ra BS. Phạm Ngọc Lan
 ✓ src/components/KhuBacSi.test.tsx &gt; không khớp ⇒ thông báo rỗng
 ✓ src/components/FormDatLich.test.tsx &gt; đếm ký tự lý do theo NFC; vượt 500 ⇒ lỗi
 ✓ src/components/FormDatLich.test.tsx &gt; Chương 4 — bản nháp: gõ dở, đóng form, mở lại ⇒ chữ còn; gửi xong ⇒ bản nháp bị xoá
 ✓ src/components/FormDatLich.test.tsx &gt; Chương 4 — bản nháp tách theo bác sĩ
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; 07:29 Thứ 2 đang đóng; 60 giây sau tự chuyển sang mở, không cần tải lại
 ✓ src/components/TrangThaiMoCua.test.tsx &gt; gỡ component ⇒ không còn hẹn giờ nào chạy
 ✓ src/hooks/useDebounce.test.ts &gt; gõ "nguyen" mỗi phím cách 100 ms: chỉ ra MỘT giá trị mới, 300 ms sau phím cuối
 ✓ src/hooks/useDebounce.test.ts &gt; đổi treMs cũng đặt lại hẹn giờ
 ✓ src/hooks/useLocalStorage.test.ts &gt; chưa có gì trong kho ⇒ giá trị mặc định; đặt giá trị ⇒ ghi JSON vào localStorage
 ✓ src/hooks/useLocalStorage.test.ts &gt; đã có trong kho ⇒ đọc ra ngay lần render đầu
 ✓ src/hooks/useLocalStorage.test.ts &gt; JSON hỏng ⇒ không sập, dùng giá trị mặc định
 ✓ src/hooks/useLocalStorage.test.ts &gt; hàm xoá bỏ bản lưu
 ✓ src/hooks/useLocalStorage.test.ts &gt; hai component cùng khoá: hook chia sẻ LOGIC, không chia sẻ STATE
 ✓ src/components/KhuBacSi.test.tsx &gt; Chương 4 — tiêu đề tab theo bác sĩ đang xem, đóng thì trả lại
 ✓ src/components/KhuBacSi.test.tsx &gt; Chương 4 — ô tìm hiện chữ ngay, danh sách chờ ngừng gõ rồi mới lọc
 ✓ src/hooks/useTieuDeTrang.test.ts &gt; đặt tiêu đề, đổi theo tham số, gỡ thì trả tiêu đề cũ
 ✓ src/logic/gio-mo-cua.test.ts &gt; Thứ 2, 07:29 ⇒ mở cửa: false
 …
 Test Files  11 passed (11)
      Tests  46 passed (46)</div>
</details>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">custom hook (hook tự viết)</span><span class="v">hàm tên <code>use…</code> gọi các hook khác để tái sử dụng logic có state</span></div>
<div class="kv"><span class="k">quy tắc hook (rules of hooks)</span><span class="v">gọi hook ở cấp cao nhất, chỉ từ component hoặc hook — React theo dõi chúng theo thứ tự gọi</span></div>
<div class="kv"><span class="k">debounce (chống dội)</span><span class="v">chỉ dùng một giá trị sau khi nó ngừng đổi được một khoảng thời gian</span></div>
<div class="kv"><span class="k"><code>renderHook</code></span><span class="v">hàm của Testing Library chạy một hook trong component ẩn; <code>result.current</code> là giá trị trả về mới nhất</span></div>
<div class="kv"><span class="k">đồng hồ giả (fake timers)</span><span class="v"><code>vi.useFakeTimers()</code>, <code>advanceTimersByTime</code>, <code>setSystemTime</code> — thời gian chỉ trôi khi test bảo</span></div>
<div class="kv"><span class="k">khởi tạo lười (lazy initial state)</span><span class="v"><code>useState(() =&gt; …)</code>: hàm chỉ chạy ở lượt render đầu</span></div>
<div class="kv"><span class="k"><code>localStorage</code></span><span class="v">kho chuỗi khoá–giá trị của trình duyệt, sống qua tải lại trang; mọi script trên trang đều đọc được</span></div>
<div class="kv"><span class="k">subscribe / unsubscribe (đăng ký / huỷ nghe)</span><span class="v">bắt đầu nghe một kho bên ngoài và ngừng nghe — chính là setup và cleanup của một effect</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hook tự viết là hàm <code>use…</code> gọi hook; nó chia sẻ logic, không chia sẻ state — hai bên gọi đo được "A thấy 5 · B thấy 0".</li>
<li><code>useTieuDeTrang</code> trả lại tiêu đề cũ trong cleanup; đã kiểm trên tab thật trước và sau khi tải lại.</li>
<li><code>useDebounce</code> giữ output là "" suốt sáu phím gõ nhanh và cho ra "nguyen" một lần, 300 ms sau phím cuối.</li>
<li><code>useLocalStorage</code> đọc một lần kiểu lười, ghi trong effect, chịu được kho hỏng; bản nháp đặt lịch sống sót qua một lần tải lại thật.</li>
<li><code>dangMoCua</code> thuần và test bằng ngày giờ bình thường; <code>useGioHienTai</code> là bộ hẹn giờ có cleanup (0 bộ hẹn giờ sau unmount).</li>
<li>Hook chạy theo thứ tự cố định — oxlint báo lỗi với <code>useState</code> có điều kiện; hook mới làm test cũ đỏ vì lý do thật (thời gian debounce, kho bị rò), sửa bằng <code>findBy</code> và <code>localStorage.clear()</code>.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Reusing Logic with Custom Hooks</span><span class="lc-sub">react.dev/learn/reusing-logic-with-custom-hooks — đặt tên, chia sẻ logic không chia sẻ state, khi nào tách hook.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — Rules of Hooks</span><span class="lc-sub">react.dev/reference/rules/rules-of-hooks — chỉ gọi ở cấp cao nhất, chỉ từ hàm React.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React — useState: tránh tạo lại state ban đầu</span><span class="lc-sub">react.dev/reference/react/useState — hàm khởi tạo lười mà <code>useLocalStorage</code> dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vitest — Fake timers</span><span class="lc-sub">vitest.dev/api/vi — <code>useFakeTimers</code>, <code>advanceTimersByTime</code>, <code>setSystemTime</code>, <code>getTimerCount</code>.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Chapter 4 quiz|||4.5 — Kiểm tra Chương 4',
      slug: 'rx-4-5-kiem-tra',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên đúng những gì Chương 4 đã chạy thật: thứ tự cleanup/setup, ba dạng dependency, Strict Mode chạy setup hai lần, đồng hồ thiếu cleanup, effect tính dữ liệu dẫn xuất, reset bằng key, gửi trong effect khi đổi tab, object làm dependency, closure cũ, và hook không chia sẻ state.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>What Chapter 4 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Every answer comes from something the chapter actually ran — a Vitest log, a count in real Chromium, an oxlint warning — not from a definition. Many wrong options are what a reasonable person predicts before running the code: that is exactly why effects cause bugs.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say when an effect runs relative to render and commit, and what each of the three dependency-array forms does.</li>
<li>I can write a cleanup for a timer, a listener or a subscription, and explain why Strict Mode runs setup → cleanup → setup in development.</li>
<li>I can spot an effect that should be a calculation during render, a <code>key</code>, or an event handler.</li>
<li>I can explain the race condition when fetching in an effect and the minimum fix.</li>
<li>I can find why an effect loops forever or reads a stale value, and fix it without silencing the linter.</li>
<li>I can write and test a custom hook (<code>useDebounce</code>, <code>useLocalStorage</code>) and state the rules of hooks.</li>
</ul>
${slide('rx-04', 28, 'Chapter 4 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Chương 4 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Đáp án nào cũng lấy từ một thứ chương này đã chạy thật — một nhật ký Vitest, một con số đếm trong Chromium thật, một cảnh báo oxlint — không phải từ định nghĩa. Nhiều phương án sai chính là điều một người hợp lý sẽ đoán trước khi chạy code: đó cũng chính là lý do effect hay sinh bug.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được effect chạy lúc nào so với render và commit, và ba dạng mảng dependency khác nhau ra sao.</li>
<li>Tôi viết được cleanup cho một bộ hẹn giờ, một listener hay một đăng ký nghe, và giải thích được vì sao Strict Mode chạy setup → cleanup → setup lúc phát triển.</li>
<li>Tôi nhận ra được effect nào lẽ ra phải là phép tính trong render, một <code>key</code>, hay một handler sự kiện.</li>
<li>Tôi giải thích được cuộc đua dữ liệu khi fetch trong effect và cách sửa tối thiểu.</li>
<li>Tôi tìm được vì sao một effect lặp vô hạn hoặc đọc giá trị cũ, và sửa được mà không tắt linter.</li>
<li>Tôi viết và test được một hook tự viết (<code>useDebounce</code>, <code>useLocalStorage</code>) và nêu được quy tắc hook.</li>
</ul>
${slide('rx-04', 28, 'Bảng tra nhanh Chương 4')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'TieuDeBacSi logs "render", "effect: …" and "cleanup: …" and has useEffect(…, [ten]). It is shown with ten = "BS. Nguyễn Minh An", then re-rendered with ten = "BS. Trần Thu Hà" (no Strict Mode). Which line is logged right after "render (BS. Trần Thu Hà)"?|||TieuDeBacSi ghi nhật ký "render", "effect: …" và "cleanup: …", có useEffect(…, [ten]). Nó hiện với ten = "BS. Nguyễn Minh An", rồi vẽ lại với ten = "BS. Trần Thu Hà" (không Strict Mode). Dòng nào được ghi ngay sau "render (BS. Trần Thu Hà)"?',
            options: [
              'effect: đặt tiêu đề "BS. Trần Thu Hà" — the new effect runs first, then the old cleanup|||effect: đặt tiêu đề "BS. Trần Thu Hà" — effect mới chạy trước, cleanup cũ chạy sau',
              'cleanup: dọn tiêu đề "BS. Trần Thu Hà" — the cleanup sees the new name|||cleanup: dọn tiêu đề "BS. Trần Thu Hà" — cleanup thấy tên mới',
              'cleanup: dọn tiêu đề "BS. Nguyễn Minh An"|||cleanup: dọn tiêu đề "BS. Nguyễn Minh An"',
              'Nothing: an effect with a dependency array only runs on mount and unmount|||Không gì cả: effect có mảng dependency chỉ chạy lúc mount và unmount',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The chapter’s log was: render (Hà) → cleanup: dọn tiêu đề "BS. Nguyễn Minh An" → effect: đặt tiêu đề "BS. Trần Thu Hà". React always runs the previous cleanup before the next setup, and each cleanup belongs to its own render, so it still sees the old name. The "mount/unmount only" option describes lifecycle thinking; with [ten], the pair runs again whenever ten changes.|||VI: Nhật ký của chương là: render (Hà) → cleanup: dọn tiêu đề "BS. Nguyễn Minh An" → effect: đặt tiêu đề "BS. Trần Thu Hà". React luôn chạy cleanup trước đó rồi mới setup lần kế, và mỗi cleanup thuộc về lượt render của nó nên vẫn thấy tên cũ. Phương án "chỉ mount/unmount" là lối nghĩ lifecycle; với [ten], cặp setup/cleanup chạy lại mỗi khi ten đổi.',
          },
          {
            question: 'A component has three effects: one with no array, one with [], one with [bacSiId]. It is shown once, then re-rendered three times with bacSiId = bs-1, bs-2, bs-2 (it started as bs-1). How many times did each effect run?|||Một component có ba effect: một không có mảng, một với [], một với [bacSiId]. Nó hiện một lần, rồi vẽ lại ba lần với bacSiId = bs-1, bs-2, bs-2 (ban đầu là bs-1). Mỗi effect chạy bao nhiêu lần?',
            options: [
              'no array 4 · [] 1 · [bacSiId] 2|||không mảng 4 · [] 1 · [bacSiId] 2',
              'no array 1 · [] 4 · [bacSiId] 2|||không mảng 1 · [] 4 · [bacSiId] 2',
              'no array 4 · [] 0 · [bacSiId] 1|||không mảng 4 · [] 0 · [bacSiId] 1',
              'no array 4 · [] 1 · [bacSiId] 4|||không mảng 4 · [] 1 · [bacSiId] 4',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The test printed "không mảng: 4 lần · [] : 1 lần · [bacSiId]: 2 lần". No array = after every render (1 + 3). [] = only after the first display — it is not 0, because the first display counts. [bacSiId] = the first display plus the one render where bs-1 became bs-2; the renders that kept the same id were skipped even though another prop changed.|||VI: Test in ra "không mảng: 4 lần · [] : 1 lần · [bacSiId]: 2 lần". Không mảng = sau mọi lượt render (1 + 3). [] = chỉ sau lần hiện đầu — không phải 0, vì lần hiện đầu có tính. [bacSiId] = lần hiện đầu cộng lượt render mà bs-1 thành bs-2; các lượt giữ nguyên id bị bỏ qua dù prop khác có đổi.',
          },
          {
            question: 'In development, inside <StrictMode>, a component with useEffect(() => { console.log("effect: kết nối…"); return () => console.log("cleanup: ngắt…"); }, [bacSi]) appears for the first time. What does the Chromium console show?|||Lúc phát triển, trong <StrictMode>, một component có useEffect(() => { console.log("effect: kết nối…"); return () => console.log("cleanup: ngắt…"); }, [bacSi]) hiện lần đầu. Console Chromium hiện gì?',
            options: [
              'effect once — Strict Mode only doubles rendering, not effects|||effect một lần — Strict Mode chỉ gấp đôi render, không đụng effect',
              'effect, effect — two setups, no cleanup|||effect, effect — hai lần setup, không có cleanup',
              'cleanup, effect — React cleans first to be safe|||cleanup, effect — React dọn trước cho chắc',
              'effect, cleanup, effect|||effect, cleanup, effect',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The real Chromium log was effect → cleanup → effect for BS. Nguyễn Minh An, then, after the click, cleanup (An) → effect (Hà). Strict Mode simulates an unmount and remount once to check that the cleanup undoes the setup. "effect, effect" is what you would see in a component that has no cleanup — it is the bug Strict Mode exposes, not what React does. Production runs the effect once.|||VI: Nhật ký Chromium thật là effect → cleanup → effect cho BS. Nguyễn Minh An, rồi sau cú bấm là cleanup (An) → effect (Hà). Strict Mode giả lập một lần gỡ rồi gắn lại để kiểm cleanup có hoàn tác setup không. "effect, effect" là thứ bạn thấy ở component thiếu cleanup — đó là bug Strict Mode làm lộ ra, không phải việc React làm. Production chạy effect một lần.',
          },
          {
            question: 'A clock uses useEffect(() => { setInterval(() => setGiay((g) => g + 1), 1000); }, []) with no cleanup, inside <StrictMode> in development. What does it show after 3 seconds?|||Một đồng hồ dùng useEffect(() => { setInterval(() => setGiay((g) => g + 1), 1000); }, []) không có cleanup, trong <StrictMode> lúc phát triển. Sau 3 giây nó hiện gì?',
            options: [
              '3 giây — the [] array makes the effect run only once|||3 giây — mảng [] làm effect chỉ chạy một lần',
              '6 giây|||6 giây',
              '1 giây — a stale closure freezes it|||1 giây — closure cũ làm nó đứng im',
              'It throws "Maximum update depth exceeded"|||Nó ném lỗi "Maximum update depth exceeded"',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured: "Thiếu cleanup: 6 giây | lần tích: 6". Strict Mode ran the setup twice; with no cleanup the first interval was never cleared, so two intervals tick. After unmounting, they even kept ticking (12 in total). "1 giây" would be the stale-closure version setGiay(giay + 1); this one uses the function form, so each tick really adds 1 — twice per second.|||VI: Đo được: "Thiếu cleanup: 6 giây | lần tích: 6". Strict Mode chạy setup hai lần; không có cleanup nên interval đầu không bao giờ bị xoá, hai interval cùng tích. Gỡ component rồi chúng vẫn tích (tổng 12). "1 giây" là bản closure cũ setGiay(giay + 1); bản này dùng dạng hàm nên mỗi lần tích thật sự cộng 1 — hai lần mỗi giây.',
          },
          {
            question: 'A filter keeps the result in a second state updated by useEffect(() => setKetQua(locBacSi(ds, "tat-ca", tuKhoa)), [tuKhoa]). The user types "l". Which render does the chapter’s log show?|||Một bộ lọc giữ kết quả trong state thứ hai, cập nhật bằng useEffect(() => setKetQua(locBacSi(ds, "tat-ca", tuKhoa)), [tuKhoa]). Người dùng gõ "l". Nhật ký của chương có lượt render nào?',
            options: [
              'Only tuKhoa="l" → 2 bác sĩ, the same as calculating in render|||Chỉ tuKhoa="l" → 2 bác sĩ, y như tính trong render',
              'tuKhoa="" → 2 bác sĩ: the list changes before the input|||tuKhoa="" → 2 bác sĩ: danh sách đổi trước ô input',
              'tuKhoa="l" → 6 bác sĩ, then tuKhoa="l" → 2 bác sĩ|||tuKhoa="l" → 6 bác sĩ, rồi tuKhoa="l" → 2 bác sĩ',
              'No re-render: setState inside an effect is ignored|||Không vẽ lại: setState trong effect bị bỏ qua',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The input state changes first, React renders and commits with the old list (tuKhoa="l" → hiện 6 bác sĩ), then the effect sets the new list and React renders again (→ 2). The effect version rendered 6 times for two keystrokes against 3 for the calculated version, and oxlint flags it as set-state-in-effect. Calculating in render produces only the correct render.|||VI: State của ô input đổi trước, React render và commit với danh sách cũ (tuKhoa="l" → hiện 6 bác sĩ), rồi effect đặt danh sách mới và React render lần nữa (→ 2). Bản effect render 6 lần cho hai phím, so với 3 lần của bản tính trong render, và oxlint đánh dấu nó là set-state-in-effect. Tính trong render chỉ cho ra lượt render đúng.',
          },
          {
            question: 'The note box must be empty whenever the receptionist switches to another doctor. Which approach avoids ever rendering the new doctor with the previous doctor’s note?|||Ô ghi chú phải trống mỗi khi lễ tân chuyển sang bác sĩ khác. Cách nào không bao giờ vẽ bác sĩ mới kèm ghi chú của bác sĩ trước?',
            options: [
              'Render <GhiChu key={bacSi.id} bacSi={bacSi} /> in the parent|||Vẽ <GhiChu key={bacSi.id} bacSi={bacSi} /> ở component cha',
              'useEffect(() => setGhiChu(""), [bacSi.id]) inside GhiChu|||useEffect(() => setGhiChu(""), [bacSi.id]) bên trong GhiChu',
              'useEffect(() => setGhiChu(""), []) inside GhiChu|||useEffect(() => setGhiChu(""), []) bên trong GhiChu',
              'Wrap GhiChu in <StrictMode> so it mounts twice|||Bọc GhiChu trong <StrictMode> để nó mount hai lần',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: With the effect, the log showed "[effect] vẽ BS. Trần Thu Hà với ghi chú "dị ứng"" before the clearing render — one render with the old note. A different key makes React treat it as a new component with fresh state, so the first render is already empty. [] would clear only once at mount, not on later switches; Strict Mode changes nothing in production.|||VI: Với effect, nhật ký có "[effect] vẽ BS. Trần Thu Hà với ghi chú "dị ứng"" trước lượt xoá — một lượt render mang ghi chú cũ. Key khác khiến React coi đó là component mới với state mới, nên lượt render đầu đã trống. [] chỉ xoá một lần lúc mount, không xoá ở những lần chuyển sau; Strict Mode không đổi gì trên production.',
          },
          {
            question: 'A booking request is sent by useEffect(() => { if (daGui) gui(); }, [daGui]), with daGui kept in the parent. In development (Strict Mode) the user clicks Send once, switches to another tab and back. How many requests were sent in the chapter’s test?|||Yêu cầu đặt lịch được gửi bởi useEffect(() => { if (daGui) gui(); }, [daGui]), daGui giữ ở component cha. Lúc phát triển (Strict Mode), người dùng bấm Gửi một lần, chuyển sang tab khác rồi quay lại. Test của chương gửi bao nhiêu yêu cầu?',
            options: [
              '1 — the dependency did not change after the click|||1 — dependency không đổi sau cú bấm',
              '3|||3',
              '2 — Strict Mode doubles the click|||2 — Strict Mode nhân đôi cú bấm',
              '0 — effects do not run when the component is hidden|||0 — effect không chạy khi component bị ẩn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Right after the click both versions had sent once. Coming back to the tab mounted the component again with daGui = true, so the effect sent again, and Strict Mode’s setup → cleanup → setup at that mount sent once more: "effect gửi 3 lần · handler gửi 1 lần" (2 without Strict Mode). An effect answers "what must be true while this is shown", so it repeats on every mount; work caused by a click belongs in the handler.|||VI: Ngay sau cú bấm cả hai bản đều gửi một lần. Quay lại tab làm component mount lại với daGui = true, nên effect gửi lần nữa, và setup → cleanup → setup của Strict Mode ở lần mount đó gửi thêm một lần: "effect gửi 3 lần · handler gửi 1 lần" (2 khi không có Strict Mode). Effect trả lời "điều gì phải đúng trong lúc thứ này đang hiện", nên nó lặp lại mỗi lần mount; việc do cú bấm gây ra thuộc về handler.',
          },
          {
            question: 'const boLoc = { chuyenKhoa, tuKhoa: "" }; useEffect(() => { setKetQua(locBacSi(ds, boLoc.chuyenKhoa, boLoc.tuKhoa)); }, [boLoc]); — rendered with chuyenKhoa = "nhi" in Chromium, nobody clicks. What did the chapter observe after 3 seconds?|||const boLoc = { chuyenKhoa, tuKhoa: "" }; useEffect(() => { setKetQua(locBacSi(ds, boLoc.chuyenKhoa, boLoc.tuKhoa)); }, [boLoc]); — vẽ với chuyenKhoa = "nhi" trong Chromium, không ai bấm gì. Sau 3 giây chương quan sát thấy gì?',
            options: [
              'The page crashed with a blank screen and an error overlay|||Trang sập, màn hình trắng kèm lớp báo lỗi',
              '"2 bác sĩ", and the effect ran exactly once because the contents never change|||"2 bác sĩ", và effect chạy đúng một lần vì nội dung không bao giờ đổi',
              '"6 bác sĩ" — the filter never applied|||"6 bác sĩ" — bộ lọc không bao giờ được áp dụng',
              '"2 bác sĩ" on screen while console.error kept growing (945 after 3 s)|||Màn hình hiện "2 bác sĩ" trong khi console.error cứ tăng (945 sau 3 giây)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Each render creates a new object, and Object.is compares references, so [boLoc] "changed" every time; the effect set a new array, which rendered again — an infinite loop. React logged "Maximum update depth exceeded" hundreds of times but did not crash, and the screen looked correct. Depend on the primitive chuyenKhoa, useMemo the object, or better, calculate the list during render.|||VI: Mỗi lượt render tạo một object mới, và Object.is so tham chiếu, nên [boLoc] lần nào cũng "đổi"; effect đặt một mảng mới, lại render — vòng lặp vô hạn. React ghi "Maximum update depth exceeded" hàng trăm lần nhưng không sập, và màn hình trông vẫn đúng. Hãy phụ thuộc vào giá trị nguyên thuỷ chuyenKhoa, useMemo object, hoặc tốt hơn, tính danh sách trong render.',
          },
          {
            question: 'useEffect(() => { const id = setInterval(() => setGiay(giay + 1), 1000); return () => clearInterval(id); }, []); — what does the component show after 5 seconds?|||useEffect(() => { const id = setInterval(() => setGiay(giay + 1), 1000); return () => clearInterval(id); }, []); — sau 5 giây component hiện gì?',
            options: [
              '5 giây — the interval runs five times|||5 giây — interval chạy năm lần',
              '10 giây — Strict Mode doubles it|||10 giây — Strict Mode nhân đôi',
              '1 giây|||1 giây',
              'It loops forever, because setGiay is called inside an effect|||Lặp vô hạn, vì setGiay được gọi trong effect',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured "Cũ: 1 giây | Mới: 5 giây". The interval callback was created in the first render and closed over giay = 0, so every tick sets 0 + 1: a stale closure. The function form setGiay((g) => g + 1) reads the latest value and showed 5. It does not loop: the dependency array is [] and the cleanup clears the interval.|||VI: Đo được "Cũ: 1 giây | Mới: 5 giây". Callback của interval tạo ra ở lượt render đầu và đóng gói giay = 0, nên lần tích nào cũng đặt 0 + 1: closure cũ. Dạng hàm setGiay((g) => g + 1) đọc giá trị mới nhất và hiện 5. Nó không lặp: mảng dependency là [] và cleanup xoá interval.',
          },
          {
            question: 'Components A and B both call useLocalStorage("chung", 0). A calls its setter with 5. What do A, B and localStorage hold afterwards?|||Component A và B cùng gọi useLocalStorage("chung", 0). A gọi hàm đặt với giá trị 5. Sau đó A, B và localStorage chứa gì?',
            options: [
              'A 5 · B 5 · storage 5 — same key, same state|||A 5 · B 5 · kho 5 — cùng khoá thì cùng state',
              'A 5 · B 0 · storage 5|||A 5 · B 0 · kho 5',
              'A 5 · B 0 · storage empty — effects do not run in tests|||A 5 · B 0 · kho trống — effect không chạy trong test',
              'A 0 · B 0 · storage 5 — the state updates only after a reload|||A 0 · B 0 · kho 5 — state chỉ cập nhật sau khi tải lại',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The test printed "A thấy 5 · B thấy 0 · localStorage = 5". Every hook call has its own state: hooks share logic, not state. A’s effect wrote the value to storage, but nothing told B to read it again (B read storage once, lazily, when it mounted). To share one value, lift it up, use context or a store such as Zustand (Chapter 5).|||VI: Test in ra "A thấy 5 · B thấy 0 · localStorage = 5". Mỗi lần gọi hook có state riêng: hook chia sẻ logic, không chia sẻ state. Effect của A đã ghi giá trị vào kho, nhưng không gì bảo B đọc lại (B chỉ đọc kho một lần, kiểu lười, lúc mount). Muốn dùng chung một giá trị thì nâng state lên, dùng context hoặc store như Zustand (Chương 5).',
          },
        ],
      },
    },
  ],
};
