/**
 * 9.1 — Sự cố thật: làn sóng tống tiền 2017 và CVE-2025-14847 (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s09-1-lo'] (kịch bản demo/s09/s09-1-lo.txt; MongoDB 8.0.38 + ảnh cũ mongo:8.0.16 chỉ để tự kiểm, --network none).
 * Khối: 0 ss · 1 getCmdLineOpts.net · 2 argv ảnh chính thức (--bind_ip_all) · 3 PortBindings mgo-lab · 4 PortBindings -p không IP · 5 version
 * · 6 hello compression · 7 networkMessageCompressors snappy,zstd · 8 tu-kiem mgo-lab (5 LỖI) · 9 tu-kiem mgo-cung (5 OK) · 10 tu-kiem 8.0.16 ⇒ LỖI CVE.
 * CHỈ PHÒNG THỦ: bài không mô tả cách khai thác CVE-2025-14847 — chỉ nhận diện, vá, giảm thiểu, kiểm.
 * Kiểm trùng: 0.9 đã tái hiện ba lệnh tống tiền 2017 trên cổng 47018 ⇒ ở đây chỉ nhắc + liên kết, đi sâu vào "tự kiểm mình có hở không".
 * Nguồn GET kiểm 24/11/2026: NVD API CVE-2025-14847 (công bố 19/12/2025; CVSS 3.1 7.5, 4.0 8.7; dải phiên bản; CISA KEV 29/12/2025, SSVC exploitation active),
 * jira SERVER-115508 (200), Docker Docs packet-filtering-firewalls (Docker và ufw không tương thích; firewalld zone docker ACCEPT), MongoDB Docs security-checklist,
 * KrebsOnSecurity 01/2017 (đã dùng ở 0.9). cisa.gov trả 403 cho máy ⇒ dẫn qua NVD.
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's09-1-lo';

const CUNG = `# mgo-cung: cùng ảnh mongo:8.0, chỉ khác tham số khởi động (Bài 9.2 dạy phần tạo tài khoản)
docker run -d --name mgo-cung --network none mongo:8.0 \\
  mongod --auth --bind_ip 127.0.0.1 --networkMessageCompressors snappy,zstd --noscripting`;

const CONF = `# /etc/mongod.conf — cùng các thiết lập ở dạng tệp cấu hình (máy ảo / máy thật, không Docker)
net:
  port: 27017
  bindIp: 127.0.0.1,10.0.1.15        # chỉ localhost + IP mạng riêng của máy ứng dụng gọi tới
  compression:
    compressors: snappy,zstd         # bỏ zlib — giảm thiểu CVE-2025-14847 trong lúc chờ nâng cấp
security:
  authorization: enabled
  javascriptEnabled: false           # tắt $where / $function / $accumulator (Bài 5.5, 8.3)`;

export default {
  title: '9.1 — Real incidents: the 2017 ransom wave and CVE-2025-14847|||9.1 — Sự cố thật: làn sóng tống tiền 2017 và CVE-2025-14847',
  slug: 'mgo-9-1-su-co-that',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Hai sự cố thật làm khung cho cả chương: làn sóng tống tiền MongoDB 2017 (máy mở cổng, không mật khẩu) và CVE-2025-14847 (MongoBleed, 12/2025 — máy chủ chưa vá để lộ vùng nhớ cho client CHƯA đăng nhập, CISA xác nhận đang bị khai thác). Đo thật hai lớp "nghe ở đâu": bindIp của mongod và cổng Docker xuất ra máy (ảnh chính thức tự thêm --bind_ip_all; -p không ghi IP mở mọi giao diện và vượt qua ufw/firewalld), kiểm phiên bản, tắt zlib bằng networkMessageCompressors, và một script tự kiểm sáu mục chạy được trên mọi máy của mình — máy lab báo 5 LỖI, máy đã khoá báo 5 OK, ảnh 8.0.16 cũ bị bắt lỗi CVE.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Real incidents: the 2017 ransom wave and CVE-2025-14847</h2>
<p class="lead">Most MongoDB disasters did not need a clever exploit. In 2017 tens of thousands of servers were wiped by three ordinary commands because they were reachable from the internet with no password. In December 2025 a bug in how the server decompressed network messages let anyone who could reach the port read pieces of server memory <em>before logging in</em>. Both incidents start from the same question, and this lesson teaches you to answer it with commands instead of hope: <strong>who can reach my database, and what version is it running?</strong></p>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-0-9-bat-dau-hoc-the-nao', title: 'Lesson 0.9 — the 2017 ransom wave replayed on port 47018', sub: 'list databases, dump, drop, leave a ransom note — and the same commands failing once a password is set' })}

<h3>An everyday picture: a house with three doors</h3>
<p>Your data is a house. <strong>bindIp</strong> decides which street the front door faces — a private lane (127.0.0.1) or the main road (every interface). <strong>Authentication</strong> is the lock on that door. A <strong>vulnerability like CVE-2025-14847</strong> is a crack in the wall next to the door: it doesn't matter how good the lock is if people can reach the wall. The 2017 victims left the door on the main road unlocked. The 2025 victims had locked doors on the main road and a cracked wall. Keeping the door off the main road protects you from both.</p>

<h3>1. Layer one: where mongod listens (bindIp)</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>On the host, the lab port is published only on <code>127.0.0.1:47017</code>. Inside the container, though, mongod listens on <code>*</code> — every interface. The second command shows why: the official <code>mongo</code> Docker image starts <code>mongod --bind_ip_all</code> by itself, even when you pass nothing. That is reasonable inside a container (its network is private), but it means the protection now lives entirely in the <em>next</em> layer: what Docker publishes on the host. Outside Docker, mongod has defaulted to <code>localhost</code> since 3.6 — the 2017 victims were mostly older versions or people who had widened bindIp themselves.</p>

<h3>2. Layer two: what Docker publishes — and why your firewall may not help</h3>
${lenh(K, 3)}
${lenh(K, 4)}
<p>Same image, two ways to write <code>-p</code>. With <code>127.0.0.1:47017:27017</code> the port binds to the loopback address only (<code>HostIp: "127.0.0.1"</code>). With the short form <code>-p 47022:27017</code> the host IP is empty, which means <em>every interface</em>: Wi-Fi, LAN, and a public IP if the machine has one. (We only created that container to inspect it; it was never started.)</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "but I have a firewall".</strong> Docker's own documentation says Docker and ufw "use firewall rules in ways that make them incompatible": traffic to a published port is diverted <em>before</em> it reaches ufw's rules. With firewalld, Docker creates a <code>docker</code> zone with target ACCEPT. So <code>ufw deny 27017</code> on an Ubuntu VPS does not protect <code>-p 27017:27017</code>. The reliable fix is to never publish a database port on a public interface: bind to 127.0.0.1, or put the app and the database on a private Docker network and publish nothing.</p>
</div>
${nguon('🐳', 'Docker Docs — Packet filtering and firewalls', 'Docker and ufw are incompatible; firewalld gets a docker zone with target ACCEPT', 'https://docs.docker.com/engine/network/packet-filtering-firewalls/')}

<h3>3. The 2017 ransom wave in four steps (recap)</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Scan</span><span class="lz-t">Shodan / masscan list IPs answering on 27017</span><span class="lz-d">no exploit: the MongoDB handshake itself says "I am MongoDB, version x"</span></div>
  <div class="lz-step"><span class="lz-k">2 · Look</span><span class="lz-t">listDatabases, find</span><span class="lz-d">no password needed — authorization was disabled</span></div>
  <div class="lz-step"><span class="lz-k">3 · Wipe</span><span class="lz-t">dropDatabase, insert a note</span><span class="lz-d">often without even copying the data first</span></div>
  <div class="lz-step"><span class="lz-k">4 · Extort</span><span class="lz-t">"send 0.2 BTC"</span><span class="lz-d">competing gangs overwrote each other's notes — payers got nothing back</span></div>
</div>
<p>KrebsOnSecurity counted more than 52,000 exposed servers on Shodan and at least 29,000 wiped. Every step is blocked by <em>one</em> of the layers above: no published port ⇒ step 1 finds nothing; authorization on ⇒ step 2 fails. Lesson 0.9 ran all four steps on your own machine.</p>

<h3>4. CVE-2025-14847 ("MongoBleed"): when the lock is not enough</h3>
<p>Published on 19 December 2025. In NVD's words: <em>"Mismatched length fields in Zlib compressed protocol headers may allow a read of uninitialized heap memory by an unauthenticated client."</em> In plain terms: clients may compress their messages; the server trusted a length written inside a compressed message, and could send back a chunk of its own memory that was never filled in for that reply. That memory may contain leftovers of other connections — queries, documents, credentials. The key word is <strong>unauthenticated</strong>: a password does not stop it, because it happens before login.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Severity</span><span class="lz-t">CVSS 3.1: 7.5 High · CVSS 4.0: 8.7</span><span class="lz-d">network, low complexity, no privileges, confidentiality high</span></div>
  <div class="lz-step"><span class="lz-k">Fixed in</span><span class="lz-t">8.2.3 · 8.0.17 · 7.0.28 · 6.0.27 · 5.0.32 · 4.4.30</span><span class="lz-d">4.2, 4.0, 3.6: affected, no fix — those branches are end-of-life ⇒ upgrade</span></div>
  <div class="lz-step"><span class="lz-k">29/12/2025</span><span class="lz-t">CISA adds it to the Known Exploited Vulnerabilities catalog</span><span class="lz-d">"exploitation: active, automatable: yes" — ten days after publication</span></div>
</div>
<p>This course does not show how the bug is exploited. What matters for you as a developer is the defence, and every step of it can be checked with a command:</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
<p>The lab runs 8.0.38, so it is patched. The second command asks the server which compressors it accepts: zlib, snappy and zstd — the default. The third is a mongod started with <code>--networkMessageCompressors snappy,zstd</code>: a client offering only zlib gets no compression, and a client offering zlib or zstd is given zstd. Removing zlib was the vendor's interim mitigation for servers that could not be upgraded immediately. The real fix is the upgrade, though. And the best protection against the <em>next</em> pre-auth bug is the same as in 2017: nobody untrusted can reach the port.</p>
${nguon('🛡️', 'NVD — CVE-2025-14847', 'zlib length mismatch ⇒ unauthenticated read of uninitialized heap memory; fixed versions per branch', 'https://nvd.nist.gov/vuln/detail/CVE-2025-14847')}
${nguon('🐞', 'MongoDB Jira — SERVER-115508', 'the server ticket referenced by the CVE', 'https://jira.mongodb.org/browse/SERVER-115508')}

<h3>5. A self-check script you can run on every server you own</h3>
<p><code>_demo/tu-kiem.js</code> only <em>reads</em> configuration (<code>getCmdLineOpts</code>, <code>db.version()</code>) and prints six lines: bindIp, authorization, the CVE-2025-14847 version check, compressors, server-side JavaScript, TLS. It needs only the <code>clusterMonitor</code> role.</p>
${lenh(K, 8)}
${ma('bash', CUNG)}
${lenh(K, 9)}
${lenh(K, 10)}
<p>The lab fails five checks out of six — by design, it is a learning sandbox reachable only from 127.0.0.1. <code>mgo-cung</code> is the same image with four extra flags and passes five; TLS comes in Lesson 9.4. The last run is an old image (<code>mongo:8.0.16</code>) that happened to be on this machine: the script catches it immediately. In a company with fifty servers, this is the difference between "I think we're patched" and a list you can attach to the ticket.</p>
${ma('yaml', CONF)}
${nguon('📘', 'MongoDB Docs — Security Checklist', 'access control, TLS, limit network exposure, encrypt, audit, run with a dedicated user, keep up to date', 'https://www.mongodb.com/docs/manual/administration/security-checklist/')}

<h3>🕵️ Attacker's view: why "patch next sprint" is too slow</h3>
<p>Both incidents share a timeline. Scanning the whole IPv4 internet for one port takes minutes, so the moment a weakness is public, attackers check <em>everyone</em> — not just big companies. For CVE-2025-14847, the gap between publication (19/12) and confirmed active exploitation (29/12) was ten days, over a holiday season. Defences you can actually do: (1) never publish 27017 publicly — then a pre-auth bug needs a foothold inside your network first; (2) subscribe to the MongoDB security alerts and NVD for your version; (3) keep the image tag pinned <em>and</em> updated (a pinned <code>mongo:8.0.16</code> never receives a fix); (4) run the self-check on every environment, including "temporary" demo servers.</p>

<h3>💼 On the job: "the dev database is empty and there's a READ_ME collection"</h3>
<p>This exact ticket still happens on outsourcing projects, usually on a staging VPS someone set up with <code>docker run -p 27017:27017 mongo</code>. The calm sequence: (1) don't pay — in 2017 payers got nothing; (2) take the port off the network (<code>docker rm -f</code> or rebind to 127.0.0.1) <em>before</em> investigating; (3) save the mongod log — connection lines show the attacker's IP and driver name; (4) restore from the last backup (Chapter 10) and check what else used the same credentials — rotate them; (5) write a short postmortem with the cause ("published port, no auth") and the fix ("private network, auth, self-check in CI"). If personal data was in that database, tell your lead immediately: personal-data laws (in Vietnam and in your client's country) can require notifying the authorities and the affected people within a short deadline — that decision belongs to the lead and the legal team, but the clock starts when you find it.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"Our MongoDB has a strong password. Are we safe if port 27017 is open to the internet?"</strong> — No. CVE-2025-14847 was pre-authentication: the password check never ran. Also brute force and credential reuse. Defence in depth: network first, then auth, then patching.</li>
<li><strong>"You published <code>-p 27017:27017</code> on Ubuntu with ufw denying 27017. Is the port closed?"</strong> — No: Docker's rules are evaluated before ufw's. Bind to 127.0.0.1 or don't publish; verify with <code>ss -ltn</code> and from another machine.</li>
<li><strong>"How do you know every server is patched for a given CVE?"</strong> — Read the fixed versions per branch from NVD/vendor, collect <code>db.version()</code> from every environment with a script, compare, attach the list to the ticket. Pin image tags, update them deliberately.</li>
<li><strong>"What was the root cause of the 2017 wave?"</strong> — Configuration, not a bug: authorization disabled and the port reachable from the internet. Three normal commands were enough.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Run <code>tu-kiem.js</code> against the lab and against <code>mgo-cung</code> (commands above). Then remove <code>--noscripting</code> from mgo-cung and predict which line changes before running it.</li>
<li>List every port your machine publishes from Docker: <code>docker ps --format '{{.Names}} {{.Ports}}'</code>. Which entries start with <code>0.0.0.0</code> or <code>[::]</code>? For each, decide: rebind to 127.0.0.1, move to a private network, or keep (and why).</li>
<li>Write the version table for CVE-2025-14847 from NVD into a small function <code>daVa(version)</code> and test it on 8.0.16, 8.0.17, 7.0.27, 4.2.25.</li>
</ol>
${loiGiai('Suggested answers', `<p>1. Only the <code>javascriptEnabled</code> line flips to LỖI ("true (default)"); everything else stays OK. Each flag maps to exactly one line — that is what makes the script useful in review.</p>
<p>2. Typical findings: databases, Redis, admin UIs published as <code>0.0.0.0:…</code> from tutorials. Databases should almost never be published: the app container reaches them over a Docker network by service name. Keep only what a browser must reach (the web app, behind a reverse proxy).</p>
<p>3. <code>const VA = { '8.2': '8.2.3', '8.0': '8.0.17', '7.0': '7.0.28', '6.0': '6.0.27', '5.0': '5.0.32', '4.4': '4.4.30' }</code>; split major.minor, unknown branch ⇒ false (no fix exists). Results: false, true, false, false. The tu-kiem.js file contains the same logic.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['bindIp', 'Network interfaces mongod listens on. Default localhost outside Docker; the official image passes --bind_ip_all.'],
  ['Published port (-p)', 'Docker forwards a host port to the container. Without an IP it binds every host interface.'],
  ['Pre-authentication bug', 'A flaw reachable before login — a password does not protect against it.'],
  ['CVE-2025-14847 (MongoBleed)', 'zlib header length mismatch ⇒ uninitialized heap memory sent to an unauthenticated client. Fixed 8.0.17 / 8.2.3 / 7.0.28 …'],
  ['networkMessageCompressors', 'Compressors mongod accepts (snappy, zstd, zlib). Removing zlib was the interim mitigation.'],
  ['CISA KEV', 'US catalog of vulnerabilities confirmed exploited in the wild; a strong "patch now" signal.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Ask two questions with commands, not memory: who can reach the port (<code>ss -ltn</code>, <code>docker inspect</code>), and what version runs (<code>db.version()</code>).</li>
<li>The official image listens on every interface inside the container; protection is in what you publish. Always write <code>127.0.0.1:</code> in <code>-p</code>, or don't publish.</li>
<li>Docker bypasses ufw/firewalld rules for published ports.</li>
<li>2017: configuration (no auth + open port). 2025: a pre-auth bug — upgrade, drop zlib meanwhile, and keep the port private.</li>
<li>Automate the check (tu-kiem.js) and run it on every environment.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Sự cố thật: làn sóng tống tiền 2017 và CVE-2025-14847</h2>
<p class="lead">Phần lớn thảm hoạ MongoDB không cần kỹ thuật tấn công cao siêu. Năm 2017, hàng chục nghìn máy chủ bị xoá sạch chỉ bằng ba câu lệnh bình thường, vì chúng mở ra Internet mà không có mật khẩu. Tháng 12/2025, một lỗi trong cách máy chủ giải nén gói tin mạng cho phép bất kỳ ai tới được cổng đọc trộm một phần bộ nhớ máy chủ, <em>ngay cả trước khi đăng nhập</em>. Cả hai sự cố đều bắt đầu từ cùng một câu hỏi. Bài này dạy bạn trả lời câu hỏi đó bằng câu lệnh, thay vì bằng hy vọng: <strong>ai tới được database của mình, và nó đang chạy phiên bản nào?</strong></p>
${lienKet({ khoa: 'mongodb', bai: 'mgo-0-9-bat-dau-hoc-the-nao', title: 'Bài 0.9 — làn sóng tống tiền 2017 tái hiện trên cổng 47018', sub: 'liệt kê database, đọc, xoá, để lại lời nhắn tống tiền — và cùng các lệnh đó thất bại khi có mật khẩu' })}

<h3>Hình ảnh đời thường: ngôi nhà và ba lớp cửa</h3>
<p>Dữ liệu của bạn là một ngôi nhà. <strong>bindIp</strong> quyết định cửa chính quay ra đâu: ra ngõ riêng (127.0.0.1) hay ra mặt đường lớn (mọi giao diện mạng). <strong>Xác thực</strong> là ổ khoá trên cánh cửa đó. Còn <strong>một lỗ hổng như CVE-2025-14847</strong> giống vết nứt trên bức tường cạnh cửa: khoá tốt đến mấy cũng vô ích nếu người lạ đứng sát được bức tường. Nạn nhân năm 2017 để cửa quay ra mặt đường mà không khoá. Nạn nhân năm 2025 đã khoá cửa, nhưng cửa vẫn quay ra mặt đường và tường thì nứt. Giữ cửa tránh xa mặt đường bảo vệ bạn khỏi cả hai.</p>

<h3>1. Lớp thứ nhất: mongod nghe ở đâu (bindIp)</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
<p>Trên máy chủ (máy host), cổng của lab chỉ mở ở <code>127.0.0.1:47017</code>. Nhưng bên trong container, mongod lại nghe ở <code>*</code>, tức mọi giao diện. Lệnh thứ hai cho thấy lý do: ảnh Docker chính thức <code>mongo</code> tự chạy <code>mongod --bind_ip_all</code>, kể cả khi bạn không truyền tham số nào. Trong container thì điều đó hợp lý, vì mạng của container là mạng riêng. Nhưng như vậy mọi sự bảo vệ dồn hết sang lớp <em>tiếp theo</em>: Docker xuất cổng gì ra máy host. Ngoài Docker, mongod mặc định chỉ nghe <code>localhost</code> từ bản 3.6. Nạn nhân 2017 phần lớn chạy bản cũ hơn, hoặc tự nới bindIp ra.</p>

<h3>2. Lớp thứ hai: Docker xuất cổng gì — và vì sao tường lửa có thể không cứu bạn</h3>
${lenh(K, 3)}
${lenh(K, 4)}
<p>Cùng một ảnh, hai cách viết <code>-p</code>. Viết <code>127.0.0.1:47017:27017</code> thì cổng chỉ gắn vào địa chỉ loopback (<code>HostIp: "127.0.0.1"</code>). Viết gọn <code>-p 47022:27017</code> thì HostIp rỗng, nghĩa là <em>mọi giao diện</em>: Wi-Fi, mạng LAN, và cả IP công khai nếu máy có. (Container này ta chỉ tạo ra để xem cấu hình, không hề khởi động.)</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "nhưng mình có tường lửa mà".</strong> Chính tài liệu Docker viết rằng Docker và ufw "dùng luật tường lửa theo cách không tương thích với nhau": lưu lượng tới cổng đã xuất bị chuyển hướng <em>trước khi</em> đi qua luật của ufw. Với firewalld, Docker tạo hẳn một zone <code>docker</code> có target ACCEPT. Vậy nên trên VPS Ubuntu, <code>ufw deny 27017</code> không che được <code>-p 27017:27017</code>. Cách chắc chắn là không bao giờ xuất cổng database ra giao diện công khai: gắn vào 127.0.0.1, hoặc cho ứng dụng và database chung một mạng Docker riêng rồi không xuất cổng nào cả.</p>
</div>
${nguon('🐳', 'Docker Docs — Packet filtering and firewalls', 'Docker và ufw không tương thích; firewalld có zone docker với target ACCEPT', 'https://docs.docker.com/engine/network/packet-filtering-firewalls/')}

<h3>3. Làn sóng tống tiền 2017 trong bốn bước (nhắc lại)</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Quét</span><span class="lz-t">Shodan / masscan liệt kê IP trả lời ở cổng 27017</span><span class="lz-d">không cần khai thác gì: chính bước bắt tay của MongoDB đã khai "tôi là MongoDB, bản x"</span></div>
  <div class="lz-step"><span class="lz-k">2 · Xem</span><span class="lz-t">listDatabases, find</span><span class="lz-d">không cần mật khẩu — vì authorization đang tắt</span></div>
  <div class="lz-step"><span class="lz-k">3 · Xoá</span><span class="lz-t">dropDatabase, chèn một lời nhắn</span><span class="lz-d">nhiều khi xoá luôn mà không chép dữ liệu về trước</span></div>
  <div class="lz-step"><span class="lz-k">4 · Tống tiền</span><span class="lz-t">"gửi 0,2 BTC"</span><span class="lz-d">các nhóm đè lời nhắn của nhau — người trả tiền không lấy lại được gì</span></div>
</div>
<p>KrebsOnSecurity đếm được hơn 52.000 máy mở trên Shodan, và ít nhất 29.000 máy đã bị xoá. Mỗi bước đều bị chặn bởi <em>một</em> trong hai lớp ở trên: không xuất cổng thì bước 1 không thấy gì, bật authorization thì bước 2 thất bại. Bài 0.9 đã chạy đủ bốn bước trên chính máy bạn.</p>

<h3>4. CVE-2025-14847 ("MongoBleed"): khi ổ khoá thôi chưa đủ</h3>
<p>Lỗ hổng công bố ngày 19/12/2025. NVD mô tả: <em>"Mismatched length fields in Zlib compressed protocol headers may allow a read of uninitialized heap memory by an unauthenticated client."</em> Nói đơn giản: client được phép nén gói tin gửi lên. Máy chủ lại tin một con số độ dài ghi bên trong gói nén, nên có thể gửi trả cả một khúc bộ nhớ chưa từng được ghi cho câu trả lời đó. Khúc bộ nhớ ấy có thể còn sót dữ liệu của kết nối khác: truy vấn, tài liệu, thông tin đăng nhập. Từ khoá quan trọng nhất là <strong>chưa xác thực</strong>: có mật khẩu cũng không chặn được, vì lỗi xảy ra trước bước đăng nhập.</p>
<p>Liên tưởng: bạn gửi bưu điện một phong bì ghi "bên trong có 10 trang", nhưng thật ra chỉ có 1 trang. Nhân viên tin con số trên phong bì, nên gửi trả bạn đủ 10 trang. 9 trang còn lại là giấy nháp vớ được trên bàn, có khi là thư của người khác.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Mức độ</span><span class="lz-t">CVSS 3.1: 7,5 High · CVSS 4.0: 8,7</span><span class="lz-d">qua mạng, dễ thực hiện, không cần quyền, mức lộ bí mật cao</span></div>
  <div class="lz-step"><span class="lz-k">Bản vá</span><span class="lz-t">8.2.3 · 8.0.17 · 7.0.28 · 6.0.27 · 5.0.32 · 4.4.30</span><span class="lz-d">4.2, 4.0, 3.6: bị ảnh hưởng nhưng không có bản vá — các nhánh này đã hết hỗ trợ ⇒ phải nâng cấp</span></div>
  <div class="lz-step"><span class="lz-k">29/12/2025</span><span class="lz-t">CISA đưa vào danh mục lỗ hổng đang bị khai thác (KEV)</span><span class="lz-d">"exploitation: active, automatable: yes" — chỉ mười ngày sau khi công bố</span></div>
</div>
<p>Khoá học này không trình bày cách khai thác lỗi. Với một lập trình viên, thứ cần nắm là cách phòng thủ, và bước nào của nó cũng kiểm được bằng câu lệnh:</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
<p>Lab chạy bản 8.0.38 nên đã được vá. Lệnh thứ hai hỏi máy chủ nhận những bộ nén nào: zlib, snappy và zstd, đúng mặc định. Lệnh thứ ba dùng một mongod khởi động với <code>--networkMessageCompressors snappy,zstd</code>. Client chỉ xin zlib thì không được nén, còn client xin "zlib hoặc zstd" thì nhận zstd. Bỏ zlib là cách giảm thiểu tạm thời mà hãng đưa ra cho máy chưa nâng cấp ngay được. Nhưng cách sửa thật vẫn là nâng cấp. Còn để phòng lỗi trước-đăng-nhập <em>tiếp theo</em>, cách tốt nhất vẫn như năm 2017: người không tin cậy không được tới gần cổng.</p>
${nguon('🛡️', 'NVD — CVE-2025-14847', 'Độ dài header zlib lệch ⇒ client chưa đăng nhập đọc được vùng nhớ heap chưa khởi tạo; bản vá theo từng nhánh', 'https://nvd.nist.gov/vuln/detail/CVE-2025-14847')}
${nguon('🐞', 'MongoDB Jira — SERVER-115508', 'Phiếu lỗi máy chủ mà CVE dẫn tới', 'https://jira.mongodb.org/browse/SERVER-115508')}

<h3>5. Script tự kiểm chạy được trên mọi máy của mình</h3>
<p><code>_demo/tu-kiem.js</code> chỉ <em>đọc</em> cấu hình (<code>getCmdLineOpts</code>, <code>db.version()</code>) và in sáu dòng: bindIp, authorization, kiểm phiên bản CVE-2025-14847, bộ nén, JavaScript phía máy chủ, TLS. Script chỉ cần vai trò <code>clusterMonitor</code>.</p>
${lenh(K, 8)}
${ma('bash', CUNG)}
${lenh(K, 9)}
${lenh(K, 10)}
<p>Lab trượt năm trên sáu mục. Đó là cố ý: nó là chỗ tập, chỉ tới được từ 127.0.0.1. <code>mgo-cung</code> dùng cùng ảnh, thêm bốn tham số, và qua năm mục; TLS để dành cho Bài 9.4. Lượt chạy cuối là một ảnh cũ (<code>mongo:8.0.16</code>) tình cờ còn trên máy này, và script bắt được ngay. Ở công ty có năm mươi máy chủ, đây là khác biệt giữa câu "chắc là vá rồi" và một danh sách đính kèm vào ticket.</p>
${ma('yaml', CONF)}
${nguon('📘', 'MongoDB Docs — Security Checklist', 'kiểm soát truy cập, TLS, hạn chế phơi mạng, mã hoá, kiểm toán, chạy bằng user riêng, cập nhật', 'https://www.mongodb.com/docs/manual/administration/security-checklist/')}

<h3>🕵️ Góc hacker: vì sao "để sprint sau vá" là quá chậm</h3>
<p>Hai sự cố có chung một dòng thời gian. Quét cả Internet IPv4 tìm một cổng chỉ mất vài phút. Nên ngay khi một điểm yếu được công bố, kẻ tấn công kiểm <em>tất cả mọi người</em>, chứ không chỉ công ty lớn. Với CVE-2025-14847, từ lúc công bố (19/12) đến lúc xác nhận bị khai thác thật (29/12) chỉ mười ngày, lại rơi đúng mùa nghỉ lễ. Những việc bạn làm được ngay: (1) không bao giờ xuất cổng 27017 ra công khai; khi đó lỗi trước-đăng-nhập buộc kẻ xấu phải chiếm được một máy trong mạng của bạn trước đã; (2) theo dõi thông báo bảo mật của MongoDB và NVD cho phiên bản mình dùng; (3) ghim tag ảnh <em>và</em> chủ động cập nhật nó, vì một <code>mongo:8.0.16</code> ghim cứng sẽ không bao giờ nhận bản vá; (4) chạy script tự kiểm trên mọi môi trường, kể cả máy demo "tạm thời".</p>

<h3>💼 Đi làm: "database dev trống trơn, chỉ còn một collection READ_ME"</h3>
<p>Ticket đúng như thế này vẫn còn gặp ở dự án outsourcing, thường trên một VPS staging mà ai đó dựng bằng <code>docker run -p 27017:27017 mongo</code>. Trình tự bình tĩnh nên làm: (1) không trả tiền, vì năm 2017 người trả cũng không lấy lại được gì; (2) gỡ cổng khỏi mạng <em>trước</em> khi điều tra (<code>docker rm -f</code>, hoặc gắn lại vào 127.0.0.1); (3) lưu log mongod lại, vì các dòng kết nối cho thấy IP và tên driver của kẻ tấn công; (4) khôi phục từ bản sao lưu gần nhất (Chương 10), rồi kiểm xem còn chỗ nào dùng chung thông tin đăng nhập đó để đổi hết; (5) viết một postmortem ngắn, nêu nguyên nhân ("xuất cổng, không xác thực") và cách sửa ("mạng riêng, bật xác thực, chạy tự kiểm trong CI"). Nếu database đó có dữ liệu cá nhân, báo trưởng nhóm ngay: luật bảo vệ dữ liệu cá nhân (của Việt Nam và của nước khách hàng) có thể buộc phải thông báo cho cơ quan chức năng và người bị ảnh hưởng trong thời hạn ngắn. Quyết định đó thuộc về trưởng nhóm và bộ phận pháp chế, nhưng đồng hồ bắt đầu chạy từ lúc bạn phát hiện.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"MongoDB của chúng tôi có mật khẩu mạnh. Mở cổng 27017 ra Internet thì có an toàn không?"</strong> — Không. CVE-2025-14847 xảy ra trước xác thực, bước kiểm mật khẩu chưa hề chạy. Còn có dò mật khẩu và dùng lại mật khẩu bị lộ. Phải phòng nhiều lớp: mạng trước, rồi xác thực, rồi vá.</li>
<li><strong>"Bạn chạy <code>-p 27017:27017</code> trên Ubuntu, ufw đã deny 27017. Cổng đã đóng chưa?"</strong> — Chưa, vì luật của Docker được xét trước luật của ufw. Phải gắn 127.0.0.1 hoặc không xuất cổng, rồi kiểm lại bằng <code>ss -ltn</code> và thử từ một máy khác.</li>
<li><strong>"Làm sao biết mọi máy chủ đã vá một CVE cụ thể?"</strong> — Đọc bản vá theo từng nhánh từ NVD hoặc trang của hãng. Dùng script thu <code>db.version()</code> từ mọi môi trường, so với bảng, đính danh sách vào ticket. Ghim tag ảnh, và cập nhật tag có chủ đích.</li>
<li><strong>"Nguyên nhân gốc của làn sóng 2017 là gì?"</strong> — Do cấu hình, không phải lỗi phần mềm: authorization tắt và cổng tới được từ Internet. Ba câu lệnh bình thường là đủ.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>tu-kiem.js</code> trên lab và trên <code>mgo-cung</code> (lệnh ở trên). Sau đó bỏ <code>--noscripting</code> khỏi mgo-cung. Đoán trước dòng nào sẽ đổi rồi mới chạy.</li>
<li>Liệt kê mọi cổng Docker trên máy bạn đang xuất ra: <code>docker ps --format '{{.Names}} {{.Ports}}'</code>. Dòng nào bắt đầu bằng <code>0.0.0.0</code> hoặc <code>[::]</code>? Với từng dòng, quyết định: gắn lại vào 127.0.0.1, chuyển sang mạng riêng, hay giữ nguyên (và vì sao).</li>
<li>Chép bảng phiên bản của CVE-2025-14847 từ NVD vào một hàm nhỏ <code>daVa(version)</code>, rồi thử trên 8.0.16, 8.0.17, 7.0.27, 4.2.25.</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. Chỉ dòng <code>javascriptEnabled</code> chuyển sang LỖI ("true (mặc định)"), mọi dòng khác vẫn OK. Mỗi tham số ứng với đúng một dòng, nhờ vậy script dùng tốt khi duyệt cấu hình.</p>
<p>2. Hay gặp: database, Redis, trang quản trị xuất ra <code>0.0.0.0:…</code> vì chép từ bài hướng dẫn. Database gần như không bao giờ cần xuất cổng: container ứng dụng gọi tới nó qua mạng Docker bằng tên service. Chỉ giữ những gì trình duyệt phải tới được (ứng dụng web, đặt sau reverse proxy).</p>
<p>3. <code>const VA = { '8.2': '8.2.3', '8.0': '8.0.17', '7.0': '7.0.28', '6.0': '6.0.27', '5.0': '5.0.32', '4.4': '4.4.30' }</code>. Tách major.minor; nhánh không có trong bảng ⇒ false (không có bản vá). Kết quả: false, true, false, false. Tệp tu-kiem.js có đúng logic này.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['bindIp', 'Các giao diện mạng mongod nghe. Ngoài Docker mặc định là localhost; ảnh Docker chính thức tự thêm --bind_ip_all.'],
  ['Xuất cổng (-p)', 'Docker chuyển một cổng của máy host vào container. Không ghi IP ⇒ gắn vào mọi giao diện của máy.'],
  ['Lỗi trước xác thực', 'Lỗ hổng tới được trước bước đăng nhập — mật khẩu không bảo vệ được.'],
  ['CVE-2025-14847 (MongoBleed)', 'Độ dài header zlib lệch ⇒ gửi vùng nhớ heap chưa khởi tạo cho client chưa đăng nhập. Vá ở 8.0.17 / 8.2.3 / 7.0.28 …'],
  ['networkMessageCompressors', 'Các bộ nén mongod chấp nhận (snappy, zstd, zlib). Bỏ zlib là cách giảm thiểu tạm thời.'],
  ['CISA KEV', 'Danh mục của Mỹ gồm các lỗ hổng đã xác nhận bị khai thác thật; tín hiệu "vá ngay".'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Trả lời hai câu hỏi bằng câu lệnh, không bằng trí nhớ: ai tới được cổng (<code>ss -ltn</code>, <code>docker inspect</code>), và đang chạy bản nào (<code>db.version()</code>).</li>
<li>Ảnh chính thức nghe mọi giao diện bên trong container; sự bảo vệ nằm ở thứ bạn xuất ra. Luôn ghi <code>127.0.0.1:</code> trong <code>-p</code>, hoặc đừng xuất cổng.</li>
<li>Docker vượt qua luật ufw/firewalld với cổng đã xuất.</li>
<li>2017 là lỗi cấu hình (không xác thực + mở cổng). 2025 là lỗi trước xác thực: nâng cấp, tạm bỏ zlib, và giữ cổng ở mạng riêng.</li>
<li>Tự động hoá việc kiểm (tu-kiem.js) và chạy trên mọi môi trường.</li>
</ul>
</div>
`,
};
