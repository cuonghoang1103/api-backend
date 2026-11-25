/**
 * 8.1 — Driver Node.js chính thức: chuỗi kết nối và pool (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s08-1-driver'] (MongoDB 8.0.38 trong mgo-lab, Node 22 + driver mongodb 7.9.1 trên máy; kịch bản demo/s08/s08-1-driver.txt
 * tự nạp lại CT Shop, ghi ở ch8). Khối: 0 directConnection · 1 client mỗi request · 2 pool + vé đọc · 3 trần kết nối 409 · 4 con trỏ · 5 kiểu BSON · 6 API Express.
 * Số tất định: 3 s chọn máy chủ rồi ECONNREFUSED localhost:27017; ~600 kết nối mở thêm (2 mỗi client) vs 2; trần 409 = (1024/2)×0,8; lô đầu 101, getMore
 * tới 16 MiB (27.566 dòng), batchSize 1000 ⇒ 200 getMore; ObjectId chuỗi ⇒ null; Decimal128 + 1 = "199000.501"; Long 2^53+1 ⇒ JSON {high,low}.
 * Số dao động (chỉ nêu tỉ lệ): ms, số vé đọc (10–14), số lỗi khi vượt trần (~70/500), heap.
 * Kiểm trùng: timeout/failover/retryWrites đã ở 7.2 (không dạy lại); Express cơ bản ở nodejs/SDN302 ⇒ liên kết chéo.
 */
import { lenh, ma, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's08-1-driver';

const DB_MJS = `// _demo/node/db.mjs — MỘT MongoClient cho cả tiến trình; mọi route import dùng chung
import { MongoClient } from 'mongodb';

export const client = new MongoClient(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:47017/ctshop?directConnection=true', {
  maxPoolSize: Number(process.env.MONGO_POOL ?? 20),   // nhân với số bản ứng dụng phải < trần máy chủ
  waitQueueTimeoutMS: 2000,                            // chờ kết nối quá 2 s ⇒ báo lỗi nhanh thay vì treo request
  appName: 'ctshop-api',                               // hiện trong log/currentOp của máy chủ ⇒ biết ai đang gọi
});
export const db = client.db();                         // database lấy từ URI (ctshop)`;

const API = `// Trích _demo/node/s08-api.mjs (Express 5)
app.get('/binh-luan/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ loi: 'id không hợp lệ' });
  const b = await client.db('ch8').collection('binhLuan').findOne({ _id: new ObjectId(req.params.id) });
  b ? res.json({ ...b, gia: b.gia?.toString(), luotThich: b.luotThich?.toString() }) : res.status(404).json({ loi: 'không có' });
});
await client.connect();                 // lỗi cấu hình lộ ngay lúc khởi động, không phải ở request đầu tiên
const server = app.listen(47081, '127.0.0.1');
process.on('SIGTERM', () => {           // Docker/Kubernetes gửi SIGTERM trước khi giết
  server.close(async () => { await client.close(); process.exit(0); });   // ngừng nhận request → xong việc dở → đóng pool
});`;

const SAI = `// ✘ Lỗi kinh điển: mỗi request một MongoClient
app.get('/khach/:id', async (req, res) => {
  const c = new MongoClient(URI);                 // mở pool mới + kết nối theo dõi + bắt tay (TLS, xác thực nếu có)
  try { res.json(await c.db().collection('customers').findOne({ _id: req.params.id })); }
  finally { await c.close(); }                    // vứt đi ngay
});`;

export default {
  title: '8.1 — The official Node.js driver: connection strings and the pool|||8.1 — Driver Node.js chính thức: chuỗi kết nối và pool',
  slug: 'mgo-8-1-driver-node',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mọi thư viện Node.js cho MongoDB (Mongoose, Prisma…) đều đứng trên driver chính thức — hiểu nó là hiểu vì sao ứng dụng chậm hoặc sập. Chuỗi kết nối và directConnection (đo: 3 giây rồi ECONNREFUSED); một MongoClient cho cả tiến trình (đo: mỗi request một client mở thêm ~600 kết nối và chậm ~10 lần); pool kết nối, maxPoolSize, waitQueueTimeoutMS và vé đọc của máy chủ — vì sao pool to hơn không nhanh hơn; phép nhân số bản ứng dụng × pool đụng trần 409 kết nối thật; con trỏ đọc theo lô 16 MiB và batchSize; kiểu BSON qua ranh giới JavaScript (ObjectId dạng chuỗi trả null, Decimal128 + 1 thành chuỗi, Long trong JSON); API Express tắt êm khi SIGTERM.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>The official Node.js driver: connection strings and the pool</h2>
<p class="lead">Chapters 1–7 talked to MongoDB through mongosh. A real application talks through a <strong>driver</strong> — for Node.js, the official <code>mongodb</code> package. Mongoose (Lessons 8.2–8.3), Prisma and every other Node library are built on it, so its behaviour is <em>your</em> application's behaviour: how many connections it opens, what happens when they run out, how much memory a query uses, what types arrive in your JavaScript. This lesson measures each of those on the lab. Failover timeouts and retryable writes were already measured in Lesson 7.2 and are not repeated here.</p>

<h3>An everyday picture: a taxi company, not a taxi per trip</h3>
<p>A company that needs to move staff around town can call a new taxi for every trip — wait for it to arrive, explain the address, pay, let it go — or keep a small fleet of its own cars parked at the office. With a fleet, a trip starts immediately; if all cars are out, the next person waits in the lobby for one to come back, and the office manager decides how long a wait is acceptable before telling them "take the bus". A <code>MongoClient</code> is that fleet: a <em>connection pool</em> kept open for the whole life of the process. Creating a client per request is calling a new taxi for every trip.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">new MongoClient(uri, options)</span><span class="lz-t">once per process</span><span class="lz-d">reads the connection string, starts monitoring the servers (one extra connection per server), owns the pool</span></div>
  <div class="lz-step"><span class="lz-k">collection.findOne(…)</span><span class="lz-t">check out a connection</span><span class="lz-d">reuse an idle one, or open a new one up to maxPoolSize; if all are busy, wait in the queue (waitQueueTimeoutMS)</span></div>
  <div class="lz-step"><span class="lz-k">server</span><span class="lz-t">admission + execution</span><span class="lz-d">each query needs a read or write ticket on the server; too many at once ⇒ they queue there too</span></div>
  <div class="lz-step"><span class="lz-k">reply</span><span class="lz-t">connection back to the pool</span><span class="lz-d">BSON decoded into JavaScript values — ObjectId, Decimal128, Long, Date are objects, not strings or numbers</span></div>
</div>
${nguon('📘', 'Connection Pools — MongoDB Node.js Driver', 'Every MongoClient instance has a built-in connection pool for each server; maxPoolSize default 100', 'https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/connection-pools/')}

<h3>The connection string decides what the driver discovers</h3>
<p>The lab is a one-member replica set (Lesson 0.2) whose member calls itself <code>localhost:27017</code> — inside its container. Your machine reaches it through the published port <code>127.0.0.1:47017</code>. Watch what that difference does:</p>
${lenh(K, 0)}
<p>With a plain URI the driver connects to the seed, asks it "who is in this replica set?", gets <code>localhost:27017</code>, and from then on talks <em>only</em> to the members the server advertised. Port 27017 on your machine has nothing behind it, so after the server selection timeout (3 s here, 30 s by default) every operation fails. <code>directConnection=true</code> says "talk to exactly this address, do not discover" — right for a lab, a tunnel or a single-node test. In production with a real replica set, do the opposite: list several members with <code>replicaSet=…</code> (or use a <code>mongodb+srv://</code> DNS name) and make sure the names the members advertise resolve from where the application runs — Lesson 7.1 hit the same wall as <code>ENOTFOUND r1</code>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — directConnection in production.</strong> It "fixes" a connection error on a developer laptop, gets copied into the production config, and then the application sticks to one node: when that node stops being primary (Lesson 7.2), every write fails with "not primary" until someone edits the config. If you need it, keep it in the <em>local</em> environment file only.</p>
</div>

<h3>One MongoClient per process — measured</h3>
<p>The classic beginner mistake, often copied from tutorials:</p>
${ma('js', SAI)}
<p>Three hundred requests, done both ways:</p>
${lenh(K, 1)}
<p>Each client opens <strong>two</strong> connections (one for monitoring, one for the query) and throws them away: about 600 new connections for 300 requests, and ten times the latency — on <em>localhost</em>, without TLS and without authentication. Over a real network each new connection adds a TCP handshake, a TLS handshake and a SCRAM authentication exchange (Chapter 9): several round trips before the first byte of your query. The shared client opened 2 connections in total. The pattern is a module that creates the client once and is imported everywhere:</p>
${ma('js', DB_MJS)}
<p>The same rule holds in serverless functions (AWS Lambda, Vercel): create the client <em>outside</em> the handler so warm invocations reuse it.</p>

<h3>The pool: maxPoolSize, the wait queue — and the server's own queue</h3>
<p>Fifty requests arrive at once; each runs a query that takes about 200 ms on the server (simulated with <code>$where: 'sleep(200) || true'</code> — server-side JavaScript, for the lab only). We change the pool size and also read the server's admission queue, <code>serverStatus().queues.execution.read</code>:</p>
${lenh(K, 2)}
<p>Read it line by line:</p>
<ul>
<li><strong>maxPoolSize 5</strong>: only five queries run at a time; 50 × 200 ms ÷ 5 ≈ 2 s. The slowest request waited almost the whole time <em>in the driver</em>, for a connection.</li>
<li><strong>maxPoolSize 10</strong>: twice as fast, as expected.</li>
<li><strong>maxPoolSize 50</strong>: every request got a connection immediately — and it was <em>not</em> faster than 10. The server line shows why: MongoDB 8.0 admits only a small number of operations into the storage engine at once (about a dozen <strong>read tickets</strong> here, adjusted dynamically since 7.0), and most of the 50 queries queued <em>on the server</em> instead of in the driver. A bigger pool moved the queue; it did not remove it.</li>
<li><strong>waitQueueTimeoutMS 1000</strong>: half the requests got <code>MongoWaitQueueTimeoutError</code> after one second instead of waiting two. That is a feature: a request that fails fast with 503 frees the user and your web server; a request that hangs for 30 s ties up both.</li>
</ul>
${nguon('📘', 'WiredTiger — Transaction (Read and Write) Concurrency', 'Starting in version 7.0, MongoDB uses a default algorithm to dynamically adjust the maximum number of concurrent storage engine transactions (read and write tickets)', 'https://www.mongodb.com/docs/manual/core/wiredtiger/')}
<div class="pitfall co-tieu-de">
<p><strong>Trap — "the database is slow, raise maxPoolSize".</strong> When queries are slow because they scan (Chapter 4) or hold resources, more connections only put more work on a server that is already saturated; the wait just moves from the driver's queue to the server's ticket queue, and memory per connection (about 1 MB of stack per connection thread on the server) goes up. Fix the query first. Raise the pool when the driver queue is long <em>and</em> the server is idle.</p>
</div>

<h3>The multiplication nobody does: instances × maxPoolSize</h3>
<p>The default <code>maxPoolSize</code> is 100 <em>per client, per server</em>. Your API runs in five containers behind a load balancer; a traffic spike arrives. Five clients, 100 slow queries each:</p>
${lenh(K, 3)}
<p>The lab's server accepts at most <strong>409</strong> connections. That number is not arbitrary: on Linux the default <code>net.maxIncomingConnections</code> is (open-file limit ÷ 2) × 0.8, and this container has the Docker default of 1,024 open files (the same limit that crashed mongod in Lesson 3.5): 512 × 0.8 = 409.6. Five pools wanted 500 connections plus monitoring connections; above 409 the server refused new connections (the log lines), and the driver reported dozens of queries as <code>MongoNetworkError … closed</code> — to your users, random 500 errors during the spike, while the server itself was healthy. Budget it explicitly: <em>instances × maxPoolSize (+ monitoring) &lt; server limit</em>, with room for autoscaling, cron jobs and your own mongosh. Atlas tiers publish their connection limits for the same reason.</p>
${nguon('📘', 'net.maxIncomingConnections — Configuration options', 'Default (Linux): (RLIMIT_NOFILE / 2) * 0.8', 'https://www.mongodb.com/docs/manual/reference/configuration-options/')}

<h3>Cursors: toArray pulls everything, for await reads in batches</h3>
<p>A <code>find()</code> returns a cursor, not documents. The first reply carries 101 documents; each <code>getMore</code> then returns up to 16 MiB. On 200,000 log lines of about 600 bytes, with the commands the driver actually sent counted from its monitoring events:</p>
${lenh(K, 4)}
<ul>
<li><code>toArray()</code> keeps all 200,000 objects alive at once — hundreds of MB of heap for one request. Ten users exporting at the same time and the process dies of "JavaScript heap out of memory".</li>
<li><code>for await</code> processes documents as they come, so memory drops by half — but not to zero: each 16 MiB batch (27,566 documents here) is decoded at once.</li>
<li><code>batchSize: 1000</code> bounds the batch: heap falls to tens of MB at the price of 200 round trips instead of 8. Choose it for exports, migrations and anything that streams to a file or HTTP response.</li>
<li>A <strong>projection</strong> that keeps only small fields is the fastest — but look at the last column: with tiny documents, one 16 MiB batch held 199,899 of them and the heap went <em>up</em>. Batch size counts bytes on the wire, not objects in your heap.</li>
</ul>

<h3>BSON types at the JavaScript boundary</h3>
<p>The driver turns BSON into JavaScript values, and four of them surprise everyone at least once:</p>
${lenh(K, 5)}
<ol>
<li><strong>ObjectId is not a string.</strong> Express gives you <code>req.params.id</code> as a string; <code>findOne({ _id: '6b04…' })</code> compares a string with an ObjectId and matches nothing — no error, just <code>null</code> and a "not found" bug. Convert with <code>new ObjectId(s)</code>, and validate first: the constructor <em>throws</em> on bad input, which becomes a 500 if unhandled. Note that in BSON 7 <code>ObjectId.isValid</code> only accepts 24-hex strings (older versions also accepted any 12-character string).</li>
<li><strong>Decimal128 is an object.</strong> <code>gia + 1</code> silently becomes the <em>string</em> "199000.501", and <code>JSON.stringify</code> emits <code>{"$numberDecimal": …}</code>. Do money arithmetic on the server (<code>$multiply</code> keeps "597001.50") or in integer minor units, and send money to clients as strings (Lesson 1.2, and the lab of this chapter).</li>
<li><strong>Int64.</strong> The driver gives you a normal number when the value is exactly representable and a <code>Long</code> above 2<sup>53</sup> — so the same field can have two types in your code, and <code>JSON.stringify</code> of a Long prints its internal <code>{high, low}</code>. Convert explicitly at the API edge.</li>
<li><strong>Date</strong> is stored in UTC; <code>toString()</code> prints in the time zone of the machine running Node. A server in a UTC container shows different text from your laptop — format with an explicit time zone (Lesson 5.3).</li>
</ol>

<h3>A minimal API that behaves</h3>
<p>Putting it together — one client from <code>db.mjs</code>, validated ids, explicit conversion at the edge, and a graceful shutdown so that a redeploy does not cut queries in half:</p>
${ma('js', API)}
${lenh(K, 6)}
<p>A bad id is a 400, a missing document a 404, money and large counters leave as strings, and on <code>SIGTERM</code> the server stops accepting, finishes what is in flight, closes the pool and exits with code 0. The Node.js course covers the same ideas for PostgreSQL and for Docker:</p>
${lienKet({ cta: 'Open lesson', khoa: 'nodejs', bai: 'nodejs-7-1-ket-noi-va-pool', title: 'Node.js 7.1 — What one connection really costs', sub: 'The same pool reasoning for PostgreSQL and Prisma' })}
${lienKet({ cta: 'Open lesson', khoa: 'nodejs', bai: 'nodejs-17-3-pid-1-tat-em', title: 'Node.js 17.3 — PID 1 and graceful shutdown', sub: 'Why SIGTERM must reach Node inside Docker, and how to drain requests' })}
${lienKet({ cta: 'Open lesson', academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — MongoDB CRUD with Node.js', sub: 'The course-level introduction to the driver' })}

<h3>💼 At work: "the API dies every evening at 8 p.m."</h3>
<p>An outsourcing project: a Node API on four pods, a MongoDB replica set, a dashboard showing "connection refused" spikes at peak time. Typical findings, in order of how often they happen: a <code>new MongoClient</code> inside a request handler or inside a helper called per request; the default pool of 100 on every pod plus a reporting job with its own client — 4 × 100 + 100 against a server limit set lower by the container's open-file limit; and a slow unindexed query holding connections so the pool never drains. Your ticket answer should contain the arithmetic (pods × pool vs <code>serverStatus().connections</code>), the fix (singleton client, explicit <code>maxPoolSize</code> and <code>waitQueueTimeoutMS</code>, the index), and a load test that reproduces the spike before and after. Set <code>appName</code> so the DBA can see in <code>currentOp</code> which service owns which connections.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Where do you create the MongoClient in an Express app?"</strong> — Once, at startup, in a module shared by all routes; connect before listening; close on SIGTERM after the HTTP server stops.</li>
<li><strong>"What does maxPoolSize do, and what happens when it is reached?"</strong> — It caps concurrent connections per server; extra operations wait in the driver's queue, and fail after waitQueueTimeoutMS if set.</li>
<li><strong>"Would doubling the pool double throughput?"</strong> — Only if the server has spare capacity; MongoDB limits concurrent storage-engine operations with tickets, and slow queries queue there regardless of pool size.</li>
<li><strong>"Why does findOne({ _id: req.params.id }) return null?"</strong> — The id is a string, the field an ObjectId; convert after validating.</li>
<li><strong>"How do you stream a million documents to a CSV without running out of memory?"</strong> — Iterate the cursor with for await (or a stream) and a bounded batchSize and projection; never toArray.</li>
</ul>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>Run <code>node s08-moi-lan.mjs</code> with <code>N = 1000</code>. Then open <code>mongosh</code> and read <code>db.serverStatus().connections.totalCreated</code> before and after. How many connections per client, and why two?</li>
<li>In <code>s08-pool.mjs</code>, replace the <code>$where</code> sleep with a real slow query: <code>db.collection('orders').aggregate([{ $group: { _id: '$customerId', n: { $sum: 1 } } }])</code> on CT Shop. Does the pool size still stop mattering after about the same value? Why might the answer differ for a CPU-bound query?</li>
<li>Your company runs 6 API pods with the default pool, plus 2 workers with <code>maxPoolSize: 50</code>, against a server limited to 819 connections. Is it safe? Choose pool sizes and justify them.</li>
<li>Write an endpoint <code>GET /xuat-nhat-ky</code> that streams <code>ch8.nhatKy</code> as CSV to the response with bounded memory. Measure the heap with <code>process.memoryUsage()</code> while two clients download at once.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. Two per client: the monitoring connection (the driver keeps one per server to watch topology) and the application connection used for the query. 1000 requests ⇒ about 2000 new connections; the shared client opens 2.</p>
<p>2. With an aggregation the limit appears at a similar point if the work is I/O- or ticket-bound; for CPU-bound work it appears when the server's cores are busy — on a 12-core machine, beyond a dozen parallel aggregations you only add queueing. Measure it: plot total time against pool size and find the knee.</p>
<p>3. 6 × 100 + 2 × 50 = 700 application connections plus monitoring (8 clients × members) — under 819 at rest, but no headroom for autoscaling to 8 pods (900). Set API pods to 30–50 (a single Node process rarely needs more concurrent queries than that), workers to 10, set waitQueueTimeoutMS, and alert at 70% of the limit.</p>
<p>4. <code>res.type('text/csv'); for await (const d of nk.find({}, { batchSize: 1000, projection: { muc: 1, noiDung: 1 } })) { if (!res.write(\`\${d._id},\${d.muc}\\n\`)) await once(res, 'drain'); } res.end();</code> — respecting <code>drain</code> (backpressure) keeps memory flat even when the client downloads slowly.</p>
</details>
<p><strong>Done when:</strong> your application creates exactly one client, you can state its maximum number of connections, and no endpoint loads an unbounded result into memory.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['MongoClient', 'The driver object that owns server monitoring and a connection pool; create once per process.'],
  ['Connection string', 'mongodb:// or mongodb+srv:// URI with hosts, database and options such as replicaSet, directConnection, maxPoolSize.'],
  ['directConnection', 'Connect to exactly the given host without replica-set discovery; for labs and tunnels, not production.'],
  ['Connection pool', 'Reusable open connections per server; maxPoolSize caps them, waitQueueTimeoutMS caps the wait for one.'],
  ['Read/write tickets', 'Server-side admission limit on concurrent storage-engine operations, adjusted dynamically since MongoDB 7.0.'],
  ['maxIncomingConnections', 'Server connection limit; on Linux by default (open-file limit ÷ 2) × 0.8.'],
  ['Cursor / batch', 'find returns a cursor; the first batch has 101 documents, getMore batches up to 16 MiB unless batchSize is set.'],
  ['Decimal128 / Long', 'BSON decimal and 64-bit integer types; objects in JavaScript, convert explicitly at the API edge.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>The connection string decides discovery: replica set members must be reachable by the names they advertise; directConnection only for labs.</li>
<li>One MongoClient per process: per-request clients opened ~600 connections for 300 requests and were ~10× slower.</li>
<li>A bigger pool only helps while the server has capacity; past that, queries queue on the server's tickets.</li>
<li>Instances × maxPoolSize must stay under the server limit — 409 in a container with 1,024 open files.</li>
<li>Stream large results with for await, a bounded batchSize and a projection; never toArray an export.</li>
<li>Convert ObjectId, Decimal128, Long and Date explicitly at the boundary; validate ids; shut down gracefully.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Driver Node.js chính thức: chuỗi kết nối và pool</h2>
<p class="lead">Chương 1–7 nói chuyện với MongoDB qua mongosh. Ứng dụng thật nói chuyện qua <strong>driver</strong> — với Node.js là gói chính thức <code>mongodb</code>. Mongoose (Bài 8.2–8.3), Prisma và mọi thư viện Node khác đều đứng trên nó, nên hành vi của nó chính là hành vi ứng dụng <em>của bạn</em>: mở bao nhiêu kết nối, hết kết nối thì sao, một truy vấn ngốn bao nhiêu bộ nhớ, kiểu dữ liệu nào rơi vào JavaScript. Bài này đo từng thứ trên lab. Timeout khi chuyển dự phòng và retryable writes đã đo ở Bài 7.2, không lặp lại ở đây.</p>

<h3>Hình ảnh đời thường: công ty có đội xe riêng, không gọi taxi mỗi chuyến</h3>
<p>Một công ty cần đưa nhân viên đi lại trong thành phố có thể gọi taxi mới cho mỗi chuyến — chờ xe tới, đọc địa chỉ, trả tiền, cho xe đi — hoặc giữ một đội xe nhỏ đỗ sẵn ở văn phòng. Có đội xe thì chuyến đi bắt đầu ngay; xe đi hết thì người tiếp theo ngồi chờ ở sảnh, và trưởng văn phòng quyết định chờ bao lâu là quá thì bảo "đi xe buýt đi". <code>MongoClient</code> chính là đội xe đó: một <em>pool kết nối</em> mở suốt đời tiến trình. Tạo client cho mỗi request là gọi taxi mới cho mỗi chuyến.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">new MongoClient(uri, tuỳ chọn)</span><span class="lz-t">một lần mỗi tiến trình</span><span class="lz-d">đọc chuỗi kết nối, bắt đầu theo dõi các máy chủ (thêm một kết nối mỗi máy), sở hữu pool</span></div>
  <div class="lz-step"><span class="lz-k">collection.findOne(…)</span><span class="lz-t">mượn một kết nối</span><span class="lz-d">dùng lại kết nối rảnh, hoặc mở mới tới maxPoolSize; bận hết thì xếp hàng (waitQueueTimeoutMS)</span></div>
  <div class="lz-step"><span class="lz-k">máy chủ</span><span class="lz-t">cho vào + thực thi</span><span class="lz-d">mỗi truy vấn cần một vé đọc hoặc ghi ở máy chủ; quá nhiều cùng lúc ⇒ xếp hàng ở đó nữa</span></div>
  <div class="lz-step"><span class="lz-k">trả lời</span><span class="lz-t">kết nối về pool</span><span class="lz-d">BSON giải mã thành giá trị JavaScript — ObjectId, Decimal128, Long, Date là object, không phải chuỗi hay number</span></div>
</div>
${nguon('📘', 'Connection Pools — MongoDB Node.js Driver', 'Mỗi MongoClient có sẵn một pool kết nối cho mỗi máy chủ; maxPoolSize mặc định 100', 'https://www.mongodb.com/docs/drivers/node/current/connect/connection-options/connection-pools/')}

<h3>Chuỗi kết nối quyết định driver khám phá ra gì</h3>
<p>Lab là replica set một thành viên (Bài 0.2), thành viên tự xưng là <code>localhost:27017</code> — bên trong container của nó. Máy bạn với tới nó qua cổng công bố <code>127.0.0.1:47017</code>. Xem khác biệt đó gây ra gì:</p>
${lenh(K, 0)}
<p>Với URI trơn, driver nối tới máy mồi, hỏi "replica set này gồm những ai?", nhận về <code>localhost:27017</code>, và từ đó <em>chỉ</em> nói chuyện với các thành viên máy chủ công bố. Cổng 27017 trên máy bạn không có gì, nên sau thời gian chờ chọn máy chủ (ở đây 3 giây, mặc định 30 giây) mọi thao tác đều hỏng. <code>directConnection=true</code> nghĩa là "nói chuyện đúng địa chỉ này, đừng khám phá" — đúng cho lab, đường hầm SSH hay bài test một máy. Ở production với replica set thật thì làm ngược lại: liệt kê vài thành viên kèm <code>replicaSet=…</code> (hoặc dùng tên DNS <code>mongodb+srv://</code>) và bảo đảm các tên mà thành viên công bố phân giải được từ nơi ứng dụng chạy — Bài 7.1 đã đụng đúng bức tường này dưới dạng <code>ENOTFOUND r1</code>.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — directConnection ở production.</strong> Nó "chữa" lỗi kết nối trên laptop lập trình viên, bị chép sang cấu hình production, rồi ứng dụng dính chặt vào một máy: khi máy đó thôi làm primary (Bài 7.2), mọi lệnh ghi hỏng với "not primary" cho tới khi có người sửa cấu hình. Nếu cần thì chỉ để nó trong tệp môi trường <em>máy cá nhân</em>.</p>
</div>

<h3>Một MongoClient cho mỗi tiến trình — đo thật</h3>
<p>Lỗi kinh điển của người mới, hay được chép từ bài hướng dẫn:</p>
${ma('js', SAI)}
<p>Ba trăm request, làm theo hai cách:</p>
${lenh(K, 1)}
<p>Mỗi client mở <strong>hai</strong> kết nối (một để theo dõi, một để truy vấn) rồi vứt đi: khoảng 600 kết nối mới cho 300 request, và chậm gấp mười — ngay trên <em>localhost</em>, không TLS, không xác thực. Qua mạng thật, mỗi kết nối mới còn thêm bắt tay TCP, bắt tay TLS và trao đổi xác thực SCRAM (Chương 9): vài lượt đi về trước byte đầu tiên của truy vấn. Client dùng chung chỉ mở 2 kết nối tất cả. Mẫu chuẩn là một mô-đun tạo client một lần và được import khắp nơi:</p>
${ma('js', DB_MJS)}
<p>Luật này cũng đúng với hàm serverless (AWS Lambda, Vercel): tạo client <em>ngoài</em> hàm xử lý để các lần gọi "ấm" dùng lại.</p>

<h3>Pool: maxPoolSize, hàng đợi — và hàng đợi riêng của máy chủ</h3>
<p>Năm mươi request tới cùng lúc; mỗi request chạy một truy vấn tốn khoảng 200 ms ở máy chủ (giả lập bằng <code>$where: 'sleep(200) || true'</code> — JavaScript phía máy chủ, chỉ dùng trong lab). Ta đổi cỡ pool và đọc luôn hàng đợi vào cửa của máy chủ, <code>serverStatus().queues.execution.read</code>:</p>
${lenh(K, 2)}
<p>Đọc từng dòng:</p>
<ul>
<li><strong>maxPoolSize 5</strong>: chỉ năm truy vấn chạy cùng lúc; 50 × 200 ms ÷ 5 ≈ 2 giây. Request chậm nhất chờ gần hết thời gian đó <em>trong driver</em>, để có kết nối.</li>
<li><strong>maxPoolSize 10</strong>: nhanh gấp đôi, đúng như dự đoán.</li>
<li><strong>maxPoolSize 50</strong>: request nào cũng có kết nối ngay — vậy mà <em>không</em> nhanh hơn 10. Dòng máy chủ cho thấy vì sao: MongoDB 8.0 chỉ cho một số nhỏ thao tác vào storage engine cùng lúc (ở đây khoảng một chục <strong>vé đọc</strong>, tự điều chỉnh từ bản 7.0), và phần lớn 50 truy vấn xếp hàng <em>ở máy chủ</em> thay vì ở driver. Pool to hơn chỉ dời hàng đợi đi chỗ khác, không xoá được nó.</li>
<li><strong>waitQueueTimeoutMS 1000</strong>: một nửa số request nhận <code>MongoWaitQueueTimeoutError</code> sau một giây thay vì chờ hai giây. Đó là tính năng: request hỏng nhanh với 503 giải phóng người dùng và web server; request treo 30 giây giữ chặt cả hai.</li>
</ul>
${nguon('📘', 'WiredTiger — Transaction (Read and Write) Concurrency', 'Từ bản 7.0, MongoDB mặc định tự điều chỉnh số giao dịch storage engine chạy đồng thời tối đa (vé đọc và vé ghi)', 'https://www.mongodb.com/docs/manual/core/wiredtiger/')}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "DB chậm thì tăng maxPoolSize".</strong> Khi truy vấn chậm vì quét toàn bộ (Chương 4) hay giữ tài nguyên, thêm kết nối chỉ đổ thêm việc lên máy chủ vốn đã quá tải; chỗ chờ chỉ dời từ hàng đợi driver sang hàng đợi vé ở máy chủ, còn bộ nhớ cho mỗi kết nối (khoảng 1 MB ngăn xếp cho mỗi luồng kết nối ở máy chủ) thì tăng. Sửa truy vấn trước. Chỉ tăng pool khi hàng đợi driver dài <em>và</em> máy chủ đang rảnh.</p>
</div>

<h3>Phép nhân không ai làm: số bản ứng dụng × maxPoolSize</h3>
<p><code>maxPoolSize</code> mặc định là 100 <em>cho mỗi client, mỗi máy chủ</em>. API của bạn chạy năm container sau bộ cân bằng tải; một đợt tăng tải ập tới. Năm client, mỗi client 100 truy vấn chậm:</p>
${lenh(K, 3)}
<p>Máy chủ lab nhận tối đa <strong>409</strong> kết nối. Con số này không ngẫu nhiên: trên Linux, <code>net.maxIncomingConnections</code> mặc định là (giới hạn tệp mở ÷ 2) × 0,8, và container này có mặc định của Docker là 1.024 tệp mở (cũng là giới hạn đã làm mongod sập ở Bài 3.5): 512 × 0,8 = 409,6. Năm pool muốn 500 kết nối cộng kết nối theo dõi; vượt 409 thì máy chủ từ chối kết nối mới (các dòng log), còn driver báo hàng chục truy vấn là <code>MongoNetworkError … closed</code> — với người dùng là lỗi 500 lác đác giữa đợt tải, trong khi bản thân máy chủ vẫn khoẻ. Hãy tính ngân sách rõ ràng: <em>số bản × maxPoolSize (+ kết nối theo dõi) &lt; trần máy chủ</em>, chừa chỗ cho tự giãn, cron job và chính mongosh của bạn. Các gói Atlas công bố trần kết nối cũng vì lý do này.</p>
${nguon('📘', 'net.maxIncomingConnections — Configuration options', 'Mặc định trên Linux: (RLIMIT_NOFILE / 2) * 0.8', 'https://www.mongodb.com/docs/manual/reference/configuration-options/')}

<h3>Con trỏ: toArray kéo hết, for await đọc theo lô</h3>
<p><code>find()</code> trả về con trỏ, không phải tài liệu. Lượt trả đầu mang 101 tài liệu; mỗi <code>getMore</code> sau đó trả tới 16 MiB. Trên 200.000 dòng nhật ký khoảng 600 byte, đếm các lệnh driver thật sự gửi qua sự kiện theo dõi của nó:</p>
${lenh(K, 4)}
<ul>
<li><code>toArray()</code> giữ sống cả 200.000 object cùng lúc — hàng trăm MB heap cho một request. Mười người cùng xuất báo cáo là tiến trình chết vì "JavaScript heap out of memory".</li>
<li><code>for await</code> xử lý tài liệu khi chúng tới, bộ nhớ giảm một nửa — nhưng không về 0: mỗi lô 16 MiB (ở đây 27.566 tài liệu) được giải mã một lượt.</li>
<li><code>batchSize: 1000</code> giới hạn lô: heap xuống hàng chục MB, đổi lại 200 lượt đi về thay vì 8. Chọn cách này cho xuất dữ liệu, di trú dữ liệu và mọi thứ đổ ra tệp hay HTTP.</li>
<li><strong>Projection</strong> chỉ giữ trường nhỏ là nhanh nhất — nhưng nhìn cột cuối: tài liệu bé tí nên một lô 16 MiB chứa 199.899 cái và heap lại <em>tăng</em>. Cỡ lô tính bằng byte trên đường truyền, không phải số object trong heap.</li>
</ul>

<h3>Kiểu BSON ở ranh giới JavaScript</h3>
<p>Driver đổi BSON thành giá trị JavaScript, và bốn loại sau làm ai cũng bất ngờ ít nhất một lần:</p>
${lenh(K, 5)}
<ol>
<li><strong>ObjectId không phải chuỗi.</strong> Express đưa bạn <code>req.params.id</code> dạng chuỗi; <code>findOne({ _id: '6b04…' })</code> so chuỗi với ObjectId nên không khớp gì — không lỗi, chỉ <code>null</code> và một lỗi "không tìm thấy". Đổi bằng <code>new ObjectId(s)</code>, và kiểm trước: hàm tạo <em>ném lỗi</em> khi đầu vào sai, không bắt thì thành 500. Lưu ý ở BSON 7 <code>ObjectId.isValid</code> chỉ nhận chuỗi 24 ký tự hex (bản cũ nhận cả chuỗi 12 ký tự bất kỳ).</li>
<li><strong>Decimal128 là object.</strong> <code>gia + 1</code> lặng lẽ thành <em>chuỗi</em> "199000.501", còn <code>JSON.stringify</code> in ra <code>{"$numberDecimal": …}</code>. Tính tiền ở máy chủ (<code>$multiply</code> giữ "597001.50") hoặc bằng số nguyên đơn vị nhỏ nhất, và gửi tiền cho client dạng chuỗi (Bài 1.2, và lab của chương này).</li>
<li><strong>Int64.</strong> Driver trả number bình thường khi giá trị biểu diễn chính xác được, và trả <code>Long</code> khi vượt 2<sup>53</sup> — nên cùng một trường có thể mang hai kiểu trong mã của bạn, và <code>JSON.stringify</code> một Long in ra ruột <code>{high, low}</code>. Đổi rõ ràng ở rìa API.</li>
<li><strong>Date</strong> lưu theo UTC; <code>toString()</code> in theo múi giờ của máy chạy Node. Máy chủ trong container UTC hiện chữ khác laptop của bạn — định dạng với múi giờ ghi rõ (Bài 5.3).</li>
</ol>

<h3>Một API tối thiểu cư xử đúng</h3>
<p>Gộp lại — một client từ <code>db.mjs</code>, id được kiểm, đổi kiểu rõ ràng ở rìa, và tắt êm để lần triển khai mới không cắt đôi truy vấn đang chạy:</p>
${ma('js', API)}
${lenh(K, 6)}
<p>Id sai là 400, không có tài liệu là 404, tiền và bộ đếm lớn đi ra dạng chuỗi, còn khi nhận <code>SIGTERM</code> máy chủ ngừng nhận request, làm xong việc đang dở, đóng pool và thoát mã 0. Khoá Node.js dạy cùng ý tưởng cho PostgreSQL và cho Docker:</p>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-7-1-ket-noi-va-pool', title: 'Node.js 7.1 — Một kết nối thật sự tốn bao nhiêu', sub: 'Cùng cách nghĩ về pool cho PostgreSQL và Prisma' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-17-3-pid-1-tat-em', title: 'Node.js 17.3 — PID 1 và tắt êm', sub: 'Vì sao SIGTERM phải tới được Node trong Docker, và cách rút cạn request' })}
${lienKet({ academy: true, khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'SDN302 3.1 — CRUD MongoDB với Node.js', sub: 'Phần nhập môn driver ở mức môn học' })}

<h3>💼 Đi làm: "API chết mỗi tối lúc 8 giờ"</h3>
<p>Một dự án outsourcing: API Node chạy bốn pod, một replica set MongoDB, bảng giám sát hiện các đợt "connection refused" vào giờ cao điểm. Những gì hay tìm thấy, theo thứ tự thường gặp: <code>new MongoClient</code> nằm trong hàm xử lý request hoặc trong một hàm phụ được gọi mỗi request; pool mặc định 100 trên mọi pod cộng một job báo cáo có client riêng — 4 × 100 + 100 so với trần máy chủ bị hạ thấp bởi giới hạn tệp mở của container; và một truy vấn chậm không có index giữ kết nối khiến pool không bao giờ rút cạn được. Câu trả lời trên ticket nên có phép tính (số pod × pool so với <code>serverStatus().connections</code>), cách sửa (client dùng chung, <code>maxPoolSize</code> và <code>waitQueueTimeoutMS</code> ghi rõ, thêm index), và một bài đo tải tái hiện đợt tăng trước và sau khi sửa. Đặt <code>appName</code> để DBA nhìn <code>currentOp</code> biết dịch vụ nào giữ kết nối nào.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Trong ứng dụng Express bạn tạo MongoClient ở đâu?"</strong> — Một lần, lúc khởi động, trong một mô-đun dùng chung cho mọi route; kết nối trước khi listen; đóng khi SIGTERM sau khi HTTP server dừng.</li>
<li><strong>"maxPoolSize làm gì, chạm trần thì sao?"</strong> — Giới hạn số kết nối đồng thời tới mỗi máy chủ; thao tác dư chờ trong hàng đợi của driver, và hỏng sau waitQueueTimeoutMS nếu có đặt.</li>
<li><strong>"Gấp đôi pool có gấp đôi thông lượng không?"</strong> — Chỉ khi máy chủ còn dư sức; MongoDB giới hạn số thao tác storage engine đồng thời bằng vé, truy vấn chậm xếp hàng ở đó bất kể pool to cỡ nào.</li>
<li><strong>"Vì sao findOne({ _id: req.params.id }) trả null?"</strong> — Id là chuỗi, trường là ObjectId; kiểm hợp lệ rồi đổi kiểu.</li>
<li><strong>"Xuất một triệu tài liệu ra CSV mà không hết bộ nhớ thế nào?"</strong> — Duyệt con trỏ bằng for await (hoặc stream) với batchSize có giới hạn và projection; không bao giờ toArray.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>node s08-moi-lan.mjs</code> với <code>N = 1000</code>. Rồi mở <code>mongosh</code> đọc <code>db.serverStatus().connections.totalCreated</code> trước và sau. Mỗi client mấy kết nối, vì sao là hai?</li>
<li>Trong <code>s08-pool.mjs</code>, thay sleep của <code>$where</code> bằng một truy vấn chậm thật: <code>db.collection('orders').aggregate([{ $group: { _id: '$customerId', n: { $sum: 1 } } }])</code> trên CT Shop. Cỡ pool có còn hết tác dụng ở khoảng giá trị cũ không? Vì sao truy vấn ngốn CPU có thể cho kết quả khác?</li>
<li>Công ty bạn chạy 6 pod API với pool mặc định, cộng 2 worker có <code>maxPoolSize: 50</code>, vào một máy chủ trần 819 kết nối. Có an toàn không? Chọn cỡ pool và giải thích.</li>
<li>Viết endpoint <code>GET /xuat-nhat-ky</code> đổ <code>ch8.nhatKy</code> ra CSV với bộ nhớ có giới hạn. Đo heap bằng <code>process.memoryUsage()</code> khi hai client tải cùng lúc.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Hai mỗi client: kết nối theo dõi (driver giữ một kết nối cho mỗi máy chủ để theo dõi cụm) và kết nối ứng dụng dùng cho truy vấn. 1000 request ⇒ khoảng 2000 kết nối mới; client dùng chung mở 2.</p>
<p>2. Với aggregation, giới hạn xuất hiện ở điểm tương tự nếu công việc nghẽn ở I/O hoặc ở vé; với việc ngốn CPU, giới hạn xuất hiện khi các nhân máy chủ bận hết — trên máy 12 nhân, quá chục aggregation song song chỉ thêm xếp hàng. Hãy đo: vẽ tổng thời gian theo cỡ pool và tìm điểm gãy.</p>
<p>3. 6 × 100 + 2 × 50 = 700 kết nối ứng dụng cộng kết nối theo dõi (8 client × số thành viên) — lúc thường dưới 819, nhưng không còn chỗ khi tự giãn lên 8 pod (900). Đặt pod API 30–50 (một tiến trình Node hiếm khi cần nhiều truy vấn đồng thời hơn), worker 10, đặt waitQueueTimeoutMS, và cảnh báo khi chạm 70% trần.</p>
<p>4. <code>res.type('text/csv'); for await (const d of nk.find({}, { batchSize: 1000, projection: { muc: 1, noiDung: 1 } })) { if (!res.write(\`\${d._id},\${d.muc}\\n\`)) await once(res, 'drain'); } res.end();</code> — tôn trọng <code>drain</code> (áp lực ngược) giữ bộ nhớ phẳng kể cả khi client tải chậm.</p>
</details>
<p><strong>Xong khi:</strong> ứng dụng của bạn tạo đúng một client, bạn nói được số kết nối tối đa của nó, và không endpoint nào nạp kết quả không giới hạn vào bộ nhớ.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['MongoClient', 'Object của driver sở hữu việc theo dõi máy chủ và pool kết nối; tạo một lần mỗi tiến trình.'],
  ['Chuỗi kết nối', 'URI mongodb:// hoặc mongodb+srv:// gồm máy chủ, database và tuỳ chọn như replicaSet, directConnection, maxPoolSize.'],
  ['directConnection', 'Nối đúng máy đã cho, không khám phá replica set; dành cho lab và đường hầm, không cho production.'],
  ['Pool kết nối', 'Các kết nối mở sẵn dùng lại cho mỗi máy chủ; maxPoolSize giới hạn số kết nối, waitQueueTimeoutMS giới hạn thời gian chờ.'],
  ['Vé đọc/ghi', 'Giới hạn phía máy chủ cho số thao tác storage engine đồng thời, tự điều chỉnh từ MongoDB 7.0.'],
  ['maxIncomingConnections', 'Trần kết nối của máy chủ; trên Linux mặc định (giới hạn tệp mở ÷ 2) × 0,8.'],
  ['Con trỏ / lô', 'find trả con trỏ; lô đầu 101 tài liệu, các lô getMore tới 16 MiB trừ khi đặt batchSize.'],
  ['Decimal128 / Long', 'Kiểu số thập phân và số nguyên 64 bit của BSON; là object trong JavaScript, đổi rõ ràng ở rìa API.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Chuỗi kết nối quyết định việc khám phá: thành viên replica set phải với tới được bằng tên chúng công bố; directConnection chỉ cho lab.</li>
<li>Một MongoClient mỗi tiến trình: client theo request mở ~600 kết nối cho 300 request và chậm ~10 lần.</li>
<li>Pool to hơn chỉ có ích khi máy chủ còn sức; quá đó, truy vấn xếp hàng chờ vé ở máy chủ.</li>
<li>Số bản × maxPoolSize phải dưới trần máy chủ — 409 trong container có 1.024 tệp mở.</li>
<li>Đổ kết quả lớn bằng for await, batchSize có giới hạn và projection; không bao giờ toArray khi xuất dữ liệu.</li>
<li>Đổi ObjectId, Decimal128, Long và Date rõ ràng ở ranh giới; kiểm id; tắt êm.</li>
</ul>
</div>
`,
};
