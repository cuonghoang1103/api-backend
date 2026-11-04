/**
 * Chương 7 · 7.3 — HTTP/3 trên QUIC (slug khung netdev-7-3-http3).
 * Output thật: lab/out/c73-*.out.txt. Client h3 = CHAY-O-MAY (ảnh lab thiếu client HTTP/3).
 */
import { run, card, kv, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-07-3.mjs';

const L = card;

export default {
  title: '7.3 — HTTP/3 over QUIC|||7.3 — HTTP/3 trên QUIC',
  slug: 'netdev-7-3-http3',
  type: 'LESSON',
  isFreePreview: true,
  description: 'HTTP/3 là ngữ nghĩa HTTP trên QUIC (RFC 9114) — cùng method/trạng thái/stream, tầng vận chuyển mới; trình duyệt tới nó qua Alt-Svc (TCP trước, h3 lần sau, đo được); nó bỏ nghẽn đầu hàng tầng TCP (mỗi stream QUIC thứ tự riêng) và tiết kiệm một vòng bắt tay; QPACK thay HPACK cho stream sai thứ tự; phía máy chủ thật trong lab (nginx nghe UDP 8443 + Alt-Svc) còn client h3 = CHAY-O-MAY.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>HTTP/3 over QUIC</h2>
<p class="lead">HTTP/2 fixed almost everything about HTTP/1.1 — but it left one problem it structurally could not solve: because it multiplexes over a single TCP connection, one lost packet still stalls every request (lesson 7.2). HTTP/3 (RFC 9114, 2022) removes that last stall by changing the transport underneath: it runs the same HTTP semantics over <strong>QUIC</strong> (Chapter 5) instead of TCP. Everything you know about HTTP stays the same — methods, status codes, headers, streams — and the one thing that changes, the transport, is the thing that was holding HTTP/2 back. This lesson shows how a browser upgrades to HTTP/3, measures the server side in the lab, and is honest about the one thing this environment cannot do: run an HTTP/3 client.</p>

<h3>HTTP/3 = HTTP over QUIC</h3>
<p>The cleanest way to understand HTTP/3 is as a swap in the stack:</p>
<table>
<tr><th>Layer</th><th>HTTP/2</th><th>HTTP/3</th></tr>
<tr><td>Application</td><td>HTTP/2</td><td>HTTP/3</td></tr>
<tr><td>Header compression</td><td>HPACK</td><td><strong>QPACK</strong></td></tr>
<tr><td>Transport</td><td>TCP + TLS</td><td><strong>QUIC</strong> (TLS 1.3 built in)</td></tr>
<tr><td>Network</td><td>IP</td><td>IP, carried over <strong>UDP</strong></td></tr>
</table>
<p>HTTP/3 keeps the <strong>same semantics</strong> as HTTP/1.1 and HTTP/2 — a GET is still a GET, streams are still streams. What changes is that those streams now ride QUIC, which gives each one <em>independent</em> ordering and folds TLS into a 1-RTT handshake (lesson 5.2). The whole of Chapter 5 is the transport; this lesson is the HTTP mapping on top of it.</p>

<h3>The upgrade path: h1 → h2 → h3</h3>
<p>A browser never starts with HTTP/3. It connects over TCP, and the response <em>advertises</em> HTTP/3 with the <code>Alt-Svc</code> header:</p>
${cmd('docker exec nfd-web nginx -c /lab/k/code/ch07/h7.conf     # TLS + h2 + h3 on :8443', 'docker exec -it nfd-client bash')}
${run('c73-server', 'curl -sk --http2 -o /dev/null -D - https', 1)}
<ul>
<li>First visit: the browser connects over <strong>TCP</strong> — HTTP/1.1, or HTTP/2 chosen by ALPN (lesson 7.2).</li>
<li>The response header <code>alt-svc: h3=":443"</code> says “I also speak HTTP/3 on UDP 443.”</li>
<li>The browser remembers this and tries <strong>HTTP/3 on the next connection</strong>. HTTP/3 is opt-in, discovered, and reversible — if QUIC is blocked, the browser silently stays on TCP (Chapter 5, lesson 5.3).</li>
</ul>
${net('waterfall', 'far', 'en', 'On a far link HTTP/3’s 1-RTT handshake and independent streams save the most — walk the phases.', { tour: 'waterfall-phases' })}

<h3>The server side is real UDP</h3>
<p>We cannot run an HTTP/3 <em>client</em> in the lab, but the <em>server</em> is completely real. The same nginx listens on both transports:</p>
${run('c73-server', 'ss -ulnp', 1, { cut: 100 })}
${run('c73-server', 'ss -tlnp', 1, { cut: 100 })}
<p>A <strong>UDP</strong> listener (QUIC / HTTP-3) next to the <strong>TCP</strong> listener (HTTP-1.1 / HTTP-2) on the same port. A web server with a UDP listener on 443 is the unmistakable fingerprint of HTTP/3 (lesson 5.2). Real sites do the same — their <code>Alt-Svc</code> header advertises it, and their 443/UDP is open.</p>

<h3>Why HTTP/3 beats HTTP/2 (and when it does not)</h3>
<table>
<tr><th></th><th>HTTP/2 over TCP</th><th>HTTP/3 over QUIC</th></tr>
<tr><td>A lost packet</td><td>stalls <strong>all</strong> streams (TCP in-order)</td><td>stalls <strong>only</strong> its own stream</td></tr>
<tr><td>Handshake</td><td>TCP + TLS = 2 RTT</td><td>QUIC + TLS = <strong>1 RTT</strong>, 0-RTT on resume</td></tr>
<tr><td>Change networks</td><td>connection dies (new 4-tuple)</td><td><strong>migrates</strong> (Connection ID)</td></tr>
</table>
<p>The headline is the first row: HTTP/2 removed head-of-line blocking at the HTTP layer, and HTTP/3 removes it at the <strong>TCP layer</strong> too, because each QUIC stream is ordered independently (lessons 4.2, 5.2). But — as in Chapter 5 — these wins show up on <strong>lossy and high-latency</strong> links (mobile, far servers, congested Wi-Fi). On a clean, low-latency LAN, HTTP/2 and HTTP/3 are often indistinguishable. Enable HTTP/3 (it is cheap and safe thanks to the Alt-Svc fallback), but benchmark on the networks your users actually have.</p>

<h3>QPACK: HPACK redesigned for out-of-order streams</h3>
<p>HTTP/2’s HPACK (lesson 7.2) compresses headers against a shared table, and it quietly assumes headers arrive <strong>in order</strong> — which is true over TCP. Over QUIC, streams arrive <em>independently</em>, so a header table that could block waiting for a missing update from another stream would re-introduce exactly the head-of-line blocking QUIC exists to avoid. HTTP/3 therefore uses <strong>QPACK</strong>: the same compression idea, re-engineered so that decoding a stream’s headers never has to wait on another stream. You get HPACK’s saving on repeated headers without giving back the HoL win.</p>

<div class="pitfall co-tieu-de">
<p><strong>Enabling HTTP/3 is a config + fallback, not a rewrite.</strong> Your application code does not change — HTTP semantics are identical. You turn it on at the edge (nginx <code>listen 443 quic</code> + the <code>Alt-Svc</code> header, or one toggle on Cloudflare). The two things to verify: the server has a <strong>UDP 443 listener</strong>, and clients can actually reach it (a network that blocks UDP 443 just keeps using HTTP/2 — slower, never broken, lesson 5.3). Never build a feature that <em>requires</em> HTTP/3; it must always degrade to HTTP/2 over TCP.</p>
</div>

<h3>Reading HTTP/3: mostly from logs</h3>
<p>On the server side we have real evidence (a UDP listener, an <code>Alt-Svc</code> header). On the client side, QUIC is encrypted almost end to end, and this lab’s <code>curl</code> was built without HTTP/3, so there is no way to generate an HTTP/3 request here. You read the protocol you got from the <strong>endpoints</strong>, not the wire: the browser’s Network panel shows <code>h3</code> / <code>h2</code> / <code>http/1.1</code> per request, and <code>chrome://net-export</code> logs QUIC attempts, fallbacks and migrations. Debugging HTTP/3 shifts from reading packets to reading logs.</p>
<p><span style="font-size:0.9em;color:#777">⏳ Chưa chạy thật trong lab: lấy một trang bằng <strong>client HTTP/3</strong> và đọc frame — ảnh <code>net-lab</code> dựng curl không kèm HTTP/3; không có client h3 khác. Phía máy chủ (UDP 8443 + Alt-Svc) ở trên là thật; mapping HTTP/3 đọc theo RFC 9114 và Chương 5.</span> <!-- CHAY-O-MAY: HTTP/3 client request — no h3 client in net-lab image --></p>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your lead asks “is our HTTP/3 actually working, and how would a user even get it?” Answer with lab evidence and the real Internet.</p>
<ol>
<li>Start the h2/h3 vhost. On <code>nfd-web</code>, run <code>ss -ulnp</code> and <code>ss -tlnp</code> and show the server on <strong>both</strong> UDP and TCP 8443.</li>
<li>Find the <code>Alt-Svc: h3</code> header on the HTTP/2 response (<code>curl -sk --http2 -D - …</code>), and explain what a browser does with it.</li>
<li>From a real browser, open an HTTP/3 site (e.g. cloudflare.com), open dev tools → Network, and read the <code>Protocol</code> column (<code>h3</code>). Explain why your first request was <code>h2</code>.</li>
<li>Write two sentences: what HTTP/3 changes vs HTTP/2, and when you would <em>not</em> expect a speed-up.</li>
</ol>
<p><strong>Done when:</strong> you can point at a UDP listener + Alt-Svc as server-side proof, describe the h2→h3 upgrade, and state that HTTP/3’s wins are on lossy/mobile links, not a fast LAN.</p>
<details><summary>Solution</summary>
<p><code>ss -uln</code> shows nginx on UDP 8443, <code>ss -tln</code> on TCP 8443; the h2 response carries <code>alt-svc: h3=":8443"</code>. A browser uses the current TCP/h2 connection, remembers the h3 advertisement, and tries QUIC next time — so the first request is always h2, later ones h3. Sentences: “HTTP/3 runs the same HTTP over QUIC, removing TCP head-of-line blocking and saving a handshake round trip, and it survives a network change via connection migration. Do not expect a speed-up on a fast wired LAN — the wins are on lossy or high-latency mobile links.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['HTTP/3', 'HTTP semantics over QUIC (RFC 9114): same methods/status/streams, new transport.'],
  ['QUIC', 'The transport under HTTP/3 (Chapter 5): reliable, multiplexed, encrypted, on UDP.'],
  ['Alt-Svc', 'The response header advertising h3 on UDP 443; how a browser discovers HTTP/3.'],
  ['QPACK (nén header)', 'HTTP/3’s header compression, redesigned so decoding never blocks on another stream.'],
  ['independent streams (luồng độc lập)', 'Each QUIC stream is ordered on its own — no TCP head-of-line blocking.'],
  ['connection migration', 'Keeping the connection alive across an IP change via the QUIC Connection ID.'],
  ['UDP listener', 'A server socket on UDP 443 — the unmistakable sign of HTTP/3.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>HTTP/3 is HTTP semantics over QUIC (RFC 9114) — same methods, status, streams; a new transport.</li>
<li>A browser reaches it via <code>Alt-Svc</code>: TCP first, then HTTP/3 next time — opt-in and reversible.</li>
<li>It removes TCP head-of-line blocking (each QUIC stream ordered on its own) and saves a handshake RTT.</li>
<li>QPACK gives HPACK’s header saving without re-introducing blocking over out-of-order streams.</li>
<li>Server proof = a UDP listener + <code>Alt-Svc</code>; read the protocol from the browser, not tcpdump; HTTP/3 must always fall back to HTTP/2.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9114', '📄', 'RFC 9114 — HTTP/3', 'Mapping HTTP onto QUIC: streams, frames, and the Alt-Svc upgrade.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9204', '📄', 'RFC 9204 — QPACK', 'Header compression for HTTP/3, safe over out-of-order QUIC streams.', 'Open')}
${L('https://blog.cloudflare.com/http3-the-past-present-and-future/', '📝', 'Cloudflare — HTTP/3: past, present and future', 'Deploying HTTP/3, the Alt-Svc upgrade, and what to expect.', 'Open')}
${L('https://http3-explained.haxx.se/', '📘', 'HTTP/3 explained (Daniel Stenberg)', 'A free book on QUIC and HTTP/3 from the author of curl.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>HTTP/3 trên QUIC</h2>
<p class="lead">HTTP/2 sửa gần như mọi thứ của HTTP/1.1 — nhưng để lại một vấn đề về cấu trúc nó không giải được: vì nó ghép trên một kết nối TCP duy nhất, một gói mất vẫn kẹt mọi yêu cầu (bài 7.2). HTTP/3 (RFC 9114, 2022) bỏ cú kẹt cuối đó bằng cách đổi tầng vận chuyển bên dưới: nó chạy cùng ngữ nghĩa HTTP trên <strong>QUIC</strong> (Chương 5) thay vì TCP. Mọi thứ bạn biết về HTTP giữ nguyên — method, mã trạng thái, header, stream — và điều duy nhất đổi, tầng vận chuyển, chính là thứ đã kìm HTTP/2. Bài này chỉ ra một trình duyệt nâng lên HTTP/3 ra sao, đo phía máy chủ trong lab, và thành thật về điều môi trường này không làm được: chạy một client HTTP/3.</p>

<h3>HTTP/3 = HTTP trên QUIC</h3>
<p>Cách sạch nhất để hiểu HTTP/3 là một cú tráo trong ngăn xếp:</p>
<table>
<tr><th>Tầng</th><th>HTTP/2</th><th>HTTP/3</th></tr>
<tr><td>Ứng dụng</td><td>HTTP/2</td><td>HTTP/3</td></tr>
<tr><td>Nén header</td><td>HPACK</td><td><strong>QPACK</strong></td></tr>
<tr><td>Vận chuyển</td><td>TCP + TLS</td><td><strong>QUIC</strong> (TLS 1.3 gắn sẵn)</td></tr>
<tr><td>Mạng</td><td>IP</td><td>IP, mang qua <strong>UDP</strong></td></tr>
</table>
<p>HTTP/3 giữ <strong>cùng ngữ nghĩa</strong> với HTTP/1.1 và HTTP/2 — một GET vẫn là một GET, stream vẫn là stream. Cái đổi là các stream đó giờ đi trên QUIC, thứ cho mỗi cái thứ tự <em>độc lập</em> và gộp TLS vào một cú bắt tay 1-RTT (bài 5.2). Cả Chương 5 là tầng vận chuyển; bài này là phần mapping HTTP đặt trên nó.</p>

<h3>Đường nâng cấp: h1 → h2 → h3</h3>
<p>Một trình duyệt không bao giờ bắt đầu bằng HTTP/3. Nó nối qua TCP, và câu trả lời <em>quảng cáo</em> HTTP/3 bằng header <code>Alt-Svc</code>:</p>
${cmd('docker exec nfd-web nginx -c /lab/k/code/ch07/h7.conf     # TLS + h2 + h3 trên :8443', 'docker exec -it nfd-client bash')}
${run('c73-server', 'curl -sk --http2 -o /dev/null -D - https', 1)}
<ul>
<li>Lần đầu: trình duyệt nối qua <strong>TCP</strong> — HTTP/1.1, hoặc HTTP/2 chọn bằng ALPN (bài 7.2).</li>
<li>Header câu trả lời <code>alt-svc: h3=":443"</code> nói “tôi cũng nói HTTP/3 trên UDP 443.”</li>
<li>Trình duyệt nhớ điều này và thử <strong>HTTP/3 ở kết nối kế</strong>. HTTP/3 là tự chọn, khám phá, và đảo ngược được — nếu QUIC bị chặn, trình duyệt lặng lẽ ở lại TCP (Chương 5, bài 5.3).</li>
</ul>
${net('waterfall', 'far', 'vi', 'Trên một đường xa, cú bắt tay 1-RTT và stream độc lập của HTTP/3 tiết kiệm nhiều nhất — đi qua các pha.', { tour: 'waterfall-phases' })}

<h3>Phía máy chủ là UDP thật</h3>
<p>Ta không chạy được một <em>client</em> HTTP/3 trong lab, nhưng <em>máy chủ</em> hoàn toàn thật. Cùng nginx nghe cả hai tầng vận chuyển:</p>
${run('c73-server', 'ss -ulnp', 1, { cut: 100 })}
${run('c73-server', 'ss -tlnp', 1, { cut: 100 })}
<p>Một socket nghe <strong>UDP</strong> (QUIC / HTTP-3) cạnh socket nghe <strong>TCP</strong> (HTTP-1.1 / HTTP-2) trên cùng cổng. Một máy chủ web có socket nghe UDP trên 443 là dấu vân tay không thể nhầm của HTTP/3 (bài 5.2). Các site thật cũng vậy — header <code>Alt-Svc</code> của họ quảng cáo nó, và 443/UDP của họ mở.</p>

<h3>Vì sao HTTP/3 thắng HTTP/2 (và khi nào không)</h3>
<table>
<tr><th></th><th>HTTP/2 trên TCP</th><th>HTTP/3 trên QUIC</th></tr>
<tr><td>Một gói mất</td><td>kẹt <strong>mọi</strong> stream (TCP đúng thứ tự)</td><td>chỉ kẹt <strong>stream của nó</strong></td></tr>
<tr><td>Cú bắt tay</td><td>TCP + TLS = 2 RTT</td><td>QUIC + TLS = <strong>1 RTT</strong>, 0-RTT khi nối lại</td></tr>
<tr><td>Đổi mạng</td><td>kết nối chết (bộ-bốn mới)</td><td><strong>chuyển</strong> (Connection ID)</td></tr>
</table>
<p>Điểm chính là dòng đầu: HTTP/2 bỏ nghẽn đầu hàng ở tầng HTTP, và HTTP/3 bỏ nó ở <strong>tầng TCP</strong> nữa, vì mỗi stream QUIC sắp thứ tự độc lập (bài 4.2, 5.2). Nhưng — như Chương 5 — các thắng lợi này hiện ra trên các đường <strong>hay mất gói và độ trễ cao</strong> (di động, máy chủ xa, Wi-Fi nghẽn). Trên một LAN sạch, độ trễ thấp, HTTP/2 và HTTP/3 thường không phân biệt được. Bật HTTP/3 (rẻ và an toàn nhờ đường lùi Alt-Svc), nhưng đo trên mạng người dùng của bạn thật sự có.</p>

<h3>QPACK: HPACK thiết kế lại cho stream sai thứ tự</h3>
<p>HPACK của HTTP/2 (bài 7.2) nén header với một bảng chung, và nó âm thầm giả định header tới <strong>đúng thứ tự</strong> — đúng với TCP. Trên QUIC, stream tới <em>độc lập</em>, nên một bảng header có thể kẹt chờ một cập nhật thiếu từ một stream khác sẽ tái lập đúng nghẽn đầu hàng mà QUIC sinh ra để tránh. Vì vậy HTTP/3 dùng <strong>QPACK</strong>: cùng ý tưởng nén, dựng lại để giải mã header của một stream không bao giờ phải chờ một stream khác. Bạn được khoản tiết kiệm của HPACK trên header lặp mà không trả lại thắng lợi HoL.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bật HTTP/3 là cấu hình + đường lùi, không phải viết lại.</strong> Code ứng dụng của bạn không đổi — ngữ nghĩa HTTP y nguyên. Bạn bật nó ở biên (nginx <code>listen 443 quic</code> + header <code>Alt-Svc</code>, hoặc một công tắc trên Cloudflare). Hai thứ cần xác minh: máy chủ có một <strong>socket nghe UDP 443</strong>, và client thật sự tới được nó (một mạng chặn UDP 443 chỉ tiếp tục dùng HTTP/2 — chậm hơn, không bao giờ hỏng, bài 5.3). Đừng bao giờ dựng một tính năng <em>đòi</em> HTTP/3; nó phải luôn xuống cấp về HTTP/2 trên TCP.</p>
</div>

<h3>Đọc HTTP/3: chủ yếu từ log</h3>
<p>Phía máy chủ ta có bằng chứng thật (một socket nghe UDP, một header <code>Alt-Svc</code>). Phía client, QUIC mã hoá gần như từ đầu tới cuối, và <code>curl</code> của lab này dựng không có HTTP/3, nên không có cách nào tạo một yêu cầu HTTP/3 ở đây. Bạn đọc giao thức bạn nhận từ hai <strong>đầu</strong>, không phải dây: bảng Network của trình duyệt hiện <code>h3</code> / <code>h2</code> / <code>http/1.1</code> mỗi yêu cầu, và <code>chrome://net-export</code> ghi các lần thử QUIC, lùi và chuyển. Gỡ lỗi HTTP/3 chuyển từ đọc gói sang đọc log.</p>
<p><span style="font-size:0.9em;color:#777">⏳ Chưa chạy thật trong lab: lấy một trang bằng <strong>client HTTP/3</strong> và đọc frame — ảnh <code>net-lab</code> dựng curl không kèm HTTP/3; không có client h3 khác. Phía máy chủ (UDP 8443 + Alt-Svc) ở trên là thật; mapping HTTP/3 đọc theo RFC 9114 và Chương 5.</span> <!-- CHAY-O-MAY: HTTP/3 client request — no h3 client in net-lab image --></p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trưởng nhóm hỏi “HTTP/3 của mình có thật sự chạy không, và làm sao một người dùng nhận được nó?” Trả lời bằng bằng chứng lab và Internet thật.</p>
<ol>
<li>Dựng vhost h2/h3. Trên <code>nfd-web</code>, chạy <code>ss -ulnp</code> và <code>ss -tlnp</code> và cho thấy máy chủ trên <strong>cả</strong> UDP và TCP 8443.</li>
<li>Tìm header <code>Alt-Svc: h3</code> trên câu trả lời HTTP/2 (<code>curl -sk --http2 -D - …</code>), và giải thích trình duyệt làm gì với nó.</li>
<li>Từ một trình duyệt thật, mở một site HTTP/3 (ví dụ cloudflare.com), mở dev tools → Network, và đọc cột <code>Protocol</code> (<code>h3</code>). Giải thích vì sao yêu cầu đầu là <code>h2</code>.</li>
<li>Viết hai câu: HTTP/3 đổi gì so với HTTP/2, và khi nào bạn <em>không</em> mong nhanh hơn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ được một socket nghe UDP + Alt-Svc làm bằng chứng phía máy chủ, mô tả cú nâng h2→h3, và nói được thắng lợi của HTTP/3 ở trên đường hay mất gói/di động, không phải một LAN nhanh.</p>
<details><summary>Lời giải</summary>
<p><code>ss -uln</code> cho thấy nginx trên UDP 8443, <code>ss -tln</code> trên TCP 8443; câu trả lời h2 mang <code>alt-svc: h3=":8443"</code>. Một trình duyệt dùng kết nối TCP/h2 hiện tại, nhớ quảng cáo h3, và thử QUIC lần sau — nên yêu cầu đầu luôn h2, các cái sau h3. Hai câu: “HTTP/3 chạy cùng HTTP trên QUIC, bỏ nghẽn đầu hàng tầng TCP và tiết kiệm một vòng bắt tay, và nó sống sót qua một lần đổi mạng nhờ chuyển kết nối. Đừng mong nhanh hơn trên một LAN dây nhanh — thắng lợi ở trên đường hay mất gói hoặc độ trễ cao, di động.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['HTTP/3', 'Ngữ nghĩa HTTP trên QUIC (RFC 9114): cùng method/trạng thái/stream, tầng vận chuyển mới.'],
  ['QUIC', 'Tầng vận chuyển dưới HTTP/3 (Chương 5): đáng tin, ghép kênh, mã hoá, trên UDP.'],
  ['Alt-Svc', 'Header câu trả lời quảng cáo h3 trên UDP 443; cách một trình duyệt khám phá HTTP/3.'],
  ['QPACK (nén header)', 'Nén header của HTTP/3, dựng lại để giải mã không bao giờ kẹt vì một stream khác.'],
  ['independent streams (luồng độc lập)', 'Mỗi stream QUIC sắp thứ tự riêng — không nghẽn đầu hàng tầng TCP.'],
  ['connection migration', 'Giữ kết nối sống qua một lần đổi IP nhờ Connection ID của QUIC.'],
  ['UDP listener', 'Một socket máy chủ trên UDP 443 — dấu hiệu không thể nhầm của HTTP/3.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>HTTP/3 là ngữ nghĩa HTTP trên QUIC (RFC 9114) — cùng method, trạng thái, stream; một tầng vận chuyển mới.</li>
<li>Một trình duyệt tới nó qua <code>Alt-Svc</code>: TCP trước, rồi HTTP/3 lần sau — tự chọn và đảo ngược được.</li>
<li>Nó bỏ nghẽn đầu hàng tầng TCP (mỗi stream QUIC sắp thứ tự riêng) và tiết kiệm một vòng bắt tay.</li>
<li>QPACK cho khoản tiết kiệm header của HPACK mà không tái lập kẹt trên stream sai thứ tự.</li>
<li>Bằng chứng máy chủ = một socket nghe UDP + <code>Alt-Svc</code>; đọc giao thức từ trình duyệt, không phải tcpdump; HTTP/3 phải luôn lùi về HTTP/2.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9114', '📄', 'RFC 9114 — HTTP/3', 'Mapping HTTP lên QUIC: stream, frame, và cú nâng Alt-Svc.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9204', '📄', 'RFC 9204 — QPACK', 'Nén header cho HTTP/3, an toàn trên stream QUIC sai thứ tự.', 'Mở')}
${L('https://blog.cloudflare.com/http3-the-past-present-and-future/', '📝', 'Cloudflare — HTTP/3: quá khứ, hiện tại và tương lai', 'Triển khai HTTP/3, cú nâng Alt-Svc, và kỳ vọng gì.', 'Mở')}
${L('https://http3-explained.haxx.se/', '📘', 'HTTP/3 explained (Daniel Stenberg)', 'Một cuốn sách miễn phí về QUIC và HTTP/3 từ tác giả của curl.', 'Mở')}
</div>
`,
};
