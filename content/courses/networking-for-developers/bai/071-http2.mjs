/**
 * Chương 7 · 7.2 — HTTP/2: ghép kênh, HPACK và vì sao server push bị bỏ (slug khung netdev-7-2-http2).
 * Output thật: lab/out/c72-*.out.txt (dựng lại: bash lab/code/dung-output-ch7.sh).
 */
import { run, card, kv, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-07-2.mjs';

const L = card;

export default {
  title: '7.2 — HTTP/2: multiplexing, HPACK and why server push died|||7.2 — HTTP/2: ghép kênh, HPACK và vì sao server push bị bỏ',
  slug: 'netdev-7-2-http2',
  type: 'LESSON',
  isFreePreview: true,
  description: 'HTTP/2 giữ ngữ nghĩa HTTP nhưng gửi dưới dạng frame nhị phân, chọn bằng ALPN trong cú bắt tay TLS (đọc live); ghép kênh nhiều yêu cầu trên MỘT kết nối, mỗi cái một stream (đọc stream id 1,3,5 bằng tshark giải mã); HPACK nén header lặp; server push chết (đẩy thừa qua cache, Chrome bỏ 2022 → 103 Early Hints); và một kết nối TCP vẫn để lại nghẽn đầu hàng tầng TCP mà HTTP/3 sửa.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>HTTP/2: multiplexing, HPACK and why server push died</h2>
<p class="lead">HTTP/2 (RFC 7540, 2015; updated by RFC 9113) set out to fix HTTP/1.1’s one-request-at-a-time serialisation without changing what HTTP <em>means</em>. A GET is still a GET, a 404 is still a 404 — but instead of one text message at a time, HTTP/2 sends <strong>binary frames</strong> that can be interleaved, so dozens of requests share a single connection. This lesson negotiates HTTP/2 live, reads the actual frames to see the multiplexing, explains the header compression that makes small requests cheap, and tells two cautionary stories: why server push was added and then removed, and why one stubborn limit survived all the way into HTTP/3.</p>

<h3>Same HTTP, chosen by ALPN</h3>
<p>You do not ask for HTTP/2 in the URL; it is negotiated during the TLS handshake with ALPN (lesson 6.2). Watch it happen:</p>
${cmd('docker exec nfd-web nginx -c /lab/k/code/ch07/h7.conf     # TLS + h2 + h3 on :8443', 'docker exec -it nfd-client bash')}
${run('c72-alpn', 'curl', 1)}
<ul>
<li><code>ALPN: curl offers h2,http/1.1</code> then <code>server accepted h2</code> — the protocol is chosen <em>inside</em> the TLS handshake, costing <strong>no extra round trip</strong>.</li>
<li><code>using HTTP/2</code>: from here, requests and responses are HTTP/2 frames, not text lines.</li>
<li>In practice HTTP/2 is used <strong>over TLS</strong> — browsers only speak it on HTTPS, and ALPN is how they pick it.</li>
</ul>
${net('waterfall', 'warm', 'en', 'Over one h2 connection, assets download in parallel instead of queuing six at a time — walk the phases.', { tour: 'waterfall-phases' })}

<h3>From text to binary frames</h3>
<p>HTTP/2 re-encodes the same semantics as binary frames on <strong>streams</strong>:</p>
<table>
<tr><th>HTTP/1.1</th><th>HTTP/2</th></tr>
<tr><td>one text message per request</td><td>each message split into binary <strong>frames</strong> (<code>HEADERS</code>, <code>DATA</code>)</td></tr>
<tr><td>one request at a time per connection</td><td>many requests <strong>interleaved</strong> on one connection</td></tr>
<tr><td>headers re-sent in full every time</td><td>headers compressed with <strong>HPACK</strong></td></tr>
<tr><td>~6 connections per origin</td><td><strong>one</strong> connection per origin</td></tr>
</table>
<p>A <strong>stream</strong> is an independent request/response flow with its own ID; many streams share one TCP connection, and their frames are interleaved. Because the frames are tagged with their stream, a slow or large response on one stream no longer blocks the others — at the HTTP layer.</p>

<h3>Multiplexing: read the stream IDs</h3>
<p>Fetch three URLs over one HTTP/2 connection and decrypt the capture with the session keys (lesson 6.2). The HEADERS frames show it:</p>
${run('c72-mux', 'tshark', 1)}
<p>Three <code>GET /</code> requests, <strong>one TCP connection</strong>, three <strong>streams</strong> — IDs <strong>1, 3, 5</strong> (client-initiated streams are always odd; the server uses even IDs). Each stream carries its own HEADERS and its own <code>200</code> response, interleaved on the same connection. This single change erases the 6-connection limit and makes sprites, bundling and domain sharding (lesson 7.1) unnecessary — and sometimes counterproductive, since one big bundle can no longer be cached or updated piecemeal.</p>

<h3>HPACK: stop re-sending the same headers</h3>
<p>Here is a cost HTTP/1.1 paid on every request: it re-sends the <strong>same headers in full</strong> — <code>User-Agent</code>, <code>Cookie</code>, <code>Accept</code>, a long <code>Authorization</code> token — which for a small API call can dwarf the request itself. HTTP/2 fixes this with <strong>HPACK</strong>: both ends keep a shared table of header names and values, so a header seen before is sent as a tiny <strong>index</strong> instead of the full string. For a chatty API making many small requests with a big auth header on each, HPACK turns kilobytes of repeated headers into bytes. (HTTP/3 uses a variant, <strong>QPACK</strong>, adapted for QUIC’s out-of-order streams.)</p>

<div class="pitfall co-tieu-de">
<p><strong>“We enabled HTTP/2, why is it not faster?”</strong> HTTP/2’s gains need two things: it must actually be negotiated (check the <code>Protocol</code> column / <code>curl -v</code> shows <code>h2</code>, not <code>http/1.1</code> — a missing ALPN or a non-TLS hop silently drops you to 1.1), and your old 1.1 optimisations may now hurt. Giant concatenated bundles defeat multiplexing and caching; domain sharding forces multiple connections where one would do. Over HTTP/2, prefer <em>more, smaller, cacheable</em> files and <em>one</em> origin.</p>
</div>

<h3>Why server push was added, and then died</h3>
<p>HTTP/2 introduced <strong>server push</strong>: the server could send a resource the client had not asked for yet — pushing <code>style.css</code> alongside the <code>index.html</code> that references it, to save a round trip. It sounded ideal and demoed beautifully. In reality it <strong>over-pushed</strong>: the server could not know what the browser already had cached, so it wasted bandwidth re-sending resources the client did not need. Browsers never adopted it well, and <strong>Chrome removed support in 2022</strong>; HTTP/3 does not carry it forward in the same way. The replacement is to <em>tell the browser what to fetch and let it decide</em>: a <code>103 Early Hints</code> response with <code>Link: rel=preload</code> headers, so the browser starts fetching critical assets early but still honours its cache. The lesson for protocol design: a feature that beats a naive client can still lose to a smart one.</p>

<h3>The limit HTTP/2 could not fix</h3>
<p>HTTP/2 removed head-of-line blocking <em>at the HTTP layer</em> — but it multiplexes everything over <strong>one TCP connection</strong>, and TCP delivers its single byte stream strictly in order (lesson 4.2). So if one packet is lost, TCP holds back <em>all</em> the data behind it — including frames for streams that have nothing to do with the loss. Stream 3 drops a packet, and streams 1 and 5, whose data already arrived, must wait for the retransmit. This is <strong>TCP-layer head-of-line blocking</strong>, and it is the one problem HTTP/2 could not solve, because it lives below HTTP. Removing it requires moving the transport itself — which is exactly what HTTP/3 does by running over QUIC, where each stream has independent ordering (lesson 7.3, Chapter 5).</p>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after “turning on HTTP/2”, a page is no faster. Verify it is actually negotiated, prove the multiplexing, and explain one old optimisation that is now hurting.</p>
<ol>
<li>Confirm negotiation: <code>curl -v --http2 https://labflow.test:8443/</code> and find <code>ALPN: server accepted h2</code> and <code>using HTTP/2</code>. Then try <code>--http1.1</code> and compare.</li>
<li>Prove multiplexing: capture three parallel requests with <code>SSLKEYLOGFILE</code> set, decrypt with <code>tshark -o tls.keylog_file:… -Y http2.type==1</code>, and point at stream IDs 1, 3, 5 on one connection.</li>
<li>Reason about HPACK: explain why a 1 KB <code>Authorization</code> header sent on 50 requests costs far less over HTTP/2 than HTTP/1.1.</li>
<li>Name one 1.1-era optimisation (bundling, sharding, sprites) that is counterproductive over HTTP/2 and why.</li>
</ol>
<p><strong>Done when:</strong> you have shown <code>h2</code> actually negotiated, three streams on one connection, and can explain HPACK’s saving and why domain sharding hurts over HTTP/2.</p>
<details><summary>Solution</summary>
<p><code>curl -v</code> shows <code>ALPN: server accepted h2</code> / <code>using HTTP/2</code>; forcing <code>--http1.1</code> downgrades. The decrypted capture shows HEADERS frames on streams 1, 3, 5 over one TCP connection. HPACK: the big <code>Authorization</code> header is sent in full once, then as a small index on each subsequent request, so 50 requests pay it ~once instead of 50 times. Domain sharding hurts because it forces several connections (each with its own TCP slow start and TLS handshake) where HTTP/2 wants a single multiplexed connection.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['ALPN', 'Negotiates the protocol (h2/http1.1) inside the TLS handshake — no extra round trip.'],
  ['frame (khung nhị phân)', 'The binary unit of HTTP/2 (HEADERS, DATA, SETTINGS…), tagged with a stream ID.'],
  ['stream (luồng)', 'An independent request/response flow with its own ID; many share one connection.'],
  ['multiplexing (ghép kênh)', 'Interleaving many streams over one connection — no 6-connection limit.'],
  ['HPACK (nén header)', 'HTTP/2 header compression via a shared table; repeated headers become small indices.'],
  ['server push', 'A removed feature: the server sending unrequested resources; over-pushed past caches.'],
  ['103 Early Hints', 'The replacement for push: tell the browser to preload, and let it decide.'],
  ['TCP head-of-line blocking', 'One lost packet stalls all streams on an HTTP/2 connection — fixed by HTTP/3.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>HTTP/2 keeps HTTP’s meaning but sends it as binary frames, chosen by ALPN in the TLS handshake.</li>
<li>Multiplexing puts many requests on one connection, each a stream (IDs 1, 3, 5…) — no 6-connection limit.</li>
<li>HPACK compresses repeated headers to tiny indices — a big win for many small requests with big headers.</li>
<li>Server push died (it over-pushed past caches; Chrome removed it in 2022) — use <code>103 Early Hints</code> instead.</li>
<li>One TCP connection means a lost packet still stalls all streams (TCP head-of-line blocking), fixed by HTTP/3.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9113', '📄', 'RFC 9113 — HTTP/2', 'Frames, streams, multiplexing and HPACK, as currently specified.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc7541', '📄', 'RFC 7541 — HPACK', 'How HTTP/2 compresses headers with a shared dynamic table.', 'Open')}
${L('https://developer.chrome.com/blog/removing-push/', '📝', 'Chrome — Removing HTTP/2 Server Push', 'Why server push was removed, with the data behind the decision.', 'Open')}
${L('https://hpbn.co/http2/', '📘', 'High Performance Browser Networking — HTTP/2', 'Multiplexing, HPACK and how to optimise for HTTP/2.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>HTTP/2: ghép kênh, HPACK và vì sao server push bị bỏ</h2>
<p class="lead">HTTP/2 (RFC 7540, 2015; cập nhật bởi RFC 9113) ra đời để sửa sự nối tiếp một-yêu-cầu-một-lúc của HTTP/1.1 mà không đổi HTTP <em>nghĩa là</em> gì. Một GET vẫn là một GET, một 404 vẫn là một 404 — nhưng thay vì một thông điệp văn bản một lúc, HTTP/2 gửi <strong>frame nhị phân</strong> xen nhau được, nên hàng chục yêu cầu dùng chung một kết nối. Bài này thương lượng HTTP/2 trực tiếp, đọc chính các frame để thấy ghép kênh, giải thích nén header làm yêu cầu nhỏ rẻ đi, và kể hai bài học cảnh giác: vì sao server push được thêm rồi bỏ, và vì sao một giới hạn cứng đầu sống sót suốt tới HTTP/3.</p>

<h3>Cùng HTTP, chọn bằng ALPN</h3>
<p>Bạn không xin HTTP/2 trong URL; nó được thương lượng trong cú bắt tay TLS bằng ALPN (bài 6.2). Xem nó diễn ra:</p>
${cmd('docker exec nfd-web nginx -c /lab/k/code/ch07/h7.conf     # TLS + h2 + h3 trên :8443', 'docker exec -it nfd-client bash')}
${run('c72-alpn', 'curl', 1)}
<ul>
<li><code>ALPN: curl offers h2,http/1.1</code> rồi <code>server accepted h2</code> — giao thức được chọn <em>bên trong</em> cú bắt tay TLS, tốn <strong>không thêm vòng khứ hồi</strong>.</li>
<li><code>using HTTP/2</code>: từ đây, yêu cầu và câu trả lời là frame HTTP/2, không phải dòng văn bản.</li>
<li>Thực tế HTTP/2 được dùng <strong>qua TLS</strong> — trình duyệt chỉ nói nó trên HTTPS, và ALPN là cách chúng chọn.</li>
</ul>
${net('waterfall', 'warm', 'vi', 'Trên một kết nối h2, tài nguyên tải song song thay vì xếp hàng sáu cái một lúc — đi qua các pha.', { tour: 'waterfall-phases' })}

<h3>Từ văn bản sang frame nhị phân</h3>
<p>HTTP/2 mã hoá lại cùng ngữ nghĩa thành frame nhị phân trên các <strong>stream (luồng)</strong>:</p>
<table>
<tr><th>HTTP/1.1</th><th>HTTP/2</th></tr>
<tr><td>một thông điệp văn bản mỗi yêu cầu</td><td>mỗi thông điệp chia thành <strong>frame</strong> nhị phân (<code>HEADERS</code>, <code>DATA</code>)</td></tr>
<tr><td>một yêu cầu một lúc mỗi kết nối</td><td>nhiều yêu cầu <strong>xen nhau</strong> trên một kết nối</td></tr>
<tr><td>header gửi lại đầy đủ mỗi lần</td><td>header nén bằng <strong>HPACK</strong></td></tr>
<tr><td>~6 kết nối mỗi origin</td><td><strong>một</strong> kết nối mỗi origin</td></tr>
</table>
<p>Một <strong>stream</strong> là một luồng yêu cầu/đáp độc lập với id riêng; nhiều stream dùng chung một kết nối TCP, và các frame của chúng xen nhau. Vì các frame được gắn nhãn stream của nó, một câu trả lời chậm hay lớn trên một stream không còn chặn các cái khác — ở tầng HTTP.</p>

<h3>Ghép kênh: đọc các stream id</h3>
<p>Lấy ba URL trên một kết nối HTTP/2 và giải mã bản bắt gói bằng khoá phiên (bài 6.2). Các frame HEADERS cho thấy:</p>
${run('c72-mux', 'tshark', 1)}
<p>Ba yêu cầu <code>GET /</code>, <strong>một kết nối TCP</strong>, ba <strong>stream</strong> — id <strong>1, 3, 5</strong> (stream do client khởi tạo luôn lẻ; máy chủ dùng id chẵn). Mỗi stream mang HEADERS riêng và câu trả lời <code>200</code> riêng, xen nhau trên cùng kết nối. Thay đổi duy nhất này xoá giới hạn 6 kết nối và làm sprite, bundling và domain sharding (bài 7.1) thành thừa — và đôi khi phản tác dụng, vì một bundle lớn không còn cache hay cập nhật từng phần được.</p>

<h3>HPACK: thôi gửi lại cùng các header</h3>
<p>Đây là một chi phí HTTP/1.1 trả mỗi yêu cầu: nó gửi lại <strong>cùng các header đầy đủ</strong> — <code>User-Agent</code>, <code>Cookie</code>, <code>Accept</code>, một token <code>Authorization</code> dài — mà với một lời gọi API nhỏ có thể át chính yêu cầu. HTTP/2 sửa bằng <strong>HPACK</strong>: cả hai đầu giữ một bảng chung tên và giá trị header, nên một header đã thấy được gửi dưới dạng một <strong>chỉ số</strong> tí hon thay vì cả chuỗi. Với một API lắm lời tạo nhiều yêu cầu nhỏ với một header auth lớn trên mỗi cái, HPACK biến kilobyte header lặp thành byte. (HTTP/3 dùng một biến thể, <strong>QPACK</strong>, chỉnh cho các stream sai thứ tự của QUIC.)</p>

<div class="pitfall co-tieu-de">
<p><strong>“Mình bật HTTP/2 rồi, sao chưa nhanh hơn?”</strong> Thắng lợi của HTTP/2 cần hai thứ: nó phải thật sự được thương lượng (kiểm cột <code>Protocol</code> / <code>curl -v</code> hiện <code>h2</code>, không phải <code>http/1.1</code> — thiếu ALPN hay một chặng không-TLS âm thầm hạ bạn về 1.1), và các tối ưu 1.1 cũ của bạn giờ có thể hại. Các bundle gộp khổng lồ phá ghép kênh và cache; domain sharding ép nhiều kết nối nơi một cái là đủ. Qua HTTP/2, ưu tiên <em>nhiều, nhỏ, cache được</em> và <em>một</em> origin.</p>
</div>

<h3>Vì sao server push được thêm, rồi chết</h3>
<p>HTTP/2 giới thiệu <strong>server push</strong>: máy chủ có thể gửi một tài nguyên client chưa hỏng — đẩy <code>style.css</code> cùng <code>index.html</code> tham chiếu nó, để tiết kiệm một vòng khứ hồi. Nghe lý tưởng và demo đẹp. Thực tế nó <strong>đẩy thừa</strong>: máy chủ không biết trình duyệt đã cache gì, nên phí băng thông gửi lại tài nguyên client không cần. Trình duyệt không bao giờ dùng nó tốt, và <strong>Chrome bỏ hỗ trợ năm 2022</strong>; HTTP/3 không mang nó theo như cũ. Thứ thay thế là <em>bảo trình duyệt lấy gì và để nó quyết</em>: một câu trả lời <code>103 Early Hints</code> với các header <code>Link: rel=preload</code>, để trình duyệt bắt đầu lấy tài nguyên quan trọng sớm nhưng vẫn tôn trọng cache. Bài học cho thiết kế giao thức: một tính năng thắng một client ngây thơ vẫn có thể thua một client thông minh.</p>

<h3>Giới hạn HTTP/2 không sửa được</h3>
<p>HTTP/2 bỏ nghẽn đầu hàng <em>ở tầng HTTP</em> — nhưng nó ghép mọi thứ trên <strong>một kết nối TCP</strong>, và TCP giao luồng byte duy nhất của nó đúng thứ tự tuyệt đối (bài 4.2). Nên nếu một gói mất, TCP giữ lại <em>tất cả</em> dữ liệu phía sau — kể cả frame cho các stream chẳng liên quan gì tới cú mất. Stream 3 mất một gói, và stream 1 và 5, dữ liệu đã tới, phải chờ truyền lại. Đây là <strong>nghẽn đầu hàng tầng TCP</strong>, và là vấn đề duy nhất HTTP/2 không giải được, vì nó nằm dưới HTTP. Bỏ nó cần dời chính tầng vận chuyển — đúng là cái HTTP/3 làm bằng cách chạy trên QUIC, nơi mỗi stream có thứ tự độc lập (bài 7.3, Chương 5).</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau khi “bật HTTP/2”, một trang không nhanh hơn. Xác minh nó thật sự được thương lượng, chứng minh ghép kênh, và giải thích một tối ưu cũ giờ đang hại.</p>
<ol>
<li>Xác nhận thương lượng: <code>curl -v --http2 https://labflow.test:8443/</code> và tìm <code>ALPN: server accepted h2</code> và <code>using HTTP/2</code>. Rồi thử <code>--http1.1</code> và so.</li>
<li>Chứng minh ghép kênh: bắt ba yêu cầu song song với <code>SSLKEYLOGFILE</code> đặt, giải mã bằng <code>tshark -o tls.keylog_file:… -Y http2.type==1</code>, và chỉ vào stream id 1, 3, 5 trên một kết nối.</li>
<li>Lập luận về HPACK: giải thích vì sao một header <code>Authorization</code> 1 KB gửi trên 50 yêu cầu tốn ít hơn nhiều qua HTTP/2 so với HTTP/1.1.</li>
<li>Gọi tên một tối ưu thời 1.1 (bundling, sharding, sprite) phản tác dụng qua HTTP/2 và vì sao.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã cho thấy <code>h2</code> thật sự được thương lượng, ba stream trên một kết nối, và giải thích được khoản tiết kiệm của HPACK cùng vì sao domain sharding hại qua HTTP/2.</p>
<details><summary>Lời giải</summary>
<p><code>curl -v</code> hiện <code>ALPN: server accepted h2</code> / <code>using HTTP/2</code>; ép <code>--http1.1</code> thì hạ cấp. Bản bắt gói giải mã cho thấy frame HEADERS trên stream 1, 3, 5 trên một kết nối TCP. HPACK: header <code>Authorization</code> lớn được gửi đầy đủ một lần, rồi là một chỉ số nhỏ trên mỗi yêu cầu sau, nên 50 yêu cầu trả nó ~một lần thay vì 50 lần. Domain sharding hại vì nó ép nhiều kết nối (mỗi cái có slow start TCP và bắt tay TLS riêng) nơi HTTP/2 muốn một kết nối ghép kênh duy nhất.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['ALPN', 'Thương lượng giao thức (h2/http1.1) bên trong cú bắt tay TLS — không thêm vòng.'],
  ['frame (khung nhị phân)', 'Đơn vị nhị phân của HTTP/2 (HEADERS, DATA, SETTINGS…), gắn nhãn một stream id.'],
  ['stream (luồng)', 'Một luồng yêu cầu/đáp độc lập với id riêng; nhiều cái dùng chung một kết nối.'],
  ['multiplexing (ghép kênh)', 'Xen nhiều stream trên một kết nối — không giới hạn 6 kết nối.'],
  ['HPACK (nén header)', 'Nén header HTTP/2 qua một bảng chung; header lặp thành chỉ số nhỏ.'],
  ['server push', 'Một tính năng đã bỏ: máy chủ gửi tài nguyên không được hỏng; đẩy thừa qua cache.'],
  ['103 Early Hints', 'Thứ thay thế push: bảo trình duyệt preload, và để nó quyết.'],
  ['TCP head-of-line blocking', 'Một gói mất kẹt mọi stream trên một kết nối HTTP/2 — HTTP/3 sửa.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>HTTP/2 giữ nghĩa của HTTP nhưng gửi dưới dạng frame nhị phân, chọn bằng ALPN trong cú bắt tay TLS.</li>
<li>Ghép kênh đặt nhiều yêu cầu trên một kết nối, mỗi cái một stream (id 1, 3, 5…) — không giới hạn 6 kết nối.</li>
<li>HPACK nén header lặp thành chỉ số tí hon — một thắng lợi lớn cho nhiều yêu cầu nhỏ với header lớn.</li>
<li>Server push chết (đẩy thừa qua cache; Chrome bỏ 2022) — dùng <code>103 Early Hints</code> thay vào.</li>
<li>Một kết nối TCP nghĩa là một gói mất vẫn kẹt mọi stream (nghẽn đầu hàng tầng TCP), HTTP/3 sửa.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc9113', '📄', 'RFC 9113 — HTTP/2', 'Frame, stream, ghép kênh và HPACK, theo đặc tả hiện hành.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc7541', '📄', 'RFC 7541 — HPACK', 'Cách HTTP/2 nén header bằng một bảng động chung.', 'Mở')}
${L('https://developer.chrome.com/blog/removing-push/', '📝', 'Chrome — Bỏ HTTP/2 Server Push', 'Vì sao server push bị bỏ, kèm số liệu sau quyết định.', 'Mở')}
${L('https://hpbn.co/http2/', '📘', 'High Performance Browser Networking — HTTP/2', 'Ghép kênh, HPACK và cách tối ưu cho HTTP/2.', 'Mở')}
</div>
`,
};
