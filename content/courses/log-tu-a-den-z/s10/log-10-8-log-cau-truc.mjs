/**
 * 10.8 — Log JSON có cấu trúc: tên trường chung, mỗi sự kiện một dòng, bẫy nhiều dòng (soạn 24/11/2026).
 * Output thật: OUT['s10/cau-truc'] (jq 1.7 trên log Lab 10: access.log, access.json, app.log). ECS/OTel: đối chiếu tài liệu gốc (link cuối bài).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '10.8 — Structured JSON logs: common field names (ECS, OpenTelemetry), one event per line, multiline traps|||10.8 — Log JSON có cấu trúc: tên trường chung (ECS, OpenTelemetry), mỗi sự kiện một dòng, bẫy nhiều dòng',
  slug: 'log-10-8-log-cau-truc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng một request trong ba hình dạng (dòng chữ nginx, JSON nginx, JSON pino) và vì sao máy thích JSON; một sự kiện một dòng — 448 dòng nhưng chỉ 435 sự kiện vì stack trace; bảng đối chiếu tên trường pino/winston/Logback/ECS/OpenTelemetry (thời gian, mức, thông điệp, trace id, HTTP); đổi tên trường sang ECS bằng jq; bẫy kiểu dữ liệu, giờ epoch hay ISO, trường lồng hay có dấu chấm; JSON chặn chèn dòng log giả mà log chữ thì không.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.8</span>
<h2>Structured logs: one event, one line, field names everyone agrees on</h2>
<p class="lead">You have now read the same events in many dialects: nginx text, nginx JSON, pino, winston, Logback, ECS. In a company with ten services and three languages, that variety is the enemy: every query must know every dialect. Structured logging means two promises — <strong>each event is one self-contained record</strong>, and <strong>fields have agreed names and types</strong>. This lesson shows what breaks when those promises are not kept, using Lab 10's real files.</p>

<h3>The everyday picture: the shared spreadsheet</h3>
<p>Five classmates fill one spreadsheet of expenses. One writes dates as 24/11, another as 2026-11-24, a third as "Monday"; one types amounts as 50000, another as "50k". Summing the column is now impossible. A team agrees on column names and formats on day one. Structured logging is that agreement, for machines.</p>

<h3>Step 1 — one request, three shapes</h3>
${lenh('s10/cau-truc', 0)}
<p>The same failed request in nginx text format (you need awk and knowledge of column positions) and in nginx JSON (you ask for <code>.status</code>). The app side of the same request, already seen in 10.4, is a third shape with different names (<code>req.id</code> instead of <code>rid</code>, <code>res.statusCode</code> instead of <code>status</code>). Machines like JSON because a field is found <em>by name</em>, not by position: adding a field in the middle does not break every parser, and values with spaces or quotes cannot shift the columns.</p>

<h3>Step 2 — one event per line, really?</h3>
${lenh('s10/cau-truc', 1)}
<p>448 lines but 435 events: 13 lines belong to the plain-text crash report (10.4). Any tool that assumes "one line = one event" — <code>wc -l</code>, a log shipper, Loki, Elasticsearch — sees 13 nonsense events: <code>"    at route (/w/app.js:44:20)"</code> as its own record, with no time and no level. The usual causes of multiline events, and the fixes:</p>
<table>
<thead><tr><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>Stack traces printed by the runtime (Node crash, JVM <code>printStackTrace</code>)</td><td>Catch at the top level and log through the logger (Node: <code>process.on('uncaughtException')</code> → logger then exit; Java: never <code>e.printStackTrace()</code>)</td></tr>
<tr><td>Text logger writing exceptions on several lines (Logback pattern)</td><td>JSON encoder: the stack trace becomes one string field (<code>stack_trace</code>, <code>error.stack_trace</code>)</td></tr>
<tr><td>Banners, <code>npm WARN</code>, Spring's ASCII logo on stdout</td><td>Turn them off in production (<code>spring.main.banner-mode=off</code>) or send to stderr</td></tr>
<tr><td>Old apps you cannot change</td><td>Shipper multiline rules: "a line that starts with whitespace + <code>at </code> belongs to the previous one" (Filebeat <code>multiline</code>, Alloy <code>stage.multiline</code> — Chapter 15)</td></tr>
</tbody></table>

<h3>Step 3 — agreeing on names: ECS and OpenTelemetry</h3>
<table>
<thead><tr><th>Meaning</th><th>pino</th><th>winston</th><th>Logback + logstash encoder</th><th>ECS (Elastic)</th><th>OpenTelemetry log record</th></tr></thead>
<tbody>
<tr><td>Time</td><td><code>time</code> (epoch ms)</td><td><code>timestamp</code></td><td><code>@timestamp</code></td><td><code>@timestamp</code></td><td><code>Timestamp</code></td></tr>
<tr><td>Level</td><td><code>level</code> 30/40/50</td><td><code>level</code> "info"</td><td><code>level</code> "INFO"</td><td><code>log.level</code></td><td><code>SeverityText</code> + <code>SeverityNumber</code> (INFO 9, WARN 13, ERROR 17)</td></tr>
<tr><td>Message</td><td><code>msg</code></td><td><code>message</code></td><td><code>message</code></td><td><code>message</code></td><td><code>Body</code></td></tr>
<tr><td>Service</td><td>your <code>base</code> field</td><td><code>defaultMeta</code></td><td>custom</td><td><code>service.name</code></td><td>Resource <code>service.name</code></td></tr>
<tr><td>Trace</td><td><code>req.id</code> (pino-http)</td><td>custom</td><td><code>traceId</code> (MDC)</td><td><code>trace.id</code></td><td><code>TraceId</code>, <code>SpanId</code></td></tr>
<tr><td>HTTP method / path / status</td><td><code>req.method</code>, <code>req.url</code>, <code>res.statusCode</code></td><td>custom</td><td>custom</td><td><code>http.request.method</code>, <code>url.path</code>, <code>http.response.status_code</code></td><td>same names (semantic conventions, shared with ECS since 2023)</td></tr>
<tr><td>Error</td><td><code>err.type</code>, <code>err.message</code>, <code>err.stack</code></td><td>custom</td><td><code>stack_trace</code></td><td><code>error.type</code>, <code>error.message</code>, <code>error.stack_trace</code></td><td><code>exception.type</code>, <code>exception.message</code>, <code>exception.stacktrace</code></td></tr>
</tbody></table>
<p>Elastic donated ECS to OpenTelemetry in 2023, and the two are converging on one set of semantic conventions. A practical team rule: <em>pick one schema (ECS or OTel), map every service to it</em>, either in the app (Spring Boot's <code>logging.structured.format.console=ecs</code>, <code>@elastic/ecs-pino-format</code> for Node) or in the log pipeline. The mapping is mechanical — here with jq on the pino log:</p>
${lenh('s10/cau-truc', 2)}

<h3>The other agreements: types, time, nesting</h3>
<ul>
<li><strong>Types are part of the contract.</strong> If one service sends <code>"status": 500</code> and another <code>"status": "500"</code>, Elasticsearch maps the field from the first document it sees and <em>rejects</em> or mis-indexes the other ("mapping conflict") — logs silently missing from searches. nginx JSON gives <code>urt</code> as a string because it may be <code>"-"</code> or <code>"0.1, 0.2"</code>: know such fields and convert at query time.</li>
<li><strong>Time: ISO 8601 in UTC with milliseconds</strong> (<code>2026-11-23T20:34:33.798Z</code>) is readable by humans and every tool. Epoch milliseconds (pino default) is compact but needs conversion when you read (<code>.time/1000|todate</code>). Never local time without an offset (lesson 1.5).</li>
<li><strong>Nested or dotted?</strong> <code>{"log":{"level":"INFO"}}</code> and <code>{"log.level":"INFO"}</code> mean the same in ECS, but jq needs <code>.log.level</code> for one and <code>."log.level"</code> for the other. Check one line before writing filters.</li>
<li><strong>Keep the message human, put data in fields.</strong> <code>"msg":"inventory call failed", "orderId":1007</code> lets you count failures per order; <code>"msg":"inventory call failed for order 1007"</code> does not — every message is different, so grouping by message is useless.</li>
<li><strong>Cardinality.</strong> Fields used as labels/indexes (Loki labels, Elasticsearch keyword fields used in aggregations) should have few distinct values: level, service, route pattern — not request id, user id or full URL (Chapter 15 and observability course).</li>
</ul>

<h3>Step 4 — JSON protects against forged lines</h3>
${lenh('s10/cau-truc', 3)}
${lenh('s10/cau-truc', 4)}
${lenh('s10/cau-truc', 5)}
<p>The text access log shows the attacker's User-Agent <code>\${jndi:…}</code> verbatim — harmless here, dangerous if some later tool interprets it. In JSON it is just a string value. And the login attempt with a newline and a fake <code>"level":30 … "login ok"</code> record inside the username: <code>grep 'level\\":30'</code> matches the line (text search sees the injected text), but jq shows the truth: <strong>one</strong> event, level 40, whose <code>user</code> field contains the forged text, escaped as <code>\\n</code> and <code>\\"</code>. A JSON logger escapes newlines and quotes, so an attacker cannot create a second line. A naive text logger can be fooled — lesson 10.9 shows it.</p>
<div class="pitfall co-tieu-de"><p><strong>Grep on JSON answers "does this text appear", not "does this field have this value".</strong> Use grep to find candidates fast, then jq to confirm by field. Reports based only on grep over JSON logs can be manipulated by whoever controls a logged string.</p></div>

<h3>Real-life situations</h3>
<ul>
<li><strong>Outsourcing team, three services, three languages:</strong> the Java service logs <code>traceId</code>, the Node service <code>req.id</code>, the Python one nothing. The client asks for "one dashboard". Your proposal: ECS field names everywhere, <code>trace.id</code> filled from the W3C <code>traceparent</code> header, ISO UTC time. That one-page decision is worth more than any dashboard.</li>
<li><strong>Your own project's logs in Grafana/Kibana show "unparsed" lines:</strong> look for multiline stack traces and banners; Step 2's <code>wc -l</code> versus <code>fromjson?</code> count tells you how many.</li>
<li><strong>What if</strong> the business wants "everything in the log, in case"? Structured logs make adding fields cheap — and that is how passwords and tokens end up in logs. Fields must be chosen, not dumped (lesson 16.3).</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Write a jq filter that converts every nginx <code>access.json</code> record to ECS names (<code>@timestamp</code>, <code>source.ip</code>, <code>http.request.method</code>, <code>url.original</code>, <code>http.response.status_code</code>, <code>event.duration</code> in nanoseconds, <code>user_agent.original</code>, <code>trace.id</code>).</li>
<li>Count how many lines of your <code>app.log</code> are not JSON, and show the first and last of them.</li>
<li>Find every field in <code>app.log</code> whose type differs between records (hint: <code>[paths(scalars)] </code> and <code>type</code>, or start with <code>.res.statusCode | type</code>).</li>
</ol>
<p><strong>Done when:</strong> 1 outputs 458 ECS records with numeric status; 2 gives 13 lines from <code>/w/app.js:44</code> to the supervisor line; 3 notices that <code>.res</code> is missing (null) on some records — a "type difference" your queries must handle.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['structured log', 'Each event is one self-contained record with named, typed fields (usually one JSON object per line).'],
  ['ECS', 'Elastic Common Schema: shared field names like @timestamp, log.level, trace.id, http.response.status_code.'],
  ['OpenTelemetry log data model', 'Timestamp, SeverityText/Number, Body, Attributes, TraceId, SpanId, Resource.'],
  ['semantic conventions', 'Agreed attribute names across telemetry (http.request.method, url.path…).'],
  ['multiline event', 'One event spread over several lines (stack trace); breaks line-based tools.'],
  ['mapping conflict', 'Same field name with different types across documents; the store rejects or mis-indexes some.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Fields by name beat columns by position; JSON escapes spaces, quotes and newlines.</li>
<li>One event = one line: route stack traces through the logger, JSON-encode them, or use shipper multiline rules.</li>
<li>Pick one schema (ECS/OTel) for all services; map in the app or the pipeline.</li>
<li>Agree on types, ISO UTC time, nesting; keep messages constant and data in fields.</li>
<li>grep finds text; jq confirms fields — injected text can fool grep but not a JSON parser.</li>
</ul>
${nguon('📘', 'Elastic Common Schema — field reference', 'Every ECS field, type and example', 'https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html')}
${nguon('📘', 'OpenTelemetry — Logs Data Model', 'Timestamp, severity numbers, body, attributes, trace context', 'https://opentelemetry.io/docs/specs/otel/logs/data-model/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-1-tu-console-toi-json', title: 'Observability 1.1 — From console.log to JSON', sub: 'Producing structured logs in your own code', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.8</span>
<h2>Log có cấu trúc: một sự kiện, một dòng, tên trường ai cũng đồng ý</h2>
<p class="lead">Đến giờ bạn đã đọc cùng những sự kiện bằng nhiều phương ngữ: chữ của nginx, JSON của nginx, pino, winston, Logback, ECS. Ở một công ty có mười dịch vụ và ba ngôn ngữ, sự đa dạng đó là kẻ thù: truy vấn nào cũng phải biết mọi phương ngữ. Log có cấu trúc nghĩa là hai lời hứa — <strong>mỗi sự kiện là một bản ghi trọn vẹn</strong>, và <strong>các trường có tên và kiểu đã thống nhất</strong>. Bài này cho thấy cái gì hỏng khi những lời hứa đó không được giữ, bằng chính các tệp thật của Lab 10.</p>

<h3>Liên tưởng đời thường: bảng tính chung</h3>
<p>Năm bạn cùng lớp điền chung một bảng chi tiêu. Một bạn ghi ngày là 24/11, bạn khác ghi 2026-11-24, bạn thứ ba ghi "thứ Hai"; một bạn gõ số tiền 50000, bạn khác gõ "50k". Cộng cột lúc này là bất khả. Một nhóm làm việc thống nhất tên cột và định dạng ngay ngày đầu. Log có cấu trúc chính là sự thống nhất đó, dành cho máy.</p>

<h3>Bước 1 — một request, ba hình dạng</h3>
${lenh('s10/cau-truc', 0)}
<p>Cùng một request hỏng ở dạng chữ của nginx (bạn cần awk và phải biết vị trí cột) và ở dạng JSON của nginx (bạn hỏi <code>.status</code>). Phía app của cùng request đó, đã thấy ở bài 10.4, là hình dạng thứ ba với tên khác (<code>req.id</code> thay vì <code>rid</code>, <code>res.statusCode</code> thay vì <code>status</code>). Máy thích JSON vì trường được tìm <em>theo tên</em>, không theo vị trí: thêm một trường ở giữa không làm hỏng mọi bộ phân tích, và giá trị có dấu cách hay dấu nháy không thể đẩy lệch cột.</p>

<h3>Bước 2 — mỗi sự kiện một dòng, thật không?</h3>
${lenh('s10/cau-truc', 1)}
<p>448 dòng nhưng chỉ 435 sự kiện: 13 dòng thuộc về báo cáo sập dạng chữ (bài 10.4). Mọi công cụ coi "một dòng = một sự kiện" — <code>wc -l</code>, bộ gửi log, Loki, Elasticsearch — sẽ thấy 13 sự kiện vô nghĩa: <code>"    at route (/w/app.js:44:20)"</code> thành một bản ghi riêng, không giờ, không mức. Các nguyên nhân hay gặp của sự kiện nhiều dòng, và cách sửa:</p>
<table>
<thead><tr><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Stack trace do runtime in ra (Node sập, JVM <code>printStackTrace</code>)</td><td>Bắt ở cấp cao nhất và ghi qua logger (Node: <code>process.on('uncaughtException')</code> → logger rồi thoát; Java: không bao giờ <code>e.printStackTrace()</code>)</td></tr>
<tr><td>Logger dạng chữ ghi ngoại lệ thành nhiều dòng (pattern Logback)</td><td>Encoder JSON: stack trace thành một trường chuỗi (<code>stack_trace</code>, <code>error.stack_trace</code>)</td></tr>
<tr><td>Banner, <code>npm WARN</code>, logo ASCII của Spring trên stdout</td><td>Tắt ở production (<code>spring.main.banner-mode=off</code>) hoặc đưa ra stderr</td></tr>
<tr><td>App cũ không sửa được</td><td>Luật multiline của bộ gửi log: "dòng bắt đầu bằng khoảng trắng + <code>at </code> thuộc về dòng trước" (Filebeat <code>multiline</code>, Alloy <code>stage.multiline</code> — Chương 15)</td></tr>
</tbody></table>

<h3>Bước 3 — thống nhất tên: ECS và OpenTelemetry</h3>
<table>
<thead><tr><th>Ý nghĩa</th><th>pino</th><th>winston</th><th>Logback + logstash encoder</th><th>ECS (Elastic)</th><th>Bản ghi log OpenTelemetry</th></tr></thead>
<tbody>
<tr><td>Thời điểm</td><td><code>time</code> (epoch ms)</td><td><code>timestamp</code></td><td><code>@timestamp</code></td><td><code>@timestamp</code></td><td><code>Timestamp</code></td></tr>
<tr><td>Mức</td><td><code>level</code> 30/40/50</td><td><code>level</code> "info"</td><td><code>level</code> "INFO"</td><td><code>log.level</code></td><td><code>SeverityText</code> + <code>SeverityNumber</code> (INFO 9, WARN 13, ERROR 17)</td></tr>
<tr><td>Thông điệp</td><td><code>msg</code></td><td><code>message</code></td><td><code>message</code></td><td><code>message</code></td><td><code>Body</code></td></tr>
<tr><td>Dịch vụ</td><td>trường <code>base</code> của bạn</td><td><code>defaultMeta</code></td><td>tự đặt</td><td><code>service.name</code></td><td>Resource <code>service.name</code></td></tr>
<tr><td>Trace</td><td><code>req.id</code> (pino-http)</td><td>tự đặt</td><td><code>traceId</code> (MDC)</td><td><code>trace.id</code></td><td><code>TraceId</code>, <code>SpanId</code></td></tr>
<tr><td>Phương thức / đường dẫn / mã HTTP</td><td><code>req.method</code>, <code>req.url</code>, <code>res.statusCode</code></td><td>tự đặt</td><td>tự đặt</td><td><code>http.request.method</code>, <code>url.path</code>, <code>http.response.status_code</code></td><td>cùng tên (semantic conventions, chung với ECS từ 2023)</td></tr>
<tr><td>Lỗi</td><td><code>err.type</code>, <code>err.message</code>, <code>err.stack</code></td><td>tự đặt</td><td><code>stack_trace</code></td><td><code>error.type</code>, <code>error.message</code>, <code>error.stack_trace</code></td><td><code>exception.type</code>, <code>exception.message</code>, <code>exception.stacktrace</code></td></tr>
</tbody></table>
<p>Năm 2023 Elastic đã tặng ECS cho OpenTelemetry, và hai bên đang hợp nhất về một bộ semantic conventions. Quy tắc thực tế của một đội: <em>chọn một lược đồ (ECS hoặc OTel), đưa mọi dịch vụ về nó</em>, ngay trong app (<code>logging.structured.format.console=ecs</code> của Spring Boot, <code>@elastic/ecs-pino-format</code> cho Node) hoặc trong đường ống log. Việc đổi tên là cơ học — đây là với jq trên log pino:</p>
${lenh('s10/cau-truc', 2)}

<h3>Những thống nhất khác: kiểu, thời gian, lồng nhau</h3>
<ul>
<li><strong>Kiểu dữ liệu là một phần của hợp đồng.</strong> Nếu dịch vụ này gửi <code>"status": 500</code> còn dịch vụ kia <code>"status": "500"</code>, Elasticsearch định kiểu trường theo tài liệu đầu tiên nó thấy và <em>từ chối</em> hoặc lập chỉ mục sai cái còn lại ("mapping conflict") — log lặng lẽ biến mất khỏi kết quả tìm kiếm. JSON của nginx cho <code>urt</code> là chuỗi vì nó có thể là <code>"-"</code> hay <code>"0.1, 0.2"</code>: nhớ những trường như vậy và chuyển kiểu lúc truy vấn.</li>
<li><strong>Thời gian: ISO 8601 theo UTC kèm mili giây</strong> (<code>2026-11-23T20:34:33.798Z</code>) người đọc được và mọi công cụ đều hiểu. Epoch mili giây (mặc định của pino) gọn nhưng phải đổi khi đọc (<code>.time/1000|todate</code>). Không bao giờ dùng giờ địa phương thiếu độ lệch (bài 1.5).</li>
<li><strong>Lồng nhau hay có dấu chấm?</strong> <code>{"log":{"level":"INFO"}}</code> và <code>{"log.level":"INFO"}</code> cùng nghĩa trong ECS, nhưng jq cần <code>.log.level</code> cho cái đầu và <code>."log.level"</code> cho cái sau. Xem một dòng trước khi viết bộ lọc.</li>
<li><strong>Giữ thông điệp cho người đọc, đặt dữ liệu vào trường.</strong> <code>"msg":"inventory call failed", "orderId":1007</code> cho bạn đếm lỗi theo đơn hàng; <code>"msg":"inventory call failed for order 1007"</code> thì không — thông điệp nào cũng khác nhau, gom theo thông điệp thành vô dụng.</li>
<li><strong>Cardinality (số giá trị khác nhau).</strong> Trường dùng làm nhãn/chỉ mục (nhãn của Loki, trường keyword của Elasticsearch dùng để gom nhóm) nên có ít giá trị khác nhau: mức, dịch vụ, mẫu route — không phải request id, user id hay URL đầy đủ (Chương 15 và khoá observability).</li>
</ul>

<h3>Bước 4 — JSON chặn dòng log giả</h3>
${lenh('s10/cau-truc', 3)}
${lenh('s10/cau-truc', 4)}
${lenh('s10/cau-truc', 5)}
<p>Access log dạng chữ hiện nguyên văn User-Agent của kẻ tấn công <code>\${jndi:…}</code> — ở đây vô hại, nhưng nguy hiểm nếu một công cụ nào đó phía sau diễn giải nó. Trong JSON nó chỉ là một giá trị chuỗi. Còn lần đăng nhập có ký tự xuống dòng và một bản ghi giả <code>"level":30 … "login ok"</code> nhét trong tên đăng nhập: <code>grep 'level\\":30'</code> khớp dòng đó (tìm chữ thì thấy chữ bị chèn), nhưng jq cho thấy sự thật: <strong>một</strong> sự kiện, mức 40, có trường <code>user</code> chứa đoạn chữ giả, đã được thoát thành <code>\\n</code> và <code>\\"</code>. Logger JSON thoát ký tự xuống dòng và dấu nháy, nên kẻ tấn công không tạo được dòng thứ hai. Logger dạng chữ ngây thơ thì bị lừa — bài 10.9 cho xem.</p>
<div class="pitfall co-tieu-de"><p><strong>grep trên JSON trả lời "chữ này có xuất hiện không", chứ không phải "trường này có giá trị này không".</strong> Dùng grep để tìm ứng viên cho nhanh, rồi jq để xác nhận theo trường. Báo cáo chỉ dựa vào grep trên log JSON có thể bị thao túng bởi bất kỳ ai điều khiển được một chuỗi được ghi log.</p></div>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Đội outsourcing, ba dịch vụ, ba ngôn ngữ:</strong> dịch vụ Java log <code>traceId</code>, dịch vụ Node log <code>req.id</code>, dịch vụ Python chẳng log gì. Khách muốn "một bảng điều khiển". Đề xuất của bạn: tên trường ECS ở mọi nơi, <code>trace.id</code> lấy từ header W3C <code>traceparent</code>, giờ ISO theo UTC. Quyết định dài một trang đó đáng giá hơn bất kỳ bảng điều khiển nào.</li>
<li><strong>Log dự án của bạn trong Grafana/Kibana hiện dòng "unparsed":</strong> tìm stack trace nhiều dòng và banner; phép so <code>wc -l</code> với số đếm <code>fromjson?</code> ở Bước 2 cho bạn biết có bao nhiêu.</li>
<li><strong>Nếu</strong> phía nghiệp vụ muốn "cứ log hết, phòng khi cần"? Log có cấu trúc khiến việc thêm trường rất rẻ — và đó là cách mật khẩu với token lọt vào log. Trường phải được chọn, không phải đổ đống (bài 16.3).</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết bộ lọc jq đổi mọi bản ghi <code>access.json</code> của nginx sang tên ECS (<code>@timestamp</code>, <code>source.ip</code>, <code>http.request.method</code>, <code>url.original</code>, <code>http.response.status_code</code>, <code>event.duration</code> tính bằng nano giây, <code>user_agent.original</code>, <code>trace.id</code>).</li>
<li>Đếm số dòng trong <code>app.log</code> của bạn không phải JSON, và in dòng đầu, dòng cuối trong số đó.</li>
<li>Tìm mọi trường trong <code>app.log</code> có kiểu khác nhau giữa các bản ghi (gợi ý: <code>[paths(scalars)]</code> và <code>type</code>, hoặc bắt đầu bằng <code>.res.statusCode | type</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 ra 458 bản ghi ECS với mã trạng thái là số; câu 2 ra 13 dòng từ <code>/w/app.js:44</code> tới dòng supervisor; câu 3 nhận ra <code>.res</code> vắng (null) ở một số bản ghi — một "khác biệt kiểu" mà truy vấn của bạn phải xử lý.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['structured log (log có cấu trúc)', 'Mỗi sự kiện là một bản ghi trọn vẹn với các trường có tên và kiểu (thường mỗi dòng một đối tượng JSON).'],
  ['ECS', 'Elastic Common Schema: tên trường chung như @timestamp, log.level, trace.id, http.response.status_code.'],
  ['mô hình dữ liệu log OpenTelemetry', 'Timestamp, SeverityText/Number, Body, Attributes, TraceId, SpanId, Resource.'],
  ['semantic conventions', 'Tên thuộc tính thống nhất trong mọi loại telemetry (http.request.method, url.path…).'],
  ['sự kiện nhiều dòng', 'Một sự kiện trải trên nhiều dòng (stack trace); làm hỏng công cụ xử lý theo dòng.'],
  ['mapping conflict', 'Cùng tên trường mà khác kiểu giữa các tài liệu; kho lưu từ chối hoặc lập chỉ mục sai một số.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tìm trường theo tên thắng tìm cột theo vị trí; JSON thoát dấu cách, dấu nháy và ký tự xuống dòng.</li>
<li>Một sự kiện = một dòng: cho stack trace đi qua logger, mã hoá JSON chúng, hoặc dùng luật multiline của bộ gửi log.</li>
<li>Chọn một lược đồ (ECS/OTel) cho mọi dịch vụ; đổi tên trong app hoặc trong đường ống.</li>
<li>Thống nhất kiểu, giờ ISO UTC, cách lồng; giữ thông điệp cố định và đưa dữ liệu vào trường.</li>
<li>grep tìm chữ; jq xác nhận trường — chữ bị chèn lừa được grep nhưng không lừa được bộ phân tích JSON.</li>
</ul>
${nguon('📘', 'Elastic Common Schema — field reference', 'Mọi trường ECS, kiểu và ví dụ', 'https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html')}
${nguon('📘', 'OpenTelemetry — Logs Data Model', 'Timestamp, số mức nghiêm trọng, body, attributes, trace context', 'https://opentelemetry.io/docs/specs/otel/logs/data-model/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-1-tu-console-toi-json', title: 'Observability 1.1 — Từ console.log tới JSON', sub: 'Tự sinh log có cấu trúc trong mã của bạn', cta: 'Mở bài' })}
</div>
`,
};
