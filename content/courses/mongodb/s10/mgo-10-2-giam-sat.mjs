/**
 * 10.2 — Giám sát: serverStatus, mongostat, mongotop và cảnh báo cái gì (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s10-2-giam-sat'] (kịch bản demo/s10/s10-2-giam-sat.txt; MongoDB 8.0.38 trong mgo-lab giới hạn 2 GB/2 CPU, mongostat/mongotop 100.x).
 * Khối: 0 serverStatus 60 mục · 1 connections + opcounters · 2 WiredTiger cache · 3 queues.execution (vé đọc/ghi) · 4 trích _demo/suc-khoe.js · 5 khám sức khoẻ (1 cảnh báo: cửa sổ oplog)
 * · 6 getReplicationInfo · 7 mongostat + mongotop khi có tải 800 đọc/s · 8 mongostat ghi "SLV" cho PRIMARY (serverStatus().repl không còn ismaster)
 * · 9 _demo/node/giu-ket-noi.mjs giữ ~150 kết nối · 10 $currentOp idleConnections nhóm theo appName ⇒ thủ phạm · 11 exporter Percona 0.47: quét 1 vs quét 2 · 12 FTDC diagnostic.data.
 * Phát hiện ghi vào bài: "available" kết nối suy từ ulimit -n của tiến trình (Docker 1024; log mongod "Soft rlimits for open file descriptors too low", khuyên 64000).
 * Liên kết chéo (prod): observability-monitoring obs-4-5-thu-thap-cai-gi, obs-9-1-loi-hua-danh-thuc; postgresql-14-4-giam-sat.
 * Nguồn GET kiểm 24/11/2026: Docs serverStatus, mongostat, mongotop, ulimit, FTDC (diagnostic data); Percona mongodb_exporter (GitHub).
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's10-2-giam-sat';

const CANH_BAO = `# Bộ cảnh báo tối thiểu cho một replica set MongoDB (luật Prometheus; tên chỉ số đã soát trên Percona mongodb_exporter 0.47)
- alert: MongoDown            # máy chết hoặc exporter không nói chuyện được với máy
  expr: mongodb_up == 0
  for: 1m
- alert: MongoKetNoiGanHet    # sắp chạm trần kết nối ⇒ ứng dụng sẽ nhận lỗi kết nối
  expr: mongodb_ss_connections{conn_type="current"} / ignoring(conn_type)
        (mongodb_ss_connections{conn_type="current"} + ignoring(conn_type) mongodb_ss_connections{conn_type="available"}) > 0.8
  for: 5m
- alert: MongoThanhVienKhoe   # một thành viên replica set không khoẻ
  expr: mongodb_members_health == 0
  for: 2m
- alert: MongoCacheBan        # dữ liệu bẩn > 20 % cache ⇒ ghi sắp bị chặn chờ
  expr: mongodb_ss_wt_cache_tracked_dirty_bytes_in_the_cache / mongodb_ss_wt_cache_maximum_bytes_configured > 0.2
  for: 10m
# Cộng thêm, từ phía ỨNG DỤNG (quan trọng hơn mọi chỉ số máy chủ): p99 độ trễ và tỉ lệ lỗi của API (Bài 10.4).`;

export default {
  title: '10.2 — Monitoring: serverStatus, mongostat, mongotop and what to alert on|||10.2 — Giám sát: serverStatus, mongostat, mongotop và cảnh báo cái gì',
  slug: 'mgo-10-2-giam-sat',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Giám sát MongoDB đo thật trên lab: serverStatus có 60 mục — đọc đúng bốn nhóm (kết nối, WiredTiger cache, vé thực thi/hàng đợi, replication + cửa sổ oplog); một script "khám sức khoẻ" một giây in OK/CẢNH BÁO; mongostat/mongotop khi có tải (và cái bẫy mongostat 100.x ghi "SLV" cho một PRIMARY trên 8.0); trực ca thật: kết nối nhảy lên 162/409 — dùng $currentOp nhóm theo appName tìm ra tác vụ "bao-cao-dem" giữ 150 kết nối; vì sao trần kết nối là 409 (ulimit 1024 của Docker); exporter Prometheus (48 dòng lần quét đầu, hơn 6.500 dòng lần sau) và nên cảnh báo cái gì.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Monitoring: serverStatus, mongostat, mongotop and what to alert on</h2>
<p class="lead">"The database is slow" is the most common sentence in operations, and without monitoring nobody can say whether it is true. MongoDB exposes thousands of numbers; the skill is knowing the handful that answer real questions — <em>are we running out of connections? is the cache too small? are operations queueing? can we still recover to a point in time?</em> — and turning those into alerts that wake someone only when it matters.</p>

<h3>An everyday picture</h3>
<p>A car dashboard shows speed, fuel, engine temperature and a few warning lights — not the pressure in each cylinder. The cylinder data exists (serverStatus has it all), and a mechanic reads it when something is wrong. Your monitoring should be the dashboard; your debugging tools are the mechanic's laptop.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Connections</span><span class="lz-t">current / available, totalCreated rate</span><span class="lz-d">near the limit ⇒ app gets connection errors</span></div>
  <div class="lz-step"><span class="lz-k">Cache</span><span class="lz-t">used, dirty, application-thread eviction</span><span class="lz-d">working set larger than cache ⇒ disk latency</span></div>
  <div class="lz-step"><span class="lz-k">Queues</span><span class="lz-t">execution tickets out, queueLength</span><span class="lz-d">server saturated ⇒ more threads only queue</span></div>
  <div class="lz-step"><span class="lz-k">Replication</span><span class="lz-t">member health, lag, oplog window</span><span class="lz-d">window too short ⇒ PITR and resume fail</span></div>
</div>

<h3>1. serverStatus: four groups that matter</h3>
${lenh(K, 0)}
${lenh(K, 1)}
<p><code>db.serverStatus()</code> returns 60 sections on 8.0. Start with <strong>connections</strong>: <code>current</code> vs <code>available</code>. On the lab the total is only about 409 — not a MongoDB setting but a consequence of the process's open-file limit: Docker's default soft <code>ulimit -n</code> is 1024, and mongod logs a startup warning "Soft rlimits for open file descriptors too low" (recommended 64,000). On a real server, set it (in compose: <code>ulimits: { nofile: 64000 }</code>). <code>totalCreated</code> growing fast means the application opens new connections instead of reusing a pool (Lesson 8.1). <strong>opcounters</strong> are cumulative since start: graph their <em>rate</em>, not the value.</p>
${lenh(K, 2)}
<p><strong>WiredTiger cache</strong>: its size (here 512 MiB, because the container has 2 GB: 50% of RAM minus 1 GB), how full it is, how much is <em>dirty</em> (changed but not yet written to disk), how many pages had to be read from disk, and — the most telling — whether <em>application threads</em> had to evict pages themselves. When the cache is too small for the working set, your queries stop to do the cache's housekeeping (Lesson 10.3 measures that).</p>
${lenh(K, 3)}
<p><strong>Execution tickets</strong>: MongoDB limits how many read and write operations run inside the storage engine at once; the rest wait in a queue. <code>out</code> near <code>totalTickets</code> plus a growing <code>queueLength</code> means operations are queueing — the server is saturated (CPU, disk or locks), and adding more application threads will only lengthen the queue (Lesson 10.4).</p>
${nguon('📘', 'MongoDB Docs — serverStatus', 'connections, opcounters, wiredTiger.cache, queues.execution, repl', 'https://www.mongodb.com/docs/manual/reference/command/serverStatus/')}
${nguon('📘', 'MongoDB Docs — UNIX ulimit settings', 'open files limit and recommended values for mongod', 'https://www.mongodb.com/docs/manual/reference/ulimit/')}

<h3>2. A one-second health check</h3>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p><code>suc-khoe.js</code> reads serverStatus and replica set status once and prints OK/WARNING against thresholds — a script you can run at 2 a.m. without remembering field names. Today it warns about one thing: the <strong>oplog window</strong>. The oplog is about 1 GB (<code>logSizeMB</code>), and after the heavy loads of the previous chapters it holds only a few hours of history (<code>timeDiffHours</code>). That number is the limit for point-in-time recovery (Lesson 10.1), for a secondary that was down, and for change stream listeners (Lesson 10.5). Alert when it drops below what you need — commonly 24 hours or more — and resize the oplog (<code>replSetResizeOplog</code>) or keep a minimum retention period.</p>

<h3>3. mongostat and mongotop under load</h3>
${lenh(K, 7)}
<p>With a load generator sending 800 reads per second, <code>mongostat</code> prints one line per second: operations per second by type, cache dirty/used percentage, queued readers/writers (<code>qrw</code>), active (<code>arw</code>), network and connections. <code>mongotop</code> shows <em>where</em> time is spent per collection — <code>ctshop.orders</code> on top, as expected. These are the first two commands to run when someone says "it's slow": is the load unusual? is it one collection?</p>
${lenh(K, 8)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — trusting a tool's label over the server.</strong> mongostat (database tools 100.x) shows <code>SLV</code> (secondary) in the <code>repl</code> column for our <em>primary</em>. The server itself says <code>isWritablePrimary=true</code>; the field <code>ismaster</code> that older tools look for no longer exists in 8.0's serverStatus. In an incident, a teammate reading "SLV" might start debugging a failover that never happened. When a tool and the server disagree, ask the server (<code>db.hello()</code>, <code>rs.status()</code>).</p>
</div>
${nguon('📘', 'MongoDB Docs — mongostat', 'columns: dirty, used, qrw, arw, conn, repl', 'https://www.mongodb.com/docs/database-tools/mongostat/')}
${nguon('📘', 'MongoDB Docs — mongotop', 'time spent reading/writing per collection', 'https://www.mongodb.com/docs/database-tools/mongotop/')}

<h3>4. On call: who is holding all the connections?</h3>
${lenh(K, 9)}
<p>The connection count jumps from about 10 to 162. Restarting the API "to free connections" is the classic wrong move: it may not be the API. Ask the server who they belong to:</p>
${lenh(K, 10)}
<p><code>$currentOp</code> with <code>idleConnections: true</code> lists every connection, including idle ones, with the client address and the <strong>appName</strong> the driver sent. Grouping by <code>appName</code> finds the culprit in one query: 156 connections from <code>bao-cao-dem</code> ("nightly report"), a job that creates a new client with <code>minPoolSize: 50</code> on each run and never closes it. This is why every application should set <code>appName</code> in its connection string — and why you give each one its own database user (Lesson 9.2): both make this question answerable.</p>

<h3>5. Long-term: exporter, Prometheus, and FTDC</h3>
${lenh(K, 11)}
<p>The commands above show <em>now</em>. For trends and alerts you need the numbers stored every few seconds: Percona's <code>mongodb_exporter</code> turns serverStatus, replica set status and more into Prometheus metrics. Notice the first scrape had 48 lines and the second over 6,500 — the exporter collects lazily; don't conclude from the first scrape that a metric is missing. Then alert on a few rules:</p>
${ma('yaml', CANH_BAO)}
${lenh(K, 12)}
<p>MongoDB also records its own metrics once per second into <code>diagnostic.data</code> (FTDC, a few MB here). You can't read it easily yourself, but it lets you, or MongoDB support, reconstruct what happened right before an incident. Never delete it to "save space".</p>
${lienKet({ cta: 'Open lesson', khoa: 'observability-monitoring', bai: 'obs-4-5-thu-thap-cai-gi', title: 'Observability course · 4.5 — Which metrics to actually collect', sub: 'RED/USE, cardinality, what is worth storing' })}
${lienKet({ cta: 'Open lesson', khoa: 'observability-monitoring', bai: 'obs-9-1-loi-hua-danh-thuc', title: 'Observability course · 9.1 — An alert is a promise to wake someone', sub: 'alert on symptoms, avoid noise, runbooks' })}
${lienKet({ cta: 'Open lesson', khoa: 'postgresql', bai: 'postgresql-14-4-giam-sat', title: 'PostgreSQL course · 14.4 — Monitoring', sub: 'pg_stat_* views — the same four questions in PostgreSQL' })}
${nguon('🐙', 'Percona — mongodb_exporter (GitHub)', 'Prometheus exporter for MongoDB: flags, collectors, metric names', 'https://github.com/percona/mongodb_exporter')}

<h3>🕵️ Attacker's view</h3>
<p>Monitoring is also security. A sudden spike in <code>connections.totalCreated</code>, a new <code>appName</code> or a client IP you have never seen, failed authentications in the log (Lesson 9.2), or a <code>query</code> opcounter rate ten times normal at 3 a.m. are the signals that someone is scanning or exfiltrating data. The 2017 ransom wave (Lesson 9.1) was noticed by most victims only after the data was gone — none of them had an alert on "a database was dropped".</p>

<h3>💼 On the job</h3>
<p>In an OJT project you are rarely asked to "set up monitoring" from scratch — you are asked to explain a graph in a meeting or to handle the first alert of your on-call week. Prepare one page: the four groups (connections, cache, queues, replication/oplog), what normal looks like on <em>your</em> system (a baseline — thresholds in <code>suc-khoe.js</code> are starting points), the first three commands to run (<code>suc-khoe.js</code>, <code>mongostat</code>, <code>$currentOp</code> grouped by appName), and who to call.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"Which MongoDB metrics would you alert on?"</strong> — Up/down and replica set member health, connections near the limit, replication lag and oplog window, cache dirty and application-thread eviction, execution queue length — plus the application's own p99 latency and error rate.</li>
<li><strong>"Connections suddenly doubled. What do you do?"</strong> — $currentOp with idleConnections, group by appName/client; find the application; check pool settings and leaks; don't blindly restart.</li>
<li><strong>"Why is the oplog window important?"</strong> — It bounds point-in-time recovery, how long a secondary can be down and still catch up, and how long a change-stream listener can be offline.</li>
<li><strong>"What does it mean when application threads evict pages?"</strong> — The cache can't keep up: working set larger than cache or write pressure; queries pay the cost in latency.</li>
</ol>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Add to <code>suc-khoe.js</code> a check for replication lag: for every SECONDARY in <code>rs.status()</code>, warn if its <code>optimeDate</code> is more than 10 seconds behind the primary. Test on the three-member replica set of <code>rs3.sh</code> (Lesson 6.3): stop replication on one member with <code>bash rs3.sh ngung-chep 27020</code>, then insert one document per second for 15 seconds.</li>
<li>Run <code>giu-ket-noi.mjs</code> again and write the two-line message you would post in the team channel, with numbers.</li>
<li>Find in the exporter output the metric for the oplog window (hint: search for <code>oplog</code>) and write an alert rule for "less than 24 hours".</li>
</ol>
${loiGiai('Suggested answers', `<p>1. <code>const st = rs.status(); const p = st.members.find(m => m.stateStr === 'PRIMARY'); for (const m of st.members.filter(m => m.stateStr === 'SECONDARY')) { const tre = (p.optimeDate - m.optimeDate) / 1000; dong('trễ ' + m.name, tre + ' s', tre > 10); }</code> — measured: <code>ok trễ localhost:27019 0 s</code> and <code>CẢNH BÁO trễ localhost:27020 16 s</code>. (A member paused with SIGSTOP instead shows as unreachable, not SECONDARY — warn on that state too.)</p>
<p>2. "Connections on ctshop-prod went from ~10 to 162 at 14:20. $currentOp shows 156 idle connections with appName bao-cao-dem from 172.x — the nightly report job creates a 50-connection pool per run and never closes it. Asking the owner to add client.close(); API unaffected."</p>
<p>3. Measured on exporter 0.47 against 8.0: the scrape has <code>mongodb_oplog_stats_start</code> and <code>mongodb_oplog_stats_end</code> (plus <code>…storageStats_maxSize</code> ≈ 1 GB) — but both timestamps equal the current time, so <code>end - start</code> is 0 while <code>getReplicationInfo()</code> says about 5 hours. Don't build the alert on them. Export the window yourself (a small job that runs <code>suc-khoe.js</code> or <code>getReplicationInfo().timeDiff</code> every minute and pushes it as a metric) and alert when it is <code>&lt; 86400</code> for 15 minutes. The lesson: verify every metric against the server before you trust an alert built on it.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['serverStatus', 'Command returning the server\'s counters and state, grouped in sections.'],
  ['WiredTiger cache, dirty bytes', 'The storage engine\'s in-memory cache; dirty = modified, not yet written to disk.'],
  ['Execution tickets', 'Slots for concurrent reads/writes inside the storage engine; extra operations queue.'],
  ['Oplog window', 'Time span of history the oplog still holds (getReplicationInfo().timeDiffHours).'],
  ['appName', 'Name the driver reports for each connection; makes $currentOp and logs attributable.'],
  ['Exporter / FTDC', 'Bridge from serverStatus to Prometheus / MongoDB\'s own per-second diagnostic recording.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Watch four groups: connections, cache, execution queues, replication and oplog window.</li>
<li>A one-second health script and three commands (mongostat, mongotop, $currentOp by appName) answer most "it's slow" calls.</li>
<li>When a tool and the server disagree, believe the server.</li>
<li>Alert on few, meaningful rules — and on the application's own latency and errors.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Giám sát: serverStatus, mongostat, mongotop và cảnh báo cái gì</h2>
<p class="lead">"Database chậm quá" là câu nói hay gặp nhất trong vận hành, và không có giám sát thì chẳng ai nói được câu đó đúng hay sai. MongoDB phơi ra hàng nghìn con số; kỹ năng nằm ở chỗ biết vài con số trả lời được câu hỏi thật: <em>có sắp hết kết nối không? cache có quá nhỏ không? thao tác có đang xếp hàng không? còn khôi phục tới thời điểm được không?</em> Rồi biến chúng thành cảnh báo chỉ đánh thức người khi thật sự cần.</p>

<h3>Hình ảnh đời thường</h3>
<p>Bảng đồng hồ ô tô hiện tốc độ, xăng, nhiệt độ máy và vài đèn báo, chứ không hiện áp suất từng xi-lanh. Dữ liệu xi-lanh vẫn có (serverStatus có đủ cả), và thợ máy đọc nó khi có chuyện. Hệ giám sát của bạn nên là bảng đồng hồ; còn công cụ gỡ lỗi là máy tính của thợ máy.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Kết nối</span><span class="lz-t">current / available, tốc độ tăng totalCreated</span><span class="lz-d">gần trần ⇒ ứng dụng nhận lỗi kết nối</span></div>
  <div class="lz-step"><span class="lz-k">Cache</span><span class="lz-t">đã dùng, bẩn, luồng ứng dụng phải tự dọn</span><span class="lz-d">working set lớn hơn cache ⇒ chậm vì đĩa</span></div>
  <div class="lz-step"><span class="lz-k">Hàng đợi</span><span class="lz-t">vé thực thi đang dùng, queueLength</span><span class="lz-d">máy chủ bão hoà ⇒ thêm luồng chỉ thêm xếp hàng</span></div>
  <div class="lz-step"><span class="lz-k">Nhân bản</span><span class="lz-t">sức khoẻ thành viên, độ trễ, cửa sổ oplog</span><span class="lz-d">cửa sổ quá ngắn ⇒ PITR và nối lại thất bại</span></div>
</div>

<h3>1. serverStatus: bốn nhóm đáng xem</h3>
${lenh(K, 0)}
${lenh(K, 1)}
<p><code>db.serverStatus()</code> trả về 60 mục trên bản 8.0. Bắt đầu với <strong>connections</strong>: <code>current</code> so với <code>available</code>. Trên lab, tổng chỉ khoảng 409. Đây không phải một cài đặt của MongoDB, mà là hệ quả của giới hạn số tệp được mở của tiến trình. <code>ulimit -n</code> mềm mặc định của Docker là 1024, và lúc khởi động mongod ghi cảnh báo "Soft rlimits for open file descriptors too low" (khuyên dùng 64.000). Trên máy chủ thật, hãy đặt nó (trong compose: <code>ulimits: { nofile: 64000 }</code>). <code>totalCreated</code> tăng nhanh nghĩa là ứng dụng mở kết nối mới thay vì dùng lại pool (Bài 8.1). <strong>opcounters</strong> là số cộng dồn từ lúc khởi động: hãy vẽ <em>tốc độ</em> tăng của chúng, đừng vẽ giá trị.</p>
${lenh(K, 2)}
<p><strong>WiredTiger cache</strong>: kích thước (ở đây 512 MiB, vì container có 2 GB: 50% của RAM trừ 1 GB), đầy bao nhiêu, bao nhiêu là <em>bẩn</em> (đã đổi nhưng chưa ghi xuống đĩa), bao nhiêu trang phải đọc từ đĩa, và quan trọng nhất: <em>luồng của ứng dụng</em> có phải tự dọn trang ra khỏi cache không. Khi cache quá nhỏ so với working set, truy vấn của bạn phải dừng lại để làm việc dọn dẹp thay cho cache (Bài 10.3 đo chuyện này).</p>
${lenh(K, 3)}
<p><strong>Vé thực thi</strong>: MongoDB giới hạn số thao tác đọc và ghi chạy cùng lúc bên trong bộ máy lưu trữ; phần còn lại xếp hàng chờ. <code>out</code> gần bằng <code>totalTickets</code>, cộng <code>queueLength</code> tăng dần, nghĩa là thao tác đang xếp hàng: máy chủ đã bão hoà (CPU, đĩa hoặc khoá), và thêm luồng ở ứng dụng chỉ làm hàng dài thêm (Bài 10.4).</p>
${nguon('📘', 'MongoDB Docs — serverStatus', 'connections, opcounters, wiredTiger.cache, queues.execution, repl', 'https://www.mongodb.com/docs/manual/reference/command/serverStatus/')}
${nguon('📘', 'MongoDB Docs — UNIX ulimit settings', 'giới hạn số tệp mở và giá trị khuyên dùng cho mongod', 'https://www.mongodb.com/docs/manual/reference/ulimit/')}

<h3>2. Khám sức khoẻ trong một giây</h3>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p><code>suc-khoe.js</code> đọc serverStatus và trạng thái replica set một lần, rồi in OK/CẢNH BÁO theo ngưỡng. Đây là script bạn chạy được lúc 2 giờ sáng mà không cần nhớ tên trường. Hôm nay nó cảnh báo đúng một thứ: <strong>cửa sổ oplog</strong>. Oplog khoảng 1 GB (<code>logSizeMB</code>), và sau các đợt tải nặng của những chương trước, nó chỉ còn giữ vài giờ lịch sử (<code>timeDiffHours</code>). Con số đó là giới hạn của khôi phục tới thời điểm (Bài 10.1), của một secondary vừa chết dậy, và của tiến trình nghe change stream (Bài 10.5). Hãy cảnh báo khi nó tụt dưới mức bạn cần, thường là từ 24 giờ trở lên, rồi nới oplog (<code>replSetResizeOplog</code>) hoặc đặt thời gian giữ tối thiểu.</p>

<h3>3. mongostat và mongotop khi có tải</h3>
${lenh(K, 7)}
<p>Với một máy tạo tải gửi 800 lần đọc mỗi giây, <code>mongostat</code> in mỗi giây một dòng: số thao tác mỗi giây theo loại, phần trăm cache bẩn/đã dùng, số đọc/ghi đang xếp hàng (<code>qrw</code>), đang chạy (<code>arw</code>), mạng và kết nối. <code>mongotop</code> cho thấy thời gian tiêu <em>ở đâu</em> theo từng collection: <code>ctshop.orders</code> đứng đầu, đúng như dự đoán. Đây là hai lệnh đầu tiên khi ai đó nói "chậm quá": tải có bất thường không? có phải chỉ một collection không?</p>
${lenh(K, 8)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tin nhãn của công cụ hơn tin máy chủ.</strong> mongostat (database tools 100.x) hiện <code>SLV</code> (secondary) ở cột <code>repl</code> cho chính máy <em>primary</em> của ta. Bản thân máy chủ nói <code>isWritablePrimary=true</code>; trường <code>ismaster</code> mà công cụ cũ tìm thì không còn trong serverStatus của 8.0. Giữa sự cố, một đồng đội đọc thấy "SLV" có thể bắt đầu gỡ lỗi một lần chuyển dự phòng chưa từng xảy ra. Khi công cụ và máy chủ nói khác nhau, hãy hỏi máy chủ (<code>db.hello()</code>, <code>rs.status()</code>).</p>
</div>
${nguon('📘', 'MongoDB Docs — mongostat', 'các cột: dirty, used, qrw, arw, conn, repl', 'https://www.mongodb.com/docs/database-tools/mongostat/')}
${nguon('📘', 'MongoDB Docs — mongotop', 'thời gian đọc/ghi theo từng collection', 'https://www.mongodb.com/docs/database-tools/mongotop/')}

<h3>4. Trực ca: ai đang giữ hết kết nối?</h3>
${lenh(K, 9)}
<p>Số kết nối nhảy từ khoảng 10 lên 162. Khởi động lại API "cho nhả kết nối" là nước đi sai kinh điển: thủ phạm có thể không phải API. Hãy hỏi máy chủ xem kết nối thuộc về ai:</p>
${lenh(K, 10)}
<p><code>$currentOp</code> với <code>idleConnections: true</code> liệt kê mọi kết nối, kể cả kết nối đang ngồi không, kèm địa chỉ client và <strong>appName</strong> mà driver gửi lên. Nhóm theo <code>appName</code> là tìm ra thủ phạm trong một truy vấn: 156 kết nối từ <code>bao-cao-dem</code>, một tác vụ mỗi lần chạy tạo client mới với <code>minPoolSize: 50</code> mà không bao giờ đóng. Vì thế mọi ứng dụng nên đặt <code>appName</code> trong chuỗi kết nối, và mỗi ứng dụng có user database riêng (Bài 9.2): cả hai đều giúp trả lời được câu hỏi này.</p>

<h3>5. Lâu dài: exporter, Prometheus và FTDC</h3>
${lenh(K, 11)}
<p>Các lệnh trên cho thấy <em>bây giờ</em>. Để thấy xu hướng và đặt cảnh báo, bạn cần lưu các con số mỗi vài giây: <code>mongodb_exporter</code> của Percona biến serverStatus, trạng thái replica set và hơn thế thành chỉ số Prometheus. Để ý lần quét đầu chỉ có 48 dòng, lần thứ hai hơn 6.500 dòng: exporter thu thập từ từ, đừng vội kết luận từ lần quét đầu rằng thiếu chỉ số. Rồi cảnh báo theo vài luật:</p>
${ma('yaml', CANH_BAO)}
${lenh(K, 12)}
<p>MongoDB còn tự ghi chỉ số của nó mỗi giây vào <code>diagnostic.data</code> (FTDC, ở đây vài MB). Bạn khó tự đọc, nhưng nó giúp bạn hoặc bộ phận hỗ trợ của MongoDB dựng lại chuyện gì đã xảy ra ngay trước sự cố. Đừng bao giờ xoá nó "cho đỡ tốn chỗ".</p>
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-4-5-thu-thap-cai-gi', title: 'Khoá Observability · 4.5 — Thật ra thì nên thu thập chỉ số nào', sub: 'RED/USE, cardinality, cái gì đáng lưu' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-9-1-loi-hua-danh-thuc', title: 'Khoá Observability · 9.1 — Một cảnh báo là lời hứa sẽ đánh thức ai đó', sub: 'cảnh báo theo triệu chứng, tránh nhiễu, runbook' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-14-4-giam-sat', title: 'Khoá PostgreSQL · 14.4 — Giám sát', sub: 'các view pg_stat_* — cùng bốn câu hỏi trong PostgreSQL' })}
${nguon('🐙', 'Percona — mongodb_exporter (GitHub)', 'exporter Prometheus cho MongoDB: tham số, bộ thu, tên chỉ số', 'https://github.com/percona/mongodb_exporter')}

<h3>🕵️ Góc hacker</h3>
<p>Giám sát cũng là bảo mật. <code>connections.totalCreated</code> đột ngột vọt lên, một <code>appName</code> hay IP client chưa từng thấy, các lần xác thực thất bại trong log (Bài 9.2), hay tốc độ opcounter <code>query</code> gấp mười lần bình thường lúc 3 giờ sáng: đó là dấu hiệu có người đang dò quét hoặc rút dữ liệu. Trong làn sóng tống tiền 2017 (Bài 9.1), phần lớn nạn nhân chỉ biết chuyện khi dữ liệu đã mất; không ai trong số họ có cảnh báo cho việc "một database vừa bị xoá".</p>

<h3>💼 Đi làm</h3>
<p>Ở dự án OJT, hiếm khi bạn được giao "dựng hệ giám sát" từ đầu. Bạn sẽ được nhờ giải thích một biểu đồ trong cuộc họp, hoặc xử lý cảnh báo đầu tiên trong tuần trực của mình. Hãy chuẩn bị một trang: bốn nhóm (kết nối, cache, hàng đợi, replication/oplog), trạng thái bình thường trên hệ thống <em>của bạn</em> trông thế nào (đường nền; ngưỡng trong <code>suc-khoe.js</code> chỉ là điểm khởi đầu), ba lệnh chạy đầu tiên (<code>suc-khoe.js</code>, <code>mongostat</code>, <code>$currentOp</code> nhóm theo appName), và gọi ai.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn sẽ đặt cảnh báo cho những chỉ số MongoDB nào?"</strong> — Sống/chết và sức khoẻ thành viên replica set, kết nối gần trần, độ trễ nhân bản và cửa sổ oplog, cache bẩn và luồng ứng dụng phải tự dọn, độ dài hàng đợi thực thi; cộng p99 độ trễ và tỉ lệ lỗi của chính ứng dụng.</li>
<li><strong>"Số kết nối bỗng tăng gấp đôi. Bạn làm gì?"</strong> — $currentOp với idleConnections, nhóm theo appName/client; tìm ra ứng dụng; xem cấu hình pool và chỗ rò; đừng khởi động lại mù quáng.</li>
<li><strong>"Vì sao cửa sổ oplog quan trọng?"</strong> — Nó giới hạn khôi phục tới thời điểm, thời gian một secondary được phép chết mà vẫn đuổi kịp, và thời gian tiến trình nghe change stream được phép tắt.</li>
<li><strong>"Luồng ứng dụng phải tự dọn trang nghĩa là gì?"</strong> — Cache theo không kịp: working set lớn hơn cache hoặc ghi dồn dập; truy vấn trả giá bằng độ trễ.</li>
</ol>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm vào <code>suc-khoe.js</code> một mục kiểm độ trễ nhân bản: với mỗi SECONDARY trong <code>rs.status()</code>, cảnh báo nếu <code>optimeDate</code> chậm hơn primary quá 10 giây. Thử trên replica set ba thành viên của <code>rs3.sh</code> (Bài 6.3): cho một thành viên ngừng chép bằng <code>bash rs3.sh ngung-chep 27020</code>, rồi mỗi giây insert một tài liệu trong 15 giây.</li>
<li>Chạy lại <code>giu-ket-noi.mjs</code> và viết tin nhắn hai dòng bạn sẽ gửi vào kênh của nhóm, có số liệu.</li>
<li>Tìm trong output của exporter chỉ số về cửa sổ oplog (gợi ý: tìm chữ <code>oplog</code>) và viết luật cảnh báo cho "ít hơn 24 giờ".</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. <code>const st = rs.status(); const p = st.members.find(m => m.stateStr === 'PRIMARY'); for (const m of st.members.filter(m => m.stateStr === 'SECONDARY')) { const tre = (p.optimeDate - m.optimeDate) / 1000; dong('trễ ' + m.name, tre + ' s', tre > 10); }</code> — đo thật: <code>ok trễ localhost:27019 0 s</code> và <code>CẢNH BÁO trễ localhost:27020 16 s</code>. (Một thành viên bị dừng bằng SIGSTOP thì hiện là không tới được, không còn là SECONDARY — hãy cảnh báo cả trạng thái đó.)</p>
<p>2. "Kết nối trên ctshop-prod tăng từ ~10 lên 162 lúc 14:20. $currentOp cho thấy 156 kết nối nằm im có appName bao-cao-dem từ 172.x: tác vụ báo cáo đêm mỗi lần chạy tạo pool 50 kết nối mà không đóng. Đã nhờ chủ tác vụ thêm client.close(); API không bị ảnh hưởng."</p>
<p>3. Đo thật với exporter 0.47 trên 8.0: lần quét có <code>mongodb_oplog_stats_start</code> và <code>mongodb_oplog_stats_end</code> (cùng <code>…storageStats_maxSize</code> ≈ 1 GB), nhưng cả hai mốc đều bằng thời điểm hiện tại, nên <code>end - start</code> ra 0 trong khi <code>getReplicationInfo()</code> nói khoảng 5 giờ. Đừng dựng cảnh báo trên chúng. Hãy tự xuất cửa sổ oplog (một tác vụ nhỏ mỗi phút chạy <code>suc-khoe.js</code> hoặc <code>getReplicationInfo().timeDiff</code> rồi đẩy thành chỉ số) và cảnh báo khi nó <code>&lt; 86400</code> kéo dài 15 phút. Bài học: soát từng chỉ số với máy chủ trước khi tin một cảnh báo dựng trên nó.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['serverStatus', 'Lệnh trả về các bộ đếm và trạng thái của máy chủ, chia thành từng mục.'],
  ['WiredTiger cache, dirty bytes', 'Bộ nhớ đệm của bộ máy lưu trữ; dirty = đã đổi, chưa ghi xuống đĩa.'],
  ['Vé thực thi (execution tickets)', 'Số chỗ cho đọc/ghi chạy đồng thời bên trong bộ máy lưu trữ; thao tác dư phải xếp hàng.'],
  ['Cửa sổ oplog', 'Khoảng thời gian lịch sử oplog còn giữ (getReplicationInfo().timeDiffHours).'],
  ['appName', 'Tên mà driver báo cho mỗi kết nối; giúp $currentOp và log chỉ ra được ai.'],
  ['Exporter / FTDC', 'Cầu nối từ serverStatus sang Prometheus / bản ghi chẩn đoán mỗi giây của chính MongoDB.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Theo dõi bốn nhóm: kết nối, cache, hàng đợi thực thi, replication và cửa sổ oplog.</li>
<li>Một script khám sức khoẻ một giây và ba lệnh (mongostat, mongotop, $currentOp theo appName) trả lời được phần lớn các cuộc gọi "chậm quá".</li>
<li>Khi công cụ và máy chủ nói khác nhau, tin máy chủ.</li>
<li>Cảnh báo theo ít luật mà có ý nghĩa — và theo độ trễ, lỗi của chính ứng dụng.</li>
</ul>
</div>
`,
};
