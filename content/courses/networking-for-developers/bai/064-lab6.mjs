/**
 * Chương 6 · Lab 6 — Siết HTTPS của LabFlow (phần 6 dự án xuyên khoá). Lab cơ bản + mini CA + nginx HTTPS.
 * Lời giải dùng output thật: lab/out/c61-*, c62-*, c63-*, c64-*.out.txt.
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-lab-6.mjs';

const L = card;
const PHIEU = `# Lab 6 report — <your name>, <date>

## R1 Guarantees    — verify 0, TLS 1.3, cipher; SNI cleartext (from the capture)
## R2 Chain         — leaf (i: Intermediate), intermediate (i: Root), root NOT sent
## R3 Decrypt       — app-data encrypted vs GET/200 with the key log
## R4 Four errors   — message + code + fix for each (expired/wrong-name/self-signed/not-yet-valid)
## R5 Incident      — the error, why browser ≠ curl (AIA), the fix
## R6 Recommendation — fullchain, auto-renew + alerting, Full (strict), CT monitoring`;

export default {
  title: 'Lab 6 — Hardening LabFlow’s HTTPS: prove it, read the chain, decrypt it, diagnose it|||Lab 6 — Siết HTTPS của LabFlow: chứng minh, đọc chuỗi, giải mã, chẩn đoán',
  slug: 'netdev-6-5-lab-tls-labflow',
  type: 'LESSON',
  isFreePreview: true,
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab 6 · Course project part 6</span>
<h2>Lab 6 — Hardening LabFlow’s HTTPS</h2>
<p class="lead">Three jobs have landed at once. An audit wants proof that LabFlow’s HTTPS is correctly configured — a real chain, strong TLS, a verified origin — not just a green padlock. A partner integration started failing overnight with an SSL error while your own browser opens the site fine, and someone needs to find out why. And an API is returning a wrong header over HTTPS that you cannot see because it is encrypted. This lab does all three with measurements, using a mini certificate authority and an nginx HTTPS server whose certificate you can swap to reproduce real failures. Everything is in Chapter 6.</p>

<h3>What you get</h3>
<ul>
<li>A mini CA — root → intermediate → leaf — plus broken certificates (leaf-only, expired, wrong-name, self-signed, not-yet-valid).</li>
<li>An nginx HTTPS server on <code>8443</code> you can reconfigure to serve any of them.</li>
<li>The tools: <code>openssl s_client</code>, <code>tshark</code> + <code>SSLKEYLOGFILE</code>, <code>curl</code>, <code>tcpdump</code>.</li>
</ul>

<h3>Requirements</h3>
<ol>
<li><strong>R1 Prove the guarantees.</strong> Run <code>openssl s_client</code> against the HTTPS server and point out the three guarantees (verify code, protocol, cipher). Capture the handshake and find the SNI in cleartext.</li>
<li><strong>R2 The chain.</strong> With the full-chain config, show the server sends the leaf <em>and</em> the intermediate (and not the root). Explain each link (who signs whom).</li>
<li><strong>R3 Decrypt your own TLS.</strong> Capture one request with <code>SSLKEYLOGFILE</code> set, then read it twice: as encrypted application data, and decrypted to <code>GET /</code> + <code>200 OK</code>.</li>
<li><strong>R4 Diagnose four errors.</strong> Serve each broken certificate (expired, wrong-name, self-signed, not-yet-valid) and record the exact <code>curl: (NN)</code> message and the fix for each.</li>
<li><strong>R5 The incident.</strong> Reproduce the partner failure: serve the leaf only, and explain why curl fails with <code>unable to get local issuer</code> while a browser would have worked (AIA).</li>
<li><strong>R6 Recommendation.</strong> Write the hardening list — full chain, auto-renew + alerting, Cloudflare Full (strict), CT monitoring — each justified by what you measured.</li>
</ol>

<h3>Report template</h3>
${code(PHIEU, 'markdown')}

<h3>Rubric — 10 points</h3>
<table>
<tr><th>Item</th><th>Pts</th><th>Full marks when</th></tr>
<tr><td>R1</td><td>1.5</td><td>the three guarantees shown from <code>openssl</code>; SNI cleartext in the capture</td></tr>
<tr><td>R2</td><td>1.5</td><td>two-cert chain read (s:/i:); root correctly absent; each link explained</td></tr>
<tr><td>R3</td><td>2</td><td>same bytes shown encrypted and decrypted to GET/200 via the key log</td></tr>
<tr><td>R4</td><td>2</td><td>all four exact messages with correct cause + fix</td></tr>
<tr><td>R5</td><td>2</td><td>missing-intermediate reproduced; AIA / browser-vs-curl difference explained</td></tr>
<tr><td>R6</td><td>1</td><td>a defensible hardening list, each item tied to something measured</td></tr>
</table>

<h3>Hints by level</h3>
<details><summary>Hints</summary>
<ul>
<li>R1: <code>openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile /tmp/root.crt</code>; capture with <code>tcpdump</code> and read the SNI with <code>tshark -Y 'tls.handshake.type==1'</code>.</li>
<li>R2: <code>openssl s_client … -showcerts | grep ' [si]:'</code> — read s (subject) and i (issuer) top to bottom.</li>
<li>R3: <code>SSLKEYLOGFILE=/tmp/keys.log curl -k --resolve labflow.test:8443:10.10.2.10 https://labflow.test:8443/</code>, then <code>tshark -o tls.keylog_file:/tmp/keys.log -Y 'http.request || http.response'</code>.</li>
<li>R4/R5: reload nginx pointing at <code>expired-chain.crt</code> / <code>wrong-chain.crt</code> / <code>selfsigned.crt</code> / <code>notyet-chain.crt</code> / <code>leaf.crt</code>, then <code>curl -sS … --cacert /tmp/root.crt</code>.</li>
</ul>
</details>

<h3>Solution (real output)</h3>
<p><strong>R1</strong> — the three guarantees, proven. Verify code 0 (authentication), TLS 1.3 + cipher (confidentiality + integrity), ALPN h2:</p>
${run('c61-version', 'echo | openssl', 1)}
<p>…and the SNI is cleartext on the wire — HTTPS hides the body, not the domain:</p>
${run('c61-wire', 'tshark', 2)}
<p><strong>R2</strong> — a correct chain: leaf (issued by Intermediate), intermediate (issued by Root), root not sent because the client already trusts it:</p>
${run('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -E', 1, { cut: 74 })}
<p><strong>R3</strong> — decrypt your own TLS. Encrypted, then readable, from the same capture plus the key log:</p>
${run('c62-decrypt', 'tshark', 1, { lan: 2 })}
<p><strong>R4</strong> — four certificate errors, each unmistakable:</p>
${run('c64-expired', 'curl', 1)}
${run('c64-name', 'curl', 1)}
${run('c64-selfsigned', 'curl', 1)}
${run('c64-notyet', 'curl', 1)}
<p>Fixes: renew (and fix auto-renew + alerting); issue a cert with the right SAN / fix the vhost; use a trusted CA or add the root; fix the machine’s clock.</p>
<p><strong>R5</strong> — the incident: the server sends the leaf only, so curl cannot bridge to the root; with the intermediate it works. A browser would have fetched the intermediate via AIA and hidden the bug:</p>
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/root.crt https', 1)}
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/bundle.crt', 1)}
<p><strong>R6</strong> — a defensible hardening recommendation:</p>
<ul>
<li><strong>Serve the full chain</strong> (leaf + intermediate). The partner failure (R5) was a missing intermediate; browsers hid it via AIA, but curl/Java/old clients and our monitoring did not.</li>
<li><strong>Automate renewal and alert before expiry.</strong> Expiry (R4) is the top HTTPS outage and is fully preventable; alert ~20 days out.</li>
<li><strong>Use Cloudflare Full (strict)</strong> for the origin hop — encrypted <em>and</em> verified, not just encrypted (lesson 6.4).</li>
<li><strong>Monitor Certificate Transparency</strong> (<code>crt.sh</code>) for certificates naming our domains, to catch mis-issuance early.</li>
<li><strong>Never ship <code>-k</code>/disabled verification</strong>; fix the cause instead.</li>
</ul>

<h3>Going further</h3>
<ul>
<li>Script a checker that fails unless <code>Verify return code: 0</code>, the full chain is present, and there are ≥ 20 days to expiry.</li>
<li>Enable client-certificate verification in nginx (<code>ssl_verify_client</code>) and watch a client with no certificate be rejected at the handshake — that is mTLS (lesson 6.4).</li>
<li><strong>Course project:</strong> this HTTPS hop returns in the Chapter 13 whole-path capstone — keep your R6 checker and the chain you verified.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab 6 · Dự án xuyên khoá phần 6</span>
<h2>Lab 6 — Siết HTTPS của LabFlow</h2>
<p class="lead">Ba việc tới cùng lúc. Một cuộc kiểm toán muốn bằng chứng rằng HTTPS của LabFlow cấu hình đúng — một chuỗi thật, TLS mạnh, một origin được kiểm — không chỉ một ổ khoá xanh. Một tích hợp đối tác bắt đầu hỏng qua đêm với một lỗi SSL trong khi trình duyệt của chính bạn mở site tốt, và ai đó cần tìm vì sao. Và một API đang trả về một header sai qua HTTPS mà bạn không thấy được vì nó mã hoá. Lab này làm cả ba bằng phép đo, dùng một nhà cấp chứng chỉ tí hon và một máy chủ HTTPS nginx mà bạn tráo chứng chỉ để dựng lại các lỗi thật. Mọi thứ đều có trong Chương 6.</p>

<h3>Bạn được gì</h3>
<ul>
<li>Một mini CA — gốc → trung gian → lá — cộng các chứng chỉ hỏng (chỉ-lá, hết hạn, sai-tên, tự-ký, chưa-hiệu-lực).</li>
<li>Một máy chủ HTTPS nginx trên <code>8443</code> bạn cấu hình lại để phục vụ bất kỳ cái nào.</li>
<li>Bộ công cụ: <code>openssl s_client</code>, <code>tshark</code> + <code>SSLKEYLOGFILE</code>, <code>curl</code>, <code>tcpdump</code>.</li>
</ul>

<h3>Yêu cầu</h3>
<ol>
<li><strong>R1 Chứng minh các bảo đảm.</strong> Chạy <code>openssl s_client</code> với máy chủ HTTPS và chỉ ra ba bảo đảm (verify code, protocol, cipher). Bắt cú bắt tay và tìm SNI dạng chữ.</li>
<li><strong>R2 Chuỗi.</strong> Với cấu hình full-chain, cho thấy máy chủ gửi lá <em>và</em> trung gian (và không gốc). Giải thích mỗi mắt xích (ai ký cho ai).</li>
<li><strong>R3 Giải mã TLS của chính bạn.</strong> Bắt một yêu cầu với <code>SSLKEYLOGFILE</code> đặt, rồi đọc nó hai lần: dưới dạng dữ liệu ứng dụng mã hoá, và giải mã thành <code>GET /</code> + <code>200 OK</code>.</li>
<li><strong>R4 Chẩn đoán bốn lỗi.</strong> Phục vụ từng chứng chỉ hỏng (hết hạn, sai-tên, tự-ký, chưa-hiệu-lực) và ghi đúng thông điệp <code>curl: (NN)</code> cùng cách sửa cho mỗi cái.</li>
<li><strong>R5 Sự cố.</strong> Dựng lại lỗi đối tác: phục vụ chỉ lá, và giải thích vì sao curl hỏng với <code>unable to get local issuer</code> trong khi một trình duyệt sẽ chạy (AIA).</li>
<li><strong>R6 Khuyến nghị.</strong> Viết danh sách siết an toàn — chuỗi đầy đủ, tự gia hạn + cảnh báo, Cloudflare Full (strict), giám sát CT — mỗi cái biện minh bằng cái bạn đo được.</li>
</ol>

<h3>Mẫu báo cáo</h3>
${code(PHIEU, 'markdown')}

<h3>Thang điểm — 10 điểm</h3>
<table>
<tr><th>Mục</th><th>Điểm</th><th>Trọn điểm khi</th></tr>
<tr><td>R1</td><td>1.5</td><td>ba bảo đảm hiện từ <code>openssl</code>; SNI dạng chữ trong bản bắt gói</td></tr>
<tr><td>R2</td><td>1.5</td><td>chuỗi hai chứng chỉ đọc (s:/i:); gốc đúng là vắng mặt; mỗi mắt xích giải thích</td></tr>
<tr><td>R3</td><td>2</td><td>cùng các byte cho thấy mã hoá và giải mã thành GET/200 qua bản ghi khoá</td></tr>
<tr><td>R4</td><td>2</td><td>cả bốn thông điệp chính xác với nguyên nhân + sửa đúng</td></tr>
<tr><td>R5</td><td>2</td><td>trung gian thiếu dựng lại; khác biệt AIA / trình-duyệt-với-curl giải thích</td></tr>
<tr><td>R6</td><td>1</td><td>một danh sách siết bảo vệ được, mỗi mục gắn với cái đo được</td></tr>
</table>

<h3>Gợi ý theo bậc</h3>
<details><summary>Gợi ý</summary>
<ul>
<li>R1: <code>openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -CAfile /tmp/root.crt</code>; bắt bằng <code>tcpdump</code> và đọc SNI bằng <code>tshark -Y 'tls.handshake.type==1'</code>.</li>
<li>R2: <code>openssl s_client … -showcerts | grep ' [si]:'</code> — đọc s (chủ thể) và i (nơi cấp) từ trên xuống.</li>
<li>R3: <code>SSLKEYLOGFILE=/tmp/keys.log curl -k --resolve labflow.test:8443:10.10.2.10 https://labflow.test:8443/</code>, rồi <code>tshark -o tls.keylog_file:/tmp/keys.log -Y 'http.request || http.response'</code>.</li>
<li>R4/R5: reload nginx trỏ vào <code>expired-chain.crt</code> / <code>wrong-chain.crt</code> / <code>selfsigned.crt</code> / <code>notyet-chain.crt</code> / <code>leaf.crt</code>, rồi <code>curl -sS … --cacert /tmp/root.crt</code>.</li>
</ul>
</details>

<h3>Lời giải (output thật)</h3>
<p><strong>R1</strong> — ba bảo đảm, chứng minh. Verify code 0 (xác thực), TLS 1.3 + cipher (bí mật + toàn vẹn), ALPN h2:</p>
${run('c61-version', 'echo | openssl', 1)}
<p>…và SNI là chữ trên dây — HTTPS giấu thân, không giấu tên miền:</p>
${run('c61-wire', 'tshark', 2)}
<p><strong>R2</strong> — một chuỗi đúng: lá (cấp bởi Trung gian), trung gian (cấp bởi Gốc), gốc không gửi vì client đã tin nó:</p>
${run('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -E', 1, { cut: 74 })}
<p><strong>R3</strong> — giải mã TLS của chính bạn. Mã hoá, rồi đọc được, từ cùng bản bắt gói cộng bản ghi khoá:</p>
${run('c62-decrypt', 'tshark', 1, { lan: 2 })}
<p><strong>R4</strong> — bốn lỗi chứng chỉ, mỗi cái không thể nhầm:</p>
${run('c64-expired', 'curl', 1)}
${run('c64-name', 'curl', 1)}
${run('c64-selfsigned', 'curl', 1)}
${run('c64-notyet', 'curl', 1)}
<p>Sửa: gia hạn (và sửa tự gia hạn + cảnh báo); cấp cert với SAN đúng / sửa vhost; dùng một CA tin cậy hoặc thêm gốc; sửa đồng hồ máy.</p>
<p><strong>R5</strong> — sự cố: máy chủ chỉ gửi lá, nên curl không bắc cầu tới gốc được; với trung gian thì chạy. Một trình duyệt sẽ lấy trung gian qua AIA và che lỗi:</p>
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/root.crt https', 1)}
${run('c63-missing', 'curl -sS --resolve labflow.test:8443:10.10.2.10 --cacert /tmp/bundle.crt', 1)}
<p><strong>R6</strong> — một khuyến nghị siết an toàn bảo vệ được:</p>
<ul>
<li><strong>Phục vụ chuỗi đầy đủ</strong> (lá + trung gian). Lỗi đối tác (R5) là một trung gian thiếu; trình duyệt che nó qua AIA, nhưng curl/Java/client cũ và hệ giám sát của ta thì không.</li>
<li><strong>Tự động gia hạn và cảnh báo trước hạn.</strong> Hết hạn (R4) là sự cố HTTPS hàng đầu và hoàn toàn ngăn được; cảnh báo ~20 ngày trước.</li>
<li><strong>Dùng Cloudflare Full (strict)</strong> cho chặng origin — mã hoá <em>và</em> được kiểm, không chỉ mã hoá (bài 6.4).</li>
<li><strong>Giám sát Certificate Transparency</strong> (<code>crt.sh</code>) cho các chứng chỉ gọi tên miền của ta, để bắt cấp nhầm sớm.</li>
<li><strong>Không bao giờ đưa <code>-k</code>/tắt kiểm lên production</strong>; sửa nguyên nhân thay vào.</li>
</ul>

<h3>Đi xa hơn</h3>
<ul>
<li>Viết một bộ kiểm hỏng trừ khi <code>Verify return code: 0</code>, chuỗi đầy đủ có mặt, và còn ≥ 20 ngày tới hạn.</li>
<li>Bật kiểm chứng chỉ client trong nginx (<code>ssl_verify_client</code>) và xem một client không chứng chỉ bị từ chối ở cú bắt tay — đó là mTLS (bài 6.4).</li>
<li><strong>Dự án xuyên khoá:</strong> chặng HTTPS này quay lại trong dự án cuối khoá cả-đường Chương 13 — giữ bộ kiểm R6 và chuỗi bạn đã kiểm.</li>
</ul>
</div>
`,
};
