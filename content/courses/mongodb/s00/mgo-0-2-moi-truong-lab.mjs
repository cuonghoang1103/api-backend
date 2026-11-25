/**
 * 0.2 — Môi trường lab: MongoDB 8.0 trong Docker, mongosh và bộ dữ liệu CT Shop (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s00-lab'] — xoá sạch (down -v) rồi dựng lại từ đầu để output là lần chạy đầu tiên thật.
 * Tệp lab phát cho người học: ../_demo/compose.yaml, ../_demo/ctshop-seed.js (tất định, LCG hạt giống 20261124).
 */
import { lenh, ma, lienKet, kv, loiGiai } from '../_chung.mjs';

export default {
  title: '0.2 — Your lab: MongoDB 8.0 in Docker, mongosh and the CT Shop dataset|||0.2 — Môi trường lab: MongoDB 8.0 trong Docker, mongosh và bộ dữ liệu CT Shop',
  slug: 'mgo-0-2-moi-truong-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng lab dùng cho cả khoá trong năm phút: một tệp compose.yaml chạy MongoDB 8.0 dạng replica set một thành viên (để transaction và change stream chạy được ngay), cổng chỉ mở trên 127.0.0.1, nạp bộ dữ liệu CT Shop tất định; dùng mongosh và Compass; vì sao chuỗi kết nối cần directConnection (lỗi thật); dọn dẹp; xử lý sự cố thường gặp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Your lab: MongoDB 8.0 in Docker, mongosh and the CT Shop dataset</h2>
<p class="lead">Every lesson in this course runs on the same lab: one MongoDB 8.0 server in Docker and a shop dataset that is identical on every machine, so your numbers match the lesson's numbers exactly. Setting it up takes five minutes. Understanding each line of it takes a little longer — and that understanding is what stops you from repeating the 2017 disaster from the previous lesson.</p>

<h3>What you need</h3>
<ul>
<li><strong>Docker</strong> with Compose (Docker Desktop on Windows/macOS, Docker Engine on Linux). Check: <code>docker compose version</code>.</li>
<li>About <strong>1 GB of free RAM</strong> and 2 GB of disk. Nothing else: <code>mongosh</code>, <code>mongodump</code> and friends are inside the image.</li>
<li>Optional: <strong>MongoDB Compass</strong>, the free graphical client, to browse documents with the mouse.</li>
</ul>

<h3>Step 1 — the compose file, line by line</h3>
<p>Create an empty folder <code>mongodb-lab</code> and save this as <code>compose.yaml</code> (comments removed here; the downloadable version is commented):</p>
${lenh('s00-lab', 0)}
<ul>
<li><code>image: mongo:8.0</code> — the official image, pinned to the 8.0 series so the course output stays valid. Never use <code>latest</code> for a database: an upgrade should be your decision.</li>
<li><code>container_name: mgo-lab</code> — a fixed name so every command in the course can say <code>docker exec mgo-lab …</code>.</li>
<li><code>--replSet rs0</code> — start as a <strong>replica set</strong> named <code>rs0</code>, with just one member. Why, for a single machine? Because transactions (Chapter 6) and change streams (Chapter 10) only work on a replica set. Starting this way from day one means the lab never has to be rebuilt.</li>
<li><code>--bind_ip_all</code> — listen on every interface <em>inside the container</em>. That is safe only because of the next line.</li>
<li><code>"127.0.0.1:47017:27017"</code> — publish container port 27017 on the host's <strong>loopback address only</strong>, port 47017. Nothing outside your machine can reach it. We avoid 27017 on the host so the lab never collides with another MongoDB you may already have.</li>
<li><code>mgo-data:/data/db</code> — a named volume: data survives <code>docker compose down</code> and restarts.</li>
<li><code>./:/demo:ro</code> — the lab folder appears read-only at <code>/demo</code> inside the container, so scripts like the dataset seeder can run there.</li>
<li><code>healthcheck</code> — every 5 seconds: if the replica set does not exist yet, create it (<code>rs.initiate</code>) with one member <code>localhost:27017</code>; otherwise just confirm it is OK. "Healthy" therefore means "ready to accept writes".</li>
</ul>

<h3>Step 2 — start it and check it</h3>
<p>The <code>-p mgo</code> flag sets the Compose project name, so the network and volume are called <code>mgo_…</code>:</p>
${lenh('s00-lab', 1)}
<p>Wait until the healthcheck reports healthy (the loop below polls every 2 seconds), then list the service:</p>
${lenh('s00-lab', 2)}
<p>Note the <code>PORTS</code> column: <code>127.0.0.1:47017-&gt;27017</code>. Confirm from the host side that nothing listens on a public address:</p>
${lenh('s00-lab', 10)}
<p>Versions of the server and the shell:</p>
${lenh('s00-lab', 3)}
${lenh('s00-lab', 4)}
<p>And ask the server about itself with <code>db.hello()</code> — the command every driver sends first:</p>
${lenh('s00-lab', 5)}
<p><code>setName: 'rs0'</code> and <code>isWritablePrimary: true</code> — our one-member replica set is up and this member is the primary. <code>maxBsonObjectSize: 16777216</code> is the 16 MB document limit you will meet in Chapter 1.</p>

<h3>Step 3 — load the CT Shop dataset</h3>
<p>Save <code>ctshop-seed.js</code> (download it from the lesson resources) into the same folder and run it with <code>mongosh</code> inside the container. It drops and recreates the <code>ctshop</code> database using a fixed-seed random generator — run it any time to reset the data to exactly the state the lessons assume.</p>
${lenh('s00-lab', 6)}
${lenh('s00-lab', 7)}
${lenh('s00-lab', 8)}
${lenh('s00-lab', 9)}
<p>If your number of paid orders is not <strong>903</strong>, your data differs from the lesson's — rerun the seeder.</p>
<table>
<thead><tr><th>Collection</th><th>Documents</th><th>Shape worth noticing</th></tr></thead>
<tbody>
<tr><td><code>customers</code></td><td>200</td><td><code>_id</code> is a readable code (<code>KH0001</code>); about 30% have a <code>phone</code>, the rest do not have the field at all</td></tr>
<tr><td><code>products</code></td><td>60</td><td>Five categories, each with its own fields (<code>specs</code>, <code>author</code>, <code>variants</code>…); <code>price</code> is <code>Decimal128</code></td></tr>
<tr><td><code>orders</code></td><td>2,000</td><td>Line items <strong>embedded</strong> with the name and price at purchase time; <code>customerId</code> references a customer</td></tr>
</tbody></table>

<h3>Step 4 — working in mongosh</h3>
<p>Open an interactive shell: <code>docker exec -it mgo-lab mongosh</code>. The prompt shows the current database. The commands you will use every day:</p>
${ma('js', `
rs0 [direct: primary] test> show dbs            // list databases
rs0 [direct: primary] test> use ctshop          // switch (created on first write)
rs0 [direct: primary] ctshop> show collections
rs0 [direct: primary] ctshop> db.orders.findOne()
rs0 [direct: primary] ctshop> db.orders.find()  // prints 20, then type: it
rs0 [direct: primary] ctshop> db.orders.help()  // every method of a collection
rs0 [direct: primary] ctshop> .exit
`)}
<p>In scripts (and in this course's outputs) the same things are written as plain JavaScript, for example <code>db.getMongo().getDBNames()</code> instead of <code>show dbs</code>:</p>
${lenh('s00-lab', 11)}
<div class="callout info"><p><strong>Tip:</strong> mongosh is a real JavaScript runtime. You can write <code>const ids = db.orders.find({ status: 'PENDING' }).map(o =&gt; o._id)</code> and use <code>ids</code> in the next command. Press <kbd>Tab</kbd> to autocomplete method names.</p></div>

<h3>Where your command travels</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Compass / Node.js / Spring on the host</span><span class="lz-lnote">connects to 127.0.0.1:47017 — the only door into the lab</span></div>
  <div class="lz-layer"><span class="lz-lname">Docker port mapping</span><span class="lz-lnote">127.0.0.1:47017 on the host → 27017 inside the container; nothing listens on public addresses</span></div>
  <div class="lz-layer"><span class="lz-lname">mongod in container mgo-lab</span><span class="lz-lnote">listens on 27017 on every container interface (--bind_ip_all); member name localhost:27017</span></div>
  <div class="lz-layer"><span class="lz-lname">WiredTiger files in volume mgo_mgo-data</span><span class="lz-lnote">/data/db — survives down, deleted by down -v</span></div>
  <div class="lz-layer"><span class="lz-lname">mongosh via docker exec</span><span class="lz-lnote">runs inside the container, talks to localhost:27017 directly — no port mapping involved</span></div>
</div>
<h3>Step 5 — connecting from your own machine (and a real error)</h3>
<p>Compass and your applications run on the host and connect to <code>127.0.0.1:47017</code>. Here is the trap. If the connection string says "this is replica set rs0", the driver asks the server for the member list, gets back <code>localhost:27017</code> (the name the member has <em>inside</em> the container), and tries to connect to that from the host:</p>
${lenh('s00-lab', 12)}
<p>Port 27017 on your host is not the container. The fix for a one-member lab is <code>directConnection=true</code>: talk to exactly this address and skip discovery.</p>
${lenh('s00-lab', 13)}
<p>So the connection string for Compass, Node.js and Spring in this course is:</p>
${ma('text', 'mongodb://127.0.0.1:47017/ctshop?directConnection=true')}
<p>In Chapter 7, with a real three-member cluster, you will do it properly: give members names that resolve from everywhere, and drop <code>directConnection</code> so the driver can follow failovers.</p>

<h3>Stopping, resetting, cleaning up</h3>
<table>
<thead><tr><th>You want to…</th><th>Command</th></tr></thead>
<tbody>
<tr><td>Stop for today, keep data</td><td><code>docker compose -p mgo stop</code> (start again with <code>start</code>)</td></tr>
<tr><td>Remove the container, keep data</td><td><code>docker compose -p mgo down</code></td></tr>
<tr><td>Reset the dataset only</td><td><code>docker exec mgo-lab mongosh --quiet /demo/ctshop-seed.js</code></td></tr>
<tr><td>Remove everything, including data</td><td><code>docker compose -p mgo down -v</code></td></tr>
</tbody></table>

<h3>When it does not work</h3>
<div class="pitfall co-tieu-de">
<p><strong>"Bind for 127.0.0.1:47017 failed: port is already allocated".</strong> Something else uses 47017. Find it with <code>ss -ltnp | grep 47017</code> (Linux/macOS) or <code>netstat -ano | findstr 47017</code> (Windows), or change the left number in <code>ports</code>, e.g. <code>127.0.0.1:47117:27017</code>, and use that port in your connection strings.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>The container stays "starting" or "unhealthy".</strong> Read the log: <code>docker logs mgo-lab --tail 30</code>. The most common cause is a volume left from an old experiment with a different replica set name: reset with <code>down -v</code>.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"MongoServerError: not primary" right after starting.</strong> The replica set is not initiated yet — wait for "healthy". Writes are only accepted by a primary.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>ECONNREFUSED 127.0.0.1:27017 from your app.</strong> Either the port is 47017, not 27017, or the connection string lacks <code>directConnection=true</code> (Step 5).</p>
</div>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Why run a replica set even in development?"</strong> — Transactions and change streams need one; developing on a standalone hides bugs that appear in production.</li>
<li><strong>"What does <code>directConnection=true</code> do?"</strong> — Connect to exactly the given host and skip replica set discovery; useful for one-member labs and maintenance, wrong for production clusters because the driver cannot follow a failover.</li>
<li><strong>"How do you make a local database container safe?"</strong> — Publish on 127.0.0.1 only, pin the image version, use a named volume, and turn on authentication as soon as anything else can reach it.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Build the lab from scratch, load the dataset, and confirm <code>db.orders.countDocuments({ status: 'PAID' })</code> returns 903.</li>
<li>Run <code>docker compose -p mgo down</code> (without <code>-v</code>), then <code>up -d</code> again. Is the data still there? Then try <code>down -v</code> + <code>up -d</code>. Explain the difference.</li>
<li>Connect with Compass (or any client) using the connection string from Step 5 and find order 7.</li>
<li>Change the port mapping to <code>"47017:27017"</code> (no address), restart, and run <code>ss -ltn | grep 47017</code>. What changed and why is it dangerous on a server? Put it back.</li>
</ol>
${loiGiai('Solution', '<p>(2) After <code>down</code> the named volume <code>mgo_mgo-data</code> remains, so the data is back after <code>up</code>; <code>down -v</code> deletes the volume, so the database starts empty (re-run the seeder). (4) <code>ss</code> now shows <code>0.0.0.0:47017</code> (and <code>[::]:47017</code>): every network interface, so anyone who can reach your machine can reach an unauthenticated MongoDB — exactly the 2017 pattern.</p>')}
<p><strong>Done when:</strong> you see 903, can explain <code>down</code> vs <code>down -v</code>, and have reverted the port to 127.0.0.1.</p></div>
${lienKet({ cta: 'Open lesson', khoa: 'docker', bai: 'dk-0-5-bat-dau-tai-day', title: 'Docker — Start here', sub: 'Volumes, port publishing and Compose explained from zero' })}

<h3>🗂 Key terms</h3>
${kv([
  ['mongod', 'The MongoDB server process.'],
  ['mongosh', 'The MongoDB shell, a JavaScript console.'],
  ['Replica set (one member)', 'A replica set with a single server — no redundancy, but enables transactions and change streams.'],
  ['rs.initiate()', 'Creates the replica set configuration; run once.'],
  ['Primary', 'The member that accepts writes.'],
  ['Named volume', 'Docker-managed storage that survives container removal.'],
  ['directConnection', 'Connection string option: use exactly this host, skip discovery.'],
  ['Healthcheck', 'A command Docker runs periodically to decide if the container is ready.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>One <code>compose.yaml</code>: MongoDB 8.0, a one-member replica set, port 47017 on 127.0.0.1 only, a named volume.</li>
<li><code>ctshop-seed.js</code> recreates the same 200/60/2,000 dataset on every machine; 903 paid orders is your checksum.</li>
<li>Use <code>docker exec -it mgo-lab mongosh</code> inside, <code>mongodb://127.0.0.1:47017/ctshop?directConnection=true</code> from the host.</li>
<li><code>down</code> keeps data, <code>down -v</code> deletes it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Môi trường lab: MongoDB 8.0 trong Docker, mongosh và bộ dữ liệu CT Shop</h2>
<p class="lead">Mọi bài trong khoá chạy trên cùng một lab: một máy chủ MongoDB 8.0 trong Docker và một bộ dữ liệu cửa hàng giống hệt nhau trên mọi máy, để con số của bạn khớp đúng con số trong bài. Dựng nó mất năm phút. Hiểu từng dòng của nó mất lâu hơn một chút — và chính sự hiểu đó ngăn bạn lặp lại thảm hoạ 2017 ở bài trước.</p>

<h3>Bạn cần gì</h3>
<ul>
<li><strong>Docker</strong> có Compose (Docker Desktop trên Windows/macOS, Docker Engine trên Linux). Kiểm: <code>docker compose version</code>.</li>
<li>Khoảng <strong>1 GB RAM trống</strong> và 2 GB ổ đĩa. Không cần gì khác: <code>mongosh</code>, <code>mongodump</code> và các công cụ khác đã có sẵn trong ảnh.</li>
<li>Tuỳ chọn: <strong>MongoDB Compass</strong>, ứng dụng giao diện đồ hoạ miễn phí, để duyệt tài liệu bằng chuột.</li>
</ul>

<h3>Bước 1 — tệp compose, từng dòng một</h3>
<p>Tạo một thư mục trống <code>mongodb-lab</code> và lưu nội dung này thành <code>compose.yaml</code> (ở đây đã bỏ dòng chú thích; bản tải về có chú thích đầy đủ):</p>
${lenh('s00-lab', 0)}
<ul>
<li><code>image: mongo:8.0</code> — ảnh chính thức, ghim vào dòng 8.0 để output của khoá luôn đúng. Đừng bao giờ dùng <code>latest</code> cho cơ sở dữ liệu: nâng cấp phải là quyết định của bạn.</li>
<li><code>container_name: mgo-lab</code> — tên cố định để mọi lệnh trong khoá viết được <code>docker exec mgo-lab …</code>.</li>
<li><code>--replSet rs0</code> — khởi động dạng <strong>replica set</strong> tên <code>rs0</code>, chỉ một thành viên. Một máy thôi thì cần gì? Vì transaction (Chương 6) và change stream (Chương 10) chỉ chạy trên replica set. Khởi động như vậy từ ngày đầu thì lab không bao giờ phải dựng lại.</li>
<li><code>--bind_ip_all</code> — nghe trên mọi giao diện <em>bên trong container</em>. Chỉ an toàn nhờ dòng tiếp theo.</li>
<li><code>"127.0.0.1:47017:27017"</code> — mở cổng 27017 của container ra máy thật nhưng <strong>chỉ trên địa chỉ loopback</strong>, cổng 47017. Không gì ngoài máy bạn chạm tới được. Ta tránh cổng 27017 trên máy thật để lab không đụng một MongoDB khác bạn có thể đã cài.</li>
<li><code>mgo-data:/data/db</code> — một volume có tên: dữ liệu sống qua <code>docker compose down</code> và các lần khởi động lại.</li>
<li><code>./:/demo:ro</code> — thư mục lab hiện ra ở <code>/demo</code> bên trong container, chỉ đọc, để chạy các kịch bản như bộ nạp dữ liệu.</li>
<li><code>healthcheck</code> — cứ 5 giây: nếu replica set chưa có thì tạo nó (<code>rs.initiate</code>) với một thành viên <code>localhost:27017</code>; có rồi thì chỉ xác nhận nó ổn. Vì vậy "healthy" nghĩa là "sẵn sàng nhận ghi".</li>
</ul>

<h3>Bước 2 — khởi động và kiểm tra</h3>
<p>Cờ <code>-p mgo</code> đặt tên dự án Compose, nên mạng và volume sẽ tên là <code>mgo_…</code>:</p>
${lenh('s00-lab', 1)}
<p>Chờ tới khi healthcheck báo healthy (vòng lặp dưới đây hỏi mỗi 2 giây), rồi liệt kê dịch vụ:</p>
${lenh('s00-lab', 2)}
<p>Để ý cột <code>PORTS</code>: <code>127.0.0.1:47017-&gt;27017</code>. Xác nhận từ phía máy thật rằng không có gì nghe trên địa chỉ công khai:</p>
${lenh('s00-lab', 10)}
<p>Phiên bản máy chủ và vỏ lệnh:</p>
${lenh('s00-lab', 3)}
${lenh('s00-lab', 4)}
<p>Và hỏi máy chủ về chính nó bằng <code>db.hello()</code> — lệnh mà mọi driver gửi đầu tiên:</p>
${lenh('s00-lab', 5)}
<p><code>setName: 'rs0'</code> và <code>isWritablePrimary: true</code> — replica set một thành viên đã chạy và thành viên này là primary. <code>maxBsonObjectSize: 16777216</code> chính là giới hạn 16 MB mỗi tài liệu bạn sẽ gặp ở Chương 1.</p>

<h3>Bước 3 — nạp bộ dữ liệu CT Shop</h3>
<p>Lưu <code>ctshop-seed.js</code> (tải ở phần tài nguyên của bài) vào cùng thư mục rồi chạy bằng <code>mongosh</code> bên trong container. Nó xoá rồi tạo lại database <code>ctshop</code> bằng bộ sinh số ngẫu nhiên có hạt giống cố định — chạy lại bất cứ lúc nào để đưa dữ liệu về đúng trạng thái mà các bài giả định.</p>
${lenh('s00-lab', 6)}
${lenh('s00-lab', 7)}
${lenh('s00-lab', 8)}
${lenh('s00-lab', 9)}
<p>Nếu số đơn đã trả tiền của bạn không phải <strong>903</strong>, dữ liệu của bạn khác với bài — chạy lại bộ nạp.</p>
<table>
<thead><tr><th>Collection</th><th>Số tài liệu</th><th>Hình dạng đáng để ý</th></tr></thead>
<tbody>
<tr><td><code>customers</code></td><td>200</td><td><code>_id</code> là mã đọc được (<code>KH0001</code>); khoảng 30% có <code>phone</code>, số còn lại hoàn toàn không có trường đó</td></tr>
<tr><td><code>products</code></td><td>60</td><td>Năm danh mục, mỗi danh mục có trường riêng (<code>specs</code>, <code>author</code>, <code>variants</code>…); <code>price</code> là <code>Decimal128</code></td></tr>
<tr><td><code>orders</code></td><td>2.000</td><td>Các món hàng được <strong>nhúng</strong> kèm tên và giá lúc mua; <code>customerId</code> tham chiếu tới một khách</td></tr>
</tbody></table>

<h3>Bước 4 — làm việc trong mongosh</h3>
<p>Mở vỏ lệnh tương tác: <code>docker exec -it mgo-lab mongosh</code>. Dấu nhắc cho biết database hiện tại. Các lệnh bạn dùng hằng ngày:</p>
${ma('js', `
rs0 [direct: primary] test> show dbs            // liệt kê database
rs0 [direct: primary] test> use ctshop          // chuyển (tạo khi ghi lần đầu)
rs0 [direct: primary] ctshop> show collections
rs0 [direct: primary] ctshop> db.orders.findOne()
rs0 [direct: primary] ctshop> db.orders.find()  // in 20 cái, rồi gõ: it
rs0 [direct: primary] ctshop> db.orders.help()  // mọi phương thức của collection
rs0 [direct: primary] ctshop> .exit
`)}
<p>Trong kịch bản (và trong output của khoá này) những việc đó được viết bằng JavaScript thuần, ví dụ <code>db.getMongo().getDBNames()</code> thay cho <code>show dbs</code>:</p>
${lenh('s00-lab', 11)}
<div class="callout info"><p><strong>Mẹo:</strong> mongosh là một môi trường chạy JavaScript thật. Bạn viết được <code>const ids = db.orders.find({ status: 'PENDING' }).map(o =&gt; o._id)</code> rồi dùng <code>ids</code> ở lệnh sau. Bấm <kbd>Tab</kbd> để tự hoàn thành tên phương thức.</p></div>

<h3>Câu lệnh của bạn đi qua đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Compass / Node.js / Spring trên máy thật</span><span class="lz-lnote">nối tới 127.0.0.1:47017 — cửa duy nhất vào lab</span></div>
  <div class="lz-layer"><span class="lz-lname">Ánh xạ cổng của Docker</span><span class="lz-lnote">127.0.0.1:47017 trên máy thật → 27017 trong container; không gì nghe trên địa chỉ công khai</span></div>
  <div class="lz-layer"><span class="lz-lname">mongod trong container mgo-lab</span><span class="lz-lnote">nghe cổng 27017 trên mọi giao diện của container (--bind_ip_all); tên thành viên localhost:27017</span></div>
  <div class="lz-layer"><span class="lz-lname">Tệp WiredTiger trong volume mgo_mgo-data</span><span class="lz-lnote">/data/db — sống qua down, bị xoá bởi down -v</span></div>
  <div class="lz-layer"><span class="lz-lname">mongosh qua docker exec</span><span class="lz-lnote">chạy bên trong container, nói thẳng với localhost:27017 — không đi qua ánh xạ cổng</span></div>
</div>
<h3>Bước 5 — kết nối từ máy của bạn (và một lỗi thật)</h3>
<p>Compass và ứng dụng của bạn chạy trên máy thật và nối tới <code>127.0.0.1:47017</code>. Đây là cái bẫy. Nếu chuỗi kết nối nói "đây là replica set rs0", driver sẽ hỏi máy chủ danh sách thành viên, nhận về <code>localhost:27017</code> (tên của thành viên <em>bên trong</em> container), rồi thử nối tới địa chỉ đó từ máy thật:</p>
${lenh('s00-lab', 12)}
<p>Cổng 27017 trên máy thật không phải container. Cách sửa cho lab một thành viên là <code>directConnection=true</code>: nói chuyện đúng với địa chỉ này và bỏ qua bước dò thành viên.</p>
${lenh('s00-lab', 13)}
<p>Vậy chuỗi kết nối cho Compass, Node.js và Spring trong khoá này là:</p>
${ma('text', 'mongodb://127.0.0.1:47017/ctshop?directConnection=true')}
<p>Ở Chương 7, với cụm ba thành viên thật, bạn sẽ làm đúng bài bản: đặt tên thành viên phân giải được từ mọi nơi, và bỏ <code>directConnection</code> để driver tự đi theo khi chuyển dự phòng.</p>

<h3>Dừng, đặt lại, dọn dẹp</h3>
<table>
<thead><tr><th>Bạn muốn…</th><th>Lệnh</th></tr></thead>
<tbody>
<tr><td>Nghỉ hôm nay, giữ dữ liệu</td><td><code>docker compose -p mgo stop</code> (chạy lại bằng <code>start</code>)</td></tr>
<tr><td>Xoá container, giữ dữ liệu</td><td><code>docker compose -p mgo down</code></td></tr>
<tr><td>Chỉ đặt lại bộ dữ liệu</td><td><code>docker exec mgo-lab mongosh --quiet /demo/ctshop-seed.js</code></td></tr>
<tr><td>Xoá sạch, kể cả dữ liệu</td><td><code>docker compose -p mgo down -v</code></td></tr>
</tbody></table>

<h3>Khi không chạy được</h3>
<div class="pitfall co-tieu-de">
<p><strong>"Bind for 127.0.0.1:47017 failed: port is already allocated".</strong> Có thứ khác đang dùng 47017. Tìm bằng <code>ss -ltnp | grep 47017</code> (Linux/macOS) hoặc <code>netstat -ano | findstr 47017</code> (Windows), hoặc đổi số bên trái trong <code>ports</code>, ví dụ <code>127.0.0.1:47117:27017</code>, rồi dùng cổng đó trong chuỗi kết nối.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Container đứng mãi ở "starting" hoặc "unhealthy".</strong> Đọc log: <code>docker logs mgo-lab --tail 30</code>. Nguyên nhân hay gặp nhất là volume sót lại từ một lần thử cũ với tên replica set khác: đặt lại bằng <code>down -v</code>.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"MongoServerError: not primary" ngay sau khi khởi động.</strong> Replica set chưa được khởi tạo xong — chờ "healthy". Chỉ primary mới nhận ghi.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Ứng dụng báo ECONNREFUSED 127.0.0.1:27017.</strong> Hoặc cổng là 47017 chứ không phải 27017, hoặc chuỗi kết nối thiếu <code>directConnection=true</code> (Bước 5).</p>
</div>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"Sao chạy replica set cả khi phát triển?"</strong> — Transaction và change stream cần nó; phát triển trên máy đơn lẻ sẽ giấu những lỗi chỉ hiện ra trên production.</li>
<li><strong>"<code>directConnection=true</code> làm gì?"</strong> — Nối đúng vào máy được chỉ định và bỏ qua dò thành viên replica set; hợp cho lab một thành viên và khi bảo trì, sai cho cụm production vì driver không đi theo được khi chuyển dự phòng.</li>
<li><strong>"Làm sao cho một container cơ sở dữ liệu trên máy mình an toàn?"</strong> — Chỉ mở cổng trên 127.0.0.1, ghim phiên bản ảnh, dùng volume có tên, và bật xác thực ngay khi có thứ khác chạm tới được.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng lab từ đầu, nạp dữ liệu, xác nhận <code>db.orders.countDocuments({ status: 'PAID' })</code> trả về 903.</li>
<li>Chạy <code>docker compose -p mgo down</code> (không <code>-v</code>), rồi <code>up -d</code> lại. Dữ liệu còn không? Rồi thử <code>down -v</code> + <code>up -d</code>. Giải thích khác biệt.</li>
<li>Kết nối bằng Compass (hoặc client bất kỳ) với chuỗi kết nối ở Bước 5 và tìm đơn số 7.</li>
<li>Đổi ánh xạ cổng thành <code>"47017:27017"</code> (không ghi địa chỉ), khởi động lại, chạy <code>ss -ltn | grep 47017</code>. Cái gì đổi và vì sao nó nguy hiểm trên máy chủ? Rồi đổi lại.</li>
</ol>
${loiGiai('Lời giải', '<p>(2) Sau <code>down</code> volume có tên <code>mgo_mgo-data</code> vẫn còn, nên <code>up</code> lại thì dữ liệu vẫn đó; <code>down -v</code> xoá volume, nên database khởi động trống (chạy lại bộ nạp). (4) <code>ss</code> giờ hiện <code>0.0.0.0:47017</code> (và <code>[::]:47017</code>): mọi giao diện mạng, nên ai chạm được tới máy bạn là chạm được một MongoDB không mật khẩu — đúng mẫu hình năm 2017.</p>')}
<p><strong>Xong khi:</strong> bạn thấy 903, giải thích được <code>down</code> với <code>down -v</code>, và đã đổi cổng về 127.0.0.1.</p></div>
${lienKet({ khoa: 'docker', bai: 'dk-0-5-bat-dau-tai-day', title: 'Docker — Bắt đầu tại đây', sub: 'Volume, mở cổng và Compose giảng từ số 0' })}

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['mongod', 'Tiến trình máy chủ MongoDB.'],
  ['mongosh', 'Vỏ lệnh MongoDB, một console JavaScript.'],
  ['Replica set một thành viên', 'Replica set chỉ có một máy — chưa dự phòng gì, nhưng mở được transaction và change stream.'],
  ['rs.initiate()', 'Tạo cấu hình replica set; chạy một lần.'],
  ['Primary', 'Thành viên nhận ghi.'],
  ['Volume có tên', 'Vùng lưu trữ do Docker quản lý, sống qua việc xoá container.'],
  ['directConnection', 'Tuỳ chọn chuỗi kết nối: dùng đúng máy này, bỏ qua dò thành viên.'],
  ['Healthcheck', 'Lệnh Docker chạy định kỳ để quyết định container đã sẵn sàng chưa.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Một <code>compose.yaml</code>: MongoDB 8.0, replica set một thành viên, cổng 47017 chỉ trên 127.0.0.1, một volume có tên.</li>
<li><code>ctshop-seed.js</code> tạo lại đúng bộ 200/60/2.000 trên mọi máy; 903 đơn đã trả là con số đối chiếu của bạn.</li>
<li>Bên trong dùng <code>docker exec -it mgo-lab mongosh</code>, từ máy thật dùng <code>mongodb://127.0.0.1:47017/ctshop?directConnection=true</code>.</li>
<li><code>down</code> giữ dữ liệu, <code>down -v</code> xoá dữ liệu.</li>
</ul>
</div>
`,
};
