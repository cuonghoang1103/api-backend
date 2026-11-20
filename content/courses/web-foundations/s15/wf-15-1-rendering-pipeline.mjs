/**
 * Bài 15.1 — Từ HTML tới điểm ảnh: đường ống hiển thị của trình duyệt (soạn 20/11/2026).
 * Mã + output: ../_ma.mjs — 15-1/(tất cả) chạy bằng scripts/wf/chay-demo.mjs (Chromium thật),
 * _t15/chan/(tất cả) đo bằng _demo/_t15/chay.mjs (máy chủ tạm cố tình trả CSS/JS chậm 1 s, đọc first-contentful-paint).
 * Chưa có deck slide wf-15-1 (thêm walkWf khi dựng + đẩy slide).
 */
import { ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

export default {
  title: '15.1 — From HTML to pixels: how the browser draws a page|||15.1 — Từ HTML tới điểm ảnh: trình duyệt vẽ một trang thế nào',
  slug: 'wf-15-1-rendering-pipeline',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Năm bước DOM → CSSOM → layout → paint → composite; đo thật thứ gì chặn lần vẽ đầu (CSS chậm, @import nối đuôi, script đồng bộ vs defer); layout thrashing chậm gấp ~170–190 lần và cách gom đọc/ghi; requestAnimationFrame; góc hacker: script bên thứ ba (vụ polyfill.io 2024). Lab: thẻ sản phẩm cao bằng nhau.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>From HTML to pixels: what the browser does after the response arrives</h2>
<p class="lead">Lesson 0.2 followed a request until the HTML arrived. This lesson follows the HTML until it becomes pixels. After it you can name the five stages a browser goes through, explain — with measurements — why one slow stylesheet leaves the screen white while one slow deferred script does not, recognise the most common self-inflicted slowdown in front-end code (<strong>layout thrashing</strong>, measured here at roughly 170–190× slower, depending on the run), and fix it by batching reads and writes. Every "why is my page janky" question in React, every Core Web Vitals report from lesson 14.4 and every interview question about the critical rendering path sits on top of this picture.</p>

<h3>An everyday picture: printing a newspaper page</h3>
<p>Think of a newspaper layout room. The editor hands over the <strong>articles</strong> (HTML) and the <strong>style guide</strong> (CSS: fonts, column widths, colours). Nobody can decide where a column ends until both are on the desk. Then someone <strong>measures and places</strong> every block on the page (layout), someone <strong>inks</strong> it (paint), and finally the printed sheets are <strong>stacked</strong> in the right order (composite). If the style guide arrives late, the whole room waits. If an editor changes one headline and then asks "how tall is column 3 now?", the measurer must redo the page before answering — ask that question a thousand times in a row and the room grinds to a halt. That last sentence is layout thrashing.</p>

<h3>Step 1 — the five stages, in order</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Parse HTML → DOM</span><span class="lz-d">The tree of elements you met in lesson 2.1. A normal <code>&lt;script&gt;</code> pauses parsing until it is downloaded and run.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Parse CSS → CSSOM</span><span class="lz-d">The tree of style rules. The browser will not paint until the CSS that applies to the screen is ready — CSS is <strong>render-blocking</strong>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Style → render tree</span><span class="lz-d">DOM + CSSOM: the computed style of every visible box. <code>display: none</code> elements are left out entirely.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Layout</span><span class="lz-d">Geometry: the exact position and size of every box. Change a width, a font size or the text inside, and layout must run again.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Paint → composite</span><span class="lz-d">Fill pixels into layers, then stack the layers on the GPU. <code>transform</code> and <code>opacity</code> can change at this last stage only — that is why lesson 12.2 animates them.</span></div>
</div>
<p>This chain is called the <strong>critical rendering path</strong>. It runs once when the page loads, and then again — in part — every time JavaScript or CSS changes something. The skill this lesson teaches is knowing <em>which part</em> runs again, and how often.</p>

<h3>Step 2 — what really blocks the first paint (measured)</h3>
<p>To measure it, a small Node server served six tiny pages. Each page has the same heading and one paragraph; only the <code>&lt;head&gt;</code> differs. The server deliberately answers <code>/slow.css</code> and <code>/slow.js</code> after 1 second. Chromium recorded <strong>first contentful paint</strong> (the moment any text appears) and <code>DOMContentLoaded</code> (the HTML has been fully parsed). Each page was loaded three times; the median is shown, rounded to 10&nbsp;ms. Here is the slow-stylesheet page:</p>
${ma('html', CODE['_t15/chan/b-slow-css.html'])}
${ra(OUT['_t15/out/15-1-chan-ve'])}
<p>Read the table row by row, because each row is a rule you will use:</p>
<ul>
  <li><strong>b-slow-css</strong> — the text was already downloaded, yet the screen stayed white for about one second. The browser refuses to paint without the stylesheet, to avoid showing unstyled content that then jumps. Parsing was not blocked (<code>DOMContentLoaded</code> ≈ 0): CSS blocks <em>rendering</em>, not parsing.</li>
  <li><strong>c-print-css</strong> — the same slow file with <code>media="print"</code> does not block: a stylesheet whose media query does not match the screen is downloaded at low priority and does not hold the paint.</li>
  <li><strong>d-import-chain</strong> — <code>chain.css</code> (0.5&nbsp;s) contains <code>@import url("/slow.css")</code>. The browser only discovers the second file after the first one arrives, so the waits add up: about 1.5&nbsp;s. Prefer several <code>&lt;link&gt;</code> tags (downloaded in parallel) to <code>@import</code> inside CSS.</li>
  <li><strong>e-sync-script</strong> — a plain <code>&lt;script src&gt;</code> in the <code>&lt;head&gt;</code> stops the parser, so the body does not exist yet: nothing to paint for a full second, and <code>DOMContentLoaded</code> waits too.</li>
  <li><strong>f-defer-script</strong> — with <code>defer</code> the parser keeps going and the text is painted almost at once; the script still runs before <code>DOMContentLoaded</code>, which is why <code>DOMContentLoaded</code> still says about one second. Lesson 4.5 explained <em>when</em> a deferred script runs; this row shows what the user <em>sees</em> meanwhile.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — "the server is fast, so the page is fast".</strong> In rows b and e the HTML arrived in a few milliseconds and the page still showed nothing for a second. The bottleneck was one extra file the page refused to render without. When a page is slow to show anything, open the Network tab, sort by "Waterfall", and look at what is in the <code>&lt;head&gt;</code> before you blame the server.</p></div>

<h3>Step 3 — after loading: which changes cost what</h3>
<p>Once the page is on screen, every change you make from JavaScript or CSS restarts the pipeline from some stage. The later the stage, the cheaper the change.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Layout + paint + composite</span><span class="lz-t">most expensive</span><span class="lz-d">Geometry changes: <code>width</code>, <code>height</code>, <code>top</code>, <code>margin</code>, <code>font-size</code>, adding or removing elements, changing text.</span></div>
<div class="lz-layer"><span class="lz-k">Paint + composite</span><span class="lz-t">medium</span><span class="lz-d">Looks change, positions do not: <code>color</code>, <code>background</code>, <code>box-shadow</code>, <code>visibility</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Composite only</span><span class="lz-t">cheapest</span><span class="lz-d"><code>transform</code> and <code>opacity</code> (on their own layer). Lesson 12.2 measured why animations should use these.</span></div>
</div>
<p>Changing a style does not make the browser lay out immediately. It just marks the layout as <strong>dirty</strong> ("needs redoing") and keeps going; the real work happens once, right before the next frame is painted. That laziness is a big optimisation — and the next step shows how easy it is to defeat.</p>

<h3>Step 4 — layout thrashing, measured</h3>
<p>Some properties can only be answered with an up-to-date layout: <code>offsetWidth</code>, <code>offsetHeight</code>, <code>clientWidth</code>, <code>getBoundingClientRect()</code>, <code>scrollTop</code>, <code>getComputedStyle()</code> and more. If layout is dirty when you read one of them, the browser must run layout <em>right now</em>, in the middle of your script. This is called a <strong>forced synchronous layout</strong> (or forced reflow). Do it in a loop — write, read, write, read — and you force a full layout on every turn. The page below sets the width of 1,000 rows in two ways and times each one (median of 7 runs, in Chromium):</p>
${ma('html', CODE['15-1/thrash.html'], [23, 35])}
${ra(OUT['15-1/thrash'])}
<p>Both functions produce exactly the same result on screen (the last line checks it). Version A asks for <code>list.offsetWidth</code> right after a write, 1,000 times, so the browser lays out the page 1,000 times. Version B reads once, writes 1,000 times, and lets the browser lay out once at the end. On this machine the difference was about two orders of magnitude; on a cheap phone the absolute numbers are several times larger, and anything above roughly 50&nbsp;ms is a frame the user can feel as a stutter.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the read hides inside a helper.</strong> Real thrashing rarely looks as obvious as version A. It looks like <code>items.forEach(el =&gt; el.style.height = getTallest() + 'px')</code>, where <code>getTallest()</code> reads <code>offsetHeight</code> somewhere three files away, or a library call that measures the element. Rule: in any loop that writes styles, check every function it calls for a layout read. The Performance panel will tell you if you missed one (Step 6).</p></div>

<h3>Step 5 — one update per frame with requestAnimationFrame</h3>
<p>The screen refreshes about 60 times per second, so there is no point updating the DOM more often than that. Scroll, mouse-move and input events can fire many times between two frames. <code>requestAnimationFrame(callback)</code> asks the browser to run the callback just before the next paint. The pattern below remembers the newest event and schedules at most one DOM update per frame:</p>
${ma('html', CODE['15-1/raf.html'], [19, 38])}
${ra(OUT['15-1/raf'])}
<p>The direct handler touched the DOM 200 times; the batched one touched it once, and still showed the newest data (event #200). The user sees the same final screen, but the browser did a fraction of the work. This "remember the latest value, flush once per frame" pattern is what scroll-linked effects, drag-and-drop and many animation libraries do internally. (When you need to <em>wait</em> for the user to stop typing rather than limit the rate, use a debounce — React course, custom hooks lesson.)</p>

<h3>Step 6 — seeing it in DevTools</h3>
<ol>
  <li>Open the page, press F12, go to the <strong>Performance</strong> panel, click Record, do the slow action, stop.</li>
  <li>In the main-thread track, purple blocks are <strong>Layout</strong> and <strong>Recalculate Style</strong>; green blocks are <strong>Paint</strong>. A wall of thin purple slices under one JavaScript function is the signature of thrashing.</li>
  <li>Click a Layout block: Chrome marks forced layouts with a warning that the layout was forced, and links to the line of JavaScript that triggered it. That line is your read-after-write.</li>
  <li>For the first paint, use the <strong>Network</strong> panel: anything with a long bar that starts before the first paint marker and sits in the <code>&lt;head&gt;</code> is a render-blocking suspect.</li>
</ol>

<h3>When to use what</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Your own CSS</span><span class="v">One or a few <code>&lt;link rel="stylesheet"&gt;</code> in the head. No <code>@import</code> chains. Keep it small; a build tool (lesson 14.1) bundles it.</span></div>
  <div class="kv"><span class="k">CSS only for print / wide screens</span><span class="v"><code>media="print"</code> or <code>media="(min-width: 1200px)"</code> on the link, so it does not block other screens.</span></div>
  <div class="kv"><span class="k">Your app script</span><span class="v"><code>defer</code> (or <code>type="module"</code>, which is deferred by default).</span></div>
  <div class="kv"><span class="k">Independent third-party script</span><span class="v"><code>async</code> — and ask whether you need it at all (see the hacker's corner).</span></div>
  <div class="kv"><span class="k">Many style writes + reads</span><span class="v">Read everything first, then write everything. Never read geometry between writes in a loop.</span></div>
  <div class="kv"><span class="k">Many events per frame</span><span class="v"><code>requestAnimationFrame</code> to flush once per frame; debounce when you want "after the user stops".</span></div>
</div>

<h3>🕵️ Hacker's corner — every third-party script is a performance AND a security dependency</h3>
<p>A <code>&lt;script src="https://some-cdn.example/lib.js"&gt;</code> in your head does two things at once: it can block your first paint while that server is slow (row e above), and it runs with <strong>full access to your page</strong> — the DOM, the forms, the cookies that are not HttpOnly. You are trusting whoever controls that domain today, not the people who controlled it when you added the tag.</p>
<p>This is not hypothetical. In February 2024 the <code>polyfill.io</code> domain, used by a very large number of sites to load browser polyfills with one script tag, changed owners. In June 2024 the security firm Sansec reported that the service had started injecting malicious code that redirected some mobile visitors to scam sites, affecting more than 100,000 websites; the domain was later taken down by its registrar. Sites that had self-hosted the polyfills, or never needed them, were unaffected.</p>
<p><strong>How to defend:</strong> remove scripts you do not need (modern browsers rarely need a polyfill service); self-host libraries through your build (lesson 14.1) instead of hot-linking a CDN; for a static file you must load from elsewhere, add <strong>Subresource Integrity</strong> — <code>integrity="sha384-…" crossorigin="anonymous"</code> — so the browser refuses a file whose content changed; and restrict where scripts may come from with a Content Security Policy (Web Security course, lesson 2.4). Load what is left with <code>async</code> or <code>defer</code> so it cannot hold your page hostage.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — SRI on a file that is supposed to change.</strong> Subresource Integrity pins the exact bytes. It cannot protect a service that generates different code per browser (which is exactly how a polyfill service worked), and if you pin "latest" of a library, the next legitimate update breaks your page. Pin a specific version, or self-host.</p></div>

<div class="callout ok">
<p><strong>🧪 Lab (25 minutes) — equal-height cards</strong></p>
<p>Save the page below as <code>lab-equal-cards.html</code> and open it with a local server (VS Code Live Server, or <code>npx serve</code>). It builds 600 product cards and makes every row of six as tall as its tallest card — a request designers make all the time. It works, but it thrashes. In Chromium it printed:</p>
${ma('html', CODE['15-1/lab-equal-cards.html'])}
${ra(OUT['15-1/lab-equal-cards'])}
<p>Tasks: (1) record the second call in the Performance panel and find the forced layout warning; (2) rewrite <code>equalizeRows</code> in three phases — reset all cards, read all heights into an array, then write all <code>minHeight</code> values; (3) bonus: delete the JavaScript entirely and get the same visual result with CSS (hint: lesson 3.3 — what does <code>align-items: stretch</code> do in a flex row?).</p>
<p><strong>Done when:</strong> "again (on resize)" prints under 20&nbsp;ms (the reference solution measured about 5&nbsp;ms against about 140&nbsp;ms), "row 1 heights" still prints six equal numbers, and the Performance panel shows one Layout block for the call instead of hundreds.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">critical rendering path</span><span class="v">đường hiển thị then chốt — chuỗi bước từ HTML/CSS tới điểm ảnh đầu tiên.</span></div>
  <div class="kv"><span class="k">CSSOM</span><span class="v">cây quy tắc CSS mà trình duyệt dựng ra, song song với DOM.</span></div>
  <div class="kv"><span class="k">render tree</span><span class="v">cây hiển thị — DOM + kiểu đã tính, chỉ gồm thứ được vẽ.</span></div>
  <div class="kv"><span class="k">layout (reflow)</span><span class="v">dàn trang — tính vị trí và kích thước mọi hộp.</span></div>
  <div class="kv"><span class="k">paint / composite</span><span class="v">tô điểm ảnh / ghép các lớp lại (trên GPU).</span></div>
  <div class="kv"><span class="k">render-blocking</span><span class="v">chặn hiển thị — tài nguyên mà chưa có thì trình duyệt không vẽ.</span></div>
  <div class="kv"><span class="k">first contentful paint</span><span class="v">lần vẽ nội dung đầu tiên — lúc chữ/ảnh đầu tiên hiện ra.</span></div>
  <div class="kv"><span class="k">forced synchronous layout</span><span class="v">dàn trang bị ép đồng bộ — đọc kích thước khi bố cục đang "bẩn".</span></div>
  <div class="kv"><span class="k">layout thrashing</span><span class="v">dàn trang dồn dập — ghi/đọc xen kẽ trong vòng lặp, ép dàn trang mỗi vòng.</span></div>
  <div class="kv"><span class="k">Subresource Integrity (SRI)</span><span class="v">kiểm tính toàn vẹn tài nguyên — trình duyệt so mã băm trước khi chạy tệp.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Five stages: DOM, CSSOM, render tree, layout, paint/composite. Later stages are cheaper to redo.</li>
  <li>CSS blocks the first <em>paint</em>; a plain script blocks <em>parsing</em>; <code>defer</code> and non-matching <code>media</code> do not block the paint (measured: ~1&nbsp;s vs ~0).</li>
  <li><code>@import</code> inside CSS chains downloads one after another; use parallel <code>&lt;link&gt;</code> tags.</li>
  <li>Reading geometry after writing styles forces a layout; doing it in a loop is layout thrashing (roughly 170–190× slower here). Read all, then write all.</li>
  <li><code>requestAnimationFrame</code> turns many events into one DOM update per frame.</li>
  <li>Third-party scripts can block your page and run with full access to it: remove, self-host, pin with SRI, restrict with CSP.</li>
</ul>
${nguon('📗', 'web.dev — Avoid large, complex layouts and layout thrashing', 'Forced synchronous layouts and how to batch reads and writes', 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing')}
${nguon('📘', 'MDN — Critical rendering path', 'DOM, CSSOM, render tree, layout and paint in one page', 'https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path')}
${nguon('🧾', 'Paul Irish — What forces layout / reflow', 'The list of properties and methods that trigger a forced layout in the browser', 'https://gist.github.com/paulirish/5d52fb081b3570c81e3a')}
${nguon('🛡️', 'Sansec — Polyfill supply chain attack hits 100K+ sites (June 2024)', 'The original report on the polyfill.io incident', 'https://sansec.io/research/polyfill-supply-chain-attack')}
${nguon('📘', 'MDN — Subresource Integrity', 'The integrity attribute, how to generate the hash, and its limits', 'https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-12-2-transition-animation', title: 'Lesson 12.2 — transitions and animations', sub: 'Why transform and opacity animate smoothly: the composite-only stage, measured', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-14-4-performance', title: 'Lesson 14.4 — measuring performance', sub: 'LCP, CLS and TBT on a real page, before and after the fixes', cta: 'Open lesson' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-6-3-trinh-duyet', title: 'Interview Prep 6.3 — browser, HTML/CSS and performance', sub: 'The critical rendering path as interview questions with model answers', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-security', bai: 'sec-2-4-csp', title: 'Web Security 2.4 — Content Security Policy', sub: 'Restricting which scripts may run on your page', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Từ HTML tới điểm ảnh: trình duyệt làm gì sau khi response về tới</h2>
<p class="lead">Bài 0.2 đi theo một request cho tới lúc HTML về tới máy. Bài này đi tiếp theo HTML cho tới khi nó thành điểm ảnh trên màn hình. Học xong bạn gọi tên được năm bước trình duyệt đi qua, giải thích — bằng số đo — vì sao một tệp CSS chậm làm màn hình trắng xoá còn một script chậm có <code>defer</code> thì không, nhận ra lỗi tự gây chậm phổ biến nhất trong code front-end (<strong>layout thrashing — dàn trang dồn dập</strong>, đo ở đây chậm hơn khoảng 170–190 lần tuỳ lần chạy), và sửa nó bằng cách gom đọc và ghi. Mọi câu hỏi "sao trang tôi giật" trong React, mọi báo cáo Core Web Vitals ở bài 14.4 và mọi câu phỏng vấn về critical rendering path đều đứng trên bức tranh này.</p>

<h3>Liên tưởng đời thường: lên khuôn một trang báo</h3>
<p>Hãy nghĩ tới phòng dàn trang của một toà soạn. Biên tập viên đưa <strong>bài viết</strong> (HTML) và <strong>quy chuẩn trình bày</strong> (CSS: phông chữ, độ rộng cột, màu). Chưa có đủ cả hai trên bàn thì không ai quyết được cột nào dừng ở đâu. Sau đó một người <strong>đo và đặt</strong> từng khối lên trang (layout), một người <strong>in mực</strong> (paint), rồi các tờ được <strong>xếp chồng</strong> đúng thứ tự (composite). Quy chuẩn tới trễ thì cả phòng ngồi chờ. Nếu một biên tập viên sửa một dòng tít rồi hỏi ngay "cột 3 giờ cao bao nhiêu?", người đo phải dàn lại cả trang mới trả lời được — hỏi như thế một nghìn lần liên tiếp thì cả phòng đứng hình. Câu cuối đó chính là layout thrashing.</p>

<h3>Bước 1 — năm bước, theo thứ tự</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc HTML → DOM</span><span class="lz-d">Cây phần tử bạn đã gặp ở bài 2.1. Một thẻ <code>&lt;script&gt;</code> thường làm việc đọc dừng lại tới khi script tải và chạy xong.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đọc CSS → CSSOM</span><span class="lz-d">Cây quy tắc kiểu. Trình duyệt không vẽ khi CSS áp cho màn hình chưa sẵn sàng — CSS <strong>chặn hiển thị (render-blocking)</strong>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tính kiểu → cây hiển thị</span><span class="lz-d">DOM + CSSOM: kiểu đã tính của từng hộp nhìn thấy được. Phần tử <code>display: none</code> bị bỏ ra hẳn.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Layout (dàn trang)</span><span class="lz-d">Hình học: vị trí và kích thước chính xác của mọi hộp. Đổi chiều rộng, cỡ chữ hay chữ bên trong là layout phải chạy lại.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Paint → composite</span><span class="lz-d">Tô điểm ảnh vào các lớp, rồi xếp chồng các lớp trên GPU. <code>transform</code> và <code>opacity</code> có thể đổi ở riêng bước cuối này — vì vậy bài 12.2 tạo chuyển động bằng chúng.</span></div>
</div>
<p>Chuỗi này gọi là <strong>critical rendering path (đường hiển thị then chốt)</strong>. Nó chạy một lần lúc trang tải, rồi chạy lại — một phần — mỗi khi JavaScript hoặc CSS đổi một thứ gì đó. Kỹ năng bài này dạy là biết <em>phần nào</em> chạy lại, và chạy bao nhiêu lần.</p>

<h3>Bước 2 — thứ gì thật sự chặn lần vẽ đầu (đo thật)</h3>
<p>Để đo, một máy chủ Node nhỏ phục vụ sáu trang tí hon. Trang nào cũng cùng một tiêu đề và một đoạn văn; chỉ phần <code>&lt;head&gt;</code> khác nhau. Máy chủ cố tình trả <code>/slow.css</code> và <code>/slow.js</code> sau 1 giây. Chromium ghi lại <strong>first contentful paint</strong> (lúc chữ đầu tiên hiện ra) và <code>DOMContentLoaded</code> (HTML đã đọc xong). Mỗi trang tải ba lần, lấy trung vị, làm tròn 10&nbsp;ms. Đây là trang có tệp CSS chậm:</p>
${ma('html', CODE['_t15/chan/b-slow-css.html'])}
${ra(OUT['_t15/out/15-1-chan-ve'])}
<p>Đọc từng dòng, vì mỗi dòng là một luật bạn sẽ dùng:</p>
<ul>
  <li><strong>b-slow-css</strong> — chữ đã tải về rồi mà màn hình vẫn trắng khoảng một giây. Trình duyệt không chịu vẽ khi thiếu stylesheet, để khỏi hiện nội dung trần trụi rồi nhảy bố cục. Việc đọc HTML không bị chặn (<code>DOMContentLoaded</code> ≈ 0): CSS chặn <em>hiển thị</em>, không chặn <em>đọc</em>.</li>
  <li><strong>c-print-css</strong> — cùng tệp chậm đó nhưng có <code>media="print"</code> thì không chặn: stylesheet có media query không khớp màn hình được tải với độ ưu tiên thấp và không giữ lần vẽ.</li>
  <li><strong>d-import-chain</strong> — <code>chain.css</code> (0,5&nbsp;s) chứa <code>@import url("/slow.css")</code>. Trình duyệt chỉ phát hiện tệp thứ hai khi tệp thứ nhất về tới, nên thời gian chờ cộng dồn: khoảng 1,5&nbsp;s. Hãy dùng nhiều thẻ <code>&lt;link&gt;</code> (tải song song) thay vì <code>@import</code> trong CSS.</li>
  <li><strong>e-sync-script</strong> — một <code>&lt;script src&gt;</code> thường trong <code>&lt;head&gt;</code> dừng bộ đọc, nên phần body còn chưa tồn tại: suốt một giây không có gì để vẽ, và <code>DOMContentLoaded</code> cũng phải chờ.</li>
  <li><strong>f-defer-script</strong> — có <code>defer</code> thì bộ đọc chạy tiếp và chữ được vẽ gần như ngay; script vẫn chạy trước <code>DOMContentLoaded</code>, nên <code>DOMContentLoaded</code> vẫn khoảng một giây. Bài 4.5 giải thích script defer chạy <em>khi nào</em>; dòng này cho thấy người dùng <em>nhìn thấy gì</em> trong lúc đó.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "máy chủ nhanh thì trang nhanh".</strong> Ở dòng b và e, HTML về tới trong vài mili giây mà trang vẫn trống trơn một giây. Nút thắt là một tệp phụ mà trang nhất quyết không vẽ khi chưa có. Trang lâu hiện chữ thì mở tab Network, sắp theo "Waterfall", nhìn thứ gì nằm trong <code>&lt;head&gt;</code> trước khi đổ cho máy chủ.</p></div>

<h3>Bước 3 — sau khi tải: thay đổi nào tốn bao nhiêu</h3>
<p>Khi trang đã hiện lên, mỗi thay đổi bạn làm từ JavaScript hay CSS khởi động lại đường ống từ một bước nào đó. Bước càng về sau, thay đổi càng rẻ.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Layout + paint + composite</span><span class="lz-t">đắt nhất</span><span class="lz-d">Đổi hình học: <code>width</code>, <code>height</code>, <code>top</code>, <code>margin</code>, <code>font-size</code>, thêm/bớt phần tử, đổi chữ.</span></div>
<div class="lz-layer"><span class="lz-k">Paint + composite</span><span class="lz-t">vừa</span><span class="lz-d">Đổi vẻ ngoài, không đổi vị trí: <code>color</code>, <code>background</code>, <code>box-shadow</code>, <code>visibility</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Chỉ composite</span><span class="lz-t">rẻ nhất</span><span class="lz-d"><code>transform</code> và <code>opacity</code> (trên lớp riêng). Bài 12.2 đã đo vì sao chuyển động nên dùng hai thứ này.</span></div>
</div>
<p>Đổi một kiểu không làm trình duyệt dàn trang ngay. Nó chỉ đánh dấu bố cục là <strong>bẩn (dirty)</strong> — "cần làm lại" — rồi chạy tiếp; việc thật diễn ra một lần, ngay trước khi vẽ khung hình kế tiếp. Sự "lười" đó là một tối ưu lớn — và bước sau cho thấy phá nó dễ thế nào.</p>

<h3>Bước 4 — layout thrashing, đo thật</h3>
<p>Có những thuộc tính chỉ trả lời được khi bố cục đã cập nhật: <code>offsetWidth</code>, <code>offsetHeight</code>, <code>clientWidth</code>, <code>getBoundingClientRect()</code>, <code>scrollTop</code>, <code>getComputedStyle()</code> và nhiều thứ khác. Nếu bố cục đang bẩn mà bạn đọc một trong số đó, trình duyệt phải dàn trang <em>ngay lập tức</em>, giữa chừng script của bạn. Việc này gọi là <strong>forced synchronous layout (dàn trang bị ép đồng bộ)</strong>, hay forced reflow. Làm nó trong vòng lặp — ghi, đọc, ghi, đọc — là bạn ép một lần dàn trang đầy đủ cho mỗi vòng. Trang dưới đây đặt chiều rộng cho 1.000 dòng theo hai cách và bấm giờ từng cách (trung vị 7 lần chạy, trong Chromium):</p>
${ma('html', CODE['15-1/thrash.html'], [23, 35])}
${ra(OUT['15-1/thrash'])}
<p>Hai hàm cho ra đúng cùng một kết quả trên màn hình (dòng cuối kiểm điều đó). Bản A hỏi <code>list.offsetWidth</code> ngay sau một lần ghi, 1.000 lần, nên trình duyệt dàn trang 1.000 lần. Bản B đọc một lần, ghi 1.000 lần, rồi để trình duyệt dàn trang một lần ở cuối. Trên máy này chênh lệch khoảng hai bậc độ lớn; trên điện thoại rẻ tiền con số tuyệt đối còn lớn hơn vài lần, và cái gì trên chừng 50&nbsp;ms là một khung hình người dùng cảm thấy được như một cú giật.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lệnh đọc trốn trong một hàm tiện ích.</strong> Thrashing ngoài đời hiếm khi lộ liễu như bản A. Nó trông như <code>items.forEach(el =&gt; el.style.height = getTallest() + 'px')</code>, trong đó <code>getTallest()</code> đọc <code>offsetHeight</code> ở đâu đó cách ba tệp, hoặc một lệnh thư viện tự đo phần tử. Luật: trong vòng lặp nào có ghi kiểu, soát mọi hàm nó gọi xem có đọc bố cục không. Panel Performance sẽ báo nếu bạn sót (Bước 6).</p></div>

<h3>Bước 5 — mỗi khung hình một lần cập nhật với requestAnimationFrame</h3>
<p>Màn hình làm mới khoảng 60 lần mỗi giây, nên cập nhật DOM nhiều hơn thế là vô ích. Sự kiện cuộn, di chuột, gõ phím có thể bắn nhiều lần giữa hai khung hình. <code>requestAnimationFrame(callback)</code> nhờ trình duyệt chạy callback ngay trước lần vẽ kế tiếp. Mẫu dưới đây nhớ sự kiện mới nhất và hẹn tối đa một lần cập nhật DOM mỗi khung hình:</p>
${ma('html', CODE['15-1/raf.html'], [19, 38])}
${ra(OUT['15-1/raf'])}
<p>Handler trực tiếp đụng DOM 200 lần; handler gom chỉ đụng một lần, mà vẫn hiện dữ liệu mới nhất (sự kiện #200). Người dùng thấy cùng màn hình cuối, nhưng trình duyệt làm ít việc hơn hẳn. Mẫu "nhớ giá trị mới nhất, xả một lần mỗi khung hình" này là thứ các hiệu ứng theo cuộn, kéo-thả và nhiều thư viện chuyển động làm bên trong. (Khi bạn cần <em>chờ</em> người dùng ngừng gõ chứ không phải giới hạn tần suất, dùng debounce — khoá React, bài custom hook.)</p>

<h3>Bước 6 — nhìn thấy nó trong DevTools</h3>
<ol>
  <li>Mở trang, bấm F12, vào panel <strong>Performance</strong>, bấm Record, làm thao tác chậm, rồi dừng.</li>
  <li>Ở dải luồng chính (Main), khối màu tím là <strong>Layout</strong> và <strong>Recalculate Style</strong>; khối xanh lá là <strong>Paint</strong>. Một bức tường lát tím mỏng nằm dưới một hàm JavaScript là dấu vân tay của thrashing.</li>
  <li>Bấm vào một khối Layout: Chrome đánh dấu các lần dàn trang bị ép bằng một cảnh báo và dẫn link tới dòng JavaScript gây ra nó. Dòng đó là chỗ bạn đọc-sau-khi-ghi.</li>
  <li>Với lần vẽ đầu, dùng panel <strong>Network</strong>: thứ gì có thanh dài, bắt đầu trước mốc vẽ đầu tiên và nằm trong <code>&lt;head&gt;</code> là nghi phạm chặn hiển thị.</li>
</ol>

<h3>Khi nào dùng gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSS của bạn</span><span class="v">Một hoặc vài <code>&lt;link rel="stylesheet"&gt;</code> trong head. Không nối đuôi <code>@import</code>. Giữ cho nhỏ; công cụ build (bài 14.1) gộp lại.</span></div>
  <div class="kv"><span class="k">CSS chỉ cho bản in / màn hình rộng</span><span class="v"><code>media="print"</code> hoặc <code>media="(min-width: 1200px)"</code> trên thẻ link, để không chặn các màn hình khác.</span></div>
  <div class="kv"><span class="k">Script của ứng dụng</span><span class="v"><code>defer</code> (hoặc <code>type="module"</code>, mặc định đã là defer).</span></div>
  <div class="kv"><span class="k">Script bên thứ ba độc lập</span><span class="v"><code>async</code> — và tự hỏi có thật cần nó không (xem góc hacker).</span></div>
  <div class="kv"><span class="k">Nhiều lần ghi + đọc kiểu</span><span class="v">Đọc hết trước, rồi ghi hết. Không bao giờ đọc kích thước giữa các lần ghi trong vòng lặp.</span></div>
  <div class="kv"><span class="k">Nhiều sự kiện trong một khung hình</span><span class="v"><code>requestAnimationFrame</code> để xả một lần mỗi khung; debounce khi muốn "sau khi người dùng ngừng".</span></div>
</div>

<h3>🕵️ Góc hacker — mỗi script bên thứ ba là một phụ thuộc về hiệu năng VÀ bảo mật</h3>
<p>Một thẻ <code>&lt;script src="https://some-cdn.example/lib.js"&gt;</code> trong head làm cùng lúc hai việc: nó có thể chặn lần vẽ đầu của bạn khi máy chủ kia chậm (dòng e ở trên), và nó chạy với <strong>toàn quyền trên trang của bạn</strong> — DOM, các biểu mẫu, cookie không có HttpOnly. Bạn đang tin người kiểm soát tên miền đó HÔM NAY, không phải người kiểm soát nó lúc bạn thêm thẻ.</p>
<p>Chuyện này không phải giả định. Tháng 2/2024, tên miền <code>polyfill.io</code> — được rất nhiều trang dùng để nạp polyfill trình duyệt chỉ bằng một thẻ script — đổi chủ. Tháng 6/2024, hãng bảo mật Sansec báo cáo dịch vụ này bắt đầu chèn mã độc chuyển hướng một phần người dùng di động sang trang lừa đảo, ảnh hưởng hơn 100.000 website; sau đó nhà đăng ký tên miền đã gỡ tên miền xuống. Những trang tự host polyfill, hoặc vốn không cần nó, không bị ảnh hưởng.</p>
<p><strong>Cách phòng:</strong> bỏ các script không cần (trình duyệt hiện đại hiếm khi cần dịch vụ polyfill); tự host thư viện qua bước build (bài 14.1) thay vì nhúng thẳng từ CDN; với tệp tĩnh buộc phải nạp từ nơi khác, thêm <strong>Subresource Integrity</strong> — <code>integrity="sha384-…" crossorigin="anonymous"</code> — để trình duyệt từ chối tệp đã bị đổi nội dung; và giới hạn nguồn script bằng Content Security Policy (khoá Web Security, bài 2.4). Những gì còn lại thì nạp bằng <code>async</code> hoặc <code>defer</code> để nó không bắt trang bạn làm con tin.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gắn SRI cho tệp vốn sẽ thay đổi.</strong> Subresource Integrity ghim đúng từng byte. Nó không bảo vệ được một dịch vụ sinh mã khác nhau theo từng trình duyệt (dịch vụ polyfill chính là như vậy), và nếu bạn ghim bản "latest" của một thư viện thì lần cập nhật hợp lệ kế tiếp sẽ làm hỏng trang. Hãy ghim một phiên bản cụ thể, hoặc tự host.</p></div>

<div class="callout ok">
<p><strong>🧪 Lab (25 phút) — thẻ sản phẩm cao bằng nhau</strong></p>
<p>Lưu trang dưới đây thành <code>lab-equal-cards.html</code> và mở bằng một máy chủ cục bộ (VS Code Live Server, hoặc <code>npx serve</code>). Nó dựng 600 thẻ sản phẩm và làm mỗi hàng sáu thẻ cao bằng thẻ cao nhất — yêu cầu mà designer đưa ra suốt. Nó chạy đúng, nhưng thrash. Trong Chromium nó in:</p>
${ma('html', CODE['15-1/lab-equal-cards.html'])}
${ra(OUT['15-1/lab-equal-cards'])}
<p>Nhiệm vụ: (1) ghi lại lần gọi thứ hai trong panel Performance và tìm cảnh báo dàn trang bị ép; (2) viết lại <code>equalizeRows</code> theo ba pha — reset mọi thẻ, đọc mọi chiều cao vào một mảng, rồi ghi mọi giá trị <code>minHeight</code>; (3) thêm: xoá hẳn JavaScript và đạt cùng kết quả nhìn thấy bằng CSS (gợi ý: bài 3.3 — <code>align-items: stretch</code> làm gì trong một hàng flex?).</p>
<p><strong>Xong khi:</strong> dòng "again (on resize)" in dưới 20&nbsp;ms (lời giải mẫu đo được khoảng 5&nbsp;ms so với khoảng 140&nbsp;ms), dòng "row 1 heights" vẫn in sáu số bằng nhau, và panel Performance cho thấy một khối Layout cho lần gọi đó thay vì hàng trăm khối.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">critical rendering path</span><span class="v">đường hiển thị then chốt — chuỗi bước từ HTML/CSS tới điểm ảnh đầu tiên.</span></div>
  <div class="kv"><span class="k">CSSOM</span><span class="v">cây quy tắc CSS mà trình duyệt dựng ra, song song với DOM.</span></div>
  <div class="kv"><span class="k">render tree</span><span class="v">cây hiển thị — DOM + kiểu đã tính, chỉ gồm thứ được vẽ.</span></div>
  <div class="kv"><span class="k">layout (reflow)</span><span class="v">dàn trang — tính vị trí và kích thước mọi hộp.</span></div>
  <div class="kv"><span class="k">paint / composite</span><span class="v">tô điểm ảnh / ghép các lớp lại (trên GPU).</span></div>
  <div class="kv"><span class="k">render-blocking</span><span class="v">chặn hiển thị — tài nguyên mà chưa có thì trình duyệt không vẽ.</span></div>
  <div class="kv"><span class="k">first contentful paint</span><span class="v">lần vẽ nội dung đầu tiên — lúc chữ/ảnh đầu tiên hiện ra.</span></div>
  <div class="kv"><span class="k">forced synchronous layout</span><span class="v">dàn trang bị ép đồng bộ — đọc kích thước khi bố cục đang "bẩn".</span></div>
  <div class="kv"><span class="k">layout thrashing</span><span class="v">dàn trang dồn dập — ghi/đọc xen kẽ trong vòng lặp, ép dàn trang mỗi vòng.</span></div>
  <div class="kv"><span class="k">Subresource Integrity (SRI)</span><span class="v">kiểm tính toàn vẹn tài nguyên — trình duyệt so mã băm trước khi chạy tệp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Năm bước: DOM, CSSOM, cây hiển thị, layout, paint/composite. Bước càng về sau càng rẻ khi phải làm lại.</li>
  <li>CSS chặn lần <em>vẽ</em> đầu; script thường chặn việc <em>đọc</em> HTML; <code>defer</code> và <code>media</code> không khớp thì không chặn lần vẽ (đo: ~1&nbsp;s so với ~0).</li>
  <li><code>@import</code> trong CSS khiến các tệp tải nối đuôi nhau; dùng nhiều <code>&lt;link&gt;</code> song song.</li>
  <li>Đọc kích thước sau khi ghi kiểu là ép dàn trang; làm trong vòng lặp là layout thrashing (chậm hơn khoảng 170–190 lần ở đây). Đọc hết, rồi ghi hết.</li>
  <li><code>requestAnimationFrame</code> biến nhiều sự kiện thành một lần cập nhật DOM mỗi khung hình.</li>
  <li>Script bên thứ ba có thể chặn trang và chạy với toàn quyền trên trang: bỏ bớt, tự host, ghim bằng SRI, giới hạn bằng CSP.</li>
</ul>
${nguon('📗', 'web.dev — Avoid large, complex layouts and layout thrashing', 'Dàn trang bị ép và cách gom đọc/ghi', 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing')}
${nguon('📘', 'MDN — Critical rendering path', 'DOM, CSSOM, cây hiển thị, layout và paint trong một trang', 'https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path')}
${nguon('🧾', 'Paul Irish — What forces layout / reflow', 'Danh sách thuộc tính và phương thức ép trình duyệt dàn trang', 'https://gist.github.com/paulirish/5d52fb081b3570c81e3a')}
${nguon('🛡️', 'Sansec — Polyfill supply chain attack hits 100K+ sites (6/2024)', 'Báo cáo gốc về vụ polyfill.io', 'https://sansec.io/research/polyfill-supply-chain-attack')}
${nguon('📘', 'MDN — Subresource Integrity', 'Thuộc tính integrity, cách tạo mã băm, và giới hạn của nó', 'https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-12-2-transition-animation', title: 'Bài 12.2 — chuyển cảnh và hoạt hình', sub: 'Vì sao transform và opacity chuyển động mượt: bước chỉ-composite, có số đo', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-14-4-performance', title: 'Bài 14.4 — đo hiệu năng', sub: 'LCP, CLS và TBT trên một trang thật, trước và sau khi sửa', cta: 'Mở bài' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-6-3-trinh-duyet', title: 'Luyện phỏng vấn 6.3 — trình duyệt, HTML/CSS và hiệu năng', sub: 'Critical rendering path dưới dạng câu hỏi phỏng vấn có đáp án mẫu', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-security', bai: 'sec-2-4-csp', title: 'Web Security 2.4 — Content Security Policy', sub: 'Giới hạn những script nào được chạy trên trang', cta: 'Mở bài' })}
</div>
`,
};
