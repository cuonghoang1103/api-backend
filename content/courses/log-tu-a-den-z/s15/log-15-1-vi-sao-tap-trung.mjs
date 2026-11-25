/**
 * 15.1 — Vì sao gom tập trung (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s15/tap-trung'] — bộ lab 1 (./_demo/s15/loki: Loki 3.7.10 + Alloy 1.22.0 + Grafana 13.2.6 + "máy Linux" systemd/sshd + API Node),
 * mọi dịch vụ trong một netns --network none. Chạy lại: bash _demo/s15/chay-s15.bash <thư mục>.
 * Số trong lời chỉ dùng số tất định: 4 dòng Failed, 0 sau khi xoá journal, 30 dòng lúc Loki tắt, dropped = 0; giờ/kích thước/số lần thử lại đổi mỗi lần chạy.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Why centralise: evidence that survives, one search box, correlation — agent, pipeline, store, UI|||Vì sao gom tập trung: bằng chứng sống sót, một ô tìm kiếm, tương quan — agent, đường ống, kho, giao diện',
  slug: 'log-15-1-vi-sao-tap-trung',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn lý do gom log về một nơi (bằng chứng sống sót khi máy bị xoá log, một ô tìm cho mọi máy, tương quan qua request id, cảnh báo) và kiến trúc chung agent → đường ống → kho → giao diện. Chạy thật: kẻ tấn công xoá journal trên máy nhưng Loki vẫn giữ 4 dòng SSH thất bại; Loki tắt gần một phút mà Alloy đệm + thử lại nên 30/30 dòng tới nơi, 0 dòng bị bỏ; Loki tự hãm ghi khi đĩa đầy 90%. Đẩy hay kéo, chọn gì cho đồ án / công ty nhỏ / doanh nghiệp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Why logs must leave the machine</h2>
<p class="lead">So far every chapter read logs <em>where they were written</em>: <code>journalctl</code> on the server, Event Viewer on the PC, <code>docker logs</code> on the host. That works for one machine and one problem. It fails the moment there are ten machines, a container that was deleted, or an intruder with root. This chapter moves logs to one place you can query and that tells you when something is wrong. The mechanics of shippers and pipelines are taught in depth in the Observability course (lesson 2.3); here we focus on what centralisation changes for <strong>reading and investigating</strong>.</p>

<h3>The everyday picture: the shop's cash book</h3>
<p>A small shop owner keeps the daily takings in a notebook behind the counter. One shop: fine. Five branches: every evening each branch manager photographs the page and sends it to the owner, who keeps them all in one folder. Now the owner can compare branches, see that branch 3 sent nothing yesterday, and — if a dishonest manager tears out a page — still has the photo. That folder is your central log store; the photo sent every evening is the agent; "branch 3 sent nothing" is the absence alert of lesson 15.5.</p>

<h3>Four reasons, each a real failure without it</h3>
${kv([
  ['Evidence that survives', 'An attacker with root deletes or edits local logs (lesson 8.4, T1685.005 on Windows). What was already shipped stays.'],
  ['One search box', 'Ten servers behind a load balancer: the failing request went to one of them. Without a central store you ssh into ten machines.'],
  ['Correlation', 'One request id across nginx, API, worker and database (lessons 10.4, 10.7) only makes sense when the lines sit side by side.'],
  ['Alerting', 'A log that nobody reads is only useful after the damage. A central store can count and page you (lesson 15.5).'],
])}
<p>And one more that people forget: <strong>containers and autoscaled machines are disposable</strong>. <code>docker compose down</code>, a Kubernetes pod rescheduled, an EC2 instance terminated by autoscaling — their local logs go with them (lesson 13.1).</p>

<h3>The shape of every log stack</h3>
<pre><code>  source            agent / shipper         pipeline / buffer         store                 UI / alerts
  ──────            ───────────────         ─────────────────         ─────                 ───────────
  journald     ┐    Grafana Alloy           (optional)                Loki                  Grafana
  /var/log/*   ├──▶ Filebeat / Elastic Agent ──▶ Kafka / Logstash ──▶ Elasticsearch/OpenSearch ──▶ Kibana
  docker stdout│    Fluent Bit / Vector      parse, enrich, drop       cloud: CloudWatch,    rules → phone
  Event Log    ┘    NXLog, Winlogbeat        mask secrets (16.3)       Azure Monitor, GCL    (ntfy, Telegram, mail)</code></pre>
<ul>
<li><strong>Push vs pull.</strong> Logs are almost always <em>pushed</em> by an agent (unlike Prometheus metrics, which are pulled). So the store cannot tell "no errors" from "agent dead" unless you alert on silence.</li>
<li><strong>Buffer.</strong> The network and the store will be down sometimes. A good agent keeps a queue and retries; a bigger setup puts Kafka in between. You will see Alloy's retry below.</li>
<li><strong>Parse where?</strong> At the agent or pipeline (ELK, lesson 15.3) or at query time (Loki, lesson 15.2). Either way, mask secrets <em>before</em> they leave the machine (lesson 16.3).</li>
</ul>

<h3>The lab stack for this chapter</h3>
<p>Five services in one Compose file: Loki (store), Alloy (agent), Grafana (UI + alerts), a small Node API (logs JSON to stdout), and a "Linux machine" — an Ubuntu 24.04 container running real systemd, journald and sshd. They share one network namespace with no network at all (<code>--network none</code>): nothing is exposed, they talk over 127.0.0.1. The files are explained in lesson 15.2.</p>
${ma('yaml', 's15/loki/compose.yaml')}
${lenh('s15/tap-trung', 0)}

<h3>Experiment 1 — the attacker cleans up, the evidence stays</h3>
<p>Four wrong SSH passwords on the Linux machine, then read them in both places:</p>
${lenh('s15/tap-trung', 1)}
${lenh('s15/tap-trung', 2)}
<p>Now play the intruder with root: rotate the journal and delete every archived file (<code>--vacuum-time=1s</code>) — a tidier version of <code>rm -rf /var/log/journal</code>:</p>
${lenh('s15/tap-trung', 3)}
${lenh('s15/tap-trung', 4)}
${lenh('s15/tap-trung', 5)}
<p>Local: <strong>0</strong> lines. Central: still <strong>4</strong>. Alloy had read and shipped each line within a second or two of it being written; deleting the source afterwards changes nothing in Loki. The same holds for <code>wevtutil cl Security</code> on Windows (lesson 15.4). Two caveats an interviewer will like: (1) the window between "written" and "shipped" is a few seconds — an attacker who disables the agent <em>first</em> leaves only silence, which is why lesson 15.5 alerts on silence; (2) whoever has admin rights on the <em>central</em> store can delete there too — separate accounts and immutable copies are lesson 16.4.</p>

<h3>Experiment 2 — the store goes down for a minute</h3>
<p>Stop Loki, send 30 requests to the API while it is down, then start it again:</p>
${lenh('s15/tap-trung', 6)}
${lenh('s15/tap-trung', 7)}
${lenh('s15/tap-trung', 8)}
${lenh('s15/tap-trung', 9)}
${lenh('s15/tap-trung', 10)}
<p>While Loki was down, queries failed and Alloy's push requests failed too: <code>status_code="-1"</code> is "could not connect", <code>500</code> is Loki starting up but not ready. <code>loki_write_batch_retries_total</code> grew: Alloy kept the batches in memory and retried with backoff (by default from 500 ms up to 5 minutes, 10 attempts). When Loki came back, <strong>all 30</strong> lines arrived with their original timestamps, and <code>loki_write_dropped_entries_total</code> is <strong>0</strong>. Know the limits: the queue is in memory (restart Alloy during the outage and the batch is lost unless you enable its write-ahead log), and after the last retry Alloy drops the batch and increments that counter — so alert on it.</p>

<h3>Experiment 3 — the store protects itself</h3>
${lenh('s15/tap-trung', 11)}
<p>A Loki with its default settings, started on this machine, immediately says it is <em>throttling writes</em>: the disk was above 90%. Every log store has a version of this (Elasticsearch makes indices read-only at 95%, lesson 15.3). The lab raised the threshold to 0.97 in <code>loki.yaml</code> — a production fix is more disk or shorter retention (lesson 16.2). The point for you: when "logs stopped arriving", check the <em>store's own log</em> before blaming the agent.</p>

<h3>What to choose</h3>
<table>
<thead><tr><th>Situation</th><th>Reasonable choice</th></tr></thead>
<tbody>
<tr><td>Your capstone/SWP project, one VPS</td><td>Docker log rotation + Loki + Alloy + Grafana in the same Compose (this chapter), 7–14 days</td></tr>
<tr><td>Small company, 5–30 servers</td><td>Loki on its own VM with object storage (S3/MinIO), Alloy everywhere, alerts to a chat channel</td></tr>
<tr><td>Security team, compliance, Windows fleet</td><td>Elastic/OpenSearch or a SIEM (Wazuh, Splunk, Sentinel); Winlogbeat/Elastic Agent; retention set by law (lesson 16.1)</td></tr>
<tr><td>Everything already on one cloud</td><td>The cloud's own service (CloudWatch Logs, Azure Monitor, Cloud Logging — lesson 13.4); watch the price per GB</td></tr>
</tbody>
</table>

<h3>Hacker's corner: Target, 2013 — the alert that nobody acted on</h3>
<p>In the Target breach (40 million card numbers), the logging and alerting <em>worked</em>. A US Senate committee staff report (March 2014) concluded that Target "missed a number of opportunities along the kill chain"; according to the report there was no indication Target responded to warnings that malware was being installed, and other automated warnings revealed how the attackers would carry data out. Centralising logs is necessary, not sufficient: someone must own each alert, and each alert must say what to do (lesson 15.5, and the Observability course on alert fatigue).</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, first incident:</strong> "Customers in Japan say checkout failed around 10:00 JST." With a central store: one query over all API pods, filter by status ≥ 500 and the time range (remember 10:00 JST = 08:00 in Vietnam). Without: ask the infra team for SSH to each pod.</li>
<li><strong>A customer asks "can you prove nobody accessed this data?"</strong> Only logs that left the machine and could not be edited by the same admin are evidence (lesson 16.4).</li>
<li><strong>Your demo server for the capstone defence crashed at night.</strong> <code>docker compose up</code> recreated the containers and the crash log is gone — unless it was in Loki.</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Bring up <code>_demo/s15/loki</code>, make 4 failed SSH logins, delete the journal and show the lines are still in Loki.</li>
<li>Stop Loki for 2 minutes while sending 60 requests; check that 60 lines arrive and that <code>loki_write_dropped_entries_total</code> stays 0.</li>
<li>This time stop Loki, <strong>restart Alloy</strong> while Loki is down, then start Loki. How many of the requests sent before the Alloy restart arrive?</li>
<li>Draw the four boxes (source, agent, store, UI) for your own capstone project and write next to each box what happens when it is down.</li>
</ol>
<p><strong>Done when:</strong> 1 shows 0 local and 4 central; 2 shows 60 and 0 dropped; 3 shows that the batch kept in Alloy's memory is lost (fewer than 60 arrive; in the author's run only 10 of 30 lines sent before the restart arrived, all 10 sent after it did) — and you can name the fix (Alloy's WAL for <code>loki.write</code>, or a disk buffer in another agent); 4 has an answer for "store down" (agent buffers) and "agent down" (silence alert).</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Centralised logging', 'Shipping logs from every machine to one store that can be searched and alerted on.'],
  ['Agent / shipper', 'Process on each machine that reads logs and pushes them (Alloy, Filebeat, Fluent Bit, Vector, NXLog).'],
  ['Push vs pull', 'Logs are pushed by agents; metrics are usually pulled. Silence is ambiguous with push.'],
  ['Backoff and retry', 'On failure, wait longer and longer and try again; drop after the last attempt.'],
  ['Write throttling', 'A store slowing or refusing writes to protect itself (disk, rate limits).'],
  ['Evidence that survives', 'Lines already shipped cannot be removed by deleting the source.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Central logs survive deletion, give one search box, allow correlation, and enable alerts.</li>
<li>Every stack is source → agent → (pipeline) → store → UI/alerts.</li>
<li>Agents buffer and retry; know where the buffer lives (memory or disk) and alert on drops.</li>
<li>An attacker who stops the agent creates silence — alert on silence.</li>
<li>When logs stop arriving, read the store's own log (disk, limits) too.</li>
</ul>
${nguon('📘', 'Grafana Alloy — loki.write', 'Endpoint, batching, retries (min/max backoff), write-ahead log', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.write/')}
${nguon('📘', 'Grafana Loki — Promtail is end of life', 'Promtail EOL 2 March 2026; future development in Alloy', 'https://grafana.com/docs/loki/latest/send-data/promtail/')}
${nguon('🛡️', 'NBC News — Target missed many warning signs leading to breach: Senate report (03/2014)', 'Warnings that malware was being installed were not acted upon', 'https://www.nbcnews.com/business/consumer/target-missed-many-warning-signs-leading-breach-senate-report-n62021')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-3-trinh-thu-log', title: 'Observability 2.3 — The shipper', sub: 'Vector/Promtail, tailing json-file, what is lost when the shipper is down', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Vì sao log phải rời khỏi cái máy</h2>
<p class="lead">Tới giờ mọi chương đều đọc log <em>ngay nơi nó được ghi</em>: <code>journalctl</code> trên máy chủ, Event Viewer trên PC, <code>docker logs</code> trên máy chạy Docker. Cách đó ổn với một máy và một sự cố. Nó gãy ngay khi có mười máy, một container đã bị xoá, hoặc một kẻ đột nhập có quyền root. Chương này đưa log về một nơi hỏi được và tự báo khi có chuyện. Cơ chế của trình thu log và đường ống được dạy sâu ở khoá Observability (bài 2.3); ở đây ta tập trung vào việc gom tập trung thay đổi gì cho chuyện <strong>đọc và điều tra</strong>.</p>

<h3>Liên tưởng đời thường: sổ thu chi của cửa hàng</h3>
<p>Chủ một cửa hàng nhỏ ghi tiền thu mỗi ngày vào cuốn sổ sau quầy. Một cửa hàng: ổn. Năm chi nhánh: tối nào quản lý mỗi chi nhánh cũng chụp trang sổ gửi cho chủ, chủ cất hết vào một thư mục. Giờ chủ so được các chi nhánh, thấy chi nhánh 3 hôm qua không gửi gì, và — nếu một quản lý gian xé trang sổ — vẫn còn tấm ảnh. Thư mục đó là kho log trung tâm; tấm ảnh gửi mỗi tối là agent; "chi nhánh 3 không gửi gì" là cảnh báo im lặng ở bài 15.5.</p>

<h3>Bốn lý do, mỗi lý do là một thất bại có thật nếu thiếu nó</h3>
${kv([
  ['Bằng chứng sống sót', 'Kẻ tấn công có root xoá hoặc sửa log trên máy (bài 8.4, T1685.005 trên Windows). Thứ đã gửi đi thì còn nguyên.'],
  ['Một ô tìm kiếm', 'Mười máy chủ sau bộ cân bằng tải: request hỏng rơi vào một trong số đó. Không có kho trung tâm thì bạn ssh vào mười máy.'],
  ['Tương quan', 'Một request id đi qua nginx, API, worker và CSDL (bài 10.4, 10.7) chỉ có nghĩa khi các dòng nằm cạnh nhau.'],
  ['Cảnh báo', 'Log không ai đọc chỉ có ích sau khi thiệt hại đã xảy ra. Kho trung tâm đếm được và gọi bạn dậy (bài 15.5).'],
])}
<p>Và một lý do hay bị quên: <strong>container và máy tự co giãn là đồ dùng một lần</strong>. <code>docker compose down</code>, pod Kubernetes bị dời chỗ, máy EC2 bị autoscaling tắt — log cục bộ đi theo chúng (bài 13.1).</p>

<h3>Hình dạng chung của mọi hệ gom log</h3>
<pre><code>  nguồn             agent / trình thu        đường ống / đệm           kho                   giao diện / cảnh báo
  ─────             ─────────────────        ───────────────           ───                   ────────────────────
  journald     ┐    Grafana Alloy            (tuỳ chọn)                Loki                  Grafana
  /var/log/*   ├──▶ Filebeat / Elastic Agent ──▶ Kafka / Logstash ──▶ Elasticsearch/OpenSearch ──▶ Kibana
  docker stdout│    Fluent Bit / Vector      cắt, làm giàu, bỏ bớt     cloud: CloudWatch,    luật → điện thoại
  Event Log    ┘    NXLog, Winlogbeat        che bí mật (16.3)         Azure Monitor, GCL    (ntfy, Telegram, mail)</code></pre>
<ul>
<li><strong>Đẩy hay kéo.</strong> Log gần như luôn được agent <em>đẩy</em> đi (khác metric Prometheus là kéo về). Vì vậy kho không phân biệt được "không có lỗi" với "agent chết", trừ khi bạn cảnh báo khi im lặng.</li>
<li><strong>Đệm.</strong> Mạng và kho thỉnh thoảng sẽ sập. Agent tốt giữ một hàng đợi và thử lại; hệ lớn hơn đặt Kafka ở giữa. Bạn sẽ thấy Alloy thử lại ngay dưới đây.</li>
<li><strong>Cắt trường ở đâu?</strong> Ở agent hoặc đường ống (ELK, bài 15.3) hoặc lúc truy vấn (Loki, bài 15.2). Cách nào cũng vậy, che bí mật <em>trước khi</em> log rời máy (bài 16.3).</li>
</ul>

<h3>Bộ lab của chương</h3>
<p>Năm dịch vụ trong một tệp Compose: Loki (kho), Alloy (agent), Grafana (giao diện + cảnh báo), một API Node nhỏ (log JSON ra stdout), và một "máy Linux" — container Ubuntu 24.04 chạy systemd, journald và sshd thật. Chúng dùng chung một network namespace không có mạng nào (<code>--network none</code>): không mở gì ra ngoài, nói chuyện qua 127.0.0.1. Các tệp được giải thích ở bài 15.2.</p>
${ma('yaml', 's15/loki/compose.yaml')}
${lenh('s15/tap-trung', 0)}

<h3>Thí nghiệm 1 — kẻ tấn công dọn dấu vết, bằng chứng vẫn còn</h3>
<p>Bốn lần sai mật khẩu SSH vào máy Linux, rồi đọc ở cả hai nơi:</p>
${lenh('s15/tap-trung', 1)}
${lenh('s15/tap-trung', 2)}
<p>Giờ đóng vai kẻ đột nhập có root: xoay journal và xoá mọi tệp lưu trữ (<code>--vacuum-time=1s</code>) — phiên bản gọn gàng của <code>rm -rf /var/log/journal</code>:</p>
${lenh('s15/tap-trung', 3)}
${lenh('s15/tap-trung', 4)}
${lenh('s15/tap-trung', 5)}
<p>Trên máy: <strong>0</strong> dòng. Ở kho trung tâm: vẫn <strong>4</strong>. Alloy đã đọc và gửi từng dòng chỉ một hai giây sau khi nó được ghi; xoá nguồn sau đó không đổi được gì trong Loki. Với <code>wevtutil cl Security</code> trên Windows cũng vậy (bài 15.4). Hai lưu ý mà người phỏng vấn sẽ thích: (1) khoảng hở giữa "được ghi" và "được gửi" là vài giây — kẻ tấn công tắt agent <em>trước</em> thì chỉ để lại im lặng, vì thế bài 15.5 cảnh báo khi im lặng; (2) ai có quyền admin trên <em>kho trung tâm</em> cũng xoá được ở đó — tách tài khoản và bản sao bất biến là bài 16.4.</p>

<h3>Thí nghiệm 2 — kho sập một phút</h3>
<p>Dừng Loki, gửi 30 request tới API trong lúc nó sập, rồi bật lại:</p>
${lenh('s15/tap-trung', 6)}
${lenh('s15/tap-trung', 7)}
${lenh('s15/tap-trung', 8)}
${lenh('s15/tap-trung', 9)}
${lenh('s15/tap-trung', 10)}
<p>Trong lúc Loki sập, truy vấn thất bại và các lần đẩy của Alloy cũng thất bại: <code>status_code="-1"</code> là "không kết nối được", <code>500</code> là Loki đang khởi động chưa sẵn sàng. <code>loki_write_batch_retries_total</code> tăng: Alloy giữ các lô trong bộ nhớ và thử lại với thời gian chờ tăng dần (mặc định từ 500 ms tới 5 phút, 10 lần). Khi Loki trở lại, <strong>đủ 30</strong> dòng tới nơi với đúng giờ gốc, và <code>loki_write_dropped_entries_total</code> là <strong>0</strong>. Biết giới hạn: hàng đợi nằm trong bộ nhớ (khởi động lại Alloy giữa lúc sập là mất lô đó, trừ khi bật write-ahead log của nó), và sau lần thử cuối Alloy bỏ lô và tăng bộ đếm đó — nên hãy cảnh báo trên nó.</p>

<h3>Thí nghiệm 3 — kho tự bảo vệ mình</h3>
${lenh('s15/tap-trung', 11)}
<p>Một Loki để cấu hình mặc định, bật trên máy này, lập tức báo đang <em>hãm ghi</em>: đĩa đã trên 90%. Kho log nào cũng có phiên bản của chuyện này (Elasticsearch đặt chỉ mục thành chỉ đọc ở 95%, bài 15.3). Lab nâng ngưỡng lên 0.97 trong <code>loki.yaml</code> — cách sửa trên production là thêm đĩa hoặc rút ngắn thời gian lưu (bài 16.2). Điều cần nhớ: khi "log không về nữa", đọc <em>log của chính cái kho</em> trước khi đổ lỗi cho agent.</p>

<h3>Chọn gì</h3>
<table>
<thead><tr><th>Hoàn cảnh</th><th>Lựa chọn hợp lý</th></tr></thead>
<tbody>
<tr><td>Đồ án/SWP của bạn, một VPS</td><td>Xoay vòng log Docker + Loki + Alloy + Grafana chung Compose (chương này), 7–14 ngày</td></tr>
<tr><td>Công ty nhỏ, 5–30 máy chủ</td><td>Loki trên máy ảo riêng với object storage (S3/MinIO), Alloy ở mọi máy, cảnh báo về một kênh chat</td></tr>
<tr><td>Đội bảo mật, tuân thủ, nhiều máy Windows</td><td>Elastic/OpenSearch hoặc một SIEM (Wazuh, Splunk, Sentinel); Winlogbeat/Elastic Agent; thời gian lưu theo luật (bài 16.1)</td></tr>
<tr><td>Mọi thứ đã nằm trên một cloud</td><td>Dịch vụ của chính cloud đó (CloudWatch Logs, Azure Monitor, Cloud Logging — bài 13.4); canh giá mỗi GB</td></tr>
</tbody>
</table>

<h3>Góc hacker: Target, 2013 — cảnh báo không ai xử lý</h3>
<p>Trong vụ Target (40 triệu số thẻ), việc ghi log và cảnh báo <em>có chạy</em>. Báo cáo của ban tham mưu một uỷ ban Thượng viện Mỹ (tháng 3/2014) kết luận Target "đã bỏ lỡ nhiều cơ hội dọc chuỗi tấn công (kill chain)"; theo báo cáo, không có dấu hiệu Target phản hồi các cảnh báo rằng mã độc đang được cài, và những cảnh báo tự động khác còn cho thấy kẻ tấn công sẽ mang dữ liệu ra ngoài bằng cách nào. Gom log tập trung là cần, chưa đủ: mỗi cảnh báo phải có người chịu trách nhiệm, và phải nói rõ cần làm gì (bài 15.5, và khoá Observability về mệt mỏi vì cảnh báo).</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, sự cố đầu tiên:</strong> "Khách ở Nhật báo thanh toán lỗi khoảng 10:00 JST." Có kho trung tâm: một truy vấn trên mọi pod API, lọc status ≥ 500 và khoảng giờ (nhớ 10:00 JST = 08:00 giờ Việt Nam). Không có: xin đội hạ tầng quyền SSH vào từng pod.</li>
<li><strong>Khách hỏi "anh chứng minh được không ai truy cập dữ liệu này không?"</strong> Chỉ log đã rời máy và không bị chính admin đó sửa được mới là bằng chứng (bài 16.4).</li>
<li><strong>Máy chủ demo cho buổi bảo vệ đồ án sập lúc nửa đêm.</strong> <code>docker compose up</code> tạo lại container và log lúc sập biến mất — trừ khi nó đã nằm trong Loki.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Bật <code>_demo/s15/loki</code>, tạo 4 lần SSH thất bại, xoá journal và cho thấy các dòng vẫn còn trong Loki.</li>
<li>Dừng Loki 2 phút trong lúc gửi 60 request; kiểm 60 dòng tới nơi và <code>loki_write_dropped_entries_total</code> vẫn 0.</li>
<li>Lần này dừng Loki, <strong>khởi động lại Alloy</strong> trong lúc Loki còn sập, rồi bật Loki. Bao nhiêu request gửi trước lúc khởi động lại Alloy tới nơi?</li>
<li>Vẽ bốn ô (nguồn, agent, kho, giao diện) cho đồ án của bạn và ghi cạnh mỗi ô chuyện gì xảy ra khi nó sập.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 cho 0 trên máy và 4 ở trung tâm; câu 2 cho 60 và 0 dropped; câu 3 cho thấy lô nằm trong bộ nhớ Alloy bị mất (tới nơi ít hơn 60; ở lần chạy của người soạn chỉ 10 trên 30 dòng gửi trước lúc khởi động lại tới nơi, còn 10 dòng gửi sau thì đủ) — và bạn nêu được cách sửa (WAL của Alloy cho <code>loki.write</code>, hoặc đệm trên đĩa ở agent khác); câu 4 có câu trả lời cho "kho sập" (agent đệm) và "agent sập" (cảnh báo im lặng).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Gom log tập trung', 'Gửi log từ mọi máy về một kho tìm được và cảnh báo được.'],
  ['Agent / trình thu', 'Tiến trình trên mỗi máy đọc log và đẩy đi (Alloy, Filebeat, Fluent Bit, Vector, NXLog).'],
  ['Đẩy và kéo', 'Log do agent đẩy; metric thường được kéo. Với kiểu đẩy, im lặng mang hai nghĩa.'],
  ['Backoff và thử lại', 'Khi lỗi thì chờ lâu dần rồi thử lại; bỏ sau lần thử cuối.'],
  ['Hãm ghi', 'Kho tự làm chậm hoặc từ chối ghi để bảo vệ mình (đĩa, giới hạn tốc độ).'],
  ['Bằng chứng sống sót', 'Dòng đã gửi đi không bị xoá theo khi xoá nguồn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log tập trung sống sót khi bị xoá, cho một ô tìm, cho phép tương quan và cảnh báo.</li>
<li>Mọi hệ đều là nguồn → agent → (đường ống) → kho → giao diện/cảnh báo.</li>
<li>Agent đệm và thử lại; biết đệm nằm ở đâu (bộ nhớ hay đĩa) và cảnh báo khi bị bỏ.</li>
<li>Kẻ tấn công tắt agent tạo ra im lặng — cảnh báo khi im lặng.</li>
<li>Khi log không về nữa, đọc cả log của chính cái kho (đĩa, giới hạn).</li>
</ul>
${nguon('📘', 'Grafana Alloy — loki.write', 'Endpoint, gom lô, thử lại (min/max backoff), write-ahead log', 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.write/')}
${nguon('📘', 'Grafana Loki — Promtail đã hết vòng đời', 'Promtail EOL ngày 2/3/2026; phát triển tiếp ở Alloy', 'https://grafana.com/docs/loki/latest/send-data/promtail/')}
${nguon('🛡️', 'NBC News — Target bỏ lỡ nhiều dấu hiệu cảnh báo: báo cáo Thượng viện (03/2014)', 'Cảnh báo mã độc đang được cài không được xử lý', 'https://www.nbcnews.com/business/consumer/target-missed-many-warning-signs-leading-breach-senate-report-n62021')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-3-trinh-thu-log', title: 'Observability 2.3 — Trình thu log', sub: 'Vector/Promtail, đọc đuôi json-file, mất gì khi trình thu sập', cta: 'Mở bài' })}
</div>
`,
};
