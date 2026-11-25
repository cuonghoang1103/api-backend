/**
 * 7.1 — Replica set: oplog, bầu chọn và cụm ba máy (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s07-1-rs'] — cụm rs1 BA container (mgo-r1/r2/r3) dựng bằng ../_demo/rs/compose.yaml (MongoDB 8.0.38, mạng mgo-rs-net).
 * Số tất định: r1 priority 2 ⇒ primary; nối từ máy chủ bằng replicaSet=rs1 ⇒ ENOTFOUND r1; directConnection ⇒ được; oplog: $inc thành "u: ton 9",
 * updateMany 3 tài liệu ⇒ 3 mục, insertMany ⇒ một applyOps; docker pause secondary "lá" (lần chốt: r2) 6 s ⇒ 28000 tài liệu vẫn ghi được, độ trễ hiện 20 s (đo giữa mốc oplog) rồi về 0; r4 initial sync ~2 s;
 * 4 thành viên / 3 phiếu ⇒ đa số 2. Kích thước oplog mặc định = 5% đĩa trống (số MB đổi theo máy).
 * Kiểm trùng: lý thuyết nhân bản leader/follower, failover, Raft ở distributed-systems 3.1/3.2/6.3 ⇒ liên kết; replica set một container ở 6.3 ⇒ nhắc.
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's07-1-rs';

const COMPOSE = `x-mongod: &mongod
  image: mongo:8.0
  command: ["mongod", "--replSet", "rs1", "--bind_ip_all", "--wiredTigerCacheSizeGB", "0.25"]
  ulimits:
    nofile: { soft: 64000, hard: 64000 }   # Docker on Linux defaults to 1024 — too low for mongod (Lesson 3.5)
  mem_limit: 1g
  networks: [rs]
services:
  r1:
    <<: *mongod
    container_name: mgo-r1
    hostname: r1
    ports: ["127.0.0.1:47101:27017"]
    volumes: [r1:/data/db]
    healthcheck:   # first run: rs.initiate with the NETWORK NAMES r1, r2, r3 — not localhost
      test: ["CMD", "mongosh", "--quiet", "--eval",
             "try { rs.status().ok } catch (e) { rs.initiate({ _id: 'rs1', members: [
                { _id: 0, host: 'r1:27017', priority: 2 }, { _id: 1, host: 'r2:27017' }, { _id: 2, host: 'r3:27017' } ] }).ok }"]
      interval: 5s
    depends_on: [r2, r3]
  r2: { <<: *mongod, container_name: mgo-r2, hostname: r2, ports: ["127.0.0.1:47102:27017"], volumes: [r2:/data/db] }
  r3: { <<: *mongod, container_name: mgo-r3, hostname: r3, ports: ["127.0.0.1:47103:27017"], volumes: [r3:/data/db] }
networks:
  rs: { name: mgo-rs-net }
volumes: { r1: {}, r2: {}, r3: {} }`;

const GIAI_EN = `<p>1. Five voting members: majority 3, tolerates 2 failures. Six voting members: majority 4, still tolerates only 2 — the sixth vote adds cost and nothing else. That is why replica sets have an odd number of voters; extra copies (for reports, another region) are added with <code>votes: 0, priority: 0</code>.</p>
<p>2. The driver connects to the seed you gave, reads <code>hello().hosts</code> — <code>r1:27017</code>, <code>r2:27017</code>, <code>r3:27017</code> — and from then on talks only to those names. Your laptop cannot resolve <code>r1</code>, so every server is "unknown" and server selection fails after <code>serverSelectionTimeoutMS</code>. Fixes, from best to worst: run the application inside the same network (Compose service — what this chapter does); give the members names that resolve everywhere (DNS in production, e.g. <code>db1.ct.internal</code>); for a quick look with Compass, <code>directConnection=true</code> to one member (no failover, so never in application code); editing <code>/etc/hosts</code> works on one laptop only.</p>
<p>3. If r3 is stopped for longer than the oplog window, the entries it still needs are already overwritten on every source. It cannot catch up, goes into <code>RECOVERING</code> with "too stale to catch up", and must be resynced from scratch (empty its data directory, initial sync). Monitoring: alert when replication lag approaches the oplog window (<code>rs.printReplicationInfo()</code> "log length start to end"), and size the oplog for your longest planned maintenance.</p>`;

const GIAI_VI = `<p>1. Năm thành viên có phiếu: đa số 3, chịu được 2 máy hỏng. Sáu thành viên có phiếu: đa số 4, vẫn chỉ chịu được 2 — phiếu thứ sáu thêm chi phí mà không thêm gì. Vì thế replica set dùng số phiếu lẻ; bản sao thêm (cho báo cáo, cho vùng khác) được thêm với <code>votes: 0, priority: 0</code>.</p>
<p>2. Driver nối vào máy mồi bạn đưa, đọc <code>hello().hosts</code> — <code>r1:27017</code>, <code>r2:27017</code>, <code>r3:27017</code> — và từ đó chỉ nói chuyện với các tên đó. Laptop của bạn không phân giải được <code>r1</code>, nên mọi máy đều "unknown" và việc chọn máy thất bại sau <code>serverSelectionTimeoutMS</code>. Cách sửa, từ tốt tới kém: chạy ứng dụng trong cùng mạng (một service của Compose — cách chương này làm); đặt tên thành viên phân giải được ở mọi nơi (DNS ở production, vd <code>db1.ct.internal</code>); để xem nhanh bằng Compass thì <code>directConnection=true</code> vào một máy (không chuyển dự phòng, nên không bao giờ dùng trong mã ứng dụng); sửa <code>/etc/hosts</code> chỉ chạy trên một laptop.</p>
<p>3. Nếu r3 dừng lâu hơn cửa sổ oplog, các mục nó còn cần đã bị ghi đè trên mọi nguồn. Nó không đuổi kịp được, chuyển sang <code>RECOVERING</code> với "too stale to catch up", và phải đồng bộ lại từ đầu (xoá thư mục dữ liệu, initial sync). Giám sát: cảnh báo khi độ trễ nhân bản tiến gần cửa sổ oplog (dòng "log length start to end" của <code>rs.printReplicationInfo()</code>), và đặt cỡ oplog đủ cho lần bảo trì dài nhất bạn dự tính.</p>`;

export default {
  title: '7.1 — Replica sets: oplog, elections and a three-node cluster|||7.1 — Replica set: oplog, bầu chọn và cụm ba máy',
  slug: 'mgo-7-1-replica-set',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Dựng replica set ba container thật bằng Docker Compose: rs.status, hello, vì sao ứng dụng ngoài mạng Docker báo ENOTFOUND r1 (tên máy trong cấu hình), đọc oplog thật ($inc thành $set giá trị, updateMany thành nhiều mục, insertMany gói applyOps — vì sao oplog phải idempotent), cỡ và cửa sổ oplog, đo độ trễ nhân bản khi một máy treo, thêm máy thứ tư bằng initial sync, tính đa số và vì sao số phiếu lẻ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Replica sets: oplog, elections and a three-node cluster</h2>
<p class="lead">Until now the lab was one MongoDB server pretending to be a replica set. Production is never one server: a disk dies, a cloud zone goes dark, a kernel update needs a reboot. A <strong>replica set</strong> keeps the same data on several servers, one of which — the <strong>primary</strong> — takes every write, while the others — <strong>secondaries</strong> — copy it. This lesson builds three real containers with Docker Compose, reads the log the secondaries copy from, watches a secondary fall behind and catch up, and adds a fourth member from nothing.</p>

<h3>An everyday picture: one ledger and two clerks</h3>
<p>A shop keeps one official ledger. Only the head cashier writes in it. Two clerks sit beside her and copy every new line, in order, into their own books. If the head cashier falls ill, the clerks do not stop the shop: they agree among themselves who takes the official pen — and because they copied line by line, the new head cashier's book is already almost the same. Two rules make this work: lines are copied <em>in order</em>, and a decision needs <em>most</em> of the people at the table, so two groups can never both believe they hold the pen.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · write</span><span class="lz-t">client → primary</span><span class="lz-d">the only member that accepts writes</span></div>
  <div class="lz-step"><span class="lz-k">2 · oplog</span><span class="lz-t">primary appends an entry to local.oplog.rs</span><span class="lz-d">one ordered, idempotent line per changed document</span></div>
  <div class="lz-step"><span class="lz-k">3 · pull</span><span class="lz-t">secondaries fetch new entries and apply them</span><span class="lz-d">from the primary or from another secondary (chaining)</span></div>
  <div class="lz-step"><span class="lz-k">4 · heartbeat</span><span class="lz-t">every member pings every other every 2 s</span><span class="lz-d">no answer from the primary for 10 s ⇒ election</span></div>
</div>
<p>Replication buys you three things, in this order of importance: <strong>availability</strong> (a new primary in seconds when one dies), <strong>durability</strong> (a write on a majority survives losing a machine — Lesson 6.3), and some <strong>read capacity</strong> (secondaries can answer reads, with the staleness from Lesson 6.4). It also unlocks features: transactions and change streams only run on replica sets, which is why the lab has been a one-member set since Lesson 0.2.</p>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-3-1-leader-follower', title: 'Distributed Systems 3.1 — Single-leader replication', sub: 'The general theory: synchronous vs asynchronous, replication lag, read-your-writes' })}

<h3>Three real machines with Docker Compose</h3>
<p>The file <code>_demo/rs/compose.yaml</code> starts three <code>mongod</code> containers on a private network <code>mgo-rs-net</code>. Each has a hostname (<code>r1</code>, <code>r2</code>, <code>r3</code>), its own volume, a 0.25 GB cache and a 1 GB memory limit so three servers fit on a laptop, and the open-file limit raised from Docker's 1024. The healthcheck of r1 runs <code>rs.initiate</code> once; r1 gets <code>priority: 2</code> so it is normally the primary.</p>
${ma('yaml', COMPOSE)}
${lenh(K, 0)}
<p>The set needed about ten seconds after the containers were "healthy" to hold its first election; <code>hon-loan.sh on-dinh</code> then waits until r1 (priority 2) is primary and both secondaries have a sync source. Now look at it from inside:</p>
${lenh(K, 1)}
${lenh(K, 2)}
<p><code>rs.status()</code> is the members' view: state, sync source, priority. <code>hello()</code> is what a driver asks when it connects: the set's name, the list of members <em>by the names written in the configuration</em>, and who the primary is. Remember that detail — it is the most common replica-set problem on a developer's laptop.</p>

<h3>Trap: the names inside the replica set</h3>
<p>The compose file publishes the three ports on 127.0.0.1 (47101–47103). So from the host you should be able to connect… let's try, with a client container on the host network:</p>
${lenh(K, 3)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — "the port is open but the driver says ENOTFOUND r1".</strong> The driver used 127.0.0.1:47101 only as a <em>seed</em>. It asked <code>hello</code>, learned that the members are called <code>r1</code>, <code>r2</code>, <code>r3</code>, and from that moment connects only to those names — which your laptop cannot resolve. Ports do not help; the names in <code>rs.conf()</code> are the truth. <code>directConnection=true</code> talks to one member only (here r2, which answers honestly that it is not the primary): fine for looking with Compass, wrong for an application because it never follows a failover. Real fixes: run the application inside the same network (this chapter's Node.js app is a Compose service), or configure members with names every client can resolve — DNS names in production.</p>
</div>

<h3>The oplog: what the secondaries actually copy</h3>
<p>Every write on the primary also appends entries to a special capped collection, <code>local.oplog.rs</code>. Five ordinary operations on a stock collection, then the oplog entries they produced:</p>
${lenh(K, 4)}
<p>Read it line by line. <code>i</code> = insert, <code>u</code> = update, <code>d</code> = delete; <code>o2</code> says which document. Three details matter:</p>
<ul>
<li><strong><code>$inc: { ton: -1 }</code> became <code>u: { ton: 9 }</code></strong> — the oplog does not record "subtract one", it records the <em>result</em>, "set to 9". Applying that entry twice gives 9 again. Every oplog entry is <strong>idempotent</strong>, so a secondary that crashes in the middle of a batch can re-apply it safely.</li>
<li><strong>One <code>updateMany</code> on three documents became three entries</strong>, one per document. A command that touches a million documents writes a million oplog entries — the reason a big migration can push secondaries minutes behind.</li>
<li><strong><code>insertMany</code> was grouped in one <code>applyOps</code></strong> entry: batched writes are cheaper to replicate as well as to execute (Lesson 2.1).</li>
</ul>
${lenh(K, 5)}
<p>The oplog has a fixed size; old entries are overwritten. The default is 5% of the free disk space, at least 990 MB and at most 50 GB — on this machine about the number above. The <strong>oplog window</strong> is how much time those megabytes cover at your write rate: here, a few seconds of history because the cluster is new; in production, typically hours or days. A secondary that is down for longer than the window cannot catch up and needs a full resync.</p>
${nguon('📘', 'Replica Set Oplog — MongoDB Docs', 'Idempotent entries; default size 5% of free disk, minimum 990 MB, maximum 50 GB; oplog window', 'https://www.mongodb.com/docs/manual/core/replica-set-oplog/')}

<h3>Replication lag: freeze one member</h3>
<p><code>docker pause</code> freezes every process of a container, like a virtual machine that stops getting CPU. The script picks a "leaf" secondary — one that no other member copies from (secondaries may copy from each other, <em>chaining</em>, and freezing a sync source would stall its followers too) — freezes it, keeps writing for six seconds, and asks the primary how far each secondary is:</p>
${lenh(K, 6)}
${lenh(K, 7)}
<p>The writes did not slow down: 28,000 documents in six seconds, because <code>w: "majority"</code> needs two of three and the primary plus the running secondary are two. The frozen r2 shows 20 seconds of lag — more than the six seconds it was frozen. Lag is measured between <em>oplog timestamps</em>: r2's last applied entry was the last write before the freeze, and the cluster had been idle for a while before that. So a lag figure answers "how old is the newest write this secondary has", not "for how long has it been stuck". Unfreeze it:</p>
${lenh(K, 8)}
${lenh(K, 9)}
<p>Back to zero within three seconds: r2 fetched the 28,000 entries it missed from the oplog and applied them. This is the normal life of a replica set — lag rises during bursts and falls back. What you alert on is lag that keeps <em>growing</em>, or that approaches the oplog window.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "read from the secondary to take load off the primary".</strong> While r2 was frozen, a read sent to it would have answered with data from before the freeze, without any error. Reads from secondaries are fine for reports and dashboards, wrong for "show the user the order they just placed" (Lesson 6.4: causal sessions, read concern). And a secondary has to apply every write the primary takes, so it is not "free" capacity: if the primary is overloaded by writes, the secondaries are too.</p>
</div>

<h3>Adding a member: initial sync</h3>
<p>A new member starts empty. It copies every collection from a sync source (<strong>initial sync</strong>), then applies the oplog entries written meanwhile, then becomes a normal secondary. Add it with <code>priority: 0, votes: 0</code> first, so a half-synced machine cannot vote or be elected; give it a vote once it is SECONDARY.</p>
${lenh(K, 10)}
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
<p>Two seconds for a few megabytes. On a real database of 500 GB the same STARTUP2 phase takes hours, copies over the network and loads the source — plan it outside peak time, or seed the new member from a file-system snapshot.</p>

<h3>Majority, and why the number of voters is odd</h3>
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
<table>
<thead><tr><th>Voting members</th><th>Majority</th><th>Can lose</th><th>Comment</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>0</td><td>the lab of Chapters 0–6: no failover at all</td></tr>
<tr><td>2</td><td>2</td><td>0</td><td>worse than one: losing either member stops writes</td></tr>
<tr><td>3</td><td>2</td><td>1</td><td>the usual production minimum</td></tr>
<tr><td>4</td><td>3</td><td>1</td><td>same tolerance as 3, more cost</td></tr>
<tr><td>5</td><td>3</td><td>2</td><td>two zones down, or one down during maintenance of another</td></tr>
<tr><td>7</td><td>4</td><td>3</td><td>maximum number of voters; up to 50 members in total (the rest votes: 0)</td></tr>
</tbody>
</table>
<p>Elections use a protocol in the Raft family: a member that has not heard from the primary for <code>electionTimeoutMillis</code> (10 s) becomes a candidate, asks for votes, and wins only with a majority — and only if its oplog is at least as recent as the voters'. The MongoDB documentation gives a median of under 12 seconds from losing the primary to having a new one with default settings. Lesson 7.2 measures what your application experiences during those seconds.</p>
${nguon('📘', 'Replica Set Elections — MongoDB Docs', 'Election triggers, 10 s default timeout, median under 12 s, 7 voting members out of up to 50', 'https://www.mongodb.com/docs/manual/core/replica-set-elections/')}
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-6-3-raft', title: 'Distributed Systems 6.3 — Raft: leader election, log replication, safety', sub: 'Terms, votes, heartbeats — the algorithm family behind MongoDB elections' })}

<h3>🔒 Security note: members trust each other</h3>
<p>The lab runs without authentication, so any process on the network <code>mgo-rs-net</code> could join the conversation. In a real deployment with access control, members must also authenticate <em>to each other</em> — a shared <code>keyFile</code> or x.509 certificates — otherwise enabling users for clients does not stop a rogue <code>mongod</code> from replicating your data. Chapter 9 sets this up; for now remember that a replica set is three doors, not one.</p>

<h3>💼 At work: the connection string that pinned one server</h3>
<p>A common story on outsourcing projects: the ops team gives you <code>mongodb://10.0.1.5:27017/shop</code>. Everything works for months — until the night that server is rebooted for patching. MongoDB elects 10.0.1.6 in ten seconds, but your service is still talking to 10.0.1.5, now a secondary, and every write fails with <code>NotWritablePrimary</code> until someone restarts the service. The connection string had no <code>replicaSet=</code> and only one host, so the driver treated it as a single server. The fix is one line: list several members and the set name (<code>mongodb://10.0.1.5,10.0.1.6,10.0.1.7/shop?replicaSet=rs1</code>) or use a <code>mongodb+srv://</code> DNS record; then verify it by stepping down the primary in staging and watching the service keep working (Lesson 7.2).</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is the oplog and why must entries be idempotent?"</strong> — An ordered capped collection of changes on the primary that secondaries copy; entries record results ($inc becomes the new value) so re-applying after a crash is safe.</li>
<li><strong>"Why three members and not two?"</strong> — Two voters need both for a majority, so losing either stops writes; three tolerate one failure.</li>
<li><strong>"What happens if a secondary is down longer than the oplog window?"</strong> — It becomes too stale to catch up and needs a full resync; size the oplog and alert on lag.</li>
<li><strong>"How does a driver find the primary?"</strong> — From the seed list it reads hello().hosts and monitors every member; it routes writes to whoever claims primary with the newest term.</li>
<li><strong>"How long does failover take?"</strong> — Roughly 10 s to detect plus the election; MongoDB documents a median under 12 s. What the application sees depends on its driver settings (Lesson 7.2).</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>A replica set has five voting members. How many can fail while writes with <code>w: "majority"</code> still succeed? What changes if you add a sixth voting member?</li>
<li>Bring the cluster up, then from your host run <code>mongosh "mongodb://127.0.0.1:47101/?replicaSet=rs1"</code>. Explain exactly why it fails, and list three ways to connect — saying which one an application may use.</li>
<li><code>docker stop mgo-r3</code> for a whole weekend on a busy system. What happens when you start it on Monday, and what do you monitor to prevent it?</li>
</ol>
${loiGiai('Suggested answers', GIAI_EN)}
<p><strong>Done when:</strong> you have read your own oplog entries, seen a secondary fall behind and catch up, and can explain why your laptop cannot connect with <code>replicaSet=rs1</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Replica set', 'A group of mongod servers holding the same data: one primary takes writes, secondaries copy them.'],
  ['Primary / secondary', 'The member that accepts writes / members that replicate from the oplog and can serve reads.'],
  ['Oplog', 'local.oplog.rs: ordered, idempotent, capped log of every change; default 5% of free disk (990 MB–50 GB).'],
  ['Oplog window', 'How much time the oplog covers; a member down longer than that must fully resync.'],
  ['Replication lag', 'How far a secondary\'s last applied write is behind the primary.'],
  ['Initial sync', 'A new member copies all data, then the oplog written meanwhile, then becomes SECONDARY.'],
  ['Election', 'Members choose a new primary when it is unreachable for electionTimeoutMillis (10 s); needs a majority of votes.'],
  ['hello / seed list', 'What a driver asks to discover members by their configured names; the hosts you list are only starting points.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>One primary writes; secondaries copy the oplog in order; an election replaces a lost primary in about ten seconds.</li>
<li>Members are known by the names in rs.conf(): clients must resolve them — the classic ENOTFOUND on a laptop.</li>
<li>Oplog entries are idempotent results, one per document; updateMany on a million documents is a million entries.</li>
<li>Lag rises and falls; alert when it grows or nears the oplog window.</li>
<li>Add members as non-voting until they finish initial sync; keep an odd number of voters, at most seven.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Replica set: oplog, bầu chọn và cụm ba máy</h2>
<p class="lead">Tới giờ lab là một máy chủ MongoDB đóng vai replica set. Production không bao giờ là một máy: đĩa hỏng, một vùng đám mây mất điện, bản vá nhân hệ điều hành cần khởi động lại. <strong>Replica set</strong> giữ cùng một dữ liệu trên nhiều máy, trong đó một máy — <strong>primary</strong> — nhận mọi lần ghi, các máy còn lại — <strong>secondary</strong> — chép lại. Bài này dựng ba container thật bằng Docker Compose, đọc cuốn nhật ký mà secondary chép theo, nhìn một secondary tụt lại rồi đuổi kịp, và thêm máy thứ tư từ con số không.</p>

<h3>Hình ảnh đời thường: một sổ cái và hai thư ký</h3>
<p>Một cửa hàng giữ một cuốn sổ cái chính thức. Chỉ thủ quỹ trưởng được ghi vào đó. Hai thư ký ngồi cạnh, chép từng dòng mới, đúng thứ tự, vào sổ riêng của mình. Nếu thủ quỹ trưởng ốm, cửa hàng không đóng cửa: hai thư ký thống nhất với nhau ai cầm bút chính thức — và vì đã chép từng dòng, sổ của thủ quỹ mới gần như đã giống hệt. Hai luật làm cách này chạy được: các dòng được chép <em>đúng thứ tự</em>, và một quyết định cần <em>đa số</em> người ngồi ở bàn, nên không bao giờ có hai nhóm cùng tin mình đang cầm bút.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · ghi</span><span class="lz-t">client → primary</span><span class="lz-d">thành viên duy nhất nhận ghi</span></div>
  <div class="lz-step"><span class="lz-k">2 · oplog</span><span class="lz-t">primary nối một mục vào local.oplog.rs</span><span class="lz-d">mỗi tài liệu đổi là một dòng, có thứ tự, idempotent</span></div>
  <div class="lz-step"><span class="lz-k">3 · kéo</span><span class="lz-t">secondary lấy các mục mới rồi áp dụng</span><span class="lz-d">từ primary hoặc từ một secondary khác (chaining)</span></div>
  <div class="lz-step"><span class="lz-k">4 · nhịp tim</span><span class="lz-t">mỗi thành viên hỏi thăm mọi thành viên khác mỗi 2 s</span><span class="lz-d">primary im lặng 10 s ⇒ bầu chọn</span></div>
</div>
<p>Nhân bản mua cho bạn ba thứ, theo thứ tự quan trọng: <strong>tính sẵn sàng</strong> (có primary mới sau vài giây khi một máy chết), <strong>độ bền</strong> (lần ghi nằm trên đa số sống qua việc mất một máy — Bài 6.3), và thêm chút <strong>sức đọc</strong> (secondary trả lời được lệnh đọc, kèm độ cũ ở Bài 6.4). Nó còn mở khoá tính năng: transaction và change stream chỉ chạy trên replica set, nên lab đã là replica set một thành viên từ Bài 0.2.</p>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-3-1-leader-follower', title: 'Hệ thống phân tán 3.1 — Nhân bản một leader', sub: 'Lý thuyết chung: đồng bộ và bất đồng bộ, độ trễ nhân bản, đọc thấy lần ghi của mình' })}

<h3>Ba máy thật bằng Docker Compose</h3>
<p>Tệp <code>_demo/rs/compose.yaml</code> chạy ba container <code>mongod</code> trên một mạng riêng <code>mgo-rs-net</code>. Mỗi máy có tên máy (<code>r1</code>, <code>r2</code>, <code>r3</code>), volume riêng, cache 0,25 GB và giới hạn 1 GB RAM để ba máy chủ vừa trên một laptop, và giới hạn số tệp mở được nâng khỏi mức 1024 của Docker. Healthcheck của r1 chạy <code>rs.initiate</code> một lần; r1 được <code>priority: 2</code> nên bình thường nó là primary.</p>
${ma('yaml', COMPOSE)}
${lenh(K, 0)}
<p>Sau khi các container "healthy", cụm cần chừng mười giây cho lần bầu đầu tiên; <code>hon-loan.sh on-dinh</code> rồi chờ tới khi r1 (priority 2) là primary và cả hai secondary đã có nguồn chép. Giờ nhìn từ bên trong:</p>
${lenh(K, 1)}
${lenh(K, 2)}
<p><code>rs.status()</code> là góc nhìn của các thành viên: trạng thái, nguồn chép, độ ưu tiên. <code>hello()</code> là câu driver hỏi khi nối vào: tên của set, danh sách thành viên <em>theo đúng tên ghi trong cấu hình</em>, và ai là primary. Hãy nhớ chi tiết đó — đây là lỗi replica set hay gặp nhất trên laptop của lập trình viên.</p>

<h3>Bẫy: tên máy bên trong replica set</h3>
<p>Tệp compose mở ba cổng trên 127.0.0.1 (47101–47103). Vậy từ máy chủ bạn phải nối được… thử bằng một container client trên mạng của máy chủ:</p>
${lenh(K, 3)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "cổng mở rồi mà driver báo ENOTFOUND r1".</strong> Driver chỉ dùng 127.0.0.1:47101 làm <em>máy mồi</em>. Nó hỏi <code>hello</code>, biết các thành viên tên là <code>r1</code>, <code>r2</code>, <code>r3</code>, và từ lúc đó chỉ nối tới các tên đó — mà laptop của bạn không phân giải được. Cổng không giúp gì; tên trong <code>rs.conf()</code> mới là sự thật. <code>directConnection=true</code> chỉ nói chuyện với một máy (ở đây r2, nó trả lời thật là mình không phải primary): ổn để xem bằng Compass, sai cho ứng dụng vì nó không bao giờ đi theo chuyển dự phòng. Cách sửa thật: chạy ứng dụng trong cùng mạng (ứng dụng Node.js của chương này là một service của Compose), hoặc cấu hình thành viên bằng tên mà mọi client phân giải được — tên DNS ở production.</p>
</div>

<h3>Oplog: thứ secondary thật sự chép</h3>
<p>Mỗi lần ghi trên primary còn nối thêm các mục vào một collection có giới hạn đặc biệt, <code>local.oplog.rs</code>. Năm thao tác bình thường trên collection tồn kho, rồi các mục oplog chúng sinh ra:</p>
${lenh(K, 4)}
<p>Đọc từng dòng. <code>i</code> = chèn, <code>u</code> = cập nhật, <code>d</code> = xoá; <code>o2</code> cho biết tài liệu nào. Ba chi tiết đáng nhớ:</p>
<ul>
<li><strong><code>$inc: { ton: -1 }</code> thành <code>u: { ton: 9 }</code></strong> — oplog không ghi "trừ một", nó ghi <em>kết quả</em>, "đặt thành 9". Áp dụng mục đó hai lần vẫn ra 9. Mọi mục oplog đều <strong>idempotent</strong>, nên secondary sập giữa một lô vẫn áp dụng lại an toàn.</li>
<li><strong>Một <code>updateMany</code> trên ba tài liệu thành ba mục</strong>, mỗi tài liệu một mục. Một lệnh chạm một triệu tài liệu ghi một triệu mục oplog — lý do một lần chuyển đổi dữ liệu lớn có thể đẩy secondary tụt lại nhiều phút.</li>
<li><strong><code>insertMany</code> được gói trong một mục <code>applyOps</code></strong>: ghi theo lô rẻ hơn cả lúc chạy lẫn lúc nhân bản (Bài 2.1).</li>
</ul>
${lenh(K, 5)}
<p>Oplog có kích thước cố định; mục cũ bị ghi đè. Mặc định là 5% dung lượng đĩa còn trống, tối thiểu 990 MB và tối đa 50 GB — trên máy này cỡ con số ở trên. <strong>Cửa sổ oplog</strong> là khoảng thời gian số megabyte đó bao được ở tốc độ ghi của bạn: ở đây chỉ vài giây lịch sử vì cụm mới dựng; ở production thường là nhiều giờ tới nhiều ngày. Secondary nằm im lâu hơn cửa sổ thì không đuổi kịp được nữa và phải đồng bộ lại toàn bộ.</p>
${nguon('📘', 'Replica Set Oplog — MongoDB Docs', 'Mục idempotent; cỡ mặc định 5% đĩa trống, tối thiểu 990 MB, tối đa 50 GB; cửa sổ oplog', 'https://www.mongodb.com/docs/manual/core/replica-set-oplog/')}

<h3>Độ trễ nhân bản: đóng băng một máy</h3>
<p><code>docker pause</code> đóng băng mọi tiến trình của một container, như một máy ảo không được cấp CPU. Script chọn một secondary "lá" — máy không ai chép từ nó (secondary có thể chép từ nhau, gọi là <em>chaining</em>, và đóng băng một nguồn chép sẽ kéo cả máy chép theo nó đứng lại) — đóng băng nó, ghi liên tục sáu giây, rồi hỏi primary từng secondary đang chậm bao nhiêu:</p>
${lenh(K, 6)}
${lenh(K, 7)}
<p>Lệnh ghi không chậm đi: 28.000 tài liệu trong sáu giây, vì <code>w: "majority"</code> cần hai trên ba và primary cộng secondary đang chạy là hai. r2 bị đóng băng báo trễ 20 giây — nhiều hơn sáu giây nó bị đóng băng. Độ trễ được đo giữa các <em>mốc thời gian trong oplog</em>: mục cuối r2 đã áp dụng là lần ghi cuối trước khi đóng băng, và cụm đã ngồi không một lúc trước đó. Nên con số độ trễ trả lời câu "lần ghi mới nhất secondary này có cũ bao nhiêu", chứ không phải "nó bị kẹt bao lâu". Rã băng nó:</p>
${lenh(K, 8)}
${lenh(K, 9)}
<p>Ba giây sau về không: r2 lấy 28.000 mục đã lỡ từ oplog và áp dụng. Đây là đời sống bình thường của một replica set — độ trễ tăng lúc ghi dồn và hạ xuống lại. Thứ cần cảnh báo là độ trễ cứ <em>tăng mãi</em>, hoặc tiến gần cửa sổ oplog.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "đọc từ secondary cho primary đỡ tải".</strong> Trong lúc r2 bị đóng băng, một lệnh đọc gửi tới nó sẽ trả dữ liệu từ trước lúc đóng băng, không báo lỗi gì. Đọc từ secondary ổn cho báo cáo và dashboard, sai cho "hiện cho khách đơn họ vừa đặt" (Bài 6.4: session nhân quả, read concern). Và secondary phải áp dụng mọi lần ghi mà primary nhận, nên nó không phải sức chứa "miễn phí": primary quá tải vì ghi thì secondary cũng vậy.</p>
</div>

<h3>Thêm thành viên: initial sync</h3>
<p>Thành viên mới khởi đầu trống trơn. Nó chép mọi collection từ một nguồn (<strong>initial sync</strong>), rồi áp dụng các mục oplog được ghi trong lúc đó, rồi thành một secondary bình thường. Hãy thêm nó với <code>priority: 0, votes: 0</code> trước, để một máy mới chép được một nửa không thể bỏ phiếu hay được bầu; cho nó phiếu khi đã là SECONDARY.</p>
${lenh(K, 10)}
${lenh(K, 11)}
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
<p>Hai giây cho vài megabyte. Với một database thật 500 GB, cùng pha STARTUP2 đó mất nhiều giờ, chép qua mạng và đè tải lên máy nguồn — hãy làm ngoài giờ cao điểm, hoặc khởi tạo máy mới từ một bản snapshot hệ thống tệp.</p>

<h3>Đa số, và vì sao số phiếu là số lẻ</h3>
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
<table>
<thead><tr><th>Số thành viên có phiếu</th><th>Đa số</th><th>Mất được</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>0</td><td>lab của Chương 0–6: không chuyển dự phòng được</td></tr>
<tr><td>2</td><td>2</td><td>0</td><td>tệ hơn một máy: mất máy nào cũng dừng ghi</td></tr>
<tr><td>3</td><td>2</td><td>1</td><td>mức tối thiểu thường gặp ở production</td></tr>
<tr><td>4</td><td>3</td><td>1</td><td>chịu lỗi như 3, tốn hơn</td></tr>
<tr><td>5</td><td>3</td><td>2</td><td>mất hai vùng, hoặc mất một máy khi máy khác đang bảo trì</td></tr>
<tr><td>7</td><td>4</td><td>3</td><td>số phiếu tối đa; tổng cộng tới 50 thành viên (phần còn lại votes: 0)</td></tr>
</tbody>
</table>
<p>Bầu chọn dùng một giao thức họ Raft: thành viên nào không nghe thấy primary trong <code>electionTimeoutMillis</code> (10 s) thì thành ứng viên, xin phiếu, và chỉ thắng khi có đa số — và chỉ khi oplog của nó ít nhất mới bằng oplog của người bỏ phiếu. Tài liệu MongoDB nêu trung vị dưới 12 giây từ lúc mất primary tới lúc có primary mới, với cấu hình mặc định. Bài 7.2 đo xem ứng dụng của bạn trải qua những giây đó thế nào.</p>
${nguon('📘', 'Replica Set Elections — MongoDB Docs', 'Điều kiện bầu, thời hạn mặc định 10 s, trung vị dưới 12 s, 7 thành viên có phiếu trên tối đa 50', 'https://www.mongodb.com/docs/manual/core/replica-set-elections/')}
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-6-3-raft', title: 'Hệ thống phân tán 6.3 — Raft: bầu leader, nhân bản log, tính an toàn', sub: 'Term, phiếu, nhịp tim — họ thuật toán đứng sau bầu chọn của MongoDB' })}

<h3>🔒 Ghi chú bảo mật: các thành viên tin nhau</h3>
<p>Lab chạy không xác thực, nên bất kỳ tiến trình nào trên mạng <code>mgo-rs-net</code> cũng chen vào được. Ở hệ thống thật có bật kiểm soát truy cập, các thành viên còn phải xác thực <em>với nhau</em> — một <code>keyFile</code> chung hoặc chứng chỉ x.509 — nếu không, bật tài khoản cho client cũng không ngăn được một <code>mongod</code> lạ chép trộm dữ liệu của bạn. Chương 9 dựng phần này; giờ chỉ cần nhớ replica set là ba cánh cửa, không phải một.</p>

<h3>💼 Đi làm: chuỗi kết nối ghim chặt một máy</h3>
<p>Chuyện hay gặp ở dự án outsourcing: đội vận hành đưa bạn <code>mongodb://10.0.1.5:27017/shop</code>. Mọi thứ chạy ngon nhiều tháng — tới đêm máy đó khởi động lại để vá. MongoDB bầu 10.0.1.6 trong mười giây, nhưng dịch vụ của bạn vẫn nói chuyện với 10.0.1.5, giờ là secondary, và mọi lần ghi báo <code>NotWritablePrimary</code> cho tới khi có người khởi động lại dịch vụ. Chuỗi kết nối không có <code>replicaSet=</code> và chỉ có một máy, nên driver coi đó là một máy đơn. Sửa bằng một dòng: liệt kê vài thành viên và tên set (<code>mongodb://10.0.1.5,10.0.1.6,10.0.1.7/shop?replicaSet=rs1</code>) hoặc dùng bản ghi DNS <code>mongodb+srv://</code>; rồi kiểm bằng cách cho primary nhường chức ở môi trường staging và nhìn dịch vụ vẫn chạy (Bài 7.2).</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Oplog là gì và vì sao mục phải idempotent?"</strong> — Một collection có giới hạn, có thứ tự, ghi các thay đổi trên primary để secondary chép; mục ghi kết quả ($inc thành giá trị mới) nên áp dụng lại sau sự cố vẫn an toàn.</li>
<li><strong>"Vì sao ba thành viên mà không phải hai?"</strong> — Hai phiếu thì cần cả hai mới đủ đa số, mất máy nào cũng dừng ghi; ba chịu được một máy hỏng.</li>
<li><strong>"Secondary nằm im lâu hơn cửa sổ oplog thì sao?"</strong> — Nó quá cũ để đuổi kịp và phải đồng bộ lại toàn bộ; đặt cỡ oplog và cảnh báo độ trễ.</li>
<li><strong>"Driver tìm primary thế nào?"</strong> — Từ danh sách máy mồi nó đọc hello().hosts và theo dõi mọi thành viên; lệnh ghi đi tới máy tự nhận là primary với term mới nhất.</li>
<li><strong>"Chuyển dự phòng mất bao lâu?"</strong> — Khoảng 10 s để phát hiện cộng thời gian bầu; MongoDB nêu trung vị dưới 12 s. Ứng dụng thấy gì thì tuỳ cấu hình driver (Bài 7.2).</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Một replica set có năm thành viên có phiếu. Hỏng được bao nhiêu máy mà lệnh ghi <code>w: "majority"</code> vẫn thành công? Thêm thành viên có phiếu thứ sáu thì thay đổi gì?</li>
<li>Dựng cụm, rồi từ máy chủ chạy <code>mongosh "mongodb://127.0.0.1:47101/?replicaSet=rs1"</code>. Giải thích chính xác vì sao nó hỏng, và nêu ba cách nối được — chỉ ra cách nào ứng dụng được phép dùng.</li>
<li><code>docker stop mgo-r3</code> suốt một kỳ nghỉ cuối tuần trên một hệ thống ghi nhiều. Thứ Hai bật lại thì chuyện gì xảy ra, và cần giám sát gì để tránh?</li>
</ol>
${loiGiai('Gợi ý đáp án', GIAI_VI)}
<p><strong>Xong khi:</strong> bạn đã đọc các mục oplog của chính mình, thấy một secondary tụt lại rồi đuổi kịp, và giải thích được vì sao laptop không nối được bằng <code>replicaSet=rs1</code>.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Replica set', 'Nhóm máy chủ mongod giữ cùng một dữ liệu: một primary nhận ghi, các secondary chép lại.'],
  ['Primary / secondary', 'Thành viên nhận ghi / các thành viên chép từ oplog và có thể trả lời lệnh đọc.'],
  ['Oplog', 'local.oplog.rs: nhật ký có thứ tự, idempotent, có giới hạn của mọi thay đổi; mặc định 5% đĩa trống (990 MB–50 GB).'],
  ['Cửa sổ oplog', 'Khoảng thời gian oplog bao được; thành viên nằm im lâu hơn thế phải đồng bộ lại toàn bộ.'],
  ['Độ trễ nhân bản', 'Lần ghi cuối mà secondary đã áp dụng chậm hơn primary bao lâu.'],
  ['Initial sync', 'Thành viên mới chép toàn bộ dữ liệu, rồi oplog được ghi trong lúc đó, rồi thành SECONDARY.'],
  ['Bầu chọn', 'Các thành viên chọn primary mới khi primary im lặng quá electionTimeoutMillis (10 s); cần đa số phiếu.'],
  ['hello / máy mồi', 'Câu driver hỏi để tìm thành viên theo tên đã cấu hình; các máy bạn liệt kê chỉ là điểm bắt đầu.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Một primary ghi; secondary chép oplog đúng thứ tự; bầu chọn thay primary đã mất trong chừng mười giây.</li>
<li>Thành viên được biết bằng tên trong rs.conf(): client phải phân giải được — lỗi ENOTFOUND kinh điển trên laptop.</li>
<li>Mục oplog là kết quả idempotent, mỗi tài liệu một mục; updateMany một triệu tài liệu là một triệu mục.</li>
<li>Độ trễ lên rồi xuống; cảnh báo khi nó cứ tăng hoặc gần cửa sổ oplog.</li>
<li>Thêm thành viên không phiếu cho tới khi xong initial sync; giữ số phiếu lẻ, tối đa bảy.</li>
</ul>
</div>
`,
};
