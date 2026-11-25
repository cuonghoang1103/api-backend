/**
 * 6.3 — Lỗi dữ liệu gửi nhận: JSON, mã hoá ký tự, ngày giờ và múi giờ, số lớn (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: API node:http (Node 22.22) sau nginx 1.27.5, dịch vụ hoá đơn Spring Boot 4.1.1 (Jackson 3, Tomcat 11.0.24, JDK 25),
 * Python 3 + requests 2.33.1 — scratchpad/dbg/lab/ch6 (tools/c63-du-lieu.sh, gui-cat-doi.mjs, requests-charset.py; o-63-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { JAVA, JAVA_PROPS, GUI_CAT_DOI, CHAY_JAVA } from './_ma-6.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_SO = `<div class="out">$ curl -s 127.0.0.1:41612/hoa-don/1864276489217638401          # straight to the Java service
{"id":1864276489217638401,"khach":"SE1801","tong":125000.50,"taoLuc":"2026-11-24T08:30:00","hanTra":"2026-12-01T17:00:00+07:00"}

$ curl -s 127.0.0.1:41610/api/hoa-don/1864276489217638401       # through nginx → Node → Java
{"id":1864276489217638400,"khach":"SE1801","tong":125000.5,"taoLuc":"2026-11-24T08:30:00","hanTra":"2026-12-01T17:00:00+07:00"}
          ↑ last digit changed                      ↑ trailing zero gone

$ curl -s -i 127.0.0.1:41610/api/hoa-don/1864276489217638400    # the UI uses the id it received to open the detail page
HTTP/1.1 404 Not Found
{"timestamp":"2026-11-23T22:21:36.194Z","status":404,"error":"Not Found","path":"/hoa-don/1864276489217638400"}

$ node -p 'Number.MAX_SAFE_INTEGER'
9007199254740991
$ node -p 'JSON.parse("{\\"id\\":1864276489217638401}").id'
1864276489217638400
$ node -p '1864276489217638401 === 1864276489217638400'
true
$ node -e 'JSON.stringify({ id: 1864276489217638401n })'
TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (&lt;anonymous&gt;)</div>`;

const OUT_SO_SUA = `<div class="out">$ curl -s 127.0.0.1:41610/api/hoa-don/1864276489217638401       # Node fixed (SUA=id): JSON.parse reviver reads the source text
{"id":"1864276489217638401","khach":"SE1801","tong":125000.5,…}
$ curl -s 127.0.0.1:41612/v2/hoa-don/1864276489217638401        # Java v2: @JsonFormat(shape = STRING)
{"id":"1864276489217638401","khach":"SE1801","tong":125000.50,"hanTra":"2026-12-01T17:00:00+07:00"}</div>`;

const MA_SO_SUA = ma(`// Node 22: the reviver receives a 3rd argument with the ORIGINAL text of each primitive
JSON.parse(text, (key, value, ctx) => (key === 'id' ? ctx.source : value));   // "1864276489217638401" stays exact

// Java: send the id as a string (what Twitter did in 2010 with id_str)
record HoaDonV2(@JsonFormat(shape = JsonFormat.Shape.STRING) Long id, String khach, BigDecimal tong, OffsetDateTime hanTra) {}`);

const OUT_CHUNK = `<div class="out">$ node tools/gui-cat-doi.mjs           # one JSON body, sent as two TCP writes split inside the letter "ễ" (e1 bb 85)
body 86 byte, cắt ở byte 30: …4e677579e1 | bb856e20…
201 {"id":2,"phong":401,"nguoiDat":"Nguy���n Thị Hương","batDau":"2026-11-25T01:00:00.000Z"}     ← bug: s += chunk

# same request, server fixed (SUA=body: collect Buffers, decode once)
201 {"id":2,"phong":401,"nguoiDat":"Nguyễn Thị Hương","batDau":"2026-11-25T01:00:00.000Z"}</div>`;

const MA_CHUNK = ma(`// WRONG: each chunk is decoded on its own; a 3-byte letter cut between chunks becomes U+FFFD (�)
let s = ''; for await (const c of req) s += c;

// RIGHT: keep bytes, decode once at the end (or use a StringDecoder / req.setEncoding('utf8'))
const parts = []; for await (const c of req) parts.push(c);
const s = Buffer.concat(parts).toString('utf8');`);

const OUT_LATIN = `<div class="out">$ node -p "Buffer.from('Phòng Lab 401 — Nguyễn').toString('latin1')"
PhÃ²ng Lab 401 â Nguyá»n

$ python3 -I tools/requests-charset.py     # server answers text/plain WITHOUT charset
Content-Type : text/plain
r.encoding   : ISO-8859-1
r.text       : PhÃ²ng Lab 401 â Nguyá»n Thá» HÆ°Æ¡ng
r.content.decode("utf-8"): Phòng Lab 401 — Nguyễn Thị Hương</div>`;

const OUT_GIO = `<div class="out">$ curl -s --json '{"phong":401,"nguoiDat":"SE1807","batDau":"2026-11-25T08:00"}' 127.0.0.1:41610/api/dat-cho   # dev laptop, TZ=Asia/Ho_Chi_Minh
{"id":2,"phong":401,"nguoiDat":"SE1807","batDau":"2026-11-25T01:00:00.000Z"}
$ curl -s --json '{"phong":401,"nguoiDat":"SE1807","batDau":"2026-11-25T08:00"}' 127.0.0.1:41610/api/dat-cho   # server, TZ=UTC
{"id":2,"phong":401,"nguoiDat":"SE1807","batDau":"2026-11-25T08:00:00.000Z"}

$ TZ=Asia/Ho_Chi_Minh node -p "new Date('2026-11-25T01:00:00.000Z').toLocaleString('vi-VN')+'  |  '+new Date('2026-11-25T08:00:00.000Z').toLocaleString('vi-VN')"
08:00:00 25/11/2026  |  15:00:00 25/11/2026            ← the same request, shown to a user in Vietnam: 7 hours apart

$ TZ=America/New_York node -p "new Date('2026-11-25').toDateString() + '  |  ' + new Date('2026-11-25T00:00').toDateString()"
Tue Nov 24 2026  |  Wed Nov 25 2026                    ← date-only = UTC, date-time without offset = LOCAL

$ curl -s --json '{"phong":401,"nguoiDat":"SE1807","batDau":"2026-11-25T08:00"}' 127.0.0.1:41610/api/dat-cho   # fixed (SUA=ngay)
{"loi":"batDau phải có múi giờ, ví dụ 2026-11-25T08:00:00+07:00"}</div>`;

const OUT_SPRING = `<div class="out">$ curl -s -i -X POST -d '{"khach":"SE1801","tong":125000.5}' 127.0.0.1:41612/hoa-don
HTTP/1.1 415
{"timestamp":"2026-11-23T22:21:40.627Z","status":415,"error":"Unsupported Media Type","path":"/hoa-don"}
   log: WARN … Resolved [org.springframework.web.HttpMediaTypeNotSupportedException:
        Content-Type 'application/x-www-form-urlencoded;charset=UTF-8' is not supported]

$ curl -s --json '{"khach":"SE1801","Tong":125000.5,"han_tra":"2026-12-01T17:00:00+07:00"}' 127.0.0.1:41612/hoa-don
{"khach":"SE1801","tong":null,"hanTra":null}            ← two misspelled fields, silently ignored, 200 OK

$ curl -s -i --json '{"khach":"SE1801","tong":125000.5,"hanTra":"2026-12-01T17:00:00+07:00"}' 127.0.0.1:41612/hoa-don
HTTP/1.1 400
{"timestamp":"2026-11-23T22:21:40.665Z","status":400,"error":"Bad Request","path":"/hoa-don"}   ← the body says nothing
   log: WARN rid=d5bb5790 DefaultHandlerExceptionResolver : Resolved [… HttpMessageNotReadableException: JSON parse error:
        Cannot deserialize value of type \`java.time.LocalDateTime\` from String "2026-12-01T17:00:00+07:00": …
        Text '2026-12-01T17:00:00+07:00' could not be parsed, unparsed text found at index 19]

$ curl -s --json '{"khach":"SE1801","tong":125000.5,"hanTra":"2026-12-01T17:00:00"}' 127.0.0.1:41612/hoa-don
{"khach":"SE1801","tong":125000.5,"hanTra":"2026-12-01T17:00:00"}     ← accepted — but 17:00 in WHICH zone?

# with -Dspring.jackson.deserialization.fail-on-unknown-properties=true
$ curl -s -i --json '{"khach":"SE1801","Tong":125000.5}' 127.0.0.1:41612/hoa-don
HTTP/1.1 400
   log: Unrecognized property "Tong" (class vn.labflow.hoadon.TaoHoaDon), not marked as ignorable</div>`;

const OUT_TIEN = `<div class="out">$ node -p '0.1 + 0.2'
0.30000000000000004</div>`;

const BANG_VO_EN = `<table>
<thead><tr><th>You see</th><th>What happened</th></tr></thead>
<tbody>
<tr><td><code>Ã²</code>, <code>á»…</code>, <code>â€”</code>, <code>Ä‘</code></td><td>UTF-8 bytes read as Latin-1 / Windows-1252 (missing or wrong <code>charset</code>, Excel opening a CSV)</td></tr>
<tr><td><code>�</code> (U+FFFD)</td><td>bytes that are not valid UTF-8 at that point — a multi-byte letter cut in half, or real Latin-1 bytes read as UTF-8</td></tr>
<tr><td><code>?</code> instead of letters, already in the database</td><td>stored through a connection/column that cannot hold the character (MySQL <code>latin1</code>, <code>utf8</code> 3-byte without emoji) — data is lost</td></tr>
<tr><td><code>\\u1ec5</code></td><td>not a bug: JSON escape of "ễ"; any JSON parser reads it back</td></tr>
</tbody></table>`;

const BANG_VO_VI = `<table>
<thead><tr><th>Bạn thấy</th><th>Chuyện gì đã xảy ra</th></tr></thead>
<tbody>
<tr><td><code>Ã²</code>, <code>á»…</code>, <code>â€”</code>, <code>Ä‘</code></td><td>Byte UTF-8 bị đọc như Latin-1 / Windows-1252 (thiếu hoặc sai <code>charset</code>, Excel mở tệp CSV)</td></tr>
<tr><td><code>�</code> (U+FFFD)</td><td>các byte không phải UTF-8 hợp lệ ở chỗ đó — một chữ nhiều byte bị cắt đôi, hoặc byte Latin-1 thật bị đọc như UTF-8</td></tr>
<tr><td><code>?</code> thay cho chữ, nằm sẵn trong cơ sở dữ liệu</td><td>đã lưu qua kết nối/cột không chứa nổi ký tự (MySQL <code>latin1</code>, <code>utf8</code> 3 byte không có emoji) — dữ liệu đã mất</td></tr>
<tr><td><code>\\u1ec5</code></td><td>không phải lỗi: JSON escape của "ễ"; trình phân tích JSON nào cũng đọc lại được</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📜', 'RFC 8259 — The JSON Data Interchange Format', '§6: số ngoài khoảng IEEE 754 double làm mất độ chính xác; §8.1: JSON trao đổi giữa các hệ thống PHẢI là UTF-8.', 'https://www.rfc-editor.org/rfc/rfc8259'),
  nguon('🐦', 'X (Twitter) Docs — X IDs', 'Snowflake 64 bit, JavaScript chỉ giữ đúng 53 bit ⇒ dùng id_str (thêm từ năm 2010).', 'https://docs.x.com/fundamentals/x-ids'),
  nguon('📘', 'MDN — JSON.parse: reviver và context.source', 'Đọc nguyên văn chữ số của từng giá trị để giữ số lớn chính xác.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse'),
  nguon('🕒', 'RFC 3339 — Date and Time on the Internet', 'Dạng thời gian có độ lệch múi giờ (Z hoặc +07:00) nên dùng trong API.', 'https://www.rfc-editor.org/rfc/rfc3339'),
  nguon('🐍', 'Requests docs — Response.encoding', 'Khi header không có charset, requests đoán theo quy tắc HTTP cũ (ISO-8859-1 cho text/*).', 'https://requests.readthedocs.io/en/latest/api/#requests.Response.encoding'),
  nguon('🦊', 'Bishop Fox — An Exploration of JSON Interoperability Vulnerabilities (2021)', 'Khoá trùng, số lớn, UTF-8 hỏng: các trình phân tích JSON hiểu khác nhau và cách khai thác.', 'https://bishopfox.com/blog/json-interoperability-vulnerabilities'),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-5-thoi-gian', title: 'Log từ A đến Z 1.5 — Thời gian là trường khó nhất', sub: 'UTC, ISO 8601/RFC 3339, epoch, lệch đồng hồ giữa các máy.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-2-thoi-gian', title: 'Debug 8.2 — Lỗi thời gian', sub: 'Đồng hồ, DST, cron và test phụ thuộc giờ — chương 8.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '6.3 — Payload bugs: JSON, encoding, dates and time zones, big numbers|||6.3 — Lỗi dữ liệu gửi nhận: JSON, mã hoá ký tự, ngày giờ và múi giờ, số lớn',
  slug: 'dbg-6-3-du-lieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn họ lỗi dữ liệu chạy thật qua nginx → Node → Spring Boot: id snowflake 1864276489217638401 bị JavaScript làm tròn thành …400 rồi mở chi tiết ra 404 (sửa bằng JSON.parse context.source hoặc id dạng chuỗi như id_str của Twitter); tiếng Việt vỡ thành � vì ghép chunk bằng chuỗi, mojibake Ã² khi thiếu charset (Python requests đoán ISO-8859-1); giờ không múi giờ lệch 7 tiếng giữa máy dev và máy chủ UTC; Spring trả 415, trả 400 body rỗng vì LocalDateTime gặp +07:00, và lặng lẽ bỏ qua tên trường gõ sai.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>The request arrived. The data inside it did not.</h2>
<p class="lead">Status 200, no exception, and the data is wrong: an id off by one, a name with question marks, a booking seven hours late, a field that is always null. These bugs pass every "is it up?" check because nothing failed — the bytes were simply interpreted differently on each side of the wire. The method: put the raw bytes from both sides next to each other, and find the first hop where they differ.</p>

<h3>An everyday picture: a phone number read aloud</h3>
<p>You read a 19-digit account number over the phone; the listener writes only the first 16 and fills in zeros. A friend says "see you at 8" from Hà Nội to a friend in Tokyo — 8 o'clock whose? Someone fills a paper form in pencil, someone else photocopies it and half the accents disappear. None of these people lied; each just used a different convention. JSON payloads fail exactly like this.</p>

<h3>1. Content-Type: the label on the box</h3>
<p>The server decides how to read the body from <code>Content-Type</code>, not from what the body looks like. Lesson 6.2 showed <code>curl -d</code> sending <code>application/x-www-form-urlencoded</code>; a browser <code>fetch</code> with a string body and no header sends <code>text/plain;charset=UTF-8</code> (Lab 6.5). What happens next depends on the framework — and the worst behaviour is the quiet one:</p>
<ul>
<li><strong>Express</strong> <code>express.json()</code> skips bodies whose type is not JSON: <code>req.body</code> stays <code>{}</code> (Express 4) or <code>undefined</code> (Express 5 — checked with 5.3.0 and a browser-style <code>fetch</code> string body) and your code reports "missing field" — a misleading 400. Our <code>node:http</code> API copies that behaviour on purpose.</li>
<li><strong>Spring</strong> answers <code>415 Unsupported Media Type</code> — honest, but the reason is only in the server log (below).</li>
</ul>
<p>Fix both sides: clients always send <code>Content-Type: application/json</code>; servers reject other types with an explicit 415 message instead of pretending the body was empty.</p>

<h3>2. Big numbers: an id off by 1</h3>
${OUT_SO}
<p>JavaScript numbers are IEEE 754 doubles: integers are exact only up to 2<sup>53</sup> − 1 = 9,007,199,254,740,991. Java <code>Long</code> goes to 9.2 × 10<sup>18</sup>. Snowflake-style ids (Twitter, Discord, many order systems), Oracle sequences and bank references live above 2<sup>53</sup>. Spring sent the right digits; <code>JSON.parse</code> in our Node gateway rounded to the nearest double (spacing there is 256) and re-serialised it. Nothing threw. The next call with the rounded id returned 404 — a bug that looks like "data missing" two services away from its cause. The same happens in the browser: the Network tab's <em>Response</em> shows the true digits, the <em>Preview</em> tab (which parses JSON) shows the rounded ones — a great clue.</p>
<p>Notice also <code>125000.50</code> → <code>125000.5</code>: harmless for a number, but if the other side compared strings, or needed the scale of a <code>BigDecimal</code>, it changed. Money should travel as a string (<code>"125000.50"</code>) or as an integer in the smallest unit (đồng, cents), never as a float — because:</p>
${OUT_TIEN}
<p>Two fixes, both run here:</p>
${MA_SO_SUA}
${OUT_SO_SUA}
<p>Sending ids as strings is the robust contract (any client, any language); it is what Twitter did in 2010 when its ids passed 53 bits, adding <code>id_str</code> next to <code>id</code>, and what X API v2 does by default. Reading the source text is the fix when you cannot change the producer.</p>

<h3>3. Encoding: why Vietnamese breaks</h3>
<p>Vietnamese letters with two marks take 3 bytes in UTF-8 (<code>ễ</code> = <code>e1 bb 85</code>). Two independent ways to break them, both reproduced:</p>
${OUT_CHUNK}
${MA_CHUNK}
<p>This one is nasty because it depends on <em>where TCP cuts the stream</em>: small bodies arrive in one chunk and pass every test; a long note or a slow mobile network splits a letter and you get <code>�</code> — "only some users, only sometimes". The second way is reading correct UTF-8 bytes with the wrong table:</p>
${OUT_LATIN}
${BANG_VO_EN}
<p>Debugging rule: <strong>look at the bytes</strong>, not the rendered text. <code>curl -s … | xxd | head</code>, <code>Buffer.from(s).toString('hex')</code>, or <code>psql</code> <code>SELECT encode(convert_to(name,'UTF8'),'hex')</code>. If the bytes in the database are right, the bug is in reading/rendering; if they are already wrong, the bug is in writing — go back one hop.</p>

<h3>4. Dates and time zones: the 7-hour booking</h3>
${OUT_GIO}
<p>"2026-11-25T08:00" has <strong>no offset</strong>. JavaScript (and most libraries) interpret it in the local zone of <em>the machine running the code</em>. On your laptop (UTC+7) it is 01:00Z; on the server (containers and cloud machines are UTC) it is 08:00Z — shown back to a user in Vietnam as 15:00. Classic "works on my machine": every local test passes. And the opposite trap: a date-only string <code>"2026-11-25"</code> is parsed as UTC midnight, which is 24/11 for a user in New York (and 07:00 for a user in Vietnam).</p>
<p>The contract that ends this family of bugs:</p>
<ul>
<li>Instants (a booking start, a payment time) travel as RFC 3339 with an offset: <code>2026-11-25T01:00:00Z</code> or <code>2026-11-25T08:00:00+07:00</code>. The server rejects strings without an offset (our fix above).</li>
<li>Store <code>timestamptz</code> (PostgreSQL) / <code>Instant</code> or <code>OffsetDateTime</code> (Java); convert to the user's zone only when displaying.</li>
<li>Pure calendar dates (a birthday, a holiday) travel as <code>YYYY-MM-DD</code> and are never converted to <code>Date</code> objects in JS without care.</li>
</ul>

<h3>5. Spring's side: 415, a silent 400, and ignored fields</h3>
${OUT_SPRING}
<p>Three lessons from one service:</p>
<ul>
<li>Spring's default error body is deliberately vague (<code>"error":"Bad Request"</code>, no message — Boot hides it so you do not leak internals). <strong>The reason is in the server log</strong>, at WARN, from <code>DefaultHandlerExceptionResolver</code>. When a Spring API gives you a bare 400, ask for the log line with the request id (lesson 6.4), do not guess.</li>
<li><code>LocalDateTime</code> rejects an offset, and accepts a string without one — so the type that "works" is the one that loses the time zone. For instants use <code>OffsetDateTime</code>/<code>Instant</code> in DTOs.</li>
<li>Spring Boot turns off Jackson's <code>FAIL_ON_UNKNOWN_PROPERTIES</code>, so <code>"Tong"</code> or <code>"han_tra"</code> silently becomes <code>null</code>. Great for forward compatibility, terrible for debugging; turn it on in dev/test, or validate required fields with <code>@NotNull</code>.</li>
</ul>
<details><summary>The invoice service (HoaDonApp.java, application.properties, chay-java.sh) and the split-body client</summary>${ma(JAVA, 'java')}${ma(JAVA_PROPS, 'properties')}${ma(CHAY_JAVA, 'bash')}${ma(GUI_CAT_DOI)}</details>

<h3>Hacker corner: when two parsers disagree</h3>
<p>Every bug in this lesson is two components reading the same bytes differently. Attackers look for exactly that. Duplicate keys (<code>{"role":"user","role":"admin"}</code>) — some parsers keep the first, most keep the last; if a validating gateway reads one and the service reads the other, the check is bypassed. Bishop Fox's 2021 research "An Exploration of JSON Interoperability Vulnerabilities" documented such differences across dozens of parsers (duplicate keys, big numbers, comments, invalid UTF-8). Defence: validate where you use the data, reject duplicate keys and non-UTF-8 input, and use one parser per trust boundary.</p>

<h3>On the job</h3>
<p>Japanese and Korean clients of Vietnamese outsourcing companies often have Oracle or DB2 systems with 18–19 digit ids and Shift-JIS/EUC-KR legacy exports. Typical first-month tickets: "order detail 404 for some orders" (big id through a JS layer), "names garbled in the CSV export" (no BOM/charset, Excel), "report off by one day" (UTC midnight). Write the cause in the ticket as the <em>contract</em> that was broken ("id must be a string", "times must carry an offset") — that is what prevents the next team from repeating it.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Reproduce the big-id bug through the gateway; prove where the digits change by comparing the Java response with the Node response byte by byte. Apply both fixes.</li>
<li>Run <code>gui-cat-doi.mjs</code> against the buggy and the fixed server. Change the split point to fall between two letters and show that the bug disappears — explain why.</li>
<li>Decode <code>PhÃ²ng</code> back to <code>Phòng</code> in Node (hint: <code>Buffer.from(s, 'latin1').toString('utf8')</code>).</li>
<li>Run the API with <code>TZ=Asia/Ho_Chi_Minh</code> and with <code>TZ=UTC</code>; post the same body; write the rule your API should enforce.</li>
<li>In the Spring service, find the real reason of each bare 400 in the log; turn on <code>fail-on-unknown-properties</code> and observe the difference.</li>
</ol>
<p><strong>Done when:</strong> for each bug you can point to the exact hop where the bytes or their interpretation changed.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">MAX_SAFE_INTEGER</span><span class="v">2^53 − 1: the largest integer a JS number holds exactly.</span></div>
  <div class="kv"><span class="k">Snowflake id</span><span class="v">64-bit id = time + machine + sequence; usually above 2^53.</span></div>
  <div class="kv"><span class="k">Mojibake</span><span class="v">Text garbled by decoding bytes with the wrong character set.</span></div>
  <div class="kv"><span class="k">U+FFFD (�)</span><span class="v">Replacement character for invalid UTF-8 bytes.</span></div>
  <div class="kv"><span class="k">Offset</span><span class="v"><code>Z</code> or <code>+07:00</code> — what makes a date-time an instant.</span></div>
  <div class="kv"><span class="k">415</span><span class="v">Unsupported Media Type — the server will not read this Content-Type.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Content-Type decides how the body is read; reject wrong types loudly.</li>
<li>Ids above 2^53 must travel as strings; money as strings or integer minor units.</li>
<li>Decode bytes once; recognise mojibake patterns; inspect hex, not rendered text.</li>
<li>Instants carry an offset; store UTC; convert only for display.</li>
<li>A bare Spring 400 has its reason in the server log; unknown fields are ignored by default.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Request đã tới nơi. Dữ liệu bên trong thì chưa.</h2>
<p class="lead">Mã 200, không ngoại lệ nào, mà dữ liệu sai: id lệch một đơn vị, tên đầy dấu hỏi, lượt đặt trễ bảy tiếng, một trường lúc nào cũng null. Các lỗi này qua hết mọi phép kiểm "còn sống không?" vì chẳng có gì hỏng — chỉ là mỗi bên đường dây hiểu cùng các byte theo một kiểu. Phương pháp: đặt byte thô của hai bên cạnh nhau, tìm chặng đầu tiên mà chúng khác nhau.</p>

<h3>Liên tưởng đời thường: đọc số tài khoản qua điện thoại</h3>
<p>Bạn đọc một số tài khoản 19 chữ số qua điện thoại; người nghe chỉ ghi được 16 chữ số đầu rồi điền số 0. Một người ở Hà Nội hẹn bạn ở Tokyo "8 giờ gặp nhé" — 8 giờ của ai? Một người điền phiếu bằng bút chì, người khác photo lại và mất nửa số dấu. Không ai nói dối; mỗi người chỉ dùng một quy ước khác. Payload JSON hỏng y hệt như vậy.</p>

<h3>1. Content-Type: nhãn dán trên thùng hàng</h3>
<p>Server quyết định cách đọc body dựa vào <code>Content-Type</code>, chứ không dựa vào body trông ra sao. Bài 6.2 đã cho thấy <code>curl -d</code> gửi <code>application/x-www-form-urlencoded</code>; <code>fetch</code> của trình duyệt với body là chuỗi mà không có header thì gửi <code>text/plain;charset=UTF-8</code> (Lab 6.5). Chuyện tiếp theo tuỳ framework — và cách tệ nhất là cách im lặng:</p>
<ul>
<li><strong>Express</strong> <code>express.json()</code> bỏ qua body không phải JSON: <code>req.body</code> vẫn là <code>{}</code> (Express 4) hoặc <code>undefined</code> (Express 5 — đã thử với 5.3.0 và body chuỗi kiểu <code>fetch</code> của trình duyệt), và mã của bạn báo "thiếu trường" — một lỗi 400 gây hiểu nhầm. API <code>node:http</code> của mình cố ý bắt chước đúng hành vi đó.</li>
<li><strong>Spring</strong> trả <code>415 Unsupported Media Type</code> — thật thà, nhưng lý do chỉ nằm trong log server (bên dưới).</li>
</ul>
<p>Sửa cả hai phía: client luôn gửi <code>Content-Type: application/json</code>; server từ chối kiểu khác bằng một thông báo 415 rõ ràng thay vì giả vờ body rỗng.</p>

<h3>2. Số lớn: id lệch đúng 1</h3>
${OUT_SO}
<p>Số trong JavaScript là số thực IEEE 754 double: số nguyên chỉ chính xác tới 2<sup>53</sup> − 1 = 9.007.199.254.740.991. <code>Long</code> của Java lên tới 9,2 × 10<sup>18</sup>. Id kiểu snowflake (Twitter, Discord, nhiều hệ thống đơn hàng), sequence của Oracle, mã tham chiếu ngân hàng đều nằm trên 2<sup>53</sup>. Spring gửi đúng chữ số; <code>JSON.parse</code> trong cổng Node làm tròn về số double gần nhất (ở vùng đó hai số liền nhau cách nhau 256) rồi ghi lại. Không có gì ném lỗi. Lần gọi sau với id đã bị tròn trả 404 — một lỗi trông như "thiếu dữ liệu", cách nguyên nhân thật hai dịch vụ. Trình duyệt cũng vậy: tab <em>Response</em> trong Network hiện chữ số thật, tab <em>Preview</em> (có phân tích JSON) hiện số đã tròn — một manh mối rất tốt.</p>
<p>Để ý thêm <code>125000.50</code> → <code>125000.5</code>: vô hại với một con số, nhưng nếu bên kia so sánh chuỗi, hay cần đúng số chữ số thập phân của <code>BigDecimal</code>, thì nó đã đổi. Tiền nên đi dưới dạng chuỗi (<code>"125000.50"</code>) hoặc số nguyên theo đơn vị nhỏ nhất (đồng, cent), không bao giờ là số thực — vì:</p>
${OUT_TIEN}
<p>Hai cách sửa, đều đã chạy ở đây:</p>
${MA_SO_SUA}
${OUT_SO_SUA}
<p>Gửi id dạng chuỗi là hợp đồng chắc chắn nhất (client nào, ngôn ngữ nào cũng đúng); đó là điều Twitter làm năm 2010 khi id của họ vượt 53 bit, thêm <code>id_str</code> bên cạnh <code>id</code>, và X API v2 mặc định làm vậy. Đọc nguyên văn chữ số là cách sửa khi bạn không đổi được phía phát dữ liệu.</p>

<h3>3. Mã hoá ký tự: vì sao tiếng Việt vỡ</h3>
<p>Chữ Việt có hai dấu chiếm 3 byte trong UTF-8 (<code>ễ</code> = <code>e1 bb 85</code>). Hai cách làm vỡ độc lập, đều tái hiện được:</p>
${OUT_CHUNK}
${MA_CHUNK}
<p>Lỗi này hiểm vì nó phụ thuộc <em>TCP cắt dòng byte ở đâu</em>: body nhỏ tới trong một chunk và qua mọi test; một ghi chú dài hay mạng di động chậm cắt đôi một chữ là ra <code>�</code> — "chỉ vài người dùng, chỉ thỉnh thoảng". Cách thứ hai là đọc byte UTF-8 đúng bằng sai bảng mã:</p>
${OUT_LATIN}
${BANG_VO_VI}
<p>Luật gỡ lỗi: <strong>nhìn byte</strong>, đừng nhìn chữ đã hiển thị. <code>curl -s … | xxd | head</code>, <code>Buffer.from(s).toString('hex')</code>, hoặc trong <code>psql</code>: <code>SELECT encode(convert_to(name,'UTF8'),'hex')</code>. Byte trong cơ sở dữ liệu đúng ⇒ lỗi ở khâu đọc/hiển thị; byte đã sai sẵn ⇒ lỗi ở khâu ghi — lùi lại một chặng.</p>

<h3>4. Ngày giờ và múi giờ: lượt đặt lệch 7 tiếng</h3>
${OUT_GIO}
<p>"2026-11-25T08:00" <strong>không có độ lệch múi giờ</strong>. JavaScript (và đa số thư viện) hiểu nó theo múi giờ của <em>chiếc máy đang chạy mã</em>. Trên laptop của bạn (UTC+7) nó là 01:00Z; trên máy chủ (container và máy đám mây đều để UTC) nó là 08:00Z — hiện lại cho người dùng ở Việt Nam thành 15:00. Đúng kiểu "máy em chạy mà": mọi test trên máy mình đều qua. Và cái bẫy ngược lại: chuỗi chỉ có ngày <code>"2026-11-25"</code> được hiểu là nửa đêm UTC, tức ngày 24/11 với người dùng ở New York (và 07:00 với người dùng ở Việt Nam).</p>
<p>Hợp đồng chấm dứt cả họ lỗi này:</p>
<ul>
<li>Thời điểm (giờ bắt đầu lượt đặt, giờ thanh toán) đi dưới dạng RFC 3339 có độ lệch: <code>2026-11-25T01:00:00Z</code> hoặc <code>2026-11-25T08:00:00+07:00</code>. Server từ chối chuỗi thiếu độ lệch (bản sửa ở trên).</li>
<li>Lưu bằng <code>timestamptz</code> (PostgreSQL) / <code>Instant</code> hoặc <code>OffsetDateTime</code> (Java); chỉ đổi sang múi giờ người dùng lúc hiển thị.</li>
<li>Ngày thuần (sinh nhật, ngày lễ) đi dưới dạng <code>YYYY-MM-DD</code> và đừng vội biến thành đối tượng <code>Date</code> trong JS.</li>
</ul>

<h3>5. Phía Spring: 415, một lỗi 400 câm, và trường bị lờ đi</h3>
${OUT_SPRING}
<p>Ba bài học từ một dịch vụ:</p>
<ul>
<li>Body lỗi mặc định của Spring cố ý mơ hồ (<code>"error":"Bad Request"</code>, không có message — Boot giấu để không lộ bên trong). <strong>Lý do nằm trong log server</strong>, mức WARN, từ <code>DefaultHandlerExceptionResolver</code>. Khi một API Spring trả cho bạn lỗi 400 trơn, hãy xin dòng log kèm request id (bài 6.4), đừng đoán.</li>
<li><code>LocalDateTime</code> từ chối độ lệch, và chấp nhận chuỗi không có độ lệch — nên đúng cái kiểu "chạy được" lại là kiểu làm mất múi giờ. Với thời điểm, dùng <code>OffsetDateTime</code>/<code>Instant</code> trong DTO.</li>
<li>Spring Boot tắt <code>FAIL_ON_UNKNOWN_PROPERTIES</code> của Jackson, nên <code>"Tong"</code> hay <code>"han_tra"</code> lặng lẽ thành <code>null</code>. Tốt cho việc tương thích về sau, tệ cho việc gỡ lỗi; hãy bật nó ở dev/test, hoặc kiểm trường bắt buộc bằng <code>@NotNull</code>.</li>
</ul>
<details><summary>Dịch vụ hoá đơn (HoaDonApp.java, application.properties, chay-java.sh) và client gửi body cắt đôi</summary>${ma(JAVA, 'java')}${ma(JAVA_PROPS, 'properties')}${ma(CHAY_JAVA, 'bash')}${ma(GUI_CAT_DOI)}</details>

<h3>Góc hacker: khi hai trình phân tích bất đồng</h3>
<p>Mọi lỗi trong bài này đều là hai thành phần đọc cùng các byte theo hai cách. Kẻ tấn công đi tìm đúng điều đó. Khoá trùng (<code>{"role":"user","role":"admin"}</code>) — có trình phân tích giữ cái đầu, đa số giữ cái cuối; nếu cổng kiểm tra đọc một cái mà dịch vụ đọc cái kia thì phép kiểm bị vượt. Nghiên cứu năm 2021 của Bishop Fox, "An Exploration of JSON Interoperability Vulnerabilities", ghi lại các khác biệt như vậy ở hàng chục trình phân tích (khoá trùng, số lớn, chú thích, UTF-8 không hợp lệ). Phòng thủ: kiểm dữ liệu ở đúng nơi dùng nó, từ chối khoá trùng và đầu vào không phải UTF-8, mỗi ranh giới tin cậy chỉ dùng một trình phân tích.</p>

<h3>Tình huống đi làm</h3>
<p>Khách Nhật, Hàn của các công ty outsourcing Việt Nam hay có hệ thống Oracle hoặc DB2 với id 18–19 chữ số và dữ liệu xuất cũ bằng Shift-JIS/EUC-KR. Ticket điển hình tháng đầu: "chi tiết đơn 404 với một số đơn" (id lớn đi qua tầng JS), "tên bị vỡ trong tệp CSV xuất ra" (thiếu BOM/charset, Excel), "báo cáo lệch một ngày" (nửa đêm UTC). Hãy ghi nguyên nhân trong ticket dưới dạng <em>hợp đồng</em> đã bị phá ("id phải là chuỗi", "thời gian phải có độ lệch") — đó mới là thứ ngăn nhóm sau lặp lại.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Tái hiện lỗi id lớn qua cổng; chứng minh chữ số đổi ở đâu bằng cách so response của Java với response của Node từng byte. Áp dụng cả hai cách sửa.</li>
<li>Chạy <code>gui-cat-doi.mjs</code> vào server lỗi và server đã sửa. Đổi điểm cắt cho rơi vào giữa hai chữ và cho thấy lỗi biến mất — giải thích vì sao.</li>
<li>Giải mã <code>PhÃ²ng</code> trở lại <code>Phòng</code> trong Node (gợi ý: <code>Buffer.from(s, 'latin1').toString('utf8')</code>).</li>
<li>Chạy API với <code>TZ=Asia/Ho_Chi_Minh</code> và <code>TZ=UTC</code>; gửi cùng một body; viết luật API của bạn phải ép.</li>
<li>Trong dịch vụ Spring, tìm lý do thật của từng lỗi 400 trơn trong log; bật <code>fail-on-unknown-properties</code> và quan sát khác biệt.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi lỗi, bạn chỉ ra được đúng chặng mà byte hoặc cách hiểu chúng bị đổi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">MAX_SAFE_INTEGER</span><span class="v">2^53 − 1: số nguyên lớn nhất mà số JS giữ chính xác.</span></div>
  <div class="kv"><span class="k">Id snowflake</span><span class="v">Id 64 bit = thời gian + máy + số thứ tự; thường lớn hơn 2^53.</span></div>
  <div class="kv"><span class="k">Mojibake</span><span class="v">Chữ bị vỡ do giải mã byte bằng sai bảng mã.</span></div>
  <div class="kv"><span class="k">U+FFFD (�)</span><span class="v">Ký tự thay thế cho byte UTF-8 không hợp lệ.</span></div>
  <div class="kv"><span class="k">Độ lệch múi giờ</span><span class="v"><code>Z</code> hoặc <code>+07:00</code> — thứ biến ngày giờ thành một thời điểm.</span></div>
  <div class="kv"><span class="k">415</span><span class="v">Unsupported Media Type — server không đọc Content-Type này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Content-Type quyết định cách đọc body; từ chối sai kiểu một cách rõ ràng.</li>
<li>Id lớn hơn 2^53 phải đi dưới dạng chuỗi; tiền đi dưới dạng chuỗi hoặc số nguyên đơn vị nhỏ nhất.</li>
<li>Giải mã byte đúng một lần; nhận ra mẫu mojibake; xem hex, đừng xem chữ đã hiển thị.</li>
<li>Thời điểm phải có độ lệch; lưu UTC; chỉ đổi lúc hiển thị.</li>
<li>Lỗi 400 trơn của Spring có lý do trong log server; trường lạ mặc định bị lờ đi.</li>
</ul>
${NGUON}
</div>
`,
};
