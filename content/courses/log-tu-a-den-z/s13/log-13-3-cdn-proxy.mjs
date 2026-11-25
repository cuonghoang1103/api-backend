/**
 * 13.3 — Log CDN và reverse proxy (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s13/proxy'] — lab ./_demo/s13/proxy: nginx 1.27 "edge" (GIẢ LẬP một CDN kiểu Cloudflare: CF-Connecting-IP, CF-Ray),
 * nginx gốc hai cổng (sai/đúng), Express 5.3 + express-rate-limit 8.7; client là container curl 8.11.1 mang IP nguồn cố định (mạng 10.113.0.0/24).
 * Danh sách dải IP Cloudflare lấy thật từ https://www.cloudflare.com/ips-v4 lúc chạy. Chạy lại ⇒ Ray ID/giờ đổi.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '13.3 — CDN and reverse-proxy logs: Cloudflare security events and Ray ID, real client IP, X-Forwarded-For and its spoofing|||13.3 — Log CDN và reverse proxy: Security Events và Ray ID của Cloudflare, IP thật của khách, X-Forwarded-For và việc bị giả mạo',
  slug: 'log-13-3-cdn-proxy',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab thật ba tầng (CDN biên giả lập → nginx gốc → Express 5): vì sao log máy chủ sau proxy chỉ thấy một IP, lấy IP thật đúng cách bằng real_ip + CF-Connecting-IP chỉ từ dải IP của proxy, X-Forwarded-For đọc từ phải sang trái, kẻ tấn công tự gửi XFF giả để né giới hạn đăng nhập (8 lần không bị chặn vs 429 từ lần thứ 6) — đúng lỗi của CVE-2026-25552 (Ghost-CLI) và CVE-2025-59152 (Litestar), gọi thẳng máy gốc né CDN, và dùng Ray ID nối báo lỗi của khách với log biên và log gốc.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Behind a proxy, every visitor has the same IP — unless you read the right header, from the right sender</h2>
<p class="lead">Almost every production web app sits behind something: a CDN such as Cloudflare or CloudFront, a load balancer, an ingress, at least an nginx. The TCP connection your server sees comes from that proxy, so <code>$remote_addr</code> in the access log is the proxy's address. The visitor's address travels in a <strong>header</strong> — and headers can be written by anyone. This lesson builds the chain for real and reads it at every hop.</p>
<p><strong>About the lab:</strong> you cannot run Cloudflare on your laptop, so an nginx container plays the "edge". It does what Cloudflare documents: adds <code>CF-Connecting-IP</code>, appends to <code>X-Forwarded-For</code>, tags every request with a <code>CF-Ray</code> id. Everything else (nginx's <code>realip</code> module, Express 5's <code>trust proxy</code>, express-rate-limit) is the real software you will meet at work.</p>

<h3>The everyday picture: the parcel with three labels</h3>
<p>A parcel goes from the sender to a post office, then to a sorting centre, then to you. Each office sticks its own label on top: "received from post office A". The bottom label — written by the sender — says "from: Mr. Honest". The labels added by the offices you trust are true. The sender's label is whatever the sender chose to write. Reading the parcel correctly means: start from the top, trust only labels stuck on by offices you know, and stop at the first label you cannot vouch for.</p>

<h3>The lab</h3>
${ma('nginx', 's13/proxy/edge.conf')}
${ma('nginx', 's13/proxy/origin.conf')}
${ma('js', 's13/proxy/app.mjs')}
${lenh('s13/proxy', 0)}
<p>IP plan: <code>10.113.0.5</code> edge (the CDN), <code>.10</code> origin nginx, <code>.20</code> app, <code>.101</code> an honest visitor, <code>.66</code> an attacker. <code>khach IP …</code> runs curl from a container that really has that source IP. Port 80 of the origin is the common <em>wrong</em> setup; port 8080 the <em>right</em> one.</p>

<h3>Step 1 — the honest visitor, seen from three logs</h3>
${lenh('s13/proxy', 4)}
${lenh('s13/proxy', 5)}
${lenh('s13/proxy', 6)}
<ul>
<li>Wrong origin (<code>goc-sai.log</code>): <code>$remote_addr = 10.113.0.5</code>. Every visitor in the world becomes the CDN's address. Your "top 10 IPs" report is one line; blocking that IP blocks everybody.</li>
<li>Right origin (<code>goc-dung.log</code>): <code>10.113.0.101</code>, and <code>real_from=10.113.0.5</code> keeps the original TCP peer (<code>$realip_remote_addr</code>) — log both, you will need to prove which proxy delivered it.</li>
<li>The app log shows the same visitor on both ports — for now. Note <code>ips</code> on port 3000: <code>["10.113.0.101","10.113.0.5"]</code>, the whole chain Express believed.</li>
</ul>

<h3>Step 2 — reading X-Forwarded-For: right to left</h3>
<p><code>X-Forwarded-For: client, proxy1, proxy2</code> — each proxy <strong>appends</strong> the address it received the connection from (<code>$proxy_add_x_forwarded_for</code> in nginx). The rightmost entries were written by your own proxies and are true. The leftmost entry was whatever arrived first — possibly typed by the client. Correct reading: walk from the right, skip addresses of proxies you trust, the first one that is not yours is the client.</p>

<h3>Step 3 — the attacker writes their own header</h3>
${lenh('s13/proxy', 7)}
${lenh('s13/proxy', 8)}
${lenh('s13/proxy', 9)}
<p>The attacker at <code>10.113.0.66</code> sent <code>X-Forwarded-For: 203.0.113.7</code>. The edge logged it as <code>xff_vao="203.0.113.7"</code> and appended the true peer: <code>203.0.113.7, 10.113.0.66</code>. Then:</p>
<ul>
<li>Port 80 → app 3000 with <code>trust proxy = true</code>: Express trusts <em>every</em> hop and takes the leftmost: <strong><code>ip = 203.0.113.7</code></strong>. The app answered "you are 203.0.113.7", logged 203.0.113.7, and would rate-limit, geolocate and audit 203.0.113.7. The attacker chose their own identity.</li>
<li>Port 8080: nginx took the client address from <code>CF-Connecting-IP</code> (the edge sets it from the TCP peer, so the client cannot fake it) <em>because</em> the request came from <code>10.113.0.5</code>, then <strong>overwrote</strong> X-Forwarded-For with that one address; Express trusts only nginx. Result: <code>10.113.0.66</code>, the truth. The spoofed value remains visible in the origin log's <code>xff=</code> field — which is evidence, not identity.</li>
</ul>

<h3>Step 4 — skipping the CDN: calling the origin directly</h3>
${lenh('s13/proxy', 10)}
<p>The attacker found the origin's address (old DNS records, certificate transparency logs, an email header) and sent both headers straight to <code>10.113.0.10</code>. nginx ignored them: <code>set_real_ip_from</code> lists only the edge, and this connection came from <code>.66</code> (<code>real_from=10.113.0.66</code>, <code>ray=-</code> — no CDN touched it). A request at the origin without a Ray ID is itself a signal: in production, the firewall of the origin should accept ports 80/443 <em>only</em> from the CDN's IP ranges.</p>

<h3>Step 5 — why it matters: a login rate limit that never fires</h3>
${lenh('s13/proxy', 11)}
${lenh('s13/proxy', 12)}
${lenh('s13/proxy', 13)}
${lenh('s13/proxy', 14)}
<p>Same 8 password guesses from the same machine, each with a different fake <code>X-Forwarded-For</code>. Wrong setup: 8 × 401 and never a 429 — the limiter (5 per minute per IP) saw eight different "clients", one attempt each. Right setup: five 401, then <strong>429 Too Many Requests</strong>. The app log tells you which situation you are in: eight IPs with one attempt each from the documentation range is a fingerprint of header spoofing. express-rate-limit even writes a warning into the log at the first request — <code>ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting</code>. Search your logs for this line today.</p>
<div class="pitfall co-tieu-de"><p><strong>This is not a lab curiosity.</strong> CVE-2026-25552 (Ghost-CLI before 1.30.1, published July 2026): the nginx configuration generated for self-hosted Ghost used <code>$proxy_add_x_forwarded_for</code>, so attackers could prepend any address and bypass Ghost's rate limiting — exactly port 80 above. CVE-2025-59152 (Litestar 2.17.0, CVSS 7.5): the RateLimitMiddleware trusted X-Forwarded-For unconditionally; every spoofed value got its own bucket. Same root cause: a security decision based on a header the client controls (CWE-807).</p></div>

<h3>Step 6 — the Ray ID: from a user's screenshot to the exact log line</h3>
${lenh('s13/proxy', 15)}
${lenh('s13/proxy', 16)}
${lenh('s13/proxy', 17)}
<p>A customer sends a screenshot: "error page, Ray ID: 2e6e…-SIN". The edge, the origin access log and (if the app logs the header) the app log all carry the same id. One grep shows the edge returned 502 because the origin's upstream (the app) was down. For the earlier 500 on <code>/loi</code>, the same id leads to the app's JSON line. A real Cloudflare Ray ID usually looks like a run of hex digits followed by the data-centre code (<code>…-SIN</code> = Singapore); it appears on Cloudflare error pages and in the <code>cf-ray</code> header (Cloudflare also sends it to your origin), and you can filter the dashboard's <strong>Security Events</strong> by it to see whether the WAF blocked, challenged or let the request through. Two caveats from Cloudflare's own documentation: Ray IDs are <em>not guaranteed unique</em> (join on Ray ID + time), and Security Events may show <em>sampled</em> data. It is the request id of lesson 10.4, issued by someone else.</p>

<h3>Step 7 — configuring trust from the CDN's published list</h3>
${lenh('s13/proxy', 18)}
${lenh('s13/proxy', 19)}
<p>Cloudflare publishes its ranges (15 IPv4 ranges today, plus <code>/ips-v6</code>); they change rarely but do change, so generate the nginx include from the list in your deploy pipeline instead of copying it once. The same rule applies to any proxy: AWS ALB/CloudFront, Azure Front Door, a Kubernetes ingress — trust the header only from the proxy's addresses, and log the TCP peer next to it.</p>

<h3>What a CDN log adds (recognition level)</h3>
<table>
<thead><tr><th>Field (Cloudflare naming)</th><th>What it tells you</th></tr></thead>
<tbody>
<tr><td><code>RayID</code></td><td>Join key across edge, origin and app logs</td></tr>
<tr><td><code>ClientIP</code>, <code>ClientCountry</code>, <code>ClientASN</code></td><td>The visitor as the CDN saw them (before your servers)</td></tr>
<tr><td><code>EdgeResponseStatus</code> vs <code>OriginResponseStatus</code></td><td>Did the edge answer itself (cache, WAF block 403, 52x "origin unreachable") or forward the origin's answer?</td></tr>
<tr><td><code>CacheCacheStatus</code></td><td>hit/miss/expired — why some users see old content</td></tr>
<tr><td><code>SecurityAction</code> / WAF rule id</td><td>block, managed challenge, skip; which rule matched</td></tr>
</tbody></table>
<p>Requests blocked at the edge <strong>never reach your access log</strong>. When a user says "I get 403" and your nginx shows nothing, look in the CDN's security events first.</p>

<h3>Hacker's corner</h3>
<p>Three uses of the same weakness: (1) bypassing per-IP rate limits and lockouts on login, OTP and password-reset endpoints (step 5); (2) bypassing IP allowlists — an admin panel "only for 10.0.0.0/8" that reads the first XFF value; (3) poisoning the audit trail — the incident responder blames 203.0.113.7, an address from the documentation range, while the real attacker is never recorded. Defence: decide the client IP in exactly one place (the proxy closest to your app), from a list of trusted senders; log the TCP peer and the raw header; firewall the origin to the CDN.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, the customer is behind Cloudflare and "your server blocked our office":</strong> grep the origin log for their office IP — nothing? Then the block happened at the edge; ask for the Ray ID and look in Security Events.</li>
<li><strong>Your Spring Boot app logs <code>127.0.0.1</code> for every request:</strong> it sits behind nginx; set <code>server.forward-headers-strategy=framework</code> (or native), and make sure nginx overwrites, not appends, the header it forwards.</li>
<li><strong>A security review asks "how do you know the IP in your audit log is real?":</strong> show the nginx <code>set_real_ip_from</code> list, the origin firewall rule, and a log line with both <code>remote_addr</code> and <code>realip_remote_addr</code>.</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Rebuild the lab (<code>bash _demo/s13/chay-s13.bash</code> runs it; or the commands above). Send a request with <code>X-Forwarded-For: 10.0.0.1</code> to port 80 and to 8080. Which IP does the app report each time?</li>
<li>On port 80, change <code>app.set('trust proxy', true)</code> to <code>app.set('trust proxy', 2)</code> (two hops: edge + nginx). Retry the spoofed request.</li>
<li>Write an awk command that prints origin-log lines whose <code>ray=</code> is <code>-</code> (requests that did not come through the CDN).</li>
</ol>
<p><strong>Done when:</strong> 1 — port 80 reports <code>10.0.0.1</code> (spoofed; would pass an "internal only" check), port 8080 reports <code>10.113.0.66</code>/<code>.101</code>; 2 — with <code>2</code> Express skips exactly two trusted hops from the right and reports the real client, which shows why "number of hops" works only if the chain length never changes; 3 — e.g. <code>awk '$NF == "ray=-"' logs/goc-dung.log</code> prints the direct call of step 4.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['X-Forwarded-For', 'Header each proxy appends to: "client, proxy1, proxy2". Read from the right; the left end is client-controlled.'],
  ['CF-Connecting-IP', 'Single client address Cloudflare sets from the TCP connection; trustworthy only if the request came from Cloudflare.'],
  ['real_ip (nginx)', 'set_real_ip_from + real_ip_header: replace $remote_addr with a header value, only for listed senders.'],
  ['$realip_remote_addr', 'The original TCP peer before real_ip replaced it; log it for evidence.'],
  ['trust proxy (Express)', 'Which hops Express believes when computing req.ip; true = all (unsafe).'],
  ['Ray ID', 'Cloudflare\'s per-request id (hex + data-centre code), on error pages and in the cf-ray header; not guaranteed unique.'],
  ['origin lock-down', 'Firewall the origin so only the CDN\'s published ranges can connect.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Behind a proxy, <code>$remote_addr</code> is the proxy; the client is in a header.</li>
<li>Trust the header only from your proxies' addresses; overwrite, do not append, when you forward.</li>
<li>XFF is read right to left; the leftmost value is what the client typed.</li>
<li>Spoofed XFF defeats per-IP rate limits — real CVEs in 2025–2026; look for many one-shot IPs and the express-rate-limit warning.</li>
<li>Requests without a Ray ID at the origin skipped the CDN; lock the origin down.</li>
<li>Edge-blocked requests are only in the CDN's logs — check Security Events by Ray ID.</li>
</ul>
${nguon('📘', 'nginx ngx_http_realip_module', 'set_real_ip_from, real_ip_header, real_ip_recursive, $realip_remote_addr', 'https://nginx.org/en/docs/http/ngx_http_realip_module.html')}
${nguon('📘', 'Express — Behind proxies', 'The trust proxy setting and req.ip / req.ips', 'https://expressjs.com/en/guide/behind-proxies.html')}
${nguon('📘', 'Cloudflare — Restoring original visitor IPs', 'CF-Connecting-IP, X-Forwarded-For, server configuration', 'https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/')}
${nguon('📘', 'Cloudflare — Ray ID', 'Where to find it, Security Events, not guaranteed unique', 'https://developers.cloudflare.com/fundamentals/reference/cloudflare-ray-id/')}
${nguon('🛡️', 'GHSA-wjx2-9fpq-8997 — Ghost-CLI IP spoofing (CVE-2026-25552)', '$proxy_add_x_forwarded_for lets attackers bypass rate limiting', 'https://github.com/TryGhost/Ghost-CLI/security/advisories/GHSA-wjx2-9fpq-8997')}
${nguon('🛡️', 'GHSA-hm36-ffrh-c77c — Litestar rate-limit bypass (CVE-2025-59152)', 'X-Forwarded-For trusted unconditionally', 'https://github.com/litestar-org/litestar/security/advisories/GHSA-hm36-ffrh-c77c')}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-1-log-mac-dinh-bo-sot', title: 'nginx 10.1 — What the default log misses', sub: 'Configuring the log format', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Sau proxy, khách nào cũng cùng một IP — trừ khi bạn đọc đúng header, từ đúng người gửi</h2>
<p class="lead">Gần như mọi ứng dụng web chạy thật đều đứng sau một thứ gì đó: CDN như Cloudflare hay CloudFront, bộ cân bằng tải, ingress, ít nhất là một nginx. Kết nối TCP mà máy chủ của bạn thấy đến từ proxy đó, nên <code>$remote_addr</code> trong access log là địa chỉ của proxy. Địa chỉ của khách đi trong một <strong>header</strong> — mà header thì ai cũng viết được. Bài này dựng chuỗi đó thật và đọc nó ở từng chặng.</p>
<p><strong>Về lab:</strong> bạn không chạy được Cloudflare trên laptop, nên một container nginx đóng vai "biên". Nó làm đúng những gì Cloudflare mô tả trong tài liệu: thêm <code>CF-Connecting-IP</code>, nối vào <code>X-Forwarded-For</code>, gắn cho mỗi request một mã <code>CF-Ray</code>. Mọi thứ còn lại (module <code>realip</code> của nginx, <code>trust proxy</code> của Express 5, express-rate-limit) là phần mềm thật bạn sẽ gặp khi đi làm.</p>

<h3>Liên tưởng đời thường: kiện hàng ba lớp nhãn</h3>
<p>Một kiện hàng đi từ người gửi tới bưu cục, rồi tới trung tâm phân loại, rồi tới bạn. Mỗi bưu cục dán nhãn của mình lên trên cùng: "nhận từ bưu cục A". Nhãn dưới cùng — do người gửi viết — ghi "từ: ông Thật Thà". Nhãn của những bưu cục bạn tin là thật. Nhãn của người gửi thì người gửi muốn viết gì cũng được. Đọc kiện hàng cho đúng nghĩa là: bắt đầu từ trên cùng, chỉ tin nhãn do bưu cục bạn biết dán, và dừng ở nhãn đầu tiên bạn không thể bảo đảm.</p>

<h3>Lab</h3>
${ma('nginx', 's13/proxy/edge.conf')}
${ma('nginx', 's13/proxy/origin.conf')}
${ma('js', 's13/proxy/app.mjs')}
${lenh('s13/proxy', 0)}
<p>Sơ đồ IP: <code>10.113.0.5</code> biên (CDN), <code>.10</code> nginx gốc, <code>.20</code> ứng dụng, <code>.101</code> một khách lương thiện, <code>.66</code> kẻ tấn công. <code>khach IP …</code> chạy curl từ một container thật sự mang IP nguồn đó. Cổng 80 của máy gốc là cấu hình <em>sai</em> hay gặp; cổng 8080 là cấu hình <em>đúng</em>.</p>

<h3>Bước 1 — khách lương thiện, nhìn từ ba log</h3>
${lenh('s13/proxy', 4)}
${lenh('s13/proxy', 5)}
${lenh('s13/proxy', 6)}
<ul>
<li>Máy gốc cấu hình sai (<code>goc-sai.log</code>): <code>$remote_addr = 10.113.0.5</code>. Mọi khách trên đời đều thành địa chỉ của CDN. Báo cáo "10 IP nhiều nhất" chỉ có một dòng; chặn IP đó là chặn tất cả.</li>
<li>Máy gốc cấu hình đúng (<code>goc-dung.log</code>): <code>10.113.0.101</code>, còn <code>real_from=10.113.0.5</code> giữ lại đầu TCP ban đầu (<code>$realip_remote_addr</code>) — log cả hai, bạn sẽ cần chứng minh proxy nào đã chuyển request tới.</li>
<li>Log ứng dụng thấy cùng một khách ở cả hai cổng — tạm thời là vậy. Để ý <code>ips</code> ở cổng 3000: <code>["10.113.0.101","10.113.0.5"]</code>, cả chuỗi mà Express đã tin.</li>
</ul>

<h3>Bước 2 — đọc X-Forwarded-For: từ phải sang trái</h3>
<p><code>X-Forwarded-For: khách, proxy1, proxy2</code> — mỗi proxy <strong>nối thêm</strong> địa chỉ mà nó nhận kết nối từ đó (<code>$proxy_add_x_forwarded_for</code> trong nginx). Các phần tử bên phải do chính proxy của bạn viết nên là thật. Phần tử bên trái nhất là thứ đến đầu tiên — có thể do khách tự gõ. Đọc đúng: đi từ bên phải, bỏ qua địa chỉ của các proxy bạn tin, địa chỉ đầu tiên không phải của bạn chính là khách.</p>

<h3>Bước 3 — kẻ tấn công tự viết header</h3>
${lenh('s13/proxy', 7)}
${lenh('s13/proxy', 8)}
${lenh('s13/proxy', 9)}
<p>Kẻ tấn công ở <code>10.113.0.66</code> gửi <code>X-Forwarded-For: 203.0.113.7</code>. Biên ghi lại là <code>xff_vao="203.0.113.7"</code> và nối thêm đầu TCP thật: <code>203.0.113.7, 10.113.0.66</code>. Rồi:</p>
<ul>
<li>Cổng 80 → app 3000 với <code>trust proxy = true</code>: Express tin <em>mọi</em> chặng và lấy phần tử trái nhất: <strong><code>ip = 203.0.113.7</code></strong>. Ứng dụng trả lời "bạn là 203.0.113.7", log 203.0.113.7, và sẽ giới hạn tốc độ, định vị và kiểm toán 203.0.113.7. Kẻ tấn công tự chọn danh tính cho mình.</li>
<li>Cổng 8080: nginx lấy địa chỉ khách từ <code>CF-Connecting-IP</code> (biên đặt nó từ đầu TCP, nên khách không giả được) <em>bởi vì</em> request đến từ <code>10.113.0.5</code>, rồi <strong>ghi đè</strong> X-Forwarded-For bằng đúng một địa chỉ đó; Express chỉ tin nginx. Kết quả: <code>10.113.0.66</code>, sự thật. Giá trị giả vẫn thấy được trong trường <code>xff=</code> của log máy gốc — đó là bằng chứng, không phải danh tính.</li>
</ul>

<h3>Bước 4 — đi vòng CDN: gọi thẳng máy gốc</h3>
${lenh('s13/proxy', 10)}
<p>Kẻ tấn công tìm ra địa chỉ máy gốc (bản ghi DNS cũ, nhật ký certificate transparency, header của một email) và gửi cả hai header thẳng tới <code>10.113.0.10</code>. nginx lờ chúng đi: <code>set_real_ip_from</code> chỉ liệt kê biên, mà kết nối này đến từ <code>.66</code> (<code>real_from=10.113.0.66</code>, <code>ray=-</code> — không CDN nào chạm vào nó). Request tới máy gốc mà không có Ray ID tự nó đã là một tín hiệu: trên production, tường lửa của máy gốc chỉ nên nhận cổng 80/443 <em>từ</em> các dải IP của CDN.</p>

<h3>Bước 5 — vì sao quan trọng: giới hạn đăng nhập không bao giờ kích hoạt</h3>
${lenh('s13/proxy', 11)}
${lenh('s13/proxy', 12)}
${lenh('s13/proxy', 13)}
${lenh('s13/proxy', 14)}
<p>Cùng 8 lần đoán mật khẩu từ cùng một máy, mỗi lần một <code>X-Forwarded-For</code> giả khác nhau. Cấu hình sai: 8 lần 401 và không có 429 nào — bộ giới hạn (5 lần mỗi phút mỗi IP) thấy tám "khách" khác nhau, mỗi khách một lần. Cấu hình đúng: năm lần 401, rồi <strong>429 Too Many Requests</strong>. Log ứng dụng cho biết bạn đang ở tình huống nào: tám IP thuộc dải tài liệu, mỗi IP đúng một lần thử, là dấu vân tay của việc giả header. express-rate-limit còn tự ghi một cảnh báo vào log ngay request đầu tiên — <code>ValidationError: The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting</code>. Hôm nay hãy tìm dòng này trong log của bạn.</p>
<div class="pitfall co-tieu-de"><p><strong>Đây không phải chuyện lạ chỉ có trong lab.</strong> CVE-2026-25552 (Ghost-CLI trước 1.30.1, công bố tháng 7/2026): cấu hình nginx sinh ra cho Ghost tự cài dùng <code>$proxy_add_x_forwarded_for</code>, nên kẻ tấn công chèn được bất kỳ địa chỉ nào lên đầu và vượt giới hạn tốc độ của Ghost — đúng y cổng 80 ở trên. CVE-2025-59152 (Litestar 2.17.0, CVSS 7.5): RateLimitMiddleware tin X-Forwarded-For vô điều kiện; mỗi giá trị giả có một "xô" đếm riêng. Cùng một gốc rễ: ra quyết định bảo mật dựa trên một header do khách điều khiển (CWE-807).</p></div>

<h3>Bước 6 — Ray ID: từ ảnh chụp màn hình của khách tới đúng dòng log</h3>
${lenh('s13/proxy', 15)}
${lenh('s13/proxy', 16)}
${lenh('s13/proxy', 17)}
<p>Khách gửi một ảnh chụp: "trang lỗi, Ray ID: 2e6e…-SIN". Biên, access log của máy gốc và (nếu ứng dụng log header này) log ứng dụng đều mang cùng mã. Một lệnh grep cho thấy biên trả 502 vì upstream của máy gốc (ứng dụng) đang tắt. Với lỗi 500 trước đó ở <code>/loi</code>, cùng mã dẫn tới dòng JSON của ứng dụng. Ray ID thật của Cloudflare thường trông như một dãy chữ số hex theo sau là mã trung tâm dữ liệu (<code>…-SIN</code> = Singapore); nó hiện trên trang lỗi của Cloudflare và trong header <code>cf-ray</code> (Cloudflare cũng gửi nó tới máy gốc của bạn), và bạn lọc <strong>Security Events</strong> trên dashboard theo nó để xem WAF đã chặn, thử thách hay cho request đi qua. Hai lưu ý từ chính tài liệu Cloudflare: Ray ID <em>không bảo đảm duy nhất</em> (nối theo Ray ID + thời gian), và Security Events có thể chỉ hiện dữ liệu <em>lấy mẫu</em>. Nó chính là request id của bài 10.4, chỉ là do người khác cấp.</p>

<h3>Bước 7 — cấu hình niềm tin từ danh sách CDN công bố</h3>
${lenh('s13/proxy', 18)}
${lenh('s13/proxy', 19)}
<p>Cloudflare công bố các dải IP của mình (hôm nay là 15 dải IPv4, cộng thêm <code>/ips-v6</code>); chúng hiếm khi đổi nhưng có đổi, nên hãy sinh tệp include của nginx từ danh sách đó trong quy trình deploy thay vì chép một lần rồi thôi. Quy tắc này đúng với mọi proxy: AWS ALB/CloudFront, Azure Front Door, ingress của Kubernetes — chỉ tin header khi đến từ địa chỉ của proxy, và log đầu TCP bên cạnh nó.</p>

<h3>Log của CDN cho thêm gì (mức nhận biết)</h3>
<table>
<thead><tr><th>Trường (tên theo Cloudflare)</th><th>Cho bạn biết gì</th></tr></thead>
<tbody>
<tr><td><code>RayID</code></td><td>Khoá nối giữa log biên, log máy gốc và log ứng dụng</td></tr>
<tr><td><code>ClientIP</code>, <code>ClientCountry</code>, <code>ClientASN</code></td><td>Khách như CDN thấy (trước khi tới máy chủ của bạn)</td></tr>
<tr><td><code>EdgeResponseStatus</code> so với <code>OriginResponseStatus</code></td><td>Biên tự trả lời (cache, WAF chặn 403, 52x "không tới được máy gốc") hay chuyển tiếp câu trả lời của máy gốc?</td></tr>
<tr><td><code>CacheCacheStatus</code></td><td>hit/miss/expired — vì sao có người thấy nội dung cũ</td></tr>
<tr><td><code>SecurityAction</code> / mã quy tắc WAF</td><td>block, managed challenge, skip; quy tắc nào đã khớp</td></tr>
</tbody></table>
<p>Request bị chặn ở biên <strong>không bao giờ tới access log của bạn</strong>. Khi người dùng nói "tôi bị 403" mà nginx của bạn không có gì, hãy xem security events của CDN trước.</p>

<h3>Góc hacker</h3>
<p>Ba cách dùng cùng một điểm yếu: (1) vượt giới hạn tốc độ và khoá tài khoản theo IP ở các điểm đăng nhập, OTP, đặt lại mật khẩu (bước 5); (2) vượt danh sách IP cho phép — một trang quản trị "chỉ cho 10.0.0.0/8" mà đọc giá trị XFF đầu tiên; (3) đầu độc dấu vết kiểm toán — người điều tra sự cố đổ lỗi cho 203.0.113.7, một địa chỉ thuộc dải tài liệu, còn kẻ tấn công thật thì không bao giờ được ghi lại. Phòng: quyết định IP của khách ở đúng một nơi (proxy gần ứng dụng nhất), dựa trên danh sách người gửi đáng tin; log đầu TCP và header thô; dùng tường lửa khoá máy gốc chỉ cho CDN.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, khách đứng sau Cloudflare và báo "máy chủ bên anh chặn văn phòng bọn em":</strong> grep log máy gốc tìm IP văn phòng của họ — không có gì? Vậy là bị chặn ở biên; xin Ray ID và tra trong Security Events.</li>
<li><strong>App Spring Boot của bạn log <code>127.0.0.1</code> cho mọi request:</strong> nó đứng sau nginx; đặt <code>server.forward-headers-strategy=framework</code> (hoặc native), và bảo đảm nginx ghi đè chứ không nối thêm header mà nó chuyển đi.</li>
<li><strong>Buổi rà soát bảo mật hỏi "làm sao anh biết IP trong log kiểm toán là thật?":</strong> đưa ra danh sách <code>set_real_ip_from</code> của nginx, luật tường lửa của máy gốc, và một dòng log có cả <code>remote_addr</code> lẫn <code>realip_remote_addr</code>.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng lại lab (<code>bash _demo/s13/chay-s13.bash</code> sẽ chạy nó; hoặc các lệnh ở trên). Gửi một request có <code>X-Forwarded-For: 10.0.0.1</code> tới cổng 80 và tới 8080. Mỗi lần ứng dụng báo IP nào?</li>
<li>Ở cổng 80, đổi <code>app.set('trust proxy', true)</code> thành <code>app.set('trust proxy', 2)</code> (hai chặng: biên + nginx). Gửi lại request giả.</li>
<li>Viết một lệnh awk in các dòng log máy gốc có <code>ray=</code> là <code>-</code> (request không đi qua CDN).</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 — cổng 80 báo <code>10.0.0.1</code> (giả; sẽ lọt kiểm tra "chỉ nội bộ"), cổng 8080 báo <code>10.113.0.66</code>/<code>.101</code>; câu 2 — với <code>2</code>, Express bỏ đúng hai chặng tin cậy tính từ phải và báo khách thật, cho thấy vì sao "số chặng" chỉ đúng khi độ dài chuỗi không bao giờ đổi; câu 3 — ví dụ <code>awk '$NF == "ray=-"' logs/goc-dung.log</code> in ra lời gọi thẳng ở bước 4.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['X-Forwarded-For', 'Header mỗi proxy nối thêm vào: "khách, proxy1, proxy2". Đọc từ phải; đầu bên trái do khách điều khiển.'],
  ['CF-Connecting-IP', 'Một địa chỉ khách duy nhất Cloudflare đặt từ kết nối TCP; chỉ đáng tin khi request đến từ Cloudflare.'],
  ['real_ip (nginx)', 'set_real_ip_from + real_ip_header: thay $remote_addr bằng giá trị header, chỉ với người gửi có tên trong danh sách.'],
  ['$realip_remote_addr', 'Đầu TCP ban đầu trước khi real_ip thay thế; log nó để làm bằng chứng.'],
  ['trust proxy (Express)', 'Express tin những chặng nào khi tính req.ip; true = tin tất cả (không an toàn).'],
  ['Ray ID', 'Mã theo từng request của Cloudflare (hex + mã trung tâm dữ liệu), trên trang lỗi và trong header cf-ray; không bảo đảm duy nhất.'],
  ['khoá máy gốc', 'Dùng tường lửa để chỉ các dải IP CDN công bố mới kết nối được tới máy gốc.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sau proxy, <code>$remote_addr</code> là proxy; khách nằm trong một header.</li>
<li>Chỉ tin header từ địa chỉ của proxy của bạn; khi chuyển tiếp thì ghi đè, đừng nối thêm.</li>
<li>XFF đọc từ phải sang trái; giá trị trái nhất là thứ khách tự gõ.</li>
<li>XFF giả đánh bại giới hạn theo IP — CVE thật năm 2025–2026; tìm nhiều IP chỉ thử một lần và cảnh báo của express-rate-limit.</li>
<li>Request tới máy gốc không có Ray ID là đã đi vòng CDN; hãy khoá máy gốc.</li>
<li>Request bị chặn ở biên chỉ có trong log của CDN — tra Security Events theo Ray ID.</li>
</ul>
${nguon('📘', 'nginx ngx_http_realip_module', 'set_real_ip_from, real_ip_header, real_ip_recursive, $realip_remote_addr', 'https://nginx.org/en/docs/http/ngx_http_realip_module.html')}
${nguon('📘', 'Express — Behind proxies', 'Thiết lập trust proxy và req.ip / req.ips', 'https://expressjs.com/en/guide/behind-proxies.html')}
${nguon('📘', 'Cloudflare — Restoring original visitor IPs', 'CF-Connecting-IP, X-Forwarded-For, cấu hình máy chủ', 'https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/')}
${nguon('📘', 'Cloudflare — Ray ID', 'Nơi tìm thấy, Security Events, không bảo đảm duy nhất', 'https://developers.cloudflare.com/fundamentals/reference/cloudflare-ray-id/')}
${nguon('🛡️', 'GHSA-wjx2-9fpq-8997 — Ghost-CLI giả mạo IP (CVE-2026-25552)', '$proxy_add_x_forwarded_for cho phép vượt giới hạn tốc độ', 'https://github.com/TryGhost/Ghost-CLI/security/advisories/GHSA-wjx2-9fpq-8997')}
${nguon('🛡️', 'GHSA-hm36-ffrh-c77c — Litestar vượt giới hạn tốc độ (CVE-2025-59152)', 'Tin X-Forwarded-For vô điều kiện', 'https://github.com/litestar-org/litestar/security/advisories/GHSA-hm36-ffrh-c77c')}
${lienKet({ khoa: 'nginx', bai: 'nginx-10-1-log-mac-dinh-bo-sot', title: 'nginx 10.1 — Log mặc định bỏ sót gì', sub: 'Cấu hình định dạng log', cta: 'Mở bài' })}
</div>
`,
};
