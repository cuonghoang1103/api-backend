/**
 * Bắt đầu tại đây (2/2) — Cần biết gì trước, học xong làm được gì, và một thảm hoạ thật (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s00-tong-tien'] — tái hiện trên 127.0.0.1 (container mgo-nan-nhan cổng 47018 không mật khẩu,
 * mgo-co-khoa cổng 47019 có tài khoản quản trị), "kẻ tấn công" là mongosh chạy trong container --network host.
 * Nguồn đã GET kiểm 24/11/2026: KrebsOnSecurity 01/2017 "Extortionists Wipe Thousands of Databases, Victims Who Pay Up Get Stiffed"
 * (cài mặc định ⇒ ai cũng duyệt/tải/xoá được; Shodan >52.000 máy mở; Merrigan: ít nhất 29.000 bị xoá; Verizon Enterprise 03/2016
 * lộ ~1,5 triệu khách qua MongoDB mở); MongoDB Docs "IP Binding in Self-Managed Deployments" (mongod/mongos bind localhost mặc định).
 */
import { ra, lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Start here (2/2) — What you need first, what you can do after, and a real disaster|||Bắt đầu tại đây (2/2) — Cần biết gì trước, học xong làm được gì, và một thảm hoạ thật',
  slug: 'mgo-0-9-bat-dau-hoc-the-nao',
  type: 'LESSON',
  isFreePreview: true,
  dangKyDuAn: true,
  description: 'Nền cần có trước khi học (và tự kiểm trong 10 phút); học xong làm được gì khi đi làm; làn sóng tống tiền MongoDB tháng 1/2017 — kẻ tấn công làm gì từng bước, tái hiện trên chính máy bạn rồi chặn lại; bản đồ học kèm các khoá khác; lộ trình tối thiểu và đầy đủ, nhịp học không nản.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>What you need first, what you can do after, and a real disaster</h2>
<p class="lead">Lesson 1 answered "what is MongoDB". This one answers the practical questions: what you must already know, what you will be able to do at the end, how this course connects to the others on the site — and one real disaster, replayed on your own machine, that shows why the very first command of the lab is written the way it is.</p>

<h3>What you need before starting (and a 10-minute self-check)</h3>
<table>
<thead><tr><th>You need</th><th>Why</th><th>Self-check</th><th>If not yet</th></tr></thead>
<tbody>
<tr><td>A terminal, basic commands</td><td>Every lab runs commands</td><td>You can <code>cd</code>, list files, run a command and read its error</td><td>Linux &amp; Bash course, Section 0–1</td></tr>
<tr><td>Docker basics</td><td>MongoDB runs in containers; Chapter 7 starts clusters with Compose</td><td>You know what <code>docker run -p 127.0.0.1:8080:80</code> means</td><td>Docker course, Chapters 1–3</td></tr>
<tr><td>Reading JavaScript and JSON</td><td><code>mongosh</code> is a JavaScript console; documents look like JSON</td><td>You can read <code>{ items: [{ qty: 2 }] }</code> and an arrow function</td><td>Any JS basics (1–2 evenings)</td></tr>
<tr><td>SQL (optional)</td><td>Many lessons compare with PostgreSQL</td><td><code>SELECT … JOIN … GROUP BY</code> makes sense</td><td>Not required — every comparison is explained</td></tr>
<tr><td>Node.js or Spring Boot (Chapter 8 only)</td><td>Using MongoDB from an application</td><td>You have built one REST endpoint</td><td>Node.js course or Spring Boot course</td></tr>
</tbody></table>

<h3>What you will be able to do at the end</h3>
<ul>
<li><strong>Decide and defend</strong>: "MongoDB for this part, PostgreSQL for that part, because…" — with a measurement, not an opinion.</li>
<li><strong>Design a schema from user stories</strong>: embed or reference, bucket, subset, extended reference — and spot the unbounded array before it reaches production.</li>
<li><strong>Make slow queries fast</strong>: read <code>explain()</code>, build compound indexes with the ESR rule, prove the improvement in milliseconds.</li>
<li><strong>Write reports in the database</strong> with aggregation pipelines instead of pulling 100,000 documents into Node.</li>
<li><strong>Keep data safe</strong>: transactions where needed, write concern majority, a three-node replica set that survives losing a server, backups you have actually restored.</li>
<li><strong>Close the classic holes</strong>: no open port, no default account, no NoSQL injection.</li>
<li><strong>Use it from code</strong>: the Node.js driver, Mongoose, Spring Data MongoDB — without N+1 queries.</li>
</ul>
<p><strong>Where this is used at work.</strong> Backend developer (Node.js/Express or NestJS — the "MERN/MEAN" stacks are MongoDB-based; Java/Spring with Spring Data MongoDB), full-stack developer, and on outsourcing projects where the customer's system already runs MongoDB. In an internship the first MongoDB tickets are almost always "this API is slow" (Chapter 4), "this report is wrong" (Chapter 5) or "add a field without breaking old data" (Chapter 1 and 3).</p>

<h3>A real disaster: the MongoDB ransom wave of January 2017</h3>
<p>In early January 2017 thousands of companies opened their MongoDB and found their data gone, replaced by a single database with a note: <em>send bitcoin to get your data back</em>. KrebsOnSecurity reported that a Shodan search (a search engine for internet-connected devices) listed more than <strong>52,000</strong> publicly accessible MongoDB databases, and that researcher Niall Merrigan, tracking victims with Victor Gevers, counted <strong>at least 29,000</strong> already erased. Worse, several criminal groups were competing: each one deleted the previous group's ransom note and left its own, so <strong>victims who paid got nothing back</strong>. A year earlier (March 2016) Krebs had also reported Verizon Enterprise Solutions leaking contact details of about 1.5 million customers through a publicly accessible MongoDB.</p>
<p><strong>What made it possible.</strong> Krebs summarised it: installed with default settings, MongoDB let anyone browse, download and delete the data. Old versions listened on every network interface with no authentication; people then opened the port in the firewall, or ran it on a cloud server with a public IP. Since version 3.6 <code>mongod</code> binds to <code>localhost</code> by default — but Docker reintroduces the same mistake: <code>docker run -p 27017:27017</code> publishes the port on <em>every</em> interface of the host, and on Linux Docker's own firewall rules are applied before tools like <code>ufw</code>, so "I enabled the firewall" does not protect you.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Scan</span><span class="lz-t">Shodan or masscan lists every IP answering on 27017</span><span class="lz-d">Takes minutes for the whole internet. Defence: never expose the port; bind to 127.0.0.1 or a private network.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Connect</span><span class="lz-t">no username, no password</span><span class="lz-d">Defence: authentication on — the attacker stops here with "requires authentication".</span></div>
  <div class="lz-step"><span class="lz-k">3 · List and copy</span><span class="lz-t">listDatabases, then dump what looks valuable</span><span class="lz-d">Defence: least-privilege users; a leaked app password cannot list other databases.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Drop and leave a note</span><span class="lz-t">dropDatabase + one document with a bitcoin address</span><span class="lz-d">Defence: tested backups — restore and move on. Never pay: notes overwrite each other.</span></div>
</div>
<p><strong>Replay it on your machine (safely).</strong> We start a "victim" MongoDB with no password, but only on <code>127.0.0.1</code> port 47018, put two customer records in it, then act as the attacker with a separate client. Step 1 — list databases (no password asked):</p>
${lenh('s00-tong-tien', 0)}
<p>Step 2 — read the data:</p>
${lenh('s00-tong-tien', 1)}
<p>Step 3 — what the 2017 scripts did automatically: drop the database and leave a note.</p>
${lenh('s00-tong-tien', 2)}
<p>That is the whole "attack": three commands, no exploit, no password. Now the same thing against a MongoDB started with an administrator account (the official image turns on authentication when <code>MONGO_INITDB_ROOT_USERNAME</code> is set):</p>
${lenh('s00-tong-tien', 3)}
${lenh('s00-tong-tien', 4)}
<div class="callout danger"><p><strong>The rules you will apply from the first lab, every time:</strong></p><ol>
<li>Publish database ports only on <code>127.0.0.1</code> (<code>-p 127.0.0.1:47017:27017</code>), never <code>-p 27017:27017</code> on a server.</li>
<li>Any MongoDB reachable by anything other than your own laptop has authentication on and a strong password; each application gets its own least-privilege user (Chapter 9).</li>
<li>Keep the server patched — in December 2025 CVE-2025-14847 let an <em>unauthenticated</em> client read uninitialised server memory through zlib-compressed messages (fixed in 8.0.17; our lab image is 8.0.38). An open port plus an old version is an invitation.</li>
<li>Back up, and test the restore (Chapter 10) — the 2017 victims who had a tested backup simply restored and moved on.</li>
</ol></div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "it is only a test server".</strong> Many 2017 victims were staging or demo machines with copies of real customer data. Attackers do not check which server is "important". Any copy of real data gets the same protection as production, or gets fake data instead.</p>
</div>
<h3>How this course connects to the others</h3>
<table>
<thead><tr><th>When</th><th>Course / lesson</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Before (if needed)</td><td>Docker; Linux &amp; Bash</td><td>Containers and the terminal used in every lab</td></tr>
<tr><td>Alongside</td><td>PostgreSQL 17.3 "MongoDB documents vs JSONB", 17.4 "Which system?"; Spring Boot 20.1</td><td>The same problem solved on both sides — read them after Lesson 0.1</td></tr>
<tr><td>Alongside</td><td>Academy SDN302 Chapter 3 and 8</td><td>The subject-exam view (PE traps); this course goes deeper</td></tr>
<tr><td>After</td><td>Node.js; Spring Boot Chapter 20</td><td>Building full APIs around the database</td></tr>
<tr><td>After</td><td>Redis; System Design; Web Security</td><td>Caching in front of MongoDB, designing systems that mix databases, wider attack surface</td></tr>
</tbody></table>
${lienKet({ cta: 'Open lesson', khoa: 'docker', bai: 'dk-0-5-bat-dau-tai-day', title: 'Docker — Start here', sub: 'If containers are new to you, do Chapters 1–3 first' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-17-3-mongodb-vs-jsonb', title: 'PostgreSQL 17.3 — MongoDB documents vs JSONB', sub: 'The same orders modelled both ways, measured' })}
${lienKet({ cta: 'Open lesson', khoa: 'spring-boot', bai: 'sb-20-1-mongo-vi-sao', title: 'Spring Boot 20.1 — Documents vs tables: when MongoDB fits', sub: 'The Java side, used again in Chapter 8' })}

<h3>Two study paths, and a rhythm that does not burn you out</h3>
<ul>
<li><strong>Minimum path (~3 weeks, 1 hour a day)</strong>: Section 0 → Chapters 1–5 → Lessons 9.1–9.3. Enough to use MongoDB correctly in a student project or an internship.</li>
<li><strong>Full path (~8–10 weeks)</strong>: everything, including clusters, Spring/Node integration, operations and the final project you can put on your CV.</li>
<li><strong>One session = 60–90 minutes</strong>: read the lesson (20′), retype every command yourself in the lab (30′) — do not copy-paste, the typos teach you — then the 🧪 practice (20′). Stop after the practice even if you feel like continuing; come back tomorrow.</li>
<li>Keep a notebook of every error message you hit and how you fixed it. By Chapter 6 it is your most valuable document.</li>
</ul>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you secure a MongoDB server?"</strong> — Not exposed (bind to private interface, firewall, VPC), authentication on, one least-privilege user per app, TLS, patched version, backups tested. Mention 2017 as the reason.</li>
<li><strong>"Your MongoDB runs in Docker on a VPS. Is it safe if ufw blocks 27017?"</strong> — Not necessarily: Docker-published ports bypass ufw rules. Publish on 127.0.0.1 or a private network only.</li>
<li><strong>"A ransom note appeared in your database. What do you do?"</strong> — Do not pay (notes overwrite each other; the data is usually already gone), cut network access, preserve logs, restore from backup, rotate credentials, write a postmortem.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Do the self-check table honestly. For every "not yet", open the linked course and put the first lesson in your calendar.</li>
<li>Choose the minimum or the full path and write your weekly schedule (days + time).</li>
<li>Write, from memory, the four rules from the red box above. Check against the box.</li>
</ol>
<p><strong>Done when:</strong> you have a schedule and can recite why <code>-p 27017:27017</code> on a server is dangerous.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Authentication', 'Proving who you are (username + password, certificate) before the server lets you run commands.'],
  ['bindIp', 'Which network addresses mongod listens on; default localhost since 3.6.'],
  ['Port publishing', 'Docker’s <code>-p host:container</code>; without an address it listens on all host interfaces.'],
  ['Shodan', 'A search engine that scans the internet for open services — attackers’ first step.'],
  ['Ransom note', 'A message left after data is copied or deleted, demanding payment.'],
  ['CVE', 'A public identifier for a known vulnerability, e.g. CVE-2025-14847.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>You need a terminal, Docker basics and readable JavaScript; SQL helps but is optional.</li>
<li>At the end you can design, tune, secure, replicate and back up MongoDB, and use it from Node.js and Spring.</li>
<li>January 2017: 50,000+ open databases, 29,000+ wiped, payers got nothing — caused by no authentication on an open port.</li>
<li>Three commands are enough to wipe an open MongoDB; one setting (authentication) and one address (127.0.0.1) stop it.</li>
<li>Study 60–90 minutes a session, retype every command, keep an error notebook.</li>
</ul>
<h3>🎯 The course project — choose your topic now</h3>
<p>Reading and retyping is not enough to remember a database. So throughout the course you build the data layer of one real application on a topic you choose today. At the end of every chapter a <strong>🛠 Project milestone</strong> lesson applies exactly that chapter to your topic: Chapter 1 gives it collections and a validator, Chapter 4 indexes with explain proof, Chapter 6 its one operation that must stay correct under concurrency, Chapter 7 a three-node replica set and a failover drill, Chapter 10 a restore drill and a load test. The last lesson is a defence in front of an AI committee with a 10-point rubric.</p>
<p>Five suggested topics are waiting below — a fashion shop with variants, a sensor monitoring platform, a multi-type blog/CMS, event ticketing with seat selection, and an activity log for a learning app — each with a table of what every milestone means for it. You may also propose your own; the AI checks it is neither too small nor too big. <strong>Register your course project topic below.</strong></p>
<h3>🔗 Sources</h3>
${nguon('📰', 'KrebsOnSecurity — Extortionists Wipe Thousands of Databases, Victims Who Pay Up Get Stiffed (01/2017)', '52,000+ open, 29,000+ erased, competing ransom notes', 'https://krebsonsecurity.com/2017/01/extortionists-wipe-thousands-of-databases-victims-who-pay-up-get-stiffed/')}
${nguon('📘', 'MongoDB Docs — IP Binding in Self-Managed Deployments', 'mongod and mongos bind to localhost by default', 'https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/')}
${nguon('🛡️', 'NVD — CVE-2025-14847', 'Unauthenticated read of uninitialised heap memory via zlib headers', 'https://nvd.nist.gov/vuln/detail/CVE-2025-14847')}
${nguon('🐳', 'Docker Docs — Packet filtering and firewalls: Docker and ufw', 'Published ports are diverted before ufw rules apply', 'https://docs.docker.com/engine/network/packet-filtering-firewalls/')}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Cần biết gì trước, học xong làm được gì, và một thảm hoạ thật</h2>
<p class="lead">Bài 1 trả lời "MongoDB là gì". Bài này trả lời những câu thực tế: bạn phải biết gì trước, cuối khoá làm được gì, khoá này nối với các khoá khác trên trang ra sao — và một thảm hoạ có thật, diễn lại ngay trên máy bạn, để thấy vì sao câu lệnh đầu tiên của lab lại được viết đúng như thế.</p>

<h3>Cần gì trước khi bắt đầu (và tự kiểm trong 10 phút)</h3>
<table>
<thead><tr><th>Bạn cần</th><th>Vì sao</th><th>Tự kiểm</th><th>Nếu chưa có</th></tr></thead>
<tbody>
<tr><td>Terminal, lệnh cơ bản</td><td>Lab nào cũng gõ lệnh</td><td>Bạn <code>cd</code>, liệt kê tệp, chạy một lệnh và đọc được thông báo lỗi của nó</td><td>Khoá Linux &amp; Bash, Mục 0–1</td></tr>
<tr><td>Docker cơ bản</td><td>MongoDB chạy trong container; Chương 7 dựng cụm bằng Compose</td><td>Bạn hiểu <code>docker run -p 127.0.0.1:8080:80</code> nghĩa là gì</td><td>Khoá Docker, Chương 1–3</td></tr>
<tr><td>Đọc được JavaScript và JSON</td><td><code>mongosh</code> là console JavaScript; tài liệu trông như JSON</td><td>Bạn đọc được <code>{ items: [{ qty: 2 }] }</code> và một hàm mũi tên</td><td>JS cơ bản bất kỳ (1–2 buổi tối)</td></tr>
<tr><td>SQL (không bắt buộc)</td><td>Nhiều bài so với PostgreSQL</td><td><code>SELECT … JOIN … GROUP BY</code> bạn hiểu</td><td>Không bắt buộc — mọi phép so sánh đều được giải thích</td></tr>
<tr><td>Node.js hoặc Spring Boot (chỉ Chương 8)</td><td>Dùng MongoDB từ ứng dụng</td><td>Bạn đã viết được một endpoint REST</td><td>Khoá Node.js hoặc Spring Boot</td></tr>
</tbody></table>

<h3>Học xong bạn làm được gì</h3>
<ul>
<li><strong>Quyết định và bảo vệ được</strong>: "phần này dùng MongoDB, phần kia dùng PostgreSQL, vì…" — bằng số đo, không bằng cảm tính.</li>
<li><strong>Thiết kế schema từ user story</strong>: nhúng hay tham chiếu, bucket, subset, extended reference — và nhìn ra mảng không giới hạn trước khi nó lên production.</li>
<li><strong>Làm nhanh truy vấn chậm</strong>: đọc <code>explain()</code>, dựng index phức hợp theo luật ESR, chứng minh bằng mili giây trước/sau.</li>
<li><strong>Viết báo cáo ngay trong cơ sở dữ liệu</strong> bằng aggregation pipeline thay vì kéo 100.000 tài liệu về Node.</li>
<li><strong>Giữ dữ liệu an toàn</strong>: transaction đúng chỗ, write concern majority, replica set ba máy sống sót khi mất một máy, bản sao lưu đã thật sự khôi phục thử.</li>
<li><strong>Bịt các lỗ kinh điển</strong>: không cổng mở, không tài khoản mặc định, không NoSQL injection.</li>
<li><strong>Dùng từ mã nguồn</strong>: driver Node.js, Mongoose, Spring Data MongoDB — không dính truy vấn N+1.</li>
</ul>
<p><strong>Đi làm thì dùng ở đâu.</strong> Lập trình viên backend (Node.js/Express hay NestJS — bộ "MERN/MEAN" dựa trên MongoDB; Java/Spring với Spring Data MongoDB), lập trình viên full-stack, và các dự án outsourcing mà hệ thống của khách đã chạy MongoDB sẵn. Khi thực tập, những ticket MongoDB đầu tiên gần như luôn là "API này chậm" (Chương 4), "báo cáo này sai số" (Chương 5) hoặc "thêm một trường mà không làm hỏng dữ liệu cũ" (Chương 1 và 3).</p>

<h3>Một thảm hoạ thật: làn sóng tống tiền MongoDB tháng 1/2017</h3>
<p>Đầu tháng 1/2017, hàng nghìn công ty mở MongoDB ra và thấy dữ liệu biến mất, thay bằng đúng một database chứa lời nhắn: <em>gửi bitcoin để lấy lại dữ liệu</em>. Trang KrebsOnSecurity đưa tin rằng một lượt tìm trên Shodan (công cụ tìm kiếm các thiết bị nối Internet) liệt kê hơn <strong>52.000</strong> cơ sở dữ liệu MongoDB ai cũng truy cập được, và nhà nghiên cứu Niall Merrigan, cùng Victor Gevers theo dõi nạn nhân, đếm được <strong>ít nhất 29.000</strong> cái đã bị xoá sạch. Tệ hơn, nhiều nhóm tội phạm tranh nhau: nhóm sau xoá lời nhắn của nhóm trước rồi để lại lời nhắn của mình, nên <strong>nạn nhân trả tiền cũng không lấy lại được gì</strong>. Một năm trước đó (3/2016) Krebs cũng đưa tin Verizon Enterprise Solutions làm lộ thông tin liên hệ của khoảng 1,5 triệu khách hàng qua một MongoDB mở công khai.</p>
<p><strong>Vì sao xảy ra được.</strong> Krebs tóm gọn: cài với thiết lập mặc định thì MongoDB cho bất kỳ ai duyệt, tải về và xoá dữ liệu. Các bản cũ nghe trên mọi giao diện mạng và không đòi xác thực; người dùng lại mở cổng trên tường lửa, hoặc chạy nó trên máy chủ đám mây có IP công khai. Từ bản 3.6, <code>mongod</code> mặc định chỉ nghe trên <code>localhost</code> — nhưng Docker đưa lại đúng lỗi cũ: <code>docker run -p 27017:27017</code> mở cổng trên <em>mọi</em> giao diện của máy chủ, và trên Linux luật tường lửa của chính Docker được áp trước các công cụ như <code>ufw</code>, nên "tôi đã bật tường lửa rồi" không bảo vệ được bạn.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Quét</span><span class="lz-t">Shodan hay masscan liệt kê mọi IP trả lời ở cổng 27017</span><span class="lz-d">Quét cả Internet chỉ mất vài phút. Phòng: đừng bao giờ mở cổng ra ngoài; chỉ nghe 127.0.0.1 hoặc mạng riêng.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Kết nối</span><span class="lz-t">không tên đăng nhập, không mật khẩu</span><span class="lz-d">Phòng: bật xác thực — kẻ tấn công dừng ngay ở đây với lỗi "requires authentication".</span></div>
  <div class="lz-step"><span class="lz-k">3 · Liệt kê và chép</span><span class="lz-t">listDatabases, rồi tải những gì có vẻ giá trị</span><span class="lz-d">Phòng: tài khoản quyền tối thiểu; lộ mật khẩu ứng dụng cũng không liệt kê được database khác.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Xoá và để lời nhắn</span><span class="lz-t">dropDatabase + một tài liệu kèm địa chỉ bitcoin</span><span class="lz-d">Phòng: bản sao lưu đã khôi phục thử — khôi phục rồi đi tiếp. Đừng trả tiền: lời nhắn đè lên nhau.</span></div>
</div>
<p><strong>Diễn lại trên máy bạn (an toàn).</strong> Ta chạy một MongoDB "nạn nhân" không mật khẩu, nhưng chỉ trên <code>127.0.0.1</code> cổng 47018, cất vào hai khách hàng, rồi đóng vai kẻ tấn công bằng một client riêng. Bước 1 — liệt kê database (không ai hỏi mật khẩu):</p>
${lenh('s00-tong-tien', 0)}
<p>Bước 2 — đọc dữ liệu:</p>
${lenh('s00-tong-tien', 1)}
<p>Bước 3 — việc các kịch bản năm 2017 tự động làm: xoá database và để lại lời nhắn.</p>
${lenh('s00-tong-tien', 2)}
<p>Đó là toàn bộ "cuộc tấn công": ba câu lệnh, không khai thác lỗ hổng nào, không cần mật khẩu. Giờ thử đúng việc đó với một MongoDB khởi động có tài khoản quản trị (ảnh chính thức tự bật xác thực khi đặt <code>MONGO_INITDB_ROOT_USERNAME</code>):</p>
${lenh('s00-tong-tien', 3)}
${lenh('s00-tong-tien', 4)}
<div class="callout danger"><p><strong>Các luật bạn áp dụng từ lab đầu tiên, mọi lúc:</strong></p><ol>
<li>Chỉ mở cổng cơ sở dữ liệu trên <code>127.0.0.1</code> (<code>-p 127.0.0.1:47017:27017</code>), không bao giờ <code>-p 27017:27017</code> trên máy chủ.</li>
<li>MongoDB nào mà ngoài laptop của bạn còn thứ khác chạm tới được thì phải bật xác thực, mật khẩu mạnh; mỗi ứng dụng một tài khoản quyền tối thiểu (Chương 9).</li>
<li>Cập nhật bản vá — tháng 12/2025, CVE-2025-14847 cho phép một client <em>chưa đăng nhập</em> đọc vùng nhớ chưa khởi tạo của máy chủ qua các gói tin nén zlib (đã vá ở 8.0.17; ảnh lab của ta là 8.0.38). Cổng mở cộng bản cũ là lời mời.</li>
<li>Sao lưu, và khôi phục thử (Chương 10) — những nạn nhân năm 2017 có bản sao lưu đã thử chỉ việc khôi phục rồi đi tiếp.</li>
</ol></div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "chỉ là máy thử thôi mà".</strong> Nhiều nạn nhân năm 2017 là máy staging hay máy demo chứa bản sao dữ liệu khách thật. Kẻ tấn công không xem máy nào "quan trọng". Bản sao nào của dữ liệu thật cũng phải được bảo vệ như production, hoặc dùng dữ liệu giả thay vào.</p>
</div>
<h3>Khoá này nối với các khoá khác ra sao</h3>
<table>
<thead><tr><th>Khi nào</th><th>Khoá / bài</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Trước (nếu cần)</td><td>Docker; Linux &amp; Bash</td><td>Container và terminal dùng trong mọi lab</td></tr>
<tr><td>Song song</td><td>PostgreSQL 17.3 "Document MongoDB và JSONB", 17.4 "Chọn hệ nào?"; Spring Boot 20.1</td><td>Cùng một bài toán giải ở cả hai phía — đọc sau Bài 0.1</td></tr>
<tr><td>Song song</td><td>Academy SDN302 Chương 3 và 8</td><td>Góc nhìn môn học (bẫy đề PE); khoá này đi sâu hơn</td></tr>
<tr><td>Sau</td><td>Node.js; Spring Boot Chương 20</td><td>Dựng API hoàn chỉnh quanh cơ sở dữ liệu</td></tr>
<tr><td>Sau</td><td>Redis; System Design; Web Security</td><td>Cache trước MongoDB, thiết kế hệ thống phối nhiều cơ sở dữ liệu, bề mặt tấn công rộng hơn</td></tr>
</tbody></table>
${lienKet({ khoa: 'docker', bai: 'dk-0-5-bat-dau-tai-day', title: 'Docker — Bắt đầu tại đây', sub: 'Nếu container còn mới với bạn, học Chương 1–3 trước' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-17-3-mongodb-vs-jsonb', title: 'PostgreSQL 17.3 — Document MongoDB và JSONB của PostgreSQL', sub: 'Cùng bộ đơn hàng mô hình hoá hai cách, có đo' })}
${lienKet({ khoa: 'spring-boot', bai: 'sb-20-1-mongo-vi-sao', title: 'Spring Boot 20.1 — Document và bảng: khi nào MongoDB hợp', sub: 'Phía Java, dùng lại ở Chương 8' })}

<h3>Hai lộ trình, và một nhịp học không làm bạn đuối</h3>
<ul>
<li><strong>Lộ trình tối thiểu (~3 tuần, mỗi ngày 1 giờ)</strong>: Mục 0 → Chương 1–5 → Bài 9.1–9.3. Đủ để dùng MongoDB đúng cách trong đồ án hay khi thực tập.</li>
<li><strong>Lộ trình đầy đủ (~8–10 tuần)</strong>: tất cả, gồm cụm máy, tích hợp Spring/Node, vận hành và dự án cuối khoá đưa được vào CV.</li>
<li><strong>Một buổi = 60–90 phút</strong>: đọc bài (20′), tự gõ lại mọi lệnh trong lab (30′) — đừng chép-dán, chính lỗi gõ dạy bạn — rồi làm 🧪 thực hành (20′). Dừng sau phần thực hành dù còn hứng; mai quay lại.</li>
<li>Giữ một cuốn sổ ghi mọi thông báo lỗi bạn gặp và cách bạn sửa. Tới Chương 6 nó là tài liệu quý nhất của bạn.</li>
</ul>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"Bạn bảo mật một máy chủ MongoDB thế nào?"</strong> — Không phơi ra ngoài (nghe trên giao diện nội bộ, tường lửa, mạng riêng), bật xác thực, mỗi ứng dụng một tài khoản quyền tối thiểu, TLS, bản đã vá, sao lưu đã khôi phục thử. Nhắc vụ 2017 làm lý do.</li>
<li><strong>"MongoDB của bạn chạy bằng Docker trên VPS. ufw chặn 27017 rồi thì an toàn chưa?"</strong> — Chưa chắc: cổng Docker mở ra vượt qua luật ufw. Chỉ mở trên 127.0.0.1 hoặc mạng riêng.</li>
<li><strong>"Trong database xuất hiện lời nhắn đòi tiền chuộc. Bạn làm gì?"</strong> — Không trả tiền (lời nhắn đè lên nhau; dữ liệu thường đã mất), cắt truy cập mạng, giữ log, khôi phục từ bản sao lưu, đổi toàn bộ thông tin đăng nhập, viết postmortem.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Làm bảng tự kiểm một cách trung thực. Mỗi ô "chưa có", mở khoá được gợi ý và xếp bài đầu tiên vào lịch.</li>
<li>Chọn lộ trình tối thiểu hay đầy đủ, viết lịch học hằng tuần (ngày + giờ).</li>
<li>Viết lại theo trí nhớ bốn luật trong ô đỏ ở trên. Rồi so với ô.</li>
</ol>
<p><strong>Xong khi:</strong> bạn có lịch học và nói lại được vì sao <code>-p 27017:27017</code> trên máy chủ là nguy hiểm.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Xác thực (authentication)', 'Chứng minh bạn là ai (tên + mật khẩu, chứng chỉ) trước khi máy chủ cho chạy lệnh.'],
  ['bindIp', 'Những địa chỉ mạng mà mongod nghe; mặc định localhost từ bản 3.6.'],
  ['Mở cổng (port publishing)', '<code>-p máy:container</code> của Docker; không ghi địa chỉ thì nghe trên mọi giao diện của máy.'],
  ['Shodan', 'Công cụ tìm kiếm quét Internet tìm dịch vụ đang mở — bước đầu tiên của kẻ tấn công.'],
  ['Lời nhắn tống tiền (ransom note)', 'Lời nhắn để lại sau khi dữ liệu bị chép hoặc xoá, đòi trả tiền.'],
  ['CVE', 'Mã định danh công khai cho một lỗ hổng đã biết, ví dụ CVE-2025-14847.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bạn cần terminal, Docker cơ bản và đọc được JavaScript; SQL giúp ích nhưng không bắt buộc.</li>
<li>Cuối khoá bạn thiết kế, tối ưu, bảo mật, nhân bản và sao lưu được MongoDB, dùng được từ Node.js và Spring.</li>
<li>Tháng 1/2017: hơn 52.000 database mở, ít nhất 29.000 bị xoá, người trả tiền không nhận lại gì — vì cổng mở mà không có xác thực.</li>
<li>Ba câu lệnh đủ xoá sạch một MongoDB mở; một thiết lập (xác thực) và một địa chỉ (127.0.0.1) chặn được nó.</li>
<li>Học 60–90 phút mỗi buổi, tự gõ lại mọi lệnh, giữ sổ ghi lỗi.</li>
</ul>
<h3>🎯 Dự án xuyên khoá — chọn đề tài ngay bây giờ</h3>
<p>Đọc và gõ lại chưa đủ để nhớ một cơ sở dữ liệu. Vì vậy suốt khoá bạn xây tầng dữ liệu của một ứng dụng thật, trên đề tài bạn chọn hôm nay. Cuối mỗi chương có một bài <strong>🛠 Mốc dự án</strong> áp đúng kiến thức chương đó vào đề tài của bạn: Chương 1 cho nó các collection và bộ kiểm hợp lệ, Chương 4 cho nó index kèm bằng chứng explain, Chương 6 cho nó thao tác then chốt phải đúng khi đồng thời, Chương 7 cho nó replica set ba máy và buổi diễn tập chuyển dự phòng, Chương 10 cho nó buổi diễn tập khôi phục và đo tải. Bài cuối cùng là buổi bảo vệ trước hội đồng AI, chấm theo rubric 10 điểm.</p>
<p>Năm đề tài gợi ý đang chờ bên dưới — cửa hàng thời trang nhiều biến thể, nền tảng giám sát cảm biến, blog/CMS nhiều kiểu nội dung, đặt vé sự kiện có chọn ghế, và nhật ký hoạt động cho ứng dụng học tập — mỗi đề tài có bảng cho biết từng mốc nghĩa là gì với nó. Bạn cũng có thể tự đề xuất; AI sẽ xem đề tài có quá nhỏ hay quá to không. <strong>Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới.</strong></p>
<h3>🔗 Nguồn</h3>
${nguon('📰', 'KrebsOnSecurity — Extortionists Wipe Thousands of Databases, Victims Who Pay Up Get Stiffed (01/2017)', 'Hơn 52.000 máy mở, ít nhất 29.000 bị xoá, lời nhắn tống tiền đè nhau', 'https://krebsonsecurity.com/2017/01/extortionists-wipe-thousands-of-databases-victims-who-pay-up-get-stiffed/')}
${nguon('📘', 'MongoDB Docs — IP Binding in Self-Managed Deployments', 'mongod và mongos mặc định chỉ nghe localhost', 'https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/')}
${nguon('🛡️', 'NVD — CVE-2025-14847', 'Client chưa đăng nhập đọc được vùng nhớ heap chưa khởi tạo qua header zlib', 'https://nvd.nist.gov/vuln/detail/CVE-2025-14847')}
${nguon('🐳', 'Docker Docs — Packet filtering and firewalls: Docker and ufw', 'Cổng Docker mở ra bị chuyển hướng trước khi luật ufw được áp', 'https://docs.docker.com/engine/network/packet-filtering-firewalls/')}
</div>
`,
};
