/**
 * Chương 4 · 4.5 — Keep-alive, pool kết nối và timeout trong code của bạn (slug khung netdev-4-5-keepalive-pool).
 * Output thật: lab/out/c45-*.out.txt (dựng lại: bash lab/code/dung-output-ch4.sh).
 */
import { run, card, kv, cauNoi, code } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-04-5.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };

export default {
  title: '4.5 — Keep-alive, connection pools and timeouts in your code|||4.5 — Keep-alive, pool kết nối và timeout trong code của bạn',
  slug: 'netdev-4-5-keepalive-pool',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nơi TCP gặp code bạn viết: keep-alive và pool kết nối là thắng lợi độ trễ lớn nhất và cách sửa cạn cổng (http.Agent của Node, HikariCP của Java — bốn yêu cầu một socket); phân biệt connect timeout với read timeout; Nagle × delayed-ACK làm kẹt ~40 ms (đo 57→30 ms, TCP_NODELAY); và TCP keepalive bắt kết nối chết âm thầm sau NAT/tường lửa (mặc định 2 giờ là quá dài).',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Keep-alive, connection pools and timeouts in your code</h2>
<p class="lead">Everything so far has been TCP’s doing, in the kernel. This last lesson of the chapter is about the handful of decisions in <em>your</em> code that decide whether all that machinery helps you or hurts you: whether you reuse connections, how you pool them, and which timeouts you set. These are small lines — an agent option, a pool size, a timeout in milliseconds — with outsized effects on latency, resource use and resilience.</p>

<h3>The cheapest handshake is the one you skip</h3>
<p>Lesson 4.1 measured it: a reused connection drops a request from 51 ms to 27 ms by skipping the handshake. HTTP/1.1 keeps connections alive by default; <code>curl -v</code> shows the reuse plainly:</p>
${run('c45-ka', 'curl', 1)}
<p>“<strong>Re-using existing connection</strong>” — the second <code>GET</code> rides the open connection, no second handshake. Your job in code is simply to <em>hold onto</em> that connection instead of closing it after each call. That single habit is the biggest latency win in most services, and it is also the cure for the port exhaustion of lesson 4.4.</p>
${net('waterfall', 'warm', 'en', 'A warm connection skips DNS and the handshake — compare its waterfall to the cold one from lesson 4.1.', { tour: 'waterfall-phases' })}

<h3>A connection pool, counted</h3>
<p>A <strong>pool</strong> keeps a set of connections open and hands them out to requests, returning them when done. Node’s <code>http.Agent</code> is a pool; here the server counts how many TCP connections four requests actually use:</p>
${run('c45-node', 'node agent', 1)}
<p>With <code>keepAlive: false</code>, four requests open <strong>four</strong> connections — four handshakes, four ephemeral ports churned. With <code>keepAlive: true</code>, they share <strong>one</strong>. Every serious client has a pool; the mistake is creating a new client per request, which throws the pool away each time. Make one and share it across the app:</p>
${code(`// Node.js — one shared keep-alive agent for the whole process
import http from 'node:http';
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,          // most connections per host at once
  keepAliveMsecs: 15000,   // how often to probe an idle socket
});
export const get = (opts) => http.get({ ...opts, agent });`, 'js')}
${code(`// Java — HikariCP for the database (a pool is mandatory for JDBC)
HikariConfig cfg = new HikariConfig();
cfg.setMaximumPoolSize(10);
cfg.setConnectionTimeout(3000);   // ms to get a connection from the pool
cfg.setMaxLifetime(1_800_000);    // recycle before a middlebox kills it
// For HTTP, OkHttp / java.net.http.HttpClient reuse connections by default.`, 'java')}

<h3>Two timeouts people confuse</h3>
<p>“Timeout” is not one thing. The two that matter most cover different phases:</p>
<ul>
<li><strong>Connect timeout</strong> covers the handshake. Without it, a dead or firewalled dependency makes your request hang for the kernel’s ~2 minutes (the SYN retransmit of lesson 4.1). Set it to a few seconds.</li>
<li><strong>Read / request timeout</strong> covers waiting for the response <em>after</em> connecting. Without it, one slow backend holds your threads or event-loop slots open indefinitely — the usual cause of a cascading outage.</li>
<li><strong>Idle / pool timeout</strong> bounds how long a pooled connection may sit unused before it is closed or recycled — which leads to the next problem.</li>
</ul>

<h3>Nagle × delayed-ACK: the ~40 ms stall you can measure</h3>
<p>Two TCP features, each reasonable alone, interact badly. <strong>Nagle’s algorithm</strong> holds a small segment if earlier small data is still unacked, to avoid flooding the network with tiny packets. <strong>Delayed ACK</strong> lets a receiver wait up to ~40 ms to piggyback its ACK onto a reply. In a <em>write-write-read</em> pattern — a request split into two small writes — each side ends up waiting for the other. Measure it over the 25 ms lab link:</p>
${run('c45-nodelay', 'node nagle', 1)}
<p>With Nagle on (the default), each transaction takes <strong>57 ms</strong>; with <code>setNoDelay(true)</code> it drops to <strong>30 ms</strong> — the ~40 ms delayed-ACK stall, gone. For small request/response protocols (RPC, a custom line protocol, a DB wire protocol) set <strong>TCP_NODELAY</strong>. Most mature RPC libraries already do; the symptom to recognise is a protocol that is fast in bulk yet adds a fixed tax per round trip.</p>

<div class="pitfall co-tieu-de">
<p><strong>Do not reach for TCP_NODELAY everywhere.</strong> Nagle exists for a reason — it protects the network from a flood of tiny packets. Turn it off on sockets with a clear request/response, latency-sensitive pattern (RPC, interactive protocols). On a bulk stream it makes little difference, and disabling it reflexively can increase packet overhead. The real fix for the stall is often to coalesce your two writes into one (<code>write(header+body)</code>), which sidesteps both Nagle and the extra ACK.</p>
</div>

<h3>Connections that died silently</h3>
<p>A connection can be dead while both ends still believe it is open. A NAT or stateful firewall on the path keeps a table entry per connection, and <strong>drops idle entries</strong> after some minutes — without sending anything to either side. The next time you write, the packet goes nowhere and you wait for a timeout. TCP’s own keepalive can detect this, but look at the defaults:</p>
${run('c45-keepalive-opt', 'sysctl', 1)}
<p><code>tcp_keepalive_time = 7200</code> — <strong>two hours</strong> before the first probe. That is useless for catching a NAT that forgot you after 5 minutes. On long-lived connections (WebSocket, a database pool, a message-queue consumer) either lower this (per-socket, via <code>SO_KEEPALIVE</code> + <code>TCP_KEEPIDLE</code>) to a few minutes, or send your own application-level heartbeat. This is why chat apps ping, why database pools have a <code>maxLifetime</code>, and why “the connection works for a while then freezes” is almost always an idle middlebox, not a bug in your code.</p>

<div class="pitfall co-tieu-de">
<p><strong>A pooled connection that a middlebox silently killed is worse than no pool.</strong> If the pool hands out a connection the far side (or a NAT) has already dropped, the first request on it fails or hangs. Defences: a short <code>maxLifetime</code> so connections are recycled before they go stale, a validation query / ping on checkout, and a retry on a fresh connection for idempotent requests. This is exactly what HikariCP’s <code>maxLifetime</code> and <code>keepaliveTime</code> are for.</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li>The <strong>pool</strong> is your application’s data structure of open sockets (undici, HikariCP, Go’s transport) — the kernel knows nothing about “pooling”, only ESTABLISHED sockets.</li>
<li><strong>Keep-alive</strong> is an HTTP-level agreement (<code>Connection: keep-alive</code>) to not close after a response; underneath, TCP simply stays ESTABLISHED.</li>
<li><strong>TCP_NODELAY</strong> and <strong>SO_KEEPALIVE</strong> are per-socket options your code sets through the socket API; they change kernel behaviour for that one socket.</li>
<li><strong>Connect and read timeouts</strong> are enforced by your client library with timers; TCP has no notion of your deadline.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Handshake, reliability, UDP, and reading a real server', giong: 'TCP keeps a connection open and reliable, which keep-alive reuses', khac: 'NWC204 reads a connection at the protocol level without the application-side knobs', them: 'the http.Agent / HikariCP pool, connect vs read timeouts, a measured Nagle × delayed-ACK stall, and TCP keepalive for silently dropped connections — the code decisions that make TCP work for you' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an internal RPC service is “fast when we load-test it in a loop, but every real call from the web tier takes an extra 40 ms,” and separately the web tier sometimes hangs for two minutes when one dependency is down. Diagnose both with the lab.</p>
<ol>
<li>Reproduce the Nagle stall: with 25 ms delay on the router, run <code>node nagle-cli.mjs</code> (two small writes per transaction) and compare <code>NODELAY=false</code> vs <code>true</code>. Explain the ~40 ms.</li>
<li>Show pooling: run <code>node agent.mjs</code> and confirm <code>keepAlive:false</code> opens four connections while <code>true</code> opens one.</li>
<li>Reproduce the hang: <code>docker exec nfd-router iptables -A FORWARD -d 10.10.2.99 -j DROP</code>, then <code>curl http://10.10.2.99/</code> with and without <code>--connect-timeout 2</code>. Compare how long each takes to fail.</li>
<li>Write the two fixes: one for the 40 ms, one for the two-minute hang.</li>
</ol>
<p><strong>Done when:</strong> your numbers show NODELAY removing the ~27 ms stall, pooling collapsing four connections to one, and <code>--connect-timeout</code> turning a two-minute hang into a two-second failure — and your fixes name <code>TCP_NODELAY</code> (or coalescing the writes) and an explicit connect timeout.</p>
<details><summary>Solution</summary>
<p>Nagle on ≈ 57 ms/transaction, off ≈ 30 ms — the delayed-ACK stall. Fix: set <code>TCP_NODELAY</code> on the RPC socket (or send the request as one write). <code>agent.mjs</code>: keepAlive false → 4 connections, true → 1. The black-holed host hangs ~2 minutes without a connect timeout and fails in ~2 s with <code>--connect-timeout 2</code>. Fix: “The 40 ms is Nagle × delayed-ACK on a write-write-read RPC — enable TCP_NODELAY. The two-minute hang is a missing connect timeout — set one (2–3 s) on the HTTP client so a dead dependency fails fast instead of retransmitting SYNs for two minutes.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['keep-alive (giữ kết nối)', 'An HTTP agreement to reuse a connection for several requests, skipping the handshake.'],
  ['connection pool (pool kết nối)', 'A set of open connections your app reuses across requests (http.Agent, HikariCP).'],
  ['connect timeout (hạn kết nối)', 'Deadline for the handshake; without it a dead host hangs ~2 minutes.'],
  ['read timeout (hạn đọc)', 'Deadline for the response after connecting; without it a slow backend ties up threads.'],
  ['Nagle (thuật toán Nagle)', 'Holds a small segment while earlier small data is unacked, to coalesce tiny packets.'],
  ['delayed ACK (báo nhận trễ)', 'The receiver waits up to ~40 ms to piggyback its ACK — stalls write-write-read with Nagle.'],
  ['TCP_NODELAY (tắt Nagle)', 'A socket option that disables Nagle for latency-sensitive protocols.'],
  ['TCP keepalive (dò sống)', 'Probes an idle connection to detect a silent drop; default 2 h, usually too long.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Keep-alive and pooling are the biggest latency win and the real fix for port exhaustion — make one pool and share it.</li>
<li>Node <code>http.Agent({keepAlive:true})</code> / HikariCP reuse connections: four requests, one socket in the lab.</li>
<li>Set both a connect timeout (handshake) and a read timeout (response) — different failures, both must fail fast.</li>
<li>Nagle × delayed-ACK stalls small write-write-read by ~40 ms (57 → 30 ms here); use <code>TCP_NODELAY</code> or coalesce writes.</li>
<li>Long-lived connections die silently behind NAT/firewalls; the 2-hour keepalive default is too long — lower it or ping.</li>
</ul>
${L('https://nodejs.org/api/http.html#class-httpagent', '📄', 'Node.js — http.Agent', 'keepAlive, maxSockets, keepAliveMsecs — the pool for Node’s HTTP clients.', 'Open')}
${L('https://github.com/brettwooldridge/HikariCP', '📘', 'HikariCP', 'The JDBC pool: maximumPoolSize, connectionTimeout, maxLifetime, keepaliveTime.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc1122#page-98', '📄', 'RFC 1122 — Nagle and delayed ACK', 'The two algorithms whose interaction causes the ~40 ms stall.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Keep-Alive', '📘', 'MDN — Keep-Alive', 'The HTTP header and what timeout/max really control.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Keep-alive, pool kết nối và timeout trong code của bạn</h2>
<p class="lead">Mọi thứ tới giờ là việc của TCP, trong nhân. Bài cuối chương này nói về một nhúm quyết định trong code <em>của bạn</em> quyết định bộ máy đó giúp hay hại: bạn có dùng lại kết nối không, pool chúng ra sao, và đặt những timeout nào. Đây là những dòng nhỏ — một tuỳ chọn agent, một cỡ pool, một timeout tính bằng mili giây — với tác động ngoại cỡ lên độ trễ, tài nguyên và sự bền bỉ.</p>

<h3>Cú bắt tay rẻ nhất là cú bạn bỏ qua</h3>
<p>Bài 4.1 đã đo: một kết nối dùng lại hạ một yêu cầu từ 51 ms xuống 27 ms nhờ bỏ cú bắt tay. HTTP/1.1 mặc định giữ kết nối sống; <code>curl -v</code> cho thấy việc dùng lại rõ ràng:</p>
${run('c45-ka', 'curl', 1)}
<p>“<strong>Re-using existing connection</strong>” — <code>GET</code> thứ hai đi trên kết nối đang mở, không có cú bắt tay thứ hai. Việc của bạn trong code đơn giản là <em>giữ lấy</em> kết nối đó thay vì đóng nó sau mỗi lần gọi. Thói quen duy nhất đó là thắng lợi độ trễ lớn nhất trong phần lớn dịch vụ, và cũng là thuốc chữa cạn cổng của bài 4.4.</p>
${net('waterfall', 'warm', 'vi', 'Một kết nối ấm bỏ qua DNS và cú bắt tay — so biểu đồ của nó với cái lạnh ở bài 4.1.', { tour: 'waterfall-phases' })}

<h3>Một pool kết nối, đếm được</h3>
<p>Một <strong>pool</strong> giữ một tập kết nối mở và phát cho các yêu cầu, thu lại khi xong. <code>http.Agent</code> của Node là một pool; ở đây máy chủ đếm bốn yêu cầu thật sự dùng bao nhiêu kết nối TCP:</p>
${run('c45-node', 'node agent', 1)}
<p>Với <code>keepAlive: false</code>, bốn yêu cầu mở <strong>bốn</strong> kết nối — bốn cú bắt tay, bốn cổng tạm xoay vòng. Với <code>keepAlive: true</code>, chúng dùng chung <strong>một</strong>. Mọi client nghiêm túc đều có pool; sai lầm là tạo một client mới mỗi yêu cầu, thứ vứt pool đi mỗi lần. Tạo một cái và dùng chung khắp ứng dụng:</p>
${code(`// Node.js — một agent keep-alive dùng chung cho cả tiến trình
import http from 'node:http';
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,          // số kết nối nhiều nhất mỗi host cùng lúc
  keepAliveMsecs: 15000,   // bao lâu dò một socket rảnh một lần
});
export const get = (opts) => http.get({ ...opts, agent });`, 'js')}
${code(`// Java — HikariCP cho cơ sở dữ liệu (JDBC bắt buộc phải có pool)
HikariConfig cfg = new HikariConfig();
cfg.setMaximumPoolSize(10);
cfg.setConnectionTimeout(3000);   // ms để lấy một kết nối từ pool
cfg.setMaxLifetime(1_800_000);    // thay mới trước khi một middlebox giết
// Với HTTP, OkHttp / java.net.http.HttpClient dùng lại kết nối mặc định.`, 'java')}

<h3>Hai timeout người ta hay nhầm</h3>
<p>“Timeout” không phải một thứ. Hai cái quan trọng nhất bao các pha khác nhau:</p>
<ul>
<li><strong>Connect timeout</strong> bao cú bắt tay. Thiếu nó, một phụ thuộc đã chết hoặc bị tường lửa làm yêu cầu của bạn treo trong ~2 phút của nhân (SYN truyền lại ở bài 4.1). Đặt nó vài giây.</li>
<li><strong>Read / request timeout</strong> bao việc chờ câu trả lời <em>sau khi</em> kết nối. Thiếu nó, một backend chậm giữ các luồng hay chỗ trên vòng lặp sự kiện của bạn mở vô hạn — nguyên nhân thường gặp của một sự cố lan rộng.</li>
<li><strong>Idle / pool timeout</strong> chặn một kết nối trong pool được ngồi không bao lâu trước khi bị đóng hay thay mới — dẫn tới vấn đề kế.</li>
</ul>

<h3>Nagle × delayed-ACK: cú kẹt ~40 ms đo được</h3>
<p>Hai tính năng TCP, mỗi cái hợp lý khi đứng riêng, tương tác xấu. <strong>Thuật toán Nagle</strong> giữ một đoạn nhỏ nếu dữ liệu nhỏ trước đó còn chưa báo nhận, để tránh làm ngập mạng bằng gói tí hon. <strong>Delayed ACK</strong> cho bên nhận chờ tới ~40 ms để gửi kèm ACK trên một câu trả lời. Trong một kiểu <em>ghi-ghi-đọc</em> — một yêu cầu tách làm hai lần ghi nhỏ — mỗi bên rốt cuộc chờ bên kia. Đo nó trên đường lab 25 ms:</p>
${run('c45-nodelay', 'node nagle', 1)}
<p>Với Nagle bật (mặc định), mỗi giao dịch mất <strong>57 ms</strong>; với <code>setNoDelay(true)</code> nó tụt xuống <strong>30 ms</strong> — cú kẹt delayed-ACK ~40 ms, biến mất. Với các giao thức yêu cầu/đáp nhỏ (RPC, một giao thức dòng tự chế, một giao thức dây của cơ sở dữ liệu) hãy đặt <strong>TCP_NODELAY</strong>. Hầu hết thư viện RPC chín đã làm; triệu chứng cần nhận ra là một giao thức nhanh khi truyền lớn mà vẫn thêm một khoản thuế cố định mỗi vòng khứ hồi.</p>

<div class="pitfall co-tieu-de">
<p><strong>Đừng với lấy TCP_NODELAY ở mọi nơi.</strong> Nagle tồn tại có lý do — nó bảo vệ mạng khỏi một cơn gói tí hon. Tắt nó trên các socket có kiểu yêu cầu/đáp rõ ràng, nhạy độ trễ (RPC, giao thức tương tác). Trên một luồng truyền lớn nó khác biệt rất ít, và tắt nó theo phản xạ có thể tăng chi phí gói. Cách sửa thật cho cú kẹt thường là gộp hai lần ghi thành một (<code>write(header+body)</code>), thứ tránh được cả Nagle lẫn ACK thừa.</p>
</div>

<h3>Kết nối chết âm thầm</h3>
<p>Một kết nối có thể đã chết trong khi cả hai đầu vẫn tin nó mở. Một NAT hay tường lửa có trạng thái trên đường đi giữ một mục trong bảng cho mỗi kết nối, và <strong>vứt các mục rảnh</strong> sau vài phút — mà không gửi gì cho bên nào. Lần ghi kế tiếp, gói đi vào hư không và bạn chờ một timeout. TCP keepalive của chính nó có thể phát hiện, nhưng nhìn mặc định:</p>
${run('c45-keepalive-opt', 'sysctl', 1)}
<p><code>tcp_keepalive_time = 7200</code> — <strong>hai giờ</strong> trước lần dò đầu tiên. Vô dụng để bắt một NAT quên bạn sau 5 phút. Trên các kết nối sống lâu (WebSocket, một pool cơ sở dữ liệu, một consumer hàng đợi) hoặc hạ cái này (theo socket, qua <code>SO_KEEPALIVE</code> + <code>TCP_KEEPIDLE</code>) còn vài phút, hoặc gửi nhịp tim của chính bạn ở mức ứng dụng. Đây là lý do app chat ping, vì sao pool cơ sở dữ liệu có <code>maxLifetime</code>, và vì sao “kết nối chạy một lúc rồi đơ” gần như luôn là một middlebox rảnh, không phải lỗi trong code của bạn.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một kết nối trong pool bị một middlebox giết âm thầm còn tệ hơn không có pool.</strong> Nếu pool phát một kết nối mà đầu kia (hoặc một NAT) đã vứt, yêu cầu đầu trên nó hỏng hoặc treo. Phòng vệ: một <code>maxLifetime</code> ngắn để kết nối được thay mới trước khi ôi, một truy vấn kiểm/ping lúc lấy ra, và một lần thử lại trên kết nối mới cho các yêu cầu bất biến. Đây đúng là việc của <code>maxLifetime</code> và <code>keepaliveTime</code> trong HikariCP.</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>Pool</strong> là cấu trúc dữ liệu các socket mở của ứng dụng bạn (undici, HikariCP, transport của Go) — nhân không biết gì về “pool”, chỉ biết các socket ESTABLISHED.</li>
<li><strong>Keep-alive</strong> là một thoả thuận ở mức HTTP (<code>Connection: keep-alive</code>) để không đóng sau một câu trả lời; bên dưới, TCP đơn giản ở ESTABLISHED.</li>
<li><strong>TCP_NODELAY</strong> và <strong>SO_KEEPALIVE</strong> là các tuỳ chọn theo socket mà code bạn đặt qua API socket; chúng đổi hành vi của nhân cho đúng socket đó.</li>
<li><strong>Connect và read timeout</strong> do thư viện client của bạn ép bằng bộ đếm; TCP không có khái niệm về hạn chót của bạn.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-13-2-bat-tay-tin-cay-va-doc-may-chu-that', so: '13.2', ten: 'Bắt tay, tính tin cậy, UDP, và đọc một máy chủ thật', giong: 'TCP giữ một kết nối mở và đáng tin, thứ keep-alive dùng lại', khac: 'NWC204 đọc một kết nối ở mức giao thức, không có các núm phía ứng dụng', them: 'pool http.Agent / HikariCP, connect so với read timeout, một cú kẹt Nagle × delayed-ACK đo được, và TCP keepalive cho kết nối chết âm thầm — các quyết định code làm TCP phục vụ bạn' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một dịch vụ RPC nội bộ “nhanh khi mình đo tải trong một vòng lặp, nhưng mỗi lần gọi thật từ tầng web tốn thêm 40 ms,” và riêng tầng web đôi khi treo hai phút khi một phụ thuộc sập. Chẩn đoán cả hai bằng lab.</p>
<ol>
<li>Dựng lại cú kẹt Nagle: với 25 ms trễ trên router, chạy <code>node nagle-cli.mjs</code> (hai lần ghi nhỏ mỗi giao dịch) và so <code>NODELAY=false</code> với <code>true</code>. Giải thích ~40 ms.</li>
<li>Cho thấy pool: chạy <code>node agent.mjs</code> và xác nhận <code>keepAlive:false</code> mở bốn kết nối còn <code>true</code> mở một.</li>
<li>Dựng lại cú treo: <code>docker exec nfd-router iptables -A FORWARD -d 10.10.2.99 -j DROP</code>, rồi <code>curl http://10.10.2.99/</code> có và không có <code>--connect-timeout 2</code>. So mỗi cái mất bao lâu để hỏng.</li>
<li>Viết hai cách sửa: một cho 40 ms, một cho cú treo hai phút.</li>
</ol>
<p><strong>Đạt khi:</strong> số của bạn cho thấy NODELAY bỏ cú kẹt ~27 ms, pool gộp bốn kết nối thành một, và <code>--connect-timeout</code> biến một cú treo hai phút thành một cú hỏng hai giây — và hai cách sửa gọi tên <code>TCP_NODELAY</code> (hoặc gộp hai lần ghi) và một connect timeout rõ ràng.</p>
<details><summary>Lời giải</summary>
<p>Nagle bật ≈ 57 ms/giao dịch, tắt ≈ 30 ms — cú kẹt delayed-ACK. Sửa: đặt <code>TCP_NODELAY</code> trên socket RPC (hoặc gửi yêu cầu bằng một lần ghi). <code>agent.mjs</code>: keepAlive false → 4 kết nối, true → 1. Máy bị hố đen treo ~2 phút khi không có connect timeout và hỏng trong ~2 s với <code>--connect-timeout 2</code>. Sửa: “40 ms là Nagle × delayed-ACK trên một RPC ghi-ghi-đọc — bật TCP_NODELAY. Cú treo hai phút là thiếu connect timeout — đặt một cái (2–3 s) trên HTTP client để một phụ thuộc đã chết hỏng nhanh thay vì truyền lại SYN hai phút.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['keep-alive (giữ kết nối)', 'Thoả thuận HTTP để dùng lại một kết nối cho nhiều yêu cầu, bỏ cú bắt tay.'],
  ['connection pool (pool kết nối)', 'Một tập kết nối mở ứng dụng dùng lại qua các yêu cầu (http.Agent, HikariCP).'],
  ['connect timeout (hạn kết nối)', 'Hạn chót cho cú bắt tay; thiếu nó một máy chết treo ~2 phút.'],
  ['read timeout (hạn đọc)', 'Hạn chót cho câu trả lời sau khi kết nối; thiếu nó một backend chậm giữ chặt các luồng.'],
  ['Nagle (thuật toán Nagle)', 'Giữ một đoạn nhỏ khi dữ liệu nhỏ trước còn chưa báo nhận, để gộp gói tí hon.'],
  ['delayed ACK (báo nhận trễ)', 'Bên nhận chờ tới ~40 ms để gửi kèm ACK — kẹt ghi-ghi-đọc khi có Nagle.'],
  ['TCP_NODELAY (tắt Nagle)', 'Một tuỳ chọn socket tắt Nagle cho các giao thức nhạy độ trễ.'],
  ['TCP keepalive (dò sống)', 'Dò một kết nối rảnh để phát hiện một cú vứt âm thầm; mặc định 2 giờ, thường quá dài.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Keep-alive và pool là thắng lợi độ trễ lớn nhất và cách sửa thật cho cạn cổng — làm một pool và dùng chung.</li>
<li>Node <code>http.Agent({keepAlive:true})</code> / HikariCP dùng lại kết nối: bốn yêu cầu, một socket trong lab.</li>
<li>Đặt cả connect timeout (cú bắt tay) lẫn read timeout (câu trả lời) — hai kiểu hỏng khác nhau, cả hai phải hỏng nhanh.</li>
<li>Nagle × delayed-ACK kẹt ghi-ghi-đọc nhỏ ~40 ms (57 → 30 ms ở đây); dùng <code>TCP_NODELAY</code> hoặc gộp hai lần ghi.</li>
<li>Kết nối sống lâu chết âm thầm sau NAT/tường lửa; mặc định keepalive 2 giờ là quá dài — hạ nó hoặc ping.</li>
</ul>
${L('https://nodejs.org/api/http.html#class-httpagent', '📄', 'Node.js — http.Agent', 'keepAlive, maxSockets, keepAliveMsecs — pool cho HTTP client của Node.', 'Mở')}
${L('https://github.com/brettwooldridge/HikariCP', '📘', 'HikariCP', 'Pool JDBC: maximumPoolSize, connectionTimeout, maxLifetime, keepaliveTime.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc1122#page-98', '📄', 'RFC 1122 — Nagle và delayed ACK', 'Hai thuật toán mà sự tương tác gây cú kẹt ~40 ms.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Keep-Alive', '📘', 'MDN — Keep-Alive', 'Header HTTP và timeout/max thật sự điều khiển gì.', 'Mở')}
</div>
`,
};
