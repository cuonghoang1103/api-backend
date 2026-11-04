/** Chương 6 · Quiz — 10 câu tình huống, đáp án rải đều (A×2 · B×3 · C×3 · D×2), dữ liệu từ output thật của lab TLS. */
const q = (en, vi) => `${en}|||${vi}`;
const o = (pairs) => pairs.map(([en, vi]) => q(en, vi));
const ex = (en, vi) => `EN: ${en}|||VI: ${vi}`;

export default {
  title: 'Quiz — Chapter 6: TLS and certificates|||Quiz — Chương 6: TLS và chứng chỉ',
  slug: 'netdev-6-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: TLS bảo đảm gì, SNI dạng chữ, bắt tay 1-RTT, giải mã bằng SSLKEYLOGFILE, chuỗi chứng chỉ, thiếu trung gian, hết hạn (10) vs chưa hiệu lực (9), sai tên, tự ký, Cloudflare Full vs Full (strict), Heartbleed.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Quiz — TLS and certificates</h2>
<p class="lead">Ten situations from the lab of this chapter. Most can be answered by reading an <code>openssl</code> output or a <code>curl</code> error the way the lessons taught.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can state what TLS guarantees and what it does not.</li>
<li>I can read a TLS 1.3 handshake and say what is cleartext.</li>
<li>I can follow a certificate chain and spot a missing intermediate.</li>
<li>I can diagnose expired, wrong-name, self-signed and not-yet-valid from the exact error.</li>
<li>I can explain Cloudflare Full vs Full (strict) and mTLS.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Quiz</span>
<h2>Quiz — TLS và chứng chỉ</h2>
<p class="lead">Mười tình huống từ phòng lab của chương. Phần lớn trả lời được bằng cách đọc một output <code>openssl</code> hay một lỗi <code>curl</code> theo đúng cách các bài đã dạy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được TLS bảo đảm gì và không.</li>
<li>Tôi đọc được một cú bắt tay TLS 1.3 và nói cái gì là chữ.</li>
<li>Tôi lần được một chuỗi chứng chỉ và nhận ra một trung gian thiếu.</li>
<li>Tôi chẩn đoán được hết hạn, sai tên, tự ký và chưa hiệu lực từ lỗi chính xác.</li>
<li>Tôi giải thích được Cloudflare Full vs Full (strict) và mTLS.</li>
</ul>
</div>`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: q('Your site is HTTPS. A teammate says “so nobody can see which pages our users visit.” Correct?', 'Site của bạn là HTTPS. Một đồng nghiệp nói “nên không ai thấy người dùng vào trang nào.” Đúng không?'),
        options: o([['Correct — HTTPS hides everything', 'Đúng — HTTPS giấu mọi thứ'], ['Partly — the body is hidden, but the domain (SNI) and destination IP are visible', 'Một phần — thân bị giấu, nhưng tên miền (SNI) và IP đích thì thấy được'], ['Correct — only the IP is visible', 'Đúng — chỉ IP thấy được'], ['Wrong — HTTPS hides nothing', 'Sai — HTTPS không giấu gì']]),
        correctIndex: 1, points: 1,
        explanation: ex('TLS encrypts the content (confidentiality) but the SNI in the ClientHello is cleartext, and so is the destination IP. An observer sees you visited labflow.test — the domain — but not the request or response body. So HTTPS hides the body, not the domain.', 'TLS mã hoá nội dung (bí mật) nhưng SNI trong ClientHello là chữ, và IP đích cũng vậy. Người quan sát thấy bạn vào labflow.test — tên miền — nhưng không thấy thân yêu cầu hay câu trả lời. Nên HTTPS giấu thân, không giấu tên miền.'),
      },
      {
        question: q('<code>openssl s_client</code> prints <code>Verify return code: 0 (ok)</code>, <code>TLSv1.3</code>, a cipher, and <code>ALPN protocol: h2</code>. Which guarantee does the <code>Verify</code> line prove?', '<code>openssl s_client</code> in <code>Verify return code: 0 (ok)</code>, <code>TLSv1.3</code>, một cipher, và <code>ALPN protocol: h2</code>. Dòng <code>Verify</code> chứng minh bảo đảm nào?'),
        options: o([['Confidentiality', 'Bí mật'], ['Availability', 'Tính sẵn sàng'], ['Authentication — the certificate chains to a trusted root', 'Xác thực — chứng chỉ nối tới một gốc tin cậy'], ['Integrity only', 'Chỉ toàn vẹn']]),
        correctIndex: 2, points: 1,
        explanation: ex('Verify return code 0 means the certificate validated against a trusted root — that is authentication (you are talking to the real server). Confidentiality and integrity come from the TLS version + cipher. TLS does not provide availability.', 'Verify return code 0 nghĩa là chứng chỉ đã kiểm hợp lệ với một gốc tin cậy — đó là xác thực (bạn đang nói với máy chủ thật). Bí mật và toàn vẹn đến từ phiên bản TLS + cipher. TLS không cho tính sẵn sàng.'),
      },
      {
        question: q('You capture an HTTPS call with tcpdump and see only encrypted blobs. How do you read the actual HTTP without weakening security?', 'Bạn bắt một lời gọi HTTPS bằng tcpdump và chỉ thấy các khối mã hoá. Làm sao đọc HTTP thật mà không làm yếu bảo mật?'),
        options: o([['Set SSLKEYLOGFILE and open the capture in Wireshark with that key log', 'Đặt SSLKEYLOGFILE và mở bản bắt gói trong Wireshark với bản ghi khoá đó'], ['Use curl -k', 'Dùng curl -k'], ['Disable TLS on the server', 'Tắt TLS trên máy chủ'], ['Downgrade to TLS 1.0', 'Hạ xuống TLS 1.0']]),
        correctIndex: 0, points: 1,
        explanation: ex('curl and browsers write per-session keys to the file named in SSLKEYLOGFILE; feeding that to Wireshark decrypts your own traffic to readable GET/200 — exactly what the lab showed. curl -k and disabling TLS change what you are testing and remove security; they do not let you read the real exchange safely.', 'curl và trình duyệt ghi khoá theo phiên ra tệp đặt tên trong SSLKEYLOGFILE; đưa nó cho Wireshark giải mã lưu lượng của chính bạn thành GET/200 đọc được — đúng cái lab cho thấy. curl -k và tắt TLS đổi thứ bạn đang thử và bỏ bảo mật; chúng không cho bạn đọc trao đổi thật một cách an toàn.'),
      },
      {
        question: q('<code>openssl s_client -showcerts</code> shows two certificates: <code>0 s:labflow.test i:Intermediate</code>, <code>1 s:Intermediate i:Root</code>. Where is the root?', '<code>openssl s_client -showcerts</code> hiện hai chứng chỉ: <code>0 s:labflow.test i:Intermediate</code>, <code>1 s:Intermediate i:Root</code>. Gốc ở đâu?'),
        options: o([['The server forgot to send it — misconfigured', 'Máy chủ quên gửi — cấu hình sai'], ['It should be certificate 2', 'Nó nên là chứng chỉ 2'], ['Already in the client’s trust store — the server correctly does not send it', 'Đã ở trong kho tin cậy của client — máy chủ đúng khi không gửi nó'], ['The chain is broken', 'Chuỗi bị đứt']]),
        correctIndex: 2, points: 1,
        explanation: ex('A correctly configured server sends the leaf and the intermediate but NOT the root — the client already has the root in its trust store and walks up to it. Sending the root is unnecessary; a two-cert chain here is exactly right.', 'Một máy chủ cấu hình đúng gửi lá và trung gian nhưng KHÔNG gửi gốc — client đã có gốc trong kho tin cậy và lần lên tới nó. Gửi gốc là thừa; một chuỗi hai chứng chỉ ở đây là đúng.'),
      },
      {
        question: q('A new HTTPS deploy works in Chrome but curl, the mobile app and the uptime monitor all fail with “unable to get local issuer certificate”. Cause?', 'Một bản deploy HTTPS mới chạy trong Chrome nhưng curl, app di động và hệ giám sát đều hỏng với “unable to get local issuer certificate”. Nguyên nhân?'),
        options: o([['The certificate expired', 'Chứng chỉ hết hạn'], ['DNS is broken', 'DNS hỏng'], ['The clock is wrong', 'Đồng hồ sai'], ['A missing intermediate — Chrome fetches it via AIA, the others do not', 'Thiếu trung gian — Chrome lấy nó qua AIA, các cái kia không']]),
        correctIndex: 3, points: 1,
        explanation: ex('“Unable to get local issuer” is the missing-intermediate signature. Chrome hides it by fetching the intermediate via the leaf’s AIA URL; curl, Java and old Android do not, so they fail. Fix: serve the full chain (leaf + intermediate). It is not expiry, DNS or the clock.', '“Unable to get local issuer” là dấu hiệu thiếu trung gian. Chrome che nó bằng cách lấy trung gian qua URL AIA của lá; curl, Java và Android cũ thì không, nên hỏng. Sửa: phục vụ chuỗi đầy đủ (lá + trung gian). Không phải hết hạn, DNS hay đồng hồ.'),
      },
      {
        question: q('One server, one client, same certificate: curl says <code>certificate is not yet valid (9)</code>. What is almost certainly wrong?', 'Một máy chủ, một client, cùng chứng chỉ: curl nói <code>certificate is not yet valid (9)</code>. Cái gì gần như chắc chắn sai?'),
        options: o([['The certificate is corrupt', 'Chứng chỉ hỏng'], ['The CA revoked it', 'CA đã thu hồi nó'], ['The client machine’s clock is wrong (set in the past)', 'Đồng hồ máy client sai (đặt về quá khứ)'], ['The SAN is missing', 'SAN thiếu']]),
        correctIndex: 2, points: 1,
        explanation: ex('“Not yet valid” means notBefore is in the future from the client’s point of view — which almost always means the client’s clock is set in the past, not that the certificate is bad. The fix is NTP, not a new certificate. (Expired, code 10, is the past-side twin.)', '“Not yet valid” nghĩa là notBefore ở tương lai theo góc nhìn của client — mà gần như luôn nghĩa là đồng hồ client đặt về quá khứ, không phải chứng chỉ tồi. Sửa là NTP, không phải một chứng chỉ mới. (Hết hạn, mã 10, là cặp sinh đôi phía quá khứ.)'),
      },
      {
        question: q('A corporate laptop opens an HTTPS site fine, but the same site on a personal phone shows <code>self-signed certificate</code>. Most likely reason?', 'Một laptop công ty mở một site HTTPS tốt, nhưng cùng site trên một điện thoại cá nhân hiện <code>self-signed certificate</code>. Lý do khả dĩ nhất?'),
        options: o([['The site uses a different cert per device', 'Site dùng chứng chỉ khác mỗi thiết bị'], ['The phone has no internet', 'Điện thoại không có mạng'], ['The site is down', 'Site sập'], ['A corporate proxy/antivirus re-signs TLS with its own root, installed only on the laptop', 'Một proxy/antivirus công ty ký lại TLS bằng gốc của nó, chỉ cài trên laptop']]),
        correctIndex: 3, points: 1,
        explanation: ex('A TLS-inspecting proxy or antivirus re-signs every certificate with its own root, which is installed in the company laptop’s trust store. A device without that root — the personal phone — sees every site as self-signed. This is a trust-store difference, a classic “works here, fails there”.', 'Một proxy hay antivirus soi TLS ký lại mọi chứng chỉ bằng gốc của nó, được cài trong kho tin cậy của laptop công ty. Một thiết bị không có gốc đó — điện thoại cá nhân — thấy mọi site là tự ký. Đây là khác biệt kho tin cậy, một “chạy đây, hỏng đó” kinh điển.'),
      },
      {
        question: q('Cloudflare sits in front of your origin in “Full” (not “Full (strict)”) mode. What is the risk?', 'Cloudflare đứng trước origin của bạn ở chế độ “Full” (không phải “Full (strict)”). Rủi ro là gì?'),
        options: o([['Cloudflare→origin is encrypted but the origin certificate is not verified, so a MITM to the origin is undetected', 'Cloudflare→origin mã hoá nhưng chứng chỉ origin không được kiểm, nên một MITM tới origin không bị phát hiện'], ['The browser connection is unencrypted', 'Kết nối trình duyệt không mã hoá'], ['None — Full is fully secure', 'Không — Full hoàn toàn an toàn'], ['The origin must use HTTP', 'Origin phải dùng HTTP']]),
        correctIndex: 0, points: 1,
        explanation: ex('“Full” encrypts the Cloudflare→origin hop but accepts any origin certificate (even self-signed), so an attacker between Cloudflare and the origin could impersonate it undetected. Only “Full (strict)” both encrypts AND verifies. The browser→Cloudflare hop is separate and still encrypted.', '“Full” mã hoá chặng Cloudflare→origin nhưng chấp nhận bất kỳ chứng chỉ origin nào (kể cả tự ký), nên một kẻ tấn công giữa Cloudflare và origin có thể giả nó mà không bị phát hiện. Chỉ “Full (strict)” vừa mã hoá VỪA kiểm. Chặng trình duyệt→Cloudflare là riêng và vẫn mã hoá.'),
      },
      {
        question: q('An internal service “requires a client certificate”. A caller with no cert gets a TLS error and no HTTP response at all. What is this?', 'Một dịch vụ nội bộ “yêu cầu chứng chỉ client”. Một bên gọi không chứng chỉ nhận một lỗi TLS và không câu trả lời HTTP nào. Đây là gì?'),
        options: o([['A 401 Unauthorized', 'Một 401 Unauthorized'], ['mTLS — the client must also present a certificate, checked at the handshake before any request', 'mTLS — client cũng phải trình một chứng chỉ, kiểm ở cú bắt tay trước mọi yêu cầu'], ['A rate limit', 'Một giới hạn tốc độ'], ['A DNS failure', 'Một lỗi DNS']]),
        correctIndex: 1, points: 1,
        explanation: ex('Mutual TLS rejects a client with no (or an invalid) certificate during the TLS handshake, before the HTTP layer — so you get a TLS error and no HTTP status at all, not a 401 (which is an HTTP-level response). It is common for service-to-service auth.', 'TLS hai chiều từ chối một client không (hoặc không hợp lệ) chứng chỉ trong cú bắt tay TLS, trước tầng HTTP — nên bạn nhận một lỗi TLS và không mã trạng thái HTTP nào, không phải 401 (một câu trả lời ở mức HTTP). Nó phổ biến cho xác thực dịch vụ-tới-dịch vụ.'),
      },
      {
        question: q('Heartbleed (2014) leaked private keys from servers. What did it teach about TLS?', 'Heartbleed (2014) làm rò khoá riêng từ máy chủ. Nó dạy gì về TLS?'),
        options: o([['TLS 1.3 is insecure', 'TLS 1.3 không an toàn'], ['A sound protocol can be undermined by a buggy implementation (OpenSSL) — keep the library patched', 'Một giao thức vững có thể bị phá bởi một hiện thực có lỗi (OpenSSL) — giữ thư viện được vá'], ['Certificates are useless', 'Chứng chỉ vô dụng'], ['Encryption should be disabled', 'Nên tắt mã hoá']]),
        correctIndex: 1, points: 1,
        explanation: ex('Heartbleed was a bug in OpenSSL, not in the TLS protocol: a missing bounds check leaked memory. The lesson is that the protocol being sound does not protect you from a vulnerable implementation — keep your TLS library updated and prefer TLS 1.3, which removed many sharp edges.', 'Heartbleed là một lỗi trong OpenSSL, không phải trong giao thức TLS: một phép kiểm biên bị thiếu làm rò bộ nhớ. Bài học là giao thức vững không bảo vệ bạn khỏi một hiện thực dễ tổn thương — giữ thư viện TLS cập nhật và ưu tiên TLS 1.3, thứ đã bỏ nhiều cạnh sắc.'),
      },
    ],
  },
};
