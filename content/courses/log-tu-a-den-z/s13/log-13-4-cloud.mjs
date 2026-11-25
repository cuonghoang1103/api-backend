/**
 * 13.4 — Log trên cloud ở mức nhận biết (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s13/cloud'] — phần A: AWS CLI 2.32.0 gọi API CloudWatch Logs/CloudTrail thật vào moto 5.1.18 (giả lập AWS cục bộ,
 * container lgz-moto; "aws" = hàm trong _demo/s13/cong-cu/aws-env.bash). Phần B: bản ghi CloudTrail + VPC Flow Logs MẪU do
 * _demo/s13/cloud/tao-mau.py sinh (đúng cấu trúc tài liệu AWS; tài khoản 111122223333 và khoá AKIAIOSFODNN7EXAMPLE là giá trị ví dụ của AWS).
 * Chạy lại ⇒ timestamp và StopLoggingTime đổi; số liệu bản ghi mẫu thì tất định.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '13.4 — Cloud logs at recognition level: AWS, Azure and Google Cloud|||13.4 — Log trên cloud ở mức nhận biết: CloudWatch Logs/Logs Insights, CloudTrail, VPC Flow Logs; Azure Activity Log; Google Cloud Logging',
  slug: 'log-13-4-cloud',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba loại log trên mọi cloud — log ứng dụng (CloudWatch Logs), log kiểm toán API "ai đã làm gì với tài nguyên" (CloudTrail), log luồng mạng (VPC Flow Logs) — và tên tương đương ở Azure và Google Cloud. Gọi API CloudWatch Logs thật vào giả lập moto (log group/stream/event, retention mặc định không bao giờ hết hạn, giả lập bỏ qua filter pattern), đọc 14 sự kiện CloudTrail mẫu của một khoá bị lộ (dò quyền AccessDenied → StopLogging → DeleteFlowLogs → RunInstances máy GPU), đọc VPC Flow Logs bằng awk; góc hacker: tắt log là việc đầu tiên (MITRE T1685.002, trước là T1562.008).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>Cloud logs: three questions, three kinds of log, the same on every provider</h2>
<p class="lead">On a cloud project you will hear "check CloudWatch", "look in CloudTrail", "pull the flow logs", or on Azure "Log Analytics" and "Activity Log". They answer three different questions. This lesson teaches you to recognise each kind, read its records, and know which one to open. Operating them on a real AWS account (log groups, metric filters, alarms, tracing) is the Cloud AWS course; here the API calls run against <strong>moto</strong>, an AWS emulator on your machine, and the CloudTrail/flow-log records are realistic samples built to AWS's documented format (account <code>111122223333</code> and key <code>AKIAIOSFODNN7EXAMPLE</code> are the example values AWS itself uses in its documentation).</p>

<h3>The everyday picture: an apartment building</h3>
<p>What happens <em>inside</em> each flat is the residents' business — their own diary (application logs). The building's front desk logs who used a key card to open which door, and who changed the locks (audit log: CloudTrail). The camera at the gate records cars entering and leaving, with plates and times but not what is in the boot (network flow log). A burglar who reaches the front desk first will try to switch off the key-card log.</p>

<h3>The map</h3>
<table>
<thead><tr><th>Question</th><th>AWS</th><th>Azure</th><th>Google Cloud</th></tr></thead>
<tbody>
<tr><td>What did my app print?</td><td>CloudWatch Logs (log group → stream → event), searched with Logs Insights</td><td>Azure Monitor Logs / Log Analytics workspace, queried with KQL</td><td>Cloud Logging, Logs Explorer with the Logging query language</td></tr>
<tr><td>Who did what to which resource, from where?</td><td>CloudTrail (management events; data events optional)</td><td>Activity Log (control plane), Entra ID sign-in/audit logs</td><td>Cloud Audit Logs: Admin Activity (always on), Data Access (mostly off by default)</td></tr>
<tr><td>Which IP talked to which IP and port, accepted or rejected?</td><td>VPC Flow Logs</td><td>Virtual network flow logs (NSG flow logs retiring)</td><td>VPC Flow Logs</td></tr>
</tbody></table>
<p>Before you can read any of them, someone must have turned them on and set where they go. "Is CloudTrail on in every region, and where does it deliver?" is the first question on a new project.</p>

<h3>Part A — CloudWatch Logs: the API underneath the console</h3>
${lenh('s13/cloud', 1)}
${lenh('s13/cloud', 2)}
<p>The hierarchy: a <strong>log group</strong> per application or Lambda function (<code>/lab13/orders</code>), a <strong>log stream</strong> per source inside it (one container, one Lambda instance), and <strong>events</strong> = timestamp (epoch ms) + message. <code>retention None</code> means <strong>never expire</strong>: the default. You pay for storage forever unless someone sets it.</p>
${lenh('s13/cloud', 3)}
${lenh('s13/cloud', 4)}
<p>This is exactly what Docker's <code>awslogs</code> driver, the Lambda runtime or the CloudWatch agent do for you: send JSON lines with timestamps. The message is a <em>string</em>; your JSON sits inside it, so jq needs <code>fromjson</code> (lesson 10.4 again).</p>
${lenh('s13/cloud', 5)}
${lenh('s13/cloud', 6)}
<p>On real AWS the filter pattern <code>{ $.level = "error" }</code> returns one event. The emulator returned 3: moto accepts the parameter and ignores it. <strong>Lesson worth more than the command:</strong> an emulator checks that your calls are well-formed, not that your queries are right; verify query semantics on a real (sandbox) account. The jq version gives the right answer anywhere.</p>
${lenh('s13/cloud', 7)}
<p>What a <strong>Logs Insights</strong> query looks like on a real account (recognition — run it in the console against your log group; the emulator does not evaluate it):</p>
<pre><code class="language-text">fields @timestamp, level, msg, ms
| filter level = "error"
| stats count(*) as errors by bin(5m)
| sort errors desc</code></pre>
<p>Insights discovers JSON fields automatically; you pay per GB <em>scanned</em>, so always narrow the time range first. Ingestion (per GB written) is usually the biggest item on the bill — the numbers and how to cut them are in the Cloud AWS course and lesson 16.2.</p>

<h3>Part B — CloudTrail: the front desk</h3>
${lenh('s13/cloud', 8)}
${lenh('s13/cloud', 9)}
<p>A trail is just a configuration that copies events to S3 (and optionally CloudWatch Logs). One API call — <code>StopLogging</code> — turns it off, and <code>get-trail-status</code> shows <code>IsLogging: false</code> and the time. That call itself is recorded as an event. Now read a day of events (sample) from an account where a CI key leaked:</p>
${lenh('s13/cloud', 10)}
${lenh('s13/cloud', 11)}
<p>Every record answers the same questions: <strong>who</strong> (<code>userIdentity</code>: type, user name, access key), <strong>what</strong> (<code>eventSource</code> + <code>eventName</code>), <strong>when</strong> (<code>eventTime</code>, always UTC), <strong>from where</strong> (<code>sourceIPAddress</code>, <code>userAgent</code>), <strong>result</strong> (<code>errorCode</code> or <code>responseElements</code>). Console sign-ins also carry <code>MFAUsed</code>.</p>
${lenh('s13/cloud', 12)}
<p>One table, the whole story — read it like lesson 14.5 will teach:</p>
<ol>
<li>02:41:07 <code>GetCallerIdentity</code> from 203.0.113.50 with the CI user's long-term key (<code>AKIA…</code>). This is the attacker's "whoami" — legitimate CI jobs rarely need it. It is the most common first call after a key leak.</li>
<li>02:41:12–02:41:29: one <code>ListBuckets</code>, then four IAM listing calls, all <code>AccessDenied</code>. <strong>Permission probing</strong>: a burst of AccessDenied from one key is a top-quality alert.</li>
<li>02:42:05–02:42:31: <code>DescribeTrails</code>, <code>StopLogging</code>, <code>DeleteFlowLogs</code> — finding and blinding the cameras. These succeeded: the CI role was far too broad.</li>
<li>02:43:40 <code>RunInstances</code> of 8 × <code>p4d.24xlarge</code> (GPU machines) — the goal was crypto-mining; it failed with <code>Client.UnauthorizedOperation</code>.</li>
<li>08:12:55 the human <code>an</code> from the office IP turns logging back on — five and a half hours of blind spot.</li>
</ol>
${lenh('s13/cloud', 13)}
${lenh('s13/cloud', 14)}
${lenh('s13/cloud', 15)}
${lenh('s13/cloud', 16)}
<p>The user agent says it all came from the AWS CLI on Linux — your CI runs in a pipeline with a different agent string; a mismatch is another clue. Without a trail, CloudTrail <strong>Event history</strong> in the console still keeps the last 90 days of management events per region for free — the first place to look on an account where "nobody set up logging".</p>

<h3>Part C — VPC Flow Logs: the gate camera</h3>
${lenh('s13/cloud', 17)}
<p>Default format (version 2), one line per flow per aggregation window: <code>version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status</code>. <code>protocol 6</code> = TCP, <code>start/end</code> are epoch seconds, <code>action</code> ACCEPT/REJECT is the decision of security groups and network ACLs. No URLs, no payloads, no user names.</p>
${lenh('s13/cloud', 18)}
${lenh('s13/cloud', 19)}
${lenh('s13/cloud', 20)}
${lenh('s13/cloud', 21)}
<ul>
<li>60 REJECTs on port 22 from two IPs: background SSH scanning, correctly blocked — noise, not an incident.</li>
<li>6 <strong>ACCEPT</strong>s from 203.0.113.50 to <code>10.0.2.30:5432</code> between 02:40 and 02:43 — PostgreSQL reachable from the Internet, and the same IP as the CloudTrail story. Two independent sources, one actor: correlation by IP and time.</li>
<li><code>NODATA</code> = no traffic in the window; <code>SKIPDATA</code> = records were dropped (capacity or an internal error) — a gap in the evidence you must mention in your report.</li>
</ul>

<h3>Azure and Google Cloud in one paragraph each</h3>
<p><strong>Azure:</strong> the <em>Activity Log</em> records control-plane operations on resources (who deleted a VM, changed a network security group) with caller, operation name, status and correlation id; it is kept 90 days unless you route it to a Log Analytics workspace, where you query it with KQL (<code>AzureActivity | where OperationNameValue endswith "DELETE"</code>). Sign-ins are in Microsoft Entra ID's sign-in logs, a separate place.</p>
<p><strong>Google Cloud:</strong> Cloud Logging holds everything; <em>Admin Activity</em> audit logs are always written and cannot be disabled, <em>Data Access</em> audit logs (who read which data) are off by default for most services. Logs Explorer queries look like <code>protoPayload.methodName="SetIamPolicy" AND severity&gt;=WARNING</code>.</p>

<h3>Hacker's corner: blind the cameras first</h3>
<p>MITRE ATT&amp;CK lists "disable or modify cloud logs" as technique <strong>T1685.002</strong> (previously numbered T1562.008 — you will see both). Its procedure examples include the open-source AWS attack framework <strong>Pacu</strong>, which can disable CloudTrail and VPC flow logs, and <strong>APT29</strong>, which disabled Purview Audit on Microsoft 365 accounts before stealing their e-mail. Defence: alert on <code>StopLogging</code>, <code>DeleteTrail</code>, <code>UpdateTrail</code>, <code>PutEventSelectors</code>, <code>DeleteFlowLogs</code> (AWS Security Hub has controls for exactly these metric filters); deliver the trail to a separate log-archive account the workload accounts cannot touch; never give CI keys <code>cloudtrail:*</code>. And remember the other lesson from Capital One (2019, about 100 million people in the US and 6 million in Canada): by the company's own account the incident was <em>reported by an outside researcher</em> on 17 July 2019 — the logs existed, but nobody was alerted by them.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, the customer's AWS bill doubled overnight:</strong> Cost Explorer shows EC2 in a region you never use. CloudTrail Event history in that region, filter <code>RunInstances</code> → access key, IP, user agent. That is your first message to the security contact.</li>
<li><strong>A Lambda "sometimes fails" and there is no log:</strong> check the log group exists and the function's role has <code>logs:CreateLogStream</code>/<code>PutLogEvents</code>; missing permissions fail silently from your point of view.</li>
<li><strong>"Did anyone from outside reach our database?":</strong> flow logs on the database's network interface, <code>ACCEPT</code> to its port from non-private addresses. If flow logs were off, say so: the absence of evidence is part of the answer.</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>python3 _demo/s13/cloud/tao-mau.py mau</code>. List every CloudTrail event that <em>changed</em> something (<code>readOnly == false</code>) with time, user and result.</li>
<li>Count flow-log bytes per source IP for ACCEPTed traffic and find the one source that is not a customer (customers are 198.51.100.x).</li>
<li>Write the Logs Insights query that would find StopLogging/DeleteTrail in a log group receiving CloudTrail.</li>
</ol>
<p><strong>Done when:</strong> 1 gives 5 events (ConsoleLogin by an, StopLogging, DeleteFlowLogs, RunInstances with Client.UnauthorizedOperation, StartLogging by an) — e.g. <code>jq -r '.Records[] | select(.readOnly == false) | [.eventTime, .userIdentity.userName, .eventName, (.errorCode // "OK")] | @tsv'</code>; 2 uses <code>awk '$13 == "ACCEPT" {b[$4] += $10} END {for (i in b) print b[i], i}' | sort -rn</code> and singles out 203.0.113.50 (22880 bytes, all to port 5432) as the only non-198.51.100.x source; 3 is like <code>fields @timestamp, userIdentity.userName, sourceIPAddress | filter eventName in ["StopLogging", "DeleteTrail"]</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['log group / stream / event', 'CloudWatch Logs hierarchy: per app, per source, timestamp + message. Default retention: never expire.'],
  ['Logs Insights', 'CloudWatch query language (fields, filter, stats, sort); billed per GB scanned.'],
  ['CloudTrail', 'AWS API audit log: userIdentity, eventSource, eventName, sourceIPAddress, errorCode; Event history keeps 90 days.'],
  ['trail', 'Configuration that delivers CloudTrail events to S3/CloudWatch; StopLogging turns it off.'],
  ['VPC Flow Logs', 'Per-flow network records: src/dst IP and port, protocol, bytes, ACCEPT/REJECT; no payload.'],
  ['Activity Log / Cloud Audit Logs', 'Azure / Google Cloud equivalents of CloudTrail.'],
  ['T1685.002', 'ATT&CK: disable or modify cloud logs (formerly T1562.008).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Three questions: what did the app print (CloudWatch Logs), who did what (CloudTrail), which IP talked to which (flow logs).</li>
<li>CloudWatch log groups never expire by default; set retention.</li>
<li>Emulators validate calls, not queries — filter patterns were ignored by moto.</li>
<li>Read CloudTrail as who/what/when/where/result; bursts of AccessDenied and StopLogging are top alerts.</li>
<li>Flow logs carry no content; correlate them with CloudTrail by IP and time; SKIPDATA is a gap.</li>
<li>Attackers disable logging first: alert on it and deliver logs to an account they cannot reach.</li>
</ul>
${nguon('📘', 'CloudTrail record contents', 'userIdentity, eventSource, eventName, sourceIPAddress, errorCode…', 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html')}
${nguon('📘', 'VPC Flow Log records', 'Default format, fields, NODATA/SKIPDATA', 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html')}
${nguon('📘', 'CloudWatch Logs Insights', 'Query syntax and examples', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html')}
${nguon('📘', 'Azure Monitor activity log', 'Categories, retention, sending to Log Analytics', 'https://learn.microsoft.com/en-us/azure/azure-monitor/platform/activity-log')}
${nguon('📘', 'Google Cloud Logging query language', 'Syntax for Logs Explorer', 'https://cloud.google.com/logging/docs/view/logging-query-language')}
${nguon('🛡️', 'MITRE ATT&CK T1685.002 — Disable or Modify Cloud Logs', 'Procedure examples: Pacu, APT29; detection of StopLogging/DeleteTrail', 'https://attack.mitre.org/techniques/T1685/002/')}
${nguon('🛡️', 'AWS Security Hub — CloudWatch controls', 'Metric filters and alarms for CloudTrail configuration changes', 'https://docs.aws.amazon.com/securityhub/latest/userguide/cloudwatch-controls.html')}
${nguon('🛡️', 'Capital One — 2019 cyber incident facts', 'Reported by an external researcher on 17 July 2019', 'https://www.capitalone.com/digital/facts2019/')}
${lienKet({ khoa: 'cloud-aws', bai: 'aws-10-1-logs', title: 'Cloud AWS 10.1 — CloudWatch Logs', sub: 'Retention, filter patterns, Logs Insights, cost on a real account', cta: 'Open lesson' })}
${lienKet({ khoa: 'cloud-aws', bai: 'aws-1-7-lo-khoa', title: 'Cloud AWS 1.7 — Leaked keys', sub: 'Real cases, CloudTrail, GuardDuty, the five response steps', cta: 'Open lesson' })}
${lienKet({ khoa: 'cloud-aws', bai: 'aws-3-6-vao-may', title: 'Cloud AWS 3.6 — Getting into private machines', sub: 'Includes VPC Flow Logs', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Log trên cloud: ba câu hỏi, ba loại log, nhà cung cấp nào cũng vậy</h2>
<p class="lead">Ở dự án cloud bạn sẽ nghe "xem CloudWatch đi", "tra CloudTrail", "kéo flow log về", hay ở Azure là "Log Analytics" và "Activity Log". Chúng trả lời ba câu hỏi khác nhau. Bài này dạy bạn nhận ra từng loại, đọc bản ghi của nó, và biết cần mở cái nào. Vận hành chúng trên tài khoản AWS thật (log group, metric filter, cảnh báo, tracing) là việc của khoá Cloud AWS; ở đây các lời gọi API chạy vào <strong>moto</strong>, một bộ giả lập AWS trên máy bạn, còn bản ghi CloudTrail/flow log là mẫu thực tế dựng đúng định dạng AWS mô tả (tài khoản <code>111122223333</code> và khoá <code>AKIAIOSFODNN7EXAMPLE</code> là giá trị ví dụ chính AWS dùng trong tài liệu).</p>

<h3>Liên tưởng đời thường: một toà chung cư</h3>
<p>Chuyện xảy ra <em>bên trong</em> từng căn hộ là việc của cư dân — nhật ký riêng của họ (log ứng dụng). Quầy lễ tân ghi ai đã quẹt thẻ mở cửa nào, và ai đã thay ổ khoá (log kiểm toán: CloudTrail). Camera ở cổng ghi xe ra vào, biển số và giờ, nhưng không biết trong cốp có gì (log luồng mạng). Tên trộm nào vào được quầy lễ tân trước tiên sẽ tìm cách tắt sổ quẹt thẻ.</p>

<h3>Bản đồ</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>AWS</th><th>Azure</th><th>Google Cloud</th></tr></thead>
<tbody>
<tr><td>Ứng dụng của tôi đã in ra gì?</td><td>CloudWatch Logs (log group → stream → event), tìm bằng Logs Insights</td><td>Azure Monitor Logs / Log Analytics workspace, truy vấn bằng KQL</td><td>Cloud Logging, Logs Explorer với Logging query language</td></tr>
<tr><td>Ai đã làm gì với tài nguyên nào, từ đâu?</td><td>CloudTrail (management event; data event tuỳ chọn)</td><td>Activity Log (control plane), log đăng nhập/kiểm toán của Entra ID</td><td>Cloud Audit Logs: Admin Activity (luôn bật), Data Access (phần lớn mặc định tắt)</td></tr>
<tr><td>IP nào nói chuyện với IP và cổng nào, được nhận hay bị từ chối?</td><td>VPC Flow Logs</td><td>Virtual network flow logs (NSG flow logs đang bị khai tử)</td><td>VPC Flow Logs</td></tr>
</tbody></table>
<p>Trước khi đọc được cái nào, phải có người bật nó lên và chọn nơi nó được gửi tới. "CloudTrail đã bật ở mọi region chưa, và nó gửi về đâu?" là câu hỏi đầu tiên ở một dự án mới.</p>

<h3>Phần A — CloudWatch Logs: API nằm bên dưới giao diện console</h3>
${lenh('s13/cloud', 1)}
${lenh('s13/cloud', 2)}
<p>Cấu trúc: mỗi ứng dụng hay hàm Lambda một <strong>log group</strong> (<code>/lab13/orders</code>), trong đó mỗi nguồn một <strong>log stream</strong> (một container, một bản chạy Lambda), và <strong>event</strong> = timestamp (epoch ms) + message. <code>retention None</code> nghĩa là <strong>không bao giờ hết hạn</strong>: mặc định. Bạn trả tiền lưu trữ mãi mãi trừ khi có người đặt nó.</p>
${lenh('s13/cloud', 3)}
${lenh('s13/cloud', 4)}
<p>Đây đúng là việc driver <code>awslogs</code> của Docker, runtime của Lambda hay CloudWatch agent làm hộ bạn: gửi các dòng JSON kèm timestamp. Message là một <em>chuỗi</em>; JSON của bạn nằm bên trong, nên jq cần <code>fromjson</code> (lại bài 10.4).</p>
${lenh('s13/cloud', 5)}
${lenh('s13/cloud', 6)}
<p>Trên AWS thật, filter pattern <code>{ $.level = "error" }</code> trả về một event. Bộ giả lập trả 3: moto nhận tham số rồi lờ nó đi. <strong>Bài học đáng giá hơn câu lệnh:</strong> bộ giả lập kiểm tra lời gọi của bạn có đúng hình dạng, không kiểm tra truy vấn của bạn có đúng nghĩa; hãy kiểm ngữ nghĩa truy vấn trên một tài khoản thật (sandbox). Bản jq thì cho đáp án đúng ở mọi nơi.</p>
${lenh('s13/cloud', 7)}
<p>Một truy vấn <strong>Logs Insights</strong> trên tài khoản thật trông thế này (mức nhận biết — chạy trong console trên log group của bạn; bộ giả lập không tính nó):</p>
<pre><code class="language-text">fields @timestamp, level, msg, ms
| filter level = "error"
| stats count(*) as errors by bin(5m)
| sort errors desc</code></pre>
<p>Insights tự nhận ra các trường JSON; bạn trả tiền theo GB <em>quét</em>, nên luôn thu hẹp khoảng thời gian trước. Tiền nạp (theo GB ghi vào) thường là khoản lớn nhất trên hoá đơn — con số và cách cắt giảm có ở khoá Cloud AWS và bài 16.2.</p>

<h3>Phần B — CloudTrail: quầy lễ tân</h3>
${lenh('s13/cloud', 8)}
${lenh('s13/cloud', 9)}
<p>Một trail chỉ là một cấu hình chép event vào S3 (và tuỳ chọn vào CloudWatch Logs). Một lời gọi API — <code>StopLogging</code> — là tắt nó, và <code>get-trail-status</code> hiện <code>IsLogging: false</code> kèm giờ. Bản thân lời gọi đó cũng được ghi thành một event. Giờ đọc một ngày event (mẫu) của một tài khoản có khoá CI bị lộ:</p>
${lenh('s13/cloud', 10)}
${lenh('s13/cloud', 11)}
<p>Bản ghi nào cũng trả lời cùng những câu hỏi: <strong>ai</strong> (<code>userIdentity</code>: loại, tên người dùng, access key), <strong>làm gì</strong> (<code>eventSource</code> + <code>eventName</code>), <strong>khi nào</strong> (<code>eventTime</code>, luôn là UTC), <strong>từ đâu</strong> (<code>sourceIPAddress</code>, <code>userAgent</code>), <strong>kết quả</strong> (<code>errorCode</code> hoặc <code>responseElements</code>). Lần đăng nhập console còn có <code>MFAUsed</code>.</p>
${lenh('s13/cloud', 12)}
<p>Một bảng, cả câu chuyện — đọc nó theo cách bài 14.5 sẽ dạy:</p>
<ol>
<li>02:41:07 <code>GetCallerIdentity</code> từ 203.0.113.50 bằng khoá dài hạn của người dùng CI (<code>AKIA…</code>). Đây là lệnh "tôi là ai" của kẻ tấn công — job CI hợp lệ hiếm khi cần nó. Đó là lời gọi đầu tiên phổ biến nhất sau khi lộ khoá.</li>
<li>02:41:12–02:41:29: một <code>ListBuckets</code>, rồi bốn lời gọi liệt kê IAM, đều <code>AccessDenied</code>. <strong>Dò quyền</strong>: một loạt AccessDenied từ cùng một khoá là cảnh báo chất lượng hàng đầu.</li>
<li>02:42:05–02:42:31: <code>DescribeTrails</code>, <code>StopLogging</code>, <code>DeleteFlowLogs</code> — tìm rồi bịt mắt camera. Các lệnh này thành công: role của CI rộng quá mức.</li>
<li>02:43:40 <code>RunInstances</code> 8 máy <code>p4d.24xlarge</code> (máy GPU) — mục tiêu là đào tiền ảo; thất bại với <code>Client.UnauthorizedOperation</code>.</li>
<li>08:12:55 người thật <code>an</code> từ IP văn phòng bật log lại — năm tiếng rưỡi điểm mù.</li>
</ol>
${lenh('s13/cloud', 13)}
${lenh('s13/cloud', 14)}
${lenh('s13/cloud', 15)}
${lenh('s13/cloud', 16)}
<p>User agent cho thấy tất cả đều đến từ AWS CLI trên Linux — CI của bạn chạy trong pipeline với chuỗi agent khác; lệch nhau là thêm một manh mối. Không có trail thì <strong>Event history</strong> của CloudTrail trong console vẫn giữ miễn phí 90 ngày management event gần nhất cho mỗi region — chỗ đầu tiên cần xem ở một tài khoản mà "chưa ai cài log".</p>

<h3>Phần C — VPC Flow Logs: camera ở cổng</h3>
${lenh('s13/cloud', 17)}
<p>Định dạng mặc định (phiên bản 2), mỗi luồng trong mỗi cửa sổ gộp là một dòng: <code>version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status</code>. <code>protocol 6</code> = TCP, <code>start/end</code> là epoch giây, <code>action</code> ACCEPT/REJECT là quyết định của security group và network ACL. Không có URL, không có nội dung, không có tên người dùng.</p>
${lenh('s13/cloud', 18)}
${lenh('s13/cloud', 19)}
${lenh('s13/cloud', 20)}
${lenh('s13/cloud', 21)}
<ul>
<li>60 lần REJECT ở cổng 22 từ hai IP: quét SSH nền, đã bị chặn đúng — nhiễu, không phải sự cố.</li>
<li>6 lần <strong>ACCEPT</strong> từ 203.0.113.50 tới <code>10.0.2.30:5432</code> trong khoảng 02:40 tới 02:43 — PostgreSQL truy cập được từ Internet, và cùng IP với câu chuyện CloudTrail. Hai nguồn độc lập, một tác nhân: tương quan theo IP và thời gian.</li>
<li><code>NODATA</code> = không có lưu lượng trong cửa sổ; <code>SKIPDATA</code> = bản ghi bị bỏ (do quá tải hoặc lỗi nội bộ) — một khoảng trống trong bằng chứng mà bạn phải nêu trong báo cáo.</li>
</ul>

<h3>Azure và Google Cloud, mỗi bên một đoạn</h3>
<p><strong>Azure:</strong> <em>Activity Log</em> ghi các thao tác control plane trên tài nguyên (ai đã xoá một VM, đổi một network security group) kèm người gọi, tên thao tác, trạng thái và correlation id; nó được giữ 90 ngày trừ khi bạn chuyển nó vào một Log Analytics workspace, nơi bạn truy vấn bằng KQL (<code>AzureActivity | where OperationNameValue endswith "DELETE"</code>). Đăng nhập nằm ở sign-in log của Microsoft Entra ID, một chỗ khác.</p>
<p><strong>Google Cloud:</strong> Cloud Logging chứa mọi thứ; log kiểm toán <em>Admin Activity</em> luôn được ghi và không tắt được, log kiểm toán <em>Data Access</em> (ai đã đọc dữ liệu nào) mặc định tắt với phần lớn dịch vụ. Truy vấn trong Logs Explorer trông như <code>protoPayload.methodName="SetIamPolicy" AND severity&gt;=WARNING</code>.</p>

<h3>Góc hacker: bịt mắt camera trước tiên</h3>
<p>MITRE ATT&amp;CK xếp "tắt hoặc sửa log cloud" vào kỹ thuật <strong>T1685.002</strong> (trước đây mang số T1562.008 — bạn sẽ gặp cả hai). Ví dụ thực tế trong đó gồm bộ công cụ tấn công AWS mã nguồn mở <strong>Pacu</strong>, có thể tắt CloudTrail và VPC flow logs, và nhóm <strong>APT29</strong>, đã tắt Purview Audit trên các tài khoản Microsoft 365 trước khi lấy cắp email của họ. Phòng: cảnh báo khi có <code>StopLogging</code>, <code>DeleteTrail</code>, <code>UpdateTrail</code>, <code>PutEventSelectors</code>, <code>DeleteFlowLogs</code> (AWS Security Hub có các control dành đúng cho những metric filter này); gửi trail về một tài khoản lưu log riêng mà các tài khoản chạy ứng dụng không đụng được; không bao giờ cho khoá CI quyền <code>cloudtrail:*</code>. Và nhớ bài học kia từ Capital One (2019, khoảng 100 triệu người ở Mỹ và 6 triệu ở Canada): theo chính lời công ty, sự cố được <em>một nhà nghiên cứu bên ngoài báo</em> ngày 17/07/2019 — log có tồn tại, nhưng không ai được chúng cảnh báo.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, hoá đơn AWS của khách tăng gấp đôi sau một đêm:</strong> Cost Explorer cho thấy EC2 ở một region bạn chưa bao giờ dùng. Event history của CloudTrail ở region đó, lọc <code>RunInstances</code> → access key, IP, user agent. Đó là tin nhắn đầu tiên của bạn gửi người phụ trách bảo mật.</li>
<li><strong>Một Lambda "thỉnh thoảng hỏng" mà không có log:</strong> kiểm log group có tồn tại không và role của hàm có <code>logs:CreateLogStream</code>/<code>PutLogEvents</code> không; thiếu quyền thì từ phía bạn nhìn vào nó hỏng trong im lặng.</li>
<li><strong>"Có ai từ ngoài vào được cơ sở dữ liệu của mình không?":</strong> flow log trên network interface của DB, lọc <code>ACCEPT</code> vào cổng của nó từ địa chỉ không phải nội bộ. Nếu flow log đang tắt thì nói rõ: không có bằng chứng cũng là một phần của câu trả lời.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>python3 _demo/s13/cloud/tao-mau.py mau</code>. Liệt kê mọi event CloudTrail đã <em>thay đổi</em> thứ gì đó (<code>readOnly == false</code>) kèm giờ, người dùng và kết quả.</li>
<li>Cộng số byte flow log theo IP nguồn cho lưu lượng được ACCEPT và tìm nguồn duy nhất không phải khách hàng (khách là 198.51.100.x).</li>
<li>Viết truy vấn Logs Insights tìm StopLogging/DeleteTrail trong một log group đang nhận CloudTrail.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 ra 5 event (ConsoleLogin của an, StopLogging, DeleteFlowLogs, RunInstances với Client.UnauthorizedOperation, StartLogging của an) — ví dụ <code>jq -r '.Records[] | select(.readOnly == false) | [.eventTime, .userIdentity.userName, .eventName, (.errorCode // "OK")] | @tsv'</code>; câu 2 dùng <code>awk '$13 == "ACCEPT" {b[$4] += $10} END {for (i in b) print b[i], i}' | sort -rn</code> và tách ra 203.0.113.50 (22880 byte, toàn bộ vào cổng 5432) là nguồn duy nhất không thuộc 198.51.100.x; câu 3 kiểu như <code>fields @timestamp, userIdentity.userName, sourceIPAddress | filter eventName in ["StopLogging", "DeleteTrail"]</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['log group / stream / event', 'Cấu trúc CloudWatch Logs: theo ứng dụng, theo nguồn, timestamp + message. Retention mặc định: không bao giờ hết hạn.'],
  ['Logs Insights', 'Ngôn ngữ truy vấn của CloudWatch (fields, filter, stats, sort); tính tiền theo GB quét.'],
  ['CloudTrail', 'Log kiểm toán API của AWS: userIdentity, eventSource, eventName, sourceIPAddress, errorCode; Event history giữ 90 ngày.'],
  ['trail', 'Cấu hình gửi event CloudTrail vào S3/CloudWatch; StopLogging là tắt nó.'],
  ['VPC Flow Logs', 'Bản ghi mạng theo luồng: IP và cổng nguồn/đích, giao thức, byte, ACCEPT/REJECT; không có nội dung.'],
  ['Activity Log / Cloud Audit Logs', 'Tương đương CloudTrail ở Azure / Google Cloud.'],
  ['T1685.002', 'ATT&CK: tắt hoặc sửa log cloud (trước đây là T1562.008).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba câu hỏi: ứng dụng in gì (CloudWatch Logs), ai làm gì (CloudTrail), IP nào nói với IP nào (flow log).</li>
<li>Log group CloudWatch mặc định không bao giờ hết hạn; hãy đặt retention.</li>
<li>Bộ giả lập kiểm lời gọi, không kiểm truy vấn — moto đã lờ filter pattern.</li>
<li>Đọc CloudTrail theo ai/làm gì/khi nào/từ đâu/kết quả; loạt AccessDenied và StopLogging là cảnh báo hàng đầu.</li>
<li>Flow log không có nội dung; tương quan với CloudTrail theo IP và thời gian; SKIPDATA là một khoảng trống.</li>
<li>Kẻ tấn công tắt log đầu tiên: cảnh báo việc đó và gửi log tới một tài khoản họ không với tới.</li>
</ul>
${nguon('📘', 'CloudTrail record contents', 'userIdentity, eventSource, eventName, sourceIPAddress, errorCode…', 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html')}
${nguon('📘', 'VPC Flow Log records', 'Định dạng mặc định, các trường, NODATA/SKIPDATA', 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html')}
${nguon('📘', 'CloudWatch Logs Insights', 'Cú pháp truy vấn và ví dụ', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html')}
${nguon('📘', 'Azure Monitor activity log', 'Nhóm sự kiện, thời gian giữ, gửi sang Log Analytics', 'https://learn.microsoft.com/en-us/azure/azure-monitor/platform/activity-log')}
${nguon('📘', 'Google Cloud Logging query language', 'Cú pháp cho Logs Explorer', 'https://cloud.google.com/logging/docs/view/logging-query-language')}
${nguon('🛡️', 'MITRE ATT&CK T1685.002 — Disable or Modify Cloud Logs', 'Ví dụ thực tế: Pacu, APT29; phát hiện StopLogging/DeleteTrail', 'https://attack.mitre.org/techniques/T1685/002/')}
${nguon('🛡️', 'AWS Security Hub — CloudWatch controls', 'Metric filter và cảnh báo khi cấu hình CloudTrail đổi', 'https://docs.aws.amazon.com/securityhub/latest/userguide/cloudwatch-controls.html')}
${nguon('🛡️', 'Capital One — sự thật về sự cố 2019', 'Do nhà nghiên cứu bên ngoài báo ngày 17/07/2019', 'https://www.capitalone.com/digital/facts2019/')}
${lienKet({ khoa: 'cloud-aws', bai: 'aws-10-1-logs', title: 'Cloud AWS 10.1 — CloudWatch Logs', sub: 'Retention, filter pattern, Logs Insights, chi phí trên tài khoản thật', cta: 'Mở bài' })}
${lienKet({ khoa: 'cloud-aws', bai: 'aws-1-7-lo-khoa', title: 'Cloud AWS 1.7 — Lộ khoá', sub: 'Vụ thật, CloudTrail, GuardDuty, năm bước xử lý', cta: 'Mở bài' })}
${lienKet({ khoa: 'cloud-aws', bai: 'aws-3-6-vao-may', title: 'Cloud AWS 3.6 — Vào máy trong mạng riêng', sub: 'Có phần VPC Flow Logs', cta: 'Mở bài' })}
</div>
`,
};
