/**
 * Networking for Developers · Chương 6 (TLS và chứng chỉ) — bộ luyện chương, gắn bài Lab 6 (netdev-6-5-lab-tls-labflow).
 * Dữ liệu thật: lab/out/c64-* (bốn lỗi chứng chỉ của curl), c63-missing (thiếu trung gian), c63-chain (s:/i: của chuỗi đúng),
 * c63-read (hạn dùng + SAN của chứng chỉ lá), c62-hand (TLS 1.3, ALPN h2). Ca ẩn là chuỗi/ngày DỰNG theo đúng khuôn openssl.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, sauLenh, ra, pre, c, cs, tinh, q, ord, bang1, mt } from './_net.mjs';

const loi1 = (tep) => ra(tep).split('\n').find((d) => /^curl: \(/.test(d));
const ERR = { expired: loi1('c64-expired'), name: loi1('c64-name'), selfsigned: loi1('c64-selfsigned'), notyet: loi1('c64-notyet'), missing: loi1('c63-missing') };
const CHAIN = sauLenh('c63-chain', 'echo | openssl s_client -connect 10.10.2.10:8443 -servername labflow.test -showcerts 2>/dev/null | grep -E " [si]:"');
const READ = sauLenh('c63-read', 'echo | openssl s_client');
const HAND = sauLenh('c62-hand', 'echo | openssl s_client');
if (Object.values(ERR).some((x) => !x) || CHAIN.length !== 4 || !READ.some((d) => /^notAfter=/.test(d)) || !HAND.some((d) => /TLSv1\.3/.test(d))) throw new Error('Ch6: output thật đổi — xem lại đề');

const E1 = tinh({
  tieuDe: 'TLS 1 — Five real curl errors: cause and fix', doKho: 'MEDIUM', phut: 12,
  moTa: mt(`Lab 6 served five broken certificates and recorded the first line curl printed each time:${pre([ERR.expired, ERR.name, ERR.selfsigned, ERR.notyet, ERR.missing])}Match each message to its cause and its fix.`, `Lab 6 lần lượt phục vụ năm chứng chỉ hỏng và ghi lại dòng đầu curl in ra mỗi lần:${pre([ERR.expired, ERR.name, ERR.selfsigned, ERR.notyet, ERR.missing])}Ghép mỗi thông điệp với nguyên nhân và cách sửa.`),
  loai: 'table',
  bang: [bang1('b1', ['Message → cause → fix', 'Thông điệp → nguyên nhân → cách sửa'], [{ ma: 'm', ten: 'Message (shortened)' }, { ma: 'k', ten: 'Cause', luaChon: ['the certificate expired', 'the name is not in the SAN list', 'nobody trusted signed it', 'the clock is behind the start date', 'the server did not send the intermediate'] }, { ma: 'f', ten: 'Fix', luaChon: ['renew it and alert before expiry', 'issue a certificate whose SAN covers the name', 'use a certificate from a trusted CA', 'fix the client\'s clock (NTP)', 'serve the full chain (leaf + intermediate)'] }], [
    { o: { m: 'certificate has expired (10)' }, a: { k: 'the certificate expired', f: 'renew it and alert before expiry' } },
    { o: { m: 'no alternative certificate subject name matches' }, a: { k: 'the name is not in the SAN list', f: 'issue a certificate whose SAN covers the name' } },
    { o: { m: 'self-signed certificate (18)' }, a: { k: 'nobody trusted signed it', f: 'use a certificate from a trusted CA' } },
    { o: { m: 'certificate is not yet valid (9)' }, a: { k: 'the clock is behind the start date', f: 'fix the client\'s clock (NTP)' } },
    { o: { m: 'unable to get local issuer certificate (20)' }, a: { k: 'the server did not send the intermediate', f: 'serve the full chain (leaf + intermediate)' } },
  ], ['All five are curl exit 60 — the code only says "verification failed", the text says why. The last one is the partner incident of Lab 6: browsers fetch a missing intermediate through AIA and hide the bug, while curl, Java and monitoring fail. "Not yet valid" on one machine is almost always that machine\'s clock.', 'Cả năm đều là curl exit 60 — mã chỉ nói "kiểm chứng thất bại", phần chữ mới nói vì sao. Dòng cuối là sự cố đối tác của Lab 6: trình duyệt tự lấy trung gian còn thiếu qua AIA nên che mất lỗi, còn curl, Java và hệ giám sát thì hỏng. "Not yet valid" trên đúng một máy gần như luôn là đồng hồ của máy đó.'])],
  goiY: ['Read the text after the error code; the number 60 is the same for all of them.', 'Only one of the five can be fixed on the client without touching the server.'],
  loiHayGap: ['Fixing any of them with curl -k — that switches verification off, it does not fix anything.', 'Renewing the certificate when the real problem is the missing intermediate.'],
  thuatNgu: [tn('SAN', 'danh sách tên hợp lệ của chứng chỉ'), tn('intermediate CA', 'CA trung gian'), tn('AIA', 'trường chỉ nơi tải chứng chỉ cấp trên')], khaiNiem: ['certificate errors'],
});

const E2 = tinh({
  tieuDe: 'TLS 2 — The TLS 1.3 handshake, in order', doKho: 'MEDIUM', phut: 8,
  moTa: mt(`The real handshake of Lab 6 ended like this:${pre(HAND.filter((d) => /TLSv1\.3|ALPN|Verify/.test(d)))}Put the steps of a full TLS 1.3 handshake in order.`, `Bắt tay thật của Lab 6 kết thúc thế này:${pre(HAND.filter((d) => /TLSv1\.3|ALPN|Verify/.test(d)))}Xếp các bước của một lần bắt tay TLS 1.3 đầy đủ theo thứ tự.`),
  loai: 'order',
  cauHoi: [ord('q1', ['One round trip, then encrypted data', 'Một vòng khứ hồi, rồi dữ liệu đã mã hoá'], ['ClientHello: versions, ciphers, key share, SNI and ALPN (in cleartext)', 'ServerHello: chosen cipher and the server\'s key share — both sides now derive the keys', 'Encrypted from here: the server\'s Certificate and CertificateVerify', 'Server Finished', 'The client verifies the chain and the name, then sends its Finished', 'Application data (the HTTP request) flows encrypted'], ['TLS 1.3 sends the key share in the very first message, so the keys exist after ONE round trip and the certificate itself already travels encrypted. Only the ClientHello — including the SNI — is readable on the wire.', 'TLS 1.3 gửi key share ngay trong thông điệp đầu tiên, nên khoá có sau MỘT vòng khứ hồi và chính chứng chỉ đã đi dưới dạng mã hoá. Chỉ có ClientHello — kể cả SNI — là đọc được trên dây.'])],
  goiY: ['The key exchange happens in the first two messages.', 'The client checks the certificate before it sends Finished.'],
  loiHayGap: ['Putting the certificate before ServerHello.', 'Thinking TLS 1.3 needs two round trips like TLS 1.2.'],
  thuatNgu: [tn('key share', 'phần trao đổi khoá'), tn('ALPN', 'thương lượng giao thức tầng ứng dụng')], khaiNiem: ['TLS 1.3 handshake'],
});

function chainCheck(text, trustedRoots) {
  var certs = [], cur = null;
  String(text).split('\n').forEach(function (l) {
    var s = /^\s*(\d+)\s+s:(.*)$/.exec(l), i = /^\s*i:(.*)$/.exec(l);
    if (s) { cur = { subject: s[2].trim(), issuer: null }; certs.push(cur); }
    else if (i && cur) cur.issuer = i[1].trim();
  });
  if (!certs.length) return { ok: false, depth: 0, problem: 'no certificates' };
  for (var k = 0; k + 1 < certs.length; k++) {
    if (certs[k].issuer !== certs[k + 1].subject) return { ok: false, depth: certs.length, problem: 'out of order at ' + k };
  }
  var last = certs[certs.length - 1];
  if (last.issuer === last.subject && trustedRoots.indexOf(last.subject) < 0) return { ok: false, depth: certs.length, problem: 'untrusted self-signed' };
  if (trustedRoots.indexOf(last.issuer) >= 0) return { ok: true, depth: certs.length, problem: null };
  return { ok: false, depth: certs.length, problem: 'missing issuer: ' + last.issuer };
}
const ROOT = 'CN=LabFlow Root CA, O=LabFlow';
const MID = 'CN=LabFlow Intermediate CA, O=LabFlow';
const E3 = jsBai({
  ten: 'TLS 3 — Write chainCheck(text, trustedRoots): does the chain reach a root?', kho: 'HARD', phut: 25,
  en: `<p>The real chain LabFlow's server sent, read with <code>openssl s_client -showcerts | grep -E " [si]:"</code> (s = subject, i = issuer):</p>${pre(CHAIN)}<p>Write <code>chainCheck(text, trustedRoots)</code>. Parse the certificates in order (a line <code>N s:…</code> starts certificate N; the next <code>i:…</code> line is its issuer). Then return <code>{ ok, depth, problem }</code>, checking in this order:</p>
<ol>
<li>no certificate ⇒ <code>{ ok: false, depth: 0, problem: "no certificates" }</code>;</li>
<li>each certificate's issuer must be the subject of the NEXT one, else <code>problem: "out of order at K"</code> (K = index of the certificate whose issuer does not match);</li>
<li>if the last certificate is self-signed (issuer = subject) and not in <code>trustedRoots</code> ⇒ <code>"untrusted self-signed"</code>;</li>
<li>if the last certificate's issuer is in <code>trustedRoots</code> ⇒ <code>{ ok: true, problem: null }</code>; otherwise <code>"missing issuer: &lt;issuer&gt;"</code>.</li>
</ol>
<p><code>depth</code> is the number of certificates the server sent. A correct server never sends the root: the client already has it.</p>`,
  vi: `<p>Chuỗi thật mà server của LabFlow gửi, đọc bằng <code>openssl s_client -showcerts | grep -E " [si]:"</code> (s = chủ thể, i = nơi cấp):</p>${pre(CHAIN)}<p>Viết <code>chainCheck(text, trustedRoots)</code>. Đọc các chứng chỉ theo thứ tự (dòng <code>N s:…</code> mở chứng chỉ thứ N; dòng <code>i:…</code> kế tiếp là nơi cấp của nó). Rồi trả về <code>{ ok, depth, problem }</code>, kiểm theo thứ tự:</p>
<ol>
<li>không có chứng chỉ nào ⇒ <code>{ ok: false, depth: 0, problem: "no certificates" }</code>;</li>
<li>nơi cấp của mỗi chứng chỉ phải là chủ thể của chứng chỉ KẾ TIẾP, không thì <code>problem: "out of order at K"</code> (K = chỉ số của chứng chỉ có nơi cấp không khớp);</li>
<li>nếu chứng chỉ cuối là tự ký (nơi cấp = chủ thể) và không nằm trong <code>trustedRoots</code> ⇒ <code>"untrusted self-signed"</code>;</li>
<li>nếu nơi cấp của chứng chỉ cuối nằm trong <code>trustedRoots</code> ⇒ <code>{ ok: true, problem: null }</code>; ngược lại <code>"missing issuer: &lt;nơi cấp&gt;"</code>.</li>
</ol>
<p><code>depth</code> là số chứng chỉ server đã gửi. Server đúng không bao giờ gửi gốc: client đã có sẵn.</p>`,
  dau: 'function chainCheck(text, trustedRoots) {\n  return { ok: false, depth: 0, problem: null };\n}\n',
  giai: nguon(chainCheck),
  cases: [
    { goi: goi('chainCheck', CHAIN.join('\n'), [ROOT]) },
    { goi: goi('chainCheck', CHAIN.slice(0, 2).join('\n'), [ROOT]), moTa: ['Case 2: the leaf only — the Lab 6 partner incident', 'Ca 2: chỉ có lá — sự cố đối tác của Lab 6'] },
    { goi: goi('chainCheck', CHAIN.join('\n'), ['CN=Some Other Root']), an: true },
    { goi: goi('chainCheck', ' 0 s:CN=dev.local\n   i:CN=dev.local', [ROOT]), an: true },
    { goi: goi('chainCheck', [CHAIN[2], CHAIN[3], CHAIN[0], CHAIN[1]].join('\n'), [ROOT]), an: true },
    { goi: goi('chainCheck', '', [ROOT]), an: true },
    { goi: goi('chainCheck', [' 0 s:CN=api.example', `   i:${MID}`, ` 1 s:${MID}`, `   i:${ROOT}`, ` 2 s:${ROOT}`, `   i:${ROOT}`].join('\n'), [ROOT]), an: true },
  ],
  goiY: [['Build an array of { subject, issuer } first, then check links pairwise.', 'Dựng mảng { subject, issuer } trước, rồi kiểm từng cặp liên kết.'], ['A root is self-signed: its issuer equals its subject.', 'Gốc là tự ký: nơi cấp bằng chủ thể.']],
  loi: [['Declaring the leaf-only chain fine because a browser accepts it — curl and Java do not fetch missing intermediates.', 'Kết luận chuỗi chỉ có lá là ổn vì trình duyệt chấp nhận — curl và Java không tự đi lấy trung gian còn thiếu.'], ['Rejecting a chain that includes its (trusted) root — sending the root is wasteful, not wrong.', 'Từ chối một chuỗi có kèm gốc (đáng tin) — gửi kèm gốc là thừa, không phải sai.']],
  gt: ['Trust is a path: leaf → intermediate → a root the client already holds. A server that sends only the leaf breaks that path for every client that does not repair it by itself, which is why the outage hit the partner and not the browser.', 'Niềm tin là một con đường: lá → trung gian → một gốc client đã có sẵn. Server chỉ gửi lá là cắt đứt con đường đó với mọi client không tự sửa, nên sự cố đánh vào đối tác chứ không vào trình duyệt.'],
  kn: ['chain of trust'],
});

function certStatus(text, nowIso, minDays) {
  var M = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  function parse(s) { var w = s.trim().split(/\s+/), t = w[2].split(':').map(Number); return Date.UTC(Number(w[3]), M[w[0]], Number(w[1]), t[0], t[1], t[2]); }
  var nb = null, na = null;
  String(text).split('\n').forEach(function (l) {
    var m = /^notBefore=(.*)$/.exec(l.trim()); if (m) nb = parse(m[1]);
    var n = /^notAfter=(.*)$/.exec(l.trim()); if (n) na = parse(n[1]);
  });
  var now = Date.parse(nowIso);
  var daysLeft = Math.floor((na - now) / 86400000);
  var status = now < nb ? 'not-yet-valid' : now > na ? 'expired' : daysLeft < minDays ? 'renew-soon' : 'ok';
  return { status: status, daysLeft: daysLeft };
}
const E4 = jsBai({
  ten: 'TLS 4 — Write certStatus(text, now, minDays): the expiry alarm', kho: 'MEDIUM', phut: 20,
  en: `<p>Expiry is the number-one HTTPS outage and the easiest to prevent. The real leaf of Lab 6:</p>${pre(READ)}<p>Write <code>certStatus(text, nowIso, minDays)</code> for the output of <code>openssl x509 -noout -dates</code>: find the <code>notBefore=</code> and <code>notAfter=</code> lines (format <code>Mon  D HH:MM:SS YYYY GMT</code>, the day may be padded with a space), and return <code>{ status, daysLeft }</code>:</p>
<ul><li><code>daysLeft</code> = whole days from <code>nowIso</code> to notAfter, rounded down (negative once expired);</li>
<li><code>status</code>: <code>"not-yet-valid"</code> if now is before notBefore, <code>"expired"</code> if after notAfter, <code>"renew-soon"</code> if daysLeft &lt; minDays, else <code>"ok"</code>.</li></ul>`,
  vi: `<p>Hết hạn là sự cố HTTPS số một và cũng dễ phòng nhất. Chứng chỉ lá thật của Lab 6:</p>${pre(READ)}<p>Viết <code>certStatus(text, nowIso, minDays)</code> cho kết xuất của <code>openssl x509 -noout -dates</code>: tìm dòng <code>notBefore=</code> và <code>notAfter=</code> (dạng <code>Mon  D HH:MM:SS YYYY GMT</code>, ngày có thể được đệm một dấu cách), rồi trả về <code>{ status, daysLeft }</code>:</p>
<ul><li><code>daysLeft</code> = số ngày tròn từ <code>nowIso</code> tới notAfter, làm tròn xuống (âm khi đã hết hạn);</li>
<li><code>status</code>: <code>"not-yet-valid"</code> nếu now trước notBefore, <code>"expired"</code> nếu sau notAfter, <code>"renew-soon"</code> nếu daysLeft &lt; minDays, còn lại <code>"ok"</code>.</li></ul>`,
  dau: 'function certStatus(text, nowIso, minDays) {\n  return { status: "ok", daysLeft: 0 };\n}\n',
  giai: nguon(certStatus),
  cases: [
    { goi: goi('certStatus', READ.join('\n'), '2026-11-20T00:00:00Z', 20) },
    { goi: goi('certStatus', READ.join('\n'), '2027-01-20T00:00:00Z', 20) },
    { goi: goi('certStatus', READ.join('\n'), '2027-03-01T00:00:00Z', 20), an: true },
    { goi: goi('certStatus', READ.join('\n'), '2026-11-01T00:00:00Z', 20), an: true },
    { goi: goi('certStatus', 'notBefore=Jan 15 00:00:00 2026 GMT\nnotAfter=Apr 15 00:00:00 2026 GMT', '2026-03-27T12:00:00Z', 20), an: true },
  ],
  goiY: [['Split the date on whitespace: month, day, time, year — Date.UTC takes a 0-based month.', 'Tách ngày theo khoảng trắng: tháng, ngày, giờ, năm — Date.UTC nhận tháng tính từ 0.'], ['86,400,000 ms in a day; Math.floor gives "whole days left".', '86.400.000 ms một ngày; Math.floor cho ra "số ngày tròn còn lại".']],
  loi: [['Splitting on single spaces and breaking on the padded day ("Nov  4").', 'Tách theo đúng một dấu cách và vỡ ở ngày có đệm ("Nov  4").'], ['Parsing in local time, so the answer shifts by the time zone.', 'Đọc theo giờ địa phương, khiến đáp án lệch theo múi giờ.']],
  gt: ['Lab 6\'s hardening list says "alert ~20 days out". This function is that alert: run it from cron against every hostname you own, and an expiry becomes a ticket three weeks early instead of an outage.', 'Danh sách làm cứng của Lab 6 ghi "cảnh báo trước khoảng 20 ngày". Hàm này chính là lời cảnh báo đó: chạy nó bằng cron với mọi tên miền bạn quản lý, và chuyện hết hạn trở thành một ticket trước ba tuần thay vì một sự cố.'],
  kn: ['certificate expiry', 'monitoring'],
});

const E5 = cs({
  ten: 'TLS 5 — What HTTPS hides, what it does not, and the shortcuts that hurt', kho: 'HARD', phut: 10,
  en: 'Lessons 6.1–6.4 and the Lab 6 hardening list.',
  vi: 'Bài 6.1–6.4 và danh sách làm cứng của Lab 6.',
  cau: [
    q('c1', ['On a school network, what can the operator still see of your HTTPS visit to labflow.test?', 'Trên mạng trường, người vận hành vẫn thấy được gì của lượt truy cập HTTPS tới labflow.test?'], ['The domain name, from the SNI in the ClientHello', 'The full URL path and query', 'The request body', 'Your session cookie'], ['TLS encrypts the body, path, headers and cookies, but the SNI in the ClientHello is cleartext — the capture in Lab 6 shows it. That is exactly what SNI-based blocking reads.', 'TLS mã hoá body, path, header và cookie, nhưng SNI trong ClientHello là chữ rõ — bản bắt gói ở Lab 6 cho thấy. Đó đúng là thứ cơ chế chặn theo SNI đọc.']),
    q('c2', ['A teammate "fixes" a TLS error in a script with curl -k. Why is that dangerous?', 'Một đồng đội "sửa" lỗi TLS trong script bằng curl -k. Vì sao nguy hiểm?'], ['Anyone on the path can now pose as the server', 'It downgrades the connection to TLS 1.0', 'It makes every request ten times slower', 'It leaks the private key of the server'], ['Encryption without authentication protects you from nobody in the middle: you encrypt your data to whoever answered. Fix the cause (chain, name, clock), never ship -k.', 'Mã hoá mà không xác thực thì không bảo vệ bạn khỏi kẻ đứng giữa nào: bạn mã hoá dữ liệu gửi cho bất kỳ ai trả lời. Sửa nguyên nhân (chuỗi, tên, đồng hồ), đừng bao giờ đưa -k lên production.']),
    q('c3', ['Cloudflare sits in front of the origin. Which SSL mode encrypts AND verifies the origin hop?', 'Cloudflare đứng trước origin. Chế độ SSL nào vừa mã hoá VỪA kiểm chứng chặng tới origin?'], ['Full (strict)', 'Flexible', 'Full', 'Off'], ['Flexible leaves the origin hop in plain HTTP; Full encrypts it but accepts any certificate; Full (strict) requires a valid certificate on the origin.', 'Flexible để chặng tới origin là HTTP trần; Full mã hoá nhưng chấp nhận mọi chứng chỉ; Full (strict) đòi chứng chỉ hợp lệ trên origin.']),
    q('c4', ['Why monitor Certificate Transparency logs (e.g. crt.sh) for your own domains?', 'Vì sao nên theo dõi nhật ký Certificate Transparency (ví dụ crt.sh) cho chính tên miền của mình?'], ['To spot a certificate issued for your name that you did not request', 'To renew certificates automatically', 'To speed up the TLS handshake', 'To hide your subdomains from search engines'], ['Public CAs log every certificate they issue. Watching the log catches mis-issuance or a forgotten subdomain early — the log is public, so attackers read it too.', 'Các CA công khai ghi mọi chứng chỉ họ cấp vào nhật ký. Theo dõi nó bắt được chứng chỉ cấp sai hoặc subdomain bị quên — nhật ký là công khai, nên kẻ tấn công cũng đọc nó.']),
    q('c5', ['An internal API must accept only calls from your own services, at the TLS layer. What is that called?', 'Một API nội bộ chỉ được nhận lời gọi từ chính các dịch vụ của bạn, ngay ở tầng TLS. Cách đó gọi là gì?'], ['Mutual TLS (client certificates)', 'HTTP Strict Transport Security', 'OCSP stapling on the server', 'TLS session resumption'], ['With mTLS (ssl_verify_client in nginx) a client without a valid certificate is rejected during the handshake, before any HTTP is spoken.', 'Với mTLS (ssl_verify_client trong nginx), client không có chứng chỉ hợp lệ bị từ chối ngay trong bắt tay, trước khi nói câu HTTP nào.']),
  ],
  goiY: [['TLS guarantees confidentiality, integrity and authentication — authentication only if you verify.', 'TLS bảo đảm bí mật, toàn vẹn và xác thực — xác thực chỉ khi bạn có kiểm chứng.'], ['The ClientHello is the only cleartext part of a TLS 1.3 handshake.', 'ClientHello là phần chữ rõ duy nhất của bắt tay TLS 1.3.']],
  loi: [['Believing HTTPS hides which site you visit.', 'Tin rằng HTTPS giấu được bạn vào trang nào.'], ['Choosing Flexible because the padlock is green.', 'Chọn Flexible vì ổ khoá vẫn xanh.']],
  tns: [tn('SNI', 'chỉ định tên máy chủ'), tn('mTLS', 'TLS hai chiều'), tn('Certificate Transparency', 'nhật ký minh bạch chứng chỉ')], kn: ['TLS guarantees'],
});

export default doiDau({ slug: 'netdev-6-5-lab-tls-labflow', ten: 'Lab 6 — Practice: certificates, chains and TLS errors', khoa: KHOA, baiHoc: 'netdev-6-5-lab-tls-labflow', de: [E1, E2, E3, E4, E5] });
