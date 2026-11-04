/**
 * Chương 6 · 6.4 — Chẩn đoán lỗi TLS (slug khung netdev-6-4-loi-tls).
 * Output thật: lab/out/c64-*.out.txt (dựng lại: bash lab/code/dung-output-ch6.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-06-4.mjs';

const L = card;
const NGINX = { mon: 'Nginx', khoa: 'nginx' };

export default {
  title: '6.4 — Diagnosing TLS errors|||6.4 — Chẩn đoán lỗi TLS',
  slug: 'netdev-6-4-loi-tls',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mỗi lỗi TLS có một thông điệp chính xác: hết hạn (10), chưa hiệu lực (9 — thường do đồng hồ client sai), sai tên (SAN không khớp), tự ký (18), thiếu trung gian (20); bảng triệu chứng→nguyên nhân→sửa; vì sao “chạy máy này hỏng máy kia” thường là đồng hồ/kho tin cậy/middlebox; Cloudflare Full vs Full (strict); mTLS nhập môn.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Diagnosing TLS errors</h2>
<p class="lead">A TLS failure looks scary — a browser full-page warning, a <code>handshake failed</code>, a build that will not talk to an API — but it is almost never mysterious. The TLS library ran a short list of checks and one of them failed, and it tells you exactly which. The skill is to <em>read the message</em> instead of guessing: expired, wrong name, self-signed, not-yet-valid, missing intermediate each have one unmistakable cause and one fix. This lesson reproduces each in the lab, builds a table you can keep, and explains the confusing case where the same site works on your machine and fails on someone else’s.</p>

<h3>Expired, and not yet valid — same check, two causes</h3>
<p>The validity window (<code>notBefore</code> … <code>notAfter</code>, lesson 6.3) produces two different errors:</p>
${run('c64-expired', 'curl', 1)}
${run('c64-notyet', 'curl', 1)}
<ul>
<li><code>certificate has expired (10)</code> — <code>notAfter</code> is in the past. A renewal failed, or nobody set up auto-renew. This is the <strong>number-one HTTPS outage</strong>, and it is entirely preventable with monitoring that alerts days before expiry.</li>
<li><code>certificate is not yet valid (9)</code> — <code>notBefore</code> is in the future. The certificate is almost certainly fine; <strong>your machine’s clock is wrong</strong> (a server with a dead battery, a container with no NTP, a phone set to the wrong date). The fix is the <em>clock</em>, not the certificate.</li>
</ul>
${net('waterfall', 'cold', 'en', 'A TLS error aborts the connection during the TLS phase, before any HTTP — see where in the waterfall it dies.', { tour: 'waterfall-phases' })}

<h3>Wrong name, and self-signed</h3>
${run('c64-name', 'curl', 1)}
${run('c64-selfsigned', 'curl', 1)}
<ul>
<li><code>no alternative certificate subject name matches target hostname</code> — the certificate’s <strong>SAN</strong> does not list the host you asked for. Causes: the wrong virtual host answered, the wrong certificate is installed, or you connected to a bare IP (which no public certificate covers). The fix is a certificate whose SAN includes the hostname — or fixing which vhost/cert is served.</li>
<li><code>self-signed certificate (18)</code> — the chain ends at a certificate that signed itself, with no trusted root. Causes: a development certificate shipped to production, a private CA not added to the client, or — importantly — a <strong>proxy intercepting your TLS</strong> and re-signing it with its own root.</li>
</ul>

<h3>The diagnosis table (keep this)</h3>
<table>
<tr><th>curl says</th><th>Cause</th><th>Fix</th></tr>
<tr><td><code>certificate has expired (10)</code></td><td>renewal failed</td><td>renew now; fix auto-renew + alert before expiry</td></tr>
<tr><td><code>not yet valid (9)</code></td><td><strong>the client’s clock is wrong</strong></td><td>fix the machine’s time (NTP)</td></tr>
<tr><td><code>subject name does not match</code></td><td>SAN is missing the host</td><td>issue a cert with the right SAN; fix the vhost</td></tr>
<tr><td><code>self-signed certificate (18)</code></td><td>no trusted root in the chain</td><td>use a real CA; or add the root deliberately (dev)</td></tr>
<tr><td><code>unable to get local issuer (20)</code></td><td>missing intermediate (6.3)</td><td>serve the full chain</td></tr>
</table>
<p>The exact <code>curl: (NN)</code> number and text <em>is</em> the diagnosis. In a browser, click the warning for the same information; in Java it is <code>PKIX path building failed</code> / <code>CertificateExpiredException</code>; in Go it is <code>x509: certificate … </code>. Read it first.</p>

<h3>“It works on my machine but not on theirs”</h3>
<p>TLS verification depends on three things that <strong>differ per machine</strong>, which is why the same server can pass for you and fail for someone else:</p>
<ul>
<li>The <strong>clock</strong>. If it fails on one machine only, suspect its time (not-yet-valid, or a cert that looks expired on a fast clock).</li>
<li>The <strong>trust store</strong>. Old devices and some runtimes have an outdated list of roots; a newer CA (or a missing intermediate, lesson 6.3) fails there but not in an up-to-date Chrome.</li>
<li>A <strong>middlebox</strong>. A corporate proxy or antivirus that inspects HTTPS re-signs every certificate with <em>its own</em> root (installed on company laptops). To a machine without that root — your CI runner, a personal phone — every site looks <code>self-signed</code>.</li>
</ul>
<p>Check clock, trust store and middlebox before concluding the server is broken.</p>

<div class="pitfall co-tieu-de">
<p><strong>Do not “fix” TLS errors with <code>-k</code> / <code>verify=False</code>.</strong> Disabling certificate verification makes the error vanish and the security with it — you are now vulnerable to exactly the man-in-the-middle TLS exists to stop, and the real problem (expired cert, wrong SAN, missing intermediate) is still there, waiting to bite in production. Fix the cause: renew, correct the SAN, serve the full chain, fix the clock, or deliberately add the right root. <code>-k</code> is for throwaway debugging only, never for code that ships.</p>
</div>

<h3>Encrypted is not the same as verified: Cloudflare Full vs Full (strict)</h3>
<p>Behind a CDN there are <em>two</em> TLS hops — browser→Cloudflare and Cloudflare→your origin — and they are configured separately. Cloudflare’s origin modes make the difference concrete:</p>
<table>
<tr><th>Mode</th><th>Cloudflare → origin</th><th>Risk</th></tr>
<tr><td><strong>Flexible</strong></td><td>plain HTTP (not encrypted!)</td><td>origin traffic in cleartext — never use</td></tr>
<tr><td><strong>Full</strong></td><td>HTTPS, certificate <strong>not verified</strong></td><td>encrypted, but a MITM to the origin is undetected</td></tr>
<tr><td><strong>Full (strict)</strong></td><td>HTTPS, certificate <strong>verified</strong></td><td>the correct setting</td></tr>
</table>
<p>The green padlock in the browser only covers the <em>first</em> hop. “Full” encrypts the second hop but accepts <em>any</em> certificate, including a self-signed one — so an attacker between Cloudflare and your origin could impersonate the origin undetected. <strong>Full (strict)</strong> is the only mode that both encrypts and <em>verifies</em>. “Encrypted” and “authenticated” are two different guarantees (lesson 6.1), and this setting is where developers most often conflate them.</p>

<h3>mTLS in one minute</h3>
<p>In normal TLS, only the <strong>server</strong> presents a certificate; the client is anonymous and proves who it is some other way (a password, a token). In <strong>mutual TLS (mTLS)</strong>, the <strong>client also presents a certificate</strong>, so the server knows, cryptographically, who is calling — before any request is processed. It is common for <strong>service-to-service</strong> authentication inside a cluster, zero-trust networks, and some high-security APIs. A client that presents no certificate, or an invalid one, is rejected at the TLS handshake. If you ever see a request fail with no HTTP response at all and a TLS error on a service that “requires a client cert”, that is mTLS rejecting you before the request layer. Nginx’s side of all this (the <code>ssl_</code> directives, client-cert verification) is configuration; here we have seen what those settings produce on the wire.</p>
${cauNoi('en', { ...NGINX, bai: 'nginx-6-2-giao-thuc-va-bo-ma', so: '6.2', ten: 'Which protocol and cipher actually get used', giong: 'TLS versions, ciphers and the errors a bad TLS config produces', khac: 'the nginx course sets ssl_protocols, ssl_ciphers and client-cert verification in nginx', them: 'reading the exact curl error for expired/wrong-name/self-signed/not-yet-valid, the per-machine causes (clock, trust store, middlebox), Cloudflare Full vs Full (strict), and mTLS' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a cron job that posts to a partner’s HTTPS API started failing overnight with an SSL error, but the API is up and your browser opens it fine. Diagnose it methodically.</p>
<ol>
<li>In the lab, serve each broken certificate in turn (expired, wrong-name, self-signed, not-yet-valid) and run <code>curl -sS ...</code> against each. Record the exact <code>curl: (NN)</code> message for all four.</li>
<li>For each, write the one-line cause and fix from the table.</li>
<li>Explain why the cron job can fail while the browser works: name the three per-machine factors and how you would check each (the job’s clock, its trust store / CA bundle, any proxy it goes through).</li>
<li>State why reaching for <code>-k</code> would be the wrong fix.</li>
</ol>
<p><strong>Done when:</strong> you have the four exact error strings with their fixes, and your explanation correctly attributes a browser-works/cron-fails split to clock, trust store, or a middlebox — not to the server.</p>
<details><summary>Solution</summary>
<p>The four errors: <code>certificate has expired (10)</code>, <code>no alternative certificate subject name matches</code>, <code>self-signed certificate (18)</code>, <code>certificate is not yet valid (9)</code>. Fixes: renew; fix the SAN/vhost; use a trusted CA (or add the root); fix the clock. The cron job can fail while the browser works because its machine may have a wrong clock, an older CA bundle (missing a new root/intermediate), or a proxy re-signing TLS — all per-machine. <code>-k</code> would hide the real cause and remove the authentication guarantee, so the job would “work” while being open to a man-in-the-middle.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['certificate has expired (hết hạn, mã 10)', 'notAfter is in the past; renewal failed — the top HTTPS outage.'],
  ['not yet valid (chưa hiệu lực, mã 9)', 'notBefore is in the future; usually the client’s clock is wrong.'],
  ['name mismatch (sai tên)', 'The certificate’s SAN does not include the requested hostname.'],
  ['self-signed (tự ký, mã 18)', 'The chain ends with no trusted root — a dev cert or an intercepting proxy.'],
  ['trust store (kho tin cậy)', 'The OS/runtime list of trusted roots; differs by platform and age.'],
  ['Full (strict) (Cloudflare)', 'The origin mode that both encrypts and verifies — encrypted ≠ verified.'],
  ['mTLS (TLS hai chiều)', 'Mutual TLS: the client also presents a certificate, for service-to-service auth.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Each TLS failure has one exact message: expired (10), not yet valid (9), name mismatch, self-signed (18), missing intermediate (20).</li>
<li>“Not yet valid” usually means the client’s clock is wrong, not the certificate.</li>
<li>“Works here, fails there” comes down to the clock, the trust store, or a middlebox — check those three.</li>
<li>Cloudflare Full (strict) is the only origin mode that encrypts <em>and</em> verifies; “encrypted” ≠ “authenticated”.</li>
<li>mTLS adds a client certificate for service-to-service auth; never silence TLS errors with <code>-k</code>.</li>
</ul>
${L('https://curl.se/docs/sslcerts.html', '📘', 'curl — SSL certificate verification', 'What each curl TLS error means and how to fix it properly.', 'Open')}
${L('https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/', '📘', 'Cloudflare — SSL/TLS encryption modes', 'Flexible, Full and Full (strict) between Cloudflare and your origin.', 'Open')}
${L('https://smallstep.com/hello-mtls/', '🔐', 'Hello mTLS', 'Mutual TLS explained for developers, with diagrams.', 'Open')}
${L('https://badssl.com/', '🧪', 'badssl.com', 'A playground of deliberately broken TLS configurations to test clients against.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Chẩn đoán lỗi TLS</h2>
<p class="lead">Một lỗi TLS nhìn đáng sợ — một cảnh báo trang kín của trình duyệt, một <code>handshake failed</code>, một bản build không chịu nói chuyện với một API — nhưng nó gần như không bao giờ bí ẩn. Thư viện TLS chạy một danh sách ngắn các phép kiểm và một cái trong đó hỏng, và nó cho bạn biết chính xác cái nào. Kỹ năng là <em>đọc thông điệp</em> thay vì đoán: hết hạn, sai tên, tự ký, chưa hiệu lực, thiếu trung gian mỗi cái có một nguyên nhân không thể nhầm và một cách sửa. Bài này dựng lại từng cái trong lab, xây một bảng bạn giữ được, và giải thích trường hợp khó hiểu khi cùng một site chạy trên máy bạn và hỏng trên máy người khác.</p>

<h3>Hết hạn, và chưa hiệu lực — cùng phép kiểm, hai nguyên nhân</h3>
<p>Cửa sổ hiệu lực (<code>notBefore</code> … <code>notAfter</code>, bài 6.3) sinh ra hai lỗi khác nhau:</p>
${run('c64-expired', 'curl', 1)}
${run('c64-notyet', 'curl', 1)}
<ul>
<li><code>certificate has expired (10)</code> — <code>notAfter</code> ở quá khứ. Một lần gia hạn hỏng, hoặc không ai dựng tự gia hạn. Đây là <strong>sự cố HTTPS số một</strong>, và hoàn toàn ngăn được bằng giám sát cảnh báo trước hạn vài ngày.</li>
<li><code>certificate is not yet valid (9)</code> — <code>notBefore</code> ở tương lai. Chứng chỉ gần như chắc chắn ổn; <strong>đồng hồ máy của bạn sai</strong> (một máy chủ pin chết, một container không NTP, một điện thoại đặt sai ngày). Cách sửa là <em>đồng hồ</em>, không phải chứng chỉ.</li>
</ul>
${net('waterfall', 'cold', 'vi', 'Một lỗi TLS cắt kết nối trong pha TLS, trước mọi HTTP — xem nó chết ở đâu trong biểu đồ.', { tour: 'waterfall-phases' })}

<h3>Sai tên, và tự ký</h3>
${run('c64-name', 'curl', 1)}
${run('c64-selfsigned', 'curl', 1)}
<ul>
<li><code>no alternative certificate subject name matches target hostname</code> — <strong>SAN</strong> của chứng chỉ không liệt kê host bạn hỏi. Nguyên nhân: sai virtual host trả lời, sai chứng chỉ được cài, hoặc bạn kết nối tới một IP trần (không chứng chỉ công khai nào bao). Cách sửa là một chứng chỉ có SAN gồm tên máy chủ — hoặc sửa vhost/cert nào được phục vụ.</li>
<li><code>self-signed certificate (18)</code> — chuỗi kết thúc ở một chứng chỉ tự ký, không gốc tin cậy. Nguyên nhân: một chứng chỉ phát triển đưa lên sản xuất, một CA riêng không thêm vào client, hoặc — quan trọng — một <strong>proxy chặn TLS của bạn</strong> và ký lại bằng gốc của nó.</li>
</ul>

<h3>Bảng chẩn đoán (giữ cái này)</h3>
<table>
<tr><th>curl nói</th><th>Nguyên nhân</th><th>Sửa</th></tr>
<tr><td><code>certificate has expired (10)</code></td><td>gia hạn hỏng</td><td>gia hạn ngay; sửa tự gia hạn + cảnh báo trước hạn</td></tr>
<tr><td><code>not yet valid (9)</code></td><td><strong>đồng hồ client sai</strong></td><td>sửa giờ máy (NTP)</td></tr>
<tr><td><code>subject name does not match</code></td><td>SAN thiếu host</td><td>cấp cert với SAN đúng; sửa vhost</td></tr>
<tr><td><code>self-signed certificate (18)</code></td><td>không gốc tin cậy trong chuỗi</td><td>dùng CA thật; hoặc thêm gốc có chủ ý (dev)</td></tr>
<tr><td><code>unable to get local issuer (20)</code></td><td>thiếu trung gian (6.3)</td><td>phục vụ chuỗi đầy đủ</td></tr>
</table>
<p>Số <code>curl: (NN)</code> và chữ chính xác <em>là</em> chẩn đoán. Trong trình duyệt, bấm cảnh báo để có cùng thông tin; trong Java là <code>PKIX path building failed</code> / <code>CertificateExpiredException</code>; trong Go là <code>x509: certificate … </code>. Đọc nó trước.</p>

<h3>“Chạy máy mình mà không chạy máy họ”</h3>
<p>Kiểm TLS phụ thuộc ba thứ <strong>khác nhau theo máy</strong>, đó là lý do cùng một máy chủ có thể qua với bạn và hỏng với người khác:</p>
<ul>
<li><strong>Đồng hồ</strong>. Nếu hỏng chỉ trên một máy, nghi giờ của nó (chưa hiệu lực, hoặc một cert nhìn hết hạn trên một đồng hồ chạy nhanh).</li>
<li><strong>Kho tin cậy</strong>. Thiết bị cũ và một số runtime có danh sách gốc lỗi thời; một CA mới hơn (hoặc một trung gian thiếu, bài 6.3) hỏng ở đó nhưng không trong một Chrome cập nhật.</li>
<li>Một <strong>middlebox</strong>. Một proxy công ty hay antivirus soi HTTPS ký lại mọi chứng chỉ bằng gốc <em>của nó</em> (cài trên laptop công ty). Với một máy không có gốc đó — runner CI của bạn, một điện thoại cá nhân — mọi site nhìn như <code>self-signed</code>.</li>
</ul>
<p>Kiểm đồng hồ, kho tin cậy và middlebox trước khi kết luận máy chủ hỏng.</p>

<div class="pitfall co-tieu-de">
<p><strong>Đừng “sửa” lỗi TLS bằng <code>-k</code> / <code>verify=False</code>.</strong> Tắt kiểm chứng chỉ làm lỗi biến mất và bảo mật cùng nó — giờ bạn dễ bị chính cuộc tấn công đứng giữa mà TLS sinh ra để chặn, và vấn đề thật (cert hết hạn, SAN sai, thiếu trung gian) vẫn ở đó, chờ cắn trong sản xuất. Sửa nguyên nhân: gia hạn, sửa SAN, phục vụ chuỗi đầy đủ, sửa đồng hồ, hoặc thêm đúng gốc có chủ ý. <code>-k</code> chỉ để gỡ lỗi vứt đi, không bao giờ cho code lên production.</p>
</div>

<h3>Mã hoá không phải là đã kiểm: Cloudflare Full vs Full (strict)</h3>
<p>Sau một CDN có <em>hai</em> chặng TLS — trình duyệt→Cloudflare và Cloudflare→origin của bạn — và chúng được cấu hình riêng. Các chế độ origin của Cloudflare làm khác biệt rõ ràng:</p>
<table>
<tr><th>Chế độ</th><th>Cloudflare → origin</th><th>Rủi ro</th></tr>
<tr><td><strong>Flexible</strong></td><td>HTTP thường (không mã hoá!)</td><td>lưu lượng origin dạng chữ — không bao giờ dùng</td></tr>
<tr><td><strong>Full</strong></td><td>HTTPS, chứng chỉ <strong>không kiểm</strong></td><td>mã hoá, nhưng một MITM tới origin không bị phát hiện</td></tr>
<tr><td><strong>Full (strict)</strong></td><td>HTTPS, chứng chỉ <strong>được kiểm</strong></td><td>thiết lập đúng</td></tr>
</table>
<p>Ổ khoá xanh trong trình duyệt chỉ bao chặng <em>đầu</em>. “Full” mã hoá chặng hai nhưng chấp nhận <em>bất kỳ</em> chứng chỉ, kể cả một cái tự ký — nên một kẻ tấn công giữa Cloudflare và origin của bạn có thể giả làm origin mà không bị phát hiện. <strong>Full (strict)</strong> là chế độ duy nhất vừa mã hoá vừa <em>kiểm</em>. “Mã hoá” và “đã xác thực” là hai bảo đảm khác nhau (bài 6.1), và thiết lập này là nơi lập trình viên hay lẫn chúng nhất.</p>

<h3>mTLS trong một phút</h3>
<p>Trong TLS thường, chỉ <strong>máy chủ</strong> trình một chứng chỉ; client ẩn danh và chứng minh mình bằng cách khác (một mật khẩu, một token). Trong <strong>TLS hai chiều (mTLS)</strong>, <strong>client cũng trình một chứng chỉ</strong>, nên máy chủ biết, bằng mật mã, ai đang gọi — trước khi xử lý yêu cầu nào. Nó phổ biến cho xác thực <strong>dịch vụ-tới-dịch vụ</strong> trong một cụm, mạng zero-trust, và một số API bảo mật cao. Một client không trình chứng chỉ, hoặc một cái không hợp lệ, bị từ chối ở cú bắt tay TLS. Nếu bạn từng thấy một yêu cầu hỏng không có câu trả lời HTTP nào và một lỗi TLS trên một dịch vụ “yêu cầu chứng chỉ client”, đó là mTLS từ chối bạn trước tầng yêu cầu. Phía nginx của tất cả cái này (các chỉ thị <code>ssl_</code>, kiểm chứng chỉ client) là cấu hình; ở đây ta đã thấy các thiết lập đó sinh ra gì trên dây.</p>
${cauNoi('vi', { ...NGINX, bai: 'nginx-6-2-giao-thuc-va-bo-ma', so: '6.2', ten: 'Rốt cuộc giao thức nào và bộ mã nào được dùng', giong: 'các phiên bản TLS, bộ mã và các lỗi một cấu hình TLS tồi sinh ra', khac: 'khoá nginx đặt ssl_protocols, ssl_ciphers và kiểm chứng chỉ client trong nginx', them: 'đọc lỗi curl chính xác cho hết hạn/sai tên/tự ký/chưa hiệu lực, các nguyên nhân theo máy (đồng hồ, kho tin cậy, middlebox), Cloudflare Full vs Full (strict), và mTLS' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một việc cron đăng lên API HTTPS của đối tác bắt đầu hỏng qua đêm với một lỗi SSL, nhưng API vẫn chạy và trình duyệt của bạn mở nó tốt. Chẩn đoán có phương pháp.</p>
<ol>
<li>Trong lab, phục vụ lần lượt từng chứng chỉ hỏng (hết hạn, sai tên, tự ký, chưa hiệu lực) và chạy <code>curl -sS ...</code> với mỗi cái. Ghi đúng thông điệp <code>curl: (NN)</code> cho cả bốn.</li>
<li>Với mỗi cái, viết nguyên nhân và cách sửa một dòng từ bảng.</li>
<li>Giải thích vì sao việc cron có thể hỏng trong khi trình duyệt chạy: gọi tên ba yếu tố theo máy và cách bạn sẽ kiểm mỗi cái (đồng hồ của việc, kho tin cậy / bó CA của nó, bất kỳ proxy nó đi qua).</li>
<li>Nêu vì sao với lấy <code>-k</code> sẽ là cách sửa sai.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bốn chuỗi lỗi chính xác cùng cách sửa, và lời giải thích gán đúng việc trình-duyệt-chạy/cron-hỏng cho đồng hồ, kho tin cậy, hoặc một middlebox — không phải máy chủ.</p>
<details><summary>Lời giải</summary>
<p>Bốn lỗi: <code>certificate has expired (10)</code>, <code>no alternative certificate subject name matches</code>, <code>self-signed certificate (18)</code>, <code>certificate is not yet valid (9)</code>. Sửa: gia hạn; sửa SAN/vhost; dùng một CA tin cậy (hoặc thêm gốc); sửa đồng hồ. Việc cron có thể hỏng trong khi trình duyệt chạy vì máy của nó có thể có đồng hồ sai, một bó CA cũ hơn (thiếu một gốc/trung gian mới), hoặc một proxy ký lại TLS — tất cả theo máy. <code>-k</code> sẽ giấu nguyên nhân thật và bỏ bảo đảm xác thực, nên việc sẽ “chạy” trong khi mở cho một kẻ đứng giữa.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['certificate has expired (hết hạn, mã 10)', 'notAfter ở quá khứ; gia hạn hỏng — sự cố HTTPS hàng đầu.'],
  ['not yet valid (chưa hiệu lực, mã 9)', 'notBefore ở tương lai; thường là đồng hồ client sai.'],
  ['name mismatch (sai tên)', 'SAN của chứng chỉ không gồm tên máy chủ được hỏi.'],
  ['self-signed (tự ký, mã 18)', 'Chuỗi kết thúc không gốc tin cậy — một cert dev hoặc một proxy chặn.'],
  ['trust store (kho tin cậy)', 'Danh sách gốc tin cậy của OS/runtime; khác theo nền tảng và tuổi.'],
  ['Full (strict) (Cloudflare)', 'Chế độ origin vừa mã hoá vừa kiểm — mã hoá ≠ đã kiểm.'],
  ['mTLS (TLS hai chiều)', 'Mutual TLS: client cũng trình một chứng chỉ, cho xác thực dịch vụ-tới-dịch vụ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi lỗi TLS có một thông điệp chính xác: hết hạn (10), chưa hiệu lực (9), sai tên, tự ký (18), thiếu trung gian (20).</li>
<li>“Chưa hiệu lực” thường nghĩa là đồng hồ client sai, không phải chứng chỉ.</li>
<li>“Chạy đây, hỏng đó” quy về đồng hồ, kho tin cậy, hoặc một middlebox — kiểm ba cái đó.</li>
<li>Cloudflare Full (strict) là chế độ origin duy nhất vừa mã hoá vừa kiểm; “mã hoá” ≠ “đã xác thực”.</li>
<li>mTLS thêm một chứng chỉ client cho xác thực dịch vụ-tới-dịch vụ; đừng bao giờ dập lỗi TLS bằng <code>-k</code>.</li>
</ul>
${L('https://curl.se/docs/sslcerts.html', '📘', 'curl — Kiểm chứng chỉ SSL', 'Mỗi lỗi TLS của curl nghĩa là gì và sửa đúng cách ra sao.', 'Mở')}
${L('https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/', '📘', 'Cloudflare — Chế độ mã hoá SSL/TLS', 'Flexible, Full và Full (strict) giữa Cloudflare và origin của bạn.', 'Mở')}
${L('https://smallstep.com/hello-mtls/', '🔐', 'Hello mTLS', 'TLS hai chiều giải thích cho lập trình viên, kèm sơ đồ.', 'Mở')}
${L('https://badssl.com/', '🧪', 'badssl.com', 'Một sân chơi các cấu hình TLS cố ý hỏng để thử client.', 'Mở')}
</div>
`,
};
