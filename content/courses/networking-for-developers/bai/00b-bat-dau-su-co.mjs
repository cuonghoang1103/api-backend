/**
 * Mục 0 · "Bắt đầu tại đây (2/2)" — sự cố thật có nguồn, tình huống minh hoạ của sinh viên, cách học không nản.
 * Slug giữ nguyên từ khung (netdev-0-9-bat-dau-hoc-xong); tiêu đề đổi theo luật hai bài mở đầu (31/10/2026).
 * Output thật: lab/out/c00-loi.out.txt (máy client của lab).
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-00-b.mjs';

const L = card;

export default {
  title: 'Start here (2/2) — Real outages, and how to learn networking without giving up|||Bắt đầu tại đây (2/2) — Những sự cố thật, và cách học mạng để không bỏ cuộc',
  slug: 'netdev-0-9-bat-dau-hoc-xong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảy sự cố thật có nguồn (Facebook, Dyn, YouTube, Let’s Encrypt, Slack, AWS và chính cuongthai.com), ba tình huống minh hoạ của sinh viên, cách đọc thông báo lỗi và lộ trình học tối thiểu/đầy đủ.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Real outages, and how to learn networking without giving up</h2>
<p class="lead">Networking feels abstract until you see what happens when it breaks. In this lesson we look at seven real incidents — from Facebook disappearing for six hours to this very website returning 502 for seven minutes — and ask the same three questions each time: what happened, which layer broke, and which chapter of this course would have helped you understand it. Then we turn to you: the bugs you are most likely to meet in a student project, and a study plan you can actually keep.</p>

<h3>1. Facebook, 4 October 2021 — the company that deleted itself from the Internet</h3>
<p><strong>What happened.</strong> During routine maintenance, a command meant to assess the capacity of Facebook's global backbone (the private network joining their data centres) accidentally took the backbone down. An audit tool that should have stopped the command had a bug. Facebook's DNS servers are built to stop announcing their addresses with <strong>BGP</strong> — the protocol networks use to tell each other "traffic for these addresses, send it to me" — when they cannot reach the data centres. That is exactly what they did.</p>
<p><strong>The consequence.</strong> The DNS servers were still running, but no route led to them, so nobody in the world could look up <code>facebook.com</code>, <code>instagram.com</code> or <code>whatsapp.net</code>. Seen from Cloudflare, routes began disappearing around 15:40 UTC and reappeared around 21:28 UTC — about six hours. Public resolvers handled about 30 times their usual number of queries, because every app and browser kept retrying. Engineers had to be sent to the data centres in person; many of their own internal tools depended on the same DNS.</p>
<p><strong>The layers.</strong> Routing (BGP) broke, and DNS — healthy but unreachable — went with it. You will meet BGP in lesson 2.5 and DNS in Chapter 3.</p>

<h3>2. Dyn, 21 October 2016 — when the phone book is attacked</h3>
<p>Dyn was a company that answered DNS questions for many of the largest websites. A botnet — tens of thousands of hacked cameras, home routers and baby monitors running the <strong>Mirai</strong> malware — flooded Dyn with traffic in three waves (roughly 11:10–13:20, 15:50–17:00 and 20:00–22:10 UTC). Twitter, GitHub, Netflix, Reddit, PayPal and many others were running perfectly; users in Europe and North America simply could not turn their names into addresses. <strong>Layer: DNS.</strong> Chapter 3 shows why a site should not depend on a single DNS provider.</p>

<h3>3. YouTube, 24 February 2008 — one wrong route</h3>
<p>Pakistan Telecom wanted to block YouTube inside Pakistan. It announced a route for <code>208.65.153.0/24</code>, part of YouTube's address block, inside its own network — but its upstream provider passed that announcement to the rest of the Internet. Because the route was <em>more specific</em> than YouTube's own, routers around the world preferred it. From 18:47 UTC, much of the world's YouTube traffic went to Pakistan and disappeared. YouTube answered at 20:07 by announcing the same /24, then at 20:18 with two even more specific /25 routes, which won; the bad route was withdrawn at 21:01. <strong>Layer: routing.</strong> The rule "the most specific route wins" is in lesson 2.2 — after it, this story will make complete sense.</p>

<h3>4. Let's Encrypt, 30 September 2021 — a certificate that grew old</h3>
<p>Let's Encrypt, which issues free certificates for a large share of HTTPS sites, had been trusted by older devices through an old root certificate, DST Root CA X3. On 30 September 2021 that root expired. Sites with perfectly valid certificates suddenly failed on devices that had not received updates for years and on clients using OpenSSL 1.0.x. <strong>Layer: TLS.</strong> Your server's certificate is part of a <em>chain</em>, and the <em>client</em> decides which roots it trusts — Chapter 7.</p>

<h3>5. Slack, 30 September 2021 — a DNS change you cannot undo</h3>
<p>Slack enabled DNSSEC (a way to sign DNS answers) on <code>slack.com</code>. Some recursive resolvers began returning "no such record" for some users. Slack rolled back — and things got worse, because resolvers had already cached part of the new configuration; Slack's team had assumed that piece was never cached. The incident lasted about 24 hours and affected under 1% of users. <strong>Layer: DNS.</strong> The lesson every developer needs: DNS answers are cached, sometimes for hours, so a DNS change is not instantly reversible (lesson 3.3).</p>

<h3>6. AWS us-east-1, 19–20 October 2025 — one empty record</h3>
<p>Amazon's own post-incident summary: a latent race condition in the automation that manages DNS for DynamoDB left the regional endpoint <code>dynamodb.us-east-1.amazonaws.com</code> with an <strong>empty DNS record</strong>, from 11:48 PM to about 2:40 AM Pacific time. Clients could no longer find the service, and many other AWS services that depend on DynamoDB failed with it; some effects lasted until the afternoon. <strong>Layer: DNS</strong> — inside one of the most sophisticated infrastructures in the world.</p>

<h3>7. This very website, 18 August 2026 — 502 for seven minutes</h3>
<p>Our own. A new backend image was built from the wrong base image, so the database engine library inside did not match the system's C library. Build, push and swap were all green; then the API container started, crashed and restarted in a loop. nginx in front of it was fine — so every API request got <strong>502 Bad Gateway</strong> for seven minutes until the previous image was restored.</p>
<p>The useful part is how quickly the status code pointed to the culprit. A <strong>502</strong> means "the proxy is alive, but the server behind it did not give a valid answer". Not DNS (the name resolved), not TLS (the browser connected) — the application. You can produce the same codes yourself in the lab right now:</p>
${run('c00-loi', 'curl -sS -o /dev/null -w', 2)}
<p><code>/hong/</code> is proxied to a port where nothing listens (502); <code>/cham/</code> is proxied to an endpoint that takes 3 seconds while nginx waits only 1 (504). Chapter 10 reads every one of these codes.</p>

<h3>The pattern: four places, not the cable</h3>
<p>Put the seven incidents side by side: two routing, four DNS, one TLS, one application-behind-a-proxy (Facebook counts twice). Cables and Wi-Fi do fail, but the problems a developer is asked to explain almost always live in <strong>routing, DNS, certificates and the application or proxy layer</strong>. That is why those four get whole chapters here.</p>
<div class="pitfall co-tieu-de">
<p><strong>"The server is up, so it must be the user's network."</strong> In every incident above the servers were up. Facebook's DNS servers were running; Dyn's customers' sites were running; YouTube was running. Reachability is a chain — name → route → connection → certificate → application — and the user only sees the first broken link. Check each link in order before blaming anyone (Chapter 11 turns this into a checklist).</p>
</div>

<h3>Three student stories (illustrative)</h3>
<p>These are <strong>not real people</strong>; they are composites of the bugs that appear most often in student projects. Each comes back as an exercise in Chapter 1.</p>
<ul>
<li><strong>Demo day.</strong> The back end runs with <code>app.listen(3000, '127.0.0.1')</code>. Everything works on the student's laptop. On the projector laptop, the front end calls the student's IP and gets "connection refused": 127.0.0.1 means "only this machine". Fix: listen on <code>0.0.0.0</code> and open the port in the firewall (lesson 1.5).</li>
<li><strong>The IP that moved.</strong> The mobile app hard-codes <code>http://192.168.1.23:8080</code>. The next morning the Wi-Fi router gives the laptop a different address, and nothing works. Fix: use a name, or reserve a fixed address (Chapters 2–3).</li>
<li><strong>School Wi-Fi blocks it.</strong> <code>ssh</code> to the cloud server times out from the school network but works at home: the school blocks outgoing port 22. Fix: understand what a port is, test with <code>nc -v</code>, run SSH on an allowed port or use a tunnel (Chapters 1 and 10). This exact problem happened to the author of this course in September 2026.</li>
</ul>

<h3>Read the error before you search it</h3>
<p>Error messages are short, and each one names the layer that failed. Here are the ones you will meet most, produced for real in the lab:</p>
${run('c00-loi', 'curl -sS http://labflow.invalid/', 4)}
<table>
<thead><tr><th>Message</th><th>Meaning</th><th>First thing to check</th></tr></thead>
<tbody>
<tr><td><code>Could not resolve host</code> (curl exit 6)</td><td>DNS: the name did not become an address.</td><td><code>dig name</code> — Chapter 3</td></tr>
<tr><td><code>Could not connect to server</code> (curl exit 7) / <code>Connection refused</code></td><td>The machine answered "nobody here": no program listens on that port.</td><td><code>ss -tlnp</code> on the server — lesson 1.5</td></tr>
<tr><td><code>Connection timed out</code> (curl exit 28)</td><td>No answer at all: a firewall dropping packets, a missing route, a machine that is off.</td><td><code>ping</code>, <code>mtr</code>, firewall — Chapters 2 and 11</td></tr>
<tr><td><code>certificate has expired</code> / <code>unable to get local issuer certificate</code></td><td>TLS: dates or chain wrong.</td><td><code>openssl s_client</code> — Chapter 7</td></tr>
<tr><td><code>502</code> / <code>504</code></td><td>HTTP from a proxy: the app behind it is dead/wrong (502) or too slow (504).</td><td>proxy and app logs — Chapter 10</td></tr>
</tbody>
</table>
<p>Notice two things in the real output. curl 8 now says <em>"Could not connect to server"</em> where older versions said "Connection refused" — <code>nc -v</code> still shows the classic words. And "refused" came back in 0 ms while "timed out" took the full 3 seconds: a refusal is an <em>answer</em>, a timeout is <em>silence</em>. That difference is the single most useful clue in network debugging.</p>

<h3>Why beginners give up — and what this course does about it</h3>
<ul>
<li><strong>An avalanche of acronyms.</strong> OSI, TCP, MTU, MSS, ARP, NAT on page one. Here each term appears only when you need it, always with its Vietnamese meaning, and the 🗂 box at the end of each lesson collects them.</li>
<li><strong>Invisible things.</strong> You cannot see a packet. So we capture real ones with <code>tcpdump</code> and Wireshark, and every abstract idea has a simulation you can step through.</li>
<li><strong>Memorising instead of measuring.</strong> Every claim in the course comes with a command and its real output. If you doubt it, run it.</li>
<li><strong>Scary errors.</strong> They are short and they repeat. After the table above, you already know what five of them mean.</li>
</ul>

<h3>Two paths through the course</h3>
<p><strong>Minimum path (about 3 weeks).</strong> Section 0 → Chapter 1 → Chapter 2 (IP addresses, subnets, NAT) → Chapter 3 (DNS) → Chapter 4 (TCP basics) → Chapter 6 (TLS) → Chapter 10 (proxies, 502/504) → Chapter 11 (troubleshooting). Enough to deploy and debug a student project with confidence.</p>
<p><strong>Full path (8–10 weeks).</strong> Every chapter in order, every lab, the capstone. About one hour a day, five days a week. You come out able to tune a production request path and to handle the networking round of an interview.</p>
<p><strong>The rhythm of one session (about one hour):</strong></p>
<ol>
<li>Watch one lesson's slides (10–15 minutes).</li>
<li>Read the written lesson and <strong>type every command yourself</strong> in the lab — do not copy-paste blindly (20–30 minutes).</li>
<li>Do 🧪 Practice, then the lesson's exercise on Code Lab (15–20 minutes).</li>
<li>At the end of a chapter: the quiz and the chapter lab.</li>
</ol>
<p>Small wins matter. Each 🧪 has a "Done when" line — tick it. Five ticked lessons in a week is a good week.</p>

<h3>How to ask for help</h3>
<ul>
<li>The exact command and its full output (not "it does not work").</li>
<li>What you expected, and what happened instead.</li>
<li>What you already checked: "ping works, curl says refused, <code>ss</code> shows nothing on 3000".</li>
<li>Never paste passwords, tokens or private keys.</li>
</ul>

<h3>🧪 Practice (10 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a classmate messages you: "the site is down". You want to answer with a layer, not a guess.</p>
<ol>
<li>On your own machine run <code>curl -sS https://this-name-does-not-exist.invalid/</code>. Which message, and which layer?</li>
<li>Run <code>curl -sS http://127.0.0.1:59999/</code> (almost certainly nothing listens there). Which message, how fast?</li>
<li>Run <code>curl -sS --max-time 3 http://10.255.255.1/</code> (an address that usually does not answer). Which message, how long?</li>
<li>Write one line per result: message → layer → first command you would run next.</li>
</ol>
<p><strong>Done when:</strong> you have three lines, and you can explain why the refusal came back at once while the timeout took three seconds.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['outage (sự cố, mất dịch vụ)', 'A period when users cannot use a service.'],
    ['BGP', 'The protocol networks use to announce which addresses they can deliver to; a wrong announcement misroutes traffic.'],
    ['DNS resolver (máy phân giải DNS)', 'The server that looks names up for you and caches the answers.'],
    ['cache (bộ nhớ đệm)', 'A saved copy of an answer, reused until it expires — why some changes are not instant.'],
    ['root certificate (chứng chỉ gốc)', 'A certificate your device trusts by default; site certificates chain up to one.'],
    ['502 Bad Gateway / 504 Gateway Timeout', 'A proxy saying: the server behind me answered wrongly / too slowly.'],
    ['connection refused (bị từ chối)', 'The machine answered, but nothing listens on that port.'],
    ['timed out (hết giờ chờ)', 'No answer arrived before the limit — silence, not a refusal.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Seven real incidents, four places: routing, DNS, certificates, application/proxy — almost never the cable.</li>
<li>A healthy server can be unreachable because its name or its path is broken; DNS changes cannot be undone instantly.</li>
<li>Error messages name the layer: cannot resolve → DNS; refused → nothing listening; timed out → silence; 502/504 → behind the proxy.</li>
<li>A refusal is an answer and comes back at once; a timeout is silence and costs the full wait.</li>
<li>Pick the minimum or full path, keep a one-hour rhythm, and type every command yourself.</li>
</ul>
${L('https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/', '📄', 'Meta Engineering — More details about the October 4 outage', 'Facebook’s own explanation: backbone, BGP and DNS.', 'Open')}
${L('https://blog.cloudflare.com/october-2021-facebook-outage/', '☁️', 'Cloudflare — Understanding how Facebook disappeared from the Internet', 'The same outage measured from outside, with times.', 'Open')}
${L('https://www.ripe.net/publications/news/industry-developments/youtube-hijacking-a-ripe-ncc-ris-case-study', '🧭', 'RIPE NCC — YouTube Hijacking case study', 'Minute-by-minute BGP timeline of 24 February 2008.', 'Open')}
${L('https://letsencrypt.org/docs/dst-root-ca-x3-expiration-september-2021/', '🔐', 'Let’s Encrypt — DST Root CA X3 expiration', 'Which clients broke and why.', 'Open')}
${L('https://slack.engineering/what-happened-during-slacks-dnssec-rollout/', '💬', 'Slack Engineering — What happened during Slack’s DNSSEC rollout', 'Why rolling back made it worse.', 'Open')}
${L('https://aws.amazon.com/message/101925/', '🟧', 'AWS — Summary of the Amazon DynamoDB service disruption (us-east-1)', 'The empty DNS record, with times.', 'Open')}
${L('https://en.wikipedia.org/wiki/2016_Dyn_cyberattack', '📚', 'Wikipedia — 2016 Dyn cyberattack', 'Mirai, the three waves, the sites affected.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Những sự cố thật, và cách học mạng để không bỏ cuộc</h2>
<p class="lead">Mạng có vẻ trừu tượng cho tới khi bạn thấy chuyện gì xảy ra lúc nó hỏng. Bài này xem bảy sự cố có thật — từ chuyện Facebook biến mất sáu tiếng tới chuyện chính trang web này trả 502 suốt bảy phút — và với mỗi sự cố đều hỏi đúng ba câu: chuyện gì đã xảy ra, tầng nào hỏng, và chương nào của khoá giúp bạn hiểu nó. Rồi ta quay sang bạn: những lỗi bạn dễ gặp nhất trong đồ án sinh viên, và một lộ trình học bạn thật sự giữ được.</p>

<h3>1. Facebook, 4/10/2021 — công ty tự xoá mình khỏi Internet</h3>
<p><strong>Chuyện gì xảy ra.</strong> Trong một lần bảo trì định kỳ, một lệnh dùng để đánh giá dung lượng mạng lõi toàn cầu của Facebook (mạng riêng nối các trung tâm dữ liệu) lỡ làm sập luôn mạng lõi đó. Công cụ kiểm tra lẽ ra phải chặn lệnh thì bị lỗi. Các máy chủ DNS của Facebook được thiết kế để ngừng quảng bá địa chỉ của mình bằng <strong>BGP</strong> — giao thức các mạng dùng để nói với nhau "lưu lượng tới dải địa chỉ này thì gửi cho tôi" — khi chúng không liên lạc được với trung tâm dữ liệu. Chúng làm đúng y như vậy.</p>
<p><strong>Hậu quả.</strong> Máy chủ DNS vẫn chạy, nhưng không còn đường nào dẫn tới chúng, nên cả thế giới không tra được <code>facebook.com</code>, <code>instagram.com</code> hay <code>whatsapp.net</code>. Nhìn từ Cloudflare, các tuyến bắt đầu biến mất khoảng 15:40 UTC và xuất hiện lại khoảng 21:28 UTC — chừng sáu tiếng. Các resolver công cộng phải xử lý lượng truy vấn gấp khoảng 30 lần bình thường, vì ứng dụng và trình duyệt nào cũng thử lại liên tục. Kỹ sư phải tới tận trung tâm dữ liệu; nhiều công cụ nội bộ của họ cũng phụ thuộc vào chính DNS đó.</p>
<p><strong>Các tầng.</strong> Định tuyến (BGP) hỏng, và DNS — vẫn khoẻ nhưng không ai tới được — đổ theo. Bạn gặp BGP ở bài 2.5 và DNS ở Chương 3.</p>

<h3>2. Dyn, 21/10/2016 — khi cuốn danh bạ bị tấn công</h3>
<p>Dyn là công ty trả lời câu hỏi DNS cho rất nhiều trang web lớn nhất. Một mạng máy ma (botnet) — hàng chục nghìn camera, router gia đình, máy báo khóc em bé bị nhiễm mã độc <strong>Mirai</strong> — dội lưu lượng vào Dyn thành ba đợt (khoảng 11:10–13:20, 15:50–17:00 và 20:00–22:10 UTC). Twitter, GitHub, Netflix, Reddit, PayPal và nhiều trang khác vẫn chạy hoàn hảo; chỉ là người dùng ở châu Âu và Bắc Mỹ không đổi được tên của chúng thành địa chỉ. <strong>Tầng: DNS.</strong> Chương 3 cho thấy vì sao một trang không nên phụ thuộc vào duy nhất một nhà cung cấp DNS.</p>

<h3>3. YouTube, 24/2/2008 — một tuyến đường sai</h3>
<p>Pakistan Telecom muốn chặn YouTube trong nước. Họ quảng bá một tuyến cho <code>208.65.153.0/24</code>, một phần dải địa chỉ của YouTube, trong mạng của mình — nhưng nhà mạng cấp trên lại chuyển lời quảng bá đó ra phần còn lại của Internet. Vì tuyến đó <em>cụ thể hơn</em> tuyến của chính YouTube, router khắp thế giới ưu tiên nó. Từ 18:47 UTC, phần lớn lưu lượng YouTube của thế giới chạy sang Pakistan rồi biến mất. YouTube đáp lại lúc 20:07 bằng cách quảng bá đúng /24 đó, rồi lúc 20:18 bằng hai tuyến /25 còn cụ thể hơn và thắng; tuyến sai bị rút lúc 21:01. <strong>Tầng: định tuyến.</strong> Luật "tuyến cụ thể nhất thắng" nằm ở bài 2.2 — học xong bài đó, câu chuyện này sẽ sáng rõ hoàn toàn.</p>

<h3>4. Let's Encrypt, 30/9/2021 — một chứng chỉ già đi</h3>
<p>Let's Encrypt cấp chứng chỉ miễn phí cho một phần rất lớn các trang HTTPS, và được các thiết bị đời cũ tin nhờ một chứng chỉ gốc cũ, DST Root CA X3. Ngày 30/9/2021 chứng chỉ gốc đó hết hạn. Những trang có chứng chỉ hoàn toàn hợp lệ bỗng lỗi trên các thiết bị nhiều năm không được cập nhật và trên client dùng OpenSSL 1.0.x. <strong>Tầng: TLS.</strong> Chứng chỉ của máy chủ là một mắt trong cả một <em>chuỗi</em>, và chính <em>client</em> quyết định tin gốc nào — Chương 7.</p>

<h3>5. Slack, 30/9/2021 — một thay đổi DNS không rút lại được</h3>
<p>Slack bật DNSSEC (cách ký số câu trả lời DNS) cho <code>slack.com</code>. Một số resolver đệ quy bắt đầu trả "không có bản ghi" cho một số người dùng. Slack quay lui — và mọi chuyện tệ hơn, vì resolver đã cache sẵn một phần cấu hình mới; đội Slack từng tin phần đó không bao giờ bị cache. Sự cố kéo dài khoảng 24 giờ, ảnh hưởng dưới 1% người dùng. <strong>Tầng: DNS.</strong> Bài học mọi lập trình viên cần: câu trả lời DNS được cache, có khi hàng giờ, nên một thay đổi DNS không đảo ngược ngay được (bài 3.3).</p>

<h3>6. AWS us-east-1, 19–20/10/2025 — một bản ghi rỗng</h3>
<p>Bản tóm tắt sau sự cố của chính Amazon: một lỗi tranh chấp (race condition) tiềm ẩn trong hệ tự động quản lý DNS cho DynamoDB khiến địa chỉ dịch vụ <code>dynamodb.us-east-1.amazonaws.com</code> có một <strong>bản ghi DNS rỗng</strong>, từ 23:48 tới khoảng 2:40 sáng giờ Thái Bình Dương. Client không tìm được dịch vụ nữa, và nhiều dịch vụ AWS khác phụ thuộc vào DynamoDB hỏng theo; vài hệ quả kéo dài tới chiều. <strong>Tầng: DNS</strong> — ngay bên trong một trong những hạ tầng tinh vi nhất thế giới.</p>

<h3>7. Chính trang web này, 18/8/2026 — 502 suốt bảy phút</h3>
<p>Sự cố của mình. Một ảnh backend mới được dựng từ ảnh nền sai, nên thư viện của engine cơ sở dữ liệu bên trong không khớp thư viện C của hệ thống. Build, đẩy, tráo đều xanh; rồi container API khởi động, sập, khởi động lại thành vòng lặp. nginx phía trước vẫn ổn — nên mọi request tới API nhận <strong>502 Bad Gateway</strong> suốt bảy phút cho tới khi ảnh cũ được khôi phục.</p>
<p>Phần đáng học là mã trạng thái chỉ ra thủ phạm nhanh thế nào. <strong>502</strong> nghĩa là "proxy còn sống, nhưng máy chủ phía sau không đưa ra câu trả lời hợp lệ". Không phải DNS (tên tra được), không phải TLS (trình duyệt kết nối được) — mà là ứng dụng. Bạn tự tạo ra đúng các mã đó trong lab ngay bây giờ:</p>
${run('c00-loi', 'curl -sS -o /dev/null -w', 2)}
<p><code>/hong/</code> được chuyển tới một cổng không ai nghe (502); <code>/cham/</code> được chuyển tới một endpoint mất 3 giây trong khi nginx chỉ chờ 1 giây (504). Chương 10 đọc từng mã một.</p>

<h3>Quy luật: bốn chỗ, không phải dây cáp</h3>
<p>Đặt bảy sự cố cạnh nhau: hai định tuyến, bốn DNS, một TLS, một ứng dụng sau proxy (Facebook tính hai lần). Dây cáp và Wi-Fi cũng hỏng, nhưng những vấn đề lập trình viên phải giải thích gần như luôn nằm ở <strong>định tuyến, DNS, chứng chỉ và tầng ứng dụng hoặc proxy</strong>. Vì thế bốn thứ đó có nguyên chương trong khoá này.</p>
<div class="pitfall co-tieu-de">
<p><strong>"Máy chủ vẫn chạy, chắc mạng của người dùng có vấn đề."</strong> Trong mọi sự cố trên, máy chủ đều chạy. Máy chủ DNS của Facebook chạy; trang của khách hàng Dyn chạy; YouTube chạy. Tới được một dịch vụ là cả một chuỗi — tên → đường → kết nối → chứng chỉ → ứng dụng — và người dùng chỉ thấy mắt xích hỏng đầu tiên. Kiểm từng mắt theo thứ tự trước khi đổ lỗi cho ai (Chương 11 biến việc này thành bảng kiểm).</p>
</div>

<h3>Ba câu chuyện sinh viên (minh hoạ)</h3>
<p>Đây <strong>không phải người thật</strong>; chúng được gộp từ những lỗi xuất hiện nhiều nhất trong đồ án sinh viên. Mỗi cái quay lại thành bài tập ở Chương 1.</p>
<ul>
<li><strong>Hôm demo.</strong> Backend chạy với <code>app.listen(3000, '127.0.0.1')</code>. Trên laptop của bạn sinh viên mọi thứ chạy. Trên laptop nối máy chiếu, frontend gọi IP của bạn ấy và nhận "connection refused": 127.0.0.1 nghĩa là "chỉ máy này thôi". Cách sửa: nghe trên <code>0.0.0.0</code> và mở cổng trong tường lửa (bài 1.5).</li>
<li><strong>Cái IP biết di chuyển.</strong> App di động gắn cứng <code>http://192.168.1.23:8080</code>. Sáng hôm sau router Wi-Fi cấp cho laptop một địa chỉ khác, và chẳng gì chạy nữa. Cách sửa: dùng tên, hoặc giữ cố định địa chỉ (Chương 2–3).</li>
<li><strong>Wi-Fi trường chặn.</strong> <code>ssh</code> tới máy chủ đám mây hết giờ chờ khi ở mạng trường nhưng ở nhà thì được: trường chặn cổng 22 chiều đi ra. Cách sửa: hiểu cổng là gì, thử bằng <code>nc -v</code>, chạy SSH trên một cổng được phép hoặc dùng đường hầm (Chương 1 và 10). Chuyện này đã xảy ra thật với chính tác giả khoá học vào tháng 9/2026.</li>
</ul>

<h3>Đọc lỗi trước khi đi tìm trên mạng</h3>
<p>Thông báo lỗi thì ngắn, và cái nào cũng gọi tên tầng bị hỏng. Đây là những cái bạn gặp nhiều nhất, tạo ra thật trong lab:</p>
${run('c00-loi', 'curl -sS http://labflow.invalid/', 4)}
<table>
<thead><tr><th>Thông báo</th><th>Nghĩa là</th><th>Kiểm gì đầu tiên</th></tr></thead>
<tbody>
<tr><td><code>Could not resolve host</code> (curl thoát mã 6)</td><td>DNS: tên chưa thành địa chỉ.</td><td><code>dig tên</code> — Chương 3</td></tr>
<tr><td><code>Could not connect to server</code> (curl mã 7) / <code>Connection refused</code></td><td>Máy trả lời "không có ai ở đây": không chương trình nào nghe ở cổng đó.</td><td><code>ss -tlnp</code> trên máy chủ — bài 1.5</td></tr>
<tr><td><code>Connection timed out</code> (curl mã 28)</td><td>Không có trả lời nào: tường lửa vứt gói, thiếu tuyến, máy đang tắt.</td><td><code>ping</code>, <code>mtr</code>, tường lửa — Chương 2 và 11</td></tr>
<tr><td><code>certificate has expired</code> / <code>unable to get local issuer certificate</code></td><td>TLS: sai ngày hoặc sai chuỗi.</td><td><code>openssl s_client</code> — Chương 7</td></tr>
<tr><td><code>502</code> / <code>504</code></td><td>HTTP từ một proxy: ứng dụng phía sau chết/sai (502) hoặc quá chậm (504).</td><td>log của proxy và ứng dụng — Chương 10</td></tr>
</tbody>
</table>
<p>Để ý hai điều trong output thật. curl 8 giờ nói <em>"Could not connect to server"</em> ở chỗ các bản cũ nói "Connection refused" — còn <code>nc -v</code> vẫn in đúng chữ kinh điển. Và "từ chối" quay về sau 0 ms, còn "hết giờ chờ" ăn trọn 3 giây: từ chối là một <em>câu trả lời</em>, hết giờ là <em>im lặng</em>. Khác biệt đó là manh mối hữu ích nhất khi gỡ lỗi mạng.</p>

<h3>Vì sao người mới bỏ cuộc — và khoá này làm gì</h3>
<ul>
<li><strong>Thác chữ viết tắt.</strong> OSI, TCP, MTU, MSS, ARP, NAT ngay trang đầu. Ở đây mỗi thuật ngữ chỉ xuất hiện khi cần, luôn kèm nghĩa tiếng Việt, và ô 🗂 cuối mỗi bài gom chúng lại.</li>
<li><strong>Thứ không nhìn thấy.</strong> Bạn không thấy được gói tin. Nên ta bắt gói thật bằng <code>tcpdump</code> và Wireshark, và ý tưởng trừu tượng nào cũng có một mô phỏng để bấm từng bước.</li>
<li><strong>Học thuộc thay vì đo.</strong> Khẳng định nào trong khoá cũng kèm một lệnh và output thật. Nghi thì chạy thử.</li>
<li><strong>Lỗi đáng sợ.</strong> Chúng ngắn và lặp lại. Sau cái bảng ở trên, bạn đã biết nghĩa của năm cái rồi.</li>
</ul>

<h3>Hai lộ trình học</h3>
<p><strong>Lộ trình tối thiểu (khoảng 3 tuần).</strong> Mục 0 → Chương 1 → Chương 2 (địa chỉ IP, subnet, NAT) → Chương 3 (DNS) → Chương 4 (TCP cơ bản) → Chương 6 (TLS) → Chương 10 (proxy, 502/504) → Chương 11 (chẩn đoán). Đủ để deploy và gỡ lỗi một đồ án sinh viên một cách tự tin.</p>
<p><strong>Lộ trình đầy đủ (8–10 tuần).</strong> Mọi chương theo thứ tự, mọi lab, dự án cuối khoá. Khoảng một giờ mỗi ngày, năm ngày một tuần. Học xong bạn tối ưu được đường đi của request trên production và qua được vòng hỏi về mạng khi phỏng vấn.</p>
<p><strong>Nhịp của một buổi (khoảng một giờ):</strong></p>
<ol>
<li>Xem slide của một bài (10–15 phút).</li>
<li>Đọc bài đọc chi tiết và <strong>tự gõ mọi lệnh</strong> trong lab — đừng dán bừa (20–30 phút).</li>
<li>Làm 🧪 Thực hành, rồi bài luyện của bài đó trên Code Lab (15–20 phút).</li>
<li>Cuối chương: quiz và lab chương.</li>
</ol>
<p>Chiến thắng nhỏ rất quan trọng. 🧪 nào cũng có dòng "Đạt khi" — đánh dấu nó. Một tuần làm xong năm bài là một tuần tốt.</p>

<h3>Cách hỏi khi bí</h3>
<ul>
<li>Đúng lệnh đã chạy và toàn bộ output (đừng chỉ "không chạy").</li>
<li>Bạn mong điều gì, và điều gì đã xảy ra thay vào đó.</li>
<li>Bạn đã kiểm những gì: "ping được, curl báo refused, <code>ss</code> không thấy gì ở 3000".</li>
<li>Không bao giờ dán mật khẩu, token hay khoá bí mật.</li>
</ul>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn cùng lớp nhắn: "web sập rồi". Bạn muốn trả lời bằng một tầng, không phải một phỏng đoán.</p>
<ol>
<li>Trên máy bạn chạy <code>curl -sS https://this-name-does-not-exist.invalid/</code>. Thông báo gì, tầng nào?</li>
<li>Chạy <code>curl -sS http://127.0.0.1:59999/</code> (gần như chắc chắn không có gì nghe ở đó). Thông báo gì, nhanh tới đâu?</li>
<li>Chạy <code>curl -sS --max-time 3 http://10.255.255.1/</code> (một địa chỉ thường không trả lời). Thông báo gì, mất bao lâu?</li>
<li>Viết mỗi kết quả một dòng: thông báo → tầng → lệnh đầu tiên bạn sẽ chạy tiếp.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có ba dòng, và giải thích được vì sao lời từ chối về ngay còn hết giờ chờ thì mất ba giây.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['outage (sự cố, mất dịch vụ)', 'Khoảng thời gian người dùng không dùng được dịch vụ.'],
    ['BGP', 'Giao thức các mạng dùng để thông báo mình giao được tới dải địa chỉ nào; thông báo sai làm lưu lượng đi lạc.'],
    ['DNS resolver (máy phân giải DNS)', 'Máy chủ tra tên giúp bạn và cache câu trả lời.'],
    ['cache (bộ nhớ đệm)', 'Bản sao câu trả lời được dùng lại tới khi hết hạn — vì thế vài thay đổi không có hiệu lực ngay.'],
    ['root certificate (chứng chỉ gốc)', 'Chứng chỉ thiết bị tin sẵn; chứng chỉ của trang web nối ngược lên một cái như vậy.'],
    ['502 Bad Gateway / 504 Gateway Timeout', 'Proxy nói: máy chủ phía sau tôi trả lời sai / quá chậm.'],
    ['connection refused (bị từ chối)', 'Máy có trả lời, nhưng không có gì nghe ở cổng đó.'],
    ['timed out (hết giờ chờ)', 'Không có trả lời nào tới trước giới hạn — im lặng, không phải từ chối.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bảy sự cố thật, bốn chỗ: định tuyến, DNS, chứng chỉ, ứng dụng/proxy — gần như không bao giờ là dây cáp.</li>
<li>Máy chủ khoẻ vẫn có thể không ai tới được vì cái tên hoặc con đường hỏng; thay đổi DNS không rút lại tức thì.</li>
<li>Thông báo lỗi gọi tên tầng: không phân giải → DNS; refused → không ai nghe; timed out → im lặng; 502/504 → phía sau proxy.</li>
<li>Từ chối là câu trả lời và về ngay; hết giờ là im lặng và tốn trọn thời gian chờ.</li>
<li>Chọn lộ trình tối thiểu hoặc đầy đủ, giữ nhịp một giờ, và tự gõ mọi lệnh.</li>
</ul>
${L('https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/', '📄', 'Meta Engineering — Chi tiết sự cố ngày 4/10', 'Lời giải thích của chính Facebook: mạng lõi, BGP và DNS.', 'Mở')}
${L('https://blog.cloudflare.com/october-2021-facebook-outage/', '☁️', 'Cloudflare — Facebook biến mất khỏi Internet thế nào', 'Cùng sự cố, đo từ bên ngoài, có giờ giấc.', 'Mở')}
${L('https://www.ripe.net/publications/news/industry-developments/youtube-hijacking-a-ripe-ncc-ris-case-study', '🧭', 'RIPE NCC — Nghiên cứu vụ chiếm tuyến YouTube', 'Dòng thời gian BGP từng phút ngày 24/2/2008.', 'Mở')}
${L('https://letsencrypt.org/docs/dst-root-ca-x3-expiration-september-2021/', '🔐', 'Let’s Encrypt — DST Root CA X3 hết hạn', 'Client nào hỏng và vì sao.', 'Mở')}
${L('https://slack.engineering/what-happened-during-slacks-dnssec-rollout/', '💬', 'Slack Engineering — Chuyện gì xảy ra khi Slack bật DNSSEC', 'Vì sao quay lui lại tệ hơn.', 'Mở')}
${L('https://aws.amazon.com/message/101925/', '🟧', 'AWS — Tóm tắt sự cố DynamoDB (us-east-1)', 'Bản ghi DNS rỗng, có giờ giấc.', 'Mở')}
${L('https://en.wikipedia.org/wiki/2016_Dyn_cyberattack', '📚', 'Wikipedia — Vụ tấn công Dyn 2016', 'Mirai, ba đợt tấn công, các trang bị ảnh hưởng.', 'Mở')}
</div>
`,
};
