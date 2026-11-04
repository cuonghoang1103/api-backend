/**
 * Chương 6 · 6.3 — Chứng chỉ, chuỗi tin cậy và CA (slug khung netdev-6-3-chung-chi).
 * Output thật: lab/out/c63-*.out.txt (dựng lại: bash lab/code/dung-output-ch6.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-06-3.mjs';

const L = card;
const NGINX = { mon: 'Nginx', khoa: 'nginx' };
const CUT = { cut: 74 };

export default {
  title: '6.3 — Certificates, chains and certificate authorities|||6.3 — Chứng chỉ, chuỗi tin cậy và CA',
  slug: 'netdev-6-3-chung-chi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chứng chỉ gắn tên máy chủ (SAN) với khoá công khai, ký bởi CA; chuỗi tin cậy lá ← trung gian ← gốc (gốc trong kho OS, phần còn lại máy chủ phải gửi); cách cấp (CSR → CA kiểm domain → ký, Let’s Encrypt/ACME); lỗi THIẾU TRUNG GIAN chạy trên Chrome (AIA) nhưng hỏng curl/Java/Android cũ — đo được; Certificate Transparency ghi log mọi chứng chỉ công khai.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Certificates, chains and certificate authorities</h2>
<p class="lead">The authentication guarantee of TLS — “you are really talking to <code>labflow.test</code>” — rests entirely on certificates. A certificate is a signed statement: <em>this public key belongs to this hostname, and I, a certificate authority, vouch for it.</em> The trick is that your browser does not know your server; it knows a few hundred <strong>roots</strong>, and your certificate must form an unbroken <strong>chain</strong> up to one of them. This lesson reads a real certificate, follows that chain, shows how a certificate is issued today, and reproduces the single most common TLS deployment bug — the forgotten intermediate — which works in Chrome and fails everywhere else.</p>

<h3>What a certificate actually says</h3>
<p>Read the server’s leaf certificate:</p>
${run('c63-read', 'echo | openssl', 1)}
<ul>
<li><code>subject</code> — who the certificate is <em>for</em> (the site, <code>labflow.test</code>).</li>
<li><code>issuer</code> — who <em>signed</em> it (our Intermediate CA). A certificate is only as trustworthy as its issuer.</li>
<li><code>notBefore</code> / <code>notAfter</code> — the validity window. Outside it, the certificate is rejected (lesson 6.4).</li>
<li><code>Subject Alternative Name</code> (SAN) — the exact hostnames the certificate is valid for (<code>labflow.test</code>, <code>www.labflow.test</code>). Modern clients ignore the old <code>CN</code> field entirely and check only the SAN, so a certificate without the right SAN entry fails even if the <code>CN</code> looks right.</li>
</ul>

<h3>A chain of trust</h3>
<p>A browser cannot possibly ship a copy of every website’s certificate. Instead it ships a few hundred <strong>root CA</strong> certificates, and trust flows downward through signatures:</p>
<table>
<tr><th>Certificate</th><th>Signed by</th><th>Where it lives</th></tr>
<tr><td><strong>leaf</strong> (<code>labflow.test</code>)</td><td>the intermediate CA</td><td>sent by your server, every connection</td></tr>
<tr><td><strong>intermediate</strong> CA</td><td>the root CA</td><td>sent by your server too — the forgotten one</td></tr>
<tr><td><strong>root</strong> CA</td><td>itself (self-signed)</td><td>pre-installed in the OS / browser trust store</td></tr>
</table>
<p>The client already has the <strong>root</strong>. Your server must send the <strong>leaf and the intermediate</strong>, so the client can verify: leaf was signed by intermediate, intermediate was signed by a root I trust → the leaf is trusted. (Roots use intermediates so the precious, offline root key is rarely used; if an intermediate is compromised it can be replaced without re-trusting every device.)</p>

<h3>Read the chain the server sent</h3>
${run('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -E', 1, CUT)}
<p>Two certificates, read top to bottom: <strong>0</strong> is the leaf (subject <code>labflow.test</code>, issued by the Intermediate), <strong>1</strong> is the intermediate (subject Intermediate, issued by the Root). The root is <em>not</em> in the list — it does not need to be, because the client already trusts it. That is a correctly configured chain, and the verify passes:</p>
${run('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile', 1)}

<h3>How a certificate is issued (and why it is free now)</h3>
<ol>
<li>You generate a <strong>key pair</strong> and a <strong>CSR</strong> (certificate signing request) containing your public key and the hostnames you want.</li>
<li>A <strong>CA</strong> verifies you control the domain. With <strong>ACME</strong> (the automated protocol) this is a challenge: serve a specific token at <code>http://your-domain/.well-known/acme-challenge/…</code>, or publish a TXT DNS record. Only the real owner can.</li>
<li>The CA <strong>signs</strong> your CSR with its intermediate key, producing your <strong>leaf certificate</strong>.</li>
<li>You install the leaf <strong>and the intermediate</strong> on your server.</li>
</ol>
<p><strong>Let’s Encrypt</strong> (2015/2016) turned this from a slow, paid, yearly manual process into a free, automatic one: a client (<code>certbot</code>, Caddy, your load balancer, Cloudflare) proves control, gets a <strong>90-day</strong> certificate, and <strong>renews automatically</strong>. Short lifetimes are a feature — a leaked certificate is only dangerous for weeks, not years — made bearable by automation.</p>

<h3>The intermediate everyone forgets</h3>
<p>Now the classic bug. Configure the server to send only the leaf — not the intermediate — and connect:</p>
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/root.crt https', 1)}
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/bundle.crt', 1)}
<p><code>unable to get local issuer certificate</code>: the client has the leaf and the root, but cannot bridge them without the intermediate. Give the client the intermediate and it works. The reason this bug is so infamous: <strong>Chrome and Firefox often hide it</strong>. Modern browsers read the <strong>AIA</strong> (Authority Information Access) URL inside the leaf, <em>fetch the missing intermediate themselves</em>, and cache it — so the site works in your browser. But <code>curl</code>, Java (<code>PKIX path building failed</code>), old Android, Go, and your uptime monitor do <strong>not</strong> do AIA fetching, so they fail. “Works in my browser, fails in CI / on mobile / from the monitoring box” is almost always a missing intermediate.</p>

<div class="pitfall co-tieu-de">
<p><strong>Always serve the full chain, and test with a non-browser client.</strong> Configure your server with <code>fullchain.pem</code> (leaf + intermediate), never just the leaf — Let’s Encrypt even names the file <code>fullchain.pem</code> to make this hard to get wrong. And verify with <code>openssl s_client</code> or <code>curl</code>, or an external checker like SSL Labs, which do not paper over a missing intermediate the way a browser does. The green padlock in <em>your</em> Chrome is not proof the chain is complete.</p>
</div>

<h3>Certificate Transparency: every certificate is logged</h3>
<p>There is one more layer. Since ~2018, browsers require that a publicly trusted certificate be recorded in append-only, public <strong>Certificate Transparency (CT) logs</strong>. This makes mis-issuance <em>visible</em>: if some CA wrongly issued a certificate for <code>your-domain.com</code>, it appears in the logs within hours, and anyone — including you — can watch. Monitor <code>crt.sh</code> or a CT-watch service for certificates naming your domains, and you get an early warning of a rogue or mistaken certificate. CT is a safety net on top of the chain of trust, not a replacement: the chain proves <em>who signed</em>, CT proves <em>what was signed, publicly</em>.</p>
${cauNoi('en', { ...NGINX, bai: 'nginx-6-1-chuoi-chung-chi', so: '6.1', ten: 'The certificate chain, and the intermediate everyone forgets', giong: 'the leaf → intermediate → root chain and the missing-intermediate failure', khac: 'the nginx course configures ssl_certificate with the full chain and OCSP stapling in nginx', them: 'reading a real certificate’s SAN, the chain on the wire, ACME/Let’s Encrypt issuance, the AIA reason Chrome masks the bug, and Certificate Transparency' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a new deploy’s HTTPS “works on my laptop” but the mobile app and the uptime monitor both report certificate errors. Reproduce and diagnose in the lab.</p>
<ol>
<li>Serve the <strong>full chain</strong>: with the lab HTTPS server on <code>fullchain.crt</code>, run <code>openssl s_client -showcerts</code> and confirm two certificates (leaf + intermediate) and <code>Verify return code: 0</code>.</li>
<li>Break it: reconfigure to serve <code>leaf.crt</code> only, reload, and run <code>curl --cacert /tmp/root.crt https://labflow.test:8443/</code>. Record the exact error.</li>
<li>Prove the fix two ways: give curl the intermediate (<code>--cacert /tmp/bundle.crt</code>) — it works; and explain why a browser might have hidden the bug (AIA).</li>
<li>Write the diagnosis and the one-line fix for the deploy.</li>
</ol>
<p><strong>Done when:</strong> you have shown a correct two-certificate chain, reproduced <code>unable to get local issuer certificate</code> with the leaf alone, fixed it by providing the intermediate, and your write-up names “missing intermediate; serve fullchain” and explains the browser-vs-curl difference.</p>
<details><summary>Solution</summary>
<p>With <code>fullchain.crt</code>, <code>-showcerts</code> shows cert 0 (leaf) and cert 1 (intermediate) and <code>Verify return code: 0</code>. With <code>leaf.crt</code> only, curl returns <code>unable to get local issuer certificate (20)</code>; providing the intermediate (bundle) returns 200. Browsers often still work because they fetch the intermediate via the leaf’s AIA URL; curl, Java and old Android do not. Fix: “The server is sending only the leaf; configure it with the full chain (<code>fullchain.pem</code>). Chrome hid it by fetching the intermediate via AIA; the mobile app and monitor do not, so they failed.”</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['certificate (chứng chỉ)', 'A CA-signed statement binding a public key to one or more hostnames, with a validity window.'],
  ['SAN — Subject Alternative Name', 'The list of hostnames a certificate is valid for; the modern check (the CN is ignored).'],
  ['chain of trust (chuỗi tin cậy)', 'leaf ← intermediate ← root; the client verifies up to a root it already trusts.'],
  ['CA — certificate authority (nhà cấp chứng chỉ)', 'An organisation that verifies identity and signs certificates.'],
  ['intermediate (CA trung gian)', 'A CA signed by the root; your server must send it with the leaf.'],
  ['CSR — certificate signing request', 'Your public key + hostnames, sent to a CA to be signed.'],
  ['ACME / Let’s Encrypt', 'The automated protocol and free CA: prove domain control, get a 90-day cert, auto-renew.'],
  ['AIA — Authority Information Access', 'A URL in the leaf; browsers use it to fetch a missing intermediate (curl/Java do not).'],
  ['Certificate Transparency (CT)', 'Public append-only logs of every issued certificate, for spotting mis-issuance.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A certificate binds a hostname (SAN) to a public key, with a validity window, signed by a CA.</li>
<li>Trust is a chain: leaf ← intermediate ← root; the root is in the OS store, the rest your server must send.</li>
<li>Issuance: CSR → a CA verifies domain control → signs; Let’s Encrypt + ACME make it free and automatic.</li>
<li>The missing intermediate works in Chrome (AIA fetch) but fails in curl/Java/old Android — always serve the full chain.</li>
<li>Certificate Transparency logs every public certificate — monitor yours for mis-issuance.</li>
</ul>
${L('https://letsencrypt.org/how-it-works/', '🔒', 'Let’s Encrypt — How it works', 'ACME, domain validation, and automatic 90-day certificates.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc5280', '📄', 'RFC 5280 — X.509 certificates and path validation', 'What a certificate contains and how a chain is validated.', 'Open')}
${L('https://crt.sh/', '🔎', 'crt.sh — Certificate Transparency search', 'Search the public CT logs for certificates issued for any domain.', 'Open')}
${L('https://www.ssllabs.com/ssltest/', '🧪', 'SSL Labs — server test', 'An external checker that catches a missing intermediate a browser would hide.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Chứng chỉ, chuỗi tin cậy và CA</h2>
<p class="lead">Bảo đảm xác thực của TLS — “bạn thật sự đang nói với <code>labflow.test</code>” — hoàn toàn dựa trên chứng chỉ. Một chứng chỉ là một lời tuyên bố đã ký: <em>khoá công khai này thuộc về tên máy chủ này, và tôi, một nhà cấp chứng chỉ, bảo lãnh cho nó.</em> Mẹo là trình duyệt của bạn không biết máy chủ của bạn; nó biết vài trăm <strong>gốc</strong>, và chứng chỉ của bạn phải tạo một <strong>chuỗi</strong> không đứt lên tới một trong số đó. Bài này đọc một chứng chỉ thật, lần chuỗi đó, chỉ ra một chứng chỉ được cấp ra sao hôm nay, và dựng lại lỗi triển khai TLS phổ biến nhất — trung gian bị quên — chạy trong Chrome và hỏng mọi nơi khác.</p>

<h3>Một chứng chỉ thật sự nói gì</h3>
<p>Đọc chứng chỉ lá của máy chủ:</p>
${run('c63-read', 'echo | openssl', 1)}
<ul>
<li><code>subject</code> — chứng chỉ <em>dành cho</em> ai (cái site, <code>labflow.test</code>).</li>
<li><code>issuer</code> — ai đã <em>ký</em> nó (CA Trung gian của ta). Một chứng chỉ chỉ đáng tin bằng nơi cấp của nó.</li>
<li><code>notBefore</code> / <code>notAfter</code> — cửa sổ hiệu lực. Ngoài nó, chứng chỉ bị từ chối (bài 6.4).</li>
<li><code>Subject Alternative Name</code> (SAN) — đúng các tên máy chủ chứng chỉ hợp lệ cho (<code>labflow.test</code>, <code>www.labflow.test</code>). Client hiện đại bỏ qua hẳn trường <code>CN</code> cũ và chỉ kiểm SAN, nên một chứng chỉ thiếu mục SAN đúng sẽ hỏng dù <code>CN</code> nhìn đúng.</li>
</ul>

<h3>Một chuỗi tin cậy</h3>
<p>Một trình duyệt không thể đi kèm bản sao chứng chỉ của mọi website. Thay vào đó nó đi kèm vài trăm chứng chỉ <strong>CA gốc</strong>, và tin cậy chảy xuống qua các chữ ký:</p>
<table>
<tr><th>Chứng chỉ</th><th>Ký bởi</th><th>Nằm ở đâu</th></tr>
<tr><td><strong>lá</strong> (<code>labflow.test</code>)</td><td>CA trung gian</td><td>máy chủ của bạn gửi, mỗi kết nối</td></tr>
<tr><td><strong>trung gian</strong></td><td>CA gốc</td><td>máy chủ của bạn cũng gửi — cái bị quên</td></tr>
<tr><td><strong>gốc</strong></td><td>chính nó (tự ký)</td><td>cài sẵn trong kho tin cậy OS / trình duyệt</td></tr>
</table>
<p>Client đã có <strong>gốc</strong>. Máy chủ của bạn phải gửi <strong>lá và trung gian</strong>, để client kiểm được: lá do trung gian ký, trung gian do một gốc tôi tin ký → lá đáng tin. (Gốc dùng trung gian để khoá gốc quý giá, ngoại tuyến hiếm khi dùng; nếu một trung gian bị xâm phạm có thể thay mà không phải tin lại mọi thiết bị.)</p>

<h3>Đọc chuỗi máy chủ đã gửi</h3>
${run('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -E', 1, CUT)}
<p>Hai chứng chỉ, đọc từ trên xuống: <strong>0</strong> là lá (chủ thể <code>labflow.test</code>, cấp bởi Trung gian), <strong>1</strong> là trung gian (chủ thể Trung gian, cấp bởi Gốc). Gốc <em>không</em> trong danh sách — không cần, vì client đã tin nó. Đó là một chuỗi cấu hình đúng, và verify qua:</p>
${run('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile', 1)}

<h3>Một chứng chỉ được cấp ra sao (và vì sao giờ miễn phí)</h3>
<ol>
<li>Bạn tạo một <strong>cặp khoá</strong> và một <strong>CSR</strong> (certificate signing request) chứa khoá công khai và các tên máy chủ bạn muốn.</li>
<li>Một <strong>CA</strong> kiểm bạn kiểm soát tên miền. Với <strong>ACME</strong> (giao thức tự động) đây là một thử thách: phục vụ một token cụ thể ở <code>http://ten-mien/.well-known/acme-challenge/…</code>, hoặc công bố một bản ghi TXT DNS. Chỉ chủ thật làm được.</li>
<li>CA <strong>ký</strong> CSR của bạn bằng khoá trung gian của nó, tạo ra <strong>chứng chỉ lá</strong> của bạn.</li>
<li>Bạn cài lá <strong>và trung gian</strong> lên máy chủ.</li>
</ol>
<p><strong>Let’s Encrypt</strong> (2015/2016) biến việc này từ một quá trình chậm, trả phí, thủ công hằng năm thành một quá trình miễn phí, tự động: một client (<code>certbot</code>, Caddy, bộ cân bằng tải của bạn, Cloudflare) chứng minh kiểm soát, nhận một chứng chỉ <strong>90 ngày</strong>, và <strong>tự gia hạn</strong>. Hạn ngắn là một tính năng — một chứng chỉ bị lộ chỉ nguy hiểm vài tuần, không phải vài năm — chịu được nhờ tự động hoá.</p>

<h3>Trung gian ai cũng quên</h3>
<p>Giờ là lỗi kinh điển. Cấu hình máy chủ chỉ gửi lá — không trung gian — và kết nối:</p>
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/root.crt https', 1)}
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/bundle.crt', 1)}
<p><code>unable to get local issuer certificate</code>: client có lá và gốc, nhưng không bắc cầu được chúng nếu thiếu trung gian. Cho client trung gian và nó chạy. Lý do lỗi này nổi tiếng: <strong>Chrome và Firefox thường che nó</strong>. Trình duyệt hiện đại đọc URL <strong>AIA</strong> (Authority Information Access) bên trong lá, <em>tự đi lấy trung gian thiếu</em>, và cache nó — nên site chạy trong trình duyệt bạn. Nhưng <code>curl</code>, Java (<code>PKIX path building failed</code>), Android cũ, Go, và hệ giám sát uptime của bạn <strong>không</strong> làm việc lấy AIA, nên chúng hỏng. “Chạy trong trình duyệt tôi, hỏng trong CI / trên di động / từ hộp giám sát” gần như luôn là một trung gian thiếu.</p>

<div class="pitfall co-tieu-de">
<p><strong>Luôn phục vụ chuỗi đầy đủ, và thử với một client không phải trình duyệt.</strong> Cấu hình máy chủ với <code>fullchain.pem</code> (lá + trung gian), không bao giờ chỉ lá — Let’s Encrypt còn đặt tên tệp là <code>fullchain.pem</code> để khó sai. Và xác minh bằng <code>openssl s_client</code> hoặc <code>curl</code>, hay một bộ kiểm ngoài như SSL Labs, những thứ không che một trung gian thiếu như trình duyệt làm. Ổ khoá xanh trong Chrome <em>của bạn</em> không phải bằng chứng chuỗi đầy đủ.</p>
</div>

<h3>Certificate Transparency: mọi chứng chỉ đều được ghi log</h3>
<p>Có thêm một tầng. Từ khoảng 2018, trình duyệt yêu cầu một chứng chỉ được tin công khai phải được ghi trong các <strong>log Certificate Transparency (CT)</strong> công khai, chỉ-thêm. Điều này làm cấp nhầm <em>thấy được</em>: nếu một CA nào cấp sai một chứng chỉ cho <code>ten-mien-cua-ban.com</code>, nó xuất hiện trong log trong vài giờ, và ai cũng — kể cả bạn — xem được. Theo dõi <code>crt.sh</code> hay một dịch vụ CT-watch cho các chứng chỉ gọi tên miền của bạn, và bạn được cảnh báo sớm về một chứng chỉ giả hoặc nhầm. CT là một lưới an toàn trên chuỗi tin cậy, không thay thế: chuỗi chứng minh <em>ai ký</em>, CT chứng minh <em>cái gì đã được ký, công khai</em>.</p>
${cauNoi('vi', { ...NGINX, bai: 'nginx-6-1-chuoi-chung-chi', so: '6.1', ten: 'Chuỗi chứng chỉ, và cái CA trung gian ai cũng quên', giong: 'chuỗi lá → trung gian → gốc và lỗi thiếu trung gian', khac: 'khoá nginx cấu hình ssl_certificate với chuỗi đầy đủ và OCSP stapling trong nginx', them: 'đọc SAN của một chứng chỉ thật, chuỗi trên dây, cấp phát ACME/Let’s Encrypt, lý do AIA làm Chrome che lỗi, và Certificate Transparency' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> HTTPS của một bản deploy mới “chạy trên laptop mình” nhưng app di động và hệ giám sát uptime đều báo lỗi chứng chỉ. Dựng lại và chẩn đoán trong lab.</p>
<ol>
<li>Phục vụ <strong>chuỗi đầy đủ</strong>: với máy chủ HTTPS lab dùng <code>fullchain.crt</code>, chạy <code>openssl s_client -showcerts</code> và xác nhận hai chứng chỉ (lá + trung gian) và <code>Verify return code: 0</code>.</li>
<li>Làm hỏng: cấu hình lại chỉ phục vụ <code>leaf.crt</code>, reload, và chạy <code>curl --cacert /tmp/root.crt https://labflow.test:8443/</code>. Ghi lỗi chính xác.</li>
<li>Chứng minh cách sửa hai cách: cho curl trung gian (<code>--cacert /tmp/bundle.crt</code>) — nó chạy; và giải thích vì sao một trình duyệt có thể đã che lỗi (AIA).</li>
<li>Viết chẩn đoán và cách sửa một dòng cho bản deploy.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã cho thấy một chuỗi hai chứng chỉ đúng, dựng lại <code>unable to get local issuer certificate</code> với mỗi lá, sửa bằng cách cung cấp trung gian, và bài viết gọi tên “thiếu trung gian; phục vụ fullchain” và giải thích khác biệt trình duyệt với curl.</p>
<details><summary>Lời giải</summary>
<p>Với <code>fullchain.crt</code>, <code>-showcerts</code> cho thấy cert 0 (lá) và cert 1 (trung gian) và <code>Verify return code: 0</code>. Với mỗi <code>leaf.crt</code>, curl trả <code>unable to get local issuer certificate (20)</code>; cung cấp trung gian (bundle) trả 200. Trình duyệt thường vẫn chạy vì chúng lấy trung gian qua URL AIA của lá; curl, Java và Android cũ thì không. Sửa: “Máy chủ đang chỉ gửi lá; cấu hình nó với chuỗi đầy đủ (<code>fullchain.pem</code>). Chrome che nó bằng cách lấy trung gian qua AIA; app di động và hệ giám sát thì không, nên chúng hỏng.”</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['certificate (chứng chỉ)', 'Một lời tuyên bố ký bởi CA gắn khoá công khai với một hay nhiều tên máy chủ, kèm cửa sổ hiệu lực.'],
  ['SAN — Subject Alternative Name', 'Danh sách tên máy chủ một chứng chỉ hợp lệ cho; phép kiểm hiện đại (CN bị bỏ qua).'],
  ['chain of trust (chuỗi tin cậy)', 'lá ← trung gian ← gốc; client kiểm lên tới một gốc nó đã tin.'],
  ['CA — certificate authority (nhà cấp chứng chỉ)', 'Một tổ chức xác minh danh tính và ký chứng chỉ.'],
  ['intermediate (CA trung gian)', 'Một CA do gốc ký; máy chủ của bạn phải gửi nó cùng lá.'],
  ['CSR — certificate signing request', 'Khoá công khai + tên máy chủ của bạn, gửi tới một CA để ký.'],
  ['ACME / Let’s Encrypt', 'Giao thức tự động và CA miễn phí: chứng minh kiểm soát domain, nhận cert 90 ngày, tự gia hạn.'],
  ['AIA — Authority Information Access', 'Một URL trong lá; trình duyệt dùng nó để lấy trung gian thiếu (curl/Java không).'],
  ['Certificate Transparency (CT)', 'Các log công khai chỉ-thêm của mọi chứng chỉ đã cấp, để phát hiện cấp nhầm.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một chứng chỉ gắn một tên máy chủ (SAN) với một khoá công khai, kèm cửa sổ hiệu lực, ký bởi một CA.</li>
<li>Tin cậy là một chuỗi: lá ← trung gian ← gốc; gốc trong kho OS, phần còn lại máy chủ của bạn phải gửi.</li>
<li>Cấp phát: CSR → một CA kiểm kiểm soát domain → ký; Let’s Encrypt + ACME làm nó miễn phí và tự động.</li>
<li>Trung gian thiếu chạy trong Chrome (lấy qua AIA) nhưng hỏng trong curl/Java/Android cũ — luôn phục vụ chuỗi đầy đủ.</li>
<li>Certificate Transparency ghi log mọi chứng chỉ công khai — theo dõi cái của bạn cho cấp nhầm.</li>
</ul>
${L('https://letsencrypt.org/how-it-works/', '🔒', 'Let’s Encrypt — Cách hoạt động', 'ACME, xác minh domain, và chứng chỉ 90 ngày tự động.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc5280', '📄', 'RFC 5280 — Chứng chỉ X.509 và kiểm đường dẫn', 'Một chứng chỉ chứa gì và một chuỗi được kiểm ra sao.', 'Mở')}
${L('https://crt.sh/', '🔎', 'crt.sh — Tìm trong Certificate Transparency', 'Tìm trong log CT công khai các chứng chỉ cấp cho bất kỳ tên miền nào.', 'Mở')}
${L('https://www.ssllabs.com/ssltest/', '🧪', 'SSL Labs — kiểm máy chủ', 'Một bộ kiểm ngoài bắt được một trung gian thiếu mà trình duyệt sẽ che.', 'Mở')}
</div>
`,
};
