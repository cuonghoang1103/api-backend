/**
 * Chương 6 · 6.2 — Bắt tay TLS 1.3, từng bước (slug khung netdev-6-2-bat-tay-tls).
 * Output thật: lab/out/c62-*.out.txt (dựng lại: bash lab/code/dung-output-ch6.sh).
 */
import { run, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-06-2.mjs';

const L = card;
const NGINX = { mon: 'Nginx', khoa: 'nginx' };

export default {
  title: '6.2 — The TLS 1.3 handshake, byte by byte|||6.2 — Bắt tay TLS 1.3, từng bước',
  slug: 'netdev-6-2-bat-tay-tls',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cú bắt tay TLS 1.3 trong một vòng khứ hồi đọc từ openssl s_client (ClientHello/key share, ServerHello + chứng chỉ mã hoá, Finished); SNI và ALPN quyết trong gói đầu; nối lại phiên (New → Reused) và 0-RTT; giải mã TLS của chính bạn bằng SSLKEYLOGFILE + tshark để thấy GET/200 bên trong; vì sao chi phí bắt tay là lý do tái dùng kết nối.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The TLS 1.3 handshake, byte by byte</h2>
<p class="lead">A TLS connection starts with a handshake: a short negotiation that agrees on keys, proves the server’s identity, and picks the application protocol — all before a single byte of your request is sent. In TLS 1.3 this takes exactly one round trip, and most of it is designed so that even the certificate is encrypted. This lesson reads the handshake from <code>openssl</code>, shows what the first packet already decides (which site, which protocol), measures how a second connection reuses the work, and — the fun part — decrypts your own TLS traffic with a key log so you can see the HTTP hiding inside.</p>

<h3>One round trip to a secure channel</h3>
<p>TLS 1.3’s handshake is deliberately short. The client’s very first message, the <strong>ClientHello</strong>, already contains a <em>key share</em> (its half of the Diffie–Hellman exchange), the <strong>SNI</strong> (which site) and <strong>ALPN</strong> (which protocols it speaks). The server replies with its own key share in the <strong>ServerHello</strong>, and from that moment both sides can derive keys — so the server’s certificate and <code>Finished</code> are already <strong>encrypted</strong>. One round trip, and data flows. (TLS 1.2 needed two; removing that round trip is a headline feature of 1.3.) Read a real handshake:</p>
${cmd('docker exec nfd-web nginx -c /tmp/s.conf                 # HTTPS on :8443 (from lesson 6.1 setup)', 'docker exec -it nfd-client bash')}
${run('c62-hand', 'echo | openssl', 1)}
<ul>
<li><code>Server certificate</code> with <code>subject</code>/<code>issuer</code>: who the server claims to be, and who vouches for it (lesson 6.3).</li>
<li><code>New, TLSv1.3, Cipher is …</code>: the negotiated version and the encryption/integrity algorithm.</li>
<li><code>ALPN protocol: h2</code>: both sides agreed to speak HTTP/2 inside the tunnel, chosen <em>during</em> the handshake.</li>
<li><code>Verify return code: 0 (ok)</code>: the certificate chain validated against a trusted root.</li>
</ul>
${net('waterfall', 'warm', 'en', 'A warm, resumed connection skips the full handshake — compare its TLS phase to a cold one.', { tour: 'waterfall-phases' })}

<h3>SNI and ALPN: decided in the first packet</h3>
<p>Two decisions are made before any encryption even begins, in the cleartext ClientHello:</p>
${run('c62-sni', 'tshark', 1)}
<ul>
<li><strong>SNI</strong> (Server Name Indication) tells a server that hosts many sites on one IP <em>which</em> site you want — it must be in cleartext because the server needs it to pick the right certificate. This is how one HTTPS server serves <code>a.com</code> and <code>b.com</code> (virtual hosting), and also why the domain is visible to the network (lesson 6.1).</li>
<li><strong>ALPN</strong> (Application-Layer Protocol Negotiation) lets the client offer <code>h2, http/1.1</code> and the server pick one — inside the TLS handshake, so no extra round trip is needed to choose HTTP/2 vs HTTP/1.1 (Chapter 7).</li>
<li>The <strong>key share</strong> in the ClientHello is what makes 1.3 a 1-RTT handshake: the client guesses the group and sends its public key up front.</li>
</ul>

<h3>Decrypt your own TLS with a key log</h3>
<p>You cannot read TLS on the wire — but you can read <em>your own</em> TLS, because you have the keys. <code>curl</code> (and Chrome, and Firefox) will write the per-session keys to a file named in <code>SSLKEYLOGFILE</code>; give that file to Wireshark/tshark and the encrypted “Application Data” becomes readable HTTP:</p>
${run('c62-decrypt', 'tshark', 1)}
${run('c62-decrypt', 'tshark', 1, { lan: 2 })}
<p>Without the keys, all you see is the length of each encrypted record. With them, the same bytes decode to <code>GET /</code> and <code>200 OK</code>. This is the standard way to debug HTTPS and HTTP/2 problems — a broken header, a missing response — <strong>without disabling encryption</strong>. You decrypt only traffic whose keys you legitimately have.</p>

<div class="pitfall co-tieu-de">
<p><strong>“I’ll just capture the traffic to debug the API” does not work over HTTPS — unless you use the key log.</strong> A plain <code>tcpdump</code> of an HTTPS call shows only encrypted blobs. Reaching for <code>-k</code>/“disable TLS verification” or a man-in-the-middle proxy changes what you are testing and can mask the real bug. The correct tool is <code>SSLKEYLOGFILE</code> (for curl/browsers) or your language’s TLS keylog callback, fed to Wireshark — you see the real, encrypted connection, decrypted locally.</p>
</div>

<h3>Faster the second time: session resumption</h3>
<p>The handshake is not free, so TLS lets a client resume a previous session. The first connection does a full handshake; the server hands out a <strong>session ticket</strong>; the next connection presents it and skips most of the work:</p>
${run('c62-resume', 'echo "== lần 1', 1, { max: 8 })}
<p>The first is <code>New</code> (full handshake), the second is <code>Reused</code>. With a resumed session, TLS 1.3 can even send application data in the <em>first</em> packet — <strong>0-RTT</strong> — saving the whole round trip. The catch: 0-RTT data can be <strong>replayed</strong> by an attacker, so it is only safe for <strong>idempotent</strong> requests (a GET, never a “transfer money”). Most servers restrict what 0-RTT may carry for exactly this reason.</p>

<h3>Why the handshake cost is the whole game</h3>
<p>Line up the costs of a fresh HTTPS connection: a TCP handshake (1 RTT, Chapter 4), then a TLS 1.3 handshake (1 RTT), <em>before</em> the first byte of your request. On a 150 ms link that is roughly <strong>300 ms</strong> of pure setup, paid again for every new connection. The remedies are exactly the ones from lesson 4.5, one layer up:</p>
<ul>
<li><strong>Keep-alive and connection pools</strong> reuse the entire connection — TCP <em>and</em> TLS — so later requests pay neither handshake.</li>
<li><strong>Session resumption</strong> makes even a genuinely new TLS connection cheaper.</li>
<li><strong>HTTP/2 and HTTP/3</strong> multiplex many requests over one connection, amortising the one handshake (Chapter 7).</li>
</ul>
<p>The cheapest handshake is the one you do not do — and over HTTPS that is doubly true, because you are skipping two handshakes, not one.</p>
${cauNoi('en', { ...NGINX, bai: 'nginx-6-3-gia-cua-bat-tay', so: '6.3', ten: 'What the handshake costs, and why connection reuse is the whole game', giong: 'the TLS handshake costs a round trip, so reusing connections and resuming sessions matter', khac: 'the nginx course tunes ssl_session_cache, keepalive and OCSP stapling in nginx config', them: 'the TLS 1.3 handshake read from openssl, SNI/ALPN in the first packet, New→Reused measured, and decrypting your own TLS with SSLKEYLOGFILE' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an API call over HTTPS returns a wrong header and you cannot see why — the traffic is encrypted. Use the key log to read the real exchange, and measure the handshake cost.</p>
<ol>
<li>Start the lab HTTPS server. From <code>nfd-client</code>, capture one request: <code>SSLKEYLOGFILE=/tmp/keys.log curl -k --resolve labflow.test:8443:10.10.2.10 https://labflow.test:8443/</code> while <code>tcpdump</code> runs.</li>
<li>Read it two ways: <code>tshark -Y tls.app_data</code> (encrypted) and <code>tshark -o tls.keylog_file:/tmp/keys.log -Y 'http.request || http.response'</code> (decrypted). Confirm you can see the request and response.</li>
<li>Measure resumption: <code>openssl s_client … -reconnect</code> or save a session with <code>-sess_out</code>/<code>-sess_in</code> and look for <code>New</code> vs <code>Reused</code>.</li>
<li>Write how you would debug a real HTTPS header bug with this, and one sentence on why keep-alive matters over HTTPS.</li>
</ol>
<p><strong>Done when:</strong> you have shown the same bytes as encrypted blobs and as decrypted HTTP, seen <code>Reused</code> on a resumed connection, and can state that each new HTTPS connection costs a TCP + a TLS handshake, which keep-alive avoids.</p>
<details><summary>Solution</summary>
<p>Without the key log, tshark shows <code>Application Data</code> records and their lengths. With <code>tls.keylog_file</code> set, the same capture decodes to <code>GET /</code> and <code>200 OK</code> — you can read every header. <code>openssl -sess_in</code> shows <code>Reused</code> on the second connection. “To debug a header bug, capture with <code>SSLKEYLOGFILE</code> set and read the decrypted request/response in Wireshark — no need to disable TLS. Keep-alive matters over HTTPS because each new connection pays a TCP <em>and</em> a TLS handshake (~2 RTTs) before any data.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['ClientHello (chào từ client)', 'The first TLS message: key share, SNI, ALPN, supported versions/ciphers.'],
  ['SNI — Server Name Indication', 'The hostname in the ClientHello, cleartext, so a shared server picks the right certificate.'],
  ['ALPN', 'Negotiating h2 / http/1.1 during the TLS handshake, saving a round trip.'],
  ['key share (phần khoá)', 'The client’s public key in the ClientHello — what makes TLS 1.3 a 1-RTT handshake.'],
  ['session ticket (vé phiên)', 'An encrypted blob from the server that lets the client resume without a full handshake.'],
  ['0-RTT (không vòng khứ hồi)', 'Sending data in the first packet of a resumed session; only safe for idempotent requests.'],
  ['SSLKEYLOGFILE', 'An env var; curl/browsers write session keys there so you can decrypt your own TLS.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>TLS 1.3 reaches a secure channel in one round trip; the client’s key share is in the first packet.</li>
<li>SNI (which site) and ALPN (which protocol) are decided in the cleartext ClientHello; the certificate is already encrypted.</li>
<li>Session resumption turns <code>New</code> into <code>Reused</code> via a ticket; 1.3 can do 0-RTT for idempotent requests.</li>
<li><code>SSLKEYLOGFILE</code> + Wireshark decrypts your own HTTPS — debug without disabling encryption.</li>
<li>A new HTTPS connection costs a TCP + a TLS handshake; reuse connections (lesson 4.5) and resume sessions.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc8446#section-2', '📄', 'RFC 8446 §2 — TLS 1.3 Handshake Protocol', 'The 1-RTT handshake, 0-RTT, and what each message carries.', 'Open')}
${L('https://developer.mozilla.org/docs/Glossary/TLS', '📘', 'MDN — ALPN and SNI', 'How the protocol and the hostname are negotiated in the handshake.', 'Open')}
${L('https://wiki.wireshark.org/TLS', '📘', 'Wireshark — decrypting TLS with a key log', 'Using SSLKEYLOGFILE to read your own HTTPS traffic.', 'Open')}
${L('https://blog.cloudflare.com/introducing-0-rtt/', '📝', 'Cloudflare — 0-RTT and the replay caveat', 'Why 0-RTT is fast, and why it is limited to idempotent requests.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Bắt tay TLS 1.3, từng bước</h2>
<p class="lead">Một kết nối TLS bắt đầu bằng một cú bắt tay: một cuộc thương lượng ngắn thống nhất khoá, chứng minh danh tính máy chủ, và chọn giao thức ứng dụng — tất cả trước khi một byte nào của yêu cầu được gửi. Trong TLS 1.3 việc này tốn đúng một vòng khứ hồi, và phần lớn được thiết kế để ngay cả chứng chỉ cũng mã hoá. Bài này đọc cú bắt tay từ <code>openssl</code>, chỉ ra gói đầu đã quyết gì (site nào, giao thức nào), đo cách một kết nối thứ hai dùng lại công việc, và — phần vui — giải mã lưu lượng TLS của chính bạn bằng một bản ghi khoá để bạn thấy HTTP ẩn bên trong.</p>

<h3>Một vòng khứ hồi tới một kênh an toàn</h3>
<p>Cú bắt tay của TLS 1.3 cố ý ngắn. Thông điệp đầu tiên của client, <strong>ClientHello</strong>, đã chứa một <em>phần khoá</em> (nửa của nó trong trao đổi Diffie–Hellman), <strong>SNI</strong> (site nào) và <strong>ALPN</strong> (nó nói giao thức nào). Máy chủ trả phần khoá của nó trong <strong>ServerHello</strong>, và từ lúc đó cả hai bên dẫn ra được khoá — nên chứng chỉ và <code>Finished</code> của máy chủ đã <strong>mã hoá</strong>. Một vòng khứ hồi, và dữ liệu chảy. (TLS 1.2 cần hai; bỏ vòng đó là tính năng nổi bật của 1.3.) Đọc một cú bắt tay thật:</p>
${cmd('docker exec nfd-web nginx -c /tmp/s.conf                 # HTTPS trên :8443 (từ phần dựng bài 6.1)', 'docker exec -it nfd-client bash')}
${run('c62-hand', 'echo | openssl', 1)}
<ul>
<li><code>Server certificate</code> với <code>subject</code>/<code>issuer</code>: máy chủ tự nhận là ai, và ai bảo lãnh (bài 6.3).</li>
<li><code>New, TLSv1.3, Cipher is …</code>: phiên bản và thuật toán mã hoá/toàn vẹn đã thoả thuận.</li>
<li><code>ALPN protocol: h2</code>: cả hai bên đồng ý nói HTTP/2 bên trong đường hầm, chọn <em>trong</em> cú bắt tay.</li>
<li><code>Verify return code: 0 (ok)</code>: chuỗi chứng chỉ đã kiểm hợp lệ với một gốc tin cậy.</li>
</ul>
${net('waterfall', 'warm', 'vi', 'Một kết nối ấm, nối lại bỏ qua cú bắt tay đầy đủ — so pha TLS của nó với một cái lạnh.', { tour: 'waterfall-phases' })}

<h3>SNI và ALPN: quyết trong gói đầu</h3>
<p>Hai quyết định được đưa ra trước khi mã hoá bắt đầu, trong ClientHello dạng chữ:</p>
${run('c62-sni', 'tshark', 1)}
<ul>
<li><strong>SNI</strong> (Server Name Indication) cho một máy chủ chứa nhiều site trên một IP biết bạn muốn <em>site nào</em> — nó phải là chữ vì máy chủ cần nó để chọn đúng chứng chỉ. Đây là cách một máy chủ HTTPS phục vụ <code>a.com</code> và <code>b.com</code> (virtual hosting), và cũng vì sao tên miền lộ với mạng (bài 6.1).</li>
<li><strong>ALPN</strong> (Application-Layer Protocol Negotiation) cho client đưa ra <code>h2, http/1.1</code> và máy chủ chọn một — bên trong cú bắt tay TLS, nên không cần thêm vòng để chọn HTTP/2 hay HTTP/1.1 (Chương 7).</li>
<li><strong>Phần khoá</strong> trong ClientHello là thứ làm 1.3 thành cú bắt tay 1-RTT: client đoán nhóm và gửi khoá công khai của nó ngay.</li>
</ul>

<h3>Giải mã TLS của chính bạn bằng một bản ghi khoá</h3>
<p>Bạn không đọc được TLS trên dây — nhưng bạn đọc được TLS <em>của chính mình</em>, vì bạn có khoá. <code>curl</code> (và Chrome, Firefox) sẽ ghi các khoá theo phiên ra một tệp đặt tên trong <code>SSLKEYLOGFILE</code>; đưa tệp đó cho Wireshark/tshark và “Application Data” mã hoá trở thành HTTP đọc được:</p>
${run('c62-decrypt', 'tshark', 1)}
${run('c62-decrypt', 'tshark', 1, { lan: 2 })}
<p>Không có khoá, tất cả bạn thấy là độ dài mỗi bản ghi mã hoá. Có chúng, cùng các byte đó giải thành <code>GET /</code> và <code>200 OK</code>. Đây là cách chuẩn để gỡ lỗi HTTPS và HTTP/2 — một header hỏng, một câu trả lời thiếu — <strong>mà không tắt mã hoá</strong>. Bạn chỉ giải mã lưu lượng mà bạn có khoá một cách chính đáng.</p>

<div class="pitfall co-tieu-de">
<p><strong>“Mình cứ bắt gói để gỡ lỗi API” không hoạt động qua HTTPS — trừ khi dùng bản ghi khoá.</strong> Một <code>tcpdump</code> thường của một lời gọi HTTPS chỉ cho thấy các khối mã hoá. Với lấy <code>-k</code>/“tắt kiểm TLS” hay một proxy đứng giữa làm đổi thứ bạn đang thử và có thể che lỗi thật. Công cụ đúng là <code>SSLKEYLOGFILE</code> (cho curl/trình duyệt) hay móc keylog TLS của ngôn ngữ bạn, đưa vào Wireshark — bạn thấy kết nối thật, mã hoá, giải mã cục bộ.</p>
</div>

<h3>Nhanh hơn lần hai: nối lại phiên</h3>
<p>Cú bắt tay không miễn phí, nên TLS cho một client nối lại một phiên trước. Kết nối đầu làm một cú bắt tay đầy đủ; máy chủ phát một <strong>vé phiên (session ticket)</strong>; kết nối sau trình nó và bỏ qua phần lớn công việc:</p>
${run('c62-resume', 'echo "== lần 1', 1, { max: 8 })}
<p>Cái đầu là <code>New</code> (bắt tay đầy đủ), cái thứ hai là <code>Reused</code>. Với một phiên nối lại, TLS 1.3 còn có thể gửi dữ liệu ứng dụng trong gói <em>đầu tiên</em> — <strong>0-RTT</strong> — tiết kiệm trọn vòng khứ hồi. Cái bẫy: dữ liệu 0-RTT có thể bị kẻ tấn công <strong>phát lại</strong>, nên chỉ an toàn cho yêu cầu <strong>bất biến (idempotent)</strong> (một GET, không bao giờ “chuyển tiền”). Phần lớn máy chủ hạn chế 0-RTT mang gì đúng vì lý do này.</p>

<h3>Vì sao chi phí bắt tay là tất cả</h3>
<p>Xếp các chi phí của một kết nối HTTPS mới: một cú bắt tay TCP (1 RTT, Chương 4), rồi một cú bắt tay TLS 1.3 (1 RTT), <em>trước</em> byte đầu của yêu cầu. Trên một đường 150 ms đó là khoảng <strong>300 ms</strong> thiết lập thuần, trả lại mỗi kết nối mới. Thuốc chữa đúng là những cái từ bài 4.5, ở một tầng trên:</p>
<ul>
<li><strong>Keep-alive và pool kết nối</strong> dùng lại trọn kết nối — TCP <em>và</em> TLS — nên yêu cầu sau không trả cú bắt tay nào.</li>
<li><strong>Nối lại phiên</strong> làm ngay cả một kết nối TLS thật sự mới rẻ hơn.</li>
<li><strong>HTTP/2 và HTTP/3</strong> ghép nhiều yêu cầu trên một kết nối, chia đều một cú bắt tay (Chương 7).</li>
</ul>
<p>Cú bắt tay rẻ nhất là cú bạn không làm — và qua HTTPS điều đó đúng gấp đôi, vì bạn bỏ được hai cú bắt tay, không phải một.</p>
${cauNoi('vi', { ...NGINX, bai: 'nginx-6-3-gia-cua-bat-tay', so: '6.3', ten: 'Cái bắt tay tốn gì, và vì sao tái dùng kết nối mới là tất cả', giong: 'cú bắt tay TLS tốn một vòng khứ hồi, nên dùng lại kết nối và nối lại phiên quan trọng', khac: 'khoá nginx chỉnh ssl_session_cache, keepalive và OCSP stapling trong cấu hình nginx', them: 'cú bắt tay TLS 1.3 đọc từ openssl, SNI/ALPN trong gói đầu, New→Reused đo được, và giải mã TLS của chính bạn bằng SSLKEYLOGFILE' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một lời gọi API qua HTTPS trả về một header sai và bạn không thấy vì sao — lưu lượng mã hoá. Dùng bản ghi khoá để đọc trao đổi thật, và đo chi phí bắt tay.</p>
<ol>
<li>Dựng máy chủ HTTPS của lab. Từ <code>nfd-client</code>, bắt một yêu cầu: <code>SSLKEYLOGFILE=/tmp/keys.log curl -k --resolve labflow.test:8443:10.10.2.10 https://labflow.test:8443/</code> trong lúc <code>tcpdump</code> chạy.</li>
<li>Đọc hai cách: <code>tshark -Y tls.app_data</code> (mã hoá) và <code>tshark -o tls.keylog_file:/tmp/keys.log -Y 'http.request || http.response'</code> (đã giải mã). Xác nhận bạn thấy yêu cầu và câu trả lời.</li>
<li>Đo nối lại: <code>openssl s_client … -reconnect</code> hoặc lưu một phiên bằng <code>-sess_out</code>/<code>-sess_in</code> và tìm <code>New</code> so với <code>Reused</code>.</li>
<li>Viết cách bạn sẽ gỡ một lỗi header HTTPS thật với cái này, và một câu về vì sao keep-alive quan trọng qua HTTPS.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã cho thấy cùng các byte dưới dạng khối mã hoá và dưới dạng HTTP giải mã, thấy <code>Reused</code> trên một kết nối nối lại, và nói được mỗi kết nối HTTPS mới tốn một cú bắt tay TCP + một cú bắt tay TLS, mà keep-alive tránh được.</p>
<details><summary>Lời giải</summary>
<p>Không có bản ghi khoá, tshark cho thấy các bản ghi <code>Application Data</code> và độ dài. Với <code>tls.keylog_file</code> đặt, cùng bản bắt gói giải thành <code>GET /</code> và <code>200 OK</code> — bạn đọc được mọi header. <code>openssl -sess_in</code> cho thấy <code>Reused</code> ở kết nối thứ hai. “Để gỡ một lỗi header, bắt gói với <code>SSLKEYLOGFILE</code> đặt và đọc yêu cầu/câu trả lời đã giải mã trong Wireshark — không cần tắt TLS. Keep-alive quan trọng qua HTTPS vì mỗi kết nối mới trả một cú bắt tay TCP <em>và</em> một cú bắt tay TLS (~2 RTT) trước mọi dữ liệu.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['ClientHello (chào từ client)', 'Thông điệp TLS đầu: phần khoá, SNI, ALPN, phiên bản/bộ mã hỗ trợ.'],
  ['SNI — Server Name Indication', 'Tên máy chủ trong ClientHello, dạng chữ, để một máy chủ dùng chung chọn đúng chứng chỉ.'],
  ['ALPN', 'Thương lượng h2 / http/1.1 trong cú bắt tay TLS, tiết kiệm một vòng khứ hồi.'],
  ['key share (phần khoá)', 'Khoá công khai của client trong ClientHello — thứ làm TLS 1.3 là cú bắt tay 1-RTT.'],
  ['session ticket (vé phiên)', 'Một khối mã hoá từ máy chủ cho client nối lại mà không cần bắt tay đầy đủ.'],
  ['0-RTT (không vòng khứ hồi)', 'Gửi dữ liệu trong gói đầu của một phiên nối lại; chỉ an toàn cho yêu cầu bất biến.'],
  ['SSLKEYLOGFILE', 'Một biến môi trường; curl/trình duyệt ghi khoá phiên ở đó để bạn giải mã TLS của mình.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>TLS 1.3 đạt một kênh an toàn trong một vòng khứ hồi; phần khoá của client ở gói đầu.</li>
<li>SNI (site nào) và ALPN (giao thức nào) được quyết trong ClientHello dạng chữ; chứng chỉ đã mã hoá.</li>
<li>Nối lại phiên biến <code>New</code> thành <code>Reused</code> nhờ một vé; 1.3 làm được 0-RTT cho yêu cầu bất biến.</li>
<li><code>SSLKEYLOGFILE</code> + Wireshark giải mã HTTPS của chính bạn — gỡ lỗi mà không tắt mã hoá.</li>
<li>Một kết nối HTTPS mới tốn một cú bắt tay TCP + một cú bắt tay TLS; hãy dùng lại kết nối (bài 4.5) và nối lại phiên.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc8446#section-2', '📄', 'RFC 8446 §2 — Giao thức bắt tay TLS 1.3', 'Cú bắt tay 1-RTT, 0-RTT, và mỗi thông điệp mang gì.', 'Mở')}
${L('https://developer.mozilla.org/docs/Glossary/TLS', '📘', 'MDN — ALPN và SNI', 'Giao thức và tên máy chủ được thương lượng ra sao trong cú bắt tay.', 'Mở')}
${L('https://wiki.wireshark.org/TLS', '📘', 'Wireshark — giải mã TLS bằng bản ghi khoá', 'Dùng SSLKEYLOGFILE để đọc lưu lượng HTTPS của chính bạn.', 'Mở')}
${L('https://blog.cloudflare.com/introducing-0-rtt/', '📝', 'Cloudflare — 0-RTT và cảnh báo phát lại', 'Vì sao 0-RTT nhanh, và vì sao nó chỉ dành cho yêu cầu bất biến.', 'Mở')}
</div>
`,
};
