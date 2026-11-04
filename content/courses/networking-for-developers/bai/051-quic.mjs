/**
 * Chương 5 · 5.2 — QUIC: tầng vận chuyển dựng lại trên UDP (slug khung netdev-5-2-quic).
 * Output thật: lab/out/c52-*.out.txt. QUIC handshake bytes = CHAY-O-MAY (không có client h3 trong lab image).
 */
import { run, card, kv, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-05-2.mjs';

const L = card;

export default {
  title: '5.2 — QUIC: transport rebuilt on UDP|||5.2 — QUIC: tầng vận chuyển dựng lại trên UDP',
  slug: 'netdev-5-2-quic',
  type: 'LESSON',
  isFreePreview: true,
  description: 'QUIC là tính tin cậy của TCP + TLS 1.3 dựng lại như một thư viện không gian người dùng trên UDP (RFC 9000, 2021): gộp TLS vào cú bắt tay (1-RTT, 0-RTT khi nối lại), cho mỗi yêu cầu một luồng riêng để bỏ nghẽn đầu hàng của TCP, chuyển kết nối khi đổi Wi-Fi sang 4G; phía máy chủ là THẬT trong lab (nginx HTTP/3 nghe UDP, quảng cáo Alt-Svc) nhưng cú bắt tay QUIC mã hoá nên đọc bằng khoá, không phải tcpdump.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>QUIC: transport rebuilt on UDP</h2>
<p class="lead">The last lesson showed UDP giving you almost nothing — no handshake, no reliability, no ordering. QUIC takes that blank slate and rebuilds <em>everything TCP and TLS give you</em> on top of it: a reliable, ordered, encrypted connection — but as a library in the browser and the server, not in the kernel. That one move lets QUIC fix TCP’s oldest problems (the head-of-line blocking of lesson 4.2, the slow handshake of lesson 4.1) and ship improvements without waiting for every operating system to update. This lesson explains what QUIC is, measures the server side in the lab, and is honest about the one thing you cannot do here: read an encrypted QUIC handshake in tcpdump.</p>

<h3>QUIC in one sentence</h3>
<p>QUIC gives you everything TCP + TLS give you — a reliable, ordered, encrypted connection — <strong>rebuilt as a user-space library on top of UDP</strong>. In HTTP/3 the stack looks like this:</p>
<table>
<tr><th>Layer</th><th>Classic HTTPS</th><th>HTTP/3</th></tr>
<tr><td>Application</td><td>HTTP/1.1 or HTTP/2</td><td>HTTP/3</td></tr>
<tr><td>Security</td><td>TLS 1.3</td><td><strong>TLS 1.3, folded inside QUIC</strong></td></tr>
<tr><td>Transport</td><td>TCP (in the kernel)</td><td><strong>QUIC (in user space)</strong></td></tr>
<tr><td>Network</td><td>IP</td><td>IP, carried over <strong>UDP</strong></td></tr>
</table>
<p>Because QUIC lives in the browser and in nginx rather than the kernel, it can evolve at the speed of application releases — and the kernel’s TCP tools (<code>ss</code>, most of <code>tcpdump</code>’s decoding) cannot see inside it. That is the whole bargain, and both its strength and the reason it is harder to debug.</p>

<h3>From Google (2012) to RFC 9000 (2021)</h3>
<p>Around 2012–2013 Google shipped an experimental QUIC in Chrome and on its own servers. From 2016 to 2021 the IETF standardised a new, cleaner QUIC with TLS 1.3 built in, published in 2021 as <strong>RFC 9000</strong> (QUIC) and <strong>RFC 9114</strong> (HTTP/3). The motivation was concrete and came straight out of Chapter 4:</p>
<ul>
<li>TCP’s <strong>head-of-line blocking</strong> (lesson 4.2) limited HTTP/2 — one lost packet stalled every multiplexed request.</li>
<li>The <strong>TCP + TLS handshake</strong> cost 2–3 round trips before the first byte (lesson 4.1).</li>
<li>Changing TCP means changing <strong>every operating system’s kernel</strong> — a decade-long process.</li>
</ul>
<p>Moving the transport into user space on UDP solved all three at once.</p>
${net('waterfall', 'far', 'en', 'On a far link the handshake dominates — QUIC collapses TCP+TLS into one round trip. Walk the phases.', { tour: 'waterfall-phases' })}

<h3>One handshake instead of two</h3>
<p>With classic HTTPS, opening a connection is a TCP handshake (one round trip) <em>then</em> a TLS 1.3 handshake (another) before any HTTP flows. QUIC folds the cryptographic handshake into its own: a single round trip establishes a secure, ready-to-use connection — <strong>1-RTT</strong> — and a <strong>0-RTT</strong> resumption can send data in the very first packet to a server you have talked to before. On a link to another continent (150 ms each way), saving a round trip saves 150 ms off the time before anything loads — the latency users feel first.</p>

<h3>The real server side, measured in the lab</h3>
<p>We cannot run a QUIC <em>client</em> in the lab (our <code>curl</code> was built without HTTP/3), but the <em>server</em> side is completely real. The lab’s nginx has the HTTP/3 module, and a small config makes it listen for QUIC:</p>
${cmd('docker exec nfd-web nginx -c /lab/k/code/ch05/h3.conf       # a TLS + HTTP/3 vhost on 8443', 'docker exec -it nfd-web bash')}
${run('c52-server', 'nginx -V', 1)}
${run('c52-server', 'ss -ulnp', 1, { cut: 110 })}
${run('c52-server', 'ss -tlnp', 1, { cut: 110 })}
<p>QUIC is <strong>real UDP</strong>: nginx listens on a <strong>UDP</strong> port for QUIC, next to the TCP port for the TLS/HTTP-2 fallback. A web server with a UDP listener on 443 is the unmistakable fingerprint of HTTP/3 — something no TCP-only server ever shows.</p>

<h3>How a browser discovers HTTP/3: Alt-Svc</h3>
<p>A browser does not start with QUIC. Its <em>first</em> request to a site goes over TCP/HTTP-2, and the response advertises HTTP/3 with the <code>Alt-Svc</code> header. Our lab server sends it, and so do the real sites:</p>
${run('c52-server', 'curl -sk --http2', 1)}
${run('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/', 1)}
<p><code>alt-svc: h3=":443"</code> means “I also speak HTTP/3 on UDP 443.” The browser remembers this and tries QUIC on the <em>next</em> connection. HTTP/3 is therefore opt-in, discovered, and reversible — if the QUIC attempt fails, the browser simply keeps using the TCP connection it already has (lesson 5.3).</p>

<h3>The payoff: no head-of-line blocking</h3>
<p>This is the problem QUIC was really built to solve. HTTP/2 multiplexes many requests onto <strong>one TCP connection</strong>, and because TCP must deliver its single stream in order, one lost packet stalls <em>every</em> request riding that connection (lesson 4.2). QUIC gives each request its <strong>own stream</strong> with its own ordering, so a lost packet holds up only the stream it belonged to — the others keep flowing. One slow image no longer blocks the whole page. QUIC moved ordering <em>above</em> the loss-recovery layer, which is the structural fix TCP could never retrofit.</p>

<h3>Connection migration: surviving a network change</h3>
<p>A TCP connection <em>is</em> its 4-tuple (source IP:port, destination IP:port). The moment your IP changes — stepping off office Wi-Fi onto 4G — that 4-tuple no longer exists, the connection dies, and everything reconnects (and re-handshakes). A QUIC connection carries its own <strong>Connection ID</strong>, independent of IP and port, so when your address changes the connection <strong>migrates</strong> and keeps going: the download continues, the call does not drop, the upload is not restarted. This is why QUIC’s biggest wins are on mobile, where addresses change constantly.</p>

<div class="pitfall co-tieu-de">
<p><strong>“HTTP/3” is not automatically faster — measure it.</strong> On a good, low-latency wired network, HTTP/2 over TCP and HTTP/3 over QUIC are often indistinguishable; QUIC’s wins show up on <em>lossy or high-latency</em> links (mobile, far servers, congested Wi-Fi), where the removed head-of-line blocking, the saved handshake round trip, and connection migration matter. Enabling HTTP/3 (e.g. on Cloudflare) is cheap and safe because of the Alt-Svc fallback, but do not expect a speed-up on a fast LAN — benchmark on the networks your users actually have.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>You cannot read QUIC the way you read TCP.</strong> QUIC encrypts almost everything, including most transport headers, so <code>tcpdump</code> shows little more than “UDP datagrams to port 443”. To actually read a QUIC connection you need the keys: the server’s, or an <code>SSLKEYLOGFILE</code> from a browser you control, fed to Wireshark. Debugging shifts from reading packets to reading <em>logs</em> — the server’s HTTP/3 access log, the browser’s <code>chrome://net-export</code>. Plan for this before you deploy HTTP/3.
<br><span style="font-size:0.9em;color:#777">⏳ Chưa chạy thật trong lab: bắt và giải mã cú bắt tay QUIC — ảnh lab không có client HTTP/3 (curl thiếu HTTP/3; không có client h3 khác). Phía máy chủ ở trên là thật; cú bắt tay đọc theo RFC 9000 + bài viết Cloudflare.</span> <!-- CHAY-O-MAY: QUIC client handshake capture — no h3 client in net-lab image -->
</p>
</div>

<h3>Where this lives in the computer</h3>
<ul>
<li><strong>QUIC itself</strong> is a user-space library (in Chrome, in nginx, in <code>quiche</code>/<code>msquic</code>) over a plain UDP socket — not kernel code like TCP.</li>
<li><strong>The handshake</strong> is QUIC and TLS 1.3 combined: 1-RTT, or 0-RTT on resumption.</li>
<li><strong>Streams</strong> are many independent, independently-ordered byte streams inside one QUIC connection.</li>
<li><strong>The Connection ID</strong> identifies the connection independently of IP:port, which is what makes migration possible.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your lead asks, “should we turn on HTTP/3? And how would we even tell it is working?” Answer with evidence from the lab and the real Internet.</p>
<ol>
<li>Start the HTTP/3 vhost (<code>nginx -c /lab/k/code/ch05/h3.conf</code> on <code>nfd-web</code>). Run <code>ss -ulnp</code> and <code>ss -tlnp</code> and show it listening on <strong>both</strong> UDP and TCP 8443.</li>
<li>Fetch over the TCP side with <code>curl -sk --http2 -D - https://localhost:8443/ -o /dev/null</code> and find the <code>alt-svc</code> header. Explain what a browser does with it.</li>
<li>From the <code>internet</code> container, run <code>curl -sI https://www.cloudflare.com/ | grep -i alt-svc</code> and compare.</li>
<li>Write three sentences: what HTTP/3 changes (handshake, HoL, migration), how to verify it server-side (UDP listener + Alt-Svc) and client-side (browser dev tools / net-export), and when you would <em>not</em> expect a speed-up.</li>
</ol>
<p><strong>Done when:</strong> you can point at a UDP listener as the server-side proof, an <code>Alt-Svc</code> header as the discovery mechanism, and explain that HTTP/3’s gains are on lossy/mobile links, not a fast LAN.</p>
<details><summary>Solution</summary>
<p><code>ss -uln</code> shows nginx on UDP 8443; <code>ss -tln</code> shows it on TCP 8443 too. The HTTP/2 response carries <code>alt-svc: h3=":8443"</code>; a browser remembers it and tries QUIC next time. Cloudflare returns <code>alt-svc: h3=":443"</code>. Sentences: “HTTP/3 folds TLS into a 1-RTT handshake, removes TCP head-of-line blocking by giving each request its own stream, and survives a network change via connection migration. Verify it server-side by a UDP listener on 443 plus an Alt-Svc header, and client-side in the browser’s network panel (protocol = h3). Do not expect a speed-up on a fast wired LAN — the wins are on lossy or high-latency mobile links.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['QUIC', 'A reliable, ordered, encrypted transport rebuilt as a user-space library on UDP (RFC 9000).'],
  ['HTTP/3 (HTTP thế hệ 3)', 'HTTP over QUIC (RFC 9114); discovered via Alt-Svc, carried on UDP.'],
  ['Alt-Svc (dịch vụ thay thế)', 'A response header advertising “I also speak h3 on UDP 443”, so a browser can upgrade.'],
  ['1-RTT / 0-RTT (một / không vòng khứ hồi)', 'QUIC’s combined handshake: secure in one round trip, data in the first packet on resume.'],
  ['stream (luồng)', 'One of many independently-ordered byte streams inside a QUIC connection — no shared HoL blocking.'],
  ['connection migration (chuyển kết nối)', 'Keeping a QUIC connection alive across an IP change via its Connection ID.'],
  ['Connection ID', 'An identifier independent of IP:port that lets a connection survive a network change.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>QUIC = TCP’s reliability + TLS 1.3, rebuilt as a user-space library on UDP (RFC 9000, 2021).</li>
<li>It folds TLS into the handshake: a secure connection in 1-RTT, 0-RTT on resume.</li>
<li>Each request gets its own stream, so a lost packet no longer stalls every request — the TCP head-of-line blocking of lesson 4.2 is gone.</li>
<li>Connection migration keeps the connection alive when Wi-Fi becomes 4G.</li>
<li>The server listens on UDP and advertises <code>h3</code> via <code>Alt-Svc</code>; QUIC is encrypted, so you read it with keys and logs, not tcpdump.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9000', '📄', 'RFC 9000 — QUIC (2021)', 'The transport: streams, the handshake, connection IDs and migration.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9114', '📄', 'RFC 9114 — HTTP/3', 'HTTP over QUIC, and the Alt-Svc discovery this lesson measured.', 'Open')}
${L('https://blog.cloudflare.com/the-road-to-quic/', '📝', 'Cloudflare — The Road to QUIC', 'Why QUIC exists, the handshake, and head-of-line blocking, explained with diagrams.', 'Open')}
${L('https://http3-explained.haxx.se/', '📘', 'HTTP/3 explained (Daniel Stenberg)', 'A free book on QUIC and HTTP/3 from the author of curl.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>QUIC: tầng vận chuyển dựng lại trên UDP</h2>
<p class="lead">Bài trước cho thấy UDP cho bạn gần như không gì cả — không bắt tay, không tin cậy, không thứ tự. QUIC lấy tấm bảng trắng đó và dựng lại <em>mọi thứ TCP và TLS cho bạn</em> trên nó: một kết nối đáng tin, có thứ tự, mã hoá — nhưng như một thư viện trong trình duyệt và máy chủ, không phải trong nhân. Một bước đó cho QUIC sửa được các vấn đề lâu đời nhất của TCP (nghẽn đầu hàng ở bài 4.2, cú bắt tay chậm ở bài 4.1) và ra cải tiến mà không chờ mọi hệ điều hành cập nhật. Bài này giải thích QUIC là gì, đo phía máy chủ trong lab, và thành thật về một điều bạn không làm được ở đây: đọc một cú bắt tay QUIC mã hoá trong tcpdump.</p>

<h3>QUIC trong một câu</h3>
<p>QUIC cho bạn mọi thứ TCP + TLS cho bạn — một kết nối đáng tin, có thứ tự, mã hoá — <strong>dựng lại như một thư viện không gian người dùng trên UDP</strong>. Trong HTTP/3 ngăn xếp trông như sau:</p>
<table>
<tr><th>Tầng</th><th>HTTPS cổ điển</th><th>HTTP/3</th></tr>
<tr><td>Ứng dụng</td><td>HTTP/1.1 hoặc HTTP/2</td><td>HTTP/3</td></tr>
<tr><td>Bảo mật</td><td>TLS 1.3</td><td><strong>TLS 1.3, gộp bên trong QUIC</strong></td></tr>
<tr><td>Vận chuyển</td><td>TCP (trong nhân)</td><td><strong>QUIC (không gian người dùng)</strong></td></tr>
<tr><td>Mạng</td><td>IP</td><td>IP, mang qua <strong>UDP</strong></td></tr>
</table>
<p>Vì QUIC sống trong trình duyệt và trong nginx chứ không phải nhân, nó tiến hoá ở tốc độ phát hành ứng dụng — và các công cụ TCP của nhân (<code>ss</code>, phần lớn giải mã của <code>tcpdump</code>) không nhìn vào trong nó. Đó là toàn bộ giao kèo, vừa là sức mạnh vừa là lý do nó khó gỡ lỗi hơn.</p>

<h3>Từ Google (2012) tới RFC 9000 (2021)</h3>
<p>Khoảng 2012–2013 Google ra một QUIC thử nghiệm trong Chrome và trên máy chủ của họ. Từ 2016 tới 2021 IETF chuẩn hoá một QUIC mới, sạch hơn với TLS 1.3 gắn sẵn, công bố năm 2021 là <strong>RFC 9000</strong> (QUIC) và <strong>RFC 9114</strong> (HTTP/3). Động cơ rất cụ thể và đến thẳng từ Chương 4:</p>
<ul>
<li><strong>Nghẽn đầu hàng</strong> của TCP (bài 4.2) giới hạn HTTP/2 — một gói mất làm kẹt mọi yêu cầu ghép kênh.</li>
<li><strong>Cú bắt tay TCP + TLS</strong> tốn 2–3 vòng khứ hồi trước byte đầu (bài 4.1).</li>
<li>Đổi TCP nghĩa là đổi <strong>nhân của mọi hệ điều hành</strong> — một quá trình kéo dài cả thập kỷ.</li>
</ul>
<p>Dời tầng vận chuyển vào không gian người dùng trên UDP giải quyết cả ba cùng lúc.</p>
${net('waterfall', 'far', 'vi', 'Trên một đường xa cú bắt tay chiếm phần lớn — QUIC gộp TCP+TLS thành một vòng khứ hồi. Đi qua các pha.', { tour: 'waterfall-phases' })}

<h3>Một cú bắt tay thay vì hai</h3>
<p>Với HTTPS cổ điển, mở một kết nối là một cú bắt tay TCP (một vòng khứ hồi) <em>rồi</em> một cú bắt tay TLS 1.3 (một vòng nữa) trước khi HTTP chảy. QUIC gộp cú bắt tay mật mã vào cú bắt tay của chính nó: một vòng khứ hồi duy nhất thiết lập một kết nối an toàn, sẵn dùng — <strong>1-RTT</strong> — và một lần nối lại <strong>0-RTT</strong> có thể gửi dữ liệu ngay trong gói đầu tiên tới một máy chủ bạn đã nói chuyện trước đó. Trên một đường tới châu lục khác (150 ms mỗi chiều), tiết kiệm một vòng là tiết kiệm 150 ms trước khi bất cứ gì tải — độ trễ người dùng cảm thấy đầu tiên.</p>

<h3>Phía máy chủ thật, đo trong lab</h3>
<p>Ta không chạy được một <em>client</em> QUIC trong lab (<code>curl</code> của ta dựng không có HTTP/3), nhưng phía <em>máy chủ</em> hoàn toàn thật. nginx của lab có module HTTP/3, và một cấu hình nhỏ cho nó nghe QUIC:</p>
${cmd('docker exec nfd-web nginx -c /lab/k/code/ch05/h3.conf       # một vhost TLS + HTTP/3 trên 8443', 'docker exec -it nfd-web bash')}
${run('c52-server', 'nginx -V', 1)}
${run('c52-server', 'ss -ulnp', 1, { cut: 110 })}
${run('c52-server', 'ss -tlnp', 1, { cut: 110 })}
<p>QUIC là <strong>UDP thật</strong>: nginx nghe trên một cổng <strong>UDP</strong> cho QUIC, cạnh cổng TCP cho đường lùi TLS/HTTP-2. Một máy chủ web có socket nghe UDP trên 443 là dấu vân tay không thể nhầm của HTTP/3 — thứ mà không máy chủ chỉ-TCP nào có.</p>

<h3>Trình duyệt tìm HTTP/3 thế nào: Alt-Svc</h3>
<p>Một trình duyệt không bắt đầu bằng QUIC. Yêu cầu <em>đầu tiên</em> của nó tới một site đi qua TCP/HTTP-2, và câu trả lời quảng cáo HTTP/3 bằng header <code>Alt-Svc</code>. Máy chủ lab của ta gửi nó, và các site thật cũng vậy:</p>
${run('c52-server', 'curl -sk --http2', 1)}
${run('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/', 1)}
<p><code>alt-svc: h3=":443"</code> nghĩa là “tôi cũng nói HTTP/3 trên UDP 443.” Trình duyệt nhớ điều này và thử QUIC trên kết nối <em>kế tiếp</em>. Do đó HTTP/3 là tự chọn, khám phá được, và đảo ngược được — nếu lần thử QUIC hỏng, trình duyệt đơn giản tiếp tục dùng kết nối TCP nó đã có (bài 5.3).</p>

<h3>Phần thưởng: không còn nghẽn đầu hàng</h3>
<p>Đây là vấn đề QUIC thật sự sinh ra để giải quyết. HTTP/2 ghép nhiều yêu cầu lên <strong>một kết nối TCP</strong>, và vì TCP phải giao luồng duy nhất của nó đúng thứ tự, một gói mất làm kẹt <em>mọi</em> yêu cầu đi trên kết nối đó (bài 4.2). QUIC cho mỗi yêu cầu một <strong>luồng riêng</strong> với thứ tự riêng, nên một gói mất chỉ giữ lại luồng nó thuộc về — các luồng khác vẫn chảy. Một ảnh chậm không còn chặn cả trang. QUIC dời thứ tự lên <em>trên</em> tầng phục hồi mất gói, là cú sửa cấu trúc mà TCP không bao giờ gắn thêm được.</p>

<h3>Chuyển kết nối: sống sót qua một lần đổi mạng</h3>
<p>Một kết nối TCP <em>chính là</em> bộ-4 của nó (IP:cổng nguồn, IP:cổng đích). Khoảnh khắc IP của bạn đổi — bước khỏi Wi-Fi văn phòng sang 4G — bộ-4 đó không còn tồn tại, kết nối chết, và mọi thứ nối lại (và bắt tay lại). Một kết nối QUIC mang <strong>Connection ID</strong> riêng, độc lập với IP và cổng, nên khi địa chỉ đổi kết nối <strong>chuyển</strong> và tiếp tục: lần tải tiếp tục, cuộc gọi không rớt, lần upload không bị dựng lại. Đây là lý do thắng lợi lớn nhất của QUIC ở trên di động, nơi địa chỉ đổi liên tục.</p>

<div class="pitfall co-tieu-de">
<p><strong>“HTTP/3” không tự động nhanh hơn — hãy đo.</strong> Trên một mạng dây tốt, độ trễ thấp, HTTP/2 trên TCP và HTTP/3 trên QUIC thường không phân biệt được; thắng lợi của QUIC hiện ra trên các đường <em>hay mất gói hoặc độ trễ cao</em> (di động, máy chủ xa, Wi-Fi nghẽn), nơi việc bỏ nghẽn đầu hàng, tiết kiệm vòng khứ hồi bắt tay, và chuyển kết nối mới quan trọng. Bật HTTP/3 (ví dụ trên Cloudflare) rẻ và an toàn nhờ đường lùi Alt-Svc, nhưng đừng mong nhanh hơn trên một LAN nhanh — hãy đo trên mạng người dùng của bạn thật sự có.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bạn không đọc QUIC theo cách đọc TCP.</strong> QUIC mã hoá gần như mọi thứ, kể cả phần lớn header vận chuyển, nên <code>tcpdump</code> chỉ cho thấy nhiều hơn chút “các gói UDP tới cổng 443”. Để thật sự đọc một kết nối QUIC bạn cần khoá: của máy chủ, hoặc một <code>SSLKEYLOGFILE</code> từ một trình duyệt bạn điều khiển, đưa vào Wireshark. Gỡ lỗi chuyển từ đọc gói sang đọc <em>log</em> — log truy cập HTTP/3 của máy chủ, <code>chrome://net-export</code> của trình duyệt. Hãy chuẩn bị điều này trước khi triển khai HTTP/3.
<br><span style="font-size:0.9em;color:#777">⏳ Chưa chạy thật trong lab: bắt và giải mã cú bắt tay QUIC — ảnh lab không có client HTTP/3 (curl thiếu HTTP/3; không có client h3 khác). Phía máy chủ ở trên là thật; cú bắt tay đọc theo RFC 9000 + bài viết Cloudflare.</span> <!-- CHAY-O-MAY: QUIC client handshake capture — no h3 client in net-lab image -->
</p>
</div>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>QUIC tự nó</strong> là một thư viện không gian người dùng (trong Chrome, trong nginx, trong <code>quiche</code>/<code>msquic</code>) trên một socket UDP thường — không phải mã nhân như TCP.</li>
<li><strong>Cú bắt tay</strong> là QUIC và TLS 1.3 gộp lại: 1-RTT, hoặc 0-RTT khi nối lại.</li>
<li><strong>Luồng (stream)</strong> là nhiều luồng byte độc lập, sắp thứ tự độc lập bên trong một kết nối QUIC.</li>
<li><strong>Connection ID</strong> định danh kết nối độc lập với IP:cổng, là thứ làm chuyển kết nối khả thi.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trưởng nhóm hỏi, “có nên bật HTTP/3 không? Và làm sao biết nó chạy?” Trả lời bằng bằng chứng từ lab và Internet thật.</p>
<ol>
<li>Dựng vhost HTTP/3 (<code>nginx -c /lab/k/code/ch05/h3.conf</code> trên <code>nfd-web</code>). Chạy <code>ss -ulnp</code> và <code>ss -tlnp</code> và cho thấy nó nghe trên <strong>cả</strong> UDP và TCP 8443.</li>
<li>Lấy qua phía TCP với <code>curl -sk --http2 -D - https://localhost:8443/ -o /dev/null</code> và tìm header <code>alt-svc</code>. Giải thích trình duyệt làm gì với nó.</li>
<li>Từ container <code>internet</code>, chạy <code>curl -sI https://www.cloudflare.com/ | grep -i alt-svc</code> và so.</li>
<li>Viết ba câu: HTTP/3 đổi gì (bắt tay, HoL, chuyển kết nối), cách xác minh phía máy chủ (socket UDP + Alt-Svc) và phía client (dev tools trình duyệt / net-export), và khi nào bạn <em>không</em> mong nhanh hơn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ được một socket UDP làm bằng chứng phía máy chủ, một header <code>Alt-Svc</code> làm cơ chế khám phá, và giải thích rằng thắng lợi của HTTP/3 ở trên đường hay mất gói/di động, không phải một LAN nhanh.</p>
<details><summary>Lời giải</summary>
<p><code>ss -uln</code> cho thấy nginx trên UDP 8443; <code>ss -tln</code> cho thấy nó trên TCP 8443 nữa. Câu trả lời HTTP/2 mang <code>alt-svc: h3=":8443"</code>; một trình duyệt nhớ nó và thử QUIC lần sau. Cloudflare trả <code>alt-svc: h3=":443"</code>. Ba câu: “HTTP/3 gộp TLS vào một cú bắt tay 1-RTT, bỏ nghẽn đầu hàng của TCP bằng cách cho mỗi yêu cầu một luồng riêng, và sống sót qua một lần đổi mạng nhờ chuyển kết nối. Xác minh phía máy chủ bằng một socket UDP trên 443 cộng một header Alt-Svc, và phía client trong bảng mạng của trình duyệt (giao thức = h3). Đừng mong nhanh hơn trên một LAN dây nhanh — thắng lợi ở trên đường di động hay mất gói hoặc độ trễ cao.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['QUIC', 'Một tầng vận chuyển đáng tin, có thứ tự, mã hoá dựng lại như một thư viện không gian người dùng trên UDP (RFC 9000).'],
  ['HTTP/3 (HTTP thế hệ 3)', 'HTTP trên QUIC (RFC 9114); khám phá qua Alt-Svc, mang trên UDP.'],
  ['Alt-Svc (dịch vụ thay thế)', 'Một header câu trả lời quảng cáo “tôi cũng nói h3 trên UDP 443”, để trình duyệt nâng cấp.'],
  ['1-RTT / 0-RTT (một / không vòng khứ hồi)', 'Cú bắt tay gộp của QUIC: an toàn trong một vòng, dữ liệu trong gói đầu khi nối lại.'],
  ['stream (luồng)', 'Một trong nhiều luồng byte sắp thứ tự độc lập bên trong một kết nối QUIC — không chung nghẽn đầu hàng.'],
  ['connection migration (chuyển kết nối)', 'Giữ một kết nối QUIC sống qua một lần đổi IP nhờ Connection ID.'],
  ['Connection ID', 'Một định danh độc lập với IP:cổng cho phép một kết nối sống sót qua một lần đổi mạng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>QUIC = tính tin cậy của TCP + TLS 1.3, dựng lại như một thư viện không gian người dùng trên UDP (RFC 9000, 2021).</li>
<li>Nó gộp TLS vào cú bắt tay: một kết nối an toàn trong 1-RTT, 0-RTT khi nối lại.</li>
<li>Mỗi yêu cầu có luồng riêng, nên một gói mất không còn kẹt mọi yêu cầu — nghẽn đầu hàng tầng TCP của bài 4.2 biến mất.</li>
<li>Chuyển kết nối giữ kết nối sống khi Wi-Fi thành 4G.</li>
<li>Máy chủ nghe trên UDP và quảng cáo <code>h3</code> qua <code>Alt-Svc</code>; QUIC mã hoá, nên bạn đọc nó bằng khoá và log, không phải tcpdump.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9000', '📄', 'RFC 9000 — QUIC (2021)', 'Tầng vận chuyển: luồng, cú bắt tay, connection ID và chuyển kết nối.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9114', '📄', 'RFC 9114 — HTTP/3', 'HTTP trên QUIC, và khám phá Alt-Svc bài này đã đo.', 'Mở')}
${L('https://blog.cloudflare.com/the-road-to-quic/', '📝', 'Cloudflare — The Road to QUIC', 'Vì sao QUIC tồn tại, cú bắt tay, và nghẽn đầu hàng, giải thích kèm sơ đồ.', 'Mở')}
${L('https://http3-explained.haxx.se/', '📘', 'HTTP/3 explained (Daniel Stenberg)', 'Một cuốn sách miễn phí về QUIC và HTTP/3 từ tác giả của curl.', 'Mở')}
</div>
`,
};
