/**
 * 8.4 — Rò rỉ bộ nhớ ở mức nhận biết: heap tăng mãi, heap snapshot, OOMKilled (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: Node 22.22 (--inspect + CDP HeapProfiler.takeHeapSnapshot, phân tích snapshot bằng tools/js/heap.mjs), docker --memory (node:22-alpine,
 * eclipse-temurin:25-jdk), JDK 25 (jcmd GC.class_histogram, jstat -gcutil, HeapDumpOnOutOfMemoryError) — scratchpad/dbg/lab/ch8 (tools/c84-*.sh; o-84-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { RO_JS, HEAP_JS, TAI_JS, J_RO } from './_ma-8.mjs';
import { TANG, SO, GIU, RO_SUA, OOM_V8, OOM, OOM_GH, J_HIST, J_JSTAT, J_OOM, J_HPROF } from './_ra-8.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_SUA = ma(`// SỬA (1): cache có TRẦN — LRU đơn giản bằng thứ tự chèn của Map (hoặc thư viện lru-cache, có cả TTL)
if (cache.has(q)) { const v = cache.get(q); cache.delete(q); cache.set(q, v); return v; }   // dùng ⇒ đưa lên cuối
cache.set(q, kq);
if (cache.size &gt; 500) cache.delete(cache.keys().next().value);                              // vượt trần ⇒ bỏ mục cũ nhất

// SỬA (2): listener gắn theo request phải được GỠ khi request kết thúc
bus.once('gia-doi', khiGiaDoi);
res.on('close', () =&gt; bus.off('gia-doi', khiGiaDoi));
// Java tương đương: Caffeine.newBuilder().maximumSize(500).expireAfterWrite(Duration.ofMinutes(10)).build()`);

const MA_CDP = ma(`# Ba cách chụp heap snapshot của một tiến trình Node đang chạy
# 1) DevTools: node --inspect=127.0.0.1:9229 app.js  →  chrome://inspect  →  Memory  →  Heap snapshot  →  Take snapshot
# 2) Không cần mở cổng:   node --heapsnapshot-signal=SIGUSR2 app.js   rồi   kill -USR2 &lt;pid&gt;   (ghi tệp .heapsnapshot ở thư mục làm việc)
# 3) Trong mã:            require('node:v8').writeHeapSnapshot()
# Sắp chết vì hết heap:   node --heapsnapshot-near-heap-limit=2 app.js   (tự chụp khi gần chạm trần)
# CẢNH BÁO: chụp snapshot dừng tiến trình vài giây và cần bộ nhớ ~ gấp đôi heap — trên production chỉ làm ở một instance đã rút khỏi load balancer`, 'bash');

const BANG_DAU_HIEU_EN = `<table>
<thead><tr><th>Signal</th><th>Where you see it</th><th>Means</th></tr></thead>
<tbody>
<tr><td>Memory after GC climbs like stairs, never returns</td><td><code>process.memoryUsage()</code>, <code>jstat -gcutil</code> column O, Grafana</td><td>something keeps references (a leak)</td></tr>
<tr><td>Saw-tooth that returns to the same floor</td><td>same graphs</td><td>normal garbage collection</td></tr>
<tr><td><code>MaxListenersExceededWarning</code></td><td>Node stderr</td><td>listeners added and never removed</td></tr>
<tr><td><code>FATAL ERROR: … JavaScript heap out of memory</code>, exit 134</td><td>container logs</td><td>V8 reached its own heap limit</td></tr>
<tr><td><code>java.lang.OutOfMemoryError: Java heap space</code></td><td>application log</td><td>JVM reached <code>-Xmx</code></td></tr>
<tr><td>Exit code 137, <code>OOMKilled=true</code>, no message</td><td><code>docker inspect</code>, <code>kubectl describe pod</code></td><td>the kernel killed the process at the container limit</td></tr>
<tr><td>Pod restarts every N days, slower before each restart</td><td>restart count, latency graphs</td><td>slow leak + more and more GC work</td></tr>
</tbody></table>`;

const BANG_DAU_HIEU_VI = `<table>
<thead><tr><th>Dấu hiệu</th><th>Thấy ở đâu</th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td>Bộ nhớ sau GC tăng như bậc thang, không bao giờ về lại</td><td><code>process.memoryUsage()</code>, cột O của <code>jstat -gcutil</code>, Grafana</td><td>có thứ đang giữ tham chiếu (rò rỉ)</td></tr>
<tr><td>Hình răng cưa quay về cùng một mức đáy</td><td>cùng các biểu đồ đó</td><td>thu gom rác bình thường</td></tr>
<tr><td><code>MaxListenersExceededWarning</code></td><td>stderr của Node</td><td>listener được thêm mà không bao giờ gỡ</td></tr>
<tr><td><code>FATAL ERROR: … JavaScript heap out of memory</code>, mã thoát 134</td><td>log container</td><td>V8 chạm trần heap của chính nó</td></tr>
<tr><td><code>java.lang.OutOfMemoryError: Java heap space</code></td><td>log ứng dụng</td><td>JVM chạm <code>-Xmx</code></td></tr>
<tr><td>Mã thoát 137, <code>OOMKilled=true</code>, không một dòng thông báo</td><td><code>docker inspect</code>, <code>kubectl describe pod</code></td><td>nhân Linux giết tiến trình ở giới hạn của container</td></tr>
<tr><td>Pod khởi động lại sau mỗi N ngày, chậm dần trước mỗi lần</td><td>số lần restart, biểu đồ độ trễ</td><td>rò rỉ chậm + GC làm việc ngày càng nhiều</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🟩', 'Node.js — Using heap snapshots', 'Ba cách chụp snapshot, --heapsnapshot-signal, --heapsnapshot-near-heap-limit, và cách so sánh.', 'https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot'),
  nguon('🧭', 'Chrome DevTools — Record heap snapshots', 'Các chế độ Summary / Comparison / Containment; Shallow size, Retained size, Retainers.', 'https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots'),
  nguon('🐳', 'Docker — Resource constraints', '--memory, --memory-swap, và hành vi OOM của nhân trong container.', 'https://docs.docker.com/engine/containers/resource_constraints/'),
  nguon('☕', 'JDK 25 — jcmd', 'GC.class_histogram, GC.heap_info, GC.heap_dump, Thread.print — gắn vào JVM đang chạy, không cần khởi động lại.', 'https://docs.oracle.com/en/java/javase/25/docs/specs/man/jcmd.html'),
  nguon('🛡', 'CCC 38C3 — "Wir wissen wo dein Auto steht" (12/2024)', 'Heap dump của Spring Boot Actuator để lộ ở Cariad (Volkswagen) chứa khoá cloud ⇒ dữ liệu vị trí khoảng 800.000 xe điện.', 'https://media.ccc.de/v/38c3-wir-wissen-wo-dein-auto-steht-volksdaten-von-volkswagen'),
  lienKet({ khoa: 'performance-load-testing', bai: 'perf-6-5-bo-nho', title: 'Kiểm thử hiệu năng & tải 6.5 — Bộ nhớ Node.js', sub: 'Profiling heap chuyên sâu — bài này chỉ dừng ở mức nhận biết.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'performance-load-testing', bai: 'perf-7-3-gc', title: 'Kiểm thử hiệu năng & tải 7.3 — GC của Java', sub: 'JFR, nhật ký GC, chọn bộ thu gom và cỡ heap.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-3-4-attach', title: 'Bài 3.4 — --inspect và an toàn cổng 9229', sub: 'Chỉ bind 127.0.0.1; cổng inspector mở ra mạng = chạy mã tuỳ ý.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '8.4 — Memory leaks, recognition level: growing heap, heap snapshots, OOMKilled|||8.4 — Rò rỉ bộ nhớ ở mức nhận biết: heap tăng mãi, heap snapshot, OOMKilled',
  slug: 'dbg-8-4-bo-nho',
  type: 'LESSON',
  isFreePreview: true,
  description: 'API "tìm phòng" có hai rò rỉ thật (cache theo chuỗi q không giới hạn, listener gắn theo request không gỡ): heap 27 → 57 → 106 MB sau 2.000/6.000/12.000 request, MaxListenersExceededWarning. Chụp hai heap snapshot qua --inspect (đúng lệnh HeapProfiler mà DevTools gửi), so sánh: ServerResponse +10.000 — request xong từ lâu vẫn còn; đường Retainers chỉ thẳng biến cache và bus. Bản sửa: LRU 500 mục + once/off ⇒ heap răng cưa 15–34 MB. Ba kiểu chết: --max-old-space-size=64 ⇒ FATAL, mã 134; container 128 MB nhưng V8 tự đặt trần 259 MB ⇒ exit 137 OOMKilled, không một dòng log; Buffer ngoài heap cũng 137. Java: GC.class_histogram hai lần, jstat cột O, OutOfMemoryError + heap dump 74 MB mà strings đọc được chuỗi JDBC và mật khẩu (Cariad 2024). JVM trong container 512 MB mặc định heap 128 MB.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>The service that dies every two days</h2>
<p class="lead">A memory leak rarely shows up as an error. It shows up as a service that gets slower and then restarts — every two days in production, never on your laptop where you restart it twenty times an hour. In a garbage-collected language (JavaScript, Java) a leak means one thing: <strong>something still holds a reference to objects you no longer need</strong>, so the collector is not allowed to free them. The goal of this lesson is recognition, not tuning: see the shape on a graph, prove the growth with two heap snapshots, follow the <em>retainers</em> to the variable that holds them, and recognise the three ways a process dies of memory. Deep profiling is in the <em>performance-load-testing</em> course.</p>

<h3>An everyday picture: the shared fridge</h3>
<p>Your boarding house has one fridge. Everyone puts food in; nobody ever throws anything out, because "maybe someone still needs it". For weeks it looks fine — then one day nothing fits, and the landlord empties the whole fridge (the restart). The garbage collector is a cleaner who may only throw away food with <em>no name on it</em>. A leak is a name tag left on food nobody will eat again.</p>

<h3>1. A service with two classic leaks</h3>
<details><summary>tools/js/ro.mjs — the "room search" API (bugs + fixes behind SUA=1)</summary>${ma(RO_JS)}</details>
<details><summary>tools/js/tai.mjs — load generator</summary>${ma(TAI_JS)}</details>
${ra(TANG)}
<p>The heap grows with the number of requests and never comes back: 27 → 57 → 106 MB. Two counters added for debugging tell the story already — the cache has one entry per distinct search string, and one listener per request. Node itself warned at the 11th listener: <code>MaxListenersExceededWarning: Possible EventEmitter memory leak detected</code>. This warning is printed once and is easy to miss in a busy log — search for it. Do <strong>not</strong> silence it with <code>setMaxListeners(0)</code>.</p>

<h3>2. Prove it: compare two heap snapshots</h3>
${MA_CDP}
<p>The demo ran with <code>--inspect=127.0.0.1:41849</code> and took snapshots through the inspector with the same command DevTools sends (<code>HeapProfiler.takeHeapSnapshot</code>); a small script then reads the snapshot file the way the Memory tab's <em>Comparison</em> view does. Snapshot 1 after 12,000 requests, then 10,000 more, then snapshot 2:</p>
<details><summary>tools/js/heap.mjs — take a snapshot via CDP; Comparison; Retainers</summary>${ma(HEAP_JS)}</details>
${ra(SO)}
<p>How to read a Comparison: sort by size delta, but look for <strong>round numbers that match your workload</strong>. 10,000 requests happened between the snapshots, and there are exactly +10,000 <code>ServerResponse</code>, +10,000 <code>IncomingMessage</code>, +10,000 <code>KetQuaTim</code> and +10,000 <code>khiGiaDoi</code> closures. Requests that finished long ago should not still exist — something keeps them alive. The top rows (strings, arrays, <code>Object</code>) are the <em>contents</em> of the leaked objects; they are big but they do not tell you who is responsible. Note also <strong>shallow</strong> size (the object itself, 469 KB for 10,000 <code>KetQuaTim</code>) versus <strong>retained</strong> size (everything that would be freed with it — here most of the 36 MB of strings).</p>
${ra(GIU)}
<p>The <em>Retainers</em> panel answers "who holds this?". Read from the top: a <code>KetQuaTim</code> is element 8295 of the table of a <code>Map</code> called <code>cache</code> in the module's scope, which lives as long as the server. The listener path: closure <code>khiGiaDoi</code> → array <code>gia-doi</code> → <code>_events</code> of the <code>EventEmitter</code> called <code>bus</code>. And because each closure captures <code>res</code>, it also keeps every <code>ServerResponse</code> — and its socket buffers — alive. That is the second lesson of retainers: a tiny closure can retain a huge object graph.</p>
${MA_SUA}
${ra(RO_SUA)}
<p>After the fix the cache stays at 500 entries, no listener survives its request, and the heap goes up and down (15–34 MB) as the GC works: a <em>saw-tooth</em> with a stable floor instead of a staircase. One measurement is not proof — leaks need a trend over time and load, so measure at several points.</p>
${BANG_DAU_HIEU_EN}

<h3>3. Three ways to die of memory</h3>
${ra(OOM_V8)}
<p><strong>V8 reaches its own limit.</strong> With <code>--max-old-space-size=64</code> the GC works harder and harder (Mark-Compact frees almost nothing: 72.6 → 68.7 MB), then V8 aborts with <code>FATAL ERROR: Reached heap limit</code>, exit 134. You get a message and a GC trace — good.</p>
${ra(OOM)}
<p><strong>The kernel kills the container.</strong> The container had 128 MB, but Node set its heap limit to <strong>259 MB</strong> — more than the container. So V8 never reached its limit; the kernel's OOM killer did first: exit <strong>137</strong> (128 + signal 9), <code>OOMKilled=true</code>, and <em>not a single line</em> in the logs. Leaking <code>Buffer</code>s (file uploads, image processing) ends the same way, because Buffer memory lives outside the V8 heap and no heap flag protects it. In Kubernetes this appears as <code>Last State: Terminated, Reason: OOMKilled, Exit Code: 137</code> in <code>kubectl describe pod</code>. Meanwhile the JVM in a 512 MB container defaulted to a 128 MB heap (25% of the container) — often too small, the opposite problem. Set the limits explicitly:</p>
${ra(OOM_GH)}
<p>With <code>--max-old-space-size=96</code> in a 128 MB container, V8 dies first and leaves the <code>FATAL ERROR</code> line in the log; <code>OOMKilled=false</code>. (Here the exit code was 139 rather than 134: on Alpine/musl the abort after the fatal error ended as SIGSEGV — what matters is the message and <code>OOMKilled</code>.) Rule of thumb: Node heap about 75% of the container limit; Java <code>-XX:MaxRAMPercentage=75</code>.</p>

<h3>4. Java: histogram, GC statistics, heap dump</h3>
<details><summary>java/thu/Ro.java — a "session cache" that only grows</summary>${ma(J_RO, 'java')}</details>
${ra(J_HIST)}
<p><code>jcmd &lt;pid&gt; GC.class_histogram</code> attaches to a running JVM (no restart, no flags) and lists instances per class. Take it twice: in five seconds <code>Ro$PhienDangNhap</code> went from 14,000 to 31,000 instances and the byte arrays doubled. Ignore the JDK classes at the top (<code>[B</code> = byte arrays, <code>String</code>) and look for the first class of <em>your</em> package that grows — same idea as the Node comparison. (On a big heap this command triggers a full GC; on production do it on one instance at a quiet moment.)</p>
${ra(J_JSTAT)}
<p><code>jstat -gcutil</code> every 2 s: the Old generation (<code>O</code>) keeps filling and the GC counters go up — memory that survives collection. VisualVM and IntelliJ's profiler show the same data as graphs; Eclipse MAT opens a heap dump and computes "leak suspects" with retained sizes.</p>
${ra(J_OOM)}
<p>With <code>-XX:+HeapDumpOnOutOfMemoryError</code> the JVM writes a heap dump at the moment it dies — exactly the evidence you need, captured even at 3 a.m. Always set it in production with a path on a volume that survives the restart.</p>

<h3>🛡 Hacker's corner: a heap dump is a copy of every secret</h3>
${ra(J_HPROF)}
<p>A heap dump contains every live object: tokens, session ids, the database URL and the database password. <code>strings</code> on the 74 MB file found all three in seconds. Node heap snapshots are the same — and so is a HAR file (lesson 5.2). In December 2024 the Chaos Computer Club showed that Cariad, Volkswagen's software company, had left the Spring Boot Actuator <code>/actuator/heapdump</code> endpoint reachable; the dump contained cloud credentials, which led to location data of around 800,000 electric cars (CCC 38C3 talk "Wir wissen wo dein Auto steht"). Rules: never expose <code>heapdump</code>/<code>env</code> actuator endpoints (<code>management.endpoints.web.exposure.include=health,info</code>), treat dump files as secrets (encrypted storage, delete after analysis), never attach one to a public ticket or an AI chat.</p>

<h3>On the job</h3>
<p>A leak ticket rarely says "leak". It says <em>"Service booking bị restart 3 lần/tuần, lần nào trước đó cũng chậm"</em>. Your plan: get the memory graph after GC over days (not minutes); check the restart reason (<code>OOMKilled</code> 137 vs a V8/JVM OOM message); ask what changed around the time it started (a new cache, a new event listener, a new library — lesson 9.1 helps); reproduce locally with a load script and two snapshots; name the retaining variable in the ticket. Raising the memory limit is a valid <em>temporary</em> mitigation — write it as such, with the date it buys you.</p>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>tools/c84-node.sh</code>. Then open the same server with <code>--inspect</code> in Chrome (<code>chrome://inspect</code>), take two snapshots yourself and find <code>KetQuaTim</code> in the Comparison view and its Retainers.</li>
<li>Remove only one of the two fixes. Which counters still grow, and which rows of the Comparison change?</li>
<li>Run <code>tools/c84-oom.sh</code>. Find the smallest <code>--max-old-space-size</code> at which the container dies with a message instead of 137.</li>
<li>Run <code>tools/c84-java.sh</code>, then cap <code>PHIEN</code> with an LRU (<code>LinkedHashMap</code> + <code>removeEldestEntry</code>) or Caffeine and show two histograms where the count stays flat.</li>
<li>Check your own Spring project: which actuator endpoints are exposed? Is <code>heapdump</code> reachable without authentication?</li>
</ol>
<p><strong>Done when:</strong> you can show the growing class in two snapshots/histograms, name the variable that retains it, and show a flat trend after the fix.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Memory leak (GC languages)</span><span class="v">Unneeded objects still reachable from a root, so the GC cannot free them.</span></div>
  <div class="kv"><span class="k">Heap snapshot / heap dump</span><span class="v">File with every live object and the references between them.</span></div>
  <div class="kv"><span class="k">Shallow vs retained size</span><span class="v">The object itself / everything freed if it were freed.</span></div>
  <div class="kv"><span class="k">Retainers</span><span class="v">The chain of references from a GC root to an object.</span></div>
  <div class="kv"><span class="k">OOMKilled (137)</span><span class="v">Killed by the kernel at the container's memory limit, no log line.</span></div>
  <div class="kv"><span class="k">Class histogram</span><span class="v">Instances and bytes per class in a running JVM (<code>jcmd GC.class_histogram</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Leak = growth that survives GC; look at the trend after GC, over time and load.</li>
<li>Usual suspects: unbounded caches/maps, listeners never removed, closures capturing big objects, static collections.</li>
<li>Two snapshots + Comparison: look for counts matching the workload, then follow Retainers to a variable.</li>
<li>Exit 137 + <code>OOMKilled</code> = the kernel, silently; set the runtime heap below the container limit.</li>
<li>Java: <code>GC.class_histogram</code> twice, <code>jstat -gcutil</code>, heap dump on OOM.</li>
<li>Heap dumps and snapshots contain secrets — protect them like passwords.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Dịch vụ cứ hai ngày lại chết một lần</h2>
<p class="lead">Rò rỉ bộ nhớ hiếm khi hiện ra dưới dạng lỗi. Nó hiện ra dưới dạng một dịch vụ chậm dần rồi khởi động lại — trên production cứ hai ngày một lần, còn trên laptop thì không bao giờ, vì ở đó bạn khởi động lại nó hai mươi lần một giờ. Trong ngôn ngữ có thu gom rác (JavaScript, Java), rò rỉ chỉ có một nghĩa: <strong>có thứ vẫn giữ tham chiếu tới những đối tượng bạn không còn cần</strong>, nên bộ thu gom không được phép giải phóng chúng. Mục tiêu của bài là nhận biết, không phải tinh chỉnh: thấy hình dạng trên biểu đồ, chứng minh mức tăng bằng hai heap snapshot, lần theo <em>retainers</em> tới biến đang giữ chúng, và nhận ra ba cách một tiến trình chết vì bộ nhớ. Profiling chuyên sâu nằm ở khoá <em>performance-load-testing</em>.</p>

<h3>Liên tưởng đời thường: chiếc tủ lạnh chung</h3>
<p>Nhà trọ của bạn có một tủ lạnh. Ai cũng bỏ đồ vào; không ai vứt gì ra, vì "biết đâu có người còn cần". Hàng tuần trông vẫn ổn — rồi một ngày chẳng nhét thêm được gì, và chủ nhà dọn sạch cả tủ (lần khởi động lại). Bộ thu gom rác là người dọn dẹp chỉ được vứt những món <em>không có tên ai</em>. Rò rỉ là một mẩu giấy ghi tên còn dán trên món đồ không ai ăn nữa.</p>

<h3>1. Một dịch vụ có hai rò rỉ kinh điển</h3>
<details><summary>tools/js/ro.mjs — API "tìm phòng" (lỗi + bản sửa sau SUA=1)</summary>${ma(RO_JS)}</details>
<details><summary>tools/js/tai.mjs — công cụ tạo tải</summary>${ma(TAI_JS)}</details>
${ra(TANG)}
<p>Heap tăng theo số request và không bao giờ giảm lại: 27 → 57 → 106 MB. Hai bộ đếm thêm vào để gỡ lỗi đã kể hết câu chuyện — cache có một mục cho mỗi chuỗi tìm kiếm khác nhau, và một listener cho mỗi request. Chính Node đã cảnh báo ở listener thứ 11: <code>MaxListenersExceededWarning: Possible EventEmitter memory leak detected</code>. Cảnh báo này chỉ in một lần và rất dễ bị lẫn trong log bận rộn — hãy tìm nó. <strong>Đừng</strong> dập nó bằng <code>setMaxListeners(0)</code>.</p>

<h3>2. Chứng minh: so sánh hai heap snapshot</h3>
${MA_CDP}
<p>Demo chạy với <code>--inspect=127.0.0.1:41849</code> và chụp snapshot qua inspector bằng đúng lệnh DevTools gửi (<code>HeapProfiler.takeHeapSnapshot</code>); một script nhỏ sau đó đọc tệp snapshot theo cách khung <em>Comparison</em> của tab Memory làm. Snapshot 1 sau 12.000 request, thêm 10.000 request nữa, rồi snapshot 2:</p>
<details><summary>tools/js/heap.mjs — chụp snapshot qua CDP; Comparison; Retainers</summary>${ma(HEAP_JS)}</details>
${ra(SO)}
<p>Đọc Comparison thế nào: sắp theo mức tăng kích thước, nhưng hãy tìm <strong>những con số tròn khớp với khối lượng việc của bạn</strong>. Giữa hai lần chụp có 10.000 request, và có đúng +10.000 <code>ServerResponse</code>, +10.000 <code>IncomingMessage</code>, +10.000 <code>KetQuaTim</code> và +10.000 closure <code>khiGiaDoi</code>. Request đã xong từ lâu thì không nên còn tồn tại — có thứ đang giữ chúng sống. Các dòng trên cùng (chuỗi, mảng, <code>Object</code>) là <em>nội dung</em> của các đối tượng bị rò; chúng to nhưng không cho biết ai chịu trách nhiệm. Để ý thêm kích thước <strong>shallow</strong> (chính đối tượng đó, 469 KB cho 10.000 <code>KetQuaTim</code>) so với kích thước <strong>retained</strong> (mọi thứ sẽ được giải phóng cùng nó — ở đây là phần lớn 36 MB chuỗi).</p>
${ra(GIU)}
<p>Khung <em>Retainers</em> trả lời câu "ai đang giữ cái này?". Đọc từ trên xuống: một <code>KetQuaTim</code> là phần tử 8295 trong bảng của một <code>Map</code> tên <code>cache</code> ở phạm vi module, thứ sống lâu bằng server. Đường của listener: closure <code>khiGiaDoi</code> → mảng <code>gia-doi</code> → <code>_events</code> của <code>EventEmitter</code> tên <code>bus</code>. Và vì mỗi closure bắt lấy <code>res</code>, nó còn giữ sống mọi <code>ServerResponse</code> — cùng bộ đệm socket của chúng. Đó là bài học thứ hai của retainers: một closure bé xíu có thể giữ cả một đồ thị đối tượng khổng lồ.</p>
${MA_SUA}
${ra(RO_SUA)}
<p>Sau khi sửa, cache đứng ở 500 mục, không listener nào sống lâu hơn request của nó, và heap lên xuống (15–34 MB) theo nhịp GC: một hình <em>răng cưa</em> có mức đáy ổn định thay vì bậc thang. Một lần đo không phải bằng chứng — rò rỉ cần một xu hướng theo thời gian và theo tải, nên hãy đo ở nhiều điểm.</p>
${BANG_DAU_HIEU_VI}

<h3>3. Ba cách chết vì bộ nhớ</h3>
${ra(OOM_V8)}
<p><strong>V8 chạm trần của chính nó.</strong> Với <code>--max-old-space-size=64</code>, GC làm việc ngày càng vất vả (Mark-Compact gần như không giải phóng được gì: 72,6 → 68,7 MB), rồi V8 dừng hẳn với <code>FATAL ERROR: Reached heap limit</code>, mã thoát 134. Bạn có thông báo và một vết GC — tốt.</p>
${ra(OOM)}
<p><strong>Nhân Linux giết container.</strong> Container có 128 MB, nhưng Node tự đặt trần heap <strong>259 MB</strong> — lớn hơn container. Vì vậy V8 không bao giờ chạm trần của nó; trình OOM killer của nhân ra tay trước: mã thoát <strong>137</strong> (128 + tín hiệu 9), <code>OOMKilled=true</code>, và <em>không một dòng nào</em> trong log. Rò rỉ <code>Buffer</code> (tải tệp lên, xử lý ảnh) cũng kết thúc như vậy, vì bộ nhớ Buffer nằm ngoài heap V8 và không cờ heap nào bảo vệ được. Trong Kubernetes nó hiện thành <code>Last State: Terminated, Reason: OOMKilled, Exit Code: 137</code> trong <code>kubectl describe pod</code>. Trong khi đó JVM trong container 512 MB mặc định lấy heap 128 MB (25% container) — thường là quá nhỏ, vấn đề ngược lại. Hãy đặt giới hạn tường minh:</p>
${ra(OOM_GH)}
<p>Với <code>--max-old-space-size=96</code> trong container 128 MB, V8 chết trước và để lại dòng <code>FATAL ERROR</code> trong log; <code>OOMKilled=false</code>. (Ở đây mã thoát là 139 thay vì 134: trên Alpine/musl, lệnh abort sau lỗi FATAL kết thúc thành SIGSEGV — điều quan trọng là thông báo và <code>OOMKilled</code>.) Quy tắc ngón tay cái: heap của Node khoảng 75% giới hạn container; Java <code>-XX:MaxRAMPercentage=75</code>.</p>

<h3>4. Java: histogram, thống kê GC, heap dump</h3>
<details><summary>java/thu/Ro.java — một "cache phiên đăng nhập" chỉ có tăng</summary>${ma(J_RO, 'java')}</details>
${ra(J_HIST)}
<p><code>jcmd &lt;pid&gt; GC.class_histogram</code> gắn vào một JVM đang chạy (không cần khởi động lại, không cần cờ) và liệt kê số đối tượng theo lớp. Lấy hai lần: trong năm giây <code>Ro$PhienDangNhap</code> tăng từ 14.000 lên 31.000 đối tượng và mảng byte tăng gấp đôi. Bỏ qua các lớp của JDK ở trên cùng (<code>[B</code> = mảng byte, <code>String</code>) và tìm lớp đầu tiên thuộc package <em>của bạn</em> đang tăng — cùng ý tưởng với phép so sánh bên Node. (Trên heap lớn, lệnh này kích hoạt một lần full GC; trên production hãy làm ở một instance vào lúc vắng.)</p>
${ra(J_JSTAT)}
<p><code>jstat -gcutil</code> mỗi 2 giây: vùng Old (<code>O</code>) cứ đầy dần và các bộ đếm GC tăng — bộ nhớ sống sót qua các lần thu gom. VisualVM và profiler của IntelliJ hiện cùng dữ liệu đó dưới dạng biểu đồ; Eclipse MAT mở heap dump và tính "leak suspects" kèm retained size.</p>
${ra(J_OOM)}
<p>Với <code>-XX:+HeapDumpOnOutOfMemoryError</code>, JVM ghi một heap dump đúng lúc nó chết — chính là bằng chứng bạn cần, được thu cả khi sự cố xảy ra lúc 3 giờ sáng. Luôn bật nó trên production, với đường dẫn nằm trên một volume còn tồn tại sau khi khởi động lại.</p>

<h3>🛡 Góc hacker: heap dump là bản sao của mọi bí mật</h3>
${ra(J_HPROF)}
<p>Heap dump chứa mọi đối tượng còn sống: token, mã phiên, URL cơ sở dữ liệu và mật khẩu cơ sở dữ liệu. Lệnh <code>strings</code> trên tệp 74 MB tìm ra cả ba trong vài giây. Heap snapshot của Node cũng vậy — và tệp HAR cũng thế (bài 5.2). Tháng 12/2024, Chaos Computer Club chỉ ra rằng Cariad, công ty phần mềm của Volkswagen, để lộ endpoint <code>/actuator/heapdump</code> của Spring Boot Actuator; bản dump chứa thông tin đăng nhập cloud, dẫn tới dữ liệu vị trí của khoảng 800.000 xe điện (bài nói CCC 38C3 "Wir wissen wo dein Auto steht"). Luật: không bao giờ mở các endpoint actuator <code>heapdump</code>/<code>env</code> (<code>management.endpoints.web.exposure.include=health,info</code>), coi tệp dump là bí mật (lưu mã hoá, xoá sau khi phân tích), không bao giờ đính kèm nó vào ticket công khai hay một khung chat AI.</p>

<h3>Tình huống đi làm</h3>
<p>Ticket rò rỉ hiếm khi ghi chữ "rò rỉ". Nó ghi <em>"Service booking bị restart 3 lần/tuần, lần nào trước đó cũng chậm"</em>. Kế hoạch của bạn: lấy biểu đồ bộ nhớ sau GC theo ngày (không phải theo phút); kiểm lý do khởi động lại (<code>OOMKilled</code> 137 hay thông báo OOM của V8/JVM); hỏi điều gì đã thay đổi quanh thời điểm nó bắt đầu (một cache mới, một event listener mới, một thư viện mới — bài 9.1 sẽ giúp); tái hiện ở máy bằng script tải và hai snapshot; ghi tên biến đang giữ vào ticket. Tăng giới hạn bộ nhớ là biện pháp giảm nhẹ <em>tạm thời</em> hợp lệ — hãy ghi rõ như vậy, kèm khoảng thời gian nó mua được cho bạn.</p>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>tools/c84-node.sh</code>. Rồi mở chính server đó với <code>--inspect</code> trong Chrome (<code>chrome://inspect</code>), tự chụp hai snapshot và tìm <code>KetQuaTim</code> trong khung Comparison cùng Retainers của nó.</li>
<li>Chỉ bỏ một trong hai bản sửa. Bộ đếm nào còn tăng, và dòng nào của Comparison thay đổi?</li>
<li>Chạy <code>tools/c84-oom.sh</code>. Tìm <code>--max-old-space-size</code> nhỏ nhất mà container chết kèm thông báo thay vì 137.</li>
<li>Chạy <code>tools/c84-java.sh</code>, rồi đặt trần cho <code>PHIEN</code> bằng LRU (<code>LinkedHashMap</code> + <code>removeEldestEntry</code>) hoặc Caffeine và cho thấy hai histogram mà số đối tượng đứng yên.</li>
<li>Kiểm dự án Spring của bạn: những endpoint actuator nào đang mở? <code>heapdump</code> có truy cập được mà không cần xác thực không?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được lớp đang tăng trong hai snapshot/histogram, gọi tên biến đang giữ nó, và cho thấy xu hướng phẳng sau khi sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rò rỉ bộ nhớ (ngôn ngữ có GC)</span><span class="v">Đối tượng không cần nữa vẫn tới được từ một gốc, nên GC không giải phóng được.</span></div>
  <div class="kv"><span class="k">Heap snapshot / heap dump</span><span class="v">Tệp chứa mọi đối tượng còn sống và tham chiếu giữa chúng.</span></div>
  <div class="kv"><span class="k">Shallow vs retained size</span><span class="v">Chính đối tượng / mọi thứ được giải phóng nếu nó được giải phóng.</span></div>
  <div class="kv"><span class="k">Retainers</span><span class="v">Chuỗi tham chiếu từ một gốc GC tới đối tượng.</span></div>
  <div class="kv"><span class="k">OOMKilled (137)</span><span class="v">Bị nhân giết ở giới hạn bộ nhớ của container, không có dòng log nào.</span></div>
  <div class="kv"><span class="k">Class histogram</span><span class="v">Số đối tượng và số byte theo lớp trong JVM đang chạy (<code>jcmd GC.class_histogram</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Rò rỉ = phần tăng sống sót qua GC; nhìn xu hướng sau GC, theo thời gian và theo tải.</li>
<li>Nghi phạm quen thuộc: cache/map không giới hạn, listener không bao giờ gỡ, closure bắt đối tượng lớn, collection static.</li>
<li>Hai snapshot + Comparison: tìm số lượng khớp khối lượng việc, rồi lần theo Retainers tới một biến.</li>
<li>Mã thoát 137 + <code>OOMKilled</code> = nhân Linux, lặng lẽ; đặt heap của runtime thấp hơn giới hạn container.</li>
<li>Java: <code>GC.class_histogram</code> hai lần, <code>jstat -gcutil</code>, heap dump khi OOM.</li>
<li>Heap dump và snapshot chứa bí mật — bảo vệ như mật khẩu.</li>
</ul>
${NGUON}
</div>
`,
};
