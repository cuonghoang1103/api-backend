/**
 * 15.3 — Bộ lab 2: Elasticsearch + Kibana + Filebeat 9.5.7 (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s15/elk'], OUT['s15/elk2'] — ES/Kibana/Filebeat 9.5.7 trong một netns --network none; KQL gõ vào Kibana Discover THẬT
 * (Chrome headless, ./_demo/s15/cong-cu/kql.mjs). Dữ liệu: web/access.log + linux/auth.log của gói log mẫu (ngày 20/11/2026).
 * Chạy lại: bash _demo/s15/chay-s15.bash <thư mục> ⇒ số đếm tất định (4268, 160, 137, 423, 422, 74/45/41, 137/332); RAM đổi chút.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Lab stack 2: Elasticsearch + Kibana + Filebeat (or OpenSearch) — ingest nginx and auth logs, Discover, KQL|||Bộ lab 2: Elasticsearch + Kibana + Filebeat (hoặc OpenSearch) — nạp log nginx và auth, Discover, KQL',
  slug: 'log-15-3-elk',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng Elasticsearch + Kibana + Filebeat 9.5.7 bằng Docker Compose (heap cố định, xác thực bật), nạp access log nginx và auth.log bằng module Filebeat thành trường ECS, tìm bằng KQL trong Discover thật và ES|QL. Ba bẫy có thật: auth.log chép về máy khác lệch 7 giờ, user.name dính dấu cách nên tìm "git" ra 0, trường không tồn tại cũng ra 0 mà không báo lỗi. So sánh Loki và ELK; OpenSearch; vụ "Meow" 2020 xoá gần 4.000 CSDL hở.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Elasticsearch, Kibana and Filebeat: index every field, then ask anything</h2>
<p class="lead">Loki (lesson 15.2) indexes a few labels and greps the rest. The Elastic stack makes the opposite bet: it <strong>parses every line into fields and indexes all of them</strong>, so "every 5xx from this /24 network with a python user agent" comes back in milliseconds — at the cost of RAM, disk and care. This is what most SOC teams and many enterprise customers of outsourcing companies run (often as "ELK" or its fork OpenSearch). You will build it, load two familiar logs from the course log pack, and search them with KQL in the real Kibana Discover — and hit three traps that cost real teams hours.</p>

<h3>The everyday picture: a library card catalogue</h3>
<p>Loki is a warehouse with labelled shelves: you go to the shelf "nginx, web-01" and leaf through the boxes. Elasticsearch is a library where a librarian has written a card for every author, title, year and keyword of every book: finding "books by X after 2019 about Y" is instant, but somebody had to write all those cards (ingest pipelines), and the card catalogue takes more room than you expect (the index). If a card is written wrong — a typo in the author's name — the book is effectively lost to searches. Keep that last sentence in mind.</p>

<h3>Three parts, one job each</h3>
${kv([
  ['Filebeat', 'Agent on the machine: tails files, ships events. A <em>module</em> (nginx, system, mysql…) = input paths + an ingest pipeline that cuts lines into fields.'],
  ['Elasticsearch', 'The store and search engine (Apache Lucene inside). Data lives in indices / data streams; every field gets a type (keyword, long, ip, date…).'],
  ['Kibana', 'The web interface: Discover (search), Dashboards, Alerting, Dev Tools. Speaks KQL, Lucene query syntax, and ES|QL.'],
  ['ECS', 'Elastic Common Schema: agreed field names — <code>source.ip</code>, <code>url.original</code>, <code>http.response.status_code</code>, <code>user.name</code>, <code>event.dataset</code>. Lesson 10.8.'],
])}
<p>A short history so the names make sense: Elasticsearch appeared in 2010; Logstash and Kibana joined, hence "ELK"; lightweight Beats (Filebeat) came later and mostly replaced Logstash for collection. In January 2021 Elastic moved the code from Apache 2.0 to SSPL/Elastic License; AWS forked the last Apache version as <strong>OpenSearch</strong> (now under the Linux Foundation). In 2024 Elastic added AGPL as a third option. For you: Kibana ≈ OpenSearch Dashboards, Filebeat works with both up to a point, KQL ≈ DQL. Today Elastic also pushes <em>Elastic Agent + Fleet</em> instead of standalone Beats; Filebeat remains supported and is the simplest to learn.</p>

<h3>Step 1 — the Compose file (read the comments)</h3>
${ma('yaml', 's15/elk/compose.yaml')}
<ul>
<li><strong>Heap fixed at 1 GB</strong> (<code>-Xms1g -Xmx1g</code>): without it Elasticsearch sizes the heap from the machine's RAM. On a 16 GB laptop running Docker Desktop that can take the whole VM.</li>
<li><strong>Security stays on</strong> (user <code>elastic</code>, password). Only TLS on HTTP is off, because everything talks over 127.0.0.1 inside one network namespace. Never expose port 9200 like this — see the hacker's corner.</li>
<li><strong>vm.max_map_count</strong>: Elasticsearch refuses to start in production mode if the kernel limit is below 262144. On this machine it is 1048576 (Fedora default); on Ubuntu run <code>sudo sysctl -w vm.max_map_count=262144</code>; on Docker Desktop/WSL2 run it inside the WSL VM.</li>
<li><strong>Disk watermarks</strong>: by default Elasticsearch stops allocating new shards at 85% disk, moves shards away at 90%, and at 95% (flood stage) makes indices <em>read-only</em> — ingest silently stops. The lab disk was 91% full, so the lab turns the check off. On a real server, you fix the disk instead.</li>
</ul>
${ma('yaml', 's15/elk/filebeat.yml')}
<p>After <code>docker compose up -d net es</code>, set the password of the built-in <code>kibana_system</code> user (Kibana is not allowed to log in as <code>elastic</code>), then start Kibana and Filebeat. The exact commands are in <code>_demo/s15/chay-s15.bash</code>.</p>
${lenh('s15/elk', 0)}
${lenh('s15/elk', 1)}
<p>About 3 GB of RAM for a cluster that holds 1.5 MB of logs. That fixed cost is the first thing to put in any "Loki or ELK?" discussion.</p>

<h3>Step 2 — what a module turns a line into</h3>
${lenh('s15/elk', 2)}
${lenh('s15/elk', 3)}
<p>4,268 events = 4,105 nginx lines + 163 auth lines. The module wrote them to a <strong>data stream</strong> (<code>.ds-filebeat-9.5.7-…</code>; you search the alias <code>filebeat-*</code>). One access-log line became typed fields: <code>source.ip</code> is an IP (so CIDR search works), <code>http.response.status_code</code> a number (so <code>&gt;= 500</code> works), <code>user_agent.name</code> was derived from the raw string. <code>@timestamp</code> is 16:57:07Z because the line itself says <code>23:57:07 +0700</code> — nginx writes the zone, so this one is right. GeoIP stayed empty: the documentation IP ranges (RFC 5737) have no location, and this lab has no internet to download the GeoIP database.</p>

<h3>Step 3 — trap 1: seven hours off</h3>
${lenh('s15/elk', 4)}
${lenh('s15/elk', 5)}
${lenh('s15/elk', 6)}
<p>Read the three outputs side by side. The server line says <strong>02:14:09</strong>. Elasticsearch stored <strong>02:14:09Z</strong> (UTC) with <code>event.timezone: +00:00</code>. Kibana, showing times in the browser's zone (UTC+7), displays <strong>09:14:09</strong>. An investigator writing a timeline from Kibana would put the brute force seven hours late.</p>
<p>Why: classic syslog lines (<code>Nov 20 02:14:09</code>) have no year and no time zone (lesson 1.5). The system module's <code>add_locale</code> processor stamps the zone <em>of the machine running Filebeat</em>. On the real server that would be correct. Here the file was copied to another machine — a container in UTC — exactly what you do when a customer sends you <code>auth.log</code> by email. (The <code>var.timezone</code> line in <code>filebeat.yml</code> above does nothing: that variable does not exist in this module, and Filebeat does not complain.) The fix is to tell Filebeat the zone of the source:</p>
${ma('yaml', 's15/elk/tz.yaml')}
${lenh('s15/elk', 7)}
${lenh('s15/elk', 8)}
${lenh('s15/elk', 9)}
<p>Now <code>02:14:09.000+07:00</code>, <code>event.timezone: +07:00</code>, and Kibana shows 02:14 like the server. Rule: <strong>before trusting any timeline, compare one raw line with what the tool shows</strong>.</p>

<h3>Step 4 — KQL in Discover</h3>
<p>KQL (Kibana Query Language) is what you type in the Discover search bar. Each query below was typed into the real Discover page (Chrome headless), over the day 20/11 in Vietnam time:</p>
${lenh('s15/elk', 10)}
${lenh('s15/elk', 11)}
${lenh('s15/elk', 12)}
${lenh('s15/elk', 13)}
<table>
<thead><tr><th>KQL</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>field : value</code></td><td>Field equals value (text fields: matches words)</td></tr>
<tr><td><code>http.response.status_code &gt;= 500</code></td><td>Range on a number or date field</td></tr>
<tr><td><code>url.original : /api/v1/auth/*</code></td><td>Wildcard on a keyword field</td></tr>
<tr><td><code>source.ip : "203.0.113.0/24"</code></td><td>CIDR — works because the field is type <code>ip</code></td></tr>
<tr><td><code>and</code>, <code>or</code>, <code>not</code>, <code>( … )</code></td><td>Combine; <code>not</code> binds to the next term</td></tr>
<tr><td><code>user.name : *</code></td><td>Field exists</td></tr>
</tbody>
</table>
<p>What the four results say about 20/11: 137 server errors, all <code>502</code> on <code>/api/v1/feed</code> around 14:08 (the incident of the log pack); 423 non-200 answers on the auth endpoints; 422 requests from <code>203.0.113.0/24</code> — exactly the 422 requests with a <code>python-requests</code> user agent, which is your scanner. You found it with two queries and no grep.</p>

<h3>Step 5 — trap 2 and 3: zero results that are lies</h3>
${lenh('s15/elk', 14)}
${lenh('s15/elk', 15)}
<p>"No results" can mean three different things: there really is nothing (first query: every 5xx is under <code>/api/</code>), the field does not exist (<code>status</code> — the field is <code>http.response.status_code</code>; KQL does not warn you), or the data was parsed differently from what you think:</p>
${lenh('s15/elk2', 0)}
${lenh('s15/elk2', 1)}
${lenh('s15/elk2', 2)}
<p><code>LENGTH(user.name)</code> is 5 for "test": the pipeline of this module version keeps the space after "invalid user". So <code>user.name : "git"</code> finds 0 of 20 attempts, while <code>" git"</code> finds them. A detection rule "alert when someone tries user git" would never fire. Valid users (<code>root</code>, length 4) are fine. The lesson is not about this specific bug (it may be fixed when you read this), it is the habit: <strong>check a field's values (a terms aggregation or <code>STATS … BY</code>) before writing a rule on it</strong>.</p>
${lenh('s15/elk2', 3)}
${lenh('s15/elk2', 4)}
<p>And you cannot search everything: <code>event.original</code> (the raw line) is stored but <code>"index": false</code>, so a query on it fails. Search parsed fields, read the raw one.</p>

<h3>Step 6 — ES|QL: counting like awk, on the server</h3>
${lenh('s15/elk', 16)}
${lenh('s15/elk', 17)}
<p>ES|QL (Elasticsearch 8.11+, piped like a shell) is the "awk | sort | uniq -c" of the stack (lesson 2.3): three IPs made 160 failed SSH logins (74 + 45 + 41), and all 137 server errors fell in one hour bucket, 07:00Z = 14:00 in Vietnam, out of 332 requests. In Kibana you type it in Discover (switch to ES|QL) or Dev Tools.</p>

<h3>Loki or ELK? (and OpenSearch)</h3>
<table>
<thead><tr><th></th><th>Loki + Alloy + Grafana</th><th>Elasticsearch + Filebeat + Kibana</th></tr></thead>
<tbody>
<tr><td>Indexes</td><td>Only labels; content scanned at query time</td><td>Every parsed field</td></tr>
<tr><td>Lab RAM (this chapter)</td><td>a few hundred MB</td><td>~3 GB (heap 1 GB fixed)</td></tr>
<tr><td>Disk</td><td>Small, compressed chunks; object storage friendly</td><td>Larger (index + doc values); plan ILM</td></tr>
<tr><td>Fast at</td><td>"Everything from service X in this hour", counting by label</td><td>Needle-in-haystack across all fields, aggregations, security analytics</td></tr>
<tr><td>Parsing</td><td>Optional, at query time (<code>| json</code>, <code>| regexp</code>)</td><td>At ingest (pipelines); wrong parse = wrong data</td></tr>
<tr><td>Free tier limits</td><td>Open source (AGPL)</td><td>Basic license: alerting can only write to index/server log (lesson 15.5)</td></tr>
<tr><td>Typical owner</td><td>Dev/SRE teams, Kubernetes</td><td>SOC/SIEM, enterprise, search-heavy products</td></tr>
</tbody>
</table>
<p>For your own project and a small company: Loki. If the customer already runs Elastic/OpenSearch (common in banks and Japanese enterprise projects), learn their index names and fields on day one. Choosing a SIEM is covered in the Blue Team course.</p>

<div class="pitfall co-tieu-de"><p><strong>"Disable security, it is only internal."</strong> The default "only on localhost" becomes "on 0.0.0.0" the first time someone adds <code>ports: ["9200:9200"]</code> to reach it from a laptop, and many cloud VMs have a public IP. Keep authentication on even in the lab, bind to 127.0.0.1, and put Kibana behind your SSO/VPN.</p></div>

<h3>Hacker's corner: the "Meow" attack (2020)</h3>
<p>In July 2020 researcher Bob Diachenko found a misconfigured database of the Hong Kong VPN provider UFO VPN; after it was secured it resurfaced at another IP and was wiped — every record overwritten with the word "meow" and random numbers, no ransom note. Within days automated bots had destroyed almost 4,000 exposed databases; more than 97% of the hits were Elasticsearch and MongoDB (ESET WeLiveSecurity, Infosecurity Magazine). Lessons for a log stack: an Elasticsearch on the internet without authentication is found by scanners within hours; your <em>evidence store</em> is also the attacker's target (wipe it and the investigation is over); and logs about logins often contain personal data — exposing them is itself a breach to report. Defence: authentication + TLS, never a public 9200/5601, snapshots to another place (lesson 16.4), and an alert when ingest suddenly stops (lesson 15.5).</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, week 2:</strong> "Kibana says the job failed at 09:14 but the server log says 02:14." You now know to check <code>event.timezone</code> and the Filebeat host's zone before arguing.</li>
<li><strong>A customer sends a zip of logs</strong> from their server: load them with Filebeat (correct <code>TZ</code>) into your lab stack instead of grepping 20 files; keep the original zip untouched with its hash (lesson 16.4).</li>
<li><strong>A teammate's rule never fires:</strong> run a terms aggregation on the field; a space, a capital letter or a <code>.keyword</code> sub-field is usually why.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Bring the stack up from <code>_demo/s15/elk</code>, load the log pack, and reproduce trap 1: find the raw line of the last failed SSH attempt and the time Kibana shows; then fix it with <code>tz.yaml</code> and reload (remember to delete the data stream <em>and</em> the Filebeat registry volume, or nothing is re-read).</li>
<li>Write KQL for: (a) every <code>POST</code> to <code>/api/v1/auth/login</code> that returned 200 from <code>203.0.113.66</code>; (b) all failed SSH logins for user <code>root</code>.</li>
<li>With ES|QL: the top 5 URLs by number of 404 responses on 20/11.</li>
<li>Explain in two sentences why <code>status : 500</code> returned 0 and how you would notice that in a real investigation.</li>
</ol>
<p><strong>Done when:</strong> 1 shows 02:14:09 in both places after the fix; 2(a) returns exactly one event (02:41:07, the successful login after the brute force), 2(b) returns the 23 <code>root</code> attempts (<code>user.name : "root" and system.auth.ssh.event : "Failed"</code>); 3 is a table with <code>STATS n = COUNT(*) BY url.original | SORT n DESC | LIMIT 5</code> after <code>WHERE http.response.status_code == 404</code>; 4 mentions that KQL does not validate field names and that you check the field list in the Discover sidebar first.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Filebeat module', 'Ready-made input + ingest pipeline for a known log format (nginx, system, mysql…).'],
  ['Ingest pipeline', 'Processors run inside Elasticsearch before indexing: grok, date, geoip, user_agent.'],
  ['Data stream', 'Append-only series of hidden indices behind one name (filebeat-9.5.7), rolled over by ILM.'],
  ['ECS', 'Elastic Common Schema — standard field names so queries and rules work across sources.'],
  ['KQL', 'Kibana Query Language in the Discover bar: field : value, ranges, wildcards, and/or/not.'],
  ['ES|QL', 'Piped query language (FROM | WHERE | STATS | SORT) for counting and grouping.'],
  ['Disk watermark', '85% / 90% / 95% thresholds; at flood stage indices become read-only.'],
  ['OpenSearch', 'AWS-led fork (2021) of Elasticsearch 7.10 and Kibana; DQL ≈ KQL.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>ELK parses and indexes every field: powerful searches, ~3 GB RAM for the smallest lab.</li>
<li>Fix the heap, keep authentication, watch the disk (95% ⇒ read-only).</li>
<li>Logs without a time zone get the zone of the Filebeat machine: compare one raw line with Kibana.</li>
<li>Zero results can be a typo in a field name or a parsing quirk: check field values before writing rules.</li>
<li>KQL to find, ES|QL to count.</li>
</ul>
${nguon('📘', 'Filebeat — system module', 'auth/syslog filesets, add_locale and time zones', 'https://www.elastic.co/docs/reference/beats/filebeat/filebeat-module-system')}
${nguon('📘', 'Kibana Query Language (KQL)', 'Syntax: fields, ranges, wildcards, nested', 'https://www.elastic.co/docs/explore-analyze/query-filter/languages/kql')}
${nguon('📘', 'ES|QL reference', 'FROM, WHERE, EVAL, STATS … BY, DATE_TRUNC', 'https://www.elastic.co/docs/reference/query-languages/esql')}
${nguon('📘', 'Elasticsearch — Minimal security setup', 'Why authentication should never be off', 'https://www.elastic.co/guide/en/elasticsearch/reference/current/security-minimal-setup.html')}
${nguon('🛡️', 'WeLiveSecurity — Almost 4,000 databases wiped in Meow attacks (07/2020)', 'More than 97% Elasticsearch and MongoDB', 'https://www.welivesecurity.com/2020/07/27/almost-4000-databases-wiped-meow-attacks/')}
${nguon('🛡️', 'Infosecurity Magazine — Exposed databases wiped by "Meow" attacker', 'Discovery by Bob Diachenko, UFO VPN', 'https://www.infosecurity-magazine.com/news/1000-exposed-databases-wiped-meow')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-3-1-chon', title: 'Blue Team 3.1 — Choosing a SIEM', sub: 'Elastic, OpenSearch, Wazuh, Splunk for a small team', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Elasticsearch, Kibana và Filebeat: chỉ mục mọi trường, rồi hỏi gì cũng được</h2>
<p class="lead">Loki (bài 15.2) chỉ mục vài nhãn và grep phần còn lại. Bộ Elastic đặt cược ngược lại: nó <strong>cắt mọi dòng thành trường và chỉ mục tất cả</strong>, nên câu "mọi lỗi 5xx từ dải /24 này với user agent python" trả về trong mili giây — đổi lại tốn RAM, đĩa và sự cẩn thận. Đây là thứ phần lớn đội SOC và nhiều khách hàng doanh nghiệp của công ty outsourcing đang chạy (hay gọi là "ELK", hoặc bản tách OpenSearch). Bạn sẽ dựng nó, nạp hai log quen thuộc từ gói log của khoá, tìm bằng KQL trong Kibana Discover thật — và vấp ba cái bẫy từng làm nhiều đội mất hàng giờ.</p>

<h3>Liên tưởng đời thường: tủ phiếu thư viện</h3>
<p>Loki là nhà kho có kệ dán nhãn: bạn đi tới kệ "nginx, web-01" rồi lật từng thùng. Elasticsearch là thư viện có thủ thư viết sẵn một phiếu cho mọi tác giả, tên sách, năm, từ khoá của mọi cuốn: tìm "sách của X sau 2019 về Y" là tức thì, nhưng ai đó phải viết hết đống phiếu (ingest pipeline), và tủ phiếu chiếm chỗ hơn bạn tưởng (chỉ mục). Nếu một phiếu viết sai — gõ nhầm tên tác giả — cuốn sách coi như biến mất khỏi mọi lần tìm. Nhớ câu cuối này.</p>

<h3>Ba phần, mỗi phần một việc</h3>
${kv([
  ['Filebeat', 'Agent trên máy: đọc đuôi tệp, gửi sự kiện. Một <em>module</em> (nginx, system, mysql…) = đường dẫn đầu vào + một ingest pipeline cắt dòng thành trường.'],
  ['Elasticsearch', 'Kho và máy tìm kiếm (bên trong là Apache Lucene). Dữ liệu nằm trong index / data stream; mỗi trường có kiểu (keyword, long, ip, date…).'],
  ['Kibana', 'Giao diện web: Discover (tìm), Dashboards, Alerting, Dev Tools. Nói KQL, cú pháp Lucene, và ES|QL.'],
  ['ECS', 'Elastic Common Schema: tên trường thống nhất — <code>source.ip</code>, <code>url.original</code>, <code>http.response.status_code</code>, <code>user.name</code>, <code>event.dataset</code>. Bài 10.8.'],
])}
<p>Chút lịch sử để hiểu các cái tên: Elasticsearch ra đời năm 2010; Logstash và Kibana nhập hội, thành "ELK"; Beats nhẹ (Filebeat) đến sau và gần như thay Logstash ở khâu thu. Tháng 1/2021 Elastic chuyển mã từ Apache 2.0 sang SSPL/Elastic License; AWS tách bản Apache cuối cùng thành <strong>OpenSearch</strong> (nay thuộc Linux Foundation). Năm 2024 Elastic thêm AGPL làm lựa chọn thứ ba. Với bạn: Kibana ≈ OpenSearch Dashboards, Filebeat dùng được với cả hai tới một mức, KQL ≈ DQL. Hiện Elastic cũng đẩy <em>Elastic Agent + Fleet</em> thay cho Beats đứng riêng; Filebeat vẫn được hỗ trợ và dễ học nhất.</p>

<h3>Bước 1 — tệp Compose (đọc chú thích)</h3>
${ma('yaml', 's15/elk/compose.yaml')}
<ul>
<li><strong>Heap cố định 1 GB</strong> (<code>-Xms1g -Xmx1g</code>): không đặt thì Elasticsearch tự tính heap theo RAM máy. Trên laptop 16 GB chạy Docker Desktop, nó có thể nuốt cả máy ảo.</li>
<li><strong>Vẫn bật xác thực</strong> (người dùng <code>elastic</code>, mật khẩu). Chỉ tắt TLS trên HTTP vì mọi thứ nói chuyện qua 127.0.0.1 trong một netns. Đừng bao giờ mở cổng 9200 kiểu này — xem Góc hacker.</li>
<li><strong>vm.max_map_count</strong>: Elasticsearch từ chối khởi động ở chế độ production nếu giới hạn của nhân dưới 262144. Máy này là 1048576 (mặc định Fedora); trên Ubuntu chạy <code>sudo sysctl -w vm.max_map_count=262144</code>; trên Docker Desktop/WSL2 thì chạy bên trong máy ảo WSL.</li>
<li><strong>Ngưỡng đĩa (watermark)</strong>: mặc định Elasticsearch ngừng cấp shard mới khi đĩa 85%, dời shard đi ở 90%, và ở 95% (flood stage) đặt chỉ mục thành <em>chỉ đọc</em> — việc nạp lặng lẽ dừng. Đĩa máy lab đã đầy 91% nên lab tắt kiểm tra này. Trên máy chủ thật, bạn dọn đĩa chứ không tắt.</li>
</ul>
${ma('yaml', 's15/elk/filebeat.yml')}
<p>Sau <code>docker compose up -d net es</code>, đặt mật khẩu cho người dùng dựng sẵn <code>kibana_system</code> (Kibana không được đăng nhập bằng <code>elastic</code>), rồi bật Kibana và Filebeat. Lệnh đầy đủ ở <code>_demo/s15/chay-s15.bash</code>.</p>
${lenh('s15/elk', 0)}
${lenh('s15/elk', 1)}
<p>Khoảng 3 GB RAM cho một cụm chứa 1,5 MB log. Chi phí cố định này là thứ đầu tiên phải đặt lên bàn trong mọi cuộc bàn "Loki hay ELK?".</p>

<h3>Bước 2 — một module biến một dòng thành gì</h3>
${lenh('s15/elk', 2)}
${lenh('s15/elk', 3)}
<p>4.268 sự kiện = 4.105 dòng nginx + 163 dòng auth. Module ghi vào một <strong>data stream</strong> (<code>.ds-filebeat-9.5.7-…</code>; bạn tìm qua tên gọi chung <code>filebeat-*</code>). Một dòng access log thành các trường có kiểu: <code>source.ip</code> là IP (nên tìm theo CIDR được), <code>http.response.status_code</code> là số (nên <code>&gt;= 500</code> được), <code>user_agent.name</code> được suy ra từ chuỗi gốc. <code>@timestamp</code> là 16:57:07Z vì chính dòng log ghi <code>23:57:07 +0700</code> — nginx ghi múi giờ, nên cái này đúng. GeoIP để trống: dải IP dành cho tài liệu (RFC 5737) không có vị trí, và lab không có Internet để tải cơ sở dữ liệu GeoIP.</p>

<h3>Bước 3 — bẫy 1: lệch bảy tiếng</h3>
${lenh('s15/elk', 4)}
${lenh('s15/elk', 5)}
${lenh('s15/elk', 6)}
<p>Đặt ba output cạnh nhau. Dòng trên máy chủ ghi <strong>02:14:09</strong>. Elasticsearch lưu <strong>02:14:09Z</strong> (UTC) với <code>event.timezone: +00:00</code>. Kibana hiện giờ theo múi của trình duyệt (UTC+7) nên ra <strong>09:14:09</strong>. Người điều tra dựng dòng thời gian từ Kibana sẽ đặt vụ dò mật khẩu muộn bảy tiếng.</p>
<p>Vì sao: dòng syslog cổ (<code>Nov 20 02:14:09</code>) không có năm, không có múi giờ (bài 1.5). Processor <code>add_locale</code> của module system đóng dấu múi giờ <em>của máy đang chạy Filebeat</em>. Trên chính máy chủ thì đúng. Ở đây tệp đã bị chép sang máy khác — một container chạy UTC — đúng như khi khách hàng gửi <code>auth.log</code> qua email cho bạn. (Dòng <code>var.timezone</code> trong <code>filebeat.yml</code> ở trên không có tác dụng gì: module này không có biến đó, và Filebeat không hề báo.) Cách sửa là nói cho Filebeat múi giờ của nguồn:</p>
${ma('yaml', 's15/elk/tz.yaml')}
${lenh('s15/elk', 7)}
${lenh('s15/elk', 8)}
${lenh('s15/elk', 9)}
<p>Giờ là <code>02:14:09.000+07:00</code>, <code>event.timezone: +07:00</code>, và Kibana hiện 02:14 giống máy chủ. Luật: <strong>trước khi tin một dòng thời gian, so một dòng gốc với thứ công cụ hiển thị</strong>.</p>

<h3>Bước 4 — KQL trong Discover</h3>
<p>KQL (Kibana Query Language) là thứ bạn gõ vào ô tìm của Discover. Mỗi câu dưới đây được gõ vào trang Discover thật (Chrome headless), trên ngày 20/11 theo giờ Việt Nam:</p>
${lenh('s15/elk', 10)}
${lenh('s15/elk', 11)}
${lenh('s15/elk', 12)}
${lenh('s15/elk', 13)}
<table>
<thead><tr><th>KQL</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>trường : giá-trị</code></td><td>Trường bằng giá trị (trường text: khớp theo từ)</td></tr>
<tr><td><code>http.response.status_code &gt;= 500</code></td><td>Khoảng trên trường số hoặc ngày</td></tr>
<tr><td><code>url.original : /api/v1/auth/*</code></td><td>Ký tự đại diện trên trường keyword</td></tr>
<tr><td><code>source.ip : "203.0.113.0/24"</code></td><td>CIDR — được vì trường có kiểu <code>ip</code></td></tr>
<tr><td><code>and</code>, <code>or</code>, <code>not</code>, <code>( … )</code></td><td>Ghép điều kiện; <code>not</code> gắn với vế ngay sau</td></tr>
<tr><td><code>user.name : *</code></td><td>Trường có tồn tại</td></tr>
</tbody>
</table>
<p>Bốn kết quả nói gì về ngày 20/11: 137 lỗi máy chủ, toàn <code>502</code> ở <code>/api/v1/feed</code> quanh 14:08 (sự cố của gói log); 423 phản hồi khác 200 ở các endpoint đăng nhập; 422 request từ <code>203.0.113.0/24</code> — đúng bằng 422 request có user agent <code>python-requests</code>, chính là kẻ dò của bạn. Hai câu truy vấn, không một lệnh grep.</p>

<h3>Bước 5 — bẫy 2 và 3: không kết quả mà là nói dối</h3>
${lenh('s15/elk', 14)}
${lenh('s15/elk', 15)}
<p>"No results" có thể là ba chuyện khác nhau: thật sự không có gì (câu đầu: mọi 5xx đều nằm dưới <code>/api/</code>), trường không tồn tại (<code>status</code> — trường thật là <code>http.response.status_code</code>; KQL không cảnh báo), hoặc dữ liệu bị cắt khác với bạn nghĩ:</p>
${lenh('s15/elk2', 0)}
${lenh('s15/elk2', 1)}
${lenh('s15/elk2', 2)}
<p><code>LENGTH(user.name)</code> của "test" là 5: pipeline của phiên bản module này giữ lại dấu cách sau "invalid user". Vì vậy <code>user.name : "git"</code> tìm được 0 trên 20 lần thử, còn <code>" git"</code> thì ra. Một luật phát hiện "báo khi có người thử user git" sẽ không bao giờ kêu. Người dùng có thật (<code>root</code>, dài 4) thì không sao. Bài học không nằm ở lỗi cụ thể này (có thể đã được sửa khi bạn đọc), mà ở thói quen: <strong>xem các giá trị của một trường (terms aggregation hoặc <code>STATS … BY</code>) trước khi viết luật trên nó</strong>.</p>
${lenh('s15/elk2', 3)}
${lenh('s15/elk2', 4)}
<p>Và không phải trường nào cũng tìm được: <code>event.original</code> (dòng gốc) được lưu nhưng <code>"index": false</code>, nên truy vấn trên nó báo lỗi. Tìm trên trường đã cắt, đọc ở trường gốc.</p>

<h3>Bước 6 — ES|QL: đếm như awk, ngay trên máy chủ</h3>
${lenh('s15/elk', 16)}
${lenh('s15/elk', 17)}
<p>ES|QL (Elasticsearch 8.11 trở lên, nối ống như shell) là "awk | sort | uniq -c" của bộ này (bài 2.3): ba IP gây ra 160 lần đăng nhập SSH thất bại (74 + 45 + 41), và cả 137 lỗi máy chủ rơi vào một khung giờ, 07:00Z = 14:00 giờ Việt Nam, trên tổng 332 request. Trong Kibana bạn gõ nó ở Discover (chuyển sang ES|QL) hoặc Dev Tools.</p>

<h3>Loki hay ELK? (và OpenSearch)</h3>
<table>
<thead><tr><th></th><th>Loki + Alloy + Grafana</th><th>Elasticsearch + Filebeat + Kibana</th></tr></thead>
<tbody>
<tr><td>Chỉ mục</td><td>Chỉ nhãn; nội dung quét lúc truy vấn</td><td>Mọi trường đã cắt</td></tr>
<tr><td>RAM lab (chương này)</td><td>vài trăm MB</td><td>~3 GB (heap cố định 1 GB)</td></tr>
<tr><td>Đĩa</td><td>Nhỏ, chunk nén; hợp object storage</td><td>Lớn hơn (chỉ mục + doc values); cần ILM</td></tr>
<tr><td>Nhanh ở</td><td>"Mọi thứ của dịch vụ X trong giờ này", đếm theo nhãn</td><td>Mò kim đáy bể trên mọi trường, tổng hợp, phân tích bảo mật</td></tr>
<tr><td>Cắt trường</td><td>Tuỳ chọn, lúc truy vấn (<code>| json</code>, <code>| regexp</code>)</td><td>Lúc nạp (pipeline); cắt sai = dữ liệu sai</td></tr>
<tr><td>Giới hạn bản miễn phí</td><td>Mã nguồn mở (AGPL)</td><td>Giấy phép Basic: cảnh báo chỉ ghi được vào index/server log (bài 15.5)</td></tr>
<tr><td>Ai hay dùng</td><td>Đội dev/SRE, Kubernetes</td><td>SOC/SIEM, doanh nghiệp, sản phẩm nặng về tìm kiếm</td></tr>
</tbody>
</table>
<p>Cho dự án của bạn và công ty nhỏ: Loki. Nếu khách hàng đã chạy Elastic/OpenSearch (hay gặp ở ngân hàng và dự án doanh nghiệp Nhật), ngày đầu hãy học tên index và tên trường của họ. Chọn SIEM có ở khoá Blue Team.</p>

<div class="pitfall co-tieu-de"><p><strong>"Tắt bảo mật đi, chỉ dùng nội bộ thôi."</strong> "Chỉ trên localhost" sẽ thành "trên 0.0.0.0" ngay lần đầu có người thêm <code>ports: ["9200:9200"]</code> để vào từ laptop, và nhiều máy ảo cloud có IP công khai. Giữ xác thực kể cả trong lab, chỉ nghe 127.0.0.1, và đặt Kibana sau SSO/VPN của bạn.</p></div>

<h3>Góc hacker: vụ "Meow" (2020)</h3>
<p>Tháng 7/2020, nhà nghiên cứu Bob Diachenko phát hiện một cơ sở dữ liệu cấu hình sai của nhà cung cấp VPN Hồng Kông UFO VPN; sau khi được khoá lại, nó hiện ra ở một IP khác và bị xoá sạch — mọi bản ghi bị ghi đè bằng chữ "meow" và một chuỗi số ngẫu nhiên, không có thư đòi tiền. Chỉ trong vài ngày, bot tự động đã phá gần 4.000 cơ sở dữ liệu để hở; hơn 97% là Elasticsearch và MongoDB (ESET WeLiveSecurity, Infosecurity Magazine). Bài học cho hệ gom log: một Elasticsearch trên Internet không xác thực sẽ bị máy quét tìm ra trong vài giờ; <em>kho bằng chứng</em> của bạn cũng là mục tiêu của kẻ tấn công (xoá nó là cuộc điều tra chấm dứt); và log đăng nhập thường chứa dữ liệu cá nhân — để lộ nó tự thân đã là một vụ lộ dữ liệu phải báo cáo. Phòng: xác thực + TLS, không bao giờ để 9200/5601 ra Internet, snapshot sang nơi khác (bài 16.4), và cảnh báo khi việc nạp đột ngột dừng (bài 15.5).</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, tuần thứ hai:</strong> "Kibana bảo job lỗi lúc 09:14 mà log máy chủ ghi 02:14." Giờ bạn biết phải xem <code>event.timezone</code> và múi giờ của máy chạy Filebeat trước khi cãi.</li>
<li><strong>Khách hàng gửi một tệp zip log</strong> từ máy chủ của họ: nạp bằng Filebeat (đặt đúng <code>TZ</code>) vào bộ lab của bạn thay vì grep 20 tệp; giữ nguyên tệp zip gốc kèm mã băm (bài 16.4).</li>
<li><strong>Luật của đồng nghiệp không bao giờ kêu:</strong> chạy terms aggregation trên trường đó; một dấu cách, một chữ hoa hay trường con <code>.keyword</code> thường là thủ phạm.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Bật bộ lab từ <code>_demo/s15/elk</code>, nạp gói log, tái hiện bẫy 1: tìm dòng gốc của lần SSH thất bại cuối cùng và giờ Kibana hiện; rồi sửa bằng <code>tz.yaml</code> và nạp lại (nhớ xoá data stream <em>và</em> volume registry của Filebeat, không thì nó không đọc lại gì).</li>
<li>Viết KQL cho: (a) mọi <code>POST</code> tới <code>/api/v1/auth/login</code> trả 200 từ <code>203.0.113.66</code>; (b) mọi lần SSH thất bại với user <code>root</code>.</li>
<li>Bằng ES|QL: 5 URL có nhiều phản hồi 404 nhất ngày 20/11.</li>
<li>Giải thích trong hai câu vì sao <code>status : 500</code> ra 0 và trong điều tra thật bạn nhận ra điều đó thế nào.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 hiện 02:14:09 ở cả hai nơi sau khi sửa; 2(a) trả đúng một sự kiện (02:41:07, lần đăng nhập thành công sau vụ dò mật khẩu), 2(b) ra 23 lần thử <code>root</code> (<code>user.name : "root" and system.auth.ssh.event : "Failed"</code>); câu 3 là bảng từ <code>STATS n = COUNT(*) BY url.original | SORT n DESC | LIMIT 5</code> sau <code>WHERE http.response.status_code == 404</code>; câu 4 nêu được KQL không kiểm tên trường và bạn xem danh sách trường ở cột trái Discover trước.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Module Filebeat', 'Đầu vào + ingest pipeline làm sẵn cho một định dạng log quen (nginx, system, mysql…).'],
  ['Ingest pipeline', 'Các processor chạy trong Elasticsearch trước khi chỉ mục: grok, date, geoip, user_agent.'],
  ['Data stream', 'Chuỗi index ẩn chỉ ghi thêm sau một tên (filebeat-9.5.7), được ILM cuộn sang index mới.'],
  ['ECS', 'Elastic Common Schema — tên trường chuẩn để truy vấn và luật dùng chung cho nhiều nguồn.'],
  ['KQL', 'Kibana Query Language ở ô tìm Discover: trường : giá-trị, khoảng, ký tự đại diện, and/or/not.'],
  ['ES|QL', 'Ngôn ngữ truy vấn nối ống (FROM | WHERE | STATS | SORT) để đếm và gom nhóm.'],
  ['Watermark đĩa', 'Ngưỡng 85% / 90% / 95%; tới flood stage thì chỉ mục thành chỉ đọc.'],
  ['OpenSearch', 'Bản tách (2021) do AWS dẫn dắt từ Elasticsearch 7.10 và Kibana; DQL ≈ KQL.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>ELK cắt và chỉ mục mọi trường: tìm mạnh, ~3 GB RAM cho lab nhỏ nhất.</li>
<li>Cố định heap, giữ xác thực, canh đĩa (95% ⇒ chỉ đọc).</li>
<li>Log không có múi giờ nhận múi giờ của máy chạy Filebeat: so một dòng gốc với Kibana.</li>
<li>Không kết quả có thể là gõ sai tên trường hoặc cắt trường lạ: xem giá trị trường trước khi viết luật.</li>
<li>KQL để tìm, ES|QL để đếm.</li>
</ul>
${nguon('📘', 'Filebeat — module system', 'Fileset auth/syslog, add_locale và múi giờ', 'https://www.elastic.co/docs/reference/beats/filebeat/filebeat-module-system')}
${nguon('📘', 'Kibana Query Language (KQL)', 'Cú pháp: trường, khoảng, ký tự đại diện, nested', 'https://www.elastic.co/docs/explore-analyze/query-filter/languages/kql')}
${nguon('📘', 'ES|QL reference', 'FROM, WHERE, EVAL, STATS … BY, DATE_TRUNC', 'https://www.elastic.co/docs/reference/query-languages/esql')}
${nguon('📘', 'Elasticsearch — Minimal security setup', 'Vì sao không bao giờ tắt xác thực', 'https://www.elastic.co/guide/en/elasticsearch/reference/current/security-minimal-setup.html')}
${nguon('🛡️', 'WeLiveSecurity — Gần 4.000 CSDL bị xoá trong vụ Meow (07/2020)', 'Hơn 97% là Elasticsearch và MongoDB', 'https://www.welivesecurity.com/2020/07/27/almost-4000-databases-wiped-meow-attacks/')}
${nguon('🛡️', 'Infosecurity Magazine — CSDL hở bị kẻ "Meow" xoá', 'Bob Diachenko phát hiện, UFO VPN', 'https://www.infosecurity-magazine.com/news/1000-exposed-databases-wiped-meow')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-3-1-chon', title: 'Blue Team 3.1 — Chọn SIEM', sub: 'Elastic, OpenSearch, Wazuh, Splunk cho đội nhỏ', cta: 'Mở bài' })}
</div>
`,
};
