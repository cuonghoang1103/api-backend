/**
 * Bài 15.4 — Bộ nhớ và bộ thu gom rác: tìm một chỗ rò rỉ trong trình duyệt (soạn 20/11/2026).
 * Mã + output: ../_ma.mjs — _demo/_t15/bo-nho/(tất cả) đo bằng _demo/_t15/chay.mjs: mỗi kịch bản một trang sạch,
 * gắn/gỡ 30 lần, ép gom rác qua CDP (HeapProfiler.collectGarbage) rồi đọc Runtime.getHeapUsage + Memory.getDOMCounters
 * (cùng ba con số mà DevTools › Performance monitor hiện: JS heap, DOM Nodes, JS event listeners).
 * Không trùng: 11.1 (closure giữ biến — một đoạn bẫy), Node.js 16.5 (rò rỉ phía máy chủ), OS 7.4 (bên trong V8/JVM GC),
 * React 4.1 (cleanup của useEffect). Chưa có deck wf-15-4.
 */
import { ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

export default {
  title: '15.4 — Memory and garbage collection: finding a leak in the browser|||15.4 — Bộ nhớ và bộ thu gom rác: tìm chỗ rò rỉ trong trình duyệt',
  slug: 'wf-15-4-memory-leaks',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Bộ thu gom rác giữ gì, bỏ gì (khả năng với tới từ gốc; vòng tham chiếu vẫn được gom — đo 38,7 MB → 0,5 MB); bốn rò rỉ kinh điển ở front-end đo thật sau 30 lần gắn/gỡ: listener không gỡ, setInterval không dừng, DOM tách rời giữ trong mảng, metadata trong Map — và bản sửa (AbortController, clearInterval, WeakMap); vì sao JS heap không thấy DOM rò rỉ; Performance monitor, heap snapshot, getEventListeners; góc hacker: danh sách không giới hạn làm sập tab. Lab: thông báo toast rò rỉ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Memory and garbage collection: why a page gets slower the longer it stays open</h2>
<p class="lead">A classic website reloads on every click, so its memory is wiped constantly. A single-page app (React, Vue, Angular, the CT Work board) can stay open for a whole working day, mounting and unmounting hundreds of components. Every one of them that leaves something behind makes the tab a little heavier, until scrolling stutters or Chrome shows "Out of memory". After this lesson you can explain what the garbage collector keeps and what it frees, recognise the four leaks that cause most front-end memory problems, measure them with the same three counters DevTools shows, and fix each one. React's effect cleanup, which you will meet in the React course, exists precisely for the bugs in this lesson.</p>

<h3>An everyday picture: a library and its borrowing cards</h3>
<p>A library keeps a book on the shelves as long as <em>some</em> card in the system still points to it. At night the librarian walks through the catalogue starting from the front desk and marks every book that can be reached by following the cards; anything not marked goes to recycling. You never throw books away yourself — you just stop pointing at them. A leak is a forgotten card in a drawer: nobody will ever read that book again, but because a card still points to it, it stays on the shelf forever. In JavaScript the "front desk" is the set of <strong>roots</strong> (the global <code>window</code>, the code that is currently running, registered listeners and timers), the cards are <strong>references</strong>, and the librarian is the <strong>garbage collector</strong>.</p>

<h3>Step 1 — reachability: the only rule that matters</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Start at the roots</span><span class="lz-d"><code>window</code> and its globals, variables of functions still running, listeners and timers the browser holds.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Follow every reference</span><span class="lz-d">Object properties, array items, Map entries, variables captured by closures (lesson 11.1).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Mark what you reach</span><span class="lz-d">Reachable = still in use, by definition — even if your code will "never" touch it again.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Sweep the rest</span><span class="lz-d">Everything unmarked is freed. You cannot free memory by hand in JavaScript; you can only make things unreachable.</span></div>
</div>
<p>One consequence surprises people coming from older tutorials: objects that point at <em>each other</em> are not a problem by themselves. Here, 20 pairs of objects reference each other in a cycle, each pair holding about 2&nbsp;MB. The numbers come from Chromium after forcing a full garbage collection:</p>
${ma('javascript', CODE['_t15/bo-nho/cycle.js'])}
${ra(OUT['_t15/out/15-4-vong'])}
<p>After <code>keep = []</code> the cycles still exist, but no root can reach them, so all ~38&nbsp;MB went back. A garbage collector that only counted references would never free a cycle; modern engines trace from the roots instead, so the question to ask about any leak is never "is there a cycle?" but <strong>"what reachable thing still points at this?"</strong></p>

<h3>Step 2 — the experiment: mount and unmount 30 times</h3>
<p>Each widget below is what a modal, a chart or a page does in a single-page app: create some DOM, hold about 1&nbsp;MB of data, register something, and later be removed. Each scenario ran in a fresh page: 30 times mount + unmount, then a forced garbage collection, then three readings — JavaScript heap size, number of DOM nodes, number of event listeners. These are exactly the three lines DevTools draws in <strong>More tools → Performance monitor</strong>, so you can repeat the experiment on your own pages.</p>
${ra(OUT['_t15/out/15-4-gan-go-30-lan'])}
<p>Every "fixed" row ends where it started. Every leaking row keeps something per mount. Let us look at each one.</p>

<h3>Leak 1 — a listener that is never removed</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [6, 23])}
<p>The widget is gone from the page, but <code>window</code> — a root — still holds <code>onResize</code> in its list of listeners. <code>onResize</code> is a closure over <code>el</code> and <code>points</code>, so the element and its 1&nbsp;MB stay reachable: +28.6&nbsp;MB and +30 listeners after 30 mounts. The fix passes an <code>AbortController</code>'s <code>signal</code> to <code>addEventListener</code>; one <code>controller.abort()</code> removes the listener (or every listener registered with that signal — handy when a widget registers five). The older equivalent is <code>removeEventListener</code> with the <em>same</em> function reference.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — removing a different function.</strong> <code>window.removeEventListener('resize', () =&gt; update())</code> removes nothing: that arrow function is a brand-new object, not the one you added. Keep the handler in a variable, or use a <code>signal</code>, which does not need the reference at all.</p></div>

<h3>Leak 2 — a timer that is never cleared</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [25, 39])}
<p>The browser keeps every active <code>setInterval</code> callback reachable until it is cleared — forever, for an interval. The callback mentions <code>el</code> and <code>points</code>, so the same 28.6&nbsp;MB stays, and on top of that 30 timers keep firing every minute, updating elements nobody can see. The fix: keep the id and <code>clearInterval(id)</code> on unmount. The same applies to <code>setTimeout</code> that reschedules itself, <code>requestAnimationFrame</code> loops, WebSocket handlers and <code>IntersectionObserver</code>s (call <code>disconnect()</code>).</p>

<h3>Leak 3 — detached DOM: off the page, still in an array</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [41, 60])}
<p>Look at the result row again: the JavaScript heap grew by only <strong>0.3&nbsp;MB</strong>, yet the DOM node count went from 14 to <strong>33,074</strong>. Each table (100 rows × 5 cells plus their text) was removed from the page but pushed into <code>recentlyClosed</code> "in case the user reopens it". A removed element that JavaScript still references is called a <strong>detached</strong> element, and it keeps its whole subtree alive. The DOM nodes themselves are not stored in the JavaScript heap that this counter measures — which is why you must watch the <em>DOM Nodes</em> line too, not just "JS heap size".</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting one number.</strong> If you had only looked at JS heap size, you would have declared Leak 3 "fine". Use all three counters, and confirm with a heap snapshot (Step 3), where detached elements show up by name.</p></div>

<h3>Leak 4 — extra data in a Map, and why WeakMap exists</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [62, 76])}
<p>Attaching extra data to an element (a chart's points, a tooltip's state) in a <code>Map</code> keyed by the element looks clean, but a <code>Map</code> holds its keys strongly: as long as the Map is reachable, every element ever used as a key — and its value — stays alive. A <code>WeakMap</code> holds its keys <em>weakly</em>: an entry does not keep its key alive, and when the key becomes unreachable, the entry and its value go with it. That is why a WeakMap's keys must be objects, and why it has no <code>size</code> and cannot be looped over: its contents can change whenever the garbage collector runs.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Map</span><span class="v">You own the entries: a cache with a size limit, lookups by id, anything you need to list or count. You must delete entries yourself.</span></div>
  <div class="kv"><span class="k">WeakMap</span><span class="v">Data that should live exactly as long as some object: metadata about DOM elements, private data for class instances.</span></div>
  <div class="kv"><span class="k">WeakRef</span><span class="v">Rarely needed: "I would like to use this object if it still exists". Its timing is not guaranteed — do not build logic on it.</span></div>
</div>

<h3>Step 3 — finding a leak in your own page</h3>
<ol>
  <li><strong>Reproduce with a loop.</strong> A leak of 1&nbsp;MB per action is invisible once and obvious after 30. Open and close the suspect dialog 20–30 times (or call the open/close functions in the console in a loop).</li>
  <li><strong>Watch the three counters.</strong> DevTools → More tools → <strong>Performance monitor</strong>: JS heap size, DOM Nodes, JS event listeners. Click the trash-can icon in the <strong>Memory</strong> panel to force a garbage collection first — only memory that survives a collection is a leak.</li>
  <li><strong>Compare two heap snapshots.</strong> Memory panel → Heap snapshot, do the action 10 times, take another, choose "Comparison". Sort by "# Delta": what grew by 10 is your suspect. Type <code>Detached</code> in the class filter to list detached DOM elements.</li>
  <li><strong>Follow the retainers.</strong> Click a leaked object; the "Retainers" pane shows the chain of references that keeps it alive — for example <code>onResize</code> in <code>Window</code> listeners. The first link you did not intend is the bug.</li>
  <li><strong>Check listeners directly.</strong> In the DevTools console, <code>getEventListeners(window)</code> or <code>getEventListeners(document)</code> lists what is registered (a console-only helper, not available to page code).</li>
</ol>

<h3>🕵️ Hacker's corner — an unbounded list is a remote "crash this tab" button</h3>
<p>Memory is a resource an attacker can make you spend. If a chat, a live-comment feed or a notifications panel appends every incoming message to an array and to the DOM and never removes old ones, then whoever can send messages controls how much memory your users' tabs use. A script that floods a public room with thousands of long messages can make other people's tabs slow and eventually crash — no vulnerability in the classic sense, just a missing limit. The same applies to logs you keep in memory "for debugging" (the <code>trace</code> array in the lab below) and to caches without a maximum size.</p>
<p><strong>How to defend:</strong> keep at most N items in memory (drop the oldest, load older history on demand), render long lists with virtualisation so only visible rows exist in the DOM (React course, lesson 13.3), give every cache a size limit, rate-limit and cap message size on the server, and never keep debug data in production builds.</p>

<div class="callout ok">
<p><strong>🧪 Lab (25 minutes) — toasts that leak</strong></p>
<p>Save the page below as <code>lab-toasts.html</code> and serve it locally. Each "Saved!" toast disappears after five seconds or when you press Escape — on screen everything looks fine.</p>
${ma('html', CODE['_t15/bo-nho/lab-toasts.html'])}
<p>Measured in Chromium after showing and closing 50 toasts (each closed immediately through the function <code>showToast</code> returns), then a forced garbage collection:</p>
${ra(OUT['_t15/out/15-4-lab-toasts'])}
<ol>
  <li>Open the Performance monitor, run <code>for (let i = 0; i &lt; 50; i++) showToast('x')()</code> in the console, force a garbage collection, and reproduce the three numbers above.</li>
  <li>Use <code>getEventListeners(document)</code> and a heap-snapshot comparison to name the two things that survive each toast and what they keep alive.</li>
  <li>Fix <code>close()</code> so a closed toast leaves nothing behind. Make <code>close()</code> safe to call twice.</li>
</ol>
<p><strong>Done when:</strong> after 50 toasts and a forced collection the JS heap, the DOM node count and the listener count are back to their starting values (the reference fix measured 0.6&nbsp;MB → 0.6&nbsp;MB, 1 → 1 listener, 24 → 24 nodes), and pressing Escape after all toasts have closed does nothing.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">garbage collector (GC)</span><span class="v">bộ thu gom rác — tự giải phóng bộ nhớ không còn với tới được.</span></div>
  <div class="kv"><span class="k">root</span><span class="v">gốc — điểm xuất phát khi dò: window, code đang chạy, listener và timer đã đăng ký.</span></div>
  <div class="kv"><span class="k">reachable</span><span class="v">với tới được — đi theo tham chiếu từ một gốc mà tới được.</span></div>
  <div class="kv"><span class="k">memory leak</span><span class="v">rò rỉ bộ nhớ — thứ không còn dùng nhưng vẫn với tới được, nên không bị gom.</span></div>
  <div class="kv"><span class="k">detached DOM element</span><span class="v">phần tử DOM tách rời — đã gỡ khỏi trang nhưng JS vẫn giữ tham chiếu.</span></div>
  <div class="kv"><span class="k">WeakMap</span><span class="v">Map giữ khoá "yếu" — không giữ khoá sống; khoá mất thì mục cũng mất.</span></div>
  <div class="kv"><span class="k">heap snapshot</span><span class="v">ảnh chụp heap — danh sách mọi đối tượng trong bộ nhớ ở một thời điểm.</span></div>
  <div class="kv"><span class="k">retainer</span><span class="v">kẻ giữ — đối tượng đang trỏ tới (và giữ sống) một đối tượng khác.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The GC frees whatever no root can reach; cycles are collected too. Ask "what still points at this?".</li>
  <li>Four classic front-end leaks: listeners on <code>window</code>/<code>document</code>, uncleared intervals, detached DOM kept in arrays, element data in a <code>Map</code>. Measured: ~28.6&nbsp;MB or ~33,000 nodes after 30 mounts.</li>
  <li>Fixes: <code>AbortController</code> signal or <code>removeEventListener</code> with the same function, <code>clearInterval</code>/<code>disconnect()</code>, drop references to removed elements, <code>WeakMap</code> for per-object data.</li>
  <li>Watch JS heap, DOM nodes and listeners together — detached DOM barely moves the JS heap.</li>
  <li>Reproduce in a loop, force GC, compare heap snapshots, follow the retainers.</li>
  <li>Unbounded lists and caches let others decide how much memory your users spend: cap them.</li>
</ul>
${nguon('📗', 'MDN — Memory management', 'Reachability, mark-and-sweep, and why cycles are no longer a problem', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management')}
${nguon('🛠️', 'Chrome DevTools — Fix memory problems', 'Performance monitor, heap snapshots, detached elements, retainers', 'https://developer.chrome.com/docs/devtools/memory-problems')}
${nguon('📗', 'MDN — EventTarget.addEventListener (signal option)', 'Removing listeners with an AbortSignal', 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener')}
${nguon('📗', 'MDN — WeakMap', 'Weakly held keys, why there is no size and no iteration', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-1-closure', title: 'Lesson 11.1 — closure', sub: 'Why a closure keeps every variable it mentions alive — the root of Leaks 1 and 2', cta: 'Open lesson' })}
${lienKet({ khoa: 'react', bai: 'rx-4-1-use-effect', title: 'React 4.1 — useEffect, dependencies and cleanup', sub: 'The cleanup function is where removeEventListener / clearInterval / abort() go', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-16-5-ro-ri-bo-nho', title: 'Node.js 16.5 — memory: the cache that never forgets', sub: 'The same leaks on a server, where they eventually kill the process', cta: 'Open lesson' })}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-7-4-allocator', title: 'OS for Developers 7.4 — allocators and garbage collectors', sub: 'How V8 actually collects: generations, and what the OS sees', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Bộ nhớ và bộ thu gom rác: vì sao trang càng mở lâu càng chậm</h2>
<p class="lead">Một website kiểu cũ tải lại ở mỗi cú bấm, nên bộ nhớ của nó bị xoá sạch liên tục. Một ứng dụng một trang (React, Vue, Angular, bảng CT Work) có thể mở suốt cả ngày làm việc, gắn và gỡ hàng trăm component. Cái nào để lại chút gì đó là tab nặng thêm một chút, cho tới khi cuộn bị giật hoặc Chrome báo "Out of memory". Học xong bài này bạn giải thích được bộ thu gom rác giữ gì và giải phóng gì, nhận ra bốn kiểu rò rỉ gây ra phần lớn vấn đề bộ nhớ ở front-end, đo chúng bằng đúng ba bộ đếm DevTools hiện, và sửa từng cái. Hàm cleanup trong effect của React, thứ bạn sẽ gặp ở khoá React, tồn tại chính vì các bug trong bài này.</p>

<h3>Liên tưởng đời thường: thư viện và những tấm phiếu mượn</h3>
<p>Thư viện giữ một cuốn sách trên kệ chừng nào còn <em>một</em> tấm phiếu nào đó trong hệ thống trỏ tới nó. Mỗi tối thủ thư đi dò danh mục bắt đầu từ quầy lễ tân, đánh dấu mọi cuốn với tới được bằng cách lần theo phiếu; cuốn nào không được đánh dấu thì đem đi tái chế. Bạn không bao giờ tự tay vứt sách — bạn chỉ thôi không trỏ tới nó nữa. Rò rỉ là một tấm phiếu bị bỏ quên trong ngăn kéo: không ai đọc cuốn đó nữa, nhưng vì còn phiếu trỏ tới nên nó nằm trên kệ mãi mãi. Trong JavaScript, "quầy lễ tân" là tập các <strong>gốc (root)</strong> (đối tượng toàn cục <code>window</code>, code đang chạy, listener và timer đã đăng ký), phiếu là các <strong>tham chiếu</strong>, còn thủ thư là <strong>bộ thu gom rác (garbage collector)</strong>.</p>

<h3>Bước 1 — khả năng với tới: luật duy nhất quan trọng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bắt đầu từ các gốc</span><span class="lz-d"><code>window</code> và biến toàn cục, biến của các hàm còn đang chạy, listener và timer trình duyệt đang giữ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lần theo mọi tham chiếu</span><span class="lz-d">Thuộc tính object, phần tử mảng, mục trong Map, biến bị closure bắt giữ (bài 11.1).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đánh dấu thứ với tới được</span><span class="lz-d">Với tới được = vẫn đang dùng, theo định nghĩa — dù code của bạn "không bao giờ" đụng lại nó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Quét phần còn lại</span><span class="lz-d">Mọi thứ không được đánh dấu bị giải phóng. Trong JavaScript bạn không tự giải phóng bộ nhớ được; bạn chỉ có thể làm cho thứ gì đó không còn với tới được.</span></div>
</div>
<p>Một hệ quả làm người đọc các hướng dẫn cũ bất ngờ: các object trỏ <em>vào nhau</em> tự chúng không phải vấn đề. Ở đây, 20 cặp object tham chiếu lẫn nhau thành vòng, mỗi cặp giữ khoảng 2&nbsp;MB. Số đo lấy từ Chromium sau khi ép một lần gom rác toàn phần:</p>
${ma('javascript', CODE['_t15/bo-nho/cycle.js'])}
${ra(OUT['_t15/out/15-4-vong'])}
<p>Sau <code>keep = []</code> các vòng vẫn còn đó, nhưng không gốc nào với tới được, nên toàn bộ ~38&nbsp;MB được trả lại. Một bộ thu gom chỉ đếm tham chiếu sẽ không bao giờ giải phóng được một vòng; engine hiện đại dò từ gốc, nên câu cần hỏi về bất kỳ chỗ rò rỉ nào không bao giờ là "có vòng không?" mà là <strong>"thứ gì còn với tới được đang trỏ vào cái này?"</strong></p>

<h3>Bước 2 — thí nghiệm: gắn và gỡ 30 lần</h3>
<p>Mỗi widget dưới đây làm đúng việc của một hộp thoại, một biểu đồ hay một trang trong ứng dụng một trang: tạo ít DOM, giữ khoảng 1&nbsp;MB dữ liệu, đăng ký một thứ gì đó, rồi sau đó bị gỡ đi. Mỗi kịch bản chạy trên một trang sạch: 30 lần gắn + gỡ, rồi ép gom rác, rồi đọc ba con số — kích thước heap JavaScript, số nút DOM, số event listener. Đây đúng là ba đường DevTools vẽ trong <strong>More tools → Performance monitor</strong>, nên bạn lặp lại được thí nghiệm trên trang của chính mình.</p>
${ra(OUT['_t15/out/15-4-gan-go-30-lan'])}
<p>Mọi dòng "đã sửa" kết thúc đúng ở chỗ xuất phát. Mọi dòng rò rỉ đều giữ lại thứ gì đó sau mỗi lần gắn. Xem từng cái một.</p>

<h3>Rò rỉ 1 — listener không bao giờ được gỡ</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [6, 23])}
<p>Widget đã biến khỏi trang, nhưng <code>window</code> — một gốc — vẫn giữ <code>onResize</code> trong danh sách listener của nó. <code>onResize</code> là một closure trên <code>el</code> và <code>points</code>, nên phần tử và 1&nbsp;MB của nó vẫn với tới được: +28,6&nbsp;MB và +30 listener sau 30 lần gắn. Bản sửa truyền <code>signal</code> của một <code>AbortController</code> vào <code>addEventListener</code>; một lệnh <code>controller.abort()</code> gỡ listener đó (hoặc mọi listener đăng ký với signal ấy — tiện khi widget đăng ký năm cái). Cách cũ tương đương là <code>removeEventListener</code> với <em>đúng</em> tham chiếu hàm đó.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gỡ nhầm một hàm khác.</strong> <code>window.removeEventListener('resize', () =&gt; update())</code> không gỡ gì cả: arrow function đó là một object mới tinh, không phải cái bạn đã thêm. Giữ handler trong một biến, hoặc dùng <code>signal</code> — cách này không cần tham chiếu hàm.</p></div>

<h3>Rò rỉ 2 — timer không bao giờ được dừng</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [25, 39])}
<p>Trình duyệt giữ mọi callback <code>setInterval</code> đang hoạt động ở trạng thái với tới được cho tới khi bị dừng — tức là mãi mãi, với một interval. Callback nhắc tới <code>el</code> và <code>points</code>, nên vẫn là 28,6&nbsp;MB đó, cộng thêm 30 timer cứ mỗi phút lại chạy, cập nhật những phần tử không ai nhìn thấy. Cách sửa: giữ id và gọi <code>clearInterval(id)</code> khi gỡ. Điều tương tự áp dụng cho <code>setTimeout</code> tự hẹn lại, vòng lặp <code>requestAnimationFrame</code>, handler WebSocket và <code>IntersectionObserver</code> (gọi <code>disconnect()</code>).</p>

<h3>Rò rỉ 3 — DOM tách rời: rời khỏi trang, vẫn nằm trong một mảng</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [41, 60])}
<p>Nhìn lại dòng kết quả: heap JavaScript chỉ tăng <strong>0,3&nbsp;MB</strong>, vậy mà số nút DOM nhảy từ 14 lên <strong>33.074</strong>. Mỗi bảng (100 dòng × 5 ô cùng chữ bên trong) đã bị gỡ khỏi trang nhưng lại được đẩy vào <code>recentlyClosed</code> "phòng khi người dùng mở lại". Một phần tử đã gỡ mà JavaScript vẫn tham chiếu gọi là phần tử <strong>tách rời (detached)</strong>, và nó giữ sống cả cây con của mình. Bản thân các nút DOM không nằm trong heap JavaScript mà bộ đếm này đo — vì vậy bạn phải nhìn cả đường <em>DOM Nodes</em>, không chỉ "JS heap size".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin một con số.</strong> Nếu chỉ nhìn JS heap size, bạn sẽ kết luận Rò rỉ 3 là "ổn". Dùng cả ba bộ đếm, và xác nhận bằng heap snapshot (Bước 3), nơi các phần tử tách rời hiện ra theo tên.</p></div>

<h3>Rò rỉ 4 — dữ liệu phụ trong Map, và vì sao có WeakMap</h3>
${ma('javascript', CODE['_t15/bo-nho/widgets.js'], [62, 76])}
<p>Gắn dữ liệu phụ cho một phần tử (điểm của biểu đồ, trạng thái tooltip) trong một <code>Map</code> có khoá là phần tử trông gọn gàng, nhưng <code>Map</code> giữ khoá "mạnh": chừng nào Map còn với tới được, mọi phần tử từng làm khoá — cùng giá trị của nó — vẫn sống. <code>WeakMap</code> giữ khoá "yếu": một mục không giữ cho khoá sống, và khi khoá không còn với tới được, mục đó cùng giá trị đi theo. Vì vậy khoá của WeakMap phải là object, và nó không có <code>size</code>, không lặp qua được: nội dung của nó có thể đổi bất cứ lúc nào bộ thu gom chạy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Map</span><span class="v">Bạn sở hữu các mục: cache có giới hạn kích thước, tra theo id, thứ cần liệt kê hay đếm. Bạn phải tự xoá mục.</span></div>
  <div class="kv"><span class="k">WeakMap</span><span class="v">Dữ liệu nên sống đúng bằng một object nào đó: metadata về phần tử DOM, dữ liệu riêng của thực thể class.</span></div>
  <div class="kv"><span class="k">WeakRef</span><span class="v">Hiếm khi cần: "tôi muốn dùng object này nếu nó còn". Thời điểm không được bảo đảm — đừng dựng logic trên nó.</span></div>
</div>

<h3>Bước 3 — tìm chỗ rò rỉ trong trang của chính bạn</h3>
<ol>
  <li><strong>Tái hiện bằng vòng lặp.</strong> Rò 1&nbsp;MB mỗi thao tác thì làm một lần không thấy, làm 30 lần thì lộ rõ. Mở và đóng hộp thoại đáng ngờ 20–30 lần (hoặc gọi hàm mở/đóng trong console bằng vòng lặp).</li>
  <li><strong>Theo dõi ba bộ đếm.</strong> DevTools → More tools → <strong>Performance monitor</strong>: JS heap size, DOM Nodes, JS event listeners. Bấm biểu tượng thùng rác ở panel <strong>Memory</strong> để ép gom rác trước — chỉ bộ nhớ sống sót qua một lần gom mới là rò rỉ.</li>
  <li><strong>So hai heap snapshot.</strong> Panel Memory → Heap snapshot, làm thao tác 10 lần, chụp thêm một cái, chọn "Comparison". Sắp theo "# Delta": thứ tăng đúng 10 là nghi phạm. Gõ <code>Detached</code> vào ô lọc lớp để liệt kê phần tử DOM tách rời.</li>
  <li><strong>Lần theo kẻ giữ.</strong> Bấm vào một object bị rò; khung "Retainers" cho thấy chuỗi tham chiếu giữ nó sống — ví dụ <code>onResize</code> trong danh sách listener của <code>Window</code>. Mắt xích đầu tiên bạn không cố ý tạo ra chính là bug.</li>
  <li><strong>Kiểm tra listener trực tiếp.</strong> Trong console của DevTools, <code>getEventListeners(window)</code> hoặc <code>getEventListeners(document)</code> liệt kê những gì đã đăng ký (hàm tiện ích chỉ có trong console, code của trang không dùng được).</li>
</ol>

<h3>🕵️ Góc hacker — danh sách không giới hạn là cái nút "làm sập tab" điều khiển từ xa</h3>
<p>Bộ nhớ là tài nguyên mà kẻ tấn công có thể bắt bạn tiêu. Nếu khung chat, luồng bình luận trực tiếp hay bảng thông báo nối mọi tin nhắn tới vào một mảng và vào DOM mà không bao giờ bỏ tin cũ, thì ai gửi được tin nhắn là người quyết định tab của người dùng bạn tốn bao nhiêu bộ nhớ. Một script spam vào phòng công khai hàng nghìn tin nhắn dài có thể làm tab của người khác chậm và cuối cùng sập — không phải lỗ hổng theo nghĩa cổ điển, chỉ là thiếu một giới hạn. Điều tương tự áp dụng cho log giữ trong bộ nhớ "để gỡ lỗi" (mảng <code>trace</code> trong lab dưới đây) và cho cache không có kích thước tối đa.</p>
<p><strong>Cách phòng:</strong> giữ tối đa N phần tử trong bộ nhớ (bỏ cái cũ nhất, tải lịch sử cũ khi cần), vẽ danh sách dài bằng ảo hoá để chỉ các dòng đang thấy tồn tại trong DOM (khoá React, bài 13.3), cho mọi cache một giới hạn kích thước, giới hạn tần suất và độ dài tin nhắn ở máy chủ, và không bao giờ giữ dữ liệu gỡ lỗi trong bản production.</p>

<div class="callout ok">
<p><strong>🧪 Lab (25 phút) — những cái toast rò rỉ</strong></p>
<p>Lưu trang dưới đây thành <code>lab-toasts.html</code> và mở bằng máy chủ cục bộ. Mỗi toast "Saved!" biến mất sau năm giây hoặc khi bạn bấm Escape — trên màn hình mọi thứ trông ổn.</p>
${ma('html', CODE['_t15/bo-nho/lab-toasts.html'])}
<p>Đo trong Chromium sau khi hiện và đóng 50 toast (mỗi cái đóng ngay bằng hàm mà <code>showToast</code> trả về), rồi ép gom rác:</p>
${ra(OUT['_t15/out/15-4-lab-toasts'])}
<ol>
  <li>Mở Performance monitor, chạy <code>for (let i = 0; i &lt; 50; i++) showToast('x')()</code> trong console, ép gom rác, và tái hiện ba con số ở trên.</li>
  <li>Dùng <code>getEventListeners(document)</code> và phép so heap snapshot để gọi tên hai thứ sống sót sau mỗi toast và chúng giữ sống cái gì.</li>
  <li>Sửa <code>close()</code> để toast đã đóng không để lại gì. Làm cho <code>close()</code> gọi hai lần vẫn an toàn.</li>
</ol>
<p><strong>Xong khi:</strong> sau 50 toast và một lần ép gom rác, JS heap, số nút DOM và số listener trở về giá trị ban đầu (bản sửa mẫu đo được 0,6&nbsp;MB → 0,6&nbsp;MB, 1 → 1 listener, 24 → 24 nút), và bấm Escape sau khi mọi toast đã đóng thì không có gì xảy ra.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">garbage collector (GC)</span><span class="v">bộ thu gom rác — tự giải phóng bộ nhớ không còn với tới được.</span></div>
  <div class="kv"><span class="k">root</span><span class="v">gốc — điểm xuất phát khi dò: window, code đang chạy, listener và timer đã đăng ký.</span></div>
  <div class="kv"><span class="k">reachable</span><span class="v">với tới được — đi theo tham chiếu từ một gốc mà tới được.</span></div>
  <div class="kv"><span class="k">memory leak</span><span class="v">rò rỉ bộ nhớ — thứ không còn dùng nhưng vẫn với tới được, nên không bị gom.</span></div>
  <div class="kv"><span class="k">detached DOM element</span><span class="v">phần tử DOM tách rời — đã gỡ khỏi trang nhưng JS vẫn giữ tham chiếu.</span></div>
  <div class="kv"><span class="k">WeakMap</span><span class="v">Map giữ khoá "yếu" — không giữ khoá sống; khoá mất thì mục cũng mất.</span></div>
  <div class="kv"><span class="k">heap snapshot</span><span class="v">ảnh chụp heap — danh sách mọi đối tượng trong bộ nhớ ở một thời điểm.</span></div>
  <div class="kv"><span class="k">retainer</span><span class="v">kẻ giữ — đối tượng đang trỏ tới (và giữ sống) một đối tượng khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>GC giải phóng thứ không gốc nào với tới được; vòng tham chiếu cũng được gom. Hãy hỏi "thứ gì còn đang trỏ vào cái này?".</li>
  <li>Bốn rò rỉ kinh điển ở front-end: listener trên <code>window</code>/<code>document</code>, interval không dừng, DOM tách rời giữ trong mảng, dữ liệu phần tử trong <code>Map</code>. Đo được: ~28,6&nbsp;MB hoặc ~33.000 nút sau 30 lần gắn.</li>
  <li>Cách sửa: signal của <code>AbortController</code> hoặc <code>removeEventListener</code> với đúng hàm đó, <code>clearInterval</code>/<code>disconnect()</code>, bỏ tham chiếu tới phần tử đã gỡ, <code>WeakMap</code> cho dữ liệu gắn theo object.</li>
  <li>Theo dõi cùng lúc JS heap, nút DOM và listener — DOM tách rời gần như không làm JS heap nhúc nhích.</li>
  <li>Tái hiện bằng vòng lặp, ép GC, so heap snapshot, lần theo kẻ giữ.</li>
  <li>Danh sách và cache không giới hạn để người khác quyết định người dùng của bạn tốn bao nhiêu bộ nhớ: hãy đặt trần.</li>
</ul>
${nguon('📗', 'MDN — Memory management', 'Khả năng với tới, mark-and-sweep, và vì sao vòng tham chiếu không còn là vấn đề', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management')}
${nguon('🛠️', 'Chrome DevTools — Fix memory problems', 'Performance monitor, heap snapshot, phần tử tách rời, retainer', 'https://developer.chrome.com/docs/devtools/memory-problems')}
${nguon('📗', 'MDN — EventTarget.addEventListener (tuỳ chọn signal)', 'Gỡ listener bằng AbortSignal', 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener')}
${nguon('📗', 'MDN — WeakMap', 'Khoá giữ yếu, vì sao không có size và không lặp được', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-1-closure', title: 'Bài 11.1 — closure', sub: 'Vì sao closure giữ sống mọi biến nó nhắc tới — gốc rễ của Rò rỉ 1 và 2', cta: 'Mở bài' })}
${lienKet({ khoa: 'react', bai: 'rx-4-1-use-effect', title: 'React 4.1 — useEffect, dependency và cleanup', sub: 'Hàm cleanup là nơi đặt removeEventListener / clearInterval / abort()', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-16-5-ro-ri-bo-nho', title: 'Node.js 16.5 — bộ nhớ: cái cache không bao giờ quên', sub: 'Cùng những rò rỉ đó trên máy chủ, nơi chúng rốt cuộc giết cả tiến trình', cta: 'Mở bài' })}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-7-4-allocator', title: 'OS for Developers 7.4 — bộ cấp phát và bộ thu gom rác', sub: 'V8 thật sự gom rác thế nào: thế hệ, và hệ điều hành nhìn thấy gì', cta: 'Mở bài' })}
</div>
`,
};
