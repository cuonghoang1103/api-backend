/**
 * 2.4 — jq cho log JSON (soạn 22/11/2026).
 * Output: OUT['s02/jq'] — jq 1.7 (Ubuntu 24.04) trên app/app.jsonl (742 bản ghi kiểu pino) và app/app-hong.jsonl (có một dòng không phải JSON).
 * journalctl -o json / docker logs chỉ ghi dạng lệnh (dạy chạy thật ở Chương 7, 13).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.4 — jq for JSON logs: select, map, group_by, @tsv, slurp|||2.4 — jq cho log JSON: select, map, group_by, @tsv, slurp',
  slug: 'log-2-4-jq',
  type: 'LESSON',
  isFreePreview: true,
  description: 'jq đọc JSON lines từng dòng hay gộp mảng bằng -s; lọc select(.level >= 50), lấy trường lồng .err.code, trường thiếu và toán tử //; đếm bằng group_by + length, trung bình, max_by; xuất @tsv/@csv sang bảng tính; dòng hỏng làm jq dừng và cách bỏ qua bằng -R fromjson?; nối với journalctl -o json và docker logs — chạy thật trên log JSON của app mẫu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>jq for JSON logs: ask for fields by name</h2>
<p class="lead">Modern apps log JSON, one object per line. <code>grep</code> still works on it, but it sees text, not fields: it cannot say "level at least 50" or "the slowest request". <code>jq</code> parses each line and lets you filter, reshape, count and export by field name. Ten filters cover nearly every question you will ask an app log.</p>

<h3>The everyday picture: a form instead of a letter</h3>
<p>A letter says "I, Nguyễn Văn An, born 2004…" somewhere in a paragraph. A form has a box labelled "Name". Searching a stack of forms for everyone born in 2004 is trivial; searching letters is not. JSON logs are forms. jq reads the boxes.</p>

<h3>Step 1 — look at one record</h3>
${lenh('s02/jq', 0)}
<p><code>.</code> is the identity filter ("the whole thing"); <code>-c</code> prints compactly on one line (without it, jq pretty-prints like in lesson 1.2). Nested objects (<code>req</code>, <code>res</code>) are addressed with dots: <code>.req.url</code>, <code>.res.statusCode</code>.</p>

<h3>Step 2 — filter and reshape</h3>
${lenh('s02/jq', 1)}
<p><code>select(condition)</code> keeps only matching records; the pipe <code>|</code> inside jq passes each record to the next filter; <code>{time, msg, code: .err.code}</code> builds a new, smaller object. Use this shape when you want to show someone the essentials.</p>

<h3>Step 3 — raw output and tab-separated rows</h3>
${lenh('s02/jq', 2)}
<p><code>-r</code> prints strings without quotes; <code>[a, b] | @tsv</code> joins fields with tabs — ready for <code>sort</code>, <code>awk</code> or pasting into a spreadsheet. <code>@csv</code> does the same with commas and quotes:</p>
${lenh('s02/jq', 8)}

<h3>Step 4 — missing fields: the // operator</h3>
${lenh('s02/jq', 3)}
<p>Error records have no <code>res</code> object (the request never produced a response), and warnings have no request at all. <code>.res.statusCode</code> is then <code>null</code>; <code>// "-"</code> means "or else <code>-</code>". Always decide what a missing field means before counting: 47 records here are not requests with a status.</p>

<h3>Step 5 — slurp: the whole file as one array</h3>
${lenh('s02/jq', 4)}
${lenh('s02/jq', 5)}
${lenh('s02/jq', 6)}
${lenh('s02/jq', 7)}
<p>Without <code>-s</code>, jq runs your filter once per line. With <code>-s</code> ("slurp") it reads all lines into one array first, so you can count (<code>length</code>), group (<code>group_by(.level)</code> then <code>map({…, count: length})</code>), average (<code>add / length</code>) and find extremes (<code>max_by</code>). Average response time was 81 ms; the slowest query took 3.3 seconds (request <code>req-00056</code> — the next thing you would search for). Slurp loads the whole file into memory: fine for megabytes, think twice for gigabytes.</p>

<h3>Step 6 — when one line is not JSON</h3>
${lenh('s02/jq', 9)}
${lenh('s02/jq', 10)}
<p>A stray line — here an <code>npm WARN</code> printed to the same output — makes jq stop with "parse error" (the error appears first only because error messages are not buffered). Real logs often mix JSON with startup banners or stack traces. <code>-R</code> reads each line as a raw string, and <code>fromjson?</code> parses it if possible and silently skips it if not. Count how many lines you skipped before trusting the result.</p>

<h3>Step 7 — jq with other sources</h3>
<table>
<thead><tr><th>Source</th><th>Command</th><th>Taught in</th></tr></thead>
<tbody>
<tr><td>systemd journal</td><td><code>journalctl -u nginx -o json | jq -r '.MESSAGE'</code></td><td>7.3</td></tr>
<tr><td>Docker container</td><td><code>docker logs api 2&gt;&amp;1 | jq -R 'fromjson? | select(.level &gt;= 50)'</code></td><td>13.1</td></tr>
<tr><td>macOS unified log</td><td><code>log show --last 1h --style ndjson | jq …</code></td><td>6.3</td></tr>
<tr><td>A cloud API response</td><td><code>aws logs filter-log-events … | jq '.events[].message'</code></td><td>13.4</td></tr>
</tbody></table>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Count requests per URL (<code>.req.url</code>) for <code>level == 30</code> records, as TSV sorted by count.</li>
<li>Find the first and last error record's time, converted to UTC ISO (lesson 1.5: <code>.time / 1000 | floor | todate</code>).</li>
<li>How many distinct <code>userId</code> values appear? (<code>select(.userId)</code>, then <code>sort -u</code>.)</li>
<li>Run the <code>-R 'fromjson?'</code> filter on <code>app/app-hong.jsonl</code> and prove one line was skipped (compare <code>wc -l</code> with the number of objects).</li>
</ol>
<p><strong>Done when:</strong> step 2 gives about 07:04:25Z and 07:08:2xZ (the outage window in UTC), step 4 shows 4 lines in and 3 objects out, and you can explain what <code>-r</code>, <code>-c</code>, <code>-s</code> and <code>-R</code> each change.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['filter', 'A jq expression that transforms input into output (., .a.b, select(…)).'],
  ['JSON lines', 'One JSON value per line; jq handles one at a time by default.'],
  ['slurp (-s)', 'Read all inputs into a single array first.'],
  ['raw (-r / -R)', 'Print strings without quotes / read input lines as plain strings.'],
  ['alternative operator //', 'a // b gives b when a is null or false.'],
  ['@tsv / @csv', 'Format an array as a tab- or comma-separated row.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>jq reads fields by name: <code>.level</code>, <code>.err.code</code>; <code>-c</code> compact, <code>-r</code> raw.</li>
<li><code>select()</code> filters, <code>{…}</code> reshapes, <code>@tsv</code>/<code>@csv</code> export.</li>
<li>Handle missing fields deliberately with <code>//</code>.</li>
<li><code>-s</code> + <code>length</code>, <code>group_by</code>, <code>add / length</code>, <code>max_by</code> for whole-file statistics (memory permitting).</li>
<li>Mixed logs: <code>jq -R 'fromjson?'</code> skips non-JSON lines — count what you skipped.</li>
</ul>
${nguon('📘', 'jq 1.7 Manual', 'Filters, select, group_by, @tsv, --slurp, --raw-input, fromjson', 'https://jqlang.org/manual/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-1-tu-console-toi-json', title: 'Observability 1.1 — from console.log to JSON', sub: 'Producing the JSON logs you query here', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>jq cho log JSON: hỏi trường theo tên</h2>
<p class="lead">App đời mới ghi log JSON, mỗi dòng một đối tượng. <code>grep</code> vẫn dùng được, nhưng nó thấy chữ chứ không thấy trường: nó không nói được "mức từ 50 trở lên" hay "request chậm nhất". <code>jq</code> phân tích từng dòng và cho bạn lọc, đổi hình, đếm, xuất ra theo tên trường. Mười bộ lọc là đủ cho gần như mọi câu hỏi bạn sẽ hỏi log của app.</p>

<h3>Liên tưởng đời thường: tờ khai thay cho lá thư</h3>
<p>Một lá thư viết "Tôi là Nguyễn Văn An, sinh năm 2004…" ở đâu đó trong một đoạn văn. Tờ khai thì có ô ghi "Họ tên". Tìm trong chồng tờ khai mọi người sinh năm 2004 thì dễ ợt; tìm trong chồng thư thì không. Log JSON là tờ khai. jq đọc các ô.</p>

<h3>Bước 1 — xem một bản ghi</h3>
${lenh('s02/jq', 0)}
<p><code>.</code> là bộ lọc đồng nhất ("nguyên cả cái"); <code>-c</code> in gọn trên một dòng (bỏ đi thì jq in đẹp như ở bài 1.2). Đối tượng lồng nhau (<code>req</code>, <code>res</code>) truy cập bằng dấu chấm: <code>.req.url</code>, <code>.res.statusCode</code>.</p>

<h3>Bước 2 — lọc và đổi hình</h3>
${lenh('s02/jq', 1)}
<p><code>select(điều kiện)</code> chỉ giữ bản ghi khớp; dấu ống <code>|</code> bên trong jq chuyển từng bản ghi sang bộ lọc kế tiếp; <code>{time, msg, code: .err.code}</code> dựng một đối tượng mới, nhỏ hơn. Dùng dạng này khi muốn cho người khác xem phần cốt lõi.</p>

<h3>Bước 3 — output thô và hàng ngăn bằng tab</h3>
${lenh('s02/jq', 2)}
<p><code>-r</code> in chuỗi không có dấu nháy; <code>[a, b] | @tsv</code> nối các trường bằng tab — sẵn sàng cho <code>sort</code>, <code>awk</code> hay dán vào bảng tính. <code>@csv</code> làm tương tự với dấu phẩy và dấu nháy:</p>
${lenh('s02/jq', 8)}

<h3>Bước 4 — trường bị thiếu: toán tử //</h3>
${lenh('s02/jq', 3)}
<p>Bản ghi lỗi không có đối tượng <code>res</code> (request chưa kịp có phản hồi), còn cảnh báo thì không có request nào. Khi đó <code>.res.statusCode</code> là <code>null</code>; <code>// "-"</code> nghĩa là "nếu không thì <code>-</code>". Luôn quyết định trường thiếu nghĩa là gì trước khi đếm: 47 bản ghi ở đây không phải request có mã trạng thái.</p>

<h3>Bước 5 — slurp: cả tệp thành một mảng</h3>
${lenh('s02/jq', 4)}
${lenh('s02/jq', 5)}
${lenh('s02/jq', 6)}
${lenh('s02/jq', 7)}
<p>Không có <code>-s</code>, jq chạy bộ lọc của bạn mỗi dòng một lần. Có <code>-s</code> ("slurp" — hút hết) nó đọc mọi dòng vào một mảng trước, nên bạn đếm được (<code>length</code>), gom nhóm được (<code>group_by(.level)</code> rồi <code>map({…, count: length})</code>), tính trung bình (<code>add / length</code>) và tìm cực trị (<code>max_by</code>). Thời gian phản hồi trung bình là 81 ms; truy vấn chậm nhất mất 3,3 giây (request <code>req-00056</code> — thứ tiếp theo bạn sẽ đi tìm). Slurp nạp cả tệp vào bộ nhớ: ổn với vài megabyte, nghĩ kỹ với gigabyte.</p>

<h3>Bước 6 — khi một dòng không phải JSON</h3>
${lenh('s02/jq', 9)}
${lenh('s02/jq', 10)}
<p>Một dòng lạc — ở đây là <code>npm WARN</code> in ra cùng output — làm jq dừng với "parse error" (thông báo lỗi hiện lên trước chỉ vì thông điệp lỗi không bị đệm). Log thật hay trộn JSON với dòng chào lúc khởi động hoặc stack trace. <code>-R</code> đọc mỗi dòng như một chuỗi thô, còn <code>fromjson?</code> phân tích nếu được và lặng lẽ bỏ qua nếu không. Hãy đếm xem đã bỏ qua bao nhiêu dòng trước khi tin kết quả.</p>

<h3>Bước 7 — jq với các nguồn khác</h3>
<table>
<thead><tr><th>Nguồn</th><th>Lệnh</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>Journal của systemd</td><td><code>journalctl -u nginx -o json | jq -r '.MESSAGE'</code></td><td>7.3</td></tr>
<tr><td>Container Docker</td><td><code>docker logs api 2&gt;&amp;1 | jq -R 'fromjson? | select(.level &gt;= 50)'</code></td><td>13.1</td></tr>
<tr><td>Unified log của macOS</td><td><code>log show --last 1h --style ndjson | jq …</code></td><td>6.3</td></tr>
<tr><td>Phản hồi API của cloud</td><td><code>aws logs filter-log-events … | jq '.events[].message'</code></td><td>13.4</td></tr>
</tbody></table>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Đếm request theo URL (<code>.req.url</code>) với các bản ghi <code>level == 30</code>, xuất TSV xếp theo số đếm.</li>
<li>Tìm thời điểm của bản ghi lỗi đầu tiên và cuối cùng, đổi sang ISO theo UTC (bài 1.5: <code>.time / 1000 | floor | todate</code>).</li>
<li>Có bao nhiêu giá trị <code>userId</code> khác nhau? (<code>select(.userId)</code>, rồi <code>sort -u</code>.)</li>
<li>Chạy bộ lọc <code>-R 'fromjson?'</code> trên <code>app/app-hong.jsonl</code> và chứng minh có một dòng bị bỏ qua (so <code>wc -l</code> với số đối tượng ra).</li>
</ol>
<p><strong>Đạt khi:</strong> bước 2 ra khoảng 07:04:25Z và 07:08:2xZ (cửa sổ sự cố theo UTC), bước 4 cho thấy 4 dòng vào và 3 đối tượng ra, và bạn giải thích được <code>-r</code>, <code>-c</code>, <code>-s</code>, <code>-R</code> mỗi cái thay đổi gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['filter (bộ lọc)', 'Một biểu thức jq biến đầu vào thành đầu ra (., .a.b, select(…)).'],
  ['JSON lines', 'Mỗi dòng một giá trị JSON; mặc định jq xử lý từng cái một.'],
  ['slurp (-s)', 'Đọc mọi đầu vào thành một mảng duy nhất trước.'],
  ['raw (-r / -R) (thô)', 'In chuỗi không có dấu nháy / đọc dòng đầu vào như chuỗi thường.'],
  ['alternative operator // (toán tử thay thế)', 'a // b cho ra b khi a là null hoặc false.'],
  ['@tsv / @csv', 'Định dạng một mảng thành hàng ngăn bằng tab hoặc dấu phẩy.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>jq đọc trường theo tên: <code>.level</code>, <code>.err.code</code>; <code>-c</code> gọn, <code>-r</code> thô.</li>
<li><code>select()</code> lọc, <code>{…}</code> đổi hình, <code>@tsv</code>/<code>@csv</code> xuất ra.</li>
<li>Xử lý trường thiếu có chủ đích bằng <code>//</code>.</li>
<li><code>-s</code> + <code>length</code>, <code>group_by</code>, <code>add / length</code>, <code>max_by</code> cho thống kê cả tệp (nếu đủ bộ nhớ).</li>
<li>Log lẫn lộn: <code>jq -R 'fromjson?'</code> bỏ qua dòng không phải JSON — đếm những gì đã bỏ qua.</li>
</ul>
${nguon('📘', 'jq 1.7 Manual', 'Bộ lọc, select, group_by, @tsv, --slurp, --raw-input, fromjson', 'https://jqlang.org/manual/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-1-tu-console-toi-json', title: 'Observability 1.1 — từ console.log tới JSON', sub: 'Sinh ra log JSON mà bạn truy vấn ở đây' })}
</div>
`,
};
