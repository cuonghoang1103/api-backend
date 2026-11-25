/**
 * Chương 11 · 11.4b — Đọc lỗi mạng trong log ứng dụng: ENOTFOUND, ECONNREFUSED, ETIMEDOUT, ECONNRESET ở Node.js và Java (soạn 24/11/2026, máy nhà).
 * Bài BỔ SUNG (soát độ phủ 24/11): cả khoá dạy công cụ từ phía MẠNG, nhưng người làm backend thấy lỗi trong LOG trước — chưa bài nào nối
 * "dòng lỗi trong log" ⇒ "tầng nào" ⇒ "lệnh nào xác nhận" (0 tệp nhắc ECONNRESET/ETIMEDOUT). Không viết lại 11.4 (bảng kiểm theo tầng) — bài này là
 * lối vào của bảng kiểm đó từ phía ứng dụng.
 * Output THẬT nhúng nguyên văn: scratchpad/net/demo/dung-ch11b.sh (container net-loi: ảnh net-lab-toc = node:22 + iproute2/curl/nc; net-loi-java:
 * eclipse-temurin:21-jdk chung netns; net-loi-none: --network none). Kịch bản ở scratchpad/net/demo/code/ch11b/ (srv.mjs, k.py, fetch-loi.mjs,
 * http-loi.mjs, dua-keepalive.mjs, dua-fetch.mjs, Loi.java). Muốn đưa vào lab của khoá: chép code/ch11b ⇒ lab/code/ch11b, out ⇒ lab/out.
 */
import { code, out, card, kv, details } from '../_ui.mjs';

const L = card;
const bai = (slug) => `/courses/networking-for-developers/learn?lessonSlug=${slug}`;

const NODE = "# Node 22 · fetch (undici) — mỗi ca một lệnh, in đúng thứ log sẽ in\n$ node fetch-loi.mjs http://khong-co-that.invalid/\nTypeError: fetch failed\n  cause: Error: getaddrinfo ENOTFOUND khong-co-that.invalid  (code ENOTFOUND)\n  sau 0.19 s\n$ node fetch-loi.mjs http://127.0.0.1:41999/\nTypeError: fetch failed\n  cause: Error: connect ECONNREFUSED 127.0.0.1:41999  (code ECONNREFUSED)\n  sau 0.05 s\n$ node fetch-loi.mjs http://10.99.0.2:41000/\nTypeError: fetch failed\n  cause: Error: connect ETIMEDOUT 10.99.0.2:41000  (code ETIMEDOUT)\n  sau 7.24 s\n$ node fetch-loi.mjs http://127.0.0.1:41080/im 2000\nTimeoutError: The operation was aborted due to timeout\n  sau 2.01 s\n$ node fetch-loi.mjs http://127.0.0.1:41080/rst\nTypeError: fetch failed\n  cause: Error: read ECONNRESET  (code ECONNRESET)\n  sau 0.04 s\n$ node fetch-loi.mjs http://127.0.0.1:41080/cup\nTypeError: fetch failed\n  cause: SocketError: other side closed  (code UND_ERR_SOCKET)\n  sau 0.05 s";
const HTTP = "# Node 22 · module http (nền của axios, got, nhiều SDK)\n$ node http-loi.mjs http://khong-co-that.invalid/\nError: getaddrinfo ENOTFOUND khong-co-that.invalid  (code ENOTFOUND)  sau 0.14 s\n$ node http-loi.mjs http://127.0.0.1:41999/\nError: connect ECONNREFUSED 127.0.0.1:41999  (code ECONNREFUSED)  sau 0.01 s\n$ node http-loi.mjs http://10.99.0.2:41000/\nError: connect ETIMEDOUT 10.99.0.2:41000  (code ETIMEDOUT)  sau 7.20 s\n$ node http-loi.mjs http://127.0.0.1:41080/rst\nError: read ECONNRESET  (code ECONNRESET)  sau 0.01 s\n$ node http-loi.mjs http://127.0.0.1:41080/cup\nError: socket hang up  (code ECONNRESET)  sau 0.01 s\n$ timeout 6 node http-loi.mjs http://127.0.0.1:41080/im; echo \"exit $?\"\nexit 124";
const XN = "# Xác nhận từng lỗi bằng lệnh terminal — không đoán\n$ getent hosts khong-co-that.invalid; echo \"exit $?\"\nexit 2\n$ ss -tln | grep -E '41999|41080|State'\nState  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess\nLISTEN 0      511                *:41080            *:*          \n$ nc -zv -w 3 10.99.0.2 41000; echo \"exit $?\"\nnc: connect to 10.99.0.2 port 41000 (tcp) timed out: Operation now in progress\nexit 1\n$ curl -sS -m 2 http://127.0.0.1:41080/im; echo \"exit $?\"\ncurl: (28) Operation timed out after 2000 milliseconds with 0 bytes received\nexit 28\n$ curl -sS http://127.0.0.1:41080/rst; echo \"exit $?\"\ncurl: (56) Recv failure: Connection reset by peer\nexit 56\n$ curl -sS http://127.0.0.1:41080/cup; echo \"exit $?\"\ncurl: (52) Empty reply from server\nexit 52\n$ node -e \"require('net').createServer().listen(41080)\" 2>&1 | grep -m1 -E 'Error|EADDRINUSE'\nError: listen EADDRINUSE: address already in use :::41080";
const NONE = "# Container không có mạng (--network none): không hỏi được DNS\n$ node fetch-loi.mjs http://example.com/\nTypeError: fetch failed\n  cause: Error: getaddrinfo EAI_AGAIN example.com  (code EAI_AGAIN)\n  sau 0.05 s\n$ getent hosts example.com; echo \"exit $?\"\nexit 2";
const JAVA = "# Java 21 · HttpURLConnection (RestTemplate mặc định của Spring) — connect/read timeout 3 s\n$ java Loi.java http://khong-co-that.invalid/\njava.net.UnknownHostException: khong-co-that.invalid\n  sau 0.06 s\n$ java Loi.java http://127.0.0.1:41999/\njava.net.ConnectException: Connection refused (connect failed)\n  sau 0.02 s\n$ java Loi.java http://10.99.0.2:41000/\njava.net.SocketTimeoutException: Connect timed out\n  sau 3.04 s\n$ java Loi.java http://127.0.0.1:41080/im\njava.net.SocketTimeoutException: Read timed out\n  sau 3.03 s\n$ java Loi.java http://127.0.0.1:41080/rst\njava.net.SocketException: Connection reset\n  sau 0.02 s\n$ java Loi.java http://127.0.0.1:41080/cup\njava.net.SocketException: Unexpected end of file from server\n  sau 0.02 s";
const DUA = "# Máy chủ :41082 (k.py) giữ kết nối nhưng đóng kết nối rảnh sau 1 s và KHÔNG báo trước (không có header Keep-Alive) — như nhiều proxy.\n$ curl -si http://127.0.0.1:41082/ | head -4\nHTTP/1.1 200 OK\nServer: BaseHTTP/0.6 Python/3.11.2\nDate: Tue, 24 Nov 2026 10:45:48 GMT\nContent-Length: 3\n$ node dua-keepalive.mjs http://127.0.0.1:41082/ 60 500\n60 lần, nghỉ 500 ms: {\"ok\":60}\n$ node dua-keepalive.mjs http://127.0.0.1:41082/ 60 1000\n60 lần, nghỉ 1000 ms: {\"ok\":59,\"ECONNRESET\":1}\n$ node dua-keepalive.mjs http://127.0.0.1:41082/ 60 1500\n60 lần, nghỉ 1500 ms: {\"ok\":60}\n$ node dua-fetch.mjs http://127.0.0.1:41082/ 60 1000\n60 lần, nghỉ 1000 ms: {\"ok\":58,\"UND_ERR_SOCKET\":2}\n# Máy chủ Node :41081 có báo trước \"Keep-Alive: timeout=1\" ⇒ client tự bỏ kết nối sắp hết hạn\n$ curl -si http://127.0.0.1:41081/ | grep -i keep-alive\nConnection: keep-alive\nKeep-Alive: timeout=1\n$ node dua-keepalive.mjs http://127.0.0.1:41081/ 60 1000\n60 lần, nghỉ 1000 ms: {\"ok\":60}";
const SRV = "// srv.mjs — máy chủ \"hỏng có chủ đích\" cho bài 11.4b. :41080 /ok · /im (nhận rồi im) · /rst (cắt bằng RST) · /cup (đóng không trả lời)\nimport http from 'node:http';\nconst s = http.createServer((req, res) => {\n  if (req.url === '/ok') return res.end('ok\\n');\n  if (req.url === '/im') return;                              // không bao giờ trả lời\n  if (req.url === '/rst') return req.socket.resetAndDestroy(); // gửi RST\n  if (req.url === '/cup') return req.socket.destroy();         // đóng (FIN) mà không trả lời\n});\ns.listen(41080, () => console.log('srv :41080'));\n// máy chủ thứ hai cho ca keep-alive: đóng kết nối rảnh sau 1 giây\nconst k = http.createServer((req, res) => res.end('ok\\n'));\nk.keepAliveTimeout = 1000;\nk.listen(41081, () => console.log('srv keep-alive 1s :41081'));";
const K_PY = "# k.py — máy chủ HTTP/1.1 giữ kết nối nhưng đóng kết nối rảnh sau 1 giây và KHÔNG gửi header Keep-Alive (như nhiều proxy/cân bằng tải).\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\nclass H(BaseHTTPRequestHandler):\n    protocol_version = 'HTTP/1.1'; timeout = 1          # socket rảnh 1 s ⇒ máy chủ đóng\n    def do_GET(self):\n        self.send_response(200); self.send_header('Content-Length', '3'); self.end_headers(); self.wfile.write(b'ok\\n')\n    def log_message(self, *a): pass\nThreadingHTTPServer(('0.0.0.0', 41082), H).serve_forever()";

const BANG_EN = [
  ['getaddrinfo ENOTFOUND host · java.net.UnknownHostException', 'DNS answered "no such name" ⇒ typo, wrong environment variable, private name not in this network. Check: <code>getent hosts host</code> / <code>dig host</code>'],
  ['getaddrinfo EAI_AGAIN host', 'DNS could not be asked at all (no network, resolver down) ⇒ temporary. Check: <code>cat /etc/resolv.conf</code>, <code>dig @resolver host</code>'],
  ['connect ECONNREFUSED ip:port · ConnectException: Connection refused', 'Host reached, nothing listening on that port (or bound to 127.0.0.1 only) ⇒ fast (ms). Check: <code>ss -tlnp</code> on the server, <code>nc -zv ip port</code>'],
  ['connect ETIMEDOUT · UND_ERR_CONNECT_TIMEOUT · SocketTimeoutException: Connect timed out', 'SYN got no answer ⇒ firewall DROP, security group, wrong IP/route ⇒ slow (seconds). Check: <code>nc -zv -w 3</code>, <code>tcpdump \'tcp[tcpflags] &amp; tcp-syn != 0\'</code>'],
  ['TimeoutError / Read timed out / curl (28) … 0 bytes received', 'Connected, but the server never answered in time ⇒ slow app, DB lock, deadlock. Check: <code>curl -w</code> TTFB, server logs'],
  ['read ECONNRESET · SocketException: Connection reset · curl (56)', 'The other side sent RST mid-conversation ⇒ crash, proxy cut, idle keep-alive race. Check: <code>tcpdump \'tcp[tcpflags] &amp; tcp-rst != 0\'</code>'],
  ['socket hang up · other side closed · Unexpected end of file · curl (52) Empty reply', 'The other side closed (FIN) without sending a response ⇒ process died, proxy limit. Check: server/proxy logs at that second'],
  ['listen EADDRINUSE', 'Your own server: the port is already taken ⇒ an old process still runs. Check: <code>ss -tlnp | grep :port</code>'],
];
const BANG_VI = [
  ['getaddrinfo ENOTFOUND host · java.net.UnknownHostException', 'DNS trả lời "không có tên này" ⇒ gõ sai, sai biến môi trường, tên nội bộ không có ở mạng này. Kiểm: <code>getent hosts host</code> / <code>dig host</code>'],
  ['getaddrinfo EAI_AGAIN host', 'Không hỏi được DNS (mất mạng, resolver chết) ⇒ lỗi tạm thời. Kiểm: <code>cat /etc/resolv.conf</code>, <code>dig @resolver host</code>'],
  ['connect ECONNREFUSED ip:port · ConnectException: Connection refused', 'Tới được máy, nhưng không ai nghe ở cổng đó (hoặc chỉ nghe 127.0.0.1) ⇒ báo NGAY (mili giây). Kiểm: <code>ss -tlnp</code> trên máy chủ, <code>nc -zv ip cổng</code>'],
  ['connect ETIMEDOUT · UND_ERR_CONNECT_TIMEOUT · SocketTimeoutException: Connect timed out', 'SYN không được trả lời ⇒ tường lửa DROP, security group, sai IP/tuyến ⇒ CHẬM (vài giây). Kiểm: <code>nc -zv -w 3</code>, <code>tcpdump \'tcp[tcpflags] &amp; tcp-syn != 0\'</code>'],
  ['TimeoutError / Read timed out / curl (28) … 0 bytes received', 'Đã kết nối, nhưng máy chủ không trả lời kịp ⇒ ứng dụng chậm, khoá DB, treo. Kiểm: TTFB của <code>curl -w</code>, log máy chủ'],
  ['read ECONNRESET · SocketException: Connection reset · curl (56)', 'Bên kia gửi RST giữa chừng ⇒ tiến trình sập, proxy cắt, đua keep-alive. Kiểm: <code>tcpdump \'tcp[tcpflags] &amp; tcp-rst != 0\'</code>'],
  ['socket hang up · other side closed · Unexpected end of file · curl (52) Empty reply', 'Bên kia đóng (FIN) mà không gửi trả lời ⇒ tiến trình chết, giới hạn của proxy. Kiểm: log máy chủ/proxy đúng giây đó'],
  ['listen EADDRINUSE', 'Máy chủ CỦA BẠN: cổng đã có người chiếm ⇒ tiến trình cũ còn chạy. Kiểm: <code>ss -tlnp | grep :cổng</code>'],
];

export default {
  title: '11.4b — Network errors in your application logs: ENOTFOUND, ECONNREFUSED, ETIMEDOUT, ECONNRESET in Node.js and Java|||11.4b — Đọc lỗi mạng trong log ứng dụng: ENOTFOUND, ECONNREFUSED, ETIMEDOUT, ECONNRESET ở Node.js và Java',
  slug: 'netdev-11-4b-loi-mang-trong-log',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lối vào bảng kiểm 11.4 từ phía ứng dụng: mỗi dòng lỗi mạng trong log (Node.js fetch/http, Java HttpURLConnection = RestTemplate) chỉ thẳng một tầng. Gây THẬT từng lỗi: ENOTFOUND (DNS nói không có), EAI_AGAIN (không hỏi được DNS), ECONNREFUSED (báo ngay — không ai nghe cổng), ETIMEDOUT (7 s — SYN bị nuốt), read timeout, ECONNRESET (RST), socket hang up (FIN không trả lời), EADDRINUSE; bản Java tương ứng; mỗi lỗi một lệnh terminal xác nhận (getent, ss, nc, curl). Bẫy: module http của Node KHÔNG có timeout mặc định (treo mãi); ECONNRESET lác đác do đua keep-alive — đo thật 1/60 và 2/60 lần khi client nghỉ đúng bằng thời gian máy chủ đóng kết nối rảnh. Góc bảo mật: đừng trả nguyên lỗi (lộ IP nội bộ) cho người dùng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4b</span>
<h2>Network errors in your application logs: ENOTFOUND, ECONNREFUSED, ETIMEDOUT, ECONNRESET in Node.js and Java</h2>
<p class="lead">Lesson 11.4 walks the layers from the network side. At work you rarely start there: you start from a red line in a log — <code>fetch failed</code>, <code>ECONNRESET</code>, <code>Read timed out</code>. Each of those words is the operating system telling you <em>which layer</em> broke. This lesson causes every common error on purpose, in Node.js 22 and Java 21, shows the exact text your logs will contain, and pairs each one with the single terminal command that proves it.</p>

<h3>The everyday picture: a phone call</h3>
<ul>
<li><strong>ENOTFOUND</strong> — the phone book has no such name. You never dialled.</li>
<li><strong>ECONNREFUSED</strong> — the number exists, the line instantly says "not in service". Fast.</li>
<li><strong>ETIMEDOUT</strong> — it rings and rings; nobody picks up. Slow.</li>
<li><strong>Read timeout</strong> — someone picked up and then said nothing.</li>
<li><strong>ECONNRESET</strong> — mid-sentence, the line is cut.</li>
<li><strong>socket hang up</strong> — they picked up and hung up without a word.</li>
</ul>
<p>The <em>speed</em> of the failure is a clue as strong as its name: refused in milliseconds, connect timeout in seconds.</p>

<h3>1 — The broken server we test against</h3>
<p>One small Node server with four routes: <code>/ok</code>, <code>/im</code> (accepts and never answers), <code>/rst</code> (kills the connection with a TCP RST), <code>/cup</code> (closes politely with FIN, no response). Nothing listens on port 41999. A dummy interface swallows every packet to 10.99.0.2, like a firewall that DROPs. The container runs with <code>tcp_syn_retries=2</code> so a connect timeout takes ~7 s instead of ~2 minutes.</p>
${code(SRV, 'javascript')}

<h3>2 — What fetch (undici) writes into your log</h3>
${out(NODE)}
<p>Every case starts with the same useless line, <code>TypeError: fetch failed</code>. The real answer is in <code>err.cause</code> — <strong>log the cause</strong>, or you will stare at "fetch failed" all day. Note the times: refused in 0.04 s, timeout after 7.19 s, a read timeout exactly when <em>your</em> <code>AbortSignal.timeout(2000)</code> fired.</p>

<h3>3 — The older http module (axios, got, many SDKs)</h3>
${out(HTTP)}
<p>Same codes, different wording: a FIN without a response becomes <code>socket hang up</code> (code ECONNRESET!). And the last line is the trap: <strong>the http module has no default timeout</strong>. The request to <code>/im</code> would hang forever — only the outer <code>timeout 6</code> killed it (exit 124). Always pass a timeout (<code>req.setTimeout</code>, axios <code>timeout</code>, <code>AbortSignal.timeout</code> for fetch). Pools and timeouts: lesson <a href="${bai('netdev-4-5-keepalive-pool')}">4.5</a>.</p>

<h3>4 — The same failures in Java (what Spring prints)</h3>
${out(JAVA)}
<p><code>HttpURLConnection</code> is what Spring's <code>RestTemplate</code> uses by default; Spring wraps it as <code>ResourceAccessException: I/O error on GET request for "…": Connection refused</code> — read the part after the last colon. Java names the two timeouts separately: <em>Connect</em> timed out (no SYN-ACK) vs <em>Read</em> timed out (connected, no data). That distinction is the whole diagnosis.</p>

<h3>5 — No network at all: EAI_AGAIN</h3>
${out(NONE)}
<p>In a container started with <code>--network none</code> the resolver cannot even be asked. <code>EAI_AGAIN</code> means "try again later" — a DNS <em>infrastructure</em> problem, not a typo. ENOTFOUND is the opposite: DNS worked and said no.</p>

<h3>6 — Prove it from the terminal, one command each</h3>
${out(XN)}
<p>The curl exit codes are worth memorising: <strong>6</strong> could not resolve, <strong>7</strong> refused, <strong>28</strong> timed out, <strong>52</strong> empty reply, <strong>56</strong> reset. They map one-to-one onto the table below.</p>

<h3>7 — The table: log line ⇒ layer ⇒ command</h3>
${kv(BANG_EN)}

<h3>8 — The intermittent ECONNRESET: an idle keep-alive race</h3>
<p>The most confusing production error is a <em>rare</em> ECONNRESET — 1 request in 1,000, no pattern. A classic cause: the client keeps a connection open for reuse (keep-alive), the server (or a proxy/load balancer in front of it) closes idle connections after N seconds, and the client sends its next request at the very moment the server closes. The request lands on a dead socket.</p>
${code(K_PY, 'python')}
${out(DUA)}
<p>Measured: idle 500 ms or 1500 ms ⇒ 0 errors (reused while alive, or the client noticed the close first). Idle <strong>exactly</strong> 1000 ms, the server's limit ⇒ <strong>1/60</strong> ECONNRESET with the http module, <strong>2/60</strong> <code>UND_ERR_SOCKET</code> with fetch. When the server <em>announces</em> its limit (<code>Keep-Alive: timeout=1</code>, as Node's own server does), the client drops the socket in time ⇒ 0/60. Fixes, in order: make the server-side idle timeout <strong>longer</strong> than the one in front of it (Node behind a load balancer: <code>server.keepAliveTimeout</code> above the LB idle timeout); make the client's idle reuse <strong>shorter</strong> than the server's; retry <em>idempotent</em> requests once on a reused socket. The 502/504 side of the same story is in <a href="${bai('netdev-10-4-ma-loi-gateway')}">10.4</a>.</p>

<h3>🕵️ The attacker's corner: your error message is a map</h3>
<p><code>connect ECONNREFUSED 10.0.3.17:5432</code> returned to a browser tells a stranger your private subnet, your database engine (5432 = PostgreSQL) and that it is down. Verbose error messages and stack traces sent to users are listed under <em>Security Misconfiguration</em> in the OWASP Top 10 (A05:2021). <em>Defence:</em> log the full cause server-side with a request id; send the client a generic message and that id.</p>

<h3>At work (OJT / outsourcing)</h3>
<ul>
<li>A ticket says "API random 502 after moving behind the load balancer". Before touching code, grep the app log for ECONNRESET / "socket hang up" at the same seconds and compare the LB idle timeout with your server's keep-alive timeout — section 8.</li>
<li>"Works on my machine, ETIMEDOUT on the server" ⇒ almost always a firewall/security group (DROP). "ECONNREFUSED on the server" ⇒ the service is down or bound to 127.0.0.1 (lesson <a href="${bai('netdev-1-4-cong-socket')}">1.5</a>). Opening ports on a VPS: course <a href="/courses/deploy-vps">Deploy VPS</a>.</li>
</ul>

<h3>🎤 What the interviewer will ask</h3>
${details('ECONNREFUSED vs ETIMEDOUT — what is the difference and what do you check?', '<p>Refused: the host answered with RST, nothing listens on that port — fast; check <code>ss -tlnp</code> and the bind address. Timed out: no answer to SYN — slow; a firewall drops it or the IP/route is wrong; check with <code>nc -zv -w 3</code> and the firewall/security group.</p>')}
${details('Your Node service logs "socket hang up" a few times a day. Where do you look?', '<p>The peer closed without a response. Check the upstream/proxy logs at those seconds, then the keep-alive idle timeouts on both sides (client reuse shorter than server idle), and retry idempotent calls once.</p>')}
${details('Why is "fetch failed" not enough in a log?', '<p>It is a wrapper; the real system error is in <code>err.cause</code> (code + address). Log the cause and the target host:port.</p>')}
${details('Connect timeout vs read timeout in Spring — why set both?', '<p>Connect timeout bounds the TCP handshake (network/firewall problems); read timeout bounds waiting for data on an open connection (slow server). Without a read timeout a stuck dependency holds your threads forever.</p>')}

<h3>🧪 Practice (20 minutes)</h3>
<ol>
<li>Run <code>srv.mjs</code> and call each route with <code>fetch</code>, logging <code>err.cause.code</code> and the elapsed time.</li>
<li>For each error, write the one terminal command that proves it, and the curl exit code you expect.</li>
<li>Reproduce the keep-alive race with <code>k.py</code>: find the idle time that produces errors, then fix it twice (client side and server side) and show 0 errors.</li>
</ol>
${details('✅ Solution sketch (open after you tried)', `<ul>
<li>ENOTFOUND ⇒ <code>getent hosts</code> exit 2 · ECONNREFUSED ⇒ port missing in <code>ss -tln</code>, curl 7 · ETIMEDOUT ⇒ <code>nc -zv -w 3</code> times out, curl 28 · reset ⇒ curl 56 · hang up ⇒ curl 52.</li>
<li>Race: errors appear only when the idle gap ≈ the server's idle timeout. Client fix: an agent whose free sockets expire earlier, or a retry on reused sockets. Server fix: send <code>Keep-Alive: timeout=…</code> / raise the idle timeout above the client's.</li>
</ul>`)}

<h3>🗂 Key terms</h3>
${kv([
    ['ENOTFOUND / EAI_AGAIN', 'DNS said no / DNS could not be asked.'],
    ['ECONNREFUSED', 'Host answered RST to the SYN: nothing listening.'],
    ['ETIMEDOUT / connect timeout', 'No answer to the SYN (DROP, wrong route).'],
    ['read timeout', 'Connected; the response did not arrive in time.'],
    ['ECONNRESET / socket hang up', 'Peer reset (RST) / peer closed (FIN) without a response.'],
    ['keep-alive idle timeout', 'How long an unused connection is kept before one side closes it.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Every network error in a log names a layer: DNS (ENOTFOUND/EAI_AGAIN), port (ECONNREFUSED), path/firewall (ETIMEDOUT), application (read timeout), connection (ECONNRESET, hang up).</li>
<li>Log <code>err.cause</code>, the target host:port and the elapsed time — speed tells refused from timeout.</li>
<li>Node's http module has no default timeout; Java names connect vs read timeouts — set both.</li>
<li>Rare ECONNRESET ⇒ suspect an idle keep-alive race; align idle timeouts (server longer than what sits in front of it).</li>
<li>Never send raw errors to users.</li>
</ul>
<p>Related: <a href="${bai('netdev-11-4-phuong-phap')}">11.4 Layered checklist</a> · <a href="${bai('netdev-4-5-keepalive-pool')}">4.5 Keep-alive, pools and timeouts</a> · <a href="${bai('netdev-6-4-loi-tls')}">6.4 TLS errors</a> · <a href="${bai('netdev-10-4-ma-loi-gateway')}">10.4 502/503/504</a></p>
${L('https://nodejs.org/api/errors.html#common-system-errors', '📘', 'Node.js — Common system errors', 'ECONNREFUSED, ECONNRESET, ETIMEDOUT, ENOTFOUND… straight from the docs.', 'Open')}
${L('https://owasp.org/Top10/A05_2021-Security_Misconfiguration/', '🛡', 'OWASP A05:2021 Security Misconfiguration', 'Includes overly informative error messages shown to users.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4b</span>
<h2>Đọc lỗi mạng trong log ứng dụng: ENOTFOUND, ECONNREFUSED, ETIMEDOUT, ECONNRESET ở Node.js và Java</h2>
<p class="lead">Bài 11.4 đi qua các tầng từ phía mạng. Đi làm thì hiếm khi bạn bắt đầu từ đó: bạn bắt đầu từ một dòng đỏ trong log — <code>fetch failed</code>, <code>ECONNRESET</code>, <code>Read timed out</code>. Mỗi chữ ấy là hệ điều hành đang nói cho bạn <em>tầng nào</em> hỏng. Bài này cố tình gây từng lỗi hay gặp, trên Node.js 22 và Java 21, cho thấy đúng dòng chữ log sẽ in, và ghép mỗi lỗi với MỘT lệnh terminal chứng minh nó.</p>

<h3>Hình dung đời thường: một cuộc gọi điện thoại</h3>
<ul>
<li><strong>ENOTFOUND</strong> — danh bạ không có tên đó. Bạn chưa hề bấm số.</li>
<li><strong>ECONNREFUSED</strong> — số có thật, tổng đài báo ngay "thuê bao không tồn tại". Rất nhanh.</li>
<li><strong>ETIMEDOUT</strong> — chuông đổ mãi, không ai nhấc. Rất chậm.</li>
<li><strong>Read timeout</strong> — có người nhấc máy rồi im lặng.</li>
<li><strong>ECONNRESET</strong> — đang nói thì bị cắt ngang.</li>
<li><strong>socket hang up</strong> — nhấc máy rồi cúp, không nói một lời.</li>
</ul>
<p><em>Tốc độ</em> của lỗi là manh mối mạnh ngang tên lỗi: bị từ chối trong vài mili giây, hết giờ kết nối thì mất vài giây.</p>

<h3>1 — Máy chủ "hỏng có chủ đích" để thử</h3>
<p>Một máy chủ Node nhỏ có bốn đường dẫn: <code>/ok</code>, <code>/im</code> (nhận rồi không bao giờ trả lời), <code>/rst</code> (cắt kết nối bằng TCP RST), <code>/cup</code> (đóng lịch sự bằng FIN, không trả lời). Không ai nghe ở cổng 41999. Một giao diện dummy nuốt mọi gói tới 10.99.0.2, giống tường lửa DROP. Container chạy với <code>tcp_syn_retries=2</code> để hết giờ kết nối chỉ mất ~7 giây thay vì ~2 phút.</p>
${code(SRV, 'javascript')}

<h3>2 — fetch (undici) ghi gì vào log</h3>
${out(NODE)}
<p>Ca nào cũng mở đầu bằng cùng một dòng vô dụng, <code>TypeError: fetch failed</code>. Câu trả lời thật nằm ở <code>err.cause</code> — <strong>hãy log cả cause</strong>, không thì bạn sẽ nhìn "fetch failed" cả ngày. Để ý thời gian: bị từ chối sau 0,04 s, hết giờ kết nối sau 7,19 s, read timeout đúng lúc <code>AbortSignal.timeout(2000)</code> <em>của bạn</em> kích hoạt.</p>

<h3>3 — Module http cũ (nền của axios, got, nhiều SDK)</h3>
${out(HTTP)}
<p>Cùng mã lỗi, khác chữ: đóng bằng FIN mà không trả lời thành <code>socket hang up</code> (mà code vẫn là ECONNRESET!). Và dòng cuối là cái bẫy: <strong>module http không có timeout mặc định</strong>. Yêu cầu tới <code>/im</code> sẽ treo mãi mãi — chỉ có lệnh <code>timeout 6</code> bên ngoài giết được nó (exit 124). Luôn đặt timeout (<code>req.setTimeout</code>, <code>timeout</code> của axios, <code>AbortSignal.timeout</code> cho fetch). Pool và timeout: bài <a href="${bai('netdev-4-5-keepalive-pool')}">4.5</a>.</p>

<h3>4 — Cùng các lỗi đó ở Java (thứ Spring in ra)</h3>
${out(JAVA)}
<p><code>HttpURLConnection</code> là thứ <code>RestTemplate</code> của Spring dùng mặc định; Spring bọc nó thành <code>ResourceAccessException: I/O error on GET request for "…": Connection refused</code> — đọc phần sau dấu hai chấm cuối cùng. Java đặt tên riêng cho hai loại hết giờ: <em>Connect</em> timed out (không có SYN-ACK) và <em>Read</em> timed out (đã nối, không có dữ liệu). Phân biệt được hai cái này là chẩn đoán xong một nửa.</p>

<h3>5 — Không có mạng: EAI_AGAIN</h3>
${out(NONE)}
<p>Trong container chạy <code>--network none</code>, không hỏi được resolver nào. <code>EAI_AGAIN</code> nghĩa là "thử lại sau" — lỗi <em>hạ tầng</em> DNS, không phải gõ sai tên. ENOTFOUND thì ngược lại: DNS chạy tốt và trả lời "không có".</p>

<h3>6 — Chứng minh bằng terminal, mỗi lỗi một lệnh</h3>
${out(XN)}
<p>Nên nhớ mã thoát của curl: <strong>6</strong> không phân giải được, <strong>7</strong> bị từ chối, <strong>28</strong> hết giờ, <strong>52</strong> trả lời rỗng, <strong>56</strong> bị reset. Chúng khớp một-một với bảng dưới.</p>

<h3>7 — Bảng: dòng log ⇒ tầng ⇒ lệnh</h3>
${kv(BANG_VI)}

<h3>8 — ECONNRESET lác đác: cuộc đua keep-alive lúc rảnh</h3>
<p>Lỗi khó hiểu nhất trên production là ECONNRESET <em>hiếm</em> — một yêu cầu trong nghìn, không theo quy luật. Nguyên nhân kinh điển: client giữ kết nối để dùng lại (keep-alive), máy chủ (hoặc proxy/cân bằng tải đứng trước) đóng kết nối rảnh sau N giây, và client gửi yêu cầu kế tiếp đúng lúc máy chủ đóng. Yêu cầu rơi vào một socket đã chết.</p>
${code(K_PY, 'python')}
${out(DUA)}
<p>Đo được: nghỉ 500 ms hay 1500 ms ⇒ 0 lỗi (dùng lại khi còn sống, hoặc client kịp thấy kết nối bị đóng). Nghỉ <strong>đúng</strong> 1000 ms, bằng giới hạn của máy chủ ⇒ <strong>1/60</strong> ECONNRESET với module http, <strong>2/60</strong> <code>UND_ERR_SOCKET</code> với fetch. Khi máy chủ <em>báo trước</em> giới hạn (<code>Keep-Alive: timeout=1</code>, như máy chủ Node tự làm), client bỏ socket kịp ⇒ 0/60. Cách sửa, theo thứ tự: đặt thời gian rảnh phía máy chủ <strong>dài hơn</strong> thứ đứng trước nó (Node sau cân bằng tải: <code>server.keepAliveTimeout</code> lớn hơn idle timeout của LB); đặt thời gian dùng lại phía client <strong>ngắn hơn</strong> của máy chủ; thử lại một lần các yêu cầu <em>idempotent</em> trên socket dùng lại. Mặt 502/504 của cùng câu chuyện ở bài <a href="${bai('netdev-10-4-ma-loi-gateway')}">10.4</a>.</p>

<h3>🕵️ Góc kẻ xấu: thông báo lỗi là một tấm bản đồ</h3>
<p><code>connect ECONNREFUSED 10.0.3.17:5432</code> trả thẳng về trình duyệt cho người lạ biết dải mạng nội bộ, loại cơ sở dữ liệu (5432 = PostgreSQL) và việc nó đang chết. Thông báo lỗi chi tiết và stack trace gửi cho người dùng nằm trong mục <em>Security Misconfiguration</em> của OWASP Top 10 (A05:2021). <em>Phòng thủ:</em> log đầy đủ cause ở phía máy chủ kèm mã yêu cầu; gửi client một câu chung chung và mã đó.</p>

<h3>Đi làm thật (OJT / outsourcing)</h3>
<ul>
<li>Ticket ghi "API thỉnh thoảng 502 sau khi đưa ra sau cân bằng tải". Trước khi sửa mã, grep log ứng dụng tìm ECONNRESET / "socket hang up" ở đúng các giây đó, rồi so idle timeout của LB với keep-alive timeout của máy chủ — mục 8.</li>
<li>"Máy em chạy, lên máy chủ thì ETIMEDOUT" ⇒ gần như luôn là tường lửa/security group (DROP). "ECONNREFUSED trên máy chủ" ⇒ dịch vụ chết hoặc chỉ nghe 127.0.0.1 (bài <a href="${bai('netdev-1-4-cong-socket')}">1.5</a>). Mở cổng trên VPS: khoá <a href="/courses/deploy-vps">Deploy VPS</a>.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${details('ECONNREFUSED khác ETIMEDOUT thế nào, và kiểm gì?', '<p>Refused: máy đích trả RST, không ai nghe ở cổng đó — báo ngay; kiểm <code>ss -tlnp</code> và địa chỉ bind. Timed out: SYN không được trả lời — chậm; tường lửa nuốt gói hoặc sai IP/tuyến; kiểm bằng <code>nc -zv -w 3</code> và tường lửa/security group.</p>')}
${details('Dịch vụ Node log "socket hang up" vài lần mỗi ngày. Bạn tìm ở đâu?', '<p>Bên kia đóng mà không trả lời. Xem log upstream/proxy đúng các giây đó, rồi so idle timeout keep-alive hai phía (client dùng lại ngắn hơn máy chủ giữ), và thử lại một lần các lời gọi idempotent.</p>')}
${details('Vì sao log chỉ "fetch failed" là không đủ?', '<p>Đó chỉ là lớp bọc; lỗi hệ thống thật nằm ở <code>err.cause</code> (mã + địa chỉ). Hãy log cause và host:cổng đích.</p>')}
${details('Connect timeout và read timeout trong Spring — vì sao đặt cả hai?', '<p>Connect timeout chặn thời gian bắt tay TCP (lỗi mạng/tường lửa); read timeout chặn thời gian chờ dữ liệu trên kết nối đã mở (máy chủ chậm). Không có read timeout, một phụ thuộc bị treo sẽ giữ luồng của bạn mãi mãi.</p>')}

<h3>🧪 Thực hành (20 phút)</h3>
<ol>
<li>Chạy <code>srv.mjs</code>, gọi từng đường dẫn bằng <code>fetch</code>, log <code>err.cause.code</code> và thời gian trôi qua.</li>
<li>Với mỗi lỗi, viết MỘT lệnh terminal chứng minh nó, và mã thoát curl bạn dự đoán.</li>
<li>Tái hiện cuộc đua keep-alive bằng <code>k.py</code>: tìm khoảng nghỉ sinh lỗi, rồi sửa hai cách (phía client và phía máy chủ) và cho thấy 0 lỗi.</li>
</ol>
${details('✅ Gợi ý lời giải (mở sau khi đã thử)', `<ul>
<li>ENOTFOUND ⇒ <code>getent hosts</code> exit 2 · ECONNREFUSED ⇒ cổng không có trong <code>ss -tln</code>, curl 7 · ETIMEDOUT ⇒ <code>nc -zv -w 3</code> hết giờ, curl 28 · reset ⇒ curl 56 · hang up ⇒ curl 52.</li>
<li>Cuộc đua: lỗi chỉ xuất hiện khi khoảng nghỉ ≈ idle timeout của máy chủ. Sửa phía client: agent cho socket rảnh hết hạn sớm hơn, hoặc thử lại trên socket dùng lại. Sửa phía máy chủ: gửi <code>Keep-Alive: timeout=…</code> / tăng idle timeout lên trên của client.</li>
</ul>`)}

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['ENOTFOUND / EAI_AGAIN', 'DNS nói không có / không hỏi được DNS.'],
    ['ECONNREFUSED', 'Máy đích trả RST cho SYN: không ai nghe.'],
    ['ETIMEDOUT / connect timeout', 'SYN không được trả lời (DROP, sai tuyến).'],
    ['read timeout', 'Đã nối; câu trả lời không tới kịp.'],
    ['ECONNRESET / socket hang up', 'Bên kia reset (RST) / đóng (FIN) mà không trả lời.'],
    ['keep-alive idle timeout', 'Một kết nối không dùng được giữ bao lâu trước khi một bên đóng.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi lỗi mạng trong log gọi tên một tầng: DNS (ENOTFOUND/EAI_AGAIN), cổng (ECONNREFUSED), đường đi/tường lửa (ETIMEDOUT), ứng dụng (read timeout), kết nối (ECONNRESET, hang up).</li>
<li>Log <code>err.cause</code>, host:cổng đích và thời gian trôi qua — tốc độ phân biệt refused với timeout.</li>
<li>Module http của Node không có timeout mặc định; Java tách connect và read timeout — đặt cả hai.</li>
<li>ECONNRESET lác đác ⇒ nghi đua keep-alive lúc rảnh; chỉnh idle timeout (máy chủ dài hơn thứ đứng trước nó).</li>
<li>Đừng bao giờ gửi lỗi thô cho người dùng.</li>
</ul>
<p>Liên quan: <a href="${bai('netdev-11-4-phuong-phap')}">11.4 Bảng kiểm theo tầng</a> · <a href="${bai('netdev-4-5-keepalive-pool')}">4.5 Keep-alive, pool và timeout</a> · <a href="${bai('netdev-6-4-loi-tls')}">6.4 Lỗi TLS</a> · <a href="${bai('netdev-10-4-ma-loi-gateway')}">10.4 502/503/504</a></p>
${L('https://nodejs.org/api/errors.html#common-system-errors', '📘', 'Node.js — Common system errors', 'ECONNREFUSED, ECONNRESET, ETIMEDOUT, ENOTFOUND… lấy thẳng từ tài liệu.', 'Mở')}
${L('https://owasp.org/Top10/A05_2021-Security_Misconfiguration/', '🛡', 'OWASP A05:2021 Security Misconfiguration', 'Gồm cả thông báo lỗi quá chi tiết hiện cho người dùng.', 'Mở')}
</div>
`,
};
