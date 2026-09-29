/**
 * Deploy lên VPS — Chương 12 (MỚI, 29/09/2026): Từ tên miền tới HTTPS.
 * 12.0 slide (deck dv-12, 32 slide) · 12.1 tên miền và DNS · 12.2 reverse proxy + HTTPS bằng ACME · 12.3 chỉ mở đúng
 * cổng (và Docker vượt mặt ufw) · 12.4 CDN và tệp tĩnh · 12.5 quiz 10 câu.
 * Không dạy lại cú pháp nginx, chuỗi chứng chỉ, HSTS (→ /courses/nginx Ch3, Ch4, Ch6) và phép kiểm -checkend (→ Ch9).
 * MỌI lệnh và output MỚI chạy thật 29/09/2026: Mac M1 (dig 9.10.6, đọc bản ghi CÔNG KHAI của example.com và
 * cuongthai.com — chỉ đọc; mạng đang ngồi chặn cổng 53 ra ngoài), "VPS thí nghiệm" dv12-vps (ubuntu:24.04, nginx
 * 1.24.0, certbot 2.9.0, OpenSSL 3.0.13), CA thử Pebble (dv12-pebble — KHÔNG gọi Let's Encrypt thật), bind9 + unbound
 * (dv12-dns, dv12-res), Caddy 2.11.4 (dv12-caddy), máy có tường lửa dv12-fw (--privileged ngắn hạn, Docker 29.1.3 bên
 * trong, ufw 0.36.2), "CDN" nginx 1.27 proxy_cache (dv12-cdn). Số liệu Let's Encrypt/Cloudflare: trang chính thức,
 * đọc 29/09/2026.
 * File này SINH từ nguồn thô bằng generator (thoát ký tự tự động). LUẬT vẫn như mọi chương: backtick → &#96;;
 * ${ → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */

import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: "Chapter 12 — From a domain name to HTTPS: putting your server on the Internet|||Chương 12 — Từ tên miền tới HTTPS: đưa máy chủ của bạn ra Internet",
  description: "Một tên miền đi qua ba bên trước khi tới máy bạn, một chứng chỉ phải được chứng minh và gia hạn mãi mãi, một bức tường lửa có thể bị Docker đi vòng, và một bộ đệm giữ bản cũ tới một năm. Chương này dựng lại cả bốn trên VPS thí nghiệm và đo từng cái.",
  lessons: [
    /* ─────────────────────────── 12.0 ─────────────────────────── */
    {
      title: "12.0 — Chapter 12 slides: from a domain to HTTPS in pictures|||12.0 — Slide Chương 12: từ tên miền tới HTTPS bằng hình",
      slug: "deploy-12-0-slides",
      type: "DOCUMENT",
      isFreePreview: true,
      description: "Bộ 32 slide của Chương 12: registrar – nhà DNS – VPS, bảy loại bản ghi, TTL đếm ngược đo thật, cam hay xám, /etc/hosts, ACME HTTP-01 và DNS-01 với Pebble, gia hạn mà nginx vẫn đưa bản cũ, certbot và Caddy, giới hạn Let’s Encrypt, Docker vượt mặt ufw, nmap, Cache-Control, CDN phát bản cũ và nginx nuốt header.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Chapters 1–11 deployed to a server that only you could reach by its IP address. This chapter puts that server on the Internet under a name, behind HTTPS, with only the right doors open and a cache in front. Skim the slides first to see its shape, and come back to the two cheat sheets after the quiz.</p>
<p>Slides 3–8 belong to Lesson 12.1 (the three parties behind a domain name, seven record types read from real domains, a TTL counting down on a lab resolver, orange versus grey clouds, <code>/etc/hosts</code>), 9–18 to 12.2 (why nginx sits in front, the ACME exchange, HTTP-01 against DNS-01, a renewal that nginx ignored until it was reloaded, certbot against Caddy, checking expiry on the wire, Let's Encrypt limits as of 09/2026), 19–23 to 12.3 (<code>ss -tlnp</code>, a Postgres port left open to the world while ufw was active, the packet path that explains it, three fixes measured) and 24–28 to 12.4 (two cache policies, a small CDN showing MISS then HIT, the same file name serving old bytes, nginx swallowing the app's header, object storage for uploads). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026: public DNS records read from a Mac, and everything else on the "lab VPS" — an Ubuntu 24.04 container the Mac reaches over SSH — with Pebble, the test ACME server from Let's Encrypt, standing in for the real CA.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Chương 1–11 deploy lên một máy chủ mà chỉ bạn gõ IP mới tới được. Chương này đưa máy đó ra Internet: có tên, có HTTPS, chỉ mở đúng những cánh cửa cần mở, và có một bộ đệm đứng trước. Lướt bộ slide trước để thấy hình dạng của chương, rồi quay lại hai trang bảng tra nhanh sau bài kiểm tra.</p>
<p>Slide 3–8 thuộc Bài 12.1 (ba bên đứng sau một tên miền, bảy loại bản ghi đọc từ tên miền thật, TTL đếm ngược trên một resolver thí nghiệm, đám mây cam hay xám, <code>/etc/hosts</code>), 9–18 thuộc 12.2 (vì sao nginx đứng trước, cuộc trao đổi ACME, HTTP-01 so với DNS-01, một lần gia hạn mà nginx làm ngơ cho tới khi được nạp lại, certbot so với Caddy, kiểm hạn trên dây, giới hạn của Let's Encrypt tính đến 09/2026), 19–23 thuộc 12.3 (<code>ss -tlnp</code>, một cổng Postgres mở toang ra ngoài trong lúc ufw đang bật, đường đi của gói tin giải thích chuyện đó, ba cách sửa đo cả ba) và 24–28 thuộc 12.4 (hai chính sách cache, một CDN thu nhỏ cho thấy MISS rồi HIT, cùng một tên tệp mà phát ra byte cũ, nginx nuốt header của app, kho object cho tệp người dùng tải lên). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal là output THẬT, ghi ngày 29/09/2026: bản ghi DNS công khai đọc từ máy Mac, còn lại chạy trên "VPS thí nghiệm" — một container Ubuntu 24.04 mà máy Mac SSH vào như một máy chủ thuê — với Pebble, máy chủ ACME thử nghiệm của chính Let's Encrypt, đóng vai CA thật.</p>
</div>
${gallery('dv-12', [[1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Tên miền đi qua ba bên'], [4, 'Bảy loại bản ghi'], [5, 'dig: hỏi DNS và đọc từng cột'], [6, 'TTL: đổi IP rồi mà người khác chưa thấy'], [7, 'Cam hay xám: IP thật lộ hay không'], [8, '/etc/hosts và DNS của Docker'], [9, 'App không nghe thẳng 443'], [10, 'ACME: chứng minh bạn giữ tên miền'], [11, 'Xin chứng chỉ với Pebble'], [12, 'HTTP-01 hay DNS-01'], [13, 'nginx HTTPS: cổng 80 chỉ còn ACME + chuyển'], [14, 'Gia hạn xong, nginx vẫn đưa bản cũ'], [15, 'Bộ hẹn giờ gia hạn'], [16, 'certbot hay Caddy'], [17, 'Kiểm hạn từ bên ngoài'], [18, 'Giới hạn của Let’s Encrypt'], [19, 'ss -tlnp: ai đang nghe'], [20, 'ufw bật mà cổng DB vẫn mở'], [21, 'Docker rẽ gói tin trước ufw'], [22, 'Ba cách đóng cổng DB'], [23, 'Tự quét máy mình'], [24, 'Hai loại tệp, hai chính sách cache'], [25, 'CDN: MISS rồi HIT'], [26, 'Đổi nội dung, giữ tên: CDN phát bản cũ'], [27, 'nginx nuốt header của app'], [28, 'Ảnh người dùng: kho object'], [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 12']])}
`,
    },
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: "12.1 — Domain names and DNS: who holds what, and why a changed IP “has not taken effect”|||12.1 — Tên miền và DNS: ai giữ cái gì, và vì sao đổi IP rồi mà “chưa ăn”",
      slug: "deploy-12-1-ten-mien-dns",
      type: "LESSON",
      isFreePreview: true,
      description: "Registrar, nhà DNS và VPS là ba bên khác nhau; bảy loại bản ghi đọc từ tên miền thật; TTL và bộ đệm âm đo trên bind9 + unbound; dig đọc từng cột; Cloudflare cam hay xám; /etc/hosts và DNS nhúng của Docker.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Domain names and DNS: who holds what, and why a changed IP "has not taken effect"</h2>
<p class="lead">The evening before a SWP391 defence, a team moves its app to a bigger VPS and updates the domain to point at the new IP. Two teammates open the site and see the new version. The lecturer, on the university network, sees the old one — and the old server has already been switched off. Nobody made a mistake you can point at. This lesson is about why that happens, measured on a lab DNS server, and about the three separate parties you depend on the moment your site has a name.</p>

<h3>A short history: from one text file to DNS</h3>
<p>Before DNS, every computer on the ARPANET resolved names from a single file, <code>HOSTS.TXT</code>, which the Network Information Center at SRI maintained by hand — Elizabeth Feinler's team ran that Host Naming Registry from 1972 to 1989 — and which every site downloaded periodically. It did not scale: one file, one editor, every change copied to every machine. Paul Mockapetris designed the Domain Name System in 1983 (RFC 882 and 883, November 1983), and RFC 1034 and 1035 replaced those in November 1987. Those two RFCs are still the core of what your VPS uses today. The old idea never disappeared either: <code>/etc/hosts</code> on every Linux, macOS and Windows machine is the direct descendant of <code>HOSTS.TXT</code>, and, as the end of this lesson shows, it still wins over DNS.</p>

<h3>Three parties, not one</h3>
${slide('dv-12', 3, 'Tên miền đi qua ba bên: registrar, nhà DNS, VPS — số liệu thật của cuongthai.com')}
<p>"I bought a domain" hides three different roles, often at three different companies. Reading the public records of the domain this course runs on (read-only, 29/09/2026):</p>
<div class="out">$ dig cuongthai.com NS +noall +answer
cuongthai.com.  1200  IN  NS  kyrie.ns.cloudflare.com.
cuongthai.com.  1200  IN  NS  meilani.ns.cloudflare.com.
$ dig cuongthai.com A +noall +answer
cuongthai.com.  1163  IN  A  160.187.1.208
$ curl -s https://rdap.verisign.com/com/v1/domain/cuongthai.com | jq -r '.entities[]? | select(.roles[]=="registrar") | .vcardArray[1][] | select(.[0]=="fn") | .[3]'
Porkbun LLC
$ curl -s https://rdap.verisign.com/com/v1/domain/cuongthai.com | jq -r '.events[] | "\\(.eventAction) \\(.eventDate)"'
registration 2026-06-07T21:31:00Z
expiration 2027-06-07T21:31:00Z
last changed 2026-06-19T16:12:23Z
last update of RDAP database 2026-09-29T07:26:13Z</div>
<table>
<tr><th>Party</th><th>Here</th><th>What it holds</th><th>You go there to…</th></tr>
<tr><td><strong>Registrar</strong> (nhà đăng ký)</td><td>Porkbun</td><td>Your right to the name, for a year at a time; which name servers are authoritative (the NS records in the <code>.com</code> zone)</td><td>renew, change name servers, lock transfers, change ownership contacts</td></tr>
<tr><td><strong>DNS host</strong> (nơi giữ bản ghi)</td><td>Cloudflare</td><td>The records themselves: A, AAAA, CNAME, TXT, MX, CAA</td><td>point the name at a new IP, add a subdomain, add a TXT for verification</td></tr>
<tr><td><strong>Server</strong></td><td>the VPS at 160.187.1.208</td><td>The application, the certificate, the firewall</td><td>everything the rest of this course is about</td></tr>
</table>
<p>RDAP — the Registration Data Access Protocol — is the JSON-over-HTTPS successor of <code>whois</code>, and it answers even on networks that block <code>whois</code>'s port 43. The date worth writing down is <code>expiration</code>: a lapsed registration takes the whole site down even if every server is healthy, and it is the one failure no monitoring on the VPS can see.</p>
<div class="callout warn"><strong>Protect the registrar account like the server's root key.</strong> Whoever controls it can change the name servers and, within the TTL of the NS records, receive every request and every email for your domain — and obtain a valid HTTPS certificate for it, because a CA only checks that you control the name. Turn on two-factor authentication, turn on auto-renew with a card that will still be valid next year, and keep the transfer lock on.</div>

<h3>Buying a name: what to check</h3>
<ul>
<li><strong>The renewal price, not the first-year price.</strong> Many extensions are cheap for year one and several times that afterwards. Look at the renewal line on the registrar's price page before choosing.</li>
<li><strong>WHOIS privacy</strong> — whether your name, phone and address are hidden in public registration data. Most registrars include it; check.</li>
<li><strong>Where DNS lives.</strong> You can keep DNS at the registrar or delegate it (Cuong's domain: registered at Porkbun, DNS at Cloudflare). Delegating is one change: replace the NS records at the registrar with the ones the DNS host gives you.</li>
<li><strong>Free subdomains are a trap for anything that must last.</strong> A name you do not own can be withdrawn; you also cannot put a CAA record or set a sensible TTL on it.</li>
</ul>

<h3>The seven record types you will actually type</h3>
${slide('dv-12', 4, 'Bảy loại bản ghi, ví dụ đọc từ tên miền thật')}
<div class="out">$ dig cuongthai.com MX +noall +answer
cuongthai.com.  1200  IN  MX  10 cuongthai.com.
cuongthai.com.  1200  IN  MX  20 fwd2.porkbun.com.
$ dig cuongthai.com TXT +noall +answer
cuongthai.com.  1200  IN  TXT  "google-site-verification=…"
…
cuongthai.com.  1200  IN  TXT  "v=spf1 include:_spf.porkbun.com ~all"
cuongthai.com.  1200  IN  TXT  "v=spf1 include:amazonses.com ~all"
$ dig cuongthai.com CAA +noall +answer
$ dig cuongthai.com AAAA +noall +answer
$ dig media.cuongthai.com A +noall +answer
media.cuongthai.com.  240  IN  A  172.67.161.19
media.cuongthai.com.  240  IN  A  104.21.90.200</div>
<table>
<tr><th>Type</th><th>Maps the name to</th><th>Rule worth knowing</th></tr>
<tr><td><code>A</code> / <code>AAAA</code></td><td>an IPv4 / IPv6 address</td><td>No AAAA means IPv6-only clients cannot reach you; a wrong AAAA is worse than none — some clients try it first and hang.</td></tr>
<tr><td><code>CNAME</code></td><td>another name</td><td>A CNAME cannot sit next to other records of the same name, so it cannot be at the apex (<code>cuongthai.com</code> itself has SOA and NS). Use it for <code>www</code>. Cloudflare's "CNAME flattening" works around this on their side.</td></tr>
<tr><td><code>TXT</code></td><td>free text</td><td>SPF, site verification, and <code>_acme-challenge</code> for DNS-01 certificates (Lesson 12.2).</td></tr>
<tr><td><code>CAA</code></td><td>which CAs may issue for the name</td><td>No CAA means any public CA may. <code>0 issue "letsencrypt.org"</code> is one line.</td></tr>
<tr><td><code>MX</code></td><td>mail servers, by priority</td><td>Lower number is tried first.</td></tr>
<tr><td><code>NS</code></td><td>who holds the records</td><td>Changed at the registrar, not at the DNS host.</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Trap — two SPF records are the same as none.</strong> Reading the real records for this lesson turned up exactly that: <code>cuongthai.com</code> publishes two TXT records that both start with <code>v=spf1</code>, one for Porkbun's mail forwarding and one for Amazon SES. RFC 7208 (section 4.5) says that if more than one SPF record is found, the result is <code>permerror</code> — receiving servers treat the domain as having no valid SPF policy, and mail from both services is more likely to land in spam. The fix is one record: <code>"v=spf1 include:_spf.porkbun.com include:amazonses.com ~all"</code>. Nothing on the website breaks, which is why nobody noticed.</div>
<p>And no CAA record, which means every public CA is allowed to issue for the name. Adding <code>0 issue "letsencrypt.org"</code> costs nothing and turns a mis-issuance by any other CA into a refusal.</p>

<h3>Reading DNS with <code>dig</code></h3>
${slide('dv-12', 5, 'dig: hỏi DNS và đọc từng cột')}
<div class="out">$ dig example.com +noall +answer
example.com.  48  IN  A  172.66.147.243
example.com.  48  IN  A  104.20.23.154</div>
<p>Five columns: the name (with a trailing dot — the root of the tree), the <strong>remaining</strong> TTL in seconds, the class (always <code>IN</code>), the type, and the value. The TTL column is the one people misread: from a caching resolver it is not the TTL the owner configured, it is how much of it is left in that resolver's cache. Asked twenty seconds apart from the same Mac:</p>
<div class="out">$ dig example.com +noall +answer   # lần 1
example.com.		23	IN	A	172.66.147.243
example.com.		23	IN	A	104.20.23.154
$ dig example.com +noall +answer   # lần 2
example.com.		3	IN	A	172.66.147.243
example.com.		3	IN	A	104.20.23.154</div>
<table>
<tr><th>Form</th><th>What it does</th></tr>
<tr><td><code>dig name</code></td><td>Type A, through the resolver in <code>/etc/resolv.conf</code> (macOS: the system resolver).</td></tr>
<tr><td><code>dig name TYPE</code></td><td>Any type: <code>AAAA</code>, <code>NS</code>, <code>TXT</code>, <code>CAA</code>, <code>MX</code>…</td></tr>
<tr><td><code>+short</code></td><td>Values only — for scripts.</td></tr>
<tr><td><code>+noall +answer</code></td><td>Only the answer section, with TTLs — for reading.</td></tr>
<tr><td><code>@server</code></td><td>Ask that server directly. Asking an authoritative server shows what the owner published <em>now</em>; asking a resolver shows what it has cached.</td></tr>
<tr><td><code>+trace</code></td><td>Start at the root servers and follow the delegation down (<code>.</code> → <code>com.</code> → your NS). Shows whether the registrar's NS change has reached the <code>.com</code> zone.</td></tr>
<tr><td><code>-x IP</code></td><td>Reverse lookup (PTR). Mail servers check it.</td></tr>
</table>
<p>A network can take some of this away from you. On the network this lesson was written from, outbound port 53 is blocked, so anything that talks to a DNS server other than the network's own resolver times out:</p>
<div class="out">$ dig @1.1.1.1 example.com
; (1 server found)
;; global options: +cmd
;; connection timed out; no servers could be reached
$ dig +trace example.com
;; global options: +cmd
;; connection timed out; no servers could be reached</div>
<p>That is not a broken <code>dig</code>, and it is common on university and company networks. Run <code>+trace</code> from the VPS instead, or use DNS over HTTPS, which travels on port 443 like any web request: <code>curl -H "accept: application/dns-json" "https://cloudflare-dns.com/dns-query?name=example.com&amp;type=A"</code>.</p>
<p><strong>On Windows and macOS.</strong> macOS ships <code>dig</code>. Windows does not; in PowerShell use <code>Resolve-DnsName example.com -Type A</code> (add <code>-Server 1.1.1.1</code> to pick a server), or install the BIND tools, or run <code>dig</code> inside WSL. <code>nslookup</code> exists everywhere but hides the TTL unless asked, which is exactly the column you need here.</p>

<h3>TTL and caching, measured: why a changed IP "has not taken effect"</h3>
${slide('dv-12', 6, 'TTL đếm ngược: máy có thẩm quyền đổi ngay, resolver giữ IP cũ tới hết TTL')}
<p>To watch caching happen rather than guess at it, the lab has two DNS servers of its own: <code>dv12-dns</code> running bind9 as the <strong>authoritative</strong> server for <code>vidu.test</code> (the one the owner edits), and <code>dv12-res</code> running unbound as a <strong>caching resolver</strong> — the role 1.1.1.1, 8.8.8.8 or your ISP plays. The zone:</p>
<pre><code>$TTL 60
@   IN SOA ns1.vidu.test. admin.vidu.test. ( 2026092901 3600 600 86400 30 )
@   IN NS  ns1.vidu.test.
ns1 IN A   172.22.12.53
@   IN A   203.0.113.10
www IN CNAME vidu.test.
@   IN CAA 0 issue "letsencrypt.org"
@   IN TXT "v=spf1 -all"</code></pre>
<p>The experiment: ask the resolver for <code>vidu.test</code> and for a name that does not exist yet (<code>api.vidu.test</code>), then change the A record to <code>203.0.113.20</code>, add <code>api</code>, bump the serial, reload bind — and ask both servers every ten seconds.</p>
<div class="out">== 14:27:13 truoc khi doi
vidu.test.		47	IN	A	203.0.113.10
vidu.test.		30	IN	SOA	ns1.vidu.test. admin.vidu.test. 2026092901 3600 600 86400 30
;; -&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, status: NXDOMAIN, id: 41964
== 14:27:15
auth: 203.0.113.20
res : vidu.test.		46	IN	A	203.0.113.10
api : status: NXDOMAIN
== 14:27:25
auth: 203.0.113.20
res : vidu.test.		36	IN	A	203.0.113.10
api : status: NXDOMAIN
== 14:27:35
auth: 203.0.113.20
res : vidu.test.		25	IN	A	203.0.113.10
api : status: NXDOMAIN
== 14:27:46
auth: 203.0.113.20
res : vidu.test.		15	IN	A	203.0.113.10
api : status: NOERROR
== 14:27:56
auth: 203.0.113.20
res : vidu.test.		5	IN	A	203.0.113.10
api : status: NOERROR
== 14:28:06
auth: 203.0.113.20
res : vidu.test.		60	IN	A	203.0.113.20
api : status: NOERROR</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The authoritative server changed instantly</span><span class="v">Two seconds after the edit, <code>auth</code> already answers <code>.20</code>. Anyone testing by asking the authoritative server — or whose resolver had nothing cached — concludes "it works".</span></div>
  <div class="kv"><span class="k">The resolver kept the old IP for the rest of its TTL</span><span class="v">It had cached <code>.10</code> with 46 seconds left, and served it until the countdown hit zero, then fetched <code>.20</code> with a fresh 60. Nothing was wrong; that is what the TTL promised.</span></div>
  <div class="kv"><span class="k">"It does not exist" is cached too</span><span class="v">The resolver had been asked for <code>api.vidu.test</code> before it existed. It cached that NXDOMAIN for the SOA's last field — 30 seconds here — and kept saying "no such name" after the record was created. This is negative caching (RFC 2308); in real zones that field is often 300–3600 seconds.</span></div>
</div>
<p>Scale the numbers up and you have the SWP391 evening. <code>cuongthai.com</code>'s A record has a TTL of 1200 seconds; many DNS hosts default to 3600 or more. The lecturer's university resolver had the old IP cached; the teammates' phones on mobile data asked a resolver that had not. Both were correct.</p>
<div class="callout ok"><strong>The move that avoids it.</strong> One TTL-length <em>before</em> changing the IP, lower the record's TTL to 60–300 seconds (if the TTL was 1200, do it at least 20 minutes ahead; if it was 86400, a day ahead). Change the IP. Keep the old server running until the old TTL has certainly expired. Then raise the TTL again. Chapter 14 uses exactly this for a VPS migration.</div>
<p><strong>Try it step by step on the lab.</strong> (1) Run bind9 with the zone above and unbound with a <code>stub-zone</code> pointing at it. (2) <code>dig @resolver vidu.test +noall +answer</code> and note the TTL. (3) Edit the zone, raise the serial, reload bind (<code>kill -HUP</code> or <code>rndc reload</code>). (4) Ask both servers every ten seconds and write down the moment the resolver switches. If the zone file is bind-mounted into a container, write it in place (<code>cat new &gt; db.vidu.test</code>): <code>sed -i</code> replaces the inode and the container keeps reading the old file — the same trap as nginx.conf in Chapter 13.</p>

<h3>Orange or grey: whether your server's real IP is public</h3>
${slide('dv-12', 7, 'Cloudflare cam hay xám: cuongthai.com lộ IP thật, media.cuongthai.com thì không')}
<p>Cloudflare, as a DNS host, lets you mark A, AAAA and CNAME records as "proxied" (the orange cloud) or "DNS only" (grey). Its documentation is direct: a query for a proxied record is answered with Cloudflare anycast IP addresses, a DNS-only record with the actual origin IP; only A, AAAA and CNAME can be proxied (MX and TXT are always DNS-only); and proxied records have a TTL of "Auto", 300 seconds, which cannot be edited. The two names above show both:</p>
<ul>
<li><code>cuongthai.com</code> answers <code>160.187.1.208</code> with the TTL the owner set (1200) — grey. The VPS certificate, the VPS firewall and the VPS bandwidth face the whole Internet directly.</li>
<li><code>media.cuongthai.com</code> answers two Cloudflare addresses with a TTL of 240 counting down from 300 — orange. Visitors talk to Cloudflare; Cloudflare talks to the origin (here, R2 object storage — Lesson 12.4).</li>
</ul>
<table>
<tr><th></th><th>Grey (DNS only)</th><th>Orange (proxied)</th></tr>
<tr><td>Origin IP in DNS</td><td>public</td><td>hidden — if nothing else reveals it</td></tr>
<tr><td>Caching, DDoS absorption</td><td>none</td><td>yes (what is cached: 12.4)</td></tr>
<tr><td>Certificates</td><td>one, on your server</td><td>two: browser↔Cloudflare (theirs) and Cloudflare↔server (yours)</td></tr>
<tr><td>SSH, database, non-HTTP ports</td><td>work</td><td>do not pass through the proxy</td></tr>
<tr><td>Use when</td><td>you need SSH by name, or you are debugging</td><td>public web traffic, static assets</td></tr>
</table>
<div class="callout warn"><strong>Turning the cloud orange does not hide an IP that is already known.</strong> Old A records live on in public DNS history services; <code>MX cuongthai.com</code> points mail at the same machine; and the VPS still accepts connections from anyone who types the IP. Hiding the origin means also restricting ports 80/443 to Cloudflare's published address ranges. And never pick the SSL mode "Flexible": it serves HTTPS to the browser and plain HTTP from Cloudflare to your server, so the second half travels unencrypted.</div>

<h3><code>/etc/hosts</code> still wins, and Docker has a DNS of its own</h3>
${slide('dv-12', 8, '/etc/hosts thắng DNS; container có DNS nhúng 127.0.0.11')}
<div class="out">$ grep -v "^#" /etc/resolv.conf | grep .
nameserver 127.0.0.11
options ndots:0
$ getent hosts vidu.test
172.22.0.3      vidu.test
$ dig vidu.test +short
172.22.0.3
$ echo "203.0.113.99 vidu.test" | sudo tee -a /etc/hosts &gt;/dev/null
$ getent hosts vidu.test
203.0.113.99    vidu.test
$ dig vidu.test +short
172.22.0.3
$ grep hosts /etc/nsswitch.conf
hosts:          files dns
$ sudo sed -i "/203.0.113.99/d" /etc/hosts
sed: cannot rename /etc/sedk9TLIa: Device or resource busy</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>hosts: files dns</code></span><span class="v">The resolver library (used by <code>getent</code>, curl, Node, Python, browsers) reads <code>/etc/hosts</code> first and only then asks DNS. <code>dig</code> does not use that library — it always asks a DNS server — so <code>dig</code> and your app can disagree.</span></div>
  <div class="kv"><span class="k"><code>nameserver 127.0.0.11</code></span><span class="v">Inside a container on a user-defined Docker network, DNS goes to Docker's embedded server, which knows container names and network aliases (<code>vidu.test</code> is an alias of <code>dv12-vps</code> in this lab) and forwards everything else to the host's resolver.</span></div>
  <div class="kv"><span class="k"><code>Device or resource busy</code></span><span class="v">Docker bind-mounts <code>/etc/hosts</code> as a single file. <code>sed -i</code> writes a temporary file and renames it over the original — a new inode, which a single-file mount cannot accept. Write in place: <code>grep -v 203.0.113.99 /etc/hosts &gt; /tmp/h; sudo sh -c "cat /tmp/h &gt; /etc/hosts"</code>.</span></div>
</div>
<p>This is useful on purpose: point a name at a server that DNS does not know about yet and test it end to end. Without editing any file, curl can do the same for one request: <code>curl --resolve vidu.com:443:203.0.113.20 https://vidu.com/</code> sends the right SNI and Host header to that IP.</p>
<p><strong>On Windows and macOS.</strong> The file is <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code> (edit as administrator) and <code>/etc/hosts</code> on macOS. Both systems cache DNS too: <code>ipconfig /flushdns</code> on Windows, <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code> on macOS. Browsers keep their own cache on top (<code>chrome://net-internals/#dns</code>). And a line left in <code>hosts</code> after testing is a classic "works only on my machine".</p>

<div class="pitfall co-tieu-de"><strong>Trap — "I checked and the new IP is live" from the one machine that cannot see the problem.</strong> Right after a change, your own laptop either asks the authoritative server (the DNS host's dashboard, <code>dig @ns</code>), has nothing cached, or has a <code>hosts</code> line you forgot. It sees the new IP; users behind a busy ISP resolver see the old one for up to one full TTL. Check from outside — <code>dig @1.1.1.1</code>, <code>dig @8.8.8.8</code>, a phone on mobile data — and keep the old server alive until the old TTL is over.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team is moving the SWP391 app to a new VPS tomorrow night. Rehearse the DNS side on the lab so you can say exactly when every user will reach the new server.</p>
<ol>
<li>On the lab network, run bind9 as the authoritative server for <code>vidu.test</code> (TTL 60, SOA minimum 30) and unbound as a caching resolver with a <code>stub-zone</code> pointing at it.</li>
<li>Through the resolver, ask for <code>vidu.test</code> and for <code>api.vidu.test</code> (which does not exist yet). Note the TTL and the NXDOMAIN.</li>
<li>Change the A record, add <code>api</code>, raise the serial, reload bind. Every 10 seconds, ask both servers and log the time.</li>
<li>Read the real public records of a domain you use (<code>NS</code>, <code>A</code>, <code>AAAA</code>, <code>CAA</code>, <code>TXT</code>) and look for two <code>v=spf1</code> records or a missing CAA.</li>
</ol>
<p><strong>Done when:</strong> you can state "the resolver switched at T, which is the change time plus the TTL it had left", the NXDOMAIN lasted about the SOA minimum, and you have one concrete improvement for a real domain's records.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Registrar</span><span class="v">The company you rent the name from; it holds which name servers are authoritative.</span></div>
  <div class="kv"><span class="k">DNS host / authoritative server</span><span class="v">Holds the actual records and is the source of truth for them.</span></div>
  <div class="kv"><span class="k">Resolver (recursive, caching)</span><span class="v">Asks on behalf of clients and caches answers — 1.1.1.1, 8.8.8.8, your ISP, your university.</span></div>
  <div class="kv"><span class="k">TTL (time to live)</span><span class="v">How long a resolver may reuse an answer; the column <code>dig</code> shows is the time left.</span></div>
  <div class="kv"><span class="k">Negative caching</span><span class="v">A resolver remembering "this name does not exist" for the SOA minimum.</span></div>
  <div class="kv"><span class="k">Apex</span><span class="v">The bare domain (<code>cuongthai.com</code>), which cannot hold a CNAME.</span></div>
  <div class="kv"><span class="k">CAA</span><span class="v">A record naming the CAs allowed to issue certificates for the domain.</span></div>
  <div class="kv"><span class="k">Proxied / DNS-only</span><span class="v">Cloudflare's orange/grey switch: answer with their IPs or with yours.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A domain involves a registrar, a DNS host and your server; know which account changes what, and guard the registrar account.</li>
<li>A resolver serves a cached answer until its TTL runs out — measured: 46 seconds of the old IP after the change.</li>
<li>Lower the TTL one TTL-length before a move, and keep the old server running until the old TTL has passed.</li>
<li>Non-existence is cached too; do not query a name before creating it.</li>
<li>Read real records with <code>dig</code> — this lesson found two SPF records and no CAA on a live domain.</li>
<li><code>/etc/hosts</code> beats DNS for applications but not for <code>dig</code>; <code>curl --resolve</code> tests a server before DNS points at it.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 2308 — Negative caching of DNS queries</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc2308 — why "no such name" is remembered, and which SOA field decides for how long.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8659 — DNS CAA resource record</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc8659 — the one-line record that limits which CA may issue for your name.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7208 — SPF, section 4.5</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc7208 — "more than one record" means permerror.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Proxy status</span><span class="lc-sub">developers.cloudflare.com/dns/proxy-status — which records can be proxied, what IP each answers with, and the fixed 300-second TTL.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — networking, DNS and SSH to a remote machine</span><span class="lc-sub">/courses/linux-bash/learn${REF} — resolv.conf, nsswitch and getent from the machine's side.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Tên miền và DNS: ai giữ cái gì, và vì sao đổi IP rồi mà "chưa ăn"</h2>
<p class="lead">Tối trước hôm bảo vệ SWP391, nhóm chuyển app sang một VPS lớn hơn và sửa tên miền trỏ về IP mới. Hai bạn trong nhóm mở trang và thấy bản mới. Thầy, ngồi trong mạng của trường, thấy bản CŨ — mà máy cũ thì đã tắt. Không ai làm sai điều gì mà chỉ tay vào được. Bài này nói vì sao chuyện đó xảy ra, đo trên một máy DNS thí nghiệm, và về ba bên KHÁC NHAU mà bạn phụ thuộc ngay khi trang web có một cái tên.</p>

<h3>Lịch sử ngắn: từ một tệp chữ tới DNS</h3>
<p>Trước khi có DNS, mọi máy trên ARPANET tra tên từ MỘT tệp duy nhất, <code>HOSTS.TXT</code>, do Trung tâm Thông tin Mạng ở SRI giữ bằng tay — nhóm của Elizabeth Feinler vận hành sổ đăng ký tên máy đó từ 1972 tới 1989 — và mọi nơi định kỳ tải về. Cách đó không lớn nổi: một tệp, một người sửa, mỗi thay đổi phải chép tới mọi máy. Paul Mockapetris thiết kế Hệ thống Tên miền (Domain Name System) năm 1983 (RFC 882 và 883, tháng 11/1983), rồi RFC 1034 và 1035 thay chúng vào tháng 11/1987. Hai RFC đó vẫn là lõi của thứ VPS của bạn dùng hôm nay. Ý tưởng cũ cũng chưa bao giờ biến mất: <code>/etc/hosts</code> trên mọi máy Linux, macOS, Windows là hậu duệ trực tiếp của <code>HOSTS.TXT</code>, và — như cuối bài cho thấy — nó vẫn THẮNG DNS.</p>

<h3>Ba bên, không phải một</h3>
${slide('dv-12', 3, 'Tên miền đi qua ba bên: registrar, nhà DNS, VPS — số liệu thật của cuongthai.com')}
<p>Câu "em mua tên miền rồi" giấu ba vai trò khác nhau, thường ở ba công ty khác nhau. Đọc bản ghi công khai của chính tên miền đang chạy khoá học này (chỉ đọc, 29/09/2026):</p>
<div class="out">$ dig cuongthai.com NS +noall +answer
cuongthai.com.  1200  IN  NS  kyrie.ns.cloudflare.com.
cuongthai.com.  1200  IN  NS  meilani.ns.cloudflare.com.
$ dig cuongthai.com A +noall +answer
cuongthai.com.  1163  IN  A  160.187.1.208
$ curl -s https://rdap.verisign.com/com/v1/domain/cuongthai.com | jq -r '.entities[]? | select(.roles[]=="registrar") | .vcardArray[1][] | select(.[0]=="fn") | .[3]'
Porkbun LLC
$ curl -s https://rdap.verisign.com/com/v1/domain/cuongthai.com | jq -r '.events[] | "\\(.eventAction) \\(.eventDate)"'
registration 2026-06-07T21:31:00Z
expiration 2027-06-07T21:31:00Z
last changed 2026-06-19T16:12:23Z
last update of RDAP database 2026-09-29T07:26:13Z</div>
<table>
<tr><th>Bên</th><th>Ở đây</th><th>Giữ cái gì</th><th>Bạn vào đó để…</th></tr>
<tr><td><strong>Registrar</strong> (nhà đăng ký)</td><td>Porkbun</td><td>Quyền dùng cái tên, thuê từng năm; và máy chủ tên nào có thẩm quyền (bản ghi NS nằm trong vùng <code>.com</code>)</td><td>gia hạn, đổi máy chủ tên, khoá chuyển nhượng, đổi thông tin chủ sở hữu</td></tr>
<tr><td><strong>DNS host</strong> (nơi giữ bản ghi)</td><td>Cloudflare</td><td>Chính các bản ghi: A, AAAA, CNAME, TXT, MX, CAA</td><td>trỏ tên sang IP mới, thêm tên miền con, thêm TXT để xác minh</td></tr>
<tr><td><strong>Máy chủ</strong></td><td>VPS 160.187.1.208</td><td>Ứng dụng, chứng chỉ, tường lửa</td><td>mọi thứ phần còn lại của khoá này bàn tới</td></tr>
</table>
<p>RDAP (Registration Data Access Protocol — giao thức tra dữ liệu đăng ký) là người kế nhiệm của <code>whois</code>, trả JSON qua HTTPS, và vẫn trả lời được trên những mạng chặn cổng 43 của <code>whois</code>. Ngày đáng chép ra giấy là <code>expiration</code>: tên miền hết hạn thì cả trang chết dù mọi máy chủ đều khoẻ, và đó là kiểu hỏng DUY NHẤT mà không phép giám sát nào trên VPS nhìn thấy được.</p>
<div class="callout warn"><strong>Giữ tài khoản registrar như giữ khoá root của máy chủ.</strong> Ai nắm được nó thì đổi được máy chủ tên, và trong vòng TTL của bản ghi NS sẽ nhận MỌI request và MỌI email của tên miền bạn — lại còn xin được chứng chỉ HTTPS hợp lệ cho nó, vì CA chỉ kiểm xem bạn có kiểm soát cái tên hay không. Bật xác thực hai lớp, bật tự gia hạn bằng một cái thẻ năm sau vẫn còn hạn, và để yên khoá chuyển nhượng (transfer lock).</div>

<h3>Mua tên miền: kiểm những gì</h3>
<ul>
<li><strong>Giá GIA HẠN, không phải giá năm đầu.</strong> Nhiều đuôi rẻ năm đầu rồi đắt gấp mấy lần từ năm thứ hai. Nhìn dòng "renewal" trên trang giá của registrar trước khi chọn.</li>
<li><strong>WHOIS privacy</strong> (ẩn thông tin chủ) — tên, số điện thoại, địa chỉ của bạn có bị lộ trong dữ liệu đăng ký công khai không. Đa số registrar có sẵn; hãy kiểm.</li>
<li><strong>DNS nằm ở đâu.</strong> Bạn để DNS ngay ở registrar, hoặc giao cho nơi khác (tên miền của Cường: đăng ký ở Porkbun, DNS ở Cloudflare). Giao đi chỉ là một thay đổi: thay bản ghi NS ở registrar bằng cặp NS mà nhà DNS đưa cho bạn.</li>
<li><strong>Tên miền con miễn phí là cái bẫy cho thứ cần sống lâu.</strong> Cái tên không phải của bạn thì có thể bị thu lại; bạn cũng không đặt được CAA hay một TTL hợp lý trên nó.</li>
</ul>

<h3>Bảy loại bản ghi bạn sẽ thật sự gõ</h3>
${slide('dv-12', 4, 'Bảy loại bản ghi, ví dụ đọc từ tên miền thật')}
<div class="out">$ dig cuongthai.com MX +noall +answer
cuongthai.com.  1200  IN  MX  10 cuongthai.com.
cuongthai.com.  1200  IN  MX  20 fwd2.porkbun.com.
$ dig cuongthai.com TXT +noall +answer
cuongthai.com.  1200  IN  TXT  "google-site-verification=…"
…
cuongthai.com.  1200  IN  TXT  "v=spf1 include:_spf.porkbun.com ~all"
cuongthai.com.  1200  IN  TXT  "v=spf1 include:amazonses.com ~all"
$ dig cuongthai.com CAA +noall +answer
$ dig cuongthai.com AAAA +noall +answer
$ dig media.cuongthai.com A +noall +answer
media.cuongthai.com.  240  IN  A  172.67.161.19
media.cuongthai.com.  240  IN  A  104.21.90.200</div>
<table>
<tr><th>Loại</th><th>Trỏ tên tới</th><th>Luật đáng nhớ</th></tr>
<tr><td><code>A</code> / <code>AAAA</code></td><td>địa chỉ IPv4 / IPv6</td><td>Không có AAAA thì máy chỉ có IPv6 không tới được bạn; AAAA SAI còn tệ hơn không có — vài client thử nó trước rồi treo.</td></tr>
<tr><td><code>CNAME</code></td><td>một TÊN khác</td><td>CNAME không được đứng chung với bản ghi nào khác của cùng tên, nên không đặt được ở đỉnh (apex — <code>cuongthai.com</code> vốn đã có SOA và NS). Dùng cho <code>www</code>. "CNAME flattening" của Cloudflare là cách họ lách ở phía họ.</td></tr>
<tr><td><code>TXT</code></td><td>chuỗi chữ tự do</td><td>SPF, xác minh trang, và <code>_acme-challenge</code> để xin chứng chỉ kiểu DNS-01 (Bài 12.2).</td></tr>
<tr><td><code>CAA</code></td><td>CA nào được phép cấp chứng chỉ cho tên</td><td>Không có CAA = mọi CA công khai đều được. <code>0 issue "letsencrypt.org"</code> là một dòng.</td></tr>
<tr><td><code>MX</code></td><td>máy nhận thư, theo độ ưu tiên</td><td>Số NHỎ được thử trước.</td></tr>
<tr><td><code>NS</code></td><td>ai giữ bản ghi</td><td>Sửa ở REGISTRAR, không phải ở nhà DNS.</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Bẫy — hai bản ghi SPF cũng như không có bản nào.</strong> Đọc bản ghi thật để viết bài này thì gặp đúng chuyện đó: <code>cuongthai.com</code> đang công bố HAI bản ghi TXT cùng bắt đầu bằng <code>v=spf1</code>, một cho dịch vụ chuyển thư của Porkbun, một cho Amazon SES. RFC 7208 (mục 4.5) nói: tìm thấy hơn một bản ghi SPF thì kết quả là <code>permerror</code> — máy nhận thư coi như tên miền KHÔNG có chính sách SPF hợp lệ, và thư từ cả hai dịch vụ dễ rơi vào hộp thư rác hơn. Cách sửa là gộp thành một: <code>"v=spf1 include:_spf.porkbun.com include:amazonses.com ~all"</code>. Trang web không hỏng chút nào — chính vì thế mà không ai để ý.</div>
<p>Và không có bản ghi CAA nào, nghĩa là CA công khai nào cũng được phép cấp chứng chỉ cho tên này. Thêm <code>0 issue "letsencrypt.org"</code> không tốn gì, và biến một lần cấp nhầm của CA khác thành một lời từ chối.</p>

<h3>Đọc DNS bằng <code>dig</code></h3>
${slide('dv-12', 5, 'dig: hỏi DNS và đọc từng cột')}
<div class="out">$ dig example.com +noall +answer
example.com.  48  IN  A  172.66.147.243
example.com.  48  IN  A  104.20.23.154</div>
<p>Năm cột: tên (có dấu chấm ở cuối — gốc của cây), TTL <strong>CÒN LẠI</strong> tính bằng giây, lớp (luôn là <code>IN</code>), loại, và giá trị. Cột TTL là cột hay bị đọc sai: hỏi qua một resolver đệm thì nó KHÔNG phải TTL chủ tên miền đặt, mà là phần còn lại trong bộ đệm của resolver đó. Hỏi hai lần cách nhau 20 giây từ cùng một máy Mac:</p>
<div class="out">$ dig example.com +noall +answer   # lần 1
example.com.		23	IN	A	172.66.147.243
example.com.		23	IN	A	104.20.23.154
$ dig example.com +noall +answer   # lần 2
example.com.		3	IN	A	172.66.147.243
example.com.		3	IN	A	104.20.23.154</div>
<table>
<tr><th>Dạng</th><th>Làm gì</th></tr>
<tr><td><code>dig ten</code></td><td>Loại A, qua resolver trong <code>/etc/resolv.conf</code> (macOS: resolver của hệ thống).</td></tr>
<tr><td><code>dig ten LOAI</code></td><td>Loại bất kỳ: <code>AAAA</code>, <code>NS</code>, <code>TXT</code>, <code>CAA</code>, <code>MX</code>…</td></tr>
<tr><td><code>+short</code></td><td>Chỉ giá trị — cho script.</td></tr>
<tr><td><code>+noall +answer</code></td><td>Chỉ phần trả lời, có TTL — để đọc.</td></tr>
<tr><td><code>@may-chu</code></td><td>Hỏi THẲNG máy đó. Hỏi máy có thẩm quyền thì thấy thứ chủ tên miền đang công bố LÚC NÀY; hỏi resolver thì thấy thứ nó đang đệm.</td></tr>
<tr><td><code>+trace</code></td><td>Bắt đầu từ máy chủ gốc rồi đi theo chuỗi uỷ quyền (<code>.</code> → <code>com.</code> → NS của bạn). Cho biết thay đổi NS ở registrar đã lên tới vùng <code>.com</code> chưa.</td></tr>
<tr><td><code>-x IP</code></td><td>Tra ngược (bản ghi PTR). Máy nhận thư có kiểm cái này.</td></tr>
</table>
<p>Mạng bạn ngồi có thể lấy mất một phần của bảng trên. Trên mạng nơi bài này được viết, cổng 53 đi ra ngoài bị chặn, nên mọi thứ nói chuyện với một máy DNS KHÁC resolver của mạng đều hết giờ:</p>
<div class="out">$ dig @1.1.1.1 example.com
; (1 server found)
;; global options: +cmd
;; connection timed out; no servers could be reached
$ dig +trace example.com
;; global options: +cmd
;; connection timed out; no servers could be reached</div>
<p>Đó không phải <code>dig</code> hỏng, và chuyện này rất phổ biến ở mạng trường, mạng công ty. Chạy <code>+trace</code> ngay trên VPS, hoặc hỏi DNS qua HTTPS (DoH) — đi cổng 443 như mọi request web: <code>curl -H "accept: application/dns-json" "https://cloudflare-dns.com/dns-query?name=example.com&amp;type=A"</code>.</p>
<p><strong>Trên Windows và macOS.</strong> macOS có sẵn <code>dig</code>. Windows thì không; trong PowerShell dùng <code>Resolve-DnsName example.com -Type A</code> (thêm <code>-Server 1.1.1.1</code> để chọn máy hỏi), hoặc cài bộ công cụ BIND, hoặc chạy <code>dig</code> trong WSL. <code>nslookup</code> có ở mọi nơi nhưng giấu TTL nếu không bảo nó in — mà đó lại đúng là cột bạn cần ở đây.</p>

<h3>TTL và bộ đệm, đo thật: vì sao đổi IP rồi mà "chưa ăn"</h3>
${slide('dv-12', 6, 'TTL đếm ngược: máy có thẩm quyền đổi ngay, resolver giữ IP cũ tới hết TTL')}
<p>Để NHÌN THẤY bộ đệm làm việc thay vì đoán, phòng thí nghiệm có hai máy DNS riêng: <code>dv12-dns</code> chạy bind9 làm máy <strong>có thẩm quyền</strong> (authoritative) cho <code>vidu.test</code> — thứ chủ tên miền sửa — và <code>dv12-res</code> chạy unbound làm <strong>resolver đệm</strong> — đúng vai 1.1.1.1, 8.8.8.8 hay nhà mạng của bạn. Vùng (zone):</p>
<pre><code>$TTL 60
@   IN SOA ns1.vidu.test. admin.vidu.test. ( 2026092901 3600 600 86400 30 )
@   IN NS  ns1.vidu.test.
ns1 IN A   172.22.12.53
@   IN A   203.0.113.10
www IN CNAME vidu.test.
@   IN CAA 0 issue "letsencrypt.org"
@   IN TXT "v=spf1 -all"</code></pre>
<p>Thí nghiệm: hỏi resolver về <code>vidu.test</code> và về một tên CHƯA tồn tại (<code>api.vidu.test</code>), rồi đổi bản ghi A sang <code>203.0.113.20</code>, thêm <code>api</code>, tăng số serial, nạp lại bind — và cứ mười giây hỏi cả hai máy một lần.</p>
<div class="out">== 14:27:13 truoc khi doi
vidu.test.		47	IN	A	203.0.113.10
vidu.test.		30	IN	SOA	ns1.vidu.test. admin.vidu.test. 2026092901 3600 600 86400 30
;; -&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, status: NXDOMAIN, id: 41964
== 14:27:15
auth: 203.0.113.20
res : vidu.test.		46	IN	A	203.0.113.10
api : status: NXDOMAIN
== 14:27:25
auth: 203.0.113.20
res : vidu.test.		36	IN	A	203.0.113.10
api : status: NXDOMAIN
== 14:27:35
auth: 203.0.113.20
res : vidu.test.		25	IN	A	203.0.113.10
api : status: NXDOMAIN
== 14:27:46
auth: 203.0.113.20
res : vidu.test.		15	IN	A	203.0.113.10
api : status: NOERROR
== 14:27:56
auth: 203.0.113.20
res : vidu.test.		5	IN	A	203.0.113.10
api : status: NOERROR
== 14:28:06
auth: 203.0.113.20
res : vidu.test.		60	IN	A	203.0.113.20
api : status: NOERROR</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Máy có thẩm quyền đổi NGAY</span><span class="v">Hai giây sau khi sửa, <code>auth</code> đã trả <code>.20</code>. Ai kiểm bằng cách hỏi máy có thẩm quyền — hoặc có resolver chưa đệm gì — sẽ kết luận "chạy rồi".</span></div>
  <div class="kv"><span class="k">Resolver giữ IP cũ tới hết TTL còn lại</span><span class="v">Nó đã đệm <code>.10</code> với 46 giây còn lại, và cứ trả cái đó tới khi đếm về không, rồi mới lấy <code>.20</code> với TTL mới 60. Không có gì hỏng cả; TTL hứa đúng điều đó.</span></div>
  <div class="kv"><span class="k">"Không tồn tại" cũng bị đệm</span><span class="v">Resolver đã bị hỏi <code>api.vidu.test</code> TRƯỚC khi tên đó có. Nó đệm câu NXDOMAIN (không có tên này) trong khoảng bằng trường cuối của SOA — ở đây 30 giây — và cứ nói "không có" sau khi bản ghi đã được tạo. Đó là bộ đệm âm (negative caching, RFC 2308); ở vùng thật trường đó hay là 300–3600 giây.</span></div>
</div>
<p>Phóng to các con số lên là thành đúng buổi tối SWP391. Bản ghi A của <code>cuongthai.com</code> có TTL 1200 giây; nhiều nhà DNS mặc định 3600 hoặc hơn. Resolver của trường đang đệm IP cũ; điện thoại dùng 4G của hai bạn trong nhóm hỏi một resolver chưa đệm. Cả hai đều ĐÚNG.</p>
<div class="callout ok"><strong>Nước đi tránh được chuyện đó.</strong> TRƯỚC khi đổi IP một khoảng bằng TTL cũ, hạ TTL của bản ghi xuống 60–300 giây (TTL đang là 1200 thì làm trước ít nhất 20 phút; 86400 thì trước một ngày). Đổi IP. Giữ máy cũ chạy tới khi TTL cũ chắc chắn đã hết. Rồi nâng TTL lên lại. Chương 14 dùng đúng nước này khi chuyển VPS.</div>
<p><strong>Chạy thử từng bước trên phòng thí nghiệm.</strong> (1) Chạy bind9 với vùng ở trên, và unbound có một <code>stub-zone</code> trỏ vào nó. (2) <code>dig @resolver vidu.test +noall +answer</code>, ghi lại TTL. (3) Sửa vùng, tăng serial, nạp lại bind (<code>kill -HUP</code> hoặc <code>rndc reload</code>). (4) Mười giây hỏi cả hai máy một lần, ghi lại lúc resolver đổi. Nếu tệp vùng được bind-mount vào container thì ghi đè TẠI CHỖ (<code>cat moi &gt; db.vidu.test</code>): <code>sed -i</code> thay inode và container cứ đọc tệp cũ — đúng cái bẫy nginx.conf ở Chương 13.</p>

<h3>Cam hay xám: IP thật của máy chủ có bị công khai không</h3>
${slide('dv-12', 7, 'Cloudflare cam hay xám: cuongthai.com lộ IP thật, media.cuongthai.com thì không')}
<p>Cloudflare, khi làm nhà DNS, cho bạn đánh dấu bản ghi A, AAAA và CNAME là "proxied" (đám mây cam — đi qua Cloudflare) hoặc "DNS only" (xám — chỉ phân giải tên). Tài liệu của họ nói thẳng: hỏi một bản ghi proxied thì nhận IP anycast của Cloudflare, hỏi bản ghi DNS-only thì nhận IP gốc thật; chỉ A, AAAA và CNAME bật cam được (MX, TXT luôn là DNS-only); và bản ghi proxied có TTL "Auto" = 300 giây, không sửa được. Hai tên ở trên cho thấy cả hai kiểu:</p>
<ul>
<li><code>cuongthai.com</code> trả <code>160.187.1.208</code> với TTL chủ tên đặt (1200) — xám. Chứng chỉ, tường lửa và băng thông của VPS đối mặt TRỰC TIẾP với cả Internet.</li>
<li><code>media.cuongthai.com</code> trả hai địa chỉ của Cloudflare với TTL 240 đang đếm ngược từ 300 — cam. Người xem nói chuyện với Cloudflare; Cloudflare nói chuyện với gốc (ở đây là kho object R2 — Bài 12.4).</li>
</ul>
<table>
<tr><th></th><th>Xám (DNS only)</th><th>Cam (proxied)</th></tr>
<tr><td>IP gốc trong DNS</td><td>công khai</td><td>ẩn — nếu không có gì khác làm lộ</td></tr>
<tr><td>Cache, đỡ DDoS</td><td>không</td><td>có (cache cái gì: 12.4)</td></tr>
<tr><td>Chứng chỉ</td><td>một cái, trên máy bạn</td><td>hai: trình duyệt↔Cloudflare (của họ) và Cloudflare↔máy bạn (của bạn)</td></tr>
<tr><td>SSH, cơ sở dữ liệu, cổng không phải HTTP</td><td>chạy</td><td>không đi qua proxy</td></tr>
<tr><td>Dùng khi</td><td>cần SSH bằng tên, hoặc đang gỡ lỗi</td><td>lưu lượng web công khai, tệp tĩnh</td></tr>
</table>
<div class="callout warn"><strong>Bật cam KHÔNG giấu được một IP đã bị biết.</strong> Bản ghi A cũ còn sống trong các dịch vụ lưu lịch sử DNS; <code>MX cuongthai.com</code> trỏ thư về đúng máy đó; và VPS vẫn nhận kết nối từ bất cứ ai gõ IP. Muốn giấu thật thì phải chỉ cho các dải IP mà Cloudflare công bố vào cổng 80/443. Và đừng bao giờ chọn chế độ SSL "Flexible": nó đưa HTTPS cho trình duyệt nhưng đi HTTP thường từ Cloudflare về máy bạn — nửa sau chạy không mã hoá.</div>

<h3><code>/etc/hosts</code> vẫn thắng, và Docker có DNS riêng</h3>
${slide('dv-12', 8, '/etc/hosts thắng DNS; container có DNS nhúng 127.0.0.11')}
<div class="out">$ grep -v "^#" /etc/resolv.conf | grep .
nameserver 127.0.0.11
options ndots:0
$ getent hosts vidu.test
172.22.0.3      vidu.test
$ dig vidu.test +short
172.22.0.3
$ echo "203.0.113.99 vidu.test" | sudo tee -a /etc/hosts &gt;/dev/null
$ getent hosts vidu.test
203.0.113.99    vidu.test
$ dig vidu.test +short
172.22.0.3
$ grep hosts /etc/nsswitch.conf
hosts:          files dns
$ sudo sed -i "/203.0.113.99/d" /etc/hosts
sed: cannot rename /etc/sedk9TLIa: Device or resource busy</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>hosts: files dns</code></span><span class="v">Thư viện phân giải tên (thứ <code>getent</code>, curl, Node, Python, trình duyệt dùng) đọc <code>/etc/hosts</code> TRƯỚC rồi mới hỏi DNS. <code>dig</code> không dùng thư viện đó — nó luôn hỏi thẳng máy DNS — nên <code>dig</code> và app của bạn có thể nói hai điều khác nhau.</span></div>
  <div class="kv"><span class="k"><code>nameserver 127.0.0.11</code></span><span class="v">Trong container thuộc một mạng Docker tự tạo, DNS đi tới máy DNS nhúng của Docker; nó biết tên container và bí danh mạng (<code>vidu.test</code> là bí danh của <code>dv12-vps</code> trong phòng thí nghiệm này), còn lại thì chuyển tiếp cho resolver của máy chủ.</span></div>
  <div class="kv"><span class="k"><code>Device or resource busy</code></span><span class="v">Docker bind-mount <code>/etc/hosts</code> dưới dạng MỘT tệp. <code>sed -i</code> ghi ra tệp tạm rồi đổi tên đè lên tệp gốc — tức là inode MỚI, thứ mà một bind-mount tệp đơn không nhận. Ghi đè tại chỗ: <code>grep -v 203.0.113.99 /etc/hosts &gt; /tmp/h; sudo sh -c "cat /tmp/h &gt; /etc/hosts"</code>.</span></div>
</div>
<p>Cái thắng này dùng được CÓ CHỦ Ý: trỏ một tên vào máy chủ mà DNS chưa biết, rồi thử từ đầu tới cuối. Không cần sửa tệp nào, curl làm được y hệt cho một request: <code>curl --resolve vidu.com:443:203.0.113.20 https://vidu.com/</code> gửi đúng SNI và header Host tới IP đó.</p>
<p><strong>Trên Windows và macOS.</strong> Tệp nằm ở <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code> (sửa bằng quyền quản trị) và <code>/etc/hosts</code> trên macOS. Cả hai hệ thống đều có bộ đệm DNS riêng: <code>ipconfig /flushdns</code> trên Windows, <code>sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder</code> trên macOS. Trình duyệt còn đệm thêm một lớp nữa (<code>chrome://net-internals/#dns</code>). Và một dòng quên trong <code>hosts</code> sau khi thử là nguồn gốc kinh điển của câu "máy em chạy mà".</p>

<div class="pitfall co-tieu-de"><strong>Bẫy — "em kiểm rồi, IP mới lên rồi" từ đúng cái máy KHÔNG THỂ thấy vấn đề.</strong> Ngay sau khi sửa, laptop của bạn hoặc hỏi thẳng máy có thẩm quyền (bảng điều khiển của nhà DNS, <code>dig @ns</code>), hoặc chưa đệm gì, hoặc có một dòng <code>hosts</code> bạn đã quên. Nó thấy IP mới; người dùng sau một resolver nhà mạng đông khách thấy IP cũ thêm tới trọn một TTL. Kiểm từ BÊN NGOÀI — <code>dig @1.1.1.1</code>, <code>dig @8.8.8.8</code>, một cái điện thoại dùng 4G — và giữ máy cũ sống tới khi TTL cũ đã qua.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối mai nhóm bạn chuyển app SWP391 sang VPS mới. Tập trước phần DNS trên phòng thí nghiệm để nói được CHÍNH XÁC lúc nào mọi người dùng sẽ tới máy mới.</p>
<ol>
<li>Trên mạng thí nghiệm, chạy bind9 làm máy có thẩm quyền cho <code>vidu.test</code> (TTL 60, SOA minimum 30) và unbound làm resolver đệm với một <code>stub-zone</code> trỏ vào nó.</li>
<li>Qua resolver, hỏi <code>vidu.test</code> và <code>api.vidu.test</code> (chưa tồn tại). Ghi lại TTL và câu NXDOMAIN.</li>
<li>Đổi bản ghi A, thêm <code>api</code>, tăng serial, nạp lại bind. Mười giây hỏi cả hai máy một lần, ghi giờ.</li>
<li>Đọc bản ghi công khai thật của một tên miền bạn dùng (<code>NS</code>, <code>A</code>, <code>AAAA</code>, <code>CAA</code>, <code>TXT</code>) và tìm xem có hai bản <code>v=spf1</code> hay thiếu CAA không.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được "resolver đổi lúc T, bằng lúc sửa cộng TTL nó còn lại", NXDOMAIN kéo dài khoảng bằng SOA minimum, và có một cải tiến cụ thể cho bản ghi của một tên miền thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Registrar (nhà đăng ký tên miền)</span><span class="v">Nơi bạn thuê cái tên; giữ thông tin máy chủ tên nào có thẩm quyền.</span></div>
  <div class="kv"><span class="k">DNS host / authoritative server (máy có thẩm quyền)</span><span class="v">Giữ chính các bản ghi và là nguồn sự thật của chúng.</span></div>
  <div class="kv"><span class="k">Resolver (máy phân giải đệ quy, có đệm)</span><span class="v">Đi hỏi thay cho client và đệm câu trả lời — 1.1.1.1, 8.8.8.8, nhà mạng, mạng trường.</span></div>
  <div class="kv"><span class="k">TTL — time to live (thời gian sống)</span><span class="v">Resolver được dùng lại câu trả lời bao lâu; cột <code>dig</code> in ra là phần CÒN LẠI.</span></div>
  <div class="kv"><span class="k">Negative caching (bộ đệm âm)</span><span class="v">Resolver nhớ "tên này không tồn tại" trong khoảng bằng SOA minimum.</span></div>
  <div class="kv"><span class="k">Apex (đỉnh tên miền)</span><span class="v">Tên trần (<code>cuongthai.com</code>), không đặt được CNAME.</span></div>
  <div class="kv"><span class="k">CAA (quyền cấp chứng chỉ)</span><span class="v">Bản ghi liệt kê những CA được phép cấp chứng chỉ cho tên miền.</span></div>
  <div class="kv"><span class="k">Proxied / DNS-only (cam / xám)</span><span class="v">Công tắc của Cloudflare: trả lời bằng IP của họ hay IP của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một tên miền dính tới registrar, nhà DNS và máy chủ của bạn; biết tài khoản nào đổi được gì, và giữ kỹ tài khoản registrar.</li>
<li>Resolver trả câu trả lời đã đệm tới khi TTL hết — đo được: 46 giây IP cũ sau khi đã sửa.</li>
<li>Hạ TTL trước khi chuyển một khoảng bằng TTL cũ, và giữ máy cũ chạy tới khi TTL cũ đã qua.</li>
<li>"Không tồn tại" cũng bị đệm; đừng hỏi một tên trước khi tạo nó.</li>
<li>Đọc bản ghi thật bằng <code>dig</code> — bài này tìm ra hai bản SPF và không có CAA trên một tên miền đang chạy.</li>
<li><code>/etc/hosts</code> thắng DNS với ứng dụng nhưng không với <code>dig</code>; <code>curl --resolve</code> thử một máy trước khi DNS trỏ tới nó.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 2308 — Bộ đệm âm của truy vấn DNS</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc2308 — vì sao "không có tên này" được nhớ, và trường SOA nào quyết định nhớ bao lâu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 8659 — Bản ghi CAA</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc8659 — một dòng giới hạn CA nào được cấp chứng chỉ cho tên bạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7208 — SPF, mục 4.5</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc7208 — "hơn một bản ghi" nghĩa là permerror.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Proxy status</span><span class="lc-sub">developers.cloudflare.com/dns/proxy-status — bản ghi nào bật cam được, mỗi kiểu trả IP nào, và TTL cố định 300 giây.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mạng, DNS và SSH vào máy từ xa</span><span class="lc-sub">/courses/linux-bash/learn${REF} — resolv.conf, nsswitch và getent nhìn từ phía máy.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: "12.2 — A reverse proxy and HTTPS: certificates from ACME, renewed forever|||12.2 — Reverse proxy và HTTPS: chứng chỉ từ ACME, gia hạn mãi mãi",
      slug: "deploy-12-2-reverse-proxy-tls",
      type: "LESSON",
      isFreePreview: true,
      description: "Vì sao app không nghe thẳng 443, ACME HTTP-01 và DNS-01 chạy thật với Pebble, certbot từng cờ, gia hạn xong mà nginx vẫn đưa chứng chỉ cũ, bộ hẹn giờ và deploy hook, Caddy tự cấp, kiểm hạn trên dây, và giới hạn của Let’s Encrypt tính đến 09/2026.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>A reverse proxy and HTTPS: certificates from ACME, renewed forever</h2>
<p class="lead">Getting the first certificate takes three seconds. The expensive failure comes 60–90 days later, on a day nobody is deploying: the renewal ran, a new certificate sits on disk, and the site still serves the old one until it expires in front of users. This lesson gets a certificate the way Let's Encrypt issues them — through ACME, against Pebble, Let's Encrypt's own test server — and then spends most of its time on what happens after: renewal, reloading, checking on the wire, and the limits you hit when you retry carelessly.</p>

<h3>A short history: from a purchase to a protocol</h3>
<p>Until the mid-2010s a certificate was something you bought, installed by hand, and renewed by hand a year or two later — which is why so many small sites stayed on plain HTTP. Let's Encrypt was announced on 18 November 2014, issued its first certificate on 14 September 2015, opened a public beta on 3 December 2015 and left beta on 12 April 2016; it passed one billion certificates on 27 February 2020. The idea that changed things was not the free price but the protocol: ACME (Automatic Certificate Management Environment), standardised as RFC 8555 in March 2019, lets a program prove control of a name and get a certificate with no human involved. HSTS (RFC 6797, 2012) made "always HTTPS" something a site can demand of browsers. The consequence for you: certificates are short-lived and renewed by software — and that software is now a part of your deployment that can fail.</p>

<h3>Why the app does not listen on 443 itself</h3>
${slide('dv-12', 9, 'App không nghe thẳng 443: nginx đứng trước, giữ chứng chỉ và đường ACME')}
<p>Your Express or Next.js app can serve HTTPS. On a VPS it almost never should:</p>
<table>
<tr><th>Reason</th><th>What goes wrong otherwise</th></tr>
<tr><td>Ports below 1024 need root (or <code>CAP_NET_BIND_SERVICE</code>)</td><td>An app running as root turns any remote-code bug into a lost machine.</td></tr>
<tr><td>The certificate changes every 60–90 days</td><td>Every renewal would need the app restarted — or hand-written reload logic in the app.</td></tr>
<tr><td>One IP, several apps (web, API, admin)</td><td>Only one process can own port 443; nginx routes by <code>server_name</code>.</td></tr>
<tr><td>Port 80 must stay useful</td><td>Someone has to answer the ACME challenge and redirect everything else.</td></tr>
</table>
<p>So nginx (or Caddy) terminates TLS — decrypts it — on 80/443, and forwards plain HTTP to the app on <code>127.0.0.1:3000</code>, which nobody outside can reach (Lesson 12.3 checks that). The syntax of <code>server</code>, <code>location</code>, <code>proxy_pass</code>, the certificate chain and cipher choices is in the Nginx course (<code>/courses/nginx</code>) (Chapters 3 and 6); this lesson does not repeat it.</p>

<h3>ACME, step by step</h3>
${slide('dv-12', 10, 'ACME HTTP-01: certbot, CA và nginx nói gì với nhau')}
<ol>
<li><strong>Account.</strong> The client (certbot, Caddy, acme.sh…) creates a key pair and registers it with the CA. Every later request is signed with that key.</li>
<li><strong>Order.</strong> "I want a certificate for <code>vidu.test</code> and <code>www.vidu.test</code>." The CA answers with one <em>authorization</em> per name, each offering challenges.</li>
<li><strong>Challenge.</strong> For HTTP-01 the CA hands over a token; the client places a file derived from it where the web server serves <code>/.well-known/acme-challenge/&lt;token&gt;</code>.</li>
<li><strong>Validation.</strong> The client says "ready"; the CA fetches that URL <em>from the Internet</em>, on port 80, using public DNS. If the content matches, the name is proven.</li>
<li><strong>Finalize.</strong> The client sends a CSR (the public key it wants certified); the CA returns the certificate and chain.</li>
</ol>
<p>Step 4 is visible in nginx's access log on the lab VPS — the CA's validation server really did connect to port 80:</p>
<div class="out">172.22.12.14 - - [29/Sep/2026:07:29:47 +0000] "GET /.well-known/acme-challenge/Vi3MQvo75T7EIqSU4S4SPBBKoDnaORYMM66ITYjygww HTTP/1.1" 200 87 "-" "LetsEncrypt-Pebble-VA (linux; arm64)"
172.22.12.14 - - [29/Sep/2026:07:29:47 +0000] "GET /.well-known/acme-challenge/wReOSHQWfZ4ohL-x16fxVEBPLtPsfpgjKQ2fe5YIEAE HTTP/1.1" 200 87 "-" "LetsEncrypt-Pebble-VA (linux; arm64)"</div>
<p>What ACME proves is <em>control of the name right now</em> — not who you are. That is why the registrar account from Lesson 12.1 is worth guarding: whoever can point your name somewhere can get a valid certificate for it.</p>

<h3>A CA for the lab: Pebble</h3>
<p>Practising against the real Let's Encrypt is a bad idea: you hit rate limits within minutes (end of this lesson), and your lab names are not public anyway. Pebble is Let's Encrypt's own small ACME server for testing — its README says in capitals that it is not for production. It listens on 14000 (ACME) and 15000 (management, where its root certificate is published), and by default validates HTTP-01 on port 5002; the lab config sets <code>httpPort</code> to 80 so it behaves like the real CA.</p>
<pre><code class="language-bash">docker network create dv12-net
docker run -d --name dv12-pebble --network dv12-net --network-alias pebble \\
  -e PEBBLE_VA_NOSLEEP=1 \\
  -v $PWD/pebble-config.json:/test/config/pebble-config.json:ro \\
  ghcr.io/letsencrypt/pebble:latest -config /test/config/pebble-config.json
# the VPS container answers as vidu.test and www.vidu.test on the same network
docker run -d --name dv12-vps --network dv12-net \\
  --network-alias vidu.test --network-alias www.vidu.test \\
  -p 127.0.0.1:19122:22 dv12-img</code></pre>
<p>The first attempt failed before any ACME happened, and the error is worth reading:</p>
<div class="out">requests.exceptions.SSLError: HTTPSConnectionPool(host='dv12-pebble', port=14000): Max retries exceeded with url: /dir (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'dv12-pebble'. (_ssl.c:1000)")))</div>
<p>Pebble's own HTTPS certificate is valid for <code>pebble</code> and <code>localhost</code>, not for the container name. Adding the network alias <code>pebble</code> and pointing certbot at <code>https://pebble:14000/dir</code> fixed it, together with <code>REQUESTS_CA_BUNDLE=/usr/local/share/pebble-minica.pem</code> so certbot's Python HTTP client trusts Pebble's API certificate. Neither line exists against the real Let's Encrypt.</p>

<h3>Getting the certificate, measured</h3>
${slide('dv-12', 11, 'certbot certonly --webroot: lỗi khi cổng 80 tắt, thành công khi nginx chạy')}
<pre><code class="language-bash">sudo certbot certonly --webroot -w /var/www/html \\
  -d vidu.test -d www.vidu.test \\
  --server https://pebble:14000/dir \\
  --agree-tos -m admin@vidu.test --no-eff-email -n</code></pre>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>certonly</code></td><td>Obtain the certificate, do not edit any web server config. (Without it, the <code>--nginx</code> plugin rewrites your config — convenient once, hard to reason about later.)</td></tr>
<tr><td><code>--webroot -w DIR</code></td><td>Put challenge files under <code>DIR/.well-known/acme-challenge/</code>; nginx must serve that path on port 80.</td></tr>
<tr><td><code>-d NAME</code></td><td>One per name. All names go into one certificate.</td></tr>
<tr><td><code>--server URL</code></td><td>The ACME directory. Omit it for Let's Encrypt; <code>--test-cert</code> selects their staging server.</td></tr>
<tr><td><code>--agree-tos -m EMAIL --no-eff-email</code></td><td>Accept the terms, give a contact address, skip the newsletter question.</td></tr>
<tr><td><code>-n</code></td><td>Non-interactive: never ask; fail instead. Required in scripts.</td></tr>
<tr><td><code>--cert-name NAME</code></td><td>Name of the directory under <code>live/</code> (defaults to the first <code>-d</code>).</td></tr>
</table>
<p>First with nginx stopped, then with it running:</p>
<div class="out">Account registered.
Requesting a certificate for vidu.test

Certbot failed to authenticate some domains (authenticator: webroot). The Certificate Authority reported these problems:
  Domain: vidu.test
  Type:   connection
  Detail: Get "http://vidu.test:80/.well-known/acme-challenge/Upv7lzZC_UxFwkRoyffMX9ZcsNm5JASR-6zsfXKP8l0": dial tcp 172.22.0.3:80: connect: connection refused
…
real	0m2.353s</div>
<div class="out">Requesting a certificate for vidu.test and www.vidu.test

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/vidu.test/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/vidu.test/privkey.pem
This certificate expires on 2026-12-28.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.
…
real	0m3.690s</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Type: connection</code></span><span class="v">The CA could not open port 80 at the address DNS gave it. Causes, in order of how often they happen: nothing listening (nginx down), a firewall, DNS still pointing at another machine (12.1), IPv6 AAAA pointing somewhere dead.</span></div>
  <div class="kv"><span class="k"><code>Type: unauthorized</code> (not seen here)</span><span class="v">The CA reached a web server but got the wrong content — usually a redirect or <code>location</code> that swallows <code>/.well-known/</code>.</span></div>
  <div class="kv"><span class="k">Files</span><span class="v"><code>live/vidu.test/</code> holds four symlinks into <code>archive/vidu.test/</code> (<code>cert1.pem</code>, <code>chain1.pem</code>, <code>fullchain1.pem</code>, <code>privkey1.pem</code>). Each renewal adds <code>…2.pem</code>, <code>…3.pem</code> and moves the links. Point nginx at <code>live/</code>, never at <code>archive/</code>.</span></div>
</div>

<h3>HTTP-01 or DNS-01</h3>
${slide('dv-12', 12, 'HTTP-01 hay DNS-01: wildcard chỉ đi được DNS-01, hai TXT cùng tên')}
<table>
<tr><th></th><th>HTTP-01</th><th>DNS-01</th><th>TLS-ALPN-01</th></tr>
<tr><td>The CA checks</td><td>a file at <code>http://name/.well-known/acme-challenge/…</code>, port 80 only (redirects allowed only to 80/443)</td><td>a TXT record at <code>_acme-challenge.name</code></td><td>a special certificate offered on port 443</td></tr>
<tr><td>Wildcard <code>*.name</code></td><td>no</td><td>yes — the only way</td><td>no</td></tr>
<tr><td>Server not reachable from the Internet</td><td>no</td><td>yes</td><td>no</td></tr>
<tr><td>Needs on the server</td><td>port 80 open, a webroot</td><td>an API key for your DNS host</td><td>port 443, a client that speaks it (Caddy)</td></tr>
</table>
<p>Measured on the lab, with Pebble told to use the lab's bind9 (<code>-dnsserver 172.22.12.53:53</code>) and certbot's manual hooks writing TXT records with <code>nsupdate</code>:</p>
<div class="out">$ sudo certbot certonly --webroot -w /var/www/html -d "*.vidu.test" …
Account registered.
Requesting a certificate for *.vidu.test
Client with the currently selected authenticator does not support any combination of challenges that will satisfy the CA.
$ sudo certbot certonly --manual --preferred-challenges dns --manual-auth-hook /usr/local/bin/dns-hook.sh --manual-cleanup-hook /usr/local/bin/dns-don.sh -d vidu.test -d "*.vidu.test" --cert-name wildcard …
Requesting a certificate for vidu.test and *.vidu.test
Successfully received certificate.
…
real	0m2.526s
$ sudo openssl x509 -in /etc/letsencrypt/live/wildcard/cert.pem -noout -ext subjectAltName
X509v3 Subject Alternative Name: critical
    DNS:vidu.test, DNS:*.vidu.test</div>
<pre><code class="language-bash">#!/bin/bash
# dns-hook.sh — certbot sets CERTBOT_DOMAIN and CERTBOT_VALIDATION
set -euo pipefail
nsupdate &lt;&lt;NS
server 172.22.12.53
update add _acme-challenge.\${CERTBOT_DOMAIN}. 60 IN TXT "\${CERTBOT_VALIDATION}"
send
NS</code></pre>
<div class="out">updating zone 'vidu.test/IN': adding an RR at '_acme-challenge.vidu.test' TXT "FKXxKmv67KdGWS0xq4UoDI2gHuRoEi2B1Et82cWRwvM"
updating zone 'vidu.test/IN': adding an RR at '_acme-challenge.vidu.test' TXT "CWq2V80R6PSEHVX5kt8e-H6W8Qzz6l3nIXywF1PceaY"
updating zone 'vidu.test/IN': deleting an RR at _acme-challenge.vidu.test TXT
updating zone 'vidu.test/IN': deleting an RR at _acme-challenge.vidu.test TXT</div>
<p>The bind log shows the detail that breaks home-made hooks: <code>vidu.test</code> and <code>*.vidu.test</code> both validate at <strong>the same name</strong>, <code>_acme-challenge.vidu.test</code>, at the same time. A hook that <em>replaces</em> the TXT record instead of <em>adding</em> one makes the first validation fail. On a real DNS host the hook calls the provider's API (certbot has plugins such as <code>certbot-dns-cloudflare</code>), and TXT records may take a while to reach all of the provider's servers — hooks usually wait before saying "ready".</p>
<div class="callout warn"><strong>An API key on the web server is the price of DNS-01.</strong> Let's Encrypt's own documentation warns that putting full DNS API credentials on your web server increases the damage if it is hacked: whoever reads that key can repoint your whole domain. Use a token limited to one zone and to DNS edits, or delegate only <code>_acme-challenge</code> with a CNAME to a zone that exists for nothing else.</div>

<h3>Wiring it into nginx</h3>
${slide('dv-12', 13, 'nginx HTTPS: cổng 80 chỉ còn đường ACME và chuyển hướng')}
<pre><code class="language-nginx">server {
    listen 80;
    server_name vidu.test www.vidu.test;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl http2;
    server_name vidu.test www.vidu.test;
    ssl_certificate     /etc/letsencrypt/live/vidu.test/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vidu.test/privkey.pem;
    add_header Strict-Transport-Security "max-age=300" always;
    location / { proxy_pass http://127.0.0.1:3000; }
}</code></pre>
<div class="out">$ curl -sI http://vidu.test/gio-hang
HTTP/1.1 301 Moved Permanently
Location: https://vidu.test/gio-hang
$ curl -sS https://vidu.test/
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.se/docs/sslcerts.html
$ curl -s --cacert /tmp/pebble-root.pem https://vidu.test/
xin chao tu app — ban dang o /
HTTP/2 200
strict-transport-security: max-age=300</div>
<p>Error 60 is the correct result: Pebble's root is not in any trust store, so a client that has not been given it refuses. Let's Encrypt's roots are shipped in operating systems and browsers — that is the whole difference between the lab and production. <code>max-age=300</code> for HSTS is deliberate while testing: once a browser has seen a long max-age it will refuse plain HTTP for that long, even if you later need it. How to choose the redirect, when HSTS takes effect and why a blanket redirect breaks renewal are all measured in the Nginx course, Lesson 6.5.</p>
<p>One line in the first version did not survive <code>nginx -t</code>: <code>http2 on;</code>. That directive exists from nginx 1.25.1; Ubuntu 24.04 ships 1.24.0, which answers <code>unknown directive "http2"</code> and keeps its previous configuration. On 1.24 the form is <code>listen 443 ssl http2;</code>. Copying config from a newer tutorial onto an older distribution package is a common source of "deploy succeeded, nothing changed".</p>

<h3>Renewed on disk, still old on the wire</h3>
${slide('dv-12', 14, 'Gia hạn xong: tệp mới trên đĩa, nginx vẫn đưa số seri cũ tới khi reload')}
<p>The measurement that justifies this lesson: force a renewal, then compare the certificate's serial number on disk with the one nginx actually presents to clients.</p>
<div class="out">$ sudo certbot renew --force-renewal --no-random-sleep-on-renew
Renewing an existing certificate for vidu.test and www.vidu.test
Congratulations, all renewals succeeded:
  /etc/letsencrypt/live/vidu.test/fullchain.pem (success)
real	0m3.163s
tren dia : serial=0DD8F6F83872E283
nginx dua: serial=20503F1A88252ED1
5 s sau  : serial=20503F1A88252ED1
sau reload: serial=0DD8F6F83872E283</div>
<p>nginx reads certificates when it loads its configuration. A new file does nothing until the next reload — and if nothing reloads nginx, it presents the old certificate until the day that certificate expires, while <code>certbot certificates</code> cheerfully reports "VALID: 89 days" about the file. The fix is a deploy hook: an executable in <code>/etc/letsencrypt/renewal-hooks/deploy/</code> runs only when a certificate was actually renewed.</p>
<pre><code class="language-bash">#!/bin/sh
# /etc/letsencrypt/renewal-hooks/deploy/nap-lai-nginx.sh
nginx -t -q &amp;&amp; nginx -s reload</code></pre>
<div class="out">truoc  : serial=0DD8F6F83872E283
$ sudo certbot renew --force-renewal --no-random-sleep-on-renew
Renewing an existing certificate for vidu.test and www.vidu.test
Hook 'deploy-hook' ran with error output:
 2026/09/29 07:33:53 [notice] 623#623: signal process started
Congratulations, all renewals succeeded:
  /etc/letsencrypt/live/vidu.test/fullchain.pem (success)
sau    : serial=618F45BE66DFA322</div>
<p>"ran with error output" is only nginx printing a <code>[notice]</code> to stderr; the reload worked, and the serial on the wire changed. <code>nginx -t -q</code> first means a broken config never gets loaded by a hook at 3 a.m. If nginx runs in a container, the hook runs <code>docker exec nginx nginx -s reload</code> instead — and the certificate directory must be mounted into that container, not copied into its image.</p>
<div class="pitfall co-tieu-de"><strong>Trap — "renewal is automatic" checked by reading files.</strong> <code>certbot certificates</code>, <code>ls -l live/</code> and the timer's success all describe the disk. Users see what nginx loaded, possibly weeks ago. The only check that means anything is the serial or expiry read from the wire with <code>openssl s_client</code> — and from a machine other than the server, so DNS, firewall and CDN are in the path. Chapter 9 turns that into an alert with <code>-checkend</code>.</div>

<h3>The timer, and two surprises when running it by hand</h3>
${slide('dv-12', 15, 'certbot.timer, tệp renewal, --dry-run đi staging, chờ ngẫu nhiên khi không có TTY')}
<pre><code class="language-ini"># /usr/lib/systemd/system/certbot.timer (Ubuntu 24.04 package)
[Timer]
OnCalendar=*-*-* 00,12:00:00
RandomizedDelaySec=43200
Persistent=true
# certbot.service
ExecStart=/usr/bin/certbot -q renew --no-random-sleep-on-renew</code></pre>
<p>Twice a day, shifted by up to 12 hours at random so millions of servers do not hit the CA at the same second, catching up after downtime (<code>Persistent=true</code>). The same package installs <code>/etc/cron.d/certbot</code>, which does nothing on systemd machines (<code>test ! -d /run/systemd/system</code>) — do not "fix" the duplicate. <code>certbot renew</code> only renews certificates within <code>renew_before_expiry</code> (30 days by default, stated at the top of each <code>renewal/*.conf</code>), so running it often is free:</p>
<div class="out">$ sudo certbot renew
Certificate not yet due for renewal
The following certificates are not due for renewal yet:
  /etc/letsencrypt/live/vidu.test/fullchain.pem expires on 2026-12-28 (skipped)
No renewals were attempted.</div>
<p>Two things surprised me when running it by hand. First, with no terminal attached (over <code>ssh host 'cmd'</code>, from a script), certbot sleeps before renewing:</p>
<div class="out">Non-interactive renewal: random delay of 356.31807819670894 seconds</div>
<p>Six minutes of apparent hanging. <code>--no-random-sleep-on-renew</code> removes it; the timer already randomises. Second, <code>--dry-run</code> ignored the <code>server</code> saved in the renewal file and went to Let's Encrypt's <strong>staging</strong> server instead of Pebble (it failed at TLS verification before sending any ACME request, because the lab trusts only Pebble's CA). On the lab, give <code>--server</code> explicitly:</p>
<div class="out">$ sudo certbot renew --dry-run --server https://pebble:14000/dir
Simulating renewal of an existing certificate for vidu.test and www.vidu.test
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/vidu.test/fullchain.pem (success)</div>
<p>Renewing "30 days before" is also becoming too simple a rule. Let's Encrypt recommends ACME Renewal Information (ARI, RFC 9773), where the CA tells the client when to renew; ARI renewals are exempt from all rate limits. Caddy already uses it — its stored certificate metadata in the lab contained a <code>renewal_info.suggestedWindow</code>.</p>

<h3>certbot or Caddy</h3>
${slide('dv-12', 16, 'certbot so với Caddy: Caddy tự xin, tự gia hạn, tự chuyển hướng')}
<pre><code>{
    acme_ca https://pebble:14000/dir
    acme_ca_root /etc/pebble-minica.pem
    email admin@vidu.test
}
caddy.test {
    reverse_proxy app.test:3000
}</code></pre>
<div class="out">07:34:21 trying to solve challenge tls-alpn-01
07:34:27 certificate obtained successfully caddy.test
$ curl -s --cacert /tmp/pebble-root.pem https://caddy.test/xin
xin chao tu app — ban dang o /xin
$ curl -sI http://caddy.test/abc
HTTP/1.1 308 Permanent Redirect
Location: https://caddy.test/abc</div>
<p>Caddy 2.11.4 saw a hostname in its config, obtained a certificate via TLS-ALPN-01 on port 443 in six seconds, and redirected port 80 — without a single separate command. (The two <code>acme_*</code> lines exist only because the lab uses Pebble.) It keeps renewing inside the same process and reloads nothing because it never stops serving.</p>
<table>
<tr><th>Choose</th><th>When</th></tr>
<tr><td>nginx + certbot</td><td>You already run nginx with non-trivial config (like cuongthai.com); you want certificates as plain files other tools can read.</td></tr>
<tr><td>Caddy</td><td>A new project, few routes, and you would rather not assemble timer + hook + redirect yourself.</td></tr>
<tr><td>Cloudflare origin certificate</td><td>The name is always proxied (orange). Free, long-lived, but trusted only by Cloudflare — useless the day you turn the proxy off.</td></tr>
</table>
<div class="callout warn"><strong>In a container, certificates must live in a volume.</strong> Caddy stores them under <code>/data/caddy</code>, certbot under <code>/etc/letsencrypt</code>. If that path is inside the container's writable layer, every recreate asks the CA for a new certificate and a new account — and five identical certificates in a week is a hard limit.</div>

<h3>Check the expiry from outside</h3>
${slide('dv-12', 17, 'Kiểm hạn trên dây bằng openssl s_client; hạn chứng chỉ Let’s Encrypt đang ngắn lại')}
<pre><code class="language-bash">echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -serial -ext subjectAltName
echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null \\
  | openssl x509 -noout -checkend $((30*86400)); echo exit=$?</code></pre>
<div class="out">subject=
issuer=CN = Pebble Intermediate CA 1bc889
notBefore=Sep 29 07:29:48 2026 GMT
notAfter=Dec 28 07:29:47 2026 GMT
serial=20503F1A88252ED1
X509v3 Subject Alternative Name: critical
    DNS:vidu.test, DNS:www.vidu.test
Certificate will not expire
exit=0
Certificate will expire
exit=1</div>
<table>
<tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>echo |</code></td><td>Gives <code>s_client</code> empty input so it disconnects after the handshake instead of waiting.</td></tr>
<tr><td><code>-servername</code></td><td>SNI — without it, a server with several certificates may send the default one.</td></tr>
<tr><td><code>-dates -serial</code></td><td>Validity window and the number that changes on every renewal.</td></tr>
<tr><td><code>-ext subjectAltName</code></td><td>The names the certificate covers — browsers use these, not the subject (which is empty here).</td></tr>
<tr><td><code>-checkend N</code></td><td>Exit 1 if the certificate expires within N seconds (the second run used 100 days, beyond this certificate's 90).</td></tr>
</table>
<p>Two facts make this check more important than it used to be. Let's Encrypt stopped sending expiry reminder emails on 4 June 2025 — nothing will warn you any more. And lifetimes are shrinking, on the schedule Let's Encrypt announced: the opt-in <code>tlsserver</code> profile moved to 45-day certificates on 13 May 2026; the default <code>classic</code> profile moves to 64 days on 10 February 2027 and to 45 days on 16 February 2028; six-day certificates are already available. Their announcement says it plainly: renewing at a hardcoded 60-day interval will no longer be enough. The cron-style "renew monthly" script you might copy from an old tutorial will fail on those dates.</p>

<h3>Let's Encrypt's limits (as of 09/2026)</h3>
${slide('dv-12', 18, 'Giới hạn của Let’s Encrypt: 5 chứng chỉ trùng/tuần, 5 lần sai/giờ')}
<table>
<tr><th>Limit</th><th>Value</th><th>You hit it when</th></tr>
<tr><td>New certificates per registered domain</td><td>50 per 7 days</td><td>each subdomain gets its own certificate</td></tr>
<tr><td>New certificates for the exact same set of names</td><td>5 per 7 days, no override</td><td>a deploy script or container start requests a certificate every run</td></tr>
<tr><td>Authorization failures per name per account</td><td>5 per hour</td><td>you retry while port 80 is still closed</td></tr>
<tr><td>New orders per account</td><td>300 per 3 hours</td><td>rarely, on one VPS</td></tr>
<tr><td>New accounts per IP</td><td>10 per 3 hours</td><td>a container that registers a new account on every start</td></tr>
<tr><td>Renewals using ARI</td><td>exempt from all limits</td><td>—</td></tr>
</table>
<p>Source: letsencrypt.org/docs/rate-limits, last updated 5 August 2026. These numbers change; read the page again before relying on them. The practical rules do not change: test against staging (<code>--test-cert</code>) or Pebble, persist the certificate directory, and never put "get a certificate" in a step that runs on every deploy.</p>

<h3>On Windows and macOS</h3>
<p>certbot runs on the server, so your laptop only needs <code>openssl</code> to check certificates: macOS ships LibreSSL as <code>/usr/bin/openssl</code> (the commands above work; <code>brew install openssl</code> gives OpenSSL 3); on Windows, Git Bash includes <code>openssl</code>, or use WSL. For HTTPS on <code>localhost</code> during development, <code>mkcert</code> creates a local CA and installs it in the system and browser trust stores — the same idea as the Pebble root in this lab, and equally never to be copied to a server.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the SWP391 app goes live next week behind nginx, and last semester another team's site showed "Your connection is not private" on defence day because the certificate expired while renewal "was automatic". Prove on the lab that yours cannot.</p>
<ol>
<li>Start Pebble (<code>httpPort: 80</code>, alias <code>pebble</code>) and the VPS container (aliases <code>vidu.test</code>, <code>www.vidu.test</code>). Serve <code>/.well-known/acme-challenge/</code> from <code>/var/www/html</code> on port 80.</li>
<li>Stop nginx and run <code>certbot certonly --webroot</code> once; read the <code>Type:</code> line. Start nginx and run it again.</li>
<li>Configure 443 with <code>live/…/fullchain.pem</code>. Record the serial from <code>openssl s_client</code>.</li>
<li><code>certbot renew --force-renewal --no-random-sleep-on-renew</code>; compare the serial on disk and on the wire. Add the deploy hook and repeat.</li>
</ol>
<p><strong>Done when:</strong> you have one run where the wire serial stayed old after renewal, one where the hook changed it, and <code>curl --cacert pebble-root.pem https://vidu.test/</code> returns 200.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TLS termination</span><span class="v">Decrypting HTTPS at the proxy and passing plain HTTP to the app behind it.</span></div>
  <div class="kv"><span class="k">ACME</span><span class="v">The protocol (RFC 8555) a client uses to prove control of a name and obtain a certificate.</span></div>
  <div class="kv"><span class="k">Challenge (HTTP-01 / DNS-01 / TLS-ALPN-01)</span><span class="v">The proof the CA asks for: a file on port 80, a TXT record, or a special certificate on 443.</span></div>
  <div class="kv"><span class="k">Webroot</span><span class="v">The directory whose <code>.well-known/acme-challenge/</code> the web server exposes for HTTP-01.</span></div>
  <div class="kv"><span class="k">Deploy hook</span><span class="v">A script certbot runs only after a certificate was actually renewed — the place to reload nginx.</span></div>
  <div class="kv"><span class="k">Serial number</span><span class="v">The number that changes on every issuance; compare disk and wire with it.</span></div>
  <div class="kv"><span class="k">ARI (ACME Renewal Information)</span><span class="v">The CA telling the client when to renew; exempt from rate limits.</span></div>
  <div class="kv"><span class="k">Pebble / staging</span><span class="v">Test CAs: Pebble runs locally, staging is Let's Encrypt's public test server.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Let nginx or Caddy terminate TLS on 80/443; the app listens on 127.0.0.1.</li>
<li>ACME proves control of the name now; HTTP-01 needs port 80, wildcards need DNS-01 and a carefully limited API key.</li>
<li>A renewed file does nothing until nginx reloads — measured: the old serial stayed on the wire until the reload; a deploy hook fixes it.</li>
<li>Check expiry and serial on the wire, from outside; nobody emails expiry warnings any more.</li>
<li>Certificate lifetimes drop to 64 days in 2027 and 45 in 2028 — do not hardcode renewal intervals.</li>
<li>Test on Pebble or staging, persist the certificate directory, and never request a certificate on every deploy.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let's Encrypt — Challenge types</span><span class="lc-sub">letsencrypt.org/docs/challenge-types — HTTP-01 only on port 80, wildcards only with DNS-01, and the warning about DNS API keys on the web server.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let's Encrypt — Rate limits</span><span class="lc-sub">letsencrypt.org/docs/rate-limits — the current numbers; read before trusting the table above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let's Encrypt — Decreasing certificate lifetimes to 45 days</span><span class="lc-sub">letsencrypt.org/2025/12/02/from-90-to-45 — the 2026–2028 schedule and the case for ARI.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">Pebble</span><span class="lc-sub">github.com/letsencrypt/pebble — the test ACME server used throughout this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Certbot user guide</span><span class="lc-sub">eff-certbot.readthedocs.io/en/stable/using.html — webroot, hooks, renewal configuration.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Caddy — Automatic HTTPS</span><span class="lc-sub">caddyserver.com/docs/automatic-https — what Caddy does on its own, and where it stores certificates.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — TLS, the certificate chain, redirects and HSTS</span><span class="lc-sub">/courses/nginx/learn${REF} — Chapter 6 measures the chain, the handshake and the redirect that silently breaks renewal.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Reverse proxy và HTTPS: chứng chỉ từ ACME, gia hạn mãi mãi</h2>
<p class="lead">Lấy chứng chỉ đầu tiên mất ba giây. Cú hỏng đắt tiền tới sau đó 60–90 ngày, vào một ngày không ai deploy gì: việc gia hạn đã chạy, chứng chỉ mới nằm trên đĩa, mà trang web vẫn đưa chứng chỉ cũ cho tới khi nó hết hạn ngay trước mặt người dùng. Bài này lấy chứng chỉ đúng theo cách Let's Encrypt cấp — qua ACME, với Pebble là máy chủ thử của chính Let's Encrypt — rồi dành phần lớn thời gian cho những gì xảy ra SAU đó: gia hạn, nạp lại, kiểm trên dây, và những giới hạn bạn đâm phải khi thử đi thử lại bừa bãi.</p>

<h3>Lịch sử ngắn: từ một món hàng tới một giao thức</h3>
<p>Tới giữa những năm 2010, chứng chỉ là thứ bạn MUA, cài bằng tay, và một hai năm sau gia hạn bằng tay — vì thế mà rất nhiều trang nhỏ cứ ở mãi HTTP thường. Let's Encrypt được công bố ngày 18/11/2014, cấp chứng chỉ đầu tiên ngày 14/09/2015, mở thử nghiệm công khai ngày 03/12/2015 và chính thức ngày 12/04/2016; nó vượt mốc một tỉ chứng chỉ ngày 27/02/2020. Thứ làm thay đổi cuộc chơi không phải giá miễn phí mà là GIAO THỨC: ACME (Automatic Certificate Management Environment — môi trường quản lý chứng chỉ tự động), chuẩn hoá thành RFC 8555 tháng 3/2019, cho một chương trình tự chứng minh quyền kiểm soát một cái tên và nhận chứng chỉ mà không cần con người. HSTS (RFC 6797, 2012) biến "luôn luôn HTTPS" thành thứ một trang có thể ĐÒI trình duyệt tuân theo. Hệ quả cho bạn: chứng chỉ sống ngắn và được phần mềm gia hạn — và phần mềm đó giờ là một mảnh của quy trình deploy, có thể hỏng.</p>

<h3>Vì sao app không tự nghe cổng 443</h3>
${slide('dv-12', 9, 'App không nghe thẳng 443: nginx đứng trước, giữ chứng chỉ và đường ACME')}
<p>App Express hay Next.js của bạn phục vụ HTTPS được. Trên một VPS thì gần như không bao giờ nên:</p>
<table>
<tr><th>Lý do</th><th>Không làm thế thì hỏng gì</th></tr>
<tr><td>Cổng dưới 1024 cần root (hoặc <code>CAP_NET_BIND_SERVICE</code>)</td><td>App chạy bằng root biến mọi lỗi thực thi mã từ xa thành mất cả máy.</td></tr>
<tr><td>Chứng chỉ đổi mỗi 60–90 ngày</td><td>Mỗi lần gia hạn phải khởi động lại app — hoặc tự viết logic nạp lại chứng chỉ trong app.</td></tr>
<tr><td>Một IP, nhiều app (web, API, admin)</td><td>Chỉ một tiến trình giữ được cổng 443; nginx chia theo <code>server_name</code>.</td></tr>
<tr><td>Cổng 80 vẫn phải có ích</td><td>Phải có ai trả lời thử thách ACME và chuyển hướng mọi thứ còn lại.</td></tr>
</table>
<p>Vậy nên nginx (hoặc Caddy) "kết thúc" TLS — giải mã nó — ở 80/443, rồi chuyển HTTP thường cho app ở <code>127.0.0.1:3000</code>, nơi không ai bên ngoài tới được (Bài 12.3 kiểm chuyện đó). Cú pháp <code>server</code>, <code>location</code>, <code>proxy_pass</code>, chuỗi chứng chỉ và chọn bộ mã nằm ở khoá Nginx (<code>/courses/nginx</code>) (Chương 3 và 6); bài này không lặp lại.</p>

<h3>ACME, từng bước</h3>
${slide('dv-12', 10, 'ACME HTTP-01: certbot, CA và nginx nói gì với nhau')}
<ol>
<li><strong>Tài khoản.</strong> Client (certbot, Caddy, acme.sh…) tạo một cặp khoá và đăng ký với CA. Mọi yêu cầu sau đó đều được ký bằng khoá này.</li>
<li><strong>Đơn hàng (order).</strong> "Tôi muốn chứng chỉ cho <code>vidu.test</code> và <code>www.vidu.test</code>." CA trả về mỗi tên một <em>authorization</em> (uỷ quyền cần chứng minh), mỗi cái kèm vài kiểu thử thách.</li>
<li><strong>Thử thách (challenge).</strong> Với HTTP-01, CA đưa một token; client đặt một tệp suy ra từ token vào chỗ máy web phục vụ ở <code>/.well-known/acme-challenge/&lt;token&gt;</code>.</li>
<li><strong>Xác minh.</strong> Client báo "sẵn sàng"; CA tự đi tải URL đó <em>từ Internet</em>, ở cổng 80, theo DNS công khai. Nội dung khớp thì cái tên được chứng minh.</li>
<li><strong>Hoàn tất.</strong> Client gửi CSR (khoá công khai nó muốn được chứng nhận); CA trả về chứng chỉ và chuỗi.</li>
</ol>
<p>Bước 4 hiện rõ trong log truy cập của nginx trên VPS thí nghiệm — máy xác minh của CA đã THẬT SỰ kết nối vào cổng 80:</p>
<div class="out">172.22.12.14 - - [29/Sep/2026:07:29:47 +0000] "GET /.well-known/acme-challenge/Vi3MQvo75T7EIqSU4S4SPBBKoDnaORYMM66ITYjygww HTTP/1.1" 200 87 "-" "LetsEncrypt-Pebble-VA (linux; arm64)"
172.22.12.14 - - [29/Sep/2026:07:29:47 +0000] "GET /.well-known/acme-challenge/wReOSHQWfZ4ohL-x16fxVEBPLtPsfpgjKQ2fe5YIEAE HTTP/1.1" 200 87 "-" "LetsEncrypt-Pebble-VA (linux; arm64)"</div>
<p>Thứ ACME chứng minh là <em>quyền kiểm soát cái tên NGAY LÚC NÀY</em> — không phải bạn là ai. Vì vậy tài khoản registrar ở Bài 12.1 mới đáng giữ kỹ: ai trỏ được tên bạn đi chỗ khác thì xin được chứng chỉ hợp lệ cho nó.</p>

<h3>Một CA cho phòng thí nghiệm: Pebble</h3>
<p>Tập với Let's Encrypt thật là ý tồi: vài phút là chạm giới hạn (cuối bài), mà tên trong phòng thí nghiệm cũng đâu có công khai. Pebble là máy chủ ACME nhỏ của chính Let's Encrypt dành cho kiểm thử — README của nó viết hoa rằng nó KHÔNG dành cho production. Nó nghe ở 14000 (ACME) và 15000 (quản trị, nơi công bố chứng chỉ gốc của nó), và mặc định xác minh HTTP-01 ở cổng 5002; cấu hình phòng thí nghiệm đặt <code>httpPort</code> = 80 để nó cư xử như CA thật.</p>
<pre><code class="language-bash">docker network create dv12-net
docker run -d --name dv12-pebble --network dv12-net --network-alias pebble \\
  -e PEBBLE_VA_NOSLEEP=1 \\
  -v $PWD/pebble-config.json:/test/config/pebble-config.json:ro \\
  ghcr.io/letsencrypt/pebble:latest -config /test/config/pebble-config.json
# container VPS trả lời dưới tên vidu.test và www.vidu.test trên cùng mạng
docker run -d --name dv12-vps --network dv12-net \\
  --network-alias vidu.test --network-alias www.vidu.test \\
  -p 127.0.0.1:19122:22 dv12-img</code></pre>
<p>Lần thử đầu hỏng trước cả khi ACME bắt đầu, và lỗi đáng đọc:</p>
<div class="out">requests.exceptions.SSLError: HTTPSConnectionPool(host='dv12-pebble', port=14000): Max retries exceeded with url: /dir (Caused by SSLError(SSLCertVerificationError(1, "[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'dv12-pebble'. (_ssl.c:1000)")))</div>
<p>Chứng chỉ HTTPS riêng của Pebble hợp lệ cho <code>pebble</code> và <code>localhost</code>, không cho tên container. Thêm bí danh mạng <code>pebble</code> rồi trỏ certbot vào <code>https://pebble:14000/dir</code> là xong, cùng với <code>REQUESTS_CA_BUNDLE=/usr/local/share/pebble-minica.pem</code> để thư viện HTTP Python của certbot tin chứng chỉ API của Pebble. Với Let's Encrypt thật thì không có dòng nào trong hai dòng này.</p>

<h3>Xin chứng chỉ, đo thật</h3>
${slide('dv-12', 11, 'certbot certonly --webroot: lỗi khi cổng 80 tắt, thành công khi nginx chạy')}
<pre><code class="language-bash">sudo certbot certonly --webroot -w /var/www/html \\
  -d vidu.test -d www.vidu.test \\
  --server https://pebble:14000/dir \\
  --agree-tos -m admin@vidu.test --no-eff-email -n</code></pre>
<table>
<tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>certonly</code></td><td>Chỉ lấy chứng chỉ, không sửa cấu hình máy web nào. (Không có nó, plugin <code>--nginx</code> tự viết lại cấu hình của bạn — tiện một lần, khó hiểu về sau.)</td></tr>
<tr><td><code>--webroot -w THU_MUC</code></td><td>Đặt tệp thử thách dưới <code>THU_MUC/.well-known/acme-challenge/</code>; nginx phải phục vụ đường đó ở cổng 80.</td></tr>
<tr><td><code>-d TEN</code></td><td>Mỗi tên một cờ. Mọi tên vào CHUNG một chứng chỉ.</td></tr>
<tr><td><code>--server URL</code></td><td>Thư mục ACME. Bỏ đi thì là Let's Encrypt; <code>--test-cert</code> chọn máy staging của họ.</td></tr>
<tr><td><code>--agree-tos -m EMAIL --no-eff-email</code></td><td>Đồng ý điều khoản, cho địa chỉ liên hệ, bỏ câu hỏi nhận bản tin.</td></tr>
<tr><td><code>-n</code></td><td>Không tương tác: không bao giờ hỏi; thà hỏng. Bắt buộc trong script.</td></tr>
<tr><td><code>--cert-name TEN</code></td><td>Tên thư mục dưới <code>live/</code> (mặc định là <code>-d</code> đầu tiên).</td></tr>
</table>
<p>Lần đầu với nginx đang TẮT, lần sau với nginx chạy:</p>
<div class="out">Account registered.
Requesting a certificate for vidu.test

Certbot failed to authenticate some domains (authenticator: webroot). The Certificate Authority reported these problems:
  Domain: vidu.test
  Type:   connection
  Detail: Get "http://vidu.test:80/.well-known/acme-challenge/Upv7lzZC_UxFwkRoyffMX9ZcsNm5JASR-6zsfXKP8l0": dial tcp 172.22.0.3:80: connect: connection refused
…
real	0m2.353s</div>
<div class="out">Requesting a certificate for vidu.test and www.vidu.test

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/vidu.test/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/vidu.test/privkey.pem
This certificate expires on 2026-12-28.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.
…
real	0m3.690s</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Type: connection</code></span><span class="v">CA không mở được cổng 80 ở địa chỉ DNS đưa cho nó. Nguyên nhân, xếp theo mức hay gặp: không ai nghe (nginx tắt), tường lửa, DNS còn trỏ sang máy khác (12.1), bản ghi AAAA IPv6 trỏ vào chỗ chết.</span></div>
  <div class="kv"><span class="k"><code>Type: unauthorized</code> (không gặp ở đây)</span><span class="v">CA tới được máy web nhưng nhận SAI nội dung — thường do một cú chuyển hướng hoặc một <code>location</code> nuốt mất <code>/.well-known/</code>.</span></div>
  <div class="kv"><span class="k">Các tệp</span><span class="v"><code>live/vidu.test/</code> chứa bốn symlink trỏ sang <code>archive/vidu.test/</code> (<code>cert1.pem</code>, <code>chain1.pem</code>, <code>fullchain1.pem</code>, <code>privkey1.pem</code>). Mỗi lần gia hạn thêm <code>…2.pem</code>, <code>…3.pem</code> và dời các liên kết. Trỏ nginx vào <code>live/</code>, đừng bao giờ vào <code>archive/</code>.</span></div>
</div>

<h3>HTTP-01 hay DNS-01</h3>
${slide('dv-12', 12, 'HTTP-01 hay DNS-01: wildcard chỉ đi được DNS-01, hai TXT cùng tên')}
<table>
<tr><th></th><th>HTTP-01</th><th>DNS-01</th><th>TLS-ALPN-01</th></tr>
<tr><td>CA kiểm</td><td>một tệp ở <code>http://ten/.well-known/acme-challenge/…</code>, CHỈ cổng 80 (chuyển hướng chỉ được sang 80/443)</td><td>bản ghi TXT ở <code>_acme-challenge.ten</code></td><td>một chứng chỉ đặc biệt đưa ra ở cổng 443</td></tr>
<tr><td>Wildcard <code>*.ten</code></td><td>không</td><td>có — cách DUY NHẤT</td><td>không</td></tr>
<tr><td>Máy không tới được từ Internet</td><td>không</td><td>được</td><td>không</td></tr>
<tr><td>Cần gì trên máy</td><td>mở cổng 80, một webroot</td><td>khoá API của nhà DNS</td><td>cổng 443, client biết nói kiểu này (Caddy)</td></tr>
</table>
<p>Đo trên phòng thí nghiệm, với Pebble được bảo dùng bind9 của phòng thí nghiệm (<code>-dnsserver 172.22.12.53:53</code>) và hook thủ công của certbot ghi bản ghi TXT bằng <code>nsupdate</code>:</p>
<div class="out">$ sudo certbot certonly --webroot -w /var/www/html -d "*.vidu.test" …
Account registered.
Requesting a certificate for *.vidu.test
Client with the currently selected authenticator does not support any combination of challenges that will satisfy the CA.
$ sudo certbot certonly --manual --preferred-challenges dns --manual-auth-hook /usr/local/bin/dns-hook.sh --manual-cleanup-hook /usr/local/bin/dns-don.sh -d vidu.test -d "*.vidu.test" --cert-name wildcard …
Requesting a certificate for vidu.test and *.vidu.test
Successfully received certificate.
…
real	0m2.526s
$ sudo openssl x509 -in /etc/letsencrypt/live/wildcard/cert.pem -noout -ext subjectAltName
X509v3 Subject Alternative Name: critical
    DNS:vidu.test, DNS:*.vidu.test</div>
<pre><code class="language-bash">#!/bin/bash
# dns-hook.sh — certbot đặt sẵn CERTBOT_DOMAIN và CERTBOT_VALIDATION
set -euo pipefail
nsupdate &lt;&lt;NS
server 172.22.12.53
update add _acme-challenge.\${CERTBOT_DOMAIN}. 60 IN TXT "\${CERTBOT_VALIDATION}"
send
NS</code></pre>
<div class="out">updating zone 'vidu.test/IN': adding an RR at '_acme-challenge.vidu.test' TXT "FKXxKmv67KdGWS0xq4UoDI2gHuRoEi2B1Et82cWRwvM"
updating zone 'vidu.test/IN': adding an RR at '_acme-challenge.vidu.test' TXT "CWq2V80R6PSEHVX5kt8e-H6W8Qzz6l3nIXywF1PceaY"
updating zone 'vidu.test/IN': deleting an RR at _acme-challenge.vidu.test TXT
updating zone 'vidu.test/IN': deleting an RR at _acme-challenge.vidu.test TXT</div>
<p>Log của bind cho thấy chi tiết làm hỏng những hook tự viết: <code>vidu.test</code> và <code>*.vidu.test</code> cùng xác minh ở <strong>CÙNG MỘT tên</strong>, <code>_acme-challenge.vidu.test</code>, cùng lúc. Hook nào <em>thay thế</em> bản ghi TXT thay vì <em>thêm</em> một bản sẽ làm lần xác minh đầu hỏng. Với nhà DNS thật, hook gọi API của nhà cung cấp (certbot có plugin như <code>certbot-dns-cloudflare</code>), và bản ghi TXT có thể cần một lúc mới tới đủ mọi máy của nhà cung cấp — hook thường chờ một chút rồi mới báo "sẵn sàng".</p>
<div class="callout warn"><strong>Một khoá API nằm trên máy web là cái giá của DNS-01.</strong> Chính tài liệu của Let's Encrypt cảnh báo: để nguyên khoá API DNS đầy đủ quyền trên máy web làm thiệt hại lớn hơn nhiều nếu máy bị chiếm — ai đọc được khoá đó thì trỏ được CẢ tên miền đi nơi khác. Dùng token chỉ được sửa DNS của đúng một vùng, hoặc chỉ uỷ quyền riêng <code>_acme-challenge</code> bằng một CNAME sang một vùng sinh ra chỉ để làm việc đó.</div>

<h3>Nối vào nginx</h3>
${slide('dv-12', 13, 'nginx HTTPS: cổng 80 chỉ còn đường ACME và chuyển hướng')}
<pre><code class="language-nginx">server {
    listen 80;
    server_name vidu.test www.vidu.test;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl http2;
    server_name vidu.test www.vidu.test;
    ssl_certificate     /etc/letsencrypt/live/vidu.test/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vidu.test/privkey.pem;
    add_header Strict-Transport-Security "max-age=300" always;
    location / { proxy_pass http://127.0.0.1:3000; }
}</code></pre>
<div class="out">$ curl -sI http://vidu.test/gio-hang
HTTP/1.1 301 Moved Permanently
Location: https://vidu.test/gio-hang
$ curl -sS https://vidu.test/
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.se/docs/sslcerts.html
$ curl -s --cacert /tmp/pebble-root.pem https://vidu.test/
xin chao tu app — ban dang o /
HTTP/2 200
strict-transport-security: max-age=300</div>
<p>Lỗi 60 là kết quả ĐÚNG: gốc của Pebble không nằm trong kho tin cậy nào, nên client chưa được đưa nó sẽ từ chối. Gốc của Let's Encrypt thì có sẵn trong hệ điều hành và trình duyệt — đó là toàn bộ khác biệt giữa phòng thí nghiệm và production. <code>max-age=300</code> cho HSTS là CỐ Ý khi đang thử: một khi trình duyệt đã thấy max-age dài, nó sẽ từ chối HTTP thường suốt ngần ấy thời gian, kể cả khi sau này bạn cần. Chọn kiểu chuyển hướng thế nào, HSTS có hiệu lực từ lúc nào, và vì sao một cú chuyển hướng phủ hết cổng 80 phá việc gia hạn — tất cả được đo ở khoá Nginx, Bài 6.5.</p>
<p>Một dòng trong bản đầu không qua được <code>nginx -t</code>: <code>http2 on;</code>. Chỉ thị đó có từ nginx 1.25.1; Ubuntu 24.04 đi kèm 1.24.0, nên nó báo <code>unknown directive "http2"</code> và giữ nguyên cấu hình cũ. Trên 1.24 phải viết <code>listen 443 ssl http2;</code>. Chép cấu hình từ một bài hướng dẫn mới sang gói của một bản phân phối cũ là nguồn quen thuộc của "deploy thành công mà chẳng có gì đổi".</p>

<h3>Đĩa đã mới, trên dây vẫn cũ</h3>
${slide('dv-12', 14, 'Gia hạn xong: tệp mới trên đĩa, nginx vẫn đưa số seri cũ tới khi reload')}
<p>Phép đo làm nên lý do tồn tại của bài này: ép gia hạn, rồi so số seri của chứng chỉ trên đĩa với số seri mà nginx THẬT SỰ đưa cho client.</p>
<div class="out">$ sudo certbot renew --force-renewal --no-random-sleep-on-renew
Renewing an existing certificate for vidu.test and www.vidu.test
Congratulations, all renewals succeeded:
  /etc/letsencrypt/live/vidu.test/fullchain.pem (success)
real	0m3.163s
tren dia : serial=0DD8F6F83872E283
nginx dua: serial=20503F1A88252ED1
5 s sau  : serial=20503F1A88252ED1
sau reload: serial=0DD8F6F83872E283</div>
<p>nginx đọc chứng chỉ LÚC NẠP cấu hình. Tệp mới chẳng làm gì cho tới lần nạp lại kế tiếp — và nếu không có gì nạp lại nginx, nó cứ đưa chứng chỉ cũ tới đúng ngày chứng chỉ đó hết hạn, trong lúc <code>certbot certificates</code> vui vẻ báo "VALID: 89 days" về cái TỆP. Cách sửa là deploy hook: một tệp chạy được đặt trong <code>/etc/letsencrypt/renewal-hooks/deploy/</code>, chỉ chạy khi một chứng chỉ THẬT SỰ được cấp mới.</p>
<pre><code class="language-bash">#!/bin/sh
# /etc/letsencrypt/renewal-hooks/deploy/nap-lai-nginx.sh
nginx -t -q &amp;&amp; nginx -s reload</code></pre>
<div class="out">truoc  : serial=0DD8F6F83872E283
$ sudo certbot renew --force-renewal --no-random-sleep-on-renew
Renewing an existing certificate for vidu.test and www.vidu.test
Hook 'deploy-hook' ran with error output:
 2026/09/29 07:33:53 [notice] 623#623: signal process started
Congratulations, all renewals succeeded:
  /etc/letsencrypt/live/vidu.test/fullchain.pem (success)
sau    : serial=618F45BE66DFA322</div>
<p>"ran with error output" chỉ là nginx in một dòng <code>[notice]</code> ra stderr; reload đã chạy, và số seri trên dây đã đổi. <code>nginx -t -q</code> đứng trước để một cấu hình hỏng không bao giờ bị hook nạp vào lúc 3 giờ sáng. Nếu nginx chạy trong container, hook gọi <code>docker exec nginx nginx -s reload</code> — và thư mục chứng chỉ phải được mount vào container đó, không chép vào ảnh của nó.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy — kiểm "gia hạn tự động" bằng cách đọc tệp.</strong> <code>certbot certificates</code>, <code>ls -l live/</code> và việc bộ hẹn giờ chạy thành công đều mô tả cái ĐĨA. Người dùng thấy thứ nginx đã nạp, có khi từ nhiều tuần trước. Phép kiểm duy nhất có nghĩa là số seri hoặc ngày hết hạn đọc TRÊN DÂY bằng <code>openssl s_client</code> — và từ một máy KHÁC máy chủ, để DNS, tường lửa và CDN đều nằm trên đường đi. Chương 9 biến nó thành cảnh báo bằng <code>-checkend</code>.</div>

<h3>Bộ hẹn giờ, và hai bất ngờ khi chạy bằng tay</h3>
${slide('dv-12', 15, 'certbot.timer, tệp renewal, --dry-run đi staging, chờ ngẫu nhiên khi không có TTY')}
<pre><code class="language-ini"># /usr/lib/systemd/system/certbot.timer (gói của Ubuntu 24.04)
[Timer]
OnCalendar=*-*-* 00,12:00:00
RandomizedDelaySec=43200
Persistent=true
# certbot.service
ExecStart=/usr/bin/certbot -q renew --no-random-sleep-on-renew</code></pre>
<p>Hai lần mỗi ngày, lệch ngẫu nhiên tới 12 giờ để hàng triệu máy không dồn vào CA cùng một giây, và chạy bù nếu máy tắt lỡ giờ (<code>Persistent=true</code>). Cùng gói đó cài thêm <code>/etc/cron.d/certbot</code>, thứ không làm gì trên máy có systemd (<code>test ! -d /run/systemd/system</code>) — đừng "sửa" cái trùng lặp này. <code>certbot renew</code> chỉ gia hạn chứng chỉ còn dưới <code>renew_before_expiry</code> (mặc định 30 ngày, ghi ở đầu mỗi tệp <code>renewal/*.conf</code>), nên chạy nó thường xuyên là miễn phí:</p>
<div class="out">$ sudo certbot renew
Certificate not yet due for renewal
The following certificates are not due for renewal yet:
  /etc/letsencrypt/live/vidu.test/fullchain.pem expires on 2026-12-28 (skipped)
No renewals were attempted.</div>
<p>Hai thứ làm tôi bất ngờ khi chạy bằng tay. Thứ nhất, khi không có terminal (qua <code>ssh may 'lenh'</code>, từ một script), certbot NGỦ trước khi gia hạn:</p>
<div class="out">Non-interactive renewal: random delay of 356.31807819670894 seconds</div>
<p>Sáu phút trông như treo. <code>--no-random-sleep-on-renew</code> bỏ nó đi; bộ hẹn giờ vốn đã lệch ngẫu nhiên rồi. Thứ hai, <code>--dry-run</code> PHỚT LỜ <code>server</code> đã lưu trong tệp renewal và đi thẳng sang máy <strong>staging</strong> của Let's Encrypt thay vì Pebble (nó hỏng ở bước kiểm TLS trước khi gửi yêu cầu ACME nào, vì phòng thí nghiệm chỉ tin CA của Pebble). Trên phòng thí nghiệm, ghi rõ <code>--server</code>:</p>
<div class="out">$ sudo certbot renew --dry-run --server https://pebble:14000/dir
Simulating renewal of an existing certificate for vidu.test and www.vidu.test
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/vidu.test/fullchain.pem (success)</div>
<p>Gia hạn "trước 30 ngày" cũng đang thành một luật quá đơn giản. Let's Encrypt khuyên dùng ACME Renewal Information (ARI, RFC 9773 — thông tin gia hạn ACME), tức là CA nói cho client biết khi nào nên gia hạn; gia hạn qua ARI được miễn MỌI giới hạn. Caddy đã dùng nó — siêu dữ liệu chứng chỉ Caddy lưu trong phòng thí nghiệm có một mục <code>renewal_info.suggestedWindow</code>.</p>

<h3>certbot hay Caddy</h3>
${slide('dv-12', 16, 'certbot so với Caddy: Caddy tự xin, tự gia hạn, tự chuyển hướng')}
<pre><code>{
    acme_ca https://pebble:14000/dir
    acme_ca_root /etc/pebble-minica.pem
    email admin@vidu.test
}
caddy.test {
    reverse_proxy app.test:3000
}</code></pre>
<div class="out">07:34:21 trying to solve challenge tls-alpn-01
07:34:27 certificate obtained successfully caddy.test
$ curl -s --cacert /tmp/pebble-root.pem https://caddy.test/xin
xin chao tu app — ban dang o /xin
$ curl -sI http://caddy.test/abc
HTTP/1.1 308 Permanent Redirect
Location: https://caddy.test/abc</div>
<p>Caddy 2.11.4 thấy một tên máy trong cấu hình, lấy chứng chỉ bằng TLS-ALPN-01 ở cổng 443 trong sáu giây, và chuyển hướng cổng 80 — không một lệnh riêng nào. (Hai dòng <code>acme_*</code> chỉ có vì phòng thí nghiệm dùng Pebble.) Nó tiếp tục gia hạn ngay trong cùng tiến trình và chẳng cần nạp lại gì vì nó không bao giờ ngừng phục vụ.</p>
<table>
<tr><th>Chọn</th><th>Khi</th></tr>
<tr><td>nginx + certbot</td><td>Bạn đã chạy nginx với cấu hình không đơn giản (như cuongthai.com); bạn muốn chứng chỉ là tệp thường mà công cụ khác đọc được.</td></tr>
<tr><td>Caddy</td><td>Dự án mới, ít tuyến, và bạn không muốn tự ráp bộ hẹn giờ + hook + chuyển hướng.</td></tr>
<tr><td>Chứng chỉ gốc của Cloudflare (origin certificate)</td><td>Tên LUÔN bật cam. Miễn phí, sống lâu, nhưng chỉ Cloudflare tin — vô dụng vào đúng ngày bạn tắt proxy.</td></tr>
</table>
<div class="callout warn"><strong>Trong container, chứng chỉ phải sống trong một volume.</strong> Caddy giữ chúng ở <code>/data/caddy</code>, certbot ở <code>/etc/letsencrypt</code>. Nếu đường đó nằm trong lớp ghi được của container, mỗi lần tạo lại container là một lần xin CA chứng chỉ mới và tài khoản mới — mà năm chứng chỉ giống hệt nhau trong một tuần là giới hạn cứng.</div>

<h3>Kiểm hạn từ bên ngoài</h3>
${slide('dv-12', 17, 'Kiểm hạn trên dây bằng openssl s_client; hạn chứng chỉ Let’s Encrypt đang ngắn lại')}
<pre><code class="language-bash">echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null \\
  | openssl x509 -noout -subject -issuer -dates -serial -ext subjectAltName
echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null \\
  | openssl x509 -noout -checkend $((30*86400)); echo exit=$?</code></pre>
<div class="out">subject=
issuer=CN = Pebble Intermediate CA 1bc889
notBefore=Sep 29 07:29:48 2026 GMT
notAfter=Dec 28 07:29:47 2026 GMT
serial=20503F1A88252ED1
X509v3 Subject Alternative Name: critical
    DNS:vidu.test, DNS:www.vidu.test
Certificate will not expire
exit=0
Certificate will expire
exit=1</div>
<table>
<tr><th>Mảnh</th><th>Nghĩa</th></tr>
<tr><td><code>echo |</code></td><td>Cho <code>s_client</code> đầu vào rỗng để nó ngắt sau khi bắt tay thay vì ngồi chờ.</td></tr>
<tr><td><code>-servername</code></td><td>SNI — thiếu nó, máy có nhiều chứng chỉ có thể đưa cái mặc định.</td></tr>
<tr><td><code>-dates -serial</code></td><td>Khoảng thời gian hợp lệ, và con số đổi sau mỗi lần gia hạn.</td></tr>
<tr><td><code>-ext subjectAltName</code></td><td>Những tên chứng chỉ bảo vệ — trình duyệt dùng cái này, không dùng subject (ở đây còn rỗng).</td></tr>
<tr><td><code>-checkend N</code></td><td>Thoát 1 nếu chứng chỉ hết hạn trong N giây tới (lần chạy thứ hai dùng 100 ngày, quá 90 ngày của chứng chỉ này).</td></tr>
</table>
<p>Hai sự thật làm phép kiểm này quan trọng hơn trước. Let's Encrypt THÔI gửi email nhắc hết hạn từ ngày 04/06/2025 — sẽ không còn ai báo cho bạn nữa. Và hạn chứng chỉ đang ngắn lại, theo lịch Let's Encrypt đã công bố: hồ sơ <code>tlsserver</code> (phải tự chọn) chuyển sang chứng chỉ 45 ngày từ 13/05/2026; hồ sơ mặc định <code>classic</code> xuống 64 ngày vào 10/02/2027 và 45 ngày vào 16/02/2028; chứng chỉ sáu ngày đã có sẵn. Thông báo của họ nói thẳng: gia hạn theo một khoảng cứng 60 ngày sẽ KHÔNG còn đủ. Cái script cron "mỗi tháng gia hạn một lần" chép từ một bài hướng dẫn cũ sẽ hỏng đúng vào những ngày đó.</p>

<h3>Giới hạn của Let's Encrypt (tính đến 09/2026)</h3>
${slide('dv-12', 18, 'Giới hạn của Let’s Encrypt: 5 chứng chỉ trùng/tuần, 5 lần sai/giờ')}
<table>
<tr><th>Giới hạn</th><th>Mức</th><th>Bạn chạm khi</th></tr>
<tr><td>Chứng chỉ mới cho mỗi tên miền đăng ký</td><td>50 / 7 ngày</td><td>mỗi tên miền con một chứng chỉ riêng</td></tr>
<tr><td>Chứng chỉ mới cho ĐÚNG cùng một bộ tên</td><td>5 / 7 ngày, không xin nới được</td><td>script deploy hay container xin chứng chỉ MỖI LẦN chạy</td></tr>
<tr><td>Xác minh hỏng / tên / tài khoản</td><td>5 / giờ</td><td>thử đi thử lại trong khi cổng 80 vẫn đóng</td></tr>
<tr><td>Đơn hàng mới / tài khoản</td><td>300 / 3 giờ</td><td>hiếm, với một VPS</td></tr>
<tr><td>Tài khoản mới / IP</td><td>10 / 3 giờ</td><td>container đăng ký tài khoản mới mỗi lần khởi động</td></tr>
<tr><td>Gia hạn qua ARI</td><td>miễn mọi giới hạn</td><td>—</td></tr>
</table>
<p>Nguồn: letsencrypt.org/docs/rate-limits, cập nhật 05/08/2026. Các con số này có đổi; đọc lại trang đó trước khi tin. Còn luật thực hành thì không đổi: thử trên staging (<code>--test-cert</code>) hoặc Pebble, giữ thư mục chứng chỉ bền qua các lần tạo lại, và đừng bao giờ đặt "xin chứng chỉ" vào một bước chạy mỗi lần deploy.</p>

<h3>Trên Windows và macOS</h3>
<p>certbot chạy trên máy chủ, nên laptop của bạn chỉ cần <code>openssl</code> để kiểm chứng chỉ: macOS có sẵn LibreSSL ở <code>/usr/bin/openssl</code> (các lệnh ở trên chạy được; <code>brew install openssl</code> cho OpenSSL 3); trên Windows, Git Bash có kèm <code>openssl</code>, hoặc dùng WSL. Muốn HTTPS trên <code>localhost</code> lúc phát triển thì <code>mkcert</code> tạo một CA cục bộ và cài nó vào kho tin cậy của hệ thống và trình duyệt — cùng ý tưởng với gốc Pebble trong phòng thí nghiệm này, và cũng tuyệt đối không bao giờ chép lên máy chủ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tuần sau app SWP391 chạy thật sau nginx, và kỳ trước một nhóm khác bị trang "Kết nối của bạn không riêng tư" đúng hôm bảo vệ vì chứng chỉ hết hạn trong khi việc gia hạn "là tự động". Chứng minh trên phòng thí nghiệm rằng của bạn không thể bị như thế.</p>
<ol>
<li>Chạy Pebble (<code>httpPort: 80</code>, bí danh <code>pebble</code>) và container VPS (bí danh <code>vidu.test</code>, <code>www.vidu.test</code>). Phục vụ <code>/.well-known/acme-challenge/</code> từ <code>/var/www/html</code> ở cổng 80.</li>
<li>Tắt nginx và chạy <code>certbot certonly --webroot</code> một lần; đọc dòng <code>Type:</code>. Bật nginx và chạy lại.</li>
<li>Cấu hình cổng 443 với <code>live/…/fullchain.pem</code>. Ghi số seri đọc bằng <code>openssl s_client</code>.</li>
<li><code>certbot renew --force-renewal --no-random-sleep-on-renew</code>; so số seri trên đĩa và trên dây. Thêm deploy hook rồi làm lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một lần chạy mà số seri trên dây vẫn CŨ sau khi gia hạn, một lần hook làm nó đổi, và <code>curl --cacert pebble-root.pem https://vidu.test/</code> trả 200.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TLS termination (kết thúc TLS)</span><span class="v">Giải mã HTTPS ở proxy rồi chuyển HTTP thường cho app đứng sau.</span></div>
  <div class="kv"><span class="k">ACME (giao thức cấp chứng chỉ tự động)</span><span class="v">Giao thức (RFC 8555) client dùng để chứng minh quyền kiểm soát một tên và nhận chứng chỉ.</span></div>
  <div class="kv"><span class="k">Challenge (thử thách: HTTP-01 / DNS-01 / TLS-ALPN-01)</span><span class="v">Bằng chứng CA đòi: một tệp ở cổng 80, một bản ghi TXT, hay một chứng chỉ đặc biệt ở 443.</span></div>
  <div class="kv"><span class="k">Webroot (thư mục gốc web)</span><span class="v">Thư mục mà máy web phơi phần <code>.well-known/acme-challenge/</code> cho HTTP-01.</span></div>
  <div class="kv"><span class="k">Deploy hook (móc sau khi cấp)</span><span class="v">Script certbot chỉ chạy khi một chứng chỉ thật sự được cấp mới — chỗ để nạp lại nginx.</span></div>
  <div class="kv"><span class="k">Serial number (số seri)</span><span class="v">Con số đổi sau mỗi lần cấp; dùng nó để so đĩa với dây.</span></div>
  <div class="kv"><span class="k">ARI (thông tin gia hạn ACME)</span><span class="v">CA bảo client khi nào nên gia hạn; được miễn giới hạn tần suất.</span></div>
  <div class="kv"><span class="k">Pebble / staging (CA thử)</span><span class="v">CA để thử: Pebble chạy tại chỗ, staging là máy thử công khai của Let's Encrypt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Để nginx hoặc Caddy kết thúc TLS ở 80/443; app chỉ nghe 127.0.0.1.</li>
<li>ACME chứng minh quyền kiểm soát cái tên lúc này; HTTP-01 cần cổng 80, wildcard cần DNS-01 và một khoá API bị giới hạn cẩn thận.</li>
<li>Tệp đã gia hạn chẳng làm gì tới khi nginx nạp lại — đo được: số seri cũ nằm trên dây tới lúc reload; deploy hook sửa chuyện đó.</li>
<li>Kiểm hạn và số seri trên dây, từ bên ngoài; không còn ai gửi email nhắc hết hạn nữa.</li>
<li>Hạn chứng chỉ xuống 64 ngày năm 2027 và 45 ngày năm 2028 — đừng viết cứng chu kỳ gia hạn.</li>
<li>Thử trên Pebble hoặc staging, giữ thư mục chứng chỉ bền, và đừng bao giờ xin chứng chỉ mỗi lần deploy.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let's Encrypt — Các kiểu thử thách</span><span class="lc-sub">letsencrypt.org/docs/challenge-types — HTTP-01 chỉ ở cổng 80, wildcard chỉ bằng DNS-01, và lời cảnh báo về khoá API DNS trên máy web.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let's Encrypt — Giới hạn tần suất</span><span class="lc-sub">letsencrypt.org/docs/rate-limits — số liệu hiện hành; đọc trước khi tin bảng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Let's Encrypt — Rút hạn chứng chỉ xuống 45 ngày</span><span class="lc-sub">letsencrypt.org/2025/12/02/from-90-to-45 — lịch 2026–2028 và lý do nên dùng ARI.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">Pebble</span><span class="lc-sub">github.com/letsencrypt/pebble — máy chủ ACME thử dùng suốt bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Hướng dẫn dùng Certbot</span><span class="lc-sub">eff-certbot.readthedocs.io/en/stable/using.html — webroot, hook, cấu hình gia hạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Caddy — HTTPS tự động</span><span class="lc-sub">caddyserver.com/docs/automatic-https — Caddy tự làm gì, và giữ chứng chỉ ở đâu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — TLS, chuỗi chứng chỉ, chuyển hướng và HSTS</span><span class="lc-sub">/courses/nginx/learn${REF} — Chương 6 đo chuỗi, cái bắt tay, và cú chuyển hướng lặng lẽ phá việc gia hạn.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: "12.3 — Open only the right ports: ss, ufw, and how Docker walks around your firewall|||12.3 — Chỉ mở đúng cổng: ss, ufw, và cách Docker đi vòng qua tường lửa của bạn",
      slug: "deploy-12-3-cong-mo-ra-internet",
      type: "LESSON",
      isFreePreview: true,
      description: "Đọc ss -tlnp, bật ufw đúng cách, dựng lại chuyện ports: \"5432:5432\" làm Postgres lộ ra ngoài dù ufw đang chặn, vì sao gói tin đi FORWARD chứ không đi INPUT, ba cách đóng đo cả ba, và tự quét máy mình bằng nmap.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Open only the right ports: ss, ufw, and how Docker walks around your firewall</h2>
<p class="lead">A SWP391 team adds <code>ports: "5432:5432"</code> to its compose file so everyone can open the database in DBeaver from their laptops. The VPS has ufw enabled with only 22, 80 and 443 allowed, so the team considers the database private. It is not. This lesson rebuilds exactly that machine in the lab, logs into its Postgres from another host with the team's weak password, explains the packet path that makes it possible, and measures three ways to close it.</p>

<h3>Which doors a web server needs</h3>
<table>
<tr><th>Port</th><th>Who needs it</th><th>Open to</th></tr>
<tr><td>22 (or your SSH port)</td><td>you, CI deploys</td><td>the Internet, keys only (Linux &amp; Bash course, Chapter 9); ideally a few IPs</td></tr>
<tr><td>80</td><td>HTTP→HTTPS redirect and the ACME HTTP-01 challenge (12.2)</td><td>the Internet</td></tr>
<tr><td>443</td><td>users</td><td>the Internet</td></tr>
<tr><td>3000, 8080… (the app)</td><td>nginx on the same machine</td><td><code>127.0.0.1</code> only</td></tr>
<tr><td>5432 Postgres, 6379 Redis</td><td>the app</td><td><code>127.0.0.1</code> or a private Docker network — never the Internet</td></tr>
</table>
<p>Everything else is attack surface with no user. Two mechanisms decide whether a port is reachable: what address the process <em>listens</em> on, and what the firewall lets through. You need to read both.</p>

<h3>Reading <code>ss -tlnp</code></h3>
${slide('dv-12', 19, 'ss -tlnp: ai đang nghe, nghe ở địa chỉ nào — 8080 lẽ ra chỉ nên là 127.0.0.1')}
<div class="out">$ sudo ss -tlnp
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      511          0.0.0.0:8080       0.0.0.0:*    users:(("nginx",pid=372,fd=10))
LISTEN 0      4096      127.0.0.11:37435      0.0.0.0:*
LISTEN 0      511          0.0.0.0:443        0.0.0.0:*    users:(("nginx",pid=372,fd=28))
LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=1,fd=3))
LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=372,fd=5))
LISTEN 0      5          127.0.0.1:3000       0.0.0.0:*
LISTEN 0      128             [::]:22            [::]:*    users:(("sshd",pid=1,fd=4))</div>
<table>
<tr><th>Flag / column</th><th>Meaning</th></tr>
<tr><td><code>-t</code> / <code>-u</code></td><td>TCP / UDP sockets.</td></tr>
<tr><td><code>-l</code></td><td>Only listening sockets (not established connections).</td></tr>
<tr><td><code>-n</code></td><td>Numbers, not names (<code>:443</code>, not <code>:https</code>).</td></tr>
<tr><td><code>-p</code></td><td>The owning process — needs <code>sudo</code> for other users' processes, which is why <code>:3000</code> shows none here (the app runs as another user).</td></tr>
<tr><td><code>Send-Q</code> on a listener</td><td>The accept backlog: 511 is nginx's default, 4096 the kernel limit.</td></tr>
<tr><td><code>0.0.0.0:80</code> / <code>[::]:22</code></td><td>Every IPv4 / IPv6 address of the machine — reachable from outside if the firewall allows.</td></tr>
<tr><td><code>127.0.0.1:3000</code></td><td>Loopback only: no firewall rule can expose it, because nothing outside can address it.</td></tr>
<tr><td><code>127.0.0.11:…</code></td><td>Docker's embedded DNS inside a container (12.1). Ignore.</td></tr>
</table>
<p>This listing caught a real mistake in this very lab: <code>0.0.0.0:8080</code> is the static-file origin built for Lesson 12.4. Only the CDN container needs it, yet it listens on every address. <code>listen 127.0.0.1:8080;</code> — or a firewall rule — would have been right. Nobody notices this kind of thing unless they read <code>ss</code> after every change.</p>

<h3>ufw: deny by default, allow three ports</h3>
<pre><code class="language-bash">sudo ufw default deny incoming     # everything in is refused unless allowed
sudo ufw default allow outgoing
sudo ufw allow 22,80,443/tcp       # BEFORE enabling, or you lock yourself out
sudo ufw enable
sudo ufw status verbose</code></pre>
<div class="out">Default incoming policy changed to 'deny'
(be sure to update your rules accordingly)
Rules updated
Rules updated (v6)
Firewall is active and enabled on system startup
$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22,80,443/tcp              ALLOW IN    Anywhere
22,80,443/tcp (v6)         ALLOW IN    Anywhere (v6)</div>
<div class="callout warn"><strong>Allow SSH before <code>ufw enable</code>, and allow the port you actually use.</strong> This project's VPS also listens for SSH on port 993 because a school network blocks 22 (CLAUDE.md, 18/09/2026); a firewall that allows only 22 would silently cut that path. Keep a second session open while changing firewall rules, and know how to reach the VPS console from the provider's panel.</div>
<p>Note the line <code>deny (routed)</code>. It is about to matter.</p>

<h3>Rebuilt in the lab: ufw is on, and Postgres is open</h3>
${slide('dv-12', 20, 'ufw đang bật mà Postgres vẫn mở ra ngoài, đăng nhập được từ máy khác')}
<p>The lab machine <code>dv12-fw</code> is an Ubuntu 24.04 container run <code>--privileged</code> for a short time so it can have its own iptables, ufw 0.36.2 and a Docker 29.1.3 daemon inside it — a VPS with Docker, in miniature. <code>dv12-vps</code> plays "another machine on the Internet". On <code>dv12-fw</code>, ufw as above, a Postgres container published the way the team did it, and — for comparison — a plain process listening on 6379:</p>
<div class="out">$ sudo ufw status
Status: active
To                         Action      From
--                         ------      ----
22,80,443/tcp              ALLOW       Anywhere
22,80,443/tcp (v6)         ALLOW       Anywhere (v6)
$ docker run -d --name db -e POSTGRES_PASSWORD=12345 -p 5432:5432 postgres:16-alpine
32d677df72c9
$ sudo ss -tlnp | sed "s/  */ /g"
State Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0 4096 127.0.0.11:43945 0.0.0.0:*
LISTEN 0 4096 0.0.0.0:5432 0.0.0.0:* users:(("docker-proxy",pid=506,fd=7))
LISTEN 0 5 0.0.0.0:6379 0.0.0.0:* users:(("python3",pid=448,fd=3))
LISTEN 0 4096 [::]:5432 [::]:* users:(("docker-proxy",pid=514,fd=7))</div>
<p>From the other machine:</p>
<div class="out">$ nmap -Pn -p 22,80,443,5432,6379 172.22.12.60
Nmap scan report for dv12-fw.dv12-net (172.22.12.60)
Host is up (0.00086s latency).
PORT     STATE    SERVICE
22/tcp   closed   ssh
80/tcp   closed   http
443/tcp  closed   https
5432/tcp open     postgresql
6379/tcp filtered redis
Nmap done: 1 IP address (1 host up) scanned in 1.24 seconds
$ PGPASSWORD=12345 psql -h 172.22.12.60 -U postgres -Atc "select version();" | cut -c1-60
PostgreSQL 16.14 on aarch64-unknown-linux-musl, compiled by </div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>6379 filtered</code></span><span class="v">An ordinary process listening on <code>0.0.0.0</code>: ufw dropped the packets, nmap got no answer. The firewall did its job. (nmap labels 6379 "redis" from the port number alone; it is a Python web server here.)</span></div>
  <div class="kv"><span class="k"><code>5432 open</code></span><span class="v">The Docker-published port, under the same ufw rules, is reachable — and the second command logged in and ran a query. On the Internet, automated scanners try exactly this against every IPv4 address, continuously.</span></div>
  <div class="kv"><span class="k"><code>22/80/443 closed</code></span><span class="v">Allowed by ufw, but nothing listens on this lab machine, so the kernel answers with a reset. <code>closed</code> means "reachable, nobody home".</span></div>
</div>

<h3>Why: Docker rewrites the packet before ufw looks at it</h3>
${slide('dv-12', 21, 'Docker DNAT ở PREROUTING ⇒ gói đi FORWARD, ufw chỉ canh INPUT')}
<p>ufw is a front-end for iptables, and its rules live in the <code>INPUT</code> chain — packets addressed to this machine. Docker's documentation states what happens to a published port: traffic to it is diverted before it goes through ufw, because Docker routes it in the <code>nat</code> table, before the packet reaches the <code>INPUT</code> and <code>OUTPUT</code> chains ufw uses. On the lab machine:</p>
<div class="out">$ sudo iptables -t nat -L DOCKER -n
Chain DOCKER (2 references)
target     prot opt source               destination
DNAT       6    --  0.0.0.0/0            0.0.0.0/0            tcp dpt:5432 to:172.17.0.2:5432
$ sudo iptables -L FORWARD -n --line-numbers | head
Chain FORWARD (policy DROP)
num  target     prot opt source               destination
1    DOCKER-USER  0    --  0.0.0.0/0            0.0.0.0/0
2    DOCKER-FORWARD  0    --  0.0.0.0/0            0.0.0.0/0
3    ufw-before-logging-forward  0    --  0.0.0.0/0            0.0.0.0/0
4    ufw-before-forward  0    --  0.0.0.0/0            0.0.0.0/0
5    ufw-after-forward  0    --  0.0.0.0/0            0.0.0.0/0
6    ufw-after-logging-forward  0    --  0.0.0.0/0            0.0.0.0/0
7    ufw-reject-forward  0    --  0.0.0.0/0            0.0.0.0/0
8    ufw-track-forward  0    --  0.0.0.0/0            0.0.0.0/0
$ sudo iptables -L INPUT -n | head -5
Chain INPUT (policy DROP)
target     prot opt source               destination
ufw-before-logging-input  0    --  0.0.0.0/0            0.0.0.0/0
ufw-before-input  0    --  0.0.0.0/0            0.0.0.0/0
ufw-after-input  0    --  0.0.0.0/0            0.0.0.0/0</div>
<ol>
<li>A packet for <code>172.22.12.60:5432</code> arrives. In <code>PREROUTING</code> (nat table), Docker's <code>DNAT</code> rule rewrites its destination to the container, <code>172.17.0.2:5432</code>.</li>
<li>The destination is no longer this machine, so the packet goes to <code>FORWARD</code>, not <code>INPUT</code>.</li>
<li>In <code>FORWARD</code>, rule 1 is <code>DOCKER-USER</code> (empty by default) and rule 2 is <code>DOCKER-FORWARD</code>, which accepts traffic to published ports. ufw's forward chains come third — the packet never reaches them.</li>
<li>The packet for 6379 is addressed to the machine itself, goes through <code>INPUT</code>, meets ufw, and is dropped.</li>
</ol>
<p>This is not a bug in either tool; it is two tools each managing iptables for their own purpose. The practical conclusion: <strong>for Docker-published ports, ufw is not your firewall</strong>. The address you publish on is.</p>

<h3>Three ways to close it, all measured</h3>
${slide('dv-12', 22, 'Ba cách đóng cổng DB: 127.0.0.1, không publish, DOCKER-USER — cả ba filtered')}
<p><strong>A. Publish on loopback only.</strong></p>
<div class="out">$ docker run -d --name db -e POSTGRES_PASSWORD=12345 -p 127.0.0.1:5432:5432 postgres:16-alpine
$ sudo ss -tlnp | grep 5432 | sed "s/  */ /g"
LISTEN 0 4096 127.0.0.1:5432 0.0.0.0:* users:(("docker-proxy",pid=710,fd=7))
--- nmap tu may khac:
5432/tcp filtered postgresql</div>
<p>The DNAT rule now matches only packets addressed to <code>127.0.0.1</code>. A packet from outside to the public IP is an ordinary <code>INPUT</code> packet, and ufw drops it. You can still reach the database from the VPS itself, or from your laptop through an SSH tunnel: <code>ssh -L 5432:127.0.0.1:5432 deploy@vps</code>, then point DBeaver at <code>localhost:5432</code>. That is what the team actually needed.</p>
<p><strong>B. Do not publish at all.</strong> The API reaches the database by service name over a Docker network; nothing on the host listens:</p>
<div class="out">$ docker run -d --name db --network noibo -e POSTGRES_PASSWORD=12345 postgres:16-alpine   # KHONG -p
$ docker run --rm --network noibo postgres:16-alpine pg_isready -h db
db:5432 - accepting connections
$ sudo ss -tlnp | grep 5432 || echo "(khong co gi nghe 5432 tren may)"
(khong co gi nghe 5432 tren may)
5432/tcp filtered postgresql</div>
<pre><code class="language-yaml">services:
  db:
    image: postgres:16-alpine
    # no ports: — only services on this compose network can reach db:5432
  api:
    ports:
      - "127.0.0.1:3000:3000"   # nginx on the host proxies to it</code></pre>
<p>This is the right default for compose on a VPS (Chapter 13 builds on it). Every <code>ports:</code> line should justify itself, and the justification is almost always "nginx on the host needs it", which means <code>127.0.0.1:</code>.</p>
<p><strong>C. A rule in <code>DOCKER-USER</code>.</strong> Docker guarantees that chain runs first in <code>FORWARD</code> and never touches it, so it is where your own rules for published ports go:</p>
<div class="out">$ sudo iptables -I DOCKER-USER -i eth0 -p tcp -m conntrack --ctorigdstport 5432 -j DROP
Chain DOCKER-USER (1 references)
 pkts bytes target     prot opt in     out     source               destination
    0     0 DROP       6    --  eth0   *       0.0.0.0/0            0.0.0.0/0            ctorigdstport 5432
5432/tcp filtered postgresql
Chain DOCKER-USER (1 references)
 pkts bytes target     prot opt in     out     source               destination
    2   120 DROP       6    --  eth0   *       0.0.0.0/0            0.0.0.0/0            ctorigdstport 5432</div>
<p>Why <code>--ctorigdstport</code> and not <code>--dport</code>: by the time a packet is in <code>FORWARD</code> it has already been rewritten, so <code>--dport</code> sees the <em>container's</em> port. Here both are 5432, but with <code>-p 15432:5432</code> a <code>--dport 15432</code> rule would never match. conntrack remembers the original destination. The counter going from 0 to 2 packets is nmap's probes being dropped. The catch: a rule typed by hand disappears at the next reboot unless you persist it (<code>iptables-persistent</code>), while A and B live in <code>compose.yaml</code> and travel with every deploy.</p>
<table>
<tr><th>Fix</th><th>Survives reboot and redeploy</th><th>Keeps DB reachable for you</th><th>Use when</th></tr>
<tr><td>A. <code>127.0.0.1:</code></td><td>yes (in compose)</td><td>from the VPS or an SSH tunnel</td><td>you need psql / DBeaver occasionally</td></tr>
<tr><td>B. no <code>ports:</code></td><td>yes (in compose)</td><td>via <code>docker compose exec db psql</code></td><td>default for databases and caches</td></tr>
<tr><td>C. <code>DOCKER-USER</code></td><td>only if persisted</td><td>unchanged</td><td>emergency patch on a live server, or rules by source IP</td></tr>
</table>

<h3>Scan yourself from somewhere else</h3>
${slide('dv-12', 23, 'Tự quét máy mình từ máy khác: nmap -p- và -sV')}
<div class="out">$ nmap -Pn -p- vidu.test
Nmap scan report for vidu.test (172.22.0.3)
Host is up (0.0000070s latency).
rDNS record for 172.22.0.3: dv12-vps.dv12-net
Not shown: 65532 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
MAC Address: B2:6A:A8:47:D9:51 (Unknown)
Nmap done: 1 IP address (1 host up) scanned in 1.29 seconds
$ nmap -Pn -sV -p 22,80,443 vidu.test
22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.19 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     nginx 1.24.0 (Ubuntu)
443/tcp open  ssl/http nginx 1.24.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel</div>
<table>
<tr><th>nmap says</th><th>Means</th><th>Seen here</th></tr>
<tr><td><code>open</code></td><td>something listens and the firewall lets you in</td><td>22, 80, 443 on the VPS; 5432 via Docker</td></tr>
<tr><td><code>closed</code></td><td>reachable, nothing listening (the host answered RST)</td><td>65 532 ports on the VPS</td></tr>
<tr><td><code>filtered</code></td><td>no answer — a firewall dropped the probe</td><td>6379 behind ufw; 5432 after each fix</td></tr>
</table>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>-Pn</code></td><td>Skip the "is the host up" ping; scan anyway (many VPS drop ping).</td></tr>
<tr><td><code>-p 22,80</code> / <code>-p-</code></td><td>These ports / all 65 535.</td></tr>
<tr><td><code>-sV</code></td><td>Talk to each open port and identify the software and version.</td></tr>
</table>
<p>Scan from a machine <em>outside</em> — a second VPS, a friend's server with permission, a phone hotspot — because a scan from the server itself goes over loopback and bypasses the firewall. Here the lab network plays "outside". The <code>-sV</code> line also shows what anyone can learn: <code>nginx 1.24.0 (Ubuntu)</code>. <code>server_tokens off;</code> removes the version from headers and error pages; it fixes nothing, it just stops advertising which advisories apply to you.</p>
<div class="callout danger"><strong>Only scan machines you own or have written permission to test.</strong> Scanning other people's servers can break the law and your provider's terms; VPS providers suspend accounts over it.</div>

<h3>Try it step by step</h3>
<ol>
<li>A lab machine with its own firewall and Docker: <code>docker run -d --privileged --name dv12-fw -v dv12-dind:/var/lib/docker dv12-img sleep infinity</code>, then <code>docker exec -d dv12-fw dockerd</code>. The named volume matters: without it, Docker-in-Docker fails with <code>failed to mount … fstype: overlay … invalid argument</code> (overlay on overlay), which is what the first attempt here did.</li>
<li>Inside: the ufw commands above; <code>docker run -p 5432:5432 …</code>; <code>ss -tlnp</code>.</li>
<li>From another container on the same network: <code>nmap -Pn -p 5432,6379 &lt;ip&gt;</code>, then <code>psql</code>.</li>
<li>Apply fix A, B or C and scan again. Then <code>docker rm -f dv12-fw</code> — <code>--privileged</code> is for a short lab only.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Trap — "the firewall is on" as proof that a port is closed.</strong> <code>ufw status</code> reports the rules ufw manages, not what is reachable. With Docker, the published port bypassed every one of them. Proof is a scan from outside showing <code>filtered</code> or <code>closed</code>. The same trap exists with cloud security groups that you believe are attached but are not, and with IPv6: here <code>docker-proxy</code> also listened on <code>[::]:5432</code>, so check both families if the VPS has a public IPv6.</div>

<h3>On macOS and Windows: your laptop publishes too</h3>
<p>The same <code>-p</code> habit exposes services on your laptop. On a Mac M1 with Docker Desktop 29.8.0:</p>
<div class="out">$ docker run -d -p 19129:80 nginx:1.27-alpine
$ lsof -nP -iTCP:19129 -sTCP:LISTEN
COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
com.docke 15848 admin  277u  IPv6 0xd4eaacd3eaf3a556      0t0  TCP *:19129 (LISTEN)
$ docker run -d -p 127.0.0.1:19129:80 nginx:1.27-alpine
COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
com.docke 15848 admin  274u  IPv4 0xd4eaacd3eaf3a556      0t0  TCP 127.0.0.1:19129 (LISTEN)</div>
<p><code>*:19129</code> means every interface — the café Wi-Fi included, unless the macOS firewall blocks Docker. With <code>127.0.0.1:</code> it is your machine only. On Windows, Docker Desktop and WSL behave the same way and Windows Defender Firewall may prompt once; the fix is the same prefix. <code>ss</code> does not exist on macOS — use <code>lsof -nP -iTCP -sTCP:LISTEN</code>; on Windows, <code>netstat -ano | findstr LISTENING</code> or <code>Get-NetTCPConnection -State Listen</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your team's compose file has <code>ports: ["5432:5432", "6379:6379"]</code> "so we can debug". Prove to the team, on the lab, that ufw does not protect those ports, and ship the fix.</p>
<ol>
<li>Start <code>dv12-fw</code> (privileged, volume for <code>/var/lib/docker</code>, <code>dockerd</code> inside). Enable ufw with only 22/80/443.</li>
<li>Run Postgres with <code>-p 5432:5432</code>. From another container, <code>nmap -Pn -p 5432</code> and log in with <code>psql</code>.</li>
<li>Read <code>iptables -t nat -L DOCKER -n</code> and the first lines of <code>FORWARD</code>; point to the rule that lets the packet through.</li>
<li>Recreate the database with <code>127.0.0.1:5432:5432</code>, then without <code>-p</code> on a private network. Scan after each.</li>
</ol>
<p><strong>Done when:</strong> you have <code>open</code> then <code>filtered</code> for 5432 in your notes, and a compose diff with no <code>ports:</code> on the database and <code>127.0.0.1:</code> on the app.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Listening address</span><span class="v"><code>0.0.0.0</code>/<code>[::]</code> = every interface; <code>127.0.0.1</code> = this machine only.</span></div>
  <div class="kv"><span class="k">Publish (<code>-p</code>, <code>ports:</code>)</span><span class="v">Docker making a container port reachable on the host, via DNAT and docker-proxy.</span></div>
  <div class="kv"><span class="k">DNAT</span><span class="v">Rewriting a packet's destination address/port — how Docker sends host traffic to a container.</span></div>
  <div class="kv"><span class="k">INPUT / FORWARD chains</span><span class="v">Packets for this machine / packets being routed elsewhere (including into containers).</span></div>
  <div class="kv"><span class="k"><code>DOCKER-USER</code></span><span class="v">The chain Docker evaluates first and leaves alone — for your own rules on published ports.</span></div>
  <div class="kv"><span class="k">open / closed / filtered</span><span class="v">nmap's three answers: someone listens / nobody listens / a firewall ate the probe.</span></div>
  <div class="kv"><span class="k">SSH tunnel (<code>ssh -L</code>)</span><span class="v">Reaching a loopback-only port on the server from your laptop, through SSH.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A web VPS needs 22, 80 and 443 reachable; the app and databases listen on 127.0.0.1 or a private network.</li>
<li><code>ss -tlnp</code> after every change shows what listens where — it caught an unneeded 0.0.0.0:8080 in this lab.</li>
<li>Docker-published ports bypass ufw: measured, Postgres was open and logged into while ufw denied everything else.</li>
<li>The reason is DNAT in PREROUTING sending the packet to FORWARD, where Docker's chains accept it before ufw's.</li>
<li>Fix with <code>127.0.0.1:</code>, no <code>ports:</code> at all, or a persisted <code>DOCKER-USER</code> rule using <code>--ctorigdstport</code>.</li>
<li>Prove it with a scan from outside; only scan what you own.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Packet filtering and firewalls</span><span class="lc-sub">docs.docker.com/engine/network/packet-filtering-firewalls — the official statement that published ports bypass ufw, and the DOCKER-USER chain.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Port publishing</span><span class="lc-sub">docs.docker.com/engine/network/port-publishing — binding to a specific address such as 127.0.0.1.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">ufw(8)</span><span class="lc-sub">manpages.ubuntu.com/manpages/noble/man8/ufw.8.html — defaults, rule syntax, routed traffic.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">ss(8)</span><span class="lc-sub">man7.org/linux/man-pages/man8/ss.8.html — every flag and filter.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nmap — Port scanning basics</span><span class="lc-sub">nmap.org/book/man-port-scanning-basics.html — what open, closed and filtered really mean.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — networks and Compose</span><span class="lc-sub">/courses/docker/learn${REF} — user-defined networks and service names, the basis of fix B.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Chỉ mở đúng cổng: ss, ufw, và cách Docker đi vòng qua tường lửa của bạn</h2>
<p class="lead">Một nhóm SWP391 thêm <code>ports: "5432:5432"</code> vào tệp compose để cả nhóm mở cơ sở dữ liệu bằng DBeaver từ laptop. VPS đã bật ufw, chỉ cho 22, 80 và 443, nên cả nhóm tin cơ sở dữ liệu là riêng tư. Không phải vậy. Bài này dựng lại ĐÚNG cái máy đó trong phòng thí nghiệm, đăng nhập vào Postgres của nó từ một máy khác bằng đúng cái mật khẩu yếu của nhóm, giải thích đường đi của gói tin khiến chuyện đó xảy ra, và đo ba cách đóng nó lại.</p>

<h3>Một máy web cần những cánh cửa nào</h3>
<table>
<tr><th>Cổng</th><th>Ai cần</th><th>Mở cho</th></tr>
<tr><td>22 (hoặc cổng SSH của bạn)</td><td>bạn, CI khi deploy</td><td>Internet, chỉ bằng khoá (khoá Linux &amp; Bash, Chương 9); tốt nhất là vài IP</td></tr>
<tr><td>80</td><td>chuyển hướng HTTP→HTTPS và thử thách ACME HTTP-01 (12.2)</td><td>Internet</td></tr>
<tr><td>443</td><td>người dùng</td><td>Internet</td></tr>
<tr><td>3000, 8080… (app)</td><td>nginx trên cùng máy</td><td>chỉ <code>127.0.0.1</code></td></tr>
<tr><td>5432 Postgres, 6379 Redis</td><td>app</td><td><code>127.0.0.1</code> hoặc một mạng Docker riêng — KHÔNG BAO GIỜ là Internet</td></tr>
</table>
<p>Mọi cổng khác là bề mặt tấn công mà không có người dùng nào. Hai cơ chế quyết định một cổng có tới được hay không: tiến trình <em>nghe</em> ở địa chỉ nào, và tường lửa cho gì đi qua. Bạn phải đọc được CẢ HAI.</p>

<h3>Đọc <code>ss -tlnp</code></h3>
${slide('dv-12', 19, 'ss -tlnp: ai đang nghe, nghe ở địa chỉ nào — 8080 lẽ ra chỉ nên là 127.0.0.1')}
<div class="out">$ sudo ss -tlnp
State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
LISTEN 0      511          0.0.0.0:8080       0.0.0.0:*    users:(("nginx",pid=372,fd=10))
LISTEN 0      4096      127.0.0.11:37435      0.0.0.0:*
LISTEN 0      511          0.0.0.0:443        0.0.0.0:*    users:(("nginx",pid=372,fd=28))
LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=1,fd=3))
LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=372,fd=5))
LISTEN 0      5          127.0.0.1:3000       0.0.0.0:*
LISTEN 0      128             [::]:22            [::]:*    users:(("sshd",pid=1,fd=4))</div>
<table>
<tr><th>Cờ / cột</th><th>Nghĩa</th></tr>
<tr><td><code>-t</code> / <code>-u</code></td><td>Socket TCP / UDP.</td></tr>
<tr><td><code>-l</code></td><td>Chỉ socket đang NGHE (không phải kết nối đang mở).</td></tr>
<tr><td><code>-n</code></td><td>In số, không in tên (<code>:443</code>, không phải <code>:https</code>).</td></tr>
<tr><td><code>-p</code></td><td>Tiến trình sở hữu — cần <code>sudo</code> để thấy tiến trình của người dùng khác, vì thế <code>:3000</code> ở đây không hiện gì (app chạy bằng người dùng khác).</td></tr>
<tr><td><code>Send-Q</code> ở dòng đang nghe</td><td>Hàng đợi chấp nhận kết nối: 511 là mặc định của nginx, 4096 là trần của nhân.</td></tr>
<tr><td><code>0.0.0.0:80</code> / <code>[::]:22</code></td><td>MỌI địa chỉ IPv4 / IPv6 của máy — tới được từ ngoài nếu tường lửa cho.</td></tr>
<tr><td><code>127.0.0.1:3000</code></td><td>Chỉ vòng lặp nội bộ (loopback): không luật tường lửa nào làm lộ được nó, vì bên ngoài không có cách nào gọi tới địa chỉ đó.</td></tr>
<tr><td><code>127.0.0.11:…</code></td><td>DNS nhúng của Docker bên trong container (12.1). Kệ nó.</td></tr>
</table>
<p>Chính bảng này bắt được một lỗi thật trong phòng thí nghiệm này: <code>0.0.0.0:8080</code> là máy gốc tệp tĩnh dựng cho Bài 12.4. Chỉ container CDN cần tới nó, vậy mà nó nghe ở MỌI địa chỉ. <code>listen 127.0.0.1:8080;</code> — hoặc một luật tường lửa — mới đúng. Không ai để ý loại chuyện này nếu không đọc <code>ss</code> sau mỗi lần thay đổi.</p>

<h3>ufw: mặc định từ chối, cho phép ba cổng</h3>
<pre><code class="language-bash">sudo ufw default deny incoming     # mọi thứ đi vào đều bị từ chối trừ khi được cho phép
sudo ufw default allow outgoing
sudo ufw allow 22,80,443/tcp       # TRƯỚC khi bật, không thì tự khoá mình ở ngoài
sudo ufw enable
sudo ufw status verbose</code></pre>
<div class="out">Default incoming policy changed to 'deny'
(be sure to update your rules accordingly)
Rules updated
Rules updated (v6)
Firewall is active and enabled on system startup
$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22,80,443/tcp              ALLOW IN    Anywhere
22,80,443/tcp (v6)         ALLOW IN    Anywhere (v6)</div>
<div class="callout warn"><strong>Cho phép SSH TRƯỚC <code>ufw enable</code>, và cho phép đúng cái cổng bạn đang dùng.</strong> VPS của dự án này còn nghe SSH ở cổng 993 vì mạng trường chặn cổng 22 (CLAUDE.md, 18/09/2026); một tường lửa chỉ cho 22 sẽ lặng lẽ cắt mất con đường đó. Giữ sẵn một phiên SSH thứ hai khi sửa luật tường lửa, và biết cách vào console của VPS từ bảng điều khiển của nhà cung cấp.</div>
<p>Để ý dòng <code>deny (routed)</code> (từ chối gói đi xuyên qua). Nó sắp có ý nghĩa.</p>

<h3>Dựng lại trong phòng thí nghiệm: ufw đang bật, và Postgres đang mở</h3>
${slide('dv-12', 20, 'ufw đang bật mà Postgres vẫn mở ra ngoài, đăng nhập được từ máy khác')}
<p>Máy thí nghiệm <code>dv12-fw</code> là một container Ubuntu 24.04 chạy <code>--privileged</code> trong thời gian ngắn để có iptables riêng, ufw 0.36.2 và một Docker 29.1.3 chạy bên trong — một VPS có Docker thu nhỏ. <code>dv12-vps</code> đóng vai "một máy khác trên Internet". Trên <code>dv12-fw</code>: ufw như ở trên, một container Postgres publish đúng kiểu cả nhóm đã làm, và — để so sánh — một tiến trình thường nghe cổng 6379:</p>
<div class="out">$ sudo ufw status
Status: active
To                         Action      From
--                         ------      ----
22,80,443/tcp              ALLOW       Anywhere
22,80,443/tcp (v6)         ALLOW       Anywhere (v6)
$ docker run -d --name db -e POSTGRES_PASSWORD=12345 -p 5432:5432 postgres:16-alpine
32d677df72c9
$ sudo ss -tlnp | sed "s/  */ /g"
State Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0 4096 127.0.0.11:43945 0.0.0.0:*
LISTEN 0 4096 0.0.0.0:5432 0.0.0.0:* users:(("docker-proxy",pid=506,fd=7))
LISTEN 0 5 0.0.0.0:6379 0.0.0.0:* users:(("python3",pid=448,fd=3))
LISTEN 0 4096 [::]:5432 [::]:* users:(("docker-proxy",pid=514,fd=7))</div>
<p>Từ máy kia:</p>
<div class="out">$ nmap -Pn -p 22,80,443,5432,6379 172.22.12.60
Nmap scan report for dv12-fw.dv12-net (172.22.12.60)
Host is up (0.00086s latency).
PORT     STATE    SERVICE
22/tcp   closed   ssh
80/tcp   closed   http
443/tcp  closed   https
5432/tcp open     postgresql
6379/tcp filtered redis
Nmap done: 1 IP address (1 host up) scanned in 1.24 seconds
$ PGPASSWORD=12345 psql -h 172.22.12.60 -U postgres -Atc "select version();" | cut -c1-60
PostgreSQL 16.14 on aarch64-unknown-linux-musl, compiled by </div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>6379 filtered</code></span><span class="v">Một tiến trình thường nghe <code>0.0.0.0</code>: ufw vứt gói tin, nmap không nhận được trả lời. Tường lửa làm đúng việc. (nmap gọi 6379 là "redis" chỉ vì số cổng; ở đây nó là một máy web Python.)</span></div>
  <div class="kv"><span class="k"><code>5432 open</code></span><span class="v">Cổng do Docker publish, dưới CÙNG các luật ufw, lại tới được — và lệnh thứ hai đã đăng nhập và chạy truy vấn. Trên Internet, các máy quét tự động thử đúng chuyện này với mọi địa chỉ IPv4, liên tục.</span></div>
  <div class="kv"><span class="k"><code>22/80/443 closed</code></span><span class="v">ufw cho phép, nhưng trên máy thí nghiệm này không ai nghe, nên nhân trả về một gói reset. <code>closed</code> nghĩa là "tới được, không có ai ở nhà".</span></div>
</div>

<h3>Vì sao: Docker viết lại gói tin trước khi ufw kịp nhìn</h3>
${slide('dv-12', 21, 'Docker DNAT ở PREROUTING ⇒ gói đi FORWARD, ufw chỉ canh INPUT')}
<p>ufw là lớp vỏ của iptables, và luật của nó nằm trong chuỗi <code>INPUT</code> — gói tin gửi CHO máy này. Tài liệu của Docker nói rõ chuyện gì xảy ra với một cổng đã publish: lưu lượng tới nó bị rẽ đi trước khi qua các luật ufw, vì Docker định tuyến nó trong bảng <code>nat</code>, trước khi gói tới các chuỗi <code>INPUT</code> và <code>OUTPUT</code> mà ufw dùng. Trên máy thí nghiệm:</p>
<div class="out">$ sudo iptables -t nat -L DOCKER -n
Chain DOCKER (2 references)
target     prot opt source               destination
DNAT       6    --  0.0.0.0/0            0.0.0.0/0            tcp dpt:5432 to:172.17.0.2:5432
$ sudo iptables -L FORWARD -n --line-numbers | head
Chain FORWARD (policy DROP)
num  target     prot opt source               destination
1    DOCKER-USER  0    --  0.0.0.0/0            0.0.0.0/0
2    DOCKER-FORWARD  0    --  0.0.0.0/0            0.0.0.0/0
3    ufw-before-logging-forward  0    --  0.0.0.0/0            0.0.0.0/0
4    ufw-before-forward  0    --  0.0.0.0/0            0.0.0.0/0
5    ufw-after-forward  0    --  0.0.0.0/0            0.0.0.0/0
6    ufw-after-logging-forward  0    --  0.0.0.0/0            0.0.0.0/0
7    ufw-reject-forward  0    --  0.0.0.0/0            0.0.0.0/0
8    ufw-track-forward  0    --  0.0.0.0/0            0.0.0.0/0
$ sudo iptables -L INPUT -n | head -5
Chain INPUT (policy DROP)
target     prot opt source               destination
ufw-before-logging-input  0    --  0.0.0.0/0            0.0.0.0/0
ufw-before-input  0    --  0.0.0.0/0            0.0.0.0/0
ufw-after-input  0    --  0.0.0.0/0            0.0.0.0/0</div>
<ol>
<li>Một gói tới <code>172.22.12.60:5432</code>. Ở <code>PREROUTING</code> (bảng nat), luật <code>DNAT</code> của Docker viết lại đích của nó thành container, <code>172.17.0.2:5432</code>.</li>
<li>Đích không còn là máy này nữa, nên gói đi vào <code>FORWARD</code>, không vào <code>INPUT</code>.</li>
<li>Trong <code>FORWARD</code>, luật 1 là <code>DOCKER-USER</code> (mặc định rỗng) và luật 2 là <code>DOCKER-FORWARD</code>, chấp nhận lưu lượng tới các cổng đã publish. Chuỗi forward của ufw đứng thứ ba — gói tin không bao giờ tới lượt.</li>
<li>Gói tới 6379 thì gửi cho CHÍNH máy này, đi qua <code>INPUT</code>, gặp ufw, và bị vứt.</li>
</ol>
<p>Đây không phải lỗi của công cụ nào; đó là hai công cụ cùng quản lý iptables cho mục đích riêng của mỗi bên. Kết luận thực tế: <strong>với cổng Docker publish, ufw KHÔNG phải tường lửa của bạn</strong>. Địa chỉ bạn publish ra mới là.</p>

<h3>Ba cách đóng, đo cả ba</h3>
${slide('dv-12', 22, 'Ba cách đóng cổng DB: 127.0.0.1, không publish, DOCKER-USER — cả ba filtered')}
<p><strong>A. Chỉ publish trên loopback.</strong></p>
<div class="out">$ docker run -d --name db -e POSTGRES_PASSWORD=12345 -p 127.0.0.1:5432:5432 postgres:16-alpine
$ sudo ss -tlnp | grep 5432 | sed "s/  */ /g"
LISTEN 0 4096 127.0.0.1:5432 0.0.0.0:* users:(("docker-proxy",pid=710,fd=7))
--- nmap tu may khac:
5432/tcp filtered postgresql</div>
<p>Luật DNAT giờ chỉ khớp gói gửi tới <code>127.0.0.1</code>. Gói từ bên ngoài tới IP công khai là một gói <code>INPUT</code> bình thường, và ufw vứt nó. Bạn vẫn vào được cơ sở dữ liệu từ chính VPS, hoặc từ laptop qua đường hầm SSH: <code>ssh -L 5432:127.0.0.1:5432 deploy@vps</code>, rồi cho DBeaver trỏ vào <code>localhost:5432</code>. Đó mới là thứ cả nhóm thật sự cần.</p>
<p><strong>B. Không publish gì cả.</strong> API tới cơ sở dữ liệu bằng tên dịch vụ qua một mạng Docker; trên máy chủ không có gì nghe:</p>
<div class="out">$ docker run -d --name db --network noibo -e POSTGRES_PASSWORD=12345 postgres:16-alpine   # KHONG -p
$ docker run --rm --network noibo postgres:16-alpine pg_isready -h db
db:5432 - accepting connections
$ sudo ss -tlnp | grep 5432 || echo "(khong co gi nghe 5432 tren may)"
(khong co gi nghe 5432 tren may)
5432/tcp filtered postgresql</div>
<pre><code class="language-yaml">services:
  db:
    image: postgres:16-alpine
    # không có ports: — chỉ dịch vụ trong mạng compose này tới được db:5432
  api:
    ports:
      - "127.0.0.1:3000:3000"   # nginx trên máy chủ chuyển tiếp vào đây</code></pre>
<p>Đây là mặc định đúng cho compose trên VPS (Chương 13 xây tiếp trên nó). Mỗi dòng <code>ports:</code> phải tự biện minh, và lý do gần như luôn là "nginx trên máy chủ cần nó" — nghĩa là <code>127.0.0.1:</code>.</p>
<p><strong>C. Một luật trong <code>DOCKER-USER</code>.</strong> Docker đảm bảo chuỗi đó chạy ĐẦU TIÊN trong <code>FORWARD</code> và không bao giờ đụng vào nó, nên đó là chỗ cho luật riêng của bạn với các cổng đã publish:</p>
<div class="out">$ sudo iptables -I DOCKER-USER -i eth0 -p tcp -m conntrack --ctorigdstport 5432 -j DROP
Chain DOCKER-USER (1 references)
 pkts bytes target     prot opt in     out     source               destination
    0     0 DROP       6    --  eth0   *       0.0.0.0/0            0.0.0.0/0            ctorigdstport 5432
5432/tcp filtered postgresql
Chain DOCKER-USER (1 references)
 pkts bytes target     prot opt in     out     source               destination
    2   120 DROP       6    --  eth0   *       0.0.0.0/0            0.0.0.0/0            ctorigdstport 5432</div>
<p>Vì sao <code>--ctorigdstport</code> mà không phải <code>--dport</code>: lúc gói vào <code>FORWARD</code> thì nó ĐÃ bị viết lại, nên <code>--dport</code> thấy cổng của <em>container</em>. Ở đây cả hai đều là 5432, nhưng với <code>-p 15432:5432</code> thì luật <code>--dport 15432</code> sẽ không bao giờ khớp. conntrack (bộ theo dõi kết nối) nhớ đích GỐC. Bộ đếm nhảy từ 0 lên 2 gói chính là các gói dò của nmap bị vứt. Cái giá: luật gõ tay biến mất ở lần khởi động lại kế tiếp nếu bạn không lưu nó (<code>iptables-persistent</code>), còn A và B nằm trong <code>compose.yaml</code> và đi theo mọi lần deploy.</p>
<table>
<tr><th>Cách</th><th>Sống qua reboot và deploy lại</th><th>Bạn vẫn vào DB được</th><th>Dùng khi</th></tr>
<tr><td>A. <code>127.0.0.1:</code></td><td>có (trong compose)</td><td>từ VPS hoặc qua đường hầm SSH</td><td>thỉnh thoảng cần psql / DBeaver</td></tr>
<tr><td>B. không <code>ports:</code></td><td>có (trong compose)</td><td>qua <code>docker compose exec db psql</code></td><td>mặc định cho cơ sở dữ liệu và bộ đệm</td></tr>
<tr><td>C. <code>DOCKER-USER</code></td><td>chỉ khi đã lưu</td><td>không đổi</td><td>vá khẩn trên máy đang chạy, hoặc luật theo IP nguồn</td></tr>
</table>

<h3>Tự quét máy mình từ một nơi khác</h3>
${slide('dv-12', 23, 'Tự quét máy mình từ máy khác: nmap -p- và -sV')}
<div class="out">$ nmap -Pn -p- vidu.test
Nmap scan report for vidu.test (172.22.0.3)
Host is up (0.0000070s latency).
rDNS record for 172.22.0.3: dv12-vps.dv12-net
Not shown: 65532 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
MAC Address: B2:6A:A8:47:D9:51 (Unknown)
Nmap done: 1 IP address (1 host up) scanned in 1.29 seconds
$ nmap -Pn -sV -p 22,80,443 vidu.test
22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.19 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     nginx 1.24.0 (Ubuntu)
443/tcp open  ssl/http nginx 1.24.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel</div>
<table>
<tr><th>nmap nói</th><th>Nghĩa là</th><th>Gặp ở đây</th></tr>
<tr><td><code>open</code></td><td>có thứ đang nghe VÀ tường lửa cho vào</td><td>22, 80, 443 trên VPS; 5432 qua Docker</td></tr>
<tr><td><code>closed</code></td><td>tới được, không ai nghe (máy trả RST)</td><td>65 532 cổng trên VPS</td></tr>
<tr><td><code>filtered</code></td><td>không có trả lời — tường lửa đã nuốt gói dò</td><td>6379 sau ufw; 5432 sau mỗi cách sửa</td></tr>
</table>
<table>
<tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>-Pn</code></td><td>Bỏ bước ping "máy có sống không"; cứ quét (nhiều VPS chặn ping).</td></tr>
<tr><td><code>-p 22,80</code> / <code>-p-</code></td><td>Những cổng này / cả 65 535 cổng.</td></tr>
<tr><td><code>-sV</code></td><td>Nói chuyện với từng cổng mở để đoán phần mềm và phiên bản.</td></tr>
</table>
<p>Quét từ một máy BÊN NGOÀI — một VPS thứ hai, máy của bạn bè có xin phép, điện thoại phát 4G — vì quét từ chính máy chủ sẽ đi qua loopback và vòng qua tường lửa. Ở đây mạng thí nghiệm đóng vai "bên ngoài". Dòng <code>-sV</code> còn cho thấy thứ ai cũng biết được: <code>nginx 1.24.0 (Ubuntu)</code>. <code>server_tokens off;</code> bỏ số phiên bản khỏi header và trang lỗi; nó không vá được gì, nó chỉ thôi quảng cáo cho người ta biết những lỗ hổng nào áp dụng cho bạn.</p>
<div class="callout danger"><strong>Chỉ quét máy của bạn, hoặc máy bạn có giấy phép kiểm thử.</strong> Quét máy chủ của người khác có thể phạm luật và vi phạm điều khoản của nhà cung cấp; nhà cung cấp VPS khoá tài khoản vì chuyện này.</div>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Một máy thí nghiệm có tường lửa và Docker riêng: <code>docker run -d --privileged --name dv12-fw -v dv12-dind:/var/lib/docker dv12-img sleep infinity</code>, rồi <code>docker exec -d dv12-fw dockerd</code>. Cái volume có tên là quan trọng: thiếu nó, Docker-trong-Docker hỏng với <code>failed to mount … fstype: overlay … invalid argument</code> (overlay chồng lên overlay) — đúng như lần thử đầu ở đây.</li>
<li>Bên trong: các lệnh ufw ở trên; <code>docker run -p 5432:5432 …</code>; <code>ss -tlnp</code>.</li>
<li>Từ một container khác trên cùng mạng: <code>nmap -Pn -p 5432,6379 &lt;ip&gt;</code>, rồi <code>psql</code>.</li>
<li>Áp dụng cách A, B hoặc C rồi quét lại. Xong thì <code>docker rm -f dv12-fw</code> — <code>--privileged</code> chỉ dành cho phòng thí nghiệm ngắn hạn.</li>
</ol>

<div class="pitfall co-tieu-de"><strong>Bẫy — lấy "tường lửa đang bật" làm bằng chứng cổng đã đóng.</strong> <code>ufw status</code> báo các luật ufw quản lý, không báo cái gì tới được. Với Docker, cổng đã publish vòng qua MỌI luật đó. Bằng chứng là một lần quét từ bên ngoài cho ra <code>filtered</code> hoặc <code>closed</code>. Cùng cái bẫy ấy có với security group trên cloud mà bạn tưởng đã gắn nhưng chưa, và với IPv6: ở đây <code>docker-proxy</code> còn nghe cả <code>[::]:5432</code>, nên nếu VPS có IPv6 công khai thì kiểm cả hai họ địa chỉ.</div>

<h3>Trên macOS và Windows: laptop của bạn cũng publish</h3>
<p>Cùng thói quen <code>-p</code> đó làm lộ dịch vụ trên chính laptop. Trên Mac M1 với Docker Desktop 29.8.0:</p>
<div class="out">$ docker run -d -p 19129:80 nginx:1.27-alpine
$ lsof -nP -iTCP:19129 -sTCP:LISTEN
COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
com.docke 15848 admin  277u  IPv6 0xd4eaacd3eaf3a556      0t0  TCP *:19129 (LISTEN)
$ docker run -d -p 127.0.0.1:19129:80 nginx:1.27-alpine
COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
com.docke 15848 admin  274u  IPv4 0xd4eaacd3eaf3a556      0t0  TCP 127.0.0.1:19129 (LISTEN)</div>
<p><code>*:19129</code> nghĩa là mọi giao diện mạng — kể cả Wi-Fi quán cà phê, trừ khi tường lửa macOS chặn Docker. Với <code>127.0.0.1:</code> thì chỉ máy bạn. Trên Windows, Docker Desktop và WSL cư xử y như vậy và Windows Defender Firewall có thể hỏi một lần; cách sửa vẫn là cái tiền tố đó. macOS không có <code>ss</code> — dùng <code>lsof -nP -iTCP -sTCP:LISTEN</code>; Windows dùng <code>netstat -ano | findstr LISTENING</code> hoặc <code>Get-NetTCPConnection -State Listen</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tệp compose của nhóm có <code>ports: ["5432:5432", "6379:6379"]</code> "để debug cho tiện". Chứng minh cho cả nhóm thấy, trên phòng thí nghiệm, rằng ufw không bảo vệ những cổng đó, rồi đưa ra bản sửa.</p>
<ol>
<li>Chạy <code>dv12-fw</code> (privileged, volume cho <code>/var/lib/docker</code>, <code>dockerd</code> bên trong). Bật ufw chỉ với 22/80/443.</li>
<li>Chạy Postgres với <code>-p 5432:5432</code>. Từ một container khác, <code>nmap -Pn -p 5432</code> rồi đăng nhập bằng <code>psql</code>.</li>
<li>Đọc <code>iptables -t nat -L DOCKER -n</code> và mấy dòng đầu của <code>FORWARD</code>; chỉ ra luật nào để gói tin đi qua.</li>
<li>Tạo lại cơ sở dữ liệu với <code>127.0.0.1:5432:5432</code>, rồi không <code>-p</code> trên một mạng riêng. Quét lại sau mỗi lần.</li>
</ol>
<p><strong>Đạt khi:</strong> sổ ghi của bạn có <code>open</code> rồi <code>filtered</code> cho 5432, và một bản diff compose trong đó cơ sở dữ liệu không còn <code>ports:</code>, còn app thì có <code>127.0.0.1:</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Listening address (địa chỉ nghe)</span><span class="v"><code>0.0.0.0</code>/<code>[::]</code> = mọi giao diện; <code>127.0.0.1</code> = chỉ máy này.</span></div>
  <div class="kv"><span class="k">Publish (<code>-p</code>, <code>ports:</code> — mở cổng container ra máy)</span><span class="v">Docker làm cho cổng của container tới được từ máy chủ, bằng DNAT và docker-proxy.</span></div>
  <div class="kv"><span class="k">DNAT (đổi địa chỉ đích)</span><span class="v">Viết lại địa chỉ/cổng đích của gói tin — cách Docker đẩy lưu lượng vào container.</span></div>
  <div class="kv"><span class="k">Chuỗi INPUT / FORWARD</span><span class="v">Gói gửi cho máy này / gói được chuyển đi nơi khác (kể cả vào container).</span></div>
  <div class="kv"><span class="k"><code>DOCKER-USER</code></span><span class="v">Chuỗi Docker xét đầu tiên và để yên — chỗ cho luật riêng của bạn với cổng đã publish.</span></div>
  <div class="kv"><span class="k">open / closed / filtered (mở / đóng / bị lọc)</span><span class="v">Ba câu trả lời của nmap: có người nghe / không ai nghe / tường lửa nuốt gói dò.</span></div>
  <div class="kv"><span class="k">SSH tunnel (đường hầm SSH, <code>ssh -L</code>)</span><span class="v">Tới một cổng chỉ-loopback trên máy chủ từ laptop, đi xuyên qua SSH.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một VPS web chỉ cần 22, 80 và 443 tới được; app và cơ sở dữ liệu nghe 127.0.0.1 hoặc một mạng riêng.</li>
<li><code>ss -tlnp</code> sau mỗi thay đổi cho thấy cái gì nghe ở đâu — nó bắt được một 0.0.0.0:8080 thừa ngay trong phòng thí nghiệm này.</li>
<li>Cổng Docker publish vòng qua ufw: đo được, Postgres mở và đăng nhập được trong khi ufw từ chối mọi thứ khác.</li>
<li>Lý do là DNAT ở PREROUTING đẩy gói sang FORWARD, nơi chuỗi của Docker chấp nhận nó trước chuỗi của ufw.</li>
<li>Sửa bằng <code>127.0.0.1:</code>, không <code>ports:</code> gì cả, hoặc một luật <code>DOCKER-USER</code> đã lưu dùng <code>--ctorigdstport</code>.</li>
<li>Chứng minh bằng một lần quét từ bên ngoài; chỉ quét máy của mình.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Lọc gói tin và tường lửa</span><span class="lc-sub">docs.docker.com/engine/network/packet-filtering-firewalls — tuyên bố chính thức rằng cổng đã publish vòng qua ufw, và chuỗi DOCKER-USER.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — Publish cổng</span><span class="lc-sub">docs.docker.com/engine/network/port-publishing — gắn vào một địa chỉ cụ thể như 127.0.0.1.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">ufw(8)</span><span class="lc-sub">manpages.ubuntu.com/manpages/noble/man8/ufw.8.html — mặc định, cú pháp luật, lưu lượng chuyển tiếp.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">ss(8)</span><span class="lc-sub">man7.org/linux/man-pages/man8/ss.8.html — mọi cờ và bộ lọc.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nmap — Căn bản về quét cổng</span><span class="lc-sub">nmap.org/book/man-port-scanning-basics.html — open, closed và filtered thật ra nghĩa là gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — mạng và Compose</span><span class="lc-sub">/courses/docker/learn${REF} — mạng tự tạo và tên dịch vụ, nền của cách B.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: "12.4 — CDNs and static files: cache headers, renaming on change, and object storage|||12.4 — CDN và tệp tĩnh: header cache, đổi tên khi đổi nội dung, và kho object",
      slug: "deploy-12-4-cdn-tep-tinh",
      type: "LESSON",
      isFreePreview: true,
      description: "Cache-Control cho HTML và cho tệp có mã băm, một CDN thu nhỏ để thấy MISS rồi HIT, ghi đè cùng tên thì CDN phát bản cũ (chuyện ảnh slide phải lên v2), nginx nuốt header của Next, Cloudflare cache gì mặc định, và vì sao ảnh người dùng thuộc về kho object.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>CDNs and static files: cache headers, renaming on change, and object storage</h2>
<p class="lead">Two true stories from the project this course is built on. The slide images in this very course sit on a CDN with a one-year immutable cache, and the rule in its code says: if you rebuild a deck that was already uploaded, upload it under a new prefix (<code>v2</code>), never over the old one — because the CDN will keep serving the old bytes. And on 23/08/2026 it turned out that a cache header set in <code>next.config.js</code> for 94&nbsp;MB of 3D assets had never been in effect for a single day, because nginx removed it. This lesson rebuilds both in the lab, with a small CDN you can watch saying MISS and HIT.</p>

<h3>Why cache at all</h3>
<p>Every byte your VPS sends costs CPU, bandwidth and, on a 6&nbsp;GB machine, memory that the database would rather have. Most bytes on a web page never change between deploys — JavaScript bundles, CSS, fonts, images. If a browser or a CDN edge keeps them, the VPS only answers for HTML and API calls. The whole game is telling every cache, correctly, what it may keep and for how long — with the <code>Cache-Control</code> header. The mechanics of ETag, conditional requests and <code>expires</code> in nginx are measured in the Nginx course, Chapter 4; this lesson is about the deploy-time consequences.</p>

<h3>Two kinds of file, two policies</h3>
${slide('dv-12', 24, 'HTML no-cache, tệp có mã băm immutable một năm')}
<pre><code class="language-nginx">server {
    listen 8080;
    root /var/www/site;
    location = /index.html { add_header Cache-Control "no-cache"; }
    location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8080/index.html
HTTP/1.1 200 OK
Last-Modified: Tue, 29 Sep 2026 07:39:43 GMT
ETag: "6abb6b3f-32"
Cache-Control: no-cache
$ curl -sI http://127.0.0.1:8080/assets/app.3f9a1c.js
HTTP/1.1 200 OK
Last-Modified: Tue, 29 Sep 2026 07:39:43 GMT
ETag: "6abb6b3f-f"
Cache-Control: public, max-age=31536000, immutable</div>
<p>(The commands were piped through <code>grep -iE "^HTTP|cache-control|etag|last-mod"</code> to keep only these lines.)</p>
<table>
<tr><th>Directive</th><th>Meaning</th></tr>
<tr><td><code>no-cache</code></td><td>You may store it, but must check with the origin before every reuse (a cheap 304 if unchanged). <strong>Not</strong> "do not cache".</td></tr>
<tr><td><code>no-store</code></td><td>Do not store at all. For private data; wasteful for anything public.</td></tr>
<tr><td><code>max-age=N</code></td><td>Fresh for N seconds; reused without asking. 31 536 000 = one year.</td></tr>
<tr><td><code>immutable</code></td><td>Will never change while fresh — browsers skip revalidation even on reload.</td></tr>
<tr><td><code>public</code> / <code>private</code></td><td>Shared caches (CDN) may store it / only the user's browser may.</td></tr>
<tr><td><code>s-maxage=N</code></td><td>Like max-age, but only for shared caches — lets the CDN keep something longer than browsers.</td></tr>
</table>
<p>The rule that makes a year-long cache safe: <strong>a file whose content can change must change its name when it does</strong>. Build tools do this for you — Next.js puts a content hash in every file under <code>/_next/static/</code>, Vite in <code>assets/</code> — which is why those can be cached forever. HTML cannot be renamed (users type <code>/</code>), so HTML is <code>no-cache</code>: always revalidated, and it is the HTML that points to the new hashed names after a deploy.</p>
<table>
<tr><th>File</th><th>Policy</th></tr>
<tr><td>HTML (<code>/</code>, pages)</td><td><code>no-cache</code> — or a short <code>s-maxage</code> at the CDN if you accept brief staleness</td></tr>
<tr><td>Hashed JS/CSS/fonts</td><td><code>public, max-age=31536000, immutable</code></td></tr>
<tr><td>User uploads with random keys</td><td>long <code>max-age</code>; a key never gets new content</td></tr>
<tr><td>API responses with user data</td><td><code>private</code> or <code>no-store</code></td></tr>
</table>

<h3>A small CDN in the lab: MISS, then HIT</h3>
${slide('dv-12', 25, 'CDN đứng giữa người dùng và VPS: lần đầu MISS, lần sau HIT')}
<p>A CDN edge is, at heart, a caching reverse proxy near the user. nginx with <code>proxy_cache</code> behaves the same way for this purpose — it stores what the origin's <code>Cache-Control</code> allows, and <code>$upstream_cache_status</code> tells you what happened:</p>
<pre><code class="language-nginx">proxy_cache_path /var/cache/cdn keys_zone=cdn:10m max_size=100m inactive=7d;
server {
    listen 80;
    location / {
        proxy_pass http://dv12-vps:8080;
        proxy_cache cdn;                                  # ton trong Cache-Control cua goc
        add_header X-Cache-Status $upstream_cache_status;
    }
}</code></pre>
<pre><code class="language-bash"># each request below is: curl -s -D- http://cdn.test$URL | grep -iE "^HTTP|x-cache|^ANH|ban [0-9]"</code></pre>
<div class="out">$ curl -s -D- http://cdn.test/slides/v1/005.webp
HTTP/1.1 200 OK
X-Cache-Status: MISS
ANH SLIDE 5 - ban cu (co loi chinh ta)
$ curl -s -D- http://cdn.test/slides/v1/005.webp
HTTP/1.1 200 OK
X-Cache-Status: HIT
ANH SLIDE 5 - ban cu (co loi chinh ta)
# HTML no-cache
$ curl -s -D- http://cdn.test/index.html
HTTP/1.1 200 OK
X-Cache-Status: MISS
&lt;script src=/assets/app.3f9a1c.js&gt;&lt;/script&gt; ban 1
$ curl -s -D- http://cdn.test/index.html
HTTP/1.1 200 OK
X-Cache-Status: MISS
&lt;script src=/assets/app.3f9a1c.js&gt;&lt;/script&gt; ban 1</div>
<p>The image: MISS (fetched from the origin), then HIT (served from the edge; the origin never saw the second request). The HTML: MISS twice — nginx's cache does not store a <code>no-cache</code> response at all, so every request goes to the origin. That is the behaviour you want for HTML. Real CDNs differ in detail, so read their rules; Cloudflare's documentation (read 29/09/2026) says it does not cache HTML or JSON by default, caches by file extension (js, css, png, webp, fonts, video…), does not cache when the origin sends <code>private</code>, <code>no-store</code>, <code>no-cache</code> or <code>max-age=0</code>, and when the origin sends no cache header at all keeps a 200 for 120 minutes. Its equivalent of <code>X-Cache-Status</code> is the <code>cf-cache-status</code> response header.</p>

<h3>Same name, new content: the CDN serves the old bytes</h3>
${slide('dv-12', 26, 'Ghi đè cùng tên: gốc đã mới, CDN vẫn HIT bản cũ; tiền tố v2 thì MISS bản mới')}
<div class="out"># deploy: sua anh, GIU TEN
$ curl -s http://127.0.0.1:8080/slides/v1/005.webp   # goc
ANH SLIDE 5 - ban moi (da sua)
$ curl -s -D- http://cdn.test/slides/v1/005.webp
HTTP/1.1 200 OK
X-Cache-Status: HIT
ANH SLIDE 5 - ban cu (co loi chinh ta)
# sua dung: day len tien to moi v2
$ curl -s -D- http://cdn.test/slides/v2/005.webp
HTTP/1.1 200 OK
X-Cache-Status: MISS
ANH SLIDE 5 - ban moi (da sua)</div>
<p>The origin has the corrected image; the edge keeps answering HIT with the old one, correctly — the origin promised, with <code>immutable</code> and a year of <code>max-age</code>, that the bytes behind that name would never change. The same promise was made to every browser that already downloaded it. This is exactly why this course's slide helper (<code>content/courses/deploy-vps/_slides.mjs</code>) says that Cloudflare keeps serving the old bytes for an overwritten key, and that a rebuilt deck must go to a new prefix (<code>DV/v2</code>) with the deck listed in <code>VER</code>.</p>
<table>
<tr><th>Fix</th><th>What it achieves</th></tr>
<tr><td>New name or prefix (<code>v2</code>, a content hash)</td><td>Instant, at every edge and in every browser, with no API call. The only complete fix.</td></tr>
<tr><td>Purge at the CDN</td><td>Removes the edge copy. Browsers that stored an <code>immutable</code> copy keep it anyway.</td></tr>
<tr><td>Wait</td><td>31 536 000 seconds.</td></tr>
</table>
<p>And the HTML side of a deploy, measured on the same CDN: the new <code>index.html</code> points at a new bundle name, and because HTML is never cached it appears on the first request after the deploy:</p>
<div class="out">$ curl -s -D- http://cdn.test/index.html
HTTP/1.1 200 OK
X-Cache-Status: MISS
&lt;script src=/assets/app.8b2e7d.js&gt;&lt;/script&gt; ban 2</div>

<div class="pitfall co-tieu-de"><strong>Trap — overwriting a long-cached file and trusting a purge.</strong> "I uploaded the fixed file and purged the CDN, but some users still see the old one" is not a CDN bug. <code>immutable</code> told their browsers never to ask again, and a purge cannot reach inside a browser. If content can change, the name must change: hash in the filename, a version prefix, or a <code>?v=</code> query that the CDN is configured to include in its cache key. Keep old names around for a while after a deploy, too: a page loaded before the deploy may still request the previous bundle.</div>

<h3>When nginx swallows the header the app set</h3>
${slide('dv-12', 27, 'proxy_hide_header gỡ Cache-Control của app rồi dán no-store — chuyện thật 23/08')}
<p>The app (here a stand-in on <code>127.0.0.1:3000</code>) sets a correct, year-long header for its hashed files, as Next.js does for <code>/_next/static/</code>. The nginx in front was configured the way this project's <code>location /</code> once was:</p>
<pre><code class="language-nginx">location /_next/ {                       # ban SAI: nuot header cua app
    proxy_pass http://127.0.0.1:3000;
    proxy_hide_header Cache-Control;
    add_header Cache-Control "no-store";
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:3000/_next/static/chunk.js   # app noi
HTTP/1.0 200 OK
Cache-Control: public, max-age=31536000, immutable
$ curl -sI http://127.0.0.1:8080/_next/static/chunk.js   # qua nginx
HTTP/1.1 200 OK
Cache-Control: no-store</div>
<p>The application logs, tests and <code>next.config.js</code> all say "cached for a year". Users get <code>no-store</code> and download everything on every navigation. On cuongthai.com, 23/08/2026: <code>next.config.js</code> declared a week of caching for <code>/playground/**</code> (94&nbsp;MB), and it had never taken effect — <code>location /</code> in nginx.conf hid the header and put <code>no-store</code> on every response, taking the caching of all of <code>public/</code> with it. The project's rule since then: nginx wins over Next, always. The fix is a separate location that passes the app's header through untouched:</p>
<pre><code class="language-nginx">location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;    # no proxy_hide_header here
}</code></pre>
<p>And the check is always the same: <code>curl -I</code> through the <strong>front door</strong> — the real domain, through the CDN — never the app's config.</p>

<h3>User uploads belong in object storage</h3>
${slide('dv-12', 28, 'Ảnh người dùng: trình duyệt PUT thẳng vào R2/S3, CDN phục vụ, VPS chỉ ký URL')}
<table>
<tr><th>Uploads on the VPS disk</th><th>Uploads in object storage (S3, Cloudflare R2…)</th></tr>
<tr><td>Share the disk with Postgres: when it fills, the database dies with it (this project's disk-full incident on 18/08 was build cache, but the mechanism is the same)</td><td>Capacity is not your problem; you pay per GB stored</td></tr>
<tr><td>Every view costs VPS bandwidth and CPU</td><td>Served by a CDN in front of the bucket (<code>media.cuongthai.com</code> is proxied, 12.1)</td></tr>
<tr><td>Moving to a new VPS or adding a second one means copying them (Chapter 14)</td><td>Every server reads the same bucket</td></tr>
<tr><td>Backed up with code and database</td><td>Need their own backup or versioning — a deleted object is gone</td></tr>
</table>
<p>The usual shape: the browser asks the API for a <strong>presigned URL</strong> (a URL that allows one upload to one key for a few minutes), PUTs the file straight to the bucket, and the API stores only the key in the database. Keys are random and never reused, so the CDN can cache them for a year without the problem above. The VPS never touches the bytes.</p>

<h3>Try it step by step</h3>
<ol>
<li>On the lab VPS, an origin on <code>:8080</code> with the two <code>location</code> policies; check both with <code>curl -I</code>.</li>
<li>A second container running nginx with <code>proxy_cache</code> and <code>X-Cache-Status</code>, pointing at the origin.</li>
<li>Request an image twice (MISS, HIT). Overwrite it on the origin; request again (still HIT, old content). Copy it under <code>v2/</code>; request that (MISS, new).</li>
<li>Add the wrong <code>/_next/</code> block, compare <code>curl -I</code> on <code>:3000</code> and <code>:8080</code>, then fix it.</li>
</ol>

<h3>On Windows and macOS</h3>
<p>Your browser is the first cache. In DevTools → Network, "Disable cache" (only while DevTools is open) and the Size column ("memory cache", "disk cache") show what happened; a hard reload (Cmd+Shift+R / Ctrl+Shift+R) revalidates but still honours <code>immutable</code> in some browsers. In Windows PowerShell 5.1, <code>curl</code> is an alias for <code>Invoke-WebRequest</code> and does not understand <code>-I</code> — call <code>curl.exe -I</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after the SWP391 team fixes a typo in the logo and deploys, half the class still sees the old logo, and someone suggests "just purge the cache". Show on the lab why that is not enough and what to do instead.</p>
<ol>
<li>Build the origin with <code>no-cache</code> for HTML and <code>immutable</code> for <code>/assets/</code>, and the <code>proxy_cache</code> CDN in front.</li>
<li>Serve <code>logo.png</code> under <code>/assets/</code>, request it twice through the CDN, overwrite it, request again.</li>
<li>Publish the fix as <code>logo.2b7c.png</code>, update <code>index.html</code> to reference it, and request <code>index.html</code> and the new logo through the CDN.</li>
<li>Add a <code>location</code> with <code>proxy_hide_header Cache-Control</code> in front of an app that sets it, and catch it with <code>curl -I</code>.</li>
</ol>
<p><strong>Done when:</strong> you have a HIT with old content after the overwrite, a MISS with new content under the new name, the new HTML on the first request, and a before/after <code>curl -I</code> of the swallowed header.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CDN edge</span><span class="v">A caching server near users that answers from its copy and asks the origin only on a miss.</span></div>
  <div class="kv"><span class="k">Origin</span><span class="v">Where the CDN fetches from — your VPS or a storage bucket.</span></div>
  <div class="kv"><span class="k">Cache-Control</span><span class="v">The header that tells browsers and CDNs what they may keep and for how long.</span></div>
  <div class="kv"><span class="k"><code>no-cache</code> vs <code>no-store</code></span><span class="v">Store but revalidate every time / never store.</span></div>
  <div class="kv"><span class="k"><code>immutable</code></span><span class="v">A promise that the bytes behind this URL never change while fresh.</span></div>
  <div class="kv"><span class="k">Content hash / cache busting</span><span class="v">Putting a hash or version in the file name so new content gets a new URL.</span></div>
  <div class="kv"><span class="k">Purge</span><span class="v">Deleting an object from the CDN's cache; does not reach browsers.</span></div>
  <div class="kv"><span class="k">Presigned URL</span><span class="v">A time-limited URL that lets a browser upload one object straight to storage.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>HTML is <code>no-cache</code>; hashed assets are <code>public, max-age=31536000, immutable</code>.</li>
<li>A long cache is safe only if new content always gets a new name — measured: an overwritten image stayed HIT with the old bytes.</li>
<li>A purge clears the CDN, not the browsers that were told <code>immutable</code>.</li>
<li>Cloudflare does not cache HTML by default and caches by file extension; read <code>cf-cache-status</code>.</li>
<li>nginx can silently replace the app's header — check with <code>curl -I</code> through the front door.</li>
<li>User uploads go to object storage via presigned URLs, served by a CDN, with random keys that never change.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Cache-Control</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control — every directive, with browser behaviour.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 — HTTP Caching</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc9111 — the standard both browsers and CDNs follow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Default cache behavior</span><span class="lc-sub">developers.cloudflare.com/cache/concepts/default-cache-behavior — what is cached without any rules.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Purge cache</span><span class="lc-sub">developers.cloudflare.com/cache/how-to/purge-cache — what a purge can and cannot do.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2</span><span class="lc-sub">developers.cloudflare.com/r2 — S3-compatible object storage, presigned URLs, public buckets behind a domain.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — static files, ETag and caching</span><span class="lc-sub">/courses/nginx/learn${REF} — Chapter 4 measures ETag, conditional requests and expires.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>CDN và tệp tĩnh: header cache, đổi tên khi đổi nội dung, và kho object</h2>
<p class="lead">Hai chuyện thật từ chính dự án khoá học này dựng trên đó. Ảnh slide của khoá học này nằm trên một CDN với cache bất biến (immutable) một năm, và luật trong mã của nó ghi: dựng lại một bộ slide đã đẩy lên thì đẩy sang một tiền tố MỚI (<code>v2</code>), đừng bao giờ ghi đè lên cái cũ — vì CDN sẽ cứ phát byte cũ. Và ngày 23/08/2026 mới lộ ra rằng một header cache đặt trong <code>next.config.js</code> cho 94&nbsp;MB tài nguyên 3D CHƯA TỪNG có hiệu lực một ngày nào, vì nginx đã gỡ nó đi. Bài này dựng lại cả hai trong phòng thí nghiệm, với một CDN thu nhỏ mà bạn nhìn được nó nói MISS rồi HIT.</p>

<h3>Vì sao phải cache</h3>
<p>Mỗi byte VPS gửi đi tốn CPU, băng thông, và — trên một máy 6&nbsp;GB — bộ nhớ mà cơ sở dữ liệu thèm hơn. Phần lớn byte trên một trang web không đổi giữa các lần deploy — gói JavaScript, CSS, phông chữ, ảnh. Nếu trình duyệt hay một điểm biên (edge) của CDN giữ chúng lại, VPS chỉ còn phải trả lời HTML và API. Toàn bộ cuộc chơi là nói ĐÚNG cho mọi bộ đệm biết chúng được giữ cái gì và giữ bao lâu — bằng header <code>Cache-Control</code>. Cơ chế ETag, request có điều kiện và <code>expires</code> trong nginx được đo ở khoá Nginx, Chương 4; bài này nói về hệ quả của chúng lúc deploy.</p>

<h3>Hai loại tệp, hai chính sách</h3>
${slide('dv-12', 24, 'HTML no-cache, tệp có mã băm immutable một năm')}
<pre><code class="language-nginx">server {
    listen 8080;
    root /var/www/site;
    location = /index.html { add_header Cache-Control "no-cache"; }
    location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:8080/index.html
HTTP/1.1 200 OK
Last-Modified: Tue, 29 Sep 2026 07:39:43 GMT
ETag: "6abb6b3f-32"
Cache-Control: no-cache
$ curl -sI http://127.0.0.1:8080/assets/app.3f9a1c.js
HTTP/1.1 200 OK
Last-Modified: Tue, 29 Sep 2026 07:39:43 GMT
ETag: "6abb6b3f-f"
Cache-Control: public, max-age=31536000, immutable</div>
<p>(Các lệnh được lọc qua <code>grep -iE "^HTTP|cache-control|etag|last-mod"</code> để chỉ giữ những dòng này.)</p>
<table>
<tr><th>Chỉ thị</th><th>Nghĩa</th></tr>
<tr><td><code>no-cache</code></td><td>Được lưu, nhưng phải hỏi lại gốc trước MỖI lần dùng lại (một cú 304 rẻ nếu không đổi). <strong>Không</strong> có nghĩa là "đừng cache".</td></tr>
<tr><td><code>no-store</code></td><td>Tuyệt đối không lưu. Cho dữ liệu riêng tư; lãng phí với mọi thứ công khai.</td></tr>
<tr><td><code>max-age=N</code></td><td>Còn tươi trong N giây; được dùng lại mà không hỏi. 31 536 000 = một năm.</td></tr>
<tr><td><code>immutable</code></td><td>Sẽ không bao giờ đổi khi còn tươi — trình duyệt bỏ qua việc hỏi lại kể cả khi bấm tải lại.</td></tr>
<tr><td><code>public</code> / <code>private</code></td><td>Bộ đệm dùng chung (CDN) được lưu / chỉ trình duyệt của người dùng được lưu.</td></tr>
<tr><td><code>s-maxage=N</code></td><td>Như max-age nhưng chỉ cho bộ đệm dùng chung — cho CDN giữ lâu hơn trình duyệt.</td></tr>
</table>
<p>Luật khiến một bộ đệm dài cả năm trở nên an toàn: <strong>tệp nào có thể đổi nội dung thì phải đổi TÊN khi nó đổi</strong>. Công cụ build làm hộ bạn — Next.js gắn mã băm nội dung vào mọi tệp dưới <code>/_next/static/</code>, Vite trong <code>assets/</code> — nên những tệp đó cache mãi mãi được. HTML thì không đổi tên được (người dùng gõ <code>/</code>), nên HTML là <code>no-cache</code>: luôn được hỏi lại, và chính HTML trỏ tới những cái tên băm mới sau một lần deploy.</p>
<table>
<tr><th>Tệp</th><th>Chính sách</th></tr>
<tr><td>HTML (<code>/</code>, các trang)</td><td><code>no-cache</code> — hoặc một <code>s-maxage</code> ngắn ở CDN nếu bạn chấp nhận cũ trong chốc lát</td></tr>
<tr><td>JS/CSS/phông chữ có mã băm</td><td><code>public, max-age=31536000, immutable</code></td></tr>
<tr><td>Tệp người dùng tải lên, khoá ngẫu nhiên</td><td><code>max-age</code> dài; một khoá không bao giờ nhận nội dung mới</td></tr>
<tr><td>Phản hồi API có dữ liệu người dùng</td><td><code>private</code> hoặc <code>no-store</code></td></tr>
</table>

<h3>Một CDN thu nhỏ trong phòng thí nghiệm: MISS, rồi HIT</h3>
${slide('dv-12', 25, 'CDN đứng giữa người dùng và VPS: lần đầu MISS, lần sau HIT')}
<p>Một điểm biên CDN, về bản chất, là một reverse proxy có bộ đệm đặt gần người dùng. nginx với <code>proxy_cache</code> cư xử y hệt cho mục đích này — nó lưu những gì <code>Cache-Control</code> của gốc cho phép, và <code>$upstream_cache_status</code> cho bạn biết chuyện gì đã xảy ra:</p>
<pre><code class="language-nginx">proxy_cache_path /var/cache/cdn keys_zone=cdn:10m max_size=100m inactive=7d;
server {
    listen 80;
    location / {
        proxy_pass http://dv12-vps:8080;
        proxy_cache cdn;                                  # ton trong Cache-Control cua goc
        add_header X-Cache-Status $upstream_cache_status;
    }
}</code></pre>
<pre><code class="language-bash"># mỗi request dưới đây là: curl -s -D- http://cdn.test$URL | grep -iE "^HTTP|x-cache|^ANH|ban [0-9]"</code></pre>
<div class="out">$ curl -s -D- http://cdn.test/slides/v1/005.webp
HTTP/1.1 200 OK
X-Cache-Status: MISS
ANH SLIDE 5 - ban cu (co loi chinh ta)
$ curl -s -D- http://cdn.test/slides/v1/005.webp
HTTP/1.1 200 OK
X-Cache-Status: HIT
ANH SLIDE 5 - ban cu (co loi chinh ta)
# HTML no-cache
$ curl -s -D- http://cdn.test/index.html
HTTP/1.1 200 OK
X-Cache-Status: MISS
&lt;script src=/assets/app.3f9a1c.js&gt;&lt;/script&gt; ban 1
$ curl -s -D- http://cdn.test/index.html
HTTP/1.1 200 OK
X-Cache-Status: MISS
&lt;script src=/assets/app.3f9a1c.js&gt;&lt;/script&gt; ban 1</div>
<p>Cái ảnh: MISS (lấy từ gốc), rồi HIT (phát từ điểm biên; gốc không hề thấy request thứ hai). Cái HTML: MISS cả hai lần — bộ đệm của nginx không lưu phản hồi <code>no-cache</code> nào cả, nên mọi request đều về gốc. Đó đúng là hành vi bạn muốn cho HTML. CDN thật khác nhau ở chi tiết, nên hãy đọc luật của họ; tài liệu của Cloudflare (đọc ngày 29/09/2026) nói: mặc định KHÔNG cache HTML hay JSON, cache theo ĐUÔI tệp (js, css, png, webp, phông chữ, video…), không cache khi gốc gửi <code>private</code>, <code>no-store</code>, <code>no-cache</code> hoặc <code>max-age=0</code>, và khi gốc không gửi header cache nào thì giữ phản hồi 200 trong 120 phút. Thứ tương đương <code>X-Cache-Status</code> của họ là header <code>cf-cache-status</code>.</p>

<h3>Cùng tên, nội dung mới: CDN phát byte cũ</h3>
${slide('dv-12', 26, 'Ghi đè cùng tên: gốc đã mới, CDN vẫn HIT bản cũ; tiền tố v2 thì MISS bản mới')}
<div class="out"># deploy: sua anh, GIU TEN
$ curl -s http://127.0.0.1:8080/slides/v1/005.webp   # goc
ANH SLIDE 5 - ban moi (da sua)
$ curl -s -D- http://cdn.test/slides/v1/005.webp
HTTP/1.1 200 OK
X-Cache-Status: HIT
ANH SLIDE 5 - ban cu (co loi chinh ta)
# sua dung: day len tien to moi v2
$ curl -s -D- http://cdn.test/slides/v2/005.webp
HTTP/1.1 200 OK
X-Cache-Status: MISS
ANH SLIDE 5 - ban moi (da sua)</div>
<p>Gốc đã có ảnh đã sửa; điểm biên vẫn trả HIT với ảnh cũ, và nó ĐÚNG — gốc đã hứa, bằng <code>immutable</code> và <code>max-age</code> một năm, rằng byte đứng sau cái tên đó sẽ không bao giờ đổi. Lời hứa đó cũng đã được đưa cho mọi trình duyệt đã tải nó về. Đó chính xác là lý do hàm nhúng slide của khoá học này (<code>content/courses/deploy-vps/_slides.mjs</code>) ghi rằng Cloudflare vẫn phục vụ byte cũ cho một khoá bị ghi đè, và một bộ slide dựng lại phải đi sang tiền tố mới (<code>DV/v2</code>) kèm tên bộ trong <code>VER</code>.</p>
<table>
<tr><th>Cách sửa</th><th>Được gì</th></tr>
<tr><td>Tên hoặc tiền tố mới (<code>v2</code>, mã băm nội dung)</td><td>Tức thì, ở mọi điểm biên và mọi trình duyệt, không cần gọi API nào. Cách sửa TRỌN VẸN duy nhất.</td></tr>
<tr><td>Purge (xoá bộ đệm) trên CDN</td><td>Xoá bản ở điểm biên. Trình duyệt đã lưu bản <code>immutable</code> thì vẫn giữ.</td></tr>
<tr><td>Chờ</td><td>31 536 000 giây.</td></tr>
</table>
<p>Còn phía HTML của một lần deploy, đo trên cùng CDN đó: <code>index.html</code> mới trỏ tới một tên gói mới, và vì HTML không bao giờ bị cache nên nó hiện ra ngay ở request đầu tiên sau deploy:</p>
<div class="out">$ curl -s -D- http://cdn.test/index.html
HTTP/1.1 200 OK
X-Cache-Status: MISS
&lt;script src=/assets/app.8b2e7d.js&gt;&lt;/script&gt; ban 2</div>

<div class="pitfall co-tieu-de"><strong>Bẫy — ghi đè một tệp đã cache dài rồi tin vào purge.</strong> "Em đã tải bản sửa lên và purge CDN rồi mà vẫn có người thấy bản cũ" không phải lỗi của CDN. <code>immutable</code> đã bảo trình duyệt của họ đừng bao giờ hỏi lại, và purge không với vào trong trình duyệt được. Nội dung đổi được thì TÊN phải đổi: mã băm trong tên tệp, một tiền tố phiên bản, hoặc một <code>?v=</code> mà CDN được cấu hình để đưa vào khoá cache. Và giữ tên cũ thêm một thời gian sau deploy: một trang đã tải trước lúc deploy vẫn có thể xin gói trước đó.</div>

<h3>Khi nginx nuốt mất header app đã đặt</h3>
${slide('dv-12', 27, 'proxy_hide_header gỡ Cache-Control của app rồi dán no-store — chuyện thật 23/08')}
<p>App (ở đây là một bản đóng thế ở <code>127.0.0.1:3000</code>) đặt header đúng, dài cả năm, cho các tệp có mã băm, y như Next.js làm với <code>/_next/static/</code>. nginx đứng trước được cấu hình theo đúng kiểu <code>location /</code> của dự án này từng có:</p>
<pre><code class="language-nginx">location /_next/ {                       # ban SAI: nuot header cua app
    proxy_pass http://127.0.0.1:3000;
    proxy_hide_header Cache-Control;
    add_header Cache-Control "no-store";
}</code></pre>
<div class="out">$ curl -sI http://127.0.0.1:3000/_next/static/chunk.js   # app noi
HTTP/1.0 200 OK
Cache-Control: public, max-age=31536000, immutable
$ curl -sI http://127.0.0.1:8080/_next/static/chunk.js   # qua nginx
HTTP/1.1 200 OK
Cache-Control: no-store</div>
<p>Log của app, bài kiểm thử và <code>next.config.js</code> đều nói "cache một năm". Người dùng nhận <code>no-store</code> và tải lại mọi thứ ở mỗi lần chuyển trang. Trên cuongthai.com, ngày 23/08/2026: <code>next.config.js</code> khai cache một tuần cho <code>/playground/**</code> (94&nbsp;MB), và quy tắc đó CHƯA TỪNG có hiệu lực — <code>location /</code> trong nginx.conf giấu header đi rồi dán <code>no-store</code> lên mọi phản hồi, kéo theo cả việc cache toàn bộ <code>public/</code>. Luật của dự án từ đó: nginx thắng Next, luôn luôn. Cách sửa là một <code>location</code> riêng để header của app đi qua nguyên vẹn:</p>
<pre><code class="language-nginx">location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;    # không có proxy_hide_header ở đây
}</code></pre>
<p>Và phép kiểm lúc nào cũng vậy: <code>curl -I</code> qua <strong>CỬA TRƯỚC</strong> — tên miền thật, đi qua CDN — không bao giờ đọc cấu hình của app mà tin.</p>

<h3>Tệp người dùng tải lên thuộc về kho object</h3>
${slide('dv-12', 28, 'Ảnh người dùng: trình duyệt PUT thẳng vào R2/S3, CDN phục vụ, VPS chỉ ký URL')}
<table>
<tr><th>Để tệp tải lên trên đĩa VPS</th><th>Để trong kho object (S3, Cloudflare R2…)</th></tr>
<tr><td>Chung đĩa với Postgres: đĩa đầy là cơ sở dữ liệu chết theo (sự cố đĩa đầy 18/08 của dự án này là do cache build, nhưng cơ chế y hệt)</td><td>Dung lượng không phải việc của bạn; trả theo GB đang lưu</td></tr>
<tr><td>Mỗi lượt xem tốn băng thông và CPU của VPS</td><td>Một CDN đứng trước kho phục vụ (<code>media.cuongthai.com</code> đang bật cam, 12.1)</td></tr>
<tr><td>Chuyển sang VPS mới hay thêm máy thứ hai thì phải chép theo (Chương 14)</td><td>Mọi máy chủ đọc chung một kho</td></tr>
<tr><td>Sao lưu chung với mã và cơ sở dữ liệu</td><td>Cần sao lưu hoặc bật versioning riêng — object bị xoá là mất</td></tr>
</table>
<p>Hình dạng thường gặp: trình duyệt xin API một <strong>presigned URL</strong> (URL đã ký sẵn, cho phép tải lên đúng một khoá trong vài phút), PUT thẳng tệp vào kho, còn API chỉ lưu KHOÁ vào cơ sở dữ liệu. Khoá ngẫu nhiên và không bao giờ dùng lại, nên CDN cache chúng cả năm mà không dính vấn đề ở trên. VPS không bao giờ phải chạm vào byte của tệp.</p>

<h3>Chạy thử từng bước</h3>
<ol>
<li>Trên VPS thí nghiệm, một gốc ở <code>:8080</code> với hai chính sách <code>location</code>; kiểm cả hai bằng <code>curl -I</code>.</li>
<li>Một container thứ hai chạy nginx với <code>proxy_cache</code> và <code>X-Cache-Status</code>, trỏ vào gốc.</li>
<li>Xin một ảnh hai lần (MISS, HIT). Ghi đè nó ở gốc; xin lại (vẫn HIT, nội dung cũ). Chép nó sang <code>v2/</code>; xin cái đó (MISS, mới).</li>
<li>Thêm khối <code>/_next/</code> sai, so <code>curl -I</code> ở <code>:3000</code> và <code>:8080</code>, rồi sửa.</li>
</ol>

<h3>Trên Windows và macOS</h3>
<p>Trình duyệt của bạn là bộ đệm đầu tiên. Trong DevTools → Network, "Disable cache" (chỉ có tác dụng khi DevTools đang mở) và cột Size ("memory cache", "disk cache") cho thấy chuyện gì đã xảy ra; tải lại cứng (Cmd+Shift+R / Ctrl+Shift+R) có hỏi lại nhưng một số trình duyệt vẫn tôn trọng <code>immutable</code>. Trong Windows PowerShell 5.1, <code>curl</code> là bí danh của <code>Invoke-WebRequest</code> và không hiểu <code>-I</code> — gọi <code>curl.exe -I</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 sửa một lỗi chính tả trên logo rồi deploy, nửa lớp vẫn thấy logo cũ, và có người bảo "purge cache là xong". Chứng minh trên phòng thí nghiệm vì sao thế là chưa đủ và phải làm gì thay.</p>
<ol>
<li>Dựng gốc với <code>no-cache</code> cho HTML và <code>immutable</code> cho <code>/assets/</code>, và CDN <code>proxy_cache</code> đứng trước.</li>
<li>Phục vụ <code>logo.png</code> dưới <code>/assets/</code>, xin hai lần qua CDN, ghi đè nó, xin lại.</li>
<li>Đẩy bản sửa thành <code>logo.2b7c.png</code>, sửa <code>index.html</code> trỏ tới nó, rồi xin <code>index.html</code> và logo mới qua CDN.</li>
<li>Thêm một <code>location</code> có <code>proxy_hide_header Cache-Control</code> trước một app có đặt header đó, và bắt được nó bằng <code>curl -I</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một HIT với nội dung cũ sau khi ghi đè, một MISS với nội dung mới dưới tên mới, HTML mới ngay request đầu tiên, và <code>curl -I</code> trước/sau của cái header bị nuốt.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CDN edge (điểm biên CDN)</span><span class="v">Máy đệm gần người dùng, trả lời từ bản sao của nó và chỉ hỏi gốc khi MISS.</span></div>
  <div class="kv"><span class="k">Origin (máy gốc)</span><span class="v">Nơi CDN đi lấy — VPS của bạn hoặc một kho lưu trữ.</span></div>
  <div class="kv"><span class="k">Cache-Control (điều khiển bộ đệm)</span><span class="v">Header bảo trình duyệt và CDN được giữ gì và giữ bao lâu.</span></div>
  <div class="kv"><span class="k"><code>no-cache</code> và <code>no-store</code></span><span class="v">Lưu nhưng hỏi lại mỗi lần / không bao giờ lưu.</span></div>
  <div class="kv"><span class="k"><code>immutable</code> (bất biến)</span><span class="v">Lời hứa byte đứng sau URL này không đổi khi còn tươi.</span></div>
  <div class="kv"><span class="k">Content hash / cache busting (mã băm nội dung / phá bộ đệm)</span><span class="v">Gắn mã băm hay số phiên bản vào tên tệp để nội dung mới có URL mới.</span></div>
  <div class="kv"><span class="k">Purge (xoá bộ đệm CDN)</span><span class="v">Xoá một object khỏi bộ đệm của CDN; không với tới trình duyệt.</span></div>
  <div class="kv"><span class="k">Presigned URL (URL ký sẵn)</span><span class="v">URL có hạn cho phép trình duyệt tải một object thẳng vào kho.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>HTML là <code>no-cache</code>; tệp có mã băm là <code>public, max-age=31536000, immutable</code>.</li>
<li>Bộ đệm dài chỉ an toàn khi nội dung mới luôn có tên mới — đo được: ảnh bị ghi đè vẫn HIT với byte cũ.</li>
<li>Purge xoá ở CDN, không xoá ở những trình duyệt đã được bảo <code>immutable</code>.</li>
<li>Cloudflare mặc định không cache HTML và cache theo đuôi tệp; đọc <code>cf-cache-status</code>.</li>
<li>nginx có thể lặng lẽ thay header của app — kiểm bằng <code>curl -I</code> qua cửa trước.</li>
<li>Tệp người dùng tải lên đi vào kho object qua presigned URL, CDN phục vụ, khoá ngẫu nhiên không bao giờ đổi nội dung.</li>
</ul>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Cache-Control</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control — mọi chỉ thị, kèm hành vi của trình duyệt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 9111 — HTTP Caching</span><span class="lc-sub">www.rfc-editor.org/rfc/rfc9111 — chuẩn mà cả trình duyệt lẫn CDN làm theo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Hành vi cache mặc định</span><span class="lc-sub">developers.cloudflare.com/cache/concepts/default-cache-behavior — cái gì được cache khi chưa có luật nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — Purge cache</span><span class="lc-sub">developers.cloudflare.com/cache/how-to/purge-cache — purge làm được gì và không làm được gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare R2</span><span class="lc-sub">developers.cloudflare.com/r2 — kho object tương thích S3, presigned URL, kho công khai sau một tên miền.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — tệp tĩnh, ETag và bộ đệm</span><span class="lc-sub">/courses/nginx/learn${REF} — Chương 4 đo ETag, request có điều kiện và expires.</span></span></div>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: "12.5 — Quiz: from a domain to HTTPS|||12.5 — Quiz: từ tên miền tới HTTPS",
      slug: "deploy-12-5-quiz",
      type: "QUIZ",
      isFreePreview: true,
      description: "Mười câu tình huống: đổi IP chưa ăn, bộ đệm âm, hai bản ghi SPF, wildcard cần DNS-01, gia hạn không reload, certbot --dry-run đi staging, cổng Postgres lộ dù ufw bật, nmap open/filtered, CDN giữ ảnh cũ, và nginx nuốt Cache-Control.",
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>Quiz: from a domain to HTTPS</h2>
<p class="lead">Ten situations from a chapter in which four different things looked fine from the one place people usually check — the DNS dashboard, the certificate file, the firewall status, the app's config — and were wrong from where users stand.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say which of registrar, DNS host and server to change for a given task, and read <code>dig</code> output including the remaining TTL.</li>
<li>I can plan an IP change around TTLs and explain negative caching.</li>
<li>I can get a certificate over ACME (HTTP-01 and DNS-01), and prove on the wire — not on disk — that a renewal reached users.</li>
<li>I know Let's Encrypt's main limits and the 2027–2028 lifetime changes, and I test on staging or Pebble.</li>
<li>I can read <code>ss -tlnp</code>, explain why Docker-published ports bypass ufw, and close them three ways.</li>
<li>I can set cache headers for HTML and hashed assets, rename on change, and catch a proxy that swallows the app's header.</li>
</ul>
${slide('dv-12', 30, 'Bảng tra nhanh Chương 12 (1/2): DNS và chứng chỉ')}
${slide('dv-12', 31, 'Bảng tra nhanh Chương 12 (2/2): cổng và cache')}
<div class="callout">
<p><strong>What this chapter established.</strong> A domain is three parties — for cuongthai.com, Porkbun as registrar, Cloudflare as DNS host, a VPS at the end — and reading its public records turned up two SPF records (a permerror) and no CAA (12.1). On a lab resolver an edited A record stayed old for the 46 seconds of TTL it had left, and a name queried before it existed stayed NXDOMAIN for the SOA's 30 seconds. A certificate from Pebble took 3.7 seconds; the failure that matters came after: a forced renewal left nginx presenting the old serial until it was reloaded, and a deploy hook fixed it (12.2). With ufw denying everything but 22/80/443, a Docker-published Postgres was <code>open</code> and accepted a login from another machine, because Docker's DNAT sends the packet through FORWARD; loopback publishing, no publishing and a <code>DOCKER-USER</code> rule each turned it <code>filtered</code> (12.3). And a small CDN kept serving an overwritten image as a HIT until it moved to a <code>v2</code> name, while nginx replaced the app's year-long cache header with <code>no-store</code> (12.4).</p>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Quiz: từ tên miền tới HTTPS</h2>
<p class="lead">Mười tình huống từ một chương mà bốn thứ khác nhau trông vẫn ổn từ đúng cái chỗ người ta hay kiểm — bảng điều khiển DNS, tệp chứng chỉ, trạng thái tường lửa, cấu hình của app — và lại sai khi nhìn từ chỗ người dùng đứng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được việc nào phải sửa ở registrar, ở nhà DNS hay ở máy chủ, và đọc được output của <code>dig</code> kể cả TTL còn lại.</li>
<li>Tôi lên được kế hoạch đổi IP xoay quanh TTL và giải thích được bộ đệm âm.</li>
<li>Tôi lấy được chứng chỉ qua ACME (HTTP-01 và DNS-01), và chứng minh TRÊN DÂY — không phải trên đĩa — rằng một lần gia hạn đã tới người dùng.</li>
<li>Tôi biết những giới hạn chính của Let's Encrypt và thay đổi về hạn chứng chỉ 2027–2028, và tôi thử trên staging hoặc Pebble.</li>
<li>Tôi đọc được <code>ss -tlnp</code>, giải thích được vì sao cổng Docker publish vòng qua ufw, và đóng chúng được bằng ba cách.</li>
<li>Tôi đặt được header cache cho HTML và cho tệp có mã băm, đổi tên khi đổi nội dung, và bắt được một proxy nuốt header của app.</li>
</ul>
${slide('dv-12', 30, 'Bảng tra nhanh Chương 12 (1/2): DNS và chứng chỉ')}
${slide('dv-12', 31, 'Bảng tra nhanh Chương 12 (2/2): cổng và cache')}
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một tên miền là ba bên — với cuongthai.com là Porkbun làm registrar, Cloudflare làm nhà DNS, và một VPS ở cuối — và đọc bản ghi công khai của nó lòi ra hai bản ghi SPF (một permerror) và không có CAA (12.1). Trên một resolver thí nghiệm, bản ghi A đã sửa vẫn cũ trong 46 giây TTL nó còn lại, và một tên bị hỏi trước khi tồn tại cứ NXDOMAIN suốt 30 giây của SOA. Lấy chứng chỉ từ Pebble mất 3,7 giây; cú hỏng đáng kể tới SAU đó: một lần ép gia hạn để nginx vẫn đưa số seri cũ cho tới khi được nạp lại, và một deploy hook sửa được (12.2). Với ufw từ chối mọi thứ trừ 22/80/443, một Postgres do Docker publish vẫn <code>open</code> và nhận đăng nhập từ máy khác, vì DNAT của Docker đẩy gói qua FORWARD; publish trên loopback, không publish, và một luật <code>DOCKER-USER</code> — mỗi cách đều biến nó thành <code>filtered</code> (12.3). Và một CDN thu nhỏ cứ phát một ảnh đã bị ghi đè dưới dạng HIT cho tới khi nó chuyển sang tên <code>v2</code>, trong lúc nginx thay header cache một năm của app bằng <code>no-store</code> (12.4).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "The evening before the defence, your team changes the A record of the domain to the new VPS (TTL 3600) and turns the old VPS off. Teammates on 4G see the new site; the lecturer on the university network gets errors for almost an hour. What happened, and what should have been done?|||Tối trước hôm bảo vệ, nhóm đổi bản ghi A của tên miền sang VPS mới (TTL 3600) rồi tắt VPS cũ. Các bạn dùng 4G thấy trang mới; thầy ngồi mạng trường bị lỗi gần một tiếng. Chuyện gì đã xảy ra, và lẽ ra phải làm gì?",
            options: [
              "DNS changes need 24–48 hours to \"propagate\" through the registrar; nothing could have been done except waiting|||Thay đổi DNS cần 24–48 giờ để \"lan truyền\" qua registrar; không làm được gì ngoài chờ",
              "The university resolver had cached the old IP for the rest of its TTL; lower the TTL one TTL-length before the change and keep the old server running until the old TTL has passed|||Resolver của trường đã đệm IP cũ cho phần TTL còn lại; hạ TTL trước một khoảng bằng TTL cũ và giữ máy cũ chạy tới khi TTL cũ đã qua",
              "The lecturer’s browser had HSTS for the old IP; clearing the browser cache would have fixed it|||Trình duyệt của thầy đã lưu HSTS cho IP cũ; xoá bộ đệm trình duyệt là xong",
              "The A record should have been a CNAME, which updates instantly everywhere|||Lẽ ra phải dùng CNAME thay cho A, vì CNAME cập nhật tức thì ở mọi nơi",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: A resolver reuses a cached answer until its TTL runs out — in the lab, bind9 answered the new IP two seconds after the edit while unbound kept the old one for the 46 seconds it had left. With TTL 3600 that becomes up to an hour. \"48-hour propagation\" is a myth for record changes: nothing is pushed anywhere, caches simply expire. A CNAME is cached exactly like an A record.|||VI: Resolver dùng lại câu trả lời đã đệm tới khi TTL hết — trong phòng thí nghiệm, bind9 trả IP mới hai giây sau khi sửa, còn unbound giữ IP cũ trọn 46 giây nó còn lại. Với TTL 3600 thì thành tới một tiếng. \"Lan truyền 48 giờ\" là chuyện hoang đường với việc sửa bản ghi: chẳng có gì được đẩy đi đâu, bộ đệm chỉ đơn giản là hết hạn. CNAME cũng bị đệm y như bản ghi A.",
          },
          {
            question: "You test https://api.vidu.test before creating the record (NXDOMAIN, fine). You then create it, and the authoritative server answers correctly — but through the office resolver it still says NXDOMAIN for several minutes. Why?|||Bạn thử https://api.vidu.test TRƯỚC khi tạo bản ghi (NXDOMAIN, bình thường). Rồi bạn tạo nó, máy có thẩm quyền trả lời đúng — nhưng qua resolver của văn phòng nó vẫn báo NXDOMAIN thêm vài phút. Vì sao?",
            options: [
              "The resolver cached \"this name does not exist\" for the SOA negative-caching time|||Resolver đã đệm câu \"tên này không tồn tại\" trong khoảng thời gian bộ đệm âm của SOA",
              "New subdomains need a new NS record at the registrar before they resolve|||Tên miền con mới cần bản ghi NS mới ở registrar thì mới phân giải được",
              "The authoritative server has not reloaded the zone yet|||Máy có thẩm quyền chưa nạp lại vùng",
              "The office resolver blocks port 53 to unknown names|||Resolver của văn phòng chặn cổng 53 với những tên lạ",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Non-existence is cached too (RFC 2308), for the last field of the SOA. In the lab that was 30 seconds: api.vidu.test stayed NXDOMAIN at the resolver for about that long after it existed. The authoritative server was already correct — which rules out a missing reload. A subdomain needs no NS record of its own.|||VI: \"Không tồn tại\" cũng bị đệm (RFC 2308), trong khoảng bằng trường cuối của SOA. Ở phòng thí nghiệm là 30 giây: api.vidu.test vẫn NXDOMAIN ở resolver khoảng chừng đó sau khi đã có. Máy có thẩm quyền đã trả đúng — nên không phải do chưa nạp lại. Tên miền con không cần bản ghi NS riêng.",
          },
          {
            question: "dig cuongthai.com TXT shows both \"v=spf1 include:_spf.porkbun.com ~all\" and \"v=spf1 include:amazonses.com ~all\". Mail from both services is working \"most of the time\". What is the actual state of SPF for the domain?|||dig cuongthai.com TXT cho ra cả \"v=spf1 include:_spf.porkbun.com ~all\" lẫn \"v=spf1 include:amazonses.com ~all\". Thư từ cả hai dịch vụ \"phần lớn vẫn đi\". SPF của tên miền thật ra đang ở trạng thái nào?",
            options: [
              "Both policies apply; receivers merge them|||Cả hai chính sách đều áp dụng; máy nhận tự gộp lại",
              "Only the first record returned is used, so one service fails at random|||Chỉ bản ghi được trả về đầu tiên được dùng, nên một dịch vụ hỏng ngẫu nhiên",
              "Only the record with the lower TTL is used|||Chỉ bản ghi có TTL thấp hơn được dùng",
              "More than one SPF record is a permerror: receivers treat the domain as having no valid SPF|||Hơn một bản ghi SPF là permerror: máy nhận coi như tên miền không có SPF hợp lệ",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: RFC 7208 section 4.5: if more than one SPF record is found, the result is permerror. There is no merging and no \"first one wins\"; the policy is simply broken, which is why mail still flows but lands in spam more often. The fix is a single record with both includes.|||VI: RFC 7208 mục 4.5: tìm thấy hơn một bản ghi SPF thì kết quả là permerror. Không có chuyện gộp, cũng không có \"cái đầu thắng\"; chính sách chỉ đơn giản là hỏng — vì thế thư vẫn đi nhưng hay vào spam hơn. Cách sửa là một bản ghi duy nhất chứa cả hai include.",
          },
          {
            question: "certbot certonly --webroot -w /var/www/html -d \"*.vidu.test\" ends with \"Client with the currently selected authenticator does not support any combination of challenges that will satisfy the CA.\" Port 80 is open and nginx serves the webroot. What is wrong?|||certbot certonly --webroot -w /var/www/html -d \"*.vidu.test\" kết thúc bằng \"Client with the currently selected authenticator does not support any combination of challenges that will satisfy the CA.\" Cổng 80 mở và nginx phục vụ đúng webroot. Sai ở đâu?",
            options: [
              "The webroot path must end with /.well-known/acme-challenge|||Đường webroot phải kết thúc bằng /.well-known/acme-challenge",
              "Wildcard names need a CAA record before any CA will issue|||Tên wildcard cần bản ghi CAA thì CA mới cấp",
              "A wildcard can only be validated with DNS-01; webroot is HTTP-01|||Wildcard chỉ xác minh được bằng DNS-01; webroot là HTTP-01",
              "Let’s Encrypt no longer issues wildcards since 2025|||Let’s Encrypt không cấp wildcard nữa từ 2025",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The CA offers only DNS-01 for a wildcard, and the webroot authenticator can only do HTTP-01, so no combination fits — exactly the message measured in the lab. With --manual --preferred-challenges dns and a hook that ADDS a TXT at _acme-challenge.vidu.test, the same order succeeded. CAA restricts issuance but is not required for it.|||VI: Với wildcard, CA chỉ đưa ra DNS-01, còn bộ xác thực webroot chỉ làm được HTTP-01, nên không có tổ hợp nào khớp — đúng câu đo được trong phòng thí nghiệm. Với --manual --preferred-challenges dns và một hook THÊM bản ghi TXT ở _acme-challenge.vidu.test, cùng đơn hàng đó thành công. CAA hạn chế việc cấp chứ không bắt buộc phải có.",
          },
          {
            question: "Users report \"certificate expired\". On the server, certbot certificates says \"VALID: 89 days\" and the timer ran successfully last night. What is the most likely cause?|||Người dùng báo \"chứng chỉ hết hạn\". Trên máy chủ, certbot certificates báo \"VALID: 89 days\" và bộ hẹn giờ đã chạy thành công đêm qua. Nguyên nhân khả dĩ nhất?",
            options: [
              "The renewal wrote new files but nginx was never reloaded, so it still presents the certificate it loaded months ago|||Lần gia hạn đã ghi tệp mới nhưng nginx chưa bao giờ được nạp lại, nên nó vẫn đưa chứng chỉ đã nạp từ mấy tháng trước",
              "The users’ clocks are wrong; the certificate is fine|||Đồng hồ máy người dùng sai; chứng chỉ vẫn ổn",
              "certbot renewed the wrong domain because of a typo in -d|||certbot gia hạn nhầm tên miền vì gõ sai -d",
              "The CA revoked the certificate because it was renewed too early|||CA thu hồi chứng chỉ vì gia hạn quá sớm",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: certbot reports on files; users see what nginx loaded. Measured: after a forced renewal the serial on disk was 0DD8…, nginx kept presenting 2050… until nginx -s reload. A deploy hook (nginx -t -q && nginx -s reload) fixes it, and the only trustworthy check is openssl s_client from outside. Wrong client clocks are possible but would not match a server whose certificate is fresh on disk.|||VI: certbot báo về TỆP; người dùng thấy thứ nginx đã nạp. Đo được: sau một lần ép gia hạn, số seri trên đĩa là 0DD8…, nginx vẫn đưa 2050… tới khi nginx -s reload. Deploy hook (nginx -t -q && nginx -s reload) sửa được, và phép kiểm đáng tin duy nhất là openssl s_client từ bên ngoài. Đồng hồ máy khách sai là có thể, nhưng không khớp với một máy chủ có chứng chỉ mới trên đĩa.",
          },
          {
            question: "In a lab with Pebble, certbot renew --dry-run fails with an SSL error mentioning acme-staging-v02.api.letsencrypt.org, although the renewal file says server = https://pebble:14000/dir. What is going on?|||Trong phòng thí nghiệm dùng Pebble, certbot renew --dry-run hỏng với một lỗi SSL nhắc tới acme-staging-v02.api.letsencrypt.org, dù tệp renewal ghi server = https://pebble:14000/dir. Chuyện gì đang xảy ra?",
            options: [
              "The renewal file is corrupt and certbot fell back to its default server|||Tệp renewal bị hỏng nên certbot lùi về máy mặc định",
              "Pebble redirects dry-run requests to Let’s Encrypt staging|||Pebble chuyển hướng request dry-run sang staging của Let’s Encrypt",
              "REQUESTS_CA_BUNDLE was not set, so certbot ignored the server line|||Chưa đặt REQUESTS_CA_BUNDLE nên certbot bỏ qua dòng server",
              "--dry-run uses Let’s Encrypt’s staging server instead of the saved one; pass --server explicitly in the lab|||--dry-run dùng máy staging của Let’s Encrypt thay cho máy đã lưu; trong phòng thí nghiệm phải ghi rõ --server",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: That is what happened in the lab: --dry-run went to acme-staging (and failed TLS verification because the lab trusted only Pebble’s CA), while certbot renew --dry-run --server https://pebble:14000/dir succeeded. Pebble redirects nothing, and REQUESTS_CA_BUNDLE affects trust, not which server is chosen.|||VI: Đúng chuyện đã xảy ra trong phòng thí nghiệm: --dry-run đi sang acme-staging (và hỏng ở bước kiểm TLS vì phòng thí nghiệm chỉ tin CA của Pebble), còn certbot renew --dry-run --server https://pebble:14000/dir thì thành công. Pebble không chuyển hướng gì cả, còn REQUESTS_CA_BUNDLE ảnh hưởng tới việc tin chứng chỉ chứ không quyết định chọn máy nào.",
          },
          {
            question: "ufw allows only 22, 80 and 443 (default deny incoming). compose.yaml has ports: \"5432:5432\" for Postgres. From another machine, nmap reports 5432/tcp open and psql logs in. Why, and what is the right fix?|||ufw chỉ cho 22, 80 và 443 (mặc định từ chối chiều vào). compose.yaml có ports: \"5432:5432\" cho Postgres. Từ một máy khác, nmap báo 5432/tcp open và psql đăng nhập được. Vì sao, và sửa thế nào cho đúng?",
            options: [
              "ufw was not reloaded after compose started; run ufw reload|||ufw chưa được nạp lại sau khi compose chạy; chạy ufw reload",
              "Docker DNATs the packet in PREROUTING, so it goes through FORWARD where Docker’s chains accept it before ufw; remove ports: or publish on 127.0.0.1|||Docker DNAT gói tin ở PREROUTING, nên nó đi qua FORWARD nơi chuỗi của Docker chấp nhận nó trước ufw; bỏ ports: hoặc publish trên 127.0.0.1",
              "ufw only filters IPv6 by default; add a v4 rule for 5432|||ufw mặc định chỉ lọc IPv6; thêm luật v4 cho 5432",
              "Postgres bypasses the firewall with its own listener; set listen_addresses = localhost|||Postgres vượt tường lửa bằng listener riêng; đặt listen_addresses = localhost",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Measured in the lab: the same ufw rules dropped a plain process on 6379 (filtered) but not the Docker-published 5432 (open). The nat DOCKER chain rewrites the destination, the packet is forwarded, and FORWARD rule 1–2 (DOCKER-USER, DOCKER-FORWARD) come before ufw. Reloading ufw changes nothing. listen_addresses inside the container would break the published port but is not the fix — the database simply should not be published.|||VI: Đo trong phòng thí nghiệm: cùng luật ufw đã vứt gói của một tiến trình thường ở 6379 (filtered) nhưng không chặn 5432 do Docker publish (open). Chuỗi DOCKER của bảng nat viết lại đích, gói bị chuyển tiếp, và luật 1–2 của FORWARD (DOCKER-USER, DOCKER-FORWARD) đứng trước ufw. Nạp lại ufw chẳng đổi gì. listen_addresses trong container sẽ làm hỏng cổng publish nhưng không phải cách sửa — cơ sở dữ liệu đơn giản là không nên được publish.",
          },
          {
            question: "After fixing the compose file, you scan the VPS from another machine: 5432/tcp filtered, 8080/tcp closed, 443/tcp open. Which reading is correct?|||Sau khi sửa compose, bạn quét VPS từ một máy khác: 5432/tcp filtered, 8080/tcp closed, 443/tcp open. Cách đọc nào đúng?",
            options: [
              "8080 is the most dangerous: \"closed\" means a service is there but refusing you|||8080 nguy hiểm nhất: \"closed\" nghĩa là có dịch vụ nhưng đang từ chối bạn",
              "filtered and closed mean the same thing; both are safe|||filtered và closed nghĩa như nhau; cả hai đều an toàn",
              "filtered: a firewall dropped the probe; closed: reachable but nothing listening; open: listening and allowed|||filtered: tường lửa nuốt gói dò; closed: tới được nhưng không ai nghe; open: đang nghe và được cho qua",
              "open on 443 means the firewall is misconfigured|||open ở 443 nghĩa là tường lửa cấu hình sai",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: closed means the host answered with a reset — reachable, nobody listening; filtered means no answer, a firewall ate it; open means a listener and a path through the firewall. They are not the same: a closed port becomes open the moment something starts listening there without a firewall rule. 443 open is exactly what a web server wants.|||VI: closed nghĩa là máy trả về gói reset — tới được, không ai nghe; filtered nghĩa là không có trả lời, tường lửa đã nuốt; open là có tiến trình nghe và có đường qua tường lửa. Chúng không như nhau: một cổng closed thành open ngay khi có thứ gì đó bắt đầu nghe ở đó mà không có luật tường lửa. 443 open đúng là thứ một máy web cần.",
          },
          {
            question: "You fixed a typo in /assets/logo.png (served with public, max-age=31536000, immutable), uploaded it under the same name and purged the CDN. Some users still see the old logo. What is the complete fix?|||Bạn sửa lỗi chính tả trong /assets/logo.png (phục vụ với public, max-age=31536000, immutable), tải lên cùng tên và purge CDN. Vẫn có người thấy logo cũ. Cách sửa trọn vẹn là gì?",
            options: [
              "Purge again with \"purge everything\"; one purge is sometimes not enough|||Purge lại bằng \"purge everything\"; một lần purge đôi khi chưa đủ",
              "Publish the fixed file under a new name (hash or v2 prefix) and update the HTML that references it|||Đẩy tệp đã sửa dưới một tên mới (mã băm hoặc tiền tố v2) và sửa HTML đang trỏ tới nó",
              "Change the header to no-store for all images|||Đổi header thành no-store cho mọi ảnh",
              "Ask users to clear their DNS cache|||Bảo người dùng xoá bộ đệm DNS",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: immutable promised browsers that those bytes never change, and a purge only reaches the CDN. In the lab the overwritten file stayed HIT with the old content, while the same file under v2/ was a MISS with the new one — the rule this course’s own slide images follow. no-store would work by throwing away all caching for every image forever.|||VI: immutable đã hứa với trình duyệt rằng những byte đó không bao giờ đổi, còn purge chỉ với tới CDN. Trong phòng thí nghiệm, tệp bị ghi đè vẫn HIT với nội dung cũ, còn cùng tệp đó dưới v2/ thì MISS với nội dung mới — đúng luật mà chính ảnh slide của khoá học này tuân theo. no-store thì \"chạy\" bằng cách vứt bỏ mọi việc cache cho mọi ảnh, mãi mãi.",
          },
          {
            question: "next.config.js sets Cache-Control: public, max-age=604800 for /playground/**. curl -I on the app port shows it; curl -I https://your-domain/playground/x.glb shows Cache-Control: no-store. Where is the problem?|||next.config.js đặt Cache-Control: public, max-age=604800 cho /playground/**. curl -I vào cổng của app thấy đúng; curl -I https://ten-mien/playground/x.glb lại thấy Cache-Control: no-store. Vấn đề nằm ở đâu?",
            options: [
              "Next.js ignores headers() for files in public/|||Next.js bỏ qua headers() với tệp trong public/",
              "The CDN rewrites every Cache-Control to no-store by default|||CDN mặc định viết lại mọi Cache-Control thành no-store",
              "The browser sends Cache-Control: no-cache, and the server echoes it back|||Trình duyệt gửi Cache-Control: no-cache, và máy chủ nhại lại",
              "nginx in front hides the app’s header (proxy_hide_header) and adds its own no-store; give that path its own location without hiding it|||nginx đứng trước giấu header của app (proxy_hide_header) rồi thêm no-store của nó; cho đường đó một location riêng không giấu header",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: The app port shows the right header, so Next.js is not the problem; the front door shows another value, so something between rewrote it. That is the cuongthai.com incident of 23/08/2026 and the lab measurement (app: immutable, through nginx: no-store). Cloudflare does not invent no-store; it passes the origin’s header on and decides its own caching from it.|||VI: Cổng của app cho header đúng, nên Next.js không có lỗi; cửa trước cho giá trị khác, nên có thứ đứng giữa đã viết lại nó. Đó là sự cố cuongthai.com ngày 23/08/2026 và phép đo trong phòng thí nghiệm (app: immutable, qua nginx: no-store). Cloudflare không tự bịa ra no-store; nó chuyển nguyên header của gốc và dựa vào đó để quyết định cache của chính nó.",
          },
        ],
      },
    },
  ],
};
