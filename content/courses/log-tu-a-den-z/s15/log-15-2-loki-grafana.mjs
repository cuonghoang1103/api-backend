/**
 * 15.2 — Bộ lab 1: Loki + Alloy + Grafana, LogQL (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s15/loki'] (Loki 3.7.10, Alloy 1.22.0, Grafana 13.2.6, logcli 3.7.10) — chạy sau OUT['s15/tap-trung'] trên cùng bộ lab.
 * Số tất định trong lời: 40 /api/orders, 5 lỗi 502, 1 lỗi 404, 72 phản hồi 200 (không tính /healthz), 40 chuỗi khi thiếu "by", SSH admin 4 / root 3 / an 2.
 * Bẫy gặp thật khi dựng lab (ghi trong bài): netns chỉ có lo ⇒ instance_addr; discovery.docker bỏ qua container mượn netns; Loki hãm ghi khi đĩa > 90%.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Lab stack 1: Grafana Loki + Grafana Alloy + Grafana with Docker Compose, and LogQL basics|||Bộ lab 1: Grafana Loki + Grafana Alloy + Grafana bằng Docker Compose, và LogQL cơ bản',
  slug: 'log-15-2-loki-grafana',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng Loki 3.7 + Grafana Alloy 1.22 + Grafana 13 bằng Compose và thu ba loại nguồn: journal của máy Linux (systemd thật), log container (chỉ container có nhãn), và auth.log cổ không có năm/múi giờ (stage.timestamp + location). Nhãn ít, nội dung nhiều: --analyze-labels. LogQL đủ dùng khi điều tra: bộ chọn nhãn, |= |~, | json, | regexp, line_format, count_over_time, sum by, unwrap + quantile và cái bẫy thiếu "by" ra 40 chuỗi. Promtail đã hết vòng đời 2/3/2026 ⇒ dùng Alloy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>Loki, Alloy and Grafana: a log store you can run on a laptop</h2>
<p class="lead">Grafana Loki is "like Prometheus, but for logs": it indexes only a small set of <strong>labels</strong> per stream (<code>job</code>, <code>host</code>, <code>container</code>, <code>unit</code>…) and stores the lines compressed; the content is scanned at query time. That makes it cheap to run and simple to operate — the usual choice for a dev team, a startup, or your capstone. Grafana Alloy is the agent (it replaced Promtail, which reached end of life on 2 March 2026). Grafana is the UI. LogQL in depth — every operator and aggregation — is in the Observability course (lesson 2.4); here you build the stack, collect three different kinds of source, and learn the LogQL you need to <em>investigate</em>.</p>

<h3>The everyday picture: a parcel warehouse</h3>
<p>Every parcel gets a short sticker — sender city, size, colour (labels). Parcels with the same sticker go into the same bin (a stream). To find "the blue parcel from Đà Nẵng that rattles", you walk to the bin "Đà Nẵng, blue" and shake each parcel (line filter). If you wrote the tracking number on the sticker, every parcel would need its own bin and the warehouse would collapse — that is the <em>high-cardinality label</em> mistake.</p>

<h3>Step 1 — Loki: one process, files on disk</h3>
${ma('yaml', 's15/loki/loki.yaml')}
<ul>
<li><code>schema v13</code> + <code>tsdb</code> index, one index file per day — the current recommended schema.</li>
<li><code>retention_period: 168h</code> with the compactor: lines older than 7 days are deleted. Without <code>retention_enabled</code>, Loki keeps everything forever (lesson 16.1).</li>
<li><code>reject_old_samples_max_age: 168h</code>: lines with a timestamp older than a week are refused. Importing last month's log file needs this raised.</li>
<li>Two lines exist only because of this lab, and both were real errors while preparing it: <code>instance_addr: 127.0.0.1</code> (with <code>--network none</code> there is no <code>eth0</code>; Loki stopped with "no useable address found for interfaces [eth0 en0 lo]") and <code>disk_full_threshold: 0.97</code> (lesson 15.1, experiment 3).</li>
</ul>

<h3>Step 2 — Alloy: three sources, one destination</h3>
${ma('alloy', 's15/loki/alloy/config.alloy')}
<p>Alloy's configuration is a graph of <strong>components</strong>: each one has arguments and exports, and you wire them with <code>forward_to</code> and references like <code>discovery.docker.lab.targets</code>. Read it as three pipelines:</p>
<ol>
<li><strong>Containers</strong>: <code>discovery.docker</code> asks the Docker API which containers exist, <em>filtered by the label</em> <code>lgz.c15=1</code> — on a shared host, never collect everyone's containers. <code>discovery.relabel</code> turns <code>/lgz-c15-api</code> into the label <code>container</code>. <code>loki.process</code> parses JSON only to promote <code>level</code> to a label (three or four values: bounded).</li>
<li><strong>Journal</strong>: <code>loki.source.journal</code> reads the binary journal (here mounted read-only from the Linux machine) and maps journal fields to labels — <code>_SYSTEMD_UNIT</code> → <code>unit</code>, <code>_HOSTNAME</code> → <code>host</code>, priority → <code>level</code>. On a real server you mount <code>/var/log/journal</code> and <code>/etc/machine-id</code>.</li>
<li><strong>A legacy text file</strong>: the log pack's <code>auth.log</code> has lines like <code>Nov 20 09:05:40 web-01 sudo: …</code> — no year, no time zone. Without <code>stage.timestamp</code> every line would be stamped with the moment Alloy read it (today), and the attack would appear to happen now. <code>format = "Jan _2 15:04:05"</code> is Go's reference-time layout; <code>location</code> says the machine was on Vietnam time; the missing year is taken as the current one.</li>
</ol>
<p>Two traps found while building this lab. First, <code>discovery.docker</code> returned <strong>zero targets</strong> while the API container shared the network namespace of another container (<code>network_mode: service:net</code>); with its own namespace (<code>network_mode: none</code>) it was found within one refresh (60 s by default). Second, the Docker socket mounted into Alloy is effectively root on the host — see the hacker's corner.</p>
${lenh('s15/loki', 0)}
<p>Alloy's UI/API on port 12345 shows every component and whether it is healthy — your first stop when "logs are missing".</p>

<h3>Step 3 — what is in the store</h3>
${lenh('s15/loki', 1)}
${lenh('s15/loki', 2)}
${lenh('s15/loki', 3)}
<p>A <strong>stream</strong> is one unique combination of labels. <code>service_name</code> was added by Loki itself (Loki 3 derives it from <code>container</code>/<code>job</code>), <code>filename</code> by the file source. Count what you created:</p>
${lenh('s15/loki', 17)}
<p>Ten streams, at most four values per label. Now imagine adding <code>rid</code> (the request id) as a label: one stream per request, millions of tiny chunks, and Loki's index explodes. Rule: <strong>labels say where a line comes from; what it says stays in the line</strong>.</p>

<h3>Step 4 — LogQL for investigations</h3>
<p>Traffic first: 40 orders, five failed payments (the payment gateway is "down"), one 404, then five failed SSH logins:</p>
${lenh('s15/loki', 4)}
<p><strong>Log queries</strong> return lines. They always start with a <em>stream selector</em> in braces, then optional filters:</p>
${lenh('s15/loki', 5)}
${lenh('s15/loki', 6)}
${lenh('s15/loki', 7)}
${lenh('s15/loki', 8)}
${lenh('s15/loki', 9)}
${kv([
  ['{container="lgz-c15-api"}', 'Stream selector: labels only (=, !=, =~, !~). Pick as few streams as possible — it decides how much is read.'],
  ['|= "x"  != "x"  |~ "re"', 'Line filters: contains / not contains / regex. Cheap, put them early.'],
  ['| json', 'Parse a JSON line; every key becomes a temporary label (status, path, ms…).'],
  ['| regexp "(?P&lt;name&gt;…)"', 'Named groups become temporary labels — for text logs like sshd.'],
  ['| status >= 500', 'Label filter after parsing; numbers compare as numbers.'],
  ['| line_format "{{.path}}"', 'Rewrite the output line (Go template) — only what you need to read.'],
])}
<p>The <code>{rid="…", time="…"}</code> in the output are the temporary labels that differ between lines — handy: you can copy the request id straight into the next query (lesson 10.4).</p>

<h3>Step 5 — metric queries: count instead of read</h3>
${lenh('s15/loki', 10)}
${lenh('s15/loki', 11)}
<p><code>count_over_time(… [10m])</code> turns lines into a number per stream; <code>sum by (user)</code> adds the streams together grouped by one label. "Which users were tried and how often" — the same question as <code>awk | sort | uniq -c</code> in lesson 2.3, but over every machine. Status codes: 72 × 200, 5 × 502, 1 × 404, with <code>/healthz</code> excluded. And one group with <strong>no label at all</strong>, <code>{}</code>: lines that have no <code>status</code> key — here the API's <code>started</code> line. Always look at the empty group: it is where lines that your parser did not understand end up.</p>
${lenh('s15/loki', 12)}
${lenh('s15/loki', 13)}
<div class="pitfall co-tieu-de"><p><strong>The forgotten "by".</strong> <code>quantile_over_time(0.95, … | json | unwrap ms [5m])</code> returned <strong>40 series</strong> — one per request — because <code>| json</code> created labels (<code>rid</code>, <code>time</code>…) that are unique per line, and a range aggregation keeps all labels. The 95th percentile of one value is that value: useless. Add <code>by (path)</code> (or drop labels with <code>| keep path</code>) and you get one answer: the p95 latency of <code>/api/orders</code> over five minutes.</p></div>
${lenh('s15/loki', 14)}

<h3>Step 6 — the old file, at its real time</h3>
${lenh('s15/loki', 15)}
${lenh('s15/loki', 16)}
<p>The line says <code>09:02:11</code> (Vietnam) and Loki stored <code>02:02:11Z</code> on 20 November — the timestamp stage worked. The second query proves it: in the last hour there are <strong>zero</strong> lines from that file, although Alloy read it a few minutes ago. If you see an old file's lines "now", your timestamp stage is missing or its regex does not match.</p>

<h3>Step 7 — Grafana</h3>
${ma('yaml', 's15/loki/grafana/datasources/loki.yaml')}
${lenh('s15/loki', 18)}
${lenh('s15/loki', 19)}
<p>The data source is provisioned from a file (no clicking), and the same LogQL runs through Grafana's API — that is exactly what Explore and dashboards do. In the browser: <strong>Explore</strong> → data source Loki → <em>Code</em> mode → paste any query from this lesson; <em>Logs</em> shows lines, switch to a metric query to get a graph. <strong>Drilldown → Logs</strong> (Grafana 12+) lets you browse services and labels without writing LogQL — good for a first look at an unfamiliar system.</p>

<h3>Hacker's corner: the agent is a privileged process</h3>
<p>To read container logs, Alloy mounts <code>/var/run/docker.sock</code>. Anyone who controls that socket can start a privileged container that mounts the host's root filesystem — it is root on the host (a well-known escalation, used in real cryptomining campaigns against exposed Docker APIs). So: mount it read-only <em>and</em> remember that read-only on a socket does not limit API calls; keep Alloy's UI (port 12345) off the network — it shows your configuration and can be used for debugging; pin the agent image version; and in Kubernetes, prefer reading <code>/var/log/pods</code> over the container runtime socket. The same reasoning applies to Filebeat, Fluent Bit and Vector.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Your team lead asks for "all 5xx of the payment service yesterday 14:00–15:00"</strong>: Grafana Explore, time range, <code>{service_name="payment"} | json | status >= 500</code>. Export the lines as CSV for the ticket.</li>
<li><strong>A teammate adds <code>user_id</code> as a Loki label</strong> "to filter faster". Show them <code>logcli series --analyze-labels</code> after one day.</li>
<li><strong>Migrating from Promtail</strong>: <code>alloy convert --source-format=promtail</code> translates an old config; then review it — especially pipeline stages and labels.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Bring up <code>_demo/s15/loki</code>. In Explore, show all lines of <code>ssh.service</code> on <code>lab15</code> in the last 15 minutes that contain <code>Accepted</code> or <code>Failed</code>.</li>
<li>Write a metric query: number of 5xx per minute of <code>lgz-c15-api</code> over the last 30 minutes, as a graph.</li>
<li>Find the p99 of <code>ms</code> per <code>path</code> (excluding <code>/healthz</code>). Then remove the <code>by</code> and explain the number of series you get.</li>
<li>Comment out <code>stage.timestamp</code> in <code>config.alloy</code>, delete the volume <code>alloy-data</code> (it remembers file positions), restart Alloy, and query <code>{job="file"}</code> over the last hour.</li>
</ol>
<p><strong>Done when:</strong> 1 uses <code>|~ "Accepted|Failed"</code> after the selector; 2 is <code>sum(count_over_time({container="lgz-c15-api"} | json | status >= 500 [1m]))</code>; 3 returns one series per path with <code>by (path)</code> and one series per request without it; 4 shows the 163 auth.log lines stamped with <em>today's</em> time — and you can explain why that would ruin a timeline.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Stream', 'All lines with exactly the same label set; Loki indexes streams, not words.'],
  ['Label cardinality', 'Number of distinct values; high cardinality (ids, IPs) = too many streams.'],
  ['Grafana Alloy', 'Grafana\'s agent (configuration = graph of components); successor of Promtail.'],
  ['loki.process stages', 'json, regexp, labels, timestamp… run in the agent before sending.'],
  ['Log query', 'Selector + filters/parsers ⇒ lines.'],
  ['Metric query', 'count_over_time, rate, sum by, unwrap + quantile_over_time ⇒ numbers.'],
  ['logcli', 'Loki\'s command-line client: labels, series, query, instant-query.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Loki indexes labels only; keep labels few and bounded, content in the line.</li>
<li>Alloy collects journal, container logs (filtered by label) and files; parse timestamps of legacy files.</li>
<li>LogQL: <code>{selector} |= filter | json | field filter | line_format</code>; then <code>sum by (…) (count_over_time(…[5m]))</code>.</li>
<li>After <code>| json</code>, always aggregate <code>by</code> something.</li>
<li>Check the agent's component health first when logs are missing.</li>
</ul>
${nguon('📘', 'Grafana Loki — LogQL', 'Log queries, metric queries, parsers, label filters', 'https://grafana.com/docs/loki/latest/query/')}
${nguon('📘', 'Grafana Alloy — loki.source.journal', 'Journal fields as __journal_ labels, max_age, path', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.journal/')}
${nguon('📘', 'Grafana Alloy — loki.source.docker', 'Reading container logs through the Docker API', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.docker/')}
${nguon('📘', 'Grafana Alloy — loki.process', 'stage.json, stage.regex, stage.labels, stage.timestamp (format, location)', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/')}
${nguon('📘', 'Loki retention', 'Compactor, retention_period, delete requests', 'https://grafana.com/docs/loki/latest/operations/storage/retention/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-4-logql', title: 'Observability 2.4 — LogQL', sub: 'Every operator and aggregation, with your own app', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Loki, Alloy và Grafana: một kho log chạy được trên laptop</h2>
<p class="lead">Grafana Loki là "giống Prometheus, nhưng cho log": nó chỉ chỉ mục một nhóm nhỏ <strong>nhãn</strong> cho mỗi luồng (<code>job</code>, <code>host</code>, <code>container</code>, <code>unit</code>…) và lưu các dòng ở dạng nén; nội dung được quét lúc truy vấn. Nhờ vậy nó rẻ và dễ vận hành — lựa chọn thường gặp của đội dev, startup, hay đồ án của bạn. Grafana Alloy là agent (thay Promtail, đã hết vòng đời ngày 2/3/2026). Grafana là giao diện. LogQL chuyên sâu — mọi toán tử và phép tổng hợp — nằm ở khoá Observability (bài 2.4); ở đây bạn dựng bộ lab, thu ba loại nguồn khác nhau, và học phần LogQL cần cho việc <em>điều tra</em>.</p>

<h3>Liên tưởng đời thường: kho hàng chuyển phát</h3>
<p>Mỗi kiện hàng được dán một nhãn ngắn — tỉnh gửi, cỡ, màu (nhãn). Kiện cùng nhãn vào chung một thùng (một luồng). Muốn tìm "kiện màu xanh từ Đà Nẵng kêu lạch cạch", bạn đi tới thùng "Đà Nẵng, xanh" rồi lắc từng kiện (bộ lọc dòng). Nếu bạn ghi mã vận đơn lên nhãn, kiện nào cũng cần một thùng riêng và nhà kho sụp — đó là lỗi <em>nhãn có quá nhiều giá trị</em> (cardinality cao).</p>

<h3>Bước 1 — Loki: một tiến trình, tệp trên đĩa</h3>
${ma('yaml', 's15/loki/loki.yaml')}
<ul>
<li><code>schema v13</code> + chỉ mục <code>tsdb</code>, mỗi ngày một tệp chỉ mục — lược đồ đang được khuyến nghị.</li>
<li><code>retention_period: 168h</code> cùng compactor: dòng cũ hơn 7 ngày bị xoá. Không bật <code>retention_enabled</code> thì Loki giữ mọi thứ mãi mãi (bài 16.1).</li>
<li><code>reject_old_samples_max_age: 168h</code>: dòng có mốc giờ cũ hơn một tuần bị từ chối. Nạp tệp log tháng trước thì phải nâng giá trị này.</li>
<li>Hai dòng chỉ có vì lab này, và cả hai là lỗi thật lúc dựng lab: <code>instance_addr: 127.0.0.1</code> (với <code>--network none</code> không có <code>eth0</code>; Loki dừng với "no useable address found for interfaces [eth0 en0 lo]") và <code>disk_full_threshold: 0.97</code> (bài 15.1, thí nghiệm 3).</li>
</ul>

<h3>Bước 2 — Alloy: ba nguồn, một đích</h3>
${ma('alloy', 's15/loki/alloy/config.alloy')}
<p>Cấu hình Alloy là một đồ thị các <strong>thành phần</strong> (component): mỗi cái có tham số và đầu ra, và bạn nối chúng bằng <code>forward_to</code> và các tham chiếu như <code>discovery.docker.lab.targets</code>. Đọc nó như ba đường ống:</p>
<ol>
<li><strong>Container</strong>: <code>discovery.docker</code> hỏi Docker API có những container nào, <em>lọc theo nhãn</em> <code>lgz.c15=1</code> — trên máy dùng chung, đừng bao giờ thu container của mọi người. <code>discovery.relabel</code> biến <code>/lgz-c15-api</code> thành nhãn <code>container</code>. <code>loki.process</code> chỉ cắt JSON để nâng <code>level</code> thành nhãn (ba bốn giá trị: có giới hạn).</li>
<li><strong>Journal</strong>: <code>loki.source.journal</code> đọc journal nhị phân (ở đây gắn chỉ đọc từ máy Linux) và ánh xạ trường journal thành nhãn — <code>_SYSTEMD_UNIT</code> → <code>unit</code>, <code>_HOSTNAME</code> → <code>host</code>, mức ưu tiên → <code>level</code>. Trên máy chủ thật bạn gắn <code>/var/log/journal</code> và <code>/etc/machine-id</code>.</li>
<li><strong>Tệp văn bản cổ</strong>: <code>auth.log</code> của gói log có dòng kiểu <code>Nov 20 09:05:40 web-01 sudo: …</code> — không năm, không múi giờ. Không có <code>stage.timestamp</code> thì mọi dòng bị đóng dấu đúng lúc Alloy đọc (hôm nay), và vụ tấn công trông như đang xảy ra bây giờ. <code>format = "Jan _2 15:04:05"</code> là kiểu bố cục theo giờ mẫu của Go; <code>location</code> nói máy đó đặt giờ Việt Nam; năm thiếu được lấy là năm hiện tại.</li>
</ol>
<p>Hai cái bẫy gặp khi dựng lab. Một, <code>discovery.docker</code> trả về <strong>0 mục tiêu</strong> khi container API dùng chung network namespace với một container khác (<code>network_mode: service:net</code>); cho nó netns riêng (<code>network_mode: none</code>) thì được tìm thấy sau một lần làm mới (mặc định 60 giây). Hai, socket Docker gắn vào Alloy về bản chất là quyền root trên máy — xem Góc hacker.</p>
${lenh('s15/loki', 0)}
<p>Giao diện/API của Alloy ở cổng 12345 cho thấy từng thành phần và nó có khoẻ không — điểm dừng đầu tiên khi "log bị thiếu".</p>

<h3>Bước 3 — trong kho có gì</h3>
${lenh('s15/loki', 1)}
${lenh('s15/loki', 2)}
${lenh('s15/loki', 3)}
<p>Một <strong>luồng</strong> (stream) là một tổ hợp nhãn duy nhất. <code>service_name</code> do chính Loki thêm (Loki 3 suy ra từ <code>container</code>/<code>job</code>), <code>filename</code> do nguồn tệp thêm. Đếm thứ bạn đã tạo:</p>
${lenh('s15/loki', 17)}
<p>Mười luồng, mỗi nhãn tối đa bốn giá trị. Giờ tưởng tượng thêm <code>rid</code> (request id) làm nhãn: mỗi request một luồng, hàng triệu chunk tí hon, và chỉ mục của Loki nổ tung. Luật: <strong>nhãn nói dòng đến từ đâu; dòng nói gì thì để trong dòng</strong>.</p>

<h3>Bước 4 — LogQL cho điều tra</h3>
<p>Tạo lưu lượng trước: 40 đơn hàng, năm lần thanh toán lỗi (cổng thanh toán "sập"), một 404, rồi năm lần đăng nhập SSH thất bại:</p>
${lenh('s15/loki', 4)}
<p><strong>Truy vấn log</strong> trả về dòng. Luôn bắt đầu bằng một <em>bộ chọn luồng</em> trong ngoặc nhọn, rồi tới các bộ lọc tuỳ chọn:</p>
${lenh('s15/loki', 5)}
${lenh('s15/loki', 6)}
${lenh('s15/loki', 7)}
${lenh('s15/loki', 8)}
${lenh('s15/loki', 9)}
${kv([
  ['{container="lgz-c15-api"}', 'Bộ chọn luồng: chỉ nhãn (=, !=, =~, !~). Chọn càng ít luồng càng tốt — nó quyết định phải đọc bao nhiêu.'],
  ['|= "x"  != "x"  |~ "re"', 'Bộ lọc dòng: chứa / không chứa / regex. Rẻ, đặt sớm.'],
  ['| json', 'Cắt dòng JSON; mỗi khoá thành một nhãn tạm (status, path, ms…).'],
  ['| regexp "(?P&lt;ten&gt;…)"', 'Nhóm có tên thành nhãn tạm — cho log văn bản như sshd.'],
  ['| status >= 500', 'Lọc nhãn sau khi cắt; số so sánh như số.'],
  ['| line_format "{{.path}}"', 'Viết lại dòng in ra (template Go) — chỉ giữ thứ cần đọc.'],
])}
<p>Phần <code>{rid="…", time="…"}</code> trong output là các nhãn tạm khác nhau giữa các dòng — tiện: bạn chép thẳng request id sang câu truy vấn tiếp theo (bài 10.4).</p>

<h3>Bước 5 — truy vấn metric: đếm thay vì đọc</h3>
${lenh('s15/loki', 10)}
${lenh('s15/loki', 11)}
<p><code>count_over_time(… [10m])</code> biến các dòng thành một con số cho mỗi luồng; <code>sum by (user)</code> cộng các luồng lại, gom theo một nhãn. "User nào bị thử và bao nhiêu lần" — cùng câu hỏi với <code>awk | sort | uniq -c</code> ở bài 2.3, nhưng trên mọi máy. Mã trạng thái: 72 × 200, 5 × 502, 1 × 404, đã bỏ <code>/healthz</code>. Và một nhóm <strong>không có nhãn nào</strong>, <code>{}</code>: các dòng không có khoá <code>status</code> — ở đây là dòng <code>started</code> của API. Luôn nhìn nhóm rỗng: đó là nơi các dòng mà bộ cắt của bạn không hiểu rơi vào.</p>
${lenh('s15/loki', 12)}
${lenh('s15/loki', 13)}
<div class="pitfall co-tieu-de"><p><strong>Quên "by".</strong> <code>quantile_over_time(0.95, … | json | unwrap ms [5m])</code> trả về <strong>40 chuỗi</strong> — mỗi request một chuỗi — vì <code>| json</code> tạo ra các nhãn (<code>rid</code>, <code>time</code>…) khác nhau ở mỗi dòng, và phép tổng hợp theo khoảng giữ nguyên mọi nhãn. Phân vị 95 của một giá trị là chính giá trị đó: vô dụng. Thêm <code>by (path)</code> (hoặc bỏ nhãn bằng <code>| keep path</code>) là có một câu trả lời: độ trễ p95 của <code>/api/orders</code> trong năm phút.</p></div>
${lenh('s15/loki', 14)}

<h3>Bước 6 — tệp cũ, đúng giờ thật của nó</h3>
${lenh('s15/loki', 15)}
${lenh('s15/loki', 16)}
<p>Dòng ghi <code>09:02:11</code> (giờ Việt Nam) và Loki lưu <code>02:02:11Z</code> ngày 20/11 — stage timestamp đã chạy đúng. Câu thứ hai chứng minh: trong một giờ qua có <strong>0</strong> dòng từ tệp đó, dù Alloy vừa đọc nó vài phút trước. Nếu bạn thấy dòng của một tệp cũ hiện ra "bây giờ", stage timestamp đang thiếu hoặc regex của nó không khớp.</p>

<h3>Bước 7 — Grafana</h3>
${ma('yaml', 's15/loki/grafana/datasources/loki.yaml')}
${lenh('s15/loki', 18)}
${lenh('s15/loki', 19)}
<p>Nguồn dữ liệu được nạp từ tệp (không bấm tay), và cùng câu LogQL chạy qua API của Grafana — đúng thứ Explore và dashboard làm. Trên trình duyệt: <strong>Explore</strong> → nguồn dữ liệu Loki → chế độ <em>Code</em> → dán bất kỳ câu nào trong bài; <em>Logs</em> hiện dòng, đổi sang truy vấn metric để có đồ thị. <strong>Drilldown → Logs</strong> (Grafana 12 trở lên) cho bạn duyệt dịch vụ và nhãn mà không cần viết LogQL — hợp để nhìn lần đầu một hệ thống lạ.</p>

<h3>Góc hacker: agent là một tiến trình có đặc quyền</h3>
<p>Để đọc log container, Alloy gắn <code>/var/run/docker.sock</code>. Ai điều khiển được socket đó thì chạy được một container đặc quyền gắn cả hệ thư mục gốc của máy — tức là root trên máy (một cách leo thang quen thuộc, từng bị dùng trong các chiến dịch đào tiền ảo nhắm vào Docker API để hở). Vậy: gắn chỉ đọc <em>và</em> nhớ rằng chỉ đọc trên một socket không giới hạn được lời gọi API; đừng để giao diện Alloy (cổng 12345) ra mạng — nó lộ cấu hình của bạn và dùng được để gỡ lỗi; ghim phiên bản ảnh agent; và trong Kubernetes, ưu tiên đọc <code>/var/log/pods</code> thay vì socket của container runtime. Lý lẽ y hệt cho Filebeat, Fluent Bit và Vector.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Trưởng nhóm xin "mọi lỗi 5xx của dịch vụ thanh toán hôm qua 14:00–15:00"</strong>: Grafana Explore, đặt khoảng giờ, <code>{service_name="payment"} | json | status >= 500</code>. Xuất dòng ra CSV đính vào ticket.</li>
<li><strong>Đồng nghiệp thêm <code>user_id</code> làm nhãn Loki</strong> "cho lọc nhanh". Sau một ngày, cho họ xem <code>logcli series --analyze-labels</code>.</li>
<li><strong>Chuyển từ Promtail</strong>: <code>alloy convert --source-format=promtail</code> dịch cấu hình cũ; rồi soát lại — nhất là các stage và nhãn.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Bật <code>_demo/s15/loki</code>. Trong Explore, hiện mọi dòng của <code>ssh.service</code> trên <code>lab15</code> 15 phút qua có <code>Accepted</code> hoặc <code>Failed</code>.</li>
<li>Viết một truy vấn metric: số lỗi 5xx mỗi phút của <code>lgz-c15-api</code> trong 30 phút qua, dạng đồ thị.</li>
<li>Tìm p99 của <code>ms</code> theo từng <code>path</code> (bỏ <code>/healthz</code>). Rồi bỏ <code>by</code> và giải thích số chuỗi nhận được.</li>
<li>Chú thích bỏ <code>stage.timestamp</code> trong <code>config.alloy</code>, xoá volume <code>alloy-data</code> (nó nhớ vị trí đọc tệp), khởi động lại Alloy, rồi truy vấn <code>{job="file"}</code> trong một giờ qua.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 dùng <code>|~ "Accepted|Failed"</code> sau bộ chọn; câu 2 là <code>sum(count_over_time({container="lgz-c15-api"} | json | status >= 500 [1m]))</code>; câu 3 ra mỗi path một chuỗi khi có <code>by (path)</code> và mỗi request một chuỗi khi không có; câu 4 cho thấy 163 dòng auth.log bị đóng dấu giờ <em>hôm nay</em> — và bạn giải thích được vì sao điều đó phá hỏng dòng thời gian.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Luồng (stream)', 'Mọi dòng có cùng đúng một bộ nhãn; Loki chỉ mục luồng chứ không chỉ mục từ.'],
  ['Cardinality của nhãn', 'Số giá trị khác nhau; cao (id, IP) = quá nhiều luồng.'],
  ['Grafana Alloy', 'Agent của Grafana (cấu hình = đồ thị thành phần); kế nhiệm Promtail.'],
  ['Stage của loki.process', 'json, regexp, labels, timestamp… chạy trong agent trước khi gửi.'],
  ['Truy vấn log', 'Bộ chọn + lọc/cắt ⇒ dòng.'],
  ['Truy vấn metric', 'count_over_time, rate, sum by, unwrap + quantile_over_time ⇒ con số.'],
  ['logcli', 'Công cụ dòng lệnh của Loki: labels, series, query, instant-query.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Loki chỉ chỉ mục nhãn; giữ nhãn ít và có giới hạn, nội dung để trong dòng.</li>
<li>Alloy thu journal, log container (lọc theo nhãn) và tệp; tệp cổ phải cắt mốc giờ.</li>
<li>LogQL: <code>{bộ chọn} |= lọc | json | lọc trường | line_format</code>; rồi <code>sum by (…) (count_over_time(…[5m]))</code>.</li>
<li>Sau <code>| json</code>, luôn tổng hợp <code>by</code> một thứ gì đó.</li>
<li>Log bị thiếu: xem tình trạng thành phần của agent trước.</li>
</ul>
${nguon('📘', 'Grafana Loki — LogQL', 'Truy vấn log, truy vấn metric, parser, lọc nhãn', 'https://grafana.com/docs/loki/latest/query/')}
${nguon('📘', 'Grafana Alloy — loki.source.journal', 'Trường journal thành nhãn __journal_, max_age, path', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.journal/')}
${nguon('📘', 'Grafana Alloy — loki.source.docker', 'Đọc log container qua Docker API', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.docker/')}
${nguon('📘', 'Grafana Alloy — loki.process', 'stage.json, stage.regex, stage.labels, stage.timestamp (format, location)', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/')}
${nguon('📘', 'Loki retention', 'Compactor, retention_period, yêu cầu xoá', 'https://grafana.com/docs/loki/latest/operations/storage/retention/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-4-logql', title: 'Observability 2.4 — LogQL', sub: 'Mọi toán tử và phép tổng hợp, trên chính ứng dụng của bạn', cta: 'Mở bài' })}
</div>
`,
};
