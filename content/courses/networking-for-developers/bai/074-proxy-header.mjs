/**
 * Chương 7 · 7.5 — Proxy trên đường đi: X-Forwarded-For, Host và IP thật của người dùng (slug khung netdev-7-5-proxy-header).
 * Output thật: lab/out/c75-*.out.txt (dựng lại: bash lab/code/dung-output-ch7.sh).
 */
import { run, card, kv, code, cmd } from '../_ui.mjs';
import G from '../giang/nfd-07-5.mjs';

const L = card;

export default {
  title: '7.5 — Proxies in the path: X-Forwarded-For, Host and the real client IP|||7.5 — Proxy trên đường đi: X-Forwarded-For, Host và IP thật của người dùng',
  slug: 'netdev-7-5-proxy-header',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sau một chuỗi proxy (Cloudflare → nginx → app), app thấy IP của PROXY (seenFrom), IP client thật chỉ sống trong X-Forwarded-For; XFF nối chuỗi (client, proxy1, proxy2 từ trái); client GIẢ được XFF nên phải trust proxy đúng (Express = số chặng; sau Cloudflare dùng CF-Connecting-IP); Host/X-Forwarded-Proto cũng đi trong header; sự cố thật: rate limiter đọc nhầm IP → cấm cả làng 429.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Proxies in the path: X-Forwarded-For, Host and the real client IP</h2>
<p class="lead">Almost no production app talks to its users directly. There is a CDN at the edge, a load balancer, an nginx — often all three — between the browser and your code. That stack is great for TLS, caching and scaling, but it quietly breaks one thing your app took for granted: the client’s IP address. By the time a request reaches your handler, the TCP connection came from the <em>proxy next to you</em>, not the user — and getting the real client IP back is a question of which headers you trust. This lesson measures exactly what your app sees, follows the real IP through a proxy chain, and ends with a real outage: a rate limiter that banned every user at once because it trusted the wrong IP.</p>

<h3>Your app sees the proxy, not the user</h3>
<p>The lab’s API echoes the connection it received. Call it through nginx and look:</p>
${cmd('# client 10.10.1.10 → nginx (web) 10.10.2.10 → api 10.10.2.20', 'docker exec nfd-client curl -s http://10.10.2.10/api/who')}
${run('c75-xff', 'curl', 1, { max: 8 })}
<ul>
<li><code>seenFrom</code> is <code>10.10.2.10</code> — <strong>nginx</strong>. The TCP connection to your app was opened by the proxy, so <code>req.socket.remoteAddress</code> is the proxy’s IP, not the user’s. This is not a bug; it is how proxies work.</li>
<li>The <strong>real</strong> client IP, <code>10.10.1.10</code>, survives only because nginx copied it into the <strong>X-Forwarded-For</strong> header before forwarding. Remove that header and your app simply cannot know who the user is.</li>
</ul>

<h3>The chain: Cloudflare → nginx → app</h3>
<p>In a real deployment the hops stack up, and each one only ever sees the <em>previous</em> hop as its TCP peer:</p>
<table>
<tr><th>Hop</th><th>TCP source it sees</th><th>Adds / keeps</th></tr>
<tr><td><strong>Cloudflare</strong> (edge)</td><td>the user</td><td>sets <code>CF-Connecting-IP</code> = user; starts <code>X-Forwarded-For</code></td></tr>
<tr><td><strong>nginx</strong> (your server)</td><td>Cloudflare</td><td>appends Cloudflare’s IP to <code>X-Forwarded-For</code></td></tr>
<tr><td><strong>your app</strong></td><td>nginx</td><td>reads <code>X-Forwarded-For</code> to recover the user</td></tr>
</table>
<p>The user’s IP is no longer something the network tells you — it is <strong>data</strong>, passed hop to hop in a header. That means it is exactly as trustworthy as the proxy that set it, which is the whole problem below.</p>

<h3>X-Forwarded-For chains</h3>
<p>Put two proxies in front of the app and the header becomes a list:</p>
${run('c75-chain', 'curl', 1, { max: 8 })}
<p><code>forwardedFor</code> is <code>10.10.1.10, 10.10.2.10</code> — “<strong>client, then proxy1</strong>”. Each proxy <strong>appends</strong> the address it saw as its own TCP peer, so the list grows left-to-right from the original client outward. In principle the <strong>leftmost</strong> entry is the real client — but only if every hop that added to the list is honest.</p>

<h3>Trust the right hop, or get spoofed</h3>
<p>Here is the trap: <strong>anyone can send an <code>X-Forwarded-For</code> header</strong>. A malicious client can put <code>X-Forwarded-For: 1.2.3.4</code> (or the IP of an admin, or a trusted internal address) on its request. If your app blindly reads the <em>leftmost</em> value, the attacker has just impersonated any IP they like — bypassing IP allow-lists, poisoning rate limits, and faking audit logs.</p>
${code(`// Express — trust exactly the proxies in front of you, by count
// one nginx in front of the app:
app.set('trust proxy', 1);
// now req.ip is the entry one hop in from the right — the real client
// behind Cloudflare, prefer the header Cloudflare sets and the client cannot forge:
const realIp = req.headers['cf-connecting-ip'] || req.ip;`, 'js')}
<ul>
<li>Only trust <code>X-Forwarded-For</code> entries added by <strong>proxies you control</strong>. Count from the <strong>right</strong> (the hop nearest you): skip your known proxies, and the next entry is the real client.</li>
<li>In Express, <code>app.set('trust proxy', n)</code> where <code>n</code> is the number of trusted hops — <strong>not</strong> <code>true</code>, which trusts the whole chain, including the attacker’s forged left-hand entries.</li>
<li>Behind Cloudflare, use <strong><code>CF-Connecting-IP</code></strong>: Cloudflare sets it to the real client and a client cannot forge it (Cloudflare overwrites it).</li>
</ul>

<h3>The outage: a rate limiter banned everyone</h3>
<p>This is a real and common failure. A service puts a rate limiter in front of its API, keyed on the client IP from <code>X-Forwarded-For</code> — but <code>trust proxy</code> is misconfigured, so the limiter reads the <strong>wrong</strong> entry: the <em>proxy’s</em> IP, which is the <strong>same for every user</strong> behind that proxy. One busy user makes a burst of requests, trips the limit, and because the key is the shared proxy IP, <strong>every user behind the proxy gets 429</strong> at once. The site appears down for everyone while the servers are idle.</p>
<p>The fix is to configure <code>trust proxy</code> (or read <code>CF-Connecting-IP</code>) so the limiter keys on the <strong>real client IP</strong> — and, crucially, to <strong>test from behind the real proxy chain</strong>, not against the origin directly where the IPs look correct and the bug is invisible. (cuongthai.com hit a 429 problem of exactly this shape.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Everything “real” about a request is a header behind a proxy — trust deliberately.</strong> The real client IP (<code>X-Forwarded-For</code> / <code>CF-Connecting-IP</code>), the original scheme (<code>X-Forwarded-Proto</code> — did the user use HTTPS?), and the original host (<code>Host</code> / <code>X-Forwarded-Host</code>) all travel in headers set by proxies. An app that builds redirect URLs, sets secure cookies, or enforces HTTPS by reading the <em>direct</em> connection will get it wrong behind a proxy: it sees HTTP from nginx even though the user used HTTPS. Read the forwarded headers, and trust only the proxies you control.</p>
</div>

<h3>Host: which site, through the proxy</h3>
<p>The <code>Host</code> header (lesson 7.1) tells the final server which virtual host the user wanted. A proxy must <strong>forward the original Host</strong> (nginx’s <code>proxy_set_header Host $host</code>) or the backend may serve the wrong vhost, and any absolute URL the app builds from <code>Host</code> (redirects, canonical links, emails) will point at the wrong place. When the proxy changes the host, it should pass the original in <code>X-Forwarded-Host</code>. Same lesson as the IP: behind a proxy, read the forwarded values, not the connection in front of you.</p>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after putting the API behind a load balancer, your rate limiter starts returning 429 to <em>everyone</em> during a traffic spike, and your audit log shows the same IP for every request. Diagnose and fix.</p>
<ol>
<li>Through one proxy: <code>curl http://10.10.2.10/api/who</code> and note <code>seenFrom</code> (the proxy) vs <code>forwardedFor</code> (the client). Explain why the app sees the proxy.</li>
<li>Through two proxies: <code>curl http://10.10.2.10:8090/api/who</code> and read the <code>X-Forwarded-For</code> list. Which entry is the real client? Which is a proxy?</li>
<li>Explain the 429 outage: if the limiter keys on the wrong XFF entry, what does every user share, and what happens when one is busy?</li>
<li>Write the fix (Express <code>trust proxy</code> / <code>CF-Connecting-IP</code>) and say how you would test it.</li>
</ol>
<p><strong>Done when:</strong> you can point at <code>seenFrom</code>=proxy and the XFF list, correctly identify the real client in the chain, and explain that a limiter on the proxy IP bans everyone — fixed by trusting the right hop and tested behind the real chain.</p>
<details><summary>Solution</summary>
<p>Through one proxy, <code>seenFrom</code> is the proxy’s IP and <code>forwardedFor</code> is the client’s. Through two, <code>forwardedFor</code> is <code>client, proxy1</code>; the leftmost is the real client, the rest are proxies. The 429 outage: the limiter keyed on the proxy’s IP, which every user shares, so one busy user’s burst banned everyone. Fix: set <code>trust proxy</code> to the number of trusted proxies (or read <code>CF-Connecting-IP</code>) so the limiter keys on the real client IP; test from behind the actual proxy chain, where the bug is visible, not against the origin.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['X-Forwarded-For (XFF)', 'A header carrying the client IP(s) through proxies; each proxy appends the peer it saw.'],
  ['CF-Connecting-IP', 'Cloudflare’s header with the real client IP; a client cannot forge it.'],
  ['trust proxy', 'A setting (e.g. Express) telling the app how many front proxies to trust when reading XFF.'],
  ['seenFrom (TCP peer)', 'The address your app’s socket reports — the proxy’s IP, not the user’s, behind a proxy.'],
  ['X-Forwarded-Proto', 'The original scheme (http/https) the user used, carried through the proxy.'],
  ['X-Forwarded-Host', 'The original Host the user requested, when a proxy rewrites Host.'],
  ['spoofing (giả mạo)', 'A client forging X-Forwarded-For to impersonate an IP; defeated by trusting only your proxies.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Your app sees the proxy’s TCP IP; the real client IP survives only in <code>X-Forwarded-For</code>.</li>
<li>XFF chains: each proxy appends; the list reads client, proxy1, proxy2… from the left.</li>
<li>Clients can spoof XFF — trust only entries added by proxies you control (Express <code>trust proxy</code> = hop count).</li>
<li>Behind Cloudflare use <code>CF-Connecting-IP</code>; forward the original <code>Host</code> and <code>X-Forwarded-Proto</code> too.</li>
<li>A rate limiter on the wrong IP bans everyone behind a proxy (a real 429 outage) — test behind the real chain.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For', '📘', 'MDN — X-Forwarded-For', 'How the client IP is carried through proxies, and the spoofing caveat.', 'Open')}
${L('https://expressjs.com/en/guide/behind-proxies.html', '📘', 'Express — Express behind proxies', 'The trust proxy setting and how req.ip is computed.', 'Open')}
${L('https://developers.cloudflare.com/fundamentals/reference/http-headers/', '📘', 'Cloudflare — HTTP request headers', 'CF-Connecting-IP and the headers Cloudflare adds.', 'Open')}
${L('https://adam-p.ca/blog/2022/03/x-forwarded-for/', '📝', 'The perils of the “real” client IP', 'Why trusting X-Forwarded-For naively leads to spoofing and outages.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Proxy trên đường đi: X-Forwarded-For, Host và IP thật của người dùng</h2>
<p class="lead">Gần như không app sản xuất nào nói với người dùng trực tiếp. Có một CDN ở biên, một bộ cân bằng tải, một nginx — thường cả ba — giữa trình duyệt và code của bạn. Ngăn xếp đó tuyệt cho TLS, cache và mở rộng, nhưng nó âm thầm làm hỏng một thứ app của bạn tưởng đương nhiên: địa chỉ IP của client. Khi một yêu cầu tới handler của bạn, kết nối TCP đến từ <em>proxy cạnh bạn</em>, không phải người dùng — và lấy lại IP client thật là chuyện bạn tin header nào. Bài này đo chính xác app của bạn thấy gì, lần IP thật qua một chuỗi proxy, và kết bằng một sự cố thật: một bộ giới hạn tốc độ cấm mọi người dùng cùng lúc vì tin nhầm IP.</p>

<h3>App của bạn thấy proxy, không phải người dùng</h3>
<p>API của lab vọng lại kết nối nó nhận. Gọi nó qua nginx và nhìn:</p>
${cmd('# client 10.10.1.10 → nginx (web) 10.10.2.10 → api 10.10.2.20', 'docker exec nfd-client curl -s http://10.10.2.10/api/who')}
${run('c75-xff', 'curl', 1, { max: 8 })}
<ul>
<li><code>seenFrom</code> là <code>10.10.2.10</code> — <strong>nginx</strong>. Kết nối TCP tới app của bạn do proxy mở, nên <code>req.socket.remoteAddress</code> là IP của proxy, không phải người dùng. Đây không phải lỗi; đó là cách proxy hoạt động.</li>
<li>IP client <strong>thật</strong>, <code>10.10.1.10</code>, sống sót chỉ vì nginx chép nó vào header <strong>X-Forwarded-For</strong> trước khi chuyển tiếp. Bỏ header đó và app của bạn đơn giản không biết ai là người dùng.</li>
</ul>

<h3>Chuỗi: Cloudflare → nginx → app</h3>
<p>Trong một triển khai thật các chặng xếp chồng, và mỗi cái chỉ bao giờ thấy chặng <em>trước</em> là peer TCP của nó:</p>
<table>
<tr><th>Chặng</th><th>Nguồn TCP nó thấy</th><th>Thêm / giữ</th></tr>
<tr><td><strong>Cloudflare</strong> (biên)</td><td>người dùng</td><td>đặt <code>CF-Connecting-IP</code> = người dùng; bắt đầu <code>X-Forwarded-For</code></td></tr>
<tr><td><strong>nginx</strong> (máy chủ của bạn)</td><td>Cloudflare</td><td>thêm IP của Cloudflare vào <code>X-Forwarded-For</code></td></tr>
<tr><td><strong>app của bạn</strong></td><td>nginx</td><td>đọc <code>X-Forwarded-For</code> để khôi phục người dùng</td></tr>
</table>
<p>IP của người dùng không còn là thứ mạng cho bạn biết — nó là <strong>dữ liệu</strong>, truyền chặng này qua chặng kia trong một header. Nghĩa là nó đáng tin đúng bằng proxy đã đặt nó, là toàn bộ vấn đề ở dưới.</p>

<h3>X-Forwarded-For nối chuỗi</h3>
<p>Đặt hai proxy trước app và header thành một danh sách:</p>
${run('c75-chain', 'curl', 1, { max: 8 })}
<p><code>forwardedFor</code> là <code>10.10.1.10, 10.10.2.10</code> — “<strong>client, rồi proxy1</strong>”. Mỗi proxy <strong>thêm</strong> địa chỉ nó thấy làm peer TCP của nó, nên danh sách lớn từ trái sang phải từ client gốc ra ngoài. Về nguyên tắc mục <strong>ngoài cùng bên trái</strong> là client thật — nhưng chỉ nếu mọi chặng đã thêm vào danh sách đều trung thực.</p>

<h3>Tin đúng chặng, hoặc bị giả mạo</h3>
<p>Đây là cái bẫy: <strong>ai cũng gửi được một header <code>X-Forwarded-For</code></strong>. Một client ác ý có thể đặt <code>X-Forwarded-For: 1.2.3.4</code> (hoặc IP của một admin, hoặc một địa chỉ nội bộ tin cậy) lên yêu cầu của nó. Nếu app của bạn đọc mù giá trị <em>ngoài cùng bên trái</em>, kẻ tấn công vừa giả bất kỳ IP nào nó thích — vượt danh sách cho phép IP, đầu độc giới hạn tốc độ, và làm giả log kiểm toán.</p>
${code(`// Express — tin đúng các proxy trước bạn, theo số lượng
// một nginx trước app:
app.set('trust proxy', 1);
// giờ req.ip là mục cách một chặng từ bên phải — client thật
// sau Cloudflare, ưu tiên header Cloudflare đặt mà client không giả được:
const realIp = req.headers['cf-connecting-ip'] || req.ip;`, 'js')}
<ul>
<li>Chỉ tin các mục <code>X-Forwarded-For</code> do <strong>proxy bạn điều khiển</strong> thêm. Đếm từ <strong>bên phải</strong> (chặng gần bạn nhất): bỏ các proxy đã biết, và mục kế là client thật.</li>
<li>Trong Express, <code>app.set('trust proxy', n)</code> với <code>n</code> là số chặng tin cậy — <strong>không</strong> phải <code>true</code>, thứ tin cả chuỗi, kể cả các mục bên trái giả của kẻ tấn công.</li>
<li>Sau Cloudflare, dùng <strong><code>CF-Connecting-IP</code></strong>: Cloudflare đặt nó là client thật và một client không giả được (Cloudflare ghi đè nó).</li>
</ul>

<h3>Sự cố: một bộ giới hạn tốc độ cấm cả làng</h3>
<p>Đây là một lỗi thật và thường gặp. Một dịch vụ đặt một bộ giới hạn tốc độ trước API, khoá theo IP client từ <code>X-Forwarded-For</code> — nhưng <code>trust proxy</code> cấu hình sai, nên bộ giới hạn đọc <strong>nhầm</strong> mục: IP của <em>proxy</em>, thứ <strong>giống nhau cho mọi người dùng</strong> sau proxy đó. Một người dùng bận tạo một loạt yêu cầu, chạm giới hạn, và vì khoá là IP proxy dùng chung, <strong>mọi người dùng sau proxy nhận 429</strong> cùng lúc. Site có vẻ sập với tất cả trong khi máy chủ rảnh.</p>
<p>Cách sửa là cấu hình <code>trust proxy</code> (hoặc đọc <code>CF-Connecting-IP</code>) để bộ giới hạn khoá theo <strong>IP client thật</strong> — và, quan trọng, <strong>thử từ sau chuỗi proxy thật</strong>, không phải với origin trực tiếp nơi các IP nhìn đúng và lỗi vô hình. (cuongthai.com từng gặp một vấn đề 429 đúng hình dạng này.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Mọi thứ “thật” của một yêu cầu là một header sau một proxy — tin có chủ ý.</strong> IP client thật (<code>X-Forwarded-For</code> / <code>CF-Connecting-IP</code>), scheme gốc (<code>X-Forwarded-Proto</code> — người dùng có dùng HTTPS không?), và host gốc (<code>Host</code> / <code>X-Forwarded-Host</code>) đều đi trong các header do proxy đặt. Một app dựng URL chuyển hướng, đặt cookie an toàn, hay ép HTTPS bằng cách đọc kết nối <em>trực tiếp</em> sẽ làm sai sau một proxy: nó thấy HTTP từ nginx dù người dùng dùng HTTPS. Đọc các header chuyển tiếp, và chỉ tin các proxy bạn điều khiển.</p>
</div>

<h3>Host: site nào, qua proxy</h3>
<p>Header <code>Host</code> (bài 7.1) bảo máy chủ cuối người dùng muốn host ảo nào. Một proxy phải <strong>chuyển tiếp Host gốc</strong> (<code>proxy_set_header Host $host</code> của nginx) hoặc backend có thể phục vụ sai vhost, và bất kỳ URL tuyệt đối nào app dựng từ <code>Host</code> (chuyển hướng, link chuẩn, email) sẽ trỏ sai chỗ. Khi proxy đổi host, nó nên truyền host gốc trong <code>X-Forwarded-Host</code>. Cùng bài học với IP: sau một proxy, đọc các giá trị chuyển tiếp, không phải kết nối trước mặt bạn.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau khi đặt API sau một bộ cân bằng tải, bộ giới hạn tốc độ của bạn bắt đầu trả 429 cho <em>mọi người</em> trong một đợt dồn, và log kiểm toán của bạn hiện cùng một IP cho mọi yêu cầu. Chẩn đoán và sửa.</p>
<ol>
<li>Qua một proxy: <code>curl http://10.10.2.10/api/who</code> và ghi <code>seenFrom</code> (proxy) so với <code>forwardedFor</code> (client). Giải thích vì sao app thấy proxy.</li>
<li>Qua hai proxy: <code>curl http://10.10.2.10:8090/api/who</code> và đọc danh sách <code>X-Forwarded-For</code>. Mục nào là client thật? Mục nào là proxy?</li>
<li>Giải thích sự cố 429: nếu bộ giới hạn khoá theo mục XFF sai, mọi người dùng chia sẻ cái gì, và chuyện gì xảy ra khi một người bận?</li>
<li>Viết cách sửa (Express <code>trust proxy</code> / <code>CF-Connecting-IP</code>) và nói cách bạn sẽ thử nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ được <code>seenFrom</code>=proxy và danh sách XFF, nhận ra đúng client thật trong chuỗi, và giải thích rằng một bộ giới hạn trên IP proxy cấm tất cả — sửa bằng cách tin đúng chặng và thử sau chuỗi thật.</p>
<details><summary>Lời giải</summary>
<p>Qua một proxy, <code>seenFrom</code> là IP của proxy và <code>forwardedFor</code> là của client. Qua hai, <code>forwardedFor</code> là <code>client, proxy1</code>; ngoài cùng bên trái là client thật, phần còn lại là proxy. Sự cố 429: bộ giới hạn khoá theo IP của proxy, thứ mọi người dùng chia sẻ, nên một loạt của một người dùng bận cấm tất cả. Sửa: đặt <code>trust proxy</code> bằng số proxy tin cậy (hoặc đọc <code>CF-Connecting-IP</code>) để bộ giới hạn khoá theo IP client thật; thử từ sau chuỗi proxy thật, nơi lỗi thấy được, không phải với origin.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['X-Forwarded-For (XFF)', 'Một header mang IP client qua các proxy; mỗi proxy thêm peer nó thấy.'],
  ['CF-Connecting-IP', 'Header của Cloudflare với IP client thật; một client không giả được.'],
  ['trust proxy', 'Một thiết lập (vd Express) bảo app tin bao nhiêu proxy trước khi đọc XFF.'],
  ['seenFrom (peer TCP)', 'Địa chỉ socket app báo — IP của proxy, không phải người dùng, sau một proxy.'],
  ['X-Forwarded-Proto', 'Scheme gốc (http/https) người dùng dùng, mang qua proxy.'],
  ['X-Forwarded-Host', 'Host gốc người dùng hỏi, khi một proxy viết lại Host.'],
  ['spoofing (giả mạo)', 'Một client giả X-Forwarded-For để mạo một IP; chặn bằng cách chỉ tin proxy của bạn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>App của bạn thấy IP TCP của proxy; IP client thật sống sót chỉ trong <code>X-Forwarded-For</code>.</li>
<li>XFF nối chuỗi: mỗi proxy thêm; danh sách đọc client, proxy1, proxy2… từ bên trái.</li>
<li>Client giả được XFF — chỉ tin các mục do proxy bạn điều khiển thêm (Express <code>trust proxy</code> = số chặng).</li>
<li>Sau Cloudflare dùng <code>CF-Connecting-IP</code>; chuyển tiếp <code>Host</code> gốc và <code>X-Forwarded-Proto</code> nữa.</li>
<li>Một bộ giới hạn tốc độ trên IP sai cấm tất cả sau một proxy (một sự cố 429 thật) — thử sau chuỗi thật.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-For', '📘', 'MDN — X-Forwarded-For', 'IP client được mang qua proxy ra sao, và cảnh báo giả mạo.', 'Mở')}
${L('https://expressjs.com/en/guide/behind-proxies.html', '📘', 'Express — Express sau proxy', 'Thiết lập trust proxy và cách req.ip được tính.', 'Mở')}
${L('https://developers.cloudflare.com/fundamentals/reference/http-headers/', '📘', 'Cloudflare — Header yêu cầu HTTP', 'CF-Connecting-IP và các header Cloudflare thêm.', 'Mở')}
${L('https://adam-p.ca/blog/2022/03/x-forwarded-for/', '📝', 'Hiểm hoạ của IP client “thật”', 'Vì sao tin X-Forwarded-For ngây thơ dẫn tới giả mạo và sự cố.', 'Mở')}
</div>
`,
};
