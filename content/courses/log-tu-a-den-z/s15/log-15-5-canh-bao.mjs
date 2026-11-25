/**
 * 15.5 — Cảnh báo từ log (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s15/canh-bao'] (Grafana 13.2.6 Alerting trên LogQL → webhook ntfy 2.38.1 ?template=grafana), OUT['s15/kibana'] (Kibana 9.5.7 Basic:
 * loại luật và connector theo giấy phép). Luật nạp bằng provisioning: ./_demo/s15/loki/grafana/alerting/lab15.yaml.
 * Giờ/thời gian chờ đổi mỗi lần chạy; trong lời chỉ dùng: 12 lần SSH, 8 lần 502, ngưỡng > 10 / > 5, for 1m, im lặng 2 phút, ba tin tới điện thoại + một tin RESOLVED.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Alerting from logs: Grafana alert rules on LogQL, Kibana rules, thresholds, absence alerts, routing|||Cảnh báo từ log: luật cảnh báo Grafana trên LogQL, luật Kibana, ngưỡng, cảnh báo khi im lặng, định tuyến',
  slug: 'log-15-5-canh-bao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba kiểu cảnh báo từ log — đếm vượt ngưỡng, một mẫu nguy hiểm xuất hiện, và im lặng — viết thành luật Grafana trên LogQL bằng tệp provisioning, gửi về điện thoại qua ntfy tự dựng. Chạy thật: 12 lần SSH sai ⇒ báo ngay; 8 lỗi 502 ⇒ pending rồi firing sau for: 1m; dừng API ⇒ "im lặng" sau ~2 phút, bật lại ⇒ RESOLVED. Bẫy noDataState, execErrState khi kho sập, nguồn phải luôn có log thì im lặng mới có nghĩa; Kibana Basic chỉ gửi được vào index/server log. Mỗi cảnh báo phải có việc cần làm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.5</span>
<h2>Make the logs call you</h2>
<p class="lead">A central store you have to remember to look at is a filing cabinet. The last step is to let it count for you and send a message when something needs a human. How to design alerts in general — thresholds you derive, SLOs and burn rates, alert fatigue and on-call for one person — is the Observability course (Chapter 9). This lesson builds the three alerts every log stack needs, as code, sends them to your phone, and triggers each one for real.</p>

<h3>The everyday picture: the smoke detector</h3>
<p>A smoke detector does three things: it beeps when there is smoke (a pattern), it beeps louder when there is a lot (a threshold), and it chirps when its battery is dead (silence — "I can no longer tell you"). A detector that beeps every time you make toast gets its battery removed — then it protects nobody. Every alert below must be worth getting up for.</p>

<h3>Three kinds of log alert</h3>
<table>
<thead><tr><th>Kind</th><th>Example</th><th>LogQL shape</th></tr></thead>
<tbody>
<tr><td>Threshold on a count</td><td>More than 10 failed SSH logins in 5 minutes; more than 5 server errors</td><td><code>sum(count_over_time({…} |= "…" [5m])) &gt; N</code></td></tr>
<tr><td>Pattern (one is enough)</td><td>Windows event 1102 "log cleared", <code>OutOfMemoryError</code>, a login by <code>root</code> from outside</td><td><code>count_over_time({…} |= "…" [5m]) &gt; 0</code></td></tr>
<tr><td>Absence (silence)</td><td>No line from the API for 15 minutes; a Windows PC stopped sending</td><td><code>absent_over_time({…}[15m])</code></td></tr>
</tbody>
</table>

<h3>Step 1 — the rules, as a file</h3>
${ma('yaml', 's15/loki/grafana/alerting/lab15.yaml')}
<p>How to read one rule:</p>
<ul>
<li><strong>A</strong> runs a LogQL <em>instant</em> query over the last 5 minutes. <strong>B</strong> reduces it to one number (<code>last</code>). <strong>C</strong> is the condition (<code>&gt; 10</code>). The rule is evaluated every 30 s (<code>interval</code>).</li>
<li><strong><code>for</code></strong>: how long the condition must hold before it fires. <code>0s</code> for SSH (a burst is the signal); <code>1m</code> for 5xx (one blip during a deploy is not worth a phone call). In between, the rule is <em>Pending</em>.</li>
<li><strong><code>noDataState</code></strong>: what to do when the query returns <em>nothing</em>. For "count of errors", nothing means zero — so <code>OK</code>. Grafana's default is <code>NoData</code>, which notifies — Lab 15 shows that trap.</li>
<li><strong><code>execErrState</code></strong>: what to do when the query <em>fails</em> (the store is down). <code>Error</code> fires a notification — you want to know your alerting is blind.</li>
<li><strong>Annotations</strong>: <code>summary</code> with the value (<code>{{ $values.B.Value }}</code>) and <code>viec_can_lam</code> — the first thing to do. An alert without a next step is noise.</li>
</ul>
<p>The contact point is a webhook to <strong>ntfy</strong> (open source, self-hostable push notifications; the Android/iOS app subscribes to a topic). <code>?template=grafana</code> makes ntfy format Grafana's JSON into a readable title and message. Grafana also has built-in contact points for Telegram (bot token + chat id), email (needs SMTP), Slack, Microsoft Teams, Discord.</p>
${lenh('s15/canh-bao', 0)}
${lenh('s15/canh-bao', 1)}
${lenh('s15/canh-bao', 2)}

<h3>Step 2 — threshold: an SSH burst</h3>
${lenh('s15/canh-bao', 3)}
${lenh('s15/canh-bao', 4)}
${lenh('s15/canh-bao', 5)}
<p>Twelve wrong passwords take about half a minute (sshd waits after each failure); the rule fired at the next evaluation after the count passed 10, and ntfy received the message a few seconds later (<code>group_wait: 10s</code>). The value in the message includes the five failures from lesson 15.2 that were still inside the 5-minute window — counts are always "in the last N minutes", not "since the attack started". The message carries the labels (<code>host = lab15</code>) and the next step.</p>

<h3>Step 3 — threshold with <code>for</code>: the payment gateway is down</h3>
${lenh('s15/canh-bao', 6)}
${lenh('s15/canh-bao', 7)}
<p>Eight 502s in eight seconds pass the threshold of 5, the rule goes <em>Pending</em>, and fires only after the condition has held for one minute. If the gateway had recovered within that minute, nobody would have been woken.</p>

<h3>Step 4 — absence: the API goes silent</h3>
${lenh('s15/canh-bao', 8)}
${lenh('s15/canh-bao', 9)}
${lenh('s15/canh-bao', 10)}
${lenh('s15/canh-bao', 11)}
<p>The container was stopped; about two minutes later <code>absent_over_time(…[2m])</code> returned 1 and the rule fired. After <code>docker start</code> the first new log line made the rule <em>Normal</em> again and ntfy received <strong>RESOLVED</strong>. Two details from the real output:</p>
<ul>
<li>The first message says <code>FIRING:1, RESOLVED:1</code>. The resolved one is an <em>Error</em>-state alert of the same rule from lesson 15.1, when Loki was stopped for a minute and the query failed (<code>connection refused</code>, <code>execErrState: Error</code>). Grafana grouped both in one message. Your alerting told you it was blind — good. A minute after each recovery, ntfy also received a <strong>RESOLVED</strong> message for every rule (last command) — so you know when to go back to sleep.</li>
<li>When building this lab, the silence rule fired <em>while the API was healthy</em>: the API only logged on requests, and nobody called it for two minutes. Silence is meaningful only if the source normally talks. The fix was a health check every 15 s in <code>compose.yaml</code> (what a load balancer does in production) — or alert on silence of a source that always talks (journald, a heartbeat line).</li>
</ul>

<h3>Kibana alerting, and what the free license allows</h3>
${lenh('s15/kibana', 0)}
${lenh('s15/kibana', 1)}
<p>On the free <strong>Basic</strong> license (asked from the real Kibana 9.5.7 API), the rule types you need exist — <em>Elasticsearch query</em> (KQL, DSL or ES|QL) and <em>Log threshold</em> — but the connectors that send messages outward (email, Slack, Teams, webhook, PagerDuty) need <strong>Gold</strong>. Only <em>Index</em> (write the alert into an index) and <em>Server log</em> are free. In practice teams on Basic either write alerts to an index and forward them with a small script, use ElastAlert 2, or put Grafana on top of Elasticsearch. OpenSearch's Alerting plugin includes webhooks for free. Check this before promising a customer "Slack alerts from Kibana".</p>

<h3>Rules for rules</h3>
<ol>
<li><strong>Every alert has an owner and a next step</strong> in its text. If you cannot write the next step, it is a dashboard panel, not an alert.</li>
<li><strong>Thresholds from data</strong>: look at a week of <code>count_over_time</code> before choosing 10 (Observability 9.2).</li>
<li><strong>Few and true</strong>: start with the three of Lab 15. Add one only after an incident that it would have caught.</li>
<li><strong>Route by severity</strong>: <code>muc=nghiem-trong</code> to the phone, <code>canh-bao</code> to a chat channel read in office hours — notification policies match on labels.</li>
<li><strong>Test alerts like code</strong>: trigger each one on purpose (this lesson), and after every change to the log format — a renamed field silently kills a rule (lesson 15.3, trap 2).</li>
<li><strong>Alert on the pipeline itself</strong>: silence per source, <code>loki_write_dropped_entries_total &gt; 0</code>, query errors.</li>
</ol>

<h3>Hacker's corner: the monitor that was silent for 19 months</h3>
<p>In the Equifax breach (lesson 10.9), the device that inspected traffic for the breached system had been inactive for 19 months because its SSL certificate had expired; when it was renewed in July 2017, suspicious traffic was noticed almost immediately (US House Oversight Committee report, 2018). Nobody was alerted that a monitor had stopped monitoring. Attackers count on this: they disable agents (MITRE T1685, "Disable or Modify Tools"), fill disks so logging stops, or generate noise so the real alert drowns. Your defences are exactly the "boring" rules: alert on silence, on agent errors and on dropped lines, and keep the number of alerts low enough that each one is read.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Outsourcing project, night shift in Vietnam for a customer in Japan:</strong> alerts route to the on-call phone with the customer's ticket template in the message. Agree in writing which alerts wake you and which wait for the morning.</li>
<li><strong>Your capstone demo week:</strong> one ntfy topic on your phone with "API 5xx" and "API silent" is enough to know before your lecturer does.</li>
<li><strong>A noisy rule</strong> firing 30 times a night: raise <code>for</code>, raise the threshold from data, or delete it — and write down why.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Install the ntfy app on your phone, subscribe to a hard-to-guess topic on your own ntfy server (or ntfy.sh for a test) and point the contact point there.</li>
<li>Add a "pattern" rule: any line containing <code>sudo:</code> and <code>COMMAND=/bin/bash</code> on <code>lab15</code> ⇒ alert immediately.</li>
<li>Trigger all three Lab 15 rules and the new one; note for each the time you triggered it and the time the phone buzzed.</li>
<li>Stop Loki for 2 minutes. Which notifications do you get, and from which setting?</li>
</ol>
<p><strong>Done when:</strong> 2 uses <code>count_over_time({host="lab15"} |= "sudo:" |= "COMMAND=/bin/bash" [5m])</code> with <code>&gt; 0</code>, <code>for: 0s</code>, <code>noDataState: OK</code>; 3 is a table of four rows with delays of seconds (SSH, pattern), about a minute more (5xx, because of <code>for</code>) and about the window length (silence); 4 shows error notifications from <code>execErrState: Error</code> and a resolved message after Loki returns.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Alert rule', 'Query + reduce + condition, evaluated on an interval.'],
  ['Pending / Firing / Normal', 'States of a rule: condition true but waiting for "for", notifying, OK.'],
  ['for', 'How long the condition must hold before firing — filters blips.'],
  ['noDataState', 'What an empty result means: OK, NoData (notify), Alerting, Keep last state.'],
  ['execErrState', 'What a failed query means; Error = notify that alerting is blind.'],
  ['Contact point', 'Where notifications go: webhook, ntfy, Telegram, email, Slack.'],
  ['Notification policy', 'Routing by labels; group_wait / group_interval / repeat_interval.'],
  ['absent_over_time', 'LogQL: returns 1 when a selector had no lines in the window.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Three log alerts: threshold, pattern, silence.</li>
<li>Rules as files (provisioning), each with a next step in its text.</li>
<li><code>noDataState: OK</code> for count rules; <code>execErrState: Error</code> to know when you are blind.</li>
<li>Silence only means something if the source always talks.</li>
<li>Kibana Basic: rules yes, outgoing connectors no — check the license.</li>
<li>Trigger every alert on purpose before trusting it.</li>
</ul>
${nguon('📘', 'Grafana — No data and error states', 'noDataState, execErrState, DatasourceNoData/DatasourceError', 'https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/nodata-and-error-states/')}
${nguon('📘', 'Grafana — File provisioning of alerting resources', 'Rules, contact points and policies as YAML', 'https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/')}
${nguon('📘', 'ntfy — Publishing', 'Topics, priorities, templates (template=grafana)', 'https://docs.ntfy.sh/publish/')}
${nguon('🛡️', 'US House Oversight Committee — The Equifax Data Breach (12/2018)', 'Expired certificate kept the traffic monitor inactive for 19 months', 'https://oversight.house.gov/wp-content/uploads/2018/12/Equifax-Report.pdf')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-9-1-loi-hua-danh-thuc', title: 'Observability 9.1 — An alert is a promise to wake someone', sub: 'What deserves a page, symptoms vs causes', cta: 'Open lesson' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-9-4-met-moi-va-truc-ca', title: 'Observability 9.4 — Alert fatigue and on-call for one', sub: 'Routing, silences, a sustainable rotation', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.5</span>
<h2>Để log gọi bạn dậy</h2>
<p class="lead">Một kho trung tâm mà bạn phải nhớ mở ra xem thì chỉ là tủ hồ sơ. Bước cuối là để nó tự đếm và nhắn tin khi có chuyện cần con người. Cách thiết kế cảnh báo nói chung — ngưỡng suy ra từ dữ liệu, SLO và tốc độ đốt, mệt mỏi vì cảnh báo và trực ca một người — nằm ở khoá Observability (Chương 9). Bài này dựng ba cảnh báo mà hệ gom log nào cũng cần, dưới dạng mã, gửi về điện thoại, và gây ra từng cái một cách thật.</p>

<h3>Liên tưởng đời thường: máy báo khói</h3>
<p>Máy báo khói làm ba việc: kêu khi có khói (một mẫu), kêu to hơn khi khói nhiều (một ngưỡng), và kêu "chíp" khi hết pin (im lặng — "tôi không còn báo được cho bạn nữa"). Cái máy kêu mỗi lần bạn nướng bánh mì sẽ bị tháo pin — và từ đó chẳng bảo vệ được ai. Mỗi cảnh báo dưới đây phải đáng để bạn thức dậy.</p>

<h3>Ba kiểu cảnh báo từ log</h3>
<table>
<thead><tr><th>Kiểu</th><th>Ví dụ</th><th>Dạng LogQL</th></tr></thead>
<tbody>
<tr><td>Ngưỡng trên số đếm</td><td>Quá 10 lần SSH thất bại trong 5 phút; quá 5 lỗi máy chủ</td><td><code>sum(count_over_time({…} |= "…" [5m])) &gt; N</code></td></tr>
<tr><td>Mẫu (một lần là đủ)</td><td>Sự kiện Windows 1102 "xoá log", <code>OutOfMemoryError</code>, <code>root</code> đăng nhập từ ngoài</td><td><code>count_over_time({…} |= "…" [5m]) &gt; 0</code></td></tr>
<tr><td>Vắng mặt (im lặng)</td><td>API không có dòng nào trong 15 phút; một máy Windows ngừng gửi</td><td><code>absent_over_time({…}[15m])</code></td></tr>
</tbody>
</table>

<h3>Bước 1 — luật, dưới dạng tệp</h3>
${ma('yaml', 's15/loki/grafana/alerting/lab15.yaml')}
<p>Đọc một luật thế nào:</p>
<ul>
<li><strong>A</strong> chạy một truy vấn LogQL <em>tức thời</em> trên 5 phút qua. <strong>B</strong> rút gọn thành một con số (<code>last</code>). <strong>C</strong> là điều kiện (<code>&gt; 10</code>). Luật được tính mỗi 30 giây (<code>interval</code>).</li>
<li><strong><code>for</code></strong>: điều kiện phải đúng bao lâu thì mới báo. <code>0s</code> cho SSH (chính đợt dồn dập là tín hiệu); <code>1m</code> cho 5xx (một lần chập chờn lúc deploy không đáng một cuộc gọi). Ở giữa, luật ở trạng thái <em>Pending</em>.</li>
<li><strong><code>noDataState</code></strong>: làm gì khi truy vấn trả về <em>không có gì</em>. Với "số lỗi", không có gì nghĩa là bằng 0 — nên <code>OK</code>. Mặc định của Grafana là <code>NoData</code>, và nó gửi thông báo — Lab 15 cho thấy cái bẫy này.</li>
<li><strong><code>execErrState</code></strong>: làm gì khi truy vấn <em>thất bại</em> (kho sập). <code>Error</code> sẽ gửi thông báo — bạn muốn biết hệ cảnh báo của mình đang bị mù.</li>
<li><strong>Annotation</strong>: <code>summary</code> kèm giá trị (<code>{{ $values.B.Value }}</code>) và <code>viec_can_lam</code> — việc đầu tiên phải làm. Cảnh báo không có bước tiếp theo là tiếng ồn.</li>
</ul>
<p>Contact point là một webhook tới <strong>ntfy</strong> (mã nguồn mở, tự dựng được, gửi thông báo đẩy; ứng dụng Android/iOS theo dõi một chủ đề). <code>?template=grafana</code> bảo ntfy định dạng JSON của Grafana thành tiêu đề và nội dung dễ đọc. Grafana cũng có sẵn contact point cho Telegram (bot token + chat id), email (cần SMTP), Slack, Microsoft Teams, Discord.</p>
${lenh('s15/canh-bao', 0)}
${lenh('s15/canh-bao', 1)}
${lenh('s15/canh-bao', 2)}

<h3>Bước 2 — ngưỡng: một đợt dò SSH</h3>
${lenh('s15/canh-bao', 3)}
${lenh('s15/canh-bao', 4)}
${lenh('s15/canh-bao', 5)}
<p>Mười hai lần sai mật khẩu mất khoảng nửa phút (sshd chờ sau mỗi lần sai); luật báo ở lần tính kế tiếp sau khi số đếm vượt 10, và ntfy nhận tin vài giây sau (<code>group_wait: 10s</code>). Giá trị trong tin gồm cả năm lần thất bại ở bài 15.2 vẫn còn trong khung 5 phút — số đếm luôn là "trong N phút qua", không phải "từ khi vụ tấn công bắt đầu". Tin nhắn mang theo nhãn (<code>host = lab15</code>) và việc cần làm.</p>

<h3>Bước 3 — ngưỡng có <code>for</code>: cổng thanh toán sập</h3>
${lenh('s15/canh-bao', 6)}
${lenh('s15/canh-bao', 7)}
<p>Tám lỗi 502 trong tám giây vượt ngưỡng 5, luật sang <em>Pending</em>, và chỉ báo sau khi điều kiện đúng liên tục một phút. Nếu cổng thanh toán hồi lại trong phút đó, chẳng ai bị đánh thức.</p>

<h3>Bước 4 — vắng mặt: API im bặt</h3>
${lenh('s15/canh-bao', 8)}
${lenh('s15/canh-bao', 9)}
${lenh('s15/canh-bao', 10)}
${lenh('s15/canh-bao', 11)}
<p>Container bị dừng; khoảng hai phút sau <code>absent_over_time(…[2m])</code> trả về 1 và luật báo. Sau <code>docker start</code>, dòng log mới đầu tiên đưa luật về <em>Normal</em> và ntfy nhận <strong>RESOLVED</strong>. Hai chi tiết từ output thật:</p>
<ul>
<li>Tin đầu ghi <code>FIRING:1, RESOLVED:1</code>. Cái "resolved" là một cảnh báo trạng thái <em>Error</em> của cùng luật từ bài 15.1, lúc Loki bị tắt một phút và truy vấn thất bại (<code>connection refused</code>, <code>execErrState: Error</code>). Grafana gộp cả hai vào một tin. Hệ cảnh báo đã báo cho bạn rằng nó bị mù — tốt. Khoảng một phút sau mỗi lần hồi phục, ntfy cũng nhận tin <strong>RESOLVED</strong> cho từng luật (lệnh cuối) — để bạn biết lúc nào được ngủ tiếp.</li>
<li>Lúc dựng lab, luật im lặng đã kêu <em>trong khi API vẫn khoẻ</em>: API chỉ ghi log khi có request, và hai phút không ai gọi nó. Im lặng chỉ có nghĩa khi nguồn bình thường vẫn nói. Cách sửa là healthcheck mỗi 15 giây trong <code>compose.yaml</code> (đúng việc bộ cân bằng tải làm trên production) — hoặc cảnh báo im lặng trên nguồn luôn nói (journald, một dòng nhịp tim).</li>
</ul>

<h3>Cảnh báo của Kibana, và giấy phép miễn phí cho phép gì</h3>
${lenh('s15/kibana', 0)}
${lenh('s15/kibana', 1)}
<p>Ở giấy phép <strong>Basic</strong> miễn phí (hỏi thẳng API của Kibana 9.5.7 thật), các loại luật bạn cần đều có — <em>Elasticsearch query</em> (KQL, DSL hoặc ES|QL) và <em>Log threshold</em> — nhưng các connector gửi tin ra ngoài (email, Slack, Teams, webhook, PagerDuty) cần <strong>Gold</strong>. Chỉ <em>Index</em> (ghi cảnh báo vào một index) và <em>Server log</em> là miễn phí. Trong thực tế, đội dùng Basic hoặc ghi cảnh báo vào index rồi chuyển tiếp bằng một script nhỏ, hoặc dùng ElastAlert 2, hoặc đặt Grafana lên trên Elasticsearch. Plugin Alerting của OpenSearch có sẵn webhook miễn phí. Kiểm điều này trước khi hứa với khách "cảnh báo Slack từ Kibana".</p>

<h3>Luật cho các luật</h3>
<ol>
<li><strong>Mỗi cảnh báo có người chịu trách nhiệm và việc cần làm</strong> ngay trong nội dung. Không viết được việc cần làm thì nó là một ô trên dashboard, không phải cảnh báo.</li>
<li><strong>Ngưỡng từ dữ liệu</strong>: xem một tuần <code>count_over_time</code> rồi mới chọn số 10 (Observability 9.2).</li>
<li><strong>Ít mà đúng</strong>: bắt đầu bằng ba cái của Lab 15. Chỉ thêm một cái sau một sự cố mà nó lẽ ra đã bắt được.</li>
<li><strong>Định tuyến theo mức</strong>: <code>muc=nghiem-trong</code> về điện thoại, <code>canh-bao</code> về kênh chat đọc trong giờ hành chính — notification policy khớp theo nhãn.</li>
<li><strong>Kiểm cảnh báo như kiểm mã</strong>: cố ý gây ra từng cái (bài này), và sau mỗi lần đổi định dạng log — một trường bị đổi tên âm thầm giết một luật (bài 15.3, bẫy 2).</li>
<li><strong>Cảnh báo cả chính đường ống</strong>: im lặng theo từng nguồn, <code>loki_write_dropped_entries_total &gt; 0</code>, lỗi truy vấn.</li>
</ol>

<h3>Góc hacker: thiết bị giám sát im lặng 19 tháng</h3>
<p>Trong vụ Equifax (bài 10.9), thiết bị soi lưu lượng của hệ thống bị xâm nhập đã ngừng hoạt động 19 tháng vì chứng chỉ SSL của nó hết hạn; khi được gia hạn vào tháng 7/2017, lưu lượng đáng ngờ bị phát hiện gần như ngay lập tức (báo cáo của Uỷ ban Giám sát Hạ viện Mỹ, 2018). Không ai được báo rằng một thiết bị giám sát đã thôi giám sát. Kẻ tấn công trông vào chuyện đó: chúng tắt agent (MITRE T1685, "Disable or Modify Tools"), làm đầy đĩa để log ngừng ghi, hoặc tạo tiếng ồn để cảnh báo thật chìm nghỉm. Lá chắn của bạn chính là những luật "nhàm chán": cảnh báo khi im lặng, khi agent lỗi và khi dòng bị bỏ, và giữ số cảnh báo đủ ít để cái nào cũng được đọc.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Dự án outsourcing, ca đêm ở Việt Nam cho khách Nhật:</strong> cảnh báo về điện thoại trực ca kèm mẫu ticket của khách trong nội dung. Thống nhất bằng văn bản cảnh báo nào đánh thức bạn và cảnh báo nào chờ tới sáng.</li>
<li><strong>Tuần demo đồ án:</strong> một chủ đề ntfy trên điện thoại với "API 5xx" và "API im lặng" là đủ để bạn biết trước cả giảng viên.</li>
<li><strong>Một luật ồn ào</strong> kêu 30 lần mỗi đêm: tăng <code>for</code>, nâng ngưỡng theo dữ liệu, hoặc xoá nó — và ghi lại lý do.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Cài ứng dụng ntfy trên điện thoại, theo dõi một chủ đề khó đoán trên máy chủ ntfy của bạn (hoặc ntfy.sh để thử) và trỏ contact point về đó.</li>
<li>Thêm một luật "mẫu": dòng nào trên <code>lab15</code> chứa <code>sudo:</code> và <code>COMMAND=/bin/bash</code> ⇒ báo ngay.</li>
<li>Gây ra cả ba luật của Lab 15 và luật mới; ghi cho từng cái giờ bạn gây ra và giờ điện thoại rung.</li>
<li>Dừng Loki 2 phút. Bạn nhận được những thông báo nào, và từ thiết lập nào?</li>
</ol>
<p><strong>Đạt khi:</strong> câu 2 dùng <code>count_over_time({host="lab15"} |= "sudo:" |= "COMMAND=/bin/bash" [5m])</code> với <code>&gt; 0</code>, <code>for: 0s</code>, <code>noDataState: OK</code>; câu 3 là bảng bốn dòng với độ trễ vài giây (SSH, mẫu), thêm khoảng một phút (5xx, do <code>for</code>) và khoảng bằng độ dài khung (im lặng); câu 4 có thông báo lỗi từ <code>execErrState: Error</code> và tin resolved sau khi Loki trở lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Luật cảnh báo', 'Truy vấn + rút gọn + điều kiện, tính theo chu kỳ.'],
  ['Pending / Firing / Normal', 'Trạng thái của luật: điều kiện đúng nhưng chờ "for", đang báo, ổn.'],
  ['for', 'Điều kiện phải đúng bao lâu mới báo — lọc chập chờn.'],
  ['noDataState', 'Kết quả rỗng nghĩa là gì: OK, NoData (báo), Alerting, giữ trạng thái cũ.'],
  ['execErrState', 'Truy vấn lỗi nghĩa là gì; Error = báo rằng hệ cảnh báo đang mù.'],
  ['Contact point', 'Thông báo đi đâu: webhook, ntfy, Telegram, email, Slack.'],
  ['Notification policy', 'Định tuyến theo nhãn; group_wait / group_interval / repeat_interval.'],
  ['absent_over_time', 'LogQL: trả 1 khi bộ chọn không có dòng nào trong khung.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba cảnh báo từ log: ngưỡng, mẫu, im lặng.</li>
<li>Luật dưới dạng tệp (provisioning), cái nào cũng có việc cần làm trong nội dung.</li>
<li><code>noDataState: OK</code> cho luật đếm; <code>execErrState: Error</code> để biết khi mình bị mù.</li>
<li>Im lặng chỉ có nghĩa khi nguồn luôn nói.</li>
<li>Kibana Basic: có luật, không có connector gửi ra ngoài — kiểm giấy phép.</li>
<li>Cố ý gây ra mọi cảnh báo trước khi tin nó.</li>
</ul>
${nguon('📘', 'Grafana — No data and error states', 'noDataState, execErrState, DatasourceNoData/DatasourceError', 'https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/nodata-and-error-states/')}
${nguon('📘', 'Grafana — File provisioning of alerting resources', 'Luật, contact point và policy dưới dạng YAML', 'https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/')}
${nguon('📘', 'ntfy — Publishing', 'Chủ đề, mức ưu tiên, template (template=grafana)', 'https://docs.ntfy.sh/publish/')}
${nguon('🛡️', 'Uỷ ban Giám sát Hạ viện Mỹ — The Equifax Data Breach (12/2018)', 'Chứng chỉ hết hạn làm thiết bị soi lưu lượng ngừng 19 tháng', 'https://oversight.house.gov/wp-content/uploads/2018/12/Equifax-Report.pdf')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-9-1-loi-hua-danh-thuc', title: 'Observability 9.1 — Cảnh báo là lời hứa đánh thức ai đó', sub: 'Cái gì đáng gọi dậy, triệu chứng hay nguyên nhân', cta: 'Mở bài' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-9-4-met-moi-va-truc-ca', title: 'Observability 9.4 — Mệt mỏi vì cảnh báo, trực ca một người', sub: 'Định tuyến, tạm tắt, lịch trực bền vững', cta: 'Mở bài' })}
</div>
`,
};
