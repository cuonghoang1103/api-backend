/**
 * Chương 6 · 6.1 — TLS bảo đảm điều gì, lịch sử SSL→TLS 1.3 (slug khung netdev-6-1-tls-la-gi). Bài MỞ CHƯƠNG 6.
 * Output thật: lab/out/c61-*.out.txt (dựng lại: bash lab/code/dung-output-ch6.sh).
 */
import { run, card, kv, cauNoi, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-06-1.mjs';

const L = card;
const NGINX = { mon: 'Nginx', khoa: 'nginx' };

export default {
  title: '6.1 — What TLS guarantees, and its history from SSL to TLS 1.3|||6.1 — TLS bảo đảm điều gì, và lịch sử từ SSL tới TLS 1.3',
  slug: 'netdev-6-1-tls-la-gi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 6: ba điều TLS bảo đảm (bí mật, toàn vẹn, xác thực) và cái nó không (tính sẵn sàng, giấu site — SNI là chữ); chứng minh cả ba bằng một openssl s_client (Verify return code 0, TLSv1.3, cipher, ALPN); trên dây chỉ ClientHello/ServerHello + SNI là chữ, phần còn lại mã hoá; lịch sử SSL→TLS 1.3 (2018) và Heartbleed (lỗi OpenSSL, không phải TLS); TLS là một tầng giữa TCP và HTTP.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>What TLS guarantees, and its history from SSL to TLS 1.3</h2>
<p class="lead">The S in HTTPS stands for TLS — the layer that turns a plain TCP connection into a private, tamper-proof channel to a server you can trust. You use it constantly without thinking: every HTTPS page, every <code>git push</code>, every API call and webhook rides on it. This chapter opens TLS up so it stops being a padlock icon and becomes something you can read on the wire. This first lesson pins down exactly what TLS guarantees — and the things it famously does not — proves all of it with one command, and shows what still travels in cleartext even over HTTPS.</p>

<div class="callout info">
<p><strong>🎯 Chapter 6 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>State exactly what TLS guarantees</strong> — confidentiality, integrity, authentication — and what it does not (availability; hiding which site you visit).</li>
<li><strong>Read a TLS 1.3 handshake on the wire</strong>: ClientHello, SNI, ALPN, and tell apart what is cleartext from what is encrypted.</li>
<li><strong>Decrypt your own TLS</strong> with <code>SSLKEYLOGFILE</code> and see the HTTP request and response inside the tunnel.</li>
<li><strong>Read a certificate and follow its chain</strong> — leaf → intermediate → root — and explain why the intermediate is the one everyone forgets.</li>
<li><strong>Diagnose TLS errors with precision</strong>: expired, wrong name, self-signed, not-yet-valid, missing intermediate — each has one unmistakable message.</li>
</ul>
<p><strong>Why a developer needs this:</strong> “certificate expired”, “SSL handshake failed”, “works on Chrome but fails on an old Android”, “self-signed certificate in certificate chain” are errors you will meet in deploys, CI, webhooks and database connections. Each has a precise cause that you read, not guess. Everything in this chapter is measured on the base lab with a real mini certificate authority and an nginx HTTPS server.</p>
</div>

<h3>Three guarantees, and the ones you do not get</h3>
<p>TLS (Transport Layer Security) gives a connection three properties:</p>
<ul>
<li><strong>Confidentiality</strong> — nobody between you and the server can read the data. Broken by: no encryption at all (plain HTTP).</li>
<li><strong>Integrity</strong> — nobody can change the data in flight without you noticing. Broken by: a tampered response (TLS would reject it).</li>
<li><strong>Authentication</strong> — you are really talking to the server you think, not an impostor in the middle. Broken by: a wrong or untrusted certificate.</li>
</ul>
<p>Just as important is what TLS does <em>not</em> give you. It does <strong>not</strong> provide <strong>availability</strong> — a DDoS still takes you offline. And it does <strong>not hide which site you visit</strong>: the server name you are connecting to travels in <strong>cleartext</strong> in the handshake (the SNI, below). TLS secures the <em>channel</em>, not every fact about it.</p>

<h3>All three, proven in one command</h3>
<p><code>openssl s_client</code> opens a TLS connection and tells you everything it negotiated. Point it at the lab’s HTTPS server, trusting our lab root:</p>
${cmd('docker exec nfd-web bash /lab/k/code/ch06/setup-ca.sh                 # a mini CA: root → intermediate → leaf', "docker exec nfd-web nginx -c /tmp/s.conf                                  # HTTPS on :8443", 'docker exec -it nfd-client bash')}
${run('c61-version', 'echo | openssl', 1)}
<ul>
<li><strong>Authentication</strong>: <code>Verify return code: 0 (ok)</code> — the server’s certificate chains up to a root we trust. The <code>subject</code> is <code>labflow.test</code>; the <code>issuer</code> is our Intermediate CA (lesson 6.3).</li>
<li><strong>Confidentiality + integrity</strong>: <code>Protocol: TLSv1.3</code> and the <code>Cipher</code> — the agreed encryption and integrity algorithm.</li>
<li><strong>ALPN h2</strong>: inside the tunnel, both sides agreed to speak HTTP/2 (lesson 7.2). ALPN is how the protocol is chosen <em>during</em> the TLS handshake, saving a round trip.</li>
</ul>
${net('waterfall', 'cold', 'en', 'A cold HTTPS request pays DNS, the TCP handshake, then the TLS handshake before the first byte — walk the TLS phase.', { tour: 'waterfall-phases' })}

<h3>On the wire: only the hellos are cleartext</h3>
<p>Capture the handshake and look at the TLS records. Each has a <em>content type</em> — 22 is handshake, 20 is “change cipher spec”, 23 is encrypted application data:</p>
${run('c61-wire', 'tshark', 1)}
<p><code>ClientHello</code> (handshake type 1) and <code>ServerHello</code> (type 2) are in cleartext — and so is the <strong>SNI</strong> (Server Name Indication), the hostname the client is asking for. Anyone capturing the traffic sees <code>labflow.test</code>. From the ServerHello onward, <strong>everything is encrypted</strong>: in TLS 1.3 even the server’s certificate and the <code>Finished</code> messages, and of course all the HTTP. So TLS hides the <em>content</em> of your connection, but not the fact that you connected, nor — because of the SNI — <em>which</em> site you connected to. (Encrypted ClientHello, ECH, is a newer effort to hide the SNI too; it is not yet universal.)</p>

<div class="pitfall co-tieu-de">
<p><strong>HTTPS does not hide the domain you visit.</strong> A network operator, a captive portal or a nosy ISP cannot read your HTTPS <em>content</em>, but they can see the SNI and the destination IP, so they know you went to <code>bank.example</code>. This is how school and corporate networks block sites “even over HTTPS”, and why privacy tools work on the SNI and DNS (DoH, lesson 3.5), not just the body. If a secret must be hidden, it goes in the encrypted body, never in a hostname or a URL that a proxy logs.</p>
</div>

<h3>A short history, and one scar worth remembering</h3>
<p>The protocol evolved as attacks were found:</p>
<ul>
<li><strong>SSL 2.0 (1995), SSL 3.0 (1996)</strong> — Netscape’s originals. Both are broken and disabled everywhere; “SSL” survives only as a loose name for TLS.</li>
<li><strong>TLS 1.0 (1999), 1.1 (2006)</strong> — deprecated in 2021; browsers refuse them.</li>
<li><strong>TLS 1.2 (2008)</strong> — still widely used; flexible, and therefore easy to misconfigure (weak ciphers, downgrade attacks).</li>
<li><strong>TLS 1.3 (2018, RFC 8446)</strong> — the current standard: fewer round trips (1-RTT, lesson 6.2), only strong ciphers, forward secrecy by default, a much simpler design with fewer footguns.</li>
</ul>
<p>The scar is <strong>Heartbleed (2014)</strong> — a bug not in TLS the protocol but in <strong>OpenSSL</strong>, the most popular implementation. A missing length check let an attacker read chunks of server memory, including private keys, from any vulnerable server. The lesson for developers: a sound protocol does not save you from a buggy library. Keep your TLS stack (OpenSSL, BoringSSL, your language’s TLS) patched, and prefer TLS 1.3, which removed many of the sharp edges 1.2 still has. The cryptographic details — why these ciphers, how forward secrecy works — are in the applied-cryptography material; here we care about the protocol on the wire.</p>

<h3>Where TLS sits</h3>
<p>TLS is a <strong>layer</strong>, slotted between TCP and the application:</p>
<table>
<tr><th>Layer</th><th>What it does</th></tr>
<tr><td>HTTP</td><td>your request/response — handed to TLS as <strong>plaintext</strong></td></tr>
<tr><td><strong>TLS</strong></td><td>encrypts, authenticates, checks integrity — then passes bytes to TCP</td></tr>
<tr><td>TCP</td><td>delivers those (now encrypted) bytes reliably, in order (Chapter 4)</td></tr>
<tr><td>IP</td><td>routing (Chapter 2)</td></tr>
</table>
<p>HTTP does not know its bytes are encrypted; TCP does not know what it is carrying. That clean separation is why the <em>same</em> TLS secures HTTP (HTTPS), email (SMTPS/IMAPS), database connections, gRPC and more — you learn it once and it applies everywhere a connection needs protecting.</p>
${cauNoi('en', { ...NGINX, bai: 'nginx-6-2-giao-thuc-va-bo-ma', so: '6.2', ten: 'Which protocol and cipher actually get used', giong: 'TLS versions and cipher suites, and that only strong ones should be enabled', khac: 'the nginx course configures ssl_protocols and ssl_ciphers in nginx', them: 'what TLS guarantees (and does not), the three proven from openssl, what is cleartext on the wire (SNI), and the SSL→TLS 1.3 history with the Heartbleed lesson' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate says “we’re on HTTPS, so nobody can tell what our users do.” Your lead wants you to show precisely what HTTPS does and does not hide, with evidence.</p>
<ol>
<li>Start the lab HTTPS server. From <code>nfd-client</code>, run <code>openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile /tmp/root.crt</code> and point out the three guarantees (verify code, protocol, cipher).</li>
<li>Capture one handshake with <code>tcpdump</code> and read it with <code>tshark</code>: which fields are cleartext? Find the SNI.</li>
<li>Explain in writing: what can a network observer see (SNI, destination IP, timing, sizes) and what can they not (the HTTP body)?</li>
<li>State one thing TLS does <em>not</em> protect against at all.</li>
</ol>
<p><strong>Done when:</strong> your answer names confidentiality/integrity/authentication with evidence from <code>openssl</code>, shows the SNI in cleartext from the capture, and correctly says HTTPS hides the body but not the domain — and that TLS does nothing against a DDoS.</p>
<details><summary>Solution</summary>
<p><code>Verify return code: 0</code> (authentication), <code>TLSv1.3</code> + cipher (confidentiality + integrity). The capture shows ClientHello/ServerHello and the SNI <code>labflow.test</code> in cleartext; the certificate and all HTTP are encrypted. “An observer sees the SNI, the destination IP, and the timing and sizes of packets — enough to know you visited <code>labflow.test</code> — but not the request or response body. TLS does nothing against availability attacks: a DDoS still takes the site down.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['TLS — Transport Layer Security (bảo mật tầng vận chuyển)', 'The layer that encrypts, authenticates and integrity-checks a connection; the S in HTTPS.'],
  ['confidentiality (bí mật)', 'Nobody on the path can read the data.'],
  ['integrity (toàn vẹn)', 'Nobody can change the data in flight without detection.'],
  ['authentication (xác thực)', 'You are talking to the real server, proven by its certificate.'],
  ['SNI — Server Name Indication (chỉ báo tên máy chủ)', 'The hostname in the ClientHello; cleartext, so the domain is visible.'],
  ['ALPN (thương lượng giao thức ứng dụng)', 'Choosing the application protocol (h2/http1.1) during the TLS handshake.'],
  ['forward secrecy (bí mật chuyển tiếp)', 'Past traffic stays secret even if the server’s key later leaks; default in TLS 1.3.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>TLS guarantees confidentiality, integrity and authentication — not availability, and not which site you visit (SNI is cleartext).</li>
<li>One <code>openssl s_client</code> proves all three: <code>Verify return code: 0</code>, <code>TLSv1.3</code>, a cipher, ALPN.</li>
<li>On the wire only ClientHello/ServerHello and the SNI are cleartext; the certificate and all HTTP are encrypted.</li>
<li>SSL → TLS 1.3 (2018); Heartbleed was an OpenSSL bug, not a TLS flaw — patch your library, prefer TLS 1.3.</li>
<li>TLS is a layer between TCP and HTTP; the same TLS secures HTTP, email, databases and more.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc8446', '📄', 'RFC 8446 — TLS 1.3 (2018)', 'The current TLS: the handshake, records, and what each guarantee rests on.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/Security/Transport_Layer_Security', '📘', 'MDN — Transport Layer Security', 'A developer-facing overview of TLS, versions and configuration.', 'Open')}
${L('https://heartbleed.com/', '🩸', 'Heartbleed', 'The 2014 OpenSSL bug that leaked private keys — a protocol vs implementation lesson.', 'Open')}
${L('https://hpbn.co/transport-layer-security-tls/', '📘', 'High Performance Browser Networking — TLS', 'TLS for developers: the handshake, costs, and what to optimise.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>TLS bảo đảm điều gì, và lịch sử từ SSL tới TLS 1.3</h2>
<p class="lead">Chữ S trong HTTPS là TLS — tầng biến một kết nối TCP thường thành một kênh riêng tư, chống sửa, tới một máy chủ bạn tin được. Bạn dùng nó liên tục mà không nghĩ: mọi trang HTTPS, mọi <code>git push</code>, mọi lời gọi API và webhook đều đi trên nó. Chương này mở TLS ra để nó thôi là một biểu tượng ổ khoá và trở thành thứ bạn đọc được trên dây. Bài đầu này chốt chính xác TLS bảo đảm gì — và những thứ nó nổi tiếng không — chứng minh tất cả bằng một lệnh, và chỉ ra cái gì vẫn đi dạng chữ ngay cả qua HTTPS.</p>

<div class="callout info">
<p><strong>🎯 Chương 6 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Nói chính xác TLS bảo đảm gì</strong> — bí mật, toàn vẹn, xác thực — và không gì (tính sẵn sàng; giấu site bạn vào).</li>
<li><strong>Đọc một cú bắt tay TLS 1.3 trên dây</strong>: ClientHello, SNI, ALPN, và phân biệt cái gì là chữ với cái gì mã hoá.</li>
<li><strong>Giải mã TLS của chính bạn</strong> bằng <code>SSLKEYLOGFILE</code> và thấy yêu cầu và câu trả lời HTTP bên trong đường hầm.</li>
<li><strong>Đọc một chứng chỉ và lần chuỗi của nó</strong> — lá → trung gian → gốc — và giải thích vì sao trung gian là cái ai cũng quên.</li>
<li><strong>Chẩn đoán lỗi TLS chính xác</strong>: hết hạn, sai tên, tự ký, chưa hiệu lực, thiếu trung gian — mỗi cái một thông điệp không thể nhầm.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> “certificate expired”, “SSL handshake failed”, “chạy trên Chrome mà hỏng trên Android cũ”, “self-signed certificate in certificate chain” là những lỗi bạn sẽ gặp khi deploy, trong CI, với webhook và kết nối cơ sở dữ liệu. Mỗi cái có một nguyên nhân chính xác bạn đọc ra, không đoán. Mọi thứ trong chương này đều đo trên lab cơ bản với một nhà cấp chứng chỉ tí hon thật và một máy chủ HTTPS nginx.</p>
</div>

<h3>Ba bảo đảm, và những thứ bạn không có</h3>
<p>TLS (Transport Layer Security — bảo mật tầng vận chuyển) cho một kết nối ba tính chất:</p>
<ul>
<li><strong>Bí mật (confidentiality)</strong> — không ai giữa bạn và máy chủ đọc được dữ liệu. Phá bởi: không mã hoá gì cả (HTTP thường).</li>
<li><strong>Toàn vẹn (integrity)</strong> — không ai đổi được dữ liệu trên đường mà bạn không hay. Phá bởi: một câu trả lời bị sửa (TLS sẽ từ chối nó).</li>
<li><strong>Xác thực (authentication)</strong> — bạn thật sự nói với máy chủ mình nghĩ, không phải kẻ đứng giữa giả mạo. Phá bởi: một chứng chỉ sai hoặc không tin được.</li>
</ul>
<p>Cũng quan trọng là cái TLS <em>không</em> cho. Nó <strong>không</strong> cho <strong>tính sẵn sàng</strong> — một DDoS vẫn làm bạn ngoại tuyến. Và nó <strong>không giấu bạn vào site nào</strong>: tên máy chủ bạn kết nối tới đi dạng <strong>chữ</strong> trong cú bắt tay (SNI, ở dưới). TLS bảo vệ <em>kênh</em>, không phải mọi sự thật về nó.</p>

<h3>Cả ba, chứng minh trong một lệnh</h3>
<p><code>openssl s_client</code> mở một kết nối TLS và cho bạn biết mọi thứ nó thoả thuận. Trỏ nó vào máy chủ HTTPS của lab, tin gốc của lab:</p>
${cmd('docker exec nfd-web bash /lab/k/code/ch06/setup-ca.sh                 # một CA tí hon: gốc → trung gian → lá', "docker exec nfd-web nginx -c /tmp/s.conf                                  # HTTPS trên :8443", 'docker exec -it nfd-client bash')}
${run('c61-version', 'echo | openssl', 1)}
<ul>
<li><strong>Xác thực</strong>: <code>Verify return code: 0 (ok)</code> — chứng chỉ của máy chủ nối lên một gốc ta tin. <code>subject</code> là <code>labflow.test</code>; <code>issuer</code> là CA Trung gian của ta (bài 6.3).</li>
<li><strong>Bí mật + toàn vẹn</strong>: <code>Protocol: TLSv1.3</code> và <code>Cipher</code> — thuật toán mã hoá và toàn vẹn đã thoả thuận.</li>
<li><strong>ALPN h2</strong>: bên trong đường hầm, cả hai bên đồng ý nói HTTP/2 (bài 7.2). ALPN là cách chọn giao thức <em>trong</em> cú bắt tay TLS, tiết kiệm một vòng khứ hồi.</li>
</ul>
${net('waterfall', 'cold', 'vi', 'Một yêu cầu HTTPS lạnh trả DNS, cú bắt tay TCP, rồi cú bắt tay TLS trước byte đầu — đi qua pha TLS.', { tour: 'waterfall-phases' })}

<h3>Trên dây: chỉ các hello là chữ</h3>
<p>Bắt cú bắt tay và nhìn các bản ghi TLS. Mỗi bản ghi có một <em>content type</em> — 22 là handshake, 20 là “đổi khoá”, 23 là dữ liệu ứng dụng đã mã hoá:</p>
${run('c61-wire', 'tshark', 1)}
<p><code>ClientHello</code> (handshake type 1) và <code>ServerHello</code> (type 2) là chữ — và <strong>SNI</strong> (Server Name Indication — chỉ báo tên máy chủ), tên miền client đang hỏi, cũng vậy. Ai bắt lưu lượng cũng thấy <code>labflow.test</code>. Từ ServerHello trở đi, <strong>mọi thứ mã hoá</strong>: trong TLS 1.3 kể cả chứng chỉ của máy chủ và các thông điệp <code>Finished</code>, và dĩ nhiên toàn bộ HTTP. Nên TLS giấu <em>nội dung</em> kết nối, nhưng không giấu việc bạn đã kết nối, cũng không — vì SNI — giấu bạn kết nối tới <em>site nào</em>. (Encrypted ClientHello, ECH, là nỗ lực mới giấu cả SNI; chưa phổ biến.)</p>

<div class="pitfall co-tieu-de">
<p><strong>HTTPS không giấu tên miền bạn vào.</strong> Một nhà mạng, một cổng đăng nhập hay một ISP tò mò không đọc được <em>nội dung</em> HTTPS của bạn, nhưng thấy được SNI và IP đích, nên biết bạn vào <code>bank.example</code>. Đây là cách mạng trường và công ty chặn site “ngay cả qua HTTPS”, và vì sao công cụ riêng tư làm việc trên SNI và DNS (DoH, bài 3.5), không chỉ thân. Nếu một bí mật phải được giấu, nó nằm trong thân mã hoá, không bao giờ trong một tên máy chủ hay một URL mà proxy ghi log.</p>
</div>

<h3>Lịch sử ngắn, và một vết sẹo đáng nhớ</h3>
<p>Giao thức tiến hoá khi các cuộc tấn công được tìm ra:</p>
<ul>
<li><strong>SSL 2.0 (1995), SSL 3.0 (1996)</strong> — bản gốc của Netscape. Cả hai đã vỡ và bị tắt khắp nơi; “SSL” chỉ còn sống như một tên gọi lỏng cho TLS.</li>
<li><strong>TLS 1.0 (1999), 1.1 (2006)</strong> — khai tử năm 2021; trình duyệt từ chối chúng.</li>
<li><strong>TLS 1.2 (2008)</strong> — vẫn dùng rộng rãi; linh hoạt, và do đó dễ cấu hình sai (bộ mã yếu, tấn công hạ cấp).</li>
<li><strong>TLS 1.3 (2018, RFC 8446)</strong> — chuẩn hiện hành: ít vòng khứ hồi hơn (1-RTT, bài 6.2), chỉ bộ mã mạnh, bí mật chuyển tiếp mặc định, thiết kế đơn giản hơn nhiều với ít bẫy.</li>
</ul>
<p>Vết sẹo là <strong>Heartbleed (2014)</strong> — một lỗi không phải trong TLS giao thức mà trong <strong>OpenSSL</strong>, hiện thực phổ biến nhất. Một phép kiểm độ dài bị thiếu cho kẻ tấn công đọc từng mẩu bộ nhớ máy chủ, kể cả khoá riêng, từ bất kỳ máy chủ dễ tổn thương nào. Bài học cho lập trình viên: một giao thức vững không cứu bạn khỏi một thư viện có lỗi. Giữ ngăn xếp TLS (OpenSSL, BoringSSL, TLS của ngôn ngữ bạn) được vá, và ưu tiên TLS 1.3, thứ đã bỏ nhiều cạnh sắc mà 1.2 còn. Chi tiết mật mã — vì sao các bộ mã này, bí mật chuyển tiếp hoạt động ra sao — nằm trong tài liệu mật mã ứng dụng; ở đây ta quan tâm giao thức trên dây.</p>

<h3>TLS nằm ở đâu</h3>
<p>TLS là một <strong>tầng</strong>, chèn giữa TCP và ứng dụng:</p>
<table>
<tr><th>Tầng</th><th>Làm gì</th></tr>
<tr><td>HTTP</td><td>yêu cầu/câu trả lời của bạn — trao cho TLS dạng <strong>chữ thường</strong></td></tr>
<tr><td><strong>TLS</strong></td><td>mã hoá, xác thực, kiểm toàn vẹn — rồi chuyển byte cho TCP</td></tr>
<tr><td>TCP</td><td>giao các byte (giờ đã mã hoá) đáng tin, đúng thứ tự (Chương 4)</td></tr>
<tr><td>IP</td><td>định tuyến (Chương 2)</td></tr>
</table>
<p>HTTP không biết byte của nó được mã hoá; TCP không biết nó mang gì. Sự tách bạch sạch sẽ đó là lý do <em>cùng một</em> TLS bảo vệ HTTP (HTTPS), email (SMTPS/IMAPS), kết nối cơ sở dữ liệu, gRPC và hơn nữa — bạn học một lần và nó áp dụng khắp nơi một kết nối cần bảo vệ.</p>
${cauNoi('vi', { ...NGINX, bai: 'nginx-6-2-giao-thuc-va-bo-ma', so: '6.2', ten: 'Rốt cuộc giao thức nào và bộ mã nào được dùng', giong: 'các phiên bản TLS và bộ mã, và chỉ nên bật cái mạnh', khac: 'khoá nginx cấu hình ssl_protocols và ssl_ciphers trong nginx', them: 'TLS bảo đảm gì (và không), ba điều chứng minh từ openssl, cái gì là chữ trên dây (SNI), và lịch sử SSL→TLS 1.3 với bài học Heartbleed' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một đồng nghiệp nói “mình chạy HTTPS, nên không ai biết người dùng làm gì.” Trưởng nhóm muốn bạn chỉ ra chính xác HTTPS giấu và không giấu gì, kèm bằng chứng.</p>
<ol>
<li>Dựng máy chủ HTTPS của lab. Từ <code>nfd-client</code>, chạy <code>openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile /tmp/root.crt</code> và chỉ ra ba bảo đảm (verify code, protocol, cipher).</li>
<li>Bắt một cú bắt tay bằng <code>tcpdump</code> và đọc bằng <code>tshark</code>: trường nào là chữ? Tìm SNI.</li>
<li>Giải thích bằng chữ: một người quan sát mạng thấy được gì (SNI, IP đích, thời điểm, kích thước) và không thấy gì (thân HTTP)?</li>
<li>Nêu một điều TLS <em>không</em> chống được chút nào.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời gọi tên bí mật/toàn vẹn/xác thực kèm bằng chứng từ <code>openssl</code>, cho thấy SNI dạng chữ từ bản bắt gói, và nói đúng rằng HTTPS giấu thân nhưng không giấu tên miền — và rằng TLS không làm gì được với một DDoS.</p>
<details><summary>Lời giải</summary>
<p><code>Verify return code: 0</code> (xác thực), <code>TLSv1.3</code> + cipher (bí mật + toàn vẹn). Bản bắt gói cho thấy ClientHello/ServerHello và SNI <code>labflow.test</code> dạng chữ; chứng chỉ và toàn bộ HTTP mã hoá. “Người quan sát thấy SNI, IP đích, và thời điểm cùng kích thước gói — đủ để biết bạn vào <code>labflow.test</code> — nhưng không thấy thân yêu cầu hay câu trả lời. TLS không làm gì được với tấn công tính sẵn sàng: một DDoS vẫn hạ site.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['TLS — Transport Layer Security (bảo mật tầng vận chuyển)', 'Tầng mã hoá, xác thực và kiểm toàn vẹn một kết nối; chữ S trong HTTPS.'],
  ['confidentiality (bí mật)', 'Không ai trên đường đọc được dữ liệu.'],
  ['integrity (toàn vẹn)', 'Không ai đổi được dữ liệu trên đường mà không bị phát hiện.'],
  ['authentication (xác thực)', 'Bạn đang nói với máy chủ thật, chứng minh bằng chứng chỉ của nó.'],
  ['SNI — Server Name Indication (chỉ báo tên máy chủ)', 'Tên miền trong ClientHello; dạng chữ, nên tên miền bị lộ.'],
  ['ALPN (thương lượng giao thức ứng dụng)', 'Chọn giao thức ứng dụng (h2/http1.1) trong cú bắt tay TLS.'],
  ['forward secrecy (bí mật chuyển tiếp)', 'Lưu lượng cũ vẫn bí mật dù khoá máy chủ về sau bị lộ; mặc định ở TLS 1.3.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>TLS bảo đảm bí mật, toàn vẹn và xác thực — không tính sẵn sàng, và không giấu site bạn vào (SNI là chữ).</li>
<li>Một <code>openssl s_client</code> chứng minh cả ba: <code>Verify return code: 0</code>, <code>TLSv1.3</code>, một cipher, ALPN.</li>
<li>Trên dây chỉ ClientHello/ServerHello và SNI là chữ; chứng chỉ và toàn bộ HTTP mã hoá.</li>
<li>SSL → TLS 1.3 (2018); Heartbleed là lỗi OpenSSL, không phải lỗ hổng TLS — vá thư viện, ưu tiên TLS 1.3.</li>
<li>TLS là một tầng giữa TCP và HTTP; cùng một TLS bảo vệ HTTP, email, cơ sở dữ liệu và hơn nữa.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc8446', '📄', 'RFC 8446 — TLS 1.3 (2018)', 'TLS hiện hành: cú bắt tay, bản ghi, và mỗi bảo đảm dựa trên cái gì.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/Security/Transport_Layer_Security', '📘', 'MDN — Transport Layer Security', 'Tổng quan TLS cho lập trình viên, các phiên bản và cấu hình.', 'Mở')}
${L('https://heartbleed.com/', '🩸', 'Heartbleed', 'Lỗi OpenSSL 2014 làm rò khoá riêng — bài học giao thức khác hiện thực.', 'Mở')}
${L('https://hpbn.co/transport-layer-security-tls/', '📘', 'High Performance Browser Networking — TLS', 'TLS cho lập trình viên: cú bắt tay, chi phí, và tối ưu cái gì.', 'Mở')}
</div>
`,
};
