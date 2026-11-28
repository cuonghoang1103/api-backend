/**
 * Networking for Developers · Chương 5 (UDP và QUIC) — bộ luyện chương, gắn bài Lab 5 (netdev-5-4-lab-udp-quic).
 * Dữ liệu thật: lab/out/c51-loss (20 gói qua đường mất 30% ⇒ nhận 12/20), c52-altsvc (Alt-Svc thật của cloudflare.com và google.com),
 * c53-block (chặn UDP 8443 ⇒ HTTP/2 vẫn 200). Ca ẩn của bài viết hàm là header / chuỗi số thứ tự DỰNG theo đúng khuôn.
 */
import { doiDau, KHOA, tn, jsBai, nguon, goi, sauLenh, ra, pre, c, cs, tinh, q, bang1, mt } from './_net.mjs';

const LOSS = sauLenh('c51-loss', 'node udp-send.mjs 20')[0];
const ALT_CF = sauLenh('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/')[0];
const ALT_GG = sauLenh('c52-altsvc', 'curl -sI --max-time 10 https://www.google.com/')[0];
const FALLBACK = ra('c53-block').split('\n').find((d) => /HTTP\/2/.test(d) && /200/.test(d)).trim();
if (!/12\/20/.test(LOSS) || !/h3=":443"; ma=86400/.test(ALT_CF) || !/h3-29/.test(ALT_GG) || !FALLBACK) throw new Error('Ch5: output thật đổi — xem lại đề');

const E1 = cs({
  ten: 'UDP 1 — Send and forget, and what QUIC adds back', kho: 'EASY', phut: 10,
  en: `Lessons 5.1–5.3 and the real Lab 5 run: 20 datagrams over a path with 30% loss printed ${c(LOSS)}; with UDP 8443 dropped the site still answered ${c(FALLBACK)}.`,
  vi: `Bài 5.1–5.3 và lần chạy thật của Lab 5: 20 datagram qua đường mất 30% in ra ${c(LOSS)}; khi UDP 8443 bị chặn, trang vẫn trả ${c(FALLBACK)}.`,
  cau: [
    q('c1', ['A capture of one UDP echo shows three datagrams and no [S], [S.] or [.]. What does that prove?', 'Bản bắt một lần echo UDP có ba datagram và không có [S], [S.] hay [.]. Điều đó chứng minh gì?'], ['UDP has no connection setup: the first packet already carries data', 'The handshake happened earlier and was not captured', 'The capture filter dropped the TCP packets', 'UDP hides its handshake inside the first datagram'], ['There is no handshake to capture. That is UDP\'s whole bargain: zero setup cost, and no delivery, ordering or retransmission either.', 'Không có bắt tay nào để bắt. Đó chính là thoả thuận của UDP: không tốn chi phí thiết lập, đổi lại không đảm bảo tới nơi, đúng thứ tự hay gửi lại.']),
    q('c2', ['8 of the 20 datagrams were lost. How was the sender told?', '8 trong 20 datagram bị mất. Bên gửi được báo bằng cách nào?'], ['It was not told at all; UDP is best effort', 'By an ICMP message for each lost datagram', 'By a negative ACK from the receiver', 'By an error returned from send()'], ['send() succeeds as soon as the datagram leaves the machine. Nothing comes back for a loss on the path — if the application cares, it must add sequence numbers or acknowledgements itself.', 'send() thành công ngay khi datagram rời máy. Không có gì quay về khi gói mất trên đường — nếu ứng dụng cần, nó phải tự thêm số thứ tự hoặc xác nhận.']),
    q('c3', ['On the server, ss shows nginx listening on UDP 8443 as well as TCP 8443. What is the UDP listener?', 'Trên server, ss cho thấy nginx nghe cả UDP 8443 lẫn TCP 8443. Listener UDP là gì?'], ['The QUIC endpoint — the fingerprint of HTTP/3', 'A DNS resolver built into nginx', 'The HTTP/2 port; HTTP/2 runs over UDP', 'A health-check port for the load balancer'], ['HTTP/3 runs on QUIC, which runs on UDP. TCP 8443 serves HTTP/1.1 and HTTP/2 over TLS; the UDP socket is what makes HTTP/3 possible.', 'HTTP/3 chạy trên QUIC, còn QUIC chạy trên UDP. TCP 8443 phục vụ HTTP/1.1 và HTTP/2 qua TLS; socket UDP mới là thứ làm HTTP/3 khả thi.']),
    q('c4', ['How does a browser first learn that a site supports HTTP/3?', 'Lần đầu trình duyệt biết một trang hỗ trợ HTTP/3 bằng cách nào?'], ['An Alt-Svc header on an HTTP/1.1 or HTTP/2 response (or a DNS HTTPS record)', 'It sends a QUIC packet to every site it visits', 'From the TLS certificate', 'The server pushes an HTTP/3 upgrade frame'], ['The first visit usually uses TCP. The response advertises alt-svc: h3=":443"; ma=…, the browser remembers it for ma seconds and tries QUIC next time.', 'Lần ghé đầu thường dùng TCP. Phản hồi quảng cáo alt-svc: h3=":443"; ma=…, trình duyệt ghi nhớ trong ma giây và lần sau thử QUIC.']),
    q('c5', ['An office firewall blocks UDP 443. What happens to users of an HTTP/3-enabled site?', 'Tường lửa văn phòng chặn UDP 443. Người dùng của một trang đã bật HTTP/3 gặp gì?'], ['They silently fall back to HTTP/2 over TCP: slower on lossy paths, never broken', 'The site becomes unreachable until UDP is allowed', 'Browsers show a certificate warning', 'They are downgraded to plain HTTP on port 80'], ['QUIC failing is a soft failure: the browser keeps using TCP. The only visible clue is the Protocol column reading h2 where you expected h3 — which is how you detect it.', 'QUIC hỏng là hỏng mềm: trình duyệt tiếp tục dùng TCP. Dấu hiệu duy nhất thấy được là cột Protocol ghi h2 ở chỗ bạn chờ h3 — đó là cách phát hiện nó.']),
    q('c6', ['Which QUIC property keeps a download going when a phone moves from Wi-Fi to 4G?', 'Tính chất nào của QUIC giữ được lượt tải khi điện thoại chuyển từ Wi-Fi sang 4G?'], ['Connection IDs instead of the IP/port four-tuple (connection migration)', 'Larger initial congestion window', 'Header compression with QPACK', 'Forward error correction on every packet'], ['A TCP connection is identified by the four-tuple, so a new IP kills it. QUIC identifies the connection by IDs carried in its packets, so it survives an address change.', 'Kết nối TCP được định danh bằng bộ bốn địa chỉ/cổng, nên đổi IP là chết. QUIC định danh kết nối bằng ID nằm trong gói, nên sống sót qua việc đổi địa chỉ.']),
  ],
  goiY: [['UDP: no setup, no delivery guarantee, no feedback.', 'UDP: không thiết lập, không đảm bảo tới nơi, không phản hồi.'], ['QUIC rebuilds reliability, ordering and encryption on top of UDP, in user space.', 'QUIC dựng lại độ tin cậy, thứ tự và mã hoá trên UDP, ở không gian người dùng.']],
  loi: [['Believing a successful send() means the datagram arrived.', 'Tin rằng send() thành công nghĩa là datagram đã tới.'], ['Treating blocked UDP 443 as an outage instead of a fallback.', 'Coi UDP 443 bị chặn là sập dịch vụ thay vì một lần lùi.']],
  tns: [tn('best effort', 'cố gắng hết sức, không bảo đảm'), tn('Alt-Svc', 'header quảng cáo dịch vụ thay thế'), tn('connection migration', 'di trú kết nối')], kn: ['UDP', 'QUIC', 'HTTP/3 discovery'],
});

const E2 = tinh({
  tieuDe: 'UDP 2 — TCP or UDP? Decide like Lab 5 did', doKho: 'MEDIUM', phut: 10,
  moTa: mt('For each channel, choose the transport and the one property that decides it.', 'Với mỗi kênh, chọn tầng vận chuyển và đúng một tính chất quyết định lựa chọn đó.'),
  loai: 'table',
  bang: [bang1('b1', ['Pick the transport', 'Chọn tầng vận chuyển'], [{ ma: 's', ten: 'Channel' }, { ma: 't', ten: 'Transport', luaChon: ['TCP', 'UDP', 'QUIC (over UDP)'] }, { ma: 'w', ten: 'Deciding property', luaChon: ['every byte must arrive, in order', 'only the newest value matters', 'late data is useless (real time)', 'web traffic that should survive loss and network changes'] }], [
    { o: { s: 'Live sensor telemetry: a reading every 100 ms' }, a: { t: 'UDP', w: 'only the newest value matters' } },
    { o: { s: 'Uploading a 200 MB backup' }, a: { t: 'TCP', w: 'every byte must arrive, in order' } },
    { o: { s: 'A voice call between two users' }, a: { t: 'UDP', w: 'late data is useless (real time)' } },
    { o: { s: 'The LabFlow web app on mobile networks' }, a: { t: 'QUIC (over UDP)', w: 'web traffic that should survive loss and network changes' } },
    { o: { s: 'A database query and its result set' }, a: { t: 'TCP', w: 'every byte must arrive, in order' } },
  ], ['A dropped telemetry update is replaced by the next one, so recovering it is wasted work; a voice packet that arrives late has missed its moment. Files and query results must be complete and ordered — TCP. The web app wants reliability AND no head-of-line blocking AND migration, which is exactly what QUIC builds on UDP.', 'Một bản cập nhật telemetry bị mất sẽ được bản kế thay thế, nên khôi phục nó là phí công; một gói thoại tới muộn đã lỡ thời điểm. Tệp và kết quả truy vấn phải đủ và đúng thứ tự — TCP. Ứng dụng web cần tin cậy VÀ không nghẽn đầu hàng VÀ di trú kết nối, đúng thứ QUIC dựng trên UDP.'])],
  goiY: [['Ask: is a late or lost piece still worth having?', 'Hỏi: một mảnh tới muộn hoặc bị mất có còn đáng giữ không?'], ['QUIC is reliable — it is not "UDP with no guarantees".', 'QUIC có tin cậy — nó không phải "UDP không bảo đảm gì".']].map(([en, vi]) => ({ en, vi })),
  loiHayGap: [['Choosing UDP for the backup "because it is faster".', 'Chọn UDP cho bản sao lưu "vì nó nhanh hơn".'], ['Calling QUIC unreliable because it runs on UDP.', 'Gọi QUIC là không tin cậy vì nó chạy trên UDP.']].map(([en, vi]) => ({ en, vi })),
  thuatNgu: [tn('head-of-line blocking', 'nghẽn đầu hàng')], khaiNiem: ['transport choice'],
});

function parseAltSvc(header) {
  var v = String(header).replace(/^\s*alt-svc\s*:\s*/i, '').trim();
  if (!v || v.toLowerCase() === 'clear') return [];
  return v.split(',').map(function (entry) {
    var parts = entry.split(';').map(function (p) { return p.trim(); });
    var m = /^([^=]+)="([^"]*)"$/.exec(parts[0]);
    if (!m) return null;
    var hp = m[2], i = hp.lastIndexOf(':');
    var out = { protocol: m[1].trim(), host: hp.slice(0, i), port: Number(hp.slice(i + 1)), maxAge: 86400 }; // RFC 7838: default ma = 24 h
    parts.slice(1).forEach(function (p) { var kv = p.split('='); if (kv[0].trim() === 'ma') out.maxAge = Number(kv[1]); });
    return out;
  }).filter(function (x) { return x; });
}
const E3 = jsBai({
  ten: 'UDP 3 — Write parseAltSvc(header): how a browser discovers HTTP/3', kho: 'MEDIUM', phut: 20,
  en: `<p>Two real headers measured from the course lab:</p>${pre([ALT_CF, ALT_GG])}<p>Write <code>parseAltSvc(header)</code> (RFC 7838). The input may or may not start with <code>alt-svc:</code> (any case). Return one <code>{ protocol, host, port, maxAge }</code> per comma-separated alternative, in order:</p>
<ul>
<li>the part before <code>=</code> is the protocol id (<code>h3</code>, <code>h3-29</code>…); the quoted value is <code>host:port</code> — an empty host means "the same host";</li>
<li><code>ma=N</code> is the number of seconds the browser may remember it; if absent, the default is 86400 (24 hours);</li>
<li>other parameters (e.g. <code>persist=1</code>) are ignored; the special value <code>clear</code> returns <code>[]</code>.</li>
</ul>`,
  vi: `<p>Hai header thật đo từ phòng lab của khoá:</p>${pre([ALT_CF, ALT_GG])}<p>Viết <code>parseAltSvc(header)</code> (RFC 7838). Đầu vào có thể có hoặc không có tiền tố <code>alt-svc:</code> (hoa thường tuỳ ý). Trả về một <code>{ protocol, host, port, maxAge }</code> cho mỗi lựa chọn ngăn bởi dấu phẩy, theo thứ tự:</p>
<ul>
<li>phần trước dấu <code>=</code> là mã giao thức (<code>h3</code>, <code>h3-29</code>…); giá trị trong ngoặc kép là <code>host:port</code> — host rỗng nghĩa là "chính host này";</li>
<li><code>ma=N</code> là số giây trình duyệt được phép ghi nhớ; vắng thì mặc định 86400 (24 giờ);</li>
<li>tham số khác (ví dụ <code>persist=1</code>) bỏ qua; giá trị đặc biệt <code>clear</code> trả <code>[]</code>.</li>
</ul>`,
  dau: 'function parseAltSvc(header) {\n  return [];\n}\n',
  giai: nguon(parseAltSvc),
  cases: [
    { goi: goi('parseAltSvc', ALT_CF) },
    { goi: goi('parseAltSvc', ALT_GG) },
    { goi: goi('parseAltSvc', 'h3=":8443"; ma=86400') },
    { goi: goi('parseAltSvc', 'Alt-Svc: h3="edge.example.net:443"; ma=3600; persist=1'), an: true },
    { goi: goi('parseAltSvc', 'alt-svc: h3=":443"'), an: true },
    { goi: goi('parseAltSvc', 'alt-svc: clear'), an: true },
    { goi: goi('parseAltSvc', 'h3=":443"; ma=60, h2="alt.example:8443"; ma=120'), an: true },
  ],
  goiY: [['Strip the optional "alt-svc:" prefix, then split on "," and each entry on ";".', 'Bỏ tiền tố "alt-svc:" nếu có, rồi tách theo "," và mỗi mục theo ";".'], ['Split host and port at the LAST colon of the quoted value.', 'Tách host và port ở dấu hai chấm CUỐI CÙNG của giá trị trong ngoặc kép.']],
  loi: [['Forgetting the 24-hour default when ma is absent.', 'Quên mặc định 24 giờ khi không có ma.'], ['Keeping the quotes in the host, or returning the port as a string.', 'Giữ dấu ngoặc kép trong host, hoặc trả port dạng chuỗi.']],
  gt: ['Alt-Svc is how HTTP/3 bootstraps itself: the first response over TCP tells the browser where QUIC is available and for how long to remember it. Google advertising both h3 and the older draft h3-29 is the real-world shape you will meet while clients upgrade.', 'Alt-Svc là cách HTTP/3 tự khởi động: phản hồi đầu tiên qua TCP cho trình duyệt biết QUIC có ở đâu và được nhớ trong bao lâu. Google quảng cáo cả h3 lẫn bản nháp cũ h3-29 là hình dạng thực tế bạn sẽ gặp trong lúc client nâng cấp dần.'],
  kn: ['Alt-Svc', 'HTTP/3'],
});

function latestOnly(sent, arrivals) {
  var seen = {}, accepted = [], stale = 0, last = 0, uniq = 0;
  arrivals.forEach(function (seq) {
    if (!seen[seq]) { seen[seq] = true; uniq++; }
    if (seq > last) { accepted.push(seq); last = seq; } else stale++; // an older or duplicate update arriving late
  });
  var missing = [];
  for (var s = 1; s <= sent; s++) if (!seen[s]) missing.push(s);
  return { received: uniq, lost: sent - uniq, lossPct: Math.round((sent - uniq) / sent * 1000) / 10, missing: missing, stale: stale, accepted: accepted };
}
const E4 = jsBai({
  ten: 'UDP 4 — Write latestOnly(sent, arrivals): the receiver that UDP needs', kho: 'HARD', phut: 25,
  en: `<p>Lab 5's recommendation for telemetry is UDP <i>with an application-level sequence number</i>: the sender numbers its updates 1, 2, 3…, and the receiver keeps only updates that are newer than the last one it accepted. Write <code>latestOnly(sent, arrivals)</code> where <code>sent</code> is how many updates were sent (numbered 1..sent) and <code>arrivals</code> the sequence numbers in the order they reached the receiver (losses are missing; reordering and duplicates are possible). Return:</p>
<ul>
<li><code>received</code> — distinct sequence numbers that arrived; <code>lost</code> = sent − received; <code>lossPct</code> rounded to 0.1;</li>
<li><code>missing</code> — the lost numbers, ascending;</li>
<li><code>stale</code> — arrivals NOT accepted because they are not newer than the last accepted one (late or duplicate);</li>
<li><code>accepted</code> — the accepted numbers in arrival order.</li>
</ul>`,
  vi: `<p>Khuyến nghị của Lab 5 cho telemetry là UDP <i>kèm số thứ tự ở tầng ứng dụng</i>: bên gửi đánh số các bản cập nhật 1, 2, 3…, bên nhận chỉ giữ bản mới hơn bản cuối cùng nó đã nhận. Viết <code>latestOnly(sent, arrivals)</code> với <code>sent</code> là số bản đã gửi (đánh số 1..sent) và <code>arrivals</code> là các số thứ tự theo thứ tự chúng tới bên nhận (gói mất thì vắng; có thể đảo thứ tự và trùng). Trả về:</p>
<ul>
<li><code>received</code> — số lượng số thứ tự KHÁC NHAU đã tới; <code>lost</code> = sent − received; <code>lossPct</code> làm tròn 0,1;</li>
<li><code>missing</code> — các số bị mất, tăng dần;</li>
<li><code>stale</code> — số lần tới KHÔNG được nhận vì không mới hơn bản cuối đã nhận (tới muộn hoặc trùng);</li>
<li><code>accepted</code> — các số được nhận, theo thứ tự tới.</li>
</ul>`,
  dau: 'function latestOnly(sent, arrivals) {\n  return { received: 0, lost: 0, lossPct: 0, missing: [], stale: 0, accepted: [] };\n}\n',
  giai: nguon(latestOnly),
  cases: [
    { goi: goi('latestOnly', 20, [1, 2, 4, 5, 7, 8, 10, 13, 14, 16, 18, 20]), moTa: ['Case 1: 12/20 arrived, like the real Lab 5 run', 'Ca 1: tới 12/20, như lần chạy thật của Lab 5'] },
    { goi: goi('latestOnly', 5, [1, 3, 2, 4, 5]) },
    { goi: goi('latestOnly', 6, [2, 2, 1, 6, 5, 4]), an: true },
    { goi: goi('latestOnly', 3, []), an: true },
    { goi: goi('latestOnly', 4, [4, 3, 2, 1]), an: true },
  ],
  goiY: [['Track "last accepted" as you walk the arrivals once.', 'Theo dõi "bản cuối đã nhận" khi duyệt arrivals một lượt.'], ['Count distinct numbers separately from accepted ones: a stale update still ARRIVED.', 'Đếm số khác nhau tách riêng với số được nhận: bản cập nhật cũ vẫn ĐÃ TỚI.']],
  loi: [['Treating a reordered (stale) update as lost.', 'Coi bản cập nhật tới sai thứ tự (cũ) là bị mất.'], ['Accepting an older value after a newer one, so the dashboard jumps backwards.', 'Nhận một giá trị cũ sau khi đã nhận giá trị mới, khiến bảng điều khiển nhảy lùi.']],
  gt: ['This is the first piece of what QUIC does for you: number everything so the receiver can tell loss from reordering. For "newest value wins" data you never retransmit — you just refuse to go backwards.', 'Đây là mảnh đầu tiên của những gì QUIC làm hộ bạn: đánh số mọi thứ để bên nhận phân biệt được mất gói với đảo thứ tự. Với dữ liệu "giá trị mới nhất thắng", bạn không bao giờ gửi lại — chỉ cần từ chối đi lùi.'],
  kn: ['sequence numbers', 'reordering'],
});

export default doiDau({ slug: 'netdev-5-4-lab-udp-quic', ten: 'Lab 5 — Practice: UDP, QUIC and HTTP/3', khoa: KHOA, baiHoc: 'netdev-5-4-lab-udp-quic', de: [E1, E2, E3, E4] });
