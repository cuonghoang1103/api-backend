/**
 * 1.4 — Định dạng log (soạn 22/11/2026).
 * Output: OUT['s01/dinh-dang'] — MỘT sự kiện (đăng nhập SSH sai mật khẩu) ở sáu định dạng trong formats/ của gói mẫu, đọc bằng cut/jq/grep/awk.
 * Nguồn: RFC 3164, RFC 5424 (HEADER: PRI VERSION TIMESTAMP HOSTNAME APP-NAME PROCID MSGID, SD-ID "origin" đăng ký IANA),
 * logfmt (brandur.org/logfmt), ArcSight CEF (CEF:Version|Vendor|Product|Version|SignatureID|Name|Severity|Extension),
 * Microsoft Learn (Windows Event Log XML schema), systemd Journal File Format.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.4 — Log formats: plain text, syslog RFC 3164/5424, JSON lines, logfmt, CEF, EVTX, binary journal|||1.4 — Định dạng log: văn bản thường, syslog RFC 3164/5424, JSON lines, logfmt, CEF, EVTX, journal nhị phân',
  slug: 'log-1-4-dinh-dang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một sự kiện "đăng nhập SSH sai mật khẩu" viết theo sáu định dạng (RFC 3164, RFC 5424, JSON lines, logfmt, CEF, XML của sự kiện Windows 4625) và cách rút trường từ mỗi loại bằng cut, jq, grep, awk — chạy thật; vì sao EVTX và journal lưu nhị phân (chỉ mục, toàn vẹn) và cách đổi sang chữ (wevtutil, Get-WinEvent ToXml, journalctl -o json); góc hacker: log văn bản thường dễ sửa tay hơn log có chuỗi băm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Log formats: the same event, six ways — and which tool reads each</h2>
<p class="lead">A failed SSH login is a failed SSH login, whatever format records it. To show that, the sample pack contains <em>one</em> event — user <code>an</code> typed a wrong password from <code>203.0.113.66</code> — written in six formats. You will read each with the tool that suits it, see what each format can and cannot express, and learn why Windows and systemd store logs in binary files you cannot <code>cat</code>.</p>

<h3>The everyday picture: one invoice, many shapes</h3>
<p>A shop can give you the same purchase as a handwritten note, a printed receipt, a PDF, or an e-invoice file your accountant's software imports. The handwritten note is easy for you, impossible for software. The e-invoice is the opposite. Log formats sit on the same scale, from "human-friendly" to "machine-friendly".</p>
${lenh('s01/dinh-dang', 0)}

<h3>Format 1 and 2 — syslog: RFC 3164 versus RFC 5424</h3>
${lenh('s01/dinh-dang', 1)}
<table>
<thead><tr><th>Part</th><th>RFC 3164 ("BSD syslog")</th><th>RFC 5424</th></tr></thead>
<tbody>
<tr><td>Priority</td><td><code>&lt;38&gt;</code> (auth.info — lesson 1.3)</td><td><code>&lt;38&gt;</code> followed by version <code>1</code></td></tr>
<tr><td>Time</td><td><code>Nov 20 02:10:03</code> — <strong>no year, no time zone, no fraction of a second</strong></td><td><code>2026-11-20T02:10:03.512+07:00</code> — RFC 3339</td></tr>
<tr><td>Host, program, PID</td><td><code>web-01 sshd[41001]:</code> by convention</td><td>Separate fields: <code>web-01 sshd 41001</code>, then MSGID (<code>-</code> = none)</td></tr>
<tr><td>Structured data</td><td>None</td><td><code>[origin ip="10.0.0.10"]</code> — named key="value" blocks</td></tr>
</tbody></table>
<p>Because RFC 5424 has a fixed field order separated by spaces, the first fields can be cut reliably:</p>
${lenh('s01/dinh-dang', 2)}
<p>The files in <code>/var/log</code> on many distributions still look like 3164 (as in the pack's <code>linux/auth.log</code>), and many routers and older devices send 3164 over the network. When you meet a line with no year, ask: <em>which year, and which zone, did the writer mean?</em> (lesson 1.5).</p>

<h3>Format 3 — JSON lines</h3>
<p>One JSON object per line (also called NDJSON or JSONL). Each field has a name and a type, values can be nested, and order does not matter. <code>jq</code> (lesson 2.4) asks for fields by name:</p>
${lenh('s01/dinh-dang', 3)}
<p>Cost: lines are long and noisy for the eye, and a single unescaped quote or newline from a buggy logger breaks the line for every tool. Most modern apps (pino, logback with a JSON encoder, cloud services) write JSON lines.</p>

<h3>Format 4 — logfmt</h3>
<p><code>key=value</code> pairs separated by spaces, quotes only when a value contains spaces. Readable by people <em>and</em> easy to parse; used by Heroku, Grafana Loki and many Go programs. Plain <code>grep</code> already pulls fields out:</p>
${lenh('s01/dinh-dang', 4)}

<h3>Format 5 — CEF (Common Event Format)</h3>
<p>Security devices (firewalls, IDS, antivirus consoles) often speak CEF, created by ArcSight: seven fields separated by <code>|</code>, then an extension of <code>key=value</code> pairs. Its relative LEEF (IBM QRadar) is similar. Split on the pipe:</p>
${lenh('s01/dinh-dang', 5)}
<p>The header is <code>CEF:Version|Vendor|Product|Version|Signature ID|Name|Severity</code>; severity here runs 0–10, <em>bigger is worse</em> — yet another scale to translate.</p>

<h3>Format 6 — a Windows event as XML (from EVTX)</h3>
<p>Windows stores events in binary <code>.evtx</code> files, but every event can be rendered as XML. This is the Windows equivalent of our failed login, event 4625 (fields trimmed for the lesson — a real 4625 has about twenty <code>Data</code> fields):</p>
${lenh('s01/dinh-dang', 6)}
<p>The <code>System</code> block is the same for every event (provider, EventID, level, time in UTC, computer); <code>EventData</code> differs per event ID. Chapter 5 queries these names directly with XPath. Notice the time: <code>2026-11-19T19:10:03.512Z</code> — the previous day in UTC, the same instant as 02:10:03 in Vietnam.</p>

<h3>Same event, six files — check it</h3>
${lenh('s01/dinh-dang', 7)}
<p>Five files contain the words "Failed password"; the Windows XML contains none — Windows records the <em>status code</em> <code>0xc000006d</code> (bad user name or password) instead of a sentence. Text searches that work on one format silently miss another: search by fields, not by phrases, when you can.</p>

<h3>Binary logs: why EVTX and the journal are not text</h3>
<ul>
<li><strong>Speed:</strong> both keep indexes, so "events from provider X in the last hour" does not read the whole file.</li>
<li><strong>Structure:</strong> every field survives with its type; nothing depends on spaces or quotes.</li>
<li><strong>Integrity and size:</strong> the journal hashes its entries and can seal them (<code>journalctl --verify</code>, Chapter 7); records are compressed.</li>
<li><strong>Price:</strong> you need the right tool to read them — and a damaged file is harder to salvage.</li>
</ul>
<table>
<thead><tr><th>Binary store</th><th>To text / JSON</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Windows <code>.evtx</code></td><td><code>wevtutil qe System /c:5 /f:xml</code>; <code>(Get-WinEvent -LogName System -MaxEvents 1).ToXml()</code></td><td>5</td></tr>
<tr><td>systemd journal</td><td><code>journalctl -o json</code>, <code>-o json-pretty</code>, <code>-o export</code></td><td>7</td></tr>
<tr><td>macOS unified log</td><td><code>log show --style json</code></td><td>6</td></tr>
<tr><td><code>/var/log/wtmp</code>, <code>btmp</code></td><td><code>last</code>, <code>lastb</code></td><td>8</td></tr>
</tbody></table>

<h3>🕵️ Hacker's corner — plain text is easy to forge</h3>
<p>Anyone with write access to <code>/var/log/auth.log</code> can delete one line with a text editor, and nothing in the file shows that a line is missing. Binary stores raise the bar: the journal's hash chain makes edits detectable with <code>--verify</code>, and Windows logs event 1102 when the Security log is cleared. Neither stops an administrator-level attacker from destroying the file — which is why the real defence is shipping logs off the machine (Chapter 15). Also note the opposite trick, <em>log injection</em>: if an app writes user input into a plain text log without escaping, a "username" containing a newline can create a fake second line. JSON writers escape newlines as <code>\\n</code>, which is one more reason to prefer them.</p>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok"><ol>
<li>In the pack, run <code>cat formats/*</code> and, for each file, write the format name and where the time zone is (or that there is none).</li>
<li>Extract the <em>source port</em> from three files using three different tools: <code>jq</code> on <code>json.log</code>, <code>grep -o</code> on <code>logfmt.log</code>, <code>awk</code> or <code>grep</code> on <code>cef.log</code>.</li>
<li>On your own machine: Windows — run <code>wevtutil qe System /c:1 /rd:true /f:xml</code> in a terminal; Linux/WSL — <code>journalctl -n 1 -o json-pretty</code>. Find the timestamp field and the source field in the output.</li>
</ol>
<p><strong>Done when:</strong> you got <code>51515</code> three times with three tools, and you located the time and source fields in one real event from your own machine.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['RFC 3164 / RFC 5424', 'The old (descriptive) and the current (standard) syslog message formats.'],
  ['structured data (SD)', 'RFC 5424 blocks like [origin ip="…"] carrying named values.'],
  ['JSON lines (NDJSON)', 'One JSON object per line.'],
  ['logfmt', 'key=value pairs separated by spaces.'],
  ['CEF / LEEF', 'Pipe-separated event formats used by security products.'],
  ['EVTX', 'Windows’ binary event log file format, rendered as XML.'],
  ['journal', 'systemd’s binary, indexed log store, read with journalctl.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>One event can be written as RFC 3164, RFC 5424, JSON, logfmt, CEF or a Windows XML event — the facts stay the same.</li>
<li>RFC 3164 lacks year and time zone; RFC 5424 has both plus structured data.</li>
<li>Pick the tool for the format: <code>cut</code>/<code>awk</code> for fixed fields, <code>jq</code> for JSON, <code>grep -o</code> for logfmt, XPath for Windows XML.</li>
<li>Phrase searches miss formats that record codes instead of sentences; search by fields when possible.</li>
<li>Binary stores (EVTX, journal) give speed, structure and tamper evidence, and convert to text on demand.</li>
</ul>
${nguon('📘', 'RFC 5424 — The Syslog Protocol', 'Header fields, structured data, IANA-registered SD-IDs', 'https://www.rfc-editor.org/rfc/rfc5424')}
${nguon('📘', 'RFC 3164 — The BSD syslog Protocol', 'The older format described as observed in practice', 'https://www.rfc-editor.org/rfc/rfc3164')}
${nguon('📗', 'brandur.org — logfmt', 'The short article that named and described logfmt', 'https://brandur.org/logfmt')}
${nguon('📘', 'Microsoft Learn — wevtutil', 'Query events and export them as XML from the command line', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil')}
${nguon('📘', 'systemd — Journal File Format', 'How the journal stores, indexes and hashes entries', 'https://systemd.io/JOURNAL_FILE_FORMAT/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-1-tu-console-toi-json', title: 'Observability 1.1 — from console.log to JSON', sub: 'Why and how apps should write structured logs', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Định dạng log: cùng một sự kiện, sáu cách viết — và công cụ nào đọc cách nào</h2>
<p class="lead">Một lần đăng nhập SSH sai mật khẩu vẫn là một lần đăng nhập sai, dù được ghi theo định dạng nào. Để thấy điều đó, gói log mẫu chứa <em>một</em> sự kiện — người dùng <code>an</code> gõ sai mật khẩu từ <code>203.0.113.66</code> — viết theo sáu định dạng. Bạn sẽ đọc mỗi định dạng bằng công cụ hợp với nó, thấy mỗi định dạng diễn đạt được gì và không được gì, và hiểu vì sao Windows và systemd lưu log trong tệp nhị phân không <code>cat</code> được.</p>

<h3>Liên tưởng đời thường: một hoá đơn, nhiều hình dạng</h3>
<p>Cùng một lần mua hàng, cửa hàng có thể đưa bạn tờ ghi tay, tờ hoá đơn in, tệp PDF, hay tệp hoá đơn điện tử mà phần mềm kế toán nhập được. Tờ ghi tay dễ với bạn, phần mềm thì chịu. Hoá đơn điện tử thì ngược lại. Các định dạng log nằm trên cùng một thang đó, từ "dễ cho người" tới "dễ cho máy".</p>
${lenh('s01/dinh-dang', 0)}

<h3>Định dạng 1 và 2 — syslog: RFC 3164 và RFC 5424</h3>
${lenh('s01/dinh-dang', 1)}
<table>
<thead><tr><th>Phần</th><th>RFC 3164 ("BSD syslog")</th><th>RFC 5424</th></tr></thead>
<tbody>
<tr><td>Ưu tiên</td><td><code>&lt;38&gt;</code> (auth.info — bài 1.3)</td><td><code>&lt;38&gt;</code> rồi số phiên bản <code>1</code></td></tr>
<tr><td>Thời điểm</td><td><code>Nov 20 02:10:03</code> — <strong>không năm, không múi giờ, không phần lẻ của giây</strong></td><td><code>2026-11-20T02:10:03.512+07:00</code> — theo RFC 3339</td></tr>
<tr><td>Máy, chương trình, PID</td><td><code>web-01 sshd[41001]:</code> theo quy ước</td><td>Trường riêng: <code>web-01 sshd 41001</code>, rồi MSGID (<code>-</code> = không có)</td></tr>
<tr><td>Dữ liệu cấu trúc</td><td>Không có</td><td><code>[origin ip="10.0.0.10"]</code> — các khối key="value" có tên</td></tr>
</tbody></table>
<p>Vì RFC 5424 có thứ tự trường cố định, ngăn bằng dấu cách, nên cắt các trường đầu là chắc ăn:</p>
${lenh('s01/dinh-dang', 2)}
<p>Tệp trong <code>/var/log</code> ở nhiều bản phân phối vẫn trông như 3164 (như <code>linux/auth.log</code> trong gói mẫu), và nhiều router, thiết bị cũ gửi 3164 qua mạng. Gặp một dòng không có năm, hãy hỏi: <em>người viết muốn nói năm nào, múi giờ nào?</em> (bài 1.5).</p>

<h3>Định dạng 3 — JSON lines</h3>
<p>Mỗi dòng một đối tượng JSON (còn gọi là NDJSON hay JSONL). Mỗi trường có tên và kiểu, giá trị lồng nhau được, thứ tự không quan trọng. <code>jq</code> (bài 2.4) hỏi trường theo tên:</p>
${lenh('s01/dinh-dang', 3)}
<p>Cái giá: dòng dài và rối mắt, và chỉ một dấu nháy hay ký tự xuống dòng không được thoát từ một bộ ghi log lỗi là hỏng dòng đó với mọi công cụ. Phần lớn app đời mới (pino, logback có bộ mã hoá JSON, dịch vụ cloud) ghi JSON lines.</p>

<h3>Định dạng 4 — logfmt</h3>
<p>Các cặp <code>key=value</code> cách nhau bằng dấu cách, chỉ dùng nháy khi giá trị có dấu cách. Người đọc được <em>và</em> máy tách dễ; Heroku, Grafana Loki và nhiều chương trình Go dùng. Chỉ <code>grep</code> thôi đã rút được trường:</p>
${lenh('s01/dinh-dang', 4)}

<h3>Định dạng 5 — CEF (Common Event Format)</h3>
<p>Thiết bị bảo mật (tường lửa, IDS, bảng điều khiển antivirus) hay nói CEF, do ArcSight đặt ra: bảy trường ngăn bằng <code>|</code>, rồi phần mở rộng gồm các cặp <code>key=value</code>. Anh em của nó là LEEF (IBM QRadar) cũng tương tự. Tách theo dấu gạch đứng:</p>
${lenh('s01/dinh-dang', 5)}
<p>Phần đầu là <code>CEF:Version|Vendor|Product|Version|Signature ID|Name|Severity</code>; severity ở đây chạy 0–10, <em>số lớn là tệ</em> — thêm một thang nữa phải dịch.</p>

<h3>Định dạng 6 — một sự kiện Windows dạng XML (từ EVTX)</h3>
<p>Windows lưu sự kiện trong tệp nhị phân <code>.evtx</code>, nhưng sự kiện nào cũng hiển thị được thành XML. Đây là bản tương đương trên Windows của lần đăng nhập hỏng, sự kiện 4625 (đã rút gọn trường cho bài học — một 4625 thật có khoảng hai mươi trường <code>Data</code>):</p>
${lenh('s01/dinh-dang', 6)}
<p>Khối <code>System</code> giống nhau ở mọi sự kiện (provider, EventID, mức, thời điểm theo UTC, tên máy); <code>EventData</code> thay đổi theo từng mã sự kiện. Chương 5 truy vấn thẳng các tên này bằng XPath. Để ý thời điểm: <code>2026-11-19T19:10:03.512Z</code> — theo UTC vẫn là ngày hôm trước, nhưng cùng một khoảnh khắc với 02:10:03 ở Việt Nam.</p>

<h3>Cùng một sự kiện, sáu tệp — kiểm thử</h3>
${lenh('s01/dinh-dang', 7)}
<p>Năm tệp có cụm "Failed password"; tệp XML của Windows thì không — Windows ghi <em>mã trạng thái</em> <code>0xc000006d</code> (sai tên đăng nhập hoặc mật khẩu) thay cho một câu chữ. Cách tìm theo chữ chạy được với định dạng này sẽ lặng lẽ bỏ sót định dạng khác: khi có thể, tìm theo trường, đừng tìm theo câu.</p>

<h3>Log nhị phân: vì sao EVTX và journal không phải chữ</h3>
<ul>
<li><strong>Tốc độ:</strong> cả hai có chỉ mục, nên "sự kiện của provider X trong một giờ qua" không phải đọc cả tệp.</li>
<li><strong>Cấu trúc:</strong> trường nào cũng giữ nguyên kèm kiểu; không gì phụ thuộc vào dấu cách hay dấu nháy.</li>
<li><strong>Toàn vẹn và dung lượng:</strong> journal băm các bản ghi và có thể niêm phong (<code>journalctl --verify</code>, Chương 7); bản ghi được nén.</li>
<li><strong>Cái giá:</strong> phải có đúng công cụ mới đọc được — và tệp hỏng thì khó cứu hơn.</li>
</ul>
<table>
<thead><tr><th>Kho nhị phân</th><th>Đổi sang chữ / JSON</th><th>Chương</th></tr></thead>
<tbody>
<tr><td><code>.evtx</code> của Windows</td><td><code>wevtutil qe System /c:5 /f:xml</code>; <code>(Get-WinEvent -LogName System -MaxEvents 1).ToXml()</code></td><td>5</td></tr>
<tr><td>Journal của systemd</td><td><code>journalctl -o json</code>, <code>-o json-pretty</code>, <code>-o export</code></td><td>7</td></tr>
<tr><td>Unified log của macOS</td><td><code>log show --style json</code></td><td>6</td></tr>
<tr><td><code>/var/log/wtmp</code>, <code>btmp</code></td><td><code>last</code>, <code>lastb</code></td><td>8</td></tr>
</tbody></table>

<h3>🕵️ Góc hacker — chữ thường thì dễ làm giả</h3>
<p>Ai có quyền ghi vào <code>/var/log/auth.log</code> đều xoá được một dòng bằng trình soạn thảo, và trong tệp chẳng có gì cho thấy thiếu một dòng. Kho nhị phân nâng rào cản: chuỗi băm của journal làm việc sửa bị phát hiện bằng <code>--verify</code>, còn Windows ghi sự kiện 1102 khi nhật ký Security bị xoá. Không cái nào ngăn được kẻ đã có quyền quản trị phá huỷ cả tệp — vì thế phòng thủ thật sự là đẩy log ra khỏi máy (Chương 15). Cũng để ý chiêu ngược lại, <em>log injection (chèn log)</em>: nếu app ghi dữ liệu người dùng nhập vào log chữ thường mà không thoát ký tự, một "tên đăng nhập" chứa ký tự xuống dòng có thể tạo ra một dòng giả thứ hai. Bộ ghi JSON thoát ký tự xuống dòng thành <code>\\n</code> — thêm một lý do để chọn nó.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Trong gói mẫu, chạy <code>cat formats/*</code> và với từng tệp, ghi tên định dạng và múi giờ nằm ở đâu (hoặc không có).</li>
<li>Rút <em>cổng nguồn (source port)</em> từ ba tệp bằng ba công cụ khác nhau: <code>jq</code> với <code>json.log</code>, <code>grep -o</code> với <code>logfmt.log</code>, <code>awk</code> hoặc <code>grep</code> với <code>cef.log</code>.</li>
<li>Trên máy của bạn: Windows — chạy <code>wevtutil qe System /c:1 /rd:true /f:xml</code> trong terminal; Linux/WSL — <code>journalctl -n 1 -o json-pretty</code>. Tìm trường thời điểm và trường nguồn trong output.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn lấy được <code>51515</code> ba lần bằng ba công cụ, và chỉ ra được trường thời điểm và trường nguồn trong một sự kiện thật trên máy mình.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['RFC 3164 / RFC 5424', 'Định dạng thông điệp syslog kiểu cũ (mô tả thực tế) và kiểu hiện hành (chuẩn).'],
  ['structured data (dữ liệu cấu trúc)', 'Các khối RFC 5424 như [origin ip="…"] chứa giá trị có tên.'],
  ['JSON lines (NDJSON)', 'Mỗi dòng một đối tượng JSON.'],
  ['logfmt', 'Các cặp key=value cách nhau bằng dấu cách.'],
  ['CEF / LEEF', 'Định dạng sự kiện ngăn bằng dấu | của các sản phẩm bảo mật.'],
  ['EVTX', 'Định dạng tệp nhật ký sự kiện nhị phân của Windows, hiển thị thành XML.'],
  ['journal', 'Kho log nhị phân có chỉ mục của systemd, đọc bằng journalctl.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một sự kiện có thể viết thành RFC 3164, RFC 5424, JSON, logfmt, CEF hay sự kiện XML của Windows — sự thật vẫn thế.</li>
<li>RFC 3164 thiếu năm và múi giờ; RFC 5424 có cả hai cùng dữ liệu cấu trúc.</li>
<li>Chọn công cụ theo định dạng: <code>cut</code>/<code>awk</code> cho trường cố định, <code>jq</code> cho JSON, <code>grep -o</code> cho logfmt, XPath cho XML của Windows.</li>
<li>Tìm theo câu chữ sẽ bỏ sót định dạng ghi mã thay vì câu; khi có thể, tìm theo trường.</li>
<li>Kho nhị phân (EVTX, journal) cho tốc độ, cấu trúc và dấu vết khi bị sửa, và đổi sang chữ khi cần.</li>
</ul>
${nguon('📘', 'RFC 5424 — The Syslog Protocol', 'Các trường phần đầu, dữ liệu cấu trúc, SD-ID đăng ký với IANA', 'https://www.rfc-editor.org/rfc/rfc5424')}
${nguon('📘', 'RFC 3164 — The BSD syslog Protocol', 'Định dạng cũ, mô tả theo thực tế đang dùng', 'https://www.rfc-editor.org/rfc/rfc3164')}
${nguon('📗', 'brandur.org — logfmt', 'Bài viết ngắn đặt tên và mô tả logfmt', 'https://brandur.org/logfmt')}
${nguon('📘', 'Microsoft Learn — wevtutil', 'Truy vấn sự kiện và xuất ra XML từ dòng lệnh', 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil')}
${nguon('📘', 'systemd — Journal File Format', 'Journal lưu, đánh chỉ mục và băm bản ghi thế nào', 'https://systemd.io/JOURNAL_FILE_FORMAT/')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-1-1-tu-console-toi-json', title: 'Observability 1.1 — từ console.log tới JSON', sub: 'Vì sao và cách app nên ghi log có cấu trúc' })}
</div>
`,
};
