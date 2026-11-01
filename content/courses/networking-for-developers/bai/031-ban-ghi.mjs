/**
 * Chương 3 · 3.2 — Các loại bản ghi lập trình viên đụng tới (slug khung netdev-3-2-ban-ghi).
 * Output thật: lab/out/c32-*.out.txt. Tệp vùng thật: lab/moi-truong/dns/vung/labflow.test.zone.
 */
import { run, src, card, kv, cauNoi } from '../_ui.mjs';
import { net } from '../_lab.mjs';
import G from '../giang/nfd-03-2.mjs';

const L = card;
const NWC = { mon: 'NWC204', khoa: 'nwc204-computer-networking' };
const D = { drop: /^# |COOKIE|^; <<>> DiG|^;; global options|^; \(1 server found\)|^;; WHEN/ };
const EMAIL = '<a href="/courses/email-infrastructure" target="_blank" rel="noopener">Email infrastructure</a>';

export default {
  title: '3.2 — Record types that developers touch|||3.2 — Các loại bản ghi lập trình viên đụng tới',
  slug: 'netdev-3-2-ban-ghi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc một tệp vùng thật; A/AAAA, CNAME (và luật không đặt ở đỉnh tên miền, CNAME flattening), MX, TXT (SPF, xác minh tên miền, DMARC), CAA, SRV cho mongodb+srv://, HTTPS (RFC 9460), NS và SOA; named-checkzone bắt bốn lỗi kinh điển (cả lỗi quên dấu chấm cuối mà vẫn "OK"); bản ghi thật của cuongthai.com; máy chủ phụ chép vùng bằng AXFR và sự cố quên tăng serial.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Record types that developers touch</h2>
<p class="lead">"Point the domain to the server" is one record. Then the email provider asks for an MX and two TXT records, the certificate authority checks a CAA record, the cloud database gives you a <code>mongodb+srv://</code> string that only works because of SRV records, and the CDN wants a CNAME — "but not at the root of the domain". This lesson reads a real zone file line by line, asks for every record type a developer meets, lets the zone checker catch the classic mistakes, and ends with the most common way a correct change still reaches only half of your users.</p>

<h3>A zone file, line by line</h3>
<p>A <strong>zone</strong> is the part of the name tree one organisation manages — here <code>labflow.test</code> and everything under it. On BIND (and in the "export" of most DNS providers) it is a text file. This is the real one the lab's ns1 serves:</p>
${src('../moi-truong/dns/vung/labflow.test.zone', 'text')}
<p>Every record line has the same five columns: <strong>name</strong>, <strong>TTL</strong> (optional — the <code>$TTL 300</code> at the top is the default), <strong>class</strong> (always <code>IN</code>), <strong>type</strong>, <strong>data</strong>. Two rules make the file readable and are also the source of most mistakes:</p>
<ul>
<li><code>@</code> means the zone itself (<code>labflow.test.</code>), and a name <strong>without a final dot</strong> is relative: <code>www</code> means <code>www.labflow.test.</code>.</li>
<li>So a name <strong>with</strong> a final dot is absolute: <code>labflow.cdn.test.</code> is exactly that. Forget the dot and the zone name is appended — you will see the consequence below.</li>
</ul>

<h3>Asking for each type</h3>
<p><code>+noall +answer</code> makes <code>dig</code> print only the answer lines:</p>
${run('c32-hoi', 'dig +noall +answer labflow.test A', 4, D)}
<ul>
<li><strong>A</strong> = an IPv4 address, <strong>AAAA</strong> = an IPv6 address (lesson 2.4). A name can have several of each (lesson 3.4).</li>
<li><strong>CNAME</strong> (canonical name) = "this name is an alias, look up that other name instead". <code>www</code> points inside the zone; <code>static</code> points to <code>labflow.cdn.test</code>, a name in <em>another company's</em> zone — the usual way to put a site behind a CDN or a SaaS: they can change their IPs without asking you. The resolver follows the chain and returns everything (notice the CDN's own TTL, much shorter).</li>
</ul>
${run('c32-hoi', 'dig +noall +answer labflow.test MX', 4, D)}
<ul>
<li><strong>MX</strong> (mail exchanger) = which server receives email for <code>@labflow.test</code>, with a priority (lower number = tried first). It must point to a <em>name</em> that has A/AAAA records — never to an IP, never to a CNAME.</li>
<li><strong>TXT</strong> = free text, used as a notice board: <code>v=spf1 mx -all</code> is SPF ("only our MX servers may send mail as us"), <code>labflow-verify=…</code> is the kind of token Google Search Console, a SaaS or a certificate authority asks you to publish to <em>prove you control the domain</em>, and <code>_dmarc</code> says what receivers should do with mail that fails the checks. How SPF, DKIM and DMARC work is the subject of the ${EMAIL} course; here, just recognise them.</li>
</ul>
${run('c32-hoi', 'dig +noall +answer labflow.test CAA', 3, D)}
<ul>
<li><strong>CAA</strong> (certification authority authorization) = which certificate authorities may issue HTTPS certificates for this name. CAs must check it before issuing; with <code>0 issue "letsencrypt.org"</code>, any other CA must refuse. No CAA record = any CA may issue.</li>
<li><strong>SRV</strong> (service) = "the service <code>_mongodb._tcp</code> for <code>db.labflow.test</code> is on these hosts and ports", with priority and weight. This is exactly what a <code>mongodb+srv://db.labflow.test/</code> connection string makes the driver look up (plus the TXT record for options) — so your database can change hosts without changing your app's config.</li>
<li><strong>HTTPS</strong> (RFC 9460, 2023) = connection hints for browsers <em>before</em> they connect: here, "speaks HTTP/2 (<code>alpn="h2"</code>), and the IPv4 address is 203.0.113.10". Browsers that see <code>h3</code> there can go straight to HTTP/3 (Chapter 5).</li>
</ul>
${run('c32-hoi', 'dig +noall +answer labflow.test NS', 2, D)}
<ul>
<li><strong>NS</strong> = the zone's own list of its name servers (it should match the delegation at the TLD from lesson 3.1).</li>
<li><strong>SOA</strong> (start of authority) = one per zone: primary server, contact e-mail (<code>hostmaster.labflow.test</code> = hostmaster@labflow.test), then five numbers: <strong>serial</strong> 2026110101 (version of the zone — see the pitfall at the end), <strong>refresh</strong> 3600 (how often secondaries check for a new version), <strong>retry</strong> 600, <strong>expire</strong> 1209600 (secondaries stop answering after 14 days without reaching the primary), and <strong>minimum</strong> 300 — today used as the TTL for "this name does not exist" answers (lesson 3.3).</li>
</ul>
${net('zone', 'records', 'en', 'Click a record type: see the zone line, the dig answer, and which rule applies to it.', { tour: 'zone-records' })}

<h3>Your code reads records too</h3>
<p>Node's <code>dns.promises</code> has one function per type — the same calls a mail library or a MongoDB driver makes:</p>
${run('c32-node', 'node /tmp/ghi.mjs', 1, D)}
<p>Run it twice and the order of the two SRV records (and of the two TXT records) can change — an earlier recording of this lesson had <code>db2</code> first. Clients must pick by priority, then by weight, never by position: the order of records in a DNS answer carries no meaning.</p>

<h3>The zone checker and four classic mistakes</h3>
<p><code>named-checkzone</code> loads a zone file exactly like the server would. Run it before every reload:</p>
${run('c32-kiem', 'named-checkzone labflow.test /dnsz/src/labflow.test.zone', 1, D)}

<div class="pitfall co-tieu-de">
<p><strong>1 · "Make the domain itself a CNAME to the CDN."</strong> Your CDN says "add a CNAME to our name". For <code>www</code> that is fine. For the bare domain (the <em>apex</em>, <code>labflow.test</code>) it is impossible:</p>
${run('c32-kiem', "sed 's/^@              IN A    203.0.113.10/", 2, { drop: /^# / })}
<p>Each error line points at another record at the apex (AAAA, MX, TXT, CAA, HTTPS) that cannot live next to the new CNAME — and the SOA and NS records above it conflict just the same. A CNAME means "this name has <em>no</em> data of its own, go elsewhere" — so it cannot sit next to any other record at the same name (RFC 1034/2181). And the apex always has other records: SOA and NS at least, usually MX and TXT. Providers work around it with <strong>CNAME flattening</strong> / <strong>ALIAS</strong> / <strong>ANAME</strong> records: you configure "apex → cdn name", and the provider itself resolves the target and publishes plain A/AAAA records at the apex. That is a provider feature, not a DNS record type.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>2 · A CNAME next to another record.</strong> Same rule anywhere in the zone: <code>api</code> already has an A record, adding a CNAME for it breaks the whole zone — not just that name:</p>
${run('c32-kiem', "printf 'api", 2, { drop: /^# / })}
</div>

<div class="pitfall co-tieu-de">
<p><strong>3 · MX pointing to an IP</strong>, and <strong>4 · the missing final dot</strong> — both "load OK", which is what makes them dangerous:</p>
${run('c32-kiem', "sed 's/^@              IN MX   10 mail/@              IN MX   10 203", 2, { drop: /^# / })}
${run('c32-kiem', "sed 's/^@              IN MX   10 mail$", 2, { drop: /^# / })}
<p>In the last one, <code>mail.labflow.test</code> without a dot became <code>mail.labflow.test.labflow.test</code> — a name that does not exist. The zone loads, the website works, and every incoming email bounces. Read the warnings, not only the final <code>OK</code>.</p>
</div>

<h3>A real zone: cuongthai.com</h3>
<p>This website's DNS is hosted by Cloudflare. A few records, from the real Internet (the TXT query is filtered to the SPF line only):</p>
${run('c32-that', 'dig +noall +answer cuongthai.com A', 10, D)}
<ul>
<li>The A record is the VPS itself (<code>160.187.1.208</code>, not proxied — lesson 3.4). MX goes to Porkbun's mail forwarding; SPF allows Porkbun and Amazon SES to send as <code>cuongthai.com</code>.</li>
<li><code>p=none</code> in DMARC: receivers only <em>report</em> failures, they do not reject — a common first step, worth tightening later.</li>
<li>No CAA record: any certificate authority may issue a certificate for this name. Adding one (for the CA actually used) is a one-line hardening.</li>
<li><code>media.cuongthai.com</code> (served through Cloudflare) has an HTTPS record that Cloudflare adds automatically: ALPN, address hints, and an <code>ech=</code> key for Encrypted Client Hello (Chapter 6).</li>
<li>The SOA's last number is 1800: a "does not exist" answer is cached up to 30 minutes (lesson 3.3).</li>
<li>Asking for type <code>ANY</code> ("give me everything") returns a fake <code>HINFO "RFC8482"</code>: big providers stopped answering ANY because it was abused to amplify DDoS traffic (RFC 8482). Ask for each type explicitly.</li>
<li><code>dig -x 1.1.1.1</code> asks the opposite direction (<strong>PTR</strong>, reverse DNS): address → name, owned by whoever owns the IP block. Mail servers check it; for a VPS you set it in the hosting provider's panel, not in your zone.</li>
</ul>

<h3>Two servers, one zone: how a change spreads</h3>
<p>Every domain should have at least two name servers (RFC 2182 even asks for them to be in different networks). LabFlow's <strong>primary</strong> ns1 holds the file; the <strong>secondary</strong> ns2 copies it with a <strong>zone transfer</strong> (AXFR, over TCP port 53). Not everyone may copy the zone:</p>
${run('c32-axfr', 'dig @203.0.113.53', 1, D)}
${run('c32-axfr-ns2', 'dig @203.0.113.53', 2, D)}
<p>The laptop is refused (<code>allow-transfer</code> only lists ns2 — a public zone transfer would hand anyone your full list of hostnames). ns2 copies the zone and serves the same serial. When ns1 reloads a zone, it sends a <strong>NOTIFY</strong> to ns2; ns2 compares serials and transfers <em>only if the primary's serial is larger</em>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"I changed the record, but half the users still get the old one."</strong> On ns1, someone moves <code>api</code> to the Singapore edge and forgets the serial:</p>
${run('c32-serial-quen', 'sed -i', 3, D)}
${run('c32-serial-hoi', 'dig', 4, D)}
<p>ns1 says <code>.11</code>, ns2 still says <code>.10</code>, with the <em>same</em> serial — so ns2 has no reason to transfer. A resolver picks either server, so each user gets one answer or the other depending on which server their resolver happened to ask: the classic "works for me, not for my colleague". The fix is the serial (convention: <code>YYYYMMDDnn</code>, date + change number of the day):</p>
${run('c32-serial-sua', 'sed -i', 3, D)}
${run('c32-serial-hoi2', 'dig', 4, D)}
${run('c32-ns2-log', 'docker logs', 1, D)}
<p>NOTIFY received, serial larger, transfer done in 2 ms — both servers agree. Managed DNS providers (Cloudflare, Route 53) do this for you; with your own BIND, or with DNS-as-code tools that write zone files, bumping the serial is your job.</p>
</div>
${net('zone', 'serial', 'en', 'Edit a record on the primary with and without bumping the serial, and watch what the secondary serves.', { tour: 'zone-serial' })}

<h3>Where this lives in the computer</h3>
<ul>
<li>BIND reads the zone file once and keeps it in RAM as a tree indexed by name; each answer is a lookup in that tree. That is why editing the file changes nothing until <code>rndc reload</code>.</li>
<li>A query and its answer are one UDP datagram each (the <code>MSG SIZE</code> line in dig); a zone transfer is a TCP connection to port 53 that streams every record — here 74 records in one message of 5.1 kB.</li>
<li>On ns2 the copy is saved to a file in <code>/var/cache/bind</code>, so a restart does not need the primary.</li>
</ul>
${cauNoi('en', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP and file sharing', giong: 'the main record types (A, AAAA, CNAME, MX, TXT, NS) and what they are for', khac: 'NWC204 lists the types with real dig output for one site', them: 'a full zone file to read and edit, SRV for mongodb+srv, CAA and HTTPS records, the apex-CNAME rule checked by named-checkzone, the missing-dot bug that still loads OK, and primary/secondary transfers with the forgotten-serial incident' })}

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> LabFlow buys a status-page service. Their setup page says: "Create <code>status.labflow.test</code> as a CNAME to <code>labflow.cdn.test</code> and add the TXT record <code>status-verify=81c2</code> on <code>labflow.test</code>." Your manager adds: "And point the main domain to the CDN too, with a CNAME."</p>
<ol>
<li>On <code>nfi-ns</code>, copy <code>/dnsz/src/labflow.test.zone</code> to <code>/tmp/new.zone</code>, add the two records, bump the serial, and run <code>named-checkzone</code>.</li>
<li>Try the manager's request in another copy (<code>@ IN CNAME labflow.cdn.test.</code>, removing the apex A/AAAA). Read the error. Write one sentence for the manager with an alternative.</li>
<li>Apply your good copy (<code>cp /tmp/new.zone /dnsz/src/labflow.test.zone</code>, then <code>bash /lab/k/moi-truong/dns/ky.sh labflow.test &amp;&amp; rndc reload labflow.test</code>).</li>
<li>From the laptop, prove both servers serve the new records: <code>dig +short @203.0.113.53 status.labflow.test</code>, same with <code>@203.0.113.54</code>, and <code>dig +short TXT labflow.test</code>.</li>
</ol>
<p><strong>Done when:</strong> both ns1 and ns2 answer the CNAME with the new serial, the TXT shows three values, and your sentence explains why the apex cannot be a CNAME and what a DNS provider offers instead.</p>
<details><summary>Solution</summary>
<p>1) Add <code>status IN CNAME labflow.cdn.test.</code> (final dot!) and <code>@ IN TXT "status-verify=81c2"</code>; change <code>2026110101</code> to <code>2026110102</code>; <code>named-checkzone labflow.test /tmp/new.zone</code> prints <code>loaded serial 2026110102</code> and <code>OK</code>. 2) <code>CNAME and other data</code>: the apex must keep its SOA, NS, MX and TXT records, and a CNAME cannot coexist with any other record. "The bare domain cannot be a CNAME; our DNS provider can do CNAME flattening (ALIAS) which publishes the CDN's addresses as A records — or we keep the A record and use www for the CDN." 3–4) Both servers answer <code>labflow.cdn.test.</code> and <code>203.0.113.10</code>; <code>dig +short @203.0.113.54 labflow.test SOA</code> shows the new serial. If ns2 still gives NXDOMAIN, you forgot the serial — bump it again and reload.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
    ['zone (vùng)', 'The part of the name tree one organisation manages, kept as a zone file on its name servers.'],
    ['CNAME (bí danh)', 'Alias: “look up that other name instead”. Cannot coexist with other records ⇒ never at the apex.'],
    ['apex (đỉnh tên miền)', 'The bare domain (labflow.test). Always has SOA and NS records.'],
    ['CNAME flattening / ALIAS', 'Provider feature: resolves a target name and publishes its A/AAAA at the apex.'],
    ['MX / TXT / CAA', 'Mail server for the domain / free text (SPF, verification, DMARC) / allowed certificate authorities.'],
    ['SRV', 'Host and port of a named service (_mongodb._tcp…) — what mongodb+srv:// looks up.'],
    ['SOA serial (số hiệu phiên bản vùng)', 'Version number of the zone; secondaries copy only when it increases.'],
    ['AXFR / NOTIFY', 'Full zone transfer over TCP / the primary’s “I changed” message to secondaries.'],
  ])}

<h3>📌 Summary</h3>
<ul>
<li>Record line = name, TTL, IN, type, data; names without a final dot are relative to the zone.</li>
<li>A/AAAA addresses, CNAME alias (not at the apex — use your provider’s flattening), MX → a name, TXT for SPF/verification/DMARC, CAA for certificates, SRV for <code>mongodb+srv://</code>, HTTPS for connection hints.</li>
<li>Run <code>named-checkzone</code> and read its warnings: an MX without its final dot still loads “OK” and breaks all incoming mail.</li>
<li>Secondaries copy the zone only when the SOA serial grows: forget it and half your users see the old record.</li>
<li>Ask for each type; <code>ANY</code> is deliberately answered with <code>HINFO "RFC8482"</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1035', '📄', 'RFC 1035 — Domain names: implementation and specification', 'Record formats, the zone file syntax, SOA fields.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc2181', '📄', 'RFC 2181 — Clarifications to the DNS specification', 'Section 10: CNAME rules, MX and NS must not point to an alias.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc2782', '📄', 'RFC 2782 — DNS SRV records', 'Priority and weight, how clients choose.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9460', '📄', 'RFC 9460 — SVCB and HTTPS records', 'Connection hints (ALPN, address hints, ECH) before connecting.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8659', '📄', 'RFC 8659 — CAA resource record', 'Which certificate authorities may issue for a name.', 'Open')}
${L('https://developers.cloudflare.com/dns/cname-flattening/', '☁️', 'Cloudflare — CNAME flattening', 'How a provider publishes A/AAAA at the apex for a CNAME target.', 'Open')}
${L('https://www.mongodb.com/docs/manual/reference/connection-string/', '🍃', 'MongoDB — connection strings (mongodb+srv)', 'The driver looks up SRV and TXT records for the seed list.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc8482', '📄', 'RFC 8482 — Minimal responses to ANY queries', 'Why ANY returns HINFO "RFC8482".', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Các loại bản ghi lập trình viên đụng tới</h2>
<p class="lead">"Trỏ tên miền về máy chủ" là một bản ghi. Rồi nhà cung cấp email đòi một MX và hai TXT, nhà cấp chứng chỉ kiểm một bản ghi CAA, cơ sở dữ liệu đám mây đưa bạn chuỗi <code>mongodb+srv://</code> chỉ chạy được nhờ bản ghi SRV, và CDN muốn một CNAME — "nhưng không đặt ở gốc tên miền". Bài này đọc một tệp vùng thật từng dòng, hỏi mọi loại bản ghi lập trình viên gặp, để công cụ kiểm vùng bắt các lỗi kinh điển, và kết thúc bằng cách phổ biến nhất khiến một thay đổi đúng vẫn chỉ tới được một nửa người dùng.</p>

<h3>Một tệp vùng, từng dòng</h3>
<p><strong>Vùng (zone)</strong> là phần của cây tên do một tổ chức quản lý — ở đây là <code>labflow.test</code> và mọi thứ bên dưới. Trên BIND (và trong bản "xuất" của đa số nhà cung cấp DNS) nó là một tệp chữ. Đây là tệp thật mà ns1 của lab đang phục vụ:</p>
${src('../moi-truong/dns/vung/labflow.test.zone', 'text')}
<p>Mọi dòng bản ghi có cùng năm cột: <strong>tên</strong>, <strong>TTL</strong> (không bắt buộc — <code>$TTL 300</code> ở đầu là mặc định), <strong>lớp</strong> (luôn là <code>IN</code>), <strong>loại</strong>, <strong>dữ liệu</strong>. Hai quy tắc làm tệp dễ đọc và cũng là nguồn của đa số lỗi:</p>
<ul>
<li><code>@</code> nghĩa là chính vùng đó (<code>labflow.test.</code>), và tên <strong>không có dấu chấm cuối</strong> là tên tương đối: <code>www</code> nghĩa là <code>www.labflow.test.</code>.</li>
<li>Nên tên <strong>có</strong> dấu chấm cuối là tuyệt đối: <code>labflow.cdn.test.</code> đúng là như vậy. Quên dấu chấm thì tên vùng bị ghép thêm vào — lát nữa bạn sẽ thấy hậu quả.</li>
</ul>

<h3>Hỏi từng loại</h3>
<p><code>+noall +answer</code> bảo <code>dig</code> chỉ in các dòng trả lời:</p>
${run('c32-hoi', 'dig +noall +answer labflow.test A', 4, D)}
<ul>
<li><strong>A</strong> = một địa chỉ IPv4, <strong>AAAA</strong> = một địa chỉ IPv6 (bài 2.4). Một tên có thể có nhiều bản ghi mỗi loại (bài 3.4).</li>
<li><strong>CNAME</strong> (canonical name — tên chuẩn) = "tên này là bí danh, hãy tra tên kia". <code>www</code> trỏ vào trong vùng; <code>static</code> trỏ tới <code>labflow.cdn.test</code>, một tên trong vùng của <em>công ty khác</em> — cách thường dùng để đặt trang sau CDN hay một dịch vụ SaaS: họ đổi IP được mà không cần hỏi bạn. Resolver đi theo chuỗi và trả về tất cả (để ý TTL riêng của CDN, ngắn hơn nhiều).</li>
</ul>
${run('c32-hoi', 'dig +noall +answer labflow.test MX', 4, D)}
<ul>
<li><strong>MX</strong> (mail exchanger — máy nhận thư) = máy chủ nào nhận email gửi tới <code>@labflow.test</code>, kèm độ ưu tiên (số nhỏ hơn = thử trước). Nó phải trỏ tới một <em>tên</em> có bản ghi A/AAAA — không bao giờ trỏ thẳng tới IP, không bao giờ trỏ tới một CNAME.</li>
<li><strong>TXT</strong> = chữ tự do, dùng như bảng thông báo: <code>v=spf1 mx -all</code> là SPF ("chỉ máy chủ MX của chúng tôi được gửi thư dưới tên chúng tôi"), <code>labflow-verify=…</code> là loại mã mà Google Search Console, một SaaS hay một nhà cấp chứng chỉ yêu cầu bạn công bố để <em>chứng minh bạn kiểm soát tên miền</em>, còn <code>_dmarc</code> nói bên nhận nên làm gì với thư không qua được phép kiểm. SPF, DKIM và DMARC hoạt động ra sao là chủ đề của khoá ${EMAIL}; ở đây chỉ cần nhận ra chúng.</li>
</ul>
${run('c32-hoi', 'dig +noall +answer labflow.test CAA', 3, D)}
<ul>
<li><strong>CAA</strong> (certification authority authorization) = những nhà cấp chứng chỉ (CA) nào được cấp chứng chỉ HTTPS cho tên này. CA phải kiểm nó trước khi cấp; với <code>0 issue "letsencrypt.org"</code>, mọi CA khác phải từ chối. Không có CAA = CA nào cũng được cấp.</li>
<li><strong>SRV</strong> (service — dịch vụ) = "dịch vụ <code>_mongodb._tcp</code> của <code>db.labflow.test</code> nằm ở những máy và cổng này", kèm độ ưu tiên và trọng số. Đó chính là thứ chuỗi kết nối <code>mongodb+srv://db.labflow.test/</code> khiến driver đi tra (cộng bản ghi TXT cho tuỳ chọn) — để cơ sở dữ liệu đổi máy được mà không phải sửa cấu hình ứng dụng.</li>
<li><strong>HTTPS</strong> (RFC 9460, 2023) = gợi ý kết nối cho trình duyệt <em>trước khi</em> kết nối: ở đây, "nói HTTP/2 (<code>alpn="h2"</code>), và địa chỉ IPv4 là 203.0.113.10". Trình duyệt thấy <code>h3</code> ở đó có thể đi thẳng HTTP/3 (Chương 5).</li>
</ul>
${run('c32-hoi', 'dig +noall +answer labflow.test NS', 2, D)}
<ul>
<li><strong>NS</strong> = danh sách máy chủ tên của chính vùng (nên khớp với phần ủy quyền ở TLD trong bài 3.1).</li>
<li><strong>SOA</strong> (start of authority — khởi đầu thẩm quyền) = mỗi vùng một bản: máy chủ chính, email liên hệ (<code>hostmaster.labflow.test</code> = hostmaster@labflow.test), rồi năm con số: <strong>serial</strong> 2026110101 (phiên bản của vùng — xem cái bẫy cuối bài), <strong>refresh</strong> 3600 (máy phụ bao lâu kiểm phiên bản mới một lần), <strong>retry</strong> 600, <strong>expire</strong> 1209600 (máy phụ ngừng trả lời sau 14 ngày không liên lạc được máy chính), và <strong>minimum</strong> 300 — ngày nay dùng làm TTL cho câu trả lời "tên này không tồn tại" (bài 3.3).</li>
</ul>
${net('zone', 'records', 'vi', 'Bấm một loại bản ghi: xem dòng trong tệp vùng, câu trả lời dig, và quy tắc áp cho nó.', { tour: 'zone-records' })}

<h3>Code của bạn cũng đọc bản ghi</h3>
<p><code>dns.promises</code> của Node có một hàm cho mỗi loại — đúng những lời gọi mà thư viện gửi thư hay driver MongoDB thực hiện:</p>
${run('c32-node', 'node /tmp/ghi.mjs', 1, D)}
<p>Chạy hai lần thì thứ tự hai bản ghi SRV (và hai bản ghi TXT) có thể đổi — một lần ghi trước của bài này có <code>db2</code> đứng trước. Client phải chọn theo độ ưu tiên, rồi theo trọng số, không bao giờ theo vị trí: thứ tự bản ghi trong một câu trả lời DNS không mang ý nghĩa gì.</p>

<h3>Công cụ kiểm vùng và bốn lỗi kinh điển</h3>
<p><code>named-checkzone</code> nạp một tệp vùng y như máy chủ sẽ nạp. Hãy chạy nó trước mỗi lần reload:</p>
${run('c32-kiem', 'named-checkzone labflow.test /dnsz/src/labflow.test.zone', 1, D)}

<div class="pitfall co-tieu-de">
<p><strong>1 · "Cho chính tên miền là CNAME sang CDN."</strong> CDN bảo "thêm một CNAME trỏ tới tên của chúng tôi". Với <code>www</code> thì được. Với tên miền trần (<em>apex — đỉnh</em>, <code>labflow.test</code>) thì không thể:</p>
${run('c32-kiem', "sed 's/^@              IN A    203.0.113.10/", 2, { drop: /^# / })}
<p>Mỗi dòng lỗi chỉ vào một bản ghi khác ở đỉnh (AAAA, MX, TXT, CAA, HTTPS) không thể đứng cạnh CNAME mới — và các bản ghi SOA, NS phía trên cũng xung đột y như vậy. CNAME nghĩa là "tên này <em>không</em> có dữ liệu riêng, đi chỗ khác mà hỏi" — nên nó không thể đứng cạnh bất kỳ bản ghi nào khác ở cùng tên (RFC 1034/2181). Mà đỉnh tên miền lúc nào cũng có bản ghi khác: ít nhất là SOA và NS, thường thêm MX và TXT. Nhà cung cấp lách bằng <strong>CNAME flattening</strong> / <strong>ALIAS</strong> / <strong>ANAME</strong>: bạn khai "đỉnh → tên của CDN", và chính nhà cung cấp tra tên đích rồi công bố bản ghi A/AAAA thường ở đỉnh. Đó là tính năng của nhà cung cấp, không phải một loại bản ghi DNS.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>2 · CNAME đứng cạnh bản ghi khác.</strong> Cùng quy tắc ở bất kỳ đâu trong vùng: <code>api</code> đã có bản ghi A, thêm CNAME cho nó làm hỏng cả vùng — không chỉ tên đó:</p>
${run('c32-kiem', "printf 'api", 2, { drop: /^# / })}
</div>

<div class="pitfall co-tieu-de">
<p><strong>3 · MX trỏ tới một IP</strong>, và <strong>4 · quên dấu chấm cuối</strong> — cả hai đều "nạp OK", và đó chính là điều nguy hiểm:</p>
${run('c32-kiem', "sed 's/^@              IN MX   10 mail/@              IN MX   10 203", 2, { drop: /^# / })}
${run('c32-kiem', "sed 's/^@              IN MX   10 mail$", 2, { drop: /^# / })}
<p>Ở lỗi cuối, <code>mail.labflow.test</code> không có dấu chấm đã thành <code>mail.labflow.test.labflow.test</code> — một tên không tồn tại. Vùng nạp được, trang web chạy, và mọi email gửi tới đều bị trả lại. Hãy đọc các cảnh báo, đừng chỉ nhìn chữ <code>OK</code> cuối cùng.</p>
</div>

<h3>Một vùng thật: cuongthai.com</h3>
<p>DNS của chính website này do Cloudflare giữ. Vài bản ghi, lấy từ Internet thật (câu hỏi TXT được lọc chỉ còn dòng SPF):</p>
${run('c32-that', 'dig +noall +answer cuongthai.com A', 10, D)}
<ul>
<li>Bản ghi A là chính VPS (<code>160.187.1.208</code>, không đi qua proxy — bài 3.4). MX tới dịch vụ chuyển tiếp thư của Porkbun; SPF cho Porkbun và Amazon SES gửi thư dưới tên <code>cuongthai.com</code>.</li>
<li><code>p=none</code> trong DMARC: bên nhận chỉ <em>báo cáo</em> thư lỗi, không từ chối — bước đầu phổ biến, nên siết dần về sau.</li>
<li>Không có bản ghi CAA: CA nào cũng có thể cấp chứng chỉ cho tên này. Thêm một dòng (cho CA đang thật sự dùng) là một bước gia cố một dòng.</li>
<li><code>media.cuongthai.com</code> (phục vụ qua Cloudflare) có bản ghi HTTPS do Cloudflare tự thêm: ALPN, gợi ý địa chỉ, và một khoá <code>ech=</code> cho Encrypted Client Hello (Chương 6).</li>
<li>Con số cuối của SOA là 1800: câu trả lời "không tồn tại" được cache tới 30 phút (bài 3.3).</li>
<li>Hỏi loại <code>ANY</code> ("cho tôi tất cả") nhận về một <code>HINFO "RFC8482"</code> giả: các nhà cung cấp lớn ngừng trả lời ANY vì nó bị lạm dụng để khuếch đại tấn công DDoS (RFC 8482). Hãy hỏi rõ từng loại.</li>
<li><code>dig -x 1.1.1.1</code> hỏi chiều ngược lại (<strong>PTR</strong>, DNS ngược): địa chỉ → tên, do chủ của dải IP quản lý. Máy chủ thư có kiểm nó; với VPS thì bạn đặt ở trang quản trị của nhà cung cấp hosting, không phải trong vùng của bạn.</li>
</ul>

<h3>Hai máy chủ, một vùng: một thay đổi lan đi thế nào</h3>
<p>Tên miền nào cũng nên có ít nhất hai máy chủ tên (RFC 2182 còn đòi chúng nằm ở các mạng khác nhau). Máy <strong>chính (primary)</strong> ns1 của LabFlow giữ tệp; máy <strong>phụ (secondary)</strong> ns2 chép lại bằng <strong>chuyển vùng (zone transfer)</strong> (AXFR, qua TCP cổng 53). Không phải ai cũng được chép vùng:</p>
${run('c32-axfr', 'dig @203.0.113.53', 1, D)}
${run('c32-axfr-ns2', 'dig @203.0.113.53', 2, D)}
<p>Laptop bị từ chối (<code>allow-transfer</code> chỉ ghi ns2 — cho chép vùng công khai là trao cho bất kỳ ai toàn bộ danh sách tên máy của bạn). ns2 chép được và phục vụ cùng serial. Khi ns1 nạp lại một vùng, nó gửi <strong>NOTIFY</strong> cho ns2; ns2 so serial và chỉ chép <em>khi serial của máy chính lớn hơn</em>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Tôi đổi bản ghi rồi, mà một nửa người dùng vẫn nhận bản cũ."</strong> Trên ns1, ai đó chuyển <code>api</code> sang máy biên Singapore và quên serial:</p>
${run('c32-serial-quen', 'sed -i', 3, D)}
${run('c32-serial-hoi', 'dig', 4, D)}
<p>ns1 nói <code>.11</code>, ns2 vẫn nói <code>.10</code>, với <em>cùng</em> một serial — nên ns2 chẳng có lý do gì để chép. Resolver chọn máy nào cũng được, nên mỗi người dùng nhận câu này hoặc câu kia tuỳ resolver của họ tình cờ hỏi máy nào: kiểu kinh điển "máy tôi chạy, máy đồng nghiệp thì không". Cách sửa là serial (quy ước: <code>YYYYMMDDnn</code>, ngày + số thứ tự lần sửa trong ngày):</p>
${run('c32-serial-sua', 'sed -i', 3, D)}
${run('c32-serial-hoi2', 'dig', 4, D)}
${run('c32-ns2-log', 'docker logs', 1, D)}
<p>Nhận NOTIFY, serial lớn hơn, chép xong trong 2 ms — hai máy đã thống nhất. Các nhà cung cấp DNS quản lý sẵn (Cloudflare, Route 53) làm việc này cho bạn; với BIND tự chạy, hoặc với các công cụ "DNS dạng mã" ghi ra tệp vùng, tăng serial là việc của bạn.</p>
</div>
${net('zone', 'serial', 'vi', 'Sửa một bản ghi trên máy chính, có và không tăng serial, rồi xem máy phụ phục vụ gì.', { tour: 'zone-serial' })}

<h3>Nó nằm ở đâu trong máy tính</h3>
<ul>
<li>BIND đọc tệp vùng một lần và giữ trong RAM dưới dạng cây đánh chỉ mục theo tên; mỗi câu trả lời là một lần tra trong cây đó. Vì vậy sửa tệp chẳng thay đổi gì cho tới khi <code>rndc reload</code>.</li>
<li>Một câu hỏi và câu trả lời là mỗi bên một gói UDP (dòng <code>MSG SIZE</code> trong dig); chuyển vùng là một kết nối TCP tới cổng 53 truyền mọi bản ghi — ở đây 74 bản ghi trong một thông điệp 5,1 kB.</li>
<li>Trên ns2 bản chép được lưu thành tệp trong <code>/var/cache/bind</code>, nên khởi động lại không cần tới máy chính.</li>
</ul>
${cauNoi('vi', { ...NWC, bai: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', so: '14.2', ten: 'Web, email, DNS, DHCP và chia sẻ tệp', giong: 'các loại bản ghi chính (A, AAAA, CNAME, MX, TXT, NS) và chúng dùng để làm gì', khac: 'NWC204 liệt kê các loại kèm output dig thật của một trang', them: 'một tệp vùng đầy đủ để đọc và sửa, SRV cho mongodb+srv, bản ghi CAA và HTTPS, quy tắc CNAME ở đỉnh kiểm bằng named-checkzone, lỗi quên dấu chấm mà vẫn nạp OK, và chuyển vùng chính/phụ với sự cố quên tăng serial' })}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> LabFlow mua một dịch vụ trang trạng thái. Trang hướng dẫn của họ ghi: "Tạo <code>status.labflow.test</code> là CNAME tới <code>labflow.cdn.test</code> và thêm bản ghi TXT <code>status-verify=81c2</code> ở <code>labflow.test</code>." Quản lý của bạn thêm: "Và trỏ luôn tên miền chính sang CDN bằng CNAME."</p>
<ol>
<li>Trên <code>nfi-ns</code>, chép <code>/dnsz/src/labflow.test.zone</code> sang <code>/tmp/new.zone</code>, thêm hai bản ghi, tăng serial, và chạy <code>named-checkzone</code>.</li>
<li>Thử yêu cầu của quản lý ở một bản chép khác (<code>@ IN CNAME labflow.cdn.test.</code>, bỏ A/AAAA ở đỉnh). Đọc lỗi. Viết một câu cho quản lý kèm phương án thay thế.</li>
<li>Áp bản chép đúng (<code>cp /tmp/new.zone /dnsz/src/labflow.test.zone</code>, rồi <code>bash /lab/k/moi-truong/dns/ky.sh labflow.test &amp;&amp; rndc reload labflow.test</code>).</li>
<li>Từ laptop, chứng minh cả hai máy chủ phục vụ bản ghi mới: <code>dig +short @203.0.113.53 status.labflow.test</code>, tương tự với <code>@203.0.113.54</code>, và <code>dig +short TXT labflow.test</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> cả ns1 lẫn ns2 trả lời CNAME với serial mới, TXT có ba giá trị, và câu của bạn giải thích được vì sao đỉnh tên miền không thể là CNAME và nhà cung cấp DNS đưa ra cách gì thay thế.</p>
<details><summary>Lời giải</summary>
<p>1) Thêm <code>status IN CNAME labflow.cdn.test.</code> (dấu chấm cuối!) và <code>@ IN TXT "status-verify=81c2"</code>; đổi <code>2026110101</code> thành <code>2026110102</code>; <code>named-checkzone labflow.test /tmp/new.zone</code> in <code>loaded serial 2026110102</code> và <code>OK</code>. 2) <code>CNAME and other data</code>: đỉnh phải giữ bản ghi SOA, NS, MX và TXT, mà CNAME không thể đứng chung với bất kỳ bản ghi nào. "Tên miền trần không thể là CNAME; nhà cung cấp DNS của ta có CNAME flattening (ALIAS), công bố địa chỉ của CDN dưới dạng bản ghi A — hoặc ta giữ bản ghi A và dùng www cho CDN." 3–4) Cả hai máy trả lời <code>labflow.cdn.test.</code> và <code>203.0.113.10</code>; <code>dig +short @203.0.113.54 labflow.test SOA</code> cho thấy serial mới. Nếu ns2 vẫn trả NXDOMAIN, bạn đã quên serial — tăng tiếp và reload.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
    ['zone (vùng)', 'Phần của cây tên do một tổ chức quản lý, lưu thành tệp vùng trên máy chủ tên của họ.'],
    ['CNAME (bí danh)', 'Bí danh: “hãy tra tên kia”. Không đứng chung với bản ghi khác ⇒ không bao giờ ở đỉnh.'],
    ['apex (đỉnh tên miền)', 'Tên miền trần (labflow.test). Luôn có bản ghi SOA và NS.'],
    ['CNAME flattening / ALIAS', 'Tính năng của nhà cung cấp: tra tên đích rồi công bố A/AAAA của nó ở đỉnh.'],
    ['MX / TXT / CAA', 'Máy nhận thư của tên miền / chữ tự do (SPF, xác minh, DMARC) / các CA được phép cấp chứng chỉ.'],
    ['SRV', 'Máy và cổng của một dịch vụ có tên (_mongodb._tcp…) — thứ mongodb+srv:// đi tra.'],
    ['SOA serial (số hiệu phiên bản vùng)', 'Số phiên bản của vùng; máy phụ chỉ chép khi nó tăng.'],
    ['AXFR / NOTIFY', 'Chuyển toàn bộ vùng qua TCP / thông báo “tôi vừa đổi” của máy chính gửi máy phụ.'],
  ])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dòng bản ghi = tên, TTL, IN, loại, dữ liệu; tên không có dấu chấm cuối là tương đối theo vùng.</li>
<li>A/AAAA là địa chỉ, CNAME là bí danh (không ở đỉnh — dùng flattening của nhà cung cấp), MX → một tên, TXT cho SPF/xác minh/DMARC, CAA cho chứng chỉ, SRV cho <code>mongodb+srv://</code>, HTTPS cho gợi ý kết nối.</li>
<li>Chạy <code>named-checkzone</code> và đọc cảnh báo: MX thiếu dấu chấm cuối vẫn nạp “OK” và làm hỏng mọi thư gửi tới.</li>
<li>Máy phụ chỉ chép vùng khi serial SOA tăng: quên nó là một nửa người dùng thấy bản ghi cũ.</li>
<li>Hãy hỏi từng loại; <code>ANY</code> được cố ý trả bằng <code>HINFO "RFC8482"</code>.</li>
</ul>
${L('https://www.rfc-editor.org/rfc/rfc1035', '📄', 'RFC 1035 — Tên miền: hiện thực và đặc tả', 'Định dạng bản ghi, cú pháp tệp vùng, các trường SOA.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc2181', '📄', 'RFC 2181 — Làm rõ đặc tả DNS', 'Mục 10: luật CNAME, MX và NS không được trỏ tới bí danh.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc2782', '📄', 'RFC 2782 — Bản ghi SRV', 'Độ ưu tiên, trọng số, client chọn thế nào.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9460', '📄', 'RFC 9460 — Bản ghi SVCB và HTTPS', 'Gợi ý kết nối (ALPN, gợi ý địa chỉ, ECH) trước khi kết nối.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8659', '📄', 'RFC 8659 — Bản ghi CAA', 'Những CA nào được cấp chứng chỉ cho một tên.', 'Mở')}
${L('https://developers.cloudflare.com/dns/cname-flattening/', '☁️', 'Cloudflare — CNAME flattening', 'Nhà cung cấp công bố A/AAAA ở đỉnh cho một đích CNAME ra sao.', 'Mở')}
${L('https://www.mongodb.com/docs/manual/reference/connection-string/', '🍃', 'MongoDB — chuỗi kết nối (mongodb+srv)', 'Driver tra bản ghi SRV và TXT để lấy danh sách máy.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc8482', '📄', 'RFC 8482 — Trả lời tối giản cho câu hỏi ANY', 'Vì sao ANY trả về HINFO "RFC8482".', 'Mở')}
</div>
`,
};
