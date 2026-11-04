/**
 * Chương 5 · 5.3 — UDP ngoài đời: tường lửa, NAT và khi QUIC bị chặn (slug khung netdev-5-3-udp-thuc-te).
 * Output thật: lab/out/c53-*.out.txt + c52-altsvc. curl --http3 = CHAY-O-MAY (ảnh lab thiếu HTTP/3).
 */
import { run, card, kv, cmd } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-05-3.mjs';

const L = card;

export default {
  title: '5.3 — UDP in practice: firewalls, NAT and when QUIC is blocked|||5.3 — UDP ngoài đời: tường lửa, NAT và khi QUIC bị chặn',
  slug: 'netdev-5-3-udp-thuc-te',
  type: 'LESSON',
  isFreePreview: true,
  description: 'UDP trong thế giới thực: vì sao mạng trường/công ty chặn hay bóp UDP 443, đường lùi êm ru (chặn UDP 443 bằng iptables, HTTP/3 tụt về HTTP/2 vẫn trả 200), trình duyệt chọn QUIC/TCP thế nào (Alt-Svc, đua, hết giờ), vì sao hết hạn NAT cắn UDP mạnh hơn và keepalive của QUIC làm gì, cách đo giao thức nào (cột Protocol, net-export; curl --http3 không có trong lab), và khi nào ép/tắt HTTP/3.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>UDP in practice: firewalls, NAT and when QUIC is blocked</h2>
<p class="lead">QUIC is a wonderful transport — when the network lets UDP through. Plenty of networks do not: school Wi-Fi, hotel captive portals, corporate firewalls. This lesson is about what happens then. The good news is that HTTP/3 was designed to fail gracefully: when UDP 443 is blocked, the browser quietly falls back to TCP and the site still works, just without the HTTP/3 speed-up. The bad news is that the fallback is <em>silent</em>, so “the app is slower at the office” can be a QUIC problem nobody thinks to look for. We block UDP in the lab and watch the fallback happen, then look at how to tell which transport your users actually got.</p>

<h3>Why networks are suspicious of UDP</h3>
<p>A firewall’s job is to allow what it understands and block what it does not. TCP is easy to understand — an explicit handshake opens a connection and a FIN closes it, so the firewall can track exactly which connections are live. UDP has neither; a middlebox must <em>guess</em> what is a “flow” and when it ended. That difference, plus history, means UDP gets the harder treatment:</p>
<ul>
<li><strong>Default-deny firewalls</strong> open TCP 443 for “the web” and frequently leave UDP 443 closed, because web-over-UDP is new.</li>
<li><strong>DDoS caution</strong>: UDP is the classic amplification vector (DNS, NTP reflection), so many networks rate-limit or block it.</li>
<li><strong>Old middleboxes</strong> simply do not know what UDP 443 is and drop it.</li>
<li><strong>NAT tables</strong> keep UDP mappings for a short time and expire them aggressively.</li>
</ul>
<p>On school, hotel and corporate networks, UDP 443 is very often the first thing to be closed — which is exactly why QUIC must never be the <em>only</em> way to reach your service.</p>

<h3>The happy fallback, measured</h3>
<p>With the HTTP/3 vhost from lesson 5.2 running, the server listens on UDP; a client could try QUIC. Now drop all UDP to that port — simulating a firewall — and fetch over TCP:</p>
${run('c53-block', 'ss -uln | grep 8443', 1)}
${cmd('iptables -A INPUT -p udp --dport 8443 -j DROP     # a firewall blocks QUIC')}
${run('c53-block', 'curl -sk --http2', 1)}
<p>The response is still <strong>HTTP/2, mã 200</strong>. Blocking QUIC did not break anything — because QUIC is an optimisation layered on top of a <em>working TCP path</em>, not a replacement for it. A browser on this network would try QUIC, get no answer, time out, and use the TCP connection it already has. The user sees a working page; only the <code>Protocol</code> column in dev tools would reveal it is HTTP/2 rather than HTTP/3.</p>
${net('waterfall', 'cold', 'en', 'QUIC saves handshake round trips when UDP is allowed; blocked, you pay the full TCP+TLS cold path instead.', { tour: 'waterfall-phases' })}

<h3>How the browser decides</h3>
<p>The decision is automatic and invisible:</p>
<ol>
<li>The <strong>first</strong> request to a site goes over TCP/HTTP-2, and the browser reads the <code>Alt-Svc: h3</code> header (lesson 5.2). Real sites all send it:</li>
</ol>
${run('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/', 1)}
<ol start="2">
<li>The browser <strong>remembers</strong> that the site offers <code>h3</code>, and on a later connection <strong>tries QUIC</strong> on UDP 443.</li>
<li>If the QUIC packets are dropped, the attempt <strong>times out</strong> and the browser <strong>falls back to TCP</strong> — with no error shown to the user.</li>
<li>Some browsers <strong>race</strong> the QUIC and TCP attempts (a Happy-Eyeballs-style approach, lesson 2.4) and keep whichever connects first, so a blocked UDP path costs little time.</li>
</ol>

<div class="pitfall co-tieu-de">
<p><strong>A silent fallback hides a real regression.</strong> If HTTP/3 is blocked on a particular network, users there lose the handshake and head-of-line-blocking wins of lesson 5.2 — the page is slower, but nothing errors, so no alert fires and no log line screams. When someone says “it’s slow only from the office”, check the <code>Protocol</code> column: if it is <code>h2</code> where you expected <code>h3</code>, the office firewall is dropping UDP 443, and the fix is a network change, not a code change.</p>
</div>

<h3>NAT timeouts bite UDP harder</h3>
<p>Even where UDP is allowed, NAT treats it more roughly than TCP. A NAT must guess when a UDP flow is finished, because there is no FIN to watch for, so it drops idle UDP mappings <strong>fast</strong> — often after ~30 seconds, far sooner than an idle TCP connection (which it can see explicitly open and close). A quiet QUIC connection could be forgotten by the NAT mid-session. QUIC handles this the same way it handles a changed network: it sends small <strong>keepalive</strong> packets to keep the mapping warm, and if the path does change, its <strong>Connection ID</strong> (lesson 5.2) lets it re-establish without a new handshake. This is why a mature QUIC stack survives flaky home and mobile NATs that would strand a hand-rolled UDP protocol.</p>

<h3>Measuring which transport you got</h3>
<p>Because QUIC is encrypted, you cannot read the protocol off <code>tcpdump</code> — you read it from the endpoints:</p>
<table>
<tr><th>Tool</th><th>What it tells you</th></tr>
<tr><td>Browser dev tools → Network</td><td>the <strong>Protocol</strong> column: <code>h3</code>, <code>h2</code>, or <code>http/1.1</code> per request</td></tr>
<tr><td><code>chrome://net-export</code></td><td>a full QUIC session log: attempts, fallbacks, migrations</td></tr>
<tr><td><code>curl --http3 https://…</code></td><td>force HTTP/3 — but needs a curl built with HTTP/3 support</td></tr>
<tr><td>server: UDP listener + <code>Alt-Svc</code></td><td>the two server-side signals from lesson 5.2</td></tr>
</table>
<p><span style="font-size:0.9em;color:#777">⏳ Chưa chạy thật trong lab: <code>curl --http3</code> để lấy qua QUIC — ảnh <code>net-lab</code> dựng curl 8.18 KHÔNG kèm HTTP/3 (và curl của macOS cũng không). Dùng bảng Network của trình duyệt, hoặc <code>chrome://net-export</code>.</span> <!-- CHAY-O-MAY: curl --http3 fetch — net-lab curl lacks HTTP/3 --></p>

<h3>When to force or disable HTTP/3</h3>
<ul>
<li><strong>Leave it on by default.</strong> The Alt-Svc fallback makes it safe, and users on good networks get the speed-up for free.</li>
<li><strong>Disable it only for a concrete reason</strong> — a specific broken middlebox you cannot route around, confirmed by measurement.</li>
<li><strong>Never rely on QUIC for correctness.</strong> Anything a blocked network would break must also work over TCP. QUIC is always optional.</li>
<li><strong>If a feature genuinely needs UDP</strong> — a game, WebRTC media — plan a TCP or TURN relay for networks that block it (Chapter 9’s WebRTC lesson).</li>
</ul>
<p>The rule of thumb: QUIC/HTTP-3 is a free speed-up where UDP is allowed, and must degrade to plain TCP where it is not. Build so the blocked case is <em>slower</em>, never <em>broken</em>.</p>

<h3>Where this lives in the computer</h3>
<ul>
<li>The <strong>block</strong> is a firewall or NAT dropping UDP 443 — nothing on your host, and the server is unaffected.</li>
<li>The <strong>fallback</strong> is browser logic: try QUIC, time out (or lose the race), and use the TCP connection it already has.</li>
<li>The <strong>NAT mapping</strong> is a short-lived UDP table entry; QUIC keepalives keep it warm.</li>
<li>The <strong>signal</strong> of which protocol you got lives in the browser (Protocol column, net-export), not in a packet capture — QUIC is encrypted.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> support says “the dashboard is noticeably slower from the new office, but fine on mobile data.” You suspect the office firewall blocks QUIC. Reproduce the mechanism and write how you would confirm it in the real app.</p>
<ol>
<li>Start the HTTP/3 vhost on <code>nfd-web</code> and confirm UDP 8443 is listening (<code>ss -uln | grep 8443</code>).</li>
<li>Block it: <code>iptables -A INPUT -p udp --dport 8443 -j DROP</code>. Fetch with <code>curl -sk --http2 -w '%{http_code}\\n' https://localhost:8443/</code> and confirm the site still returns 200.</li>
<li>Remove the rule. Explain, in writing, the browser’s decision path (Alt-Svc → try QUIC → time out → TCP) and why no error is surfaced.</li>
<li>Write how you would confirm it in production: the <code>Protocol</code> column in dev tools from the office vs mobile, and <code>chrome://net-export</code>.</li>
</ol>
<p><strong>Done when:</strong> you have shown the site unbroken with UDP blocked (200 over h2), and your write-up correctly maps “slower only at the office” to a firewall dropping UDP 443, verifiable by the browser’s Protocol column — not a code bug.</p>
<details><summary>Solution</summary>
<p>With UDP 8443 dropped, <code>curl --http2</code> still returns 200: the TCP path is untouched. A browser would read <code>Alt-Svc: h3</code>, try QUIC on UDP, get nothing, time out, and silently use TCP/HTTP-2 — no error, just HTTP/2 instead of HTTP/3. Confirmation in production: the Network panel’s Protocol column shows <code>h2</code> from the office and <code>h3</code> on mobile data, and <code>chrome://net-export</code> logs the failed QUIC attempts. The fix is to open UDP 443 on the office firewall (a network change), not to touch the app.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['fallback (đường lùi)', 'When QUIC fails, the browser silently uses the existing TCP/HTTP-2 path.'],
  ['UDP 443 (cổng QUIC)', 'The UDP port QUIC/HTTP-3 uses; the first thing restrictive networks block.'],
  ['Alt-Svc (dịch vụ thay thế)', 'The header that advertises h3 so a browser can discover and try QUIC.'],
  ['NAT timeout (hết hạn NAT)', 'A NAT drops idle UDP mappings fast (no FIN to watch), sooner than TCP.'],
  ['keepalive (gói duy trì)', 'Small QUIC packets that keep a NAT mapping warm and the connection alive.'],
  ['Happy Eyeballs (race)', 'Trying two options (QUIC and TCP) and keeping whichever connects first.'],
  ['h3 / h2', 'HTTP/3 (over QUIC) vs HTTP/2 (over TCP) — the Protocol column in dev tools.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Many networks block or throttle UDP 443, because UDP has no handshake a middlebox can track.</li>
<li>Blocking QUIC is safe for the site: HTTP/3 falls back to HTTP/2 silently — we measured mã 200 with UDP dropped.</li>
<li>The browser discovers h3 via Alt-Svc, tries QUIC, and times out to TCP if UDP is blocked, showing no error.</li>
<li>NAT timeouts hit UDP harder; QUIC keepalives and the Connection ID keep the connection alive.</li>
<li>Check the browser’s Protocol column to see which you got; a feature that truly needs UDP needs a TCP/relay fallback.</li>
</ul>
${L('https://blog.cloudflare.com/http3-the-past-present-and-future/', '📝', 'Cloudflare — HTTP/3: past, present and future', 'Deploying HTTP/3, the Alt-Svc fallback, and what networks do to UDP.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Alt-Svc', '📘', 'MDN — Alt-Svc', 'The discovery header and how clients use it.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9308', '📄', 'RFC 9308 — Applicability of QUIC', 'Where QUIC fits, UDP blocking, and fallback expectations.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8085', '📄', 'RFC 8085 — UDP Usage Guidelines', 'Keepalives, NAT timeouts and congestion control for UDP applications.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>UDP ngoài đời: tường lửa, NAT và khi QUIC bị chặn</h2>
<p class="lead">QUIC là một tầng vận chuyển tuyệt vời — khi mạng cho UDP đi qua. Rất nhiều mạng không: Wi-Fi trường, cổng đăng nhập khách sạn, tường lửa công ty. Bài này nói về chuyện xảy ra khi đó. Tin tốt là HTTP/3 được thiết kế để hỏng êm ái: khi UDP 443 bị chặn, trình duyệt lặng lẽ lùi về TCP và site vẫn chạy, chỉ thiếu cú tăng tốc HTTP/3. Tin xấu là đường lùi <em>âm thầm</em>, nên “app chậm hơn ở văn phòng” có thể là một vấn đề QUIC mà không ai nghĩ tới để tìm. Ta chặn UDP trong lab và xem đường lùi xảy ra, rồi nhìn cách biết người dùng thật sự nhận tầng vận chuyển nào.</p>

<h3>Vì sao mạng nghi ngờ UDP</h3>
<p>Việc của một tường lửa là cho qua cái nó hiểu và chặn cái nó không hiểu. TCP dễ hiểu — một cú bắt tay rõ ràng mở một kết nối và một FIN đóng nó, nên tường lửa theo dõi được chính xác kết nối nào đang sống. UDP không có cái nào; một middlebox phải <em>đoán</em> cái gì là một “luồng” và khi nào nó kết thúc. Khác biệt đó, cộng lịch sử, nghĩa là UDP bị đối xử nặng tay hơn:</p>
<ul>
<li><strong>Tường lửa mặc định cấm</strong> mở TCP 443 cho “web” và thường để UDP 443 đóng, vì web-trên-UDP là mới.</li>
<li><strong>Thận trọng DDoS</strong>: UDP là vector khuếch đại kinh điển (phản xạ DNS, NTP), nên nhiều mạng giới hạn tốc độ hoặc chặn nó.</li>
<li><strong>Middlebox cũ</strong> đơn giản không biết UDP 443 là gì và vứt nó.</li>
<li><strong>Bảng NAT</strong> giữ ánh xạ UDP trong thời gian ngắn và hết hạn chúng gắt gao.</li>
</ul>
<p>Trên mạng trường, khách sạn và công ty, UDP 443 rất thường là thứ đầu tiên bị đóng — đúng là lý do QUIC không bao giờ được là cách <em>duy nhất</em> tới dịch vụ của bạn.</p>

<h3>Đường lùi êm ru, đo được</h3>
<p>Với vhost HTTP/3 từ bài 5.2 đang chạy, máy chủ nghe trên UDP; một client có thể thử QUIC. Giờ vứt mọi UDP tới cổng đó — giả lập một tường lửa — và lấy qua TCP:</p>
${run('c53-block', 'ss -uln | grep 8443', 1)}
${cmd('iptables -A INPUT -p udp --dport 8443 -j DROP     # một tường lửa chặn QUIC')}
${run('c53-block', 'curl -sk --http2', 1)}
<p>Câu trả lời vẫn là <strong>HTTP/2, mã 200</strong>. Chặn QUIC không làm hỏng gì — vì QUIC là một tối ưu đặt trên một <em>đường TCP đang chạy</em>, không phải thứ thay thế nó. Một trình duyệt trên mạng này sẽ thử QUIC, không có câu trả lời, hết giờ, và dùng kết nối TCP nó đã có. Người dùng thấy một trang chạy; chỉ cột <code>Protocol</code> trong dev tools mới lộ ra nó là HTTP/2 chứ không phải HTTP/3.</p>
${net('waterfall', 'cold', 'vi', 'QUIC tiết kiệm vòng bắt tay khi UDP được phép; bị chặn, bạn trả trọn đường lạnh TCP+TLS.', { tour: 'waterfall-phases' })}

<h3>Trình duyệt quyết định thế nào</h3>
<p>Quyết định là tự động và vô hình:</p>
<ol>
<li>Yêu cầu <strong>đầu tiên</strong> tới một site đi qua TCP/HTTP-2, và trình duyệt đọc header <code>Alt-Svc: h3</code> (bài 5.2). Các site thật đều gửi nó:</li>
</ol>
${run('c52-altsvc', 'curl -sI --max-time 10 https://www.cloudflare.com/', 1)}
<ol start="2">
<li>Trình duyệt <strong>nhớ</strong> rằng site có <code>h3</code>, và trên một kết nối sau <strong>thử QUIC</strong> trên UDP 443.</li>
<li>Nếu các gói QUIC bị vứt, lần thử <strong>hết giờ</strong> và trình duyệt <strong>lùi về TCP</strong> — không hiện lỗi cho người dùng.</li>
<li>Vài trình duyệt <strong>đua</strong> lần thử QUIC và TCP (kiểu Happy Eyeballs, bài 2.4) và giữ cái nào kết nối trước, nên một đường UDP bị chặn tốn ít thời gian.</li>
</ol>

<div class="pitfall co-tieu-de">
<p><strong>Một đường lùi âm thầm giấu một hồi quy thật.</strong> Nếu HTTP/3 bị chặn trên một mạng cụ thể, người dùng ở đó mất thắng lợi bắt tay và nghẽn đầu hàng của bài 5.2 — trang chậm hơn, nhưng không gì báo lỗi, nên không cảnh báo nào kêu và không dòng log nào hét. Khi ai đó nói “chậm chỉ từ văn phòng”, kiểm cột <code>Protocol</code>: nếu nó là <code>h2</code> nơi bạn mong <code>h3</code>, tường lửa văn phòng đang vứt UDP 443, và cách sửa là một thay đổi mạng, không phải thay đổi code.</p>
</div>

<h3>Hết hạn NAT cắn UDP mạnh hơn</h3>
<p>Ngay cả nơi UDP được phép, NAT đối xử với nó thô hơn TCP. Một NAT phải đoán khi nào một luồng UDP kết thúc, vì không có FIN để canh, nên nó vứt các ánh xạ UDP rảnh <strong>nhanh</strong> — thường sau ~30 giây, sớm hơn nhiều một kết nối TCP rảnh (mà nó thấy mở và đóng rõ ràng). Một kết nối QUIC im có thể bị NAT quên giữa phiên. QUIC xử lý điều này cùng cách nó xử lý một mạng đổi: nó gửi các gói <strong>keepalive</strong> nhỏ để giữ ánh xạ ấm, và nếu đường có đổi, <strong>Connection ID</strong> của nó (bài 5.2) cho nó lập lại mà không cần cú bắt tay mới. Đây là lý do một ngăn xếp QUIC chín sống sót qua các NAT nhà và di động chập chờn mà sẽ bỏ rơi một giao thức UDP tự chế.</p>

<h3>Đo tầng vận chuyển nào bạn nhận</h3>
<p>Vì QUIC mã hoá, bạn không đọc được giao thức từ <code>tcpdump</code> — bạn đọc nó từ hai đầu:</p>
<table>
<tr><th>Công cụ</th><th>Nó cho biết gì</th></tr>
<tr><td>Dev tools trình duyệt → Network</td><td>cột <strong>Protocol</strong>: <code>h3</code>, <code>h2</code>, hay <code>http/1.1</code> mỗi yêu cầu</td></tr>
<tr><td><code>chrome://net-export</code></td><td>một log phiên QUIC đầy đủ: các lần thử, lùi, chuyển</td></tr>
<tr><td><code>curl --http3 https://…</code></td><td>ép HTTP/3 — nhưng cần một curl dựng kèm HTTP/3</td></tr>
<tr><td>máy chủ: socket UDP + <code>Alt-Svc</code></td><td>hai tín hiệu phía máy chủ từ bài 5.2</td></tr>
</table>
<p><span style="font-size:0.9em;color:#777">⏳ Chưa chạy thật trong lab: <code>curl --http3</code> để lấy qua QUIC — ảnh <code>net-lab</code> dựng curl 8.18 KHÔNG kèm HTTP/3 (và curl của macOS cũng không). Dùng bảng Network của trình duyệt, hoặc <code>chrome://net-export</code>.</span> <!-- CHAY-O-MAY: curl --http3 fetch — net-lab curl lacks HTTP/3 --></p>

<h3>Khi nào ép hay tắt HTTP/3</h3>
<ul>
<li><strong>Để nó bật mặc định.</strong> Đường lùi Alt-Svc làm nó an toàn, và người dùng trên mạng tốt được tăng tốc miễn phí.</li>
<li><strong>Chỉ tắt nó vì một lý do cụ thể</strong> — một middlebox hỏng cụ thể bạn không đi vòng được, đã xác nhận bằng phép đo.</li>
<li><strong>Không bao giờ dựa vào QUIC cho tính đúng đắn.</strong> Bất cứ gì một mạng bị chặn sẽ làm hỏng cũng phải chạy qua TCP. QUIC luôn tuỳ chọn.</li>
<li><strong>Nếu một tính năng thật sự cần UDP</strong> — một game, media WebRTC — hãy lên kế hoạch một relay TCP hay TURN cho các mạng chặn nó (bài WebRTC Chương 9).</li>
</ul>
<p>Quy tắc: QUIC/HTTP-3 là một cú tăng tốc miễn phí nơi UDP được phép, và phải xuống cấp về TCP thường nơi không. Dựng sao cho trường hợp bị chặn <em>chậm hơn</em>, không bao giờ <em>hỏng</em>.</p>

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li><strong>Việc chặn</strong> là một tường lửa hay NAT vứt UDP 443 — không gì trên máy bạn, và máy chủ không bị ảnh hưởng.</li>
<li><strong>Đường lùi</strong> là logic trình duyệt: thử QUIC, hết giờ (hoặc thua cuộc đua), và dùng kết nối TCP nó đã có.</li>
<li><strong>Ánh xạ NAT</strong> là một mục bảng UDP sống ngắn; keepalive của QUIC giữ nó ấm.</li>
<li><strong>Tín hiệu</strong> bạn nhận giao thức nào nằm trong trình duyệt (cột Protocol, net-export), không phải trong một bản bắt gói — QUIC mã hoá.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> support nói “bảng điều khiển chậm thấy rõ từ văn phòng mới, nhưng ổn trên dữ liệu di động.” Bạn nghi tường lửa văn phòng chặn QUIC. Dựng lại cơ chế và viết cách bạn sẽ xác nhận trong app thật.</p>
<ol>
<li>Dựng vhost HTTP/3 trên <code>nfd-web</code> và xác nhận UDP 8443 đang nghe (<code>ss -uln | grep 8443</code>).</li>
<li>Chặn nó: <code>iptables -A INPUT -p udp --dport 8443 -j DROP</code>. Lấy với <code>curl -sk --http2 -w '%{http_code}\\n' https://localhost:8443/</code> và xác nhận site vẫn trả 200.</li>
<li>Gỡ luật. Giải thích bằng chữ đường quyết định của trình duyệt (Alt-Svc → thử QUIC → hết giờ → TCP) và vì sao không lỗi nào hiện ra.</li>
<li>Viết cách bạn sẽ xác nhận trong sản xuất: cột <code>Protocol</code> trong dev tools từ văn phòng so với di động, và <code>chrome://net-export</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã cho thấy site không hỏng khi UDP bị chặn (200 qua h2), và bài viết ánh xạ đúng “chậm chỉ ở văn phòng” sang một tường lửa vứt UDP 443, xác minh được bằng cột Protocol của trình duyệt — không phải lỗi code.</p>
<details><summary>Lời giải</summary>
<p>Với UDP 8443 bị vứt, <code>curl --http2</code> vẫn trả 200: đường TCP không bị đụng. Một trình duyệt sẽ đọc <code>Alt-Svc: h3</code>, thử QUIC trên UDP, không có gì, hết giờ, và lặng lẽ dùng TCP/HTTP-2 — không lỗi, chỉ HTTP/2 thay vì HTTP/3. Xác nhận trong sản xuất: cột Protocol của bảng Network hiện <code>h2</code> từ văn phòng và <code>h3</code> trên dữ liệu di động, và <code>chrome://net-export</code> ghi các lần thử QUIC thất bại. Cách sửa là mở UDP 443 trên tường lửa văn phòng (một thay đổi mạng), không phải đụng vào app.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['fallback (đường lùi)', 'Khi QUIC hỏng, trình duyệt lặng lẽ dùng đường TCP/HTTP-2 đang có.'],
  ['UDP 443 (cổng QUIC)', 'Cổng UDP mà QUIC/HTTP-3 dùng; thứ đầu tiên các mạng siết chặn.'],
  ['Alt-Svc (dịch vụ thay thế)', 'Header quảng cáo h3 để trình duyệt khám phá và thử QUIC.'],
  ['NAT timeout (hết hạn NAT)', 'Một NAT vứt ánh xạ UDP rảnh nhanh (không có FIN để canh), sớm hơn TCP.'],
  ['keepalive (gói duy trì)', 'Các gói QUIC nhỏ giữ một ánh xạ NAT ấm và kết nối sống.'],
  ['Happy Eyeballs (đua)', 'Thử hai lựa chọn (QUIC và TCP) và giữ cái nào kết nối trước.'],
  ['h3 / h2', 'HTTP/3 (trên QUIC) so với HTTP/2 (trên TCP) — cột Protocol trong dev tools.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nhiều mạng chặn hay bóp UDP 443, vì UDP không có cú bắt tay middlebox theo dõi được.</li>
<li>Chặn QUIC an toàn cho site: HTTP/3 lùi về HTTP/2 âm thầm — ta đo mã 200 khi UDP bị vứt.</li>
<li>Trình duyệt khám phá h3 qua Alt-Svc, thử QUIC, và hết giờ về TCP nếu UDP bị chặn, không hiện lỗi.</li>
<li>Hết hạn NAT cắn UDP mạnh hơn; keepalive của QUIC và Connection ID giữ kết nối sống.</li>
<li>Kiểm cột Protocol của trình duyệt để biết bạn nhận cái nào; một tính năng thật sự cần UDP cần một đường lùi TCP/relay.</li>
</ul>
${L('https://blog.cloudflare.com/http3-the-past-present-and-future/', '📝', 'Cloudflare — HTTP/3: quá khứ, hiện tại và tương lai', 'Triển khai HTTP/3, đường lùi Alt-Svc, và mạng làm gì với UDP.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Alt-Svc', '📘', 'MDN — Alt-Svc', 'Header khám phá và cách client dùng nó.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9308', '📄', 'RFC 9308 — Khả năng áp dụng của QUIC', 'QUIC hợp ở đâu, chặn UDP, và kỳ vọng đường lùi.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8085', '📄', 'RFC 8085 — Hướng dẫn dùng UDP', 'Keepalive, hết hạn NAT và kiểm soát tắc nghẽn cho ứng dụng UDP.', 'Mở')}
</div>
`,
};
